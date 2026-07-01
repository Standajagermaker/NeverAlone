const activities = [
  "Coffee",
  "Beer",
  "Wine",
  "Dinner",
  "Museum",
  "Beach",
  "Hiking",
  "Travel Partner",
  "Nightlife"
];

const safety = ["Verified profiles", "Report", "Block", "Meet again rating"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1D4ED8_0,#08111F_34%,#050814_100%)]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">NeverAlone</div>
          <div className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
            Sprint 1–3 Preview
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10">
              Never travel alone.
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Meet nearby people when you do not want to be alone tonight.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              NeverAlone is not a dating app. It helps travelers, digital nomads,
              and locals find safe company for coffee, dinner, museums, hikes,
              nightlife, or a travel partner nearby.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#profile"
                className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                Create preview profile
              </a>
              <a
                href="#nearby"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                See nearby
              </a>
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
                {[
                  ["Anna", "Coffee", "CZ · EN · ES", "4.9"],
                  ["Marco", "Dinner", "IT · EN", "4.8"],
                  ["Lea", "Museum", "DE · EN", "5.0"]
                ].map(([name, activity, lang, rating]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl bg-white/8 p-4 ring-1 ring-white/10"
                  >
                    <div>
                      <div className="font-semibold">{name}</div>
                      <div className="text-sm text-white/55">{activity} · {lang}</div>
                    </div>
                    <div className="text-sm text-yellow-200">★ {rating}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-cyan-300/10 p-4 text-sm text-cyan-100 ring-1 ring-cyan-200/20">
                AI Companion ready when nobody is nearby.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="profile" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Sprint 2: Profile MVP</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Photo", "Name & age", "Bio", "Languages", "Country", "Activities"].map((item) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/7 p-5">
              <div className="text-lg font-semibold">{item}</div>
              <p className="mt-2 text-sm text-white/55">Prepared for Supabase profile storage.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="nearby" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Sprint 3: Nearby Preview</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/7 p-6">
            <h3 className="text-xl font-semibold">Radius</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["500m", "2km", "5km", "10km"].map((radius) => (
                <span key={radius} className="rounded-full bg-white/10 px-4 py-2 text-sm">
                  {radius}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/7 p-6">
            <h3 className="text-xl font-semibold">Activities</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {activities.map((activity) => (
                <span key={activity} className="rounded-full bg-white/10 px-4 py-2 text-sm">
                  {activity}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Safety baseline</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {safety.map((item) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/7 p-5">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
