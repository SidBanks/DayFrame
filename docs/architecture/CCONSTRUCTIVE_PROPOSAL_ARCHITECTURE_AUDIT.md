# Constructive Proposal Architecture Audit

## Status

Ready for audit.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Read-only architecture and implementation-alignment audit investigating DayFrame's current constructive recommendation, planning-candidate, decision, scheduling-authority, Live-opportunity, and Found-Time machinery.

This audit must determine what currently exists between derived planning information and explicit user authorization, distinguish constructive Proposal from corrective Friction, and establish whether DayFrame has reusable primitives for a future first-class Proposal lifecycle.

This audit explicitly includes **Found Time / Live Opportunity** because the preceding Capacity, Goal Demand / Allocation, Goal Structure, and Commitment Composition specifications have now established the upstream semantic boundaries required to evaluate it correctly.

This task must **not** design or implement the final Proposal architecture.

This task is read-only with respect to the existing repository.

**The required audit result artifact is the sole permitted repository write.**

---

## 1. Objective

Determine how DayFrame currently represents—or fails to represent—the constructive planning step between deterministic engine reasoning and explicit user authorization.

The central architectural question is:

> **Does DayFrame currently possess a coherent constructive Proposal lifecycle capable of taking derived Capacity, eligible normalized Goal Demand, feasible operational footprints, priorities, policies, and relevant historical context; presenting one or more explainable recommendations; obtaining explicit user acceptance, modification, or rejection; and converting accepted intent into scheduled authority without confusing generated reasoning with user-authored truth?**

The audit must additionally answer:

> **Can the same Proposal boundary safely handle short-horizon Found Time / Live Opportunity created when execution diverges from the existing plan, without rewriting historical authority or silently scheduling Goal work?**

---

## 2. Why This Audit Happens Now

The following upstream seams have now been normatively resolved.

### Capacity

Capacity is deterministic, explainable, user-day-owned discretionary availability.

Capacity is:

* derived;
* demand-neutral;
* non-authoritative;
* interval-based;
* liability-aware;
* distinct from allocation and Proposal.

### Goal Demand / Allocation

Goals may express independently identified resource-seeking Demand.

The accepted planning chain includes:

```text
Goal + Demand Intent
→ Demand Projection
→ Goal-Specific Feasibility
→ Competing Demand
→ Allocation
→ Proposal
→ User Decision
→ Accepted Allocation
→ Scheduled Goal Work
```

Allocation is derived and provisional.

### Goal Structure

Goal Structure now resolves:

* Subgoals;
* Milestones;
* dependencies;
* Structural Eligibility;
* Demand normalization/accounting;
* Goal Priority structural scope;
* Progress contribution;
* multi-path deduplication.

Proposal is not responsible for traversing Goal Structure and inventing those semantics.

### Commitment Composition

Commitment Composition now resolves:

* Attached Activities;
* Buffers;
* deterministic occurrence pairing;
* required/optional components;
* Composite Footprint;
* Composite Feasibility;
* Composite Liability;
* Goal-Demand overhead;
* Scheduled Support Activity;
* composite decisions;
* execution variance;
* Found-Time protection of remaining obligations.

Proposal therefore can be evaluated against operationally feasible time footprints rather than core activity duration alone.

These specifications establish the upstream truth required to investigate Proposal directly.

---

## 3. Found Time Is Explicitly In Scope

Found Time was intentionally deferred until this audit.

Use the following working definition as architectural context:

> **Found Time is newly available discretionary time discovered during execution because actual conditions diverged from the currently authorized plan.**

Examples include:

* a meeting is canceled;
* Work ends early;
* an errand takes less time;
* a Commitment is intentionally skipped;
* an Attached Activity finishes early;
* a Buffer becomes releasable;
* the user realizes unexpectedly that time is available.

Found Time is **not**:

* a Goal;
* a Commitment;
* Goal Demand;
* user-authored recurring availability;
* retroactive revision of the original plan;
* automatic permission to schedule something else.

The audit must determine how current executable primitives could support the conceptual chain:

```text
Authorized Plan
→ Execution Divergence
→ Found Time / Live Opportunity
→ current Live Capacity
→ unmet eligible normalized Goal Demand
→ short-horizon Feasibility / Allocation
→ constructive Proposal
→ explicit user decision
→ Scheduled Goal Work or direct execution
→ Execution / History
```

This flow is conceptual and not presumed implemented.

---

## 4. Core Proposal Principle

Use this epistemic boundary throughout the audit:

> **Proposal is the boundary between engine reasoning about what could be done and user authority over what will be done.**

Proposal is constructive.

Friction is corrective.

Proposal asks:

> **Given available Capacity and what matters, how could DayFrame use it?**

Friction asks:

> **Something already authorized cannot coexist. What should change?**

The audit must determine whether current implementation respects, approximates, or lacks this distinction.

---

## 5. Required Epistemic States

Investigate current executable support for each state:

1. Authored truth.
2. Derived truth.
3. Planning candidate.
4. Allocation/recommendation reasoning.
5. Proposed action.
6. Accepted decision.
7. Modified-and-accepted decision.
8. Rejected proposal.
9. Scheduled reality.
10. Executed reality.
11. Historical evidence.
12. Learned tendency.
13. Reusable preference.
14. Found-Time opportunity.
15. Direct unplanned user action.

Determine which are:

* first-class;
* partially represented;
* implicit;
* conflated;
* absent.

---

## 6. Evidence Rules

Every implementation claim must be classified as:

### Confirmed

Established by executed production code and/or deterministic tests.

### Inferred

Strongly suggested by implementation structure but not directly demonstrated.

### Not Found

Absent after reasonable semantic and production-path search.

Do not infer Proposal merely from:

* a generated preview;
* a list of scheduled blocks;
* an unplaced candidate;
* a suggested Friction fix;
* a button labeled recommendation;
* generic use of the word “suggested”;
* existing accepted decisions;
* generated schedules;
* UI language alone.

Cite exact:

* file paths;
* symbols;
* relevant line ranges where practical;
* deterministic tests where behavior claims require them.

---

## 7. Primary Audit Questions

Answer at minimum:

1. Does DayFrame currently have a first-class Proposal object?
2. Does it have a constructive Proposal lifecycle?
3. Does preview generation itself constitute Proposal?
4. Are automatically placed recurring occurrences proposed or already derived from authored scheduling authority?
5. Does any current engine path construct recommendations for uncommitted Capacity?
6. Do Goals feed schedule generation?
7. Does Goal Demand feed schedule generation?
8. Does Goal Priority affect constructive planning?
9. Does Capacity exist as an executable input today?
10. Does current placement geometry substitute for Capacity?
11. Does any current mechanism compare competing Goal demands?
12. Does any current mechanism allocate discretionary Capacity among Goals?
13. Is there an accept action for constructive recommendations?
14. Is there a modify action for constructive recommendations?
15. Is there a reject action?
16. Is rejection historically represented?
17. Does acceptance create explicit scheduling authority?
18. Does modification preserve original recommendation provenance?
19. Can a user directly authorize Goal work without Proposal?
20. Can one-off accepted Goal work remain distinct from recurring scheduling authority?
21. Does current `PlanDecision` generalize beyond Friction?
22. Does current accepted-choice infrastructure provide reusable Proposal primitives?
23. Is SuggestedFix infrastructure constructive or corrective only?
24. Can current Friction recommendations safely serve as general Proposal?
25. Does current history freeze decision-time reasoning?
26. Can current history explain why something was recommended?
27. Does execution preserve proposed-vs-direct provenance?
28. Is there current Found-Time detection?
29. Can execution variance expose newly free intervals?
30. Can cancellation expose newly free intervals?
31. Can current system recompute Capacity during Live execution?
32. Can Found Time be evaluated against unmet Goal Demand?
33. Can current system make a short-horizon recommendation?
34. Can the user spontaneously use Found Time for a Goal without prior Proposal?
35. Can such direct execution be logged without pretending it was scheduled?
36. Can Proposal safely incorporate Commitment Composition footprint?
37. Can Proposal distinguish productive Goal work from required overhead?
38. Can Proposal preserve Goal Structure provenance without traversing structure itself?
39. Can Proposal distinguish insufficient Capacity from Friction?
40. Can Proposal distinguish no useful recommendation from planning failure?
41. What current primitives are reusable?
42. Which apparent primitives are wrong abstractions?
43. What must be specified before implementation alignment can begin?
44. Is a Constructive Proposal Architecture Specification now warranted?

---

## 8. Current Planning Entry Points

Trace every current path that creates or revises planned schedule output.

At minimum inspect:

* `generateSchedulePreview`;
* store `generatePreview`;
* `reviseSchedulePreview`;
* recurrence expansion;
* Work generation;
* manual-event inclusion;
* candidate generation;
* candidate placement;
* accepted PlanDecision replay;
* Friction detection;
* suggested-fix generation;
* fix application;
* preview persistence/staleness;
* publication to historical plan.

Determine exactly where generated reasoning occurs and where user authority enters.

---

## 9. Preview Semantics

Audit `Preview` carefully.

Determine whether Preview represents:

