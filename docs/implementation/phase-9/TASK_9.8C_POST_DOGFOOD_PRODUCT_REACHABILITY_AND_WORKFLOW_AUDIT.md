# Task 9.8C — Post-Dogfood Product Reachability & Workflow Audit

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Read-only architecture / product-reachability / workflow audit  
**Implementation Changes:** **PROHIBITED**  
**Primary Input:** Current production code, production UI wiring, existing tests, Phase 8/9 architecture, and Dogfood Pass 02 findings  
**Required Durable Output:** `PHASE_9_TASK_9_8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md`

---

## 1. Objective

Perform a rigorous, evidence-based audit of the current DayFrame production system following **Dogfood Pass 02**.

The purpose of this task is to determine, before further convergence or two-surface UI migration work begins, which observed product gaps are:

1. **Implemented and product-reachable**
2. **Implemented but poorly exposed or difficult to discover**
3. **Implemented in application/domain code but not reachable from production UI**
4. **Partially implemented or disconnected across lifecycle boundaries**
5. **Genuinely not implemented**
6. **Exposed but behaviorally incorrect**
7. **Legacy/transitional UI that should likely be retired rather than repaired**

The audit must specifically determine how much of the Phase 8/9 architecture already exists correctly underneath the current application shell and where ordinary user workflows stop reaching it.

The central audit question is:

> **Which DayFrame capabilities are genuinely missing, which are implemented but disconnected, and which only appear missing because the current or legacy UX does not expose them correctly?**

This task exists to prevent the next implementation phase from:

- rebuilding capabilities that already exist;
- polishing UI that will shortly be retired;
- designing a new Planner/Summary shell around disconnected application workflows;
- weakening established authority boundaries merely to make currently unreachable features appear to work;
- treating product-language or discoverability failures as domain-model failures;
- treating genuine correctness failures as cosmetic UX problems.

**No implementation work is authorized by this task.**

---

## 2. Governing Context

### 2.1 Architectural foundation

DayFrame is governed by the architecture established through Phase 8 and Phase 9.

The intended high-level lifecycle is:

```text
Teach
  ↓
Plan
  ↓
Live
  ↓
Learn
```

The authority chain is:

```text
Authored
  ↓
Derived
  ↓
Proposed
  ↓
Accepted
  ↓
Scheduled / Realized
  ↓
Published
  ↓
Execution / Progress
  ↓
History
  ↓
Learned
  ↓
Explicit Preference Change
```

These authority distinctions must not be collapsed merely because the current UI makes them difficult to reach.

Relevant established architectural distinctions include:

- Goal outcome is independent from scheduling.
- Goal Structure represents decomposition.
- Demand represents planning intent and does not own time.
- Projection is derived.
- Priority is authored.
- Capacity is deterministic and demand-neutral.
- Allocation is provisional.
- Proposal is non-authoritative.
- Accepted Allocation represents bounded accepted authority.
- Realization converts accepted allocation into actual schedule ownership.
- Work, Commitments, realized Goal work, and real support activities may own time.
- Buffers protect time but are not activities.
- Capacity, Demand, Allocation, and Proposal do not own schedule time.
- Feasibility evaluates possibility without ranking.
- Competition between demands is not Friction.
- Friction represents actual incompatibility in schedule geometry.
- Suggested Fix is corrective and is not a constructive Proposal.
- Preview is disposable derived state.
- Publication is explicit and produces bounded immutable plan truth.
- Execution records what actually occurred.
- Progress is distinct from execution.
- History is durable.
- Learned behavior has lower authority than explicit user preference.
- Stale derived state must never become authority.
- Direct user actions remain valid without requiring a Proposal.

The audit must preserve these distinctions.

---

## 3. Dogfood Pass 02 Product Context

Dogfood Pass 02 demonstrated that the production application currently exposes substantially different levels of maturity across its workflows.

### 3.1 Commitment / schedule path

The ordinary user can substantially reach:

```text
Authored Commitments
  ↓
Schedule Generation
  ↓
Placement
  ↓
Friction
  ↓
Suggested Fix / Resolution
```

However, multiple correctness and reachability problems were observed, particularly around:

- work-relative placement;
- Sleep;
- Day Boundaries;
- cycle transitions;
- Friction resolution;
- the legacy date-tower Review interface.

### 3.2 Goal / constructive planning path

Dogfooding demonstrated that a user can reach significantly more of the constructive planning architecture than initially appeared possible:

```text
Goal
  ↓
Planning Intent / Demand
  ↓
Planning Evaluation
  ↓
Proposal
  ↓
Proposal Decision
  ↓
Accepted Allocation
  ↓
Realization
  ↓
Scheduled Goal Work
```

Dogfood Pass 02 successfully exercised:

- creation of a Network+ Goal;
- finite planning intent;
- planning evaluation;
- constructive Proposal generation;
- multiple unaccepted Proposals for the same Goal;
- acceptance of multiple Proposals;
- realization of accepted Goal work;
- modification of planning intent;
- replacement of previously realized geometry after the authored dates changed;
- support activity creation;
- protected buffer creation.

This establishes that substantial Phase 8/9 architecture exists in production.

It does **not** establish that the complete workflow is coherent, discoverable, correctly identified, correctly persisted, correctly published, or usable by an ordinary user.

### 3.3 Publication / Live / Learn path

Dogfood Pass 02 was unable to complete the full lifecycle through Today, execution reporting, Progress, Summary, and History.

The pass ended after the application entered a state where:

