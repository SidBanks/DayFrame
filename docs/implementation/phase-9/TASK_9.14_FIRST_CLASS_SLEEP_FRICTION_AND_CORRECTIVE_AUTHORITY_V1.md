# Task 9.14 — First-Class Sleep Friction & Corrective Authority V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Friction / Suggested Fix / bounded Accepted authority / corrective planning  
**Primary Specification:** Task 9.10 — First-Class Sleep Architecture Specification  
**Prerequisites:**  
- Task 9.11 — First-Class Sleep Domain & Persistence Foundation — COMPLETE  
- Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation — COMPLETE  
- Task 9.13 — First-Class Sleep Capacity & Planning Integration V1 — COMPLETE  
**Implementation Changes:** **AUTHORIZED WITHIN THIS TASK'S BOUNDED SCOPE**  
**Publication / Execution / History / Legacy Conversion:** **PROHIBITED**  
**Sleep Omission / Shortening / Protection Waiver:** **PROHIBITED**  
**UI Redesign:** **PROHIBITED**  
**Required Durable Output:** `PHASE_9_TASK_9_14_FIRST_CLASS_SLEEP_FRICTION_CORRECTIVE_AUTHORITY_V1_RESULT.md`

---

## 1. Objective

Implement the first bounded corrective-authority layer for First-Class Sleep.

Tasks 9.10–9.13 established:

```text
Task 9.10
what First-Class Sleep is
        ↓
Task 9.11
durable authored Sleep requirement
        ↓
Task 9.12
derived Sleep occurrences
+
physical domains
+
complete bounded joint feasibility
        ↓
Task 9.13
Sleep-qualified planning
+
ordinary Commitment placement
+
Capacity
+
Goal feasibility
+
Competition
+
Allocation
+
Proposal
+
realization eligibility
```

Task 9.14 must now allow DayFrame to represent and resolve **proven required-Sleep incompatibility** through the existing corrective authority architecture:

```text
proven Sleep incompatibility
        ↓
typed Sleep Friction
        ↓
lawful Suggested Fix
        ↓
Try
        ↓
explicit user acceptance
        ↓
bounded accepted Sleep placement
        ↓
fresh Sleep revalidation
        ↓
planning recomputation
```

The governing rule is:

> **Task 9.14 may allow the user to choose where required Sleep occurs within an already-lawful Sleep domain. It may not allow the user to choose whether required Sleep exists, how much Sleep is required, or whether its required protection applies.**

At completion, DayFrame should support explicit, bounded, revocable accepted placement corrections for First-Class Sleep without weakening First-Class Sleep requiredness.

---

## 2. Core Authority Boundary

Task 9.14 introduces the first accepted First-Class Sleep authority.

That authority is narrow.

An accepted Sleep placement means only:

```text
For this exact durable Sleep occurrence,
under this exact source lifetime and compatible authored requirement,
the user accepted this exact lawful physical placement.
```

It does **not** mean:

```text
Sleep is optional
Sleep may be shortened
Sleep buffers may be reduced
Sleep may be split
Sleep may be omitted
Sleep requiredness may be waived
future Sleep occurrences inherit this placement
the user changed the authored Sleep requirement
```

The accepted correction is a bounded placement decision.

It is not a new authored Sleep rule.

---

## 3. Governing Authority Chain

Preserve:

```text
Authored SleepRequirementV1
        ↓
Derived SleepOccurrenceV1
        ↓
Derived SleepResolutionV1
        ↓
Derived Sleep Friction
        ↓
Derived Suggested Fix
        ↓
Try
        ↓
explicit user decision
        ↓
Accepted Sleep placement
        ↓
fresh Derived Sleep resolution
        ↓
ordinary planning
```

The accepted placement has greater authority than ordinary derived Sleep ranking for the exact targeted occurrence.

It does not outrank:

```text
the authored requirement itself
Work
fixed/locked higher-authority geometry
existing realized facts
historical publication authority
```

unless existing architecture explicitly establishes otherwise.

Do not invent a new authority hierarchy ad hoc.

---

## 4. Canonical Corrective Principle

The solver normally answers:

```text
Where should this required Sleep occurrence go?
```

using deterministic canonical ranking.

An accepted Sleep placement changes that question to:

```text
Can this exact accepted placement still lawfully satisfy
this exact required Sleep occurrence
under current authoritative dependencies?
```

If yes:

```text
the accepted placement constrains the solver.
```

If no:

```text
retain the accepted decision as evidence
but do not silently apply it.
```

The result must become an explicit:

```text
reviewRequired
stale
inapplicable
```

state according to the canonical model implemented in this task.

Do not silently move the accepted placement.

Do not silently delete it.

---

## 5. Required Pre-Implementation Audit

Before editing code, trace the actual production owners for:

### First-Class Sleep

At minimum inspect:

```text
core/sleep/sleepRequirement.ts
core/sleep/sleepResolution.ts
core/sleep/deriveSleepOccurrences.ts
core/sleep/sleepFoundationalOccupancy.ts
core/sleep/solveRequiredSleep.ts
core/sleep/resolveRequiredSleep.ts
core/planning/foundationalPlanning.ts
core/planning/deriveFoundationalSchedule.ts
```

### Existing Friction

Trace:

```text
detectScheduleFriction
FrictionPoint
friction identity
blocking versus non-blocking semantics
canIgnore
range ownership
source references
physical evidence
```

Determine whether First-Class Sleep should extend the existing Friction model or use a typed family within the same semantic owner.

Do not create a parallel unrelated “Sleep warning” system.

### Existing Suggested Fix

Trace:

```text
generateSuggestedFixes
SuggestedFix identity
SuggestedFix applicability
Try behavior
accept behavior
move correction
stale correction handling
```

Determine what can be reused safely.

### Existing PlanDecision

Trace:

```text
PlanDecision
decision versions
accepted move payloads
durable occurrence references
source incarnation validation
replay
revocation if any
persistence ownership
profiles
backup
restore
clear
```

Task 9.10 anticipated a future `AcceptedSleepPlacementPayloadV1`.

Determine whether this should extend the existing PlanDecision authority family.

Prefer existing accepted-decision ownership unless evidence proves it cannot represent the semantics safely.

### Corrective Preview

Trace:

```text
reviseSchedulePreview
Try
applySuggestedFix
accepted corrective movement
physical occupancy
revision identity
```

### Publication readiness

Trace only enough to establish whether unresolved Sleep Friction or stale accepted Sleep placement should block existing readiness.

Do not implement First-Class Sleep publication.

### Persistence

Trace:

```text
Active
PlanDecision
Profiles
Backup
Restore
Clear
```

Identify exactly which persisted authority surface owns an accepted Sleep placement.

Record the complete trace in the RESULT.

---

## 6. Proven Incompatibility Versus Unknown Feasibility

Task 9.12 distinguishes:

```text
infeasible
searchIncomplete
contextIncomplete
invalid
protected
```

Task 9.14 must preserve these distinctions.

Only a complete negative feasibility proof may create:

```text
required-Sleep incompatibility Friction
```

Therefore:

```text
SleepResolution.status === 'infeasible'
```

may create Sleep Friction.

But:

```text
searchIncomplete
contextIncomplete
invalid
protected
```

must **not** be mislabeled as physical incompatibility.

They may continue to block planning/readiness through their existing qualification semantics.

Do not create fake Friction merely because planning is blocked.

---

## 7. Sleep Friction Semantics

Introduce or extend a canonical Friction representation for:

```text
required Sleep cannot be satisfied
within the complete bounded physical problem
because authoritative geometry is incompatible.
```

The Friction must retain:

- durable Sleep occurrence references;
- Sleep source lifetime;
- effective requirement revision;
- owner-day labels;
- requested/guard membership where relevant;
- complete relevant physical domains;
- required activity duration;
- before-buffer;
- after-buffer;
- authoritative blockers;
- blocker source references;
- proof scope;
- dependency fingerprint;
- infeasibility reason;
- whether the conflict affects requested or guard occurrences.

Do not flatten this into UI text.

The Friction object must contain machine-readable evidence.

---

## 8. Friction Identity

Define stable Friction identity carefully.

