"use client";

import Link from "next/link";
import { useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type AuthMode = "login" | "signup";

function authErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("failed to fetch")) {
      return "Connection to Supabase failed. Check Vercel environment variables and Supabase Auth URL settings.";
    }

    return error.message;
  }

  return "Authentication failed. Please try again.";
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const isNew = mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    if (!supabase || !isSupabaseConfigured) {
      setMessage(
        "Supabase is not configured on Vercel. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      setBusy(false);
      return;
    }

    try {
      const result = isNew
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setMessage(authErrorMessage(result.error));
        setBusy(false);
        return;
      }

      setMessage(isNew ? "New account created." : "Logged on.");

      window.location.href = "/profile";
    } catch (error) {
      setMessage(authErrorMessage(error));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm text-white/70">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="text-sm text-white/70">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          minLength={6}
          required
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4"
          placeholder="Minimum 6 characters"
        />
      </div>

      <button
        disabled={busy}
        className="w-full rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-100 disabled:opacity-60"
      >
        {busy ? "Working..." : isNew ? "New" : "Log on"}
      </button>

      <Link
        href="/profile"
        className="block rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
      >
        Continue in preview mode
      </Link>

      {message ? (
        <p className="rounded-2xl bg-white/10 p-4 text-sm text-cyan-100">
          {message}
        </p>
      ) : null}

      <p className="text-xs text-white/45">
        Supabase: {isSupabaseConfigured ? "configured" : "preview mode"}
      </p>
    </form>
  );
}
