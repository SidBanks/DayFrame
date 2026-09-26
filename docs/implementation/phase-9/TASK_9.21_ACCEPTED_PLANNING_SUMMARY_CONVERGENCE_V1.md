# Task 9.21 — Accepted-Planning Summary Convergence V1

**Status:** READY FOR IMPLEMENTATION  
**Phase:** 9 — Product Convergence  
**Task Type:** Bounded implementation / canonical evidence consumption / mobile UX convergence  
**Primary Surface:** Summary  
**Primary Evidence Owner:** G2 — Accepted-Planning Product Evidence  
**Depends On:** Tasks 9.17, 9.18, 9.19, 9.20  
**Must Preserve:** Phase 8/9 authority architecture, First-Class Sleep foundation, G1/G2 separation, immutable publication/history, independent Progress, Mobile Acceptance Gate, bundle hard gate  
**Required Durable Output:** `PHASE_9_TASK_9_21_ACCEPTED_PLANNING_SUMMARY_CONVERGENCE_V1_RESULT.md`

---

## 1. Objective

Implement the first bounded Summary convergence slice by making **accepted planning understandable, inspectable, and scalable through the canonical G2 read model**.

The task shall establish a user-facing Summary representation of accepted Goal planning that answers:

- What planning have I accepted?
- Which Goal does it belong to?
- What bounded planning iteration did I accept?
- Has that accepted planning been realized into scheduled work?
- What scheduled facts belong to that exact accepted iteration?
- Is any of that work represented in a published plan?
- What execution evidence is available?
- Is some evidence unavailable, incomplete, or protected?
- Where can I inspect additional detail?

The task must **not** create a new accepted-planning semantic model in React.

The product surface shall consume the existing canonical G2 projection:

```ts
queryAcceptedPlanningEvidence(...)
```

and preserve the exact lineage established by Task 9.19.

### Governing Principle

> **Summary may summarize accepted planning for comprehension, but it may not merge, rewrite, supersede, or infer the authority represented by distinct accepted planning iterations.**

The critical provenance regression remains:

```text
Network+ accepted iteration A = 10 hours
Network+ accepted iteration B = 20 hours
```

These may contribute to a **30-hour display total for orientation** only if A and B remain separately inspectable as two distinct accepted planning decisions.

They must never become:

```text
one synthetic 30-hour Accepted Allocation
```

---

## 2. Scope Boundary

Task 9.21 is deliberately narrower than complete Summary convergence.

### In Scope

- consume canonical G2 accepted-planning evidence in Summary;
- provide a bounded human-readable accepted-planning overview;
- group accepted planning by Goal where supported;
- preserve individual accepted iteration identity;
- expose realization state;
- expose bounded scheduled-fact detail;
- expose publication context where G2 provides it;
- expose execution context where G2 provides it;
- preserve protected/unavailable/incomplete states;
- provide progressive disclosure;
- provide lawful Planner drill-down where existing destinations already exist;
- establish mobile-first accepted-planning presentation;
- add regression coverage;
- preserve bundle and authority constraints.

### Out of Scope

Do **not** use Task 9.21 to converge all of:

```text
Capacity
Goals
Progress
History
Attention / Recommendations
```

Do not implement:

- complete broader Summary redesign;
- My Schedule convergence;
- Goals convergence;
- Review Plan convergence;
- HistoricalPlan recovery;
- recurring Goal Demand;
- Found Time;
- Live Capacity;
- Live Opportunity;
- new recommendation semantics;
- new Progress semantics;
- compatibility retirement.

---

## 3. Required Pre-Implementation Discovery

Before editing implementation, inspect and document the current repository state.

At minimum inspect:

