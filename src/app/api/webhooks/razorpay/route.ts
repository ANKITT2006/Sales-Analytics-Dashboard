import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { liveEvents } from "@/lib/live-events";
import { indiaTransactionEngine } from "@/lib/stream/indiaTransactionEngine";

interface RazorpayPayload {
  entity?: string;
  account_id?: string;
  event?: string;
  contains?: string[];
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        amount?: number;
        currency?: string;
        status?: string;
        method?: string;
        email?: string;
        contact?: string;
        created_at?: number;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity?: {
        id?: string;
        amount?: number;
        amount_paid?: number;
        notes?: Record<string, string>;
      };
    };
  };
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  if (!secret) return true;
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const signatureBuf = Buffer.from(signature, "utf-8");

    if (expectedBuf.length !== signatureBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export interface LiveSyncedRecord {
  transaction_id: string;
  amount_inr: number;
  currency: string;
  method: string;
  status: string;
  customer_email: string;
  customer_contact: string;
  customer_name?: string;
  shop_id: string;
  state_code: string;
  city?: string;
  timestamp: string; // ISO date string
  event?: string;
}

function syncToLiveStore(record: LiveSyncedRecord) {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite");
    const db = new DatabaseSync(dbPath);

    // 1. Primary LiveTransaction table with strict schema
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

    // 2. Also keep LiveWebhookTransaction table synchronized for compatibility
    db.exec(`
      CREATE TABLE IF NOT EXISTS "LiveWebhookTransaction" (
        id TEXT PRIMARY KEY,
        transaction_id TEXT NOT NULL,
        amount_inr REAL NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL,
        customer TEXT,
        customer_email TEXT,
        customer_contact TEXT,
        customer_name TEXT,
        shop_id TEXT NOT NULL,
        state_code TEXT NOT NULL,
        city TEXT NOT NULL,
        event TEXT NOT NULL,
        created_at DATETIME NOT NULL
      );
    `);

    // Insert into LiveTransaction
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO "LiveTransaction" (
        transaction_id, amount_inr, currency, method, status,
        customer_email, customer_contact, customer_name, shop_id,
        state_code, city, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      record.transaction_id,
      record.amount_inr,
      record.currency,
      record.method,
      record.status,
      record.customer_email,
      record.customer_contact,
      record.customer_name || record.customer_email || "Customer",
      record.shop_id,
      record.state_code,
      record.city || "Mumbai",
      record.timestamp
    );

    // Synchronize to LiveWebhookTransaction
    const liveStmt = db.prepare(`
      INSERT OR REPLACE INTO "LiveWebhookTransaction" (
        id, transaction_id, amount_inr, payment_method, status, customer,
        customer_email, customer_contact, customer_name, shop_id, state_code,
        city, event, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    liveStmt.run(
      record.transaction_id,
      record.transaction_id,
      record.amount_inr,
      record.method,
      record.status,
      record.customer_email || record.customer_contact || "Customer",
      record.customer_email,
      record.customer_contact,
      record.customer_name || "Customer",
      record.shop_id,
      record.state_code,
      record.city || "Mumbai",
      record.event || "payment.captured",
      record.timestamp
    );

    db.close();

    // Broadcast event to connected SSE subscribers in real-time
    liveEvents.emit("transaction", record);
  } catch (err) {
    console.error("[Razorpay Webhook] Store sync error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    // Signature verification
    if (signature && secret) {
      const isValid = verifySignature(rawBody, signature, secret);
      if (!isValid) {
        console.warn("[Razorpay Webhook] Invalid signature rejected");
        return NextResponse.json(
          { status: "error", message: "Invalid signature" },
          { status: 400 }
        );
      }
    }

    let body: RazorpayPayload = {};
    if (rawBody.trim().length > 0) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        // Fallback if raw text wasn't JSON
      }
    }

    const event = body.event || "payment.captured";
    const payload = body.payload;
    const payment = payload?.payment?.entity;
    const order = payload?.order?.entity;

    if (payload?.payment?.entity?.id && payload?.payment?.entity?.amount !== undefined) {
      console.log("[Webhook Received]", payload.payment.entity.id, payload.payment.entity.amount);
    } else if (payment || order) {
      console.log("[Webhook Received]", payment?.id || order?.id, payment?.amount || order?.amount);
    }

    // Handle payment.captured or order.paid
    if (
      event === "payment.captured" ||
      event === "order.paid" ||
      event === "payment.authorized"
    ) {
      const transactionId =
        payment?.id ||
        order?.id ||
        `pay_live_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Strict conversion: amount in paise converted to INR
      const rawAmount = payment?.amount ?? order?.amount ?? 0;
      const amount_inr = Number((rawAmount / 100).toFixed(2));

      const method = (payment?.method || "upi").toLowerCase();
      const customerEmail = payment?.email || "";
      const customerContact = payment?.contact || "";
      const notes = payment?.notes || order?.notes || {};

      const customerName =
        notes.customer_name ||
        notes.name ||
        (customerEmail.includes("@") ? customerEmail.split("@")[0] : "Retail Customer");

      const shopId = notes.shop_id || "IND_SHOP_1001";
      const stateCode = notes.state_code || "27"; // Default Maharashtra (27)
      const city = notes.city || "Mumbai";
      const status = payment?.status === "captured" ? "captured" : "success";

      const timestamp = payment?.created_at
        ? new Date(payment.created_at * 1000).toISOString()
        : new Date().toISOString();

      const record: LiveSyncedRecord = {
        transaction_id: transactionId,
        amount_inr,
        currency: "INR",
        method,
        status,
        customer_email: customerEmail,
        customer_contact: customerContact,
        customer_name: customerName,
        shop_id: shopId,
        state_code: stateCode,
        city,
        timestamp,
        event,
      };

      console.log("\n=======================================================");
      console.log("⚡ [Razorpay Webhook] LIVE TRANSACTION RECORDED (INR):");
      console.log(JSON.stringify(record, null, 2));
      console.log("=======================================================\n");

      // Synchronize directly into active persistent storage
      syncToLiveStore(record);

      // Inject into All-India state stream as verified Razorpay payment
      const nationalTx = indiaTransactionEngine.injectVerifiedRazorpay({
        transaction_id: transactionId,
        amount_inr,
        method,
        state_code: stateCode,
        city,
        customer_name: customerName,
        shop_id: shopId,
        timestamp,
      });

      // Broadcast high-priority event to SSE subscribers
      liveEvents.emit("transaction", {
        ...record,
        ...nationalTx,
        is_verified_razorpay: true,
      });

      return NextResponse.json({
        status: "ok",
        received: true,
        transaction_id: transactionId,
        amount_inr,
        currency: "INR",
        event,
      });
    }

    // Return 200 OK for other webhook events
    return NextResponse.json({
      status: "ok",
      received: true,
      event,
    });
  } catch (error: unknown) {
    console.error("[Razorpay Webhook] Handler error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { status: "error", message: msg },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/webhooks/razorpay",
    currency: "INR",
    method: "POST",
    description: "Razorpay Webhook endpoint for live Indian retail transaction ingestion in INR.",
  });
}
