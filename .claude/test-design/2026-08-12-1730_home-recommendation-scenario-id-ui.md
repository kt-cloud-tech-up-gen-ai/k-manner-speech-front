# 홈 추천 시나리오 ID 정합성 테스트 명세

## 수용 기준

- AC1: 홈 추천 카드가 백엔드 카탈로그의 길 묻기 시나리오 ID `campus_directions`를 사용한다.
- AC2: 시뮬레이션 초기화·로딩·오류 처리 코드는 이번 변경에 포함하지 않는다.

## TC-01 — 추천 시나리오 ID 계약

- **What:** 홈 추천 데이터의 `scenarioId`가 백엔드 카탈로그의 `campus_directions`와 일치한다.
- **Who:** 홈에서 추천 연습을 시작하거나 이어서 하는 학습자.
- **Why:** 존재하지 않는 `ask-directions`를 사용하면 시나리오 조회가 404가 되어 빈 시뮬레이션 화면에 머문다.
- **Type:** unit
- **Roles:** QA / Functional, Domain / PO
- **GWT:** Given 홈 정적 추천 데이터가 있을 때, When 추천 시나리오 ID를 읽으면, Then 값은 정확히 `campus_directions`이다.
- **Negative:** 값이 기존 `ask-directions`이거나 다른 카탈로그 ID이면 테스트가 실패해야 한다.

## 역할별 리뷰

### QA / Functional

- 단일 정적 계약 변경이며 positive와 기존 잘못된 ID에 대한 negative가 함께 정의됐다.
- **결과: 통과**

### Domain / PO

- 현재 카드의 “캠퍼스에서 길 물어보기”, 도윤, 처음 만난 사이와 `campus_directions`의 의미가 일치한다.
- **결과: 통과**

### Accessibility

- 인터랙션 구조와 접근 가능한 이름을 변경하지 않으므로 별도 a11y 케이스는 적용하지 않는다.
- **결과: 통과(비적용)**

### Security

- 인증·인가 및 입력 경계 변경이 없다.
- **결과: 통과(비적용)**

### Performance

- 데이터 상수 한 개 교체로 성능 경로 변경이 없다.
- **결과: 통과(비적용)**
