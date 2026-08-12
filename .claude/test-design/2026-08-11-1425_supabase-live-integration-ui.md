# Test Design: Supabase live integration — UI/E2E

## Cases

### U1 — real member browser flow
- **What:** the React app completes signup/login, onboarding, catalog, room, conversation, feedback, logout and session restoration through the real FastAPI server.
- **Who:** members.
- **Why:** unit mocks cannot validate cross-origin cookies, CSRF, routing, and OpenAPI adapters together.
- **Type:** e2e
- **Roles:** QA / Functional, Domain / PO, Security
- **GWT:** Given both local servers and live-test opt-in, when a disposable user completes the flow, then each screen advances using real responses and reload restores the session.
- **Negative:** no fetch interception/fixture response is allowed; 401 after logout returns to login.

### U2 — real guest boundary and login cleanup
- **What:** guest UI allows exactly three exchanges and login removes guest history.
- **Who:** guests and members.
- **Why:** an off-by-one or stale cookie leaves the UI inconsistent with persisted state.
- **Type:** e2e
- **Roles:** QA / Functional, Domain / PO, Security
- **GWT:** Given a new browser context, when three guest exchanges finish and login follows, then completed state is shown and prior guest history is unavailable.
- **Negative:** fourth send and guest feedback are unavailable and unrelated rows remain.

### U3 — accessible error recovery
- **What:** Auth/API errors are announced and actionable with keyboard controls.
- **Who:** keyboard and screen-reader users.
- **Why:** live upstream failures otherwise strand users without perceivable feedback.
- **Type:** a11y
- **Roles:** Accessibility, QA / Functional
- **GWT:** Given a rejected login or network error, when it is rendered, then an accessible alert appears and focusable retry/login controls remain keyboard-operable.
- **Negative:** silent error, inaccessible status, or disabled recovery must fail.

### U4 — exact cleanup
- **What:** E2E teardown removes only its generated Auth user and database rows.
- **Who:** teammates sharing Supabase.
- **Why:** broad cleanup can destroy shared development data.
- **Type:** security
- **Roles:** Security, QA / Functional
- **GWT:** Given generated IDs tagged to the run, when teardown executes, then only those IDs are deleted even after a test failure.
- **Negative:** DROP, TRUNCATE, or unfiltered DELETE is forbidden.

## Role review

- **QA / Functional:** member, guest, reload, errors and teardown covered — PASS.
- **Security:** real cookie/CSRF, no mocks, exact cleanup covered — PASS.
- **Domain / PO:** complete user journeys map to plan T9 — PASS.
- **Accessibility:** alert and keyboard recovery covered — PASS.
- **Performance:** no SLA; no invented budget — PASS.
