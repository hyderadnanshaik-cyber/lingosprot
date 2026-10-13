import { Link } from "@tanstack/react-router";
import { Check, Lock, Star, BookOpen } from "lucide-react";
import { ALL_LESSONS, LEVELS, type Lesson } from "@/data/curriculum";
import { lessonStatus, useLearner, type NodeStatus } from "@/lib/learner-store";
import { Character, CHARACTER_COLORS } from "@/components/characters";
import { cn } from "@/lib/utils";

const nodeStyle: Record<NodeStatus, string> = {
  done: "bg-secondary border-secondary-deep text-secondary-foreground",
  current: "bg-primary border-primary-deep text-primary-foreground animate-pulse-ring",
  open: "bg-sun border-sun-deep text-foreground",
  locked: "bg-muted border-border text-muted-foreground",
};

function Node({ lesson, status, size = "lg" }: { lesson: Lesson; status: NodeStatus; size?: "sm" | "lg" }) {
  const Icon = status === "done" ? Check : status === "locked" ? Lock : Star;
  const isLocked = status === "locked";

  const inner = (
    <span
      aria-label={`${lesson.title} — ${status}`}
      className={cn(
        "btn-press grid place-items-center rounded-full border-b-[6px]",
        nodeStyle[status],
        size === "lg" ? "h-20 w-20" : "h-14 w-14",
        isLocked && "cursor-not-allowed opacity-60",
      )}
    >
      <Icon className={size === "lg" ? "h-8 w-8" : "h-6 w-6"} strokeWidth={3} />
    </span>
  );

  if (isLocked) {
    // Render as non-navigable element for locked lessons
    return inner;
  }

  return (
    <Link
      to="/app/lesson/$lessonId"
      params={{ lessonId: lesson.id }}
      aria-label={`${lesson.title} — ${status}`}
      className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 rounded-full"
    >
      {inner}
    </Link>
  );
}

export function MiniPath() {
  const s = useLearner();
  return (
    <div className="mt-6 flex items-start gap-2 overflow-x-auto pb-2">
      {ALL_LESSONS.slice(0, 12).map((l, i) => (
        <div key={l.id} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1 w-[60px]">
            <Node lesson={l} status={lessonStatus(l.id, s.completed)} size="sm" />
            <span className="w-full text-center text-[10px] font-bold text-muted-foreground leading-tight line-clamp-2">
              {l.title}
            </span>
          </div>
          {i < Math.min(ALL_LESSONS.length, 12) - 1 && (
            <span className="mb-4 h-1.5 w-6 shrink-0 rounded-full bg-border" />
          )}
        </div>
      ))}
      {ALL_LESSONS.length > 12 && (
        <div className="flex items-center gap-2 text-muted-foreground shrink-0 mb-4">
          <span className="h-1.5 w-6 rounded-full bg-border" />
          <span className="text-sm font-bold">+{ALL_LESSONS.length - 12} more</span>
        </div>
      )}
    </div>
  );
}

const bandBg = {
  primary: "bg-primary/10",
  secondary: "bg-secondary/15",
  accent: "bg-accent/10",
  sun: "bg-sun/25",
} as const;

// Sinusoidal offsets to create a winding path feel
const offsets = [0, 80, 130, 80, 0, -80, -130, -80];

export function FullPath() {
  const s = useLearner();
  return (
    <div className="grid gap-8">
      {LEVELS.map((lvl) => {
        const doneCount = lvl.lessons.filter((l) => s.completed.includes(l.id)).length;
        return (
          <section key={lvl.id} className={cn("rounded-[2rem] p-6 md:p-8", bandBg[lvl.tone])}>
            {/* Level header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Level {lvl.id}
                </p>
                <h2 className="text-3xl font-extrabold">{lvl.name}</h2>
                <p className="font-semibold text-muted-foreground">{lvl.blurb}</p>
              </div>
              {lvl.lessons.length > 0 && (
                <div className="shrink-0 rounded-2xl border-2 border-border bg-card px-4 py-2 text-center">
                  <p className="font-display text-2xl font-extrabold">{doneCount}/{lvl.lessons.length}</p>
                  <p className="text-xs font-bold text-muted-foreground">lessons</p>
                </div>
              )}
            </div>

            {/* Progress bar for this level */}
            {lvl.lessons.length > 0 && (
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-background/50">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-700"
                  style={{ width: `${Math.round((doneCount / lvl.lessons.length) * 100)}%` }}
                />
              </div>
            )}

            {/* Lessons or coming soon */}
            {lvl.lessons.length === 0 ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background/50 p-5 font-semibold text-muted-foreground">
                <Lock className="h-5 w-5 shrink-0" />
                Opens after Level {lvl.id - 1}. New lessons are on the way!
              </div>
            ) : (
              <div className="relative mt-6 flex flex-col items-center gap-6">
                {lvl.lessons.map((l, i) => {
                  const st = lessonStatus(l.id, s.completed);
                  const colors = CHARACTER_COLORS[l.character];
                  return (
                    <div
                      key={l.id}
                      className="relative flex items-center gap-4"
                      style={{ transform: `translateX(${offsets[i % offsets.length]}px)` }}
                    >
                      {/* Character appears next to the current lesson */}
                      {st === "current" && (
                        <Character
                          id={l.character}
                          className="absolute -left-32 w-24 animate-bob hidden md:block"
                        />
                      )}
                      <Node lesson={l} status={st} />
                      <div className="w-40">
                        <p className="font-display font-bold leading-tight">{l.title}</p>
                        <p className="text-xs font-bold text-muted-foreground">
                          {l.skill} · +{l.xp} XP
                        </p>
                        {st === "done" && (
                          <p className="text-xs font-bold text-secondary-deep mt-0.5">✓ Completed</p>
                        )}
                        {st === "current" && (
                          <p className="text-xs font-bold text-primary-deep mt-0.5">▶ Start now</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {/* Completion teaser */}
      <section className="rounded-[2rem] border-2 border-dashed border-border bg-background p-8 text-center">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
        <h2 className="mt-3 text-2xl font-extrabold">More adventures coming soon!</h2>
        <p className="mt-2 font-semibold text-muted-foreground">
          We&apos;re building new stories, grammar lessons, and speaking challenges for you.
        </p>
      </section>
    </div>
  );
}
