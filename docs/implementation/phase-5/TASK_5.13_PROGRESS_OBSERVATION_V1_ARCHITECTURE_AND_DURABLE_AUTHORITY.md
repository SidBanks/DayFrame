# Task 5.13 — Progress Observation V1 Architecture and Durable Authority

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Progress Observation domain architecture and implementation, exact Measurement Definition binding, immutable observation identity/revision history, correction/retraction semantics, effective-state resolution, canonical quantity validation, IndexedDB persistence, readiness/protection, runtime authority participation, Backup evolution, restore/full-clear integration, regression testing, and governance.

**No Progress projection, Progress percentage, Progress UI, recommendation, or adaptive behavior is authorized.**

---

# 1. Context

Task 5.12 implemented Measurement Definition V1 as DayFrame’s seventh durable authority.

The current measurement architecture is:

```text
Goal
    authored intent

Measurement Definition
    durable authored measurement semantics

Progress Observation
    not yet implemented

Progress
    not yet implemented
```

Measurement Definition V1 now provides:

* one definition lineage per Goal;
* immutable revision records;
* exact epoch identity:

  * `(definitionId, revision)`;
* active/inactive epochs;
* system-recorded `effectiveFrom`;
* deterministic as-of resolution;
* `manualQuantityTarget@1`;
* config:

  * `targetValue`;
  * `unitId`;
* canonical unsigned decimal strings;
* built-in units:

  * count;
  * words;
  * pages;
  * miles;
  * kilometers;
  * minutes;
* no baseline;
* no unit conversion;
* no custom units;
* Backup V5;
* restore;
* full clear;
* seventh-participant runtime integration.

Task 5.12 deliberately stopped before any measured value existed.

Task 5.13 now implements the durable evidence required for future Progress.

---

# 2. Purpose

Introduce one durable authority that records explicit Goal-state measurements.

At completion DayFrame must be able to truthfully represent:

```text
Goal: Write 50,000 words

Measurement Definition:
    manualQuantityTarget@1
    target = 50,000 words

Observation:
    observedAt = 2026-08-23T17:00
    value = 12,400 words
```

without yet calculating:

```text
24.8% Progress
```

Task 5.13 must settle and implement:

1. observation identity;
2. exact definition binding;
3. Goal binding;
4. value semantics;
5. unit compatibility;
6. `observedAt`;
7. `recordedAt`;
8. correction model;
9. retraction model;
10. revision history;
11. current/effective-state resolution;
12. as-of queries;
13. immutable evidence history;
14. protection;
15. persistence;
16. runtime transaction participation;
17. Backup evolution;
18. restore;
19. full clear;
20. future Progress compatibility.

---

# 3. Governing Evidence Principle

> **A Progress Observation is durable evidence about measured Goal state. It is not the Progress result itself.**

---

# 4. Governing Binding Principle

> **Every observation must bind to the exact Measurement Definition revision whose semantics governed the observation.**

No observation may bind only to:

* Goal ID;
* current definition;
* policy name;
* current unit.

Exact definition revision is mandatory.

---

# 5. Governing Correction Principle

> **Corrections amend evidence history without silently changing its measurement epoch.**

A corrected observation remains bound to the same exact definition revision.

---

# 6. Governing Retraction Principle

> **Retraction removes an observation from effective evidence without deleting its historical existence.**

---

# 7. Explicit Scope

Implement:

* Progress Observation V1 domain;
* observation IDs;
* immutable observation revisions;
* exact Goal/definition binding;
* `observedAt`;
* `recordedAt`;
* canonical decimal values;
* exact unit identity;
* create observation;
* correct observation;
* retract observation;
* stale revision guards;
* effective-head resolution;
* as-of resolution;
* observation history query;
* exact revision query;
* clone isolation;
* referential integrity;
* IndexedDB persistence;
* readiness/protection;
* durability/retry;
* mutation admission;
* runtime snapshots;
* shared notification scheduling;
* eighth runtime participant;
* full clear;
* Backup V6 or next canonical version;
* legacy Backup translation;
* restore/recovery;
* tests;
* governance.

---

# 8. Explicit Non-Goals

Do not implement:

* Progress calculation;
* Progress percentage;
* Progress Summary UI;
* observation entry UI;
* measurement-definition UI;
* automatic observations from ExecutionHistory;
* automatic observations from Goal Activity;
* scheduled-duration inference;
* milestone observations;
* external integrations;
* unit conversion;
* baselines;
* decrease-target policy;
* trend;
* pace;
* on-track/behind;
* recommendations;
* RecommendationDecision;
* adaptation;
* Goal score;
* machine learning.

---

# 9. Execution Artifact Rules

Before implementation:

1. verify this Task 5.13 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.10 result;
   * Task 5.11 result;
   * Task 5.12 result;
   * Measurement Definition ADR;
   * measurement-definition domain/types;
   * decimal validator;
   * unit registry;
   * measurement authority;
   * IndexedDB collection patterns;
   * ExecutionHistory correction/retraction model;
   * restore infrastructure;
   * Backup V5;
   * full clear;
   * runtime authority transaction;
6. do not modify the immutable Task 5.13 artifact.

Create:

`docs/implementation/phase-5/TASK_5.13_PROGRESS_OBSERVATION_V1_ARCHITECTURE_AND_DURABLE_AUTHORITY_RESULT.md`

---

# 10. Initial Source Audit

Before writing code, confirm:

* current Measurement Definition API;
* exact definition revision query;
* active definition resolution;
* current DB version;
* current runtime participant count;
* current Backup latest version;
* current restore participant registry;
* current ExecutionHistory correction/retraction conventions;
* current durable collection protection patterns.

Stop if Task 5.12’s definition-binding assumptions are absent.

---

# 11. Observation Domain Identity

Preferred canonical types:

```text
GoalProgressObservationId
GoalProgressObservationV1
GoalProgressObservationAuthorityV1
```

Use repository naming conventions.

---

# 12. Observation ID

Implement opaque durable ID.

