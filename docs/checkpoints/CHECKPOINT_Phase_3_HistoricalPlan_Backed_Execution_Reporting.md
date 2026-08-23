# Checkpoint — Phase 3 HistoricalPlan-Backed Execution Reporting

## Purpose

Close P3-GAP-001 by keeping durable planned occurrences actionable after they leave the operative Preview.

## Authority and Eligibility

The current effective HistoricalPlan V1 day projection is the sole planning source for this path. Scheduled, unplaced, omitted, and blocked stored occurrences are reportable because the existing Preview path already supports the same planned states. Missing publication produces no authority; an explicitly published empty day is valid zero-occurrence authority.

## Target and Identity

The pure converter copies the exact stored `DurableOccurrenceReference`, frozen title/category/plan, and the publication day's date, boundary, and UTC offset into the existing `HistoricalExecutionTarget`. It performs no Active, Profile, PlanDecision, or Preview lookup and creates no new identity.

## Lifecycle Continuity

Because conversion depends only on validated HistoricalPlan projection, source deletion and logical recreation cannot retarget the occurrence. IndexedDB restart and Backup V3 exact restore preserve the same reference and snapshot. Both Preview and historical entry points converge on `ExecutionReportControl`, `executionReportingWorkflow`, and ExecutionHistory's immutable correction/retraction rules.

## UI and Projection Interaction

The existing Preview screen contains a compact date-selected “Report from plan history” section with loading, missing, empty, protected/error, and eligible-occurrence states. Reports update ExecutionHistory-derived categorical Summary naturally. Current-Preview coverage changes only if the same durable reference is actually in the current fresh Preview.

## Invariants

- Historical selection does not mutate or publish HistoricalPlan.
- Historical selection does not generate or reconstruct Preview.
- Reporting obeys store readiness, protection, and authority-transaction admission.
- Pending accepted HistoricalPlan authority is queryable under existing surface semantics.
- No domain version, durable store, outcome, metric, adherence, Goal, Progress, or learning semantic is introduced.
