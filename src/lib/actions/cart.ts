"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser(nextPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return { supabase, user };
}

export async function addToCart(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));

  const { supabase, user } = await requireUser(`/products/${productId}`);

  // 이미 담은 상품이면 수량을 합칩니다.
  const { data: existing } = await supabase
    .from("shop_cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("shop_cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("shop_cart_items")
      .insert({ user_id: user.id, product_id: productId, quantity });
  }

  revalidatePath("/", "layout");
  redirect("/cart");
}

export async function updateCartQuantity(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);

  const { supabase, user } = await requireUser("/cart");

  if (quantity < 1) {
    await supabase.from("shop_cart_items").delete().eq("id", itemId).eq("user_id", user.id);
  } else {
    await supabase
      .from("shop_cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .eq("user_id", user.id);
  }

  revalidatePath("/", "layout");
}

export async function removeFromCart(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase, user } = await requireUser("/cart");

  await supabase.from("shop_cart_items").delete().eq("id", itemId).eq("user_id", user.id);

  revalidatePath("/", "layout");
}
