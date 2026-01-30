// app/lib/actions.ts
'use server';


import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { AddressSchema, SignSchema } from './schema';
import bcrypt from 'bcryptjs';
import { sql } from './data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ActionResult } from './definitions';

// State 타입 정의: 에러 메시지와 필드별 에러를 포함
export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};



/**
 * 장바구니 수량 조절 함수
 * @param userId - 유저 UUID
 * @param productId - 상품 UUID
 * @param quantity - 변경할 최종 수량
 */
export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number
) {
  try {
    // 1. 수량이 0 이하이거나, 값이 비정상적(NaN, null 등)일 경우 -> "삭제"
    if (!quantity) {
      return;
    }
    if (quantity <= 0) {
      await sql`
        DELETE FROM carts
        WHERE user_id = ${userId} AND product_id = ${productId}
      `;
      console.log(`[Cart] Item removed: ${productId}`);
    }
    // 2. 수량이 1 이상일 경우 -> "업데이트"
    else {
      await sql`
        UPDATE carts
        SET quantity = ${quantity}
        WHERE user_id = ${userId} AND product_id = ${productId}
      `;
      console.log(`[Cart] Quantity updated: ${productId} -> ${quantity}`);
    }

    // 3. UI 갱신 (장바구니 페이지)
    revalidatePath('/cart');

  } catch (error) {
    console.error('[Cart Error] Failed to update quantity:', error);
    throw new Error('장바구니 수량 변경에 실패했습니다.');
  }
}


// [Modified] 클라이언트에서 가격을 받지 않고 주소 ID만 받음
export async function createOrder(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Login required." };
  }

  const userId = session.user.id;

  try {
    // [Modified] db.connect() 대신 sql.begin 사용
    // 트랜잭션 시작: 이 블록 안의 쿼리(tx)는 모두 하나의 트랜잭션으로 묶입니다.
    // 에러가 발생하면 자동으로 ROLLBACK 됩니다.
    return await sql.begin(async (tx) => {

      // 1. 장바구니 확인
      const cartCheck = await tx`SELECT count(*) FROM carts WHERE user_id = ${userId}`;
      if (cartCheck[0].count === '0') {
        // [Modified] 로직상 실패이므로 에러를 던져서 롤백시키거나, 명시적으로 리턴
        // 여기서는 에러를 던져서 catch 블록으로 보내는 것이 트랜잭션 취소에 안전합니다.
        throw new Error("Your cart is empty.");
      }

      // 2. 총액 계산 (DB 데이터 기반 - 보안 강화)
      const calcResult = await tx`
        SELECT SUM(c.quantity * p.price) as subtotal
        FROM carts c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ${userId}
      `;

      const subtotal = Number(calcResult[0].subtotal || 0);
      const taxRate = 0.02;
      const totalAmount = subtotal + (subtotal * taxRate);

      // 3. 주문 생성 (Orders)
      const insertOrderResult = await tx`
        INSERT INTO orders (user_id, address_id, total_amount, status)
        VALUES (${userId}, ${addressId}, ${totalAmount}, 'PAID')
        RETURNING id
      `;
      const orderId = insertOrderResult[0].id;

      // 4. 아이템 복사 (Carts -> Order Items)
      // 주문 시점의 가격(p.price)을 저장합니다.
      await tx`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        SELECT ${orderId}, c.product_id, c.quantity, p.price
        FROM carts c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ${userId}
      `;

      // 5. 장바구니 비우기
      await tx`DELETE FROM carts WHERE user_id = ${userId}`;

      // 6. 캐시 갱신 (트랜잭션 성공 확정 직전 수행)
      revalidatePath('/cart');
      revalidatePath('/my-orders');

      return { success: true, message: "Order placed successfully!" };
    });

  } catch (error) {
    // [Modified] sql.begin 내부에서 에러 발생 시 자동으로 롤백된 후 여기로 옴
    console.error('Order Transaction Error:', error);

    // 에러 메시지 추출 (사용자 정의 에러 or 시스템 에러)
    const errorMessage = error instanceof Error ? error.message : "Failed to place order.";

    return { success: false, message: errorMessage };
  }
}

