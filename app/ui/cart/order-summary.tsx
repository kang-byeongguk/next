'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // 2번 컴포넌트 기능: 토스트
import { createOrder } from "../../lib/actions"; // 2번 컴포넌트 기능: 서버 액션
import { formatCurrency } from "@/app/lib/utils"; // 1번 컴포넌트 기능: 통화 포맷 유틸

// DB 주소 타입 정의 (필요한 필드만)
export interface Address {
  id: string;
  full_name: string;
  address_detail: string;
  city: string;
  state: string;
  pin_code: string;
  phone_number: string;
}

interface OrderSummaryProps {
  addresses: Address[];
  subtotal: number; // 서버에서 계산된 합계
}

export default function OrderSummary({ addresses, subtotal }: OrderSummaryProps) {
  const router = useRouter(); // 2번 컴포넌트 기능: 라우터

  // 1. [Data Logic] 주소 포맷팅 함수 (이름, 상세주소, 도시, 주)
  const formatAddress = (addr: Address) => {
    return [addr.full_name, addr.address_detail, addr.city, addr.state]
      .filter(Boolean)
      .join(", ");
  };

  const orderData = {
    subtotal: subtotal, // props로 받은 값 사용
    shipping: 0,
    taxRate: 0.02,
  };

  // 2. 상태 관리
  // 주소가 있으면 첫 번째 주소를 기본값으로, 없으면 null
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    addresses.length > 0 ? addresses[0] : null
  );
  
  // 2번 컴포넌트 기능: 중복 주문 방지 상태
  const [isOrdering, setIsOrdering] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // (Optional) DB에서 주소가 변경/추가되어 props가 바뀌면 선택값 업데이트
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  // 계산 로직
  const taxAmount = orderData.subtotal * orderData.taxRate;
  // 1번 컴포넌트 로직 유지: Number()로 안전하게 변환 후 합산
  const total = Number(orderData.subtotal) + Number(orderData.shipping) + Number(taxAmount);

  // 드롭다운 외부 클릭 시 닫기 기능
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if(event.target instanceof Node && dropdownRef.current){
            if (!dropdownRef.current.contains(event.target)) {
              setIsOpen(false);
            }
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsOpen(false);
  };

  // 2번 컴포넌트 기능 이식: 주문하기 버튼 핸들러 (react-hot-toast 적용)
  const handlePlaceOrder = async () => {
    // 1. 유효성 검사
    if (!selectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }

    setIsOrdering(true); // 중복 클릭 방지 시작

    // 2. Toast Promise 적용
    await toast.promise(
        // 서버 액션 호출 (가격은 서버에서 계산하므로 addressId만 전달)
        createOrder(selectedAddress.id),
        {
            loading: 'Processing your order...',
            success: (result) => {
                if (!result.success) {
                    setIsOrdering(false); // 실패 시 버튼 다시 활성화
                    throw new Error(result.message);
                }
                // 성공 시 페이지 이동
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

      {/* [섹션 1] 주소 선택 (Custom Dropdown) */}
      <div className="mb-8 relative" ref={dropdownRef}>
        <label className="text-xs font-bold text-base-content/60 uppercase mb-2 block tracking-wide">
          Select Address
        </label>
        
        {/* 드롭다운 트리거 버튼 */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex justify-between items-center p-3 border rounded-full bg-base-100 text-left transition-all ${
            isOpen ? 'border-primary ring-1 ring-primary' : 'border-base-content/80 hover:border-base-content/40'
          } ${!selectedAddress ? 'border-error/50' : ''}`} // 2번 기능: 선택 안됐을 때 에러 스타일 추가
        >
          {/* truncate 클래스가 있어서 내용이 길어지면 자동으로 말줄임표(...) 처리됨 */}
          <span className="text-sm font-medium text-base-content truncate">
            {selectedAddress ? formatAddress(selectedAddress) : "Select an address"}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-base-content/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* 드롭다운 메뉴 리스트 */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {/* 주소 리스트 */}
            <ul className="max-h-60 overflow-y-auto">
              {addresses.map((addr) => (
                <li key={addr.id}>
                  <button
                    onClick={() => handleSelect(addr)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-base-200 flex items-center justify-between group"
                  >
                    <span className={`truncate mr-2 ${selectedAddress?.id === addr.id ? 'font-bold text-primary' : 'text-base-content'}`}>
                      {formatAddress(addr)}
                    </span>
                    {selectedAddress?.id === addr.id && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* [+ Add New Address] 버튼 영역 */}
            <div className="border-t border-base-200 ">
              <Link 
                href="/add-address"
                className="w-full flex items-center justify-center py-3 text-sm font-bold text-base-content/70 hover:text-primary hover:bg-base-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                + Add New Address
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* [섹션 2] 프로모션 코드 */}
      <div className="mb-8">
        <label className="text-xs font-bold text-base-content/60 uppercase mb-2 block tracking-wide">
          Promo Code
        </label>
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Enter promo code" 
            defaultValue=""
            className="input py-4 border-base-content/80 placeholder:text-base-content/80  w-full focus:input-primary  bg-base-100 h-10 text-sm"
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

        {/* 2번 컴포넌트 기능 이식: onClick 핸들러 및 로딩 상태 연결 */}
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