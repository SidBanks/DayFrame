# Task 6.9 — Phase 6 Surface-Convergence Gap Audit

## Status

Ready for audit.

## Phase

Phase 6 — Product-Surface Convergence

## Task Type

Read-only architecture/product audit of the implemented Planner, Today, and Summary surfaces; remaining information-architecture debt; workflow completeness; Setup residue; terminology consistency; authority/write-boundary clarity; navigation coherence; selected-day/calendar coherence; loading/chunking architecture; accessibility/mobile maturity; Phase 6 roadmap alignment; and Phase 6 completion readiness.

**This is an audit task. Do not modify production code unless explicitly authorized by a later remediation task.**

---

# 1. Objective

Determine whether Phase 6 has achieved its intended product-surface convergence and, if not, identify the exact remaining gaps.

The target product model is:

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

The audit must answer:

1. Does each surface now have a coherent user-facing responsibility?
2. Are writes located on the correct surface?
3. Are internal implementation concepts still leaking into the product?
4. Are there important workflows that still require users to understand DayFrame's old Setup/Preview architecture?
5. Is Planner sufficiently converged around Goals, Commitments, Events, Work, Schedule Preferences, and Review Schedule?
6. Is Today sufficiently operational for the current user-day?
7. Is Summary sufficiently coherent as the historical/progress surface?
8. Are cross-surface navigation and contextual handoffs adequate?
9. Are there accessibility, mobile, loading, or performance gaps material enough to block Phase 6 completion?
10. Should Phase 6 end now, require one or more bounded remediation tasks, or reveal a prerequisite architecture audit?

Do not assume additional implementation is necessary.

---

# 2. Governing Audit Principle

> **Audit the product that now exists, not the product we remember intending to build.**

Use production code, tests, current governance, and implemented task results as evidence.

Do not infer completion from roadmap prose alone.

Do not declare a gap merely because a future capability could be useful.

A gap exists only when:

* Phase 6 explicitly intended the capability;
* the current product architecture requires it for coherence;
* an implemented workflow is materially incomplete or misleading;
* or a documented architectural/product boundary remains unresolved.

---

# 3. Governing Phase 6 Mental Model

Treat the current intended mental model as:

```text
Planner
    Plan
        Goals
        Commitments
        Events in context
        Work
        Schedule Preferences

    Review Schedule
        generated plan
        selected user-day
        plan attention
        Needs attention
        Resolution options
        contextual authored editing

Today
    canonical current user-day
    published plan
    All day
    Current
    Next
    Later
    Earlier
    execution reporting

Summary
    Goals
    historical evidence
    progress
    interpretation
```

The audit must determine how closely the implementation matches this model and whether any mismatch is:

* intentional;
* harmless transitional residue;
* material UX debt;
* architectural debt;
* Phase 7+ future work.

---

# 4. Governing Authority Principle

The audit must preserve the existing authority boundaries.

Do not recommend convergence that would collapse distinct truths merely for UI uniformity.

At minimum preserve:

* authored scheduling setup;
* Goals;
* manual Events;
* PlanDecision;
* Preview;
* HistoricalPlan;
* ExecutionHistory;
* Measurement Definitions;
* Progress Observations;
* Goal Activity / Progress projections;
* profile authority boundaries;
* Backup/restore boundaries.

The audit may identify presentation/workflow gaps around these authorities.

It must not assume they should be merged.

---

# 5. Governing Surface Principle

Use the following responsibility test.

## Planner

Planner should own:

* authored planning intent;
* Goal authoring;
* Commitment authoring;
* Work configuration;
* Schedule Preferences;
* contextual Event authoring;
* generated schedule review;
* schedule friction;
* bounded planning remediation.

Planner should not own:

* execution outcome reporting;
* historical progress interpretation;
* generalized Recommendations.

## Today

Today should own:

* current canonical user-day;
* current published plan;
* current/next/later/earlier chronology;
* explicit execution outcome reporting.

Today should not own:

* generic Commitment authoring;
* schedule generation;
* friction resolution;
* historical progress analysis.

## Summary

Summary should own:

* historical evidence;
* Goal progress interpretation;
* derived status/progress context.

Summary should not own:

* authored planning writes;
* schedule mutation;
* execution reporting.

Use current implementation evidence to test these boundaries.

---

# 6. Explicit Audit Scope

Audit:

* top-level surface navigation;
* Planner subnavigation;
* Planner Plan information architecture;
* remaining Setup presentation;
* Commitment authoring;
* Work configuration;
* Event workflows;
* Schedule Preferences;
* Goal placement in Planner;
* Measurement placement in Planner;
* Review Schedule;
* generation/Refresh behavior;
* stale-schedule behavior;
* selected-user-day behavior;
* Review Schedule contextual editing;
* plan attention;
* friction/Resolution options;
* Today information architecture;
* Today execution reporting;
* Today Refresh/evaluation semantics;
* Summary information architecture;
* Summary Goal/progress presentation;
* cross-surface terminology;
* cross-surface contextual navigation;
* empty/loading/protected/error states;
* profile/restore/full-clear UX;
* accessibility;
* focus;
* keyboard behavior;
* mobile/responsive behavior;
* lazy-loading architecture;
* bundle state;
* remaining legacy terminology;
* governance/roadmap alignment;
* Phase 6 completion criteria.

---

# 7. Explicit Non-Goals

Do not implement or design in detail:

* Recommendations;
* Capacity;
* Planned Allocation;
* automatic Goal reprioritization;
* shift-transition adaptation;
* sleep-transition planning;
* drag/drop;
* direct schedule manipulation;
* new scheduler algorithms;
* new recurrence semantics;
* new Commitment authority;
* new Event authority;
* Pattern Library authority;
* new historical authority;
* Phase 7 implementation;
* Monthly Planner expansion beyond the current implemented architecture;
* Daily Workspace expansion beyond current Today responsibilities.

Future capabilities may be classified as **future work**, but they are not Phase 6 gaps unless Phase 6 explicitly requires them.

---

# 8. Evidence Rules

For every material finding:

* cite file paths;
* cite symbols/functions/components;
* cite line ranges where practical;
* cite tests when claiming deterministic behavior;
* distinguish:

  * **Confirmed**
  * **Inferred**
  * **Not found**
