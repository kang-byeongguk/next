import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchUserOrderItems } from "../lib/data";
import { Package } from "lucide-react";
import { OrderCardMobile } from "../ui/my-orders/order-card-mobile";
import { OrderRowDesktop } from "../ui/my-orders/order-row-desktop";

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const orderRows = await fetchUserOrderItems(session.user.id);

  return (
    <div className="min-h-screen bg-base-100 px-4 md:px-8 py-12 w-full max-w-7xl mx-auto">

      {/* 헤더 타이틀 */}
      <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-8 md:mb-12 w-fit border-b-3 border-primary pb-0.5 ">
        My <span className="text-primary">Orders</span>
      </h1>

      {orderRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-base-200 border-dashed rounded-xl">
          <Package className="w-16 h-16 text-base-content/20 mb-4" />
          <p className="text-base-content/60 text-lg">No orders found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-0">
          {orderRows.map((row) => {
            const rowKey = `${row.order_id}-${row.item.product_id}`;

            return (
              <div key={rowKey}>
                {/* 모바일용 카드 */}
                <OrderCardMobile row={row} />
                
                {/* 데스크탑용 행 */}
                <OrderRowDesktop row={row} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}