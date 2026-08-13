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
type RoomTurnResponse = components['schemas']['RoomTurnResponse']

export const FREE_CHAT_SCENARIO_ID = 'free_chat'

const freeChatScenario = (personaId: string): Scenario => ({
  id: FREE_CHAT_SCENARIO_ID,
  personaId,
  title: { ko: '자유 대화', en: 'Free Chat' },
  goal: '정해진 상황 없이 페르소나와 자유롭게 대화하기',
  difficulty: 'easy',
  estimatedMinutes: 3,
  recommended: true,
  inProgress: false,
  requiresLogin: false,
})

export type ConversationTurn = {
  messages: ChatMessage[]
  audioUrl: string
}

export type VoiceRecording = {
  audioBase64: string
  mimeType: string
  durationSeconds: number
}

const personaFromApi = (value: ApiPersona): Persona => ({
  id: value.id,
  name: [value.first_name, value.middle_name, value.last_name].filter(Boolean).join(' '),
  role: value.description,
  relationship: 'relationship_description' in value ? value.relationship_description : '대화 상대',
  contextLabel: `${value.first_name} · ${value.description}`,
  portrait: (value as ApiPersona & { avatar_url?: string | null }).avatar_url ?? undefined,
  requiresLogin: false,
})

const scenarioFromApi = (value: ApiScenario, personaId: string): Scenario => ({
  id: value.id,
  personaId,
  title: { ko: value.description, en: value.description },
  goal: 'communication_goal' in value ? value.communication_goal : value.description,
  difficulty: 'easy',
  estimatedMinutes: Math.max(1, Math.ceil((('max_turns' in value ? value.max_turns : 6)) / 2)),
  recommended: false,
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
  work: 'business', dating: 'daily_conversation', smalltalk: 'daily_conversation',
  requests: 'daily_conversation', service: 'business', honorifics: 'culture', other: 'other',
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
  const databaseScenarios = ('scenarios' in persona ? persona.scenarios : [])
    .map((scenario) => scenarioFromApi(scenario, personaId))
  return [freeChatScenario(personaId), ...databaseScenarios]
}

export async function getRooms(): Promise<ApiRoom[]> {
  const data = await apiRequest<{ rooms: ApiRoom[] }>('/rooms')
  return data.rooms
}

export async function getSimulation(
  scenarioId: string,
  mode: 'new' | 'continue',
  personaId?: string,
): Promise<SimulationSession | undefined> {
  if (scenarioId === FREE_CHAT_SCENARIO_ID) {
    if (!personaId) throw new Error('자유 대화 상대를 찾을 수 없습니다.')
    const personaApi = await apiRequest<ApiPersona>(`/personas/${personaId}`)
    const rooms = await apiRequest<{ rooms: ApiRoom[] }>('/rooms')
    const existing = rooms.rooms.find((candidate) => (
      candidate.persona_id === personaId
      && candidate.scenario_id === null
      && candidate.status === 'in_progress'
    ))
    const room = existing ?? await apiRequest<ApiRoom>('/rooms', {
      method: 'POST',
      body: {
        persona_id: personaId,
        scenario_id: null,
        name: `${personaApi.first_name} 자유 대화`,
      },
    })
    const history = await apiRequest<{ messages: ApiMessage[] }>(`/rooms/${room.id}/messages`)
    return {
      roomId: room.id,
      scenarioId: FREE_CHAT_SCENARIO_ID,
      persona: personaFromApi(personaApi),
      goalLabel: '목표 · 자유롭게 대화하기',
      elapsed: '00:00', expression: '표정 · 미소', step: room.turn_count,
      totalSteps: room.guest ? 3 : 5,
      completed: room.status === 'completed',
      messages: history.messages.map(messageFromApi),
    }
  }
  const scenario = await apiRequest<components['schemas']['ScenarioResponse']>(`/scenarios/${scenarioId}`)
  const personaApi = scenario.personas[0]
  if (!personaApi) return undefined
  let room: ApiRoom
  if (mode === 'continue') {
    const rooms = await apiRequest<{ rooms: ApiRoom[] }>('/rooms')
    room = rooms.rooms.find((candidate) => candidate.scenario_id === scenarioId && candidate.status === 'in_progress')
      ?? await apiRequest<ApiRoom>('/rooms', { method: 'POST', body: { persona_id: personaApi.id, scenario_id: scenarioId, name: scenario.description } })
  } else {
    room = await apiRequest<ApiRoom>('/rooms', { method: 'POST', body: { persona_id: personaApi.id, scenario_id: scenarioId, name: scenario.description } })
  }
  const history = await apiRequest<{ messages: ApiMessage[] }>(`/rooms/${room.id}/messages`)
  return {
    roomId: room.id,
    scenarioId,
    persona: personaFromApi(personaApi),
    goalLabel: `목표 · ${scenario.communication_goal}`,
    elapsed: '00:00', expression: '표정 · 미소', step: room.turn_count,
    totalSteps: room.guest ? 3 : (scenario.max_turns ?? 5),
    completed: room.status === 'completed',
    messages: history.messages.map(messageFromApi),
  }
}

const messageFromApi = (message: ApiMessage): ChatMessage => {
  const persisted = (message as ApiMessage & {
    feedback?: {
      input_type: 'text' | 'voice'
      duration_seconds: number
      score: number
      summary: string
      improvements: string[]
      voice_emotion?: AnswerFeedback['voiceEmotion'] | null
    } | null
  }).feedback
  const feedback: AnswerFeedback | undefined = persisted ? {
    inputType: persisted.input_type,
    meta: persisted.input_type === 'voice'
      ? `마이크 입력 · ${persisted.duration_seconds.toFixed(1)}초 · 분석 완료`
      : '텍스트 입력 · 분석 완료',
    durationSeconds: persisted.duration_seconds,
    score: persisted.score / 10,
    scoreOutOf: 10,
    scoreLabel: persisted.score >= 80 ? '자연스러워요' : persisted.score >= 60 ? '좋아요' : '연습해 볼까요',
    secondaryMetrics: '',
    voiceEmotion: persisted.input_type === 'voice' && persisted.voice_emotion
      ? persisted.voice_emotion
      : undefined,
    expression: [persisted.summary, ...persisted.improvements].filter(Boolean).join(' · '),
  } : undefined
  return {
    id: message.id,
    role: message.role === 'assistant' ? 'persona' : message.role as ChatMessage['role'],
    text: message.content,
    inputType: feedback?.inputType,
    feedback,
    audioUrl: (() => {
    const path = (message as ApiMessage & { audio_url?: string | null }).audio_url
    if (!path) return undefined
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    return `${apiUrl}${path}`
    })(),
  }
}

export async function sendMessage(roomId: string, text: string): Promise<ChatMessage[]> {
  const result = await apiRequest<{ message: ApiMessage }>(`/rooms/${roomId}/messages`, {
    method: 'POST', body: { question: text },
  })
  return [{ id: `local-${Date.now()}`, role: 'user', text }, messageFromApi(result.message)]
}

async function processTurn(
  roomId: string,
  input:
    | { type: 'text'; text: string }
    | { type: 'voice'; transcript: string; recording: VoiceRecording },
): Promise<ConversationTurn> {
  const endpoint = input.type === 'voice' ? 'voice' : 'text'
  const body = input.type === 'voice'
    ? {
        transcript: input.transcript,
        audio_base64: input.recording.audioBase64,
        audio_mime_type: input.recording.mimeType,
        duration_seconds: input.recording.durationSeconds,
      }
    : { text: input.text }
  const result = await apiRequest<RoomTurnResponse>(`/rooms/${roomId}/turns/${endpoint}`, {
    method: 'POST',
    body,
  })
  const assistantMessage = messageFromApi(result.assistant_message)
  if (!assistantMessage.audioUrl) throw new Error('저장된 음성 파일을 찾을 수 없습니다.')
  const feedback: AnswerFeedback = {
    inputType: input.type,
    meta: input.type === 'voice' ? '마이크 입력 · 분석 완료' : '텍스트 입력 · 분석 완료',
    durationSeconds: input.type === 'voice' ? input.recording.durationSeconds : 0,
    score: result.feedback.score / 10,
    scoreOutOf: 10,
    scoreLabel: result.feedback.score >= 80 ? '자연스러워요' : result.feedback.score >= 60 ? '좋아요' : '연습해 볼까요',
    secondaryMetrics: '',
    voiceEmotion: input.type === 'voice' && result.conversation.voice_emotion
      ? result.conversation.voice_emotion
      : undefined,
    expression: [result.feedback.summary, ...result.feedback.improvements].filter(Boolean).join(' · '),
  }
  return {
    messages: [
      { ...messageFromApi(result.user_message), feedback },
      assistantMessage,
    ],
    audioUrl: assistantMessage.audioUrl,
  }
}

export const processTextTurn = (roomId: string, text: string) =>
  processTurn(roomId, { type: 'text', text })

export const processVoiceTurn = (
  roomId: string,
  transcript: string,
  recording: VoiceRecording,
) => processTurn(roomId, { type: 'voice', transcript, recording })

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
      inputType: 'text', meta: '체험 피드백', durationSeconds: 0, score: 8, scoreOutOf: 10,
      scoreLabel: '자연스러워요', secondaryMetrics: '',
      expression: '로그인 후 실제 대화 피드백을 확인할 수 있어요.',
    }
  }
  const result = await apiRequest<{
    score: number; summary: string; issues: Array<{ original: string; explanation: string }>
  }>(`/rooms/${roomId}/feedback`, { method: 'POST' })
  return {
    inputType: 'text', meta: '대화 분석 완료', durationSeconds: 0, score: result.score / 10, scoreOutOf: 10,
    scoreLabel: result.summary, secondaryMetrics: '',
    expression: result.summary,
  }
}
