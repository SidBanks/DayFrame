# Task 6.1 — Monthly Planner and Daily Workspace Product-Convergence Audit

## Status

Ready for audit.

## Phase

Phase 6 — Platform Maturity

## Task Type

Read-only product-convergence, workflow, surface-ownership, application-architecture, and readiness audit.

**This is an audit task. Do not implement the Monthly Planner, Daily Workspace, navigation changes, engine changes, schema changes, migrations, or UI redesign during Task 6.1.**

---

# 1. Objective

Determine how the current DayFrame product should converge from its existing surfaces and workflows into a mature operating model centered on:

```text
Monthly Planner
    plan and shape future time

Daily Workspace
    operate and respond within current time

Summary
    understand historical evidence and outcomes
```

Task 6.1 must establish:

1. what each proposed surface is responsible for;
2. what each surface must explicitly not own;
3. which current capabilities belong in each;
4. which current capabilities should remain contextual rather than primary;
5. which current UI structures can be reused;
6. which current UI structures should eventually be retired;
7. which engine/application capabilities already support the model;
8. which genuine gaps block convergence;
9. whether “Monthly Planner” and “Daily Workspace” are architecturally truthful names/boundaries;
10. a staged Phase 6 implementation sequence.

The audit must produce enough evidence that subsequent Phase 6 implementation tasks can be narrow and deterministic rather than exploratory redesigns.

---

# 2. Governing Product Direction

Evaluate this proposed operating model:

```text
Monthly Planner
    What am I trying to accomplish?
    What commitments exist?
    How should the coming month be structured?
    What has not been placed?
    Where is the plan under pressure?
    What planning decisions need my attention?

Daily Workspace
    What is happening today?
    What should I be doing now/next?
    What changed?
    What needs my attention?
    What happened in reality?
    What evidence should I record?

Summary
    What happened historically?
    What did the plan contain?
    What outcomes were reported?
    What measured Progress is known?
    What activity supported my Goals?
```

Treat this as a hypothesis to audit, not an implementation mandate.

If repository evidence indicates a different boundary is necessary, report it.

---

# 3. Governing Mental Model

The intended mature product should increasingly hide implementation machinery.

Users should not need to understand concepts merely because the engine uses them internally.

Audit the transition from concepts such as:

```text
Setup
Generate Preview
Block Templates
Recurrence Configuration
Friction Points
Suggested Fixes
HistoricalPlan
ExecutionHistory
Progress Observation
```

toward product language and workflows such as:

```text
Goals
Commitments
Patterns
Plan
Today
Resolve
Record
Progress
History
```

Do **not** rename anything in this task.

Identify where implementation terminology currently leaks into the product experience.

---

# 4. Governing Surface Principle

Each primary surface should answer a distinct user question.

Proposed:

### Monthly Planner

> What should my future time look like?

### Daily Workspace

> What should I do with the day I am actually living?

### Summary

> What does the historical evidence tell me?

Audit whether these questions produce coherent ownership boundaries.

---

# 5. Governing Time-Horizon Principle

The proposed surfaces differ partly by temporal orientation:

```text
Monthly Planner
    future / planning horizon

Daily Workspace
    current user-day

Summary
    historical / evaluation horizon
```

Audit all current features against this model.

Do not assume calendar-midnight semantics. Preserve DayFrame's existing user-day boundary model.

---

# 6. Governing Authority Principle

Surface convergence must not collapse architectural authorities.

UI simplification must preserve distinctions among:

* Active/authored state;
* Preview/derived schedule;
* HistoricalPlan;
* ExecutionHistory;
* Goal authority;
* Measurement Definition authority;
* Progress Observation authority;
* derived Goal Activity;
* derived Progress.

A simpler product surface does **not** authorize a simpler or merged authority model.

---

# 7. Governing Planner Principle

The Monthly Planner should eventually allow the user to express intent and shape a schedule without requiring them to operate the scheduling engine directly.

Audit whether the eventual interaction model can become:

```text
User defines
    Goals
    commitments
    constraints/preferences
    important events
    patterns

DayFrame builds
    proposed schedule

User reviews
    schedule
    unplaced work
    friction
    proposed resolutions

User decides
    accept/change/reposition
```

Determine what already exists and what is missing.

---

# 8. Governing Daily Workspace Principle

The Daily Workspace is **not merely a one-day calendar view**.

Audit the feasibility of a current-user-day operating surface containing some bounded combination of:

* today's schedule;
* current/next commitment;
* relevant context;
* deviations from plan;
* reporting actions;
* Goal measurement/reporting entry points;
* friction that matters now;
* manual events;
* schedule changes where architecturally supported.

Do not assume all of these belong in V1.

Determine the smallest coherent Daily Workspace.

---

# 9. Governing Summary Principle

Summary is already substantially mature after Phases 4–5.

Treat Summary as an existing product surface to preserve rather than redesign.

Audit only:

* its relationship to Monthly Planner;
* its relationship to Daily Workspace;
* navigation/terminology implications;
* any current capabilities that actually belong elsewhere.

Do not reopen settled Summary metric semantics.

---

# 10. Pattern Library Principle

Patterns should be evaluated as **contextual authoring infrastructure**, not automatically as a primary destination.

Audit whether current templates/recurrences should eventually surface through actions such as:

```text
Add Commitment
    └── use a saved pattern

Edit Commitment
    └── update/reuse pattern
```

rather than:

```text
Primary Navigation
    Pattern Library
```

Do not implement the library.

---

# 11. Goal Placement Principle

Goals are authored intent, not scheduled work.

Audit how Goal authoring should appear within Monthly Planner without visually or semantically implying that Goals themselves occupy time.

Determine whether:

* Goal list;
* Goal detail;
* supporting commitment links;
* Measurement configuration;

belong directly in Monthly Planner, contextual detail, or another bounded workflow.

---

# 12. Measurement Placement Principle

Measurement Definition remains authored Goal measurement policy.

Progress Observation remains evidence/reporting.

Audit likely surface ownership:

```text
Monthly Planner
    configure how Goal is measured

Daily Workspace
    possibly record current value

Summary
    inspect derived Progress
```

Do not assume this allocation is correct. Verify it against current implementation and product semantics.

---

# 13. Commitment Model Audit

Identify every current commitment-like authored source.

At minimum inspect:

* shift/work definitions;
* shift cycles;
* block templates;
* recurrence definitions;
* sleep;
* manual calendar events;
* other authored schedule sources.

