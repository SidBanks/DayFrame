# Task 5.14 — Manual Quantity Progress V1 Policy and Pure Projection

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Pure derived Progress implementation for `manualQuantityTarget@1`, exact Measurement Definition resolution, effective Progress Observation selection, decimal arithmetic/ratio semantics, coverage/status handling, provenance, determinism, clone isolation, application query integration, testing, and governance.

**No Progress UI, measurement-definition UI, observation-entry UI, Recommendation, pace, “on track,” forecasting, or adaptive behavior is authorized.**

---

# 1. Context

Task 5.12 implemented Measurement Definition V1 as durable authored semantic authority.

Task 5.13 implemented Progress Observation V1 as durable measured-state evidence.

The current architecture is:

```text
Goal
    authored intent

Measurement Definition
    how the Goal is measured

Progress Observation
    measured Goal-state evidence

Progress
    not yet implemented
```

Task 5.14 now introduces the first bounded derived Progress model.

The only supported measurement policy is:

```text
manualQuantityTarget@1
```

with definition config:

```text
targetValue
unitId
```

Semantics are:

* absolute non-negative quantity;
* increase toward a positive target;
* no baseline;
* no direction config;
* no unit conversion;
* no custom units;
* values may exceed target.

Progress Observation V1 provides:

* Goal ID;
* exact Measurement Definition ID/revision;
* exact unit;
* absolute canonical decimal value;
* `observedAt`;
* `recordedAt`;
* correction/retraction history;
* as-of evidence reconstruction;
* immutable historical evidence.

Task 5.14 must interpret only those already-governed authorities.

---

# 2. Purpose

Implement the first truthful Progress projection.

For one Goal and one explicit evaluation cutoff, DayFrame should be able to answer:

> **What is the latest effective measured quantity under the Goal’s effective Manual Quantity Target definition, relative to that definition’s target?**

Example:

```text
Goal
    Write 50,000 words

Definition
    manualQuantityTarget@1
    target = 50,000 words

Effective observation
    12,400 words

Derived Progress
    12,400 of 50,000 words
    24.8%
```

This is valid because:

```text
observed quantity
and
target quantity
```

share the same explicit unit and policy semantics.

Task 5.14 must not interpret Goal Activity as Progress evidence.

---

# 3. Governing Progress Principle

> **Manual Quantity Progress is a pure, policy-governed interpretation of one effective quantity observation relative to one exact effective quantity target.**

---

# 4. Governing Evidence Principle

The Progress numerator comes only from:

```text
Progress Observation
```

The Progress denominator comes only from:

```text
Measurement Definition targetValue
```

Do not derive either from:

* Goal Activity;
* scheduled occurrences;
* completed occurrences;
* ExecutionHistory;
* HistoricalPlan;
* target date;
* Goal lifecycle.

---

# 5. Governing Percentage Principle

A percentage is valid only because:

```text
observation.unitId
==
definition.unitId
```

and both values are quantities under the same exact policy epoch.

---

# 6. Governing Lifecycle Principle

Progress does not mutate Goal lifecycle.

Therefore:

```text
Progress >= 100%
```

does not automatically mean:

```text
Goal.status = completed
```

Likewise:

```text
Goal.status = completed
```

does not force:

```text
Progress = 100%
```

---

# 7. Explicit Scope

Implement:

* Manual Quantity Progress policy identity;
* pure Progress projection;
* explicit query contract;
* current Goal validation/context;
* effective Measurement Definition resolution;
* policy-support validation;
* effective Progress Observation resolution;
* as-of knowledge semantics;
* exact epoch binding;
* exact unit compatibility;
* canonical decimal arithmetic;
* quantity comparison;
* ratio/percentage derivation;
* over-target behavior;
* no-observation state;
* no-definition state;
* unsupported-policy state;
* inactive-definition state;
* protected-authority states;
* deterministic provenance;
* clone isolation;
* application/store query boundary;
* tests;
* governance.

---

# 8. Explicit Non-Goals

Do not implement:

* Progress UI;
* Progress bar;
* Planner measurement-definition UI;
* observation-entry UI;
* observation correction/retraction UI;
* Goal Activity conversion;
* ExecutionHistory conversion;
* HistoricalPlan involvement;
* target-date pace;
* on-track/ahead/behind;
* trend;
* forecast;
* recommendation;
* RecommendationDecision;
* adaptation;
* Goal auto-completion;
* baseline policy;
* decrease-target policy;
* maintenance/range policy;
* unit conversion;
* custom units;
* cross-Goal comparison;
* machine learning.

---

# 9. Execution Artifact Rules

Before implementation:

1. verify this Task 5.14 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.10 result;
   * Task 5.11 result;
   * Task 5.12 result;
   * Task 5.13 result;
   * Measurement Definition ADR;
   * Progress Observation ADR if created;
   * decimal representation/validation;
   * manual quantity policy registry;
   * definition resolution;
   * observation as-of resolution;
   * current Goal query surface;
   * historical intelligence policy/result conventions;
   * application/store query conventions;
6. do not modify the immutable Task 5.14 artifact.

Create:

`docs/implementation/phase-5/TASK_5.14_MANUAL_QUANTITY_PROGRESS_V1_POLICY_AND_PURE_PROJECTION_RESULT.md`

---

# 10. Initial Source Audit

Before code changes, confirm:

* exact `manualQuantityTarget@1` policy ref;
* exact config shape;
* canonical decimal grammar;
* supported unit IDs;
* effective definition resolver;
* exact definition revision query;
* effective observation-head query;
* latest effective observation query;
* Goal protection/query semantics;
* Measurement Definition protection/query semantics;
* Progress Observation protection/query semantics.

Stop if the exact definition-observation binding required by 5.14 cannot be reconstructed.

---

# 11. Module Placement

