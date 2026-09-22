"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/lib/actions/auth";

export default function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    null
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm text-silver-dim">새 비밀번호</span>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-line bg-panel px-4 py-3 text-silver-bright outline-none transition focus:border-silver-dim"
        />
        <span className="mt-1.5 block text-xs text-silver-dim">6자 이상 입력해주세요.</span>
      </label>

      <label className="block">
        <span className="text-sm text-silver-dim">새 비밀번호 확인</span>
        <input
          type="password"
          name="passwordConfirm"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-line bg-panel px-4 py-3 text-silver-bright outline-none transition focus:border-silver-dim"
        />
      </label>

      {state?.error && (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="chrome-button w-full rounded-lg py-3 font-semibold transition"
      >
        {pending ? "변경 중…" : "비밀번호 변경하기"}
      </button>
    </form>
  );
}
