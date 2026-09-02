# Goal Demand and Allocation Follow-Up Audit 01 — Goal Demand and Allocation Architecture Audit

## Status

Ready for audit.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Read-only architecture-alignment audit tracing DayFrame’s current Goal, Goal-linkage, scheduling, prioritization, planning-decision, historical, and related executable paths against the newly established Capacity architecture contract. This audit must determine what Goal demand and allocation concepts already exist, what current implementation behavior merely resembles them, what is missing, which existing primitives are reusable, and where the exact architectural boundaries must lie before constructive Proposal architecture can be specified. The audit must distinguish Goal intent from Commitment time ownership, Goal demand from Capacity, feasibility from allocation, allocation reasoning from Proposal, and provisional engine reasoning from user-authorized scheduling. It must not implement Goal Demand, Allocation, Capacity, Proposal, priority changes, scheduling changes, or UI changes; it must not modify production code or tests; and it must not establish or assign work to a future implementation phase.

This task is read-only with respect to the existing repository. The required audit result artifact is the sole permitted repository write.

---

## 1. Objective

Determine the current executable truth and architectural requirements surrounding **Goal Demand and Allocation** in DayFrame.

The completed Capacity Architecture Specification established the downstream planning chain:

**Commitments + Constraints
→ Capacity
→ Goal-Specific Feasibility
→ Competing Demand
→ Allocation Reasoning
→ Proposal
→ User Decision
→ Accepted Allocation
→ Scheduled Work
→ Execution
→ Progress
→ Summary**

Capacity is now normatively defined as a deterministic, explainable, demand-neutral planning resource.

The next unresolved architectural questions are therefore:

1. What does a Goal ask of Capacity?
2. How is that demand represented without turning the Goal itself into a Commitment?
3. Which parts of Goal demand are authored and which may be derived?
4. How is demand provenance preserved?
5. How is one Goal evaluated against Capacity?
6. How do multiple compatible Goal demands compete?
7. What role does Goal priority play?
8. What does “allocation” mean before user acceptance?
9. What may allocation reasoning decide?
10. What must remain the responsibility of Proposal?
11. What does user acceptance authorize?
12. At what point does Goal-driven discretionary intent become time-owning scheduled work?
13. What existing DayFrame primitives can support this lifecycle?
14. Which current implementation behaviors would become architectural liabilities if reused without adaptation?

This audit must answer those questions with repository evidence and accepted architecture, not with implementation proposals disguised as findings.

---

## 2. Authoritative Architectural Context

Treat the committed Capacity Architecture Specification as normative architecture.

Its central rule is:

> **Capacity describes what planning resources exist. Goal demand describes what a Goal would need from those resources.**

It further establishes:

> **General Capacity is demand-neutral. Goal-specific feasibility applies one explicit demand contract to Capacity without redefining or mutating Capacity.**

And:

> **Capacity → Goal-Specific Feasibility → Competing Demand → Allocation Reasoning → Proposal → User Decision**

The audit must preserve the following approved DayFrame principles:

* Commitments own time.
* Goals compete for Capacity.
* DayFrame proposes.
* The user decides.
* DayFrame schedules what the user has authorized.
* Proposal is constructive.
* Friction is corrective.
* Recommendations remain subordinate to user authority.
* History is immutable.
* Preserve epistemic integrity and provenance.
* Derived truth must not masquerade as authored truth.
* Engine reasoning must not silently become user intent.

The audit must also preserve the distinction among:

### Authored Truth

Facts, intent, constraints, priorities, and policies explicitly established by the user.

### Derived Truth

Deterministic conclusions calculated from authoritative state.

Capacity and Goal-specific feasibility belong here.

### Proposed Action

Engine reasoning presented as a recommendation.

Allocation reasoning may contribute to this state, but Proposal is the explicit constructive recommendation boundary.

### Accepted Decision

User authorization of proposed or manually selected planning action.

### Scheduled Reality

Authorized activity placed into time.

### Executed Reality

What actually occurred.

Do not allow current implementation convenience to collapse these states.

---

## 3. Authority and Evidence Model

For every material finding, classify the evidence as:

### Intended Truth

Supported by accepted DayFrame architecture, governance, specifications, ADRs, or explicit product decisions.

### Implemented Truth

Supported by executable production code and, where deterministic behavior is claimed, relevant tests.

### Experienced Truth

Supported by established dogfood findings or observed product behavior.

For implementation findings use:

* **Confirmed**
* **Inferred**
* **Not Found**

Do not infer functionality from:

* filenames;
* type names;
* component names;
* comments;
* UI labels;
* architectural aspiration.

Where architecture and implementation differ, report the difference explicitly.

Implementation is evidence, not authority merely because it exists.

---

## 4. Established Findings to Verify, Not Re-Litigate

The preceding Capacity and Capacity/Proposal audits established several findings that should be verified where necessary but not casually reopened.

### 4.1 Goals Exist as Authored Domain Objects

Current `GoalV1` includes identity, revision, descriptive/lifecycle information, timestamps, optional target date, optional measurement policy, and source-incarnation-aware Commitment links.

### 4.2 Goal Links Preserve Provenance

Goals can link to independently authored Commitment-like sources and preserve that provenance into historical occurrences.

### 4.3 Goals Do Not Currently Generate Scheduling Demand

Current schedule generation does not use Goals as candidate-generation or placement inputs.

### 4.4 Goal Progress Exists

Goal progress is currently derived from Goal measurement definitions and explicit observations/reporting rather than automatic allocation of Capacity.

### 4.5 Current Goal-to-Execution Path Is Indirect

Current behavior broadly resembles:

**Goal
→ linked independently authored Commitment/event
→ scheduled occurrence
→ execution/reporting
→ historical Goal provenance/progress**

This is useful functionality but does not establish Goal Demand or Allocation architecture.

### 4.6 Current PlanDecision Infrastructure Exists

`PlanDecisionV1` provides durable occurrence-level user authority for supported modifications and includes provenance such as user or suggested-fix origin.

### 4.7 Current Suggested-Fix Infrastructure Is Friction-Oriented

Current recommendation/acceptance behavior primarily addresses corrective Friction rather than constructive discretionary allocation.

### 4.8 Capacity Is Not Yet Implemented

