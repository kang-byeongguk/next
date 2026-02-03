import { Suspense } from "react";
import { SearchParams } from "../lib/definitions";
import SortSelect from "../ui/product/filter";
import FilteredProducts from "../ui/product/filtered-products";
import Search from "../ui/product/search";
import { ProductGridSkeleton } from "../ui/product-cards-skeleton";
import PaginationWrapper from "../ui/product/pagination-wrapper";
import PaginationSkeleton from "../ui/product/pagination-skeleton";



export default async function Page(props: {
    searchParams: Promise<SearchParams>
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const sort = searchParams?.sort || 'newest';
    const currentPage = Number(searchParams?.page) || 1;
    return (
        <div className="py-6 px-5 md:px-20 max-w-7xl mx-auto">
            <div className="flex flex-col mt-8">
                <div className="flex items-center justify-between gap-4 mb-10">
                    <h1 className="text-xl sm:text-3xl font-semibold text-base-content w-fit border-b-3 border-primary pb-0.5">Products</h1>
                    <div className="flex items-center gap-2">
                        <Search />
                        <SortSelect />
                    </div>
                </div>
                {/* <ProductCards products={products} /> */}
                <Suspense fallback={<ProductGridSkeleton />}>
                    <FilteredProducts query={query} sort={sort} currentPage={currentPage} />
                </Suspense>
            </div>
            <div className="mt-5 flex w-full justify-center">
                <Suspense fallback={<PaginationSkeleton />}>
                    <PaginationWrapper query={query} />
                </Suspense>
            </div>
        </div>
    )

}
