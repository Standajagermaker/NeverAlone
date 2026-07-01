import { InboxClient } from "@/components/InboxClient";
import { Shell } from "@/components/Shell";

export default function InboxPage() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10">
          Messages
        </p>
        <h1 className="mt-5 text-5xl font-black tracking-tight">Inbox</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Reactions to listings and conversations with travelers nearby.
        </p>

        <InboxClient />
      </section>
    </Shell>
  );
}
