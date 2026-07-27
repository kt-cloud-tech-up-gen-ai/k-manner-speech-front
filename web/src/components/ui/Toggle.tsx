import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { T } from '@/lib/motion'

/**
 * 40x23 pill with an 18px thumb — P13 (on, #466CC8) and P13B (off, #D6D1C7).
 * The prototype morphs between the two with SMART_ANIMATE at 250ms.
 */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex h-[23px] w-10 shrink-0 items-center rounded-full p-[2.5px] outline-none',
        'transition-colors duration-250 ease-figma',
        'focus-visible:ring-2 focus-visible:ring-primary/40',
        checked ? 'bg-primary' : 'bg-toggle-off',
      )}
    >
      <motion.span
        layout
        className="block h-[18px] w-[18px] rounded-full bg-white"
        animate={{ x: checked ? 17 : 0 }}
        transition={T.smart}
      />
    </button>
  )
}
