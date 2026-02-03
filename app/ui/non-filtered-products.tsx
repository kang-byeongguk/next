import { fetchLatestProducts } from "../lib/data";
import ProductCards from "./product-cards";

export default async function NonFilteredProducts(){
    const products = await fetchLatestProducts();
    return  <ProductCards products={products}/>
}