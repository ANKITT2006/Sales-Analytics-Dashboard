import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function SupabaseTestPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: transactions, error } = await supabase
    .from("live_transactions")
    .select("*")
    .limit(10);

  return (
    <div className="p-8 text-white bg-slate-900 min-h-screen font-mono">
      <h1 className="text-xl font-bold mb-4 text-amber-400">Supabase Connection Test</h1>
      <p className="mb-2 text-sm text-slate-300">
        Endpoint: {process.env.NEXT_PUBLIC_SUPABASE_URL}
      </p>
      {error ? (
        <div className="p-4 bg-red-950 border border-red-700 rounded text-red-300 text-sm">
          Error: {error.message}
        </div>
      ) : (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700 rounded">
          <p className="text-emerald-400 font-semibold mb-2">
            ✓ Supabase SSR Server Client Connected! Total records: {transactions?.length || 0}
          </p>
          <pre className="p-3 bg-black/60 rounded text-xs text-slate-200 overflow-auto max-h-96">
            {JSON.stringify(transactions, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
