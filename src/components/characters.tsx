import pip from "@/assets/pip.png";
import miloLogo from "@/assets/lingosprout-logo.png";
import tara from "@/assets/tara.png";
import type { CharacterId } from "@/data/curriculum";
import { cn } from "@/lib/utils";

export { miloLogo };

// Character colour palettes (bg + text) for cards
export const CHARACTER_COLORS: Record<CharacterId, { bg: string; text: string }> = {
  pip: { bg: "bg-sky", text: "text-primary-deep" },
  milo: { bg: "bg-peach", text: "text-accent-deep" },
  tara: { bg: "bg-mint", text: "text-secondary-deep" },
  bibi: { bg: "bg-lavender", text: "text-primary-deep" },
  kiko: { bg: "bg-mint", text: "text-secondary-deep" },
  nova: { bg: "bg-sun/50", text: "text-sun-deep" },
};

export const CHARACTERS: Record<CharacterId, { name: string; role: string; img: string | null; emoji: string }> = {
  pip: { name: "Pip the Firefly", role: "Your curious learning guide", img: pip, emoji: "✨" },
  milo: { name: "Milo the Fox", role: "Vocabulary & official learning guide", img: miloLogo, emoji: "🦊" },
  tara: { name: "Tara the Turtle", role: "Patient speaking coach", img: tara, emoji: "🐢" },
  bibi: { name: "Bibi the Cloud", role: "Stories & imagination", img: null, emoji: "☁️" },
  kiko: { name: "Kiko the Chameleon", role: "Grammar & sentence builder", img: null, emoji: "🦎" },
  nova: { name: "Nova the Astronaut", role: "Challenges & achievements", img: null, emoji: "🚀" },
};

// SVG fallback illustrations for characters without PNG assets
function PipFallback({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="55" r="28" fill="#fbbf24" />
      <ellipse cx="50" cy="40" rx="14" ry="18" fill="#fbbf24" />
      <circle cx="44" cy="37" r="4" fill="#1e293b" />
      <circle cx="56" cy="37" r="4" fill="#1e293b" />
      <circle cx="45" cy="36" r="1.5" fill="white" />
      <circle cx="57" cy="36" r="1.5" fill="white" />
      <path d="M44 44 Q50 48 56 44" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="26" cy="42" rx="8" ry="5" fill="#fde68a" transform="rotate(-30 26 42)" opacity="0.8" />
      <ellipse cx="74" cy="42" rx="8" ry="5" fill="#fde68a" transform="rotate(30 74 42)" opacity="0.8" />
      <circle cx="50" cy="35" r="3" fill="#fcd34d" opacity="0.6" />
    </svg>
  );
}

function BibiFallback({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <ellipse cx="50" cy="60" rx="35" ry="22" fill="#e0e7ff" />
      <circle cx="38" cy="52" r="18" fill="#c7d2fe" />
      <circle cx="62" cy="52" r="18" fill="#c7d2fe" />
      <circle cx="50" cy="46" r="20" fill="#e0e7ff" />
      <circle cx="44" cy="44" r="3.5" fill="#1e293b" />
      <circle cx="56" cy="44" r="3.5" fill="#1e293b" />
      <circle cx="45" cy="43" r="1.5" fill="white" />
      <circle cx="57" cy="43" r="1.5" fill="white" />
      <path d="M44 50 Q50 55 56 50" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="70" cy="35" r="4" fill="#a5b4fc" />
      <circle cx="78" cy="28" r="3" fill="#818cf8" />
      <circle cx="66" cy="26" r="2" fill="#c7d2fe" />
    </svg>
  );
}

function KikoFallback({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <ellipse cx="50" cy="58" rx="22" ry="20" fill="#6ee7b7" />
      <circle cx="50" cy="40" r="18" fill="#34d399" />
      <circle cx="44" cy="37" r="4" fill="#1e293b" />
      <circle cx="56" cy="37" r="4" fill="#1e293b" />
      <circle cx="45" cy="36" r="1.5" fill="white" />
      <circle cx="57" cy="36" r="1.5" fill="white" />
      <path d="M44 44 Q50 49 56 44" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="30" cy="48" rx="6" ry="3" fill="#10b981" transform="rotate(-20 30 48)" />
      <ellipse cx="70" cy="48" rx="6" ry="3" fill="#10b981" transform="rotate(20 70 48)" />
      <circle cx="47" cy="35" r="2" fill="#6ee7b7" opacity="0.5" />
      <circle cx="53" cy="33" r="1.5" fill="#6ee7b7" opacity="0.5" />
      <circle cx="58" cy="36" r="1" fill="#6ee7b7" opacity="0.4" />
    </svg>
  );
}

function NovaFallback({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {/* Helmet */}
      <circle cx="50" cy="38" r="24" fill="#e2e8f0" />
      <circle cx="50" cy="38" r="20" fill="#bae6fd" />
      {/* Face */}
      <circle cx="44" cy="36" r="3.5" fill="#1e293b" />
      <circle cx="56" cy="36" r="3.5" fill="#1e293b" />
      <circle cx="45" cy="35" r="1.5" fill="white" />
      <circle cx="57" cy="35" r="1.5" fill="white" />
      <path d="M44 42 Q50 47 56 42" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Suit */}
      <rect x="34" y="60" width="32" height="28" rx="8" fill="#60a5fa" />
      <rect x="42" y="62" width="16" height="10" rx="4" fill="#93c5fd" />
      {/* Stars */}
      <text x="72" y="28" fontSize="10" fill="#fbbf24">★</text>
      <text x="20" y="25" fontSize="8" fill="#fbbf24">★</text>
    </svg>
  );
}

const FALLBACKS: Partial<Record<CharacterId, (props: { className?: string }) => JSX.Element>> = {
  bibi: BibiFallback,
  kiko: KikoFallback,
  nova: NovaFallback,
  pip: PipFallback,
};

export function Character({ id, className, bob, eager }: { id: CharacterId; className?: string; bob?: boolean; eager?: boolean }) {
  const c = CHARACTERS[id];
  const Fallback = FALLBACKS[id];

  if (!c.img && Fallback) {
    return <Fallback className={cn("select-none drop-shadow-sm", bob && "animate-bob", className)} />;
  }

  if (c.img) {
    return (
      <img
        src={c.img}
        alt={c.name}
        width={816}
        height={816}
        loading={eager ? "eager" : "lazy"}
        className={cn("select-none object-contain drop-shadow-sm", bob && "animate-bob", className)}
      />
    );
  }

  // Emoji fallback as last resort
  return (
    <span
      className={cn("flex items-center justify-center text-5xl select-none", className)}
      role="img"
      aria-label={c.name}
    >
      {c.emoji}
    </span>
  );
}

export function SpeechBubble({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative rounded-2xl border-2 border-border bg-card px-4 py-3 font-semibold", className)}>
      {children}
      <span className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b-2 border-r-2 border-border bg-card" />
    </div>
  );
}
