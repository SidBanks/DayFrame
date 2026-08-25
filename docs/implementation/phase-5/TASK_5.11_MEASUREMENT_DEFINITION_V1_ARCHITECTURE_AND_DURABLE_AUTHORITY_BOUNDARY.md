# Task 5.11 — Measurement Definition V1 Architecture and Durable Authority Boundary

## Status

Ready for architecture finalization.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Measurement-domain architecture definition, durable-authority boundary design, identity/revision/epoch semantics, Goal relationship modeling, policy/configuration contract design, future observation compatibility, historical reproducibility analysis, Backup/restore/full-clear impact analysis, and implementation-slice definition.

**No Measurement Definition production implementation, Progress observation implementation, Progress projection, or Progress UI is authorized.**

---

# 1. Context

Task 5.10 completed the Progress V1 and Measurement-Policy Architecture Audit.

It established:

```text
Goal Activity
    = historical supporting activity

Progress
    = policy-governed interpretation
      of explicit Goal-state evidence

Measurement Definition
    = authored meaning of how Progress is measured

Progress Observation
    = future evidence about actual Goal state
```

Task 5.10 explicitly determined:

* Progress must remain derived;
* Progress must remain non-authoritative;
* Progress must remain non-persisted;
* Goal Activity is not a universal Progress numerator;
* qualitative Goals remain fully valid without Progress;
* no measurement definition means `notDefined`;
* unsupported policy means `unsupportedPolicy`;
* percentages are valid only when numerator and denominator use the same explicit policy-defined unit;
* target dates are not Progress denominators;
* Goal lifecycle completion does not mean 100%;
* Progress reaching target must not silently complete a Goal;
* Goal V1's current `{ id, version }` measurement-policy reference is insufficient for useful configured quantity Progress;
* manual quantity target is the strongest first eventual Progress policy;
* manual quantity requires explicit durable authored configuration;
* manual quantity also requires future durable observations;
* policy/configuration changes must create a new measurement epoch rather than silently reinterpret old evidence;
* current Goal revision is insufficient to represent measurement-definition history;
* a separate durable `GoalMeasurementDefinition` authority is preferred;
* a separate future observation authority is required;
* neither should be implemented before their authority boundaries are finalized.

Task 5.10 therefore recommended:

> **Task 5.11 — Measurement Definition V1 Architecture and Durable Authority Boundary.**

---

# 2. Purpose

Define the complete V1 architecture for authored Goal measurement definitions before implementation begins.

Task 5.11 must answer:

1. What exactly is a Measurement Definition?
2. Is it independent durable authority?
3. How does it relate to Goal?
4. Does each Goal have zero, one, or many definitions?
5. What identity does a definition have?
6. What does definition revision mean?
7. What constitutes a new revision versus a new definition?
8. What is a measurement epoch?
9. How is epoch identity represented?
10. How does `effectiveFrom` work?
11. What configuration belongs to the definition?
12. What configuration is policy-specific?
13. What does the first built-in policy require?
14. How are units represented?
15. How are target, baseline, direction, and bounds represented?
16. What does the definition fingerprint contain?
17. How will future observations bind to a definition revision?
18. How are corrections to definition configuration handled?
19. Can old definitions be edited?
20. Can definitions be archived or superseded?
21. Does a Goal ever lose its measurement history?
22. How does Goal lifecycle interact with definitions?
23. How do profile loads/imports affect definitions?
24. How should Backup/restore/full clear evolve?
25. Does Measurement Definition become a seventh authority participant?
26. How should protection/readiness work?
27. How should future HistoricalPlan or Progress provenance refer to definitions?
28. Is any Goal schema change required?
29. What should Task 5.12 implement?

---

# 3. Governing Measurement Principle

> **A Measurement Definition is authored semantic authority describing what counts as meaningful measurable movement for a specific Goal.**

It does not contain the current Progress result.

---

# 4. Governing Separation Principle

Keep these concepts distinct:

```text
Goal
    what the user wants

Measurement Definition
    how that Goal is measured

Observation
    evidence about measured Goal state

Progress
    derived interpretation
```

Do not collapse them into one object.

---

# 5. Governing Reproducibility Principle

> **A historical Progress result must be reproducible from the exact measurement-definition semantics and evidence that were valid at the evaluation cutoff.**

Therefore:

```text
current Goal config
≠
historical measurement semantics
```

when the measurement definition has changed.

---

# 6. Governing Epoch Principle

> **A material change to measurement semantics begins a new governed measurement epoch rather than silently reinterpreting prior evidence.**

This principle must be made concrete in Task 5.11.

---

# 7. Explicit Scope

Task 5.11 covers:

* Measurement Definition V1 semantics;
* independent authority decision;
* definition identity;
* Goal relationship;
* revision semantics;
* epoch semantics;
* effective-from semantics;
* policy identity/version;
* policy configuration;
* first-policy configuration;
* target;
* baseline;
* direction;
* unit;
* bounds;
* precision/display metadata where justified;
* definition fingerprint;
* definition lifecycle;
* supersession;
* correction behavior;
* observation-binding contract;
* future Progress provenance;
* Goal schema consequences;
* HistoricalPlan consequences;
* persistence class;
* readiness/protection;
* runtime transaction participation;
* Backup/restore/full-clear consequences;
* implementation sequencing.

---

# 8. Explicit Non-Goals

Do not implement or fully define:

* Progress Observation persistence;
* Progress Observation UI;
* Progress projection;
* Manual Quantity Progress projection;
* Progress Summary UI;
* Recommendation;
* RecommendationDecision;
* adaptation;
* external integrations;
* milestone authority;
* habit/maintenance policies;
* formula DSL;
* plugin policies;
* arbitrary unit conversion;
* pace;
* on-track/behind semantics;
* trend;
* forecasting;
* Goal score;
* cross-Goal comparison.

---

# 9. Execution Artifact Rules

Before beginning:

1. verify this Task 5.11 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.1 result;
   * Task 5.2 result;
   * Goal ADR;
   * Task 5.3 result;
   * Task 5.10 result;
   * Goal domain and persistence;
   * Goal measurement-policy reference;
   * Goal runtime authority;
   * authority transaction;
   * mutation admission;
   * Backup V4;
   * restore participant architecture;
   * full clear;
   * HistoricalPlan frozen Goal provenance;
   * current IndexedDB collection infrastructure;
   * existing identity/version/fingerprint conventions;
   * ExecutionHistory revision/correction patterns;
6. do not modify the immutable Task 5.11 artifact.

Create:

`docs/implementation/phase-5/TASK_5.11_MEASUREMENT_DEFINITION_V1_ARCHITECTURE_AND_DURABLE_AUTHORITY_BOUNDARY_RESULT.md`

---

# 10. Audit Method

Use current source and Task 5.10 decisions as evidence.

For each conclusion classify:

* **Confirmed current behavior**
* **Accepted architecture**
* **Task 5.11 recommendation**
* **Requires decision**
* **Deferred**
* **Not found**
* **Blocker**

Do not infer schema solely from the eventual manual quantity UI.

---

# 11. Current Goal Measurement Contract Audit

