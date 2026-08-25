# Task 6.11 — Phase 6 Cross-Surface Manual QA, Accessibility/Mobile Remediation, and Publication Checkpoint

## Status

Ready for implementation and manual validation.

## Phase

Phase 6 — Product-Surface Convergence

## Task Type

Final production-browser verification, cross-surface manual QA, keyboard/focus accessibility audit, mobile/responsive validation, transition-day visual verification, lazy-loading validation, bounded defect remediation, bundle-preserving cleanup, publication checkpoint creation, governance synchronization, and Phase 6 closure determination.

**This is a verification-and-close task. Do not add new product capability unless a concrete defect discovered during QA requires a bounded fix.**

---

# 1. Objective

Validate the implemented Phase 6 product as a real user would experience it, fix only concrete defects discovered during that validation, and determine whether Phase 6 is ready to close.

Task 6.11 must verify the three-surface model:

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

The goal is not to make the product “perfect.”

The goal is to prove that the implemented architecture and workflows are coherent, accessible, usable on mobile, truthful across variable-duration user-days, stable across lazy-loading boundaries, and ready for a publication checkpoint.

---

# 2. Governing Verification Principle

> **Test the product that actually ships, not just the component tree.**

Use the production application where practical.

Do not treat DOM tests alone as sufficient evidence for:

* focus behavior;
* browser layout;
* responsive behavior;
* lazy-loading transitions;
* keyboard usability;
* transition-day visualization;
* scroll/focus restoration;
* real interaction density.

---

# 3. Governing Remediation Principle

> **Fix only defects that are directly observed or mechanically reproduced during Task 6.11.**

Do not expand this task into:

* redesign;
* new features;
* architecture cleanup by preference;
* speculative UX improvement;
* future Monthly Planner work;
* future Daily Workspace work.

Every production change must map to a documented observed defect.

---

# 4. Governing Phase 6 Closure Principle

Phase 6 may close only if:

* no P0 architecture blocker exists;
* no P1 product-coherence blocker remains;
* discovered accessibility/mobile defects are fixed or explicitly classified as non-blocking;
* canonical cross-surface journeys are coherent;
* production build and bundle guards remain green;
* governance accurately reflects implemented behavior;
* the publication checkpoint is created.

---

# 5. Task 6.10 Prerequisite

Treat Task 6.10 as governing:

* Review Schedule Commitment navigation uses exact template + recurrence incarnation;
* stale/recreated sources never retarget;
* same-incarnation edits remain addressable;
* ordinary recurrence authoring is complete for supported types;
* unsupported recurrence is preserved but not falsely offered;
* duplicate raw Add/Delete Block Template writers are removed;
* Planning Range / Include in Schedule / Commitment terminology is cleaned;
* Save Setup remains the durable shared scheduling boundary;
* Plan authoring remains lazy;
* bundle guards remain unchanged.

Do not reopen these decisions unless a real browser defect proves the implementation contradicts them.

---

# 6. Explicit Scope

Validate and remediate where necessary:

* top-level Planner / Today / Summary navigation;
* Planner Plan / Review Schedule navigation;
* Goal authoring;
* Commitment inventory;
* Add Commitment;
* Edit Commitment;
* Remove Commitment;
* recurrence authoring;
* unsupported recurrence preservation;
* Work configuration;
* selected-day Event workflow;
* Review Schedule generation;
* stale schedule behavior;
* selected-day filtering;
* variable-duration user-day visualization;
* unplaced plan attention;
* Needs attention;
* Resolution options;
* Try;
* Apply Planning Change;
* contextual Edit Commitment;
* contextual Edit Event;
* contextual Work navigation;
* stale/recreated target rejection;
* Today chronology;
* Today outcome reporting;
* correction;
* retraction;
* Summary Goal/progress flow;
* profile load;
* restore;
* full clear;
* protected/unavailable states;
* keyboard navigation;
* focus;
* screen-reader-relevant semantics where inspectable;
* mobile/narrow widths;
* lazy-loading boundaries;
* production bundle;
* publication checkpoint;
* governance.

---

# 7. Explicit Non-Goals

Do not implement:

* Recommendations;
* Capacity;
* Planned Allocation;
* Pattern Library;
* transition sleep planning;
* Goal reorientation;
* drag/drop;
* direct schedule manipulation;
* new scheduler behavior;
* new recurrence semantics;
* new Commitment authority;
* new Event authority;
* Today planning writes;
* Summary writes;
* new top-level surfaces;
* broad visual redesign;
* new runtime dependency;
* bundle-threshold increases.

---

# 8. Execution Artifact Rules

Before QA:

1. verify this Task 6.11 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Task 6.9 result;
   * Task 6.10 result;
   * Phase 6 checkpoint;
   * `CURRENT_STATE.md`;
   * `ROADMAP.md`;
   * relevant ADRs;
   * current production build scripts;
   * bundle guard;
5. create:

`docs/implementation/phase-6/TASK_6.11_PHASE_6_CROSS_SURFACE_MANUAL_QA_ACCESSIBILITY_MOBILE_REMEDIATION_AND_PUBLICATION_CHECKPOINT_RESULT.md`

