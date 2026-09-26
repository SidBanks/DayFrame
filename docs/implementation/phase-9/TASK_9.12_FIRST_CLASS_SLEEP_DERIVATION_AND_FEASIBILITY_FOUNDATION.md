# Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Foundational implementation / derived occurrence / physical-context / deterministic feasibility solver  
**Primary Specification:** Task 9.10 — First-Class Sleep Architecture Specification  
**Prerequisite:** Task 9.11 — First-Class Sleep Domain & Persistence Foundation — COMPLETE  
**Implementation Changes:** **AUTHORIZED WITHIN THIS TASK'S BOUNDED SCOPE**  
**Capacity / Goal / Publication / Execution Integration:** **PROHIBITED**  
**UI Redesign:** **PROHIBITED**  
**Required Durable Output:** `PHASE_9_TASK_9_12_FIRST_CLASS_SLEEP_DERIVATION_FEASIBILITY_FOUNDATION_RESULT.md`

---

## 1. Objective

Implement the **Derived-layer foundation** for First-Class Sleep V1.

Task 9.10 established the architecture.

Task 9.11 established durable authored authority:

```text
SleepRequirementV1
+
revision semantics
+
source incarnation
+
owner-day durable occurrence identity
+
Active V3
+
Profiles V3
+
Backup V13
+
restore / clear / protection
```

Task 9.12 must now answer, deterministically:

> **Given valid authored Sleep requirements, canonical DayFrame temporal context, and foundational Work geometry, what required Sleep occurrences exist, what physical intervals can satisfy them, and is the bounded Sleep system satisfiable?**

The task must implement:

```text
effective authored Sleep
        ↓
required Sleep occurrence derivation
        ↓
physical Sleep context / candidate geometry
        ↓
bounded joint feasibility solving
        ↓
deterministic Sleep resolution
```

The canonical outcome must distinguish at least:

```text
notConfigured
notApplicable
satisfied
infeasible
searchIncomplete
```

as semantically appropriate.

Task 9.12 must **not yet make downstream planning obey the result**.

At completion:

```text
DayFrame can determine required Sleep geometry
and establish whether that bounded Sleep system is satisfiable.
```

But it must **not yet claim**:

```text
Capacity has been reduced by Sleep.
Ordinary Commitments have been moved around Sleep.
Goal feasibility includes Sleep.
Publication includes First-Class Sleep.
Execution can report First-Class Sleep.
```

Those belong to later tasks.

---

## 2. Governing Architecture

Preserve DayFrame's authority chain:

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

Task 9.12 operates at:

```text
Authored
  ↓
Derived
```

It may read existing foundational physical truth necessary to derive Sleep.

It must not create:

```text
Accepted
Published
Execution
Historical
```

Sleep authority.

---

## 3. Governing First-Class Sleep Principle

The architecture established in Task 9.10 is:

> **Sleep is a first-class biological time requirement and must not be modeled merely as an ordinary flexible Commitment. Sleep participates in establishing schedulable Capacity alongside Work and other hard temporal constraints. A valid Sleep requirement must be realized whenever the authored temporal system is feasible. DayFrame boundaries, civil-date boundaries, cycle transitions, planning-window boundaries, and ordinary competing activities must not independently make Sleep unplaceable. When the authored system cannot satisfy the Sleep requirement, DayFrame must report the underlying feasibility conflict rather than treating Sleep as an unsuccessfully placed optional block.**

Task 9.12 implements the derivation and feasibility portion of that principle.

---

## 4. Governing 9.11 Foundation

Do not redesign the 9.11 foundation.

Task 9.11 established:

```text
SleepRequirementV1
SleepWindowIntentV1
SleepRequirementPatternV1
SleepRequirementIntentV1
SleepOccurrenceReferenceV1
queryEffectiveSleepRequirement(...)
```

along with:

```text
source lifetime
revision history
owner-day + slot identity
Active V3
Profiles V3
Backup V13
```

Task 9.12 must consume those canonical owners.

Do not:

```text
create SleepRequirementV2
replace owner-day identity
move Sleep into BlockTemplate
create a parallel persistence owner
reinterpret legacy Sleep Commitments
```

unless a genuine contradiction with Task 9.10 is discovered.

If such a contradiction exists, stop and report it rather than silently revising the architecture during implementation.

---

## 5. Task Boundary

The authorized dependency chain is:

```text
effective Sleep requirement
→ owner-day occurrence derivation
→ Work / temporal context resolution
→ valid physical Sleep windows
→ complete bounded joint solver
→ deterministic Sleep resolution
→ pure/queryable derived result
```

Stop there.

The following remain outside Task 9.12:

```text
ordinary Commitment reordering around Sleep
Capacity subtraction
Goal feasibility changes
Goal Competition changes
Allocation changes
Proposal changes
Accepted Allocation changes
Realization changes
general Friction integration
Suggested Fix integration
Sleep omission decisions
Sleep shortening decisions
publication
Today
execution
Progress
Summary/history
Planner authoring UX
legacy conversion
```

---

## 6. Required Pre-Implementation Trace

Before changing code, trace the current implementation owners for:

### Sleep foundation

```text
core/sleep/sleepRequirement.ts
core/occurrences/sleepOccurrenceReference.ts
core/occurrences/occurrenceIdentity.ts
core/occurrences/durableOccurrenceReference.ts
state/activeV3.ts
state/dayFrameStore.ts
```

### Canonical time

Trace:

- canonical user-day calculation;
- Day Boundary resolution;
- effective per-cycle/per-segment boundary overrides;
- local-date application;
- civil-midnight crossing;
- planning-window expansion;
- overlapping user-day calculations;
- Work cycle/segment context;
- effective week-start where relevant.

### Work

Trace:

- shift definitions;
- shift cycles;
- manual segments;
- repeating sequences;
- Work occurrence generation;
- Work source incarnation;
- physical Work geometry;
- transition behavior;
- off-day determination.

### Existing placement primitives

Inspect, but do not automatically reuse:

- opening/free-window calculation;
- physical occupancy;
- candidate windows;
- beforeWork;
- afterWork;
- custom-window handling;
- buffers;
- placement ordering;
- corrective movement.

Task 9.9 established that some of these primitives are now safe for ordinary placement.

Task 9.12 must still determine whether they are semantically appropriate for a **complete bounded Sleep feasibility solver**.

### Tests

Locate existing coverage for:

- Day Boundary;
- Work transitions;
- beforeWork;
- afterWork;
- overnight windows;
- off days;
- physical occupancy;
- deterministic generation;
- planning-range edges.

Record the trace in the RESULT.

---

## 7. No Legacy Sleep Derivation