- publication reported failure;
- Today reported that published-plan evidence was protected and unavailable pending `HistoricalPlan` recovery;
- Summary reported that history was protected until stored historical authority could be recovered safely;
- the user could no longer reach the ordinary Today interaction path needed to report actual outcomes;
- therefore execution → Progress → Summary → History could not be fully dogfooded.

This is an audit target, not an invitation to bypass the protection.

The audit must determine whether this stopping point represents:

- a correct safety boundary around corrupted/inconsistent historical authority;
- an implementation defect;
- a disconnected recovery workflow;
- a missing user-facing recovery workflow;
- a legacy-shell problem;
- or some combination of these.

---

## 4. Intended Product Convergence

The current working product direction is toward two primary surfaces:

```text
Planner
Summary
```

### Planner

Planner is expected to become the primary place where users understand and manipulate future/current planning.

The current working mental model is approximately:

```text
Planner
├── Calendar / Month
├── Day Worksurface
├── My Schedule
│   ├── Work Pattern
│   └── Commitments
├── Goals
└── Review Plan / Resolve Friction
```

`Today` is expected to become a temporal destination within Planner rather than an independent top-level information architecture destination.

> **Today is a destination in time, not a destination in the information architecture.**

The current `Selected DayFrame Day`, `Today`, and `Canonical Planning Review` surfaces appear to contain overlapping pieces of a future reusable **Day Worksurface**.

### Summary

Summary is expected to organize retrospective and aggregate information such as:

- Capacity;
- Goals;
- Allocations;
- Progress;
- Recommendations;
- execution history;
- plan history;
- drill-down into relevant days and underlying evidence.

This task must **not implement this migration**.

It must determine which existing components and workflows should feed it and which current surfaces are transitional, duplicated, disconnected, obsolete, or genuinely canonical.

---

## 5. Audit Evidence Standard

Every substantive conclusion must be classified as one of:

### Confirmed

Directly demonstrated by production code, actual production UI wiring, persisted-state behavior, or deterministic test coverage.

### Inferred

Strongly suggested by evidence but not conclusively established.

### Not Found

No supporting production implementation or wiring was located after reasonable tracing.

Do not infer behavior from:

- filenames;
- component names;
- comments;
- type names;
- architecture documents alone;
- tests alone.

Tests may corroborate production behavior but must not substitute for tracing the production path.

For claims of **product reachability**, trace the actual production path.

A feature is not product-reachable merely because:

- a domain function exists;
- a store action exists;
- a component exists but is never rendered;
- a test calls the function;
- a debug route exposes it;
- a test harness exposes it;
- state can be manipulated through developer tools.

For this audit:

> **Ordinary-user reachable means a user can discover and complete the path through the production UI without developer tools, direct store manipulation, hidden/debug routes, test harnesses, or knowledge of internal architecture.**

Evidence should identify, where practical:

```text
file
symbol
relevant line/range
production caller
production consumer
test corroboration
```

Line numbers are evidence snapshots and may drift later; symbol and file identity remain required.

---

## 6. Required End-to-End Lifecycle Audit

Trace the following lifecycle through actual production code:

```text
Goal
  ↓
Goal Structure
  ↓
Demand
  ↓
Priority
  ↓
Capacity
  ↓
Feasibility
  ↓
Competition
  ↓
Allocation
  ↓
Proposal
  ↓
Proposal Decision
  ↓
Accepted Allocation
  ↓
Realization
  ↓
Schedule
  ↓
Review
  ↓
Publication
  ↓
Execution
  ↓
Progress
  ↓
History
```

For **every stage**, determine:

1. Does the architectural/domain capability exist?
2. Is it implemented in production code?
3. What command/query/service/store path owns it?
4. What state is authored?
5. What state is derived?
6. What state persists?
7. What state is immutable authority?
8. What upstream stage supplies it?
9. What downstream stage consumes it?
10. Is there a production UI entry point?
11. Is that entry point discoverable?
12. Can an ordinary user complete the workflow?
13. Does the UI communicate the result intelligibly?
14. Does existing test coverage prove deterministic or authority-sensitive behavior?
15. Where does the lifecycle become disconnected, if anywhere?

Do not stop tracing merely because a domain object exists.

---

## 7. Required Reachability Classification

Use the following canonical classifications.

### A. Implemented + Reachable

The production capability exists and an ordinary user can successfully reach and complete it.

### B. Implemented + Disconnected

The capability exists, but its upstream or downstream lifecycle connection is missing or broken.

### C. Implemented + UX-Inaccessible

The capability exists and may be wired, but an ordinary user cannot reasonably discover or invoke it through the production UX.

### D. Partially Implemented

Some required lifecycle behavior exists, but the capability is materially incomplete.

### E. Not Implemented

No production implementation was found.

### F. Exposed but Incorrect

The UI exposes the capability, but observed or traced behavior violates intended semantics.

### G. Legacy / Transitional

The capability or surface exists primarily because of the old shell or migration history and should be evaluated as a retirement/convergence candidate rather than automatically repaired in place.

Use one primary classification per audited capability and note secondary conditions where necessary.

---

## 8. Workstream A — Goal → Constructive Planning Reachability

Trace the exact production path used during Dogfood Pass 02:

```text
Goal
  ↓
Planning Intent
  ↓
Evaluation
  ↓
Proposal
  ↓
Decision
  ↓
Accepted Allocation
  ↓
Realization
  ↓
Scheduled Goal Work
```

Determine specifically:

- how Goal planning intent becomes Demand;
- whether Goal Structure is reachable from the current Goal UX;
- where Priority enters evaluation;
- how Capacity is computed;
- how Feasibility is evaluated;
- how competing Goals participate;
- how Proposals are generated;
- whether multiple Proposals for the same Goal are intentionally allowed;
- how Proposal identity is maintained;
- how accepted Proposal identity survives into Accepted Allocation;
- how Accepted Allocation identity survives Realization;
- how realized Goal work retains provenance;
- whether separate accepted iterations can later be distinguished;
- whether multiple accepted allocations are being semantically combined or merely visually grouped;
- whether the UI currently hides distinctions that remain intact in domain state;
- how changed Goal/planning dates invalidate or replace previously realized geometry;
- whether obsolete realized intervals are correctly removed;
- whether publication treats unresolved Proposals as blockers;
- whether this blocking behavior is intentional architecture or incidental UI policy.

Dogfood Pass 02 specifically observed two Network+ Proposals:

- an initial 10-hour planning request;
- a later 20-hour planning request.

Both were accepted.

The resulting UI appeared to represent approximately 30 hours of Network+ Goal work without making the separate accepted iterations readily inspectable.

Audit whether the underlying identities remain distinct.

Do **not** conclude that the engine merged them merely because the UI grouped them.

---

## 9. Workstream B — Goal Authoring and Planning Expressiveness

Audit the current Goal/planning authoring model against capabilities already present in the domain.

Dogfood Pass 02 observed:

- requested effort primarily expressed as total hours/minutes;
- no obvious first-class authoring path such as “N sessions of X duration”;
- session minimum/maximum controls exist;
- scheduling controls are substantially less intuitive than Commitment recurrence controls;
- planning requests can become extremely large in the UI;
- Goal work lists can become extremely long;
- Proposal output can become difficult to parse;
- Goal titles are absent from some selected-day planning cards;
- multiple realized iterations cannot be readily investigated;
- numeric inputs exhibit the familiar leading-zero editing problem seen previously elsewhere.

Determine which of these are:

- missing domain capabilities;
- existing domain capabilities without authoring controls;
- merely presentation problems;
- old-shell problems;
- genuine correctness defects.

Specifically inspect whether the architecture can already represent:

```text
total effort
session duration
minimum session duration
maximum session duration
required minimum vs target
allow less than requested effort
session-count requirements
planning priority
support activity
protected time
resource footprint
```

Do not design new recurrence semantics during this audit.

Identify whether recurring Goal Demand is already represented, partially represented, or genuinely absent.

Maintain the architectural distinction:

> **Goal Demand recurrence is not automatically Commitment recurrence.**

---

## 10. Workstream C — Commitment Placement and Work-Relative Correctness

Trace Commitment placement from authored recurrence through candidate generation and final placement.

Dogfood Pass 02 established several concrete behaviors requiring exact audit.

### 10.1 `beforeWork`

Observed behavior:

> `beforeWork` systematically placed Workout inside the Work interval rather than before actual Work.

This occurred across tested shifts.

Trace:

```text
Commitment
  ↓
recurrence
  ↓
candidate
  ↓
user-day context
  ↓
Work lookup
  ↓
beforeWork anchor
  ↓
opening search
  ↓
placement
```

Determine exactly where the wrong temporal reference enters the calculation.

The intended invariant is:

> A `beforeWork` Commitment must resolve against the actual relevant Work start and must never be placed inside Work. If no valid opening exists, it must remain unplaced rather than violate Work ownership.

### 10.2 `afterWork`

Observed behavior:

- `afterWork` worked outside Night Shift;
- `afterWork` failed on every tested Night Shift occurrence by being unable to place Workout.

Trace the Night Shift path separately from Day/Evening Shift.

### 10.3 `Any Available`

Dogfood testing observed no Friction for the tested Any Available Workout configuration.

Determine whether this establishes correct generic placement or only that the tested geometry happened to fit.

### 10.4 Friction ownership

Observed Friction correctly identified:

- Work as locked;
- Workout as flexible.

Determine whether authority/ownership classification is correct while placement context is defective.

---

## 11. Workstream D — Sleep as a First-Class Scheduling Object

Dogfood Pass 02 produced enough repeated Sleep failures that Sleep must receive a dedicated audit rather than being treated as an ordinary Commitment edge case.

The product requirement emerging from dogfooding is:

> **Sleep is a biological requirement and should be treated as a first-class schedule concern comparable in importance to Work. Sleep should not become unplaceable merely because lower-authority flexible activities occupy candidate time. Except for genuinely immovable Work constraints and explicit user decisions, ordinary flexible planning should move around required Sleep.**

This task must determine what architectural changes would actually be required to support that product requirement.

Do **not** implement them.

Audit the current Sleep representation.

Determine:

- whether Sleep is currently merely a seeded Commitment/template;
- whether it has any special semantic identity;
- how Sleep priority is represented;
- how Sleep placement is derived;
- how Sleep interacts with Work;
- how Sleep interacts with other Commitments;
- how Sleep interacts with realized Goal work;
- how Sleep interacts with support activity and protected buffers;
- how Sleep interacts with Friction;
- whether Sleep can cross calendar midnight;
- whether Sleep can cross a DayFrame Day Boundary;
- whether candidate generation clips Sleep to a user-day;
- whether placement incorrectly requires Sleep to fit entirely inside one user-day;
- whether recurrence expansion causes cross-boundary duplication or omission.

Dogfood Pass 02 demonstrated:

- the configured noon Day Boundary worked as a DayFrame day boundary;
- changing the boundary to midnight created **11 Sleep Friction items**;
- Sleep could not be placed across the Day Boundary;
- ordinary human sleep frequently crosses midnight;
- this behavior contradicts the purpose of DayFrame's flexible user-day model.

