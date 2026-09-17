# Pan-India Sales Analytics Engine & Real-Time Fintech Ledger

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Design](https://img.shields.io/badge/Design-Glassmorphism_Fintech-d9a15b?style=flat-square)](https://github.com/ANKITT2006/Sales-Analytics-Dashboard)
[![Razorpay](https://img.shields.io/badge/Razorpay-Webhook_Ingestion-02042B?style=flat-square&logo=razorpay)](https://razorpay.com/)
[![Currency](https://img.shields.io/badge/Currency-INR_(₹)-047857?style=flat-square)](https://en.wikipedia.org/wiki/Indian_rupee)

An enterprise-grade, real-time sales intelligence and transaction analytics platform engineered for Indian retail and digital commerce. Built on **Next.js 15 (App Router)**, **React 19**, and **TypeScript**, the platform combines a distinctive dark navy and warm gold/copper fintech ledger aesthetic with frosted glassmorphism surfaces, multi-gateway webhook ingestion, state-by-state geographic distribution across all **28 Indian States & 8 Union Territories**, and a nationwide directory of **78 authenticated retail merchants** with active GSTIN and PAN compliance.

---

## Highlights & Visual Identity

### 🎨 Dark Navy & Gold/Copper Fintech Aesthetic
- **Canvas & Background**: Deep near-black navy canvas (`#0A0E12` to `#0D1217`) engineered for dark-mode data density.
- **Metallic Gold/Copper Accent**: `#D9A15B` applied to primary financial figures, active tabs, interactive sliders, and solid high-contrast CTA buttons.
- **Unified Status Architecture**:
  - **Deep Teal (`#4E9B8F`)**: Standardized for "connected / live / GSTIN verified" badges and multi-gateway identifiers.
  - **Emerald Green (`#22C55E`)**: Reserved exclusively for positive revenue growth deltas (`▲ 12.4%`).
  - **Terracotta (`#C4695A`)**: Negative percentage deltas and return rates.
- **Typography Hierarchy**: Playfair Display serif for display titles and card headers paired with crisp geometric sans-serif for numbers, timestamps, and dense data rows.

### 🪟 Frosted Glassmorphism Architecture
All dashboard panels, charts, containers, and authentication cards use a custom glass recipe:
- **Surface Material**: `rgba(255, 255, 255, 0.05)` fill with `backdrop-filter: blur(20px) saturate(150%)` and `-webkit-backdrop-filter` for Safari support.
- **Depth & Edges**: `1px solid rgba(255, 255, 255, 0.1)` with subtle top inner highlight `inset 0 1px 0 rgba(255, 255, 255, 0.05)` and ambient drop shadow `0 8px 32px rgba(0, 0, 0, 0.35)`.
- **Ambient Canvas Glow (`.bg-fintech-canvas`)**: Multi-point fixed off-canvas radial gradients in gold (`rgba(217, 161, 91, 0.12)`) and muted teal (`rgba(78, 155, 143, 0.10)`) that illuminate behind frosted panels, creating vibrant refraction across viewport scroll.
- **Accessibility & Contrast Safeguards**: Data-dense table rows retain solid `#13191F` fills so INR currency figures and transaction IDs stay razor-sharp, with a solid `@supports not (backdrop-filter: blur(1px))` fallback for legacy browsers.

---

## Core Features & Functionality

### 1. Sticky Executive KPI Cards on Scroll
- The 4 core executive metric cards (**Total revenue**, **Active Merchants**, **Avg deal size**, **Win rate**) pin to the top of the viewport (`sticky top-2 z-30`) with an ambient frosted glass backdrop.
- Reviewers and operators maintain constant visibility over top-level KPIs while scrolling through long transaction feeds and leaderboard tables.

### 2. Multi-Gateway Real-Time Ingestion (UPI, Razorpay, PhonePe, GPay)
- **Live Razorpay Webhook Ingestion**: Dedicated endpoint at `/api/webhooks/razorpay` validating incoming `X-Razorpay-Signature` via HMAC-SHA256.
- Automatically captures `payment.captured` and `order.paid` events, converts paise to INR (`₹`), and updates persistent storage.
- Real-time client reactivity polls and reacts to newly ingested transactions without full page reloads.
- Built-in simulation sandbox for testing mock webhooks directly from the UI.

### 3. Chronological 6-Month Revenue Trend Line
- Replaces isolated single data points with a continuous 6-month financial baseline (Apr, May, Jun, Jul, Aug, Sep 2026), dynamically scaled by state market share.
- Current live-streamed transactions aggregate into the active month in real-time.

### 4. Interactive 2026 Calendar & Date Filters
- **Interactive Calendar Picker**: Custom date popover with Start Date and End Date inputs and quick presets:
  - *Last 30 Days*
  - *Last 6 Mo (Apr–Sep 2026)*
  - *YTD 2026 (Jan–Sep)*
  - *All + 2026 ML Forecast*
- **Dynamic Header Subtitle**: Dynamically updates context (e.g., `"Last 30 days · updated just now"`, `"Year-to-date 2026"`).
- **"This Month" Interactive Toggle**: Tier-2 header button toggles the 30-day window with active copper highlight and pulsating live indicator.

### 5. Two-Tier Header Hierarchy
- **Tier 1 (Status & Context)**: Brand logo, dashboard title, live timestamp, and passive status pills (`Multi-Gateway (INR)`, `All India`, `Webhook Ingestion Active`).
- **Tier 2 (Interactive Controls)**: Clickable actions (`Sync Store`, `This month`, `Export report / Ingest`, `User Profile / Sign In`).

### 6. Merchant Performance Leaderboard with Dual Ranking
- **Transparent 0–100 Performance Score**: Evaluated dynamically from:
  - **50%** Turnover Volume
  - **30%** Order Velocity
  - **20%** GSTIN Compliance & low return rates
- **Dual Sorting Control**: Reviewers can toggle ranking by either **★ Score (0–100)** or **₹ Ingested Revenue**.

### 7. All-India Geographic Intelligence (36 States & UTs)
- Comprehensive geographic breakdown matrix covering all 28 states and 8 union territories.
- Models weighted Indian digital commerce distribution (Maharashtra, Karnataka, Delhi NCR, Tamil Nadu, Gujarat, Uttar Pradesh, etc.).
- Direct CSV and JSON export support for verified retail merchant directories.

### 8. Full Authentication Suite & Artwork Reveal
- Complete login, signup, and password recovery flows (`/login`, `/signup`, `/forgot-password`).
- Frosted glass credentials card with dark center veil ensuring WCAG AA label contrast.
- Interactive Star button (`★`) reveals vibrant Indian marketplace artwork behind the authentication form.

### 9. Dedicated Pan-India Page Footer
- Custom bottom signature: *"Made with ❤️ for Indian Retail & Commerce · 28 States & 8 Union Territories"* with GSTIN Certified Network and Real-Time UPI Ledger badges.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15.5](https://nextjs.org/) (App Router, React 19) |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom Glassmorphism CSS Tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts 2.15](https://recharts.org/) |
| **Database & ORM** | SQLite + [@prisma/client](https://www.prisma.io/) + Node.js `node:sqlite` |
| **Webhooks & Auth** | Razorpay HMAC-SHA256 cryptographic verification |
| **Parser / Export** | PapaParse 5.7 (CSV export & streaming) |

---

## Project Structure

```
├── prisma/
│   └── schema.prisma              # Database schema (LiveTransaction, RegisteredShop)
├── public/
│   ├── images/                    # Application logos and brand assets
│   └── README.txt
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/         # Aggregate endpoints (overview, monthly, shops)
│   │   │   │   ├── monthly/       # 6-month chronological baseline & live aggregation
│   │   │   │   ├── shops/         # 78 Verified retail merchant directory (?format=csv/json)
│   │   │   │   └── state-breakdown/# 36 State & UT metrics
│   │   │   └── webhooks/          # Payment gateway webhook handlers
│   │   │       ├── razorpay/      # HMAC-SHA256 signature verifier & ingestion
│   │   │       └── simulate/      # Webhook simulation engine
│   │   ├── forgot-password/       # Password recovery flow
│   │   ├── login/                 # Sign-in screen with frosted glass & art reveal
│   │   ├── signup/                # Merchant onboarding & registration
│   │   ├── globals.css            # Glassmorphism tokens, ambient canvas glow, and utilities
│   │   ├── layout.tsx             # Root layout with Playfair Display serif font setup
│   │   └── page.tsx               # Primary dashboard interface
│   ├── components/
│   │   ├── auth/                  # SignInCard, SignUpCard, ForgotPasswordCard, AuthLayout
│   │   ├── molecules/             # DateRangeSelector, SimulatorModal, StateSelector
│   │   ├── organisms/             # DashboardHeader, DashboardView, EngineOverviewCards,
│   │   │                          # MlForecastChart, GeoDistributionChart, LiveTransactionsFeed,
│   │   │                          # ShopLeaderboard, StateBreakdownTable
│   │   └── templates/             # DashboardLayout with sticky header & ambient canvas
│   ├── data/
│   │   ├── verified_retail_shops.json  # 78 Verified Indian stores dataset
│   │   └── verifiedShops.ts       # Typed accessors and lookup utilities
│   ├── hooks/
│   │   └── useAnalytics.ts        # Polling and live transaction state management
│   └── lib/
│       ├── analytics.ts           # Aggregation and ranking algorithms
│       ├── live-events.ts         # In-memory transaction broadcaster
│       └── stream/
│           └── indiaTransactionEngine.ts # All-India real-time streaming engine
├── .env.example                   # Environment variable template
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

Populate your `.env.local` configuration:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
DATABASE_URL="file:./prisma/dev.db"

# Razorpay Credentials (from Dashboard -> Settings -> API Keys)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Razorpay Webhook Secret (configured when setting up webhook endpoint)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live dashboard.

---

## Razorpay Webhook Integration (Live Testing)

To test incoming live webhooks on your local machine:

1. **Expose Local Server**:
   ```bash
   npx ngrok http 3000
   ```
   Copy the assigned HTTPS forwarding URL (e.g., `https://abc-123.ngrok-free.app`).

2. **Configure in Razorpay Dashboard**:
   - Navigate to **Razorpay Dashboard** &rarr; **Settings** &rarr; **Webhooks** &rarr; **Add New Webhook**.
   - **Webhook URL**: `https://<your-ngrok-url>/api/webhooks/razorpay`
   - **Secret**: Must match `RAZORPAY_WEBHOOK_SECRET` in `.env.local`.
   - **Active Events**:
     - `payment.captured`
     - `order.paid`
   - Save the webhook configuration.

3. **Verify Payments**:
   - Initiate a test payment using Razorpay Checkout.
   - The webhook handler validates `X-Razorpay-Signature` via HMAC-SHA256 and records the transaction.
   - The dashboard updates immediately in INR (`₹`) without manual page refreshes.

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/webhooks/razorpay` | `POST` | Ingests verified Razorpay webhook payload with `X-Razorpay-Signature` validation. |
| `/api/webhooks/simulate` | `POST` | Triggers simulated multi-gateway webhook payloads for testing. |
| `/api/analytics/overview` | `GET` | Executive metrics (Total Revenue, Active Merchants, Deal Size, Win Rate). |
| `/api/analytics/monthly` | `GET` | 6-month continuous chronological timeline + live transaction aggregation. |
| `/api/analytics/shops` | `GET` | Directory of 78 verified retail stores. Supports `?format=csv` and `?state=MH`. |
| `/api/analytics/shops/leaderboard` | `GET` | Merchant performance leaderboard ranked by Score or Ingested Revenue. |
| `/api/analytics/state-breakdown` | `GET` | State and union territory metrics across 36 regions. |

---

## Quality & Verification

- **Linting**: Passed with zero errors and zero warnings (`✔ No ESLint warnings or errors`).
- **Responsive Design**: Mobile, tablet, and widescreen desktop layouts supported.
- **Cross-Browser Glassmorphism**: Built with `-webkit-backdrop-filter` and progressive enhancement `@supports` fallbacks.

---

## License

This project is open-source under the [MIT License](LICENSE).

---

*Made with ❤️ for Indian Retail & Commerce · 28 States & 8 Union Territories*
