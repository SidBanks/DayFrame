# Task 9.3 — Accepted Allocation Realization V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Task Type:** Implementation / Accepted Authority Realization / Durable Scheduled Reality / Atomic Persistence / Preview-Friction-Publication Integration / Regression
**Primary Responsibility:** Implement the deterministic, atomic, idempotent transition from one complete `AcceptedAllocationV2` into durable Scheduled Goal Work, Scheduled Support Activity, and Realized Buffer Protection using the exact resource footprint and downstream identity contracts already established by Tasks 9.2.0, 9.2.1, and 9.2.2, without re-planning, re-ranking, widening accepted scope, inventing recurrence, substituting resources, or conflating scheduled reality with execution or Progress.

---

## 1. Objective

Implement the missing authority-to-schedule transition:

```text
Proposal
→ ProposalDecision
→ AcceptedAllocationV2
→ Realization
→ Scheduled Reality
```

Task 9.3 must take one current, complete, applicable Accepted Allocation and atomically materialize its already-authorized footprint as:

```text
accepted productive claim
→ ScheduledGoalWorkV1

accepted support claim
→ ScheduledSupportActivityV1

accepted Buffer claim
→ RealizedBufferProtectionV1
```

At completion DayFrame must be able to answer:

> **This Accepted Allocation was explicitly authorized by the user; this immutable Realization record converted that exact complete accepted footprint into these exact productive, support, and Buffer schedule facts; those facts now own or protect these exact intervals; they retain complete lineage back through Accepted Allocation, ProposalDecision, Proposal, Allocation, Demand, Goal, Capacity, and footprint authority; Preview, Friction, Capacity, execution references, publication, and history can consume the realized truth; repeated realization cannot duplicate it; and if the accepted geometry can no longer be installed because later authoritative schedule truth conflicts with it, the accepted decision remains intact and DayFrame reports the incompatibility without silently changing the user's choice.**

---

## 2. Governing Completed Foundations

Task 9.3 must treat the following as settled architecture.

### Task 9.2.0

Defined the pre-scheduling Goal-Demand resource-footprint association contract.

Do not reopen:

* footprint ownership;
* footprint association;
* candidate-parent semantics;
* support/Buffer projection rules;
* productive-only versus unspecified semantics.

### Task 9.2.1

Implemented complete accepted-resource-footprint propagation.

`AcceptedAllocationV2` with `footprintCompleteness: complete` now freezes exact:

* productive claims;
* support claims;
* Buffer claims;
* exact `[start,end)` geometry;
* canonical user-day;
* requiredness;
* Capacity provenance;
* Goal/Demand/Projection lineage;
* Candidate Parent lineage;
* component/source lineage;
* Proposal/ProposalDecision lineage.

Do not recompute this footprint.

### Task 9.2.2

Implemented downstream realization-capable identities.

Use the established:

* `acceptedAllocation` schedule origin;
* `productiveGoalWork` role;
* `supportActivity` role;
* `bufferProtection` role;
* `ScheduledGoalWorkV1`;
* `ScheduledSupportActivityV1`;
* `RealizedBufferProtectionV1`;
* `RealizationId`;
* stable durable schedule/execution references;
* HistoricalPlan V3 accepted-allocation snapshot;
* Buffer execution prohibition;
* deterministic subject identities;
* `fixedAcceptedGeometry`;
* autonomous-movability prohibition.

Do not invent competing representations.

---

## 3. Explicit Non-Goals

Task 9.3 must not:

* redesign Goal Demand;
* redesign resource-footprint specifications;
* rerun Composition;
* recompute support/Buffer geometry;
* rerun Feasibility;
* rerun Competition;
* rerun Allocation;
* rerank alternatives;
* create a new Proposal;
* silently select another Proposal option;
* substitute another Goal;
* substitute another Capacity interval;
* move accepted geometry;
* search for alternative placement;
* create recurrence;
* create templates;
* create manual events;
* convert realized Goal work to Work;
* execute scheduled work;
* create execution records automatically;
* infer Progress;
* redesign Planner/Month/Review UI;
* implement Live adaptation;
* implement learning.

---

## 4. Canonical Transition

The transition implemented here is:

```text
AcceptedAllocationV2
        ↓
validate complete + current + applicable
        ↓
RealizationV1
        ↓
ScheduledGoalWorkV1[]
ScheduledSupportActivityV1[]
RealizedBufferProtectionV1[]
```

The accepted footprint is fixed.

Realization answers:

> **Did DayFrame successfully install exactly what was accepted?**

It does not answer:

> **What should DayFrame schedule instead?**

---

## 5. Authority Boundary

Preserve:

```text
Accepted Allocation
≠ Realization
≠ Scheduled Reality
≠ Execution
≠ Progress
```

### Accepted Allocation

Owns immutable accepted authority.

### Realization

Owns immutable evidence of the authority→schedule transition.

### Scheduled Goal Work / Support

Own actual scheduled activity time.

### Buffer Protection

Protects scheduled time.

### Execution

Records what actually happened.

### Progress

Records separate Goal outcome evidence.

Do not collapse these classes.

---

## 6. Accepted Allocation Eligibility

Only complete authority is realizable.

The safe input must require:

```text
AcceptedAllocationV2
footprintCompleteness = complete
```

Legacy productive-only Accepted Allocations must not enter ordinary realization.

Expected legacy result:

```text
inapplicable / requiresRevalidation
```

or equivalent structured state.

Do not infer missing support or Buffer.

---

## 7. Realization V1 Definition

Introduce a durable immutable record materially equivalent to:

```ts
RealizationV1 {
  id
  version
  policy
  acceptedAllocationId
  acceptedAllocationRevision
  proposalDecisionId
  proposalId
  proposalRevision
  optionId
  realizedAt
  origin
  result
  scheduledGoalWorkIds[]
  scheduledSupportActivityIds[]
  realizedBufferProtectionIds[]
  acceptedClaimIds[]
  dependencyFingerprint
  provenance
}
```

Exact field naming should follow repository conventions.

---

## 8. Realization Policy

Define a policy materially equivalent to:

```text
accepted-allocation-realization
version 1
```

The policy governs:

* eligibility;
* currentness;
* claim validation;
* conflict detection;
* atomicity;
* exact materialization;
* idempotence;
* duplicate prevention;
* result classification;
* provenance.

It does not govern:

* ranking;
* placement;
* recurrence;
* Goal Priority;
* resource-footprint derivation.

