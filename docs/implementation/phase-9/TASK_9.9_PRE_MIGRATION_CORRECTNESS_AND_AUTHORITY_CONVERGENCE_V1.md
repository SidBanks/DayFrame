# Task 9.9 — Pre-Migration Correctness & Authority Convergence V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Correctness / authority-boundary / regression-hardening implementation  
**Primary Input:** Task 9.8C — Post-Dogfood Product Reachability & Workflow Audit RESULT  
**Migration Work:** **PROHIBITED**  
**Schema Changes:** **PROHIBITED unless existing architecture makes a narrowly necessary change unavoidable and the task is stopped for review first**  
**Required Durable Output:** `PHASE_9_TASK_9_9_PRE_MIGRATION_CORRECTNESS_AUTHORITY_CONVERGENCE_V1_RESULT.md`

---

## 1. Objective

Correct the concrete scheduling, corrective-revision, and publication-readiness defects established by Task 9.8C **before** DayFrame begins Planner/Summary shell migration.

Task 9.8C established that substantial Phase 8/9 architecture already exists and is product-reachable.

The next architectural risk is therefore not primarily missing capability.

It is migrating known correctness and authority-boundary defects into the future product shell.

This task must repair the confirmed implementation defects that sit underneath future Planner, Day Worksurface, Review, Today, and Summary interactions while preserving the authority architecture already established through Phase 8 and Phase 9.

The central objective is:

> **Make existing schedule generation, corrective revision, and publication readiness trustworthy enough that future UI convergence can consume them without reproducing known correctness defects.**

This task is intentionally narrower than full product convergence.

It must **not**:

- redesign Planner;
- redesign Summary;
- create the final Day Worksurface;
- retire the legacy Preview/date tower;
- implement Goal Structure authoring;
- implement Found Time;
- implement recurring Goal Demand;
- perform the complete first-class Sleep redesign;
- implement a broad HistoricalPlan recovery product;
- infer fixes for dogfood incidents whose exact causes remain unproven.

---

## 2. Governing Evidence

Task 9.8C established several **Confirmed** defects that must be corrected before migration.

### 2.1 Corrective gap search can return an interval overlapping locked Work

Task 9.8C reproduced a case where:

```text
Work:
07:00–15:00

Corrective Move result:
03:30–11:30
```

The proposed corrective interval overlaps locked Work.

The audit traced this to the gap-search cursor behavior in the corrective placement path.

A Suggested Fix must never offer geometry that violates existing locked schedule ownership.

---

### 2.2 Moving an unplaced candidate can fail durable acceptance

Task 9.8C confirmed that:

```text
Suggested Fix target
    = unplaced candidate ID

Try Move
    ↓

new scheduled block
    = scheduled-block ID

Accept
    ↓

acceptance mapper searches using original candidate ID

result
    = tryNotApplied
```

The Try can therefore appear to work while the user's attempt to accept it cannot become a durable PlanDecision.

This violates the intended corrective lifecycle:

```text
Friction
  ↓
Suggested Fix
  ↓
Try
  ↓
Accept
  ↓
Durable Decision
  ↓
Regeneration
  ↓
Replay
```

---

### 2.3 Successful Preview revision can omit realized Goal facts

Task 9.8C confirmed that the successful revision result can omit:

```text
realizedScheduleFacts
```

even though those facts remain present in authoritative realization storage.

The corrective executor also does not currently receive realized Goal facts as occupancy constraints.

This creates two distinct risks:

1. accepted Goal work can disappear from the disposable revised Preview even though authority was not deleted;
2. corrective placement can reason about an incomplete physical occupancy model.

A corrective Preview must never silently forget authoritative realized schedule facts.

---

### 2.4 Publication readiness and publication execution use inconsistent preconditions

Task 9.8C confirmed that Review can report:

```text
Ready to publish
```

while:

```text
Publication coverage is unavailable
```

and while HistoricalPlan authority is protected.

The readiness query does not consume all historical-ingress/protection conditions that the actual publication command must later enforce.

The product therefore can tell the user that publication is ready when the publication command already knows—or will discover—that publication is not safely available.

---

### 2.5 Publication failure does not always imply no history changed

Task 9.8C reproduced a post-commit verification failure:

```text
atomic publication commit succeeds
  ↓
verification read fails
  ↓
publication response reports failure
```

The resulting durable batch can nevertheless be complete.

Therefore the stronger product claim:

```text
Publication failed without changing schedule history.
```

is not safe for every failure path.

