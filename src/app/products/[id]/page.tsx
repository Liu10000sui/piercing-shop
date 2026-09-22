import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCart } from "@/lib/actions/cart";
import { getProduct } from "@/lib/products";
import { categoryLabel, formatPrice } from "@/lib/types";

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const soldOut = product.stock === 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link href="/products" className="text-sm text-silver-dim hover:text-silver">
        ← 상품 목록
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="chrome-border relative aspect-square overflow-hidden rounded-2xl">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] text-silver-dim uppercase">
            {categoryLabel(product.category)} · {product.name_en}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-silver-bright">{product.name}</h1>
          <p className="text-chrome mt-4 font-mono text-3xl font-bold">
            {formatPrice(product.price)}
          </p>

          <dl className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 text-silver-dim">소재</dt>
              <dd className="text-silver">{product.material}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 text-silver-dim">부위</dt>
              <dd className="text-silver">{categoryLabel(product.category)}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 text-silver-dim">재고</dt>
              <dd className="text-silver">{soldOut ? "품절" : `${product.stock}개`}</dd>
            </div>
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-silver-dim">{product.description}</p>

          <form action={addToCart} className="mt-8 flex gap-3">
            <input type="hidden" name="productId" value={product.id} />
            <input
              type="number"
              name="quantity"
              defaultValue={1}
              min={1}
              max={Math.max(1, product.stock)}
              disabled={soldOut}
              className="w-20 rounded-lg border border-line bg-panel px-3 py-3 text-center text-silver-bright outline-none focus:border-silver-dim"
            />
            <button
              type="submit"
              disabled={soldOut}
              className="chrome-button flex-1 rounded-lg py-3 font-semibold transition"
            >
              {soldOut ? "품절" : "장바구니에 담기"}
            </button>
          </form>

          <p className="mt-4 text-xs text-silver-dim">
            연습용 사이트입니다. 결제는 토스페이먼츠 테스트 모드로만 진행돼요.
          </p>
        </div>
      </div>
    </div>
  );
}
