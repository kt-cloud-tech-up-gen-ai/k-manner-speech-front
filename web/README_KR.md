# K-Manner Speech — 웹

이 앱은 형제 디렉터리의 FastAPI 서비스와 연결되어 있습니다. 런타임 카탈로그, 방,
대화, 인증, 온보딩/프로필 및 회원 피드백 요청은 실제 API를 사용합니다. 픽스처는
테스트, Storybook 및 명시적으로 구현이 연기된 결과 화면에서만 사용합니다.

```bash
npm install
npm run dev          # 앱          — http://localhost:5173
npm run storybook    # 컴포넌트    — http://localhost:6006
npm run build
npm run lint
npm test             # Vitest + Testing Library
npm run api:generate # FastAPI OpenAPI 문서에서 TypeScript 생성
npm run api:check    # 체크인된 생성 계약이 오래되었으면 실패
```

`VITE_API_URL=http://localhost:8000`을 내용으로 하는 `web/.env.local`을
만들고, API 마이그레이션과 API 서버를 먼저 실행한 다음 Vite를
`http://localhost:5173`에서 시작하세요. 인증에는 이메일/비밀번호와 서버가 발급한
HttpOnly 액세스/리프레시 쿠키를 사용합니다. 상태를 변경하는 요청에는 이중 제출
CSRF 헤더도 함께 전송합니다.

실제 환경 E2E 테스트는 로컬 기본값(`http://localhost:8000`,
`http://localhost:5173` 및 형제 디렉터리의 `k-manner-speech-api` 체크아웃)을
유지합니다. CI 또는 다른 체크아웃 구조에서는 `E2E_API_URL`, `E2E_WEB_URL` 및
절대 경로인 `E2E_API_ROOT` 환경 변수로 이를 재정의할 수 있습니다. Playwright
서버와 실제 환경 테스트 스펙은 같은 값을 사용합니다.

## 기술 스택

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router v7 · Motion
(Framer) · Zustand.

## 레이아웃 모델

Figma 파일의 모든 프레임 크기는 **360 × 768**입니다. 393 × 852 프레임은
래퍼입니다. P08의 `App` 프레임은 360 × 768 크기의 `Container`를 `#F3F4F6`
페이지 중앙에 배치합니다. 따라서 캔버스 크기는 393이 아니라 360 × 768입니다.

`PhoneShell`은 기기 크롬 UI(44px 반경, 1px `#1E190F @9%` 헤어라인,
두 부분으로 구성된 드롭 섀도, 다이내믹 아일랜드)와 함께 이 캔버스를 렌더링합니다.
420 × 820 미만에서는 크롬 UI가 제거되고 앱이 뷰포트를 채웁니다. 따라서
휴대전화에서는 실제 핸드셋처럼, 데스크톱에서는 Figma 목업처럼 동작합니다.

셸은 상태 표시줄과 탭 표시줄을 담당합니다. 화면은 그 사이의 본문만 렌더링합니다.
y=51 위쪽이나 y=701 아래쪽의 요소는 화면 파일에 포함되지 않습니다.

## 디자인 토큰

`src/index.css`의 `@theme`이 단일 소스입니다. 색상은 Figma에서 정확히
옮겼습니다. 글꼴 크기, 반경 및 선 굵기는 **스케일에 맞춰 보정**했습니다. 프레임에
있는 크기 조정 오차(Inter 11.7 / 15.9 / 20.3, 선 굵기 0.5105 / 1.021 /
1.49934 / 1.6625px)는 의도가 아니라 노이즈이기 때문입니다.

글꼴: 라틴 문자는 Inter, 한국어 대체 글꼴은 Pretendard를 사용합니다(Inter에는
한글이 없으므로 Figma가 실제로 렌더링한 결과를 재현합니다). 상태 표시줄과 숫자에는
Space Grotesk를 사용하고, 디자인에서 지정한 부분(P01 스플래시, P02L 언어 선택,
채팅 말풍선, 피드백 시트)에는 Noto Sans KR을 사용합니다.

