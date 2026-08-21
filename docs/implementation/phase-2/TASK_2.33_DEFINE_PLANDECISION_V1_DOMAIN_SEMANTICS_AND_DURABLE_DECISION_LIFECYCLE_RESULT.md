# Task 2.33 Result — Define PlanDecision V1 Domain Semantics and Durable Decision Lifecycle

## 1. Executive Determination

**Ready for implementation.** PlanDecision V1 is defined as independently persisted, explicitly accepted, single-occurrence planning authority. V1 supports exact placement, omission, exact duration, and exact priority. It targets `DurableOccurrenceReference V1`, retains stale decisions until explicit removal/clear, and uses deterministic per-target/per-domain replacement. No persistence, replay, application, UI, or production code was implemented.

## 2. Artifact Integrity

The supplied artifact and saved project copy existed and were byte-identical. Size: 53,388 bytes and 2,419 lines. SHA-256: `84d1e32c202d056451f97f34eac150e6e2ee6459cd861027c80d40db6dd54bca`. Required sections and exact final completion statement were present.

## 3. Governing Evidence

Reviewed Task 2.23, Tasks 2.24–2.31 source-lifetime work, Task 2.32's completed result and implementation, current SuggestedFix generation/application, Preview revision/staleness controls, authored authority, durable versioning, recovery, and durability status architecture.

## 4. Current SuggestedFix Audit

Current actions are `moveBlock`, `skipBlock`, `reduceDuration`, `convertToRecovery`, `changePriority`, `changeFixedTime`, `addResource`, and `acceptConflict`. Current application mutates only a cloned Preview result; no action creates durable authority. Stale Preview actions are blocked.

## 5. Current Preview-Revision Audit

`applySuggestedFixToPreview` requires a current non-stale Preview, delegates to `reviseSchedulePreview`, and stores a derived revised Preview. Regeneration discards the revision. `changeFixedTime` navigates to Setup and makes no Preview mutation. This behavior is the future **Try** path, not acceptance.

## 6. PlanDecision Definition

> A PlanDecision is a durable record of an explicitly accepted, occurrence-scoped planning choice intended to influence future schedule regeneration while its exact lifetime-safe target and semantic preconditions remain applicable.

It is not a Preview, SuggestedFix, Try result, friction point, source edit, execution record, history event, or generic undo record.

## 7. Authority Boundary

SuggestedFix recommends; Try experiments in derived Preview; Accept authors PlanDecision authority. A SuggestedFix never becomes a PlanDecision in place. Acceptance creates a separately identified validated semantic record.

## 8. Try Versus Accept

- **Try:** Preview-only, reversible, not durable, discarded by regeneration.
- **Accept:** constructs/validates a durable reference and semantic outcome, commits decision authority, then regenerates through replay.

## 9. Supported Decision Kinds

V1 stable machine kinds:

- `placeOccurrence`: hard exact user-day-relative placement;
- `omitOccurrence`: hard omission;
- `setOccurrenceDuration`: hard exact duration;
- `setOccurrencePriority`: soft exact effective priority.

## 10. Unsupported SuggestedFix Kinds

- `convertToRecovery`: deferred; source/replacement/completion semantics remain ambiguous.
- `acceptConflict`: deferred; needs a separately defined lifetime-safe multi-occurrence conflict target and material-conflict fingerprint.
- `addResource`: authored-source edit and not currently supported by Preview revision.
- `changeFixedTime`: authored Setup edit.

## 11. `changeFixedTime` Determination

Navigation to Setup is not a PlanDecision. The committed template edit is authored source authority and invalidates/regenerates Preview through existing flows.

## 12. Decision Target

Every V1 decision contains one validated `DurableOccurrenceReference V1`. Runtime block/candidate/friction/fix IDs and array/visual positions are prohibited.

## 13. Single/Multi-Target Decision

V1 is exactly single-target. Multi-occurrence and conflict decisions require a future reference contract and are not approximated with a primary target plus transient context.

## 14. Decision Identity

`PlanDecisionId` is an opaque canonical UUID-v4 identifying one decision-record lifetime. It is distinct from target and kind, graph-wide unique within the decision collection, and allocated only during accepted authoring.

## 15. Version Contract

`PLAN_DECISION_VERSION = 1` is independent of DurableOccurrenceReference, OccurrenceIdentity, Active, Profile, Backup, and decision-surface envelope versions.

## 16. Decision Structure

Implementation-ready conceptual union:

```ts
type PlanDecisionV1 =
  | { version: 1; id: PlanDecisionId; kind: "placeOccurrence";
      target: DurableOccurrenceReference; payload: { userDayDate: LocalDateString; startTime: TimeString };
      acceptedAt: string; provenance: PlanDecisionProvenance }
  | { version: 1; id: PlanDecisionId; kind: "omitOccurrence";
      target: DurableOccurrenceReference; payload: Record<string, never>;
      acceptedAt: string; provenance: PlanDecisionProvenance }
  | { version: 1; id: PlanDecisionId; kind: "setOccurrenceDuration";
      target: DurableOccurrenceReference; payload: { durationMinutes: number };
      acceptedAt: string; provenance: PlanDecisionProvenance }
  | { version: 1; id: PlanDecisionId; kind: "setOccurrencePriority";
      target: DurableOccurrenceReference; payload: { priority: 1 | 2 | 3 | 4 | 5 };
      acceptedAt: string; provenance: PlanDecisionProvenance };

type PlanDecisionProvenance =
  | { source: "user" }
  | { source: "suggestedFix"; suggestedAction: "moveBlock" | "skipBlock" |
      "reduceDuration" | "changePriority" };
```

## 17. Kind-Specific Payloads

Placement stores final semantic date/time; omission has no parameter; duration stores exact accepted minutes rather than “reduce”; priority stores exact accepted value rather than “increase.” No block or SuggestedFix snapshot is retained.

## 18. Placement Semantics

`placeOccurrence` is a hard exact placement constraint. Replay either starts the occurrence at the specified user-day-relative coordinate or reports `blocked`; it never silently chooses another gap.

## 19. User-Day/Boundary Semantics

Placement preserves the accepted `userDayDate + local clock time` intent, not an absolute timestamp. Replay maps it using the target date's current effective day-boundary rules. Boundary/segment preference changes therefore recalculate the instant and trigger feasibility validation; they do not mutate the stored payload.

## 20. Preconditions

Preconditions are derived: target resolves, occurrence supports the kind, exact payload is legal, source remains enabled/produced, and hard placement/duration constraints are feasible. Do not persist derived snapshots except minimal provenance; current authority is recomputed.

## 21. Applicability

Applicable means the target resolves and the semantic action is still valid under current authored constraints. Applicability is stronger than reference resolution and does not imply successful application.

## 22. Reference Outcome Mapping

Every DurableReference outcome maps explicitly; no null/exception or same-ID retargeting is allowed.

## 23. LifetimeMismatch

Derived status `staleLifetime`; replay forbidden; record retained. Exact Backup V2 restoration may reactivate it.

## 24. SourceMissing

Derived status `staleSourceMissing`; replay forbidden; record retained.

## 25. OccurrenceMissing

Derived status `staleOccurrenceMissing`; replay forbidden; retained because a same-lifetime update may make the coordinate resolve again.

## 26. Invalid/Unsupported Reference

Invalid target makes the decision invalid/quarantinable. Unsupported target version makes it protected/unsupported. Neither replays or gets silently deleted.

## 27. Durable Versus Derived Status

Durable facts are ID, version, kind, target, payload, accepted time, and provenance. `applicable`, `applied`, `blocked`, `stale*`, `outsideWindow`, `superseded`, `invalid`, and `unsupported` are derived or transaction outcomes, not mutable status fields in the V1 record.

## 28. Supersession

At most one current decision exists for each semantic conflict key. Accepting a new same-key decision atomically removes/replaces the old record with a new ID. V1 stores current authority, not supersession history or links.

## 29. Conflict Rules

All four kinds share one occurrence-override domain and therefore conflict by target, with one exception: the accepted model deliberately chooses **one current normalized choice per target** for V1 simplicity. A new kind for the same target supersedes the prior one rather than composing. This removes ambiguous cross-kind replay ordering; future composable dimensions require a versioned expansion.

## 30. Ordering

The collection is an unordered keyed set. Replay sorts by canonical semantic target key then decision ID solely for deterministic traversal; ordering never determines authority because only one record exists per target.

## 31. Acceptance Timestamp

`acceptedAt` is required canonical UTC ISO-8601 text for explanation and diagnostics. It is not identity, conflict resolution, or replay order.

## 32. Provenance

Minimal provenance distinguishes direct user authoring from accepted SuggestedFix semantic action. SuggestedFix/friction IDs, labels, messages, and snapshots are excluded.

## 33. Ownership

PlanDecision is store/domain durable planning authority. An authoring service constructs/replaces/removes it; the Plan engine consumes it. UI requests actions but does not own records.

