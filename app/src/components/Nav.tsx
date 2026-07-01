import Link from "next/link";

export function Nav() {
  return (
    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-xl font-black tracking-tight">
        NeverAlone
      </Link>
      <div className="flex items-center gap-3 text-sm">
        <Link href="/nearby" className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:bg-white/10">
          Nearby
        </Link>
        <Link href="/login" className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-100">
          Sign in
        </Link>
      </div>
    </nav>
  );
}
