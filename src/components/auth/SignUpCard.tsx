"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { SocialButtons } from "./SocialButtons";
import { setStoredUser, User } from "@/lib/auth";

export function SignUpCard() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // Password strength helper
  const getPasswordStrength = (pass: string): { label: string; color: string; percent: number } => {
    if (!pass) return { label: "Empty", color: "bg-slate-700", percent: 0 };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: "Weak", color: "bg-rose-500", percent: 25 };
    if (score === 2) return { label: "Fair", color: "bg-amber-500", percent: 50 };
    if (score === 3) return { label: "Good", color: "bg-teal-400", percent: 75 };
    return { label: "Strong", color: "bg-emerald-400", percent: 100 };
  };

  const strength = getPasswordStrength(password);

  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.fullName = "Full Name is required";
    } else if (trimmedName.length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }

    if (!trimmedEmail) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      errors.terms = "You must agree to the Terms & Conditions";
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
      // Simulate realistic registration round-trip
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        role: "Retail Store Owner",
        companyName: "Verified Store Analytics",
        gstin: "27AAACB2468R1Z1",
      };

      setStoredUser(newUser);

      // Navigate to Sales Analytics Dashboard
      router.push("/");
    } catch {
      setErrorMessage("Registration failed. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative rounded-3xl border border-slate-700/60 bg-slate-900/85 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
      {/* Top glowing accent */}
      <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

      {/* Header section with brand logo, heading & subtitle */}
      <div className="text-center">
        <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/25">
          <Cpu className="h-6 w-6" />
        </div>
        <p className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
          Sales Analytics Dashboard
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
          Create Your Account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Start analyzing your sales performance today
        </p>
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

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
        {/* Full Name Input */}
        <div>
          <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-300">
            Full Name
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <UserIcon className="h-4 w-4" />
            </div>
            <input
              id="signup-name"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: undefined });
              }}
              placeholder="Rajesh Sharma"
              autoComplete="name"
              disabled={isLoading}
              className={`h-10 w-full rounded-xl border bg-slate-950/70 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                fieldErrors.fullName
                  ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-700/80 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>
          {fieldErrors.fullName && (
            <p className="mt-1 text-[11px] font-medium text-rose-400">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-300">
            Business Email
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              placeholder="rajesh@enterprise.in"
              autoComplete="email"
              disabled={isLoading}
              className={`h-10 w-full rounded-xl border bg-slate-950/70 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                fieldErrors.email
                  ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-700/80 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-[11px] font-medium text-rose-400">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            {password && (
              <span className="text-[11px] font-semibold text-slate-400">
                Strength: <span className="text-white">{strength.label}</span>
              </span>
            )}
          </div>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
              }}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              disabled={isLoading}
              className={`h-10 w-full rounded-xl border bg-slate-950/70 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
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

          {/* Password strength meter bar */}
          {password && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
          )}

          {fieldErrors.password && (
            <p className="mt-1 text-[11px] font-medium text-rose-400">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="signup-confirm-password"
            className="block text-xs font-semibold text-slate-300"
          >
            Confirm Password
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
                }
              }}
              placeholder="Re-enter password"
              autoComplete="new-password"
              disabled={isLoading}
              className={`h-10 w-full rounded-xl border bg-slate-950/70 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                fieldErrors.confirmPassword
                  ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-700/80 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-[11px] font-medium text-rose-400">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (fieldErrors.terms) setFieldErrors({ ...fieldErrors, terms: undefined });
              }}
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0 transition-colors"
            />
            <span className="text-xs text-slate-300 leading-snug">
              I agree to the{" "}
              <span className="text-emerald-400 font-medium hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-emerald-400 font-medium hover:underline">
                Privacy Policy
              </span>
            </span>
          </label>
          {fieldErrors.terms && (
            <p className="mt-1 text-[11px] font-medium text-rose-400">{fieldErrors.terms}</p>
          )}
        </div>

        {/* Primary Create Account Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider with "OR" */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/80" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-3 text-[11px] font-bold tracking-wider text-slate-400">
            OR
          </span>
        </div>
      </div>

      {/* Social Sign Up Buttons */}
      <SocialButtons mode="signup" />

      {/* Bottom Text: Already have an account? Sign In */}
      <div className="mt-5 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
