# Task 5.17 — Progress Observation Reporting V1 UX and Goal-Scoped History Read Model

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Bounded application/read-model and Planner UX integration for Manual Quantity Progress Observation reporting, Goal-scoped observation history, correction/retraction workflows, accessibility, responsive behavior, regression testing, and governance.

**No Summary Progress UI, Progress bar, Recommendation, pace, trend, forecast, or adaptive behavior is authorized.**

---

# 1. Objective

Make the already-implemented Progress Observation authority usable from Planner / Plan for a selected Goal.

A user must be able to:

* record the Goal's current measured quantity;
* record a later measured quantity;
* optionally record a quantity observed earlier than the current moment where canonical authority permits it;
* inspect Goal-scoped measurement records;
* distinguish a new measurement from a correction;
* correct a prior record without rewriting history;
* remove an invalid record through canonical retraction rather than hard deletion;
* understand which target/unit measurement period a record belongs to;
* remain protected from stale definition or observation revisions.

This task must also add the **bounded Goal-scoped history read model** identified by Task 5.15 as the one remaining API gap required for correction/retraction UX.

Task 5.17 must not expose derived Progress in Summary.

Task 5.16 already established the Measurement configuration UX and its Planner placement. Preserve it unchanged.

---

# 2. Governing Product Model

Preserve the current Planner Goal hierarchy:

```text
Goal detail

Authored Goal context
Lifecycle

Measurement
    target / unit
    configuration actions

Progress reporting
    Record Current Value
    measurement records

Supporting commitments
```

Exact placement may vary slightly according to current component composition, but Progress reporting must remain clearly associated with the selected Goal and its current Measurement.

Do not move reporting into Setup.

---

# 3. Governing Authority Model

Keep these concepts distinct:

```text
Goal
    what the user wants

Measurement Definition
    how the Goal is measured

Progress Observation
    what measured state was recorded

Progress
    derived interpretation
```

Task 5.17 may write **Progress Observation authority only** through reporting actions.

It may read:

* Goal;
* Measurement Definition;
* Progress Observation.

It must not write:

* Goal;
* Measurement Definition;
* Goal Activity;
* HistoricalPlan;
* ExecutionHistory;
* Schedule;
* Preview;
* derived Progress.

---

# 4. Governing Reporting Principle

> **The user records a measured state, not a Progress percentage.**

Use product language that reflects this.

Preferred primary action:

**Record Current Value**

Avoid:

* Edit Progress;
* Set Progress;
* Update Percentage;
* Add 10%;
* Log Progress %.

---

# 5. Governing Absolute-Value Principle

For `manualQuantityTarget@1`, every observation is an **absolute current quantity**.

Example:

```text
Prior record:
10,000 words

User later has:
12,400 words

Correct new report:
12,400 words

Incorrect:
+2,400 words
```

The UI must communicate this clearly.

Canonical helper meaning:

> Enter the current total, not the amount added since your last record.

---

# 6. Governing Correction Principle

A correction means:

> **The prior record was wrong.**

It is not:

> **I measured again later.**

Therefore:

```text
New measured state later
    → create new observation

Earlier record entered incorrectly
    → correct observation

Earlier record should not count
    → retract observation
```

The UX must make these distinctions understandable.

---

# 7. Governing History Principle

The user needs enough Goal-scoped history to:

* identify a record;
* understand its value/time;
* choose correction;
* choose retraction;
* see whether a record belongs to an older measurement period.

Do not turn this into a full forensic authority browser.

---

# 8. Explicit Scope

Implement:

* Goal-scoped observation-history application/read model;
* selected-Goal reporting section;
* Record Current Value workflow;
* canonical absolute quantity entry;
* observed date/time entry;
* current measurement context;
* stale-definition protection;
* Goal/definition binding through canonical commands;
* Goal-scoped measurement-record list;
* record status where appropriate;
* correction workflow;
* correction observed-time handling;
* retraction workflow;
* confirmation;
* canonical revision guards;
* loading/protection/durability states;
* unsupported measurement behavior;
* inactive measurement behavior;
* completed/archived Goal product policy;
* accessibility;
* keyboard/focus behavior;
* responsive/mobile behavior;
* tests;
* bundle tracking;
* governance.

---

# 9. Explicit Non-Goals

Do not implement:

* Summary Progress;
* percentage presentation;
* Progress bar;
* Goal Activity restructuring;
* multi-Goal Progress dashboard;
* measurement-definition history browser beyond what reporting context requires;
* hard observation deletion;
* unretract/reactivate observation workflow;
* automatic observations;
* ExecutionHistory → Observation conversion;
* Goal Activity → Observation conversion;
* scheduled duration → Observation conversion;
* unit conversion;
* custom units;
* baseline;
* new measurement policies;
* pace;
* on-track/behind;
* trend;
* forecast;
* Recommendation;
* RecommendationDecision;
* adaptation;
* automatic Goal completion;
* bundle/code-splitting optimization.

---

# 10. Execution Artifact Rules

Before implementation:

1. verify this complete Task 5.17 artifact;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.13 result;
   * Task 5.14 result;
   * Task 5.15 result;
   * Task 5.16 result;
   * Progress Observation ADR if present;
   * `GoalMeasurementSection`;
   * `GoalSection`;
   * Goal subscription/composition;
   * Measurement Definition status/history queries;
   * Progress Observation commands;
   * Progress Observation exact/history/effective queries;
   * Progress Observation protection/durability;
   * canonical decimal validation;
   * timestamp handling;
   * focus/dialog conventions;
   * responsive styles;
   * Backup V6/full-clear behavior;
6. do not modify the immutable Task 5.17 artifact.

Create:

`docs/implementation/phase-5/TASK_5.17_PROGRESS_OBSERVATION_REPORTING_V1_UX_AND_GOAL_SCOPED_HISTORY_READ_MODEL_RESULT.md`

---

# 11. Required Initial Audit

Before changing production code, confirm the actual signatures and semantics for:

* create observation;
* correct observation;
* retract observation;
* observation revision guards;
* expected definition revision guard;
* effective definition resolution;
* observation-history queries;
* retracted-lineage representation;
* durability retry;
* protection states;
* `observedAt` validation;
* `recordedAt` handling;
* same-time conflict handling.

Do not infer these from task text.

Production code governs.

---

# 12. Stop Conditions

Stop and report if:

* a Goal-scoped history read model cannot be built from canonical Observation authority;
* correction cannot identify the current observation head;
* retracted records cannot be represented truthfully;
* stale definition revisions cannot be guarded;
* stale observation revisions cannot be guarded;
* observed-time input cannot be converted to canonical authority semantics safely;
* Goal/definition binding would need to be duplicated in UI state as authority;
* correction would require changing definition binding;
* retraction would require hard deletion;
* inactive measurement cannot be distinguished from no measurement;
* protected Observation authority cannot be distinguished from no records;
* reporting requires Measurement Definition mutation;
* reporting requires Goal mutation;
* reporting requires Progress projection mutation;
* a new Backup version is required;
* a new persistence authority is required;
* Summary Progress becomes necessary for reporting to function.

Do not widen scope to bypass a blocker.

---

# 13. Goal-Scoped Observation History Read Model

Add one canonical bounded application/read model suitable for Planner reporting.

It should answer approximately:

> What measurement records are relevant to this Goal, and what is the current effective state of each observation lineage?

Do not force React to assemble history by scanning raw storage.

---

# 14. History Read Model Responsibilities

The read model should provide enough product-safe data to render:

* observation ID internally;
* current revision internally;
* value;
* unit;
* observed time;
* recorded time if useful;
* active/retracted state;
* exact definition revision/measurement-period relationship;
* current versus prior measurement period;
* whether correction/retraction is currently allowed;
* unsupported/protected state where applicable.

Avoid exposing storage-specific structures.

---

# 15. History Ordering

Recommended user ordering:

```text
newest observedAt first
then deterministic canonical tie-breaker
```

Use established authority semantics.

Do not let persistence order determine UX.

---

# 16. Observation Revision History

The main Goal-scoped list should generally represent **logical records**, not every immutable correction revision as separate peer rows.

Example:

```text
Aug 24
12,400 words
Corrected
```

rather than:

```text
Observation r1
Observation r2
```

The immutable revision history remains authority.

Expose correction provenance only as much as needed for truthfulness.

---

# 17. Retracted Record Presentation

A retracted observation should not look like a current active measured record.

Determine whether first UI:

### A. keeps retracted rows visible with “Removed” status

or

### B. hides them by default behind history disclosure.

Strong preference for V1 correction transparency:

> Keep retracted records visible in history with a neutral status such as **Removed from current measurement history** or a shorter equivalent.

Do not say permanently deleted.

---

# 18. Current Measurement Period

The history UI must distinguish records belonging to the currently effective definition revision from records belonging to prior measurement periods.

Preferred product framing:

```text
Current measurement period

Previous measurement periods
```

Do not expose “definition revision 3” as primary copy.

---

# 19. Previous Measurement Period Records

Records from prior target/unit periods must remain inspectable.

They must not be presented as evidence for the current measurement period.

Do not offer ordinary current-value correction if canonical correction rules prohibit editing historical-epoch evidence through current UI.

Audit actual command semantics.

---

# 20. Measurement Context

When measurement is active, reporting section should show enough context:

```text
Progress Reporting

Current measurement
Target: 50,000 words

Record Current Value
```

Avoid duplicating the full Measurement configuration section unnecessarily.

---

# 21. No Active Measurement

If Goal has:

* never been measured; or
* measurement currently stopped;

do not allow **Record Current Value**.

Use truthful copy.

Never measured:

> Set up Measurement before recording a value.

Stopped:

> Measurement is stopped. Restart it before recording a new current value.

Navigation/action may point to the existing Measurement subsection if practical.

---

# 22. Unsupported Measurement

If current Measurement policy is unsupported:

* reporting is unavailable;
* preserve existing records;
* do not coerce values into Manual Quantity;
* do not expose Record Current Value.

Use product copy consistent with Task 5.16.

---

# 23. Observation Authority Loading

Loading Observation authority is not:

> No records yet.

Show loading/status semantics.

---

# 24. Observation Authority Protected

Protected authority is not:

> No current value.

Use recovery semantics consistent with existing protected authorities.

Hide observation writes while protected unless canonical behavior explicitly allows them.

---

# 25. Durability Failure

If Observation authority has session-only state because persistence failed:

* show truthful session-only status;
* expose canonical retry if supported;
* do not claim record is durably saved.

Reuse existing durability patterns.

---

# 26. Record Current Value

For active supported Manual Quantity measurement, expose:

**Record Current Value**

Opening it creates an ephemeral draft.

---

# 27. Observation Form

Minimum V1 fields:

```text
Current value
Observed date/time
```

Static context:

* Goal title;
* target;
* unit.

Do not expose:

* recordedAt;
* definition ID;
* definition revision;
* observation ID;
* Progress percentage.

---

# 28. Current Value Field

Use canonical decimal input strategy consistent with Task 5.16:

```text
type="text"
inputMode="decimal"
maxLength=100
```

if still compatible with authority validation.

Zero must be accepted.

Do not use browser float parsing as truth.

---

# 29. Absolute-Value Helper Copy

