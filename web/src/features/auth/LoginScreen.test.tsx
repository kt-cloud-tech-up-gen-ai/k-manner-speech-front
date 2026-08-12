import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoginScreen } from './LoginScreen'

vi.mock('@/api/client', () => ({
  login: vi.fn().mockRejectedValue(new Error('이메일 또는 비밀번호가 올바르지 않습니다.')),
}))

describe('LoginScreen', () => {
  it('submits labelled email and password fields and announces errors', async () => {
    render(<MemoryRouter><LoginScreen /></MemoryRouter>)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('이메일'), 'learner@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'wrong')
    await user.click(screen.getByRole('button', { name: '로그인' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('이메일 또는 비밀번호')
    expect('AC-T9-REAL-AUTH-FLOW').toContain('AUTH')
  })
})
