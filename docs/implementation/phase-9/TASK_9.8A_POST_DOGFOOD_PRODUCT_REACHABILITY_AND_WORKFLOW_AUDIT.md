# Task 9.8A — Post-Dogfood Product Reachability & Workflow Audit

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Read-Only Architecture / Product Reachability / Workflow Audit  
**Implementation Changes:** PROHIBITED  
**Primary Evidence Source:** Current production code and tests  
**Dogfood Evidence Source:** Dogfood Pass 02 findings  
**Required Durable Output:** Phase 9 result artifact with `RESULT` in the filename  

---

## 1. Objective

Perform a rigorous, evidence-based audit of the current DayFrame production system following **Dogfood Pass 02**.

The purpose of this task is to determine, before any convergence implementation or two-primary-surface UI migration begins, which observed product gaps are:

1. implemented and product-reachable;
2. implemented but poorly exposed or difficult to discover;
3. implemented in domain/application code but not reachable from production UI;
4. partially implemented or disconnected across lifecycle boundaries;
5. genuinely not implemented;
6. exposed but behaviorally incorrect;
7. legacy/transitional UI that should be retired rather than repaired.

The central audit question is:

> **Which DayFrame capabilities are genuinely missing, which are implemented but disconnected, and which only appear missing because the current/legacy UX does not expose them?**

This task must establish current product-reachability truth before Task 9.8 convergence implementation or the Planner/Summary migration is designed.

The audit must prevent subsequent work from:

- rebuilding capabilities that already exist;
- bypassing canonical domain/application paths;
- weakening established authority boundaries merely to make an unreachable feature appear functional;
- polishing legacy UI that should instead be removed during migration;
- designing the new Planner/Summary surfaces around assumptions unsupported by production code;
- confusing architectural capability with product reachability;
- mistaking architectural terminology in the current UI for intended final product language.

This task is an **audit only**.

**Do not modify production code, tests, configuration, schemas, persistence, documentation, or UI.**

---

## 2. Governing Context

### 2.1 Current architectural direction

DayFrame is converging toward two primary product surfaces:

- **Planner**
- **Summary**

Dogfood Pass 02 strongly suggests that the existing **Today** surface should eventually collapse into Planner as the current-day state of a reusable **Day Worksurface**.

The current application shell predates substantial portions of the Phase 8 and Phase 9 architecture.

As a result, the current product may simultaneously expose:

- legacy workflows;
- transitional workflows;
- newer architecture through temporary controls;
- newer architecture with no production UI affordance;
- duplicated representations of the same underlying concept;
- raw architectural terminology that was never intended as final product language.

Do not assume the current UI accurately represents the capabilities of the current architecture.

---

### 2.2 Established Commitment workflow

Dogfood Pass 02 demonstrated that the Commitment-oriented path is substantially product-reachable:

    Authored Commitment
        ↓
    Recurrence / Candidate Generation
        ↓
    Placement
        ↓
    Generated Schedule
        ↓
    Friction when incompatible
        ↓
    Resolution / Suggested Fix path
        ↓
    Execution Reporting
        ↓
    Persistent Historical Evidence
        ↓
    Summary

This path contains usability and correctness defects, but significant portions of the lifecycle are operational.

---

### 2.3 Intended constructive Goal workflow

The established Phase 8/9 architecture defines an ordinary constructive lifecycle approximately as:

    Goal
        ↓
    Goal Structure
        ↓
    Demand
        ↓
    Priority
        ↓
    Projection
        ↓
    Capacity
        ↓
    Feasibility
        ↓
    Competition
        ↓
    Allocation
        ↓
    Proposal / No-Proposal
        ↓
    ProposalDecision
        ↓
    Accepted Allocation
        ↓
    Realization
        ↓
    Scheduled Goal Work / Support / Buffer
        ↓
    Review
        ↓
    Publication
        ↓
    Execution
        ↓
    Progress
        ↓
    History / Summary

Dogfood Pass 02 did **not** successfully traverse this lifecycle through ordinary product interaction.

No Planning Candidate / Proposal was naturally encountered.

Capacity was not meaningfully visible to the user.

Goal decomposition was not meaningfully exposed.

The user could not naturally progress from an authored Goal to DayFrame-proposed scheduled Goal work.

The audit must determine exactly where this lifecycle ceases to be product-reachable.

---

### 2.4 Established corrective lifecycle

The corrective path is architecturally distinct from constructive Goal planning:

    Authorized Scheduled Facts
        ↓
    Friction
        ↓
    SuggestedFix
        ↓
    PlanDecision / CompositeDecision
        ↓
    Revised Schedule / Preview
        ↓
    Publication / History

Do not conflate:

- Friction with Competition;
- SuggestedFix with Proposal;
- corrective planning with constructive Goal allocation.

Dogfood Pass 02 found that Friction detection is operational, but the visible **Resolve Schedule Conflicts** control appeared to provide no meaningful workflow.

Audit its actual reachability.

---

### 2.5 Found Time path

DayFrame already distinguishes manually discovered Goal opportunity from DayFrame-proposed Goal work.

The intended distinction is:

    Constructive planning:

    Goal
        ↓
    Demand / Capacity / Allocation
        ↓
    Proposal
        ↓
    User Acceptance
        ↓
    Accepted Allocation
        ↓
    Realization
        ↓
    Scheduled Goal Work

