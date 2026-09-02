# Phase 7 Audit 01 — Monthly Planner Primary Surface Architecture and Interaction Model

## Status

Ready for architecture/product audit.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Audit Type

Current-system trace, product-surface architecture audit, read-model assessment, interaction-boundary analysis, authority-preservation review, responsive/month-navigation assessment, and implementation-readiness determination.

**This is an audit and architecture-definition task. Do not implement production behavior.**

---

# 1. Objective

Determine the correct architecture for evolving DayFrame's current Planner into the originally intended **Monthly Planner primary surface**.

The target product hypothesis is:

```text
Planner
│
├── Month Calendar
│     primary spatial/navigation surface
│
└── Contextual Workspace
      ├── Review Day
      ├── Add Commitment
      ├── Edit Commitment
      ├── Add/Edit Event
      ├── Work
      └── Resolve Friction
```

The audit must determine whether this hypothesis follows naturally from the current architecture or whether repository evidence requires a different model.

Do not assume that the existing:

```text
Planner
├── Plan
└── Review Schedule
```

must survive as permanent destinations.

Equally, do not remove them merely because the proposed Monthly Planner appears cleaner.

Trace what responsibilities they currently perform and determine where those responsibilities belong in the mature product.

---

# 2. Governing Product Principle

> **Users define priorities; DayFrame builds schedules.**

The Monthly Planner must not accidentally transform DayFrame into a conventional manual calendar application.

The month surface should primarily allow the user to:

* understand the schedule DayFrame has built;
* navigate time spatially;
* inspect a user-day;
* identify important commitments/events/work;
* identify plan attention;
* enter contextual authored editing;
* enter contextual friction resolution;
* add explicit user-authored Events;
* request/regenerate planning when appropriate.

It must not silently introduce direct schedule-placement authority.

---

# 3. Governing Surface Model

Phase 6 established:

```text
Planner
    authored intent
    generated schedule review
    contextual planning resolution

Today
    current published plan
    execution reporting

Summary
    historical evidence
    progress interpretation
```

The audit must preserve those responsibilities unless repository evidence demonstrates a contradiction.

The Monthly Planner is a proposed evolution **inside Planner**, not a fourth primary authority surface.

---

# 4. Governing Temporal Principle

DayFrame's canonical temporal model is not a civil-calendar-midnight model.

For local user-day label `D`:

```text
prefs(D) = effective authored schedule preferences for D

start(D) = local calendar date D
           at prefs(D).dayBoundaryStartTime

userDay(D) = [start(D), start(D+1))
```

Therefore user-days may be:

* shorter than 24 elapsed hours;
* exactly 24 elapsed hours;
* longer than 24 elapsed hours.

The month grid may use civil-calendar labels spatially, but selecting a date must resolve to the canonical DayFrame user-day carrying that label.

Do not allow the month UI to redefine temporal ownership.

---

# 5. Governing Authority Principle

Audit every proposed Monthly Planner interaction against existing authority.

At minimum distinguish:

* Active authored setup;
* Goals/Measurements;
* Manual Events;
* Preview/generated schedule;
* PlanDecision;
* HistoricalPlan;
* ExecutionHistory;
* profiles;
* restore/recovery state.

The Monthly Planner should project and navigate existing truth.

Do not create a durable `MonthlyPlanner` authority merely because a month view exists.

---

# 6. Governing Interaction Principle

The audit must distinguish:

```text
selecting
navigating
inspecting
authoring
regenerating
resolving
reporting
```

These are not interchangeable actions.

In particular:

> Selecting or clicking a scheduled occurrence must not imply that the occurrence itself is directly editable schedule geometry.

A scheduled Commitment should normally navigate to its authored source.

An Event may navigate to its Event authority.

Work should navigate to Work configuration.

A friction indicator may navigate to bounded resolution.

Execution reporting remains Today responsibility unless a later architecture explicitly changes that boundary.

---

# 7. Phase 6 Prerequisite Confirmation

Confirm before proposing architecture that Phase 6 actually provides:

* Planner / Today / Summary primary surfaces;
* canonical variable-duration user-days;
* exact Commitment identity;
* exact Event identity;
* HistoricalPlan timing provenance;
* Today current-user-day read model;
* Today outcome reporting;
* Summary historical progress/evidence;
* converged Commitment authoring;
* selected-day Event workflow;
* Review Schedule;
* Needs attention;
* Try;
* Apply Planning Change;
* lazy Plan authoring;
* lazy Today;
* lazy Summary;
* mobile/browser validation.

If a required prerequisite is absent, classify it rather than assuming it.

---

# 8. Current Planner Composition Audit

Trace the production Planner composition.

Document:

* top-level Planner component(s);
* Plan sub-surface;
* Review Schedule sub-surface;
* selected-day state;
* calendar state;
* contextual editor state;
* SetupDraft ownership;
* lazy boundaries;
* navigation state;
* schedule generation actions;
* stale schedule state;
* current focus-management conventions.

Identify exactly which responsibilities currently belong to Plan versus Review Schedule.

---

# 9. Current Plan Responsibility Inventory

Inventory everything currently exposed through Plan.

At minimum determine where the user currently manages:

* Goals;
* Commitments;
* Schedule Preferences;
* Planning Range;
* Work;
* advanced Commitment fields;
* Save Setup.

For each classify it as:

* likely persistent Planner-level configuration;
* likely contextual workspace behavior;
* likely secondary/advanced configuration;
* uncertain.

Do not redesign yet.

---

# 10. Current Review Schedule Responsibility Inventory

