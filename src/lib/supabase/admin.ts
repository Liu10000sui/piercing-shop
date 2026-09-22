import "server-only";
import { createClient } from "@supabase/supabase-js";

// ⚠️ 서버 전용. 이 파일을 "use client" 파일에서 import하면 관리자 열쇠가 브라우저로 새어나갑니다.
// (맨 윗줄 "server-only" 덕분에 실수로 그렇게 하면 빌드가 실패합니다.)
//
// 주문 테이블은 보안 규칙(RLS)상 브라우저에서 아무도 쓸 수 없게 막아두었기 때문에,
// 주문 생성과 결제완료 처리는 이 관리자 연결로만 이뤄집니다.
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요."
    );
  }

  return createClient(process.env.SUPABASE_URL!, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