Do not identify Sleep Friction solely by:

```text
display text
physical geometry
array index
solver search order
Preview block ID
```

Identity should be based on durable semantic participants and bounded problem identity.

At minimum consider:

```text
Sleep occurrence reference(s)
source incarnation(s)
conflicting authoritative references
conflict kind
proof/dependency fingerprint
```

The RESULT must document the exact identity rule and why it remains stable enough for corrective workflow while still detecting stale evidence.

---

## 9. Blocking Semantics

Required First-Class Sleep incompatibility is blocking.

Canonical behavior:

```text
canIgnore = false
```

for unresolved proven required-Sleep Friction.

Do not expose a generic:

```text
Ignore
Dismiss
Continue anyway
```

action that causes the planning engine to treat required Sleep as satisfied.

A user may change authored intent prospectively through normal Sleep authoring.

That is not the same as ignoring a specific conflict.

---

## 10. Sleep Friction Is Corrective, Not Constructive

Preserve:

```text
Friction
= incompatibility in current authority/derived planning
```

and:

```text
Proposal
= constructive option for satisfying demand
```

Do not turn Sleep Friction into Goal-style Proposal.

Do not route Sleep correction through Competition/Allocation.

Do not represent Sleep as Goal Demand.

Suggested Fix remains the corrective family.

---

## 11. Suggested Fix Policy

A Sleep Suggested Fix may propose only a correction that preserves the authored requirement.

Lawful V1 fix classes are limited to:

### A. Move required Sleep within its lawful domain

Example:

```text
current canonical derived placement:
23:00–07:00

alternative lawful placement:
22:00–06:00
```

provided:

- exact Sleep duration is preserved;
- exact required buffers are preserved;
- full footprint remains in the valid physical domain;
- all authoritative blockers are respected;
- the complete joint Sleep system remains feasible;
- occurrence identity is preserved.

### B. Move lower-authority ordinary flexible content

If existing Suggested Fix architecture can lawfully move:

```text
ordinary movable Commitment
```

out of the way while preserving required Sleep, this may remain available.

Do not create a second movement engine.

Use existing corrective semantics where safe.

### C. Direct authored edit guidance

The UI/read model may explain that changing the authored Sleep requirement or conflicting authored schedule is another path.

But:

```text
edit authored Sleep
```

is not itself an accepted Suggested Fix payload unless existing architecture explicitly models authored edits that way.

Prefer directing the user to the appropriate authoring surface.

---

## 12. Prohibited Suggested Fixes

No Sleep Suggested Fix may:

- omit required Sleep;
- shorten Sleep;
- split Sleep;
- reduce before-buffer;
- reduce after-buffer;
- reduce total protection;
- change requirement enabled state;
- change effective dates;
- change applicable weekdays;
- change authored window;
- change Work-relative span;
- change off-day fallback;
- change Sleep priority;
- invent a priority;
- ignore hard Work;
- move fixed/locked authority;
- move realized Goal work;
- move realized support;
- move realized protection;
- rewrite historical publication;
- fabricate Capacity.

These require different authority or are prohibited in V1.

---

## 13. No One-Off Sleep Override

Task 9.10 made a decisive V1 architecture choice:

> **No one-off Sleep omission, shortening, or protection-waiver override exists.**

Task 9.14 must preserve that decision.

Do not introduce:

```text
SleepOverride
Skip tonight
Sleep less this once
Ignore this Sleep conflict
Waive buffer
Proceed anyway
```

as authority.

If an existing generic Friction API assumes every Friction can be ignored, extend the model so required First-Class Sleep Friction can explicitly prohibit ignore.

Do not weaken Sleep semantics to fit an old UI abstraction.

---

## 14. Accepted Sleep Placement

Implement a bounded accepted placement payload equivalent to the Task 9.10 conceptual:

```text
AcceptedSleepPlacementPayloadV1
```

Use repository naming/versioning conventions.

It must identify at minimum:

```text
payload version
Sleep requirement ID
Sleep requirement incarnation ID
Sleep occurrence coordinate
owner user-day date
slot
accepted physical Sleep start
accepted physical Sleep end
accepted footprint start
accepted footprint end
requirement revision or compatible revision evidence
dependency fingerprint
decision provenance
```

Do not use geometry as the occurrence identity.

The canonical occurrence reference remains:

```text
source lifetime + owner day + slot
```

---

## 15. PlanDecision Integration

Prefer extending the existing PlanDecision authority owner.

The accepted Sleep placement should behave as:

```text
bounded accepted corrective authority
```

rather than a new persistence silo.

If PlanDecision must advance version:

- do so explicitly;
- preserve older decision variants;
- provide migration/validation;
- update Backup/restore only as required;
- protect unknown future variants;
- do not silently reinterpret old decisions.

If PlanDecision can safely support a new discriminated payload without a version bump under existing envelope semantics, document why.

Do not create:

```text
sleep-decisions-v1
```

as a separate local-storage owner unless architecture evidence makes that unavoidable.

---

## 16. Accepted Placement Is Not Authored Requirement

Do not mutate `SleepRequirementV1` when the user accepts a placement.

Example:

```text
authored window:
21:00–09:00

accepted occurrence placement:
23:00–07:00
```

must remain:

```text
Authored:
Sleep may lawfully occur within 21:00–09:00

Accepted:
this occurrence is pinned to 23:00–07:00
```

Do not rewrite the authored window to 23:00–07:00.

---

## 17. Accepted Placement Scope

The accepted placement applies to exactly one durable occurrence unless Task 9.10 explicitly specifies otherwise.

V1 scope:

```text
one Sleep requirement lifetime
+
one canonical owner day
+
slot 0
```

It must not automatically propagate to:

```text
tomorrow
same weekday next week
same shift segment
future cycle
all Night shifts
all Sleep occurrences
```

A recurring preference belongs in authored intent, not a bounded correction.

---

## 18. Solver Integration

Task 9.12's solver remains the canonical feasibility owner.

Do not create a separate “pinned Sleep solver.”

Instead, extend the canonical solver/problem representation so a valid accepted placement acts as an exact constraint for its targeted occurrence.

Conceptually:

```text
unconstrained occurrence
→ full lawful candidate domain

accepted-placement occurrence
→ candidate domain restricted to exact accepted start
```

Then run the same complete joint feasibility logic.

The solver must still consider:

```text
all required Sleep occurrences
all authoritative blockers
all mutual Sleep conflicts
guards
physical context
```

Do not merely inject the accepted block after solving.

---

## 19. Accepted Placement Revalidation

Every time current Sleep resolution is derived, an accepted placement must be revalidated against current authority.

At minimum validate:

- source ID;
- source incarnation;
- owner-day coordinate;
- slot;
- requirement applicability;
- current effective requirement;
- exact required duration;
- exact buffers;
- current valid domain;
- current Work anchor/context;
- current hard occupancy;
- current realized facts;
- current accepted exact authority;
- joint Sleep feasibility;
- current dependency fingerprint or equivalent semantic compatibility.

Do not trust a previously valid placement merely because the PlanDecision still exists.

---

## 20. Revision Compatibility

An accepted placement must not automatically become stale merely because:

```text
requirement revision number changed
```

if the new revision remains semantically compatible with the accepted exact placement.

Conversely, matching revision number alone must not prove validity if relevant dependencies changed.

Define explicit compatibility.

Examples:

### Compatible edit

```text
title/metadata change
```

if such metadata exists outside temporal semantics.

### Potentially compatible temporal edit

A widened valid window that still contains the exact accepted footprint and preserves duration/buffers may remain valid if all other dependencies match.

### Incompatible edit

```text
duration changes
buffers change
window excludes placement
applicability changes
Work-relative anchor changes so placement is outside domain
source recreated with new incarnation
```

must make the accepted placement review-required/inapplicable.

Document exact rules.

---

## 21. Accepted Placement Staleness

Do not silently discard stale accepted placement authority.

Retain the decision as evidence.

Expose a derived state equivalent to:

```text
applicable
reviewRequired
inapplicable
revoked
```

or reuse canonical PlanDecision terminology.

The important distinctions are:

