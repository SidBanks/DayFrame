# Task 9.4 — Planning Data Horizon, Proposal Horizon, and Review Scope Convergence V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Subphase:** Planning Scope and Planner Read-Model Foundation
**Task Type:** Implementation / Temporal Scope Semantics / Planning Read Model / Range Convergence / Persistence Compatibility / Regression
**Primary Responsibility:** Establish one explicit, deterministic, canonical user-day-based planning-scope contract that distinguishes and correctly relates Planning Data Horizon, Proposal Horizon, Review Scope, Preview Range, and Publication Range, so DayFrame can reason over sufficient planning data, construct bounded Proposals, present an intentional review window, regenerate Preview, and publish schedule history without conflating data availability, planning authority, UI visibility, or historical scope.

---

## 1. Objective

Implement the temporal-scope foundation required for the next Phase 9 Planner/Month/Review Schedule work.

DayFrame now has a complete ordinary semantic planning path:

```text
Goal
→ Demand
→ Projection
→ Feasibility
→ Competition
→ Allocation
→ Proposal
→ ProposalDecision
→ Accepted Allocation
→ Realization
→ Scheduled Goal Work / Support / Buffer
```

Task 9.3 completed the authority-to-scheduled-reality transition.

The next problem is no longer:

> **Can DayFrame plan and realize Goal work?**

It is:

> **Over what exact span of planning data should DayFrame reason, over what bounded span may a Proposal offer action, what span is the user currently reviewing, what span is Preview rendering, and what span is publication freezing—and how do those scopes interact without silently becoming one another?**

Task 9.4 must establish that contract.

---

## 2. Governing Temporal Distinction

DayFrame must distinguish at least five concepts:

```text
Planning Data Horizon
Proposal Horizon
Review Scope
Preview Range
Publication Range
```

They are related.

They are **not synonyms**.

---

## 3. Canonical Definitions

### A. Planning Data Horizon

The bounded span of canonical user-days for which DayFrame must possess sufficient authoritative and derived planning data to reason correctly.

It answers:

> **What future/past planning data must be available for this planning computation to be trustworthy?**

It may be wider than what the user is currently looking at.

---

### B. Proposal Horizon

The bounded span within which constructive planning may offer new proposed action.

It answers:

> **Within what user-day interval may this Proposal recommend that the user authorize resource use?**

It is an authority boundary for the Proposal.

---

### C. Review Scope

The bounded span the user has intentionally chosen or been given to inspect as one planning/review context.

It answers:

> **What period am I reviewing right now?**

It is primarily a product/read-model scope.

It does not itself create planning authority.

---

### D. Preview Range

The bounded span rendered by a particular generated Preview.

It answers:

> **What scheduled reality does this Preview snapshot show?**

Preview remains disposable derived state.

---

### E. Publication Range

The exact bounded schedule interval frozen by one publication operation.

It answers:

> **What schedule truth did this publication make historical?**

Publication Range is immutable historical scope once published.

---

## 4. Required Separation

Do not collapse:

```text
Planning Data Horizon = Review Scope
```

or:

```text
Proposal Horizon = Preview Range
```

or:

```text
Review Scope = Publication Range
```

or any other pair merely because they sometimes have equal dates.

Equal bounds do not imply equal semantics.

---

## 5. Canonical User-Day

All five concepts must use canonical DayFrame user-day semantics.

Do not define these ranges by calendar midnight.

Use the existing effective:

* day boundary;
* per-cycle/per-segment preference behavior;
* canonical user-day date attribution.

Preserve DF-006 closure.

---

## 6. Range Convention

Use one explicit interval convention for user-day ranges.

Preferred:

```text
[startUserDay, endUserDayExclusive)
```

If existing Proposal Horizon already uses:

```text
inclusive start / exclusive end
```

preserve it and normalize the other scope concepts to the same semantic convention where safe.

Do not mix inclusive and inclusive/exclusive ranges without typed distinction.

---

## 7. Typed Scope Model

Introduce or consolidate explicit types materially equivalent to:

```ts
PlanningDataHorizonV1
ProposalHorizonV1
ReviewScopeV1
PreviewRangeV1
PublicationRangeV1
```

Exact names should follow repository conventions.

Do not pass anonymous:

```ts
{ startDate, endDate }
```

through every layer if the semantic meaning differs.

---

## 8. Shared Range Primitive

Where useful, define a common canonical user-day range primitive such as:

```ts
CanonicalUserDayRangeV1
```

containing only neutral geometry.

Semantic wrappers/discriminators then identify:

* Planning Data Horizon;
* Proposal Horizon;
* Review Scope;
* Preview Range;
* Publication Range.

Do not put authority semantics in the neutral primitive.

---

## 9. Planning Data Horizon Semantics

Planning Data Horizon must be sufficient to derive trustworthy:

* Work;
* Commitments;
* manual events;
* composition/support;
* Buffer protection;
* Goal Demand Projection;
* Capacity;
* Feasibility;
* Competition;
* Allocation;
* Proposal inputs;
* accepted-unrealized liabilities;
* realized scheduled truth;

for the requested planning operation.

---

## 10. Planning Data Horizon Is Not Display Scope

The user may review:

```text
one week
```

while the engine needs:

```text
more than one week
```

of planning data.

The UI must not have to display every user-day loaded for reasoning.

---

## 11. Boundary Context Expansion

Existing schedule generation already expands planning context around requested ranges where needed.

Task 9.4 must audit and normalize all such hidden expansions.

Examples include:

* one adjacent day needed for overnight blocks;
* support activity outside productive session day;
* Buffer extending beyond Proposal bounds;
* canonical user-day boundary crossing;
* Work crossing user-day edges.

Do not remove necessary context expansion merely to make ranges visually identical.

---

## 12. Explicit Requested vs Effective Horizon

If Planning Data Horizon requires expansion, distinguish:

```text
requestedPlanningHorizon
effectivePlanningHorizon
```

or equivalent.

The effective horizon must be deterministic and explainable.

---

## 13. Horizon Expansion Provenance

When effective horizon differs from requested horizon, preserve why.

Possible structured reasons:

```text
canonicalUserDayBoundary
overnightWork
supportFootprint
bufferFootprint
acceptedLiability
realizedScheduleContext
publicationBoundaryContext
```

