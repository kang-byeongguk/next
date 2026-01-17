import { fetchFilteredProducts, fetchLatestProducts, fetchProductsPages } from "../lib/data";
import ProductCards from "../ui/product-cards";
import SortSelect from "../ui/product/filter";
import Pagination from "../ui/product/pagination";
import Search from "../ui/product/search";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        sort?: 'newest' | 'price_asc' | 'price_desc' | 'oldest';
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const sort = searchParams?.sort || 'newest';
    const currentPage = Number(searchParams?.page) || 1;
    const [products,totalPages] = await Promise.all([fetchFilteredProducts(query, sort, currentPage),fetchProductsPages(query)]) 
    return (
        <div className="p-6 px-5 md:px-20">
            <div className="flex flex-col mt-8">
                <div className="flex items-center justify-between gap-4 mb-10">
                    <h1 className="text-3xl font-semibold text-base-content w-fit border-b-3 border-primary pb-0.5">Products</h1>
                    <div className="flex items-center justify- gap-2">
                        <Search />
                        <SortSelect />
                    </div>
                </div>
                <ProductCards products={products} />
            </div>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )

}
