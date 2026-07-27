import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import doyunPortrait from '@/assets/characters/doyun.jpg'
import { getAnswerFeedback } from '@/api/client'
import type { AnswerFeedback, ChatMessage } from '@/api/types'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { EASE_OUT, PRESS, T } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import { AnswerFeedbackSheet } from '@/features/simulation/AnswerFeedbackSheet'
import { ChatBubble } from '@/features/simulation/ChatBubble'

const OPENING: ChatMessage[] = [
  {
    id: 't1',
    role: 'persona',
    text: '그럼 가볍게 인사부터 해볼까?\n어떻게 불러드리면 좋을까?',
  },
]

const REPLY: ChatMessage = {
  id: 't3',
  role: 'persona',
  text: '좋아요, 에마님! 준비됐어요. 바로 시작해 볼까요?',
}

const COACH = {
  1: { title: '자기 소개를 간단하게 해봐요', body: '아래 입력창을 사용해 보세요' },
  2: { title: '내 답변이 생성되었어요', body: '피드백 보기를 눌러 확인해 보세요' },
} as const

const CHECKLIST = ['인사 및 이름 묻기', '답변 보내기 및 피드백 보기', '도윤의 답변 확인']

/**
 * `P02 · Tutorial` — the three-step warm-up (greeting → user answer →
 * complete). It reuses the simulation's bubbles and feedback sheet; what is
 * specific here is the coach card and the highlighted input the design rings
 * in primary while the step is active.
 */