Do not hide expansion in arbitrary `+1 day` code.

---

## 14. No Unbounded Planning Horizon

V1 must remain bounded.

Do not introduce:

* infinite future planning;
* full-lifetime Goal projection;
* open-ended recurrence expansion.

Every planning computation has explicit finite bounds.

---

## 15. Proposal Horizon Semantics

Proposal Horizon remains the exact interval within which Proposal options may authorize new planning action.

Task 9.4 must preserve Task 9.2 semantics:

* bounded;
* canonical user-day based;
* explicit;
* non-recurring by default;
* distinct from Review Scope.

---

## 16. Proposal Horizon Must Fit Planning Data

Invariant:

```text
Proposal Horizon
⊆ sufficiently covered Planning Data Horizon
```

A Proposal must not offer an interval for which the required planning data is incomplete.

---

## 17. Complete Footprint Coverage

Because Task 9.2.1 now plans complete productive/support/Buffer footprints:

A Proposal Horizon candidate is valid only when the **entire required footprint** has sufficient Planning Data Horizon coverage.

Do not clip support/Buffer at Proposal Horizon.

---

## 18. Proposal Horizon vs Footprint Geometry

A productive claim may be inside Proposal Horizon while support/Buffer reaches outside it.

Task 9.4 must define the rule explicitly.

Preferred V1:

> Proposal Horizon governs the productive action being proposed; Planning Data Horizon must cover the complete associated resource footprint even when support/Buffer extends outside the Proposal Horizon.

Do not widen Proposal authority merely because required overhead crosses its boundary.

---

## 19. Proposal Scope Fidelity

Proposal must preserve its exact Proposal Horizon as authority provenance.

Later:

* acceptance;
* realization;
* Preview;
* publication

must not reinterpret that horizon as their own scope.

---

## 20. Review Scope Semantics

Review Scope is the intentional planning period being inspected.

Examples may eventually include:

* selected day;
* week;
* multi-week period;
* month-like planner interval;
* custom bounded range.

Task 9.4 need not build all selectors.

It must create the semantic model they can use.

---

## 21. Review Scope Is Non-Authoritative

Changing Review Scope must not:

* change Goal authority;
* change Demand;
* change Priority;
* accept a Proposal;
* realize an Allocation;
* move schedule facts;
* publish history.

It changes what the user is reviewing.

---

## 22. Review Scope Identity

Define deterministic Review Scope identity or equality based on:

* canonical start user-day;
* exclusive end user-day;
* scope kind if meaningful;
* applicable user-day policy/version where necessary.

Do not base identity on UI component state.

---

## 23. Review Scope Kind

If useful for future Planner UX, allow a bounded semantic discriminator such as:

```text
day
week
month
custom
```

But do not let `month` imply calendar-midnight schedule semantics.

A month Review Scope may still resolve to canonical user-day boundaries.

---

## 24. Week Semantics

Where Review Scope represents a week:

* use effective DayFrame week-start preference;
* respect current per-cycle/segment architecture if applicable;
* do not assume Monday universally.

Preserve the existing user preference semantics.

---

## 25. Month Semantics

Where Review Scope represents a month:

Distinguish:

```text
calendar month selection
```

from:

```text
canonical user-day schedule boundaries
```

The visible month may be calendar-based for navigation while schedule intervals remain canonical user-days.

Do not solve Month Planner UI here.

---

## 26. Review Scope vs Proposal Horizon

A Proposal may be:

* fully inside Review Scope;
* partially intersecting Review Scope;
* outside Review Scope but still current.

Task 9.4 must define how read models handle this.

Preferred:

> Review Scope filters presentation. It does not invalidate otherwise current Proposal authority.

---

## 27. Review Scope vs Accepted Allocation

Accepted Allocation remains valid independent of the current Review Scope.

Changing the screen from one week/month to another must not stale acceptance.

---

## 28. Review Scope vs Realization

Realization remains valid independent of Review Scope.

Durable scheduled truth does not disappear because the user navigates elsewhere.

---

## 29. Preview Range Semantics

Preview Range remains the exact canonical user-day interval rendered by a generated Preview snapshot.

It may be derived from Review Scope for ordinary Planner use.

But the two remain separately typed concepts.

---

## 30. Review Scope → Preview Range Policy

Define a deterministic V1 conversion.

Preferred:

```text
Review Scope
→ requested Preview Range
```

with engine-specific effective context expansion remaining internal to generation.

The rendered Preview should correspond to the requested Preview Range, not all hidden planning context.

---

## 31. Preview Generation Context

Distinguish:

```text
requestedPreviewRange
effectivePreviewGenerationRange
```

if generation needs adjacent context.

Only the requested range should normally be considered visible Preview scope.

---

## 32. Preview Snapshot Metadata

A generated Preview should preserve enough metadata to answer:

* requested Preview Range;
* effective generation range if different;
* source Review Scope if generated from one;
* generated-at/freshness information;
* canonical user-day policy relevant to interpretation.

Do not make Review Scope authoritative merely by referencing it.

---

## 33. Preview Freshness and Review Navigation

Changing Review Scope alone must not necessarily make an existing Preview semantically stale.

Instead distinguish:

```text
Preview does not cover requested Review Scope
```

from:

```text
Preview is stale because authoritative planning data changed
```

These are different conditions.

---

## 34. Preview Coverage Status

Introduce a derived status materially equivalent to:

```text
covers
partiallyCovers
doesNotCover
```

for Preview Range relative to Review Scope.

Do not abuse `stale` for range mismatch.

---

## 35. Planning Data Freshness vs Preview Freshness

Preserve separation:

* Planning Data Horizon coverage/completeness;
* derived-data freshness;
* Preview freshness;
* Review Scope coverage.

One does not automatically substitute for another.

---

## 36. Publication Range Semantics

Publication Range is the exact canonical schedule range frozen by one publication action.

It must be explicit.

Do not publish “whatever happens to be loaded.”

---

## 37. Publication Range vs Review Scope

The user may choose to publish:

* the entire Review Scope;
* a subset;
* another explicit bounded range if existing workflow allows it.

Task 9.4 must not assume equality.

---

