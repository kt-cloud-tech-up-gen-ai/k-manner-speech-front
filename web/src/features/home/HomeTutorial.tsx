import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import doyunPortrait from '@/assets/characters/doyun.jpg'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { cn } from '@/lib/cn'
import { EASE_OUT, T, scrimVariants } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'

/**
 * `First Home Tutorial · Interactive Flow` — P06.1 → P06.1 choice1 → P06.2 →
 * P06.3, a four-step coach-mark pass over the home screen that ends by
 * launching the P02 tutorial chat.
 *
 * Steps 1 and 4 are sheets; 2 and 3 are tooltips pinned to the section they
 * describe. Everything sits on a #171613 @28% scrim.
 */

type Step = 1 | 2 | 3 | 4

const TOOLTIPS: Record<2 | 3, { title: string; lines: string[]; anchor: string }> = {
  2: {
    title: '오늘의 추천 콘텐츠',
    lines: ['개인화된 오늘의', '추천 콘텐츠'],
    anchor: 'top-[188px]',
  },
  3: {
    title: '최근 연습',
    lines: ['최근에 했던 연습도', '여기에서 이어서 할 수 있어.'],
    anchor: 'bottom-[92px]',
  },
}

function Badge({ step }: { step: Step }) {
  return (
    <Chip tone="info" shape="md" className="font-splash px-3 py-1.5">
      {step} / 4
    </Chip>
  )
}

export function HomeTutorial() {
  const navigate = useNavigate()
  const tutorialSeen = useAppStore((s) => s.tutorialSeen)
  const markTutorialSeen = useAppStore((s) => s.markTutorialSeen)
  const [step, setStep] = useState<Step | null>(tutorialSeen ? null : 1)

  function skip() {
    markTutorialSeen()
    setStep(null)
  }

  return (
    <AnimatePresence>
      {step !== null && (
        <motion.div
          key="home-tutorial"
          className="absolute inset-0 z-40 flex flex-col justify-end bg-[#171613]/28"
          variants={scrimVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={T.dissolve}
        >
          {(step === 2 || step === 3) && (
            <Tooltip
              key={step}
              step={step}
              onNext={() => setStep((step + 1) as Step)}
              onSkip={skip}
            />
          )}

          {step === 1 && (
            <Sheet key="intro">
              <div className="flex items-center gap-3">
                <Badge step={1} />
                <span className="flex flex-col gap-0.5">
                  <span className="font-splash text-base font-bold text-ink">
                    캠퍼스 선배 도윤의 안내
                  </span>
                  <span className="font-splash text-2xs text-muted">
                    먼저 홈 화면을 함께 둘러볼게요.
                  </span>
                </span>
              </div>

              <img
                src={doyunPortrait}
                alt="도윤 초상"
                className="mt-3 h-[180px] w-full rounded-4xl object-cover object-top"
              />

              <div className="mt-3 rounded-3xl bg-[#EEF2FC] px-4 pt-3 pb-4">
                <p className="font-splash text-2xs font-bold text-primary-strong">도윤</p>
                <p className="font-splash mt-2.5 text-base leading-[21px] font-medium text-heading-warm">
                  안녕? 반가워 나는 도윤이야. 너가 한국말을 관계와 맥락에 맞게 잘할 수
                  있게 도와줄게!
                </p>
              </div>

              <Button
                shape="pill"
                elevated={false}
                onClick={() => setStep(2)}
                className="font-splash mt-4 font-bold"
              >
                튜토리얼 시작
              </Button>
              <Button
                variant="outline"
                shape="pill"
                size="md"
                onClick={skip}
                className="font-splash mt-3 border-[#DDD5C0] bg-bg font-medium text-[#5A5245]"
              >
                건너뛰기 · Skip tutorial
              </Button>
            </Sheet>
          )}

          {step === 4 && (
            <Sheet key="finish">
              <div className="flex items-center gap-3">
                <Badge step={4} />
                <span className="font-splash text-base font-bold text-ink">
                  이제 도윤이와 대화를 나누어보아요
                </span>
              </div>

              <Card className="mt-4 p-4">
                <p className="font-splash text-2xs font-bold text-muted-2">추천 튜토리얼</p>
                <p className="font-splash mt-2 text-lg font-bold text-ink">
                  캠퍼스에서 첫인사 하기
                </p>
                <p className="font-splash mt-1.5 text-xs text-muted">도윤 · 약 2분</p>
              </Card>

              <Button
                shape="pill"
                onClick={() => {
                  markTutorialSeen()
                  navigate('/trial')
                }}
                className="font-splash mt-4 font-bold"
              >
                튜토리얼 시나리오 시작
              </Button>
              <Button
                variant="outline"
                shape="pill"
                size="md"
                onClick={skip}
                className="font-splash mt-3 border-[#DDD5C0] bg-bg font-medium text-[#5A5245]"
              >
                건너뛰기 · Skip tutorial
              </Button>
            </Sheet>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="scrollbar-none max-h-[86%] overflow-y-auto rounded-t-[28px] bg-bg px-[22px] pt-2.5 pb-6"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.28, ease: EASE_OUT }}
    >
      <span
        aria-hidden="true"
        className="mx-auto mb-3 block h-[5px] w-[50px] rounded-sm bg-handle"
      />
      {children}
    </motion.div>
  )
}

function Tooltip({
  step,
  onNext,
  onSkip,
}: {
  step: 2 | 3
  onNext: () => void
  onSkip: () => void
}) {
  const tip = TOOLTIPS[step]

  return (
    <motion.div
      className={cn('absolute right-[22px] left-[22px]', tip.anchor)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.24, ease: EASE_OUT }}
    >
      <div className="rounded-3xl bg-surface p-4 shadow-overlay">
        <div className="flex items-center justify-between">
          <Badge step={step} />
          <span className="font-splash text-2xs font-bold text-muted-2">{tip.title}</span>
        </div>

        <p className="font-splash mt-3 text-2xs font-bold text-primary-strong">도윤</p>
        <p className="font-splash mt-1.5 text-base leading-[21px] font-medium text-heading-warm">
          {tip.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-3.5 flex gap-2.5">
          <Button
            variant="soft"
            size="sm"
            fullWidth={false}
            onClick={onSkip}
            className="font-splash flex-1"
          >
            건너뛰기
          </Button>
          <Button
            size="sm"
            fullWidth={false}
            elevated={false}
            onClick={onNext}
            className="font-splash flex-[2] font-bold"
          >
            다음
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
