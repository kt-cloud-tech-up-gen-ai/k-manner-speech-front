import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { FREE_CHAT_SCENARIO_ID, getPersona, getRooms, getScenarios } from '@/api/client'
import type { Persona, Scenario } from '@/api/types'
import { ScreenBody } from '@/components/shell/Screen'
import { BackButton } from '@/components/shell/TopBar'
import { TitlePair } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SearchField, SearchToggle } from '@/components/ui/SearchField'
import { EASE_OUT } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import { ScenarioCard } from './ScenarioCard'

const AVATAR_GRADIENT = 'linear-gradient(135deg, #E0D9CA 0%, #D6CEBD 100%)'

/**
 * P08 · Scenarios for one persona, plus P08-1/P08-2 search and the P08-3
 * "이어하기 / 새로하기" dialog that appears when the tapped scenario is
 * already in progress.
 */
export function ScenariosScreen() {
  const navigate = useNavigate()
  const { personaId = '' } = useParams()
  const signedIn = useAppStore((s) => s.signedIn)

  const [persona, setPersona] = useState<Persona | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [resumeTarget, setResumeTarget] = useState<Scenario | null>(null)

  useEffect(() => {
    Promise.all([getPersona(personaId), getScenarios(personaId), getRooms()]).then(
      ([loadedPersona, loadedScenarios, rooms]) => {
        setPersona(loadedPersona ?? null)
        const activeScenarioIds = new Set(
          rooms
            .filter((room) => room.persona_id === personaId && room.status === 'in_progress')
            .map((room) => room.scenario_id),
        )
        setScenarios(
          loadedScenarios.map((scenario) => ({
            ...scenario,
            inProgress: scenario.id === FREE_CHAT_SCENARIO_ID
              ? activeScenarioIds.has(null)
              : activeScenarioIds.has(scenario.id),
          })),
        )
      },
    )
  }, [personaId])

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return scenarios
    return scenarios.filter(
      (s) => s.title.ko.includes(q) || s.title.en.includes(q) || s.goal.includes(q),
    )
  }, [scenarios, query])

  function start(scenario: Scenario, mode: 'new' | 'continue' = 'new') {
    if (scenario.requiresLogin && !signedIn) {
      navigate('/login')
      return
    }
    const search = new URLSearchParams()
    if (mode === 'continue') search.set('mode', 'continue')
    if (scenario.id === FREE_CHAT_SCENARIO_ID) search.set('persona', personaId)
    const queryString = search.toString()
    navigate(`/simulation/${scenario.id}${queryString ? `?${queryString}` : ''}`)
  }

  function pick(scenario: Scenario) {
    if (scenario.id === FREE_CHAT_SCENARIO_ID && scenario.inProgress) {
      start(scenario, 'continue')
      return
    }
    if (scenario.inProgress) {
      setResumeTarget(scenario)
      return
    }
    start(scenario)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-[46px] shrink-0 items-center gap-3 px-[22px] pt-2">
        <BackButton onClick={() => navigate('/personas')} bare />
        <motion.div
          layoutId="persona-pill"
          className="flex items-center gap-2 rounded-full bg-surface-sunken py-1.5 pr-3 pl-2"
        >
          <span
            className="block h-[26px] w-[26px] rounded-full"
            style={{ background: AVATAR_GRADIENT }}
          />
          <span className="text-sm font-semibold text-ink-3">
            {persona?.contextLabel ?? ''}
          </span>
        </motion.div>
      </header>

      <div className="flex h-14 shrink-0 items-center justify-between px-[22px] pt-4 pb-1.5">
        <TitlePair ko="시나리오" en="Scenarios" />
        <SearchToggle
          open={searchOpen}
          onToggle={() => {
            if (searchOpen) setQuery('')
            setSearchOpen((v) => !v)
          }}
        />
      </div>

      <SearchField
        open={searchOpen}
        value={query}
        onChange={setQuery}
        placeholder="시나리오 검색"
      />

      <ScreenBody className="px-[22px] pt-1.5">
        <div className="flex flex-col gap-3 pb-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((scenario, i) => (
              <motion.div
                key={scenario.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28, ease: EASE_OUT, delay: i * 0.04 }}
                className="flex flex-col"
              >
                <ScenarioCard scenario={scenario} onClick={() => pick(scenario)} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="mt-14 text-center text-sm text-muted">
              &ldquo;{query}&rdquo;와 일치하는 시나리오가 없어요.
            </p>
          )}
        </div>
      </ScreenBody>

      <ConfirmDialog
        open={resumeTarget !== null}
        title="새로 진행하시겠습니까?"
        description="진행 중인 시나리오가 있어요. 이어서 하거나 처음부터 다시 시작할 수 있습니다."
        cancelLabel="이어하기"
        confirmLabel="새로하기"
        onDismiss={() => setResumeTarget(null)}
        onCancel={() => {
          const target = resumeTarget
          setResumeTarget(null)
          if (target) start(target, 'continue')
        }}
        onConfirm={() => {
          const target = resumeTarget
          setResumeTarget(null)
          if (target) start(target, 'new')
        }}
      />
    </div>
  )
}
