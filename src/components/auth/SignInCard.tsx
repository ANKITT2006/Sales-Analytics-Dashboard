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
  Cpu,
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
} from "@/lib/auth";

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
      const userToStore =
        email.trim().toLowerCase() === DEMO_USER.email.toLowerCase()
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

      // Navigate smoothly to existing Sales Analytics Dashboard
      router.push("/");
    } catch {
      setErrorMessage("Authentication failed. Please check your connection and try again.");
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
    <div className="relative rounded-3xl border border-slate-700/60 bg-slate-900/85 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
      {/* Subtle top ambient glow inside the card */}
      <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

      {/* Header section with brand logo, application name, heading & subtitle */}
      <div className="text-center">
        <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/25">
          <Cpu className="h-6 w-6" />
        </div>
        <p className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
          Sales Analytics Dashboard
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
          Welcome Back
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Sign in to continue to your sales analytics dashboard
        </p>
      </div>

      {/* Demo Credentials Quick Fill Banner */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            Reviewing prototype? <strong className="text-emerald-300">Demo account ready</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors border border-emerald-500/40"
        >
          Auto Fill
        </button>
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/50 p-3 text-xs text-rose-200 animate-in fade-in duration-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Sign In Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        {/* Email Input */}
        <div>
          <label
            htmlFor="signin-email"
            className="block text-xs font-semibold text-slate-300"
          >
            Email Address
          </label>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
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
              className={`h-11 w-full rounded-xl border bg-slate-950/70 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                fieldErrors.email
                  ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-700/80 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-[11px] font-medium text-rose-400">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="signin-password"
              className="block text-xs font-semibold text-slate-300"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
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
              className={`h-11 w-full rounded-xl border bg-slate-950/70 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                fieldErrors.password
                  ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-700/80 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-[11px] font-medium text-rose-400">
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
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0 transition-colors"
            />
            <span className="text-xs text-slate-300 font-medium">Remember me</span>
          </label>
        </div>

        {/* Primary Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
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
          <div className="w-full border-t border-slate-700/80" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-3 text-[11px] font-bold tracking-wider text-slate-400">
            OR
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <SocialButtons mode="signin" />

      {/* Bottom Text: Don't have an account? Sign Up */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
