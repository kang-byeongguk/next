// src/ui/product/filtered-products.tsx
import { fetchFilteredProducts } from "@/app/lib/data";
import ProductCards from "../product-cards";

export default async function FilteredProducts({
  query,
  sort,
  currentPage,
}: {
  query: string;
  sort: "newest" | "price_asc" | "price_desc" | "oldest";
  currentPage: number;
}) {
  const products = await fetchFilteredProducts(query, sort, currentPage);

  return <ProductCards products={products} />;
}