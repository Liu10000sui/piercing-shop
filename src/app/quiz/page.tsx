import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { isCategorySlug } from "@/lib/quiz";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "피어싱 성향 테스트 · PIERCING & CO",
  description: "6개의 질문으로 나에게 어울리는 피어싱 부위를 찾아보세요.",
};

export default async function QuizPage({ searchParams }: PageProps<"/quiz">) {
  const { result } = await searchParams;
  const initialResult =
    typeof result === "string" && isCategorySlug(result) ? result : null;

  const products = await getProducts();

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.45em] text-silver-dim uppercase">
          Piercing type test
        </p>
        <h1 className="text-chrome font-display mt-5 text-3xl leading-snug font-light sm:text-4xl">
          나에게 어울리는
          <br />
          피어싱은 어디일까?
        </h1>
      </div>

      <QuizClient products={products} initialResult={initialResult} />
    </div>
  );
}