For each determine:

* user-facing meaning;
* authority;
* recurrence semantics;
* edit workflow;
* whether it belongs in Monthly Planner;
* whether it belongs in Daily Workspace;
* whether it should be hidden behind contextual authoring.

---

# 14. Current Planner Audit

Map the current Planner/Plan surface completely.

Identify:

* GoalSection;
* Measurement configuration;
* Observation reporting;
* Setup;
* schedule preferences;
* shift/cycle authoring;
* commitments/templates;
* manual events;
* Preview/Schedule;
* friction;
* suggested fixes;
* other controls.

For each record:

* current component/module;
* current user workflow;
* current authority touched;
* whether it is planning, execution, reporting, historical, or infrastructure;
* likely future destination.

---

# 15. Current Schedule/Preview Audit

Determine exactly what the current Schedule/Preview experience represents.

Answer:

* Is it proposed future schedule?
* Is it accepted plan?
* Is it both depending on state?
* What is persisted?
* What becomes HistoricalPlan?
* What is merely ephemeral?
* What actions can users take from it?
* How friction is surfaced;
* how suggested fixes are surfaced;
* whether it is appropriate as the visual foundation for Monthly Planner;
* whether portions could support Daily Workspace.

Do not infer from component names.

Trace actual production behavior.

---

# 16. Current Execution Audit

Map all existing execution/reality-reporting workflows.

At minimum inspect:

* ExecutionHistory;
* scheduled outcome reporting;
* corrections;
* retractions;
* Goal Progress reporting;
* manual events where relevant;
* any current “today” behavior.

Determine whether DayFrame currently possesses a coherent notion of:

```text
the user is living this user-day
```

or whether execution remains mostly historical reporting.

This distinction is critical.

---

# 17. Current User-Day Infrastructure

Audit all existing user-day semantics:

* day boundary;
* effective preferences;
* overnight behavior;
* current-user-day calculation;
* schedule clipping;
* user-day date mapping;
* shift-specific preferences.

Determine whether Daily Workspace can rely on one canonical user-day resolver.

Identify any duplicated or UI-local current-day logic.

---

# 18. Current Calendar Infrastructure

Audit:

* mini-calendar;
* date selection;
* day detail;
* manual-event creation;
* preview range;
* cycle-aware ranges;
* month navigation if present;
* user-week handling.

Determine what can support Monthly Planner without building a second calendar model.

---

# 19. Current Friction Infrastructure

Audit:

* friction detection;
* friction categories;
* suggested fixes;
* move workflow;
* current friction UI;
* persistence/derivation;
* plan revision behavior.

Determine whether the mature workflow should be:

```text
Monthly Planner
    Resolve planning friction
```

and whether any subset belongs in Daily Workspace.

Do not change friction semantics.

---

# 20. Current Recommendation Boundary

Identify all existing uses of:

* suggested fix;
* recommendation;
* suggestion;
* guidance.

Distinguish deterministic scheduling remediation from future Recommendations architecture.

Do not conflate existing suggested fixes with Phase 6+ recommendation intelligence.

---

# 21. Current Navigation Audit

Document current primary navigation and surface composition.

Identify:

* what is always mounted;
* what is conditionally mounted;
* Planner/Summary switching;
* Preview/Schedule access;
* Settings/Backup placement;
* Goal workflows;
* current lazy Summary boundary from Task 5.19.

Determine what navigation changes Monthly Planner / Daily Workspace would eventually require.

Do not implement them.

---

# 22. Task 5.19 Loading Boundary Preservation

The Phase 6 surface model must account for the newly established production loading architecture.

Current governed state includes:

```text
Eager
    app shell
    default Planner
    authority bootstrap
    recovery/settings shell

Lazy
    Summary

Vendor
    React runtime
```

Audit whether Monthly Planner and Daily Workspace would change these boundaries.

Do not change bundle architecture in Task 6.1.

Flag implications for later tasks.

---

# 23. Monthly Planner — Required Capability Audit

For each candidate capability classify:

* Required V1;
* Useful V1;
* Later;
* Does not belong.

Candidates:

1. month calendar;
2. selected-day detail;
3. Goals;
4. supporting commitments;
5. Add Commitment;
6. Edit Commitment;
7. recurring patterns;
8. manual events;
9. shifts/work;
10. sleep;
11. schedule preferences;
12. Generate/refresh plan;
13. plan review;
14. unplaced work;
15. friction;
16. suggested resolutions;
17. drag/reposition;
18. capacity;
19. Progress;
20. Goal Activity;
21. historical outcomes;
22. Measurement configuration;
23. Progress reporting;
24. Backup/settings.

Do not implement any.

---

# 24. Daily Workspace — Required Capability Audit

Classify the same way:

1. current user-day;
2. today's timeline;
3. current commitment;
4. next commitment;
5. manual events;
6. schedule deviations;
7. mark/report outcome;
8. partial/skipped reporting;
9. correct/retract report;
10. Goal context;
11. record Goal measurement;
12. Progress display;
13. friction;
14. suggested schedule adjustment;
15. Add Commitment;
16. edit future commitment;
17. reschedule today's item;
18. tomorrow preview;
19. historical Summary;
20. Settings.

Determine the minimum V1.

---

# 25. Summary — Preservation Audit

Classify current Summary capabilities as:

* Correctly owned by Summary;
* Better surfaced elsewhere but Summary should retain read-only evidence;
* Candidate for removal from Summary;
* Needs cross-surface navigation only.

Do not alter Summary.

---

# 26. “Monthly” Boundary Audit

Determine whether **Monthly Planner** should literally have a calendar-month planning horizon.

Questions:

* Does existing engine generation support arbitrary month ranges?
* Are shift cycles naturally compatible with month boundaries?
* Does HistoricalPlan publication work with this horizon?
* Would “month” mean calendar month or rolling planning horizon?
* What happens near month edges?
* Does user-week configuration conflict with calendar-month planning?
* Would a four/six-week planner be more truthful?

Do not assume the name dictates engine semantics.

This is a mandatory audit question.

---

# 27. “Daily” Boundary Audit

Determine whether **Daily Workspace** should represent:

* calendar day;
* user-day;
* shift day;
* selected day;
* current user-day only.

Strong preference should be given to existing canonical user-day semantics unless evidence shows otherwise.

Document precisely.

---

# 28. Planner Publication Audit