Do not modify immutable task artifacts.

---

# 9. Validation Environment Audit

Record:

* OS;
* browser(s);
* browser version(s);
* viewport sizes;
* device emulation if used;
* production or dev build;
* accessibility tooling if used;
* keyboard-only testing method;
* network throttling if used for lazy-loading inspection.

If real browser automation is unavailable, use manual browser access.

If no browser is available at all, stop and report that Task 6.11 cannot satisfy its purpose.

---

# 10. Required Browser Mode

Prefer validating a production build:

```bash
npm run build
```

then serve the built output through the project's existing preview/serve mechanism.

Do not validate only against test-rendered DOM if a browser is available.

Record the exact command used.

---

# 11. Canonical Journey A — Flexible Commitment

Perform end to end:

```text
Planner
    Add Commitment
    configure recurrence
    Add to Plan
    Save Setup
    Review Schedule
    Refresh Schedule
    inspect placement
    Today
    report outcome
    Summary
    inspect historical progress/evidence
```

Verify:

* user can discover Add Commitment;
* recurrence form is understandable;
* draft vs Save Setup distinction is clear;
* stale schedule state appears correctly;
* Refresh Schedule is explicit;
* Review Schedule uses product terminology;
* Today is clearly distinct;
* Summary is clearly distinct.

Record any ambiguity.

---

# 12. Canonical Journey B — Event

Perform:

```text
Planner / Review Schedule
    select user-day
    Add Event
    create timed Event
    create all-day Event
    edit Event
    remove Event
```

Verify:

* selected day is preserved;
* Event is clearly distinct from Commitment;
* Event creation uses one workflow;
* return path is coherent;
* all-day meaning is visually truthful;
* no midnight-to-midnight assumption leaks into transition days.

---

# 13. Canonical Journey C — Friction

Perform:

```text
Review Schedule
    encounter Needs attention
    inspect participants
    Edit authored source
    return
    Try Resolution
    cancel/revert if supported
    Apply Planning Change
    inspect recomputed schedule
```

Verify:

* authored edit and Resolution option feel distinct;
* Try is visibly non-final if that is its semantics;
* Apply Planning Change does not look like whole-plan acceptance;
* no Recommendation language appears;
* focus does not become lost after the friction item disappears/recomputes.

---

# 14. Canonical Journey D — Shift Worker

Perform a representative shift-transition flow.

Use a fixture with differing user-day boundaries, such as:

```text
03:00 → 06:00
```

and where practical the reverse:

```text
06:00 → 03:00
```

Verify:

* Work configuration is understandable;
* transition user-day appears longer/shorter as expected;
* Review Schedule timeline scales correctly;
* selected-day Event uses correct canonical day;
* Today resolves the correct current user-day;
* no 24-hour assumption is visible;
* no adaptation recommendation is implied.

---

# 15. Canonical Journey E — Stale Exact Commitment

Manually reproduce the Task 6.10 identity defect fixture:

```text
create Commitment A
generate schedule

remove A
save

recreate same logical source as B
save

return to old stale Review Schedule
invoke Edit Commitment from A occurrence
```

Required behavior:

* B does not open;
* user receives truthful unavailable/changed message;
* focus lands in a stable location;
* refreshing schedule removes the stale old target naturally.

This journey is mandatory.

---

# 16. Canonical Journey F — Recurrence Authoring

Manually test:

* daily;
* weekly;
* specific weekdays;
* times per user-week;
* existing unsupported advanced recurrence.

Verify:

* specific weekday selection is clear;
* count validation is clear;
* invalid submission is blocked;
* focus goes to invalid control;
* changing recurrence type clears only incompatible fields;
* summary copy is understandable;
* unsupported recurrence is preserved without looking fully supported.

---

# 17. Top-Level Navigation QA

Test:

* Planner;
* Today;
* Summary.

Verify:

* active state;
* keyboard access;
* Tab order;
* focus after switching;
* lazy-loading fallback;
* no duplicate heading confusion;
* browser back/forward behavior if applicable.

---

# 18. Planner Subnavigation QA

Test:

* Plan;
* Review Schedule.

Verify:

* selected state;
* keyboard access;
* focus preservation;
* no stale hidden editor state reappears unexpectedly;
* return from contextual editing is coherent.

---

# 19. Planner Plan QA

Inspect:

* Goals;
* Commitments;
* Schedule Preferences;
* Planning Range;
* Work;
* Advanced Commitment Fields;
* Save Setup.

Assess:

* hierarchy;
* wording;
* density;
* discoverability;
* advanced escape hatch clarity.

Do not redesign unless a specific usability defect is observed.

---

# 20. Commitment Inventory QA

Verify:

* cards/rows are readable;
* Edit actions are target-specific;
* recurrence summaries are understandable;
* enabled/disabled state is clear;
* Remove action is not overly prominent;
* no raw Block Template terminology remains in common workflow.

---

# 21. Add Commitment QA

Verify:

* entry point is obvious;
* opening focus is correct;
* fields have visible labels;
* validation messages are near the relevant field;
* keyboard-only completion is possible;
* mobile layout does not horizontally overflow.

---

# 22. Edit Commitment QA

