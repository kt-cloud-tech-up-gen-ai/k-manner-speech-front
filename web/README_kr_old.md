# K-Manner Speech — web

Figma 파일 **K speech**(`wcovSZfRWLwPfTx82mRRS1`)를 기반으로 제작한
v0.0.1-dev 화면(KAN-17)입니다. 아직 서버는 연동되지 않았습니다. 모든 화면은
`src/api/client.ts`를 통해 데이터를 읽으며, 이 파일은 향후 API 서버(KAN-19)가
반환할 것으로 예상되는 형식의 fixture 데이터를 반환합니다.

```bash
npm install
npm run dev          # 앱         — http://localhost:5173
npm run storybook    # 컴포넌트   — http://localhost:6006
npm run build
npm run lint
```

## 기술 스택

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router v7 · Motion
(Framer) · Zustand.

## 레이아웃 모델

Figma 파일의 모든 프레임은 **360 × 768**입니다. 393 × 852 프레임은 래퍼입니다.
P08의 `App` 프레임은 `#F3F4F6` 페이지 위에 360 × 768 크기의 `Container`를
가운데 정렬합니다. 따라서 캔버스 너비는 393이 아니라 360입니다.

`PhoneShell`은 이 캔버스를 기기 외형과 함께 렌더링합니다. 기기 외형에는 44px
모서리 반경, 1px `#1E190F @9%` 헤어라인, 두 부분으로 구성된 드롭 섀도와
다이내믹 아일랜드가 포함됩니다. 화면이 420 × 820보다 작으면 기기 외형을 제거하고
앱이 뷰포트를 가득 채웁니다. 따라서 휴대폰에서는 실제 모바일 앱처럼 동작하고,
데스크톱에서는 Figma 목업처럼 표시됩니다.

셸은 상태 표시줄과 탭 바를 담당합니다. 화면 컴포넌트는 그 사이의 본문만
렌더링합니다. y=51 위쪽과 y=701 아래쪽의 요소는 화면 파일에 포함하지 않습니다.

## 디자인 토큰

`src/index.css`의 `@theme`이 디자인 토큰의 단일 기준입니다. 색상은 Figma에서
정확히 옮겼습니다. 글꼴 크기, 모서리 반경, 선 너비는 **규격화된 스케일에 맞춰
보정**했습니다. 프레임에 포함된 크기 조절 오차(Inter 11.7 / 15.9 / 20.3,
0.5105 / 1.021 / 1.49934 / 1.6625px 선)는 디자인 의도가 아니라 노이즈로
간주합니다.

글꼴은 라틴 문자에 Inter를 사용하고 한국어 대체 글꼴로 Pretendard를 사용합니다.
Inter에는 한글 글리프가 없으므로 이는 Figma가 실제로 렌더링한 결과를 재현합니다.
상태 표시줄과 숫자에는 Space Grotesk를 사용하며, 디자인에서 명시한 곳(P01
스플래시, P02L 언어 선택, 채팅 말풍선, 피드백 시트)에는 Noto Sans KR을
사용합니다.

## 모션

모션 값은 임의로 정한 것이 아니라 프로토타입 연결 설정에서 가져왔습니다. 파일에
있는 125개의 이징은 모두 Figma `EASE_OUT`, 즉
`cubic-bezier(0, 0, 0.58, 1)`입니다. 이는 CSS의 `ease-out`과는
*다릅니다*. 지속 시간도 디자이너가 지정한 값을 사용합니다.

| 전환 | 지속 시간 | 사용 위치 |
|---|---|---|
| PUSH LEFT | 280ms | 앞으로 이동(연결 45개) |
| PUSH RIGHT | 240ms | 뒤로 이동 / 탭 이동(17개) |
| DISSOLVE | 200ms | 선택 변경, 대화상자, 오버레이(29개) |
| SMART_ANIMATE | 250ms | 상태 변형 — 언어 토글, 알림 스위치 |
| SWAP | 220ms | 언어 선택 항목 교체 |
| drag snap | 300ms | 시뮬레이션 인물 사진/채팅 영역 크기 조절 |
| MOVE_IN | 320ms | 답변 피드백 오버레이 |
| DISSOLVE | 350ms | 스플래시 → 언어 선택 |

이 값들은 `src/lib/motion.ts`에 정의되어 있습니다.

`prefers-reduced-motion`은 한 가지 방법만으로는 충분하지 않으므로 두 가지 방식으로
지원합니다. `index.css`의 `@media` 블록은 CSS 전환을 처리하고, `App.tsx`의
`<MotionConfig reducedMotion="user">`는 Motion이 인라인 스타일로 애니메이션하는
모든 요소를 처리합니다. Motion 정책에 따라 변형 및 레이아웃 애니메이션(라우트
밀어내기, 드래그 스냅, 순차 상승, 점수 링 채우기)은 비활성화하지만, 전정기관을
자극하지 않는 불투명도와 색상 변화는 유지합니다.

## 화면

