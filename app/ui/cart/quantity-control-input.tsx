'use client';

import { useState, useEffect } from "react";
import { updateCartItemQuantity } from "@/app/lib/actions";
import { useDebouncedCallback } from "use-debounce";
import { Quantity } from "@/app/lib/definitions";
import { TriangleLeft, TriangleRight } from "../icons";



export default function QuantityControl({ userId, productId, initialQuantity }: Quantity) {
  const [quantity, setQuantity] = useState<string>(String(initialQuantity));

  // DB 데이터가 외부에서 변했을 때 동기화
  useEffect(() => {
    setQuantity(String(initialQuantity));
  }, [initialQuantity]);

  // 서버 요청 함수 (0.3초 딜레이)
  const debouncedServerUpdate = useDebouncedCallback(async (targetQty: number) => {
    try {
      await updateCartItemQuantity(userId, productId, targetQty);
    } catch (error) {
      console.error(error);
      setQuantity(String(initialQuantity));
    }
  }, 300);

  // 버튼 용 함수, 1이하는 필터링
  const handleButtonUpdate = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(String(newQty));
    debouncedServerUpdate(newQty);
  };

  // 유저인풋 필터링 후 형식에 맞는 데이터만 수정 요청
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // 1. UI는 무조건 사용자가 입력한 대로 업데이트 (빈 칸 포함)
    setQuantity(rawValue);

    // 숫자 혹은 NaN
    const val = parseInt(rawValue);

    // 2. 유효성 검사 및 분기 처리
    if (!Number.isNaN(val) && val > 0) {
      debouncedServerUpdate(val);
    } else {
      debouncedServerUpdate.cancel();
    }
  };

  // 포커스 아웃 핸들러
  // parseInt는 빈문자열이거나 숫자 형식이 아니면 NaN을 반환
  const handleBlur = () => {
    if (quantity === "" || Number.isNaN(parseInt(quantity))) {
      setQuantity(String(initialQuantity));
    }
  };

  return (
    <div className="col-span-3 flex justify-start items-center transform">

      <button
        onClick={() => handleButtonUpdate(Number(quantity) - 1)}
        className="text-base-content/30 cursor-pointer hover:text-primary transition-colors"
        aria-label="Decrease quantity"
      >
        <TriangleLeft />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-10 h-8 text-center border border-base-200 rounded text-sm text-base-content font-medium focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        onClick={() => handleButtonUpdate(Number(quantity) + 1)}
        className="text-base-content/30 cursor-pointer hover:text-primary transition-colors"
        aria-label="Increase quantity"
      >
        <TriangleRight />
      </button>
    </div>
  );
}