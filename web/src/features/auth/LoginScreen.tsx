import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, login, signup } from '@/api/client'
import { ScreenBody } from '@/components/shell/Screen'
import { BackButton } from '@/components/shell/TopBar'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'

export function LoginScreen() {
  const navigate = useNavigate()
  const markSignedIn = useAppStore((state) => state.signIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해 주세요.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      if (mode === 'login') await login(email.trim(), password)
      else await signup(email.trim(), password)
      // 응답만 성공하고 인증 쿠키가 저장되지 않은 경우를 로그인으로 표시하지 않는다.
      await getMe()
      markSignedIn()
      navigate('/home')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '로그인할 수 없습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-[46px] shrink-0 items-center justify-between px-6 pt-1.5">
        <BackButton onClick={() => navigate(-1)} bare />
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-muted">
          나중에 · Skip
        </button>
      </header>
      <ScreenBody className="items-center px-[27px]">
        <div className="mt-14 flex h-[60px] w-[60px] items-center justify-center rounded-3xl bg-primary shadow-cta-strong">
          <span className="font-mono text-[24px] font-bold text-white">K</span>
        </div>
        <h1 className="mt-5 text-xl font-bold text-ink">
          {mode === 'login' ? '이메일로 로그인' : '계정 만들기'}
        </h1>
        <form onSubmit={submit} className="mt-6 flex w-full flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
            이메일
            <input
              type="email" value={email} onChange={(event) => setEmail(event.target.value)}
              autoComplete="email" className="h-12 rounded-xl border border-line bg-surface px-4 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
            비밀번호
            <input
              type="password" value={password} onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="h-12 rounded-xl border border-line bg-surface px-4 font-normal"
            />
          </label>
          {error && <p role="alert" className="text-sm text-hard-ink">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? '처리 중…' : mode === 'login' ? '로그인' : '회원가입'}
          </Button>
        </form>
        <button
          type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="mt-3 text-sm font-semibold text-primary"
        >
          {mode === 'login' ? '처음이신가요? 회원가입' : '이미 계정이 있나요? 로그인'}
        </button>
        <Button variant="ghost" size="md" onClick={() => navigate(-1)} className="mt-auto mb-4">
          게스트로 계속 · Keep exploring
        </Button>
      </ScreenBody>
    </div>
  )
}
