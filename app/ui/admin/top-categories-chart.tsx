'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '@/app/lib/utils';

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryData = {
  category: string;
  total_sales: number;
  formatted_sales: string;
};

export default function TopCategoriesChart({ data }: { data: CategoryData[] }) {
  const totalValue = data.reduce((acc, curr) => acc + curr.total_sales, 0);

  const backgroundColors = [
    '#f97316',
    '#fb923c',
    '#fdba74',
    '#fed7aa',
  ];

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.total_sales),
        backgroundColor: backgroundColors,
        borderWidth: 4,
        borderColor: '#ffffff',
        hoverOffset: 4,
        borderRadius: 20,
        cutout: '80%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 이 설정 덕분에 부모 div 높이에 맞춰집니다.
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    // [변경 1] p-6 -> p-5 (전체 패딩 축소)
    <div className="w-full h-full p-5 bg-base-100 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      {/* [변경 2] mb-6 -> mb-4 (헤더 여백 축소) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Top Categories</h2>
        <button className="text-sm text-gray-400 hover:text-gray-600">See All</button>
      </div>

      {/* [변경 3] aspect-square 제거, max-h-[300px] -> h-[220px] (차트 높이 직접 제어) */}
      <div className="relative w-full h-[220px] mx-auto">
        <Doughnut data={chartData} options={options} />
        
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-gray-400 font-medium">Total Sales</span>
          {/* [변경 4] 폰트 사이즈 미세 조정 (공간 확보 위해) text-2xl -> text-xl */}
          <span className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>

      {/* [변경 5] mt-8 -> mt-6 (차트와 리스트 사이 간격 축소) */}
      {/* [변경 6] space-y-4 -> space-y-2 (리스트 아이템 간격 축소) */}
      <div className="mt-6 space-y-2">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: backgroundColors[index % backgroundColors.length] }}
              />
              <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors text-sm">
                {item.category}
              </span>
            </div>
            <span className="text-gray-900 font-bold text-sm">
              {item.formatted_sales}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}