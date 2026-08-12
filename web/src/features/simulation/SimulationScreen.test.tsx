import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import type { SimulationSession } from '@/api/types'
import { SimulationScreen } from './SimulationScreen'

const api = vi.hoisted(() => ({
  getSimulation: vi.fn(),
  sendMessage: vi.fn(),
  getAnswerFeedback: vi.fn(),
}))

vi.mock('@/api/client', () => api)

const session: SimulationSession = {
  roomId: 'room-1', scenarioId: 'scenario-1',
  guest: true,
  persona: {
    id: 'doyun', name: '도윤', role: '학생', relationship: '친구',
    contextLabel: '도윤', requiresLogin: false,
  },
  goalLabel: '목표', elapsed: '00:00', expression: '미소', step: 0,
  totalSteps: 3, messages: [], completed: false,
}

describe('SimulationScreen initialization', () => {
  beforeAll(() => {
    Element.prototype.scrollTo = vi.fn()
  })

  afterEach(cleanup)

  it('creates only one room when React StrictMode runs effects twice', async () => {
    api.getSimulation.mockResolvedValue(session)

    render(
      <MemoryRouter initialEntries={['/simulation/scenario-1']}>
        <Routes><Route path="/simulation/:scenarioId" element={<SimulationScreen />} /></Routes>
      </MemoryRouter>,
      { reactStrictMode: true },
    )

    await waitFor(() => expect(api.getSimulation).toHaveBeenCalledTimes(1))
    expect(screen.getByText('게스트 체험 · 3턴')).toBeInTheDocument()
  })

  it('shows an actionable error instead of a blank screen when room creation fails', async () => {
    api.getSimulation.mockRejectedValue(new Error('게스트 세션 설정을 확인해 주세요.'))

    render(
      <MemoryRouter initialEntries={['/simulation/scenario-1']}>
        <Routes><Route path="/simulation/:scenarioId" element={<SimulationScreen />} /></Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '게스트 세션 설정을 확인해 주세요.',
    )
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument()
  })
})