* derived projection of existing authored authority;
* recommendation;
* candidate schedule;
* proposed schedule awaiting acceptance;
* mixture of these.

Answer:

> **Does generating Preview create any new user-authorized intent?**

If not, identify why Preview must not be equated with Proposal.

---

## 10. Automatic Placement

Audit automatically placed flexible recurring Commitments.

Determine whether their placement is:

* execution of previously authored scheduling authority;
* engine Proposal;
* heuristic;
* provisional recommendation.

Use recurrence/template authoring semantics and existing decisions to classify correctly.

Key question:

> **Does a user need to accept each automatically placed recurrence because DayFrame chose its exact time, or did the user already authorize deterministic placement through the recurring Commitment pattern?**

The audit must distinguish **repeated realization of prior authority** from **new discretionary Goal allocation**.

---

## 11. Planning Candidates

Inventory all current candidate-like objects.

Potentially include:

* `BlockCandidate`;
* `UnplacedCandidate`;
* scheduled block before publication;
* Friction context candidate;
* suggested fixes;
* Goal-linked occurrence;
* manual event;
* planning candidate/recommendation UI.

Determine whether any current candidate represents:

> “This is work DayFrame thinks you might choose to do.”

versus:

> “This is work already authorized but not yet geometrically placed.”

This distinction is central.

---

## 12. Candidate Semantics Matrix

Produce:

| Candidate-Like Object | Source Authority | Already Authorized? | Time-Owned Yet? | Engine Chooses Placement? | Requires User Acceptance? | Proposal Analogue? |
| --------------------- | ---------------- | ------------------: | --------------: | ------------------------: | ------------------------: | -----------------: |

Include every relevant current object.

---

## 13. Goals in Planning

Trace current Goal usage end-to-end.

Determine whether Goals currently influence:

* recurrence generation;
* candidate creation;
* candidate priority;
* placement;
* Friction;
* suggested fixes;
* PlanDecision;
* historical publication;
* execution;
* Summary.

The previous audits found Goal-to-execution provenance through Goal-linked Commitments but no Goal Demand engine path.

Confirm current truth.

---

## 14. Goal Demand Executable Support

Search for executable representation of:

* Demand Intent;
* Demand Projection;
* requested effort;
* minimum session;
* target session;
* splittability;
* Goal-specific timing;
* Goal Priority;
* competing Goal demand;
* Demand normalization;
* Demand satisfaction attribution.

Do not assume accepted architecture is implemented.

Classify current implementation.

---

## 15. Capacity Executable Support

Search for a first-class Capacity read model.

Distinguish:

* geometric openings;
* unoccupied time;
* candidate placement windows;
* Capacity as specified architecture.

Confirm whether the previous Capacity audit's executable classification remains accurate.

Determine whether Proposal currently has any actual Capacity input.

---

## 16. Current Constructive Recommendation Search

Search production code and tests for semantic concepts including:

* proposal;
* recommendation;
* recommend;
* candidate;
* allocate;
* allocation;
* suggest;
* opportunity;
* available;
* free time;
* spare time;
* capacity;
* goal work;
* planning option;
* alternative;
* what next;
* next action.

Separate:

* constructive recommendations;
* corrective Friction suggestions;
* display copy;
* dead code;
* tests.

---

## 17. Friction Suggested Fixes

Trace current Friction recommendation machinery.

Determine:

* inputs;
* suggestion types;
* ranking/order;
* deterministic behavior;
* explanation;
* applicability;
* acceptance path;
* persistence;
* replay;
* historical provenance.

Then answer:

> **Which parts are recommendation infrastructure, and which parts are semantically specific to corrective Friction?**

---

## 18. Proposal vs Friction Matrix

Produce:

| Concern                        | Constructive Proposal | Corrective Friction | Current Implementation |
| ------------------------------ | --------------------- | ------------------- | ---------------------- |
| Trigger                        |                       |                     |                        |
| Input authority                |                       |                     |                        |
| Capacity relationship          |                       |                     |                        |
| Goal Demand relationship       |                       |                     |                        |
| Existing conflict required?    |                       |                     |                        |
| Suggest alternatives?          |                       |                     |                        |
| User acceptance?               |                       |                     |                        |
| Rejection?                     |                       |                     |                        |
| Creates new scheduling intent? |                       |                     |                        |
| Modifies existing intent?      |                       |                     |                        |
| Historical provenance?         |                       |                     |                        |

---

## 19. SuggestedFix Reuse Assessment

Classify SuggestedFix infrastructure as:

* Directly Reusable;
* Reusable with Adaptation;
* Conceptually Related but Wrong Abstraction;
* Not Reusable.

Evaluate separately:

* deterministic generation;
* recommendation identity;
* explanation;
* option ranking;
* target references;
* acceptance;
* modification;
* rejection;
* historical preservation.

---

## 20. PlanDecision Audit

Trace `PlanDecisionV1` and related replay/applicability infrastructure.

Determine:

* exact target;
* supported actions;
* source/origin;
* accepted timestamp;
* stable ID;
* scope;
* replay;
* staleness;
* blocked/inapplicable states;
* persistence;
* backup/restore;
* user visibility.

Answer whether it represents:

* Proposal decision;
* Friction-resolution decision;
* general scheduling authority;
* one-occurrence override.

---

## 21. PlanDecision Reuse Boundary

Determine which concepts could be reused for future constructive Proposal:

* decision identity;
* acceptance timestamp;
* target identity;
* provenance;
* replay;
* staleness;
* applicability;
* persistence;
* visible accepted choices.

Determine what cannot be safely reused without new semantics.

---

## 22. Accepted Choices

Trace current Accepted Choices presentation and persistence.

Determine whether it records:

* user acceptance only;
* original recommendation;
* rejected alternatives;
* modification delta;
* scope;
* why the choice was made;
* decision-time context.

Assess whether Accepted Choice is currently sufficient historical authority for Proposal.

---

## 23. Accepted Choice vs Learned Preference

Use the accepted distinction:

### Accepted Choice

A user decision in one particular situation.

### Preference / Learned Rule

A reusable rule that may guide similar future situations.

Audit whether current implementation:

* preserves accepted choices;
* promotes them automatically;
* provides reusable preference authority;
* infers patterns;
* applies history to future decisions.

Do not infer learning merely from persisted decisions.

---

## 24. Proposal Acceptance

Search for any current constructive acceptance path.

Determine whether user can currently accept:

* generated schedule;
* individual generated placement;
* candidate recommendation;
* Goal work recommendation;
* Friction fix only.

Explicitly identify where acceptance is required and where generation alone becomes current preview state.

---

## 25. Proposal Modification

Search for a current pattern equivalent to:

```text
Proposal: Study Network+ for 45m at 19:00
User changes to 30m at 20:00
User accepts
```

Determine whether current infrastructure preserves:

* original proposal;
* modified result;
* delta;
* acceptance;
* final authority.

If only Friction fix modification exists, report that.

---

## 26. Proposal Rejection

Search for explicit rejection semantics.

Distinguish:

* close/dismiss UI;
* not clicking accept;
* candidate unplaced;
* rejected recommendation recorded as user decision.

Determine whether rejection currently creates historical evidence.

---

## 27. Rejection Authority

Assess whether future Proposal rejection needs to mean:

* no current scheduling authority;
* no automatic preference change;
* retained decision evidence;
* optional future learning input.

Audit current primitives that could preserve such semantics.

---

## 28. Direct User Authorization

Determine current ways a user can bypass recommendation and directly create schedule authority.

Examples:

* manual event;
* Commitment;
* recurrence;
* one-off occurrence decision.

This matters because future Proposal architecture should not require Proposal for all user action.

---

## 29. Direct Goal Work

Investigate whether user can currently say, in effect:

> “I spent 45 minutes on Network+ just now.”

without first scheduling it.

Trace:

* Goal Progress observations;
* execution records;
* historical occurrence requirements;
* Goal Activity;
* manual events;
* Goal links.

Determine whether direct unplanned Goal execution is currently representable and how.

---

## 30. Spontaneous Execution Boundary

This is a required Found-Time area.

Future architecture must distinguish:

### Proposed Found-Time Goal Work

```text
Found Time
→ Proposal
→ Accepted Allocation
→ Scheduled Goal Work
→ Execution
```

from:

### Direct / Spontaneous Goal Work

```text
Found Time
→ User independently chooses Goal work
→ direct/unplanned execution evidence
```

Audit whether current history/execution primitives can preserve that distinction.

---

## 31. Historical Publication Authority

Trace when schedule state becomes historical plan truth.

Determine:

* publication trigger;
* immutable occurrence creation;
* frozen Goal provenance;
* PlanDecision provenance;
* scheduling state;
* generated placement provenance.

Ask:

> **Would a future Proposal need to be accepted before historical publication considers the work authorized?**

Identify current boundary analogues.

---

## 32. Proposal Historical Provenance

Determine whether current history can preserve:

* original recommendation;
* recommendation alternatives;
* recommendation reason;
* decision-time Capacity;
* relevant Goal Demand;
* Goal Priority;
* Allocation result;
* composite footprint;
* user modification;
* acceptance/rejection;
* decision scope.