Inventory everything currently exposed through Review Schedule.

At minimum trace:

* calendar/range navigation;
* selected user-day;
* scheduled occurrences;
* Work;
* Events;
* all-day items;
* unplaced;
* Needs attention;
* friction participants;
* contextual Edit Commitment;
* contextual Edit Event;
* contextual Work;
* Try;
* Apply Planning Change;
* Generate Schedule;
* Refresh Schedule;
* stale schedule.

Determine which responsibilities naturally belong in a Monthly Planner.

---

# 11. Existing Calendar Audit

Trace the current calendar implementation.

Determine:

* whether it is a true month grid or bounded date selector;
* how visible dates are derived;
* how selected day is stored;
* whether calendar date means civil date or user-day label;
* how range edges behave;
* how month navigation currently works, if at all;
* whether schedule contents are projected into cells;
* accessibility semantics;
* keyboard semantics;
* responsive behavior.

Do not assume the existing calendar should be enlarged into the final month surface.

---

# 12. Monthly Planner Product Hypothesis

Evaluate this target:

```text
┌───────────────────────────────────────────────────────────────┐
│ Planner                                  August 2026          │
├───────────────────────────────────────────────────────────────┤
│ Sun      Mon      Tue      Wed      Thu      Fri      Sat     │
│                                                               │
│  2        3        4        5        6        7        8      │
│           Work     Work     Work     Work     Work             │
│           Sleep    Sleep    Sleep    Sleep    Sleep            │
│                             Gym                               │
│                                                               │
│  9       10       11       12       13       14       15      │
│                            ⚠                                  │
│                                                               │
│ ...                                                           │
├───────────────────────────────────────────────────────────────┤
│ Wednesday, August 12                                         │
│                                                               │
│ Work             06:15 – 18:15                               │
│ Sleep            22:30 – 05:30                               │
│ Gym              19:15 – 20:15                               │
│ Needs attention                                               │
│                                                               │
│ + Add Event     Edit Commitment     Resolve                   │
└───────────────────────────────────────────────────────────────┘
```

This is illustrative only.

Determine from repository evidence what the actual architecture should be.

---

# 13. Primary-Surface Determination

Answer explicitly:

**Should the Month Calendar become the dominant default Planner surface?**

Consider:

* frequency of expected use;
* existing navigation responsibilities;
* current selected-day semantics;
* planning horizon;
* authored setup access;
* friction resolution;
* mobile constraints;
* accessibility;
* schedule regeneration;
* information density.

Return one of:

### A. Adopt Monthly Planner as dominant Planner surface

### B. Keep Plan/Review Schedule and add Month as another Planner mode

### C. Use another architecture

Explain the evidence.

---

# 14. Plan / Review Schedule Convergence Assessment

Determine whether:

```text
Plan
Review Schedule
```

are final product destinations or transitional implementation boundaries.

For every existing responsibility, map its likely mature destination.

Produce:

| Current responsibility | Current location | Proposed mature location | Reason |
| ---------------------- | ---------------- | ------------------------ | ------ |

Do not delete responsibilities from the model.

---

# 15. Contextual Workspace Architecture

Determine whether selecting a date should establish one canonical Planner context:

```text
selectedUserDayDate
```

and whether contextual operations should derive from that context.

Audit whether this state should be:

* ephemeral application state;
* URL/navigation state;
* existing store state;
* component state;
* another mechanism.

Do not introduce persistence without evidence.

---

# 16. Selected User-Day Semantics

The selected date in the month grid must represent a **user-day label**, not necessarily midnight-to-midnight time.

Audit the cleanest contract:

```text
selected label
    ↓
canonical user-day resolver
    ↓
[start(D), start(D+1))
```

Determine whether existing Review Schedule selected-day behavior already satisfies this invariant.

---

# 17. Month Grid vs User-Day Geometry

Determine how a conventional seven-column month grid should coexist with variable-duration user-days.

Expected architectural distinction:

```text
Month Grid
    spatial date-label navigation

Selected Day Workspace
    canonical temporal geometry
```

Audit whether any subsystem currently conflates these.

A 22-hour or 26-hour user-day should still occupy one month-grid cell.

The detailed view must remain temporally truthful.

---

# 18. User-Week Interaction

Confirm whether the month grid can safely group seven civil date labels visually without redefining DayFrame's canonical user-week semantics.

Audit:

* `weekStartsOn`;
* variable boundaries;
* week transitions;
* shift-segment overrides;
* recurrence grouping.

Do not assume a visual calendar row is authoritative user-week identity.

---

# 19. Month Semantics

Determine what “August 2026” should mean in the Planner.

Candidate interpretation:

> the set of user-day labels whose labels are civil dates in August 2026.

Audit whether this is sufficient.

Do not define month as a fixed elapsed-duration interval.

Do not invent a durable user-month authority unless required.

---

# 20. Month Navigation

Determine the appropriate navigation model:

* previous month;
* next month;
* Today/current user-day;
* selected day;
* direct month/year navigation if justified.

Determine how navigation interacts with:

* Planning Range;
* generated Preview range;
* stale Preview;
* unpublished dates;
* dates outside generated range.

---

# 21. Planning Range Relationship

This is a critical question.

The user may navigate a month whose dates are partly or wholly outside the current generated Planning Range.

Audit the truthful product behavior.

Possible states include:

```text
month visible
schedule coverage partial
schedule coverage absent
```

Determine whether the calendar should:

* permit navigation regardless of generated coverage;
* visually distinguish ungenerated dates;
* offer generation/extension actions;
* constrain navigation.

