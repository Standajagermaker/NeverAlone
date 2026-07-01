import { ProfileForm } from "@/components/ProfileForm";
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
          Edit your public NeverAlone profile for travelers, digital nomads and local people nearby.
        </p>

        <ProfileForm />
      </section>
    </Shell>
  );
}
