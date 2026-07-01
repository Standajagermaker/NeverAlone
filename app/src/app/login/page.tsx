import Link from "next/link";
import { Shell } from "@/components/Shell";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10 inline-flex">
            Sprint 4
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight">Sign in to NeverAlone</h1>
          <p className="mt-5 text-white/65 leading-7">
            Email-first authentication flow prepared for Supabase. In preview mode, continue directly to onboarding.
          </p>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/7 p-5 text-sm text-white/70">
            Supabase status: {isSupabaseConfigured ? "configured" : "preview mode"}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <form className="space-y-5">
            <div>
              <label className="text-sm text-white/70">Email</label>
              <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm text-white/70">Password</label>
              <input type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4" placeholder="••••••••" />
            </div>
            <Link href="/onboarding" className="block rounded-full bg-white px-6 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-100">
              Continue to onboarding
            </Link>
            <p className="text-xs text-white/45">
              Production auth wiring will be enabled after Supabase project keys are added in Vercel.
            </p>
          </form>
        </div>
      </section>
    </Shell>
  );
}