The committed Capacity specification is architectural authority, not evidence that a Capacity read model already exists in production.

### 4.9 Proposal Is Not Yet a General Constructive Lifecycle

Existing Preview and Friction paths must not be relabeled as Proposal without evidence.

If repository evidence materially contradicts any of these findings, document the contradiction precisely.

---

## 5. Goal Domain Inventory

Trace the complete current Goal domain.

Identify:

* Goal types/interfaces;
* Goal lifecycle state;
* creation paths;
* editing paths;
* deletion/archival paths;
* persistence;
* backup behavior;
* profile behavior where applicable;
* revision semantics;
* measurement policies;
* progress observations;
* Goal-to-Commitment links;
* source incarnation;
* historical Goal provenance;
* Summary/progress consumption;
* any Goal priority concept;
* any Goal effort/time-request concept;
* any Goal cadence concept;
* any Goal scheduling-preference concept.

Produce:

| Goal Capability | Current Primitive | Authority Type | Persisted? | Scheduling Effect? | Evidence | Classification |
| --------------- | ----------------- | -------------- | ---------: | -----------------: | -------- | -------------- |

Determine exactly what a Goal means in current executable behavior.

Do not assume that fields absent from `GoalV1` cannot be represented elsewhere.

Search broadly.

---

## 6. Goal-to-Schedule Trace

Trace every current path by which a Goal can influence, annotate, or become associated with scheduled time.

At minimum inspect:

* Goal → Commitment linking;
* Goal → recurring source linking;
* Goal → manual-event linkage if present;
* Goal provenance on generated occurrences;
* historical-plan Goal provenance;
* execution/history Goal attribution;
* progress attribution.

Produce an end-to-end trace from Goal authoring to historical outcome.

For every transition classify whether the Goal:

* creates time demand;
* merely references an independently authored time owner;
* annotates scheduled work;
* affects placement;
* affects priority;
* affects duration;
* affects recurrence;
* affects Friction;
* affects suggested fixes;
* affects execution;
* affects progress only.

This trace must establish whether any current path can truthfully be called **Goal Demand**.

---

## 7. Goal Demand Search

Search the executable system for any primitive representing a Goal asking for future planning resources.

Look for concepts equivalent to:

* desired minutes;
* target minutes;
* effort budget;
* session duration;
* minimum session duration;
* maximum session duration;
* cadence;
* frequency;
* sessions per user-week;
* deadline-driven effort;
* target date scheduling pressure;
* splittability;
* contiguity;
* preferred time;
* unavailable time;
* work-relative timing;
* minimum useful opportunity;
* allocation amount;
* Goal scheduling weight;
* Goal priority;
* Goal urgency;
* desired Capacity share;
* requested sessions;
* remaining effort;
* time-to-target;
* resource request.

Search production code, types, state, persistence, tests, and UI.

For each candidate primitive determine:

* whether it is actually Goal-owned;
* whether it is authored or derived;
* whether it affects scheduling;
* whether it represents demand or merely metadata;
* whether it survives persistence;
* whether it has provenance;
* whether it is covered by tests.

Produce:

| Candidate Primitive | Goal-Owned? | Demand Semantics? | Scheduling Effect? | Authority | Evidence | Classification |
| ------------------- | ----------: | ----------------: | -----------------: | --------- | -------- | -------------- |

---

## 8. Goal Demand Semantic Boundary

Using accepted architecture and repository evidence, determine the minimum semantic responsibilities of a future **Goal Demand** concept.

Evaluate at minimum whether Goal Demand must be able to express:

* requested effort;
* duration;
* minimum useful duration;
* preferred session duration;
* maximum session duration;
* contiguity;
* splittability;
* cadence;
* frequency;
* target-date pressure;
* earliest/latest useful timing;
* time-of-day preference;
* user-day compatibility;
* workday/off-day compatibility;
* Work-relative preference;
* minimum/maximum allocation;
* optional versus required demand;
* completion/progress relationship.

Do **not** design the final schema.

Instead classify each dimension as:

* **Core Goal Demand**
* **Optional Goal Demand**
* **Goal Preference**
* **Goal Priority**
* **Allocation Policy**
* **Proposal Concern**
* **Not Supported by Current Architecture**
* **Requires Follow-Up**

Produce:

| Candidate Dimension | Recommended Architectural Owner | Why | Current Evidence | Open Question |
| ------------------- | ------------------------------- | --- | ---------------- | ------------- |

The audit must prevent Goal Demand from becoming an undifferentiated container for every future planning preference.

---

## 9. Goal vs Goal Demand

Determine whether Goal and Goal Demand must remain distinct architectural concepts.

Test the distinction:

> **Goal describes the outcome the user wants. Goal Demand describes the planning resources requested in service of that outcome.**

Evaluate whether:

* one Goal may have no active demand;
* one Goal may have multiple demand patterns;
* demand may change without changing Goal identity;
* demand may be suspended while Goal remains active;
* demand may be derived from Goal configuration;
* demand may require explicit user authorization;
* demand may expire or be revised;
* historical demand must preserve provenance independently from current Goal state.

Do not assume one Goal equals one demand object.

Determine the architectural consequences of each possibility.

---

## 10. Goal Demand Authority and Provenance

Determine the acceptable authority model for Goal Demand.

Evaluate at least:

### Model A — Fully Authored Demand

The user explicitly specifies all resource requirements.

### Model B — Derived Demand

DayFrame deterministically derives demand from Goal configuration.

### Model C — Authored Intent + Derived Demand Projection

The user authors planning intent and DayFrame derives a concrete demand projection.

### Model D — Mixed Demand Sources

Some dimensions are authored, others derived, with explicit provenance.

Determine which models are compatible with DayFrame's epistemic integrity requirements.

The audit must specifically answer:

> **What may DayFrame infer about how much time a Goal deserves without silently inventing user intent?**

and:

> **What information may DayFrame derive from a target date, measurement policy, prior execution, or learned preference without converting that derivation into authority?**

Produce an authority matrix:

| Demand Fact | May Be Authored? | May Be Derived? | Requires Explicit User Authority Before Allocation? | Required Provenance |
| ----------- | ---------------: | --------------: | --------------------------------------------------: | ------------------- |

Do not choose implementation mechanics.

---

## 11. Goal Priority Audit

