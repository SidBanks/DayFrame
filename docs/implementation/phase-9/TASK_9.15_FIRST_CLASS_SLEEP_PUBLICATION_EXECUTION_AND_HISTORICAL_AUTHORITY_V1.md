# Task 9.15 — First-Class Sleep Publication, Execution & Historical Authority V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Publication / Today / Execution / Historical Authority / Recovery Safety  
**Primary Specification:** Task 9.10 — First-Class Sleep Architecture Specification  
**Prerequisites:**  
- Task 9.11 — First-Class Sleep Domain & Persistence Foundation — COMPLETE  
- Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation — COMPLETE  
- Task 9.13 — First-Class Sleep Capacity & Planning Integration V1 — COMPLETE  
- Task 9.14 — First-Class Sleep Friction & Corrective Authority V1 — COMPLETE  
**Implementation Changes:** **AUTHORIZED WITHIN THIS TASK'S BOUNDED SCOPE**  
**Legacy Sleep Conversion:** **PROHIBITED**  
**Sleep Progress / Learning:** **PROHIBITED**  
**Planner / Summary Shell Migration:** **PROHIBITED**  
**HistoricalPlan General Recovery UX:** **PROHIBITED EXCEPT FOR SAFETY/COMPATIBILITY REQUIRED BY FIRST-CLASS SLEEP**  
**Required Durable Output:** `PHASE_9_TASK_9_15_FIRST_CLASS_SLEEP_PUBLICATION_EXECUTION_HISTORICAL_AUTHORITY_V1_RESULT.md`

---

## 1. Objective

Complete the First-Class Sleep authority lifecycle from current solved planning truth into immutable publication, Today presentation, actual execution evidence, and historical query.

Tasks 9.10–9.14 established:

```text
SleepRequirementV1
        ↓
SleepOccurrenceV1
        ↓
canonical bounded feasibility
        ↓
SleepResolution
        ↓
Sleep-qualified planning
        ↓
optional bounded corrective authority
        ↓
Accepted Sleep placement
        ↓
fresh canonical re-solve
```

Task 9.15 must extend that chain to:

```text
fresh eligible solved Sleep
        ↓
explicit publication
        ↓
immutable Published Sleep snapshot
        ↓
Today consumes Published truth
        ↓
user reports actual Sleep outcome
        ↓
append-only Execution evidence
        ↓
Historical Sleep query
```

The governing rule is:

> **Publication freezes what DayFrame planned. Execution records what actually happened. Neither may rewrite the other.**

At completion, First-Class Sleep must have a complete bounded lifecycle from authored requirement through immutable historical evidence without introducing legacy conversion, Sleep Progress, learned Sleep behavior, or a new historical recovery system.

---

## 2. Canonical Authority Chain

Preserve:

```text
Authored Sleep Requirement
        ↓
Derived Sleep Occurrence
        ↓
Derived Sleep Solution
        ↓
Accepted Placement Correction (optional)
        ↓
Derived Current Planning Truth
        ↓
Published Sleep Snapshot
        ↓
Execution Assertion / Correction / Retraction
        ↓
Historical Query
```

Authority classes remain distinct:

```text
Authored
Derived
Accepted
Published
Execution
Historical read model
```

Do not collapse them.

---

## 3. Planned Truth Versus Actual Truth

Task 9.15 must establish this distinction explicitly:

```text
Published Sleep
= what the accepted plan said should occur

Sleep Execution
= what the user later says actually occurred
```

Examples:

```text
Published:
23:00–07:00

Actual:
23:45–06:20
```

Both remain true in their own authority layers.

Do not mutate publication to match execution.

Do not mutate execution to match publication.

Do not infer actual Sleep from planned Sleep.

---

## 4. Missing Execution Means Unknown

If Sleep was published but no execution record exists:

```text
actual Sleep = unknown
```

It does not mean:

```text
completed
skipped
zero minutes
```

Absence of execution evidence must remain absence of execution evidence.

---

## 5. Nonexecution Is Valid Evidence

The user may explicitly report that planned Sleep did not occur.

That is valid execution evidence.

It must not:

- invalidate the Published Plan;
- delete the published Sleep snapshot;
- rewrite the authored Sleep requirement;
- create a retrospective omission override;
- weaken future Sleep requiredness.

Planned required Sleep and actual nonexecution are compatible historical facts.

---

## 6. Unplanned Sleep Is Valid Evidence

The user may report actual Sleep that was not represented by a Published Sleep snapshot.

This must be representable without fabricating:

```text
SleepRequirementV1
PublishedSleepSnapshotV1
AcceptedSleepPlacement
```

Use the existing unplanned execution architecture if compatible.

Unplanned actual Sleep is execution evidence, not retroactive planning authority.

---

## 7. Required Pre-Implementation Audit

Before editing code, trace the actual production owners for:

### A. Publication

At minimum inspect:

```text
publishScheduleRangeV1
publicationEligibility
materializePlanPublication
HistoricalPlan batch/day records
publication fingerprints
publication coverage
publication verification
publication protection
uncertain commit handling
```

Trace:

```text
eligible current schedule
        ↓
materializer
        ↓
atomic persistence
        ↓
verification
        ↓
HistoricalPlan
```

### B. Today

Trace:

```text
buildTodayReadModel
TodaySurface
Published Plan consumption
generated/Preview fallback prohibition
selected day / canonical user-day handling
historical protection behavior
```

### C. Execution

Trace:

```text
ExecutionRecord
execution subject
record execution
correct execution
retract execution
historical execution target
unplanned execution
execution persistence
```

### D. History

Trace:

```text
HistoricalPlan
HistoricalExecution
historical query/read models
Summary consumption
history protection
authority recovery behavior
```

### E. Backup / Restore / Clear

Trace every affected persisted owner.

### F. First-Class Sleep

Trace all 9.11–9.14 owners:

```text
SleepRequirementV1
SleepOccurrenceReferenceV1
ScheduledSleepOccurrenceV1
SleepResolution
AcceptedSleepPlacementPayloadV1
PlanDecision
Sleep Friction
foundational planning
```

Record this audit in the RESULT.

---

## 8. Publication Eligibility

First-Class Sleep may be published only from fresh lawful current authority.

Publication must fail closed if relevant Sleep state is:

```text
infeasible
searchIncomplete
contextIncomplete
invalid
protected
accepted-placement reviewRequired
unresolved blocking Sleep Friction
```

A current satisfied solution may proceed only if all existing publication prerequisites also pass.

Do not create a second Sleep-specific readiness policy.

Use the same canonical publication eligibility owner established in Task 9.9.

---

## 9. Shared Eligibility Semantics

The following must agree:

```text
Review readiness
publication button eligibility
publication command preflight
materializer eligibility
```

They must not independently reinterpret First-Class Sleep state.

No:

```text
UI says ready
command says blocked
```

for equivalent fresh canonical authority, except where an intervening state change legitimately invalidates readiness.

---

## 10. Fresh Publication Revalidation

Publication must freshly revalidate Sleep authority immediately before materialization.

Do not trust:

```text
old Preview
old readiness result
old Try
old SleepResolution
old accepted-placement applicability result
```

as publication authority.

Required sequence:

```text
user initiates Publish
        ↓
fresh canonical eligibility
        ↓
fresh Sleep resolution
        ↓
fresh accepted-placement revalidation
        ↓
fresh materialization
        ↓
atomic persistence
```

