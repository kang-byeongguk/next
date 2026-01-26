import { fetchProductById } from "@/app/lib/data"
import AddItemBtn from "@/app/ui/product/add-item-btn";
import BuyItemBtn from "@/app/ui/product/buy-item-btn";
import StarRating from "@/app/ui/start-rating";
import Image from "next/image"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await fetchProductById(id)
    
    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row p-6 md:p-16 justify-center gap-10 md:gap-16">
            
            {/* --- 왼쪽 이미지 섹션 --- */}
            <div className="w-full md:flex-1">
                <div className="flex flex-col gap-4 md:px-4">
                    <div className="relative w-full aspect-square bg-base-200 rounded-2xl overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-contain p-8" 
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative w-20 aspect-square bg-base-200 rounded-lg overflow-hidden border-2 border-primary/20 cursor-pointer">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-contain p-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 오른쪽 정보 섹션 --- */}
            <div className="md:flex-1 flex flex-col justify-start">
                <div className="flex flex-col gap-3 mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content tracking-tight">
                        {product.title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <StarRating size={5} />
                        <span className="text-sm font-medium text-base-content/60 pt-0.5">(4.5)</span>
                    </div>
                </div>

                <p className="text-base text-base-content/80 leading-relaxed mb-8">
                    {product.description}
                </p>

                <div className="mb-8">
                    <span className="text-4xl font-bold text-base-content">{product.price}</span>
                    <span className="text-lg text-base-content/40 line-through ml-3">$599.99</span> 
                </div>

                <hr className="border-t border-base-300 mb-8" />

                {/* 버튼 섹션 */}
                <div className="flex gap-4 mt-auto md:mt-0">
                    <AddItemBtn id={id}/>
                    <BuyItemBtn id={id}/>
                </div>
            </div>
        </div>
    )
}
