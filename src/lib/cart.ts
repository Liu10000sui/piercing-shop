import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types";

// 로그인한 사람의 장바구니를 상품 정보와 함께 가져옵니다.
export async function getCartItems(userId: string): Promise<CartItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shop_cart_items")
    .select("*, shop_products(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`장바구니를 불러오지 못했습니다: ${error.message}`);
  return (data ?? []) as CartItem[];
}

export function cartTotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + (item.shop_products?.price ?? 0) * item.quantity,
    0
  );
}