---

## 9. Realization Identity

`RealizationId` must be deterministic or otherwise safely stable according to the existing Task 9.2.2 identity contract.

Identity should derive from immutable semantic authority such as:

* Accepted Allocation ID/revision;
* realization policy/version.

The same successful accepted authority must resolve to one canonical successful realization.

Do not permit duplicate successful realizations for one Accepted Allocation.

---

## 10. One Accepted Allocation → One Canonical Successful Realization

Mandatory invariant:

```text
one AcceptedAllocationV2
→ at most one canonical successful Realization
```

Repeated calls must return:

* the existing realization;
* or an explicit `alreadyRealized` result.

They must not create duplicate schedule facts.

---

## 11. Realization Result Envelope

The command should return a structured result materially equivalent to:

```ts
{
  status
  realizationId?
  acceptedAllocationId
  scheduledGoalWorkIds[]
  scheduledSupportActivityIds[]
  bufferProtectionIds[]
  conflicts[]
  reasons[]
  provenance
  previewFreshnessImpact
}
```

Ordinary inability to realize due to current schedule conflict is not a generic exception.

---

## 12. Result Status Taxonomy

Define explicit statuses such as:

```text
realized
alreadyRealized
conflicted
inapplicable
invalid
requiresRevalidation
failed
```

Exact names may differ.

Do not collapse all ordinary outcomes into thrown errors.

---

## 13. Reason Codes

Define stable structured reason codes.

At minimum consider:

* `alreadyRealized`
* `acceptedAllocationIncomplete`
* `acceptedAllocationStale`
* `acceptedAllocationInvalid`
* `claimGeometryMismatch`
* `claimIdentityMismatch`
* `scheduleConflict`
* `requiredSupportMissing`
* `bufferProtectionConflict`
* `scopeMismatch`
* `unsupportedLegacyAuthority`
* `outsideScheduleCoverage`
* `realizationPolicyUnsupported`
* `atomicPersistenceFailure`
* `referentialIntegrityFailure`

Use repository naming conventions.

---

## 14. Applicability Validation

Before materialization validate:

1. Accepted Allocation exists.
2. It is V2 complete authority.
3. It has not already been successfully realized.
4. ProposalDecision lineage resolves.
5. accepted claims are internally valid.
6. productive/support/Buffer arrays match frozen Accepted Allocation totals.
7. accepted claim identities are unique.
8. exact geometry is valid.
9. canonical user-day is valid.
10. required lineage is present.
11. schedule identities can be deterministically constructed.
12. current schedule authority does not conflict.

Fail closed.

---

## 15. No Revalidation Through Replanning

Do not establish currentness by regenerating:

* Feasibility;
* Allocation;
* Proposal.

The accepted choice is historical authority.

Realization validates whether the **exact accepted footprint remains installable**.

If not installable:

> report conflict/inapplicability.

Do not ask the planning engine for a substitute.

---

## 16. Accepted Geometry Is Fixed

Every accepted claim already carries exact geometry.

Task 9.3 must preserve:

```text
accepted start
accepted end
accepted duration
accepted user-day
```

exactly.

No:

* clipping;
* snapping;
* nearest-opening search;
* boundary adjustment;
* duration reduction;
* alternative interval search.

---

## 17. Productive Materialization

For every accepted productive claim, create exactly one:

```text
ScheduledGoalWorkV1
```

using the pure factory established by Task 9.2.2.

Preserve exact:

* claim identity;
* Goal;
* Demand;
* Projection;
* Candidate Parent;
* interval;
* user-day;
* Capacity provenance;
* Proposal/decision lineage;
* Accepted Allocation;
* Realization.

---

## 18. Support Materialization

For every accepted support claim, create exactly one:

```text
ScheduledSupportActivityV1
```

Preserve exact:

* support claim identity;
* related productive claim;
* Candidate Parent;
* footprint component;
* Composition source lineage if present;
* interval;
* user-day;
* requiredness;
* Accepted Allocation;
* Realization.

Do not derive or reposition support.

---

## 19. Buffer Materialization

For every accepted Buffer claim, create exactly one:

```text
RealizedBufferProtectionV1
```

Preserve exact:

* Buffer claim identity;
* protected target;
* component lineage;
* exact interval;
* user-day;
* Accepted Allocation;
* Realization.

Buffer remains:

* non-activity;
* non-executable;
* provenance-bearing protection.

---

## 20. Buffer Overlap Identity

Task 9.2.2 established:

> overlapping accepted Buffer claims remain separate provenance-bearing protection facts.

Preserve that.

Capacity may union overlapping protection geometry later.

Do not coalesce accepted Buffer identities into one anonymous interval.

---

## 21. Atomic Footprint

Realization is all-or-nothing.

Conceptually:

```text
validate all claims
→ stage every Goal work fact
→ stage every support fact
→ stage every Buffer protection
→ stage Realization record
→ atomically persist/install everything
```

If any required component fails:

```text
write none
```

No hidden partial realization.

---

## 22. Atomic Persistence

Use one protected transaction boundary where repository persistence architecture permits.

The transaction must include all new durable truth necessary for one realization.

Do not allow:

```text
Realization record exists
but support missing
```

or:

```text
Goal work persisted
but Buffer missing
```

or:

```text
scheduled facts persisted
but realization evidence missing
```

---

## 23. Persistence Host Discovery

Task 9.2.2 intentionally deferred the realization store.

Task 9.3 must determine the smallest correct durable ownership model.

Evaluate:

### Option A — dedicated realization/scheduled-reality store

Example conceptual ownership:

```text
realizationAuthority
```

contains:

* RealizationV1;
* ScheduledGoalWorkV1;
* ScheduledSupportActivityV1;
* RealizedBufferProtectionV1.

### Option B — existing durable schedule-history authority extended

Use only if it already semantically owns current scheduled reality rather than publication history.

Do not place current realization authority inside:

* `proposalAuthority`;
* disposable Preview;
* HistoricalPlan publication history;
* execution history.

---

## 24. Semantic Store Ownership

Expected ownership:

```text
proposalAuthority
→ Proposal / ProposalDecision / Accepted Allocation

realization/scheduled-reality authority
→ Realization / Goal Work / Support / Buffer

HistoricalPlan
→ immutable publication history

Execution
→ actual-world evidence
```

Do not merge these merely to reduce store count.

---

## 25. Database Schema

