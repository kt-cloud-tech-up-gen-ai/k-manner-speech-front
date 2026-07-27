import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'

/** The check badge shared by both selectable shapes. */
function CheckBadge({ show, size = 20 }: { show: boolean; size?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-primary text-white"
      style={{ width: size, height: size }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.5 }}
      transition={T.dissolve}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12">
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
  )
}

/**
 * P03 · Purpose — a 2-up grid tile. Selected state is a 9% primary wash with a
 * solid primary hairline; the subtitle shifts to #47619C.
 */
export function SelectTile({
  title,
  subtitle,
  selected,
  onClick,
}: {
  title: string
  subtitle: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileTap={{ scale: PRESS.button }}
      transition={T.dissolve}
      className={cn(
        'flex h-20 flex-1 flex-col justify-between rounded-2xl border p-3.5 text-left',
        'transition-[background-color,border-color] duration-200 ease-figma',
        selected
          ? 'border-primary bg-primary/9'
          : 'border-select-border bg-surface hover:bg-surface-sunken/40',
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span
          className={cn(
            'text-base font-bold',
            selected ? 'text-primary-deeper' : 'text-ink',
          )}
        >
          {title}
        </span>
        <CheckBadge show={selected} size={20} />
      </span>
      <span
        className={cn(
          'text-xs leading-tight',
          selected ? 'text-primary-subtle-ink' : 'text-muted',
        )}
      >
        {subtitle}
      </span>
    </motion.button>
  )
}

/**
 * P04 · Weekly Pace — a full-width row with a numbered tile on the left.
 * The tile inverts to solid primary when the row is selected.
 */
export function SelectRow({
  badge,
  label,
  description,
  selected,
  onClick,
}: {
  badge: string
  label: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileTap={{ scale: PRESS.card }}
      transition={T.dissolve}
      className={cn(
        'flex h-[74px] w-full items-center gap-3.5 rounded-2xl border px-[18px] text-left',
        'transition-[background-color,border-color] duration-200 ease-figma',
        selected
          ? 'border-primary bg-primary/9'
          : 'border-select-border bg-surface hover:bg-surface-sunken/40',
      )}
    >
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-[15px] font-bold',
          'transition-colors duration-200 ease-figma',
          selected ? 'bg-primary text-white' : 'bg-surface-sunken text-muted-2',
        )}
      >
        {badge}
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            'truncate text-md font-bold',
            selected ? 'text-primary-deeper' : 'text-ink',
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'truncate text-xs',
            selected ? 'text-primary-subtle-ink' : 'text-muted',
          )}
        >
          {description}
        </span>
      </span>

      <CheckBadge show={selected} size={22} />
    </motion.button>
  )
}