Search for every existing priority concept relevant to Goals or scheduling.

At minimum distinguish:

### Commitment Priority

How strongly authored time-owning demand is protected or ordered.

### Goal Priority

How important one desired outcome is relative to another when discretionary Capacity is scarce.

### Decision / Preference Priority

How reusable user choices or learned planning preferences resolve when they conflict.

### Engine Heuristic Weight

A non-authoritative deterministic ranking aid.

Determine:

* which currently exist;
* where they are stored;
* how they affect scheduling;
* whether they are user-authored;
* whether they are persisted;
* whether Goal priority currently exists at all;
* whether current Commitment priority is being used as a proxy for Goal importance.

Produce:

| Priority Concept | Exists? | Current Owner | Authority | Scheduling Effect | Suitable for Goal Allocation? | Evidence |
| ---------------- | ------: | ------------- | --------- | ----------------- | ----------------------------: | -------- |

Preserve the invariant:

> **Commitment priority and Goal priority are not interchangeable merely because both may influence planning.**

---

## 12. Target Date, Progress, and Urgency

Audit whether existing Goal target dates, progress measurements, or observations currently affect scheduling.

Determine whether any current logic derives:

* urgency;
* remaining effort;
* required pace;
* allocation pressure;
* recommended frequency;
* scheduling priority.

If none exists, say so.

Then classify the architectural role these facts could play without designing the algorithm.

Distinguish:

* authored Goal fact;
* derived Goal state;
* derived demand input;
* allocation heuristic;
* Proposal explanation.

Preserve:

> **A derived sense of urgency may inform a recommendation without silently becoming authored Goal priority.**

---

## 13. Capacity Consumer Boundary

Use the committed Capacity specification to define what Goal-specific feasibility and allocation may consume.

Verify the Capacity contract requires downstream consumers to operate from:

* Capacity interval identity;
* exact boundaries;
* duration;
* user-day ownership;
* coverage;
* freshness;
* integrity;
* liability;
* allocability;
* demand-neutral eligibility information;
* dependency/derivation identity.

Determine whether any current Goal or scheduling code would need to bypass this contract to perform future Goal allocation.

Identify those potential bypasses as architectural risks.

Produce:

| Potential Consumer Need | Available from Capacity Contract? | Would Current Code Bypass Capacity? | Risk | Required Future Boundary |
| ----------------------- | --------------------------------: | ----------------------------------: | ---- | ------------------------ |

Do not modify Capacity architecture unless an actual contradiction is found.

---

## 14. Goal-Specific Feasibility

Define the architectural boundary of **Goal-Specific Feasibility** sufficiently to audit existing primitives.

The Capacity specification establishes that feasibility:

* evaluates explicit demand against Capacity;
* may filter or partition compatible opportunities;
* does not mutate Capacity;
* does not rank Goals;
* does not allocate;
* does not propose;
* does not authorize scheduling.

Search for existing reusable feasibility primitives, especially:

* candidate placement windows;
* duration checks;
* preferred-window evaluation;
* recurrence constraints;
* Work-relative placement;
* opening selection;
* candidate fit/no-fit results.

For each classify:

* reusable directly;
* reusable with adaptation;
* unsuitable because it conflates feasibility with placement;
* unsuitable because it depends on Commitment semantics;
* downstream-only.

Produce:

| Primitive | Current Purpose | Feasibility-Reusable? | Semantic Risk | Evidence |
| --------- | --------------- | --------------------: | ------------- | -------- |

---

## 15. Competing Demand

Determine whether the current implementation contains any concept equivalent to multiple discretionary demands competing for a finite resource.

Search for:

* priority sorting;
* candidate ordering;
* first-fit placement;
* resource contention;
* scheduling queues;
* fairness;
* proportional allocation;
* weighted allocation;
* round-robin behavior;
* deadline ordering;
* opportunity-cost reasoning;
* user-selected winners;
* bulk conflict resolution.

Distinguish current **Commitment placement competition** from future **Goal demand competition**.

Answer:

> **Does the existing scheduler already perform allocation, or does it merely order and place pre-authorized Commitment demand?**

This distinction is mandatory.

---

## 16. Allocation Definition Audit

Determine the minimum architectural meaning of **Allocation**.

Evaluate the working definition:

> **Allocation is a derived, provisional assignment of some available Capacity to one or more Goal demands for the purpose of constructing a Proposal. Allocation is not user authority and does not itself create scheduled work.**

Test this definition against:

* current scheduler behavior;
* PlanDecision semantics;
* Capacity architecture;
* Proposal boundary;
* historical authority;
* Goal provenance.

Determine whether allocation must represent:

* Goal identity;
* Goal-demand identity;
* Capacity interval identity;
* assigned duration;
* provisional session partition;
* unmet demand;
* competing-demand context;
* ranking/rationale;
* provenance;
* dependency identity;
* allocation-policy identity.

Do not define implementation types.

Classify each as:

* required;
* optional;
* downstream Proposal concern;
* not Allocation.

---

## 17. Allocation Granularity

Investigate what granularity future allocation must conceptually support.

Evaluate:

* total minutes per planning range;
* minutes per user-day;
* session-level allocations;
* exact Capacity interval slices;
* recurrence/cadence allocations;
* partially satisfied demand;
* unsatisfied demand;
* over-subscribed demand.

Determine whether allocation must preserve enough interval topology for Proposal to construct actual scheduling recommendations without re-running private Capacity reasoning.

Preserve:

> **Allocation may partition or reference Capacity provisionally, but it does not mutate the underlying Capacity result.**

Do not prescribe the final representation.

---

## 18. Allocation Policy vs Goal Priority

Determine the boundary among:

### Goal Priority

User-authored importance of desired outcomes.

### Allocation Policy

Rules governing how scarce Capacity is distributed among compatible demands.

### Engine Heuristic

Deterministic tie-breaking or ranking behavior subordinate to authority.

### Learned Preference

Evidence about prior user choices that may inform but not silently establish current intent.

Evaluate possible allocation concerns such as:

* highest Goal priority first;
* minimum viable allocation before additional allocation;
* fairness across Goals;
* deadline pressure;
* progress deficit;
* diversification;
* continuity;
* preferred session shape;
* preserving previously accepted patterns.