A major product question:

> When does a proposed schedule become the historical plan DayFrame later evaluates?

Trace the exact current publication semantics.

Determine whether Monthly Planner requires a clearer user-facing concept such as:

* Generate;
* Review;
* Accept;
* Publish;
* Save Plan;

or whether current behavior already establishes this boundary adequately.

Do not invent or implement a new publication command.

Report the gap if one exists.

---

# 29. Plan vs Preview Audit

Determine whether mature product language should retain “Preview.”

Questions:

* Is Preview authoritative?
* Can it be regenerated freely?
* Can users modify it?
* Does publication happen automatically?
* Is stale Preview visible?
* What happens after authored setup changes?
* Is there an accepted/frozen plan separate from Preview?

Classify current semantics.

---

# 30. Plan Editing Audit

Determine how users can currently change generated schedule results:

* move;
* regenerate;
* alter source commitment;
* suggested fix;
* manual event;
* direct schedule edit;
* other.

Identify gaps between:

```text
DayFrame builds schedules
```

and:

```text
User can meaningfully shape the result
```

---

# 31. Direct Manipulation Audit

Assess whether Monthly Planner eventually needs:

* drag/drop;
* resize;
* click-to-move;
* day reassignment;
* explicit lock/pin;
* manual placement.

Do not assume drag/drop is required.

Determine what existing engine authority could truthfully support.

---

# 32. Acceptance Model Audit

Determine whether DayFrame currently has an explicit concept of:

```text
proposed schedule
        ↓
user accepts
        ↓
current plan
```

If not, determine whether Monthly Planner V1 can function without one.

This should be evidence-based.

---

# 33. Daily Execution Model Audit

Determine whether a Daily Workspace requires a new execution-state concept or whether existing HistoricalPlan + ExecutionHistory are sufficient.

Questions:

* Can today's scheduled occurrences be resolved from HistoricalPlan?
* Does HistoricalPlan represent the effective current plan?
* Can a same-day plan be republished?
* How are mid-day changes represented?
* Can ExecutionHistory report against exact scheduled occurrence identity?
* Can “now”/“next” be derived safely?
* What happens with unplaced/omitted/blocked occurrences?

Do not create new authority.

Report whether new authority appears necessary.

---

# 34. Current/Next Semantics

Audit whether DayFrame can deterministically derive:

```text
Current
Next
Later today
Done/reported
```

from existing plan and execution evidence.

Be careful:

* scheduled does not mean completed;
* elapsed time does not mean done;
* no report does not mean skipped.

If semantics are insufficient, say so.

---

# 35. Same-Day Change Semantics

Audit how a Daily Workspace could handle reality changing after plan publication.

Examples:

* meeting added;
* work runs late;
* user moves an item;
* item becomes impossible;
* user decides not to do something;
* plan is regenerated mid-day.

Determine which cases current architecture supports.

Do not invent behavior.

---

# 36. Outcome Reporting Placement

Evaluate whether scheduled outcome reporting belongs primarily in Daily Workspace.

Possible V1:

```text
scheduled item
    Record Outcome
        Completed
        Partial
        Skipped
        Unknown/other governed state
```

Audit existing reporting workflow for reuse.

---

# 37. Goal Measurement Reporting Placement

Evaluate whether “Record Current Value” should be available from Daily Workspace.

Consider:

* reporting cadence may not be daily;
* Goal may not have relevant work today;
* measurement may be stopped;
* archived Goals;
* multiple Goals.

Determine whether it belongs:

* directly;
* contextually;
* later;
* not at all.

---

# 38. Progress Placement

Summary owns canonical historical Progress interpretation.

Audit whether Daily Workspace or Monthly Planner should show a compact read-only Progress context.

Do not duplicate full Summary.

Potential distinction:

```text
Planner/Workspace
    contextual Progress

Summary
    analytical Progress + provenance
```

Determine whether useful.

---

# 39. Capacity Placement

Capacity was previously envisioned as a Summary concept but has not yet been implemented as a governed metric.

Audit whether future Capacity belongs primarily in:

* Monthly Planner;
* Summary;
* both with different questions.

Do not implement Capacity.

---

# 40. Planned Allocation Placement

Audit similarly.

Planning allocation may naturally belong in Monthly Planner while historical allocation may belong in Summary.

Identify the semantic distinction required.

Do not implement it.

---

# 41. Recommendation Placement

Future Recommendations may eventually appear in:

* Monthly Planner for plan-shaping;
* Daily Workspace for immediate adjustment;
* Summary for reflective recommendations.

Audit likely placement without defining recommendation policy.

---

# 42. Workflow Audit — Add Commitment

Map the ideal future Add Commitment workflow against current authored models.

Determine whether a user should need to know whether they are creating:

* block template;
* recurrence;
* manual event;
* shift definition;

before expressing intent.

Identify where current data-model distinctions must remain internally but could be hidden behind product workflow.

---

# 43. Workflow Audit — Edit Commitment

Determine whether one conceptual Edit Commitment workflow is feasible across commitment types.

Identify irreducible type-specific differences.

Do not create a generic Commitment authority unless evidence requires it.

---

# 44. Workflow Audit — Resolve Friction

Map current friction + suggested-fix behavior to a future user workflow:

```text
Something doesn't fit
    ↓
explain conflict
    ↓
show bounded options
    ↓
user chooses
    ↓
recompute plan
```

Identify what already works and what is missing.

---

# 45. Workflow Audit — Review Schedule

Determine whether current Preview can become the foundation of:

> Review Schedule

Identify required changes in:

* language;
* information hierarchy;
* actions;
* acceptance/publication;
* calendar horizon;
* friction visibility.

Do not implement them.

---

# 46. Workflow Audit — Live the Day

Define the minimum viable workflow for Daily Workspace from existing capabilities.

Candidate:

```text
Open DayFrame
    ↓
see current user-day
    ↓
see now / next / later
    ↓
open scheduled item
    ↓
record outcome if needed
    ↓
see changed plan if republished
```

Audit feasibility.

---

# 47. Current UI Reuse Assessment

For each major existing component classify:

* Reuse substantially;
* Reuse logic, redesign presentation;
* Split into smaller contextual components;
* Retire eventually;
* Unclear.

Do not modify components.

---

# 48. SetupScreen Assessment

Specifically determine the future of `SetupScreen`.

Questions:

* Which responsibilities remain valid?
* Which should move into Add/Edit Commitment workflows?
* Which are global preferences?
* Which are advanced configuration?
* Which should disappear from primary navigation?
* Can it remain as an implementation container while new workflows wrap it temporarily?

This is mandatory.

---

# 49. Preview/Schedule Component Assessment

Determine whether existing Preview/Schedule UI should:

* become Monthly Planner foundation;
* become Daily Workspace foundation;
* be split between both;
* remain temporary infrastructure;
* be replaced eventually.

Separate reusable scheduling visualization logic from current information architecture.

---

# 50. GoalSection Assessment

Determine whether current GoalSection:

* belongs substantially in Monthly Planner;
* should become a contextual panel;
* should split list/detail;
* should remain temporary.

---

# 51. Measurement UI Assessment

Assess:

* GoalMeasurementSection;
* GoalProgressReportingSection;

against proposed Monthly Planner / Daily Workspace ownership.

---

# 52. Summary Component Assessment

Identify which parts should remain completely untouched through initial convergence.

---

# 53. App-Shell Assessment

Determine whether `DayFrameApp` currently owns too much surface composition for Phase 6.

Do not refactor.

Identify whether future work should introduce bounded surface components such as:

```text
MonthlyPlannerSurface
DailyWorkspaceSurface
SummarySurface
```

only if evidence supports it.

---

# 54. Navigation Model Candidates

Compare at least:

### Model A

```text
Planner
Today
Summary
```

### Model B

```text
Month
Today
Summary
```

### Model C

```text
Plan
Today
Review
```

### Model D

Current navigation with contextual Daily Workspace access.

Evaluate:

* user clarity;
* temporal model;
* current architecture fit;
* migration cost;
* terminology consistency.

Do not select based only on aesthetics.

---

# 55. Monthly Planner Naming Assessment

Evaluate:

* Monthly Planner;
* Planner;
* Plan;
* Schedule;
* Calendar.

Consider whether “Monthly” is too restrictive if planning ranges can differ.

Recommend terminology, but do not rename.

---

# 56. Daily Workspace Naming Assessment

Evaluate:

* Daily Workspace;
* Today;
* Day;
* Daily Plan;
* Workspace.

Consider whether the surface can inspect a non-current day.

Recommend terminology.

---

# 57. Summary Naming Assessment

Determine whether Summary remains correct.

Strong presumption: preserve unless evidence indicates otherwise.

---

# 58. Mobile Product Model

Audit whether the proposed surfaces remain coherent on narrow/mobile layouts.

Particularly:

### Monthly Planner

A full month grid may be poor as the primary mobile interaction.

Determine whether mobile should use:

* compact month selector;
* agenda;
* selected-day stack;
* week strip;
* other existing patterns.

Do not design final UI.

### Daily Workspace

Likely naturally mobile-friendly.

Audit.

---

# 59. Desktop Product Model

Audit whether desktop Monthly Planner can use:

* calendar + detail pane;
* timeline;
* planning sidebar;
* friction panel;

using existing components.

Again, no implementation.

---

# 60. Accessibility Model

Identify likely accessibility risks before convergence:

* calendar keyboard navigation;
* drag/drop alternatives;
* focus when day changes;
* dynamic plan updates;
* current/next announcements;
* friction resolution;
* lazy surface loading;
* inserted details.

Any future direct manipulation must have non-pointer alternatives.

---

# 61. Loading Architecture Implications

Task 5.19 established budgets:

```text
Initial raw <= 685,000 bytes
Initial gzip <= 170,000 bytes
Largest lazy <= 100,000 bytes
Total JS <= 750,000 bytes
```

and a >25 kB initial-JS review rule.

Audit likely Phase 6 surface impact.

If Monthly Planner or Daily Workspace should become new chunks later, identify that as a future implementation consideration.

Do not change budgets.

---

# 62. Persistence Implications

For each proposed surface capability determine whether it needs:

* existing authority only;
* new derived query only;
* new authority;
* unknown.

Treat any proposed new authority as a significant finding.

Do not create it.

---

# 63. HistoricalPlan Implications

Determine whether Monthly Planner and Daily Workspace can rely on HistoricalPlan as currently modeled.

Pay special attention to:

* publication;
* republication;
* same-day changes;
* exact occurrence identity;
* current effective plan;
* frozen provenance.

---

# 64. ExecutionHistory Implications

Determine whether Daily Workspace can use existing ExecutionHistory for live reporting without semantic changes.

---

# 65. Goal/Measurement/Observation Implications

Determine whether their existing commands/queries can be composed into the new surfaces without authority changes.

---

# 66. Preview Implications

Determine whether Preview remains necessary as a distinct derived object once Monthly Planner exists.

Do not remove it.

Classify:

* enduring engine concept;
* temporary UI concept;
* both;
* unclear.

---

# 67. Profile Implications

Determine where saved setup profiles belong in the mature model.

Possibilities:

* advanced Planner tool;
* pattern infrastructure;
* Settings;
* eventual retirement.

Do not change Profiles.

---

# 68. Backup/Settings Placement

Determine whether always-present Backup/Settings controls remain appropriate after navigation convergence.

Task 5.19 deliberately kept them eager.

Product placement may still evolve later.

---

# 69. Product Terminology Audit

Identify terminology that should likely survive:

* Goal;
* Progress;
* Summary;
* Schedule;
* Commitment.

Identify terminology likely too implementation-oriented:

* Setup;
* Block Template;
* Recurrence;
* Preview;
* Friction Point;
* Segment;

where applicable.

Do not rename.

---

# 70. Engine Gap Classification

For every discovered blocker classify it as:

### Product/UI gap

Underlying capability exists; workflow/presentation is missing.

### Application-composition gap

Capability exists but is not exposed through the right application query/command boundary.

### Derived-query gap

Existing authorities contain enough truth; a new pure query/projection is needed.

### Engine gap

Scheduler cannot currently support required behavior.

### Authority gap

Existing durable authorities cannot truthfully represent required state.

### Unknown

More audit needed.

This classification is mandatory.

---

# 71. Avoid False Engine Work

Do not label something an engine gap merely because current UI cannot do it.

Trace authority and production code first.

---

# 72. Avoid Premature New Authority

Do not recommend new durable authority when:

* HistoricalPlan;
* ExecutionHistory;
* Active;
* Goal;
* Measurement Definition;
* Observation;

already contain enough truth.

Prefer derived read models where appropriate.