```text
accepted and currently valid
accepted but dependencies changed
accepted but source lifetime no longer exists
explicitly revoked
```

Do not collapse them into:

```text
decision missing
```

---

## 22. Source Incarnation Safety

If a Sleep requirement is:

```text
deleted
```

and later:

```text
recreated
```

with the same logical/string ID but a new incarnation:

```text
old accepted Sleep placement must never apply.
```

It remains historical accepted evidence according to existing decision retention semantics.

No source-ID-only matching.

---

## 23. Try Semantics

`Try` must remain non-authoritative.

Trying a Sleep Suggested Fix may derive:

```text
trial Sleep solution
trial ordinary placement
trial Capacity
trial Goal feasibility
trial Friction
```

but must not write:

```text
PlanDecision
SleepRequirement
realized facts
publication
execution
history
```

The trial must use the same canonical solver with the proposed exact placement constraint.

Do not create a second approximate Try engine.

---

## 24. Try Must Recompute the Whole Relevant Sleep Problem

A proposed move of one Sleep occurrence may affect another required Sleep occurrence.

Therefore Try must not validate only:

```text
target Sleep does not overlap blocker
```

It must prove:

```text
the complete bounded Sleep problem remains satisfiable
with the proposed placement constrained.
```

This is especially important for:

```text
overlapping Sleep domains
guard occurrences
cycle transitions
cross-boundary occurrences
```

---

## 25. Accept Semantics

Acceptance must be explicit.

Do not write accepted Sleep placement merely because:

```text
Try succeeded
user opened the fix
Preview rendered the fix
solver selected an alternative
```

Only the existing explicit decision/accept action may create Accepted authority.

Acceptance must revalidate against current canonical state.

A successful Try from stale inputs is not sufficient.

---

## 26. Acceptance Race / Freshness

Required sequence:

```text
Suggested Fix derived
        ↓
Try
        ↓
time passes / state may change
        ↓
Accept
        ↓
fresh canonical revalidation
        ↓
write only if still valid
```

Test state changes between Try and Accept.

At minimum:

```text
Work edit
Sleep requirement edit
manual fixed Event edit
realized fact creation
source recreation
```

must prevent stale acceptance where appropriate.

---

## 27. Atomic Acceptance

Accepted Sleep placement persistence must follow existing atomic PlanDecision semantics.

Do not:

```text
write decision
then discover it is invalid
then try to clean it up
```

Validation must occur before the authority write.

If persistence fails:

```text
no partial accepted Sleep authority
```

must remain.

Use existing transaction/coordinator infrastructure.

---

## 28. Idempotent Acceptance

Repeated acceptance of the same already-accepted valid correction must not create duplicate accepted authority.

Define and test idempotence using existing PlanDecision identity/command semantics.

Do not rely solely on UI button disabling.

---

## 29. Revocation

Task 9.10 explicitly anticipated accepted Sleep placement revocation.

Task 9.14 must implement the minimum ordinary-user/domain command necessary to revoke a bounded accepted Sleep placement.

Revocation means:

```text
the accepted exact-placement constraint no longer applies prospectively
```

and the canonical Sleep solver returns to ordinary deterministic ranking.

Revocation does not:

- delete the authored Sleep requirement;
- omit Sleep;
- delete historical evidence of the prior acceptance;
- rewrite publication/history;
- change execution.

Use existing decision revocation/withdrawal semantics if available.

If no general revocation exists, introduce the narrowest architecture-consistent decision lifecycle necessary.

---

## 30. Revocation Evidence

Do not physically erase the fact that the user once accepted the placement if the existing PlanDecision architecture preserves decision history.

Prefer:

```text
accepted decision
+
revocation decision/event
```

or canonical equivalent.

The current effective decision may become absent, but provenance remains.

Document exact persistence semantics.

---

## 31. Re-Solve After Revocation

After revocation:

```text
Sleep must be freshly resolved
without the revoked exact placement constraint.
```

Downstream:

```text
ordinary placement
Capacity
Goal feasibility
Competition
Allocation
Proposal
realization eligibility
```

must consume the newly derived Sleep solution.

Do not reuse the old pinned geometry.

---

## 32. Sleep Friction and Accepted Placement

An accepted placement may itself become incompatible with current authority.

Distinguish:

```text
A. underlying Sleep requirement is physically infeasible regardless of pin
```

from:

```text
B. Sleep remains feasible, but the accepted pin is no longer valid
```

These are different corrective situations.

Case B should not necessarily claim:

```text
required Sleep is infeasible
```

if removing/revoking the stale pin restores feasibility.

Introduce a typed derived state such as:

```text
acceptedPlacementReviewRequired
```

or equivalent.

Do not misdiagnose stale accepted authority as biological/temporal infeasibility.

---

## 33. Pin-Induced Infeasibility

The canonical resolution model must distinguish:

```text
unconstrained requirement infeasible
```

from:

```text
requirement feasible,
accepted exact placement makes current constrained problem infeasible.
```

This distinction is required for useful corrective behavior.

A pin-induced incompatibility should guide the user toward:

```text
review/revoke/change accepted placement
```

not toward:

```text
change required Sleep
```

unless the underlying requirement is also infeasible.

---

## 34. Friction Generation Order

The derivation should conceptually evaluate:

```text
authored Sleep + hard authority
        ↓
accepted Sleep placement constraints
        ↓
current Sleep resolution
        ↓
accepted-placement applicability/review state
        ↓
Sleep Friction
```

Do not generate corrective Friction from stale Preview geometry.

Use current canonical authority.

---

## 35. Suggested Alternative Placement Search

When generating a move-Sleep Suggested Fix, do not simply choose:

```text
the next free gap
```

using generic greedy movement.

The proposed exact placement must come from the canonical Sleep feasibility system.

A valid approach is:

```text
derive lawful candidate placements
constrain target occurrence to candidate
run complete bounded joint feasibility
choose deterministic first lawful corrective candidate
```

or a semantically equivalent optimized approach.

The fix generator must never suggest a placement the canonical solver would reject.

---

## 36. Deterministic Corrective Candidate Ordering

Suggested Sleep placement corrections must be deterministic.

Define ordering using canonical semantics.

Prefer reuse of Task 9.12's candidate ranking:

```text
distance from preferred start
then earlier physical start
then durable reference ordering
```

while excluding the currently failing/invalid placement where appropriate.

Do not order by:

```text
object insertion
UI display order
randomness
wall clock
```

Document exact ordering.

---

## 37. Do Not Create Redundant Fixes

Avoid producing multiple Suggested Fixes that are semantically identical.

Examples:

```text
Move Sleep to 22:00
Move Sleep to 22:00
```

from different blocker enumeration paths must deduplicate.

Identity must be semantic.

---

## 38. Lower-Authority Flexible Content Fixes

If incompatibility can be resolved by moving ordinary movable content, use existing movement correction semantics.

Do not elevate ordinary flexible placement into hard authority merely because it appears in a Preview.

Be especially careful:

Task 9.12's actual `infeasible` state should already ignore ordinary movable Commitments as blockers.

Therefore a true foundational Sleep infeasibility should generally involve hard authority, not ordinary movable content.

If existing Preview-level Friction involves Sleep-qualified ordinary placement, preserve the distinction between:

```text
foundational Sleep infeasibility
```

and:

```text
ordinary movable scheduling conflict around satisfied Sleep.
```

Do not conflate them.

---

## 39. Hard Authority Cannot Be Moved by Sleep Fix

A Sleep Suggested Fix may not move:

```text
Work
fixed Commitment
manual fixed Event
accepted exact non-Sleep authority
realized Goal work
realized support
realized protected buffer
published historical authority
```

If those make the authored Sleep requirement impossible:

```text
Sleep Friction remains unresolved
```

until the relevant authority is lawfully edited through its own owner.

---

## 40. Authored Edit Versus Corrective Decision

Keep these distinct:

```text
Edit Sleep Requirement
```

changes prospective authored intent.

```text
Accept Sleep Placement
```

creates bounded accepted authority for one occurrence.

```text
Revoke Sleep Placement
```

removes that bounded accepted constraint prospectively.

Do not implement one by secretly invoking another.

---