## 모션

값은 취향이 아니라 프로토타입 연결 설정에서 가져왔습니다. 파일에 있는 125개
이징은 모두 Figma `EASE_OUT`인 `cubic-bezier(0, 0, 0.58, 1)`입니다. 이는 CSS
`ease-out`과 *다릅니다*. 지속 시간은 디자이너가 지정한 값입니다.

| 전환 | 지속 시간 | 사용 위치 |
|---|---|---|
| PUSH LEFT | 280ms | 앞으로 이동(연결 45개) |
| PUSH RIGHT | 240ms | 뒤로 가기 / 탭 이동(17개) |
| DISSOLVE | 200ms | 선택 변경, 대화상자, 오버레이(29개) |
| SMART_ANIMATE | 250ms | 상태 변형 — 언어 토글, 알림 스위치 |
| SWAP | 220ms | 언어 선택기의 선택 항목 교체 |
| drag snap | 300ms | 시뮬레이션 인물 사진/채팅 크기 조정 |
| MOVE_IN | 320ms | 답변 피드백 오버레이 |
| DISSOLVE | 350ms | 스플래시 → 언어 선택 |

이 값들은 `src/lib/motion.ts`에 있습니다.

한 가지 방식만으로는 충분하지 않으므로 `prefers-reduced-motion`을 두 가지 방식으로
준수합니다. `index.css`의 `@media` 블록은 CSS 전환을 처리하고, `App.tsx`의
`<MotionConfig reducedMotion="user">`는 Motion이 인라인 스타일로 애니메이션하는
모든 항목을 처리합니다. Motion 정책에 따라 변환 및 레이아웃 애니메이션(라우트
밀기, 드래그 스냅, 시차를 둔 상승 효과, 점수 링 진행 효과)은 비활성화하지만,
전정기관 자극 요인이 아닌 불투명도와 색상 효과는 유지합니다.

## 화면

| 라우트 | Figma | 참고 |
|---|---|---|
| `/splash` | P01 | 모바일 전용, 1.8초 후 자동 이동 |
| `/onboarding/language` | P02L.1 / .2 | 자체 팔레트 + Noto Sans KR, Inter 시스템보다 먼저 제작됨 |
| `/onboarding/purpose` | P03 | 다중 선택, 1/3 |
| `/onboarding/pace` | P04 | 단일 선택, 2/3 |
| `/onboarding/notifications` | P05 | 3/3 |
| `/trial` | P02 Tutorial 1–3 | 안내형 워밍업 채팅 |
| `/home` | P06 | |
| `/personas` | P07, P07-1, P07-2 | 검색 영역이 제자리에서 확장됨 |
| `/personas/:id` | P08, P08-1/2/3 | 진행 중인 시나리오에서 P08-3 대화상자가 표시됨 |
| `/simulation/:id` | P09, P09.1/.2, P09A, P09.1A | 드래그로 인물 사진/채팅 분할 영역 크기 조정 가능 |
| `/result/:id` | P10, P10.1 | 아래의 "숨겨진 프레임" 참고 |
| `/login` | P11, P11-1 | |
| `/profile` | P12 | |
| `/settings` | P13, P13A/B/C | 게스트, 알림 꺼짐, 삭제 확인 |
| `/settings/purpose` · `/settings/pace` | P13 Study Purpose, P13-2 | 설정에서 진입하는 P03/P04 선택 화면 |
| `/legal` | P14, P14A | |

### 숨겨진 프레임

**P10(연습 결과 / Result)은 Figma에서 숨겨져 있지만**(`visible: false`) 디자인은
완성되어 있으며, 프로토타입에서도 여전히 이 화면을 거쳐 이동합니다. 해당 화면에는
Jira 하위 작업이 없습니다. `/result/:scenarioId`에 구현되어 있고, 사용자가 말을 한
세션을 종료하면 시뮬레이션 화면에서 이곳으로 이동합니다.

