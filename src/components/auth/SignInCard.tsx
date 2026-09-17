"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { SocialButtons } from "./SocialButtons";
import {
  DEMO_USER,
  DEMO_PASSWORD,
  getRememberMe,
  getSavedEmail,
  setRememberMe,
  setSavedEmail,
  setStoredUser,
  setAuthToken,
} from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";

export function SignInCard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Initialize saved remember-me settings
  useEffect(() => {
    const isRemembered = getRememberMe();
    setRemember(isRemembered);
    if (isRemembered) {
      const saved = getSavedEmail();
      if (saved) setEmail(saved);
    }
  }, []);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@company.in)";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate realistic SaaS authentication round-trip
      await new Promise((resolve) => setTimeout(resolve, 750));

      // Handle Remember Me preference
      setRememberMe(remember);
      if (remember) {
        setSavedEmail(email.trim());
      } else {
        setSavedEmail("");
      }

      // If user logs in with demo credentials or any valid email
      const isDemo = email.trim().toLowerCase() === DEMO_USER.email.toLowerCase();
      let accessToken = isDemo ? "demo_token_authenticated" : `token_${Date.now()}`;

      // Check if Supabase Auth client is configured
      const supabase = getSupabaseBrowserClient();
      if (supabase && !isDemo) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (!error && data?.session) {
            accessToken = data.session.access_token;
          }
        } catch {
          // Gracefully continue with local session
        }
      }

      const userToStore = isDemo
        ? DEMO_USER
        : {
            id: `usr_${Date.now()}`,
            name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            email: email.trim(),
            role: "Retail Operations Manager",
            companyName: "Indian Enterprise Store",
            gstin: "27AAACB2468R1Z1",
          };

      setStoredUser(userToStore);
      setAuthToken(accessToken);

      // Navigate smoothly to existing Sales Analytics Dashboard
      router.push("/");
    } catch {
      setErrorMessage("Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_PASSWORD);
    setFieldErrors({});
    setErrorMessage(null);
  };

  return (
    <div className="relative rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl">
      {/* Subtle top ambient glow inside the card */}
      <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-[#D9A15B]/60 to-transparent" />

      {/* Header section with brand logo, application name, heading & subtitle */}
      <div className="text-center">
        {/* Uploaded 3D Metallic Copper Logo */}
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
          Sales Analytics Dashboard
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#EDE6D9]">
          Welcome Back
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#8A949E]">
          Sign in to continue to your sales analytics dashboard
        </p>
      </div>

      {/* Demo Credentials Quick Fill Banner */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-[#2A3745] bg-[#161E26] p-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D9A15B] shrink-0" />
          <span className="text-[#EDE6D9]">
            Reviewing prototype? <strong className="text-[#D9A15B]">Demo account ready</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="rounded-lg bg-[#D9A15B] px-2.5 py-1 text-[11px] font-bold text-[#0A0E12] hover:bg-[#C6904A] transition-colors shadow-sm shadow-[#D9A15B]/20"
        >
          Auto Fill
        </button>
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#C4695A]/40 bg-[#C4695A]/15 p-3 text-xs text-[#EDE6D9] animate-in fade-in duration-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-[#C4695A]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Sign In Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        {/* Email Input */}
        <div>
          <label
            htmlFor="signin-email"
            className="block text-xs font-semibold text-[#EDE6D9]/90"
          >
            Email Address
          </label>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A949E]">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              placeholder="name@company.in"
              autoComplete="email"
              disabled={isLoading}
              className={`h-11 w-full rounded-xl border bg-[#0D1217] pl-10 pr-3 text-sm text-[#EDE6D9] placeholder:text-[#8A949E]/50 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                fieldErrors.email
                  ? "border-[#C4695A] focus:border-[#C4695A] focus:ring-[#C4695A]/20"
                  : "border-[#222E3A] focus:border-[#D9A15B] focus:ring-[#D9A15B]/20"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-[11px] font-medium text-[#C4695A]">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="signin-password"
              className="block text-xs font-semibold text-[#EDE6D9]/90"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#D9A15B] hover:text-[#C6904A] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A949E]">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className={`h-11 w-full rounded-xl border bg-[#0D1217] pl-10 pr-10 text-sm text-[#EDE6D9] placeholder:text-[#8A949E]/50 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                fieldErrors.password
                  ? "border-[#C4695A] focus:border-[#C4695A] focus:ring-[#C4695A]/20"
                  : "border-[#222E3A] focus:border-[#D9A15B] focus:ring-[#D9A15B]/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8A949E] hover:text-[#EDE6D9] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-[11px] font-medium text-[#C4695A]">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-[#222E3A] bg-[#0D1217] text-[#D9A15B] focus:ring-2 focus:ring-[#D9A15B]/30 focus:ring-offset-0 transition-colors"
            />
            <span className="text-xs text-[#8A949E] font-medium">Remember me</span>
          </label>
        </div>

        {/* Primary Sign In Button: Solid Copper */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D9A15B] hover:bg-[#C6904A] px-4 text-sm font-bold text-[#0A0E12] shadow-lg shadow-[#D9A15B]/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A15B]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#0A0E12]" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider with "OR" */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#222E3A]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#12181D] px-3 text-[11px] font-bold tracking-wider text-[#8A949E]">
            OR
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <SocialButtons mode="signin" />

      {/* Bottom Text: Don't have an account? Sign Up */}
      <div className="mt-6 text-center text-xs text-[#8A949E]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#D9A15B] hover:text-[#C6904A] hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
