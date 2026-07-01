import { Nav } from "./Nav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1D4ED8_0,#08111F_34%,#050814_100%)] text-brand-sand">
      <Nav />
      {children}
    </main>
  );
}
