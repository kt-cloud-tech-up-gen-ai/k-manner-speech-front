# K-Manner Speech — web

The app is connected to the sibling FastAPI service. Runtime catalog, room,
conversation, authentication, onboarding/profile, and member feedback requests
use the real API; fixtures remain for tests, Storybook, and the explicitly
deferred result screen only.

```bash
npm install
npm run dev          # app        — http://localhost:5173
npm run storybook    # components — http://localhost:6006
npm run build
npm run lint
npm test             # Vitest + Testing Library
npm run api:generate # generate TypeScript from the FastAPI OpenAPI document
npm run api:check    # fail when the checked-in generated contract is stale
```

Create `web/.env.local` with `VITE_API_URL=http://localhost:8000`, run the API
migrations and API server first, then start Vite at `http://localhost:5173`.
Authentication uses email/password and server-issued HttpOnly access/refresh
cookies. State-changing requests also send the double-submit CSRF header.

Live E2E keeps local defaults (`http://localhost:8000`,
`http://localhost:5173`, and the sibling `k-manner-speech-api` checkout). CI or
another checkout layout can override them with `E2E_API_URL`, `E2E_WEB_URL`,
and the absolute `E2E_API_ROOT` environment variable. The Playwright servers
and live spec consume the same values.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router v7 · Motion
(Framer) · Zustand.

## Layout model

Every frame in the Figma file is **360 × 768**. The 393 × 852 frames are
wrappers — P08's `App` frame centres a 360 × 768 `Container` on a `#F3F4F6`
page — so 360 × 768 is the canvas, not 393.

`PhoneShell` renders that canvas with the device chrome (44px radius, 1px
`#1E190F @9%` hairline, two-part drop shadow, dynamic island). Below
420 × 820 the chrome is dropped and the app fills the viewport, so it behaves
like a real handset on a phone and like the Figma mockup on a desktop.

The shell owns the status bar and tab bar. Screens render only the body
between them — nothing above y=51 or below y=701 belongs in a screen file.

## Design tokens

`src/index.css` `@theme` is the single source. Colours are transcribed exactly
from Figma. Font sizes, radii and stroke widths are **snapped to a scale**: the
frames carry resize drift (Inter 11.7 / 15.9 / 20.3, strokes of 0.5105 /
1.021 / 1.49934 / 1.6625px) that is noise, not intent.

Fonts: Inter for Latin, Pretendard as the Korean fallback (Inter has no
Hangul, so this reproduces what Figma itself rendered), Space Grotesk for the
status bar and numerics, Noto Sans KR where the design names it (P01 splash,
P02L language selection, chat bubbles, the feedback sheet).

## Motion

Values come from the prototype wiring, not from taste. All 125 easings in the
file are Figma `EASE_OUT` — `cubic-bezier(0, 0, 0.58, 1)`, which is *not* CSS
`ease-out`. Durations are the designer's:

| Transition | Duration | Where |
|---|---|---|
| PUSH LEFT | 280ms | forward navigation (45 connections) |
| PUSH RIGHT | 240ms | back / tab navigation (17) |
| DISSOLVE | 200ms | selection changes, dialogs, overlays (29) |
| SMART_ANIMATE | 250ms | state morphs — language toggle, notification switch |
| SWAP | 220ms | language picker choice swap |
| drag snap | 300ms | simulation portrait/chat resize |
| MOVE_IN | 320ms | answer-feedback overlay |
| DISSOLVE | 350ms | splash → language |

`src/lib/motion.ts` holds them.

`prefers-reduced-motion` is honoured two ways, because one is not enough: the
`@media` block in `index.css` covers CSS transitions, and `<MotionConfig
reducedMotion="user">` in `App.tsx` covers everything Motion animates via
inline style. Per Motion's policy that disables transform and layout
animations (route pushes, the drag snap, staggered rises, the score-ring
sweep) while leaving opacity and colour, which are not vestibular triggers.

## Screens

