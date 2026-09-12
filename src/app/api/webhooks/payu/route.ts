import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { liveEvents } from "@/lib/live-events";
import { indiaTransactionEngine } from "@/lib/stream/indiaTransactionEngine";

interface PayUPayload {
  txnid?: string;
  amount?: string | number;
  status?: string;
  mode?: string;
  bank_ref_num?: string;
  firstname?: string;
  email?: string;
  phone?: string;
  udf1?: string; // shop_id
  udf2?: string; // state_code
  udf3?: string; // city
  addedon?: string;
}

function syncPayUToStore(record: {
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
    console.error("[PayU Webhook] Database sync error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let body: PayUPayload = {};

    if (rawBody.trim().length > 0) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        // Fallback if form url-encoded
        const params = new URLSearchParams(rawBody);
        body = Object.fromEntries(params.entries()) as unknown as PayUPayload;
      }
    }

    const transactionId =
      body.txnid ||
      body.bank_ref_num ||
      `payu_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

    const amountInr = Number(
      (typeof body.amount === "string" ? parseFloat(body.amount) : body.amount ?? 850).toFixed(2)
    );

    const customerName = body.firstname || "PayU Customer";
    const shopId = body.udf1 || "IND_PAYU_MERCHANT";
    const stateCode = body.udf2 || "TG"; // Default Telangana for PayU
    const city = body.udf3 || "Hyderabad";
    const timestamp = body.addedon || new Date().toISOString();

    const nationalTx = indiaTransactionEngine.injectVerifiedPayment({
      transaction_id: transactionId,
      amount_inr: amountInr,
      gateway: "PayU",
      method: body.mode || "CARD",
      state_code: stateCode,
      city,
      customer_name: customerName,
      shop_id: shopId,
      timestamp,
      category: "Apparel & Fashion",
    });

    syncPayUToStore({
      transaction_id: transactionId,
      amount_inr: amountInr,
      method: body.mode || "CARD",
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
      gateway: "PayU",
    });

    return NextResponse.json({
      status: "ok",
      received: true,
      gateway: "PayU",
      transaction_id: transactionId,
      amount_inr: amountInr,
      currency: "INR",
    });
  } catch (error: unknown) {
    console.error("[PayU Webhook] Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ status: "error", message: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    gateway: "PayU",
    endpoint: "/api/webhooks/payu",
    description: "PayU Payment Gateway Webhook / IPN Ingestion Hook",
  });
}
