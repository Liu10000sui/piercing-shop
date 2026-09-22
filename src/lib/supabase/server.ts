import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 서버에서 쓰는 Supabase 연결. 쿠키를 읽어 "지금 로그인한 사람이 누구인지"를 압니다.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 화면을 그리는 도중에는 쿠키를 못 씁니다. 세션 갱신은 proxy.ts가 담당해요.
          }
        },
      },
    }
  );
}
