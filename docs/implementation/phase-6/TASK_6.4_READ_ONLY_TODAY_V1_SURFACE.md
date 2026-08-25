# Task 6.4 — Read-Only Today V1 Surface

## Status

Ready for implementation.

## Phase

Phase 6 — Platform Maturity

## Task Type

Read-only Today surface implementation, canonical `queryToday` integration, current-user-day presentation, all-day/timed/legacy grouping, current/next/later/elapsed rendering, explicit execution-status presentation, plan-attention disclosure, protection/loading/error states, lazy-boundary evaluation, accessibility, responsive/mobile behavior, stale-request protection, tests, bundle validation, and governance.

**No Today writes, outcome-reporting actions, Goal/Progress context, friction actions, replanning, or Recommendations are authorized.**

---

# 1. Objective

Replace the current Today placeholder with the first real read-only Today V1 surface.

Today must consume only the canonical application query:

```text
queryToday({
    evaluationAsOf
})
```

and present the current canonical user-day without reimplementing temporal, HistoricalPlan, timing-provenance, or ExecutionHistory semantics in React.

At completion, a user should be able to open Today and understand:

* which canonical user-day they are currently in;
* its exact variable-duration window;
* all-day published occurrences;
* timed occurrences that are current;
* next timed occurrence(s);
* later timed occurrences;
* elapsed timed occurrences where useful;
* explicit execution outcomes when known;
* not-reported status when no outcome exists;
* timing-unavailable legacy occurrences;
* unplaced / omitted / blocked plan-attention evidence;
* whether plan or execution evidence is unavailable/protected.

Today remains strictly read-only.

---

# 2. Governing Prerequisite

Task 6.3 is complete and accepted.

The canonical Today model now provides:

```text
current user-day
effective published plan
allDay
timed
timingUnavailableLegacy

current
next
later
elapsed

execution outcome
plan attention
coverage/protection
provenance
```

React must consume that model rather than reconstructing it.

---

# 3. Governing Product Question

Today answers:

> **What does DayFrame currently know about the user-day I am living?**

It does not yet answer:

* What should I change?
* What should I report?
* What should I move?
* What Goal should I focus on?
* How should I adapt?

Those belong to later tasks.

---

# 4. Governing Epistemic Principle

The surface must preserve these distinctions:

```text
scheduled now ≠ underway

elapsed ≠ completed

elapsed ≠ skipped

not reported ≠ skipped

known empty ≠ missing plan

protected execution ≠ not reported

legacy timing unavailable ≠ timed
legacy timing unavailable ≠ all-day
```

UI copy must not collapse them.

---

# 5. Governing Timing Principle

Today must display the canonical variable-duration user-day from the query.

Do not assume:

* midnight-to-midnight;
* 24 hours;
* one calendar date.

A transition day may be 21, 24, 27, or another valid duration.

The UI may format this naturally without overemphasizing the duration.

---

# 6. Governing Read-Only Principle

Task 6.4 may not call any mutation command.

No controls for:

* completed;
* partial;
* skipped;
* move;
* regenerate;
* friction fix;
* add event;
* record Goal value;
* configure measurement.

Navigation-only handoffs are optional only if already warranted by existing app structure.

Default: keep V1 observational.

---

# 7. Governing Loading Principle

Task 6.3 ended with extremely tight initial bundle headroom:

```text
Initial raw     682,706 / 685,000
Initial gzip    169,883 / 170,000
```

Only approximately:

```text
2,294 raw bytes
117 gzip bytes
```

remain.

Therefore Task 6.4 must explicitly evaluate whether Today should now become a lazy-loaded primary surface.

Do not raise bundle limits.

---

# 8. Preferred Loading Architecture Candidate

Evaluate:

```text
Eager
    app shell
    Planner
    authority bootstrap
    recovery/settings shell

Lazy
    Today
    Summary
```

This is a strong candidate, not a predetermined implementation.

Measure before/after.

---

# 9. Explicit Scope

Implement:

* Today query lifecycle;
* explicit evaluation instant;
* initial Today load;
* refresh behavior if needed;
* stale-response rejection;
* current user-day heading/context;
* variable-duration window display;
* all-day section;
* current section;
* next section;
* later section;
* elapsed/earlier section where useful;
* legacy timing-unavailable section;
* execution outcome labels;
* not-reported label;
* execution unavailable/protected state;
* known-empty state;
* missing-plan state;
* HistoricalPlan protected state;
* plan-attention section for unplaced/omitted/blocked;
* loading state;
* error/invalid-query state;
* accessibility;
* keyboard/focus behavior;
* responsive/mobile layout;
* Today lazy-boundary assessment/implementation;
* tests;
* bundle validation;
* governance.

---

# 10. Explicit Non-Goals

Do not implement:

* outcome-reporting writes;
* correction/retraction actions;
* Goal context;
* Progress context;
* Measurement reporting;
* friction actions;
* suggested fixes;
* same-day replanning;
* manual-event creation;
* drag/drop;
* rescheduling;
* tomorrow;
* selected historical date;
* reminders;
* notifications;
* Capacity;
* Recommendation;
* adaptive scheduling;
* transition strategies;
* sleep transition suggestions;
* Goal reorientation.

---

