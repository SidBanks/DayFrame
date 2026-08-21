# Task 2.34 Result — Implement PlanDecision V1 Durable Surface, Validation, and Store Authority

## 1. Executive Result

Implemented PlanDecision V1 as an independent store-owned durable authority with strict domain/reference validation, one-decision-per-target supersession, acceptance/removal, dedicated subscriptions and durability, retry, entry quarantine, protected ingress/recovery, and full-clear integration. Decisions are not replayed or applied to scheduling.

## 2. Artifact Integrity

The supplied and saved artifacts were byte-identical: 48,028 bytes, 2,370 lines, SHA-256 `3cdef0f143e96122f7c73ab70116b075b66a170d74393dc800cfdc7c31ec46e3`. The required final statement and all execution/validation sections were present.

## 3. Governing Contract

Task 2.33's accepted four-kind, single-target, independent-surface contract was implemented without reopening Task 2.32 source/reference semantics or other durable formats.

## 4. Initial Store/Durability Audit

The existing store retained active/profile authority, desired conditions, retry, protected ingress, quarantine, and subscribers outside/alongside `DayFrameState`. The narrow extension is a self-contained decision-surface manager delegated through the store; active/profile machinery remains independent.

## 5. Files Changed

- `code/src/core/decisions/planDecision.ts`
- `code/src/core/decisions/planDecision.test.ts`
- `code/src/state/planDecisionSurface.ts`
- `code/src/state/planDecisionSurface.test.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/types.ts`
- `code/src/state/durabilitySemantics.ts`
- `code/src/state/durabilitySemantics.test.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- this result artifact

## 6. PlanDecision Module

The dedicated core module owns types, ID/version constants, allocator, strict validator, clone helpers, record/semantic equality, and canonical semantic target keys.

## 7. Decision Version

`PLAN_DECISION_VERSION = 1` is independent of the surface and DurableReference versions.

## 8. PlanDecisionId

`PlanDecisionId` is a distinct branded canonical lowercase UUID-v4. It is not a source incarnation, target hash, timestamp, or runtime ID.

## 9. Decision ID Allocation

`createPlanDecisionId()` uses `crypto.randomUUID`; the store accepts a test-injectable allocator. Invalid or colliding allocation returns `allocationFailure` before mutation.

## 10. Concrete Decision Union

The union implements `placeOccurrence`, `omitOccurrence`, `setOccurrenceDuration`, and `setOccurrencePriority`, each with version, ID, target, canonical payload, acceptedAt, and provenance.

## 11. Kind Payloads

Placement stores `userDayDate/startTime`; omission stores canonical `{}`; duration stores integer minutes `1..1440`; priority stores integer `1..5`.

## 12. Provenance

Provenance is either `{source:"user"}` or suggested-fix origin with one of the four authorized semantic actions. Transient IDs/messages/snapshots are rejected.

## 13. acceptedAt

Acceptance time is store-owned via injectable clock and validated as canonical UTC ISO-8601. It does not control identity, supersession, or ordering.

## 14. Strict Validation

Every level enforces exact keys, discriminated payload shape, ID/time/date/range constraints, and pure clone-on-success behavior.

## 15. Target Validation

Targets pass Task 2.32's strict DurableOccurrenceReference V1 validator. Runtime OccurrenceIdentity and arbitrary objects are rejected.

## 16. Unsupported Reference Handling

Future decision version and future target-reference version are distinct results; persisted entries are quarantined with distinct reasons and raw preservation.

## 17. Semantic Equality

Record identity requires equal IDs plus semantic equality. Semantic comparison uses kind, target, payload, acceptedAt, and provenance without object/key-order dependence.

## 18. Target Key

`getPlanDecisionTargetKey` explicitly encodes every validated family/lineage/coordinate component. It is stable across clone, roundtrip, restart, and key ordering.

## 19. Collection Semantics

Current valid decisions are canonical-sorted, have unique IDs, and contain at most one record per target key. Stale valid records remain loaded; quarantined raw entries are separate and durable.

## 20. Store Ownership

`createDayFrameStore` owns one independent `PlanDecisionSurface`; no decision is appended to `DayFrameState`.

## 21. Accessor / Subscription

Dedicated clone-safe decision, quarantine, ingress, and durability accessors/subscriptions were added. Decision mutation notifies decision listeners once and never ordinary state listeners.

## 22. Durability Status

The surface retains independent `unknown`, `durable`, `unavailable`, `serializationFailure`, or `storageFailure` truth.

## 23. Desired Durable Condition

The manager retains the latest cloned desired collection—including quarantine raw entries—after runtime mutation. Retry writes that exact condition without regenerating IDs/timestamps.

## 24. Envelope

Current envelope: `{app:"DayFrame", surface:"planDecisions", version:1, decisions:[...]}`. Entries include valid decisions and preserved quarantined raw entries.

## 25. Storage Key

Current key: `dayframe-plan-decisions-v1`. No V0/migration/legacy key exists.

## 26. Startup Semantics

Missing source yields healthy empty/unknown durability; valid V1 loads canonical decisions; entry defects quarantine; malformed/wrong/unsupported envelope protects whole source. Loaded decisions are not resolved, so valid stale authority is retained.

## 27. Whole-Surface Protection

Read failure, corrupt JSON, wrong envelope/surface, and unsupported envelope version create `recoveryRequired`; ordinary accept/remove/retry cannot overwrite it.

## 28. Entry Quarantine

Valid nonconflicting entries load while invalid, unsupported, duplicate-ID, and duplicate-target entries receive deterministic quarantine handles/reasons with raw clones.

## 29. Duplicate-ID Policy

First valid encountered entry remains active; later same-ID entries quarantine as `duplicateDecisionId`.

## 30. Duplicate-Target Policy

First valid encountered target remains active; later different-ID entries for that target quarantine as `conflictingTarget`. acceptedAt is never latest-wins authority.

## 31. Quarantine Preservation

Writes/retries preserve raw quarantined entries in the envelope. Dedicated clone-safe list/export/removal operations are available.

## 32. Protected Recheck

Recovery rereads the exact key and byte-compares it with protected evidence. Changed/unreadable sources return expected non-mutating outcomes.

## 33. Recovery Replacement

Replacement serializes the current valid runtime collection plus quarantine, writes/rereads/verifies, and clears protection only after durable success.

## 34. Recovery Abandonment

Abandonment source-rechecks and establishes a verified authoritative empty V1 envelope. Runtime decisions/quarantine clear only after success.

## 35. Acceptance API

`acceptPlanDecision` accepts semantic input only; the store supplies version, ID, and timestamp.

## 36. Acceptance Validation

Expected rejections include protection, malformed/unsupported target, unresolved source/lifetime/occurrence, invalid payload/kind, and allocation failure. No expected rejection throws.

## 37. Target Resolution At Acceptance

New intent must target a currently resolved occurrence. Previously stored decisions may later become stale and remain retained.

## 38. Supersession

Acceptance atomically removes the same target key and inserts one freshly identified record, then canonical-sorts. Cross-kind supersession is directly tested.

## 39. Acceptance Persistence Failure

Valid runtime authority advances on storage failure; durability becomes factual failure and desired condition remains retryable. No rollback occurs.

## 40. Acceptance Notifications

Decision subscribers receive one cloned snapshot. Durability/ingress subscribers receive only their relevant transitions; state subscribers remain silent. Preview is unchanged.

## 41. Removal API

Removal uses exact PlanDecisionId, preserves all other decisions/quarantine, persists next authority, and returns explicit `notFound`/protected outcomes without writes.

## 42. Removal Persistence Failure

Runtime removal remains current session authority after failure; retry writes the latest absent-record collection.

## 43. Retry

Dedicated retry rejects protected, unknown, already-durable, and serialization-failure states as governed; retryable unavailable/storage failures write and verify the exact desired envelope.

## 44. Restart

Valid V1 decisions reload with unchanged ID, target, payload, acceptedAt, and provenance. No allocation or resolution occurs on load.

## 45. Stale Decision Loading

Startup deliberately validates structure rather than current applicability, preserving stale valid decisions without retargeting.

## 46. Profile Activation Retention

Profile activation does not touch the independent collection. Fresh source lifetimes make old targets stale for later evaluation.

## 47. Backup V1 Retention

Legacy backup import changes active lifetimes but not decision records.

## 48. Backup V2 Reactivation

Backup V2 restore changes active authority only; retained decisions may later resolve again when exact lifetimes return. Task 2.34 does not evaluate/replay them.

## 49. Full Clear

`clearLocalData` now removes active, profiles, and decision storage; returns all three outcomes; and computes aggregate success across all three. Shared durability classification exposes the decision removal outcome.

## 50. Active Abandonment Policy

Active-only protected abandonment retains decisions. It does not silently broaden into full local clear.

## 51. Active/Profile Recovery Independence

Active/profile recovery and durability operations never mutate decision ingress, collection, quarantine, or status; decision recovery is likewise independent.

## 52. DayFrameState Isolation

State types/snapshots contain no decision collection or durability fields. Existing state subscribers are unchanged.

## 53. Preview Isolation

Acceptance/removal/load/retry/recovery do not generate, stale, revise, or notify Preview. No decision is consumed by scheduling.

## 54. Quarantine Raw Export/Removal

Dedicated APIs export clone-isolated raw quarantine and remove one handle with persistence. Protected raw export is non-mutating.

## 55. Persistence Shape

Writes are surface-discriminated V1 envelopes only. Reread must byte-match and parse to the correct envelope with an exact desired decision array.

## 56. Ordering / Canonicalization

Valid decisions sort by canonical target key then decision ID. Quarantine order follows durable encounter order; neither determines authority.

## 57. Clone Isolation

Inputs, valid validator output, accessors, subscriber snapshots, accepted results, quarantine exports, and durable desired entries are independently cloned.

## 58. Cross-Surface Envelope Rejection

Active/Profile/Backup/wrong-app envelopes are whole-source protected and never interpreted as decisions.

## 59. Backup Completeness Limitation

Backup V2 still excludes PlanDecision. Once users accept decisions, it is not a complete export of all durable planning authority. Backup V3 remains required before claiming completeness.

## 60. Tests Added or Updated

Added 12 focused tests across two files for all kinds, strict validation, future versions, target-key stability, equality, acceptance/resolution, cross-kind supersession, subscriber isolation, persistence failure/retry exactness, stale startup, quarantine policies, protected source change, removal, and full clear. Existing clear/durability tests were updated for the third surface.

### Decision Kind Matrix

| Kind | Target | Payload | Accepted now? | Replayed now? |
| --- | --- | --- | ---: | ---: |
| placeOccurrence | resolved durable occurrence | user day + time | yes | no |
| omitOccurrence | resolved durable occurrence | `{}` | yes | no |
| setOccurrenceDuration | resolved durable occurrence | minutes | yes | no |
| setOccurrencePriority | resolved durable occurrence | priority | yes | no |

### Store Operation Matrix

| Operation | Runtime collection | Durable attempt | Decision notify | State/Preview effect |
| --- | --- | ---: | ---: | --- |
| accept | supersede/insert | yes | once | none |
| remove existing | remove | yes | once | none |
| remove missing | unchanged | no | no | none |
| retry | unchanged | yes when eligible | no | none |
| quarantine removal | valid unchanged | yes | no | none |
| full clear | empty on success | removal | once | existing clear reset |

### Ingress Matrix

| Input | Result |
| --- | --- |
| no key | healthy empty |
| valid V1 | accepted |
| valid envelope + bad entry | valid load + quarantine |
| duplicate ID/target | first active, later quarantine |
| corrupt/wrong/future envelope | protected recoveryRequired |

### Cross-Surface Lifecycle Matrix

| Transition | Decision authority |
| --- | --- |
| active/profile mutation or recovery | retained unchanged |
| profile activation / Backup V1 | retained, potentially stale |
| Backup V2 exact restore | retained, potentially reactivatable |
| active-only abandonment | retained |
| full local clear | removed |

### Durability Matrix

| Outcome | Runtime authority | Desired condition | Retry |
| --- | --- | --- | --- |
| persisted | advances | exact latest | already durable |
| unavailable/storageFailure | advances | exact latest | eligible |
| serializationFailure | advances | exact latest | recovery required |
| protected ingress | unchanged | protected | blocked |

## 61. Reference Audit

PlanDecision symbols occur only in the new core/state boundary, store types/delegation, tests, and result. DurableReference is validated/resolved for acceptance only.

## 62. Persistence Writer Audit

Active writes Active V2; profiles write Profile V2; backup exports Backup V2; decisions write PlanDecision surface V1. No cross-surface writer includes decisions.

## 63. No-Replay Audit

No schedule generator, placement, friction, Preview revision, or UI module imports PlanDecision. Accepted authority has no scheduling effect in Task 2.34.

## 64. Architectural Alignment Assessment

The implementation matches Task 2.33's independent authority, single-target supersession, stale retention, and DayFrameState separation while reusing established factual durability, non-destructive ingress, source recheck, quarantine, and runtime-authority-after-failure principles.

## 65. Deviations

No behavioral scope deviation. The implementation uses one cohesive `planDecisionSurface.ts` rather than splitting persistence/ingress into multiple files; this keeps the fourth surface isolated and bounded. No anti-resurrection marker was added because no historical decision format/key exists.

## 66. Discoveries and Deferred Work

- Decision replay/application and kind capability/feasibility evaluation remain Task 2.35.
- Fresh-Preview Accept orchestration/UI remains deferred; store acceptance correctly requires resolved authority but has no Preview dependency.
- Backup V3, decision recovery UI, stale/quarantine UI, conflict decisions, recovery substitution, history, and multi-dimension composition remain deferred.
- The public full-clear result now truthfully includes the third durable removal outcome.

## 67. Recommended Next Task

Proceed with Task 2.35 to implement pure PlanDecision applicability and deterministic replay into schedule generation, preserving this durable surface and returning per-decision results without UI expansion.

## 68. Focused Validation

`npx vitest run src/core/decisions/planDecision.test.ts src/state/planDecisionSurface.test.ts` passed: 2 files, 12 tests. Focused typecheck and lint passed.

## 69. Full Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — passed: 34 files, 559 tests.
- `npm run build` — passed: TypeScript and Vite, 51 modules transformed.
- `git diff --check` — passed.

## 70. Final Completion Determination

**Complete.** DayFrame now has a concrete independently persisted PlanDecision V1 authority with strict decision/reference validation, canonical identity/target keys, deterministic supersession, store-owned acceptance/removal, clone-safe access/subscription, dedicated factual durability/retry, non-destructive quarantine, protected whole-source ingress/recovery, full-clear integration, cross-surface isolation, and direct regression coverage. Valid stale authority remains durable without retargeting. Full validation passes, and no replay, scheduling, Accept UI, Backup V3, or history was introduced.
