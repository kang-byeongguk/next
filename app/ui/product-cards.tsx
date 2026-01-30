import Link from "next/link";
import Image from "next/image";
import { FormattedProduct } from "@/app/lib/definitions";
import StarRating from "./star-rating";
import { HeartIcon } from "./icons";

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
        <HeartIcon/>

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

      {/* 텍스트 영역 */}
      <div className="mt-4 flex flex-col gap-0.5">
        <Link href={`/product/${product.id}`}>
          {/* 텍스트 색상: 테마 따라 자동 변경 */}
          <h3 className="text-base font-semibold text-base-content truncate">
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
        <span className="text-base font-semibold text-base-content">
          {product.price}
        </span>
        <button className="btn btn-xs btn-outline btn-primary ">buy now</button>
      </div>
    </div>
  );
}