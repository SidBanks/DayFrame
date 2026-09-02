# Task 7.2 — Accessible Monthly Planner Shell and Selected-Day Review Workspace

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

First visible Monthly Planner implementation, application adapter over the canonical Task 7.1 read model, accessible month-grid shell, selected-user-day review workspace, responsive desktop/mobile layout, keyboard/focus architecture, explicit generated/stale/uncovered states, current-day navigation, read-only occurrence presentation, exact contextual affordance preparation, lazy-loading/bundle preservation, strangler-migration compatibility, regression testing, browser QA, and governance.

**This task does not migrate all Planner authoring into the Month surface, remove Plan / Review Schedule, add direct schedule manipulation, implement contextual editing writes, change scheduler behavior, introduce a Month authority, or implement future Capacity/Recommendations/transition adaptation.**

---

# 1. Objective

Render the first recognizable Monthly Planner surface using the canonical Task 7.1 read model.

The target product shape is:

```text
Planner

┌──────────────────────────────────────────┬──────────────────────────┐
│                                          │                          │
│              MONTH GRID                  │    SELECTED DAY          │
│                                          │       REVIEW             │
│                                          │                          │
│                                          │                          │
└──────────────────────────────────────────┴──────────────────────────┘
```

or the equivalent responsive arrangement.

The user should be able to:

* see a complete month grid;
* move through visible dates;
* distinguish current date-label from selected date-label;
* understand generated, stale, uncovered, and known-empty days;
* inspect compact planned evidence in cells;
* select a canonical user-day;
* review full selected-day planned geometry and attention;
* navigate between months;
* return to the canonical current user-day;
* use the surface fully by keyboard;
* use the surface on narrow/mobile widths.

The user should **not** yet be able to mutate authored state from Month.

---

# 2. Governing Task 7.1 Principle

Treat Task 7.1 as governing.

Task 7.1 already determines:

* displayed month identity;
* 35/42-cell geometry;
* one M-01 display-week anchor;
* weekday-column order;
* selected canonical user-day;
* canonical current-user-day marker;
* variable-duration user-day windows;
* fresh/stale/uncovered coverage;
* generated-empty state;
* current Event evidence;
* Work/Commitment/Sleep evidence;
* friction/unplaced attention;
* exact contextual target metadata;
* non-retargeting incarnation semantics;
* deterministic ordering;
* clone isolation;
* input-order independence.

The Task 7.2 UI must consume those answers.

It must not rederive them independently in React.

---

# 3. Governing Surface Principle

> **Month is the dominant future Planner navigation surface, but Task 7.2 is still a strangler-migration step.**

The current:

```text
Planner
├── Plan
└── Review Schedule
```

must remain reachable during Task 7.2 unless an exact duplicate presentation can be retired without losing behavior.

Do not perform the final Planner migration yet.

---

# 4. Governing Read-Only Principle

Task 7.2 is read-only with respect to planning authority.

Permitted interactions:

* change displayed month;
* change focused date;
* select a date;
* jump to current user-day;
* inspect occurrences;
* inspect attention;
* reveal selected-day detail;
* navigate to existing Plan / Review destinations if appropriate.

Prohibited interactions:

* Add Commitment;
* Edit Commitment;
* Add Event;
* Edit Event;
* Edit Work;
* Apply Planning Change;
* Try Resolution;
* direct schedule placement.

Those contextual workflows belong to later Phase 7 migration tasks.

---

# 5. Governing Temporal Principle

The visible month grid represents civil date-labels.

The selected-day workspace represents the canonical DayFrame user-day:

```text
userDay(D) = [start(D), start(D+1))
```

Therefore:

* one cell still represents one date-label;
* a 21/22/26/27-hour user-day still gets one cell;
* selected-day detail must show truthful geometry;
* current user-day may differ from civil “today” before the boundary.

Do not normalize variable-duration days.

---

# 6. Governing Display-Week Principle

Use the Task 7.1 `displayWeekAnchor`.

The Month UI must not recompute or reinterpret:

* week starts;
* column ordering;
* row grouping.

If a selected date's canonical `weekStartsOn` differs from the Month display anchor:

* keep columns fixed;
* preserve selected-day truth;
* optionally surface concise context where useful.

Do not rotate the grid during the month.

---

# 7. Governing Coverage Principle

Every cell must truthfully distinguish:

* covered fresh;
* covered stale;
* covered known-empty;
* uncovered;
* protected/unavailable if the application adapter cannot produce a normal Month model.

Do not render uncovered as an empty normal day.

Do not label generated-empty as free.

---

# 8. Governing Accessibility Principle

The Month grid is an interactive date-selection control.

Accessibility behavior must be deliberately defined rather than added later.

Task 7.2 must implement:

* semantic date-grid structure;
* current-day semantics;
* selected-day semantics;
* keyboard navigation;
* roving tabindex or an equally coherent focus model;
* focus preservation across month changes;
* accessible day labels;
* readable occurrence/attention summaries;
* mobile screen-reader-compatible structure.

---

# 9. Governing Responsive Principle

Desktop and mobile may present the same data differently.

They must share:

* the same read model;
* the same selected label;
* the same canonical day semantics;
* the same coverage semantics;
* the same exact evidence.

Do not create a separate mobile planning model.

---

# 10. Explicit Scope

Implement:

* Monthly Planner application adapter;
* top-level Planner Month entry;
* Month header;
* previous-month navigation;
* next-month navigation;
* current-user-day / Today-in-Planner navigation;
* weekday headers;
* 35/42-cell grid;
* adjacent-month cells;
* current user-day marker;
* selected date marker;
* coverage states;
* stale states;
* known-empty state;
* uncovered state;
* compact cell evidence tokens;
* cell overflow count;
* Needs-attention indicator;
* unplaced indicator where Task 7.1 gives cell ownership;
* selected-day review workspace;
* selected-day canonical window metadata;
* selected-day planned evidence;
* selected-day attention;
* selected-day unplaced;
* variable-duration day display;
* focus management;
* keyboard navigation;
* responsive layouts;
* narrow-phone treatment;
* loading/protection/error states;
* lazy-loading placement;
* bundle discipline;
* tests;
* real-browser QA;
* governance.

---

# 11. Explicit Non-Goals

Do not implement:

* contextual Add Commitment;
* contextual Edit Commitment;
* contextual Add Event;
* contextual Edit Event;
* contextual Work editing;
* friction-resolution controls;
* Try;
* Apply Planning Change;
* drag/drop;
* resize;
* direct schedule placement;
* direct schedule time editing;
* new schedule generation behavior;
* auto-generation;
* Plan / Review final removal;
* HistoricalPlan Month backfill;
* execution reporting in Month;
* Summary progress in Month;
* Capacity;
* Planned Allocation;
* Recommendations;
* transition adaptation;
* Pattern Library;
* Goal reorientation;
* new persistence;
* new Backup version;
* new runtime dependency.

