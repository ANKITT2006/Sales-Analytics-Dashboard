import { NextRequest, NextResponse } from "next/server";
import {
  indiaTransactionEngine,
  IndianRegion,
  NationalTransaction,
} from "@/lib/stream/indiaTransactionEngine";
import { verifyAuth } from "@/lib/supabase/server";
import { getLiveTransactions } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const state = searchParams.get("state") || undefined;
    const regionParam = searchParams.get("region");
    const action = searchParams.get("action");

    // Optional stream ticker action (Mutations require authentication)
    if (action === "toggle" || action === "tick") {
      const auth = await verifyAuth(request);
      if (!auth.authenticated) {
        return NextResponse.json(
          { success: false, error: "Authentication Required to modify stream simulation" },
          { status: 401 }
        );
      }

      if (action === "toggle") {
        const isRunning = indiaTransactionEngine.toggleSimulation();
        return NextResponse.json({ success: true, is_running: isRunning });
      } else {
        const newTx = indiaTransactionEngine.generateNextTransaction();
        return NextResponse.json({ success: true, transaction: newTx });
      }
    }

    const region = regionParam && regionParam !== "ALL"
      ? (regionParam as IndianRegion)
      : undefined;

    // Fetch from Supabase PostgreSQL live_transactions (with SQLite fallback)
    const storedTxs = await getLiveTransactions(limit, state);
    const engineTxs = indiaTransactionEngine.getTransactions(limit, state, region);

    let rawTransactions: NationalTransaction[];
    if (storedTxs && storedTxs.length > 0) {
      const seen = new Set<string>();
      rawTransactions = [
        ...storedTxs.map((t) => ({
          id: t.id,
          transaction_id: t.transaction_id,
          amount_inr: t.amount_inr,
          currency: t.currency,
          payment_method: t.payment_method,
          status: t.status,
          customer_name: t.customer_name,
          customer_email: t.customer_email,
          customer_contact: t.customer_contact,
          shop_id: t.shop_id,
          state_code: t.state_code,
          city: t.city,
          event: t.event,
          created_at: t.created_at,
          is_verified_razorpay: true,
          is_verified: true,
        })),
        ...engineTxs,
      ].filter((t) => {
        if (seen.has(t.transaction_id)) return false;
        seen.add(t.transaction_id);
        return true;
      }).slice(0, limit);
    } else {
      rawTransactions = engineTxs;
    }

    // Check authentication to determine if customer PII should be sanitized
    const auth = await verifyAuth(request);
    const transactions = auth.authenticated
      ? rawTransactions
      : rawTransactions.map((tx: NationalTransaction) => ({
          ...tx,
          // Mask customer PII for public readers
          customer_name: tx.is_verified || tx.is_verified_razorpay
            ? "Verified Shopper"
            : "Customer ••••",
        }));

    return NextResponse.json({
      success: true,
      count: transactions.length,
      is_running: indiaTransactionEngine.isRunning(),
      is_authenticated: auth.authenticated,
      data: transactions,
    });
  } catch (error) {
    console.error("Error in /api/analytics/live-feed:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Mutations require server-side authentication
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication Required to modify stream simulation" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    if (typeof body.active === "boolean") {
      const running = indiaTransactionEngine.toggleSimulation(body.active);
      return NextResponse.json({ success: true, is_running: running });
    }
    const newTx = indiaTransactionEngine.generateNextTransaction();
    return NextResponse.json({ success: true, transaction: newTx });
  } catch (error) {
    console.error("Error in /api/analytics/live-feed POST:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
