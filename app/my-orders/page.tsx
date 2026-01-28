import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { fetchUserOrderItems } from "../lib/data";
import { formatCurrency } from "../lib/utils";
import { Package } from "lucide-react";

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  // 1. 데이터 가져오기 (플랫한 리스트 구조)
  const orderRows = await fetchUserOrderItems(session.user.id);

  // 날짜 포맷팅 (DD/MM/YYYY)
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 md:px-8 py-12 w-full max-w-7xl mx-auto">
      
      {/* 헤더 타이틀 */}
      <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-8 md:mb-12">
        My Orders
      </h1>

      {orderRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-base-200 border-dashed rounded-xl">
          <Package className="w-16 h-16 text-base-content/20 mb-4" />
          <p className="text-base-content/60 text-lg">No orders found.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {orderRows.map((row) => {
            // 결제 상태 로직
            const isPaid = row.status === 'PAID';
            const paymentStatusText = isPaid ? 'Success' : 'Pending';
            
            // 각 아이템별 고유 키
            const rowKey = `${row.order_id}-${row.item.product_id}`;

            return (
              <div 
                key={rowKey} 
                className="group flex flex-col md:grid md:grid-cols-12 gap-6 py-8 border-b border-base-200 last:border-none hover:bg-base-100/50 transition-colors"
              >
                
                {/* [Col 1] 상품 이미지 (Mobile: 상단, Desktop: 1칸) */}
                <div className="md:col-span-1">
                  <div className="bg-primary/5 rounded-lg w-20 h-20 md:w-full md:aspect-square flex items-center justify-center relative overflow-hidden border border-primary/10">
                    {row.item.image ? (
                      <Image
                        src={row.item.image}
                        alt={row.item.title}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <Package className="text-primary/40 w-8 h-8" />
                    )}
                  </div>
                </div>

                {/* [Col 2] 상품 정보 (Mobile: 이미지 옆/아래, Desktop: 4칸) */}
                <div className="md:col-span-4 flex flex-col justify-start pt-1">
                  <h3 className="text-lg font-medium text-base-content mb-1 leading-snug">
                    {row.item.title} <span className="text-base-content/80 font-normal">x {row.item.quantity}</span>
                  </h3>
                  <p className="text-sm text-base-content/50">
                    Items : {row.item.quantity}
                  </p>
                </div>

                {/* [Col 3] 배송지 정보 (Desktop: 3칸) */}
                <div className="md:col-span-3 flex flex-col text-sm text-base-content/70 leading-relaxed pt-1">
                  <span className="font-bold text-base-content mb-1">{row.address.full_name}</span>
                  <span>{row.address.address_detail}</span>
                  <span>{row.address.city}, {row.address.state}</span>
                  <span className="mt-1">{row.address.phone_number}</span>
                </div>

                {/* [Col 4] 가격 (Desktop: 2칸) */}
                <div className="md:col-span-2 flex items-start md:justify-end pt-1">
                  <span className="text-lg font-bold text-base-content">
                    {formatCurrency(row.item.row_total)}
                  </span>
                </div>

                {/* [Col 5] 메타 정보 (Method, Date, Status) (Desktop: 2칸) */}
                <div className="md:col-span-2 flex flex-col gap-1.5 pt-1 text-sm text-base-content/60 md:text-right">
                  <div className="flex md:justify-end gap-2">
                    <span>Method :</span>
                    <span className="font-medium text-base-content">COD</span>
                  </div>
                  <div className="flex md:justify-end gap-2">
                    <span>Date :</span>
                    <span className="font-medium text-base-content">{formatDate(row.created_at)}</span>
                  </div>
                  <div className="flex md:justify-end gap-2">
                    <span>Payment :</span>
                    <span className={`font-medium ${isPaid ? 'text-success' : 'text-base-content'}`}>
                      {paymentStatusText}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}