---

# 12. Execution Artifact Rules

Before implementation:

1. verify this Task 7.2 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Task 7.1 result;
   * Phase 7 Audit 01 result;
   * `queryMonthlyPlanner`;
   * Planner composition;
   * Plan / Review navigation;
   * Review Schedule selected-day behavior;
   * DayVisualizer;
   * current calendar/mini-calendar implementation;
   * focus patterns from Tasks 6.8–6.11;
   * loading/lazy architecture;
   * bundle guard;
5. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-7/TASK_7.2_ACCESSIBLE_MONTHLY_PLANNER_SHELL_AND_SELECTED_DAY_REVIEW_WORKSPACE_RESULT.md`

---

# 13. Mandatory Initial UI Audit

Before writing the Month shell, audit the current production components that may overlap with:

* calendar;
* selected day;
* Review Schedule day grouping;
* DayVisualizer;
* occurrence cards;
* attention display;
* loading/protection states;
* Planner navigation.

For each classify:

* reuse directly;
* extract/reuse primitive;
* adapt;
* replace;
* leave untouched for migration.

Do not clone current Review Schedule markup mechanically.

---

# 14. Application Adapter

Create the smallest application-layer adapter necessary to feed `queryMonthlyPlanner`.

The adapter may resolve:

* current displayed month;
* selected label;
* explicit evaluation instant;
* Active temporal/source inputs;
* current Events;
* current Preview;
* planning-range metadata;
* availability/protection.

The adapter must not:

* mutate authority;
* regenerate Preview;
* persist Month state;
* read HistoricalPlan;
* read ExecutionHistory;
* read Progress.

---

# 15. Query Ownership

The Month UI must consume the Task 7.1 query result.

Do not have individual cells call domain resolvers independently.

Do not have individual cells scan Preview.

Do not recompute:

* coverage;
* ownership;
* exact identity;
* week-start;
* current user-day.

---

# 16. Initial Displayed Month

Define initial displayed month from canonical current user-day label, not civil `new Date()` month alone.

If current canonical label differs from civil date before boundary, the displayed Month should follow the canonical current label unless existing product navigation gives stronger evidence.

Document the decision.

---

# 17. Initial Selected Day

Prefer selecting the canonical current user-day on first Month entry.

If the user arrives with a selected Review Schedule date that can be truthfully preserved, audit whether that context should transfer.

Do not persist selected date durably.

---

# 18. Month Header

Render:

* displayed month/year;
* previous;
* next;
* current-user-day action.

Avoid ambiguous labels such as simply “Today” if the action actually means:

> Go to current DayFrame user-day.

Product copy may still say **Today** if context makes the meaning clear.

---

# 19. Previous / Next Month

Use the pure Task 7.1 navigation helpers.

Do not construct month arithmetic directly inside UI if helpers exist.

Changing displayed month:

* must not mutate planning range;
* must not generate;
* must not stale Preview;
* must not alter authored state.

---

# 20. Current User-Day Navigation

A Current/Today action should:

1. resolve current canonical user-day from the query;
2. change displayed month if necessary;
3. select that label;
4. place keyboard focus deterministically.

Do not assume current civil date label.

---

# 21. Weekday Headers

Render seven weekday headers in the exact Task 7.1 order.

Do not derive header order from locale or hard-coded Sunday-first assumptions.

Each header must be available to assistive technology.

---

# 22. Grid Semantic Model

Implement an accessible Month grid.

Preferred architecture:

```text
Month region
    grid
        column headers
        grid rows
            day cells
