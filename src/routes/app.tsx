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
    <div className="min-h-screen pb-24 md:pb-0 md:pl-60">
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
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-border bg-background/95 px-3 sm:px-5 py-2.5 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 md:hidden min-w-0 mr-2">
          <img src={miloLogo} alt="LingoSprout" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-contain shrink-0" />
          <span className="font-display text-lg sm:text-xl font-extrabold text-primary-deep truncate">
            Lingo<span className="text-secondary-deep">Sprout</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-auto">
          <Link to="/app/parent" aria-label="Parent dashboard" className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-5 w-5" />
          </Link>
          <span className="flex items-center gap-1 font-display text-sm sm:text-base font-bold text-accent-deep bg-accent/10 px-2 py-1 rounded-full">
            <Flame className="h-4 w-4 fill-accent" />
            {s.streak}
          </span>
          <span className="flex items-center gap-1 font-display text-sm sm:text-base font-bold text-sun-deep bg-sun/15 px-2.5 py-1 rounded-full">
            <Star className="h-4 w-4 fill-sun" />
            {s.xp} <span className="hidden xs:inline">XP</span>
          </span>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-3 sm:px-5 py-5 sm:py-8">
        <Outlet />
      </main>

      {/* ── Mobile bottom nav ────────────────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t-2 border-border bg-card/95 backdrop-blur-md md:hidden safe-area-pb">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/app" }}
            className={cn("flex flex-col items-center justify-center min-h-[52px] py-2 text-[11px] font-bold text-muted-foreground transition-colors hover:text-foreground")}
            activeProps={{ className: "!text-primary-deep bg-primary/10" }}
          >
            <n.icon className="h-5 w-5 mb-0.5" />
            {n.label}
          </Link>
        ))}
        <Link
          to="/app/parent"
          className={cn("flex flex-col items-center justify-center min-h-[52px] py-2 text-[11px] font-bold text-muted-foreground transition-colors hover:text-foreground", path === "/app/parent" && "!text-primary-deep bg-primary/10")}
        >
          <BarChart3 className="h-5 w-5 mb-0.5" />
          Parent
        </Link>
      </nav>
    </div>
  );
}
