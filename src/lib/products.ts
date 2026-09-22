import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export async function getProducts(category?: string): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("shop_products").select("*").order("created_at", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw new Error(`상품을 불러오지 못했습니다: ${error.message}`);
  return data ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shop_products")
    .select("*")
    .eq("is_featured", true)
    .limit(4);

  if (error) throw new Error(`추천 상품을 불러오지 못했습니다: ${error.message}`);
  return data ?? [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("shop_products").select("*").eq("id", id).maybeSingle();
  return data;
}