Task 9.2.2 baseline:

```text
IndexedDB schema 10
```

If Task 9.3 introduces a new object store or index:

Expected:

```text
schema 11
```

If existing topology can safely host realization records without store/index change, document why schema 10 remains valid.

Do not confuse:

* IndexedDB topology version;
* record-version tags;
* Backup version.

---

## 26. Backup Version

Task 9.2.2 baseline:

```text
Backup V11
```

Realization introduces newly durable scheduled authority.

Expected:

```text
Backup V12
```

unless existing V11 generic tagged serialization already preserves all new durable authority exactly and downgrade behavior remains safe.

Any decision to remain V11 requires explicit justification.

---

## 27. Backup Coverage

Backup must preserve:

* RealizationV1;
* ScheduledGoalWorkV1;
* ScheduledSupportActivityV1;
* RealizedBufferProtectionV1;
* exact accepted lineage;
* exact IDs;
* exact geometry;
* user-day;
* role;
* provenance.

---

## 28. Migration

Older backups contain no realization authority.

Migration must produce:

```text
realization authority = empty
```

Do not infer realization from:

* Preview;
* old scheduled blocks;
* HistoricalPlan;
* execution records;
* Accepted Allocation.

Accepted Allocation remains unrealized until an actual realization record exists.

---

## 29. Downgrade Protection

Older backup export must refuse if it cannot preserve realized authority exactly.

Do not silently drop:

* Realization records;
* Goal work;
* support;
* Buffer protection;
* accepted lineage.

---

## 30. Restore Atomicity

Restore must validate all realization relationships before mutation.

Reject restore if:

* scheduled subject references missing realization;
* realization references missing Accepted Allocation;
* claim ID not in accepted footprint;
* role does not match claim;
* geometry differs from accepted claim;
* duplicate successful realizations exist;
* Buffer appears executable;
* scheduled subject IDs are invalid;
* totals do not reconcile.

---

## 31. Referential Integrity

A valid realization must resolve internally to:

```text
Realization
→ AcceptedAllocationV2
→ ProposalDecision
→ Proposal snapshot/history
```

Every realized schedule fact must resolve:

```text
scheduled/protection fact
→ Realization
→ accepted claim
```

Do not depend on mutable current Proposal derivation.

---

## 32. Full Clear

Full application clear/reset must remove:

* realization records;
* realized Goal work;
* realized support;
* realized Buffers.

Do not leave orphaned scheduled authority.

---

## 33. Profile Boundary

Profiles remain authored setup snapshots.

They must not contain:

* Proposal;
* Accepted Allocation;
* Realization;
* realized scheduled truth;
* HistoricalPlan;
* Execution.

Loading a profile must not silently erase realization/history authority unless existing architecture explicitly defines full-world replacement.

Preserve current profile-history boundary.

---

## 34. Conflict Validation

Before persistence validate exact accepted claims against current authoritative scheduled/protective truth.

At minimum consider:

* Work;
* manual events;
* existing fixed scheduled commitments;
* realized Goal work;
* realized support;
* realized Buffer protection;
* Task 8.4 real attached activities;
* existing protective Buffers;
* other current time-owning/protective schedule authority.

---

## 35. Disposable Capacity Is Not Sufficient Conflict Evidence

Do not validate solely against a stale Capacity snapshot.

Conflict validation must use current canonical schedule/protection authority.

Capacity may be derived from that authority.

---

## 36. Conflict Semantics

A conflict means:

> The user's accepted allocation remains valid historical authority, but its exact schedule footprint can no longer be installed because later/current authoritative schedule truth occupies or protects required resource.

Result:

* Accepted Allocation preserved;
* no Realization success record;
* no scheduled facts;
* structured conflict evidence.

---

## 37. No Conflict Auto-Repair

On conflict do not:

* move accepted work;
* reduce duration;
* drop support;
* drop Buffer;
* search alternatives;
* choose another Allocation;
* generate another Proposal;
* invoke SuggestedFix automatically.

Corrective planning happens later through explicit architecture.

---

## 38. Conflict Provenance

Conflict result should identify:

* accepted claim;
* conflicting current subject/protection;
* overlapping interval;
* role;
* source identity;
* user-day.

This evidence may feed Friction.

---

## 39. Accepted-But-Unrealized Capacity Semantics

This is a required Task 9.3 decision.

After acceptance but before successful realization, accepted resource claims must not accidentally appear as fully free Capacity if the architecture intends them to be bounded claims.

Task 9.2 defines Accepted Allocation as resource authority but not scheduled ownership.

Task 9.3 must inspect the current Capacity model and implement the smallest consistent rule.

---

## 40. Preferred Capacity Rule

Preferred semantics:

### Accepted but unrealized

Represented as a bounded accepted resource liability/reservation if current architecture supports this cleanly.

### Realized

Reservation/liability resolves into actual:

* occupied productive time;
* occupied support time;
* protected Buffer time.

### Critical invariant

Do not subtract both:

```text
Accepted Allocation claim
+
realized scheduled fact
```

after successful realization.

Capacity impact must occur exactly once.

---

## 41. No Double Capacity Consumption

Add explicit tests:

```text
accepted-but-unrealized claim
→ bounded resource effect according to chosen policy

after realization
→ scheduled/protected fact replaces that effect

net resource subtraction = exactly once
```

---

## 42. If Accepted Reservation Is Not Architecturally Available

If current Capacity architecture cannot represent an accepted-but-unrealized claim without material redesign:

* stop;
* report the blocker.

Do not quietly leave accepted authority looking fully free if that contradicts governing semantics.

Do not duplicate scheduled truth as a fake Commitment.

---

## 43. Realized Capacity Semantics

After realization:

```text
productiveGoalWork
→ occupied Capacity

supportActivity
→ occupied Capacity

bufferProtection
→ protected Capacity
```

Capacity remains derived and demand-neutral.

---

## 44. Demand Semantics

Realization means:

> this Demand-serving work is scheduled.

It does not mean:

> Demand is completed.

Only productive Goal work contributes planned productive minutes.

Support/Buffer do not satisfy Demand.

---

## 45. Preview Integration

Preview must consume durable realized scheduled truth.

After successful realization and normal Preview regeneration:

* Scheduled Goal Work appears as productive Goal work;
* support appears as support activity;
* Buffer appears as protection;
* provenance identifies accepted-allocation origin.

---

## 46. Preview Remains Derived

