"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const PROFILE_PHOTO_BUCKET = "profile-photos";
const MAX_PHOTOS = 3;

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

const RADIUS_OPTIONS = [
  { label: "500m", value: 500 },
  { label: "2km", value: 2000 },
  { label: "5km", value: 5000 },
  { label: "10km", value: 10000 },
];

type ProfileState = {
  full_name: string;
  location: string;
  bio: string;
  languages: string;
  activities: string[];
  photo_urls: string[];
};

type ListingState = {
  title: string;
  city: string;
  activity: string;
  radius_meters: number;
  description: string;
};

const emptyProfile: ProfileState = {
  full_name: "",
  location: "",
  bio: "",
  languages: "",
  activities: [],
  photo_urls: [],
};

const emptyListing: ListingState = {
  title: "",
  city: "",
  activity: "Coffee",
  radius_meters: 2000,
  description: "",
};

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("failed to fetch")) {
      return "Connection to Supabase failed. Check Vercel env vars, redeploy, and run the Supabase SQL migration.";
    }

    return error.message;
  }

  return "Action failed. Please try again.";
}

function fileExtension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export function ProfileForm() {
  const [profile, setProfile] = useState<ProfileState>(emptyProfile);
  const [listing, setListing] = useState<ListingState>(emptyListing);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [listingSaving, setListingSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [listingMessage, setListingMessage] = useState("");

  const initials = useMemo(() => {
    const source = profile.full_name || email || "NeverAlone";
    return source
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "NA";
  }, [email, profile.full_name]);

  const primaryPhoto = profile.photo_urls[0];

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!supabase || !isSupabaseConfigured) {
        setMessage("Supabase is not configured. Profile runs in preview mode.");
        setLoading(false);
        return;
      }

      try {
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
          .select("full_name, location, bio, languages, activities, photo_urls")
          .eq("id", userResult.user.id)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage(`${error.message}. If this mentions a missing column, run the Supabase migration first.`);
          setLoading(false);
          return;
        }

        if (data) {
          const nextProfile = {
            full_name: typeof data.full_name === "string" ? data.full_name : "",
            location: typeof data.location === "string" ? data.location : "",
            bio: typeof data.bio === "string" ? data.bio : "",
            languages: Array.isArray(data.languages)
              ? data.languages.join(", ")
              : typeof data.languages === "string"
                ? data.languages
                : "",
            activities: Array.isArray(data.activities) ? data.activities : [],
            photo_urls: Array.isArray(data.photo_urls) ? data.photo_urls.slice(0, MAX_PHOTOS) : [],
          };

          setProfile(nextProfile);
          setListing((current) => ({
            ...current,
            city: nextProfile.location,
            description: nextProfile.bio,
            activity: nextProfile.activities[0] ?? "Coffee",
          }));
        }

        setLoading(false);
      } catch (error) {
        if (!active) return;
        setMessage(errorMessage(error));
        setLoading(false);
      }
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

  async function saveProfile(nextProfile: ProfileState, successMessage = "Profile saved.") {
    if (!supabase || !isSupabaseConfigured) {
      setMessage("Supabase is not configured. Add Vercel env vars first.");
      return false;
    }

    if (!userId) {
      setMessage("Please log in again before saving your profile.");
      return false;
    }

    try {
      const languages = nextProfile.languages
        .split(",")
        .map((language) => language.trim())
        .filter(Boolean);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: nextProfile.full_name.trim(),
          location: nextProfile.location.trim(),
          bio: nextProfile.bio.trim(),
          languages,
          activities: nextProfile.activities,
          photo_urls: nextProfile.photo_urls.slice(0, MAX_PHOTOS),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        setMessage(`${error.message}. If this mentions RLS or missing columns, run the Supabase migration and check profiles policies.`);
        return false;
      }

      setProfile(nextProfile);
      setMessage(successMessage);
      return true;
    } catch (error) {
      setMessage(errorMessage(error));
      return false;
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    await saveProfile(profile);
    setSaving(false);
  }

  async function handleListingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setListingSaving(true);
    setListingMessage("");

    if (!supabase || !isSupabaseConfigured) {
      setListingMessage("Supabase is not configured. Add Vercel env vars first.");
      setListingSaving(false);
      return;
    }

    if (!userId) {
      setListingMessage("Please log in again before creating a listing.");
      setListingSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("listings").insert({
        user_id: userId,
        title: listing.title.trim(),
        city: listing.city.trim(),
        activity: listing.activity,
        radius_meters: listing.radius_meters,
        description: listing.description.trim(),
        status: "active",
      });

      if (error) {
        setListingMessage(`${error.message}. Run the Supabase migration if listings table does not exist.`);
        setListingSaving(false);
        return;
      }

      setListingMessage("Listing created. Open Nearby after redeploy/data wiring to see it in feed.");
      setListing({
        ...emptyListing,
        city: profile.location,
        description: profile.bio,
        activity: profile.activities[0] ?? "Coffee",
      });
      setListingSaving(false);
    } catch (error) {
      setListingMessage(errorMessage(error));
      setListingSaving(false);
    }
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!files.length) return;

    if (!supabase || !isSupabaseConfigured) {
      setMessage("Supabase is not configured. Add Vercel env vars first.");
      return;
    }

    if (!userId) {
      setMessage("Please log in again before uploading photos.");
      return;
    }

    const remainingSlots = MAX_PHOTOS - profile.photo_urls.length;

    if (remainingSlots <= 0) {
      setMessage("Maximum 3 profile photos allowed.");
      return;
    }

    const acceptedFiles = files
      .filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type))
      .slice(0, remainingSlots);

    if (!acceptedFiles.length) {
      setMessage("Upload JPEG, PNG or WebP images only.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of acceptedFiles) {
        const path = `${userId}/${Date.now()}-${crypto.randomUUID()}.${fileExtension(file)}`;
        const { error: uploadError } = await supabase.storage
          .from(PROFILE_PHOTO_BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          setMessage(`${uploadError.message}. Check that bucket '${PROFILE_PHOTO_BUCKET}' exists and storage policies were created.`);
          setUploading(false);
          return;
        }

        const { data } = supabase.storage.from(PROFILE_PHOTO_BUCKET).getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      const nextProfile = {
        ...profile,
        photo_urls: [...profile.photo_urls, ...uploadedUrls].slice(0, MAX_PHOTOS),
      };

      await saveProfile(nextProfile, "Photo uploaded.");
      setUploading(false);
    } catch (error) {
      setMessage(errorMessage(error));
      setUploading(false);
    }
  }

  async function removePhoto(photoUrl: string) {
    setSaving(true);
    setMessage("");

    const nextProfile = {
      ...profile,
      photo_urls: profile.photo_urls.filter((url) => url !== photoUrl),
    };

    await saveProfile(nextProfile, "Photo removed.");
    setSaving(false);
  }

  async function handleSignOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
        {primaryPhoto ? (
          <img src={primaryPhoto} alt="Profile photo" className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-white/10" />
        ) : (
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-200 to-blue-500 text-4xl font-black text-slate-950">
            {initials}
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-slate-950/50 p-5">
          <h2 className="text-xl font-bold">Profile status</h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <div>Account: {email ? email : "preview"}</div>
            <div>Profile: editable</div>
            <div>Photos: {profile.photo_urls.length}/{MAX_PHOTOS}</div>
            <div>Listing: ready</div>
            <div>Messages: next commit</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a href="#listing" className="rounded-full bg-white px-6 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-100">
            Create listing
          </a>
          <Link href="/nearby" className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white hover:bg-white/10">
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

      <div className="space-y-6">
        <form onSubmit={handleSave} className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-bold">Edit traveler profile</h2>
          <p className="mt-3 text-sm text-white/60">
            Never travel alone. Build a useful profile for nearby travelers, nomads and locals.
          </p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">Profile photos</h3>
                <p className="mt-1 text-sm text-white/55">Upload up to 3 photos. First photo is your main card photo.</p>
              </div>
              <label className={`cursor-pointer rounded-full px-5 py-3 text-sm font-semibold ${
                loading || uploading || saving || !userId || profile.photo_urls.length >= MAX_PHOTOS
                  ? "bg-white/20 text-white/50"
                  : "bg-white text-slate-950 hover:bg-cyan-100"
              }`}>
                {uploading ? "Uploading..." : "Upload photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={loading || uploading || saving || !userId || profile.photo_urls.length >= MAX_PHOTOS}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((index) => {
                const photoUrl = profile.photo_urls[index];

                return (
                  <div key={index} className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                    {photoUrl ? (
                      <>
                        <img src={photoUrl} alt={`Profile photo ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(photoUrl)}
                          disabled={saving || uploading}
                          className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-white/35">Photo {index + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

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
            <button disabled={loading || saving || uploading || !userId} className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-100 disabled:opacity-60">
              {saving ? "Saving..." : loading ? "Loading..." : "Save profile"}
            </button>
            <Link href="/" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Back home
            </Link>
          </div>

          {message ? <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-cyan-100">{message}</p> : null}
        </form>

        <form id="listing" onSubmit={handleListingSubmit} className="rounded-[2rem] border border-cyan-200/20 bg-cyan-200/10 p-6">
          <p className="inline-flex rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-slate-950">Create listing</p>
          <h2 className="mt-4 text-2xl font-bold">Create your own travel advert</h2>
          <p className="mt-3 text-sm text-white/65">
            Say what you want to do nearby. Other travelers will be able to respond and start a conversation next.
          </p>

          <div className="mt-6 grid gap-5">
            <label className="block">
              <span className="text-sm text-white/70">Title</span>
              <input
                required
                value={listing.title}
                onChange={(event) => setListing({ ...listing, title: event.target.value })}
                disabled={listingSaving || !userId}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4 disabled:opacity-60"
                placeholder="Coffee in Prague this afternoon"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-white/70">City or area</span>
                <input
                  required
                  value={listing.city}
                  onChange={(event) => setListing({ ...listing, city: event.target.value })}
                  disabled={listingSaving || !userId}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4 disabled:opacity-60"
                  placeholder="Prague"
                />
              </label>

              <label className="block">
                <span className="text-sm text-white/70">Activity</span>
                <select
                  value={listing.activity}
                  onChange={(event) => setListing({ ...listing, activity: event.target.value })}
                  disabled={listingSaving || !userId}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4 disabled:opacity-60"
                >
                  {ACTIVITY_OPTIONS.map((activity) => (
                    <option key={activity}>{activity}</option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <div className="text-sm text-white/70">Visible radius</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {RADIUS_OPTIONS.map((radius) => {
                  const selected = listing.radius_meters === radius.value;
                  return (
                    <button
                      key={radius.value}
                      type="button"
                      onClick={() => setListing({ ...listing, radius_meters: radius.value })}
                      disabled={listingSaving || !userId}
                      className={`rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
                        selected ? "bg-cyan-100 text-slate-950" : "bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      {radius.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="text-sm text-white/70">Description</span>
              <textarea
                value={listing.description}
                onChange={(event) => setListing({ ...listing, description: event.target.value })}
                disabled={listingSaving || !userId}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-cyan-200/20 focus:ring-4 disabled:opacity-60"
                placeholder="Looking for a relaxed coffee, museum visit, beach walk or travel partner. Not a dating post."
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button disabled={listingSaving || !userId} className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-100 disabled:opacity-60">
              {listingSaving ? "Creating..." : "Create listing"}
            </button>
            <Link href="/nearby" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Open nearby
            </Link>
          </div>

          {listingMessage ? <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-cyan-100">{listingMessage}</p> : null}
        </form>
      </div>
    </div>
  );
}
