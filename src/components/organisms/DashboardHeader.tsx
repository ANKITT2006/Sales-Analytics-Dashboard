"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, UploadCloud, RefreshCw, Activity, LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearStoredUser, getStoredUser, User } from "@/lib/auth";
import { AuthPromptModal } from "@/components/molecules/AuthPromptModal";
import type { DateRangeOption } from "@/components/molecules/DateRangeSelector";

import Image from "next/image";

interface DashboardHeaderProps {
  regionName: string;
  dateRange?: DateRangeOption;
  onSelectDateRange?: (range: DateRangeOption) => void;
  onOpenUpload: () => void;
  onRetrain?: () => Promise<void>;
  isRetraining?: boolean;
}

export function DashboardHeader({
  regionName,
  dateRange = "2y",
  onSelectDateRange,
  onOpenUpload,
  onRetrain,
  isRetraining = false,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState(
    "Please sign in to access data ingestion and store synchronization."
  );

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleSignOut = () => {
    clearStoredUser();
    setUser(null);
    router.push("/login");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleIngestClick = () => {
    if (!user) {
      setAuthModalMessage("Please sign in to access data ingestion and store synchronization.");
      setIsAuthModalOpen(true);
      return;
    }
    onOpenUpload();
  };

  const handleRetrainClick = () => {
    if (!user) {
      setAuthModalMessage("Please sign in to access data ingestion and store synchronization.");
      setIsAuthModalOpen(true);
      return;
    }
    if (onRetrain) {
      onRetrain();
    }
  };

  return (
    <>
      <header className="flex flex-col gap-3 p-5 rounded-2xl glass-panel shadow-2xl">
        {/* Tier 1: Context & Informational Status Zone */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* Prototype 3D Metallic Copper Logo */}
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-[#13191F]/90 border border-[#D9A15B]/30 shadow-lg shadow-[#D9A15B]/10 p-1.5 hover:border-[#D9A15B] transition-all group">
              <Image
                src="/images/app-logo-square.png"
                alt="Pan-India Sales Analytics Logo"
                width={36}
                height={36}
                className="object-contain drop-shadow-[0_2px_8px_rgba(217,161,91,0.25)] transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#EDE6D9] font-medium">
                  Sales overview
                </h1>
              </div>
              <p className="text-xs text-[#8A949E]">
                {dateRange === "30d"
                  ? "Last 30 days · updated just now"
                  : dateRange === "6m"
                  ? "Last 6 months (Apr–Sep 2026) · updated just now"
                  : dateRange === "1y"
                  ? "Past 12 months (Oct 2025–Sep 2026) · updated just now"
                  : dateRange === "ytd"
                  ? "Year-to-date 2026 (Jan–Sep) · updated just now"
                  : dateRange === "custom"
                  ? "Custom date window · updated just now"
                  : "All history & 2026 forecast · updated just now"}
              </p>
            </div>
          </div>

          {/* Informational Status & Context Badges (Non-interactive) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4E9B8F]/15 px-3 py-1 text-xs font-semibold text-[#4E9B8F] border border-[#4E9B8F]/30 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#4E9B8F]" /> Multi-Gateway (INR)
            </span>
            <span className="inline-flex items-center rounded-full bg-[#161E26] px-3 py-1 text-xs font-semibold text-[#8A949E] border border-[#2A3745]">
              {regionName}
            </span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#12181D] border border-[#4E9B8F]/30 text-[#4E9B8F]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4E9B8F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4E9B8F]"></span>
              </span>
              <Activity className="h-3.5 w-3.5 text-[#4E9B8F]" />
              <span>Webhook Ingestion Active</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Interactive Actions Zone */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-[#222E3A]/40">
          <p className="text-[11px] sm:text-xs text-[#8A949E] hidden md:block">
            Multi-Gateway Live Streams: Google Pay • PhonePe • Razorpay • Cashfree • PayU
          </p>

          <div className="flex flex-wrap items-center gap-2.5 ml-auto sm:ml-0">
            {/* Sync Store Button */}
            <button
              type="button"
              onClick={handleRetrainClick}
              disabled={isRetraining}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#161E26] hover:bg-[#1E2934] text-[#EDE6D9] border border-[#2A3745] hover:border-[#D9A15B]/40 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
              title="Synchronize store & retrain model"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRetraining ? "animate-spin text-[#D9A15B]" : "text-[#8A949E]"}`} />
              <span>{isRetraining ? "Syncing..." : "Sync Store"}</span>
            </button>

            {/* Quick Filter Pill: "This month" (Interactive toggle) */}
            <button
              type="button"
              onClick={() => onSelectDateRange?.(dateRange === "30d" ? "2y" : "30d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 border ${
                dateRange === "30d"
                  ? "bg-[#D9A15B]/20 text-[#D9A15B] border-[#D9A15B]/50 shadow-md shadow-[#D9A15B]/15 ring-1 ring-[#D9A15B]/40"
                  : "bg-[#161E26] hover:bg-[#1E2934] text-[#EDE6D9] border-[#2A3745] hover:border-[#D9A15B]/40"
              }`}
              title={dateRange === "30d" ? "Filtered to current month / 30-day window (click to view all history)" : "Filter metrics to current active month / 30-day window"}
            >
              <span>This month</span>
              {dateRange === "30d" && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#D9A15B] animate-pulse" />
              )}
            </button>

            {/* Primary CTA: Solid Copper Button ("Export report" / "Ingest POS CSV" style) */}
            <button
              type="button"
              onClick={handleIngestClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#D9A15B] hover:bg-[#C6904A] text-[#0A0E12] shadow-md shadow-[#D9A15B]/20 transition-all hover:scale-105 active:scale-95"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Export report / Ingest</span>
            </button>

            {/* Authenticated User Status & Logout / Login Control */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-[#222E3A]/60 ml-1">
                <div className="flex items-center gap-2 rounded-xl border border-[#222E3A] bg-[#12181D] px-2.5 py-1 text-xs">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D9A15B]/20 text-[#D9A15B] font-bold text-[10px] border border-[#D9A15B]/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <span className="block font-semibold text-[#EDE6D9] truncate max-w-[110px] text-[11px]">
                      {user.name}
                    </span>
                    <span className="block text-[9px] text-[#4E9B8F] font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out to Login Page"
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold bg-[#161E26] hover:bg-[#C4695A]/20 hover:text-[#C4695A] hover:border-[#C4695A]/40 text-[#8A949E] border border-[#2A3745] transition-all active:scale-95"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#161E26] hover:bg-[#1E2934] text-[#D9A15B] border border-[#D9A15B]/40 transition-all hover:border-[#D9A15B] active:scale-95"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Professional Authentication Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        message={authModalMessage}
      />
    </>
  );
}

