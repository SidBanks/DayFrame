# Task 2.39 Result — Decision-Aware SuggestedFix Classification, Ranking, and Supersession Messaging

## 1. Executive Result

Completed. Preview generation now post-classifies ordinary SuggestedFixes against current accepted PlanDecision authority, suppresses exact same-target equivalents, deterministically ranks relationships, and visibly identifies recommendations that would revise an accepted choice. Recommendation awareness remains derived and non-durable.

## 2. Artifact Integrity

The supplied and saved artifacts existed, were byte-identical, complete through the final statement, and shared SHA-256 `c742a927b50c701bdb9851d8412428d2426b9263f80938093606c6c44791ff76`. Tasks 2.37–2.38 results and the accepted-planning-authority checkpoint were present.

## 3–4. Governing Policy and Initial SuggestedFix Audit

Accepted decisions remain user authority; recommendations remain derived proposals. Current actions are move, skip, reduce duration, change priority, fixed-time authored review, add resource, convert to recovery, and accept conflict. Target IDs are encoded in current fix IDs and/or friction affected IDs. Existing generator ordering is explicit array order after action construction/deduplication. Grouped and individual UI paths render the same occurrence-specific SuggestedFix records.

## 5. Files Changed

- `code/src/core/decisions/classifySuggestedFixes.ts`
- `code/src/core/decisions/classifySuggestedFixes.test.ts`
- `code/src/core/engine/generateSchedulePreview.ts`
- `code/src/core/engine/reviseSchedulePreview.ts`
- `code/src/core/friction/types.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/ui/PreviewScreen.tsx`
- `code/src/ui/tests/PreviewScreen.test.tsx`
- this result artifact

## 6–13. Recommendation Context and Relationships

`SuggestedFix` now carries optional transient `decisionContext` with `relationship`, optional decision ID, replay status, and bounded explanation code. The six implemented relationships are ordinary, preserving, unblocking, superseding, equivalent, and unknown. Metadata is part of derived Preview output only.

- Ordinary: no relevant current accepted authority.
- Preserving: a directly related different-target schedule change leaves an applied accepted target unchanged.
- Unblocking: a distinct target in the same friction directly relates to a blocked accepted placement.
- Superseding: same lifetime-safe target with different kind/payload.
- Equivalent: same target, kind, and exact payload; suppressed.
- Unknown: related evidence exists but does not justify a causal claim.

## 14–18. Same Target, Semantic Mapping, Consistency, and Suppression

Same-target detection uses canonical DurableOccurrenceReference target keys, never runtime ID equality. Prospective semantics are produced by applying the existing pure SuggestedFix revision to cloned schedule arrays and passing the exact revised result through Task 2.36’s canonical acceptance mapper. Thus move destination, exact duration, exact priority, and omission semantics match Try → Accept construction. Equivalent fixes are removed before ranking; all cross-kind same-target changes are superseding.

## 19–20. Bounded Unblocking and Causality Limits

Unblocking requires a blocked replay result plus a distinct recommended target explicitly present with the blocked target in the same friction relationship. No temporal-proximity inference or counterfactual scheduling is used. When this evidence is absent, indirect relationships remain unknown. Current blocked-placement generation often yields single-target unplaced friction, so unblocking classification is available only when direct multi-block evidence exists; no causal relationship is invented to increase coverage.

## 21–26. Replay Status Policies

| Replay status | Constrains recommendations? | Relationship policy |
| --- | ---: | --- |
| applied | yes | equivalent suppression; differing same-target supersession; bounded preserving |
| blocked | yes | equivalent suppression; direct unblocking first; supersession remains |
| inapplicable | same-target semantics only | equivalent/superseding; no ordinary rank constraint |
| stale source/lifetime/occurrence | no | output identical to ordinary generation unless exact stale target were explicit |
| outsideWindow | no for current Preview | output identical to ordinary generation |
| invalid/unsupported | no | excluded from current valid authority input |

## 27–34. SuggestedFix Action Matrix

| SuggestedFix action | Same-target equivalent | Same-target different | Different target | Unsupported case |
| --- | --- | --- | --- | --- |
| moveBlock | suppress | superseding | preserving/unblocking/ordinary/unknown | missing lineage/unsupported family stays neutral |
| skipBlock | suppress for omit | superseding | preserving/unblocking/ordinary/unknown | ambiguous/multi-target neutral |
| reduceDuration | suppress exact result | superseding | preserving/unblocking/ordinary/unknown | failed revision neutral |
| changePriority | suppress exact result | superseding | preserving/unblocking/ordinary/unknown | failed revision neutral |
| changeFixedTime | n/a | authored review, not PlanDecision | neutral/unknown | no Accept |
| addResource | n/a | not durable supersession | neutral/unknown | current Try unsupported |
| convertToRecovery | n/a | not acceptable V1 supersession | unknown unless direct safe evidence | Try-only |
| acceptConflict | n/a | never durable supersession | neutral/unknown | no conflict decision |

## 35–38. Pipeline, Friction, and Correlation

Final pipeline:

```text
replay → placement → friction → ordinary fixes
       → pure decision classifier → equivalent suppression → stable ranking
       → derived Preview metadata → Try → explicit Accept
```

