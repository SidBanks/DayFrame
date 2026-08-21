# Task 2.35 Result — Implement PlanDecision V1 Applicability Evaluation and Deterministic Schedule Replay

## 1. Executive Result

Implemented pure PlanDecision applicability and deterministic replay in Preview generation. Template decisions now omit, override exact duration/priority, or impose hard exact placement. Every current decision produces one ordered derived outcome. Anchored work/manual decisions are explicitly inapplicable. Decision authority mutations stale existing Preview; persistence-only retry does not.

## 2. Artifact Integrity

The supplied and saved artifacts were byte-identical: 50,826 bytes, 2,303 lines, SHA-256 `f0533345b7ef4013e5fe14e32d5b02a3aab384d6e5cc632b9ddd096d64f91e01`. The exact final statement and required execution/validation sections were present.

## 3. Governing Contract

Tasks 2.32–2.34 remain authoritative: lifetime-safe references, four single-target kinds, one decision per target, stale retention, derived outcomes, independent persistence, authored precedence, and no Accept UI.

## 4. Initial Generation Audit

Production expands work and template candidates, places templates, projects manual events, detects friction, generates fixes, then clips to visible user days. Template candidates are the only movable/ranked occurrence family. Work and manual events are anchored authored commitments. Replay therefore enters after expansion, before placement, with exact placement enforced by a narrow generic hard-constraint input.

## 5. Files Changed

- `code/src/core/decisions/replayPlanDecisions.ts`
- `code/src/core/decisions/replayPlanDecisions.test.ts`
- `code/src/core/engine/generateSchedulePreview.ts`
- `code/src/core/engine/reviseSchedulePreview.ts`
- `code/src/core/blocks/types.ts`
- `code/src/core/blocks/placeBlockCandidates.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/planDecisionSurface.ts`
- affected typed Preview fixtures/tests
- this result artifact

## 6. Generation API Boundary

`GenerateSchedulePreviewInput` accepts optional explicit `readonly PlanDecisionV1[]`; direct callers without decisions retain existing behavior. Core generation does not reach into the store.

## 7. Store Generation Integration

`dayFrameStore.generatePreview()` passes only cloned valid current decisions from the store-owned collection. Quarantine, protected raw data, durability, and desired persistence are excluded.

## 8. Applicability Evaluator

`evaluatePlanDecisionApplicability(value, authoredSetup)` validates defensively, resolves its DurableReference independently of Preview, maps stale outcomes, and applies family/kind capability rules without mutation or persistence.

## 9. Applicability Result Contract

Results: `applicable`, `staleSourceMissing`, `staleLifetime`, `staleOccurrenceMissing`, `inapplicable` with reason, `invalid`, or `unsupported`.

## 10. Replay Result Contract

Results identify decision ID, kind, cloned target, and exactly one of `applied`, `outsideWindow`, stale variants, `inapplicable`, `blocked`, `invalid`, or `unsupported`.

## 11. Preview Result Integration

`GenerateSchedulePreviewResult.planDecisionResults` is required derived metadata. Preview clone/revision/store snapshot boundaries deep-clone it. It is not persisted.

## 12. Outside-Window Semantics

A reference is resolved independently first. If its occurrence/candidate is absent from the expanded generation window or exact requested placement is outside the visible planning window, outcome is `outsideWindow`, never stale.

## 13. Capability Matrix

Template supports all four V1 actions. Work/manual support none because their timing/existence is direct anchored authored authority and they do not participate in template placement/ranking.

## 14. Template Capabilities

Flexible templates support place, omit, duration, and priority. Fixed templates support omit/duration/priority but exact relocation is `inapplicable: immovableTemplate`.

## 15. Work Capabilities

Work is generated from shift/cycle/entry authored authority and treated as hard occupancy. All V1 actions return `inapplicable: unsupportedTargetFamily`; work output remains unchanged.

## 16. Manual-Event Capabilities

Manual events are fixed authored projections. All V1 actions are inapplicable; ordinary manual move updates its authored event and its durable reference continues to resolve.

## 17. Omit Semantics

An applicable template candidate is removed before placement. It does not become unplaced, generate ordinary failure friction, or mutate its template/recurrence. Outcome is `applied`.

## 18. Duration Semantics

The targeted candidate receives exact durable minutes before placement. Gap fit, scheduled end, friction, and display consume the transformed duration. Applied means transformation entered generation even if later unplaced.

## 19. Priority Semantics

The targeted candidate receives exact effective priority before the existing canonical placement sort. No parallel decision queue exists.

## 20. Exact Placement Semantics

An applicable flexible template becomes a per-generation hard fixed candidate at stored user-day/time. It is attempted first, with no ordinary heuristic fallback.

## 21. Placement Coordinate Resolution

Replay converts `userDayDate + startTime` using current local effective boundary convention: clock times before the boundary fall on the following calendar date for that user day.

## 22. Boundary-Change Semantics

The payload remains unchanged; each generation recalculates its concrete instant from current boundary preferences and rechecks feasibility.

## 23. Placement Feasibility

