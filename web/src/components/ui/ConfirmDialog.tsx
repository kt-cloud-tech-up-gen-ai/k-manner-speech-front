import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { EASE_OUT, PRESS, T, scrimVariants } from '@/lib/motion'

/**
 * `ConfirmDialog · Continue or Restart` in the Figma file — one master
 * component reused by P08-3 (이어하기 / 새로하기) and P13C (취소 / 탈퇴).
 *
 * 320x175 centred card on a #000 @28% scrim, 20px padding, 14px gaps and a
 * pair of 46px buttons. The prototype fades it in at 200ms.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  destructive = false,
  onCancel,
  onDismiss,
  onConfirm,
}: {
  open: boolean
  title: string
  description: string
  cancelLabel: string
  confirmLabel: string
  destructive?: boolean
  /** The left button. May carry an action of its own (P08-3's 이어하기). */
  onCancel: () => void
  /** Backdrop tap and Escape. Defaults to onCancel for plain dialogs. */
  onDismiss?: () => void
  onConfirm: () => void
}) {
  const dismiss = onDismiss ?? onCancel

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="confirm"
          className="absolute inset-0 z-40 flex items-center justify-center px-5"
          variants={scrimVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={T.dissolve}
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={dismiss}
            className="absolute inset-0 bg-black/28"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex w-[320px] flex-col gap-3.5 rounded-3xl border border-line bg-surface p-5 shadow-overlay"
            initial={{ scale: 0.94, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 4 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <h2 className="text-[15px] leading-[21px] font-bold text-ink">{title}</h2>
            <p className="text-base leading-[19.5px] text-ink-2">{description}</p>

            <div className="mt-1 flex gap-2.5">
              <motion.button
                type="button"
                onClick={onCancel}
                whileTap={{ scale: PRESS.button }}
                transition={T.instant}
                className="h-[46px] flex-1 rounded-xl bg-surface-sunken text-md font-semibold text-ink-3"
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                type="button"
                onClick={onConfirm}
                whileTap={{ scale: PRESS.button }}
                transition={T.instant}
                className={cn(
                  'h-[46px] flex-1 rounded-xl text-md font-semibold text-white',
                  destructive ? 'bg-danger' : 'bg-primary',
                )}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