Requirements:

* branded UUID-v4 or project convention;
* cryptographic default allocator;
* injectable deterministic allocator for tests;
* never derived from Goal;
* never derived from observedAt;
* never reused;
* preserved through Backup/restore.

---

# 13. Observation Lineage

One observation ID represents one logical observation lineage.

Corrections/retractions create later revisions under the same ID.

---

# 14. Observation Revision

Use monotonic positive integer revision per observation lineage.

First observation:

```text
revision = 1
```

Correction/retraction:

```text
revision = previous + 1
```

Historical revisions immutable.

---

# 15. Observation Contract

Canonical conceptual shape:

```text
GoalProgressObservationV1 {
    version: 1

    id
    revision

    goalId

    definitionId
    definitionRevision

    unitId
    value

    observedAt
    recordedAt

    status: "active" | "retracted"

    fingerprint
}
```

Treat as conceptual; follow repository conventions.

Do not add fields without evidence.

---

# 16. Exact Definition Binding

Every observation revision must include:

```text
definitionId
definitionRevision
```

This exact pair is immutable for the entire observation lineage.

Correction may change:

* value;
* observedAt if architecture permits correction of timestamp;
* status.

It must not change definition binding.

---

# 17. Goal Binding

Store `goalId` explicitly.

Validate:

```text
observation.goalId
    ==
definition.goalId
```

This improves integrity and future query locality.

---

# 18. Unit Binding

Observation `unitId` must exactly equal the bound definition config unit.

No conversion.

---

# 19. Value Semantics

For `manualQuantityTarget@1`, observation value is:

> **absolute measured quantity at observedAt**

Examples:

```text
12,400 words
37 miles
6 books/count units
```

Not:

```text
+500 words
```

No increments V1.

---

# 20. Canonical Decimal Reuse

Reuse Task 5.12 canonical unsigned decimal-string validator.

Do not create a second numeric grammar.

---

# 21. Observation Zero

Unlike target value, observation value **may be zero**.

Example:

```text
0 words
```

is valid measured state.

---

# 22. Observation Above Target

Allowed.

Do not clamp.

---

# 23. `observedAt`

Define:

> the governed time at which the measured quantity was true.

Must be canonical ISO instant.

---

# 24. `recordedAt`

Define:

> the system time when DayFrame recorded this observation revision.

Injected clock.

---

# 25. observedAt vs recordedAt

They are distinct.

Example:

```text
observedAt = 2026-08-22T20:00
recordedAt = 2026-08-23T17:20
```

Backdated evidence may be legitimate.

Determine exact limits.

---

# 26. Backdating Rule

Task 5.13 must decide whether user-provided `observedAt` may precede `recordedAt`.

Strong default:

> yes.

Measurement observations frequently represent a state noticed/entered after the fact.

Do not permit `observedAt` to bind to a definition revision that was not effective at that time.

---

# 27. Future-Dated Observation

Determine whether:

```text
observedAt > recordedAt
```

is allowed.

Strong default:

> reject V1.

Observation is evidence, not a plan.

---

# 28. Definition Epoch Compatibility

Observation creation must resolve the exact effective definition at `observedAt`.

The supplied definition binding must equal that revision.

If no active definition exists at `observedAt`:

reject.

---

# 29. Exact Binding Requirement

Preferred create command should either:

### A. accept explicit definitionId/revision and verify

or:

### B. accept Goal + observedAt, resolve exact definition internally, and return binding

Assess.

For user-facing future writes, B is simpler.

For restore/import, exact stored binding remains explicit.

Do not allow ambiguous “current definition” semantics.

---

# 30. Correction Binding

Correction must retain:

```text
goalId
definitionId
definitionRevision
unitId
```

exactly.

---

# 31. observedAt Correction

Decide whether a correction may change `observedAt`.

If changed timestamp would move evidence outside the bound definition epoch:

reject.

If timestamp remains within same epoch:

may be allowed.

Preferred V1: permit correction of observedAt only if exact definition binding remains valid.

---

# 32. Correction Value

Correction may replace value with another valid canonical decimal.

No delta semantics.

---

# 33. Retraction

Retraction appends:

```text
status: "retracted"
```

under same observation ID.

Retain:

* binding;
* last effective value or original value according to canonical design;
* observedAt;
* revision lineage.

Do not hard delete.

---

# 34. Retraction Value Representation

Choose exactly one:

### A. copy prior value into retracted revision

### B. omit value on retracted revision

### C. nullable value

Strong preference:

> copy immutable evidence context, with status controlling effectiveness.

Avoid union complexity unless current architecture favors it.

---

# 35. Repeated Retraction

No new revision.

Return deterministic rejection/no-op.

---

# 36. Correction After Retraction

Decide.

Strong default:

> disallow normal correction after retraction.

If user wants evidence back, introduce explicit restore/reactivate only if needed later.

Avoid hidden unretraction.

---

# 37. Effective Observation Head

For one observation ID at evaluation cutoff:

select highest revision with:

```text
recordedAt <= evaluationAsOf
```

or another governed timestamp.

Use correction/retraction record time, not observedAt, to resolve knowledge state.

---

# 38. As-Of Knowledge Principle

A correction entered tomorrow must not alter a query evaluated as of yesterday.

Therefore:

```text
recordedAt
```

governs revision visibility.

---

# 39. Effective Evidence State

At cutoff:

* active head → observation contributes;
* retracted head → observation contributes no effective measured state;
* no visible revision → observation absent.

---

# 40. Observation Event Time

`observedAt` determines where the measurement belongs in measurement time.

`recordedAt` determines when DayFrame knew that revision.

Keep separate.

---

# 41. Duplicate Observations

Multiple independent observations may have identical:

* Goal;
* definition revision;
* observedAt;
* value.

Do not deduplicate merely by content.

Each observation ID is independent authored evidence.

However future Progress policy may need conflict resolution.

Audit whether manual quantity Progress should accept multiple active observations at same observedAt.

---

