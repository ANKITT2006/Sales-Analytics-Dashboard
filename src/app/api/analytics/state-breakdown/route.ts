import { NextRequest, NextResponse } from "next/server";
import {
  indiaTransactionEngine,
  IndianRegion,
} from "@/lib/stream/indiaTransactionEngine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionParam = searchParams.get("region") || "ALL";

    const region = regionParam !== "ALL" ? (regionParam as IndianRegion) : undefined;
    const states = indiaTransactionEngine.getStateBreakdown(region);

    const totalVolume = states.reduce((acc, s) => acc + s.total_volume_inr, 0);
    const totalTransactions = states.reduce((acc, s) => acc + s.transaction_count, 0);

    return NextResponse.json({
      success: true,
      region: regionParam,
      total_states: states.length,
      national_summary: {
        total_volume_inr: totalVolume,
        total_transactions: totalTransactions,
        average_order_value: totalTransactions > 0 ? Math.round(totalVolume / totalTransactions) : 0,
      },
      data: states,
    });
  } catch (error) {
    console.error("Error in /api/analytics/state-breakdown:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
