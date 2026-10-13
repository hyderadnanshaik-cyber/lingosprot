import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Square,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { Character, SpeechBubble } from "@/components/characters";
import { ChunkyButton } from "@/components/ui-kit";
import { compareSpeech, getRecognizer, say, type SpeechComparison } from "@/lib/speech";
import { learner, useLearner } from "@/lib/learner-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/speak")({
  head: () => ({
    meta: [
      { title: "Speaking studio — LingoSprout" },
      { name: "description", content: "Practise reading aloud with Tara the Turtle and hear your own voice." },
      { property: "og:title", content: "Speaking studio — LingoSprout" },
      { property: "og:description", content: "Practise reading aloud with Tara the Turtle." },
    ],
  }),
  component: Speak,
});

type PhraseSet = { category: string; emoji: string; phrases: string[] };

const PHRASE_SETS: PhraseSet[] = [
  {
    category: "Greetings",
    emoji: "👋",
    phrases: [
      "Hello! My name is ...",
      "Good morning! How are you?",
      "Nice to meet you today.",
      "Goodbye! See you tomorrow.",
      "Thank you very much.",
    ],
  },
  {
    category: "Animals",
    emoji: "🐾",
    phrases: [
      "The fish can swim in the sea.",
      "I like red apples and green pears.",
      "The big dog ran across the park.",
      "Can you see the little cat?",
      "The bird sang a sweet song.",
    ],
  },
  {
    category: "Questions",
    emoji: "❓",
    phrases: [
      "What is your favourite colour?",
      "Can you see the moon tonight?",
      "Where is the little dog?",
      "How old are you?",
      "Do you like to read books?",
    ],
  },
  {
    category: "School",
    emoji: "🏫",
    phrases: [
      "My favourite subject is reading.",
      "I go to school every day.",
      "I can write my name neatly.",
      "The teacher is very kind.",
      "I love learning new words.",
    ],
  },
  {
    category: "Stories",
    emoji: "📖",
    phrases: [
      "Once upon a time, there was a little fox.",
      "The brave girl climbed up the tall tree.",
      "They all lived happily ever after.",
      "The sun shone brightly on the golden sand.",
      "A tiny firefly glowed in the dark forest.",
    ],
  },
  {
    category: "Sentences",
    emoji: "✏️",
    phrases: [
      "The sun is very hot today.",
      "I can see a big red bus.",
      "She has three green apples.",
      "The ball rolled under the chair.",
      "We all like to play outside.",
    ],
  },
];

type Phase = "idle" | "permission" | "recording" | "processing" | "result" | "denied" | "error";

