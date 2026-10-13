import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Play, RotateCcw, Square, Volume2, ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import { Character, SpeechBubble } from "@/components/characters";
import { ChunkyButton, DemoBadge } from "@/components/ui-kit";
import { compareSpeech, getRecognizer, say } from "@/lib/speech";
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [res, setRes] = useState<ReturnType<typeof compareSpeech> | null>(null);
  const [heardVia, setHeardVia] = useState<"recognition" | "estimate">("recognition");
  const recRef = useRef<MediaRecorder | null>(null);
  const transcript = useRef("");
  const recog = useRef<ReturnType<typeof getRecognizer>>(null);

  const currentSet = PHRASE_SETS[setIdx];
  const phrase = currentSet.phrases[phraseIdx].replace("...", s.name);

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  async function start() {
    setRes(null);
    setAudioUrl(null);
    transcript.current = "";
    if (!navigator.mediaDevices?.getUserMedia) { setPhase("error"); return; }
    setPhase("permission");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setAudioUrl(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType })));
        setPhase("processing");
        setTimeout(() => {
          const heard = transcript.current;
          if (heard) { setHeardVia("recognition"); setRes(compareSpeech(phrase, heard)); }
          else { setHeardVia("estimate"); setRes(null); }
          setPhase("result");
          learner.speakingDone();
        }, 800);
      };
      recRef.current = mr;
      mr.start();
      const r = getRecognizer();
      if (r) {
        r.onresult = (e: unknown) => {
          const event = e as { results: { [k: number]: { [k: number]: { transcript: string } } } };
          transcript.current = event.results[0][0].transcript;
        };
        r.onerror = () => {};
        try { r.start(); } catch { /* ignore */ }
        recog.current = r;
      }
      setPhase("recording");
    } catch (e: unknown) {
      const err = e as { name?: string };
      setPhase(err?.name === "NotAllowedError" ? "denied" : "error");
    }
  }

  function stop() { recog.current?.stop(); recRef.current?.stop(); }

  function nextPhrase() {
    const next = (phraseIdx + 1) % currentSet.phrases.length;
    setPhraseIdx(next);
    setPhase("idle");
    setRes(null);
    setAudioUrl(null);
  }

  function prevPhrase() {
    const prev = (phraseIdx - 1 + currentSet.phrases.length) % currentSet.phrases.length;
    setPhraseIdx(prev);
    setPhase("idle");
    setRes(null);
    setAudioUrl(null);
  }

  function changeCategory(idx: number) {
    setSetIdx(idx);
    setPhraseIdx(0);
    setPhase("idle");
    setRes(null);
    setAudioUrl(null);
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Page Title & Category Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">Speaking Studio</h1>
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-0.5">Read aloud with Tara and hear your voice!</p>
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
              ? `I'm listening, ${s.name}… take your time! 🎤`
              : phase === "result"
              ? `Super reading, ${s.name}! Listen back! 🌟`
              : phase === "permission"
              ? "Please allow microphone access!"
              : `Ready, ${s.name}? Tap the listen icon or start recording! 🐢`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* ── Desktop Tara card (lg+ only) ─────────────────────────── */}
        <section className="relative hidden lg:flex flex-col items-center justify-end overflow-hidden rounded-[2rem] bg-mint p-6 pt-10 min-h-[320px]">
          <SpeechBubble className="mb-4 max-w-xs text-center">
            {phase === "recording"
              ? `I'm listening, ${s.name}… take your time! 🎤`
              : phase === "result"
              ? `Super reading, ${s.name}! Listen back! 🌟`
              : phase === "permission"
              ? "Please allow the microphone!"
              : `Ready, ${s.name}? Hear me first, then your turn! 🐢`}
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

          {/* Phrase card with Chevrons */}
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
                  <p className="font-display text-lg sm:text-2xl font-extrabold leading-snug text-foreground">
                    {res
                      ? res.words.map((w, i) => (
                          <span key={i} className={w.ok ? "text-secondary-deep" : "text-accent-deep underline decoration-wavy"}>
                            {w.word}{" "}
                          </span>
                        ))
                      : phrase}
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground mt-1">
                    Tap the speaker to hear pronunciation
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

          {/* Record button & status */}
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

            {phase === "recording" && <Waves />}

            <p className="text-center font-display text-xs sm:text-sm font-bold text-muted-foreground">
              {phase === "idle" && "Tap the microphone and read out loud!"}
              {phase === "permission" && "Please allow microphone access in your browser."}
              {phase === "recording" && "Recording… tap square when finished!"}
              {phase === "processing" && "Listening back…"}
            </p>

            {(phase === "denied" || phase === "error") && (
              <div className="flex items-center gap-3 rounded-2xl bg-peach p-3.5 font-semibold border-2 border-border text-xs sm:text-sm">
                <MicOff className="h-5 w-5 text-accent-deep shrink-0" />
                {phase === "denied"
                  ? "Microphone blocked. Please allow mic access in your browser settings."
                  : "Audio recording is not supported on this browser."}
              </div>
            )}
          </div>

          {/* Result Feedback Panel */}
          {phase === "result" && (
            <div className="mt-5 rounded-2xl border-2 border-secondary bg-secondary/10 p-4 sm:p-5 animate-pop space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-1.5">
                    {res ? (
                      res.score >= 80 ? "🌟 Wonderfully Clear!" : res.score >= 50 ? "👏 Great Try!" : "🐢 Keep Practicing!"
                    ) : (
                      "🌟 Awesome Reading!"
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-0.5">
                    {res
                      ? `${res.score}% match detected`
                      : `Recording saved for ${s.name}! Listen back below.`}
                  </p>
                </div>
                <div className="flex text-sun-deep">
                  <Star className="h-5 w-5 fill-sun" />
                  <Star className="h-5 w-5 fill-sun" />
                  <Star className="h-5 w-5 fill-sun" />
                </div>
              </div>

              {/* Symmetrical 2x2 Action Buttons on Mobile */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {audioUrl && (
                  <ChunkyButton tone="ghost" size="sm" onClick={() => new Audio(audioUrl).play()} className="w-full">
                    <Play className="h-4 w-4 mr-1.5" /> My voice
                  </ChunkyButton>
                )}
                <ChunkyButton tone="ghost" size="sm" onClick={() => say(phrase, 0.8)} className="w-full">
                  <Volume2 className="h-4 w-4 mr-1.5" /> Tara's voice
                </ChunkyButton>
                <ChunkyButton tone="ghost" size="sm" onClick={start} className="w-full">
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Try again
                </ChunkyButton>
                <ChunkyButton tone="secondary" size="sm" onClick={nextPhrase} className="w-full">
                  Next phrase →
                </ChunkyButton>
              </div>
            </div>
          )}

          <p className="mt-4 text-center text-[11px] font-semibold text-muted-foreground/80">
            Recordings stay on this device and disappear when you leave the page.
          </p>
        </section>
      </div>
    </div>
  );
}

function Waves() {
  return (
    <div className="flex h-8 items-center gap-1" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-accent"
          style={{
            height: `${30 + ((i * 47) % 70)}%`,
            animation: `bob ${0.6 + (i % 4) * 0.15}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
