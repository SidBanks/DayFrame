# DayFrame Dogfood Follow-Up Audit 01
## Capacity and Proposal Implementation Alignment Audit

**Artifact:** `CAPACITY_PROPOSAL_IMPLEMENTATION_ALIGNMENT_AUDIT.md`  
**Type:** Read-only implementation audit  
**Authority:** `DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md` and current approved DayFrame architecture  
**Repository:** `/home/sid/Penn Digital Services/DayFrame`  
**Code:** `/home/sid/Penn Digital Services/DayFrame/code`  
**Documentation:** `/home/sid/Penn Digital Services/DayFrame/docs`  

---

# 1. Purpose

Perform a structured, evidence-first audit of the current DayFrame implementation to determine the actual implementation status of two core product concepts identified as architectural gaps during Dogfood Pass 01:

1. **Capacity**
2. **Proposal**

The audit must determine whether these concepts:

- already exist under different names;
- exist partially but are disconnected;
- exist only as implicit calculations;
- exist only in documentation or tests;
- are incorrectly conflated with other concepts;
- or are genuinely absent from the executable product.

This is an implementation-alignment audit.

It is **not** an implementation task.

Do not modify production code, tests, configuration, schemas, documentation, or repository structure.

---

# 2. Architectural Context

Dogfood Pass 01 established the following provisional DayFrame product contract:

> **Commitments own time. Goals compete for Capacity. DayFrame proposes. The user decides. DayFrame schedules what the user has authorized.**

The intended high-level planning lifecycle is:

    USER-AUTHORED REALITY
    ┌─────────────────────────────────────┐
    │ Commitments                         │
    │ Constraints                         │
    │ Goals                               │
    │ Priorities                          │
    │ Explicit Scheduling Preferences     │
    └─────────────────────────────────────┘
                      │
                      ▼
             COMMITMENTS SHAPE TIME
                      │
                      ▼
                  CAPACITY
                      │
                      │  Goals
                      │  Priorities
                      │  Preferences
                      │  Relevant Accepted Choices
                      ▼
               ENGINE REASONING
                      │
                      ▼
                  PROPOSAL
                      │
               ┌──────┼──────┐
               │      │      │
             Accept  Modify  Reject
               │      │
               └──┬───┘
                  ▼
           ACCEPTED ALLOCATION
                  │
                  ▼
               SCHEDULE
                  │
          ┌───────┴────────┐
          │                │
       Feasible         Conflict
          │                │
          │             FRICTION
          │                │
          │       Recovery Recommendation
          │                │
          │          User Decision
          │                │
          └───────┬────────┘
                  ▼
               EXECUTION
                  │
                  ▼
               PROGRESS
                  │
                  ▼
               SUMMARY

This lifecycle is architectural context, not evidence that the current implementation already behaves this way.

The audit must determine implemented truth independently.

---

# 3. Critical Semantic Boundaries

The audit must preserve the following distinctions while investigating the code.

## 3.1 Commitment

A Commitment is time-owning authored reality.

It directly shapes the temporal environment in which planning occurs.

Examples may include Work, Sleep, appointments, fixed obligations, and recurring commitments.

Do not assume every existing block/template/event type is architecturally a Commitment merely because it occupies time.

Determine actual implementation semantics.

---

## 3.2 Capacity

Capacity is not automatically equivalent to:

- blank calendar space;
- gaps between events;
- total unscheduled minutes;
- placement openings;
- remaining preview area;
- unallocated candidate time.

Capacity is intended to represent the usable planning resource remaining after time-owning Commitments and relevant constraints shape the planning period.

The audit must determine whether the current implementation contains anything with this semantic role.

---

## 3.3 Goal

A Goal expresses a desired outcome.

A Goal should not be assumed to own time merely because scheduled work may be associated with it.

The audit must determine the actual implementation relationship among:

- Goals;
- scheduled blocks/events;
- allocations;
- execution;
- progress;
- and history.

