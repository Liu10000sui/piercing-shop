"use client";

import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { PERSONAS, QUIZ_QUESTIONS, scoreAnswers } from "@/lib/quiz";
import { categoryLabel, type CategorySlug, type Product } from "@/lib/types";

type Props = {
  products: Product[];
  initialResult: CategorySlug | null;
};

export default function QuizClient({ products, initialResult }: Props) {
  const [started, setStarted] = useState(initialResult !== null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<CategorySlug | null>(initialResult);
  const [copied, setCopied] = useState(false);

  function choose(optionIndex: number) {
    const next = [...answers, optionIndex];

    if (next.length === QUIZ_QUESTIONS.length) {
      const slug = scoreAnswers(next);
      setResult(slug);
      // 결과를 주소에 남겨두면 친구에게 링크로 보낼 수 있습니다.
      window.history.replaceState(null, "", `/quiz?result=${slug}`);
    }
    setAnswers(next);
  }

  function restart() {
    setAnswers([]);
    setResult(null);
    setStarted(true);
    setCopied(false);
    window.history.replaceState(null, "", "/quiz");
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "내 피어싱 성향은?", url });
        return;
      } catch {
        // 사용자가 공유를 취소한 경우 — 복사로 넘어갑니다.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  /* ── 결과 ── */
  if (result) {
    const persona = PERSONAS[result];
    const picks = products.filter((p) => p.category === result).slice(0, 3);

    return (
      <div className="mt-12">
        <p className="text-center text-[11px] tracking-[0.45em] text-silver-dim uppercase">
          Your result
        </p>
        <h2 className="text-chrome font-display mt-5 text-center text-4xl font-light sm:text-5xl">
          {persona.title}
        </h2>
        <p className="mt-4 text-center text-sm text-silver">{persona.tagline}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {persona.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-line px-4 py-1.5 text-xs text-silver-dim"
            >
              #{k}
            </span>
          ))}
        </div>

        <div className="chrome-border mx-auto mt-10 max-w-2xl rounded-2xl p-7">
          <p className="text-[10px] tracking-[0.3em] text-silver-dim uppercase">
            Recommended placement
          </p>
          <p className="font-display mt-2 text-2xl text-silver-bright">
            {categoryLabel(result)} 피어싱
          </p>
          <p className="mt-5 text-sm leading-relaxed text-silver-dim">
            {persona.description}
          </p>
        </div>

        {picks.length > 0 && (
          <div className="mt-14">
            <h3 className="font-display text-center text-xl text-silver-bright">
              이런 제품은 어때요?
            </h3>
            <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {picks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            href={`/products?category=${result}`}
            className="chrome-button rounded-full px-7 py-3 text-sm font-semibold transition"
          >
            {categoryLabel(result)} 상품 전체 보기
          </Link>
          <button
            onClick={share}
            className="rounded-full border border-line px-7 py-3 text-sm text-silver transition hover:border-silver-dim hover:text-silver-bright"
          >
            {copied ? "링크를 복사했어요" : "결과 공유하기"}
          </button>
          <button
            onClick={restart}
            className="rounded-full px-7 py-3 text-sm text-silver-dim transition hover:text-silver"
          >
            다시 하기
          </button>
        </div>
      </div>
    );
  }

  /* ── 시작 화면 ── */
  if (!started) {
    return (
      <div className="mt-14 text-center">
        <p className="mx-auto max-w-md text-sm leading-relaxed text-silver-dim">
          6개의 질문에 답하면, 성향에 맞는 피어싱 부위와 어울리는 제품을 골라드려요.
          <br />
          1분이면 끝납니다.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="chrome-button mt-10 rounded-full px-10 py-4 font-semibold transition"
        >
          테스트 시작하기
        </button>
      </div>
    );
  }

  /* ── 질문 ── */
  const index = answers.length;
  const current = QUIZ_QUESTIONS[index];
  const progress = (index / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="mx-auto mt-12 max-w-xl">
      <div className="flex items-center justify-between text-xs text-silver-dim">
        <span className="font-mono">
          {String(index + 1).padStart(2, "0")} / {String(QUIZ_QUESTIONS.length).padStart(2, "0")}
        </span>
        {index > 0 && (
          <button
            onClick={() => setAnswers(answers.slice(0, -1))}
            className="transition hover:text-silver"
          >
            이전 질문
          </button>
        )}
      </div>

      <div className="mt-3 h-px w-full bg-line">
        <div
          className="h-px bg-silver transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="font-display mt-10 text-2xl leading-snug text-silver-bright sm:text-3xl">
        {current.question}
      </h2>

      <ul className="mt-8 space-y-3">
        {current.options.map((option, i) => (
          <li key={option.label}>
            <button
              onClick={() => choose(i)}
              className="chrome-border w-full rounded-2xl px-6 py-5 text-left text-sm text-silver transition hover:-translate-y-0.5 hover:text-silver-bright"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