---

## 11. Published Sleep Snapshot

Implement the Task 9.10 conceptual:

```text
PublishedSleepSnapshotV1
```

using repository naming/versioning conventions.

A Published Sleep snapshot must freeze enough information to reconstruct the planned Sleep truth without consulting mutable current setup.

At minimum preserve:

```text
snapshot version
durable Sleep occurrence reference
Sleep requirement ID
Sleep requirement incarnation
effective requirement revision
owner canonical user-day
slot
planned Sleep start
planned Sleep end
footprint start
footprint end
durationMinutes
beforeBufferMinutes
afterBufferMinutes
window/domain provenance sufficient for explanation
accepted placement provenance if applicable
Sleep dependency fingerprint
publication batch identity
publication range/context identity
canonical boundary context
timezone/context needed to interpret the published interval
```

Do not require current authored Sleep to interpret historical published Sleep.

---

## 12. Published Snapshot Is Immutable

After successful publication:

```text
edit Sleep requirement
change Work
change Day Boundary
accept/revoke placement
delete/recreate Sleep source
regenerate Preview
```

must not mutate the existing Published Sleep snapshot.

Future publication may create new immutable truth.

Past publication remains past truth.

---

## 13. Publication Freezes Derived Truth

Do not publish `SleepRequirementV1` itself as though authored intent were the schedule.

Publication freezes:

```text
the solved occurrence that the plan actually selected
```

plus sufficient provenance.

The authored requirement may be referenced/snapshotted for explanation, but published time ownership comes from the selected solved occurrence.

---

## 14. Accepted Placement Provenance

If a published Sleep occurrence was constrained by a valid Accepted Sleep placement, publication must preserve that provenance.

At minimum historical truth must distinguish:

```text
canonical derived placement
```

from:

```text
derived placement constrained by accepted corrective authority
```

Do not require the current live PlanDecision record to interpret the historical publication.

If the decision is later revoked, the old publication still records that the decision influenced that publication.

---

## 15. Publication and Revocation

Revoking an Accepted Sleep placement after publication must not rewrite prior publication.

Conceptually:

```text
Published Tuesday Sleep
was constrained by accepted pin

Wednesday:
user revokes pin

Tuesday publication remains unchanged.
Future unpublished planning no longer uses pin.
```

Test this explicitly.

---

## 16. Cross-Boundary Publication

First-Class Sleep may cross:

```text
civil midnight
canonical Day Boundary
cycle transition
publication-range edge
```

Publication must not clip or duplicate the occurrence merely because the physical interval crosses one of these boundaries.

The occurrence retains its canonical owner-day identity.

---

## 17. Publication Seam Safety

Task 9.10 requires adjacent publications not to silently contradict the same Sleep occurrence.

Audit existing publication range semantics.

If one required Sleep occurrence physically intersects multiple publication-day/range surfaces:

```text
there must be one canonical historical Sleep occurrence identity.
```

Do not publish conflicting duplicate snapshots of the same durable Sleep occurrence.

If existing publication architecture requires widening the atomic publication scope or rejecting a seam-unsafe publication, implement the narrowest correct behavior.

Do not silently clip.

Do not silently duplicate.

Document the exact seam rule.

---

## 18. Adjacent Publication Idempotence

Publishing adjacent or overlapping ranges must not create contradictory versions of the same unchanged Sleep occurrence.

Use existing immutable publication semantics.

Required distinctions:

```text
identical historical truth
→ lawful no-op / deduplicated behavior

changed current truth for a newly published bounded plan
→ new immutable publication authority according to existing architecture

attempt to contradict protected immutable history
→ block/protect
```

Do not overwrite historical Sleep truth in place.

---

## 19. Publication Batch Atomicity

Sleep publication participates in the existing publication transaction.

Do not:

```text
write ordinary schedule history
then separately write Sleep history
```

such that one can commit without the other.

For one publication command:

```text
ordinary published plan
+
First-Class Sleep published snapshots
```

must share the existing atomic publication authority boundary.

---

## 20. Publication Failure Taxonomy

Preserve Task 9.9 semantics:

```text
known pre-commit failure
write failed before commit
verification failed after commit
commit state uncertain
verified success
identical no-op
```

First-Class Sleep must not weaken this.

If post-write verification cannot establish whether Sleep publication committed:

```text
protect history
block blind retry
```

according to existing HistoricalPlan safety policy.

Never claim:

```text
history unchanged
```

unless commit certainty proves it.

---

## 21. Historical Protection

If HistoricalPlan is protected/unavailable:

```text
Today must not fall back to Preview Sleep
Summary/history must not invent Sleep history
publication must not blindly continue
```

First-Class Sleep obeys the same authority protection rules as other published plan truth.

Do not create a Sleep-specific fallback store.

---

## 22. Publication Persistence Ownership

Prefer extending the existing HistoricalPlan publication owner.

Do not create:

```text
sleep-publications-v1
```

as a separate storage silo unless architecture evidence makes it unavoidable.

If the existing publication schema must advance, do so explicitly and minimally.

Document:

```text
old version
new version
migration
reader behavior
writer behavior
unknown-version behavior
backup behavior
restore behavior
protection behavior
```

---

## 23. Today Must Consume Published Sleep

Today must display First-Class Sleep only from effective Published Plan authority when presenting planned truth.

It must not regenerate current Sleep as a substitute.

Therefore:

```text
Published Sleep exists
→ Today shows published planned Sleep

No Published Sleep exists
→ Today does not claim generated Sleep is published planned truth

HistoricalPlan protected
→ Today remains protected
```

Current generated Sleep may exist elsewhere in Planner/Review, but not masquerade as Today publication truth.

---

## 24. Today Owner-Day Semantics

Today must use the canonical DayFrame user-day.

A Sleep occurrence owned by the current canonical user-day may physically:

```text
start on previous civil date
start on current civil date
end on next civil date
cross Day Boundary
```

and still belong to that DayFrame day.

Do not reassign published Sleep ownership from geometry.

---

## 25. Today Planned Sleep Presentation

Today should expose enough information to distinguish:

```text
planned Sleep interval
planned duration
owner DayFrame day
required protection
publication provenance
accepted-placement provenance when applicable
execution state
```

Do not expose architecture jargon unnecessarily.

Internal terms such as:

```text
PublishedSleepSnapshotV1
dependency fingerprint
incarnation
```

need not become ordinary-user copy.

---

## 26. Today Execution State

For published Sleep, Today/history presentation must distinguish at minimum:

```text
actual unknown
actual reported
explicitly not slept / skipped
execution corrected
execution retracted
```

Reuse existing execution presentation conventions where possible.

Do not infer completion from current time passing.

---

## 27. No Automatic Sleep Completion

DayFrame must not automatically create Sleep execution because:

```text
the planned interval ended
the user opened Today
the day changed
the publication exists
```

Actual Sleep requires explicit execution evidence.

---

## 28. Sleep Execution Subject

Implement the Task 9.10 conceptual:

```text
PublishedSleepExecutionSubjectV1
```

or repository-equivalent.

A planned Sleep execution subject must reference immutable published Sleep truth.

At minimum identify:

```text
published Sleep occurrence identity
publication batch/snapshot identity
durable Sleep occurrence reference
```

Do not target mutable current `SleepRequirementV1` as the execution subject for planned Sleep.

---

## 29. Execution Identity

Execution identity must remain distinct from:

```text
Sleep occurrence identity
publication identity
```

One planned Sleep occurrence may have an execution assertion/correction/retraction chain.

Use existing ExecutionRecord identity/lifecycle conventions.

Do not use:

```text
owner day alone
geometry alone
title
array position
```

as execution identity.

---

## 30. Planned Sleep Execution Assertion

The user must be able to assert actual Sleep for a published Sleep occurrence.

At minimum support actual:

```text
start
duration or end
```

according to existing execution model.

Actual Sleep may differ from plan.

Do not require actual geometry to remain inside the planned interval.

Do not silently clamp actual Sleep to published geometry.

---

## 31. Actual Sleep Duration

Actual duration is user-asserted execution evidence.

It may be:

```text
equal to planned
shorter than planned
longer than planned
```

within the generic validation limits appropriate to an execution record.

This does not alter the authored required duration.

---

## 32. Explicit Nonexecution

Support the existing execution equivalent of:

```text
skipped
not completed
did not occur
```

for a planned Sleep occurrence.

If existing execution architecture uses a specific outcome vocabulary, reuse it.

Do not create a retrospective Sleep omission authority.

The record means:

```text
the plan required Sleep,
but actual execution says it did not occur.
```

---

## 33. Execution Correction

A user must be able to correct previously reported Sleep execution using the existing append-only correction model.

Do not mutate the old execution assertion in place if the canonical execution architecture uses correction chains.

Historical query must resolve the effective current assertion while preserving provenance.

---

## 34. Execution Retraction

A user must be able to retract erroneous Sleep execution evidence.

Retraction means:

```text
the prior assertion should no longer be treated as effective actual evidence
```

not:

```text
the user definitely did not sleep.
```

After retraction, actual state may return to unknown unless another effective assertion exists.

---

## 35. Planned Versus Actual Comparison

Historical/Today read models may derive:

```text
planned duration
actual reported duration
difference
planned start
actual start
```

when both sides are known.

These are derived comparisons.

Do not persist them as new authority unless existing architecture requires it.

---

## 36. No Automatic Goal Progress

Task 9.10 explicitly states:

```text
Sleep execution does not automatically become Goal Progress.
```

Preserve this.

Do not map actual Sleep duration into:

```text
Goal progress
Goal completion
habit streak
allocation realization
```

in Task 9.15.

---

## 37. No Learned Requirement Mutation

Execution/history must not automatically change:

```text
Sleep required duration
Sleep window
Sleep buffers
Sleep enabled state
Sleep recurrence/applicability
```

Learning remains deferred.

Historical evidence may later inform recommendations, but has no authored authority here.

---

## 38. Unplanned Sleep Execution

Audit the existing unplanned execution subject/category.

If it can safely represent Sleep:

```text
extend it with explicit Sleep semantics.
```

An unplanned Sleep record must preserve:

```text
actual start
actual duration/end
user assertion provenance
canonical DayFrame day association if required
```

without fabricating publication.

If the existing generic unplanned execution model cannot safely represent this, implement the narrowest compatible extension.

---

## 39. Unplanned Sleep Does Not Satisfy Publication Retroactively

If:

```text
published Sleep was skipped
```

and later:

```text
unplanned Sleep occurred
```

both may be recorded.

Do not rewrite the published occurrence into the unplanned occurrence.

Do not automatically retarget unplanned execution to a published subject merely because times overlap.

---

## 40. Execution Across Day Boundaries

Actual Sleep may cross:

```text
civil midnight
canonical Day Boundary
DST transition
```

Preserve physical elapsed-time semantics.

Do not derive actual duration by naive local-clock subtraction where DST makes it incorrect.

Reuse existing physical instant conventions.

---

## 41. Execution Owner Association

For execution attached to Published Sleep:

```text
historical association follows the published Sleep occurrence identity.
```

Do not recompute owner day from actual geometry.

For unplanned Sleep, define the canonical owner-association rule explicitly using existing execution/user-day semantics.

Document it.

---

## 42. Historical Sleep Query

Implement or extend a canonical historical query capable of returning First-Class Sleep planned/actual truth.

For a requested historical scope, distinguish:

```text
published planned Sleep
actual execution known
actual execution unknown
explicit nonexecution
corrected execution
retracted execution
unplanned Sleep
historical authority protected/unavailable
```

Do not require current authored Sleep to answer historical questions.

---

## 43. Historical Query Is Read-Only

Historical Sleep query must not:

- regenerate planning;
- mutate publication;
- create execution;
- create Progress;
- update Sleep requirement;
- repair history;
- infer missing execution.

It is a read model over immutable/append-only authority.

---

## 44. Historical Requirement Independence

Test:

```text
publish Sleep
delete/recreate current Sleep requirement
query old historical period
```

Expected:

```text
published Sleep remains interpretable
```

without current source lifetime.

Historical publication must carry enough frozen information.

---

## 45. Historical Accepted-Decision Independence

Test:

```text
accept Sleep placement
publish
revoke placement
query historical publication
```

Expected:

```text
historical publication still records accepted-placement provenance
```

without treating the currently revoked decision as if it had never influenced the plan.

---

## 46. Historical Boundary Independence

Test:

```text
publish Sleep under Day Boundary A
change current Day Boundary to B
query old publication
```

Expected:

```text
historical owner/context remains A-derived published truth.
```

Do not reinterpret history using current preferences.

---

## 47. Historical Timezone / Offset Independence

Published Sleep must preserve enough context that later current timezone/environment changes do not reinterpret the historical physical interval.

Do not depend solely on parsing current local clock semantics.

Persist physical instants and required versioned context.

---

## 48. Historical Protection Semantics

If historical Sleep authority is malformed, unsupported, missing required context, or otherwise cannot be safely interpreted:

```text
protect
```

according to existing HistoricalPlan policy.

Do not silently omit Sleep snapshots and return an apparently complete historical plan.

---

## 49. Historical Coverage

Existing historical coverage semantics must account for First-Class Sleep publication.

A historical range must not claim complete interpretable plan coverage if required Sleep publication authority for that range is protected/incomplete under the schema.

Do not conflate:

```text
no Sleep was configured
```

with:

```text
Sleep history could not be interpreted.
```

---

## 50. Summary Integration Boundary

Task 9.15 may extend the existing Summary/history read model only enough to expose First-Class Sleep historical evidence coherently.

Do not redesign Summary.

Do not add recommendations.

Do not add sleep scores.

Do not add health interpretations.

Do not add Goal Progress.

Prefer minimal existing history presentation.

---

## 51. Backup Semantics

Full backup must preserve:

```text
Published Sleep snapshots
publication context/provenance
planned Sleep geometry
accepted-placement provenance
Sleep execution assertions
Sleep execution corrections
Sleep execution retractions
unplanned Sleep execution
```

according to existing backup authority ownership.

Do not create a separate Sleep backup silo.

---

## 52. Restore Semantics

Full restore must restore Sleep publication/execution authority exactly.

It must not allocate new identities for historical publication or execution.

It must validate:

```text
snapshot versions
publication references
execution subjects
execution chain integrity
physical timestamps
required frozen context
```

according to existing strict validation policy.

---

## 53. Restore Independence From Current Authored Sleep

A valid backup containing historical Sleep publication/execution must restore even if current authored Sleep has since changed, provided the backup itself is internally valid.

Historical snapshots are not required to point to a currently active source lifetime to remain historical truth.

