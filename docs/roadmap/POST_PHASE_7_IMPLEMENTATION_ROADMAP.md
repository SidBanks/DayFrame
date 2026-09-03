# Post-Phase-7 Implementation Roadmap

## Status

Ready for execution.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Normative implementation-roadmap synthesis.

This task begins after completion of:

* Post-Phase-7 Architecture Synthesis;
* Dogfood Pass 01 Findings Reconciliation;
* targeted DF-006 investigation and final technical reproduction;
* Post-Phase-7 Implementation Alignment Strategy.

The governing alignment result selected:

> **Path A — Implementation Roadmap.**

The alignment strategy established that DayFrame's architecture is sufficiently complete, no additional architecture reopening is required, and current implementation gaps are sufficiently bounded to sequence implementation. It also established the principal dependency seams:

```text
authored outcome authority
→ composite time authority
→ derived planning truth
→ constructive reasoning
→ accepted realization
→ scheduled history
→ live divergence
→ learning/promotion
→ surface convergence
```

These seams are dependencies, not automatically implementation phases. The purpose of this task is to transform them into a coherent, executable roadmap while preserving DayFrame's working deterministic substrate and carrying every remaining Dogfood obligation forward.

This task does **not** implement roadmap work.

This task does **not** modify production code or tests.

This task does **not** reopen accepted architecture unless direct contradictory evidence makes roadmap construction impossible.

This task does **not** inherit a future phase name from an earlier roadmap.

This task **may recommend the name and scope of the next implementation phase**, because phase naming was deliberately deferred until roadmap construction.

This task is read-only with respect to the existing repository.

**The required Implementation Roadmap result artifact is the sole permitted repository write.**

---

## 1. Primary Objective

Create the implementation roadmap that converts DayFrame's accepted post-Phase-7 architecture and alignment strategy into a sequence of coherent implementation increments.

Answer:

> **What should DayFrame implement next, in what dependency order, what must move together, what existing behavior must remain stable during each transition, and where should Dogfood/UX/regression work enter without compromising architectural boundaries?**

The roadmap must bridge:

```text
Accepted Architecture
+
Implementation Alignment Strategy
+
Dogfood Obligations
+
Current Executable Foundations
↓
Implementation Roadmap
↓
Named Implementation Phase(s)
↓
Future Canonical Implementation Tasks
```

The roadmap owns sequencing.

The Alignment Strategy owns semantic disposition.

Do not redo the Alignment Strategy.

---

## 2. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/roadmaps/POST_PHASE_7_IMPLEMENTATION_ROADMAP_RESULT.md`

If `/docs/roadmaps` does not currently exist, verify the repository's established roadmap location before creating a new directory.

If established governance requires roadmap artifacts directly under `/docs`, use:

`/home/sid/Penn Digital Services/DayFrame/docs/POST_PHASE_7_IMPLEMENTATION_ROADMAP_RESULT.md`

Do **not** guess silently.

Determine the repository's established roadmap location first and report the exact selected path.

The filename must contain `RESULT`.

The result artifact is the sole permitted repository write.

---

## 3. Governing Alignment Strategy

Use as primary implementation-strategy authority:

`POST_PHASE_7_IMPLEMENTATION_ALIGNMENT_STRATEGY_RESULT.md`

Preserve its classifications unless roadmap-level dependency evidence requires a sequencing refinement.

In particular preserve these conclusions:

### Preserve / Extend

* canonical user-day/date helpers;
* Work definitions and cycles;
* Commitment recurrence;
* `BlockCandidate` as mechanism;
* opening/interval geometry as mechanism;
* Preview;
* Friction/Suggested Fix;
* PlanDecision;
* Accepted Choices as historical decision evidence;
* Goals as identity/outcome roots;
* publication;
* execution;
* Progress;
* Month;
* Today;
* Summary;
* backups;
* versioned persistence.

### Introduce

* Goal Structure;
* Goal Demand;
* Demand Projection;
* Goal Priority;
* Capacity;
* Goal-Specific Feasibility;
* Competing Demand Set;
* Allocation;
* Constructive Proposal;
* ProposalDecision;
* Accepted Allocation;
* Commitment Composition;
* CompositeDecision;
* Released Interval;
* Live Capacity;
* Live Opportunity;
* learned tendency / reusable preference promotion.

### Adapt / Replace / Retire

* Buffer semantics;
* relative Work placement;
* Goal-link-as-planning semantics;
* placement-priority overload;
* Accepted Choice presentation/learning semantics;
* Review Schedule;
* Teach ownership;
* planning-range coupling;
* Saved Setup Profiles.

Do not reopen these classifications merely to create roadmap work.

---

## 4. Governing Architecture

Use the accepted Post-Phase-7 Architecture Synthesis as the primary normative architectural integration point.

Also use the accepted specifications for:

* Capacity;
* Goal Structure;
* Goal Demand / Allocation;
* Commitment Composition / Attached Activities;
* Constructive Proposal / Live Opportunity;
* Friction;
* publication;
* execution;
* Progress;
* history;
* recurrence;
* user-day ownership;
* provenance;
* decisions/preferences.

Use exact repository filenames.

Do not reconstruct architecture from memory when the accepted artifact exists.

---

## 5. Governing Dogfood Evidence

Use:

`DOGFOOD_PASS_01_FINDINGS_RECONCILIATION_RESULT.md`

