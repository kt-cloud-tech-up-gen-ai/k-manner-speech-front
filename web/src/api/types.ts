/**
 * Shapes the screens consume. These mirror what the API server (KAN-19) is
 * expected to return, so wiring the real endpoints later is a swap inside
 * `client.ts` and nothing else.
 */

export type Locale = 'ko' | 'en'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type Gender = 'female' | 'male' | 'undisclosed'

/** Every label in the design ships as a Korean/English pair. */
export interface Bilingual {
  ko: string
  en: string
}

export interface Persona {
  id: string
  name: string
  /** "캠퍼스 훈남" — the one-line role under the name. */
  role: string
  /** "처음 만난 또래" — the relationship chip. */
  relationship: string
  /** Short context label used in headers: "도윤 · 캠퍼스". */
  contextLabel: string
  portrait?: string
  /** Locked personas render at 50% with a lock badge and a login chip. */
  requiresLogin: boolean
}

export interface Scenario {
  id: string
  personaId: string
  title: Bilingual
  /** "목표 · …" body copy. */
  goal: string
  difficulty: Difficulty
  /** Minutes, rendered as "약 3분". */
  estimatedMinutes: number
  recommended: boolean
  inProgress: boolean
  requiresLogin: boolean
}

export interface HomeSummary {
  greeting: string
  greetingSub: string
  streak: {
    label: string
    days: number
    weeklyGoal: number
    statusLabel: string
  }
  pick: {
    scenarioId: string
    personaLabel: string
    title: string
    meta: string
    difficulty: Difficulty
    difficultyLabel: string
  }
  resumeLabel: string | null
}

export interface PurposeOption {
  id: string
  label: Bilingual
}

export interface PaceOption {
  id: string
  times: number
  label: string
  description: string
}

export type ChatRole = 'persona' | 'user' | 'system'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  /** Romanised / translated helper line shown under persona lines. */
  hint?: string
}

export interface SimulationSession {
  roomId: string
  scenarioId: string
  persona: Persona
  goalLabel: string
  /** "02:14" */
  elapsed: string
  expression: string
  /** 0-based index into a 5-dot progress row. */
  step: number
  totalSteps: number
  messages: ChatMessage[]
  completed: boolean
}

/** The P09 "답변 피드백" sheet: a pronunciation report over one recording. */
export interface AnswerFeedback {
  /** "마이크 입력 · 4.7초 · 분석 완료" */
  meta: string
  durationSeconds: number
  score: number
  scoreOutOf: number
  scoreLabel: string
  secondaryMetrics: string
  /** Bar heights 0-1, in recording order. */
  waveform: number[]
  /** Flagged spans, in seconds. */
  errorRanges: Array<{ from: number; to: number }>
  issues: Array<{ timestamp: string; word: string; guidance: string }>
  expression: string
}

/**
 * P10 · 연습 결과 — the post-session report. The frame is hidden in Figma but
 * fully designed, and the prototype still routes out of it.
 */
export interface PracticeResult {
  scenarioId: string
  score: number
  scoreOutOf: number
  /** "적합성 · 100" */
  scoreCaption: string
  verdict: string
  comment: string
  tryInstead: string
  meta: string[]
  nextScenarioId: string | null
}

export interface UserProfile {
  name: string
  email: string
  gender: Gender
  age: number
}

export interface LegalDocument {
  id: 'terms' | 'privacy'
  tab: string
  effectiveDate: string
  version: string
  sections: Array<{ heading: string; body: string }>
}
