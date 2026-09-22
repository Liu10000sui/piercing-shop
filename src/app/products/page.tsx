import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { categoryLabel } from "@/lib/types";

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { category } = await searchParams;
  const activeCategory = typeof category === "string" ? category : undefined;
  const products = await getProducts(activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-chrome text-3xl font-bold tracking-tight">
        {activeCategory ? `${categoryLabel(activeCategory)} 피어싱` : "전체 상품"}
      </h1>
      <p className="mt-2 text-sm text-silver-dim">{products.length}개의 상품</p>

      <div className="mt-8">
        <CategoryTabs active={activeCategory} />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-sm text-silver-dim">
          아직 이 부위의 상품이 없습니다.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
