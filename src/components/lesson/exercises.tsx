import { useEffect, useMemo, useState } from "react";
import { Mic, Volume2 } from "lucide-react";
import type { Exercise } from "@/data/curriculum";
import { compareSpeech, getRecognizer, say } from "@/lib/speech";
import { cn } from "@/lib/utils";

export type ExProps = { ex: Exercise; answer: string; setAnswer: (a: string) => void; locked: boolean };

export function expected(ex: Exercise): string {
  switch (ex.type) {
    case "listen-select": return ex.word;
    case "beginning-sound": return ex.answer;
    case "missing-letter": return ex.answer;
    case "build-word": return ex.word;
    case "arrange": return ex.sentence;
    case "read-aloud": return "ok";
    case "match-definition": return ex.word;
    case "fill-blank": return ex.answer;
    case "poem-rhyme": return ex.answer;
    case "paragraph-order": return ex.solution.join(" /// ");
    case "grammar-fix": return ex.correctSentence;
  }
}

export function hint(ex: Exercise): string {
  switch (ex.type) {
    case "listen-select": return `Listen again slowly. The word starts with "${ex.word[0]}".`;
    case "beginning-sound": return `Say "${ex.word}" slowly. What do your lips do first?`;
    case "missing-letter": return `The full word is "${ex.full}". Say it out loud.`;
    case "build-word": return `It starts with "${ex.word[0]}". Put the tiles in the right order!`;
    case "arrange": return `Sentences start with a capital letter: "${ex.sentence.split(" ")[0]}".`;
    case "read-aloud": return "Press play to hear it first, then read along nicely.";
    case "match-definition": return `Think about what the word means. ${ex.definition.substring(0, 30)}…`;
    case "fill-blank": return `Say the sentence out loud and think which word fits in the gap.`;
    case "poem-rhyme": return `Read the lines aloud with rhythm! Pay attention to the end sound of each line.`;
    case "paragraph-order": return `Every great paragraph begins with an introduction or topic sentence!`;
    case "grammar-fix": return `Spot the grammar error: look out for capital letters, punctuation, or subject-verb agreement!`;
  }
}

export function speakTarget(ex: Exercise) {
  if (ex.type === "listen-select" || ex.type === "beginning-sound") say(ex.word);
  else if (ex.type === "missing-letter") say(ex.full);
  else if (ex.type === "build-word") say(ex.word);
  else if (ex.type === "match-definition") say(ex.definition);
  else if (ex.type === "fill-blank") say(ex.sentence.replace("___", ex.answer));
  else if (ex.type === "poem-rhyme") say(ex.stanzas.join(". "));
  else if (ex.type === "paragraph-order") say(ex.solution.join(" "));
  else if (ex.type === "grammar-fix") say(ex.correctSentence);
  else say(ex.sentence);
}

const seededShuffle = <T,>(arr: T[], seed: string) => {
  const h = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const out = arr.map((v, i) => ({ v, k: h(seed + i) })).sort((a, b) => a.k - b.k).map((x) => x.v);
  return out.join() === arr.join() && arr.length > 1 ? [...out.slice(1), out[0]] : out;
};

function PlayButton({ onClick, big }: { onClick: () => void; big?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label="Play sound"
      className={cn(
        "btn-press grid place-items-center rounded-3xl border-b-[6px] border-primary-deep bg-primary text-primary-foreground",
        big ? "h-28 w-28" : "h-14 w-14",
      )}
    >
      <Volume2 className={big ? "h-12 w-12" : "h-6 w-6"} />
    </button>
  );
}

