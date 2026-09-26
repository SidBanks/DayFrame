# Task 9.13 — First-Class Sleep Capacity & Planning Integration V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Foundational planning integration / Capacity / ordinary Commitment ordering / Goal planning  
**Primary Specification:** Task 9.10 — First-Class Sleep Architecture Specification  
**Prerequisites:**  
- Task 9.11 — First-Class Sleep Domain & Persistence Foundation — COMPLETE  
- Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation — COMPLETE  
**Implementation Changes:** **AUTHORIZED WITHIN THIS TASK'S BOUNDED SCOPE**  
**Sleep Corrective Authority / Publication / Execution:** **PROHIBITED**  
**UI Redesign:** **PROHIBITED**  
**Required Durable Output:** `PHASE_9_TASK_9_13_FIRST_CLASS_SLEEP_CAPACITY_PLANNING_INTEGRATION_V1_RESULT.md`

---

## 1. Objective

Make First-Class Sleep an actual foundational planning constraint.

Tasks 9.10–9.12 established:

```text
Task 9.10
Sleep semantics and authority architecture
        ↓
Task 9.11
durable authored Sleep authority
        ↓
Task 9.12
required Sleep occurrence derivation
+
physical domains
+
authoritative blocking geometry
+
complete bounded joint feasibility solver
+
SleepResolutionV1
```

Task 9.13 must now integrate that trustworthy derived result into the ordinary planning pipeline:

```text
Authored Work
+
hard authoritative geometry
+
First-Class Sleep
        ↓
foundational temporal solution
        ↓
ordinary movable Commitment placement
        ↓
demand-neutral Capacity
        ↓
Goal feasibility
        ↓
Competition
        ↓
Allocation
        ↓
Proposal
```

The central invariant is:

> **Sleep may now constrain planning, but planning may not yet change Sleep.**

At completion, DayFrame must no longer allocate ordinary movable Commitments or Goal work into time required by successfully resolved First-Class Sleep.

When First-Class Sleep cannot be safely resolved, affected downstream planning must not pretend that unresolved Sleep time is allocatable Capacity.

Task 9.13 does **not** yet implement corrective Sleep authority.

---

## 2. Governing Architecture

Preserve the DayFrame authority chain:

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
Explicit Preference
```

Task 9.13 consumes:

```text
Authored SleepRequirementV1
        ↓
Derived SleepResolutionV1
```

and integrates the result into:

```text
Derived ordinary placement
Derived Capacity
Derived Goal feasibility
Derived Competition
Derived Allocation
Derived Proposal
```

It must not create new:

```text
Accepted Sleep authority
Published Sleep authority
Execution Sleep authority
Historical Sleep authority
```

---

## 3. Canonical Planning Dependency Order

The planning dependency graph after Task 9.13 must be:

```text
Authored setup
+
canonical temporal context
+
Work
+
manual/fixed authority
+
accepted exact physical authority
+
realized physical facts
        ↓
First-Class Sleep derivation
        ↓
First-Class Sleep feasibility resolution
        ↓
FOUNDATIONAL PLANNING GATE
        ↓
ordinary movable Commitment placement
        ↓
demand-neutral Capacity
        ↓
Goal feasibility
        ↓
Goal Competition
        ↓
Allocation
        ↓
Proposal
```

Do not invert this dependency.

Specifically prohibited:

```text
place ordinary movable Commitments
        ↓
see what time remains
        ↓
try to squeeze Sleep into leftovers
```

Sleep is foundational.

Ordinary movable planning must adapt to Sleep, not the reverse.

---

## 4. Governing Planning Rule

For any planning scope in which an applicable First-Class Sleep requirement exists:

### If Sleep resolution is `satisfied`

The complete solved Sleep footprint:

```text
bufferBefore
+
Sleep activity
+
bufferAfter
```

must become foundational protected geometry for downstream planning.

### If Sleep resolution is `infeasible`

Affected downstream planning is:

```text
nonAllocatable
```

because required foundational time could not be satisfied.

### If Sleep resolution is `searchIncomplete`

Affected downstream planning is:

```text
nonAllocatable
```

because DayFrame does not know whether required Sleep can be satisfied.

### If Sleep resolution is `contextIncomplete`

Affected downstream planning is:

```text
nonAllocatable
```

because required context is unavailable.

### If Sleep resolution is `invalid` or `protected`

Affected downstream planning is:

```text
nonAllocatable
```

because authority cannot be trusted.

### If Sleep resolution is `notConfigured`

Do not infer Sleep.

Existing planning may continue without First-Class Sleep subtraction.

### If Sleep resolution is `notApplicable`

The validated scope contains no applicable First-Class Sleep obligation.

Existing planning may continue for that validated scope.

The system must never convert:

```text
unknown Sleep feasibility
```

into:

```text
available time
```

---

## 5. Critical Fail-Closed Invariant

This is the central correctness rule for Task 9.13:

> **Unknown or unsatisfied foundational Sleep must fail closed for allocatable Capacity.**

Therefore:

```text
infeasible
searchIncomplete
contextIncomplete
invalid
protected
```

must never produce ordinary Goal-allocatable Capacity for the affected planning scope.

Do not substitute:

```text
raw physical openings
```

for:

```text
allocatable Capacity
```

when foundational Sleep is unresolved.

Diagnostic physical openings may still exist as derived evidence if current architecture supports them, but they must not be exposed semantically as safe allocatable Capacity.

---

## 6. Preserve Absence Semantics

Do not confuse:

```text
Sleep not configured
```

with:

```text
Sleep unresolved
```

These mean different things.

### `notConfigured`

Means:

```text
No First-Class Sleep requirement has been authored.
```

Do not invent one.

Do not block planning merely because no First-Class Sleep requirement exists.

### `notApplicable`

Means:

```text
The validated queried scope has no applicable required occurrence.
```

Do not invent one.

### unresolved/error states

Mean:

```text
A requirement exists or relevant authority is expected,
but the foundational answer cannot safely be established.
```

These must fail closed.

---

## 7. Required Pre-Implementation Trace

Before editing code, trace the actual production path for:

### First-Class Sleep

At minimum:

```text
core/sleep/sleepRequirement.ts
core/sleep/sleepResolution.ts
core/sleep/deriveSleepOccurrences.ts
core/sleep/sleepFoundationalOccupancy.ts
core/sleep/solveRequiredSleep.ts
core/sleep/resolveRequiredSleep.ts
state/dayFrameStore.ts
state/types.ts
```

### Ordinary movable Commitment placement

Trace:

- candidate generation;
- recurrence expansion;
- preferred windows;
- fixed versus flexible semantics;
- beforeWork / afterWork;
- opening discovery;
- physical occupancy;
- unplaced candidate handling;
- buffers;
- composition/support relationships;
- accepted exact placement replay;
- existing Work-relative placement.

At minimum inspect:

```text
generateBlockCandidates
placeBlockCandidates
physicalOccupancy
```

and their actual callers.

### Capacity

Trace:

- canonical Capacity query owner;
- physical exclusion inputs;
- Work subtraction;
- Commitment subtraction;
- accepted liabilities;
- realized geometry;
- incomplete/unknown coverage states;
- user-day/week/range aggregation;
- demand-neutrality guarantees.

### Goal planning

Trace:

```text
Goal Demand
Goal feasibility
Competition
Allocation
Proposal
Accepted Allocation
Realization
```

Identify exactly where physical Capacity becomes Goal feasibility.

### Preview

Trace whether the ordinary Commitment placement pipeline is owned by:

```text
generateSchedulePreview
```

or by a lower-level reusable domain function.

Task 9.13 must not accidentally make Preview the semantic owner of foundational Sleep.

### Tests

Locate existing coverage for:

- flexible Commitment placement;
- Capacity;
- incomplete Capacity;
- Goal feasibility;
- Competition;
- Allocation;
- Proposal;
- accepted Allocation;
- realization;
- Work-relative placement;
- physical occupancy;
- deterministic scheduling.

Record the production trace in the RESULT.

---

## 8. One Semantic Owner for Foundational Sleep Geometry

Task 9.12 created:

```text
ScheduledSleepOccurrenceV1
```

as the derived witness of a `satisfied` Sleep solution.

Task 9.13 must establish one canonical adapter from:

```text
SleepResolutionV1.status === 'satisfied'
```

to:

```text
foundational protected physical geometry
```

for downstream planning.

Do not independently reconstruct Sleep intervals inside:

```text
Commitment placement
Capacity
Goal feasibility
Proposal
```

Consumers must use the same solved Sleep geometry.

No subsystem may independently “re-place” Sleep.

---

## 9. Sleep Footprint as Foundational Protection

For a satisfied occurrence:

```text
footprintStart
→ sleepStart
→ sleepEnd
→ footprintEnd
```

the entire:

```text
[footprintStart, footprintEnd)
```

is unavailable to ordinary movable planning.

Preserve semantic distinctions:

```text
[sleepStart, sleepEnd)
= required Sleep activity

