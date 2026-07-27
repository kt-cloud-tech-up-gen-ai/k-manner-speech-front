import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectRow, SelectTile } from '@/components/ui/SelectCard'
import { PACE_OPTIONS, PURPOSE_OPTIONS } from '@/api/fixtures'
import { Row, Stack, phoneWidth } from './decorators'

const meta = {
  title: 'UI/SelectCard',
  decorators: [phoneWidth],
  parameters: {
    docs: {
      description: {
        component:
          'The two selectable shapes. `SelectTile` is P03 학습목적 (multi-select, 2-up); `SelectRow` is P04 주간 빈도 (single select). Both are reused verbatim by the settings sub-flows.',
      },
    },
  },
} satisfies Meta

export default meta

function PurposeGrid() {
  const [picked, setPicked] = useState<string[]>(['dating'])
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const rows = []
  for (let i = 0; i < PURPOSE_OPTIONS.length; i += 2)
    rows.push(PURPOSE_OPTIONS.slice(i, i + 2))

  return (
      <div className="flex flex-col gap-2.5">
        {rows.map((pair, i) => (
          <div key={i} className="flex gap-2.5">
            {pair.map((o) => (
              <SelectTile
                key={o.id}
                title={o.label.ko}
                subtitle={o.label.en}
                selected={picked.includes(o.id)}
                onClick={() => toggle(o.id)}
              />
            ))}
          </div>
      ))}
    </div>
  )
}

function PaceList() {
  const [picked, setPicked] = useState('steady')
  return (
    <div className="flex flex-col gap-3">
      {PACE_OPTIONS.map((o) => (
        <SelectRow
          key={o.id}
          badge={String(o.times)}
          label={o.label}
          description={o.description}
          selected={picked === o.id}
          onClick={() => setPicked(o.id)}
        />
      ))}
    </div>
  )
}

/** P03 — tap to toggle; several may be on at once. */
export const Purpose: StoryObj = { render: () => <PurposeGrid /> }

/** P04 — single select with a numbered tile that inverts when chosen. */
export const Pace: StoryObj = { render: () => <PaceList /> }

export const BothStates: StoryObj = {
  render: () => (
    <Stack>
      <Row label="tile">
        <div className="flex gap-2.5">
          <SelectTile title="면접·직장 예절" subtitle="Work & interview" selected={false} onClick={() => {}} />
          <SelectTile title="이성과의 대화" subtitle="Dating & first impressions" selected onClick={() => {}} />
        </div>
      </Row>
      <Row label="row">
        <div className="flex flex-col gap-3">
          <SelectRow badge="1" label="가볍게" description="주 1회 · 부담 없이" selected={false} onClick={() => {}} />
          <SelectRow badge="3" label="꾸준히" description="주 3회 · 추천 루틴" selected onClick={() => {}} />
        </div>
      </Row>
    </Stack>
  ),
}