and the Dogfood Carry-Forward Matrix in the Alignment Strategy.

Every Dogfood item marked as a roadmap obligation must receive one of:

* a specific implementation increment;
* a bounded independent correction lane;
* a preservation/regression requirement;
* an explicit deferred-enhancement destination.

No finding may disappear during sequencing.

---

## 6. DF-006 Roadmap Treatment

Carry:

* `DF006-RC7`;
* `BR5`;
* `S2`;
* `DF006-FINAL-C2`.

Do not schedule a speculative DF-006 bug fix.

Schedule or preserve its regression and observability obligations:

* `DF006-REG-01` through `DF006-REG-17`;
* weekday/manual-cycle correctness;
* broad-range invariance;
* saved-vs-draft clarity;
* stale/current clarity;
* exact Work provenance;
* Month source evidence.

DF-006 should enter the roadmap where Work provenance, freshness, Month evidence, and regression hardening naturally belong.

---

## 7. Roadmap Design Principles

The roadmap must follow these principles.

### RP-01 — Semantic completeness before surface exposure

Do not expose a new domain before its authority and lifecycle are coherent.

### RP-02 — Preserve working behavior during migration

Current deterministic scheduling remains usable while new planning domains are introduced.

### RP-03 — Build upstream authority before downstream reasoning

Do not implement consumers before their semantic inputs exist.

### RP-04 — Derived truth must not become authored authority

Capacity, Demand Projection, Feasibility, Allocation, and recommendation reasoning remain derived where specified.

### RP-05 — Explicit acceptance before new scheduled Goal authority

Proposal cannot schedule Goal work directly.

### RP-06 — Migration belongs with semantic change

Do not postpone required data migration until after new semantics are exposed.

### RP-07 — History compatibility is part of implementation

Do not rewrite old meaning.

### RP-08 — Dogfood corrections should ride with the smallest responsible increment

Do not create a giant miscellaneous cleanup phase.

### RP-09 — Independent polish may proceed independently only when it cannot preempt semantic ownership

Visual cleanup must not hard-code obsolete architecture.

### RP-10 — Every increment leaves DayFrame coherent

No increment should leave a publicly reachable half-domain.

---

## 8. Minimum Coherent Increment Rule

Use the Alignment Strategy's principle:

> **Implementation increments should establish complete semantic authority boundaries rather than expose half-connected domain concepts.**

Explicitly prohibit roadmap increments such as:

* Capacity without policy, liability, provenance, and freshness;
* Goal Demand without Goal Structure/Priority separation;
* Proposal without ProposalDecision and Accepted Allocation;
* Composition without footprint/liability;
* Found Time without Released Interval and Live Capacity;
* reusable preference without explicit promotion;
* publication extensions without historical versioning.

The roadmap may split implementation internally, but user-visible activation must respect coherent boundaries.

---

## 9. Current Foundation Baseline

Before sequencing, identify current foundations that future tasks should treat as stable unless explicitly extended:

* canonical user-day;
* Work generation;
* manual/repeating cycles;
* Commitment source/incarnation identity;
* recurrence expansion;
* placement geometry;
* Preview;
* Friction;
* Suggested Fix;
* PlanDecision;
* publication;
* execution;
* Progress;
* persistence/migrations;
* backup;
* Month;
* Review Schedule;
* Today;
* Summary.

For each identify its extension seam.

Do not schedule unnecessary rewrites.

---

## 10. Dependency Graph

Construct a directed dependency graph from the Alignment Strategy.

At minimum model:

```text
Goal Base
→ Goal Structure
→ Goal Demand Intent
→ Demand Projection

Commitment Base
→ Commitment Composition
→ Composite Footprint / Liability

Authorized Schedule
+ Composite Footprint
+ Availability Policy
→ Capacity

Demand Projection
+ Capacity
→ Goal-Specific Feasibility

Feasibility
+ Goal Priority
+ Allocation Policy
→ Competing Demand Set
→ Allocation

Allocation
→ Constructive Proposal
→ ProposalDecision
→ Accepted Allocation
→ Realization
→ Preview
→ Publication

Publication
+ Execution Divergence
→ Released Interval
→ Live Capacity
→ Live Opportunity
→ Live Proposal

Execution
+ Progress
+ Decisions
+ Proposal History
→ Summary / Learning
→ Learned Tendency
→ Explicit Preference Promotion
```

Identify dependencies that can proceed in parallel.

---

## 11. Critical Path

Determine the critical implementation path required to reach DayFrame's principal differentiator:

> **Commitments own time; Goals compete for Capacity; DayFrame proposes how to use that Capacity; the user authorizes the result.**

The roadmap must explicitly identify the shortest coherent path from current implementation to that capability.

Do not let secondary UX or Live features obscure this critical path.

---

## 12. Parallel Work Lanes

Determine whether implementation should be represented through coordinated lanes.

At minimum evaluate:

### Domain / Authority Lane

new semantic models and authority.

### Engine / Derived Truth Lane

Capacity, feasibility, Allocation, Proposal.

### Persistence / History Lane

migrations, revisions, provenance, backup.

### Surface / Workflow Lane

Teach, Month, Review Schedule, Today, Summary.

### Dogfood / Quality Lane

bounded regressions, UX fixes, accessibility, polish.

The roadmap may use another organization if evidence supports it.

