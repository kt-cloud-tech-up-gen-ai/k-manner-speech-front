import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { getLegalDocuments } from '@/api/client'
import type { LegalDocument } from '@/api/types'
import { ScreenBody } from '@/components/shell/Screen'
import { BackButton } from '@/components/shell/TopBar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { EASE_OUT, PRESS, T } from '@/lib/motion'

/** P14 · Legal, with the P14A privacy tab. */
export function LegalScreen() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [activeId, setActiveId] = useState<LegalDocument['id']>('terms')

  useEffect(() => {
    getLegalDocuments().then(setDocuments)
  }, [])

  const active = documents.find((d) => d.id === activeId)

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-[46px] shrink-0 items-center gap-3 px-[22px] pt-2">
        <BackButton onClick={() => navigate(-1)} bare />
        <h1 className="flex items-baseline gap-1.5">
          <span className="text-[18px] leading-[22px] font-bold text-ink">약관 · 정책</span>
          <span className="text-md font-medium text-muted">Legal</span>
        </h1>
      </header>

      {/* Tab pair — the selected one is the dark #26241F pill. */}
      <div className="flex shrink-0 gap-2 px-[22px] pt-1">
        {documents.map((doc) => {
          const selected = doc.id === activeId
          return (
            <motion.button
              key={doc.id}
              type="button"
              onClick={() => setActiveId(doc.id)}
              aria-pressed={selected}
              whileTap={{ scale: PRESS.card }}
              transition={T.instant}
              className={cn(
                'relative h-[34px] flex-1 rounded-lg text-center transition-colors duration-200 ease-figma',
                selected
                  ? 'text-sm font-semibold text-white'
                  : 'border border-[rgb(30_25_15/0.12)] bg-surface text-xs font-medium text-muted-2',
              )}
            >
              {selected && (
                <motion.span
                  layoutId="legal-tab"
                  className="absolute inset-0 rounded-lg bg-surface-dark"
                  transition={T.dissolve}
                />
              )}
              <span className="relative">{doc.tab}</span>
            </motion.button>
          )
        })}
      </div>

      <ScreenBody className="px-[22px]">
        <AnimatePresence mode="wait" initial={false}>
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-muted">
                <span>{active.effectiveDate}</span>
                <span aria-hidden="true">·</span>
                <span>{active.version}</span>
              </p>

              <div className="mt-3.5 flex flex-col gap-5 pb-6">
                {active.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="text-base font-bold text-ink">{section.heading}</h2>
                    <p className="mt-1.5 text-xs leading-[21px] text-ink-4">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ScreenBody>

      <footer className="shrink-0 px-[22px] pt-3 pb-[30px]">
        <Button variant="outline" size="md" onClick={() => navigate(-1)}>
          전체 동의하고 계속
        </Button>
      </footer>
    </div>
  )
}