[footprintStart, sleepStart)
= protected before-buffer

[sleepEnd, footprintEnd)
= protected after-buffer
```

Do not flatten these distinctions in the canonical Sleep result.

A downstream occupancy adapter may expose the whole footprint as protected geometry while retaining provenance identifying:

```text
Sleep activity
before-buffer
after-buffer
```

---

## 10. Sleep Geometry Is Derived, Not New Authority

When satisfied Sleep geometry constrains planning, it remains:

```text
Derived foundational geometry
```

It does not become:

```text
Accepted Allocation
Realized Schedule Fact
Published Plan
Execution Record
```

merely because Capacity obeys it.

Do not persist the solved geometry as new authority.

Its validity depends on its Task 9.12 dependency fingerprint and complete context.

---

## 11. Dependency Freshness

A downstream planning result may consume a satisfied Sleep resolution only when that resolution corresponds to the exact planning dependencies being evaluated.

Do not:

```text
solve Sleep
edit Work
reuse old Sleep geometry
```

or:

```text
solve Sleep
edit Sleep requirement
reuse old Sleep geometry
```

or:

```text
solve Sleep
change hard authoritative geometry
reuse old Sleep geometry
```

Prefer recomputation from canonical current snapshots rather than introducing a mutable Sleep-resolution cache.

If caching already exists and is reused, it must be explicitly fingerprint-safe.

No stale derived Sleep may acquire planning authority.

---

## 12. Planning Query Composition

Establish a canonical planning composition equivalent to:

```text
current canonical authored state
        ↓
current foundational authority snapshot
        ↓
resolveRequiredSleep(...)
        ↓
qualify foundational planning state
        ↓
ordinary movable placement
        ↓
Capacity
        ↓
Goal planning
```

Do not require callers to manually remember:

```text
call Sleep query first
then pass these five arrays
then separately mark Capacity unsafe
```

where doing so would permit semantic drift.

The architecture should make the safe dependency order the ordinary path.

---

## 13. Planning Qualification Model

Introduce or extend a canonical derived planning qualification model.

Use repository naming conventions, but the semantics should be equivalent to:

```ts
type FoundationalPlanningQualificationV1 =
  | {
      status: 'allocatable';
      sleep:
        | { status: 'notConfigured' }
        | { status: 'notApplicable' }
        | {
            status: 'satisfied';
            resolution: SleepResolutionSatisfiedV1;
          };
    }
  | {
      status: 'nonAllocatable';
      sleep:
        | { status: 'infeasible'; ... }
        | { status: 'searchIncomplete'; ... }
        | { status: 'contextIncomplete'; ... }
        | { status: 'invalid'; ... }
        | { status: 'protected'; ... };
    };
```

This is conceptual.

Do not force this exact type if an existing Capacity coverage/qualification owner can represent the semantics cleanly.

The important requirement is:

```text
allocatable
```

versus:

```text
nonAllocatable
```

must be explicit and machine-readable.

---

## 14. Do Not Encode Non-Allocatable as Zero Capacity

This distinction is critical.

Do not represent:

```text
Sleep feasibility unknown
```

merely as:

```text
0 available minutes
```

Zero known Capacity and unknown/untrusted Capacity are not the same.

Preserve:

```text
known zero
```

versus:

```text
cannot safely compute allocatable Capacity
```

The Capacity read model must retain this distinction.

---

## 15. Capacity Remains Demand-Neutral

Task 9.13 must preserve the Capacity architecture:

> **Capacity is derived from time ownership/protection and does not depend on Goal Demand.**

Sleep may subtract because it now establishes foundational protected geometry.

Goal Demand still may not subtract from Capacity.

Proposal still may not subtract from Capacity.

Unaccepted Allocation still may not subtract from Capacity.

Do not use Goal demand to influence Sleep placement.

Do not use Goal feasibility to influence Sleep placement.

Dependency remains one-way:

```text
Sleep
→ Capacity
→ Goal feasibility
```

not:

```text
Sleep ↔ Goals
```

---

## 16. Capacity Subtraction Rule

For a `satisfied` Sleep resolution:

```text
Capacity = existing physical capacity
           minus complete solved Sleep footprints
```

subject to existing Capacity semantics.

Avoid double subtraction when Sleep overlaps something that already excludes time.

Use interval-union / canonical physical occupancy semantics rather than arithmetic subtraction of raw durations.

Example:

```text
Sleep footprint overlaps existing hard exclusion
```

must not cause:

```text
Capacity -= Sleep duration
Capacity -= hard exclusion duration
```

twice for the overlap.

Capacity must be derived from physical geometry.

---

## 17. Sleep Must Not Double-Subtract Work

Because the Sleep solver already prevents satisfied Sleep footprints from overlapping Work, ordinary valid solutions should not overlap Work.

Still preserve a defensive invariant:

```text
Capacity exclusion is geometric union,
not additive duration accounting.
```

Do not assume disjointness as the only thing preventing arithmetic corruption.

---

## 18. Ordinary Movable Commitment Ordering

Ordinary movable Commitments must now place around:

```text
Work
+
other foundational hard occupancy
+
satisfied First-Class Sleep footprint
```

The canonical order becomes:

```text
foundational geometry
        ↓