Distinguish this from live Accepted Sleep placement, which does require current source-lifetime validity.

---

## 54. Clear / Anti-Resurrection

Full clear must remove effective Sleep:

```text
publication history
execution history
```

through the existing canonical owners when full clear semantics say those owners are cleared.

After:

```text
publish Sleep
record execution
clear
restart
```

no cleared Sleep authority may resurrect from retry/checkpoint side channels.

Do not change the established meaning of full clear merely for this task.

---

## 55. Profiles

Profiles remain portable authored intent.

Profiles must not contain:

```text
Published Sleep snapshots
Sleep execution
historical Sleep
accepted occurrence-specific placement
```

unless existing profile architecture already explicitly violates this distinction.

Prove profile save/load does not transport historical Sleep authority into a fresh setup lifetime.

---

## 56. Schema Evolution

Task 9.15 will likely require publication and execution schema evolution.

Do not pre-decide version numbers.

Audit first.

For each changed persisted schema, document:

| Surface | Old Version | New Version | Why Required | Migration | Old Reader Behavior | Unknown Future Version Behavior |
|---|---:|---:|---|---|---|---|

Do not bump unrelated schemas.

Do not bump Active/Profile merely because publication/execution changed.

---

## 57. Backward Compatibility

Existing historical publications without First-Class Sleep must remain valid.

They must mean:

```text
this historical publication predates First-Class Sleep publication semantics
```

not:

```text
Sleep definitely did not exist biologically.
```

Do not synthesize Sleep snapshots into old history.

---

## 58. Legacy Sleep Remains Legacy

Legacy Sleep Commitment publication/execution/history retains its existing semantics.

Do not:

```text
reinterpret legacy category sleep as First-Class Sleep
promote old execution
rewrite old HistoricalPlan
infer requiredness
```

Task 9.16 owns explicit conversion/transition.

---

## 59. Coexistence

If legacy Sleep Commitment and First-Class Sleep coexist before conversion:

```text
their historical identities remain distinct.
```

Do not deduplicate them by title/category.

A legacy Sleep Commitment and First-Class Sleep occurrence are not the same semantic object merely because their physical intervals overlap.

---

## 60. Publication Identity

Define the canonical historical identity for a Published Sleep occurrence.

It must preserve:

```text
durable Sleep occurrence identity
+
publication authority identity
```

without using geometry as semantic identity.

Document how overlapping/adjacent publication batches recognize the same occurrence.

---

## 61. Publication Fingerprint

First-Class Sleep must participate in publication fingerprinting sufficiently that materially different planned Sleep truth cannot be mistaken for an identical publication.

At minimum changes in:

```text
planned start/end
footprint
duration/buffers
owner identity
source lifetime
accepted-placement provenance where semantically relevant
boundary/context required to interpret plan
```

must affect historical equivalence as appropriate.

Do not include irrelevant presentation text.

---

## 62. Execution Fingerprint / Validation

If execution uses fingerprints/versioned validation, include First-Class Sleep subjects appropriately.

Do not allow an execution record to target:

```text
nonexistent published Sleep snapshot
wrong publication batch
wrong occurrence identity
unsupported snapshot version
```

without protection/rejection according to existing execution policy.

---

## 63. Publication and Current Planning Divergence

After publication, current authored/planning truth may change.

That is lawful.

Example:

```text
Published:
23:00–07:00

Current unpublished plan after edit:
22:00–06:00
```

Today/historical planned truth for the published period remains:

```text
23:00–07:00
```

until a lawful new publication changes the bounded published authority according to existing publication semantics.

Do not let current derived planning leak into historical presentation.

---

## 64. Execution Does Not Change Planning Retroactively

Recording:

```text
actual Sleep 00:30–05:45
```

must not trigger retroactive rescheduling of the already Published Plan.

Future planning may eventually learn from history, but that is outside Task 9.15.

---

## 65. Required Publication Tests

At minimum prove:

### Fresh satisfied Sleep

```text
fresh satisfied Sleep
all existing readiness prerequisites satisfied
Publish
→ immutable Published Sleep snapshot
```

### Infeasible

```text
Publish blocked
no historical write
```

### Search incomplete

```text
Publish blocked
no historical write
```

### Context incomplete

```text
Publish blocked
no historical write
```

### Invalid/protected

```text
Publish blocked/protected
no false success
```

### Accepted placement reviewRequired

```text
Publish blocked
```

### Blocking Sleep Friction

```text
Publish blocked
```

---

## 66. Required Publication Freshness Tests

Between readiness and Publish change:

```text
Sleep requirement
Work
manual fixed Event
accepted Sleep placement
revocation
realized hard fact
Day Boundary/context
```

Expected:

```text
fresh publication revalidation
```

and no stale Sleep publication.

---

## 67. Required Published Snapshot Tests

Prove the snapshot freezes:

- occurrence reference;
- source lifetime;
- effective revision;
- owner day;
- planned physical interval;
- footprint;
- duration;
- buffers;
- required context;
- publication identity;
- accepted-placement provenance when applicable.

Then mutate current authored/accepted state and prove snapshot byte/semantic immutability.

---

## 68. Required Cross-Boundary Publication Tests

At minimum:

```text
Sleep crosses civil midnight
Sleep crosses canonical Day Boundary
Sleep crosses cycle transition
Sleep extends outside nominal publication-day display
```

Expected:

```text
one owner occurrence
full physical interval retained
no clipping
no duplicate semantic occurrence
```

---

## 69. Required Publication Seam Tests

At minimum:

```text
publish range A
publish adjacent/overlapping range B
```

where one Sleep occurrence intersects the seam.

Prove:

```text
no contradictory duplicate
no clipped second copy
stable durable occurrence identity
lawful idempotence/protection
```

---

## 70. Required Publication Failure Tests

Inject:

```text
pre-write blocker
storage write failure
post-write verification failure
uncertain write state
```

Prove existing Task 9.9 certainty taxonomy remains correct with Sleep included.

No blind retry after uncertain/complete-but-unverified commit.

---

## 71. Required Today Tests

At minimum:

### Published Sleep

Today shows the published planned occurrence.

### Current derived differs

Today still shows published truth.

### No publication

Today does not call generated Sleep “published plan.”

### Historical protection

Today refuses fallback.

### Cross-boundary owner

Today associates Sleep with canonical published owner day.

### Accepted provenance

Today can explain accepted-placement provenance without consulting mutable current decision.

---

## 72. Required Execution Tests

At minimum:

### Exact completion

```text
planned 23:00–07:00
actual 23:00–07:00
```

### Shorter actual

```text
actual 00:00–06:00
```

retained as actual evidence.

### Longer actual

Valid longer actual retained without changing required duration.

### Shifted actual

Actual outside planned geometry remains representable.

### Explicit nonexecution

Plan remains immutable; actual outcome recorded.

### Missing execution

Actual remains unknown.

### Correction

Effective assertion changes through append-only correction.

### Retraction

Effective actual returns appropriately to unknown/other surviving assertion.

---

## 73. Required Unplanned Sleep Tests

At minimum:

```text
no Published Sleep subject
record unplanned Sleep
```

Expected:

```text
execution evidence exists
no fabricated publication
no fabricated Sleep requirement
```

Also test coexistence with a separately skipped Published Sleep occurrence.

---

## 74. Required Execution Identity Tests

Prove:

```text
same owner day
different publication/occurrence
```