Do not equate “not generated” with “free.”

---

# 22. Month Read-Model Assessment

Determine whether the Monthly Planner needs a canonical application read model.

Candidate shape:

```text
queryPlannerMonth({
    month,
    selectedUserDayDate,
    evaluationContext?
})
```

Do not adopt this signature automatically.

Determine:

* source authorities;
* input contract;
* output contract;
* range behavior;
* stale state;
* partial coverage;
* protected/unavailable behavior;
* deterministic ordering;
* clone isolation.

---

# 23. Read-Model Authority Assessment

Determine what a month projection actually needs.

Potential sources:

* Preview;
* Active authored setup;
* Events;
* Goals;
* Work/cycles;
* PlanDecision;
* HistoricalPlan.

The audit must establish the minimum legitimate source set.

In particular determine:

**Should the planning month display current Preview geometry, HistoricalPlan geometry, authored data, or a composition?**

Do not blur planning truth and published historical truth.

---

# 24. Preview Role

Phase 6 preserves Preview as derived planning state.

Determine whether the Monthly Planner should become the primary presentation of Preview.

Candidate:

```text
authored intent
      ↓
Generate / Refresh
      ↓
Preview
      ↓
Monthly Planner
```

Audit whether this is consistent with existing Review Schedule behavior.

---

# 25. HistoricalPlan Boundary

Determine whether HistoricalPlan has any legitimate role in the Monthly Planner.

Possible use cases:

* past dates;
* already-published dates;
* comparison;
* none.

Do not import historical authority merely to populate empty month cells.

If future/present planning uses Preview and past dates use HistoricalPlan, determine whether that hybrid is epistemically coherent or should be deferred.

---

# 26. Today Boundary

Determine the relationship between:

```text
Monthly Planner selected current day
```

and:

```text
Today
```

The Planner may show today's scheduled geometry.

Today owns current-plan execution reporting.

Determine whether the Planner should:

* provide a “Go to Today” handoff;
* display outcome indicators read-only;
* display no execution evidence;
* use another bounded relationship.

Do not duplicate Today writes.

---

# 27. Summary Boundary

Determine whether the Monthly Planner should expose any Summary-derived progress information.

Default hypothesis:

**No.**

Progress interpretation belongs to Summary.

Audit whether any minimal Goal indicator belongs in month cells without importing historical analysis.

---

# 28. Month Cell Information Architecture

Determine what information belongs inside a month cell.

Candidate evidence:

* date label;
* Work;
* key scheduled Commitments;
* Events;
* all-day indicators;
* Needs attention;
* unplaced count;
* schedule coverage/stale state.

Evaluate information density.

Explicitly identify what should **not** appear.

---

# 29. Occurrence Density

Audit realistic high-density days.

Determine whether month cells should:

* show all occurrences;
* show first N + overflow count;
* group by category/source;
* use compact indicators;
* another deterministic policy.

Do not allow storage order to decide visible priority.

If prioritization is required, distinguish presentation ordering from Goal ranking.

---

# 30. Month Cell Ordering

Determine deterministic ordering for visible scheduled items.

Possible inputs:

* all-day before timed;
* start time;
* Work precedence;
* source family;
* canonical exact identity.

Do not introduce semantic priority unless existing architecture supports it.

---

# 31. All-Day Presentation

Audit how user-day-wide all-day Events should appear in a month cell.

They should not be treated as civil-midnight events.

Determine whether the cell merely displays the all-day label while selected-day detail carries exact geometry.

---

# 32. Cross-Boundary Occurrences

Determine how an occurrence that extends across visual civil-date boundaries should appear.

Historical/Preview day membership is authoritative.

Do not duplicate an occurrence into neighboring month cells merely because its interval crosses midnight unless existing plan membership explicitly requires that representation.

---

# 33. Work Presentation

Determine appropriate month-cell representation of Work.

Possibilities:

* label;
* shift name;
* compact time;
* icon/indicator;
* selected-day detail only.

Avoid overwhelming cells for shift workers whose Work occurs most days.

---

# 34. Sleep Presentation

Sleep may be an ordinary Commitment/category.

Determine whether month cells should treat Sleep specially.

Default hypothesis:

**No special authority semantics.**

Presentation compression may still be justified.

Separate presentation policy from scheduling semantics.

---

# 35. Commitment Interaction

Audit the desired behavior when a user activates a scheduled Commitment occurrence in the month/day workspace.

Expected:

```text
scheduled occurrence
      ↓
exact current authored source?
      ├── yes → Edit Commitment
      └── no  → truthful unavailable/stale state
```

Preserve Task 6.10 exact-incarnation semantics.

---

# 36. Event Interaction

Audit activation of an Event.

Expected:

```text
Event occurrence
    ↓
exact Event authority
    ↓
Edit Event
```

Preserve recreated-event identity protection.

---

# 37. Work Interaction

Audit activation of Work.

Expected contextual destination should use existing Work configuration rather than create a generic Commitment abstraction.

---

# 38. Friction Interaction

Determine how Needs attention appears in:

* month cell;
* selected-day workspace;
* detailed resolution context.

The month cell likely needs only a compact indicator.

The selected day can expose participants and contextual resolution.

Do not convert friction into Recommendation.

---

# 39. Unplaced Interaction

Determine whether month cells should expose unplaced evidence.

Audit whether unplaced candidates have a truthful date/user-day association sufficient for display.

Do not imply:

* failure;
* lack of capacity;
* impossibility.

---

