# Phase 3 Progress and Adherence Semantics Checkpoint

**Status:** Accepted architecture foundation  
**Date:** 2026-08-21  
**Scope:** Task 3.7

## Epistemic Boundary

ExecutionHistory contains explicit user-reported evidence. A metric is a non-authoritative interpretation of that evidence for a named scope. It must preserve uncertainty and cannot create execution facts, alter history, or mutate planning authority.

The authoritative V1 outcome classes are Completed, Partial, Skipped, and Not reported. “Missed,” “failed,” “successful,” and “compliant” are not V1 outcomes.

## Outcome Meanings and Completion Policy

| Outcome | Evidence meaning | V1 aggregate treatment |
| --- | --- | --- |
| Completed | User says the activity was sufficiently completed | Separate categorical count |
| Partial | Meaningful execution occurred; completion was not claimed | Separate categorical count; no fractional credit |
| Skipped | User explicitly chose not to perform a planned activity | Separate categorical count; not generic failure |
| Not reported | No current assertion, including a retracted subject | Uncertainty; never zero/failure |

V1 adopts categorical truth. It does not publish a scalar completion percentage. Reported duration is evidence about time, not a completion fraction; Partial is never automatically 50%.

## Metric Classes

1. **Reported-evidence metrics** use ExecutionHistory alone and are historically reproducible: current projected subject counts by outcome, with optional factual breakdowns.
2. **Current-plan metrics** join a fresh, accepted Preview with history: current Preview reporting coverage. They are volatile, non-durable, and must be labeled with that scope.
3. **Historical-plan metrics** require a durable historical denominator that does not exist. Historical adherence/follow-through is blocked.

ExecutionHistory knows reported subjects and their frozen context. It cannot know past planned subjects that never received a first report. Current recurrence, current Preview, and current PlanDecision state cannot reconstruct past expectations safely.

## Denominator and Planning-State Policy

Plan follow-through, if later implemented, means reported follow-through on actionable scheduled occurrences, independent of timing. Its denominator may include only occurrences with a scheduled interval in the governing plan snapshot.

| Plan state | Follow-through denominator | Other relevance |
| --- | ---: | --- |
| Scheduled | Eligible in a governed current/durable plan scope | Execution outcome summary |
| Unplaced | Excluded | Planning-demand/capacity diagnostic |
| Omitted | Excluded | Explicit planning choice |
| Blocked | Excluded | Planning-friction diagnostic |
| Unplanned | Excluded | Evidence totals; future goal mapping only |

Planning infeasibility and omission are never user execution failure. Execution of an omitted, blocked, or unplaced occurrence may still be reported and counted categorically.

## Source Families

All valid template, work, manual, and unplanned subjects participate in generic categorical outcome summaries. Generic follow-through across those families is deferred because work and manual events do not uniformly express personal goals. A future explicitly named follow-through metric should either present family breakdowns or adopt an independently justified family policy. Unplanned activity can never enter a plan denominator.

Source lifetime is the default aggregation identity. Different incarnations are not merged automatically. Frozen title/category may be displayed, but titles are not identity. Cross-lifetime or category aggregation is presentation-only and must not imply continuity.

## Progress Versus Plan Follow-Through

**Progress** means movement toward an explicit objective or Goal. DayFrame has no executable Goal domain, mapping, target, or historical identity, so Goal progress is not implementation-ready.

**Plan follow-through** means the relationship between reported outcomes and actionable planned occurrences. “Plan follow-through” is the preferred user-facing term; “adherence” may remain an internal architectural term but is too judgmental and ambiguous for default UI.

Timing alignment and duration alignment are distinct future measures. Both are deferred because actual time/duration evidence is optional and activity semantics differ.

## Reporting Coverage and Bias

Reporting coverage answers whether enough outcomes were reported to assess a known plan scope. Current Preview coverage may be shown as `reports recorded / reportable current-preview occurrences`. Unknowns remain visible and outside any completion judgment.

User reporting is incomplete and selection-biased. A completion count among reported subjects must never be presented as overall performance. Unknown cannot become a negative learning label. Skipped and Partial also cannot become simplistic negative labels.

## Period and Reproducibility Semantics

Evidence-only queries group by the frozen `snapshot.userDay.date`. The frozen day-boundary and offset explain historical context; UTC `recordedAt` does not select the occurrence period. Calendar week grouping requires an explicit query `weekStartsOn`; history does not freeze that preference, so no globally canonical historical user week exists. Month grouping uses frozen user-day dates.

Corrections deterministically replace the current projection. Retraction removes the assertion from outcome counts and restores a known Not reported subject. Re-report restores the same subject. Raw revision counts are audit metadata, not activity counts.

## Recommended First Derivation

Task 3.8 may implement:

- non-durable pure counts of current subject projections: Completed, Partial, Skipped, and known retracted/Not reported;
- an optional fresh-current-Preview reporting coverage count, explicitly labeled “Current preview”;
- categorical breakdowns without a scalar score.

It must not implement historical adherence, completion percentages, Goal progress, streaks, duration/timing adherence, or learning.

## Plan-History Ledger Determination

A durable historical plan ledger is necessary before arbitrary historical reporting coverage or plan follow-through can be truthful. Task 3.7 does not authorize or design that ledger. It is not a prerequisite for the evidence-only Task 3.8.

## Persistence and Privacy

Derived values are recomputable caches/views, non-authoritative and non-durable by default. ExecutionHistory retention, export, correction, and full-clear policy govern the underlying personal data. No new persistence or Backup version is introduced.

## Learning Boundary

Future learning consumes explicit evidence classes plus coverage/uncertainty metadata. It may suggest changes but cannot reinterpret history or silently mutate authored/decision authority. Timing and duration features require adequate evidence coverage and activity-appropriate semantics.

## Architectural Invariants

1. Not reported is never failure.
2. Unknown evidence is never a negative learning label.
3. Planning infeasibility is not execution failure.
4. Omitted, blocked, and unplaced occurrences are not user non-compliance.
5. Corrections update current metrics deterministically; retraction restores uncertainty.
6. Historical metrics cannot invent missing denominators.
7. Current-plan metrics are labeled as current-plan derived and remain non-durable.
8. Historical plan follow-through requires a durable historical plan denominator.
9. Reported duration is not completion fraction; Partial is not automatically 50%.
10. Progress, plan follow-through, timing alignment, and reporting coverage are distinct.
11. Goal progress requires explicit Goal semantics.
12. Derived metrics are non-authoritative and non-durable by default.
13. No monolithic productivity, success, or compliance score collapses evidence classes.
14. Source deletion, recreation, Profile/Backup changes, and plan regeneration do not rewrite evidence-only metrics.

## Deferred Metrics

Historical adherence, completion percentages, Goals, streaks, timing/duration alignment, allocation progress, planning-quality scoring, learning, schedule adaptation, plan-history persistence, and Backup V3 remain deferred.