Classify each as current, partial, or missing.

---

## 33. Proposal Provenance Matrix

Produce:

| Decision-Time Fact  | Current Primitive | Preserved Today? | Needed for Future Proposal? | Historical Risk |
| ------------------- | ----------------- | ---------------: | --------------------------: | --------------- |
| Goal                |                   |                  |                             |                 |
| Demand              |                   |                  |                             |                 |
| Capacity            |                   |                  |                             |                 |
| Feasibility         |                   |                  |                             |                 |
| Goal Priority       |                   |                  |                             |                 |
| Allocation          |                   |                  |                             |                 |
| Composite footprint |                   |                  |                             |                 |
| Proposed placement  |                   |                  |                             |                 |
| Alternatives        |                   |                  |                             |                 |
| Explanation         |                   |                  |                             |                 |
| User delta          |                   |                  |                             |                 |
| Acceptance          |                   |                  |                             |                 |
| Rejection           |                   |                  |                             |                 |

---

## 34. Allocation Analogue Search

Investigate whether any existing system performs a semantic equivalent of Allocation.

Potential analogues:

* priority-sorted block placement;
* candidate sorting;
* opening search;
* SuggestedFix ranking;
* Friction severity;
* first-fit placement.

Determine whether these are:

* resource allocation;
* scheduling heuristics;
* ordering rules.

Do not call priority-based placement Goal Allocation without evidence.

---

## 35. Priority Semantics

Trace current priorities.

Distinguish:

* Commitment priority;
* occurrence priority;
* PlanDecision priority adjustment;
* Goal Priority if executable;
* SuggestedFix ordering/severity.

Determine whether current engine contains any reusable priority-comparison machinery for future Goal Allocation.

---

## 36. Heuristics vs User-Value Authority

Identify current engine heuristics.

Examples may include:

* first opening;
* priority sorting;
* Work-relative preference;
* preferred window;
* duration fit;
* deterministic tie-breaking.

Determine which may remain engine heuristics and which future Proposal decisions require explicit user-value policy.

Do not infer that an engine ordering encodes user preference.

---

## 37. Recommendation Explanation

Audit current explainability.

Do Friction suggestions explain:

* why a problem exists;
* why an option helps;
* what will change;
* what tradeoff results?

Do any constructive outputs explain why they were selected?

Determine reusable explanation primitives.

---

## 38. Recommendation Alternatives

Determine whether current engine ever presents multiple alternatives for one planning situation.

If so:

* how many;
* deterministic order;
* identities;
* ranking;
* user selection;
* accepted alternative provenance.

Distinguish Friction alternatives from constructive planning alternatives.

---

## 39. Proposal Cardinality

Audit current primitives relevant to future choice among:

* one recommendation;
* ranked alternatives;
* multiple independent recommendations;
* bundled recommendations.

Do not decide final Proposal cardinality, but identify implementation constraints.

---

## 40. Proposal Scope

Investigate whether current decision infrastructure can address:

* one occurrence;
* one user-day;
* one planning window;
* bounded repetition;
* recurring pattern.

Future Proposal may need one-off and bounded recommendations without creating recurring authority.

Assess current scope support.

---

## 41. Proposal Horizon

Determine what current planning horizons exist:

* preview range;
* cycle;
* user-day;
* week;
* month;
* historical publication window.

Dogfood identified planning-range/review-scope coupling.

Assess whether current engine has a distinct Proposal horizon or whether generated Preview horizon implicitly controls everything.

---

## 42. Planning Horizon vs Review Scope

Explicitly revisit the dogfood finding:

> A year planning range can create a year of Review Schedule/conflicts.

Determine current executable coupling among:

* authored planning range;
* preview generation range;
* Friction range;
* user-visible review scope;
* publication scope.

Proposal architecture may need a bounded recommendation horizon even if broader planning data exists.

Classify the current seam.

---

## 43. Short-Horizon Proposal

Determine whether any existing machinery can generate/reason over:

* current user-day only;
* next hour;
* next free interval;
* one newly found interval.

This is critical for Found Time.

If no such path exists, report **Not Found**.

---

## 44. Live / Today Surface

Trace current Today/Live functionality if implemented.

Determine:

* what current user-day state is shown;
* how current occurrence is identified;
* whether execution can be entered there;
* whether current time affects planning;
* whether any rescheduling occurs during Live use;
* whether Goal opportunities are surfaced.

Do not assume the approved UX architecture has been implemented.

---

## 45. Current-Time Dependency

Determine whether any schedule engine path uses actual current wall-clock time versus authored planning dates.

Future Found-Time Proposal needs “what can I do now?” semantics.

Audit current usage of:

* `Date.now`;
* current date;
* current time;
* evaluation cutoff;
* execution timestamp.

---

## 46. Execution Divergence

Trace how current system represents divergence from plan.

At minimum:

* completed;
* skipped;
* canceled if supported;
* user-reported actual duration;
* corrected execution;
* omitted plan occurrence;
* late/early actual timing if representable.

Determine whether divergence is evaluated against planned occurrence automatically.

---

## 47. Planned vs Actual Comparison

Determine whether current code computes:

* planned duration vs actual duration;
* scheduled start vs actual start;
* scheduled end vs actual end;
* planned occurrence vs skipped;
* planned Buffer vs released Buffer.

If not, identify reusable data that could support it.

---

## 48. Found-Time Detection

Search explicitly for:

* found time;
* free time;
* released time;
* reclaimed time;
* early finish;
* canceled meeting;
* spare time;
* unexpected availability;
* actual-vs-plan difference.

Determine whether Found Time exists in:

* production model;
* query;
* history;
* Summary;
* Today;
* recommendations.

Expected classification may be Not Found, but establish by evidence.

---

## 49. Found-Time Sources

Evaluate current executable support for detecting each source:

### A. Parent/Commitment canceled

### B. Commitment skipped

### C. Activity completed early

### D. Attached Activity completed early

### E. Buffer released

### F. Work ends early

### G. User manually declares availability

For each classify:

* planned truth available?
* actual truth available?
* difference computable?
* remaining obligations known?
* Capacity recomputable?
* Proposal trigger exists?

---

## 50. Found-Time Source Matrix

Produce:

| Found-Time Source | Planned Evidence | Actual Evidence | Difference Computable? | Remaining Obligations Known? | Live Capacity Derivable Today? | Current Proposal Path? |
| ----------------- | ---------------- | --------------- | ---------------------: | ---------------------------: | -----------------------------: | ---------------------: |

---

## 51. Found Time vs Capacity

Use accepted Capacity architecture.

Determine what executable work would be required to transform execution divergence into a current Capacity interval.

Distinguish:

* original planned Capacity;
* newly released interval;
* current/Live Capacity;
* time still protected by subsequent obligations;
* unresolved liability.

The audit must not simply label all freed clock time Capacity.

---

## 52. Found Time and Commitment Composition

Use the newly accepted composition architecture.

Examples:

```text
Appointment ends 20m early
→ Travel Home still required
```

```text
Commute finishes 15m early
→ next required component remains fixed
```

Determine which current execution primitives could support net available-time derivation and which are missing.

---

## 53. Found Time and Buffers

Determine whether current data can distinguish:

* a Buffer that existed in the plan;
* a Buffer intentionally released;
* activity time completed early.

Because Buffer is non-activity, it must not produce a fake execution record.

Audit current buffer historical preservation limitations.

---

## 54. Found Time and Goal Demand

Determine whether current executable system can ask:

> **Which unmet Goal Demand is eligible for this newly available interval?**

Trace current support for:

* unmet Demand;
* minimum useful session;
* splittability;
* target/cadence;
* Goal Priority;
* Structural Eligibility;
* composition footprint.

Classify current support.

---

## 55. Found Time and Goal Structure

Assess what future Proposal would need from Goal Structure:

* structurally eligible Demand;
* dependency reasons;
* normalized non-duplicative Demand;
* Goal Priority.

Confirm Proposal should consume these resolved outputs rather than traverse Goal Structure.

---

## 56. Found Time and Composition Footprint

Example:

```text
Found Time: 45m
Goal Demand: 30m workout
Travel: 20m each way
```

Core fits; operational footprint does not.

Determine whether current implementation can detect this.

This should be **Not Found** unless executable architecture says otherwise.

---

## 57. Found-Time Proposal

Audit whether any current flow resembles:

```text
new availability
→ candidate Goal work
→ feasible opportunity
→ user-facing recommendation
→ accept
→ schedule / execute
```

If absent, identify the closest reusable primitives.

---

## 58. Found-Time User Authority

Future Found-Time suggestions must not silently fill newly available time.

Audit current behavior for analogous automatic scheduling.

Determine which acceptance model is likely reusable.

Do not design final Proposal semantics yet.

---

## 59. Spontaneous Found-Time Use

Consider:

```text
User unexpectedly has 45m
User studies Network+ without asking DayFrame
```

Determine how current DayFrame can log:

* direct execution;
* Goal association;
* duration;
* Progress;
* unscheduled provenance.

Identify missing semantics.

The architecture must eventually preserve:

> **This happened directly; DayFrame did not propose it and it was not previously scheduled.**

---

## 60. Proposed vs Direct Execution

Produce:

| Scenario                       | Was There Proposal? | Was There Accepted Allocation? | Was It Scheduled? | Execution Exists? | Historical Provenance Needed |
| ------------------------------ | ------------------: | -----------------------------: | ----------------: | ----------------: | ---------------------------- |
| Planned recurring Commitment   |                     |                                |                   |                   |                              |
| Accepted constructive Proposal |                     |                                |                   |                   |                              |
| Modified Proposal              |                     |                                |                   |                   |                              |
| Rejected Proposal              |                     |                                |                   |                   |                              |
| Direct spontaneous Goal work   |                     |                                |                   |                   |                              |
| Found-Time Proposal accepted   |                     |                                |                   |                   |                              |
| Found-Time direct action       |                     |                                |                   |                   |                              |

Use current truth where implemented and mark future-required semantics separately.

---

## 61. Found Time as Learning Evidence

Audit whether current history can support future observation such as:

> “When unexpected 30–60 minute opportunities occur, the user often chooses Network+.”

Determine whether current system preserves enough provenance to distinguish:

* scheduled Goal work;
* proposed-and-accepted Goal work;
* spontaneous Goal work;
* unrelated execution.

Do not create learning rules.

---

## 62. Reusable Preference Boundary

Found-Time behavior may later suggest:

> “Prefer Network+ when unexpected 30–60m intervals appear.”

Such a pattern must not silently become authority.

Audit current preference/decision systems for any reuse.

---

## 63. Proposal and Accepted Choice Scope

Use accepted planning principle:

> **DayFrame may learn what I tend to choose without pretending it knows what I choose today.**

Determine whether current accepted-choice model can distinguish:

* this occurrence only;
* similar situations;
* recurring preference.

If not, report the missing scope semantics.

---

## 64. Proposal and History

Future Proposal history may need to preserve:

```text
At decision time:
Capacity = X
Goal Demand = Y
Priority = Z
Composite cost = Q
Alternatives = A/B/C
Proposal = B
User changed B → B'
User accepted B'
```

Determine which current systems can freeze parts of this chain.

---

## 65. Historical Reasoning Snapshot

Assess whether future Proposal needs:

* full derived input snapshots;
* immutable references/fingerprints;
* selected decisive evidence only.

Do not select final model unless evidence constrains it.

Identify reusable historical snapshot patterns.

---

## 66. Proposal Staleness

Audit current staleness semantics for:

* Preview;
* PlanDecision;
* SuggestedFix;
* historical publication.

Determine reusable patterns for future Proposal when:

* Capacity changes;
* Goal Demand changes;
* Goal Priority changes;
* Goal Structure changes;
* composition changes;
* current time advances;
* Found Time interval shrinks;
* another commitment is accepted.

---

## 67. Proposal Applicability

Determine whether current infrastructure distinguishes:

* stale;
* no longer applicable;
* blocked;
* already accepted;
* superseded.

Assess `PlanDecision` / SuggestedFix reuse.

---

## 68. Proposal Identity

Search for recommendation IDs or stable option identity.

Determine what current mechanisms could support future:

* Proposal ID;
* option ID;
* Allocation reference;
* decision reference;
* modification lineage.

Do not design schema.

---

## 69. Determinism

Identify deterministic requirements already implied.

Future Proposal reasoning should produce semantically equivalent outputs for equivalent inputs.

Audit current deterministic behavior in:

* generation;
* candidate sorting;
* Friction;
* SuggestedFix;
* decision replay.

Identify non-semantic ordering hazards.

---

## 70. Proposal Ranking

Determine whether current engine ranks recommendations.

If SuggestedFix ordering exists, identify what it represents.

Do not assume Friction ranking can become Goal Proposal ranking.

Future Goal Proposal ranking may involve:

* Goal Priority;
* Allocation Policy;
* feasibility;
* Capacity cost;
* target pressure;
* accepted-choice guidance.

Determine which are executable today.

---

## 71. Allocation Policy Executable Support

Search for any user-authorized policy governing discretionary distribution.

Examples:

* fairness;
* priority precedence;
* minimum viable satisfaction;
* continuity;
* fragmentation avoidance;
* deadline pressure;
* diminishing returns.

Classify as implemented, analogue, or absent.

---

## 72. Recommendation Confidence / Explanation

Determine whether current recommendations expose:

* certainty;
* missing information;
* assumptions;
* infeasibility;
* reasons not to recommend.

Future Proposal must not pretend certainty when upstream state is unknown/stale.

Assess current support.

---

## 73. No-Proposal State

Investigate whether any current path explicitly represents:

> “DayFrame has no useful constructive recommendation right now.”

Distinguish from:

* error;
* no candidate;
* no Capacity;
* all Demands satisfied;
* stale state;
* infeasible Demand.

This is a potentially important future state.

---

## 74. Proposal Failure vs Friction

Define evidence-grounded current distinctions relevant to future architecture:

### No Capacity

Not necessarily Friction.

### Demand cannot fit

Feasibility result.

### Competing Demands exceed Capacity

Allocation problem.

### No worthwhile option

Proposal limitation.

### Already-authorized facts conflict

Friction.

Audit whether current implementation conflates these.

---

## 75. Preview / Proposal / Schedule Truth Matrix

Produce:

| Surface/Object               |   Derived? | Proposed? | Accepted? | Scheduled Authority? | Historical? | User Must Approve? |
| ---------------------------- | ---------: | --------: | --------: | -------------------: | ----------: | -----------------: |
| Authored Commitment          |            |           |           |                      |             |                    |
| BlockCandidate               |            |           |           |                      |             |                    |
| ScheduledBlock in Preview    |            |           |           |                      |             |                    |
| SuggestedFix                 |            |           |           |                      |             |                    |
| PlanDecision                 |            |           |           |                      |             |                    |
| Historical occurrence        |            |           |           |                      |             |                    |
| Future constructive Proposal | N/A future |           |           |                      |             |                    |

This matrix must make the epistemic differences explicit.

---

## 76. Current Proposal Support Classification

Assign one primary classification:

### CP1 — First-Class Constructive Proposal Domain

DayFrame has explicit constructive Proposal identity, inputs, options, user decision lifecycle, and conversion into scheduled authority.

### CP2 — Partial Constructive Proposal Domain

A constructive Proposal domain exists but major pieces are incomplete.

### CP3 — Recommendation / Acceptance Primitives Without Constructive Proposal

Reusable recommendation, decision, provenance, or replay infrastructure exists, but constructive Capacity→Goal Proposal is absent.

### CP4 — Corrective Friction Recommendation Only

Recommendation machinery exists only in Friction resolution.

### CP5 — No Meaningful Proposal Support

No useful Proposal-adjacent machinery exists.

A combined classification may be used only if clearly justified, for example:

> CP3 overall, with CP4 as the only current recommendation producer.

---

## 77. Found-Time Support Classification

Assign one primary classification:

### FT1 — First-Class Found Time / Live Opportunity

Execution divergence produces current availability and planning recommendations.

### FT2 — Partial Found-Time Domain

Some explicit Found-Time objects/queries exist.

### FT3 — Planned/Actual Primitives Without Found-Time Semantics

Historical execution contains enough data for some variance calculation, but no first-class Found Time exists.

### FT4 — Availability Analogues Only

Current schedule geometry could be recomputed manually, but execution divergence is not connected.

### FT5 — No Meaningful Support

No relevant executable foundation.

Classify independently:

* early-completion detection;
* cancellation release;
* skipped-occurrence release;
* Buffer release;
* Live Capacity;
* unmet Goal Demand query;
* short-horizon feasibility;
* short-horizon Allocation;
* Found-Time Proposal;
* spontaneous Goal execution;
* Found-Time historical provenance.

---

## 78. Required Current-vs-Needed Matrix

Produce:

| Concern                  | Current Behavior | Evidence | Classification | Needed Before Proposal Spec? | Risk if Deferred |
| ------------------------ | ---------------- | -------- | -------------- | ---------------------------- | ---------------- |
| Proposal identity        |                  |          |                |                              |                  |
| Proposal options         |                  |          |                |                              |                  |
| Proposal explanation     |                  |          |                |                              |                  |
| Acceptance               |                  |          |                |                              |                  |
| Modification             |                  |          |                |                              |                  |
| Rejection                |                  |          |                |                              |                  |
| Allocation input         |                  |          |                |                              |                  |
| Goal Demand input        |                  |          |                |                              |                  |
| Capacity input           |                  |          |                |                              |                  |
| Goal Priority            |                  |          |                |                              |                  |
| Composite feasibility    |                  |          |                |                              |                  |
| Historical provenance    |                  |          |                |                              |                  |
| Staleness                |                  |          |                |                              |                  |
| Direct authorization     |                  |          |                |                              |                  |
| Friction reuse           |                  |          |                |                              |                  |
| Found Time detection     |                  |          |                |                              |                  |
| Live Capacity            |                  |          |                |                              |                  |
| Found-Time Goal matching |                  |          |                |                              |                  |
| Found-Time Proposal      |                  |          |                |                              |                  |
| Spontaneous execution    |                  |          |                |                              |                  |
| Learning evidence        |                  |          |                |                              |                  |