1. current Summary entry surface;
2. `HistoricalIntelligenceSummary` and related Summary components;
3. existing accepted-allocation / realization presentation;
4. existing Goal summary presentation;
5. G2 public types;
6. G2 public query entry point;
7. G2 state adapter;
8. G2 pure projection builder;
9. G2 tests;
10. the Network+ multi-acceptance regression fixture/test;
11. publication evidence exposed through G2;
12. execution evidence exposed through G2;
13. protection/unavailable semantics;
14. existing Summary navigation and drill-down behavior;
15. current Summary responsive CSS/mobile density;
16. lazy-loading boundaries around Summary and G2;
17. current bundle measurements;
18. current test baseline;
19. current dirty-tree state.

Record before implementation:

```bash
git rev-parse HEAD
git status --short
```

Measure the actual repository baseline.

For historical comparison only, Task 9.20 completed at:

```text
150 test files
1,508 tests

Initial raw JS:       617,972 bytes
Initial gzip:         161,795 bytes
Hard gzip limit:      170,000 bytes
Remaining headroom:     8,205 bytes
Largest lazy chunk:    59,671 bytes
Total JS:           1,156,914 bytes
```

These values are **not** substitutes for fresh measurements.

---

## 4. Governing Authority Model

Task 9.21 must preserve:

```text
Authored
  ↓
Derived
  ↓
Proposed
  ↓
Accepted
  ↓
Realized / Scheduled
  ↓
Published
  ↓
Execution / Actual
  ↓
Progress
  ↓
History
```

Summary is a **read-model consumer**.

It owns none of these authority layers.

Explicitly:

```text
Summary UI ≠ Accepted Allocation owner
Summary UI ≠ Realization owner
Summary UI ≠ Publication owner
Summary UI ≠ Execution owner
Summary UI ≠ Progress owner
```

G2 remains derived, disposable, and read-only.

Rendering G2 must never create authority.

---

## 5. Canonical G2 Ownership

Task 9.21 shall consume the existing public G2 contract.

Conceptually:

```ts
queryAcceptedPlanningEvidence({
  startUserDayDate,
  endUserDayDateExclusive,
  asOf,
  select?
})
```

The exact current repository contract discovered during implementation governs.

Do not change G2 merely because a different shape would make UI implementation easier.

Do not reconstruct accepted-planning lineage in React by independently reading and joining:

- Goals;
- Demands;
- Proposals;
- Accepted Allocations;
- Realizations;
- scheduled facts;
- HistoricalPlan;
- Execution.

### Evidence Contract Stop Condition

If the required product question cannot be answered safely through existing G2 evidence:

```text
STOP CONDITION — EVIDENCE CONTRACT GAP
```

Document:

- the product question that cannot be answered;
- the missing evidence;
- why existing G2 cannot establish it;
- the smallest evidence-contract change required.

Do not substitute UI heuristics.

---

## 6. Preserve G1 / G2 Separation

Task 9.19 established:

> **MODEL B — separate G1 and G2 projections sharing only low-level references/types.**

Preserve this architecture.

Do not introduce:

```text
CanonicalProductTruth
UnifiedProductEvidence
GlobalSummaryTruth
PlannerSummaryMegaProjection
```

or any equivalent new semantic owner.

G1 remains selected-day evidence.

G2 remains accepted-planning lineage evidence.

Summary may navigate to the existing G1-backed Day Worksurface where appropriate, but it must not reconstruct G1 day semantics inside G2 presentation.

---

## 7. Product Question Hierarchy

Design accepted-planning Summary around human questions rather than internal records.

The default surface should answer:

```text
Which Goals have accepted planning?
How much planning is represented in this bounded view?
What state is that accepted planning in?
Is anything unavailable or awaiting further scheduling?
```

Progressive inspection should follow:

```text
Goal
  ↓
Accepted planning
  ↓
Individual accepted iteration
  ↓
Realization / scheduled facts
  ↓
Publication / execution context
```

Do not begin with an unbounded list of:

```text
Proposal IDs
Accepted Allocation IDs
Realization IDs
Scheduled fact IDs
Publication IDs
```

Stable identifiers may appear in technical/provenance detail when useful, but ordinary comprehension must not depend on them.

---

## 8. Required Product Structure

Implement a bounded hierarchy suitable for both phone and desktop.

