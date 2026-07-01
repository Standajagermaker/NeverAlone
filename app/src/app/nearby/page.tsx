"use client";

import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { activities, mockPeople } from "@/lib/data";

const radiusOptions = [
  { label: "500m", meters: 500 },
  { label: "2km", meters: 2000 },
  { label: "5km", meters: 5000 },
  { label: "10km", meters: 10000 },
];

function distanceToMeters(distance: string) {
  const normalized = distance.trim().toLowerCase().replace(",", ".");
  const value = Number.parseFloat(normalized);

  if (Number.isNaN(value)) {
    return Number.POSITIVE_INFINITY;
  }

  return normalized.includes("km") ? value * 1000 : value;
}

export default function NearbyPage() {
  const [selectedRadius, setSelectedRadius] = useState(2000);
  const [selectedActivity, setSelectedActivity] = useState("All");

  const filteredPeople = useMemo(() => {
    return mockPeople.filter((person) => {
      const matchesRadius = distanceToMeters(person.distance) <= selectedRadius;
      const matchesActivity = selectedActivity === "All" || person.activity === selectedActivity;

      return matchesRadius && matchesActivity;
    });
  }, [selectedActivity, selectedRadius]);

  function resetFilters() {
    setSelectedRadius(2000);
    setSelectedActivity("All");
  }

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10">
          Nearby MVP
        </p>
        <h1 className="mt-5 text-5xl font-black tracking-tight">People nearby</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Radius, activity intent, trust indicators, and safety actions are now live in the web preview.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={resetFilters} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                Reset
              </button>
            </div>

            <div className="mt-5">
              <h3 className="text-sm text-white/60">Radius</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {radiusOptions.map((radius) => {
                  const selected = selectedRadius === radius.meters;

                  return (
                    <button
                      key={radius.label}
                      type="button"
                      onClick={() => setSelectedRadius(radius.meters)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        selected
                          ? "bg-cyan-100 text-slate-950"
                          : "bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      {radius.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-white/60">Activity</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["All", ...activities].map((activity) => {
                  const selected = selectedActivity === activity;

                  return (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => setSelectedActivity(activity)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        selected
                          ? "bg-cyan-100 text-slate-950"
                          : "bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      {activity}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-6 rounded-2xl bg-slate-950/50 p-4 text-sm text-cyan-100">
              Showing {filteredPeople.length} of {mockPeople.length} people.
            </p>
          </aside>

          <div className="space-y-4">
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person) => (
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
              ))
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
                <h2 className="text-2xl font-bold">No people match these filters</h2>
                <p className="mt-3 text-white/65">Try a bigger radius or choose another activity.</p>
                <button onClick={resetFilters} className="mt-5 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-100">
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
