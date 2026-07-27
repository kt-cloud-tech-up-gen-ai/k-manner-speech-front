import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { T } from '@/lib/motion'

/** A titled card group: 10px uppercase label, then hairline-separated rows. */
export function SettingsGroup({
  label,
  children,
}: {
  label?: string
  children: ReactNode
}) {
  return (
    <Card radius="md" className="overflow-hidden" role="group">
      {label && (
        <h2 className="px-4 pt-[9px] pb-[5px] text-2xs font-semibold tracking-[0.02em] text-muted">
          {label}
        </h2>
      )}
      {children}
    </Card>
  )
}

/**
 * One settings row. `value` renders the trailing "주 3회 ›" style text,
 * `control` renders an interactive trailing element (the 알림 toggle).
 */
export function SettingsRow({
  title,
  value,
  control,
  onClick,
  tone = 'default',
  first = false,
  chevron = true,
}: {
  title: string
  value?: string
  control?: ReactNode
  onClick?: () => void
  tone?: 'default' | 'muted' | 'danger'
  first?: boolean
  /** The sign-out / delete group carries no chevrons in the design. */
  chevron?: boolean
}) {
  const Element = onClick ? motion.button : motion.div

  return (
    <Element
      {...(onClick ? { type: 'button' as const, onClick, whileTap: { scale: 0.99 } } : {})}
      transition={T.instant}
      className={cn(
        'flex w-full items-center justify-between gap-3 px-4 py-[13px] text-left',
        'transition-colors duration-200 ease-figma',
        !first && 'border-t border-line-softer',
        onClick && 'hover:bg-surface-sunken/40',
      )}
    >
      <span
        className={cn(
          'text-md font-medium',
          tone === 'danger' && 'text-danger-ink',
          tone === 'muted' && 'text-ink-4',
          tone === 'default' && 'text-ink',
        )}
      >
        {title}
      </span>

      {control ?? (
        <span className="flex items-center gap-1 text-sm text-muted">
          {value}
          {onClick && chevron && (
            <span aria-hidden="true" className="text-[19px] leading-none text-muted-4">
              ›
            </span>
          )}
        </span>
      )}
    </Element>
  )
}
