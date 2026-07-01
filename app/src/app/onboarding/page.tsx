import Link from "next/link";
import { Shell } from "@/components/Shell";
import { activities, languages } from "@/lib/data";

export default function OnboardingPage() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10 inline-flex">
          Sprint 5
        </p>
        <h1 className="mt-5 text-5xl font-black tracking-tight">Create your travel profile</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          This is the first usable profile flow. Data model is prepared for Supabase persistence.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-200 to-blue-500 text-4xl font-black text-slate-950">
              NA
            </div>
            <div className="mt-6 rounded-3xl bg-slate-950/50 p-5">
              <h2 className="text-xl font-bold">Preview profile</h2>
              <p className="mt-2 text-white/55">Standa · 34 · Czech Republic</p>
              <p className="mt-4 text-sm text-white/65">
                Looking for coffee, dinner, and safe travel buddies while exploring new cities.
              </p>
              <div className="mt-4 text-sm text-yellow-200">★ New profile</div>
            </div>
          </div>

          <form className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-white/70">
                Name
                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none" defaultValue="Standa" />
              </label>
              <label className="text-sm text-white/70">
                Age
                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none" defaultValue="34" />
              </label>
              <label className="text-sm text-white/70 md:col-span-2">
                Bio
                <textarea className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none" defaultValue="I want to meet friendly people while traveling." />
              </label>
              <label className="text-sm text-white/70">
                Country
                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none" defaultValue="Czech Republic" />
              </label>
              <label className="text-sm text-white/70">
                City now
                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none" defaultValue="Barcelona" />
              </label>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Languages</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {languages.map((language) => (
                  <span key={language} className="rounded-full bg-white/10 px-4 py-2 text-sm">{language}</span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Activities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <span key={activity} className="rounded-full bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-cyan-200/15">{activity}</span>
                ))}
              </div>
            </div>

            <Link href="/nearby" className="mt-8 block rounded-full bg-white px-6 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-100">
              Save preview profile
            </Link>
          </form>
        </div>
      </section>
    </Shell>
  );
}
