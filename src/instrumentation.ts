/**
 * Next.js Server Lifecycle Instrumentation
 * Automatically boots background tickers and services when the Next.js server starts.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      console.log("⚡ [Instrumentation] Initializing IndiaTransactionEngine continuous persistence ticker on server boot...");
      const { indiaTransactionEngine } = await import("@/lib/stream/indiaTransactionEngine");
      indiaTransactionEngine.startContinuousPersistence(3000);
    } catch (err) {
      console.warn("[Instrumentation] Failed to initialize background services:", err);
    }
  }
}
