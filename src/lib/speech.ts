// Browser speech helpers. Replace with a voice provider via a server endpoint later.
export function say(text: string, rate = 0.85) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = rate;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
  return true;
}

type Rec = { start(): void; stop(): void; abort(): void; onresult: ((e: any) => void) | null; onerror: ((e: any) => void) | null; onend: (() => void) | null; lang: string; interimResults: boolean };
export function getRecognizer(): Rec | null {
  if (typeof window === "undefined") return null;
  const C = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!C) return null;
  const r: Rec = new C();
  r.lang = "en-GB";
  r.interimResults = false;
  return r;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
/** Word-level match between target and heard text. Returns per-word results and 0-100 score. */
export function compareSpeech(target: string, heard: string) {
  const t = norm(target);
  const h = new Set(norm(heard));
  const words = t.map((w) => ({ word: w, ok: h.has(w) }));
  const score = t.length ? Math.round((words.filter((w) => w.ok).length / t.length) * 100) : 0;
  return { words, score };
}
