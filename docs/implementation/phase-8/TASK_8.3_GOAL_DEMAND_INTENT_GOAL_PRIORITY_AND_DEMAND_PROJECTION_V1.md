# Task 8.3 — Goal Demand Intent, Goal Priority, and Demand Projection V1

**Status:** Ready for Codex
**Phase:** Phase 8 — Goal and Capacity Foundations
**Task Type:** Implementation / Domain Authority / Persistence / Derived Planning Truth
**Primary Responsibility:** Establish first-class Goal Demand Intent and Goal Priority authority plus deterministic Demand Projection V1 without introducing Capacity, Feasibility, Allocation, Proposal, or scheduling effects.

---

## 1. Objective

Implement the next bounded Phase 8 Goal-side planning capability:

1. **Goal Demand Intent V1** as independently identified, revisioned, user-authorized planning-resource request authority associated with a Goal;
2. **Goal Priority V1** as separate revisioned, horizon-capable authored planning-priority authority associated with a Goal; and
3. **Demand Projection V1** as deterministic, disposable derived truth interpreting one applicable Demand revision over an exact bounded canonical user-day horizon.

This task must build directly on:

* Task 8.1 revision/provenance/freshness/history foundations;
* Task 8.2 Goal Structure authority and structural-eligibility query;
* existing Goal identity/lifecycle authority;
* existing canonical user-day/date semantics;
* existing Progress and Goal measurement authority only where explicitly supported by the accepted architecture; and
* existing persistence, restore, backup, full-clear, runtime-authority, and regression infrastructure.

At completion, DayFrame must be able to answer:

> **What planning resources has the user explicitly asked DayFrame to seek for this Goal, what independent planning priority currently applies, and what normalized Demand does that authority represent over this exact bounded horizon?**

It must **not** answer:

> Where can the Demand fit, which Goal should receive scarce Capacity, what should DayFrame recommend, or what should be scheduled?

Those belong to later Phase 8/9 capabilities.

---

## 2. Governing Architecture and Evidence

Before changing code, inspect the current repository and use the repository copies of the governing artifacts.

At minimum inspect:

* `docs/architecture/GOAL_DEMAND_AND_ALLOCATION_ARCHITECTURE_SPECIFICATION_RESULT.md`
* `docs/architecture/POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`
* `docs/architecture/POST_PHASE_7_IMPLEMENTATION_ALIGNMENT_STRATEGY_RESULT.md`
* `docs/roadmap/POST_PHASE_7_IMPLEMENTATION_ROADMAP_RESULT.md`
* `docs/implementation/phase-8/TASK_8.1_REVISIONED_PLANNING_PROVENANCE_AND_FRESHNESS_FOUNDATION_RESULT.md`
* `docs/implementation/phase-8/TASK_8.2_GOAL_STRUCTURE_V1_DOMAIN_AND_PERSISTENCE_RESULT.md`
* current Goal domain/state/history code;
* current Goal Structure domain/state/history code;
* current planning provenance/freshness primitives;
* current Progress and measurement code;
* canonical user-day/date utilities;
* persistence/database schema;
* restore coordinator and participants;
* runtime/notification authority registries;
* backup/version compatibility code;
* full-clear behavior;
* profile behavior;
* scheduling/Preview/Friction/publication/execution boundaries;
* relevant tests.

If repository filenames differ, locate the authoritative equivalents rather than inventing duplicate documents.

The Goal Demand and Allocation Architecture Specification is normative for semantics.

The Post-Phase-7 Implementation Roadmap is normative for sequencing and task boundaries.

Task 8.2 is the executable starting baseline.

Do not reopen accepted architecture merely because implementation requires naming, module placement, or bounded V1 representation decisions.

---

## 3. Starting Baseline

Task 8.2 established:

* first-class revisioned Goal Structure authority;
* typed `contains`, `contributesTo`, and `dependsOn` relationships;
* Goal-owned Milestones;
* deterministic structural eligibility;
* exact revision history;
* Task 8.1 provenance/dependency/freshness integration;
* IndexedDB persistence;
* protected atomic mutation and restore;
* Backup V7;
* older-state migration to explicit empty Goal Structure;
* scheduling non-interference;
* no Goal Demand;
* no Goal Priority;
* no Capacity;
* no Allocation;
* no Progress inference.

The recorded Task 8.2 validation baseline is:

* **100 test files passed**
* **993 tests passed**
* **0 failed**
* Prettier pass
* typecheck pass
* lint pass
* build pass
* bundle hard-policy pass, with raw/gzip early-warning headroom warnings already present.

Preserve this behavior unless this task explicitly and legitimately extends it.

---

## 4. Architectural Truth to Preserve

The implementation must preserve the following semantic chain:

```text
Goal
  + authored Demand Intent
  + applicable Goal Priority
  + applicable structural eligibility
  + explicitly permitted projection evidence
        ↓
Demand Projection

Demand Projection
        ↓
future Goal-Specific Feasibility

Feasibility + future Capacity
        ↓
future Competing Demand / Allocation
        ↓
future Proposal
        ↓
future explicit user acceptance
        ↓
future Accepted Allocation
        ↓
future Scheduled Goal Work
```

Task 8.3 stops at **Demand Projection**.

Demand Projection is not Capacity, Feasibility, Allocation, Proposal, Accepted Allocation, scheduled work, execution, or Progress.

---

## 5. Required Domain Boundary

### 5.1 Goal

Goal remains outcome authority.

Do not add scheduling ownership or Demand fields to the Goal record merely because Demand references a Goal.

A Goal may have:

* zero Demand lifetimes;
* one Demand lifetime; or
* multiple independent concurrent Demand lifetimes.

Goal existence alone must create no Demand.

### 5.2 Goal Demand Intent

Implement Goal Demand as independently identified authored authority.

A Demand:

* belongs to exactly one Goal;
* has opaque durable logical identity;
* has monotonic revisions;
* retains exact history;
* expresses authorized resource-seeking intent;
* owns no time;
* allocates no Capacity;
* schedules nothing;
* creates no Progress;
* creates no Friction merely because it is unmet.

### 5.3 Goal Priority

Implement Goal Priority as separate authored planning authority.

Goal Priority:

* references a Goal;
* is not stored as a Goal identity property;
* is not Commitment priority;
* is not derived urgency;
* is not Allocation Policy;
* owns no time;
* schedules nothing;
* may vary by explicit effective scope/horizon;
* retains independent identity/revision/history.

### 5.4 Demand Projection

Implement Demand Projection as deterministic derived truth.

Projection:

* interprets exactly one applicable Demand revision;
* resolves an exact bounded canonical user-day evaluation horizon;
* normalizes the V1 Demand dimensions;
* consumes structural eligibility as an explicit dependency;
* preserves dependency/provenance/freshness evidence;
* may use only explicitly authorized V1 projection inputs;
* owns no time;
* is not authored authority;
* is disposable/recomputable;
* must not invent requested effort.

---

## 6. Goal Demand Identity and Revision

Use Task 8.1 planning identity/revision conventions unless repository evidence requires a narrowly justified adaptation.

Each Demand lifetime must have:

* durable opaque logical ID;
* positive monotonic revision;
* Goal reference;
* lifecycle/applicability authority;
* created/updated/effective metadata appropriate to existing conventions;
* authored provenance;
* complete immutable historical revisions.

Creation begins at revision 1.

A declared semantic change appends a revision.

A semantic no-op must not advance revision.

Reads, sorting, projection, scheduling generation, unrelated Goal changes, or unrelated state must not advance revision.

A retired Demand ID must never be reused.

Exact historical resolution by `(Demand ID, revision)` must remain possible after later revisions or retirement.

Missing exact revisions must fail explicitly and must never alias the current revision.

---

## 7. Goal Demand Lifecycle V1

The accepted architecture conceptually supports:

* active;
* suspended;
* expired;
* completed/satisfied;
* retired.

Choose the smallest coherent V1 lifecycle representation that preserves these semantic distinctions where currently necessary.

Implementation labels may differ if justified by existing repository conventions, but do not collapse materially different semantics merely for convenience.

At minimum:

* inactive/non-applicable Demand must not create current Projection;
* suspension must preserve identity/history;
* retirement must preserve identity/history;
* Goal archival must prevent new current projection/allocation eligibility;
* Goal completion must not silently delete Demand history;
* lifecycle applicability and historical truth must remain distinct.

Do not invent automatic Progress or execution semantics for `completed`/`satisfied`.

If a narrower V1 state machine is chosen, document precisely how the remaining accepted lifecycle semantics are represented or intentionally deferred without contradicting the architecture.

---

## 8. Demand Intent V1 Dimensions

The architecture defines a broader bounded Demand vocabulary. Task 8.3 must implement the **smallest coherent V1 subset sufficient to establish real Demand authority and useful deterministic Projection**, while designing the representation so later Feasibility can consume it without semantic replacement.

V1 must support at least:

### 8.1 Requested Effort

Required.

Represent:

* explicit requested amount;
* explicit unit;
* deterministic normalized representation.

Do not infer requested effort from:

* Goal target date;
* Goal title/category;
* Progress;
* existing Commitments;
* scheduled time;
* historical execution.

### 8.2 Horizon Rule

Required.

Support a bounded V1 horizon representation that resolves deterministically into exact canonical user-day bounds.

Prefer repository-compatible forms justified by current canonical time infrastructure.

Do not use calendar-month display semantics as hidden planning authority.

Projection output must identify exact resolved user-day bounds.

### 8.3 Session Shape

V1 must support enough session semantics for later Feasibility to distinguish contiguous from splittable Demand.

At minimum support:

* minimum useful session or exact indivisible session;
* splittable vs indivisible;
* optional preferred session duration where practical;
* optional maximum session duration where practical.

Invalid combinations must fail deterministically.

Three 30-minute fragments must not become equivalent to one required contiguous 90-minute session merely because totals match.

Task 8.3 need not enumerate feasible sessions; it must preserve the authored semantics required for the later evaluator.

### 8.4 Demand Satisfaction Semantics

Represent the accepted distinction among:

* minimum acceptable;
* target;
* optional/aspirational demand

using the smallest coherent V1 semantic model.

Partial satisfaction must never be implicitly permitted.

If partial satisfaction is allowed, the Intent must say so explicitly and must carry the minimum meaningful threshold required by later Allocation.

### 8.5 Cadence / Count

Implement a bounded V1 cadence/session-count representation if it can be done without introducing recurrence or scheduling authority.

The key invariant is:

> **Repeated Demand is not recurring scheduling authority.**

For example:

`three sessions this user-week`

may be Demand.

It must not create:

`Monday / Wednesday / Friday scheduled recurrence`.

If the complete cadence vocabulary is too broad for V1, implement only the subset needed to support deterministic Projection and document the deferred forms.

### 8.6 Hard Constraints vs Preferences

Where V1 includes timing/session expressions, their semantic hardness must be explicit.

Examples:

* `evening required` → hard constraint;
* `evening preferred` → preference;
* `after Work required` → hard constraint;
* `after Work preferred` → preference.