Reconstruct the current Goal measurement support.

At minimum confirm:

```text
measurementPolicyRef?: {
    id
    version
}
```

and establish:

* where it is stored;
* how it is validated;
* whether Planner exposes it;
* how HistoricalPlan freezes it;
* whether any current policy registry exists.

---

# 12. Measurement Definition Core Definition

Adopt or refine:

> **A Goal Measurement Definition is durable authored semantic authority describing how observations for one Goal are interpreted under one versioned measurement policy during one governed measurement epoch.**

---

# 13. Independent Authority Decision

Compare:

### A. embed configuration directly inside Goal

### B. independent `GoalMeasurementDefinition` authority

### C. independent per-Goal measurement sub-ledger

### D. another model

Task 5.10 recommends independent authority.

Verify that implementation architecture supports it without unnecessary complexity.

---

# 14. Goal Relationship Cardinality

Determine whether a Goal may have:

### zero definitions

Expected: yes.

### one current definition

Likely.

### many historical definitions

Likely.

Clarify whether several definitions may be simultaneously active.

Strong default:

> One active/effective definition per Goal per measurement dimension in V1.

Since V1 has only one measurement dimension, likely one effective definition at a time.

---

# 15. Definition Identity

Define requirements for a MeasurementDefinitionId.

Likely:

* opaque;
* stable;
* non-semantic;
* never title-derived;
* never reused;
* preserved through Backup/restore;
* cryptographically strong default allocator;
* deterministic injection for tests.

---

# 16. Goal ID Link

Every definition must reference exactly one Goal ID.

Determine whether it references:

```text
goalId
```

only.

Since Goal has no reusable incarnation, Goal ID should be sufficient.

---

# 17. Definition Revision

Define revision semantics.

Candidate:

```text
definitionId
revision
```

Each semantic configuration mutation creates a new immutable definition revision.

Determine whether revisions are:

### mutable current record with revision counter

or:

### immutable revision records

Historical reproducibility strongly favors immutable revision records.

Audit carefully.

---

# 18. Definition Revision vs Definition Identity

Settle:

```text
same definitionId
different revision
```

means:

> same measurement lineage, materially revised semantics/configuration.

Define what creates:

```text
new definitionId
```

instead.

---

# 19. New Definition Identity

Possible reasons for fresh definition identity:

* explicit user replacement of measurement model;
* changing policy family;
* destructive reset;
* another semantic break.

Determine whether V1 needs both new definition and revision concepts.

Avoid duplicate lineage concepts if revision + epoch is sufficient.

---

# 20. Measurement Epoch

Define exact meaning.

Candidate:

> **A measurement epoch is a contiguous period during which one exact definition revision governs compatible observations and Progress interpretation.**

Determine whether epoch needs its own ID.

---

# 21. Epoch Identity Alternatives

Compare:

### A. epoch implied by definition revision

### B. explicit MeasurementEpochId

### C. effectiveFrom timestamp alone

### D. another model

Prefer the smallest model that preserves unambiguous observation compatibility.

---

# 22. Effective From

Determine whether every definition revision needs:

```text
effectiveFrom
```

Requirements:

* exact ISO instant or user-day date?
* recording time or authored effective time?
* may it precede creation?
* may it overlap another revision?

Avoid ambiguous overlapping semantics.

---

# 23. Effective-From Default

Strong candidate:

> New measurement definition/revision becomes effective when explicitly saved.

No backdating V1 unless clearly required.

Assess.

---

# 24. Observation Binding

Future observations must bind to:

* Goal ID?
* definition ID?
* exact definition revision?
* epoch?
* policy identity?

Task 5.10 recommends exact definition revision.

Make this canonical.

---

# 25. Observation Compatibility

Define future compatibility check.

Conceptually:

```text
observation.definitionId
observation.definitionRevision
observation.unit
```

must match the measurement definition semantics governing it.

Determine whether fingerprint should also be retained.

---

# 26. Measurement Definition Core Fields

Develop the minimum V1 contract.

Conceptual candidate:

```text
GoalMeasurementDefinitionV1 {
    version
    id
    goalId
    revision
    policyRef
    parameters
    effectiveFrom
    createdAt
    updatedAt?
    fingerprint?
}
```

Do not accept this wholesale.

Classify every field.

---

# 27. Authority Envelope

Determine canonical authority shape.

Potential:

```text
GoalMeasurementAuthorityV1 {
    version: 1
    definitions: [...]
}
```

If immutable revisions are stored, decide whether envelope stores:

* all revisions;
* current pointers;
* indexes;
* another structure.

---

# 28. Policy Reference

Use explicit:

```text
{
    id
    version
}
```

Retain current Goal convention where possible.

---

# 29. Built-In Policy Registry

Task 5.10 selected a closed deterministic built-in registry for V1.

Define registry responsibilities:

* recognize policy ID/version;
* validate config;
* normalize config;
* compute config fingerprint inputs;
* validate compatible observations later;
* derive Progress later.

Do not implement registry now.

---

# 30. Unknown Policy

Durable authority restored from a future version may contain an unknown policy.

Determine whether that:

* protects entire Measurement authority;
* preserves definition but marks policy unsupported;
* another model.

Task 5.10 distinguishes valid unknown policy from malformed authority.

Design carefully for forward compatibility.

---

# 31. First Policy

The first eventual policy is:

> **Manual Quantity Target V1**

Task 5.11 must define enough configuration architecture to support it, without implementing Progress.

---

# 32. Manual Quantity Policy Required Config

Audit required fields.

Likely:

```text
targetValue
unitId
direction
baseline?
```

Determine which are required.

---

# 33. Target Value

For Manual Quantity Target:

* finite numeric;
* likely positive depending on direction;
* exact validation rules;
* immutable within a definition revision.

Determine.

---

# 34. Unit Identity

Define stable unit identity.

Candidates:

```text
words
miles
kilometers
pages
sessions
items
customCount?
```

Do not create broad unit library unless needed.

---

# 35. Unit Registry

Determine whether V1 needs a bounded built-in unit registry.

Potential responsibilities:

* canonical ID;
* display label;
* compatibility;
* numeric precision;
* conversion prohibition.

---

# 36. Custom Units

Assess whether V1 should allow custom user labels such as:

```text
chapters
labs
modules
```

Custom units are attractive but complicate semantic compatibility and arithmetic.

Determine whether to:

* support canonical count with custom display noun;
* defer arbitrary units;
* another model.

---

# 37. Unit Conversion

Default:

> No implicit conversion V1.

Examples:

```text
miles ≠ kilometers
```

unless explicitly governed later.

Adopt unless evidence demands otherwise.

---

# 38. Direction

Task 5.10 recommended explicit:

```text
increaseTowardTarget
```

for first policy.

Determine whether V1 should support only this direction or define extensible union including future:

```text
decreaseTowardTarget
reachTarget
maintainWithinRange
```

Prefer minimal truthful V1.

---

# 39. Baseline

Determine whether Manual Quantity V1 requires a baseline.

Examples:

### word count

Could start at 0.

### savings

May start at 4,000.

### debt reduction

Different direction.

For first increase-target policy, decide:

* baseline always required;
* baseline optional default zero;
* first observation establishes baseline.

This is a key semantic decision.

---

# 40. Baseline as Definition vs Observation

Compare:

### baseline stored in definition

### baseline stored as first observation

### baseline optional

Historical reproducibility implications differ.

Choose.

---

# 41. Target and Baseline Formula

If baseline exists, define conceptual Progress quantity.

For increase-toward-target:

```text
movement = current - baseline
targetMovement = target - baseline
```

Do not implement projection.

Determine denominator validity constraints.

---

# 42. Baseline Equal Target

What does it mean?

Potential:

* already at target;
* invalid definition;
* zero denominator.

Choose architecture rule.

---

# 43. Baseline Above Target

For increase-toward-target:

likely invalid.

Do not silently infer reverse direction.

---

# 44. Observation Value

Future observations should likely record absolute measured state:

```text
12,400 words
```

rather than increment:

```text
+500 words
```

Assess.

Absolute values simplify correction/reproducibility.

---

# 45. Incremental Observations

Defer unless needed.

---

# 46. Bounds

Task 5.10 recommends preserving raw values and not silently clamping.

Definition policy must decide whether:

```text
observation > target
```

is valid.

For manual quantity likely yes.

Progress ratio may exceed 100%.

Record.

---

# 47. Negative Values

For increase-toward-target:

determine whether negative baseline/observations are allowed.

Avoid generic assumptions.

Perhaps policy/unit-specific validation.

---

# 48. Precision

Determine whether values are stored as:

* JavaScript number;
* normalized decimal string;
* integer minor unit;
* another representation.

This is a significant durability decision.

Manual quantities such as words are integral; miles may be decimal.

Assess numeric precision requirements.

---

# 49. Floating-Point Reproducibility

If using JS numbers, fingerprint/serialization must be deterministic.

Audit current numeric conventions.

---

# 50. Decimal Representation

Compare:

### finite JS number

### canonical decimal string

### scaled integer

Choose or defer with justification.

Do not accidentally create an arbitrary-precision math project.

---

# 51. Display Precision

Should display precision be:

* unit-owned;
* policy config;
* UI concern.

Likely unit-owned or UI concern.

Do not embed cosmetic formatting in measurement authority unless required.

---

# 52. Definition Fingerprint

Define conceptual fingerprint inputs.

At minimum:

* policy ID;
* policy version;
* normalized config;
* target;
* baseline;
* unit;
* direction;
* effective epoch semantics.

Determine whether Goal ID and definition ID belong in semantic fingerprint.

---

# 53. Identity vs Semantic Fingerprint

Distinguish:

```text
definition identity
```

from:

```text
definition semantics
```

Two definitions may have identical semantics but different identities.

Fingerprint should represent semantics, not lifetime identity unless current restore model requires both.

---

# 54. Fingerprint Purpose

Potential uses:

* restore verification;
* observation compatibility;
* reproducibility;
* recommendation staleness.

Clarify.

---

# 55. Definition Editing

Determine whether saved definition config is edited in place.

Strong candidate:

> No. Semantic change creates a new immutable revision/epoch.

Planner UI can appear as Edit Measurement, but save produces new revision.

Assess.

---

# 56. Definition No-Op

If submitted normalized config is semantically identical:

* no new revision;
* no new epoch;
* no timestamp allocation.

Recommended.

---

# 57. Policy Change

Changing policy ID/version is material.

Determine whether:

* new revision under same definition ID;
* new definition ID;
* explicit replacement lineage.

Choose.

---

# 58. Target Change

Material change.

Must not reinterpret old observations silently.

Therefore new revision/epoch.

---

# 59. Baseline Change

Material.

New revision/epoch.

---

# 60. Unit Change

Material.

New revision/epoch.

Do not convert old observations.

---

# 61. Direction Change

Material.

New revision/epoch.

---

# 62. Definition Archive/Disable

Determine whether a user can stop measuring a Goal while keeping history.

Possible:

```text
active
superseded
retired
```

or simply current pointer absence.

Avoid unnecessary lifecycle state.

---

# 63. No Current Definition

A Goal must be able to return to:

```text
Progress notDefined
```

without erasing historical definitions/observations.

Define how.

---

# 64. Definition Deactivation

Potential command:

```text
stopMeasuringGoal
```

Should preserve history and end current epoch.

Define architecture.

---

# 65. Reactivate Old Definition

Should user be able to reactivate an old definition revision?

Likely safer to create a new revision/epoch with same config rather than reopen old epoch.

Assess.

---

# 66. Historical Definitions

Old definition revisions must remain durable if observations reference them.

No garbage collection while referenced.

---

# 67. Goal Completion

Completing Goal:

* does not delete or finalize measurement definition automatically;
* may leave current definition historical/inspectable.

Determine whether observations after completion remain allowed.

Probably future workflow decision.

Do not tie automatically.

---

# 68. Goal Archive

Same.

No measurement history deletion.

---

# 69. Goal Reactivation

Does not reopen an old measurement epoch automatically.

Explicit measurement semantics remain independently governed.

---

# 70. Goal Full Clear

Full clear must remove Measurement Definition authority once implemented.

---

# 71. Goal Backup Restore

Goal + definitions must restore coherently.

A definition whose Goal is absent in target authority is invalid unless legacy compatibility explicitly handles it.

Define referential-integrity expectations.

---

# 72. Goal Replacement

Profiles do not replace Goals.

Therefore they should not replace Measurement Definitions.

Confirm.

---

# 73. Legacy Backup Import

When a pre-measurement Backup is restored into future DayFrame:

definition authority should become explicit empty as part of whole-authority translation.

Likely similar to Goal V3→V4 translation.

Record future requirement.

---

# 74. Current Backup Version Consequence

Adding a new durable authority requires a new complete Backup version beyond V4.

Expected:

```text
Backup V5
```

unless other tasks change numbering first.

Do not implement.

---

# 75. Observation Authority Dependency

Measurement Definition authority must be designed so future observation authority can be added without changing definition identity semantics.

---

# 76. Observation Revision/Correction Compatibility

Task 5.10 recommended correction-capable observations.

Definition architecture must allow observation revisions to bind to the same exact definition revision.

---

# 77. Observation Timestamp

Future observation likely has:

* recordedAt;
* effectiveAt/observedAt?

Task 5.11 should identify which time dimension definition compatibility depends on.

Do not fully design observations.

---

# 78. Observation Effective Time vs Definition Epoch

A future observation should only belong to a definition epoch if its governed effective/observation time falls within that epoch—or if the user explicitly records against current definition.

Determine likely rule.

This may influence `effectiveFrom`.

---

# 79. Epoch End

How does an epoch end?

Potential:

* next revision's `effectiveFrom`;
* explicit `endedAt`;
* stop-measuring action.

Choose model.

---

# 80. Overlapping Epochs

Prohibit in V1 unless multi-dimensional measurement is introduced later.

Strong invariant:

> At most one effective measurement definition revision for a Goal at any instant.

Assess.

---

# 81. Future Multiple Measurement Dimensions

Do not architect V1 so rigidly that a Goal can never have multiple dimensions later.

