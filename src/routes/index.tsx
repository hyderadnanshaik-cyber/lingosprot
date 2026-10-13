import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Mic, Map, ShieldCheck, Volume2, Star, Flame, Zap } from "lucide-react";
import hero from "@/assets/hero-meadow.jpg";
import { Character, CHARACTERS, CHARACTER_COLORS, miloLogo } from "@/components/characters";
import { chunky } from "@/components/ui-kit";
import type { CharacterId } from "@/data/curriculum";

export const Route = createFileRoute("/")(
  {
    head: () => ({
      meta: [
        { title: "LingoSprout — Small Steps • Big English Confidence." },
        { name: "description", content: "Phonics, reading, spelling and speaking practice for children, guided by friendly characters." },
        { property: "og:title", content: "LingoSprout — English learning for kids" },
        { property: "og:description", content: "Phonics, reading, spelling and speaking practice for children, guided by friendly characters." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    }),
    component: Landing,
  }
);

const FAQ = [
  ["What age is LingoSprout for?", "It's designed for children roughly 4 to 12, with levels that start at letter sounds up to paragraph composition."],
  ["Does my child need a microphone?", "Only for speaking practice. Everything else works with taps, clicks or a keyboard."],
  ["Is voice recorded and stored?", "Recordings stay safe on the device and are discarded when you leave the page."],
  ["Who sets up the account?", "A parent creates the account with child details (name, DOB, preferred level)."],
  ["Is it free to use?", "The platform features free exploration lessons, phonics modules, and interactive stories!"],
];

const FEATURES = [
  {
    icon: <Volume2 />,
    title: "Phonics you can hear",
    text: "Every letter and word can be played aloud. Children tap what they hear, build words from tiles and fill in missing sounds.",
    char: "milo" as CharacterId,
    preview: (
      <div className="flex gap-2">
        {["c", "a", "t"].map((l) => (
          <span key={l} className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-b-[5px] border-border bg-card font-display text-3xl font-bold">
            {l}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: <Mic />,
    title: "Speaking practice with Tara",
    text: "Read a sentence aloud, hear it played back, and see which words came through clearly. Gentle, never scolding.",
    char: "tara" as CharacterId,
    preview: (
      <div className="rounded-2xl border-2 border-border bg-card px-5 py-4 font-semibold text-lg">
        &ldquo;The sun is <span className="text-secondary-deep">hot</span>.&rdquo; — great job!
      </div>
    ),
  },
  {
    icon: <Map />,
    title: "A journey, not a worksheet",
    text: "Lessons sit along an illustrated path. Finish one, and the next stone lights up. Points, streaks and a daily goal keep it fun.",
    char: "pip" as CharacterId,
    preview: (
      <div className="flex items-center gap-3">
        {[1, 1, 0, 0].map((d, i) => (
          <span
            key={i}
            className={`h-12 w-12 rounded-full border-b-[5px] ${d ? "bg-secondary border-secondary-deep" : i === 2 ? "bg-primary border-primary-deep animate-pulse-ring" : "bg-muted border-border"}`}
          />
        ))}
      </div>
    ),
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={miloLogo}
            alt="LingoSprout Logo"
            className="h-12 w-12 rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="font-display text-2xl font-extrabold text-primary-deep">
            Lingo<span className="text-secondary-deep">Sprout</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/app/parent" className="font-display text-sm font-bold text-muted-foreground hover:text-foreground">
            Parent View
          </Link>
          <Link to="/onboarding" className={chunky({ tone: "ghost", size: "sm" })}>
            Create Profile
          </Link>
          <Link to="/app" className={chunky({ tone: "primary", size: "sm" })}>
            Start Learning
          </Link>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-5">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-border">
          <img
            src={hero}
            alt="A path of alphabet stepping stones winding through a meadow to a tree-house library"
            width={1600}
            height={912}
            className="h-[560px] w-full object-cover md:h-[620px]"
          />
          <div className="absolute inset-0 flex flex-col justify-start bg-gradient-to-r from-background/80 via-background/40 to-transparent p-7 md:p-14">
            <h1 className="max-w-xl text-5xl font-extrabold leading-[0.95] md:text-7xl">
              Little Steps.<br />
              <span className="text-primary-deep">Big English</span> Confidence.
            </h1>
            <p className="mt-4 max-w-md text-lg font-semibold text-muted-foreground">
              Short, playful lessons in sounds, words, reading and speaking — with friendly characters cheering every step.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/onboarding" className={chunky({ tone: "accent", size: "lg" })}>
                Start Learning Free
              </Link>
              <Link to="/app/learn" className={chunky({ tone: "ghost", size: "lg" })}>
                Explore Programs
              </Link>
            </div>
          </div>
          <Character id="pip" eager bob className="absolute bottom-6 left-[42%] hidden w-40 md:block" />
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-center gap-8 rounded-3xl border-2 border-border bg-card py-6">
          <div className="flex items-center gap-2 text-center">
            <Star className="h-6 w-6 text-sun-deep fill-sun" />
            <div>
              <p className="font-display text-2xl font-extrabold">12 Levels</p>
              <p className="text-sm font-semibold text-muted-foreground">comprehensive curriculum</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-center">
            <Flame className="h-6 w-6 text-accent fill-accent" />
            <div>
              <p className="font-display text-2xl font-extrabold">40+ Lessons</p>
              <p className="text-sm font-semibold text-muted-foreground">sounds to poetry &amp; syntax</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-center">
            <Zap className="h-6 w-6 text-primary fill-primary" />
            <div>
              <p className="font-display text-2xl font-extrabold">11 Exercise Types</p>
              <p className="text-sm font-semibold text-muted-foreground">poems, paragraphs &amp; grammar</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-center">
            <Mic className="h-6 w-6 text-secondary fill-secondary" />
            <div>
              <p className="font-display text-2xl font-extrabold">Speaking Studio</p>
              <p className="text-sm font-semibold text-muted-foreground">real voice practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Characters ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-4xl font-extrabold">Meet your learning friends</h2>
        <p className="mt-2 font-semibold text-muted-foreground">Each character guides a different part of your learning adventure.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => {
            const colors = CHARACTER_COLORS[id];
            return (
              <div key={id} className={`flex items-center gap-4 rounded-3xl p-5 ${colors.bg}`}>
                <Character id={id} className="w-20 shrink-0" />
                <div>
                  <h3 className={`text-lg font-bold ${colors.text}`}>{CHARACTERS[id].name}</h3>
                  <p className="font-semibold text-muted-foreground">{CHARACTERS[id].role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Features zigzag ─────────────────────────────────────────────── */}
      <section className="bg-ivory py-20">
        <div className="mx-auto grid max-w-6xl gap-16 px-5">
          {FEATURES.map((f, i) => (
            <Feature key={i} icon={f.icon} title={f.title} text={f.text} char={f.char} reverse={i % 2 === 1}>
              {f.preview}
            </Feature>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-4xl font-extrabold">How LingoSprout works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Start a lesson", desc: "Your character picks the right exercise for your level — sounds, words, reading or speaking." },
            { step: "2", title: "Practice and play", desc: "Answer questions, build words from tiles, or read aloud to your friendly coach." },
            { step: "3", title: "Earn and grow", desc: "Collect XP stars, keep your streak alive, and unlock the next adventure on the learning path." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="rounded-3xl border-2 border-border bg-card p-6">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary font-display text-xl font-extrabold text-primary-foreground">
                {step}
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 font-semibold text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Safety + FAQ ─────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl bg-mint p-8">
          <ShieldCheck className="h-10 w-10 text-secondary-deep" />
          <h2 className="mt-3 text-3xl font-extrabold">Made with parents, for children</h2>
          <p className="mt-3 font-semibold text-muted-foreground">
            No ads, no chat with strangers, no child email addresses. Parents manage profiles and see progress reports.
          </p>
          <ul className="mt-4 space-y-2">
            {["No advertising or in-app purchases", "Audio stays on your device", "No child personal data required", "Parent controls all settings"].map((item) => (
              <li key={item} className="flex items-center gap-2 font-semibold">
                <span className="text-secondary-deep">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold">Questions parents ask</h2>
          <div className="mt-6 divide-y-2 divide-border">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none font-display text-lg font-bold">
                  <span className="mr-2 text-primary-deep transition-transform group-open:rotate-90 inline-block">›</span>
                  {q}
                </summary>
                <p className="mt-2 font-semibold text-muted-foreground pl-5">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="bg-primary/10 py-16">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-4xl font-extrabold">Ready to start the adventure?</h2>
          <p className="mt-3 font-semibold text-muted-foreground">No sign-up needed in demo mode. Just click and start learning!</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/app" className={chunky({ tone: "accent", size: "lg" })}>
              Start Learning Now
            </Link>
            <Link to="/app/learn" className={chunky({ tone: "ghost", size: "lg" })}>
              See the curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t-2 border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm font-semibold text-muted-foreground">
          <span className="font-display text-lg font-extrabold text-primary-deep">LingoSprout</span>
          <div className="flex gap-5">
            <Link to="/app">Learn</Link>
            <Link to="/app/learn">Programs</Link>
            <Link to="/app/speak">Speaking</Link>
          </div>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Demo build · All progress saved in your browser
          </span>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
  char,
  children,
  reverse,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  char: CharacterId;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`grid items-center gap-8 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <div>
        <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">{icon}</span>
        <h3 className="mt-4 text-3xl font-extrabold">{title}</h3>
        <p className="mt-3 max-w-md text-lg font-semibold text-muted-foreground">{text}</p>
      </div>
      <div className="relative flex min-h-56 items-center justify-center gap-6 rounded-3xl border-2 border-border bg-card p-8">
        {children}
        <Character id={char} className="w-28" />
      </div>
    </div>
  );
}