First-Class Sleep derivation must consume only:

```text
SleepRequirementV1
```

It must not derive First-Class Sleep from:

```text
BlockTemplate.category === 'sleep'
BlockTemplate.title === 'Sleep'
id === 'default_sleep'
legacy recurrence
legacy placement preference
```

Legacy Sleep remains on its existing path.

During Task 9.12 both systems may therefore produce conceptually Sleep-related information, but only:

```text
SleepRequirementV1
```

feeds the new First-Class Sleep derivation/feasibility system.

Do not merge the two.

---

## 8. Canonical Required Sleep Occurrence

Implement the derived semantic object representing:

> **One required Sleep obligation owned by one canonical DayFrame user-day.**

Use the Task 9.10 conceptual model and repository conventions.

The expected semantic shape is equivalent to:

```ts
type SleepOccurrenceV1 = {
  version: 1;

  reference: SleepOccurrenceReferenceV1;

  requirementRevision: number;

  ownerDay: LocalDateString;

  durationMinutes: number;

  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;

  windowIntent: SleepWindowIntentV1;

  derivationContext: SleepDerivationContextV1;
};
```

This is illustrative.

Use exact repository types/naming where appropriate.

The occurrence must be:

```text
Derived
Disposable
Deterministic
Not Persisted as Authored Authority
Not Published
Not Execution
```

---

## 9. Occurrence Identity Invariant

Task 9.11 established:

```text
source lifetime
+
owner day
+
slot 0
```

as Sleep occurrence identity.

Task 9.12 must preserve it.

Therefore changes in:

```text
requirement revision
duration
window
Work anchor
cycle
segment
Day Boundary
physical start
physical end
buffers
```

may change the derived occurrence's provenance or geometry but must not change its durable occurrence reference for the same:

```text
source lifetime + owner day + slot
```

Do not derive identity from the chosen interval.

---

## 10. Canonical Owner-Day Derivation

Define and implement exactly when a Sleep occurrence exists for an owner day.

Use:

```text
queryEffectiveSleepRequirement(ownerDay)
```

as the authored applicability owner.

At minimum:

```text
notConfigured
→ no required occurrence

disabled
→ no required occurrence

notApplicable
→ no required occurrence

effective
→ exactly one V1 required occurrence for that owner day
```

V1 uses:

```text
slot: 0
```

There must not be two First-Class Sleep occurrences for the same:

```text
source lifetime + owner day
```

---

## 11. Canonical Physical Ownership Versus Geometry

Preserve the distinction:

```text
canonical owner day
≠
civil start date
≠
civil end date
≠
physical containment boundary
```

A Sleep occurrence may:

- begin before its owner's civil midnight;
- end after its owner's civil midnight;
- cross the owner's Day Boundary;
- physically overlap another canonical user-day;
- cross a Work/cycle transition.

None of these alone changes occurrence ownership.

The owner-day identity remains the authored applicability coordinate established by Task 9.11.

---

## 12. Sleep Derivation Context

Implement an explicit derived context sufficient to explain why a Sleep occurrence has the physical constraints it has.

At minimum determine whether context must capture:

```text
owner day
effective requirement revision
effective Day Boundary
Work occurrence(s)
Work anchor
cycle
segment
off-day state
physical search interval
window provenance
```

Do not place unnecessary fields into identity.

The context is:

```text
Derived provenance
```

not:

```text
Authored authority
```

It must be sufficient for deterministic replay/explanation of the derived result.

---

## 13. Clock-Window Derivation

For:

```text
window.kind === 'clock'
```

derive the valid physical Sleep window deterministically.

Required semantics:

### Unequal endpoints

Example:

```text
22:00 → 08:00
```

is an explicitly overnight physical window.

Do not clip it at:

```text
civil midnight
Day Boundary
owner-day boundary
view boundary
```

merely because the interval crosses one.

### Equal endpoints

Task 9.10/9.11 established:

```text
startClock === endClock
```

as a valid full-civil-day window.

Implement the physical meaning explicitly.

Do not reinterpret it as a zero-minute window.

### Preferred start

If:

```text
preferredStartClock
```

exists, it affects deterministic preference/ranking among feasible placements.

It must not reduce the valid window unless the specification explicitly requires that.

---

## 14. Work-Relative Derivation

For:

```text
beforeWork
afterWork
```

derive physical Sleep constraints from actual Work geometry.

Do not derive from:

```text
shift label
nominal shift name
calendar-day assumption
```

Use the canonical Work occurrence/context.

### beforeWork

The anchor must be the actual relevant Work start.

### afterWork

The anchor must be the actual relevant Work end.

### Off day

If no applicable Work anchor exists for the required occurrence:

```text
use the explicit authored offDay fallback
```

Do not invent a Work anchor.

Do not silently skip Sleep.

---

## 15. Work Anchor Selection

This requires an explicit deterministic rule.

A Sleep owner day may exist near:

- previous Work;
- following Work;
- overnight Work;
- cycle transition;
- segment transition;
- off day.

Task 9.12 must define which Work occurrence anchors:

```text
beforeWork
```

and which anchors:

```text
afterWork
```

for a given owner day.

The rule must not depend on:

```text
array insertion order
UI grouping
calendar rendering
current selected day
```

Use canonical Work identity and temporal context.

Document the rule in the RESULT.

---

## 16. Cycle / Segment Transition Semantics

Explicitly test and define derivation across:

```text
Day → Evening
Evening → Night
Night → Day
Work → Off
Off → Work
manual segment → manual segment
repeating-sequence transition
effective Day Boundary override transition
week-start override transition where relevant
```

The original dogfood October incidents remain historical observations unless exact reproduction evidence exists.

Do not claim Task 9.12 explains them merely because transition tests pass.

---

## 17. Physical Search Domain

For each required occurrence, derive a bounded physical search domain.

The search domain must be large enough to represent all legal geometry implied by:

```text
clock window
beforeWork span
afterWork span
off-day fallback
duration
buffers
boundary crossing
```

Do not constrain search merely to the owner's canonical DayFrame interval.

Do not make the search domain unbounded.

The RESULT must explain the exact bound and why it is complete for V1.

---

## 18. Sleep Footprint

The physical Sleep requirement includes:

```text
bufferBefore
+
Sleep activity
+
bufferAfter
```

The solver must reason about the complete footprint.

Preserve:

```text
Sleep activity
≠
protected buffer
```

The buffers protect the required Sleep footprint but are not themselves Sleep execution.

A solution must not place:

```text
Sleep activity clear of Work
```

while allowing its required buffer to overlap Work if that buffer is defined as protected.

---

## 19. Foundational Blocking Geometry

