# Task 9.19 — Canonical Product Evidence Projection V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Product Convergence  
**Task Type:** Bounded Architecture Discovery / Read-Model Implementation / Authority Projection / Pre-Day-Worksurface Foundation  
**Prerequisites:** Task 9.18 — Planner / Summary Navigation Foundation V1 — COMPLETE  
**Primary Specification Authorities:** Task 9.17 RESULT; Task 9.18 RESULT; accepted Phase 9 authority architecture  
**Implementation Changes:** AUTHORIZED ONLY AFTER REQUIRED DISCOVERY  
**Persistence Changes:** PROHIBITED  
**Schema / Storage-Version Changes:** PROHIBITED  
**Authority Mutation Changes:** PROHIBITED  
**Planner / Summary Navigation Changes:** PROHIBITED EXCEPT MINIMAL CONSUMER WIRING REQUIRED FOR VALIDATION  
**Day Worksurface Implementation:** PROHIBITED  
**Summary Convergence Implementation:** PROHIBITED  
**HistoricalPlan Recovery Implementation:** PROHIBITED  
**Mobile Acceptance Gate:** MANDATORY FOR ANY USER-VISIBLE CONSUMER CHANGE  
**Bundle Hard Gate:** 170,000-byte initial gzip — MUST NOT BE RAISED  
**Required Durable Output:** `PHASE_9_TASK_9_19_CANONICAL_PRODUCT_EVIDENCE_PROJECTION_V1_RESULT.md`

---

## 1. Objective

Implement the semantic evidence-projection foundation required before DayFrame can safely converge Calendar, Today, historical-day reporting, accepted-planning provenance, and later Summary surfaces.

Task 9.18 established the product shell:

```text
DayFrame
├── Planner
│   ├── Calendar
│   ├── My Schedule
│   ├── Goals
│   └── Review Plan
└── Summary
```

It deliberately retained compatibility surfaces because two semantic projection gaps remained:

```text
G1 — Selected-Day Evidence Projection
G2 — Accepted-Planning Lineage Projection
```

Task 9.19 SHALL resolve those gaps at the canonical read-model/query layer.

The required result is not a new semantic owner and not a generic “product truth” object.

The required result is a bounded set of deterministic projections that allow product surfaces to ask lawful questions of existing authority without reconstructing semantics in React.

The governing objective is:

> **Give product surfaces a canonical way to ask what authoritative evidence exists for a selected DayFrame day and how accepted planning produced scheduled Goal work, without changing the authority that created that evidence.**

---

## 2. Governing Evidence Principle

The governing rule is:

> **Projection may compose authority. Projection may not become authority.**

A product projection MAY:

- read existing authoritative records;
- read existing derived read models;
- compose related evidence;
- preserve provenance;
- classify evidence availability;
- identify protection;
- identify unknown/incomplete evidence;
- expose lawful action eligibility derived from canonical owners;
- provide stable product-facing references.

A product projection MUST NOT:

- create schedule authority;
- create accepted authority;
- create publication authority;
- create execution authority;
- create Progress;
- create historical authority;
- infer missing evidence;
- repair authority;
- mutate authority;
- reinterpret unknown as empty;
- reinterpret generated schedule as Published Plan;
- reinterpret scheduled geometry as execution;
- reinterpret title/time similarity as provenance.

---

## 3. Required Discovery Gate

Before implementation, perform a repository-level discovery of G1 and G2.

Do not assume they belong in one module merely because Task 9.19 addresses them together.

Discovery MUST determine:

```text
A. Which canonical owners G1 must consume.
B. Which canonical owners G2 must consume.
C. Whether the two projections share a lawful lower-level evidence vocabulary.
D. Whether they require separate read models.
E. Whether one depends on the other.
F. Whether implementing either requires a semantic decision not already established.
```

Classify the result as exactly one of:

```text
MODEL A — Shared bounded projection foundation with distinct G1/G2 outputs.
MODEL B — Separate G1 and G2 projections sharing only low-level references/types.
MODEL C — G1 and G2 require separate implementation tasks because combining them would create an artificial semantic owner.
MODEL D — Existing architecture already contains one or both canonical projections and only requires convergence/adaptation.
MODEL E — Architecture decision required before implementation.
```

If discovery produces MODEL C:

- implement only the portion that can be completed without creating a false aggregate;
- document the required split;
- return Task 9.19 INCOMPLETE unless the supplied task can still satisfy all required completion criteria without violating semantic ownership.

If discovery produces MODEL E:

```text
STOP CONDITION — ARCHITECTURE DECISION REQUIRED
```

Do not invent the missing decision.

---

## 4. G1 — Selected-Day Evidence Projection

G1 SHALL provide a canonical read-only answer to the product question:

> **For this selected canonical DayFrame owner day, what planning, published, actual, manual, Sleep, protection, and reporting evidence lawfully exists?**

The projection MUST work for:

```text
past owner day
current owner day
future owner day
```

without pretending those modes have identical available authority.

G1 SHALL NOT be implemented by calling Today with fabricated time.

G1 SHALL NOT be implemented by treating the selected owner label as an `asOf` instant.

G1 SHALL NOT depend on Preview freshness merely to determine whether historical or authored evidence exists.

---

## 5. Owner Day and As-Of Must Remain Distinct

Task 9.19 MUST preserve two independent temporal concepts:

```text
ownerDay
asOf
```

`ownerDay` answers:

> Which canonical DayFrame day is being inspected?

`asOf` answers:

> From what real evaluation instant is currentness/visibility/eligibility being evaluated?

These MUST NOT be conflated.

Example:

```text
selected owner day = 2026-09-12
actual as-of instant = 2026-09-20T...
```

A historical-day query MUST NOT pretend the current instant is September 12 merely to make Today render historical evidence.

Likewise, a future owner day MUST NOT fabricate a future `asOf` unless a specific existing semantic query explicitly requires and authorizes counterfactual evaluation.

The RESULT MUST identify every G1 field whose meaning depends on:

```text
ownerDay
asOf
both
neither
```

---

## 6. Canonical User-Day Semantics

G1 MUST use DayFrame's existing canonical owner-day and effective-boundary semantics.

Do not derive ownership using:

```text
civil midnight
UTC date slicing
local Date string formatting
```

when those bypass existing boundary logic.

Cross-midnight:

```text
Work
Sleep
Commitments
Goal work
support
protected buffers
manual events
```

must retain their existing owner identity.

The projection MUST NOT reassign physical intervals to another owner day merely because their wall-clock date crosses midnight.

---

## 7. G1 Evidence Families

Discovery MUST identify the canonical owner/query for every applicable family below.

G1 SHALL compose only evidence supported by repository authority.

Expected evidence families include:

```text
authored schedule context
Work
Commitments
Manual Events
realized Goal work
Support Activities
Protected Buffers
First-Class Sleep requirement/resolution where relevant
Published Plan
Published Sleep
Execution / actual outcomes
Sleep execution
historical evidence
protection state
planning/current schedule evidence where lawfully relevant
Friction / attention where lawfully day-scoped
reporting eligibility
```

Not every family must appear for every owner day.

Absence MUST remain distinguishable from:

```text
unknown
incomplete
protected
not applicable
not published
not executed
```

---

## 8. G1 Evidence Layers

The projection MUST preserve authority layers rather than flattening them.

At minimum determine whether product consumers need explicit representations of:

```text
authored
derived/current planning
accepted/realized
published
actual/executed
historical
protected/unknown
```

Do not return one generic:

```text
events[]
```

array if doing so destroys the distinction between those layers.

A product surface may later visually unify related items.

The canonical projection must retain enough provenance to prevent semantic collapse.

---

## 9. Planned vs Published vs Actual

G1 MUST preserve:

```text
planned != published != actual
```

Examples:

- generated Work or Goal work is not automatically a Published Plan;
- Published Sleep is not actual Sleep;
- scheduled Goal work is not Goal Progress;
- a missing Execution record is unknown, not "didn't do it";
- explicit nonexecution is actual evidence and remains distinct from missing evidence;
- a manual event is not automatically execution evidence;
- historical publication remains immutable even when current authored setup changes.

No field name may imply stronger authority than its source.

---

## 10. G1 Item Identity

Every projected item MUST expose enough stable identity/provenance for later Day Worksurface interaction.

Use existing durable references where available.

Do not create identity from:

```text
title
display label
start time alone
array index
render order
```

Where an evidence family lacks a durable reference appropriate for product interaction, document the gap.

Do not invent a new persisted identifier in Task 9.19.

---

## 11. G1 Product Subjects

Discovery MUST determine whether the canonical projection should expose a bounded product-subject union.

Possible semantic subjects include:

```text
Work
Commitment
Manual Event
Goal Work
Support Activity
Protected Buffer
Sleep
```

This list is not automatically authoritative.

Use repository evidence.

If a product-facing discriminated union is created, it MUST describe existing semantics rather than establish new ones.

A Protected Buffer MUST NOT be mislabeled as an activity merely to fit a generic item component.

---

## 12. G1 Support / Protection Distinction

Preserve the accepted distinction:

```text
productive activity
support activity
protection
```

Specifically:

- Goal work may be productive;
- Support Activity supports another activity and may own time where canonically realized;
- Protected Buffer protects time but is not itself an activity.

Do not flatten support/protection into generic scheduled work.

Later UI must be able to represent these differently.

---

## 13. G1 Sleep Evidence

First-Class Sleep MUST retain its authority layers.

Where relevant to the selected owner day, G1 must be able to distinguish:

```text
current Sleep requirement/derived occurrence
published Sleep
actual Sleep execution
explicit skipped/nonexecution
unplanned Sleep actual
protected/unknown historical Sleep evidence
```

Do not reconstruct Sleep from legacy Commitment heuristics.

Do not infer actual Sleep from a published Sleep snapshot.

Do not infer published Sleep from current Sleep resolution.

---

## 14. G1 Historical Protection

If historical authority is protected, G1 MUST preserve:

```text
protected
```

as a first-class state.

It MUST NOT translate protected evidence to:

```text
empty
no plan
nothing happened
zero
```

If some evidence families remain readable while another is protected, discovery must determine whether the projection can safely expose partial evidence with explicit protection metadata.

Do not weaken existing fail-closed rules.

Do not implement HistoricalPlan recovery.

---

## 15. G1 Coverage / Completeness

The projection MUST explicitly define completeness.

A query that cannot establish all evidence required for a claim MUST NOT return a deceptively complete-looking empty result.

Determine whether G1 requires a structure conceptually similar to:

```text
complete
partial
unknown
protected
```

or existing repository-native equivalents.

Do not invent generic completeness terminology if existing canonical types already own the concept.

The RESULT MUST explain how consumers distinguish:

```text
complete + zero items
```

from:

```text
evidence unavailable
```

---

## 16. G1 Reporting Eligibility

G1 should expose reporting eligibility only if it can be derived from existing canonical subject/command rules.

Do not create generic:

```text
canComplete: true
```

based merely on an item appearing on the day.

Different subjects may support different actual-outcome actions.

Examples requiring semantic care include:

```text
published Commitment
published Goal work
published Sleep
manual event
Support Activity
Protected Buffer
unpublished planned item
historical protected item
```

Where no canonical command exists, the projection MUST NOT invent one.

---

## 17. G1 Action References

Where existing commands require a durable target, the projection MAY expose an action target/reference sufficient for later product surfaces to invoke the existing command.

The projection MUST NOT execute the command.

Examples may include existing references for:

```text
execution reporting
execution correction
execution retraction
Sleep actual reporting
manual event editing
Goal navigation
Commitment navigation
```

Only expose actions actually supported by canonical commands.

---

## 18. G1 Past-Day Contract

For a past owner day, G1 should be capable of representing lawful combinations of:

```text
frozen published evidence
actual execution evidence
manual authored evidence
historical corrections/retractions
Sleep publication/actual evidence
protected authority
```

Current generated planning MUST NOT overwrite frozen historical truth.

If no publication existed, represent that fact accurately.

Do not fabricate a historical plan from current authored setup.

---

## 19. G1 Current-Day Contract

For the current canonical owner day, G1 should be capable of representing lawful combinations of:

```text
current authored/realized schedule evidence
Published Plan evidence if present
actual outcomes so far
manual events
Sleep evidence
attention/protection
```

The projection MUST preserve the distinction between current generated planning and published truth.

Current day does not mean:

```text
everything currently generated is authoritative
```

---

## 20. G1 Future-Day Contract

For a future owner day, G1 should be capable of representing lawful:

