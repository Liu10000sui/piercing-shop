import Link from "next/link";
import type { ReactNode } from "react";

type Action = {
  href: string;
  label: string;
  icon: ReactNode;
};

const ACTIONS: Action[] = [
  {
    href: "/quiz",
    label: "피어싱 성향 테스트",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3.2 13.7 9c.15.5.55.9 1.05 1.05L20.5 11.7l-5.75 1.65c-.5.15-.9.55-1.05 1.05L12 20.2l-1.7-5.8c-.15-.5-.55-.9-1.05-1.05L3.5 11.7l5.75-1.65c.5-.15.9-.55 1.05-1.05L12 3.2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/stores",
    label: "가까운 오프라인샵 찾기",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
];

export default function FloatingActions() {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          aria-label={action.label}
          className="group flex items-center"
        >
          {/* 마우스를 올리면 왼쪽에서 펼쳐지는 설명 */}
          <span className="chrome-border pointer-events-none mr-2 max-w-0 overflow-hidden rounded-full py-2.5 text-sm whitespace-nowrap text-silver opacity-0 transition-all duration-300 group-hover:max-w-[220px] group-hover:px-4 group-hover:opacity-100">
            {action.label}
          </span>

          <span className="chrome-button flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-lg shadow-black/50 transition group-hover:scale-105">
            {action.icon}
          </span>
        </Link>
      ))}
    </div>
  );
}