Task 9.12 must define the exact occupancy that constrains Sleep feasibility.

At minimum evaluate:

```text
Work
locked Commitments
fixed Commitments
manual/fixed Events
explicitly accepted authoritative geometry
realized Goal work
support activities
protected buffers
```

Use Task 9.10's authority matrix.

The central rule is:

> **Only geometry with sufficient existing authority may constrain required Sleep during foundational feasibility.**

Ordinary movable Commitment geometry must not prove Sleep infeasible merely because it happened to be placed there by the legacy scheduler.

Goal Proposal must not constrain Sleep.

Unaccepted Allocation must not constrain Sleep.

Preview-only geometry must not constrain Sleep.

---

## 20. Required Blocking-Authority Classification

Implement or reuse a canonical classification that distinguishes:

```text
foundational / locked physical occupancy
```

from:

```text
movable derived occupancy
```

Do not create a Sleep-only duplicate occupancy system if Task 9.9 already established a reusable physical-occupancy semantic owner.

However, do not blindly feed every currently scheduled block into the Sleep solver.

The RESULT must provide a matrix:

| Existing Geometry | Constrains Sleep Feasibility in 9.12? | Why | Canonical Owner |
|---|---:|---|---|
| Work | | | |
| Locked Commitment | | | |
| Flexible Commitment | | | |
| Manual fixed Event | | | |
| Goal Proposal | | | |
| Accepted Allocation without realization | | | |
| Realized Goal work | | | |
| Support Activity | | | |
| Protected Buffer | | | |
| Preview-only placement | | | |

---

## 21. Feasibility Is Not Greedy Placement

This is a critical invariant.

Task 9.10 requires a **complete bounded joint Sleep solver**.

The solver must not conclude:

```text
infeasible
```

merely because:

```text
first candidate failed
greedy earliest placement failed
greedy preferred placement failed
owner-day-by-owner-day placement painted itself into a corner
```

For the bounded V1 domain:

> **`infeasible` means the solver has established that no valid assignment exists within the complete defined search space.**

If the implementation cannot complete that proof within its explicit search budget:

```text
searchIncomplete
```

must be returned.

Never convert:

```text
searchIncomplete
```

into:

```text
infeasible
```

or:

```text
satisfied
```

---

## 22. Joint Sleep Solving

The solver must consider interacting Sleep occurrences jointly when their legal physical domains overlap.

Example:

```text
Sleep occurrence A
valid in a broad interval

Sleep occurrence B
valid in a narrower overlapping interval
```

A greedy placement for A may make B impossible even though another valid assignment exists.

The solver must be capable of finding the valid joint assignment.

Do not assume Sleep occurrences can always be solved independently.

---

## 23. Sleep-to-Sleep Physical Conflict

Define whether two First-Class Sleep occurrences may physically overlap.

For V1, the expected invariant is:

```text
one person cannot satisfy two distinct required Sleep occurrences
through overlapping duplicate physical Sleep geometry
unless the architecture explicitly defines one interval as satisfying both
```

Task 9.10 selected one occurrence per owner day but did not authorize silent requirement coalescing.

Therefore Task 9.12 must explicitly determine whether:

```text
overlap is prohibited
```

or whether a canonical coalescing rule already exists.

Do not invent implicit double-credit.

If no coalescing architecture exists, treat Sleep occurrences as mutually exclusive physical activities.

Document this decision.

---

## 24. Search Granularity

Define the canonical V1 temporal search granularity.

Do not leave this implicit in loop increments.

The granularity must be:

- deterministic;
- compatible with existing DayFrame time precision;
- sufficiently precise for authored clock inputs;
- bounded enough for practical solving.

If existing DayFrame scheduling operates at minute precision, prefer preserving minute semantics unless evidence supports a coarser canonical grid.

Do not silently round authored Sleep intent.

Document any normalization.

---

## 25. Deterministic Candidate Ordering

Candidate ordering may affect which valid solution is selected.

Define deterministic ordering using semantic fields.

Potential criteria may include:

```text
preferred-start distance
Work-relative preference
earliest legal physical start
owner day
stable occurrence reference
```

The exact ordering must be evidence-based.

Do not use:

```text
object insertion order
randomness
current time
generated UUID
unstable sort
```

as tie-breakers.

Equivalent inputs must produce equivalent output.

---

## 26. Preferred Versus Valid

The solver must distinguish:

```text
valid
```

from:

```text
preferred
```

A preferred start is not an additional hard constraint unless explicitly authored as one.

If the preferred placement is unavailable but another legal placement satisfies the requirement:

```text
the occurrence is satisfiable
```

The solver should choose the deterministic best valid placement according to the canonical ranking.

Do not report Friction solely because the preferred start could not be honored.

---

## 27. Solver Completeness Contract

The RESULT must define exactly what makes the V1 solver **complete** for a bounded query.

At minimum completeness requires:

1. every applicable required Sleep occurrence in scope is represented;
2. every legal physical candidate in the defined search domain is representable;
3. all authoritative blocking geometry is considered;
4. Sleep-to-Sleep conflicts are considered;
5. the search explores enough combinations to prove either:
   - a valid assignment exists; or
   - none exists;
6. if the search is terminated before proof:
   - result is `searchIncomplete`.

Do not use `infeasible` as a performance escape hatch.

---

## 28. Solver Search Budget

Implement an explicit deterministic search budget.

The budget may be expressed through:

```text
candidate count
search nodes
branch count
another deterministic complexity measure
```

Do not use wall-clock timeout as the sole semantic budget.

Wall-clock performance may be measured, but identical semantic inputs should not become:

```text
satisfied on one machine
searchIncomplete on another
```

merely because one CPU was slower.

The RESULT must state:

- budget unit;
- budget value/default;
- how exhaustion is detected;
- why it is deterministic;
- how callers can distinguish exhaustion from infeasibility.

---

## 29. Solver Result Model

Implement an explicit result union.

The canonical semantics should be equivalent to:

```ts
type SleepResolutionV1 =
  | {
      status: 'notConfigured';
      ...
    }
  | {
      status: 'satisfied';
      occurrences: ScheduledSleepOccurrenceV1[];
      ...
    }
  | {
      status: 'infeasible';
      conflicts: SleepFeasibilityConflictV1[];
      ...
    }
  | {
      status: 'searchIncomplete';
      ...
    };
```

If owner-day queries also expose:

```text
notApplicable
disabled
```

keep the distinction clear between:

```text
requirement applicability
```

and:

```text
bounded multi-occurrence resolution
```

Do not create ambiguous empty arrays that callers must interpret.

---

## 30. Scheduled Sleep Occurrence

