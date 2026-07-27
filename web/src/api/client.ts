import * as fixtures from './fixtures'
import type {
  AnswerFeedback,
  ChatMessage,
  HomeSummary,
  LegalDocument,
  PaceOption,
  Persona,
  PracticeResult,
  PurposeOption,
  Scenario,
  SimulationSession,
} from './types'

/**
 * The seam between the screens and the eventual API server (KAN-19).
 *
 * Everything is async and returns the same shapes the endpoints will, so
 * swapping a fixture for `fetch` is a one-line change per function. Screens
 * must never import from `fixtures.ts` directly.
 */

/** Small deliberate latency so loading states are exercised, not skipped. */
const LATENCY = 120

function resolve<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((r) => setTimeout(() => r(structuredClone(value)), ms))
}

export function getHomeSummary(): Promise<HomeSummary> {
  return resolve(fixtures.HOME_SUMMARY)
}

export function getPersonas(): Promise<Persona[]> {
  return resolve(fixtures.PERSONAS)
}

export function getPersona(id: string): Promise<Persona | undefined> {
  return resolve(fixtures.PERSONAS.find((p) => p.id === id))
}

export function getScenarios(personaId: string): Promise<Scenario[]> {
  return resolve(fixtures.SCENARIOS.filter((s) => s.personaId === personaId))
}

export function getPurposeOptions(): Promise<PurposeOption[]> {
  return resolve(fixtures.PURPOSE_OPTIONS, 0)
}

export function getPaceOptions(): Promise<PaceOption[]> {
  return resolve(fixtures.PACE_OPTIONS, 0)
}

export function getLegalDocuments(): Promise<LegalDocument[]> {
  return resolve(fixtures.LEGAL_DOCUMENTS)
}

export function getPracticeResult(scenarioId: string): Promise<PracticeResult> {
  const match = fixtures.PRACTICE_RESULTS.find((r) => r.scenarioId === scenarioId)
  return resolve(match ?? fixtures.PRACTICE_RESULTS[0])
}

export function getAnswerFeedback(): Promise<AnswerFeedback> {
  return resolve(fixtures.ANSWER_FEEDBACK, 400)
}

export async function getSimulation(
  scenarioId: string,
  mode: 'new' | 'continue',
): Promise<SimulationSession | undefined> {
  const scenario = fixtures.SCENARIOS.find((s) => s.id === scenarioId)
  if (!scenario) return undefined
  const persona = fixtures.PERSONAS.find((p) => p.id === scenario.personaId)
  if (!persona) return undefined

  const messages =
    mode === 'continue' ? fixtures.SIMULATION_CONTINUED : fixtures.SIMULATION_OPENING

  return resolve<SimulationSession>({
    scenarioId,
    persona,
    goalLabel: `목표 · ${scenario.title.ko}`,
    elapsed: mode === 'continue' ? '02:14' : '00:00',
    expression: '표정 · 미소',
    step: mode === 'continue' ? 1 : 0,
    totalSteps: 5,
    messages,
  })
}

/** Local echo of a user turn — the real endpoint will stream a reply. */
export async function sendMessage(text: string): Promise<ChatMessage[]> {
  const user: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text }
  const reply: ChatMessage = {
    id: `p-${Date.now()}`,
    role: 'persona',
    text: '오, 발음 좋은데요? 어디서 배웠어요?',
    hint: 'Nice pronunciation — where did you learn?',
  }
  await new Promise((r) => setTimeout(r, 500))
  return [user, reply]
}
