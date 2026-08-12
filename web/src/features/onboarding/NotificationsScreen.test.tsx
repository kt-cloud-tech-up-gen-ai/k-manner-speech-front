import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAppStore } from '@/store/useAppStore'
import { NotificationsScreen } from './NotificationsScreen'

const saveOnboarding = vi.fn()

vi.mock('@/api/client', () => ({
  saveOnboarding: (...args: unknown[]) => saveOnboarding(...args),
}))

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/onboarding/notifications']}>
      <Routes>
        <Route path="/onboarding/notifications" element={<NotificationsScreen />} />
        <Route path="/home" element={<h1>홈</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('NotificationsScreen', () => {
  afterEach(cleanup)

  beforeEach(() => {
    localStorage.clear()
    useAppStore.getState().reset()
    saveOnboarding.mockReset()
  })

  it('renders the final onboarding step without an update loop', () => {
    renderScreen()

    expect(screen.getByRole('heading', { name: /정한 횟수만큼/ })).toBeVisible()
    expect(screen.getByRole('button', { name: '나중에 · Not now' })).toBeEnabled()
    expect(
      screen.getByRole('button', { name: '알림 켜기 · Allow notifications' }),
    ).toBeEnabled()
  })

  it('completes guest onboarding locally without calling the API', async () => {
    const user = userEvent.setup()
    renderScreen()

    await user.click(
      screen.getByRole('button', { name: '알림 켜기 · Allow notifications' }),
    )

    expect(await screen.findByRole('heading', { name: '홈' })).toBeVisible()
    expect(useAppStore.getState()).toMatchObject({
      notificationsAllowed: true,
      onboardingComplete: true,
    })
    expect(saveOnboarding).not.toHaveBeenCalled()
  })
})
