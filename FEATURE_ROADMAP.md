# FEATURE_ROADMAP.md — LingoSprout Implementation Plan

> Status legend: ✅ Done | 🔄 In Progress | ⬜ Planned | 🔒 Blocked (dependency)

---

## Milestone 1 — Repository Audit & Local Setup

| # | Feature | Status | Notes |
|---|---|---|---|
| 1.1 | Project inspection & audit | ✅ | `PROJECT_AUDIT.md` written |
| 1.2 | Install dependencies | ✅ | `npm install` |
| 1.3 | Fix locked lesson navigation | ✅ | Proper pointer-events-none |
| 1.4 | Fix lesson status logic | ✅ | |
| 1.5 | Dev server running | ✅ | `npm run dev` |
| 1.6 | README.md | ✅ | |
| 1.7 | .env.example | ✅ | |
| 1.8 | ARCHITECTURE.md | ✅ | |
| 1.9 | TESTING.md | ✅ | |

---

## Milestone 2 — Core Visual Experience & Expanded Content

| # | Feature | Status | Notes |
|---|---|---|---|
| 2.1 | Add Bibi, Kiko, Nova characters | 🔄 | SVG inline characters |
| 2.2 | Expand curriculum (3→9 levels) | 🔄 | New exercise types |
| 2.3 | Spelling Studio exercises | 🔄 | |
| 2.4 | Grammar Garden exercises | 🔄 | |
| 2.5 | Story Explorer (Level 4) | 🔄 | |
| 2.6 | Word Weaver vocabulary | 🔄 | match-word exercise type |
| 2.7 | Speaking Studio improvements | 🔄 | |
| 2.8 | Landing page — hero images | ⬜ | |
| 2.9 | 404 page with character | ⬜ | |

---

## Milestone 3 — Parent Auth & Child Profiles

| # | Feature | Status | Notes |
|---|---|---|---|
| 3.1 | Auth screens (login/register) | 🔄 | Demo fallback until Firebase |
| 3.2 | Onboarding flow | 🔄 | Name, age, goal |
| 3.3 | Child profile creation | 🔄 | |
| 3.4 | Multiple child profiles | ⬜ | |
| 3.5 | Protected routes | ⬜ | |
| 3.6 | Firebase Auth integration | 🔒 | Needs `VITE_FIREBASE_*` |
| 3.7 | Firestore data persistence | 🔒 | Needs Firebase project |
| 3.8 | Avatar selection | ⬜ | |

---

## Milestone 4 — Learning Engine

| # | Feature | Status | Notes |
|---|---|---|---|
| 4.1 | 6 exercise types working | ✅ | Already built |
| 4.2 | match-word-picture exercise | ⬜ | New type |
| 4.3 | Proper lock/unlock logic | 🔄 | |
| 4.4 | Lesson completion anti-exploit | ⬜ | Prevent double XP |
| 4.5 | Lesson intro screen | ⬜ | |
| 4.6 | Adaptive difficulty hints | ⬜ | |

---

## Milestone 5 — Rewards, Streaks & Achievements

| # | Feature | Status | Notes |
|---|---|---|---|
| 5.1 | XP system | ✅ | Working |
| 5.2 | Real streak tracking (by date) | 🔄 | |
| 5.3 | Daily goal with date reset | 🔄 | |
| 5.4 | Achievement badges system | 🔄 | |
| 5.5 | Badge unlock animations | ⬜ | |
| 5.6 | Level-up celebration | ⬜ | |
| 5.7 | Weekly quests | ⬜ | |

---

## Milestone 6 — Speaking Studio

| # | Feature | Status | Notes |
|---|---|---|---|
| 6.1 | MediaRecorder + playback | ✅ | Working |
| 6.2 | Browser speech recognition | ✅ | Working with caveats |
| 6.3 | All recording states handled | ✅ | |
| 6.4 | More practice phrases (50+) | 🔄 | |
| 6.5 | Category-based phrase sets | ⬜ | |
| 6.6 | Azure Pronunciation Assessment | 🔒 | Needs API key |

---

## Milestone 7 — Parent Dashboard

| # | Feature | Status | Notes |
|---|---|---|---|
| 7.1 | Parent dashboard route | 🔄 | |
| 7.2 | Progress overview | 🔄 | |
| 7.3 | Skills breakdown chart | ⬜ | Uses recharts |
| 7.4 | Lesson history log | ⬜ | |
| 7.5 | XP over time chart | ⬜ | |
| 7.6 | Downloadable report | ⬜ | |

---

## Milestone 8 — AI Companion

| # | Feature | Status | Notes |
|---|---|---|---|
| 8.1 | Demo conversation mode | 🔄 | Deterministic scripts |
| 8.2 | OpenAI/Gemini API integration | 🔒 | Needs server + API key |
| 8.3 | Safety filters | 🔒 | Server-side |
| 8.4 | Conversation modes (10+) | ⬜ | |

---

## Milestone 9 — Backend & Database

| # | Feature | Status | Notes |
|---|---|---|---|
| 9.1 | Firebase Auth | 🔒 | |
| 9.2 | Firestore schema | 🔒 | |
| 9.3 | Server-side API (TanStack Start) | 🔒 | |
| 9.4 | Authorization rules | 🔒 | |

---

## Milestone 10 — PWA, Accessibility & QA

| # | Feature | Status | Notes |
|---|---|---|---|
| 10.1 | Web app manifest | ⬜ | |
| 10.2 | Service worker | ⬜ | |
| 10.3 | Offline shell | ⬜ | |
| 10.4 | Reduced motion support | ⬜ | |
| 10.5 | Aria labels audit | ⬜ | |
| 10.6 | Keyboard nav audit | ⬜ | |
| 10.7 | Mobile responsiveness check | ⬜ | |

---

## Milestone 11 — Deployment Readiness

| # | Feature | Status | Notes |
|---|---|---|---|
| 11.1 | .env.example complete | ✅ | |
| 11.2 | README with commands | ✅ | |
| 11.3 | Production build test | ⬜ | |
| 11.4 | Vercel configuration | ⬜ | |
| 11.5 | Known limitations documented | ⬜ | |

---

## Exercise Type Registry

| Type | Implemented | Route |
|---|---|---|
| `listen-select` | ✅ | Lesson player |
| `beginning-sound` | ✅ | Lesson player |
| `build-word` | ✅ | Lesson player |
| `missing-letter` | ✅ | Lesson player |
| `arrange` | ✅ | Lesson player |
| `read-aloud` | ✅ | Lesson + Speaking |
| `match-picture` | ⬜ | Planned |
| `match-definition` | ⬜ | Planned |
| `fill-blank` | ⬜ | Planned |
| `spelling-dictation` | ⬜ | Planned |
| `story-comprehension` | ⬜ | Planned |
