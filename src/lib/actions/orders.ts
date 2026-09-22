"use server";

import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type Shipping = {
  receiverName: string;
  phone: string;
  address: string;
};

export type CreateOrderResult =
  | {
      ok: true;
      orderCode: string;
      orderName: string;
      amount: number;
      customerName: string;
      customerEmail: string;
    }
  | { ok: false; error: string };

type CartRow = {
  quantity: number;
  shop_products: {
    id: string;
    name: string;
    price: number;
    stock: number;
  } | null;
};

// 토스에 보낼 주문번호. 영문/숫자/하이픈만 쓰고 6~64자 안에 들어와야 합니다.
function generateOrderCode() {
  const time = Date.now().toString(36).toUpperCase();
  const random = randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  return `PCO-${time}-${random}`;
}

/**
 * 결제를 요청하기 "전에" 주문서를 서버에 먼저 저장합니다.
 * 금액은 브라우저가 보낸 값을 쓰지 않고, 장바구니를 서버에서 다시 읽어 DB 가격으로 계산합니다.
 */
export async function createOrder(shipping: Shipping): Promise<CreateOrderResult> {
  const receiverName = shipping.receiverName.trim();
  const phone = shipping.phone.trim();
  const address = shipping.address.trim();

  if (!receiverName || !phone || !address) {
    return { ok: false, error: "받는 분, 연락처, 주소를 모두 입력해주세요." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { data, error } = await supabase
    .from("shop_cart_items")
    .select("quantity, shop_products(id, name, price, stock)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return { ok: false, error: "장바구니를 불러오지 못했습니다." };

  const rows = (data ?? []) as unknown as CartRow[];
  const lines = rows.filter((row) => row.shop_products !== null);

  if (lines.length === 0) return { ok: false, error: "장바구니가 비어 있습니다." };

  for (const line of lines) {
    const product = line.shop_products!;
    if (product.stock < line.quantity) {
      return {
        ok: false,
        error: `'${product.name}'의 재고가 부족합니다. (남은 수량 ${product.stock}개)`,
      };
    }
  }

  const amount = lines.reduce(
    (sum, line) => sum + line.shop_products!.price * line.quantity,
    0
  );

  const firstName = lines[0].shop_products!.name;
  const orderName =
    lines.length > 1 ? `${firstName} 외 ${lines.length - 1}건` : firstName;

  // 주문 테이블은 브라우저에서 쓸 수 없게 잠겨 있어서, 서버 전용 연결로 저장합니다.
  const admin = createAdminClient();
  const orderCode = generateOrderCode();

  const { data: order, error: orderError } = await admin
    .from("shop_orders")
    .insert({
      order_code: orderCode,
      user_id: user.id,
      amount,
      status: "pending",
      receiver_name: receiverName,
      phone,
      address,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: "주문서를 만들지 못했습니다. 잠시 후 다시 시도해주세요." };
  }

  const { error: itemsError } = await admin.from("shop_order_items").insert(
    lines.map((line) => ({
      order_id: order.id,
      product_id: line.shop_products!.id,
      product_name: line.shop_products!.name,
      unit_price: line.shop_products!.price,
      quantity: line.quantity,
    }))
  );

  if (itemsError) {
    await admin.from("shop_orders").delete().eq("id", order.id);
    return { ok: false, error: "주문 상품을 저장하지 못했습니다. 다시 시도해주세요." };
  }

  return {
    ok: true,
    orderCode,
    orderName,
    amount,
    customerName: receiverName,
    customerEmail: user.email ?? "",
  };
}