# 42. Same-Time Observation Conflict

For absolute quantities, two active observations at the same observedAt with different values are ambiguous.

Task 5.13 must decide whether to:

### A. allow and let future Progress define tie-breaker

### B. reject overlapping active observation times per Goal/definition

### C. use recordedAt/order

Strong preference:

> prohibit more than one effective active observation for the same Goal/definition epoch at the same `observedAt`.

This preserves deterministic future Progress.

---

# 43. Observation Ordering

Canonical ordering:

1. observedAt;
2. recordedAt;
3. observation ID;
4. revision where relevant.

Define exact sort.

---

# 44. Future Progress Candidate Selection

Manual Quantity Progress will likely choose:

> latest effective active observation by observedAt at/before evaluation cutoff, after applying recordedAt as-of knowledge.

Task 5.13 should ensure authority can support this.

Do not implement percentage.

---

# 45. Observation Fingerprint

Define deterministic semantic fingerprint.

Potential inputs:

* domain version;
* status;
* definition semantic binding;
* unit;
* value;
* observedAt.

Exclude:

* observation ID;
* revision;
* recordedAt;
* Goal ID if already implied by definition binding, unless ADR requires it.

Follow semantic/lifetime distinction.

---

# 46. Fingerprint Correction Behavior

Changing value or observedAt or status changes semantic fingerprint.

Changing ID/revision/recordedAt alone should not, where governed.

---

# 47. Authority Envelope

Implement:

```text
GoalProgressObservationAuthorityV1 {
    version: 1
    observations: [...]
}
```

or canonical collection reconstruction.

---

# 48. Canonical Ordering in Authority

Recommended:

```text
goalId
definitionId
definitionRevision
observedAt
id
revision
```

Use deterministic serialization.

---

# 49. Referential Integrity

Every observation revision must reference:

* existing Goal;
* existing exact Measurement Definition revision;
* matching Goal;
* matching unit.

Reject/protect orphan evidence.

---

# 50. Historical Definition Retention Dependency

Because observations bind exact revisions, Measurement Definition hard deletion remains prohibited.

Add cross-authority regression.

---

# 51. Observation Against Unsupported Policy

If bound definition policy is structurally valid but unsupported by current runtime:

Should observation authority remain readable?

Strong recommendation:

* structurally valid observation remains preservable;
* ordinary authoring is blocked because unit/value semantics may be unknown;
* future Progress unsupported.

But because V1 observation schema currently assumes decimal/unit semantics, assess carefully.

Do not pretend unknown policy observation compatibility is known.

---

# 52. Authoring Supported Policies Only

Normal observation creation only against supported authorable policy.

V1:

```text
manualQuantityTarget@1
```

only.

---

# 53. Unknown Policy Restore

If future Backup contains observation bound to unsupported policy:

preserve structurally if schema has enough generic validation, otherwise protect.

Document exact boundary.

---

# 54. Create Observation Command

Implement canonical create command.

Input likely:

```text
goalId
observedAt
value
expectedDefinitionRevision?
```

or exact binding.

Requirements:

* Goal exists;
* Measurement Definition authority ready;
* active supported definition exists at observedAt;
* value valid;
* unit inherited/verified;
* no same-time conflict;
* allocate observation ID;
* revision 1;
* status active;
* recordedAt from injected clock;
* fingerprint;
* durable append.

---

# 55. Definition Revision Guard on Create

Strong recommendation:

accept expected definition revision from caller.

This prevents:

```text
UI loaded definition r2
user submits
definition changed to r3
observation silently binds r3
```

Instead return stale-definition result.

---

# 56. Create Result

Distinguish:

* created;
* Goal not found;
* no active definition;
* stale definition;
* unsupported policy;
* invalid value;
* observedAt invalid;
* observedAt future;
* conflicting observation time;
* protected;
* persistence failure.

---

# 57. Correct Observation Command

Input:

* observation ID;
* expected observation revision;
* new value and/or observedAt.

Requirements:

* lineage active;
* binding unchanged;
* definition exists;
* updated observedAt remains compatible;
* no conflicting active timestamp;
* revision append;
* new recordedAt;
* new fingerprint.

---

# 58. Correction No-Op

If normalized requested value/observedAt are identical:

* no revision;
* no clock;
* no persistence;
* no notification.

---

# 59. Stale Observation Revision

Reject.

No overwrite.

---

# 60. Retract Observation Command

Requires:

* observation exists;
* current head active;
* expected revision matches;
* append retracted revision;
* new recordedAt;
* same semantic binding/context.

---

# 61. Query — Exact Revision

Provide clone-isolated exact revision lookup.

---

# 62. Query — Observation History

Return full revision lineage for observation ID.

---

# 63. Query — Effective Head

Resolve observation head as of explicit evaluation cutoff.

---

# 64. Query — Goal Observations

Return effective observation heads for one Goal at cutoff.

Support future Progress query.

---

# 65. Query — Definition Observations

Return observations bound to one exact definition revision.

---

# 66. Query — Latest Measured State Candidate

Task 5.13 may implement a low-level pure query:

```text
latestEffectiveObservation(
    goalId,
    definitionId,
    definitionRevision,
    evaluationAsOf
)
```

returning observation evidence, not Progress.

This is allowed if it remains policy-neutral.

---

# 67. Query Time Semantics

Future Progress as-of query must consider:

```text
recordedAt <= evaluationAsOf
```

for revision visibility.

Then among active observations, measurement ordering uses:

```text
observedAt
```

Do not conflate.

---

# 68. Clone Isolation

All results clone-isolated.

---

# 69. Persistence

Independent IndexedDB authority.

No localStorage.

---

# 70. Database Upgrade

Add object store additively.

Record DB version increment.

Preserve all previous stores.

---

# 71. Physical Key

Use immutable revision compound key:

```text
[id, revision]
```

or canonical equivalent.

---

# 72. Useful Indexes

Likely:

* goalId;
* definitionId/revision;
* observedAt.