```

or another standards-aligned structure that provides equivalent semantics.

Document the chosen approach.

---

# 23. Roving Focus

Implement one tabbable active day cell within the grid.

Arrow keys move focus among date cells.

Selection and focus may be related but must remain conceptually distinct.

Do not make all 35/42 cells separate Tab stops.

---

# 24. Keyboard Model

At minimum support:

* `ArrowLeft` → previous civil label;
* `ArrowRight` → next civil label;
* `ArrowUp` → previous visual row / 7 labels;
* `ArrowDown` → next visual row / 7 labels;
* `Home` → start of visual week;
* `End` → end of visual week;
* `PageUp` → previous month;
* `PageDown` → next month;
* `Enter` or `Space` → select focused date.

If browser/accessibility evidence favors a slightly different model, document it.

Do not invent scheduler semantics from keyboard actions.

---

# 25. Cross-Month Keyboard Movement

If Arrow movement reaches an adjacent-month visible cell:

focus may move there normally.

If movement proceeds beyond the visible 35/42-cell grid:

determine whether the Month changes automatically.

Preferred behavior:

* preserve continuous date navigation;
* change displayed month when necessary;
* keep focused label stable.

Test it.

---

# 26. Focus After Month Change

When month changes through header controls:

focus should remain on the control or move to a deterministic equivalent day according to chosen navigation semantics.

When month changes because focused-date navigation crosses boundary:

focus should remain on the logically moved date.

No focus loss to `body`.

---

# 27. Cell Core Content

Every day cell should contain at minimum:

* date number;
* current-user-day state where applicable;
* selected state where applicable;
* adjacent-month styling/state;
* coverage state;
* bounded compact evidence;
* attention indicator where present.

Do not place full selected-day detail inside cells.

---

# 28. Cell Accessible Label

Each cell needs a useful accessible name/description containing relevant state.

Conceptually:

> Wednesday, August 12. Selected. Current schedule available. 3 planned items. Needs attention.

Do not over-announce every internal token if that produces unusably verbose navigation.

Audit browser accessibility tree.

---

# 29. Current vs Selected State

Current and selected must be visually and semantically distinct.

A date may be:

* current only;
* selected only;
* both;
* neither.

Do not encode both with one ambiguous visual style.

---

# 30. Adjacent-Month Cells

Adjacent cells must remain interactive date labels.

They should:

* appear visually secondary;
* still expose truthful coverage/evidence;
* be keyboard reachable;
* select normally;
* change displayed month when selected if that is the adopted interaction.

Document behavior.

---

# 31. Covered Fresh Cell

Render fresh covered cells as normal generated schedule evidence.

Do not need a “fresh” badge on every cell unless useful.

Freshness may be mostly implicit.

---

# 32. Covered Stale Cell

Stale Preview should be visible without overwhelming every cell.

Prefer one clear Planner/Month-level stale state plus subtle cell treatment.

Selected-day detail should still show the old geometry.

Do not hide stale occurrences.

---

# 33. Generated-Empty Cell

Provide a subtle representation that means:

> schedule generated, no planned items.

Do not say:

* free;
* available;
* open.

Avoid visually equating it with uncovered.

---

# 34. Uncovered Cell

Provide a visually/semantically distinct state such as:

**Not generated**

or a similarly concise representation.

Do not make uncovered look like an ordinary empty day.

---

# 35. Protected / Unavailable Month

If the query result is protected/unavailable:

do not render an apparently empty Month.

Render a truthful Month-level recovery/error state using current application conventions.

Calendar shell may remain visible only if temporal navigation remains trustworthy under that readiness branch.

Use actual adapter evidence.

---

# 36. Cell Evidence Token Budget

Use a small fixed Month-cell token budget.

Do not make breakpoint-specific semantics part of the query.

For desktop, choose a bounded count after visual inspection.

For mobile, use a lower count or indicator-only mode.

Any truncation must show exact overflow count.

Example:

```text
Work
Gym
Dentist
+2
```

This is illustrative.

---

# 37. Token Ordering

Consume Task 7.1 token order exactly.

Do not reorder in React based on styling convenience.

---

# 38. All-Day Event Token

All-day Event presentation should be distinguishable from timed Event presentation.

Do not show midnight times.

---

# 39. Timed Event Token

Timed Event may show compact local start time where space permits.

Do not imply occurrence execution.

---

# 40. Work Token

Use compact presentation that avoids overwhelming every workday.

Audit whether:

* `Work`;
* shift name;
* compact time;

best fits existing product terminology.

Do not hide Work entirely from the Month unless evidence strongly supports it.

---

# 41. Sleep Token

Sleep remains Commitment evidence.

Presentation may compress Sleep similarly to other frequent evidence.

Do not introduce special Sleep semantics.

---

# 42. Commitment Token

Render title and optional compact time where practical.

No edit action yet in Task 7.2.

Tokens may be focusable only if they perform read-only inspection; otherwise keep cell interaction date-centric.

Prefer avoiding nested interactive controls inside the grid for Task 7.2 unless accessibility remains excellent.

---

# 43. Cell Interaction Boundary

Task 7.2 should prioritize selecting the **day**, not individual occurrences inside the grid.

Strong preference:

> Month cell activation selects the day; selected-day workspace handles detailed occurrence inspection.

This keeps the grid accessible and avoids premature contextual-edit interaction complexity.

If occurrence-level activation is implemented, it must remain read-only and keyboard accessible.

---

# 44. Needs-Attention Indicator

Month cell may show a compact attention indicator/count.

Accessible text should use **Needs attention** language.

Do not expose `friction point`.

Do not imply severity ranking beyond canonical data.

---

# 45. Unplaced Indicator

If Task 7.1 gives cell-level unplaced ownership:

show a compact plan-attention indicator.

If unplaced exists only at Month level:

do not guess a cell.

Provide Month-level attention summary instead.

---

# 46. Month-Level Status Region

Above or near the grid, expose bounded status such as:

* stale schedule;
* partial schedule coverage;
* ungenerated dates;
* Month-level unplaced attention.

Do not clutter the grid with repeated prose.

---

# 47. Partial Coverage Presentation

If some visible core Month labels are covered and others uncovered:

the UI should make partial coverage understandable.

Possible copy:

> Schedule generated for part of this month.

Do not imply the rest is empty.

---

# 48. Planning Range Context

If the visible Month extends outside Planning Range:

the UI may explain this using Task 7.1 planning-range metadata.

Do not automatically expand the range.

Do not auto-generate.

---

# 49. Generate / Refresh Boundary

Task 7.2 does not need to move generation controls permanently.

Existing Plan / Review Schedule generation remains available.

The Month shell may expose a read-only status/shortcut to existing generation workflow if trivial and truthful.

Do not duplicate generation logic.

---

# 50. Selected-Day Workspace

Selecting a date populates a richer review panel/section.

At minimum display:

* full date label;
* canonical start/end;
* variable duration where non-standard or otherwise helpful;
* coverage;
* planned occurrences;
* Events;
* Work;
* Commitments/Sleep;
* Needs attention;
* unplaced detail;
* selected-day week-start transition context if useful.

No writes.

---

# 51. Selected-Day Heading

Use a clear heading such as:

**Wednesday, August 12**

Do not expose raw `YYYY-MM-DD` as primary presentation unless useful secondarily.

---

# 52. Selected-Day Temporal Context

Ordinary days do not need unnecessary “24 hours” copy.

For unusual variable-duration days, surface concise context.

Example:

> This DayFrame day runs 3:00 AM–6:00 AM the following day.

or:

> 27-hour DayFrame day

Use actual product terminology and browser usability evidence.

Do not frame unusual duration as error.

---

# 53. Selected-Day Coverage

Explicitly distinguish:

* generated current schedule;
* generated stale schedule;
* generated with no planned items;
* not generated.

Do not collapse them.

---

# 54. Selected-Day Occurrence Ordering

Use Task 7.1 selected-day ordering.

Do not regroup differently from the model unless the selected-day UI has a justified stable grouping.

If grouping is added:

* preserve deterministic order;
* do not change semantic ownership.

---

# 55. Selected-Day All-Day Section

Where all-day Events exist:

consider an **All day** section above timed content.

Do not infer all-day from interval duration.

---

# 56. Selected-Day Planned Items

Present planned geometry read-only.

At minimum distinguish:

* Work;
* Event;
* Commitment/Sleep.

Do not expose raw source-family names.

---

# 57. Selected-Day Time Display

Use local times based on canonical geometry.

Cross-boundary items must display correct dates/times.

Do not clip times to civil midnight for textual display.

---

# 58. Selected-Day Needs Attention

Show read-only attention summary/details.

May show:

* issue title;
* participants;
* time/context.

Do not expose Resolution options yet.

May provide a **Review in current schedule** navigation path to the existing Review Schedule if useful.

No duplicated friction controls.

---

# 59. Selected-Day Unplaced

Show truthful unplaced evidence where Task 7.1 gives it.

Use narrow copy:

> Not placed in the generated schedule.

Do not imply Capacity/failure.

---

# 60. No Selected Day

If no selected label is allowed by UI state:

show a concise prompt.

Preferred initial state is selected current day, so this should be uncommon.

---

# 61. Desktop Layout

Implement one coherent desktop layout.

Preferred:

```text
┌────────────────────────────────┬─────────────────────────┐
│                                │                         │
│         MONTH GRID             │    SELECTED DAY         │
│                                │       REVIEW            │
│                                │                         │
└────────────────────────────────┴─────────────────────────┘
```

Use actual available width.

Avoid making selected-day panel too narrow for readable timing/attention.

---

# 62. Tablet Layout

At medium width, allow:

* Month above;
* selected-day below;

or a reduced split.

Do not squeeze the grid until tokens become illegible.

---

# 63. Mobile Layout

At phone width:

```text
Month header
weekday headers
minimal 7-column date grid

