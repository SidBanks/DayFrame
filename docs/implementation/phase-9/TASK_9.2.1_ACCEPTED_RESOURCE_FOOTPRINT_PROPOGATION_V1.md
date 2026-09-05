# Task 9.2.1 — Accepted Resource Footprint Propagation V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Subphase:** Task 9.2 Architecture-Reopen Repair
**Task Type:** Contract Repair / Resource-Footprint Propagation / Acceptance Fidelity / Regression
**Primary Responsibility:** Extend the existing Allocation → Proposal → ProposalDecision → Accepted Allocation chain so accepted authority preserves the exact productive Goal-work claim, required support-activity footprint, Buffer protection footprint, role classification, and component lineage needed by future realization, without implementing schedule realization, execution identity, publication changes, recurrence, or new user-facing planning behavior.

---

## 1. Objective

Task 9.2.0 is now the normative architecture for this task. Where the original Task 9.2.1 prompt presented architecture-discovery choices, replace discovery with direct implementation of the decisions recorded in the Task 9.2.0 RESULT. Do not reopen settled 9.2.0 decisions unless executable evidence directly contradicts them

Repair the architecture-reopen condition discovered while beginning Task 9.3.

Current executable evidence shows:

* Allocation session partitions carry only productive claim geometry;
* Proposal generation propagates only those productive claims;
* Proposal currently hard-codes support and Buffer footprint to zero;
* Accepted Allocation therefore cannot identify exact support activities or Buffer protection that the user authorized;
* Task 9.3 cannot safely realize an incomplete accepted footprint.

Task 9.2.1 must establish a complete accepted-resource-footprint contract.

At completion DayFrame must be able to answer:

> **For this Allocation alternative, Proposal option, ProposalDecision, and Accepted Allocation, what exact productive Goal work, real support activity, and Buffer protection consume or protect Capacity; which components are required or optional; where did each component come from; and exactly what resource footprint did the user authorize?**

Task 9.2.1 must **not** yet answer:

> Put those accepted components onto the schedule.

That remains Task 9.3 after the realization-identity foundation is also complete.

---

## 2. Architecture-Reopen Finding

Task 9.3 stopped under an explicit specification-defined architecture reopen condition.

Blocking evidence:

1. Accepted claims currently contain productive Allocation session partitions only.
2. Allocation claims contain no productive/support/Buffer role or component lineage.
3. Proposal generation hard-codes support and Buffer totals to zero and assumes neither is required.
4. Accepted Allocation therefore cannot identify exact support activities or Buffer intervals for realization.
5. Future realization would have to infer or recreate resource obligations after acceptance, violating accepted-authority fidelity.

This task resolves only items 1–4.

The separate downstream scheduled/execution/history identity gap belongs to Task 9.2.2.

---

## 3. Reopen Resolution Principle

Do not change the accepted authority architecture.

Preserve:

```text id="b4e2yn"
Allocation
→ Proposal
→ ProposalDecision
→ Accepted Allocation
```

Repair the **content fidelity** of the resource contract flowing through that chain.

The intended result is:

```text id="9856nm"
Demand satisfaction
        ↓
productive Goal work claim
+ required/accepted support activity claims
+ required/accepted Buffer protection claims
        ↓
Allocation Alternative
        ↓
Proposal Option
        ↓
ProposalDecision snapshot
        ↓
Accepted Allocation
```

All layers must retain exact lineage.

---

## 4. Governing Evidence

Before changing code, inspect:

* Task 8.4 RESULT;
* Commitment Composition specification;
* Task 8.5 RESULT;
* Capacity specification;
* Task 9.1 RESULT;
* Task 9.2 RESULT;
* Goal Demand / Allocation specification;
* Constructive Proposal specification;
* current `allocation.ts`;
* current `proposal.ts`;
* Task 8.4 composition footprint types;
* Capacity occupied/protected integration;
* Feasibility opportunity-set model;
* Proposal option/accepted-allocation persistence;
* Backup V10;
* schema 10;
* proposal authority validators;
* current bundle architecture.

Pay particular attention to the user-reported blockers:

* `allocation.ts` claim/session structures;
* `proposal.ts` option footprint;
* `proposal.ts` Accepted Allocation snapshot;
* composition footprint and Buffer provenance.

Do not begin schedule-type changes in this task.

---

## 5. Starting Baseline

Task 9.2 completed with:

* Constructive Proposal V1;
* ProposalDecision;
* immutable Accepted Allocation;
* current acceptance revalidation;
* exact Capacity-claim conflict protection;
* one-off scope;
* schema 10;
* Backup V10;
* no schedule realization.

Recorded Task 9.2 baseline:

* **114 test files**
* **1,051 tests**
* **0 failures**
* initial raw: **647,952 bytes**
* initial gzip: **165,487 bytes**
* largest lazy: **53,187 bytes**
* total: **895,026 bytes**

Task 9.2 currently preserves a productive-only footprint and must be upgraded without invalidating existing accepted authority semantics.

---

## 6. Normative Resource-Footprint Model

Introduce or formalize a complete resource-footprint model with at least three role classes:

```text id="wzekh1"
productive
supportActivity
bufferProtection
```

Equivalent exact names are acceptable.

Semantics:

### Productive

* real Goal-serving work;
* may satisfy Goal Demand;
* consumes Capacity;
* future execution-capable.

### Support Activity

* real operational activity required or explicitly accepted to enable productive work;
* consumes Capacity;
* does not itself satisfy Goal Demand;
* future execution-capable.

### Buffer Protection

* protected non-activity time;
* reduces/protects Capacity;
* never satisfies Goal Demand;
* not execution-capable.

