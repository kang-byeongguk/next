import Image from "next/image";
import { formatCurrency, formatDate } from "@/app/lib/utils"; // 경로 확인 필요
import { Package } from "lucide-react";
import { OrderRowProps } from "@/app/lib/definitions";


export function OrderRowDesktop({ row }: OrderRowProps) {
  const isPaid = row.status === 'PAID';
  const paymentStatusText = isPaid ? 'Success' : 'Pending';

  return (
    <div className="hidden md:grid md:grid-cols-12 gap-6 py-6 border-b border-base-200 hover:bg-base-100/50 transition-colors items-center">
      {/* [Col 1] 상품 이미지 */}
      <div className="md:col-span-1">
        <div className="bg-primary/5 rounded-lg w-full aspect-square flex items-center justify-center relative overflow-hidden border border-primary/10">
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

      {/* [Col 2] 상품 정보 */}
      <div className="md:col-span-4 flex flex-col justify-start">
        <h3 className="text-lg font-medium text-base-content mb-1 leading-snug">
          {row.item.title} <span className="text-base-content/80 font-normal">x {row.item.quantity}</span>
        </h3>
        <p className="text-sm text-base-content/50">
          Items : {row.item.quantity}
        </p>
      </div>

      {/* [Col 3] 배송지 정보 */}
      <div className="md:col-span-3 flex flex-col text-sm text-base-content/70 leading-relaxed">
        <span className="font-bold text-base-content mb-1">{row.address.full_name}</span>
        <span>{row.address.address_detail}</span>
        <span>{row.address.city}, {row.address.state}</span>
        <span className="mt-1">{row.address.phone_number}</span>
      </div>

      {/* [Col 4] 가격 */}
      <div className="md:col-span-2 flex flex-col items-end justify-start">
        <span className="text-xs text-base-content/50 font-medium mb-0.5 uppercase tracking-wide">
          Total Price
        </span>
        <span className="text-lg font-bold text-base-content">
          {formatCurrency(row.item.row_total)}
        </span>
      </div>

      {/* [Col 5] 메타 정보 */}
      <div className="md:col-span-2 flex flex-col gap-1.5 text-sm text-base-content/60 text-right">
        <div className="flex justify-end gap-2">
          <span>Method :</span>
          <span className="font-medium text-base-content">COD</span>
        </div>
        <div className="flex justify-end gap-2">
          <span>Date :</span>
          <span className="font-medium text-base-content">{formatDate(row.created_at)}</span>
        </div>
        <div className="flex justify-end gap-2">
          <span>Payment :</span>
          <span className={`font-medium ${isPaid ? 'text-success' : 'text-base-content'}`}>
            {paymentStatusText}
          </span>
        </div>
      </div>
    </div>
  );
}