The exact visual design may follow existing DayFrame conventions, but the semantic hierarchy should resemble:

```text
Accepted Planning

Goal A
  orientation summary
  accepted planning state
  bounded display totals where lawful

  Accepted iteration 1
    planning amount / intent
    relevant accepted-period/date evidence
    realization state
    scheduled work summary
    publication context
    execution context

  Accepted iteration 2
    ...

Goal B
  ...
```

The Goal-level representation may aggregate **display facts** where G2 supports them, such as:

- accepted iteration count;
- total accepted productive effort;
- realized iteration count;
- awaiting-realization count;
- scheduled-fact count;
- bounded period/date orientation.

### Aggregation Rule

> **Display aggregation must never become authority aggregation.**

Every Goal-level total must remain explainable by the individual accepted iterations underneath it.

---

## 9. Network+ Provenance Gate

Task 9.21 must include a dedicated regression based on the Task 9.19 Network+ lineage case.

The established fixture includes, at minimum:

```text
one Goal

Proposal A
Accepted Allocation A
600 productive minutes
Realization A
associated productive/support/protection facts

Proposal B
Accepted Allocation B
1,200 productive minutes
Realization B
associated productive/support/protection facts

Accepted Allocation C
intentionally unrealized
```

The exact current fixture discovered in the repository governs.

The Summary must prove:

1. A remains a distinct accepted iteration.
2. B remains a distinct accepted iteration.
3. C remains a distinct accepted iteration.
4. A and B may contribute to a Goal-level orientation total where lawful.
5. A and B never become one synthetic accepted record.
6. C is not treated as realized because A/B are realized.
7. scheduled facts resolve to the correct accepted iteration.
8. publication evidence resolves to the correct lineage where available.
9. execution evidence resolves to the correct lineage where available.
10. Goal rename does not rewrite frozen historical evidence.
11. Proposal lifecycle does not silently revoke accepted authority.
12. protected/unavailable realization evidence does not become a false `accepted but unrealized` claim.

This is a **completion gate**.

---

## 10. Accepted vs Realized

The product must clearly distinguish:

```text
Accepted
```

from:

```text
Realized / scheduled
```

An Accepted Allocation that has not been realized remains accepted planning authority.

It does **not** yet own calendar time.

Suitable human-facing states may include concepts such as:

```text
Accepted — awaiting scheduling
Scheduled
Evidence unavailable
Needs review
```

Use the exact canonical G2 states discovered during implementation.

Do not invent a state that G2 cannot establish.

---

## 11. Publication Context

Where G2 supplies publication evidence, Summary may show whether realized/scheduled work appears in retained publication.

Preserve:

```text
realized / scheduled ≠ published
```

Do not imply:

```text
realized → automatically published
```

Do not imply:

```text
published → executed
```

If publication evidence is protected, unavailable, or incomplete, surface that honestly.

Never reconstruct publication association through:

- Goal title;
- duration;
- geometry;
- date proximity;
- nearest publication;
- matching labels.

Use canonical G2 lineage only.

---

## 12. Execution Context

Where G2 provides execution evidence, expose bounded execution context.

Preserve:

```text
published ≠ actual
```

and:

```text
missing actual = unknown
```

Missing execution must not become:

```text
missed
failed
not completed
0%
```

unless canonical execution evidence explicitly establishes that state.

Execution correction and retraction semantics must remain intact.

Do not create a second execution interpretation inside Summary.

---

## 13. Progress Is Independent

Task 9.21 must not infer Goal Progress.

Never infer Progress from:

- accepted productive minutes;
- realized productive minutes;
- scheduled duration;
- published duration;
- completed execution duration;
- number of sessions;
- Support Activity;
- Protected Buffer.

G2 explicitly preserves Progress as:

```text
notInferred
```

Maintain that distinction.

Do not create calculations such as:

```text
10 of 20 hours scheduled = 50% complete
```

unless an independent canonical Progress authority explicitly supplies such a value.

No new Progress policy is authorized by Task 9.21.

---

