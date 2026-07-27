import { motion } from 'motion/react'
import type { Persona } from '@/api/types'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'

const AVATAR_GRADIENT = 'linear-gradient(135deg, #E7E1D4 0%, #DED7C8 100%)'

/**
 * P07 · Personas grid tile. Locked personas drop to the muted surface, dim
 * their content to 50% and swap the relationship chip for a login prompt.
 */
export function PersonaCard({
  persona,
  selected = false,
  onClick,
}: {
  persona: Persona
  selected?: boolean
  onClick: () => void
}) {
  const locked = persona.requiresLogin

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: PRESS.button }}
      transition={T.instant}
      className={cn(
        'relative flex h-[162px] w-full flex-col rounded-3xl border p-[15px] text-left',
        'transition-[border-color,box-shadow] duration-200 ease-figma',
        locked ? 'bg-surface-muted' : 'bg-surface',
        selected ? 'border-primary shadow-card-selected' : 'border-line',
      )}
    >
      {locked && (
        <span className="absolute top-[13px] right-[13px] flex h-7 w-7 items-center justify-center rounded-full bg-surface-dark/82 text-white">
          <Icon name="lock" size={14} weight={1.4} />
        </span>
      )}

      <div className={cn('flex flex-1 flex-col', locked && 'opacity-50')}>
        <span
          className="block h-14 w-14 shrink-0 rounded-2xl"
          style={{ background: AVATAR_GRADIENT }}
        />
        <span className="mt-3 text-md font-bold text-ink">{persona.name}</span>
        <span className="mt-0.5 text-xs text-muted">{persona.role}</span>
      </div>

      {/* Blue chip on the highlighted card and on login-gated ones; the
          neutral #F1EDE4 chip everywhere else. */}
      <Chip tone={locked || selected ? 'primary' : 'neutral'} className="self-start">
        {persona.relationship}
      </Chip>
    </motion.button>
  )
}
