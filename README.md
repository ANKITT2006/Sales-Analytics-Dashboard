# Real-Time Indian Retail Sales Analytics Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Webhook_Ingestion-02042B?style=flat-square&logo=razorpay)](https://razorpay.com/)
[![Currency](https://img.shields.io/badge/Currency-INR_(₹)-047857?style=flat-square)](https://en.wikipedia.org/wiki/Indian_rupee)

An enterprise-grade, real-time Indian retail sales intelligence dashboard built with Next.js (App Router), TypeScript, and Tailwind CSS. It streams live retail and digital transactions across all **28 Indian States and 8 Union Territories**, ingests cryptographically verified **Razorpay webhooks**, and manages a nationwide network of **78 authenticated retail merchants** with active GSTIN and PAN validation.

---

## Key Features

- **Live Razorpay Webhook Ingestion**:
  - Secure webhook endpoint at `/api/webhooks/razorpay` validating incoming `X-Razorpay-Signature` with HMAC-SHA256.
  - Automatically captures `payment.captured` and `order.paid` events, converts paise to INR (`₹`), and updates persistent storage.
  - Multi-gateway webhook architecture with dedicated routes for **Google Pay**, **PhonePe**, **Cashfree**, and **PayU**.

- **All-India 36 State & UT Transaction Stream**:
  - Background transaction ticker modeling realistic Indian digital commerce weighting (Maharashtra, Karnataka, Delhi NCR, Tamil Nadu, Gujarat, Uttar Pradesh, etc.).
  - Tracks state-by-state gross volume, average order values (AOV), transaction counts, and market share percentages.

- **Verified Retail Merchant Network (78 Stores)**:
  - Database-backed directory of 78 authenticated retail stores across every state and union territory in India.
  - Complete with state GST codes (01 to 38), 15-digit GSTINs, 10-digit PANs, business categories, and verification badges.
  - Interactive UI tab with search, state filtering, and direct **CSV / JSON export**.

- **Indian Rupee (INR) Formatting Standard**:
  - Strict Indian numbering system compliance (e.g., `₹1,25,000` Lakhs and `₹1,50,00,000` Crores).
  - Clean empty states ("₹0.00", "0 transactions") with zero synthetic demo data hardcoded.

- **Embedded Webhook Simulator Modal**:
  - Interactive developer modal to fire mock-verified or live test webhooks for Razorpay, Google Pay, PhonePe, Cashfree, and PayU without leaving the browser.

- **Machine Learning Sales Forecasting**:
  - Historical and predictive time-series revenue projections with confidence intervals.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom dark glassmorphism
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database**: SQLite via `@prisma/client` and Node.js built-in `node:sqlite`
- **Payments / Webhooks**: Razorpay Webhooks (HMAC-SHA256 cryptographic verification)

---

## Repository Structure

```
├── prisma/
│   └── schema.prisma              # Database schema (LiveTransaction, RegisteredShop)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/         # Analytical aggregate endpoints (overview, monthly, shops)
│   │   │   │   ├── shops/         # Verified shop directory API (?format=csv / json)
│   │   │   │   └── state-breakdown/# 36 State & UT metrics
│   │   │   └── webhooks/          # Payment gateway webhook endpoints
│   │   │       ├── razorpay/      # Razorpay HMAC signature verifier & ingestion
│   │   │       ├── googlepay/     # Google Pay transaction handler
│   │   │       ├── phonepe/       # PhonePe transaction handler
│   │   │       └── simulate/      # Webhook testing sandbox
│   │   ├── globals.css            # Custom glassmorphic utilities and styling
│   │   └── page.tsx               # Primary dashboard page
│   ├── components/
│   │   ├── molecules/             # Simulator modal, State selector, Date filters
│   │   ├── organisms/             # Overview cards, Leaderboard, State table, Charts
│   │   └── templates/             # Dashboard responsive layout shell
│   ├── data/
│   │   ├── verified_retail_shops.json  # 78 Verified Indian stores dataset
│   │   ├── verified_retail_shops.csv   # Downloadable spreadsheet
│   │   └── verifiedShops.ts       # Typed accessors and lookup utilities
│   ├── hooks/
│   │   └── useAnalytics.ts        # Dynamic polling and live state management
│   └── lib/
│       ├── analytics.ts           # SQLite aggregation and ranking algorithms
│       └── stream/
│           └── indiaTransactionEngine.ts # All-India real-time streaming service
├── .env.example                   # Safe environment template
├── package.json
└── README.md
```

---

## Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/ANKITT2006/Sales-Analytics-Dashboard.git
cd Sales-Analytics-Dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials in `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
DATABASE_URL="file:./prisma/dev.db"

# Razorpay Credentials (from Dashboard -> Settings -> API Keys)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Razorpay Webhook Secret (configured when creating a webhook)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Razorpay Webhook Setup (Local Development)

To receive real payments from Razorpay test checkout on your local machine:

1. **Start ngrok tunnel**:
   ```bash
   npx ngrok http 3000
   ```
   Copy the forwarding HTTPS URL (e.g., `https://abc1-23.ngrok-free.app`).

2. **Configure Razorpay Webhook**:
   - Go to **Razorpay Dashboard** &rarr; **Settings** &rarr; **Webhooks** &rarr; **Add New Webhook**.
   - **Webhook URL**: `https://<your-ngrok-domain>/api/webhooks/razorpay`
   - **Secret**: Enter the same secret set in `RAZORPAY_WEBHOOK_SECRET` in your `.env.local`.
   - **Active Events**:
     - `payment.captured`
     - `order.paid`
   - Save the webhook.

3. **Verify Incoming Payments**:
   - Complete a test payment using Razorpay Checkout or test cards.
   - Watch the Next.js terminal logs and observe the dashboard update instantly in INR (`₹`) without page reload!

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/webhooks/razorpay` | `POST` | Ingests verified Razorpay webhook payload with `X-Razorpay-Signature` validation. |
| `/api/webhooks/googlepay` | `POST` | Ingests verified Google Pay UPI transaction events. |
| `/api/webhooks/simulate` | `POST` | Developer endpoint to trigger simulated webhook payloads. |
| `/api/analytics/overview` | `GET` | Aggregated executive KPIs (Revenue, AOV, Transactions, Active Stores). |
| `/api/analytics/shops` | `GET` | Directory of 78 verified retail shops. Supports `?format=csv` and `?state=MH`. |
| `/api/analytics/shops/leaderboard` | `GET` | Merchant performance rankings by volume and order count. |
| `/api/analytics/state-breakdown` | `GET` | All-India 28 state & 8 UT breakdown matrix. |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
