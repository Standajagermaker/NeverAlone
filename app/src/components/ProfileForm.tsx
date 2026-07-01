"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const ACTIVITY_OPTIONS = [
  "Coffee",
  "Beer",
  "Wine",
  "Dinner",
  "Museum",
  "Beach",
  "Hiking",
  "Travel Partner",
  "Nightlife",
];

type ProfileState = {
  full_name: string;
  location: string;
  bio: string;
  languages: string;
  activities: string[];
};

const emptyProfile: ProfileState = {
  full_name: "",
  location: "",
  bio: "",
  languages: "",
  activities: [],
};

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Profile action failed. Please try again.";
}

export function ProfileForm() {
  const [profile, setProfile] = useState<ProfileState>(emptyProfile);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const initials = useMemo(() => {
    const source = profile.full_name || email || "NeverAlone";
    return source
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "NA";
  }, [email, profile.full_name]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!supabase || !isSupabaseConfigured) {
        setMessage("Supabase is not configured. Profile runs in preview mode.");
        setLoading(false);
        return;
      }

      const { data: userResult, error: userError } = await supabase.auth.getUser();

      if (!active) return;

      if (userError || !userResult.user) {
        setMessage("Please log in to edit your traveler profile.");
        setLoading(false);
        return;
      }

      setUserId(userResult.user.id);
      setEmail(userResult.user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, location, bio, languages, activities")
        .eq("id", userResult.user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setProfile({
          full_name: typeof data.full_name === "string" ? data.full_name : "",
          location: typeof data.location === "string" ? data.location : "",
          bio: typeof data.bio === "string" ? data.bio : "",
          languages: Array.isArray(data.languages)
            ? data.languages.join(", ")
            : typeof data.languages === "string"
              ? data.languages
              : "",
          activities: Array.isArray(data.activities) ? data.activities : [],
        });
      }

      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  function toggleActivity(activity: string) {
    setProfile((current) => ({
      ...current,
      activities: current.activities.includes(activity)
        ? current.activities.filter((item) => item !== activity)
        : [...current.activities, activity],
    }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    if (!supabase || !isSupabaseConfigured) {
      setMessage("Supabase is not configured. Add Vercel env vars first.");
      setSaving(false);
      return;
    }

    if (!userId) {
      setMessage("Please log in again before saving your profile.");
      setSaving(false);
      return;
    }

    try {
      const languages = profile.languages
        .split(",")
        .map((language) => language.trim())
        .filter(Boolean);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name.trim(),
          location: profile.location.trim(),
          bio: profile.bio.trim(),
          languages,
          activities: profile.activities,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        setMessage(error.message);
        setSaving(false);
        return;
      }

      setMessage("Profile saved.");
      setSaving(false);
    } catch (error) {
      setMessage(errorMessage(error));
      setSaving(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-200 to-blue-500 text-4xl font-black text-slate-950">
          {initials}
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950/50 p-5">
          <h2 className="text-xl font-bold">Profile status</h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <div>Account: {email ? email : "preview"}</div>
            <div>Profile: editable</div>
            <div>Safety: report/block planned</div>
            <div>Verification: planned</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/nearby" className="rounded-full bg-white px-6 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-100">
            Open nearby
          </Link>
          {email ? (
            <button onClick={handleSignOut} className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Log out
            </button>
          ) : (
            <Link href="/login" className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white hover:bg-white/10">
              Log in
            </Link>
          )}
        </div>
      </aside>

      <form onSubmit={handleSave} className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        <h2 className="text-2xl font-bold">Edit traveler profile</h2>
        <p className="mt-3 text-sm text-white/60">
          Never travel alone. Build a useful profile for nearby travelers, nomads and locals.
        </p>

        <div className="mt-6 grid gap-5">
          <label className="block">
            <span className="text-sm text-white/70">Display name</span>
            <input
              value={profile.full_name}
              onChange={(event) => setProfile({ ...profile, full_name: event.target.value })}
              disabled={loading || saving || !userId}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4 disabled:opacity-60"
              placeholder="Standa Traveler"
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/70">Current city or area</span>
            <input
              value={profile.location}
              onChange={(event) => setProfile({ ...profile, location: event.target.value })}
              disabled={loading || saving || !userId}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4 disabled:opacity-60"
              placeholder="Prague, Lisbon, Bali..."
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/70">Bio</span>
            <textarea
              value={profile.bio}
              onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
              disabled={loading || saving || !userId}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4 disabled:opacity-60"
              placeholder="Tell people what you like to do when you travel. Not a dating profile."
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/70">Languages</span>
            <input
              value={profile.languages}
              onChange={(event) => setProfile({ ...profile, languages: event.target.value })}
              disabled={loading || saving || !userId}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4 disabled:opacity-60"
              placeholder="English, Czech, Spanish"
            />
          </label>

          <div>
            <div className="text-sm text-white/70">Activities</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ACTIVITY_OPTIONS.map((activity) => {
                const selected = profile.activities.includes(activity);

                return (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => toggleActivity(activity)}
                    disabled={loading || saving || !userId}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
                      selected
                        ? "border-cyan-200 bg-cyan-100 text-slate-950"
                        : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {activity}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            disabled={loading || saving || !userId}
            className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-100 disabled:opacity-60"
          >
            {saving ? "Saving..." : loading ? "Loading..." : "Save profile"}
          </button>
          <Link href="/" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
            Back home
          </Link>
        </div>

        {message ? (
          <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-cyan-100">
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
