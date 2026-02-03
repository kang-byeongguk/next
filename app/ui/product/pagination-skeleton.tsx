export default function PaginationSkeleton() {
  return (
    <div className="inline-flex gap-1 animate-pulse">
      {/* 왼쪽 화살표 */}
      <div className="h-10 w-10 rounded-md skeleton mr-2 shrink-0 bg-base-300"></div>

      {/* 페이지 번호들 (기본적으로 5개 정도의 너비를 잡아줍니다) */}
      <div className="flex -space-x-px">
        {/* 첫 번째 번호 (왼쪽 둥글게) */}
        <div className="h-10 w-10 rounded-l-md skeleton border-r border-base-100/20 bg-base-300"></div>
        
        {/* 중간 번호들 */}
        <div className="h-10 w-10 skeleton border-r border-base-100/20 bg-base-300 hidden sm:block"></div>
        <div className="h-10 w-10 skeleton border-r border-base-100/20 bg-base-300"></div>
        <div className="h-10 w-10 skeleton border-r border-base-100/20 bg-base-300 hidden sm:block"></div>
        
        {/* 마지막 번호 (오른쪽 둥글게) */}
        <div className="h-10 w-10 rounded-r-md skeleton bg-base-300"></div>
      </div>

      {/* 오른쪽 화살표 */}
      <div className="h-10 w-10 rounded-md skeleton ml-2 shrink-0 bg-base-300"></div>
    </div>
  );
}