versus:

    User-directed opportunity:

    User discovers available time
        ↓
    Found Time
        ↓
    Goal-oriented scheduled reality
        ↓
    Execution Evidence
        ↓
    Goal Progress

Dogfood Pass 02 found that manual Event creation did not expose a meaningful Goal association / Found Time path.

A manually created Network+ study Event:

- existed on the calendar;
- did not naturally appear in the expected Goal execution workflow;
- did not advance Goal Progress;
- provided no obvious way to identify the Event as Found Time for an existing Goal.

Audit whether the underlying Found Time capability exists and, if so, where product reachability stops.

---

### 2.6 Continuous-calendar direction

Dogfood Pass 02 produced an important product direction:

> **The calendar exists continuously. DayFrame planning is a layer over it.**

The current product behaves too strongly as though calendar usefulness depends on generated planning coverage.

The intended future product should permit:

- Month navigation regardless of generated planning coverage;
- manual Events regardless of generated planning coverage;
- Found Time regardless of generated planning coverage;
- historical logging regardless of generated planning coverage;
- external calendar facts such as holidays regardless of generated planning coverage;
- DayFrame-generated planning as an additional layer over the continuous calendar.

This audit must determine which current architectural dependencies genuinely require a bounded planning range and which dependencies exist only because of the legacy UI/Preview workflow.

Do **not** redesign the architecture in this task.

Document current ownership and dependencies only.

---

## 3. Hard Constraints

### 3.1 Read-only audit

This task must make **no repository changes**.

Do not:

- edit source files;
- edit tests;
- add tests;
- update documentation;
- change schemas;
- change persistence;
- refactor code;
- rename symbols;
- change UI;
- implement missing wiring;
- fix discovered defects;
- delete legacy components.

The only authorized created artifact is the required audit result document.

---

### 3.2 Evidence over inference

Do not infer behavior from:

- filenames;
- type names;
- component names;
- comments;
- TODOs;
- architecture terminology;
- historical intent.

Trace actual production paths.

A capability is not product-reachable merely because a type, helper, store action, component, or test exists.

---

### 3.3 Production-path requirement

For product reachability, trace as applicable:

    Canonical Domain Capability
        ↓
    Application / Service / Query / Command
        ↓
    State / Store / Mutation Path
        ↓
    Production UI Invocation
        ↓
    User-Reachable Control
        ↓
    Observable Product Result

Where a stage does not exist, stop the trace and record the boundary.

---

### 3.4 Tests as behavioral evidence

Use tests to establish deterministic or contractual behavior.

Tests may prove that a lower-level capability exists.

Tests alone do **not** prove that the capability is product-reachable.

Where production code and tests disagree, report the discrepancy.

---

### 3.5 Preserve epistemic distinctions

Every substantive finding must be labeled as one of:

- **Confirmed**
- **Inferred**
- **Not Found**

Use **Confirmed** only where direct code/test evidence supports the claim.

Use **Inferred** only when evidence strongly suggests a conclusion but does not prove it.

Use **Not Found** when the audit cannot locate the required capability/path after reasonable tracing.

Do not convert absence of evidence into a confirmed absence unless the searched scope justifies it.

---

## 4. Required Reachability Classification

For every audited capability or workflow stage, assign one primary classification:

| Classification | Meaning |
|---|---|
| `IMPLEMENTED_REACHABLE` | Capability exists and ordinary production UI exposes a usable path to it |
| `IMPLEMENTED_DISCOVERABILITY_DEFECT` | Capability is reachable, but the user-facing path is obscure, misleading, or poorly presented |
| `IMPLEMENTED_UI_UNEXPOSED` | Domain/application capability exists, but no production UI affordance invokes it |
| `IMPLEMENTED_DISCONNECTED` | Pieces exist, but a required lifecycle handoff or integration is missing |
| `PARTIAL_IMPLEMENTATION` | Only part of the required capability/lifecycle exists |
| `NOT_FOUND` | Required capability could not be located in current production architecture |
| `EXPOSED_INCORRECT` | Product exposes the capability, but behavior violates established semantics |
| `LEGACY_OR_TRANSITIONAL_UI` | UI exists primarily as an older/transitional/debug path and should be evaluated for retirement rather than automatic repair |
| `WORKING_AS_INTENDED` | Dogfood concern is contradicted by confirmed current behavior or the tested behavior is correct by architecture |

If more than one classification applies, identify the primary classification and explain secondary conditions.

---

## 5. Audit Scope A — Goal Authoring and Goal Structure Reachability

Trace the complete production path for Goal creation and editing.

Determine:

1. where Goals are canonically stored;
2. what production commands/actions create them;
3. what production UI invokes those actions;
4. whether Goal creation is actually restricted to the Daily Worksurface;
5. whether another global Goal-authoring path exists;
6. whether Goal editing is similarly restricted;
7. whether Goal Structure relationships are product-reachable;
8. whether milestones are product-reachable;
9. whether containment relationships are product-reachable;
10. whether contribution relationships are product-reachable;
11. whether dependency relationships are product-reachable;
12. whether ongoing Goals are representable;
13. whether recurring Goal intent is representable;
14. whether time-based Goal demand is authored separately from measurement/progress.

Explicitly audit the Dogfood Pass 02 observation:

> Goal decomposition exists architecturally but was not exposed during ordinary use.

Do not assume this is a missing capability until the production path is traced.

---

## 6. Audit Scope B — Goal Demand, Priority, Projection, Capacity, and Feasibility