---

## 79. Required Primitive-Reuse Matrix

Produce:

| Future Concern | Existing Primitive | Evidence | Reuse Classification | Required Adaptation | Risk |
| -------------- | ------------------ | -------- | -------------------- | ------------------- | ---- |

At minimum evaluate:

* `BlockCandidate`;
* `ScheduledBlock`;
* Preview;
* `UnplacedCandidate`;
* Friction;
* `SuggestedFix`;
* `applySuggestedFix`;
* `PlanDecision`;
* replay;
* accepted choices;
* durable occurrence reference;
* Goal links;
* historical Goal snapshots;
* historical occurrence;
* execution record;
* execution duration;
* manual events;
* Goal Progress observations;
* placement engine;
* priority sorting;
* user-day boundary logic;
* preview staleness;
* backup/restore.

Use:

* Directly Reusable
* Reusable with Adaptation
* Conceptually Related but Wrong Abstraction
* Not Reusable
* Not Found

---

## 80. Required Constructive-vs-Corrective Matrix

Produce:

| Planning Situation                   | Constructive Proposal? | Feasibility Limitation? | Allocation Problem? | Corrective Friction? | Current Representation |
| ------------------------------------ | ---------------------: | ----------------------: | ------------------: | -------------------: | ---------------------- |
| Empty Capacity and unmet Goal Demand |                        |                         |                     |                      |                        |
| One Goal fits                        |                        |                         |                     |                      |                        |
| Multiple Goals compete               |                        |                         |                     |                      |                        |
| Core fits, composition does not      |                        |                         |                     |                      |                        |
| No useful Goal fits                  |                        |                         |                     |                      |                        |
| Accepted Goal work later collides    |                        |                         |                     |                      |                        |
| Existing Commitment overlap          |                        |                         |                     |                      |                        |
| Found Time appears                   |                        |                         |                     |                      |                        |
| Found Time too small                 |                        |                         |                     |                      |                        |

---

## 81. Required Decision Lifecycle Matrix

Produce:

| State               | Current Primitive | Future Proposal Meaning | Authority? | Persist? | Historical? |
| ------------------- | ----------------- | ----------------------- | ---------: | -------: | ----------: |
| Generated reasoning |                   |                         |            |          |             |
| Proposal shown      |                   |                         |            |          |             |
| Proposal modified   |                   |                         |            |          |             |
| Proposal accepted   |                   |                         |            |          |             |
| Proposal rejected   |                   |                         |            |          |             |
| Proposal stale      |                   |                         |            |          |             |
| Proposal superseded |                   |                         |            |          |             |
| Accepted Allocation |                   |                         |            |          |             |
| Scheduled work      |                   |                         |            |          |             |
| Execution           |                   |                         |            |          |             |

---

## 82. Required Found-Time Matrix

Produce:

| Scenario | Plan Divergence | Released Interval | Remaining Obligation | Live Capacity? | Goal Candidate Possible? | Proposal Needed? | Direct Action Possible? |
| -------- | --------------- | ----------------- | -------------------- | -------------: | -----------------------: | ---------------: | ----------------------: |

Include:

* meeting canceled;
* Work ends early;
* errand finishes early;
* commute finishes early;
* optional attachment skipped;
* required attachment skipped;
* Buffer released;
* user manually declares 45m available.

---

## 83. Required Provenance Matrix

Produce:

| Scenario | Original Plan | Proposal | User Decision | Scheduled Authority | Execution | Must Preserve |
| -------- | ------------- | -------- | ------------- | ------------------- | --------- | ------------- |

Include:

* recurring Commitment;
* constructive Proposal accepted;
* Proposal modified;
* Proposal rejected;
* Found-Time Proposal accepted;
* Found-Time Proposal rejected;
* spontaneous Goal work;
* Friction fix accepted;
* direct manual event.

---

## 84. Required Proposal Input Matrix

Produce:

| Input | Authored / Derived | Current Executable Support | Required for Constructive Proposal? | Proposal May Mutate It? |
| ----- | ------------------ | -------------------------- | ----------------------------------: | ----------------------: |

Include:

* Capacity;
* Goal Demand;
* Structural Eligibility;
* normalized Demand;
* Goal Priority;
* Goal-Specific Feasibility;
* Composite Footprint;
* Allocation;
* accepted-choice guidance;
* historical tendency;
* current time;
* Found-Time interval.

---

## 85. Required Worked Scenarios

Evaluate at least the following.

### Scenario A — Simple Unused Capacity

```text
Capacity: 19:00–20:00
Network+ unmet Demand: 45m
```

Can current DayFrame construct a recommendation?

### Scenario B — Two Goals Compete

```text
Capacity: 60m
Network+: 45m
Writing: 45m
```

What current mechanism decides?

### Scenario C — Goal Priority

Network+ High, Writing Medium.

Does executable planning use this?

### Scenario D — Core Fits, Composite Does Not

```text
Capacity: 75m
Workout core: 60m
Travel: 30m
```

Can current engine avoid impossible recommendation?

### Scenario E — Recurring Commitment Placement

A recurring authored Study Commitment is automatically placed.

Is this Proposal or realization of prior authority?

### Scenario F — Friction Suggested Fix

Two authorized blocks collide.

Show why this is corrective rather than constructive Proposal.

### Scenario G — Suggested Fix Accepted

What durable authority is created?

### Scenario H — Suggested Fix Rejected

Is rejection persisted?

### Scenario I — Proposal Modified

No current Goal Proposal exists; identify closest analogue for preserving original + delta.

### Scenario J — Proposal Stale

Capacity changes after recommendation but before acceptance.

What current stale/replay machinery is reusable?

### Scenario K — No Useful Recommendation

Capacity exists but all Goal Demand is satisfied or infeasible.

Can current system represent this state?

### Scenario L — Meeting Canceled

A planned 60m Commitment disappears during Live execution.

Can current DayFrame derive newly available time?

### Scenario M — Commute Ends Early

Planned 30m, actual 15m, later required obligation remains.

Can current system determine net Found Time?

### Scenario N — Work Ends Early

Work ends 45m early.

Can current schedule distinguish newly available Capacity from history rewrite?

### Scenario O — Found Time + Network+

```text
Found Time: 45m
Network+ minimum useful session: 30m
```

Can current system propose it?

### Scenario P — Found Time + Workout Overhead

```text
Found Time: 45m
Workout core: 30m
Required travel: 30m
```

Can current system reject it as operationally infeasible?

### Scenario Q — Found-Time Proposal Accepted

What authority would current infrastructure need to create scheduled one-off work?

### Scenario R — Found-Time Proposal Rejected

What historical evidence should remain, and what exists today?

### Scenario S — Spontaneous Network+ Work

User directly studies for 45m during unexpected time without asking DayFrame.

Can current execution/history record this truth without fabricating Proposal?

### Scenario T — Repeated Spontaneous Choice

User repeatedly chooses Network+ in unexpected 30–60m intervals.

Can current system preserve evidence without silently creating a preference?

### Scenario U — Accepted Choice Guidance

A previous similar decision exists.

Can current system use it in future constructive reasoning?

### Scenario V — Proposal vs Planning Horizon

Month/year planning data exists, but user needs a recommendation for tonight.

Can current engine bound review/recommendation scope independently?

### Scenario W — Found Time Inside Overnight User-Day

An overnight worker finishes a component early after calendar midnight.

Can canonical user-day semantics support the interval?

### Scenario X — Proposal Becomes Friction Later

Goal work is accepted and scheduled; later a fixed Commitment appears.

At what point does constructive Proposal end and corrective Friction begin?

---

## 86. Candidate Invariants to Test

Evaluate each as:

* Required by Existing Architecture
* Supported by Current Implementation
* Violated by Current Implementation
* Not Applicable Yet
* Requires Future Specification

### CP-CAND-INV-01

**Generated reasoning MUST NOT become user-authored scheduling intent merely because the engine produced it.**

### CP-CAND-INV-02

**Automatically realized recurring Commitment authority MUST NOT be mislabeled as a new Proposal requiring repeated acceptance.**

### CP-CAND-INV-03

**Goal-driven discretionary work MUST NOT become scheduled reality before explicit user authority.**

### CP-CAND-INV-04

**Proposal MUST consume derived Capacity rather than create or mutate it.**

### CP-CAND-INV-05

**Proposal MUST consume normalized eligible Goal Demand rather than invent Demand.**

### CP-CAND-INV-06

**Proposal MUST NOT traverse Goal Structure to invent dependency, priority, or Demand-accounting semantics.**

### CP-CAND-INV-07

**Proposal MUST respect full required Commitment Composition footprint.**

### CP-CAND-INV-08

**Proposal MUST NOT treat overhead as Goal Progress.**

### CP-CAND-INV-09

**Allocation remains derived; Proposal remains non-authoritative until user decision.**

### CP-CAND-INV-10

**Acceptance MUST create explicit bounded planning authority.**

### CP-CAND-INV-11

