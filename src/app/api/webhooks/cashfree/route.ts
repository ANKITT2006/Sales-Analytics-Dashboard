import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { liveEvents } from "@/lib/live-events";
import { indiaTransactionEngine } from "@/lib/stream/indiaTransactionEngine";

interface CashfreePayload {
  type?: string;
  data?: {
    order?: {
      order_id?: string;
      order_amount?: number;
      order_currency?: string;
      order_tags?: Record<string, string>;
    };
    payment?: {
      cf_payment_id?: string;
      payment_amount?: number;
      payment_currency?: string;
      payment_status?: string;
      payment_message?: string;
      payment_time?: string;
      payment_method?: Record<string, Record<string, string>>;
    };
    customer_details?: {
      customer_name?: string;
      customer_id?: string;
      customer_email?: string;
      customer_phone?: string;
    };
  };
}

function syncCashfreeToStore(record: {
  transaction_id: string;
  amount_inr: number;
  method: string;
  customer_name: string;
  shop_id: string;
  state_code: string;
  city: string;
  timestamp: string;
}) {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  if (!fs.existsSync(dbPath)) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite");
    const db = new DatabaseSync(dbPath);

    db.exec(`
      CREATE TABLE IF NOT EXISTS "LiveTransaction" (
        transaction_id TEXT PRIMARY KEY,
        amount_inr REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        method TEXT NOT NULL,
        status TEXT NOT NULL,
        customer_email TEXT,
        customer_contact TEXT,
        customer_name TEXT,
        shop_id TEXT NOT NULL,
        state_code TEXT NOT NULL,
        city TEXT,
        timestamp TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO "LiveTransaction" (
        transaction_id, amount_inr, currency, method, status,
        customer_name, shop_id, state_code, city, timestamp
      ) VALUES (?, ?, 'INR', ?, 'captured', ?, ?, ?, ?, ?)
    `);

    stmt.run(
      record.transaction_id,
      record.amount_inr,
      record.method,
      record.customer_name,
      record.shop_id,
      record.state_code,
      record.city,
      record.timestamp
    );

    db.close();
  } catch (err) {
    console.error("[Cashfree Webhook] Database sync error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let body: CashfreePayload = {};

    if (rawBody.trim().length > 0) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        // Fallback
      }
    }

    const data = body.data;
    const transactionId =
      data?.payment?.cf_payment_id ||
      data?.order?.order_id ||
      `cf_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

    const amountInr = Number(
      (data?.payment?.payment_amount ?? data?.order?.order_amount ?? 1500).toFixed(2)
    );

    const tags = data?.order?.order_tags || {};
    const customerName = data?.customer_details?.customer_name || "Cashfree Customer";
    const shopId = tags.shop_id || "IND_CASHFREE_MERCHANT";
    const stateCode = tags.state_code || "GJ"; // Default Gujarat for Cashfree
    const city = tags.city || "Ahmedabad";
    const timestamp = data?.payment?.payment_time || new Date().toISOString();

    const nationalTx = indiaTransactionEngine.injectVerifiedPayment({
      transaction_id: transactionId,
      amount_inr: amountInr,
      gateway: "Cashfree",
      method: "Netbanking",
      state_code: stateCode,
      city,
      customer_name: customerName,
      shop_id: shopId,
      timestamp,
      category: "Electronics",
    });

    syncCashfreeToStore({
      transaction_id: transactionId,
      amount_inr: amountInr,
      method: "Netbanking",
      customer_name: customerName,
      shop_id: shopId,
      state_code: stateCode,
      city,
      timestamp,
    });

    liveEvents.emit("transaction", {
      ...nationalTx,
      currency: "INR",
      status: "captured",
      event: "payment.success",
      gateway: "Cashfree",
    });

    return NextResponse.json({
      status: "ok",
      received: true,
      gateway: "Cashfree",
      transaction_id: transactionId,
      amount_inr: amountInr,
      currency: "INR",
    });
  } catch (error: unknown) {
    console.error("[Cashfree Webhook] Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ status: "error", message: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    gateway: "Cashfree",
    endpoint: "/api/webhooks/cashfree",
    description: "Cashfree Payment Gateway Webhook Ingestion Hook",
  });
}
