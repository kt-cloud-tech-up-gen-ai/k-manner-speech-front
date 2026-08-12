import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAppStore } from '@/store/useAppStore'
import { SettingsScreen } from './SettingsScreen'

const api = vi.hoisted(() => ({
  getPaceOptions: vi.fn().mockResolvedValue([]),
  logout: vi.fn().mockResolvedValue(undefined),
  withdraw: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/api/client', () => api)

describe('SettingsScreen account actions', () => {
  afterEach(cleanup)

  beforeEach(() => {
    vi.clearAllMocks()
    useAppStore.setState({ signedIn: true })
  })

  it('calls the backend before completing logout', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><SettingsScreen /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: '로그아웃' }))

    expect(api.logout).toHaveBeenCalledOnce()
    expect(useAppStore.getState().signedIn).toBe(false)
  })

  it('calls the backend before deleting member state', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><SettingsScreen /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: '회원탈퇴데이터 삭제' }))
    await user.click(screen.getByRole('button', { name: '탈퇴' }))

    expect(api.withdraw).toHaveBeenCalledOnce()
    expect(useAppStore.getState().signedIn).toBe(false)
  })

  it('keeps member state when withdrawal fails', async () => {
    api.withdraw.mockRejectedValueOnce(new Error('network error'))
    const user = userEvent.setup()
    render(<MemoryRouter><SettingsScreen /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: '회원탈퇴데이터 삭제' }))
    await user.click(screen.getByRole('button', { name: '탈퇴' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('회원탈퇴를 완료하지 못했습니다')
    expect(useAppStore.getState().signedIn).toBe(true)
  })
})
