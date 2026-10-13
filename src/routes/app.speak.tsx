import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Play, RotateCcw, Square, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { Character, SpeechBubble } from "@/components/characters";
import { ChunkyButton, DemoBadge } from "@/components/ui-kit";
import { compareSpeech, getRecognizer, say } from "@/lib/speech";
import { learner, useLearner } from "@/lib/learner-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/speak")(
  {
    head: () => ({
      meta: [
        { title: "Speaking studio — LingoSprout" },
        { name: "description", content: "Practise reading aloud with Tara the Turtle and hear your own voice." },
        { property: "og:title", content: "Speaking studio — LingoSprout" },
        { property: "og:description", content: "Practise reading aloud with Tara the Turtle." },
      ],
    }),
    component: Speak,
  }
);

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
        }, 900);
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
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-extrabold">Speaking Studio</h1>
        <p className="font-semibold text-muted-foreground">Read aloud with Tara and hear yourself!</p>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PHRASE_SETS.map((ps, i) => (
          <button
            key={i}
            onClick={() => changeCategory(i)}
            className={cn(
              "btn-press flex shrink-0 items-center gap-2 rounded-2xl border-2 border-b-[4px] px-4 py-2 font-display font-bold transition-colors text-sm",
              i === setIdx
                ? "border-primary bg-primary/10 text-primary-deep"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground",
            )}
          >
            <span>{ps.emoji}</span> {ps.category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* ── Tara card ────────────────────────────────────── */}
        <section className="relative flex flex-col items-center justify-end overflow-hidden rounded-[2rem] bg-mint p-6 pt-10 min-h-[280px]">
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
        <section className="rounded-[2rem] border-2 border-border bg-card p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">{currentSet.emoji} {currentSet.category}</h2>
            <DemoBadge>Practice feedback</DemoBadge>
          </div>

          {/* Phrase navigation */}
          <div className="mt-6 flex items-center gap-3">
            <button onClick={prevPhrase} aria-label="Previous phrase" className="btn-press rounded-xl border-2 border-b-[4px] border-border bg-card p-2 hover:border-muted-foreground">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 rounded-2xl bg-ivory p-5">
              <div className="flex items-start gap-3">
                <button onClick={() => say(phrase, 0.8)} aria-label="Hear the phrase" className="btn-press grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-b-[4px] border-primary-deep bg-primary text-primary-foreground">
                  <Volume2 className="h-5 w-5" />
                </button>
                <p className="font-display text-2xl font-bold leading-snug md:text-3xl">
                  {res
                    ? res.words.map((w, i) => (
                        <span key={i} className={w.ok ? "text-secondary-deep" : "text-accent-deep underline decoration-wavy"}>
                          {w.word}{" "}
                        </span>
                      ))
                    : phrase}
                </p>
              </div>
            </div>
            <button onClick={nextPhrase} aria-label="Next phrase" className="btn-press rounded-xl border-2 border-b-[4px] border-border bg-card p-2 hover:border-muted-foreground">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs font-semibold text-muted-foreground">
            Phrase {phraseIdx + 1} of {currentSet.phrases.length}
          </p>

          {/* Record controls */}
          <div className="mt-6 flex flex-col items-center gap-4">
            {phase === "recording" ? (
              <button
                onClick={stop}
                aria-label="Stop recording"
                className="btn-press grid h-28 w-28 place-items-center rounded-full border-b-[6px] border-accent-deep bg-accent text-accent-foreground animate-pulse-ring"
              >
                <Square className="h-10 w-10 fill-current" />
              </button>
            ) : phase === "processing" || phase === "permission" ? (
              <div className="grid h-28 w-28 place-items-center rounded-full bg-muted">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <button
                onClick={start}
                aria-label="Start recording"
                className="btn-press grid h-28 w-28 place-items-center rounded-full border-b-[6px] border-accent-deep bg-accent text-accent-foreground hover:brightness-105"
              >
                <Mic className="h-12 w-12" />
              </button>
            )}

            {phase === "recording" && <Waves />}

            <p className="text-center font-semibold text-muted-foreground">
              {phase === "idle" && "Tap the microphone and read the phrase out loud."}
              {phase === "permission" && "Please allow microphone access in your browser."}
              {phase === "recording" && "Recording — tap the square when you finish."}
              {phase === "processing" && "Tara is listening back…"}
            </p>

            {(phase === "denied" || phase === "error") && (
              <div className="flex items-center gap-3 rounded-2xl bg-peach p-4 font-semibold border-2 border-border">
                <MicOff className="h-6 w-6 text-accent-deep shrink-0" />
                {phase === "denied"
                  ? "The microphone is blocked. Ask a grown-up to allow it in browser settings."
                  : "This device can't record audio here. Try a different browser."}
              </div>
            )}
          </div>

          {/* Result panel */}
          {phase === "result" && (
            <div className="mt-6 grid gap-4 rounded-2xl border-2 border-secondary bg-secondary/10 p-5 animate-pop">
              {res ? (
                <>
                  <p className="font-display text-2xl font-extrabold">
                    {res.score >= 80 ? "Wonderfully clear! 🌟" : res.score >= 50 ? "Good try — nearly there! 👏" : "Let's try that again together. 🐢"}
                    <span className="text-secondary-deep ml-2">{res.score}% words heard</span>
                  </p>
                  {res.score < 80 && (
                    <p className="text-sm font-semibold text-muted-foreground">
                      Tip: speak slowly and clearly, one word at a time.
                    </p>
                  )}
                </>
              ) : (
                <p className="font-display text-xl font-bold">
                  Recording saved! Word checking isn&apos;t supported in this browser, so listen back and compare with Tara.
                </p>
              )}
              <p className="text-xs font-semibold text-muted-foreground">
                {heardVia === "recognition"
                  ? "Checked with your browser's speech recognition. This shows word matches, not pronunciation accuracy."
                  : "No automatic check was available."}
              </p>
              <div className="flex flex-wrap gap-2">
                {audioUrl && (
                  <ChunkyButton tone="ghost" onClick={() => new Audio(audioUrl).play()}>
                    <Play className="h-5 w-5" /> My voice
                  </ChunkyButton>
                )}
                <ChunkyButton tone="ghost" onClick={() => say(phrase, 0.8)}>
                  <Volume2 className="h-5 w-5" /> Tara's voice
                </ChunkyButton>
                <ChunkyButton tone="ghost" onClick={start}>
                  <RotateCcw className="h-5 w-5" /> Again
                </ChunkyButton>
                <ChunkyButton tone="secondary" onClick={nextPhrase} className="ml-auto">
                  Next phrase
                </ChunkyButton>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            Recordings stay on this device and disappear when you leave the page.
          </p>
        </section>
      </div>
    </div>
  );
}

function Waves() {
  return (
    <div className="flex h-10 items-center gap-1" aria-hidden>
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
