import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ChipTone =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'primary'
  | 'solid'
  | 'neutral'
  | 'dark'
  /** P06.1 tutorial step badge. */
  | 'info'
  /** P09 feedback sheet: flagged-timestamp and score chips. */
  | 'issue'
  | 'score'

/** `sm` is the 7px-radius chip; `pill` is the fully-rounded one (P09 표정). */
export type ChipShape = 'sm' | 'md' | 'pill'

const TONES: Record<ChipTone, string> = {
  // Difficulty chips are a 14–16% tint of the hue with a deep ink label.
  easy: 'bg-easy/14 text-easy-ink',
  medium: 'bg-medium/16 text-medium-ink',
  hard: 'bg-hard/14 text-hard-ink',
  primary: 'bg-primary/10 text-primary-deep',
  solid: 'bg-primary text-white',
  neutral: 'bg-surface-sunken text-muted-2',
  dark: 'bg-surface-dark/85 text-white',
  info: 'bg-lang-tile text-primary-strong',
  issue: 'bg-issue-chip text-issue-ink',
  score: 'bg-score-chip text-primary-deep',
}

const SHAPES: Record<ChipShape, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  pill: 'rounded-full',
}

/** 20–23px pill, 10px 600-weight label, 9px horizontal padding, radius 7. */
export function Chip({
  tone = 'neutral',
  shape = 'sm',
  icon,
  children,
  className,
}: {
  tone?: ChipTone
  shape?: ChipShape
  icon?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 px-[9px] py-1',
        'text-2xs leading-tight font-semibold whitespace-nowrap',
        SHAPES[shape],
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
