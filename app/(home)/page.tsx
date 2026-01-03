// export default function Page(){
//     return(<div>메인 랜딩 페이지</div>)
// }

import postgres from 'postgres';
import Link from 'next/link';
import Carousel from '../ui/carousel';

// 1. DB 연결 (Server Component라서 여기서 바로 연결해도 안전합니다)
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
});

// 2. 상품 데이터 가져오기 (비동기 함수)
async function getProducts() {
  // 최신순으로 정렬해서 가져오기
  const products = await sql`
    SELECT * FROM products
    ORDER BY created_at DESC
  `;
  return products;
}

// 3. 메인 페이지 컴포넌트
export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-base-100">
        <Carousel/>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">New Arrivals</h1>
        
        {/* 상품 그리드 (반응형: 모바일 1열 -> 태블릿 2열 -> PC 4열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/product/${product.id}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
            >
              {/* 이미지 영역 */}
              <div className="aspect-square relative bg-white p-4 flex items-center justify-center">
                {/* next/image 대신 일반 img 태그 사용 (설정 귀찮음 방지 및 외부 이미지 호환) */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* 텍스트 정보 영역 */}
              <div className="p-4">
                <h2 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
                  {product.title}
                </h2>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {/* 중요: 정수로 저장된 센트 단위를 달러로 변환 */}
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  {/* 장식용 별점 (DB에 없으므로 하드코딩 혹은 랜덤) */}
                  <span className="text-xs text-gray-500">★ 4.5</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 데이터가 없을 경우 처리 */}
        {products.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            등록된 상품이 없습니다. 시딩(Seed)을 먼저 실행해주세요.
          </div>
        )}
      </div>
    </main>
  );
}