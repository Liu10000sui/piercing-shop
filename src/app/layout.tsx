import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import Header from "@/components/Header";
import StoreFinderButton from "@/components/StoreFinderButton";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// 제목에 쓰는 명조 계열. 주얼리 브랜드 특유의 단정한 인상을 줍니다.
const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PIERCING & CO 피어싱앤코",
  description: "피어싱만 전문으로 다루는 온라인 스토어. 서지컬스틸·티타늄·14K 주얼리.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${notoSerifKr.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <StoreFinderButton />
        <footer className="border-t border-line mt-24">
          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-silver-dim">
            <p className="text-chrome text-base font-medium">PIERCING &amp; CO 피어싱앤코</p>
            <p className="mt-2">피어싱 전문 스토어 · 서지컬스틸 / 티타늄 / 14K</p>
            <p className="mt-4 text-xs">
              연습용으로 만든 사이트입니다. 결제는 토스페이먼츠 테스트 모드로 동작하며 실제로
              결제되지 않습니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
