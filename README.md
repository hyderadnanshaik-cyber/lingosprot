# LingoSprout — English Learning Platform for Children

A child-friendly, gamified English learning web application built with React 19 + TanStack Start.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Start development server
npm run dev
```

The app will be available at **http://localhost:3000**

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run test` | Run unit tests (vitest) |

## Project Structure

```
src/
├── routes/           # File-based routes (TanStack Router)
│   ├── __root.tsx    # Root HTML shell + QueryClient
│   ├── index.tsx     # Landing page (/)
│   ├── app.tsx       # App shell with sidebar (/app)
│   ├── app.index.tsx # Child dashboard (/app/)
│   ├── app.learn.tsx # Learning map (/app/learn)
│   ├── app.lesson.$lessonId.tsx  # Lesson player
│   └── app.speak.tsx # Speaking studio (/app/speak)
├── components/
│   ├── characters.tsx      # Pip, Milo, Tara + SpeechBubble
│   ├── learning-path.tsx   # FullPath + MiniPath
│   ├── ui-kit.tsx          # ChunkyButton, DemoBadge
│   └── lesson/exercises.tsx # All 6+ exercise types
├── data/
│   └── curriculum.ts   # Lesson & exercise content
├── lib/
│   ├── learner-store.ts # Client-side state (localStorage)
│   ├── speech.ts        # TTS + speech recognition helpers
│   └── utils.ts         # cn() tailwind merge
├── assets/              # Images (hero, characters)
└── styles.css           # Tailwind v4 + custom design tokens
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. See [`.env.example`](.env.example) for details.

External services are **optional** — the app runs in demo mode without them.

## Tech Stack

- **Framework**: TanStack Start (React 19 SSR)
- **Routing**: TanStack Router (file-based, fully typed)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Fonts**: Baloo 2 (display) + Nunito (body) via Google Fonts
- **State**: `useSyncExternalStore` + localStorage (demo)
- **Speech**: Web Speech API (TTS + recognition)
- **Testing**: Vitest + Testing Library

## Characters

| Character | Role |
|---|---|
| Pip the Firefly | Sounds & phonics guide |
| Milo the Fox | Vocabulary & word discovery |
| Tara the Turtle | Patient speaking coach |
| Bibi the Cloud | Stories & imagination |
| Kiko the Chameleon | Grammar & sentences |
| Nova the Astronaut | Challenges & achievements |

## Learning Levels

1. Sound Explorer — alphabet and foundational sounds
2. Phonics Builder — blending and digraphs
3. Word Weaver — vocabulary and sentences
4. Reading Adventurer — guided reading (coming soon)
5. Grammar Garden — nouns, verbs, sentences (coming soon)
6. Spelling Studio — dictation and word formation (coming soon)
7. Speaking Studio — pronunciation practice (coming soon)
8. Story Explorer — interactive stories (coming soon)
9. Confident Communicator — conversation (coming soon)

## Demo Mode

The app runs fully without any external services:
- Progress is saved in `localStorage`
- Speech uses the browser's built-in Web Speech API
- No AI companion in demo mode
- All recordings stay in the browser and are discarded on page leave

## Contributing

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for system design details and [`TESTING.md`](TESTING.md) for testing guidance.