## 38. Publication Range vs Preview Range

Publication must use authoritative schedule truth.

It must not derive authority from Preview merely because the Preview covers the same dates.

Preview may support user review before publication.

Publication Range remains independently explicit.

---

## 39. Publication Range Coverage

Before publication, verify authoritative schedule truth can be materialized for the full requested Publication Range.

Do not silently clip to available Preview data.

---

## 40. Publication Boundary Context

If publication needs context outside the published range to correctly represent:

* overnight facts;
* canonical user-day attribution;
* support/Buffer relationships;

load that context without widening the immutable Publication Range.

---

## 41. Historical Scope Fidelity

HistoricalPlan must retain the exact Publication Range.

Later navigation or Review Scope changes cannot reinterpret what was published.

---

## 42. Planning Operation Context

Introduce a normalized planning operation context materially equivalent to:

```ts
PlanningScopeContextV1 {
  planningDataHorizon
  proposalHorizon?
  reviewScope?
  previewRange?
  publicationRange?
}
```

Do not require every operation to use every scope.

The context exists to make semantic differences explicit.

---

## 43. Operation-Specific Requirements

Define which scopes are required by each operation.

At minimum:

| Operation          | Planning Data Horizon |  Proposal Horizon |          Review Scope | Preview Range | Publication Range |
| ------------------ | --------------------: | ----------------: | --------------------: | ------------: | ----------------: |
| Demand Projection  |                   Yes |  Optional/context |                    No |            No |                No |
| Capacity           |                   Yes |                No |                    No |            No |                No |
| Feasibility        |                   Yes | Yes/bounded query |                    No |            No |                No |
| Allocation         |                   Yes |               Yes |                    No |            No |                No |
| Proposal           |                   Yes |               Yes | Optional presentation |            No |                No |
| Review Planner     |                   Yes |             Maybe |                   Yes |       Usually |                No |
| Preview Generation |         Yes/effective |                No |       Optional source |           Yes |                No |
| Publication        |         Yes/effective |                No |       Optional source |            No |               Yes |

Adjust only where existing architecture requires.

---

## 44. No God Range

Do not create a single global:

```text
currentDateRange
```

that every subsystem interprets differently.

This task exists specifically to prevent that.

---

## 45. Current Date / Today

Use injected/current canonical date context according to existing architecture.

Do not make “today” an implicit range input deep inside pure planning functions.

---

## 46. Pure Range Utilities

Create pure deterministic utilities for:

* validation;
* containment;
* intersection;
* equality;
* duration in user-days;
* expansion;
* clipping for **display only** where appropriate;
* coverage comparison.

Do not use display clipping to mutate planning authority.

---

## 47. Range Validation

Reject:

* end before start;
* zero-width range where operation requires at least one user-day;
* malformed canonical dates;
* unsupported scope kind;
* impossible policy combination.

Use structured validation.

---

## 48. Half-Open Semantics

Preferred invariant:

```text
[startUserDay, endUserDayExclusive)
```

Therefore:

```text
endA == startB
```

means touching scopes, not overlapping scopes.

Add tests.

---

## 49. Range Containment

Implement deterministic helpers equivalent to:

```text
containsRange(parent, child)
intersectsRange(a, b)
```

Use them instead of repeated ad hoc date comparisons.

---

## 50. Scope Provenance

Where derived from another scope, retain provenance such as:

```text
Review Scope
→ requested Preview Range
```

or:

```text
Review Scope
→ Proposal Horizon
```

only if such derivation actually occurs.

Do not manufacture provenance when the scopes were independently chosen.

---

## 51. Proposal Horizon Selection Policy

Inspect current Proposal generation.

Determine where Proposal Horizon currently originates.

Possible sources:

* explicit caller input;
* current preview/setup range;
* planning horizon;
* hardcoded default.

Normalize it into one explicit source.

Do not silently change product behavior unless required for correctness.

---

## 52. Review Scope Default Policy

Define a bounded deterministic default for current product behavior.

Prefer deriving from existing UI/setup semantics rather than inventing a new UX policy.

Examples might be:

* current preview range;
* current selected cycle;
* current week.

Codex must inspect current behavior first.

---

## 53. No New User Preference Without Evidence

Do not add a durable “default Review Scope” preference merely because the new type exists.

If no authored preference currently exists:

* use deterministic product default;
* keep it derived/session-level.

A new persistent preference requires explicit architectural justification.

---

## 54. Planning Data Horizon Derivation

Define one canonical resolver materially equivalent to:

```text
resolvePlanningDataHorizon(...)
```

Inputs may include:

* operation;
* Proposal Horizon;
* Review Scope;
* Preview Range;
* Publication Range;
* known footprint/context expansion requirements;
* canonical user-day policy.

Output:

* requested horizon;
* effective horizon;
* expansion reasons;
* coverage requirements.

---

## 55. Avoid Operation-Specific Magic Numbers

Do not scatter:

```text
minusDays(1)
plusDays(1)
plusDays(7)
```

through Proposal, Preview, Capacity, publication, and Planner code.

Centralize governed expansion semantics.

---

## 56. Existing One-Day Expansion Audit

The old engine expands schedule generation around planning windows.

Audit every such expansion.

For each:

1. identify why it exists;
2. determine whether it is canonical user-day context;
3. move/express it through the new scope resolver where appropriate;
4. preserve behavior with regression tests.

Do not delete unexplained expansion until evidence shows it is obsolete.

---

## 57. Footprint-Aware Horizon Expansion

Task 9.2.1 allows support/Buffer to extend around productive candidates.

Planning Data Horizon must account for the maximum exact footprint needed by the candidates under consideration.

Because the footprint is deterministic, horizon expansion must also be deterministic.

---

## 58. No Footprint Clipping

If support/Buffer extends beyond Planning Data Horizon coverage:

result must be:

```text
incomplete / unavailable / insufficientCoverage
```

or equivalent.

Never:

```text
drop support outside horizon
```

---

## 59. Accepted Liability Horizon

Accepted-but-unrealized liabilities from Task 9.3 must be visible whenever they intersect the effective Planning Data Horizon.

Do not require their originating Proposal Horizon to equal the current horizon.

---

## 60. Realized Schedule Horizon

