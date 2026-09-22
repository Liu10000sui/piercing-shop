import type { Metadata } from "next";
import NearbyStores from "./NearbyStores";

export const metadata: Metadata = {
  title: "가까운 오프라인샵 · PIERCING & CO",
  description: "현재 위치에서 5km 이내의 피어싱샵을 가까운 순으로 찾아드립니다.",
};

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-chrome text-3xl font-bold tracking-tight">가까운 오프라인샵</h1>
      <p className="mt-2 text-sm text-silver-dim">
        현재 위치에서 5km 이내의 피어싱샵을 가까운 순으로 보여드려요.
      </p>

      <NearbyStores />
    </div>
  );
}
