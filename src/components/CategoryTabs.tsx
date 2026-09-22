import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export default function CategoryTabs({ active }: { active?: string }) {
  const tabs = [{ slug: "", ko: "전체", en: "All" }, ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = (active ?? "") === tab.slug;
        return (
          <Link
            key={tab.slug || "all"}
            href={tab.slug ? `/products?category=${tab.slug}` : "/products"}
            className={
              isActive
                ? "chrome-button rounded-full px-4 py-2 text-sm font-semibold"
                : "rounded-full border border-line px-4 py-2 text-sm text-silver-dim transition hover:border-silver-dim hover:text-silver"
            }
          >
            {tab.ko}
          </Link>
        );
      })}
    </div>
  );
}
