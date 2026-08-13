import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequest = vi.hoisted(() => vi.fn())
vi.mock('./http', () => ({ apiRequest }))

import { FREE_CHAT_SCENARIO_ID, getScenarios, getSimulation } from './client'

const persona = {
  id: 'doyun', first_name: '도윤', middle_name: null, last_name: null,
  description: '캠퍼스 친구', relationship_description: '처음 만난 또래',
  scenarios: [{ id: 'campus', description: '길 묻기', communication_goal: '길을 묻는다', max_turns: 6 }],
}

describe('free chat API flow', () => {
  beforeEach(() => apiRequest.mockReset())

  it('places the virtual free chat card before database scenarios', async () => {
    apiRequest.mockResolvedValue(persona)

    const scenarios = await getScenarios('doyun')

    expect(scenarios.map((scenario) => scenario.id)).toEqual([FREE_CHAT_SCENARIO_ID, 'campus'])
    expect(scenarios[0]?.title.ko).toBe('자유 대화')
  })

  it('continues the existing persona free chat room', async () => {
    apiRequest
      .mockResolvedValueOnce(persona)
      .mockResolvedValueOnce({ rooms: [{
        id: 'free-room', persona_id: 'doyun', scenario_id: null,
        status: 'in_progress', turn_count: 2, guest: false,
      }] })
      .mockResolvedValueOnce({ messages: [{
        id: 'user-1', role: 'user', content: '안녕하세요',
        feedback: {
          input_type: 'text', duration_seconds: 0, score: 88,
          summary: '자연스러워요', improvements: ['조금 더 구체적으로 말해 보세요'],
          voice_emotion: null,
        },
      }] })

    const session = await getSimulation(FREE_CHAT_SCENARIO_ID, 'continue', 'doyun')

    expect(session?.roomId).toBe('free-room')
    expect(session?.messages[0]?.feedback).toMatchObject({
      inputType: 'text', expression: '자연스러워요 · 조금 더 구체적으로 말해 보세요',
    })
    expect(apiRequest).not.toHaveBeenCalledWith('/rooms', expect.objectContaining({ method: 'POST' }))
  })

  it('creates a scenario-less room when no free chat exists', async () => {
    apiRequest
      .mockResolvedValueOnce(persona)
      .mockResolvedValueOnce({ rooms: [] })
      .mockResolvedValueOnce({
        id: 'new-free-room', persona_id: 'doyun', scenario_id: null,
        status: 'in_progress', turn_count: 0, guest: false,
      })
      .mockResolvedValueOnce({ messages: [] })

    const session = await getSimulation(FREE_CHAT_SCENARIO_ID, 'new', 'doyun')

    expect(apiRequest).toHaveBeenCalledWith('/rooms', {
      method: 'POST',
      body: { persona_id: 'doyun', scenario_id: null, name: '도윤 자유 대화' },
    })
    expect(session?.scenarioId).toBe(FREE_CHAT_SCENARIO_ID)
  })
})
