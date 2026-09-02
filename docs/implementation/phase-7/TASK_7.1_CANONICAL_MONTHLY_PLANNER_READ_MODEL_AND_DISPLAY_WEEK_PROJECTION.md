# Task 7.1 — Canonical Monthly Planner Read Model and Display-Week Projection

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Pure Monthly Planner application read model, canonical civil-month grid projection, display-week anchor policy implementation, selected canonical user-day projection, Preview coverage/freshness classification, deterministic month-cell evidence summaries, exact contextual targets, overflow policy foundation, clone isolation, performance-bounded indexing, property/invariant testing, bundle-safe integration preparation, and governance.

**This task does not build the visible Month Calendar UI, change Planner navigation, migrate Plan/Review Schedule, add writes, modify scheduler behavior, introduce new authority, or implement contextual editing.**

---

# 1. Objective

Implement the canonical pure read model that will power DayFrame's future Monthly Planner.

The read model must answer, deterministically:

> **For this displayed month, what civil-date labels belong in the 35/42-cell visual grid, what planning evidence does DayFrame currently have for each label, what is the selected canonical user-day, what display-week policy applies, and what exact current interaction targets can later be exposed safely?**

Conceptually:

```text
authoritative / derived current inputs
        ↓
queryMonthlyPlanner(...)
        ↓
MonthlyPlannerReadModel
        ├── displayed month
        ├── display-week anchor
        ├── 35/42 canonical cells
        ├── coverage / freshness
        ├── compact evidence summaries
        ├── attention summaries
        ├── exact contextual targets
        └── selected canonical user-day detail
```

The result must remain a **pure projection**.

No write occurs by querying Month.

---

# 2. Governing Phase 7 Audit

Treat Phase 7 Audit 01 as governing.

It established:

* Month becomes Planner's dominant future spatial/navigation surface.
* Plan / Review Schedule are transitional presentation boundaries.
* Month is not a new authority.
* Preview supplies current generated planning geometry.
* Active authored state supplies exact current sources, Events, temporal preferences, and planning configuration.
* HistoricalPlan does not backfill Month cells.
* Today remains execution reporting.
* Summary remains historical interpretation.
* selected civil label `D` resolves to canonical user-day `[start(D), start(D+1))`.
* Month visual rows do not define canonical user-weeks.
* one display-week anchor is resolved from the effective `weekStartsOn` for the first label of the displayed month.
* generated-empty, uncovered, stale, and protected/unavailable remain distinct.
* direct placement, drag/drop, and implicit scheduling writes remain prohibited.
* total-JS bundle headroom is extremely constrained, so implementation must reuse existing domain/application behavior rather than duplicate it.

Do not reopen these decisions unless implementation evidence triggers a stop condition.

---

# 3. Governing Read-Model Principle

> **The Monthly Planner read model projects existing truth. It does not manufacture planning truth.**

The query may classify, group, sort, and summarize existing evidence.

It must not:

* generate a schedule;
* publish HistoricalPlan;
* change authored state;
* apply PlanDecision;
* infer execution;
* infer Capacity;
* infer Goal success;
* infer Recommendations;
* infer availability from emptiness;
* create durable Month state.

---

# 4. Governing Temporal Principle

For every local civil date label `D`:

```text
prefs(D)
    = effective authored schedule preferences for D

start(D)
    = local calendar date D
      at prefs(D).dayBoundaryStartTime

userDay(D)
    = [start(D), start(D+1))
```

The month grid uses civil-date labels spatially.

The selected-day read model uses canonical DayFrame user-day geometry.

Do not define cell ownership by:

* civil midnight;
* 24 elapsed hours;
* occurrence clock date alone.

---

# 5. Governing Month Principle

A displayed month `M` is a **presentation horizon**.

It is not:

* a schedule-generation horizon;
* a publication boundary;
* a recurrence authority;
* a user-week authority;
* a Capacity period;
* an Allocation period.

The core labels of `M` are those whose civil year/month match the displayed heading.

Adjacent civil labels may be included only to complete visual rows.

---

# 6. Governing Display-Week Principle

For displayed month `M`:

```text
displayWeekAnchor(M)
    = effective weekStartsOn
      resolved for label M-01
```

This anchor governs:

* weekday column order;
* leading/trailing adjacent labels;
* visual row construction.

It does **not** govern canonical user-week identity for every label in the month.

If effective `weekStartsOn` changes inside the displayed month:

* visual columns remain fixed;
* per-label canonical user-week semantics continue independently;
* the read model may surface a transition fact;
* it must not rotate columns midway through the month.

---

# 7. Governing Coverage Principle

At cell level, distinguish at minimum:

### Covered — fresh

Preview contains generated coverage for that canonical user-day under the current fresh Preview.

### Covered — stale

Preview contains generated coverage, but the Preview predates current saved authored scheduling state according to existing staleness semantics.

### Uncovered

No current Preview coverage exists for that canonical user-day.

### Protected / unavailable

Relevant planning source is unavailable/protected such that truthful projection cannot classify normal coverage.

Do not collapse these states.

---

# 8. Governing Empty-Day Principle

A generated-empty day means:

> Preview covers this canonical user-day and no visible planned occurrences / relevant day attention are present.

It does **not** mean:

* free time;
* available Capacity;
* no commitments exist;
* user did nothing;
* no historical evidence exists.

An uncovered day is not generated-empty.

---

# 9. Governing Exact-Identity Principle

Any contextual target returned by the read model must retain exact canonical identity.

For Commitment-backed evidence, preserve the exact identity contract established in Task 6.10.

For Events, preserve exact Event identity/incarnation.

For Work, expose only the composite Work-context target supported by current architecture.

Never construct contextual targets from:

* title;
* displayed time;
* cell position;
* visual kind alone.

---

# 10. Explicit Scope

Implement:

* pure Month query/read model;
* displayed-month validation;
* 35/42-cell civil grid projection;
* display-week anchor;
* weekday-column ordering;
* adjacent-month labels;
* canonical selected-user-day projection;
* canonical current-user-day marker;
* Preview coverage classification;
* stale coverage classification;
* generated-empty classification;
* protected/unavailable classification where current authority contracts permit;
* scheduled Work summaries;
* scheduled Commitment summaries;
* Sleep-as-Commitment summaries;
* Event summaries;
* all-day Event semantics;
* friction / Needs-attention summaries;
* unplaced Month-level summary;
* deterministic cell ordering;
* fixed overflow/token-budget data model;
* exact contextual target projection;
* week-start transition metadata;
* variable-duration selected-day metadata;
* clone isolation;
* deterministic ordering;
* input-order independence;
* bounded performance/indexing;
* focused tests;
* property/invariant tests;
* bundle-safe module placement;
* governance.

---

# 11. Explicit Non-Goals

Do not implement:

* visible Month Calendar UI;
* Planner Month mode;
* removal of Plan / Review Schedule tabs;
* month navigation buttons;
* keyboard grid interaction;
* contextual workspace UI;
* Add/Edit Commitment UI changes;
* Add/Edit Event changes;
* Work UI changes;
* friction UI changes;
* drag/drop;
* direct occurrence placement;
* direct time editing;
* scheduler changes;
* schedule auto-generation;
* HistoricalPlan backfill;
* Today outcome projection into Month;
* Summary progress projection into Month;
* Capacity;
* Planned Allocation;
* Recommendations;
* Goal ranking;
* transition adaptation;
* Pattern Library;
* new persistence;
* new Backup version;
* new runtime dependency.

---

# 12. Execution Artifact Rules

Before implementation:

1. verify this Task 7.1 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Phase 7 Audit 01 result;
   * Task 6.3B canonical user-day implementation;
   * Task 6.6 Review Schedule read/presentation behavior;
   * Task 6.8 contextual occurrence identity;
   * Task 6.10 exact Commitment incarnation handling;
   * `PreviewScreen`;
   * Preview types;
   * `PlannerSurface`;
   * `DayFrameApp`;
   * manual Event types;
   * Work/cycle projections;
   * friction types;
   * unplaced candidate types;
   * effective preference resolver;
   * user-week resolver;
   * current bundle configuration;
5. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-7/TASK_7.1_CANONICAL_MONTHLY_PLANNER_READ_MODEL_AND_DISPLAY_WEEK_PROJECTION_RESULT.md`

---

# 13. Mandatory Initial Source Audit

Before creating new types, trace the actual current shapes supplying:

* scheduled Work;
* scheduled Commitments;
* Sleep;
* Events;
* all-day Event flags;
* `userDayDate`;
* Preview range/coverage;
* Preview freshness/staleness;
* unplaced candidates;
* friction points;
* suggested fixes / Resolution targets;
* exact authored source references;
* exact source incarnations;
* current canonical user-day;
* effective `weekStartsOn`;
* day boundary transitions;
* protected/unavailable planning state.

Document which evidence is already directly available and which requires pure derivation.

Do not duplicate fields already canonical elsewhere unless the read model needs an owned presentation copy.

---

# 14. Query Placement

Prefer a pure application/core projection module appropriate to existing architecture.

Candidate naming may resemble:

```text
queryMonthlyPlanner(...)
projectMonthlyPlanner(...)
buildMonthlyPlannerReadModel(...)
```

Use repository conventions.

The query must not live inside a React component.

The query must not read browser globals directly.

---

# 15. Query Contract Audit

Define the smallest explicit input contract.

Likely inputs may include:

* displayed civil month;
* selected user-day label;
* evaluation instant / canonical current instant;
* authored scheduling snapshot or temporal resolver inputs;
* current Preview;
* Event/current exact-source state if Preview alone is insufficient;
* protection/availability state.

Do not accept an entire application store merely for convenience if a bounded contract is practical.

Document chosen contract and rejected alternatives.

---

# 16. Displayed Month Input

Represent displayed month canonically.

Acceptable forms may include:

```text
{ year: 2026, month: 8 }
```

or canonical month label:

```text
"2026-08"
```

Use existing repository conventions if available.

Reject malformed month input explicitly.

Do not rely on locale-formatted month names as identity.

---

# 17. Selected Label Input

The selected day must be a canonical civil-date label.

If selected label is outside the displayed month but is a visible adjacent-month cell:

the read model may still represent it.

Do not silently clamp selected labels unless the API contract explicitly requires it.

Document behavior.

---

# 18. Evaluation Instant

If current-user-day marking depends on `now`, require an explicit canonical evaluation instant.

Do not call `new Date()` inside the pure projection.

This makes output deterministic and testable.

---

# 19. Display-Week Anchor Resolution

For displayed month `M`:

1. construct label `M-01`;
2. resolve effective schedule preferences for that label;
3. extract `weekStartsOn`;
4. freeze that value as the display-week anchor for this read-model result.

Return the anchor explicitly.

Do not recompute column order per row.

---

# 20. Weekday Columns

Return deterministic weekday column metadata.

Conceptually:

```text
weekdayColumns: [
    { canonicalWeekday: ... },
    ...
]
```

The order begins from the display-week anchor.

Do not tie these columns to canonical per-label user-week membership.

---

# 21. Grid Cell Count

Return a complete visual grid of either:

* 35 cells;
* or 42 cells;

depending on the month layout.

Determine the exact rule mechanically.

Preferred baseline:

> minimum complete week rows required to contain the month, with adjacent labels filling edges.

If six rows are always required by future UI policy, do **not** invent that here unless the audit or existing product rule requires it.

Task 7.1 may return 35 or 42 according to calendar geometry.

---

# 22. Grid Start

Calculate the first visible civil label from:

* first day of displayed month;
* display-week anchor.

Do not use canonical user-week boundaries for this calculation.

This is visual calendar geometry.

---

# 23. Grid End

Return the final adjacent label required to complete the final visual row.

Ensure:

```text
cells.length % 7 === 0
```

and:

```text
cells.length ∈ {35, 42}
```

unless source evidence proves another legitimate size.

---

# 24. Cell Identity

Each cell must have stable identity based on its civil-date label.

Do not create random IDs.

Recommended identity:

```text
YYYY-MM-DD
```

or existing canonical date-label form.

---

# 25. Cell Month Membership

Each cell should expose whether it belongs to:

* previous adjacent month;
* displayed month;
* next adjacent month.

Do not derive this in UI repeatedly.

---

# 26. Canonical User-Day Window

For each cell label `D`, resolve canonical:

```text
start(D)
end(D) = start(D+1)
duration
effective preferences
```

At minimum return enough to support:

* selected-day truth;
* current-user-day marker;
* boundary-transition metadata;
* later UI accessibility copy.

If computing every full window would create unnecessary cost, index/cache pure resolver results inside the query.

Do not sacrifice semantics for premature optimization.

---

# 27. Variable-Duration Metadata

Expose canonical duration for each cell or at minimum selected cell if architecture favors compact cells.

The selected-day projection must definitely expose:

* start;
* end;
* duration;
* boundary;
* effective week start.

Do not round duration to 24 hours.

---

# 28. Current User-Day Marker

Resolve the canonical current user-day label from the explicit evaluation instant.

The current marker belongs to the label whose canonical window contains that instant.

It may differ from the civil calendar date before/after a non-midnight boundary.

Do not use:

```text
evaluationInstant.toDateString()
```

as current-cell truth.

---

# 29. Coverage Source Audit

Determine how Preview currently proves coverage.

The read model must mechanically distinguish:

* day covered by Preview;
* day outside Preview coverage;
* covered day with zero occurrences.

Do not infer coverage only from occurrence presence.

If Preview lacks explicit enough range/day evidence to distinguish generated-empty from uncovered, stop and report.

This is a mandatory stop condition.

---

# 30. Freshness

Use the existing canonical Preview stale/fresh state.

Do not recompute staleness heuristically from timestamps or object equality.

Return freshness at:

* Month/read-model level;
* covered cell level if useful.

A stale covered cell remains covered.

---

# 31. Cell Coverage State

Prefer an explicit discriminated union, conceptually:

```text
coverage:
    | { kind: "coveredFresh" }
    | { kind: "coveredStale" }
    | { kind: "uncovered" }
    | { kind: "unavailableProtected"; ... }
