import { createBrowserClient } from "@supabase/ssr";

// 브라우저(손님 화면)에서 쓰는 Supabase 연결
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
