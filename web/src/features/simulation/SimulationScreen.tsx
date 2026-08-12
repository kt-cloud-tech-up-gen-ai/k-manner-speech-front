import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { animate, motion, useMotionValue } from 'motion/react'
import { getAnswerFeedback, getSimulation, sendMessage } from '@/api/client'
import type { AnswerFeedback, ChatMessage, SimulationSession } from '@/api/types'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { EASE_OUT, PRESS, T } from '@/lib/motion'
import { AnswerFeedbackSheet } from './AnswerFeedbackSheet'
import { ChatBubble } from './ChatBubble'

/** Portrait heights the prototype morphs between (P09 vs P09A). */
const PORTRAIT_TALL = 224
const PORTRAIT_SHORT = 152
const SNAP_POINT = (PORTRAIT_TALL + PORTRAIT_SHORT) / 2

const clamp = (v: number) => Math.min(PORTRAIT_TALL, Math.max(PORTRAIT_SHORT, v))

/**
 * P09 · Simulation, covering P09.1 (continue), P09.2 (new), the P09A/P09.1A
 * chat-expanded states and the answer-feedback overlay.
 *
 * The portrait/chat split is a real drag rather than two frames: the handle
 * reports pointer offset while staying put, and releasing snaps to whichever
 * of the designer's two heights is nearer, at the prototype's 300ms.
 */
