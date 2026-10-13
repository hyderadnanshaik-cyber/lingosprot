import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChunkyButton } from "@/components/ui-kit";
import { Character, CHARACTERS, miloLogo } from "@/components/characters";
import { learner, type LearnerProfile } from "@/lib/learner-store";
import { signInWithGoogle, useAuth } from "@/lib/auth";
import type { CharacterId } from "@/data/curriculum";
import {
  BookOpen,
  Mic,
  Star,
  Target,
  ShieldCheck,
  Heart,
  Sparkles,
  Check,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to LingoSprout — Strict Parent OAuth & Profile Setup" },
      { name: "description", content: "Strict Google OAuth authentication and child learning profile on LingoSprout." },
    ],
  }),
  component: Onboarding,
});

const TOTAL_STEPS = 5;

const AVATAR_OPTIONS: { id: CharacterId; name: string; title: string }[] = [
  { id: "milo", name: "Milo the Fox", title: "Smart & Curious" },
  { id: "pip", name: "Pip the Firefly", title: "Bright Explorer" },
  { id: "tara", name: "Tara the Turtle", title: "Speaking Coach" },
  { id: "bibi", name: "Bibi the Cloud", title: "Storyteller" },
  { id: "kiko", name: "Kiko Chameleon", title: "Grammar Master" },
  { id: "nova", name: "Nova Astronaut", title: "Challenge Seeker" },
];

const GRADES = [
  "Preschool (Age 3-4)",
  "Kindergarten (Age 5)",
  "Grade 1 (Age 6)",
  "Grade 2 (Age 7)",
  "Grade 3 (Age 8)",
  "Grade 4+ (Age 9-12)",
];

