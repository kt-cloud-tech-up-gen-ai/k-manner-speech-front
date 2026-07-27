import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ScreenBody } from '@/components/shell/Screen'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import type { Locale } from '@/api/types'

const OPTIONS: Array<{ id: Locale; title: string; subtitle: string }> = [
  { id: 'ko', title: '한국어', subtitle: 'Korean' },
  { id: 'en', title: 'English', subtitle: '영어' },
]

/**
 * P02L · Language Selection.
 *
 * This frame predates the Inter-based system — it is set in Noto Sans KR with
 * Space Grotesk subtitles and its own warmer palette, so it deliberately does
 * not reuse the shared Card/Button primitives.
 *
 * Switching between the two options is SMART_ANIMATE at 250ms in the
 * prototype, which is why the indicator and border are animated rather than
 * swapped.
 */
export function LanguageScreen() {
  const navigate = useNavigate()
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)

  return (
    <div className="font-splash flex h-full flex-col bg-bg">
      <header className="flex h-[54px] shrink-0 items-start justify-between px-[22px] pt-[13px]">
        <h1 className="text-[16px] leading-[21px] font-bold text-ink">언어 선택</h1>
        <span className="font-mono text-[11px] leading-[15px] font-medium text-muted">
          Language
        </span>
      </header>

      <ScreenBody className="px-6">
        <div className="mt-6 flex h-[52px] w-[52px] items-center justify-center rounded-3xl bg-lang-tile">
          <span className="text-[22px] leading-[28px] font-bold text-primary-strong">가</span>
        </div>

        <h2 className="mt-4 text-[27px] leading-[36px] font-bold whitespace-pre-line text-ink">
          {'사용할 언어를\n선택해 주세요'}
        </h2>
        <p className="mt-2 text-[12.5px] leading-[20px] text-lang-help">
          한국어 또는 English를 선택할 수 있습니다.
        </p>

        <div className="mt-[46px] flex flex-col gap-3">
          {OPTIONS.map((option) => {
            const selected = locale === option.id
            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => setLocale(option.id)}
                aria-pressed={selected}
                whileTap={{ scale: PRESS.card }}
                transition={T.smart}
                className={cn(
                  'relative flex h-[92px] items-center gap-4 rounded-3xl bg-surface px-[18px] text-left',
                  'transition-[border-color,box-shadow] duration-250 ease-figma',
                  selected
                    ? 'border-2 border-lang-selected'
                    : 'border border-lang-border',
                )}
              >
                <motion.span
                  className={cn(
                    'flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full',
                    'transition-colors duration-250 ease-figma',
                    selected
                      ? 'bg-primary text-white'
                      : 'border border-lang-border bg-surface',
                  )}
                  animate={{ scale: selected ? 1 : 0.94 }}
                  transition={T.smart}
                >
                  <motion.svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: selected ? 1 : 0, scale: selected ? 1 : 0.6 }}
                    transition={T.smart}
                  >
                    <path
                      d="m3 8 3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.span>

                <span className="flex flex-col gap-1">
                  <span className="text-[18px] leading-[24px] font-bold text-ink">
                    {option.title}
                  </span>
                  <span className="font-mono text-[11.5px] leading-[15px] font-medium text-lang-help">
                    {option.subtitle}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-4 mb-6 flex gap-5 rounded-2xl bg-lang-note px-4 py-4">
          <span className="font-mono text-[12px] leading-[16px] font-bold text-lang-help">
            i
          </span>
          <span className="flex flex-col gap-[7px]">
            <span className="text-[11.5px] leading-[17px] font-medium text-ink-2">
              선택한 언어는 설정에서 언제든 바꿀 수 있어요.
            </span>
            <span className="font-mono text-[10px] leading-[14px] text-muted">
              You can change this anytime in Settings.
            </span>
          </span>
        </div>
      </ScreenBody>

      <footer className="shrink-0 border-t border-lang-rule bg-bg px-6 pt-4 pb-[30px]">
        <Button shape="pill" onClick={() => navigate('/onboarding/purpose')} className="font-sans">
          다음 · Next
        </Button>
      </footer>
    </div>
  )
}