```text
authored/realized schedule evidence
manual events
accepted/realized Goal work
Sleep planning evidence
published future plan evidence if such authority exists
```

Actual execution should ordinarily remain absent/unknown unless the existing architecture lawfully contains explicit evidence.

Do not infer future completion.

---

## 21. G1 Determinism

For identical:

```text
authoritative inputs
ownerDay
asOf
query options
```

G1 MUST return semantically identical output.

No dependence on:

```text
render order
object insertion accident
random IDs
current component state
uncontrolled Date.now calls inside composition
```

Inject or explicitly provide `asOf` where needed.

Tests MUST prove determinism.

---

## 22. G1 Read-Only Requirement

G1 queries MUST be read-only.

Calling G1 MUST NOT:

```text
write localStorage
write IndexedDB
create publication
create execution
accept Proposal
realize allocation
repair history
change Sleep placement
update Progress
save authored setup
```

Add explicit mutation-isolation regression coverage.

---

## 23. G2 — Accepted-Planning Lineage Projection

G2 SHALL answer the product question:

> **Why does this scheduled Goal work exist, and which accepted planning decision/iteration authorized it?**

The projection MUST preserve the distinction among:

```text
Goal
Goal Demand
Proposal
Accepted Allocation
Realization
scheduled Goal work
Support Activity
Protected Buffer
publication
execution
Progress
```

G2 is not a generic Goal summary.

G2 is provenance/currentness projection for accepted planning.

---

## 24. Network+ Dogfood Requirement

Task 9.19 MUST explicitly cover the provenance scenario observed during dogfood:

```text
Goal: Network+ Study

accepted planning iteration A:
    10 hours

accepted planning iteration B:
    20 hours

both accepted

realized scheduled work exists
```

The projection MUST allow a product consumer to determine, using canonical evidence rather than heuristics:

```text
which realized/scheduled facts came from iteration A
which came from iteration B
the distinct Proposal identities
the distinct Accepted Allocation identities
the relevant Demand/Goal relationship
```

Do not collapse the two accepted iterations merely because:

```text
Goal title is identical
dates overlap
duration can be summed to 30h
```

The product may later summarize them.

The evidence layer must preserve lineage.

---

## 25. G2 Lineage Chain

Discovery MUST identify the actual durable chain available in the repository.

The expected conceptual chain is:

```text
Goal
↓
Goal Demand
↓
Proposal
↓
acceptance / Accepted Allocation
↓
Realization
↓
scheduled Goal-work fact
```

Support/protection may branch from the realized footprint.

Use actual repository structures.

Do not manufacture links from temporal coincidence.

The RESULT MUST document the exact canonical reference fields used at every step.

---

## 26. G2 Accepted Iteration Identity

Each accepted planning iteration MUST remain independently identifiable.

A later accepted iteration MUST NOT silently supersede an earlier one unless existing authority explicitly says so.

Do not infer replacement from:

```text
same Goal
newer timestamp
larger requested duration
same Demand title
same planning window
```

If the architecture contains no supersession authority, G2 must say:

```text
both accepted iterations remain distinct evidence
```

---

## 27. G2 Currentness

Task 9.19 MUST define what G2 can lawfully say about currentness.

Possible concepts may include:

```text
accepted
realized
partially realized
published
historically published
executed
superseded
revoked
stale
```

Do NOT implement any of those labels unless repository authority supports them.

In particular:

> **Newer does not automatically mean current.**

Currentness MUST NOT be inferred from:

```text
latest timestamp
highest revision
latest title match
latest geometry
```

unless an existing canonical authority explicitly defines that rule.

If currentness cannot be established, expose:

```text
unknown / not represented
```

using repository-consistent semantics.

---

## 28. G2 Realized Facts

G2 MUST identify realized Goal facts using existing realization provenance.

Preserve distinctions among:

```text
productive Goal work
Support Activity
Protected Buffer
```

If all three originate from one accepted footprint, the projection must preserve that shared lineage without pretending all three are Goal work.

Do not infer origin by adjacency.

---

## 29. G2 Unrealized Accepted Planning

Accepted Allocation may exist without realized scheduled facts.

G2 MUST preserve:

```text
accepted but unrealized
```

where existing architecture supports that state.

Do not convert it into scheduled work.

Do not hide it merely because no schedule fact exists.

This is important for later Review Plan and Summary presentation.

---

## 30. G2 Publication Relationship

Where realized Goal work becomes part of an immutable publication, G2 must preserve the relationship between:

```text
accepted planning lineage
realized schedule fact
published snapshot
```

without claiming that publication created the accepted authority.

Likewise, publication history must not be rewritten if the Goal/Demand later changes.

Determine what immutable provenance survives into HistoricalPlan.

If historical publication lacks enough accepted-lineage evidence for a claim, expose that limitation explicitly.

Do not reconstruct historical lineage from current mutable Goal state.

---

## 31. G2 Execution Relationship

Execution may refer to scheduled/published Goal work.

G2 MAY expose existing execution relationship where lawful.

It MUST NOT treat:

```text
executed
```

as synonymous with:

```text
accepted
realized
published
Progress
```

Likewise, execution correction/retraction does not rewrite accepted planning provenance.

---

## 32. G2 Progress Boundary

Task 9.19 MUST preserve:

> **Progress is independent from schedule geometry.**

Do not calculate Goal Progress from:

```text
scheduled duration
realized duration
published duration
execution duration
```

unless the Goal's existing measurement semantics explicitly define such a contribution and the canonical Progress owner already performs that calculation.

G2 may expose Progress references/context if already canonical.

It must not invent Progress.

---

## 33. G2 Query Shapes

Discovery MUST determine the useful canonical query directions.

At minimum evaluate whether the repository needs:

```text
lineage for scheduled Goal-work fact
lineage for accepted allocation
accepted planning for Goal
accepted planning for owner-day/range
```

Do not implement every possible query merely for completeness.

Implement the minimum bounded query set required to support:

```text
later Day Worksurface
later Summary convergence
Review Plan provenance
dogfood Network+ scenario
```

without creating a giant query API.

---

## 34. G1 / G2 Shared Vocabulary

If G1 and G2 share references/types, they MAY use a bounded common vocabulary for concepts such as:

```text
evidence availability
authority layer
product subject reference
provenance reference
protection
```

Do not create:

```text
CanonicalProductTruth
EverythingEvidence
UnifiedAuthorityObject
```

or equivalent mega-model.

The architecture should remain compositional.

---

## 35. Query Layer Placement

Place G1/G2 logic at the canonical read-model/query layer appropriate to repository architecture.

Do not place semantic composition in:

```text
React components
CSS
navigation hook
display helpers
component-local useMemo
```

except for trivial presentation formatting of already canonical output.

Prefer pure/core query composition where possible, with state adapters only for obtaining authoritative records.

The RESULT MUST justify module placement.

---

## 36. Store Integration

If state/store surfaces are needed, they MUST be lazy/read-only query entry points.

Do not subscribe the application shell to broad new store state merely to make projections available.

Do not persist projection results.

Do not cache them as authority.

If memoization is used for performance, it must remain disposable and semantically safe.

---

## 37. No Persistence Changes

Task 9.19 MUST NOT change:

```text
Active schema
Profile schema
Backup schema
HistoricalPlan schema
ExecutionHistory schema
PlanDecision schema
Sleep execution schema
```

unless discovery proves a required canonical provenance link literally cannot exist without persistence evolution.

If that occurs:

```text
STOP CONDITION — ARCHITECTURE DECISION REQUIRED
```

Do not bump a schema under this task.

---

## 38. Historical Immutability

G1/G2 MUST read immutable historical evidence without rewriting it to match current source state.

Examples:

- current Goal title change must not silently alter frozen historical evidence if history already freezes the relevant label;
- current Demand changes must not rewrite accepted historical planning;
- current Sleep requirement changes must not rewrite published Sleep;
- current Commitment edits must not rewrite historical publication.

Projection may join current source context only when clearly identified as current context rather than historical truth.

---

## 39. Protection Propagation

If a canonical source required for a projection is protected, the projection MUST fail closed for claims depending on that source.

Do not expose:

```text
false
0
[]
```

where the truthful state is:

```text
cannot safely determine
```

Protection may be scoped.

If one independent evidence family is protected and another is safely readable, the projection MAY return partial evidence only if the output explicitly communicates the scoped protection.

---

## 40. Error / Unknown / Empty Discipline

The projection API MUST allow consumers to distinguish as applicable:

```text
empty
not applicable
unknown
incomplete
protected
invalid
error
```

Do not over-generalize if existing repository types use more precise states.

At minimum, a consumer must never need to infer:

```text
[] = no evidence
```

when `[]` could also mean query failure or protection.

---

## 41. Ordering

Projected evidence MUST use deterministic ordering appropriate to its semantics.

Possible order keys may include:

```text
physical start
owner-local start
semantic role
durable reference
```

Use repository evidence.

Do not rely on database iteration order.

For equal-time items, use a stable deterministic tiebreaker.

Document ordering rules.

---

## 42. Time Representation

Reuse existing canonical time representations.

Do not introduce a second date/time abstraction.

Projection output must retain enough information for later UI to correctly display:

```text
cross-midnight Work
cross-midnight Sleep
owner-day context
physical instant
local wall time
timezone / owner offset where frozen history requires it
```

Do not convert historical frozen offsets to current timezone assumptions.

---

## 43. Range Semantics

If G2 supports owner-day/range queries, use existing canonical half-open range conventions where applicable.

Do not silently create another range model.

Keep distinct:

```text
selected owner day
Review Scope
Planning Data Horizon
Proposal Horizon
Publication Range
historical query range
```

A G1 selected-day query MUST NOT mutate or imply any of those planning ranges.

---

## 44. Product-Facing Copy Boundary

Task 9.19 is primarily a semantic/read-model task.

Do not perform broad copy convergence.

If minimal consumer wiring is required for validation, use existing Task 9.17 vocabulary.

Do not expose internal identifiers or architecture terms directly to ordinary users.

---

## 45. Minimal Consumer Integration

Task 9.19 MAY integrate G1/G2 into existing UI only where necessary to prove:

```text
the projection is product-consumable
the projection does not require React reconstruction
the projection does not regress mobile reachability
```

It SHALL NOT implement the final:

```text
Day Worksurface
accepted-planning Summary
Goal provenance UI
Review Plan redesign
historical recovery UI
```

A small diagnostic/product-compatible consumer is acceptable only if it does not become permanent architecture by accident.

Prefer tests over temporary visible UI.

---

## 46. No Day Worksurface Yet

Task 9.19 MUST NOT merge:

```text
Calendar selected day
Today
Daily Workspace
historical reporting
```

into the final Day Worksurface.

The purpose of Task 9.19 is to make that future convergence semantically safe.

Compatibility surfaces remain until parity is proven later.

---

## 47. No Summary Convergence Yet

Task 9.19 MUST NOT replace the existing Summary.

G2 provides a foundation for later Summary convergence.

Do not introduce new Summary sections merely because lineage is now queryable.

---

## 48. HistoricalPlan Recovery Boundary

General HistoricalPlan recovery remains outside scope.

Task 9.19 MAY improve the ability to identify that evidence is protected.

It MUST NOT:

```text
repair
rebuild
abandon
delete
normalize
```

protected history.

Existing recovery/export/recheck commands remain untouched unless required for read-only inspection.

---

## 49. Found Time Boundary

Do not create Found Time semantics.

If manual Goal-associated events appear in G1, preserve their actual current type and Goal association.

Do not label them Found Time unless the repository already canonically establishes that semantic.

Do not convert their duration into Progress.

---

## 50. Recurring Goal Demand Boundary

Do not implement recurring Goal Demand.

G2 must faithfully represent existing Demand identity and accepted planning.

Do not infer recurrence from multiple accepted iterations.

---

## 51. Sleep Architecture Boundary

Do not modify First-Class Sleep semantics established by Tasks 9.10–9.16.

G1 may consume canonical Sleep evidence.

G2 should only touch Sleep if discovery proves accepted-planning lineage legitimately references it.

Do not force Sleep into Goal-planning provenance.

---

## 52. Friction Boundary

G1 MAY expose existing day-scoped Friction/attention evidence if a canonical read model already supports it and it is needed for later Day convergence.

Do not merge:

```text
Friction
Proposal
SuggestedFix
```

into a generic attention object that loses authority distinctions.

Constructive planning and corrective planning remain distinct.

---

## 53. Publication Readiness Boundary

Do not recalculate publication readiness inside G1.

