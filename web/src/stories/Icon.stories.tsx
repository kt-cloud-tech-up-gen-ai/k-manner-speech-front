import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, type IconName } from '@/components/ui/Icon'
import { phoneWidth } from './decorators'

const NAMES: IconName[] = [
  'home',
  'practice',
  'profile',
  'search',
  'mic',
  'send',
  'plus',
  'chevron-right',
  'lock',
  'check',
  'close',
  'play',
]

const meta = {
  title: 'UI/Icon',
  component: Icon,
  decorators: [phoneWidth],
  parameters: {
    docs: {
      description: {
        component:
          'Line icons traced from the Figma vectors. Colour comes from `currentColor`, which is how the tab bar swaps #385DB8 (active) for #B4AC9B (inactive).',
      },
    },
  },
  args: { name: 'home', size: 21, weight: 1.7 },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {}

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <span className="text-ink">
            <Icon name={name} size={24} />
          </span>
          <span className="font-mono text-[9px] text-muted">{name}</span>
        </div>
      ))}
    </div>
  ),
}

/** The nav tint pair the design alternates between. */
export const NavStates: Story = {
  render: () => (
    <div className="flex gap-8">
      <span className="flex flex-col items-center gap-1 text-primary-strong">
        <Icon name="home" />
        <span className="text-2xs font-semibold">활성</span>
      </span>
      <span className="flex flex-col items-center gap-1 text-muted-3">
        <Icon name="home" />
        <span className="text-2xs font-medium text-muted">비활성</span>
      </span>
    </div>
  ),
}
