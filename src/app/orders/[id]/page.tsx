import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  formatPrice,
  ORDER_STATUS_LABEL,
  type Order,
  type OrderItem,
} from "@/lib/types";

export default async function OrderDetailPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);

  // 보안 규칙(RLS) 덕분에 남의 주문은 애초에 조회되지 않습니다.
  const { data: order } = await supabase
    .from("shop_orders")
    .select("*")
    .eq("id", id)
    .maybeSingle<Order>();

  if (!order) notFound();

  const { data: itemData } = await supabase
    .from("shop_order_items")
    .select("*")
    .eq("order_id", order.id);

  const items = (itemData ?? []) as OrderItem[];
  const isPaid = order.status === "paid";

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <Link href="/orders" className="text-sm text-silver-dim hover:text-silver">
        ← 주문내역
      </Link>

      <div className="mt-6 text-center">
        <p
          className={`text-3xl font-bold ${isPaid ? "text-chrome" : "text-silver-dim"}`}
        >
          {isPaid ? "결제를 완료했어요" : ORDER_STATUS_LABEL[order.status]}
        </p>
        <p className="mt-3 font-mono text-xs text-silver-dim">{order.order_code}</p>
      </div>

      <section className="chrome-border mt-10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-silver-bright">주문 상품</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span className="text-silver-dim">
                {item.product_name}
                <span className="ml-1 text-silver-dim/70">× {item.quantity}</span>
              </span>
              <span className="shrink-0 font-mono text-silver">
                {formatPrice(item.unit_price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
          <span className="text-silver-dim">결제금액</span>
          <span className="text-chrome font-mono text-xl font-bold">
            {formatPrice(order.amount)}
          </span>
        </div>
      </section>

      <section className="chrome-border mt-4 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-silver-bright">배송지</h2>
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-silver-dim">받는 분</dt>
            <dd className="text-silver">{order.receiver_name}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-silver-dim">연락처</dt>
            <dd className="text-silver">{order.phone}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-silver-dim">주소</dt>
            <dd className="text-silver">{order.address}</dd>
          </div>
          {order.payment_method && (
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 text-silver-dim">결제수단</dt>
              <dd className="text-silver">{order.payment_method}</dd>
            </div>
          )}
        </dl>

        {order.receipt_url && (
          <a
            href={order.receipt_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-lg border border-line px-4 py-2 text-sm text-silver-dim transition hover:border-silver-dim hover:text-silver"
          >
            영수증 보기
          </a>
        )}
      </section>

      <Link
        href="/products"
        className="chrome-button mt-8 block rounded-lg py-3.5 text-center font-semibold transition"
      >
        쇼핑 계속하기
      </Link>
    </div>
  );
}
