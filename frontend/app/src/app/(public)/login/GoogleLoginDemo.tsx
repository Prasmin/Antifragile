"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

type GoogleLoginDemoProps = {
  user: User | null;
};

export default function GoogleLoginDemo({ user }: GoogleLoginDemoProps) {
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setCurrentUser(null);
  }

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: "online",
          prompt: "consent",
        },
        scopes: "openid profile email",
      },
    });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#020817] via-[#0f172a] to-[#1e293b]">
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-cyan-500/5 blur-3xl delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {!currentUser ? (
          /* Login Card */
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-blue-500/20">
            {/* Decorative Elements */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 blur-3xl" />

            {/* Logo/Brand */}
            <div className="relative mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                <svg
                  className="h-8 w-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent">
                Sign in to continue to your account
              </h1>
              
            </div>

            {/* Privacy Notice */}
            <div className="relative mb-6 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-100">
                    Your Privacy Matters
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-blue-200/80">
                    We only request your{" "}
                    <span className="font-semibold text-blue-100">name</span>{" "}
                    and{" "}
                    <span className="font-semibold text-blue-100">email</span>{" "}
                    from Google. No other data will be accessed or stored.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-[2px] shadow-lg shadow-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/60"
            >
              <div className="relative flex items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-base font-semibold text-white">
                  Continue with Google
                </span>
              </div>
            </button>

            {/* Footer Text */}
            <p className="mt-6 text-center text-xs text-slate-500">
              Secured by Supabase OAuth
            </p>
          </div>
        ) : (
          /* User Profile Card */
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 shadow-2xl backdrop-blur-xl">
            {/* Decorative Elements */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 blur-3xl" />

            {/* Profile Header */}
            <div className="relative mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-3xl font-bold text-white shadow-lg shadow-emerald-500/50">
                {currentUser.email?.[0].toUpperCase()}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">
                  Active Session
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="relative space-y-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email
                </div>
                <div className="mt-1 font-medium text-white">
                  {currentUser.email}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  User ID
                </div>
                <div className="mt-1 font-mono text-xs text-slate-300">
                  {currentUser.id}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Last Sign In
                </div>
                <div className="mt-1 text-sm text-slate-300">
                  {currentUser.last_sign_in_at ? (
                    <span suppressHydrationWarning={true}>
                      {new Date(currentUser.last_sign_in_at).toLocaleString()}
                    </span>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="mt-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-white backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