Do not choose a policy.

Instead determine which concerns require explicit architecture before allocation implementation.

---

## 19. Allocation Determinism and Explainability

Determine the requirements necessary for allocation reasoning to satisfy DayFrame's deterministic and explainable architecture.

Audit existing ordering and tie-breaking patterns for reusable precedent.

A future allocation result should be explainable in terms such as:

> **Goal A received this Capacity because...**

> **Goal B received less because...**

> **This interval remained unallocated because...**

Determine what provenance is required to support those explanations.

Evaluate whether allocation must carry:

* input Capacity fingerprint;
* Goal-demand revisions;
* Goal priority;
* policy version;
* heuristic version;
* competing-demand set;
* selected opportunity identity;
* rejected alternatives;
* unmet-demand reason.

Do not require exhaustive rejected-search traces unless architecture actually needs them.

---

## 20. Allocation vs Proposal Boundary

This is a critical audit boundary.

Formalize the distinction:

### Allocation

Internal derived reasoning about how Capacity could satisfy competing Goal demands.

### Proposal

The user-facing constructive recommendation asking the user to authorize a use of Capacity.

Audit current code for any behavior that already crosses this boundary.

Determine:

* whether allocation may exist without a Proposal;
* whether one allocation may produce multiple Proposal alternatives;
* whether Proposal may modify allocation presentation without changing its semantics;
* whether Proposal must preserve allocation provenance;
* whether allocation has any authority before Proposal acceptance;
* whether rejected Proposal invalidates, archives, or simply abandons its allocation reasoning.

Do not design the full Proposal lifecycle.

Identify exactly what Proposal architecture will need from Allocation.

---

## 21. Proposal vs Preview

Audit current Preview semantics against future constructive Proposal semantics.

Determine whether current Preview:

* represents deterministic expansion of already-authorized Commitment intent;
* contains any discretionary Goal-generated work;
* requires user acceptance before its scheduled blocks are considered scheduled;
* is persisted;
* is published historically;
* can safely coexist with future unaccepted Goal-driven Proposal content.

Answer explicitly:

> **Can future Goal-driven Proposal allocations be inserted directly into current `scheduledBlocks` without violating user authority?**

If the answer is no, identify the architectural boundary that must be introduced.

Do not redesign Preview in this audit.

---

## 22. Allocation vs PlanDecision

Audit `PlanDecisionV1` and its replay/acceptance infrastructure for compatibility with future allocation authority.

Determine whether PlanDecision currently represents:

* proposal acceptance;
* occurrence modification;
* user-authored override;
* corrective Friction acceptance;
* reusable preference;
* allocation acceptance.

Evaluate whether existing properties and identity semantics could support:

* accepted allocation;
* rejected allocation;
* modified Proposal;
* occurrence creation;
* Goal provenance;
* Capacity provenance.

Classify each capability:

* directly reusable;
* reusable with adaptation;
* conceptually related but wrong abstraction;
* not supported.

Do not assume PlanDecision must become the accepted-allocation model merely because it already stores decisions.

---

## 23. Accepted Allocation Boundary

Determine the minimum architectural meaning of **Accepted Allocation**.

Evaluate:

> **Accepted Allocation is the authority transition by which the user approves a Goal-driven use of Capacity, permitting that approved discretionary intent to become time-owning scheduled work.**

Test whether this is compatible with:

* current authored/generated boundaries;
* PlanDecision;
* source incarnation;
* historical publication;
* execution;
* Goal provenance.

Determine what must be preserved at acceptance:

* Goal identity;
* Goal-demand identity;
* allocated Capacity identity/context;
* accepted duration;
* accepted timing/session structure;
* Proposal provenance;
* user modification;
* acceptance timestamp;
* source lifetime;
* historical Capacity context.

Do not design persistence schema.

The audit must identify what cannot safely be reconstructed later.

---

## 24. When Goal Work Begins to Own Time

Resolve the architectural transition:

> **At what exact point does Goal-driven discretionary work become time-owning intent?**

Evaluate:

### Goal Creation

Should not own time merely by existing.

### Goal Demand

Expresses requested resources but may not yet own time.

### Feasibility

Derived evaluation; should not own time.

### Allocation

Provisional reasoning; should not own time.

### Proposal

Recommendation; should not own time before acceptance.

### Accepted Allocation

Candidate authority transition.

### Scheduled Occurrence

Time-owning realization of accepted intent.

Determine whether Accepted Allocation itself owns time or whether it authorizes creation of a separate time-owning occurrence.

This distinction affects:

* Friction;
* historical provenance;
* modification;
* cancellation;
* execution;
* Goal linkage.

Do not leave the transition ambiguous.

---

## 25. Recurring Goal Demand and Repeated Authority

Evaluate the interaction between recurring Goal demand and user authority.

DayFrame already accepts the principle that deterministic recurrence expansion of previously authorized Commitment intent does not require fresh acceptance for every occurrence.

Determine whether a future accepted Goal allocation may similarly authorize:

* one occurrence only;
* a bounded range;
* a recurring allocation pattern;
* a reusable planning rule;
* none of the above without separate architecture.

Distinguish:

> **Accept this proposed Tuesday study session.**

from:

> **Use this kind of Capacity for Study every Tuesday.**

and:

> **Whenever these conditions recur, prefer Study.**

These represent different authority scopes.

Audit existing PlanDecision and recurrence identity semantics for relevant precedent.

Do not design reusable preference architecture here, but identify the authority boundary.

---

## 26. Rejection and Modification Semantics

Determine what architecture must eventually preserve when the user:

* accepts a Proposal;
* rejects a Proposal;
* modifies duration;
* moves proposed work;
* chooses a different Capacity interval;
* partially accepts;
* chooses one Goal over another.

Classify each user action as potentially producing:

* accepted planning authority;
* rejected recommendation evidence;
* modified allocation;
* accepted choice;
* learned-preference evidence;
* historical provenance.

Do not assume rejection is equivalent to a permanent preference.

Preserve:

> **One-off user choice must not silently become a global planning rule.**

---

## 27. Goal Progress and Allocation

Audit whether future allocation or accepted scheduling should directly affect Goal progress.

Current progress is based on measurement definitions and explicit observations/reporting.

Distinguish:

* Goal demand;
* allocated time;
* scheduled time;
* executed time;
* reported progress;
* outcome progress.

Determine which may legitimately influence progress and at what epistemic level.

Preserve:

> **Planning work toward a Goal is not the same thing as accomplishing the Goal.**

Identify any current implementation behavior that would blur this distinction.

Do not redesign Goal measurement architecture.

---

## 28. Historical Provenance

Determine what Goal Demand and Allocation facts must survive into immutable history.

Evaluate preservation of:

* Goal identity/revision;
* Goal-demand identity/revision;
* Goal priority at decision time;
* Capacity context;
* allocated interval;
* Proposal;
* user decision;
* accepted modification;
* scheduled occurrence;
* execution;
* progress attribution.

Use current historical-plan publication and frozen Goal provenance as evidence.

Determine which facts must be frozen because current state cannot safely reconstruct them later.

Do not require persistence of every intermediate allocation search.

---

## 29. Summary and Learning Boundary

Audit current Summary and Accepted Choices behavior for potential downstream use.

Determine what future Summary may truthfully report about:

* Capacity available;
* Capacity allocated;
* Capacity accepted;
* Capacity scheduled;
* Capacity executed;
* Goal demand satisfied;
* Goal demand unmet;
* Proposal acceptance/rejection;
* Goal progress.

Distinguish operational planning state from analytical history.

Also determine what evidence may later inform learning without silently becoming authority.

Preserve:

> **DayFrame may learn what the user tends to choose without pretending it knows what the user chooses today.**

Do not implement or specify the complete learning system.

---

## 30. Existing Primitive Reuse Assessment

Produce a comprehensive reuse assessment covering at minimum:

* Goal model;
* Goal revisions;
* Goal measurement policies;
* Goal observations;
* Goal links;
* Goal historical provenance;
* Commitment source identity;
* source incarnation;
* block candidates;
* recurrence;
* preferred windows;
* placement feasibility;
* priority;
* PlanDecision;
* accepted choices;
* suggested fixes;
* Friction;
* Preview;
* historical-plan publication;
* execution history;
* Summary.

Use:

| Primitive | Current Responsibility | Goal Demand Reuse | Feasibility Reuse | Allocation Reuse | Acceptance Reuse | Historical Reuse | Risk / Adaptation |
| --------- | ---------------------- | ----------------- | ----------------- | ---------------- | ---------------- | ---------------- | ----------------- |

Classify reuse as:

* **Directly Reusable**
* **Reusable with Adaptation**
* **Conceptually Related but Wrong Abstraction**
* **Not Reusable**
* **Downstream Only**

---

## 31. Required End-to-End Comparison

Produce two explicit flows.

### 31.1 Current Executable Goal Flow

Trace the actual current path from Goal authoring through scheduling/execution/progress.

Do not insert missing concepts.

### 31.2 Intended Constructive Goal Planning Flow

Using accepted architecture, trace:

**Goal
→ Goal Demand
→ Capacity
→ Goal-Specific Feasibility
→ Competing Demand
→ Allocation
→ Proposal
→ User Decision
→ Accepted Allocation
→ Scheduled Work
→ Execution
→ Progress**

Mark every transition as:

* currently implemented;
* partially implemented;
* analogous primitive exists;
* not implemented;
* architecture not yet specified.

The comparison must identify the **first exact break** between current executable behavior and intended constructive planning.

---

## 32. Required Boundary Matrix

Produce:

| Concept                   | Authored? | Derived? | Owns Time? | Expresses Demand? | Consumes Capacity? | Allocates Capacity? | Recommends Action? | User Authority? | Historical Provenance Required? |
| ------------------------- | --------: | -------: | ---------: | ----------------: | -----------------: | ------------------: | -----------------: | --------------: | ------------------------------: |
| Goal                      |           |          |            |                   |                    |                     |                    |                 |                                 |
| Goal Demand               |           |          |            |                   |                    |                     |                    |                 |                                 |
| Goal Priority             |           |          |            |                   |                    |                     |                    |                 |                                 |
| Capacity                  |           |          |            |                   |                    |                     |                    |                 |                                 |
| Goal-Specific Feasibility |           |          |            |                   |                    |                     |                    |                 |                                 |
| Competing Demand Set      |           |          |            |                   |                    |                     |                    |                 |                                 |
| Allocation                |           |          |            |                   |                    |                     |                    |                 |                                 |
| Proposal                  |           |          |            |                   |                    |                     |                    |                 |                                 |
| User Decision             |           |          |            |                   |                    |                     |                    |                 |                                 |
| Accepted Allocation       |           |          |            |                   |                    |                     |                    |                 |                                 |
| Scheduled Goal Work       |           |          |            |                   |                    |                     |                    |                 |                                 |
| Execution                 |           |          |            |                   |                    |                     |                    |                 |                                 |
| Goal Progress             |           |          |            |                   |                    |                     |                    |                 |                                 |
| Friction                  |           |          |            |                   |                    |                     |                    |                 |                                 |

Use the matrix to identify semantic leakage or unresolved authority transitions.

---

## 33. Required Authority-Transition Matrix

Produce:

| Transition                           | Input Epistemic State | Output Epistemic State | Automatic? | Requires User Authority? | Existing Primitive | Architectural Risk |
| ------------------------------------ | --------------------- | ---------------------- | ---------: | -----------------------: | ------------------ | ------------------ |
| Goal → Goal Demand                   |                       |                        |            |                          |                    |                    |
| Goal Demand → Feasibility            |                       |                        |            |                          |                    |                    |
| Feasibility → Allocation             |                       |                        |            |                          |                    |                    |
| Allocation → Proposal                |                       |                        |            |                          |                    |                    |
| Proposal → User Decision             |                       |                        |            |                          |                    |                    |
| User Decision → Accepted Allocation  |                       |                        |            |                          |                    |                    |
| Accepted Allocation → Scheduled Work |                       |                        |            |                          |                    |                    |
| Scheduled Work → Execution           |                       |                        |            |                          |                    |                    |
| Execution → Progress                 |                       |                        |            |                          |                    |                    |

The audit must make any ambiguous authority transition explicit.

---

## 34. Required Worked Scenarios

Evaluate the architecture and current implementation against at least these scenarios.