Verify:

* exact source opens;
* same-incarnation rename works;
* unrelated recurrence fields remain preserved;
* cancel preserves draft;
* Update Commitment returns focus appropriately.

---

# 23. Remove Commitment QA

Verify:

* confirmation behavior;
* contextual accessible name;
* focus after removal;
* Goal link behavior remains truthful;
* stale schedule behavior remains canonical after Save Setup.

---

# 24. Recurrence Accessibility QA

For `specificWeekdays`:

* Tab through each option;
* toggle with keyboard;
* confirm visible selected state;
* confirm no color-only meaning;
* verify wrapping at narrow width.

For `timesPerUserWeek`:

* keyboard numeric entry;
* invalid value;
* error association;
* focus on invalid submit;
* valid round-trip.

---

# 25. Work QA

Inspect:

* Work Hours;
* Work Schedule;
* cycles;
* any remaining Segment terminology;
* overrides.

Determine whether the advanced terminology is:

* understandable enough;
* materially confusing.

Only fix copy/layout if a concrete browser usability problem is observed.

Do not redesign Work semantics.

---

# 26. Event QA

Verify:

* Add Event contextual entry;
* Edit Event;
* removal;
* timed/all-day distinction;
* selected-day preservation;
* exact identity;
* recreated Event does not retarget;
* mobile form layout.

---

# 27. Planning Range QA

Verify **Planning Range** language is visible and understandable.

Ensure:

* it does not look like a calendar-month restriction;
* range controls work;
* arbitrary horizons remain supported.

---

# 28. Save Setup QA

Assess whether **Save Setup** remains understandable in the converged Plan experience.

Do not rename unless a concrete ambiguity is observed during QA.

If users can reasonably understand that this saves the authored planning setup, preserve it.

---

# 29. Generate/Refresh Schedule QA

Verify:

* no-schedule state;
* Generate Schedule;
* fresh state;
* stale state;
* Refresh Schedule;
* previous schedule remains visible when stale;
* no auto-regeneration.

---

# 30. Review Schedule Calendar QA

Verify:

* selected day is visually clear;
* keyboard selection works;
* changing date updates selected-day schedule;
* Event contextual actions use the same selected day;
* range edges behave correctly.

---

# 31. Variable-Duration Day QA

Inspect at least:

* ordinary day;
* longer boundary-transition day;
* shorter boundary-transition day.

Verify:

* timeline height/scale;
* labels;
* clipping;
* event placement;
* work placement;
* no 24-hour text assumption.

If DST fixture is feasible in the current environment, inspect one DST case too.

---

# 32. Unplaced QA

Verify:

* clearly separated from scheduled items;
* Edit Commitment appears only when exact current source exists;
* stale/recreated target is unavailable;
* copy does not imply Capacity or failure.

---

# 33. Needs Attention QA

Verify:

* semantic heading;
* participant labels;
* conflict timing;
* Resolution option controls;
* contextual authored Edit;
* no color-only conflict meaning;
* no Recommendation wording.

---

# 34. Try QA

Verify actual product behavior matches documented semantics.

Record:

* what changes visually;
* whether original state remains recoverable;
* whether focus remains on a sensible control;
* whether Try feels final or temporary.

If copy misrepresents the actual behavior, fix the copy only.

---

# 35. Apply Planning Change QA

Verify:

* action is understandable;
* only the bounded change is applied;
* schedule recomputes;
* friction state updates;
* focus does not disappear unpredictably;
* no whole-plan acceptance implication.

---

# 36. Today Surface QA

Verify:

* canonical user-day heading/window;
* All day;
* Current;
* Next;
* Later;
* Earlier;
* timing unavailable;
* plan attention;
* Refresh;
* loading;
* known empty;
* missing plan;
* protected plan;
* protected execution.

---

# 37. Today Temporal Copy QA

Search visible copy for unsupported terms such as:

* underway;
* in progress;
* missed;
* failed;
* automatically completed.

No temporal classification may imply execution.

---

# 38. Today Outcome Reporting QA

Manually test:

* Record Outcome;
* Completed;
* Partial;
* Skipped;
* Change Outcome;
* Remove Report.

Verify:

* exact item changes;
* duplicate click is prevented;
* successful write becomes visible;
* focus returns to the same item/action area;
* error handling is usable if reproducible.

---

# 39. Today Cutoff QA

Verify:

* Refresh advances evaluation;
* passive changes do not unexpectedly advance Today;
* successful outcome write appears according to the accepted cutoff rule.

Do not alter cutoff semantics.

---

# 40. Summary Surface QA

Inspect actual Summary structure.

Verify:

* Goal selection;
* progress/evidence sections;
* historical coverage states;
* loading;
* protected/unavailable states;
* terminology.

Assess whether the surface reads as historical interpretation rather than planning configuration.

---

# 41. Summary Accessibility QA

Verify:

* keyboard navigation;
* selected Goal state;
* headings;
* textual progress/evidence;
* any graphical information has textual equivalent;
* protected/loading messaging is clear.

---

# 42. Cross-Surface Goal Journey QA

Trace one Goal:

```text
Planner
    create/edit Goal
    link Commitment

Review Schedule
    inspect linked Commitment geometry

Today
    report occurrence outcome

Summary
    inspect historical Goal evidence/progress
```

Verify:

* each surface has a distinct responsibility;
* Goal ownership is not duplicated;
* current vs historical terminology remains coherent.

---

# 43. Profile Load QA

With an editor or selected target open:

* load another profile.

Verify:

* stale Commitment editor closes/revalidates;
* current setup changes;
* Goal authority remains independent;
* Review Schedule behavior matches canonical profile semantics;
* no stale contextual target survives.

---

# 44. Restore QA

Perform representative restore if practical.

Verify:

* authored setup replacement;
* Goal state;
* Event state;
* stale local editors;
* Today;
* Summary;
* no ghost contextual target.

---

# 45. Full Clear QA

Verify:

* Planner clears;
* Commitment editor closes;
* Event editor closes;
* Review selection does not reference removed state;
* Today clears/re-derives;
* Summary selection clears;
* no stale focus target.

---

# 46. Protection/Error QA

Where fixtures/test controls permit, inspect:

* protected authored setup;
* protected Goal authority;
* protected HistoricalPlan;
* protected ExecutionHistory;
* unavailable storage.

Verify:

* protected never appears as empty;
* writes are unavailable;
* recovery copy is visible;
* focus/keyboard remains usable.

---

# 47. Keyboard-Only Pass

Perform a full keyboard-only pass through:

```text
Planner
    Plan
    Add Commitment
    recurrence
    Save Setup
    Review Schedule
    select day
    Add Event
    Needs attention
    contextual Edit
    Resolution option

Today
    Record Outcome
    Change Outcome
    Remove Report

Summary
    Goal selection
```

Record any point requiring mouse/pointer.

Any essential pointer-only workflow is a blocker.

---

# 48. Focus Audit

Verify focus after:

* top-level navigation;
* Planner subnavigation;
* lazy Plan authoring load;
* Add Commitment;
* invalid recurrence submit;
* Edit Commitment;
* stale-target failure;
* Remove Commitment;
* Add/Edit Event;
* Generate Schedule;
* Refresh Schedule;
* Try;
* Apply Planning Change;
* Today report;
* Today correction;
* Today retraction;
* profile load;
* restore;
* full clear.

Fix only clear focus-loss defects.

---

# 49. Screen Reader Semantics Audit

If screen reader tooling is available, sample:

* primary nav;
* Planner headings;
* Commitment form;
* recurrence controls;
* calendar;
* Needs attention;
* Today outcome controls;
* Summary Goal selection.

If unavailable, inspect accessible names/roles through browser accessibility tree.

Record which method was used.

---

# 50. Mobile Viewports

At minimum inspect representative narrow widths such as:

```text
320px
375px
390px
430px
```

Use actual browser/device emulation.

Do not rely only on CSS inspection.

---

# 51. Mobile Planner QA

Inspect:

* top nav;
* Plan/Review nav;
* Goal cards;
* Commitment cards;
* recurrence controls;
* Work controls;
* Event editor;
* Save Setup;
* Planning Range.

Verify no horizontal page scroll caused by core UI.

---

# 52. Mobile Review Schedule QA

Inspect:

* calendar;
* selected day;
* timeline;
* unplaced;
* Needs attention;
* participant actions;
* Resolution options.

Controls should stack naturally.

---

# 53. Mobile Today QA

Inspect:

* chronology sections;
* all-day items;
* outcome controls;
* correction/retraction;
* loading/error states.

---

# 54. Mobile Summary QA

Inspect:

* Goal selection;
* progress/evidence;
* long labels;
* protection states.

---

# 55. Desktop QA

Inspect one typical desktop width.

Assess:

* excessive blank space;
* overly wide forms;
* card density;
* action placement;
* disconnected visual hierarchy.

Only fix if usability is materially affected.

---

# 56. Lazy Plan Authoring QA

Using network/devtools if available:

1. load app;
2. verify Plan authoring chunk is not loaded prematurely if architecture intends it lazy;
3. trigger Add/Edit Commitment;
4. verify chunk loads;
5. verify loading fallback;
6. verify target revalidation;
7. verify focus after load.

Do not change architecture merely because devtools chunk names differ.

---

# 57. Today Lazy QA

Verify Today lazy-loads on intent and that its loading state is truthful.

---

# 58. Summary Lazy QA

Verify Summary lazy-loads on intent.

---

# 59. Slow-Network QA

If practical, throttle network and inspect:

* Plan authoring load;
* Today load/query;
* Summary load.

Verify:

* no false empty state;
* no duplicate spinner confusion severe enough to block use;
* focus does not jump unexpectedly.

---

# 60. Bundle Baseline

Task 6.10 baseline:

```text
Initial raw        648,577
Initial gzip       164,327
Plan authoring      51,445
Today query          4,890
Today UI            11,282
Summary             30,100
Largest lazy        51,445
Total JS           746,295
```

Budgets:

```text
Initial raw   <= 685,000
Initial gzip  <= 170,000
Largest lazy  <= 100,000
Total JS      <= 750,000
```

Only approximately **3,705 raw bytes** of total-JS headroom remain.