function Choices({
  options,
  answer,
  setAnswer,
  locked,
  big,
}: {
  options: string[];
  answer: string;
  setAnswer: (a: string) => void;
  locked: boolean;
  big?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (!locked && n >= 1 && n <= options.length) setAnswer(options[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options, locked, setAnswer]);

  return (
    <div
      className={cn(
        "grid w-full max-w-xl gap-3",
        options.length === 2 && "grid-cols-2",
        options.length === 4 && "grid-cols-2 sm:grid-cols-4",
        options.length === 3 && "grid-cols-1 sm:grid-cols-3",
        options.length > 4 && "grid-cols-2 sm:grid-cols-3",
      )}
    >
      {options.map((o, i) => (
        <button
          key={o}
          disabled={locked}
          onClick={() => {
            setAnswer(o);
            say(o);
          }}
          className={cn(
            "btn-press relative rounded-2xl border-2 border-b-[5px] bg-card px-4 py-5 font-display font-bold transition-colors",
            big ? "text-4xl" : "text-2xl",
            answer === o ? "border-primary bg-primary/10 text-primary-deep" : "border-border hover:border-muted-foreground",
          )}
        >
          <span className="absolute left-3 top-2 text-xs text-muted-foreground">{i + 1}</span>
          {o}
        </button>
      ))}
    </div>
  );
}

function Tiles({
  pieces,
  seed,
  joiner,
  answer,
  setAnswer,
  locked,
}: {
  pieces: string[];
  seed: string;
  joiner: string;
  answer: string;
  setAnswer: (a: string) => void;
  locked: boolean;
}) {
  const pool = useMemo(() => seededShuffle(pieces.map((p, i) => ({ p, i })), seed), [pieces, seed]);
  const [picked, setPicked] = useState<number[]>([]);
  useEffect(() => {
    if (!answer) setPicked([]);
  }, [answer]);
  const update = (next: number[]) => {
    setPicked(next);
    setAnswer(next.map((i) => pieces[i]).join(joiner));
  };
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Placed tiles zone */}
      <div className="flex min-h-20 w-full flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3">
        {picked.length === 0 && (
          <span className="text-sm font-semibold text-muted-foreground">Tap tiles below to build your answer</span>
        )}
        {picked.map((i) => (
          <button
            key={i}
            disabled={locked}
            onClick={() => update(picked.filter((x) => x !== i))}
            className="btn-press animate-pop rounded-2xl border-2 border-b-[5px] border-primary bg-primary/10 px-4 py-3 font-display text-2xl font-bold"
          >
            {pieces[i]}
          </button>
        ))}
      </div>
      {/* Available tiles */}
      <div className="flex flex-wrap justify-center gap-2">
        {pool.map(({ p, i }) => (
          <button
            key={i}
            disabled={locked || picked.includes(i)}
            onClick={() => update([...picked, i])}
            className={cn(
              "btn-press rounded-2xl border-2 border-b-[5px] border-border bg-card px-4 py-3 font-display text-2xl font-bold",
              picked.includes(i) && "opacity-25",
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReadAloud({ sentence, setAnswer, locked }: { sentence: string; setAnswer: (a: string) => void; locked: boolean }) {
  const [state, setState] = useState<"idle" | "listening" | "done" | "unsupported" | "error">("idle");
  const [result, setResult] = useState<ReturnType<typeof compareSpeech> | null>(null);

  const start = () => {
    const r = getRecognizer();
    if (!r) {
      setState("unsupported");
      return;
    }
    setState("listening");
    r.onresult = (e: unknown) => {
      const event = e as { results: { [k: number]: { [k: number]: { transcript: string } } } };
      const res = compareSpeech(sentence, event.results[0][0].transcript);
      setResult(res);
      setState("done");
      if (res.score >= 50) setAnswer("ok");
    };
    r.onerror = () => setState("error");
    r.start();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <PlayButton onClick={() => say(sentence)} />
        <p className="font-display text-3xl font-bold md:text-4xl">
          {result
            ? result.words.map((w, i) => (
                <span key={i} className={w.ok ? "text-secondary-deep" : "text-accent-deep underline decoration-wavy"}>
                  {w.word}{" "}
                </span>
              ))
            : sentence}
        </p>
      </div>
      <button
        onClick={start}
        disabled={locked || state === "listening"}
        aria-label="Start recording"
        className={cn(
          "btn-press grid h-24 w-24 place-items-center rounded-full border-b-[6px] border-accent-deep bg-accent text-accent-foreground",
          state === "listening" && "animate-pulse-ring",
        )}
      >
        <Mic className="h-10 w-10" />
      </button>
      <p className="text-center font-semibold text-muted-foreground">
        {state === "idle" && "Tap the microphone and read the sentence."}
        {state === "listening" && "Listening… read clearly!"}
        {state === "done" && result && (result.score >= 50 ? `Lovely reading! ${result.score}% of words heard.` : "Almost! Try once more, nice and clear.")}
        {(state === "unsupported" || state === "error") && (
          <span>
            Voice checking isn&apos;t available here.{" "}
            <button className="font-bold text-primary-deep underline" onClick={() => setAnswer("ok")}>
              I read it out loud
            </button>
          </span>
        )}
      </p>
    </div>
  );
}

function MatchDefinition({
  definition,
  options,
  answer,
  setAnswer,
  locked,
}: {
  word: string;
  definition: string;
  options: string[];
  answer: string;
  setAnswer: (a: string) => void;
  locked: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full max-w-xl rounded-2xl border-2 border-border bg-ivory p-6 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Definition</p>
        <p className="mt-2 font-display text-2xl font-bold leading-snug">{definition}</p>
        <button onClick={() => say(definition)} className="mt-3 text-sm font-semibold text-primary-deep underline">
          🔊 Hear it
        </button>
      </div>
      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Which word matches this definition?</p>
      <Choices options={options} answer={answer} setAnswer={setAnswer} locked={locked} />
    </div>
  );
}

function FillBlank({
  sentence,
  options,
  answer,
  setAnswer,
  locked,
}: {
  sentence: string;
  blank: string;
  options: string[];
  answer: string;
  setAnswer: (a: string) => void;
  locked: boolean;
}) {
  const parts = sentence.split("___");
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full max-w-2xl rounded-2xl border-2 border-border bg-ivory p-6">
        <p className="text-center font-display text-3xl font-bold leading-relaxed md:text-4xl">
          {parts[0]}
          <span className={cn("mx-2 inline-block min-w-[80px] border-b-4 text-center", answer ? "border-primary text-primary-deep" : "border-border text-muted-foreground")}>
            {answer || "  "}
          </span>
          {parts[1]}
        </p>
      </div>
      <Choices options={options} answer={answer} setAnswer={setAnswer} locked={locked} />
    </div>
  );
}

function PoemRhymeView({
  title,
  stanzas,
  question,
  options,
  answer,
  setAnswer,
  locked,
}: {
  title: string;
  stanzas: string[];
  question: string;
  options: string[];
  answer: string;
  setAnswer: (a: string) => void;
  locked: boolean;
}) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Poem parchment container */}
      <div className="w-full rounded-3xl border-2 border-sun-deep/40 bg-amber-50/70 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <p className="font-display text-xl font-extrabold text-amber-900">📜 {title}</p>
          <button
            onClick={() => say(stanzas.join(". "))}
            className="flex items-center gap-1 text-sm font-bold text-amber-800 hover:text-amber-950"
          >
            <Volume2 className="h-4 w-4" /> Listen to Poem
          </button>
        </div>
        <div className="mt-4 space-y-2 text-center font-display text-lg italic md:text-xl text-amber-950">
          {stanzas.map((line, idx) => (
            <p key={idx} className="leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
      <p className="text-center font-display text-xl font-bold">{question}</p>
      <Choices options={options} answer={answer} setAnswer={setAnswer} locked={locked} />
    </div>
  );
}

function ParagraphOrderView({
  title,
  sentences,
  answer,
  setAnswer,
  locked,
}: {
  title: string;
  sentences: string[];
  solution: string[];
  answer: string;
  setAnswer: (a: string) => void;
  locked: boolean;
}) {
  const currentPicked = answer ? answer.split(" /// ") : [];

  const handlePick = (sentence: string) => {
    if (locked) return;
    if (currentPicked.includes(sentence)) {
      const next = currentPicked.filter((s) => s !== sentence);
      setAnswer(next.join(" /// "));
    } else {
      const next = [...currentPicked, sentence];
      setAnswer(next.join(" /// "));
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="w-full rounded-2xl border-2 border-border bg-card p-4 text-center">
        <p className="font-display text-lg font-bold text-primary-deep">📝 {title}</p>
        <p className="text-sm font-semibold text-muted-foreground mt-1">
          Tap each sentence in chronological order to build a coherent paragraph!
        </p>
      </div>

      {/* Paragraph drop / assembled zone */}
      <div className="w-full rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-5 min-h-[120px] space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Assembled Paragraph:</p>
        {currentPicked.length === 0 ? (
          <p className="text-sm font-medium text-muted-foreground italic py-3 text-center">
            Tap the sentences below in logical sequence...
          </p>
        ) : (
          currentPicked.map((s, idx) => (
            <div
              key={idx}
              onClick={() => handlePick(s)}
              className="flex items-start gap-3 rounded-xl border border-primary/20 bg-card p-3 shadow-sm cursor-pointer hover:border-destructive transition-colors"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary font-bold text-xs text-primary-foreground">
                {idx + 1}
              </span>
              <p className="text-sm font-medium">{s}</p>
            </div>
          ))
        )}
      </div>

      {/* Available sentences */}
      <div className="w-full space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sentences to arrange:</p>
        {sentences.map((sentence, idx) => {
          const isSelected = currentPicked.includes(sentence);
          return (
            <button
              key={idx}
              disabled={locked}
              onClick={() => handlePick(sentence)}
              className={cn(
                "btn-press w-full rounded-2xl border-2 p-4 text-left font-display text-base font-bold transition-all",
                isSelected
                  ? "border-primary/30 bg-primary/10 text-muted-foreground opacity-40"
                  : "border-border bg-card hover:border-primary text-foreground",
              )}
            >
              {sentence}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GrammarFixView({
  sentenceWithMistake,
  correctSentence: _correctSentence,
  explanation: _explanation,
  options,
  answer,
  setAnswer,
  locked,
}: {
  sentenceWithMistake: string;
  correctSentence: string;
  explanation: string;
  options: string[];
  answer: string;
  setAnswer: (a: string) => void;
  locked: boolean;
}) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="w-full rounded-2xl border-2 border-accent/40 bg-accent/5 p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-deep">Incorrect Sentence</p>
        <p className="mt-2 font-display text-2xl font-extrabold text-foreground underline decoration-wavy decoration-accent">
          &ldquo;{sentenceWithMistake}&rdquo;
        </p>
      </div>

      <p className="text-center font-display text-xl font-bold">
        Choose the version with proper grammar, punctuation, and capitalization:
      </p>

      <div className="w-full space-y-3">
        {options.map((option, idx) => (
          <button
            key={idx}
            disabled={locked}
            onClick={() => setAnswer(option)}
            className={cn(
              "btn-press w-full rounded-2xl border-2 p-4 text-left font-display text-lg font-bold transition-all",
              answer === option
                ? "border-primary bg-primary/10 text-primary-deep"
                : "border-border bg-card hover:border-muted-foreground",
            )}
          >
            <span className="mr-3 inline-grid h-7 w-7 place-items-center rounded-full bg-muted text-xs font-bold">
              {idx + 1}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ExerciseView({ ex, answer, setAnswer, locked }: ExProps) {
  switch (ex.type) {
    case "listen-select":
      return (
        <div className="flex flex-col items-center gap-8">
          <PlayButton big onClick={() => say(ex.word)} />
          <Choices options={ex.options} answer={answer} setAnswer={setAnswer} locked={locked} />
        </div>
      );

    case "beginning-sound":
      return (
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <PlayButton onClick={() => say(ex.word)} />
            <span className="font-display text-6xl font-extrabold">
              <span className="text-muted-foreground/40">_</span>
              {ex.word.slice(ex.answer.length)}
            </span>
          </div>
          <Choices big options={ex.options} answer={answer} setAnswer={setAnswer} locked={locked} />
        </div>
      );

    case "missing-letter":
      return (
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <PlayButton onClick={() => say(ex.full)} />
            <span className="font-display text-6xl font-extrabold tracking-widest">
              {ex.pattern.split("_")[0]}
              <span className="mx-1 inline-block min-w-12 border-b-4 border-primary text-center text-primary-deep">
                {answer || " "}
              </span>
              {ex.pattern.split("_")[1]}
            </span>
          </div>
          <Choices big options={ex.options} answer={answer} setAnswer={setAnswer} locked={locked} />
        </div>
      );

    case "build-word": {
      return (
        <div className="flex flex-col items-center gap-6">
          <PlayButton onClick={() => say(ex.word)} />
          <Tiles pieces={ex.tiles} seed={ex.word} joiner="" answer={answer} setAnswer={setAnswer} locked={locked} />
        </div>
      );
    }

    case "arrange": {
      const words = ex.sentence.split(" ");
      return (
        <div className="flex flex-col items-center gap-6">
          <PlayButton onClick={() => say(ex.sentence)} />
          <Tiles pieces={words} seed={ex.sentence} joiner=" " answer={answer} setAnswer={setAnswer} locked={locked} />
        </div>
      );
    }

    case "read-aloud":
      return <ReadAloud sentence={ex.sentence} setAnswer={setAnswer} locked={locked} />;

    case "match-definition":
      return (
        <MatchDefinition
          word={ex.word}
          definition={ex.definition}
          options={ex.options}
          answer={answer}
          setAnswer={setAnswer}
          locked={locked}
        />
      );

    case "fill-blank":
      return (
        <FillBlank
          sentence={ex.sentence}
          blank={ex.blank}
          options={ex.options}
          answer={answer}
          setAnswer={setAnswer}
          locked={locked}
        />
      );

    case "poem-rhyme":
      return (
        <PoemRhymeView
          title={ex.title}
          stanzas={ex.stanzas}
          question={ex.question}
          options={ex.options}
          answer={answer}
          setAnswer={setAnswer}
          locked={locked}
        />
      );

    case "paragraph-order":
      return (
        <ParagraphOrderView
          title={ex.title}
          sentences={ex.sentences}
          solution={ex.solution}
          answer={answer}
          setAnswer={setAnswer}
          locked={locked}
        />
      );

    case "grammar-fix":
      return (
        <GrammarFixView
          sentenceWithMistake={ex.sentenceWithMistake}
          correctSentence={ex.correctSentence}
          explanation={ex.explanation}
          options={ex.options}
          answer={answer}
          setAnswer={setAnswer}
          locked={locked}
        />
      );
  }
}