**Modification MUST preserve original Proposal and user delta where historically relevant.**

### CP-CAND-INV-12

**Rejection MUST NOT create scheduling authority or silently become reusable preference.**

### CP-CAND-INV-13

**One accepted Proposal MUST NOT silently create open recurring authority unless explicitly accepted at that scope.**

### CP-CAND-INV-14

**Proposal staleness MUST prevent acceptance of materially outdated reasoning without revalidation.**

### CP-CAND-INV-15

**Constructive Proposal MUST remain distinct from corrective Friction.**

### CP-CAND-INV-16

**Insufficient Capacity for unaccepted Goal Demand is not Friction.**

### CP-CAND-INV-17

**Competing unaccepted Goal Demands are an Allocation problem, not Friction.**

### CP-CAND-INV-18

**No useful recommendation is a valid Proposal outcome, not necessarily an error.**

### CP-CAND-INV-19

**Found Time MUST remain derived Live availability, not retroactive schedule revision.**

### CP-CAND-INV-20

**Found-Time Proposal MUST use the same authority boundaries as ordinary Proposal.**

### CP-CAND-INV-21

**Found Time MUST account for remaining required composite obligations before becoming Capacity.**

### CP-CAND-INV-22

**Found-Time recommendations MUST NOT silently fill unexpected availability.**

### CP-CAND-INV-23

**Spontaneous Goal work MUST be representable without fabricating a Proposal or Accepted Allocation that never existed.**

### CP-CAND-INV-24

**Execution provenance MUST distinguish scheduled, proposed-and-accepted, and direct/unplanned work where material.**

### CP-CAND-INV-25

**Repeated historical choices may suggest future preferences but MUST NOT silently establish them.**

### CP-CAND-INV-26

**Proposal history MUST preserve enough decision-time provenance to explain what the user accepted or rejected.**

### CP-CAND-INV-27

**Current and historical Proposal interpretation MUST NOT depend on mutable current Goal/Capacity/structure state.**

### CP-CAND-INV-28

**Proposal ordering MUST be deterministic for equivalent semantic inputs.**

### CP-CAND-INV-29

**Engine heuristics MUST NOT masquerade as user-value authority.**

### CP-CAND-INV-30

**Proposal scope MUST be explicit and bounded.**

### CP-CAND-INV-31

**Review scope and recommendation horizon MUST NOT silently expand merely because broader planning data exists.**

### CP-CAND-INV-32

**Accepted Goal work that later becomes infeasible transitions into Friction rather than remaining a Proposal problem.**

### CP-CAND-INV-33

**Proposal MUST preserve productive Goal work separately from operational support overhead.**

### CP-CAND-INV-34

**Found Time generated after calendar midnight MUST still use canonical user-day semantics.**

### CP-CAND-INV-35

**Direct user authoring MUST remain possible without requiring an engine Proposal.**

### CP-CAND-INV-36

**A constructive Proposal system MUST remain explainable and subordinate to user authority.**

---

## 87. Architectural Risks

Evaluate at minimum:

1. Treating Preview as Proposal.
2. Treating automatic recurring placement as unaccepted engine intent.
3. Treating Friction SuggestedFix as the general Proposal domain.
4. Reusing `PlanDecision` so broadly that occurrence correction and constructive authorization become indistinguishable.
5. Scheduling Goal work automatically once Capacity exists.
6. Inventing Goal Demand from Goal metadata.
7. Letting Proposal traverse Goal Structure and infer authority.
8. Ignoring Commitment Composition overhead.
9. Treating Allocation as accepted decision.
10. Treating Proposal as scheduled reality.
11. Losing original recommendation after user modification.
12. Treating rejection as reusable dislike/preference.
13. Treating absence of acceptance as explicit rejection.
14. Using mutable current state to explain historical recommendations.
15. Ranking by storage/array order.
16. Treating Commitment priority as Goal Priority.
17. Treating engine heuristics as user values.
18. Expanding review scope to entire planning horizon.
19. Filling Found Time automatically.
20. Treating freed clock time as Capacity before protecting later obligations.
21. Treating canceled/shortened activity as retroactive schedule deletion.
22. Fabricating Proposal provenance for spontaneous action.
23. Treating spontaneous Goal work as automatically scheduled work.
24. Letting repeated Found-Time choices silently become reusable preferences.
25. Treating Found Time as a special scheduling authority outside ordinary Proposal rules.
26. Ignoring user-day boundaries in Live opportunity.
27. Confusing inability to recommend with Friction.
28. Confusing unmet Goal Demand with failure.
29. Overengineering Proposal into autonomous planning.
30. Turning Proposal into a chatbot-style nondeterministic suggestion layer rather than deterministic architecture.

---

## 88. Test Coverage Assessment

Identify and run focused existing tests covering:

* `generateSchedulePreview`;
* store `generatePreview`;
* `reviseSchedulePreview`;
* BlockCandidate generation;
* placement;
* unplaced candidates;
* Friction;
* SuggestedFix generation;
* SuggestedFix application;
* PlanDecision;
* replay;
* decision persistence;
* accepted-choice presentation if covered;
* preview staleness;
* historical publication;
* Goal links;
* execution records;
* execution history;
* Progress observations;
* backup/restore.

Determine whether any tests cover:

* constructive Goal Proposal;
* Proposal identity;
* accept/modify/reject Proposal;
* Capacity→Goal recommendation;
* competing Goal Demand;
* Goal Allocation;
* Proposal rejection;
* Proposal historical reasoning;
* Found Time;
* early-finish detection;
* cancellation release;
* Live Capacity;
* Found-Time Goal matching;
* spontaneous Goal execution;
* Found-Time Proposal.

Report:

* exact files executed;
* total tests;
* passed;
* failed;
* claims substantiated.

Do not create or modify tests.

---

## 89. Required Current-System Flows

Produce evidence-grounded flows for at least:

### Existing recurring Commitment

```text
Authored template/recurrence
→ generated candidate
→ deterministic placement
→ preview scheduled block
→ publication
→ execution
```

### Friction resolution

```text
Authorized schedule
→ Friction
→ SuggestedFix
→ user acceptance
→ PlanDecision
→ replay/regeneration
→ revised schedule
```

### Goal-linked activity

```text
Goal
→ explicit link to Commitment
→ scheduled occurrence
→ historical Goal snapshot
→ execution
→ Goal Activity / Progress remains separate
```

### Direct execution / Progress evidence

Trace whatever actually exists.

Mark clearly where no constructive Proposal step exists.

---

## 90. Required Intended Proposal Boundary Flow

After current truth, construct a conceptual boundary flow only.

Example:

```text
Capacity
+ normalized eligible Goal Demand
+ Goal Priority
+ Goal-Specific Feasibility
+ Commitment Composition footprint
+ Allocation Policy
+ relevant accepted-choice guidance
→ Allocation
→ Proposal
→ user Accept / Modify / Reject
→ Accepted Allocation
→ Scheduled Goal Work + Support Activities / Buffers
→ Execution
```

Mark all non-implemented stages.

Do not turn this into final specification.

---

## 91. Required Intended Found-Time Boundary Flow

Construct a separate conceptual flow:

```text
Published Plan
→ Execution Divergence
→ released interval
→ subtract remaining required obligations/liabilities
→ Live Capacity / Found Time
→ unmet structurally eligible normalized Goal Demand
→ composition-aware short-horizon Feasibility
→ Allocation
→ Found-Time Proposal
→ user Accept / Modify / Reject
→ one-off accepted authority
→ Scheduled Goal Work / direct execution
→ History
```

Also show:

```text
Found Time
→ user acts directly without Proposal
→ direct/unplanned execution
→ historical evidence
```

Mark both as conceptual where not implemented.

---

## 92. Required Support Classification

Assign:

### Constructive Proposal

CP1–CP5.

### Found Time

FT1–FT5.

Also classify independently:

* Proposal identity;
* Proposal options;
* Proposal explanation;
* accept;
* modify;
* reject;
* Proposal staleness;
* Proposal history;
* Goal Demand integration;
* Capacity integration;
* Goal Priority integration;
* Allocation;
* composite footprint integration;
* Friction recommendation reuse;
* PlanDecision reuse;
* direct authorization;
* direct Goal execution;
* execution divergence;
* Found-Time detection;
* Live Capacity;
* Found-Time Goal matching;
* short-horizon Proposal;
* Found-Time rejection;
* Found-Time direct action;
* learning evidence.

---

## 93. Required Findings

The result artifact must explicitly state:

### Current Proposal Truth

What DayFrame actually has today.

### Preview Truth

Why Preview is or is not Proposal.

### Automatic Placement Truth

Whether deterministic recurrence placement is prior-authority realization.

### Friction Recommendation Truth

What SuggestedFix provides and what it does not.

### PlanDecision Truth

What authority it currently represents.

### Acceptance Truth

Where explicit acceptance currently exists.

### Rejection Truth

Whether rejection is represented.

### Goal Planning Truth

Whether Goal Demand/Goal Priority currently feed planning.

### Capacity Truth

Whether a coherent Capacity read model exists executably.

### Allocation Truth

Whether competing Goal Demand is allocated today.