---

# 61. Bundle Remediation Rule

Task 6.11 must not consume meaningful bundle headroom casually.

Any bounded defect fix should prefer:

* existing components;
* CSS;
* copy changes;
* small logic changes;
* deletion/reuse.

No new runtime dependency.

No threshold inflation.

If a necessary accessibility fix would exceed total-JS guard, stop and report rather than weakening the guard.

---

# 62. Permanent Bundle Remediation Assessment

This task must explicitly assess the end-of-Phase-6 permanent bundle plan.

Determine whether:

### A. Current architecture is sufficient

Phase 6 can close with the existing lazy boundaries and fixed guard.

### B. A bounded post-QA bundle remediation is still required before publication

Only if evidence shows the current total-JS constraint is structurally unhealthy for the next phase.

Do not raise thresholds.

Do not perform broad optimization without evidence.

---

# 63. Defect Severity Model

Classify every discovered QA defect:

### P0 — Architecture blocker

Phase 6 cannot close.

### P1 — Product/accessibility blocker

Must fix before Phase 6 closes.

### P2 — Bounded quality issue

Fix if small and directly evidenced; otherwise explicitly defer.

### P3 — Future enhancement

Not required for Phase 6.

### P4 — Cosmetic

No action required.

---

# 64. Defect Log

Maintain a defect log during QA:

| ID | Journey/surface | Defect | Severity | Reproducible? | Fix in 6.11? | Result |
| -- | --------------- | ------ | -------- | ------------: | -----------: | ------ |

Every production change in Task 6.11 must correspond to one defect ID.

---

# 65. Remediation Constraints

For each P0–P2 defect considered for fixing:

* identify root cause;
* make the smallest correct fix;
* add regression coverage where mechanically possible;
* rerun the affected journey;
* rerun focused tests.

Do not bundle unrelated cleanup.

---

# 66. Terminology Final Pass

Inspect user-facing production text for:

* Preview;
* Block Template;
* Suggested Fix;
* Friction Point;
* ManualCalendarEvent;
* unsupported Segment wording;
* confusing Save/Apply/Refresh distinctions.

Only change text that is demonstrably confusing or inconsistent with current product model.

Internal code names remain out of scope.

---

# 67. Accessibility Final Pass

Phase 6 cannot close if an essential workflow is:

* pointer-only;
* inaccessible by keyboard;
* missing a usable accessible name;
* losing focus into nowhere;
* relying only on color for meaning;
* presenting protected state as empty.

These are blocking defects.

---

# 68. Mobile Final Pass

Phase 6 cannot close if a core workflow:

* requires horizontal scrolling to reach controls;
* hides essential actions off-screen;
* renders an unusable form;
* makes Review Schedule or Today effectively unreadable.

Minor spacing issues are not blockers.

---

# 69. Transition-Day Final Pass

Verify the canonical piecewise user-day model is visibly coherent.

A transition day should look unusual only because it truthfully is unusual.

Do not “normalize” a 21-hour or 27-hour day for aesthetic uniformity.

---

# 70. Validation After Each Fix

After any production change:

* run focused relevant tests;
* reproduce the browser defect;
* confirm the fix manually.

Do not wait until the very end to discover regressions.

---

# 71. Required Full Validation

At completion run:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Record exact:

* test file count;
* test count;
* transformed modules;
* initial raw;
* initial gzip;
* Plan authoring chunk;
* Today query;
* Today UI;
* Summary;
* largest lazy;
* total JS;
* diff result.

---

# 72. Required Manual QA Evidence

The result artifact must explicitly state which journeys were completed in a real browser:

* Journey A — Flexible Commitment;
* Journey B — Event;
* Journey C — Friction;
* Journey D — Shift Worker;
* Journey E — Stale Exact Commitment;
* Journey F — Recurrence Authoring.

For each classify:

* Passed;
* Passed after bounded remediation;
* Blocked;
* Not completed.

Task 6.11 cannot claim completion with any required journey marked Not completed.

---

# 73. Required Browser/Viewport Matrix

Produce:

| Browser/device | Version | Viewport | Journeys exercised | Result |
| -------------- | ------- | -------- | ------------------ | ------ |

---

# 74. Required Keyboard Matrix

Produce:

| Workflow        | Keyboard-only complete? | Focus correct? | Defect ID |
| --------------- | ----------------------: | -------------: | --------- |
| top-level nav   |                         |                |           |
| Planner Plan    |                         |                |           |
| Add Commitment  |                         |                |           |
| recurrence      |                         |                |           |
| Review Schedule |                         |                |           |
| Add/Edit Event  |                         |                |           |
| friction        |                         |                |           |
| Today reporting |                         |                |           |
| Summary         |                         |                |           |

---

# 75. Required Focus Matrix

Produce:

| Action                      | Expected focus                 | Observed | Remediated? |
| --------------------------- | ------------------------------ | -------- | ----------: |
| open Add Commitment         | first logical control          |          |             |
| recurrence validation error | invalid control                |          |             |
| contextual Edit Commitment  | exact editor                   |          |             |
| stale target failure        | stable Planner message/heading |          |             |
| Remove Commitment           | adjacent/section target        |          |             |
| Add/Edit Event              | editor/return target           |          |             |
| Refresh Schedule            | result/status                  |          |             |
| Apply Planning Change       | relevant stable region         |          |             |
| Today report                | same occurrence action region  |          |             |
| retraction                  | Record Outcome                 |          |             |