* distinguish:

  * product gap;
  * architecture gap;
  * implementation gap;
  * terminology debt;
  * future feature;
  * intentionally deferred capability.

Do not infer behavior from names/comments alone.

---

# 9. Initial Governance Audit

Before reviewing UI code, read:

* current Phase 6 roadmap;
* current Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* relevant ADRs from Tasks 6.3A–6.5;
* Task 6.1 audit;
* Task 6.2 result;
* Tasks 6.3 / 6.3A / 6.3B / 6.3C;
* Tasks 6.4–6.8 results.

Construct a concise list of Phase 6's originally intended outcomes.

Then compare implementation against those outcomes.

Do not allow later task language to silently redefine the Phase objective.

---

# 10. Phase 6 Intent Reconstruction

Produce a **Phase 6 Intent Matrix** with at least:

| Intended capability                  | Evidence source | Implemented? | Current surface | Remaining gap? |
| ------------------------------------ | --------------- | -----------: | --------------- | -------------- |
| three primary surfaces               |                 |              |                 |                |
| Planner authored intent              |                 |              |                 |                |
| Review Schedule                      |                 |              |                 |                |
| contextual Event workflow            |                 |              |                 |                |
| contextual Commitment editing        |                 |              |                 |                |
| friction resolution                  |                 |              |                 |                |
| canonical Today                      |                 |              |                 |                |
| execution reporting                  |                 |              |                 |                |
| Summary historical interpretation    |                 |              |                 |                |
| responsive/accessibility convergence |                 |              |                 |                |
| loading architecture                 |                 |              |                 |                |

Use actual roadmap/governance evidence.

---

# 11. Top-Level Surface Audit

Audit current top-level application navigation.

Confirm:

* Planner exists;
* Today exists;
* Summary exists;
* default surface;
* lazy/eager boundaries;
* selected state;
* keyboard semantics;
* loading fallback;
* surface restoration behavior.

Determine whether any old primary destination still competes with the intended model.

Examples to audit:

* Setup;
* Schedule;
* Preview;
* Pattern Library;
* separate Goals destination;
* separate History destination.

A legacy component name in code is not itself a product gap.

A legacy top-level user-facing destination may be.

---

# 12. Planner Information Architecture Audit

Map the complete current Planner structure.

Produce an actual tree such as:

```text
Planner
    Plan
        ...
    Review Schedule
        ...
```

Do not use intended structure unless code confirms it.

For every visible section classify:

* authored intent;
* supporting configuration;
* generated review;
* contextual workflow;
* transitional legacy;
* advanced/escape hatch.

---

# 13. Remaining Setup Audit

Task 6.7 reduced Setup but did not necessarily retire it.

Determine exactly what remains product-facing as Setup.

For every remaining Setup subsection answer:

1. What canonical source does it edit?
2. Does a converged product workflow already exist elsewhere?
3. Would removing this subsection lose capability?
4. Is it redundant?
5. Is it only advanced configuration?
6. Is its terminology implementation-oriented?
7. Does its continued visibility materially undermine the Planner mental model?

Classify each as:

* keep as-is;
* rename only;
* reorganize;
* duplicate workflow;
* transitional escape hatch;
* removable;
* requires separate architecture decision.

Do not implement removal.

---

# 14. Commitment Workflow Audit

Review Task 6.7 implementation mechanically.

Confirm:

* Commitment inventory;
* Add Commitment;
* Edit Commitment;
* removal/disable;
* recurrence presentation;
* Sleep handling;
* exact identity;
* Goal-link compatibility;
* draft/save boundary;
* stale-schedule behavior;
* lazy loading;
* mobile/accessibility.

Determine whether ordinary users still need to enter raw Setup sections to perform common Commitment workflows.

If yes, identify exactly which workflows.

---

# 15. Work Workflow Audit

Determine whether Work now feels like a coherent Planner concept.

Audit:

* Work Hours;
* Work Schedule;
* shift definitions;
* cycle setup;
* segment terminology;
* boundary/week-start overrides;
* contextual Review → Work navigation.

Determine whether Work configuration is:

* product-coherent;
* still engine-centric but usable;
* materially fragmented;
* blocked on future redesign.

Do not treat unavoidable complexity as a gap merely because Work is more complex than a normal Commitment.

---

# 16. Event Workflow Audit

Review Task 6.8 implementation.

Confirm:

* selected-day Add Event;
* Edit Event;
* remove Event;
* one canonical Event writer;
* all-day/timed semantics;
* selected-day context;
* return path;
* exact incarnation behavior;
* Review Schedule contextual entry;
* mobile/accessibility.

Determine whether Event authoring is discoverable enough within Planner without creating a duplicate general Event destination.

---

# 17. Schedule Preferences Audit

Determine whether users can understand and modify:

* day boundary;
* week start;
* relevant overrides;
* preview/planning range;
* other temporal preferences.

Audit terminology.

Specifically identify remaining engine language such as:

* Segment;
* shift definition;
* preview range;
* user-day boundary;

and determine whether each is:

* already translated;
* acceptable advanced terminology;
* confusing product debt;
* future redesign.

---

# 18. Goal Placement Audit

Confirm Planner is the sole Goal-authoring surface.

Audit:

* Goal list;
* create/edit;
* lifecycle;
* commitment links;
* unavailable relationships;
* protection/loading states.

Determine whether Goals feel integrated into Planner or bolted on as a separate subsystem.

Do not propose automatic scheduling influence.

---

# 19. Measurement Placement Audit

Audit current Measurement Definition workflow.

Determine:

* where it appears;
* how it relates visually to Goals;
* whether its product meaning is understandable;
* whether it belongs in Planner under current Phase 6 architecture;
* whether advanced measurement controls overwhelm normal planning.

Classify any issue as:

* Phase 6 blocker;
* bounded cleanup;
* future Summary/Goal refinement.

Do not redesign measurement semantics.

---

# 20. Planner Save Model Audit

Assess whether the current persistence model is understandable to the user.

Audit:

```text
local Add/Edit form
    ↓
SetupDraft
    ↓
Save Setup
    ↓
schedule stale
    ↓
Refresh Schedule
```

Determine whether product copy clearly distinguishes:

* local form completion;
* unsaved Planner draft;
* durable Save Setup;
* stale generated schedule;
* Refresh Schedule.

Identify any misleading save terminology.

---

# 21. Review Schedule Audit