```

Use actual repository terminology.

Do not encode epistemic distinctions only as booleans such as:

```text
hasSchedule: false
```

---

# 32. Generated-Empty State

For a covered day with no relevant visible scheduled evidence:

return an explicit known-empty state or a coverage state plus zero collections.

The UI must later be able to say:

> Covered · No planned items

without confusing it with uncovered.

---

# 33. Preview Occurrence Ownership

Assign each Preview scheduled occurrence to exactly one Month cell using its canonical authoritative `userDayDate` / equivalent plan membership.

Do not reassign using `startsAt` civil date.

Do not duplicate it because it crosses midnight.

---

# 34. Manual Event Ownership

Project Events under the canonical owning user-day label already established by Event semantics.

All-day Events appear once under that label.

Timed cross-midnight Events remain once under authoritative owning label unless current event projection explicitly creates multiple owned occurrences.

Do not split them in Month.

---

# 35. Work Projection

Project Work from Preview as read-only planned geometry.

Cell summary may include:

* count;
* compact first token;
* exact selected-day collection.

Do not create editable Work occurrence authority.

Contextual target should point only to the existing Work configuration intent if supported.

---

# 36. Commitment Projection

Project scheduled Commitment occurrences.

Each projected interaction target must retain exact current-source identity where Preview already carries it.

At minimum preserve the Task 6.10 exact template + recurrence incarnation contract.

Do not derive editability from title or current logical ID alone.

---

# 37. Sleep Projection

Sleep remains a Commitment-backed occurrence.

It may expose a presentation kind/category for future Month rendering.

Do not create separate Sleep authority.

---

# 38. Event Projection

Events may be sourced from Preview scheduled geometry and/or canonical Event state according to existing architecture.

Audit the narrowest truthful source.

Each Event summary should retain:

* exact identity;
* incarnation;
* all-day/timed intent where current state makes it known;
* owning user-day label;
* time geometry.

Do not consult HistoricalPlan for current Planner Event truth.

---

# 39. All-Day Event Semantics

For explicit all-day Events:

return semantic timing kind:

```text
allDay
```

rather than asking future UI to infer from duration.

Do not convert to midnight endpoints.

---

# 40. Friction Projection

Project current Preview friction into Month.

At cell level likely return:

* attention count;
* whether Needs attention exists;
* exact friction IDs/targets for selected-day detail where needed.

Do not expose Recommendation ranking.

Do not evaluate Goal priority.

---

# 41. Friction Cell Ownership

Determine which cell(s) receive an attention marker.

Use the canonical day ownership encoded by friction participants / Preview evidence.

Avoid duplicating a single friction issue into many cells unless the domain explicitly associates it with multiple user-days.

Document the chosen rule.

---

# 42. Unplaced Projection

Unplaced candidates may not always have a canonical day suitable for one cell.

Produce:

### Month-level unplaced summary

always when relevant.

### Cell-level unplaced summary

only when canonical candidate evidence gives a truthful owning/candidate user-day label.

Do not invent a cell assignment from preferred time or title.

---

# 43. Month-Level Attention Summary

Return a bounded summary such as:

* total friction count;
* total unplaced count;
* stale status;
* uncovered visible-day count;
* protected/unavailable indicator.

This supports the future Planner header/attention tray.

Do not infer severity ranking unless domain already defines one.

---

# 44. Cell Evidence Collections

Each cell may expose semantic collections such as:

```text
allDayEvents
timedEvents
work
commitments
attention
```

or a normalized token collection.

Choose the shape that best supports deterministic UI without duplicating domain models.

Document the decision.

---

# 45. Cell Presentation Tokens

Task 7.1 may define a pure compact token projection for future Month cells.

A token may contain:

* semantic kind;
* label;
* optional compact time;
* exact interaction target;
* stable ordering key.

Do not introduce styling information such as colors into the core read model unless existing architecture already treats them as semantic product metadata.

---

# 46. Deterministic Cell Ordering

Use the audit's adopted order:

1. all-day Events;
2. timed Events;
3. Work;
4. scheduled Commitments;
5. attention/status.

Within each class sort deterministically by:

1. canonical start;
2. canonical end;
3. semantic kind where needed;
4. title;
5. exact stable identity.

Input/storage order must not affect output.

---

# 47. Overflow Foundation

The future UI will use a fixed visible token budget by breakpoint.

Task 7.1 should not hardcode responsive layout.

Instead return enough deterministic data that future UI can compute:

```text
visibleTokens = tokens.slice(0, N)
overflowCount = tokens.length - N
```

If a generic helper is useful, it may be pure and accept `N`.

Do not encode viewport widths in the core projection.

---

# 48. Selected-Day Projection

Return a richer selected-day read model independent of Month-cell compression.

At minimum include:

* selected label;
* canonical start;
* canonical end;
* duration;
* effective day boundary;
* effective canonical `weekStartsOn`;
* whether selected label belongs to displayed month;
* whether it is canonical current user-day;
* coverage state;
* freshness;
* scheduled occurrence collections;
* Events;
* friction;
* relevant unplaced evidence;
* exact contextual targets;
* week-start transition context if applicable.

---

# 49. Selected-Day Ordering

Selected-day occurrence ordering must be deterministic.

Prefer semantic ordering consistent with Review Schedule.

Do not use Month-cell compression order blindly if Review Schedule has a more truthful chronological order.

Audit and document.

---

# 50. Display-Week Transition Metadata

If `weekStartsOn` for selected label differs from Month display anchor:

return explicit metadata, conceptually:

```text
displayWeekAnchor: "sunday"

selectedDayWeekStart: "monday"

weekStartTransition: {
    differsFromDisplayAnchor: true
}
```

This is presentation context only.

Do not modify user-week calculations.

---

# 51. Boundary-Transition Metadata

If selected label's boundary differs from previous/next label regime:

the read model may expose deterministic transition facts such as:

* previous boundary;
* current boundary;
* next boundary;
* current duration.

Do not infer adaptation need.

Do not recommend Sleep changes.

---

# 52. Adjacent-Month Cell Behavior

Adjacent cells use the same semantic projection as displayed-month cells.

Do not treat them as placeholders.

They may have:

* coverage;
* Events;
* Work;
* Commitments;
* current marker;
* attention.

Expose:

```text
isInDisplayedMonth: false
```

for presentation.

---

# 53. Month Heading

Return canonical displayed month metadata:

* year;
* month;
* machine identity;
* optional locale-independent label components.

Do not hardcode English month names in core model unless repository localization conventions permit.

UI can format later.

---

# 54. Month Navigation Helpers

Pure helper functions may be included for:

* previous displayed month;
* next displayed month;
* same/clamped day-of-month projection.

No UI.

No persistence.

No selected-state mutation outside returned values.

---

# 55. Day-of-Month Preservation

If providing month-shift helper:

```text
Jan 31 → Feb
```

must clamp deterministically to valid February label.

Document exact behavior.

Do not invent selection side effects beyond helper return.

---

# 56. Cross-Month Focus vs Selection Boundary

Task 7.1 does not implement focus.

If helper types anticipate future UI, keep:

* focused label;
* selected label;

conceptually distinct.

Do not collapse them into one durable Month state.

---

# 57. HistoricalPlan Exclusion

The Month read model must not consult HistoricalPlan to fill uncovered cells.

Mandatory test or dependency assertion where practical.

A past uncovered cell remains uncovered in current Planner.

Summary/Today remain the historical paths.

---

# 58. ExecutionHistory Exclusion

Do not include:

* completed;
* partial;
* skipped;
* notReported;

in Month cell planning evidence.

Do not read ExecutionHistory.

---

# 59. Progress Exclusion

Do not include:

* Goal progress;
* realization percentages;
* Measurement observations;

in Month cells.

Goal/Measurement current authoring targets may later be Planner contextual configuration, but not schedule geometry.

---

# 60. Capacity Exclusion

No derived notion of:

* free hours;
* available time;
* overloaded;
* remaining capacity.

Generated-empty and uncovered remain epistemically narrow.

---

# 61. Recommendation Exclusion

No:

* best day;
* recommended fix;
* suggested Commitment;
* transition advice;
* Goal reprioritization.

Friction remains existing bounded evidence/options only.

---

# 62. Protection / Availability Input

Audit current protected/unavailable contracts.

The read model must not receive quarantined data and then project it as normal content.

Prefer explicit query result branches such as:

```text
available
protected
unavailable
invalidQuery
```

if current application conventions support them.

Do not invent a fake empty Month for protected authority.

---

# 63. Partial Authority Availability

If Preview is unavailable but authored Events remain available, determine whether Month may truthfully project Events while schedule geometry is unavailable.

This is a key implementation audit question.

Prefer independent authority availability where architecture supports it.

Do not collapse the whole Month unnecessarily if only one source is unavailable.

Document actual capability.

---

# 64. Query Result Shape

Use a discriminated result type where useful.

Conceptually:

```text
MonthlyPlannerQueryResult =
    | { kind: "available"; model: MonthlyPlannerReadModel }
    | { kind: "invalidQuery"; ... }
    | { kind: "protected"; ... }
    | { kind: "unavailable"; ... }
