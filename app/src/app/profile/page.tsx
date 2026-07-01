import Link from "next/link";
import { Shell } from "@/components/Shell";

export default function ProfilePage() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10">
          Sprint 7
        </p>
        <h1 className="mt-5 text-5xl font-black tracking-tight">Traveler profile</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Account created. The next step is the editable traveler profile with photo, bio, languages and activities.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-200 to-blue-500 text-4xl font-black text-slate-950">
              NA
            </div>
            <div className="mt-6 rounded-3xl bg-slate-950/50 p-5">
              <h2 className="text-xl font-bold">Profile status</h2>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div>Account: ready</div>
                <div>Profile: next sprint</div>
                <div>Safety: report/block planned</div>
                <div>Verification: planned</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <h2 className="text-2xl font-bold">Welcome to NeverAlone</h2>
            <p className="mt-4 text-white/65">
              Your login flow is now working. We will connect this page to Supabase profile editing next.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/nearby" className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-100">
                Open nearby
              </Link>
              <Link href="/" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Back home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