cannot collide merely by date.

Prove geometry changes in actual evidence do not change the immutable published occurrence identity.

---

## 75. Required Execution Boundary Tests

At minimum test:

```text
cross-midnight actual Sleep
cross-Day-Boundary actual Sleep
DST spring transition
DST fall transition
```

Use physical elapsed duration.

No naive local-clock arithmetic.

---

## 76. Required Historical Query Tests

For one historical range include:

```text
published + actual reported
published + actual unknown
published + explicit nonexecution
published + corrected execution
published + retracted execution
unplanned Sleep
```

Query must distinguish each correctly.

---

## 77. Required Historical Independence Tests

At minimum:

```text
publish
edit Sleep requirement
query history
```

```text
publish
delete/recreate Sleep source
query history
```

```text
publish under boundary A
switch to boundary B
query history
```

```text
publish with accepted pin
revoke pin
query history
```

Historical truth must remain stable.

---

## 78. Required Backup / Restore Tests

At minimum:

```text
publish Sleep
record actual Sleep
correct execution
backup
restore
restart
```

Expected:

```text
published snapshot preserved
execution chain preserved
effective actual preserved
historical query equivalent
```

Also include:

```text
retracted execution
unplanned Sleep
accepted-placement publication provenance
```

---

## 79. Required Malformed Authority Tests

Reject/protect as appropriate:

```text
unknown PublishedSleepSnapshot version
malformed physical timestamps
invalid duration/buffer relation
missing required publication context
execution targeting missing published Sleep
execution targeting wrong occurrence
unknown execution subject version
broken correction chain
```

Do not silently omit malformed Sleep history.

---

## 80. Required Profile Tests

Prove:

```text
publish Sleep
record execution
save profile
load profile
```

does not transport publication/execution history into the fresh profile lifetime.

---

## 81. Required Clear Tests

Prove full clear behavior for Sleep publication/execution matches established clear semantics and no retry/checkpoint resurrects cleared authority.

---

## 82. Required Legacy Regression Tests

Prove:

```text
legacy default_sleep
legacy category sleep
ordinary legacy Sleep Commitment publication/execution
```

retain existing semantics.

No automatic First-Class interpretation.

---

## 83. Required Coexistence Tests

When both exist:

```text
legacy Sleep Commitment
First-Class Sleep
```

prove:

```text
distinct identities
distinct historical provenance
no title/category deduplication
```

---

## 84. Required Non-Activation Tests

Prove Task 9.15 does not add:

```text
legacy conversion
Sleep Goal Progress
Sleep scoring
Sleep recommendations
learned Sleep requirement
automatic execution
device ingestion
health interpretation
one-off omission override
shortening authority
buffer waiver
Planner shell migration
Summary redesign
general HistoricalPlan recovery UX
```

---

## 85. Publication Matrix

Include in RESULT:

| Current Sleep State | Publication Eligible? | Historical Write Allowed? | Reason |
|---|---:|---:|---|
| notConfigured | | | |
| notApplicable | | | |
| satisfied | | | |
| infeasible | | | |
| searchIncomplete | | | |
| contextIncomplete | | | |
| invalid | | | |
| protected | | | |
| accepted placement applicable | | | |
| accepted placement reviewRequired | | | |
| blocking Sleep Friction | | | |

Populate with actual implemented semantics.

---

## 86. Planned / Actual Matrix

Include:

| Planned State | Execution State | Historical Meaning | Publication Mutated? | Requirement Mutated? |
|---|---|---|---:|---:|
| Published Sleep | no execution | | | |
| Published Sleep | completed as planned | | | |
| Published Sleep | shifted actual | | | |
| Published Sleep | shorter actual | | | |
| Published Sleep | longer actual | | | |
| Published Sleep | explicit nonexecution | | | |
| Published Sleep | corrected execution | | | |
| Published Sleep | retracted execution | | | |
| no Published Sleep | unplanned Sleep | | | |

---

## 87. Authority Matrix

Include:

| Object | Authority Layer | Persisted? | Mutable? | Owns Historical Truth? | May Execution Rewrite It? |
|---|---|---:|---:|---:|---:|
| SleepRequirementV1 | | | | | |
| SleepOccurrenceV1 | | | | | |
| ScheduledSleepOccurrenceV1 | | | | | |
| Accepted Sleep placement | | | | | |
| Published Sleep snapshot | | | | | |
| Sleep Execution assertion | | | | | |
| Sleep Execution correction | | | | | |
| Sleep Execution retraction | | | | | |
| Historical Sleep read model | | | | | |

---

## 88. Persistence Matrix

Include:

| Surface | Authored Sleep | Accepted Pin | Published Sleep | Sleep Execution | Portable or Authority-Preserving? |
|---|---:|---:|---:|---:|---|
| Active | | | | | |
| PlanDecision | | | | | |
| Profile | | | | | |
| HistoricalPlan | | | | | |
| Execution owner | | | | | |
| Full Backup | | | | | |
| Restore | | | | | |
| Clear | | | | | |
| Preview | | | | | |

---

## 89. Publication / Execution Lifecycle Matrix

Include:

| Stage | Authority Class | Writes? | Source of Truth | Fresh Revalidation? |
|---|---|---:|---|---:|
| Review readiness | | | | |
| Publish preflight | | | | |
| Materialize | | | | |
| Persist publication | | | | |
| Today planned query | | | | |
| Record actual | | | | |
| Correct actual | | | | |
| Retract actual | | | | |
| Historical query | | | | |

---

## 90. Historical Independence Matrix

Include:

| Current-State Change After Publication | May Old Published Sleep Change? | May Old Execution Change? | Historical Query Dependency |
|---|---:|---:|---|
| Sleep requirement edit | | | |
| Sleep source delete/recreate | | | |
| Work edit | | | |
| Day Boundary edit | | | |
| accepted pin revoke | | | |
| new Preview | | | |
| new current Sleep solution | | | |

---

## 91. Required Behavioral Invariants

Task 9.15 must establish and test at least:

1. Publication consumes fresh canonical Sleep authority.
2. Publication does not trust stale Preview Sleep.
3. Publication does not trust stale readiness.
4. Satisfied Sleep may publish only when all existing prerequisites pass.
5. Infeasible Sleep cannot publish.
6. Search-incomplete Sleep cannot publish.
7. Context-incomplete Sleep cannot publish.
8. Invalid Sleep authority cannot publish.
9. Protected Sleep authority cannot publish.
10. Review-required accepted placement cannot publish.
11. Blocking Sleep Friction cannot publish.
12. Review/preflight/materializer share canonical eligibility semantics.
13. Published Sleep freezes solved occurrence truth.
14. Published Sleep does not merely serialize authored intent.
15. Published Sleep has durable occurrence provenance.
16. Published Sleep preserves source lifetime provenance.
17. Published Sleep preserves effective revision provenance.
18. Published Sleep preserves canonical owner day.
19. Published Sleep preserves physical start/end.
20. Published Sleep preserves full required footprint.
21. Published Sleep preserves duration.
22. Published Sleep preserves both buffers.
23. Published Sleep preserves required interpretation context.
24. Published Sleep preserves accepted-placement provenance when applicable.
25. Published Sleep is immutable.
26. Current Sleep edits do not mutate prior publication.
27. Work edits do not mutate prior publication.
28. Day Boundary edits do not reinterpret prior publication.
29. accepted-pin revocation does not rewrite prior publication.
30. source delete/recreate does not erase prior publication.
31. cross-midnight Sleep publishes as one occurrence.
32. cross-boundary Sleep retains owner identity.
33. publication range edges do not clip Sleep.
34. adjacent publication does not create contradictory duplicate Sleep truth.
35. publication identity is semantic, not geometry-only.
36. materially changed Sleep truth affects publication equivalence.
37. identical historical Sleep truth follows existing idempotence semantics.
38. Sleep publication shares ordinary publication atomicity.
39. Sleep publication preserves commit-certainty taxonomy.
40. uncertain publication commit protects history.
41. Today planned Sleep comes from Published Plan authority.
42. Today does not substitute generated Sleep for publication.
43. Today respects historical protection.
44. Today preserves canonical published owner day.
45. Today can distinguish planned Sleep from actual Sleep.
46. passage of time does not auto-complete Sleep.
47. planned Sleep execution targets immutable published Sleep.
48. execution does not target mutable current requirement as planned subject.
49. actual Sleep is user-asserted.
50. actual Sleep may differ from planned start.
51. actual Sleep may differ from planned duration.
52. actual Sleep may extend outside planned interval.
53. actual Sleep does not mutate published geometry.
54. actual Sleep does not mutate authored required duration.
55. missing execution means unknown.
56. explicit nonexecution is valid evidence.
57. nonexecution does not invalidate publication.
58. nonexecution does not create omission authority.
59. execution corrections preserve provenance.
60. execution retractions preserve provenance.
61. retraction does not mean explicit nonexecution.
62. effective actual evidence resolves through canonical execution lifecycle.
63. unplanned Sleep may be recorded.
64. unplanned Sleep does not fabricate publication.
65. unplanned Sleep does not fabricate requirement.
66. unplanned Sleep remains distinct from skipped published Sleep.
67. actual duration uses physical elapsed time.
68. DST does not corrupt actual elapsed duration.
69. published execution owner association follows published occurrence identity.
70. unplanned Sleep owner association is deterministic.
71. historical query is read-only.
72. historical query does not regenerate planning.
73. historical query does not infer missing execution.
74. historical query distinguishes planned/unknown/reported/nonexecution.
75. historical query resolves correction/retraction chains.
76. historical query includes unplanned Sleep distinctly.
77. historical publication remains interpretable without current Sleep source.
78. historical publication remains interpretable after accepted-pin revocation.
79. historical publication remains interpretable after Day Boundary change.
80. historical physical interval does not depend on current timezone interpretation.
81. malformed historical Sleep authority fails safely.
82. protected historical Sleep cannot masquerade as complete absence.
83. historical coverage distinguishes no configured Sleep from uninterpretable Sleep.
84. execution does not automatically create Goal Progress.
85. execution does not automatically change Sleep requirement.
86. history does not automatically create learned Sleep preferences.
87. full backup preserves Published Sleep.
88. full backup preserves Sleep execution chain.
89. full backup preserves unplanned Sleep.
90. restore preserves historical identities.
91. restore does not require current active Sleep source for immutable historical truth.
92. profile does not transport Published Sleep.
93. profile does not transport Sleep execution.
94. full clear follows existing historical clear semantics.
95. cleared Sleep history cannot resurrect.
96. legacy Sleep remains legacy.
97. legacy Sleep is not inferred into First-Class history.
98. legacy and First-Class Sleep may coexist with distinct identities.
99. Task 9.15 does not perform legacy conversion.
100. Task 9.15 completes First-Class Sleep from authored plan through immutable publication and append-only actual evidence without collapsing planned and actual truth.

---

## 92. Bundle Architecture Gate

Task 9.14 ended at:

```text
Initial gzip: 169,577 bytes
Hard limit:   170,000 bytes
Headroom:         423 bytes
```

This is an architectural constraint.

Task 9.15 must **not** raise, relax, bypass, reinterpret, or remove the existing hard bundle limit.

Because 423 bytes is effectively no implementation headroom, Codex must audit startup imports before implementing substantial publication/execution/history integration.

Prefer:

```text
lazy historical read surfaces
lazy execution orchestration
lazy publication-specific Sleep materialization
type-only imports
existing shared validators
existing dynamic boundaries
```

where semantically appropriate.

Do not duplicate:

```text
Sleep solver
Sleep snapshot validators
execution validators
historical validators
```

merely to avoid import cycles.

If necessary, perform a bounded architecture-preserving extraction/refactor whose sole purpose is to keep non-startup authority logic outside the initial bundle.

Such a refactor is authorized only if:

- semantics remain unchanged;
- tests prove unchanged behavior;
- no new persistence owner appears;
- no new dependency appears;
- the RESULT accounts for it explicitly.

If the existing hard bundle limit cannot be met without weakening architecture:

```text
Task 9.15 is INCOMPLETE.
```

Do not increase the threshold.

---

## 93. Bundle Evidence

Record:

```text
Task 9.14 baseline initial gzip
Task 9.15 final initial gzip
delta
hard limit
remaining hard headroom
initial raw
largest lazy chunk
total emitted output
advisory warnings
```

Also identify any import/lazy-boundary changes made specifically to preserve the hard limit.

---

## 94. Performance Assessment

Measure representative operations:

```text
publish with First-Class Sleep
Today read with published Sleep
record actual Sleep
correct actual Sleep
retract actual Sleep
historical Sleep query
```

Use representative historical ranges where applicable:

```text
7 days
31 days
90 days
```

Include at least one:

```text
cross-boundary Sleep
execution correction chain
```

Performance is observational.

Do not introduce semantic wall-clock timeouts.

---

## 95. Architecture Governance

Task 9.10 already specifies:

```text
PublishedSleepSnapshotV1
PublishedSleepExecutionSubjectV1
planned vs actual separation
append-only execution correction/retraction
unplanned Sleep
no automatic Progress
immutable history
```

Do not create an ADR merely to restate those decisions.

Create/amend governance only if implementation reveals a genuinely unresolved normative question.

Any persisted schema evolution alone does not automatically require a new architecture decision.

---

## 96. Prohibited Changes

Do **not**:

- redesign `SleepRequirementV1`;
- create `SleepRequirementV2`;
- change durable Sleep occurrence identity;
- change accepted-placement semantics from 9.14;
- create a second Sleep solver;
- publish stale Sleep;
- publish from Preview authority;
- publish from Try authority;
- publish review-required accepted placement;
- clip cross-boundary Sleep to publication display range;
- duplicate one Sleep occurrence across publication seams;
- overwrite prior immutable Sleep publication;
- let execution rewrite publication;
- let execution rewrite authored Sleep;
- infer actual Sleep from planned Sleep;
- auto-complete Sleep after time passes;
- treat missing execution as completed;
- treat missing execution as skipped;
- treat retraction as nonexecution;
- clamp actual Sleep to planned geometry;
- fabricate a Sleep requirement from execution;
- fabricate publication from unplanned Sleep;
- create Goal Progress from Sleep;
- create learned Sleep preferences;
- create Sleep scores;
- create health/medical interpretation;
- implement device/health integrations;
- infer legacy Sleep requiredness;
- convert legacy Sleep;
- rewrite legacy Sleep history;
- redesign Planner;
- redesign Summary;
- redesign Today beyond bounded integration;
- implement general HistoricalPlan recovery UX;
- create a separate Sleep publication storage silo;
- create a separate Sleep execution storage silo;
- create a separate Sleep history storage silo;
- bump unrelated schemas;
- weaken historical protection;
- weaken publication commit-certainty handling;
- weaken bundle thresholds;
- add dependencies unless necessary and explicitly justified;
- commit;
- push.

