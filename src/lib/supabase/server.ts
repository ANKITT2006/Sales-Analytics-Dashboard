import { NextRequest } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, DEMO_USER } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Creates a server-side Supabase client for Route Handlers.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Returns the privileged Supabase Admin client with Service Role.
 * CRITICAL: NEVER CALL THIS FROM CLIENT COMPONENTS OR EXPOSE TO THE BROWSER.
 * Used exclusively for server-side verified payment gateway webhooks.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export interface AuthVerificationResult {
  authenticated: boolean;
  user: User | null;
  error?: string;
}

/**
 * Robust server-side authentication verification for API routes.
 * Inspects:
 *  1. Authorization: Bearer <token>
 *  2. Cookie sessions (Supabase access tokens or local auth session tokens)
 *  3. Fallback header for demo prototype verification
 */
export async function verifyAuth(request: NextRequest): Promise<AuthVerificationResult> {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  // 1. Check Supabase Auth if Supabase is configured
  if (token && supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        return {
          authenticated: true,
          user: {
            id: data.user.id,
            name: (data.user.user_metadata?.name as string) || (data.user.email?.split('@')[0] as string) || 'Authorized User',
            email: data.user.email || '',
            role: (data.user.user_metadata?.role as string) || 'Retail Operations Manager',
            companyName: (data.user.user_metadata?.company_name as string) || 'Bharat Retail Enterprise Ltd.',
          },
        };
      }
    } catch {
      // Continue to fallback check
    }
  }

  // 2. Cookie session check
  const cookieHeader = request.cookies.get('sa_auth_token')?.value || request.cookies.get('sb-access-token')?.value;
  if (cookieHeader) {
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.getUser(cookieHeader);
        if (!error && data?.user) {
          return {
            authenticated: true,
            user: {
              id: data.user.id,
              name: (data.user.user_metadata?.name as string) || (data.user.email?.split('@')[0] as string) || 'Authorized User',
              email: data.user.email || '',
              role: (data.user.user_metadata?.role as string) || 'Retail Operations Manager',
            },
          };
        }
      } catch {
        // Continue
      }
    }
  }

  // 3. Demo / Local Prototype Token Verification (for seamless offline and prototype verification)
  // When users log in on the client, a session token / header is set
  const clientUserHeader = request.headers.get('x-auth-user');
  if (clientUserHeader) {
    try {
      const parsed = JSON.parse(clientUserHeader) as User;
      if (parsed && parsed.email) {
        return {
          authenticated: true,
          user: parsed,
        };
      }
    } catch {
      // Invalid header format
    }
  }

  // Demo user token check
  if (token === 'demo_token_authenticated' || token === DEMO_USER.id) {
    return {
      authenticated: true,
      user: DEMO_USER,
    };
  }

  return {
    authenticated: false,
    user: null,
    error: 'Authentication required. Please sign in.',
  };
}
