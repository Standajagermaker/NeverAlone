import Link from "next/link";
import { Shell } from "@/components/Shell";
import { activities, mockPeople } from "@/lib/data";

export default function Home() {
  return (
    <Shell>
      <section className="mx-auto grid min-h-[78vh] w-full max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10">
            Sprint 4–5 web preview
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Never travel alone.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            MVP preview now includes sign-in flow, onboarding profile, nearby filters, and safety-ready profile cards.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-100">
              Start onboarding
            </Link>
            <Link href="/nearby" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Open nearby
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
          <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Nearby now</p>
                <h2 className="text-2xl font-bold">Barcelona</h2>
              </div>
              <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-200">
                2 km
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {mockPeople.map((person) => (
                <div key={person.name} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{person.name}, {person.age}</div>
                    <div className="text-sm text-yellow-200">★ {person.rating}</div>
                  </div>
                  <div className="mt-1 text-sm text-white/55">{person.activity} · {person.languages} · {person.distance}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-cyan-300/10 p-4 text-sm text-cyan-100 ring-1 ring-cyan-200/20">
              AI Companion fallback is prepared for Sprint 6.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-3xl font-bold">Activity intent</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {activities.map((activity) => (
            <span key={activity} className="rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/10">
              {activity}
            </span>
          ))}
        </div>
      </section>
    </Shell>
  );
}
