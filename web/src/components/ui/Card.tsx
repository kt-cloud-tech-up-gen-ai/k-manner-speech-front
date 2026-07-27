import type { ComponentProps, ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'

/** The design uses two card radii: 16px for grouped rows, 18px for content. */
export type CardRadius = 'md' | 'lg'

type Props = Omit<ComponentProps<typeof motion.div>, 'children'> & {
  /** Selected cards swap the hairline for a #466CC8 border + blue glow. */
  selected?: boolean
  /** Locked / login-gated cards sit on #FBF9F5 instead of white. */
  muted?: boolean
  interactive?: boolean
  radius?: CardRadius
  children: ReactNode
}

/** The bordered surface behind scenarios, personas and settings groups. */
export function Card({
  selected = false,
  muted = false,
  interactive = false,
  radius = 'lg',
  className,
  children,
  ...rest
}: Props) {
  return (
    <motion.div
      whileTap={interactive ? { scale: PRESS.card } : undefined}
      transition={T.instant}
      className={cn(
        'relative border transition-[border-color,box-shadow,background-color]',
        'duration-200 ease-figma',
        radius === 'md' ? 'rounded-2xl' : 'rounded-3xl',
        muted ? 'bg-surface-muted' : 'bg-surface',
        selected ? 'border-primary shadow-card-selected' : 'border-line',
        interactive && 'cursor-pointer text-left',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * The Korean-label / English-subtitle pair the design repeats on every header
 * and section title: "페르소나 Personas", "오늘의 추천 Today's pick".
 */
export function TitlePair({
  ko,
  en,
  size = 'page',
  className,
}: {
  ko: string
  en?: string
  size?: 'page' | 'section'
  className?: string
}) {
  return (
    <h2 className={cn('flex items-baseline gap-1.5', className)}>
      <span
        className={cn(
          'font-bold text-ink',
          size === 'page' ? 'text-2xl tracking-title' : 'text-md',
        )}
      >
        {ko}
      </span>
      {en && (
        <span
          className={cn(
            'font-medium text-muted',
            size === 'page' ? 'text-md tracking-title' : 'text-xs',
          )}
        >
          {en}
        </span>
      )}
    </h2>
  )
}