Implement the derived solved geometry type.

Conceptually:

```ts
type ScheduledSleepOccurrenceV1 = {
  version: 1;
  reference: SleepOccurrenceReferenceV1;

  ownerDay: LocalDateString;

  sleepStart: InstantOrLocalDateTime;
  sleepEnd: InstantOrLocalDateTime;

  footprintStart: InstantOrLocalDateTime;
  footprintEnd: InstantOrLocalDateTime;

  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;

  requirementRevision: number;

  provenance: SleepPlacementProvenanceV1;
};
```

Adapt to existing DayFrame local-time/date representation.

Do not invent timezone semantics inconsistent with the rest of DayFrame.

The solved occurrence remains:

```text
Derived
Disposable
Not Published
Not Execution
```

---

## 31. Physical Interval Semantics

Use the repository's canonical interval convention.

If DayFrame uses:

```text
[start, end)
```

preserve it.

At minimum prove:

```text
Sleep ending exactly when Work starts
```

does not overlap Work.

Likewise:

```text
buffer ending exactly at Work start
```

is legal if the buffer interval itself ends there.

Avoid one-minute artificial gaps unless explicitly authored.

---

## 32. Day Boundary Independence

Task 9.9 already corrected custom overnight clipping.

Task 9.12 must make the stronger First-Class Sleep invariant explicit:

> **The canonical Day Boundary determines ownership/context; it is not a physical wall that Sleep must fit inside.**

Test at minimum:

```text
boundary 00:00
boundary 03:00
boundary 12:00
```

with Sleep physically crossing the boundary.

Equivalent physical Sleep requirements should not become infeasible merely because the user's canonical ownership boundary changes.

Ownership may change only according to the explicitly defined owner-day derivation rule.

---

## 33. Civil Midnight Independence

Test:

```text
22:00–06:00
23:00–07:00
00:00–08:00
```

or equivalent representative windows.

Crossing midnight is ordinary geometry.

Do not special-case midnight as an incompatibility.

---

## 34. Work Overlap Invariant

No `satisfied` Sleep solution may overlap Work through:

```text
Sleep activity
bufferBefore
bufferAfter
```

when Work is authoritative blocking geometry.

This must hold for:

```text
Day
Evening
Night
overnight Work
cycle transitions
manual segments
repeating sequence
```

Use actual Work geometry.

Do not use nominal shift names as proof.

---

## 35. Locked Commitment Interaction

Where existing architecture provides locked/fixed Commitment authority, include it as blocking geometry according to Task 9.10.

Required tests must establish:

```text
movable ordinary Commitment
→ does not prove Sleep infeasible

locked/fixed Commitment
→ may constrain Sleep feasibility
```

Do not move the locked Commitment in Task 9.12.

Do not move the flexible Commitment either.

Task 9.12 only determines foundational Sleep feasibility.

Later integration will reorder ordinary movable content.

---

## 36. Realized Goal Work Interaction

Realized Goal work owns time.

Where available in the query context, it must constrain Sleep feasibility.

Do not silently delete, move, or re-realize it.

If newly authored Sleep conflicts with existing realized Goal work and no alternate Sleep assignment exists:

```text
the derived result must expose the incompatibility
```

The later Friction task will determine corrective action.

Task 9.12 must not mutate Goal authority.

---

## 37. Support Activity and Protected Buffer Interaction

Real support activities own time.

Protected buffers protect time.

Both must constrain Sleep according to established authority.

Do not treat a protected buffer as executable activity.

Do not discard either merely to make Sleep satisfiable.

The solver's explanation/provenance should preserve which physical object blocked a candidate where practical.

---

## 38. Planning Horizon Expansion

A requested Sleep resolution range is an **ownership range**, not necessarily the complete physical interval needed to solve it.

For owner days:

```text
[startDay, endDayExclusive)
```

the solver may need physical context outside that range.

Examples:

```text
first occurrence begins before startDay's civil date
last occurrence ends after endDayExclusive's civil boundary
Work anchor lies outside requested owner range
```

Implement deterministic context expansion sufficient for V1.

Do not truncate Sleep at the requested owner range.

Document the exact expansion rule.

---

## 39. Work Context Outside Query Range

A `beforeWork` or `afterWork` occurrence near the query edge may require a Work anchor physically outside the requested owner-day range.

The derivation layer must request/derive enough Work context to resolve the anchor.

Do not incorrectly fall back to:

```text
offDay
```

merely because the Work occurrence lies outside the caller's narrow view.

This is particularly important for:

```text
overnight Work
cycle transitions
first/last owner day
```

---

## 40. Query API

Implement a canonical pure/domain query equivalent to:

```text
resolveRequiredSleep({
  authoredState,
  ownerRange,
  foundationalOccupancy,
  ...
})
```

or repository-appropriate composition.

Separate responsibilities where useful:

```text
deriveRequiredSleepOccurrences(...)
deriveSleepPhysicalContexts(...)
solveRequiredSleep(...)
```

Avoid a monolithic function if doing so obscures semantic ownership.

The production API must not depend on UI state.

---

## 41. Store Integration

Expose the derived Sleep resolution through the canonical store/query layer if that is how DayFrame exposes derived domain queries.

The store integration must be:

```text
read-only
non-persisting
non-authoritative
```

It must not:

```text
write Preview
write accepted decisions
write publication
write execution
mutate authored Sleep
```

If repository architecture favors direct pure-domain calls rather than store exposure, preserve that architecture and explain it.

---

## 42. No Preview Authority

Do not make Preview the semantic owner of First-Class Sleep resolution.

Preview may remain completely unaware of the new result in Task 9.12.

If a compatibility test calls both:

```text
resolveRequiredSleep
generateSchedulePreview
```

the Preview must remain behaviorally unchanged.

Do not inject First-Class Sleep blocks into Preview yet.

---

## 43. No Capacity Consumption Yet

This is a hard boundary.

Even a successfully solved First-Class Sleep occurrence must **not yet subtract from Capacity**.

Task 9.12 may produce:

```text
foundational Sleep geometry
```

that the next task can consume.

But current Capacity results must remain unchanged.

Add a regression test proving:

```text
same authored state
+
First-Class Sleep requirement
+
successful Sleep resolution
```

does not change current Capacity until later integration.

---

## 44. No Goal Planning Change Yet

Task 9.12 must not alter:

```text
Goal Demand
Feasibility
Competition
Allocation
Proposal
Accepted Allocation
Realization
```

Add representative regression coverage proving existing constructive planning behavior remains unchanged when a First-Class Sleep requirement is present.

The future task will make Goal planning consume Sleep-adjusted Capacity.