Do not allow parallel lanes to violate dependency ordering.

---

## 13. Roadmap Unit

Define the roadmap's implementation unit.

Recommended model:

> **Increment = coherent semantic capability + persistence/migration + engine behavior + query/read model + targeted surface exposure + tests + documentation/checkpoint.**

Avoid roadmap units defined only as:

* model creation;
* UI page;
* utility function;
* migration;
* test batch.

Those may be tasks inside an increment, not complete roadmap increments.

---

## 14. Increment Entry Criteria

Every roadmap increment must specify:

* required upstream capability;
* preserved current behavior;
* relevant accepted architecture;
* migration prerequisites;
* Dogfood obligations;
* test prerequisites.

An increment cannot begin if its semantic dependencies do not exist.

---

## 15. Increment Exit Criteria

Every increment must specify:

* new semantic capability;
* authority boundary established;
* persistence/migration completed where required;
* provenance/freshness established;
* deterministic engine behavior;
* read/query model;
* minimum usable surface exposure where appropriate;
* regression protection;
* documentation/checkpoint;
* no known violation of accepted architecture.

---

## 16. Recommended Initial Foundation Increment

Evaluate whether the first roadmap increment should establish the shared cross-cutting substrate required by later domains.

Potential responsibilities:

* revisioned domain identity;
* provenance/origin expansion;
* dependency fingerprints;
* typed freshness;
* stable reason-code infrastructure;
* persistence/versioning support;
* migration helpers;
* history resolution primitives.

Do not create infrastructure for its own sake.

Only include cross-cutting work demonstrated to be required by multiple immediate domains.

---

## 17. Goal Structure Increment

Determine the coherent implementation boundary for:

* typed Goal relationships;
* subgoal structure;
* Milestones where specified;
* lifecycle/revisions;
* eligibility;
* history;
* query support;
* migration of existing Goal identity without reinterpreting Goal links.

Identify Dogfood Goal discoverability work that can accompany it.

---

## 18. Goal Demand / Priority Increment

Determine the coherent boundary for:

* Authored Demand Intent;
* Demand revision/lifecycle;
* Goal Priority;
* effort/horizon;
* session shape;
* cadence;
* minimum/target/optional semantics;
* constraints/preferences;
* Demand Projection;
* Progress advisory input.

Ensure Demand remains non-time-owning.

Do not route it through Commitment recurrence.

---

## 19. Commitment Composition Increment

Determine the coherent boundary for:

* Attachment Relationship;
* attached activities;
* relation revisions;
* pairing;
* required/optional;
* timing strictness;
* Buffer distinction;
* Composite Footprint;
* Composite Liability;
* CompositeDecision where necessary;
* execution subject support;
* Goal-service attribution.

Determine how existing Buffers and `beforeWork` / `afterWork` behavior migrate or coexist.

Carry:

* DF-019 through DF-023;
* relevant Sleep/relative-placement preservation requirements.

---

## 20. Capacity Increment

Determine the coherent boundary for:

* canonical interval representation;
* occupied time;
* protected time;
* unresolved Commitment liability;
* composite footprint subtraction;
* general availability policy;
* freshness;
* coverage;
* allocability;
* provenance;
* reason codes;
* Capacity query/read model.

Reuse geometric opening helpers only as mechanisms.

Carry DF-041.

---

## 21. Feasibility Increment

Determine whether Goal-Specific Feasibility belongs in the Capacity increment or immediately after it.

It must support:

* exact Demand Projection;
* exact Capacity version/context;
* session requirements;
* composition overhead;
* hard constraints;
* preferences;
* compatible opportunities;
* unsatisfied Demand information;
* deterministic explanation.

It must not rank competing Goals.

---

## 22. Competing Demand / Allocation Increment

Determine the coherent boundary for:

* active normalized competing Demand;
* overlap on Capacity;
* Goal Priority;
* Allocation Policy;
* deterministic tie-breaking;
* partial satisfaction;
* provisional Capacity claims;
* productive vs support effort;
* reason codes;
* allocation provenance.

Do not schedule work here.

---

## 23. Constructive Proposal Increment

This increment must be treated as an atomic authority transition.

At minimum include:

* Proposal identity/lifecycle;
* ordinary context;
* ranked option set;
* No-Proposal;
* reason codes;
* exact/bounded placements;
* Proposal Horizon;
* freshness/revalidation;
* ProposalDecision;
* accept;
* modify;
* reject;
* ignore/expiry;
* Accepted Allocation;
* bounded authority;
* realization into schedule facts;
* provenance/history;
* publication integration.

Do not expose Proposal acceptance before Accepted Allocation and realization are complete.

Carry:

* DF-045;
* DF-046;
* PM-01 through PM-05.

---

## 24. Planning Horizon / Review Scope Increment

Determine whether Planning-Data Horizon, Proposal Horizon, and Review Scope should be introduced before Proposal surface exposure or as part of that increment.

Requirements:

* engine data horizon independent of attention;
* Proposal bounded independently;
* Review Scope changes do not regenerate semantic truth unnecessarily;
* annual planning data does not force annual conflict review;
* Month and Review Schedule can query bounded attention windows.

Carry:

* DF-037;
* DF-038;
* DF-039;
* DF-040.

---

## 25. Month / Planner Convergence Increment

Determine when Month should gain:

* Capacity evidence;
* Goal work;
* Proposal attention;
* composite evidence;
* source provenance;
* improved current/stale indicators;
* bounded Review Scope.

Preserve existing Month scheduling evidence throughout.

Carry DF-006 regression requirements here where appropriate.

Do not make Month own domain semantics.

---

## 26. Review Schedule Evolution Increment

Determine when Review Schedule should evolve to support:

* bounded schedule review;
* Friction grouping;
* bulk/scoped correction;
* Accepted Choice scaling;
* clear distinction between authorized Preview and constructive Proposal;
* publication readiness;
* source/provenance inspection.

Carry:

* DF-024 through DF-036;
* DF-039.

Do not convert Friction into Proposal.

---

## 27. Publication / History Extension Increment

Determine whether publication/history extension belongs inside Accepted Allocation realization or immediately afterward.

Must support:

* recurring authority;
* direct scheduled;
* ordinary Proposal accepted;
* Found-Time Proposal accepted;
* corrective decision;
* support activities;
* Buffers;
* composite snapshots;
* Goal/Demand/Allocation lineage;
* `legacyUnknown`;
* immutable historical compatibility.

No old history may be rewritten to fabricate new provenance.

---

## 28. Live Opportunity Increment

Only after ordinary Proposal semantics are coherent, sequence:

* execution divergence;
* cancellation;
* skip;
* early completion;
* Released Interval;
* remaining obligation/liability subtraction;
* Live Capacity;
* Live Opportunity;
* expiry;
* short-horizon Proposal;
* one-off acceptance;
* direct spontaneous Goal execution.

Carry DF-047 through DF-050.

Native timer remains optional and must not block this increment.

---

## 29. Learning / Preference Promotion Increment

Only after sufficient decision and execution history exists, sequence:

* learned tendency;
* Accepted Choice guidance;
* historical resolution;
* explicit reusable preference;
* explicit promotion;
* preference conflict;
* priority among guidance;
* explainability;
* user authority.

Carry:

* DF-029 through DF-033;
* PM-06 through PM-08.

Do not infer authority from repetition.

---

## 30. Summary / Learn Evolution Increment

Determine when Summary should gain:

* Capacity context;
* Demand history;
* allocation/proposal outcomes;
* accepted/rejected patterns;
* composition context;
* execution;
* Progress;
* learned tendencies;
* operational/analytic/archive resolution.

Carry:

* DF-043;
* DF-051;
* DF-052;
* DF-053.

Preserve existing Summary basics while new domains arrive.

---

## 31. Teach Evolution Increment

Determine how Teach evolves incrementally rather than through a destructive rewrite.

At minimum eventually surface:

* Work Pattern;
* Commitment Library;
* Goal authoring;
* Goal Structure;
* Goal Demand;
* Goal Priority;
* composition;
* Buffers;
* scheduling preferences;
* off-day policy;
* availability policy.

Carry:

* DF-002;
* DF-003;
* DF-010;
* DF-013 through DF-016;
* DF-020;
* DF-044.

---

## 32. Profiles Retirement Increment

Sequence retirement only after compatibility exists.

Requirements:

* preserve profile data;
* export/data escape;
* restore/migration compatibility;
* backups remain independent;
* no silent conversion into template/scenario semantics;
* UI retirement after compatibility support.

Carry DF-054 and DF-055.

Do not make profile retirement an early critical-path distraction unless it blocks migration.

---

## 33. Independent UX / Polish Lane

Classify bounded items that may be safely completed without waiting for new architecture.

At minimum assess:

* weekday controls;
* invalid-date recovery;
* Advanced Work authority visibility;
* Buffer discoverability;
* Goal-work discoverability;
* wording;
* focus/accessibility;
* mobile layout;
* Accepted Choice filtering/grouping;
* Friction grouping;
* DF-006 source/freshness visibility.

For each specify:

### Safe Now

No dependency on future semantics.

### Ride With Increment

Best handled when owning semantic domain changes.

### Defer

Would likely be invalidated by future architecture.

Do not implement them.

---

## 34. Regression Preservation Lane

Identify existing behavior that must remain green throughout the roadmap.

At minimum:

* canonical user-day;
* overnight Work;
* manual cycles;
* repeating cycles;
* recurrence;
* relative Sleep placement;
* Preview freshness;
* Friction;
* Suggested Fix;
* PlanDecision replay;
* publication;
* execution correction/retraction;
* Progress;
* backup/restore;
* Month evidence;
* DF-006 REG-01–17.

Treat these as continuous roadmap constraints, not one final testing task.

---

## 35. Migration Strategy Across Roadmap

For each increment involving persisted semantics, specify:

* source model;
* target model;
* migration timing;
* compatibility window;
* backup implications;
* history implications;
* rollback/recovery;
* `legacyUnknown` treatment;
* whether old UI remains temporarily available.

Prefer additive migrations before destructive retirement.

---

## 36. Documentation / Checkpoint Strategy

Each major roadmap increment should end with:

* validation;
* architecture alignment check;
* `CURRENT_STATE.md` update;
* `CHANGELOG.md` update;
* `DECISIONS.md` update where a genuine implementation decision was made;
* checkpoint commit;
* push;
* optional hydration/checkpoint artifact for major semantic boundaries.

Do not modify these files in this roadmap task.

The roadmap should specify when they become required.

---

## 37. Publication Checkpoints