Visible helper text:

> Enter the current total, not the amount added since your last record.

This is a semantic requirement.

---

# 30. Unit Context

Display the unit beside or near the input.

Example:

```text
Current value
[ 12400 ] words
```

Do not allow changing unit in the observation form.

Unit comes from the Measurement Definition.

---

# 31. Target Context

Show target non-editably:

```text
Target
50,000 words
```

Do not edit target from the reporting form.

Provide no hidden Measurement Definition mutation.

---

# 32. observedAt Input

Audit canonical timestamp utilities.

The UI should present `observedAt` in understandable local date/time form.

Recommended:

* default to current local date/time;
* user-editable;
* convert explicitly to canonical stored instant;
* seconds need not be user-facing unless repository conventions require them.

Do not expose `recordedAt`.

---

# 33. Backdated Observation

Allow recording a past observed time where canonical authority permits it and where the exact Measurement Definition epoch is valid.

Example:

```text
I measured this yesterday
```

must remain representable.

---

# 34. Definition Epoch Guard

When the observation form opens, capture the expected current Measurement Definition revision if required.

If Measurement changes before save:

* do not silently bind to new definition;
* return a stale-definition conflict;
* retain draft;
* explain the measurement changed and the user should review before retry.

---

# 35. Future observedAt

Follow canonical authority semantics.

If future-dated observations are prohibited:

* provide field-level error;
* focus date/time field;
* do not alter authority.

Do not invent scheduling semantics.

---

# 36. Record Save Action

Use:

**Record Value**

or **Save Current Value**.

Prefer one unambiguous label and use consistently.

On submit:

* validate;
* call canonical create-observation command;
* write Progress Observation only;
* do not mutate Measurement Definition;
* do not mutate Goal;
* do not calculate/display Progress in this task;
* refresh from canonical history.

---

# 37. Successful Record

After success:

* close draft;
* update Goal-scoped history;
* return focus to stable reporting heading/history/action;
* announce success appropriately if current conventions support it.

Do not show a percentage.

---

# 38. Record Conflict

Handle:

* stale Measurement Definition;
* same-time observation conflict;
* authority conflict;
* validation failure;

using product language.

Do not silently choose another binding/time.

---

# 39. Same-Time Conflict UX

If canonical authority rejects two active records at identical `observedAt` within one definition period:

explain approximately:

> A measurement already exists for this time. Record a different time or correct the existing record.

Prefer directing the user toward **Correct Record** if that is their intent.

---

# 40. New Measurement vs Correction

The history and forms must teach:

**Record New Value**

> Use when you measured the Goal again.

**Correct Record**

> Use when an existing record was entered incorrectly.

Do not use the same form/action label for both without context.

---

# 41. Record New Value

After at least one record exists, the primary action may become:

**Record New Value**

rather than **Record Current Value**.

Either is acceptable if terminology remains consistent.

Choose one rule and document it.

---

# 42. Correction Entry Point

Each eligible active historical record should expose:

**Correct Record**

Do not expose generic Edit if it obscures immutable evidence semantics.

---

# 43. Correction Form

Prepopulate:

* current effective value;
* observed date/time.

Static:

* Goal;
* target/unit belonging to the observation's exact measurement period.

Do not allow definition binding/unit editing.

---

# 44. Correction Value

May replace value with another canonical decimal, including zero.

---

# 45. Correction observedAt

If canonical authority permits changing observedAt within the same definition epoch:

allow it.

If the revised observed time would cross into a different measurement period:

reject with explanatory error.

Suggested meaning:

> This record belongs to a different measurement period at that time. Record a new value instead.

Follow actual authority result semantics.

---

# 46. Correction Save

Use:

**Save Correction**

Call canonical correct-observation command with expected observation revision.

Do not destroy prior revision.

---

# 47. Correction No-Op

If value/time are unchanged:

preserve canonical no-op behavior.

No new observation revision.

---

# 48. Observation Revision Conflict

If the record changed while being corrected:

* retain draft;
* refresh canonical record;
* explain conflict;
* require explicit review/retry;
* do not silently overwrite.

---

# 49. Correction After Retraction

If authority prohibits correction after retraction:

do not show Correct Record for retracted heads.

Do not build unretract.

---

# 50. Retraction Entry Point

Use product-facing action such as:

**Remove Invalid Record**

This is preferable to “Delete” because the authority preserves historical evidence.

---

# 51. Retraction Explanation

Before confirmation, explain:

> This removes the record from the current measurement history without deleting its audit history.

Refine wording to match product tone while preserving semantics.

Avoid exposing “retraction revision” jargon.

---

# 52. Retraction Confirmation

Use accessible confirmation.

Suggested:

> Remove this record?

> It will no longer count as current measurement evidence. Its history will still be preserved.

Actions:

* **Remove Invalid Record**
* **Cancel**

---

# 53. Retraction Save

Call canonical retract command with expected observation revision.

No hard delete.

---

# 54. Repeated Retraction

No action should normally be shown for already retracted records.

Canonical repeated-retraction behavior remains protected underneath.

---

# 55. Retraction Focus

On confirmation success:

* focus a stable history heading or neighboring record/action;
* do not leave focus in removed DOM.

---

# 56. Observation History Row Content

For current active records, show at minimum:

* value + unit;
* observed date/time.

Optional where helpful:

* “Recorded later” distinction;
* correction status.

Do not overload every row with technical provenance.

---

# 57. observedAt vs recordedAt Presentation

Primary record time is:

> Observed

`recordedAt` may be secondary explanatory metadata when it differs materially or when correction provenance is opened.

Do not make system knowledge time look like measurement time.

---

# 58. Correction Status

If the current head is a correction, a compact neutral indicator such as:

**Corrected**

may be useful.

Do not display raw revision number.

---

# 59. Retraction Status

Use a neutral product label such as:

**Removed**

or:

**Removed from measurement**

Clarify in detail that history is preserved.

---

# 60. Definition Period Context

If target/unit changed, history should make period boundaries understandable.

Example:

```text
Current measurement
50,000 words

Aug 24 — 12,400 words

Previous measurement
40,000 words

Aug 10 — 9,000 words
```

Do not merge old and new evidence as if all share current semantics.

---

# 61. History Density

Do not display every immutable correction revision inline by default.

One row per logical observation lineage is preferred.

If a lightweight “record history” disclosure is necessary to explain a correction, keep it bounded.

---

# 62. Full Audit History Boundary

Do not build:

* revision timelines;
* ID inspection;
* raw authority JSON;
* policy fingerprint displays.

Deferred.

---

# 63. Completed Goal Reporting

Task 5.16 allows Measurement configuration for Completed Goals.

Task 5.17 should audit current authority and Task 5.15 product decision.

Preferred V1 if authority allows it:

> Completed Goals may still receive measurements unless product audit explicitly prohibited them.

Do not infer that lifecycle freezes evidence.

Document actual policy.

---

# 64. Archived Goal Reporting

Task 5.15 recommended archived Goals should not accept new reporting until reactivated.

Preserve that product policy.

For archived Goals:

* history remains readable;
* no Record Current/New Value;
* no correction/retraction writes unless audit result specifically supports maintenance of past evidence while archived.

Strong default:

* read-only reporting history until reactivation.

Do not mutate authority merely to enforce this UI policy.

---

# 65. Goal Lifecycle Independence

Complete/archive/reactivate commands do not mutate observations.

Observation writes do not mutate Goal lifecycle.

---

# 66. Measurement Stop Independence

Stopping Measurement does not retract old observations.

History remains readable.

No new observation may be recorded until restart.

---

# 67. Measurement Restart Independence

Restart begins a new definition period.

Old observations remain in previous-period history.

New records bind only to the restarted period.

---

# 68. Target/Unit Change Independence

Old observations remain exact historical evidence.

Do not convert, copy, migrate, or retarget them.

---

# 69. Goal Rename

History uses current Goal context at the Goal-detail level.

Observation identity remains unchanged.

Do not rewrite records.

---

# 70. Goal Activity Independence

Recording/correcting/retracting observations must not change Goal Activity.

Add regression if needed.

---

# 71. ExecutionHistory Independence

Do not import or mirror ExecutionHistory.

---

# 72. HistoricalPlan Independence

No publication/republication.

---

# 73. Scheduler Independence

No schedule impact.

---

# 74. Preview Independence

Observation changes must not stale Preview.

---

# 75. Setup Independence

No Setup state/API involvement.

---

# 76. Profile Independence

Profiles do not own Observation authority.

Profile load does not replace records.

---

# 77. Summary Boundary

Do not add:

* Progress card;
* quantity/target display;
* percentage;
* Progress provenance;
* Record Current Value action in Summary.

That is Task 5.18.

---

# 78. Progress Projection Boundary

Do not call `queryGoalProgress` merely to show derived Progress in this task.

If current Goal-detail reporting context needs a target, get it from Measurement Definition.

Do not leak Task 5.18 forward.

---

# 79. Accessibility — Section Structure

Use semantic heading for reporting/history.

Ensure reporting actions are correctly associated with the selected Goal.

---

# 80. Accessibility — Record Form

Fields require:

* visible labels;
* helper copy;
* programmatic descriptions;
* field-level errors;
* keyboard operation.

---

# 81. Accessibility — Record Focus

Opening Record Current/New Value focuses:

**Current value**

---

# 82. Accessibility — Date/Time Focus

If value passes and observed time fails, focus the observed-time control.

---

# 83. Accessibility — Correction Focus

Opening Correct Record focuses the value field.

---

# 84. Accessibility — Retraction Dialog

Use established accessible dialog pattern.

Focus Cancel initially if consistent with Task 5.16 stop dialog, unless repository convention prefers destructive action placement differently.

---

# 85. Accessibility — History Actions

Correction/removal button names must identify the record sufficiently for assistive technology.

Example accessible label:

> Correct record: 12,400 words observed August 24

Do not rely only on adjacent visual context.

---

# 86. Accessibility — Status

Loading, protection, durability failure, conflict, and success messages use semantic status/alert conventions.

---

# 87. Keyboard Behavior

All workflows must be usable without pointer:

* open form;
* enter value;
* set time;
* submit;
* cancel;
* correct;
* retract;
* confirm/cancel dialog.

---

# 88. Responsive Behavior

Reporting UI must work across desktop and mobile.

Prefer cards/stacked rows over tables.

---

# 89. Mobile Record Form

On narrow screens:

* value field full-width where useful;
* unit context remains adjacent/readable;
* date/time stacks;
* actions stack/wrap;
* helper text wraps;
* no horizontal scrolling.

---

# 90. Mobile History

Each record should stack:

```text
12,400 words
Observed Aug 24, 6:10 AM

Correct Record
Remove Invalid Record
```

Do not depend on wide columns.

---

# 91. Information Density

Default state should remain compact.

Recommended:

```text
Progress Reporting

Target: 50,000 words

Record New Value

Recent records
...
```

Do not display all historical periods expanded if history is long.

If current APIs support only full history, use bounded presentation or disclosure without altering authority.

---

# 92. History Expansion

Audit realistic record counts.

If necessary, first UI may show:

* current period records;
* previous periods collapsed.

Do not introduce pagination unless evidence demands it.

---

# 93. Query Performance