Do not persist realized schedule truth *inside Preview*.

Preview reads authoritative scheduled reality.

Regenerating Preview must reproduce the same realized facts.

---

## 47. Preview Freshness

Successful realization changes the authoritative schedule.

Existing Preview must therefore become stale or otherwise require regeneration according to current DayFrame Preview freshness semantics.

Do not silently mutate an old Preview snapshot into currentness.

---

## 48. Preview Baseline Preservation

When no realization authority exists:

> Preview output must remain behaviorally equivalent to the Task 9.2.2 baseline.

---

## 49. Scheduling Engine Integration

Inspect the current engine and choose the seam that preserves fixed accepted geometry.

Likely options:

### A. Inject realized facts as fixed schedule inputs before Friction.

### B. Append authoritative realized facts after flexible placement but before final Friction/Preview assembly.

Choose based on current pipeline.

Mandatory:

* do not create BlockCandidates;
* do not route through flexible placement;
* do not allow realized facts to be displaced;
* detect conflicts deterministically.

---

## 50. Engine Ordering

The chosen integration must preserve:

* Work;
* legacy flexible scheduling;
* manual events;
* composition;
* realized fixed authority;
* Friction.

Document exact order.

---

## 51. Friction Integration

After successful realization, realized scheduled facts participate in ordinary schedule incompatibility detection.

All three roles can participate:

* productive owns;
* support owns;
* Buffer protects.

---

## 52. Pre-Realization Conflict and Friction

If realization fails because an accepted claim conflicts with later authoritative schedule truth, determine whether the architecture supports a typed Friction point equivalent to:

> accepted authority cannot currently be materialized.

If compatible with existing Friction architecture:

* derive a typed realization/accepted-allocation Friction.

If current Friction requires scheduled facts only:

* return structured realization conflict now;
* document Friction integration as a bounded follow-up.

Do not distort Friction semantics merely to satisfy the prompt.

---

## 53. Competition Is Still Not Friction

Do not treat:

* scarce Capacity before acceptance;
* Allocation tradeoffs;
* rejected alternatives

as Friction.

Friction begins only once authoritative commitments/accepted realization requirements are incompatible.

---

## 54. SuggestedFix Boundary

Do not automatically generate planning alternatives from failed realization.

If realized facts later participate in ordinary Friction:

* existing SuggestedFix behavior may apply only where semantically valid.

Do not convert SuggestedFix into Proposal.

---

## 55. PlanDecision Compatibility

Task 9.2.2 established durable accepted-allocation subject references.

Task 9.3 should integrate realized subject resolution with PlanDecision where required for read compatibility.

Do not implement movement of realized accepted geometry unless current PlanDecision semantics already support it without violating accepted lineage.

If movement semantics remain unresolved:

* preserve target identity;
* defer behavior.

---

## 56. CompositeDecision Boundary

Do not use CompositeDecision to rewrite Accepted Allocation.

Composition lineage may remain attached to support facts.

CompositeDecision remains limited to actual composition relationships.

---

## 57. Execution Integration

Successful realization must make:

* Scheduled Goal Work;
* Scheduled Support Activity

available as durable execution subjects through the Task 9.2.2 reference model.

Do not create execution records.

---

## 58. Execution Subject Resolution

After restart, execution lookup must resolve a scheduled accepted-allocation subject from durable schedule reality, not Preview.

Add tests.

---

## 59. Buffer Execution Prohibition

Realized Buffer must remain rejected by ExecutionRecord validation.

Add regression coverage after persistence/restore.

---

## 60. Progress Boundary

Realization creates no Progress.

Schedule state is not outcome state.

Execution itself must still not automatically create Progress unless an existing explicit policy already does so.

Do not add one here.

---

## 61. Publication Integration

Existing explicit publication workflow must be able to publish realized schedule facts.

Use HistoricalPlan V3.

Publication must freeze:

* schedule role;
* accepted-allocation origin;
* scheduled subject/protection ID;
* Realization;
* Accepted Allocation;
* accepted claim;
* ProposalDecision;
* Proposal/option;
* Goal/Demand;
* Candidate Parent;
* footprint/component provenance;
* exact interval;
* user-day.

---

## 62. No Auto-Publish

Successful realization must not publish automatically unless current architecture already publishes every schedule mutation automatically.

Expected:

> publication remains explicit.

---

## 63. Historical Immutability

After publication, later:

* schedule changes;
* Goal edits;
* footprint edits;
* Proposal changes;
* Accepted Allocation changes impossible by immutability;
* realization corrections

must not mutate existing HistoricalPlan snapshots.

---

## 64. Publication After Restart

Realized facts restored from persistence must publish identically to facts created in the current session.

Test deterministic provenance.

---

## 65. Realization History

Realization is immutable historical transition evidence.

Do not overwrite successful Realization records.

If later corrective action changes schedule truth, append separate evidence according to future corrective architecture.

---

## 66. Accepted Allocation Remains Immutable

Do not add fields such as:

```text
acceptedAllocation.status = realized
```

if that mutates the Accepted Allocation record.

Instead derive realization status through the linked Realization store.

---

## 67. Query Surface

Provide focused read APIs materially equivalent to:

* `getRealization(id)`
* `getRealizationForAcceptedAllocation(id)`
* `listRealizations(...)`
* `listScheduledGoalWork(range)`
* `listScheduledSupportActivities(range)`
* `listRealizedBufferProtections(range)`
* `listUnrealizedAcceptedAllocations()`
* `resolveScheduledAcceptedSubject(id)`
* `resolveAcceptedScheduleLineage(id)`

Use existing repository/store conventions.

---

## 68. Command Surface

Provide one authoritative command materially equivalent to:

```text
realizeAcceptedAllocation(...)
```

It must:

* be idempotent;
* validate;
* conflict-check;
* stage;
* persist atomically;
* return structured result.

---

## 69. No Public Partial Materialization

Do not expose mutation commands such as:

```text
persistGoalWork()
persistSupport()
persistBuffer()
```

outside the protected realization transaction.

Pure value factories from Task 9.2.2 remain acceptable.

---

## 70. Bulk Realization

Defer bulk realization unless required by existing workflows.

Atomic unit:

```text
one Accepted Allocation
```

Do not make a multi-allocation transaction necessary for V1.

---

## 71. Automatic Trigger After Acceptance

Architecture establishes Accepted Allocation → schedule realization as bounded automatic use of prior user authority.