### Proposal History Truth

What decision-time provenance current history can preserve.

### Found-Time Truth

Whether Found Time currently exists.

### Execution Divergence Truth

Which planned-vs-actual primitives exist.

### Live Capacity Truth

Whether current availability can be recomputed from execution.

### Spontaneous Goal Work Truth

Whether direct unplanned Goal execution can be represented.

### Proposal/Friction Boundary

Whether current implementation conflates them.

### Proposal Specification Dependency

Whether enough upstream architecture now exists to specify Proposal.

---

## 94. Audit Conclusions

Explicitly answer:

1. Does DayFrame currently have first-class constructive Proposal?
2. What CP classification applies?
3. Does Preview constitute Proposal?
4. Does generated recurring placement require new acceptance?
5. Are `BlockCandidate`s constructive recommendations?
6. Are SuggestedFixes constructive Proposal?
7. Is current recommendation machinery Friction-only?
8. Does PlanDecision represent general Proposal acceptance?
9. Which PlanDecision primitives are reusable?
10. Is constructive rejection represented?
11. Is constructive modification represented?
12. Are rejected alternatives preserved?
13. Does Goal Demand currently feed generation?
14. Does Goal Priority currently feed constructive planning?
15. Does first-class Capacity currently feed planning?
16. Does executable Goal Allocation exist?
17. Can current system compare competing Goal demands?
18. Can current history preserve decision-time Proposal reasoning?
19. Can user directly authorize schedule state without Proposal?
20. Can user directly log Goal work without Proposal?
21. Does DayFrame currently implement Found Time?
22. What FT classification applies?
23. Can early execution completion be detected?
24. Can cancellation release Capacity?
25. Can remaining composite obligations be protected?
26. Can Live Capacity be derived today?
27. Can unmet Goal Demand be queried against Found Time?
28. Can short-horizon Feasibility run against Found Time?
29. Can a Found-Time Proposal be generated?
30. Can a Found-Time Proposal be accepted?
31. Can it be rejected?
32. Can spontaneous Found-Time Goal work be logged distinctly?
33. Can repeated spontaneous choices become evidence without becoming authority?
34. Can Proposal safely consume Goal Structure outputs without traversing structure?
35. Can Proposal safely consume Commitment Composition footprints?
36. Can Proposal distinguish productive work from overhead?
37. Is insufficient unaccepted Goal Demand correctly distinguishable from Friction?
38. Is no useful recommendation representable?
39. Is planning/review scope sufficiently bounded today?
40. Which current recommendation/decision/history primitives are directly reusable?
41. Which are reusable only with adaptation?
42. Which are wrong abstractions?
43. Are any upstream semantic blockers still unresolved?
44. Is a Constructive Proposal Architecture Specification warranted now?
45. What should the next architectural task be?

---

## 95. Recommended Next-Step Gate

Select exactly one primary recommendation.

### Path A — Constructive Proposal Architecture Specification

Choose if the audit establishes that upstream semantics are sufficiently resolved and a first-class Proposal lifecycle can now be specified.

### Path B — Found Time / Live Opportunity Architecture Specification

Choose only if Found Time proves sufficiently independent and semantically large that it must be specified separately before Proposal.

### Path C — Proposal Decision / Acceptance Follow-Up Audit

Choose only if current PlanDecision / acceptance behavior remains too ambiguous to specify Proposal authority.

### Path D — Historical Proposal Provenance Follow-Up Audit

Choose only if decision-time historical preservation remains the principal unresolved blocker.

### Path E — Planning Horizon / Review Scope Follow-Up Audit

Choose only if scope coupling prevents a coherent Proposal specification.

### Path F — Architecture Reconciliation

Choose if Proposal cannot be made consistent with accepted Capacity, Goal Demand / Allocation, Goal Structure, Commitment Composition, history, Friction, or user-authority architecture.

Do not begin the selected task.

Do not assign Phase 8.

Given the architectural work completed to date, **Path A should be strongly considered if the audit confirms that Found Time can remain a Live input/use case within the broader Proposal architecture rather than requiring a separate upstream authority domain.**

---

## 96. Governance and Constraints

This audit must preserve:

1. **Users define priorities; DayFrame builds schedules.**
2. **Commitments own authorized time.**
3. **Goals describe desired outcomes.**
4. **Capacity is derived and non-authoritative.**
5. **Goal Demand requests resources but does not own time.**
6. **Goal Structure resolves outcome relationships upstream.**
7. **Commitment Composition resolves operational footprint upstream.**
8. **Allocation is derived and provisional.**
9. **Proposal is constructive.**
10. **Friction is corrective.**
11. **Proposal is the epistemic boundary between engine reasoning and user intent.**
12. **Goal-driven discretionary time ownership requires explicit user authority.**
13. **Recurring authored scheduling authority does not require repeated Proposal acceptance merely because deterministic placement is regenerated.**
14. **Accepted Choice and reusable Preference remain distinct.**
15. **Rejected Proposal does not silently establish a preference.**
16. **History remains immutable.**
17. **Execution records what happened.**
18. **Found Time is derived Live availability, not retroactive schedule revision.**
19. **Found Time uses the same Proposal/user-authority boundary as ordinary planning.**
20. **Spontaneous user action must not be rewritten as engine recommendation.**
21. **Repeated behavior may inform future suggestions without silently becoming authority.**
22. **Proposal must remain deterministic, explainable, optional, and subordinate to the user.**
23. **Current implementation is evidence, not architectural authority merely because it exists.**
24. **No future implementation phase is established by this audit.**

This task must not:

* implement Proposal;
* create Proposal types;
* implement Allocation;
* implement Goal Demand;
* implement Capacity;
* implement Goal Structure;
* implement Commitment Composition;
* implement Found Time;
* implement Live Capacity;
* implement short-horizon planning;
* change Friction;
* change SuggestedFix;
* change PlanDecision;
* change accepted choices;
* change Goals;
* change Progress;
* change execution;
* change history;
* change Summary;
* change Today;
* change Planner;
* change preview generation;
* change scheduling;
* change persistence;
* change backup/restore;
* add or modify tests;
* modify existing architecture documents;
* modify existing audit documents;
* create Phase 8;
* assign work to a future implementation phase.

This task is read-only with respect to the existing repository.

**The required audit result artifact is the sole permitted repository write.**

---

## 97. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_AUDIT_RESULT.md`

The filename must contain `RESULT` because it is the durable Codex output produced by this audit.

Do not substitute another filename or path.

The result must include at minimum:

1. **Executive Findings**
2. **Audit Scope and Method**
3. **Architectural Context**
4. **Current Planning Entry Points**
5. **Preview Semantics**
6. **Automatic Placement**
7. **Planning Candidates**
8. **Candidate Semantics Matrix**
9. **Goals in Planning**
10. **Goal Demand Executable Support**
11. **Capacity Executable Support**
12. **Constructive Recommendation Search**
13. **Friction Suggested Fixes**
14. **Proposal vs Friction**
15. **SuggestedFix Reuse**
16. **PlanDecision**
17. **PlanDecision Reuse Boundary**
18. **Accepted Choices**
19. **Accepted Choice vs Learned Preference**
20. **Proposal Acceptance**
21. **Proposal Modification**
22. **Proposal Rejection**
23. **Direct User Authorization**
24. **Direct Goal Work**
25. **Spontaneous Execution Boundary**
26. **Historical Publication Authority**
27. **Proposal Historical Provenance**
28. **Proposal Provenance Matrix**
29. **Allocation Analogue Search**
30. **Priority Semantics**
31. **Heuristics vs User-Value Authority**
32. **Recommendation Explanation**
33. **Recommendation Alternatives**
34. **Proposal Cardinality**
35. **Proposal Scope**
36. **Proposal Horizon**
37. **Planning Horizon vs Review Scope**
38. **Short-Horizon Proposal**
39. **Live / Today Surface**
40. **Current-Time Dependency**
41. **Execution Divergence**
42. **Planned vs Actual Comparison**
43. **Found-Time Detection**
44. **Found-Time Sources**
45. **Found-Time Source Matrix**
46. **Found Time vs Capacity**
47. **Found Time and Commitment Composition**
48. **Found Time and Buffers**
49. **Found Time and Goal Demand**
50. **Found Time and Goal Structure**
51. **Found Time and Composition Footprint**
52. **Found-Time Proposal**
53. **Found-Time User Authority**
54. **Spontaneous Found-Time Use**
55. **Proposed vs Direct Execution**
56. **Found Time as Learning Evidence**
57. **Reusable Preference Boundary**
58. **Proposal and Accepted Choice Scope**
59. **Proposal and History**
60. **Historical Reasoning Snapshot**
61. **Proposal Staleness**
62. **Proposal Applicability**
63. **Proposal Identity**
64. **Determinism**
65. **Proposal Ranking**
66. **Allocation Policy Executable Support**
67. **Recommendation Confidence / Explanation**
68. **No-Proposal State**
69. **Proposal Failure vs Friction**
70. **Preview / Proposal / Schedule Truth Matrix**
71. **Current Proposal Support Classification**
72. **Found-Time Support Classification**
73. **Current-vs-Needed Matrix**
74. **Primitive-Reuse Matrix**
75. **Constructive-vs-Corrective Matrix**
76. **Decision Lifecycle Matrix**
77. **Found-Time Matrix**
78. **Provenance Matrix**
79. **Proposal Input Matrix**
80. **Worked Scenarios**
81. **Candidate Invariant Assessment**
82. **Architectural Risks**
83. **Test Coverage Assessment**
84. **Current-System Flows**
85. **Intended Proposal Boundary Flow**
86. **Intended Found-Time Boundary Flow**
87. **Current Proposal Truth**
88. **Preview Truth**
89. **Automatic Placement Truth**
90. **Friction Recommendation Truth**
91. **PlanDecision Truth**
92. **Acceptance / Modification / Rejection Truth**
93. **Goal / Capacity / Allocation Truth**
94. **Proposal History Truth**
95. **Found-Time Truth**
96. **Execution Divergence Truth**
97. **Live Capacity Truth**
98. **Spontaneous Goal Work Truth**
99. **Proposal / Friction Boundary**
100. **Missing Constructive Proposal Semantics**
101. **Missing Found-Time Semantics**
102. **Open Questions**
103. **Audit Conclusions**
104. **Recommended Next Step**
105. **Completion Statement**