Friction schema was not expanded. Runtime block IDs correlate current friction/fixes to blocks only; those blocks are converted to durable references for semantic decision comparison. Decision ID correlates record/replay metadata. Runtime IDs and decision context are never persisted.

## 39–42. Ranking and Determinism

| Relationship | Rank tier | Notes |
| --- | ---: | --- |
| preserving | 1 | first for ordinary decision-shaped friction |
| unblocking | 2, or 1 for directly blocked friction | cautious direct evidence only |
| ordinary / unknown | 3 | unknown receives no speculative copy |
| superseding | 4 | remains useful but explicitly labeled |
| equivalent | suppressed | absent before sort |

Original SuggestedFix index is retained inside each tier. Decision input is canonicalized by target key then ID; acceptedAt, provenance, and storage order do not affect classification/rank. Zero-decision and all-stale/outside-window inputs return cloned fixes in original order without metadata changes.

## 43–47. Messaging

| Relationship | Required user-facing treatment |
| --- | --- |
| ordinary | existing label |
| preserving | existing label; no unnecessary claim |
| unblocking | “May unblock accepted choice: …” |
| superseding | “Revise accepted choice: …” |
| equivalent | suppressed |
| unknown | existing neutral label |

Authored fixed-time review retains its existing Setup language. User copy avoids “override,” internal IDs, replay jargon, and guaranteed unblocking claims.

## 48–53. Try, Accept, Removal, Conflicts, and Tie-Breaks

Try remains Preview-only for every rendered fix. A superseding Try does not mutate the current decision; only explicit Accept invokes existing same-target replacement. Preserving/unblocking fixes create authority only if their action is already supported and explicitly accepted. Removing a decision naturally removes classification context on regeneration. Decision-decision replay tie-breaks are not exposed as preference, and no recommendation automatically removes either decision.

## 54–56. Grouped Friction and Accessibility

Classification occurs per friction occurrence before grouped rendering, so grouped and individual buttons retain their own relationship/correlation. Mixed groups display occurrence-specific labels rather than merging authority claims. Ambiguous multi-target mapping remains neutral and cannot produce superseding Accept. Native buttons expose the full supersession/unblocking message as accessible text.

## 57–62. Freshness and Cross-Surface Semantics

SuggestedFix controls remain disabled on stale Preview and classification uses only generation-time current replay results. Profile activation and Backup V1 create fresh lifetimes, making old decisions stale and non-constraining. Backup V2 can reactivate exact-lifetime awareness. Removal/full clear eliminates context after regeneration. Persistence failure does not change current session classification because runtime decision authority remains factual.

| Transition | Decision relationship after regeneration |
| --- | --- |
| profile load | old lifetime stale; does not constrain |
| Backup V1 | old lifetime stale; does not constrain |
| Backup V2 | reactivates only exact matching lifetime |
| decision removal | no relationship from removed record |
| supersession | new current record governs classification |
| full clear | zero-decision ordinary output |

## 63–65. Regression Results

Zero-decision output and all-stale/outside-window output preserve pre-2.39 recommendation order/content. The Accepted Choices surface continues to derive from PlanDecision/replay authority independently; recommendation metadata neither replaces nor expands it.

## 66–69. Mutation and Contract Audits

- No automatic mutation: classifier is pure and allocates no decision/source identity, performs no replay, Preview revision side effect, persistence, or store mutation.
- No persistence change: no local key/envelope/writer/backup/profile change.
- No PlanDecision schema change and no DurableOccurrenceReference change.
- No replay status/schema/semantics change; classifier runs after replay.
- Preview clone boundaries clone transient decision metadata.

## 70. Tests Added or Updated

Added direct tests for exact placement/omit equivalence, suppression, same- and cross-kind supersession, direct preserving/unblocking, conservative unknown, relationship ranking, stable within-tier ordering, zero-decision behavior, all-stale behavior, and supersession UI copy. Existing tests cover all four Task 2.36 mapper actions, Try/Accept, grouped friction, stale Preview, profile/backup lifetimes, removal, persistence failure, and accepted-choice visibility.

## 71–73. Classification, Ranking, and Messaging Matrices

The required matrices are recorded in Sections 21–34 and 39–47 above.

## 74. Architectural Alignment Assessment

Aligned with accepted user authority, lifetime-safe comparison, conservative causality, deterministic recommendation output, explicit supersession, derived-state separation, and recommendation humility.

## 75. Deviations

None. Direct unblocking is intentionally sparse because the current friction model rarely supplies a distinct blocker for an unplaced hard decision; uncertain cases are classified unknown as required rather than expanding friction or scheduling semantics.

## 76–77. Discoveries, Deferred Work, and Next Task

General counterfactual causality, richer blocker evidence, conflict/multi-target decisions, history, and Backup V3 remain deferred. Recommended next task: **Task 2.40 — Phase 2 Completion Audit and Publication Checkpoint.**

## 78–79. Focused and Full Validation

- Focused: 4 files / 61 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 38 files / 595 tests passed.
- `npm run build`: passed; 55 modules transformed.
- `git diff --check`: passed.

## 80. Final Completion Determination

Complete. Current valid accepted authority now informs derived recommendation classification, exact equivalents are absent, preserving/directly unblocking options rank ahead of clearly labeled reconsideration, uncertain causality remains neutral, and Try → explicit Accept remains the sole authority-changing path without durable or replay expansion.
