import { cleanup, render, waitFor } from '@testing-library/react'
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
  })
})
