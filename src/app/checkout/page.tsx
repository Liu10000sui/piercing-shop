import { redirect } from "next/navigation";
import { cartTotal, getCartItems } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/types";
import CheckoutWidget from "./CheckoutWidget";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=%2Fcheckout");

  const items = await getCartItems(user.id);
  if (items.length === 0) redirect("/cart");

  const total = cartTotal(items);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-chrome text-3xl font-bold tracking-tight">주문 / 결제</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <CheckoutWidget
          amount={total}
          customerKey={user.id}
          customerEmail={user.email ?? ""}
        />

        <aside className="chrome-border h-fit rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-silver-bright">주문 상품</h2>

          <ul className="mt-5 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="min-w-0 text-silver-dim">
                  {item.shop_products?.name}
                  <span className="ml-1 text-silver-dim/70">× {item.quantity}</span>
                </span>
                <span className="shrink-0 font-mono text-silver">
                  {formatPrice((item.shop_products?.price ?? 0) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
            <span className="text-silver-dim">총 결제금액</span>
            <span className="text-chrome font-mono text-xl font-bold">
              {formatPrice(total)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
