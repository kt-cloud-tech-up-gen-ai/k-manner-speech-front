import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, TitlePair } from '@/components/ui/Card'
import { Row, Stack, phoneWidth } from './decorators'

const meta = {
  title: 'UI/Card',
  component: Card,
  decorators: [phoneWidth],
  parameters: {
    docs: {
      description: {
        component:
          'The bordered surface behind scenarios, personas and settings groups. Selected swaps the hairline for a #466CC8 border plus a blue glow; muted is the #FBF9F5 login-gated surface.',
      },
    },
  },
  args: { children: <div className="p-4 text-sm text-ink">카드 내용</div> },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Selected: Story = { args: { selected: true } }
export const Muted: Story = { args: { muted: true } }
export const MediumRadius: Story = { args: { radius: 'md' } }

export const AllStates: Story = {
  render: () => (
    <Stack>
      <Row label="state">
        <div className="flex flex-col gap-3">
          <Card className="p-4 text-sm text-ink">default — 18px, hairline</Card>
          <Card selected className="p-4 text-sm text-ink">
            selected — primary border + glow
          </Card>
          <Card muted className="p-4 text-sm text-ink-2">
            muted — login-gated surface
          </Card>
          <Card radius="md" className="p-4 text-sm text-ink">
            radius=md — 16px, settings groups
          </Card>
        </div>
      </Row>
    </Stack>
  ),
}

export const TitlePairs: StoryObj = {
  render: () => (
    <Stack>
      <Row label="page title — P07 / P08 / P13">
        <TitlePair ko="페르소나" en="Personas" />
      </Row>
      <Row label="section title — P06">
        <TitlePair ko="오늘의 추천" en="Today's pick" size="section" />
      </Row>
    </Stack>
  ),
}