If later consumers require readiness context, use the canonical readiness owner/query.

Task 9.19 does not change publication blockers.

---

## 54. Performance Requirement

G1 is expected to be called during ordinary day navigation.

It must therefore be bounded and reasonably efficient.

Avoid:

```text
full-history scans per selected day
all-Goal scans where indexed canonical relationships exist
re-running the full scheduling engine unnecessarily
re-solving Sleep when a canonical query already owns that derivation
```

Measure representative query behavior.

Do not introduce an optimization that weakens correctness.

---

## 55. Large-Dataset Discipline

Test or inspect behavior with representative larger data where practical:

```text
many Commitments
multiple Goals
multiple accepted planning iterations
realized Goal facts
publication history
execution history
Sleep history
manual events
```

The query must remain bounded to its requested owner day/range wherever architecture allows.

Do not optimize by discarding provenance.

---

## 56. Deterministic Snapshot Tests

Add deterministic fixtures that exercise:

```text
past day
current day
future day
cross-midnight ownership
published vs generated
published vs actual
missing execution
explicit nonexecution
protected history
multiple accepted iterations
accepted-but-unrealized allocation
realized productive/support/protection facts
```

Prefer semantic assertions over giant brittle textual snapshots.

---

## 57. Network+ Provenance Regression

Create a focused regression equivalent to:

```text
Goal: Network+ Study

Demand / accepted iteration A:
    Proposal A
    Accepted Allocation A
    10h accepted
    realized facts A

Demand / accepted iteration B:
    Proposal B
    Accepted Allocation B
    20h accepted
    realized facts B
```

Prove:

```text
A remains A
B remains B
A + B are not merged at the evidence layer
scheduled fact A resolves to accepted lineage A
scheduled fact B resolves to accepted lineage B
shared Goal identity does not erase accepted iteration identity
```

If the repository's actual object relationships differ, model the equivalent canonical case.

---

## 58. Historical Mutation Regression

Where existing immutable publication contains relevant Goal/Sleep/Commitment evidence, mutate current authored state in a test fixture and prove the historical projection remains based on frozen historical authority.

Do not mutate real dogfood state.

---

## 59. Protection Regression

Create coverage proving:

```text
protected historical source
≠
empty evidence
```

If partial evidence is supported, prove protected families remain explicitly protected while independent readable evidence remains readable.

---

## 60. Unknown Regression

Create coverage proving:

```text
missing execution
≠
explicit nonexecution
```

and where applicable:

```text
unknown lineage
≠
no lineage exists
```

Do not use falsy values ambiguously.

---

## 61. Read-Only Mutation Regression

Call G1 and G2 through their public state/query entry points while observing authoritative persistence/commands.

Prove the queries do not:

```text
write storage
publish
record execution
record Progress
accept Proposal
realize allocation
modify Sleep
repair history
save authored state
```

---

## 62. Mobile Acceptance Gate

Task 9.19 remains governed by the standing Mobile Acceptance Gate.

Because this is primarily a read-model task, the gate applies in two ways.

### Projection Requirement

The projection MUST support mobile progressive disclosure.

It MUST NOT require a consumer to receive only a giant preformatted desktop-oriented structure.

Evidence should be composable enough for later mobile UI to show:

```text
primary item identity
time
subject
authority/status
attention
provenance summary
```

and reveal deeper provenance/details progressively.

Do not sacrifice semantic completeness merely to shorten the structure.

### User-Visible Changes

If Task 9.19 changes any user-visible surface:

- [ ] validate at approximately 320–360px;
- [ ] validate at approximately 390–430px;
- [ ] validate at 768px;
- [ ] validate at ≥1024px;
- [ ] no unintended horizontal overflow;
- [ ] no required hover/right-click/double-click;
- [ ] touch targets remain practical;
- [ ] existing Planner navigation remains reachable;
- [ ] existing Summary navigation remains reachable;
- [ ] back behavior remains coherent;
- [ ] no desktop-only evidence path;
- [ ] mobile and desktop consume identical authority.

If no user-visible surface changes, state:

```text
Mobile Acceptance Gate: NO NEW USER-VISIBLE INTERACTION; EXISTING 9.18 GATE RE-VALIDATED FOR REGRESSION.
```

and run sufficient smoke/regression validation to support that claim.

---

## 63. Bundle Gate

Task 9.18 final baseline:

```text
Initial raw JavaScript:      615,328 bytes
Initial gzip JavaScript:     161,183 bytes
Hard limit:                  170,000 bytes
Remaining hard headroom:       8,817 bytes
Largest lazy JS chunk:        59,666 bytes
Total JavaScript:          1,127,979 bytes
```

Task 9.19 MUST preserve:

```text
initial gzip ≤ 170,000 bytes
```

Do not raise the threshold.

Because Task 9.19 is primarily semantic/query work, avoid pulling heavy query code eagerly into the navigation shell unless required.

If projections are only needed by lazy feature surfaces, preserve appropriate lazy boundaries.

Total JavaScript remains an architecture concern even if initial gzip passes.

---

## 64. No New Dependency Requirement

Do not add a dependency unless the task is impossible using the existing repository stack.

A new state/query/date utility library is not justified merely for convenience.

If a dependency appears necessary:

```text
STOP CONDITION — ARCHITECTURE DECISION REQUIRED
```

and explain why existing infrastructure is insufficient.

---

## 65. Required G1 Contract Documentation

The RESULT MUST include a precise G1 contract documenting:

```text
public query entry point(s)
input
ownerDay semantics
asOf semantics
output states
evidence families
authority source for each family
identity/provenance fields
ordering
protection behavior
completeness behavior
action eligibility behavior
determinism
mutation behavior
```

Do not merely list TypeScript interfaces.

Explain semantic meaning.

---

## 66. Required G2 Contract Documentation

The RESULT MUST include a precise G2 contract documenting:

```text
public query entry point(s)
supported query directions
Goal reference
Demand reference
Proposal reference
Accepted Allocation reference
Realization reference
scheduled fact reference
support/protection lineage
publication relationship
execution relationship
currentness semantics
unknown semantics
ordering
determinism
mutation behavior
```

Again, document semantics rather than only code shapes.

---

## 67. Required Authority-Source Matrix

Create:

| Projected Evidence | Canonical Source | Authority Layer | Mutable/Frozen | Can Be Protected? | Projection May Infer? |
|---|---|---|---|---:|---:|

