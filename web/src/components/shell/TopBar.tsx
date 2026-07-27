import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'

/**
 * Onboarding header: back chevron, a 5px progress track and an "n / 3"
 * counter (P03 = 1/3, P04 = 2/3, P05 = 3/3).
 */
export function Stepper({
  step,
  total = 3,
  onBack,
}: {
  step: number
  total?: number
  onBack?: () => void
}) {
  return (
    <div className="flex h-[30px] shrink-0 items-center gap-3.5 px-6 pt-2">
      <BackButton onClick={onBack} bare />
      <div className="h-[5px] flex-1 overflow-hidden rounded-sm bg-[rgb(40_33_18/0.1)]">
        <motion.div
          className="h-full rounded-sm bg-primary"
          initial={false}
          animate={{ width: `${(step / total) * 100}%` }}
          transition={T.push}
        />
      </div>
      <span className="font-mono text-sm leading-tight font-bold text-muted-2">
        {step} / {total}
      </span>
    </div>
  )
}

/** The bare "‹" used across onboarding and detail screens. */
export function BackButton({
  onClick,
  bare = false,
  className,
}: {
  onClick?: () => void
  bare?: boolean
  className?: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="뒤로"
      whileTap={{ scale: PRESS.icon }}
      transition={T.instant}
      className={cn(
        'flex shrink-0 items-center justify-center text-ink-4 outline-none',
        bare
          ? 'h-[22px] w-2'
          : 'h-[34px] w-[34px] rounded-lg bg-surface-sunken hover:bg-surface-sunken/70',
        className,
      )}
    >
      <svg width="8" height="16" viewBox="0 0 8 16" aria-hidden="true">
        <path
          d="M7 1 1.5 8 7 15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  )
}

