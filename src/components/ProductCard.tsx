import Image from "next/image";
import Link from "next/link";
import { categoryLabel, formatPrice, type Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group chrome-border block overflow-hidden rounded-2xl transition hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-panel-2">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/70 text-sm font-semibold text-silver">
            품절
          </span>
        )}
      </div>

      <div className="space-y-1 p-4">
        <p className="text-xs tracking-widest text-silver-dim uppercase">
          {categoryLabel(product.category)} · {product.name_en}
        </p>
        <h3 className="text-sm font-medium text-silver-bright">{product.name}</h3>
        <p className="font-mono text-base font-semibold text-silver">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
