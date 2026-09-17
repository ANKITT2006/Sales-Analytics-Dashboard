"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
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
    <div className="relative rounded-3xl border border-[#222E3A] bg-[#12181D]/90 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl text-[#EDE6D9]">
      {/* Top ambient copper highlight */}
      <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-[#D9A15B]/60 to-transparent" />

      {/* Header section with brand logo & titles */}
      <div className="text-center">
        <div className="relative mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-[#13191F]/90 border border-[#D9A15B]/40 shadow-xl shadow-[#D9A15B]/15 p-2 hover:border-[#D9A15B] transition-all group">
          <Image
            src="/images/app-logo-square.png"
            alt="Logo"
            width={44}
            height={44}
            className="object-contain drop-shadow-[0_2px_10px_rgba(217,161,91,0.3)] group-hover:scale-110 transition-transform duration-300"
            priority
          />
        </div>
        <p className="text-[11px] font-bold tracking-wider uppercase text-[#D9A15B]">
          Sales Analytics Ledger
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-serif tracking-tight text-[#EDE6D9]">
          Forgot Password?
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#8A949E]">
          Enter your registered email and we&apos;ll send you a secure password reset link.
        </p>
      </div>

      {isSubmitted ? (
        /* Interactive Success State */
        <div className="mt-6 space-y-5 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4E9B8F]/15 text-[#4E9B8F] border border-[#4E9B8F]/30">
            <MailCheck className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-serif text-[#EDE6D9]">Check Your Inbox</h2>
            <p className="text-xs text-[#8A949E]">
              We&apos;ve sent instructions to reset your password to:
            </p>
            <p className="text-xs font-semibold text-[#D9A15B] break-all">{email}</p>
          </div>

          <div className="rounded-xl border border-[#222E3A] bg-[#0A0E12] p-3 text-[11px] text-[#8A949E]">
            Did not receive the email? Check your spam folder or try resending.
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
              }}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#222E3A] bg-[#141C24] px-4 text-xs font-semibold text-[#EDE6D9] hover:bg-[#1E2833] transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#D9A15B]" />
              <span>Resend to Different Email</span>
            </button>

            <Link
              href="/login"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#D9A15B] px-4 text-xs font-bold text-slate-950 hover:bg-[#E5AF6D] transition-colors shadow-md shadow-[#D9A15B]/20"
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
              className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#C4695A]/40 bg-[#C4695A]/15 p-3 text-xs text-[#E8998C] animate-in fade-in duration-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-[#C4695A]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label
                htmlFor="reset-email"
                className="block text-xs font-semibold text-[#8A949E]"
              >
                Registered Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A949E]">
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
                  className={`h-11 w-full rounded-xl border bg-[#0A0E12] pl-10 pr-3 text-sm text-[#EDE6D9] placeholder:text-[#505D6B] transition-all outline-none focus:ring-1 disabled:opacity-50 ${
                    emailError
                      ? "border-[#C4695A] focus:border-[#C4695A] focus:ring-[#C4695A]/30"
                      : "border-[#222E3A] focus:border-[#D9A15B] focus:ring-[#D9A15B]/30"
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-[11px] font-medium text-[#C4695A]">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D9A15B] px-4 text-sm font-bold text-slate-950 shadow-lg shadow-[#D9A15B]/20 transition-all duration-200 hover:bg-[#E5AF6D] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A15B]"
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
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A949E] hover:text-[#D9A15B] transition-colors"
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