Place pure Progress logic alongside historical/derived intelligence, but keep it conceptually distinct from Goal Activity.

Possible:

```text
core/progress/
```

or existing equivalent.

Do not place policy math inside state/store/UI code.

---

# 12. Projection Identity

Define explicit identity:

```text
{
    id: "manualQuantityProgress",
    version: 1
}
```

or repository-equivalent naming.

---

# 13. Policy Identity

Use the exact measurement policy:

```text
manualQuantityTarget@1
```

Do not invent a second interpretation policy unless architecture requires a thin Progress policy identity.

Preferred:

> Measurement policy defines Progress semantics for V1; projection itself has its own result identity/version.

---

# 14. Query Contract

Define canonical query inputs.

At minimum:

```text
goalId
evaluationAsOf
```

Potential optional:

```text
definitionRevision?
```

but default Progress query should resolve the effective definition itself.

Preferred contract:

```text
queryManualQuantityProgress({
    goalId,
    evaluationAsOf
})
```

---

# 15. Explicit Cutoff

`evaluationAsOf` is mandatory.

No wall-clock reads inside pure projection.

---

# 16. Current Goal Validation

Goal authority is consulted only to:

* confirm queried Goal exists;
* return current authored Goal context.

Do not use current Goal measurementPolicyRef.

---

# 17. Goal Context

Return bounded current context:

* Goal ID;
* title;
* lifecycle;
* target date if present.

Do not let target date affect Progress.

---

# 18. Measurement Definition Resolution

Resolve:

```text
effective definition for goalId at evaluationAsOf
```

using canonical Measurement Definition authority.

---

# 19. No Definition

If no active effective definition exists:

return:

```text
notDefined
```

Do not return:

```text
0%
```

---

# 20. Inactive Definition

If latest effective epoch at cutoff is inactive:

Progress is:

```text
notDefined
```

Historical definitions remain inspectable through provenance/query if needed.

---

# 21. Unsupported Policy

If effective definition policy is structurally valid but unsupported:

return:

```text
unsupportedPolicy
```

Do not protect the result unless authority itself is protected.

---

# 22. Supported Policy

Proceed only for:

```text
manualQuantityTarget@1
```

---

# 23. Definition Config

Extract exact:

```text
targetValue
unitId
```

from effective definition.

Do not consult current Goal fields for measurement semantics.

---

# 24. Target Semantics

Target:

* positive;
* canonical decimal;
* exact policy unit;
* denominator of Progress.

---

# 25. Effective Observation Resolution

Resolve effective observation evidence compatible with:

```text
goalId
definitionId
definitionRevision
evaluationAsOf
```

Use Progress Observation authority.

---

# 26. Observation Knowledge Semantics

Observation revision visibility must respect:

```text
recordedAt <= evaluationAsOf
```

Corrections/retractions after cutoff must not affect earlier Progress queries.

---

# 27. Observation Measurement Semantics

Among effective active observations visible at cutoff, Progress uses the latest measured state by:

```text
observedAt
```

according to Task 5.13 ordering rules.

---

# 28. Observation Binding

Observation must exactly match:

* Goal ID;
* definition ID;
* definition revision;
* unit.

Do not perform best-effort matching.

---

# 29. No Observation

If definition exists but no effective active observation exists:

return:

```text
insufficientEvidence
```

or canonical equivalent.

Do not infer zero.

---

# 30. Retracted Latest Observation

If the latest candidate lineage was retracted and no other active observation exists:

return insufficient evidence.

If earlier independent active observation exists:

use the latest remaining active measured state according to canonical query semantics.

---

# 31. Late Historical Entry

Observation with earlier `observedAt` but later `recordedAt` only affects Progress after its recordedAt cutoff.

Mandatory test.

---

# 32. Corrected Observation

Correction changes Progress only for evaluation cutoffs at/after correction `recordedAt`.

Mandatory.

---

# 33. Same-Time Conflict

Task 5.13 should guarantee no ambiguous same-time effective observations.

Progress projection should treat malformed/conflicting authority as upstream protection rather than choosing arbitrarily.

---

# 34. Decimal Arithmetic

Implement exact or deterministically normalized decimal arithmetic sufficient for:

```text
observedValue
targetValue
observed / target
```

Do not convert canonical strings through lossy floating-point unless proven safe under project constraints.

Audit implementation options.

---

# 35. Decimal Arithmetic Alternatives

Compare:

### A. BigInt scaled integer using decimal normalization

### B. arbitrary-precision decimal helper/library already present

### C. finite JS number with bounded precision proof

### D. another deterministic representation

Choose smallest correct approach.

Do not add a large dependency casually.

---

# 36. Arithmetic Requirements

Need only:

* compare non-negative decimals;
* divide observed by positive target;
* produce deterministic display percentage;
* preserve raw quantity strings.

No addition/subtraction needed for V1.

---

# 37. Raw Quantity Preservation

Result must retain original canonical:

```text
observedValue
targetValue
unitId
```

Percentage is secondary derived representation.

---

# 38. Percentage Representation

Determine canonical result form.

Preferred:

```text
ratioNumerator
ratioDenominator
percentage
```

where percentage may be:

* canonical decimal string;
* fixed display string;
* integer basis points;
* another deterministic representation.

Avoid storing floating JS percentage if unnecessary.

---

# 39. Percentage Precision

Settle V1 precision.

Strong candidate:

> compute percentage to one decimal place for presentation-independent result only if exact rounding semantics are governed.

Alternative:

> return exact rational numerator/denominator plus a bounded decimal percentage helper.

Prefer keeping core result precise and formatting later.

Audit.

---

# 40. Ratio Result

Potential core result:

```text
ratio: {
    numerator: observedValue
    denominator: targetValue
}
```

plus:

```text
comparison:
    belowTarget
    atTarget
    aboveTarget
```

Then UI can format percentage later.

This may be cleaner.

---