export function SimulationScreen() {
  const navigate = useNavigate()
  const { scenarioId = '' } = useParams()
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'continue' ? 'continue' : 'new'

  const [session, setSession] = useState<SimulationSession | null>(null)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const portraitHeight = useMotionValue(PORTRAIT_TALL)
  const dragOrigin = useRef(PORTRAIT_TALL)
  const scrollRef = useRef<HTMLDivElement>(null)
  const initializedPractice = useRef<string | null>(null)

  useEffect(() => {
    const practiceKey = `${scenarioId}:${mode}`
    if (initializedPractice.current === practiceKey) return
    initializedPractice.current = practiceKey
    setLoadError('')
    getSimulation(scenarioId, mode)
      .then((s) => {
        if (!s) throw new Error('시나리오에 연결된 대화 상대가 없습니다.')
        setSession(s)
        setMessages(s.messages)
        if (mode === 'continue') {
          // Arriving mid-conversation, the design shows the chat already opened up.
          portraitHeight.set(PORTRAIT_SHORT)
        }
      })
      .catch((reason) => {
        setLoadError(
          reason instanceof Error ? reason.message : '대화방을 열지 못했습니다.',
        )
      })
  }, [scenarioId, mode, portraitHeight, loadAttempt])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function snap() {
    const target = portraitHeight.get() > SNAP_POINT ? PORTRAIT_TALL : PORTRAIT_SHORT
    animate(portraitHeight, target, { duration: 0.3, ease: EASE_OUT })
  }

  function toggleHeight() {
    const target =
      portraitHeight.get() > SNAP_POINT ? PORTRAIT_SHORT : PORTRAIT_TALL
    animate(portraitHeight, target, { duration: 0.3, ease: EASE_OUT })
  }

  async function submit() {
    const text = draft.trim()
    if (!text || sending || !session) return
    setDraft('')
    setSending(true)
    setMessageError('')
    try {
      const appended = await sendMessage(session.roomId, text)
      setMessages((prev) => [...prev, ...appended])
      setSession((current) => {
        if (!current) return current
        const nextStep = Math.min(current.step + 1, current.totalSteps)
        return {
          ...current,
          step: nextStep,
          completed: nextStep >= current.totalSteps,
        }
      })
    } catch (reason) {
      setDraft(text)
      setMessageError(
        reason instanceof Error ? reason.message : '메시지를 보내지 못했습니다.',
      )
    } finally {
      setSending(false)
    }
  }

  async function openFeedback() {
    if (!session) return
    if (!feedback) setFeedback(await getAnswerFeedback(session.roomId))
    setFeedbackOpen(true)
  }

  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-bg px-8 text-center">
        {loadError ? (
          <>
            <h1 className="text-lg font-bold text-ink">대화방을 열지 못했어요</h1>
            <p role="alert" className="mt-2 text-sm leading-body text-muted">
              {loadError}
            </p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-2"
              >
                이전 화면
              </button>
              <button
                type="button"
                onClick={() => {
                  initializedPractice.current = null
                  setLoadAttempt((value) => value + 1)
                }}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
              >
                다시 시도
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm font-medium text-muted">대화방을 준비하고 있어요…</p>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col bg-bg">
      {/* Header */}
      <header className="flex h-[46px] shrink-0 items-center justify-between px-5 pt-1.5">
        <motion.button
          type="button"
          onClick={() => {
            // The result screen only makes sense once something was said.
            if (messages.some((m) => m.role === 'user')) navigate(`/result/${scenarioId}`)
            else navigate(-1)
          }}
          aria-label="연습 종료"
          whileTap={{ scale: PRESS.icon }}
          transition={T.instant}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-2xl bg-surface-sunken text-[17px] leading-none text-ink-2"
        >
          ×
        </motion.button>

        <div className="flex flex-col items-center">
          <span className="text-base font-semibold text-ink">
            {session.persona.contextLabel}
          </span>
          <span className="font-mono text-xs font-medium text-muted">
            {session.elapsed}
          </span>
        </div>

        <span aria-hidden="true" className="h-[34px] w-[34px]" />
      </header>

      {/* Goal pill */}
      <div className="shrink-0 px-5 pt-3">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-[7px] rounded-full bg-primary/10 px-3 py-[7px]">
            <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-2xs font-medium text-primary-deeper">
              {session.goalLabel}
            </span>
          </span>
          <span className="inline-flex items-center rounded-full bg-surface-sunken px-3 py-[7px] text-2xs font-medium text-muted">
            {session.guest
              ? `게스트 체험 · ${session.totalSteps}턴`
              : `로그인 연습 · ${session.totalSteps}턴`}
          </span>
        </div>
      </div>

      {/* Portrait */}
      <div className="shrink-0 px-5 pt-3">
        <motion.div
          style={{ height: portraitHeight }}
          className="relative overflow-hidden rounded-4xl"
        >
          {session.persona.portrait ? (
            <img
              src={session.persona.portrait}
              alt={`${session.persona.name} 초상`}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: 'linear-gradient(145deg, #EAE4D8 0%, #E1DACB 100%)' }}
            />
          )}

          <div
            className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3.5 py-3"
            style={{
              background: 'linear-gradient(180deg, rgba(40,33,18,0) 0%, rgba(40,33,18,0.28) 100%)',
            }}
          >
            <Chip tone="solid" shape="pill" className="px-[11px] py-[5px] text-xs font-bold">
              {session.expression}
            </Chip>
            <span className="flex gap-[5px]">
              {Array.from({ length: session.totalSteps }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    'block h-[7px] w-[7px] rounded-full transition-colors duration-200 ease-figma',
                    i === Math.min(session.step, session.totalSteps - 1)
                      ? 'bg-primary'
                      : 'bg-[#282112]/18',
                  )}
                />
              ))}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Drag handle — stays visually still while reporting pointer offset. */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => {
          dragOrigin.current = portraitHeight.get()
        }}
        onDrag={(_, info) => portraitHeight.set(clamp(dragOrigin.current + info.offset.y))}
        onDragEnd={snap}
        className="flex h-[26px] shrink-0 cursor-ns-resize touch-none items-center justify-center gap-2 px-5 pt-1.5"
      >
        <button
          type="button"
          onClick={toggleHeight}
          aria-label="대화 영역 높이 조절"
          className="flex items-center gap-2"
        >
          <span aria-hidden="true" className="block h-[5px] w-[46px] rounded-sm bg-[#282112]/22" />
          <span className="text-[9.5px] leading-3 font-medium text-muted">
            드래그로 높이 조절
          </span>
        </button>
      </motion.div>

      {/* Chat */}
      <div
        ref={scrollRef}
        className="scrollbar-none flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-2"
      >
        {messages.map((message, i) => (
          <ChatBubble
            key={message.id}
            message={message}
            index={i}
            onOpenFeedback={message.role === 'user' ? openFeedback : undefined}
          />
        ))}

        {sending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={T.dissolve}
            className="flex items-center gap-1.5 self-start rounded-[16px_16px_16px_5px] bg-surface-sunken px-3.5 py-3"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-1.5 w-1.5 rounded-full bg-muted"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex h-[104px] shrink-0 flex-col gap-2 px-[18px] pt-2.5 pb-4">
        {messageError && (
          <p role="alert" className="text-center text-xs text-hard-ink">
            {messageError}
          </p>
        )}
        <form
          className="flex items-center gap-2.5"
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
        >
          <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-3xl border border-line bg-surface-input pr-[18px] pl-2.5">
            <button
              type="button"
              aria-label="첨부"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-white/72 text-ink-4"
            >
              <Icon name="plus" size={14} weight={1.6} />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={session.completed ? '연습이 종료되었습니다' : '메시지 입력…'}
              aria-label="메시지 입력"
              disabled={session.completed}
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
            />
          </div>

          <motion.button
            type="button"
            aria-label="음성으로 답하기"
            whileTap={{ scale: PRESS.icon }}
            transition={T.instant}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[rgb(30_25_15/0.14)] bg-surface-input text-primary-strong"
          >
            <Icon name="mic" size={20} weight={1.8} />
          </motion.button>

          <motion.button
            type="submit"
            aria-label="보내기"
            disabled={!draft.trim() || sending || session.completed}
            whileTap={{ scale: PRESS.icon }}
            transition={T.instant}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-cta transition-opacity duration-200 ease-figma disabled:opacity-60"
          >
            <Icon name="send" size={18} />
          </motion.button>
        </form>

        <p className="text-center text-xs text-muted">
          마이크로 말하거나 입력 · 음성은 선택
        </p>
      </div>

      <AnswerFeedbackSheet
        feedback={feedback}
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  )
}
