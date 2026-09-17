import crypto from "crypto";

async function main() {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "IndiaSalesLive2026";
  const testId = "pay_test_migration_" + Date.now();
  const payload = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: testId,
          amount: 499900, // 4999.00 INR in paise
          currency: "INR",
          status: "captured",
          method: "upi",
          email: "vikram.malhotra@retail.in",
          contact: "+919876543210",
          created_at: Math.floor(Date.now() / 1000),
          notes: {
            customer_name: "Vikram Malhotra",
            shop_id: "IND_SHOP_1001",
            state_code: "27",
            city: "Mumbai",
          },
        },
      },
    },
  });

  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  console.log("Sending synthetic Razorpay webhook with signature for payment:", testId);
  const response = await fetch("http://localhost:3000/api/webhooks/razorpay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": signature,
    },
    body: payload,
  });

  const rawText = await response.text();
  console.log("Response Status:", response.status);
  console.log("Snippet:", rawText.slice(0, 300));
}

main().catch(console.error);
