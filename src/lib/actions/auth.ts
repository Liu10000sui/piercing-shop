"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string } | null;

async function getOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// 에러 메시지를 사람이 읽을 수 있는 한국어로 바꿔줍니다.
function toKorean(message: string) {
  if (message.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (message.includes("Email not confirmed")) return "아직 이메일 인증을 완료하지 않았습니다. 메일함을 확인해주세요.";
  if (message.includes("User already registered")) return "이미 가입된 이메일입니다.";
  if (message.includes("Password should be at least")) return "비밀번호는 6자 이상이어야 합니다.";
  if (message.includes("Unable to validate email address")) return "이메일 주소 형식이 올바르지 않습니다.";
  if (message.includes("should be different from the old password"))
    return "이전과 다른 비밀번호를 입력해주세요.";
  if (message.includes("Auth session missing") || message.includes("session_not_found"))
    return "재설정 링크가 만료되었습니다. 비밀번호 찾기를 다시 시도해주세요.";
  return message;
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "이메일과 비밀번호를 모두 입력해주세요." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${await getOrigin()}/auth/callback` },
  });

  if (error) return { error: toKorean(error.message) };

  redirect("/signup/check-email");
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!email || !password) return { error: "이메일과 비밀번호를 모두 입력해주세요." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: toKorean(error.message) };

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/");
}

// 비밀번호 재설정 메일 보내기
export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "이메일을 입력해주세요." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await getOrigin()}/auth/callback?next=/update-password`,
  });

  if (error) return { error: toKorean(error.message) };

  redirect("/forgot-password/check-email");
}

// 새 비밀번호 저장 (메일 링크로 들어왔거나, 이미 로그인한 경우)
export async function updatePassword(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("passwordConfirm") ?? "");

  if (password.length < 6) return { error: "비밀번호는 6자 이상이어야 합니다." };
  if (password !== confirm) return { error: "두 비밀번호가 서로 다릅니다." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "재설정 링크가 만료되었거나 로그인되어 있지 않습니다. 비밀번호 찾기를 다시 시도해주세요.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: toKorean(error.message) };

  revalidatePath("/", "layout");
  redirect("/update-password/done");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