---

## 45. No General Friction Integration Yet

`SleepFeasibilityConflictV1` may exist as a **derived Sleep feasibility result**.

Do not yet convert it into the canonical general:

```text
Friction
```

system.

Do not create:

```text
Suggested Fix
Accepted Sleep Decision
Omit Sleep
Shorten Sleep
```

behavior.

The later authority/Friction task will map the feasibility result into corrective planning semantics.

This task must keep:

```text
feasibility evidence
```

separate from:

```text
corrective authority
```

---

## 46. Sleep Feasibility Conflict Model

For an `infeasible` result, provide sufficient structured evidence to explain the proof.

At minimum evaluate fields equivalent to:

```text
affected occurrence references
owner days
requirement revisions
physical valid domains
blocking authority references
conflict category
```

Do not persist the conflict as authority.

Do not include UI prose as the semantic representation.

The result should be capable of supporting later Friction construction.

---

## 47. Search-Incomplete Model

`searchIncomplete` must be first-class.

At minimum include:

```text
owner range
number of required occurrences
candidate/search size
budget consumed
budget limit
```

and enough deterministic diagnostic data to reproduce why the solver stopped.

Do not include machine timing as the sole explanation.

A `searchIncomplete` result must never expose:

```text
allocatable remaining capacity
```

or imply that Sleep is satisfied.

---

## 48. Infeasible Versus Invalid

Distinguish:

```text
invalid authored authority
```

from:

```text
valid authored authority whose physical requirements are infeasible
```

Invalid/protected authority must continue through the existing protection/error semantics.

The solver must not turn malformed Sleep into:

```text
infeasible
```

Likewise, absence must not become infeasibility.

---

## 49. Determinism

Equivalent canonical inputs must produce semantically identical:

```text
required occurrence set
candidate domains
selected solution
conflict result
searchIncomplete result
```

regardless of:

- object insertion order;
- Work occurrence insertion order;
- blocking-geometry insertion order;
- previous solver calls;
- Preview state;
- selected calendar day;
- current wall-clock time;
- unrelated generated IDs.

Add permutation/order-independence tests.

---

## 50. Idempotence

Repeated Sleep resolution with unchanged inputs must not:

```text
mutate state
allocate new source incarnations
append revisions
persist results
change IDs
change selected geometry
```

The same Sleep occurrence reference must remain stable.

The result is derived and disposable.

---

## 51. No Persistence Version Bump Unless Required

Task 9.11 already introduced:

```text
Active V3
Profiles V3
Backup V13
```

Task 9.12 should not need to version them merely to add derived types.

Do not persist:

```text
SleepOccurrenceV1
ScheduledSleepOccurrenceV1
SleepResolutionV1
SleepFeasibilityConflictV1
```

as current authority.

If a schema bump appears necessary, stop and verify that the task has not accidentally moved derived state into persistence.

Any unavoidable version change must be justified explicitly in the RESULT.

---

## 52. No Legacy Conversion

Do not implement:

```text
LegacySleepConversionV1
```

workflow or provenance yet.

A legacy Sleep Commitment may coexist with a First-Class Sleep requirement during testing.

The new solver must ignore the legacy Sleep template as a source of required Sleep.

However, if that legacy Commitment is movable ordinary geometry, it must not incorrectly become foundational blocking authority merely because its category is `sleep`.

Authority, not title/category, controls blocking classification.

---

## 53. Performance

The complete bounded solver must be practical for ordinary DayFrame planning ranges.

Measure representative scenarios.

At minimum report:

```text
7 owner days
31 owner days
a larger supported planning range representative of current DayFrame use
```

Do not weaken completeness to hit an arbitrary performance target.

If candidate explosion causes `searchIncomplete`, report it accurately and identify the dominant complexity.

Do not silently reduce the search domain.

---

## 54. Required Solver Adversarial Cases

Add explicit cases where greedy placement would fail but a valid joint solution exists.

At minimum include:

### Narrow-later occurrence

```text
Occurrence A:
broad valid window

Occurrence B:
narrow overlapping valid window
```

Earliest-first A blocks B.

Solver must find another valid A placement and return:

```text
satisfied
```

### Preferred-start trap

A preferred placement blocks another required occurrence, but a nonpreferred legal placement allows both.

Result:

```text
satisfied
```

### True infeasibility

All legal combinations conflict with authoritative occupancy or each other.

Result:

```text
infeasible
```

### Budget exhaustion

A deliberately constrained deterministic search budget prevents proof.

Result:

```text
searchIncomplete
```

Never `infeasible`.

---

## 55. Required Clock-Window Tests

At minimum cover:

```text
22:00 → 08:00
08:00 → 22:00
00:00 → 00:00
```

with:

- no blockers;
- Work blocker;
- boundary 00:00;
- boundary 03:00;
- boundary 12:00;
- buffers;
- preferred start;
- owner-range edge.

Prove physical continuity across midnight/boundary.

---

## 56. Required Work-Relative Tests

At minimum cover:

```text
beforeWork Day shift
beforeWork Evening shift
beforeWork Night shift

afterWork Day shift
afterWork Evening shift
afterWork Night shift
```

with representative:

```text
boundary 00:00
boundary 12:00
```

and:

```text
Work day
off day
```

Use actual Work geometry.

No solved Sleep footprint may overlap Work.

---

## 57. Required Transition Tests

At minimum cover:

```text
Day → Evening
Evening → Night
Night → Day
Work → Off
Off → Work
```

Also cover any production-active:

```text
manual segment
repeating sequence
```

transition modes identified in the repository trace.

If per-segment Day Boundary overrides are supported, include at least one transition where effective boundary changes across segments.

---

## 58. Required Blocking-Authority Tests

At minimum prove:

```text
Work blocks Sleep
locked/fixed Commitment blocks Sleep where architecture says it should
manual fixed Event blocks Sleep
realized Goal work blocks Sleep
support activity blocks Sleep
protected buffer blocks Sleep
ordinary movable Commitment does not prove Sleep infeasible
Goal Proposal does not block Sleep
Accepted Allocation without realization does not own physical time
Preview-only placement does not become foundational authority
```

Reuse existing authoritative fixtures where possible.

---

## 59. Required Identity Tests

Extend 9.11 identity coverage to derived occurrences.

At minimum:

```text
same source lifetime + owner day
different requirement revision
→ same reference
```

```text
same reference
different derived physical placement
→ same reference
```

```text
same logical ID
new incarnation
→ different reference
```

```text
same physical interval
different owner day
→ different reference
```

```text
legacy Sleep Commitment occurrence
same physical interval
→ different source family/reference
```

---

