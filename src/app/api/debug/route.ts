import { NextResponse } from "next/server";

// 배포 환경 점검용 임시 주소입니다. 원인 확인이 끝나면 삭제합니다.
// 비밀 값은 출력하지 않고, "설정되어 있는지"와 길이만 확인합니다.
const NAMES = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_TOSS_CLIENT_KEY",
  "TOSS_SECRET_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SECRET_KEY",
];

export async function GET() {
  const env: Record<string, string> = {};
  for (const name of NAMES) {
    const value = process.env[name];
    env[name] = value ? `설정됨 (${value.length}자, ${value.slice(0, 12)}…)` : "없음";
  }

  let query: unknown = "시도 안 함";
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.from("shop_products").select("id").limit(1);
    query = error
      ? { ok: false, message: error.message, code: error.code }
      : { ok: true, rowsFound: data?.length ?? 0 };
  } catch (e) {
    query = { ok: false, thrown: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json({ env, query });
}
