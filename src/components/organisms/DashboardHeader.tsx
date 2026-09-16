"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, UploadCloud, RefreshCw, Cpu, Activity, LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearStoredUser, getStoredUser, User } from "@/lib/auth";
import { AuthPromptModal } from "@/components/molecules/AuthPromptModal";

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
    onRetrain();
  };

  return (
    <>
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
            onClick={handleRetrainClick}
            disabled={isRetraining}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRetraining ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isRetraining ? "Syncing..." : "Sync Store"}</span>
          </button>

          <button
            type="button"
            onClick={handleIngestClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-all"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Ingest POS CSV</span>
          </button>

          {/* Authenticated User Status & Logout / Login Control */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] border border-emerald-500/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="block font-semibold text-white truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="block text-[10px] text-emerald-400 font-medium">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out to Login Page"
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-700/50 text-slate-300 border border-slate-700 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
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