The Goal-scoped read model should avoid:

* one query per observation lineage;
* one definition query per row;
* repeated full-authority scans in React renders.

Prefer one bounded canonical query returning presentation-ready relationship context.

---

# 94. Subscription Strategy

Use existing Observation/Measurement subscriptions.

Selected Goal reporting should update when either relevant authority changes.

No polling.

---

# 95. Stale Async Behavior

If the Goal-scoped history read model is async, protect against stale results when:

* selected Goal changes;
* full clear occurs;
* restore replaces authority;
* Measurement Definition changes;
* observation write completes.

Do not show Goal A records under Goal B.

---

# 96. Draft Invalidation on Goal Change

If selected Goal changes while record/correction form is open:

* discard the draft;
* do not keep a writable form bound to prior Goal.

---

# 97. Draft Invalidation on Measurement Change

If current Measurement changes while a new-record draft is open:

* stale-definition guard must prevent save;
* retain draft long enough to explain conflict;
* require review/reopen against current measurement.

---

# 98. Restore

Backup V6 restore should update history through canonical subscriptions/read model.

Do not restore UI drafts.

---

# 99. Full Clear

Full clear must:

* clear Goal selection according to current behavior;
* close report/correction dialogs/forms;
* clear rendered history;
* prevent stale async history from reappearing.

---

# 100. Backup V6 Boundary

No Backup change.

Observation authority is already included in V6.

Do not add Backup V7.

---

# 101. Dependency Boundary

No new runtime dependency should be necessary.

Stop and justify if one appears necessary.

---

# 102. Bundle Baseline

Task 5.16 main bundle:

```text
685.30 kB
170.00 kB gzip
```

Record Task 5.17 build size.

Do not optimize bundle architecture here.

If main JS approaches roughly 750–800 kB, flag early inspection.

Do not raise Vite's warning threshold.

**Task 5.19 remains mandatory.**

---

# 103. Component Placement

Prefer bounded child components, for example:

```text
GoalSection
    GoalMeasurementSection
    GoalProgressReportingSection
```

Potential subcomponents:

```text
ProgressObservationForm
ProgressObservationHistory
ProgressObservationHistoryItem
```

Use repository conventions.

Do not force abstraction for future non-quantity policies.

---

# 104. Application Boundary

React must consume canonical application/store APIs.

Do not import IndexedDB adapters.

Do not reconstruct observation authority rules in components.

---

# 105. Goal-Scoped Read Model Placement

Place the new read model in the application/state boundary where other query composition belongs.

It may compose:

* Goal;
* Measurement Definition history;
* Progress Observation history.

It must not persist derived UI state.

---

# 106. Read Model Purity

The history read model is derived/read-only.

No new authority.

No new persistence.

No Backup participation.

---

# 107. Read Model Result Shape

Design the smallest stable product-oriented contract.

Conceptually:

```text
GoalProgressObservationHistory {
    goalId

    currentMeasurement:
        supported | inactive | none | unsupported

    periods: [
        {
            definition identity internally
            target
            unit
            current
            records: [...]
        }
    ]

    readiness/protection
}
```

Do not accept this exact shape blindly.

Use actual domain conventions.

---

# 108. Current Head per Lineage

History rows should use the current/effective head according to query semantics.

Do not expose superseded correction revisions as active peer records.

---

# 109. Retracted Lineage Inclusion

The read model should preserve enough data to show retracted logical records if V1 presentation chooses to include them.

---

# 110. Correction Provenance

If a record has multiple revisions, expose a simple derived flag/count if useful:

```text
corrected: true
```

Do not expose a raw revision number merely to show correction occurred.

---

# 111. Tests — Read Model

Add focused coverage for:

* no observations;
* one active record;
* multiple records;
* corrected lineage;
* retracted lineage;
* multiple definition periods;
* stopped current measurement;
* restarted period;
* target change;
* unit change;
* deterministic ordering;
* clone isolation;
* protected authorities.

---

# 112. Tests — Record Workflow

Cover:

1. active measurement exposes Record Current/New Value;
2. never-measured Goal does not;
3. stopped measurement does not;
4. unsupported measurement does not;
5. archived Goal follows read-only policy;
6. value form focuses current value;
7. helper copy states current total semantics;
8. zero is accepted;
9. above-target value is accepted;
10. decreasing new value is accepted;
11. valid observedAt saves;
12. backdated valid observedAt saves;
13. future observedAt follows canonical rejection;
14. stale definition conflict retains draft;
15. same-time conflict is explained;
16. successful save updates history;
17. Goal remains unchanged;
18. Measurement Definition remains unchanged;
19. Preview remains current;
20. Goal Activity remains unchanged where practical.

---

# 113. Tests — Correction Workflow

Cover:

* Correct Record opens prepopulated form;
* correct value;
* correct observedAt within same period if supported;
* crossing definition period rejected;
* no-op;
* stale revision;
* draft retained on conflict;
* successful correction marks current logical record corrected;
* old revision remains authority history.

---

# 114. Tests — Retraction Workflow

Cover:

* confirmation;
* cancel;
* canonical retract;
* row/status updates;
* no hard deletion;
* retracted record cannot be corrected;
* repeated remove not offered;
* focus recovery.

---

# 115. Tests — Cross-Domain Independence

Assert observation writes do not mutate:

* Goal;
* Measurement Definition;
* Setup;
* Schedule;
* Preview stale state;
* Goal Activity authority/input;
* HistoricalPlan;
* ExecutionHistory;
* Profiles.

Use the narrowest reliable tests.

---

# 116. Tests — Clear/Restore

Cover:

* full clear closes forms and removes history;
* restore refreshes Goal history;
* no UI draft restoration;
* old async result cannot reappear after authority replacement if async.

