# Test Review Roles

각 테스트 케이스는 아래 역할 중 하나 이상에 태그한다.

## QA / Functional
- focus: happy path, 경계값, 오류 경로의 기능 정확성
- owns_test_types: unit, integration, e2e
- review_checklist:
  - 모든 공개 동작에 positive/negative case가 있다
  - 0, empty, max, off-by-one 경계를 다룬다
  - 구체적인 실패 계약을 검증한다

## Security
- focus: 인증·인가, 입력 검증, 데이터/비밀값 노출
- owns_test_types: security, integration
- review_checklist:
  - 비인가와 권한 상승 시도를 검증한다
  - 신뢰할 수 없는 입력을 경계에서 검증한다
  - 응답·로그에 secret/PII가 새지 않는다

## Domain / PO
- focus: 비즈니스 규칙과 acceptance criteria
- owns_test_types: unit, integration, e2e
- review_checklist:
  - 모든 AC가 적어도 한 case에 매핑된다
  - Who가 실제 stakeholder다
  - 제한, 부분 상태, 종료 조건을 다룬다

## Accessibility
- focus: 키보드, focus, role/name/label, 상태 알림
- owns_test_types: a11y, e2e
- review_checklist:
  - interactive element가 키보드로 동작한다
  - role, accessible name, label을 검증한다
  - 오류와 상태가 프로그램적으로 알려진다

## Performance
- focus: latency, query 수, 무제한 증가 방지
- owns_test_types: performance, integration
- review_checklist:
  - 계획에 SLA가 없으면 별도 성능 예산을 발명하지 않는다
  - hot path의 N+1과 무제한 증가 위험을 검토한다