Determine the product integration seam.

Preferred:

```text
accept Proposal
→ durable Accepted Allocation succeeds
→ attempt realization automatically
```

No second user authorization is required.

However, keep acceptance and realization as distinct semantic records.

---

## 72. Acceptance / Realization Transaction Boundary

Preferred rule:

1. acceptance commits successfully;
2. realization is a separate idempotent transaction;
3. realization failure does not roll back the user's valid acceptance;
4. failed realization leaves:

   * Accepted Allocation intact;
   * no partial schedule;
   * structured conflict/corrective state.

Do not merge both transactions if doing so would erase valid user choice when schedule installation fails.

---

## 73. Acceptance Integration Safety

If automatic realization is wired into the acceptance flow:

* existing acceptance APIs must still distinguish decision success from realization success;
* callers must be able to inspect both outcomes.

Do not report the user decision itself as failed merely because later schedule truth conflicted.

---

## 74. Startup / Rehydration

On application startup:

* load realization authority;
* validate durable relationships;
* expose realized schedule facts to schedule readers;
* do not rerun realization automatically for already-realized allocations.

For Accepted Allocations lacking realization:

* they remain unrealized;
* optional bounded retry behavior may occur only if explicitly architectural.

---

## 75. Retry Semantics

Calling realization again after an ordinary prior conflict may re-evaluate current schedule authority.

If the conflict is gone:

* realization may succeed.

This does not change Accepted Allocation.

Do not create a duplicate successful Realization after one already exists.

---

## 76. Failed Attempt History

Decide whether failed realization attempts are:

### A. transient structured command results only;

or

### B. durable attempt evidence.

V1 default should minimize unnecessary durable noise.

A successful Realization must be durable.

If failed attempts are not durable, conflict evidence may still feed current Friction/read state.

Document decision.

---

## 77. Determinism

Equivalent:

```text
AcceptedAllocationV2
+ current authoritative schedule
+ realization policy
+ injected time/ID inputs where needed
```

must yield equivalent:

* result classification;
* conflict evidence;
* scheduled identities;
* Realization identity;
* persisted facts;
* Preview representation;
* publication provenance.

---

## 78. Time Injection

Use injected clock for:

* `realizedAt`;
* attempt timestamp if durable.

Do not call uncontrolled current time deep inside pure logic.

---

## 79. ID Injection

Where Task 9.2.2 identity is deterministic, preserve that.

If any opaque record ID still requires generation:

* inject generator;
* test deterministically.

---

## 80. Current Schedule Conflict Examples

Add coverage for conflict against:

1. Work;
2. manual event;
3. fixed Commitment;
4. Task 8.4 attached activity;
5. existing Buffer protection;
6. existing realized Goal work;
7. existing realized support;
8. existing realized Buffer.

---

## 81. Internal Footprint Validation

Even though Task 9.2.1 already validates accepted footprints, realize defensively.

Verify:

* all required claims present;
* claim IDs unique;
* role matches factory;
* productive/support/Buffer totals reconcile;
* accepted scope includes all realized claims;
* Buffer targets resolve;
* support productive-parent refs resolve.

Do not trust malformed persistence.

---

## 82. Scope Fidelity

The successful realized footprint must be exactly equal to the accepted footprint.

Prove:

```text
accepted claim IDs
=
realized scheduled/protection claim IDs
```

No extra claims.

No missing claims.

---

## 83. No Hidden Partial Footprint

Add explicit regression where persistence fails during:

* Goal-work staging;
* support staging;
* Buffer staging;
* Realization-record staging;
* transaction commit.

Expected:

```text
no durable realization footprint
```

---

## 84. Atomic Failure Injection

Use test seams to simulate write failure at multiple stages.

Prove transaction rollback or equivalent protected write discipline.

---

## 85. Crash / Restart Idempotence

Test:

1. successful realization;
2. restart/rehydrate;
3. call realization again.

Expected:

```text
alreadyRealized
```

and no duplicate schedule facts.

---

## 86. Capacity Integration Tests

Prove after realization:

* productive occupies once;
* support occupies once;
* Buffer protects once;
* overlapping Buffers union calculation where applicable;
* Accepted Allocation is not additionally double-subtracted;
* released/removed reservation semantics are correct.

---

## 87. Preview Integration Tests

Prove:

* realized Goal work appears;
* support appears;
* Buffer appears/protects;
* accepted origin visible;
* exact geometry retained;
* user-day retained;
* restart regeneration identical;
* no realization = old Preview behavior.

---

## 88. Friction Integration Tests

Prove realized:

* productive vs Work conflict detected;
* support vs manual conflict detected;
* activity vs Buffer protection detected;
* Buffer vs activity conflict detected according to current policy.

If pre-realization conflict Friction is supported, test it separately.

---

## 89. Publication Tests

Prove publication after realization contains HistoricalPlan V3 snapshots for:

* productive;
* support;
* Buffer.

Verify full lineage.

---

## 90. Execution Integration Tests

Prove:

* realized Goal work resolves as execution subject;
* realized support resolves as execution subject;
* Buffer does not;
* subject identity survives restart;
* no execution auto-created.

---

## 91. Progress Regression

Prove:

```text
realization
→ zero Progress mutation
```

and:

```text
schedule publication
→ zero Progress mutation
```

---

## 92. Proposal/Acceptance Regression

Prove:

* Proposal unchanged;
* ProposalDecision unchanged;
* Accepted Allocation immutable;
* legacy productive-only acceptance not realized;
* complete V2 acceptance realizable.

---

## 93. Direct Authoring Regression

Prove direct:

* Commitments;
* manual events;
* Goal-linked Commitments

remain independent from Accepted Allocation realization.

No fake Proposal lineage added.

---

## 94. Recurrence Regression

Prove realized accepted facts:

```text
recurrence = none
```

and do not create BlockRecurrence/template authoring.

---

## 95. Canonical User-Day Regression

Test:

* overnight productive session;
* support on adjacent user-day;
* Buffer on adjacent user-day;
* custom day boundary.

No calendar-midnight reinterpretation.

---

## 96. Planning Coverage

Do not silently drop realized facts outside the currently displayed Preview range.

Durable schedule reality is independent of current Review Scope.

Range readers may filter display, but authority persists.

---

## 97. Today / Month / Review Compatibility

Do the smallest integration necessary for generic schedule readers.

Do not redesign these surfaces.

