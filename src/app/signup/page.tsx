import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage() {
  return (
    <div className="glow-top">
      <div className="mx-auto max-w-md px-5 py-20">
        <h1 className="text-chrome text-3xl font-bold tracking-tight">회원가입</h1>
        <p className="mt-2 text-sm text-silver-dim">
          이메일로 가입하면 인증 메일이 한 통 갑니다.
        </p>

        <AuthForm action={signUp} submitLabel="가입하기" passwordHint="6자 이상 입력해주세요." />

        <p className="mt-6 text-center text-sm text-silver-dim">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-silver underline underline-offset-4 hover:text-silver-bright">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