The audit must identify the exact subsystem responsible.

### 11.1 Shift-transition Sleep edge case

A repeated transition defect was observed around transitions between Day Shift and Evening Shift.

Examples included:

- Friday, October 2, 2026;
- Friday, October 16, 2026.

On October 2, attempted Sleep resolution would not persist and Sleep ultimately had to be skipped to clear the Friction.

Trace:

```text
cycle segment transition
  ↓
effective schedule preferences
  ↓
user-day boundary
  ↓
Work context
  ↓
Sleep candidate
  ↓
placement
  ↓
Friction
  ↓
Suggested Fix
  ↓
accepted resolution
  ↓
regeneration
```

Determine whether the failure arises from:

- cycle transition context;
- boundary resolution;
- recurrence expansion;
- candidate identity;
- Suggested Fix identity;
- stale preview regeneration;
- placement;
- accepted-resolution persistence;
- or another cause.

Do not assume the observed symptom identifies the subsystem.

---

## 12. Workstream E — Day Boundary and User-Day Semantics

Audit the current canonical user-day implementation.

Dogfood Pass 02 confirmed that a noon Day Boundary can correctly keep early-calendar-date activity within the intended DayFrame day.

This behavior must be preserved.

At the same time, the boundary appears to create invalid restrictions for Sleep when moved to midnight.

Determine whether the implementation incorrectly conflates:

```text
ownership by canonical user-day
```

with:

```text
physical requirement that an interval cannot cross the boundary
```

Audit:

- user-day identity;
- interval ownership;
- interval clipping;
- recurrence expansion;
- display grouping;
- cross-boundary placement;
- Work crossing boundaries;
- Sleep crossing boundaries;
- manual events crossing boundaries;
- realized Goal work crossing boundaries;
- support/buffer intervals crossing boundaries.

Identify explicit invariants that must survive future convergence.

---

## 13. Workstream F — Friction and Resolution Reachability

Audit the complete Friction lifecycle:

```text
Schedule Geometry
  ↓
Friction Detection
  ↓
Friction Point
  ↓
Suggested Fix
  ↓
User Decision
  ↓
Applied Revision
  ↓
Regenerated Geometry
  ↓
Recomputed Friction
```

Dogfood Pass 02 observed:

- Friction itself can be generated;
- the current `Resolve schedule conflicts` control did not provide a practical centralized resolution workflow;
- actual resolution required navigating the old long-form date tower;
- repeated Friction across a range is extremely difficult to resolve;
- one Sleep resolution failed to persist;
- skipping Sleep could clear the error;
- accepted changes appear in a separate list disconnected from other Summary/history concepts.

Determine:

- which resolution commands are fully wired;
- which Suggested Fix types are actually executable;
- whether accepted fixes persist;
- whether regeneration preserves accepted decisions;
- whether accepted changes have durable identity;
- where accepted resolution history is stored;
- whether that history participates in Summary;
- whether it participates in plan history;
- whether it is merely preview/revision metadata;
- whether `Resolve schedule conflicts` is disconnected, incomplete, or simply routes to the legacy UX;
- whether bulk resolution can be supported by existing domain commands without silent replanning.

Maintain the invariant:

> Repeated Friction may justify a bulk interaction, but bulk interaction must still operate through explicit Friction → Suggested Fix → user decision semantics rather than silently rewriting the schedule.

---

## 14. Workstream G — Publication, Historical Authority, and Recovery

Trace publication end-to-end.

```text
Review Scope
  ↓
Readiness
  ↓
Explicit Publish Command
  ↓
Publication Validation
  ↓
Immutable Published Plan
  ↓
Historical Authority
  ↓
Today / Execution / Summary consumers
```

Dogfood Pass 02 reached a state where Review displayed:

- `Ready to publish`;
- `Publication coverage is unavailable`;
- publication then failed without changing schedule history.

Today subsequently displayed language equivalent to:

> Published plan evidence is protected and unavailable. Resolve HistoricalPlan recovery before relying on Today.

Summary displayed language equivalent to:

> History summary is protected until stored historical authority can be recovered safely.

Audit this exact state.

Determine:

1. What publication preconditions were considered satisfied?
2. Why could readiness report `Ready to publish` while publication still fail?
3. What does `Publication coverage is unavailable` mean internally?
4. What historical authority failed validation?
5. Is historical data actually malformed, stale, incompatible, incomplete, or merely unreachable?
6. Is recovery implemented?
7. Is recovery callable?
8. Is recovery product-reachable?
9. Is recovery intentionally manual?
10. Can the application explain the condition without exposing internal architecture terminology?
11. Does the protection correctly prevent destructive overwrite?
12. Is there a safe path back to a usable Today surface?
13. Does publication remain atomic on failure?
14. Was existing history preserved?
15. Is current generated schedule correctly independent from historical published truth?

**Do not bypass, delete, rewrite, migrate, or repair the user's stored history during this audit.**

This is a read-only trace.

---

## 15. Workstream H — Today → Execution → Progress → History

Dogfood Pass 02 could not complete this lifecycle because Today became unavailable behind historical-authority protection.

Audit whether the underlying workflow nevertheless exists.

Trace:

```text
Published Plan
  ↓
Today / Day Worksurface
  ↓
Execution Reporting
  ↓
Execution Evidence
  ↓
Progress Evidence
  ↓
Goal Progress
  ↓
Summary
  ↓
History
```

Determine:

- how Today selects plan truth;
- whether Today can use generated schedule when no publication exists;
- when it requires Published Plan;
- how scheduled Goal work appears;
- how completion is reported;
- how Commitment completion is reported;
- how Goal work completion becomes execution evidence;
- whether known duration can contribute to Goal Progress;
- whether Progress and Execution remain separate records;
- how historical days expose reporting;
- whether after-the-fact reporting is reachable;
- whether Summary aggregates execution;
- whether Summary aggregates Progress;
- whether History retains the relevant evidence.

Distinguish:

```text
capability exists
```

from:

```text
capability was unreachable during this dogfood state
```

---

## 16. Workstream I — Found Time and Goal Association

Audit the existing Found Time concept.

The intended conceptual distinction is:

```text
Scheduled Goal Work
    originates in planning / accepted allocation

Found Time
    originates in Live execution / opportunistic action
```

Both may eventually provide Progress evidence, but they are not the same origin.

Trace whether the current application supports:

```text
Manual Event
  ↓
Goal Association
  ↓
Execution Evidence
  ↓
Progress
```

and/or:

```text
Found Time
  ↓
Goal Association
  ↓
Execution Evidence
  ↓
Progress
```

Determine:

- whether manual events can currently associate with Goals;
- whether Found Time has a production model;
- whether Found Time is product-reachable;
- whether Goal-associated manual activity appears in Today;
- whether it contributes to Progress;
- whether duration can be derived from known event geometry;
- whether `Record New Value` currently assumes cumulative quantity accounting;
- whether duration-based progress can coexist with measured Goal progress without collapsing Activity and Progress evidence.

Do not invent a new model if the existing architecture already supports this distinction.

---

## 17. Workstream J — Planner / Month / Day Worksurface Reachability

Audit the current production surfaces related to planning.

At minimum inspect:

- Planner;
- Month;
- Selected DayFrame Day;
- Daily Workspace;
- Canonical Planning Review;
- Review Schedule;
- Today;
- Goals and Planning;
- Planning Range;
- Preview navigation.

For each, determine:

- what query/read model it consumes;
- what commands it exposes;
- whether it owns canonical behavior or merely adapts older behavior;
- whether it duplicates another surface;
- whether it exposes architectural/debug language;
- whether it should likely survive the Planner/Summary convergence.

Dogfood Pass 02 strongly suggested:

```text
Selected DayFrame Day
+ Today
+ Canonical Planning Review
≈ pieces of one future Day Worksurface
```

Audit this proposition against production wiring.

Do not treat it as proven merely because the UX looks duplicated.

---

## 18. Workstream K — Legacy Date-Tower / Preview Audit

Dogfood Pass 02 repeatedly encountered the legacy long-form schedule/date tower.

It became especially problematic when:

- planning ranges were large;
- Goal work generated many occurrences;
- Friction existed across many dates;
- Sleep required repeated resolution;
- the user needed to locate one specific date.

Audit the old Preview/Review path.

Determine:

- what production behavior still depends on it;
- whether any commands are only reachable through it;
- whether Friction resolution is only reachable through it;
- whether historical reporting is only reachable through it;
- whether selected-day navigation can replace its interaction responsibilities;
- whether the giant range rendering itself has any architectural necessity;
- which pieces are transitional adapters;
- which pieces remain canonical.

Do not spend implementation effort improving pagination, scrolling, or cosmetics during this task.

The question is whether the surface should survive at all.

---

## 19. Workstream L — Summary and Historical Information Architecture

Audit the current Summary implementation.

Dogfood Pass 02 observed:

- realization information;
- accepted-change information;
- historical information;
- execution/history protection;
- large lists of realized Goal work;
- architectural terminology;
- surfaces that appear disconnected from each other.

Determine:

- which Summary cards consume canonical queries;
- which consume raw/internal state;
- whether accepted Friction decisions belong in Summary;
- whether realized Goal work is represented as aggregate information or raw occurrence lists;
- whether Progress is available;
- whether execution history is available;
- whether plan history is available;
- whether drill-down targets already exist;
- whether Summary can navigate to a selected historical Day Worksurface;
- whether current lists scale;
- whether current empty-state surfaces add information.

The audit should distinguish:

```text
Summary data missing
```

from:

```text
Summary data exists but is presented as raw architecture/state
```

---

## 20. Workstream M — Product Language / Architectural Language Bleed-Through

Dogfood Pass 02 repeatedly exposed internal architectural language directly to the user.

Audit visible production strings including, but not limited to:

```text
Canonical Planning Review
Selected-day planning truth
HistoricalPlan
published plan evidence
stored historical authority
realization
generated
template
planning range
allocation
proposal
unplaced
friction
publication coverage
```

Do not assume every architectural term is inappropriate.

Classify each as:

- valid user-facing product language;
- understandable with minor contextual wording;
- architecture leakage;
- debug/recovery terminology;
- legacy terminology;
- terminology requiring product-level replacement.

Pay particular attention to error states.

A user-facing error should explain:

```text
what happened
what is protected
what the user can do next
```

without requiring the user to understand DayFrame's internal authority model.

---

## 21. Workstream N — Work Pattern and Schedule Authoring Reachability

Audit the current Work Pattern model and its relationship to the older repeating-sequence model.

Dogfood Pass 02 observed what appeared to be two generations of Work configuration:

- older repeating sequence concepts;
- newer dated cycle/segment concepts.

Determine:

- which model is canonical;
- whether both remain production-active;
- whether one adapts into the other;
- whether old configuration can be retired;
- how effective Day Boundary is resolved;
- how effective week start is resolved;
- whether cycle/segment overrides work;
- whether different cycles can use different week starts;
- how cycle transitions are represented.

