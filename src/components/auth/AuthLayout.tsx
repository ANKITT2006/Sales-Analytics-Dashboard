"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Cpu, CheckCircle2, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* 
        Full-screen centerpiece background using the uploaded artwork:
        Indian retail marketplace, UPI digital commerce, India map analytics arrows, and iconic skyline.
      */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: "url('/images/auth-bg.jpg')",
          backgroundPosition: "center 30%",
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />

      {/* 
        Subtle dark gradient overlay:
        Carefully tuned to preserve the vibrant festive marketplace and analytics visuals
        while guaranteeing WCAG AAA text contrast and readability for the glassmorphic card.
      */}
      <div
        className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950/85 backdrop-blur-[1.5px]"
        aria-hidden="true"
      />

      {/* Ambient glowing highlights */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      {/* Top Header Navigation Bar */}
      <header className="relative z-10 w-full px-4 py-4 sm:px-8 lg:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform duration-200 active:scale-95"
        >
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
            <Cpu className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Sales Analytics Dashboard
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" /> Retail BI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              Turn your sales data into actionable insights
            </p>
          </div>
        </Link>

        {/* Live System Indicator Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-medium text-slate-300">Live UPI Ingestion</span>
        </div>
      </header>

      {/* Main Content Area: Centered Glassmorphic Authentication Card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px] animate-in fade-in zoom-in-95 duration-300">
          {children}
        </div>
      </main>

      {/* Footer with Business Intelligence Credentials */}
      <footer className="relative z-10 w-full px-4 py-4 text-center text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
          <p className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] sm:text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Pan-India GSTIN-Verified Retail Intelligence • 28 States & 8 UTs</span>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Track performance. Discover trends. Make better decisions.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