function Onboarding() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  // Form State
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("2018-06-15");
  const [grade, setGrade] = useState("Grade 2 (Age 7)");
  const [selectedAvatar, setSelectedAvatar] = useState<CharacterId>("milo");
  const [goal, setGoal] = useState<20 | 30 | 50>(30);
  const [learningFocus, setLearningFocus] = useState<string[]>([
    "Phonics & Sounds",
    "Confident Speaking",
  ]);

  // Auth State
  const [oauthLoading, setOauthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const toggleFocus = (item: string) => {
    setLearningFocus((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleOAuthSignIn = async () => {
    setOauthLoading(true);
    setAuthError(null);
    try {
      const profileDraft: Partial<LearnerProfile> = {
        name: childName.trim() || "Sprout Adventurer",
        dob: childDob,
        age: calculateAge(childDob),
        grade: grade.split(" ")[0],
        avatarId: selectedAvatar,
        nativeLanguage: "English",
        hasCompletedTour: false,
      };

      const result = await signInWithGoogle(profileDraft);
      if (result.user) {
        setStep(2); // Proceed directly to child confirmation
      }
    } catch (err: any) {
      console.error("OAuth error:", err);
      if (err?.code === "auth/unauthorized-domain") {
        setAuthError(
          "Firebase error: 'auth/unauthorized-domain'. To resolve permanently in Google OAuth, add 'localhost' and '127.0.0.1' in Firebase Console > Authentication > Settings > Authorized domains. You can also proceed using Local Parent Mode below!"
        );
      } else if (err?.code === "auth/popup-closed-by-user") {
        setAuthError("Sign-in cancelled. Please authorize with Google to continue.");
      } else if (err?.code === "auth/account-exists-with-different-credential") {
        setAuthError("An account already exists with these credentials. Strict duplicate protection is active.");
      } else {
        setAuthError(err?.message || "Failed to authenticate via Google OAuth.");
      }
    } finally {
      setOauthLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    setAuthError(null);
    setStep(2);
  };

  const finishAccountCreation = async () => {
    learner.updateProfile({
      name: childName.trim() || "Sprout Adventurer",
      dob: childDob,
      age: calculateAge(childDob),
      grade: grade.split(" ")[0],
      avatarId: selectedAvatar,
      nativeLanguage: "English",
      hasCompletedTour: false,
    });
    learner.setDailyGoal(goal);

    // Launch into application
    nav({ to: "/app" });
  };

  function calculateAge(dobStr: string): number {
    try {
      const birth = new Date(dobStr);
      const diff = Date.now() - birth.getTime();
      const ageDate = new Date(diff);
      return Math.abs(ageDate.getUTCFullYear() - 1970) || 7;
    } catch {
      return 7;
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-sky/30 via-background to-ivory py-10 px-4 flex flex-col items-center justify-center">
      {/* Top Header Logo */}
      <div className="mb-6 flex items-center gap-3">
        <img
          src={miloLogo}
          alt="LingoSprout Mascot Logo"
          className="h-14 w-14 rounded-2xl object-contain drop-shadow-md"
        />
        <div>
          <span className="font-display text-3xl font-extrabold text-primary-deep leading-none block">
            Lingo<span className="text-secondary-deep">Sprout</span>
          </span>
          <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
            Small Steps • Big English
          </span>
        </div>
      </div>

      {/* Progress Wizard Dots */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === step
                ? "w-8 bg-primary"
                : i < step
                ? "w-3 bg-secondary"
                : "w-3 bg-muted border border-border"
            }`}
          />
        ))}
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl rounded-3xl border-2 border-border bg-card p-4 sm:p-6 md:p-10 shadow-xl transition-all">
        {/* ── STEP 0: ABOUT THE APPLICATION ────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4 sm:space-y-6 text-center">
            <div className="relative inline-block">
              <img
                src={miloLogo}
                alt="Milo"
                className="mx-auto w-24 h-24 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl object-contain drop-shadow-lg animate-bob"
              />
              <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full bg-sun text-sm sm:text-lg shadow-sm">
                ✨
              </span>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
                Welcome to LingoSprout!
              </h1>
              <p className="text-xs sm:text-base md:text-lg font-semibold text-muted-foreground max-w-md mx-auto">
                An interactive English learning adventure designed specifically for kids aged 4 to 12.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid gap-3 text-left sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl bg-sky/40 p-4 border border-sky-200">
                <Sparkles className="h-6 w-6 text-primary-deep shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-foreground">Phonics & Vowels</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Master short/long sounds, blends, and magic &lsquo;E&rsquo;.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-mint/50 p-4 border border-emerald-200">
                <Mic className="h-6 w-6 text-secondary-deep shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-foreground">Speaking Studio</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Read aloud with Tara the Turtle &amp; gain speech confidence.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-peach/50 p-4 border border-amber-200">
                <BookOpen className="h-6 w-6 text-accent-deep shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-foreground">Poems &amp; Paragraphs</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Learn rhythm, stanzas, sequencing, and essay structure.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-lavender/50 p-4 border border-purple-200">
                <ShieldCheck className="h-6 w-6 text-primary-deep shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-foreground">100% Kid Safe</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Strict Parent OAuth, zero ads, no chat, private audio.</p>
                </div>
              </div>
            </div>

            <ChunkyButton
              tone="primary"
              size="lg"
              className="w-full mt-4"
              onClick={() => setStep(1)}
            >
              Verify Parent Account (OAuth) →
            </ChunkyButton>
          </div>
        )}

        {/* ── STEP 1: STRICT PARENT OAUTH & ANTI-DUPLICATE CHECK ─────── */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-primary/10 text-primary-deep text-2xl">
                <Lock className="h-7 w-7" />
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold mt-2">
                Parent OAuth Authorization
              </h2>
              <p className="text-sm font-semibold text-muted-foreground max-w-sm mx-auto">
                Strict single-account verification. Sign in securely using your verified Google account.
              </p>
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-2xl bg-accent/15 border border-accent p-3.5 text-accent-deep text-xs font-bold text-left animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {user ? (
              <div className="rounded-2xl border-2 border-secondary bg-secondary/15 p-5 text-left flex items-center gap-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Parent"}
                    className="h-12 w-12 rounded-full border-2 border-secondary-deep object-cover"
                  />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary-deep text-white font-bold">
                    {user.displayName?.[0] || "P"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-foreground truncate">
                    {user.displayName || "Verified Parent"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[11px] font-extrabold text-secondary-deep uppercase">
                    ✓ OAuth Verified (No Duplicates)
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleOAuthSignIn}
                  disabled={oauthLoading}
                  className="btn-press w-full rounded-2xl border-2 border-b-[5px] border-border bg-card p-4 font-display text-base font-bold flex items-center justify-center gap-3 hover:border-primary transition-all disabled:opacity-60 shadow-xs"
                >
                  {oauthLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>
                    {oauthLoading ? "Connecting to Google..." : "Continue with Google OAuth"}
                  </span>
                </button>
                <p className="text-xs font-semibold text-muted-foreground">
                  Strict OAuth ensures your child&apos;s progress is uniquely tied to your parent email.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-3">
                <ChunkyButton tone="ghost" onClick={() => setStep(0)} className="flex-1">
                  Back
                </ChunkyButton>
                <ChunkyButton
                  tone="primary"
                  onClick={() => setStep(2)}
                  disabled={!user && !oauthLoading}
                  className="flex-2"
                >
                  {user ? "Next: Child Details →" : "Sign in to Continue"}
                </ChunkyButton>
              </div>

              {!user && (
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-xs font-bold text-primary-deep underline hover:text-primary mt-2 py-1"
                >
                  Or Continue in Local Parent Mode (No Google sign-in required) →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: CHILD DETAILS (NAME, DOB, GRADE) ─────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <Character id="pip" className="mx-auto w-24 animate-bob" />
              <h2 className="font-display text-2xl md:text-3xl font-extrabold">Who is Learning Today?</h2>
              <p className="text-sm font-semibold text-muted-foreground">
                We use this name across every dialogue, quiz, and mascot prompt!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Child&apos;s Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child's name (e.g. Leo, Emma, Aarav)"
                  autoFocus
                  className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-display text-xl font-bold focus:border-primary focus:outline-none text-primary-deep"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Date of Birth (DOB)
                  </label>
                  <input
                    type="date"
                    value={childDob}
                    onChange={(e) => setChildDob(e.target.value)}
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold focus:border-primary focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Grade / Learning Stage
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold focus:border-primary focus:outline-none text-sm"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Learning Focus (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Phonics & Sounds",
                    "Confident Speaking",
                    "Story Reading",
                    "Grammar & Sentences",
                  ].map((focus) => {
                    const isSelected = learningFocus.includes(focus);
                    return (
                      <button
                        key={focus}
                        type="button"
                        onClick={() => toggleFocus(focus)}
                        className={`rounded-xl border-2 p-3 text-left font-display text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary-deep"
                            : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {focus}
                        {isSelected && <Check className="h-4 w-4 text-primary-deep" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <ChunkyButton tone="ghost" onClick={() => setStep(1)} className="flex-1">
                Back
              </ChunkyButton>
              <ChunkyButton
                tone="primary"
                onClick={() => setStep(3)}
                disabled={!childName.trim()}
                className="flex-2"
              >
                {childName.trim() ? `Hi ${childName}! Choose Mascot →` : "Enter Name to Continue"}
              </ChunkyButton>
            </div>
          </div>
        )}

        {/* ── STEP 3: AVATAR / MASCOT COMPANION SELECTION ──────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold">
                Choose {childName || "Your"} Companion Avatar!
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                This mascot will guide {childName || "you"} through every exercise!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`btn-press rounded-2xl border-2 p-3 text-center transition-all flex flex-col items-center gap-2 relative ${
                      isSelected
                        ? "border-primary ring-4 ring-primary/20 bg-primary/10 shadow-md scale-102"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        ✓
                      </span>
                    )}
                    <div className="h-16 w-16 grid place-items-center rounded-2xl overflow-hidden p-1">
                      <Character id={avatar.id} className="h-14 w-14 object-contain" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm leading-tight text-foreground">
                        {avatar.name.split(" ")[0]}
                      </p>
                      <p className="text-[11px] font-semibold text-muted-foreground">{avatar.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-sun-deep/30 bg-sun/15 p-3 text-center">
              <p className="text-xs font-bold text-sun-deep">
                ⭐ {childName || "Your child"} can switch companion avatars anytime from Parent view!
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <ChunkyButton tone="ghost" onClick={() => setStep(2)} className="flex-1">
                Back
              </ChunkyButton>
              <ChunkyButton tone="primary" onClick={() => setStep(4)} className="flex-2">
                Set Learning Goal →
              </ChunkyButton>
            </div>
          </div>
        )}

        {/* ── STEP 4: DAILY XP GOAL & LAUNCH ───────────────────────── */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <div className="h-20 w-20 mx-auto rounded-3xl bg-sun/20 border-2 border-sun-deep/30 grid place-items-center mb-2">
                <Character id={selectedAvatar} className="w-16 h-16 animate-bob" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold">
                Ready to Sprout, {childName}!
              </h2>
              <p className="text-sm font-semibold text-muted-foreground max-w-sm mx-auto">
                Set a daily learning goal to build consistent English habits with {CHARACTERS[selectedAvatar].name}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {([20, 30, 50] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`btn-press rounded-2xl border-2 border-b-[5px] p-4 font-display transition-colors ${
                    goal === g
                      ? "border-primary bg-primary/10 text-primary-deep"
                      : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <p className="text-3xl font-extrabold">{g}</p>
                  <p className="text-xs font-bold text-muted-foreground">XP / Day</p>
                  <p className="text-[11px] mt-1 font-semibold text-muted-foreground">
                    {g === 20 ? "10 min" : g === 30 ? "15 min" : "25 min"}
                  </p>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border-2 border-secondary/40 bg-secondary/10 p-4 text-left flex items-start gap-3">
              <Heart className="h-6 w-6 text-secondary-deep shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-foreground">Interactive Mascot Tour Included</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  When you launch, {CHARACTERS[selectedAvatar].name} will guide {childName} through each part of the adventure!
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <ChunkyButton tone="ghost" onClick={() => setStep(3)} className="flex-1">
                Back
              </ChunkyButton>
              <ChunkyButton
                tone="accent"
                size="lg"
                onClick={finishAccountCreation}
                className="flex-2"
              >
                <Target className="h-5 w-5" /> Launch Adventure!
              </ChunkyButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
