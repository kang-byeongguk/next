import { DollarSign, ShoppingCart, Users } from 'lucide-react';

// 1. 아이콘 맵핑
const iconMap = {
  sales: DollarSign,
  orders: ShoppingCart,
  visitors: Users,
};

// 2. Props 타입 정의
interface DashboardCardProps {
  title: string;
  value: string; 
  growth: string; 
  type: 'sales' | 'orders' | 'visitors';
}

export default function DashboardCard({
  title,
  value,
  growth,
  type,
}: DashboardCardProps) {
  const Icon = iconMap[type];
  const isPositive = growth.startsWith('+');

  return (
    // bg-base-100: 테마의 기본 배경색 (보통 흰색이나 어두운 회색)
    // border-base-200: 배경보다 살짝 진한 테두리
    <div className="rounded-[20px] bg-base-100 p-6 shadow-sm border border-base-200 flex flex-col justify-between h-full">
      
      {/* 상단: 타이틀 + 아이콘 */}
      <div className="flex items-center justify-between mb-4">
        {/* text-base-content/60: 기본 글자색에 투명도 60%를 줘서 회색 느낌 냄 */}
        <h3 className="text-sm font-medium text-base-content/60">{title}</h3>
        
        {/* bg-base-200: 아이콘 배경을 살짝 구분되게 처리 */}
        <div className="p-2 rounded-lg bg-base-200">
          <Icon className="w-5 h-5 text-base-content" />
        </div>
      </div>

      {/* 하단: 수치 + 등락률 */}
      <div className="flex items-end justify-between">
        {/* text-base-content: 테마의 메인 글자색 (검정 or 흰색) */}
        <span className="text-3xl font-bold text-base-content">{value}</span>
        
        <div className="flex flex-col items-end">
          <span
            className={`text-sm font-bold ${
              // DaisyUI의 시맨틱 컬러 사용 (success: 초록, error: 빨강)
              isPositive ? 'text-success' : 'text-error'
            }`}
          >
            {growth}
          </span>
          <span className="text-xs text-base-content/40 mt-1">vs last week</span>
        </div>
      </div>
    </div>
  );
}