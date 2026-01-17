import postgres from "postgres";
import { Product } from "./definitions";
import { formatCurrency } from "./utils";
const sql=postgres(process.env.POSTGRES_URL!,{ssl:'require'});

export async function fetchLatestProducts(){
 try{
     const data = await sql<Product[]>`
     SELECT * 
     FROM products 
     ORDER BY created_at DESC
     LIMIT 10
     `;

     const latestProducts=data.map((product)=>{
      return({
         ...product,
         price:formatCurrency(product.price)
      })
     })
      return latestProducts;
 }catch(error){
    console.error('Database Error:',error);
    throw new Error('fetchProducts 함수 실행중 에러 발생')
 }
}

const PRODUCTS_PER_PAGE = 10;
export async function fetchFilteredProducts(
  query: string,
  sort:'newest' | 'price_asc' | 'price_desc' | 'oldest',
  currentPage: number,
) {
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const sortMap = {
    newest: sql`ORDER BY created_at DESC`,
    price_asc: sql`ORDER BY price ASC`,
    price_desc: sql`ORDER BY price DESC`,
    oldest: sql`ORDER BY created_at ASC`,
  };
  

  try {
    const data = await sql<Product[]>`
      SELECT *
      FROM products
      WHERE
        title ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} 
      ${sortMap[sort]}
      LIMIT ${PRODUCTS_PER_PAGE} OFFSET ${offset}
    `;
    const products=data.map((product)=>{
      return({
         ...product,
         price:formatCurrency(product.price)
      })
     })

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}


export async function fetchProductsPages(query: string){
  const PRODUCTS_PER_PAGE=10
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM products
      WHERE
        title ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} 
    `;

    const totalPages = Math.ceil(Number(data[0].count) / PRODUCTS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchProductById(id:string){
  try{
     const data = await sql<Product[]>`
     SELECT * 
     FROM products 
     WHERE id=${id};
     `;

     const product=data.map((product)=>{
      return({
         ...product,
         price:formatCurrency(product.price)
      })
     })
      return product[0];
 }catch(error){
    console.error('Database Error:',error);
    throw new Error('fetchProducts 함수 실행중 에러 발생')
 }
}
