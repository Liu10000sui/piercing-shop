export type Product = {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  category: string;
  material: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  is_featured: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  shop_products: Product | null;
};

export type OrderStatus = "pending" | "paid" | "failed";

export type Order = {
  id: string;
  order_code: string;
  user_id: string;
  amount: number;
  status: OrderStatus;
  payment_key: string | null;
  payment_method: string | null;
  receipt_url: string | null;
  receiver_name: string;
  phone: string;
  address: string;
  created_at: string;
  paid_at: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

// 피어싱 부위별 분류. slug는 주소(URL)에, ko/en은 화면에 씁니다.
export const CATEGORIES = [
  { slug: "lobe", ko: "귀볼", en: "Lobe" },
  { slug: "helix", ko: "헬릭스", en: "Helix" },
  { slug: "tragus", ko: "트라거스", en: "Tragus" },
  { slug: "industrial", ko: "인더스트리얼", en: "Industrial" },
  { slug: "nostril", ko: "코", en: "Nostril" },
  { slug: "septum", ko: "셉텀", en: "Septum" },
  { slug: "lip", ko: "입술", en: "Lip" },
  { slug: "navel", ko: "배꼽", en: "Navel" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.ko ?? slug;
}

export function formatPrice(won: number) {
  return `${won.toLocaleString("ko-KR")}원`;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  failed: "결제 실패",
};