Audit current Review Schedule as a whole.

Confirm:

* generation action;
* no-schedule state;
* fresh state;
* stale state;
* arbitrary range;
* calendar/date selection;
* variable-duration user-day;
* scheduled items;
* unplaced;
* friction;
* Resolution options;
* Try;
* Apply Planning Change;
* contextual Event/Commitment/Work navigation.

Determine whether any old Preview machinery remains materially visible.

---

# 22. Preview Terminology Audit

Search user-facing production copy for:

* Preview;
* Generate Preview;
* stale Preview;
* friction point;
* suggested fix;
* block template;
* recurrence object;
* shift definition ID;
* manual calendar event.

For each occurrence classify:

* internal only;
* test-only;
* acceptable advanced UI;
* user-facing terminology debt;
* material product-model conflict.

Do not recommend broad code renaming solely for terminology.

---

# 23. Plan Attention Audit

Determine what unresolved generated-plan states Review Schedule can expose today.

At minimum verify:

* unplaced;
* friction;
* omitted if available;
* blocked if available.

Do not infer missing categories from HistoricalPlan.

Determine whether the current distinction is sufficient for Phase 6.

---

# 24. Friction Workflow Audit

Confirm:

* detector evidence;
* Needs attention product treatment;
* participant provenance;
* contextual authored edit;
* Resolution options;
* Try;
* Apply Planning Change;
* PlanDecision behavior;
* no Goal ranking;
* no Recommendation wording.

Determine whether friction handling now feels like one coherent Planner workflow.

---

# 25. Today Information Architecture Audit

Map current Today UI exactly.

Audit:

* heading;
* canonical date/window;
* evaluation timestamp;
* Refresh;
* All day;
* Current;
* Next;
* Later;
* Earlier;
* timing unavailable;
* plan attention;
* outcome state;
* Record Outcome;
* Change Outcome;
* Remove Report;
* loading;
* missing plan;
* known empty;
* HistoricalPlan protection;
* ExecutionHistory protection.

Determine whether Today already satisfies the intended Daily Workspace V1 role for Phase 6.

Do not compare it against future full Daily Workspace aspirations unless those were Phase 6 requirements.

---

# 26. Today Temporal Truth Audit

Confirm the UI does not reintroduce:

* 24-hour assumptions;
* civil-midnight ownership;
* execution inference from temporal position.

Audit copy for:

* underway;
* in progress;
* missed;
* failed;
* automatically completed.

Any such copy is a material epistemic gap.

---

# 27. Today Reporting Audit

Confirm:

* Completed;
* Partial;
* Skipped;
* correction;
* retraction;
* exact occurrence identity;
* user-write cutoff advancement;
* passive same-cutoff behavior;
* protection;
* race safety;
* no plan mutation.

Determine whether reporting interaction is discoverable and appropriately bounded.

---

# 28. Today ↔ Planner Boundary Audit

Determine whether Today needs any Planner navigation to be coherent in Phase 6.

Examples to evaluate:

* Open Planner when plan unavailable;
* contextual edit of today's Commitment;
* current-day friction handoff;
* rescheduling handoff.

Do not assume these are required.

Classify each potential handoff:

* required Phase 6 gap;
* useful future enhancement;
* explicitly deferred;
* architecturally inappropriate.

---

# 29. Summary Information Architecture Audit

Map current Summary UI mechanically.

Identify:

* top-level sections;
* Goal selection;
* Goal Activity;
* Progress;
* Measurement/Observation context;
* historical coverage states;
* legacy/unavailable evidence;
* publication cutoff behavior;
* navigation affordances.

Determine whether Summary's structure matches its intended role.

---

# 30. Summary Product-Language Audit

Search for implementation/domain language that may leak into user-facing Summary UI.

Potential examples:

* Goal Activity;
* Measurement Definition;
* Observation;
* coverage unavailable;
* provenance;
* legacy.

Some may be appropriate.

Classify each by user comprehensibility and architectural truthfulness.

---

# 31. Summary Write-Boundary Audit

Confirm Summary remains read-only where Phase 6 requires.

Identify any authoring control accidentally duplicated there.

Do not count navigation as a write.

---

# 32. Summary ↔ Planner Boundary Audit

Determine whether historical insight needs contextual navigation back to Planner for Phase 6 coherence.

Potential examples:

* open Goal;
* inspect linked Commitment;
* modify Measurement Definition.

Do not assume these are required.

Classify as Phase 6 gap vs future enhancement.

---

# 33. Cross-Surface Goal Audit

Trace one Goal through:

```text
Planner
    author Goal
    link Commitment

Today
    current plan/execution

Summary
    historical Goal context/progress
```

Determine whether the user can understand that these are views of related but different truths.

Identify any contradictory terminology or duplicated ownership.

---

# 34. Cross-Surface Identity Audit

Verify contextual links across Planner/Today/Summary, where present, preserve exact identity.

Search for any title/time-based navigation.

Any user-facing cross-surface mutation/navigation by title/time should be treated as a material architecture gap.

---

# 35. Cross-Surface Date Semantics Audit

Confirm all three surfaces use compatible canonical user-day/date semantics where relevant.

Audit:

* Planner selected day;
* Event day;
* Review Schedule day;
* Today current day;
* Summary historical day/cutoff.

Do not require identical UI treatment.

Require semantic consistency.

---

# 36. User-Week Audit

Confirm no surface defines user-week as:

* 168 elapsed hours;
* seven fixed 24-hour intervals.

Audit any visible weekly labels, recurrence summaries, Summary grouping, and Work cycle logic.

Determine whether week semantics need further Phase 6 remediation.

---

# 37. Month Semantics Audit

Audit any month/calendar behavior currently visible.

Determine whether month is merely:

* navigation;
* presentation grouping;

or has accidentally become a planning-authority boundary.

Flag only real semantic problems.

---

# 38. Navigation Coherence Audit

Audit all navigation levels:

```text
top level:
    Planner
    Today
    Summary

Planner:
    Plan
    Review Schedule

contextual:
    Add/Edit Commitment
    Add/Edit Event
    Edit Work
    return to Review
```

Assess:

* discoverability;
* selected state;
* return path;
* preservation of useful context;
* focus behavior;
* whether users can become stranded in internal workflows.

---

# 39. Context Preservation Audit

Review:

* selected user-day;
* Commitment target;
* Event target;
* Work target;
* Summary selected Goal;
* Today cutoff/result;
* return focus.

Determine whether ephemeral state behaves predictably across:

* navigation;
* lazy loading;
* profile load;
* restore;
* full clear.

---

# 40. Empty-State Audit

Inventory all major empty states.

At minimum:

### Planner

* no Goals;
* no Commitments;
* no schedule;
* no friction;
* no Event on selected day where applicable.

### Today

* known empty plan;
* missing publication;
* no current item;
* no outcome reports.

### Summary

* no Goals;
* no historical evidence;
* legacy/unavailable coverage;
* protected authority.

Check whether empty copy:

* explains what is known;
* distinguishes unknown from empty;
* offers appropriate navigation when useful;
* avoids unsupported inference.

---

# 41. Loading-State Audit

Inventory lazy/query loading for:

* Plan authoring;
* Review Schedule if applicable;
* Today surface;
* Today query;
* Summary.

Determine whether:

* loading states are truthful;
* duplicate nested loading is confusing;
* lazy loading steals focus;
* failed lazy loads have a recoverable path.

---

# 42. Protection/Error Audit

Audit:

* Active/setup protection;
* Goals protection;
* HistoricalPlan protection;
* ExecutionHistory protection;
* Summary authority protection;
* persistence unavailable/degraded states.

Determine whether any protected state is incorrectly presented as empty.

Any such case is a Phase 6 blocker.

---

# 43. Profile Audit

Trace profile load across:

* Planner authored setup;
* Commitment inventory;
* Work;
* Events;
* Goals;
* Review Schedule;
* Today;
* Summary.

Confirm profile ownership boundaries remain understandable.

Identify stale UI that survives profile replacement incorrectly.

---

# 44. Backup/Restore Audit

Trace restore behavior across the three surfaces.

Determine whether:

* derived state reconstitutes correctly;
* stale local editors close;
* selected targets revalidate;
* Today re-derives;
* Summary reads restored authorities;
* no derived surface is itself restored as an authority.

---

# 45. Full-Clear Audit

Confirm full clear leaves:

* no stale editors;
* no stale Review Schedule selection where inappropriate;
* no stale Today result;
* no stale Summary selection;
* no ghost Goal/Commitment/Event targets.

---

# 46. Accessibility Audit — Top-Level

Audit:

* semantic main regions;
* one primary heading per surface;
* nav current state;
* keyboard navigation;
* lazy-surface focus behavior;
* loading/error announcement.

---

# 47. Accessibility Audit — Planner

Audit:

* Plan / Review Schedule selected state;
* Goal controls;
* Commitment inventory;
* Add/Edit forms;
* Work disclosures;
* Event forms;
* calendar/day selection;
* stale status;
* Needs attention;
* Resolution options;
* contextual Edit actions;
* focus return.

---

# 48. Accessibility Audit — Today

Audit:

* section headings;
* outcome controls;
* outcome status;
* Refresh;
* write-in-flight;
* errors;
* focus after report/correction/retraction;
* target-specific accessible naming.

---

# 49. Accessibility Audit — Summary

Audit:

* Goal selection;
* progress/evidence sections;
* disclosures;
* charts if any;
* textual equivalents;
* loading/protection messaging;
* keyboard navigation.

---

# 50. Responsive/Mobile Audit

Audit all three surfaces at narrow width.

Focus on:

* primary navigation;
* Planner subnavigation;
* Commitment cards;
* Work configuration;
* selected-day calendar;
* Review Schedule;
* friction controls;
* Event editor;
* Today chronology;
* outcome controls;
* Summary progress/evidence.

Classify issues:

* cosmetic;
* usability debt;
* accessibility blocker;
* Phase 6 blocker.

---

# 51. Desktop Coherence Audit

Audit:

* information density;
* vertical hierarchy;
* unnecessary repeated cards;
* overly wide forms;
* disconnected side panels;
* DOM order vs visual order;
* contextual action placement.

Do not redesign merely for aesthetics.

---

# 52. Terminology Consistency Audit

Build a cross-surface terminology inventory.

At minimum inspect:

* Plan;
* Planner;
* Review Schedule;
* Schedule;
* Preview;
* Commitment;
* Event;
* Work;
* Goal;
* Measurement;
* Progress;
* Current;
* Next;
* Later;
* Earlier;
* Needs attention;
* Resolution option;
* Apply Planning Change;
* Save Setup;
* Schedule Preferences;
* Segment;
* Pattern.

For each classify:

* canonical product term;
* advanced but acceptable;
* inconsistent;
* implementation leak;
* future term not yet justified.

---

# 53. Save/Apply/Refresh Terminology Audit

Specifically compare all product actions involving state transitions:

```text
Add to Plan
Update Commitment
Save Setup
Generate Schedule
Refresh Schedule
Save Event
Record Outcome
Change Outcome
Remove Report
Try
Apply Planning Change
Refresh Today
```

Determine whether users can reasonably understand which actions:

* mutate local draft;
* persist authored state;
* regenerate derived plan;
* write execution evidence;
* merely refresh a read cutoff.

Identify ambiguous action wording.

---

# 54. Planner Setup-Debt Matrix

Produce:

| Remaining Setup element | Canonical purpose | Alternative workflow exists? | User-facing debt | Phase 6 action |
| ----------------------- | ----------------- | ---------------------------: | ---------------- | -------------- |
| discovered elements     |                   |                              |                  |                |

Phase 6 action must be one of:

* none;
* terminology cleanup;
* layout cleanup;
* bounded remediation task;
* future redesign;
* architecture audit.

---

# 55. Cross-Surface Workflow Matrix

Produce:

| User intent                   | Correct surface    | Current path | Coherent? | Gap? |
| ----------------------------- | ------------------ | ------------ | --------: | ---- |
| create Goal                   | Planner            |              |           |      |
| add Commitment                | Planner            |              |           |      |
| edit Commitment from schedule | Planner contextual |              |           |      |
| add Event to selected day     | Planner            |              |           |      |
| configure Work                | Planner            |              |           |      |
| generate schedule             | Planner            |              |           |      |
| inspect conflict              | Planner Review     |              |           |      |
| resolve bounded conflict      | Planner Review     |              |           |      |
| see current plan              | Today              |              |           |      |
| report outcome                | Today              |              |           |      |
| inspect Goal progress         | Summary            |              |           |      |