This task must preserve transactional publication semantics while making result classification and user-facing state truthful about write certainty.

---

### 2.6 Custom-window Sleep can be incorrectly clipped by a Day Boundary

Task 9.8C reproduced:

```text
Sleep preferred window:
22:00–08:00

Sleep duration:
8 hours

Buffers:
30 minutes before
30 minutes after
```

With a noon Day Boundary, placement succeeded.

With a midnight Day Boundary, the custom-window placement path clipped the physical window at the canonical owner boundary, leaving only:

```text
22:00–24:00
```

and making the Sleep footprint impossible to place.

The audit also proved that other Sleep placement paths can already cross midnight and DayFrame Day Boundaries.

Therefore the canonical user-day model itself is **not** the defect.

The defect is a branch-specific conflation of:

```text
canonical ownership
```

with:

```text
physical interval containment
```

This task must correct that concrete defect without redesigning Sleep authority generally.

---

## 3. Explicit Non-Goals

The following are outside Task 9.9.

### 3.1 Full first-class Sleep authority

Dogfood established the product requirement that Sleep eventually needs stronger first-class semantics.

However, Task 9.9 must **not** attempt to design the complete model for:

- required Sleep;
- minimum Sleep;
- sleep debt;
- recovery Sleep;
- user-authorized Sleep omission;
- Work-impossible Sleep days;
- accepted Goal work versus required Sleep;
- adaptive Sleep learning;
- automatic rescheduling around Sleep;
- biological recommendation policy.

Those require a dedicated architecture task.

Task 9.9 only repairs the **confirmed cross-boundary/custom-window correctness defect** and must preserve extension points for the later Sleep work.

---

### 3.2 Complete HistoricalPlan recovery UX

Task 9.8C established that HistoricalPlan recovery is incomplete and not ordinarily user-reachable.

Task 9.9 must **not** build the final recovery workflow.

It may improve:

- typed readiness;
- publication precondition reporting;
- failure classification;
- write-certainty reporting;
- preservation of protected state;
- diagnostics necessary for a later recovery workflow.

It must not:

- abandon protected history automatically;
- delete historical authority;
- reconstruct unknown history;
- silently choose older historical truth;
- bypass protection;
- invent a destructive recovery policy.

---

### 3.3 Unproven dogfood incident causes

Task 9.8C did **not** establish the exact current cause of:

- reported `beforeWork` placement inside Work;
- approximately 18 Night Shift `afterWork` failures;
- the exact 11-item Sleep incident;
- October 2 / October 16 transition failures;
- the reported disappearance/replacement of realized geometry.

Do not claim to fix those incidents unless they can be deterministically reproduced from current production behavior.

Confirmed adjacent defects may be fixed.

Unproven incident causality must remain explicitly unresolved.

---

## 4. Architectural Invariants

Task 9.9 must preserve the following established invariants.

### 4.1 Authority

```text
Authored
  ↓
Derived
  ↓
Proposed
  ↓
Accepted
  ↓
Realized / Scheduled
  ↓
Published
  ↓
Execution / Progress
  ↓
History
```

No lower-authority layer may silently overwrite a higher-authority layer.

---

### 4.2 Proposal and accepted allocation

Proposal owns no schedule time.

Accepted Allocation represents accepted authority but does not own physical schedule time until Realization.

---

### 4.3 Realization

Realization creates actual schedule ownership.

Realized Goal work, real support activity, and protected buffers must remain physically present as occupancy where applicable.

A disposable Preview revision may not erase them from its schedule model merely because they are not authored Commitment blocks.

---

### 4.4 Work

Work is locked schedule ownership.

No ordinary flexible placement or corrective move may overlap Work.

If no valid opening exists:

```text
remain unplaced
```

is preferable to:

```text
violate Work ownership
```

---

### 4.5 Buffers

Buffers protect time.

Buffers are not executable activities.

Placement and correction must reason about the complete footprint:

```text
before buffer
+ activity
+ after buffer
```

---

### 4.6 Suggested Fix

Suggested Fix is derived corrective advice.

It becomes durable only through explicit user acceptance.

A Try is disposable.

A successful Accept must create or update the appropriate durable PlanDecision.

---

### 4.7 Preview

Preview is disposable derived state.

It may be revised.

It must not:

- become historical authority;
- delete realization authority;
- omit authoritative occupancy needed to reason correctly;
- be publishable when its revision state violates publication invariants.

---

### 4.8 Publication

Publication is explicit.

