import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_OUT, T, scrimVariants } from '@/lib/motion'

/**
 * The sheet shape used by the language picker overlay: #FBFAF7, 28px top
 * radius, a 44x4 grab handle, over a #000 @38% backdrop.
 */
export function BottomSheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet"
          className="absolute inset-0 z-40 flex flex-col justify-end"
          variants={scrimVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={T.dissolve}
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="absolute inset-0 bg-black/38"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative rounded-t-[28px] bg-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <span
              aria-hidden="true"
              className="mx-auto mt-3 block h-1 w-11 rounded-xs bg-lang-border"
            />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
