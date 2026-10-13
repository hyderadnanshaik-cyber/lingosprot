# ARCHITECTURE.md — LingoSprout System Architecture

## Overview

LingoSprout is a full-stack web application with a React 19 frontend powered by TanStack Start (SSR-capable). In demo mode it runs entirely client-side using localStorage. In production mode it connects to Firebase Auth, Firestore, and optional AI/speech services via server-side API routes.

---

## Frontend Architecture

```
Browser
  └── TanStack Start (React 19 SSR)
        ├── __root.tsx  → HTML shell, QueryClient, Google Fonts
        ├── index.tsx   → Public landing page
        └── app.tsx     → Protected app shell
              ├── app.index.tsx    → Child dashboard
              ├── app.learn.tsx    → Curriculum map
              ├── app.lesson.$id   → Lesson player
              ├── app.speak.tsx    → Speaking studio
              └── app.parent.tsx   → Parent dashboard (planned)
```

### State Management

| Layer | Technology | Scope |
|---|---|---|
| UI state | React `useState` | Component |
| Learner progress | `useSyncExternalStore` + localStorage | Session/browser |
| Server data | TanStack Query | Async/cached |
| Auth state | Firebase Auth (planned) | Global |

### Component Hierarchy

```
AppShell (sidebar + mobile nav + header)
  └── Route outlet
        ├── Dashboard
        │     ├── MiniPath
        │     └── Shortcuts
        ├── FullPath
        │     └── Node (done/current/open/locked)
        ├── LessonPlayer
        │     ├── Character + SpeechBubble
        │     ├── ExerciseView
        │     │     ├── PlayButton
        │     │     ├── Choices
        │     │     ├── Tiles
        │     │     └── ReadAloud
        │     └── Footer (check/hint/retry/continue)
        └── SpeakingStudio
              └── Waveform + phrase display
```

---

## Data Architecture

### Demo Mode (Current)
All data lives in `localStorage` under the key `lingosprout-demo-learner`. The `learner-store.ts` module wraps it with `useSyncExternalStore` for reactive updates.

### Production Mode (Planned)

```
Firestore
  ├── parents/{uid}
  │     ├── email, displayName, createdAt
  │     └── settings: { dailyGoalMinutes, notifications }
  ├── children/{childId}
  │     ├── parentUid, name, avatarId, level, xp, streak
  │     └── lastActiveDate
  ├── progress/{childId}/lessons/{lessonId}
  │     └── completedAt, score, mistakes, xp
  ├── progress/{childId}/speaking/{sessionId}
  │     └── phrase, score, heardVia, completedAt
  └── achievements/{childId}/{badgeId}
        └── unlockedAt
```

---

## Curriculum Data Model

```typescript
type Exercise =
  | { type: "listen-select"; word: string; options: string[] }
  | { type: "beginning-sound"; word: string; answer: string; options: string[] }
  | { type: "build-word"; word: string; tiles: string[] }
  | { type: "missing-letter"; pattern: string; answer: string; options: string[]; full: string }
  | { type: "arrange"; sentence: string }
  | { type: "read-aloud"; sentence: string }
  | { type: "match-picture"; word: string; imageKey: string; options: string[] }  // planned
  | { type: "spelling-dictation"; word: string }  // planned

type Lesson = {
  id: string; title: string; skill: string;
  character: CharacterId; xp: number;
  exercises: Exercise[];
}

type Level = {
  id: number; name: string; blurb: string;
  tone: "primary" | "secondary" | "accent" | "sun";
  lessons: Lesson[];
}
```

---

## Authentication Flow (Planned)

```
User visits /app/*
  → Check Firebase Auth state
    → Not logged in → redirect to /auth/login
    → Logged in (parent) → show parent dashboard
    → Logged in (child profile selected) → show child app
```

### Auth Provider: Firebase Authentication
- Email + password for parents
- Google Sign-in (optional)
- Child profiles are sub-documents under the parent's Firestore document
- Children never log in directly — parent selects a child profile

---

## Speech Architecture

### Text-to-Speech (TTS)
Uses `window.speechSynthesis` (Web Speech API) — no server required.

```
say(text) → SpeechSynthesisUtterance → browser speaks
```

### Speech Recognition (Demo)
Uses `window.SpeechRecognition` (Web Speech API).
- Produces transcripts, NOT phoneme scores
- Clearly labeled as "browser speech recognition"
- Score = word-match percentage (not pronunciation accuracy)

### Pronunciation Assessment (Future)
Azure Cognitive Services Pronunciation Assessment:
```
Audio blob → POST /api/assess-pronunciation (server)
  → Azure Speech SDK → phoneme-level scores
  → { accuracy, fluency, completeness, words: [...] }
```
Requires: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` (server-side only)

---

## AI Companion Architecture (Planned)

```
Child submits message
  → POST /api/ai-chat (TanStack Start server function)
    → Validate input (length, content)
    → Build age-appropriate system prompt
    → OpenAI GPT-4o-mini / Gemini Flash
    → Safety filter response
    → Return message to child
```

**Keys are never in frontend code.**

In demo mode: deterministic conversation trees are used and clearly labeled.

---

## Security Considerations

| Risk | Mitigation |
|---|---|
| API keys in frontend | Server-only env vars (`process.env.*`, not `VITE_*`) |
| Unauthorized child data access | Firestore security rules: `resource.data.parentUid == request.auth.uid` |
| Client-side auth bypass | All sensitive routes use server-side loader auth checks |
| Double XP exploitation | Lesson completion idempotent: completed set prevents re-award |
| Child privacy | No child email, no public profiles, audio not stored by default |
| XSS | React escapes by default; no `dangerouslySetInnerHTML` |

---

## Deployment

### Development
```bash
npm run dev   # http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```

### Vercel Deployment
The app uses TanStack Start with a Nitro server. Deploy to Vercel with:
```json
{ "framework": "vite" }
```
Or use the `@lovable.dev/vite-tanstack-config` Nitro target (cloudflare by default).

Set all `VITE_*` variables as Vercel environment variables (public frontend config only).
Set all server secrets (Firebase admin SDK, AI keys) as non-prefixed Vercel env vars.