export async function removeItem(formData: FormData) {
  const session = await auth();
  const productId = formData.get('productId')?.toString();
  if (session?.user.id && productId) {
    try {
      await sql`
      DELETE FROM carts
        WHERE user_id = ${session.user.id} 
        AND product_id = ${productId};
    `
    } catch (error) {
      console.error('Databse Error :', error);
    }
    console.log(`Deleting product: ${productId}`);
    revalidatePath('/cart'); //
  }
  return
}


export async function authenticate(
  prevState: State | undefined,
  formData: FormData,
) {
  // 1. Zod를 사용하여 폼 데이터 검증
  const validatedFields = SignSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // 2. 검증 실패 시: NextAuth를 호출하지 않고 바로 에러 반환
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Sign In.',
    };
  }

  try {
    // 이미 검증된 데이터를 사용하거나 formData를 그대로 넘김
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials.' };
        default:
          return { message: 'Something went wrong.' };
      }
    }
    throw error;
  }
}

export async function createAccount(
  prevState: State | undefined,
  formData: FormData,
) {
  // 1. Zod를 사용하여 폼 데이터 검증
  const validatedFields = SignSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // 2. 검증 실패 시: NextAuth를 호출하지 않고 바로 에러 반환
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Sign Up.',
    };
  }
  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);


  try {
    await sql`
        INSERT INTO users (email, password, name)
        VALUES (
                ${email},
                ${hashedPassword},
                SPLIT_PART(${email}, '@', 1)
)
        `
  } catch (error) {
    // 2. 오류 처리 개선: 중복 이메일 체크 (Postgres 에러코드 23505)
    if (typeof error === 'object' && error !== null && 'code' in error) {
      return {
        message: 'This email is already registered.',
      };
    }
    return { message: 'Somethng went wrong.' };
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Account created. Please sign in manually." };
    }
    throw error; // signIn 내부의 redirect 에러는 다시 던져줘야 정상 작동함
  }
}

export async function handleKaKaoLogin() {
  await signIn("kakao");
};


export async function addItemsToCart(productId: string, quantity: number): Promise<ActionResult> {
  const session = await auth();

  // 로그인 체크
  if (!session?.user.id) {
    return {
      status: 'unauthorized',
      message: 'Please signin'
    };
  }

  try {
    // session.user.id는 DB의 UUID입니다. (users 테이블의 id 컬럼)
    const userId = session.user.id;

    // ON CONFLICT: "이미 담은 상품이면 수량만 늘리고, 없으면 새로 넣어라"
    await sql`
      INSERT INTO carts (user_id, product_id, quantity)
      VALUES (${userId}, ${productId}, ${quantity})
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantity = carts.quantity + ${quantity}
    `;

  } catch (error) {
    console.error("Database error in addItemsToCart:", error);
    return { status: 'error', message: 'Something went wrong' };
  }
  revalidatePath('/cart');
  return { status: 'success', message: 'Item added to cart' };
}

export type FormState = {
  errors?: {
    fullName?: string[];
    phoneNumber?: string[];
    pinCode?: string[];
    addressDetail?: string[];
    city?: string[];
    state?: string[];
  };
  message?: string | null;
};

export async function addAddress(prevState: FormState, formData: FormData): Promise<FormState> {
  // 1. 인증 체크 (로그인 안 된 유저는 튕겨냄)
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  // 2. FormData를 객체로 변환 및 Zod 검증
  const validatedFields = AddressSchema.safeParse({
    fullName: formData.get('fullName'),
    phoneNumber: formData.get('phoneNumber'),
    pinCode: formData.get('pinCode'),
    addressDetail: formData.get('addressDetail'),
    city: formData.get('city'),
    state: formData.get('state'),
  });

  // 3. 검증 실패 시 에러 반환 (DB 안 가고 여기서 끝남)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to save address.',
    };
  }

  // 4. 검증 성공한 데이터 추출
  const { fullName, phoneNumber, pinCode, addressDetail, city, state } = validatedFields.data;

  // 5. DB 저장 (SQL 실행)
  try {
    await sql`
      INSERT INTO addresses (user_id, full_name, phone_number, pin_code, address_detail, city, state)
      VALUES (${session.user.id}, ${fullName}, ${phoneNumber}, ${pinCode}, ${addressDetail}, ${city}, ${state})
    `;


  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to save address.',
    };
  }

  revalidatePath('/cart');
  redirect('/cart');
}