Do not use one ambiguous field whose interpretation changes downstream.

If timing-window preferences are deferred from V1, state that explicitly rather than silently conflating them with hard constraints.

---

## 9. Explicitly Deferred Demand Dimensions

Do not implement architectural dimensions merely because they exist in the specification if they are not necessary for a coherent V1.

Candidates for deliberate deferral include, where justified:

* advanced work-relative timing;
* broad time-of-day preference vocabularies;
* complex workday/off-day compatibility policies;
* target-date pressure policies;
* Progress-responsive effort transforms;
* sophisticated existing-Commitment satisfaction accounting;
* advanced cadence forms;
* user-selectable projection policy catalogs.

Any deferred dimension must:

1. remain semantically possible under the chosen V1 representation;
2. not be silently approximated;
3. be documented in the Task 8.3 RESULT;
4. not be inferred from unrelated current fields.

---

## 10. Structural Eligibility Integration

Task 8.2 provides bounded structural eligibility:

* `eligible`
* `ineligible`
* `conditionallyEligible`
* `unknown`

with typed reasons, exact dependencies, and fingerprints.

Demand Projection must consume structural eligibility deliberately.

At minimum:

* current Demand for an ineligible Goal must not silently produce ordinary actionable Projection;
* `unknown` eligibility must remain explicitly unknown/protected rather than being treated as eligible;
* conditional eligibility must remain distinguishable;
* exact structural eligibility dependencies used by Projection must participate in Projection provenance/freshness;
* unrelated Goal Structure changes must not stale an otherwise unaffected Projection.

Do not duplicate Goal Structure graph logic inside Demand.

Use the existing Goal Structure query boundary.

---

## 11. Goal Priority V1

Implement independent revisioned Goal Priority authority.

### 11.1 Required Semantics

Use a small ordered relative level system with stable total-order semantics.

Exact labels are an implementation/UI choice.

The V1 authority must nevertheless have unambiguous semantic ordering.

Goal Priority must:

* reference exactly one Goal;
* have durable identity/revision/history;
* have explicit applicability/effective scope;
* support current query;
* support exact historical resolution;
* be independently revisable;
* preserve no-op revision behavior;
* participate in persistence/restore/backup;
* produce no scheduling effect.

### 11.2 Priority Scope

The accepted architecture permits horizon-capable Priority.

Implement the smallest coherent V1 scope model that allows:

* a default/current applicable priority; and
* future bounded overrides without revising Goal identity.

Do not create pairwise preferences or arbitrary numeric weighting systems.

If V1 supports only a bounded default plus explicit horizon override form, document that contract.

### 11.3 Priority Boundaries

Priority must not be:

* Commitment priority;
* Goal lifecycle;
* Demand amount;
* required/optional Demand semantics;
* derived urgency;
* target-date pressure;
* learned preference;
* Allocation Policy;
* permission to displace Commitments.

Priority does not affect structural eligibility.

Priority does not need to affect Demand Projection unless the architecture requires it as explanatory dependency; it principally exists for future competing Demand/Allocation.

Do not manufacture downstream ranking behavior in Task 8.3.

---

## 12. Demand Projection V1

Implement a pure deterministic Projection boundary.

For one Demand revision and one exact evaluation horizon, Projection must provide enough normalized information for future Capacity/Feasibility work.

At minimum include:

* Projection semantic identity/fingerprint;
* Demand ID and exact revision;
* Goal ID and exact relevant Goal revision/lifecycle evidence;
* exact canonical user-day evaluation bounds;
* normalized requested effort;
* applicable minimum/target/optional semantics;
* session-shape/partition requirements represented by V1;
* cadence/count requirements represented by V1;
* structural eligibility state;
* relevant typed reasons;
* declared dependencies;
* canonical dependency fingerprint;
* freshness/applicability;
* projection-policy/version identity;
* explicit coverage.

Projection must be reproducible from semantically equivalent inputs.

Array order, runtime insertion order, random IDs generated during evaluation, persistence enumeration order, or UI ordering must not change semantic Projection output.

---

## 13. Projection Policy V1

Projection requires explicit versioned policy identity even if V1 behavior is intentionally simple.

The initial policy should do only what is necessary to:

* resolve the authored horizon;
* normalize requested effort;
* project cadence/count semantics where supported;
* integrate structural eligibility;
* produce dependency/freshness evidence;
* preserve explicit coverage.

Do not use the policy as a hidden place to introduce:

* inferred requested effort;
* urgency;
* Goal Priority mutation;
* Allocation;
* Capacity assumptions;
* Proposal ranking;
* scheduling.

If Progress-responsive or target-date-responsive projection is not required for coherent V1, defer it rather than inventing policy.

---

## 14. Progress Boundary

Preserve the architecture's strict separation among:

```text
Demand satisfaction
Allocated effort
Accepted effort
Scheduled effort
Executed effort
Goal Progress
```

Task 8.3 must not:

* create Progress observations;
* infer Progress from scheduled effort;
* infer Progress from Demand;
* infer Demand from Progress;
* automatically increase/decrease authored Demand because Progress changes.

If V1 includes any Progress-informed Projection behavior, it must:

* use an explicit versioned relationship policy;
* reference exact measurement definition/observation/cutoff;
* remain derived;
* leave Demand Intent unchanged;
* leave Goal Priority unchanged;
* participate in Projection freshness.

Unless repository evidence shows this is necessary for the smallest coherent V1, prefer deferral and document it.

---

## 15. Existing Commitment Attribution Boundary

