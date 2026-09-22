"use client";

import { useActionState } from "react";
import type { AuthState } from "@/lib/actions/auth";

type Props = {
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  submitLabel: string;
  next?: string;
  passwordHint?: string;
};

export default function AuthForm({ action, submitLabel, next, passwordHint }: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      <label className="block">
        <span className="text-sm text-silver-dim">이메일</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-lg border border-line bg-panel px-4 py-3 text-silver-bright outline-none transition placeholder:text-silver-dim/60 focus:border-silver-dim"
        />
      </label>

      <label className="block">
        <span className="text-sm text-silver-dim">비밀번호</span>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="mt-1.5 w-full rounded-lg border border-line bg-panel px-4 py-3 text-silver-bright outline-none transition focus:border-silver-dim"
        />
        {passwordHint && <span className="mt-1.5 block text-xs text-silver-dim">{passwordHint}</span>}
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
        {pending ? "처리 중…" : submitLabel}
      </button>
    </form>
  );
}
