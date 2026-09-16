"use client";

import React, { useState } from "react";
import { X, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DEMO_USER, setStoredUser } from "@/lib/auth";

interface SocialButtonsProps {
  mode?: "signin" | "signup";
  onPrototypeLogin?: () => void;
}

export function SocialButtons({ mode = "signin", onPrototypeLogin }: SocialButtonsProps) {
  const router = useRouter();
  const [modalProvider, setModalProvider] = useState<string | null>(null);

  const handleProviderClick = (provider: string) => {
    setModalProvider(provider);
  };

  const handleUseDemoAccount = () => {
    setStoredUser(DEMO_USER);
    setModalProvider(null);
    if (onPrototypeLogin) {
      onPrototypeLogin();
    } else {
      router.push("/");
    }
  };

  const googleText = mode === "signin" ? "Continue with Google" : "Sign up with Google";
  const facebookText = mode === "signin" ? "Continue with Facebook" : "Sign up with Facebook";

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleProviderClick("Google")}
          className="group relative flex h-11 flex-1 items-center justify-center gap-3 rounded-xl border border-[#222E3A] bg-[#161E26] px-4 text-xs font-semibold text-[#EDE6D9] shadow-sm transition-all duration-200 hover:border-[#D9A15B]/40 hover:bg-[#1C252F] hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A15B]/50"
          aria-label={googleText}
        >
          {/* Google Official SVG */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="truncate">{googleText}</span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleProviderClick("Facebook")}
          className="group relative flex h-11 flex-1 items-center justify-center gap-3 rounded-xl border border-[#222E3A] bg-[#161E26] px-4 text-xs font-semibold text-[#EDE6D9] shadow-sm transition-all duration-200 hover:border-[#D9A15B]/40 hover:bg-[#1C252F] hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A15B]/50"
          aria-label={facebookText}
        >
          {/* Facebook Official SVG */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="truncate">{facebookText}</span>
        </button>
      </div>

      {/* OAuth Explanation Modal for Prototype Environment */}
      {modalProvider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="oauth-dialog-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[#222E3A] bg-[#12181D] p-6 shadow-2xl shadow-black">
            <button
              type="button"
              onClick={() => setModalProvider(null)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-[#8A949E] hover:bg-[#161E26] hover:text-[#EDE6D9] transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D9A15B]/15 text-[#D9A15B] border border-[#D9A15B]/30">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 id="oauth-dialog-title" className="text-base font-bold text-[#EDE6D9] font-serif">
                  {modalProvider} OAuth 2.0 Integration
                </h3>
                <p className="text-xs text-[#8A949E]">Prototype Environment Notice</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#222E3A] bg-[#0A0E12] p-3.5 text-xs text-[#EDE6D9] space-y-2">
              <p>
                In this prototype deployment, third-party authentication via{" "}
                <strong className="text-[#D9A15B] font-semibold">{modalProvider}</strong> requires production OAuth client credentials:
              </p>
              <code className="block rounded bg-[#161E26] px-2 py-1 text-[11px] font-mono text-[#4E9B8F] border border-[#222E3A]">
                {modalProvider === "Google"
                  ? "GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET"
                  : "FACEBOOK_APP_ID & FACEBOOK_APP_SECRET"}
              </code>
              <p className="text-[#8A949E]">
                To prevent simulated/fake logins without credentials, the system does not bypass OAuth protocol. You can explore the application using direct credentials or the verified prototype account.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModalProvider(null)}
                className="rounded-xl border border-[#2A3745] bg-[#161E26] px-4 py-2 text-xs font-semibold text-[#EDE6D9] hover:bg-[#1E2934] transition-colors"
              >
                Close Notice
              </button>
              <button
                type="button"
                onClick={handleUseDemoAccount}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#D9A15B] hover:bg-[#C6904A] px-4 py-2 text-xs font-bold text-[#0A0E12] transition-colors shadow-md shadow-[#D9A15B]/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Sign in with Demo Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
