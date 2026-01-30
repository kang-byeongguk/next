import { auth } from "@/auth";
import { fetchUserAddresses, fetchUserProducts } from "../lib/data";
import { removeItem } from "../lib/actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import QuantityControl from "../ui/cart/quantity-control-input";
import OrderSummary from "../ui/cart/order-summary";
import { ShoppingBag } from 'lucide-react';



export default async function CartPage() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }

  const [products, addresses] = await Promise.all([fetchUserProducts(session.user.id), fetchUserAddresses(session.user.id)]);

  // Empty View
  if (!products || products.length === 0) {
    return (
      <div className="min-h-[80vh] bg-base-100 flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-15 h-15 text-base-300" />
        <h2 className="text-2xl font-bold text-base-content">Your cart is empty</h2>
        <Link href="/product" className="btn btn-primary rounded-full">
          Start Shopping
        </Link>
      </div>
    );
  }

  const totalItems = products[0].count;

  return (
    <div className="min-h-screen bg-base-100 px-4 md:px-8 py-12 w-full max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-medium text-base-content">
          Your<span className="text-primary font-bold">Cart</span>
        </h1>
        <span className="text-base-content/60 text-lg font-semibold">{totalItems} Items</span>
      </div>

      <div className="w-full h-px bg-base-content/10 mb-8"></div>

      {/* Main Layout: LG 이상에서 2단 분리 (8:4 비율) */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-12 ">

        {/* [Left Column] Cart Items List */}
        <div className="lg:col-span-8">

          {/* Column Headers (비율 조정: 5:2:3:2) */}
          {/* 텍스트 공간 확보를 위해 첫번째 컬럼을 4->5로 늘리고, Price를 3->2로 줄임 */}
          <div className="grid grid-cols-12 gap-2 text-base-content/80 font-semibold text-sm md:text-base mb-6 text-left border-b border-base-content/5 pb-2">
            <div className="col-span-5 pl-1">Product Details</div>
            <div className="col-span-2 text-left">Price</div>
            <div className="col-span-3 text-left">Quantity</div>
            <div className="col-span-2 text-left">Subtotal</div>
          </div>

          {/* Items List */}
          <div className="flex flex-col gap-6 mb-12 lg:mb-0">
            {products.map((item) => (
              <div key={item.product_id} className="grid grid-cols-12 gap-2 items-center min-h-24">

                {/* [Col 1] Image & Title & Remove (5칸) */}
                <div className="col-span-5 flex flex-row items-start gap-3 md:gap-4 pr-2">
                  {/* 이미지 */}
                  <div className="bg-base-200 rounded-xl w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-contain p-1"
                    />
                  </div>

                  {/* 텍스트 정보 & 삭제 버튼 */}
                  <div className="flex flex-col justify-between h-full py-0.5 min-w-0">
                    {/* 제목: 2줄까지만 표시 (truncate logic) */}
                    <h3 className="text-sm font-medium text-base-content leading-tight line-clamp-2 overflow-hidden mb-1 md:mb-2" title={item.title}>
                      {item.title}
                    </h3>

                    {/* Remove 버튼: 텍스트 아래로 이동 */}
                    <form action={removeItem}>
                      <input type="hidden" name="productId" value={item.product_id} />
                      <button
                        type="submit"
                        className="text-error/80 text-xs font-medium hover:underline hover:text-error transition-colors flex items-center gap-1"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>

                {/* [Col 2] Price (2칸) */}
                <div className="col-span-2 text-left text-sm md:text-base font-semibold text-base-content/80 wrap-break-word">
                  {item.price}
                </div>

                {/* [Col 3] Quantity (3칸) */}
                <div className="col-span-3 pr-2">
                  <QuantityControl userId={session.user.id} productId={item.product_id} initialQuantity={item.quantity} />
                </div>

                {/* [Col 4] Subtotal (2칸) */}
                <div className="col-span-2 text-left text-sm md:text-base font-bold text-base-content wrap-break-word">
                  {item.subtotal}
                </div>

              </div>
            ))}

            {/* /product 링크 */}
            <div className="mt-8">
              <Link
                href="/product"
                className="group inline-flex items-center gap-2 text-primary font-medium text-sm md:text-base hover:opacity-80"
              >
                <div className="group-hover:transform group-hover:-translate-x-1 transition-transform">
                  <ArrowLeft size={18} />
                </div>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* [Right Column] Order Summary */}
        {/* lg 이상에서는 오른쪽 컬럼으로 이동, 그 전에는 하단에 배치 */}
        <div className="lg:col-span-4 w-full mt-4 lg:mt-0">
          <div className="sticky top-8">
            <OrderSummary addresses={addresses} subtotal={products[0].total_price} />
          </div>
        </div>

      </div>
    </div>
  );
}