But do not implement multiple simultaneous dimensions now.

Potential future example:

```text
write 50,000 words
and
complete 10 chapters
```

Avoid unnecessary blockage.

---

# 82. Current Definition Resolution

Define pure rule:

```text
for Goal X at time T
    resolve effective measurement definition revision
```

using epoch/effective boundaries.

This is needed for reproducibility.

---

# 83. Historical Definition Resolution

Must work without current Goal fields.

Definition authority itself owns revision history.

---

# 84. Goal.measurementPolicyRef

Critical.

Once separate definition authority exists, determine what happens to current Goal field:

```text
measurementPolicyRef
```

Options:

### A. remove/migrate it

### B. retain as current-definition summary

### C. deprecate but preserve compatibility

### D. another model

Task 5.11 must settle the future relationship.

---

# 85. Avoid Dual Authority

Do not allow:

```text
Goal.measurementPolicyRef
```

and:

```text
MeasurementDefinition.policyRef
```

to both independently define measurement truth.

Exactly one source must be authoritative.

---

# 86. Preferred Migration Direction

Likely:

> Measurement Definition authority becomes canonical measurement semantics; Goal's existing optional policy ref becomes deprecated/compatibility metadata or is removed through a future Goal schema version.

Do not implement.

Assess migration cost.

---

# 87. Goal Schema Change Timing

Determine whether Task 5.12 must change Goal schema at the same time as adding definition authority.

Possible:

### no immediate Goal change

### Goal schema V2 required

### compatibility bridge

Choose.

---

# 88. HistoricalPlan Frozen Policy Ref

Current HistoricalPlan freezes Goal measurement policy ref.

If canonical policy now lives in Measurement Definition, determine future behavior.

Options:

* freeze definition ID/revision instead;
* keep frozen policy ref;
* freeze both.

Do not change HistoricalPlan in 5.11.

Recommend future direction.

---

# 89. HistoricalPlan Necessity

Manual quantity Progress observations do not inherently depend on HistoricalPlan.

Therefore the first Progress model may not need plan publications to freeze measurement definitions at all.

Assess whether HistoricalPlan should remain Goal Activity-only for now.

---

# 90. Progress Observation History

Manual quantity Progress may derive solely from:

```text
Goal
MeasurementDefinition
ProgressObservation
evaluationAsOf
```

Goal Activity remains contextual peer evidence.

This may simplify historical measurement provenance.

Confirm.

---

# 91. Measurement Definition Persistence Class

Choose likely storage.

Expected:

* independent IndexedDB collection;
* versioned;
* durable;
* protected.

Compare with localStorage if necessary.

---

# 92. Collection Shape

Determine whether storage should be:

* one record per definition revision;
* one record per definition lineage with embedded revisions;
* authority envelope blob.

Use current collection infrastructure conventions.

---

# 93. Append-Only vs Mutable

Historical reproducibility favors append-like immutable revision records.

Corrections to malformed data are not ordinary config edits.

Define V1 model.

---

# 94. Anti-Resurrection

If definitions can be superseded/deactivated, determine whether collection requires anti-resurrection state similar to ExecutionHistory.

Maybe not if current pointer/epochs are authoritative.

Assess.

---

# 95. Definition Deletion

Likely no hard deletion from normal workflow.

Historical definitions must remain if referenced.

Define whether only full clear destroys them.

---

# 96. Protection Model

Determine whether malformed definition authority should:

* quarantine individual definition revisions;
* protect whole authority;
* another model.

Use existing collection patterns.

---

# 97. Unknown Policy vs Corrupt Definition

Important distinction.

Example:

```text
policyRef:
    futurePolicy@3
```

may be structurally valid but unsupported.

That should not necessarily corrupt the authority.

Design:

* preserve;
* query returns unsupportedPolicy.

Malformed config under a known policy is different.

---

# 98. Policy-Specific Validation

How can current runtime validate a definition from an unsupported future policy?

Separate:

### structural envelope validation

from:

### semantic policy validation

Define this boundary.

---

# 99. Restore Validation

Canonical restore may need exact structural validation even for future/unknown policy definitions.

But application semantics may remain unsupported.

Avoid making forward-compatible backup impossible.

Assess current project philosophy.

---

# 100. Readiness

Measurement Definition authority needs:

* initializing;
* ready;
* protected;
* persistence-failed/other existing durable states.

Follow current conventions.

---

# 101. Mutation Admission

Future definition commands must pass centralized authority mutation admission.

---

# 102. Runtime Snapshot

Measurement Definition becomes a runtime authority participant if implemented.

Its runtime snapshot must support:

* exact capture;
* exact install;
* abort;
* notification deferral.

---

# 103. Participant Count

Current model has six participants.

Adding definition authority likely creates a seventh.

Architecture must remain iterable/extensible.

Do not hardcode seven as final.

---

# 104. Runtime Transaction Need

Determine which future operations require cross-authority transaction.

Examples:

### create first definition for Goal

Maybe Goal + definition if Goal ref field changes.

### update definition

Definition only.

### full Backup restore

all authority.

### full clear

all authority.

### future Goal deletion

none in V1.

This affects whether Goal schema should retain current ref.

---

# 105. Goal + Definition Atomicity

If Goal does not store a measurement pointer, definition creation can remain independent.

Current-definition resolution may be derived from definition authority.

This may reduce cross-authority mutation complexity.

Assess strongly.

---

# 106. Current Definition Index

If definitions are immutable revisions, resolution may require indexing by:

```text
goalId
effectiveFrom
```

This can be derived.

Do not persist a pointer unless needed.

---

# 107. Supersession

Each new revision may carry:

```text
supersedesRevision
```

or lineage may be inferable.

Determine.

---

# 108. Revision Ordering

Revision should be monotonic per definition lineage.

Do not rely solely on timestamps.

---

# 109. Epoch Ordering

No overlapping effective intervals.

Validation/mutation commands enforce.

---

# 110. Clock Semantics

Use injected clock.

No wall-clock reads inside pure resolution/fingerprint logic.

---

# 111. Timestamp Fields

Determine required timestamps:

* createdAt;
* effectiveFrom;
* supersededAt?
* updatedAt?
* retiredAt?

Avoid redundant timestamps.

---

# 112. Definition Auditability

What must be durably explainable later?

At minimum:

* exact policy;
* exact config;
* revision;
* effective period;
* Goal relationship;
* authorship by user implied from command.

No full event ledger unless needed.

---

# 113. Domain Events

Do not add event sourcing.

Classify potential future domain events only if architecture needs them.

---

# 114. Measurement Policy Registry Versioning

Policy implementation:

```text
manualQuantityTarget@1
```

must never change meaning in place.

Behavioral change requires:

```text
manualQuantityTarget@2
```

Adopt.

---

# 115. Config Schema Version

Determine whether definition record needs separate config version in addition to policy version.

Probably policy version owns config schema.

Avoid redundant versioning.

---

# 116. Manual Quantity V1 Config

Produce one canonical proposed config.

Conceptually:

```text
{
    targetValue,
    baselineValue,
    unitId,
    direction: "increaseTowardTarget"
}
```

