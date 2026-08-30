import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/atoms/Card";
import { Icon } from "@/components/atoms/Icon";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: "brand" | "success" | "warning" | "neutral";
}

const iconTone: Record<NonNullable<StatCardProps["tone"]>, string> = {
  brand: "bg-brand-50 text-brand-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-800",
  neutral: "bg-slate-100 text-slate-700",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-sm text-slate-500">
              <Badge tone={tone === "brand" ? "brand" : tone}>{hint}</Badge>
            </p>
          ) : null}
        </div>
        <Icon className={iconTone[tone]}>{icon}</Icon>
      </div>
    </Card>
  );
}
