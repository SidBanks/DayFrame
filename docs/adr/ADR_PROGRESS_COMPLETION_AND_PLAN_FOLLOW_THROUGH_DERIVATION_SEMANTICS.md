# ADR — Progress, Completion, and Plan Follow-Through Derivation Semantics

**Status:** Accepted  
**Date:** 2026-08-21  
**Decision:** Task 3.7

## Context

ExecutionHistory V1 records categorical user-reported outcomes and immutable planned snapshots only for subjects that have entered history. It does not durably represent planned occurrences that never received a report. A scalar completion or historical adherence rate would therefore either assign arbitrary credit to Partial, treat uncertainty as failure, or invent a denominator from mutable current planning state.

## Decision

DayFrame will begin with report-only categorical outcome summaries. V1 will not publish a scalar completion rate. Partial remains its own evidence class, Skipped remains explicit non-performance rather than generic failure, and Not reported remains uncertainty.

“Progress” is reserved for movement toward an explicit Goal; no Goal domain currently exists. The user-facing term for comparison with a plan is “plan follow-through,” not generic progress or compliance. V1 follow-through, if later authorized, concerns actionable scheduled occurrences and is independent of timing.

Evidence-only summaries may be derived from ExecutionHistory. Current Preview reporting coverage may join a fresh accepted Preview and history when labeled current and volatile. Historical plan follow-through is prohibited until a durable historical plan denominator exists. Derived values are recomputable, non-authoritative, and non-durable by default.

## Consequences

- The first implementation may show Completed, Partial, Skipped, and known Not reported counts.
- It may show current-Preview reporting coverage, never historical coverage.
- No overall success, productivity, completion, compliance, or adherence percentage is defensible in V1.
- Unplaced, omitted, blocked, and unplanned occurrences do not enter a follow-through denominator.
- Work/manual/template/unplanned evidence may all appear in categorical summaries; cross-family goal meaning is not inferred.
- Historical follow-through requires a separately authorized plan-history ledger.
- Goal progress requires a separately defined Goal domain and mapping.
- Corrections/retractions recompute projections; raw revisions are not double-counted.
- Unknown, Partial, and Skipped are not simplistic negative learning labels.

## Alternatives Rejected

- Weighted Partial credit invents generic completion semantics.
- Treating Not reported as zero converts missing evidence into failure.
- Reconstructing past denominators from current recurrence/Preview rewrites history after plan changes.
- Calling reported-only completion a general progress/adherence score conceals reporting bias.
- A monolithic productivity score collapses planning feasibility, execution evidence, and goals.

## Follow-up

Task 3.8 should implement a pure reported-outcome summary and optional explicitly scoped current-Preview reporting coverage, with no scalar score or persistence.