Determine optionality.

---

# 117. Policy-Agnostic Definition Envelope

Prefer:

```text
policyRef
config
```

with discriminated validation by policy registry.

Do not put quantity-specific fields at top level if future policies differ.

Assess.

---

# 118. Config Serialization

Must be canonical/JSON-safe.

No functions/classes/Date objects.

---

# 119. Config Clone Isolation

Required.

---

# 120. Config Fingerprint Normalization

Define normalization.

No semantically equivalent but byte-different config forms if avoidable.

---

# 121. Numeric Validation

Reject:

* NaN;
* Infinity;
* -Infinity.

Define finite numeric bounds if needed.

Do not invent arbitrary product limits without evidence.

---

# 122. Unit Compatibility

Observation unit must exactly match definition unit in V1.

No conversion.

---

# 123. Goal Relationship Integrity

Creating definition requires Goal exists.

Restore requires referenced Goal present in same target authority.

Determine behavior if corrupt durable state references missing Goal.

Likely protection.

---

# 124. Full-Clear Ordering

Definition authority joins governed full clear.

No stale definitions after Goal clear.

---

# 125. Backup Evolution

Future latest backup includes:

```text
Active
Profiles
PlanDecision
ExecutionHistory
HistoricalPlan
Goal
MeasurementDefinition
```

before observation authority exists.

Likely Backup V5.

---

# 126. Legacy Backup Translation

V4 → future measurement-aware model:

```text
MeasurementDefinition authority = empty
```

Never infer definitions from Goal Activity or Goal policy refs unless explicitly governed migration says so.

---

# 127. Existing Goal.measurementPolicyRef Migration

This deserves explicit decision.

If current Goals may already contain refs, future authority migration could:

### A. create placeholder/incomplete definitions

### B. ignore refs

### C. preserve ref on Goal until user configures a definition

### D. another compatibility strategy

Do not fabricate missing target/config.

Likely preserve current Goal field temporarily but treat it as non-operative until definition exists.

Assess.

---

# 128. No Fake Definition Migration

Never construct:

```text
target = 0
baseline = 0
```

just to migrate an existing policy reference.

---

# 129. Observation Compatibility Contract

Define minimum future observation binding fields.

Conceptually:

```text
goalId
definitionId
definitionRevision
unitId
observedAt
value
```

Do not finalize observation lifecycle beyond what definition architecture requires.

---

# 130. Observation Policy Ref Duplication

Does observation also need policy ID/version?

If exact definition revision is referenced, possibly redundant.

Fingerprint may aid verification.

Choose minimal trustworthy binding.

---

# 131. Observation Against Superseded Revision

Should future user be able to enter an observation against an old epoch?

Default:

> operational UI writes against current effective definition only.

Historical import/correction may target old revision under explicit rules.

Task 5.13 can finalize.

---

# 132. Observation Corrections

Correction preserves original definition binding.

A correction cannot silently move evidence to a new measurement epoch.

Adopt.

---

# 133. Progress Query Resolution

Future Progress query likely:

```text
goalId
evaluationAsOf
```

then resolves:

1. effective definition revision;
2. compatible observations;
3. policy implementation;
4. derived result.

Confirm architecture compatibility.

---

# 134. Definition Not Found

Progress returns:

```text
notDefined
```

not zero.

---

# 135. Unsupported Definition Policy

Progress returns:

```text
unsupportedPolicy
```

while Goal remains valid.

---

# 136. Protected Definition Authority

Progress unavailable.

Goal Activity unaffected.

---

# 137. Definition With No Observation

Future Progress:

```text
insufficientEvidence
```

unless baseline semantics explicitly provide an initial value.

---

# 138. Baseline as Initial Evidence

If baseline is authored configuration, determine whether it may count as a valid starting observed value.

Task 5.10 suggested it may.

This is consequential.

Possible distinction:

```text
baseline = measurement origin
```

not necessarily:

```text
observed current value
```

Define carefully.

---

# 139. Baseline Semantics Decision

Choose:

### A. baseline is an authored observed starting state

### B. baseline is only mathematical reference

### C. separate baseline observation required

Recommend one.

For manual quantity simplicity, A may be viable if timestamped/effectiveFrom.

But it blurs definition and evidence.

Audit deeply.

---

# 140. Definition vs Observation Purity

Strong principle:

> Definition says what/how to measure; observation says what the measured state was.

This suggests baseline value may actually be evidence.

If so, do not store baseline in definition except as target calculation parameter.

Determine architecture.

---

# 141. No-Baseline Policy

Manual Quantity could instead mean absolute target:

```text
currentValue / targetValue
```

Examples:

* 12,400 words / 50,000;
* 37 miles / 100.

This avoids baseline entirely for first policy.

But does not support:

* save from $4k to $10k as incremental goal;
* reduce debt.

Those can be later policies.

Assess whether **Manual Quantity Target V1 should intentionally support absolute increasing quantity only**.

This may be the smallest truthful design.

---

# 142. Recommended First Policy Simplification

Strong candidate:

```text
manualQuantityTarget@1

config:
    unitId
    targetValue

semantics:
    absolute non-negative quantity
    increase toward positive target
    no baseline
    no conversion
    observations are absolute values
    values may exceed target
```

Evaluate as a deliberate bounded V1.

---

# 143. Direction Field Necessity

If first policy hardcodes increase-toward-target, direction does not need authored config in V1.

Policy semantics already define it.

This may reduce schema complexity.

Determine whether Task 5.10's direction recommendation should be implemented as policy semantics rather than config.

---

# 144. Manual Quantity Examples

Test conceptual fit:

```text
Write 50,000 words
Walk 100 miles
Read 12 books
Complete 20 labs
```

Potentially all absolute quantity.

But:

```text
Save $10,000
Reduce debt
Weight goal
```

may require future policy.

Accepting bounded applicability is okay.

---

# 145. Count vs Quantity

A canonical `count` unit could support:

* labs;
* books;
* chapters.

But display noun may matter.

Determine whether unit config can include non-semantic display label.

Avoid turning label into arithmetic identity.

---

# 146. Custom Count Label

Possible:

```text
unitId: "count"
unitLabel: "labs"
```

Arithmetic compatibility remains `count`.

Assess whether this is useful or premature.

---

# 147. Measurement Definition Title/Label

Does the definition need its own user-facing label?

Likely no; Goal title provides context.

Avoid redundant naming.

---

# 148. Notes

No freeform measurement-definition description unless justified.

---

# 149. Definition Lifecycle Commands

Evaluate semantic command inventory.

Potential:

```text
createMeasurementDefinition
reviseMeasurementDefinition
stopMeasuringGoal
```

Maybe:

```text
reactivateMeasurement
```

Do not expose generic setters.

---

# 150. Definition Query Inventory

Potential:

```text
getCurrentDefinitionForGoal
getDefinitionRevision
listDefinitionHistoryForGoal
```

Determine minimum.

---

# 151. No Hard Delete

Likely no normal hard delete.

Full clear only.

Historical definitions retained.

---

# 152. Definition Retention

All revisions retained indefinitely in V1 unless later compaction architecture exists.

