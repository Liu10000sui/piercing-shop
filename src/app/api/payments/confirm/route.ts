import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

function failUrl(origin: string, code: string, message: string) {
  const url = new URL("/checkout/fail", origin);
  url.searchParams.set("code", code);
  url.searchParams.set("message", message);
  return url;
}

/**
 * 토스 결제창에서 인증을 마치면 브라우저가 이 주소로 돌아옵니다.
 * 여기서 "진짜 결제"를 확정(승인)합니다. 금액과 성공 여부는 전적으로 서버가 판단합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amountParam = searchParams.get("amount");

  if (!paymentKey || !orderId || !amountParam) {
    return NextResponse.redirect(
      failUrl(origin, "INVALID_CALLBACK", "결제 정보가 올바르지 않습니다.")
    );
  }

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("shop_orders")
    .select("id, amount, status, user_id")
    .eq("order_code", orderId)
    .maybeSingle();

  if (!order) {
    return NextResponse.redirect(
      failUrl(origin, "ORDER_NOT_FOUND", "주문서를 찾을 수 없습니다.")
    );
  }

  // 이미 결제가 끝난 주문이면 아무것도 하지 않습니다. (새로고침해도 두 번 결제되지 않아요)
  if (order.status === "paid") {
    return NextResponse.redirect(new URL(`/orders/${order.id}`, origin));
  }

  // ★ 금액 검증: 주소로 넘어온 금액은 문자열이라 숫자로 바꿔서, 서버가 저장해둔 금액과 비교합니다.
  if (order.amount !== Number(amountParam)) {
    await admin.from("shop_orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.redirect(
      failUrl(origin, "AMOUNT_MISMATCH", "결제 금액이 주문 금액과 일치하지 않습니다.")
    );
  }

  // 시크릿 키 뒤에 콜론(:)을 반드시 붙여야 합니다. 토스 API의 인증 규칙이에요.
  const secretKey = process.env.TOSS_SECRET_KEY!;
  const authorization = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;

  const response = await fetch(TOSS_CONFIRM_URL, {
    method: "POST",
    headers: { Authorization: authorization, "Content-Type": "application/json" },
    body: JSON.stringify({ paymentKey, orderId, amount: order.amount }),
  });

  const payment = await response.json();

  // ALREADY_PROCESSED_PAYMENT는 "이미 승인된 결제"라는 뜻이라 성공으로 취급합니다.
  if (!response.ok && payment?.code !== "ALREADY_PROCESSED_PAYMENT") {
    await admin.from("shop_orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.redirect(
      failUrl(
        origin,
        payment?.code ?? "CONFIRM_FAILED",
        payment?.message ?? "결제 승인에 실패했습니다."
      )
    );
  }

  // status가 아직 pending인 행만 바꿉니다. 동시에 두 번 들어와도 한 번만 처리돼요.
  const { data: updated } = await admin
    .from("shop_orders")
    .update({
      status: "paid",
      payment_key: paymentKey,
      payment_method: payment?.method ?? null,
      receipt_url: payment?.receipt?.url ?? null,
      paid_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("id");

  if (updated && updated.length > 0) {
    await admin.rpc("shop_decrement_stock", { p_order_id: order.id });
    await admin.from("shop_cart_items").delete().eq("user_id", order.user_id);
  }

  return NextResponse.redirect(new URL(`/orders/${order.id}`, origin));
}