---

## 3.4 Proposal

Proposal is a constructive planning concept.

A Proposal represents DayFrame's recommended use of available Capacity before discretionary work becomes user-authorized scheduled work.

A Proposal should remain distinct from generated output that is automatically treated as scheduled merely because the engine produced it.

The key authority question is:

> Does the engine ever produce a provisional planning recommendation that requires user acceptance, modification, or rejection before becoming authoritative scheduled work?

---

## 3.5 Friction

Friction is corrective rather than constructive.

Friction asks:

> Something in an existing or attempted plan cannot coexist. What should change?

Proposal asks:

> Given available Capacity and user priorities, what should the plan contain?

These concepts must not be conflated.

However, the audit should investigate whether existing Friction machinery provides reusable technical infrastructure for:

- recommendations;
- choices;
- acceptance;
- rejection;
- provenance;
- applicability;
- replay;
- or decision persistence.

Any technical overlap must be documented separately from semantic equivalence.

---

# 4. Audit Rules

## 4.1 No Changes

Do not edit files.

Do not create implementation patches.

Do not refactor.

Do not rename concepts.

Do not add tests.

Do not modify documentation.

Do not produce a remediation plan until the evidence report is complete.

---

## 4.2 Evidence Classification

Every substantive finding must be marked:

- **Confirmed**
- **Inferred**
- **Not Found**

### Confirmed

Directly supported by executable production code, persisted schemas/state, runtime wiring, or relevant tests.

### Inferred

Strongly suggested by code structure but not proven by an executable path or deterministic test.

### Not Found

A targeted search and trace did not identify the relevant capability.

Do not use "Not Found" merely because a concept is not named `capacity` or `proposal`.

Search behavior and semantics, not only terminology.

---

## 4.3 Evidence Requirements

For every Confirmed finding, cite:

- file path;
- symbol/function/type/action/component;
- relevant line range where practical;
- runtime role;
- and tests when deterministic behavior is claimed.

When implementation and tests disagree, report the disagreement explicitly.

When comments or names suggest semantics not supported by executable behavior, state that distinction.

---

# 5. Primary Audit Questions

The audit must answer the following questions.

---

# 6. Part A — Capacity

## A1. Is Capacity represented explicitly anywhere?

Search for explicit domain concepts including but not limited to:

- capacity;
- available capacity;
- remaining capacity;
- free capacity;
- allocatable time;
- discretionary time;
- availability;
- remaining minutes;
- available minutes;
- openings;
- free windows;
- free time;
- budget;
- allocation;
- load;
- utilization.

Do not stop at keyword results.

Determine whether any discovered structure has actual Capacity semantics.

---

## A2. Is Capacity computed implicitly?

Trace scheduling-generation logic to determine whether DayFrame calculates something equivalent to usable remaining planning resources even if it does not call that value Capacity.

Investigate:

- planning windows;
- user-day windows;
- occupied intervals;
- work blocks;
- manual events;
- recurring commitments;
- Sleep;
- buffers;
- gaps/openings;
- candidate placement;
- unplaced candidates;
- placement search;
- time-window clipping;
- daily or weekly totals.

For every candidate mechanism, answer:

1. What inputs define it?
2. What does it calculate?
3. At what temporal scope?
4. Is it persisted or transient?
5. Does any Goal logic consume it?
6. Is it surfaced to the user?
7. Is it used only for placement?
8. Does it distinguish theoretical free time from usable Capacity?

---

## A3. What currently consumes available time?

Build an evidence-backed inventory of all implemented time-owning or time-blocking sources.

At minimum investigate:

- generated Work;
- manual events;
- recurring block templates;
- Sleep;
- fixed commitments;
- movable commitments;
- buffers;
- accepted decisions;
- generated Goal-associated work if applicable.

For each participant document:

| Source | Authored/Generated | Owns Time? | Affects Placement? | Affects Any Capacity-Like Calculation? | Evidence |
|---|---|---:|---:|---:|---|

Do not infer architectural ownership solely from UI naming.

---

## A4. What constraints would theoretically shape Capacity today?

Identify implementation support for constraints such as:

- duration;
- priority;
- preferred windows;
- relational placement;
- user-day boundary;
- week boundary;
- work-relative positioning;
- buffers;
- recurrence;
- off-day behavior;
- fixed/movable status;
- accepted decisions.

Determine which constraints affect actual remaining availability and which merely affect candidate placement.

---

## A5. Is Capacity aggregated?

Determine whether the implementation calculates availability at any level such as:

- occurrence;
- user-day;
- week;
- planning range;
- commitment category;
- Goal;
- priority;
- cycle segment.

Dogfood Pass 01 found no meaningful user-facing Capacity representation.

Determine whether aggregate calculations nevertheless exist internally.

---

## A6. Does Summary contain latent Capacity data?

Inspect Summary/history/progress calculations for metrics that may indirectly represent:

- planned load;
- scheduled load;
- execution load;
- unscheduled time;
- utilization;
- allocation;
- goal effort;
- remaining opportunity.

Determine whether Summary already contains calculations that could be part of a future Capacity model.

Do not treat retrospective execution totals as Capacity unless semantics support that conclusion.

---

## A7. Does the current system distinguish free time from usable Capacity?

This is a critical question.

For example, if DayFrame finds a 30-minute gap between two commitments:

- is that automatically considered usable?
- are buffers accounted for?
- are preferred windows accounted for?
- are minimum useful durations considered?
- does relational placement constrain use?
- can Goal work consume it?
- does DayFrame reason about fatigue/recovery or only geometry?

Report implemented truth only.

---

## A8. Capacity conclusion

At the end of Part A, classify Capacity as one of:

### C1 — Explicitly Implemented

A recognizable Capacity domain model exists and is wired into planning.

### C2 — Implicitly Implemented

The semantics substantially exist but are represented through other calculations/names.

### C3 — Partially Implemented

Relevant calculations exist but do not form a coherent Capacity model.

### C4 — UI-Disconnected

A meaningful Capacity model exists internally but is not exposed through the product.

### C5 — Not Implemented

No coherent implementation corresponding to Capacity was found.

More than one classification may apply if clearly scoped.

---

# 7. Part B — Goals and Allocation

Proposal cannot be understood without tracing how Goals currently become scheduled work.

## B1. Trace the Goal model

Identify:

- Goal types;
- Goal state;
- Goal persistence;
- Goal mutations;
- Goal priority fields;
- Goal status/lifecycle;
- Goal start/end/completion semantics;
- Goal associations;
- Goal progress calculations.

Document the authoritative source of Goal truth.

---

## B2. Trace Goal-to-schedule provenance

Determine exactly how a Goal becomes associated with scheduled activity today.

Trace:

    Goal
      ↓
    Association
      ↓
    Commitment/Event/Block
      ↓
    Schedule
      ↓
    Execution
      ↓
    Progress

For each transition determine:

- user action;
- engine action;
- stored relationship;
- generated relationship;
- provenance retained;
- whether acceptance is required.

---

## B3. Determine whether Goals influence generation

Does the engine currently use Goals to decide:

- what candidates to create;
- how many candidates to create;
- their durations;
- their priorities;
- their preferred times;
- their frequency;
- whether they should be scheduled at all?

Or are Goals only metadata attached to independently authored scheduled work?

This distinction must be answered precisely.

---

## B4. Search for Allocation semantics

Search for structures or behavior corresponding to:

- allocation;
- budget;
- target minutes;
- target sessions;
- weekly effort;
- capacity share;
- goal weighting;
- goal priority;
- planned effort;
- desired effort;
- generated work demand.

Determine whether any existing model sits between Goal and scheduled occurrence.

---

# 8. Part C — Proposal