Do not flatten these roles into one generic minute count.

---

## 7. Productive Claim Source

Productive claims originate from Task 9.1 Allocation-selected legal Feasibility opportunities.

Preserve:

* exact Capacity interval ID;
* exact start/end;
* exact duration;
* user-day;
* Demand Projection;
* Goal;
* Opportunity/Opportunity Set;
* Allocation Alternative;
* session partition identity.

Task 9.2.1 must not alter productive placement geometry.

---

## 8. Support Footprint Source

Support truth must come from existing architecture.

Do not infer support from:

* Goal title;
* activity category;
* arbitrary before/after padding;
* Proposal text;
* new Proposal heuristics.

Use existing Task 8.4 composition/resource-footprint semantics where applicable.

If an accepted productive claim requires support that is already represented by:

* Attachment Relationship;
* composite component;
* source-local support;
* another explicit support contract,

preserve that exact component lineage.

---

## 9. Buffer Footprint Source

Buffer truth must come from explicit existing Buffer authority.

Do not invent generic Buffer around Goal work.

Where Buffer applies, preserve:

* exact interval;
* before/after or relation role;
* originating relationship/source;
* effective Buffer rule;
* user-day;
* accepted component lineage.

Buffer remains non-activity.

---

## 10. Architecture Discovery Requirement

Before implementation, determine how support/Buffer requirements attach to Goal Demand satisfaction today.

Classify the repository evidence:

### A. Existing exact composition footprint is already available to Goal planning

If yes, reuse it directly.

### B. Existing composition semantics exist but are not exposed through a public planning contract

If yes, add the narrowest public read-model seam.

### C. No architecture currently connects Goal Demand to support/Buffer footprint

If so, stop and report a deeper architecture issue.

Do not invent that relationship inside Allocation.

---

## 11. No Composition Re-derivation in Allocation

Allocation must not rerun Task 8.4 pairing/composition algorithms.

Allocation may consume a normalized resource-footprint contract produced upstream.

Preserve separation:

```text id="u9f1k4"
Composition determines required support/protection semantics
Allocation determines scarce-resource assignment
```

Do not combine these engines.

---

## 12. Resource Claim V1

Introduce a typed resource-claim model suitable for propagation.

Each resource claim should include at minimum:

* stable semantic claim ID;
* role;
* exact start;
* exact end;
* duration;
* canonical user-day;
* Capacity interval/ref where applicable;
* productive Demand/Goal ref where applicable;
* source component ref;
* requiredness;
* accepted/selected state where relevant;
* provenance;
* dependency fingerprint.

Exact field design is implementation-specific.

---

## 13. Resource Claim Identity

Identity must be deterministic.

Use semantic inputs such as:

* parent productive session;
* exact bounds;
* role;
* source component;
* relationship/revision;
* Capacity identity;
* policy/version.

Do not use:

* array position;
* display order;
* random runtime ID;
* Proposal option order.

Equivalent semantics must reproduce equivalent claim identity.

---

## 14. Resource Footprint V1

A complete resource footprint should expose:

```text id="i1fkkw"
productiveClaims[]
supportClaims[]
bufferClaims[]
```

plus summaries:

* productive minutes;
* support minutes;
* Buffer minutes;
* total resource minutes.

Total resource cost must account for temporal union where appropriate.

Do not double-count overlapping claims.

---

## 15. Total Resource Cost

Distinguish:

```text id="2ecfb9"
productive minutes
support minutes
buffer minutes
nominal sum
unioned resource cost
```

where overlaps can occur.

Do not report misleading total cost by simply summing overlapping intervals twice.

Document V1 summary semantics.

---

## 16. Requiredness

Each support/protection component must preserve requiredness.

At minimum distinguish:

* required;
* optional accepted/selected;
* optional omitted.

Required components must never disappear downstream.

Optional omitted components must never reappear during Proposal or acceptance.

---

## 17. Productive Demand Attribution

Only productive claims may count toward:

* assigned Demand minutes;
* Proposal productive duration;
* accepted Demand satisfaction.

Support and Buffer must not inflate Demand satisfaction.

Add regression coverage.

---

## 18. Capacity Cost Attribution

All accepted resource claims may consume/protect Capacity according to their role.

Preserve:

```text id="f0n044"
productive → occupied
supportActivity → occupied
bufferProtection → protected
```

This is future realization semantics.

Task 9.2.1 must encode the meaning without yet installing schedule facts.

---

## 19. Allocation Input Extension

Task 9.1 Allocation currently consumes legal productive Feasibility opportunities.

Extend its input contract only as much as necessary to associate each selected productive assignment with its complete candidate resource footprint.

Possible pattern:

```text id="7sn317"
Feasible productive opportunity
+ resource footprint metadata
→ allocatable option
```

Do not let Allocation search invent support placement.

---

## 20. Allocation Alternative Extension

Every Allocation Alternative must carry complete resource claims for each assigned Demand.

At minimum preserve:

* productive session partitions;
* support claims;
* Buffer claims;
* exact lineage;
* role;
* requiredness;
* total resource cost.

---

## 21. Competition Semantics

Re-evaluate competition using the complete resource footprint where necessary.

This is a critical architecture question.

If two otherwise distinct productive opportunities have support or Buffer claims that overlap the same Capacity, they may compete even if their productive intervals do not overlap.

Task 9.2.1 must determine whether current Task 9.1 competition is therefore incomplete.

If yes:

* extend competition/resource-overlap evaluation to use complete resource claims;
* preserve exact overlap semantics.

Do not preserve a knowingly false competition graph.

---

## 22. Allocation Conservation

Capacity conservation must apply to the **complete resource footprint**, not only productive slices.

