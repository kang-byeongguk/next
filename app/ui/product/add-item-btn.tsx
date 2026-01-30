'use client';

import { addItemsToCart } from "@/app/lib/actions";
import toast from "react-hot-toast";

export default function AddItemBtn({ id }: { id: string }) {
  

  const handleAddToCart = async () => {
    
    await toast.promise(
      addItemsToCart(id, 1),
      {
        loading: 'Adding item to cart...', 
        success: (result) => {
          if (result.status !== 'success') {
            throw new Error(result.message);
          }
          return result.message;
        },
        error: (err) => `${err.message}`,
      }
    ).catch(() => {}); 
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="btn bg-base-200 hover:bg-base-300 text-base-content border-none flex-1 h-12 md:h-14 text-lg font-medium rounded-xl transition-all active:scale-95"
    >
      Add to Cart
    </button>
  );
}