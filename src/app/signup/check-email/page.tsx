import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="glow-top">
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-chrome text-3xl font-bold tracking-tight">메일을 확인해주세요</h1>
        <p className="mt-4 text-sm leading-relaxed text-silver-dim">
          입력하신 이메일 주소로 인증 링크를 보냈습니다.
          <br />
          메일 속 링크를 누르면 가입이 완료돼요.
          <br />
          메일이 안 보이면 스팸함도 확인해주세요.
        </p>
        <Link
          href="/login"
          className="chrome-button mt-8 inline-block rounded-lg px-6 py-3 font-semibold transition"
        >
          로그인하러 가기
        </Link>
      </div>
    </div>
  );
}
