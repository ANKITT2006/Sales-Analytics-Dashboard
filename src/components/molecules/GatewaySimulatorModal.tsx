"use client";

import React, { useState } from "react";
import {
  X,
  Zap,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Building,
  DollarSign,
  Send,
} from "lucide-react";
import { ALL_INDIAN_STATES } from "@/lib/stream/indiaTransactionEngine";

interface GatewaySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type GatewayKey = "GooglePay" | "PhonePe" | "Razorpay" | "Cashfree" | "PayU";

const GATEWAYS: Array<{
  id: GatewayKey;
  name: string;
  badge: string;
  color: string;
  textColor: string;
  borderColor: string;
  icon: typeof Smartphone;
  defaultAmount: number;
  defaultState: string;
  defaultCity: string;
}> = [
  {
    id: "GooglePay",
    name: "Google Pay (UPI)",
    badge: "VERIFIED GOOGLE PAY",
    color: "bg-blue-500/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/40",
    icon: Smartphone,
    defaultAmount: 650,
    defaultState: "DL",
    defaultCity: "New Delhi",
  },
  {
    id: "PhonePe",
    name: "PhonePe (UPI)",
    badge: "VERIFIED PHONEPE",
    color: "bg-purple-500/20",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/40",
    icon: Smartphone,
    defaultAmount: 1299,
    defaultState: "KA",
    defaultCity: "Bengaluru",
  },
  {
    id: "Razorpay",
    name: "Razorpay (Cards/UPI)",
    badge: "VERIFIED RAZORPAY",
    color: "bg-emerald-500/20",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    icon: CreditCard,
    defaultAmount: 2499,
    defaultState: "MH",
    defaultCity: "Mumbai",
  },
  {
    id: "Cashfree",
    name: "Cashfree Payments",
    badge: "VERIFIED CASHFREE",
    color: "bg-cyan-500/20",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/40",
    icon: Building,
    defaultAmount: 3499,
    defaultState: "GJ",
    defaultCity: "Ahmedabad",
  },
  {
    id: "PayU",
    name: "PayU Gateway",
    badge: "VERIFIED PAYU",
    color: "bg-lime-500/20",
    textColor: "text-lime-400",
    borderColor: "border-lime-500/40",
    icon: DollarSign,
    defaultAmount: 899,
    defaultState: "TG",
    defaultCity: "Hyderabad",
  },
];

export function GatewaySimulatorModal({
  isOpen,
  onClose,
  onSuccess,
}: GatewaySimulatorModalProps) {
  const [selectedGateway, setSelectedGateway] = useState<GatewayKey>("GooglePay");
  const [amount, setAmount] = useState<number>(650);
  const [selectedState, setSelectedState] = useState<string>("DL");
  const [customerName, setCustomerName] = useState<string>("Aditi Patel");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentGw = GATEWAYS.find((g) => g.id === selectedGateway) || GATEWAYS[0];

  const handleGatewayChange = (gw: GatewayKey) => {
    setSelectedGateway(gw);
    const g = GATEWAYS.find((item) => item.id === gw);
    if (g) {
      setAmount(g.defaultAmount);
      setSelectedState(g.defaultState);
    }
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLastResult(null);

    try {
      const stateObj = ALL_INDIAN_STATES.find((s) => s.code === selectedState);
      const city = stateObj?.tierCities[0] || currentGw.defaultCity;

      const res = await fetch("/api/webhooks/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: selectedGateway,
          amount,
          state_code: selectedState,
          city,
          customer_name: customerName,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setLastResult(`Success! ${currentGw.badge} recorded and broadcasted.`);
        if (onSuccess) onSuccess();
      } else {
        setLastResult(`Error: ${json.error || "Simulation failed"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error triggering webhook";
      setLastResult(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Multi-Gateway Webhook Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Trigger verified live webhooks across Indian payment providers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Gateway Selection Buttons */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Select Payment Gateway:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GATEWAYS.map((gw) => {
              const isSelected = selectedGateway === gw.id;
              const Icon = gw.icon;
              return (
                <button
                  key={gw.id}
                  type="button"
                  onClick={() => handleGatewayChange(gw.id)}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? `${gw.color} ${gw.borderColor} ring-2 ring-emerald-400/50 shadow-md`
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`h-3.5 w-3.5 ${gw.textColor}`} />
                    <span className="font-bold text-xs text-white">{gw.name.split(" ")[0]}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${gw.textColor}`}>
                    {gw.badge.replace("VERIFIED ", "")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSimulate} className="mt-4 space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Amount (INR ₹):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="100000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-mono font-bold text-white focus:border-emerald-500 focus:outline-none"
                required
              />
              <div className="flex items-center gap-1">
                {[499, 1299, 2499, 4999].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Customer Name:
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Indian State:
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                {ALL_INDIAN_STATES.slice(0, 15).map((s) => (
                  <option key={s.code} value={s.code} className="bg-slate-900 text-white">
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {lastResult && (
            <div
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                lastResult.startsWith("Success")
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{lastResult}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Dispatching Webhook..." : `Send ${currentGw.name} Payment`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