Selected day
    detailed agenda/review
```

Month cells should become navigation/status indicators rather than tiny desktop cards.

---

# 64. Mobile Month Density

At 320–430px:

prefer:

* date number;
* current/selected state;
* tiny semantic indicators/count;
* maybe one compact token if genuinely legible.

Do not cram multiple text lines into every cell if it destroys usability.

---

# 65. Mobile Selected-Day Detail

The selected-day workspace should carry the richer evidence on mobile.

All essential information removed from Month cells due to density must still be available there.

---

# 66. Horizontal Overflow

No core Month workflow may require horizontal page scrolling.

The 7-column grid must fit within the viewport.

If necessary:

* reduce token presentation;
* use icons/indicators;
* adjust typography/spacing.

Do not create horizontal-scroll calendar as default mobile behavior.

---

# 67. DayVisualizer Assessment

Audit whether existing `DayVisualizer` should be embedded in the selected-day workspace now.

If it:

* fits responsive layout;
* preserves variable-duration geometry;
* does not materially increase eager bundle;
* improves review clarity;

it may be reused.

If it makes Task 7.2 too heavy/dense:

use a simpler read-only agenda for this slice and defer visualizer integration.

Document decision.

---

# 68. Planner Navigation

Introduce a Month entry within Planner.

Possible transitional structure:

```text
Planner
├── Month
├── Plan
└── Review Schedule
```

or another minimal migration structure.

Task 7.2 should make Month clearly discoverable without pretending Plan/Review are already obsolete.

Do not create another top-level app primary surface.

---

# 69. Default Planner Destination

Audit whether Month should become the default Planner destination immediately in Task 7.2.

Preferred if the Month shell is sufficiently complete/readable.

If defaulting to Month would hide necessary common workflows behind immature navigation, keep the existing default temporarily.

Document decision.

---

# 70. Strangler Migration Rule

Existing Plan / Review Schedule may remain until their capabilities are contextually migrated.

Do not duplicate heavy UI permanently.

Task 7.2 is allowed temporary presentation overlap.

Track transitional duplication explicitly for later removal.

---

# 71. Existing Review Schedule Regression

Do not break current Review Schedule:

* generation;
* selected day;
* Event workflow;
* contextual edits;
* friction resolution;
* variable-duration visualizer.

Month is additive in Task 7.2.

---

# 72. Existing Plan Regression

Do not break:

* Goals;
* Commitments;
* Work;
* Schedule Preferences;
* Planning Range;
* Save Setup;
* Advanced Commitment Fields.

---

# 73. Loading Architecture

The Task 7.1 module enters production for the first time here.

Choose import placement carefully.

Prefer a lazy Monthly Planner chunk if bundle pressure requires it.

Do not pull Plan authoring eagerly into Month.

---

# 74. Month Lazy Boundary

Audit whether Month should itself be lazy within Planner.

Given the remaining total-JS budget, strong preference:

> Month UI and Task 7.1 projection should live in a bounded lazy chunk unless build evidence supports another arrangement.

Do not assume Planner shell must eagerly import the entire Month implementation.

---

# 75. Shared Read-Model Import

If both Month and existing Review Schedule need shared helpers:

factor only pure small shared code.

Avoid duplicating query logic in separate chunks where that causes unnecessary total JS growth.

---

# 76. Bundle Baseline

Task 7.1 production baseline remains:

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

# 77. Bundle Strategy

Task 7.2 almost certainly requires replacing or lazily isolating presentation rather than simply adding everything to the current bundle graph.

Allowed strategies include:

* lazy Month surface;
* reuse existing primitives;
* moving Month-specific UI out of eager shell;
* extracting shared pure utilities;
* deleting dead code exposed by implementation if proven safe.

Do not raise guards.

Do not add a runtime dependency.

---

# 78. Bundle Stop Condition

Stop and report if the Month shell cannot fit while keeping:

* initial raw;
* initial gzip;
* largest lazy;
* total JS;

inside fixed guards without:

* threshold inflation;
* new runtime dependency;
* architectural duplication;
* premature destructive removal of working Planner functionality.

A bounded code-splitting remediation may be required before completing 7.2.

---

# 79. No Calendar Library

Do not add a calendar/date UI dependency.

Task 7.1 already provides grid geometry.

Use React and existing DayFrame date/time infrastructure.

---

# 80. Loading State

If Month is lazy:

show a truthful **Loading Planner…** or equivalent state.

Do not show an empty calendar during code/data loading.

---

# 81. Query Error State

If Task 7.1 returns `invalidQuery`:

treat this as an application defect/recovery condition, not a user-generated normal empty state.

Do not silently substitute current month.

---

# 82. Protected State

Reuse existing recovery/protection UX.

Do not allow month navigation to suggest normal plan truth if underlying Active state is protected.

---

# 83. Unavailable State

Show clear storage/unavailable messaging.

Do not render fake uncovered cells if query truth is unavailable.

---

# 84. Evaluation Instant Lifecycle

Define when Month's evaluation instant updates.

For Task 7.2, acceptable patterns include:

* on Month surface entry;
* explicit lightweight refresh/current-day action;
* app-level current-time snapshot.

Do not create per-second rerenders.

The current-user-day marker must not rely on ambient query time.

Document chosen behavior.

---

# 85. Midnight/Boundary Rollover

Audit what happens if the canonical current user-day changes while Month remains open.

Task 7.2 does not need background timers unless product architecture already provides them.

A re-entry or explicit current-day action may refresh the evaluation snapshot.

Document limitation truthfully if present.

---

# 86. Selected-Day State Ownership

Keep displayed month and selected label as ephemeral UI/application state.

Do not add persistence.

Prefer Planner composition ownership rather than storing selection inside every child.

---

# 87. Focused Day State

If roving focus requires a focused label separate from selected label:

keep both ephemeral.

Do not treat focus as domain state.

---

# 88. URL State

Do not introduce routing/URL state unless current app already uses URL-backed navigation.

No new routing architecture in Task 7.2.

---

# 89. Profile Load

If profile load occurs while Month is visible:

* requery current state;
* preserve displayed month if still valid as view state;
* revalidate selected label;
* clear stale selected evidence/context;
* do not retain ghost occurrences.

---

# 90. Restore

Same principle.

No stale Month read-model result survives authoritative replacement.

---

# 91. Full Clear

Month shell may remain navigable.

After clear:

* cells reproject as uncovered/empty current-authority truth;
* selected label remains only if valid view state;
* selected evidence clears;
* no ghost tokens remain.

---

# 92. Test — Application Adapter

Cover:

* available result;
* protected result;
* unavailable result;
* explicit evaluation instant;
* current Preview;
* current Events;
* profile/replacement inputs.

---

# 93. Test — Month Initial State

Cover:

* displayed month from canonical current user-day;
* selected current user-day;
* before-boundary instant where civil date differs.

---

# 94. Test — Navigation

Cover:

* previous month;
* next month;
* current-user-day action;
* year boundary;
* adjacent-month cell selection.

---

# 95. Test — Grid Structure

Cover:

* seven weekday headers;
* 35 cells;
* 42 cells;
* correct column order;
* current marker;
* selected marker;
* adjacent cells.

---

# 96. Test — Keyboard

Cover:

* roving tabindex;
* arrow left/right;
* arrow up/down;
* Home/End;
* PageUp/PageDown;
* Enter/Space selection;
* month-boundary keyboard movement.

---

# 97. Test — Focus

Cover:

* initial grid focus;
* header month navigation;
* selected-day update;
* current-day action;
* cross-month keyboard move;
* protected/unavailable transition.

---

# 98. Test — Coverage Presentation

Cover:

* covered fresh;
* covered stale;
* generated empty;
* uncovered;
* partial coverage.

Assert user-facing distinctions.

---

# 99. Test — Evidence Tokens

Cover:

* all-day Event;
* timed Event;
* Work;
* Commitment;
* Sleep;
* attention;
* deterministic token order;
* overflow count.

---

# 100. Test — Selected-Day Detail

Cover:

* ordinary day;
* variable-duration day;
* all-day Event;
* timed Event;
* Work;
* Commitment;
* Needs attention;
* unplaced;
* generated-empty;
* uncovered.

---

# 101. Test — Variable Duration

Cover at minimum:

```text
03:00 → 06:00
06:00 → 03:00
```

Assert selected-day UI does not display fixed 24-hour assumptions.

---

# 102. Test — Before-Boundary Current Day

Required.

An evaluation instant before today's boundary must mark the previous canonical user-day label as current.

---

# 103. Test — Week-Start Transition

Required.

Within one displayed Month:

* display columns remain fixed;
* selected-day canonical week start may differ;
* no grid rotation.

---

# 104. Test — Stale Geometry

Stale cell/detail retains occurrence evidence and exposes stale state.

Do not hide the schedule.

---

# 105. Test — Uncovered Geometry

Uncovered day displays **Not generated** or equivalent and no fake empty-state language.

---

# 106. Test — Accessibility Names

Cover accessible date-label naming and current/selected state.

Do not require every occurrence token in accessible name if that creates excessive verbosity; use a bounded useful summary.

---

# 107. Test — Mobile Structure

Component-level tests may verify class/layout structure.

Real browser QA remains mandatory.

---

# 108. Test — Existing Planner Regression

Ensure Plan and Review Schedule remain reachable and functional.

---

# 109. Test — No Writes

Selecting/navigating Month must not:

* change SetupDraft;
* save setup;
* mutate Event authority;
* stale Preview;
* regenerate Preview;
* write PlanDecision;
* write ExecutionHistory.

Mandatory regression.

---

# 110. Test — Historical/Execution Exclusion

Month UI must not display:

* outcomes;
* Progress;
* HistoricalPlan-derived geometry.

Where practical assert through dependency/fixture behavior.

---

# 111. Browser QA — Desktop

In a production browser, inspect:

* Month header;
* 35-cell month;
* 42-cell month;
* adjacent cells;
* selected day;
* current day;
* fresh coverage;
* stale coverage;
* uncovered;
* generated-empty;
* dense day;
* selected-day workspace;
* long/short transition day.

---

# 112. Browser QA — Keyboard

Perform keyboard-only:

```text
enter Planner Month
navigate grid
change month
select day
jump to current user-day
inspect selected-day workspace
return to grid
```

No pointer requirement.

---

# 113. Browser QA — Mobile

Inspect at least:

```text
320px
375px
390px
430px
```

Verify:

* seven-column grid fits;
* date selection works;
* current/selected state remains distinguishable;
* indicators remain legible;
* no horizontal page scroll;
* selected-day detail remains readable.

---

# 114. Browser QA — Screen Reader / Accessibility Tree

If screen reader available, sample Month.

Otherwise inspect browser accessibility tree.

Verify:

* Month has useful accessible label;
* weekday headers are exposed;
* date cells are named;
* selected/current states are exposed;
* no unnamed interactive controls;
* arrow-key interaction does not create confusing focus duplication.

---

# 115. Browser QA — Slow Loading

If Month is lazy:

throttle network.

Verify:

* truthful loading state;
* no fake empty calendar;
* focus remains stable after load.

---

# 116. Browser QA — Transition Day

Manually inspect longer/shorter user-day selected detail.

The Month cell remains one spatial date.

Selected-day detail reflects actual canonical window.

---

# 117. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.2_ACCESSIBLE_MONTHLY_PLANNER_SHELL_AND_SELECTED_DAY_REVIEW_WORKSPACE_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.1 Prerequisite Confirmation
4. Initial UI Audit
5. Files Changed
6. Application Adapter
7. Query Integration
8. Initial Displayed Month
9. Initial Selected Day
10. Month Header
11. Previous/Next Navigation
12. Current User-Day Navigation
13. Weekday Headers
14. Grid Semantics
15. Roving Focus
16. Keyboard Model
17. Cross-Month Keyboard Movement
18. Focus After Month Change
19. Cell Core Content
20. Accessible Cell Labels
21. Current vs Selected
22. Adjacent Cells
23. Covered Fresh
24. Covered Stale
25. Generated Empty
26. Uncovered
27. Protected/Unavailable
28. Cell Token Budget
29. Token Ordering
30. All-Day Event Token
31. Timed Event Token
32. Work Token
33. Sleep Token
34. Commitment Token
35. Cell Interaction Boundary
36. Needs Attention Indicator
37. Unplaced Indicator
38. Month-Level Status
39. Partial Coverage
40. Planning Range Context
41. Generate/Refresh Boundary
42. Selected-Day Workspace
43. Selected-Day Heading
44. Selected-Day Temporal Context
45. Selected-Day Coverage
46. Selected-Day Ordering
47. All-Day Section
48. Planned Items
49. Time Display
50. Needs Attention Detail
51. Unplaced Detail
52. Desktop Layout
53. Tablet Layout
54. Mobile Layout
55. Mobile Density
56. Mobile Selected-Day
57. Horizontal Overflow
58. DayVisualizer Decision
59. Planner Navigation
60. Default Planner Destination
61. Strangler Migration
62. Existing Review Regression
63. Existing Plan Regression
64. Loading Architecture
65. Month Lazy Boundary
66. Shared Read-Model Import
67. Bundle Strategy
68. Loading State
69. Query Error State
70. Protected State
71. Evaluation Instant Lifecycle
72. Current-Day Rollover
73. Selected State Ownership
74. Focus State Ownership
75. Profile Load
76. Restore
77. Full Clear
78. Tests Added/Changed
79. Focused Validation
80. Full Validation
81. Bundle Validation
82. Desktop Browser QA
83. Keyboard Browser QA
84. Mobile Browser QA
85. Accessibility-Tree/Screen-Reader QA
86. Slow-Loading QA
87. Transition-Day QA
88. Governance Updates
89. ADR Determination
90. Deviations
91. Discoveries
92. Deferred Work
93. Navigation Matrix
94. Coverage Presentation Matrix
95. Cell Evidence Matrix
96. Selected-Day Matrix
97. Keyboard Matrix
98. Focus Matrix
99. Responsive Matrix
100. Loading Matrix
101. Bundle Matrix
102. Authority Matrix
103. Product-Boundary Matrix
104. Epistemic Matrix
105. Architectural Invariant Assessment
106. Stop-Condition Assessment
107. Architectural Alignment Assessment
108. Task 7.3 Readiness
109. Recommended Next Task
110. Final Completion Determination

---

# 118. Required Navigation Matrix

| Action                   | Displayed month changes? | Selected label changes? | Authority changes? |
| ------------------------ | -----------------------: | ----------------------: | -----------------: |
| previous month           |                          |                         |                 No |
| next month               |                          |                         |                 No |
| select core cell         |                          |                         |                 No |
| select adjacent cell     |                          |                         |                 No |
| jump to current user-day |                          |                         |                 No |
| arrow-key date move      |                          |                         |                 No |
| PageUp/PageDown          |                          |                         |                 No |

---

# 119. Required Coverage Presentation Matrix

| Coverage              | Cell presentation | Selected-day presentation | May imply free time? |
| --------------------- | ----------------- | ------------------------- | -------------------: |
| covered fresh + items |                   |                           |                   No |
| covered fresh empty   |                   |                           |                   No |
| covered stale         |                   |                           |                   No |
| uncovered             |                   |                           |                   No |
| protected/unavailable |                   |                           |                   No |

---

# 120. Required Cell Evidence Matrix

| Evidence        | Desktop cell | Mobile cell | Selected-day detail |
| --------------- | ------------ | ----------- | ------------------- |
| all-day Event   |              |             |                     |
| timed Event     |              |             |                     |
| Work            |              |             |                     |
| Commitment      |              |             |                     |
| Sleep           |              |             |                     |
| Needs attention |              |             |                     |
| unplaced        |              |             |                     |

---

# 121. Required Selected-Day Matrix

| Case                  | Heading | Coverage | Temporal detail | Planned detail |
| --------------------- | ------- | -------- | --------------- | -------------- |
| ordinary              |         |          |                 |                |
| generated empty       |         |          |                 |                |
| uncovered             |         |          |                 |                |
| stale                 |         |          |                 |                |
| long transition day   |         |          |                 |                |
| short transition day  |         |          |                 |                |
| week-start transition |         |          |                 |                |

---

# 122. Required Keyboard Matrix

| Key/action  | Expected behavior    |           Changes selection? | Changes authority? |
| ----------- | -------------------- | ---------------------------: | -----------------: |
| ArrowLeft   | previous label focus |                no by default |                 No |
| ArrowRight  | next label focus     |                no by default |                 No |
| ArrowUp     | -7 labels            |                no by default |                 No |
| ArrowDown   | +7 labels            |                no by default |                 No |
| Home        | visual week start    |                no by default |                 No |
| End         | visual week end      |                no by default |                 No |
| PageUp      | previous month       | implementation-defined focus |                 No |
| PageDown    | next month           | implementation-defined focus |                 No |
| Enter/Space | select focused label |                          Yes |                 No |

Refine from implementation.

---

# 123. Required Focus Matrix

| Interaction                           | Focus result |
| ------------------------------------- | ------------ |
| open Month                            |              |
| previous/next month                   |              |
| current-user-day action               |              |
| select date                           |              |
| cross-month arrow movement            |              |
| protected state                       |              |
| Month lazy load completes             |              |
| return from Plan/Review if applicable |              |

---

# 124. Required Responsive Matrix

| Width   | Month cell content | Layout | Selected-day placement |
| ------- | ------------------ | ------ | ---------------------- |
| 320     |                    |        |                        |
| 375     |                    |        |                        |
| 390     |                    |        |                        |
| 430     |                    |        |                        |
| tablet  |                    |        |                        |
| desktop |                    |        |                        |

---

# 125. Required Loading Matrix

| Area                  | Eager/lazy | Loading UI | Authority duplication? |
| --------------------- | ---------- | ---------- | ---------------------: |
| Planner shell         |            |            |                     No |
| Month shell           |            |            |                     No |
| Task 7.1 query module |            |            |                     No |
| Plan authoring        | lazy       | existing   |                     No |
| Today                 | lazy       | existing   |                     No |
| Summary               | lazy       | existing   |                     No |

---

# 126. Required Bundle Matrix

| Metric       | 7.1 baseline | 7.2 final | Delta |   Guard |
| ------------ | -----------: | --------: | ----: | ------: |
| Initial raw  |      648,706 |           |       | 685,000 |
| Initial gzip |      164,373 |           |       | 170,000 |
| Largest lazy |       51,445 |           |       | 100,000 |
| Total JS     |      746,424 |           |       | 750,000 |

Record Month chunk separately if created.

---

# 127. Required Authority Matrix

| Source                |  Month reads? |    Month writes? | Purpose                  |
| --------------------- | ------------: | ---------------: | ------------------------ |
| Active authored setup |           Yes |               No | temporal/source context  |
| Manual Events         |           Yes |               No | current Event truth      |
| Preview               |           Yes |               No | generated plan/attention |
| PlanDecision          | indirect only |               No | reflected in Preview     |
| HistoricalPlan        |            No |               No | excluded                 |
| ExecutionHistory      |            No |               No | Today                    |
| Progress              |            No |               No | Summary                  |
| Month view state      |     ephemeral | No durable write | navigation only          |

---

# 128. Required Product-Boundary Matrix

| Capability                  | Task 7.2   |
| --------------------------- | ---------- |
| visible Month               | Implement  |
| selected-day Review         | Implement  |
| month navigation            | Implement  |
| keyboard grid               | Implement  |
| mobile Month                | Implement  |
| exact evidence display      | Implement  |
| contextual edit writes      | Deferred   |
| friction resolution         | Deferred   |
| Plan/Review retirement      | Deferred   |
| direct manipulation         | Prohibited |
| Month authority             | Prohibited |
| schedule generation changes | Prohibited |
| outcomes/progress           | Prohibited |
| Capacity/Recommendations    | Prohibited |

---

# 129. Required Epistemic Matrix

| UI state       | May say                       | Must not say            |
| -------------- | ----------------------------- | ----------------------- |
| covered items  | planned items                 | completed/executed      |
| covered empty  | no planned items              | free/available          |
| uncovered      | not generated                 | nothing planned         |
| stale          | schedule based on older setup | invalid                 |
| protected      | schedule unavailable          | empty                   |
| all-day Event  | all day for this DayFrame day | midnight-to-midnight    |
| unplaced       | not placed                    | impossible              |
| attention      | Needs attention               | Recommendation          |
| current marker | current DayFrame day          | necessarily civil today |

---

# 130. Architectural Invariants

Assess at minimum:

1. Month consumes Task 7.1 read model.
2. React does not rederive canonical Month semantics.
3. Month remains projection, not authority.
4. navigation performs no writes.
5. selection performs no writes.
6. keyboard movement performs no writes.
7. Month change does not change Planning Range.
8. Month change does not regenerate.
9. Month change does not stale Preview.
10. Preview remains current planning geometry.
11. HistoricalPlan remains excluded.
12. ExecutionHistory remains excluded.
13. Progress remains excluded.
14. Active temporal truth remains canonical.
15. Events remain current authored authority.
16. Commitment remains exact projection.
17. Work remains composite.
18. exact incarnation semantics remain unchanged.
19. stale sources never retarget.
20. title/time matching remains absent.
21. selected label maps to canonical user-day.
22. variable-duration day remains truthful.
23. current marker uses canonical resolver.
24. before-boundary current day is correct.
25. display-week anchor remains fixed.
26. per-label canonical week start remains independent.
27. grid never rotates mid-month.
28. 35/42 geometry comes from Task 7.1.
29. adjacent labels remain semantic cells.
30. current and selected states remain distinct.
31. covered fresh remains distinct from stale.
32. covered empty remains distinct from uncovered.
33. uncovered does not imply free.
34. protected does not appear empty.
35. stale geometry remains visible.
36. all-day remains user-day-wide.
37. timed full-day remains timed.
38. cell ordering follows query.
39. UI does not reorder semantic tokens.
40. overflow count remains exact.
41. cell interaction prioritizes date selection.
42. selected-day workspace is read-only.
43. selected-day occurrences remain read-only.
44. Needs attention remains read-only.
45. unplaced remains read-only.
46. no Resolution options are duplicated.
47. no Try is duplicated.
48. no Apply Planning Change is duplicated.
49. no Add/Edit Commitment is added.
50. no Add/Edit Event is added.
51. no Work edit is added.
52. existing Plan remains functional.
53. existing Review Schedule remains functional.
54. strangler migration remains reversible.
55. Month may become default only if evidence supports it.
56. no new persistence is added.
57. selected/displayed month state is ephemeral.
58. focus state is ephemeral.
59. no Backup change is added.
60. profile load reprojects Month.
61. restore reprojects Month.
62. full clear removes ghost evidence.
63. Month is keyboard operable.
64. core grid uses bounded Tab stops.
65. arrow navigation is deterministic.
66. focus does not fall to body unexpectedly.
67. current and selected states are accessible.
68. weekday headers are accessible.
69. no unnamed controls exist.
70. mobile grid fits without horizontal page scrolling.
71. mobile uses same authority/read model.
72. selected-day detail remains complete on mobile.
73. transition-day geometry remains truthful.
74. 24-hour assumptions do not reappear.
75. Month loading state is truthful.
76. lazy boundaries duplicate no authority.
77. Plan authoring remains lazy.
78. Today remains lazy.
79. Summary remains lazy.
80. Month lazy boundary is bundle-appropriate.
81. no runtime dependency is added.
82. no calendar library is added.
83. fixed bundle guards remain unchanged.
84. initial raw remains green.
85. initial gzip remains green.
86. largest lazy remains green.
87. total JS remains green.
88. no threshold inflation occurs.
89. no Capacity is added.
90. no Allocation is added.
91. no Recommendations are added.
92. no transition adaptation is added.
93. no Pattern Library is added.
94. no Goal reorientation is added.
95. no direct schedule manipulation is added.
96. no scheduler behavior changes.
97. tests cover Month semantics.
98. browser QA covers keyboard.
99. browser QA covers mobile.
100. browser QA covers transition day.
101. browser QA covers stale/uncovered.
102. accessibility tree/screen-reader evidence is recorded.
103. governance records the first visible Month implementation.
104. transitional Plan/Review debt is explicitly tracked.
105. Task 7.3 can add contextual authoring without redefining Month semantics.

Classify each as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Covered by browser QA;
* Deferred;
* Prohibited;
* Not applicable;
* Blocked.

---

# 131. Stop Conditions

Stop and report if:

* the UI needs to rederive Task 7.1 semantics because the read model is insufficient;
* keyboard accessibility cannot be implemented without fundamentally changing the grid architecture;
* mobile requires a separate semantic model;
* protected state cannot be presented without fake Month truth;
* existing Plan/Review functionality must be removed prematurely to fit the UI;
* Month introduction breaks exact identity semantics;
* a Month authority/persistence store appears necessary;
* selected-day Review requires HistoricalPlan;
* selected-day Review requires ExecutionHistory;
* total JS cannot remain within fixed guard;
* implementation requires a runtime calendar dependency;
* implementation requires scheduler changes.

Do not solve a stop condition by broadening Task 7.2 silently.

---

# 132. Focused Validation

Run focused suites for:

* Monthly Planner adapter;
* Month UI;
* query integration;
* Planner navigation;
* Task 7.1 read model;
* canonical user-day;
* display-week transition;
* selected-day workspace;
* accessibility/keyboard;
* existing Plan regression;
* existing Review Schedule regression;
* profile/restore/full-clear;
* lazy loading.

Record exact files and counts.

---

# 133. Full Validation

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

* test files;
* tests;
* transformed modules;
* initial raw;
* initial gzip;
* Month chunk;
* Plan authoring chunk;
* Today chunks;
* Summary chunk;
* largest lazy;
* total JS;
* diff result.

---

# 134. Manual Browser Validation

Mandatory.

In a production browser validate:

### Month basics

* five-row month;
* six-row month;
* previous/next;
* current-user-day;
* adjacent cells.

### Coverage

* fresh;
* stale;
* generated-empty;
* uncovered;
* partial coverage.

### Selected day

* ordinary;
* long transition day;
* short transition day;
* all-day Event;
* dense day;
* attention/unplaced.

### Keyboard

* arrows;
* Home/End;
* PageUp/PageDown;
* Enter/Space;
* focus across month changes.

### Mobile

* 320;
* 375;
* 390;
* 430.

### Accessibility

* accessibility tree or screen reader;
* current/selected announcements;
* weekday headers;
* no unnamed controls.

### Loading

* lazy Month where applicable;
* throttled load.

Do not claim completion if real-browser Month validation is unavailable.

---

# 135. Governance

Update:

* Task 7.2 result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

No ADR is expected if Task 7.2 merely realizes Audit 01 and Task 7.1.

Create an ADR only if implementation establishes a new enduring UI architecture rule not already governed.

---

# 136. Task 7.3 Readiness

Task 7.3 becomes authorized only if:

* visible Month is stable;
* Month navigation is deterministic;
* selected-day workspace is truthful;
* coverage distinctions are visible;
* variable-duration days display correctly;
* keyboard navigation is complete;
* mobile Month is usable;
* accessibility semantics are sound;
* exact evidence survives without retargeting;
* existing Plan/Review remain functional;
* bundle guards remain green;
* no Month authority or persistence was introduced.

---

# 137. Recommended Next Task

If green:

> **Task 7.3 — Monthly Planner Contextual Authoring and Exact Source Navigation.**

That task should begin migrating:

* Add/Edit Commitment;
* Add/Edit Event;
* Work configuration;

into the Month contextual workspace while continuing the strangler migration.

Friction-resolution migration can either join 7.3 if mechanically small or remain a separate bounded task based on 7.2 findings.

---

# 138. Completion Criteria

Task 7.2 is complete only when:

* the canonical Task 7.1 read model is the Month UI's semantic source;
* a visible Monthly Planner exists inside Planner;
* the Month renders correct 35/42-cell geometry;
* one fixed display-week anchor governs columns;
* weekday headers are correct and accessible;
* current-user-day marking uses canonical DayFrame time;
* selected date is distinct from current date;
* previous/next/current-user-day navigation works;
* adjacent-month cells remain truthful interactive labels;
* covered-fresh, covered-stale, generated-empty, uncovered, partial-coverage, and protected/unavailable states are visually and semantically distinguishable;
* Month cells present bounded deterministic evidence without reordering Task 7.1 tokens;
* overflow counts are exact;
* all-day, timed Event, Work, Commitment, Sleep, attention, and unplaced evidence appear truthfully;
* Month-cell activation primarily selects the day;
* selected-day workspace exposes canonical start/end/duration and full read-only planned evidence;
* long/short transition days display correctly;
* selected-day detail does not infer execution, Capacity, or Recommendation;
* Needs attention remains read-only;
* unplaced remains epistemically narrow;
* no contextual authored writes are added;
* no friction-resolution writes are added;
* no schedule-generation semantics change;
* no Month authority or durable view-state storage is added;
* existing Plan and Review Schedule remain functional;
* the migration remains reversible;
* keyboard navigation is complete and deterministic;
* focus does not fall to body unexpectedly;
* current/selected semantics are accessible;
* phone widths 320–430px remain usable without horizontal page scroll;
* desktop/tablet layouts remain coherent;
* lazy-loading boundaries remain truthful;
* no calendar/runtime dependency is added;
* fixed bundle guards remain unchanged and green;
* focused tests pass;
* full validation passes;
* production-browser QA passes;
* governance records the first visible Monthly Planner;
* Task 7.3 can add contextual authoring without re-solving Month geometry, coverage, temporal ownership, accessibility, or selected-day review semantics.

---

# 139. Final Implementation Principle

> **The first visible Monthly Planner should prove that DayFrame can make planning spatially understandable before it makes the calendar writable.**

The month organizes time.

The selected day reveals truth.

The schedule remains derived.

The sources remain authoritative.

The user can navigate confidently before DayFrame asks them to edit anything.

---

# 140. Final Completion Statement

**Task 7.2 is complete when DayFrame exposes its first production-visible Monthly Planner inside Planner using the canonical Task 7.1 projection as the sole semantic source for month geometry, display-week ordering, coverage, current-user-day marking, exact evidence ownership, and selected-day truth; when the user can navigate previous/next months, return to the canonical current user-day, move through the 35/42-cell grid by keyboard, distinguish focus, selection, current day, adjacent-month labels, covered-fresh, covered-stale, generated-empty, uncovered, partial-coverage, and protected/unavailable states, and inspect bounded deterministic Work, Commitment, Sleep, Event, Needs-attention, and unplaced evidence without the React layer rederiving domain semantics; when selecting a civil date-label reveals a read-only canonical `[start(D), start(D+1))` DayFrame user-day workspace that remains truthful for ordinary, boundary-transition, cross-midnight, and supported DST cases; when all-day Events remain semantic rather than duration-inferred, stale geometry remains visible, uncovered dates are never presented as free, attention never becomes Recommendation, and no execution or Progress evidence leaks into Planner; when the Month grid implements a deliberate accessible keyboard model, useful current/selected announcements, stable focus across month changes, responsive desktop/tablet/mobile layouts, and usable 320–430px rendering without horizontal page dependence; when the Month UI remains a projection with ephemeral navigation state only, introduces no authored writes, Month authority, persistence, Backup change, scheduler behavior, direct manipulation, Capacity, Allocation, Recommendations, transition adaptation, Pattern Library, or Goal reorientation; when existing Plan and Review Schedule remain functional during the strangler migration, lazy-loading architecture remains authority-safe, no runtime/calendar dependency is added, fixed bundle guards remain unchanged and green, focused/full validation and real-browser QA pass, governance records the visible Month milestone, and Task 7.3 can begin migrating exact contextual Commitment, Event, and Work authoring into the Monthly Planner without reopening Month semantics, user-day truth, coverage, display-week policy, accessibility architecture, or selected-day review behavior.**