---

# 73. Migration Strategy Audit

Determine whether convergence can occur incrementally.

Preferred conceptual path:

```text
existing product
    ↓
introduce new surface shell
    ↓
reuse existing workflows inside it
    ↓
extract contextual workflows
    ↓
retire old primary structures
```

Compare against a “big bang” redesign.

Strong preference: incremental migration if feasible.

---

# 74. Compatibility During Migration

Determine whether old Planner/Preview workflows must coexist temporarily with new surfaces.

Identify risks of duplicate ways to edit the same authority.

---

# 75. One-Write-Path Principle

During migration, avoid two independent authoring workflows for the same concept unless they share the same canonical draft/command model.

Audit how this constrains sequencing.

---

# 76. Proposed Phase 6 Sequence

Produce an evidence-based sequence.

Do not assume the following exact numbering, but evaluate something conceptually like:

```text
6.1
Product-convergence audit

6.2
Surface/application boundary foundation

6.3
Monthly Planner shell + schedule review

6.4
Commitment workflow convergence

6.5
Friction resolution convergence

6.6
Daily Workspace read model

6.7
Daily Workspace surface

6.8
Execution/reporting integration

6.9
Cross-surface navigation/context

6.10
Legacy Setup/Preview retirement audit

6.11
Phase 6 UX/accessibility/performance exit
```

The audit must recommend the actual sequence based on evidence.

---

# 77. Phase 6 Scope Boundary

Determine what can reasonably fit in Phase 6 versus later phases.

Do not let “Platform Maturity” become an unlimited redesign phase.

Classify discovered work:

* Phase 6 essential;
* Phase 6 optional;
* later;
* explicitly out of scope.

---

# 78. Recommendation/Adaptation Boundary

Do not make advanced Recommendation/adaptation a prerequisite for Monthly Planner or Daily Workspace V1.

The surfaces should be useful with deterministic scheduling and reporting first.

---

# 79. Capacity Boundary

Do not make unimplemented Capacity metrics a prerequisite unless the audit proves the Planner cannot function coherently without them.

---

# 80. Progress Boundary

Do not make Progress mandatory for every Daily Workspace item.

Progress is Goal measurement, not generic execution completion.

---

# 81. Offline/Local-First Boundary

Preserve DayFrame's current local durable authority architecture.

Do not introduce network dependencies.

---

# 82. Privacy Boundary

No telemetry, analytics, sync, or remote service is required for this audit.

---

# 83. Required Evidence Standard

Every significant claim must be classified as:

* **Confirmed** — directly supported by production code and/or tests;
* **Inferred** — strongly implied by composition/behavior but not directly tested;
* **Not found** — searched for but no implementation located;
* **Product recommendation** — proposed future direction, not current behavior.

Do not present recommendations as existing architecture.

---

# 84. Required Code Evidence

For Confirmed findings cite:

* file;
* symbol/component/function;
* relevant line range where practical;
* test evidence for deterministic behavioral claims.

Do not rely on comments or names alone.

---

# 85. Required End-to-End Maps

Produce three maps.

### Current Planning Flow

```text
authored intent
    ↓
...
```

### Current Execution/Reporting Flow

```text
published plan
    ↓
...
```

### Proposed Mature Product Flow

```text
Monthly Planner
    ↓
Daily Workspace
    ↓
Summary
```

Clearly distinguish current behavior from proposed product direction.

---

# 86. Required Current-to-Future Surface Matrix

Produce:

| Current capability | Current surface | Authority | Proposed destination | Reuse strategy |
| ------------------ | --------------- | --------- | -------------------- | -------------- |
| Goals              |                 |           |                      |                |
| Measurement config |                 |           |                      |                |
| Progress reporting |                 |           |                      |                |
| Setup              |                 |           |                      |                |
| Schedule Preview   |                 |           |                      |                |
| Manual events      |                 |           |                      |                |
| Friction           |                 |           |                      |                |
| Suggested fixes    |                 |           |                      |                |
| Outcome reporting  |                 |           |                      |                |
| Summary Progress   |                 |           |                      |                |
| Goal Activity      |                 |           |                      |                |
| Backup/settings    |                 |           |                      |                |

---

# 87. Required Monthly Planner Matrix

Produce:

| Capability           | V1 classification | Existing support | Gap type | Notes |
| -------------------- | ----------------- | ---------------- | -------- | ----- |
| Goals                |                   |                  |          |       |
| Commitments          |                   |                  |          |       |
| Patterns             |                   |                  |          |       |
| month/calendar       |                   |                  |          |       |
| selected-day detail  |                   |                  |          |       |
| schedule review      |                   |                  |          |       |
| unplaced work        |                   |                  |          |       |
| friction             |                   |                  |          |       |
| suggested resolution |                   |                  |          |       |
| manual events        |                   |                  |          |       |
| measurement config   |                   |                  |          |       |
| Progress context     |                   |                  |          |       |
| capacity             |                   |                  |          |       |

---

# 88. Required Daily Workspace Matrix

Produce:

| Capability            | V1 classification | Existing support | Gap type | Notes |
| --------------------- | ----------------- | ---------------- | -------- | ----- |
| current user-day      |                   |                  |          |       |
| timeline              |                   |                  |          |       |
| now                   |                   |                  |          |       |
| next                  |                   |                  |          |       |
| later                 |                   |                  |          |       |
| outcome reporting     |                   |                  |          |       |
| Goal context          |                   |                  |          |       |
| measurement reporting |                   |                  |          |       |
| same-day change       |                   |                  |          |       |
| friction              |                   |                  |          |       |
| reschedule            |                   |                  |          |       |
| tomorrow preview      |                   |                  |          |       |

---

# 89. Required Surface Ownership Matrix

Produce:

| Capability            | Monthly Planner | Daily Workspace | Summary | Contextual/other |
| --------------------- | --------------: | --------------: | ------: | ---------------: |
| Goal authoring        |                 |                 |         |                  |
| Measurement config    |                 |                 |         |                  |
| Record Goal value     |                 |                 |         |                  |
| Progress analysis     |                 |                 |         |                  |
| commitment authoring  |                 |                 |         |                  |
| recurring pattern     |                 |                 |         |                  |
| schedule review       |                 |                 |         |                  |
| current-day execution |                 |                 |         |                  |
| outcome reporting     |                 |                 |         |                  |
| friction resolution   |                 |                 |         |                  |
| historical outcomes   |                 |                 |         |                  |
| Goal Activity         |                 |                 |         |                  |
| Backup/settings       |                 |                 |         |                  |