The architecture eventually permits explicit Demand-Satisfaction Attribution from exact existing Commitment authority.

A generic Goal link is insufficient.

Task 8.3 must not treat:

* Goal links;
* Commitment titles;
* categories;
* scheduled blocks;
* execution;
* historical similarity

as implicit Demand satisfaction.

If explicit Commitment satisfaction attribution is not required for the smallest coherent V1, defer it.

If implemented, it must be:

* Demand-specific;
* explicit;
* versioned;
* exact-source aware;
* horizon-aware;
* double-count protected;
* separate from Progress.

Do not broaden Task 8.3 merely to implement the entire future attribution model unless repository evidence demonstrates that it is inseparable from coherent V1 Projection.

---

## 16. Persistence Model

Persist authored authority, not disposable derived truth unless existing architecture requires a cache with explicit freshness.

At minimum persist:

* complete Goal Demand revision history;
* complete Goal Priority revision history.

Use a sibling planning authority collection or collections consistent with existing repository patterns and Task 8.2.

Do not embed Demand/Priority history into:

* Goal Structure;
* Goal records;
* Commitment records;
* profiles;
* Preview;
* scheduling output.

If a shared mixed-record authority is chosen, types must remain explicitly distinguishable and exact-history resolution must remain deterministic.

Projection should normally be recomputed from authority and dependencies rather than becoming independent persisted authority.

---

## 17. Migration

Migration must be additive, deterministic, and non-inferential.

Existing users must retain all current Goals, Goal Structure, Commitments, schedules, Progress, history, and profiles.

Older state must acquire:

* **no invented Goal Demand**
* **no invented Goal Priority**

Do not infer Demand or Priority from:

* Goal titles/descriptions;
* target dates;
* Goal Structure;
* Goal links;
* Commitment links;
* Commitment priority;
* recurrence;
* scheduled blocks;
* execution;
* Progress;
* historical plans;
* categories;
* current UI ordering.

Empty authority is the correct migration state when no explicit new authority exists.

Migration must be safe on repeated/opened upgraded state according to existing persistence conventions.

---

## 18. Backup / Restore Integration

Advance the current backup version if required by the new persisted authority.

The current baseline is Backup V7.

A conforming current backup must preserve:

* all Goal Demand IDs/revisions/history;
* all Goal Priority IDs/revisions/history;
* all existing Goal Structure history;
* all previously supported authorities.

Restore must validate cross-domain Goal references before replacing live authority.

Restore must participate in the existing protected multi-authority transaction/rollback boundary.

Older backups must restore with explicit empty Demand/Priority authority.

Do not infer missing Demand/Priority during older backup import.

If older-version export would silently lose live Demand/Priority authority, refuse the lossy downgrade consistently with the protection introduced for Goal Structure.

Malformed, future, dangling, or unsupported authority must fail safely under existing protected-mode/validation conventions.

---

## 19. Profile Compatibility

Profiles currently own authored setup state but do not own Goals or Goal Structure.

Do not silently add Goal Demand or Goal Priority to profiles unless repository evidence and accepted architecture explicitly require a profile semantic change.

The expected default is:

* profiles do not own Goal Demand;
* profiles do not own Goal Priority;
* loading a profile neither deletes nor invents them.

Document the inspected compatibility result.

---

## 20. Store / Authority Surface

Expose explicit bounded commands.

At minimum provide appropriate equivalents of:

### Demand

* create Demand;
* revise Demand;
* suspend/reactivate where supported;
* retire Demand;
* list current Demands by Goal;
* resolve exact Demand revision;
* compute current/bounded Demand Projection;
* export/replace Demand authority for persistence/restore;
* durability retry/subscription as required by current architecture.

### Goal Priority

* create/set Priority authority;
* revise applicable Priority;
* retire/supersede where appropriate;
* query applicable current Priority for Goal/horizon;
* resolve exact Priority revision;
* export/replace Priority authority;
* durability retry/subscription as required.

Do not add generic public `set(any)` mutation.

Invalid commands must fail before changing runtime or durable authority.

---

## 21. Mutation Atomicity

Follow the Task 8.2 protected mutation pattern.

A command must:

1. validate references and input;
2. construct the candidate revision;
3. validate semantic invariants;
4. validate cross-domain Goal authority where required;
5. commit runtime/durable authority only after candidate validity is established.

Invalid candidates must leave both runtime and durable state unchanged.

Restore must include the new authorities in the existing atomic multi-authority rollback boundary.

Do not permit partial restore where Demand exists without its referenced Goal.

---

## 22. Query Boundary

Consumers must not inspect raw IndexedDB arrays.

Provide deterministic bounded query APIs for:

* current applicable Demands for a Goal;
* exact Demand revision;
* current applicable Goal Priority;
* exact Priority revision;
* bounded Demand Projection for exact evaluation horizon;
* relevant provenance/dependencies/freshness/reasons.

Queries must have canonical deterministic ordering.

Stable ordering is not semantic Priority unless explicitly returned from Priority authority.

---

## 23. Scheduling Non-Interference

Task 8.3 must have **zero scheduling effect**.

Goal Demand, Goal Priority, and Demand Projection must remain absent from:

* Commitment candidate generation;
* work/cycle generation;
* placement;
* Preview scheduled-block generation;
* Friction detection;
* Suggested Fix generation;
* PlanDecision;
* publication;
* Today scheduled truth;
* execution;
* automatic Progress creation.

Add a dedicated regression proving that identical authored scheduling state produces byte-for-byte equivalent schedule-generation output before and after adding:

* Goal Demand;
* Goal Priority;
* Demand Projection-capable authority.

