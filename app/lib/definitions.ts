// [1] Users 테이블
export type User = {
  id: string;
  email: string;
  password: string | null; // 비밀번호는 소셜 로그인 시 없을 수 있음
  name: string | null;
  image: string | null;
  provider: string; // 'credentials' | 'kakao' 등
  role:string;
  created_at: Date;
};

// [2] Products 테이블
export type Product = {
  id: string;
  title: string;
  price: number; // 센트 단위 정수 (예: $10.99 -> 1099)
  description: string | null;
  image: string;
  user_id: string | null; // 판매자(등록자) ID
  created_at: Date;
};

// [3] Carts 테이블
export type Cart = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: Date;
};

export type UserProduct={
  image:string;
  title:string;
  price:number;
  quantity:number;
  subtotal:number;
  product_id:string;
  total_price:number;
  count:number;
}
export type FormattedUserProduct = Omit<UserProduct, 'price' | 'subtotal' >&{
  price:string;
  subtotal:string;
  formatted_total_price:string;
}
export type Order = {
  id: string;
  user_id: string | null; // 탈퇴한 유저일 경우 null 가능
  product_id: string | null; // 삭제된 상품일 경우 null 가능
  quantity: number;
  price: number; // 주문 당시 가격 (센트 단위)
  product_title: string | null;
  created_at: Date;
};

export type FormattedProduct=Omit<Product,'price'>&{
  price:string;
};

export interface Address {
  id: string;
  full_name: string;
  address_detail: string;
  city: string;
  state: string;
  pin_code: string;
  phone_number: string;
}

interface OrderSummaryProps {
  addresses: Address[];
  subtotal: number; // 서버에서 계산된 합계
}