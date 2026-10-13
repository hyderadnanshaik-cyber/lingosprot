import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Lightbulb, RotateCcw, Star, X } from "lucide-react";
import { getLesson } from "@/data/curriculum";
import { ExerciseView, expected, hint } from "@/components/lesson/exercises";
import { Character, SpeechBubble } from "@/components/characters";
import { ChunkyButton, chunky } from "@/components/ui-kit";
import { learner, useLearner } from "@/lib/learner-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/lesson/$lessonId")({
  loader: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.lesson.title} — LingoSprout lesson` : "Lesson — LingoSprout" },
      { name: "description", content: "An interactive LingoSprout English lesson." },
      { property: "og:title", content: loaderData ? `${loaderData.lesson.title} — LingoSprout` : "Lesson — LingoSprout" },
      { property: "og:description", content: "An interactive LingoSprout English lesson." },
    ],
  }),
  notFoundComponent: () => <div className="grid min-h-screen place-items-center"><Link to="/app/learn" className={chunky()}>Back to the map</Link></div>,
  component: LessonPlayer,
});

function LessonPlayer() {
  const { lesson } = Route.useLoaderData();
  const s = useLearner();
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"none" | "right" | "wrong">("none");
  const [showHint, setShowHint] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const ex = lesson.exercises[i];

  const PRAISE = [
    `Brilliant, ${s.name}!`,
    `You got it, ${s.name}! 🌟`,
    `Super work, ${s.name}!`,
    `Yes! Well done!`,
  ];

  const check = useCallback(() => {
    if (!answer || result === "right") return;
    setResult(answer === expected(ex) ? "right" : "wrong");
    if (answer !== expected(ex)) setMistakes((m) => m + 1);
  }, [answer, ex, result]);

  const next = useCallback(() => {
    if (i + 1 >= lesson.exercises.length) { learner.completeLesson(lesson.id, lesson.xp); setDone(true); return; }
    setI(i + 1); setAnswer(""); setResult("none"); setShowHint(false);
  }, [i, lesson]);

  const retry = () => { setAnswer(""); setResult("none"); };

  // Auto-check read-aloud once speech passes
  useEffect(() => { if (ex?.type === "read-aloud" && answer === "ok" && result === "none") setResult("right"); }, [answer, ex, result]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (result === "right") next(); else if (result === "wrong") retry(); else check();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [check, next, result]);

  if (done) return <Complete xp={lesson.xp} mistakes={mistakes} title={lesson.title} childName={s.name} onHome={() => nav({ to: "/app" })} />;

  const progress = (i + (result === "right" ? 1 : 0)) / lesson.exercises.length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex w-full max-w-4xl items-center gap-4 px-5 py-5">
        <Link to="/app/learn" aria-label="Exit lesson" className="text-muted-foreground hover:text-foreground"><X className="h-7 w-7" /></Link>
        <div className="h-5 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
          <div className="h-full rounded-full bg-secondary transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="font-display font-bold text-muted-foreground">{i + 1}/{lesson.exercises.length}</span>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-8 px-5 py-6">
        <div className="flex w-full items-end gap-3">
          <Character id={lesson.character} className="w-20 md:w-24" />
          <SpeechBubble className="mb-6 text-lg md:text-xl">
            {showHint ? hint(ex) : `${ex.prompt}, ${s.name}!`}
          </SpeechBubble>
        </div>
        <div key={i} className={cn("flex w-full flex-1 items-start justify-center", result === "wrong" && "animate-shake")}>
          <ExerciseView ex={ex} answer={answer} setAnswer={(a) => { if (result === "none") setAnswer(a); }} locked={result !== "none"} />
        </div>
      </main>

      <footer className={cn("border-t-2 transition-colors", result === "right" ? "border-secondary bg-secondary/20" : result === "wrong" ? "border-accent bg-accent/15" : "border-border bg-card")}>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-5">
          {result === "none" && <>
            <ChunkyButton tone="ghost" onClick={() => setShowHint(true)} disabled={showHint}><Lightbulb className="h-5 w-5" /> Hint</ChunkyButton>
            <ChunkyButton tone="secondary" size="lg" onClick={check} disabled={!answer || ex.type === "read-aloud"}>Check</ChunkyButton>
          </>}
          {result === "right" && <>
            <p className="font-display text-2xl font-extrabold text-secondary-deep">{PRAISE[i % PRAISE.length]}</p>
            <ChunkyButton tone="secondary" size="lg" onClick={next} autoFocus>Continue</ChunkyButton>
          </>}
          {result === "wrong" && <>
            <p className="font-display text-xl font-bold text-accent-deep">Not quite — the answer is “{expected(ex)}”.</p>
            <div className="flex gap-2">
              <ChunkyButton tone="ghost" onClick={retry}><RotateCcw className="h-5 w-5" /> Try again</ChunkyButton>
              <ChunkyButton tone="accent" onClick={next}>Skip</ChunkyButton>
            </div>
          </>}
        </div>
      </footer>
    </div>
  );
}

function Complete({ xp, mistakes, title, childName, onHome }: { xp: number; mistakes: number; title: string; childName: string; onHome: () => void }) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ivory px-5">
      {Array.from({ length: 28 }).map((_, k) => (
        <span key={k} className={cn("pointer-events-none absolute top-0 h-3 w-2 rounded-sm", ["bg-primary", "bg-accent", "bg-sun", "bg-secondary"][k % 4])}
          style={{ left: `${(k * 37) % 100}%`, animation: `confetti ${2.5 + (k % 5) * 0.4}s ${(k % 7) * 0.15}s ease-in forwards` }} />
      ))}
      <div className="flex flex-col items-center text-center">
        <Character id="pip" bob eager className="w-48 animate-pop" />
        <h1 className="mt-4 text-5xl font-extrabold">Awesome job, {childName}!</h1>
        <p className="mt-2 text-lg font-semibold text-muted-foreground">{title} Complete!</p>
        <div className="mt-6 flex gap-4">
          <div className="rounded-2xl border-2 border-sun-deep bg-sun px-6 py-4"><p className="text-sm font-bold">XP earned</p><p className="flex items-center gap-1 font-display text-3xl font-extrabold"><Star className="h-6 w-6 fill-current" />{xp}</p></div>
          <div className="rounded-2xl border-2 border-secondary-deep bg-secondary px-6 py-4 text-secondary-foreground"><p className="text-sm font-bold">Accuracy</p><p className="font-display text-3xl font-extrabold">{mistakes === 0 ? "Perfect" : `${mistakes} slip${mistakes > 1 ? "s" : ""}`}</p></div>
        </div>
        <ChunkyButton size="lg" className="mt-8" onClick={onHome}>Back to my adventure</ChunkyButton>
      </div>
    </div>
  );
}
