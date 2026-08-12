import { afterEach, describe, expect, it, vi } from 'vitest'
import { getScenarios } from './client'

describe('catalog client', () => {
  afterEach(() => vi.restoreAllMocks())

  it('maps API scenario display fields and keeps guest practice available', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'doyun',
          first_name: '도윤',
          middle_name: null,
          last_name: null,
          age: 22,
          gender: 'male',
          description: '캠퍼스 선배',
          relationship_description: '처음 만난 선배',
          voice_id: null,
          version: '2026-08-12T00:00:00Z',
          scenarios: [
            {
              id: 'campus_directions_senior',
              title_ko: '도윤 선배에게 길 물어보기',
              title_en: 'Ask Senior Doyun for Directions',
              description: '도윤 선배에게 교무처 위치를 묻는 상황',
              communication_goal: '교무처 위치를 정중하게 묻는다',
              time_context: '수업 전',
              place_context: '중앙광장',
              difficulty: 'easy',
              estimated_minutes: 3,
              is_featured: true,
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const scenarios = await getScenarios('doyun')

    expect(scenarios).toHaveLength(1)
    expect(scenarios[0]).toMatchObject({
      id: 'campus_directions_senior',
      title: {
        ko: '도윤 선배에게 길 물어보기',
        en: 'Ask Senior Doyun for Directions',
      },
      goal: '교무처 위치를 정중하게 묻는다',
      estimatedMinutes: 3,
      recommended: true,
      requiresLogin: false,
    })
  })
})
