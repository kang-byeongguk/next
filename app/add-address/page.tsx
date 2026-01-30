'use client';

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useActionState } from "react";
import { addAddress } from "@/app/lib/actions"; // 경로가 맞는지 확인해주세요
import { FormInput } from "../ui/add-address/form-input";
import { FormError } from "../ui/add-address/form-error";

export default function AddAddressPage() {
  const [state, formAction] = useActionState(addAddress, { message: null, errors: {} });

  return (
    <div className="bg-base-100 flex items-center justify-center py-5 px-4 md:px-8">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* 페이지 타이틀 */}
        <div className="mb-6 pl-1">
          <h1 className="text-2xl font-bold text-base-content">
            Add Shipping <span className="text-primary">Address</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* [Left Side] 입력 폼 영역 */}
          <div className="md:col-span-7 lg:col-span-7 min-w-0">
            <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-200 p-6 md:p-8">
              
              <form action={formAction} className="flex flex-col gap-4">

                {/* 이름 & 전화번호 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Full Name"
                    name="fullName"
                    placeholder="e.g. Gildong Hong"
                    error={state.errors?.fullName}
                  />
                  <FormInput
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    placeholder="010-1234-5678"
                    error={state.errors?.phoneNumber}
                  />
                </div>

                {/* 우편번호 & 위치 찾기 버튼 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Pin Code"
                    name="pinCode"
                    placeholder="Zip Code"
                    error={state.errors?.pinCode}
                  />
                  {/* Locate Me 버튼 */}
                  <div className="w-full">
                    <label className="label invisible mb-1 h-5">
                      <span className="label-text">Locate</span>
                    </label>
                    <button
                      type="button"
                      className="btn btn-outline btn-primary w-full h-10 min-h-0 gap-2 font-medium text-sm leading-tight"
                    >
                      <MapPin size={16} />
                      Locate Me
                    </button>
                  </div>
                </div>

                {/* 상세 주소  */}
                <div className="w-full">
                  <label htmlFor="addressDetail" className="label mb-1 h-5">
                    <span className="label-text font-bold text-base-content/70 text-xs uppercase">
                      Address
                    </span>
                  </label>
                  <textarea
                    id="addressDetail"
                    name="addressDetail"
                    placeholder="Apartment, Studio, or Floor"
                    className="textarea textarea-bordered h-20 w-full focus:textarea-primary text-sm resize-none leading-relaxed border-base-content/20"
                  ></textarea>
                  <FormError message={state.errors?.addressDetail} />
                </div>

                {/* 도시 & 주 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="City"
                    name="city"
                    placeholder="City"
                    error={state.errors?.city}
                  />
                  <FormInput
                    label="State"
                    name="state"
                    placeholder="State"
                    error={state.errors?.state}
                  />
                </div>

                <div className="divider my-1"></div>

                {/* 하단 버튼 그룹 */}
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="/cart"
                    className="btn btn-sm btn-ghost text-base-content/60 font-medium hover:text-base-content h-10"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 max-w-50 font-bold h-10 min-h-0 shadow-md hover:brightness-110"
                  >
                    SAVE ADDRESS
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* [Right Side] 일러스트 영역 */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-5 flex-col items-center justify-start sticky top-6 min-w-0">
            <div className="relative w-full aspect-square max-h-100 bg-base-100 rounded-3xl border border-base-200 shadow-lg flex items-center justify-center overflow-hidden mb-4">
              {/* 일러스트 애니메이션 */}
              <div className="flex flex-col items-center gap-4 p-8 text-base-content/20 animate-pulse scale-90">
                <div className="w-32 h-52 border-4 border-current rounded-4xl relative flex flex-col items-center justify-center">
                  <div className="w-10 h-1 bg-current absolute top-4 rounded-full"></div>
                  <MapPin size={48} className="text-primary/40 mb-2" />
                </div>
                <p className="font-semibold text-base-content/40">Secure Delivery</p>
              </div>
            </div>

            <div className="text-center px-4">
              <p className="text-xs text-base-content/60 leading-relaxed">
                We currently offer shipping to selected locations.
                Please ensure your details are correct.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}