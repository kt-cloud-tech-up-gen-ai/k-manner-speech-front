import { PRACTICE_RESULTS } from './fixtures'
import { apiRequest } from './http'
import type { components } from './generated/schema'
import { HOME_SUMMARY, LEGAL_DOCUMENTS, PACE_OPTIONS, PURPOSE_OPTIONS } from './staticContent'
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

type ApiPersona = components['schemas']['PersonaResponse'] | components['schemas']['PersonaSummaryResponse']
type ApiScenario = components['schemas']['ScenarioResponse'] | components['schemas']['ScenarioSummaryResponse']
type ApiRoom = components['schemas']['RoomResponse']
type ApiMessage = components['schemas']['ChatMessageResponse']

const personaFromApi = (value: ApiPersona): Persona => ({
  id: value.id,
  name: [value.first_name, value.middle_name, value.last_name].filter(Boolean).join(' '),
  role: value.description,
  relationship: 'relationship_description' in value ? value.relationship_description : '대화 상대',
  contextLabel: `${value.first_name} · ${value.description}`,
  requiresLogin: false,
})

const scenarioFromApi = (value: ApiScenario, personaId: string): Scenario => ({
  id: value.id,
  personaId,
  title: { ko: value.title_ko, en: value.title_en ?? '' },
  goal: value.communication_goal,
  difficulty: value.difficulty === 'medium' || value.difficulty === 'hard'
    ? value.difficulty
    : 'easy',
  estimatedMinutes: value.estimated_minutes
    ?? Math.max(1, Math.ceil((('max_turns' in value ? value.max_turns : 6)) / 2)),
  recommended: value.is_featured,
  inProgress: false,
  requiresLogin: false,
})

export const login = (email: string, password: string) => {
  const form = new URLSearchParams({ username: email, password })
  return apiRequest<{ user: { id: string; email: string } }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })
}

export const signup = (email: string, password: string) =>
  apiRequest<{ user: { id: string; email: string } }>('/auth/signup', {
    method: 'POST', body: { email, password },
  })
export const logout = () => apiRequest<void>('/auth/logout', { method: 'POST' })
export const withdraw = () => apiRequest<void>('/auth/me', { method: 'DELETE' })
export type MeResponse = {
  user: { id: string; email?: string | null }
  profile: { name?: string | null; age?: number | null; gender?: string | null }
}
export const getMe = () => apiRequest<MeResponse>('/auth/me')
export const updateProfile = (profile: unknown) =>
  apiRequest('/auth/me/profile', { method: 'PUT', body: profile })

const goalMap: Record<string, string> = {
  work: 'work_interview', dating: 'dating_first_impression', smalltalk: 'small_talk',
  requests: 'requests_refusals', service: 'service_complaints', honorifics: 'honorifics', other: 'other',
}
const paceMap: Record<string, string> = {
  light: 'weekly', steady: 'three_per_week', focused: 'five_per_week',
}
export const saveOnboarding = (state: {
  locale: string; purposes: string[]; purposeOther: string; pace: string | null
  notificationsAllowed: boolean; profile: { name: string; age: number; gender: string }
}) => updateProfile({
  name: state.profile.name,
  age: state.profile.age,
  learning_goal_other: state.purposeOther || null,
  native_language: state.locale,
  gender: state.profile.gender === 'undisclosed' ? 'prefer_not_to_say' : state.profile.gender,
  learning_goals: [...new Set(state.purposes.map((purpose) => goalMap[purpose] ?? 'other'))],
  study_frequency: state.pace ? paceMap[state.pace] : null,
  push_enabled: state.notificationsAllowed,
})

export async function getPersonas(): Promise<Persona[]> {
  const data = await apiRequest<{ personas: ApiPersona[] }>('/personas')
  return data.personas.map(personaFromApi)
}

export async function getPersona(id: string): Promise<Persona | undefined> {
  return personaFromApi(await apiRequest<ApiPersona>(`/personas/${id}`))
}

