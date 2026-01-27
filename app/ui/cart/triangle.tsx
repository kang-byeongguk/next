// ◀ 왼쪽 삼각형
export function TriangleLeft({ className }: { className?: string }) {
  return (
    <svg 
      width="35" height="35" viewBox="0 0 24 24" 
      fill="currentColor" // 부모의 text 색상을 따라감
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 7L9 12L14 17V7Z" />
    </svg>
  );
}

// ▶ 오른쪽 삼각형
export function TriangleRight({ className }: { className?: string }) {
  return (
    <svg 
      width="35" height="35" viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 17L15 12L10 7V17Z" />
    </svg>
  );
}