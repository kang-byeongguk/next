import Link from 'next/link';
import Carousel from './ui/carousel';
import ProductCards from './ui/product-cards';
import Footer from './ui/footer';
import { fetchLatestProducts } from './lib/data';

export default async function Home() {
  const products = await fetchLatestProducts();
  return (
    <main className="min-h-screen bg-base-100 ">
      <div className="w-full flex flex-col gap-12 p-6 px-5 md:px-20">
        <Carousel />
        <div className="flex flex-col mt-8">
          <h1 className="text-3xl font-semibold text-base-content mb-6 w-fit border-b-3 border-primary pb-0.5">New Arrivals</h1>
          <ProductCards products={products}  />
        </div>
        <div className="flex justify-center items-center">
          <Link href="/product">
            <button className="btn btn-outline text-base-content hover:bg-base-content/5  px-20">See more</button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