# 41. Percentage in Core

Task 5.10 explicitly allowed a valid percentage.

Determine whether Progress V1 should calculate a canonical percentage now or only expose ratio.

Recommended:

> calculate a deterministic percentage representation because Progress V1 should be able to answer “24.8%” semantically before UI exists.

But do not bind it to visual formatting.

---

# 42. Over-Target Behavior

If:

```text
observed > target
```

Progress ratio may exceed 100%.

Do not clamp.

Example:

```text
110 / 100
→ 110%
```

---

# 43. At-Target Behavior

If equal:

```text
100%
```

but no Goal lifecycle mutation.

---

# 44. Zero Observation

Valid:

```text
0 / target
→ 0%
```

This is a known measured zero because an explicit observation exists.

Distinguish from no observation.

---

# 45. Comparison State

Consider explicit:

```text
belowTarget
atTarget
aboveTarget
```

This is arithmetic, not judgment.

Do not use:

* behind;
* ahead;
* success;
* complete.

---

# 46. Result Contract

Conceptual:

```text
ManualQuantityProgressV1Result {
    identity
    query
    status

    currentGoal
    definition

    observation?

    quantity?
    ratio?
    percentage?
    comparison?

    provenance
}
```

---

# 47. Result Status

Distinguish at least:

```text
available
notDefined
unsupportedPolicy
insufficientEvidence
goalNotFound
goalProtected
definitionProtected
observationProtected
invalidQuery
```

Avoid generic unavailable.

---

# 48. Protection Independence

If Goal protected:

Progress unavailable.

If Measurement Definition protected:

Progress unavailable.

If Observation protected:

Progress unavailable.

Do not use Goal Activity as fallback Progress.

---

# 49. Goal Activity Independence

Do not read Goal Activity.

Mandatory regression.

---

# 50. HistoricalPlan Independence

Do not read HistoricalPlan.

---

# 51. ExecutionHistory Independence

Do not read ExecutionHistory.

---

# 52. Preview Independence

Do not read Preview.

---

# 53. Active Independence

Do not read current Active.

---

# 54. Profile Independence

Do not read Profiles.

---

# 55. PlanDecision Independence

Do not read PlanDecision.

---

# 56. Target Date Independence

Current Goal target date is display/context only.

It must not alter:

* ratio;
* percentage;
* comparison;
* eligibility.

---

# 57. Goal Lifecycle Independence

Current active/completed/archived lifecycle is context only.

Does not alter arithmetic.

---

# 58. Goal Completion Boundary

A completed Goal with:

```text
observation 40 / target 100
```

may truthfully produce:

```text
40%
```

plus Goal status Completed.

Do not “correct” either fact.

---

# 59. 100% Boundary

An active Goal with:

```text
100 / 100
```

remains Active unless user changes lifecycle.

---

# 60. Above-Target Boundary

An active Goal with:

```text
120 / 100
```

may produce 120%.

No automatic completion.

---

# 61. Measurement Epoch Changes

If target/unit changes into new definition revision:

Progress query at cutoff before new epoch uses old definition and compatible old observations.

At cutoff after new epoch:

uses new definition and only observations bound to new revision.

Do not migrate old observations.

---

# 62. New Epoch With No Observation

After definition revision starts:

Progress becomes insufficientEvidence until an observation in that epoch exists.

Even if old epoch had an observation.

Mandatory.

---

# 63. Stop Measuring

If definition becomes inactive:

Progress query after inactive epoch begins returns notDefined.

Earlier cutoff still returns old Progress.

---

# 64. Restart Measurement

Restart creates new active definition revision.

Progress after restart requires new compatible observation.

Old observations do not carry forward.

---

# 65. Definition Revision Cutoff

Mandatory test across:

```text
r1 active target 50k
observation r1 = 10k

r2 active target 60k
no observation r2
```

Before r2 cutoff:

```text
20%
```

After r2 cutoff:

```text
insufficientEvidence
```

---

# 66. Unit Change Cutoff

Old miles observation cannot satisfy new kilometers definition.

No conversion.

---

# 67. Policy Change Cutoff

If future unsupported policy becomes effective:

after cutoff:

```text
unsupportedPolicy
```

Earlier cutoff remains valid manual quantity result.

---

# 68. Current Goal Measurement Ref

Ignore deprecated Goal measurementPolicyRef.

Mandatory independence test.

---

# 69. Provenance

Every available Progress result must retain enough provenance to answer:

> Why is this the Progress value?

At minimum:

* Goal ID;
* current Goal title/lifecycle;
* definition ID;
* definition revision;
* definition effectiveFrom;
* policy ID/version;
* target value;
* unit;
* observation ID;
* observation revision;
* observedAt;
* recordedAt;
* observed value;
* evaluation cutoff.

Technical IDs may stay internal until UI.

---

# 70. Provenance for Non-Available States

For `notDefined`:

retain enough definition-resolution context.

For `unsupportedPolicy`:

return policy identity.

For `insufficientEvidence`:

return effective definition but no observation.

For protection:

return protected authority identity/reason according to conventions.

---

# 71. Determinism

Given:

```text
Goal authority
Measurement Definition authority
Progress Observation authority
query
```

the result must be deterministic.

---

# 72. Clone Isolation

Result and nested provenance clone-isolated.

---

# 73. Ordering

If result contains candidate/evidence collections, deterministic ordering.

Prefer result only expose selected effective evidence, not large history lists.

---

# 74. Application Query Boundary

Expose one canonical application/store query:

```text
queryManualQuantityProgress(...)
```

or:

```text
queryGoalProgress(...)
```

with policy-dispatched result.

Task 5.14 should decide whether generic naming is premature.

Strong preference:

> use `queryGoalProgress` only if result contract is intentionally extensible to future policies.

Otherwise use explicit Manual Quantity naming.

---

