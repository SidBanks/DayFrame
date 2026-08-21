# Task 2.38 Result — Minimal Persistent Accepted-Decision Visibility and Removal

## 1. Executive Result

Completed. The Preview workflow now persistently lists every current PlanDecision as a human-readable accepted choice, derives status only from current fresh replay evidence, and allows explicit one-decision removal through the existing store authority.

## 2. Artifact Integrity

The supplied and saved task artifacts existed, were byte-identical, complete through the required final statement, and shared SHA-256 `0e74ef0ebf9a4ba4ff5f89a1175a540c22368bae2fdbfb9fa5a079e23eeaab12`. Task 2.37 and `CHECKPOINT_Phase_2_Accepted_Planning_Authority.md` were present.

## 3–4. Governing Contract and Initial UI/Store Audit

PlanDecision remains independent durable authority outside `DayFrameState`; replay status remains derived. Existing APIs already provided decision access/subscription, ID-based removal, ingress protection, durability subscription/retry, and stale-on-authority-change behavior. Preview was the narrowest primary surface; it already contained immediate Task 2.36 feedback and responsive workflow patterns.

## 5. Files Changed

- `code/src/ui/acceptedDecisionPresentation.ts`
- `code/src/ui/acceptedDecisionPresentation.test.ts`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/PreviewScreen.tsx`
- `code/src/ui/dayFrameUi.css`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- `code/src/ui/tests/PreviewScreen.test.tsx`
- `code/src/state/planDecisionSurface.test.ts`
- this result artifact

## 6–10. Accepted Choices Surface and Presentation Model

A compact “Accepted choices (N)” section appears in the existing Preview header whenever subscribed PlanDecision authority is nonempty, including when Preview is absent. `DayFrameApp` subscribes independently to `subscribePlanDecisions`; a pure mapper combines those authoritative records with fresh `planDecisionResults`, correlated only by decision ID. No status or view model is persisted.

## 11–14. Preview Status Semantics

- No Preview: “Generate a preview to evaluate this choice.”
- Stale Preview: old replay output is ignored; “Regenerate to evaluate this choice.”
- Fresh Preview: matching ID-correlated replay status is displayed.
- Missing fresh result: “Unable to evaluate”; never assumed applied.

## 15–17. Semantic Summary and Target Labeling

Summaries describe semantic intent and occurrence context without exposing IDs/incarnations/JSON. A current source title is used only when both ID and incarnation match. Otherwise the mapper uses a non-retargeting fallback such as “previous template occurrence.” Daily occurrence date and weekly slot context distinguish repeated instances.

## 18–28. Kind and Status Visibility

| Decision state | Visible? | Status copy | Remove available? |
| --- | ---: | --- | ---: |
| applied | yes | Applied | yes |
| blocked | yes | Blocked — choice could not apply in this schedule | yes |
| staleSourceMissing | yes | Stale — original source no longer present | yes |
| staleLifetime | yes | Stale — no longer matches current source lifetime | yes |
| staleOccurrenceMissing | yes | Stale — occurrence not currently generated | yes |
| outsideWindow | yes | Outside this preview | yes |
| inapplicable | yes | Not currently applicable | yes |
| Preview absent | yes | Generate a preview to evaluate | yes |
| Preview stale | yes | Regenerate to evaluate | yes |

| Kind | Summary format | Schedule marker possible? |
| --- | --- | ---: |
| `placeOccurrence` | Place [title] on [date] at [time] | yes, deferred as optional |
| `omitOccurrence` | Omit [title] | no; panel is authoritative visibility |
| `setOccurrenceDuration` | Use [minutes] minutes for [title] | yes, deferred as optional |
| `setOccurrencePriority` | Use priority [value] for [title] | limited; panel required |

Invalid/unsupported defensive results display “Unable to evaluate.” They remain infrastructure/recovery concerns, not new management semantics.

## 29–30. Contextual Markers and Ordering

Schedule markers were optional and omitted to avoid duplicate UI; the persistent list closes all required visibility cases, including omission. Ordering matches canonical semantic target key then decision ID and does not depend on replay array order.

## 31–36. Remove Action and Orchestration

Each entry exposes a native “Remove” button with contextual accessible name. No confirmation was added: removal affects one choice and fresh Preview regeneration immediately shows the result. Removal calls only `removePlanDecision(decisionId)`; it does not mutate arrays, delete authored sources, create history, or reconstruct decisions. Protected ingress disables buttons and displays recovery-required feedback. Quarantine continues to coexist under existing store semantics.

## 37–43. Regeneration, Persistence, Retry, Restart, and Supersession

| Starting state | Runtime removal | Auto-regenerate? | Durability consequence |
| --- | ---: | ---: | --- |
| fresh Preview | yes | yes | persist remaining/empty collection |
| stale Preview | yes | no | retain unrelated staleness |
| no Preview | yes | no | do not create Preview |
| blocked/stale/outside result with fresh Preview | yes | yes | normal persistence |
| protected ingress | no | no | no write |
| not found | no | no | factual refresh feedback |

Persistence failure leaves the choice removed for the session, regenerates when policy calls for it, warns that restart can restore the older durable decision, and exposes existing retry. Retry persists the exact current empty/remaining collection without recreating IDs or regenerating. Same-target supersession naturally shows only the store’s current replacement record.

## 44. Subscription Model

Decision records, decision durability, and decision ingress use their dedicated subscriptions. Runtime Preview continues through the ordinary state subscription. This preserves `DayFrameState` separation and updates the list even with no Preview.

## 45–50. Cross-Surface Behavior

| Transition | Decision remains? | Visibility after transition | Status after fresh Preview |
| --- | ---: | --- | --- |
| profile load | yes | visible, unevaluated while Preview absent | typically stale lifetime/source |
| Backup V1 import | yes | visible, unevaluated | stale against fresh lifetimes |
| Backup V2 restore | yes | visible, unevaluated | may reactivate when lifetime matches |
| active abandonment | yes unless full clear | visible | derived from replacement authority |
| full clear | no on successful decision removal | section disappears | none |
| decision recovery abandon | removed by existing surface | disappears | none |
| decision recovery replace | current recovered records | visible | derived after Preview generation |

No profile, backup, active, or recovery format/behavior was changed.

## 51–52. Durability and Immediate/Persistent Feedback

Immediate acceptance/removal/retry feedback remains in the Preview status area; the accepted-choice list is persistent authority visibility. They serve different purposes. Feedback is also visible when Preview is absent.

| Operation | Runtime authority | Visible schedule | Durable status | Retry |
| --- | --- | --- | --- | --- |
| successful remove | choice absent | regenerated if fresh Preview existed | durable | unnecessary |
| failed remove write | choice absent this session | regenerated under same policy | storage failure | available |
| successful retry | unchanged choice absence | unchanged | durable | converged |
| failed retry | unchanged choice absence | unchanged | failed/unavailable | remains available when retryable |

## 53–57. Bounded Management and Formatting Decisions

No editing, direct creation, bulk removal, or history was added. `acceptedAt` and provenance are not shown because they add noise without improving current semantic visibility; provenance remains available for future recommendation explanations. Target formatting uses title plus occurrence date/week/slot context and safe stale fallbacks.

## 58–59. Accessibility and Responsive Layout

The section has a meaningful heading, visible summaries/statuses, semantic list markup, native buttons, contextual accessible removal names, disabled protected state, and visible live feedback. Compact entries stack below 640px; no desktop-only table or custom keyboard behavior was introduced.

## 60–68. Tests Added or Updated

Added direct coverage for:

- all four semantic summaries;
- Preview absent/stale/fresh/missing result;
- applied, blocked, three stale states, outside-window, and inapplicable status mapping;
- non-retargeting stale labels;
- persistent omission visibility without Preview;
- protected removal controls;
- Try → Accept → persistent list → Remove integration;
- fresh-Preview regeneration after removal;
- runtime removal after write failure and retrying the absent durable collection.

Existing suites cover supersession, profile/backup lifetime transitions, clear, protected ingress, quarantine, replay correlation, clone isolation, and durability subscribers.

## 69–73. Required Audits

- Reference audit: UI receives decision IDs for correlation/removal only; no ID/incarnation is rendered.
- Remove path audit: every removal reaches store-owned `removePlanDecision`.
- No-history audit: only current store records are subscribed/rendered.
- No-recommendation-change audit: friction/SuggestedFix code is untouched.
- Persistence writer audit: no key, envelope, schema, writer, or replay status persistence changed.

## 74. Architectural Alignment Assessment

Aligned with durable user authority, authored/derived separation, lifetime safety, deterministic status correlation, non-destructive failure semantics, explicit reversibility, and minimal management scope.

## 75. Deviations

None. Optional per-block contextual markers and accepted timestamp/provenance display were intentionally omitted as unnecessary for completion.

## 76–77. Discoveries, Deferred Work, and Next Task

Decision-aware recommendations, optional schedule markers, broader management/history, and Backup V3 remain deferred. Recommended next task: **Task 2.39 — Implement Decision-Aware SuggestedFix Classification, Ranking, and Supersession Messaging.**

## 78–79. Focused and Full Validation

- Focused: 4 files / 143 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 37 files / 589 tests passed.
- `npm run build`: passed; 54 modules transformed.
- `git diff --check`: passed.

## 80. Final Completion Determination

Complete. Every current PlanDecision is persistently discoverable and individually withdrawable through the existing authority boundary with truthful fresh/stale/absent status, regeneration, protection, durability failure, retry, and restart semantics, without new management, recommendation, replay, or durable-format behavior.
