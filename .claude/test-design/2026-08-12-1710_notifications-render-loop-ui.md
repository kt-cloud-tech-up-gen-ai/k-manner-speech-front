# Notifications 화면 렌더링 회귀 테스트 명세

## 범위와 수용 기준

- AC1: `/onboarding/notifications` 화면이 Zustand 5와 React 19 환경에서 무한 재렌더링 없이 표시된다.
- AC2: 비로그인 사용자는 두 CTA를 사용할 수 있고, 선택에 맞춰 온보딩을 완료한 뒤 홈으로 이동한다.
- AC3: 버튼은 의미 있는 접근 가능한 이름을 유지한다.

## 테스트 케이스

### TC-01 — 최초 렌더링 안정성

- **What:** NotificationsScreen이 스토어의 온보딩 값을 읽으면서 한 번의 사용자 관찰 가능한 화면을 정상 렌더링한다.
- **Who:** 온보딩 마지막 단계에 도달한 최종 사용자.
- **Why:** selector가 매번 새 객체를 반환하면 React가 최대 업데이트 깊이 오류로 화면 전체를 비운다.
- **Type:** integration
- **Roles:** QA / Functional, Domain / PO
- **GWT:** Given 기본 Zustand 상태와 MemoryRouter가 있고, When NotificationsScreen을 렌더링하면, Then 제목과 두 CTA가 보이고 최대 업데이트 깊이 오류가 발생하지 않는다.
- **Negative:** 현재처럼 캐시되지 않는 객체 selector를 사용하면 테스트는 `Maximum update depth exceeded`로 실패해야 한다.

### TC-02 — 비로그인 알림 허용 완료

- **What:** 알림 허용 버튼이 로컬 상태를 갱신하고 홈으로 이동한다.
- **Who:** 계정 없이 온보딩하는 사용자.
- **Why:** 화면이 보여도 마지막 단계에서 나갈 수 없으면 온보딩을 완료할 수 없다.
- **Type:** integration
- **Roles:** QA / Functional, Domain / PO
- **GWT:** Given signedIn이 false이고 화면이 렌더링됐을 때, When `알림 켜기 · Allow notifications`를 누르면, Then notificationsAllowed와 onboardingComplete가 true가 되고 `/home` 화면으로 이동한다.
- **Negative:** 비로그인 경로에서는 서버 저장 요청을 호출하지 않아야 한다.

### TC-03 — CTA 접근성

- **What:** 알림 허용 및 나중에 버튼이 native button 역할과 접근 가능한 이름을 제공한다.
- **Who:** 키보드 및 스크린리더 사용자.
- **Why:** 시각적으로 표시되더라도 이름 없는 컨트롤은 보조기술로 마지막 단계를 완료할 수 없다.
- **Type:** a11y
- **Roles:** Accessibility
- **GWT:** Given 화면이 정상 렌더링됐을 때, When role과 이름으로 CTA를 조회하면, Then 두 버튼 모두 활성화된 button으로 발견된다.
- **Negative:** 텍스트 또는 button 역할이 제거되면 조회가 실패해야 한다.

## 역할별 리뷰

### QA / Functional

- TC-01이 실제 장애인 렌더 루프를 고정하고 TC-02가 핵심 진행 경로와 서버 비호출 negative를 포함한다.
- 이번 수정은 선택 UI가 없는 최종 단계의 selector 안정화이므로 별도 수치 경계는 해당하지 않는다.
- **결과: 통과**

### Domain / PO

- AC1은 TC-01, AC2는 TC-02에 매핑되며 실제 온보딩 사용자를 명시한다.
- **결과: 통과**

### Accessibility

- TC-03이 역할과 accessible name을 검증한다. 화면 내 별도 폼 입력이나 포커스 이동 UI는 없다.
- **결과: 통과**

### Security

- 인증·입력 경계 변경이 없고 비로그인 시 API 미호출은 TC-02에서 보호한다. 별도 보안 케이스 불필요.
- **결과: 통과(비적용 사유 확인)**

### Performance

- TC-01이 무제한 렌더 증가를 기능적 실패로 직접 검증한다. 별도 SLA는 정의하지 않는다.
- **결과: 통과**