| Route | Figma | Notes |
|---|---|---|
| `/splash` | P01 | mobile-only; auto-advances after 1.8s |
| `/onboarding/language` | P02L.1 / .2 | own palette + Noto Sans KR; predates the Inter system |
| `/onboarding/purpose` | P03 | multi-select, 1/3 |
| `/onboarding/pace` | P04 | single select, 2/3 |
| `/onboarding/notifications` | P05 | 3/3 |
| `/trial` | P02 Tutorial 1–3 | guided warm-up chat |
| `/home` | P06 | |
| `/personas` | P07, P07-1, P07-2 | search expands in place |
| `/personas/:id` | P08, P08-1/2/3 | P08-3 dialog fires on an in-progress scenario |
| `/simulation/:id` | P09, P09.1/.2, P09A, P09.1A | drag-resizable portrait/chat split |
| `/result/:id` | P10, P10.1 | see "Hidden frames" below |
| `/login` | P11, P11-1 | |
| `/profile` | P12 | |
| `/settings` | P13, P13A/B/C | guest, notifications-off, delete-confirm |
| `/settings/purpose` · `/settings/pace` | P13 Study Purpose, P13-2 | the P03/P04 pickers reached from settings |
| `/legal` | P14, P14A | |

### Hidden frames

**P10 (연습 결과 / Result) is hidden in Figma** (`visible: false`) but fully
designed, and the prototype still routes out of it. It has no Jira subtask.
It is implemented at `/result/:scenarioId`; the simulation navigates there when
the user closes a session in which they said something.

One interpretation was needed: the 154px ring around the score is drawn as an
unfilled band, which would render as nothing. It is treated as a score ring and
stroked to `score / 100`.

## Re-extracting the design

`python3 scripts/figma/sync.py all` (from the repo root) refreshes
`.figma/` with the per-frame spec, the token frequency report, the prototype
graph and PNG@2x of every frame. Needs `FIGMA_TOKEN` in the repo `.env`.
`FIGMA_FILE_KEY` optionally selects another file; when omitted, the current
K speech file remains the development default. See the root `.env.example`.

## Storybook

`npm run storybook`. Stories cover the shared primitives and the composites
that appear on more than one screen, using the same fixtures the app reads so
they cannot drift from it.

`.storybook/preview.tsx` wraps every story in `MemoryRouter` (cards and the tab
bar navigate) and `MotionConfig` (so reduced motion behaves as it does in the
app), and defaults the canvas background to the Figma page colour rather than
white. Decorators in `src/stories/decorators.tsx` pin the 360px width, and
`phoneScreen` gives overlays the positioned 360x768 box they anchor to.

The a11y addon is on. It currently reports **colour-contrast violations that
come from the design palette, not from the implementation** — see below.

### Known contrast gaps (design decision needed)

The secondary-text ramp is transcribed exactly from Figma and does not reach
WCAG AA:

| Token | On | Ratio | AA body (4.5) | AA large (3.0) |
|---|---|---|---|---|
| `muted` #A29A89 | #FFFFFF | 2.79:1 | fail | fail |
| `muted` #A29A89 | #FDFBF7 | 2.70:1 | fail | fail |
| `muted-2` #8A8272 | #FFFFFF | 3.81:1 | fail | pass |
| `muted-3` #B4AC9B | #FFFFFF | 2.25:1 | fail | fail |
| `muted-4` #C3BBAA | #FFFFFF | 1.91:1 | fail | fail |

`#A29A89` carries most secondary copy in the app (약 3분, 목표 · …, English
subtitles), so this is not a corner case. Everything else passes — ink 16.3:1,
card titles 9.0:1, the primary CTA 5.0:1, all three difficulty chips above
6.8:1. Darkening the ramp is a design call, so it is reported rather than
changed.

## Where things live

```
src/
  app/          router, route metadata, screen transitions
  components/
    shell/      PhoneShell, StatusBar, TabBar, Stepper, ScreenBody
    ui/         Button, Card, Chip, Toggle, SelectCard, dialogs, sheets, icons
  features/     one directory per screen group
  api/          types, fixtures, client — the seam to KAN-19
  store/        onboarding + account state (persisted to localStorage)
  lib/          motion tokens, press vocabulary, class helper
  stories/      Storybook stories + canvas decorators
```
