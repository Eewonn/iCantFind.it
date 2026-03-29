import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton for client components
let _client: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabaseClient() {
  if (!_client) {
    _client = createSupabaseClient();
  }
  return _client;
}
