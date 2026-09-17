import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-fintech-canvas text-[#EDE6D9] selection:bg-[#D9A15B] selection:text-[#0A0E12] relative overflow-x-clip">
      {/* Background ambient lighting accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#D9A15B]/[0.12] blur-[120px] animate-ambient-glow" />
        <div className="absolute top-1/3 -left-40 h-[540px] w-[540px] rounded-full bg-[#4E9B8F]/[0.12] blur-[130px] animate-ambient-glow-reverse" />
        <div className="absolute -bottom-40 right-1/4 h-[520px] w-[520px] rounded-full bg-[#D9A15B]/[0.08] blur-[140px] animate-ambient-glow" />
        <div className="absolute bottom-1/3 left-1/3 h-[480px] w-[480px] rounded-full bg-[#4E9B8F]/[0.07] blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </div>
  );
}