---

# 56. Authority/Surface Matrix

Produce:

| Authority / derived model | Planner | Today | Summary | Correct? |
| ------------------------- | ------- | ----- | ------- | -------: |
| Active setup              |         |       |         |          |
| Goal                      |         |       |         |          |
| manual Event              |         |       |         |          |
| Preview                   |         |       |         |          |
| PlanDecision              |         |       |         |          |
| HistoricalPlan            |         |       |         |          |
| ExecutionHistory          |         |       |         |          |
| Measurement               |         |       |         |          |
| Observation               |         |       |         |          |
| Goal Activity             |         |       |         |          |
| Progress                  |         |       |         |          |

Specify read/write roles.

---

# 57. Surface Responsibility Matrix

Produce:

| Capability             | Planner | Today  | Summary |
| ---------------------- | ------- | ------ | ------- |
| authored intent        |         |        |         |
| generated-plan review  |         |        |         |
| friction resolution    |         |        |         |
| current published plan |         |        |         |
| execution reporting    |         |        |         |
| historical evidence    |         |        |         |
| Goal progress          |         |        |         |
| Recommendations        | future  | future | future  |

---

# 58. Product-Language Debt Matrix

Produce:

| User-facing term | Location | Problem | Severity | Recommended disposition |
| ---------------- | -------- | ------- | -------- | ----------------------- |

Only include genuine user-facing debt.

---

# 59. Navigation Gap Matrix

Produce:

| Origin          | Target            | Existing handoff | Needed for Phase 6? | Gap |
| --------------- | ----------------- | ---------------- | ------------------: | --- |
| Review Schedule | Commitment editor |                  |                     |     |
| Review Schedule | Event editor      |                  |                     |     |
| Review Schedule | Work              |                  |                     |     |
| Today           | Planner           |                  |                     |     |
| Summary         | Goal editor       |                  |                     |     |
| Summary         | Planner           |                  |                     |     |

Do not mark optional future convenience as a blocker.

---

# 60. Empty/Protection Matrix

Produce:

| Surface/state          | Empty | Missing | Protected | Storage unavailable | Distinct? |
| ---------------------- | ----- | ------- | --------- | ------------------- | --------: |
| Planner authored state |       |         |           |                     |           |
| Review Schedule        |       |         |           |                     |           |
| Today plan             |       |         |           |                     |           |
| Today execution        |       |         |           |                     |           |
| Summary history        |       |         |           |                     |           |

---

# 61. Loading Architecture Audit

Task 6.8 leaves the architecture approximately:

```text
Eager
    application shell
    authority bootstrap
    recovery
    Planner / Review shell
    Event contextual panel

Lazy
    Plan authoring
    Today
    Today query
    Summary
```

Verify actual build/code behavior.

Do not rely on task-report claims alone.

---

# 62. Bundle Audit

Use the Task 6.8 baseline:

```text
Initial raw        648,162
Initial gzip       164,161
Plan authoring      50,645
Today query          4,890
Today UI            11,282
Summary             30,100
Largest lazy        50,645
Total JS           745,080
```

Budgets:

```text
Initial raw   <= 685,000
Initial gzip  <= 170,000
Largest lazy  <= 100,000
Total JS      <= 750,000
```

Audit:

* current exact values;
* shared-module duplication;
* lazy boundary quality;
* remaining total-JS headroom;
* whether Phase 6 cleanup itself risks exceeding the total budget.

Do not raise thresholds.

---

# 63. Bundle Debt Classification

Classify current bundle state as:

* healthy;
* acceptable but constrained;
* remediation advisable before Phase 6 close;
* blocking.

A low remaining total-JS margin alone is not necessarily a blocker if Phase 6 is closing and future phases can begin with deliberate architectural work.

Explain the reasoning.

---

# 64. Runtime Dependency Audit

Confirm no Phase 6 convergence task introduced an unnecessary runtime dependency.

Identify any large existing dependency materially affecting future flexibility.

Do not recommend replacement without evidence.

---

# 65. Test Coverage Audit

Map tests to the three primary surfaces.

Identify major user workflows with weak or absent integration coverage.

At minimum check:

### Planner

* Goal authoring;
* Commitment authoring;
* Work;
* Events;
* generation;
* stale schedule;
* contextual edits;
* friction;
* Apply Planning Change.

### Today

* canonical day;
* current/next/later;
* all-day;
* outcome reporting;
* correction;
* retraction;
* protection;
* races.

### Summary

* Goal selection;
* progress;
* legacy/unavailable evidence;
* historical cutoffs;
* protection.

Classify coverage gaps by severity.

---

# 66. Manual Walkthrough Coverage Audit

Review what previous tasks actually validated manually.

Determine which important user journeys have never received a real browser/product walkthrough.

Do not infer manual validation from DOM tests.

Potential outcome:

> Phase 6 implementation is mechanically complete but requires one bounded manual QA task before publication checkpoint.

That is a legitimate finding.

---

# 67. Canonical End-to-End Journey Audit

Trace these complete journeys:

## Journey A — Flexible Commitment

```text
Planner
    Add Commitment
    Save Setup
    Review Schedule
    Refresh Schedule
    inspect placement
    Today
    report outcome
    Summary
    inspect historical progress
```

## Journey B — Event

```text
Planner Review
    select day
    Add Event
    schedule regeneration according to Event semantics
    inspect Event
    Today
    report outcome if applicable
```

## Journey C — Friction

```text
Planner Review
    Needs attention
    inspect participant
    Edit authored source OR Try Resolution
    Apply Planning Change
    inspect recomputed plan
```

## Journey D — Shift Worker

```text
Planner
    configure Work/cycle
    configure boundaries
    generate schedule across transition
    inspect long/short user-day
    Today on transition day
```

Identify where each journey is coherent, awkward, misleading, or incomplete.

---

# 68. Shift-Transition Readiness Audit

This is not an adaptation implementation task.

Determine only whether current Phase 6 surfaces preserve enough truthful transition context for future work.

Confirm:

* variable user-days;
* Work regime changes;
* transition-day schedule review;
* Today on transition day;
* historical publication;
* no false adaptation claims.

Classify future transition planning as:

* architecturally ready;
* partially ready;
* blocked by known missing policy.

Do not design the recommendation system.

---