Sleep solution
        ↓
ordinary movable Commitment placement
```

Do not allow flexible Commitment placement to occupy solved Sleep time.

---

## 19. Existing Flexible Commitment Behavior

Preserve existing semantics for ordinary movable Commitments except where necessary to respect First-Class Sleep occupancy.

Do not redesign:

```text
priority
preferred window
recurrence
buffers
beforeWork
afterWork
unplaced handling
```

in this task.

A Commitment that previously fit but no longer fits because required Sleep owns the interval may:

```text
move to another valid opening
```

or:

```text
become unplaced
```

according to existing placement semantics.

It may not displace Sleep.

---

## 20. Fixed / Locked Commitments

Fixed/locked authoritative Commitment geometry already constrains the Sleep solver.

Therefore Task 9.13 must not subsequently move it to accommodate Sleep.

If:

```text
fixed authority
+
required Sleep
```

is incompatible, Task 9.12 should produce:

```text
infeasible
```

and Task 9.13 should mark affected planning:

```text
nonAllocatable
```

Do not resolve the conflict here.

That belongs to later Friction/corrective-authority work.

---

## 21. Legacy Sleep Commitment Coexistence

Legacy Sleep Commitments remain ordinary Commitments.

Therefore:

### movable legacy Sleep Commitment

It is ordinary movable Commitment geometry.

It must place around First-Class Sleep like any other movable Commitment.

Do not treat its title/category as foundational.

### fixed legacy Sleep Commitment

It remains fixed authority and therefore may already constrain First-Class Sleep feasibility.

Do not automatically delete or suppress it.

### duplicate-looking Sleep

If both systems coexist and the legacy Commitment happens to produce another Sleep-looking block:

```text
do not silently merge them
do not infer equivalence
do not auto-retire legacy
```

Explicit legacy conversion remains deferred.

---

## 22. Ordinary Commitment Placement Must Use the Solved Sleep Witness

Do not reconstruct:

```text
Sleep window
```

and treat the entire window as unavailable.

Only the actual satisfied:

```text
Sleep footprint
```

is protected for downstream ordinary placement.

Example:

```text
valid Sleep window = 21:00–09:00
solved Sleep footprint = 23:00–07:30
```

Ordinary movable planning may still use:

```text
21:00–23:00
07:30–09:00
```

subject to other constraints.

The authored valid domain is not itself time ownership.

---

## 23. Capacity Must Use the Solved Sleep Witness

Likewise, Capacity must subtract:

```text
solved Sleep footprint
```

not:

```text
entire authored valid Sleep window
```

This preserves the distinction between:

```text
flexibility domain
```

and:

```text
actual derived foundational protection
```

---

## 24. Goal Feasibility Integration

Goal feasibility must consume Sleep-qualified Capacity.

A Goal may not be declared feasible using minutes protected by solved First-Class Sleep.

If Sleep makes a Goal's requested work no longer fit:

```text
Goal feasibility must reflect that reduced Capacity.
```

Do not alter Goal Demand itself.

Do not silently lower requested Goal effort.

Do not move Sleep to make the Goal feasible.

---

## 25. Goal Competition Integration

Competition must operate over the same Sleep-qualified Capacity.

Example:

```text
Capacity before Sleep: 4 hours
Sleep footprint removes: 2 hours
Goal A demand: 2 hours
Goal B demand: 2 hours
```

The engine must not conclude:

```text
both demands fit independently
```

using pre-Sleep Capacity.

Competition must see the same post-foundational Capacity surface used by feasibility.

Preserve existing priority semantics.

---

## 26. Allocation Integration

Allocation must not allocate Goal work into solved Sleep footprint.

It must also refuse to produce authoritative-looking allocation results from a:

```text
nonAllocatable
```

foundational planning state.

Do not translate:

```text
nonAllocatable
```

into:

```text
zero allocation because user has no time
```

unless existing architecture has an explicit unknown/incomplete allocation state.

If the existing allocation result cannot represent foundational incompleteness safely, extend it minimally.

Document the change.

---

## 27. Proposal Integration

Proposal derivation must use the same Sleep-qualified planning state.

A Proposal must not:

```text
overlap solved Sleep
```

or be derived from:

```text
infeasible
searchIncomplete
contextIncomplete
invalid
protected
```

Sleep state.

If foundational planning is nonAllocatable, Proposal derivation must expose an explicit blocked/incomplete result rather than fabricate an empty “nothing to propose” state.

Preserve the distinction:

```text
no Proposal because no demand/opportunity
```

versus:

```text
Proposal cannot safely be derived
```

---

## 28. Accepted Allocation Preservation

Existing Accepted Allocations are authority and must not be silently deleted because a newly authored Sleep requirement changes future planning.

If an Accepted Allocation is unrealized and its expected physical feasibility no longer matches the new Sleep-qualified planning state:

```text
retain the Accepted Allocation as evidence
```

and expose an appropriate:

```text
reviewRequired
stale
ineligible for realization
```

state through the existing architecture.

Do not silently cancel it.

Do not silently move Sleep.

Do not silently rewrite the accepted intent.

---

## 29. Realization Eligibility

Realization must not create new Goal schedule ownership that overlaps currently solved First-Class Sleep.

This is the one accepted-authority boundary that Task 9.13 must inspect carefully.

Task 9.10 established:

> Accepted unrealized allocation remains evidence/liability if Sleep changes; realization eligibility becomes reviewRequired on mismatch.

Implement the minimum necessary guard so that:

```text
accepted allocation
+
changed Sleep foundation
```

cannot create a new realized physical fact overlapping required Sleep.

Do not redesign Accepted Allocation.

Do not create corrective Sleep authority.

Do not delete existing realized facts.

---

## 30. Existing Realized Facts Remain Hard

Existing realized:

```text
Goal work
support activity
protected buffer
```

already constrain Sleep feasibility.

If newly authored Sleep conflicts with those facts:

```text
SleepResolution → infeasible
```

may result.

Task 9.13 must then fail downstream planning closed.

Do not:

```text
move realized facts
delete realized facts
replace realized facts
```

to satisfy Sleep.

---

## 31. Planning Scope and Sleep Resolution Scope

A planning query must resolve enough Sleep context to safely cover the physical scope used by:

```text
Commitment placement
Capacity
Goal planning
```

Do not solve Sleep for:

```text
Monday only
```

then allocate a cross-boundary block using Tuesday physical time that was never included in the Sleep problem.

Trace the actual physical reach of downstream planning and establish a canonical scope relationship.

The RESULT must document:

```text
planning owner scope
Sleep owner scope
Sleep guard scope
physical context scope
```

---

## 32. Cross-Boundary Capacity

Sleep may physically occupy time outside its owner day.

Capacity must subtract the physical interval from whichever Capacity interval physically intersects it.

Do not subtract solely by:

```text
Sleep ownerDay
```

Example:

```text
Sleep owned by Monday
physically continues into Tuesday
```

Tuesday physical Capacity must not include the overlapping interval merely because Monday owns the Sleep occurrence.

Ownership and physical exclusion remain distinct.

---

## 33. Cross-Boundary Commitment Placement

Likewise, ordinary movable Commitment placement must respect physical Sleep footprint regardless of owner labels.

A Tuesday-owned movable Commitment cannot overlap the physical tail of Monday-owned Sleep.

Do not compare only canonical owner dates.

Use physical intervals.

---

## 34. Boundary / Cycle Changes

If a Day Boundary or Work cycle edit changes the solved Sleep geometry:

```text
downstream planning must recompute from the new foundation
```

Do not preserve stale old Sleep occupancy because its occurrence reference remained the same.

Identity stability does not imply geometry stability.

This distinction must be tested.

---

## 35. No Sleep Re-Optimization for Goal Benefit

Task 9.12's deterministic solver selects the Sleep witness according to its own canonical ranking.

Task 9.13 must consume that witness.

Do not rerun or alter Sleep placement to improve:

```text
Goal feasibility
Commitment preference
Capacity total
Proposal attractiveness
```

That would create a hidden feedback loop.

The dependency is:

```text
Sleep solution
→ planning
```

not:

```text
planning preferences
→ Sleep solution
```

---

## 36. No Sleep Re-Optimization for Commitment Benefit

Likewise, ordinary Commitment placement must not ask the Sleep solver for:

```text
a different but still feasible Sleep solution
```

because it would make a Commitment fit better.

Task 9.13 consumes the deterministic canonical Sleep witness as resolved.

Later corrective-authority work may allow explicit accepted changes.

Not here.

---

## 37. Planning Coverage Semantics

If Sleep resolution is:

```text
contextIncomplete
```

the corresponding planning coverage must not remain:

```text
complete
```

merely because Work/Commitment data is otherwise complete.

Integrate foundational Sleep qualification into planning coverage/readiness semantics where necessary.

Do not erase the underlying reason.

Prefer typed provenance such as:

```text
sleepContextIncomplete
sleepSearchIncomplete
sleepInfeasible
sleepAuthorityProtected
```

or equivalent canonical representation.

---

## 38. Capacity Read Model

The Capacity read model must expose enough information to distinguish:

```text
complete allocatable Capacity
```

from:

```text
nonAllocatable because foundational Sleep is unresolved
```

and:

```text
valid zero Capacity
```

Do not require UI consumers to infer this from:

```text
availableMinutes === 0
```

The exact public type may follow repository conventions.

---

## 39. Goal Feasibility Read Model

Likewise, Goal feasibility must distinguish:

```text
infeasible because known Capacity is insufficient
```

from:

```text
cannot safely evaluate because foundational planning is nonAllocatable
```

These are different claims.

Do not tell downstream consumers:

```text
Goal cannot fit
```

when the truth is:

```text
DayFrame cannot yet establish safe Capacity.
```

---

## 40. Proposal Read Model

Proposal derivation must distinguish:

```text
no constructive opportunity exists
```

from:

```text
constructive planning is blocked because foundational Sleep is unresolved.
```

Do not return a normal empty Proposal collection for both.

This distinction will later support useful Planner explanations.

---

## 41. Preview Integration Boundary

Task 9.13 may need ordinary movable Commitment placement to respect Sleep.

If current ordinary placement is only exercised through Preview generation, refactor the minimum reusable semantic owner necessary so:

```text
Sleep-qualified ordinary placement
```

is not conceptually owned by Preview.

Preview may consume the shared result.

Preview must remain:

```text
Derived
Disposable
Non-authoritative
```

Do not make:

```text
Preview generation
```

a prerequisite for:

```text
Capacity
Goal feasibility
Proposal
```

if it is not already canonical architecture.

---

## 42. Preview Representation

If First-Class Sleep becomes visible in Preview as a necessary consequence of shared placement integration, do not let it masquerade as an ordinary legacy Sleep Commitment.

Prefer a distinct derived source/type/provenance.

However, **visual/UI redesign is not part of 9.13**.

If no representation is required to achieve the planning integration safely, defer it.

The RESULT must state whether Preview now contains First-Class Sleep geometry and why.

---

## 43. No General Friction Yet

Do not map:

```text
SleepResolutionV1.status === 'infeasible'
```

into general:

```text
Friction
```

during Task 9.13.

Instead:

```text
foundational planning qualification
→ nonAllocatable
```

The later Sleep Friction task will create the corrective user-facing semantics.

Do not add Suggested Fix.

---

## 44. No Sleep Corrective Decision Yet

Do not implement:

```text
Move Sleep
Pin Sleep
Revoke Sleep placement
Omit Sleep
Shorten Sleep
Reduce Sleep protection
Sleep override
```

Task 9.13 is strictly:

```text
planning obeys current Sleep solution
```

not:

```text
planning changes Sleep solution
```

---

## 45. No Publication Yet

Do not add First-Class Sleep to:

```text
HistoricalPlan
publication batches
publication context
publication seam validation
Today published-plan truth
```

Task 9.13 may make publication eligibility indirectly observe planning incompleteness only if existing publication readiness already consumes the affected planning qualification.

Do not create Sleep publication snapshots yet.

If publication behavior would change, document exactly why and keep the change minimal.

---

## 46. No Sleep Execution Yet

Do not add:

```text
Sleep execution subject
actual Sleep start
actual Sleep duration
skipped Sleep
unplanned Sleep
```

Those remain deferred.

Do not infer execution from solved Sleep.

Solved Sleep is a planning result, not an actual outcome.

---

## 47. No Progress Integration

Sleep must not create Goal Progress.

Sleep buffers must not create Goal Progress.

No duration-to-Progress rule is authorized.

---

## 48. No Legacy Conversion Yet

Do not implement:

```text
LegacySleepConversionV1
```

Do not automatically retire legacy Sleep.

Do not hide coexistence.

Conversion remains a later explicit migration/product task.

---

## 49. Foundational Occupancy Reuse

Task 9.12 extended the shared physical occupancy owner with:

```text
PhysicalAuthorityV1
FoundationalOccupancyV1
constrainsFoundationalFeasibility
```

Inspect whether these types can safely carry solved Sleep protection downstream.

Prefer extending the existing semantic owner over creating:

```text
sleepCapacityOccupancy.ts
sleepCommitmentOccupancy.ts
sleepGoalOccupancy.ts
```

with duplicate rules.

One physical geometry should have one semantic owner.

---

## 50. Required Planning-Qualification Tests

At minimum prove:

```text
notConfigured
→ planning remains allocatable under existing rules
```

```text
notApplicable
→ validated empty Sleep obligation does not block planning
```

```text
satisfied
→ planning allocatable using solved Sleep exclusion
```

```text
infeasible
→ planning nonAllocatable
```

```text
searchIncomplete
→ planning nonAllocatable
```

```text
contextIncomplete
→ planning nonAllocatable
```

```text
invalid
→ planning nonAllocatable
```

```text
protected
→ planning nonAllocatable
```

Do not encode unresolved states as zero Capacity.

---

## 51. Required Capacity Tests

At minimum:

### Simple subtraction

```text
physical opening: 8 hours
solved Sleep footprint: 2 hours
expected allocatable Capacity: 6 hours
```

subject to existing Capacity semantics.

### Overlap union

```text
existing hard exclusion overlaps Sleep footprint
```

Expected:

```text
physical union subtraction
```

not double subtraction.

### Cross-owner Sleep

Sleep owned by one user-day physically intersects another Capacity interval.

Expected:

```text
physical intersection excluded.
```

### Buffers

Both Sleep buffers reduce Capacity as protected time.

### Unconfigured

No First-Class Sleep requirement:

```text
existing Capacity unchanged.
```

### unresolved

No normal allocatable Capacity result may be fabricated.

---

## 52. Required Ordinary Commitment Tests

At minimum:

### Sleep displaces flexible Commitment

A movable Commitment initially prefers an interval occupied by solved Sleep.

Expected:

```text
Commitment moves to another legal opening.
```

### Sleep makes flexible Commitment unplaceable

No alternate opening exists.

Expected:

```text
ordinary existing unplaced semantics.
```

Sleep remains unchanged.

### Fixed Commitment conflict

Fixed Commitment prevents required Sleep.

Expected:

```text
Sleep infeasible
planning nonAllocatable
```

not movement of fixed authority.

### Cross-owner physical overlap

A movable Commitment with a different owner label must not overlap Sleep's physical tail/head.

### Legacy Sleep

Movable legacy Sleep behaves as ordinary Commitment around First-Class Sleep.

---

## 53. Required Goal Feasibility Tests

At minimum:

```text
Goal feasible before Sleep
Sleep reduces Capacity
Goal still feasible
```

and:

```text
Goal feasible before Sleep
Sleep reduces Capacity below demand
Goal becomes known infeasible
```

and:

```text
Sleep unresolved
Goal feasibility becomes unknown/blocked
```

not known infeasible.

Also prove Goal Demand does not influence the Sleep solution.

---

## 54. Required Competition Tests

Construct at least one case where:

```text
without Sleep:
Goal A + Goal B both fit