Use:

* Primary;
* Contextual;
* Read-only;
* No.

---

# 90. Required Authority Matrix

Produce:

| Surface capability    | Current authority/query | New authority required? | New derived query required? |
| --------------------- | ----------------------- | ----------------------: | --------------------------: |
| Monthly schedule      |                         |                         |                             |
| current user-day      |                         |                         |                             |
| now/next              |                         |                         |                             |
| outcome reporting     |                         |                         |                             |
| Goal context          |                         |                         |                             |
| Goal Progress context |                         |                         |                             |
| friction              |                         |                         |                             |
| same-day changes      |                         |                         |                             |

---

# 91. Required Component Reuse Matrix

Produce:

| Component/module              | Current role | Future assessment | Expected action |
| ----------------------------- | ------------ | ----------------- | --------------- |
| DayFrameApp                   |              |                   |                 |
| SetupScreen                   |              |                   |                 |
| Preview/Schedule              |              |                   |                 |
| GoalSection                   |              |                   |                 |
| GoalMeasurementSection        |              |                   |                 |
| GoalProgressReportingSection  |              |                   |                 |
| HistoricalIntelligenceSummary |              |                   |                 |
| friction UI                   |              |                   |                 |
| manual-event UI               |              |                   |                 |

Use future assessments such as:

* Reuse;
* Recompose;
* Split;
* Retire eventually;
* Preserve;
* Needs further audit.

---

# 92. Required Terminology Matrix

Produce:

| Current term   | Current meaning | User-facing quality | Proposed treatment |
| -------------- | --------------- | ------------------- | ------------------ |
| Setup          |                 |                     |                    |
| Preview        |                 |                     |                    |
| Schedule       |                 |                     |                    |
| Commitment     |                 |                     |                    |
| Pattern        |                 |                     |                    |
| Block Template |                 |                     |                    |
| Recurrence     |                 |                     |                    |
| Friction       |                 |                     |                    |
| Segment        |                 |                     |                    |
| Goal           |                 |                     |                    |
| Progress       |                 |                     |                    |

---

# 93. Required Time-Horizon Matrix

Produce:

| Concern                | Monthly Planner | Daily Workspace | Summary |
| ---------------------- | --------------- | --------------- | ------- |
| temporal orientation   |                 |                 |         |
| canonical date concept |                 |                 |         |
| range                  |                 |                 |         |
| user-day boundary      |                 |                 |         |
| evaluation cutoff      |                 |                 |         |
| historical publication |                 |                 |         |

---

# 94. Required Publication Matrix

Produce:

| State                  | Current semantics | Future UX question |
| ---------------------- | ----------------- | ------------------ |
| authored setup changed |                   |                    |
| Preview generated      |                   |                    |
| Preview stale          |                   |                    |
| plan published         |                   |                    |
| plan republished       |                   |                    |
| same-day plan changed  |                   |                    |
| historical evaluation  |                   |                    |

---

# 95. Required Workflow Matrix

Produce:

| Workflow          | Current path | Desired mature path | Gap |
| ----------------- | ------------ | ------------------- | --- |
| Add Commitment    |              |                     |     |
| Edit Commitment   |              |                     |     |
| Review Schedule   |              |                     |     |
| Resolve Friction  |              |                     |     |
| Record Outcome    |              |                     |     |
| Record Goal Value |              |                     |     |
| Review Progress   |              |                     |     |
| Live the Day      |              |                     |     |

---

# 96. Required Navigation Matrix

Produce:

| Model                      | Advantages | Risks | Architecture fit | Recommendation |
| -------------------------- | ---------- | ----- | ---------------- | -------------- |
| Planner / Today / Summary  |            |       |                  |                |
| Month / Today / Summary    |            |       |                  |                |
| Plan / Today / Review      |            |       |                  |                |
| Current + contextual Daily |            |       |                  |                |

---

# 97. Required Mobile Matrix

Produce:

| Capability       | Desktop expectation | Mobile constraint | Existing reusable pattern |
| ---------------- | ------------------- | ----------------- | ------------------------- |
| month navigation |                     |                   |                           |
| selected day     |                     |                   |                           |
| schedule review  |                     |                   |                           |
| friction         |                     |                   |                           |
| current/next     |                     |                   |                           |
| reporting        |                     |                   |                           |

---

# 98. Required Gap Matrix

Produce:

| Gap | Classification                                                          | Blocks Monthly Planner? | Blocks Daily Workspace? | Priority |
| --- | ----------------------------------------------------------------------- | ----------------------: | ----------------------: | -------- |
| ... | Product/UI / Application / Derived query / Engine / Authority / Unknown |                         |                         |          |

This matrix should become one of the primary inputs to the Phase 6 roadmap.

---

# 99. Required Migration Matrix

Produce:

| Current structure | Intermediate state | Mature state | Duplicate-write risk |
| ----------------- | ------------------ | ------------ | -------------------- |
| Setup             |                    |              |                      |
| Preview           |                    |              |                      |
| Goal workflows    |                    |              |                      |
| reporting         |                    |              |                      |
| navigation        |                    |              |                      |

---

# 100. Required Phase 6 Sequence Matrix

Produce:

| Proposed task | Purpose | Prerequisites | User-visible? | Risk |
| ------------- | ------- | ------------- | ------------: | ---- |
| 6.2           |         |               |               |      |
| 6.3           |         |               |               |      |
| ...           |         |               |               |      |

Do not manufacture unnecessary tasks to fill numbering.

---

# 101. Required Product-Boundary Matrix

Produce:

| Capability             | Phase 6 assessment |
| ---------------------- | ------------------ |
| Monthly Planner        |                    |
| Daily Workspace        |                    |
| Summary                |                    |
| Goal authoring         |                    |
| commitment convergence |                    |
| Pattern Library        |                    |
| friction convergence   |                    |
| execution reporting    |                    |
| Progress reporting     |                    |
| Capacity               |                    |
| Planned Allocation     |                    |
| Recommendations        |                    |
| adaptation             |                    |
| historical Progress    |                    |
| network/sync           |                    |

Use:

* Essential;
* Useful;
* Later;
* Preserve;
* Contextual;
* Out of scope.

---

# 102. Required Epistemic Matrix

Produce:

| Evidence/state         | DayFrame may present | Must not infer |
| ---------------------- | -------------------- | -------------- |
| scheduled now          |                      |                |
| scheduled item ended   |                      |                |
| no execution report    |                      |                |
| completed report       |                      |                |
| skipped report         |                      |                |
| unplaced item          |                      |                |
| blocked item           |                      |                |
| stale Preview          |                      |                |
| current Goal at 100%   |                      |                |
| high Goal Activity     |                      |                |
| missing history        |                      |                |
| same-day republication |                      |                |

---

# 103. Architectural Questions to Answer

The final audit must explicitly answer:

1. Are Monthly Planner and Daily Workspace the correct primary surface boundaries?
2. Should Monthly Planner literally be month-bound?
3. Should Daily Workspace represent the canonical current user-day?
4. Does Summary remain the correct third primary surface?
5. Can current Preview/Schedule visualization underpin Monthly Planner?
6. Can it underpin Daily Workspace?
7. What becomes of SetupScreen?
8. What becomes of GoalSection?
9. Where should Measurement configuration live?
10. Where should Progress reporting live?
11. Where should outcome reporting live?
12. Where should manual events be authored?
13. Where should friction resolution live?
14. Should Patterns be contextual?
15. Is a new generic Commitment authority required?
16. Is new Daily Workspace authority required?
17. Is a new current-plan authority required?
18. Is an explicit plan acceptance/publication workflow required?
19. Can now/next be derived from current authorities?
20. Can same-day changes be represented truthfully?
21. What are the actual engine blockers?
22. What are merely UI/composition blockers?
23. What can be reused substantially?
24. What should eventually be retired?
25. What is the smallest useful Monthly Planner V1?
26. What is the smallest useful Daily Workspace V1?
27. What should Phase 6 deliberately defer?
28. What should Task 6.2 be?

---

# 104. Stop Conditions

Stop the audit and report rather than recommending implementation if:

* current publication semantics cannot be determined;
* current plan authority cannot be determined;
* current user-day semantics cannot be determined;
* ExecutionHistory cannot be traced to exact scheduled occurrences;
* same-day republication behavior is ambiguous;
* Setup/Preview write ownership cannot be established;
* a proposed surface would require silently merging authorities;
* a generic Commitment authority appears necessary but has not been architecturally evaluated;
* a Daily Workspace authority appears necessary but has not been architecturally evaluated;
* an explicit plan-acceptance authority appears necessary;
* repository evidence contradicts the proposed three-surface model.

A stop condition does **not** mean Phase 6 fails.

It means the next task should be the necessary architecture audit before UI implementation.

---

# 105. No-Code Rule

Task 6.1 must not modify production code.

Permitted changes:

* Task 6.1 audit result;
* Phase 6 checkpoint;
* Roadmap;
* Current State;
* Changelog;
* architecture/audit documentation where appropriate.

Do not:

* create components;
* rename navigation;
* move components;
* add queries;
* change authorities;
* add tests merely for future behavior;
* modify build configuration.

---

# 106. Validation

Because this is a no-production-code audit:

Run repository-standard validation sufficient to establish the audited baseline.

At minimum, where available:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

If formatting documentation changes:

```bash
npm run format
```

Record exact:

* test-file count;
* test count;
* build module count;
* bundle budget result;
* documentation diff result.

Do not claim behavioral validation for recommendations.

---

# 107. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.1_MONTHLY_PLANNER_AND_DAILY_WORKSPACE_PRODUCT_CONVERGENCE_AUDIT_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Phase 5 Exit Confirmation
4. Audit Scope
5. Files/Subsystems Reviewed
6. Evidence Method
7. Current Navigation
8. Current Surface Composition
9. Current Planning Flow
10. Current Schedule/Preview Semantics
11. Current Publication Semantics
12. Current Plan Authority
13. Current Execution/Reporting Flow
14. Current User-Day Semantics
15. Current Calendar Infrastructure
16. Current Friction Infrastructure
17. Current Goal Workflow
18. Current Measurement Workflow
19. Current Progress Reporting Workflow
20. Current Summary Role
21. Current Loading Architecture
22. Commitment-Like Source Inventory
23. Monthly Planner Boundary Assessment
24. Monthly Horizon Assessment
25. Monthly Planner V1
26. Daily Workspace Boundary Assessment
27. Daily/User-Day Assessment
28. Daily Workspace V1
29. Summary Preservation Assessment
30. Pattern Library Assessment
31. Goal Placement
32. Measurement Placement
33. Progress Reporting Placement
34. Outcome Reporting Placement
35. Manual Event Placement
36. Friction Placement
37. Capacity Placement
38. Planned Allocation Placement
39. Recommendation Placement
40. Add Commitment Workflow
41. Edit Commitment Workflow
42. Review Schedule Workflow
43. Resolve Friction Workflow
44. Live-the-Day Workflow
45. SetupScreen Future Assessment
46. Preview/Schedule Future Assessment
47. GoalSection Future Assessment
48. Measurement UI Future Assessment
49. Summary Future Assessment
50. App-Shell Assessment
51. Navigation Model Assessment
52. Terminology Assessment
53. Desktop Assessment
54. Mobile Assessment
55. Accessibility Assessment
56. Bundle/Loading Implications
57. Persistence Implications
58. HistoricalPlan Implications
59. ExecutionHistory Implications
60. Goal/Measurement/Observation Implications
61. Preview Implications
62. Profile Implications
63. Backup/Settings Implications
64. Plan-vs-Preview Assessment
65. Acceptance/Publication Assessment
66. Direct Manipulation Assessment
67. Now/Next Assessment
68. Same-Day Change Assessment
69. Engine Gap Assessment
70. Application Gap Assessment
71. Derived-Query Gap Assessment
72. Authority Gap Assessment
73. Reuse Assessment
74. Retirement Assessment
75. Incremental Migration Assessment
76. Duplicate-Write Risk Assessment
77. Phase 6 Scope Recommendation
78. Phase 6 Sequence Recommendation
79. Current-to-Future Surface Matrix
80. Monthly Planner Matrix
81. Daily Workspace Matrix
82. Surface Ownership Matrix
83. Authority Matrix
84. Component Reuse Matrix
85. Terminology Matrix
86. Time-Horizon Matrix
87. Publication Matrix
88. Workflow Matrix
89. Navigation Matrix
90. Mobile Matrix
91. Gap Matrix
92. Migration Matrix
93. Phase 6 Sequence Matrix
94. Product-Boundary Matrix
95. Epistemic Matrix
96. Architectural Questions — Answers
97. Architectural Invariant Assessment
98. Stop-Condition Assessment
99. Validation
100. Governance Updates
101. Deviations
102. Discoveries
103. Deferred Work
104. Recommended Task 6.2
105. Final Audit Determination