Identify major points where Sidney should stop, dogfood, and validate behavior before continuing.

At minimum consider checkpoints after:

* authored Goal/Demand semantics;
* Composition/Capacity;
* ordinary constructive Proposal;
* Planner/Review convergence;
* Live Opportunity;
* learning/promotion.

Do not require a checkpoint after every tiny internal task.

---

## 38. Dogfood Pass 02 Gate

Define when another structured Dogfood pass becomes valuable.

Do not schedule Dogfood Pass 02 immediately after the first backend model.

Recommended criterion:

> Enough of the new planning loop exists that a user can author Goals/Demand, derive Capacity, receive a Proposal, explicitly accept it, see resulting schedule authority, and execute/report it.

Determine exact gate from evidence.

---

## 39. Implementation Task Granularity

Define how future canonical implementation tasks should be cut.

Tasks should normally be small enough to:

* have one primary semantic responsibility;
* preserve buildability;
* include tests;
* include migration when inseparable;
* produce reviewable diffs;
* complete within one focused implementation session where practical.

But tasks must not split an authority transition into unsafe externally reachable states.

---

## 40. Roadmap Numbering

Recommend a durable numbering model for future implementation tasks.

Consider:

* phase.task numbering;
* increment.task numbering;
* domain-prefixed tasks.

Preserve continuity with prior DayFrame task conventions where useful.

Do not renumber historical tasks.

---

## 41. Next Phase Naming

Now that dependencies and scope are known, determine whether the next implementation program should formally become:

### Phase 8

or another explicitly justified name/number.

Do not assume Phase 8 merely because Phase 7 was last.

If selecting Phase 8, provide a descriptive phase name that reflects its coherent product/architecture objective.

Examples are illustrative only:

* Phase 8 — Planning Intelligence Foundation
* Phase 8 — Capacity & Goal Planning
* Phase 8 — Constructive Planning
* Phase 8 — Goal-to-Capacity Planning

Choose based on the actual roadmap.

The name should describe the user/product capability being built, not merely internal architecture.

---

## 42. Phase Boundary Strategy

Determine whether the complete post-Phase-7 program belongs in:

### one large implementation phase

or:

### multiple sequential implementation phases.

Do not create excessive phases for individual domains.

A phase should correspond to a coherent user/product capability and meaningful dogfood checkpoint.

If multiple phases are warranted, name and bound them.

---

## 43. Critical Path vs Full Program

Produce both:

### Critical Path

Minimum coherent implementation sequence required to deliver:

```text
Goal
→ Demand
→ Capacity
→ Allocation
→ Proposal
→ explicit acceptance
→ scheduled Goal work
```

### Full Program

Everything required to complete alignment, including:

* Composition;
* Planner convergence;
* Live Opportunity;
* learning;
* Summary;
* Teach;
* profiles;
* independent Dogfood polish.

This distinction prevents secondary work from obscuring the core differentiator.

---

## 44. Recommended Sequence Matrix

Produce:

| Order | Increment | User Capability Added | Architectural Domains | Depends On | Dogfood Items | Migration | Dogfood Gate? |
| ----: | --------- | --------------------- | --------------------- | ---------- | ------------- | --------- | ------------: |

This is a principal output.

The ordering must be justified.

---

## 45. Parallelization Matrix

Produce:

| Increment | Can Run Parallel With | Must Not Precede | Shared Files / Risk | Recommended Coordination |
| --------- | --------------------- | ---------------- | ------------------- | ------------------------ |

Assume implementation may still be performed serially.

The purpose is architectural clarity, not maximizing concurrency.

---

## 46. Critical Path Matrix

Produce:

| Step | Required Capability | Why Critical | Blocking Dependencies | Exit Condition |
| ---: | ------------------- | ------------ | --------------------- | -------------- |

The final critical-path exit must establish explicit accepted Goal allocation into scheduled reality.

---

## 47. Surface Evolution Matrix

Produce:

| Increment | Teach | Month | Review Schedule | Today / Live | Summary |
| --------- | ----- | ----- | --------------- | ------------ | ------- |

Use:

* unchanged;
* minimally exposed;
* extended;
* converged;
* deferred.

This prevents premature surface redesign.

---

## 48. Migration Timeline Matrix

Produce:

| Increment | Persisted Models Added/Changed | Migration | Compatibility Maintained | Retirement Enabled |
| --------- | ------------------------------ | --------- | ------------------------ | ------------------ |

Profiles should appear only when their retirement becomes safe.

---

## 49. Dogfood Delivery Matrix

Produce:

| Finding ID | Roadmap Increment / Lane | Delivery Type | Validation |
| ---------- | ------------------------ | ------------- | ---------- |

Every roadmap-obligated finding from the Alignment Strategy must appear.

Deferred findings must say `Deferred`.

---

## 50. Regression Matrix

Produce:

| Existing Capability | Must Remain Green Through | Key Suites / Invariants | Special Risk |
| ------------------- | ------------------------- | ----------------------- | ------------ |

Include DF-006.

---

## 51. Risk-Ordered Review

For each major increment assess:

* semantic risk;
* migration risk;
* history risk;
* UI risk;
* performance risk;
* regression risk.

Use:

* Low;
* Moderate;
* High;
* Critical.

Do not use risk alone to reorder dependencies incorrectly.

---

## 52. Performance Considerations