한 가지 해석이 필요했습니다. 점수 주위의 154px 링은 채움이 없는 밴드로 그려져 있어
그대로라면 아무것도 렌더링되지 않습니다. 이를 점수 링으로 해석하고 `score / 100`
비율만큼 선을 그렸습니다.

## 디자인 다시 추출하기

저장소 루트에서 `python3 scripts/figma/sync.py all`을 실행하면 프레임별 명세,
토큰 빈도 보고서, 프로토타입 그래프 및 모든 프레임의 PNG@2x 이미지로 `.figma/`를
갱신합니다. 저장소의 `.env`에 `FIGMA_TOKEN`이 필요합니다. `FIGMA_FILE_KEY`를
사용하면 다른 파일을 선택할 수 있습니다. 생략하면 현재 K speech 파일이 개발
기본값으로 유지됩니다. 루트의 `.env.example`을 참고하세요.

## Storybook

`npm run storybook`으로 실행합니다. 스토리는 공유 프리미티브와 둘 이상의 화면에
나타나는 복합 컴포넌트를 다룹니다. 앱이 읽는 것과 동일한 픽스처를 사용하므로 서로
달라질 수 없습니다.

`.storybook/preview.tsx`는 모든 스토리를 `MemoryRouter`(카드와 탭 표시줄이
내비게이션을 수행함)와 `MotionConfig`(모션 감소 설정이 앱과 동일하게 동작함)로
감싸고, 캔버스 배경의 기본값을 흰색이 아닌 Figma 페이지 색상으로 지정합니다.
`src/stories/decorators.tsx`의 데코레이터는 너비를 360px로 고정하며,
`phoneScreen`은 오버레이가 기준으로 삼는 360x768 크기의 위치 지정 박스를
제공합니다.

a11y 애드온이 활성화되어 있습니다. 현재 이 애드온은 **구현이 아니라 디자인
팔레트에서 비롯된 색상 대비 위반**을 보고합니다. 아래 내용을 참고하세요.

### 알려진 대비 부족 문제(디자인 결정 필요)

보조 텍스트 색상 단계는 Figma에서 정확히 옮겼으며 WCAG AA 기준에 미달합니다.

| 토큰 | 배경 | 명암비 | AA 본문(4.5) | AA 큰 텍스트(3.0) |
|---|---|---|---|---|
| `muted` #A29A89 | #FFFFFF | 2.79:1 | 실패 | 실패 |
| `muted` #A29A89 | #FDFBF7 | 2.70:1 | 실패 | 실패 |
| `muted-2` #8A8272 | #FFFFFF | 3.81:1 | 실패 | 통과 |
| `muted-3` #B4AC9B | #FFFFFF | 2.25:1 | 실패 | 실패 |
| `muted-4` #C3BBAA | #FFFFFF | 1.91:1 | 실패 | 실패 |

`#A29A89`는 앱의 보조 문구 대부분(약 3분, 목표 · …, 영어 자막)에 사용되므로
예외적인 사례가 아닙니다. 나머지는 모두 통과합니다. ink는 16.3:1, 카드 제목은
9.0:1, 기본 CTA는 5.0:1이며 세 가지 난이도 칩은 모두 6.8:1 이상입니다. 색상
단계를 어둡게 만드는 것은 디자인 차원의 결정이므로 변경하지 않고 문제로
보고합니다.

## 파일 위치

```text
src/
  app/          라우터, 라우트 메타데이터, 화면 전환
  components/
    shell/      PhoneShell, StatusBar, TabBar, Stepper, ScreenBody
    ui/         Button, Card, Chip, Toggle, SelectCard, 대화상자, 시트, 아이콘
  features/     화면 그룹별 디렉터리
  api/          타입, 픽스처, 클라이언트 — KAN-19와의 연결 지점
  store/        온보딩 + 계정 상태(localStorage에 영구 저장)
  lib/          모션 토큰, 누름 동작 용어, 클래스 헬퍼
  stories/      Storybook 스토리 + 캔버스 데코레이터
```
