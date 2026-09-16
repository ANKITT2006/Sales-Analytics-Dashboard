"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Cpu,
  MailCheck,
  RefreshCw,
} from "lucide-react";

export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validate = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email address is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Simulate dispatching password reset link
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } catch {
      setErrorMessage("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative rounded-3xl border border-slate-700/60 bg-slate-900/85 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
      {/* Top ambient highlight */}
      <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

      {/* Header section with brand logo & titles */}
      <div className="text-center">
        <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/25">
          <Cpu className="h-6 w-6" />
        </div>
        <p className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
          Sales Analytics Dashboard
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
          Forgot Password?
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Enter your registered email and we&apos;ll send you a secure password reset link.
        </p>
      </div>

      {isSubmitted ? (
        /* Interactive Success State */
        <div className="mt-6 space-y-5 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <MailCheck className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Check Your Inbox</h2>
            <p className="text-xs text-slate-300">
              We&apos;ve sent instructions to reset your password to:
            </p>
            <p className="text-xs font-semibold text-emerald-400 break-all">{email}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-400">
            Did not receive the email? Check your spam folder or try resending.
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
              }}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Resend to Different Email</span>
            </button>

            <Link
              href="/login"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-900/30"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Form State */
        <>
          {errorMessage && (
            <div
              role="alert"
              className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/50 p-3 text-xs text-rose-200 animate-in fade-in duration-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label
                htmlFor="reset-email"
                className="block text-xs font-semibold text-slate-300"
              >
                Registered Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="name@company.in"
                  autoComplete="email"
                  disabled={isLoading}
                  className={`h-11 w-full rounded-xl border bg-slate-950/70 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                    emailError
                      ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-700/80 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-[11px] font-medium text-rose-400">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Back to Sign In Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
