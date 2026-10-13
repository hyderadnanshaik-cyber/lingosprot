import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Flame, Home, Map, Mic, Star, BarChart3, Settings } from "lucide-react";
import { useLearner } from "@/lib/learner-store";
import { DemoBadge } from "@/components/ui-kit";
import { miloLogo, Character } from "@/components/characters";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({ component: AppShell });

const NAV = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/app/learn", label: "Learn", icon: Map },
  { to: "/app/speak", label: "Speak", icon: Mic },
] as const;

function AppShell() {
  const s = useLearner();
  const path = useRouterState({ select: (r) => r.location.pathname });
  if (path.startsWith("/app/lesson/")) return <Outlet />;

  return (
    <div className="flex min-h-screen flex-col md:pl-60">
      {/* ── Desktop sidebar ───────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r-2 border-border bg-card p-5 md:flex">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={miloLogo}
            alt="LingoSprout Logo"
            className="h-10 w-10 rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="font-display text-2xl font-extrabold text-primary-deep">
            Lingo<span className="text-secondary-deep">Sprout</span>
          </span>
        </Link>

        {/* Current Child Avatar Profile Pill */}
        <Link
          to="/app/parent"
          className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-border bg-ivory p-3 hover:border-primary transition-colors"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-card border border-border shadow-xs overflow-hidden">
            <Character id={s.avatarId || "milo"} className="w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold leading-tight">{s.name}</p>
            <p className="text-[11px] font-semibold text-muted-foreground">{s.grade || "Learner"}</p>
          </div>
        </Link>

        <nav className="mt-6 grid gap-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/app" }}
              className="flex items-center gap-3 rounded-2xl border-2 border-transparent px-4 py-3 font-display text-lg font-bold text-muted-foreground hover:bg-muted"
              activeProps={{ className: "!border-primary/40 bg-primary/10 !text-primary-deep" }}
            >
              <n.icon className="h-6 w-6" /> {n.label}
            </Link>
          ))}
        </nav>

        {/* Parent dashboard link */}
        <div className="mt-4 border-t-2 border-border pt-4">
          <Link
            to="/app/parent"
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 border-transparent px-4 py-3 font-display text-base font-bold text-muted-foreground hover:bg-muted",
              path === "/app/parent" && "!border-primary/40 bg-primary/10 !text-primary-deep",
            )}
          >
            <BarChart3 className="h-5 w-5" /> Parent view
          </Link>
        </div>

        <div className="mt-auto space-y-2">
          <DemoBadge />
          <p className="text-xs font-semibold text-muted-foreground">Signed in as {s.name}</p>
        </div>
      </aside>

      {/* ── Top header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-border bg-background/95 px-4 sm:px-6 py-3 backdrop-blur-md md:hidden">
        <Link to="/" className="flex items-center gap-2.5 min-w-0 mr-3">
          <img src={miloLogo} alt="LingoSprout" className="h-9 w-9 rounded-xl object-contain shrink-0 shadow-sm" />
          <span className="font-display text-xl font-extrabold text-primary-deep truncate">
            Lingo<span className="text-secondary-deep">Sprout</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/app/parent"
            hash="settings"
            aria-label="Parent settings"
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <span className="flex items-center gap-1.5 font-display text-sm font-bold text-accent-deep bg-accent/15 px-3 py-1.5 rounded-full">
            <Flame className="h-4 w-4 fill-accent" />
            {s.streak}
          </span>
          <span className="flex items-center gap-1.5 font-display text-sm font-bold text-sun-deep bg-sun/20 px-3 py-1.5 rounded-full">
            <Star className="h-4 w-4 fill-sun" />
            {s.xp}
          </span>
        </div>
      </header>

      {/* Desktop top bar (replaces mobile header on md+) */}
      <header className="sticky top-0 z-20 hidden md:flex items-center justify-between border-b-2 border-border bg-background/95 px-6 py-3 backdrop-blur-md">
        <div />
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/app/parent"
            hash="settings"
            aria-label="Parent settings"
            className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-display text-sm font-bold"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <span className="flex items-center gap-1.5 font-display text-sm font-bold text-accent-deep bg-accent/15 px-3 py-1.5 rounded-full">
            <Flame className="h-4 w-4 fill-accent" />
            {s.streak} day streak
          </span>
          <span className="flex items-center gap-1.5 font-display text-sm font-bold text-sun-deep bg-sun/20 px-3 py-1.5 rounded-full">
            <Star className="h-4 w-4 fill-sun" />
            {s.xp} XP
          </span>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8 pb-28 md:pb-8">
        <Outlet />
      </main>

      {/* ── Mobile bottom nav ────────────────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t-2 border-border bg-card/98 backdrop-blur-md md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/app" }}
            className={cn("flex flex-col items-center justify-center min-h-[60px] py-2 gap-0.5 text-xs font-bold text-muted-foreground transition-colors")}
            activeProps={{ className: "!text-primary-deep bg-primary/10" }}
          >
            <n.icon className="h-6 w-6" />
            <span className="text-[11px]">{n.label}</span>
          </Link>
        ))}
        <Link
          to="/app/parent"
          className={cn("flex flex-col items-center justify-center min-h-[60px] py-2 gap-0.5 text-xs font-bold text-muted-foreground transition-colors", path === "/app/parent" && "!text-primary-deep bg-primary/10")}
        >
          <BarChart3 className="h-6 w-6" />
          <span className="text-[11px]">Parent</span>
        </Link>
      </nav>
    </div>
  );
}