## C1. Search for explicit Proposal concepts

Search production code, state, persistence, UI, tests, and documentation-facing implementation references for concepts including:

- proposal;
- proposed;
- recommendation;
- candidate;
- suggested;
- suggestion;
- draft plan;
- plan decision;
- pending decision;
- preview;
- generated plan;
- recommendation set;
- alternatives;
- acceptance;
- rejection;
- modification.

Do not treat matching terminology as proof.

Trace behavior.

---

## C2. What does Generate Preview actually mean?

The current implementation historically uses generated preview concepts.

Determine:

1. What inputs generate a preview?
2. Is the preview authoritative?
3. Does it contain scheduled blocks?
4. Does generating it mutate authored truth?
5. Can it be rejected as a whole?
6. Can individual elements be accepted?
7. Does any acceptance step occur before scheduling?
8. Does preview represent a Proposal, merely a visualization, or generated schedule state?
9. What happens after regeneration?
10. What happens when authored setup changes?

This is a central audit path.

Do not assume that "preview" equals Proposal.

---

## C3. Trace PlanDecision

Audit all PlanDecision-related types, state, actions, persistence, applicability logic, replay behavior, and tests.

Determine:

- what creates a PlanDecision;
- what it refers to;
- whether it represents proactive planning or corrective recovery;
- whether it precedes scheduling;
- whether it can accept/reject/modify generated recommendations;
- whether it is occurrence-scoped or pattern-scoped;
- whether it affects future generation;
- whether it retains provenance.

---

## C4. Trace Accepted Choices

Determine:

- how Accepted Choices are represented;
- what creates them;
- whether all originate from Friction;
- whether any originate from ordinary planning;
- whether they can exist before friction;
- whether they alter candidate generation;
- whether they alter placement;
- whether they survive regeneration;
- how applicability is computed;
- whether they can be blocked;
- whether they are versioned or source-incarnation-aware.

---

## C5. Is there any pre-scheduling user authorization?

This is the central Proposal question.

Search for any point where:

1. the engine recommends discretionary work;
2. the recommendation is not yet treated as scheduled;
3. the user must make a decision;
4. only an accepted decision enters scheduling.

If such a pathway exists, trace it end to end.

If none exists, state **Not Found**.

---

## C6. Does the engine currently make assumptions on behalf of the user?

Identify every path where generated activity can enter the schedule without explicit per-plan authorization.

Distinguish carefully between:

- authored recurring Commitments that the user has already authorized;
- deterministic expansion of authored recurrence;
- placement of user-authored movable Commitments;
- engine-created Goal work;
- default/demo data;
- suggested fixes;
- manual events;
- generated Work.

The audit must not incorrectly characterize recurrence expansion of an explicitly authored Commitment as unauthorized engine behavior.

The key concern is **new discretionary planning decisions**.

---

## C7. Proposal conclusion

At the end of Part C, classify Proposal as one of:

### P1 — Explicitly Implemented

A provisional engine recommendation requiring user authorization before scheduling exists.

### P2 — Implemented Through Another Concept

Equivalent semantics exist under another model such as Preview or PlanDecision.

### P3 — Partially Implemented

Recommendation/decision infrastructure exists but not a complete pre-scheduling Proposal lifecycle.

### P4 — Friction-Only

The engine/user recommendation loop exists only for corrective friction resolution.

### P5 — Not Implemented

No general constructive Proposal lifecycle exists.

More than one classification may apply if carefully scoped.

---

# 9. Part D — Proposal vs Friction Boundary

This section is mandatory.

## D1. Trace Friction end to end

Document:

    Scheduled/Attempted Plan
        ↓
    Friction Detection
        ↓
    Suggested Fix Generation
        ↓
    User Decision
        ↓
    Accepted Choice
        ↓
    Application / Blocked State
        ↓
    Regenerated/Revised Schedule

Identify the concrete production symbols implementing every transition.

