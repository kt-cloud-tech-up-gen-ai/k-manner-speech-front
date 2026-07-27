import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import type { Locale } from '@/api/types'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'

const CHOICES: Array<{ id: Locale; title: string; subtitle: string }> = [
  { id: 'ko', title: '한국어', subtitle: 'Korean' },
  { id: 'en', title: 'English', subtitle: '영어' },
]

/**
 * `Overlay · Language Picker` — opened from the 언어 row in P13, saved with a
 * pill button. Switching between choices is SWAP/SMART_ANIMATE at 220ms in
 * the prototype.
 */
export function LanguagePickerSheet({
  open,
  locale,
  onClose,
  onSave,
}: {
  open: boolean
  locale: Locale
  onClose: () => void
  onSave: (next: Locale) => void
}) {
  const [draft, setDraft] = useState<Locale>(locale)

  useEffect(() => {
    if (open) setDraft(locale)
  }, [open, locale])

  return (
    <BottomSheet open={open} onClose={onClose} label="언어 선택">
      <div className="font-splash px-6 pt-4 pb-6">
        <h2 className="text-[22px] leading-[26px] font-bold text-ink">언어 선택</h2>
        <p className="mt-2 text-base leading-[16px] text-lang-help">Choose language</p>

        <div className="mt-5 flex flex-col gap-3">
          {CHOICES.map((choice) => {
            const selected = draft === choice.id
            return (
              <motion.button
                key={choice.id}
                type="button"
                onClick={() => setDraft(choice.id)}
                aria-pressed={selected}
                whileTap={{ scale: PRESS.card }}
                transition={T.swap}
                className={cn(
                  'flex h-[72px] items-center gap-4 rounded-2xl px-[18px] text-left',
                  'transition-[background-color,border-color] duration-220 ease-figma',
                  selected
                    ? 'border-2 border-primary bg-choice-selected'
                    : 'border border-lang-border bg-surface',
                )}
              >
                <motion.span
                  className={cn(
                    'flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full',
                    'transition-colors duration-220 ease-figma',
                    selected
                      ? 'bg-primary text-white'
                      : 'border border-lang-border bg-surface',
                  )}
                  animate={{ scale: selected ? 1 : 0.94 }}
                  transition={T.swap}
                >
                  <motion.svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: selected ? 1 : 0, scale: selected ? 1 : 0.6 }}
                    transition={T.swap}
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

                <span className="flex flex-1 flex-col gap-1.5">
                  <span className="text-lg leading-[19px] font-bold text-ink">
                    {choice.title}
                  </span>
                  <span className="text-sm leading-[14px] text-lang-help">
                    {choice.subtitle}
                  </span>
                </span>

                {selected && (
                  <motion.span
                    layoutId="lang-selected-badge"
                    className="rounded-xl bg-choice-selected px-4 py-1.5 text-xs font-bold text-primary"
                    transition={T.swap}
                  >
                    선택됨
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>

        <Button
          shape="pill"
          elevated={false}
          onClick={() => onSave(draft)}
          className="mt-6 text-[15px] font-bold"
        >
          저장 · Save
        </Button>

        <p className="mt-3.5 text-xs leading-[13px] text-lang-help">
          앱 화면 · 학습 안내 · 코치 메시지에 적용
        </p>
      </div>
    </BottomSheet>
  )
}