# 69. Monthly Planner Readiness Audit

Assess whether current Planner architecture can naturally evolve toward richer month-oriented planning without redefining authority.

Audit:

* arbitrary planning horizon;
* compact calendar;
* selected-user-day review;
* commitment authoring;
* Work cycles;
* Events;
* schedule generation;
* contextual resolution.

Classify Monthly Planner readiness:

* ready;
* mostly ready;
* significant prerequisite gaps.

Do not implement month view.

---

# 70. Daily Workspace Readiness Audit

Assess whether Today can naturally evolve toward richer Daily Workspace capabilities.

Audit:

* canonical day;
* plan chronology;
* execution reporting;
* plan attention;
* stable cutoff semantics;
* current-day contextual information.

Classify readiness:

* ready;
* mostly ready;
* significant prerequisite gaps.

Do not add replanning or recommendations.

---

# 71. Summary Evolution Readiness

Assess whether Summary architecture can naturally absorb future:

* Capacity;
* Allocations;
* Recommendations;
* richer Goal progress.

Do not implement them.

Identify any authority/read-model prerequisite still missing.

---

# 72. Remaining Advanced-Setup Escape Hatch

If an advanced Setup section remains, determine whether it is acceptable for Phase 6 close.

A transitional advanced section is acceptable if:

* common workflows are converged;
* advanced functionality is truthful;
* no duplicate source ownership exists;
* terminology does not materially confuse normal users.

Do not insist on complete component retirement for architectural purity.

---

# 73. Phase 6 UX Completeness Criteria

Define a bounded completion test:

A new user should be able to understand, without knowing DayFrame internals:

1. where to tell DayFrame what matters;
2. where to add something flexible;
3. where to add something fixed;
4. where to configure Work;
5. how to build/refresh a schedule;
6. where to inspect scheduling problems;
7. where to report what actually happened;
8. where to inspect historical progress.

Audit whether current UI meets this standard.

---

# 74. Gap Severity Model

Classify each discovered gap as:

### P0 — Architecture blocker

Phase 6 cannot close.

### P1 — Product coherence blocker

Architecture is sound, but current UX materially violates the intended surface model.

### P2 — Bounded Phase 6 cleanup

Worth fixing before phase close but not structurally blocking.

### P3 — Future enhancement

Not required for Phase 6.

### P4 — Cosmetic / optional

No remediation task required.

Use this model consistently.

---

# 75. Gap Root-Cause Classification

For each P0–P2 gap identify root cause:

* authority;
* identity;
* persistence;
* read model;
* navigation;
* terminology;
* component composition;
* accessibility;
* mobile;
* loading;
* test coverage;
* manual QA;
* governance;
* documentation.

---

# 76. Remediation Slicing Rules

If remediation is required:

* group related gaps by common root cause;
* prefer bounded tasks;
* do not create one giant “cleanup” task;
* do not reopen settled authority decisions unnecessarily;
* distinguish audit-only follow-up from implementation task;
* identify dependencies.

Example:

```text
6.10 — Planner Product-Language and Advanced-Setup Cleanup
6.11 — Phase 6 Manual Cross-Surface QA and Accessibility Remediation
```

Only recommend tasks supported by actual findings.

Do not pre-create them in this audit.

---

# 77. Phase 6 Completion Decision

The audit must end with exactly one of:

### A. Phase 6 implementation complete

No P0/P1 gaps. Remaining P2 items are small enough for publication checkpoint or explicitly optional.

### B. Phase 6 requires bounded remediation

List exact required tasks.

### C. Phase 6 blocked by architecture prerequisite

Name the prerequisite audit/decision.

Do not give an ambiguous “mostly complete” final answer.

---

# 78. Publication Checkpoint Readiness

If Phase 6 is implementation-complete, determine whether a publication checkpoint can be created immediately.

Audit whether current governance should capture:

* surface model;
* authority boundaries;
* loading architecture;
* bundle baseline;
* known deferred work;
* future Monthly Planner/Daily Workspace direction.

---

# 79. ADR Audit

Determine whether any implemented Phase 6 decision lacks a required durable ADR.

Do not create ADRs merely for UI composition.

Look specifically for:

* enduring authority boundaries;
* cutoff semantics;
* temporal semantics;
* loading architecture rules;
* product projections that affect future architecture.

Classify:

* ADR present;
* governance sufficient;
* ADR missing and required.

---

# 80. Documentation Consistency Audit

Compare:

* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* Phase 6 checkpoint;
* ADRs;
* actual code.

Identify overclaims and stale descriptions.

A doc-only mismatch may be P2.

---

# 81. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.9_PHASE_6_SURFACE_CONVERGENCE_GAP_AUDIT_RESULT.md`

Do not modify production files.

Governance files may be updated only to record the audit result if project methodology requires it.

---

# 82. Required Result Structure

Include at least:

1. Executive Result
2. Artifact Integrity
3. Audit Scope
4. Audit Method
5. Files Reviewed
6. Governance Sources Reviewed
7. Phase 6 Intent Reconstruction
8. Current Surface Model
9. Top-Level Navigation
10. Planner Structure
11. Remaining Setup
12. Commitment Workflow
13. Work Workflow
14. Event Workflow
15. Schedule Preferences
16. Goals
17. Measurement Placement
18. Planner Save Model
19. Review Schedule
20. Preview Terminology
21. Plan Attention
22. Friction / Resolution
23. Today Structure
24. Today Temporal Semantics
25. Today Outcome Reporting
26. Today ↔ Planner Boundary
27. Summary Structure
28. Summary Terminology
29. Summary Write Boundary
30. Summary ↔ Planner Boundary
31. Cross-Surface Goal Flow
32. Cross-Surface Identity
33. Cross-Surface Date Semantics
34. User-Week Semantics
35. Month Semantics
36. Navigation Coherence
37. Context Preservation
38. Empty States
39. Loading States
40. Protection/Error States
41. Profile Behavior
42. Backup/Restore Behavior
43. Full Clear
44. Planner Accessibility
45. Today Accessibility
46. Summary Accessibility
47. Mobile/Responsive
48. Desktop Coherence
49. Terminology Consistency
50. Save/Apply/Refresh Terminology
51. Loading Architecture
52. Bundle State
53. Runtime Dependencies
54. Test Coverage
55. Manual Walkthrough Coverage
56. End-to-End Journey A
57. End-to-End Journey B
58. End-to-End Journey C
59. End-to-End Journey D
60. Shift-Transition Readiness
61. Monthly Planner Readiness
62. Daily Workspace Readiness
63. Summary Evolution Readiness
64. Advanced Setup Escape Hatch
65. Phase 6 UX Completeness
66. Discovered Gaps
67. Gap Severity
68. Gap Root Causes
69. Required Remediation
70. Optional Future Enhancements
71. ADR Coverage
72. Documentation Consistency
73. Phase 6 Completion Decision
74. Publication Checkpoint Readiness
75. Recommended Next Step
76. Phase 6 Intent Matrix
77. Planner Setup-Debt Matrix
78. Cross-Surface Workflow Matrix
79. Authority/Surface Matrix
80. Surface Responsibility Matrix
81. Product-Language Debt Matrix
82. Navigation Gap Matrix
83. Empty/Protection Matrix
84. Accessibility Matrix
85. Loading Matrix
86. Bundle Matrix
87. Test-Coverage Matrix
88. Gap Matrix
89. Future-Readiness Matrix
90. Architectural Invariant Assessment
91. Stop-Condition Assessment
92. Final Audit Determination

