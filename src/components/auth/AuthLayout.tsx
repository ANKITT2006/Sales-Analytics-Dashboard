"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, CheckCircle2, ShieldCheck, Star } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

// 14 deterministic ambient golden festive dust particle positions & timings
const PARTICLES = [
  { id: 1, left: "12%", top: "65%", size: 3, delay: "0s", duration: "11s", variant: "animate-dust-1" },
  { id: 2, left: "22%", top: "78%", size: 4, delay: "2s", duration: "13s", variant: "animate-dust-2" },
  { id: 3, left: "34%", top: "52%", size: 3, delay: "4.5s", duration: "10s", variant: "animate-dust-1" },
  { id: 4, left: "45%", top: "70%", size: 5, delay: "1.2s", duration: "14s", variant: "animate-dust-2" },
  { id: 5, left: "55%", top: "60%", size: 3, delay: "3.7s", duration: "12s", variant: "animate-dust-1" },
  { id: 6, left: "68%", top: "75%", size: 4, delay: "5.1s", duration: "15s", variant: "animate-dust-2" },
  { id: 7, left: "79%", top: "58%", size: 3, delay: "2.8s", duration: "11s", variant: "animate-dust-1" },
  { id: 8, left: "88%", top: "72%", size: 4, delay: "0.5s", duration: "13s", variant: "animate-dust-2" },
  { id: 9, left: "16%", top: "40%", size: 2.5, delay: "6s", duration: "12s", variant: "animate-dust-2" },
  { id: 10, left: "28%", top: "35%", size: 3, delay: "3s", duration: "14s", variant: "animate-dust-1" },
  { id: 11, left: "62%", top: "38%", size: 3.5, delay: "1.8s", duration: "13s", variant: "animate-dust-2" },
  { id: 12, left: "74%", top: "42%", size: 2.5, delay: "4.2s", duration: "11s", variant: "animate-dust-1" },
  { id: 13, left: "40%", top: "82%", size: 4, delay: "5.5s", duration: "15s", variant: "animate-dust-1" },
  { id: 14, left: "84%", top: "48%", size: 3, delay: "2.1s", duration: "12s", variant: "animate-dust-2" },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  const [showLogin, setShowLogin] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Subtle, high-performance mouse parallax (lerped by CSS transition)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    const { innerWidth, innerHeight } = window;
    const x = ((e.clientX / innerWidth) - 0.5) * 14;
    const y = ((e.clientY / innerHeight) - 0.5) * 14;
    setMouseOffset({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950"
    >
      {/* ====================================================================
          1. LIVE ANIMATED BACKGROUND ENVIRONMENT
          Continuous, seamless, cinematic Indian marketplace background
          ==================================================================== */}

      {/* Primary living artwork layer with slow ambient camera breath & subtle parallax */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-no-repeat transition-transform duration-700 ease-out animate-scene-breath will-change-transform"
        style={{
          backgroundImage: "url('/images/auth-bg.jpg')",
          backgroundPosition: "center 32%",
          backgroundSize: "cover",
          transform: `scale(1.04) translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
        }}
        aria-hidden="true"
      />

      {/* Organic Warm Festive Lamp / Lantern Flickering Lights */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Top-left market canopy warm lantern glow */}
        <div
          className="absolute top-[14%] left-[18%] h-40 w-40 rounded-full bg-amber-500/25 blur-3xl animate-lamp-soft"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)`,
          }}
        />

        {/* Top-center festive lantern illumination */}
        <div
          className="absolute top-[10%] left-[46%] h-52 w-52 rounded-full bg-amber-400/20 blur-3xl animate-lamp-gentle"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`,
          }}
        />

        {/* Right street stall warm golden light */}
        <div
          className="absolute top-[22%] right-[16%] h-44 w-44 rounded-full bg-orange-500/25 blur-3xl animate-lamp-soft"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`,
          }}
        />

        {/* UPI digital commerce glowing green node in the lower quadrant */}
        <div
          className="absolute bottom-[24%] left-[26%] h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl animate-lamp-gentle"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 0)`,
          }}
        />

        {/* Deep blue/indigo atmospheric night glow on upper skyline */}
        <div className="absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl animate-lamp-gentle" />
      </div>

      {/* Floating festive golden dust motes / light particles */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {isClient &&
          PARTICLES.map((p) => (
            <div
              key={p.id}
              className={`absolute rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-[0_0_6px_rgba(251,191,36,0.8)] ${p.variant}`}
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
      </div>

      {/* 
        Subtle dark gradient overlay:
        Smoothly adjusts depth when login card is visible vs. full background mode.
        When full-screen (showLogin = false), lightens subtly so the Indian retail 
        marketplace, vibrant stalls, and festive lights are fully immersive.
      */}
      <div
        className={`fixed inset-0 z-0 transition-all duration-500 ease-in-out ${
          showLogin
            ? "bg-gradient-to-b from-slate-950/75 via-slate-950/60 to-slate-950/85 backdrop-blur-[1.5px]"
            : "bg-gradient-to-b from-slate-950/45 via-slate-950/30 to-slate-950/60 backdrop-blur-[0.5px]"
        }`}
        aria-hidden="true"
      />

      {/* ====================================================================
          2. TOP HEADER NAVIGATION BAR
          Branding (Left) & Live UPI + Star Toggle (Right)
          ==================================================================== */}
      <header className="relative z-20 w-full px-4 py-4 sm:px-8 lg:px-12 flex items-center justify-between">
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

        {/* Top-Right Controls: [ ★ Star Toggle ] [ 🟢 Live UPI Ingestion ] */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Interactive Star Toggle Button */}
          <button
            type="button"
            onClick={() => setShowLogin((prev) => !prev)}
            aria-label={showLogin ? "Hide login interface" : "Show login interface"}
            title={showLogin ? "Hide Login" : "Show Login"}
            className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95 cursor-pointer ${
              showLogin
                ? "border-slate-700/80 bg-slate-900/85 text-slate-300 hover:border-amber-400/60 hover:bg-slate-800/90 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/20"
                : "border-amber-400/80 bg-amber-950/60 text-amber-300 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50 hover:bg-amber-900/70"
            }`}
          >
            <Star
              className={`h-4 w-4 transition-all duration-300 ${
                showLogin
                  ? "group-hover:scale-110 group-hover:rotate-12 text-slate-300 group-hover:text-amber-300 group-hover:fill-amber-300/30"
                  : "fill-amber-400 text-amber-300 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              }`}
            />

            {/* Accessible hover tooltip */}
            <span className="pointer-events-none absolute -bottom-8 right-0 whitespace-nowrap rounded-md bg-slate-900/95 px-2 py-1 text-[10px] font-semibold text-slate-200 opacity-0 shadow-lg border border-slate-800 transition-opacity duration-200 group-hover:opacity-100 z-30">
              {showLogin ? "Hide Login" : "Show Login"}
            </span>
          </button>

          {/* Existing Live UPI Ingestion Indicator Badge */}
          <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-2.5 sm:px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium text-slate-300 whitespace-nowrap text-[11px] sm:text-xs">
              Live UPI Ingestion
            </span>
          </div>
        </div>
      </header>

      {/* ====================================================================
          3. MAIN CONTENT AREA: Glassmorphic Authentication Card
          Smooth transition: Opacity 1 -> 0 and scale 1 -> 0.98 on hide.
          ==================================================================== */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={`w-full max-w-[460px] transition-all duration-400 ease-out transform ${
            showLogin
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-2.5 scale-[0.98] pointer-events-none"
          }`}
        >
          {children}
        </div>
      </main>

      {/* ====================================================================
          4. FOOTER
          Business Intelligence credentials & GSTIN verification status
          ==================================================================== */}
      <footer className="relative z-20 w-full px-4 py-4 text-center text-xs text-slate-400">
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