---

# 117. Accessibility Tests

Verify:

* section headings;
* labels/descriptions;
* input errors;
* aria/status roles;
* dialog semantics;
* accessible history action names;
* initial focus;
* validation focus;
* cancel return focus;
* successful write focus;
* retraction focus.

---

# 118. Responsive Tests/Inspection

Confirm:

* no table dependency;
* forms stack;
* history rows stack;
* buttons wrap/stack;
* no horizontal overflow dependency.

Do not claim visual browser inspection unless actually performed.

---

# 119. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.17_PROGRESS_OBSERVATION_REPORTING_V1_UX_AND_GOAL_SCOPED_HISTORY_READ_MODEL_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.16 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Component Placement
7. Application Boundary
8. Goal-Scoped History Read Model
9. Read Model Contract
10. Read Model Ordering
11. Logical Observation Rows
12. Current/Prior Measurement Periods
13. Measurement Context
14. No-Measurement State
15. Stopped-Measurement State
16. Unsupported-Policy State
17. Loading State
18. Protected State
19. Durability Failure
20. Record Current/New Value
21. Record Form
22. Absolute-Value Semantics
23. Unit Context
24. Target Context
25. observedAt Input
26. Backdated Entry
27. Future-Time Behavior
28. Definition Revision Guard
29. Record Save
30. Same-Time Conflict
31. New Record vs Correction
32. Correction Entry
33. Correction Form
34. Correction Value
35. Correction observedAt
36. Correction Save
37. Correction No-Op
38. Observation Revision Conflict
39. Retraction Entry
40. Retraction Confirmation
41. Retraction Save
42. Retracted Record Presentation
43. Record History Presentation
44. observedAt / recordedAt Copy
45. Corrected Status
46. Measurement-Period Presentation
47. Completed Goal Policy
48. Archived Goal Policy
49. Goal Lifecycle Independence
50. Measurement Stop/Restart Independence
51. Target/Unit Change Independence
52. Goal Rename Boundary
53. Goal Activity Boundary
54. ExecutionHistory Boundary
55. HistoricalPlan Boundary
56. Scheduler Boundary
57. Preview Boundary
58. Setup Boundary
59. Profile Boundary
60. Summary Boundary
61. Progress Projection Boundary
62. Accessibility
63. Keyboard Behavior
64. Focus Behavior
65. Responsive Behavior
66. Mobile Behavior
67. Information Density
68. Query Performance
69. Subscription/Stale Handling
70. Restore
71. Full Clear
72. Backup V6 Boundary
73. Bundle Comparison
74. Tests Added/Changed
75. Focused Validation
76. Full Validation
77. Manual Product Walkthrough
78. Governance Updates
79. Deviations
80. Discoveries
81. Deferred Work
82. Observation Workflow Matrix
83. History State Matrix
84. Correction/Retraction Matrix
85. Measurement-Period Matrix
86. Read/Write Matrix
87. Surface Boundary Matrix
88. Accessibility Matrix
89. Epistemic Matrix
90. Product-Boundary Matrix
91. Architectural Invariant Assessment
92. Stop-Condition Assessment
93. Architectural Alignment Assessment
94. Recommended Next Task
95. Final Completion Determination

---

# 120. Required Observation Workflow Matrix

Produce:

| User intent                      | UI action | Authority command | Result |
| -------------------------------- | --------- | ----------------- | ------ |
| record first value               |           |                   |        |
| record later value               |           |                   |        |
| record yesterday's value         |           |                   |        |
| correct wrong value              |           |                   |        |
| correct wrong observed time      |           |                   |        |
| invalidate record                |           |                   |        |
| report value after target change |           |                   |        |
| report while stopped             |           |                   |        |
| report while archived            |           |                   |        |

---

# 121. Required History State Matrix

Produce:

| State                           | Presentation | Actions |
| ------------------------------- | ------------ | ------- |
| no records                      |              |         |
| active record                   |              |         |
| corrected record                |              |         |
| retracted record                |              |         |
| prior measurement-period record |              |         |
| unsupported policy              |              |         |
| protected authority             |              |         |
| durability failure              |              |         |

---

# 122. Required Correction/Retraction Matrix

Produce:

| Record state          | Correct? | Remove? | Why |
| --------------------- | -------: | ------: | --- |
| active current-period |          |         |     |
| active prior-period   |          |         |     |
| corrected active      |          |         |     |
| retracted             |          |         |     |
| stale revision        |          |         |     |

---

# 123. Required Measurement-Period Matrix

Produce:

| Measurement event | Old records | New records | Reporting |
| ----------------- | ----------- | ----------- | --------- |
| initial start     |             |             |           |
| target change     |             |             |           |
| unit change       |             |             |           |
| stop              |             |             |           |
| restart           |             |             |           |

---

# 124. Required Read/Write Matrix

Produce:

| Interaction              | Reads | Writes |
| ------------------------ | ----- | ------ |
| view reporting           |       |        |
| view history             |       |        |
| open record form         |       |        |
| record value             |       |        |
| open correction          |       |        |
| save correction          |       |        |
| open remove confirmation |       |        |
| remove invalid record    |       |        |

---

# 125. Required Surface Boundary Matrix

Produce:

| Surface/system                 | Task 5.17 effect |
| ------------------------------ | ---------------- |
| Planner / Plan                 |                  |
| Goal                           |                  |
| Measurement Definition         |                  |
| Progress Observation           |                  |
| Goal-scoped history read model |                  |
| Progress projection            |                  |
| Goal Activity                  |                  |
| Setup                          |                  |
| Schedule                       |                  |
| Preview                        |                  |
| HistoricalPlan                 |                  |
| ExecutionHistory               |                  |
| Profiles                       |                  |
| Summary                        |                  |
| Backup V6                      |                  |