Do not create unnecessary persisted current-head pointers.

---

# 73. Append Atomicity

Create/correct/retract writes append one immutable revision atomically.

---

# 74. Bootstrap Dependency

Observation authority depends on:

1. Goals ready;
2. Measurement Definitions ready.

Referential validation requires both.

Order bootstrap accordingly.

---

# 75. Protected Dependency

If Goal or Measurement Definition authority is protected:

Observation authority cannot safely assert referential integrity.

Use truthful dependent protection/readiness state.

---

# 76. Protection

Protect whole observation authority on:

* storage read failure;
* malformed record;
* duplicate revision;
* broken lineage;
* orphan Goal;
* missing exact definition revision;
* Goal mismatch;
* unit mismatch;
* invalid decimal;
* invalid timestamp;
* impossible correction binding;
* conflicting effective same-time evidence if prohibited.

Do not silently drop evidence.

---

# 77. Unknown Policy Distinction

Do not classify structurally future-policy evidence as malformed merely because Progress cannot interpret it, if architecture supports structural preservation.

---

# 78. Durability

Reuse existing authority durability states.

---

# 79. Retry

Implement consistent storage retry if authority pattern provides it.

---

# 80. Mutation Admission

Use centralized gate.

---

# 81. Runtime Snapshot

Capture:

* authority;
* desired authority;
* ingress/readiness;
* durability;
* protection evidence as required.

---

# 82. Exact Runtime Install

No persistence, allocation, clocks, commands, or notification side effects.

---

# 83. Notification Scheduler

Add observation channel to shared scheduler.

---

# 84. Runtime Participant Eight

Register Observation authority as participant eight.

Do not hardcode eight as final.

---

# 85. Cross-Read Coherence

Transaction commit subscribers should see coherent:

* Goal;
* Measurement Definition;
* Observation;

and all existing participants.

Abort restores exact state.

---

# 86. Full Clear

Observation joins governed full clear.

No resurrection after restart.

---

# 87. Backup Version Evolution

Because Task 5.13 adds durable authority, latest complete Backup must evolve.

Expected:

> **Backup V6**

unless numbering changed.

---

# 88. Backup V6 Authority Set

Contains:

```text
Active
Profiles
PlanDecision
ExecutionHistory
HistoricalPlan
Goal
MeasurementDefinition
ProgressObservation
```

---

# 89. Backup V6 Observation Payload

Preserve complete immutable revision history:

* IDs;
* revisions;
* Goal refs;
* definition refs;
* unit;
* values;
* observedAt;
* recordedAt;
* status;
* fingerprints.

No derived Progress.

---

# 90. Legacy Backup Translation

V5 and earlier full restore into observation-aware DayFrame:

```text
ProgressObservation authority = canonical empty
```

Do not preserve local observations as hybrid state.

---

# 91. Backup V5 Export Boundary

Once observations exist, exporting legacy V5 as complete authority must reject if observation authority non-empty.

Follow V4/V5 precedent.

---

# 92. Backup Protection

Protected observations block canonical complete backup export.

---

# 93. Restore Participant

Add Observation to generic restore infrastructure.

No bespoke restore mechanism.

---

# 94. Restore Referential Validation

Before live mutation validate observation target against:

* target Goal authority;
* target Measurement Definition authority.

Every observation must find exact compatible definition revision.

---

# 95. Restore Staging

Target/recovery staging includes observations.

---

# 96. Combined IndexedDB Replacement

Add Observation to combined IndexedDB atomic replacement if that remains restore architecture.

This likely means:

* ExecutionHistory;
* HistoricalPlan;
* Goals;
* Measurement Definitions;
* Progress Observations

commit atomically on IndexedDB side.

---

# 97. Restore Source Recheck

Observation included.

---

# 98. Restore Fingerprints

Observation participant and whole-authority fingerprints include complete history.

---

# 99. Restore Runtime Install

Shared runtime transaction.

---

# 100. Restore Rollback

Exact recovery-side observation authority restored.

---

# 101. Startup Recovery

Generic journal/recovery includes participant eight.

No new restore stage.

---

# 102. Goal Boundary

Observation commands do not mutate Goal.

---

# 103. Measurement Definition Boundary

Observation commands do not mutate definition.

---

# 104. Goal Activity Boundary

Observation does not affect Goal Activity.

---

# 105. HistoricalPlan Boundary

No change.

---

# 106. ExecutionHistory Boundary

No automatic conversion from execution outcome to observation.

No schema change.

---

# 107. Scheduler Boundary

No scheduling effect.

---

# 108. Preview Staleness

Observation mutations do not stale Preview.

---

# 109. Profile Boundary

Profiles neither own nor replace observations.

---

# 110. Goal Lifecycle Boundary

Goal complete/archive/reactivate does not mutate observations.

---

# 111. Definition Stop Boundary

Stopping measurement does not retract old observations.

Historical evidence remains.

---

# 112. Definition Restart Boundary

New epoch does not move old observations.

Old observations remain bound to old definition revision.

---

# 113. Target Revision Boundary

Changing target creates new definition revision.

Old observations remain bound to previous target semantics.

Mandatory regression.

---

# 114. Unit Revision Boundary

Changing unit creates new definition revision.

No observation conversion/migration.

---

# 115. Current Goal Rename

No effect on observations.

---

# 116. Observation UI Boundary

No UI.

---

# 117. Summary Boundary

No Progress or observation rendering.

---

# 118. Planner Boundary

No observation-entry control.

---

# 119. Future Progress Boundary

Task 5.13 may expose enough canonical queries for Task 5.14.

Do not calculate ratio or percentage.

---

# 120. Progress Candidate Semantics

At completion, future Progress should be able to derive:

```text
effective definition revision
+
latest effective active observation
+
policy
```

without reopening observation authority architecture.

---

# 121. Effective Observation Example

Suppose:

```text
r1:
    observedAt Aug 1
    value 10,000
    recordedAt Aug 1

r2 correction:
    same observation ID
    value 12,000
    recordedAt Aug 5
```