## 60. Required Range-Edge Tests

At minimum:

```text
Sleep starts before requested owner-range physical boundary
Sleep ends after requested owner-range physical boundary
beforeWork anchor outside narrow owner range
afterWork anchor outside narrow owner range
overnight Work crossing query edge
```

The required occurrence must not be truncated or incorrectly treated as off-day.

---

## 61. Required Search-Budget Tests

At minimum:

```text
budget sufficient
→ satisfied/infeasible proof
```

```text
same semantic input + insufficient deterministic budget
→ searchIncomplete
```

```text
repeat insufficient-budget query
→ identical searchIncomplete semantics
```

```text
increase budget
→ deterministic eventual proof
```

where the bounded domain permits proof.

Do not make test success depend on wall-clock duration.

---

## 62. Required Non-Activation Tests

Add direct regressions proving First-Class Sleep resolution does not yet change:

```text
generateSchedulePreview
current Capacity
Goal feasibility
Proposal generation
Accepted Allocation
Realization
general Friction
Suggested Fix
publication materialization
Today
execution
Summary/history
```

Not every subsystem requires a brand-new test if existing coverage plus a representative integrated fixture proves the boundary.

The RESULT must identify the evidence used for each.

---

## 63. Required Derived-State Matrix

Include in the RESULT:

| Object | Authority Layer | Persisted? | Stable Identity? | Geometry? | Consumer in 9.12 |
|---|---|---:|---:|---:|---|
| SleepRequirementV1 | | | | | |
| SleepOccurrenceReferenceV1 | | | | | |
| SleepOccurrenceV1 | | | | | |
| SleepDerivationContextV1 | | | | | |
| Sleep physical candidate | | | | | |
| ScheduledSleepOccurrenceV1 | | | | | |
| SleepFeasibilityConflictV1 | | | | | |
| SleepResolutionV1 | | | | | |

Explicitly distinguish:

```text
identity
```

from:

```text
derived geometry
```

and:

```text
authority
```

---

## 64. Required Derivation Matrix

Include:

| Window Intent | Work Present? | Anchor | Off-Day Fallback? | May Cross Midnight? | May Cross Day Boundary? | Deterministic Owner |
|---|---:|---|---:|---:|---:|---|
| clock | | | | | | |
| beforeWork | | | | | | |
| afterWork | | | | | | |

Populate with actual implemented semantics.

---

## 65. Required Feasibility Matrix

Include:

| Scenario | Required Occurrence Exists? | Valid Physical Domain? | Solver Outcome | Why |
|---|---:|---:|---|---|
| No requirement | | | | |
| Disabled requirement | | | | |
| Non-applicable weekday | | | | |
| Valid clock window | | | | |
| Valid beforeWork | | | | |
| Work-relative off day | | | | |
| Preferred start blocked but alternate exists | | | | |
| All legal placements blocked | | | | |
| Joint greedy trap with valid assignment | | | | |
| Search budget exhausted | | | | |

---

## 66. Required Blocking Matrix

Include:

| Geometry Source | Owns/Protects Time? | Blocks Sleep Solver? | May Solver Move It? | Why |
|---|---:|---:|---:|---|
| Work | | | | |
| Locked Commitment | | | | |
| Flexible Commitment | | | | |
| Manual fixed Event | | | | |
| Goal Demand | | | | |
| Proposal | | | | |
| Accepted Allocation | | | | |
| Realized Goal work | | | | |
| Support Activity | | | | |
| Protected Buffer | | | | |
| Preview-only block | | | | |

---

## 67. Required Result-State Matrix

Include:

| State | Meaning | Proof Level | May Downstream Treat Sleep as Satisfied? | May Future Capacity Be Computed? |
|---|---|---|---:|---:|
| notConfigured | | | | |
| satisfied | | | | |
| infeasible | | | | |
| searchIncomplete | | | | |
| invalid/protected | | | | |

For the last column, describe the **future architectural rule**.

Task 9.12 itself must not change Capacity.

---

## 68. Required Behavioral Invariants

Task 9.12 must establish and test at least the following:

1. First-Class Sleep derivation consumes only explicit `SleepRequirementV1`.
2. Legacy Sleep Commitment data is not promoted into required Sleep.
3. Each applicable owner day produces at most one V1 required Sleep occurrence.
4. Sleep occurrence identity remains source-lifetime + owner-day + slot.
5. Requirement revision does not change occurrence identity.
6. Physical geometry does not change occurrence identity.
7. Derived Sleep occurrences are disposable.
8. Derived Sleep results are not persisted as authored authority.
9. Clock Sleep may cross civil midnight.
10. Clock Sleep may cross DayFrame boundaries.
11. Equal clock endpoints represent a full civil-day valid window.
12. Work-relative Sleep anchors to actual Work geometry.
13. Work-relative off days use explicit fallback.
14. Narrow query ranges do not hide required Work anchors.
15. Day Boundary is not a physical containment wall.
16. Planning-range edges do not truncate required Sleep.
17. The full Sleep footprint includes before/after buffers.
18. Satisfied Sleep footprint does not overlap authoritative Work.
19. Satisfied Sleep footprint does not overlap other authoritative blocking geometry.
20. Ordinary movable Commitment geometry does not prove Sleep infeasible.
21. Goal Proposal does not block Sleep.
22. Accepted Allocation without realization does not own physical time for Sleep solving.
23. Realized Goal work may constrain Sleep.
24. Support activities may constrain Sleep.
25. Protected buffers may constrain Sleep.
26. Sleep occurrences are jointly solved when their domains interact.
27. Greedy failure is not infeasibility.
28. Preferred-placement failure is not infeasibility.
29. `infeasible` requires complete proof within the defined bounded domain.
30. Search-budget exhaustion returns `searchIncomplete`.
31. `searchIncomplete` never masquerades as `infeasible`.
32. `searchIncomplete` never masquerades as `satisfied`.
33. Search budget is deterministic rather than wall-clock dependent.
34. Equivalent inputs produce equivalent results.
35. Input ordering does not alter semantic results.
36. Solver execution does not mutate authored state.
37. Solver execution does not allocate new source incarnations.
38. Solver execution does not persist derived Sleep.
39. First-Class Sleep still does not subtract from Capacity in Task 9.12.
40. First-Class Sleep still does not change Goal planning in Task 9.12.
41. First-Class Sleep still does not enter general Friction/Suggested Fix in Task 9.12.
42. First-Class Sleep still does not enter publication in Task 9.12.
43. First-Class Sleep still does not enter execution/history in Task 9.12.
44. No ordinary `Omit Sleep` semantics are introduced.
45. No Sleep-shortening semantics are introduced.
46. No Sleep override semantics are introduced.
47. No automatic legacy conversion occurs.
48. No duplicate persistence owner is introduced.
49. Current legacy Sleep scheduling remains behaviorally unchanged.
50. `satisfied`, `infeasible`, and `searchIncomplete` remain semantically distinct.