---

## 97. Validation

Run the repository standard validation.

At minimum:

```text
npm run format
npx prettier --check .
npm run lint
npm run build
npm test
npm run check:bundle
git diff --check
```

Also run focused suites covering:

```text
First-Class Sleep requirement
Sleep occurrence identity
Sleep derivation
Sleep solver
Sleep corrective authority
PlanDecision
publication eligibility
publication materialization
HistoricalPlan
publication fingerprints
publication failure certainty
Today
ExecutionRecord
historical execution target
execution correction
execution retraction
unplanned execution
historical queries
backup
restore
profiles
clear / anti-resurrection
legacy Sleep
cross-boundary scheduling
Day Boundary
DST
accepted allocation / realization regressions
```

Record exact commands and exact results.

Do not claim commands that were not actually run.

---

## 98. Repository Hygiene

Before implementation:

1. inspect `git status`;
2. record HEAD;
3. record all pre-existing dirty files;
4. preserve Tasks 9.9–9.14 work;
5. capture a baseline sufficient to distinguish Task 9.15 edits;
6. record baseline bundle measurements before changing startup imports.

After implementation:

1. inspect `git status`;
2. inspect `git diff --stat`;
3. inspect relevant diffs;
4. compare against baseline;
5. run `git diff --check`;
6. distinguish pre-existing modifications from Task 9.15 additions;
7. account for every Task 9.15 file;
8. do not commit;
9. do not push.

---

## 99. Required RESULT Artifact

Create exactly one durable task-result artifact:

```text
PHASE_9_TASK_9_15_FIRST_CLASS_SLEEP_PUBLICATION_EXECUTION_HISTORICAL_AUTHORITY_V1_RESULT.md
```

Place it in the existing Phase 9 durable result-artifact folder.

The filename must contain:

```text
RESULT
```

No additional task report is authorized.

Governance artifacts are permitted only if Section 95 requires them.

---

## 100. Required RESULT Structure

The RESULT must contain these sections in this exact order:

```text
# Task 9.15 — First-Class Sleep Publication, Execution & Historical Authority V1 RESULT

## 1. Executive Summary
## 2. Scope and Governing Architecture
## 3. Pre-Implementation Repository State
## 4. Current Publication / Execution / History Architecture Trace
## 5. Task 9.14 Authority Consumed
## 6. Planned Truth Versus Actual Truth
## 7. Publication Eligibility Integration
## 8. Fresh Publication Revalidation
## 9. Published Sleep Snapshot Model
## 10. Published Sleep Identity
## 11. Published Sleep Provenance
## 12. Accepted Placement Publication Provenance
## 13. Published Sleep Immutability
## 14. Cross-Boundary Publication
## 15. Publication Seam Safety
## 16. Publication Idempotence / Overlap Semantics
## 17. Publication Fingerprinting
## 18. Publication Atomicity
## 19. Publication Failure / Commit Certainty
## 20. Historical Protection
## 21. Today Planned Sleep Integration
## 22. Today Canonical Owner-Day Semantics
## 23. Today Planned / Actual Presentation
## 24. Sleep Execution Subject
## 25. Sleep Execution Identity
## 26. Planned Sleep Execution Assertion
## 27. Explicit Nonexecution
## 28. Execution Correction
## 29. Execution Retraction
## 30. Missing Execution / Unknown Semantics
## 31. Unplanned Sleep Execution
## 32. Execution Physical-Time Semantics
## 33. Execution Owner Association
## 34. Planned / Actual Comparison
## 35. Historical Sleep Query
## 36. Historical Requirement Independence
## 37. Historical Accepted-Decision Independence
## 38. Historical Boundary / Timezone Independence
## 39. Historical Coverage
## 40. Summary / History Integration Boundary
## 41. Persistence Ownership
## 42. Publication Schema Evolution
## 43. Execution Schema Evolution
## 44. Backup Semantics
## 45. Restore Semantics
## 46. Profile Semantics
## 47. Clear / Anti-Resurrection
## 48. Backward Compatibility
## 49. Legacy Sleep Regression
## 50. Legacy / First-Class Coexistence
## 51. Publication Matrix
## 52. Planned / Actual Matrix
## 53. Authority Matrix
## 54. Persistence Matrix
## 55. Publication / Execution Lifecycle Matrix
## 56. Historical Independence Matrix
## 57. Behavioral Invariants
## 58. Publication Test Coverage
## 59. Publication Freshness Coverage
## 60. Published Snapshot Coverage
## 61. Cross-Boundary / Seam Coverage
## 62. Publication Failure Coverage
## 63. Today Coverage
## 64. Execution Coverage
## 65. Correction / Retraction Coverage
## 66. Unplanned Sleep Coverage
## 67. DST / Boundary Execution Coverage
## 68. Historical Query Coverage
## 69. Historical Independence Coverage
## 70. Backup / Restore / Profile / Clear Coverage
## 71. Malformed Authority / Protection Coverage
## 72. Legacy / Coexistence Coverage
## 73. Non-Activation Coverage
## 74. Determinism / Non-Mutation Coverage
## 75. Performance Assessment
## 76. Bundle Architecture Assessment
## 77. Architecture Governance Assessment
## 78. Test Coverage
## 79. Validation Record
## 80. Changed Files
## 81. Deferred First-Class Sleep Work
## 82. Completion Assessment
```

---

## 101. Required Changed-Files Accounting

List every file changed by Task 9.15.

Classify each as:

```text
Sleep Publication
Publication Eligibility
Publication Materialization
Publication Fingerprint
HistoricalPlan
Historical Protection
Today
Sleep Execution
Execution Subject
Execution Correction
Execution Retraction
Unplanned Execution
Historical Query
Summary / History Read Model
Backup
Restore
Profile
Clear
Schema / Validation
Lazy / Bundle Architecture
UI Copy
Governance
Test
RESULT
```

For every changed file identify:

- purpose;
- semantic change;
- authority impact;
- persistence impact;
- schema/version impact;
- associated tests.

For already-dirty files distinguish:

```text
pre-existing modification
```

from:

```text
Task 9.15 additional modification
```

---

## 102. Completion Criteria

Task 9.15 is complete only if all applicable criteria are satisfied.

### Publication

- [ ] fresh satisfied First-Class Sleep can publish.
- [ ] publication uses canonical eligibility.
- [ ] publication freshly revalidates Sleep.
- [ ] stale Preview cannot publish Sleep.
- [ ] stale Try cannot publish Sleep.
- [ ] infeasible Sleep blocks publication.
- [ ] searchIncomplete blocks publication.
- [ ] contextIncomplete blocks publication.
- [ ] invalid/protected Sleep blocks publication.
- [ ] accepted-placement reviewRequired blocks publication.
- [ ] blocking Sleep Friction blocks publication.
- [ ] published snapshot freezes solved Sleep truth.
- [ ] published snapshot preserves durable occurrence identity.
- [ ] published snapshot preserves source lifetime.
- [ ] published snapshot preserves owner day.
- [ ] published snapshot preserves duration/buffers.
- [ ] published snapshot preserves physical geometry.
- [ ] published snapshot preserves required historical context.
- [ ] accepted-placement provenance is frozen when applicable.
- [ ] publication does not depend on mutable current decision afterward.
- [ ] publication is immutable.
- [ ] cross-boundary Sleep is not clipped.
- [ ] publication seams do not create contradictory duplicates.
- [ ] materially changed Sleep truth affects publication equivalence.
- [ ] Sleep shares existing publication atomicity.
- [ ] commit-certainty taxonomy remains intact.
- [ ] uncertain/complete-but-unverified commits protect history.

