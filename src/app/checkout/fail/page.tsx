import Link from "next/link";

// 결제 인증이 실패했을 때 토스가 보내주는 화면입니다.
// 여기서는 승인(confirm) API를 절대 호출하지 않습니다. 이미 실패한 결제니까요.
export default async function CheckoutFailPage({
  searchParams,
}: PageProps<"/checkout/fail">) {
  const { code, message } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="text-3xl font-bold text-red-300">결제하지 못했어요</h1>

      <p className="mt-4 text-sm leading-relaxed text-silver-dim">
        {typeof message === "string" && message
          ? message
          : "결제가 완료되지 않았습니다. 다시 시도해주세요."}
      </p>

      {typeof code === "string" && code && (
        <p className="mt-2 font-mono text-xs text-silver-dim/70">오류 코드: {code}</p>
      )}

      <div className="mt-10 flex flex-col gap-3">
        <Link
          href="/checkout"
          className="chrome-button rounded-lg px-6 py-3 font-semibold transition"
        >
          다시 결제하기
        </Link>
        <Link
          href="/cart"
          className="rounded-lg border border-line px-6 py-3 text-sm text-silver-dim transition hover:border-silver-dim hover:text-silver"
        >
          장바구니로 돌아가기
        </Link>
      </div>
    </div>
  );
}