Publication creates bounded immutable historical truth.

Publication failure must not silently corrupt or partially overwrite existing history.

A complete committed publication followed by uncertain verification must not be falsely described as a guaranteed no-write failure.

---

### 4.9 Historical protection

Protected historical authority must not be:

- overwritten;
- deleted;
- replaced by Preview;
- silently downgraded;
- bypassed.

---

### 4.10 Canonical user-day

Canonical DayFrame day ownership is distinct from physical interval geometry.

An interval may belong to a canonical DayFrame day while physically crossing:

- calendar midnight;
- the DayFrame Day Boundary;
- both.

Crossing the ownership boundary does not inherently make an interval invalid.

---

## 5. Implementation Workstream A — Correct Corrective Gap Search

Audit and correct the canonical gap-search behavior used by Suggested Fix movement.

The current implementation must not return a candidate opening that overlaps known occupied intervals.

### Required behavior

For a requested full footprint:

```text
before buffer
+ activity duration
+ after buffer
```

the gap search must:

1. begin at the valid search-window start;
2. examine occupied intervals in deterministic temporal order;
3. determine whether the full footprint fits before the next occupied interval;
4. if not, advance the cursor beyond the relevant occupied interval;
5. continue until a valid opening is found;
6. reject placement if the footprint cannot fit within the valid search window.

The search must never return the original cursor merely because a future occupied interval begins after it when the requested footprint would overlap that interval.

### Occupancy requirements

Corrective placement must account for all relevant physical schedule ownership available to the production generator, including:

- Work;
- scheduled Commitment blocks;
- realized Goal work;
- realized support activity;
- realized protected buffers;
- other applicable locked/fixed schedule ownership.

Do not create a second incompatible occupancy model.

Reuse or extract canonical occupancy logic where practical.

### Required regression

At minimum reproduce the Task 9.8C case:

```text
Work:
07:00–15:00

candidate:
Sleep or equivalent flexible candidate

footprint:
8-hour activity
30-minute before buffer
30-minute after buffer

search begins:
before Work
```

The corrective system must not return an interval such as:

```text
03:30–11:30
```

that overlaps Work.

If no valid opening exists, the candidate must remain unresolved/unplaced.

---

## 6. Implementation Workstream B — Preserve Occurrence Identity Through Unplaced Move Acceptance

Correct the identity boundary between:

```text
unplaced candidate
```

and:

```text
scheduled result produced by Try Move
```

A Try that successfully places the occurrence must retain sufficient provenance for the acceptance mapper to recognize:

```text
this scheduled result
```

as:

```text
the revised form of the targeted occurrence
```

Do not solve this by relying on coincidentally equal generated IDs unless that equality is already an explicit domain invariant.

### Required acceptance lifecycle

The following must succeed for a supported unplaced move:

```text
unplaced occurrence
  ↓
Suggested Fix: Move
  ↓
Try
  ↓
valid scheduled occurrence
  ↓
Accept
  ↓
durable PlanDecision
  ↓
fresh generation
  ↓
decision replay
  ↓
same semantic occurrence placed according to accepted decision
```

### Required protections

Acceptance must still reject:

- a Try that was not actually applied;
- a different occurrence;
- stale source incarnation;
- stale/incompatible authored state;
- invalid geometry;
- unsupported fix families.

Do not weaken source-incarnation or occurrence identity checks merely to make acceptance succeed.

---

## 7. Implementation Workstream C — Preserve Realized Facts Through Preview Revision

Correct successful Preview revision so that authoritative realized schedule facts remain represented.

A successful revision must preserve:

```text
realizedScheduleFacts
```

unless a canonical higher-authority operation explicitly changes realization authority.

A Suggested Fix is not such an operation.

### Required behavior

For:

```text
Preview
  contains:
    Work
    Commitment blocks
    realized Goal work
    support activity
    protected buffers
```

after a successful Try revision of a Commitment occurrence:

```text
revised Preview
```

must still contain the same unaffected realized facts.

### Corrective occupancy

Those realized facts must also participate in corrective physical occupancy.

A Suggested Fix must not move a flexible Commitment into:

- realized Goal work;
- realized support activity;
- protected buffer time.

### Authority protection

Do not mutate realization storage.

The revised Preview is still disposable.

The fix is:

```text
preserve and respect authoritative facts in derived revision
```

not:

```text
copy derived changes into realization authority
```

---

## 8. Implementation Workstream D — Correct Custom Sleep Cross-Boundary Placement