Realized Goal/support/Buffer facts must be read by interval intersection with effective Planning Data Horizon.

Do not filter them by current Review Scope before Capacity reasoning.

---

## 61. Work Horizon

Work generation/read behavior must remain sufficient for the entire effective Planning Data Horizon plus governed boundary context.

Preserve overnight Work correctness.

---

## 62. Manual Event Horizon

Manual events intersecting effective Planning Data Horizon must participate regardless of Review Scope.

Review filtering happens later.

---

## 63. Composition Horizon

Required Task 8.4 support/Buffer semantics must remain complete at planning boundaries.

Do not lose attachments merely because the productive parent is near a visible scope edge.

---

## 64. Demand Projection Horizon

Demand Projection must explicitly know the bounded planning interval for which it projects Demand.

Do not infer from Preview.

---

## 65. Priority Boundary

Goal Priority remains independent of Review Scope.

Navigating to another range does not change Priority.

---

## 66. Feasibility Horizon

Feasibility must fail closed when the complete candidate footprint lacks sufficient Capacity coverage.

Preserve one-Demand semantics.

---

## 67. Competition Horizon

Competition compares feasible opportunities inside the bounded constructive planning operation.

Do not create competition merely because two unrelated opportunities exist elsewhere in the loaded Planning Data Horizon.

---

## 68. Allocation Horizon

Allocation remains bounded to its constructive planning input.

Do not treat the entire effective Planning Data Horizon as automatically allocatable.

---

## 69. Proposal Horizon Conservation

Every Proposal option must remain within its Proposal Horizon according to the productive-session authority rule.

Support/Buffer may extend outside only under the explicit complete-footprint rule from §18.

---

## 70. Acceptance Independence

Once accepted:

* Proposal Horizon remains provenance;
* current Review Scope does not affect validity;
* current Preview Range does not affect validity.

---

## 71. Realization Independence

Realization uses exact accepted geometry and current schedule authority.

It does not use current Review Scope as an applicability rule.

---

## 72. Schedule Read Model

Create or extend a planning read model that can answer for a Review Scope:

* authoritative scheduled facts in scope;
* realized Goal work/support/Buffer;
* accepted-but-unrealized liabilities relevant to scope;
* current Proposal options relevant to scope;
* Preview coverage/freshness;
* planning-data coverage;
* publication coverage/history where appropriate.

Do not turn the read model into a new authority store.

---

## 73. Planner Read Model Boundary

The read model may combine:

* authored truth;
* accepted authority;
* realized schedule truth;
* derived planning results;
* Preview status;
* publication history.

Every item must preserve its epistemic class.

Do not flatten all entries into generic “events.”

---

## 74. Scope Membership

Define explicit membership rules.

Examples:

### Scheduled fact

Included when its actual interval intersects Review Scope.

### Accepted liability

Included when any accepted claim intersects Review Scope.

### Proposal

Included according to Proposal Horizon/option intersection policy.

### Historical publication

Included when Publication Range/history intersects requested review context.

Document exact V1 rules.

---

## 75. Partial Intersection

A fact crossing Review Scope boundary remains one authoritative fact.

The read model may expose:

* full fact;
* visible clipped geometry separately.

Do not mutate the authoritative interval.

---

## 76. Display Geometry

If UI needs clipped geometry, define:

```text
authoritativeInterval
visibleInterval
```

separately.

This will be important for Month/Planner.

---

## 77. Cross-User-Day Display

A scheduled fact may intersect multiple display cells/user-days.

Do not duplicate its authority identity.

Multiple visual slices may point to one semantic fact.

---

## 78. Scope Coverage Model

Introduce an explicit derived coverage assessment.

At minimum distinguish:

```text
complete
partial
none
unknown
```

for relevant planning-data/read-model coverage.

Do not interpret missing data as empty schedule.

---

## 79. Unknown vs Empty

Mandatory:

```text
no events found
```

is not equivalent to:

```text
schedule data unavailable
```

or:

```text
planning horizon not loaded
```

Preserve epistemic integrity.

---

## 80. Proposal No-Result Semantics

When Proposal generation yields no Proposal, distinguish:

* no useful Proposal exists;
* insufficient Planning Data Horizon;
* incomplete Capacity coverage;
* no eligible Demand;
* no feasible opportunity;
* all relevant Demand already covered;
* scope excludes constructive action.

Reuse existing typed No-Proposal semantics where possible.

---

## 81. Review Scope Does Not Cause False No-Proposal

A Proposal outside current Review Scope may simply be hidden/not relevant to presentation.

Do not relabel it as nonexistent.

---

## 82. Scope Freshness

If a scope definition depends on authored user-day/week-start preferences and those preferences change:

* derived Review/Preview/planning scopes may require recomputation;
* historical Publication Range remains frozen under its historical interpretation.

Document freshness dependency.

---

## 83. Day-Boundary Change

Changing day boundary can materially change canonical user-day interpretation.

Current derived planning scopes must become stale/recomputed according to existing authored-edit semantics.

Do not reinterpret historical publications.

---

## 84. Week-Start Change

Changing week-start affects week Review Scope construction.

It must not mutate:

* existing Proposal Horizon bytes;
* Accepted Allocation;
* Realization;
* historical Publication Range.

---

## 85. Cycle/Segment Preference Changes

Audit current effective preference resolution.

Any scope that derives from per-cycle/per-segment settings must retain sufficient provenance/freshness to detect changes.

Do not duplicate preference-resolution logic.

---

## 86. Persistence Strategy

Determine which new scope concepts are durable.

Expected V1:

### Durable when semantically required

* Proposal Horizon — already frozen with Proposal;
* Publication Range — historical publication truth.

### Likely session/derived

* Planning Data Horizon;
* Review Scope;
* Preview effective generation range.

### Preview snapshot metadata

* requested Preview Range;
* effective generation range.

Do not persist ephemeral scopes without reason.

---

## 87. Review Scope Persistence

Prefer session/store state rather than durable authored setup unless current product behavior already persists the user's selected planning view.

If persistence is added, justify:

* semantic owner;
* restore behavior;
* backup behavior.

Do not turn navigation into authored planning authority.

---

## 88. Schema Decision

Task 9.3 baseline:

```text
IndexedDB schema 11
```

Expected:

```text
schema 11
```

because Task 9.4 should primarily normalize types/read models rather than add durable authority stores.

Any schema bump requires explicit evidence.

---

## 89. Backup Decision

Task 9.3 baseline:

```text
Backup V12
```

Expected:

```text
Backup V12
```

unless Task 9.4 introduces new durable semantic data not already preserved.

Do not bump Backup merely for derived/session scope types.

---

## 90. Migration

Legacy data must preserve existing range meanings.

Do not reinterpret an old Preview range as:

* Proposal Horizon;
* Review Scope;
* Publication Range

unless that meaning was explicitly true in the old record.

---

## 91. Historical Compatibility

Existing HistoricalPlan V1/V2/V3 records remain readable.

If older publication records lack explicit Publication Range metadata:

* derive only where the record itself contains enough immutable information;
* otherwise retain legacy/unknown scope semantics.

Do not infer from current Review Scope.

---

## 92. Proposal Compatibility

Existing Proposal records must remain readable.

If Proposal Horizon is already explicit, normalize adapters/types around it rather than rewriting history.

---

## 93. Preview Compatibility

Existing Preview snapshots should remain readable if persisted in current architecture.

Do not silently reinterpret old preview range fields under new semantics without migration/versioning.

---

## 94. Today Compatibility

Today should request an appropriate Review Scope/read scope without becoming the semantic owner of planning horizon.

No Today redesign.

---

## 95. Month Compatibility

Month should be able to request a month Review Scope from the new contract.

Do not implement the full future Month Planner in this task.

---

## 96. Review Schedule Compatibility

Review Schedule should be able to consume the normalized Review Scope/read model.

Do not perform its full UX evolution yet.

---

## 97. Planner Compatibility

The future Planner surface should be able to consume:

```text
Review Scope
+ planning coverage
+ scheduled facts
+ proposals
+ accepted liabilities
+ Preview status
```

without independently reconstructing temporal semantics.

---

## 98. Summary Boundary

Summary may later aggregate over a selected scope.

Do not make Summary responsible for defining Planning Data Horizon.

---

## 99. No New Scheduling Authority

None of the new scope types owns time.

They describe bounded reasoning/display/history intervals.

Do not add them to Friction as schedule subjects.

---

## 100. No New User Authority

Selecting:

* week;
* month;
* custom Review Scope

is navigation/review intent.

It is not authorization to schedule.

---

## 101. Determinism

Equivalent:

```text
scope inputs
+ authored canonical user-day/week policy
+ operation
+ bounded planning facts
```

must produce equivalent:

* requested/effective horizons;
* coverage status;
* Proposal bounds;
* Review membership;
* Preview range;
* Publication range validation.

---

## 102. Pure Date Handling

Use existing canonical date utilities.

Avoid raw local `Date` arithmetic where repository abstractions already exist.

Do not introduce timezone-dependent nondeterminism.

---

## 103. Range Serialization

Where scope values are persisted/snapshotted:

* use canonical date strings;
* explicit version/discriminator;
* exact start/end-exclusive convention.

---

## 104. Validation Surface

Add validators for all public scope types.

Reject semantic cross-use where practical.

Example:

A `PublicationRangeV1` should not accidentally satisfy a function requiring `ProposalHorizonV1` merely because fields match structurally.

Use branding/discriminators/wrappers consistent with the codebase.

---

## 105. Explainability

Provide inspectable explanation for:

* why Planning Data Horizon is wider than Review Scope;
* why Proposal Horizon differs from Review Scope;
* why Preview does not cover current Review Scope;
* why Proposal generation lacks sufficient coverage;
* what exact range will be published.

No LLM required.

---

## 106. Logging / Diagnostics

If existing diagnostics exist, expose scope names and bounds explicitly.

Prefer:

```text
Review Scope: 2026-09-07 → 2026-09-14
Planning Data Horizon: 2026-09-06 → 2026-09-15
```

over generic:

```text
range
```

Do not add noisy production logging solely for this task.

---

## 107. Required Focused Tests — Range Primitive

Test:

1. valid one-day range;
2. multi-day range;
3. zero-width rejection where prohibited;
4. reversed rejection;
5. containment;
6. partial intersection;
7. touching non-overlap;
8. equality;
9. deterministic expansion;
10. serialization.

---

## 108. Required Focused Tests — Canonical User-Day

Test:

1. non-midnight day boundary;
2. overnight Work;
3. support before/after productive work;
4. Buffer crossing calendar midnight;
5. adjacent canonical user-days;
6. week-start preference;
7. cycle/segment effective preference where applicable.

---

## 109. Required Focused Tests — Planning Data Horizon

Prove:

1. explicit requested horizon;
2. deterministic effective expansion;
3. expansion reasons;
4. complete footprint coverage;
5. insufficient coverage fails closed;
6. realized facts included by intersection;
7. accepted liabilities included by intersection;
8. Review Scope does not truncate planning data.

---

## 110. Required Focused Tests — Proposal Horizon

Prove:

1. productive Proposal geometry inside horizon;
2. support may extend outside under explicit rule;
3. Buffer may extend outside under explicit rule;
4. full footprint covered by Planning Data Horizon;
5. Proposal Horizon retained as provenance;
6. Review Scope changes do not stale accepted Proposal merely by navigation;
7. no recurrence implied.

---

## 111. Required Focused Tests — Review Scope

Prove:

1. changing Review Scope changes read membership;
2. no authority mutation;
3. Accepted Allocation unaffected;
4. Realization unaffected;
5. week respects configured week start;
6. month remains canonical-user-day aware;
7. partial intersections retain full authority identity;
8. visible clipping does not mutate fact.

---

## 112. Required Focused Tests — Preview Range

Prove:

1. Review Scope deterministically requests Preview Range;
2. effective generation context may be wider;
3. rendered range remains requested range;
4. coverage statuses are correct;
5. Review navigation mismatch is not `stale`;
6. authoritative changes still cause actual staleness;
7. realized facts reproduce after regeneration.

---

## 113. Required Focused Tests — Publication Range

Prove:

1. Publication Range explicit;
2. not inferred from Preview;
3. may differ from Review Scope;
4. sufficient authoritative schedule coverage required;
5. overnight/context data may be loaded without widening publication;
6. historical scope immutable;
7. restart produces identical range semantics.

---

## 114. Required Focused Tests — Unknown vs Empty

Prove:

```text
complete coverage + zero facts
≠
unknown/incomplete coverage
```

across:

* Planner read model;
* Proposal/No-Proposal;
* Preview coverage;
* publication readiness.

---

## 115. Required Focused Tests — Existing Engine

Preserve:

* existing preview generation;
* overnight handling;
* Work;
* manual events;
* templates;
* placement;
* Friction;
* SuggestedFix;
* realization fixed obstacles.

Any hidden range expansion moved into the new contract must produce equivalent scheduling behavior.

---

## 116. Required Focused Tests — Phase 8/9 Planning

Keep green:

* Demand Projection;
* Capacity;
* Feasibility;
* Competition;
* Allocation;
* Proposal;
* ProposalDecision;
* Accepted Allocation;
* accepted liabilities;
* Realization;
* realized scheduled truth.

No scope normalization may widen planning authority.

---

## 117. Required Focused Tests — Persistence

Prove:

* schema remains expected;
* Backup remains expected;
* restore preserves Proposal/Publication range truth;
* no ephemeral Planning Data Horizon persisted accidentally;
* no Review Scope enters profiles unless explicitly designed;
* migration does not invent semantics.

---

## 118. Full Regression

Keep all existing suites green.

Task 9.3 baseline:

```text
118 test files
1,063 tests
0 failures
```

Record final counts.

---

## 119. Required Validation Commands

Run repository-supported equivalents:

```bash
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
git diff --check
```

Also run focused scope/horizon/date/planning/publication suites.

---

## 120. Bundle Discipline

Task 9.3 baseline:

* initial raw: **655,722 bytes**
* initial gzip: **167,447 bytes**
* largest lazy: **53,187 bytes**
* total: **927,513 bytes**

Existing warnings remain governed.

Requirements:

1. scope/date utilities remain lightweight;
2. no heavy new dependency;
3. no broad eager Planner UI implementation;
4. reuse existing canonical date utilities;
5. record before/after metrics;
6. pass hard limits.

---

## 121. Performance

Scope operations should be:

* bounded;
* pure;
* linear or better over relevant facts.

Do not scan all history when only one Review Scope is requested.

Use existing range/index facilities where available.

---

## 122. Accessibility

No major interactive UI is required.

If existing range controls gain scope labels/status:

* use meaningful text;
* expose coverage/freshness distinctions accessibly;
* do not communicate state by color alone.

---

## 123. Required V1 Design Decision Table

Include:

| Question                           | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ---------------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| canonical range convention         |             |                     |                    |                     |
| shared range primitive             |             |                     |                    |                     |
| Planning Data Horizon              |             |                     |                    |                     |
| requested/effective horizon        |             |                     |                    |                     |
| expansion policy                   |             |                     |                    |                     |
| Proposal Horizon                   |             |                     |                    |                     |
| footprint outside Proposal Horizon |             |                     |                    |                     |
| Review Scope                       |             |                     |                    |                     |
| Review default                     |             |                     |                    |                     |
| week construction                  |             |                     |                    |                     |
| month construction                 |             |                     |                    |                     |
| Preview Range                      |             |                     |                    |                     |
| Preview coverage                   |             |                     |                    |                     |
| Publication Range                  |             |                     |                    |                     |
| unknown vs empty                   |             |                     |                    |                     |
| read-model membership              |             |                     |                    |                     |
| visible clipping                   |             |                     |                    |                     |
| persistence                        |             |                     |                    |                     |
| schema                             |             |                     |                    |                     |
| backup                             |             |                     |                    |                     |

---

## 124. Required Scope Relationship Matrix

Include:

| Relationship                                | Required Rule                                      |
| ------------------------------------------- | -------------------------------------------------- |
| Proposal Horizon vs Planning Data Horizon   | Proposal requires sufficient planning coverage     |
| Review Scope vs Planning Data Horizon       | Review may be narrower                             |
| Review Scope vs Proposal Horizon            | Independent; presentation may filter               |
| Review Scope vs Preview Range               | Deterministic requested-range mapping allowed      |
| Preview Range vs effective generation range | Effective context may be wider                     |
| Publication Range vs Review Scope           | Independent explicit scope                         |
| Publication Range vs Preview Range          | Publication does not derive authority from Preview |
| realized schedule vs Review Scope           | Authority independent; presentation filtered       |
| accepted liability vs Review Scope          | Authority independent; presentation filtered       |

---

## 125. Required Operation Matrix

Include final implemented requirements for:

| Operation          | Required Scope Inputs | Produced Scope | Authority Effect   |
| ------------------ | --------------------- | -------------- | ------------------ |
| Demand Projection  |                       |                | None               |
| Capacity           |                       |                | None               |
| Feasibility        |                       |                | None               |
| Competition        |                       |                | None               |
| Allocation         |                       |                | None               |
| Proposal           |                       |                | Proposed only      |
| Review read model  |                       |                | None               |
| Preview generation |                       |                | None               |
| Acceptance         |                       |                | Accepted authority |
| Realization        |                       |                | Scheduled reality  |
| Publication        |                       |                | Immutable history  |

---

## 126. Required Coverage Matrix

Include at minimum:

| State    | Meaning                        | May Treat Missing Facts as Empty? |
| -------- | ------------------------------ | --------------------------------: |
| complete | full required data available   |                               Yes |
| partial  | some required span unavailable |                                No |
| none     | no required span available     |                                No |
| unknown  | coverage cannot be established |                                No |

---

## 127. Required Persistence Matrix

Include:

| Scope                 |                   Durable? | Semantic Owner             |                                   Backup? | Historical? |
| --------------------- | -------------------------: | -------------------------- | ----------------------------------------: | ----------: |
| Planning Data Horizon |                expected No | planning operation         |                                        No |          No |
| Proposal Horizon      | Yes as Proposal provenance | Proposal authority/history |                                       Yes |         Yes |
| Review Scope          |   expected session/derived | Planner/read state         |                                Usually No |          No |
| Preview Range         |  Preview snapshot metadata | Preview                    | according to existing Preview persistence |          No |
| Publication Range     |                        Yes | HistoricalPlan/publication |                                       Yes |         Yes |

