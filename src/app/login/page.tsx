import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { signIn } from "@/lib/actions/auth";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;

  return (
    <div className="glow-top">
      <div className="mx-auto max-w-md px-5 py-20">
        <h1 className="text-chrome text-3xl font-bold tracking-tight">로그인</h1>
        <p className="mt-2 text-sm text-silver-dim">
          주문과 장바구니를 쓰려면 로그인이 필요해요.
        </p>

        <AuthForm action={signIn} submitLabel="로그인" next={nextPath} />

        <p className="mt-5 flex items-center justify-center gap-3 text-sm text-silver-dim">
          <Link
            href="/forgot-password"
            className="underline underline-offset-4 transition hover:text-silver"
          >
            비밀번호를 잊으셨나요?
          </Link>
          <span aria-hidden="true" className="text-silver-dim/50">·</span>
          <Link
            href="/update-password"
            className="underline underline-offset-4 transition hover:text-silver"
          >
            비밀번호 변경
          </Link>
        </p>

        <p className="mt-6 text-center text-sm text-silver-dim">
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="text-silver underline underline-offset-4 hover:text-silver-bright">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