# 40. Add Event Interaction

Determine whether selecting a date and choosing Add Event should use the existing selected-day Event workflow unchanged.

Prefer reuse.

---

# 41. Add Commitment Interaction

Determine whether Add Commitment belongs:

* globally in Planner;
* in selected-day context;
* both as routes to the same workflow.

Remember that a recurring Commitment is not intrinsically owned by the selected date.

Do not accidentally pre-author recurrence semantics from a clicked day without an explicit product rule.

---

# 42. Edit Commitment Context

Determine how the contextual workspace returns to the selected month/day after editing.

Audit existing return-state behavior and focus management.

---

# 43. Direct Manipulation Boundary

Explicitly audit whether any existing architecture supports:

* drag occurrence to another day;
* drag occurrence to another time;
* resize occurrence;
* click empty time to schedule Commitment.

Default answer should be **unsupported** unless architecture clearly authorizes it.

Explain what authority such behavior would require.

---

# 44. Replanning Interaction

Determine the appropriate Monthly Planner affordance for requesting a new schedule.

Existing semantics distinguish:

* authored edit;
* stale Preview;
* Generate Schedule;
* Refresh Schedule;
* Try;
* Apply Planning Change.

Map these into the mature Planner without collapsing them.

---

# 45. Stale Schedule Presentation

Determine how stale Preview should appear at:

* Planner level;
* month level;
* cell level;
* selected-day level.

Avoid covering every cell with redundant stale messaging.

Determine the minimum truthful representation.

---

# 46. Generate/Refresh Placement

Determine where Generate Schedule / Refresh Schedule should live once Month becomes primary.

Possible:

* Planner toolbar;
* month header;
* selected-day workspace;
* another location.

Use workflow evidence rather than aesthetics alone.

---

# 47. Contextual Workspace Modes

Inventory likely contextual modes:

```text
Day Review
Add Commitment
Edit Commitment
Add Event
Edit Event
Work
Resolve Friction
```

Determine whether these should be:

* mutually exclusive;
* stackable;
* nested;
* route-based;
* state-machine-like.

Prefer the simplest model consistent with existing application behavior.

---

# 48. Desktop Layout

Evaluate likely desktop composition.

Potential:

```text
┌───────────────────────────────┬─────────────────────┐
│                               │                     │
│        MONTH CALENDAR         │ CONTEXT WORKSPACE   │
│                               │                     │
│                               │                     │
└───────────────────────────────┴─────────────────────┘
```

or:

```text
MONTH CALENDAR
────────────────────────────────
SELECTED DAY / CONTEXT
```

Determine what existing component/layout constraints suggest.

Do not implement.

---

# 49. Mobile Architecture

A seven-column dense calendar is inherently constrained on phones.

Audit realistic mobile alternatives:

### A. horizontally compressed month grid + below-day detail

### B. month grid for navigation with minimal indicators

### C. agenda/list transformation at narrow widths

### D. another adaptive representation

The same authority/read model should serve all layouts.

Do not make mobile a separate planning model.

---

# 50. Mobile Month Cell Density

Determine what can remain legible around 320–430px.

The Phase 6 application passed these widths.

The Monthly Planner must not regress core usability.

Audit whether mobile month cells should contain:

* date only;
* indicator dots/counts;
* abbreviated item labels;
* selected-state only.

---

# 51. Accessibility Architecture

Audit requirements for an interactive month grid.

At minimum consider:

* semantic grid vs collection of buttons;
* arrow-key navigation;
* Tab behavior;
* selected date;
* current date;
* month navigation;
* accessible day labels;
* occurrence activation;
* Needs attention indicators;
* focus after month change;
* focus after contextual edit;
* mobile screen-reader behavior.

Do not assume native table semantics alone are sufficient.

---

# 52. Keyboard Calendar Model

Determine a canonical keyboard interaction.

Potential pattern:

```text
Tab
    enters calendar

Arrow keys
    move day selection/focus

Home/End
    optional week movement

PageUp/PageDown
    optional month movement

Enter/Space
    select/open day
```

Compare with current calendar implementation and established accessibility patterns.

Do not add complexity without benefit.

---

# 53. Focus Architecture

Determine expected focus after:

* selecting a day;
* changing month;
* Today navigation;
* opening Add Commitment;
* opening Edit Commitment;
* returning from editor;
* adding Event;
* deleting Event;
* resolving friction;
* Generate/Refresh;
* stale-target failure.

Reuse Phase 6 focus conventions where possible.

---

# 54. Lazy-Loading Assessment

Current bundle baseline is constrained:

```text
Initial raw       648,706
Initial gzip      164,373
Largest lazy       51,445
Total JS          746,424
Total JS guard    750,000
Headroom            3,576
```

Determine whether Monthly Planner implementation can reasonably fit the existing lazy architecture.

Audit likely chunk boundaries.

Do not increase guards.

---

# 55. Bundle Architecture Question

The audit must answer:

> **Should Phase 7 begin with a bounded bundle/code-splitting task before substantial Monthly Planner implementation?**

Task 6.11 determined no additional bundle task was required to **close Phase 6**.

That does not imply 3,576 bytes are sufficient for Phase 7.

Assess whether implementation should begin with:

* additional lazy extraction;
* shared-code restructuring;
* removal of dead/transitional UI;
* replacement of Review Schedule code as Month is introduced;
* another bounded optimization.

Do not optimize speculatively; use build/import evidence.

---

# 56. Existing Component Reuse

Inventory components that might legitimately be reused:

* existing calendar;
* DayVisualizer;
* selected-day detail;
* occurrence cards;
* Event editor;
* Commitment editor;
* friction components;
* loading/error boundaries.

Classify each:

* reuse directly;
* reuse internally;
* adapt;
* replace;
* uncertain.

Do not equate reuse with good architecture.

---

# 57. DayVisualizer Role

Determine whether DayVisualizer remains the correct selected-day detailed timeline beneath/beside the month.

Its variable-duration support is now canonical.

Assess whether it becomes:

* primary selected-day detail;
* optional expanded detail;
* internal visualization primitive;
* replaced later.

---

# 58. Calendar Projection Performance

Audit likely month-query cost.

Consider:

* ~28–42 visible labels;
* scheduled occurrence count;
* Event count;
* Work;
* friction;
* unplaced;
* exact source lookup;
* selected-day detail.

Determine whether projection should be computed:

* once per visible month;
* per cell;
* from existing Preview indexing;
* another bounded strategy.

Avoid N× repeated whole-plan scans if preventable.

---

# 59. Determinism

The Month projection must be deterministic for identical authoritative inputs.

Audit:

* cell ordering;
* overflow policy;
* month boundaries;
* selected-day detail;
* exact source links;
* friction counts;
* stale state.

Storage/input ordering must not alter presentation meaning.

---

# 60. Clone Isolation

If a Month read model is introduced, determine clone/isolation requirements.

UI mutation must not alter authoritative/derived store state.

---

# 61. Partial Availability

Determine how the Planner should represent:

* generated schedule covering entire visible month;
* partial generated coverage;
* no generated coverage;
* stale generated coverage;
* protected/unavailable relevant authority.

These states must not collapse into an empty month.

---

# 62. Empty-Day Semantics

An empty generated user-day may mean:

> schedule generated and no scheduled occurrences exist for that label.

An uncovered user-day may mean:

> no generated schedule evidence exists for that label.

These are different.

The Monthly Planner must preserve that distinction.

---

# 63. Past-Date Semantics

Audit what should appear when navigating into past months.

Determine whether the Planner:

* shows old Preview if retained;
* shows HistoricalPlan;
* shows authored Events;
* shows no planning geometry;
* provides Summary/Today handoff;
* another model.

Do not invent historical schedule truth.

This may be legitimately deferred if Phase 7 V1 focuses on current/future planning.

---

# 64. Future-Date Semantics

Determine how far the month UI may navigate beyond generated Planning Range.

Separate navigation capability from schedule evidence.

---

# 65. Current-Date Semantics

Determine how the canonical current user-day is marked in the month grid.

Do not assume civil “today” and current user-day label are always identical before the boundary.

Use the canonical user-day resolver.

---

# 66. Month Heading Semantics

Determine whether month heading derives from:

* selected user-day label;
* visible month anchor;
* current user-day;
* another navigation state.

Avoid ambiguous dual-month state.

---

# 67. Cross-Month User-Day Selection

Audit selection behavior when keyboard/navigation moves from:

```text
August 31 → September 1
```

Determine whether visible month follows selection automatically.

---

# 68. Adjacent-Month Cells

Determine whether the grid should show leading/trailing dates from adjacent months.

If yes, clicking them should have deterministic selection/navigation behavior.

---

# 69. Week Start

The month grid should honor effective product week-start semantics where appropriate.

But effective `weekStartsOn` may change across shift segments.

Audit this carefully.

A single visual month grid cannot trivially change column order halfway through the month.

Determine whether Month needs:

* one display preference;
* selected-date preference;
* month-anchor preference;
* global UI preference;
* another explicit rule.

**Do not invent the answer.**

If current architecture does not define this, flag it as an architecture prerequisite.

This is a potential stop condition.

---

# 70. Variable Week-Start Transition

Specifically test/audit:

```text
weekStartsOn:
Sunday → Monday
```

within one visible month.

Determine whether this affects:

* user-week identity;
* recurrence;
* month-grid presentation only;
* all three.

Keep visual grouping separate from canonical recurrence semantics.

---

# 71. Shift-Transition Context

The Monthly Planner is likely where future shift-transition planning becomes visible.

Audit what transition facts can already be derived:

* boundary change;
* work-window change;
* off days;
* days until transition;
* days since transition.

Do not implement adaptation recommendations.

Determine whether the month architecture leaves a clean future insertion point.

---

# 72. Future Transition Recommendations

Assess whether future features such as:

* transitional Sleep schedule;
* temporary load reduction;
* Goal reorientation;
* recovery/rest protection;

could be presented contextually without redefining Month authority.

This is future-readiness analysis only.

---

# 73. Capacity Future Boundary

Determine whether Month architecture can later display derived Capacity without requiring a redesign.

Do not implement Capacity.

---

# 74. Planned Allocation Future Boundary

Determine where Planned Allocation might later appear:

* cell;
* day detail;
* month summary;
* contextual workspace.

Do not implement it.

---

# 75. Recommendations Future Boundary

Determine where Recommendations could later surface without being confused with:

* Needs attention;
* Resolution options;
* authored edits.

Do not implement Recommendations.

---

# 76. Pattern Library Future Boundary

Assess how Pattern Library could remain contextual.

Possible entry:

```text
Add Commitment
    ↓
Start blank
or
Choose Pattern
```

Do not make Pattern Library a primary Planner destination unless evidence demands it.

---

# 77. Goal Reorientation Future Boundary

Determine whether a future transition recommendation could propose temporary Goal/Commitment changes while preserving user authority.

Do not implement ranking/deprioritization.

