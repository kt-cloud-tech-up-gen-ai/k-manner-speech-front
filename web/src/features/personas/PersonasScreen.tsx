import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { getPersonas } from '@/api/client'
import type { Persona } from '@/api/types'
import { ScreenBody } from '@/components/shell/Screen'
import { TitlePair } from '@/components/ui/Card'
import { SearchField, SearchToggle } from '@/components/ui/SearchField'
import { EASE_OUT, T } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import { PersonaCard } from './PersonaCard'

/** P07 · Personas, with the P07-1 search input and P07-2 result states. */
export function PersonasScreen() {
  const navigate = useNavigate()
  const signedIn = useAppStore((s) => s.signedIn)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getPersonas().then(setPersonas)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return personas
    return personas.filter(
      (p) => p.name.includes(q) || p.role.includes(q) || p.relationship.includes(q),
    )
  }, [personas, query])

  function open(persona: Persona) {
    if (persona.requiresLogin && !signedIn) {
      navigate('/login')
      return
    }
    navigate(`/personas/${persona.id}`)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-11 shrink-0 items-center justify-between px-[22px] pt-2.5">
        <TitlePair ko="페르소나" en="Personas" />
        <SearchToggle
          open={searchOpen}
          onToggle={() => {
            if (searchOpen) setQuery('')
            setSearchOpen((v) => !v)
          }}
        />
      </header>

      <SearchField
        open={searchOpen}
        value={query}
        onChange={setQuery}
        placeholder="이름이나 관계로 찾기"
      />

      <ScreenBody className="px-[22px] pt-3">
        <div className="grid grid-cols-2 gap-3 pb-6">
          <AnimatePresence initial={false}>
            {filtered.map((persona, i) => (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: EASE_OUT, delay: i * 0.04 }}
              >
                <PersonaCard
                  persona={persona}
                  selected={i === 0 && !query}
                  onClick={() => open(persona)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={T.dissolve}
            className="mt-16 text-center text-sm text-muted"
          >
            &ldquo;{query}&rdquo;와 일치하는 페르소나가 없어요.
          </motion.p>
        )}
      </ScreenBody>
    </div>
  )
}