Within one Allocation alternative, overlapping exclusive claims are forbidden across:

* productive vs productive;
* productive vs support;
* productive vs Buffer where Buffer protects exclusive Capacity;
* support vs support;
* support vs Buffer;
* Buffer vs Buffer where semantic union requires exclusivity.

Use half-open interval semantics.

---

## 23. Buffer Overlap Semantics

Do not assume all Buffer overlap means invalidity.

Inspect existing Capacity/Composition semantics.

Where Buffer intervals may union safely for the same protected span, preserve provenance and avoid double cost.

Where a Buffer protects Capacity from another activity, treat incompatible resource use as conflict.

Document exact rule.

---

## 24. Support Claim Legality

Support activity claims must themselves be legal within the resource footprint.

Do not preserve a productive Feasibility opportunity if required support cannot fit.

If Task 8.5 single-Demand Feasibility currently ignores support footprint, determine whether feasibility itself needs a narrow repair.

If yes, repair only the public Goal-Specific Feasibility contract required to expose complete resource feasibility.

Do not proceed with an Allocation that assigns productive work while required support is impossible.

---

## 25. Feasibility Reopen Check

Explicitly assess:

> Does Goal-Specific Feasibility currently answer whether the **complete resource footprint** fits, or only productive Goal minutes?

If only productive minutes:

Task 9.2.1 may need a bounded sub-repair to Feasibility.

Acceptable repair:

```text id="u07au8"
Demand productive requirement
+ required support/protection footprint
→ complete legal Feasible Opportunity
```

Do not rewrite the entire Capacity architecture.

Document whether Feasibility changed.

---

## 26. Demand-Neutral Capacity Preservation

Do not make Capacity Goal-specific.

Capacity remains:

* demand-neutral;
* general resource truth.

Complete-footprint legality belongs downstream.

Do not inject Goal support rules into Capacity derivation.

---

## 27. Goal-Specific Feasibility Preservation

Feasibility may consume normalized support/protection requirements associated with the Demand candidate.

It must still evaluate only one Demand at a time.

Do not add cross-Goal competition here.

---

## 28. Feasible Opportunity Extension

If required by the footprint repair, extend Feasible Opportunity to retain:

* productive claim;
* required support claims;
* Buffer protection claims;
* complete resource cost;
* component provenance.

A Feasible Opportunity remains derived and non-reserving.

---

## 29. Opportunity Set Extension

Each Opportunity Set should represent one complete legal resource-footprint partition.

It must not say:

> productive work fits

while required support does not.

---

## 30. Allocation Ranking

Do not silently change Task 9.1 Goal Priority policy.

However, if complete footprint changes legal alternatives or total resource consumption, ranking may naturally change because the input alternatives changed.

Document this distinction.

---

## 31. Allocation Identity

Allocation identities/fingerprints must include the complete footprint.

Changing:

* support geometry;
* Buffer geometry;
* component requiredness;
* source relationship revision

must change Allocation identity/freshness where material.

---

## 32. Allocation Explanation

Allocation explanation must expose resource cost separately.

At minimum:

* productive assigned minutes;
* support overhead;
* Buffer protection;
* unioned total Capacity cost.

This enables Proposal to truthfully explain tradeoffs.

---

## 33. Proposal Option Extension

Remove the current zero-support/zero-Buffer assumption.

Every Proposal Option must snapshot the exact complete Allocation footprint.

At minimum:

* productive claims;
* support claims;
* Buffer claims;
* requiredness;
* component lineage;
* total resource cost;
* Demand satisfaction minutes.

---

## 34. Proposal Must Not Recompute Footprint

Proposal consumes Allocation footprint.

It must not:

* rerun Composition;
* invent Buffer;
* infer support;
* alter claim geometry.

Proposal is a recommendation snapshot.

---

## 35. Proposal Ranking Preservation

Proposal continues to preserve upstream Allocation ranking.

Complete footprint may appear in explanation/tradeoffs.

Proposal must not invent a new cost penalty unless already present in Allocation policy.

---

## 36. Proposal Explanation

Replace any hard-coded:

```text id="d4ipnm"
support = 0
buffer = 0
```

assumption.

Expose exact:

* productive effort;
* support effort;
* Buffer protection;
* total resource footprint.

---

## 37. Proposal Qualification

If support/Buffer evidence is unknown or incomplete:

* do not present an acceptance-safe fullyQualified option.

Use existing qualification / No-Proposal semantics.

Decisive footprint uncertainty must fail closed.

---

## 38. ProposalDecision Snapshot

ProposalDecision must retain or reference the exact option/resource footprint decided upon.

The decision record itself need not duplicate every field if Accepted Allocation and Proposal revision provide exact immutable linkage.

But history must remain interpretable after disposable Allocation reads vanish.

---

## 39. Accepted Allocation Extension

Accepted Allocation must freeze the complete authorized resource footprint.

At minimum:

* productive claims;
* support claims;
* Buffer claims;
* exact role;
* exact interval;
* exact user-day;
* component provenance;
* requiredness;
* Demand/Goal lineage;
* total productive/support/Buffer summaries.

This is the central completion requirement.

---

## 40. Accepted Allocation Authority Meaning

After Task 9.2.1, Accepted Allocation semantically means:

> The user authorized this entire exact resource footprint.

Not merely:

> The user authorized these productive minutes.

---

## 41. Accepted Allocation Immutability

Existing Task 9.2 immutability remains.

Do not mutate accepted records in place when footprint semantics change.

For **new** acceptances, create complete footprint records.

For **existing legacy Task 9.2 Accepted Allocations** created before Task 9.2.1, define explicit compatibility semantics.