---

## 69. Architecture Governance

Task 9.11 already recorded the dedicated Sleep domain decision and future Capacity precedence.

Task 9.12 should update governance only if implementation establishes a new normative detail not already resolved by Task 9.10.

Likely candidates include:

```text
canonical Work-anchor selection rule
bounded solver completeness contract
deterministic search-budget contract
```

If these are implementation details fully governed by 9.10, record them in the RESULT rather than creating unnecessary ADR churn.

Do not reopen the representation decision.

---

## 70. Prohibited Changes

Do **not**:

- change `SleepRequirementV1` into a different authority model;
- infer Sleep from legacy Commitments;
- automatically convert legacy Sleep;
- remove legacy Sleep;
- change legacy Sleep scheduling semantics;
- create hidden Sleep BlockTemplates;
- create dual writes;
- create a new persistence key;
- persist derived Sleep resolution as authored authority;
- make Preview own First-Class Sleep;
- inject First-Class Sleep into legacy Preview scheduling;
- subtract First-Class Sleep from Capacity;
- change Goal feasibility;
- change Competition;
- change Allocation;
- change Proposal;
- change Accepted Allocation;
- change Realization;
- integrate Sleep feasibility into general Friction;
- add Sleep Suggested Fixes;
- add `Omit Sleep`;
- add Sleep shortening;
- add Sleep override;
- version PlanDecision for Sleep;
- version publication for Sleep;
- version execution for Sleep;
- publish First-Class Sleep;
- execute First-Class Sleep;
- credit Sleep as Goal Progress;
- redesign Planner;
- redesign Summary;
- redesign Today;
- implement legacy conversion workflow;
- add dependencies unless absolutely required and justified;
- weaken existing bundle limits;
- commit;
- push.

---

## 71. Validation

Run the repository's standard implementation validation.

At minimum:

```text
npm run format
npm run lint
npm run build
npm test
npm run check:bundle
git diff --check
```

Use actual repository commands if names differ.

Also run focused suites for:

```text
Sleep requirement
Sleep occurrence identity
Sleep derivation
Sleep feasibility solver
Work generation
Day Boundary
cycle/segment transitions
physical occupancy
realized Goal occupancy
support/buffers
legacy Sleep
Capacity non-activation
constructive planning non-activation
publication non-activation
```

Record exact commands and outcomes.

Do not claim a validation command was run unless it was.

---

## 72. Repository Hygiene

Before implementation:

1. inspect `git status`;
2. record current HEAD;
3. record pre-existing dirty state;
4. preserve existing Phase 9 work;
5. do not overwrite unrelated changes;
6. establish a baseline sufficient to distinguish 9.12 edits.

After implementation:

1. inspect `git status`;
2. inspect `git diff --stat`;
3. inspect relevant diffs;
4. compare against the recorded baseline;
5. run `git diff --check`;
6. identify any pre-existing file that received additional 9.12 edits;
7. do not commit;
8. do not push.

---

## 73. Required RESULT Artifact

Create exactly one durable task-result artifact:

```text
PHASE_9_TASK_9_12_FIRST_CLASS_SLEEP_DERIVATION_FEASIBILITY_FOUNDATION_RESULT.md
```

Place it in the existing Phase 9 durable result-artifact folder.

The filename must contain:

```text
RESULT
```

No additional task report is authorized.

Governance documentation changes are permitted only under Section 69.

---

## 74. Required RESULT Structure

The RESULT must contain these sections in this exact order:

```text
# Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation RESULT

## 1. Executive Summary

## 2. Scope and Governing Architecture

## 3. Pre-Implementation Repository State

## 4. Current Temporal / Work Ownership Trace

## 5. Task 9.11 Foundation Consumed

## 6. Required Sleep Occurrence Model

## 7. Occurrence Identity Preservation

## 8. Owner-Day Derivation

## 9. Sleep Derivation Context

## 10. Clock-Window Derivation

## 11. Work-Relative Derivation

## 12. Work Anchor Selection

## 13. Cycle / Segment Transition Semantics

## 14. Physical Search Domain

## 15. Sleep Footprint Semantics

## 16. Foundational Blocking Geometry

## 17. Blocking-Authority Classification

## 18. Joint Sleep Solver

## 19. Candidate Generation and Ordering

## 20. Search Granularity

## 21. Solver Completeness Contract

## 22. Deterministic Search Budget

## 23. Sleep Resolution Model

## 24. Scheduled Sleep Occurrence Model

## 25. Sleep Feasibility Conflict Model

## 26. Search-Incomplete Model

## 27. Planning-Horizon Edge Semantics

## 28. Determinism and Idempotence

## 29. Store / Query Integration

## 30. Scheduling Non-Activation Verification

## 31. Capacity / Goal Non-Activation Verification

## 32. Friction / Suggested Fix Non-Activation Verification

## 33. Publication / Execution Non-Activation Verification

## 34. Legacy Sleep Coexistence

## 35. Derived-State Matrix

## 36. Derivation Matrix

## 37. Feasibility Matrix

## 38. Blocking Matrix

## 39. Result-State Matrix

## 40. Behavioral Invariants

## 41. Adversarial Solver Coverage

## 42. Boundary / Midnight Coverage

## 43. Work-Relative Coverage

## 44. Transition Coverage

## 45. Blocking-Authority Coverage

## 46. Range-Edge Coverage

## 47. Search-Budget Coverage

## 48. Legacy Regression Assessment

## 49. Performance Assessment

## 50. Architecture Governance Assessment

## 51. Test Coverage

## 52. Validation Record

## 53. Changed Files

## 54. Deferred First-Class Sleep Work

## 55. Completion Assessment
```

---

## 75. Required Changed-Files Accounting

List every file changed by Task 9.12.

Classify each as:

```text
Domain
Derivation
Temporal Context
Work Integration
Occupancy
Solver
Query
Store
Governance
Test
RESULT
```

For each identify:

- purpose;
- semantic change;
- authority impact;
- whether persisted behavior changed;
- associated tests.

Separate:

```text
pre-existing modification
```

from:

```text
Task 9.12 additional modification
```

where applicable.

---

## 76. Completion Criteria

Task 9.12 is complete only when all criteria below are satisfied.

### Foundation

