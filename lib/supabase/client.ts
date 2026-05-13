import { createBrowserClient } from "@supabase/ssr";
import { ENV } from "@/lib/constants";

export function createClient() {
  return createBrowserClient(
    ENV.CONFIG_SUPABASE_URL!,
    ENV.CONFIG_SUPABASE_ANON_KEY!,
  );
}
