import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { getHomeSummary } from '@/api/client'
import type { HomeSummary } from '@/api/types'
import { ScreenBody } from '@/components/shell/Screen'
import { Button } from '@/components/ui/Button'
import { Card, TitlePair } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { EASE_OUT, PRESS } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import { HomeTutorial } from './HomeTutorial'

const rise = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

/** P06 · Home. */
export function HomeScreen() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<HomeSummary | null>(null)
  const signedIn = useAppStore((s) => s.signedIn)
  const profile = useAppStore((s) => s.profile)

  useEffect(() => {
    getHomeSummary().then(setSummary)
  }, [])

  if (!summary) return <div className="flex-1 bg-bg" />

  const { streak, pick } = summary

  return (
    <div className="relative flex h-full flex-col bg-bg">
      <ScreenBody className="px-[22px] pt-3.5">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.06 }}
          className="flex flex-col gap-4 pb-6"
        >
          {/* Greeting → login (the prototype wires this row to P11). */}
          <motion.button
            type="button"
            variants={rise}
            transition={{ duration: 0.34, ease: EASE_OUT }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-left outline-none"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="text-xl font-bold tracking-title text-ink">
                {signedIn ? `${profile.name}님, 안녕하세요!` : summary.greeting}
              </span>
              <span className="truncate text-sm text-muted">
                {signedIn ? '오늘도 한 걸음씩 연습해 볼까요?' : summary.greetingSub}
              </span>
            </span>
            <span className="shrink-0 text-muted-4">
              <Icon name="chevron-right" size={24} weight={1.8} />
            </span>
          </motion.button>

          {/* Streak panel */}
          <motion.div
            variants={rise}
            transition={{ duration: 0.34, ease: EASE_OUT }}
            className="flex h-[74px] items-center justify-between rounded-3xl bg-surface-dark px-[18px]"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#B9B1A0]">{streak.label}</span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-white">{streak.days}일째</span>
                <span className="text-sm font-medium text-[#9A927F]">
                  {streak.statusLabel}
                </span>
              </span>
            </div>

            <div className="flex gap-[5px]">
              {Array.from({ length: streak.weeklyGoal }, (_, i) => (
                <motion.span
                  key={i}
                  className={cn(
                    'block h-[26px] w-[11px] rounded-xs',
                    i < streak.days ? 'bg-primary-light' : 'bg-white/16',
                  )}
                  initial={{ scaleY: 0.4, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.32, ease: EASE_OUT, delay: 0.15 + i * 0.04 }}
                  style={{ originY: 1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Today's pick */}
          <motion.div
            variants={rise}
            transition={{ duration: 0.34, ease: EASE_OUT }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <TitlePair ko="오늘의 추천" en="Today's pick" size="section" />
              <button
                type="button"
                onClick={() => navigate('/personas')}
                className="text-xs font-medium text-primary outline-none hover:underline"
              >
                전체 보기
              </button>
            </div>

            <Card className="overflow-hidden" interactive>
              <div
                className="relative flex h-[120px] items-start justify-end p-3"
                style={{
                  background: 'linear-gradient(160deg, #EAE4D8 0%, #E1DACB 100%)',
                }}
              >
                <span className="font-mono text-2xs font-medium tracking-[0.06em] text-[#ACA38F]">
                  상황 일러스트
                </span>
                <Chip tone="dark" className="absolute bottom-3 left-3 rounded-md px-2.5 py-[5px]">
                  {pick.difficultyLabel}
                </Chip>
              </div>

              <div className="flex flex-col gap-1 px-4 py-[15px]">
                <div className="flex items-center gap-2">
                  <span
                    className="block h-[22px] w-[22px] rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #E7E1D4 0%, #DED7C8 100%)',
                    }}
                  />
                  <span className="text-xs font-medium text-muted-2">
                    {pick.personaLabel}
                  </span>
                </div>

                <h3 className="pt-1 text-lg font-bold text-ink">{pick.title}</h3>
                <p className="pb-2 text-xs text-muted">{pick.meta}</p>

                <Button
                  size="md"
                  elevated={false}
                  onClick={() => navigate(`/simulation/${pick.scenarioId}`)}
                >
                  연습 시작 →
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Resume */}
          {summary.resumeLabel && (
            <motion.button
              type="button"
              variants={rise}
              whileTap={{ scale: PRESS.card }}
              transition={{ duration: 0.34, ease: EASE_OUT }}
              onClick={() => navigate(`/simulation/${pick.scenarioId}?mode=continue`)}
              className="flex h-[66px] items-center gap-3 rounded-2xl border border-line bg-surface px-[15px] text-left transition-colors duration-200 ease-figma hover:bg-surface-sunken/40"
            >
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-muted-2">
                <Icon name="play" size={16} weight={1.6} />
              </span>
              <span className="text-sm font-semibold text-ink">{summary.resumeLabel}</span>
            </motion.button>
          )}
        </motion.div>
      </ScreenBody>

      {/* P06.1–.3 coach marks, shown once, and the only entry to /trial. */}
      <HomeTutorial />
    </div>
  )
}