Trace:

    Goal
        ↓
    Demand Intent
        ↓
    Priority
        ↓
    Projection
        ↓
    Capacity
        ↓
    Goal-Specific Feasibility

Determine:

1. whether Demand is authored;
2. where Demand is authored;
3. whether Goal creation automatically creates Demand;
4. whether Demand requires a separate workflow;
5. whether current UI exposes required Demand fields;
6. whether Priority is product-editable;
7. whether Projection is automatically derived;
8. what triggers Projection;
9. whether Capacity is generated automatically;
10. what canonical inputs Capacity consumes;
11. whether Capacity requires explicit schedule generation;
12. whether Capacity can exist outside current Preview/planning-range coverage;
13. whether Capacity is queried by production UI;
14. whether Capacity is rendered anywhere in user-facing form;
15. whether Goal-specific Feasibility is invoked by production UI;
16. whether insufficient Capacity produces any user-visible result;
17. whether sufficient Capacity produces any user-visible result;
18. whether stale/unknown coverage blocks constructive planning;
19. whether the user has any product-reachable way to diagnose why a Goal is not considered feasible.

Explicitly answer:

> **Can current production code calculate Capacity for an ordinary Goal and schedule state even though the user cannot see it?**

If yes, identify the exact path and the first point where the result stops being product-reachable.

---

## 7. Audit Scope C — Competition, Allocation, Proposal, and ProposalDecision

Trace:

    Feasible Demand
        ↓
    Competition
        ↓
    Allocation
        ↓
    Proposal / No-Proposal
        ↓
    ProposalDecision

Determine:

1. what production entry point initiates Competition;
2. what production entry point initiates Allocation;
3. whether Allocation is invoked automatically or only through tests/internal calls;
4. what creates a durable Proposal;
5. what creates typed No-Proposal;
6. whether production UI can request Proposal generation;
7. whether production UI renders Proposals;
8. whether production UI renders No-Proposal outcomes;
9. whether a user can Accept a Proposal;
10. whether a user can Reject a Proposal;
11. whether ProposalDecision is invoked by production UI;
12. whether Proposal acceptance revalidates current truth as designed;
13. whether accepted Proposals become Accepted Allocations through the production path;
14. whether any current UI concept called "Planning Candidate" maps to the canonical Proposal architecture;
15. whether any legacy planning-candidate mechanism exists separately from Phase 9 Proposal.

Explicitly audit the Dogfood Pass 02 finding:

> No Planning Candidate or Proposal was encountered during ordinary product use.

Identify the exact reason supported by code evidence.

Do not stop at "the UI does not show it."

Trace backward until the first missing or disconnected production lifecycle edge is found.

---

## 8. Audit Scope D — Accepted Allocation and Realization

Trace:

    Accepted Proposal
        ↓
    Accepted Allocation
        ↓
    Realization
        ↓
    Scheduled Goal Work
        +
    Scheduled Support Activity
        +
    Realized Buffer Protection

Determine:

1. whether Accepted Allocation creation is product-reachable;
2. whether Realization is product-reachable;
3. whether Realization is automatic after acceptance or requires a separate command;
4. whether failure/retry/recovery paths exist;
5. whether realized Goal work enters the canonical schedule;
6. whether support activities enter the canonical schedule;
7. whether Buffer remains protective nonactivity;
8. whether realized Goal work appears in Planner/Month;
9. whether realized Goal work appears in Day-level views;
10. whether realized Goal work becomes execution-reportable;
11. whether accepted-but-unrealized state is visible;
12. whether realized facts retain accepted-allocation provenance.

Identify any lifecycle boundary that exists in tests but not in production UI.

---

## 9. Audit Scope E — Found Time and Direct Goal-Oriented Authoring

Trace the architecture for manually discovered Goal opportunity.

Determine:

1. whether `Found Time` exists as a canonical production concept;
2. its exact type/model representation;
3. what creates it;
4. whether any store/application command creates it;
5. whether any production UI invokes that command;
6. whether manual Event creation can associate an Event with a Goal;
7. whether a Goal-linked manual Event becomes Found Time;
8. whether Found Time creates scheduled Goal-oriented reality;
9. whether Found Time becomes execution-reportable;
10. whether completed Found Time contributes to Goal Progress;
11. whether Found Time provenance remains distinguishable from DayFrame-proposed Goal work;
12. whether manual Event and Found Time are intentionally separate identities;
13. whether a conversion/association path exists but is not exposed.

Explicitly trace the dogfood scenario:

    Existing Goal: Network+
    Manual Event: Network+ Study Session
    Duration: 60 minutes
    Intended relationship: Goal-oriented Found Time

Determine why that Event did not naturally enter the Goal execution/Progress lifecycle.

---

## 10. Audit Scope F — Execution, Retrospective Reporting, and Progress

Trace:

    Scheduled Reality
        ↓
    Execution Report
        ↓
    Progress Evidence
        ↓
    Goal Progress
        ↓
    History / Summary

Determine:

1. which scheduled identities are execution-reportable;
2. whether Work is reportable;
3. whether Commitment occurrences are reportable;
4. whether realized Goal work is reportable;
5. whether manual Events are reportable;
6. whether Found Time is reportable;
7. whether Support Activities are reportable;
8. which entities are intentionally prohibited from execution reporting;
9. whether retrospective reporting is supported by domain/application code;
10. whether retrospective reporting is product-reachable for arbitrary past dates;
11. whether Today artificially limits an otherwise general execution command;
12. whether execution reports persist independently of Preview regeneration;
13. whether execution reports survive application restart;
14. whether time-based Goal Progress can derive from execution duration;
15. whether Goal Progress currently requires manual cumulative measurement entry;
16. whether `Record New Value` is intended as manual external Progress evidence rather than scheduled-work execution evidence.

Explicitly distinguish:

- schedule truth;
- execution evidence;
- Progress evidence;
- cumulative Goal measurement.

Do not collapse them.

---

## 11. Audit Scope G — Review Schedule and Publication Reachability

Trace:

    Current Schedule / Realized Facts
        ↓
    Planning Review
        ↓
    User Decision
        ↓
    Explicit Publication
        ↓
    Published Plan
        ↓
    Today
        +
    Plan History
        +
    Summary

Determine:

1. what production command publishes a Plan;
2. what prerequisites publication requires;
3. whether Review Schedule can satisfy those prerequisites;
4. whether a production UI control invokes publication;
5. whether that control is discoverable;
6. whether publication is reachable without internal/debug interaction;
7. whether publication is atomic;
8. whether duplicate unchanged publication no-ops as designed;
9. whether changed truth can create a new immutable publication;
10. whether Published Plan survives restart;
11. whether Today consumes Published Plan;
12. whether Summary Plan History consumes Published Plan;
13. whether the absence of Plan History during dogfooding was expected because publication never occurred;
14. whether any old Preview action still implicitly behaves like publication;
15. whether generated schedule state and Published Plan remain correctly distinct.

Explicitly determine why the dogfood user could see:

> No published plan is available for this user-day.

while finding no obvious ordinary workflow to create one.

---

## 12. Audit Scope H — Friction, SuggestedFix, and Resolve Schedule Conflicts

Trace:

    Authorized Schedule
        ↓
    Friction
        ↓
    SuggestedFix
        ↓
    User Decision
        ↓
    Revised Schedule

Determine:

1. whether Friction detection is product-reachable;
2. whether SuggestedFix generation is product-reachable;
3. whether individual SuggestedFix application is product-reachable;
4. what the visible **Resolve Schedule Conflicts** control actually does;
5. whether it invokes a real workflow;
6. whether it is inert;
7. whether it invokes legacy behavior;
8. whether repeated similar Friction can be grouped;
9. whether bulk resolution architecture exists;
10. whether any current control silently mutates schedule authority;
11. whether PlanDecision / CompositeDecision is used by production UI.

Do not design bulk resolution in this task.

Determine current capability only.

---

## 13. Audit Scope I — Work-Relative Placement Correctness

This is a targeted correctness trace prompted by Dogfood Pass 02.

The tested behavior was:

### Before Work

`beforeWork` fails regardless of shift type by placing Workout in the middle of the Work interval.

### After Work

`afterWork` succeeds for ordinary/day Work but fails on every tested Night Shift occurrence by being unable to place Workout.

### Any Available

With the same Workout configuration:

- 1-hour duration;
- 30-minute buffer before;
- 30-minute buffer after;
- Monday/Wednesday/Friday recurrence;

`Any available` generated without Friction in the tested schedule.

Trace:

    Preferred Window
        ↓
    Candidate Window Construction
        ↓
    Applicable Work Interval Resolution
        ↓
    Canonical User-Day Conversion
        ↓
    Opening Discovery
        ↓
    Placement
        ↓
    Collision / Friction Detection

Determine:

1. where `beforeWork` semantics are interpreted;
2. where `afterWork` semantics are interpreted;
3. how the applicable Work interval is selected;
4. how overnight Work is represented;
5. how canonical user-day boundaries affect the calculation;
6. whether Work start/end is converted to calendar dates correctly;
7. whether candidate windows cross boundaries correctly;
8. whether buffers influence the failure;
9. why `Any available` succeeds;
10. whether current tests cover these exact cases;
11. whether existing tests contradict dogfood behavior;
12. the most specific confirmed defect boundary supported by evidence.

Required scenario matrix:

| Work Shape | Preferred Window | Expected | Dogfood Observation | Existing Test? | Audit Classification |
|---|---|---|---|---|---|
| Day Work | beforeWork | Place before Work or remain unplaced | Places inside Work | Required | Required |
| Night Work | beforeWork | Place before Work or remain unplaced | Places inside Work | Required | Required |
| Day Work | afterWork | Place after Work or remain unplaced | Appears functional | Required | Required |
| Night Work | afterWork | Place after Work or remain unplaced | Fails to place | Required | Required |
| Night Work | anyAvailable | Valid free opening | Works without Friction in tested setup | Required | Required |

Do not fix the defect.

Identify it precisely enough that a subsequent implementation task can create the correct regression tests and repair.

---

## 14. Audit Scope J — Planning Range, Preview, and Continuous Calendar Dependencies

Trace the current ownership of:

- Planning Data Horizon;
- Preview Range;
- Review Scope;
- Publication Range;
- Month navigation;
- manual Events;
- generated Work;
- generated Commitments;
- Goal planning;
- execution history;
- Summary history.

Determine:

1. which capabilities genuinely require generated planning coverage;
2. which capabilities merely appear to require it because of UI gating;
3. whether Month can technically render arbitrary calendar dates without Preview data;
4. whether manual Events can exist outside generated planning coverage;
5. whether execution history can be queried outside generated planning coverage;
6. whether Summary can query historical evidence independently of Preview;
7. whether Goal planning requires bounded Capacity horizons;
8. whether publication requires bounded ranges;
9. whether a rolling internal horizon could coexist with arbitrary calendar navigation without changing canonical semantics;
10. which current `Not generated` states are architectural necessities versus legacy presentation choices;
11. whether the giant Preview day-button navigator owns any capability that Month does not already provide.

Do not implement the continuous-calendar model.

Document which current architectural boundaries must be preserved if that model is later implemented.

---

## 15. Audit Scope K — Current UI Generation / Legacy Surface Inventory

Inventory the production UI surfaces relevant to Dogfood Pass 02.

At minimum inspect:

- Planner;
- Month;
- Selected DayFrame Day;
- Canonical Planning Review;
- Commitment Library;
- Work Pattern;
- Review Schedule;
- Today;
- Summary;
- Goal creation/editing;
- manual Event creation/editing;
- Planning Settings / Planning Range;
- Preview navigation;
- Friction / conflict-resolution controls.

For each surface classify it as one of:

- canonical current product surface;
- current product surface backed by newer architecture;
- transitional adapter;
- legacy workflow;
- debug/development-oriented presentation;
- duplicated presentation of another canonical capability;
- unclear — requires follow-up.

Do not classify based on age or naming alone.

Use imports, routes, state ownership, commands, tests, and actual production usage as evidence.

---

## 16. Audit Scope L — Architectural Language Leakage

Dogfood Pass 02 identified user-facing terminology including:

- `Selected-day planning truth`
- `Canonical Planning Review`
- `template`
- `generated`
- `Scheduling realization`
- `Planning Range`
- potentially other raw domain/source/provenance terminology

Audit production UI for architectural/domain terminology exposed directly to users.

For each term determine:

1. where it originates;
2. whether it represents meaningful user-facing semantics;
3. whether it is raw type/source/provenance language;
4. whether it is required for authority clarity;
5. whether it appears primarily because a development/transitional surface exposes internal state.

Do not rewrite copy.

Produce a translation/removal candidate inventory for future migration work.

Do not assume every architecture term is inappropriate.

Terms such as **Friction** may be intentional product vocabulary.

The audit must distinguish useful product concepts from implementation leakage.

---

## 17. Audit Scope M — Navigation and Day Worksurface Duplication

Trace the current responsibilities of:

- Month;
- Selected DayFrame Day;
- Canonical Planning Review;
- Today;
- Daily Worksurface;
- Summary drill-down.

Determine:

1. which underlying queries each uses;
2. whether they represent the same canonical DayFrame day;
3. whether Today owns unique domain capability;
4. whether Today primarily adds execution controls to information already available in Planner;
5. whether retrospective reporting commands can operate on non-current days;
6. whether Selected DayFrame Day and Today can theoretically share one underlying Day Worksurface without changing domain authority;
7. whether Canonical Planning Review contains capabilities not available through selected-day views;
8. what production dependencies would have to be preserved if Today later becomes a Planner shortcut rather than a peer surface.

Do not perform the two-surface migration.

Establish whether the architecture supports it.

---

## 18. Audit Scope N — My Schedule Hierarchy Feasibility

Dogfood Pass 02 identified **My Schedule** as a promising user-facing organizational concept containing:

- Work Pattern;
- Commitments.

Audit whether these two workflows are sufficiently independent of Planner temporal navigation to be presented as peer schedule-input workflows.

Determine:

1. canonical state owned by Work Pattern;
2. canonical state owned by Commitments;
3. shared schedule-generation dependencies;
4. whether either currently owns temporal navigation state that would prevent hierarchical reorganization;
5. whether either depends on legacy Preview UI;
6. whether either can be invoked contextually from Month without semantic duplication;
7. whether Goal authoring can remain separate while still being globally discoverable within Planner.

Do not implement `My Schedule`.

This is a feasibility and ownership audit only.

---

## 19. Required End-to-End Reachability Matrix

Produce a matrix containing at minimum the following rows:

| Capability / Stage | Domain Exists | Application Path Exists | Store/Command Exists | Production UI Invokes | Ordinary User Reachable | Tests | Classification | Evidence |
|---|---:|---:|---:|---:|---:|---|---|---|
| Goal creation | | | | | | | | |
| Goal editing | | | | | | | | |
| Goal Structure | | | | | | | | |
| Demand authoring | | | | | | | | |
| Priority authoring | | | | | | | | |
| Projection | | | | | | | | |
| Capacity | | | | | | | | |
| Feasibility | | | | | | | | |
| Competition | | | | | | | | |
| Allocation | | | | | | | | |
| Proposal generation | | | | | | | | |
| No-Proposal | | | | | | | | |
| Proposal acceptance | | | | | | | | |
| Proposal rejection | | | | | | | | |
| Accepted Allocation | | | | | | | | |
| Realization | | | | | | | | |
| Scheduled Goal Work | | | | | | | | |
| Found Time | | | | | | | | |
| Goal-linked manual event | | | | | | | | |
| Execution reporting | | | | | | | | |
| Retrospective reporting | | | | | | | | |
| Goal Progress from execution | | | | | | | | |
| Friction detection | | | | | | | | |
| SuggestedFix generation | | | | | | | | |
| SuggestedFix application | | | | | | | | |
| Resolve Schedule Conflicts | | | | | | | | |
| Planning Review | | | | | | | | |
| Publication | | | | | | | | |
| Published Plan consumption | | | | | | | | |
| Plan History | | | | | | | | |
| Summary execution history | | | | | | | | |
| Arbitrary Month navigation | | | | | | | | |
| Manual Event outside planning coverage | | | | | | | | |

