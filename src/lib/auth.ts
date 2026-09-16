import { getSupabaseBrowserClient } from './supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  companyName?: string;
  gstin?: string;
}

export const DEMO_USER: User = {
  id: "usr_demo_01",
  name: "Rajesh Sharma",
  email: "demo@retailanalytics.in",
  role: "National Analytics Lead",
  companyName: "Bharat Retail Enterprise Ltd.",
  gstin: "27AAACB2468R1Z1",
};

export const DEMO_PASSWORD = "Password@123";

const USER_STORAGE_KEY = "sa_auth_user";
const TOKEN_STORAGE_KEY = "sa_auth_token";
const REMEMBER_ME_KEY = "sa_remember_me";
const SAVED_EMAIL_KEY = "sa_saved_email";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    // Also set demo token if no custom token exists
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      localStorage.setItem(TOKEN_STORAGE_KEY, `demo_token_${user.id}`);
      document.cookie = `sa_auth_token=demo_token_${user.id}; path=/; SameSite=Lax`;
    }
  } catch {
    // ignore
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    document.cookie = `sa_auth_token=${token}; path=/; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    document.cookie = "sa_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Also sign out from Supabase if connected
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  } catch {
    // ignore
  }
}

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window === "undefined") return headers;

  const user = getStoredUser();
  const token = getAuthToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (user) {
    headers["x-auth-user"] = JSON.stringify(user);
  }

  return headers;
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return getStoredUser() !== null;
}

export function getRememberMe(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(REMEMBER_ME_KEY) === "true";
  } catch {
    return false;
  }
}

export function setRememberMe(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REMEMBER_ME_KEY, value ? "true" : "false");
  } catch {
    // ignore
  }
}

export function getSavedEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(SAVED_EMAIL_KEY) || "";
  } catch {
    return "";
  }
}

export function setSavedEmail(email: string): void {
  if (typeof window === "undefined") return;
  try {
    if (email) {
      localStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }
  } catch {
    // ignore
  }
}
