import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ScenariosScreen } from './ScenariosScreen'

const api = vi.hoisted(() => ({
  getPersona: vi.fn(), getRooms: vi.fn(), getScenarios: vi.fn(),
}))
vi.mock('@/api/client', () => ({ ...api, FREE_CHAT_SCENARIO_ID: 'free_chat' }))

describe('ScenariosScreen free chat', () => {
  afterEach(cleanup)
  beforeEach(() => {
    api.getPersona.mockResolvedValue({
      id: 'doyun', name: '도윤', contextLabel: '도윤 · 캠퍼스', requiresLogin: false,
    })
    api.getRooms.mockResolvedValue([])
    api.getScenarios.mockResolvedValue([
      {
        id: 'free_chat', personaId: 'doyun', title: { ko: '자유 대화', en: 'Free Chat' },
        goal: '도윤과 자유롭게 대화하기', difficulty: 'easy', estimatedMinutes: 3,
        recommended: true, inProgress: false, requiresLogin: false,
      },
      {
        id: 'campus', personaId: 'doyun', title: { ko: '길 묻기', en: 'Directions' },
        goal: '길을 묻기', difficulty: 'easy', estimatedMinutes: 3,
        recommended: false, inProgress: false, requiresLogin: false,
      },
    ])
  })

  it('renders free chat as the first scenario card', async () => {
    render(
      <MemoryRouter initialEntries={['/personas/doyun']}>
        <Routes><Route path="/personas/:personaId" element={<ScenariosScreen />} /></Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(api.getScenarios).toHaveBeenCalledWith('doyun'))
    const cards = screen.getAllByRole('button', { name: /자유 대화|길 묻기/ })
    expect(cards[0]).toHaveTextContent('자유 대화')
    expect(cards[1]).toHaveTextContent('길 묻기')
  })
})
