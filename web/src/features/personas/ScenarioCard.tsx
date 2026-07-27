import { motion } from 'motion/react'
import type { Difficulty, Scenario } from '@/api/types'
import { Chip, type ChipTone } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'

const DIFFICULTY: Record<Difficulty, { label: string; tone: ChipTone }> = {
  easy: { label: '난이도 하', tone: 'easy' },
  medium: { label: '난이도 중', tone: 'medium' },
  hard: { label: '난이도 상', tone: 'hard' },
}

/**
 * P08 · Scenario card. Three visual states in the design: recommended (blue
 * hairline + glow), plain, and login-gated (muted surface, padlock badge and
 * a "로그인 시 이용 가능" chip).
 */
export function ScenarioCard({
  scenario,
  onClick,
}: {
  scenario: Scenario
  onClick: () => void
}) {
  const locked = scenario.requiresLogin
  const difficulty = DIFFICULTY[scenario.difficulty]

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: PRESS.card }}
      transition={T.instant}
      className={cn(
        'relative flex flex-col gap-1.5 rounded-3xl border p-4 text-left',
        'transition-[border-color,box-shadow] duration-200 ease-figma',
        locked ? 'bg-surface-muted' : 'bg-surface',
        scenario.recommended ? 'border-primary shadow-card-selected' : 'border-line',
      )}
    >
      {locked && (
        <span className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-surface-dark/82 text-white">
          <Icon name="lock" size={14} weight={1.4} />
        </span>
      )}

      <div className="flex items-center gap-2">
        {scenario.recommended && <Chip tone="solid">추천</Chip>}
        <Chip tone={difficulty.tone}>{difficulty.label}</Chip>
        <span className="text-2xs font-medium text-muted">
          약 {scenario.estimatedMinutes}분
        </span>
        {scenario.inProgress && (
          <Chip tone="medium" className="ml-auto">
            진행중
          </Chip>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-1.5 pt-1">
        <span
          className={cn(
            'text-lg font-bold',
            scenario.recommended ? 'text-ink' : 'text-ink-2',
          )}
        >
          {scenario.title.ko}
        </span>
        {/* The design pairs the English title only on the recommended card. */}
        {scenario.recommended && (
          <span className="text-sm font-medium text-muted">{scenario.title.en}</span>
        )}
      </div>

      <p
        className={cn(
          'text-xs leading-body',
          scenario.recommended ? 'text-muted-2' : 'text-muted',
        )}
      >
        목표 · {scenario.goal}
      </p>

      {locked && (
        <Chip tone="primary" icon={<Icon name="lock" size={11} weight={1.3} />} className="mt-1.5 self-start rounded-md">
          로그인 시 이용 가능
        </Chip>
      )}
    </motion.button>
  )
}