---

# 153. Measurement Definition Invariants

Recommend a canonical set.

At minimum assess:

1. Measurement Definition is authored authority.
2. Progress is not stored in it.
3. Definition belongs to one Goal.
4. Goal may have no definition.
5. Goal remains valid without definition.
6. Definition ID is opaque.
7. Definition ID is never title-derived.
8. Definition revisions are monotonic.
9. semantic changes do not mutate old revisions.
10. old revisions remain durable.
11. one effective measurement revision per Goal at a time in V1.
12. effective periods never overlap.
13. policy ID/version is explicit.
14. policy meaning is immutable per version.
15. config schema is policy-owned.
16. first policy is built-in.
17. no formula DSL.
18. no arbitrary executable config.
19. target is authored.
20. target date is unrelated.
21. units are explicit.
22. no implicit conversion.
23. observations bind to exact definition revision.
24. old observations are never reinterpreted under new revisions.
25. correction does not change definition binding.
26. changing target creates new revision/epoch.
27. changing unit creates new revision/epoch.
28. changing policy creates new revision/epoch or new lineage according to chosen model.
29. definition no-op creates no revision.
30. stopping measurement preserves history.
31. re-enabling measurement does not reopen old epoch silently.
32. Goal completion does not delete definition history.
33. Goal archive does not delete definition history.
34. Goal reactivation does not reset measurement.
35. definition authority is durable.
36. definition authority is versioned.
37. definition authority is protected/readiness-aware.
38. mutation admission is centralized.
39. runtime snapshots are complete.
40. exact install has no allocation/persistence side effects.
41. notifications use shared scheduler.
42. definition joins runtime authority transaction.
43. participant model does not assume seven is final.
44. definition joins full clear.
45. definition joins Backup/restore.
46. old Backup translates to empty definition authority.
47. restore preserves exact IDs/revisions/config.
48. malformed config is not silently normalized to defaults.
49. unsupported policy is distinct from malformed authority.
50. current Goal measurement ref does not remain a second source of truth.
51. derived Progress is not backed up.
52. Goal Activity remains independent.
53. ExecutionHistory remains occurrence evidence.
54. HistoricalPlan schema need not change for first manual quantity policy unless later evidence proves otherwise.
55. Summary remains read-only.
56. Planner is measurement-definition authoring surface.
57. no Progress projection is introduced here.
58. no observation authority is introduced here.
59. no pace/on-track semantics.
60. no recommendation/adaptation.
61. no machine learning.

Classify:

* Adopt
* Modify
* Reject
* Defer
* Requires decision

---

# 154. Definition Contract Matrix

Produce:

| Field         | Required? | Authored/derived | Mutable? | Revision significance |
| ------------- | --------: | ---------------- | -------: | --------------------- |
| version       |           |                  |          |                       |
| id            |           |                  |          |                       |
| goalId        |           |                  |          |                       |
| revision      |           |                  |          |                       |
| policyRef     |           |                  |          |                       |
| config        |           |                  |          |                       |
| effectiveFrom |           |                  |          |                       |
| createdAt     |           |                  |          |                       |
| fingerprint   |           |                  |          |                       |

Add/remove fields based on final model.

---

# 155. Manual Quantity Config Matrix

Produce:

| Field             | Required? | Meaning | Change starts new epoch? |
| ----------------- | --------: | ------- | -----------------------: |
| targetValue       |           |         |                          |
| unitId            |           |         |                          |
| baseline          |           |         |                          |
| direction         |           |         |                          |
| display precision |           |         |                          |
| custom label      |           |         |                          |

---

# 156. Revision/Epoch Matrix

Produce:

| Change                | New revision? | New epoch? | Old observations reinterpreted? |
| --------------------- | ------------: | ---------: | ------------------------------: |
| target change         |               |            |                                 |
| unit change           |               |            |                                 |
| policy version change |               |            |                                 |
| direction change      |               |            |                                 |
| baseline change       |               |            |                                 |
| no-op normalized edit |               |            |                                 |
| stop measurement      |               |            |                                 |
| restart same config   |               |            |                                 |

---

# 157. Lifecycle Matrix

Produce:

| Goal/measurement event | Current definition | History |
| ---------------------- | ------------------ | ------- |
| Goal active            |                    |         |
| Goal completed         |                    |         |
| Goal archived          |                    |         |
| Goal reactivated       |                    |         |
| stop measuring         |                    |         |
| restart measurement    |                    |         |
| full clear             |                    |         |

---

# 158. Observation Compatibility Matrix

Produce:

| Observation condition              | Compatible? | Reason |
| ---------------------------------- | ----------: | ------ |
| exact definition revision          |             |        |
| old revision after new epoch       |             |        |
| different unit                     |             |        |
| unknown definition                 |             |        |
| corrected observation same binding |             |        |
| future policy unsupported          |             |        |

---

# 159. Goal Integration Matrix

Produce:

| Concern                       | Goal authority | Definition authority |
| ----------------------------- | -------------- | -------------------- |
| Goal identity                 |                |                      |
| measurement policy            |                |                      |
| measurement config            |                |                      |
| current-definition resolution |                |                      |
| lifecycle                     |                |                      |
| target date                   |                |                      |
| Progress result               |                |                      |

---

# 160. Persistence Matrix

Produce:

| Concern             | Recommendation |
| ------------------- | -------------- |
| authority type      |                |
| storage class       |                |
| authority version   |                |
| record model        |                |
| readiness           |                |
| protection          |                |
| fingerprint         |                |
| mutation admission  |                |
| runtime participant |                |
| full clear          |                |
| Backup              |                |
| restore             |                |

---

# 161. Backup Matrix

Produce:

| Backup generation                     | Measurement definition behavior |
| ------------------------------------- | ------------------------------- |
| current V4                            |                                 |
| future V5                             |                                 |
| V4 restored after measurement support |                                 |
| future Backup restored                |                                 |
| full clear                            |                                 |

---

# 162. Historical Context Matrix

Produce:

| Historical concern           | Current source sufficient? | Future action |
| ---------------------------- | -------------------------: | ------------- |
| Goal Activity provenance     |                            |               |
| Progress definition revision |                            |               |
| observation binding          |                            |               |
| policy version               |                            |               |
| target config                |                            |               |
| evaluation cutoff            |                            |               |

---

# 163. Alternatives — Definition Location

Compare:

| Criterion                 | Goal-embedded config | separate definition authority | Goal sub-ledger |
| ------------------------- | -------------------- | ----------------------------- | --------------- |
| identity/history          |                      |                               |                 |
| epoching                  |                      |                               |                 |
| Backup                    |                      |                               |                 |
| Goal schema burden        |                      |                               |                 |
| observation binding       |                      |                               |                 |
| reproducibility           |                      |                               |                 |
| implementation complexity |                      |                               |                 |
| recommendation            |                      |                               |                 |

---

# 164. Alternatives — Revision Model

Compare:

| Criterion           | mutable current record | immutable revisions | full event ledger |
| ------------------- | ---------------------- | ------------------- | ----------------- |
| reproducibility     |                        |                     |                   |
| simplicity          |                        |                     |                   |
| observation binding |                        |                     |                   |
| corrections         |                        |                     |                   |
| storage             |                        |                     |                   |
| recommendation      |                        |                     |                   |

---

# 165. Alternatives — Epoch Identity

Compare:

| Criterion           | revision implies epoch | explicit epoch ID | timestamps only |
| ------------------- | ---------------------- | ----------------- | --------------- |
| simplicity          |                        |                   |                 |
| observation binding |                        |                   |                 |
| reset/restart       |                        |                   |                 |
| reproducibility     |                        |                   |                 |
| recommendation      |                        |                   |                 |

---

# 166. Alternatives — Baseline

Compare:

| Criterion                  | no baseline V1 | config baseline | baseline observation |
| -------------------------- | -------------- | --------------- | -------------------- |
| simplicity                 |                |                 |                      |
| definition/evidence purity |                |                 |                      |
| use cases                  |                |                 |                      |
| reproducibility            |                |                 |                      |
| first-policy usefulness    |                |                 |                      |
| recommendation             |                |                 |                      |

---

# 167. Alternatives — Unit Model

Compare:

| Criterion                | built-in units only | built-in + custom count label | arbitrary custom unit |
| ------------------------ | ------------------- | ----------------------------- | --------------------- |
| validation               |                     |                               |                       |
| arithmetic compatibility |                     |                               |                       |
| UX                       |                     |                               |                       |
| migration                |                     |                               |                       |
| extensibility            |                     |                               |                       |
| recommendation           |                     |                               |                       |

---

# 168. Risk Register

Produce:

| Risk                                              | Severity | Cause | Mitigation |
| ------------------------------------------------- | -------- | ----- | ---------- |
| Goal and definition both own policy truth         |          |       |            |
| config edits rewrite history                      |          |       |            |
| observations bind only to Goal                    |          |       |            |
| epoch overlap                                     |          |       |            |
| old evidence reinterpreted                        |          |       |            |
| unsupported policy treated as corruption          |          |       |            |
| baseline confuses definition/evidence             |          |       |            |
| unit conversion inferred                          |          |       |            |
| Backup drops definition history                   |          |       |            |
| current Goal revision used as measurement history |          |       |            |
| definition deletion breaks observations           |          |       |            |
| arbitrary formula system introduced too early     |          |       |            |

---

# 169. Architecture Decisions Required

Settle at least:

1. Measurement Definition core definition.
2. Independent authority confirmation.
3. Definition ID model.
4. Goal relationship cardinality.
5. immutable revision vs mutable record.
6. revision semantics.
7. epoch semantics.
8. epoch identity model.
9. effective-from semantics.
10. one-active-definition constraint.
11. first policy identity.
12. policy registry model.
13. config envelope model.
14. Manual Quantity V1 config.
15. baseline decision.
16. direction decision.
17. unit model.
18. numeric storage representation.
19. target validation.
20. over-target behavior.
21. definition fingerprint.
22. definition edit/no-op behavior.
23. policy change behavior.
24. stop-measuring behavior.
25. restart-measuring behavior.
26. Goal completion/archive/reactivation interaction.
27. observation exact binding contract.
28. Goal measurementPolicyRef migration/deprecation.
29. HistoricalPlan consequences.
30. persistence class.
31. protection model.
32. runtime participant consequence.
33. Backup version consequence.
34. legacy Backup translation.
35. exact Task 5.12 implementation slice.

---

# 170. Implementation Slice Determination

Choose one next implementation slice.

### Slice A — Measurement Definition Core Only

* types;
* policy/config validation;
* immutable revision model;
* fingerprint;
* pure resolution tests.

No persistence yet.

### Slice B — Full Durable Definition Authority

* core;
* IndexedDB;
* commands;
* readiness/protection;
* runtime transaction;
* full clear;
* Backup/restore.

### Slice C — Definition Authority + Observation Stub Contract

Definition substrate plus non-persisted observation compatibility types.

### Slice D — another prerequisite

Task 5.10 recommends durable definition substrate next, but Task 5.11 must verify exact scope.

---

# 171. Backup Sequencing

Because Measurement Definition will be user-authored durable data, determine whether Backup/restore/full clear must ship in the same task as persistence.

Strong default:

> yes.

Do not expose durable measurement configuration that cannot be backed up.

---

# 172. Planner UI Sequencing

Measurement Definition UI should follow durability.

Likely:

```text
Definition architecture
→ durable definition substrate
→ observation architecture/substrate
→ Progress projection
→ Planner/Summary UI
```

Confirm.

---

# 173. Observation Sequencing

Task 5.11 should establish the compatibility contract but should not implement observations.

Recommend whether 5.13 remains observation architecture/substrate after 5.12.

---

# 174. ADR Determination

Task 5.10 recommended an ADR after 5.11.

If architecture stabilizes, create/recommend:

> **ADR — Goal Measurement Definition Authority, Revision, Epoch, and Policy Model**

It should record enduring decisions, not implementation minutiae.

---

# 175. Governance

On completion update minimally:

* Task 5.11 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `DECISIONS.md`;
* `CHANGELOG.md`.

No Progress implementation status should be claimed.

---

# 176. Validation

Task 5.11 is architecture-definition work.

Production code should not change.

Run at minimum:

```bash
git diff --check
```

If production/test code changes unexpectedly, stop and report deviation.

---

# 177. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.11_MEASUREMENT_DEFINITION_V1_ARCHITECTURE_AND_DURABLE_AUTHORITY_BOUNDARY_RESULT.md`

Include at least:

1. Executive Determination
2. Artifact Integrity
3. Audit Scope
4. Sources Reviewed
5. Current Goal Measurement Audit
6. Measurement Definition Core Definition
7. Authority Decision
8. Goal Relationship Cardinality
9. Definition Identity
10. Revision Model
11. Definition vs Revision Identity
12. Measurement Epoch
13. Epoch Identity
14. Effective-From Semantics
15. Observation Binding
16. Observation Compatibility
17. Canonical Definition Fields
18. Authority Envelope
19. Policy Reference
20. Policy Registry
21. Unknown Policy
22. First Policy
23. Manual Quantity Configuration
24. Target Value
25. Unit Identity
26. Unit Registry
27. Custom Units
28. Unit Conversion
29. Direction
30. Baseline
31. Baseline Architecture Decision
32. Over-Target Behavior
33. Numeric Representation
34. Precision
35. Definition Fingerprint
36. Identity vs Semantic Fingerprint
37. Definition Editing
38. No-Op Behavior
39. Policy Change
40. Target/Unit/Direction Change
41. Stop Measuring
42. Restart Measurement
43. Historical Definition Retention
44. Goal Lifecycle Interaction
45. Goal Backup/Restore Relationship
46. Observation Future Compatibility
47. Epoch End/Overlap
48. Current Definition Resolution
49. Historical Resolution
50. Goal measurementPolicyRef Boundary
51. Goal Schema Consequence
52. HistoricalPlan Consequence
53. Progress Query Compatibility
54. Persistence Class
55. Collection/Record Model
56. Append/Immutable Model
57. Protection
58. Unknown Policy vs Corruption
59. Readiness
60. Mutation Admission
61. Runtime Snapshot/Transaction
62. Participant Evolution
63. Full Clear
64. Backup Evolution
65. Legacy Translation
66. Definition/Observation Referential Integrity
67. Command Inventory
68. Query Inventory
69. Definition Invariant Assessment
70. Definition Contract Matrix
71. Manual Quantity Config Matrix
72. Revision/Epoch Matrix
73. Lifecycle Matrix
74. Observation Compatibility Matrix
75. Goal Integration Matrix
76. Persistence Matrix
77. Backup Matrix
78. Historical Context Matrix
79. Definition Location Alternatives
80. Revision Alternatives
81. Epoch Alternatives
82. Baseline Alternatives
83. Unit Alternatives
84. Risk Register
85. Architecture Decision Set
86. Implementation Slice Determination
87. Backup Sequencing
88. Planner UI Sequencing
89. Observation Sequencing
90. ADR Determination
91. Governance Updates
92. Validation
93. Deviations
94. Stop-Condition Assessment
95. Recommended Task 5.12
96. Final Architecture Statement