Query as of Aug 3:

```text
10,000
```

Query as of Aug 6:

```text
12,000
```

Mandatory.

---

# 122. Retraction Example

Observation active Aug 1.

Retraction recorded Aug 10.

As-of Aug 5:

* observation effective.

As-of Aug 11:

* no effective observation for that lineage.

Mandatory.

---

# 123. Late Historical Entry Example

Observation recorded Aug 10 with:

```text
observedAt Aug 3
```

As-of Aug 5:

* DayFrame did not know it yet.

As-of Aug 11:

* it becomes available as evidence dated Aug 3.

Mandatory.

---

# 124. Same-Time Conflict Test

If prohibited:

two active independent observation IDs for same exact definition and observedAt must not coexist.

Correction/retraction can resolve conflict through lineage history.

---

# 125. Definition Epoch Boundary Test

Definition r1 active until Aug 10.

Definition r2 active Aug 10 onward.

Observation at Aug 9 must bind r1.

Observation at exact Aug 10 boundary must bind r2.

Mandatory.

---

# 126. Inactive Epoch Test

If definition inactive during observedAt:

reject observation.

---

# 127. Future Observation Test

`observedAt > recordedAt` rejected.

---

# 128. Decimal Tests

Reuse validator but add observation-specific zero acceptance.

---

# 129. Unit Tests

Observation unit exact match.

No conversion.

---

# 130. Create Tests

Cover:

* valid;
* no Goal;
* no definition;
* inactive definition;
* stale expected definition revision;
* unsupported policy;
* invalid value;
* future observedAt;
* conflict;
* protected.

---

# 131. Correction Tests

Cover:

* value correction;
* observedAt correction within epoch;
* timestamp correction crossing epoch rejected;
* stale revision;
* no-op;
* retracted correction rejection.

---

# 132. Retraction Tests

Cover:

* active → retracted;
* stale;
* repeated;
* as-of behavior.

---

# 133. Query Tests

Cover:

* exact revision;
* lineage history;
* effective head;
* Goal observations;
* definition observations;
* as-of correction;
* as-of retraction;
* late entry.

---

# 134. Persistence Reload

Create/correct/retract; reload; exact history preserved.

---

# 135. Protection Fixtures

Include:

* orphan Goal;
* missing definition;
* wrong definition revision;
* wrong Goal/definition binding;
* unit mismatch;
* malformed decimal;
* duplicate revision;
* broken revision order;
* future-policy structurally supported case;
* conflicting same-time active observations if prohibited.

---

# 136. Runtime Tests

* snapshot/install;
* commit;
* abort;
* cross-read.

---

# 137. Full-Clear Tests

Observation authority cleared and does not resurrect.

---

# 138. Backup V6 Roundtrip

Include:

* active observation;
* corrected observation;
* retracted observation;
* multiple definition epochs.

Restore exact.

---

# 139. Legacy V5 Restore

Existing local observations must become empty.

---

# 140. Older Backup Regression

V1–V4 remain supported via existing translation chain.

---

# 141. Restore Orphan Observation Test

Backup V6 observation references missing definition/Goal.

Reject before mutation.

---

# 142. Restore Rollback Test

Injected failure after observation durable mutation path.

Exact recovery.

---

# 143. Startup Recovery Test

Interrupted restore with observations resumes deterministically.

---

# 144. Independence Tests

Observation mutation must not alter:

* Goal;
* Measurement Definition;
* Goal Activity;
* schedule;
* Preview;
* Profiles;
* HistoricalPlan;
* ExecutionHistory.

---

# 145. Property Invariants

Where practical prove:

### A

old observation revisions never mutate.

### B

correction preserves exact definition binding.

### C

retraction preserves history.

### D

recordedAt controls knowledge as-of.

### E

observedAt controls measurement chronology.

### F

future-dated evidence is rejected.

### G

same semantic observation revision yields same semantic fingerprint.

### H

ID/revision/recordedAt differences alone do not change semantic fingerprint where governed.

### I

unit mismatch is impossible for valid authoring.

### J

definition revision change never retargets old observations.

### K

Goal rename/lifecycle never changes observation authority.

### L

Backup/restore preserves exact evidence history.

### M

legacy restore empties observations.

### N

full clear prevents resurrection.

---

# 146. Required Observation Contract Matrix

Produce:

| Field              | Required? | Mutable via correction? | Semantic fingerprint? |
| ------------------ | --------: | ----------------------: | --------------------: |
| version            |           |                         |                       |
| id                 |           |                         |                       |
| revision           |           |                         |                       |
| goalId             |           |                         |                       |
| definitionId       |           |                         |                       |
| definitionRevision |           |                         |                       |
| unitId             |           |                         |                       |
| value              |           |                         |                       |
| observedAt         |           |                         |                       |
| recordedAt         |           |                         |                       |
| status             |           |                         |                       |
| fingerprint        |           |                         |                       |

---

# 147. Required Command Matrix

Produce:

| Command          | Appends revision? | Binding changes? | Clock allocation? |
| ---------------- | ----------------: | ---------------: | ----------------: |
| create           |                   |                  |                   |
| correction       |                   |                  |                   |
| correction no-op |                   |                  |                   |
| retract          |                   |                  |                   |
| repeated retract |                   |                  |                   |

---

# 148. Required Time Matrix

Produce:

| Time concept             | Meaning | Governs |
| ------------------------ | ------- | ------- |
| observedAt               |         |         |
| recordedAt               |         |         |
| definition effectiveFrom |         |         |
| evaluationAsOf           |         |         |

---

# 149. Required Definition Compatibility Matrix

Produce:

| Observation condition                        | Valid? |
| -------------------------------------------- | -----: |
| exact active definition revision             |        |
| definition revision not active at observedAt |        |
| inactive epoch                               |        |
| unit mismatch                                |        |
| missing definition                           |        |
| different Goal                               |        |
| unsupported policy                           |        |

---

# 150. Required Revision Matrix

