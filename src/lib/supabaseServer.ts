import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

let adminClient: SupabaseClient | null = null;

/**
 * Helper to check whether real Supabase credentials are configured.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !serviceRoleKey) return false;
  if (supabaseUrl.includes("your-project-ref")) return false;
  return true;
}

/**
 * Returns a singleton Supabase Admin client for secure server-side writes
 * and webhook ingestion without exposing secrets to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

export const supabaseServer = getSupabaseAdmin();
export default getSupabaseAdmin;
