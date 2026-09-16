"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, X, ShieldAlert } from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function AuthPromptModal({
  isOpen,
  onClose,
  title = "Authentication Required",
  message = "Please sign in to access data ingestion and store synchronization.",
}: AuthPromptModalProps) {
  const router = useRouter();

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignIn = () => {
    onClose();
    router.push("/login");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Subtle top ambient glow */}
        <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon & Heading */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3
              id="auth-prompt-title"
              className="text-lg font-bold text-white tracking-tight"
            >
              {title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Security badge notice */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
          <ShieldAlert className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Public access is view-only. Modifications require verified role credentials.</span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSignIn}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99]"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