## 14. Preserve Productive / Support / Protection Roles

If scheduled facts are exposed beneath an accepted iteration, preserve:

```text
Productive Goal Work
Support Activity
Protected Buffer
```

Do not flatten them into one generic duration.

Presentation hierarchy should generally make:

- productive work primary;
- support subordinate;
- protection contextual.

Protected Buffer is **not an activity**.

If Goal-level totals are displayed, clearly define what is totaled.

Do not label:

```text
productive + support + protection
```

as:

```text
Goal work
```

unless the label explicitly communicates the broader footprint.

---

## 15. Bounded Summary Range

Do not query/render all accepted planning in existence by default.

Discover and preserve current Summary range semantics.

The accepted-planning query must use a bounded view scope.

Do not silently bind it to:

- Calendar displayed month;
- Preview range;
- Proposal Horizon;
- Publication Range;
- generation range;

unless the current product contract explicitly establishes that relationship.

Summary range is a **view/query scope**.

Changing it must not mutate:

- Goal;
- Demand;
- Proposal;
- Accepted Allocation;
- Realization;
- schedule;
- publication;
- execution;
- Progress.

---

## 16. Large-Data Behavior

Design for realistic accumulation.

Validate, through fixtures or practical testing where appropriate:

- approximately 20 Goals;
- multiple accepted iterations per Goal;
- dozens/hundreds of scheduled facts;
- long-running accepted-planning history.

Use bounded rendering and progressive disclosure.

Possible techniques include:

- Goal grouping;
- status filters;
- bounded initial rows;
- per-Goal expansion;
- per-iteration expansion;
- incremental reveal;
- bounded pages/ranges.

Do not render every scheduled fact expanded by default.

Do not introduce virtualization or another runtime dependency without measured need.

If a new dependency becomes genuinely necessary:

```text
STOP CONDITION — ARCHITECTURE DECISION REQUIRED
```

---

## 17. Attention Semantics

Do not manufacture an attention/recommendation system merely to make Summary appear active.

Attention may be shown only where existing canonical evidence supports a meaningful state such as:

- accepted planning awaiting realization;
- protected/unavailable lineage;
- another established G2 state requiring review.

Do not invent recommendation scoring.

Do not automatically treat ordinary accepted-but-unrealized planning as an alarm unless existing semantics establish that it requires attention.

If no meaningful attention exists, omit the attention surface rather than showing decorative zero-state noise.

---

## 18. Navigation and Drill-Down

Task 9.21 may add bounded Summary drill-down.

The user should be able to move conceptually through:

```text
Goal summary
→ accepted iteration
→ scheduled facts
→ publication/execution detail
```

where canonical evidence exists.

Where an existing Planner destination owns operational action, navigate there instead of duplicating editing inside Summary.

Examples:

```text
Goal-oriented edit → Planner / Goals
Schedule review → Planner / Review Plan
Day inspection → existing Day Worksurface
```

Summary is primarily overview and inspection.

It must not become a second Planner.

---

## 19. No New Mutation Authority

Task 9.21 is primarily read-only convergence.

Do not add new commands that:

- accept a Proposal;
- reject a Proposal;
- realize an Accepted Allocation;
- publish;
- alter execution;
- mutate Progress;
- change Goal Demand;
- rewrite Goal Structure;
- repair HistoricalPlan;
- modify Sleep;
- change Work;
- change Commitments.

If current Summary already exposes a legitimate mutation path required for compatibility, preserve it only where necessary and document it.

Do not expand Summary mutation authority.

---

## 20. Historical Protection

Protected history must remain fail-closed.

Task 9.21 does **not** implement HistoricalPlan recovery.

If G2 returns protected/unavailable publication, realization, or execution evidence:

- display an honest protected/unavailable state;
- do not display an empty state;
- do not infer a negative state;
- disable any action requiring unavailable authority.

Do not expose destructive abandonment as a generic recovery mechanism.

Protected History Access remains a separate bounded task.

Recovery is not a prerequisite for this task if protected states can be represented safely.

