import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ScreenBody } from '@/components/shell/Screen'
import { Stepper } from '@/components/shell/TopBar'
import { Button } from '@/components/ui/Button'
import { EASE_OUT } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import { saveOnboarding } from '@/api/client'

const BULLETS = [
  '선택한 빈도에 맞춘 연습 알림',
  '새 피드백 · 시나리오 소식',
  '설정에서 언제든 끌 수 있어요',
]

/**
 * P05 · Notifications — the last onboarding step. Unlike P03/P04 the content
 * is centred, so it builds on Stepper directly rather than OnboardingLayout.
 */
export function NotificationsScreen() {
  const navigate = useNavigate()
  const setNotifications = useAppStore((s) => s.setNotifications)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const signedIn = useAppStore((s) => s.signedIn)
  const locale = useAppStore((s) => s.locale)
  const purposes = useAppStore((s) => s.purposes)
  const purposeOther = useAppStore((s) => s.purposeOther)
  const pace = useAppStore((s) => s.pace)
  const profile = useAppStore((s) => s.profile)
  const [error, setError] = useState('')

  async function finish(allowed: boolean) {
    setNotifications(allowed)
    if (signedIn) {
      try {
        await saveOnboarding({
          locale,
          purposes,
          purposeOther,
          pace,
          profile,
          notificationsAllowed: allowed,
        })
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : '저장할 수 없습니다.')
        return
      }
    }
    completeOnboarding()
    navigate('/home')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <Stepper step={3} onBack={() => navigate(-1)} />

      <ScreenBody className="items-center px-[26px] pt-2">
        <motion.div
          className="mt-[93px] flex h-[92px] w-[92px] items-center justify-center rounded-full bg-primary/10 text-primary-strong"
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <motion.svg
            width="44"
            height="46"
            viewBox="0 0 44 46"
            aria-hidden="true"
            initial={{ rotate: -8 }}
            animate={{ rotate: [-8, 8, -4, 0] }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
            style={{ originY: 0.15 }}
          >
            {/* Dome: 16px radius on top, 5px at the base — Figma's 16/16/5/5. */}
            <rect x="17.5" y="0" width="9" height="9" rx="4.5" fill="currentColor" />
            <path
              d="M6 32V24a16 16 0 0 1 32 0v8a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5Z"
              fill="currentColor"
            />
            <rect x="1" y="36" width="42" height="5" rx="2.5" fill="currentColor" />
            <rect x="17.5" y="41" width="9" height="9" rx="4.5" fill="currentColor" />
          </motion.svg>
        </motion.div>

        <h1 className="mt-[21px] text-2xl leading-heading font-bold tracking-title whitespace-pre-line text-center text-ink">
          {'정한 횟수만큼\n잊지 않게 알려드려요'}
        </h1>
        <p className="mt-2 text-base leading-[21px] whitespace-pre-line text-center text-ink-4">
          {'선택한 주간 횟수에 맞춰,\n부드럽게 알려드려요'}
        </p>

        <ul className="mt-[22px] flex w-full flex-col gap-3 pb-6">
          {BULLETS.map((text, i) => (
            <motion.li
              key={text}
              className="flex items-center gap-[11px]"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.15 + i * 0.07 }}
            >
              <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-deep">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path
                    d="m2 6.4 2.6 2.6L10 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-ink-2">{text}</span>
            </motion.li>
          ))}
        </ul>
      </ScreenBody>

      <footer className="flex shrink-0 flex-col gap-3 px-[26px] pt-2 pb-[30px]">
        {error && <p role="alert" className="text-sm text-hard-ink">{error}</p>}
        <Button variant="ghost" size="md" onClick={() => finish(false)}>
          나중에 · Not now
        </Button>
        <Button onClick={() => finish(true)}>알림 켜기 · Allow notifications</Button>
      </footer>
    </div>
  )
}
