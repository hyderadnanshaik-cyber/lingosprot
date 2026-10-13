# PROJECT_AUDIT.md — LingoSprout Codebase Audit

> Audited: October 2026 | Framework: TanStack Start + React 19 + Vite + Tailwind CSS v4

---

## 1. What Already Exists

### Stack
| Layer | Technology |
|---|---|
| Framework | TanStack Start 1.168 (React 19, SSR-capable) |
| Routing | TanStack Router (file-based, typed) |
| Styling | Tailwind CSS v4 + tw-animate-css |
| Component lib | shadcn/ui (full set installed) |
| State | `useSyncExternalStore` + localStorage (demo mode) |
| Forms | react-hook-form + zod |
| Charts | recharts |
| Build tool | Vite 8 |
| Package manager | bun (lock file) / npm (also works) |

### Existing Routes
| Route | File | Status |
|---|---|---|
| `/` | `src/routes/index.tsx` | ✅ Landing page — good foundation |
| `/app` | `src/routes/app.tsx` | ✅ App shell + sidebar + mobile nav |
| `/app/` | `src/routes/app.index.tsx` | ✅ Child dashboard |
| `/app/learn` | `src/routes/app.learn.tsx` | ✅ Full learning map |
| `/app/lesson/:id` | `src/routes/app.lesson.$lessonId.tsx` | ✅ Lesson player |
| `/app/speak` | `src/routes/app.speak.tsx` | ✅ Speaking studio |

### Existing Components
- `characters.tsx` — Pip, Milo, Tara with `<Character>` and `<SpeechBubble>`
- `learning-path.tsx` — `<FullPath>` and `<MiniPath>` with lesson node states
- `lesson/exercises.tsx` — 6 exercise types fully implemented
- `ui-kit.tsx` — `chunky` CVA button, `DemoBadge`
- Full shadcn/ui component library

### Existing Data & Logic
- `data/curriculum.ts` — 3 levels with 7 lessons and typed exercise schema
- `lib/learner-store.ts` — localStorage state, XP, streaks, lesson completion
- `lib/speech.ts` — `say()` TTS, `getRecognizer()`, `compareSpeech()`

### Assets
- `hero-meadow.jpg`, `pip.png`, `milo.png`, `tara.png`

### Design System
- Warm color palette: primary (teal), secondary (green), accent (orange), sun (yellow)
- Custom fonts: Baloo 2 (display) + Nunito (body)
- Custom animations: bob, shake, pop-in, confetti, pulse-ring
- `btn-press` utility for 3D button press feel

---

## 2. What Works Correctly

- ✅ Landing page with hero, character showcase, feature zigzag, FAQ
- ✅ App shell with responsive sidebar (desktop) + bottom nav (mobile)
- ✅ Child dashboard with daily goal, XP, streak, mini path
- ✅ Full learning map with level bands and lesson nodes
- ✅ Lesson player — all 6 exercise types functional
- ✅ Progress bar, answer checking, hints, retry
- ✅ Lesson completion with XP award and confetti screen
- ✅ Speaking studio — MediaRecorder + SpeechRecognition + playback
- ✅ Honest labeling (demo mode badges, browser speech caveats)
- ✅ Keyboard navigation (number keys for choices, Enter to confirm)
- ✅ Locked/current/done/open node states respected

---

## 3. What Is Partially Implemented

- ⚠️ **Learner name** — hardcoded as "Aarav", no profile creation
- ⚠️ **Only 3 characters** — Pip, Milo, Tara (Bibi, Kiko, Nova missing)
- ⚠️ **7 lessons total** — Levels 4 & 5 have `lessons: []` (placeholder)
- ⚠️ **Speaking score** — word-match only, no real phoneme assessment
- ⚠️ **Streak** — initialised at 3, never resets or increments on real days
- ⚠️ **Daily goal** — static 30 XP, no date tracking
- ⚠️ **No auth** — no login, register, or parent accounts
- ⚠️ **No parent dashboard** — no progress reports
- ⚠️ **No stories** — Story Explorer level planned but empty
- ⚠️ **No admin CMS** — content is hardcoded TypeScript

---

## 4. What Is Missing

- ❌ Parent authentication (Firebase Auth)
- ❌ Parent onboarding & child profile creation
- ❌ Multiple child profiles
- ❌ Real database (MongoDB Atlas / Firestore)
- ❌ Backend API layer
- ❌ Parent dashboard with reports
- ❌ Story Explorer / reading mode
- ❌ AI conversation companion
- ❌ Gamification badges & achievements
- ❌ Weekly quests / challenges
- ❌ Spelling Studio exercises (dictation, word formation)
- ❌ Grammar Garden exercises (nouns, verbs)
- ❌ Vocabulary review (spaced repetition)
- ❌ PWA manifest / service worker
- ❌ Protected routes (all pages accessible without auth)
- ❌ `.env.example`
- ❌ README with setup instructions
- ❌ ARCHITECTURE.md, TESTING.md

---

## 5. What Is Broken

- ⚠️ `CharacterId` type only includes `"pip" | "milo" | "tara"` — adding new characters requires type update
- ⚠️ Locked lesson nodes are still navigable (only `aria-disabled`, not `pointer-events-none` on link itself)
- ⚠️ `lessonStatus` off-by-one: two lessons can be simultaneously "open" when certain combos are completed
- ⚠️ `confetti` CSS keyframe defined in styles.css but not in Tailwind utility class (works as inline animation string)
- ⚠️ `bun.lock` present but Bun is not installed on this machine — npm works fine

---

## 6. What Should Be Retained

- ✅ Entire design system (colors, fonts, animations, button styles)
- ✅ All existing routes and components
- ✅ curriculum.ts type schema (extend, don't replace)
- ✅ learner-store.ts pattern (add to it)
- ✅ speech.ts helpers
- ✅ All character assets

---

## 7. What Should Be Refactored

- `CharacterId` → add Bibi, Kiko, Nova
- `lessonStatus()` → fix open/locked logic
- `LearnerState` → add name field as editable, add profile support
- Locked node links → block navigation properly
- Lesson completion → prevent double XP awards
- Streak → add last-active date tracking

---

## 8. Dependencies & Integrations Needed

| Service | Purpose | Variables |
|---|---|---|
| Firebase Auth | Parent login | `VITE_FIREBASE_*` |
| Firebase Firestore | User data persistence | (same project) |
| OpenAI / Gemini API | AI companion | `VITE_AI_KEY` (server-side only!) |
| Azure / Google STT | Pronunciation assessment | `VITE_SPEECH_KEY` |

---

## 9. Recommended Implementation Sequence

1. Fix bugs (locked nodes, lesson status logic)
2. Expand curriculum (more lessons, new exercise types)
3. Add parent auth screens (login/register) with demo fallback
4. Child profile creation and name personalisation
5. Expand learning path (Levels 4–9, more characters)
6. Story Explorer (Level 4)
7. Parent dashboard (reports from localStorage initially)
8. Badges and achievements
9. Backend + Firebase integration
10. PWA manifest
11. AI companion (server-side)