Identify roadmap points requiring performance attention.

At minimum:

* broad Planning-Data Horizon;
* Capacity interval derivation;
* many Goals/Demands;
* feasibility enumeration;
* competing Demand;
* Proposal ranking;
* Month queries;
* Friction volume;
* history resolution;
* Summary analytics.

Do not prematurely optimize before semantic correctness.

---

## 53. Accessibility Considerations

Accessibility remains architectural quality.

Identify roadmap increments where new controls/workflows require:

* keyboard behavior;
* focus management;
* accessible names;
* status announcements;
* non-color state distinction;
* mobile readability;
* scalable lists/grouping.

Carry weekday-control and advanced-authority findings.

---

## 54. Observability / Diagnostic Requirements

The roadmap should improve DayFrame's ability to answer:

> Why is this here?

and:

> What authority caused this?

Require diagnostic provenance at appropriate increments for:

* Work;
* Commitment;
* composite support;
* Capacity exclusion;
* Demand;
* Allocation;
* Proposal;
* Accepted Allocation;
* Friction;
* publication;
* Live Opportunity;
* execution;
* Progress.

DF-006 demonstrates why this matters.

---

## 55. Rollback / Recovery Strategy

For high-risk semantic migrations, specify roadmap expectations for:

* versioned backup before migration;
* recovery/quarantine;
* no destructive rewrite until new version validated;
* migration idempotence where practical;
* historical readability;
* safe failure.

Do not design implementation details beyond roadmap level.

---

## 56. Release / Dogfood Strategy

Determine whether increments should be:

* internally complete but hidden;
* available behind a bounded feature flag;
* immediately user-visible;
* activated only at checkpoint.

Do not require feature flags by default.

Use them only where they materially protect coherence or migration.

---

## 57. What Must Not Enter the Critical Path

Explicitly classify non-blocking items.

At minimum assess:

* native timer;
* future input adapters;
* generalized templates/scenarios replacing profiles;
* advanced learning automation;
* visual polish unrelated to semantic usability.

Keep valid enhancements without allowing them to delay the core planning loop.

---

## 58. What Must Enter the Critical Path

At minimum evaluate:

* Goal Structure;
* Demand;
* Goal Priority;
* Capacity;
* feasibility;
* Allocation;
* Proposal;
* ProposalDecision;
* Accepted Allocation;
* realization;
* provenance;
* freshness;
* migration;
* minimum Planner exposure.

Composition should enter the critical path wherever correct Capacity/Proposal semantics require it.

Do not omit it merely to shorten the roadmap if doing so would make Capacity materially wrong.

---

## 59. Roadmap Decisions

Create:

`P7-ROAD-DEC-01`, `P7-ROAD-DEC-02`, etc.

Each must contain:

* **Decision**
* **Architectural Basis**
* **Alignment Basis**
* **Dependency Reasoning**
* **Dogfood Impact**
* **Migration Impact**
* **User Capability**
* **Roadmap Consequence**

At minimum create decisions for:

1. overall critical path;
2. initial cross-cutting foundation;
3. Goal Structure placement;
4. Goal Demand placement;
5. Goal Priority placement;
6. Composition placement;
7. Capacity placement;
8. Feasibility placement;
9. Competing Demand placement;
10. Allocation placement;
11. Proposal atomic boundary;
12. ProposalDecision/Accepted Allocation;
13. realization;
14. planning horizons;
15. Month evolution;
16. Review Schedule evolution;
17. publication/history extension;
18. Live Opportunity;
19. learning/preference promotion;
20. Summary evolution;
21. Teach evolution;
22. profiles retirement;
23. backups/migrations;
24. independent UX lane;
25. DF-006;
26. regression lane;
27. Dogfood Pass 02 gate;
28. checkpoint strategy;
29. task granularity;
30. roadmap numbering;
31. next phase name;
32. phase boundary strategy;
33. critical path vs full program;
34. architecture reopen;
35. roadmap readiness.

---

## 60. Roadmap Phase Proposal

After sequencing, propose the next implementation phase or phases.

For each proposed phase provide:

* number;
* name;
* user-facing objective;
* architectural scope;
* first capability;
* final capability;
* Dogfood checkpoint;
* explicit exclusions.

Do not create detailed implementation tasks for every phase here.

The roadmap is allowed to establish phase boundaries; subsequent canonical tasks will implement them.

---

## 61. First Implementation Increment

Identify the first coherent implementation increment after the roadmap.

Specify:

* objective;
* domains;
* why first;
* prerequisites;
* expected task decomposition;
* what must remain unchanged;
* completion gate.

Do not write the actual implementation task yet.

---

## 62. First Canonical Task Recommendation

Recommend the subject of the first future DayFrame Canonical Task Block.

Provide only:

* proposed task number;
* proposed title;
* one-paragraph purpose.

Do not draft the task itself.

This gives the next session an unambiguous starting point.

---

## 63. Architecture Reopen Check

Explicitly answer:

> Did roadmap sequencing uncover any contradiction that requires reopening accepted architecture?

Expected:

**No.**

If Yes, identify the exact contradiction and stop phase assignment dependent on it.

Do not reopen architecture for ordinary implementation choices.

---

## 64. Roadmap Readiness Gate

Select exactly one:

### RM-A — Ready for Implementation

Choose when:

* roadmap sequence is coherent;
* phase boundaries are established;
* first increment is known;
* migrations are bounded;
* Dogfood findings are routed;
* no semantic blocker remains.

### RM-B — One Bounded Implementation Design Needed

Choose only if one exact implementation design decision blocks the first increment.

Name it.

### RM-C — Architecture Reopen Required

Choose only for genuine Intended Truth contradiction.

Do not begin implementation.

---

## 65. Required Result Structure

The roadmap artifact must contain at minimum:

1. Executive Roadmap
2. Scope
3. Governing Evidence
4. Alignment Strategy Baseline
5. Roadmap Principles
6. Current Foundation Baseline
7. Dependency Graph
8. Critical Path
9. Parallel Work Lanes
10. Roadmap Unit
11. Entry / Exit Criteria
12. Cross-Cutting Foundation
13. Goal Structure
14. Goal Demand / Priority
15. Commitment Composition
16. Capacity
17. Goal-Specific Feasibility
18. Competing Demand / Allocation
19. Constructive Proposal / Decision / Accepted Allocation
20. Realization
21. Planning-Data Horizon / Proposal Horizon / Review Scope
22. Month / Planner Evolution
23. Review Schedule Evolution
24. Publication / History
25. Live Opportunity / Found Time
26. Learning / Preference Promotion
27. Summary / Learn
28. Teach
29. Profiles / Backups
30. Independent UX / Polish Lane
31. Regression Preservation Lane
32. Migration Strategy
33. Documentation / Checkpoint Strategy
34. Publication Checkpoints
35. Dogfood Pass 02 Gate
36. Implementation Task Granularity
37. Roadmap Numbering
38. Phase Naming
39. Phase Boundary Strategy
40. Critical Path vs Full Program
41. Recommended Sequence Matrix
42. Parallelization Matrix
43. Critical Path Matrix
44. Surface Evolution Matrix
45. Migration Timeline Matrix
46. Dogfood Delivery Matrix
47. Regression Matrix
48. Risk-Ordered Review
49. Performance Considerations
50. Accessibility Considerations
51. Observability / Diagnostics
52. Rollback / Recovery
53. Release / Dogfood Strategy
54. Critical-Path Inclusions
55. Critical-Path Exclusions
56. Roadmap Decisions
57. Proposed Implementation Phase(s)
58. First Implementation Increment
59. First Canonical Task Recommendation
60. Remaining Unknowns
61. Architecture Reopen Check
62. Roadmap Readiness Gate
63. Conclusions
64. Recommended Next Step
65. Completion Statement

---

## 66. Validation

This is primarily a synthesis task.

Run only enough repository inspection/testing to verify that the implementation baseline and existing roadmap/governance structure have not materially changed since the Alignment Strategy.

At minimum:

* inspect existing roadmap files;
* inspect current repository status;
* verify relevant current-state/governance files;
* verify the Alignment Strategy artifact exists;
* verify major implementation foundation locations where roadmap sequencing depends on them.

Do not rerun large suites merely to reproduce evidence already validated by the Alignment Strategy unless source changes require it.

Report all commands used.

No production or test modification is permitted.

---

## 67. Relationship to Existing Roadmap

Locate the existing:

`Implementation_Roadmap.md`

or exact current equivalent.

Determine:

* its exact path;
* what implementation program it governed;
* whether it should remain historical;
* whether the new roadmap supersedes it prospectively;
* whether any unfinished item remains relevant.

Do not overwrite it.

Do not silently rename it.

The new roadmap should state its relationship to the earlier roadmap explicitly.

---

## 68. Repository Modification Verification

Before completion:

1. inspect repository status;
2. record pre-existing modifications;
3. locate the established roadmap directory;
4. locate the previous Implementation Roadmap;
5. locate the Post-Phase-7 Alignment Strategy;
6. create only the required roadmap result;
7. do not modify production;
8. do not modify tests;
9. do not modify architecture;
10. do not modify audits;
11. do not modify the Alignment Strategy;
12. do not modify the earlier roadmap;
13. do not modify governance;
14. do not create implementation tasks;
15. reopen the result artifact;
16. verify matrices and decisions;
17. inspect repository status afterward;
18. verify the roadmap result was the sole task-created repository write.

---

## 69. Completion Criteria

The task is complete only when:

