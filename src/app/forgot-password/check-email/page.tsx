import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="glow-top">
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-chrome font-display text-3xl font-light tracking-tight">
          메일을 확인해주세요
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-silver-dim">
          비밀번호 재설정 링크를 보냈습니다.
          <br />
          메일 속 링크를 누르면 새 비밀번호를 정하는 화면으로 이동해요.
          <br />
          메일이 안 보이면 스팸함도 확인해주세요.
        </p>
        <Link
          href="/login"
          className="chrome-button mt-10 inline-block rounded-lg px-6 py-3 font-semibold transition"
        >
          로그인 화면으로
        </Link>
      </div>
    </div>
  );
}
