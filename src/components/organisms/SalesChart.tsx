"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card, CardHeader } from "@/components/atoms/Card";
import { ChartHeader } from "@/components/molecules/ChartHeader";
import { EmptyState } from "@/components/molecules/EmptyState";
import { MONTHLY_SALES_TARGET } from "@/data/sales";
import { formatCurrency, monthShortName } from "@/lib/utils";
import type { ChartType, SalesRecord } from "@/types/sales";
import { useState, type ReactElement } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#0d9488",
  "#14b8a6",
  "#10b981",
  "#f59e0b",
  "#d97706",
  "#ea580c",
  "#8b5cf6",
  "#6366f1",
  "#4f46e5",
];

interface SalesChartProps {
  year: number;
  chartType: ChartType;
  data: SalesRecord[];
  target?: number;
}

interface ChartPoint {
  month: string;
  shortMonth: string;
  sales: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  target: number;
}

function CustomTooltip({ active, payload, label, target }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const sales = payload[0].value;
    const diff = sales - target;
    const isAbove = diff >= 0;

    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(sales)}</p>
        <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-2 text-xs">
          <span className="text-slate-500">Target: {formatCurrency(target)}</span>
          <Badge tone={isAbove ? "success" : "warning"}>
            {isAbove ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`}
          </Badge>
        </div>
      </div>
    );
  }
  return null;
}

function renderChart(
  chartType: ChartType,
  chartData: ChartPoint[],
  target: number,
  showTarget: boolean,
): ReactElement {
  const axisProps = {
    tick: { fontSize: 12, fill: "#64748b" },
    axisLine: { stroke: "#cbd5e1" },
    tickLine: { stroke: "#cbd5e1" },
  };

  if (chartType === "line") {
    return (
      <LineChart data={chartData} margin={{ top: 12, right: 12, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="shortMonth" {...axisProps} />
        <YAxis
          tickFormatter={(value: number) => formatCurrency(value)}
          width={76}
          {...axisProps}
        />
        <Tooltip content={<CustomTooltip target={target} />} />
        <Legend wrapperStyle={{ paddingTop: "8px" }} />
        {showTarget && (
          <ReferenceLine
            y={target}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={2}
            label={{
              value: `Target: ${formatCurrency(target)}`,
              position: "insideTopRight",
              fill: "#b45309",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="sales"
          name="Monthly Sales"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 6, fill: "#1d4ed8", stroke: "#ffffff", strokeWidth: 2 }}
        />
      </LineChart>
    );
  }

  if (chartType === "area") {
    return (
      <AreaChart data={chartData} margin={{ top: 12, right: 12, left: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="shortMonth" {...axisProps} />
        <YAxis
          tickFormatter={(value: number) => formatCurrency(value)}
          width={76}
          {...axisProps}
        />
        <Tooltip content={<CustomTooltip target={target} />} />
        <Legend wrapperStyle={{ paddingTop: "8px" }} />
        {showTarget && (
          <ReferenceLine
            y={target}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={2}
            label={{
              value: `Target: ${formatCurrency(target)}`,
              position: "insideTopRight",
              fill: "#b45309",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
        )}
        <Area
          type="monotone"
          dataKey="sales"
          name="Monthly Sales"
          stroke="#2563eb"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#salesGradient)"
          dot={{ r: 3.5, fill: "#2563eb", strokeWidth: 1.5, stroke: "#ffffff" }}
        />
      </AreaChart>
    );
  }

  if (chartType === "pie") {
    return (
      <PieChart>
        <Pie
          data={chartData}
          dataKey="sales"
          nameKey="month"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={105}
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={entry.month}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: unknown) => [
            typeof value === "number" ? formatCurrency(value) : "",
            "Revenue",
          ]}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: "8px" }} />
      </PieChart>
    );
  }

  return (
    <BarChart data={chartData} margin={{ top: 12, right: 12, left: 8, bottom: 8 }}>
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
      <XAxis dataKey="shortMonth" {...axisProps} />
      <YAxis
        tickFormatter={(value: number) => formatCurrency(value)}
        width={76}
        {...axisProps}
      />
      <Tooltip content={<CustomTooltip target={target} />} />
      <Legend wrapperStyle={{ paddingTop: "8px" }} />
      {showTarget && (
        <ReferenceLine
          y={target}
          stroke="#f59e0b"
          strokeDasharray="4 4"
          strokeWidth={2}
          label={{
            value: `Target: ${formatCurrency(target)}`,
            position: "insideTopRight",
            fill: "#b45309",
            fontSize: 11,
            fontWeight: 500,
          }}
        />
      )}
      <Bar
        dataKey="sales"
        name="Monthly Sales"
        fill="url(#barGradient)"
        radius={[6, 6, 0, 0]}
        maxBarSize={48}
      />
    </BarChart>
  );
}

export function SalesChart({
  year,
  chartType,
  data,
  target = MONTHLY_SALES_TARGET,
}: SalesChartProps) {
  const [showTargetLine, setShowTargetLine] = useState(true);

  const chartData: ChartPoint[] = data.map((record) => ({
    month: record.month,
    shortMonth: monthShortName(record.month),
    sales: record.sales,
  }));

  return (
    <Card className="flex flex-col justify-between min-h-[30rem]">
      <CardHeader>
        <ChartHeader
          title={`Monthly Sales Trend · ${year}`}
          description="Visualized revenue stream across months with customizable target benchmark overlay."
        />
        {chartType !== "pie" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowTargetLine(!showTargetLine)}
            className="text-xs h-7 px-2.5 text-slate-600 hover:text-slate-900 border border-slate-200"
          >
            <span
              className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                showTargetLine ? "bg-amber-500" : "bg-slate-300"
              }`}
            />
            {showTargetLine ? "Hide Target Line" : "Show Target Line"}
          </Button>
        )}
      </CardHeader>

      {chartData.length === 0 ? (
        <EmptyState
          title="No sales data available for this year."
          description="No months meet the current filters. Clear the sales threshold or choose another year."
        />
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(chartType, chartData, target, showTargetLine)}
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

