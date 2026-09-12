import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { liveEvents } from "@/lib/live-events";
import { indiaTransactionEngine } from "@/lib/stream/indiaTransactionEngine";

interface PhonePePayload {
  response?: string; // Base64 encoded JSON
  success?: boolean;
  code?: string;
  data?: {
    merchantId?: string;
    merchantTransactionId?: string;
    transactionId?: string;
    amount?: number; // In paise
    state?: string;
    responseCode?: string;
    paymentInstrument?: {
      type?: string;
      utr?: string;
      cardType?: string;
    };
    notes?: Record<string, string>;
  };
}

function syncPhonePeToStore(record: {
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
    console.error("[PhonePe Webhook] Database sync error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let body: PhonePePayload = {};

    if (rawBody.trim().length > 0) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        // Fallback
      }
    }

    // Decode base64 payload if PhonePe S2S envelope is used
    let data = body.data;
    if (body.response) {
      try {
        const decoded = Buffer.from(body.response, "base64").toString("utf-8");
        const parsedEnvelope = JSON.parse(decoded);
        data = parsedEnvelope.data || data;
      } catch {
        // Use direct data if decode fails
      }
    }

    const transactionId =
      data?.transactionId ||
      data?.merchantTransactionId ||
      `phonepe_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

    // PhonePe amounts are in paise -> convert to INR
    const rawAmount = data?.amount ?? 125000;
    const amountInr = Number((rawAmount / 100).toFixed(2));

    const notes = data?.notes || {};
    const customerName = notes.customer_name || "PhonePe UPI User";
    const shopId = data?.merchantId || notes.shop_id || "IND_PHONEPE_MERCHANT";
    const stateCode = notes.state_code || "KA"; // Default Karnataka for PhonePe
    const city = notes.city || "Bengaluru";
    const timestamp = new Date().toISOString();

    const nationalTx = indiaTransactionEngine.injectVerifiedPayment({
      transaction_id: transactionId,
      amount_inr: amountInr,
      gateway: "PhonePe",
      method: data?.paymentInstrument?.type || "UPI",
      state_code: stateCode,
      city,
      customer_name: customerName,
      shop_id: shopId,
      timestamp,
      category: "Quick Commerce",
    });

    syncPhonePeToStore({
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
      gateway: "PhonePe",
    });

    return NextResponse.json({
      status: "ok",
      received: true,
      gateway: "PhonePe",
      transaction_id: transactionId,
      amount_inr: amountInr,
      currency: "INR",
    });
  } catch (error: unknown) {
    console.error("[PhonePe Webhook] Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ status: "error", message: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    gateway: "PhonePe",
    endpoint: "/api/webhooks/phonepe",
    description: "PhonePe S2S Callback Webhook Ingestion Hook",
  });
}