---

## D2. Identify reusable infrastructure

Determine whether Proposal could theoretically reuse existing technical machinery for:

- recommendation identity;
- alternatives;
- decision state;
- acceptance;
- rejection;
- modification;
- provenance;
- source incarnation;
- applicability;
- persistence;
- stale detection;
- replay;
- UI presentation.

This is an implementation observation only.

Do **not** recommend reuse merely because structures look similar.

Report compatibility and incompatibility.

---

## D3. Preserve semantic distinction

Explicitly document anything that would make Friction unsuitable as the Proposal domain model.

Examples may include:

- requiring an existing conflict;
- assuming a scheduled occurrence already exists;
- fix-specific payloads;
- move/shorten semantics;
- friction-point IDs;
- conflict provenance;
- applicability rules tied to generated blocks.

The final report must not suggest that Proposal should simply be renamed Friction.

---

# 10. Part E — Authority and State Transitions

## E1. Build the current authority chain

Using production evidence, diagram the actual current lifecycle from authored state through generation.

Example shape only:

    Authored State
        ↓
    Candidate Generation
        ↓
    Placement
        ↓
    Preview
        ↓
    Friction
        ↓
    Accepted Choice
        ↓
    Revised Preview
        ↓
    Execution
        ↓
    History

Replace this with implemented truth.

---

## E2. Identify authority transitions

For every transition, determine whether the resulting data is:

- authored;
- derived;
- proposed;
- accepted;
- generated;
- historical.

Identify places where these categories are currently conflated.

---

## E3. Determine whether "scheduled" currently means "authorized"

Dogfood Pass 01 raised a central epistemic concern.

Does an engine-generated scheduled block represent:

- user-authored intent;
- deterministic expansion of already-authorized intent;
- or a new engine decision?

Document this by source type.

A matrix is required:

| Scheduled Source | User Authored? | Engine Derived? | Requires New Acceptance? | Why? | Evidence |
|---|---:|---:|---:|---|---|

---

# 11. Part F — Persistence and Lifecycle

Determine whether any Capacity-, Proposal-, Allocation-, PlanDecision-, Accepted Choice-, or Goal-related state is persisted.

For each relevant object report:

| Concept | Persisted? | Storage | Rehydrated? | Versioned? | Invalidated/Staled? | Historical? |
|---|---:|---|---:|---:|---:|---:|

Inspect:

- main state persistence;
- profiles;
- backup/restore;
- source incarnation/version semantics;
- historical plans;
- execution history.

---

# 12. Part G — UI Exposure

Dogfood Pass 01 is specifically evidence about the observable product.

Inventory every current UI surface that exposes concepts related to:

- Capacity;
- Goals;
- allocation;
- recommendations;
- proposals;
- preview;
- accepted decisions;
- friction;
- Summary.

For each surface answer:

1. What does the user see?
2. What authority does the user exercise?
3. What engine state is represented?
4. Does the terminology match actual semantics?
5. Is the capability primary, advanced, legacy, or buried?
6. Could a reasonable user discover it without implementation knowledge?

Do not make aesthetic redesign recommendations in this audit.

---

# 13. Required End-to-End Traces

The audit must produce at least the following traces.

## Trace 1 — Commitment to occupied schedule

Follow one authored recurring Commitment from storage through candidate generation, placement, preview/schedule representation, execution/history if applicable.

---

## Trace 2 — Goal to Progress

Follow one Goal from creation through association, scheduled activity, execution input, and Progress/Summary.

Explicitly identify any manual bridge.

---

## Trace 3 — Available opening calculation

Follow one scheduling day from occupied blocks to the calculation used to find an available placement opening.

Determine whether this calculation qualifies as Capacity or only geometric availability.

---

## Trace 4 — Friction decision

Follow one conflict from detection through suggested fix, acceptance, persistence, applicability, and revised schedule.

---

## Trace 5 — Candidate Proposal path