Include all G1/G2 evidence families actually implemented.

Expected final column should generally be:

```text
NO
```

except for lawful deterministic classification explicitly owned by the projection contract.

---

## 68. Required Temporal-Semantics Matrix

Create:

| Field / Claim | ownerDay | asOf | Frozen Historical Time | Current Source Time |
|---|---:|---:|---:|---:|

Document which temporal coordinate governs each important projected claim.

This matrix MUST make owner-day/as-of separation reviewable.

---

## 69. Required Identity / Provenance Matrix

Create:

| Product Subject | Durable Identity Source | Parent/Origin Reference | Historical Identity Available? | Heuristic Used? |
|---|---|---|---:|---:|

Any `Heuristic Used? = Yes` requires explicit justification.

Heuristics MUST NOT establish authority lineage.

---

## 70. Required Availability-State Matrix

Create:

| Situation | Projection State | Items Returned? | Consumer Meaning |
|---|---|---:|---|

Include at minimum:

```text
complete with evidence
complete with zero evidence
not applicable
unknown
incomplete
protected
invalid/error if represented
```

Use actual implemented vocabulary.

---

## 71. Required G2 Lineage Matrix

Create a concrete lineage table for the Network+ equivalent regression:

| Scheduled Fact | Goal | Demand | Proposal | Accepted Allocation | Realization | Role |
|---|---|---|---|---|---|---|

Show that distinct accepted iterations remain distinguishable.

---

## 72. Required Consumer-Reuse Assessment

Identify current/future consumers for each projection.

At minimum assess:

```text
Calendar selected day
Today
future Day Worksurface
Review Plan
Goals
Summary
historical reporting
```

Classify each:

```text
READY TO CONSUME
NEEDS LATER CONVERGENCE
NOT APPLICABLE
BLOCKED BY OTHER GAP
```

Do not migrate all consumers in this task.

---

## 73. Required Compatibility Assessment

Explain how Task 9.19 affects the compatibility surfaces retained by Task 9.18.

Answer:

```text
Can Calendar later consume G1?
Can Today later be replaced by G1-based Day composition?
Can historical reporting consume G1?
Can Review Plan consume G2 provenance?
Can Summary consume G2?
Which compatibility surface can eventually retire after these projections?
Which still requires additional product work?
```

---

## 74. Required Projection Dependency Graph

Produce a dependency graph showing:

```text
canonical authority owners
        ↓
low-level canonical queries
        ↓
G1 and/or G2 projection
        ↓
future product consumers
```

The graph must make clear that product surfaces do not become semantic owners.

---

## 75. Required Architecture Decision Record

If Task 9.19 introduces a new canonical projection concept with architectural significance, update or create the appropriate architecture documentation/ADR.

The documentation must state:

```text
projection is read-only
projection is disposable
projection owns no time
projection owns no persistence
projection cannot create authority
projection cannot repair authority
```

Do not create an ADR merely for trivial file organization.

Document whether an ADR was required.

---

## 76. Required Test Inventory

The RESULT MUST list focused tests by semantic purpose.

At minimum identify coverage for:

```text
owner-day/as-of separation
non-midnight boundary
past/current/future
published/planned/actual distinction
protected evidence
unknown vs explicit nonexecution
determinism
read-only behavior
Network+ multi-acceptance provenance
accepted-but-unrealized planning
productive/support/protection lineage
historical immutability
```

---

## 77. Required Performance Evidence

Measure representative G1/G2 query behavior in a controlled local fixture where practical.

Record:

```text
fixture scale
query type
number of runs if repeated
observed local timing
whether timing is diagnostic only
```

Do not establish arbitrary performance promises from one machine.

The goal is to detect pathological architecture, not certify a benchmark.

---

## 78. Required Repository Hygiene

Before implementation:

1. record `git rev-parse HEAD`;
2. record `git status --short`;
3. preserve the Task 9.18 dirty-tree baseline;
4. identify pre-existing dirty/untracked files;
5. record test baseline;
6. record bundle baseline;
7. preserve dogfood evidence.

During implementation:

- do not clear real dogfood state;
- use disposable fixtures/browser profiles;
- do not repair historical authority;
- do not normalize persisted state;
- do not commit;
- do not push.

After implementation:

1. inspect `git status --short`;
2. compare against the pre-task baseline;
3. inspect task-specific diff;
4. run `git diff --check`;
5. account for every Task 9.19 file;
6. confirm no unauthorized schema/dependency change.

---

## 79. Validation Commands

Run repository canonical equivalents of:

```text
npm run format
npx prettier --check .
npm run lint
npm run test
npm run build
npm run check:bundle
git diff --check
```

Also run focused tests for G1/G2.

If a dedicated typecheck script exists, run it.

If user-visible integration changes occur, perform the required responsive/browser validation.

Record exact commands and results.

---

## 80. Test Baseline and Final Counts

Record:

```text
pre-task test-file count
pre-task test count
post-task test-file count
post-task test count
new Task 9.19 test files
new Task 9.19 tests
```

Do not weaken existing tests.

Tests that encode obsolete implementation detail may be lawfully updated only if the accepted semantic contract remains equally or more strongly covered.

---

## 81. Bundle Measurements

Record final:

```text
initial raw
initial gzip
hard threshold
remaining hard headroom
largest lazy chunk
total JavaScript
delta from Task 9.18 baseline
```

If the local pre-task baseline differs from the recorded 9.18 final result, measure actual pre-task output and explain the difference.

---

## 82. Prohibited Changes

Do **not**:

- implement the final Day Worksurface;
- perform full Summary convergence;
- redesign Planner navigation;
- redesign Summary navigation;
- add a third primary destination;
- implement HistoricalPlan recovery;
- implement Found Time;
- implement recurring Goal Demand;
- implement ongoing Goal architecture;
- redesign Goal Progress;
- infer Progress from schedule duration;
- redesign First-Class Sleep;
- modify Sleep solver semantics;
- modify Sleep publication/execution semantics;
- modify legacy Sleep conversion;
- redesign Capacity;
- redesign Allocation;
- redesign Proposal;
- redesign Friction;
- redesign SuggestedFix;
- change publication readiness policy;
- change publication commit semantics;
- change execution semantics;
- mutate historical authority;
- create a generic mega-model of all DayFrame truth;
- reconstruct semantic provenance from title/time similarity;
- treat latest accepted iteration as current without authority;
- fabricate historical as-of time;
- persist G1/G2 results;
- bump persistence schemas;
- add a routing framework;
- add a state-management framework;
- add a date/time library;
- add an external service;
- add LLM authority;
- raise the bundle threshold;
- clear dogfood evidence;
- commit;
- push.