---

# 126. Required Accessibility Matrix

Produce:

| Interaction | Initial focus | Failure focus | Return focus | Dialog/status semantics |
| ----------- | ------------- | ------------- | ------------ | ----------------------- |
| record      |               |               |              |                         |
| correction  |               |               |              |                         |
| retraction  |               |               |              |                         |
| conflict    |               |               |              |                         |

---

# 127. Required Epistemic Matrix

Produce:

| Evidence/state         | DayFrame may say | Must not say |
| ---------------------- | ---------------- | ------------ |
| no observation         |                  |              |
| explicit zero          |                  |              |
| above target value     |                  |              |
| decreasing value       |                  |              |
| corrected record       |                  |              |
| retracted record       |                  |              |
| prior-period record    |                  |              |
| stopped measurement    |                  |              |
| archived Goal          |                  |              |
| protected observations |                  |              |
| same-time conflict     |                  |              |

---

# 128. Required Product-Boundary Matrix

Produce:

| Capability                      | Task 5.17 |
| ------------------------------- | --------- |
| Goal-scoped observation history |           |
| Record Current/New Value        |           |
| correction                      |           |
| retraction                      |           |
| historical measurement periods  |           |
| measurement config              |           |
| Summary Progress                |           |
| Progress percentage             |           |
| progress bar                    |           |
| Goal Activity conversion        |           |
| Recommendation                  |           |
| pace/trend/forecast             |           |
| bundle architecture             |           |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 129. Architectural Invariants

Assess at minimum:

1. reporting lives in Planner.
2. reporting is Goal-scoped.
3. Observation remains separate authority.
4. Observation does not mutate Goal.
5. Observation does not mutate Measurement Definition.
6. user records measured quantity, not percentage.
7. value is absolute current total.
8. zero is valid.
9. above-target is valid.
10. decreasing values are valid.
11. unit comes from definition.
12. target comes from definition.
13. unit is not editable in observation form.
14. target is not editable in observation form.
15. observedAt is user measurement time.
16. recordedAt is system knowledge time.
17. recordedAt is not user-editable.
18. backdated observations remain supported where valid.
19. future observations follow canonical authority restriction.
20. exact definition revision binding is guarded.
21. stale definition cannot silently rebind.
22. new measurement creates new observation.
23. correction does not create a logically new measurement.
24. correction preserves definition binding.
25. correction preserves immutable history.
26. correction no-op appends nothing.
27. stale observation cannot overwrite.
28. retraction is not hard deletion.
29. retracted evidence remains historical.
30. repeated retraction is not presented as another action.
31. correction after retraction is not offered.
32. same-time conflicts are explicit.
33. history renders logical lineages, not raw revisions.
34. correction status may be shown without revision jargon.
35. retracted status remains visible/understandable.
36. prior measurement periods remain distinct.
37. old records never carry into new periods.
38. target change never retargets records.
39. unit change never converts records.
40. stop preserves records.
41. restart preserves old records and accepts only new-period evidence.
42. never-measured differs from stopped.
43. loading differs from no records.
44. protected differs from no records.
45. durability failure differs from durable save.
46. unsupported policy is not coerced.
47. completed Goal lifecycle remains independent.
48. archived Goal history remains readable.
49. archived Goal new reporting is suppressed per product policy.
50. Goal Activity is unchanged.
51. ExecutionHistory is unchanged.
52. HistoricalPlan is unchanged.
53. scheduler is unchanged.
54. Preview staleness is unchanged.
55. Setup is unchanged.
56. Profiles are unchanged.
57. Summary is unchanged.
58. derived Progress is not rendered.
59. no percentage appears.
60. no Progress bar appears.
61. no Recommendation appears.
62. no pace/on-track/trend/forecast appears.
63. Goal-scoped history read model is derived only.
64. read model is non-persisted.
65. no new authority is introduced.
66. Backup V6 is unchanged.
67. no Backup V7 is introduced.
68. restore rehydrates authority, not drafts.
69. full clear removes stale reporting UI.
70. selected Goal changes discard reporting drafts.
71. stale async history cannot cross Goal selection.
72. canonical decimal validation is reused.
73. native/accessibly labelled controls are used where appropriate.
74. keyboard workflow is complete.
75. focus is deterministic.
76. retraction confirmation is accessible.
77. mobile requires no horizontal table.
78. no new runtime dependency is introduced without justification.
79. bundle warning threshold is not raised.
80. Task 5.18 Summary Progress remains deferred.
81. Task 5.19 bundle architecture remains mandatory.
82. canonical validation passes.

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

# 130. Focused Validation

Run focused suites covering at minimum:

* Goal-scoped observation-history read model;
* Progress Observation authority;
* Goal reporting UI;
* correction/retraction;
* Measurement Definition integration;
* GoalSection/DayFrameApp integration;
* Preview/scheduling independence if needed;
* restore/clear behavior where relevant.

Record exact file/test counts.

---

# 131. Full Validation

Before completion run repository-standard commands.

At minimum where available:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
git diff --check
```

Report exact:

* test-file count;
* test count;
* build module count;
* main bundle size;
* gzip size;
* diff result.

---

# 132. Manual Product Walkthrough

If an interactive browser is available, inspect:

### Desktop

* no-record state;
* record first value;
* record later value;
* backdated value;
* zero;
* above-target;
* decreasing value;
* same-time conflict;
* correction;
* retraction;
* current/prior measurement periods;
* stopped state;
* completed Goal;
* archived Goal.

### Mobile/narrow

* record form;
* date/time;
* history rows;
* correction form;
* retraction dialog;
* long values/helper copy;
* no horizontal overflow.

If not performed, explicitly state that no manual walkthrough is claimed.

---

# 133. Governance

Update:

* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` or create an ADR only if implementation establishes a genuinely new enduring semantic decision beyond the accepted Progress Observation architecture.