Adjust only with evidence.

---

## 128. Required Invariants

Explicitly verify:

1. Planning Data Horizon is not Review Scope.
2. Planning Data Horizon is not Proposal Horizon.
3. Planning Data Horizon is not Preview Range.
4. Planning Data Horizon is not Publication Range.
5. Proposal Horizon is not Review Scope.
6. Proposal Horizon is not Preview Range.
7. Proposal Horizon is not Publication Range.
8. Review Scope is not Preview Range even when bounds match.
9. Review Scope is not Publication Range.
10. Preview Range is not Publication Range.
11. all current scopes use canonical user-day semantics.
12. ranges use one governed boundary convention.
13. touching half-open ranges do not overlap.
14. Planning Data Horizon is finite.
15. effective planning expansion is deterministic.
16. expansion reasons are explainable.
17. hidden magic expansion is minimized/centralized.
18. Proposal requires sufficient planning-data coverage.
19. complete Proposal footprint must be covered.
20. support outside Proposal Horizon is not clipped.
21. Buffer outside Proposal Horizon is not clipped.
22. support outside Proposal Horizon does not silently widen productive authority.
23. Review Scope owns no schedule authority.
24. changing Review Scope does not mutate Goal.
25. changing Review Scope does not mutate Demand.
26. changing Review Scope does not mutate Priority.
27. changing Review Scope does not mutate Proposal.
28. changing Review Scope does not mutate Accepted Allocation.
29. changing Review Scope does not mutate Realization.
30. changing Review Scope does not publish.
31. Preview remains derived.
32. Preview coverage mismatch is distinct from stale Preview.
33. effective Preview generation context may exceed visible Preview Range.
34. publication uses authoritative schedule truth.
35. publication does not use Preview as authority.
36. Publication Range is explicit.
37. historical Publication Range is immutable.
38. no historical scope is reinterpreted from current navigation.
39. accepted liabilities are independent of Review Scope.
40. realized facts are independent of Review Scope.
41. Capacity reasoning uses Planning Data Horizon, not display filtering.
42. Demand Projection does not infer its horizon from Preview.
43. Feasibility fails closed on incomplete footprint coverage.
44. Competition remains bounded to relevant feasible opportunities.
45. Allocation does not allocate the entire loaded horizon automatically.
46. Proposal conserves its explicit horizon.
47. acceptance conserves Proposal provenance.
48. realization ignores current Review Scope for authority.
49. no scope type owns time.
50. no scope selection creates user authorization.
51. unknown coverage is not empty schedule.
52. partial coverage is not empty schedule.
53. no Proposal due to insufficient coverage is distinguishable from no useful Proposal.
54. authoritative intervals are not clipped for display.
55. visible intervals may be clipped separately.
56. cross-scope visual slices retain one authority identity.
57. week scope respects effective week start.
58. month navigation does not introduce calendar-midnight schedule semantics.
59. day-boundary changes stale/recompute current derived scopes appropriately.
60. week-start changes do not rewrite historical authority.
61. cycle/segment preference resolution is reused, not duplicated.
62. ephemeral scope state is not persisted as authored setup without justification.
63. profiles do not accidentally capture Review Scope.
64. schema changes are evidence-driven.
65. backup changes are evidence-driven.
66. old Proposal history remains readable.
67. old publication history remains readable.
68. old Preview behavior remains compatible.
69. realization fixed authority remains intact.
70. DF-006 remains closed.
71. equivalent scope inputs produce equivalent results.
72. date arithmetic remains deterministic.
73. no new recurrence is introduced.
74. no new planning authority is introduced.
75. future Planner/Month/Review Schedule can consume the normalized contract without redefining scope semantics.

---

## 129. Stop / Architecture-Reopen Conditions

Stop and report if:

* existing Proposal Horizon has contradictory meanings in different code paths;
* Preview range is currently used as hidden planning authority that cannot be separated without redesign;
* publication cannot establish an explicit immutable range;
* Planning Data Horizon cannot be bounded deterministically;
* support/Buffer coverage requires unbounded lookahead;
* canonical user-day policy cannot construct stable Review Scope boundaries;
* per-cycle/segment preference resolution produces ambiguous week boundaries;
* accepted liabilities cannot be queried independently of display scope;
* realized schedule truth cannot be read independently of Preview;
* old persisted records contain irreconcilable range meanings.

Do not paper over ambiguity with one generic range type.

---

## 130. Governance

