import { fetchProductsPages } from "@/app/lib/data";
import Pagination from "./pagination";

export default async function PaginationWrapper({ query }: { query: string }) {
    const totalPages = await fetchProductsPages(query);

    return <Pagination totalPages={totalPages} />;
}