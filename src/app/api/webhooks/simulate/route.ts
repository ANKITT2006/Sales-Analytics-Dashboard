import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const gateway = (body.gateway || "GooglePay") as "GooglePay" | "PhonePe" | "Razorpay" | "Cashfree" | "PayU";
    const amount = body.amount ? Number(body.amount) : undefined;
    const stateCode = body.state_code || undefined;
    const city = body.city || undefined;

    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    if (gateway === "GooglePay") {
      const gpayAmount = amount || 650;
      const res = await fetch(`${baseUrl}/api/webhooks/googlepay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleTransactionId: `gpay_${Date.now().toString(36)}_${Math.floor(Math.random() * 899 + 100)}`,
          amount: gpayAmount,
          currency: "INR",
          status: "SUCCESS",
          payerName: body.customer_name || "Aditi Patel",
          payerVpa: "aditi.patel@okhdfcbank",
          merchantId: "IND_GPAY_RETAIL",
          stateCode: stateCode || "DL",
          city: city || "New Delhi",
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      return NextResponse.json({ success: true, gateway: "GooglePay", result: data });
    }

    if (gateway === "PhonePe") {
      const phonepeAmount = amount || 1299;
      const res = await fetch(`${baseUrl}/api/webhooks/phonepe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          code: "PAYMENT_SUCCESS",
          data: {
            merchantId: "IND_PHONEPE_HUB",
            transactionId: `T${Date.now()}`,
            amount: phonepeAmount * 100, // In paise
            state: "COMPLETED",
            paymentInstrument: { type: "UPI", utr: `UTR${Date.now()}` },
            notes: {
              customer_name: body.customer_name || "Kavya Reddy",
              state_code: stateCode || "KA",
              city: city || "Bengaluru",
            },
          },
        }),
      });
      const data = await res.json();
      return NextResponse.json({ success: true, gateway: "PhonePe", result: data });
    }

    if (gateway === "Cashfree") {
      const cfAmount = amount || 3499;
      const res = await fetch(`${baseUrl}/api/webhooks/cashfree`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PAYMENT_SUCCESS_WEBHOOK",
          data: {
            order: {
              order_id: `CF_ORD_${Date.now()}`,
              order_amount: cfAmount,
              order_tags: {
                state_code: stateCode || "GJ",
                city: city || "Ahmedabad",
                shop_id: "IND_CF_SHOP_1001",
              },
            },
            payment: {
              cf_payment_id: `cf_pay_${Date.now()}`,
              payment_amount: cfAmount,
              payment_status: "SUCCESS",
            },
            customer_details: {
              customer_name: body.customer_name || "Manish Agrawal",
            },
          },
        }),
      });
      const data = await res.json();
      return NextResponse.json({ success: true, gateway: "Cashfree", result: data });
    }

    if (gateway === "PayU") {
      const payuAmount = amount || 899;
      const res = await fetch(`${baseUrl}/api/webhooks/payu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnid: `payu_tx_${Date.now()}`,
          amount: payuAmount,
          status: "success",
          mode: "UPI",
          firstname: body.customer_name || "Rahul Sengupta",
          udf1: "IND_PAYU_SHOP",
          udf2: stateCode || "TG",
          udf3: city || "Hyderabad",
          addedon: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      return NextResponse.json({ success: true, gateway: "PayU", result: data });
    }

    // Default Razorpay simulation
    const rzpAmount = amount || 2499;
    const rzpPayload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: `pay_live_sim_${Date.now().toString(36)}`,
            amount: rzpAmount * 100, // paise
            currency: "INR",
            status: "captured",
            method: "upi",
            email: "verified.customer@merchant.in",
            contact: "+919876543210",
            notes: {
              customer_name: body.customer_name || "Aarav Sharma",
              shop_id: "IND_MUM_LIVE",
              state_code: stateCode || "27",
              city: city || "Mumbai",
            },
            created_at: Math.floor(Date.now() / 1000),
          },
        },
      },
    });

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "IndiaSalesLive2026";
    const signature = crypto.createHmac("sha256", secret).update(rzpPayload).digest("hex");

    const res = await fetch(`${baseUrl}/api/webhooks/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": signature,
      },
      body: rzpPayload,
    });
    const data = await res.json();
    return NextResponse.json({ success: true, gateway: "Razorpay", result: data });
  } catch (error: unknown) {
    console.error("Simulation error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