Also identify whether long rotations currently require impractical one-day-at-a-time authoring despite domain support for more efficient representation.

Do not implement bulk editing.

---

## 22. Required Dogfood Finding Disposition

The audit must account for all major Dogfood Pass 02 findings rather than auditing only the most dramatic failures.

Use these categories:

### Category 1 — Correctness Defects

Examples:

- `beforeWork` placement inside Work;
- `afterWork` Night Shift failure;
- Sleep crossing/boundary failure;
- non-persistent Sleep resolution;
- invalid placement geometry.

### Category 2 — Product Reachability

Examples:

- Proposal initially difficult to discover;
- Capacity not meaningfully represented;
- Goal → Plan workflow hidden inside Goal editing;
- Found Time → Progress disconnected or invisible;
- publication/history recovery unreachable.

### Category 3 — Authoring / Interaction

Examples:

- long Work rotations;
- duration input;
- Goal access;
- Goal effort/session authoring;
- recurrence controls;
- contextual Commitment editing;
- historical reporting;
- leading-zero numeric inputs.

### Category 4 — Old Shell / Migration

Examples:

- giant Preview/date tower;
- Today duplication;
- Selected DayFrame Day duplication;
- Canonical Planning Review;
- repeated navigation;
- raw architectural language;
- giant Summary lists.

### Category 5 — Product Evolution

Examples:

- rolling/live calendar;
- holiday/calendar facts;
- ongoing Goals;
- recurring Goal Demand;
- My Schedule hierarchy;
- Planner/Day convergence;
- richer Goal planning authoring.

**Do not automatically convert Category 5 findings into bug fixes.**

The RESULT must clearly separate:

```text
fix existing behavior
connect existing behavior
expose existing behavior
retire legacy behavior
design genuinely new behavior
```

---

## 23. Required Lifecycle Reachability Matrix

Produce a matrix with at least these columns:

| Stage / Capability | Domain Implementation | Production Command / Query | Persistence / Authority | Production UI Entry | Ordinary-User Reachable? | Tests | Classification | Evidence | Gap |
|---|---|---|---|---|---|---|---|---|---|

Include at minimum:

- Goal
- Goal Structure
- Demand
- Priority
- Capacity
- Feasibility
- Competition
- Allocation
- Proposal
- Proposal Decision
- Accepted Allocation
- Realization
- Scheduled Goal Work
- Support Activity
- Protected Buffer
- Review
- Friction
- Suggested Fix
- Accepted Friction Decision
- Publication
- Published Plan
- Today
- Execution
- Progress
- Found Time
- Summary
- History

---

## 24. Required UI Surface Ownership Matrix

Produce a second matrix:

| Surface / Component | Current Purpose | Data / Query Source | Commands Exposed | Canonical / Transitional / Legacy / Debug | Reachability Problems | Likely Planner / Summary Disposition | Evidence |
|---|---|---|---|---|---|---|---|

Include at minimum:

- Planner
- Month
- Selected DayFrame Day
- Daily Workspace
- Goals and Planning
- Review Schedule
- Canonical Planning Review
- legacy date-tower Preview
- Today
- Summary
- History
- Planning Range controls
- Work Pattern setup
- Commitment setup

`Likely Planner / Summary Disposition` is an audit recommendation only.

Do not implement or fully redesign the destination UI.

---

## 25. Required Correctness Trace Matrix

Produce a dedicated placement/correctness matrix.

At minimum include:

| Scenario | Expected | Observed Dogfood Behavior | Production Path | Root Cause Status | Evidence |
|---|---|---|---|---|---|
| Workout beforeWork — Day Shift | Before Work | Inside Work | Trace | Confirmed/Inferred/Not Found | Evidence |
| Workout beforeWork — Evening Shift | Before Work | Inside Work | Trace | ... | ... |
| Workout beforeWork — Night Shift | Before Work | Inside Work | Trace | ... | ... |
| Workout afterWork — non-Night | After Work | Worked | Trace | ... | ... |
| Workout afterWork — Night Shift | After Work | Unplaced | Trace | ... | ... |
| Workout Any Available | Valid opening | No Friction observed | Trace | ... | ... |
| Sleep crossing midnight | Continuous Sleep | Friction/unplaced under tested boundary | Trace | ... | ... |
| Sleep crossing Day Boundary | Continuous Sleep | Cannot cross | Trace | ... | ... |
| Sleep at cycle transition | Valid Sleep | Repeated transition failure | Trace | ... | ... |
| Accepted Sleep fix regeneration | Decision persists | One observed failure to persist | Trace | ... | ... |

Important:

> The earlier count of approximately 18 repeated failures referred to the tested `afterWork` Night Shift failures. Do not incorrectly attribute that count to `beforeWork`.

---

## 26. Required Missing / Disconnected Capability Matrix

Produce:

| Capability | Exists? | Connected? | UI Reachable? | Correct? | Classification | Minimum Missing Link | Evidence |
|---|---|---|---|---|---|---|---|

This matrix should make it possible to distinguish:

```text
missing architecture
```

from:

```text
missing application wiring
```

from:

```text
missing UX
```

from:

```text
incorrect implementation
```

---

## 27. Required Authority and Persistence Assessment

For every major object involved in the audited workflows, identify:

- semantic owner;
- source of truth;
- persistence location;
- mutability;
- whether derived;
- whether disposable;
- whether immutable;
- invalidation mechanism;
- freshness mechanism;
- downstream authority.

At minimum inspect:

```text
Goal
Goal Structure
Demand
Priority
Projection
Capacity
Feasibility result
Allocation
Proposal
Proposal Decision
Accepted Allocation
Realization
scheduled Goal work
Commitment
Sleep
Work
Friction
Suggested Fix
accepted revision
Preview
Published Plan
Execution
Progress
History
Found Time
```

Flag any case where:

- two stores appear authoritative for the same semantic object;
- derived state is persisted as if authoritative;
- stale state can drive authority;
- accepted state loses provenance;
- history can be mutated accidentally;
- UI state is masquerading as domain state.

Do not change schemas.

---

## 28. Required Architectural Invariants

The RESULT must explicitly state whether current production behavior preserves or violates each applicable invariant.

At minimum evaluate:

1. Authored state is authoritative over derived state.
2. Derived state may be regenerated.
3. Proposal does not own schedule time.
4. Accepted Allocation does not own schedule time until Realization.
5. Realization creates actual schedule ownership.
6. Work ownership is not displaced by ordinary flexible planning.
7. Required Sleep must not be made impossible by lower-authority flexible planning.
8. Buffers protect time but are not executable activities.
9. Support activity and protected buffer remain distinct.
10. Friction represents incompatibility, not ordinary demand competition.
11. Suggested Fix does not become authority without explicit user decision.
12. Publication remains explicit.
13. Failed publication does not partially mutate history.
14. Published history is immutable bounded truth.
15. Execution remains distinct from Progress.
16. Found Time remains distinguishable from originally scheduled Goal work.
17. Canonical user-day identity remains independent from calendar midnight.
18. Crossing a Day Boundary does not inherently imply an activity is invalid.
19. Preview remains disposable.
20. Stale derived state cannot become authority.
21. Direct user actions remain valid without requiring constructive Proposal generation.
22. Multiple accepted allocations retain sufficient provenance to explain why realized work exists.

If an invariant is newly implied by Dogfood Pass 02 rather than already formally established, label it accordingly.

---

## 29. Required Partial / Disconnected Path Analysis

Identify every significant path that currently terminates prematurely.

Examples may include:

```text
Goal Structure → ?
Found Time → ?
Accepted Fix → Summary?
Published Plan recovery → ?
Historical Day → outcome reporting?
Goal-associated Manual Event → Progress?
Capacity → understandable user representation?
Selected Day → complete Day Worksurface?
Resolve schedule conflicts → actual resolution workflow?
```

For each disconnected path, identify the **smallest missing connection**.

Do not automatically propose a new subsystem.

Prefer findings such as:

```text
Existing query is not consumed by production surface X.
```

over:

```text
Build a new history engine.
```

unless evidence proves the capability genuinely does not exist.

---

## 30. Required Test Coverage Assessment

Inspect existing tests relevant to:

- Goal Structure;
- Demand;
- Capacity;
- Feasibility;
- competition;
- Proposal generation;
- Proposal decision;
- accepted allocation;
- realization;
- resource footprint;
- Planner;
- Review Scope;
- publication;
- historical authority;
- Today;
- Execution;
- Progress;
- placement;
- work-relative placement;
- Sleep;
- Day Boundary;
- Friction;
- Suggested Fix;
- persistence;
- rehydration.

Classify important behavior as:

```text
production traced + tested
production traced but weakly tested
tested but production reachability unproven
production implementation found without meaningful tests
not found
```

Pay special attention to the distinction exposed by Phase 9:

> A capability may be fully tested and implementation-reachable while still being difficult or effectively impossible for an ordinary user to discover.

---

## 31. Validation

This is a read-only audit.

Permitted actions include:

- reading source files;
- searching symbols;
- tracing imports/callers;
- inspecting existing tests;
- inspecting package scripts;
- running existing tests;
- running existing lint/typecheck/build commands where useful;
- reading existing architecture/governance documents;
- creating the required RESULT Markdown artifact.

Do not modify production code or tests merely to make validation pass.

Record exact commands run and their results.

If the repository already has a canonical full-suite validation command, use it if practical.

If validation fails before any changes are made, record the baseline failure accurately.

Do not repair it during this task.

---

## 32. Prohibited Changes

Do **not**:

- modify production code;
- modify tests;
- change schemas;
- change persistence;
- migrate stored data;
- repair historical state;
- delete historical state;
- bypass historical protection;
- change UI;
- rename product concepts in code;
- implement Sleep changes;
- implement Friction changes;
- implement Goal recurrence;
- implement Planner/Summary migration;
- add dependencies;
- refactor code;
- perform formatting-only repository changes;
- commit;
- push.

The only durable repository artifact authorized by this task is the audit RESULT document.

---

## 33. Required RESULT Artifact

Create:

```text
PHASE_9_TASK_9_8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
```

Place it in the existing dedicated **Phase 9 durable task-results folder**.

Discover and use the repository's existing Phase 9 result-folder convention.

Do not create a competing result location if one already exists.

The filename must contain `RESULT`.

---

## 34. Required RESULT Structure

The RESULT document must contain these sections in this order:

```text
# Task 9.8C — Post-Dogfood Product Reachability & Workflow Audit RESULT

## 1. Executive Findings

## 2. Audit Method and Evidence Standard

## 3. End-to-End Lifecycle Reachability

## 4. Lifecycle Reachability Matrix

## 5. Goal / Constructive Planning Findings

## 6. Commitment Placement Findings

## 7. Sleep First-Class Scheduling Findings

## 8. Day Boundary / User-Day Findings

## 9. Friction / Resolution Findings

## 10. Publication / Historical Authority Findings

## 11. Today / Execution / Progress Findings

## 12. Found Time Findings

## 13. Planner / Day Worksurface Findings

## 14. Legacy Preview / Date-Tower Findings

## 15. Summary / History Findings

## 16. Work Pattern Findings

## 17. Product Language / Architecture Leakage Findings

## 18. UI Surface Ownership Matrix

## 19. Correctness Trace Matrix

## 20. Missing / Disconnected Capability Matrix

## 21. Authority and Persistence Assessment

## 22. Behavioral / Architectural Invariants

## 23. Partial and Disconnected Paths

## 24. Dogfood Finding Disposition

## 25. Test Coverage Assessment

## 26. Recommended Post-Audit Convergence Scope

## 27. Open Questions

## 28. Validation Performed

## 29. Completion Assessment
```

---

## 35. Recommended Post-Audit Convergence Scope

The audit must end with a bounded recommendation for what should happen **after** Task 9.8C.

Do not implement it.

Separate recommendations into:

### A. Must Correct Before UI Migration

Correctness or authority defects that would contaminate a new shell.

Likely candidates must be evidence-based and may include:

- work-relative placement;
- Sleep semantics;
- Day Boundary crossing;
- historical-authority recovery;
- non-persistent resolution decisions.

### B. Must Connect Before or During Migration

Capabilities that already exist but require lifecycle/UI connection.

Possible examples:

- Goal → planning path discoverability;
- Friction resolution;
- Today → execution;
- Found Time → Progress;
- historical drill-down.

### C. Migrate Rather Than Repair

Legacy surfaces whose responsibilities should move into the intended Planner/Summary model.

Possible examples:

- giant Preview/date tower;
- Canonical Planning Review;
- duplicate Selected Day / Today surfaces.

### D. Product-Language Convergence

Internal terminology that must be translated into user-facing language.

### E. Deferred Product Evolution

Useful capabilities that are not required to correct or connect the existing architecture.

Possible examples:

- rolling external calendar facts;
- richer recurring Goal Demand;
- additional Goal authoring modes;
- broader calendar integration.

Do not turn this section into a detailed implementation plan.

Its purpose is to define the evidence-based boundary of the next task.

---

## 36. Completion Criteria

Task 9.8C is complete only when all of the following are true:

- [ ] The complete Goal → History lifecycle has been traced.
- [ ] Every lifecycle stage has a reachability classification.
- [ ] Production UI reachability has been distinguished from implementation/test reachability.
- [ ] Goal constructive planning has been traced through Proposal, acceptance, and Realization.
- [ ] Multiple Proposal / Accepted Allocation provenance has been investigated.
- [ ] Work-relative placement has been traced.
- [ ] `beforeWork` behavior has been traced.
- [ ] `afterWork` Night Shift behavior has been traced.
- [ ] Any Available behavior has been bounded appropriately.
- [ ] Sleep has received a dedicated first-class scheduling audit.
- [ ] Sleep crossing Day Boundaries has been traced.
- [ ] cycle-transition Sleep failure has been traced.
- [ ] non-persistent Sleep resolution has been investigated.
- [ ] Day Boundary ownership versus interval-crossing semantics has been assessed.
- [ ] Friction resolution reachability has been traced.
- [ ] publication readiness and publication failure have been reconciled.
- [ ] historical-authority protection has been traced.
- [ ] recovery reachability has been determined.
- [ ] Today → Execution → Progress → History has been traced even if currently blocked in the UI.
- [ ] Found Time → Goal → Progress has been traced.
- [ ] Planner / Selected Day / Today / Canonical Planning Review overlap has been audited.
- [ ] the legacy date tower has been classified.
- [ ] Summary/history connectivity has been audited.
- [ ] architectural-language bleed-through has been catalogued.
- [ ] Work Pattern old/new model relationship has been traced.
- [ ] all required matrices have been produced.
- [ ] authority/persistence boundaries have been assessed.
- [ ] applicable architectural invariants have been evaluated.
- [ ] partial/disconnected paths identify the smallest missing connection.
- [ ] Dogfood findings have been separated into correctness, reachability, interaction, migration, and product-evolution categories.
- [ ] existing test coverage has been assessed.
- [ ] validation commands and results have been recorded.
- [ ] no production implementation changes were made.
- [ ] no test changes were made.
- [ ] no persistence/history repair was performed.
- [ ] the required RESULT artifact exists in the Phase 9 results folder.
- [ ] the RESULT filename contains `RESULT`.
- [ ] the next convergence scope is evidence-based and bounded.

---

## 37. Final Completion Statement

If and only if every required audit criterion is satisfied, end the RESULT with exactly:

```text
Task 9.8C — Post-Dogfood Product Reachability & Workflow Audit is COMPLETE.
```

If the audit cannot establish one or more required conclusions, do **not** claim completion.

Instead end with:

```text
Task 9.8C — Post-Dogfood Product Reachability & Workflow Audit is INCOMPLETE.
```

Then immediately identify the unresolved evidence blockers.

---

## 38. Governing Principle

The purpose of this audit is not to prove that DayFrame needs more code.

The purpose is to determine what DayFrame **already knows how to do**, what the product **actually lets a human do**, and where those two realities diverge.

The next implementation phase must be based on that evidence.

Do not rebuild what already exists.

Do not preserve legacy UX merely because it currently exposes an important command.

Do not bypass authority boundaries to improve reachability.

Do not mistake architectural language for product language.

Do not mistake a disconnected capability for a missing capability.

And do not migrate a correctness defect into the new Planner/Summary shell.