"use client";

import React from "react";
import { CheckCircle2, UploadCloud, RefreshCw, Cpu, Activity } from "lucide-react";

interface DashboardHeaderProps {
  regionName: string;
  onOpenUpload: () => void;
  onRetrain: () => void;
  isRetraining?: boolean;
}

export function DashboardHeader({
  regionName,
  onOpenUpload,
  onRetrain,
  isRetraining = false,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-3 border-b border-slate-800">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/20">
          <Cpu className="h-6 w-6" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Indian Retail Sales Analytics Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" /> Multi-Gateway Ingestion (INR)
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700">
              {regionName}
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
            Multi-Gateway live verified transactions (Google Pay • PhonePe • Razorpay • Cashfree • PayU) • Real-time All-India State Matrix
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-emerald-400">
          <Activity className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
          <span>Webhook Ingestion Active</span>
        </div>

        <button
          type="button"
          onClick={onRetrain}
          disabled={isRetraining}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRetraining ? "animate-spin text-emerald-400" : ""}`} />
          <span>{isRetraining ? "Syncing..." : "Sync Store"}</span>
        </button>

        <button
          type="button"
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-all"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Ingest POS CSV</span>
        </button>
      </div>
    </header>
  );
}