## 41. Planning Integration After Accepted Placement

Task 9.13 established one solved-Sleep adapter.

Preserve it.

Once the accepted placement is applied by the solver:

```text
SleepResolutionV1.status === satisfied
```

must still produce the same downstream:

```text
foundationalPlanning
ordinary placement
Capacity
Goal feasibility
Competition
Allocation
Proposal
realization eligibility
```

No downstream consumer should need to know whether the selected Sleep geometry came from:

```text
canonical ranking
```

or:

```text
valid accepted placement
```

except for provenance/explanation.

Physical semantics remain identical.

---

## 42. Planning Integration After Review-Required Pin

If an accepted Sleep placement becomes review-required and the current architecture says it remains a blocking accepted constraint until reviewed:

```text
planning must fail closed.
```

If the architecture instead allows the solver to derive an unpinned diagnostic alternative while retaining the accepted decision as unresolved evidence:

```text
that diagnostic alternative must not silently become allocatable authority.
```

Choose one canonical behavior consistent with Task 9.10.

Document it explicitly.

Do not silently ignore stale Accepted authority.

---

## 43. Capacity Semantics

Accepted Sleep placement does not itself subtract Capacity.

The freshly resolved:

```text
ScheduledSleepOccurrenceV1
```

still supplies physical protection.

This preserves:

```text
Accepted decision
→ constrains derivation
→ derived solved Sleep
→ Capacity
```

rather than:

```text
Accepted decision geometry
→ directly subtract Capacity
```

Keep the authority layers distinct.

---

## 44. Goal Planning Semantics

Goal planning must continue consuming the same Sleep-qualified Capacity from 9.13.

Do not make Goals aware of:

```text
Sleep Suggested Fix
Sleep PlanDecision
Sleep Friction internals
```

except through ordinary planning qualification.

If a valid accepted placement changes Sleep geometry:

```text
Goal feasibility may change
Competition may change
Allocation may change
Proposal may change
```

through recomputation.

That is lawful derived consequence.

---

## 45. Existing Accepted Allocation Semantics

A newly accepted Sleep placement may invalidate physical assumptions behind an existing unrealized Accepted Allocation.

Preserve Task 9.13 behavior:

```text
retain Accepted Allocation
revalidate realization
reviewRequired/ineligible if mismatch
```

Do not delete or rewrite the prior accepted Goal choice.

---

## 46. Existing Realized Authority

Accepted Sleep placement must solve around existing realized authority.

It cannot move:

```text
realized Goal work
realized support
realized protection
```

If the requested exact Sleep placement conflicts with realized authority:

```text
Try fails
Accept fails
```

No write.

---

## 47. Publication Readiness

Do not implement First-Class Sleep publication.

However, existing publication readiness must not say:

```text
Ready to publish
```

when current First-Class Sleep authority is unresolved because of:

```text
blocking Sleep Friction
accepted placement reviewRequired
invalid accepted Sleep decision
protected Sleep decision authority
```

Integrate only the minimum readiness/coverage consequence required by existing architecture.

Do not create published Sleep snapshots.

That remains Task 9.15.

---

## 48. Preview Integration

Preview remains disposable.

It may show:

```text
current solved Sleep geometry
Sleep Friction
Suggested Fix
Try result
```

if required by existing corrective workflow.

But Preview must not own:

```text
accepted Sleep placement
```

The accepted decision lives in the canonical accepted-authority owner.

Regenerating Preview must replay/revalidate the decision from canonical state.

---

## 49. Suggested Fix Try Must Not Persist Preview Authority

A successful Try may temporarily show:

```text
trial Sleep geometry
trial ordinary schedule
trial Capacity consequences
```

but:

```text
refresh
regenerate
restart
```

without acceptance must return to canonical current authority.

Test this explicitly.

---

## 50. Persistence Scope

Task 9.14 may require persisted accepted Sleep authority.

Before changing schemas, determine actual current PlanDecision persistence capabilities.

Potentially affected surfaces:

```text
PlanDecision
Backup
Restore
Clear
```

Profiles require special care.

A saved profile should not accidentally carry live bounded accepted occurrence decisions unless existing profile architecture explicitly includes accepted authority.

Task 9.11 established:

```text
profiles carry portable authored Sleep intent
with fresh source lifetime on activation.
```

Therefore a live accepted Sleep placement tied to an incarnation must not be naively copied into a profile and rebound to a fresh lifetime.

Document profile behavior explicitly.

---

## 51. Full Backup Semantics

A full backup is different from a profile.

If existing full backup semantics preserve PlanDecision authority, then accepted Sleep placement and its source incarnation/lineage must round-trip exactly.

Required:

```text
backup
clear/replace as appropriate
restore
restart
```

must preserve a valid accepted Sleep placement when all referenced authority is restored.

Do not generate a fresh incarnation during full backup restore.

---

## 52. Restore Validation

Restore must reject or protect:

```text
accepted Sleep placement referencing missing Sleep source
wrong source incarnation
malformed owner coordinate
malformed geometry
unsupported payload version
invalid decision lifecycle
```

according to existing authority-recovery policy.

Do not silently drop malformed accepted authority and continue as though no decision existed.

---

## 53. Clear / Anti-Resurrection

Full clear must remove effective accepted Sleep placement authority through the canonical decision owner.

After:

```text
accept Sleep placement
clear
restart
```

the accepted placement must not resurrect.

Preserve existing anti-resurrection semantics.

---

## 54. Profile Semantics

Explicitly prove:

```text
save profile from setup containing Sleep requirement
```

does not accidentally serialize a live occurrence-specific accepted placement unless profile architecture intentionally owns such authority.

On profile activation:

```text
new Sleep source incarnation
```

must not inherit an old accepted placement tied to the previous incarnation.

No rebinding by logical ID.

---

## 55. Backup / Profile Distinction

The RESULT must document:

```text
Profile:
portable authored intent
fresh lifetime
no accidental live pin inheritance

Full Backup:
authority-preserving snapshot
preserves source lifetime
preserves accepted Sleep placement when valid
```

unless actual canonical architecture differs.

If it differs, explain with evidence.

---

## 56. Decision Protection

Malformed or unsupported accepted Sleep authority must fail safely.

Do not interpret:

```text
unknown Sleep decision payload
```

as:

```text
no Sleep decision.
```

Use existing protection/quarantine behavior.

A protected accepted-decision surface must prevent planning from silently ignoring potentially authoritative Sleep placement.

---

## 57. Required Sleep Friction Tests

At minimum prove:

### Proven infeasibility

Hard authoritative geometry makes required Sleep impossible.

Expected:

```text
SleepResolution = infeasible
typed Sleep Friction exists
canIgnore = false
```

### Search incomplete

Expected:

```text
no physical-incompatibility Sleep Friction
planning remains nonAllocatable
```

### Context incomplete

Expected:

```text
no physical-incompatibility Sleep Friction
planning remains nonAllocatable
```

### Invalid/protected

Expected:

```text
no false infeasibility Friction
authority remains blocked/protected
```

---

## 58. Required Friction Evidence Tests

Prove Sleep Friction retains:

- Sleep occurrence reference;
- source incarnation;
- effective revision;
- owner day;
- domain;
- duration;
- buffers;
- blockers;
- blocker references;
- proof scope;
- dependency fingerprint.

Permutation of blocker input must not create semantically different Friction.

---

## 59. Required Suggested Fix Tests

At minimum:

### Lawful alternative Sleep placement

Current problem has a lawful alternative placement.

Expected:

```text
Move Sleep Suggested Fix
```

with exact duration and buffers preserved.

### No lawful alternative

Expected:

```text
no fabricated Move Sleep fix.
```

### Hard blocker

Expected:

```text
fix does not move hard authority.
```

### Determinism

Equivalent input produces identical corrective candidate ordering.

### Deduplication

Equivalent candidate geometry produces one semantic fix.

---

## 60. Required Prohibited-Fix Tests

Explicitly prove no generated fix can:

```text
omit
shorten
split
reduce before-buffer
reduce after-buffer
disable requirement
move Work
move realized Goal work
```

Do not rely only on absence of UI labels.

Assert domain/payload types where practical.

