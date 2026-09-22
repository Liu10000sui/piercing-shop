import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCategoryCovers, getFeaturedProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";

const HERO_IMAGE =
  "https://images.pexels.com/photos/28469072/pexels-photo-28469072.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop";

const MATERIALS = [
  {
    name: "서지컬스틸 316L",
    en: "Surgical Steel",
    desc: "의료용 기구에 쓰이는 규격. 가장 널리 쓰이는 기본 소재입니다.",
  },
  {
    name: "티타늄 G23",
    en: "Titanium",
    desc: "가볍고 금속 반응이 적어, 처음 뚫은 자리에 권하는 소재입니다.",
  },
  {
    name: "14K · 18K 골드",
    en: "Solid Gold",
    desc: "변색이 거의 없어 오래 착용할수록 진가가 드러납니다.",
  },
];

export default async function HomePage() {
  const [featured, covers] = await Promise.all([
    getFeaturedProducts(),
    getCategoryCovers(),
  ]);

  return (
    <>
      {/* ── 히어로 ── */}
      <section className="relative isolate flex min-h-[86vh] items-end overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          loading="eager"
          className="object-cover opacity-90 grayscale"
        />
        <div className="from-ink via-ink/45 to-ink/15 absolute inset-0 bg-gradient-to-t" />
        <div className="from-ink/85 via-ink/30 absolute inset-0 bg-gradient-to-r to-transparent" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 sm:pb-28">
          <p className="text-[11px] tracking-[0.55em] text-silver-dim uppercase">
            Piercing only
          </p>

          <h1 className="text-chrome font-display mt-6 text-5xl leading-[1.08] font-light tracking-tight sm:text-7xl">
            피어싱만
            <br />
            다룹니다
          </h1>

          <p className="mt-7 max-w-md text-sm leading-relaxed text-silver-dim sm:text-base">
            귀볼부터 셉텀, 배꼽까지. 뚫은 자리마다 맞는 규격이 따로 있습니다.
            <br className="hidden sm:block" />
            부위별로 맞는 것만 골라 담았습니다.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="chrome-button rounded-full px-8 py-3.5 text-sm font-semibold transition"
            >
              전체 상품 보기
            </Link>
            <Link
              href="/stores"
              className="rounded-full border border-line px-8 py-3.5 text-sm text-silver transition hover:border-silver-dim hover:text-silver-bright"
            >
              가까운 오프라인샵
            </Link>
          </div>
        </div>
      </section>

      {/* ── 소재 ── */}
      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-3">
          {MATERIALS.map((m) => (
            <div key={m.name} className="bg-ink px-6 py-10">
              <p className="text-[10px] tracking-[0.35em] text-silver-dim uppercase">
                {m.en}
              </p>
              <h3 className="font-display mt-3 text-lg text-silver-bright">{m.name}</h3>
              <p className="mt-3 text-xs leading-relaxed text-silver-dim">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 부위별 ── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.45em] text-silver-dim uppercase">
              By placement
            </p>
            <h2 className="text-chrome font-display mt-4 text-3xl font-light sm:text-4xl">
              부위별로 찾기
            </h2>
          </div>
          <Link
            href="/products"
            className="shrink-0 text-sm text-silver-dim underline underline-offset-4 transition hover:text-silver"
          >
            전체 보기
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-panel-2"
            >
              {covers[category.slug] && (
                <Image
                  src={covers[category.slug]}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-55 transition duration-700 group-hover:scale-110 group-hover:opacity-80"
                />
              )}
              <div className="from-ink/95 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] tracking-[0.3em] text-silver-dim uppercase">
                  {category.en}
                </p>
                <p className="font-display mt-1 text-lg text-silver-bright">
                  {category.ko}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 추천 상품 ── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[0.45em] text-silver-dim uppercase">
                Selected
              </p>
              <h2 className="text-chrome font-display mt-4 text-3xl font-light sm:text-4xl">
                이번 주 추천
              </h2>
              <p className="mt-3 text-sm text-silver-dim">
                가장 많이 찾는 기본형 위주로 골랐습니다.
              </p>
            </div>
            <Link
              href="/products"
              className="shrink-0 text-sm text-silver-dim underline underline-offset-4 transition hover:text-silver"
            >
              더 보기
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 오프라인샵 안내 ── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-24 text-center">
          <p className="text-[11px] tracking-[0.45em] text-silver-dim uppercase">
            Offline stores
          </p>
          <h2 className="text-chrome font-display mx-auto mt-6 max-w-2xl text-2xl leading-snug font-light sm:text-4xl">
            예쁜 피어싱 구경만 하지말고,
            <br />
            지금 당장 뚫으러 가세요!
          </h2>
          <p className="mt-6 text-sm text-silver-dim">
            현재 위치에서 5km 이내의 피어싱샵을 가까운 순으로 찾아드립니다.
          </p>
          <Link
            href="/stores"
            className="chrome-button mt-10 inline-block rounded-full px-8 py-3.5 text-sm font-semibold transition"
          >
            내 주변 매장 찾기
          </Link>
        </div>
      </section>
    </>
  );
}