---

# 76. Required Mobile Matrix

| Surface         | 320 | 375 | 390 | 430 | Blocking issue? |
| --------------- | --- | --- | --- | --- | --------------: |
| Planner Plan    |     |     |     |     |                 |
| Review Schedule |     |     |     |     |                 |
| Event editor    |     |     |     |     |                 |
| Today           |     |     |     |     |                 |
| Summary         |     |     |     |     |                 |

Use tested widths; if exact widths differ, record actual values.

---

# 77. Required Transition-Day Matrix

| Case               | Canonical duration | Review display | Event all-day | Today ownership | Result |
| ------------------ | -----------------: | -------------- | ------------- | --------------- | ------ |
| stable boundary    |                    |                |               |                 |        |
| 03:00 → 06:00      |                    |                |               |                 |        |
| 06:00 → 03:00      |                    |                |               |                 |        |
| DST case if tested |                    |                |               |                 |        |

---

# 78. Required Lazy-Loading Matrix

| Workflow                    | Expected lazy boundary | Observed | Focus/load UX | Result |
| --------------------------- | ---------------------- | -------- | ------------- | ------ |
| Plan authoring              | lazy                   |          |               |        |
| Edit Commitment from Review | lazy authoring         |          |               |        |
| Today                       | lazy                   |          |               |        |
| Today query                 | lazy/query             |          |               |        |
| Summary                     | lazy                   |          |               |        |

---

# 79. Required Defect Matrix

| ID | Description | Severity | Root cause | Fix | Tests | Browser retest |
| -- | ----------- | -------- | ---------- | --- | ----- | -------------- |

Include every defect fixed in Task 6.11.

---

# 80. Required Bundle Matrix

| Metric         | 6.10 baseline | 6.11 final | Delta |           Budget | Status |
| -------------- | ------------: | ---------: | ----: | ---------------: | ------ |
| Initial raw    |       648,577 |            |       |          685,000 |        |
| Initial gzip   |       164,327 |            |       |          170,000 |        |
| Plan authoring |        51,445 |            |       | 100,000 lazy max |        |
| Today query    |         4,890 |            |       |                  |        |
| Today UI       |        11,282 |            |       |                  |        |
| Summary        |        30,100 |            |       |                  |        |
| Largest lazy   |        51,445 |            |       |          100,000 |        |
| Total JS       |       746,295 |            |       |          750,000 |        |

---

# 81. Required Surface-Closure Matrix

| Surface | Core responsibility                      | Manual QA passed? | Blocking defect? | Ready to close? |
| ------- | ---------------------------------------- | ----------------: | ---------------: | --------------: |
| Planner | authored intent + plan review/resolution |                   |                  |                 |
| Today   | current plan + execution reporting       |                   |                  |                 |
| Summary | historical evidence/progress             |                   |                  |                 |

---

# 82. Required Phase 6 Feature-Boundary Matrix

| Capability                   | Phase 6 final status |
| ---------------------------- | -------------------- |
| Planner authored intent      |                      |
| Commitment authoring         |                      |
| Event contextual workflow    |                      |
| Work configuration           |                      |
| Review Schedule              |                      |
| friction resolution          |                      |
| Today chronology             |                      |
| Today outcome reporting      |                      |
| Summary historical progress  |                      |
| Recommendations              | Deferred             |
| Capacity                     | Deferred             |
| Planned Allocation           | Deferred             |
| transition adaptation        | Deferred             |
| Pattern Library              | Deferred             |
| direct schedule manipulation | Deferred             |

---

# 83. Required Future-Readiness Matrix

| Future capability         | Ready to build on Phase 6? | Known prerequisite |
| ------------------------- | -------------------------: | ------------------ |
| richer Monthly Planner    |                            |                    |
| richer Daily Workspace    |                            |                    |
| shift-transition planning |                            |                    |
| Capacity                  |                            |                    |
| Planned Allocation        |                            |                    |
| Recommendations           |                            |                    |
| Pattern Library           |                            |                    |
| Goal reorientation        |                            |                    |

---

# 84. Required Architectural Invariant Assessment

Assess at minimum:

1. Planner remains sole authored planning surface.
2. Review Schedule remains derived plan review.
3. Today remains current-plan execution surface.
4. Summary remains historical interpretation.
5. Commitment remains a product projection.
6. no generic Commitment authority exists.
7. Event authority remains singular.
8. Work remains composite shift/cycle configuration.
9. one SetupDraft remains.
10. Save Setup remains canonical persistence.
11. Preview remains derived.
12. HistoricalPlan remains immutable history.
13. ExecutionHistory remains outcome evidence.
14. Goal authority remains independent.
15. Goal links remain exact.
16. PlanDecision remains bounded remediation.
17. exact incarnation governs contextual editing.
18. stale recreated sources do not retarget.
19. title/time matching remains absent.
20. variable user-day remains canonical.
21. long/short transition days remain truthful.
22. all-day remains user-day-wide.
23. user-week semantics remain canonical.
24. month remains presentation/navigation only.
25. recurrence authoring remains truthful.
26. unsupported recurrence remains preserved.
27. ordinary Commitment writer remains singular.
28. advanced writer duplication remains removed.
29. Preview terminology remains removed from common workflow.
30. no execution data leaks into Planner.
31. no authored write leaks into Summary.
32. Today does not mutate plan.
33. Goal edits do not stale schedule.
34. Today reports do not stale schedule.
35. Event mutation semantics remain canonical.
36. stale schedule remains visible.
37. explicit Refresh remains required.
38. Try semantics remain canonical.
39. Apply Planning Change remains bounded.
40. Resolution options remain distinct from Recommendations.
41. no Goal ranking is introduced.
42. no transition adaptation is introduced.
43. no Capacity is introduced.
44. no Planned Allocation is introduced.
45. no Pattern Library is introduced.
46. no drag/drop/direct placement is introduced.
47. profile replacement invalidates stale targets.
48. restore invalidates stale targets.
49. full clear removes stale targets.
50. protected state never appears empty.
51. keyboard navigation covers essential workflows.
52. focus behavior is deterministic enough for production use.
53. no essential workflow is pointer-only.
54. mobile supports essential workflows.
55. variable-day visualizations are usable on mobile.
56. Plan authoring remains lazy.
57. Today remains lazy.
58. Summary remains lazy.
59. authority bootstrap remains eager.
60. recovery remains reachable.
61. no lazy boundary duplicates authority.
62. bundle guard remains unchanged.
63. initial raw remains green.
64. initial gzip remains green.
65. largest lazy remains green.
66. total JS remains green.
67. no threshold inflation occurs.
68. no new runtime dependency is added.
69. every 6.11 production change maps to a recorded defect.
70. no speculative cleanup is introduced.
71. all required browser journeys are completed.
72. all blocking QA defects are resolved.
73. full canonical validation passes.
74. governance reflects final production state.
75. publication checkpoint is created.
76. Phase 6 closure decision is explicit.

Classify each as:

* Confirmed;
* Preserved;
* Covered by test;
* Covered by browser QA;
* Remediated;
* Deferred;
* Blocked;
* Not applicable.

---

# 85. Publication Checkpoint

If all closure criteria are satisfied, create a Phase 6 publication checkpoint.

The checkpoint must summarize:

## Product Surface Model

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

## Governing Authorities

Summarize the final authority boundaries without redefining them.

## Major Phase 6 Outcomes

At minimum:

* three primary surfaces;
* canonical variable-duration user-day;
* HistoricalPlan all-day provenance;
* Today read model;
* Today operational reporting;
* Review Schedule convergence;
* Commitment authoring convergence;
* contextual Event/friction convergence;
* exact stale-source navigation;
* complete bounded recurrence authoring;
* lazy Plan architecture;
* final browser/accessibility/mobile validation.

## Deferred Capabilities

Explicitly list:

* Capacity;
* Planned Allocation;
* Recommendations;
* Pattern Library;
* transition adaptation;
* Goal reorientation;
* direct manipulation.

## Bundle Baseline

Record final guarded metrics.

## Known Non-Blocking Debt

List only real remaining known debt.

---

# 86. Governance Updates

If Phase 6 closes, update:

* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

If the methodology maintains a publication/release checkpoint file, create/update it.

Do not mark Phase 6 complete if a blocking defect remains.

---

# 87. ADR Determination

No ADR is expected for ordinary QA fixes.

Create/supersede an ADR only if a defect forces a genuinely new enduring architectural decision.

If no new decision is required, record:

> No ADR required.

---

# 88. Permanent Bundle Remediation Decision

At Task 6.11 completion, make one explicit determination:

### A. No further bundle task required before Phase 6 close

Use if current lazy architecture is healthy and all guards remain green.

### B. One bounded bundle-remediation task required before publication

Use only if QA/build evidence shows Phase 7 would begin from an unsustainably constrained architecture.

If B is chosen, Phase 6 does not close until that task finishes.

Do not raise thresholds.

---

# 89. Phase 6 Closure Decision

End with exactly one:

## Outcome A — Phase 6 Complete

Use only if:

* all required browser journeys pass;
* no P0/P1 defect remains;
* accessibility/mobile blockers are resolved;
* bundle guards pass;
* publication checkpoint is created;
* governance is current.

State:

> **Phase 6 is complete and publication-ready.**

## Outcome B — Bounded Final Remediation Required

List exact defect IDs and the smallest follow-up task required.

Do not begin Phase 7.

## Outcome C — Architecture Blocker Discovered

Name the exact new prerequisite.

Do not hide it behind QA language.

---

