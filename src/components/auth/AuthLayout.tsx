"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, CheckCircle2, ShieldCheck, Star } from "lucide-react";

import Image from "next/image";

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
      className="relative min-h-screen w-full flex flex-col justify-between bg-[#0A0E12] text-[#EDE6D9] overflow-x-hidden selection:bg-[#D9A15B] selection:text-[#0A0E12]"
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
        {/* Top-left market canopy warm lantern glow in copper */}
        <div
          className="absolute top-[14%] left-[18%] h-40 w-40 rounded-full bg-[#D9A15B]/20 blur-3xl animate-lamp-soft"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)`,
          }}
        />

        {/* Top-center festive lantern illumination */}
        <div
          className="absolute top-[10%] left-[46%] h-52 w-52 rounded-full bg-[#D9A15B]/15 blur-3xl animate-lamp-gentle"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`,
          }}
        />

        {/* Right street stall warm golden light */}
        <div
          className="absolute top-[22%] right-[16%] h-44 w-44 rounded-full bg-[#C4695A]/20 blur-3xl animate-lamp-soft"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`,
          }}
        />

        {/* UPI digital commerce glowing green node in the lower quadrant */}
        <div
          className="absolute bottom-[24%] left-[26%] h-56 w-56 rounded-full bg-[#4E9B8F]/15 blur-3xl animate-lamp-gentle"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 0)`,
          }}
        />

        {/* Atmospheric night glow on upper skyline */}
        <div className="absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-[#4E9B8F]/10 blur-3xl animate-lamp-gentle" />
      </div>

      {/* Floating festive golden dust motes / light particles */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {isClient &&
          PARTICLES.map((p) => (
            <div
              key={p.id}
              className={`absolute rounded-full bg-gradient-to-tr from-[#D9A15B] to-yellow-100 shadow-[0_0_6px_rgba(217,161,91,0.8)] ${p.variant}`}
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

      {/* Subtle dark gradient overlay */}
      <div
        className={`fixed inset-0 z-0 transition-all duration-500 ease-in-out ${
          showLogin
            ? "bg-gradient-to-b from-[#0A0E12]/80 via-[#0A0E12]/65 to-[#0A0E12]/90 backdrop-blur-[1.5px]"
            : "bg-gradient-to-b from-[#0A0E12]/50 via-[#0A0E12]/30 to-[#0A0E12]/65 backdrop-blur-[0.5px]"
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
          {/* Uploaded 3D Metallic Copper Logo */}
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-[#12181D] border border-[#D9A15B]/30 shadow-lg shadow-[#D9A15B]/10 p-0.5 group-hover:border-[#D9A15B] transition-all">
            <Image
              src="/images/app-logo-square.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-serif font-semibold tracking-tight text-[#EDE6D9] group-hover:text-[#D9A15B] transition-colors">
                Sales Analytics Dashboard
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#4E9B8F]/15 px-2 py-0.5 text-[11px] font-semibold text-[#4E9B8F] border border-[#4E9B8F]/30">
                <CheckCircle2 className="h-3 w-3" /> Retail BI
              </span>
            </div>
            <p className="text-[11px] text-[#8A949E] hidden xs:block">
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
            className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#D9A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E12] active:scale-95 cursor-pointer ${
              showLogin
                ? "border-[#222E3A] bg-[#12181D]/90 text-[#8A949E] hover:border-[#D9A15B]/60 hover:bg-[#161E26] hover:text-[#D9A15B] hover:shadow-lg hover:shadow-[#D9A15B]/20"
                : "border-[#D9A15B] bg-[#D9A15B]/20 text-[#D9A15B] shadow-lg shadow-[#D9A15B]/25 ring-1 ring-[#D9A15B]/50 hover:bg-[#D9A15B]/30"
            }`}
          >
            <Star
              className={`h-4 w-4 transition-all duration-300 ${
                showLogin
                  ? "group-hover:scale-110 group-hover:rotate-12 text-[#8A949E] group-hover:text-[#D9A15B] group-hover:fill-[#D9A15B]/30"
                  : "fill-[#D9A15B] text-[#D9A15B] scale-110 drop-shadow-[0_0_8px_rgba(217,161,91,0.6)]"
              }`}
            />

            {/* Accessible hover tooltip */}
            <span className="pointer-events-none absolute -bottom-8 right-0 whitespace-nowrap rounded-md bg-[#12181D] px-2 py-1 text-[10px] font-semibold text-[#EDE6D9] opacity-0 shadow-lg border border-[#222E3A] transition-opacity duration-200 group-hover:opacity-100 z-30">
              {showLogin ? "Hide Login" : "Show Login"}
            </span>
          </button>

          {/* Existing Live UPI Ingestion Indicator Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[#222E3A] bg-[#12181D]/90 px-2.5 sm:px-3 py-1.5 text-xs text-[#EDE6D9] backdrop-blur-md">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4E9B8F] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4E9B8F]" />
            </span>
            <span className="font-medium text-[#EDE6D9] whitespace-nowrap text-[11px] sm:text-xs">
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
      <footer className="relative z-20 w-full px-4 py-4 text-center text-xs text-[#8A949E]">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#222E3A] pt-3">
          <p className="flex items-center justify-center gap-1.5 text-[#8A949E] text-[11px] sm:text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-[#4E9B8F] shrink-0" />
            <span>Pan-India GSTIN-Verified Retail Intelligence • 28 States & 8 UTs</span>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#8A949E]/70">
            <span>Track performance. Discover trends. Make better decisions.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
