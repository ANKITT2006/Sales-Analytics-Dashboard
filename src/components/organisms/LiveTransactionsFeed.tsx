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
import { AuthPromptModal } from "@/components/molecules/AuthPromptModal";
import { getStoredUser, getAuthHeaders } from "@/lib/auth";

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState(
    "Please sign in to access payment gateway simulation and test transaction ingestion."
  );

  const fetchLiveFeed = useCallback(async () => {
    try {
      const stateParam = selectedState !== "ALL" ? `&state=${selectedState}` : "";
      const res = await fetch(`/api/analytics/live-feed?limit=18${stateParam}`, {
        headers: getAuthHeaders(),
      });
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

  const handleOpenSimulator = () => {
    const user = getStoredUser();
    if (!user) {
      setAuthModalMessage("Please sign in to access payment gateway simulation and test transaction ingestion.");
      setIsAuthModalOpen(true);
      return;
    }
    setIsSimulatorOpen(true);
  };

  const toggleStream = async () => {
    const user = getStoredUser();
    if (!user) {
      setAuthModalMessage("Please sign in to manage national transaction stream simulation.");
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/analytics/live-feed?action=toggle", {
        headers: getAuthHeaders(),
      });
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
    } else    if (gw === "Razorpay") {
      badgeClasses = "bg-[#4E9B8F]/20 text-[#4E9B8F] border-[#4E9B8F]/40";
      label = "VERIFIED RAZORPAY";
    } else if (gw === "Google Pay") {
      badgeClasses = "bg-[#4E9B8F]/20 text-[#4E9B8F] border-[#4E9B8F]/40";
      label = "VERIFIED GPAY";
    } else if (gw === "PhonePe") {
      badgeClasses = "bg-[#4E9B8F]/20 text-[#4E9B8F] border-[#4E9B8F]/40";
      label = "VERIFIED PHONEPE";
    } else if (gw === "Cashfree") {
      badgeClasses = "bg-[#D9A15B]/20 text-[#D9A15B] border-[#D9A15B]/40";
      label = "VERIFIED CASHFREE";
    } else if (gw === "PayU") {
      badgeClasses = "bg-[#D9A15B]/20 text-[#D9A15B] border-[#D9A15B]/40";
      label = "VERIFIED PAYU";
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border shadow-md ${badgeClasses}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        {label}
      </span>
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-[#222E3A] bg-[#13191F]/90 p-5 shadow-xl backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A222B] text-[#D9A15B] border border-[#222E3A]">
              <Activity className="h-5 w-5" />
              {isRunning && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4E9B8F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4E9B8F]"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#EDE6D9] font-serif tracking-tight">
                  Live Multi-Gateway Transaction Stream
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D9A15B]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#D9A15B] border border-[#D9A15B]/30">
                  <Zap className="h-3 w-3" /> All-India UPI & Cards
                </span>
              </div>
              <p className="text-xs text-[#8A949E]">
                Listening to Razorpay, Google Pay, PhonePe, Cashfree, and PayU live webhooks
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleOpenSimulator}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#D9A15B] hover:bg-[#C6904A] text-[#0A0E12] shadow-md shadow-[#D9A15B]/20 transition-all active:scale-95"
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
                  ? "bg-[#161E26] hover:bg-[#1E2934] text-[#EDE6D9] border-[#2A3745]"
                  : "bg-[#4E9B8F] hover:bg-[#3F877C] text-[#0A0E12] border-[#4E9B8F]"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-3 w-3 text-[#D9A15B]" />
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
              className="p-1.5 rounded-xl text-[#8A949E] bg-[#161E26] hover:bg-[#1E2934] hover:text-[#EDE6D9] border border-[#2A3745] transition-all"
              title="Manual Sync"
            >
              <RefreshCw className="h-3.5 w-3.5" />
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

      {/* Authentication Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        message={authModalMessage}
      />
    </>
  );
}