function Speak() {
  const s = useLearner();
  const [setIdx, setSetIdx] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [res, setRes] = useState<SpeechComparison | null>(null);
  const [noWordsHeard, setNoWordsHeard] = useState(false);

  const transcriptRef = useRef("");
  const recogRef = useRef<ReturnType<typeof getRecognizer>>(null);
  const finishTimeoutRef = useRef<number | null>(null);

  const currentSet = PHRASE_SETS[setIdx];
  const phrase = currentSet.phrases[phraseIdx].replace("...", s.name);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current) window.clearTimeout(finishTimeoutRef.current);
      try { recogRef.current?.abort(); } catch {}
    };
  }, []);

  function start() {
    setRes(null);
    setNoWordsHeard(false);
    setLiveTranscript("");
    transcriptRef.current = "";

    const r = getRecognizer();
    if (!r) {
      setPhase("error");
      return;
    }

    r.onstart = () => {
      setPhase("recording");
    };

    r.onresult = (e: any) => {
      let full = "";
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript + " ";
      }
      const trimmed = full.trim();
      transcriptRef.current = trimmed;
      setLiveTranscript(trimmed);
    };

    r.onerror = (e: any) => {
      console.warn("Speech recognition notice:", e?.error);
      if (e?.error === "not-allowed") {
        setPhase("denied");
      }
    };

    r.onend = () => {
      // If we were recording and speech recognition ended, process result
      if (phase === "recording") {
        finalizeEvaluation();
      }
    };

    recogRef.current = r;
    setPhase("permission");

    try {
      r.start();
    } catch (err) {
      console.error("Recognizer start error:", err);
      setPhase("error");
    }
  }

  function stop() {
    setPhase("processing");
    try {
      recogRef.current?.stop();
    } catch {}

    // Allow a short window for the final speech-to-text chunk to arrive
    finishTimeoutRef.current = window.setTimeout(() => {
      finalizeEvaluation();
    }, 600);
  }

  function finalizeEvaluation() {
    if (finishTimeoutRef.current) {
      window.clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }

    const heard = transcriptRef.current.trim();
    if (!heard) {
      setNoWordsHeard(true);
      setRes(null);
      setPhase("result");
      return;
    }

    const comparison = compareSpeech(phrase, heard);
    setRes(comparison);
    setNoWordsHeard(false);
    setPhase("result");

    // Award XP if effort was made
    if (comparison.score >= 50) {
      learner.speakingDone();
    }
  }

  function nextPhrase() {
    const next = (phraseIdx + 1) % currentSet.phrases.length;
    setPhraseIdx(next);
    setPhase("idle");
    setRes(null);
    setNoWordsHeard(false);
    setLiveTranscript("");
  }

  function prevPhrase() {
    const prev = (phraseIdx - 1 + currentSet.phrases.length) % currentSet.phrases.length;
    setPhraseIdx(prev);
    setPhase("idle");
    setRes(null);
    setNoWordsHeard(false);
    setLiveTranscript("");
  }

  function changeCategory(idx: number) {
    setSetIdx(idx);
    setPhraseIdx(0);
    setPhase("idle");
    setRes(null);
    setNoWordsHeard(false);
    setLiveTranscript("");
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Page Title & Category Selector */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">Speaking Studio</h1>
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-0.5">
          Read aloud with Tara — see what you got right and where to improve!
        </p>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {PHRASE_SETS.map((ps, i) => (
          <button
            key={i}
            onClick={() => changeCategory(i)}
            className={cn(
              "btn-press flex shrink-0 items-center gap-2 rounded-2xl border-2 border-b-[4px] px-3.5 sm:px-4 py-2 font-display font-bold transition-colors text-xs sm:text-sm",
              i === setIdx
                ? "border-primary bg-primary/10 text-primary-deep"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground",
            )}
          >
            <span>{ps.emoji}</span> {ps.category}
          </button>
        ))}
      </div>

      {/* Mobile/Tablet Compact Tara Banner (< lg) */}
      <div className="lg:hidden flex items-center gap-3.5 rounded-2xl bg-mint p-3 sm:p-4 border border-emerald-200">
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/70 grid place-items-center shrink-0">
          <Character id="tara" eager bob={phase === "recording"} className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-xs sm:text-sm font-bold text-foreground leading-snug">
            {phase === "recording"
              ? `Listening to you, ${s.name}… speak clearly! 🎤`
              : phase === "result"
              ? res && res.score >= 80
                ? `Super reading, ${s.name}! Every word was clear! 🌟`
                : res && res.score >= 50
                ? `Nice try, ${s.name}! Let's check the words below! 👏`
                : `Keep going, ${s.name}! Practice makes perfect! 🐢`
              : phase === "permission"
              ? "Starting microphone…"
              : `Tap the red mic to read, or tap the speaker to hear Tara! 🐢`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* ── Desktop Tara card (lg+ only) ─────────────────────────── */}
        <section className="relative hidden lg:flex flex-col items-center justify-end overflow-hidden rounded-[2rem] bg-mint p-6 pt-10 min-h-[340px]">
          <SpeechBubble className="mb-4 max-w-xs text-center">
            {phase === "recording"
              ? `I'm listening, ${s.name}… take your time! 🎤`
              : phase === "result"
              ? res && res.score >= 80
                ? `Wonderful reading, ${s.name}! 🌟`
                : res && res.score >= 50
                ? `Good effort, ${s.name}! Check the words below! 👏`
                : `Let's practice the tricky words together! 🐢`
              : `Ready, ${s.name}? Hear me first, then read aloud! 🐢`}
          </SpeechBubble>
          <Character id="tara" eager bob={phase === "recording"} className="w-48 md:w-56" />
        </section>

        {/* ── Practice panel ───────────────────────────────── */}
        <section className="rounded-[2rem] border-2 border-border bg-card p-4 sm:p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
              <span>{currentSet.emoji}</span> {currentSet.category}
            </h2>
            <span className="text-xs font-bold text-muted-foreground bg-ivory border border-border px-2.5 py-1 rounded-full">
              {phraseIdx + 1} of {currentSet.phrases.length}
            </span>
          </div>

          {/* Phrase card with Chevrons and Word-by-Word Analysis */}
          <div className="mt-4 flex items-center gap-2 sm:gap-3">
            <button
              onClick={prevPhrase}
              aria-label="Previous phrase"
              className="btn-press rounded-2xl border-2 border-b-[4px] border-border bg-card p-2 sm:p-2.5 hover:border-muted-foreground shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex-1 rounded-2xl bg-ivory p-4 sm:p-5 border border-border">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => say(phrase, 0.8)}
                  aria-label="Hear Tara say the phrase"
                  title="Listen to Tara"
                  className="btn-press grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl border-b-[4px] border-primary-deep bg-primary text-primary-foreground hover:brightness-105"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  {/* Highlight each word: Green for correct, Red for missed */}
                  <div className="flex flex-wrap items-center gap-1.5 font-display text-lg sm:text-2xl font-extrabold leading-snug">
                    {res ? (
                      res.words.map((w, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "inline-flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 border text-base sm:text-xl transition-all",
                            w.ok
                              ? "bg-secondary/20 text-secondary-deep border-secondary/40"
                              : "bg-accent/15 text-accent-deep border-accent/40 underline decoration-wavy decoration-accent",
                          )}
                        >
                          {w.original}
                          {w.ok ? (
                            <CheckCircle2 className="h-3.5 w-3.5 inline text-secondary-deep ml-0.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 inline text-accent-deep ml-0.5" />
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-foreground">{phrase}</span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground mt-2">
                    {res
                      ? "Words in green are correct. Words in red were missed."
                      : "Tap the speaker to hear Tara read this phrase."}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={nextPhrase}
              aria-label="Next phrase"
              className="btn-press rounded-2xl border-2 border-b-[4px] border-border bg-card p-2 sm:p-2.5 hover:border-muted-foreground shrink-0"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Record button & live status */}
          <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3">
            {phase === "recording" ? (
              <button
                onClick={stop}
                aria-label="Stop recording"
                className="btn-press grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-full border-b-[6px] border-accent-deep bg-accent text-accent-foreground animate-pulse-ring shadow-lg"
              >
                <Square className="h-9 w-9 fill-current" />
              </button>
            ) : phase === "processing" || phase === "permission" ? (
              <div className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-full bg-muted">
                <Loader2 className="h-9 w-9 animate-spin text-primary" />
              </div>
            ) : (
              <button
                onClick={start}
                aria-label="Start recording"
                className="btn-press grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-full border-b-[6px] border-accent-deep bg-accent text-accent-foreground hover:brightness-105 shadow-lg"
              >
                <Mic className="h-10 w-10 sm:h-12 sm:w-12" />
              </button>
            )}

            {/* Live speech feedback as you talk */}
            {phase === "recording" && (
              <div className="w-full max-w-sm rounded-2xl bg-sun/15 border border-sun/30 p-2.5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sun-deep">Listening now…</p>
                <p className="font-display text-sm font-bold text-foreground mt-0.5 italic">
                  {liveTranscript ? `"${liveTranscript}"` : "Speak the words into your mic…"}
                </p>
              </div>
            )}

            <p className="text-center font-display text-xs sm:text-sm font-bold text-muted-foreground">
              {phase === "idle" && "Tap the microphone and read out loud!"}
              {phase === "permission" && "Opening microphone…"}
              {phase === "recording" && "Reading now — tap the square when finished!"}
              {phase === "processing" && "Analyzing your pronunciation…"}
            </p>

            {(phase === "denied" || phase === "error") && (
              <div className="flex items-center gap-3 rounded-2xl bg-peach p-3.5 font-semibold border-2 border-border text-xs sm:text-sm">
                <MicOff className="h-5 w-5 text-accent-deep shrink-0" />
                {phase === "denied"
                  ? "Microphone access blocked. Please allow mic in browser settings to speak!"
                  : "Speech recognition isn't supported on this browser. Try Chrome."}
              </div>
            )}
          </div>

          {/* Detailed Diagnosis Result Panel */}
          {phase === "result" && (
            <div className="mt-5 rounded-2xl border-2 border-border bg-card p-4 sm:p-5 animate-pop space-y-3.5 shadow-sm">
              {noWordsHeard ? (
                /* No speech was picked up */
                <div className="rounded-xl bg-peach/40 border border-peach p-3.5 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-accent-deep font-display font-extrabold text-base sm:text-lg">
                    <AlertCircle className="h-5 w-5" /> We didn&apos;t hear any words!
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                    Make sure to speak clearly near your device&apos;s microphone.
                  </p>
                  <ChunkyButton tone="primary" size="sm" onClick={start} className="mt-2">
                    <RotateCcw className="h-4 w-4 mr-1.5" /> Try speaking again
                  </ChunkyButton>
                </div>
              ) : res ? (
                /* Speech was analyzed */
                <>
                  {/* Status header with score and stars */}
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-1.5">
                        {res.score >= 80 ? (
                          <span className="text-secondary-deep">🌟 Excellent reading!</span>
                        ) : res.score >= 50 ? (
                          <span className="text-sun-deep">👏 Good attempt!</span>
                        ) : (
                          <span className="text-accent-deep">🐢 Keep practicing!</span>
                        )}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-muted-foreground mt-0.5">
                        Accuracy score: <span className="font-extrabold text-foreground">{res.score}%</span> (
                        {res.correctWords.length} of {res.words.length} words correct)
                      </p>
                    </div>

                    {/* Star rating */}
                    <div className="flex text-sun-deep gap-0.5">
                      <Star className={cn("h-5 w-5", res.score >= 40 ? "fill-sun" : "text-muted opacity-40")} />
                      <Star className={cn("h-5 w-5", res.score >= 70 ? "fill-sun" : "text-muted opacity-40")} />
                      <Star className={cn("h-5 w-5", res.score >= 90 ? "fill-sun" : "text-muted opacity-40")} />
                    </div>
                  </div>

                  {/* "What you said" vs "What was expected" */}
                  <div className="rounded-xl bg-ivory p-3 border border-border space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-muted-foreground shrink-0 w-20">You said:</span>
                      <span className="font-display font-bold text-foreground italic">
                        &ldquo;{res.heardText}&rdquo;
                      </span>
                    </div>

                    {/* Specifically tell where they went wrong */}
                    {res.missedWords.length > 0 ? (
                      <div className="flex items-start gap-2 pt-1 border-t border-border/60">
                        <span className="font-bold text-accent-deep shrink-0 w-20">Tricky words:</span>
                        <div className="flex flex-wrap gap-1">
                          {res.missedWords.map((word, i) => (
                            <button
                              key={i}
                              onClick={() => say(word, 0.75)}
                              className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 font-bold text-accent-deep hover:bg-accent/25 transition-colors"
                              title="Tap to hear pronunciation"
                            >
                              <Volume2 className="h-3 w-3" />
                              {word}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-secondary-deep font-bold pt-1 border-t border-border/60">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>You read all the words correctly! Fantastic!</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <ChunkyButton tone="ghost" size="md" onClick={() => say(phrase, 0.8)} className="w-full">
                      <Volume2 className="h-4 w-4 mr-1.5" /> Hear Tara
                    </ChunkyButton>
                    <ChunkyButton tone="ghost" size="md" onClick={start} className="w-full">
                      <RotateCcw className="h-4 w-4 mr-1.5" /> Try again
                    </ChunkyButton>
                    <ChunkyButton
                      tone={res.score >= 60 ? "primary" : "ghost"}
                      size="md"
                      onClick={nextPhrase}
                      className="col-span-2 w-full mt-1"
                    >
                      {res.score >= 60 ? "Next phrase →" : "Continue to next phrase →"}
                    </ChunkyButton>
                  </div>
                </>
              ) : null}
            </div>
          )}

          <p className="mt-4 text-center text-[11px] font-semibold text-muted-foreground/80">
            Microphone speech evaluation is processed directly on your device.
          </p>
        </section>
      </div>
    </div>
  );
}
