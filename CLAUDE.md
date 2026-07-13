# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (also runs the TypeScript check)
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- `npx tsc --noEmit` — type-check only
- No test runner is configured — this project intentionally has no automated tests (see prd.md §8; verify
  changes by running the dev server and clicking through the flow).

This project uses **Next.js 16** (App Router), which differs from Next.js versions in general training
data — notably `params`/`searchParams` on page components are `Promise`s that must be awaited (Server
Components) or unwrapped with React's `use()` (Client Components). Check
`node_modules/next/dist/docs/` for current API behavior before assuming older Next.js conventions.

### Environment variables

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`) — the ranking
feature reads/writes a Supabase Postgres table and won't work without them. Put real values in
`.env.local` (gitignored); when deploying, set the same two vars in the Vercel project settings.

## What this project is

A Portuguese (pt-BR) educational quiz about Claude Code (the Anthropic CLI), built as a portfolio/learning
project. True/false questions only, three difficulty levels. The quiz itself is fully client-side and
static (no auth, no timer, questions bundled as JSON); the ranking/leaderboard is the one part that talks
to a real backend (Supabase). Full requirements live in `prd.md` (kept up to date with this deviation from
the original "no backend" scope — see prd.md §4/§6).

## Architecture

- **`src/types/quiz.ts`** — `Level`, `Category`, `Question` types and the `LEVELS`/`LEVEL_LABELS`/`isLevel`
  helpers shared across the app.
- **`src/data/questions.json`** — the full question bank (30 questions, ~10 per level), each with
  `{ id, level, category, statement, answer, explanation }`. Content is data, not code — edit this file to
  add/change questions, no logic changes needed. `src/lib/questions.ts` filters by level and shuffles
  (Fisher-Yates) using `Math.random()`.
- **`src/lib/supabaseClient.ts`** — singleton Supabase client (anon key, browser-side, no API routes).
- **`src/lib/ranking.ts`** — ranking backed by a Supabase table `rankings` (see schema below):
  `saveRankingEntry` (async insert) and `getRankingByLevel` (async select). `useRankingByLevel(level)` is a
  plain `useState`/`useEffect` hook returning `{ entries, loading, error }` — no external-store trickery
  needed here (unlike the old localStorage version) because Supabase is the single source of truth and
  every mount/level-change just re-fetches. The fetch itself lives in an inner `async function` called from
  the effect rather than inline — calling `setState` directly in an effect's top-level body trips this
  repo's `react-hooks/set-state-in-effect` ESLint rule; wrapping it in a nested function avoids that.
  - **`rankings` table schema** (Postgres, RLS enabled, `anon` role allowed `insert`/`select` only):
    `id bigint identity pk, nickname text, level text check(...), score int, total int, percentage int,
    played_at timestamptz default now()`. The app's `RankingEntry.date` field maps to the DB's `played_at`
    column (renamed in the DB to dodge any ambiguity with Postgres's `date` type; the app-facing TS
    interface keeps the original `date` name so nothing else in the codebase had to change).
- **`src/hooks/useQuiz.ts`** — the quiz's `useReducer` state machine (`loading` → `playing` → `finished`).
  Question shuffling happens in a `useEffect` on mount, *not* during the initial render — because
  `Math.random()` executes during SSR too, loading the shuffled list synchronously in the render body would
  make the server-rendered question order diverge from the client's, causing a hydration mismatch (React
  would discard and re-render the whole tree). The `loading` status exists specifically to give server and
  first client render an identical, empty starting point.
- **Routes** (`src/app/`): `/` (level picker), `/quiz/[nivel]` (client component; the end-of-game result
  screen — score, nickname input, save — is a state inside this same page, not a separate route, per
  prd.md §7.4), `/ranking` (level-filtered leaderboard, now reading from Supabase).
- **`src/app/error.tsx`** — App Router error boundary (catches unhandled render errors, e.g. a Supabase
  client crash), with a retry button and a link home.
- **`src/components/`** — presentational pieces (`LevelCard`, `ProgressBar`, `QuestionCard`,
  `AnswerButtons`, `FeedbackPanel`, `ResultSummary`, `NicknameForm`, `RankingList`), all plain props-in, no
  business state of their own. `NicknameForm` takes `saving`/`error` props from its parent (`quiz/[nivel]`)
  since saving is now a network call that can fail or take time — the form itself doesn't touch Supabase.

## Constraints worth knowing before changing things

- **No auth, no timer, no multiple choice, no consolidated end-of-game review screen, no social sharing,
  no online/global ranking beyond the per-level leaderboard.** These are deliberate scope cuts (prd.md
  §6), not gaps to fill in. Backend-for-ranking is now in scope (Supabase) — that's the one exception to
  "no backend"; don't read that as an invitation to add API routes or server actions elsewhere.
- Tailwind v4, CSS-first config: there is no `tailwind.config.js` — theme tokens (colors: `primary`,
  `primary-dark`, `primary-light`, `cream`, `cream-dark`, `success`, `error`, plus `-light` variants) are
  declared via `@theme` in `src/app/globals.css`.
- UI strings and question statements are pt-BR; official Claude Code product terms stay in English (hooks,
  subagents, MCP, skills, slash commands like `/compact`).
- Any code touching `window`/`localStorage` must guard for SSR (`typeof window === "undefined"`) since
  pages are still server-rendered once even though they're `"use client"`. (No longer relevant to the
  ranking code specifically now that it's Supabase-backed, but still applies to anything else client-only.)