---

## 42. Legacy Accepted Allocation Migration

This is critical.

Existing Task 9.2 Accepted Allocations may contain only productive claims.

Do **not** infer missing historical support/Buffer footprint.

Represent them explicitly as something equivalent to:

* legacyProductiveOnly;
* footprintIncomplete;
* unrealizableWithoutRevalidation.

Exact design is implementation-specific.

They must not silently become complete authority.

---

## 43. Legacy Acceptance Revalidation

If a pre-9.2.1 Accepted Allocation is still unrealized, determine whether it can safely be upgraded only through explicit current revalidation.

Possible safe behavior:

1. retain immutable legacy record;
2. derive a new complete candidate footprint;
3. require an explicit successor acceptance if the resource scope materially changes.

Do not expand old user authority automatically.

If no such legacy records exist in repository/test state, still design the migration semantics.

---

## 44. No Silent Authority Expansion

Adding support/Buffer footprint after acceptance can widen what the user authorized.

Therefore:

```text id="14hoid"
legacy productive-only acceptance
+ newly discovered support/Buffer
≠ automatically authorized complete footprint
```

This invariant is mandatory.

---

## 45. New Acceptance Path

All new Proposal acceptance after Task 9.2.1 must:

* revalidate complete footprint;
* display/snapshot complete footprint;
* conflict-check complete footprint;
* persist complete Accepted Allocation.

---

## 46. Accepted Claim Conflict Prevention

Task 9.2 currently prevents exact accepted productive-claim overlap.

Extend conflict prevention to the complete exclusive resource footprint.

Two Accepted Allocations must not conflict through hidden support/Buffer claims.

---

## 47. Atomic Bundle Semantics

If productive work requires support/Buffer:

* accepted bundle contains the complete footprint.

Required components are part of atomic authority.

Do not accept productive component separately if the support/protection is mandatory.

---

## 48. Partial Acceptance

If an independent Proposal Option allows partial acceptance:

* complete resource footprint for the accepted subset must remain legal;
* required support for accepted productive claims must remain included.

Do not proportionally trim Buffer/support unless the underlying component semantics explicitly allow it.

---

## 49. Modification Candidate

Modification candidates must validate complete footprint.

Changing productive geometry may require corresponding support/Buffer geometry changes.

Do not preserve stale support claims after a modified productive interval.

Recompute through the accepted normalized footprint contract, then require explicit modify-and-accept.

---

## 50. Proposal Revalidation

Task 9.2 full revalidation must now compare complete footprint semantics.

A Proposal becomes non-current if:

* productive claim changes;
* required support changes;
* Buffer changes;
* requiredness changes;
* source component revision changes.

---

## 51. Freshness

Material footprint dependencies must participate in:

* Feasibility fingerprint where applicable;
* Allocation fingerprint;
* Proposal fingerprint;
* Accepted-option revalidation.

Do not treat support/Buffer changes as cosmetic.

---

## 52. Provenance

Preserve exact resource lineage.

Each accepted claim should be able to answer:

* Why does this resource claim exist?
* Which productive Demand/session does it support?
* Which source/relationship/component created it?
* Is it productive/support/Buffer?
* Is it required?
* Which Proposal option exposed it?
* Which Accepted Allocation authorized it?

---

## 53. Component Lineage

Where Task 8.4 supplies composition identity, retain:

* Attachment Relationship ID/revision;
* child/support source;
* paired occurrence/component identity;
* Buffer origin;
* relevant composite footprint identity.

Do not replace precise composition identity with generic strings.

---

## 54. One Productive Claim / Multiple Components

Support one productive session having:

* multiple support activities;
* multiple Buffer intervals;
* mixed required/optional components.

Do not assume exactly one prep + one Buffer.

---

## 55. Shared Support Components

If architecture permits one support component to serve multiple productive claims, do not duplicate resource cost blindly.

Inspect existing Composition rules.

Preserve shared component identity and union semantics.

If unsupported today, state that V1 requires one-owner component footprint.

Do not invent sharing semantics.

---

## 56. Cross-User-Day Footprint

Support/Buffer claims may fall on a different canonical user-day than productive work.

Preserve each claim's exact user-day ownership.

Do not force all footprint components onto the productive session's user-day.

---

## 57. Half-Open Intervals

All resource claim geometry uses:

```text id="9vj4i0"
[start, end)
```

Touching intervals do not overlap.

Retain existing Capacity/Composition arithmetic.

---

## 58. Zero-Duration Protection

Reject zero/negative-duration resource claims.

Do not silently normalize malformed historical inputs.

---

## 59. Persistence Model

Task 9.2 already stores Proposal/Accepted Allocation authority.

Expected:

* extend existing `proposalAuthority` records;
* no new sibling authority store required solely for footprint fields.

Do not create realization persistence.

---

## 60. Database Schema

Task 9.2 baseline is schema 10.

Because Accepted Allocation record semantics materially expand, determine whether current schema/versioning conventions require a schema bump.

Preferred if encoded record shape/version changes durably:

```text id="1xtclb"
schema 11
```

However, if the store already uses versioned tagged records that can safely add a new record version under schema 10 without structural IndexedDB changes, document why schema 10 remains valid.

Do not conflate DB object-store version with domain record version.

---

## 61. Proposal Authority Record Version

Version durable Proposal/Accepted Allocation records explicitly if needed.

Historical productive-only records must remain distinguishable from complete-footprint records.

Do not reinterpret old bytes under new semantics.

---

## 62. Backup Version

Task 9.2 baseline is Backup V10.

If new durable footprint fields are necessary to preserve acceptance authority exactly, advance backup version.

Expected:

```text id="ffsf2r"
Backup V11
```

unless repository backup versioning convention safely carries record-versioned additive fields in V10.

Default expectation: advance backup.

---

## 63. Backup Migration

Older backups must:

* preserve legacy productive-only Accepted Allocations exactly;
* mark them incomplete/legacy;
* infer no support/Buffer authority.

New backups must preserve complete footprints exactly.

---

## 64. Lossy Downgrade

Downgrade to an older backup version must refuse if it would discard:

* support claims;
* Buffer claims;
* role;
* component lineage;
* requiredness.

Do not silently export a complete acceptance as productive-only authority.

---

## 65. Restore Validation

Validate complete footprint records:

* claim roles;
* exact bounds;
* user-day;
* requiredness;
* claim IDs;
* component refs;
* Proposal option match;
* accepted scope containment;
* summary totals;
* duplicate/conflicting claim semantics.

Malformed complete authority fails protected.

---

## 66. Referential Integrity

Accepted claims must resolve internally to:

* Accepted Allocation;
* ProposalDecision;
* Proposal revision;
* option;
* Goal/Demand;
* resource component provenance where required.

Historical external source deletion must not make the immutable record uninterpretable.

Freeze decisive component evidence where necessary.

---

## 67. Proposal History Compatibility

Existing Proposal revisions remain immutable.

Do not rewrite old Proposal options with newly discovered footprint.

New successor Proposal revisions use the complete model.

---

## 68. Allocation Disposal Compatibility

Allocation remains disposable.

Proposal/Accepted Allocation must snapshot sufficient resource footprint so acceptance history does not depend on recomputing old Allocation.

---

## 69. No Schedule Changes

Task 9.2.1 must not create:

* Scheduled Goal Work;
* scheduled support;
* realized Buffer;
* Preview occurrence;
* execution subject;
* published schedule change.

The realization architecture remains blocked until Task 9.2.2 and 9.3.

---

## 70. Scheduled Block Types

Do not modify ScheduledBlock origin/role architecture in this task unless a compile-time seam is strictly necessary.

The accepted downstream identity work belongs to Task 9.2.2.

If a minimal future-facing type import is required, keep it non-behavioral.

---

## 71. Execution Boundary

Do not modify execution subject semantics.

No new execution-capable subject exists yet.

---

## 72. Publication Boundary

Do not modify HistoricalPlan/publication origin semantics.

That belongs to Task 9.2.2.

---

## 73. Capacity Behavior

Capacity derivation itself remains unchanged.

If Feasibility/Allocation now accounts for complete candidate footprint, Capacity still exposes the same demand-neutral interval truth.

Add regression proving no Goal Demand changes general Capacity.

---

## 74. Feasibility Behavior

If Feasibility must be repaired:

* preserve one-Demand evaluation;
* preserve no Priority;
* preserve no competition;
* preserve no reservation.

The only new responsibility should be complete-footprint legality.

---

## 75. Competition Behavior

If support/Buffer claims create new overlap:

* competition topology must include it.

Add regression:

```text id="eueb35"
Goal A productive claim disjoint from Goal B productive claim
but A required Buffer/support overlaps B resource claim
→ demands compete
```

if supported by architecture.

---

## 76. Allocation Conservation Tests

Add pairwise overlap tests across all role combinations.

At minimum:

* productive/productive;
* productive/support;
* support/support;
* productive/Buffer;
* support/Buffer;
* Buffer/Buffer.

Verify exact policy where Buffer overlap unions instead of conflicts.

---

## 77. Proposal Footprint Tests

Prove:

* support no longer hard-coded zero;
* Buffer no longer hard-coded zero;
* productive/support/Buffer summaries exact;
* option fingerprint changes when footprint changes;
* option explanation exposes complete cost;
* Proposal does not recompute footprint.

---

## 78. Accepted Allocation Tests

Prove:

* complete footprint frozen;
* role retained;
* component lineage retained;
* requiredness retained;
* user-day retained;
* summaries exact;
* accepted history survives restart.

---

## 79. Legacy Accepted Allocation Tests

Prove:

* old productive-only record remains readable;
* old record is explicitly incomplete/legacy;
* support/Buffer is not inferred;
* legacy record cannot be silently realized as complete authority;
* upgrade requires safe explicit pathway if supported.

---

## 80. Acceptance Conflict Tests

Prove hidden resource footprint can block acceptance.

Example:

```text id="91kzcq"
Proposal A productive interval does not overlap Proposal B productive interval
A required support overlaps B accepted productive claim
→ second acceptance rejected
```

where architecture supports the support relationship.

---

## 81. Partial Acceptance Tests

Prove:

* independent subset preserves complete required footprint;
* required support cannot be omitted;
* atomic bundle remains atomic;
* modified claim produces updated footprint before acceptance.

---

## 82. Revalidation Tests

Change:

* support relationship revision;
* Buffer amount;
* component requiredness;
* support duration;
* support geometry.

Then prove stale/current Proposal behavior is correct.

---

## 83. Determinism Tests

Equivalent semantic inputs in different:

* relation order;
* claim order;
* opportunity order;
* Allocation order;
* Proposal option order

must produce equivalent:

* resource claim IDs;
* footprints;
* Allocation;
* Proposal;
* Accepted Allocation.

---

## 84. No Double-Counting Tests

Prove:

* same support component appears once;
* same Buffer contribution unions correctly;
* productive claim plus composite footprint is not counted twice;
* overlapping Buffer/resource cost summaries are correct.

---

## 85. Demand Satisfaction Tests

Prove:

```text id="3lcjer"
productive minutes = Demand satisfaction
support minutes ≠ Demand satisfaction
Buffer minutes ≠ Demand satisfaction
```

