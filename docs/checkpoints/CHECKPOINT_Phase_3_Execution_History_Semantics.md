# Phase 3 Execution and History Semantics Checkpoint

**Status:** Accepted semantic foundation; pure V1 domain implemented by Task 3.2
**Date:** 2026-08-21
**Scope:** Task 3.1

**Implementation update (2026-08-21):** Task 3.2 implemented the pure
`ExecutionRecord V1` identity, strict validation, immutable correction/retraction
chain, and deterministic current-outcome projection described here. Persistence,
store authority, recovery, and UI remain unimplemented.

**Durability update (2026-08-21):** Task 3.3 implemented independent
`ExecutionHistory V1` runtime/store authority, bounded local-storage persistence,
subject-component quarantine, whole-source protected recovery, exact retry,
surface export, and full-clear integration. Reporting/history UI remains
unimplemented.

**Materialization update (2026-08-21):** Task 3.4 implemented the pure bridge from
fresh authoritative template/work/manual planning evidence to a lifetime-safe
reference and frozen ExecutionRecord-compatible snapshot. Stale, Try-only, and
historically unknowable context fails explicitly. Reporting UI remains
unimplemented.

## Problem and Epistemic Boundary

DayFrame must keep five kinds of knowledge distinct: authored intent, generated
plan, accepted planning choice, execution evidence, and inference. A planned block
does not prove execution, and silence does not prove failure.

```text
Authored authority -> PlanDecision authority -> generated current plan
                                               |
                                               | historical context only
                                               v
explicit report/direct observation -> ExecutionRecord revisions
                                      -> current outcome projection
                                      -> progress/learning observations
                                      -> recommendations -> explicit user acceptance
```

Execution facts are downstream history. They can become input to a separately
derived learning policy, but cannot silently mutate planning authority.

## Chosen V1 Domain Model

The accepted name is `ExecutionRecord V1`. It is a hybrid of immutable record
revisions and a derived current outcome, not a fine-grained event stream.

A future implementation should model:

- independent `ExecutionRecordId` and immutable revision identity;
- a planned subject (`DurableOccurrenceReference V1`) or an unplanned subject;
- an immutable display snapshot: source family, title, category, intended user
  day, and the effective planned interval if one existed;
- outcome `completed | partial | skipped`;
- provenance (`userReported` initially; direct timer/integration observation only
  when those systems exist);
- mandatory `recordedAt`, optional `occurredAt`, `actualStartedAt`,
  `actualEndedAt`, and/or defensible actual duration;
- optional bounded user note;
- correction linkage to the immediately superseded record.

Exactly one current record may be projected per semantic execution subject.
Multiple immutable revisions are permitted only as a valid correction chain.
Unplanned execution has an independent subject identity and snapshot and must not
fabricate a planned occurrence.

## Outcome Semantics

| Outcome | Authority | Meaning |
| --- | --- | --- |
| completed | stored evidence | Reporter says the intended activity was sufficiently completed; it is not a quality or goal-success claim. |
| partial | stored evidence | Reporter says some meaningful execution occurred but completion was not claimed; duration/quantity remains optional evidence. |
| skipped | stored evidence | A planned occurrence existed and the reporter says it was intentionally not performed. |
| unknown | derived absence | No current authoritative execution record exists. |
| missed | not V1 | Silence is ambiguous; no automatic missed claim is permitted. |
| cancelled | deferred | No repository-backed execution meaning distinct from planning invalidation or skip exists yet. |

Planning `skipBlock`/`omitOccurrence` means “do not include this occurrence in the
plan.” Execution `skipped` means “the occurrence was expected, but the reporter
did not perform it.” An omitted occurrence has no execution skip unless separately
reported with adequate historical subject context.

Actual time is evidence, never copied from scheduled time. Retroactive reporting
is valid. An execution may be early or late; those labels are derived by comparing
actual evidence to the frozen plan snapshot. Passing an end time never creates an
outcome. A future completion claim is invalid when its asserted actual occurrence
is still in the future.

## Identity, Snapshot, and Lifetime Safety

