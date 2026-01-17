import Link from "next/link";
import Image from "next/image";
import { FormattedProduct } from "@/app/lib/definitions";
import StarRating from "./start-rating";

export default async function ProductCards({ products }: { products: FormattedProduct[] }) {


  return (
    <div className="w-full pb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: FormattedProduct }) {
  return (
    <div className=" flex flex-col">
      <div className="relative w-full aspect-square bg-base-200 rounded-2xl overflow-hidden">

        {/* 하트 아이콘 */}
        <button className="absolute top-3 right-3 z-10 p-2 bg-base-100 rounded-full shadow-sm text-base-content/40 hover:text-red-500 hover:bg-red-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* 상품 이미지 */}
        <Link href={`/product/${product.id}`} className="block w-full h-full p-6 group">
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          </div>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-0.5">
        <Link href={`/product/${product.id}`}>
          {/* 텍스트 색상: 테마 따라 자동 변경 */}
          <h3 className="text-medium font-semibold text-base-content truncate">
            {product.title}
          </h3>
        </Link>
        {/* 별점 */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-base-content/75">4.5</span>
          <StarRating size={3} />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-medium font-semibold text-base-content">
          {product.price}
        </span>
        <button className="btn btn-xs btn-outline btn-primary ">buy now</button>
      </div>
    </div>
  );
}