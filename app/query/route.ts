import postgres from 'postgres';
import { NextResponse } from 'next/server';

// DB 연결
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
});

export async function GET() {
  try {
    // ---------------------------------------------------------
    // [핵심] JOIN 쿼리: 두 테이블을 합쳐서 가져오기
    // ---------------------------------------------------------
    // products(p) 테이블과 categories(c) 테이블을 연결합니다.
    // p.category_id 와 c.id 가 같은 것끼리 붙입니다.
    const products = await sql`
      SELECT 
        p.id, 
        p.title, 
        p.price, 
        p.image,
        c.name AS category_name, -- 카테고리 테이블의 name을 가져옴
        p.rating_rate,
        p.rating_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.id ASC
    `;

    // 데이터가 0개면 시딩이 안 된 것
    if (products.length === 0) {
      return NextResponse.json({ message: '데이터가 텅 비었습니다. /api/seed 먼저 실행하세요.' });
    }

    return NextResponse.json({ 
      count: products.length,
      data: products 
    });

  } catch (error) {
    console.error('Test DB Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}