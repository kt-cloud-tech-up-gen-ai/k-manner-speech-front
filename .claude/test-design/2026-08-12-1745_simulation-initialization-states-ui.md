# 시뮬레이션 초기화 상태 UI 테스트 명세

## 수용 기준

- AC1: 세션 초기화 중에는 빈 배경 대신 진행 상태를 표시한다.
- AC2: 초기화 요청 실패 또는 빈 응답 시 사용자가 이해할 수 있는 오류를 `alert`로 표시한다.
- AC3: 사용자는 오류 화면에서 다시 시도하거나 시나리오 목록으로 이동할 수 있다.
- AC4: 재시도 성공 시 정상 시뮬레이션 UI로 전환한다.
- AC5: React StrictMode에서도 최초 초기화 요청은 한 번만 발생한다.

## TC-01 — 로딩 상태

- **What:** 해결되지 않은 초기화 요청 동안 진행 상태가 표시된다.
- **Who:** 느린 네트워크에서 연습을 시작하는 학습자.
- **Why:** 빈 화면은 앱 정지와 정상 대기를 구분할 수 없게 한다.
- **Type:** a11y
- **Roles:** QA / Functional, Accessibility
- **GWT:** Given `getSimulation`이 pending일 때, When 화면을 렌더링하면, Then `status` 역할로 “연습을 준비하고 있어요”가 표시된다.
- **Negative:** pending 상태에서 아무 콘텐츠도 없거나 오류 alert가 표시되면 실패한다.

## TC-02 — 요청 실패 안내

- **What:** 초기화 reject의 사용자 메시지와 복구 버튼을 표시한다.
- **Who:** 네트워크 또는 서버 오류를 만난 학습자.
- **Why:** 실패가 빈 화면으로 숨겨지면 원인도 복구 방법도 알 수 없다.
- **Type:** integration
- **Roles:** QA / Functional, Domain / PO, Accessibility
- **GWT:** Given 초기화 요청이 Error로 reject될 때, When 요청이 끝나면, Then 오류 메시지가 `alert`로 알려지고 “다시 시도”와 “시나리오 목록” 버튼이 활성화된다.
- **Negative:** 실패 후 입력창이나 영구 로딩 상태가 남으면 실패한다.

## TC-03 — 빈 세션 응답

- **What:** `undefined` 응답을 성공으로 오인하지 않고 일반 오류로 처리한다.
- **Who:** 카탈로그에 페르소나 연결이 없는 시나리오를 연 학습자.
- **Why:** API가 2xx여도 세션이 만들어지지 않으면 기존처럼 빈 화면이 지속된다.
- **Type:** integration
- **Roles:** QA / Functional, Domain / PO, Accessibility
- **GWT:** Given 초기화가 `undefined`를 반환할 때, When 완료되면, Then “연습 정보를 불러올 수 없습니다.” alert를 표시한다.
- **Negative:** `undefined`에서 로딩이 끝나지 않거나 빈 화면이면 실패한다.

## TC-04 — 재시도 성공

- **What:** 첫 실패 후 재시도가 새 요청을 만들고 성공 세션을 렌더링한다.
- **Who:** 일시적인 장애에서 스스로 복구하려는 학습자.
- **Why:** 안내만 있고 복구가 불가능하면 사용자가 전체 흐름을 다시 시작해야 한다.
- **Type:** integration
- **Roles:** QA / Functional, Domain / PO, Accessibility
- **GWT:** Given 첫 요청은 실패하고 두 번째 요청은 정상 세션일 때, When “다시 시도”를 누르면, Then 요청 횟수가 2가 되고 메시지 입력창이 나타난다.
- **Negative:** 재시도 클릭이 요청을 만들지 않거나 중복 요청을 만들면 실패한다.

## TC-05 — StrictMode 중복 방지

- **What:** StrictMode effect 재실행에서도 최초 세션 생성 호출이 한 번이다.
- **Who:** 중복 방 생성으로 기록이 오염될 수 있는 모든 사용자와 운영자.
- **Why:** 초기화는 POST `/rooms`를 포함하므로 중복 호출은 실제 데이터를 중복 생성한다.
- **Type:** integration
- **Roles:** QA / Functional, Security, Performance
- **GWT:** Given React StrictMode에서 정상 세션을 반환할 때, When 화면이 마운트되면, Then `getSimulation`은 한 번만 호출된다.
- **Negative:** 최초 마운트에서 두 번 이상 호출되면 실패한다.

## 역할별 리뷰

### QA / Functional
- pending, reject, undefined, retry-success, StrictMode 경계를 모두 포함한다.
- **결과: 통과**

### Domain / PO
- 빈 화면 제거와 사용자의 두 복구 경로가 AC에 매핑된다.
- **결과: 통과**

### Accessibility
- 로딩은 `status`, 오류는 `alert`, 복구 동작은 접근 가능한 이름의 버튼으로 검증한다.
- **결과: 통과**

### Security
- 사용자 입력이나 비밀값을 표시하지 않으며, 기존 중복 방 방지 계약을 보존한다.
- **결과: 통과**

### Performance
- 재시도 1회당 요청 1회, 최초 StrictMode 요청 1회를 명시한다.
- **결과: 통과**