---

# 108. Architectural Invariants

Assess at minimum:

1. Task 6.1 changes no production behavior.
2. Monthly Planner is treated as proposed product structure, not existing fact.
3. Daily Workspace is treated as proposed product structure, not existing fact.
4. Summary semantics remain settled.
5. authored state remains distinct from Preview.
6. Preview remains distinct from HistoricalPlan.
7. HistoricalPlan remains distinct from ExecutionHistory.
8. Goal remains distinct from schedulable commitment.
9. Measurement Definition remains distinct from Progress Observation.
10. Progress remains derived.
11. Goal Activity remains derived.
12. scheduled does not mean completed.
13. elapsed does not mean completed.
14. missing report does not mean skipped.
15. unplaced does not mean skipped.
16. blocked does not imply blame.
17. user-day semantics are preserved.
18. overnight semantics are preserved.
19. shift-specific preferences are preserved.
20. no calendar-midnight assumption is introduced.
21. no generic Commitment authority is assumed.
22. no Daily Workspace authority is assumed.
23. no current-plan authority is assumed.
24. no acceptance authority is assumed.
25. authority gaps are explicitly classified.
26. engine gaps are distinguished from UI gaps.
27. derived-query gaps are distinguished from authority gaps.
28. current production behavior is cited.
29. recommendations are labeled as recommendations.
30. SetupScreen is audited rather than prematurely retired.
31. Preview is audited rather than prematurely retired.
32. GoalSection is audited rather than prematurely moved.
33. Summary is preserved rather than redesigned.
34. Pattern Library remains contextual unless evidence says otherwise.
35. Monthly does not automatically mean calendar month.
36. Daily does not automatically mean midnight-to-midnight.
37. Daily Workspace is not reduced to a calendar view.
38. Monthly Planner is not reduced to a month grid.
39. current schedule visualization is assessed for reuse.
40. current reporting workflows are assessed for reuse.
41. friction semantics remain unchanged.
42. suggested fixes are not conflated with Recommendations.
43. Capacity is not invented.
44. Planned Allocation is not invented.
45. Recommendation policy is not invented.
46. adaptation is not introduced.
47. historical Progress is not introduced.
48. network/sync is not introduced.
49. current bundle budgets remain unchanged.
50. Task 5.19 loading decisions remain unchanged.
51. no router is introduced.
52. no component is created.
53. no production query is created.
54. no authority is created.
55. no persistence schema changes.
56. no Backup version change.
57. no migration occurs.
58. no duplicate authoring path is introduced.
59. migration sequencing protects one-write-path semantics.
60. desktop and mobile are considered separately.
61. keyboard alternatives are required for future direct manipulation.
62. accessibility is treated as architecture, not polish.
63. publication semantics are explicitly resolved.
64. current-plan semantics are explicitly resolved.
65. same-day change semantics are explicitly resolved.
66. now/next semantics are explicitly resolved.
67. Daily execution truth is not inferred from clock time alone.
68. Phase 6 scope is bounded.
69. advanced Recommendations are not prerequisites for surface convergence.
70. audit findings determine Task 6.2 rather than assumed implementation order.
71. canonical baseline validation remains green.
72. Phase 6 begins from the accepted Phase 5 bundle architecture.

Classify each as:

* Confirmed;
* Inferred;
* Product recommendation;
* Not found;
* Preserved;
* Not applicable;
* Blocked.

---

# 109. Phase 6 Entry Decision

The audit must end with one of three determinations:

### A — Ready for surface convergence

Existing authorities and engine behavior are sufficient.

Task 6.2 may begin application/surface restructuring.

### B — Architecture gap first

The product direction is sound, but one or more authority/application/engine gaps must be resolved before surface implementation.

Task 6.2 should address the highest-leverage blocker.

### C — Product boundary revision required

Repository evidence shows Monthly Planner / Daily Workspace / Summary is not a coherent product model.

Task 6.2 should refine product architecture before implementation.

Do not force determination A.

---

# 110. Final Audit Principle

> **Phase 6 should reorganize DayFrame around the way people plan and live their time, while preserving the rigorous authority and historical semantics built underneath it.**

The purpose of Task 6.1 is to determine exactly how far the current architecture can already support that product—and exactly what must be built before we expose it.

---

# 111. Final Completion Statement

**Task 6.1 is complete when the current DayFrame planning, scheduling, publication, execution, reporting, Goal, Measurement, Progress, friction, calendar, navigation, loading, persistence, and user-day systems have been traced from production code and tests; when the proposed Monthly Planner, Daily Workspace, and existing Summary surfaces have each been given explicit user questions, temporal orientations, capability ownership, and non-ownership boundaries; when “Monthly” has been tested against actual planning-range semantics rather than assumed to mean calendar month and “Daily” has been tested against DayFrame's canonical user-day rather than calendar midnight; when the audit determines whether current Preview/Schedule, SetupScreen, GoalSection, Measurement UI, reporting UI, friction UI, manual-event UI, and Summary can be reused, recomposed, split, preserved, or eventually retired; when current plan publication, republication, current-plan identity, same-day change, now/next, and execution-reporting semantics are explicitly established; when every missing capability is classified as a Product/UI, Application-composition, Derived-query, Engine, Authority, or Unknown gap rather than generically described as unfinished work; when the audit determines whether any new Commitment, Daily Workspace, current-plan, or acceptance authority is genuinely required without creating one; when the smallest coherent Monthly Planner V1 and Daily Workspace V1 are defined; when desktop, mobile, accessibility, one-write-path migration, and Task 5.19 bundle constraints are incorporated; when a bounded Phase 6 sequence is recommended from repository evidence; when no production code, authority, persistence, schema, Backup version, router, Recommendation policy, Capacity metric, adaptation behavior, or premature redesign has been introduced; when canonical baseline validation remains green; and when the audit concludes explicitly whether Phase 6 is ready for surface convergence, requires an architecture gap task first, or requires revision of the proposed product boundaries—and identifies the evidence-based Task 6.2 that should follow.**
