// Browser speech helpers.
export function say(text: string, rate = 0.85) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  // Pick an English voice or language
  u.lang = "en-US";
  u.rate = rate;
  u.pitch = 1.05;
  window.speechSynthesis.speak(u);
  return true;
}

export type Rec = {
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
};

export function getRecognizer(): Rec | null {
  if (typeof window === "undefined") return null;
  const C = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!C) return null;
  try {
    const r: Rec = new C();
    // Default to en-US or user's English locale
    const navLang = typeof navigator !== "undefined" ? navigator.language : "en-US";
    r.lang = navLang.startsWith("en") ? navLang : "en-US";
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 3;
    return r;
  } catch {
    return null;
  }
}

// Common British / American spelling normalizations for kids' phonics
const SPELLING_MAP: Record<string, string> = {
  colour: "color",
  favourite: "favorite",
  flavour: "flavor",
  neighbour: "neighbor",
  practise: "practice",
  theatre: "theater",
  grey: "gray",
};

const cleanWord = (w: string) => {
  const c = w.toLowerCase().replace(/[^a-z0-9]/g, "");
  return SPELLING_MAP[c] || c;
};

// Simple Levenshtein distance for near-matches (e.g. minor accent variations)
function editDist(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isWordMatch(target: string, heard: string): boolean {
  const t = cleanWord(target);
  const h = cleanWord(heard);
  if (!t || !h) return false;
  if (t === h) return true;
  // If word is 5+ characters, allow 1 typo / sound variation
  if (t.length >= 5 && editDist(t, h) <= 1) return true;
  return false;
}

export type WordResult = {
  word: string;
  original: string;
  cleaned: string;
  ok: boolean;
};

export type SpeechComparison = {
  words: WordResult[];
  score: number;
  heardText: string;
  correctWords: string[];
  missedWords: string[];
  extraWords: string[];
};

/**
 * Word-level match between target phrase and heard speech.
 * Returns detailed diagnostics on which words were correct and which were missed.
 */
export function compareSpeech(target: string, heard: string): SpeechComparison {
  const targetTokens = target.split(/\s+/).filter(Boolean);
  const heardTokens = heard.split(/\s+/).filter(Boolean);
  const cleanHeard = heardTokens.map(cleanWord).filter(Boolean);

  // Track which heard words have already been matched
  const usedHeardIndices = new Set<number>();

  const words: WordResult[] = targetTokens.map((original) => {
    const cleaned = cleanWord(original);
    // Find matching heard word
    let matchedIndex = -1;
    for (let i = 0; i < cleanHeard.length; i++) {
      if (!usedHeardIndices.has(i) && isWordMatch(cleaned, cleanHeard[i])) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex !== -1) {
      usedHeardIndices.add(matchedIndex);
      return { word: original, original, cleaned, ok: true };
    }
    return { word: original, original, cleaned, ok: false };
  });

  const correctWords = words.filter((w) => w.ok).map((w) => w.original);
  const missedWords = words.filter((w) => !w.ok).map((w) => w.original);
  const extraWords = heardTokens.filter((_, i) => !usedHeardIndices.has(i));

  const totalWords = words.length;
  const score = totalWords > 0 ? Math.round((correctWords.length / totalWords) * 100) : 0;

  return {
    words,
    score,
    heardText: heard.trim(),
    correctWords,
    missedWords,
    extraWords,
  };
}
