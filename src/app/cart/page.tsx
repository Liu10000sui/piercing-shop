import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { removeFromCart, updateCartQuantity } from "@/lib/actions/cart";
import { cartTotal, getCartItems } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/types";

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=%2Fcart");

  const items = await getCartItems(user.id);
  const total = cartTotal(items);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-chrome text-3xl font-bold tracking-tight">장바구니</h1>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-silver-dim">장바구니가 비어 있어요.</p>
          <Link
            href="/products"
            className="chrome-button mt-6 inline-block rounded-lg px-6 py-3 font-semibold transition"
          >
            상품 보러 가기
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {items.map((item) => {
              const product = item.shop_products;
              if (!product) return null;

              return (
                <li key={item.id} className="chrome-border flex gap-4 rounded-2xl p-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-panel-2"
                  >
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-medium text-silver-bright hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 font-mono text-sm text-silver-dim">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <form action={updateCartQuantity} className="flex items-center gap-2">
                        <input type="hidden" name="itemId" value={item.id} />
                        <input
                          type="number"
                          name="quantity"
                          defaultValue={item.quantity}
                          min={1}
                          max={product.stock}
                          className="w-16 rounded-lg border border-line bg-panel px-2 py-1.5 text-center text-sm text-silver-bright outline-none focus:border-silver-dim"
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-line px-3 py-1.5 text-xs text-silver-dim transition hover:border-silver-dim hover:text-silver"
                        >
                          수량 변경
                        </button>
                      </form>

                      <form action={removeFromCart}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-lg px-3 py-1.5 text-xs text-silver-dim transition hover:text-red-300"
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </div>

                  <p className="shrink-0 self-end font-mono text-base font-semibold text-silver">
                    {formatPrice(product.price * item.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="chrome-border mt-8 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-silver-dim">총 결제금액</span>
              <span className="text-chrome font-mono text-2xl font-bold">
                {formatPrice(total)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="chrome-button mt-6 block rounded-lg py-3.5 text-center font-semibold transition"
            >
              주문하기
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
