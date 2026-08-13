# Voice Emotion Feedback UI Test Design

| ID | What | Who | Why | Type | Roles | GWT | Negative |
| --- | --- | --- | --- | --- | --- | --- | --- |
| VEU-01 | Voice feedback renders score, emotion bars, listener impressions, and expression feedback | Voice learner | The redesigned sheet must show actionable vocal insight | e2e | QA / Functional, Domain / PO, Accessibility | Given voice feedback, when opened, then labelled percentages and impression chips are visible | Obsolete error timeline and segment feedback must not render |
| VEU-02 | Text feedback renders expression coaching without acoustic claims | Text learner | Typed text has no vocal evidence | e2e | Domain / PO, Accessibility | Given text feedback, when opened, then expression feedback is visible and voice-only sections are absent | Fake emotion percentages or impressions must not render |
| VEU-03 | Microphone interaction records audio alongside Web Speech STT and sends both once | Voice learner, API consumer | Gemini cannot analyze tone from transcript alone | integration | QA / Functional, Security, Performance | Given microphone permission and final STT, when the recording stops, then transcript, base64 audio, MIME, and duration are sent once | Permission/recording failure must not send a transcript-only voice request |

## Role review

- QA / Functional: VEU-01 and VEU-03 pin rendering and one-request interaction behavior.
- Security: VEU-03 requires explicit microphone action and no silent fallback that misrepresents analysis.
- Domain / PO: VEU-01 and VEU-02 enforce the voice/text distinction.
- Accessibility: VEU-01 and VEU-02 expose labels and numeric values independently of color.
- Performance: VEU-03 bounds recording to one utterance and requires media-track cleanup.