---

# 78. Daily Workspace Relationship

The Monthly Planner should hand off naturally to the richer future Daily Workspace.

Audit whether the selected-day workspace is already the beginning of that model.

Determine what belongs in:

* Planner selected-day detail;
* Today;
* future Daily Workspace.

Avoid prematurely merging Today and Planner.

---

# 79. Naming Audit

Determine whether the product should call the surface:

* Planner;
* Monthly Planner;
* Month;
* Schedule;
* another term.

The top-level primary surface may remain **Planner** even if its dominant visualization is monthly.

Do not rename without product justification.

---

# 80. Implementation Slice Assessment

If architecture is sufficiently resolved, recommend bounded implementation slices.

Likely categories may include:

1. bundle/lazy prerequisite if required;
2. canonical Month read model;
3. month-grid foundation;
4. selected-day workspace integration;
5. schedule occurrence projection;
6. contextual interactions;
7. friction/unplaced integration;
8. responsive/accessibility pass;
9. convergence/removal of transitional Plan/Review destinations;
10. QA/publication.

These are illustrative.

Derive actual tasks from evidence.

---

# 81. Migration Strategy

Determine whether the Monthly Planner can be introduced incrementally while existing Plan/Review Schedule remains operational.

Prefer a reversible progression.

Do not require a big-bang rewrite unless evidence demands it.

---

# 82. Transitional UI Debt

Identify which existing Phase 6 UI may become temporary once Month is primary.

Examples might include:

* mini calendar;
* Plan/Review tabs;
* duplicated selected-day heading;
* existing Review layout.

Classify only from actual code.

---

# 83. Persistence Boundary

Confirm Month navigation/selection does not require durable persistence unless justified.

Do not add:

* new localStorage keys;
* new IndexedDB stores;
* new Backup version;
* new restore participant;

for ordinary view state.

---

# 84. Profile Boundary

Determine behavior when profile load replaces authored setup while a month/day/context is selected.

Existing stale-target invalidation must remain.

---

# 85. Restore Boundary

Determine Month ephemeral state after restore.

Prefer safe revalidation/reset over restoring obsolete contextual targets.

---

# 86. Full-Clear Boundary

Determine how Month responds to full clear.

The calendar shell may remain navigable while authoritative contents clear.

Do not leave ghost selected occurrences/editors.

---

# 87. Protection/Error Boundary

Determine how Planner Month behaves when relevant storage/authority is:

* protected;
* unavailable;
* malformed/recovering.

Do not display an apparently empty month when truth is unavailable.

---

# 88. Testing Architecture

Recommend test layers for Month.

At minimum consider:

* pure month projection tests;
* selected user-day tests;
* variable-boundary tests;
* week-start tests;
* partial coverage;
* stale Preview;
* exact identity;
* interaction integration;
* keyboard calendar;
* mobile browser QA.

---

# 89. Canonical Fixtures

Identify fixtures required before implementation.

At minimum consider:

* ordinary 24-hour user-days;
* 26-hour transition day;
* 22-hour transition day;
* month crossing a boundary transition;
* month crossing week-start change;
* month with partial Preview coverage;
* stale Preview;
* dense day;
* all-day Event;
* overnight Work;
* unplaced Commitment;
* friction;
* recreated Commitment;
* month boundary;
* current user-day before civil boundary;
* DST where feasible.

---

# 90. Property Invariants

Recommend useful properties.

Potential examples:

* each visible label appears once;
* selecting a cell resolves that exact user-day label;
* cell projection never mutates authority;
* identical input produces identical projection;
* occurrence appears only under authoritative plan membership;
* uncovered is distinct from generated-empty;
* month navigation does not mutate schedule;
* selected-day changes do not stale Preview;
* display week grouping does not redefine user-week recurrence.

---

# 91. Performance Assessment

Estimate likely performance risks from repository evidence.

Do not benchmark imaginary implementation.

Identify existing scans/indexes that may become problematic at month scale.

---

# 92. Bundle Assessment

Produce a concrete bundle recommendation before implementation.

Include:

* current baseline;
* expected code areas touched;
* likely lazy boundary;
* whether transitional UI removal can offset growth;
* whether a prerequisite optimization task is required.

Fixed guards remain fixed.

---

# 93. Architecture Stop Conditions

Stop implementation planning and recommend a prerequisite decision if the audit finds:

* no canonical display-week rule when `weekStartsOn` changes within a month;
* Month requires ambiguous mixing of Preview and HistoricalPlan;
* selected date cannot map cleanly to canonical user-day label;
* existing Preview cannot distinguish generated-empty from uncovered;
* month interactions would require a new unapproved schedule authority;
* mobile/accessibility requires a fundamentally different information model;
* bundle architecture cannot accommodate implementation under fixed guards without prerequisite remediation;
* another unresolved semantic ambiguity would require arbitrary product behavior.

Do not paper over these.

---

# 94. Required Audit Result

Produce:

`docs/implementation/phase-7/PHASE_7_AUDIT_01_MONTHLY_PLANNER_PRIMARY_SURFACE_ARCHITECTURE_AND_INTERACTION_MODEL_RESULT.md`

---

# 95. Required Result Structure

Include at minimum:

