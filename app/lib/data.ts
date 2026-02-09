import postgres from "postgres";
import { Address, Product, User, UserProduct } from "./definitions";
import { calculateGrowth, formatCurrency, formatNumber } from "./utils";
import { idSchema } from "./schema";
export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


// 차트용 데이터 타입 정의
export type CategoryData = {
  category: string;
  total_sales: number;
  formatted_sales: string;
};

export async function fetchTopCategories(): Promise<CategoryData[]> {
  try {
    // 1. order_items(가격*수량)와 products(카테고리), orders(상태확인)를 조인
    // 2. 카테고리별 그룹화 및 매출 합계 계산
    // 3. 매출액 내림차순 정렬 후 상위 4개 추출
    const data = await sql<CategoryData[]>`
      SELECT 
        p.category,
        SUM(oi.quantity * oi.price) AS total_sales
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'PAID'
      GROUP BY p.category
      ORDER BY total_sales DESC
      LIMIT 4
    `;

    // 4. 화폐 포맷팅 적용 후 반환
    return data.map((item) => ({
      ...item,
      total_sales: Number(item.total_sales), // numeric 타입은 string으로 올 수 있어 변환
      formatted_sales: formatCurrency(Number(item.total_sales)),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch top categories data.');
  }
}



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
    throw new Error('Failed to run fetchFilteredProducts.');
  }
}

export async function fetchUserAddresses(user_id: string) {
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

  const validation = idSchema.safeParse(id)
  if (!validation.success) {
    console.log('Invalid UUID format', id)
    return null
  }

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




export interface RevenueChartData {
  date: string;
  revenue: number;
  order: number;
}

export async function fetchRevenueChartData(): Promise<RevenueChartData[]> {
  try {
    // 1. DB 쿼리: 오늘 0시 기준 6일 전부터 현재까지 데이터 조회
    // DATE_TRUNC('day', NOW()) : 오늘 날짜의 00:00:00
    const data = await sql`
      SELECT
        to_char(created_at, 'YYYY-MM-DD') as date_key,
        SUM(total_amount) as revenue,
        COUNT(id) as order_count
      FROM orders
      WHERE created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '6 days'
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    // 2. 데이터 빈 곳 채우기 (Zero-Filling)
    const chartData: RevenueChartData[] = [];
    const today = new Date();

    // 6일 전부터 오늘까지 (총 7일) 반복
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      
      // 비교용 키 (YYYY-MM-DD)
      const dateKey = d.toISOString().split('T')[0];
      
      // 차트 표시용 날짜 (예: 12 Aug)
      const displayDate = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
      }).format(d);

      // DB 데이터 매칭
      const found = data.find((row) => row.date_key === dateKey);

      chartData.push({
        date: displayDate,
        revenue: found ? Number(found.revenue) : 0,
        order: found ? Number(found.order_count) : 0,
      });
    }

    return chartData;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}



export async function fetchCardData() {
  try {
    // 1. 매출(Sales) 및 주문(Orders) 데이터 조회
    // orders 테이블에서 최근 7일(current)과 그 전 7일(previous) 데이터를 집계합니다.
    const orderDataPromise = sql`
      SELECT
        -- 이번 주 매출 합계
        SUM(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN total_amount ELSE 0 END) AS current_sales,
        -- 지난 주 매출 합계
        SUM(CASE WHEN created_at >= NOW() - INTERVAL '14 days' AND created_at < NOW() - INTERVAL '7 days' THEN total_amount ELSE 0 END) AS prev_sales,
        -- 이번 주 주문 건수
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS current_orders,
        -- 지난 주 주문 건수
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '14 days' AND created_at < NOW() - INTERVAL '7 days' THEN 1 END) AS prev_orders
      FROM orders
    `;

    // 2. 방문자(Visitors) 데이터 조회
    // visit_logs 테이블에서 동일한 방식으로 집계합니다.
    const visitDataPromise = sql`
      SELECT
        COUNT(CASE WHEN visited_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS current_visitors,
        COUNT(CASE WHEN visited_at >= NOW() - INTERVAL '14 days' AND visited_at < NOW() - INTERVAL '7 days' THEN 1 END) AS prev_visitors
      FROM visit_logs
    `;

    // 병렬로 쿼리 실행하여 속도 최적화
    const [orderResult, visitResult] = await Promise.all([
      orderDataPromise,
      visitDataPromise
    ]);

    const data = orderResult[0];
    const visit = visitResult[0];

    // DB에서 가져온 값들은 문자열일 수 있으므로 숫자로 변환
    const currentSales = Number(data.current_sales || 0);
    const prevSales = Number(data.prev_sales || 0);
    const currentOrders = Number(data.current_orders || 0);
    const prevOrders = Number(data.prev_orders || 0);
    const currentVisitors = Number(visit.current_visitors || 0);
    const prevVisitors = Number(visit.prev_visitors || 0);

    // 3. UI에 맞게 데이터 가공하여 리턴
    return {
      totalSales: {
        value: formatCurrency(currentSales),         // 예: $983,410
        growth: calculateGrowth(currentSales, prevSales) // 예: +3.34%
      },
      totalOrders: {
        value: formatNumber(currentOrders),          // 예: 58,375
        growth: calculateGrowth(currentOrders, prevOrders)
      },
      totalVisitors: {
        value: formatNumber(currentVisitors),        // 예: 237,782
        growth: calculateGrowth(currentVisitors, prevVisitors)
      }
    };

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
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