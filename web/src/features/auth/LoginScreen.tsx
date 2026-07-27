import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ScreenBody } from '@/components/shell/Screen'
import { BackButton } from '@/components/shell/TopBar'
import { Button } from '@/components/ui/Button'
import { EASE_OUT, PRESS, T } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'

/** Google's brand mark, drawn inline so nothing is fetched at runtime. */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.93v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.93a9 9 0 0 0 0 8.1l3.04-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .93 4.95l3.04 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  )
}

/**
 * P11 · Login. Reached from the home greeting, a locked persona/scenario, or
 * the settings account row — always skippable, since the app is usable as a
 * guest and the design says so explicitly.
 */
export function LoginScreen() {
  const navigate = useNavigate()
  const signIn = useAppStore((s) => s.signIn)

  function continueAsGuest() {
    navigate(-1)
  }

  function signInWithGoogle() {
    signIn()
    navigate('/home')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-[46px] shrink-0 items-center justify-between px-6 pt-1.5">
        <BackButton onClick={() => navigate(-1)} bare />
        <button
          type="button"
          onClick={continueAsGuest}
          className="text-sm font-semibold text-muted outline-none hover:text-ink-4"
        >
          나중에 · Skip
        </button>
      </header>

      <ScreenBody className="items-center px-[27px]">
        <motion.div
          className="mt-[110px] flex h-[60px] w-[60px] items-center justify-center rounded-3xl bg-primary shadow-cta-strong"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <span className="font-mono text-[24px] leading-[30px] font-bold text-white">
            K
          </span>
        </motion.div>

        <h1 className="mt-[22px] text-xl font-bold tracking-title text-ink">
          진행 상황을 저장할까요?
        </h1>
        <p className="mt-2.5 text-base leading-[21px] whitespace-pre-line text-center text-ink-4">
          {'로그인하면 연습 기록·통계가 저장돼요\nSign in to save your progress'}
        </p>

        {/* Guest-progress notice */}
        <motion.div
          className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.1 }}
        >
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-medium/16 font-mono text-base font-bold text-medium-ink">
            !
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-ink">
              게스트 진행 · 연습내역 2회
            </span>
            <span className="text-xs text-muted">아직 저장되지 않았어요</span>
          </span>
        </motion.div>

        <div className="mt-auto w-full pb-2">
          <motion.button
            type="button"
            onClick={signInWithGoogle}
            whileTap={{ scale: PRESS.card }}
            transition={T.instant}
            className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-[#747775] bg-surface text-md font-medium text-[#1F1F1F] transition-colors duration-200 ease-figma hover:bg-surface-sunken/50"
          >
            <GoogleMark />
            Google로 계속하기
          </motion.button>

          <Button variant="ghost" size="md" onClick={continueAsGuest} className="mt-3">
            게스트로 계속 · Keep exploring
          </Button>

          <p className="mt-3 pb-4 text-center text-2xs leading-[17px] whitespace-pre-line text-muted">
            {'계속하면 이용약관 및 개인정보처리방침에\n동의하게 됩니다.'}
          </p>
        </div>
      </ScreenBody>
    </div>
  )
}