1. Executive Findings
2. Artifact Integrity
3. Phase 6 Prerequisite Confirmation
4. Files/Symbols Reviewed
5. Current Planner Composition
6. Current Plan Responsibilities
7. Current Review Schedule Responsibilities
8. Existing Calendar Architecture
9. Monthly Planner Product Hypothesis Assessment
10. Primary-Surface Determination
11. Plan/Review Convergence Assessment
12. Contextual Workspace Architecture
13. Selected User-Day Semantics
14. Month Grid vs User-Day Geometry
15. User-Week Interaction
16. Month Semantics
17. Month Navigation
18. Planning Range Relationship
19. Month Read-Model Assessment
20. Read-Model Authority Sources
21. Preview Role
22. HistoricalPlan Boundary
23. Today Boundary
24. Summary Boundary
25. Month Cell Information Architecture
26. Occurrence Density
27. Cell Ordering
28. All-Day Presentation
29. Cross-Boundary Occurrences
30. Work Presentation
31. Sleep Presentation
32. Commitment Interaction
33. Event Interaction
34. Work Interaction
35. Friction Interaction
36. Unplaced Interaction
37. Add Event
38. Add Commitment
39. Edit/Return Context
40. Direct Manipulation Boundary
41. Replanning Interaction
42. Stale Schedule Presentation
43. Generate/Refresh Placement
44. Contextual Workspace Modes
45. Desktop Architecture
46. Mobile Architecture
47. Mobile Density
48. Accessibility Architecture
49. Keyboard Calendar Model
50. Focus Architecture
51. Lazy-Loading Assessment
52. Bundle Architecture
53. Existing Component Reuse
54. DayVisualizer Role
55. Projection Performance
56. Determinism
57. Clone Isolation
58. Partial Availability
59. Empty-Day Semantics
60. Past-Date Semantics
61. Future-Date Semantics
62. Current-Date Semantics
63. Month Heading Semantics
64. Cross-Month Selection
65. Adjacent-Month Cells
66. Week-Start Policy
67. Variable Week-Start Transition
68. Shift-Transition Context
69. Transition Recommendation Readiness
70. Capacity Readiness
71. Planned Allocation Readiness
72. Recommendation Readiness
73. Pattern Library Boundary
74. Goal Reorientation Boundary
75. Daily Workspace Relationship
76. Naming Determination
77. Implementation Slice Recommendation
78. Migration Strategy
79. Transitional UI Debt
80. Persistence Boundary
81. Profile Boundary
82. Restore Boundary
83. Full-Clear Boundary
84. Protection/Error Boundary
85. Testing Architecture
86. Canonical Fixtures
87. Property Invariants
88. Performance Assessment
89. Bundle Assessment
90. Architecture Stop-Condition Assessment
91. Architectural Alignment Assessment
92. Recommended Phase 7 Sequence
93. Recommended First Implementation Task
94. Open Questions
95. Final Audit Determination

---

# 96. Required Responsibility Migration Matrix

Produce:

| Responsibility | Current surface | Proposed Monthly Planner location | Authority unchanged? | Migration timing |
| -------------- | --------------- | --------------------------------- | -------------------: | ---------------- |

---

# 97. Required Month Cell Matrix

Produce:

| Evidence type | Show in cell? | Representation | Interaction | Authority |
| ------------- | ------------: | -------------- | ----------- | --------- |

Include:

* date;
* Work;
* Commitment;
* Sleep;
* Event;
* all-day Event;
* Needs attention;
* unplaced;
* stale;
* uncovered;
* Goal;
* outcome/progress.

---

# 98. Required Authority Matrix

Produce:

| Source | Month projection use | Selected-day use | Writes from Month? | Notes |
| ------ | -------------------- | ---------------- | -----------------: | ----- |

Include all relevant authorities and derived state.

---

# 99. Required Temporal Matrix

Produce:

| Case | Month-cell label | Canonical selected window | Expected behavior |
| ---- | ---------------- | ------------------------- | ----------------- |

Include:

* ordinary day;
* boundary increase;
* boundary decrease;
* before-boundary current instant;
* month boundary;
* cycle wrap;
* DST if supported.

---

# 100. Required Coverage Matrix

Produce:

| Day state | Cell representation | Selected-day representation | User action |
| --------- | ------------------- | --------------------------- | ----------- |

Include:

* generated with items;
* generated empty;
* uncovered;
* stale;
* protected/unavailable;
* friction;
* unplaced.

---

# 101. Required Week-Start Matrix

Produce:

| Scenario | Canonical user-week behavior | Month-grid behavior | Decision status |
| -------- | ---------------------------- | ------------------- | --------------- |

Include:

* Sunday stable;
* Monday stable;
* Sunday → Monday transition within month;
* Monday → Sunday transition within month;
* repeating-cycle wrap.

This matrix is mandatory because display-week grouping and canonical user-week semantics must not be conflated.

---

# 102. Required Interaction Matrix

Produce:

| User activates | Expected contextual result | Direct schedule write? | Authority |
| -------------- | -------------------------- | ---------------------: | --------- |

Include:

* empty day;
* Commitment occurrence;
* Event;
* Work;
* Needs attention;
* unplaced Commitment;
* Generate/Refresh;
* Today/current-day affordance.

---

# 103. Required Responsive Matrix

Produce recommended behavior for:

| Width class | Month representation | Context workspace | Information density |
| ----------- | -------------------- | ----------------- | ------------------- |

At minimum:

* narrow phone;
* large phone;
* tablet;
* desktop.

---

# 104. Required Accessibility Matrix

Produce:

| Interaction | Keyboard behavior | Accessible semantics | Focus result |
| ----------- | ----------------- | -------------------- | ------------ |

Include:

* enter calendar;
* move day;
* select day;
* change month;
* activate occurrence;
* open contextual editor;
* return from editor;
* friction resolution.

