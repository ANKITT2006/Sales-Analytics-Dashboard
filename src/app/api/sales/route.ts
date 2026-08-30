import { NextRequest, NextResponse } from "next/server";
import { getSalesPayload } from "@/lib/sales";
import { isSalesYear } from "@/lib/utils";
import { AVAILABLE_YEARS } from "@/types/sales";

export function GET(request: NextRequest) {
  const yearParam = request.nextUrl.searchParams.get("year");

  if (!yearParam) {
    return NextResponse.json(
      {
        error: "Missing year query parameter.",
        availableYears: AVAILABLE_YEARS,
      },
      { status: 400 },
    );
  }

  const year = Number(yearParam);

  if (!Number.isInteger(year) || !isSalesYear(year)) {
    return NextResponse.json(
      {
        error: "Invalid year. Use 2022, 2023, or 2024.",
        availableYears: AVAILABLE_YEARS,
      },
      { status: 400 },
    );
  }

  try {
    const payload = getSalesPayload(year);
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: `No sales data available for ${year}.` },
      { status: 404 },
    );
  }
}