---

## 61. Required Try Tests

At minimum:

```text
derive fix
Try
→ full constrained Sleep problem satisfied
```

and:

```text
Try one occurrence
→ causes another Sleep occurrence to fail
→ Try rejected
```

and:

```text
Try
→ no persisted decision
```

and:

```text
Try
→ no authored mutation
```

and:

```text
Try
restart/regenerate without Accept
→ original canonical state restored
```

---

## 62. Required Acceptance Tests

At minimum:

```text
derive fix
Try
Accept
→ accepted placement persisted
→ fresh Sleep solve uses exact placement
```

Prove:

- occurrence identity unchanged;
- authored requirement unchanged;
- exact duration unchanged;
- buffers unchanged;
- downstream planning recomputed.

---

## 63. Required Acceptance Freshness Tests

At minimum change each between Try and Accept:

```text
Sleep requirement
Work
manual fixed Event
realized physical fact
source incarnation
```

Expected:

```text
stale Try cannot create invalid accepted authority.
```

Use fresh canonical revalidation.

---

## 64. Required Idempotence Tests

Repeated identical acceptance must not create duplicate effective decisions.

Test:

```text
Accept
Accept again
restart
```

and inspect canonical decision authority.

---

## 65. Required Accepted Placement Replay Tests

After:

```text
Accept
restart
```

the exact placement must replay when still valid.

Also test:

```text
Accept
regenerate planning
```

and:

```text
Accept
query Capacity
```

The same fresh solved Sleep witness must result.

No Preview dependency.

---

## 66. Required Revision Compatibility Tests

At minimum:

### harmless compatible change

If a current authored revision changes something that does not invalidate exact placement semantics:

```text
accepted placement remains applicable
```

if such a field exists.

### widened window

If accepted placement remains lawful:

```text
decision remains applicable
```

unless the canonical fingerprint policy intentionally requires review.

### duration change

Expected:

```text
reviewRequired/inapplicable
```

### buffer change

Expected:

```text
reviewRequired/inapplicable
```

### window excludes placement

Expected:

```text
reviewRequired/inapplicable
```

### Work-relative anchor change

Expected:

```text
reviewRequired/inapplicable
```

Document exact implemented compatibility policy.

---

## 67. Required Incarnation Tests

At minimum:

```text
accept placement
delete Sleep source
recreate same logical ID
```

Expected:

```text
old decision never applies to new source lifetime.
```

No logical-ID rebinding.

---

## 68. Required Pin-Induced Conflict Tests

Construct:

```text
unconstrained Sleep problem = satisfiable
accepted exact placement = no longer satisfiable
```

Expected:

```text
accepted placement reviewRequired
```

or canonical equivalent.

Do not report the underlying Sleep requirement itself as universally infeasible if removing the pin restores feasibility.

---

## 69. Required Underlying Infeasibility Tests

Construct:

```text
unconstrained Sleep problem = infeasible
```

Expected:

```text
required-Sleep Friction
```

regardless of whether an old accepted placement exists.

The system must distinguish this from pin-only incompatibility.

---

## 70. Required Revocation Tests

At minimum:

```text
Accept pin
verify exact placement
Revoke
fresh solve
```

Expected:

```text
pin no longer constrains Sleep
solver returns canonical unpinned result
```

Also prove:

- authored requirement unchanged;
- decision provenance retained according to canonical lifecycle;
- downstream Capacity recomputed;
- no publication/history rewrite.

---

## 71. Required Revocation Idempotence Tests

Repeated revocation must not corrupt decision state.

Test:

```text
Revoke
Revoke again
restart
```

Expected canonical no-op or already-revoked result.

---

## 72. Required Backup Tests

At minimum:

```text
Accept Sleep placement
create full backup
restore
restart
```

Expected:

```text
source lifetime preserved
accepted placement preserved
fresh solve replays placement
```

Also test malformed/missing-reference accepted Sleep authority.

---

## 73. Required Profile Tests

At minimum:

```text
Accept Sleep placement
save profile
load profile
```

Expected:

```text
new Sleep source incarnation
old live accepted placement does not rebind
```

Document whether profile excludes decisions entirely or filters occurrence-specific authority.

---

## 74. Required Clear Tests

At minimum:

```text
Accept Sleep placement
clear
restart
```

Expected:

```text
no accepted Sleep placement resurrection.
```

---

## 75. Required Planning Tests

After a valid accepted placement changes the Sleep witness:

```text
ordinary movable Commitment placement
Capacity
Goal feasibility
Competition
Allocation
Proposal
```

must all consume the new solved geometry.

Do not directly inject PlanDecision geometry into those systems.

---

## 76. Required Accepted Allocation / Realization Tests

At minimum:

```text
Accepted Goal Allocation exists
Accept Sleep placement that changes physical foundation
```

Expected:

```text
Accepted Goal Allocation preserved
realization revalidated
```

If overlap results:

```text
reviewRequired/ineligible
```

No silent cancellation.

---

## 77. Required Publication-Readiness Tests

Without implementing Sleep publication:

```text
blocking Sleep Friction
```

must prevent false readiness.

Likewise:

```text
accepted Sleep placement reviewRequired
```

must prevent false readiness.

A valid current accepted placement may allow ordinary readiness to proceed to the next existing blocker.

Do not materialize Sleep into HistoricalPlan.

---

## 78. Required Non-Activation Tests

Prove Task 9.14 does not add:

```text
Sleep omission
Sleep shortening
Sleep protection waiver
Sleep execution
Sleep Progress
Sleep publication snapshot
Sleep historical subject
legacy conversion
learned Sleep preference
```

---

## 79. Required Determinism Tests

Equivalent canonical authority must produce equivalent:

```text
Sleep Friction
Suggested Fix ordering
Try result
accepted-placement applicability
fresh solved Sleep
planning consequences
```

regardless of:

```text
input insertion order
Preview generation order
selected UI day
wall-clock time
restart
```

where non-semantic.

---

## 80. Required Non-Mutation Tests

Pure:

```text
Friction query
Suggested Fix generation
Try
applicability query
```

must not mutate:

```text
SleepRequirement
PlanDecision
Accepted Allocation
realized facts
publication
execution
history
```

Only explicit:

```text
Accept
Revoke
```

may mutate accepted Sleep decision authority.

---

## 81. Required Friction Matrix

Include in RESULT:

| Sleep State | Proven Incompatibility? | Sleep Friction? | Blocking? | Ignore Allowed? | Corrective Path |
|---|---:|---:|---:|---:|---|
| notConfigured | | | | | |
| notApplicable | | | | | |
| satisfied | | | | | |
| infeasible | | | | | |
| searchIncomplete | | | | | |
| contextIncomplete | | | | | |
| invalid | | | | | |
| protected | | | | | |
| accepted placement reviewRequired | | | | | |

Populate with implemented semantics.

---

## 82. Required Suggested-Fix Matrix

Include:

| Fix Class | Allowed? | Authority Changed | Sleep Duration Preserved? | Buffers Preserved? | Requires Full Re-Solve? |
|---|---:|---|---:|---:|---:|
| Move Sleep within lawful domain | | | | | |
| Move ordinary flexible Commitment | | | | | |
| Move Work | | | | | |
| Move fixed Commitment | | | | | |
| Move realized Goal work | | | | | |
| Omit Sleep | | | | | |
| Shorten Sleep | | | | | |
| Reduce Sleep buffer | | | | | |
| Disable Sleep requirement | | | | | |
| Edit authored Sleep window | | | | | |

---

## 83. Required Accepted-Authority Matrix

Include:

| State | Decision Persisted? | Constrains Solver? | May Planning Proceed? | User Action | Evidence Retained? |
|---|---:|---:|---:|---|---:|
| no accepted placement | | | | | |
| accepted + applicable | | | | | |
| accepted + reviewRequired | | | | | |
| accepted + source missing/recreated | | | | | |
| revoked | | | | | |
| malformed/protected | | | | | |

---

## 84. Required Authority Matrix

Include:

| Object | Layer | Persisted? | Owns/Constrains Time? | May 9.14 Move It? | May 9.14 Delete It? |
|---|---|---:|---:|---:|---:|
| SleepRequirementV1 | | | | | |
| SleepOccurrenceV1 | | | | | |
| ScheduledSleepOccurrenceV1 | | | | | |
| Sleep Friction | | | | | |
| Sleep Suggested Fix | | | | | |
| Accepted Sleep placement | | | | | |
| Work | | | | | |
| Fixed Commitment | | | | | |
| Movable Commitment | | | | | |
| Accepted Allocation | | | | | |
| Realized Goal work | | | | | |
| Published Plan | | | | | |

---

## 85. Required Persistence Matrix

Include:

| Surface | Accepted Sleep Placement Stored? | Lifetime Behavior | Restore Behavior | Protection Behavior |
|---|---:|---|---|---|
| Active authored setup | | | | |
| PlanDecision authority | | | | |
| Profile | | | | |
| Full Backup | | | | |
| Restore | | | | |
| Clear | | | | |
| Preview | | | | |
| Publication | | | | |
| Execution | | | | |

---

## 86. Required Corrective Workflow Matrix

Include:

| Stage | Derived or Authority? | Writes? | Fresh Revalidation? | May Change Sleep Requirement? |
|---|---|---:|---:|---:|
| detect Friction | | | | |
| generate Suggested Fix | | | | |
| Try | | | | |
| Accept | | | | |
| replay accepted placement | | | | |
| applicability/review query | | | | |
| Revoke | | | | |
| re-solve after revoke | | | | |

---

## 87. Required Behavioral Invariants

Task 9.14 must establish and test at least:

1. First-Class Sleep remains authored through `SleepRequirementV1`.
2. Sleep occurrence identity remains source lifetime + owner day + slot.
3. Accepted placement does not change occurrence identity.
4. Accepted placement does not rewrite authored Sleep.
5. Accepted placement is bounded to one occurrence.
6. Accepted placement does not propagate automatically.
7. Accepted placement preserves exact Sleep duration.
8. Accepted placement preserves exact before-buffer.
9. Accepted placement preserves exact after-buffer.
10. Accepted placement must remain inside lawful Sleep domain.
11. Accepted placement must respect Work.
12. Accepted placement must respect fixed authority.
13. Accepted placement must respect realized facts.
14. Accepted placement must preserve joint Sleep feasibility.
15. Canonical solver remains feasibility owner.
16. No second pin solver exists.
17. Accepted placement constrains solver rather than bypassing it.
18. `infeasible` may create Sleep Friction.
19. `searchIncomplete` is not Sleep incompatibility Friction.
20. `contextIncomplete` is not Sleep incompatibility Friction.
21. `invalid` is not physical incompatibility Friction.
22. `protected` is not physical incompatibility Friction.
23. Required-Sleep Friction is blocking.
24. Required-Sleep Friction cannot be ignored.
25. Sleep Friction retains machine-readable proof evidence.
26. Friction identity is semantic.
27. Suggested Fix is corrective, not constructive Proposal.
28. Move-Sleep fix uses lawful canonical Sleep candidates.
29. Move-Sleep fix requires complete joint re-solve.
30. Suggested Fix cannot omit Sleep.
31. Suggested Fix cannot shorten Sleep.
32. Suggested Fix cannot split Sleep.
33. Suggested Fix cannot reduce buffers.
34. Suggested Fix cannot disable Sleep.
35. Suggested Fix cannot move Work.
36. Suggested Fix cannot move fixed authority.
37. Suggested Fix cannot move realized Goal work.
38. Suggested Fix ordering is deterministic.
39. Equivalent Suggested Fixes deduplicate.
40. Try is non-authoritative.
41. Try does not persist PlanDecision.
42. Try does not mutate authored Sleep.
43. Try does not mutate realized authority.
44. Try evaluates the complete relevant Sleep problem.
45. Successful Try does not imply acceptance.
46. Acceptance is explicit.
47. Acceptance revalidates current authority.
48. Stale Try cannot create invalid accepted authority.
49. Acceptance persistence is atomic.
50. Acceptance is idempotent.
51. Accepted placement survives restart when valid.
52. Accepted placement is source-incarnation safe.
53. Delete/recreate cannot rebind old placement.
54. Accepted placement is revalidated on every fresh Sleep resolution.
55. Revision number alone does not determine applicability.
56. Compatible current semantics may preserve placement.
57. Incompatible current semantics require review.
58. Stale accepted placement is retained as evidence.
59. Stale accepted placement is not silently ignored.
60. Pin-induced incompatibility is distinct from underlying Sleep infeasibility.
61. Underlying infeasibility remains detectable with an old pin.
62. Revocation is explicit.
63. Revocation does not alter authored Sleep.
64. Revocation does not omit Sleep.
65. Revocation removes exact-placement constraint prospectively.
66. Revocation preserves decision provenance.
67. Revocation is idempotent.
68. Re-solve after revocation uses canonical unpinned ranking.
69. Downstream Capacity consumes derived solved Sleep, not decision geometry directly.
70. Goal planning consumes derived solved Sleep consequences.
71. Existing Accepted Goal Allocation is not silently deleted.
72. Realization is revalidated after Sleep placement changes.
73. Existing realized facts are not moved.
74. Existing realized facts are not deleted.
75. Profiles do not accidentally inherit live occurrence pins across fresh incarnations.
76. Full backups preserve valid accepted Sleep authority.
77. Restore validates accepted Sleep references.
78. Malformed accepted Sleep authority fails safely.
79. Clear prevents accepted Sleep authority resurrection.
80. Preview does not own accepted Sleep authority.
81. Regeneration replays canonical accepted authority.
82. Publication readiness cannot ignore unresolved Sleep corrective authority.
83. No First-Class Sleep publication is added.
84. No First-Class Sleep execution is added.
85. No Sleep Progress is added.
86. No legacy conversion is added.
87. No one-off Sleep override is added.
88. No omission authority is added.
89. No shortening authority is added.
90. No protection-waiver authority is added.
91. Pure corrective queries are deterministic.
92. Pure corrective queries do not mutate authority.
93. Accepted authority and derived geometry remain separate.
94. Authored requirement and accepted occurrence correction remain separate.
95. Sleep Friction and Goal Proposal remain separate.
96. Planning still adapts to Sleep rather than moving Sleep implicitly.
97. Accepted placement can only arise from explicit user authority.
98. Revoked placement cannot continue constraining fresh planning.
99. Unknown accepted-decision authority cannot be treated as absence.
100. Task 9.14 adds bounded corrective authority without weakening required Sleep.

---

## 88. Architecture Governance

Task 9.10 already specifies:

- accepted exact Sleep placement;
- durable occurrence identity;
- explicit PlanDecision payload;
- revalidation;
- revocation;
- no omission/shortening/protection waiver;
- Friction only from proven incompatibility.

Do not create an ADR merely to restate those decisions.

Create or amend governance only if implementation reveals a genuinely unresolved normative question.

If a new PlanDecision version or lifecycle state is required, document whether that is implementation schema evolution or a normative architecture change.

---

## 89. Persistence / Schema Discipline

Task 9.14 may require schema evolution because accepted Sleep placement is persisted authority.

Any version change must be minimal and justified.

Potentially affected:

```text
PlanDecision
Backup
Restore
```

Potentially **not** affected:

```text
Active Sleep authored state
Profiles
Publication
Execution
```

Do not bump unrelated schemas “for consistency.”

For every version change document:

```text
old version
new version
migration
reader behavior
writer behavior
unknown-version behavior
backup behavior
restore behavior
```

---

## 90. Bundle Constraint

Task 9.13 ended at:

```text
Initial gzip: 167,553 bytes
Hard limit:   170,000 bytes
Headroom:       2,447 bytes
```

The hard limit must not be weakened.

Task 9.14 is at high risk of pulling corrective/Sleep code into startup paths.

Preserve dynamic/lazy boundaries where practical.

Do not duplicate solver code.

Record:

```text
baseline initial gzip
final initial gzip
delta
hard limit
remaining headroom
total output
advisory warnings
```

If the hard limit cannot be met without violating architecture, Task 9.14 is INCOMPLETE.

Do not raise the threshold.