Priority must not reorder Commitment scheduling.

Demand must not create candidate blocks.

Projection must not create blocks.

Unmet Demand must not create Friction.

---

## 24. Capacity / Feasibility Boundary

Do **not** implement Capacity or Goal-Specific Feasibility in this task.

Task 8.3 may prepare stable Demand Projection contracts required by future Feasibility, but it must not:

* inspect openings and call them Capacity;
* enumerate compatible Capacity slices;
* test actual fit against schedule availability;
* reserve time;
* subtract occupied intervals;
* rank opportunities;
* claim that Demand is feasible/infeasible based on current schedule geometry.

Structural eligibility is not time feasibility.

Keep these concepts distinct.

---

## 25. Allocation Boundary

Do **not** implement:

* Competing Demand Sets;
* scarce-resource competition;
* Allocation Policy;
* Allocation;
* partial resource assignment;
* Capacity claims;
* tie-breaking among Goals;
* Goal-to-Goal resource ranking;
* Proposal alternatives.

Goal Priority is authored now because downstream Allocation will require it.

It must not be activated prematurely as an allocation engine.

---

## 26. Proposal / Acceptance Boundary

Do **not** implement:

* Proposal;
* ProposalDecision;
* Accepted Allocation;
* constructive placement recommendation;
* user acceptance/rejection/modification;
* scheduled Goal Work;
* recurring scheduling pattern creation;
* reusable preference promotion.

Demand is resource-seeking intent, not authorization to schedule.

No Task 8.3 output may become time-owning merely because it is deterministic, persisted, or high priority.

---

## 27. Friction Boundary

Unmet Demand is not Friction.

Structurally ineligible Demand is not Friction.

Unknown Projection eligibility is not Friction.

Future Capacity scarcity is not Friction.

Task 8.3 must not create or reinterpret Friction.

Existing Friction remains corrective diagnosis over time-owning authored/accepted schedule reality.

---

## 28. Historical Resolution

Every authored Demand and Priority revision must remain exactly resolvable after:

* later edits;
* lifecycle changes;
* suspension;
* retirement;
* Goal changes;
* unrelated authority changes.

Historical queries must never reconstruct old authority from current mutable state.

Projection itself may remain disposable, but its semantic dependencies must be sufficiently exact that later Proposal/decision history can freeze or reference the decision-time facts without ambiguity.

Do not build Proposal history now.

---

## 29. Provenance / Freshness Requirements

Reuse Task 8.1 primitives.

Demand and Priority authored authority must carry appropriate direct-authoring provenance.

Projection must declare only material dependencies.

Expected material dependencies may include:

* exact Demand revision;
* exact Goal revision/lifecycle facts used;
* exact Goal Structure eligibility dependencies used;
* exact evaluation horizon;
* projection-policy version;
* exact optional Progress/measurement evidence if such behavior is implemented;
* exact optional satisfaction-attribution authority if implemented.

Unrelated Goal changes must not stale Projection.

Unrelated Goal Structure changes must not stale Projection.

Unrelated Progress must not stale Projection.

A material dependency change must make previously stored/evaluated evidence stale.

Missing decisive authority must produce `Unknown`/protected behavior rather than optimistic inference.

Reason codes must remain structured and bounded rather than rendered prose.

---

## 30. Determinism

All new current projections and query results must be deterministic.

Equivalent semantic inputs must yield equivalent semantic outputs regardless of:

* array insertion order;
* IndexedDB enumeration order;
* object property construction order;
* runtime-generated evaluation IDs;
* UI ordering;
* unrelated state.

Use canonical sorting/fingerprinting consistent with Task 8.1 and Task 8.2.

Tests must deliberately perturb insertion/order where appropriate.

---

## 31. Validation Rules

At minimum reject or explicitly classify:

* Demand referencing nonexistent Goal;
* Priority referencing nonexistent Goal;
* malformed IDs/revisions;
* invalid lifecycle transition;
* non-positive requested effort;
* unsupported unit;
* invalid/empty horizon;
* incoherent session bounds;
* invalid splittability/minimum combinations;
* invalid satisfaction thresholds;
* invalid cadence/count combinations;
* malformed Priority scope;
* malformed Priority level;
* duplicate/conflicting applicable Priority authority where V1 semantics forbid it;
* malformed persisted revision history;
* dangling restored authority;
* future/unsupported backup records.

Validation must be deterministic and must not silently normalize semantic contradictions into a different user intent.

---

## 32. V1 Design Decision Record

Because the accepted architecture deliberately leaves the exact V1 Demand subset and Priority labels as implementation questions, the RESULT must contain a bounded decision table covering at least:

| Question                            | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ----------------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| effort unit(s)                      |             |                     |                    |                     |
| horizon forms                       |             |                     |                    |                     |
| session shape                       |             |                     |                    |                     |
| splittability                       |             |                     |                    |                     |
| cadence/count                       |             |                     |                    |                     |
| minimum/target/optional semantics   |             |                     |                    |                     |
| timing hard constraints             |             |                     |                    |                     |
| timing preferences                  |             |                     |                    |                     |
| Goal Priority levels                |             |                     |                    |                     |
| Priority scope                      |             |                     |                    |                     |
| Progress relationship               |             |                     |                    |                     |
| Commitment satisfaction attribution |             |                     |                    |                     |
| Projection policy                   |             |                     |                    |                     |

These are implementation decisions within accepted architecture.

Do not create an ADR unless implementation reveals a genuinely new durable architectural decision not already bounded by the specification.

---

## 33. Required Tests

