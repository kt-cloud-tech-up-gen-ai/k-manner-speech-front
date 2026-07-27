import { AnimatePresence, motion } from 'motion/react'
import type { AnswerFeedback } from '@/api/types'
import { Chip } from '@/components/ui/Chip'
import { cn } from '@/lib/cn'
import { EASE_OUT, T, scrimVariants } from '@/lib/motion'

/**
 * `Overlay · Answer Feedback` — a 498px sheet that rises over the simulation.
 *
 * The prototype opens it with MOVE_IN from the top at 320ms; on a phone a
 * bottom sheet reads better rising from the edge it is anchored to, so the
 * sheet itself slides up while the backdrop cross-fades. Duration and easing
 * are the designer's.
 */
export function AnswerFeedbackSheet({
  feedback,
  open,
  onClose,
}: {
  feedback: AnswerFeedback | null
  open: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && feedback && (
        <motion.div
          key="feedback"
          className="absolute inset-0 z-40 flex flex-col justify-end"
          variants={scrimVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={T.overlay}
        >
          <button
            type="button"
            aria-label="피드백 닫기"
            onClick={onClose}
            className="absolute inset-0 bg-[#171613]/18"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="답변 피드백"
            className="scrollbar-none relative max-h-[498px] overflow-y-auto rounded-t-[28px] bg-bg shadow-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
          >
            <span
              aria-hidden="true"
              className="mx-auto mt-2.5 block h-[5px] w-[50px] rounded-sm bg-handle"
            />

            <div className="flex items-start justify-between px-5 pt-3">
              <div>
                <h2 className="text-[18px] leading-[23px] font-bold text-ink">
                  답변 피드백
                </h2>
                <p className="mt-1.5 text-2xs font-medium text-lang-help">
                  {feedback.meta}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-surface-sunken text-[18px] leading-none text-ink-2"
              >
                ×
              </button>
            </div>

            <ScorePanel feedback={feedback} />
            <Timeline feedback={feedback} />

            <h3 className="font-splash px-5 pt-4 text-[11.5px] leading-[15px] font-bold text-heading-warm">
              구간별 피드백
            </h3>

            <div className="flex flex-col gap-2 px-5 pt-2">
              {feedback.issues.map((issue, i) => (
                <motion.div
                  key={issue.timestamp}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: EASE_OUT, delay: 0.12 + i * 0.06 }}
                  className="rounded-[14px] border border-issue-border bg-issue-bg px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Chip tone="issue" shape="md" className="font-splash px-2">
                      {issue.timestamp}
                    </Chip>
                    <span className="font-splash text-xs font-bold text-heading-warm">
                      {issue.word}
                    </span>
                  </div>
                  <p className="font-splash mt-1.5 text-2xs leading-[15px] text-body-warm">
                    {issue.guidance}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mx-5 mt-4 mb-5 rounded-[14px] bg-surface-sunken px-3 py-2.5">
              <p className="font-splash text-2xs font-bold text-ink-2">표현 피드백</p>
              <p className="font-splash mt-1.5 text-2xs leading-[15px] text-body-warm">
                {feedback.expression}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ScorePanel({ feedback }: { feedback: AnswerFeedback }) {
  const filled = Math.round(feedback.score)

  return (
    <div className="mx-5 mt-3 flex items-center justify-between rounded-2xl bg-score-bg px-3.5 py-3">
      <div>
        <p className="font-splash text-2xs font-bold text-primary-strong">발음 점수</p>
        <p className="mt-1 flex items-baseline gap-1">
          <motion.span
            className="font-mono text-[27px] leading-[31px] font-bold text-primary-deeper"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.1 }}
          >
            {feedback.score.toFixed(1)}
          </motion.span>
          <span className="font-mono text-xs font-medium text-score-meta">
            / {feedback.scoreOutOf}
          </span>
          <Chip tone="score" shape="md" className="font-splash ml-2 px-2.5">
            {feedback.scoreLabel}
          </Chip>
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="flex gap-[3px]">
          {Array.from({ length: feedback.scoreOutOf }, (_, i) => (
            <motion.span
              key={i}
              className={cn(
                'block h-2 w-[7px] rounded-xs',
                i < filled ? 'bg-primary' : 'bg-score-empty',
              )}
              initial={{ scaleY: 0.3, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.24, ease: EASE_OUT, delay: 0.12 + i * 0.025 }}
            />
          ))}
        </div>
        <span className="font-mono text-[9.5px] leading-[13px] font-medium text-score-meta">
          {feedback.secondaryMetrics}
        </span>
      </div>
    </div>
  )
}

function Timeline({ feedback }: { feedback: AnswerFeedback }) {
  const { waveform, errorRanges, durationSeconds } = feedback
  const inError = (i: number) => {
    const t = (i / waveform.length) * durationSeconds
    return errorRanges.some((r) => t >= r.from && t <= r.to)
  }

  return (
    <div className="mx-5 mt-2.5 rounded-2xl border border-timeline-border bg-surface-input px-3.5 py-3">
      <div className="flex items-baseline justify-between">
        <span className="font-splash text-[11.5px] leading-[15px] font-bold text-heading-warm">
          오류 구간
        </span>
        <span className="font-mono text-2xs font-medium text-lang-help">
          녹음 {durationSeconds}초
        </span>
      </div>

      <div className="relative mt-2.5 flex h-[38px] items-center gap-[3px]">
        {/* Flagged spans sit behind the bars. */}
        {errorRanges.map((range) => (
          <span
            key={`${range.from}-${range.to}`}
            aria-hidden="true"
            className="absolute top-0 h-full rounded-sm bg-error-range/72"
            style={{
              left: `${(range.from / durationSeconds) * 100}%`,
              width: `${((range.to - range.from) / durationSeconds) * 100}%`,
            }}
          />
        ))}

        {waveform.map((height, i) => (
          <motion.span
            key={i}
            className={cn(
              'relative block w-[6px] flex-1 rounded-xs',
              inError(i) ? 'bg-danger' : 'bg-primary-lighter',
            )}
            style={{ height: `${height * 100}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.28, ease: EASE_OUT, delay: 0.1 + i * 0.012 }}
          />
        ))}
      </div>

      <div className="mt-1.5 flex justify-between font-mono text-[9px] leading-3 font-medium text-lang-help">
        <span>0:00</span>
        <span>0:0{Math.ceil(durationSeconds)}</span>
      </div>
      <p className="font-splash mt-2 text-[9.7px] leading-[13px] text-lang-help">
        빨간 구간을 눌러 문제 발음을 다시 들어보세요
      </p>
    </div>
  )
}
