# Test Review Roles

## QA / Functional
- focus: rendering, interaction, and error paths
- owns_test_types: unit, integration, e2e
- review_checklist: positive/negative paths and precise failures

## Security
- focus: browser permissions and untrusted payload boundaries
- owns_test_types: security, integration
- review_checklist: microphone data is sent only after permission and explicit action

## Domain / PO
- focus: product behavior and feedback accuracy
- owns_test_types: unit, integration, e2e
- review_checklist: voice-only insights never appear for typed input

## Accessibility
- focus: semantic labels, keyboard controls, and non-color communication
- owns_test_types: a11y, e2e
- review_checklist: headings, percentages, and labelled controls are exposed

## Performance
- focus: bounded recording and payload lifetime
- owns_test_types: performance, integration
- review_checklist: media tracks stop and object data is released after one turn
