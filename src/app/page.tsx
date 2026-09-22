import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <section className="glow-top border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-24 text-center sm:py-32">
          <p className="text-xs tracking-[0.5em] text-silver-dim uppercase">Piercing only</p>
          <h1 className="text-chrome mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            피어싱만 다룹니다
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-silver-dim sm:text-base">
            귀볼부터 셉텀, 배꼽까지. 부위별로 맞는 규격과 소재만 골라 담았습니다.
            <br />
            서지컬스틸 316L · 티타늄 G23 · 14K 골드
          </p>
          <Link
            href="/products"
            className="chrome-button mt-10 inline-block rounded-full px-8 py-3.5 font-semibold transition"
          >
            전체 상품 보기
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-chrome text-2xl font-bold">부위별로 찾기</h2>
        <p className="mt-2 text-sm text-silver-dim">뚫은 자리에 맞는 규격이 따로 있어요.</p>
        <div className="mt-6">
          <CategoryTabs />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-chrome text-2xl font-bold">이번 주 추천</h2>
            <p className="mt-2 text-sm text-silver-dim">가장 많이 찾는 기본형 위주로 골랐습니다.</p>
          </div>
          <Link href="/products" className="text-sm text-silver-dim underline underline-offset-4 hover:text-silver">
            더 보기
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