```

Do not adopt this mechanically if existing application query conventions provide a better canonical pattern.

---

# 65. Clone Isolation

The result must own its arrays/objects.

Tests must prove:

1. query result can be mutated by a malicious/test consumer;
2. underlying Preview/authored inputs remain unchanged;
3. a subsequent query returns correct canonical output.

No returned mutable reference should alias store state.

---

# 66. Determinism

For equal semantic inputs:

```text
query(inputsA) ≡ query(inputsB)
```

even when:

* input occurrence order differs;
* Event input order differs;
* friction input order differs;
* unrelated object property insertion order differs.

Test this.

---

# 67. Stable Identity

Do not use array index as semantic identity.

Every projected occurrence/token/contextual target must have deterministic identity from canonical source/occurrence evidence.

---

# 68. Performance Architecture

Avoid:

```text
for each cell:
    scan every occurrence
    scan every Event
    scan every friction point
```

Preferred strategy:

1. derive visible label set;
2. index schedule evidence by owning user-day label once;
3. index Events once where needed;
4. index friction once;
5. project 35/42 cells in O(cells + visible evidence).

Document actual complexity.

---

# 69. Temporal Resolver Reuse

Avoid repeated expensive preference resolution where one query-local index/cache suffices.

But do not introduce durable cache state.

A query-local `Map<label, resolvedWindow>` is acceptable if helpful.

---

# 70. Dense-Month Fixture

Create a representative dense-month fixture containing enough:

* Work;
* Events;
* Commitments;
* Sleep;
* friction;
* unplaced;

to prove bounded projection and ordering.

Do not benchmark unrealistic thousands of items unless repository use cases suggest it.

---

# 71. Performance Test

A brittle wall-clock microbenchmark is not required.

Prefer structural evidence:

* bounded loop counts;
* helper-level instrumentation if existing conventions support it;
* representative dense fixture;
* absence of per-cell full scans.

If a timing test is used, keep it robust.

---

# 72. Input Validation

Reject malformed:

* displayed month;
* selected label;
* evaluation instant;
* impossible date labels.

Use canonical date parsing/validation.

Do not allow JavaScript Date normalization to silently turn:

```text
2026-02-31
```

into another day.

---

# 73. Locale Boundary

Core read model should avoid locale-dependent parsing.

Formatting belongs to UI/presentation helpers.

---

# 74. DST

Use existing supported local-time semantics.

Include supported DST fixture(s) if current test environment makes them deterministic.

Do not introduce timezone infrastructure.

---

# 75. Boundary Increase Fixture

Include an explicit changing-boundary case.

Example:

```text
03:00 → 06:00
```

Assert canonical selected-day duration according to consecutive starts.

Use actual expected duration from the configured dates/time environment.

---

# 76. Boundary Decrease Fixture

Likewise:

```text
06:00 → 03:00
```

No gap.

No overlap.

One owning cell per occurrence.

---

# 77. Before-Boundary Current Instant Fixture

For an evaluation instant before the current civil day's boundary:

assert canonical current marker remains on the previous user-day label.

This is mandatory.

---

# 78. Month Boundary Fixture

Include an occurrence whose canonical owning label is at:

* last day of month;
* first day of next month;

and/or whose interval crosses the civil month edge.

Assert exactly one owning cell.

---

# 79. Adjacent Cell Fixture

Verify leading/trailing adjacent labels are:

* correctly generated;
* semantically projected;
* marked outside displayed month.

---

# 80. 35-Cell Month Fixture

Use a month requiring five visual rows.

Assert 35 cells.

---

# 81. 42-Cell Month Fixture

Use a month requiring six visual rows.

Assert 42 cells.

---

# 82. Stable Week-Start Fixture

Test at least:

* Sunday display anchor;
* Monday display anchor.

Verify weekday column order and grid start.

---

# 83. Week-Start Transition Fixture

Construct a month where:

```text
M-01 weekStartsOn = Sunday
later label = Monday
```

Assert:

* grid columns stay Sunday-first;
* selected later label reports canonical Monday week start;
* transition metadata is present;
* canonical user-week helper remains independent.

---

# 84. Reverse Week-Start Transition

Likewise:

```text
M-01 = Monday
later label = Sunday
```

Grid remains Monday-first.

---

# 85. Repeating-Cycle Wrap

Include a repeating-cycle case whose effective preference changes across sequence wrap.

Ensure display anchor remains month-anchored while per-label temporal truth remains canonical.

---

# 86. Generated-With-Items Fixture

Covered fresh cell with planned geometry.

Assert:

* correct coverage;
* correct token/summary counts;
* exact targets.

---

# 87. Generated-Empty Fixture

Covered cell with zero relevant geometry.

Assert explicit distinction from uncovered.

---

# 88. Uncovered Fixture

Visible label outside Preview coverage.

Assert:

* uncovered;
* not generated-empty;
* no fake availability.

---

# 89. Stale Fixture

Covered stale Preview.

Assert:

* geometry remains;
* stale state is explicit;
* cell remains covered.

---

# 90. Protected Fixture

Where current test architecture supports protected planning state:

assert protected/unavailable is not returned as empty/uncovered.

If protection is handled above this pure query boundary, document that and test the enclosing application adapter instead.

---

# 91. All-Day Event Fixture

Assert:

* explicit all-day kind;
* one owning cell;
* no midnight inference;
* selected-day geometry resolves canonical whole day.

---

# 92. Timed Full-Day Event Fixture

Create a timed Event whose interval equals a full user-day.

Assert it remains `timed`, not `allDay`.

Use current Event authority semantics.

---

# 93. Cross-Midnight Timed Event Fixture

Assert one owning cell according to canonical Event/user-day membership.

---

# 94. Work Fixture

Assert Work projection:

* one owning cell per occurrence;
* deterministic token/order;
* contextual Work target only where currently supported.

---

# 95. Commitment Exact-Identity Fixture

Assert Month target includes exact current:

* template identity/incarnation;
* recurrence identity/incarnation.

---

# 96. Recreated Commitment Fixture

Use Preview evidence from incarnation A and current authored replacement B.

The Month read model must not return an edit target that points to B as though it were A.

Depending on existing Task 6.10 behavior:

* return stale/unavailable target metadata;
* or return exact A target that downstream revalidation rejects.

Prefer propagating enough truth that UI can later present unavailability cleanly.

Document chosen layer boundary.

---

# 97. Event Recreation Fixture

Same principle for Events.

No retarget.

---

# 98. Friction Fixture

Assert:

* correct owning day / Month attention count;
* deterministic order;
* no Recommendation fields;
* exact participant refs preserved.

---

# 99. Unplaced Fixture

Assert Month-level count.

If candidate has canonical day:

assert cell-level association.

If not:

assert it remains Month-level only.

No guessed date.

---

# 100. Input-Order Property Test

Shuffle:

* scheduled occurrences;
* Events;
* friction;
* unplaced candidates.

Assert semantic read model equality.

---

# 101. Clone-Isolation Property Test

Mutate:

* cell tokens;
* selected-day arrays;
* contextual target objects;

from returned result.

Assert sources remain unchanged.

---

# 102. Grid-Continuity Property

For every adjacent pair of grid cells:

```text
nextLabel = previousLabel + 1 civil day
```

No duplicate labels.

No skipped labels.

---

# 103. Month-Membership Property

All core displayed-month labels appear exactly once.

Adjacent labels appear only as required to complete rows.

---

# 104. One-Owner Property

Every visible scheduled occurrence appears in exactly one canonical cell.

Do not count Month-level attention summaries as duplicate occurrence presentation.

---

# 105. Display-Week Stability Property

Within one read-model result:

```text
weekdayColumns
```

and row alignment never change in response to per-label week-start changes.

---

# 106. Navigation Purity Property

Any pure month-shift / selection helper must not alter:

* Preview;
* authored setup;
* Events;
* staleness;
* planning range.

---

# 107. Planning-Range Independence

The displayed month may lie outside the authored Planning Range.

The query still returns the visual grid.

Cells outside Preview coverage remain uncovered.

Do not mutate the range or generate.

---

# 108. Planning-Range Metadata

Return enough current authored Planning Range context for future UI to explain why visible dates may be uncovered.

Do not make the range a Month identity.

---

# 109. Month-Level Status

Define deterministic Month-level summary precedence.

For example, distinguish:

* protected/unavailable;
* stale coverage exists;
* partial coverage;
* full coverage;
* no coverage.

Do not flatten mixed states.

Document precedence.

---

# 110. Partial Coverage

A Month may contain:

```text
covered
covered
uncovered
uncovered
```

Return per-cell truth plus useful Month-level coverage counts.

Do not turn this into one binary `hasSchedule`.

---

# 111. Selected Uncovered Day

Selected-day model must truthfully expose:

```text
coverage = uncovered
```

while still exposing:

* canonical time window;
* Events if independently available;
* temporal preferences if available;
* contextual Add Event / Add Commitment target information only if those future actions are valid.

Task 7.1 does not implement actions.

---

# 112. Selected Generated-Empty Day

Expose:

* canonical window;
* `covered`;
* zero planned geometry;
* relevant Events/attention if semantic source says they exist.

Do not label it "free."

---

# 113. Exact Contextual Target Type

Define a pure target union only if useful.

Conceptually:

```text
MonthlyPlannerTarget =
    | ExactCommitmentTarget
    | ExactEventTarget
    | WorkContextTarget
    | FrictionTarget
    | UnplacedTarget
