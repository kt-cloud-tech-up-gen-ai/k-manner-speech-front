import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPaceOptions } from '@/api/client'
import type { PaceOption } from '@/api/types'
import { SelectRow } from '@/components/ui/SelectCard'
import { useAppStore } from '@/store/useAppStore'
import { OnboardingLayout } from './OnboardingLayout'

/** P04 · Weekly Pace — single select. */
export function PaceScreen() {
  const navigate = useNavigate()
  const [options, setOptions] = useState<PaceOption[]>([])
  const pace = useAppStore((s) => s.pace)
  const setPace = useAppStore((s) => s.setPace)

  useEffect(() => {
    getPaceOptions().then(setOptions)
  }, [])

  return (
    <OnboardingLayout
      step={2}
      heading="일주일에 몇 번 연습할까요?"
      subheading="내 일정에 맞춰 골라요 · Weekly pace"
      headingClassName="leading-tight"
      primaryLabel="다음 · Next"
      primaryDisabled={!pace}
      onPrimary={() => navigate('/onboarding/notifications')}
    >
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <SelectRow
            key={option.id}
            badge={String(option.times)}
            label={option.label}
            description={option.description}
            selected={pace === option.id}
            onClick={() => setPace(option.id)}
          />
        ))}
      </div>
    </OnboardingLayout>
  )
}