export async function getScenarios(personaId: string): Promise<Scenario[]> {
  const persona = await apiRequest<ApiPersona>(`/personas/${personaId}`)
  return ('scenarios' in persona ? persona.scenarios : []).map((scenario) => scenarioFromApi(scenario, personaId))
}

export async function getSimulation(
  scenarioId: string,
  mode: 'new' | 'continue',
): Promise<SimulationSession | undefined> {
  const scenario = await apiRequest<components['schemas']['ScenarioResponse']>(`/scenarios/${scenarioId}`)
  const personaApi = scenario.personas[0]
  if (!personaApi) return undefined
  let room: ApiRoom
  if (mode === 'continue') {
    const rooms = await apiRequest<{ rooms: ApiRoom[] }>('/rooms')
    room = rooms.rooms.find((candidate) => candidate.scenario_id === scenarioId && candidate.status === 'in_progress')
      ?? await apiRequest<ApiRoom>('/rooms', { method: 'POST', body: { persona_id: personaApi.id, scenario_id: scenarioId, name: scenario.title_ko } })
  } else {
    room = await apiRequest<ApiRoom>('/rooms', { method: 'POST', body: { persona_id: personaApi.id, scenario_id: scenarioId, name: scenario.title_ko } })
  }
  const history = await apiRequest<{ messages: ApiMessage[] }>(`/rooms/${room.id}/messages`)
  return {
    roomId: room.id,
    scenarioId,
    guest: room.guest,
    persona: personaFromApi(personaApi),
    goalLabel: `목표 · ${scenario.communication_goal}`,
    elapsed: '00:00', expression: '표정 · 미소', step: room.turn_count,
    totalSteps: room.guest ? Math.min(3, scenario.max_turns ?? 3) : (scenario.max_turns ?? 5),
    completed: room.status !== 'in_progress',
    messages: history.messages.map(messageFromApi),
  }
}

const messageFromApi = (message: ApiMessage): ChatMessage => ({
  id: message.id,
  role: message.role === 'assistant' ? 'persona' : message.role as ChatMessage['role'],
  text: message.content,
})

export async function sendMessage(roomId: string, text: string): Promise<ChatMessage[]> {
  const result = await apiRequest<{ message: ApiMessage }>(`/rooms/${roomId}/messages`, {
    method: 'POST', body: { question: text },
  })
  return [{ id: `local-${Date.now()}`, role: 'user', text }, messageFromApi(result.message)]
}

export function getHomeSummary(): Promise<HomeSummary> { return Promise.resolve(HOME_SUMMARY) }
export function getPurposeOptions(): Promise<PurposeOption[]> { return Promise.resolve(PURPOSE_OPTIONS) }
export function getPaceOptions(): Promise<PaceOption[]> { return Promise.resolve(PACE_OPTIONS) }
export function getLegalDocuments(): Promise<LegalDocument[]> { return Promise.resolve(LEGAL_DOCUMENTS) }
export function getPracticeResult(scenarioId: string): Promise<PracticeResult> {
  return Promise.resolve(PRACTICE_RESULTS.find((r) => r.scenarioId === scenarioId) ?? PRACTICE_RESULTS[0])
}
export async function getAnswerFeedback(roomId?: string): Promise<AnswerFeedback> {
  if (!roomId) {
    return {
      meta: '체험 피드백', durationSeconds: 0, score: 8, scoreOutOf: 10,
      scoreLabel: '자연스러워요', secondaryMetrics: '', waveform: [], errorRanges: [],
      issues: [], expression: '로그인 후 실제 대화 피드백을 확인할 수 있어요.',
    }
  }
  const result = await apiRequest<{
    score: number; summary: string; issues: Array<{ original: string; explanation: string }>
  }>(`/rooms/${roomId}/feedback`, { method: 'POST' })
  return {
    meta: '대화 분석 완료', durationSeconds: 0, score: result.score / 10, scoreOutOf: 10,
    scoreLabel: result.summary, secondaryMetrics: '', waveform: [], errorRanges: [],
    issues: result.issues.map((issue) => ({ timestamp: '', word: issue.original, guidance: issue.explanation })),
    expression: result.summary,
  }
}