---

# 105. Required Bundle Matrix

Use Phase 6 publication baseline:

| Metric       | Baseline |   Guard | Phase 7 implication |
| ------------ | -------: | ------: | ------------------- |
| Initial raw  |  648,706 | 685,000 |                     |
| Initial gzip |  164,373 | 170,000 |                     |
| Largest lazy |   51,445 | 100,000 |                     |
| Total JS     |  746,424 | 750,000 |                     |

Return an explicit prerequisite determination.

---

# 106. Required Future-Layer Matrix

Produce:

| Future capability | Month insertion point | New read model? | New authored policy? | New authority? |
| ----------------- | --------------------- | --------------: | -------------------: | -------------: |

Include:

* Capacity;
* Planned Allocation;
* Recommendations;
* transition Sleep planning;
* Goal reorientation;
* Pattern Library;
* richer Daily Workspace.

---

# 107. Required Architectural Invariant Assessment

Assess at minimum:

1. Planner remains authored planning/review surface.
2. Month does not become new authority.
3. Today remains execution reporting.
4. Summary remains historical interpretation.
5. Preview remains derived planning geometry.
6. HistoricalPlan remains immutable publication history.
7. Active remains authored scheduling authority.
8. Goal authority remains independent.
9. Event authority remains singular.
10. Work remains composite.
11. Commitment remains projection, not authority.
12. exact incarnation governs contextual editing.
13. stale targets never retarget.
14. user-day ownership remains canonical.
15. variable-duration days remain truthful.
16. month grid does not redefine user-day geometry.
17. visual weeks do not redefine user-week semantics.
18. month does not become fixed elapsed interval.
19. all-day remains user-day-wide.
20. cross-midnight geometry does not duplicate authority.
21. uncovered differs from empty.
22. stale differs from fresh.
23. protected differs from empty.
24. selection is non-durable unless justified.
25. month navigation does not mutate authored state.
26. selected-day navigation does not stale Preview.
27. Add Event uses Event authority.
28. Edit Commitment uses exact authored source.
29. Work interaction uses Work configuration.
30. friction remains bounded evidence/resolution.
31. Resolution options remain distinct from Recommendations.
32. Try remains non-durable.
33. Apply Planning Change remains bounded.
34. Generate/Refresh remains explicit.
35. no auto-regeneration is introduced.
36. no drag/drop authority is introduced.
37. no direct occurrence placement is introduced.
38. no execution write moves into Planner.
39. no Summary write moves into Planner.
40. no Goal ranking is introduced.
41. no Capacity semantics are invented.
42. no Allocation semantics are invented.
43. no transition adaptation is invented.
44. Pattern Library remains contextual.
45. month cell ordering is deterministic.
46. dense-cell overflow is deterministic.
47. clone isolation is preserved.
48. input order does not affect semantic output.
49. mobile uses same authority/read model.
50. accessibility model is defined before dense interaction.
51. focus architecture is explicit.
52. lazy boundaries preserve authority.
53. bundle guards remain fixed.
54. no runtime dependency is added by audit.
55. persistence remains unchanged by view state.
56. Backup remains unchanged by view state.
57. restore invalidates stale contextual targets.
58. profile load invalidates stale contextual targets.
59. full clear removes stale contextual targets.
60. past-date semantics are epistemically truthful.
61. future uncovered dates are not shown as free.
62. current user-day marker uses canonical resolver.
63. month navigation can exceed generated coverage without lying, if adopted.
64. display week-start policy is explicit.
65. variable week-start transition is not silently guessed.
66. transition context can be added later without redefining temporal truth.
67. Capacity can be added later without redefining Month authority.
68. Recommendations can be added later without conflating friction.
69. Daily Workspace can evolve without duplicating Today authority.
70. migration can proceed incrementally.
71. transitional UI can be removed only after replacement.
72. Phase 6 browser/mobile guarantees are not knowingly regressed.
73. Month projection has bounded performance characteristics.
74. implementation sequence respects bundle constraints.
75. unresolved semantics trigger a prerequisite rather than arbitrary implementation.

Classify each:

* Confirmed;
* Supported;
* Recommended;
* Requires decision;
* Blocked;
* Deferred;
* Not applicable.

---

# 108. Validation

Because this is an audit, production behavior should remain unchanged.

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Do not run a global write-format operation if it would modify immutable audit artifacts.

Record exact results.

---

# 109. Governance Updates

If the audit reaches architectural decisions, update:

* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* Phase 7 checkpoint/audit record.

Create an ADR only for a genuinely enduring architectural decision not already governed by existing architecture.

Potential examples include a canonical display-week policy if one must be established.

Do not create ADRs merely to restate the audit.

---

# 110. Final Audit Determination

End with one of:

## Outcome A — Monthly Planner Architecture Ready

The dominant Month surface, contextual workspace, read-model boundary, display-week policy, responsive/accessibility architecture, and bundle path are sufficiently resolved.

Recommend the first implementation task.

## Outcome B — Bounded Architecture Prerequisite Required

Name the exact unresolved semantic decision.

Do not begin implementation.

## Outcome C — Monthly Planner Hypothesis Rejected

Explain what repository/product evidence supports a different Planner architecture.

---

# 111. Final Audit Principle

> **The Monthly Planner should make DayFrame's planning intelligence spatially understandable without turning scheduled geometry into user-authored truth.**

The calendar is navigation.

The selected user-day is canonical time.

The schedule is derived.

The sources remain authoritative.

The user edits intent.

DayFrame rebuilds the plan.
