import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 배포 환경에서 Supabase 연결이 왜 실패하는지 확인하기 위한 임시 점검용 주소입니다.
// 원인 확인이 끝나면 삭제합니다. (비밀 키는 출력하지 않습니다)
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(설정 없음)";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const supabase = await createClient();
  const { data, error } = await supabase.from("shop_products").select("id").limit(1);

  return NextResponse.json({
    supabaseUrl: url,
    anonKeyPrefix: key.slice(0, 14),
    anonKeyLength: key.length,
    rowsFound: data?.length ?? 0,
    error: error
      ? { message: error.message, code: error.code, details: error.details, hint: error.hint }
      : null,
  });
}