---

## 21. Product Vocabulary

Prefer human-facing language such as:

```text
Accepted planning
Goal
Planning iteration
Scheduled work
Preparation
Protected time
Published schedule
Outcome not recorded
Needs review
View Goal
View schedule
```

Avoid default UI exposure of:

```text
AcceptedAllocationV1
Realization
canonical
truth
authority
ownerDay
incarnation
HistoricalPlan
publication batch
G2
```

Technical/provenance detail may expose identifiers where useful, but ordinary comprehension must not depend on architecture terminology.

---

## 22. Evidence-State Semantics

Do not collapse:

```text
complete + zero accepted planning
```

with:

```text
unavailable
protected
incomplete
not applicable
```

A genuine complete empty state may use product language such as:

> No accepted planning in this period.

Use such copy only when G2 establishes complete evidence for the requested scope.

Protected/incomplete evidence must not use the same empty-state presentation.

---

## 23. Loading and Async Correctness

G2 is lazy and asynchronous.

The consumer must correctly handle:

- initial loading;
- range changes;
- selection/filter changes;
- stale responses;
- unavailable/protected evidence;
- errors;
- unmount/remount.

A slower response for an older Summary request must not overwrite a newer query.

Use deterministic latest-request-wins or an equivalent established repository pattern.

Do not persist G2 evidence as authority.

---

## 24. Performance Requirements

Measure representative behavior.

At minimum record:

- G2 query timing for representative data;
- render behavior with multiple Goals and iterations;
- bundle effect;
- lazy-chunk effect.

Do not invent an SLO.

Avoid:

- one G2 query per Goal row;
- N+1 HistoricalPlan reads from React;
- lineage reconstruction during render;
- rendering every scheduled fact expanded by default.

Prefer one bounded G2 query followed by deterministic presentation of canonical evidence.

---

## 25. Mobile Acceptance Gate

Task 9.21 introduces substantial user-visible Summary UX.

The full standing **Mobile Acceptance Gate is mandatory**.

Validate production-rendered behavior at approximately:

```text
320px
390px
768px
1280px
```

### Reachability

Verify:

- Summary reachable from primary navigation;
- Accepted Planning reachable;
- Goal groups reachable;
- individual accepted iterations inspectable;
- detail open/close works by touch;
- Planner drill-down, if present, is touch-reachable;
- Back behavior is deterministic.

### Layout

Verify:

- no unintended document-level horizontal overflow;
- long Goal names wrap safely;
- dates/durations do not force horizontal scrolling;
- iteration cards remain understandable at 320px;
- nested detail does not become an unreadable indentation tower;
- technical identifiers do not dominate narrow layouts.

### Touch

Primary interactive controls should provide practical touch targets, approximately 44 CSS px where feasible.

No required:

- hover;
- double-click;
- right-click;
- precision pointer gesture.

### Progressive Disclosure

Do not expand every:

- Goal;
- accepted iteration;
- scheduled fact;
- publication record;
- execution record

simultaneously by default.

A phone user must be able to inspect one planning lineage without receiving the entire dataset.

### Semantic Parity

Mobile and desktop must consume the same G2 evidence and expose the same authority distinctions.

Mobile may change layout.

It may not receive a weaker semantic model.

### Accessibility

For touched interactions validate:

- keyboard navigation;
- visible focus;
- logical tab order;
- semantic controls;
- accessible names;
- heading hierarchy;
- non-color-only status;
- focus restoration where applicable;
- reasonable zoom/reflow behavior.

Do not claim physical-device or screen-reader certification unless actually performed.

> **Failure of the Mobile Acceptance Gate means Task 9.21 is not complete.**

---

## 26. Bundle Gate

Measure the current bundle before implementation.

After implementation record:

```text
initial raw JS
initial gzip
delta from measured baseline
largest lazy chunk
total emitted JS
remaining hard headroom
advisory status
```

Hard requirement:

```text
initial gzip <= 170,000 bytes
```

Do not raise the threshold.

