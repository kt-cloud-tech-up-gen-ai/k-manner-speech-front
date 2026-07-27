import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPaceOptions } from '@/api/client'
import type { PaceOption } from '@/api/types'
import { SelectRow } from '@/components/ui/SelectCard'
import { useAppStore } from '@/store/useAppStore'
import { OnboardingLayout } from '@/features/onboarding/OnboardingLayout'

/**
 * `P13-2 · Settings · Study Habit` — the P04 picker reached from the
 * 주간 학습 횟수 row.
 */
export function StudyPaceScreen() {
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
      primaryLabel="저장 · Save"
      primaryDisabled={!pace}
      onPrimary={() => navigate('/settings')}
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