# 75. Generic Progress Dispatcher

Consider a pure dispatcher:

```text
queryGoalProgress
    resolve definition
    dispatch by policyRef
```

with only one policy today.

This may avoid API churn later.

Audit carefully.

---

# 76. Unsupported Policy Through Dispatcher

Generic dispatcher naturally supports:

```text
unsupportedPolicy
```

without special manual quantity API failure.

This may be preferable.

---

# 77. Result Identity per Policy

Could return:

```text
metricId: goalProgress
version: 1
policyRef: manualQuantityTarget@1
```

rather than separate projection ID.

Settle.

---

# 78. No Persistence

Progress result must not be stored in:

* Goal;
* Measurement Definition;
* Progress Observation;
* localStorage;
* IndexedDB.

---

# 79. Backup Boundary

No Progress result in Backup V6.

---

# 80. Restore Boundary

Restore authorities, then re-run query.

Same authority + cutoff → same result.

---

# 81. Full Clear Boundary

No Progress participant.

After clear query returns Goal not found/notDefined according to authority state.

---

# 82. Performance

Expected:

* definition resolution O(revisions for Goal) unless indexed;
* observation resolution O(observations for Goal/definition) plus ordering;
* no per-record store queries.

Reuse existing indexes/query helpers.

---

# 83. Privacy

No network/telemetry/external processing.

---

# 84. Decimal Display Metadata

Do not add UI formatting choices to authority.

If projection returns percentage decimal, use deterministic canonical form only.

---

# 85. Rounding Rule

If percentage is emitted, define exact rounding.

Candidate:

* four decimal places internal canonical;
* no trailing zeros;
* half-up;
* another exact rule.

Avoid arbitrary UI-specific one-decimal rounding unless governed.

---

# 86. Exact Rational Alternative

Consider retaining:

```text
numerator
denominator
```

as authoritative derived arithmetic and computing formatted percentage through helper.

This may be best for future UI flexibility.

---

# 87. Recommended Arithmetic Contract

Strong candidate:

```text
progress: {
    observedValue
    targetValue
    unitId

    ratio: {
        numerator: observedValue
        denominator: targetValue
    }

    percentage: canonical decimal string
    comparison: "belowTarget" | "atTarget" | "aboveTarget"
}
```

---

# 88. Percentage Canonical Examples

For deterministic tests:

```text
12400 / 50000 → 24.8
1 / 3 → governed rounded canonical form
100 / 100 → 100
110 / 100 → 110
0 / 100 → 0
```

Settle `1/3` rule explicitly.

---

# 89. No Infinite Decimal Ambiguity

A division such as:

```text
1 / 3
```

requires bounded canonical precision.

This is a core architectural decision.

Do not rely on JS default stringification.

---

# 90. Percentage Precision Decision

Choose one exact approach.

Recommended:

> canonical percentage string rounded to **four decimal places**, trimming trailing zeros, using deterministic half-up or half-even arithmetic.

Four places gives sufficient precision without turning result into arbitrary decimal infrastructure.

If codebase already has another numeric policy, reuse it.

---

# 91. Percentage Range

Do not cap.

Allowed:

```text
0
24.8
100
110
1000
```

subject to bounded arithmetic/resource constraints.

---

# 92. Huge Decimal Inputs

Target/value grammar already bounded to 100 chars.

Arithmetic implementation must avoid pathological resource use.

Add tests for large but valid canonical decimals.

---

# 93. Progress Value Status

Available result may include:

```text
knownZero
belowTarget
atTarget
aboveTarget
```

But do not overload status with comparison if separate field suffices.

Prefer:

```text
status = available
comparison = ...
```

---

# 94. No Observation vs Observed Zero

Mandatory distinction:

```text
no observation
    → insufficientEvidence

observation value = "0"
    → available, 0%
```

---

# 95. Correction Regression

Observation:

```text
10 / 100
```

corrected later to:

```text
20 / 100
```

Earlier cutoff:

* 10%.

Later cutoff:

* 20%.

---

# 96. Retraction Regression

Observation 20/100 then retracted.

Earlier cutoff:

* 20%.

Later cutoff:

* insufficientEvidence or earlier active independent observation.

---

# 97. Multiple Observations

If:

```text
Aug 1 = 10
Aug 5 = 20
```

latest measured state at cutoff after Aug 5 is 20.

Do not sum observations.

---

# 98. Decreasing Observation

Although policy direction is increase-toward-target, later absolute observation may be lower than earlier:

```text
20
→ 15
```

This is valid evidence.

Progress becomes 15%.

Do not prohibit or interpret regression morally.

---

# 99. No Monotonicity Assumption

Manual quantity observations need not monotonically increase.

Policy direction describes target orientation, not evidence validity.

---

# 100. Progress Does Not Use Observation History Trend

Use latest effective state only.

No trend calculation.

---

# 101. Candidate Observation Selection

Formalize:

1. resolve effective definition revision at cutoff;
2. retrieve observation lineages bound exactly to it;
3. resolve each lineage head by recordedAt cutoff;
4. discard retracted heads;
5. select latest active head by observedAt;
6. use deterministic tie-breaker only if same-time duplicates are structurally impossible;
7. derive ratio.

---

# 102. Definition Effective At Cutoff vs Observation Time

Progress uses definition effective at evaluation cutoff.

Observation must belong to that exact revision.

Do not choose an old observation merely because it is latest overall.

---

# 103. Why Epoch Reset Matters

Target revision changes semantics.

Therefore new epoch starts with no Progress evidence until a new observation exists.

This must be documented.

---

# 104. Goal CreatedAt

No special use.

Definition authority already ensures measurement lineage belongs to Goal.

---

# 105. Goal Target Date

No special use.

---

# 106. Goal Description

Context only if returned.

---

# 107. Supported Units

Progress output uses exact unit ID and possibly canonical display label from registry.