```

This remains navigation metadata.

It is not authority.

---

# 114. No View-State Persistence

Do not create persistence for:

* displayed month;
* selected label;
* expanded overflow;
* contextual target;
* focus.

Task 7.2 may own ephemeral UI state.

---

# 115. Profile Boundary

The query consumes whichever current authored state exists after profile activation.

It does not store profile identity itself unless required for target provenance.

No profile writes.

---

# 116. Restore Boundary

Restored authority produces a fresh Month projection.

No read-model cache survives as durable truth.

---

# 117. Full-Clear Boundary

After full clear:

* grid still exists;
* canonical time still resolves if preferences/defaults permit;
* authored/schedule evidence clears according to current authority;
* formerly covered cells do not remain ghost-covered unless Preview semantics explicitly preserve something.

Use actual full-clear behavior.

---

# 118. Module Export Boundary

Expose only the types/helpers needed by future Task 7.2.

Avoid exporting implementation internals prematurely.

---

# 119. UI Independence

No React dependency should be necessary in the pure Month projection module.

If repository architecture places query orchestration in application state with React-independent TypeScript, preserve that pattern.

---

# 120. Runtime Dependency Constraint

No new runtime dependency.

Mandatory.

Do not add a date/calendar library.

Use existing time/date infrastructure.

---

# 121. Bundle Baseline

Phase 6 publication baseline:

```text
Initial raw       648,706
Initial gzip      164,373
Largest lazy       51,445
Total JS          746,424
```

Fixed guards:

```text
Initial raw   <= 685,000
Initial gzip  <= 170,000
Largest lazy  <= 100,000
Total JS      <= 750,000
```

Only **3,576 raw bytes** of total-JS headroom remain.

---

# 122. Bundle Strategy

Task 7.1 must be extremely lean.

Prefer:

* pure TypeScript;
* reuse of existing date/time helpers;
* reuse of existing Preview grouping behavior;
* no duplicated calendar library;
* no UI code;
* no runtime dependency;
* no large helper framework.

If this read model alone pushes total JS over the guard:

stop and report.

Do not raise thresholds.

---

# 123. Dead-Code / Reuse Audit

Before writing helpers already present in `PreviewScreen` or related modules:

determine whether those helpers can be:

* extracted;
* reused;
* moved into shared pure modules;

without behavior change.

Prefer one canonical grouping/sorting implementation.

Do not create a second independent schedule grouping algorithm.

---

# 124. PreviewScreen Boundary

Task 7.1 may extract pure behavior from `PreviewScreen` if needed.

Do not redesign `PreviewScreen`.

Do not migrate visible Review Schedule yet.

---

# 125. Tests — Query Validation

Cover:

* valid month;
* malformed month;
* invalid selected label;
* invalid evaluation instant;
* selected adjacent label.

---

# 126. Tests — Grid Geometry

Cover:

* Sunday anchor;
* Monday anchor;
* 35 cells;
* 42 cells;
* leading adjacent labels;
* trailing adjacent labels;
* month/year boundary.

---

# 127. Tests — Temporal Semantics

Cover:

* ordinary day;
* boundary increase;
* boundary decrease;
* before-boundary current instant;
* cycle wrap;
* supported DST.

---

# 128. Tests — Week-Start Semantics

Cover:

* stable Sunday;
* stable Monday;
* Sunday → Monday inside month;
* Monday → Sunday inside month;
* repeating-cycle wrap.

---

# 129. Tests — Coverage

Cover:

* covered fresh;
* covered stale;
* generated empty;
* uncovered;
* partial month coverage;
* full coverage;
* no coverage;
* protected/unavailable where applicable.

---

# 130. Tests — Occurrences

Cover:

* Work;
* ordinary Commitment;
* Sleep;
* Event;
* all-day Event;
* timed full-day Event;
* cross-midnight Event;
* month-boundary occurrence.

---

# 131. Tests — Exact Identity

Cover:

* current Commitment;
* renamed same incarnation;
* removed source;
* recreated source;
* current Event;
* recreated Event;
* Work composite target.

---

# 132. Tests — Attention

Cover:

* friction;
* multiple friction items;
* unplaced Month-level;
* unplaced cell-level where truthful;
* no attention.

---

# 133. Tests — Deterministic Ordering

Cover semantic ordering within a dense day.

Assert no dependence on source array order.

---

# 134. Tests — Overflow Helper

If an overflow helper is implemented:

* N = 0;
* N < token count;
* N == token count;
* N > token count;
* deterministic retained order.

---

# 135. Tests — Clone Isolation

Mandatory.

---

# 136. Tests — Input Permutation

Mandatory.

---

# 137. Tests — Performance Structure

Add focused proof that Month projection does not perform whole-evidence scans per cell.

Use architecture-appropriate assertions.

Do not add brittle performance thresholds unless existing conventions support them.

---

# 138. Tests — Authority Exclusion

Where mechanically testable, ensure Month query does not depend on:

* HistoricalPlan;
* ExecutionHistory;
* Progress.

Prefer dependency boundaries rather than mocking internal imports excessively.

---

# 139. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.1_CANONICAL_MONTHLY_PLANNER_READ_MODEL_AND_DISPLAY_WEEK_PROJECTION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Phase 7 Audit Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Query Module Placement
7. Query Contract
8. Input Validation
9. Displayed Month Identity
10. Selected Label
11. Evaluation Instant
12. Display-Week Anchor
13. Weekday Columns
14. Grid Geometry
15. 35-Cell Rule
16. 42-Cell Rule
17. Adjacent Cells
18. Cell Identity
19. Cell Month Membership
20. Canonical User-Day Resolution
21. Variable-Duration Metadata
22. Current User-Day Marker
23. Coverage Source
24. Coverage Classification
25. Freshness
26. Generated-Empty
27. Partial Coverage
28. Month-Level Status
29. Work Projection
30. Commitment Projection
31. Sleep Projection
32. Event Projection
33. All-Day Event
34. Timed Full-Day Event
35. Cross-Boundary Ownership
36. Friction Projection
37. Friction Ownership
38. Unplaced Projection
39. Month-Level Attention
40. Cell Evidence Model
41. Cell Token Model
42. Cell Ordering
43. Overflow Foundation
44. Selected-Day Projection
45. Selected-Day Ordering
46. Week-Start Transition Metadata
47. Boundary-Transition Metadata
48. Planning-Range Independence
49. Planning-Range Metadata
50. HistoricalPlan Exclusion
51. ExecutionHistory Exclusion
52. Progress Exclusion
53. Capacity Exclusion
54. Recommendation Exclusion
55. Protection/Availability
56. Partial Authority Availability
57. Query Result Union
58. Exact Target Model
59. Commitment Incarnation Safety
60. Event Incarnation Safety
61. Work Target
62. Determinism
63. Stable Identity
64. Clone Isolation
65. Input-Order Independence
66. Performance Architecture
67. Temporal Resolver Reuse
68. Dense-Month Fixture
69. Navigation Helpers
70. View-State Persistence Boundary
71. Profile Boundary
72. Restore Boundary
73. Full-Clear Boundary
74. UI Independence
75. Runtime Dependency Assessment
76. Bundle Strategy
77. Reused/Extracted Existing Helpers
78. Tests Added/Changed
79. Focused Validation
80. Full Validation
81. Bundle Validation
82. Governance Updates
83. ADR Determination
84. Deviations
85. Discoveries
86. Deferred Work
87. Query Contract Matrix
88. Grid Geometry Matrix
89. Temporal Matrix
90. Coverage Matrix
91. Cell Evidence Matrix
92. Exact Target Matrix
93. Week-Start Matrix
94. Ordering Matrix
95. Authority Matrix
96. Exclusion Matrix
97. Performance Matrix
98. Bundle Matrix
99. Product-Boundary Matrix
100. Epistemic Matrix
101. Architectural Invariant Assessment
102. Stop-Condition Assessment
103. Architectural Alignment Assessment
104. Task 7.2 Readiness
105. Recommended Next Task
106. Final Completion Determination

---

# 140. Required Query Contract Matrix

| Input                        |                 Required? | Meaning                     | May mutate authority? |
| ---------------------------- | ------------------------: | --------------------------- | --------------------: |
| displayed month              |                       Yes | visual month identity       |                    No |
| selected label               |              audit/result | selected user-day label     |                    No |
| evaluation instant           |                       Yes | current-user-day resolution |                    No |
| authored temporal state      |          Yes where needed | boundaries/week start       |                    No |
| Preview                      | Yes/current plan evidence | derived geometry/attention  |                    No |
| Events/current exact sources |               as required | exact authored context      |                    No |
| planning range               |          Yes where needed | generation coverage context |                    No |

Use actual final contract.

---

# 141. Required Grid Geometry Matrix

| Scenario       | Display anchor | First visible label | Cell count | Last visible label |
| -------------- | -------------- | ------------------- | ---------: | ------------------ |
| five-row month |                |                     |         35 |                    |
| six-row month  |                |                     |         42 |                    |
| Sunday-first   | Sunday         |                     |            |                    |
| Monday-first   | Monday         |                     |            |                    |
| year boundary  |                |                     |            |                    |

---

# 142. Required Temporal Matrix

| Case                | Cell label | Canonical start/end | Current marker / ownership |
| ------------------- | ---------- | ------------------- | -------------------------- |
| ordinary            |            |                     |                            |
| boundary increase   |            |                     |                            |
| boundary decrease   |            |                     |                            |
| before-boundary now |            |                     |                            |
| month boundary      |            |                     |                            |
| cycle wrap          |            |                     |                            |
| DST                 |            |                     |                            |

---

# 143. Required Coverage Matrix

| State                 | Cell classification |    Geometry visible? | Meaning                |
| --------------------- | ------------------- | -------------------: | ---------------------- |
| covered fresh + items |                     |                  Yes | generated current plan |
| covered fresh empty   |                     |             No items | generated known empty  |
| covered stale         |                     |                  Yes | old generated geometry |
| uncovered             |                     |                   No | not generated          |
| protected/unavailable |                     | No normal projection | truth unavailable      |

---

# 144. Required Cell Evidence Matrix

| Evidence      | Cell summary | Selected-day detail | Exact action target? |
| ------------- | ------------ | ------------------- | -------------------: |
| all-day Event |              |                     |                      |
| timed Event   |              |                     |                      |
| Work          |              |                     |                      |
| Commitment    |              |                     |                      |
| Sleep         |              |                     |                      |
| friction      |              |                     |                      |
| unplaced      |              |                     |                      |

---

# 145. Required Exact Target Matrix

| Evidence source      | Exact identity fields | Editable if current exact source missing? |                Retarget? |
| -------------------- | --------------------- | ----------------------------------------: | -----------------------: |
| Commitment           |                       |                                        No |                       No |
| Event                |                       |                                        No |                       No |
| Work                 | composite context     |                                contextual | No false singular target |
| friction participant | underlying exact ref  |                        only if resolvable |                       No |
| unplaced Commitment  | exact source          |                        only if resolvable |                       No |

---

# 146. Required Week-Start Matrix

| Scenario             | Display anchor | Selected canonical week start | Grid rotates? | Transition metadata |
| -------------------- | -------------- | ----------------------------- | ------------: | ------------------- |
| Sunday stable        |                |                               |            No |                     |
| Monday stable        |                |                               |            No |                     |
| Sunday → Monday      | Sunday         | Monday later                  |            No | Yes                 |
| Monday → Sunday      | Monday         | Sunday later                  |            No | Yes                 |
| repeating-cycle wrap | month-anchor   | per-label                     |            No | as applicable       |

---

# 147. Required Ordering Matrix

| Class          | Primary order            | Secondary | Tie-break       |
| -------------- | ------------------------ | --------- | --------------- |
| all-day Events |                          |           |                 |
| timed Events   | start                    | end       | exact identity  |
| Work           | start                    | end       | exact identity  |
| Commitments    | start                    | end       | exact identity  |
| attention      | deterministic domain key |           | stable identity |

---

# 148. Required Authority Matrix

| Source                  |                                            Read by Month? | Purpose                         | Written? |
| ----------------------- | --------------------------------------------------------: | ------------------------------- | -------: |
| Active authored setup   |                                                           | temporal/exact source context   |       No |
| Manual Events           |                                                           | current Event context           |       No |
| Preview                 |                                                       Yes | current plan geometry/attention |       No |
| PlanDecision            | indirect through Preview/current state only unless needed |                                 |       No |
| HistoricalPlan          |                                                        No | excluded                        |       No |
| ExecutionHistory        |                                                        No | excluded                        |       No |
| Progress                |                                                        No | excluded                        |       No |
| canonical time resolver |                                                       Yes | user-day/current/week truth     |       No |

---

# 149. Required Exclusion Matrix

| Capability/source       | Included in Task 7.1? | Reason                       |
| ----------------------- | --------------------: | ---------------------------- |
| HistoricalPlan geometry |                    No | current Planner uses Preview |
| execution outcomes      |                    No | Today authority              |
| progress                |                    No | Summary                      |
| Capacity                |                    No | undefined                    |
| Allocation              |                    No | undefined                    |
| Recommendations         |                    No | future policy                |
| drag/drop               |                    No | no direct schedule authority |
| Month persistence       |                    No | transient view state         |

---

# 150. Required Performance Matrix

| Operation                | Intended complexity         | Whole-array rescan per cell? |
| ------------------------ | --------------------------- | ---------------------------: |
| visible label generation | O(cells)                    |                           No |
| occurrence indexing      | O(occurrences)              |                           No |
| Event indexing           | O(events)                   |                           No |
| friction indexing        | O(friction)                 |                           No |
| cell projection          | O(cells + visible evidence) |                           No |
| selected-day detail      | indexed lookup              |                           No |

Refine from implementation.

---

# 151. Required Bundle Matrix

| Metric       | Phase 6 baseline | Task 7.1 | Delta |   Guard |
| ------------ | ---------------: | -------: | ----: | ------: |
| Initial raw  |          648,706 |          |       | 685,000 |
| Initial gzip |          164,373 |          |       | 170,000 |
| Largest lazy |           51,445 |          |       | 100,000 |
| Total JS     |          746,424 |          |       | 750,000 |

Record any new chunk if one appears.

---

# 152. Required Product-Boundary Matrix

| Capability                    | Task 7.1                |
| ----------------------------- | ----------------------- |
| pure Month read model         | Implement               |
| display-week projection       | Implement               |
| selected canonical day model  | Implement               |
| Preview coverage              | Implement               |
| exact contextual targets      | Implement metadata only |
| visible Month UI              | Prohibited              |
| Planner navigation migration  | Prohibited              |
| contextual editing UI         | Prohibited              |
| schedule generation           | Prohibited              |
| Month persistence             | Prohibited              |
| HistoricalPlan Month backfill | Prohibited              |
| outcome/progress display      | Prohibited              |
| Capacity                      | Prohibited              |
| Recommendations               | Prohibited              |
| direct manipulation           | Prohibited              |

---

# 153. Required Epistemic Matrix

| Evidence/state          | Month may say                           | Must not say                                |
| ----------------------- | --------------------------------------- | ------------------------------------------- |
| covered with items      | generated plan exists                   | executed                                    |
| covered empty           | no planned items in generated plan      | free / available                            |
| uncovered               | not generated                           | free                                        |
| stale                   | generated from older authored state     | invalid                                     |
| protected               | planning evidence unavailable           | empty                                       |
| all-day Event           | authored all-day for canonical user-day | civil-midnight event                        |
| unplaced                | candidate not placed                    | insufficient Capacity                       |
| friction                | deterministic plan attention            | Recommendation                              |
| current user-day marker | canonical user-day containing now       | civil date necessarily equals current label |
| recreated source        | current distinct incarnation            | same source as stale occurrence             |

---

# 154. Architectural Invariants

Assess at minimum:

1. Month read model is pure.
2. Month is not authority.
3. query performs no writes.
4. query performs no schedule generation.
5. Preview remains current planning geometry source.
6. HistoricalPlan is excluded.
7. ExecutionHistory is excluded.
8. Progress is excluded.
9. Active authored state remains authoritative source context.
10. Events remain singular authored authority.
11. Commitment remains a projection.
12. Work remains composite.
13. selected cell is a civil label.
14. selected user-day is canonical interval.
15. variable-duration days remain truthful.
16. current marker uses canonical instant resolver.
17. civil midnight is not ownership boundary.
18. display Month is presentation horizon only.
19. Month is not recurrence boundary.
20. Month is not user-week authority.
21. display-week anchor comes from M-01.
22. display anchor remains fixed throughout one Month projection.
23. per-label canonical week start may differ.
24. visual rows never feed scheduler/user-week logic.
25. Sunday→Monday transition does not rotate grid.
26. Monday→Sunday transition does not rotate grid.
27. grid contains contiguous civil labels.
28. every displayed-month label appears once.
29. adjacent labels are explicit.
30. cell count is bounded 35/42.
31. coverage is not inferred from occurrence count.
32. generated-empty differs from uncovered.
33. stale-covered differs from uncovered.
34. protected differs from empty.
35. stale geometry remains visible in projection.
36. uncovered does not imply availability.
37. generated-empty does not imply Capacity.
38. each occurrence has one owning cell.
39. cross-midnight occurrence is not duplicated.
40. all-day Event is semantic, not inferred by duration.
41. timed full-day Event remains timed.
42. Work projection is read-only.
43. Commitment target preserves exact incarnation.
44. Event target preserves exact incarnation.
45. recreated sources never retarget.
46. title matching is prohibited.
47. time matching is prohibited.
48. friction remains derived evidence.
49. friction does not become Recommendation.
50. unplaced remains distinct from Capacity.
51. Month-level unplaced does not require guessed cell ownership.
52. cell ordering is deterministic.
53. input order does not alter semantic output.
54. overflow data is deterministic.
55. stable identity never uses array index.
56. query result owns mutable arrays/objects.
57. mutating query result cannot mutate sources.
58. subsequent query is unaffected by prior consumer mutation.
59. visible-label generation is bounded.
60. projection avoids whole-array scan per cell.
61. query-local caches are non-durable.
62. evaluation instant is explicit.
63. malformed dates are rejected.
64. locale formatting does not define identity.
65. planning range remains independent from displayed month.
66. navigation beyond coverage is representable.
67. Month projection does not edit Planning Range.
68. Month projection does not stale Preview.
69. Month projection does not refresh Preview.
70. no view-state persistence is added.
71. no IndexedDB store is added.
72. no localStorage key is added.
73. no Backup version changes.
74. profile activation naturally reprojects current state.
75. restore naturally reprojects current state.
76. full clear naturally reprojects cleared state.
77. protected input never becomes fake normal Month.
78. no UI dependency is required in pure projection.
79. no runtime dependency is added.
80. no calendar library is added.
81. existing date/time helpers are reused.
82. existing Review grouping logic is reused/extracted where appropriate.
83. Task 7.1 does not migrate visible Planner modes.
84. Task 7.1 does not create Month UI.
85. Task 7.1 does not introduce keyboard-grid behavior yet.
86. Task 7.1 does not introduce direct manipulation.
87. Task 7.1 does not introduce Goal ranking.
88. Task 7.1 does not introduce transition adaptation.
89. Task 7.1 does not introduce Capacity.
90. Task 7.1 does not introduce Allocation.
91. Task 7.1 does not introduce Recommendations.
92. Task 7.1 does not introduce Pattern Library.
93. selected-day model supports later DayVisualizer reuse.
94. read-model types support responsive Month UI without encoding viewport policy.
95. future UI can distinguish current vs selected.
96. future UI can distinguish displayed-month vs adjacent cell.
97. future UI can distinguish covered/stale/uncovered/protected.
98. future UI can access exact contextual targets without re-deriving identity.
99. future UI need not scan raw Preview arrays per cell.
100. full canonical validation passes.
101. fixed bundle guards remain unchanged.
102. total JS remains within guard.
103. no threshold inflation occurs.
104. no new architecture prerequisite is invented.
105. Task 7.2 can build a read-only accessible Month shell without redefining Month semantics.

Classify each as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Not applicable;
* Blocked.

---

# 155. Stop Conditions

Stop and report rather than invent behavior if:

* Preview cannot mechanically distinguish generated-empty from uncovered;
* canonical occurrence ownership is unavailable for Month projection;
* exact Commitment or Event identity cannot be preserved without durable schema change;
* display-week anchor cannot be resolved from existing effective preference semantics;
* current Month query would require HistoricalPlan to appear complete;
* protected planning state cannot be distinguished from empty;
* recurrence/user-week semantics would need to depend on visual Month rows;
* implementing the read model requires a new runtime dependency;
* total JS cannot remain within the fixed bundle guard;
* a durable Month/view-state authority appears necessary;
* a scheduler change becomes necessary.

Do not broaden Task 7.1 around a stop condition.

---

# 156. Focused Validation

Run focused suites for:

* new Monthly Planner query/projection;
* canonical user-day resolver;
* effective preference resolver;
* user-week resolver;
* Preview grouping/coverage;
* exact Commitment identity;
* Event identity;
* Work projection;
* friction;
* unplaced candidates;
* profile/restore/full-clear where relevant.

Record exact files and test counts.

---

# 157. Full Validation

Run:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Record:

* test-file count;
* test count;
* transformed modules;
* initial raw;
* initial gzip;
* largest lazy;
* total JS;
* any new chunk;
* diff result.

---

# 158. Manual Validation

No visible Month UI is required.

Do not claim browser Month validation.

If useful, inspect existing Planner behavior after pure helper extraction to ensure no Review regression.

Task 7.2 will own real Month browser interaction.

---

# 159. Governance

Update:

* Task 7.1 result;
* Phase 7 checkpoint/current-state record;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

No ADR is expected because Phase 7 Audit 01 already selected:

* Month as projection;
* canonical display-week anchor;
* user-week/display-week separation.

Create an ADR only if implementation establishes a materially new enduring decision beyond the audit.

---

# 160. Task 7.2 Readiness

Task 7.2 becomes authorized only if:

* query contract is stable;
* Month grid returns deterministic 35/42 cells;
* display-week anchor is explicit;
* canonical selected-day geometry is correct;
* current marker uses canonical user-day;
* coverage states are mechanically distinct;
* generated-empty differs from uncovered;
* stale-covered remains distinct;
* exact targets preserve incarnation;
* Work/Event/Commitment/friction/unplaced summaries are truthful;
* HistoricalPlan/ExecutionHistory/Progress remain excluded;
* property tests prove determinism and clone isolation;
* performance avoids per-cell whole-plan scans;
* fixed bundle guard remains green;
* no architecture stop condition remains.

---

# 161. Recommended Next Task

If green:

> **Task 7.2 — Accessible Monthly Planner Shell and Selected-Day Review Workspace.**

That task should introduce the first visible Month Calendar using this read model, while keeping existing Plan/Review presentation available during strangler migration.

---

# 162. Completion Criteria

Task 7.1 is complete only when:

* the current Month projection inputs have been mechanically audited;
* a pure canonical Monthly Planner read-model query exists;
* the query accepts explicit displayed-month and evaluation inputs;
* malformed month/date inputs are rejected;
* one display-week anchor is resolved from the effective `weekStartsOn` for the first label of the displayed month;
* weekday columns remain stable for the entire displayed month;
* per-label canonical user-week semantics remain independent;
* the query returns a contiguous 35/42-cell civil grid;
* every core displayed-month label appears exactly once;
* adjacent labels are explicit and semantically projected;
* selected label resolves to canonical `[start(D), start(D+1))`;
* variable-duration user-days are preserved;
* the current-user-day marker comes from the canonical instant resolver;
* Preview coverage is mechanically distinguishable from occurrence presence;
* covered fresh, covered stale, generated-empty, uncovered, and protected/unavailable remain truthful distinct states as architecture permits;
* Preview remains the sole current generated planning geometry source;
* HistoricalPlan does not backfill Month;
* ExecutionHistory and Progress do not enter Month planning evidence;
* Work, Commitments, Sleep, Events, friction, and unplaced evidence are projected without changing authority;
* all-day Event semantics are explicit rather than inferred from duration;
* every scheduled occurrence has one canonical owning cell;
* cross-midnight occurrences are not duplicated;
* exact Commitment/Event contextual target metadata preserves source incarnation;
* stale/recreated sources do not silently retarget;
* Month-level and cell-level attention are deterministic;
* cell ordering is deterministic and input-order-independent;
* overflow foundation is deterministic without embedding viewport policy;
* the selected-day model contains enough canonical geometry/evidence for Task 7.2;
* week-start transition metadata distinguishes display-week policy from canonical user-week truth;
* planning range remains independent from displayed month;
* navigating beyond Preview coverage is representable as uncovered rather than free;
* returned objects/arrays are clone-isolated from sources;
* query-local indexing avoids per-cell full-evidence scans;
* no durable Month/view-state authority is introduced;
* no persistence, Backup, scheduler, Today, Summary, Goal, Event, Work, recurrence, Capacity, Recommendation, transition-adaptation, Pattern Library, or direct-manipulation semantics are changed;
* no runtime dependency is added;
* fixed bundle thresholds remain unchanged and green;
* focused tests pass;
* full canonical validation passes;
* governance is updated;
* Task 7.2 can render the visible accessible Month surface without re-solving temporal ownership, coverage, display-week, exact identity, or authority semantics.

---

# 163. Final Implementation Principle

> **Before the Monthly Planner becomes visible, DayFrame must be able to answer what every month cell means without asking the UI to invent the answer.**

The month is visual organization.

The label identifies the user-day.

The user-day defines canonical time.

Preview supplies the current generated plan.

Authored sources remain authoritative.

Coverage is explicit.

Identity is exact.

The query writes nothing.

---

# 164. Final Completion Statement

**Task 7.1 is complete when DayFrame has a pure, deterministic, clone-isolated, performance-bounded Monthly Planner read model that projects any valid displayed civil month into a contiguous 35/42-cell grid using one explicit display-week anchor resolved from the first day of that month while preserving independent canonical per-label user-week semantics; when every cell represents one civil user-day label whose selected temporal meaning is resolved through the canonical piecewise `[start(D), start(D+1))` model rather than midnight or fixed-duration assumptions; when the canonical current-user-day marker, adjacent-month labels, variable-duration geometry, planning-range context, fresh/stale Preview coverage, generated-empty, uncovered, and protected/unavailable states remain mechanically distinguishable; when Preview alone supplies current generated planning geometry and HistoricalPlan, ExecutionHistory, Progress, Capacity, Allocation, Recommendations, and future adaptation policies remain excluded; when Work, Commitments, Sleep, Events, all-day/timed intent, friction, and unplaced evidence are summarized with deterministic ordering, one authoritative owning cell, bounded overflow-ready collections, and exact non-retargeting contextual identity; when week-start transitions inside a displayed month preserve fixed visual columns while selected labels retain their own canonical user-week semantics and explicit transition metadata; when query outputs own their data, remain semantically identical under input permutation, avoid per-cell whole-plan scans, and require no persisted Month state, new store, Backup version, scheduler behavior, runtime dependency, or UI framework coupling; when fixed bundle guards remain unchanged and green, focused/property/full validation passes, governance records the implementation, and Task 7.2 can construct the first accessible visible Monthly Planner shell and selected-day Review workspace without redefining Month authority, temporal ownership, coverage, display-week semantics, exact identity, or planning truth.**
