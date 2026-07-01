import { Shell } from "@/components/Shell";
import { activities, mockPeople } from "@/lib/data";

export default function NearbyPage() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10 inline-flex">
          Nearby MVP
        </p>
        <h1 className="mt-5 text-5xl font-black tracking-tight">People nearby</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Radius, activity intent, trust indicators, and safety actions are now visible in the web preview.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <div className="mt-5">
              <h3 className="text-sm text-white/60">Radius</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["500m", "2km", "5km", "10km"].map((radius) => (
                  <span key={radius} className="rounded-full bg-white/10 px-4 py-2 text-sm">{radius}</span>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm text-white/60">Activity</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <span key={activity} className="rounded-full bg-white/10 px-4 py-2 text-sm">{activity}</span>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {mockPeople.map((person) => (
              <article key={person.name} className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{person.name}, {person.age}</h2>
                    <p className="mt-1 text-white/55">{person.city} · {person.distance}</p>
                    <p className="mt-3 text-white/70">{person.activity} · {person.languages}</p>
                  </div>
                  <div className="rounded-full bg-yellow-300/10 px-4 py-2 text-sm text-yellow-100">★ {person.rating}</div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-emerald-100">
                    {person.verified ? "Verified" : "Verification pending"}
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-2">Report</span>
                  <span className="rounded-full bg-white/10 px-4 py-2">Block</span>
                  <span className="rounded-full bg-white/10 px-4 py-2">Would meet again</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
