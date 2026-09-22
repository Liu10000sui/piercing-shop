import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UpdatePasswordForm from "./UpdatePasswordForm";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="glow-top">
      <div className="mx-auto max-w-md px-5 py-20">
        <h1 className="text-chrome font-display text-3xl font-light tracking-tight">
          비밀번호 변경
        </h1>

        {user ? (
          <>
            <p className="mt-3 text-sm text-silver-dim">
              <span className="text-silver">{user.email}</span> 계정의 새 비밀번호를
              정해주세요.
            </p>
            <UpdatePasswordForm />
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed text-red-300">
              재설정 링크가 만료되었거나 로그인되어 있지 않습니다.
              <br />
              비밀번호 찾기를 다시 시도해주세요.
            </p>
            <Link
              href="/forgot-password"
              className="chrome-button mt-8 inline-block rounded-lg px-6 py-3 font-semibold transition"
            >
              비밀번호 찾기
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