### Today

- [ ] Today planned Sleep comes from Published Plan.
- [ ] Today does not substitute generated Sleep.
- [ ] Today respects historical protection.
- [ ] Today uses canonical published owner day.
- [ ] Today distinguishes planned from actual.
- [ ] Today can represent actual unknown.
- [ ] Today can represent explicit nonexecution.
- [ ] Today can represent corrected/retracted execution.
- [ ] accepted-placement provenance remains explainable historically.

### Execution

- [ ] planned Sleep execution targets immutable published Sleep.
- [ ] actual Sleep is explicit user evidence.
- [ ] actual start may differ from planned.
- [ ] actual duration may differ from planned.
- [ ] actual may lie outside planned interval.
- [ ] actual does not mutate publication.
- [ ] actual does not mutate authored Sleep.
- [ ] missing execution means unknown.
- [ ] explicit nonexecution is representable.
- [ ] nonexecution does not create omission authority.
- [ ] correction preserves provenance.
- [ ] retraction preserves provenance.
- [ ] retraction is distinct from nonexecution.
- [ ] unplanned Sleep is representable.
- [ ] unplanned Sleep does not fabricate publication.
- [ ] unplanned Sleep does not fabricate requirement.
- [ ] actual duration uses physical elapsed time.
- [ ] DST transitions are handled correctly.
- [ ] no automatic execution is created.

### History

- [ ] canonical historical Sleep query exists.
- [ ] query distinguishes planned/actual unknown/reported/nonexecution.
- [ ] query resolves correction/retraction lifecycle.
- [ ] query includes unplanned Sleep distinctly.
- [ ] query is read-only.
- [ ] history does not regenerate planning.
- [ ] history does not infer execution.
- [ ] historical Sleep survives current requirement edits.
- [ ] historical Sleep survives source delete/recreate.
- [ ] historical Sleep survives Day Boundary changes.
- [ ] historical Sleep preserves accepted-placement provenance after revoke.
- [ ] historical physical truth does not depend on current timezone interpretation.
- [ ] malformed Sleep history protects/fails safely.
- [ ] historical coverage does not confuse missing authority with no Sleep.

### Persistence

- [ ] one canonical publication owner.
- [ ] one canonical execution owner.
- [ ] no separate Sleep history silo.
- [ ] backup preserves published Sleep.
- [ ] backup preserves execution chains.
- [ ] backup preserves unplanned Sleep.
- [ ] restore preserves historical identities.
- [ ] restore validates Sleep historical authority.
- [ ] immutable history does not require current active source lifetime.
- [ ] profiles do not transport publication.
- [ ] profiles do not transport execution.
- [ ] clear prevents resurrection according to existing semantics.
- [ ] backward compatibility preserves older history.
- [ ] unknown future schema variants fail safely.

### Legacy

- [ ] legacy Sleep semantics remain unchanged.
- [ ] no legacy requiredness inference.
- [ ] no automatic conversion.
- [ ] legacy and First-Class Sleep remain distinct under coexistence.

### Non-activation

- [ ] no Sleep Progress.
- [ ] no learned Sleep preference.
- [ ] no Sleep scoring.
- [ ] no recommendations.
- [ ] no health interpretation.
- [ ] no device ingestion.
- [ ] no omission override.
- [ ] no shortening authority.
- [ ] no buffer waiver.
- [ ] no Planner shell migration.
- [ ] no Summary redesign.
- [ ] no general HistoricalPlan recovery UX.

### Bundle

- [ ] hard 170,000-byte initial gzip threshold unchanged.
- [ ] hard bundle check passes.
- [ ] no threshold increase.
- [ ] no threshold bypass.
- [ ] startup import audit completed.
- [ ] any bundle-preserving refactor is semantically neutral and tested.
- [ ] final headroom documented.

### Validation

- [ ] focused publication tests pass.
- [ ] focused Today tests pass.
- [ ] focused execution tests pass.
- [ ] focused historical tests pass.
- [ ] backup/restore tests pass.
- [ ] profile tests pass.
- [ ] clear tests pass.
- [ ] Sleep tests pass.
- [ ] PlanDecision tests pass.
- [ ] legacy Sleep tests pass.
- [ ] full suite passes.
- [ ] formatting passes.
- [ ] lint passes.
- [ ] build/typecheck passes.
- [ ] bundle hard gate passes.
- [ ] `git diff --check` passes.
- [ ] no commit.
- [ ] no push.

### Documentation

- [ ] required RESULT exists.
- [ ] all required matrices complete.
- [ ] publication schema changes documented.
- [ ] execution schema changes documented.
- [ ] planned/actual distinction documented.
- [ ] seam semantics documented.
- [ ] historical independence documented.
- [ ] bundle before/after documented.
- [ ] changed-file accounting complete.
- [ ] deferred work explicit.

---

## 103. Deferred Work

Task 9.15 must explicitly leave deferred:

```text
legacy Sleep conversion / transition
Sleep Progress
Sleep scoring
Sleep recommendations
learned Sleep preferences
device ingestion
health integrations
one-off Sleep omission/shortening/waiver
split Sleep / naps as authored requirements
general HistoricalPlan recovery UX
Planner / Summary shell convergence
```

Do not silently implement any of these.

---

## 104. Final Completion Statement

If and only if all required completion criteria are satisfied, end the RESULT with exactly:

```text
Task 9.15 — First-Class Sleep Publication, Execution & Historical Authority V1 is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.15 — First-Class Sleep Publication, Execution & Historical Authority V1 is INCOMPLETE.
```

Then identify the exact unresolved implementation or evidence blockers.

Do not mark Task 9.15 complete merely because:

```text
Sleep appears in HistoricalPlan
```

or because:

```text
an execution record can say Sleep.
```

Completion requires proof of the complete authority chain:

```text
fresh eligible solved Sleep
        ↓
explicit atomic publication
        ↓
immutable Published Sleep snapshot
        ↓
Today consumes published truth
        ↓
explicit actual execution evidence
        ↓
correction / retraction lifecycle
        ↓
historical query
```

while preserving:

```text
planned truth ≠ actual truth
published truth is immutable
actual absence = unknown
nonexecution is valid evidence
unplanned Sleep is valid evidence
current mutable setup cannot reinterpret history
```

---

## 105. Governing Principle

Task 9.14 established:

```text
DayFrame may help the user decide where required Sleep goes
without allowing the correction to weaken required Sleep.
```

Task 9.15 must establish:

```text
Once that plan is published,
DayFrame remembers what the plan actually said.

Later, DayFrame records what actually happened.

Those two truths remain separate forever.
```

Therefore:

```text
Publication freezes the plan.

Execution records reality as asserted by the user.

History preserves both.

Publication does not pretend execution occurred.

Execution does not rewrite the plan.

Missing evidence remains unknown.

Failure to follow the plan remains evidence, not retroactive permission.
```

That is the boundary of Task 9.15.