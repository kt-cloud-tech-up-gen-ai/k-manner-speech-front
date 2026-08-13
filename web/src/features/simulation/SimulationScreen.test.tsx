import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import type { SimulationSession } from '@/api/types'
import { SimulationScreen } from './SimulationScreen'

const api = vi.hoisted(() => ({
  getSimulation: vi.fn(),
  processTextTurn: vi.fn(),
  processVoiceTurn: vi.fn(),
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

  beforeEach(() => {
    api.getSimulation.mockReset()
    api.processTextTurn.mockReset()
    api.processVoiceTurn.mockReset()
  })

  function renderScreen() {
    return render(
      <MemoryRouter initialEntries={['/simulation/scenario-1']}>
        <Routes>
          <Route path="/simulation/:scenarioId" element={<SimulationScreen />} />
          <Route path="/personas" element={<h1>시나리오 목록</h1>} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('announces that the practice is loading while initialization is pending', () => {
    api.getSimulation.mockReturnValue(new Promise(() => {}))

    renderScreen()

    expect(screen.getByRole('status')).toHaveTextContent('연습을 준비하고 있어요')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('announces initialization errors and offers recovery actions', async () => {
    api.getSimulation.mockRejectedValue(new Error('네트워크 연결을 확인해 주세요.'))

    renderScreen()

    expect(await screen.findByRole('alert')).toHaveTextContent('네트워크 연결을 확인해 주세요.')
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '시나리오 목록' })).toBeEnabled()
    expect(screen.queryByLabelText('메시지 입력')).not.toBeInTheDocument()
  })

  it('shows a fallback error when initialization returns no session', async () => {
    api.getSimulation.mockResolvedValue(undefined)

    renderScreen()

    expect(await screen.findByRole('alert')).toHaveTextContent('연습 정보를 불러올 수 없습니다.')
  })

  it('retries initialization and renders the simulation after recovery', async () => {
    const user = userEvent.setup()
    api.getSimulation
      .mockRejectedValueOnce(new Error('일시적인 오류입니다.'))
      .mockResolvedValueOnce(session)
    renderScreen()

    await user.click(await screen.findByRole('button', { name: '다시 시도' }))

    expect(await screen.findByLabelText('메시지 입력')).toBeVisible()
    expect(api.getSimulation).toHaveBeenCalledTimes(2)
  })

  it('returns to the scenario list from an initialization error', async () => {
    const user = userEvent.setup()
    api.getSimulation.mockRejectedValue(new Error('실패'))
    renderScreen()

    await user.click(await screen.findByRole('button', { name: '시나리오 목록' }))

    expect(await screen.findByRole('heading', { name: '시나리오 목록' })).toBeVisible()
  })

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
