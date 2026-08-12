import type { HomeSummary, LegalDocument, PaceOption, PurposeOption } from './types'

export const HOME_SUMMARY: HomeSummary = {
  greeting: '안녕하세요!',
  greetingSub: '로그인하고 학습기록을 안전하게 저장하세요.',
  streak: { label: '이번 주 연속 연습', days: 3, weeklyGoal: 7, statusLabel: '진행 중' },
  pick: {
    scenarioId: 'campus_directions',
    personaLabel: '도윤 · 캠퍼스',
    title: '캠퍼스에서 길 물어보기',
    meta: '처음 만난 사이 · 약 3분',
    difficulty: 'easy',
    difficultyLabel: '난이도 하 · Easy',
  },
  resumeLabel: '최근 연습 이어서 하기',
}

export const PURPOSE_OPTIONS: PurposeOption[] = [
  { id: 'work', label: { ko: '면접·직장 예절', en: 'Work & interview' } },
  { id: 'dating', label: { ko: '이성과의 대화', en: 'Dating & first impressions' } },
  { id: 'smalltalk', label: { ko: '첫인상·스몰토크', en: 'Small talk' } },
  { id: 'requests', label: { ko: '부탁·거절', en: 'Requests & refusals' } },
  { id: 'service', label: { ko: '민원·고객응대', en: 'Service & complaints' } },
  { id: 'honorifics', label: { ko: '어른께 존댓말', en: 'Honorifics' } },
]

export const PACE_OPTIONS: PaceOption[] = [
  { id: 'light', times: 1, label: '가볍게', description: '주 1회 · 부담 없이' },
  { id: 'steady', times: 3, label: '꾸준히', description: '주 3회 · 추천 루틴' },
  { id: 'focused', times: 5, label: '집중', description: '주 5회 · 집중 루틴' },
]

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'terms', tab: '이용약관', effectiveDate: '시행일 2026.08.11', version: 'v1.3',
    sections: [
      { heading: '제1조 (목적)', body: '이 약관은 K-Manner Speech가 제공하는 한국어 화용 학습 서비스의 이용 조건과 회사와 회원의 권리·의무를 규정합니다.' },
      { heading: '제2조 (서비스)', body: '서비스는 페르소나 대화 연습, 표현 피드백 및 학습 기록 관리 기능을 제공합니다. 게스트 연습은 사용자가 보낸 메시지 3개까지 제공됩니다.' },
    ],
  },
  {
    id: 'privacy', tab: '개인정보처리방침', effectiveDate: '시행일 2026.08.11', version: 'v1.3',
    sections: [
      { heading: '1. 수집 항목과 목적', body: '회원가입과 계정 관리에 이메일과 이름을 이용하며, 맞춤 학습과 서비스 제공을 위해 나이, 학습 설정, 대화 및 피드백 기록을 처리합니다.' },
      { heading: '2. 보유 기간', body: '대화 기록과 피드백 기록은 정책상 2년 동안 보유합니다. 이번 버전에는 자동 삭제 작업이 포함되지 않습니다.' },
      { heading: '3. 회원 탈퇴', body: '회원 탈퇴 시 이름, 이메일 등 계정 개인정보와 프로필, 목표, 방, 메시지 및 피드백을 즉시 삭제합니다.' },
      { heading: '4. 제3자 제공', body: '개인정보를 제3자에게 제공하지 않습니다.' },
    ],
  },
]