### Scenario A — One Goal, Ample Capacity

A Goal requests two hours this week and four suitable hours exist.

Identify:

* demand;
* feasibility;
* allocation;
* Proposal;
* acceptance;
* scheduling.

### Scenario B — One Goal, Fragmented Capacity

A Goal requires one 90-minute contiguous session but Capacity contains three 30-minute intervals.

Identify where infeasibility occurs.

### Scenario C — Two Goals, Scarce Capacity

Two Goals each request three hours; only four suitable hours exist.

Identify where Goal priority and allocation policy become relevant.

### Scenario D — Goal Without Active Demand

An active Goal exists but the user has not authorized any planning demand.

Confirm that it does not consume Capacity.

### Scenario E — Target-Date Pressure

A Goal has a near target date.

Determine what may be derived versus what may become authority.

### Scenario F — User Rejects Proposal

DayFrame proposes allocating Tuesday evening to Study; the user rejects it.

Determine what changes and what must not silently change.

### Scenario G — User Modifies Proposal

DayFrame proposes 90 minutes; the user accepts 60 minutes at another time.

Identify the authority transition and provenance requirements.

### Scenario H — Recurring Accepted Pattern

The user wants a Goal to receive recurring time rather than accepting each occurrence independently.

Identify which current primitives are analogous and which architecture remains unresolved.

### Scenario I — Accepted Goal Work Becomes Infeasible

A later Work change conflicts with previously accepted Goal-driven scheduled work.

Identify where Capacity ends and Friction begins.

### Scenario J — Goal-Linked Commitment Already Exists

A Goal is linked to a recurring Study Commitment that already owns time.

Determine why this must not be double-counted as new Goal demand merely because the Goal exists.

---

## 35. Required Invariants to Evaluate

Evaluate and refine the following proposed invariants.

### GD-INV-01

**A Goal does not own time merely by existing.**

### GD-INV-02

**Goal Demand expresses requested planning resources in service of a Goal without itself becoming scheduled work.**

### GD-INV-03

**Goal Demand must preserve the provenance of authored and derived demand facts.**

### GD-INV-04

**Derived Goal urgency or recommendation pressure must not silently become user-authored priority.**

### GD-INV-05

**General Capacity remains unchanged when evaluated against a particular Goal Demand.**

### GD-INV-06

**Goal-Specific Feasibility evaluates demand against Capacity without allocating it.**

### GD-INV-07

**Competing Goal demands do not create Friction merely because Capacity is scarce.**

### GD-INV-08

**Allocation is provisional derived reasoning until user authority is established.**

### GD-INV-09

**Allocation must not mutate Capacity.**

### GD-INV-10

**Proposal is the constructive boundary at which DayFrame presents allocation reasoning for user consideration.**

### GD-INV-11

**Unaccepted Proposal content must not become scheduled discretionary work.**

### GD-INV-12

**User acceptance must be distinguishable from engine recommendation.**

### GD-INV-13

**Goal-driven discretionary work becomes time-owning only through an explicit authority transition.**

### GD-INV-14

**A one-off accepted or rejected Proposal must not silently become a reusable global preference.**

### GD-INV-15

**Goal priority and Commitment priority are semantically distinct.**

### GD-INV-16

**Planning time toward a Goal and Goal progress are distinct facts.**

### GD-INV-17

**Historical Goal Demand, allocation, Proposal, acceptance, scheduling, and execution provenance must not be reconstructed from mutable current state when decision-time truth matters.**

### GD-INV-18

**Existing Goal-linked Commitments must not be double-counted as new discretionary Goal Demand.**

For each invariant classify:

* **Affirm**
* **Refine**
* **Reject**
* **Defer**

and explain why.

Add any invariant required by repository evidence or accepted architecture.

---

## 36. Required Architecture Questions

The result artifact must answer explicitly:

1. Does Goal Demand currently exist?
2. Does Goal priority currently exist?
3. Does current Goal scheduling behavior represent Goal Demand or Goal-linked Commitment scheduling?
4. What is the minimum semantic distinction between Goal and Goal Demand?
5. May Goal Demand be authored, derived, or both?
6. What demand facts require explicit user authority?
7. What may safely be derived from Goal metadata?
8. What is Goal-Specific Feasibility?
9. Which current placement primitives are reusable for feasibility?
10. Does current candidate ordering constitute Allocation?
11. What is the minimum definition of Allocation?
12. Is Allocation authoritative?
13. What information must Allocation preserve?
14. What is the boundary between Allocation and Proposal?
15. Can current Preview contain unaccepted Goal-driven Proposal work without violating architecture?
16. Can PlanDecision represent Accepted Allocation without adaptation?
17. What is the exact authority transition at which Goal-driven work begins to own time?
18. What recurring authority scopes must future architecture distinguish?
19. What must rejection preserve?
20. What must modification preserve?
21. How must Goal priority differ from Commitment priority?
22. How may learned preferences influence Allocation without becoming authority?
23. How does accepted Goal work later enter Friction?
24. What Goal/Allocation facts must be frozen historically?
25. What is the first exact break between current executable Goal behavior and intended constructive planning?
26. Which architecture must be specified next before implementation sequencing is safe?

---

## 37. Classification Framework

Provide final classifications for the following systems.

### Goal Demand

* **GD1 — Coherently Implemented**
* **GD2 — Implemented but Architecturally Misclassified**
* **GD3 — Partially Implemented**
* **GD4 — Analogous Primitives Only**
* **GD5 — Not Implemented**

### Goal-Specific Feasibility

* **GF1 — Coherently Implemented**
* **GF2 — Implemented but Coupled to Commitment Placement**
* **GF3 — Partially Implemented**
* **GF4 — Reusable Placement Primitives Only**
* **GF5 — Not Implemented**

### Allocation

* **AL1 — Coherently Implemented**
* **AL2 — Implemented but Missing Authority Boundary**
* **AL3 — Partially Implemented**
* **AL4 — Analogous Commitment-Ordering Primitives Only**
* **AL5 — Not Implemented**

### Accepted Allocation

* **AA1 — Coherently Implemented**
* **AA2 — Representable Through Existing Decision Infrastructure**
* **AA3 — Partial/Adaptation Required**
* **AA4 — Conceptually Related Infrastructure Only**
* **AA5 — Not Implemented**