with Sleep:
combined demand exceeds Capacity
```

Expected:

```text
Competition uses post-Sleep Capacity.
```

Preserve existing priority semantics.

Sleep itself must not enter Goal Competition as a Goal/Demand competitor.

---

## 55. Required Allocation Tests

At minimum prove:

```text
Allocation cannot consume solved Sleep footprint.
```

and:

```text
nonAllocatable foundational state
→ no normal allocation derived.
```

and:

```text
known zero Capacity
≠
unknown/nonAllocatable Capacity.
```

Preserve accepted historical authority.

---

## 56. Required Proposal Tests

At minimum prove:

```text
Proposal geometry never overlaps solved Sleep.
```

```text
Proposal effort derives from post-Sleep Capacity.
```

```text
nonAllocatable foundational state
→ blocked/incomplete Proposal result.
```

```text
no demand/opportunity
→ ordinary empty/no-Proposal state.
```

These states must remain distinguishable.

---

## 57. Required Accepted-Allocation Tests

At minimum:

1. create a valid Accepted Allocation under one Sleep foundation;
2. change authored Sleep or Work so the foundational geometry changes;
3. preserve the Accepted Allocation record;
4. prove it is not silently deleted;
5. prove realization cannot blindly create overlapping physical ownership;
6. expose the existing or minimally extended review/stale/ineligible state.

Do not create a new accepted Sleep decision.

---

## 58. Required Realization Tests

At minimum:

### matching foundation

Accepted Allocation remains realizable when current Sleep-qualified dependencies still match.

### changed foundation

Sleep changes so proposed realization would overlap solved Sleep.

Expected:

```text
realization rejected / reviewRequired / stale
```

according to canonical architecture.

### existing realization

An already realized Goal fact remains intact even if later Sleep authoring makes the new foundation infeasible.

Expected:

```text
realized fact preserved
Sleep infeasible
new planning nonAllocatable
```

No historical rewrite.

---

## 59. Required Freshness Tests

At minimum:

```text
solve Sleep
change Sleep duration
→ downstream planning uses new solution
```

```text
solve Sleep
change Sleep window
→ downstream planning uses new solution
```

```text
solve Sleep
change Work
→ downstream planning uses new solution
```

```text
solve Sleep
change Day Boundary
→ downstream planning uses new geometry/context
```

```text
solve Sleep
change hard manual/fixed occupancy
→ downstream planning uses new solution
```

No stale geometry may remain foundational.

---

## 60. Required Boundary Tests

At minimum:

```text
boundary 00:00
boundary 03:00
boundary 12:00
```

with solved Sleep crossing the boundary.

Prove:

- physical Capacity exclusion is correct;
- ordinary Commitment placement respects physical overlap;
- owner labels do not incorrectly permit overlap;
- Goal planning uses the resulting Capacity.

---

## 61. Required Shift Tests

At minimum cover representative:

```text
Day
Evening
Night
```

Work patterns with First-Class Sleep.

Include:

```text
beforeWork
afterWork
clock
```

where appropriate.

Prove Sleep resolves first and ordinary planning adapts afterward.

---

## 62. Required Transition Tests

At minimum cover:

```text
Day → Evening
Evening → Night
Night → Day
Work → Off
Off → Work
```

using production cycle semantics.

Prove Capacity/Commitment/Goal planning consumes the current transition-specific Sleep solution.

Do not claim these tests explain historical dogfood incidents unless exact reproduction evidence exists.

---

## 63. Required Failure-State Tests

Force each applicable state:

```text
infeasible
searchIncomplete
contextIncomplete
invalid
protected
```

and prove downstream:

```text
Capacity
Goal feasibility
Allocation
Proposal
```

do not silently proceed as though Sleep were absent.

Where store-level protected authority is required, use production protection mechanisms rather than synthetic booleans if practical.

---

## 64. Required Non-Mutation Tests

Planning integration must not mutate:

```text
SleepRequirement revisions
Sleep source incarnation
SleepResolution persistence
accepted decisions
publication
execution
history
```

unless an explicit existing planning command is invoked for its normal non-Sleep purpose.

Pure planning queries remain pure.

---

## 65. Required Determinism Tests

Equivalent canonical inputs must produce equivalent:

```text
Sleep solution
ordinary Commitment placement
Capacity
Goal feasibility
Competition
Allocation
Proposal
```

regardless of:

```text
input insertion order
prior query calls
selected UI day
Preview cache
wall-clock time
```

where those factors are non-semantic.

---

## 66. Required Capacity Qualification Matrix

Include in the RESULT:

| Sleep Resolution | Foundational Planning | Capacity State | Goal Feasibility | Allocation | Proposal |
|---|---|---|---|---|---|
| notConfigured | | | | | |
| notApplicable | | | | | |
| satisfied | | | | | |
| infeasible | | | | | |
| searchIncomplete | | | | | |
| contextIncomplete | | | | | |
| invalid | | | | | |
| protected | | | | | |

Populate with actual implemented semantics.

---

## 67. Required Physical-Ownership Matrix

Include:

| Physical Source | Owns/Protects Time? | Capacity Exclusion? | Blocks Movable Commitment? | Goal Planning Effect | May 9.13 Move It? |
|---|---:|---:|---:|---|---:|
| Work | | | | | |
| Solved Sleep activity | | | | | |
| Sleep before-buffer | | | | | |
| Sleep after-buffer | | | | | |
| Fixed Commitment | | | | | |
| Movable Commitment | | | | | |
| Manual fixed Event | | | | | |
| Realized Goal work | | | | | |
| Support Activity | | | | | |
| Protected Buffer | | | | | |
| Goal Demand | | | | | |
| Proposal | | | | | |
| Accepted Allocation unrealized | | | | | |

---

## 68. Required Planning-Pipeline Matrix

Include:

| Stage | Input Foundation | Consumes Solved Sleep? | May Change Sleep? | Result if Sleep Unresolved |
|---|---|---:|---:|---|
| Sleep solver | | | | |
| Movable Commitment placement | | | | |
| Capacity | | | | |
| Goal feasibility | | | | |
| Competition | | | | |
| Allocation | | | | |
| Proposal | | | | |
| Acceptance | | | | |
| Realization eligibility | | | | |

---

## 69. Required Authority Matrix

Include:

| Object | Layer | Persisted? | Owns Time? | Can Constrain Sleep? | Can Sleep Constrain It? | 9.13 Mutation Allowed? |
|---|---|---:|---:|---:|---:|---:|
| SleepRequirementV1 | | | | | | |
| ScheduledSleepOccurrenceV1 | | | | | | |
| Work | | | | | | |
| Fixed Commitment | | | | | | |
| Movable Commitment | | | | | | |
| Goal Demand | | | | | | |
| Capacity | | | | | | |
| Allocation | | | | | | |
| Proposal | | | | | | |
| Accepted Allocation | | | | | | |
| Realized Goal work | | | | | | |

---

## 70. Required Coverage Matrix

Include:

| Planning Surface | Sleep Integrated in 9.13? | Exact Integration | Unknown-Sleep Behavior | Test Evidence |
|---|---:|---|---|---|
| ordinary placement | | | | |
| Preview | | | | |
| Capacity | | | | |
| Goal feasibility | | | | |
| Competition | | | | |
| Allocation | | | | |
| Proposal | | | | |
| Accepted Allocation | | | | |
| Realization eligibility | | | | |
| Friction | | | | |
| Publication | | | | |
| Today | | | | |
| Execution | | | | |
| Summary/history | | | | |

---

## 71. Required Behavioral Invariants

Task 9.13 must establish and test at least the following:

1. Sleep remains a dedicated authored source.
2. Solved Sleep remains derived.
3. Solved Sleep is not persisted as new authority.
4. Legacy Sleep remains a separate ordinary Commitment family.
5. No automatic legacy conversion occurs.
6. Sleep resolves before ordinary movable Commitment placement.
7. Ordinary movable Commitments cannot occupy solved Sleep footprint.
8. Ordinary movable Commitments cannot move Sleep.
9. Fixed/locked authority remains fixed.
10. Fixed/locked conflict can make Sleep infeasible.
11. Sleep activity excludes Capacity.
12. Sleep before-buffer excludes Capacity.
13. Sleep after-buffer excludes Capacity.
14. Capacity subtraction uses physical interval union.
15. Sleep valid window is not itself Capacity exclusion.
16. Only solved Sleep footprint is Capacity exclusion.
17. Cross-owner physical Sleep excludes intersecting Capacity.
18. Capacity remains demand-neutral.
19. Goal Demand cannot change Sleep placement.
20. Goal feasibility uses Sleep-qualified Capacity.
21. Goal Competition uses Sleep-qualified Capacity.
22. Allocation cannot consume Sleep footprint.
23. Proposal cannot overlap Sleep footprint.
24. Proposal cannot derive from unresolved foundational Sleep.
25. Known zero Capacity remains distinct from unknown/nonAllocatable Capacity.
26. Known Goal infeasibility remains distinct from foundational unknown.
27. No-demand/no-Proposal remains distinct from blocked Proposal derivation.
28. `notConfigured` does not invent Sleep.
29. `notApplicable` does not invent Sleep.
30. `infeasible` fails planning closed.
31. `searchIncomplete` fails planning closed.
32. `contextIncomplete` fails planning closed.
33. `invalid` fails planning closed.
34. `protected` fails planning closed.
35. Unknown Sleep time never becomes allocatable Capacity.
36. Stale Sleep geometry cannot constrain current planning.
37. Sleep requirement edits force current derivation.
38. Work edits force current derivation.
39. Day Boundary edits force current derivation.
40. hard occupancy edits force current derivation.
41. Accepted Allocations are not silently deleted after Sleep changes.
42. Unrealized Accepted Allocation may become reviewRequired/ineligible.
43. New realization cannot overlap current solved Sleep.
44. Existing realized Goal facts are not moved by Sleep.
45. Existing realized Goal facts are not deleted by Sleep.
46. Existing realized facts may make new Sleep infeasible.
47. Sleep infeasibility does not rewrite historical authority.
48. Sleep is not re-optimized for Goal benefit.
49. Sleep is not re-optimized for Commitment benefit.
50. Sleep is not re-optimized for Capacity maximization.
51. Sleep does not enter Goal Competition as demand.
52. Sleep does not create Goal Progress.
53. Sleep does not create general Friction yet.
54. Sleep does not create Suggested Fix yet.
55. No Sleep omission action exists.
56. No Sleep shortening action exists.
57. No Sleep override exists.
58. No accepted Sleep placement exists.
59. No published First-Class Sleep exists.
60. No First-Class Sleep execution exists.
61. Planning queries remain deterministic.
62. Pure planning queries do not mutate authority.
63. Physical ownership and canonical owner labels remain distinct.
64. Boundary crossing does not create free overlapping time.
65. Cycle transitions consume current Sleep geometry.
66. Preview does not become foundational authority.
67. One semantic owner supplies solved Sleep geometry downstream.
68. No duplicate Sleep reconstruction exists across Capacity/Goals/placement.
69. Existing non-Sleep authority ordering remains intact.
70. First-Class Sleep is now a real planning constraint without yet becoming corrective or historical authority.

---

## 72. Architecture Governance

Task 9.10 already establishes the normative dependency:

```text
Work / hard occupancy
→ Sleep
→ ordinary movable Commitments
→ Capacity
→ Goal planning
```

Task 9.13 should update governance only if implementation reveals a genuinely missing normative decision.

Do not create an ADR merely to restate Task 9.10.

If existing Capacity documentation still describes Sleep as an ordinary Commitment despite Task 9.11's amendment, make only the minimum consistency correction required.

Document all governance changes in the RESULT.

---

## 73. Persistence and Schema Rule

Task 9.13 should not require new persistence for Sleep planning integration.

Do not version:

```text
Active
Profiles
Backup
PlanDecision
Publication
Execution
```

merely to carry derived planning state.

If an existing persisted planning object must change to represent:

```text
nonAllocatable
reviewRequired
```

first determine whether that state should actually be derived rather than persisted.

Prefer derived qualification.

Any schema version change requires explicit justification in the RESULT.

---

## 74. Bundle Constraint

Task 9.12 finished with reported initial gzip:

```text
166,973 bytes
```

against hard limit:

```text
170,000 bytes
```

Do not weaken the limit.

Preserve lazy-loading boundaries where practical.

Avoid importing the complete Sleep solver into the initial application bundle merely because Capacity or Goal planning now consumes it.

If integration requires restructuring imports, preserve semantic ownership while minimizing startup-bundle growth.

Record:

```text
before
after
hard limit
remaining headroom
```

in the RESULT.

---

## 75. Prohibited Changes

Do **not**:

- redesign `SleepRequirementV1`;
- create `SleepRequirementV2`;
- change Sleep occurrence identity;
- create a second Sleep solver;
- reconstruct Sleep separately in Capacity;
- reconstruct Sleep separately in Goal planning;
- reconstruct Sleep separately in Commitment placement;
- infer Sleep from legacy templates;
- automatically convert legacy Sleep;
- automatically retire legacy Sleep;
- create hidden BlockTemplates for First-Class Sleep;
- persist solved Sleep as authored authority;
- persist derived Sleep merely for caching convenience;
- move Sleep to improve Goal feasibility;
- move Sleep to improve Commitment placement;
- move Sleep to maximize Capacity;
- let Goal Demand influence Sleep;
- let Proposal influence Sleep;
- let unrealized Allocation own physical time;
- silently delete Accepted Allocations;
- silently move realized Goal work;
- silently delete realized Goal work;
- encode unknown Capacity as ordinary zero Capacity;
- encode blocked Goal feasibility as known infeasible;
- encode blocked Proposal derivation as ordinary no-Proposal;
- create general Sleep Friction;
- create Sleep Suggested Fix;
- create accepted Sleep placement;
- add Omit Sleep;
- shorten Sleep;
- reduce Sleep buffers;
- add Sleep override;
- publish First-Class Sleep;
- execute First-Class Sleep;
- credit Sleep as Goal Progress;
- redesign Planner;
- redesign Summary;
- redesign Today;
- implement legacy conversion;
- weaken bundle limits;
- add dependencies unless necessary and justified;
- commit;
- push.

---

## 76. Validation

Run the repository's standard validation.

At minimum:

```text
npm run format
npm run lint
npm run build
npm test
npm run check:bundle
git diff --check
```

Use actual repository scripts if names differ.

Also run focused suites covering:

```text
Sleep derivation
Sleep solver
Sleep foundational occupancy
ordinary Commitment placement
physical occupancy
Capacity
Goal feasibility
Competition
Allocation
Proposal
Accepted Allocation
Realization
Work-relative placement
Day Boundary
cycle transitions
legacy Sleep
publication regression
execution regression
```

Record exact commands and exact results.

Do not claim a command was run unless it was.

---

## 77. Repository Hygiene

Before implementation:

1. inspect `git status`;
2. record HEAD;
3. record pre-existing dirty state;
4. preserve all earlier Phase 9 work;
5. establish a baseline sufficient to separate Task 9.13 edits.

After implementation:

1. inspect `git status`;
2. inspect `git diff --stat`;
3. inspect relevant diffs;
4. compare against the captured baseline;
5. run `git diff --check`;
6. identify files that were already dirty before 9.13;
7. distinguish their 9.13 additions;
8. do not commit;
9. do not push.

---

## 78. Required RESULT Artifact

Create exactly one durable task-result artifact:

```text
PHASE_9_TASK_9_13_FIRST_CLASS_SLEEP_CAPACITY_PLANNING_INTEGRATION_V1_RESULT.md
```

Place it in the existing Phase 9 durable result-artifact folder.

The filename must contain:

```text
RESULT
```

No additional task report is authorized.

Governance artifacts are permitted only under Section 72.

---

## 79. Required RESULT Structure

The RESULT must contain these sections in this exact order:

```text
# Task 9.13 — First-Class Sleep Capacity & Planning Integration V1 RESULT

