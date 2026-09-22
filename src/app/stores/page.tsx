import type { Metadata } from "next";
import NearbyStores from "./NearbyStores";

export const metadata: Metadata = {
  title: "가까운 오프라인샵 · PIERCING & CO",
  description: "현재 위치에서 5km 이내의 피어싱샵을 가까운 순으로 찾아드립니다.",
};

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs tracking-[0.4em] text-silver-dim uppercase">Offline stores</p>
      <h1 className="text-chrome mt-4 text-2xl leading-snug font-bold tracking-tight sm:text-4xl">
        예쁜 피어싱 구경만 하지말고,
        <br />
        지금 당장 뚫으러 가세요!
      </h1>
      <p className="mt-4 text-sm text-silver-dim">
        현재 위치에서 5km 이내의 피어싱샵을 가까운 순으로 보여드려요.
      </p>

      <NearbyStores />
    </div>
  );
}
