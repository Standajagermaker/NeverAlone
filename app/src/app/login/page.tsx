import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Shell } from "@/components/Shell";

export default function LoginPage() {
  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10">
            Sprint 6
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight">Log on</h1>
          <p className="mt-5 leading-7 text-white/65">
            Email authentication is wired to Supabase when Vercel environment variables are configured.
          </p>
          <p className="mt-5 text-sm text-white/50">
            New here? <Link href="/signup" className="text-cyan-100 underline">New</Link>
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <AuthForm mode="login" />
        </div>
      </section>
    </Shell>
  );
}