## 34. `DayFrameState` Boundary

PlanDecisions remain outside `DayFrameState`, consistent with their independent authority and durability surface. The store will expose a dedicated accessor/subscription boundary rather than changing existing state subscriber payloads.

## 35. Authored Setup Boundary

PlanDecision is not part of `DayFrameAuthoredSetup` and cannot create, delete, or edit authored recurrence/source configuration.

## 36. Profile Boundary

Profile V2 excludes decisions. Activation creates fresh source lifetimes; retained old decisions become stale and never transfer to the profile's new graph.

## 37. Backup Boundary

Backup V2 remains unchanged and excludes decisions. A future recovery-complete export must evolve to Backup V3 (preferred) or an explicitly governed multi-surface package.

## 38. Persistence Options Analysis

Independent storage preserves authority/version clarity but requires explicit cross-surface recovery policy. Active V3 would couple authored and planning schemas and force authored migrations for decision-only evolution.

## 39. Persistence Ownership Decision

Adopt an independent envelope conceptually shaped as `{ app: "DayFrame", surface: "planDecisions", version: 1, decisions: [...] }`. Recommend future key `dayframe-plan-decisions-v1`. Task 2.33 creates neither envelope code nor key.

## 40. Atomicity

Pure V1 acceptance changes only the decision surface; authored state is unchanged, so no cross-surface authored transaction is required. Runtime authority follows Phase 1 rules if persistence fails. Profile/backup/active replacement and full clear require explicitly sequenced multi-surface policy.

## 41. Acceptance Transaction

Require fresh Preview → identify supported occurrence/action → reconstruct target and final semantic payload from current authority → validate reference/decision → atomically replace same-target decision in runtime collection → attempt decision durability → regenerate/replay → report persistence and replay outcomes.

## 42. Stale Preview Boundary

Acceptance inherits Task 2.5: absent/stale Preview is an expected rejection. Try state cannot be blindly serialized; acceptance reconstructs intent from current authority and accepted final values.

## 43. Replay Definition

Replay applies current valid decisions to deterministic generation. It is not a UI-click replay, Preview mutation, or source edit.

## 44. Replay Stage

- omission, duration, and priority: after occurrence expansion/reference resolution and before ordinary placement;
- exact placement: as a hard placement constraint during placement;
- all resulting blocks then enter ordinary friction detection.

## 45. Replay Determinism

Equivalent authored setup, decision set, and generation inputs must yield equivalent Preview and per-decision results. Prior Preview, storage order, acceptedAt ordering, and SuggestedFix availability are irrelevant.

## 46. Preview Relationship

Future derivation is `authored authority + applicable PlanDecisions + generation inputs = Preview`. Try continues to revise only Preview; Accept commits and regenerates. Deleting/regenerating Preview never removes decisions.

## 47. Move Replay Semantics

Attempt exactly the stored user-day/time. If target is immovable, time invalid, outside permitted range, or hard constraints prevent placement, retain the decision and report `blocked`; no fallback move.

## 48. Skip Replay Semantics

Resolve and expand the occurrence, then suppress it from schedulable output while retaining omission provenance/reporting. It does not delete or disable the source.

## 49. Friction Interaction

Applied decisions participate normally. Exact moves may create conflicts; omission may remove them. “Accepted” never means conflict-free.

## 50. Blocked Decision Semantics

`blocked` means target/action is applicable but its hard outcome cannot be realized. It is a derived replay result, retained and explainable, never silently degraded.

## 51. Replay Result Semantics

Future result union: `applied`, `outsideWindow`, `stale` with reference reason, `blocked` with semantic reason, `superseded` for rejected/transaction context, `invalid`, or `unsupported`. Outcomes are not persisted.

## 52. Revocation/Removal

Explicit removal deletes current decision authority. Subsequent regeneration returns to authored/default behavior. This is minimum undo, not historical reversal.

## 53. Supersession Versus Revocation

Revocation withdraws intent with no replacement. Supersession accepts new intent for the same target and atomically replaces old authority. Neither retains history in V1.

## 54. Stale Decision Retention

Retain valid stale decisions until explicit removal or full clear. Staleness is derived and reversible; automatic deletion would destroy recoverable user intent.

## 55. Backup V2 Reactivation

If Backup V2 restores the exact target lifetime/coordinate, a retained stale decision is re-evaluated and may become applicable. This is intentional but underscores Backup V2's current decision-completeness limitation.

## 56. Profile Activation

