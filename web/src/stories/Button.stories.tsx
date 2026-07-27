import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/Button'
import { Row, Stack, phoneWidth } from './decorators'

const meta = {
  title: 'UI/Button',
  component: Button,
  decorators: [phoneWidth],
  parameters: {
    docs: {
      description: {
        component:
          'Every CTA in the design reduces to variant x shape x size. `rounded` is the Inter-set button (P03/P04/P05/P11/P12); `pill` is the Noto-set one used by P02L, the language picker and the home-tutorial sheets.',
      },
    },
  },
  args: { children: '다음 · Next' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** P03 / P04 / P05 / P12 — the standard onboarding CTA. */
export const Primary: Story = {}

/** P05 "나중에 · Not now". */
export const Ghost: Story = { args: { variant: 'ghost', children: '나중에 · Not now' } }

/** P14 "전체 동의하고 계속", P10 "다시 하기". */
export const Outline: Story = { args: { variant: 'outline', children: '전체 동의하고 계속' } }

/** P06 tutorial tooltip "건너뛰기". */
export const Soft: Story = { args: { variant: 'soft', children: '건너뛰기' } }

/** P02L / language picker / tutorial sheets. */
export const Pill: Story = { args: { shape: 'pill', children: '저장 · Save' } }

/**
 * The design has no disabled state. A neutral surface reads as "not yet"
 * rather than a broken primary, so onboarding gates its CTA this way.
 */
export const Disabled: Story = { args: { disabled: true } }

/** Inside a card the primary CTA drops its glow (P06 "연습 시작 →"). */
export const InsideCard: Story = {
  args: { size: 'md', elevated: false, children: '연습 시작 →' },
}

export const AllVariants: Story = {
  render: () => (
    <Stack>
      <Row label="variant">
        <div className="flex flex-col gap-2.5">
          <Button>primary</Button>
          <Button variant="outline">outline</Button>
          <Button variant="soft">soft</Button>
          <Button variant="ghost">ghost</Button>
        </div>
      </Row>
      <Row label="shape">
        <div className="flex flex-col gap-2.5">
          <Button>rounded — 13px</Button>
          <Button shape="pill">pill — fully rounded</Button>
        </div>
      </Row>
      <Row label="size">
        <div className="flex flex-col gap-2.5">
          <Button size="lg">lg — 54px</Button>
          <Button size="md">md — 46px</Button>
          <Button size="sm">sm — 44px</Button>
        </div>
      </Row>
      <Row label="pair (fullWidth off) — P10 footer">
        <div className="flex gap-3">
          <Button variant="outline" fullWidth={false} className="flex-[124]">
            다시 하기
          </Button>
          <Button fullWidth={false} className="flex-[174]">
            다음 시나리오 →
          </Button>
        </div>
      </Row>
    </Stack>
  ),
}