export function TrialScreen() {
  const navigate = useNavigate()
  const markTutorialSeen = useAppStore((s) => s.markTutorialSeen)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [messages, setMessages] = useState<ChatMessage[]>(OPENING)
  const [draft, setDraft] = useState('')
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function submit() {
    const text = draft.trim() || '음… 그냥 에마라고 불러 주세요.'
    setDraft('')
    setMessages((prev) => [...prev, { id: 't2', role: 'user', text }])
    setStep(2)
  }

  async function openFeedback() {
    if (!feedback) setFeedback(await getAnswerFeedback())
    setFeedbackOpen(true)
    setMessages((prev) => (prev.some((m) => m.id === REPLY.id) ? prev : [...prev, REPLY]))
    setStep(3)
  }

  function finish() {
    markTutorialSeen()
    navigate('/home')
  }

  const coach = step === 3 ? null : COACH[step]

  return (
    <div className="relative flex h-full flex-col bg-bg">
      {/* NavBar */}
      <header className="flex h-10 shrink-0 items-center justify-between px-5 pt-1.5">
        <motion.button
          type="button"
          onClick={() => navigate('/home')}
          aria-label="튜토리얼 종료"
          whileTap={{ scale: PRESS.icon }}
          transition={T.instant}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-2xl bg-surface-sunken text-[17px] leading-none text-ink-2"
        >
          ×
        </motion.button>

        <div className="flex flex-col items-center">
          <span className="text-base font-semibold text-ink">도윤 · 튜토리얼</span>
          <span className="font-mono text-xs font-medium text-muted">
            튜토리얼 · Tutorial
          </span>
        </div>

        <span className="font-mono text-base font-bold text-primary-strong">
          {step} / 3
        </span>
      </header>

      {/* Goal chip */}
      <div className="shrink-0 px-5 pt-3">
        <span className="inline-flex items-center gap-[7px] rounded-full bg-primary/10 px-3 py-[7px]">
          <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-2xs font-medium text-primary-deeper">
            목표 · 인사하고 이름 말하기
          </span>
        </span>
      </div>

      {/* Portrait */}
      <div className="shrink-0 px-5 pt-3">
        <div className="relative h-[180px] overflow-hidden rounded-4xl">
          <img
            src={doyunPortrait}
            alt="도윤 초상"
            className="h-full w-full object-cover object-top"
          />
          <div
            className="absolute inset-x-0 bottom-0 flex justify-center py-3"
            style={{
              background:
                'linear-gradient(180deg, rgba(40,33,18,0) 0%, rgba(40,33,18,0.28) 100%)',
            }}
          >
            <span className="flex gap-[5px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'block h-[7px] w-[7px] rounded-full transition-colors duration-200 ease-figma',
                    i === step - 1 ? 'bg-primary' : 'bg-[#282112]/18',
                  )}
                />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-[26px] shrink-0 items-center justify-center gap-2 pt-1.5">
        <span aria-hidden="true" className="block h-[5px] w-[46px] rounded-sm bg-[#282112]/22" />
        <span className="text-[9.5px] leading-3 font-medium text-muted">
          드래그로 높이 조절
        </span>
      </div>

      {/* Chat */}
      <div
        ref={scrollRef}
        className="scrollbar-none flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-y-auto px-5 py-3.5"
      >
        {messages.map((message, i) => (
          <ChatBubble
            key={message.id}
            message={message}
            index={i}
            onOpenFeedback={message.role === 'user' ? openFeedback : undefined}
          />
        ))}
      </div>

      {/* Coach + input */}
      <div className="shrink-0 border-t border-[#E9E3D8] bg-bg px-[18px] pt-3 pb-5">
        <AnimatePresence mode="wait" initial={false}>
          {coach && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
            >
              <p className="font-splash mb-2.5 text-center text-2xs text-muted">
                도윤이가 기다리고 있어요
              </p>
              <div className="flex items-start gap-2 rounded-2xl border border-[#E8EBF5] bg-surface px-3.5 py-2.5 shadow-[0_2px_10px_rgba(40,33,18,0.08)]">
                <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary text-2xs font-bold text-white">
                  !
                </span>
                <span className="font-splash flex flex-col gap-1">
                  <span className="text-sm font-bold text-ink">{coach.title}</span>
                  <span className="text-2xs text-muted">{coach.body}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 3 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="rounded-3xl border border-line bg-surface p-4"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                <Icon name="check" size={13} weight={2} />
              </span>
              <span className="text-sm font-bold text-ink">튜토리얼 완료</span>
            </div>
            <h2 className="font-splash mt-2.5 text-lg font-bold text-ink">
              첫 대화를 마쳤어요!
            </h2>
            <p className="font-splash mt-1.5 text-xs leading-[17px] text-muted-2">
              도윤과 인사하고, 이름을 말하고, 답변을 주고받는 흐름을 모두 익혔어요.
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-ink-2">
                  <span className="text-primary">
                    <Icon name="check" size={12} weight={2} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="mt-4" size="md" onClick={finish}>
              홈으로 가기
            </Button>
          </motion.div>
        ) : (
          <motion.form
            className={cn(
              'mt-2.5 rounded-3xl bg-surface/98 p-2.5',
              step === 1
                ? 'border-2 border-primary shadow-[0_0_0_3px_rgba(70,108,200,0.1)]'
                : 'border border-line',
            )}
            animate={step === 1 ? { scale: [1, 1.012, 1] } : { scale: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut', repeat: step === 1 ? Infinity : 0 }}
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F3F3F5] px-2.5">
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[#9B9BAA] text-[#9B9BAA]">
                  <Icon name="plus" size={12} weight={1.6} />
                </span>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="메시지 입력…"
                  aria-label="메시지 입력"
                  className="font-splash min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-[#B0AAA0]"
                />
              </div>

              <button
                type="button"
                aria-label="음성으로 답하기"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E0E0EA] bg-[#F0F0F5] text-primary-strong"
              >
                <Icon name="mic" size={17} weight={1.8} />
              </button>

              <motion.button
                type="submit"
                aria-label="보내기"
                whileTap={{ scale: PRESS.icon }}
                transition={T.instant}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white"
              >
                <Icon name="send" size={16} />
              </motion.button>
            </div>

            <p className="font-splash mt-2 text-center text-2xs text-[#B0AAA0]">
              마이크로 말하거나 입력 · 음성은 선택
            </p>
          </motion.form>
        )}
      </div>

      <AnswerFeedbackSheet
        feedback={feedback}
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  )
}