# 11. Execution Artifact Rules

Before implementation:

1. verify this Task 6.4 artifact;
2. save immutable project copy;
3. compare supplied/saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 6.3 result;
   * Task 6.3B result;
   * Task 6.3C result;
   * `TodaySurface`;
   * `queryToday`;
   * current primary navigation;
   * Summary lazy-loading pattern;
   * Summary stale-request handling;
   * app clock/time helper conventions;
   * accessibility/focus conventions;
   * responsive styles;
   * Task 5.19 bundle guard;
6. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-6/TASK_6.4_READ_ONLY_TODAY_V1_SURFACE_RESULT.md`

---

# 12. Initial Source Audit

Before code changes, confirm:

* exact Today query return shape;
* exact status discriminants;
* exact execution coverage state;
* exact all-day/timed/legacy collections;
* exact current/next/later/elapsed structure;
* exact plan-attention shape;
* exact provenance available;
* whether TodaySurface is currently eager;
* how Summary lazy import/preload is implemented;
* current top-level navigation focus behavior;
* current surface unmount/remount semantics;
* current bundle chunk assignment.

Do not design UI around assumed result names.

---

# 13. Component Placement

Prefer a bounded Today composition.

Conceptually:

```text
TodaySurface
    TodayHeader
    TodayPlanStatus
    TodayAllDay
    TodayCurrent
    TodayNext
    TodayLater
    TodayEarlier
    TodayPlanAttention