---

# 83. Required Gap Matrix

Produce:

| Gap | Evidence | Severity | Root cause | Phase 6 blocker? | Recommended disposition |
| --- | -------- | -------- | ---------- | ---------------: | ----------------------- |

Include every P0–P2 gap.

P3/P4 may be summarized separately.

---

# 84. Required Future-Readiness Matrix

| Future capability          | Current readiness | Missing prerequisite | Phase 6 blocker? |
| -------------------------- | ----------------- | -------------------- | ---------------: |
| richer Monthly Planner     |                   |                      |                  |
| richer Daily Workspace     |                   |                      |                  |
| shift-transition planning  |                   |                      |                  |
| Capacity                   |                   |                      |                  |
| Planned Allocation         |                   |                      |                  |
| Recommendations            |                   |                      |                  |
| contextual Pattern Library |                   |                      |                  |
| richer Goal reorientation  |                   |                      |                  |

Do not confuse future prerequisites with current gaps.

---

# 85. Required Accessibility Matrix

| Area            | Keyboard | Focus | Semantic structure | Mobile | Gap severity |
| --------------- | -------- | ----- | ------------------ | ------ | ------------ |
| top-level nav   |          |       |                    |        |              |
| Planner Plan    |          |       |                    |        |              |
| Review Schedule |          |       |                    |        |              |
| Event workflow  |          |       |                    |        |              |
| friction        |          |       |                    |        |              |
| Today           |          |       |                    |        |              |
| Summary         |          |       |                    |        |              |

---

# 86. Required Loading Matrix

| Surface/workflow | Current loading boundary | Appropriate? | Duplicate authority? | Gap |
| ---------------- | ------------------------ | -----------: | -------------------: | --- |
| Planner shell    |                          |              |                      |     |
| Plan authoring   |                          |              |                      |     |
| Review Schedule  |                          |              |                      |     |
| Event editor     |                          |              |                      |     |
| Today            |                          |              |                      |     |
| Today query      |                          |              |                      |     |
| Summary          |                          |              |                      |     |

---

# 87. Required Bundle Matrix

Record current exact build values:

| Metric         | Task 6.8 baseline | Task 6.9 audit validation |           Budget | Status |
| -------------- | ----------------: | ------------------------: | ---------------: | ------ |
| Initial raw    |           648,162 |                           |          685,000 |        |
| Initial gzip   |           164,161 |                           |          170,000 |        |
| Plan authoring |            50,645 |                           | 100,000 lazy max |        |
| Today query    |             4,890 |                           |                  |        |
| Today UI       |            11,282 |                           |                  |        |
| Summary        |            30,100 |                           |                  |        |
| Largest lazy   |            50,645 |                           |          100,000 |        |
| Total JS       |           745,080 |                           |          750,000 |        |

---

# 88. Required Test-Coverage Matrix

| Workflow                   | Unit | Integration | Cross-surface | Manual | Gap |
| -------------------------- | ---: | ----------: | ------------: | -----: | --- |
| Add/Edit Commitment        |      |             |               |        |     |
| Work setup                 |      |             |               |        |     |
| Add/Edit Event             |      |             |               |        |     |
| Generate/Refresh Schedule  |      |             |               |        |     |
| contextual Review edit     |      |             |               |        |     |
| friction resolution        |      |             |               |        |     |
| Today chronology           |      |             |               |        |     |
| Today outcome reporting    |      |             |               |        |     |
| Summary progress           |      |             |               |        |     |
| profile/restore/full-clear |      |             |               |        |     |

---

# 89. Architectural Invariants

Assess at minimum:

1. Planner has one coherent authored-intent responsibility.
2. Planner has one coherent generated-review responsibility.
3. Today has one coherent execution responsibility.
4. Summary has one coherent historical-interpretation responsibility.
5. no surface owns contradictory write semantics.
6. no generic Commitment authority was introduced.
7. no generic Event authority was introduced.
8. Goals remain independent authored authority.
9. Goal links remain Goal-owned.
10. one scheduling SetupDraft remains.
11. manual Event authority remains singular.
12. Work remains canonical shift/cycle configuration.
13. Preview remains derived.
14. HistoricalPlan remains frozen publication/history.
15. ExecutionHistory remains execution evidence.
16. PlanDecision remains bounded remediation authority.
17. current authored edits never rewrite history.
18. Today never reads Preview as current plan.
19. Planner does not show execution outcomes.
20. Summary does not mutate authored planning state.
21. variable-duration user-day semantics remain universal.
22. no 24-hour assumption reappears.
23. user-week is not 168-hour authority.
24. month is not accidental plan authority.
25. all-day remains user-day-wide.
26. V1 timing remains unavailableLegacy.
27. exact identity governs cross-surface actions.
28. title/time retargeting is absent.
29. source recreation never retargets history/navigation.
30. Goal edits do not stale schedule.
31. Today reports do not stale schedule.
32. Commitment Save follows canonical stale semantics.
33. Event mutations follow their canonical regeneration semantics.
34. Try remains derived/non-durable as implemented.
35. Apply Planning Change remains bounded.
36. Resolution option remains distinct from Recommendation.
37. no Goal ranking of friction exists.
38. no transition adaptation exists.
39. no Capacity exists.
40. no Planned Allocation exists.
41. no Recommendations exist.
42. no drag/drop exists.
43. no direct placement authority exists.
44. no Pattern Library authority exists.
45. common Commitment workflow no longer requires raw engine concepts.
46. common Event workflow is contextually discoverable.
47. common Work workflow is reachable.
48. Review Schedule does not require Preview-domain knowledge.
49. Today does not require HistoricalPlan-domain knowledge from user.
50. Summary does not require projection-domain knowledge from user.
51. Save/apply/refresh actions are semantically distinguishable.
52. empty differs from missing where required.
53. protected differs from empty.
54. execution protected differs from notReported.
55. stale schedule remains visible.
56. explicit Refresh remains required.
57. profile replacement invalidates stale local targets.
58. restore invalidates stale local targets.
59. full clear removes stale local targets.
60. derived surfaces are not persisted as new authorities.
61. Planner authoring remains lazy where implemented.
62. Today remains lazy.
63. Summary remains lazy.
64. authority bootstrap remains eager.
65. recovery remains reachable.
66. loading boundaries duplicate no authority.
67. initial raw budget remains green.
68. initial gzip budget remains green.
69. largest lazy budget remains green.
70. total JS budget remains green.
71. no threshold inflation occurs.
72. no unnecessary runtime dependency exists.
73. top-level navigation is keyboard accessible.
74. Planner internal navigation is keyboard accessible.
75. contextual edits have deterministic focus.
76. Today outcome controls are accessible.
77. Summary evidence is semantically available.
78. mobile layouts remain operational.
79. no essential workflow requires pointer-only interaction.
80. current governance matches implementation.
81. Phase 6 roadmap does not overclaim.
82. future Monthly Planner can build on Planner without authority rewrite.
83. future Daily Workspace can build on Today without temporal rewrite.
84. future transition planning can build on canonical transition truth.
85. future Capacity/Recommendations can remain derived rather than rewriting current authorities.
86. any remaining Setup escape hatch is truthfully classified.
87. no P0 gap remains if Phase 6 is declared complete.
88. no P1 gap remains if Phase 6 is declared complete.
89. P2 gaps are explicitly dispositioned.
90. final completion decision follows evidence rather than roadmap momentum.

Classify each as:

* Confirmed;
* Preserved;
* Covered by test;
* Gap;
* Deferred;
* Not applicable;
* Blocked.

---

# 90. Stop Conditions

Stop the audit and report a prerequisite rather than inventing an answer if:

* current governance cannot establish Phase 6's intended outcome;
* Planner/Today/Summary surface ownership is materially contradictory;
* a major workflow has two competing canonical writers;
* cross-surface identity relies on title/time;
* variable user-day semantics differ between surfaces;
* Summary authority/read-model semantics are too ambiguous to determine surface correctness;
* current build cannot be validated;
* protected/missing state cannot be distinguished mechanically;
* task reports materially contradict production behavior and source audit cannot resolve the discrepancy.

Do not fix production behavior during this audit.

---

# 91. Validation

This is an audit, but validate the current repository baseline.

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Run formatting only if repository methodology requires it for a documentation-only audit and doing so will not alter immutable artifacts unexpectedly.

Record exact:

* test files;
* test count;
* transformed modules;
* initial raw;
* initial gzip;
* lazy chunks;
* largest lazy;
* total JS;
* diff result.

Do not modify production merely to make validation green.

If baseline validation is already broken independently, report it.

---

# 92. Final Audit Determination

The final section must choose exactly one:

## Outcome A — Phase 6 Complete

Use only if:

* no P0 gaps remain;
* no P1 gaps remain;
* any P2 gaps are either tiny publication-checkpoint cleanup or intentionally deferred with clear justification;
* Planner, Today, and Summary each have coherent responsibility;
* critical cross-surface workflows are mechanically sound;
* validation is green.

State:

> **Phase 6 surface convergence is complete. Proceed to publication checkpoint / Phase 7 planning.**

## Outcome B — Bounded Remediation Required

List the exact remediation tasks in dependency order.

Example only:

```text
Task 6.10 — ...
Task 6.11 — ...
```

Do not use example titles unless findings justify them.

State which P1/P2 gaps each task resolves.

## Outcome C — Architecture Prerequisite Required

Name the exact missing decision/audit.

Do not begin remediation design until it is resolved.

---

# 93. Final Audit Principle

> **Phase 6 should end when DayFrame's primary surfaces have coherent responsibilities and truthful workflows—not when every future capability has been implemented and not when every old internal component name has disappeared.**

The standard is product and architectural coherence.

Not perfection.

Not roadmap momentum.

Not cosmetic uniformity.

---

# 94. Final Completion Statement

**Task 6.9 is complete when DayFrame has mechanically compared the implemented Planner, Today, and Summary surfaces against the actual Phase 6 product and architectural objectives; traced their navigation, authority, write, identity, temporal, protection, loading, accessibility, responsive, persistence, profile, restore, full-clear, terminology, and cross-surface workflow behavior through production code and tests; distinguished remaining Setup or implementation-language residue from material product incoherence; verified that Planner owns authored intent, generated-plan review, contextual Event/Commitment/Work editing, and bounded friction resolution without execution or historical interpretation leakage; verified that Today owns the canonical current user-day and exact execution reporting without becoming a planning editor; verified that Summary owns historical evidence and progress interpretation without authored writes; confirmed that canonical variable-duration user-day, user-week, HistoricalPlan provenance, exact identity/incarnation, Goal ownership, PlanDecision, ExecutionHistory, staleness, and cutoff semantics remain consistent across surfaces; audited loading and bundle architecture against the fixed guards without threshold inflation; audited accessibility, keyboard, focus, mobile, empty, missing, protected, profile, restore, and full-clear behavior; classified every discovered issue by evidence, severity, and root cause rather than treating future features as current gaps; assessed Monthly Planner, Daily Workspace, shift-transition planning, Capacity, Allocation, Recommendations, Pattern Library, and Goal reorientation strictly as future-readiness questions; produced an explicit Phase 6 completion decision of complete, bounded remediation required, or architecture prerequisite required; and identified the exact next step without modifying production behavior or inventing implementation work not supported by the audit evidence.**
