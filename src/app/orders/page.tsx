import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, ORDER_STATUS_LABEL, type Order } from "@/lib/types";

const STATUS_STYLE: Record<Order["status"], string> = {
  paid: "border-emerald-800/70 bg-emerald-950/40 text-emerald-300",
  pending: "border-line bg-panel-2 text-silver-dim",
  failed: "border-red-900/60 bg-red-950/40 text-red-300",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=%2Forders");

  const { data } = await supabase
    .from("shop_orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-chrome text-3xl font-bold tracking-tight">주문내역</h1>

      {orders.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-silver-dim">아직 주문한 상품이 없어요.</p>
          <Link
            href="/products"
            className="chrome-button mt-6 inline-block rounded-lg px-6 py-3 font-semibold transition"
          >
            상품 보러 가기
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="chrome-border flex items-center justify-between gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5"
              >
                <div className="min-w-0">
                  <p className="font-mono text-xs text-silver-dim">{order.order_code}</p>
                  <p className="mt-1.5 text-sm text-silver">
                    {new Date(order.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${STATUS_STYLE[order.status]}`}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                  <span className="font-mono text-base font-semibold text-silver-bright">
                    {formatPrice(order.amount)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
