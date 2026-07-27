import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip, type ChipTone } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { Row, Stack, phoneWidth } from './decorators'

const meta = {
  title: 'UI/Chip',
  component: Chip,
  decorators: [phoneWidth],
  parameters: {
    docs: {
      description: {
        component:
          'Difficulty chips are a 14-16% tint of their hue with a deep ink label — the pattern P08 uses for 난이도 하/중/상.',
      },
    },
  },
  args: { children: '난이도 하' },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

const TONES: Array<[ChipTone, string]> = [
  ['easy', '난이도 하'],
  ['medium', '난이도 중'],
  ['hard', '난이도 상'],
  ['solid', '추천'],
  ['primary', '처음 만난 또래'],
  ['neutral', '윗사람'],
  ['dark', '난이도 하 · Easy'],
  ['info', '1 / 4'],
  ['issue', '00:01.2–00:01.8'],
  ['score', '또렷해요'],
]

export const Easy: Story = { args: { tone: 'easy' } }
export const Locked: Story = {
  args: {
    tone: 'primary',
    shape: 'md',
    icon: <Icon name="lock" size={11} weight={1.3} />,
    children: '로그인 시 이용 가능',
  },
}

export const AllTones: Story = {
  render: () => (
    <Stack>
      <Row label="tone">
        <div className="flex flex-wrap gap-2">
          {TONES.map(([tone, label]) => (
            <Chip key={tone} tone={tone}>
              {label}
            </Chip>
          ))}
        </div>
      </Row>
      <Row label="shape">
        <div className="flex flex-wrap items-center gap-2">
          <Chip shape="sm">sm — 7px</Chip>
          <Chip shape="md">md — 8px</Chip>
          <Chip shape="pill" tone="solid">
            pill — 표정 · 미소
          </Chip>
        </div>
      </Row>
    </Stack>
  ),
}
