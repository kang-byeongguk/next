import postgres from "postgres";
import { Address, Product, User, UserProduct } from "./definitions";
import { formatCurrency } from "./utils";
export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function fetchLatestProducts() {
  try {
    const data = await sql<Product[]>`
     SELECT * 
     FROM products 
     ORDER BY created_at DESC
     LIMIT 10
     `;

    const latestProducts = data.map((product) => {
      return ({
        ...product,
        price: formatCurrency(product.price)
      })
    })
    return latestProducts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('fetchProducts 함수 실행중 에러 발생')
  }
}

const PRODUCTS_PER_PAGE = 10;
export async function fetchFilteredProducts(
  query: string,
  sort: 'newest' | 'price_asc' | 'price_desc' | 'oldest',
  currentPage: number,
) {
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const sortMap = {
    newest: sql`ORDER BY created_at DESC`,
    price_asc: sql`ORDER BY price ASC`,
    price_desc: sql`ORDER BY price DESC`,
    oldest: sql`ORDER BY created_at ASC`,
  };


  try {
    const data = await sql<Product[]>`
      SELECT *
      FROM products
      WHERE
        title ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} 
      ${sortMap[sort]}
      LIMIT ${PRODUCTS_PER_PAGE} OFFSET ${offset}
    `;
    const products = data.map((product) => {
      return ({
        ...product,
        price: formatCurrency(product.price)
      })
    })

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}
export async function fetchUserAddresses(user_id:string){
  try {
    const addresses = await sql<Address[]>`
    SELECT *
    FROM addresses
    WHERE user_id=${user_id}
    `
    
    return addresses
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('fetchUserAddresses 함수 실행중 에러 발생')
  }
}
export async function fetchUserProducts(user_id: string) {
  try {
    const data = await sql<UserProduct[]>`
    SELECT 
    p.image,
    p.title,
    p.price,
    c.quantity,
    (p.price * c.quantity) AS subtotal,
    p.id AS product_id,
    SUM(p.price * c.quantity) OVER() AS total_price,
    SUM(c.quantity) OVER() AS count
FROM PRODUCTS p
JOIN CARTS c 
    ON p.id = c.product_id
WHERE c.user_id = ${user_id};
    `
    const products = data.map((product) => {
      return (
        {
          ...product,
          price: formatCurrency(product.price),
          subtotal: formatCurrency(product.subtotal),
          formatted_total_price: formatCurrency(product.total_price),
        }
      )
    })
    return products
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('fetchUserProducts 함수 실행중 에러 발생')
  }
}




export async function fetchProductsPages(query: string) {
  const PRODUCTS_PER_PAGE = 10
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM products
      WHERE
        title ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} 
    `;

    const totalPages = Math.ceil(Number(data[0].count) / PRODUCTS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchProductById(id: string) {
  try {
    const data = await sql<Product[]>`
     SELECT * 
     FROM products 
     WHERE id=${id};
     `;

    const product = data.map((product) => {
      return ({
        ...product,
        price: formatCurrency(product.price)
      })
    })
    return product[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('fetchProducts 함수 실행중 에러 발생')
  }
}

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}





















// [수정됨] 개별 주문 아이템 행을 위한 타입 정의
export interface OrderItemRow {
  order_id: string;
  total_order_amount: number; // 주문 전체 총액 (참고용)
  status: string;
  created_at: Date;
  // 배송지 정보
  address: {
    full_name: string;
    address_detail: string;
    city: string;
    state: string;
    pin_code: string;
    phone_number: string;
  };
  // 개별 상품 정보
  item: {
    product_id: string;
    title: string;
    image: string;
    quantity: number;
    price: number; // 단가
    row_total: number; // 단가 * 수량
  };
}

export async function fetchUserOrderItems(userId: string) {
  try {
    // 쿼리는 기존과 동일하게 JOIN을 수행합니다.
    const data = await sql`
      SELECT 
        o.id as order_id, o.total_amount, o.status, o.created_at,
        a.full_name, a.address_detail, a.city, a.state, a.pin_code, a.phone_number,
        oi.quantity, oi.price as item_price, -- 아이템 단가
        p.id as product_id, p.title, p.image
      FROM orders o
      JOIN addresses a ON o.address_id = a.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ${userId}
      ORDER BY o.created_at DESC, p.title ASC -- 같은 주문 내에선 상품명순 정렬
    `;

    // [핵심 수정] 그룹화(Map) 로직 제거. DB row를 1:1로 매핑하여 반환.
    const orderRows: OrderItemRow[] = data.map((row) => ({
      order_id: row.order_id,
      total_order_amount: Number(row.total_amount),
      status: row.status,
      created_at: row.created_at,
      address: {
        full_name: row.full_name,
        address_detail: row.address_detail,
        city: row.city,
        state: row.state,
        pin_code: row.pin_code,
        phone_number: row.phone_number,
      },
      item: {
        product_id: row.product_id,
        title: row.title,
        image: row.image,
        quantity: row.quantity,
        price: Number(row.item_price),
        row_total: Number(row.item_price) * row.quantity, // 해당 아이템 라인의 총액
      },
    }));

    return orderRows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order items.');
  }
}