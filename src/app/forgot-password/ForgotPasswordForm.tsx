"use client";

import { useActionState } from "react";
import { requestPasswordReset, type AuthState } from "@/lib/actions/auth";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    null
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm text-silver-dim">가입하신 이메일</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-lg border border-line bg-panel px-4 py-3 text-silver-bright outline-none transition placeholder:text-silver-dim/60 focus:border-silver-dim"
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
        {pending ? "보내는 중…" : "재설정 링크 받기"}
      </button>
    </form>
  );
}
