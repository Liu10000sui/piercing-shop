"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StoreFinderButton() {
  const pathname = usePathname();
  if (pathname === "/stores") return null;

  return (
    <Link
      href="/stores"
      aria-label="가까운 오프라인샵 찾기"
      className="group fixed right-6 bottom-6 z-50 flex items-center gap-0"
    >
      {/* 마우스를 올리면 왼쪽에서 펼쳐지는 설명 */}
      <span className="chrome-border pointer-events-none mr-2 max-w-0 overflow-hidden rounded-full py-2.5 text-sm whitespace-nowrap text-silver opacity-0 transition-all duration-300 group-hover:max-w-[220px] group-hover:px-4 group-hover:opacity-100">
        가까운 오프라인샵 찾기
      </span>

      <span className="chrome-button flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-lg shadow-black/50 transition group-hover:scale-105">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
    </Link>
  );
}