## 1. Executive Summary

## 2. Scope and Governing Architecture

## 3. Pre-Implementation Repository State

## 4. Current Planning Pipeline Trace

## 5. Task 9.12 Foundation Consumed

## 6. Canonical Planning Dependency Order

## 7. Foundational Planning Qualification

## 8. Sleep Resolution State Mapping

## 9. Solved Sleep Physical Geometry Adapter

## 10. Sleep Footprint Protection Semantics

## 11. Dependency Freshness

## 12. Planning Scope / Sleep Scope Relationship

## 13. Ordinary Movable Commitment Integration

## 14. Fixed / Locked Commitment Semantics

## 15. Legacy Sleep Coexistence

## 16. Capacity Integration

## 17. Capacity Coverage / Qualification Semantics

## 18. Cross-Boundary Capacity

## 19. Goal Feasibility Integration

## 20. Goal Competition Integration

## 21. Allocation Integration

## 22. Proposal Integration

## 23. Accepted Allocation Preservation

## 24. Realization Eligibility

## 25. Existing Realized Authority Preservation

## 26. Preview Integration Boundary

## 27. Planning Coverage Semantics

## 28. Failure-Closed Behavior

## 29. Determinism and Non-Mutation

## 30. Friction / Suggested Fix Non-Activation

## 31. Publication / Today Non-Activation