Add focused tests sufficient to prove the new authority and boundaries.

At minimum cover:

### Demand Identity / Revision

* creation starts at revision 1;
* semantic revision increments;
* semantic no-op does not increment;
* multiple independent Demands may reference one Goal;
* retirement preserves exact history;
* retired identity is not reused;
* exact missing revision returns not-found.

### Demand Validation

* nonexistent Goal rejected;
* malformed effort rejected;
* malformed horizon rejected;
* incoherent session semantics rejected;
* invalid partial/minimum semantics rejected;
* invalid cadence/count combination rejected where applicable.

### Priority

* independent Goal Priority authority;
* deterministic ordered semantics;
* revision/no-op behavior;
* horizon/applicability behavior;
* exact historical resolution;
* no use of Commitment priority;
* nonexistent Goal rejected.

### Projection

* deterministic normalization;
* exact canonical user-day horizon;
* exact Demand revision dependency;
* structural eligibility integration;
* ineligible/conditional/unknown distinction;
* dependency fingerprint;
* relevant changes stale evidence;
* unrelated changes do not stale evidence;
* projection does not invent effort.

### Persistence / Restore

* restart preserves exact Demand history;
* restart preserves exact Priority history;
* malformed persisted authority fails safely;
* invalid mutation is atomic;
* restore preserves IDs/revisions;
* dangling Goal references rejected;
* older DB migration yields empty Demand/Priority;
* older backup import yields empty Demand/Priority;
* lossy older export is refused when necessary.

### Scheduling Boundary

Prove:

```text
same authored scheduling state
+ no Goal planning authority

and

same authored scheduling state
+ Goal Demand
+ Goal Priority
+ projection query/evaluation

produce byte-for-byte equivalent generated schedule output
```

Also prove unmet Demand creates no Friction.

### Regression

Run the relevant Goal, Goal Structure, Progress, store, persistence, backup, scheduling, Preview, Friction, publication, execution, Month, Today, Summary, and full regression suites.

---

## 34. Backup Versioning

If persisted Demand/Priority authority is added, advance the current backup format from V7 to the next appropriate version.

Do not mutate V7 semantics retroactively.

The new current format must round-trip:

* existing authorities;
* Goal Structure;
* complete Demand history;
* complete Priority history.

Older readers/importers must retain their historical semantics.

Document exact compatibility behavior in the RESULT.

---

## 35. Full-Clear / Runtime Authority Integration

Update all exhaustive authority registries that must know about new durable authority.

Inspect and update as required:

* full-clear;
* restore participants;
* restore coordinator/composition;
* runtime authority registry;
* notification/subscription registry;
* durability retry;
* backup validation/export/import;
* protected mode;
* test reset helpers.

Do not leave Demand/Priority as partially registered persistence.

Add regression coverage proving full-clear removes the new authority while preserving existing full-clear semantics.

---

## 36. UI Boundary

Task 8.3 is primarily domain/persistence/derived-truth work.

Do not build a broad Goal-planning UI.

Minimal exposure is permitted only if required to prove a safe existing query/authoring seam and if it does not create incomplete product semantics.

Prefer stable domain/query contracts first.

Do not add:

* Proposal UI;
* Capacity UI;
* feasibility indicators;
* scheduled Goal blocks;
* allocation controls;
* implied automatic planning.

If no UI is required for coherent completion, leave the capability intentionally non-UI and state that clearly.

---

## 37. Profiles

Inspect profile semantics explicitly.

Unless existing architecture demonstrates otherwise:

* profiles must remain separate from Goals;
* Demand/Priority must not be inferred into profiles;
* profile save/load must not create, replace, or delete Goal planning authority.

Add compatibility regression only where needed.

---

## 38. Existing Goal-Link Compatibility

Existing Goal service links remain distinct from Goal Demand.

Do not reinterpret them as:

* Demand;
* Priority;
* satisfaction attribution;
* Progress;
* structural relationships.

A future explicit satisfaction-attribution model may reference existing Commitment authority, but Task 8.3 must not infer that meaning from current links.

---

## 39. DF-006 Boundary

DF-006 remains the bounded historical Work-authority regression/observability concern established by prior work.

Task 8.3 must not repair, reinterpret, or broaden DF-006 unless the new code directly violates its existing regression boundary.

Keep existing DF-006 protections green.

Do not make speculative Work/Month changes as part of Goal Demand.

---

## 40. Bundle / Performance Discipline

Task 8.2 already left the eager bundle above warning thresholds while below hard limits.

Treat bundle headroom as an active constraint.

Prefer:

* compact domain authority;
* pure derived Projection;
* no new eager UI;
* no generic planning framework;
* no graph/search engine unnecessary for Demand;
* bounded personal-scale queries;
* canonical lightweight fingerprints;
* lazy surface code where exposure is unavoidable.

Record before/after bundle results.

A hard bundle-policy failure blocks completion.

A warning regression requires explicit accounting and reasonable mitigation review.

Do not sacrifice semantic correctness merely to reduce bundle size.

---

## 41. Accessibility

If Task 8.3 adds no UI, state that no new accessibility surface was introduced.

If minimal UI is necessary, it must provide:

* keyboard operation;
* semantic labels;
* non-color priority/status communication;
* readable validation;
* accessible freshness/applicability state;
* mobile-safe layout.

Do not create inaccessible temporary authoring controls merely to demonstrate the domain.

---

## 42. Governance

At completion:

* update `docs/architecture/CURRENT_STATE.md`;
* update `docs/architecture/CHANGELOG.md`;
* update `docs/architecture/DECISIONS.md` only if a genuine new architectural/implementation decision requires durable recording;
* do not rewrite accepted specifications;
* do not rewrite the Post-Phase-7 roadmap;
* do not rewrite Task 8.1 or Task 8.2 results.

Record whether implementation evidence requires an architecture reopen.

Expected answer absent contradiction:

> **No.**

---

## 43. Repository Discipline

Before implementation:

1. inspect `git status`;
2. identify pre-existing uncommitted Task 8.1/8.2/Phase 8 work;
3. preserve it;
4. do not delete or overwrite unrelated work;
5. do not silently clean the tree.

At completion:

* report added files;
* report modified files;
* report pre-existing changes separately from Task 8.3 changes;
* do not commit;
* do not push unless explicitly instructed.

---

## 44. Validation Commands

Run the repository's actual supported equivalents of:

```bash
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
```

Also run focused suites for:

* Goal Demand;
* Goal Priority;
* Demand Projection;
* Goal Structure interaction;
* persistence/restore;
* backup;
* scheduling non-interference;
* full-clear/store integration.

Do not claim completion with a failing required gate.

If a command differs in the repository, use the repository-defined equivalent and report it exactly.

---

## 45. Required Result Artifact

Create a durable Markdown result artifact in the dedicated Phase 8 implementation-results location.

The filename must contain **`RESULT`**.

Preferred naming:

```text
TASK_8.3_GOAL_DEMAND_PRIORITY_AND_PROJECTION_V1_RESULT.md
```

The result must include at minimum:

1. Executive Result
2. Scope Delivered
3. Governing Evidence Used
4. Task 8.1 Foundation Reuse
5. Task 8.2 Goal Structure Reuse
6. Existing Goal Model Assessment
7. Files Added
8. Files Modified
9. Demand Identity Model
10. Demand Lifecycle
11. Demand V1 Dimension Set
12. Requested Effort Semantics
13. Horizon Model
14. Session Shape / Splittability
15. Cadence / Count Semantics
16. Minimum / Target / Optional Semantics
17. Hard Constraint / Preference Boundary
18. Goal Priority Model
19. Goal Priority Scope
20. Structural Eligibility Integration
21. Demand Projection Model
22. Projection Policy
23. Provenance / Dependency Integration
24. Freshness / Reason Integration
25. Progress Boundary
26. Existing Commitment Attribution Disposition
27. Persistence Model
28. Migration
29. Backup Integration
30. Profile Compatibility
31. Store Actions
32. Mutation Atomicity
33. Revision History
34. Retirement / Historical Resolution
35. Query Boundary
36. Scheduling Boundary
37. Capacity / Feasibility Boundary
38. Allocation Boundary
39. Proposal / Acceptance Boundary
40. Friction Boundary
41. Tests Added
42. Persistence / Backup Tests
43. Scheduling Regressions
44. Full Regression Results
45. Validation Commands / Results
46. Bundle Result
47. Performance Notes
48. Compatibility Notes
49. DF-006 Relationship
50. V1 Design Decision Table
51. Implementation Decisions
52. Deviations
53. Architecture Reopen Check
54. Governance Updates
55. Repository Status
56. Completion Assessment
57. Recommended Next Task
58. Completion Statement

Add additional sections if implementation evidence warrants them.

---

## 46. Required V1 Decision Table

The RESULT must include this completed matrix:

| Question                            | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ----------------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| effort unit(s)                      |             |                     |                    |                     |
| horizon forms                       |             |                     |                    |                     |
| session shape                       |             |                     |                    |                     |
| splittability                       |             |                     |                    |                     |
| cadence/count                       |             |                     |                    |                     |
| minimum/target/optional             |             |                     |                    |                     |
| timing hard constraints             |             |                     |                    |                     |
| timing preferences                  |             |                     |                    |                     |
| Goal Priority levels                |             |                     |                    |                     |
| Priority scope                      |             |                     |                    |                     |
| Progress relationship               |             |                     |                    |                     |
| Commitment satisfaction attribution |             |                     |                    |                     |
| Projection policy                   |             |                     |                    |                     |

The table must distinguish:

* **implemented now**
* **represented but not consumed yet**
* **explicitly deferred**

Do not describe a deferred feature as partially implemented merely because the type could theoretically support it.

---

## 47. Required Boundary Matrix

The RESULT must explicitly verify:

| Concept             | Implemented in 8.3? | Authored / Derived             |              Owns Time? | May Affect Scheduling Now? |
| ------------------- | ------------------: | ------------------------------ | ----------------------: | -------------------------: |
| Goal                |            Existing | Authored                       |                      No |                         No |
| Goal Structure      |            Existing | Authored + derived eligibility |                      No |                         No |
| Demand Intent       |                 Yes | Authored                       |                      No |                         No |
| Goal Priority       |                 Yes | Authored planning authority    |                      No |                         No |
| Demand Projection   |                 Yes | Derived                        |                      No |                         No |
| Capacity            |                  No | Derived future                 |                      No |                         No |
| Feasibility         |                  No | Derived future                 |                      No |                         No |
| Competing Demand    |                  No | Derived future                 |                      No |                         No |
| Allocation          |                  No | Derived future                 |                      No |                         No |
| Proposal            |                  No | Proposed future                |                      No |                         No |
| Accepted Allocation |                  No | Accepted future                | Authorizes future claim |                         No |
| Scheduled Goal Work |                  No | Future scheduled reality       |                     Yes |                        N/A |
| Progress            |            Existing | Observation/derived outcome    |                      No |        No automatic effect |

Any deviation must be treated as an architecture concern.

---