Retain decisions; fresh profile lifetimes cause mismatch/stale classification. Never copy decisions into profiles or retarget them.

## 57. Backup V1 Import

Retain decisions; fresh imported lifetimes make them stale. No inferred continuity.

## 58. Clear

Future full local clear must explicitly clear the decision surface and its protected/desired/durability state alongside active/profile data. Active-only abandonment needs a separately explicit decision policy in Task 2.34.

## 59. Recovery Replacement

Active replacement re-evaluates retained decisions against accepted current authority. Decision-surface replacement/abandonment is independent, protected, source-rechecked recovery. No silent cross-surface overwrite.

## 60. Decision Garbage Collection

No automatic garbage collection in V1. User removal/full clear are the only destructive policies. Future bounded cleanup requires explicit UX/governance.

## 61. Validation Contract

Future validation must enforce exact union keys, version/kind, canonical UUID decision IDs, canonical acceptedAt, strict payload/date/time/range values, valid DurableReference V1, unique IDs, and at most one record per semantic target key. It must be pure and clone-safe.

## 62. Version Migration Readiness

No V0 exists. Unknown envelope/decision/reference versions are protected, not treated as V1. Future versions require explicit migration and anti-resurrection authority when historical formats exist.

## 63. Semantic Equality

Decision records are equal when all semantic fields match; object identity and JSON key order do not matter. Different record IDs mean distinct authored decisions even with equal target/payload.

## 64. Conflict Key

V1 semantic conflict key is the canonical structural semantic target reference alone because V1 permits one current decision per occurrence. It must use DurableReference semantic equality/canonical encoding, not raw object identity or insertion order.

## 65. Explainability

Derived output/replay reports must identify decision ID, kind, target, outcome, and failure reason. It may mention SuggestedFix action provenance but never depends on the original suggestion.

## 66. Store API Boundary

Future conceptual API: `acceptPlanDecision`, `removePlanDecision`, `getPlanDecisions`, `subscribePlanDecisions`, `getPlanDecisionDurabilityStatus`, `retryPlanDecisionPersistence`, plus explicit protected-ingress recovery operations. Existing state subscription payload remains unchanged.

## 67. Decision Durability Model

Independent surface receives its own latest desired serialized condition and durability status outside `DayFrameState`. Runtime decision authority continues after write failure; previous storage remains last durable checkpoint; explicit retry writes the same desired set.

## 68. Protected Ingress Model

Invalid/corrupt/unsupported current surface preserves raw data, blocks ordinary overwrite, exposes status outside DayFrameState, and requires explicit replace/abandon with source recheck.

## 69. Quarantine Model

When envelope is valid and entries can be isolated, invalid entries are quarantined non-destructively while valid nonconflicting entries load. Duplicate IDs/conflict keys require deterministic quarantine rather than silent latest-wins merging.

## 70. Backup Completeness Assessment

Once decisions are persisted, current Backup V2 is not a complete export of all durable user planning authority. Task 2.34 must expose this limitation, and a follow-on Backup V3 task must define atomic source+decision recovery semantics before claiming complete backup.

## 71. SuggestedFix → PlanDecision Mapping

| SuggestedFix kind | Preview-only Try? | Durable Accept candidate? | Authored edit instead? |
| --- | ---: | ---: | ---: |
| moveBlock | yes | `placeOccurrence` | no |
| skipBlock | yes | `omitOccurrence` | no |
| reduceDuration | yes | `setOccurrenceDuration` | no |
| changePriority | yes | `setOccurrencePriority` | no |
| convertToRecovery | yes | no; semantics unresolved | possible future source/action model |
| acceptConflict | yes | no; conflict reference prerequisite | no |
| changeFixedTime | no mutation; navigation | no | yes |
| addResource | unsupported Try | no | yes |

## 72. Required Decision Kind Matrix

| PlanDecision kind | Target family | Payload | Replay stage | Conflicts with |
| --- | --- | --- | --- | --- |
| placeOccurrence | template/work/manual | userDayDate + startTime | hard placement | every decision on same target |
| omitOccurrence | template/work/manual | empty | pre-placement suppression | every decision on same target |
| setOccurrenceDuration | template/work/manual where duration is legal | exact minutes | pre-placement transformation | every decision on same target |
| setOccurrencePriority | template/work/manual where priority is legal | exact priority | pre-placement ranking | every decision on same target |

## 73. Resolver Mapping Matrix

