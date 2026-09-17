import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

let publicClient: SupabaseClient | null = null;

/**
 * Returns a public Supabase client using the anon/publishable key for client-side reads.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
    return null;
  }
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!publicClient) {
    publicClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return publicClient;
}

export const supabaseClient = getSupabaseClient();
export default getSupabaseClient;
