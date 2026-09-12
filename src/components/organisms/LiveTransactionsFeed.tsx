"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  RefreshCw,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Play,
  Pause,
  Zap,
  MapPin,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { NationalTransaction } from "@/lib/stream/indiaTransactionEngine";
import { GatewaySimulatorModal } from "@/components/molecules/GatewaySimulatorModal";

interface LiveTransactionsFeedProps {
  selectedState?: string;
}

export function LiveTransactionsFeed({ selectedState = "ALL" }: LiveTransactionsFeedProps) {
  const [transactions, setTransactions] = useState<NationalTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const fetchLiveFeed = useCallback(async () => {
    try {
      const stateParam = selectedState !== "ALL" ? `&state=${selectedState}` : "";
      const res = await fetch(`/api/analytics/live-feed?limit=18${stateParam}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTransactions(json.data);
        if (typeof json.is_running === "boolean") {
          setIsRunning(json.is_running);
        }
        setLastRefreshed(new Date());

        // Check if top transaction is verified
        if (json.data[0]?.is_verified || json.data[0]?.is_verified_razorpay) {
          setHighlightedId(json.data[0].transaction_id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch live feed:", err);
    }
  }, [selectedState]);

  useEffect(() => {
    fetchLiveFeed();
    const interval = setInterval(fetchLiveFeed, 1500);
    return () => clearInterval(interval);
  }, [fetchLiveFeed]);

  const toggleStream = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/analytics/live-feed?action=toggle");
      const json = await res.json();
      if (json.success) {
        setIsRunning(json.is_running);
      }
    } catch (err) {
      console.error("Failed to toggle stream:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodIcon = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes("upi")) return <Smartphone className="h-3.5 w-3.5 text-purple-400" />;
    return <CreditCard className="h-3.5 w-3.5 text-blue-400" />;
  };

  const renderVerificationBadge = (tx: NationalTransaction) => {
    const isVerified = tx.is_verified || tx.is_verified_razorpay;
    if (!isVerified) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-700">
          Macro Ingestion
        </span>
      );
    }

    const gw = tx.gateway || "Razorpay";
    let badgeClasses = "bg-emerald-500/20 text-emerald-300 border-emerald-400";
    let label = "VERIFIED RAZORPAY";

    if (gw === "GooglePay") {
      badgeClasses = "bg-blue-500/20 text-blue-300 border-blue-400";
      label = "VERIFIED GOOGLE PAY";
    } else if (gw === "PhonePe") {
      badgeClasses = "bg-purple-500/20 text-purple-300 border-purple-400";
      label = "VERIFIED PHONEPE";
    } else if (gw === "Cashfree") {
      badgeClasses = "bg-cyan-500/20 text-cyan-300 border-cyan-400";
      label = "VERIFIED CASHFREE";
    } else if (gw === "PayU") {
      badgeClasses = "bg-lime-500/20 text-lime-300 border-lime-400";
      label = "VERIFIED PAYU";
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-black border shadow-md ${badgeClasses}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        {label}
      </span>
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shadow-inner">
              <Activity className="h-5 w-5" />
              {isRunning && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Live Multi-Gateway Transaction Stream
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <Zap className="h-3 w-3" /> All-India UPI & Cards
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Listening to Razorpay, Google Pay, PhonePe, Cashfree, and PayU live webhooks
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simulate Gateway Payment</span>
            </button>

            <button
              type="button"
              onClick={toggleStream}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isRunning
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-3 w-3 text-amber-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-white" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={fetchLiveFeed}
              className="p-1.5 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              title="Manual Sync"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Ticker Table */}
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-xs text-slate-400">
            <Activity className="h-6 w-6 text-slate-600 mb-2 animate-pulse" />
            <p className="font-semibold text-slate-300">Listening for national transactions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
                <tr>
                  <th className="py-2.5 px-3">State & City</th>
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Amount (INR)</th>
                  <th className="py-2.5 px-3">Gateway / Channel</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3 text-center">Gateway Verification</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((tx, idx) => {
                  const isVerified = tx.is_verified || tx.is_verified_razorpay;
                  const isPulse = highlightedId === tx.transaction_id;

                  return (
                    <tr
                      key={`${tx.transaction_id}-${idx}`}
                      className={`transition-all duration-500 ${
                        isVerified
                          ? "bg-slate-900/90 border-l-4 border-l-emerald-400 ring-1 ring-emerald-500/30 shadow-md"
                          : "hover:bg-slate-800/40"
                      } ${isPulse ? "animate-pulse" : ""}`}
                    >
                      {/* State & City */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                            {tx.state_code}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{tx.state_name}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <MapPin className="h-2.5 w-2.5 text-slate-500" />
                              {tx.city}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Transaction ID */}
                      <td className="py-3 px-3 font-mono text-xs text-slate-300">
                        {tx.transaction_id}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 font-mono font-bold text-white text-sm">
                        <span className={isVerified ? "text-emerald-400 font-black text-base" : ""}>
                          {formatCurrency(tx.amount_inr)}
                        </span>
                      </td>

                      {/* Payment Method & Provider */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                          {getMethodIcon(tx.method)}
                          <span>{tx.payment_provider || tx.method}</span>
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="text-[11px] text-slate-300 font-medium">
                          {tx.category}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3 text-slate-300 font-medium">
                        {tx.customer_name}
                      </td>

                      {/* Verification Badge */}
                      <td className="py-3 px-3 text-center">
                        {renderVerificationBadge(tx)}
                      </td>

                      {/* Time */}
                      <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-400">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gateway Simulator Modal */}
      <GatewaySimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSuccess={fetchLiveFeed}
      />
    </>
  );
}