No conversion.

---

# 108. Count Unit

`count` is valid.

Example:

```text
8 / 20 count
```

This may represent user-authored measurable Goal state such as 8 of 20 labs—because the measurement definition explicitly says so.

Do not interpret arbitrary Goal Activity counts as this.

---

# 109. Words/Pages/Miles/Kilometers/Minutes

All supported identically at arithmetic level.

---

# 110. Custom Unit Boundary

Unsupported.

---

# 111. Invalid Definition Config

Should be impossible for ready authority.

If encountered in pure function fixtures:

return invalid/protected according to layer contract rather than guessing.

---

# 112. Invalid Observation Value

Likewise upstream authority protection should prevent projection from seeing malformed active evidence.

---

# 113. Generic Policy Registry Reuse

Use policy registry to:

* confirm policy support;
* interpret config shape;
* get unit semantics.

Do not duplicate `manualQuantityTarget@1` validation.

---

# 114. Progress Policy Function

Possible registry extension:

```text
deriveProgress(definition, observation)
```

But consider whether putting derivation into policy registry is correct.

Strong architectural fit:

> yes, policy implementation owns semantics.

Task 5.14 may add pure derive hook for supported policy.

---

# 115. Registry Boundary

Registry remains deterministic code, not authority.

No Backup.

---

# 116. Result Policy Provenance

Include exact:

```text
manualQuantityTarget@1
```

so future changes do not reinterpret old displayed semantics.

---

# 117. Current vs Historical Definition

The result uses definition effective at cutoff, not necessarily current latest definition today.

This is important for historical Progress queries.

---

# 118. Historical Query Example

Suppose:

```text
Aug 1 target 50k
Sep 1 target 60k
```

Query Aug 20:

* 50k target.

Query Sep 20:

* 60k target.

No reinterpretation.

---

# 119. Historical Goal State Limitation

Current Goal authority itself is not historical as-of.

If current Goal title/lifecycle changed after cutoff, result context may reflect current Goal state while measurement semantics/evidence are historical as-of.

Document this distinction.

Do not claim historical Goal lifecycle reconstruction.

---

# 120. Frozen Measurement Semantics

Unlike Goal title, Measurement Definition authority *does* retain exact historical revisions.

Progress semantics are historically reproducible.

---

# 121. Current Goal Context Naming

Result should label current context explicitly if needed:

```text
currentGoal
```

and measurement evidence:

```text
measurement
```

Avoid implying current title existed at cutoff.

---

# 122. Protection Result Semantics

Return explicit authority-specific protection:

* Goal protected;
* Measurement Definition protected;
* Observation protected.

Do not collapse all into unknown Progress.

---

# 123. Unsupported Policy vs Not Defined

Mandatory distinction.

---

# 124. Insufficient Evidence vs Known Zero

Mandatory distinction.

---

# 125. Invalid Query

Canonical timestamp/Goal ID validation.

---

# 126. Property Invariant — Activity Independence

Changing:

* HistoricalPlan;
* ExecutionHistory;
* Goal Activity;
* schedule;
* Preview;

cannot change Progress result.

---

# 127. Property Invariant — Target Date Independence

Changing Goal target date cannot change Progress.

---

# 128. Property Invariant — Lifecycle Independence

Changing Goal active/completed/archived cannot change numeric Progress.

---

# 129. Property Invariant — Definition Sensitivity

Changing target in a new epoch changes Progress only after cutoff enters new epoch and compatible observation exists.

---

# 130. Property Invariant — Observation Sensitivity

Changing effective observation through correction changes Progress only after correction knowledge cutoff.

---

# 131. Property Invariant — Input Order

Observation storage/input order does not affect result.

---

# 132. Property Invariant — Roundtrip

Backup/restore authorities reproduce same result for same cutoff.

---

# 133. Property Invariant — Clear

Full clear eliminates prior Progress availability naturally.

---

# 134. Golden Fixtures

Create at least:

### A. 12,400 / 50,000 words

Expected available Progress.

### B. zero / positive target

Known 0%.

### C. exactly target

100%.

### D. above target

> 100%.

### E. no observation

insufficientEvidence.

### F. no definition

notDefined.

### G. inactive definition

notDefined.

### H. unsupported policy

unsupportedPolicy.

### I. correction across cutoff

different historical values.

### J. retraction across cutoff

available → insufficient.

### K. target revision across cutoff

old Progress → new epoch insufficient.

### L. new observation in revised epoch

new target + new evidence.

### M. unit revision

old observation excluded.

### N. completed Goal below target

lifecycle independent.

### O. active Goal at target

no lifecycle mutation.

---

# 135. Required Query Matrix

Produce:

| Input               | Required? | Meaning |
| ------------------- | --------: | ------- |
| Goal ID             |           |         |
| evaluationAsOf      |           |         |
| date range          |           |         |
| Goal revision       |           |         |
| definition revision |           |         |
| observation ID      |           |         |

Expected: only Goal ID + evaluationAsOf required for standard query.

---

# 136. Required Status Matrix

Produce:

| Condition                                    | Progress status |
| -------------------------------------------- | --------------- |
| supported definition + effective observation |                 |
| no definition                                |                 |
| inactive definition                          |                 |
| unsupported policy                           |                 |
| no observation                               |                 |
| observed zero                                |                 |
| Goal missing                                 |                 |
| Goal protected                               |                 |
| definition protected                         |                 |
| observation protected                        |                 |

---

# 137. Required Arithmetic Matrix

Produce:

| Observed | Target | Result |
| -------: | -----: | ------ |
|        0 |    100 |        |
|       25 |    100 |        |
|      100 |    100 |        |
|      125 |    100 |        |
|        1 |      3 |        |
|     0.25 |      1 |        |

Use canonical decimal strings.

---

# 138. Required Epoch Matrix

Produce:

