import { NextRequest, NextResponse } from "next/server";
import {
  indiaTransactionEngine,
  IndianRegion,
} from "@/lib/stream/indiaTransactionEngine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const state = searchParams.get("state") || undefined;
    const regionParam = searchParams.get("region");
    const action = searchParams.get("action");

    // Optional stream ticker action
    if (action === "toggle") {
      const isRunning = indiaTransactionEngine.toggleSimulation();
      return NextResponse.json({ success: true, is_running: isRunning });
    } else if (action === "tick") {
      const newTx = indiaTransactionEngine.generateNextTransaction();
      return NextResponse.json({ success: true, transaction: newTx });
    }

    const region = regionParam && regionParam !== "ALL"
      ? (regionParam as IndianRegion)
      : undefined;

    const transactions = indiaTransactionEngine.getTransactions(limit, state, region);

    return NextResponse.json({
      success: true,
      count: transactions.length,
      is_running: indiaTransactionEngine.isRunning(),
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