Attempt to identify an end-to-end constructive Proposal path:

    Capacity
        ↓
    Goal
        ↓
    Engine Recommendation
        ↓
    User Decision
        ↓
    Accepted Allocation
        ↓
    Schedule

If any transition does not exist, stop at that boundary and mark it **Not Found**.

Do not synthesize missing transitions.

---

# 14. Required Matrices

The final report must include all of the following.

## Matrix A — Capacity Candidate Mechanisms

| Mechanism | Computes Free Time? | Accounts for Constraints? | Goal-Aware? | User-Facing? | Capacity Equivalent? | Evidence |
|---|---:|---:|---:|---:|---|---|

---

## Matrix B — Planning Authority

| Concept | Authored by User | Derived by Engine | Proposed by Engine | Requires Acceptance | Persists | Historical |
|---|---:|---:|---:|---:|---:|---:|

Include at minimum:

- Commitment;
- Goal;
- candidate;
- scheduled block;
- manual event;
- Work;
- preview;
- PlanDecision;
- FrictionPoint;
- SuggestedFix;
- AcceptedChoice;
- execution record;
- historical plan.

---

## Matrix C — Goal Provenance

| Stage | Current Mechanism | User or Engine | Automatic or Manual | Evidence |
|---|---|---|---|---|

---

## Matrix D — Proposal vs Friction

| Property | Proposal | Friction | Current Implementation Evidence |
|---|---|---|---|
| Purpose | Constructive | Corrective | |
| Trigger | Available Capacity / planning need | Conflict | |
| Requires existing scheduled conflict | No | Yes | |
| Engine recommends | Planned use of Capacity | Recovery action | |
| User authority | Accept/modify/reject | Accept/modify/reject recovery | |
| Result | Authorized allocation | Revised plan | |
| Current implementation status | | | |

The Proposal column describes the approved semantic target.

The implementation-evidence column must report current truth.

---

# 15. Test Coverage Assessment

Locate and evaluate tests covering:

- scheduling availability/openings;
- candidate generation;
- placement;
- Goals;
- Goal associations;
- Progress;
- Summary;
- PlanDecision;
- Accepted Choices;
- Friction;
- suggested fixes;
- preview generation;
- preview staleness;
- persistence;
- replay/applicability;
- history.

For every deterministic architectural claim, identify whether a test proves it.

Separate:

- well-covered behavior;
- weakly covered behavior;
- untested behavior;
- behavior with tests that encode obsolete semantics.

Do not change tests.

---

# 16. Required Report Structure

Produce `CAPACITY_PROPOSAL_IMPLEMENTATION_ALIGNMENT_AUDIT.md` with exactly these major sections:

1. **Executive Findings**
2. **Current Implemented Planning Lifecycle**
3. **Capacity Audit**
4. **Goal and Allocation Audit**
5. **Proposal Audit**
6. **Friction Boundary Audit**
7. **Authority and State Transition Audit**
8. **Persistence and Lifecycle Audit**
9. **UI Exposure Audit**
10. **End-to-End Traces**
11. **Required Matrices**
12. **Test Coverage Assessment**
13. **Confirmed Architectural Strengths**
14. **Partial or Disconnected Paths**
15. **Not Found**
16. **Implementation-Architecture Conflicts**
17. **Open Questions**
18. **Audit Conclusions**
19. **Recommended Follow-Up Audits**

---

# 17. Executive Findings Requirements

The Executive Findings must answer, in concise form:

### Capacity

- Does a coherent Capacity model currently exist?
- Is it explicit, implicit, partial, UI-disconnected, or absent?
- What is the closest existing implementation?
- Is current "availability" merely geometric placement space?

### Proposal

- Does a general constructive Proposal lifecycle currently exist?
- Is Preview functioning as Proposal?
- Is PlanDecision functioning as Proposal?
- Does user acceptance occur before discretionary scheduling?
- Is recommendation/acceptance currently limited to Friction?