- [ ] Task 9.11 canonical Sleep authority is reused.
- [ ] No replacement Sleep authority model was introduced.
- [ ] Legacy Sleep remains separate.
- [ ] No persistence owner was duplicated.

### Occurrence derivation

- [ ] Applicable owner days derive exactly one V1 required occurrence.
- [ ] Non-applicable/disabled/unconfigured days derive none.
- [ ] occurrence identity uses the 9.11 canonical reference.
- [ ] revision changes do not alter occurrence identity.
- [ ] geometry changes do not alter occurrence identity.
- [ ] derivation context is explicit and deterministic.

### Clock windows

- [ ] ordinary clock windows derive correctly.
- [ ] overnight clock windows remain physically continuous.
- [ ] equal endpoints represent the full civil-day window.
- [ ] preferred start remains preference rather than hard validity.
- [ ] Day Boundary does not clip physical geometry.

### Work-relative windows

- [ ] beforeWork anchors to actual Work start.
- [ ] afterWork anchors to actual Work end.
- [ ] off days use explicit fallback.
- [ ] query edges do not hide relevant Work anchors.
- [ ] Day/Evening/Night representative cases pass.
- [ ] transition cases pass.

### Physical footprint

- [ ] Sleep activity duration is exact.
- [ ] before buffer is included.
- [ ] after buffer is included.
- [ ] buffers remain protection rather than activity.
- [ ] satisfied footprint cannot overlap authoritative Work.
- [ ] satisfied footprint cannot overlap other authoritative blocking geometry.

### Blocking authority

- [ ] Work classification is explicit.
- [ ] locked/fixed Commitment classification is explicit.
- [ ] movable Commitment classification is explicit.
- [ ] manual Event classification is explicit.
- [ ] Goal Proposal classification is explicit.
- [ ] Accepted Allocation classification is explicit.
- [ ] realized Goal work classification is explicit.
- [ ] support activity classification is explicit.
- [ ] protected buffer classification is explicit.
- [ ] Preview-only geometry classification is explicit.

### Solver

- [ ] solver is joint where Sleep domains interact.
- [ ] solver is complete for its explicitly bounded search space.
- [ ] greedy failure does not imply infeasibility.
- [ ] preferred-placement failure does not imply infeasibility.
- [ ] true infeasibility requires proof.
- [ ] deterministic search budget exists.
- [ ] budget exhaustion returns `searchIncomplete`.
- [ ] wall-clock timing does not determine semantic result.
- [ ] candidate ordering is deterministic.
- [ ] input order does not alter semantic output.
- [ ] repeated calls are idempotent.

### Result model

- [ ] `satisfied` is explicit.
- [ ] `infeasible` is explicit.
- [ ] `searchIncomplete` is explicit.
- [ ] absence/notConfigured is explicit.
- [ ] invalid/protected authority is not collapsed into infeasible.
- [ ] conflict evidence is structured.
- [ ] search-incomplete evidence is structured.

### Range/boundaries

- [ ] owner range and physical context range are distinct.
- [ ] first-edge spill is handled.
- [ ] last-edge spill is handled.
- [ ] Work anchors outside narrow owner range are handled.
- [ ] midnight crossing is ordinary.
- [ ] Day Boundary crossing is ordinary.
- [ ] cycle transition crossing is handled deterministically.

### Non-activation

- [ ] First-Class Sleep does not alter current Preview.
- [ ] First-Class Sleep does not alter current Capacity.
- [ ] First-Class Sleep does not alter Goal feasibility.
- [ ] First-Class Sleep does not alter Proposal.
- [ ] First-Class Sleep does not alter Accepted Allocation.
- [ ] First-Class Sleep does not alter Realization.
- [ ] First-Class Sleep does not alter general Friction.
- [ ] First-Class Sleep does not alter Suggested Fix.
- [ ] First-Class Sleep does not alter publication.
- [ ] First-Class Sleep does not alter Today.
- [ ] First-Class Sleep does not alter execution.
- [ ] First-Class Sleep does not alter Summary/history.

### Prohibited authority

- [ ] no Sleep omission decision exists.
- [ ] no Sleep shortening decision exists.
- [ ] no Sleep override exists.
- [ ] no accepted Sleep placement exists.
- [ ] no published First-Class Sleep exists.
- [ ] no First-Class Sleep execution exists.
- [ ] no automatic legacy conversion exists.

### Validation

- [ ] focused Sleep derivation tests pass.
- [ ] solver adversarial tests pass.
- [ ] boundary tests pass.
- [ ] Work-relative tests pass.
- [ ] transition tests pass.
- [ ] blocking-authority tests pass.
- [ ] range-edge tests pass.
- [ ] deterministic-budget tests pass.
- [ ] legacy regression tests pass.
- [ ] non-activation tests pass.
- [ ] full test suite passes.
- [ ] lint passes.
- [ ] build/typecheck passes.
- [ ] formatting passes.
- [ ] bundle hard limit passes without threshold weakening.
- [ ] `git diff --check` passes.
- [ ] no commit was created.
- [ ] no push occurred.

### Documentation

- [ ] required RESULT exists.
- [ ] required matrices are complete.
- [ ] solver completeness contract is documented.
- [ ] search-budget contract is documented.
- [ ] Work-anchor rule is documented.
- [ ] performance assessment is present.
- [ ] changed-files accounting is complete.
- [ ] deferred downstream work is explicit.

---

## 77. Final Completion Statement

If and only if every Task 9.12 completion criterion is satisfied, end the RESULT with exactly:

```text
Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation is INCOMPLETE.
```

Then immediately identify the exact unresolved implementation or evidence blockers.

Do not mark Task 9.12 complete merely because Sleep can be placed in representative examples.

The task is complete only when DayFrame can distinguish, for the complete defined bounded domain:

```text
a valid Sleep solution exists
```

from:

```text
no valid Sleep solution exists
```

from:

```text
the bounded solver did not complete enough work to know
```

without changing downstream planning authority.

---

## 78. Governing Principle

Task 9.11 taught DayFrame:

```text
what Sleep the user requires.
```

Task 9.12 must teach DayFrame:

```text
what that requirement means in physical time.
```

The engine must not ask:

```text
Where can I greedily drop a Sleep block?
```

It must answer:

```text
For these required Sleep occurrences,
given their authored windows,
their Work context,
their protected footprint,
and the physical authority already present,

does a valid joint temporal solution exist?
```

If yes:

```text
produce it deterministically.
```

If no:

```text
prove infeasibility within the complete bounded domain.
```

If the solver cannot complete that proof:

```text
say searchIncomplete.
```

Never manufacture certainty.

And do not yet let the rest of DayFrame consume the answer.

Task 9.12 exists to make the answer trustworthy first.