Correct the confirmed custom-window placement defect without redesigning Sleep generally.

### Confirmed scenario

```text
canonical Day Boundary:
00:00

Sleep preferred window:
22:00–08:00

Sleep activity:
8 hours

before buffer:
30 minutes

after buffer:
30 minutes
```

The valid physical placement window crosses the Day Boundary.

It must not be clipped merely because the owning canonical DayFrame day ends at the boundary.

### Required invariant

Separate:

```text
canonical occurrence ownership
```

from:

```text
physical placement window
```

A valid custom placement window may extend across the canonical owner's boundary when its semantics explicitly cross that boundary.

### Required behavior

The corrected path must:

- preserve deterministic canonical owner identity;
- permit valid physical crossing;
- respect Work occupancy;
- respect other physical occupancy;
- respect complete footprint buffers;
- avoid duplicate occurrence creation;
- avoid accidental reassignment to the neighboring user-day;
- preserve correct display grouping;
- preserve existing beforeWork Sleep behavior;
- preserve existing Work crossing behavior.

### Important limitation

Do not generalize this change into:

```text
all schedule objects may cross every boundary without restriction
```

Existing Goal resource-footprint constraints are separate explicit V1 policy.

Task 9.9 repairs the confirmed custom-window Sleep/Commitment placement behavior only where current semantics already define an overnight physical window.

---

## 9. Implementation Workstream E — Publication Readiness Must Reflect Publication Preconditions

Reconcile Review readiness with the preconditions that determine whether publication can actually be attempted safely.

The product must not report:

```text
Ready to publish
```

when a known current condition already prevents safe publication.

### At minimum evaluate

- Review Scope validity;
- planning coverage;
- Preview coverage;
- Preview freshness;
- Friction;
- accepted unresolved liabilities;
- relevant source freshness;
- HistoricalPlan ingress/protection status;
- publication/materializer eligibility;
- revised/Try Preview publication restrictions;
- any other precondition the actual publication command deterministically knows before persistence begins.

### Required distinction

Do not make:

```text
unknown publication coverage
```

equivalent to:

```text
no publication exists
```

and do not make:

```text
protected historical authority
```

equivalent to ordinary unknown coverage.

Typed states must survive into readiness.

### Required result

If HistoricalPlan is protected:

```text
Ready to publish
```

must not be the final readiness state.

The UI/read model should communicate that publication cannot currently proceed safely.

This task does not need to supply the complete recovery workflow.

---

## 10. Implementation Workstream F — Preserve Publication Failure Certainty

Audit and correct publication result semantics around:

```text
pre-write failure
commit failure
post-commit verification failure
protected-authority rejection
materialization rejection
```

The caller must be able to distinguish cases where appropriate.

### Required principle

Do not claim:

```text
history was unchanged
```

unless the system actually knows that no durable publication commit occurred.

### Post-commit uncertainty

If:

```text
commit succeeded
```

but:

```text
verification failed
```

the result must preserve that uncertainty.

The system must protect history rather than retrying blindly or overwriting evidence.

A later recovery task can decide how the user resolves the state.

Task 9.9 must make the state truthful and safe.

### Atomicity

Do not weaken the existing atomic batch/day transaction.

No partial publication should become accepted historical truth.

The problem is not that atomic publication should be removed.

The problem is that:

```text
atomic transaction semantics
```

and:

```text
caller knowledge after verification failure
```

are not identical concepts.

---

## 11. Publication Failure Taxonomy

Where compatible with existing architecture, publication results should retain enough typed information to distinguish at least:

```text
notReady
protectedHistoricalAuthority
materializationRejected
writeFailedBeforeCommit
commitStateUncertain
verificationFailedAfterPossibleCommit
success
```

Exact names may follow established project naming conventions.

Do not add a parallel publication system.

Extend or clarify the existing result model.

If the existing architecture already has equivalent distinctions under different names, use them.

---

## 12. Historical Protection Constraints

Task 9.9 must not automatically recover protected HistoricalPlan authority.

When protection exists:

- publication must remain blocked;
- Today must remain unwilling to substitute Preview;
- Summary must remain unwilling to substitute generated state;
- existing historical evidence must remain untouched;
- no destructive abandonment may occur automatically.

If Task 9.9 improves diagnostics, it may expose typed information needed by a later recovery task.

Do not create a Reset History shortcut.

---

## 13. Regression Matrix — Corrective Placement

Add deterministic regression coverage for at least:

| Scenario | Required Result |
|---|---|
| Corrective move before future locked Work where footprint cannot fit | No overlapping move |
| Corrective move with valid gap before Work | Valid non-overlapping placement |
| Corrective move with valid gap after Work | Valid non-overlapping placement |
| Corrective move with realized Goal work in candidate gap | Must not overlap realized Goal work |
| Corrective move with realized support activity | Must not overlap support activity |
| Corrective move with protected buffer | Must not overlap protected buffer |
| No valid corrective opening | Remains unresolved/unplaced |
| Unplaced occurrence Try Move | Produces traceable scheduled result |
| Accept successful unplaced Try | Creates durable decision |
| Regenerate after acceptance | Replays same semantic occurrence |
| Stale source after Try | Acceptance rejected |
| Different occurrence after Try | Acceptance rejected |

---

## 14. Regression Matrix — Preview Realization Preservation

Add deterministic coverage for:

| Scenario | Required Result |
|---|---|
| Initial Preview contains realized Goal fact | Fact present |
| Successful Commitment Try revision | Realized fact remains present |
| Successful revision unrelated to support activity | Support fact remains present |
| Successful revision unrelated to buffer | Buffer remains present |
| Corrective opening search encounters realized Goal fact | Fact blocks opening |
| Corrective opening search encounters support activity | Activity blocks opening |
| Corrective opening search encounters protected buffer | Buffer blocks opening |
| Fresh regeneration after Try | Authoritative realized facts still sourced from realization authority |
| Try discarded | Realization authority unchanged |
| Try accepted | Only supported PlanDecision authority changes; realization authority unchanged |

---

## 15. Regression Matrix — Sleep / Day Boundary

Add deterministic coverage for at least:

| Day Boundary | Sleep Window | Required Result |
|---|---|---|
| 00:00 | 22:00–08:00 | Valid cross-boundary placement when footprint fits |
| 12:00 | 22:00–08:00 | Valid placement when footprint fits |
| 00:00 | beforeWork overnight Sleep | Existing valid behavior preserved |
| 12:00 | beforeWork overnight Sleep | Existing valid behavior preserved |
| 00:00 | custom overnight Sleep with blocking Work | No overlap; unplaced if necessary |
| variable segment boundary | overnight custom Sleep | Correct owner and physical interval |
| neighboring user-days | overnight Sleep | No duplicate recurrence |
| cross-boundary Sleep | display/grouping | Stable canonical owner |

Where a current explicit V1 policy intentionally rejects another object crossing the boundary, preserve that policy unless this task specifically covers it.

---

## 16. Regression Matrix — Publication

Add deterministic coverage for:

| Scenario | Readiness | Publish Result / Required Behavior |
|---|---|---|
| Valid fresh Preview + healthy history | Ready | Success |
| Protected HistoricalPlan | Not ready / blocked | No publish attempt |
| Historical coverage unknown because protected | Not ready / blocked | Must not call this ordinary “ready” |
| Missing prior publication but healthy storage | May be ready | New publication permitted |
| Try-revised Preview prohibited by materializer | Not ready if deterministically knowable | No misleading ready state |
| Pre-commit validation failure | Not ready/failure | Known no-write |
| Transaction fails before commit | Failure | Known no-write when provable |
| Complete commit + verification succeeds | Ready → success | Published truth readable |
| Complete commit + verification read fails | Failure/uncertain | Must not claim history unchanged |
| Existing protected authority | Blocked | Must not overwrite |
| Failed publication | — | No partial batch accepted |
| Retry after uncertain state | — | Must not blindly duplicate/overwrite protected evidence |

---

## 17. Required BeforeWork / AfterWork Guard Coverage

Although Task 9.8C did not reproduce the original beforeWork incident, Task 9.9 must protect the invariant with regression coverage.

### `beforeWork`

For representative:

```text
Day Shift
Evening Shift
Night Shift
```

verify:

- actual relevant Work start is used;
- full footprint is before Work;
- activity does not overlap Work;
- buffers do not overlap Work;
- no fit → unplaced;
- canonical owner remains correct across midnight/boundary cases.

### `afterWork`

For representative:

```text
Day Shift
Evening Shift
Night Shift
```

verify:

- actual relevant Work end is used;
- complete footprint is considered;
- before buffer is included;
- after buffer is included;
- overnight Work resolves to the correct civil instant;
- no fit → unplaced.

### Important reporting rule

Passing these regressions does **not** establish that the original dogfood incidents are explained.

The RESULT must say:

```text
Current invariant is covered.
```

not:

```text
Original incident root cause was fixed.
```

unless the original behavior is independently reproduced.

---

## 18. Implementation Reuse Requirement

Before adding new helpers, inspect whether canonical logic already exists for:

- physical interval overlap;
- occupied interval construction;
- full-footprint calculation;
- canonical user-day ownership;
- effective Day Boundary resolution;
- Work-relative placement;
- realized schedule fact projection;
- publication precondition validation;
- historical protection status.

Prefer one semantic owner.

Do not create:

```text
placement occupancy logic A
corrective occupancy logic B
publication readiness logic A
publication command eligibility logic B
```

when a canonical shared semantic calculation can safely serve both callers.

Refactoring is permitted only when necessary to establish one semantic owner for the corrected behavior.

Do not perform unrelated cleanup.

---

## 19. Persistence and Schema Constraints

Task 9.9 should require **no persistence schema change**.

Expected corrections concern:

- placement algorithms;
- identity/provenance mapping;
- derived Preview composition;
- readiness derivation;
- publication result semantics;
- error/status projection.

If implementation appears to require a persisted schema migration, **stop** and document why rather than silently expanding scope.

Do not change:

- historical schema versions;
- backup schema versions;
- Proposal authority schemas;
- realization authority schemas;
- PlanDecision persistence format;

unless a proven correctness requirement makes it unavoidable.

If unavoidable, Task 9.9 is not authorized to proceed without explicit review.

---

## 20. Product-Surface Scope

Minimal product-facing changes are permitted only where necessary to stop displaying incorrect state.

Examples include:

- Review no longer displaying `Ready to publish` when publication is known to be blocked;
- publication failure copy no longer claiming guaranteed no-write when commit state is uncertain;
- preserving typed protected/uncertain state.

Do not redesign the surrounding interface.

Do not:

- move navigation;
- rename Planner;
- merge Today;
- redesign Summary;
- create the Day Worksurface;
- redesign Review;
- redesign Friction resolution layout.

This task repairs truth before presentation migration.

---

## 21. Required Tests

Add or update tests at the lowest appropriate semantic owner.

Likely relevant existing suites include those around:

```text
placeBlockCandidates
generateSchedulePreview
applySuggestedFix
reviseSchedulePreview
createPlanDecisionAcceptanceCandidate
replayPlanDecisions
planDecisionSurface
workRelativeFootprint
scheduleReviewReadiness
planningScopeQuery
schedulePublication
materializePlanPublication
historicalPlanSurface
```

Use repository reality rather than assuming these are the only files.

For every confirmed defect, require:

1. a failing regression demonstrating the defect before the implementation correction where practical;
2. the narrow implementation correction;
3. passing regression after the correction;
4. existing relevant tests remain green.

Do not rewrite broad tests merely to make changed behavior appear correct.

---

## 22. Required Correctness Matrix in RESULT

The RESULT must include:

| Defect | Reproduced Before Change? | Root Cause | Semantic Owner Changed | Regression Added | Result |
|---|---|---|---|---|---|

Include at minimum:

- corrective gap crossing Work;
- corrective occupancy ignoring realized facts;
- unplaced move acceptance identity;
- successful revision losing realized facts;
- custom Sleep window clipping at boundary;
- readiness ignoring historical protection;
- publication post-commit uncertainty messaging/result.

---

## 23. Required Invariant Matrix in RESULT

Include:

| Invariant | Before Task | After Task | Evidence |
|---|---|---|---|
| Corrective move never overlaps locked Work | Violated | Required preserved | Test/code |
| Corrective move respects realized Goal work | Violated/incomplete | Required preserved | Test/code |
| Corrective move respects support activity | Incomplete | Required preserved | Test/code |
| Corrective move respects protected buffer | Incomplete | Required preserved | Test/code |
| Supported unplaced Try can be durably accepted | Violated | Required preserved | Test/code |
| Preview revision preserves realized facts | Violated | Required preserved | Test/code |
| Overnight custom Sleep may cross owner boundary | Violated | Required preserved | Test/code |
| Canonical owner remains deterministic | Preserved | Must remain preserved | Test/code |
| Protected history blocks readiness | Violated | Required preserved | Test/code |
| Failed publication does not overstate write certainty | Violated | Required preserved | Test/code |
| Atomic historical writes remain intact | Preserved | Must remain preserved | Test/code |
| Preview never substitutes for Published Plan | Preserved | Must remain preserved | Test/code |

---