| Definition state  | Observation state | Result |
| ----------------- | ----------------- | ------ |
| r1 active         | r1 obs            |        |
| r2 starts, no obs | old r1 obs exists |        |
| r2 starts         | r2 obs            |        |
| inactive r3       | old obs exists    |        |
| restart r4        | no r4 obs         |        |
| restart r4        | r4 obs            |        |

---

# 139. Required Correction Matrix

Produce:

| Cutoff            | Observation history | Effective Progress |
| ----------------- | ------------------- | ------------------ |
| before correction | r1                  |                    |
| after correction  | r1+r2               |                    |
| before retraction | active head         |                    |
| after retraction  | retracted head      |                    |

---

# 140. Required Authority Matrix

Produce:

| Source                 | Used by Progress? | Role |
| ---------------------- | ----------------: | ---- |
| Goal                   |                   |      |
| Measurement Definition |                   |      |
| Progress Observation   |                   |      |
| Goal Activity          |                   |      |
| HistoricalPlan         |                   |      |
| ExecutionHistory       |                   |      |
| Active                 |                   |      |
| Profiles               |                   |      |
| PlanDecision           |                   |      |
| Preview                |                   |      |

---

# 141. Required Provenance Matrix

Produce:

| Field                    | Retained? |
| ------------------------ | --------: |
| Goal ID                  |           |
| current Goal title       |           |
| current Goal lifecycle   |           |
| Goal target date         |           |
| definition ID            |           |
| definition revision      |           |
| definition effectiveFrom |           |
| policy ID/version        |           |
| target value             |           |
| unit                     |           |
| observation ID           |           |
| observation revision     |           |
| observedAt               |           |
| recordedAt               |           |
| observed value           |           |
| evaluation cutoff        |           |

---

# 142. Required Percentage Matrix

Produce:

| Question            | V1 rule |
| ------------------- | ------- |
| percentage allowed? |         |
| clamped at 100?     |         |
| zero observation?   |         |
| no observation?     |         |
| repeating decimals? |         |
| rounding rule?      |         |
| unit mismatch?      |         |
| target date used?   |         |
| lifecycle used?     |         |

---

# 143. Required Product-Boundary Matrix

Produce:

| Capability               | Task 5.14 |
| ------------------------ | --------- |
| Progress policy          |           |
| Progress projection      |           |
| quantity/target          |           |
| percentage               |           |
| over-target              |           |
| provenance               |           |
| Progress persistence     |           |
| Backup result            |           |
| Progress UI              |           |
| measurement UI           |           |
| observation UI           |           |
| Goal Activity conversion |           |
| pace/on-track            |           |
| Recommendation           |           |
| adaptation               |           |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 144. Required Epistemic Matrix

Produce:

| Evidence                            | DayFrame may say | Must not say |
| ----------------------------------- | ---------------- | ------------ |
| 12,400 / 50,000 words               |                  |              |
| 0 / 50,000 words                    |                  |              |
| no observation                      |                  |              |
| 60,000 / 50,000 words               |                  |              |
| Goal completed at 40%               |                  |              |
| Goal active at 100%                 |                  |              |
| target date passed                  |                  |              |
| completed Goal Activity occurrences |                  |              |
| unsupported policy                  |                  |              |
| inactive measurement                |                  |              |

---

# 145. Required Architectural Invariant Assessment

Classify at least:

1. Progress is derived.
2. Progress is non-authoritative.
3. Progress is non-persisted.
4. Progress is policy-versioned.
5. standard query uses Goal ID + evaluationAsOf.
6. no date range is required for Manual Quantity Progress.
7. current Goal validates identity/context only.
8. Goal measurementPolicyRef is ignored.
9. Measurement Definition is the sole measurement-semantics authority.
10. Progress Observation is the sole measured-state evidence authority.
11. Goal Activity is not consulted.
12. HistoricalPlan is not consulted.
13. ExecutionHistory is not consulted.
14. Active is not consulted.
15. Preview is not consulted.
16. Profiles are not consulted.
17. PlanDecision is not consulted.
18. effective definition is selected as of cutoff.
19. inactive definition means notDefined.
20. unsupported policy means unsupportedPolicy.
21. effective observation uses exact definition revision.
22. observation revision visibility uses recordedAt.
23. measurement chronology uses observedAt.
24. corrections affect only cutoffs after recordedAt.
25. retractions affect only cutoffs after recordedAt.
26. no observation means insufficientEvidence.
27. observed zero means known 0%.
28. numerator is observation value.
29. denominator is definition target.
30. units must match exactly.
31. no conversion exists.
32. baseline is absent.
33. percentage may exceed 100.
34. percentage is not clamped.
35. target date is irrelevant.
36. Goal lifecycle is irrelevant to arithmetic.
37. completed Goal does not force 100%.
38. 100% does not complete Goal.
39. over-target does not complete Goal.
40. definition revision starts new evidence epoch.
41. old observations do not satisfy new revision.
42. restart requires new observation.
43. stop measurement yields notDefined.
44. decimal arithmetic is deterministic.
45. repeating decimal rounding is governed.
46. raw quantity/target strings are retained.
47. semantic provenance is explicit.
48. result is clone-isolated.
49. input ordering does not alter result.
50. Backup does not store Progress.
51. restore re-derives Progress.
52. full clear needs no Progress participant.
53. Goal Activity remains unchanged.
54. schedule remains unchanged.
55. Preview staleness remains unchanged.
56. no Progress UI exists.
57. no progress bar exists.
58. no pace exists.
59. no on-track/behind exists.
60. no trend exists.
61. no recommendation exists.
62. no adaptation exists.
63. no Goal auto-completion exists.
64. no cross-Goal comparison exists.
65. no machine learning exists.
66. focused validation is green.
67. canonical validation is green.
68. no unresolved stop condition remains.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Stop-condition violation.

