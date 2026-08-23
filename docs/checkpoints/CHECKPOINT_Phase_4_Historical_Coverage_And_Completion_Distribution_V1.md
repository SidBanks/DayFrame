# Checkpoint — Phase 4 Historical Coverage and Completion Distribution V1

## Scope

Task 4.2 implements the first Historical Intelligence projection. It is pure,
explicit, deterministic, non-durable, and available through the store query
boundary. It does not add UI, metric authority, storage, Backup data, Goals,
Progress, Recommendations, trends, or scores.

## Query and Identity

The query contains `HistoricalMetricPolicy V1`, inclusive start/end frozen
user-day dates, and explicit `evaluationAsOf`. The result identifies
`completionDistribution V1`. Relative time and wall-clock reads are excluded.

## Coverage

Every requested day resolves through canonical HistoricalPlan as-of semantics.
Coverage distinguishes complete, incomplete, and unavailable windows; published
empty days are known zero demand, while missing days remain unknown. Incomplete
known-day counts carry machine-readable limitations and never extrapolate.

## Distribution

Only effective scheduled occurrences are eligible. Unplaced, omitted, and blocked
occurrences remain deterministic exclusion provenance. Every eligible reference is
classified exactly once as completed, partial, skipped, unknown after retraction,
or not reported. Counts conserve the denominator. Current-outcome coverage counts
only completed, partial, and skipped; zero denominator is not applicable.

## Authority and Provenance

HistoricalPlan and ExecutionHistory remain the only historical authorities. Joins
use exact `DurableOccurrenceReference`, including source incarnation. Provenance
contains frozen day, source family, title, category, plan context, publication
identity/time, reason codes, and deterministic ordering. Current Active is absent
from the API. Results are clone-isolated.

## Protection

Protected HistoricalPlan, protected ExecutionHistory, unavailable storage, and
ExecutionHistory quarantine produce explicit unavailable results. They are never
converted into empty history or not-reported evidence.

## Lifecycle Boundaries

Backup V3 remains unchanged. JSON/authority roundtrip reproduces the projection.
Five-authority full clear requires no metric participant; a new query naturally
reports unavailable plan coverage after clear. No cache or persistence exists.

## Validation

- focused: 2 files, 11 tests, pass;
- full suite: 62 files, 780 tests, pass;
- lint/typecheck: pass;
- build: 90 modules, pass;
- Vite advisory: 585.02 kB chunk, non-blocking;
- `git diff --check`: pass.

## Next Boundary

Task 4.3 — Historical Intelligence Explanation, Drill-Down, and Bounded UI
Integration should expose the implemented truth and provenance before Phase 4 adds
more analytical projections.

## Task 4.3 Product Integration

Task 4.3 completes that boundary through a bounded top-level Summary destination.
The product now exposes explicit date-window queries, plan-coverage evidence, five
categorical scheduled-outcome counts, current reporting coverage, missing dates,
frozen-context category drill-down, and excluded planner states. Async query
responses are revision-guarded; HistoricalPlan and ExecutionHistory subscriptions
refresh the result and clear stale content while loading. Protected and quarantined
authority remains unavailable rather than appearing empty. Existing plan-history
reporting and Preview/all-history outcome summary retain their separate purposes.

No new projection, persistence, Backup field, domain event, score, adherence,
trend, Goal, Progress, Recommendation, or learning behavior was introduced. The
next Phase 4 action is a bounded review of the Summary experience before selecting
or authorizing another metric.

## Task 4.4 UX Audit Determination

The bounded product audit selected Determination B: the Planner/Summary architecture
is coherent with refinement. Preview's `Reported outcomes` is an ExecutionHistory
subject aggregate filtered by dates, while Summary's `Scheduled outcomes` uses an
effective HistoricalPlan scheduled denominator. They must remain separate
semantics, but Preview currently labels retracted/unknown subjects `Not reported`,
creating a visible conflict with Summary's distinct Unknown and no-report classes.
Preview also hosts current reporting, past-plan reporting, correction/retraction,
and schedule review, and top-level `Generate Preview` mixes command and destination
behavior.