Do not add an ADR merely for presentation layout.

---

# 134. Deferred Work

Retain explicitly:

### Task 5.18

Summary Progress V1 Integration and Provenance, including:

* selected Goal Progress presentation;
* quantity-first hierarchy;
* percentage;
* Goal Activity/Progress composition;
* provenance;
* no-definition;
* insufficient evidence;
* known zero;
* > 100%;
* inactive/unsupported/protected states;
* cross-surface navigation.

### Task 5.19

Mandatory Phase 5 bundle architecture/code-splitting/load-performance exit gate.

Also defer:

* historical Progress UI;
* progress bars;
* new policies;
* custom units;
* conversion;
* pace;
* trend;
* forecast;
* recommendations;
* adaptation;
* scores;
* automatic Goal completion.

---

# 135. Recommended Next Task

If Task 5.17 completes cleanly:

> **Task 5.18 — Summary Progress V1 Integration and Provenance**

Do not begin Summary Progress within Task 5.17.

---

# 136. Completion Criteria

Task 5.17 is complete only when:

* selected Goal has a bounded Progress Reporting workflow in Planner;
* Goal-scoped observation history is available through one canonical derived read model;
* history presents logical observation lineages rather than raw revisions;
* current and previous measurement periods are distinguishable;
* active supported measurement exposes Record Current/New Value;
* never-measured/stopped/unsupported/protected/archived states suppress invalid new reporting truthfully;
* user enters absolute current total quantity;
* explicit helper copy distinguishes total from increment;
* zero is valid;
* above-target is valid;
* decreasing values are valid;
* target/unit are visible context but not editable in reporting;
* observedAt is editable user measurement time;
* recordedAt remains system-managed;
* valid backdated observations remain supported;
* invalid future time follows canonical validation;
* create uses exact Measurement Definition revision guard;
* stale definition never silently rebinds evidence;
* same-time conflicts are understandable;
* successful recording writes only Progress Observation authority;
* new measurement and correction are distinct workflows;
* correction prepopulates current effective record;
* correction preserves exact Goal/definition/unit binding;
* correction observedAt changes cannot cross incompatible measurement periods;
* correction no-op follows canonical no-op semantics;
* stale observation revision does not overwrite;
* retraction requires explicit confirmation;
* retraction does not hard-delete evidence;
* retracted records remain historically understandable;
* already retracted records do not expose invalid correction/removal controls;
* current record list updates from canonical authority;
* stopped/restarted/target-changed/unit-changed periods preserve old records without migration/conversion;
* Goal lifecycle remains independent;
* archived Goal history remains readable while new reporting follows the selected read-only V1 policy;
* Goal, Measurement Definition, Goal Activity, HistoricalPlan, ExecutionHistory, Setup, Schedule, Preview, Profiles, and Summary remain semantically unchanged;
* no derived Progress, percentage, Progress bar, Recommendation, pace, trend, forecast, automatic Goal completion, or adaptive behavior is introduced;
* UI drafts are ephemeral;
* Goal changes/full clear/restore cannot leave stale writable drafts;
* stale async history cannot render under the wrong Goal;
* accessibility, keyboard, focus, dialog, error, and status behavior are implemented;
* mobile layout has no horizontal dependency;
* no unnecessary dependency is added;
* Backup V6 remains unchanged;
* focused and canonical validation pass;
* bundle size is recorded against the 685.30 kB Task 5.16 baseline;
* the bundle warning threshold is not raised;
* Task 5.19 remains mandatory;
* governance accurately records reporting/history as user-facing while Summary Progress remains deferred.

---

# 137. Final Implementation Principle

> **A Progress record should mean exactly one thing to the user: “this was the measured state I recorded at this time.” New measurements, corrections, and invalidations must remain different actions because they mean different things historically.**

---

# 138. Final Completion Statement

**Task 5.17 is complete when DayFrame gives the selected Planner Goal a bounded Progress Reporting workflow backed solely by the canonical Progress Observation authority; when the user can record an absolute current quantity, record another later measurement, enter valid historical observed times, correct an existing record without rewriting its history, and remove invalid evidence through canonical retraction rather than deletion; when one Goal-scoped derived history model presents logical observation records across current and prior Measurement Definition periods without exposing raw authority revisions as product concepts; when exact Goal, definition-revision, unit, observed-time, recorded-time, revision-conflict, same-time-conflict, correction, and retraction semantics remain intact; when never-measured, stopped, unsupported, protected, durability-failed, archived, no-record, corrected, retracted, current-period, and prior-period states remain visibly distinct; when target and unit provide reporting context but cannot be edited through the observation form; when zero, above-target, decreasing, backdated, and corrected values remain truthful evidence rather than judgments; when Goal, Measurement Definition, Goal Activity, HistoricalPlan, ExecutionHistory, Setup, scheduling, Preview, Profiles, Summary, Backup V6, and derived Progress remain outside the write boundary; when no percentage, Progress bar, pace, trend, forecast, Recommendation, automatic Goal completion, or adaptive behavior is introduced; when accessibility, keyboard, focus, mobile, restore, clear, stale-request, durability, and conflict behavior are mechanically covered; when canonical validation is green and bundle growth is recorded against the 685.30 kB Task 5.16 baseline without weakening the mandatory Task 5.19 bundle exit gate; and when Task 5.18 remains the first task authorized to make derived Progress visible in Summary.**