Hard placement requires visible planning bounds, full duration fit, and no overlap with anchored work, anchored manual events, or already accepted hard placement occupancy. Ordinary flexible placement remains otherwise unchanged.

## 24. Blocked Placement

If infeasible, the candidate remains unplaced and the outcome is `blocked: exactPlacementUnavailable`. It is never silently placed elsewhere.

## 25. Pre-Placement Replay

Candidates are indexed by canonical lifetime-safe target key. Omit/duration/priority transform the expanded candidate set before ordinary placement.

## 26. Placement Integration

The generic placer gained ephemeral `hardPlacementCandidateIds` and `additionalOccupiedBlocks`. Hard candidates sort first and uniquely receive collision rejection. PlanDecision/storage types do not enter the placer.

## 27. Runtime-ID Independence

Decisions match generated occurrences by constructed DurableReference target keys. Candidate IDs are used only after semantic matching as ephemeral internal placement handles; all existing ID formats remain unchanged.

## 28. Canonical Target Matching

Generated OccurrenceIdentity plus current authored incarnation graph constructs DurableReference, then Task 2.34's canonical target key indexes the candidate.

## 29. Friction Integration

Existing friction detection runs over replayed scheduled/unplaced output plus work/manual occupancy. Applied duration/priority/placement affects friction normally; omissions do not create failed-placement friction.

## 30. SuggestedFix Interaction

SuggestedFix generation runs unchanged after replay. It may recommend changes around decision-shaped friction; recommendation awareness is deferred. Try remains allowed only on a fresh replayed Preview.

## 31. Replay Outcome Completeness

Every supplied decision receives exactly one result, including stale, unsupported-family, outside-window, and hard-blocked authority.

## 32. Outcome Ordering

Results sort by canonical target key then decision ID, independent of collection order, acceptedAt, and provenance.

## 33. Stale Decision Behavior

Missing source, lifetime mismatch, and occurrence missing map to distinct non-applied outcomes. No target is recreated, retargeted, or deleted.

## 34. Reactivation

Because status is derived, exact lifetime/coordinate restoration can return a stale retained decision to applicable/applied without record mutation.

## 35. Restart Replay

Loaded valid decisions pass through the same deterministic generation API; Active V2 lifetime preservation allows effects to return after restart.

## 36. Profile Activation

Fresh profile lifetimes produce `staleLifetime`; old decisions never apply to similar new occurrences.

## 37. Backup V1 Import

Fresh imported lifetimes likewise produce `staleLifetime`.

## 38. Backup V2 Restore

Exact restored lifetimes may reactivate retained decisions on the next generation. Backup persistence remains unchanged.

## 39. Ordinary Update

If reference and capability remain, the decision replays. If the coordinate disappears, outcome becomes `staleOccurrenceMissing`.

## 40. Manual Move

Manual DurableReference remains resolved after an ordinary move, but V1 planning actions remain capability-inapplicable because manual placement is authored authority.

## 41. Weekly / N-per-Week Stability

Matching reuses canonical OccurrenceIdentity week/slot coordinates and Task 2.32 DurableReferences, preserving window-invariant weekly/N-per-week identity.

## 42. Overnight Work

Work resolution retains local-start-date/lineage stability across overnight rendering. Replay classifies it inapplicable without changing work timing.

## 43. Decision Authority Purity

Evaluation/generation clone/read decisions only. IDs, target, payload, acceptedAt, provenance, collection, durability, quarantine, and desired condition are unchanged.

## 44. Authored Authority Purity

Transforms operate on generated candidate clones. No template, recurrence, shift, cycle, segment, sequence entry, or manual event is mutated.

## 45. Preview Freshness Change

The decision-surface manager invokes a store callback only when valid runtime authority changes. An existing fresh Preview becomes stale and state listeners are notified; no Preview means no state mutation.

## 46. Acceptance Staleness

Acceptance and supersession stale Preview even if decision persistence fails, because session derivation authority changed.

## 47. Removal Staleness

Removing an existing decision stales Preview. Missing-ID removal does not.

## 48. Retry Freshness

Retry changes durability only, so it neither stales nor regenerates Preview.

## 49. Recovery Freshness

Recovery stales Preview only when the valid runtime collection actually changes. Export, recheck, and quarantine-only changes do not alter derivation authority.

## 50. State Subscriber Semantics

Decision subscribers always receive authority changes. State subscribers receive decision operations only when a Preview stale flag changes. Durability subscribers remain independent.

## 51. Preview Regeneration Freshness

Generation consumes current decisions, emits corresponding results, and sets `isStale: false` through the existing store flow.

## 52. Try Preservation

`applySuggestedFixToPreview` remains Preview-only and clones/preserves replay results. It creates/removes no decision. Regeneration restores durable replay effects.

## 53. Replay Result Isolation

Targets/results are structured-cloned across replay, Preview revision, store snapshot, and subscriber boundaries.

## 54. Engine Tests

Direct integration tests cover four template kinds, hard blocked placement, work capability, stale outcome distinctions, and retry freshness.

