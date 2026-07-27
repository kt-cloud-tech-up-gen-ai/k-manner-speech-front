import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { PRESS, T } from '@/lib/motion'

/**
 * The search affordance shared by P07-1 and P08-1: tapping the outlined
 * magnifier button in the header expands a 36px field underneath it. The
 * field animates its height so the grid below slides rather than jumps.
 */
export function SearchToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? '검색 닫기' : '검색 열기'}
      whileTap={{ scale: PRESS.icon }}
      transition={T.instant}
      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-primary text-primary transition-colors duration-200 ease-figma hover:bg-primary/8"
    >
      <motion.span
        animate={{ rotate: open ? 90 : 0 }}
        transition={T.instant}
        className="block"
      >
        <Icon name={open ? 'close' : 'search'} size={16} weight={1.5} />
      </motion.span>
    </motion.button>
  )
}

export function SearchField({
  open,
  value,
  onChange,
  placeholder,
}: {
  open: boolean
  value: string
  onChange: (next: string) => void
  placeholder: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="search-field"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 48, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={T.dissolve}
          className="shrink-0 overflow-hidden px-[22px]"
        >
          <div className="mt-2.5 flex h-9 items-center gap-2 rounded-xl border border-primary bg-surface px-3">
            <span className="text-primary">
              <Icon name="search" size={14} weight={1.6} />
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