| 라우트 | Figma | 참고 사항 |
|---|---|---|
| `/splash` | P01 | 모바일 전용, 1.8초 후 자동 이동 |
| `/onboarding/language` | P02L.1 / .2 | 자체 색상표 + Noto Sans KR 사용, Inter 시스템보다 먼저 제작됨 |
| `/onboarding/purpose` | P03 | 다중 선택, 1/3단계 |
| `/onboarding/pace` | P04 | 단일 선택, 2/3단계 |
| `/onboarding/notifications` | P05 | 3/3단계 |
| `/trial` | P02 Tutorial 1–3 | 안내형 워밍업 채팅 |
| `/home` | P06 | |
| `/personas` | P07, P07-1, P07-2 | 검색 영역이 제자리에서 확장됨 |
| `/personas/:id` | P08, P08-1/2/3 | 진행 중인 시나리오에서 P08-3 대화상자 표시 |
| `/simulation/:id` | P09, P09.1/.2, P09A, P09.1A | 드래그로 인물 사진/채팅 분할 영역 크기 조절 가능 |
| `/result/:id` | P10, P10.1 | 아래의 "숨겨진 프레임" 참고 |
| `/login` | P11, P11-1 | |
| `/profile` | P12 | |
| `/settings` | P13, P13A/B/C | 게스트, 알림 꺼짐, 삭제 확인 |
| `/settings/purpose` · `/settings/pace` | P13 Study Purpose, P13-2 | 설정에서 접근하는 P03/P04 선택 화면 |
| `/legal` | P14, P14A | |

### 숨겨진 프레임

**P10(연습 결과 / Result)은 Figma에서 숨김 처리**(`visible: false`)되어 있지만
디자인은 완성되어 있고 프로토타입에서도 여전히 이 화면을 거쳐 이동합니다. 대응하는
Jira 하위 작업은 없습니다. `/result/:scenarioId`에 구현되어 있으며, 사용자가
발화한 세션을 닫으면 시뮬레이션 화면에서 이곳으로 이동합니다.

한 가지 해석이 필요했습니다. 점수 주위의 154px 링은 채움 없는 띠로 그려져 있어
그대로 렌더링하면 아무것도 보이지 않습니다. 따라서 이를 점수 링으로 해석하고
`score / 100` 비율만큼 선을 그립니다.

## 디자인 다시 추출하기

저장소 루트에서 `python3 scripts/figma/sync.py all`을 실행하면 프레임별 명세,
토큰 빈도 보고서, 프로토타입 그래프와 모든 프레임의 PNG@2x 이미지로 `.figma/`를
갱신합니다. 저장소의 `.env` 파일에 `FIGMA_TOKEN`이 필요합니다.

## Storybook

`npm run storybook`으로 실행합니다. 스토리는 공용 기본 컴포넌트와 둘 이상의 화면에
등장하는 복합 컴포넌트를 다룹니다. 앱과 동일한 fixture를 사용하므로 앱 데이터와
스토리 데이터가 서로 달라지지 않습니다.

`.storybook/preview.tsx`는 모든 스토리를 `MemoryRouter`와 `MotionConfig`로
감쌉니다. 카드와 탭 바가 라우팅 기능을 사용하며, 모션 축소 설정도 앱과 동일하게
동작해야 하기 때문입니다. 기본 캔버스 배경은 흰색 대신 Figma 페이지 색상으로
설정됩니다. `src/stories/decorators.tsx`의 데코레이터는 너비를 360px로 고정하고,
`phoneScreen`은 오버레이가 기준으로 삼을 위치 지정된 360 × 768 박스를 제공합니다.

a11y 애드온이 활성화되어 있습니다. 현재 **구현이 아니라 디자인 색상표에서 비롯된
색상 대비 위반**을 보고합니다. 자세한 내용은 아래를 참고하십시오.

### 알려진 색상 대비 문제(디자인 결정 필요)

보조 텍스트 색상 단계는 Figma에서 정확히 옮겼지만 WCAG AA 기준에 미치지
못합니다.

| 토큰 | 배경 | 대비율 | AA 본문(4.5) | AA 큰 글자(3.0) |
|---|---|---|---|---|
| `muted` #A29A89 | #FFFFFF | 2.79:1 | 실패 | 실패 |
| `muted` #A29A89 | #FDFBF7 | 2.70:1 | 실패 | 실패 |
| `muted-2` #8A8272 | #FFFFFF | 3.81:1 | 실패 | 통과 |
| `muted-3` #B4AC9B | #FFFFFF | 2.25:1 | 실패 | 실패 |
| `muted-4` #C3BBAA | #FFFFFF | 1.91:1 | 실패 | 실패 |

`#A29A89`는 앱의 보조 문구 대부분(약 3분, 목표 · …, 영어 자막)에 사용되므로
일부 예외적인 경우에만 발생하는 문제는 아닙니다. 그 밖의 요소는 모두 기준을
통과합니다. 기본 텍스트는 16.3:1, 카드 제목은 9.0:1, 기본 CTA는 5.0:1이며,
세 가지 난이도 칩은 모두 6.8:1 이상입니다. 색상 단계를 어둡게 조정하는 것은
디자인 결정이므로 변경하지 않고 문제만 기록했습니다.

## 파일 위치

```
src/
  app/          라우터, 라우트 메타데이터, 화면 전환
  components/
    shell/      PhoneShell, StatusBar, TabBar, Stepper, ScreenBody
    ui/         Button, Card, Chip, Toggle, SelectCard, 대화상자, 시트, 아이콘
  features/     화면 그룹별 디렉터리
  api/          타입, fixture, 클라이언트 — KAN-19 연동 지점
  store/        온보딩 + 계정 상태(localStorage에 저장)
  lib/          모션 토큰, 누름 동작 정의, 클래스 헬퍼
  stories/      Storybook 스토리 + 캔버스 데코레이터
```
