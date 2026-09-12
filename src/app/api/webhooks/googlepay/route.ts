import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { liveEvents } from "@/lib/live-events";
import { indiaTransactionEngine } from "@/lib/stream/indiaTransactionEngine";

interface GooglePayWebhookPayload {
  googleTransactionId?: string;
  transactionId?: string;
  orderId?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  paymentMethod?: string;
  payerVpa?: string;
  payerName?: string;
  merchantId?: string;
  merchantName?: string;
  stateCode?: string;
  city?: string;
  timestamp?: string;
}

function syncGPayToStore(record: {
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
    console.error("[Google Pay Webhook] Database sync error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let body: GooglePayWebhookPayload = {};
    if (rawBody.trim().length > 0) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        // Fallback
      }
    }

    const transactionId =
      body.googleTransactionId ||
      body.transactionId ||
      body.orderId ||
      `gpay_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

    // Parse amount: handles both direct INR float/number or paise
    let amountInr = 500;
    if (body.amount !== undefined) {
      const parsed = typeof body.amount === "string" ? parseFloat(body.amount) : body.amount;
      amountInr = parsed > 10000 && Number.isInteger(parsed) ? parsed / 100 : parsed;
    }
    amountInr = Number(amountInr.toFixed(2));

    const customerName = body.payerName || (body.payerVpa ? body.payerVpa.split("@")[0] : "Google Pay User");
    const shopId = body.merchantId || "IND_GPAY_SHOP";
    const stateCode = body.stateCode || "DL"; // Default Delhi NCR for Google Pay
    const city = body.city || "New Delhi";
    const timestamp = body.timestamp || new Date().toISOString();

    const nationalTx = indiaTransactionEngine.injectVerifiedPayment({
      transaction_id: transactionId,
      amount_inr: amountInr,
      gateway: "GooglePay",
      method: "UPI",
      state_code: stateCode,
      city,
      customer_name: customerName,
      shop_id: shopId,
      timestamp,
      category: "Dining & Cafes",
    });

    syncGPayToStore({
      transaction_id: transactionId,
      amount_inr: amountInr,
      method: "UPI",
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
      gateway: "GooglePay",
    });

    return NextResponse.json({
      status: "ok",
      received: true,
      gateway: "GooglePay",
      transaction_id: transactionId,
      amount_inr: amountInr,
      currency: "INR",
    });
  } catch (error: unknown) {
    console.error("[Google Pay Webhook] Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ status: "error", message: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    gateway: "GooglePay",
    endpoint: "/api/webhooks/googlepay",
    description: "Google Pay Business / UPI Merchant Webhook Ingestion Hook",
  });
}