---

## 91. Performance Assessment

Measure representative corrective operations.

At minimum:

```text
detect Sleep Friction
generate Sleep Suggested Fix
Try fix
replay accepted placement
revoke + re-solve
```

Use representative:

```text
7-day
31-day
90-day
```

scopes where applicable.

Include at least one adversarial joint-Sleep corrective case.

Performance is observational.

Do not introduce a wall-clock timeout that changes semantic result classification.

Deterministic solver budget semantics remain authoritative.

---

## 92. Prohibited Changes

Do **not**:

- redesign `SleepRequirementV1`;
- create `SleepRequirementV2`;
- change Sleep occurrence identity;
- infer Sleep from legacy templates;
- automatically convert legacy Sleep;
- create hidden First-Class Sleep templates;
- create a second Sleep solver;
- create a separate pin solver;
- bypass the canonical solver for accepted placement;
- inject accepted decision geometry directly into Capacity;
- inject accepted decision geometry directly into Goal planning;
- let Goal Demand influence Sleep placement;
- let Proposal influence Sleep placement;
- let ordinary movable Commitment preference influence Sleep placement;
- automatically accept a Suggested Fix;
- persist Try;
- treat successful Try as acceptance;
- omit Sleep;
- shorten Sleep;
- split Sleep;
- reduce required buffers;
- disable Sleep through corrective authority;
- create one-off waiver/override;
- allow required-Sleep Friction to be ignored;
- move Work through a Sleep fix;
- move fixed authority through a Sleep fix;
- move realized authority through a Sleep fix;
- silently delete stale accepted Sleep placement;
- silently ignore stale accepted Sleep placement;
- silently rebind accepted placement to a recreated source;
- propagate an occurrence pin to future occurrences;
- rewrite authored Sleep window from accepted placement;
- silently delete Accepted Goal Allocations;
- move/delete existing realized Goal facts;
- publish First-Class Sleep;
- execute First-Class Sleep;
- create Sleep Progress;
- implement legacy conversion;
- redesign Planner;
- redesign Summary;
- redesign Today;
- add dependencies unless necessary and justified;
- weaken bundle thresholds;
- commit;
- push.

---

## 93. Validation

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

Also run focused suites covering:

```text
Sleep requirement
Sleep identity
Sleep derivation
Sleep solver
Sleep occupancy
Sleep planning integration
Friction
Suggested Fix
Try / Preview revision
PlanDecision
decision replay
decision persistence
decision revocation
backup
restore
profiles
clear / anti-resurrection
Capacity
Goal feasibility
Competition
Allocation
Proposal
Accepted Allocation
Realization
publication readiness
legacy Sleep
Work-relative placement
Day Boundary
cycle transitions
```

Record exact commands and exact results.

Do not claim commands that were not actually run.

---

## 94. Repository Hygiene

Before implementation:

1. inspect `git status`;
2. record HEAD;
3. record all pre-existing dirty files;
4. preserve earlier Phase 9 work;
5. capture a baseline sufficient to distinguish 9.14 edits.

After implementation:

1. inspect `git status`;
2. inspect `git diff --stat`;
3. inspect relevant diffs;
4. compare against baseline;
5. run `git diff --check`;
6. distinguish pre-existing modifications from Task 9.14 additions;
7. account for every Task 9.14 file;
8. do not commit;
9. do not push.

---

## 95. Required RESULT Artifact

Create exactly one durable task-result artifact:

```text
PHASE_9_TASK_9_14_FIRST_CLASS_SLEEP_FRICTION_CORRECTIVE_AUTHORITY_V1_RESULT.md
```

Place it in the existing Phase 9 durable result-artifact folder.

The filename must contain:

```text
RESULT
```

No additional task report is authorized.

Governance artifacts are permitted only if Section 88 requires them.

---

## 96. Required RESULT Structure

The RESULT must contain these sections in this exact order:

```text
# Task 9.14 — First-Class Sleep Friction & Corrective Authority V1 RESULT

## 1. Executive Summary

## 2. Scope and Governing Architecture

## 3. Pre-Implementation Repository State

## 4. Current Corrective Architecture Trace

## 5. Task 9.13 Foundation Consumed

## 6. Corrective Authority Boundary

## 7. Sleep Friction Model

## 8. Sleep Friction Identity

## 9. Proven Incompatibility Classification

## 10. Blocking / Ignore Semantics

## 11. Suggested Fix Policy

## 12. Lawful Sleep Placement Corrections

## 13. Prohibited Sleep Corrections

## 14. Corrective Candidate Ordering

## 15. Try Semantics

## 16. Complete Joint Revalidation During Try

## 17. Accepted Sleep Placement Model

## 18. PlanDecision Integration

## 19. Accepted Placement Scope

## 20. Solver Constraint Integration

## 21. Accepted Placement Revalidation

## 22. Revision Compatibility

## 23. Source Incarnation Safety

## 24. Accepted Placement Applicability / Review State

## 25. Pin-Induced Incompatibility

## 26. Underlying Sleep Infeasibility

## 27. Acceptance Freshness

## 28. Atomicity and Idempotence

## 29. Revocation Model

## 30. Revocation Replay / Re-Solve

## 31. Planning Integration After Accepted Placement

## 32. Capacity / Goal Planning Consequences

## 33. Accepted Allocation / Realization Consequences

## 34. Preview Integration

## 35. Publication Readiness Consequences

## 36. Persistence Ownership

## 37. Profile Semantics

## 38. Full Backup Semantics

## 39. Restore / Protection Semantics

## 40. Clear / Anti-Resurrection

## 41. Friction Matrix

## 42. Suggested-Fix Matrix

## 43. Accepted-Authority Matrix

## 44. Authority Matrix

## 45. Persistence Matrix

## 46. Corrective Workflow Matrix

## 47. Behavioral Invariants

## 48. Friction Test Coverage

## 49. Suggested Fix Test Coverage

## 50. Try Test Coverage

## 51. Acceptance Test Coverage

## 52. Freshness / Revision Compatibility Coverage

## 53. Incarnation / Replay Coverage

## 54. Pin-Induced Conflict Coverage

## 55. Revocation Coverage

## 56. Backup / Profile / Restore / Clear Coverage

## 57. Planning / Capacity / Goal Coverage

## 58. Accepted Allocation / Realization Coverage

## 59. Publication-Readiness Coverage

## 60. Non-Activation Coverage

## 61. Determinism / Non-Mutation Coverage

## 62. Performance Assessment

## 63. Bundle Assessment

## 64. Architecture Governance Assessment

## 65. Test Coverage

## 66. Validation Record

## 67. Changed Files

## 68. Deferred First-Class Sleep Work

## 69. Completion Assessment
```

---

## 97. Required Changed-Files Accounting

List every file changed by Task 9.14.

Classify each as:

```text
Sleep Friction
Suggested Fix
Try
Sleep Solver
Accepted Sleep Placement
PlanDecision
Decision Replay
Decision Persistence
Revocation
Planning Integration
Capacity
Goal Planning
Accepted Allocation
Realization
Preview
Publication Readiness
Profile
Backup
Restore
Clear
Protection
Store / Query
UI Copy
Governance
Test
RESULT
```

For every changed file identify:

- purpose;
- semantic change;
- authority impact;
- persisted behavior impact;
- schema/version impact;
- associated tests.

For files already dirty before Task 9.14, explicitly distinguish:

```text
pre-existing modification
```

from:

```text
Task 9.14 additional modification
```

---

## 98. Completion Criteria

Task 9.14 is complete only if all applicable criteria are satisfied.

### Friction

- [ ] only proven Sleep infeasibility creates required-Sleep incompatibility Friction.
- [ ] searchIncomplete does not masquerade as incompatibility.
- [ ] contextIncomplete does not masquerade as incompatibility.
- [ ] invalid/protected authority does not masquerade as physical incompatibility.
- [ ] required-Sleep Friction is blocking.
- [ ] required-Sleep Friction cannot be ignored.
- [ ] Friction retains machine-readable proof evidence.
- [ ] Friction identity is semantic and deterministic.

### Suggested Fix