---

# 146. Stop Conditions

Stop and report if:

* effective definition cannot be resolved deterministically at cutoff;
* effective observation cannot be reconstructed deterministically at cutoff;
* definition/observation exact epoch binding is insufficient;
* decimal division cannot be implemented deterministically within bounded complexity;
* valid percentages require unit conversion;
* Progress would need Goal Activity or ExecutionHistory to be useful;
* no-observation and observed-zero cannot be distinguished;
* policy changes would reinterpret old observations;
* result must be persisted to remain reproducible;
* Goal lifecycle must be mutated;
* UI is required to validate semantics;
* Progress implementation requires HistoricalPlan changes;
* Progress implementation requires Observation schema changes;
* Progress implementation requires Measurement Definition schema changes.

Do not broaden the task to solve a blocker.

---

# 147. Likely Files

Likely areas:

```text
core/progress/
measurement policy registry
decimal arithmetic helper
state/application query adapter
tests/fixtures
governance
```

No UI files.

---

# 148. Test Strategy

Layered tests:

### Arithmetic

* compare decimals;
* ratio;
* repeating decimal;
* canonical percentage;
* large values.

### Policy

* supported;
* unsupported;
* no definition;
* inactive definition.

### Observation selection

* latest measured state;
* correction;
* retraction;
* late historical entry.

### Epochs

* target revision;
* unit revision;
* stop;
* restart.

### Boundaries

* lifecycle independence;
* target-date independence;
* Goal Activity independence;
* schedule independence.

### Authority roundtrip

* Backup/restore re-derivation;
* clear.

---

# 149. Focused Validation

Run focused suites covering:

* decimal arithmetic;
* manual quantity Progress projection;
* measurement definition as-of resolution;
* observation as-of resolution;
* application query;
* restore/roundtrip independence.

Record exact file/test counts.

---

# 150. Full Validation

Before completion run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* test-file count;
* test count;
* build module count;
* main bundle advisory;
* diff result.

Also record main bundle size as part of the Phase 5 bundle-growth tracking plan.

Do **not** attempt bundle optimization inside Task 5.14.

---

# 151. Bundle Tracking

Because Phase 5 now has an explicit end-of-phase bundle architecture task:

* record the post-5.14 main bundle size;
* compare it against the current ~672 kB baseline;
* note meaningful growth;
* do not raise `chunkSizeWarningLimit`;
* do not perform code splitting unless a pathological regression requires separate escalation.

The permanent performance pass remains a Phase 5 exit task.

---

# 152. Manual Validation

No Progress UI exists.

State:

> Manual Progress workflow validation not applicable; no Progress UI exists.

---

# 153. Governance

On success update minimally:

* Task 5.14 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* `DECISIONS.md` only if arithmetic/percentage representation establishes a new enduring decision.

Do not claim Progress UI implemented.

---

# 154. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.14_MANUAL_QUANTITY_PROGRESS_V1_POLICY_AND_PURE_PROJECTION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.12/5.13 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Module Placement
7. Projection Identity
8. Policy Identity
9. Query Contract
10. Goal Validation
11. Current Goal Context
12. Definition Resolution
13. No-Definition State
14. Inactive Definition
15. Unsupported Policy
16. Definition Config
17. Observation Resolution
18. Observation Knowledge Semantics
19. Observation Measurement Semantics
20. No-Observation State
21. Correction
22. Retraction
23. Late Historical Entry
24. Decimal Arithmetic
25. Arithmetic Representation Decision
26. Raw Quantity Preservation
27. Ratio
28. Percentage
29. Percentage Precision/Rounding
30. Repeating Decimals
31. Over-Target Behavior
32. At-Target Behavior
33. Zero Observation
34. Comparison State
35. Result Contract
36. Result Status
37. Protection
38. Goal Activity Independence
39. HistoricalPlan Independence
40. ExecutionHistory Independence
41. Active/Preview/Profile/PlanDecision Independence
42. Target-Date Independence
43. Goal Lifecycle Independence
44. Definition Epoch Changes
45. Stop/Restart
46. Unit Revision
47. Policy Change
48. Deprecated Goal Policy Ref
49. Provenance
50. Determinism
51. Clone Isolation
52. Application Query Boundary
53. Policy Registry Integration
54. Persistence Boundary
55. Backup/Restore/Clear Boundary
56. Performance
57. Bundle Tracking
58. Tests Added/Changed
59. Golden Fixtures
60. Property Invariants
61. Focused Validation
62. Full Validation
63. Manual Validation
64. Governance Updates
65. Deviations
66. Discoveries
67. Deferred Work
68. Query Matrix
69. Status Matrix
70. Arithmetic Matrix
71. Epoch Matrix
72. Correction Matrix
73. Authority Matrix
74. Provenance Matrix
75. Percentage Matrix
76. Product-Boundary Matrix
77. Epistemic Matrix
78. Architectural Invariant Assessment
79. Stop-Condition Assessment
80. Architectural Alignment Assessment
81. Recommended Next Task
82. Final Completion Determination

---

# 155. Completion Criteria

Task 5.14 is complete only when:

