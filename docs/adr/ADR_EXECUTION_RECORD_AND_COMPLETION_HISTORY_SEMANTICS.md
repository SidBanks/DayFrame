# ADR — ExecutionRecord V1 and Completion-History Semantics

**Status:** Accepted
**Date:** 2026-08-21
**Decision:** Task 3.1

## Context

DayFrame has durable authored setup and accepted occurrence-scoped planning
authority, but it has no durable authority for what actually happened. Preview
statuses such as `completed`, `missed`, and `skipped` are vocabulary on a derived
draft type; the only exercised skip behavior is a preview revision or accepted
planning omission. Treating either as history would turn intent into fictional
evidence.

## Decision

DayFrame will introduce an independent, versioned `ExecutionRecord V1` surface.
Each record has an independent UUID identity and represents the latest explicitly
reported or directly observed outcome for one execution subject. Its subject is
either a planned occurrence, linked by `DurableOccurrenceReference V1`, or an
unplanned activity. A planned record also contains an immutable historical
snapshot sufficient to remain intelligible when its source or PlanDecision is
changed or removed.

V1 is a hybrid semantic model, not event sourcing:

```text
immutable accepted record revisions
        -> deterministic current-record selection
        -> derived OccurrenceOutcome
```

Corrections replace current authority by appending a new immutable record revision
that references the prior revision. Raw revisions are retained; projections and
progress are derived. Destructive deletion is reserved for explicit privacy/data
deletion, not ordinary correction.

V1 outcomes are `completed`, `partial`, and `skipped`. No record means `unknown`.
`missed` is not a stored or automatically derived V1 outcome. `cancelled` is
deferred because cancellation currently has no stable execution meaning distinct
from planning invalidation or a user-reported skip.

Scheduled times never become actual times. `occurredAt`/actual interval fields are
optional evidence; `recordedAt` is mandatory audit metadata. Retroactive entry is
allowed. Future-dated occurrence evidence is rejected unless its actual time is
not in the future; early and late are derived comparisons with the frozen plan
snapshot.

## Consequences

- Execution authority remains outside `DayFrameState`, Active V2, Profile V2,
  Preview, and PlanDecision V1.
- `DurableOccurrenceReference V1` supplies lifetime-safe correlation but is not a
  sufficient historical display record on its own.
- Backup V1/V2 remain Setup-only. A future complete Backup V3 must explicitly add
  history and planning surfaces; Profiles must continue to exclude history.
- History needs independent validation, persistence status, retry, quarantine,
  recovery, export, and clear behavior.
- Local storage may support a bounded prototype, but unbounded multi-year history
  should target IndexedDB or another independent collection-oriented store.
- Future learning consumes derived observations and may suggest authored changes;
  it never rewrites history or authored authority silently.

## Alternatives Rejected

- A mutable current outcome loses correction provenance and weakens recovery.
- Full event sourcing adds start/pause/resume ordering and projection complexity
  not required by the minimum product workflow.
- Reusing Preview status or PlanDecision conflates plan and reality.

## Follow-up

Task 3.2 should implement only ExecutionRecord V1 identity, pure domain types,
validation, correction-chain validation, and deterministic projection. Persistence
and UI remain later tasks.

