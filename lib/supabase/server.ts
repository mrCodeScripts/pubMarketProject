import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ENV } from "@/lib/constants";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    ENV.CONFIG_SUPABASE_URL!,
    ENV.CONFIG_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — can be ignored
            // if you have middleware refreshing sessions
          }
        },
      },
    },
  );
}