* Manual Quantity Progress V1 exists as a pure derived projection;
* Progress is explicitly non-authoritative and non-persisted;
* query requires one Goal ID and explicit evaluationAsOf;
* current Goal authority validates identity/context only;
* deprecated Goal measurementPolicyRef is never used as measurement truth;
* Measurement Definition is the sole authority for effective policy/target/unit semantics;
* Progress Observation is the sole authority for measured quantity;
* effective definition is resolved deterministically at cutoff;
* inactive effective definition returns notDefined;
* no definition returns notDefined;
* unsupported effective policy returns unsupportedPolicy;
* only manualQuantityTarget@1 is interpreted;
* effective observation selection is exact-definition-revision scoped;
* observation revision visibility obeys recordedAt cutoff;
* measurement chronology obeys observedAt;
* corrections change Progress only after their recordedAt cutoff;
* retractions remove effective evidence only after their recordedAt cutoff;
* late-entered historical evidence is absent before it was recorded;
* no effective observation returns insufficientEvidence;
* observed value `"0"` returns available known 0% rather than insufficient evidence;
* numerator is exact observed absolute quantity;
* denominator is exact definition target quantity;
* exact unit identity is required;
* no conversion occurs;
* no baseline exists;
* raw quantity and target canonical strings remain available in result;
* decimal comparison/division are deterministic;
* repeating decimal behavior is explicitly governed;
* percentage representation and rounding are deterministic;
* percentage is not clamped at 100;
* above-target values remain valid;
* at-target produces arithmetic 100% only;
* comparison semantics are arithmetic-only;
* Goal lifecycle does not alter arithmetic;
* completed Goal does not force 100%;
* 100% does not mutate Goal lifecycle;
* target date does not affect Progress;
* Goal Activity is never read;
* HistoricalPlan is never read;
* ExecutionHistory is never read;
* Active, Preview, Profiles, and PlanDecision are never read;
* new definition revision begins a new evidence epoch;
* old observations never satisfy a new definition revision;
* target revision with no new observation returns insufficientEvidence;
* unit revision never converts old evidence;
* stop measurement returns notDefined after cutoff;
* restart requires new observation;
* policy change is cutoff-governed;
* result includes enough provenance to explain exact target, exact observation, exact definition epoch, and evaluation cutoff;
* current Goal context is distinguished from historical measurement semantics;
* result is deterministic and clone-isolated;
* input ordering cannot change result;
* policy registry owns manual quantity semantics rather than duplicating them;
* Progress output is not added to IndexedDB/localStorage;
* Backup V6 contains no derived Progress;
* restore re-derives identical Progress for same authority/cutoff;
* full clear requires no Progress participant;
* no Progress UI, progress bar, measurement UI, observation UI, Goal auto-completion, Goal score, pace, on-track/behind, trend, forecast, Recommendation, RecommendationDecision, adaptation, cross-Goal comparison, unit conversion, baseline policy, custom unit, external integration, or machine-learning behavior is introduced;
* focused tests pass;
* lint, typecheck, full tests, build, and `git diff --check` pass;
* post-task main bundle size is recorded for the planned Phase 5 exit performance task;
* no bundle warning threshold is raised merely to silence the advisory;
* governance records Manual Quantity Progress as implemented derived intelligence while Progress UI and Recommendations remain deferred;
* no unresolved policy, arithmetic, epoch, observation, evidence, determinism, protection, or authority stop condition remains.

---

# 156. Recommended Next Task

If Task 5.14 completes successfully:

> **Task 5.15 — Progress Authoring and Summary Integration Readiness Audit**

That audit should determine how the first complete Progress workflow becomes user-facing:

```text
Planner
    configure measurement definition
    record/correct/retract quantity observations

Summary
    view derived Progress
    inspect measurement provenance
    retain Goal Activity separately
```

It should settle:

* measurement-definition authoring UX;
* observation-entry UX;
* whether observation writes belong in Planner or a bounded reporting flow;
* Progress Summary placement;
* Progress versus Goal Activity hierarchy;
* no-definition and insufficient-evidence copy;
* percentage/quantity presentation;
* > 100% presentation;
* completed/archived Goal behavior;
* current-vs-historical measurement context;
* accessibility;
* mobile density;
* navigation handoffs.

Do not implement UI until that audit is complete.

---

# 157. Final Implementation Principle

> **Manual Quantity Progress should be nothing more—and nothing less—than the exact measured quantity DayFrame knows, interpreted against the exact target the user authored for that measurement epoch.**

---

# 158. Final Completion Statement

**Task 5.14 is complete when DayFrame implements Manual Quantity Progress V1 as a deterministic, policy-versioned, non-authoritative, non-persisted projection that resolves one Goal’s exact effective Measurement Definition revision and compatible effective Progress Observation evidence at an explicit evaluation cutoff; when `manualQuantityTarget@1` derives Progress solely from the observation’s absolute canonical quantity and the definition’s positive canonical target in the same exact unit; when no definition/inactive definition, unsupported policy, insufficient evidence, observed zero, below-target, at-target, and above-target conditions remain mechanically distinct; when correction, retraction, late historical entry, target revision, unit revision, stop, restart, and future policy changes affect Progress only through their already-governed definition and observation as-of semantics; when decimal division, repeating-decimal precision, rounding, percentage representation, quantity preservation, and over-target behavior are deterministic and explainable without lossy or hidden arithmetic; when 100% and >100% remain arithmetic facts rather than Goal lifecycle mutations or success judgments; when Goal target date, Goal lifecycle, Goal Activity, HistoricalPlan, ExecutionHistory, Active, Preview, Profiles, and PlanDecision are excluded from Progress calculation; when every available result retains exact definition, target, policy, observation, measured value, observedAt, recordedAt, unit, and evaluation-cutoff provenance sufficient to explain why the result exists; when Progress remains clone-isolated, reproducible after authority Backup/restore, naturally removed by full clear, and absent from persistent authority and Backup payloads; when no Progress UI, progress bar, measurement UI, observation UI, Goal auto-completion, pace, on-track/behind, trend, forecast, recommendation, adaptation, unit conversion, baseline, custom-unit system, external integration, cross-Goal score, or machine-learning behavior is introduced; when focused and canonical validation are green; when the post-task main-bundle size is recorded for the already-planned Phase 5 exit bundle-architecture pass without silencing the advisory; when governance records the first genuine Progress projection truthfully while preserving UI and recommendation semantics as deferred; and when no unresolved arithmetic, evidence, measurement-epoch, policy, protection, determinism, or authority stop condition remains.**
