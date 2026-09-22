import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="glow-top">
      <div className="mx-auto max-w-md px-5 py-20">
        <h1 className="text-chrome font-display text-3xl font-light tracking-tight">
          비밀번호 찾기
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-silver-dim">
          가입하신 이메일로 재설정 링크를 보내드려요.
          <br />
          링크를 누르면 새 비밀번호를 바로 정하실 수 있습니다.
        </p>

        <ForgotPasswordForm />

        <p className="mt-6 text-center text-sm text-silver-dim">
          비밀번호가 기억나셨나요?{" "}
          <Link
            href="/login"
            className="text-silver underline underline-offset-4 hover:text-silver-bright"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