Add rows where required.

---

## 20. Required Workflow Breakpoint Analysis

For each major lifecycle, identify the **first confirmed point at which ordinary product reachability stops**.

Required lifecycles:

### 20.1 Constructive Goal planning

    Goal
    → Demand
    → Capacity
    → Feasibility
    → Competition
    → Allocation
    → Proposal
    → ProposalDecision
    → Accepted Allocation
    → Realization
    → Scheduled Goal Work

### 20.2 Found Time

    Manual Goal-oriented action
    → Found Time
    → Scheduled Goal-oriented reality
    → Execution
    → Progress

### 20.3 Publication

    Current Schedule
    → Review
    → Explicit Publication
    → Published Plan
    → Today
    → Plan History / Summary

### 20.4 Corrective planning

    Friction
    → SuggestedFix
    → Decision
    → Revised Schedule

### 20.5 Execution

    Scheduled Reality
    → Outcome Report
    → Durable Evidence
    → Progress / Summary / History

For each lifecycle provide:

- last confirmed product-reachable stage;
- first unreachable/disconnected stage;
- reason;
- evidence;
- classification;
- whether the missing edge is UI-only, application integration, domain capability, or unresolved.

---

## 21. Required Dogfood Finding Disposition Matrix

Use the complete Dogfood Pass 02 findings as the audit input.

For every finding relevant to architecture/product reachability, assign one disposition:

| Disposition | Meaning |
|---|---|
| `CONFIRMED_CORRECTNESS_DEFECT` | Behavior is exposed and code evidence supports a real defect |
| `CONFIRMED_REACHABILITY_GAP` | Capability exists but ordinary user cannot reach it |
| `CONFIRMED_INTEGRATION_GAP` | Required lifecycle components exist but are not connected |
| `CONFIRMED_PRESENTATION_DEFECT` | Capability works but presentation/discoverability is defective |
| `CONFIRMED_LEGACY_UI` | Current UI should likely be migrated/retired rather than repaired |
| `CONFIRMED_MISSING_CAPABILITY` | Required capability does not exist in current implementation |
| `WORKING_AS_INTENDED` | Dogfood concern reflects correct current behavior |
| `DEFERRED_PRODUCT_EVOLUTION` | Finding represents future product design rather than a current defect |
| `UNRESOLVED` | Evidence is insufficient for a stronger classification |

At minimum explicitly disposition the following Dogfood Pass 02 findings:

- beforeWork placement;
- afterWork overnight placement;
- long Work rotation authoring;
- dual Work configuration paths;
- Sleep baseline/default behavior;
- Sleep placement semantics;
- duration authoring;
- recurrence authoring;
- contextual Commitment editing;
- Goal global discoverability;
- Goal decomposition;
- ongoing Goals;
- recurring Goals;
- Capacity visibility;
- missing Planning Candidate / Proposal;
- Resolve Schedule Conflicts;
- Found Time;
- Goal-linked manual Event;
- Goal Progress from scheduled/manual Goal work;
- retrospective execution reporting;
- Summary realization drill-down;
- Today / Selected Day duplication;
- continuous calendar;
- Planning Range / Preview dependency;
- architectural-language leakage;
- Planner navigation duplication;
- `My Schedule`;
- two-primary-surface migration feasibility.

Do not force purely UX/product-evolution findings into architecture-defect classifications.

---

## 22. Required Legacy-vs-Canonical UI Matrix

Produce a matrix:

| UI Surface / Component | Current Responsibility | Underlying Architecture | Product-Reachable Capability | Duplicate Of | Legacy/Transitional Evidence | Recommended Treatment Category |
|---|---|---|---|---|---|---|
| Month | | | | | | |
| Selected DayFrame Day | | | | | | |
| Canonical Planning Review | | | | | | |
| Today | | | | | | |
| Commitment Library | | | | | | |
| Work Pattern | | | | | | |
| Review Schedule | | | | | | |
| Goal editor | | | | | | |
| Event editor | | | | | | |
| Planning Range controls | | | | | | |
| Preview day navigator | | | | | | |
| Summary | | | | | | |

`Recommended Treatment Category` must use one of:

- Preserve
- Expose
- Connect
- Consolidate
- Migrate
- Retire
- Repair Before Migration
- Requires Design Decision

This is an audit recommendation only.

Do not implement the recommendation.

---

## 23. Required Architectural Invariants Check

Confirm whether the current production system continues to preserve the following invariants.

### Authority

- Authored authority outranks derived state.
- Proposal does not create planning authority.
- ProposalDecision creates Accepted Allocation only through explicit user acceptance.
- Accepted Allocation does not itself own schedule time.
- Realization creates scheduled ownership.
- Published Plan is explicit and immutable.
- Execution does not rewrite schedule truth.
- Progress does not rewrite execution truth.
- Learned/derived information does not silently become authored authority.

### Time ownership

- Work owns time.
- Commitments own time when scheduled.
- Real attached/support activities own time when realized.
- Realized Goal work owns time.
- Buffers protect time but are not activities.
- Capacity does not own time.
- Demand does not own time.
- Allocation does not own time.
- Proposal does not own time.

