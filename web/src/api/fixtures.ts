import doyunPortrait from '@/assets/characters/doyun.jpg'
import type {
  AnswerFeedback,
  PracticeResult,
  ChatMessage,
  HomeSummary,
  LegalDocument,
  PaceOption,
  Persona,
  PurposeOption,
  Scenario,
} from './types'

/**
 * Content transcribed from the Figma frames. This is the only place literal
 * copy lives — screens read it through `client.ts` so the eventual server
 * swap touches one module.
 */

export const PERSONAS: Persona[] = [
  {
    id: 'doyun',
    name: '도윤',
    role: '캠퍼스 훈남',
    relationship: '처음 만난 또래',
    contextLabel: '도윤 · 캠퍼스',
    portrait: doyunPortrait,
    requiresLogin: false,
  },
  {
    id: 'jihoon',
    name: '지훈',
    role: '학과 선배',
    relationship: '윗사람',
    contextLabel: '지훈 · 학과',
    requiresLogin: false,
  },
  {
    id: 'director',
    name: '이사님',
    role: 'IT 기업 면접관',
    relationship: '로그인 시 이용 가능',
    contextLabel: '이사님 · 면접',
    requiresLogin: true,
  },
  {
    id: 'minji',
    name: '민지',
    role: '카페 알바',
    relationship: '로그인 시 이용 가능',
    contextLabel: '민지 · 카페',
    requiresLogin: true,
  },
]

export const SCENARIOS: Scenario[] = [
  {
    id: 'ask-directions',
    personaId: 'doyun',
    title: { ko: '길 물어보기', en: 'Ask for directions' },
    goal: '처음 보는 사람에게 자연스럽게 위치를 묻고 감사 인사하기',
    difficulty: 'easy',
    estimatedMinutes: 3,
    recommended: true,
    inProgress: false,
    requiresLogin: false,
  },
  {
    id: 'study-together',
    personaId: 'doyun',
    title: { ko: '같이 수업 듣자고 제안하기', en: 'Suggest taking a class together' },
    goal: '부담스럽지 않게 제안하고 상대 반응에 맞춰 대응하기',
    difficulty: 'medium',
    estimatedMinutes: 4,
    recommended: false,
    inProgress: true,
    requiresLogin: false,
  },
  {
    id: 'ask-contact',
    personaId: 'doyun',
    title: { ko: '연락처 물어보기', en: 'Ask for a contact' },
    goal: '거절 가능성을 염두에 두고 예의 있게 마무리하기',
    difficulty: 'hard',
    estimatedMinutes: 5,
    recommended: false,
    inProgress: false,
    requiresLogin: true,
  },
  {
    id: 'greet-senior',
    personaId: 'jihoon',
    title: { ko: '선배에게 첫인사하기', en: 'Greet a senior' },
    goal: '존댓말로 부담 없이 인사하고 자기소개 이어가기',
    difficulty: 'easy',
    estimatedMinutes: 3,
    recommended: true,
    inProgress: false,
    requiresLogin: false,
  },
  {
    id: 'ask-favor',
    personaId: 'jihoon',
    title: { ko: '과제 도움 요청하기', en: 'Ask for help with coursework' },
    goal: '무리한 부탁이 되지 않게 상황을 설명하고 요청하기',
    difficulty: 'medium',
    estimatedMinutes: 4,
    recommended: false,
    inProgress: false,
    requiresLogin: false,
  },
]