Produce:

| State                     | Effective evidence |
| ------------------------- | ------------------ |
| active r1                 |                    |
| corrected r2              |                    |
| retracted r3              |                    |
| cutoff before r2          |                    |
| cutoff after r2 before r3 |                    |
| cutoff after r3           |                    |

---

# 151. Required Authority Matrix

Produce:

| Authority             | Runtime participant | Backup latest | Restore | Full clear |
| --------------------- | ------------------: | ------------: | ------: | ---------: |
| Active                |                     |               |         |            |
| Profiles              |                     |               |         |            |
| PlanDecision          |                     |               |         |            |
| ExecutionHistory      |                     |               |         |            |
| HistoricalPlan        |                     |               |         |            |
| Goal                  |                     |               |         |            |
| MeasurementDefinition |                     |               |         |            |
| ProgressObservation   |                     |               |         |            |

---

# 152. Required Backup Matrix

Produce:

| Backup version | Observation behavior |
| -------------- | -------------------- |
| V1–V4          |                      |
| V5             |                      |
| V6             |                      |

---

# 153. Required Cross-Domain Matrix

Produce:

| Event                    | Observation changes? |
| ------------------------ | -------------------: |
| Goal rename              |                      |
| Goal complete            |                      |
| Goal archive             |                      |
| Goal reactivate          |                      |
| definition revise target |                      |
| definition change unit   |                      |
| definition stop          |                      |
| definition restart       |                      |
| profile load             |                      |
| schedule regenerate      |                      |

---

# 154. Required Protection Matrix

Produce:

| Condition           | Authority state | Writes? | Backup? |
| ------------------- | --------------- | ------: | ------: |
| initializing        |                 |         |         |
| ready               |                 |         |         |
| protected           |                 |         |         |
| persistence failure |                 |         |         |
| restore active      |                 |         |         |

---

# 155. Required Product-Boundary Matrix

Produce:

| Capability                    | Task 5.13 |
| ----------------------------- | --------- |
| durable observation authority |           |
| corrections                   |           |
| retractions                   |           |
| as-of resolution              |           |
| exact definition binding      |           |
| Backup evolution              |           |
| restore                       |           |
| observation UI                |           |
| Progress calculation          |           |
| Progress UI                   |           |
| Recommendations               |           |
| adaptation                    |           |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 156. Required Architectural Invariant Assessment

Classify at least:

1. Progress Observation is durable evidence authority.
2. Observation is not Progress.
3. Observation is not Goal Activity.
4. Observation ID is opaque.
5. Observation lineage is revisioned.
6. revisions are immutable.
7. corrections append.
8. retractions append.
9. hard delete is absent.
10. Goal binding is explicit.
11. exact definition ID/revision binding is explicit.
12. definition binding never changes through correction.
13. unit binding never changes through correction.
14. value is absolute quantity.
15. value is canonical decimal.
16. zero is valid observation.
17. over-target is valid.
18. increments are absent.
19. observedAt is evidence time.
20. recordedAt is knowledge time.
21. evaluationAsOf uses recordedAt for revision visibility.
22. observedAt determines measurement chronology.
23. future-dated observedAt is rejected.
24. backdated observedAt is allowed where definition epoch matches.
25. observations cannot exist in inactive measurement epochs.
26. exact definition epoch must exist.
27. same-time conflicting active evidence is governed deterministically.
28. correction can change value.
29. correction observedAt change cannot cross epoch.
30. correction no-op appends nothing.
31. stale revision cannot overwrite.
32. retraction removes effective evidence but retains history.
33. repeated retraction does not append.
34. correction after retraction is disallowed unless explicitly governed.
35. Goal must exist.
36. definition revision must exist.
37. Goal/definition relationship must match.
38. unit must match definition.
39. no conversion exists.
40. unsupported policy is distinct from corruption where possible.
41. authority uses IndexedDB.
42. authority is readiness/protection-aware.
43. malformed evidence does not become empty silently.
44. mutation admission is centralized.
45. runtime snapshot is complete.
46. exact install has no side effects.
47. notifications use shared scheduler.
48. observation joins runtime transaction.
49. participant architecture does not assume eight is final.
50. observation joins full clear.
51. no resurrection after clear.
52. latest Backup includes observations.
53. full observation revision history is backed up.
54. derived Progress is absent from Backup.
55. older Backup restores empty observation authority.
56. local observations do not survive legacy whole restore.
57. restore validates Goal refs.
58. restore validates definition refs.
59. restore validates unit compatibility.
60. restore stages/rechecks observations.
61. restore commits observations coherently.
62. rollback restores observations coherently.
63. startup recovery includes observations.
64. Goal mutations do not mutate observations.
65. definition revision does not migrate observations.
66. definition stop does not retract observations.
67. definition restart does not move observations.
68. Goal Activity remains unchanged.
69. HistoricalPlan remains unchanged.
70. ExecutionHistory remains unchanged.
71. schedule remains unchanged.
72. Preview staleness remains unchanged.
73. Profiles remain independent.
74. no observation UI exists.
75. no Progress projection exists.
76. no Progress percentage exists.
77. no recommendation exists.
78. no adaptation exists.
79. no pace/on-track semantics exist.
80. no automatic ExecutionHistory→Observation translation exists.
81. no unit conversion exists.
82. no baseline exists.
83. no external integration exists.
84. canonical validation is green.
85. no unresolved stop condition remains.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Stop-condition violation.

---

# 157. Stop Conditions

Stop and report if:

* exact Measurement Definition revision binding cannot be enforced;
* observedAt cannot be validated against definition epochs;
* corrections cannot preserve original binding;
* as-of resolution cannot distinguish observedAt from recordedAt;
* immutable revision storage cannot fit collection infrastructure;
* duplicate same-time absolute observations cannot be governed deterministically;
* unsupported-policy evidence cannot be preserved safely;
* Goal/definition referential integrity cannot be validated during bootstrap/restore;
* participant eight cannot join runtime transaction coherently;
* latest Backup cannot represent full observation history;
* restore cannot atomically/coherently replace observation authority;
* legacy Backup translation would preserve local observations incorrectly;
* implementation requires Progress calculation;
* implementation requires observation UI;
* implementation requires ExecutionHistory changes;
* implementation requires HistoricalPlan changes.