If current Today/Month readers already consume the common schedule read union, ensure realized facts are visible where appropriate.

Document any deliberately deferred UI exposure.

---

## 98. DF-006

Preserve DF-006 closure.

Do not reintroduce:

* calendar-midnight assumptions;
* cycle/workday/weekend split semantics;
* preview boundary regressions.

Run relevant regression coverage.

---

## 99. Bundle Discipline

Task 9.2.2 final baseline:

* initial raw: **655,722**
* initial gzip: **167,447**
* largest lazy: **53,187**
* total: **927,513**

Warning state remains active.

Requirements:

1. keep realization/history logic lazy where practical;
2. avoid broad eager UI imports;
3. reuse Task 9.2.2 identity factories;
4. avoid duplicate serialization/provenance code;
5. record exact before/after bundle numbers;
6. pass hard limits.

---

## 100. Performance

Realization operates over:

* one Accepted Allocation;
* its bounded claim arrays;
* current bounded schedule overlap checks.

Do not introduce unbounded whole-history scans.

Use indexed/range reads if persistence architecture provides them.

---

## 101. UI Boundary

No broad realization UI is required.

Minimum product-visible behavior may include:

* realization status;
* realization conflict/error state;
* realized facts appearing in existing schedule surfaces.

Do not build the final Planner workspace.

---

## 102. Accessibility

If a new realization status/error appears in existing UI:

* expose meaningful text;
* do not rely solely on color;
* preserve keyboard/accessibility semantics.

If no interactive UI changes:

> record that explicitly.

---

## 103. Governance

