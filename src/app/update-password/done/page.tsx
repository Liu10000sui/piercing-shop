import Link from "next/link";

export default function PasswordChangedPage() {
  return (
    <div className="glow-top">
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-chrome font-display text-3xl font-light tracking-tight">
          비밀번호를 변경했어요
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-silver-dim">
          다음 로그인부터 새 비밀번호를 사용해주세요.
        </p>
        <Link
          href="/products"
          className="chrome-button mt-10 inline-block rounded-lg px-6 py-3 font-semibold transition"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