Do not weaken evidence history or exact binding to avoid a stop.

---

# 158. Likely Files

Likely areas:

```text
core/progressObservation/
state/progressObservationSurface/
IndexedDB storage
database schema
runtime authority composition
notification scheduler
full clear
Backup V6
restore participants
tests/fixtures
governance
```

Audit actual names first.

---

# 159. Focused Validation

Run focused suites covering:

* observation domain;
* time semantics;
* correction/retraction;
* definition binding;
* persistence;
* protection;
* runtime transaction;
* full clear;
* Backup latest/legacy;
* restore/rollback/recovery;
* independence.

Record exact file/test counts.

---

# 160. Full Validation

Before completion run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* test file count;
* test count;
* build module count;
* bundle advisory;
* diff result.

Any transient failure must be disclosed and canonical suite rerun cleanly before completion.

---

# 161. Manual Validation

No observation UI exists.

State:

> Manual Progress Observation workflow validation not applicable; no observation UI exists.

Only manually check Settings Backup/restore if current product surface materially changes.

---

# 162. Governance

On success update minimally:

* Task 5.13 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* `DECISIONS.md` only if implementation introduces enduring evidence semantics not already captured in the accepted architecture.

If Observation authority semantics are substantial enough, create/update an ADR:

> **ADR — Progress Observation Identity, Revision, Time, and Definition-Binding Model**

Avoid documenting implementation minutiae.

---

# 163. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.13_PROGRESS_OBSERVATION_V1_ARCHITECTURE_AND_DURABLE_AUTHORITY_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.12 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Domain Placement
7. Observation ID
8. Observation Contract
9. Observation Lineage
10. Revision Model
11. Immutable Records
12. Goal Binding
13. Definition Binding
14. Unit Binding
15. Value Semantics
16. Decimal Reuse
17. observedAt
18. recordedAt
19. Backdating
20. Future-Date Rule
21. Epoch Compatibility
22. Correction
23. Correction Binding
24. observedAt Correction
25. No-Op
26. Retraction
27. Retraction Semantics
28. Repeated Retraction
29. Correction After Retraction
30. Effective Head
31. As-Of Knowledge
32. Duplicate/Same-Time Behavior
33. Fingerprint
34. Authority Envelope
35. Referential Integrity
36. Unsupported Policy
37. Create Command
38. Definition Revision Guard
39. Correct Command
40. Retract Command
41. Queries
42. Clone Isolation
43. Persistence
44. Database Upgrade
45. Physical Record Model
46. Bootstrap Ordering
47. Readiness
48. Protection
49. Durability
50. Mutation Admission
51. Runtime Snapshot
52. Exact Runtime Install
53. Notification Scheduler
54. Runtime Participant Eight
55. Cross-Read Coherence
56. Full Clear
57. Anti-Resurrection
58. Backup Evolution
59. Latest Backup Payload
60. Legacy Translation
61. Backup Protection
62. Restore Participant
63. Restore Referential Validation
64. Restore Staging
65. Combined IndexedDB Replacement
66. Restore Commit
67. Runtime Install
68. Rollback
69. Startup Recovery
70. Restore Fingerprints
71. Goal Boundary
72. Measurement Definition Boundary
73. Goal Activity Boundary
74. HistoricalPlan Boundary
75. ExecutionHistory Boundary
76. Scheduler Boundary
77. Preview Boundary
78. Profile Boundary
79. Goal Lifecycle Boundary
80. Definition Revision Boundary
81. Future Progress Compatibility
82. Tests Added/Changed
83. Canonical Fixtures
84. Property Invariants
85. Focused Validation
86. Full Validation
87. Manual Validation
88. Governance Updates
89. ADR Determination
90. Deviations
91. Discoveries
92. Deferred Work
93. Observation Contract Matrix
94. Command Matrix
95. Time Matrix
96. Definition Compatibility Matrix
97. Revision Matrix
98. Authority Matrix
99. Backup Matrix
100. Cross-Domain Matrix
101. Protection Matrix
102. Product-Boundary Matrix
103. Architectural Invariant Assessment
104. Stop-Condition Assessment
105. Architectural Alignment Assessment
106. Recommended Next Task
107. Final Completion Determination

---

# 164. Completion Criteria

Task 5.13 is complete only when:

* Progress Observation V1 exists as independent durable evidence authority;
* observation IDs are opaque, stable, never reused, and Backup/restore preserved;
* one observation ID defines one immutable revision lineage;
* revisions are monotonic;
* corrections and retractions append rather than mutate;
* hard delete is absent;
* every observation stores exact Goal ID;
* every observation stores exact Measurement Definition ID and revision;
* definition binding never changes through correction/retraction;
* unit binding exactly matches the definition;
* no unit conversion exists;
* observation value is an absolute canonical decimal quantity;
* zero observation is valid;
* over-target observation is valid;
* incremental values are not supported;
* `observedAt` and `recordedAt` are separate canonical timestamps;
* `observedAt` means measurement-state time;
* `recordedAt` means DayFrame knowledge time;
* backdated observations are allowed only where exact definition epoch compatibility holds;
* future-dated observations are rejected;
* observation creation cannot bind to inactive/nonexistent definition epochs;
* expected definition revision guards prevent silent rebinding;
* corrections preserve exact definition binding;
* correction may change value and, if allowed, observedAt only within the same exact definition epoch;
* no-op correction appends nothing and allocates no clock;
* stale observation revision cannot overwrite;
* retraction removes evidence from effective state while preserving history;
* repeated retraction appends nothing;
* correction after retraction is rejected unless architecture explicitly defines another operation;
* as-of revision visibility uses `recordedAt`;
* measurement ordering uses `observedAt`;
* corrections entered later do not alter earlier evaluation cutoffs;
* late-entered historical observations do not exist for cutoffs before they were recorded;
* same-time active observation conflicts are governed deterministically;
* effective observation queries are deterministic and clone-isolated;
* every observation references an existing Goal and exact definition revision;
* Goal/definition/unit mismatches protect/reject instead of silently repairing;
* structurally valid unsupported-policy evidence is distinct from malformed evidence where architecture permits;
* authority uses independent IndexedDB persistence;
* DB upgrade is additive;
* immutable physical revision records reload exactly;
* bootstrap waits for Goal and Measurement Definition integrity;
* readiness/protection/durability states are explicit;
* malformed authority never becomes empty silently;
* centralized mutation admission is used;
* runtime snapshot is complete;
* exact runtime install has no persistence/allocation/clock side effects;
* notifications use shared scheduler;
* Observation joins runtime authority transaction as participant eight;
* participant architecture does not assume eight is final;
* shared transaction commit/abort includes observation authority coherently;
* full clear removes observation history;
* restart after clear cannot resurrect observations;
* latest canonical Backup includes all eight durable authorities;
* full observation revision history is serialized exactly;
* derived Progress is not serialized;
* older Backup versions remain supported;
* legacy whole-authority restore yields canonical empty observation authority;
* local observations do not survive legacy restore as hybrid data;
* protected observation authority blocks complete current Backup export;
* Observation joins generic restore staging/source recheck/fingerprints/commit/runtime install/rollback/startup recovery;
* restore validates Goal and exact definition referential integrity before mutation;
* combined IndexedDB replacement includes Observation where required by current restore atomicity;
* rollback restores exact observation recovery authority;
* Goal edits do not mutate observations;
* Measurement Definition revision/stop/restart does not retarget, convert, retract, or rewrite old observations;
* Goal Activity remains unchanged;
* HistoricalPlan remains unchanged;
* ExecutionHistory remains unchanged;
* no ExecutionHistory outcome becomes an observation automatically;
* schedule generation remains unchanged;
* Preview staleness remains unchanged;
* Profiles remain independent;
* no observation UI is introduced;
* no Progress projection is introduced;
* no Progress percentage, Goal score, pace, on-track state, recommendation, adaptation, milestone system, baseline, unit conversion, external integration, or machine-learning behavior is introduced;
* focused validation passes;
* lint, typecheck, full tests, build, and `git diff --check` pass;
* governance records durable observation evidence as implemented while derived Progress remains deferred;
* no unresolved identity, time, revision, definition-binding, evidence, persistence, runtime, Backup, restore, or protection stop condition remains.

---

# 165. Recommended Next Task

If Task 5.13 completes successfully:

> **Task 5.14 — Manual Quantity Progress V1 Policy and Pure Projection**

That task should finally derive Progress from:

```text
Goal
+
effective Measurement Definition revision
+
effective Progress Observation evidence
+
evaluationAsOf
```

For `manualQuantityTarget@1`, it may compute:

```text
observed absolute quantity / target quantity
```

with:

* exact decimal semantics;
* quantity + target display;
* percentage only where mathematically valid;
* over-target values preserved;
* no lifecycle mutation;
* no Goal Activity conversion;
* no pace;
* no “on track”;
* no recommendation;
* no UI until projection semantics are independently validated.

---

# 166. Final Implementation Principle

> **Task 5.13 should make measured Goal state durable and historically correct before DayFrame interprets that state as Progress.**

---

# 167. Final Completion Statement

**Task 5.13 is complete when DayFrame implements Progress Observation V1 as an eighth independent, durable, revisioned evidence authority whose observations bind permanently to one Goal and one exact Measurement Definition revision; when observations record absolute canonical quantity values under the exact definition unit, distinguish the historical time the quantity was true from the later time DayFrame learned or corrected that evidence, and use immutable correction/retraction revisions so evaluation-as-of can reconstruct what DayFrame actually knew at any cutoff; when creation verifies the active definition epoch at observedAt, future-dated evidence is rejected, backdated evidence is allowed only when it belongs to the bound epoch, stale definition and observation revisions cannot silently rebind or overwrite evidence, same-time absolute evidence conflicts are governed deterministically, corrections preserve exact definition/unit binding, no-op corrections append nothing, retractions remove effective evidence without deleting history, and old observation revisions remain durable; when exact/current/history/as-of queries are deterministic and clone-isolated and provide enough evidence for a future Manual Quantity Progress projection without calculating Progress itself; when the authority is stored independently in additive IndexedDB, bootstraps only after Goal and Measurement Definition integrity can be proven, protects rather than drops malformed/orphan evidence, uses centralized mutation admission, exact runtime snapshots, side-effect-free runtime installation, shared notification scheduling, and generalized eight-participant authority transactions; when full clear removes all observation history without resurrection; when the latest complete Backup evolves to include complete Observation authority and all immutable revisions while older backup restores explicitly produce empty Observation authority, local evidence never survives legacy whole-authority restore as hybrid data, and protected Observation authority cannot be silently omitted; when restore stages, rechecks, fingerprints, validates, atomically/coherently commits, installs, rolls back, and startup-recovers observations through the existing restore architecture while enforcing exact Goal/definition/unit referential integrity; when Goal, Measurement Definition, Goal Activity, HistoricalPlan, ExecutionHistory, Profiles, Schedule, Preview, and Goal lifecycle semantics remain unchanged; when no automatic activity-to-observation conversion, observation UI, Progress projection, Progress percentage, pace, on-track state, Goal score, recommendation, adaptation, baseline, unit conversion, milestone system, external integration, or machine-learning behavior is introduced; when focused and canonical validation are green; when governance records durable measured-state evidence as complete while interpretation remains deferred; and when no unresolved observation identity, correction, retraction, observed-time, recorded-time, as-of, definition-binding, unit, persistence, runtime-transaction, Backup, restore, protection, or reproducibility stop condition remains.**
