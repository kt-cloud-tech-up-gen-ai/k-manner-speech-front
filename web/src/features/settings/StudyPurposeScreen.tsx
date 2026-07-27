import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPurposeOptions } from '@/api/client'
import type { PurposeOption } from '@/api/types'
import { SelectTile } from '@/components/ui/SelectCard'
import { useAppStore } from '@/store/useAppStore'
import { OnboardingLayout } from '@/features/onboarding/OnboardingLayout'

/**
 * `P13 · Settings · Study Purpose` — the P03 picker reached from the 공부 목적
 * row. Same component vocabulary, saves back to settings instead of advancing.
 */
export function StudyPurposeScreen() {
  const navigate = useNavigate()
  const [options, setOptions] = useState<PurposeOption[]>([])
  const purposes = useAppStore((s) => s.purposes)
  const togglePurpose = useAppStore((s) => s.togglePurpose)

  useEffect(() => {
    getPurposeOptions().then(setOptions)
  }, [])

  const rows: PurposeOption[][] = []
  for (let i = 0; i < options.length; i += 2) rows.push(options.slice(i, i + 2))

  return (
    <OnboardingLayout
      step={1}
      heading={'무엇을 연습하고\n싶나요?'}
      subheading="여러 개 선택할 수 있어요 · Pick a few"
      primaryLabel="저장 · Save"
      primaryDisabled={purposes.length === 0}
      onPrimary={() => navigate('/settings')}
    >
      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2.5">
            {row.map((option) => (
              <SelectTile
                key={option.id}
                title={option.label.ko}
                subtitle={option.label.en}
                selected={purposes.includes(option.id)}
                onClick={() => togglePurpose(option.id)}
              />
            ))}
            {row.length === 1 && <div className="flex-1" />}
          </div>
        ))}
      </div>
    </OnboardingLayout>
  )
}