For historical reference, Task 9.20 ended at approximately:

```text
161,795 bytes initial gzip
8,205 bytes hard headroom
```

Fresh measurements govern.

Keep G2 and heavy Summary detail behind appropriate lazy boundaries.

Do not eagerly import large accepted-planning/history modules into the initial bundle for convenience.

No new runtime dependency without explicit architecture review.

---

## 27. Persistence and Schema Constraints

Task 9.21 is expected to require no persistence/schema change.

Expected:

```text
Active schema: unchanged
Profile schema: unchanged
Backup schema: unchanged
HistoricalPlan schema: unchanged
Execution schema: unchanged
Progress schema: unchanged
Sleep schema: unchanged
```

If durable schema change appears necessary:

```text
STOP CONDITION — ARCHITECTURE DECISION REQUIRED
```

Do not hide persistence changes inside Summary convergence.

---

## 28. Compatibility Requirements

Existing Summary behavior outside this bounded slice must remain reachable unless replacement parity is explicitly demonstrated.

Classify touched/adjacent components as:

```text
RETAIN
TRANSITIONAL
READY FOR RETIREMENT
BLOCKED BY LATER CONVERGENCE
```

Task 9.21 does not authorize broad Summary retirement.

It also does not authorize retirement of:

```text
TodaySurface
SelectedDayWorkspace
HistoricalPlanReportingSection
```

Those remain subject to later parity audit.

Governing rule:

> **Converge first. Retire later.**

---

## 29. No Historical Reconstruction Heuristics

Never infer accepted-planning lineage using:

- matching Goal titles;
- matching durations;
- matching dates;
- matching geometry;
- latest-record-wins;
- nearest publication;
- nearest execution;
- aggregate amount equivalence.

Use exact canonical G2 references.

If lineage cannot be established, represent it according to canonical unavailable/incomplete/protected evidence.

Do not guess.

---

## 30. Required Tests

Add focused regression coverage for at least the following.

### 30.1 Canonical G2 Consumption

Verify:

- Summary consumes G2;
- React does not reconstruct lineage independently;
- no duplicate accepted-planning evidence owner is created.

### 30.2 Network+ Provenance

Verify:

- 10h accepted iteration remains distinct;
- 20h accepted iteration remains distinct;
- accepted-unrealized iteration remains distinct;
- Goal-level total, if shown, does not destroy iteration identity;
- scheduled facts remain associated with the correct accepted iteration.

### 30.3 State Distinctions

Cover:

- accepted but unrealized;
- realized;
- publication context;
- execution context;
- missing execution = unknown;
- protected evidence;
- unavailable evidence;
- incomplete evidence where applicable;
- complete + zero accepted planning.

### 30.4 Progress

Verify:

- accepted minutes do not become Progress;
- realized minutes do not become Progress;
- executed duration does not become Progress;
- no completion percentage is inferred from planning duration.

### 30.5 Roles

Verify:

```text
productive
support
protection
```

remain distinct.

### 30.6 Range

Verify:

- changing Summary range changes query scope;
- range navigation does not mutate planning authority;
- Summary range does not accidentally become Calendar/Preview/Proposal horizon.

### 30.7 Async

Verify a stale older G2 result cannot replace a newer range/filter query.

### 30.8 Navigation

Verify:

- Summary → accepted planning → iteration detail;
- lawful Planner drill-down where implemented;
- Back restores Summary context.

### 30.9 Mobile

Add practical regressions for:

- narrow layout;
- disclosure;
- long Goal names;
- multiple accepted iterations;
- practical touch controls;
- absence of required desktop-only gestures.

---

## 31. Required Validation

Run repository canonical equivalents of:

```bash
npm run format
npx prettier --check .
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Also run focused suites for:

- G2;
- accepted-planning Summary;
- Network+ provenance;
- navigation;
- historical protection where touched;
- responsive/mobile behavior.

Perform production browser validation for the Mobile Acceptance Gate.

Record exact final test counts.

---

## 32. Repository Hygiene

Before editing:

```bash
git rev-parse HEAD
git status --short
```

Preserve pre-existing dirty work.

Do not:

- reset;
- stash unrelated work;
- normalize unrelated files;
- mutate the preserved dogfood database;
- commit;
- push.

Use disposable browser/test state.

At completion:

- account for every changed file;
- distinguish task changes from pre-existing changes;
- run `git diff --check`.

---

## 33. Prohibited Changes

Task 9.21 must not:

- change Goal authority semantics;
- change Goal Demand semantics;
- introduce recurring Goal Demand;
- change Proposal semantics;
- create automatic acceptance;
- change Accepted Allocation semantics;
- invent accepted-allocation supersession/currentness;
- merge accepted iterations;
- change Realization semantics;
- create automatic realization;
- change publication semantics;
- change execution semantics;
- infer Progress;
- create Found Time;
- implement Live Capacity;
- implement Live Opportunity;
- alter First-Class Sleep architecture;
- alter Work/Commitment scheduling;
- implement HistoricalPlan recovery;
- weaken protected-history behavior;
- add a new semantic owner;
- create a G1/G2 mega-projection;
- perform broad Summary redesign beyond accepted-planning convergence;
- retire compatibility surfaces without parity evidence;
- change persistence schemas;
- add a runtime dependency without architecture review;
- raise bundle thresholds;
- commit;
- push.

---

## 34. Required Stop Conditions

### STOP CONDITION — EVIDENCE CONTRACT GAP

Use when the required product question cannot be answered by G2 without independently joining authority or guessing lineage.

### STOP CONDITION — AUTHORITY AMBIGUITY

Use when implementation would require deciding:

- whether one accepted iteration supersedes another;
- whether an accepted iteration is “current”;
- whether multiple accepted iterations should merge.

Task 9.19 explicitly did not invent supersession semantics.

### STOP CONDITION — PROGRESS SEMANTICS REQUIRED

Use if useful presentation appears to require converting accepted/realized/executed time into Goal Progress.

### STOP CONDITION — HISTORICAL RECOVERY REQUIRED

Use if the bounded Summary cannot safely function without a new repair/recovery mechanism.

Do not weaken protection.

### STOP CONDITION — SCHEMA CHANGE REQUIRED

Use if durable persistence must change.

### STOP CONDITION — DEPENDENCY REQUIRED

Use if a new runtime dependency becomes genuinely necessary.

### STOP CONDITION — BUNDLE HARD GATE

Use if the task cannot remain below:

```text
170,000 bytes initial gzip
```

without an architectural decision.

---

## 35. Completion Criteria

Task 9.21 is complete only when all of the following are true:

1. Summary has a bounded accepted-planning product view.
2. The view consumes canonical G2 evidence.
3. React does not reconstruct accepted-planning lineage independently.
4. Accepted planning is presented in human product terms.
5. Distinct accepted iterations remain distinct.
6. Network+ 10h + 20h cannot become one synthetic 30h acceptance.
7. Accepted-but-unrealized remains distinct from realized work.
8. Scheduled facts preserve exact accepted-iteration provenance.
9. Publication context remains distinct from realization.
10. Execution context remains distinct from publication.
11. Missing execution remains unknown.
12. Protected/unavailable/incomplete evidence is not rendered as empty.
13. Productive/support/protection remain distinct.
14. No Progress is inferred.
15. Summary range remains view/query scope rather than planning authority.
16. Large accepted-planning sets use bounded progressive presentation.
17. No new mutation authority is introduced.
18. No persistence/schema change is introduced.
19. G1/G2 remain separate.
20. Existing compatibility surfaces remain unless parity explicitly justifies retirement.
21. Full Mobile Acceptance Gate passes.
22. Accessibility checks for touched interactions pass.
23. Initial gzip remains within the unchanged 170,000-byte hard limit.
24. No new runtime dependency is introduced unless separately approved.
25. Full validation passes.
26. Exact final test counts are recorded.
27. All task-created/modified files are accounted for.
28. No commit or push is performed.
29. A durable RESULT artifact is produced.

---

## 36. Required RESULT Artifact

Create:

```text
PHASE_9_TASK_9_21_ACCEPTED_PLANNING_SUMMARY_CONVERGENCE_V1_RESULT.md
```

The RESULT must contain the following sections.

### A. Executive Summary

State what changed and whether the task is complete.

### B. Repository Baseline

Record:

```text
starting HEAD
starting git status
pre-task tests
pre-task bundle
pre-existing dirty files
```

### C. Discovery Findings

Document:

- prior Summary architecture;
- prior accepted-planning presentation;
- exact G2 consumer contract;
- lazy boundaries;
- compatibility surfaces;
- evidence limitations discovered.

### D. Implementation

List every created/modified file and its role.

### E. Product Structure

Describe the final accepted-planning Summary hierarchy.

### F. Authority Analysis

Explicitly demonstrate:

```text
Summary owns no authority
G2 remains derived/read-only
accepted ≠ realized
realized ≠ published
published ≠ actual
actual ≠ Progress
```

### G. Network+ Provenance Evidence

Demonstrate that the 10h and 20h accepted iterations remain distinct.

Include the intentionally unrealized iteration where the canonical fixture provides it.

### H. Unknown / Protected Evidence

Document handling of:

```text
complete empty
unavailable
protected
incomplete
missing execution
```

### I. Role Preservation

Document presentation of:

```text
productive
support
protection
```

### J. Range Semantics

Document the bounded Summary query scope and prove it does not mutate planning authority.

### K. Async Correctness

Document stale-response protection.

### L. Mobile Acceptance Gate

Record rendered results at:

```text
320px
390px
768px
1280px
```

Include:

- reachability;
- overflow;
- touch;
- progressive disclosure;
- Back behavior;
- focus/keyboard;
- semantic parity.

### M. Accessibility

Document tested accessibility behavior and explicitly state anything not certified.

### N. Performance

Record representative G2/query/render observations without inventing an SLO.

### O. Bundle

Record:

```text
pre-task initial raw
pre-task initial gzip
post-task initial raw
post-task initial gzip
delta
largest lazy chunk
total JS
remaining hard headroom
advisory status
```

### P. Tests

Record focused/full counts and important regressions.

### Q. Validation Commands

Record results for all required validation.

### R. Persistence / Dependencies

Explicitly state whether any:

```text
schema
persistence version
dependency
bundle policy
```

changed.

Expected answer: none.

### S. Compatibility Disposition

Classify relevant components as:

```text
RETAIN
TRANSITIONAL
READY FOR RETIREMENT
BLOCKED BY LATER CONVERGENCE
```

Do not delete merely because a component is transitional.

### T. Remaining Gaps

Separate future convergence work from defects in Task 9.21.

### U. Next-Task Assessment

Based on repository evidence after implementation, assess the smallest next bounded convergence slice among:

```text
My Schedule convergence
Goals convergence
Review Plan convergence
Protected History Access
another prerequisite discovered during Task 9.21
```

Do not automatically assume projected Task 9.22 remains correct.

---

## 37. Final Completion Statement

If and only if every completion criterion passes, end the RESULT with:

> **Task 9.21 — Accepted-Planning Summary Convergence V1 is COMPLETE.**

If any completion gate fails, do not use that statement.

Return the precise blocker or stop condition instead.

---

## 38. Final Governing Principles

> **Summary may summarize authority; it may not manufacture authority.**

> **A total is an orientation aid, not a replacement for provenance.**

> **Two accepted planning decisions remain two accepted planning decisions even when they belong to the same Goal.**

> **Accepted is not scheduled. Scheduled is not published. Published is not actual. Actual is not Progress.**

> **Missing evidence is unknown. Protected evidence is unavailable. Neither is empty.**

> **G2 owns the accepted-planning product projection. React presents it; React does not reconstruct it.**

> **Mobile receives the same truth with a different layout, not a weaker truth model.**

> **Converge first. Retire later.**