## 24. Required Scope-Protection Matrix

The RESULT must explicitly report whether each adjacent area changed.

| Area | Expected |
|---|---|
| Planner information architecture | Unchanged |
| Summary information architecture | Unchanged |
| Today destination structure | Unchanged |
| Goal constructive planning architecture | Unchanged |
| Goal Structure authoring | Unchanged |
| Demand / Capacity / Proposal semantics | Unchanged |
| Accepted Allocation semantics | Unchanged |
| Realization authority | Unchanged |
| Found Time | Unchanged |
| recurring Goal Demand | Unchanged |
| full first-class Sleep authority | Deferred |
| HistoricalPlan recovery UX | Deferred |
| persistence schemas | Unchanged |
| backup schemas | Unchanged |

Any unexpected change must be explained.

---

## 25. Validation

Discover and use the repository's canonical validation commands.

At minimum run, where available:

```text
format/check
lint
typecheck
relevant targeted tests
full test suite
production build
```

Do not guess script names.

Inspect `package.json` and project documentation first.

Task 9.8C baseline reported:

```text
127 test files
1,110 tests
```

This is context, not a required fixed final count.

New regression tests should normally increase the count.

Record:

- commands;
- exit status;
- test-file count;
- test count;
- build result;
- any warnings;
- any baseline failures unrelated to Task 9.9.

---

## 26. Repository Hygiene

Before implementation:

1. inspect `git status`;
2. preserve all pre-existing user changes;
3. identify the Task 9.8B dirty-tree state noted by Task 9.8C;
4. do not overwrite unrelated work;
5. do not reset;
6. do not checkout over user changes;
7. do not clean untracked user artifacts.

After implementation:

1. inspect the final diff;
2. verify only Task 9.9-relevant implementation/tests/docs changed;
3. run `git diff --check`;
4. report any pre-existing dirty files separately.

Do not commit or push unless explicitly instructed.

---

## 27. Required Durable RESULT Artifact

Create:

```text
PHASE_9_TASK_9_9_PRE_MIGRATION_CORRECTNESS_AUTHORITY_CONVERGENCE_V1_RESULT.md
```

Place it in the existing Phase 9 durable results folder.

Discover and follow the existing folder convention.

The filename must contain:

```text
RESULT
```

The RESULT is part of Task 9.9 and must accurately describe what was actually changed and validated.

---

## 28. Required RESULT Structure

The RESULT must contain these sections in this order:

```text
# Task 9.9 — Pre-Migration Correctness & Authority Convergence V1 RESULT

## 1. Executive Summary

## 2. Baseline Repository State

## 3. Confirmed Defects Reproduced

## 4. Corrective Gap Search Changes

## 5. Corrective Occupancy Changes

## 6. Unplaced Move Acceptance Identity Changes

## 7. Preview Realization Preservation Changes

## 8. Sleep Cross-Boundary Placement Changes

## 9. Publication Readiness Changes

## 10. Publication Failure / Commit-Certainty Changes

## 11. Historical Protection Preservation

## 12. BeforeWork / AfterWork Regression Coverage

## 13. Correctness Matrix

## 14. Invariant Matrix

## 15. Scope-Protection Matrix

## 16. Tests Added / Updated

## 17. Validation Performed

## 18. Files Changed

## 19. Deferred / Unresolved Findings

## 20. Completion Assessment
```

---

## 29. Deferred / Unresolved Findings

The RESULT must preserve, not erase, unresolved Task 9.8C findings.

At minimum list:

```text
original beforeWork dogfood incident root cause
original approximately 18 afterWork Night Shift incident cause
original 11-Sleep incident exact configuration/cause
October 2 / October 16 transition incident exact cause
reported realized-geometry replacement incident
complete first-class Sleep authority design
complete HistoricalPlan recovery UX
Found Time workflow
recurring Goal Demand
Planner / Summary migration
Day Worksurface convergence
```

If Task 9.9 independently reproduces and conclusively resolves one of the incident causes, it may move from unresolved to resolved with exact evidence.

Do not do so by inference.

---

## 30. Completion Criteria

Task 9.9 is complete only when all of the following are true:

### Corrective placement

- [ ] The corrective gap-search overlap defect is deterministically reproduced.
- [ ] Corrective gap search no longer returns geometry overlapping locked Work.
- [ ] Corrective placement respects the complete activity footprint.
- [ ] Corrective placement respects realized Goal work.
- [ ] Corrective placement respects realized support activity.
- [ ] Corrective placement respects protected buffers.
- [ ] No valid opening produces unresolved/unplaced rather than invalid geometry.