### Integration

- Do Goals currently consume Capacity?
- Does the engine currently allocate Capacity among Goals?
- Does the user currently authorize such allocations?
- Where exactly does the intended lifecycle first break?

---

# 18. Critical Invariants to Evaluate

The audit must explicitly evaluate the implementation against these provisional invariants.

## INV-01

**Commitments own time.**

Determine whether current code preserves this meaning or uses broader/narrower semantics.

---

## INV-02

**Goals do not inherently own time.**

Determine whether Goal existence currently creates schedule demand.

---

## INV-03

**Capacity is derived, not manually authored as calendar blocks.**

Determine whether anything equivalent exists.

---

## INV-04

**DayFrame may reason about Capacity without silently converting that reasoning into user intent.**

Determine whether current scheduling violates, preserves, or does not implement this boundary.

---

## INV-05

**Constructive Proposal requires user authority before new discretionary allocations become scheduled work.**

Determine current implementation status.

---

## INV-06

**Friction is corrective and remains distinct from constructive Proposal.**

Determine whether current code preserves this distinction.

---

## INV-07

**Deterministic expansion of previously authorized recurring Commitments does not require repeated Proposal acceptance.**

Do not incorrectly classify recurrence expansion as unauthorized automation.

---

## INV-08

**Engine-generated recommendations and user-authorized decisions must remain distinguishable in provenance.**

Determine current implementation support.

---

# 19. Non-Goals

This audit must not:

- design the final Capacity algorithm;
- decide how many hours a Goal should receive;
- introduce AI/ML scheduling;
- redesign Planner UI;
- implement Proposal;
- implement Capacity;
- implement Goal allocation;
- implement bulk friction recovery;
- redesign Accepted Choices;
- redesign Summary;
- choose cloud/archive infrastructure;
- change schemas;
- change tests;
- write migration plans;
- assign implementation task numbers.

Those activities occur only after implemented truth is established.

---

# 20. Follow-Up Decision Gate

At audit completion, explicitly recommend which of the following should happen next.

### Path A — Reconnection

Use when Capacity and/or Proposal substantially exist but are disconnected from current UX or planning flow.

### Path B — Completion

Use when meaningful pieces exist but core lifecycle transitions are missing.

### Path C — New Architecture/Implementation

Use when the concepts are genuinely absent and must be designed before implementation.

### Path D — Split Follow-Up

Use when Capacity and Proposal are at materially different implementation maturity levels and should proceed separately.

Do not select a path based on desired architecture.

Select it based on evidence.

---

# 21. Completion Criteria

This audit is complete only when:

- Capacity has been traced semantically rather than by keyword alone;
- all plausible Capacity-like calculations have been evaluated;
- Goal-to-schedule provenance has been traced;
- all plausible Proposal-like structures have been evaluated;
- Preview has been explicitly classified;
- PlanDecision has been explicitly classified;
- Accepted Choices have been explicitly classified;
- Friction has been traced end to end;
- Proposal and Friction have been compared without conflation;
- the current authority lifecycle has been diagrammed;
- persistence has been inspected;
- UI exposure has been inventoried;
- required matrices are complete;
- deterministic claims cite tests where available;
- absence claims document targeted searches;
- Capacity receives a final C1–C5 classification;
- Proposal receives a final P1–P5 classification;
- and the audit identifies the exact first break between the intended planning lifecycle and implemented truth.

---

# 22. Final Completion Statement

End the completed audit with:

> **Capacity and Proposal Implementation Alignment Audit complete.**
>
> The report establishes implemented truth for DayFrame's current Capacity, Goal-allocation, Proposal, decision-authority, and Friction pathways without modifying the repository. Capacity and Proposal have been classified according to evidence, the first break in the intended planning lifecycle has been identified, and the project now has sufficient evidence to decide whether the next step is reconnection, completion, new architecture, or a split follow-up.