## 55. Store Integration Tests

Tests accept through the store, observe Preview staleness, regenerate through current authority, and verify applied output/outcomes without persistence coupling.

## 56. Scheduling Determinism

Replay sorts decisions/outputs canonically and uses no randomness, wall clock, acceptedAt, provenance, prior Preview, or storage order. Existing 567-test scheduling suite passes.

## 57. Persistence Independence

Generation performs no decision storage read/write, retry, recovery, ID allocation, or timestamp creation. It consumes explicit cloned runtime authority only.

## 58. No-Replay Persistence Audit

PlanDecision key, envelope, serializer, quarantine, and durability code were unchanged. Replay results appear in no durable writer.

## 59. Reference Audit

PlanDecision imports exist at the engine boundary and dedicated replay helper; low-level recurrence/work generators remain unaware. The store alone supplies valid decisions.

## 60. No-Replay-Bypass Audit

Store Preview generation passes decisions on every regeneration. Direct engine callers explicitly receive empty behavior when decisions are omitted. No previous Preview is an input to durable replay.

## 61. Capability Matrix

| Family | Place | Omit | Duration | Priority |
| --- | --- | --- | --- | --- |
| Flexible template | applicable | applicable | applicable | applicable |
| Fixed template | inapplicable | applicable | applicable | applicable |
| Work | inapplicable | inapplicable | inapplicable | inapplicable |
| Manual event | inapplicable | inapplicable | inapplicable | inapplicable |

## 62. Replay Stage Matrix

| Kind | Stage | Effect |
| --- | --- | --- |
| omitOccurrence | post-expansion/pre-placement | suppress candidate |
| setOccurrenceDuration | post-expansion/pre-placement | exact duration clone |
| setOccurrencePriority | post-expansion/pre-placement | exact ranking value |
| placeOccurrence | placement | hard exact candidate, no fallback |

## 63. Replay Outcome Matrix

| Condition | Outcome |
| --- | --- |
| transform/hard placement incorporated | applied |
| resolved target outside generation | outsideWindow |
| source missing | staleSourceMissing |
| incarnation changed | staleLifetime |
| coordinate no longer produced | staleOccurrenceMissing |
| unsupported family/fixed move | inapplicable |
| feasible kind, impossible exact placement | blocked |
| defensive malformed/future input | invalid/unsupported |

## 64. Freshness Matrix

| Operation | Existing Preview |
| --- | --- |
| accept/supersede | stale |
| remove existing | stale |
| persistence failure after authority change | stale |
| retry only | unchanged |
| quarantine-only mutation | unchanged |
| recovery changing valid collection | stale |
| regenerate | fresh with current results |

## 65. Cross-Surface Matrix

| Transition | Decision record | Replay |
| --- | --- | --- |
| Active V2 restart | retained | restored if target resolves |
| Profile V2 activation | retained | staleLifetime |
| Backup V1 import | retained | staleLifetime |
| Backup V2 restore | retained | reactivated if exact target returns |
| active-only abandonment | retained | stale/inapplicable against reset authority |
| full clear | removed | none |

## 66. Architectural Alignment Assessment

The implementation realizes the accepted precedence `authored authority > applicable PlanDecision > ordinary heuristic > suggestion`, preserves lifetime safety and one-target authority, and adds replay without contaminating persistence or low-level generation.

## 67. Deviations

No scope deviation. Work/manual actions are capability-inapplicable rather than supported because executable behavior establishes them as anchored authored commitments. Direct engine input keeps `planDecisions` optional for backward-compatible callers; generated result metadata is required.

## 68. Discoveries and Deferred Work

- SuggestedFix may recommend actions around decision-shaped friction; decision-aware recommendation policy is deferred.
- Accept/management/stale-result UI remains deferred.
- Conflict decisions, recovery substitution, multi-dimension composition, Backup V3, execution/history, and broader timezone architecture remain deferred.
- Fixed-template duration/priority remain occurrence transforms; exact relocation remains authored Setup territory.

## 69. Recommended Next Task

Add workflow/UI acceptance and decision-management feedback using the existing store APIs and replay outcomes, including explicit fresh-Preview enforcement and durability messaging without changing replay semantics.

## 70. Focused Validation

Focused replay suite passed: 1 file, 8 tests. Focused typecheck and lint passed during implementation.

## 71. Full Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — passed: 35 files, 567 tests.
- `npm run build` — passed: TypeScript and Vite, 52 modules transformed.
- `git diff --check` — passed.

## 72. Final Completion Determination

**Complete.** Preview generation now deterministically consumes current PlanDecision V1 authority, resolves lifetime-safe targets, applies supported template omission/duration/priority/exact-placement semantics at correct stages, emits one explicit ordered result per decision, runs existing friction/suggestions afterward, and stales Preview when runtime decision authority changes. Stale, outside-window, inapplicable, and blocked intent is never silently retargeted or degraded. Decision/authored/persistence authority remains pure, full validation passes, and no Accept UI, persistence change, new kind, Backup V3, or history was introduced.