### Acceptance identity

- [ ] The unplaced Try Move acceptance defect is reproduced.
- [ ] A successfully moved unplaced occurrence can be durably accepted.
- [ ] Acceptance preserves semantic occurrence identity.
- [ ] Fresh regeneration replays the accepted decision.
- [ ] Stale/different occurrence protections remain intact.

### Preview / realization

- [ ] Successful Preview revision preserves realized Goal facts.
- [ ] Successful Preview revision preserves support facts.
- [ ] Successful Preview revision preserves protected buffers.
- [ ] Realized facts participate in corrective occupancy.
- [ ] Try/Accept does not mutate realization authority.

### Sleep / Day Boundary

- [ ] The custom overnight Sleep clipping defect is reproduced.
- [ ] A valid 22:00–08:00 custom Sleep window can cross a midnight Day Boundary.
- [ ] Noon-boundary behavior remains valid.
- [ ] Existing beforeWork overnight Sleep behavior remains valid.
- [ ] canonical user-day ownership remains deterministic.
- [ ] cross-boundary placement does not create duplicate occurrences.
- [ ] Work and other occupancy remain protected.

### Publication readiness

- [ ] Protected HistoricalPlan authority prevents `Ready to publish`.
- [ ] Unknown coverage remains distinct from empty/no publication.
- [ ] deterministically known materializer blockers are reflected before misleading readiness where practical.
- [ ] healthy missing prior publication can still be publishable.

### Publication result semantics

- [ ] Pre-write failure can be distinguished from uncertain post-commit verification failure.
- [ ] UI/read-model copy does not claim guaranteed unchanged history when write certainty is unknown.
- [ ] historical atomicity remains intact.
- [ ] protected history is never overwritten.
- [ ] uncertain state does not trigger blind retry or destructive recovery.

### Work-relative regression protection

- [ ] representative Day Shift beforeWork invariant covered.
- [ ] representative Evening Shift beforeWork invariant covered.
- [ ] representative Night Shift beforeWork invariant covered.
- [ ] representative Day Shift afterWork invariant covered.
- [ ] representative Evening Shift afterWork invariant covered.
- [ ] representative Night Shift afterWork invariant covered.
- [ ] full buffers participate in these assertions.
- [ ] unproven original incident causality is not overstated.

### Scope protection

- [ ] No Planner migration performed.
- [ ] No Summary migration performed.
- [ ] No Day Worksurface migration performed.
- [ ] No Found Time implementation performed.
- [ ] No recurring Goal Demand implementation performed.
- [ ] No complete first-class Sleep redesign performed.
- [ ] No destructive HistoricalPlan recovery implemented.
- [ ] No unauthorized persistence/schema migration performed.
- [ ] Existing Goal/Proposal/Accepted Allocation/Realization semantics remain intact.

### Validation

- [ ] Relevant targeted tests pass.
- [ ] Full test suite passes.
- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] Repository formatting/lint validation passes where canonical scripts exist.
- [ ] `git diff --check` passes.
- [ ] Pre-existing dirty-tree changes remain preserved.
- [ ] Required RESULT artifact exists.
- [ ] RESULT filename contains `RESULT`.

---

## 31. Final Completion Statement

If and only if every required criterion is satisfied, end the RESULT with exactly:

```text
Task 9.9 — Pre-Migration Correctness & Authority Convergence V1 is COMPLETE.
```

If any required correctness or validation criterion remains unresolved, end with exactly:

```text
Task 9.9 — Pre-Migration Correctness & Authority Convergence V1 is INCOMPLETE.
```

Then immediately list the blocking criteria and evidence.

Do not claim completion merely because tests pass.

---

## 32. Governing Principle

Task 9.9 is the correctness gate before DayFrame's product shell converges.

The purpose is not to make the old UI prettier.

The purpose is to ensure that the engines and authority boundaries underneath the future UI tell the truth.

A new Planner cannot compensate for invalid placement geometry.

A new Day Worksurface cannot compensate for corrective decisions that cannot persist.

A new Summary cannot compensate for a revised Preview that forgets realized authority.

A clearer Publish button cannot compensate for readiness that disagrees with publication.

And a better Sleep editor cannot compensate for physical placement logic that incorrectly treats a DayFrame ownership boundary as a wall in time.

Correct the substrate first.

Preserve the authority model.

Then migrate the product around behavior we can trust.