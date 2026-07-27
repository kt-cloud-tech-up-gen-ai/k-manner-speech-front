import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { getPracticeResult } from '@/api/client'
import type { PracticeResult } from '@/api/types'
import { ScreenBody } from '@/components/shell/Screen'
import { BackButton } from '@/components/shell/TopBar'
import { Button } from '@/components/ui/Button'
import { EASE_OUT } from '@/lib/motion'

const RING = 154
const STROKE = 17
const RADIUS = (RING - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * P10 / P10.1 · 연습 결과.
 *
 * The frame is toggled off in Figma but fully designed, and the prototype
 * still routes out of it — so it is built here rather than dropped.
 *
 * One interpretation: the 154px ring around the score is drawn in Figma as an
 * unfilled band, which would render as nothing. It is treated as a score ring
 * and stroked to `score / scoreOutOf`, since that is the only reading under
 * which an empty 17px annulus around a number makes sense.
 */
export function ResultScreen() {
  const navigate = useNavigate()
  const { scenarioId = '' } = useParams()
  const [result, setResult] = useState<PracticeResult | null>(null)

  useEffect(() => {
    getPracticeResult(scenarioId).then(setResult)
  }, [scenarioId])

  if (!result) return <div className="flex-1 bg-bg" />

  const progress = result.score / result.scoreOutOf

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-[30px] shrink-0 items-center gap-3.5 px-[22px] pt-2">
        <BackButton onClick={() => navigate('/home')} bare />
        <h1 className="flex items-baseline gap-1.5">
          <span className="text-[18px] leading-[22px] font-bold text-ink">연습 결과</span>
          <span className="text-md font-medium text-muted">Result</span>
        </h1>
      </header>

      <ScreenBody className="items-center gap-4 px-[22px] pt-[18px]">
        {/* Score ring */}
        <div className="relative mt-1.5" style={{ width: RING, height: RING }}>
          <svg width={RING} height={RING} className="-rotate-90" aria-hidden="true">
            <circle
              cx={RING / 2}
              cy={RING / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              className="stroke-surface-sunken"
            />
            <motion.circle
              cx={RING / 2}
              cy={RING / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
            />
          </svg>

          <div className="absolute inset-[17px] flex flex-col items-center justify-center rounded-full bg-bg">
            <motion.span
              className="font-mono text-[44px] leading-[44px] font-bold text-surface-dark"
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
            >
              {result.score}
            </motion.span>
            <span className="mt-[5px] text-xs font-semibold text-muted-2">
              {result.scoreCaption}
            </span>
          </div>
        </div>

        {/* Verdict */}
        <motion.span
          className="rounded-full bg-easy/14 px-4 py-[7px] text-sm font-bold text-[#005520]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.25 }}
        >
          {result.verdict}
        </motion.span>

        {/* One-line comment */}
        <motion.div
          className="w-full rounded-3xl border border-line bg-surface p-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.32 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-surface-dark">한 줄 코멘트</span>
            <span className="text-xs font-medium text-muted">Comment</span>
          </div>
          <p className="mt-2 text-sm leading-[21.6px] text-ink-2">{result.comment}</p>
        </motion.div>

        {/* Suggested phrasing */}
        <motion.div
          className="w-full rounded-3xl border border-[rgb(30_25_15/0.18)] bg-black/2 px-4 py-3.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.39 }}
        >
          <p className="text-2xs font-semibold text-muted-2">이럴 땐 이렇게 · Try instead</p>
          <p className="mt-1.5 text-sm leading-[20px] font-medium text-surface-dark">
            {result.tryInstead}
          </p>
        </motion.div>

        <p className="flex items-center gap-2 pb-4 text-xs font-medium text-muted">
          {result.meta.map((item, i) => (
            <span key={item} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">·</span>}
              {item}
            </span>
          ))}
        </p>
      </ScreenBody>

      <footer className="flex shrink-0 gap-3 px-[22px] pt-3 pb-[30px]">
        <Button
          variant="outline"
          fullWidth={false}
          onClick={() => navigate(`/simulation/${result.scenarioId}`)}
          className="flex-[124] border-[rgb(30_25_15/0.16)] text-base text-ink-2"
        >
          다시 하기
        </Button>
        <Button
          fullWidth={false}
          onClick={() =>
            navigate(
              result.nextScenarioId ? `/simulation/${result.nextScenarioId}` : '/personas',
            )
          }
          className="flex-[174] text-base"
        >
          다음 시나리오 →
        </Button>
      </footer>
    </div>
  )
}
