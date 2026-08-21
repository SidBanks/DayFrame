# Task 2.36 Result — Try → Accept PlanDecision Orchestration and Minimal Acceptance UX

## 1. Executive Result

Completed. DayFrame now retains a single transient acceptance candidate after a successful, supported Preview Try; explicit user acceptance sends that semantic candidate through the existing store-owned `acceptPlanDecision`, automatically regenerates Preview, and reports durability and correlated replay outcomes separately.

## 2. Artifact Integrity

The supplied artifact and saved project copy both existed, were byte-identical, and had SHA-256 `6f1d16952e95864a7c38b94c2691306ad9830121321c60473794bb1a19f94454`. The title, execution rules, required sections, completion criteria, task determination, and final completion statement were present. Tasks 2.34 and 2.35 result artifacts and their implemented store/replay APIs were present.

## 3. Governing Contract

Try remains Preview-only. Accept alone creates PlanDecision V1 authority. The store remains the validation, source-resolution, supersession, identity-allocation, and persistence boundary. Regeneration remains the only way an accepted effect enters the schedule.

## 4. Initial SuggestedFix / Try Audit

Current actions are `moveBlock`, `skipBlock`, `convertToRecovery`, `reduceDuration`, `changePriority`, `changeFixedTime`, `addResource`, and `acceptConflict`. `applySuggestedFixToPreview` clones/revises Preview only, preserves decision replay results, and rejects stale Preview. Both grouped and individual controls call the same occurrence-specific handler. Current IDs locate one affected runtime block; each supported revision exposes exact resulting block semantics and occurrence identity.

## 5. Files Changed

- `code/src/core/decisions/createPlanDecisionAcceptanceCandidate.ts`
- `code/src/core/decisions/createPlanDecisionAcceptanceCandidate.test.ts`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/PreviewScreen.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- `code/src/ui/tests/PreviewScreen.test.tsx`
- this result artifact

## 6. Supported Mapping Matrix

| SuggestedFix action | Try supported? | Accept supported? | PlanDecision kind |
| --- | ---: | ---: | --- |
| `moveBlock` | yes | template occurrence only | `placeOccurrence` |
| `skipBlock` | yes | template occurrence only | `omitOccurrence` |
| `reduceDuration` | yes | template occurrence only | `setOccurrenceDuration` |
| `changePriority` | yes | template occurrence only | `setOccurrencePriority` |

## 7. Unsupported SuggestedFix Actions

`changeFixedTime`, `addResource`, `convertToRecovery`, and `acceptConflict` remain Try/authored-workflow-only and never yield Accept. Work/manual targets also remain Try-only because Task 2.35 classifies those replay families as capability-inapplicable.

## 8–16. Try State, Candidate, Target, Payload, and Provenance

`DayFrameApp` owns one transient `{ candidate }`; it is not part of `DayFrameState` or any durable envelope. The pure mapper locates the original block using the current runtime ID, reads its `OccurrenceIdentity`, constructs DurableOccurrenceReference V1 from active authored lineage, and then discards the runtime ID. It clones the candidate before retaining/calling the store.

- Move records revised `userDayDate` and canonical local `HH:mm`, never a timestamp/end time.
- Skip records canonical `{}`.
- Duration records exact revised minutes, not a delta.
- Priority records exact revised priority.
- Provenance is only `{ source: "suggestedFix", suggestedAction }`; no SuggestedFix/friction IDs or UI copy persist.

## 17–19. Freshness and Candidate Lifetime

Acceptance requires a present, non-stale Preview both in rendered availability and the click handler. Candidate state clears on successful Accept, any different Try, regeneration, stale/null Preview, store replacement/recovery/profile/backup/clear transitions, and decision-ingress transitions. Protected decision ingress prevents candidate availability and reports recovery protection.

| Event | Candidate remains valid? |
| --- | ---: |
| authored edit | no |
| decision mutation | no |
| regeneration | no |
| profile load | no |
| Backup V1 import | no |
| Backup V2 restore | no |
| active recovery/abandonment | no |
| second Try | replaced |

## 20–24. Acceptance, Regeneration, Failure, and Supersession

Accept rechecks freshness, calls `acceptPlanDecision`, clears the candidate on runtime acceptance, and regenerates with current store decisions. Persistence failure does not roll back session authority and does not prevent regeneration. Pre-mutation rejection does not regenerate; stale-target rejection invalidates the candidate. Same-target choices use existing store supersession.

