import { NextRequest, NextResponse } from "next/server";
import { VERIFIED_SHOPS, VerifiedShop } from "@/data/verifiedShops";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateParam = searchParams.get("state")?.trim().toUpperCase();
    const categoryParam = searchParams.get("category")?.trim();
    const searchParam = searchParams.get("search")?.trim().toLowerCase();
    const format = searchParams.get("format")?.trim().toLowerCase();

    let result: VerifiedShop[] = VERIFIED_SHOPS;

    // Filter by State (Code or Name)
    if (stateParam && stateParam !== "ALL") {
      result = result.filter(
        (s) =>
          s.state_code.toUpperCase() === stateParam ||
          s.state_name.toUpperCase().includes(stateParam)
      );
    }

    // Filter by Category
    if (categoryParam && categoryParam !== "ALL") {
      result = result.filter((s) =>
        s.category.toLowerCase().includes(categoryParam.toLowerCase())
      );
    }

    // Search query across name, gstin, pan, state, category
    if (searchParam) {
      result = result.filter(
        (s) =>
          s.shop_name.toLowerCase().includes(searchParam) ||
          s.gstin.toLowerCase().includes(searchParam) ||
          s.pan.toLowerCase().includes(searchParam) ||
          s.state_name.toLowerCase().includes(searchParam) ||
          s.category.toLowerCase().includes(searchParam) ||
          s.shop_id.toLowerCase().includes(searchParam)
      );
    }

    // CSV format export support
    if (format === "csv") {
      const headers = [
        "Serial No",
        "Shop ID",
        "Shop Name",
        "GSTIN",
        "PAN",
        "State Code",
        "State Name",
        "Category",
        "Verification Status",
        "Registration Date",
      ];
      const rows = result.map((s) =>
        [
          s.serial_no,
          `"${s.shop_id}"`,
          `"${s.shop_name.replace(/"/g, '""')}"`,
          `"${s.gstin}"`,
          `"${s.pan}"`,
          `"${s.state_code}"`,
          `"${s.state_name}"`,
          `"${s.category.replace(/"/g, '""')}"`,
          `"${s.verification_status}"`,
          `"${s.registration_date}"`,
        ].join(",")
      );
      const csv = [headers.join(","), ...rows].join("\n");

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="verified_retail_shops_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      total_verified_shops: VERIFIED_SHOPS.length,
      filtered_count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching verified shops:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