### Constructive versus corrective planning

- Competition is not Friction.
- Proposal is not SuggestedFix.
- ProposalDecision is not PlanDecision.
- Constructive planning does not silently use corrective authority.
- Corrective planning does not silently create Goal allocation authority.

### Persistence

- Authored/accepted authority persists as designed.
- Derived Preview state remains disposable.
- Published Plans remain immutable.
- Execution evidence remains durable.
- Progress/history remains distinct from regenerated schedule state.

### Time semantics

- Canonical user-day remains authoritative.
- Planning Data Horizon remains distinct from Review Scope.
- Proposal Horizon remains distinct from Publication Range.
- Calendar navigation does not itself create planning authority.

Report any confirmed invariant violation separately and prominently.

---

## 24. Required Evidence Standard

Every significant claim in the result must cite:

- file path;
- relevant symbol/function/component/type;
- line number or line range where practical;
- supporting test path and test name where deterministic behavior is claimed.

Example format:

    Confirmed
    src/.../file.ts:120-168
    Symbol: someFunction
    Test: src/.../tests/file.test.ts — "does something deterministic"

Do not provide unsupported summaries such as:

> "The system seems to support this."

Instead state:

> **Confirmed:** Domain capability exists and is invoked by `X`, but no production component invokes `Y`.

or:

> **Not Found:** No production UI invocation of `Y` was located after tracing callers from the canonical command and searching production components.

---

## 25. Required Validation

Because this is a read-only audit, validation must establish that the repository remains unchanged.

At minimum:

1. record repository status before audit;
2. perform the audit;
3. record repository status after audit;
4. confirm no production/test/config/documentation files were modified;
5. only the required RESULT artifact may be newly created.

Running existing tests is allowed where necessary to verify behavior.

Do not alter tests to make them easier to inspect.

If the full test suite is run, report:

- test files;
- test count;
- failures.

If only targeted tests are run, state exactly which suites were run and why.

---

## 26. Required Result Artifact

Create one durable Markdown result artifact in the dedicated **Phase 9 results folder**.

The filename must contain `RESULT`.

Preferred filename:

    TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md

Do not overwrite the task/input artifact.

The result artifact must be self-contained enough to support future DayFrame hydration without requiring this conversation.

---

## 27. Required Result Structure

The RESULT artifact must contain the following sections in this order:

### 1. Executive Findings

Summarize:

- overall product-reachability state;
- largest confirmed lifecycle breakpoints;
- largest confirmed old-UX exposure gaps;
- confirmed correctness defects;
- whether the Phase 8/9 architecture is substantially present beneath the current shell;
- whether two-surface migration is architecturally supportable without major domain redesign.

### 2. Audit Method and Evidence Standard

Document:

- repository state;
- search/tracing method;
- production-path criteria;
- test use;
- Confirmed / Inferred / Not Found rules.

### 3. End-to-End Product Reachability Map

Provide the full traced lifecycle:

    Goal
    → Structure
    → Demand
    → Priority
    → Projection
    → Capacity
    → Feasibility
    → Competition
    → Allocation
    → Proposal
    → ProposalDecision
    → Accepted Allocation
    → Realization
    → Scheduled Goal Work
    → Review
    → Publication
    → Execution
    → Progress
    → History / Summary

Mark every stage with its reachability classification.

### 4. Reachability Matrix

Include the complete matrix required by Section 19.

### 5. Workflow Breakpoint Analysis

Include all lifecycle breakpoint analyses required by Section 20.

### 6. Goal and Goal-Structure Findings

Report Scope A.

### 7. Demand / Capacity / Feasibility Findings

Report Scope B.

### 8. Competition / Allocation / Proposal Findings

Report Scope C.

### 9. Accepted Allocation / Realization Findings

Report Scope D.

### 10. Found Time Findings

Report Scope E.

### 11. Execution / Progress Findings

Report Scope F.

### 12. Review / Publication Findings

Report Scope G.

### 13. Friction / SuggestedFix Findings

Report Scope H.

### 14. Work-Relative Placement Correctness Findings

Report Scope I and include the required scenario matrix.

### 15. Planning Range / Continuous Calendar Dependency Findings

Report Scope J.

### 16. Current UI Generation / Legacy Surface Inventory

Report Scope K.

### 17. Architectural Language Leakage Inventory

Report Scope L.

### 18. Navigation / Day Worksurface Findings

Report Scope M.

### 19. My Schedule Hierarchy Feasibility

Report Scope N.

### 20. Dogfood Finding Disposition Matrix

Include the required Section 21 matrix.

### 21. Legacy-vs-Canonical UI Matrix

Include the required Section 22 matrix.

### 22. Architectural Invariants Assessment

Report Section 23.

### 23. Confirmed Working Paths to Preserve

Explicitly identify behavior that should not be broken by convergence work.

At minimum consider:

- authored setup persistence;
- deterministic Commitment regeneration;
- execution report persistence;
- historical Summary aggregation;
- Friction detection;
- manual Event persistence;
- canonical user-day semantics;
- explicit authority transitions.

### 24. Confirmed Repair-Before-Migration Candidates

List only defects supported by evidence that should likely be repaired before or as prerequisites to migration.

Do not include cosmetic legacy-shell issues merely because they are unattractive.

### 25. Migration/Retirement Candidates