| Durable reference result | Decision derived status | Replay allowed? | Retained? |
| --- | --- | ---: | ---: |
| resolved | evaluate applicable/blocked/outside-window | conditionally | yes |
| sourceMissing | staleSourceMissing | no | yes |
| lifetimeMismatch | staleLifetime | no | yes |
| occurrenceMissing | staleOccurrenceMissing | no | yes |
| invalidReference | invalid/quarantine | no | yes, protected raw |
| unsupportedVersion | unsupported/protected | no | yes, protected raw |

## 74. Lifecycle Matrix

| Transition | Durable record | Derived behavior |
| --- | --- | --- |
| explicit fresh acceptance | create/replace | evaluate then regenerate |
| restart | retain | resolve/replay |
| Preview regeneration | retain | replay |
| ordinary update, occurrence remains | retain | re-evaluate |
| occurrence removed | retain | staleOccurrenceMissing |
| source deleted | retain | staleSourceMissing |
| source recreated | retain | staleLifetime |
| Profile V2 activation | retain | staleLifetime |
| Backup V1 import | retain | staleLifetime |
| Backup V2 exact restore | retain | may reactivate |
| explicit decision removal | delete | authored/default behavior returns |
| supersession | atomic replace | newest accepted record is sole authority |
| full clear | delete all | no replay |

## 75. Authority Matrix

| Layer | Authority |
| --- | --- |
| Authored setup | source/configuration truth |
| PlanDecision | accepted occurrence-scoped planning intent |
| Preview | derived schedule |
| SuggestedFix | recommendation |
| Try | transient derived experiment |

## 76. Persistence Options Matrix

| Property | Independent Decision V1 surface | Future Active V3 embedding |
| --- | --- | --- |
| version independence | strong | coupled |
| atomic acceptance | atomic within decision surface | atomic with authored data but unnecessary for V1 |
| recovery complexity | new bounded protected surface | coupled active recovery/migration |
| profile exclusion | explicit and clean | possible but conceptual mixing |
| backup evolution | requires Backup V3/package | also requires Backup evolution |
| migration | no V0; direct V1 | Active V2→V3 required |
| durability status | dedicated | coupled to active status |
| decision-only retry | direct | rewrites whole active payload |
| recommendation | **adopt** | reject for V1 |

## 77. Architectural Alignment Assessment

The contract aligns with Task 2.23's accepted-planning-authority model, Task 2.31's lifetime semantics, Task 2.32's durable reference outcomes, Phase 1 durability principles, stale-preview protection, and authored/derived separation. The deliberate V1 simplification to one current decision per occurrence avoids unresolved composition and is version-expandable.

## 78. Deviations

Task 2.23 previously recommended composable per-dimension records and a future conflict-acceptance branch. Task 2.33 narrows V1 to one current single-occurrence choice per target because its governing artifact prefers the smallest single-target contract and the completed DurableReference V1 cannot safely identify semantic conflicts. This is a documented version-scope refinement, not silent architectural expansion. Conflict acceptance and composable dimensions require explicit follow-on contracts.

## 79. Discoveries and Deferred Work

- A safe conflict-acceptance decision requires a versioned `DurableConflictReference`, unordered target canonicalization, conflict kind, and material fingerprint.
- Recovery substitution still lacks authoritative identity/completion semantics.
- Work/manual capability rules for duration/priority require direct validation in implementation.
- Timezone semantics remain local-runtime based; placement V1 intentionally stores user-day-relative local intent.
- Backup V3 completeness, active-abandonment interaction, protected decision recovery UX, and stale-decision management UI remain deferred.

## 80. Recommended Next Task

Proceed with **Task 2.34 — Implement PlanDecision V1 Durable Surface, Validation, and Store Authority**. It should implement the independent surface, strict validators/quarantine, store-owned collection and durability status, acceptance/removal/retry/recovery APIs, and no replay/UI until those foundations validate.

## 81. Validation

Required repository validation was run after the documentation-only change:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — passed: 32 test files, 547 tests.
- `npm run build` — passed: TypeScript and Vite production build, 48 modules transformed.
- `git diff --check` — passed.

## 82. Final Completion Determination

**Complete.** DayFrame has an implementation-ready PlanDecision V1 domain contract defining accepted single-occurrence planning authority, four supported kinds, independent identity/versioning, DurableOccurrenceReference targeting, exact semantic payloads, applicability and replay, deterministic supersession, explicit stale handling/retention/reactivation, authority boundaries, an independent protected durable surface, and implementation sequencing. Full repository validation passed. No PlanDecision persistence/application, durable-reference change, scheduling change, history, or unrelated behavior was introduced.
