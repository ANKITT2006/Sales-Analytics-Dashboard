# 🇮🇳 Pan-India Sales Analytics Engine & Real-Time Fintech Ledger

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR_Auth_%26_DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-GradientBoosting_ML-F7931E?style=flat-square&logo=scikit-learn)](https://scikit-learn.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-HMAC--SHA256_Webhooks-02042B?style=flat-square&logo=razorpay)](https://razorpay.com/)
[![Currency](https://img.shields.io/badge/Currency-INR_(₹)-047857?style=flat-square)](https://en.wikipedia.org/wiki/Indian_rupee)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

An enterprise-grade, real-time sales intelligence and transaction analytics platform engineered for Indian digital commerce and multi-tier retail networks. Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Supabase SSR**, the platform unifies dark-mode frosted glassmorphism, multi-gateway webhook ingestion, machine learning revenue forecasting, and nationwide transaction monitoring across all **28 Indian States and 8 Union Territories** with **78 verified retail merchants** holding active GSTIN & PAN credentials.

---

## 📑 Table of Contents

- [Key Highlights & Visual Aesthetics](#-key-highlights--visual-aesthetics)
- [System Architecture](#-system-architecture)
- [Core Features](#-core-features)
  - [1. Real-Time Multi-Gateway Ingestion](#1-real-time-multi-gateway-ingestion-upi-razorpay-phonepe-gpay)
  - [2. Machine Learning Sales Forecasting](#2-machine-learning-sales-forecasting-gradientboostingregressor)
  - [3. Pan-India Geographic Intelligence](#3-pan-india-geographic-intelligence-36-states--uts)
  - [4. Merchant Performance Leaderboard](#4-merchant-performance-leaderboard--dual-ranking)
  - [5. Live Transaction Streaming Feed](#5-live-transaction-streaming-feed--in-memory-broadcaster)
  - [6. Sticky Executive KPI Cards](#6-sticky-executive-kpi-cards-on-scroll)
  - [7. Interactive 2026 Calendar & Date Range Presets](#7-interactive-2026-calendar--date-range-presets)
  - [8. Complete Authentication & Artwork Reveal](#8-complete-authentication--artwork-reveal)
  - [9. Webhook Simulation Sandbox](#9-webhook-simulation-sandbox)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Development Server](#running-the-development-server)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [Razorpay Webhook Integration](#-razorpay-webhook-integration)
- [API Reference](#-api-reference)
- [NPM Scripts](#-npm-scripts)
- [Verification & Quality](#-verification--quality)
- [License](#-license)

---

## 🎨 Key Highlights & Visual Aesthetics

### Dark Navy & Gold/Copper Fintech Canvas
- **Primary Canvas**: Deep near-black navy canvas (`#0A0E12` to `#0D1217`) engineered specifically for high-density financial data legibility.
- **Metallic Gold/Copper Accents**: `#D9A15B` applied to top-line metrics, active filter states, interactive range sliders, and high-contrast call-to-actions.
- **Strict Color Semantics**:
  - **Deep Teal (`#4E9B8F`)**: Active connectivity, verified GSTIN certificates, and live gateway identifiers.
  - **Emerald Green (`#22C55E`)**: Positive financial deltas, growth rates (`▲ 14.2%`), and successful captures.
  - **Terracotta (`#C4695A`)**: Negative percentage deltas, returns, and failed attempts.
- **Typography Hierarchy**: Playfair Display serif for executive titles and high-impact headers paired with razor-sharp geometric sans-serif for numbers, timestamps, and dense data feeds.

### Frosted Glassmorphism Architecture
- **Surface Material**: `rgba(255, 255, 255, 0.05)` fill with `backdrop-filter: blur(20px) saturate(150%)` and `-webkit-backdrop-filter` for full Safari/WebKit parity.
- **Depth & Outer Glow**: Precision `1px solid rgba(255, 255, 255, 0.1)` edge borders, subtle inner top edge highlights, and ambient drop shadows.
- **Multi-Point Ambient Glow (`.bg-fintech-canvas`)**: Off-canvas radial glow points in gold (`rgba(217, 161, 91, 0.12)`) and muted teal (`rgba(78, 155, 143, 0.10)`) that refract through frosted glass cards as the user navigates.
- **Accessibility & Contrast Safeguards**: Table row backgrounds maintain high-contrast `#13191F` backdrops for instant readability, coupled with `@supports not (backdrop-filter: blur(1px))` fallbacks for legacy browsers.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             NEXT.JS 15 APP ROUTER                               │
│                                                                                 │
│  ┌─────────────────────────┐   ┌───────────────────────┐   ┌─────────────────┐  │
│  │   Executive KPI Cards   │   │  Chronological Trend  │   │  ML Forecast    │  │
│  │  (Sticky Scroll Header) │   │     (Apr-Sep 2026)    │   │  (GradientBoost)│  │
│  └─────────────────────────┘   └───────────────────────┘   └─────────────────┘  │
│  ┌─────────────────────────┐   ┌───────────────────────┐   ┌─────────────────┐  │
│  │  Pan-India Geo Matrix   │   │ Merchant Leaderboard  │   │ Live Txn Stream │  │
│  │  (36 States & UTs)      │   │ (Score vs Ingested ₹) │   │ (Real-Time SSE) │  │
│  └─────────────────────────┘   └───────────────────────┘   └─────────────────┘  │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
       ┌─────────────────────────────────┴─────────────────────────────────┐
       ▼                                                                   ▼
┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
│     DATA & INGESTION LAYER      │                       │     SECURITY & AUTH LAYER       │
│                                 │                       │                                 │
│ • Razorpay Webhook Ingestion    │                       │ • Razorpay HMAC-SHA256 Crypto   │
│   (payment.captured, order.paid)│                       │ • Supabase SSR Session Cookie   │
│ • UPI / PhonePe / GPay Sim      │                       │ • Row Level Security (RLS)      │
│ • Live SSE Transaction Stream   │                       │ • GSTIN & PAN Verification      │
│ • PapaParse CSV / JSON Export   │                       │ • Art-Reveal Auth Pages         │
└────────────────┬────────────────┘                       └─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              STORAGE & PERSISTENCE                              │
│                                                                                 │
│  ┌─────────────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │          Prisma ORM & SQLite            │  │        Supabase Postgres     │  │
│  │   (LiveTransaction, RegisteredShop)     │  │     (Cloud RLS & Auth Sync)  │  │
│  └─────────────────────────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Features

### 1. Real-Time Multi-Gateway Ingestion (UPI, Razorpay, PhonePe, GPay)
- **Live Razorpay Webhook Ingestion**: Dedicated endpoint at `/api/webhooks/razorpay` validating incoming `X-Razorpay-Signature` via HMAC-SHA256.
- Automatically handles `payment.captured` and `order.paid` events, converts paise to INR (`₹`), and records them with merchant attribution.
- Instant client reactivity updates executive counters and transaction feeds without full page reloads.

### 2. Machine Learning Sales Forecasting (GradientBoostingRegressor)
- Powered by a Python machine learning engine (`ml/train.py`) utilizing **Scikit-Learn GradientBoostingRegressor**.
- Trains over historical retail transactions with rolling statistics, 7-day/30-day lag features, day-of-week cyclical encoding, and seasonal market weightings.
- Generates 60-day predictive forward-looking curves with upper/lower confidence bands displayed inside `MlForecastChart.tsx`.
- Computes state-by-state growth forecasts, YoY comparisons, and automated anomaly indicators.

### 3. Pan-India Geographic Intelligence (36 States & UTs)
- Exhaustive coverage across **28 States and 8 Union Territories**.
- Models realistic commerce distribution patterns across high-volume hubs (Maharashtra, Karnataka, Delhi NCR, Tamil Nadu, Gujarat, Uttar Pradesh) through tier-2 and tier-3 regions.
- Interactive regional selector filters dashboard metrics by individual state or across all territories simultaneously.
- State performance matrix with turnover volume, average transaction size, and active merchant densities.

### 4. Merchant Performance Leaderboard & Dual Ranking
- Directory of **78 authenticated retail merchants** across tier-1, tier-2, and tier-3 Indian commerce hubs.
- **Dynamic 0–100 Performance Score Formula**:
  $$\text{Score} = (0.50 \times \text{Turnover Volume}) + (0.30 \times \text{Order Velocity}) + (0.20 \times \text{Compliance \& Low Return Rate})$$
- **Dual Sorting Mode**: Toggle between **★ Score (0–100)** and **₹ Ingested Revenue**.
- Export capabilities for verified retail store rosters in CSV or JSON via PapaParse.

### 5. Live Transaction Streaming Feed & In-Memory Broadcaster
- Built-in Server-Sent Events (SSE) and polling broadcaster streaming live Indian retail transactions.
- Shows customer initials, city, state, item counts, payment gateway badge (UPI, Razorpay, PhonePe, GPay, Card), GSTIN status, and INR amount.
- Pulsating live status indicator reflects sub-second heartbeat health.

### 6. Sticky Executive KPI Cards on Scroll
- 4 primary executive performance metrics (**Total Revenue**, **Active Merchants**, **Average Deal Size**, **Win Rate / Success Rate**) pin seamlessly to the top viewport (`sticky top-2 z-30`).
- Frosted glass backing ensures background content scrolls underneath without visual interference or loss of context.

### 7. Interactive 2026 Calendar & Date Range Presets
- Custom calendar popover allowing precise Start Date and End Date range queries.
- Instant 1-click presets:
  - *Last 30 Days*
  - *Last 6 Months (Apr–Sep 2026)*
  - *YTD 2026 (Jan–Sep)*
  - *All + 2026 ML Forecast*
- Header dynamically reflects active temporal filter context with live update timestamps.

### 8. Complete Authentication & Artwork Reveal
- Production-ready auth suite supporting `/login`, `/signup`, and `/forgot-password`.
- Built on **Supabase SSR** (`@supabase/ssr`) with secure server cookie handling and middleware protection.
- Interactive Star (`★`) button on auth cards smoothly unveils vibrant Indian marketplace artwork behind the form veil.

### 9. Webhook Simulation Sandbox
- Built-in UI modal allows operators and reviewers to simulate webhook triggers directly from the browser.
- Generates valid synthetic transaction payloads with random merchant attribution, Indian cities, and realistic rupee amounts.

---

## 🛠 Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router) | `15.5.24` | React Server Components, SSR, API routes |
| **UI Library** | [React](https://react.dev/) | `19.1.0` | Declarative UI and state management |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.8.3` | End-to-end static typing |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `3.4.17` | Utility-first styling & glassmorphism |
| **Icons** | [Lucide React](https://lucide.dev/) | `1.43.0` | Vector icon system |
| **Data Visualization** | [Recharts](https://recharts.org/) | `2.15.4` | Responsive SVG charts and time-series |
| **Machine Learning** | [Scikit-Learn](https://scikit-learn.org/) + Pandas | Python 3.10+ | Gradient boosting time-series forecasting |
| **Database & ORM** | [Prisma](https://www.prisma.io/) + SQLite | `7.10.0` | Local structured transaction persistence |
| **Cloud Database & Auth** | [Supabase](https://supabase.com/) SSR | `0.12.7` / `2.116.0` | Cloud database, session auth, RLS |
| **Payment Webhooks** | Razorpay SDK & HMAC-SHA256 | Native Node.js | Signature validation & payment ingestion |
| **Data Parsing & Export** | [PapaParse](https://www.papaparse.com/) | `5.7.0` | Client/server CSV streaming and export |

---

## 📂 Project Structure

```
Sales-Analytics-Dashboard/
├── ml/                                 # Machine learning pipeline
│   ├── train.py                        # GradientBoostingRegressor training script
│   ├── sales_model.joblib              # Serialized trained model
│   └── forecast_results.json           # 60-day forecast predictions & metrics
├── prisma/                             # Database schema & migrations
│   ├── dev.db                          # SQLite local database
│   └── schema.prisma                   # LiveTransaction & RegisteredShop schemas
├── public/                             # Public static assets & branding
│   └── images/                         # Logos and UI graphics
├── scripts/                            # Operational & data generation scripts
│   ├── ingest_sales.py                 # Batch transaction generator & ingestion
│   ├── export_verified_shops.js        # CSV/JSON merchant exporter
│   ├── seed_all_states_shops.js        # 36 States/UTs merchant seeder
│   └── test-webhook.mjs                # CLI Razorpay webhook tester
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/              # Aggregation & metrics endpoints
│   │   │   │   ├── geo-distribution/   # State breakdown calculations
│   │   │   │   ├── live-feed/          # Recent transaction history
│   │   │   │   ├── monthly/            # 6-month chronological baseline
│   │   │   │   ├── overview/           # Top-level executive KPI figures
│   │   │   │   ├── shops/              # Merchant directory & leaderboard
│   │   │   │   ├── state-breakdown/    # 36 State & UT metrics
│   │   │   │   ├── stream/             # Real-time transaction broadcaster
│   │   │   │   └── upload/             # CSV dataset upload pipeline
│   │   │   ├── sales/                  # Sales record querying
│   │   │   └── webhooks/
│   │   │       ├── razorpay/           # HMAC-SHA256 signature verifier
│   │   │       └── simulate/           # Webhook simulation engine
│   │   ├── forgot-password/            # Password recovery screen
│   │   ├── login/                      # Sign-in screen with art reveal
│   │   ├── signup/                     # Merchant onboarding screen
│   │   ├── globals.css                 # Glassmorphism tokens & canvas glow
│   │   ├── layout.tsx                  # Root layout & Playfair serif setup
│   │   └── page.tsx                    # Main sales dashboard page
│   ├── components/
│   │   ├── auth/                       # Sign In, Sign Up, Forgot Password cards
│   │   ├── molecules/                  # DateRangeSelector, SimulatorModal, StateSelector
│   │   ├── organisms/                  # DashboardHeader, DashboardView, EngineOverviewCards,
│   │   │                               # GeoDistributionChart, LiveTransactionsFeed,
│   │   │                               # MlForecastChart, ShopLeaderboard, StateBreakdownTable
│   │   └── templates/                  # DashboardLayout with sticky header
│   ├── data/
│   │   ├── verified_retail_shops.json  # 78 Indian merchants dataset
│   │   └── verifiedShops.ts            # Typed lookup accessors
│   ├── hooks/
│   │   └── useAnalytics.ts             # Polling & live data state hook
│   ├── lib/
│   │   ├── analytics.ts                # Score calculation & ranking logic
│   │   ├── live-events.ts              # In-memory transaction broadcaster
│   │   └── stream/
│   │       └── indiaTransactionEngine.ts # All-India synthetic stream generator
│   └── utils/
│       └── supabase/                   # Supabase SSR client, server & middleware
├── .env.example                        # Template environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node.js 20+ recommended)
- **npm** or **pnpm**
- **Python**: `3.10+` (optional, for retraining the ML forecasting model)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ANKITT2006/Sales-Analytics-Dashboard.git
   cd Sales-Analytics-Dashboard
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Install Python dependencies (if retraining ML models)**:
   ```bash
   pip install pandas numpy scikit-learn joblib
   ```

### Environment Variables

Copy the provided `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

```env
# Application Host
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000

# Local Database (SQLite via Prisma)
DATABASE_URL="file:./prisma/dev.db"

# Razorpay Credentials (from Razorpay Dashboard -> Settings -> API Keys)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Razorpay Webhook Secret (configured in Razorpay Dashboard -> Webhooks)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Supabase (Optional: for cloud auth and PostgreSQL sync)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
```

### Database Setup

Initialize and synchronize the Prisma SQLite schema:
```bash
npx prisma db push
```

*(Optional)* Seed sample transaction data:
```bash
node scripts/seed_all_states_shops.js
```

### Running the Development Server

Start the local development server:
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 Machine Learning Pipeline

The time-series forecasting model is contained within the `ml/` directory.

### Retraining the Model
To re-fit the Gradient Boosting Regressor model on the latest database transactions:
```bash
npm run train:model
# or directly:
python ml/train.py
```

### Model Capabilities
- **Cyclical Encoding**: Extracts sine/cosine transformations for days of the week, months, and shopping seasons.
- **Rolling Aggregations**: Generates 7-day and 30-day rolling averages and transaction standard deviations.
- **Output Artifacts**: Serialized model artifact saved to `ml/sales_model.joblib` and predictions exported to `ml/forecast_results.json` for frontend consumption.

---

## 💳 Razorpay Webhook Integration

### Local Testing with Ngrok
To receive real webhook callbacks from Razorpay on your local machine:

1. **Start an ngrok tunnel**:
   ```bash
   npx ngrok http 3000
   ```
   Note the public forwarding URL (e.g. `https://your-domain.ngrok-free.app`).

2. **Configure Razorpay Dashboard**:
   - Go to **Razorpay Dashboard** &rarr; **Settings** &rarr; **Webhooks** &rarr; **Add New Webhook**.
   - **Webhook URL**: `https://your-domain.ngrok-free.app/api/webhooks/razorpay`
   - **Secret**: Must match `RAZORPAY_WEBHOOK_SECRET` in `.env.local`.
   - **Active Events**: Check `payment.captured` and `order.paid`.

3. **Test with the automated CLI script**:
   ```bash
   node scripts/test-webhook.mjs
   ```

---

## 📡 API Reference

| Endpoint | Method | Description | Parameters / Query |
|---|---|---|---|
| `/api/webhooks/razorpay` | `POST` | Ingests live Razorpay payments with HMAC-SHA256 signature verification. | Header: `X-Razorpay-Signature` |
| `/api/webhooks/simulate` | `POST` | Dispatches simulated multi-gateway transaction payloads. | Body: `{ count, gateway, state }` |
| `/api/analytics/overview` | `GET` | Executive metrics (Total Revenue, Active Merchants, Avg Deal Size, Win Rate). | `?startDate=&endDate=` |
| `/api/analytics/monthly` | `GET` | 6-month continuous chronological timeline + live transaction aggregate. | `?state=MH` |
| `/api/analytics/shops` | `GET` | Directory of 78 verified merchants. Supports CSV & JSON export formats. | `?format=csv` / `?state=KA` |
| `/api/analytics/shops/leaderboard`| `GET` | Performance leaderboard ranked by Composite Score or Ingested Rupee Volume. | `?sortBy=score` / `?sortBy=revenue` |
| `/api/analytics/state-breakdown` | `GET` | Full performance breakdown across all 28 Indian States & 8 Union Territories. | - |
| `/api/analytics/stream` | `GET` | Server-Sent Events (SSE) live transaction broadcast stream. | - |
| `/api/analytics/upload` | `POST` | Upload and ingest external CSV/Excel transaction datasets. | `multipart/form-data` |
| `/api/sales` | `GET` | Raw transaction records with pagination and filtering. | `?page=1&limit=50` |

---

## 📜 NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `next dev` | Starts the Next.js development server with hot reload |
| `npm run build` | `next build` | Builds the optimized production application bundle |
| `npm run start` | `next start` | Starts the production server |
| `npm run lint` | `next lint` | Runs ESLint analysis across the repository |
| `npm run train:model` | `python ml/train.py` | Trains the Machine Learning sales forecasting model |
| `npm run ingest:data` | `python scripts/ingest_sales.py --generate-sample` | Seeds sample transaction records into the database |

---

## 🛡 Verification & Quality

- **ESLint**: Clean pass with 0 errors and 0 warnings.
- **TypeScript**: Strict mode enabled with full type safety across API routes and components.
- **Glassmorphism Parity**: Validated across Chrome, Safari, Firefox, and Edge with `-webkit-backdrop-filter` fallbacks.
- **Data Integrity**: Cryptographic HMAC-SHA256 validation on all incoming external payment webhooks.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

*Engineered with ❤️ for Indian Retail & Digital Commerce · 28 States & 8 Union Territories*
