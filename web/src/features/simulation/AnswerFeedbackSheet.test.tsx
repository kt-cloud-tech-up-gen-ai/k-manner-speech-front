import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import type { AnswerFeedback } from '@/api/types'
import { AnswerFeedbackSheet } from './AnswerFeedbackSheet'

const baseFeedback: AnswerFeedback = {
  inputType: 'voice',
  meta: '마이크 입력 · 4.7초 · 분석 완료',
  durationSeconds: 4.7,
  score: 8.8,
  scoreOutOf: 10,
  scoreLabel: '또렷해요',
  secondaryMetrics: '표현 9.2 · 상황 9.0',
  expression: '첫 마디에 “혹시”를 넣으면 더 부드러워요.',
  voiceEmotion: {
    emotions: [
      { label: '차분함', percentage: 72 },
      { label: '친절함', percentage: 18 },
      { label: '긴장감', percentage: 10 },
    ],
    impressions: ['차분하게 들려요', '공손한 말투예요', '조금 긴장한 느낌이 있어요'],
  },
}

describe('AnswerFeedbackSheet', () => {
  afterEach(cleanup)

  it('shows voice emotion and listener impressions without obsolete segment feedback', () => {
    render(<AnswerFeedbackSheet feedback={baseFeedback} open onClose={() => undefined} />)

    expect(screen.getByRole('heading', { name: '감정 분석' })).toBeInTheDocument()
    expect(screen.getByText('차분함')).toBeInTheDocument()
    expect(screen.getByText('72%')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '상대가 느끼는 인상' })).toBeInTheDocument()
    expect(screen.getByText('공손한 말투예요')).toBeInTheDocument()
    expect(screen.queryByText('오류 구간')).not.toBeInTheDocument()
    expect(screen.queryByText('구간별 피드백')).not.toBeInTheDocument()
  })

  it('does not claim acoustic analysis for typed feedback', () => {
    render(
      <AnswerFeedbackSheet
        feedback={{ ...baseFeedback, inputType: 'text', meta: '텍스트 입력 · 분석 완료', voiceEmotion: undefined }}
        open
        onClose={() => undefined}
      />,
    )

    expect(screen.queryByRole('heading', { name: '감정 분석' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '상대가 느끼는 인상' })).not.toBeInTheDocument()
    expect(screen.queryByText('발음 점수')).not.toBeInTheDocument()
    expect(screen.queryByText('8.8')).not.toBeInTheDocument()
    expect(screen.getByText(baseFeedback.expression)).toBeInTheDocument()
  })
})