---

## 86. Full Regression Preservation

Keep green:

* Task 8.4 Composition;
* Capacity;
* Goal-Specific Feasibility;
* Competition;
* Allocation;
* Proposal;
* ProposalDecision;
* Accepted Allocation;
* scheduling;
* Preview;
* Friction;
* publication;
* execution;
* Progress;
* persistence;
* backup/restore;
* DF-006.

No Task 9.2.1 behavior may schedule work.

---

## 87. Bundle Architecture Review

Starting Task 9.2 baseline:

* raw **647,952**
* gzip **165,487**
* largest lazy **53,187**
* total **895,026**

Requirements:

1. keep footprint propagation in existing lazy planning chunks where practical;
2. avoid eager UI;
3. avoid duplicate composition engines;
4. reuse existing interval/provenance helpers;
5. record before/after bundle deltas;
6. pass hard limits.

Total-size architecture-review warning remains active.

---

## 88. UI Boundary

No broad UI work.

If existing Proposal diagnostics/tests expose option footprint, typed data may become available.

Do not build the final Proposal workspace here.

---

## 89. Accessibility

Expected:

> No new interactive accessibility surface introduced.

If existing backup/UI diagnostic copy changes, preserve current accessible behavior.

---

## 90. Governance

Update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`.

Also add a bounded architecture-reopen resolution note describing:

* Task 9.3 blocker;
* accepted-footprint incompleteness;
* Task 9.2.1 repair;
* remaining Task 9.2.2 schedule-identity blocker.

Update `DECISIONS.md` only if a genuinely new durable decision was required.

Do not rewrite accepted specs.

---

## 91. Architecture Reopen Status

Task 9.2.1 begins under:

> **Architecture Reopen: Yes — bounded contract repair**

At completion assess:

### Resolved by 9.2.1

* accepted complete resource-footprint propagation.

### Still open

* downstream realization-capable scheduled/execution/publication identity.

Expected final state:

> **Architecture reopen partially resolved; Task 9.3 remains blocked pending Task 9.2.2.**

Do not declare Task 9.3 unblocked prematurely.

---

## 92. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve all Task 9.1/9.2 work exactly;
3. preserve unrelated user work;
4. do not clean;
5. do not commit;
6. do not push unless explicitly instructed.

Report repository state.

---

## 93. Validation Commands

Run repository-supported equivalents of:

```bash id="veua13"
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
git diff --check
```

Also run focused suites for:

* resource footprint;
* composition propagation;
* Feasibility if changed;
* competition;
* Allocation;
* Proposal;
* acceptance;
* legacy accepted authority;
* persistence;
* backup;
* restore;
* determinism;
* no schedule mutation.

---

## 94. Required Result Artifact

Create a durable Phase 9 RESULT artifact.

Filename must contain **`RESULT`**.

Preferred filename:

```text id="6zd8d5"
TASK_9.2.1_ACCEPTED_RESOURCE_FOOTPRINT_PROPAGATION_V1_RESULT.md
```

Place it in the Phase 9 implementation-results folder.

The RESULT must include at minimum:

1. Executive Result
2. Architecture-Reopen Finding
3. Scope Delivered
4. Governing Evidence
5. Starting Baseline
6. Resource-Footprint Definition
7. Productive Role
8. Support Role
9. Buffer Role
10. Architecture Discovery Classification
11. Composition Source Contract
12. Buffer Source Contract
13. Resource Claim Model
14. Resource Claim Identity
15. Resource Footprint Model
16. Resource Cost Summaries
17. Requiredness
18. Productive Demand Attribution
19. Capacity Cost Attribution
20. Allocation Input Changes
21. Allocation Alternative Changes
22. Competition Impact
23. Allocation Conservation
24. Buffer Overlap Semantics
25. Support Legality
26. Feasibility Reopen Assessment
27. Feasibility Changes if Any
28. Opportunity Model Changes
29. Opportunity Set Changes
30. Allocation Ranking Impact
31. Allocation Identity/Freshness
32. Allocation Explanation
33. Proposal Option Changes
34. Removal of Zero-Support Assumption
35. Proposal Explanation
36. Proposal Qualification
37. ProposalDecision Snapshot
38. Accepted Allocation Changes
39. Accepted Authority Meaning
40. Accepted Allocation Identity
41. Legacy Accepted Allocation Handling
42. Legacy Upgrade/Revalidation
43. No Silent Authority Expansion
44. New Acceptance Path
45. Accepted Claim Conflict Handling
46. Atomic Bundle Semantics
47. Partial Acceptance
48. Modification Candidate Handling
49. Proposal Revalidation
50. Freshness
51. Provenance
52. Component Lineage
53. Multi-Component Support
54. Shared Component Disposition
55. Cross-User-Day Footprint
56. Interval Semantics
57. Persistence Model
58. Schema Decision
59. Record Versioning
60. Backup Decision
61. Backup Migration
62. Downgrade Protection
63. Restore Validation
64. Referential Integrity
65. Proposal History Compatibility
66. Allocation Disposal Compatibility
67. Schedule Boundary
68. Execution Boundary
69. Publication Boundary
70. Capacity Preservation
71. Feasibility Preservation
72. Competition Preservation
73. Tests Added
74. Conservation Tests
75. Proposal Tests
76. Accepted Allocation Tests
77. Legacy Authority Tests
78. Acceptance Conflict Tests
79. Partial Acceptance Tests
80. Revalidation Tests
81. Determinism Tests
82. Double-Counting Tests
83. Demand Satisfaction Tests
84. Full Regression Result
85. Validation Commands
86. Bundle Architecture Review
87. Performance Notes
88. Accessibility Notes
89. Compatibility Notes
90. DF-006 Relationship
91. V1 Design Decision Table
92. Boundary Matrix
93. Resource Propagation Matrix
94. Invariant Verification
95. Implementation Decisions
96. Deviations
97. Architecture Reopen Assessment
98. Governance Updates
99. Repository Status
100. Completion Assessment
101. Remaining Task 9.2.2 Blocker
102. Recommended Next Task
103. Completion Statement

---

## 95. Required V1 Design Decision Table

Include:

| Question                       | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ------------------------------ | ----------- | ------------------- | ------------------ | ------------------- |
| footprint source               |             |                     |                    |                     |
| productive claim model         |             |                     |                    |                     |
| support claim model            |             |                     |                    |                     |
| Buffer claim model             |             |                     |                    |                     |
| claim identity                 |             |                     |                    |                     |
| requiredness model             |             |                     |                    |                     |
| support composition seam       |             |                     |                    |                     |
| Feasibility footprint handling |             |                     |                    |                     |
| competition footprint handling |             |                     |                    |                     |
| Allocation footprint handling  |             |                     |                    |                     |
| resource cost union            |             |                     |                    |                     |
| Proposal snapshot              |             |                     |                    |                     |
| Accepted Allocation snapshot   |             |                     |                    |                     |
| legacy authority handling      |             |                     |                    |                     |
| accepted conflict checking     |             |                     |                    |                     |
| modification revalidation      |             |                     |                    |                     |
| schema version                 |             |                     |                    |                     |
| backup version                 |             |                     |                    |                     |
| UI exposure                    |             |                     |                    |                     |

---

## 96. Required Boundary Matrix

Verify:

| Concept                   | Status after 9.2.1   | Role                                    | Owns Time Now?        | Future Realization Role    |
| ------------------------- | -------------------- | --------------------------------------- | --------------------- | -------------------------- |
| Productive Resource Claim | Extended             | Demand-serving                          | No                    | Scheduled Goal Work        |
| Support Resource Claim    | New/extended         | Operational overhead                    | No                    | Scheduled Support Activity |
| Buffer Resource Claim     | New/extended         | Protection                              | No                    | Realized Buffer            |
| Feasible Opportunity      | Extended if required | Complete candidate fit                  | No                    | Input only                 |
| Allocation                | Extended             | Complete provisional resource reasoning | No                    | Proposal input             |
| Proposal Option           | Extended             | Complete proposed footprint             | No                    | Decision input             |
| ProposalDecision          | Extended provenance  | User decision evidence                  | No                    | Authority lineage          |
| Accepted Allocation       | Extended             | Complete accepted footprint             | No scheduled time yet | Realization input          |
| Scheduled Goal Work       | Future               | Scheduled productive                    | Not in 9.2.1          | Task 9.3                   |
| Scheduled Support         | Future               | Scheduled support                       | Not in 9.2.1          | Task 9.3                   |
| Realized Buffer           | Future               | Protected schedule                      | Not in 9.2.1          | Task 9.3                   |

---

## 97. Required Resource Propagation Matrix

Verify exact propagation:

| Resource Field       |   Feasibility | Allocation | Proposal | ProposalDecision / Snapshot | Accepted Allocation |
| -------------------- | ------------: | ---------: | -------: | --------------------------: | ------------------: |
| role                 |     if needed |        Yes |      Yes |          exact ref/snapshot |                 Yes |
| start/end            |           Yes |        Yes |      Yes |          exact ref/snapshot |                 Yes |
| duration             |           Yes |        Yes |      Yes |          exact ref/snapshot |                 Yes |
| user-day             |           Yes |        Yes |      Yes |          exact ref/snapshot |                 Yes |
| Goal                 |    productive |        Yes |      Yes |                         Yes |                 Yes |
| Demand               |    productive |        Yes |      Yes |                         Yes |                 Yes |
| support component ID |     if needed |        Yes |      Yes |                         Yes |                 Yes |
| Buffer source ID     |     if needed |        Yes |      Yes |                         Yes |                 Yes |
| requiredness         | if applicable |        Yes |      Yes |                         Yes |                 Yes |
| Capacity ref         |           Yes |        Yes |      Yes |                         Yes |                 Yes |
| provenance           |           Yes |        Yes |      Yes |                         Yes |                 Yes |
| fingerprint          |           Yes |        Yes |      Yes |                         Yes |                 Yes |

Where a layer legitimately does not need a field, document why.

---

## 98. Required Invariant Verification

Explicitly verify:

1. Productive, support, and Buffer roles remain distinct.
2. Only productive minutes satisfy Demand.
3. Support consumes resource but does not satisfy Demand.
4. Buffer protects resource and does not satisfy Demand.
5. Buffer is not activity.
6. Allocation does not derive Composition.
7. Proposal does not derive Composition.
8. Accepted Allocation contains the full authorized footprint.
9. required support cannot disappear downstream.
10. omitted optional support cannot reappear downstream.
11. required Buffer cannot disappear downstream.
12. resource claim identities are deterministic.
13. complete footprint participates in Allocation identity.
14. complete footprint participates in Proposal revalidation.
15. complete footprint participates in acceptance conflict checking.
16. hidden support conflict cannot create double acceptance.
17. hidden Buffer conflict cannot create double acceptance.
18. complete resource claims use exact half-open intervals.
19. Capacity remains demand-neutral.
20. Feasibility remains one-Demand truth.
21. Competition remains derived.
22. Allocation remains provisional.
23. Proposal remains non-authoritative.
24. Accepted Allocation remains immutable authority.
25. legacy productive-only acceptance is not silently widened.
26. no resource footprint is scheduled in Task 9.2.1.
27. no execution subjects are added.
28. no publication origin types are added.
29. no Progress semantics change.
30. equivalent semantic inputs yield equivalent footprints.

---

## 99. Completion Criteria

Task 9.2.1 is complete only when:

1. complete resource-footprint model exists;
2. productive role exists;
3. support role exists;
4. Buffer role exists;
5. exact role identity propagates;
6. support source lineage propagates;
7. Buffer source lineage propagates;
8. requiredness propagates;
9. Feasibility completeness is assessed;
10. Feasibility is repaired if required;
11. Allocation alternatives carry complete footprints;
12. competition accounts for complete footprint where necessary;
13. Allocation conservation covers complete footprint;
14. Proposal no longer hard-codes support zero;
15. Proposal no longer hard-codes Buffer zero;
16. Proposal options carry complete footprint;
17. Proposal explanations expose complete cost;
18. Proposal revalidation includes footprint;
19. ProposalDecision retains exact decided footprint linkage;
20. Accepted Allocation freezes complete footprint;
21. accepted conflict checks include complete footprint;
22. partial acceptance preserves required footprint;
23. modification revalidates footprint;
24. legacy accepted records remain distinguishable;
25. legacy records gain no inferred authority;
26. persistent record versioning is safe;
27. backup versioning is safe;
28. downgrade is protected;
29. restore validates footprint;
30. no schedule realization exists;
31. no ScheduledBlock identity change exists except necessary compile seam;
32. no execution model change exists;
33. no publication model change exists;
34. focused tests pass;
35. full regression passes;
36. Prettier passes;
37. typecheck passes;
38. lint passes;
39. build passes;
40. bundle hard policy passes;
41. `git diff --check` passes;
42. governance updated;
43. RESULT exists;
44. Task 9.3 remains blocked only by the Task 9.2.2 schedule-identity foundation.

---

## 100. Stop / Reopen Conditions

Stop and report if:

* no existing architecture can associate Goal Demand with support/Buffer footprint;
* complete-footprint Feasibility requires redefining Capacity;
* Allocation would need to rerun Composition;
* support geometry cannot be deterministically derived before Proposal;
* accepted resource scope cannot be represented without mutating historical Task 9.2 acceptance;
* legacy accepted authority cannot be safely distinguished;
* complete-footprint competition requires new user-value policy;
* Buffer semantics cannot be reconciled with Capacity union rules;
* persistence would silently reinterpret old accepted records;
* Task 8.4 architecture must be materially changed.

Do not solve these by:

* hard-coding support;
* assuming Buffer zero;
* adding generic padding;
* inferring support from Goal category;
* expanding legacy acceptance automatically;
* pushing footprint derivation into Task 9.3.

---

## 101. Expected Next Task

If Task 9.2.1 completes:

> **Task 9.2.2 — Realized Schedule Identity Foundation V1**

Task 9.2.2 should extend:

* scheduled-block/source identity;
* productive/support/protection schedule classification;
* execution-subject identity;
* historical/publication origin and lineage;

without realizing Accepted Allocation yet.

Only after 9.2.2 succeeds should Task 9.3 resume.

---

## 102. Architecture-Reopen Completion Statement

The RESULT must explicitly state:

> **Task 9.2.1 resolves the accepted-resource-footprint portion of the Task 9.3 architecture reopen. Task 9.3 remains intentionally blocked pending Task 9.2.2, which must establish realization-capable scheduled, execution, and publication identity contracts.**

Do not state that realization is ready until 9.2.2 passes.

---

## 103. Final Completion Statement

The Task 9.2.1 RESULT must end with a completion statement materially equivalent to:

> **Task 9.2.1 — Accepted Resource Footprint Propagation V1 complete.**
>
> DayFrame now carries the complete resource cost of Goal planning through the accepted-authority chain rather than preserving productive Capacity claims alone: productive Goal-work claims, real support-activity claims, and Buffer-protection claims remain distinct, deterministic, half-open, canonically user-day-owned resource facts with exact requiredness, component/source lineage, Capacity provenance, and stable semantic identity; existing Composition authority remains the source of support and protection semantics and is not re-derived inside Allocation or Proposal, while Goal-Specific Feasibility and Competing Demand are extended only where necessary so an opportunity cannot be considered fully legal or non-competing when its required support/protection footprint is infeasible or contends for the same resource; Allocation alternatives now conserve and explain the complete resource footprint, Proposal Options snapshot that exact footprint rather than hard-coding support and Buffer to zero, Proposal revalidation treats footprint changes as material, and all new acceptance paths conflict-check and freeze the exact productive/support/Buffer footprint the user actually authorized; only productive minutes contribute to Demand satisfaction, support remains Capacity-consuming operational overhead, Buffer remains non-activity protection, required components cannot disappear, omitted optional components cannot reappear, and overlapping resource claims are unioned or rejected according to existing Capacity/Composition semantics without double counting; legacy productive-only Accepted Allocations remain immutable and explicitly distinguishable and receive no inferred support or Buffer authority, preventing the footprint repair from silently widening historical user authorization; persistence, record versioning, backup, migration, downgrade protection, restore, referential integrity, determinism, and regression behavior preserve exact authority semantics; no Scheduled Goal Work, Scheduled Support Activity, realized Buffer, execution subject, publication origin, recurrence, Progress, or schedule mutation is introduced; the accepted-resource-footprint portion of the Task 9.3 architecture reopen is resolved; Task 9.3 remains blocked only by the separate Task 9.2.2 realization-capable scheduled/execution/publication identity foundation.
