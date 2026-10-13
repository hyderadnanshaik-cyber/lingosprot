# TESTING.md — LingoSprout Test Strategy & Instructions

## Automated Testing

The project uses **Vitest** with `@testing-library/react`.

### Running Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Functional QA Checklist

### 1. Landing Page (`/`)
- [x] Logo links to `/`
- [x] Header contains "Parent View", "Create Profile" (`/onboarding`), and "Start Learning" (`/app`)
- [x] Hero CTA buttons navigate to `/onboarding` and `/app/learn`
- [x] Stats bar shows 9 Levels, 30+ Lessons, 8 Exercise Types, Speaking Studio
- [x] All 6 companions (Pip, Milo, Tara, Bibi, Kiko, Nova) render with unique styles
- [x] FAQ accordion toggles open/close properly

### 2. Onboarding Flow (`/onboarding`)
- [x] 3-step wizard with active progress indicators
- [x] Step 1: Character introduction & key features overview
- [x] Step 2: Child's name input (persisted to learner store)
- [x] Step 3: Daily XP goal selector (20, 30, 50 XP/day)
- [x] Finishes and redirects directly to `/app`

### 3. Child Dashboard (`/app`)
- [x] Displays personalized greeting with configured child name
- [x] Next recommended lesson card with dynamic character companion
- [x] Daily goal progress bar with real-time percentage
- [x] Real streak counter (day-by-day date tracking)
- [x] Current level indicator with progress to next level
- [x] Scrollable Mini Journey map (first 12 lessons + remaining count)
- [x] Speaking Studio shortcut card
- [x] Unlocked achievement badges and mystery locked badges

### 4. Curriculum & Learning Path (`/app/learn`)
- [x] All 9 curriculum levels displayed with unique tones and themes
- [x] Level progress headers displaying completed / total lesson counts
- [x] Per-level progress bar
- [x] Distinct node states: `done` (check icon), `current` (pulsing animation), `open` (star), `locked` (padlock)
- [x] Locked nodes are strictly unclickable (preventing sequence skip)
- [x] Active character companion appears alongside the current lesson

### 5. Interactive Lesson Engine (`/app/lesson/:lessonId`)
- [x] Lesson progress bar updates as exercises are answered
- [x] Audio synthesis plays for words/sentences
- [x] Dynamic hints provide guidance without giving away answers immediately
- [x] Immediate positive praise banner on correct answers
- [x] Retry & skip options on mistakes (never penalizing or humiliating)
- [x] Lesson completion screen with celebratory confetti, XP earned, accuracy score
- [x] XP is idempotent (cannot repeatedly farm rewards on the same lesson)
- [x] Unlocks subsequent achievements and maintains streaks

### 6. Speaking Studio (`/app/speak`)
- [x] Category selector tabs (Greetings, Animals, Questions, School, Stories, Sentences)
- [x] Previous and next phrase navigation
- [x] Web Speech Synthesis for reference audio
- [x] Microphone permission flow with helpful guidance
- [x] MediaRecorder capturing voice with audio playback button
- [x] SpeechRecognition word comparison with visual highlight for recognized words
- [x] Explicit privacy notice that audio recordings stay strictly on-device

### 7. Parent Dashboard (`/app/parent`)
- [x] Accessible from sidebar, mobile navigation, and top header settings icon
- [x] Overview tab: XP, completed lessons, streak, speaking sessions, full curriculum breakdown
- [x] Skills practiced breakdown (Letter sounds, Blending, Vocabulary, etc.)
- [x] Achievements progress list
- [x] Profile tab: Edit and persist child name
- [x] Settings tab: Daily XP goal selection and reset progress utility
