# Sales Analytics Dashboard

A modern, responsive sales analytics dashboard built with Next.js 15, TypeScript, Tailwind CSS, and Recharts. The app visualizes deterministic monthly sales data for 2022, 2023, and 2024, with year filters, dynamic summaries, chart switching, a custom sales threshold, and a data table.

## Project description

This project demonstrates a clean App Router architecture: Server Components by default, Client Components only where interaction is required, Atomic Design UI, and a data-access layer that can later be swapped from mock data to a real API or Kaggle-backed source.

## Features

- Dashboard header with context for the selected dataset
- Year selector for 2022, 2023, and 2024
- Summary cards: total sales, average monthly sales, highest month, lowest month
- Recharts visualizations: bar, line, and pie
- Sales comparison: annual totals and month-over-month overlay vs the previous year
- Custom sales threshold filter (`sales >= threshold`)
- Sales table with month, sales, year, and target status badges
- Loading, error, and empty states
- Responsive layout for desktop, laptop, tablet, and mobile
- `GET /api/sales?year=2024` data-access API

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- ESLint (`next/core-web-vitals`, `next/typescript`)

## Folder structure

```text
src/
  app/
    api/sales/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    atoms/          # Button, Input, Select, Badge, Label, Card, Icon
    molecules/      # Stat card, year selector, filters, states
    organisms/      # Header, chart, summary, table, comparison, dashboard view
    templates/      # Dashboard layout
  data/
    sales.ts        # Deterministic mock dataset
  hooks/
    useSales.ts     # Client fetch of /api/sales
  lib/
    sales.ts        # Data-access layer
    utils.ts        # Formatting and filtering helpers
  types/
    sales.ts
```

## Installation

```bash
npm install
```

## How to run the project

Development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

## How the data works

Monthly sales figures live in `src/data/sales.ts`. They are deterministic (not random on each render) and include realistic seasonality: a slower February and a stronger Q4, with year-over-year growth.

`src/lib/sales.ts` is the only module that should read that dataset. UI components receive data through:

1. `GET /api/sales?year=2024`
2. The `useSales` hook

Summary metrics are calculated at request time from the selected year’s records. They are never hard-coded in the UI.

### Kaggle / real data later

The original brief mentioned a Kaggle sales dataset. This app does **not** download Kaggle files. To swap in a real source later:

1. Export a monthly sales CSV (month, year, sales).
2. Map rows into the `SalesRecord` type in `src/types/sales.ts`.
3. Replace `SALES_DATA` in `src/data/sales.ts`, or have `src/lib/sales.ts` fetch from a database or HTTP API instead of importing the mock array.

Suitable public starting points include retail or supermarket sales datasets on Kaggle that include order date and revenue. Aggregate those rows by calendar month before they reach this dashboard.

## How to replace mock data with API data

Today the API route reads the mock data-access layer:

```ts
// src/app/api/sales/route.ts
const payload = getSalesPayload(year);
```

To use an external API:

1. Change `getSalesByYear` in `src/lib/sales.ts` to fetch from your backend.
2. Keep the `SalesApiResponse` shape the same.
3. Leave `useSales` and the dashboard UI unchanged.

The frontend already depends on `/api/sales?year=`, not on in-component arrays.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

## Chart functionality

Use the **Bar**, **Line**, and **Pie** controls to switch visualizations for the selected year.

- Bar and line charts show monthly sales over time.
- The pie chart shows sales distribution across months.
- Charts use `ResponsiveContainer`, tooltips, legends, and currency formatting.

The comparison panel shows annual totals for all years and a monthly overlay against the previous year (when one exists).

## Filter functionality

- **Year** updates the chart, summary cards, comparison overlay, and table.
- **Show sales above** keeps months where `sales >= threshold`.
- Empty input shows every month.
- Invalid or negative values show an inline error and do not apply a filter.
- `0` is valid and includes all non-negative sales.
- Large thresholds may hide every month; the chart and table show an empty state instead of a blank area.

Table **Status** uses a $20,000 monthly target (`Above Target` / `Below Target`) and is not color-only: the badge includes text.

## Future enhancements

- Replace mock data with a Kaggle-backed ETL pipeline or live CRM/ERP API
- Persist year, chart type, and threshold in the URL query string
- Add CSV export for the filtered table
- Authentication and role-based access
- Dark mode
- Additional dimensions (region, product, channel)

## GitHub

This repository is ready to push. `node_modules` and `.next` are ignored. Do not commit secrets. If you later share a GitHub remote URL, connect it with:

```bash
git remote add origin <your-repo-url>
git push -u origin main
```
>>>>>>> 367bd55 (Initial commit: Sales Analytics Dashboard)