Update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` for genuine durable decisions including:

* canonical scope taxonomy;
* half-open user-day range convention;
* Planning Data Horizon expansion policy;
* Proposal-Horizon/footprint boundary rule;
* Review Scope authority boundary;
* Preview coverage vs freshness distinction;
* Publication Range independence.

Do not rewrite completed Phase 8/9 RESULT artifacts.

---

## 131. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve cumulative Phase 9 work;
3. preserve unrelated changes;
4. do not clean/reset;
5. do not discard 9.1–9.3 work;
6. do not commit;
7. do not push unless explicitly instructed.

Report repository state.

---

## 132. Required RESULT Artifact

Create:

```text
TASK_9.4_PLANNING_HORIZON_REVIEW_SCOPE_CONVERGENCE_V1_RESULT.md
```

Filename must contain **`RESULT`**.

Place it in the dedicated Phase 9 implementation-results folder.

---

## 133. Required RESULT Sections

The RESULT must include at minimum:

1. Executive Result
2. Starting Baseline
3. Governing Foundations
4. Scope Delivered
5. Explicit Non-Goals
6. Temporal Scope Taxonomy
7. Canonical User-Day Rule
8. Range Convention
9. Shared Range Primitive
10. Planning Data Horizon Definition
11. Requested Planning Horizon
12. Effective Planning Horizon
13. Expansion Policy
14. Expansion Provenance
15. Boundedness
16. Proposal Horizon Definition
17. Proposal Coverage Requirement
18. Complete Footprint Coverage
19. Proposal/Footprint Boundary
20. Proposal Provenance
21. Review Scope Definition
22. Review Scope Authority Boundary
23. Review Scope Identity
24. Review Scope Kind
25. Week Construction
26. Month Construction
27. Review/Proposal Relationship
28. Review/Accepted Relationship
29. Review/Realization Relationship
30. Preview Range Definition
31. Review→Preview Policy
32. Effective Preview Generation Context
33. Preview Metadata
34. Preview Coverage Status
35. Coverage vs Freshness
36. Publication Range Definition
37. Publication/Review Relationship
38. Publication/Preview Relationship
39. Publication Coverage
40. Publication Context Expansion
41. Historical Scope Fidelity
42. Planning Operation Context
43. Operation Requirements
44. Current-Date Handling
45. Range Utilities
46. Range Validation
47. Containment/Intersection
48. Scope Provenance
49. Proposal Horizon Source
50. Review Scope Default
51. Persistence of Review State
52. Planning Horizon Resolver
53. Existing Expansion Audit
54. Footprint-Aware Expansion
55. Insufficient Coverage Behavior
56. Accepted Liability Horizon
57. Realized Schedule Horizon
58. Work Horizon
59. Manual Event Horizon
60. Composition Horizon
61. Demand Projection Horizon
62. Feasibility Horizon
63. Competition Horizon
64. Allocation Horizon
65. Proposal Horizon Conservation
66. Acceptance Independence
67. Realization Independence
68. Planner Read Model
69. Read-Model Epistemic Classes
70. Scope Membership
71. Partial Intersection
72. Display Geometry
73. Cross-User-Day Display
74. Coverage Model
75. Unknown vs Empty
76. No-Proposal Semantics
77. Scope Freshness
78. Day-Boundary Changes
79. Week-Start Changes
80. Cycle/Segment Preference Changes
81. Persistence Strategy
82. Schema Decision
83. Backup Decision
84. Migration
85. Historical Compatibility
86. Proposal Compatibility
87. Preview Compatibility
88. Today Compatibility
89. Month Compatibility
90. Review Schedule Compatibility
91. Planner Compatibility
92. Summary Boundary
93. Authority Boundary
94. Determinism
95. Date Handling
96. Serialization
97. Validation
98. Explainability
99. Diagnostics
100. Range Tests
101. Canonical User-Day Tests
102. Planning Horizon Tests
103. Proposal Horizon Tests
104. Review Scope Tests
105. Preview Range Tests
106. Publication Range Tests
107. Unknown/Empty Tests
108. Engine Regression
109. Phase 8/9 Planning Regression
110. Persistence Regression
111. Full Regression
112. Validation Commands
113. Bundle Architecture Review
114. Performance
115. Accessibility
116. V1 Design Decision Table
117. Scope Relationship Matrix
118. Operation Matrix
119. Coverage Matrix
120. Persistence Matrix
121. Invariant Verification
122. Deviations
123. Governance Updates
124. Repository Status
125. Critical-Path Assessment
126. Planner Readiness Assessment
127. Recommended Next Task
128. Completion Statement

---

## 134. Critical-Path Assessment

The RESULT must explicitly answer:

> **Does DayFrame now have one coherent temporal-scope contract capable of supporting constructive planning, review, Preview, realization-aware schedule inspection, and publication without conflating data coverage, proposed authority, visible review range, derived Preview range, or historical publication scope?**

Expected answer:

> **Yes.**

If not, do not proceed directly into Planner UI work.

---

## 135. Planner Readiness Assessment

The RESULT must assess whether future Planner/Month/Review Schedule surfaces can now consume:

```text
Review Scope
→ planning coverage
→ scheduled reality
→ accepted liabilities
→ constructive Proposal state
→ Preview coverage/freshness
→ publication state
```

without implementing their own competing date/range logic.

Expected:

> **Yes, with UX/presentation work remaining.**

---

## 136. Expected Next Task

If Task 9.4 completes cleanly, inspect the roadmap/current code before naming the exact task.

Expected next area:

> **Month / Planner Evolution**

followed by:

> **Review Schedule Evolution**

The next task should consume the Task 9.4 scope/read-model contract rather than creating another date-range system.

---

## 137. Final Completion Statement

The Task 9.4 RESULT must end with a completion statement materially equivalent to:

> **Task 9.4 — Planning Data Horizon, Proposal Horizon, and Review Scope Convergence V1 complete.**
>
> DayFrame now has one explicit canonical user-day temporal-scope architecture for constructive planning and review without collapsing semantically different ranges into one generic date window: Planning Data Horizon defines the finite authoritative/derived data span required for trustworthy planning computation and distinguishes requested bounds from deterministic effective context expansion; Proposal Horizon remains the bounded proposed-authority interval within which productive Goal action may be offered while complete required support and Buffer footprints may extend beyond that interval only when the wider Planning Data Horizon fully covers them; Review Scope is a non-authoritative user inspection context whose day/week/month/custom geometry respects canonical DayFrame user-days and effective week-start semantics without mutating Goal, Demand, Priority, Proposal, Accepted Allocation, Realization, or schedule truth; Preview Range is an explicit disposable rendering scope derived from Review Scope where appropriate and is distinguished from wider Preview-generation context, while range coverage is modeled separately from semantic Preview freshness; Publication Range is an explicit immutable historical scope derived from authoritative schedule truth rather than Preview and may differ from both Review Scope and Preview Range; bounded range utilities, validation, half-open semantics, provenance, coverage states, unknown-versus-empty handling, footprint-aware context expansion, accepted-liability and realized-schedule inclusion, deterministic read-model membership, visible-versus-authoritative interval geometry, persistence/version compatibility, and canonical date handling prevent UI navigation from becoming planning authority or hidden engine policy; existing Demand Projection, Capacity, Feasibility, Competition, Allocation, Proposal, acceptance, Realization, Preview, Friction, publication, Work, manual-event, Composition, user-day, profile, Backup V12, schema 11, and DF-006 semantics remain intact; future Planner, Month, Today, Review Schedule, and Summary surfaces can consume the normalized Review Scope and planning read model without reconstructing or redefining temporal scope semantics; no new recurrence, scheduling authority, acceptance authority, execution, Progress, Live adaptation, or learning behavior is introduced; the ordinary planning engine now has the temporal-scope foundation required for Phase 9 Planner/Month and Review Schedule evolution.
