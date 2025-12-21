import postgres from 'postgres';
import { NextResponse } from 'next/server';

// 1. DB 연결 설정 (SSL 필수)
// process.env.POSTGRES_URL은 Vercel이나 .env.local에 정의되어 있어야 합니다.
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
});

// 2. Raw Data 정의 (기존 코드의 빈 부분 채움)
const RAW_PRODUCT_DATA = [
  { name: 'MacBook Pro 16', desc: 'Apple M3 Max Chip', category: 'Electronics' },
  { name: 'Sony WH-1000XM5', desc: 'Noise Cancelling Headphones', category: 'Audio' },
  { name: 'Logitech MX Master 3S', desc: 'Ergonomic Mouse', category: 'Accessories' },
  { name: 'Keychron K2 Pro', desc: 'Mechanical Keyboard', category: 'Electronics' },
  { name: 'Dell UltraSharp Monitor', desc: '4K USB-C Hub Monitor', category: 'Displays' },
];

// Next.js Route Handler (GET 요청으로 실행)
export async function GET() {
  console.log('🚀 데이터베이스 초기화 및 시딩 작업을 시작합니다...');
  const startTime = Date.now();

  try {
    // Step 1: Teardown (기존 테이블 삭제)
    await teardown();

    // Step 2: Schema Migration (테이블 생성)
    await createSchema();

    // Step 3: Data Seeding (데이터 주입)
    await sql.begin(async (tx) => {
      await seedData(tx);
    });

    const duration = (Date.now() - startTime) / 1000;
    console.log(`✅ 모든 작업이 완료되었습니다. (소요 시간: ${duration}초)`);

    return NextResponse.json({
      message: 'Database setup completed successfully',
      duration: `${duration}s`,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ 치명적인 오류 발생:', error);
    return NextResponse.json({
      error: 'Database setup failed',
      details: error.message
    }, { status: 500 });
  }
  // 주의: Next.js(Serverless) 환경에서는 sql.end()를 호출하면
  // 이후 요청에서 연결 풀이 닫혀버릴 수 있으므로 제거하거나 신중히 사용해야 합니다.
}

/**
 * Teardown: 기존 객체 삭제
 */
async function teardown() {
  console.log('🗑️  기존 테이블 및 스키마 삭제 중...');
  
  await sql`DROP TABLE IF EXISTS public.order_items CASCADE`;
  await sql`DROP TABLE IF EXISTS public.orders CASCADE`;
  await sql`DROP TABLE IF EXISTS public.products CASCADE`;
  await sql`DROP TABLE IF EXISTS auth.users CASCADE`;
  await sql`DROP SCHEMA IF EXISTS auth CASCADE`;
  
  console.log('   - 삭제 완료.');
}

/**
 * Migration: 스키마 및 테이블 생성
 */
async function createSchema() {
  console.log('🏗️  [Migration] 스키마 및 테이블 생성 중...');

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`CREATE SCHEMA IF NOT EXISTS auth`;
  
  await sql`
      CREATE TABLE auth.users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255),
          name VARCHAR(100) NOT NULL,
          provider VARCHAR(50) DEFAULT 'local',
          provider_id VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          CONSTRAINT uq_users_email UNIQUE (email)
      )
  `;

  await sql`
      CREATE TABLE public.products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
          stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
          image_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      )
  `;

  await sql`
      CREATE TABLE public.orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
          total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
          status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'REFUNDED')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      )
  `;

  await sql`
      CREATE TABLE public.order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          price_at_purchase NUMERIC(12, 2) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      )
  `;

  await sql`CREATE INDEX idx_users_email ON auth.users(email)`;
  await sql`CREATE INDEX idx_orders_user_id ON public.orders(user_id)`;
  await sql`CREATE INDEX idx_order_items_order_id ON public.order_items(order_id)`;
  
  console.log('   - 테이블 및 인덱스 생성 완료.');
}

/**
 * Seeding: 데이터 가공 및 주입
 */
async function seedData(tx: any) {
  console.log('🌱 데이터 변환 및 주입 중...');

  // 1. 사용자 데이터 생성
  const users = [
    { email: 'user1@example.com', name: 'Alice Kim', password_hash: 'hashed_pw_1', provider: 'local', provider_id: null },
    { email: 'user2@example.com', name: 'Bob Lee', password_hash: 'hashed_pw_2', provider: 'google', provider_id: 'google_123' },
  ];

  const insertedUsers = await tx`
      INSERT INTO auth.users ${sql(users, 'email', 'name', 'password_hash', 'provider', 'provider_id')}
      RETURNING id, email, name
  `;
  console.log(`   - 사용자 ${insertedUsers.length}명 생성 완료.`);

  // 2. 상품 데이터 변환
  const productsToInsert = RAW_PRODUCT_DATA.map(raw => {
      const minPrice = 10000;
      const maxPrice = 300000;
      const randomPrice = Math.floor(Math.random() * ((maxPrice - minPrice) / 100 + 1)) * 100 + minPrice;

      return {
          name: raw.name,
          description: `${raw.desc} (Original Category: ${raw.category})`, 
          price: randomPrice,
          stock_quantity: Math.floor(Math.random() * 100) + 10,
          image_url: `https://via.placeholder.com/400?text=${encodeURIComponent(raw.name)}`
      };
  });

  const insertedProducts = await tx`
      INSERT INTO public.products ${sql(productsToInsert, 'name', 'description', 'price', 'stock_quantity', 'image_url')}
      RETURNING id, name, price, stock_quantity
  `;
  console.log(`   - 상품 ${insertedProducts.length}개 변환 및 생성 완료.`);

  // 3. 주문 데이터 생성 (시나리오: 첫 번째 사용자가 상품 구매)
  if (insertedUsers.length > 0 && insertedProducts.length >= 2) {
      const buyer = insertedUsers[0];
      const itemA = insertedProducts[0];
      const itemB = insertedProducts[1];
      const qtyA = 1;
      const qtyB = 2;

      const totalAmount = (parseFloat(itemA.price) * qtyA) + (parseFloat(itemB.price) * qtyB);

      // 3.1 주문 헤더
      const [order] = await tx`
          INSERT INTO public.orders (user_id, total_amount, status)
          VALUES (${buyer.id}, ${totalAmount}, 'PAID')
          RETURNING id
      `;

      // 3.2 주문 상세
      const orderItems = [
          { order_id: order.id, product_id: itemA.id, quantity: qtyA, price_at_purchase: itemA.price },
          { order_id: order.id, product_id: itemB.id, quantity: qtyB, price_at_purchase: itemB.price }
      ];

      await tx`
          INSERT INTO public.order_items ${sql(orderItems, 'order_id', 'product_id', 'quantity', 'price_at_purchase')}
      `;

      // 3.3 재고 차감
      for (const item of orderItems) {
          await tx`
              UPDATE public.products
              SET stock_quantity = stock_quantity - ${item.quantity}
              WHERE id = ${item.product_id}
          `;
      }
      console.log(`   - 주문 생성 완료 (Order ID: ${order.id}, Total: ${totalAmount}).`);
  }
}