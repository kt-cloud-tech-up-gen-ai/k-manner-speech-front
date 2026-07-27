import { motion } from 'motion/react'
import type { ChatMessage } from '@/api/types'
import { cn } from '@/lib/cn'
import { EASE_OUT, PRESS, T } from '@/lib/motion'

/** 24x24 speaker button that sits beside each bubble. */
function AudioButton({ label }: { label: string }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: PRESS.icon }}
      transition={T.instant}
      className="flex h-6 w-6 shrink-0 items-center justify-center self-end rounded-full border border-handle bg-surface-sunken text-muted-2"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path d="M2 5.2h2.4L7.4 2.6v8.8L4.4 8.8H2Z" fill="currentColor" />
        <path
          d="M9.6 5a2.8 2.8 0 0 1 0 4M11.4 3.2a5.4 5.4 0 0 1 0 7.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </motion.button>
  )
}

/**
 * Chat bubbles from P09.1. The tail is expressed as an asymmetric radius:
 * the user's bubble is 16/16/5/16 and the persona's is 16/16/16/5. Bubble
 * copy is set in Noto Sans KR, not Inter.
 */
export function ChatBubble({
  message,
  index,
  onOpenFeedback,
}: {
  message: ChatMessage
  index: number
  onOpenFeedback?: () => void
}) {
  const mine = message.role === 'user'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay: Math.min(index, 6) * 0.05 }}
      className={cn('flex items-end gap-2', mine ? 'justify-end' : 'justify-start')}
    >
      {mine && <AudioButton label="내 답변 다시 듣기" />}

      <div
        className={cn(
          'font-splash max-w-[74%] px-3.5 py-[11px]',
          mine
            ? 'rounded-[16px_16px_5px_16px] bg-primary text-white'
            : 'rounded-[16px_16px_16px_5px] bg-surface-sunken text-bubble-ink',
        )}
      >
        {mine && (
          <span className="mb-1 inline-block rounded-sm bg-white/20 px-[7px] py-0.5 text-[8.9px] leading-[11px] font-bold text-white">
            텍스트 입력
          </span>
        )}

        <p className="text-sm leading-[19.5px] whitespace-pre-line">{message.text}</p>

        {message.hint && !mine && (
          <p className="mt-1 text-[11px] leading-[17px] text-muted-2">{message.hint}</p>
        )}

        {mine && onOpenFeedback && (
          <>
            <span className="my-2 block h-px bg-white/28" />
            <motion.button
              type="button"
              onClick={onOpenFeedback}
              whileTap={{ scale: PRESS.button }}
              transition={T.instant}
              className="flex items-center gap-1.5 rounded-md bg-white/16 px-[11px] py-[5px] text-2xs font-bold text-white"
            >
              피드백 보기
              <span aria-hidden="true" className="font-sans text-sm font-semibold">
                ›
              </span>
            </motion.button>
          </>
        )}
      </div>

      {!mine && <AudioButton label="다시 듣기" />}
    </motion.div>
  )
}
