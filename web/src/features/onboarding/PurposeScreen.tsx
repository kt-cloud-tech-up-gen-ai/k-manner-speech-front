import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { getPurposeOptions } from '@/api/client'
import type { PurposeOption } from '@/api/types'
import { SelectTile } from '@/components/ui/SelectCard'
import { PRESS, T } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import { OnboardingLayout } from './OnboardingLayout'

const OTHER = 'other'

/** P03 · Purpose — multi-select, 2-up grid, plus a free-text "기타 · Other". */
export function PurposeScreen() {
  const navigate = useNavigate()
  const [options, setOptions] = useState<PurposeOption[]>([])
  const purposes = useAppStore((s) => s.purposes)
  const togglePurpose = useAppStore((s) => s.togglePurpose)
  const purposeOther = useAppStore((s) => s.purposeOther)
  const setPurposeOther = useAppStore((s) => s.setPurposeOther)

  useEffect(() => {
    getPurposeOptions().then(setOptions)
  }, [])

  const otherSelected = purposes.includes(OTHER)

  // Pairs so the grid keeps the design's 2-up rhythm even at odd counts.
  const rows: PurposeOption[][] = []
  for (let i = 0; i < options.length; i += 2) rows.push(options.slice(i, i + 2))

  return (
    <OnboardingLayout
      step={1}
      heading={'무엇을 연습하고\n싶나요?'}
      subheading="여러 개 선택할 수 있어요 · Pick a few"
      primaryLabel="다음 · Next"
      primaryDisabled={purposes.length === 0}
      onPrimary={() => navigate('/onboarding/pace')}
    >
      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2.5">
            {row.map((option) => (
              <SelectTile
                key={option.id}
                title={option.label.ko}
                subtitle={option.label.en}
                selected={purposes.includes(option.id)}
                onClick={() => togglePurpose(option.id)}
              />
            ))}
            {row.length === 1 && <div className="flex-1" />}
          </div>
        ))}

        {/* 기타 · Other — a wide tile that reveals a text field when picked. */}
        <motion.button
          type="button"
          onClick={() => togglePurpose(OTHER)}
          aria-pressed={otherSelected}
          whileTap={{ scale: PRESS.card }}
          transition={T.dissolve}
          className={cn(
            'flex h-16 w-full items-center justify-between gap-4 rounded-2xl border px-4 text-left',
            'transition-[background-color,border-color] duration-200 ease-figma',
            otherSelected
              ? 'border-primary bg-primary/9'
              : 'border-select-border bg-surface hover:bg-surface-sunken/40',
          )}
        >
          <span className="flex flex-col gap-[3px]">
            <span
              className={cn(
                'text-base font-bold',
                otherSelected ? 'text-primary-deeper' : 'text-ink',
              )}
            >
              기타 · Other
            </span>
            <span
              className={cn(
                'text-xs',
                otherSelected ? 'text-primary-subtle-ink' : 'text-muted',
              )}
            >
              직접 입력해 주세요 · Type your own
            </span>
          </span>
          <motion.span
            aria-hidden="true"
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-primary text-white"
            initial={false}
            animate={{ opacity: otherSelected ? 1 : 0, scale: otherSelected ? 1 : 0.5 }}
            transition={T.dissolve}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="m2 6.4 2.6 2.6L10 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </motion.button>

        <AnimatePresence initial={false}>
          {otherSelected && (
            <motion.div
              key="other-field"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={T.dissolve}
              className="overflow-hidden"
            >
              <input
                value={purposeOther}
                onChange={(e) => setPurposeOther(e.target.value)}
                placeholder="예: 교수님과 상담, 발표·PT, 집주인과 대화"
                aria-label="기타 학습 목적"
                className="h-11 w-full rounded-[14px] border border-primary bg-surface px-4 text-base text-ink outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary/30"
              />
              <p className="mt-2 px-0.5 text-2xs text-muted">
                예: 교수님과 상담, 발표·PT, 집주인과 대화
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OnboardingLayout>
  )
}
