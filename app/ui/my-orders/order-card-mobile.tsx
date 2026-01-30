import Image from "next/image";
import { formatCurrency, formatDate } from "@/app/lib/utils"; // 경로 확인 필요
import { Package, MapPin, Calendar, CreditCard } from "lucide-react";
import { OrderRowProps } from "@/app/lib/definitions";



export function OrderCardMobile({ row }: OrderRowProps) {
  const isPaid = row.status === 'PAID';
  const paymentStatusText = isPaid ? 'Success' : 'Pending';

  return (
    <div className="md:hidden bg-base-100 border border-base-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      {/* 상단: 날짜 & 상태 뱃지 */}
      <div className="flex justify-between items-center border-b border-base-200 pb-3">
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(row.created_at)}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPaid ? 'bg-success/10 text-success' : 'bg-base-content/10 text-base-content/60'}`}>
          {paymentStatusText}
        </span>
      </div>

      {/* 중간: 이미지 & 상품 정보 */}
      <div className="flex gap-4">
        <div className="relative w-20 h-20 bg-base-200/50 rounded-lg shrink-0 overflow-hidden border border-base-200">
          {row.item.image ? (
            <Image
              src={row.item.image}
              alt={row.item.title}
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="text-base-content/20 w-8 h-8" />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="font-bold text-base-content line-clamp-2 leading-tight">
            {row.item.title}
          </h3>
          <p className="text-sm text-base-content/50 mt-1">
            Quantity: {row.item.quantity}
          </p>
        </div>
      </div>

      {/* 하단: 배송지 & 가격 */}
      <div className="bg-base-200/30 rounded-lg p-3 text-sm space-y-2">
        <div className="flex items-start gap-2 text-base-content/70">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex flex-col text-xs leading-relaxed">
            <span className="font-bold text-base-content">{row.address.full_name}</span>
            <span>{row.address.address_detail}</span>
            <span>{row.address.city}, {row.address.state}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-base-200/50 mt-1">
        <div className="flex items-center gap-1 text-xs text-base-content/50">
          <CreditCard className="w-3 h-3" />
          <span>COD</span>
        </div>
        <span className="text-lg font-extrabold text-base-content">
          {formatCurrency(row.item.row_total)}
        </span>
      </div>
    </div>
  );
}