* [ ] the existing roadmap location was verified;
* [ ] the earlier Implementation Roadmap was located and preserved;
* [ ] the Post-Phase-7 Alignment Strategy was used as governing implementation strategy;
* [ ] accepted architecture remained authoritative;
* [ ] every roadmap-obligated Dogfood finding was routed;
* [ ] DF-006 remained regression/observability work rather than speculative fix;
* [ ] current foundations were identified and protected;
* [ ] dependency graph was created;
* [ ] critical path was identified;
* [ ] parallel lanes were identified;
* [ ] roadmap increment semantics were defined;
* [ ] entry and exit criteria were defined;
* [ ] cross-cutting foundation needs were bounded;
* [ ] Goal Structure was sequenced;
* [ ] Goal Demand was sequenced;
* [ ] Goal Priority was sequenced;
* [ ] Composition was sequenced;
* [ ] Capacity was sequenced;
* [ ] Feasibility was sequenced;
* [ ] Competing Demand was sequenced;
* [ ] Allocation was sequenced;
* [ ] Proposal/ProposalDecision/Accepted Allocation were treated as a coherent authority transition;
* [ ] realization was sequenced;
* [ ] planning horizons were sequenced;
* [ ] Month evolution was sequenced;
* [ ] Review Schedule evolution was sequenced;
* [ ] publication/history extension was sequenced;
* [ ] Live Opportunity was sequenced after ordinary Proposal;
* [ ] learning/preference promotion was sequenced after sufficient history;
* [ ] Summary evolution was sequenced;
* [ ] Teach evolution was sequenced;
* [ ] profile retirement was safely sequenced;
* [ ] backups remained independent;
* [ ] independent UX/polish items were classified Safe Now / Ride With Increment / Defer;
* [ ] regression preservation lane was defined;
* [ ] migration strategy accompanied semantic changes;
* [ ] documentation/checkpoint expectations were defined;
* [ ] meaningful Dogfood checkpoints were defined;
* [ ] Dogfood Pass 02 gate was defined;
* [ ] implementation task granularity was defined;
* [ ] roadmap numbering was selected;
* [ ] next implementation phase naming was explicitly decided;
* [ ] phase boundaries were justified;
* [ ] critical path was separated from full program;
* [ ] Recommended Sequence Matrix was completed;
* [ ] Parallelization Matrix was completed;
* [ ] Critical Path Matrix was completed;
* [ ] Surface Evolution Matrix was completed;
* [ ] Migration Timeline Matrix was completed;
* [ ] Dogfood Delivery Matrix was completed;
* [ ] Regression Matrix was completed;
* [ ] risks were assessed;
* [ ] performance considerations were addressed;
* [ ] accessibility considerations were addressed;
* [ ] diagnostic/provenance requirements were addressed;
* [ ] rollback/recovery expectations were addressed;
* [ ] release/dogfood strategy was addressed;
* [ ] critical-path inclusions were explicit;
* [ ] critical-path exclusions were explicit;
* [ ] all required `P7-ROAD-DEC-*` decisions exist;
* [ ] proposed implementation phase(s) were defined;
* [ ] first implementation increment was identified;
* [ ] first future canonical task subject was recommended;
* [ ] architecture reopen was explicitly assessed;
* [ ] exactly one roadmap readiness classification was selected;
* [ ] no implementation work was performed;
* [ ] no implementation task was drafted;
* [ ] no production code changed;
* [ ] no tests changed;
* [ ] no architecture/audit/alignment/governance file changed;
* [ ] earlier roadmap remained unchanged;
* [ ] exact result artifact was created;
* [ ] result artifact was reopened and verified;
* [ ] repository status was inspected;
* [ ] result artifact was the sole task-created repository write.

---

## 70. Final Completion Statement

End the roadmap artifact with exactly:

> **Post-Phase-7 Implementation Roadmap complete.**
>
> The roadmap converts DayFrame's accepted post-Phase-7 architecture, completed Implementation Alignment Strategy, reconciled Dogfood Pass 01 evidence, and current executable foundations into a dependency-ordered implementation program; preserves the deterministic scheduling, user-day, recurrence, Preview, Friction, decision, publication, execution, Progress, persistence, backup, and surface foundations that remain architecturally sound; sequences Goal Structure, Goal Demand and Priority, Commitment Composition, Capacity, Goal-Specific Feasibility, competing Demand, Allocation, Constructive Proposal, ProposalDecision, Accepted Allocation, realization, planning-horizon separation, Planner/Review convergence, publication/history extension, Live Opportunity, learning/promotion, Summary, Teach, and compatibility work according to their semantic dependencies; keeps migrations, provenance, freshness, explainability, regression protection, accessibility, diagnostics, and historical compatibility attached to the increments that require them; routes every remaining Dogfood obligation—including bounded historical DF-006—into implementation, regression, UX, polish, preservation, or explicit deferral; distinguishes the critical path to DayFrame's core Commitments-to-Capacity-to-Goals-to-Proposal-to-user-authority loop from the complete longer-term alignment program; establishes meaningful implementation and Dogfood checkpoints; determines the next implementation phase name and boundaries only after sequencing the work; identifies the first coherent implementation increment and future canonical task starting point; and establishes whether DayFrame is ready to resume implementation without another architecture or audit cycle.

The final Codex response must state:

> **Saved artifact:** Report the exact verified roadmap result path.
>
> **Repository modifications:** The required Post-Phase-7 Implementation Roadmap result artifact was the sole task-created repository write.
>
> **Earlier roadmap:** Report its exact path and confirm it remains unchanged.
>
> **Critical path:** Summarize the selected minimum sequence to explicit accepted Goal allocation and scheduled reality.
>
> **Next implementation phase:** Report the selected phase number and descriptive name, or explain why phase assignment remains deferred.
>
> **Phase structure:** Report whether the full program is one phase or multiple phases.
>
> **First implementation increment:** Report its name and objective.
>
> **First future canonical task:** Report the recommended task number and title.
>
> **Dogfood Pass 02 gate:** State when the next structured Dogfood pass should occur.
>
> **DF-006:** Confirm it remains RC7 / BR5 / S2 and is carried as regression/observability work rather than speculative repair.
>
> **Architecture reopen:** Yes or No.
>
> **Roadmap readiness:** Report RM-A, RM-B, or RM-C.
>
> **Recommended next step:** If RM-A, begin the first implementation increment through a separate DayFrame Canonical Task Block.