```

Do not over-componentize trivial markup.

Repository conventions govern exact names.

---

# 14. Application Boundary

React consumes:

```text
queryToday(...)
```

only.

Do not import:

* HistoricalPlan projection helpers;
* ExecutionHistory projection helpers;
* user-day resolvers;
* timing coverage helpers;

directly into presentation code unless they are purely formatting-safe and already part of the query result contract.

Strong preference: no domain reconstruction in UI.

---

# 15. Evaluation Instant

Today needs one explicit evaluation instant per query execution.

The UI may obtain this from:

* an injected app clock;
* `new Date()`/canonical state adapter at query initiation;

according to repository conventions.

Do not let child components call the wall clock independently.

---

# 16. Initial Query Timing

When the user enters Today:

```text
evaluationAsOf = canonical instant at query start
```

Use that same value through the result.

Do not recompute current/next locally while rendering.

---

# 17. Refresh Semantics

Decide whether Today V1 should expose an explicit **Refresh** action.

Two acceptable models:

### A. Query on entry only

Re-entering Today refreshes evaluation time.

### B. Query on entry + explicit Refresh

User may update the current evaluation instant while staying on Today.

Strong preference:

> Add a small explicit Refresh action if consistent with Summary and if it avoids hidden clock-driven updates.

Do not add automatic minute-by-minute polling in V1.

---

# 18. No Automatic Time Progression

Task 6.4 does not require timers.

If a user leaves Today open for an hour:

the displayed read model remains the result of its evaluation instant unless explicitly refreshed or re-entered.

This is epistemically cleaner than silently moving items between Current/Elapsed without corresponding authority refresh.

Document the chosen behavior.

---

# 19. Evaluation Time Display

Consider showing bounded copy such as:

> Updated 12:24 PM

or:

> As of 12:24 PM

This can explain why classifications remain stable until refresh.

Do not overburden the heading.

---

# 20. User-Day Heading

Primary heading:

**Today**

Secondary date label should use the canonical `userDayDate`.

Example:

```text
Today
Monday, August 24
```

Do not derive the label from civil calendar “now” independently.

---

# 21. User-Day Window Display

Show the canonical window in concise form where helpful:

```text
6:00 AM – tomorrow 6:00 AM
```

or for transition day:

```text
3:00 AM – tomorrow 6:00 AM
```

Use actual dates if ambiguity exists.

Do not say “24-hour day.”

---

# 22. Variable-Duration Disclosure

Do not necessarily show:

```text
27-hour user-day
```

as primary product copy.

But if the window is unusual, a subtle duration/context line may be useful.

Example:

> This user-day spans 27 hours because your schedule boundary changes.

Only use such explanatory copy if the query/result contains enough facts to support it without additional inference.

Otherwise show start/end only.

---

# 23. Known-Empty State

If:

```text
planCoverage = knownEmpty
```

show copy such as:

> This published plan contains no occurrences for this user-day.

Do not say:

* You're free today.
* Nothing to do.
* No commitments.

---

# 24. Missing Plan State

If no publication exists:

> No published plan is available for this user-day.

Do not reuse known-empty UI.

Optional navigation handoff to Planner is allowed:

**Open Planner**

Navigation only.

---

# 25. HistoricalPlan Protected State

Show recovery-oriented copy consistent with other protected authorities.

Do not render stale/partial plan items from prior query.

Do not fall back to Preview.

---

# 26. Execution Protected State

If plan is available but execution evidence is protected:

show schedule normally.

Execution copy should state:

> Outcome evidence is unavailable.

Do not label each item `Not reported`.

---

# 27. Execution Storage-Unavailable State

If canonical query distinguishes storage unavailable from protected:

preserve that distinction.

Do not overcomplicate item-level UI.

A section-level disclosure may be sufficient.

---

# 28. All-Day Section

If explicit V2 all-day occurrences exist:

heading:

**All day**

Render frozen:

* title;
* category if useful;
* execution outcome if available.

Do not display them as “Current.”

---

# 29. All-Day Outcome

If all-day occurrence has an explicit execution outcome:

show it neutrally.

Examples:

```text
Reported completed
Reported partial
Reported skipped
Not reported
```

Do not infer from all-day status.

---

# 30. Legacy Timing-Unavailable Section

If V1 scheduled occurrences exist:

use a dedicated bounded section.

Possible heading:

**Timing unavailable**

Copy:

> These older published items do not preserve whether they were all-day or timed.

Then show frozen title and interval if useful.

Do not put them into Current/Next/Later.

---

# 31. Legacy Density

Do not let legacy warnings dominate Today when only one old occurrence exists.

Use concise section-level explanatory copy.

---

# 32. Current Section

Heading:

**Current**

Render all timed occurrences classified current.

If none:

do not necessarily show an empty card.

Prefer omission of empty section unless product structure benefits from explicit emptiness.

Do not say:

* You're currently doing...
* In progress...

---

# 33. Current Item Copy

A current item may show:

```text
12:00 PM – 1:00 PM
Lunch
Not reported
```

The section heading itself supplies temporal meaning.

No “underway” badge.

---

# 34. Multiple Current Items

Render all.

Do not collapse into one “primary” item.

---

# 35. Next Section

Heading:

**Next**

Render the complete tied earliest-start group.

If two things begin at 2:00 PM, show both.

---

# 36. Later Section

Heading:

**Later**

Render remaining upcoming timed occurrences.

Use concise cards/list rows.

---

# 37. Earlier / Elapsed Section

Task 6.3 preserves elapsed items.

For Today V1, evaluate whether to render them by default.

Preferred:

> Include a bounded **Earlier** section below upcoming work because execution status provides useful context and prepares naturally for Task 6.5.

Do not make it visually dominant.

---

# 38. Elapsed Item Semantics

For an elapsed item with no report:

show:

**Not reported**

not:

* Missed
* Incomplete
* Skipped

For explicit skipped:

**Reported skipped**

---

# 39. Outcome Labels

Use neutral product language.

Preferred:

```text
Reported completed
Reported partial
Reported skipped
Not reported
Outcome unavailable
```

Avoid:

* Done
* Failed
* Missed
* Success

because those may collapse epistemic distinctions.

Task 6.5 may later introduce action-oriented copy.

---

# 40. Execution Outcome Placement

Outcome may be secondary metadata below time/title.

Do not overpower the schedule itself.

---

# 41. Category Display

Frozen category may be displayed if it improves scanability.

Do not rely on color alone.

If current Preview has category styling, reuse carefully without implying identical interaction semantics.

---

# 42. Frozen Titles

Use title from Today result / HistoricalPlan provenance.

Do not look up current Active labels.

---

# 43. Exact Times

Use frozen scheduled intervals.

Do not recompute from current commitment definitions.

---

# 44. Cross-Midnight Items

Format with date/day context when necessary.

Example:

```text
11:00 PM – tomorrow 1:00 AM
```

Do not truncate at civil midnight.

---

# 45. Transition-Day Items

Items near the extended/shortened end must render according to actual canonical window.

No visual 24-hour assumption.

---

# 46. Plan Attention Section

If any:

* unplaced;
* omitted;
* blocked;

exist, show a bounded section such as:

**Plan attention**

with counts and optionally exact frozen items.

Example:

```text
1 unplaced
1 blocked
```

Do not explain causes unless frozen evidence supports them.

---

# 47. Unplaced Copy

May say:

> Unplaced

Must not say:

* Skipped
* Failed
* Could not fit because...

without explicit evidence.

---

# 48. Omitted Copy

May say:

> Omitted

No causal interpretation.

---

# 49. Blocked Copy

May say:

> Blocked

No blame/cause/capacity interpretation.

---

# 50. Plan-Attention Drill-Down

Optional in V1.

If implemented, reuse accessible disclosure patterns from Summary.

Do not add actions.

If not needed for density, counts alone are acceptable.

Document decision.

---

# 51. No Friction UI

Do not show:

* friction reason;
* suggested fix;
* resolve button.

Task 6.8 owns convergence.

---

# 52. Navigation Handoff

Today V1 may offer:

**Open Planner**

for:

* missing plan;
* plan-attention context;

only as navigation.

Do not add deep-link infrastructure.

---

# 53. No Outcome Handoff Yet

Do not add:

* Record Outcome;
* Mark Complete;
* Report Skipped.

Task 6.5 owns writes.

---

# 54. Loading State

On entering Today:

show semantic loading state such as:

**Loading Today…**

This is appropriate now because a real query is occurring.

---

# 55. Loading Preservation

Do not leave old Today result visible under a new evaluation instant without an explicit refreshing state.

---

# 56. Error State

Invalid query/internal error remains distinct from:

* plan missing;
* plan protected;
* execution protected.

Use section/surface-local alert.

---

# 57. Stale Request Identity

Any stale-response guard should include:

* evaluation instant;
* active Today query generation;
* surface navigation away;
* restore/full-clear generation if applicable.

Old responses must not reappear after context change.

---

# 58. Leave-Today Race

Mandatory test:

```text
open Today
query begins

