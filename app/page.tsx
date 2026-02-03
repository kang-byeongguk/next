import Link from 'next/link';
import Carousel from './ui/carousel';
import Footer from './ui/footer';
import { ProductGridSkeleton } from './ui/product-cards-skeleton';
import { Suspense } from 'react';
import NonFilteredProducts from './ui/non-filtered-products';

export default async function Home() {
  return (
    // 메인 영역
    <main className="min-h-screen bg-base-100 ">
      <div className="w-full flex flex-col gap-12 p-6 px-5 md:px-20">
        {/* 캐러셀 영역 */}
        <Carousel />

        {/* 상품 카드 영역 */}
        <div className="flex flex-col mt-8">
          <h1 className="text-3xl font-semibold text-base-content mb-6 w-fit border-b-3 border-primary pb-0.5">New Arrivals</h1>
          <Suspense fallback={<ProductGridSkeleton/>}>
          <NonFilteredProducts/>
          </Suspense>
        </div>

        {/* 상세페이지 이동 링크 */}
        <div className="flex justify-center items-center">
          <Link href="/product">
            <button className="btn btn-outline text-base-content hover:bg-base-content/5  px-20">See more</button>
          </Link>
        </div>
      </div>

      {/* 푸터 영역 */}
      <Footer />
    </main>
  );
}