Provide one primary classification for each and explain the evidence.

Do not inflate partial implementation merely because a generic primitive could eventually be reused.

---

## 38. Test Coverage Assessment

Identify existing tests covering relevant behavior.

At minimum inspect tests for:

* Goal creation/editing/lifecycle;
* Goal persistence;
* Goal links;
* source incarnation;
* historical Goal provenance;
* Goal measurement/progress;
* recurrence;
* block candidates;
* placement;
* priority;
* PlanDecision;
* suggested fixes;
* Friction;
* Preview generation;
* historical publication;
* execution/history.

Produce:

| Architectural Concern | Existing Test Coverage | Strength | Gap | Deterministic Claim Supported? |
| --------------------- | ---------------------- | -------- | --- | -----------------------------: |

Do not add tests.

Run focused existing tests only where necessary to verify deterministic claims made by the audit.

---

## 39. Governance and Architectural Constraints

The audit must preserve:

1. **User Authority** — engine reasoning cannot silently become intent.
2. **Commitment Time Ownership** — existing authorized obligations retain priority over discretionary Goal allocation.
3. **Capacity Authority** — Capacity remains derived, immutable to downstream consumers, and demand-neutral.
4. **Goal Non-Time-Ownership** — Goals do not occupy time merely by existing.
5. **Proposal Boundary** — constructive recommendations require a distinct Proposal layer.
6. **Friction Boundary** — scarcity before authority is not corrective Friction.
7. **Authored / Derived / Historical Separation** — epistemic states remain explicit.
8. **Source Incarnation** — stale source lifetimes cannot influence current planning.
9. **Determinism** — equivalent inputs and policy produce equivalent derived reasoning.
10. **Explainability** — demand, feasibility, allocation, and recommendation reasoning must preserve sufficient provenance.
11. **Immutable History** — decision-time truth cannot be rewritten from current state.
12. **No Double Claiming** — Goal-linked existing Commitments and new Goal Demand cannot claim the same intent twice.
13. **Priority Separation** — Commitment priority, Goal priority, preference priority, and heuristics must not be collapsed without explicit architecture.
14. **No Silent Learning Authority** — historical choice may inform recommendations but cannot silently establish current preference.
15. **Governance Neutrality** — this audit does not create Phase 8.

If current implementation violates an accepted principle, document the violation rather than weakening the principle.

---

## 40. Non-Goals

This audit must not:

* implement Capacity;
* implement Goal Demand;
* add Goal Demand types;
* add Goal priority;
* change Goal schema;
* change Goal persistence;
* change Goal progress;
* implement feasibility;
* implement Allocation;
* implement allocation policy;
* implement Proposal;
* implement Accepted Allocation;
* modify PlanDecision;
* modify Preview;
* modify Friction;
* modify scheduling;
* modify recurrence;
* modify placement;
* modify priority behavior;
* modify historical publication;
* modify execution/history;
* modify Summary;
* implement learned preferences;
* implement recurring allocation;
* implement attached activities;
* create production code;
* create or modify tests;
* modify configuration;
* modify existing documentation;
* restructure the repository;
* assign any work to Phase 8;
* define Phase 8.

This task is read-only with respect to the existing repository.

**The required audit result artifact is the sole permitted repository write.**

---

## 41. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/GOAL_DEMAND_ALLOCATION_ARCHITECTURE_AUDIT_RESULT.md`

The filename must contain `RESULT` because it is the durable Codex output produced by this audit.

Do not substitute another filename or path.

The result artifact must contain the complete audit.

Use this major structure:

1. **Executive Findings**
2. **Architectural Context**
3. **Evidence and Authority Model**
4. **Goal Domain Inventory**
5. **Current Goal-to-Schedule Flow**
6. **Goal Demand Search**
7. **Goal Demand Semantic Boundary**
8. **Goal vs Goal Demand**
9. **Goal Demand Authority and Provenance**
10. **Goal Priority**
11. **Target Date, Progress, and Urgency**
12. **Capacity Consumer Boundary**
13. **Goal-Specific Feasibility**
14. **Competing Demand**
15. **Allocation Definition**
16. **Allocation Granularity**
17. **Allocation Policy vs Goal Priority**
18. **Allocation Determinism and Explainability**
19. **Allocation vs Proposal**
20. **Proposal vs Preview**
21. **Allocation vs PlanDecision**
22. **Accepted Allocation Boundary**
23. **When Goal Work Begins to Own Time**
24. **Recurring Goal Demand and Repeated Authority**
25. **Rejection and Modification Semantics**
26. **Goal Progress and Allocation**
27. **Historical Provenance**
28. **Summary and Learning Boundary**
29. **Existing Primitive Reuse Assessment**
30. **Current vs Intended End-to-End Flow**
31. **Boundary Matrix**
32. **Authority-Transition Matrix**
33. **Worked Scenarios**
34. **Invariant Assessment**
35. **Architecture Questions**
36. **Implementation Classifications**
37. **Test Coverage Assessment**
38. **Architectural Gaps and Risks**
39. **Open Questions**
40. **Recommended Next Step**
41. **Completion Statement**

After writing the artifact:

1. verify the file exists at the exact required path;
2. reopen and read the saved artifact;
3. verify the audit is complete rather than a placeholder;
4. verify all required matrices are present;
5. verify all required architecture questions are answered;
6. verify all four implementation classifications are present;
7. verify the Completion Statement is exact;
8. inspect repository status;
9. verify no repository file other than the required `RESULT` artifact was modified.

Do not merely print findings in Codex's final response.

The durable `RESULT` artifact is required.

---

## 42. Validation

This is a read-only architecture audit.

Do not modify or add tests.

Run focused existing tests where necessary to substantiate deterministic claims.

At minimum consider coverage for:

* Goal domain/state;
* Goal links;
* Goal progress;
* source incarnation;
* recurrence;
* candidate generation;
* placement;
* priority;
* PlanDecision replay;
* Friction;
* suggested fixes;
* Preview;
* historical publication;
* execution/history.

Record:

* test files executed;
* test counts;
* pass/fail results;
* behaviors verified;
* gaps not covered by tests.

Do not run unrelated broad validation merely for ceremony.

After writing the required result artifact, inspect repository status.

