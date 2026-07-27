import type { Meta, StoryObj } from '@storybook/react-vite'
import { PersonaCard } from '@/features/personas/PersonaCard'
import { ScenarioCard } from '@/features/personas/ScenarioCard'
import { ChatBubble } from '@/features/simulation/ChatBubble'
import { SettingsGroup, SettingsRow } from '@/features/settings/SettingsRow'
import { Toggle } from '@/components/ui/Toggle'
import { PERSONAS, SCENARIOS, SIMULATION_CONTINUED } from '@/api/fixtures'
import { Row, Stack, phoneWidth } from './decorators'

const meta = {
  title: 'Feature/Cards',
  decorators: [phoneWidth],
  parameters: {
    docs: {
      description: {
        component:
          'Composites that appear on more than one screen. Content comes from the same fixtures the app reads, so these stay in step with the running app.',
      },
    },
  },
} satisfies Meta

export default meta

/** P07 — the grid tile. Locked personas dim to 50% and gain a padlock. */
export const Personas: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      {PERSONAS.map((p, i) => (
        <PersonaCard key={p.id} persona={p} selected={i === 0} onClick={() => {}} />
      ))}
    </div>
  ),
}

/** P08 — recommended, plain and login-gated, in that order. */
export const Scenarios: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-3">
      {SCENARIOS.filter((s) => s.personaId === 'doyun').map((s) => (
        <ScenarioCard key={s.id} scenario={s} onClick={() => {}} />
      ))}
    </div>
  ),
}

/**
 * P09.1 — the tail is an asymmetric radius: 16/16/5/16 for the user's bubble
 * and 16/16/16/5 for the persona's. Bubble copy is Noto Sans KR, not Inter.
 */
export const ChatBubbles: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2.5">
      {SIMULATION_CONTINUED.map((m, i) => (
        <ChatBubble
          key={m.id}
          message={m}
          index={i}
          onOpenFeedback={m.role === 'user' ? () => {} : undefined}
        />
      ))}
    </div>
  ),
}

/** P13 — grouped rows with a 10px uppercase label and hairline separators. */
export const SettingsGroups: StoryObj = {
  render: () => (
    <Stack>
      <Row label="학습 · LEARNING">
        <SettingsGroup label="학습 · LEARNING">
          <SettingsRow title="공부 목적" onClick={() => {}} />
          <SettingsRow title="주간 학습 횟수" value="주 3회" onClick={() => {}} />
        </SettingsGroup>
      </Row>
      <Row label="계정 · ACCOUNT">
        <SettingsGroup label="계정 · ACCOUNT">
          <SettingsRow title="개인정보 수정" onClick={() => {}} />
          <SettingsRow title="언어" value="한국어 · KO" onClick={() => {}} />
          <SettingsRow
            title="알림"
            control={<Toggle checked onChange={() => {}} label="알림 받기" />}
          />
        </SettingsGroup>
      </Row>
      <Row label="no chevrons — sign-out / delete group">
        <SettingsGroup>
          <SettingsRow first chevron={false} title="로그아웃" tone="muted" onClick={() => {}} />
          <SettingsRow
            chevron={false}
            title="회원탈퇴"
            value="데이터 삭제"
            tone="danger"
            onClick={() => {}}
          />
        </SettingsGroup>
      </Row>
    </Stack>
  ),
}