# 90. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.11_PHASE_6_CROSS_SURFACE_MANUAL_QA_ACCESSIBILITY_MOBILE_REMEDIATION_AND_PUBLICATION_CHECKPOINT_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.10 Prerequisite Confirmation
4. Validation Environment
5. Browser/Device Coverage
6. Production-Build Validation Method
7. Journey A — Flexible Commitment
8. Journey B — Event
9. Journey C — Friction
10. Journey D — Shift Worker
11. Journey E — Stale Exact Commitment
12. Journey F — Recurrence Authoring
13. Top-Level Navigation
14. Planner Subnavigation
15. Planner Plan
16. Commitment Inventory
17. Add Commitment
18. Edit Commitment
19. Remove Commitment
20. Recurrence Accessibility
21. Work
22. Event
23. Planning Range
24. Save Setup
25. Generate/Refresh Schedule
26. Review Calendar
27. Variable-Duration Days
28. Unplaced
29. Needs Attention
30. Try
31. Apply Planning Change
32. Today Surface
33. Today Temporal Copy
34. Today Outcome Reporting
35. Today Cutoff
36. Summary Surface
37. Summary Accessibility
38. Cross-Surface Goal Journey
39. Profile Load
40. Restore
41. Full Clear
42. Protection/Error
43. Keyboard-Only Pass
44. Focus Audit
45. Accessibility-Tree/Screen-Reader Audit
46. Mobile Planner
47. Mobile Review Schedule
48. Mobile Today
49. Mobile Summary
50. Desktop
51. Lazy Plan Authoring
52. Today Lazy Loading
53. Summary Lazy Loading
54. Slow-Network Behavior
55. Defects Found
56. Defects Fixed
57. Defects Deferred
58. Terminology Final Pass
59. Accessibility Final Pass
60. Mobile Final Pass
61. Transition-Day Final Pass
62. Bundle Assessment
63. Permanent Bundle Remediation Decision
64. Tests Added/Changed
65. Focused Validation
66. Full Validation
67. Bundle Validation
68. Governance Updates
69. ADR Determination
70. Publication Checkpoint
71. Known Non-Blocking Debt
72. Future Readiness
73. Browser/Viewport Matrix
74. Keyboard Matrix
75. Focus Matrix
76. Mobile Matrix
77. Transition-Day Matrix
78. Lazy-Loading Matrix
79. Defect Matrix
80. Bundle Matrix
81. Surface-Closure Matrix
82. Phase 6 Feature-Boundary Matrix
83. Future-Readiness Matrix
84. Architectural Invariant Assessment
85. Stop-Condition Assessment
86. Architectural Alignment Assessment
87. Phase 6 Closure Decision
88. Recommended Next Phase/Task
89. Final Completion Determination

---

# 91. Stop Conditions

Stop and report rather than claim completion if:

* no real browser environment is available;
* a required journey cannot be completed;
* an essential workflow is pointer-only;
* focus loss prevents keyboard completion;
* a core mobile workflow is unusable;
* a transition day renders with incorrect temporal geometry;
* stale Commitment navigation retargets a recreated source;
* recurrence authoring produces invalid canonical state;
* protected authority appears as empty;
* lazy loading duplicates or loses authoritative state;
* a P0/P1 defect cannot be fixed within bounded Task 6.11 scope;
* bundle guard cannot remain green;
* fixing a defect requires a new architecture decision.

Do not waive a stop condition to close the phase.

---

# 92. Recommended Next Step

If Outcome A:

> Create the Phase 6 publication checkpoint, mark Phase 6 complete, and begin Phase 7 planning from the converged Planner / Today / Summary foundation.

Do not predefine Phase 7 implementation work in Task 6.11.

If Outcome B or C:

state the exact prerequisite task instead.

---

# 93. Final Implementation Principle

> **Phase 6 closes when DayFrame's primary surfaces are not only architecturally correct, but demonstrably usable as a real product.**

Tests prove invariants.

The browser proves interaction.

The publication checkpoint records the truth.

---

# 94. Final Completion Statement

**Task 6.11 is complete when the actual DayFrame production application has been exercised through the canonical Flexible Commitment, Event, Friction, Shift Worker, stale exact-Commitment, and recurrence-authoring journeys in a real browser; when Planner, Today, and Summary each demonstrate their intended responsibilities without authority leakage; when exact source-incarnation navigation, recurrence completeness, Event identity, stale schedule visibility, explicit Refresh behavior, friction remediation, Today outcome reporting, Summary historical interpretation, variable-duration user-day geometry, profile replacement, restore, full clear, protected-state handling, and lazy-loading boundaries are visibly confirmed; when essential workflows are keyboard-complete, focus behavior is deterministic enough for production use, accessible names/semantic structure are correct, mobile layouts preserve all essential controls without horizontal dependency, and long/short transition days remain truthful rather than visually normalized; when every production change made during this task corresponds to a documented reproducible QA defect and no speculative feature or redesign is added; when all P0/P1 defects discovered during browser QA are resolved or an explicit bounded blocker task is created; when the permanent bundle assessment is completed, fixed bundle guards remain green without threshold inflation or a new runtime dependency, and any remaining total-JS constraint is explicitly dispositioned; when focused and full canonical validation pass; when governance and the Phase 6 publication checkpoint accurately record the final product surface model, authority boundaries, bundle baseline, deferred capabilities, and known non-blocking debt; and when the task ends with an explicit evidence-based decision that Phase 6 is complete and publication-ready or that one precisely bounded final remediation remains before closure.**