If any repository file other than:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/GOAL_DEMAND_ALLOCATION_ARCHITECTURE_AUDIT_RESULT.md`

has changed, stop and report the deviation.

---

## 43. Completion Criteria

The audit is complete only when:

* [ ] The current Goal domain is fully inventoried.
* [ ] Goal persistence and authority are identified.
* [ ] Goal-to-Commitment linking is traced.
* [ ] Goal historical provenance is traced.
* [ ] Goal progress behavior is traced.
* [ ] Every current Goal-to-schedule path is traced.
* [ ] Goal Demand is searched for broadly rather than inferred from Goal existence.
* [ ] Candidate Goal-demand primitives are classified.
* [ ] The minimum Goal Demand semantic boundary is identified.
* [ ] Goal and Goal Demand are explicitly distinguished.
* [ ] Goal Demand authority models are evaluated.
* [ ] Authored versus derived demand provenance is evaluated.
* [ ] Existing Goal priority behavior is established.
* [ ] Goal priority is distinguished from Commitment priority.
* [ ] Target-date behavior is traced.
* [ ] Progress/urgency scheduling effects are traced.
* [ ] The Capacity consumer boundary is verified.
* [ ] Goal-Specific Feasibility is bounded.
* [ ] Existing feasibility primitives are classified for reuse.
* [ ] Current Commitment placement competition is distinguished from Goal allocation.
* [ ] Competing Goal demand is searched for.
* [ ] Allocation receives a minimum architectural definition.
* [ ] Allocation granularity is evaluated.
* [ ] Allocation policy is distinguished from Goal priority.
* [ ] Determinism requirements are identified.
* [ ] Explainability/provenance requirements are identified.
* [ ] Allocation and Proposal are explicitly distinguished.
* [ ] Proposal and Preview are explicitly distinguished.
* [ ] PlanDecision compatibility is evaluated.
* [ ] Accepted Allocation receives a minimum architectural boundary.
* [ ] The exact time-ownership transition for Goal-driven work is identified.
* [ ] Recurring authority scopes are evaluated.
* [ ] Rejection semantics are evaluated.
* [ ] Modification semantics are evaluated.
* [ ] One-off choices are protected from silent promotion to reusable preferences.
* [ ] Goal progress is distinguished from planned/allocated/scheduled time.
* [ ] Historical provenance requirements are identified.
* [ ] Summary/learning boundaries are identified.
* [ ] Existing primitives receive a comprehensive reuse classification.
* [ ] Current executable Goal flow is documented.
* [ ] Intended constructive Goal planning flow is documented.
* [ ] The first exact break between them is identified.
* [ ] The required boundary matrix is complete.
* [ ] The required authority-transition matrix is complete.
* [ ] All ten worked scenarios are evaluated.
* [ ] All proposed invariants are affirmed, refined, rejected, or deferred.
* [ ] Additional evidence-backed invariants are added where necessary.
* [ ] All twenty-six required architecture questions are explicitly answered.
* [ ] Goal Demand receives a final GD classification.
* [ ] Goal-Specific Feasibility receives a final GF classification.
* [ ] Allocation receives a final AL classification.
* [ ] Accepted Allocation receives a final AA classification.
* [ ] Test coverage is assessed.
* [ ] Material architectural gaps and risks are identified.
* [ ] Remaining questions are separated from established findings.
* [ ] A single recommended next step is selected.
* [ ] No implementation was performed.
* [ ] No existing documentation was modified.
* [ ] No future implementation phase was established.
* [ ] `GOAL_DEMAND_ALLOCATION_ARCHITECTURE_AUDIT_RESULT.md` was written to the exact required path.
* [ ] The saved artifact was reopened and verified.
* [ ] Repository status was inspected.
* [ ] The required `RESULT` artifact was the sole repository write.
* [ ] Codex's final response reports the exact artifact path.
* [ ] Codex's final response reports validation performed and results.
* [ ] Codex's final response confirms whether any other repository files changed.

---

## 44. Recommended Next-Step Gate

At the end of the audit, select exactly one primary next step.

### Path A — Goal Demand Architecture Specification

Choose if Goal Demand semantics, authority, provenance, and Capacity-consumer boundaries are sufficiently understood, but Allocation should remain downstream until Goal Demand is formally specified.

### Path B — Goal Demand and Allocation Architecture Specification

Choose if the audit resolves both domains sufficiently that they should be specified together as one coherent architectural contract.

### Path C — Allocation Follow-Up Audit

Choose if Goal Demand is sufficiently understood but Allocation contains material unresolved executable or architectural questions requiring a narrower audit before specification.

### Path D — Constructive Proposal Architecture Audit

Choose if Goal Demand and Allocation are sufficiently understood from accepted architecture and executable evidence, and Proposal is now the principal unresolved boundary.

### Path E — Targeted Implementation Audit

Choose only if a specific executable behavior must be investigated before the architecture can be specified safely.

### Path F — Architecture Reconciliation

Choose if the audit uncovers a material contradiction between accepted DayFrame architecture and current architectural assumptions requiring governance resolution.

Explain the selection.

Do not begin the selected next step.

Do not assign it to Phase 8 or another future implementation phase.

---

## 45. Final Completion Statement

End `GOAL_DEMAND_ALLOCATION_ARCHITECTURE_AUDIT_RESULT.md` with exactly:

> **Goal Demand and Allocation Architecture Audit complete.**
>
> The audit traces DayFrame's current Goal, scheduling, priority, decision, historical, and progress behavior against the committed Capacity architecture; distinguishes Goal intent from Goal Demand, Goal-specific feasibility from allocation, allocation reasoning from constructive Proposal, and engine reasoning from user authority; identifies the exact current implementation boundaries, reusable primitives, architectural gaps, authority transitions, provenance requirements, and downstream questions; and recommends the appropriate next architectural step without modifying the implementation or assigning the work to a future implementation phase.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/audits/GOAL_DEMAND_ALLOCATION_ARCHITECTURE_AUDIT_RESULT.md`
>
> **Repository modifications:** The required audit result artifact was the sole repository write.
>
> **Validation:** Report the focused existing tests executed, their results, and the deterministic behaviors they substantiate.
>
> **Recommended next step:** Report the selected Path A, B, C, D, E, or F without beginning that work.