export const HOME_SUMMARY: HomeSummary = {
  greeting: '안녕하세요!',
  greetingSub: '로그인하고 학습기록을 안전하게 저장하세요.',
  streak: {
    label: '이번 주 연속 연습',
    days: 3,
    weeklyGoal: 7,
    statusLabel: '진행 중',
  },
  pick: {
    scenarioId: 'ask-directions',
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

/** Opening exchange for a fresh simulation (P09). */
export const SIMULATION_OPENING: ChatMessage[] = [
  {
    id: 'm1',
    role: 'persona',
    text: '어? 혹시 길 찾고 있어요?',
    hint: 'Oh, are you looking for something?',
  },
]

/** Mid-session state used by P09.1 "continue interview". */
export const SIMULATION_CONTINUED: ChatMessage[] = [
  {
    id: 'm1',
    role: 'persona',
    text: '어? 혹시 길 찾고 있어요?',
    hint: 'Oh, are you looking for something?',
  },
  { id: 'm2', role: 'user', text: '네, 도서관이 어디인지 아세요?' },
  {
    id: 'm3',
    role: 'persona',
    text: '아 도서관이요? 저기 저 건물 지나서 오른쪽이에요.',
    hint: 'The library? Past that building, then on your right.',
  },
  { id: 'm4', role: 'user', text: '아 감사합니다! 혹시 걸어서 얼마나 걸려요?' },
  {
    id: 'm5',
    role: 'persona',
    text: '한 5분? 금방이에요. 저도 그쪽으로 가는데 같이 갈래요?',
    hint: 'About five minutes. I am headed that way too — want to walk together?',
  },
]

/** Waveform heights from the 30 bars the design draws (normalised 0-1). */
const WAVEFORM = [
  0.25, 0.44, 0.63, 0.38, 0.81, 0.56, 0.31, 0.69, 0.94, 0.5, 0.75, 0.38, 0.25, 0.63,
  0.88, 0.56, 0.31, 0.75, 1, 0.5, 0.81, 0.38, 0.56, 0.94, 0.63, 0.31, 0.69, 0.5, 0.88,
  0.38,
]

export const ANSWER_FEEDBACK: AnswerFeedback = {
  meta: '마이크 입력 · 4.7초 · 분석 완료',
  durationSeconds: 4.7,
  score: 8.8,
  scoreOutOf: 10,
  scoreLabel: '또렷해요',
  secondaryMetrics: '표현 9.2  ·  상황 9.0',
  waveform: WAVEFORM,
  errorRanges: [
    { from: 1.2, to: 1.8 },
    { from: 3.3, to: 4.3 },
  ],
  issues: [
    {
      timestamp: '00:01.2–00:01.8',
      word: '‘건물로’',
      guidance: '‘물로’의 ㄹ 연결이 빨라 뭉쳐 들려요.',
    },
    {
      timestamp: '00:03.3–00:04.3',
      word: '‘감사합니다’',
      guidance: '끝 음절이 빨라요. 호흡을 두고 마무리해요.',
    },
  ],
  expression: '첫 마디에 ‘혹시’를 넣으면 더 부드러워요.',
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'terms',
    tab: '이용약관',
    effectiveDate: '시행일 2026.07.01',
    version: 'v1.2',
    sections: [
      {
        heading: '제1조 (목적)',
        body: '이 약관은 K-Manner Speech(이하 "서비스")가 제공하는 화용 학습 서비스의 이용 조건 및 절차, 회사와 회원의 권리·의무·책임 사항을 규정함을 목적으로 합니다.',
      },
      {
        heading: '제2조 (정의)',
        body: '"회원"이란 본 약관에 동의하고 서비스와 이용계약을 체결한 자를 말하며, "콘텐츠"란 서비스가 제공하는 페르소나·시나리오·피드백 등 일체의 자료를 의미합니다.',
      },
      {
        heading: '제3조 (약관의 효력 및 변경)',
        body: '본 약관은 서비스 화면에 게시하거나 기타 방법으로 회원에게 공지함으로써 효력이 발생합니다. 회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있습니다.',
      },
      {
        heading: '제4조 (서비스의 제공)',
        body: '회사는 페르소나 대화 연습, 억양·화용 적절성 피드백, 학습 기록 관리 기능을 제공합니다. 서비스의 구체적인 내용은 회사의 정책에 따라 변경될 수 있습니다.',
      },
    ],
  },
  {
    id: 'privacy',
    tab: '개인정보처리방침',
    effectiveDate: '시행일 2026.07.01',
    version: 'v1.2',
    sections: [
      {
        heading: '1. 수집하는 개인정보 항목',
        body: '회사는 회원가입 시 이메일, 이름을 수집하며, 서비스 이용 과정에서 연습 기록·음성 데이터·기기 정보가 자동으로 생성되어 수집될 수 있습니다.',
      },
      {
        heading: '2. 개인정보의 이용 목적',
        body: '수집한 정보는 학습 기록 저장, 화용 적절성 피드백 제공, 맞춤 시나리오 추천, 서비스 개선 및 통계 분석을 위해 이용됩니다.',
      },
      {
        heading: '3. 보유 및 이용 기간',
        body: '회원 탈퇴 시 지체 없이 파기하며, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 분리 보관합니다.',
      },
      {
        heading: '4. 이용자의 권리',
        body: '회원은 언제든지 개인정보 열람·정정·삭제·처리정지를 요청할 수 있으며, 설정 화면에서 직접 데이터를 삭제할 수 있습니다.',
      },
    ],
  },
]

/** P10 / P10.1 · 연습 결과 (the hidden-but-finished result frames). */
export const PRACTICE_RESULTS: PracticeResult[] = [
  {
    scenarioId: 'ask-directions',
    score: 82,
    scoreOutOf: 100,
    scoreCaption: '적합성 · 100',
    verdict: '자연스러워요 · Natural',
    comment:
      '존댓말과 부탁 표현이 자연스러웠어요. 첫 마디에 쿠션어(\u2018혹시\u2019)를 넣으면 훨씬 부드러워집니다.',
    tryInstead: '\u201C실례합니다, 혹시 공대 건물이 어디예요?\u201D',
    meta: ['캠퍼스 길 묻기', '도윤', '3분 12초'],
    nextScenarioId: 'study-together',
  },
  {
    scenarioId: 'interview',
    score: 88,
    scoreOutOf: 100,
    scoreCaption: '적합성 · 100',
    verdict: '자연스러워요 · Natural',
    comment:
      '경험과 강점의 연결이 분명했어요. 첫 문장에 핵심 성과를 넣으면 더 설득력 있습니다.',
    tryInstead:
      '\u201C저는 사용자 문제를 구조화하고 끝까지 해결하는 실행력이 강점입니다.\u201D',
    meta: ['면접 자기소개', '이사님', '4분 08초'],
    nextScenarioId: null,
  },
]
