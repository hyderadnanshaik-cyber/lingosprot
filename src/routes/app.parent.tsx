import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Flame,
  Mic,
  Star,
  Trophy,
  Award,
  User,
  Settings,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Compass,
} from "lucide-react";
import { learner, useLearner, ACHIEVEMENTS, levelOf } from "@/lib/learner-store";
import { useAuth, signInWithGoogle, signOutUser } from "@/lib/auth";
import { Character, CHARACTERS, miloLogo } from "@/components/characters";
import { ChunkyButton } from "@/components/ui-kit";
import { ALL_LESSONS, LEVELS, type CharacterId } from "@/data/curriculum";
import { useState } from "react";
import { LogOut, Lock } from "lucide-react";

export const Route = createFileRoute("/app/parent")({
  head: () => ({
    meta: [
      { title: "Parent dashboard — LingoSprout" },
      { name: "description", content: "Monitor your child's English learning progress." },
    ],
  }),
  component: ParentDashboard,
});

const ALL_AVATARS: { id: CharacterId; name: string }[] = [
  { id: "milo", name: "Milo the Fox" },
  { id: "pip", name: "Pip the Firefly" },
  { id: "tara", name: "Tara the Turtle" },
  { id: "bibi", name: "Bibi the Cloud" },
  { id: "kiko", name: "Kiko Chameleon" },
  { id: "nova", name: "Nova Astronaut" },
];

