import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Mic,
  Target,
  Trophy,
  Flame,
  Star,
  Award,
  Calendar,
  ChevronRight,
  Sparkles,
  Compass,
  X,
  Play,
  TrendingUp,
} from "lucide-react";
import { Character, CHARACTERS, SpeechBubble } from "@/components/characters";
import { chunky, ChunkyButton } from "@/components/ui-kit";
import { LEVELS } from "@/data/curriculum";
import { levelOf, nextLesson, useLearner, learner, ACHIEVEMENTS } from "@/lib/learner-store";
import { MiniPath } from "@/components/learning-path";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "My adventure — LingoSprout" },
      { name: "description", content: "Your daily English adventure: continue lessons, practise speaking and grow your streak." },
      { property: "og:title", content: "My adventure — LingoSprout" },
      { property: "og:description", content: "Continue lessons, practise speaking and grow your streak." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = useLearner();
  const next = nextLesson(s.completed);
  const level = LEVELS.find((l) => l.lessons.some((x) => x.id === next?.id));
  const pct = Math.min(100, Math.round((s.todayXp / s.dailyGoal) * 100));
  const currentLevel = levelOf(s.xp);
  const xpIntoLevel = s.xp % 100;
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => s.achievements.includes(a.id));

  // Mascot Guided Tour State
  const [showTour, setShowTour] = useState(!s.hasCompletedTour);
  const [tourStep, setTourStep] = useState(0);

  const activeMascot = s.avatarId || "milo";

  const TOUR_STOPS = [
    {
      title: `Welcome, ${s.name}! 🌱`,
      text: `Hi ${s.name}! I'm ${CHARACTERS[activeMascot].name}, your learning companion. I'll be right beside you as we explore letters, phonics, poems, and stories!`,
      highlight: "Let's take a quick look around your adventure hub.",
      character: activeMascot,
    },
    {
      title: "1. The Adventure Path",
      text: "Every round stone is a step on your English map. Complete lessons in order to light up new paths from Letter Sounds all the way to Poetry & Paragraphs!",
      highlight: "Look for the glowing green button to continue your latest lesson.",
      character: "pip",
    },
    {
      title: "2. Speaking Studio",
      text: "Practice reading out loud! Tap the microphone, speak into it, and hear your recording played back. We help you sound clear and confident without any pressure.",
      highlight: "Tara the Turtle is patient and will always cheer for you!",
      character: "tara",
    },
    {
      title: "3. Goals, Streaks & Badges",
      text: `Your daily target is ${s.dailyGoal} XP! Keep your learning streak alive by practicing every day to earn stars, trophies, and cool achievement badges.`,
      highlight: "You're all set to begin your magical English adventure!",
      character: "nova",
    },
  ];

  const handleNextTour = () => {
    if (tourStep < TOUR_STOPS.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
      learner.setTourCompleted(true);
    }
  };

  const handleSkipTour = () => {
    setShowTour(false);
    learner.setTourCompleted(true);
  };

  return (
    <div className="relative grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      {/* ── MASCOT GUIDED TOUR MODAL ───────────────────────────────── */}
      {showTour && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/60 backdrop-blur-sm animate-fade-in" onClick={handleSkipTour}>
          <div
            className="relative w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] border-2 border-primary/30 bg-card p-6 sm:p-8 shadow-2xl animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleSkipTour}
              aria-label="Close tour"
              className="absolute top-4 right-4 rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-b from-primary/20 to-sky/30 border-2 border-primary/30 grid place-items-center p-2 shrink-0">
                <Character
                  id={TOUR_STOPS[tourStep].character as any}
                  className="w-20 h-20 sm:w-24 sm:h-24 animate-bob"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-deep">
                  Stop {tourStep + 1} of {TOUR_STOPS.length}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                  {TOUR_STOPS[tourStep].title}
                </h2>
                <p className="text-sm sm:text-base font-semibold text-muted-foreground mt-3 leading-relaxed">
                  {TOUR_STOPS[tourStep].text}
                </p>
                <div className="mt-4 rounded-2xl bg-ivory p-3 border border-border">
                  <p className="text-sm font-bold text-foreground flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-sun-deep shrink-0" />
                    <span>{TOUR_STOPS[tourStep].highlight}</span>
                  </p>
                </div>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {TOUR_STOPS.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === tourStep ? "w-8 bg-primary" : "w-2 bg-muted border border-border"
                    }`}
                  />
                ))}
              </div>

              <div className="flex w-full gap-3 pt-1">
                <ChunkyButton tone="ghost" size="md" onClick={handleSkipTour} className="flex-1">
                  Skip
                </ChunkyButton>
                <ChunkyButton tone="primary" size="md" onClick={handleNextTour} className="flex-[2]">
                  {tourStep < TOUR_STOPS.length - 1 ? "Next Tip →" : "Let's Go! 🚀"}
                </ChunkyButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Continue learning card ──────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] bg-primary min-h-[180px] sm:min-h-[200px] p-6 sm:p-8 md:p-10 text-primary-foreground shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-base">
            🌱
          </span>
          <p className="font-display text-base sm:text-lg font-bold opacity-95">
            Good to see you, {s.name}!
          </p>
        </div>
        {next ? (
          <>
            <h1 className="mt-1 max-w-[65%] text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              Next up: {next.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base font-semibold opacity-90">
              {level?.name} · {next.exercises.length} activities · +{next.xp} XP
            </p>
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 relative z-10">
              <Link
                to="/app/lesson/$lessonId"
                params={{ lessonId: next.id }}
                className={`${chunky({ tone: "sun", size: "md" })} shadow-lg text-base font-extrabold px-6`}
              >
                <Play className="h-4 w-4 mr-1 fill-current" />
                Continue learning
              </Link>
              {!s.hasCompletedTour && (
                <button
                  onClick={() => {
                    setTourStep(0);
                    setShowTour(true);
                  }}
                  className="rounded-2xl bg-white/20 px-4 py-2.5 font-display text-sm font-bold backdrop-blur-xs hover:bg-white/30 transition-colors"
                >
                  <Compass className="inline h-4 w-4 mr-1" /> Tour
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold">You&apos;ve finished every lesson!</h1>
            <p className="mt-2 text-sm sm:text-base font-semibold opacity-80">
              Superstar! More advanced stories and grammar challenges are on the way.
            </p>
          </>
        )}
        <Character
          id={next?.character ?? activeMascot}
          bob
          eager
          className="absolute bottom-0 right-0 w-32 sm:w-40 md:w-52 drop-shadow-md"
        />
      </section>

      {/* ── Daily goal card ────────────────────────────────────────── */}
      <section className="rounded-[2rem] border-2 border-border bg-card p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-display text-lg sm:text-xl font-bold">
            <Target className="h-6 w-6 text-accent" /> Daily goal
          </div>
          <span className="rounded-full bg-ivory px-3 py-1.5 text-xs font-bold text-muted-foreground border border-border">
            Target: {s.dailyGoal} XP
          </span>
        </div>

        <div className="flex items-end justify-between">
          <span className="font-display text-6xl font-extrabold leading-none">
            {s.todayXp}
            <span className="text-3xl text-muted-foreground">/{s.dailyGoal}</span>
          </span>
          <span className="text-sm font-bold text-muted-foreground pb-1">XP today</span>
        </div>

        <div
          className="mt-4 h-5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-label="Daily goal progress"
        >
          <div
            className="h-full rounded-full bg-secondary transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-semibold text-muted-foreground">
          {pct >= 100
            ? "🎉 Goal reached — superstar, " + s.name + "!"
            : `${Math.max(0, s.dailyGoal - s.todayXp)} XP to reach today's goal`}
        </p>

        {/* Streak + Level row */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-ivory p-3.5 border border-border">
            <Flame className="h-8 w-8 text-accent fill-accent shrink-0" />
            <div>
              <p className="font-display text-lg font-bold leading-tight">
                {s.streak} day{s.streak !== 1 ? "s" : ""}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">active streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-ivory p-3.5 border border-border">
            <Trophy className="h-8 w-8 text-sun-deep shrink-0" />
            <div>
              <p className="font-display text-lg font-bold leading-tight">Level {currentLevel}</p>
              <p className="text-xs font-semibold text-muted-foreground">{100 - xpIntoLevel} XP to next</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Journey mini map ───────────────────────────────────────── */}
      <section className="rounded-[2rem] border-2 border-border bg-card p-6 sm:p-7 lg:col-span-2 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">Your learning journey</h2>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-0.5">
              12 levels of phonics, reading, poems, and grammar
            </p>
          </div>
          <Link
            to="/app/learn"
            className="flex items-center gap-1 font-display font-bold text-primary-deep hover:underline text-sm sm:text-base shrink-0 ml-3"
          >
            See full map <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <MiniPath />
      </section>

      {/* ── Speaking studio shortcut ───────────────────────────────── */}
      <Link
        to="/app/speak"
        className="group flex items-center gap-4 rounded-[2rem] bg-mint p-5 sm:p-6 border border-emerald-200 hover:shadow-md transition-shadow"
      >
        <Character id="tara" className="w-20 sm:w-24 shrink-0 transition-transform group-hover:-rotate-3" />
        <div className="flex-1 min-w-0">
          <p className="flex items-center gap-2 font-display text-lg sm:text-xl font-bold">
            <Mic className="h-5 w-5 text-secondary-deep shrink-0" /> Speaking studio
          </p>
          <p className="font-semibold text-muted-foreground text-sm mt-1 leading-snug">
            Read aloud with Tara and hear your voice clearly!
          </p>
          <div className="mt-3 inline-flex items-center gap-1 rounded-xl bg-secondary/15 px-3 py-1.5 text-sm font-bold text-secondary-deep">
            {s.speakingSessions} session{s.speakingSessions !== 1 ? "s" : ""} completed
          </div>
        </div>
      </Link>

      {/* ── Mascot & Achievements ─────────────────────────────────── */}
      <div className="rounded-[2rem] bg-peach p-5 sm:p-6 border border-amber-200">
        <div className="flex items-center justify-between mb-3">
          <p className="flex items-center gap-2 font-display text-lg sm:text-xl font-bold">
            <Award className="h-5 w-5 text-accent-deep" /> {s.name}&apos;s Badges
          </p>
          <Link
            to="/app/parent"
            search={{ tab: "profile" }}
            className="text-sm font-bold text-accent-deep hover:underline"
          >
            Avatar →
          </Link>
        </div>
        {unlockedAchievements.length === 0 ? (
          <div className="flex items-center gap-4">
            <Character id={activeMascot} className="w-20 sm:w-24 shrink-0" />
            <SpeechBubble className="text-sm flex-1">
              &ldquo;Complete your first lesson, {s.name}, to earn a shiny badge!&rdquo;
            </SpeechBubble>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {unlockedAchievements.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 py-2 shadow-xs"
              >
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="text-sm font-bold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Stats summary ─────────────────────────────────────────── */}
      <section className="rounded-[2rem] border-2 border-border bg-card p-6 sm:p-7 lg:col-span-2 shadow-sm">
        <div className="flex items-center gap-2 font-display text-lg sm:text-xl font-bold mb-5">
          <TrendingUp className="h-6 w-6 text-primary" /> Overall Progress Report
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total XP", value: `${s.xp}`, icon: <Star className="h-6 w-6 fill-sun text-sun-deep" />, bg: "bg-sun/10" },
            { label: "Lessons done", value: `${s.completed.length}`, icon: <BookOpen className="h-6 w-6 text-primary" />, bg: "bg-primary/10" },
            { label: "Speaking sessions", value: `${s.speakingSessions}`, icon: <Mic className="h-6 w-6 text-accent" />, bg: "bg-accent/10" },
            { label: "Badges unlocked", value: `${s.achievements.length}`, icon: <Award className="h-6 w-6 text-secondary" />, bg: "bg-secondary/10" },
          ].map(({ label, value, icon, bg }) => (
            <div key={label} className={`rounded-2xl ${bg} p-4 sm:p-5 border border-border`}>
              <div className="flex items-center gap-2 mb-3">
                {icon}
                <p className="text-xs sm:text-sm font-bold text-muted-foreground leading-tight">{label}</p>
              </div>
              <p className="font-display text-4xl sm:text-5xl font-extrabold leading-none">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
