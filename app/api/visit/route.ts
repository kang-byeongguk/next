// app/api/visit/route.ts
import { sql } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pathname } = await request.json();

    // postgres.js를 사용하여 데이터 삽입
    await sql`
      INSERT INTO visit_logs (path)
      VALUES (${pathname})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visit Log Error:', error);
    return NextResponse.json({ error: 'DB Error' }, { status: 500 });
  }
}