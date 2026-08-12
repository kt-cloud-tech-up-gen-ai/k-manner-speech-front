import type { Transition, Variants } from 'motion/react'

/**
 * Motion values transcribed from the Figma prototype wiring in
 * "K speech" (wcovSZfRWLwPfTx82mRRS1).
 *
 * All 125 easings in the file are Figma's EASE_OUT. Figma's EASE_OUT is
 * cubic-bezier(0, 0, 0.58, 1) — noticeably slower to settle than CSS
 * `ease-out` (0, 0, 0.2, 1), so it is defined explicitly rather than inherited.
 *
 * Durations are the designer's own values; the counts below are how many
 * prototype connections use each one.
 */
export const EASE_OUT = [0, 0, 0.58, 1] as const

export const DURATION = {
  instant: 0.15, // 12x — instant state flips
  dissolve: 0.2, // 29x — selection changes, overlays, dialogs
  swap: 0.22, // 2x  — overlay component swaps
  back: 0.24, // 17x — backward / tab navigation
  smart: 0.25, // 5x  — SMART_ANIMATE state morphs
  push: 0.28, // 45x — forward navigation (the default)
  drag: 0.3, // 9x  — drag-driven panel resize
  overlay: 0.32, // 5x  — MOVE_IN overlays (answer feedback)
  splash: 0.35, // 1x  — splash dissolve
} as const

const ease = (duration: number): Transition => ({ duration, ease: EASE_OUT })

export const T = {
  instant: ease(DURATION.instant),
  dissolve: ease(DURATION.dissolve),
  swap: ease(DURATION.swap),
  back: ease(DURATION.back),
  smart: ease(DURATION.smart),
  push: ease(DURATION.push),
  drag: ease(DURATION.drag),
  overlay: ease(DURATION.overlay),
  splash: ease(DURATION.splash),
} satisfies Record<keyof typeof DURATION, Transition>

/** Figma PUSH: the incoming frame slides the outgoing one off-screen. */
export const pushVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir >= 0 ? '-100%' : '100%' }),
}

/** Figma DISSOLVE. */
export const dissolveVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

/** Figma MOVE_IN direction=TOP — used by the Answer Feedback overlays. */
export const moveInTopVariants: Variants = {
  enter: { y: '-100%' },
  center: { y: 0 },
  exit: { y: '-100%' },
}

/** Bottom sheets / dialogs that rise from the bottom edge. */
export const sheetVariants: Variants = {
  enter: { y: '100%' },
  center: { y: 0 },
  exit: { y: '100%' },
}

export const scrimVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Press feedback, scaled to the target's size so the travel reads the same:
 * a 360px-wide CTA moving 2.5% covers the same distance as a 34px icon button
 * moving 8%.
 */
export const PRESS = {
  /** Full-width CTAs and rows. */
  button: 0.975,
  /** Cards and tiles. */
  card: 0.985,
  /** 24-40px icon buttons. */
  icon: 0.92,
} as const

/**
 * Route -> depth. A push to a deeper route slides left; going back slides
 * right. Mirrors the PUSH LEFT / PUSH RIGHT split in the prototype.
 */
const DEPTH: Array<[RegExp, number]> = [
  [/^\/splash$/, 0],
  [/^\/onboarding\/language$/, 1],
  [/^\/onboarding\/purpose$/, 2],
  [/^\/onboarding\/pace$/, 3],
  [/^\/onboarding\/notifications$/, 4],
  [/^\/home$/, 5],
  [/^\/personas$/, 6],
  [/^\/personas\/[^/]+$/, 7],
  [/^\/simulation\/[^/]+$/, 8],
  [/^\/trial/, 8],
  [/^\/settings$/, 6.1],
  [/^\/profile$/, 7],
  [/^\/legal/, 7],
  [/^\/login$/, 9],
]

export function routeDepth(pathname: string): number {
  for (const [re, depth] of DEPTH) if (re.test(pathname)) return depth
  return 5
}