Task 4.5 is therefore a bounded Planner/Preview navigation, outcome-scope, naming,
and operational-reporting responsibility refinement. Summary remains read-only.
No new metric is authorized until that refinement is assessed.

## Task 4.5 Operational UX Refinement

The refinement completed without changing historical semantics. Top-level
navigation now contains only Setup, Preview, and Summary destinations. Setup owns
the save-before-generate command; Preview exposes explicit Generate/Regenerate and
can be entered without mutation. The broad Preview ExecutionHistory aggregate was
removed, while contextual reporting, frozen past planned occurrence reporting,
and correction/retraction remain operational under clearer `Report history`
language. Summary remains read-only, keeps Task 4.2 Scheduled outcomes unchanged,
and visibly scopes reporting coverage to selected dates.

No further UX prerequisite was discovered. Scheduling Realization V1 is the next
candidate, subject to its own governed semantics and strict separation from
execution outcomes.

## Task 4.6 Scheduling Realization V1

The HistoricalPlan-only projection is complete. It reuses V1 policy/coverage,
counts every intended occurrence once across scheduled, unplaced, omitted, and
blocked, conserves the denominator, retains exact frozen-incarnation provenance,
and uses canonical cutoff republication. Active, Preview, ExecutionHistory, and
Completion Distribution cannot affect it. No persistence, Backup field, clear
participant, UI, score, reason inference, capacity/allocation semantics, Goal,
Progress, Recommendation, or learning behavior was added. Task 4.7 is next.

## Task 4.7 Scheduling Realization Summary Integration

One Summary range, cutoff, policy, and plan-coverage view now support peer
Planning/Scheduling realization and Execution/Scheduled outcomes cards. All four
planning counts offer frozen read-only provenance without causal claims;
Completion Distribution/reporting coverage remain separate and unchanged. No
write, durability, score, funnel, capacity/allocation, trend, Goal, Progress,
Recommendation, learning, or Planner convergence was added. Next is a bounded
product/roadmap review, not an assumed new metric.

## Task 4.8 Roadmap and Planner Readiness Determination

The post-4.7 product audit selected Determination A: begin Planner Convergence V1.
Summary is a sufficient independent reflective V1, while Setup and Preview already
contain governed authored, derived-schedule, friction, and reporting capabilities
that can converge composition-first without authority or persistence changes.
Phase 4 remains open: its Historical Intelligence subphase is functionally mature,
but the Roadmap's broader Learn promises remain explicitly deferred. Task 4.9 is a
bounded Planner shell with Plan/Schedule subviews; it is not a rewrite, Settings
extraction, engine change, or new analytical feature.

## Task 4.9 Planner Convergence V1

The top-level product now exposes only Planner and Summary. Planner composes the
existing Setup and Preview workflows as accessible Plan and Schedule modes while
retaining one app-owned draft, explicit Save/Generate/Regenerate, stale derived
schedule behavior, schedule review, friction/PlanDecision, current reporting,
past-plan reporting, and Report history. Summary remains separate and read-only.
No engine, authority, persistence, Backup, restore, clear, analytics, Goal,
Progress, Recommendation, or learning semantics changed. Task 4.10 should audit
the converged product and determine Phase 4 closure/sequencing.

## Task 4.10 Planner V1 Acceptance and Phase 4 Sequencing

The converged product audit accepts Planner V1 with non-blocking UX debt. Its
Plan/Schedule model preserves explicit mutation, saved-versus-draft truth,
derived Schedule states, operational reporting, read-only Summary, all durable
authorities, and Backup/restore/clear behavior. Terminology, Plan density, mobile
visual verification, and other recorded polish items do not require another
feature task.

Phase 4 remains open for one bounded governance action only. Task 4.11 must audit
and publish closure under the achieved Historical Intelligence Foundation and
Planner/Summary Product Architecture identity, preserve deferred allocation,
comparison, Goals, recommendation, and learning work, and establish a design-first
Phase 5 entry boundary.

## Task 4.11 Phase 4 Completion

Task 4.11 completed the independent closure audit and published
`CHECKPOINT_Phase_4_COMPLETE.md`. Phase 4 is complete with non-blocking deferred
scope and residual debt. That completion checkpoint supersedes this implementation
checkpoint as the canonical Phase 4 rehydration anchor.