---

## 83. Stop Conditions

Stop and return Task 9.19 as INCOMPLETE if:

```text
G1 requires changing historical authority
G1 requires fabricating past/future as-of semantics
G2 lacks canonical references needed for provenance
G2 requires title/time heuristics to establish authority
required lineage cannot survive without schema evolution
protection must be weakened to compose evidence
the projection would need to become persisted authority
a giant unified truth model is the only apparent design
currentness requires a normative rule not already established
a new dependency is required
the bundle hard gate cannot be preserved
```

For a stop condition, document:

```text
condition
repository evidence
affected requirement
why implementation would violate architecture
available alternatives
downstream consequence
decision required
```

Do not silently choose a normative architecture rule.

---

## 84. Required RESULT Artifact

Create exactly one durable Task 9.19 result artifact:

```text
PHASE_9_TASK_9_19_CANONICAL_PRODUCT_EVIDENCE_PROJECTION_V1_RESULT.md
```

Place it in the existing Phase 9 RESULT location.

The filename MUST contain:

```text
RESULT
```

Do not create multiple competing summaries.

---

## 85. Required RESULT Structure

The RESULT MUST contain these sections in this exact order:

```text
# Task 9.19 — Canonical Product Evidence Projection V1 RESULT

## 1. Executive Summary
## 2. Scope and Governing Constraints
## 3. Pre-Task Repository State
## 4. Task 9.17 / 9.18 Inputs Consumed
## 5. G1 Discovery
## 6. G2 Discovery
## 7. G1 / G2 Architecture Classification
## 8. Canonical Authority Owners Discovered
## 9. Existing Query / Read-Model Inventory
## 10. Projection Architecture Decision
## 11. Module Placement
## 12. Shared Evidence Vocabulary
## 13. G1 Public Contract
## 14. G1 Input Semantics
## 15. Owner-Day / As-Of Separation
## 16. Canonical Day Boundary Semantics
## 17. G1 Evidence Families
## 18. G1 Authority Layers
## 19. G1 Product Subjects
## 20. G1 Identity / Provenance
## 21. G1 Productive / Support / Protection Semantics
## 22. G1 Sleep Evidence
## 23. G1 Published Evidence
## 24. G1 Actual / Execution Evidence
## 25. G1 Manual Evidence
## 26. G1 Historical Evidence
## 27. G1 Protection Semantics
## 28. G1 Completeness / Availability
## 29. G1 Reporting Eligibility
## 30. G1 Action References
## 31. G1 Past-Day Contract
## 32. G1 Current-Day Contract
## 33. G1 Future-Day Contract
## 34. G1 Determinism
## 35. G1 Read-Only Audit
## 36. G2 Public Contract
## 37. G2 Query Directions
## 38. G2 Goal / Demand Relationship
## 39. G2 Proposal Provenance
## 40. G2 Accepted Allocation Provenance
## 41. G2 Realization Provenance
## 42. G2 Scheduled-Fact Provenance
## 43. G2 Productive / Support / Protection Lineage
## 44. G2 Accepted-but-Unrealized State
## 45. G2 Publication Relationship
## 46. G2 Execution Relationship
## 47. G2 Progress Boundary
## 48. G2 Currentness Semantics
## 49. Network+ Multi-Acceptance Regression
## 50. Authority-Source Matrix
## 51. Temporal-Semantics Matrix
## 52. Identity / Provenance Matrix
## 53. Availability-State Matrix
## 54. G2 Lineage Matrix
## 55. Ordering and Determinism
## 56. Protection Propagation
## 57. Historical Immutability
## 58. Unknown / Empty Discipline
## 59. Range Semantics
## 60. Store / State Integration
## 61. Persistence Audit
## 62. Schema Audit
## 63. Consumer-Reuse Assessment
## 64. Compatibility Assessment
## 65. Projection Dependency Graph
## 66. Architecture Documentation / ADR Assessment
## 67. Minimal Consumer Integration
## 68. Mobile Projection Suitability
## 69. Mobile Acceptance Gate
## 70. Accessibility Impact
## 71. Large-Dataset Assessment
## 72. Performance Evidence
## 73. Focused Test Inventory
## 74. Owner-Day / As-Of Regression
## 75. Boundary Regression
## 76. Past / Current / Future Regression
## 77. Published / Planned / Actual Regression
## 78. Protection Regression
## 79. Unknown / Nonexecution Regression
## 80. Read-Only Mutation Regression
## 81. Accepted-but-Unrealized Regression
## 82. Productive / Support / Protection Regression
## 83. Historical Mutation Regression
## 84. Full Regression Results
## 85. Build / Static Validation
## 86. Bundle Results
## 87. Repository Hygiene
## 88. Changed Files
## 89. Pre-Existing Dirty Files
## 90. Deferred Work
## 91. Newly Discovered Risks
## 92. Day Worksurface Readiness Assessment
## 93. Summary Convergence Readiness Assessment
## 94. Task 9.20 Dependency Assessment
## 95. Completion Assessment
```

---

## 86. Day Worksurface Readiness Assessment

The RESULT MUST answer:

```text
1. Can an arbitrary selected owner day now be queried without abusing Today?
2. Can past/current/future days use one semantic evidence foundation while preserving mode differences?
3. Can published, planned and actual evidence remain distinguishable?
4. Can protected evidence remain protected?
5. Can manual events be represented without pretending they are execution?
6. Can First-Class Sleep be represented across planning/publication/actual layers?
7. Can future Day Worksurface components consume G1 without reconstructing authority in React?
8. What remains before Calendar/Today/Daily Workspace can converge?
```

Do not implement that convergence.

---

## 87. Summary Convergence Readiness Assessment

The RESULT MUST answer:

```text
1. Can accepted planning now be traced from Goal/Demand through scheduled fact?
2. Can multiple accepted iterations remain distinct?
3. Can accepted-but-unrealized planning be represented?
4. Can productive/support/protection roles retain common provenance without semantic collapse?
5. Can publication/execution relationships be shown without conflating authority layers?
6. Can Summary consume G2 without title/timestamp heuristics?
7. What additional Summary-specific read models remain necessary?
```

