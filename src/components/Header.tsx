import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;
  if (user) {
    const { data } = await supabase
      .from("shop_cart_items")
      .select("quantity")
      .eq("user_id", user.id);
    cartCount = (data ?? []).reduce((sum, row) => sum + row.quantity, 0);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="shrink-0">
          <span className="text-chrome text-lg font-bold tracking-[0.18em] sm:text-xl">
            PIERCING &amp; CO
          </span>
          <span className="ml-2 text-sm font-light tracking-[0.3em] text-silver-dim">
            피어싱앤코
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/products"
            className="rounded-full px-3 py-2 text-silver transition hover:bg-panel-2 hover:text-silver-bright"
          >
            상품
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full px-3 py-2 text-silver transition hover:bg-panel-2 hover:text-silver-bright"
          >
            장바구니
            {cartCount > 0 && (
              <span className="absolute -top-0.5 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-silver px-1.5 text-[11px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                href="/orders"
                className="rounded-full px-3 py-2 text-silver transition hover:bg-panel-2 hover:text-silver-bright"
              >
                주문내역
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full px-3 py-2 text-silver-dim transition hover:bg-panel-2 hover:text-silver"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="chrome-button ml-1 rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
