import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from '@/components/ui/Toggle'
import { Row, Stack, phoneWidth } from './decorators'

const meta = {
  title: 'UI/Toggle',
  component: Toggle,
  decorators: [phoneWidth],
  parameters: {
    docs: {
      description: {
        component:
          '40x23 pill with an 18px thumb — P13 (on, #466CC8) and P13B (off, #D6D1C7). The prototype morphs between them with SMART_ANIMATE at 250ms.',
      },
    },
  },
  args: { checked: true, label: '알림 받기', onChange: () => {} },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const On: Story = {}
export const Off: Story = { args: { checked: false } }

function NotificationRow() {
  const [on, setOn] = useState(true)
  return (
    <Stack>
      <Row label="P13 알림 row">
        <div className="flex items-center justify-between">
          <span className="text-md font-medium text-ink">알림</span>
          <Toggle checked={on} onChange={setOn} label="알림 받기" />
        </div>
      </Row>
    </Stack>
  )
}

export const Interactive: Story = { render: () => <NotificationRow /> }