Do not implement Summary convergence.

---

## 88. Task 9.20 Dependency Assessment

Determine the next bounded convergence task from repository evidence after G1/G2 implementation.

Expected candidates include:

```text
Day Worksurface convergence
protected historical access/recovery prerequisite
a remaining projection split
```

Do not assume the next task merely because Task 9.17 proposed an ordering.

Answer:

```text
1. Is G1 complete?
2. Is G2 complete?
3. Are they independent projections or a shared foundation?
4. Is HistoricalPlan recovery now a prerequisite for Day convergence, or can protected states remain safely represented during convergence?
5. Is the Planner shell ready to consume G1?
6. Is Summary ready to consume G2?
7. What is the smallest next bounded task?
8. What Mobile Acceptance Gate requirements must it inherit?
9. What bundle headroom remains?
```

Do not implement Task 9.20.

---

## 89. Completion Criteria

Task 9.19 is COMPLETE only if all applicable requirements are satisfied.

### Discovery

- [ ] G1 canonical owners identified.
- [ ] G2 canonical owners identified.
- [ ] architecture classified as Model A/B/C/D/E.
- [ ] no artificial mega-model created.
- [ ] module placement justified.

### G1

- [ ] arbitrary selected owner day can be queried canonically.
- [ ] ownerDay and asOf remain distinct.
- [ ] canonical user-day semantics reused.
- [ ] past/current/future contracts defined.
- [ ] planned/published/actual remain distinct.
- [ ] manual evidence remains distinct.
- [ ] Sleep layers remain distinct.
- [ ] protection remains fail-closed.
- [ ] complete-empty differs from unavailable.
- [ ] stable identity/provenance retained.
- [ ] productive/support/protection distinctions retained.
- [ ] reporting eligibility uses existing command semantics only.
- [ ] query is deterministic.
- [ ] query is read-only.

### G2

- [ ] Goal/Demand relationship is traceable.
- [ ] Proposal provenance is traceable.
- [ ] Accepted Allocation provenance is traceable.
- [ ] Realization provenance is traceable.
- [ ] scheduled Goal facts resolve to accepted lineage.
- [ ] multiple accepted iterations remain distinct.
- [ ] Network+ equivalent regression passes.
- [ ] accepted-but-unrealized planning remains representable.
- [ ] productive/support/protection lineage remains distinct.
- [ ] publication relationship remains distinct.
- [ ] execution relationship remains distinct.
- [ ] Progress is not inferred.
- [ ] currentness is not inferred from timestamps/titles.
- [ ] unknown lineage remains distinguishable from no lineage.

### Authority

- [ ] projection owns no authority.
- [ ] projection owns no time.
- [ ] projection owns no persistence.
- [ ] projection cannot repair history.
- [ ] projection cannot accept planning.
- [ ] projection cannot publish.
- [ ] projection cannot record execution.
- [ ] projection cannot record Progress.
- [ ] historical immutable evidence remains frozen.
- [ ] protection propagation is lawful.

### Persistence

- [ ] no Active schema bump.
- [ ] no Profile schema bump.
- [ ] no Backup schema bump.
- [ ] no HistoricalPlan schema bump.
- [ ] no ExecutionHistory schema bump.
- [ ] no new persisted projection cache.

### Product

- [ ] no final Day Worksurface implemented.
- [ ] no full Summary convergence implemented.
- [ ] existing 9.18 navigation remains intact.
- [ ] compatibility surfaces remain until later parity.
- [ ] consumer-reuse assessment complete.

### Mobile Acceptance Gate

- [ ] projection structure supports progressive disclosure.
- [ ] no desktop-specific semantic shape.
- [ ] mobile and desktop consume identical authority.
- [ ] any user-visible changes pass narrow-phone validation.
- [ ] no regression to 9.18 Planner/Summary reachability.
- [ ] no unintended horizontal overflow from touched UI.
- [ ] no new desktop-only interaction.
- [ ] bundle gate passes.

### Validation

- [ ] focused G1/G2 tests pass.
- [ ] full tests pass.
- [ ] format passes.
- [ ] Prettier passes.
- [ ] lint passes.
- [ ] build passes.
- [ ] bundle passes.
- [ ] `git diff --check` passes.
- [ ] performance evidence recorded.
- [ ] changed files accounted for.
- [ ] no unauthorized dependency.
- [ ] no commit.
- [ ] no push.
- [ ] required RESULT exists.

---

## 90. Final Completion Statement

If and only if every required completion criterion is satisfied, end the RESULT with exactly:

```text
Task 9.19 — Canonical Product Evidence Projection V1 is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.19 — Canonical Product Evidence Projection V1 is INCOMPLETE.
```

Then identify the exact blockers.

---

## 91. Governing Convergence Principle

Task 9.18 established where the user goes.

Task 9.19 establishes how those future product surfaces can ask what is true.

The intended architecture is:

```text
AUTHORITATIVE OWNERS
        │
        ├── authored schedule
        ├── Goal / Demand / Proposal / Accepted Allocation
        ├── realization
        ├── publication
        ├── execution
        ├── Progress
        ├── HistoricalPlan
        └── First-Class Sleep authority
        │
        ▼
CANONICAL READ MODELS / QUERIES
        │
        ├── G1 Selected-Day Evidence Projection
        │
        └── G2 Accepted-Planning Lineage Projection
        │
        ▼
PRODUCT SURFACES
        │
        ├── Calendar
        ├── future Day Worksurface
        ├── Today compatibility path
        ├── Goals
        ├── Review Plan
        └── Summary
```

The final governing rules are:

> **The selected day is not the as-of instant.**

> **Planned is not published. Published is not actual. Actual is not Progress.**

> **A projection may compose authority, but it may never become authority.**

> **Provenance must come from durable canonical references, never from title, time, or visual similarity.**

> **Multiple accepted planning iterations remain distinct until explicit authority says otherwise.**

> **Protected and unknown evidence must remain visible as protected and unknown, never disguised as empty.**

> **The future Day Worksurface must consume canonical evidence rather than reconstructing DayFrame semantics in React.**

> **Mobile may disclose evidence progressively, but it receives the same truth as desktop.**