After writing:

1. verify the artifact exists at the exact required path;
2. reopen and read it;
3. verify all required sections are complete;
4. verify all twenty-four worked scenarios are addressed;
5. verify all thirty-six candidate invariants are classified;
6. verify all required matrices are complete;
7. verify all forty-five audit conclusion questions are explicitly answered;
8. verify both CP and FT classifications are assigned;
9. verify exactly one recommended next-step path is selected;
10. inspect repository status;
11. verify no repository file other than the required result artifact was modified.

Do not merely print findings in Codex's response.

The durable audit result artifact is required.

---

## 98. Validation

Run focused existing tests only as necessary to substantiate current executable behavior.

Prefer existing tests covering:

* `generateSchedulePreview`;
* store preview generation;
* preview revision;
* block candidate generation;
* placement;
* unplaced candidates;
* Friction;
* SuggestedFix;
* SuggestedFix application;
* PlanDecision;
* decision replay;
* preview staleness;
* historical publication;
* Goal links;
* Goal Activity;
* execution records;
* execution history;
* Progress observations;
* backup/restore.

Report:

* exact test files;
* total test count;
* passed;
* failed;
* claims substantiated.

Do not add or modify tests.

If no tests cover constructive Proposal or Found Time, report that explicitly while relying on production-path tracing rather than test absence alone.

---

## 99. Completion Criteria

The audit is complete only when:

* [ ] Current planning entry points are traced.
* [ ] Preview semantics are classified.
* [ ] Automatic recurrence placement authority is classified.
* [ ] Candidate-like objects are inventoried.
* [ ] Constructive recommendation search is complete.
* [ ] Goal planning integration is traced.
* [ ] Goal Demand executable support is classified.
* [ ] Capacity executable support is classified.
* [ ] Allocation analogue search is complete.
* [ ] Goal Priority executable support is classified.
* [ ] Friction SuggestedFix is traced.
* [ ] Proposal vs Friction distinction is assessed.
* [ ] SuggestedFix reuse is classified.
* [ ] PlanDecision is traced.
* [ ] PlanDecision reuse is classified.
* [ ] Accepted Choices are traced.
* [ ] Accepted Choice vs Preference boundary is assessed.
* [ ] Constructive acceptance support is classified.
* [ ] Constructive modification support is classified.
* [ ] Constructive rejection support is classified.
* [ ] Direct user authorization is assessed.
* [ ] Direct Goal work is assessed.
* [ ] Spontaneous execution provenance is assessed.
* [ ] Historical publication boundary is traced.
* [ ] Proposal historical provenance support is assessed.
* [ ] Recommendation explanations are assessed.
* [ ] Recommendation alternatives are assessed.
* [ ] Proposal cardinality primitives are assessed.
* [ ] Proposal scope primitives are assessed.
* [ ] Proposal horizon is assessed.
* [ ] Planning horizon / review scope coupling is documented.
* [ ] Short-horizon planning support is assessed.
* [ ] Today / Live implementation is traced.
* [ ] Current-time dependencies are traced.
* [ ] Execution divergence is traced.
* [ ] Planned-vs-actual comparison support is assessed.
* [ ] Found-Time implementation is searched comprehensively.
* [ ] Found-Time source cases are assessed.
* [ ] Live Capacity support is assessed.
* [ ] Found Time / Commitment Composition interaction is assessed.
* [ ] Found Time / Buffer interaction is assessed.
* [ ] Found Time / Goal Demand interaction is assessed.
* [ ] Found Time / Goal Structure interaction is assessed.
* [ ] Found Time / Composite Footprint interaction is assessed.
* [ ] Found-Time Proposal support is assessed.
* [ ] Found-Time acceptance is assessed.
* [ ] Found-Time rejection is assessed.
* [ ] Found-Time direct action is assessed.
* [ ] Spontaneous Goal execution is assessed.
* [ ] Found-Time learning evidence is assessed.
* [ ] Proposal staleness support is assessed.
* [ ] Proposal applicability support is assessed.
* [ ] Proposal identity primitives are assessed.
* [ ] Determinism is assessed.
* [ ] Proposal ranking analogues are assessed.
* [ ] Allocation Policy support is assessed.
* [ ] No-Proposal state is assessed.
* [ ] Proposal failure vs Friction is assessed.
* [ ] CP1–CP5 primary classification is assigned.
* [ ] FT1–FT5 primary classification is assigned.
* [ ] All independent Proposal support classifications are assigned.
* [ ] All independent Found-Time support classifications are assigned.
* [ ] Current-vs-Needed Matrix is complete.
* [ ] Primitive-Reuse Matrix is complete.
* [ ] Proposal-vs-Friction Matrix is complete.
* [ ] Constructive-vs-Corrective Matrix is complete.
* [ ] Decision Lifecycle Matrix is complete.
* [ ] Found-Time Source Matrix is complete.
* [ ] Found-Time Matrix is complete.
* [ ] Proposed-vs-Direct Execution Matrix is complete.
* [ ] Proposal Provenance Matrix is complete.
* [ ] Provenance Matrix is complete.
* [ ] Proposal Input Matrix is complete.
* [ ] Preview / Proposal / Schedule Truth Matrix is complete.
* [ ] All twenty-four worked scenarios are resolved.
* [ ] All thirty-six candidate invariants are classified.
* [ ] All required architectural risks are evaluated.
* [ ] Focused existing tests are executed as needed.
* [ ] Validation results are recorded.
* [ ] Current-system flows are documented.
* [ ] Intended Proposal flow is documented as conceptual.
* [ ] Intended Found-Time flow is documented as conceptual.
* [ ] All forty-five audit conclusion questions are explicitly answered.
* [ ] Exactly one recommended next-step path is selected.
* [ ] No implementation was performed.
* [ ] No tests were modified.
* [ ] No existing architecture document was modified.
* [ ] No existing audit document was modified.
* [ ] No future implementation phase was established.
* [ ] `CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_AUDIT_RESULT.md` was written to the exact required path.
* [ ] The result artifact was reopened and verified.
* [ ] Repository status was inspected.
* [ ] The required audit result artifact was the sole repository write.
* [ ] Codex reports the exact saved artifact path.
* [ ] Codex reports validation performed.
* [ ] Codex reports whether any other repository files changed.

---

## 100. Final Completion Statement

End `CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_AUDIT_RESULT.md` with exactly:

> **Constructive Proposal Architecture Audit complete.**
>
> The audit establishes the current executable truth of DayFrame's constructive planning and recommendation machinery; distinguishes generated Preview state, recurring-authority realization, planning candidates, corrective Friction suggestions, accepted PlanDecisions, and historical schedule truth; determines whether Capacity, Goal Demand, Goal Priority, Goal-Specific Feasibility, Allocation, Commitment Composition footprints, Proposal identity, recommendation alternatives, acceptance, modification, rejection, staleness, and decision-time provenance are represented or absent; evaluates Found Time as execution-derived Live availability and determines whether cancellation, early completion, released Buffers, remaining composite obligations, Live Capacity, unmet Goal Demand, short-horizon feasibility, Found-Time Proposal, spontaneous Goal execution, and learning provenance are currently supported; identifies reusable primitives and wrong abstractions; determines whether a first-class Constructive Proposal architecture can now be specified without reopening accepted upstream architecture; and recommends the next architectural step without modifying implementation or assigning the work to a future implementation phase.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/audits/CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_AUDIT_RESULT.md`
>
> **Repository modifications:** The required audit result artifact was the sole repository write.
>
> **Validation:** Report focused existing tests executed, test counts, and results.
>
> **Constructive Proposal classification:** Report CP1, CP2, CP3, CP4, or CP5.
>
> **Found-Time classification:** Report FT1, FT2, FT3, FT4, or FT5.
>
> **Recommended next step:** Report the selected Path A, B, C, D, E, or F without beginning that work.
