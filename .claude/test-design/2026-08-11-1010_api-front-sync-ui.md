# Test-case specification: API/front sync — UI

Source: `2026-08-11-0959_api-front-sync.md` T7–T14.

## Cases

### UI-01 OpenAPI generation drift
- **What:** `openapi-typescript` output is reproducible and checked.
- **Who:** frontend developer and API consumer.
- **Why:** stale hand-written types hide contract breaks.
- **Type:** integration.
- **Roles:** QA / Functional.
- **GWT:** Given API OpenAPI, When generate/check scripts run, Then generated declarations are stable and current.
- **Negative:** changing the schema without regeneration makes check fail; generated code is not hand-edited.

### UI-02 HTTP cookie/CSRF transport
- **What:** requests include credentials and mutating calls send CSRF.
- **Who:** signed-in and guest learners.
- **Why:** omitted cookie/CSRF silently breaks every real write flow.
- **Type:** integration, security.
- **Roles:** Security, QA / Functional.
- **GWT:** Given CSRF cookie and API base URL, When GET and mutating requests run, Then both include credentials and only mutations include `X-CSRF-Token`.
- **Negative:** network failure and non-JSON error become typed ApiError rather than successful DTOs.

### UI-03 Status-specific error UX
- **What:** 401/404/409/422/429/5xx/network failures produce agreed navigation or retry states.
- **Who:** end user.
- **Why:** raw API failures otherwise strand the user or expose internals.
- **Type:** integration, a11y.
- **Roles:** QA / Functional, Accessibility.
- **GWT:** Given each status, When a screen request fails, Then specified guidance/navigation/retry appears in an alert/status region.
- **Negative:** stack/detail is not rendered and retry cannot duplicate an in-flight request.

### UI-04 Email/password auth and restore
- **What:** signup/login forms use real API, session restores from `/auth/me`, and logout clears UI state.
- **Who:** account holder.
- **Why:** the current fake Google action cannot authenticate to protected APIs.
- **Type:** integration, a11y.
- **Roles:** QA / Functional, Security, Accessibility.
- **GWT:** Given valid credentials, When signup/login succeeds, reload occurs, then logout is clicked, Then authenticated UI restores and finally returns to logged-out state.
- **Negative:** invalid/blank input keeps labelled fields, announces error, and never sets signedIn optimistically.

### UI-05 Onboarding/profile persistence
- **What:** all old/new profile fields save through PUT and restore through GET.
- **Who:** learner.
- **Why:** loss of goals/name/age undermines personalization and trust.
- **Type:** integration, a11y.
- **Roles:** Domain / PO, QA / Functional, Accessibility.
- **GWT:** Given complete language/purpose/free-purpose/pace/notification/name/age input, When onboarding completes and profile reopens, Then identical values render from server data.
- **Negative:** failed save preserves input, blocks completion navigation, and announces retry.

### UI-06 Catalog adapter and screens
- **What:** API persona/scenario DTOs map to current cards without runtime fixture use.
- **Who:** guest and account holder.
- **Why:** contract shape differs from the Figma fixture model.
- **Type:** integration, a11y.
- **Roles:** QA / Functional, Domain / PO, Accessibility.
- **GWT:** Given API list/detail payloads, When catalog routes open, Then cards, relationships, links, loading and empty states render with accessible names.
- **Negative:** 404 navigates back with guidance and items are not fabricated from fixtures.

### UI-07 Room and REST conversation
- **What:** new/continue room paths and messages use actual room IDs and server ordering.
- **Who:** practicing learner.
- **Why:** local echo can diverge from persisted state and duplicate turns.
- **Type:** integration, a11y.
- **Roles:** QA / Functional, Domain / PO, Accessibility.
- **GWT:** Given a selected scenario, When new/continue and text send run, Then actual room/messages load and replies render in server order with sending status.
- **Negative:** double submit is blocked, failed send adds no fake success, and draft remains recoverable.

### UI-08 Guest completion and member feedback
- **What:** guest input stops after third reply while member feedback uses the API.
- **Who:** guest/member learner and product owner.
- **Why:** UI must reflect backend authorization and turn limits.
- **Type:** integration, a11y.
- **Roles:** Domain / PO, QA / Functional, Accessibility, Security.
- **GWT:** Given guest completion, When the third reply renders, Then composer disables and completion is announced; Given a member turn, feedback opens from real response.
- **Negative:** guest UI never calls feedback and cannot append a fourth local message.

### UI-09 Runtime fixture boundary and result exception
- **What:** production client avoids fixtures except the explicitly retained result path; tests/Storybook still use them.
- **Who:** developer and end user.
- **Why:** fixture fallback can make integration appear successful while serving fake data.
- **Type:** unit, integration.
- **Roles:** QA / Functional, Domain / PO.
- **GWT:** Given a production graph, When scanned, Then catalog/auth/profile/rooms/messages/feedback have no fixture dependency and result is the only documented exception.
- **Negative:** a fixture import in a real adapter fails the boundary test.

### UI-10 Full local E2E and safe cleanup
- **What:** member and guest journeys cross browser→API→DB with real cookies.
- **Who:** release reviewer.
- **Why:** mocks cannot prove CORS, cookie, CSRF, or generated-contract wiring.
- **Type:** e2e, security.
- **Roles:** QA / Functional, Security, Domain / PO, Accessibility.
- **GWT:** Given isolated local services, When member signup→onboarding→practice→feedback→logout and guest three-turn→login run, Then visible states succeed and only generated data is cleaned.
- **Negative:** cleanup never issues DROP/TRUNCATE and artifacts contain no secrets.

## Role review

- **QA / Functional:** generation, transport, affected screens, error paths, member/guest integration, and fixture exception are covered. PASS.
- **Security:** credential cookies, CSRF, no optimistic auth, guest feedback exclusion, and secret-safe E2E are covered. PASS.
- **Domain / PO:** T7–T14 including three turns and result fixture exception are represented. PASS.
- **Accessibility:** labelled auth, alert/status announcements, loading/empty states, disabled completion composer, and keyboard retry are covered. PASS.
- **Performance:** no SLA per user; no arbitrary threshold added. In-flight de-duplication covers unbounded duplicate requests. PASS.