navigate Planner
query resolves
```

Expected:

* Today result does not incorrectly mutate visible Planner;
* returning to Today follows current query lifecycle semantics.

---

# 59. Refresh Race

If Refresh exists:

```text
query A
Refresh
query B
A resolves after B
```

B must remain effective.

---

# 60. Full-Clear Race

Old Today response must not reappear after full clear.

---

# 61. Restore Race

Old query result must not overwrite post-restore Today state.

---

# 62. Query-on-Entry

When entering Today from Planner/Summary:

trigger the canonical Today query.

Do not query continuously while Today is not active unless preload is explicitly justified.

---

# 63. Lazy Today Audit

Measure both:

### Current architecture

Today surface eager, query implementation lazy.

### Candidate architecture

Today surface and query lazy.

Compare:

* initial raw;
* initial gzip;
* Today chunk;
* total JS;
* navigation loading UX.

---

# 64. Lazy Today Preferred Outcome

Given 117 bytes of gzip headroom, strong expected result:

> Today surface becomes lazy-loaded.

But implement only if the chunk split is clean and does not duplicate large shared dependencies.

---

# 65. Today Lazy Chunk

If Today becomes lazy:

keep:

* nav contract;
* primary surface type;
* authority bootstrap;

eager.

Load Today presentation/query only on navigation intent.

---

# 66. Today Intent Preload

Evaluate simple intent preload similar to Summary:

* hover;
* focus;
* pointer intent.

Do not preload Today immediately on startup.

If Planner remains default, an intent preload can reduce navigation wait without sacrificing initial load.

---

# 67. Lazy Loading Fallback

Use:

**Loading Today…**

when the Today component chunk itself is loading.

Avoid duplicate nested loading copy if query also loads.

A single coherent loading state is preferable.

---

# 68. Lazy Failure

Reuse existing surface error behavior if available.

Do not build a large new error-boundary system.

---

# 69. Bundle Guard

Do not raise:

```text
Initial raw <= 685,000
Initial gzip <= 170,000
```

or any other Task 5.19 thresholds.

---

# 70. Bundle Success Criteria

Report separately:

* initial raw;
* initial gzip;
* Today lazy chunk;
* Summary lazy chunk;
* largest lazy;
* total JS.

Do not report only “budget passed.”

---

# 71. Accessibility — Surface

Today needs a semantic primary surface heading.

Navigation current state remains accessible.

---

# 72. Accessibility — Sections

Use semantic headings for:

* All day;
* Current;
* Next;
* Later;
* Earlier;
* Timing unavailable;
* Plan attention.

Do not render empty heading shells unnecessarily.

---

# 73. Accessibility — Outcome

Outcome meaning must be textual.

No color-only completion/skipped indication.

---

# 74. Accessibility — Time

Screen readers should receive complete interval text.

Avoid inaccessible icon-only clocks.

---

# 75. Accessibility — Refresh

If Refresh exists:

clear accessible label:

**Refresh Today**

Do not use only a circular-arrow icon.

---

# 76. Accessibility — Loading/Error

Use restrained status/alert semantics.

Avoid repeated announcements for every item.

---

# 77. Focus — Navigation Entry

Audit existing top-level behavior.

Preferred:

* navigation activation remains focused on nav control unless current app convention focuses surface heading;
* lazy load should not steal focus twice.

Preserve established surface behavior.

---

# 78. Focus — Refresh

Refresh should leave focus on Refresh control unless error handling requires otherwise.

Do not move focus to newly classified Current item automatically.

---

# 79. Mobile Information Hierarchy

On mobile, stack:

```text
Today/date/window

All day

Current

Next

Later

Earlier