---

# 178. Stop Conditions

Stop and recommend a prerequisite if:

* existing Goal identity cannot support stable definition linkage;
* current authority architecture cannot add another participant safely;
* immutable definition history cannot be represented with current durable collection infrastructure;
* observation binding cannot identify exact definition semantics;
* policy/config changes cannot create non-overlapping epochs;
* Goal.measurementPolicyRef cannot be prevented from becoming a competing source of truth;
* future Backup cannot preserve definition history exactly;
* older backups cannot translate safely to empty measurement authority;
* malformed configuration cannot be distinguished from unsupported policy;
* a useful Manual Quantity V1 requires arbitrary formula execution;
* numeric representation cannot be made deterministic;
* the first policy requires baseline semantics that cannot be separated truthfully from observations;
* implementing definition authority would require implementing Progress first;
* implementing definition authority would require changing ExecutionHistory.

Do not simplify away historical reproducibility to avoid a stop condition.

---

# 179. Completion Criteria

Task 5.11 is complete only when:

* Measurement Definition V1 has one concrete canonical definition;
* independent durable authority is explicitly accepted or rejected;
* Goal-to-definition cardinality is explicit;
* MeasurementDefinitionId semantics are settled;
* revision semantics are settled;
* immutable versus mutable revision storage is settled;
* measurement epoch semantics are explicit;
* epoch identity is explicit;
* effective-from semantics are explicit;
* overlapping epochs are either prohibited or governed;
* current definition resolution is deterministic;
* historical definition resolution is deterministic;
* future observations bind to exact definition semantics;
* correction cannot silently move an observation between epochs;
* policy identity/versioning is explicit;
* policy registry architecture is explicit;
* unknown policy is distinguished from malformed configuration;
* first built-in policy is settled;
* Manual Quantity V1 config is concrete;
* target semantics are concrete;
* baseline inclusion/exclusion is settled;
* direction semantics are settled;
* unit architecture is settled;
* unit-conversion behavior is explicit;
* custom-unit behavior is explicit;
* numeric representation is explicit;
* over-target behavior is explicit;
* finite-value validation is explicit;
* definition fingerprints are deterministic and semantically scoped;
* no-op edits are defined;
* target/unit/policy/config edits have explicit revision/epoch behavior;
* stop-measuring behavior is explicit;
* restart-measuring behavior is explicit;
* historical definition retention is explicit;
* Goal active/completed/archived/reactivated behavior is explicit;
* no Goal lifecycle state silently deletes/reset measurement history;
* Goal.measurementPolicyRef's future role is explicitly settled so dual authority cannot exist;
* any Goal schema migration requirement is identified;
* HistoricalPlan consequences are explicit;
* first manual quantity Progress is shown not to require HistoricalPlan mutation unless evidence says otherwise;
* persistence class is settled;
* collection/record representation is settled;
* protection/readiness semantics are explicit;
* centralized mutation admission participation is explicit;
* runtime transaction participation is explicit;
* participant evolution beyond six is explicit;
* full-clear participation is explicit;
* Backup evolution is explicit;
* legacy Backup translation is explicit;
* restore referential integrity with Goal is explicit;
* normal hard deletion of historical definition revisions is accepted or rejected;
* command/query boundaries are proposed;
* future observation compatibility contract is concrete enough for Task 5.13;
* one implementation slice is selected;
* Backup sequencing is explicit;
* Planner UI remains after durability;
* Progress remains deferred;
* exactly one Task 5.12 is recommended;
* ADR determination is complete;
* all required matrices are completed;
* no production Measurement Definition authority, observation authority, Progress projection, Progress UI, Recommendation, adaptation, formula engine, external integration, schema migration, Backup format, or unrelated functionality is introduced during this architecture task;
* no unresolved stop condition remains.

---

# 180. Final Architecture Principle

> **A measurement definition must preserve what the user meant by “progress” at the time, not merely whatever DayFrame happens to mean by that Goal today.**

---

# 181. Final Completion Statement

**Task 5.11 is complete when DayFrame has one implementation-ready Measurement Definition V1 architecture in which authored measurement semantics live in exactly one durable authority distinct from Goal intent, Progress observations, Goal Activity, and derived Progress; when every definition has stable Goal linkage, opaque durable identity, explicit version/revision semantics, deterministic policy identity, normalized policy-specific configuration, governed effective-time/measurement-epoch semantics, and a semantic fingerprint sufficient for historical reproducibility and future observation compatibility; when material policy, target, unit, baseline, direction, or other governed configuration changes cannot silently reinterpret old evidence but instead create an explicit new revision/epoch boundary; when future observations can bind to one exact definition revision without depending on current Goal revision or current Goal fields; when the first built-in Manual Quantity Target policy has a concrete bounded configuration, unit model, numeric representation, target/baseline/direction rules, over-target behavior, and no implicit unit conversion or formula execution; when qualitative Goals remain valid without any definition and no-definition/unsupported-policy/protected-definition states remain distinct from zero Progress; when Goal lifecycle changes preserve measurement history and neither completion, archive, nor reactivation silently resets or destroys definition semantics; when Goal's current measurement-policy reference is prevented from becoming a second competing source of measurement truth; when current and historical definition resolution are deterministic; when no normal hard deletion can break future observation provenance; when Measurement Definition's IndexedDB/readiness/protection/mutation-admission/runtime-transaction/full-clear/Backup/restore consequences are all explicit and authority participant growth remains extensible rather than fixed to seven; when legacy backups translate to explicit empty measurement authority without fabricated definitions; when future manual quantity observations can be introduced as a separate evidence authority without redesigning definition identity; when HistoricalPlan and ExecutionHistory remain unchanged unless later concrete policy evidence proves otherwise; when one bounded implementation slice and exact Task 5.12 are selected; when an ADR decision is made; and when no Progress implementation, Progress observation persistence, UI, Recommendation, adaptation, arbitrary formula language, implicit unit conversion, pace, on-track semantics, or unsupported reinterpretation has been introduced during the architecture task.**