`DurableOccurrenceReference V1` correctly prevents source-ID reuse from retargeting
a planned occurrence. It is therefore the proper correlation key for supported
planned families. It is insufficient alone because resolution intentionally fails
after source deletion/lifetime replacement, and it does not freeze human-readable
historical context.

Historical snapshots are authoritative for how the record is understood. Current
source metadata may enrich the UI but may not overwrite the snapshot. Source edits,
deletion, recreation, Profile activation, Preview regeneration, and PlanDecision
removal/supersession cannot change an accepted record. Profile activation creates
fresh lifetimes and cannot inherit history. Backup V1 creates fresh lifetimes;
Backup V2 restores setup lifetimes, but neither format contains history.

Template, work, and manual-event occurrences supported by durable references are
valid planned subjects. Sleep or other generic activities use the template family
until a distinct authored domain exists. Quantity-specific fields are deferred;
V1 may preserve a note but must not invent percentages. Manual calendar presence
does not itself prove attendance.

## Provenance and Correction

V1 authoring authority is user report. Future timers and integrations may contribute
direct observations with explicit provider/method provenance. Inference never
masquerades as an observation and cannot create `completed`, `partial`, or
`skipped` authority.

Ordinary correction appends a replacement revision and retains the superseded
revision. Undo is a correction that projects `unknown` only through an explicit
retraction/tombstone revision. Physical deletion is a separate privacy operation.
This preserves auditability without adopting generalized event sourcing.

## Persistence, Recovery, and Privacy

Execution history is an independent, independently versioned durable surface. It
does not belong in `DayFrameState`, Active V2, or Profile V2. A complete future
backup must include it explicitly. Ingress must validate per entry and preserve
valid records while quarantining invalid records when referential independence
allows; envelope/version failure protects the whole source. Abandonment must be
explicit and especially clear because history is irreplaceable personal data.

History is retained indefinitely until the user deletes it; no silent retention
window is adopted. Export and full local-data clear must include it. Because the
surface can grow by occurrences and corrections for years, local storage is only
acceptable for a bounded first implementation with size/failure observability.
Collection-oriented storage is the long-term recommendation.

## Progress, Adherence, and Learning

Raw records produce a deterministic current outcome projection. Progress may be
derived only against an explicit goal/denominator and must expose unknowns.
“Adherence” may compare evidenced outcomes with the effective historical plan but
must not treat unknown as missed or judge activity quality. Prefer neutral labels
such as “reported complete,” “reported partial,” “reported skipped,” and “not
reported.”

History queries group by the captured user-day context. Instants remain canonical
UTC timestamps with the relevant local timezone/offset and day-boundary context
frozen when needed for display. DST days are not assumed to contain 24 hours.
Weekly/sequence occurrences retain their canonical coordinate and lifetime-safe
reference; unplaced, omitted, blocked, Try-only, and stale Preview states remain
planning context, not outcomes.

## Architectural Invariants

1. Planning state never proves execution.
2. Absent execution evidence means unknown, not failure.
3. Preview regeneration never deletes or changes history.
4. Source recreation never inherits old execution.
5. History remains interpretable after source deletion.
6. Current source edits never rewrite historical snapshots.
7. PlanDecision changes never rewrite execution.
8. Corrections are explicit and traceable.
9. Derived progress never mutates raw history.
10. Learning never silently mutates authored or decision authority.
11. Scheduled time is never presented as actual time.
12. Provenance distinguishes report, observation, and inference.

## Deferred Features and Sequence

Deferred: timers, integrations, pause/resume event streams, cancellation semantics,
automatic missed detection, quantities/percentages, progress and adherence scoring,
history UI, learning, Backup V3, and storage migration.

Recommended bounded sequence:

1. Task 3.2 — Implement ExecutionRecord V1 identity, domain semantics, pure
   validation, correction-chain validation, and outcome projection.
2. Add independent persistence, recovery, status, retry, export, and clear.
3. Link supported planned occurrences and materialize immutable snapshots.
4. Add minimal Complete/Partial/Skip reporting.
5. Add history visibility, correction, and explicit deletion.
6. Add derived progress foundations, then separately audit learning policy.