## 48. Required Invariant Verification

At minimum explicitly verify the Task 8.3-relevant accepted invariants:

* Goal existence does not produce Demand.
* Demand requests resources without owning time.
* Projection traces to authorized Demand Intent and explicit policy.
* Projection does not invent effort.
* Authored and derived Demand facts remain separate.
* Goal Priority remains separate from Commitment priority.
* Target/Progress pressure does not silently become Priority.
* Structural eligibility does not become time feasibility.
* Goal evaluation does not mutate scheduling state.
* Recurring Demand does not become recurring scheduling authority.
* Existing Goal links do not establish Demand satisfaction.
* Demand satisfaction and Progress remain distinct.
* Unmet Demand does not create Friction.
* No unaccepted Goal work appears as scheduled reality.
* Historical Demand/Priority revisions remain exactly resolvable.
* Derived Projection remains deterministic and stale-aware.
* Older state acquires no invented Demand/Priority authority.

---

## 49. Completion Criteria

Task 8.3 is complete only when all of the following are true:

1. Goal Demand Intent exists as first-class revisioned authority.
2. One Goal may own multiple independent Demand lifetimes.
3. Demand V1 has a coherent bounded dimension set.
4. Demand owns no time and produces no schedule automatically.
5. Goal Priority exists as separate revisioned planning authority.
6. Goal Priority is not Goal identity, Commitment priority, urgency, or Allocation Policy.
7. Demand Projection exists as deterministic derived truth.
8. Projection resolves exact canonical user-day horizon.
9. Projection consumes structural eligibility without duplicating Goal Structure logic.
10. Projection preserves explicit provenance, dependencies, freshness, reasons, and coverage.
11. Projection does not invent effort.
12. Demand/Priority exact history survives revisions and retirement.
13. Invalid mutations are atomic.
14. Persistence/restart preserves complete authored history.
15. Migration creates no invented Demand/Priority.
16. Backup/restore round-trips all new authority safely.
17. Older backups remain compatible through explicit empty new authority.
18. Profiles retain their existing semantic boundary.
19. Existing Goal links are not reinterpreted.
20. Progress remains semantically separate.
21. Capacity and Feasibility remain unimplemented.
22. Competing Demand and Allocation remain unimplemented.
23. Proposal/Accepted Allocation/Scheduled Goal Work remain unimplemented.
24. Unmet Demand creates no Friction.
25. Existing deterministic scheduling output remains unchanged.
26. Full-clear and protected restore include the new authority.
27. Required focused tests pass.
28. Full regression suite passes.
29. formatting/typecheck/lint/build pass.
30. bundle hard policy passes.
31. `CURRENT_STATE.md` and `CHANGELOG.md` are updated.
32. the Task 8.3 `RESULT` artifact is created with `RESULT` in its filename.
33. any V1 deferrals are explicit rather than silently approximated.
34. no accepted architecture contradiction remains unresolved.

---

## 50. Stop / Reopen Conditions

Stop and report rather than improvising if implementation evidence shows that:

* Goal Demand cannot be represented without changing Goal identity semantics;
* structural eligibility cannot be consumed without changing Goal Structure semantics;
* canonical user-day horizon resolution is insufficient for bounded Projection;
* Goal Priority cannot remain separate from Commitment priority;
* persistence cannot safely preserve independent revision history;
* restore cannot atomically validate cross-domain references;
* implementing coherent Demand requires Capacity or Allocation semantics;
* current scheduling would necessarily consume Demand before acceptance;
* Progress must become implicit effort authority;
* existing Goal links would need to be reinterpreted as Demand satisfaction;
* an accepted architecture invariant must be violated.

These conditions require an architecture reopen or a separately bounded prerequisite task.

Do not solve them by silently changing architecture.

---

## 51. Expected Next Roadmap Position

Successful Task 8.3 completes the Phase 8 **Goal Structure + Demand/Priority authoring** side of the first Goal-side checkpoint and establishes Demand Projection as the future consumer contract.

The next roadmap increment is expected to move to:

> **Commitment Composition**

before Capacity, because Capacity must account for complete required support/Buffer footprint rather than merely current primary Commitment geometry.

Do not begin Commitment Composition in Task 8.3.

Do not skip directly to Capacity.

---

## 52. Final Completion Statement

The Task 8.3 RESULT must end with a completion statement materially equivalent to:

> **Task 8.3 — Goal Demand Intent, Goal Priority, and Demand Projection V1 complete.**
>
> DayFrame now has first-class revisioned Goal Demand Intent and independent Goal Priority authority built on the Phase 8 planning provenance/freshness foundation and existing Goal Structure authority; Demand represents explicit user-authorized resource-seeking intent without owning time, Priority represents separate planning importance without becoming Commitment priority or allocation policy, and Demand Projection deterministically interprets exact Demand authority over bounded canonical user-day horizons with explicit provenance, dependencies, structural eligibility, freshness, reasons, and coverage; exact Demand and Priority history remains resolvable; persistence, migration, backup, restore, full-clear, and compatibility behavior preserve authority without inventing it for older state; Goal links, scheduled effort, execution, and Progress remain semantically distinct from Demand satisfaction; unmet or structurally ineligible Demand creates no Friction; Goal Demand, Goal Priority, and Projection have no scheduling effect; Capacity, Goal-Specific Feasibility, Competing Demand, Allocation, Proposal, Accepted Allocation, and Scheduled Goal Work remain outside this task; existing deterministic scheduling and historical behavior remain intact; and the repository is ready to proceed to the next bounded Phase 8 Commitment Composition increment without reopening accepted architecture.
