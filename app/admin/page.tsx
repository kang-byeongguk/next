import { fetchCardData, fetchRevenueChartData, fetchTopCategories } from '@/app/lib/data';
import DashboardCard from '../ui/admin/dashboard-card';
import RevenueChart from '../ui/admin/revenue-chart';
import TopCategoriesChart from '../ui/admin/top-categories-chart';
export default async function Page() {
    const [
        { totalSales, totalOrders, totalVisitors },
        chartData,
        topCategories
    ] = await Promise.all([
        fetchCardData(),
        fetchRevenueChartData(),
        fetchTopCategories()
    ]);


    return (
        <div className="max-w-7xl mx-auto">

            <div className="grid gap-6 sm:grid-cols-12 mt-10">
                {/* Sales Card */}
                <DashboardCard
                    title="Total Sales"
                    value={totalSales.value}
                    growth={totalSales.growth}
                    type="sales"
                />

                {/* Orders Card */}
                <DashboardCard
                    title="Total Orders"
                    value={totalOrders.value}
                    growth={totalOrders.growth}
                    type="orders"
                />

                {/* Visitors Card */}
                <DashboardCard
                    title="Total Visitors"
                    value={totalVisitors.value}
                    growth={totalVisitors.growth}
                    type="visitors"
                />
            </div>
            <div className="grid gap-6  lg:grid-cols-12 mt-10 mb-10">
                <div className="col-span-12 lg:col-span-8">
                    <RevenueChart data={chartData} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <TopCategoriesChart data={topCategories} />
                </div>

            </div>
        </div>
    );
}


