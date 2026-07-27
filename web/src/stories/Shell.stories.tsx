import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneShell } from '@/components/shell/PhoneShell'
import { StatusBar } from '@/components/shell/StatusBar'
import { TabBar } from '@/components/shell/TabBar'
import { BackButton, Stepper } from '@/components/shell/TopBar'
import { SearchField, SearchToggle } from '@/components/ui/SearchField'
import { TitlePair } from '@/components/ui/Card'
import { Row, Stack, phoneBleed } from './decorators'

const meta = {
  title: 'Shell',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The shell owns the status bar and tab bar for every route. Screens render only the body between them — nothing above y=51 or below y=701 belongs in a screen file.',
      },
    },
  },
} satisfies Meta

export default meta

/** The 360x768 device canvas: 44px radius, 1px hairline, dynamic island. */
export const Device: StoryObj = {
  render: () => (
    <PhoneShell>
      <StatusBar />
      <div className="flex flex-1 items-center justify-center text-sm text-muted">
        screen body
      </div>
      <TabBar />
    </PhoneShell>
  ),
}

export const StatusBarTones: StoryObj = {
  decorators: [phoneBleed],
  render: () => (
    <Stack>
      <Row label="dark — every screen except splash">
        <StatusBar />
      </Row>
      <Row label="light — P01 splash, on the blue field">
        <div className="bg-primary-splash">
          <StatusBar tone="light" />
        </div>
      </Row>
    </Stack>
  ),
}

/** P03 = 1/3, P04 = 2/3, P05 = 3/3. */
export const OnboardingStepper: StoryObj = {
  decorators: [phoneBleed],
  render: () => (
    <Stack>
      {[1, 2, 3].map((step) => (
        <Row key={step} label={`step ${step} / 3`}>
          <Stepper step={step} />
        </Row>
      ))}
    </Stack>
  ),
}

export const BackButtons: StoryObj = {
  decorators: [phoneBleed],
  render: () => (
    <Stack>
      <Row label="bare — onboarding and detail headers">
        <div className="px-6">
          <BackButton />
        </div>
      </Row>
      <Row label="filled — P09 close affordance">
        <div className="px-6">
          <BackButton bare={false} />
        </div>
      </Row>
    </Stack>
  ),
}

function SearchHeader() {
  const [open, setOpen] = useState(true)
  const [value, setValue] = useState('도윤')
  return (
    <div className="pb-4">
      <div className="flex items-center justify-between px-[22px] pt-2.5">
        <TitlePair ko="페르소나" en="Personas" />
        <SearchToggle open={open} onToggle={() => setOpen((v) => !v)} />
      </div>
      <SearchField
        open={open}
        value={value}
        onChange={setValue}
        placeholder="이름이나 관계로 찾기"
      />
    </div>
  )
}

/** P07-1 / P08-1: the magnifier expands a 36px field beneath the header. */
export const Search: StoryObj = {
  decorators: [phoneBleed],
  render: () => <SearchHeader />,
}

export const Tabs: StoryObj = {
  decorators: [phoneBleed],
  render: () => <TabBar />,
}
