import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 배포 환경 점검용 임시 주소입니다. 원인 확인이 끝나면 삭제합니다.
// 비밀 값은 출력하지 않고, "설정되어 있는지"와 길이만 확인합니다.
const NAMES = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SECRET_KEY",
  "NEXT_PUBLIC_TOSS_CLIENT_KEY",
  "TOSS_SECRET_KEY",
];

export async function GET() {
  const env: Record<string, string> = {};
  for (const name of NAMES) {
    const value = process.env[name];
    env[name] = value ? `설정됨 (${value.length}자, ${value.slice(0, 12)}…)` : "없음";
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("shop_products").select("id").limit(1);

  return NextResponse.json({
    env,
    rowsFound: data?.length ?? 0,
    error: error ? { message: error.message, code: error.code } : null,
  });
}