| Store acceptance | Persistence | Replay result | User-facing meaning |
| --- | --- | --- | --- |
| accepted | persisted | applied | accepted/saved and active |
| accepted | failed | applied | session-authoritative; retry saving |
| accepted | either | blocked | accepted, exact effect unavailable |
| accepted | either | outsideWindow | accepted, target outside Preview |
| accepted | either | inapplicable/stale | accepted but cannot currently apply |
| rejected | not attempted | none | no authority change; factual rejection |

## 25–27. Try-Only, Durable Accept, and Restart

Direct integration coverage verifies Try leaves `getPlanDecisions()` empty, while Accept creates the decision and regenerates. Persisted decisions already rehydrate/replay through the Task 2.34–2.35 surface. Pending Try state is React-local and therefore cannot survive restart. A failed durable write remains session-only until existing retry succeeds.

## 28–33. Durability and Replay Feedback

Acceptance feedback separately states save status and replay status, correlated by the newly returned decision ID. Copy distinguishes applied, blocked, inapplicable, stale, outside-window, and missing-result cases. The retry control calls `retryPlanDecisionPersistence`; it neither creates a decision nor regenerates/stales Preview.

## 34–39. Minimal UI and Friction Paths

The contextual Preview header shows “Accept this choice” only after a supported successful Try. Existing SuggestedFix labels remain unchanged for regression compatibility; the surrounding status explicitly describes the Try. Native buttons, disabled stale controls, and `role="status"` provide keyboard and non-color feedback. Grouped and individual rendering use identical occurrence-specific inputs. No multi-target action is accepted.

No Remove/Undo control was added: the existing SuggestedFix path can supersede a same-target choice, and adding management UI was unnecessary for this bounded workflow.

## 40–46. Mapper and Workflow Boundaries

The mapper is pure: no storage, allocation, timestamps, state mutation, or persistence. Runtime IDs only locate current generated evidence. Structural PlanDecision validation and current source/lifetime resolution remain store-owned. Preview regeneration is automatic after runtime acceptance; replay result lookup uses returned `PlanDecisionId`. Durability and replay remain independent feedback dimensions.

## 47–50. Accessibility, Protection, Quarantine, Backup

Native buttons preserve keyboard behavior and responsive existing layouts. Whole-source protected ingress blocks acceptance. Quarantined entries do not block valid acceptance because existing surface semantics preserve quarantine independently. Backup remains V2 and still excludes PlanDecision authority; Backup V3 remains deferred.

## 51–55. Tests and Regressions

Added mapper matrix coverage for all four exact mappings and all four unsupported actions; Preview UI coverage for fresh/stale Accept availability; and App integration coverage proving Try-only versus explicit durable Accept, provenance, and feedback. Existing SuggestedFix, `changeFixedTime`, stale Preview, replay, persistence, grouped friction, decision ingress/quarantine, subscriber, and state separation suites all pass.

Focused validation: 3 files, 132 tests passed.

## 56–60. Required Audits

- Reference audit: retained candidates contain V1 semantic references; runtime block IDs are absent.
- No-auto-accept audit: Try calls only Preview revision; decision count remains unchanged.
- Runtime-ID persistence audit: mapper output and PlanDecision envelope contain no SuggestedFix/friction/runtime block ID.
- Preview freshness audit: UI availability plus handler guard; store independently resolves targets.
- Persistence writer audit: no persistence module/writer/schema changed; only existing PlanDecision surface writes decisions.

## 61. Architectural Alignment Assessment

The workflow is now `fresh Preview → Try revision → transient semantic candidate → explicit Accept → store authority/persistence → stale transition → automatic deterministic regeneration → ID-correlated replay feedback`. `DayFrameState`, SuggestedFix generation, friction detection, replay semantics, and persistence formats remain unchanged.

## 62. Deviations

None. Contextual Remove was optional and intentionally omitted. Exact button labels retain established SuggestedFix text rather than prefixing every label with “Try”; explicit adjacent Try/Accept copy supplies the required progression without breaking established accessibility queries.

## 63. Discoveries and Deferred Work

Decision-aware recommendation suppression, broad decision management, conflict/multi-target decisions, work/manual support, and Backup V3 remain deferred. A missing replay result is handled factually as a workflow implementation failure rather than reported as applied.

## 64. Recommended Next Task

Task 2.37 — Audit End-to-End Accepted Planning Authority and Define Decision-Aware Recommendation Policy.

## 65–66. Focused and Full Validation

- Focused: 3 files / 132 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 36 files / 576 tests passed.
- `npm run build`: passed; 53 modules transformed.
- `git diff --check`: passed.

## 67. Final Completion Determination

Complete. All authorized acceptance orchestration, exact mappings, transient-state/freshness rules, automatic replay, durability retry/feedback, protected-ingress behavior, and minimal accessible UX are implemented without persistence/replay/schema expansion or a decision-management surface.
