'use client'; // useActionState 등을 쓴다고 가정하므로 client 컴포넌트로 전환 고려 필요, 현재는 UI 구조만 잡음

// import { useActionState } from "react"; 
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useActionState } from "react";
import { addAddress } from "../lib/actions";

// [Helper] 에러 메시지 컴포넌트 (공간 확보 및 스타일)
// 실제로는 state.errors?.fieldName 등으로 들어갈 부분입니다.
function ErrorMessage({ message }: { message?: string[] | string }) {
  if (!message) return null; // 에러가 없으면 렌더링 안 함 (혹은 빈공간 유지하려면 <div className="h-4" />)
  return (
    <p className="text-error text-xs mt-1 font-medium animate-in slide-in-from-top-1 fade-in duration-200">
      {Array.isArray(message) ? message[0] : message}
    </p>
  );
}

export default function AddAddressPage() {
 const [state,formAction]=useActionState(addAddress,{message:null,errors:{}})

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-10 px-4 md:px-8">
      
      <div className="w-full max-w-6xl mx-auto">
        
        <div className="mb-6 pl-1">
           <h1 className="text-2xl font-bold text-base-content">
            Add Shipping <span className="text-primary">Address</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* [Left Side] 입력 폼 카드 */}
          <div className="md:col-span-7 lg:col-span-7 min-w-0">
            
  
            <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-200 p-6 md:p-8">
              
              <form action={formAction} className="flex flex-col gap-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className=" w-full">
                    <label className="label pt-0 mb-1 h-5">
                      <span className="label-text font-bold text-base-content/70 text-xs uppercase">Full Name</span>
                    </label>
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="e.g. Gildong Hong" 
                      className="input input-bordered w-full h-10 text-sm focus:input-primary" 
                    />
                    {/* 3. 에러 메시지 공간 */}
                    <ErrorMessage message={state.errors?.fullName} />
                  </div>

                  <div className=" w-full">
                    <label className="label pt-0 mb-1 h-5">
                      <span className="label-text font-bold text-base-content/70 text-xs uppercase">Phone Number</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      placeholder="010-1234-5678" 
                      className="input input-bordered w-full h-10 text-sm focus:input-primary" 
                    />
                    <ErrorMessage message={state.errors?.phoneNumber} />
                  </div>
                </div>

                {/* [Row 2] Pin Code & Locate Me */}
                <div className="grid grid-cols-2 gap-4">
                   <div className=" w-full">
                    <label className="label mb-1 h-5">
                      <span className="label-text font-bold text-base-content/70 text-xs uppercase">Pin Code</span>
                    </label>
                    <input 
                      type="text" 
                      name="pinCode"
                      placeholder="Zip Code" 
                      className="input input-bordered w-full h-10 text-sm focus:input-primary" 
                    />
                    <ErrorMessage message={state.errors?.pinCode} />
                  </div>
                   <div className=" w-full">
                     <label className="label invisible mb-1 h-5">
                        <span className="label-text">Locate</span>
                     </label>
                     <button type="button" className="btn btn-outline btn-primary w-full h-10 min-h-0 gap-2 font-medium text-sm">
                        <MapPin size={16} />
                        Locate Me
                     </button>
                  </div>
                </div>

                {/* [Row 3] Address (Textarea 높이 축소: h-24) */}
                <div className=" w-full">
                  <label className="label mb-1 h-5">
                    <span className="label-text font-bold text-base-content/70 text-xs uppercase">Address</span>
                  </label>
                  <textarea 
                    name="addressDetail"
                    placeholder="Apartment, Studio, or Floor" 
                    className="textarea textarea-bordered h-20 w-full focus:textarea-primary text-sm resize-none leading-relaxed"
                  ></textarea>
                  {/* Address 에러 메시지 */}
                  <ErrorMessage message={state.errors?.addressDetail} />
                </div>

                {/* [Row 4] City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className=" w-full">
                    <label className="label mb-1 h-5">
                      <span className="label-text font-bold text-base-content/70 text-xs uppercase">City</span>
                    </label>
                    <input 
                      type="text" 
                      name="city"
                      placeholder="City" 
                      className="input input-bordered w-full h-10 text-sm focus:input-primary" 
                    />
                    <ErrorMessage message={state.errors?.city}/>
                  </div>
                  <div className=" w-full">
                    <label className="label mb-1 h-5">
                      <span className="label-text font-bold text-base-content/70 text-xs uppercase">State</span>
                    </label>
                    <input 
                      type="text" 
                      name="state"
                      placeholder="State" 
                      className="input input-bordered w-full h-10 text-sm focus:input-primary" 
                    />
                    <ErrorMessage message={state.errors?.state}/>
                  </div>
                </div>

                <div className="divider my-1"></div>

                {/* Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="/cart"
                    className="btn btn-sm btn-ghost text-base-content/60 font-medium hover:text-base-content h-10"
                  >
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary flex-1 max-w-50  font-bold h-10 min-h-0 shadow-md hover:brightness-110"
                  >
                    SAVE ADDRESS
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* [Right Side] 일러스트 (화면 높이 맞춤) */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-5 flex-col items-center justify-start sticky top-6 min-w-0">
            <div className="relative w-full aspect-square max-h-[400px] bg-base-100 rounded-3xl border border-base-200 shadow-lg flex items-center justify-center overflow-hidden mb-4">
               {/* 일러스트 Placeholder */}
               <div className="flex flex-col items-center gap-4 p-8 text-base-content/20 animate-pulse scale-90">
                  <div className="w-32 h-52 border-4 border-current rounded-[2rem] relative flex flex-col items-center justify-center">
                      <div className="w-10 h-1 bg-current absolute top-4 rounded-full"></div>
                      <MapPin size={48} className="text-primary/40 mb-2" />
                  </div>
                  <p className="font-semibold text-base-content/40">Secure Delivery</p>
               </div>
            </div>
            
            <div className=" text-center px-4">
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