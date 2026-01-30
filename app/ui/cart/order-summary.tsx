'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createOrder } from "../../lib/actions"; 
import { formatCurrency } from "@/app/lib/utils";
import { Address, OrderSummaryProps } from "@/app/lib/definitions";
import AddressSelector from "./address-selector";

export default function OrderSummary({ addresses, subtotal }: OrderSummaryProps) {
  const router = useRouter();
  const orderData = {
    subtotal: subtotal,
    shipping: 0,
    taxRate: 0.02,
  };

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    addresses.length > 0 ? addresses[0] : null
  );
  const [isOrdering, setIsOrdering] = useState(false);
  const taxAmount = orderData.subtotal * orderData.taxRate;
  const total = Number(orderData.subtotal) + Number(orderData.shipping) + Number(taxAmount);

  // 주문하기 버튼 클릭시 작동
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }

    setIsOrdering(true);

    await toast.promise(
      createOrder(selectedAddress.id),
      {
        loading: 'Processing your order...',
        success: (result) => {
          if (!result.success) {
            setIsOrdering(false);
            throw new Error(result.message);
          }
          router.push('/my-orders');
          return result.message;
        },
        error: (err) => {
          setIsOrdering(false);
          return `${err.message}`;
        },
      }
    ).catch(() => {
      setIsOrdering(false);
    });
  };

  return (
    <div className="w-full bg-base-100 p-6 md:p-8 rounded-xl border border-base-200/60 shadow-2xl">

      {/* 헤더 */}
      <h2 className="text-xl font-bold text-base-content mb-6">
        Order Summary
      </h2>

      {/* [섹션 1] 주소 선택 컴포넌트 */}
      <AddressSelector
        addresses={addresses} 
        selectedAddress={selectedAddress} 
        onSelect={setSelectedAddress} 
      />

      {/* [섹션 2] 프로모션 코드 */}
      <div className="mb-8">
        <label htmlFor="promo" className="text-xs font-bold text-base-content/60 uppercase mb-2 block tracking-wide">
          Promo Code
        </label>
        <div className="flex flex-col gap-3">
          <input
            id="promo"
            type="text"
            placeholder="Enter promo code"
            defaultValue=""
            className="input py-4 border-base-content/80 placeholder:text-base-content/80 w-full focus:input-primary bg-base-100 h-10 text-sm"
          />
          <button className="btn btn-primary w-24 btn-sm h-10 font-normal text-sm">
            Apply
          </button>
        </div>
      </div>

      <div className="border-t border-base-content/10 mb-6"></div>

      {/* [섹션 3] 가격 정보 */}
      <div className="flex flex-col gap-4 mb-6 text-sm">
        <div className="flex justify-between items-center text-base-content">
          <span className="font-medium">Price</span>
          <span className="font-bold">{formatCurrency(orderData.subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-base-content">
          <span className="font-medium">Shipping Fee</span>
          <span className="font-bold">
            {orderData.shipping === 0 ? "Free" : formatCurrency(orderData.shipping)}
          </span>
        </div>
        <div className="flex justify-between items-center text-base-content">
          <span className="font-medium">Tax ({orderData.taxRate * 100}%)</span>
          <span className="font-bold">{formatCurrency(taxAmount)}</span>
        </div>
      </div>

      <div className="border-t border-base-content/10 mb-6"></div>

      {/* [섹션 4] 총계 및 주문 버튼 */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <span className="text-lg font-bold text-base-content">Total</span>
          <span className="text-2xl font-extrabold text-base-content">
            {formatCurrency(total)}
          </span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isOrdering}
          className="btn btn-primary btn-block text-white text-lg font-bold h-12 shadow-md hover:brightness-110 disabled:bg-primary/60"
        >
          {isOrdering ? <span className="loading loading-spinner"></span> : "Place Order"}
        </button>
      </div>

    </div>
  );
}