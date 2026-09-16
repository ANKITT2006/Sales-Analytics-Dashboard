"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, UploadCloud, RefreshCw, Cpu, Activity, LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearStoredUser, getStoredUser, User } from "@/lib/auth";
import { AuthPromptModal } from "@/components/molecules/AuthPromptModal";

import Image from "next/image";

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
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-[#222E3A]/80">
        <div className="flex items-center gap-3.5">
          {/* Uploaded 3D Metallic Copper Logo */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-[#12181D] border border-[#D9A15B]/30 shadow-lg shadow-[#D9A15B]/10 p-1">
            <Image
              src="/images/app-logo-square.png"
              alt="Pan-India Sales Analytics Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#EDE6D9] font-medium">
                Sales overview
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#4E9B8F]/15 px-2.5 py-0.5 text-xs font-semibold text-[#4E9B8F] border border-[#4E9B8F]/30">
                <CheckCircle2 className="h-3.5 w-3.5" /> Multi-Gateway (INR)
              </span>
              <span className="inline-flex items-center rounded-full bg-[#161E26] px-2.5 py-0.5 text-xs font-semibold text-[#8A949E] border border-[#2A3745]">
                {regionName}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#8A949E]">
              Last 30 days · updated just now • Live verified retail transactions (Google Pay • PhonePe • Razorpay • Cashfree • PayU)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Webhook Status Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-[#12181D] border border-[#222E3A] text-[#4E9B8F]">
            <Activity className="h-3.5 w-3.5 animate-pulse text-[#4E9B8F]" />
            <span>Webhook Ingestion Active</span>
          </div>

          {/* Sync Store Button */}
          <button
            type="button"
            onClick={handleRetrainClick}
            disabled={isRetraining}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#161E26] hover:bg-[#1E2934] text-[#EDE6D9] border border-[#2A3745] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRetraining ? "animate-spin text-[#D9A15B]" : "text-[#8A949E]"}`} />
            <span>{isRetraining ? "Syncing..." : "Sync Store"}</span>
          </button>

          {/* Primary CTA: Solid Copper Button ("Ingest POS CSV" / "Export Report" style) */}
          <button
            type="button"
            onClick={handleIngestClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#D9A15B] hover:bg-[#C6904A] text-[#0A0E12] shadow-md shadow-[#D9A15B]/20 transition-all active:scale-95"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Ingest POS CSV</span>
          </button>

          {/* Authenticated User Status & Logout / Login Control */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 rounded-xl border border-[#222E3A] bg-[#12181D] px-3 py-1.5 text-xs">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9A15B]/20 text-[#D9A15B] font-bold text-[11px] border border-[#D9A15B]/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="block font-semibold text-[#EDE6D9] truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="block text-[10px] text-[#4E9B8F] font-medium">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out to Login Page"
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold bg-[#161E26] hover:bg-[#C4695A]/20 hover:text-[#C4695A] hover:border-[#C4695A]/40 text-[#8A949E] border border-[#2A3745] transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#161E26] hover:bg-[#1E2934] text-[#D9A15B] border border-[#D9A15B]/40 transition-all hover:border-[#D9A15B]"
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

