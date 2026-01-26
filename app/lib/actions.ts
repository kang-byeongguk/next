// app/lib/actions.ts
'use server';


import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { SignSchema } from './schema';
import bcrypt from 'bcryptjs';
import { sql } from './data';
import { revalidatePath } from 'next/cache';

// State 타입 정의: 에러 메시지와 필드별 에러를 포함
export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

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

type ActionResult = {
  status: 'success' | 'error' | 'unauthorized';
  message: string;
};

export async function addItemsToCart(productId: string, quantity: number): Promise<ActionResult> {
  const session = await auth();

  // 1. 로그인 체크
  if (!session || !session.user || !session.user.id) {
    return {
      status: 'unauthorized',
      message: 'Please signin'
    };
  }

  try {
    // session.user.id는 DB의 UUID입니다. (users 테이블의 id 컬럼)
    const userId = session.user.id;

    // 2. 장바구니에 담기 (PostgreSQL 쿼리 예시)
    // ON CONFLICT: "이미 담은 상품이면 수량만 늘리고, 없으면 새로 넣어라"
    await sql`
      INSERT INTO carts (user_id, product_id, quantity)
      VALUES (${userId}, ${productId}, ${quantity})
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantity = carts.quantity + ${quantity}
    `;




  } catch (error) {
    console.error("Cart Error:", error);
    return { status: 'error', message: 'Something went wrong' };
  }
  revalidatePath('/cart');
  return { status: 'success', message: 'Item added to cart' };
}