## 32. Execution / Progress / History Non-Activation

## 33. Capacity Qualification Matrix

## 34. Physical-Ownership Matrix

## 35. Planning-Pipeline Matrix

## 36. Authority Matrix

## 37. Coverage Matrix

## 38. Behavioral Invariants

## 39. Capacity Test Coverage

## 40. Commitment Placement Coverage

## 41. Goal Feasibility Coverage

## 42. Competition / Allocation Coverage

## 43. Proposal Coverage

## 44. Accepted Allocation / Realization Coverage

## 45. Freshness Coverage

## 46. Boundary / Shift / Transition Coverage

## 47. Failure-State Coverage

## 48. Legacy Regression Assessment

## 49. Performance Assessment

## 50. Bundle Assessment

## 51. Architecture Governance Assessment

## 52. Test Coverage

## 53. Validation Record

## 54. Changed Files

## 55. Deferred First-Class Sleep Work

## 56. Completion Assessment
```

---

## 80. Required Changed-Files Accounting

List every file changed by Task 9.13.

Classify each as:

```text
Planning Qualification
Sleep Adapter
Placement
Physical Occupancy
Capacity
Goal Feasibility
Competition
Allocation
Proposal
Accepted Allocation
Realization
Preview
Store / Query
Governance
Test
RESULT
```

For every file identify:

- purpose;
- semantic change;
- authority impact;
- persisted behavior impact;
- associated tests.

For files already dirty before Task 9.13, explicitly distinguish:

```text
pre-existing modification
```

from:

```text
Task 9.13 additional modification
```

---

## 81. Completion Criteria

Task 9.13 is complete only when every applicable criterion below is satisfied.

### Architecture

- [ ] Sleep resolves before ordinary movable planning.
- [ ] one canonical solved-Sleep geometry feeds downstream planning.
- [ ] no subsystem independently reconstructs Sleep.
- [ ] Sleep remains derived.
- [ ] solved Sleep is not persisted as new authority.
- [ ] planning cannot change Sleep.

### Planning qualification

- [ ] `notConfigured` is explicitly safe absence.
- [ ] `notApplicable` is explicitly safe non-applicability.
- [ ] `satisfied` permits Sleep-qualified planning.
- [ ] `infeasible` fails closed.
- [ ] `searchIncomplete` fails closed.
- [ ] `contextIncomplete` fails closed.
- [ ] `invalid` fails closed.
- [ ] `protected` fails closed.
- [ ] unresolved foundational state is not represented as ordinary zero Capacity.

### Sleep geometry

- [ ] Sleep activity is protected.
- [ ] before-buffer is protected.
- [ ] after-buffer is protected.
- [ ] authored valid window is not treated as owned time.
- [ ] only solved footprint constrains downstream planning.
- [ ] cross-owner physical overlap is respected.
- [ ] stale Sleep geometry cannot constrain current planning.

### Ordinary Commitments

- [ ] movable Commitments place around solved Sleep.
- [ ] movable Commitments may become unplaced.
- [ ] movable Commitments cannot move Sleep.
- [ ] fixed/locked authority remains fixed.
- [ ] fixed conflict may make Sleep infeasible.
- [ ] legacy movable Sleep remains ordinary movable content.
- [ ] legacy fixed Sleep remains fixed authority.
- [ ] no legacy conversion occurs.

### Capacity

- [ ] solved Sleep footprint excludes Capacity.
- [ ] buffers exclude Capacity.
- [ ] physical union prevents double subtraction.
- [ ] Capacity remains demand-neutral.
- [ ] Goal Demand does not subtract from Capacity.
- [ ] Proposal does not subtract from Capacity.
- [ ] unrealized Allocation does not own physical Capacity.
- [ ] known zero remains distinct from unknown/nonAllocatable.
- [ ] cross-boundary Sleep exclusion is correct.

### Goals

- [ ] Goal feasibility uses Sleep-qualified Capacity.
- [ ] known insufficiency remains distinct from foundational unknown.
- [ ] Goal Demand cannot change Sleep.
- [ ] Goal Competition uses Sleep-qualified Capacity.
- [ ] Sleep is not represented as Goal competition.
- [ ] Allocation cannot consume Sleep footprint.
- [ ] unresolved foundation cannot yield normal allocation.
- [ ] Proposal cannot overlap Sleep.
- [ ] unresolved foundation cannot yield normal Proposal.
- [ ] no-demand/no-opportunity remains distinct from blocked planning.

### Accepted authority

- [ ] Accepted Allocations survive Sleep changes.
- [ ] Accepted Allocations are not silently cancelled.
- [ ] stale/mismatched accepted intent is detectable.
- [ ] realization cannot create new overlap with current Sleep.
- [ ] existing realized Goal work is preserved.
- [ ] existing support/protection is preserved.
- [ ] existing realized authority may make Sleep infeasible.
- [ ] no historical rewrite occurs.

### Freshness

- [ ] Sleep edit changes downstream planning through fresh derivation.
- [ ] Work edit changes downstream planning through fresh derivation.
- [ ] Day Boundary edit changes downstream planning through fresh derivation.
- [ ] hard occupancy edit changes downstream planning through fresh derivation.
- [ ] occurrence identity stability does not cause stale geometry reuse.

### Non-activation

- [ ] no general Sleep Friction is created.
- [ ] no Sleep Suggested Fix is created.
- [ ] no accepted Sleep placement exists.
- [ ] no Sleep omission exists.
- [ ] no Sleep shortening exists.
- [ ] no Sleep override exists.
- [ ] no First-Class Sleep publication exists.
- [ ] no First-Class Sleep execution exists.
- [ ] no Sleep Progress exists.
- [ ] no legacy conversion exists.

### Regression

- [ ] existing Work behavior remains intact.
- [ ] existing non-Sleep Commitment behavior remains intact except lawful Sleep exclusion.
- [ ] legacy Sleep behavior remains intact.
- [ ] existing accepted decisions remain intact.
- [ ] existing publication behavior remains intact except any explicitly documented readiness consequence.
- [ ] existing execution/history behavior remains intact.
- [ ] Preview remains derived/non-authoritative.

### Validation

- [ ] focused Sleep integration tests pass.
- [ ] Capacity tests pass.
- [ ] Commitment placement tests pass.
- [ ] Goal feasibility tests pass.
- [ ] Competition tests pass.
- [ ] Allocation tests pass.
- [ ] Proposal tests pass.
- [ ] Accepted Allocation tests pass.
- [ ] Realization tests pass.
- [ ] freshness tests pass.
- [ ] boundary tests pass.
- [ ] shift tests pass.
- [ ] transition tests pass.
- [ ] failure-state tests pass.
- [ ] legacy regression tests pass.
- [ ] full suite passes.
- [ ] formatting passes.
- [ ] lint passes.
- [ ] build/typecheck passes.
- [ ] bundle hard limit passes without threshold weakening.
- [ ] `git diff --check` passes.
- [ ] no commit was created.
- [ ] no push occurred.

### Documentation

- [ ] RESULT exists with required filename.
- [ ] all required matrices are complete.
- [ ] planning dependency order is documented.
- [ ] failure-closed semantics are documented.
- [ ] Capacity qualification is documented.
- [ ] accepted-authority behavior is documented.
- [ ] bundle before/after/headroom is documented.
- [ ] changed-files accounting is complete.
- [ ] deferred work is explicit.

---

## 82. Final Completion Statement

If and only if all required completion criteria are satisfied, end the RESULT with exactly:

```text
Task 9.13 — First-Class Sleep Capacity & Planning Integration V1 is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.13 — First-Class Sleep Capacity & Planning Integration V1 is INCOMPLETE.
```

Then immediately identify the exact unresolved implementation or evidence blockers.

Do not mark Task 9.13 complete merely because Capacity decreases in one Sleep fixture.

Completion requires proof that:

```text
resolved Sleep
```

has become a consistent foundational planning constraint across:

```text
ordinary movable Commitment placement
Capacity
Goal feasibility
Competition
Allocation
Proposal
realization eligibility
```

while unresolved Sleep fails safely and downstream planning still has no authority to alter Sleep.

---

## 83. Governing Principle

Tasks 9.10–9.12 established:

```text
what Sleep is
what Sleep the user requires
where that Sleep can physically exist
whether the requirement can be satisfied
```

Task 9.13 must establish:

```text
the rest of DayFrame must now respect that answer.
```

When Sleep is solved:

```text
protect the solved footprint
and plan around it.
```

When Sleep is unresolved:

```text
do not call the uncertain remainder Capacity.
```

When ordinary planning would prefer something else:

```text
ordinary planning adapts.
Sleep does not.
```

That is the boundary of Task 9.13.

Corrective authority comes later.