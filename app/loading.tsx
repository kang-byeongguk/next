// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base-100 p-4">
      {/* 1. 스피너 로더 (DaisyUI) */}
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        
        {/* 2. 텍스트 로더 */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-base-content tracking-tight">
            NextCart
          </h2>
          <p className="text-sm text-base-content/50 animate-pulse">
            Loading your experience...
          </p>
        </div>
      </div>

      {/* 3. 스켈레톤 UI 예시 (하단에 은은하게 배치하거나 생략 가능) */}
      <div className="mt-12 w-full max-w-xs flex flex-col gap-4 opacity-20">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </div>
  );
}