- [ ] lawful move-Sleep correction exists when complete re-solve proves it.
- [ ] correction preserves exact duration.
- [ ] correction preserves before-buffer.
- [ ] correction preserves after-buffer.
- [ ] correction remains in lawful domain.
- [ ] correction respects all hard authority.
- [ ] correction preserves complete joint Sleep feasibility.
- [ ] corrective candidates are deterministic.
- [ ] duplicate fixes deduplicate.
- [ ] no omit fix exists.
- [ ] no shorten fix exists.
- [ ] no split fix exists.
- [ ] no buffer-reduction fix exists.
- [ ] no disable-requirement fix exists.
- [ ] no hard-authority movement fix exists.

### Try

- [ ] Try uses canonical Sleep feasibility logic.
- [ ] Try evaluates the complete relevant Sleep problem.
- [ ] Try is non-authoritative.
- [ ] Try does not persist accepted authority.
- [ ] Try does not mutate authored Sleep.
- [ ] Try does not mutate realized authority.
- [ ] Try does not imply acceptance.
- [ ] regeneration/restart after unaccepted Try restores canonical state.

### Accepted authority

- [ ] explicit Accept creates bounded accepted placement.
- [ ] accepted placement targets exact durable Sleep occurrence.
- [ ] occurrence identity remains unchanged.
- [ ] accepted placement is one-occurrence scoped.
- [ ] accepted placement does not propagate.
- [ ] authored requirement remains unchanged.
- [ ] accepted placement constrains canonical solver.
- [ ] accepted geometry is not injected directly into Capacity.
- [ ] accepted geometry is not injected directly into Goal planning.
- [ ] current canonical authority is revalidated before write.
- [ ] acceptance is atomic.
- [ ] acceptance is idempotent.
- [ ] accepted placement survives restart when valid.

### Freshness

- [ ] Sleep edits revalidate accepted placement.
- [ ] Work edits revalidate accepted placement.
- [ ] manual fixed Event edits revalidate accepted placement.
- [ ] realized facts revalidate accepted placement.
- [ ] source recreation cannot inherit old placement.
- [ ] stale Try cannot be accepted.
- [ ] revision number alone is not treated as semantic validity.
- [ ] compatible edits behave according to documented policy.
- [ ] incompatible edits become reviewRequired/inapplicable.

### Conflict classification

- [ ] pin-induced incompatibility is distinguishable from underlying Sleep infeasibility.
- [ ] stale accepted placement is retained as evidence.
- [ ] stale accepted placement is not silently ignored.
- [ ] stale accepted placement is not silently deleted.
- [ ] underlying infeasibility remains detectable.

### Revocation

- [ ] explicit revocation exists.
- [ ] revocation does not alter authored Sleep.
- [ ] revocation does not omit Sleep.
- [ ] revocation removes exact-placement constraint prospectively.
- [ ] revocation preserves decision provenance.
- [ ] revocation is idempotent.
- [ ] fresh re-solve after revocation uses canonical unpinned behavior.
- [ ] downstream planning recomputes.

### Persistence

- [ ] accepted Sleep placement has one canonical persistence owner.
- [ ] no separate Sleep decision storage silo exists without explicit justification.
- [ ] full backup preserves valid accepted authority.
- [ ] full restore preserves source lifetime and accepted placement.
- [ ] malformed authority fails safely.
- [ ] missing/mismatched source references fail safely.
- [ ] profile activation does not rebind live occurrence pin to fresh source incarnation.
- [ ] clear prevents resurrection.
- [ ] unknown accepted-decision payload is not treated as absence.

### Planning

- [ ] accepted placement changes planning only through fresh solved Sleep.
- [ ] ordinary movable placement consumes fresh solved Sleep.
- [ ] Capacity consumes fresh solved Sleep.
- [ ] Goal feasibility consumes fresh Capacity.
- [ ] Competition/Allocation/Proposal recompute lawfully.
- [ ] existing Accepted Goal Allocations remain preserved.
- [ ] realization is revalidated.
- [ ] existing realized facts remain immutable.

### Readiness

- [ ] unresolved Sleep Friction prevents false publication readiness.
- [ ] reviewRequired accepted Sleep authority prevents false readiness.
- [ ] no First-Class Sleep publication snapshot is introduced.

### Non-activation

- [ ] no one-off Sleep override.
- [ ] no Sleep omission.
- [ ] no Sleep shortening.
- [ ] no protection waiver.
- [ ] no Sleep execution.
- [ ] no Sleep Progress.
- [ ] no legacy conversion.
- [ ] no learned Sleep preference.

### Regression

- [ ] Task 9.13 planning integration remains intact.
- [ ] legacy Sleep remains intact.
- [ ] Work behavior remains intact.
- [ ] ordinary Commitment behavior remains intact.
- [ ] Goal planning remains intact.
- [ ] Accepted Allocation behavior remains intact.
- [ ] realization behavior remains intact except lawful Sleep revalidation.
- [ ] existing non-Sleep Friction/Suggested Fix behavior remains intact.
- [ ] existing publication behavior remains intact except lawful readiness consequence.
- [ ] execution/history behavior remains intact.
- [ ] Preview remains derived.

### Validation

- [ ] focused corrective tests pass.
- [ ] Sleep tests pass.
- [ ] Friction tests pass.
- [ ] Suggested Fix tests pass.
- [ ] Try tests pass.
- [ ] PlanDecision tests pass.
- [ ] replay tests pass.
- [ ] persistence tests pass.
- [ ] revocation tests pass.
- [ ] backup tests pass.
- [ ] profile tests pass.
- [ ] restore tests pass.
- [ ] clear tests pass.
- [ ] Capacity tests pass.
- [ ] Goal tests pass.
- [ ] Allocation/Proposal tests pass.
- [ ] realization tests pass.
- [ ] publication-readiness tests pass.
- [ ] full suite passes.
- [ ] formatting passes.
- [ ] lint passes.
- [ ] build/typecheck passes.
- [ ] hard bundle limit passes unchanged.
- [ ] `git diff --check` passes.
- [ ] no commit.
- [ ] no push.

### Documentation

- [ ] RESULT exists under required filename.
- [ ] required matrices are complete.
- [ ] Friction semantics documented.
- [ ] accepted placement semantics documented.
- [ ] pin-induced versus underlying infeasibility documented.
- [ ] revision compatibility documented.
- [ ] revocation documented.
- [ ] persistence/profile/backup distinction documented.
- [ ] bundle before/after/headroom documented.
- [ ] changed-file accounting complete.
- [ ] deferred work explicit.

---

## 99. Final Completion Statement

If and only if all required completion criteria are satisfied, end the RESULT with exactly:

```text
Task 9.14 — First-Class Sleep Friction & Corrective Authority V1 is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.14 — First-Class Sleep Friction & Corrective Authority V1 is INCOMPLETE.
```

Then identify the exact unresolved implementation or evidence blockers.

Do not mark Task 9.14 complete merely because:

```text
a Sleep block can be moved
```

or because:

```text
a PlanDecision can store Sleep geometry.
```

Completion requires proof of the complete bounded corrective-authority chain:

```text
proven incompatibility
        ↓
typed blocking Sleep Friction
        ↓
lawful Suggested Fix
        ↓
non-authoritative Try
        ↓
explicit fresh Accept
        ↓
bounded incarnation-safe Accepted placement
        ↓
canonical solver revalidation
        ↓
fresh planning consequences
        ↓
explicit revocation
```

while preserving:

```text
required duration
required protection
authored authority
hard authority
realized authority
accepted Goal authority
publication/history boundaries
```

---

## 100. Governing Principle

Task 9.13 established:

```text
The rest of DayFrame must respect required Sleep.
```

Task 9.14 must establish:

```text
When required Sleep conflicts with reality,
DayFrame may help the user resolve where Sleep goes,
but it may not quietly weaken what the user said Sleep requires.
```

Therefore:

```text
Friction may explain incompatibility.

Suggested Fix may identify a lawful alternative.

Try may prove that alternative.

Accept may pin one exact required occurrence.

Revoke may remove that pin.

But none of those actions may turn required Sleep into optional Sleep.
```

That is the boundary of Task 9.14.