Update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` only for genuinely new durable architectural decisions such as:

* realization persistence host;
* accepted-unrealized Capacity liability;
* failed-attempt durability;
* automatic trigger boundary.

Record:

> Task 9.3 architecture reopen closed and realization implemented.

Do not rewrite completed Task 9.2.0–9.2.2 RESULT artifacts.

---

## 104. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve cumulative Phase 9 work;
3. preserve unrelated changes;
4. do not clean;
5. do not discard prior task changes;
6. do not commit;
7. do not push unless explicitly instructed.

Report repository state in RESULT.

---

## 105. Required Validation Commands

Run repository-supported equivalents:

```bash
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
git diff --check
```

Also run focused suites for:

* realization;
* atomic persistence;
* conflict detection;
* Capacity;
* Preview;
* Friction;
* execution subject resolution;
* HistoricalPlan V3 publication;
* backup/restore;
* migration;
* retry/idempotence;
* canonical user-day;
* legacy Accepted Allocation rejection.

---

## 106. Required RESULT Artifact

Create:

```text
TASK_9.3_ACCEPTED_ALLOCATION_REALIZATION_V1_RESULT.md
```

Filename must contain **`RESULT`**.

Place it in the dedicated Phase 9 implementation-results folder.

---

## 107. Required RESULT Sections

The RESULT must include at minimum:

1. Executive Result
2. Architecture-Reopen Closure
3. Governing Foundations
4. Starting Baseline
5. Scope Delivered
6. Explicit Non-Goals
7. Realization Definition
8. Realization Policy
9. Realization Identity
10. Eligibility Rules
11. Applicability Rules
12. Result Status Model
13. Reason Codes
14. Accepted Authority Validation
15. Fixed Geometry Rule
16. Productive Materialization
17. Support Materialization
18. Buffer Materialization
19. Buffer Overlap Identity
20. Atomic Footprint
21. Atomic Persistence
22. Persistence Host Decision
23. Semantic Store Ownership
24. Database Schema Decision
25. Backup Version Decision
26. Backup Coverage
27. Migration
28. Downgrade Protection
29. Restore Validation
30. Referential Integrity
31. Full Clear
32. Profile Boundary
33. Conflict Validation
34. Current Schedule Authority
35. Conflict Semantics
36. Conflict Provenance
37. No Auto-Repair
38. Accepted-Unrealized Capacity Decision
39. Capacity Transition
40. Double-Consumption Prevention
41. Demand Semantics
42. Preview Integration
43. Preview Freshness
44. Preview Baseline
45. Scheduling Engine Integration
46. Engine Ordering
47. Friction Integration
48. Pre-Realization Conflict/Friction Decision
49. SuggestedFix Boundary
50. PlanDecision Compatibility
51. CompositeDecision Boundary
52. Execution Integration
53. Execution Resolution
54. Buffer Execution Prohibition
55. Progress Boundary
56. Publication Integration
57. Auto-Publication Decision
58. Historical Immutability
59. Publication After Restart
60. Realization History
61. Accepted Allocation Immutability
62. Query Surface
63. Command Surface
64. No Partial Materialization API
65. Bulk Realization Decision
66. Automatic Trigger Decision
67. Acceptance/Realization Transaction Boundary
68. Acceptance Integration
69. Startup/Rehydration
70. Retry Semantics
71. Failed Attempt Durability
72. Determinism
73. Time/ID Injection
74. Current Conflict Coverage
75. Internal Footprint Validation
76. Scope Fidelity
77. Atomic Failure Injection
78. Crash/Restart Idempotence
79. Capacity Tests
80. Preview Tests
81. Friction Tests
82. Publication Tests
83. Execution Tests
84. Progress Tests
85. Proposal/Acceptance Regression
86. Direct Authoring Regression
87. Recurrence Regression
88. Canonical User-Day Regression
89. Planning Coverage
90. Today/Month/Review Compatibility
91. DF-006
92. Persistence/Version Compatibility
93. Bundle Architecture Review
94. Performance
95. UI Boundary
96. Accessibility
97. Full Regression
98. Validation Commands
99. V1 Design Decision Table
100. Boundary Matrix
101. Authority Transition Matrix
102. Realization Mapping Matrix
103. Conflict Matrix
104. Persistence Matrix
105. Invariant Verification
106. Deviations
107. Governance Updates
108. Repository Status
109. Critical-Path Assessment
110. Dogfood Readiness Assessment
111. Recommended Next Task
112. Completion Statement

---

## 108. Required V1 Design Decision Table

Include:

| Question                     | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ---------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| realization policy           |             |                     |                    |                     |
| realization identity         |             |                     |                    |                     |
| persistence host             |             |                     |                    |                     |
| transaction boundary         |             |                     |                    |                     |
| eligibility                  |             |                     |                    |                     |
| applicability                |             |                     |                    |                     |
| conflict source              |             |                     |                    |                     |
| conflict result              |             |                     |                    |                     |
| accepted-unrealized Capacity |             |                     |                    |                     |
| productive mapping           |             |                     |                    |                     |
| support mapping              |             |                     |                    |                     |
| Buffer mapping               |             |                     |                    |                     |
| Buffer overlap identity      |             |                     |                    |                     |
| Preview seam                 |             |                     |                    |                     |
| Friction seam                |             |                     |                    |                     |
| execution seam               |             |                     |                    |                     |
| publication seam             |             |                     |                    |                     |
| acceptance trigger           |             |                     |                    |                     |
| failed attempt persistence   |             |                     |                    |                     |
| schema                       |             |                     |                    |                     |
| backup                       |             |                     |                    |                     |
| UI exposure                  |             |                     |                    |                     |

---

## 109. Required Boundary Matrix

| Concept             | Class                |    Owns/Protects Time? |   Durable? |                 User Authority? |
| ------------------- | -------------------- | ---------------------: | ---------: | ------------------------------: |
| Proposal            | Proposed             |                     No |    History |                              No |
| ProposalDecision    | Decision evidence    |                     No |        Yes |                             Yes |
| Accepted Allocation | Accepted authority   |        Claims resource |        Yes |                             Yes |
| Realization         | Transition evidence  |                     No |        Yes | Derived from accepted authority |
| Scheduled Goal Work | Scheduled reality    |                   Owns |        Yes |                 From acceptance |
| Scheduled Support   | Scheduled reality    |                   Owns |        Yes |                 From acceptance |
| Realized Buffer     | Scheduled protection |               Protects |        Yes |                 From acceptance |
| Preview             | Derived read model   |         No independent | Disposable |                              No |
| Published Plan      | Immutable history    |             Historical |        Yes |   Existing publication workflow |
| Execution           | Actual evidence      | No scheduled ownership |        Yes |             Actual-world report |
| Progress            | Outcome evidence     |                     No |        Yes |                        Separate |

---

## 110. Required Authority Transition Matrix

| Transition                             |        New User Authority? | Task 9.3 Behavior    |
| -------------------------------------- | -------------------------: | -------------------- |
| Proposal → ProposalDecision            |                        Yes | Existing             |
| ProposalDecision → Accepted Allocation |                        Yes | Existing             |
| Accepted Allocation → Realization      |                         No | Implement            |
| Realization → Goal Work                |                         No | Implement atomically |
| Realization → Support                  |                         No | Implement atomically |
| Realization → Buffer                   |                         No | Implement atomically |
| Schedule → Preview                     |                         No | Derived              |
| Schedule → Publication                 | Existing explicit workflow | Integrate            |
| Schedule → Execution                   |      Actual evidence later | Subject only         |
| Schedule → Progress                    |     No implicit transition | None                 |

---

## 111. Required Realization Mapping Matrix

| Accepted Claim   | Realized Fact              | Owns/Protects | Executable |           Demand Credit |
| ---------------- | -------------------------- | ------------- | ---------: | ----------------------: |
| productive       | ScheduledGoalWorkV1        | owns          |        Yes | planned productive only |
| supportActivity  | ScheduledSupportActivityV1 | owns          |        Yes |                      No |
| bufferProtection | RealizedBufferProtectionV1 | protects      |         No |                      No |

---

## 112. Required Conflict Matrix

Test/document at minimum:

| Accepted Claim | Existing Authority        | Expected                                               |
| -------------- | ------------------------- | ------------------------------------------------------ |
| productive     | Work                      | conflict                                               |
| productive     | manual event              | conflict                                               |
| productive     | realized Goal work        | conflict                                               |
| productive     | Buffer                    | conflict                                               |
| support        | Work                      | conflict                                               |
| support        | manual event              | conflict                                               |
| support        | realized support          | conflict                                               |
| support        | Buffer                    | conflict                                               |
| Buffer         | activity                  | conflict                                               |
| Buffer         | compatible Buffer         | permitted/unioned calculation with distinct provenance |
| any            | touching `[end == start]` | no overlap                                             |

---

## 113. Required Persistence Matrix

| Record              | Store Owner             | Record Version | Backup Coverage                 | Restored? |
| ------------------- | ----------------------- | -------------- | ------------------------------- | --------- |
| Accepted Allocation | proposal authority      | existing V2    | existing                        | Yes       |
| Realization         | chosen realization host | V1             | new                             | Yes       |
| Scheduled Goal Work | chosen realization host | V1             | new                             | Yes       |
| Scheduled Support   | chosen realization host | V1             | new                             | Yes       |
| Buffer Protection   | chosen realization host | V1             | new                             | Yes       |
| HistoricalPlan V3   | HistoricalPlan          | existing       | existing/new backup as required | Yes       |
| Execution           | execution store         | existing       | existing                        | Yes       |

---

## 114. Required Invariant Verification

Explicitly verify:

1. only complete AcceptedAllocationV2 is realizable;
2. legacy productive-only acceptance is not silently realized;
3. Accepted Allocation remains immutable;
4. Realization is separate immutable evidence;
5. one Accepted Allocation has at most one successful Realization;
6. successful realization is idempotent;
7. retry after restart does not duplicate;
8. productive maps one-to-one to Goal Work;
9. support maps one-to-one to Scheduled Support;
10. Buffer maps one-to-one to protection fact;
11. Buffer provenance remains distinct when geometry overlaps;
12. exact accepted geometry is preserved;
13. exact accepted user-day is preserved;
14. no BlockCandidate is created;
15. no placement search runs;
16. no re-ranking runs;
17. no Composition re-derivation runs;
18. no Feasibility rerun chooses substitutes;
19. no Allocation rerun chooses substitutes;
20. no Proposal rerun changes accepted choice;
21. no recurrence is created;
22. no template is synthesized;
23. no manual event is synthesized;
24. no Work identity is reused;
25. all required accepted claims materialize atomically;
26. any failure writes no partial footprint;
27. schedule conflicts fail closed;
28. conflicts preserve Accepted Allocation;
29. conflict handling does not move accepted geometry;
30. accepted-unrealized Capacity semantics are explicit;
31. Capacity subtracts accepted/realized resource exactly once;
32. productive consumes occupied Capacity;
33. support consumes occupied Capacity;
34. Buffer protects Capacity;
35. only productive counts as planned Demand-serving work;
36. realization does not complete Demand;
37. realization does not create execution;
38. realization does not create Progress;
39. Buffer cannot be execution subject;
40. Goal work can resolve as execution subject;
41. support can resolve as execution subject;
42. execution identity survives restart;
43. Preview reads durable realization;
44. Preview remains non-authoritative;
45. no realization means legacy Preview unchanged;
46. successful realization invalidates/stales prior Preview appropriately;
47. realized facts participate in Friction;
48. Competition remains distinct from Friction;
49. SuggestedFix remains corrective;
50. PlanDecision does not silently rewrite accepted choice;
51. CompositeDecision remains composition-specific;
52. publication preserves full accepted lineage;
53. publication remains explicit;
54. HistoricalPlan remains immutable;
55. old publications remain readable;
56. migration infers no realization from old data;
57. restore preserves exact realized identity;
58. downgrade cannot silently discard realized authority;
59. full clear removes realization authority;
60. profiles remain authored snapshots;
61. direct authoring remains independent;
62. user-day semantics remain canonical;
63. half-open interval semantics remain exact;
64. equivalent inputs produce equivalent realization outputs;
65. no hidden autonomous replanning is introduced.

---

## 115. Stop / Architecture Reopen Conditions

Stop and report if:

* complete Accepted Allocation claims cannot be installed without rerunning planning;
* accepted geometry cannot be represented exactly by Task 9.2.2 types;
* atomic persistence cannot include all realization facts;
* realization cannot be made idempotent;
* accepted-but-unrealized Capacity necessarily appears fully free with no safe liability model;
* current schedule authority cannot be queried deterministically for conflict;
* Buffer cannot participate in current schedule protection without becoming fake activity;
* Preview cannot consume realized facts without making them BlockCandidates;
* execution subject resolution requires ephemeral Preview IDs;
* publication cannot preserve exact lineage;
* restoring realized facts would require reinterpreting historical data;
* Realization ownership cannot be separated from Proposal authority/history.

Do not work around a stop condition by weakening accepted fidelity.

---

## 116. Critical-Path Completion Assessment

The RESULT must explicitly assess:

> Does Task 9.3 complete the ordinary semantic planning path from authored Goal Demand through explicit user acceptance into durable scheduled reality?

Expected:

```text
Yes
```

if all criteria pass.

The ordinary semantic chain would then be:

```text
Goal
→ Demand
→ Projection
→ Feasibility
→ Competition
→ Allocation
→ Proposal
→ ProposalDecision
→ Accepted Allocation
→ Realization
→ Scheduled Goal Work / Support / Buffer
```

Execution and Progress remain later states.

---

## 117. Dogfood Readiness Assessment

Assess whether DayFrame is now ready for the planned Phase 9 ordinary-loop dogfood pass.

Do not automatically declare full Planner UX ready.

Evaluate:

* Goal authoring available;
* Demand/Priority available;
* complete Capacity/Feasibility available;
* Proposal/decision available;
* realization available;
* realized schedule visible enough to inspect;
* publication available.

Identify remaining blockers in:

* Planning Horizon;
* Proposal Horizon;
* Review Scope;
* Month/Planner;
* Review Schedule;
* publication workflow polish.

---

## 118. Expected Next Task

If Task 9.3 completes successfully, do **not** continue inventing realization work.

Inspect the roadmap and current implementation before selecting the next bounded task.

Expected next area:

> **Planning Data Horizon / Proposal Horizon / Review Scope convergence**

likely Task 9.4, followed by Planner/Month and Review Schedule evolution.

---

## 119. Architecture-Reopen Completion Statement

The RESULT must state materially equivalent to:

> **The Task 9.3 architecture reopen is closed. Tasks 9.2.0, 9.2.1, and 9.2.2 established the missing pre-scheduling footprint, accepted-footprint propagation, and downstream identity contracts; Task 9.3 now consumes those contracts directly and performs the exact atomic Accepted Allocation → scheduled reality transition without re-planning or inventing new authority.**

---

## 120. Final Completion Statement

The Task 9.3 RESULT must end with a completion statement materially equivalent to:

> **Task 9.3 — Accepted Allocation Realization V1 complete.**
>
> DayFrame now completes the ordinary planning authority chain from explicit user acceptance into durable scheduled reality: every current complete `AcceptedAllocationV2` can be validated against current authoritative schedule truth and, when its exact accepted footprint remains installable, converted by one immutable `RealizationV1` into deterministic `ScheduledGoalWorkV1`, `ScheduledSupportActivityV1`, and `RealizedBufferProtectionV1` facts using the exact productive, support, and Buffer claim identities, geometry, canonical user-day, requiredness, Candidate Parent, component/source, Goal/Demand, ProposalDecision, Proposal, Capacity, and accepted-authority provenance already frozen upstream; realization performs no Composition derivation, Feasibility search, Competition analysis, Allocation ranking, Proposal generation, substitution, movement, clipping, recurrence, or scope widening, and conflicting current schedule authority causes a structured fail-closed result that preserves the user's Accepted Allocation while writing no partial schedule; all required productive/support/Buffer facts and the Realization record persist atomically, one Accepted Allocation has at most one canonical successful Realization, repeated calls and restart retries are idempotent, malformed or legacy productive-only accepted authority cannot silently enter realization, migration infers no scheduled reality from historical Preview/publication/execution data, and restore/downgrade/full-clear behavior preserves exact authority and referential integrity; realized productive and support facts own Capacity while Buffer protects it, accepted-but-unrealized resource liability and realized schedule consumption cannot double subtract Capacity, only productive Goal work counts as planned Demand-serving effort, and no realization creates execution or Progress; Preview remains disposable but regenerates from durable realized truth, realized facts retain first-class `acceptedAllocation` origin and their distinct productive/support/protection roles, Friction can reason over their authoritative conflicts without becoming Competition or Proposal, stable productive/support identities are available to execution while Buffer remains structurally non-executable, and explicit publication can freeze all three roles through HistoricalPlan V3 with complete immutable lineage; legacy Work, template, manual-event, Composition, Preview, execution, publication, profile, canonical user-day, and DF-006 semantics remain intact; the Task 9.3 architecture reopen is closed, the ordinary semantic planning critical path from Goal Demand through Proposal acceptance to scheduled reality is complete, and the next Phase 9 work may return to Planning Data Horizon, Proposal Horizon, Review Scope, Planner/Month, Review Schedule, publication workflow, and Dogfood Pass 02 rather than further realization architecture.