Plan attention
```

No horizontal timeline requirement.

---

# 80. No DayVisualizer Requirement

Today V1 does not need the existing graphical DayVisualizer.

A stacked operational list is likely more appropriate.

Do not import a heavy visualizer merely for parity with Planner.

This also protects bundle size.

---

# 81. Desktop Layout

Prefer a readable operational column/card layout.

A possible bounded two-column layout is acceptable if it does not separate temporal order confusingly.

Strong preference:

* retain clear vertical chronology.

---

# 82. Responsive Cards

Use existing card/list primitives/classes where practical.

Do not introduce a UI library.

---

# 83. Empty Sections

Do not render repeated:

```text
No current items
No next items
No later items
```

unless user testing suggests value.

Known-empty plan has its own explicit state.

For a non-empty plan, simply omit empty categories where appropriate.

---

# 84. Current With All-Day

If all-day + current timed items exist:

All day appears first.

Then Current.

Do not merge them.

---

# 85. All-Day Only

If plan contains only all-day items:

show All day.

Do not say no current schedule.

---

# 86. Legacy Only

If plan contains only V1 legacy occurrences:

show Timing unavailable section.

Do not label plan empty.

---

# 87. Attention Only

If plan has no scheduled occurrences but has unplaced/omitted/blocked:

show plan attention.

Plan is not known-empty if HistoricalPlan publication contains occurrences in non-scheduled dispositions.

Use actual `planCoverage` semantics from query.

---

# 88. Execution Protected With Earlier Items

Show timing/chronology.

Suppress or replace outcome metadata consistently:

**Outcome unavailable**

Do not hide elapsed items.

---

# 89. Evaluation Cutoff Copy

If execution correction/retraction after evaluation instant is not included, Today should not need a tutorial about it.

A simple **As of** timestamp is enough.

---

# 90. Same-Day Republication

Today query naturally displays whichever plan is effective at its evaluation instant.

No special UI badge required.

Future live-update/replanning work can expose changes.

---

# 91. Current State Does Not Auto-Advance

If Refresh is explicit, document in product behavior:

classification represents the evaluation time.

This avoids hidden timers in V1.

---

# 92. Component API

Keep TodaySurface API small.

Potential:

```text
queryToday
onOpenPlanner
```

or store-driven query boundary according to current app conventions.

Do not pass raw HistoricalPlan/ExecutionHistory.

---

# 93. State Ownership

Surface-local ephemeral state may include:

* loading;
* error;
* query result;
* query generation;
* refresh instant;
* optional disclosure.

No durable state.

---

# 94. Unmount Behavior

Leaving Today may discard local read result.

That is acceptable if re-entry re-queries.

Do not persist Today results just to avoid reload.

---

# 95. Restore / Full Clear

If Today is active during restore/full clear:

invalidate current result and re-query or show canonical unavailable state according to current app subscription architecture.

Do not display pre-change plan.

---

# 96. Authority Subscriptions

Audit whether Today should subscribe to relevant authority changes.

Potential model:

* HistoricalPlan/ExecutionHistory changes invalidate/re-query using a **new evaluation instant** only if user explicitly refreshes;
* or re-query at the existing evaluation instant.

For V1, strong preference:

> Keep evaluation semantics explicit. Authority changes may invalidate and re-query at the same evaluation cutoff unless the user refreshes.

This mirrors Summary's cutoff discipline.

Document actual implementation.

---

# 97. Same-Cutoff Authority Changes

If ExecutionHistory records are added after the query cutoff:

same-cutoff re-query must not show them.

A later Refresh/new evaluation instant may.

Mandatory test where practical.

---

# 98. No Polling

Do not introduce interval timers.

---

# 99. Tests — Available Today

Cover a mixed day with:

* all-day;
* current;
* tied next;
* later;
* elapsed;
* execution outcomes;
* plan attention.

---

# 100. Tests — Variable Day

Render at least:

* longer transition day;
* shorter transition day.

Verify displayed window reflects canonical start/end.

No 24h copy.

---

# 101. Tests — Known Empty

Correct copy.

No “free day.”

---

# 102. Tests — Missing Plan

Correct unavailable copy.

Planner handoff if implemented.

---

# 103. Tests — HistoricalPlan Protected

Recovery copy.

No Preview fallback content.

---

# 104. Tests — Execution Protected

Schedule remains visible.

Outcome shows unavailable rather than notReported.

---

# 105. Tests — All-Day

All-day section.

No Current classification.

---

# 106. Tests — Legacy V1

Timing unavailable section.

No timed/all-day guess.

---

# 107. Tests — Current

Current heading/entries.

No `underway` or `in progress` copy.

---

# 108. Tests — Elapsed Unreported

Earlier item shows Not reported.

No missed/skipped inference.

---

# 109. Tests — Explicit Outcomes

Completed/partial/skipped are clearly prefixed/worded as reported evidence.

---

# 110. Tests — Multiple Current

All render.

---

# 111. Tests — Tied Next

All tied items render under Next.

---

# 112. Tests — Attention

Unplaced/omitted/blocked remain distinct.

No cause/blame language.

---

# 113. Tests — Refresh

If implemented:

* evaluation instant changes;
* loading state;
* result replacement;
* stale old response ignored.

---

# 114. Tests — Navigation Race

Today query resolving after leaving surface cannot corrupt another surface.

---

# 115. Tests — Clear/Restore

No stale Today result.

---

# 116. Tests — Same-Cutoff Evidence

New report after cutoff does not appear unless refreshed with later evaluation time.

---

# 117. Tests — Lazy Today

If implemented:

* Today component not in initial eager path;
* loading fallback;
* resolved surface;
* intent preload if added.

Use existing Task 5.19 test style.

---

# 118. Tests — Accessibility

Cover:

* Today heading;
* section headings;
* outcome text;
* Refresh accessible name;
* loading status;
* protected/error alert semantics;
* navigation current state.

---

# 119. Tests — Unauthorized Copy

Assert absence where relevant:

* underway;
* in progress;
* missed;
* failed;
* you're free;
* nothing to do;
* on track;
* behind;
* recommendation;
* capacity.

---

# 120. Tests — Read-Only Boundary

Assert no mutation controls:

* Complete;
* Partial;
* Skip;
* Move;
* Add Event;
* Resolve;
* Record Value.

Be careful not to reject unrelated navigation text elsewhere in app.

---

# 121. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.4_READ_ONLY_TODAY_V1_SURFACE_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.3 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Component Placement
7. Application Query Boundary
8. Query Lifecycle
9. Evaluation Instant
10. Refresh Decision
11. Automatic Time Progression Decision
12. User-Day Heading
13. User-Day Window
14. Variable-Duration Presentation
15. Known-Empty State
16. Missing Plan
17. HistoricalPlan Protection
18. Execution Protection
19. All-Day Section
20. All-Day Outcomes
21. Legacy Timing-Unavailable Section
22. Current Section
23. Multiple Current
24. Next Section
25. Tied Next
26. Later Section
27. Earlier/Elapsed Section
28. Outcome Copy
29. Frozen Titles/Times
30. Cross-Midnight Presentation
31. Plan Attention
32. Unplaced Presentation
33. Omitted Presentation
34. Blocked Presentation
35. Drill-Down Decision
36. Planner Handoff
37. Loading State
38. Error State
39. Stale Request Handling
40. Navigation Race
41. Refresh Race
42. Clear/Restore Race
43. Authority Subscription Strategy
44. Same-Cutoff Authority Changes
45. Lazy Today Audit
46. Today Loading Architecture
47. Preload Decision
48. Bundle Comparison
49. Accessibility
50. Keyboard/Focus
51. Responsive Behavior
52. Mobile Layout
53. Desktop Layout
54. No-Visualizer Decision
55. Read-Only Boundary
56. Tests Added/Changed
57. Focused Validation
58. Full Validation
59. Bundle Validation
60. Manual Product Walkthrough
61. Governance Updates
62. ADR Determination
63. Deviations
64. Discoveries
65. Deferred Work
66. Today Structure Matrix
67. State Matrix
68. Timing Matrix
69. Execution Copy Matrix
70. Attention Matrix
71. Loading Matrix
72. Accessibility Matrix
73. Responsive Matrix
74. Bundle Matrix
75. Product-Boundary Matrix
76. Epistemic Matrix
77. Architectural Invariant Assessment
78. Stop-Condition Assessment
79. Architectural Alignment Assessment
80. Task 6.5 Readiness
81. Recommended Next Task
82. Final Completion Determination

---

# 122. Required Today Structure Matrix

Produce:

| Section            | Source                   | Render condition | Writes? |
| ------------------ | ------------------------ | ---------------- | ------: |
| Heading/window     | Today query              | available        |      no |
| All day            | V2 allDay                | non-empty        |      no |
| Timing unavailable | V1                       | non-empty        |      no |
| Current            | timed current            | non-empty        |      no |
| Next               | timed next               | non-empty        |      no |
| Later              | timed later              | non-empty        |      no |
| Earlier            | timed elapsed            | non-empty        |      no |
| Plan attention     | unplaced/omitted/blocked | non-empty        |      no |

---

# 123. Required State Matrix

Produce:

| Plan state    | Execution state | Presentation |
| ------------- | --------------- | ------------ |
| available     | available       |              |
| available     | protected       |              |
| known empty   | available       |              |
| missing       | any             |              |
| protected     | any             |              |
| loading       | n/a             |              |
| invalid/error | n/a             |              |

---

# 124. Required Timing Matrix

Produce:

| Timing state         | Section            |
| -------------------- | ------------------ |
| V2 allDay            | All day            |
| V2 timed current     | Current            |
| V2 timed next        | Next               |
| V2 timed later       | Later              |
| V2 timed elapsed     | Earlier            |
| V1 unavailableLegacy | Timing unavailable |

---

# 125. Required Execution Copy Matrix

Produce:

| Canonical evidence   | UI copy |
| -------------------- | ------- |
| completed            |         |
| partial              |         |
| skipped              |         |
| notReported          |         |
| unavailableProtected |         |
| unavailable storage  |         |

---

# 126. Required Attention Matrix

Produce:

| Disposition | UI label | Must not imply |
| ----------- | -------- | -------------- |
| unplaced    |          |                |
| omitted     |          |                |
| blocked     |          |                |

---

# 127. Required Loading Matrix

Produce:

| Concern                  | Decision |
| ------------------------ | -------- |
| Today surface eager/lazy |          |
| Today query eager/lazy   |          |
| fallback                 |          |
| intent preload           |          |
| query on entry           |          |
| explicit refresh         |          |
| automatic polling        |          |
| stale-response guard     |          |

---

# 128. Required Accessibility Matrix

Produce:

| Element          | Requirement           | Result |
| ---------------- | --------------------- | ------ |
| Today heading    | semantic              |        |
| user-day window  | textual               |        |
| section headings | semantic              |        |
| outcomes         | text, not color-only  |        |
| Refresh          | clear accessible name |        |
| loading          | status                |        |
| protection/error | alert/bounded message |        |
| primary nav      | current state         |        |

---

# 129. Required Responsive Matrix

Produce:

| Area           | Desktop | Mobile |
| -------------- | ------- | ------ |
| heading/window |         |        |
| All day        |         |        |
| Current        |         |        |
| Next           |         |        |
| Later          |         |        |
| Earlier        |         |        |
| attention      |         |        |
| legacy section |         |        |

---

# 130. Required Bundle Matrix

Use Task 6.3 baseline:

| Metric             |     Task 6.3 | Task 6.4 | Delta |
| ------------------ | -----------: | -------: | ----: |
| Initial raw        |      682,706 |          |       |
| Initial gzip       |      169,883 |          |       |
| Today lazy chunk   | 4,890 approx |          |       |
| Summary lazy chunk |       30,091 |          |       |
| Largest lazy       |       30,091 |          |       |
| Total JS           |      717,687 |          |       |

Record fresh exact values.

---

# 131. Required Product-Boundary Matrix

Produce:

| Capability                 | Task 6.4 |
| -------------------------- | -------- |
| read-only Today            |          |
| current user-day display   |          |
| all-day display            |          |
| current/next/later         |          |
| earlier/elapsed            |          |
| execution evidence display |          |
| legacy timing display      |          |
| plan attention             |          |
| Today writes               |          |
| outcome reporting          |          |
| Goal context               |          |
| Progress context           |          |
| friction actions           |          |
| replanning                 |          |
| Recommendations            |          |
| Capacity                   |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 132. Required Epistemic Matrix

Produce:

| Evidence/state           | May say                           | Must not say               |
| ------------------------ | --------------------------------- | -------------------------- |
| current timed occurrence | scheduled now                     | underway                   |
| elapsed item             | earlier/elapsed                   | completed/skipped          |
| notReported              | not reported                      | missed                     |
| completed                | reported completed                | success                    |
| allDay                   | all-day planned item              | user spent whole day on it |
| V1 legacy                | timing unavailable                | timed/all-day guess        |
| known empty              | published plan has no occurrences | free day                   |
| missing plan             | no published plan available       | nothing scheduled          |
| execution protected      | outcome unavailable               | not reported               |
| unplaced                 | unplaced                          | skipped                    |
| blocked                  | blocked                           | blame/cause                |

---

# 133. Architectural Invariants

Assess at minimum:

1. Today UI consumes canonical query only.
2. React does not reconstruct user-day.
3. React does not query HistoricalPlan directly.
4. React does not query ExecutionHistory directly.
5. Today remains read-only.
6. no Today write exists.
7. evaluation instant is explicit.
8. no child component reads independent wall clock for classification.
9. variable-duration window is displayed truthfully.
10. no 24-hour assumption exists.
11. known-empty differs from missing.
12. HistoricalPlan protection differs from missing.
13. Execution protection differs from notReported.
14. all-day is separate from Current.
15. V1 legacy is separate from timed/all-day.
16. Current does not imply underway.
17. elapsed does not imply outcome.
18. notReported does not imply skipped.
19. explicit outcome is labeled as reported evidence.
20. multiple Current items are retained.
21. tied Next items are retained.
22. Later order is preserved.
23. Earlier order is preserved.
24. frozen title is used.
25. frozen interval is used.
26. current Active does not rewrite display evidence.
27. plan attention remains separate from timeline.
28. unplaced remains unplaced.
29. omitted remains omitted.
30. blocked remains blocked.
31. no cause inference exists.
32. no blame inference exists.
33. no friction action exists.
34. no outcome action exists.
35. no Goal action exists.
36. no Progress action exists.
37. no same-day replanning exists.
38. no automatic polling exists unless explicitly justified.
39. evaluation timestamp is understandable.
40. stale responses cannot overwrite newer query.
41. leaving Today does not corrupt another surface.
42. restore invalidates stale Today result.
43. full clear invalidates stale Today result.
44. same-cutoff authority semantics remain intact.
45. Today result is not persisted.
46. Today result may be discarded on unmount.
47. Planner remains default.
48. Planner behavior remains unchanged.
49. Summary behavior remains unchanged.
50. primary navigation remains accessible.
51. Today surface heading is semantic.
52. sections use semantic headings.
53. outcomes are not color-only.
54. mobile requires no horizontal timeline.
55. DayVisualizer is not required.
56. no UI library is added.
57. Today lazy-loading is explicitly evaluated.
58. bundle thresholds are not raised.
59. initial gzip budget remains governing.
60. eager-growth pressure is treated architecturally.
61. Today chunking avoids unnecessary dependency duplication.
62. intent preload is bounded if implemented.
63. lazy loading has a truthful fallback.
64. query loading and chunk loading do not create confusing duplicate states.
65. tests cover variable-duration days.
66. tests cover all-day.
67. tests cover V1 legacy.
68. tests cover execution protection.
69. tests cover known empty.
70. tests cover missing plan.
71. tests cover multiple Current.
72. tests cover tied Next.
73. tests cover elapsed unreported.
74. tests cover explicit outcomes.
75. tests cover attention states.
76. tests cover stale query races.
77. tests cover read-only boundary.
78. tests cover unauthorized copy.
79. focused validation passes.
80. full validation passes.
81. bundle guard passes.
82. Task 6.5 remains first authorized Today write task.

---

# 134. Stop Conditions

Stop and report if:

* Today query result cannot be rendered without additional semantic interpretation;
* legacy V1 must be guessed to fit the UI;
* execution protection cannot be represented separately;
* variable-duration window cannot be shown truthfully without a major visualizer dependency;
* adding Today UI forces bundle thresholds upward;
* Today cannot be lazy-loaded cleanly despite bundle pressure and eager implementation exceeds budget;
* lazy Today duplicates large dependencies materially;
* stale-query protection cannot prevent cross-surface overwrite;
* Task 6.4 would need outcome-reporting writes;
* Task 6.4 would need Goal/Progress context to be coherent;
* a router is required.

Do not widen scope around blockers.

---

# 135. Focused Validation

Run focused suites covering:

* TodaySurface;
* primary navigation;
* Today query integration;
* variable-duration display;
* all-day/legacy/timed sections;
* execution states;
* plan attention;
* protection;
* loading/error;
* stale requests;
* lazy surface behavior;
* accessibility.

Record exact files/test counts.

---

# 136. Full Validation

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

Use repository-standard variants if needed.

Record:

* test-file count;
* test count;
* module count;
* initial raw;
* initial gzip;
* Today chunk;
* Summary chunk;
* largest lazy;
* total JS;
* diff result.

---

# 137. Manual Product Walkthrough

If interactive browser access is available, inspect:

### Stable day

* heading/date/window;
* Current/Next/Later/Earlier;
* outcomes.

### Long transition day

* extended window;
* late item remains visible.

### Short transition day

* shortened window;
* no phantom 24-hour framing.

### All-day

* separate All day section.

### Legacy

* Timing unavailable section.

### Known empty

* truthful published-empty copy.

### Missing/protected

* correct distinction.

### Mobile

* stacked chronology;
* no horizontal timeline;
* readable outcome metadata.

If not performed, state explicitly.

---

# 138. Governance

Update:

* Task 6.4 result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Do not add ADR unless implementation establishes a genuinely new enduring surface/loading rule.

If Today becomes permanently lazy as a primary surface, determine whether Task 5.19 bundle architecture ADR/governance should be updated.

---

# 139. Task 6.5 Readiness

If Task 6.4 completes:

> **Task 6.5 — Today Outcome Reporting Integration** becomes authorized.

That task may add bounded writes for scheduled occurrence outcomes using existing ExecutionHistory commands.

It must not redesign Today read semantics.

---

# 140. Recommended Next Task

If green:

> **Task 6.5 — Today Outcome Reporting Integration.**

---

# 141. Completion Criteria

Task 6.4 is complete only when:

* Today placeholder is replaced by a real read-only Today surface;
* Today uses `queryToday` as its sole semantic application input;
* current canonical user-day label/window is visible;
* variable-duration days are presented without 24-hour assumptions;
* known-empty is distinct from missing plan;
* plan protection is distinct from missing;
* execution protection is distinct from notReported;
* explicit all-day occurrences have their own section;
* V1 legacy occurrences have their own timing-unavailable section;
* explicit timed occurrences render Current/Next/Later/Earlier correctly;
* multiple Current items are preserved;
* tied Next items are preserved;
* elapsed-unreported remains Not reported;
* explicit completed/partial/skipped outcomes are shown as reported evidence;
* frozen titles and times are used;
* cross-midnight intervals are formatted truthfully;
* unplaced/omitted/blocked plan attention is visible without causal inference;
* no Today writes exist;
* no outcome-reporting actions exist;
* no Goal/Progress/friction/replanning actions exist;
* query lifecycle uses an explicit evaluation instant;
* automatic polling is absent unless explicitly justified;
* stale request races are rejected;
* clear/restore cannot revive stale Today results;
* Today loading architecture is measured;
* Today becomes lazy if necessary to preserve bundle budgets;
* bundle thresholds are not raised;
* initial raw/gzip budgets remain green;
* accessibility, focus, desktop, and mobile behavior are sound;
* no DayVisualizer dependency is required;
* no new authority/persistence/schema/Backup version exists;
* focused and full validation pass;
* governance records Today V1 as user-visible and read-only;
* Task 6.5 remains the first task authorized to add Today writes.

---

# 142. Final Implementation Principle

> **Today should make the current user-day legible without pretending to know more than DayFrame actually knows.**

The surface should show what was published, where timed work sits relative to the evaluation instant, what was explicitly reported, what remains unknown, and where the plan itself contains unresolved dispositions—without turning any of those facts into judgment or advice.

---

# 143. Final Completion Statement

**Task 6.4 is complete when DayFrame replaces the Today placeholder with an accessible, responsive, read-only operational surface driven exclusively by the canonical `queryToday({ evaluationAsOf })` application contract; when the surface presents the exact canonical current user-day and its variable-duration window, separates explicit V2 all-day occurrences from explicit V2 timed Current/Next/Later/Earlier groups, preserves V1 timing-unavailable legacy occurrences without guessing, shows exact reported completed/partial/skipped evidence separately from not-reported or execution-unavailable states, preserves multiple current overlaps and tied next starts, distinguishes known-empty plans from missing or protected HistoricalPlan, surfaces unplaced/omitted/blocked plan attention without cause or blame inference, uses frozen historical titles/times rather than current authored enrichment, performs no outcome, Goal, Progress, friction, event, or replanning writes, uses one explicit evaluation instant without hidden polling, prevents stale navigation/refresh/restore/clear responses from overwriting current state, presents loading/protection/error states truthfully, remains keyboard-accessible and mobile-friendly without requiring a graphical 24-hour timeline, evaluates and if necessary implements a lazy Today surface boundary so the governing initial raw/gzip bundle budgets remain green without threshold inflation, passes focused and canonical validation, and leaves Task 6.5 as the first task authorized to make Today interactive through existing ExecutionHistory reporting commands.**
