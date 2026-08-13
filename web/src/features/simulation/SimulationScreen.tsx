import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { animate, motion, useMotionValue } from 'motion/react'
import { getSimulation, processTextTurn, processVoiceTurn } from '@/api/client'
import type { VoiceRecording } from '@/api/client'
import type { AnswerFeedback, ChatMessage, SimulationSession } from '@/api/types'
import { Button } from '@/components/ui/Button'
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

const blobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onerror = () => reject(new Error('녹음 파일을 읽지 못했습니다.'))
  reader.onloadend = () => resolve(String(reader.result).split(',', 2)[1] ?? '')
  reader.readAsDataURL(blob)
})

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
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [listening, setListening] = useState(false)
  const [inputError, setInputError] = useState('')
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const portraitHeight = useMotionValue(PORTRAIT_TALL)
  const dragOrigin = useRef(PORTRAIT_TALL)
  const scrollRef = useRef<HTMLDivElement>(null)
  const initializedPractice = useRef<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const voiceTranscriptRef = useRef('')
  const recordingStartedAtRef = useRef(0)

  useEffect(() => () => {
    recognitionRef.current?.abort()
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop()
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    audioRef.current?.pause()
  }, [])

  useEffect(() => {
    const practiceKey = `${scenarioId}:${mode}:${retryCount}`
    if (initializedPractice.current === practiceKey) return
    initializedPractice.current = practiceKey
    setLoading(true)
    setLoadError('')
    void getSimulation(scenarioId, mode)
      .then((s) => {
        if (!s) throw new Error('연습 정보를 불러올 수 없습니다.')
        setSession(s)
        setMessages(s.messages)
        if (mode === 'continue') {
          // Arriving mid-conversation, the design shows the chat already opened up.
          portraitHeight.set(PORTRAIT_SHORT)
        }
      })
      .catch((reason: unknown) => {
        setLoadError(
          reason instanceof Error ? reason.message : '연습 정보를 불러올 수 없습니다.',
        )
      })
      .finally(() => setLoading(false))
  }, [scenarioId, mode, portraitHeight, retryCount])

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

  async function runTurn(
    text: string,
    inputType: 'text' | 'voice',
    recording?: VoiceRecording,
  ) {
    if (!session || sending) return
    setInputError('')
    setSending(true)
    const optimisticId = `local-${Date.now()}`
    setMessages((prev) => [...prev, { id: optimisticId, role: 'user', text, inputType }])
    setDraft('')
    try {
      const result = inputType === 'voice'
        ? recording
          ? await processVoiceTurn(session.roomId, text, recording)
          : (() => { throw new Error('분석할 녹음 데이터가 없습니다.') })()
        : await processTextTurn(session.roomId, text)
      setMessages((prev) => [
        ...prev.filter((message) => message.id !== optimisticId),
        ...result.messages,
      ])
    } catch (reason) {
      setInputError(reason instanceof Error ? reason.message : '답변을 처리하지 못했습니다.')
    } finally {
      setSending(false)
    }
  }

  function playAnswerAudio(url: string) {
    audioRef.current?.pause()
    const audio = new Audio(url)
    audio.crossOrigin = 'use-credentials'
    audioRef.current = audio
    void audio.play().catch(() => setInputError('음성을 재생하지 못했습니다.'))
  }

  async function submit() {
    const text = draft.trim()
    if (!text || sending) return
    setDraft('')
    await runTurn(text, 'text')
  }

  async function startVoiceInput() {
    if (sending || listening) return
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Recognition || !window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
      setInputError('이 브라우저는 음성 녹음과 인식을 지원하지 않습니다. Chrome 또는 Safari를 사용해 주세요.')
      return
    }
    setInputError('')
    setListening(true)
    voiceTranscriptRef.current = ''
    recordedChunksRef.current = []
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setListening(false)
      setInputError('마이크 권한을 허용해 주세요.')
      return
    }
    mediaStreamRef.current = stream
    const preferredMime = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus']
      .find((mime) => MediaRecorder.isTypeSupported(mime))
    const recorder = preferredMime
      ? new MediaRecorder(stream, { mimeType: preferredMime })
      : new MediaRecorder(stream)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunksRef.current.push(event.data)
    }
    recorder.onerror = () => setInputError('음성을 녹음하지 못했습니다.')
    recorder.onstop = () => {
      const durationSeconds = Math.max(
        0.1,
        (performance.now() - recordingStartedAtRef.current) / 1000,
      )
      const mimeType = recorder.mimeType.split(';', 1)[0] || 'audio/webm'
      const blob = new Blob(recordedChunksRef.current, { type: mimeType })
      stream.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
      mediaRecorderRef.current = null
      setListening(false)
      const transcript = voiceTranscriptRef.current.trim()
      if (!transcript || !blob.size) {
        if (!transcript) setInputError('인식된 음성이 없습니다. 다시 말씀해 주세요.')
        return
      }
      void blobToBase64(blob)
        .then((audioBase64) => runTurn(transcript, 'voice', {
          audioBase64,
          mimeType,
          durationSeconds: Number(durationSeconds.toFixed(2)),
        }))
        .catch((reason: unknown) => {
          setInputError(reason instanceof Error ? reason.message : '녹음 파일을 처리하지 못했습니다.')
        })
    }
    const recognition = new Recognition()
    recognition.lang = 'ko-KR'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0]?.transcript ?? ''
      }
      const cleanTranscript = transcript.trim()
      voiceTranscriptRef.current = cleanTranscript
      setDraft(cleanTranscript)
      const last = event.results[event.results.length - 1]
      if (last?.isFinal && cleanTranscript) recognition.stop()
    }
    recognition.onerror = (event) => {
      if (event.error !== 'aborted') setInputError(`음성 인식 오류: ${event.error}`)
    }
    recognition.onend = () => {
      if (recorder.state === 'recording') recorder.stop()
      else setListening(false)
    }
    recognitionRef.current = recognition
    recordingStartedAtRef.current = performance.now()
    recorder.start()
    try {
      recognition.start()
    } catch {
      recorder.stop()
      setInputError('음성 인식을 시작하지 못했습니다.')
    }
  }

  function openFeedback(value: AnswerFeedback) {
    setFeedback(value)
    setFeedbackOpen(true)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-bg px-7">
        <p role="status" className="text-center text-sm font-medium text-muted-2">
          연습을 준비하고 있어요
        </p>
      </div>
    )
  }

  if (loadError || !session) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-bg px-7 text-center">
        <p role="alert" className="text-base font-semibold text-ink">
          {loadError || '연습 정보를 불러올 수 없습니다.'}
        </p>
        <p className="mt-2 text-sm text-muted-2">잠시 후 다시 시도해 주세요.</p>
        <div className="mt-6 flex w-full flex-col gap-3">
          <Button
            size="md"
            onClick={() => {
              initializedPractice.current = null
              setRetryCount((count) => count + 1)
            }}
          >
            다시 시도
          </Button>
          <Button variant="ghost" size="md" onClick={() => navigate('/personas')}>
            시나리오 목록
          </Button>
        </div>
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
            if (session) navigate(`/personas/${session.persona.id}`)
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
        <span className="inline-flex items-center gap-[7px] rounded-full bg-primary/10 px-3 py-[7px]">
          <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-2xs font-medium text-primary-deeper">
            {session.goalLabel}
          </span>
        </span>
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
                    i === session.step ? 'bg-primary' : 'bg-[#282112]/18',
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
            onOpenFeedback={message.role === 'user' && message.feedback ? () => openFeedback(message.feedback!) : undefined}
            onPlayAudio={playAnswerAudio}
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
              placeholder="메시지 입력…"
              aria-label="메시지 입력"
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
            />
          </div>

          <motion.button
            type="button"
            aria-label="음성으로 답하기"
            aria-pressed={listening}
            onClick={() => listening ? recognitionRef.current?.stop() : void startVoiceInput()}
            disabled={sending}
            whileTap={{ scale: PRESS.icon }}
            transition={T.instant}
            className={cn(
              'flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[rgb(30_25_15/0.14)] text-primary-strong disabled:opacity-60',
              listening ? 'bg-primary/15 ring-2 ring-primary/30' : 'bg-surface-input',
            )}
          >
            <Icon name="mic" size={20} weight={1.8} />
          </motion.button>

          <motion.button
            type="submit"
            aria-label="보내기"
            disabled={!draft.trim() || sending}
            whileTap={{ scale: PRESS.icon }}
            transition={T.instant}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-cta transition-opacity duration-200 ease-figma disabled:opacity-60"
          >
            <Icon name="send" size={18} />
          </motion.button>
        </form>

        <p role={inputError ? 'alert' : undefined} className={cn('text-center text-xs', inputError ? 'text-hard-ink' : 'text-muted')}>
          {inputError || (listening ? '듣고 있어요… 말씀해 주세요' : '마이크로 말하거나 입력 · 음성은 선택')}
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