Identify old/transitional surfaces that should likely be migrated, consolidated, or retired rather than polished.

### 26. Product-Reachability Gaps Requiring Connection

Identify capabilities that already exist but require UI/application wiring rather than domain reimplementation.

### 27. Genuine Missing Capabilities

List only capabilities confirmed absent.

Do not place unresolved findings here.

### 28. Deferred Product-Evolution Findings

Separate future design ideas from current defects.

At minimum consider:

- continuous/live calendar;
- holiday/calendar-fact ingestion;
- recurring/ongoing Goals;
- `My Schedule`;
- `Tasks` as optional user-facing organizational vocabulary;
- Summary drill-down redesign;
- two-surface navigation.

### 29. Open Questions

List unresolved architectural/product questions requiring explicit follow-up.

### 30. Recommended Task 9.8 Scope Boundary

Based on evidence, recommend what the subsequent convergence implementation task should and should not contain.

Do **not** draft Task 9.8.

The recommendation must distinguish:

- correctness repair;
- lifecycle connection;
- product reachability;
- migration preparation;
- deferred product evolution.

### 31. Validation and Repository Integrity

Report:

- initial repository status;
- final repository status;
- tests run;
- confirmation that no unauthorized files changed.

### 32. Final Completion Statement

End with the exact statement:

> **Task 9.8A — Post-Dogfood Product Reachability & Workflow Audit is complete. No implementation changes were made. The current DayFrame product-reachability boundaries, lifecycle breakpoints, legacy UI exposure gaps, confirmed correctness defects, and pre-migration convergence requirements have been documented in the Phase 9 RESULT artifact.**

---

## 28. Completion Criteria

Task 9.8A is complete only when all of the following are true:

- [ ] No implementation changes were made.
- [ ] Repository integrity was verified before and after the audit.
- [ ] Goal creation/editing reachability was traced.
- [ ] Goal Structure reachability was traced.
- [ ] Demand/Priority/Projection reachability was traced.
- [ ] Capacity generation and product exposure were traced.
- [ ] Feasibility was traced.
- [ ] Competition and Allocation were traced.
- [ ] Proposal and No-Proposal generation were traced.
- [ ] ProposalDecision was traced.
- [ ] Accepted Allocation creation was traced.
- [ ] Realization was traced.
- [ ] Scheduled Goal Work reachability was traced.
- [ ] Found Time was traced.
- [ ] Manual Event -> Goal/Found Time behavior was traced.
- [ ] Execution reporting was traced.
- [ ] Retrospective reporting was traced.
- [ ] Goal Progress from execution was traced.
- [ ] Review Schedule was traced.
- [ ] Publication was traced.
- [ ] Published Plan consumption by Today and Summary was traced.
- [ ] Friction / SuggestedFix / resolution reachability was traced.
- [ ] `beforeWork` correctness was traced.
- [ ] overnight `afterWork` correctness was traced.
- [ ] `Any available` was used as the placement control case.
- [ ] Planning Range / Preview dependencies were traced.
- [ ] Continuous-calendar architectural feasibility boundaries were documented.
- [ ] Current UI generations were inventoried.
- [ ] Architectural-language leakage was inventoried.
- [ ] Today / Selected Day / Canonical Planning Review duplication was audited.
- [ ] `My Schedule` hierarchy feasibility was audited.
- [ ] Required reachability matrix was completed.
- [ ] Required workflow-breakpoint analysis was completed.
- [ ] Dogfood finding disposition matrix was completed.
- [ ] Legacy-vs-canonical UI matrix was completed.
- [ ] Architectural invariants were assessed.
- [ ] Working behavior to preserve was identified.
- [ ] Repair-before-migration candidates were separated from migration/retirement candidates.
- [ ] Existing-but-disconnected capabilities were separated from genuinely missing capabilities.
- [ ] Deferred product evolution was separated from current defects.
- [ ] Recommended Task 9.8 scope boundary was documented without drafting Task 9.8.
- [ ] A durable Phase 9 RESULT artifact with `RESULT` in the filename was created.

---

## 29. Governance

This audit does **not** authorize implementation.

Do not:

- repair discovered defects;
- connect missing UI wiring;
- expose hidden architecture;
- redesign Goal workflows;
- redesign Work Pattern;
- redesign Commitment Library;
- implement Found Time;
- implement Proposal generation;
- implement publication controls;
- implement continuous calendar;
- add holiday ingestion;
- collapse Today into Planner;
- implement `My Schedule`;
- begin the two-surface migration.

Those decisions depend on the audit result.

If a capability appears obviously easy to connect, document the connection point but do not implement it.

If a legacy component appears obviously removable, document the evidence but do not remove it.

If a dogfood observation is contradicted by code/tests, report the contradiction rather than changing either side.

If architecture intent and production behavior differ, report both and identify which is confirmed production truth.

The objective is **epistemic clarity before convergence**.

---

## 30. Final Instruction

Treat Dogfood Pass 02 as observed product evidence, not as a specification that every observed behavior must be changed.

Trace the current system from canonical domain semantics outward to actual user reachability.

Do not assume:

> "The user could not find it, therefore it does not exist."

Do not assume:

> "A type or test exists, therefore the product supports it."

Establish the complete chain.

The result of this audit must make it possible to answer, with code evidence:

> **What does DayFrame already know how to do, what can the current user actually make it do, where do those two realities diverge, and what must be repaired or connected before the Planner/Summary migration begins?**