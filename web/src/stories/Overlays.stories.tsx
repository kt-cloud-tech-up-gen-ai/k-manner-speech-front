import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AnswerFeedbackSheet } from '@/features/simulation/AnswerFeedbackSheet'
import { ANSWER_FEEDBACK } from '@/api/fixtures'
import { phoneScreen } from './decorators'

const meta = {
  title: 'UI/Overlays',
  decorators: [phoneScreen],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Overlays position against `absolute inset-0`, so they are shown inside a real 360x768 canvas. Open state is controlled here so the dismiss paths stay exercisable.',
      },
    },
  },
} satisfies Meta

export default meta

/** Reopen affordance so a dismissed overlay can be brought back in isolation. */
function Host({ children }: { children: (open: boolean, close: () => void, show: () => void) => ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex h-full items-center justify-center">
      <Button fullWidth={false} onClick={() => setOpen(true)}>
        열기
      </Button>
      {children(open, () => setOpen(false), () => setOpen(true))}
    </div>
  )
}

/**
 * The `ConfirmDialog · Continue or Restart` master, reused by P08-3
 * (이어하기 / 새로하기) and P13C (취소 / 탈퇴). Backdrop tap and Escape run
 * `onDismiss`, which is deliberately separate from the left button.
 */
export const ContinueOrRestart: StoryObj = {
  render: () => (
    <Host>
      {(open, close) => (
        <ConfirmDialog
          open={open}
          title="새로 진행하시겠습니까?"
          description="진행 중인 시나리오가 있어요. 이어서 하거나 처음부터 다시 시작할 수 있습니다."
          cancelLabel="이어하기"
          confirmLabel="새로하기"
          onDismiss={close}
          onCancel={close}
          onConfirm={close}
        />
      )}
    </Host>
  ),
}

/** P13C — the same master with a destructive confirm. */
export const DeleteConfirm: StoryObj = {
  render: () => (
    <Host>
      {(open, close) => (
        <ConfirmDialog
          open={open}
          title="회원탈퇴"
          description="정말 탈퇴할까요? 모든 학습 기록과 데이터가 삭제되며 되돌릴 수 없습니다."
          cancelLabel="취소"
          confirmLabel="탈퇴"
          destructive
          onCancel={close}
          onConfirm={close}
        />
      )}
    </Host>
  ),
}

/** The sheet shape behind the language picker: #FBFAF7, 28px top radius. */
export const Sheet: StoryObj = {
  render: () => (
    <Host>
      {(open, close) => (
        <BottomSheet open={open} onClose={close} label="예시 시트">
          <div className="px-6 pt-4 pb-8">
            <h2 className="font-splash text-[22px] font-bold text-ink">시트 제목</h2>
            <p className="mt-2 text-base text-lang-help">Sheet body</p>
          </div>
        </BottomSheet>
      )}
    </Host>
  ),
}

/** `Overlay · Answer Feedback` — the P09 pronunciation report. */
export const AnswerFeedback: StoryObj = {
  render: () => (
    <Host>
      {(open, close) => (
        <AnswerFeedbackSheet feedback={ANSWER_FEEDBACK} open={open} onClose={close} />
      )}
    </Host>
  ),
}