function ParentDashboard() {
  const s = useLearner();
  const { user } = useAuth();
  
  // Safely read initial tab from URL hash or query parameter
  const [tab, setTab] = useState<"overview" | "profile" | "settings">(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash === "settings" || hash === "profile" || hash === "overview") return hash;
      const params = new URLSearchParams(window.location.search);
      const q = params.get("tab");
      if (q === "settings" || q === "profile" || q === "overview") return q;
    }
    return "overview";
  });

  const [nameInput, setNameInput] = useState(s?.name || "Sprout Adventurer");
  const [dobInput, setDobInput] = useState(s?.dob || "2018-06-15");
  const [gradeInput, setGradeInput] = useState(s?.grade || "Grade 2");
  const [selectedAvatar, setSelectedAvatar] = useState<CharacterId>(s?.avatarId || "milo");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync tab if user clicks hash or back/forward
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "settings" || hash === "profile" || hash === "overview") {
        setTab(hash);
      }
    };
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const activeMascot = (s?.avatarId && CHARACTERS[s.avatarId as CharacterId]) ? CHARACTERS[s.avatarId as CharacterId] : CHARACTERS.milo;

  const completedList = s?.completed || [];
  const completedLessons = ALL_LESSONS.filter((l) => completedList.includes(l.id));
  const totalLessons = ALL_LESSONS.length;
  const pct = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const currentLevel = levelOf(s?.xp || 0);
  const achievementsList = s?.achievements || [];
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => achievementsList.includes(a.id));

  // Skills breakdown from completed lessons
  const skillCounts: Record<string, number> = {};
  completedLessons.forEach((l) => {
    skillCounts[l.skill] = (skillCounts[l.skill] ?? 0) + 1;
  });

  // Level progress
  const levelProgress = LEVELS.map((lv) => ({
    ...lv,
    done: lv.lessons.filter((l) => completedList.includes(l.id)).length,
    total: lv.lessons.length,
  }));

  const handleSaveProfile = () => {
    learner.updateProfile({
      name: nameInput.trim() || "Sprout Adventurer",
      dob: dobInput,
      grade: gradeInput,
      avatarId: selectedAvatar,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={miloLogo}
            alt="LingoSprout"
            className="h-12 w-12 rounded-xl object-contain shadow-xs"
          />
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Parent Dashboard</h1>
            <p className="font-semibold text-muted-foreground text-sm">
              Monitoring learning journey for:{" "}
              <strong className="text-primary-deep">{s.name}</strong> ({s.grade || "Learner"})
            </p>
          </div>
        </div>
        <Link
          to="/app"
          className="font-display font-bold text-primary-deep flex items-center gap-1 hover:underline"
        >
          Back to child adventure <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-border overflow-x-auto pb-1 scrollbar-none">
        {(["overview", "profile", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 font-display font-bold capitalize transition-colors text-sm sm:text-base whitespace-nowrap shrink-0 ${
              tab === t
                ? "border-b-3 border-primary text-primary-deep"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "profile" ? "Child Profile & Avatar" : t}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ────────────────────────────────────────────── */}
      {tab === "overview" && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total XP", value: s.xp, icon: <Star className="h-5 w-5 fill-sun text-sun-deep" />, bg: "bg-sun/20" },
              { label: "Lessons completed", value: s.completed.length, icon: <BookOpen className="h-5 w-5 text-primary" />, bg: "bg-primary/10" },
              { label: "Active streak", value: `${s.streak}d`, icon: <Flame className="h-5 w-5 text-accent fill-accent" />, bg: "bg-accent/10" },
              { label: "Speaking sessions", value: s.speakingSessions, icon: <Mic className="h-5 w-5 text-secondary" />, bg: "bg-secondary/20" },
            ].map(({ label, value, icon, bg }) => (
              <div key={label} className={`rounded-2xl border-2 border-border p-5 ${bg} shadow-xs`}>
                <div className="flex items-center gap-2">
                  {icon}
                  <p className="text-sm font-bold text-muted-foreground">{label}</p>
                </div>
                <p className="mt-2 font-display text-4xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>

          {/* Child active companion & reset tour */}
          <div className="rounded-3xl border-2 border-border bg-card p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-peach/40 border border-amber-200">
                <Character id={s.avatarId || "milo"} className="w-12 h-12" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Active Learning Mascot
                </p>
                <p className="font-display text-xl font-bold text-foreground">
                  {activeMascot.name}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  Guiding {s.name} through phonics and speech
                </p>
              </div>
            </div>
            <button
              onClick={() => learner.setTourCompleted(false)}
              className="rounded-xl border-2 border-border bg-ivory px-4 py-2 font-display text-xs font-bold text-primary-deep hover:bg-muted"
            >
              <Compass className="inline h-4 w-4 mr-1" /> Replay Website Tour on Next Visit
            </button>
          </div>

          {/* Overall curriculum progress */}
          <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold">Complete 12-Level Curriculum</h2>
                <p className="text-sm font-semibold text-muted-foreground">
                  {s.completed.length} of {totalLessons} lessons mastered ({pct}%)
                </p>
              </div>
              <span className="font-display text-2xl font-extrabold text-primary-deep">{pct}%</span>
            </div>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {levelProgress.map((lv) => (
                <div key={lv.id} className="rounded-2xl border border-border bg-ivory p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground">Level {lv.id}</p>
                      <p className="text-sm font-bold leading-tight">{lv.name}</p>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      {lv.done}/{lv.total}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-secondary transition-all"
                      style={{ width: `${lv.total > 0 ? Math.round((lv.done / lv.total) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills practiced */}
          {Object.keys(skillCounts).length > 0 && (
            <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-xs">
              <h2 className="text-xl font-extrabold">Skills Practised</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(skillCounts).map(([skill, count]) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-2"
                  >
                    <span className="font-bold text-primary-deep text-sm">{skill}</span>
                    <span className="text-xs font-bold text-muted-foreground">×{count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Firebase Connection Card */}
          <section className="rounded-3xl border-2 border-secondary/40 bg-secondary/10 p-6 flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-secondary-deep shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Firebase Cloud Sync Configured
              </h2>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                Project ID: <code>lingosprout-977ae</code>. Child records and audio privacy settings are
                safeguarded under your parent configuration.
              </p>
            </div>
          </section>
        </>
      )}

      {/* ── PROFILE & AVATAR TAB ────────────────────────────────────── */}
      {tab === "profile" && (
        <section className="max-w-xl rounded-3xl border-2 border-border bg-card p-6 md:p-8 shadow-xs">
          <h2 className="text-2xl font-extrabold">Child Profile Settings</h2>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Update your child&apos;s display name, birth date, grade, and select their personal mascot avatar.
          </p>

          {saveSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary/20 border border-secondary p-4 text-secondary-deep font-bold text-sm animate-pop">
              <CheckCircle2 className="h-5 w-5" /> Profile successfully updated!
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Child&apos;s Name
              </label>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-display text-lg font-bold focus:border-primary focus:outline-none"
                placeholder="Enter child's name"
                maxLength={30}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Date of Birth (DOB)
                </label>
                <input
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold focus:border-primary focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Grade / Level
                </label>
                <input
                  type="text"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder="e.g. Grade 2"
                  className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold focus:border-primary focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Avatar Mascot Picker */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Choose Mascot Avatar Companion
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ALL_AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`btn-press rounded-2xl border-2 p-3 text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                          : "border-border bg-ivory hover:border-primary/50"
                      }`}
                    >
                      <div className="h-12 w-12 grid place-items-center">
                        <Character id={av.id} className="w-11 h-11 object-contain" />
                      </div>
                      <p className="font-display font-bold text-xs text-foreground truncate w-full">
                        {av.name.split(" ")[0]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <ChunkyButton
              tone="primary"
              size="lg"
              className="mt-6 w-full"
              onClick={handleSaveProfile}
            >
              Save Profile &amp; Avatar
            </ChunkyButton>
          </div>
        </section>
      )}

      {/* ── SETTINGS TAB ────────────────────────────────────────────── */}
      {tab === "settings" && (
        <section className="max-w-md rounded-3xl border-2 border-border bg-card p-6 shadow-xs">
          <h2 className="text-xl font-extrabold">Learning Preferences</h2>
          <div className="mt-6 space-y-4">
            {/* Strict OAuth Account Management */}
            <div className="rounded-2xl bg-ivory p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm">Parent Account (Strict OAuth)</p>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-deep">
                  {user ? "Authenticated" : "Guest Mode"}
                </span>
              </div>
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Parent avatar"
                        className="h-10 w-10 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-primary-deep font-bold">
                        {user.displayName?.[0] || "P"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs truncate">{user.displayName || "Parent"}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <ChunkyButton
                    tone="ghost"
                    size="sm"
                    className="w-full text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => signOutUser()}
                  >
                    <LogOut className="h-4 w-4 mr-1.5" /> Sign Out Parent Account
                  </ChunkyButton>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Link this profile to a verified Google account to prevent duplicates and enable cloud backup.
                  </p>
                  <ChunkyButton
                    tone="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => signInWithGoogle()}
                  >
                    <Lock className="h-4 w-4 mr-1.5" /> Link Google OAuth
                  </ChunkyButton>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-ivory p-4 border border-border">
              <p className="font-bold text-sm">Daily XP Goal</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                Current target: {s.dailyGoal} XP/day
              </p>
              <div className="flex gap-2 mt-3">
                {([20, 30, 50] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => learner.setDailyGoal(g)}
                    className={`rounded-xl border-2 border-b-[4px] px-4 py-2 font-display font-bold text-sm ${
                      s.dailyGoal === g
                        ? "border-primary bg-primary/10 text-primary-deep"
                        : "border-border bg-card hover:border-muted-foreground"
                    }`}
                  >
                    {g} XP
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-peach/40 p-4 border-2 border-border">
              <p className="font-bold text-accent-deep text-sm">Reset Progress</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                Clears lessons, streak, and achievements from this local browser profile.
              </p>
              <ChunkyButton
                tone="ghost"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => {
                  if (confirm("Are you sure? This will reset all current lesson progress.")) {
                    learner.reset();
                  }
                }}
              >
                Reset Learner Progress
              </ChunkyButton>
            </div>
          </div>
        </section>
      )}

      {/* Footer attribution */}
      <div className="pt-6 border-t border-border/60 text-center text-xs text-muted-foreground">
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/shaik-adnan-hyder"
          target="_blank"
          rel="noopener noreferrer"
          className="font-extrabold text-primary-deep hover:underline"
        >
          SHAIK ADNAN HYDER
        </a>
      </div>
    </div>
  );
}
