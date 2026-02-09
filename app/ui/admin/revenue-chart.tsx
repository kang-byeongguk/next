'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { RevenueChartData } from '@/app/lib/data'; // 위에서 만든 타입 import

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RevenueChart({ data }: { data: RevenueChartData[] }) {
  
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((d) => d.revenue),
        borderColor: '#f97316', // Orange-500
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(249, 115, 22, 0.2)');
          gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f97316',
        pointHoverBorderWidth: 3,
        fill: true,
        order: 1,
      },
      {
        label: 'Order',
        data: data.map((d) => d.order),
        borderColor: '#fdba74', // Orange-300
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
        order: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              // Revenue인 경우 통화 표시
              if (context.dataset.label === 'Revenue') {
                 label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(context.parsed.y);
              } else {
                // Order인 경우 그냥 숫자
                label += context.parsed.y + '건';
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 12 } },
        border: { display: false },
      },
      y: {
        grid: { color: '#f3f4f6', borderDash: [5, 5] },
        border: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 12 },
          callback: (value: any) => (value >= 1000 ? value / 1000 + 'k' : value),
        },
        min: 0,
      },
    },
  };

  return (
    <div className="w-full h-full bg-base-100 rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Revenue Analytics</h2>
          {/* 커스텀 범례 */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-sm text-gray-500">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 border-t-2 border-dashed border-orange-300"></span>
              <span className="text-sm text-gray-500">Order</span>
            </div>
          </div>
        </div>
        {/* 날짜 뱃지 */}
        <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-medium">
          Last 7 Days
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="relative h-[320px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}