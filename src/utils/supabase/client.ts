import { createBrowserClient } from "@supabase/ssr";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl =
  rawUrl && !rawUrl.includes("your-project-ref") ? rawUrl : "https://placeholder-offline.supabase.co";
const supabaseKey =
  rawKey && !rawKey.includes("your-anon") ? rawKey : "placeholder-offline-anon-key";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
