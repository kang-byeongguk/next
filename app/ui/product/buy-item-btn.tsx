'use client';

import { addItemsToCart } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BuyItemBtn({ id }: { id: string }) {
    const { push } = useRouter();

    const handleAddToCart = async () => {

        await toast.promise(
            addItemsToCart(id, 1),
            {
                loading: 'Adding item to cart...',
                success: (result) => {
                    if (result.status !== 'success') {
                        throw new Error(result.message);
                    }
                    push('/cart');
                    return result.message;
                },
                error: (err) => `${err.message}`,
            }
        ).catch(() => { });
    };

    return (

        <button onClick={handleAddToCart} className="btn btn-primary w-1/2 h-12 md:h-14 text-lg  font-medium rounded-xl shadow-lg shadow-primary/30">
            Buy now
        </button>
    );
}