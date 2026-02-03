// app/ui/skeletons.tsx

export function ProductGridSkeleton() {
  return (
    <div className="w-full pb-8">
      {/* 원본 ProductCards와 동일한 Grid 레이아웃 적용 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
        
        {/* 스켈레톤 카드를 10개 정도 반복해서 보여줌 */}
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// 개별 상품 카드 스켈레톤
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      {/* 1. 이미지 영역: 원본의 aspect-square, rounded-2xl 유지 */}
      <div className="relative w-full aspect-square bg-base-200 rounded-2xl overflow-hidden skeleton"></div>

      {/* 2. 텍스트 영역 */}
      <div className="mt-4 flex flex-col gap-2">
        {/* 상품명 (제목 길이 흉내) */}
        <div className="skeleton h-4 w-3/4 rounded"></div>
        
        {/* 별점 영역 (작은 바) */}
        <div className="flex items-center gap-1">
           <div className="skeleton h-3 w-12 rounded"></div>
        </div>
      </div>

      {/* 3. 하단 가격 및 버튼 영역 */}
      <div className="mt-2 flex items-center justify-between">
        {/* 가격 */}
        <div className="skeleton h-5 w-16 rounded"></div>
        {/* 구매 버튼 (버튼 크기 흉내) */}
        <div className="skeleton h-8 w-20 rounded-lg"></div>
      </div>
    </div>
  );
}