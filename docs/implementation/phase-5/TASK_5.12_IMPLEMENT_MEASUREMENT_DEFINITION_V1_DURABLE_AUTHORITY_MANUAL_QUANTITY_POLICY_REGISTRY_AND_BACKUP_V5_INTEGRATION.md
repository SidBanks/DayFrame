# Task 5.12 — Implement Measurement Definition V1 Durable Authority, Manual Quantity Policy Registry, and Backup V5 Integration

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Durable Measurement Definition authority implementation, immutable revision/epoch model, built-in measurement-policy registry, canonical decimal validation, Goal referential integrity, IndexedDB persistence, readiness/protection, runtime authority integration, full-clear participation, Backup V5 evolution, restore/recovery participation, regression testing, and governance.

**No Progress Observation authority, Progress projection, measurement UI, Progress UI, Recommendation, or adaptive behavior is authorized.**

---

# 1. Context

Task 5.10 established that DayFrame is not yet ready to implement Progress directly.

It determined:

```text id="5.12-context-1"
Goal
    authored intent

Goal Activity
    historical supporting activity

Measurement Definition
    authored meaning of how Goal progress is measured

Progress Observation
    future measured Goal-state evidence

Progress
    future derived interpretation
```

Task 5.11 then finalized the Measurement Definition V1 architecture.

Accepted architecture includes:

* independent durable `GoalMeasurementDefinition` authority;
* one measurement lineage per Goal in V1;
* zero or one current effective definition revision;
* any number of retained historical revisions;
* opaque stable definition identity;
* immutable append-like revision records;
* revision-implied measurement epochs;
* exact epoch identity:

  * `(definitionId, revision)`;
* required save-time `effectiveFrom`;
* no backdating V1;
* one non-overlapping effective revision per Goal;
* exact future observation binding to definition revision;
* closed built-in policy registry;
* first policy:

  * `manualQuantityTarget@1`;
* policy configuration:

  * `targetValue`;
  * `unitId`;
* no baseline;
* no authored direction field;
* fixed `increaseTowardTarget` policy semantics;
* canonical unsigned decimal strings;
* built-in V1 units:

  * `count`;
  * `words`;
  * `pages`;
  * `miles`;
  * `kilometers`;
  * `minutes`;
* no implicit unit conversion;
* no custom units V1;
* over-target values allowed;
* Goal's current `measurementPolicyRef` becomes deprecated/non-operative compatibility metadata;
* no immediate Goal V2 migration;
* HistoricalPlan unchanged;
* ExecutionHistory unchanged;
* Measurement Definition becomes runtime-authority participant seven;
* Measurement Definition joins full clear;
* latest complete Backup evolves to V5;
* V4 and earlier whole-authority restore translate Measurement Definition authority to explicit empty;
* durable definitions must not ship without Backup/restore/full-clear;
* Progress Observation remains deferred to Task 5.13.

Task 5.11 selected:

> **Slice B — Full Durable Definition Authority.**

---

# 2. Purpose

Implement the complete non-UI Measurement Definition V1 substrate.

At completion DayFrame must have:

1. canonical Measurement Definition V1 domain types;
2. opaque durable definition identity;
3. immutable revision records;
4. deterministic measurement epochs;
5. built-in policy registry;
6. `manualQuantityTarget@1`;
7. canonical decimal-string validation;
8. built-in unit validation;
9. semantic fingerprints;
10. deterministic current/historical definition resolution;
11. create/revise/stop/restart commands;
12. revision guards;
13. no-op detection;
14. Goal referential integrity;
15. independent IndexedDB persistence;
16. readiness/protection/durability semantics;
17. centralized mutation admission;
18. complete runtime snapshot/exact install;
19. shared notification scheduling;
20. seventh-participant runtime transaction integration;
21. governed full-clear participation;
22. Backup V5;
23. legacy V1–V4 Backup compatibility;
24. restore/recovery participation;
25. exact preservation of historical definition revisions;
26. no Measurement UI;
27. no Progress observations;
28. no Progress projection.

---

# 3. Governing Authority Principle

> **Measurement Definition is durable authored semantic authority. Progress is not.**

Do not store:

* current Progress percentage;
* current quantity observation;
* Goal Activity counts;
* recommendation state.

---

# 4. Governing Revision Principle

> **A semantic measurement change appends a new immutable revision and starts a new measurement epoch. It never rewrites prior measurement semantics.**

Therefore:

```text id="5.12-revisions"
target change
    → new revision

unit change
    → new revision

policy change
    → new revision

stop measurement
    → new inactive revision

restart measurement
    → new active revision

normalized identical save
    → no revision
```

---

# 5. Governing Observation Boundary

Task 5.12 must prepare for future observations but must not implement them.

Future observations will bind conceptually to:

```text id="5.12-observation-contract"
goalId
definitionId
definitionRevision
unitId
observedAt
value
```

Task 5.12 must preserve this contract without introducing observation storage.

---

# 6. Explicit Scope

Implement:

* Measurement Definition domain;
* authority envelope;
* definition IDs;
* immutable revisions;
* active/inactive revision state;
* effective-from semantics;
* revision/epoch resolution;
* policy registry;
* Manual Quantity Target V1 config;
* unit registry;
* canonical decimal-string handling;
* definition validation;
* semantic fingerprints;
* create/revise/stop/restart commands;
* no-op detection;
* revision guards;
* definition queries;
* Goal referential checks;
* IndexedDB storage;
* bootstrap/readiness;
* durability;
* protection;
* retry/recovery where consistent with durable-authority conventions;
* runtime snapshots;
* exact runtime install;
* notification scheduler;
* runtime transaction registration;
* full clear;
* Backup V5;
* V4-and-earlier translation;
* restore staging/source recheck/commit/rollback/runtime install;
* tests;
* governance.

---

# 7. Explicit Non-Goals

Do not implement:

* Progress Observation types beyond minimal compatibility contract if required for compile-time architecture;
* Progress Observation persistence;
* Progress Observation UI;
* Progress projection;
* Manual Quantity Progress calculation;
* percentage display;
* measurement configuration UI;
* Goal Planner measurement controls;
* Summary Progress UI;
* milestone policy;
* decrease-toward-target policy;
* maintenance/range policy;
* arbitrary formulas;
* formula DSL;
* arbitrary/custom units;
* unit conversion;
* baselines;
* external integrations;
* Goal score;
* pace;
* on-track/behind;
* recommendation;
* RecommendationDecision;
* adaptation;
* machine learning.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this Task 5.12 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.10 result;
   * Task 5.11 result;
   * Measurement Definition ADR;
   * Goal ADR;
   * Goal domain and authority;
   * Goal persistence/protection;
   * IndexedDB collection infrastructure;
   * runtime authority transaction;
   * notification scheduler;
   * mutation admission;
   * restore infrastructure;
   * combined IndexedDB replacement infrastructure;
   * full clear;
   * Backup V4;
   * Backup version translation;
   * runtime participant registration;
   * strict-validation conventions;
   * fingerprint conventions;
   * decimal/numeric helpers if any;
6. do not modify the immutable Task 5.12 artifact.

Create:

`docs/implementation/phase-5/TASK_5.12_IMPLEMENT_MEASUREMENT_DEFINITION_V1_DURABLE_AUTHORITY_MANUAL_QUANTITY_POLICY_REGISTRY_AND_BACKUP_V5_INTEGRATION_RESULT.md`

---

# 9. Prerequisite Audit

Before code changes, confirm Task 5.11 assumptions against current source.

At minimum verify:

* current runtime participant composition is six;
* participant registration remains extensible;
* Backup latest version is V4;
* Goal authority is restorable as one participant;
* Goal IDs are stable/never reused;
* IndexedDB physical version;
* collection abstraction supports immutable keyed records;
* restore can include another IndexedDB participant;
* full clear can grow another participant;
* Goal measurementPolicyRef is still present but unused by UI;
* no current Progress/measurement policy implementation exists.

Stop if architecture materially contradicts Task 5.11.

---

# 10. Measurement Definition Domain Identity

Introduce canonical domain naming.

Preferred:

```text id="5.12-domain-identity"
GoalMeasurementDefinitionV1
GoalMeasurementDefinitionId
GoalMeasurementDefinitionAuthorityV1
GoalMeasurementPolicyRef
```

Exact names should follow repository conventions.

---

# 11. Definition ID

Implement branded opaque definition ID.

Requirements:

* canonical UUID or existing project opaque-ID convention;
* cryptographically strong allocator;
* deterministic allocator injection for tests;
* never title-derived;
* never Goal-derived;
* never reused;
* preserved exactly through Backup/restore.

---

# 12. One Lineage per Goal V1

Enforce:

```text id="5.12-one-lineage"
Goal
    zero definition lineages
    or
    exactly one definition lineage
```

A Goal may have many revisions within that lineage.

Reject creation of a second lineage for the same Goal.

---

# 13. Definition Revision

Use monotonic positive integers per definition lineage.

First revision uses canonical initial value according to repository conventions.

Revision:

* identifies exact measurement semantics;
* never changes after persistence;
* increments exactly once per material mutation;
* is preserved through Backup/restore.

---

# 14. Immutable Revision Record

Once created, a definition revision must not be mutated by ordinary commands.

Normal writes append new records.

Only privileged:

* restore;
* full clear;
* exact durable replacement

may replace collection authority.

---

# 15. Canonical Definition Contract

Implement Task 5.11's settled conceptual shape:

```text id="5.12-definition-contract"
GoalMeasurementDefinitionV1 {
    version: 1
    id: GoalMeasurementDefinitionId
    goalId: GoalId
    revision: number
    status: "active" | "inactive"
    policyRef: {
        id: string
        version: number
    }
    config: GoalMeasurementPolicyConfig
    effectiveFrom: string
    createdAt: string
    fingerprint: string
}
```

Treat this as conceptual.

Use exact project type conventions.

Do not add fields without justification.

---

# 16. `createdAt`

Define according to Task 5.11.

Preferred:

* first lineage revision records lineage creation time;
* subsequent revision records may retain lineage creation time or each record's own creation time depending on finalized ADR wording.

Audit the ADR/result and implement consistently.

Do not invent `updatedAt` unless required.

---

# 17. `effectiveFrom`

Required canonical ISO instant.

V1 semantics:

```text id="5.12-effective-from"
effectiveFrom
    = system-recorded save time
```

No backdating.

No user-authored effective date.

Use injected clock.

---

# 18. Strict Effective-Time Ordering

For one definition lineage:

```text id="5.12-time-order"
revision N+1 effectiveFrom
    >
revision N effectiveFrom
```

Equal or decreasing times must not create ambiguous epochs.

Handle deterministic test clocks carefully.

---

# 19. Epoch Identity

No separate epoch ID.

Canonical epoch identity:

```text id="5.12-epoch-id"
(definitionId, revision)
```

---

# 20. Epoch Interval

For revision N:

```text id="5.12-epoch-interval"
start = revisionN.effectiveFrom
end   = revisionN+1.effectiveFrom
```

with interval semantics explicitly defined.

Recommended:

```text id="5.12-half-open"
[start, nextStart)
```

Latest revision is open-ended.

---

# 21. Active/Inactive Status

Exactly:

```text id="5.12-status"
active
inactive
```

No other measurement lifecycle states.

`inactive` means:

> no current measurement is defined during this epoch.

It does not delete the lineage or config.

---

# 22. Current Definition Resolution

Implement pure resolution.

Given:

```text id="5.12-current-resolution"
goalId
asOf
```

resolve:

1. lineage for Goal;
2. highest revision with `effectiveFrom <= asOf`;
3. if none:

   * notDefined;
4. if selected revision inactive:

   * notDefined;
5. if active:

   * return exact revision.

Do not use current Goal.measurementPolicyRef.

---

# 23. Historical Revision Query

Support exact lookup by:

```text id="5.12-revision-lookup"
definitionId
revision
```

Future observations depend on this.

---

# 24. Lineage History Query

Support ordered revision history by Goal.

Deterministic revision order.

Clone-isolated.

---

# 25. Policy Registry

Implement a closed built-in registry.

At minimum registry responsibilities:

* identify supported policy `(id, version)`;
* validate config;
* normalize config;
* expose policy semantic identity;
* expose compatible unit rules;
* provide canonical fingerprint config representation;
* reserve future derivation hook without implementing Progress.

Do not put Progress calculation in registry in 5.12 unless needed only as an inert future interface—prefer not to.

---

# 26. First Policy Identity

Implement exactly:

```text id="5.12-policy"
manualQuantityTarget@1
```

Use repository representation:

```text id="5.12-policy-ref"
{
    id: "manualQuantityTarget",
    version: 1
}
```

or canonical equivalent.

---

# 27. Manual Quantity Config

Implement exactly:

```text id="5.12-manual-config"
{
    targetValue,
    unitId
}
```

No:

* baseline;
* direction field;
* custom label;
* precision;
* unit conversion option;
* target date;
* description.

---

# 28. Direction Semantics

Policy semantics are fixed:

```text id="5.12-direction"
increaseTowardTarget
```

Do not store direction in config.

---

# 29. Baseline Semantics

No baseline.

Mathematical origin is zero.

This is not a baseline observation.

Do not add baseline-related code.

---

# 30. Canonical Decimal String Type

Implement canonical unsigned decimal strings.

Requirements from Task 5.11:

* JSON-safe string;
* no exponent notation;
* no leading `+`;
* no negative sign;
* no unnecessary leading zeros;
* no unnecessary trailing fractional zeros;
* no trailing decimal point;
* no NaN/Infinity concepts;
* maximum length 100 characters;
* deterministic canonical representation.

Define exact grammar.

---

# 31. Decimal Canonical Examples

Expected valid examples should include canonical forms such as:

```text id="5.12-decimal-valid"
0
1
12
12.5
0.25
100000
```

Reject noncanonical equivalents such as:

```text id="5.12-decimal-invalid"
01
1.
1.0
1.500
+1
-1
1e3
.5
```

unless the Task 5.11 ADR defines a different canonical grammar.

Test extensively.

---

# 32. Target Validation

For `manualQuantityTarget@1`:

```text id="5.12-target"
targetValue > 0
```

`0` is invalid as target.

Target must use canonical decimal grammar.

---

# 33. Over-Target Future Observations

Policy registry must not encode a maximum of targetValue.

Future observation values may exceed target.

Do not clamp.

---

# 34. Built-In Unit Registry

Implement exactly the accepted V1 units:

```text id="5.12-units"
count
words
pages
miles
kilometers
minutes
```

Each needs:

* stable semantic ID;
* user-readable label or metadata as appropriate;
* compatibility identity;
* optional display precision guidance if architecture requires it.

Do not introduce other units.

---

# 35. Unit Validation

Policy config `unitId` must be one of built-in V1 IDs.

Unknown unit in known policy config is invalid/protected according to authority validation rules.

---

# 36. No Unit Conversion

No helper may convert:

```text id="5.12-no-conversion"
miles ↔ kilometers
minutes ↔ hours
```

in V1.

Exact unit identity is required for future observation compatibility.

---

# 37. Custom Units

Do not implement.

---

# 38. Policy-Specific Config Validation

Separate:

```text id="5.12-structural-v-semantic"
generic definition structure
```

from:

```text id="5.12-policy-semantic"
known-policy config semantics
```

A known policy with malformed config is invalid authority.

---

# 39. Unknown Policy Preservation

Critical.

A structurally valid definition using unknown future policy must be preserved as unsupported rather than automatically treated as corrupt—if and only if the Task 5.11 ADR/source contract provides a generic JSON-safe config shape sufficient to validate it structurally.

Implement that distinction exactly.

Do not pretend to interpret unknown config.

---

# 40. Unknown Policy Query Behavior

Current-definition query may return an explicit unsupported result or definition + support status according to architecture.

Do not normalize to notDefined.

---

# 41. Semantic Fingerprint

Implement deterministic fingerprint for each revision.

Per Task 5.11, include semantic inputs:

* record/domain version;
* status;
* policy ID;
* policy version;
* normalized config;
* effective measurement semantics.

Exclude:

* definition ID;
* Goal ID unless ADR requires relationship in semantics;
* revision;
* timestamps;
* other lifetime identity.

Follow accepted ADR precisely.

---

# 42. Fingerprint Stability

Same semantics:

```text id="5.12-fingerprint-same"
same policy/config/status
```

should produce same semantic fingerprint even across:

* different IDs;
* different revisions;
* different timestamps;

if accepted 5.11 semantics say so.

Mandatory tests.

---

# 43. Fingerprint Difference

Changing any material semantic input must change fingerprint:

* target;
* unit;
* policy version;
* active/inactive state.

---

# 44. Authority Envelope

Implement:

```text id="5.12-envelope"
GoalMeasurementDefinitionAuthorityV1 {
    version: 1
    definitions: GoalMeasurementDefinitionV1[]
}
```

or canonical equivalent reconstructed from collection.

Ordering must be deterministic.

---

# 45. Canonical Ordering

Recommended:

1. Goal ID;
2. definition ID;
3. revision.

Use stable serialization.

---

# 46. Duplicate Detection

Reject authority containing:

* duplicate physical revision keys;
* multiple definition IDs for same Goal;
* duplicate revisions;
* conflicting revision order;
* overlapping/equal epoch times;
* broken lineage.

---

# 47. Goal Referential Integrity

Every definition lineage must reference an existing Goal.

Normal create requires current Goal exists.

Restore target validation requires every definition Goal exists in the restored Goal authority.

Do not drop orphan definitions.

---

# 48. Goal Lifecycle Independence

Creating/revising/stopping measurement must not:

* complete Goal;
* archive Goal;
* reactivate Goal;
* change Goal title;
* change Goal links;
* alter Goal target date.

---

# 49. Goal `measurementPolicyRef`

Do not use it as measurement authority.

No Measurement Definition command should derive its config from that field.

No current-definition query should fall back to it.

Keep it roundtrippable as deprecated compatibility metadata only.

---

# 50. No Goal V2

Do not change Goal schema/version solely for Task 5.12.

---

# 51. No HistoricalPlan Change

Do not add definition identity/revision to HistoricalPlan in 5.12.

Manual quantity Progress will not depend on plan publications.

---

# 52. No ExecutionHistory Change

Do not modify ExecutionHistory.

---

# 53. Create Command

Implement:

```text id="5.12-create-command"
createMeasurementDefinition
```

Requirements:

* Goal exists;
* no historical lineage already exists for Goal;
* policy supported for normal authoring;
* config valid and canonical;
* allocate fresh definition ID;
* revision = initial revision;
* status = active;
* allocate one save-time instant;
* calculate fingerprint;
* append durably;
* notify once according to scheduler.

---

# 54. Create Against Existing Historical Lineage

If a Goal has an inactive historical lineage:

do not create a second definition ID.

Use restart semantics.

Return explicit command result.

---

# 55. Revise Command

Implement:

```text id="5.12-revise-command"
reviseMeasurementDefinition
```

Requirements:

* lineage exists;
* expected current revision matches;
* current revision active unless architecture permits revision from inactive through restart only;
* normalized policy/config/status semantic comparison;
* material change appends next active revision;
* same definition ID;
* new effectiveFrom;
* new fingerprint;
* prior revision untouched.

---

# 56. Expected Revision Guard

Every semantic mutation should accept expected revision.

Stale mutation must not overwrite a newer definition revision.

---

# 57. No-Op Revision

If normalized requested policy/config/status equals current revision:

* return deterministic no-op/success equivalent;
* no revision;
* no clock;
* no ID;
* no persistence;
* no subscriber notification.

Mandatory test.

---

# 58. Stop Measuring Command

Implement:

```text id="5.12-stop"
stopMeasuringGoal
```

or canonical architecture name.

Requirements:

* current active revision exists;
* expected revision matches;
* append next revision;
* same policy/config copied exactly;
* status = inactive;
* new effectiveFrom;
* fingerprint reflects inactive state.

---

# 59. Stop When Already Inactive

Deterministic no-op or semantic result according to conventions.

Do not append another inactive revision merely because command repeated.

---

# 60. Restart Measurement Command

Implement:

```text id="5.12-restart"
restartMeasurement
```

Requirements:

* lineage exists;
* current revision inactive;
* expected revision matches;
* append new active revision;
* same definition ID;
* policy/config may:

  * default to prior config;
  * or accept explicit new valid config according to accepted architecture;
* always new epoch, even identical semantics.

Do not reopen old revision.

---

# 61. Restart Same Config

Even if semantically identical to prior active revision before stop:

```text id="5.12-restart-epoch"
inactive → active
```

must append a new active revision because epoch semantics changed.

---

# 62. Policy Change Through Revision

Allow normal supported-policy transition only through revision.

Since V1 has one supported authorable policy, most actual normal policy changes may be impossible today.

Infrastructure should remain version-capable.

Do not invent another policy.

---

# 63. Command Result Contract

Use deterministic result types.

Distinguish at minimum:

* created/revised/stopped/restarted;
* no-op;
* Goal not found;
* definition not found;
* definition already exists;
* stale revision;
* invalid policy/config;
* unsupported policy for authoring;
* protected;
* initializing/busy;
* persistence failure.

Follow repository style.

---

# 64. Query — Current Definition

Implement:

```text id="5.12-current-query"
getCurrentMeasurementDefinition(goalId, asOf?)
```

Semantics must make clear whether omitted `asOf` means current runtime wall-clock or an explicit application-supplied time.

Preferred architecture:

* pure resolver always receives explicit time;
* application helper may inject current time where appropriate.

Avoid hidden time dependency in core.

---

# 65. Query — Exact Revision

Implement exact clone-isolated lookup.

---

# 66. Query — History

Return full retained lineage history.

Do not omit inactive revisions.

---

# 67. Query — Unsupported Policy

Historical/exact query must still return structurally valid unsupported definitions with explicit support status.

Do not erase them.

---

# 68. Clone Isolation

All returned:

* envelopes;
* definitions;
* configs;
* query results

must be structurally isolated.

---

# 69. Persistence Location

Implement as independent IndexedDB authority.

No localStorage.

---

# 70. Physical Database Upgrade

If new object store required, perform additive DB upgrade.

Record old/new physical version.

Preserve:

* ExecutionHistory;
* HistoricalPlan;
* restore stores;
* all existing authority.

---

# 71. Physical Record Key

Use a key supporting immutable revision identity.

Conceptually:

```text id="5.12-key"
[definitionId, revision]
```

or equivalent.

If Goal ID participates in index rather than primary key, document.

---

# 72. Goal Index

Add derived/indexed lookup by Goal ID if useful.

Do not create persistent current-definition pointer unless needed.

---

# 73. Current Definition Derivation

Current definition is resolved from revisions.

No mutable pointer is authoritative.

---

# 74. Durable Write Semantics

Normal mutation appends one revision durably.

Command must not report durable success before persistence settles according to existing durable-authority conventions.

---

# 75. Append Atomicity

Revision append must be atomic.

A failed write must not expose a durable/runtime revision mismatch.

---

# 76. Protection Model

Protect entire Measurement Definition authority on:

* storage read failure;
* malformed envelope/record;
* duplicate/broken lineage;
* orphan Goal;
* epoch overlap/order violation;
* malformed known-policy config;
* invalid fingerprint if verified on ingress according to design.

Do not silently drop malformed revisions.

---

# 77. Unknown Policy vs Protection

Structurally valid unsupported policy:

```text id="5.12-unsupported"
unsupported
```

not:

```text id="5.12-corrupt"
protected
```

Malformed known-policy config remains protection-worthy.

---

# 78. Bootstrap Ordering

Measurement Definition initialization must occur after/with Goal availability sufficient to validate Goal references.

Audit bootstrap dependency.

Do not expose definition authority ready before Goal referential validation is possible.

---

# 79. Readiness Dependency

If Goal is protected:

Measurement Definition cannot truthfully complete referential validation.

Determine whether it remains:

* initializing;
* protected dependent-authority;
* another existing governed state.

Use narrowest truthful behavior.

---

# 80. Mutation Admission

All definition mutations use centralized shared mutation admission.

Reject while:

* initializing;
* protected;
* restore/full-clear transaction active;
* authority otherwise non-writable.

---

# 81. Durability States

Follow existing durable authority conventions:

* unknown;
* durable;
* pending;
* storageFailure;

or exact current types.

Do not invent parallel durability semantics.

---

# 82. Retry

If persistence retry is supported by chosen authority pattern, implement consistently.

No UI yet.

---

# 83. Complete Runtime Snapshot

Capture all private runtime state needed for:

* shared transaction commit;
* abort;
* restore;
* notification deferral.

At minimum likely includes:

* exact authority;
* desired state;
* ingress/readiness;
* durability;
* protection evidence where current patterns require it.

---

# 84. Exact Runtime Install

Install exact snapshot without:

* persistence;
* IDs;
* revisions;
* clock allocation;
* command behavior;
* Goal mutation;
* notifications outside scheduler.

---

# 85. Notification Scheduler

Route Measurement Definition notifications through shared scheduler.

---

# 86. Runtime Participant Registration

Register Measurement Definition as participant seven.

Do not hardcode:

```text id="5.12-not-seven-final"
participantCount === 7
```

as permanent architecture.

Update iterable participant unions/registries.

---

# 87. Cross-Read Coherence

Add transaction tests proving:

* existing subscriber can read committed Measurement Definition state;
* Measurement Definition subscriber can read committed existing authority;
* abort restores exact seven-participant runtime state where relevant.

---

# 88. Existing Participant Semantics

Do not change semantics of:

* Active;
* Profiles;
* PlanDecision;
* ExecutionHistory;
* HistoricalPlan;
* Goal.

---

# 89. Full Clear Participation

Measurement Definition must join governed full clear.

After clear:

```text id="5.12-empty-authority"
{
    version: 1,
    definitions: []
}
```

or canonical equivalent.

---

# 90. No Resurrection

After full clear and restart:

no old definition revisions return.

Mandatory test.

---

# 91. Full-Clear Goal Integrity

Goal and Measurement Definition must settle coherently.

No orphan definition may survive after Goal authority clears.

---

# 92. Backup Version

Introduce latest canonical complete Backup:

> **Backup V5**

unless repository numbering changed before implementation.

---

# 93. Backup V5 Authority Set

V5 must include complete durable authority:

```text id="5.12-v5"
Active
Profiles
PlanDecision
ExecutionHistory
HistoricalPlan
Goal
MeasurementDefinition
```

---

# 94. Backup V5 Definition Payload

Serialize complete definition authority:

* every revision;
* exact IDs;
* Goal refs;
* revision;
* status;
* policy ref;
* normalized config;
* effectiveFrom;
* createdAt;
* semantic fingerprint.

Do not serialize runtime readiness/durability state.

---

# 95. Derived Progress Boundary

No Progress result in Backup.

---

# 96. Legacy Backup Compatibility

Preserve support for:

* V1;
* V2;
* V3;
* V4.

---

# 97. Legacy Translation

Complete restore from V4 or earlier into measurement-aware DayFrame:

```text id="5.12-legacy-backup"
MeasurementDefinition authority
    = canonical empty
```

Do not preserve existing local definitions through a whole-authority legacy restore.

Do not infer definitions from deprecated Goal refs.

---

# 98. Backup V5 Validation

Validate:

* exact authority structure;
* definition IDs/revisions;
* Goal referential integrity;
* policy/config structure;
* semantic fingerprints;
* epoch ordering.

---

# 99. Backup Export Protection

If Measurement Definition authority is protected/unavailable:

canonical complete Backup export must not silently omit it.

Follow existing whole-backup rules.

---

# 100. Restore Participant

Add Measurement Definition to generic restore composition.

No Measurement Definition-specific restore mechanism.

---

# 101. Restore Target Validation

Before mutation validate:

* all definition records;
* canonical lineage;
* Goal references against target Goal authority;
* epoch ordering;
* policy/config structural validity;
* known-policy semantic validity;
* fingerprint integrity.

---

# 102. Unknown Policy Restore

Structurally valid unsupported policy definitions should restore intact if accepted architecture allows them.

They remain unsupported at runtime.

---

# 103. Restore Staging

Measurement Definition participates in:

* target staging;
* recovery staging;
* fingerprints;
* source recheck.

---

# 104. Restore Commit

Measurement Definition durable target must commit coherently with other participants under existing durable restore guarantees.

If combined IndexedDB replacement currently handles ExecutionHistory/HistoricalPlan only, extend correctly.

Do not perform a best-effort out-of-band definition write after restore commit.

---

# 105. Combined IndexedDB Replacement

Audit whether Measurement Definition must join the existing atomic IndexedDB replacement transaction.

Strong default:

> Yes, if the restore infrastructure's durable-side atomicity model expects all IndexedDB authority to replace coherently.

Extend the combined physical mutation narrowly.

---

# 106. Restore Runtime Install

After durable verification, install Measurement Definition runtime authority through shared runtime authority transaction.

---

# 107. Restore Rollback

If restore fails after Measurement Definition durable mutation:

rollback must restore exact recovery-side definition authority coherently.

---

# 108. Startup Recovery

Interrupted restore involving Measurement Definition must resume through existing journal semantics.

No new journal stage.

---

# 109. Restore Fingerprint

Whole-authority transaction fingerprints now include Measurement Definition.

Participant semantic fingerprint must preserve:

* all historical revisions;
* identity;
* semantics;
* ordering.

This is distinct from each revision's semantic fingerprint.

---

# 110. Backup/Restore Unknown Policy

Add tests preserving unsupported future-policy definitions exactly.

Do not interpret.

---

# 111. Goal Referential Restore Failure

Backup/restore target containing definition referencing absent Goal:

must reject/protect before live mutation.

Do not drop orphan definition.

---

# 112. HistoricalPlan Boundary

No changes.

---

# 113. ExecutionHistory Boundary

No changes.

---

# 114. Goal Activity Boundary

No Goal Activity changes.

Measurement Definition does not alter Goal Activity classification.

---

# 115. Schedule Boundary

No scheduling effect.

Measurement definitions must not enter:

* schedule generation;
* Preview;
* friction;
* placement;
* PlanDecision.

---

# 116. Preview Staleness

Definition mutation must not stale Preview.

Mandatory regression.

---

# 117. Goal UI Boundary

Do not expose definition controls in GoalSection yet.

---

# 118. Summary Boundary

No Progress/definition UI.

Goal Activity remains unchanged.

---

# 119. Profile Boundary

Profiles do not own Measurement Definitions.

Profile save/load does not mutate definition authority.

---

# 120. Goal Lifecycle Boundary

Goal complete/archive/reactivate does not mutate Measurement Definitions.

Mandatory regression.

---

# 121. Goal Rename Boundary

Rename does not mutate definitions.

Goal ID relationship remains valid.

---

# 122. Goal Full-Clear Boundary

Full clear is the only normal destructive removal of all definitions.

---

# 123. Deprecated Goal Policy Ref Boundary

Existing Goal records containing `measurementPolicyRef`:

* remain valid;
* Backup roundtrip intact;
* do not create definitions;
* do not affect current definition resolution;
* do not affect future Progress architecture.

Mandatory regression.

---

# 124. Creation With Legacy Goal Ref

If Goal has legacy `measurementPolicyRef` but no definition:

creating a definition must use explicit command policy/config.

Do not inherit automatically.

---

# 125. Revision Property Tests

Cover:

* first revision;
* target revision;
* unit revision;
* stop revision;
* restart revision;
* monotonic revision;
* exact identity retention;
* old revision immutability.

---

# 126. Epoch Property Tests

Cover:

* strict effective time;
* half-open resolution boundary;
* active→active revision;
* active→inactive;
* inactive→active;
* no overlap;
* query before first epoch;
* query at exact boundary;
* query after latest.

---

# 127. No-Op Property Test

Canonical-equivalent config cannot create another revision.

---

# 128. Decimal Validation Tests

Cover valid/invalid grammar comprehensively.

---

# 129. Decimal Fingerprint Tests

Canonical input must produce deterministic fingerprint.

No equivalent alternate string form should be accepted.

---

# 130. Unit Tests

Cover every V1 unit.

Reject unknown unit.

No conversion helper behavior.

---

# 131. Policy Registry Tests

Cover:

* supported manualQuantityTarget@1;
* invalid policy version;
* unknown future policy structural preservation;
* known policy invalid config.

---

# 132. Goal Integrity Tests

Cover:

* create for existing Goal;
* create for missing Goal;
* second lineage rejection;
* Goal rename unaffected;
* Goal lifecycle unaffected;
* profile load unaffected.

---

# 133. Persistence Reload Test

Create/revise/stop/restart.

Reinitialize authority.

Verify exact revision history and current resolution.

---

# 134. Protection Tests

Cover:

* malformed decimal;
* invalid unit;
* duplicate revision;
* revision gap if gaps prohibited;
* duplicate lineages for Goal;
* non-increasing effectiveFrom;
* orphan Goal;
* known-policy malformed config;
* storage read failure.

---

# 135. Unsupported Policy Test

Structurally valid unknown policy remains preserved/readable as unsupported rather than protection if architecture supports it.

---

# 136. Runtime Snapshot Tests

Exact capture/install.

No persistence side effects.

---

# 137. Runtime Abort Test

Shared authority transaction abort restores exact Measurement Definition runtime state.

---

# 138. Subscriber Cross-Read Test

After shared transaction commit, subscribers see coherent seven-participant authority.

---

# 139. Full-Clear Test

Definition revisions cleared with other authority.

No restart resurrection.

---

# 140. Backup V5 Roundtrip Test

Create:

* active definition;
* revised target;
* stop;
* restart.

Export V5 → replace/clear → restore.

Verify exact history.

---

# 141. Backup V4 Translation Test

Current definitions exist.

Restore V4 whole-authority backup.

Expected:

* existing six authorities restored per V4;
* Measurement Definition becomes canonical empty;
* no hybrid surviving definitions.

---

# 142. Backup V1–V3 Regression

Existing compatibility remains green.

---

# 143. Restore Rollback Test

Inject failure after Measurement Definition has entered durable target path.

Verify exact recovery authority across all participants.

---

# 144. Interrupted Startup Recovery Test

Persist restore state involving definitions.

Restart.

Verify deterministic forward/rollback under existing journal rules.

---

# 145. Goal Orphan Restore Test

Target Backup V5 with definition whose Goal is absent.

Must fail before live mutation.

---

# 146. Restore Unsupported Policy Test

Structurally valid unsupported policy survives restore exactly where architecture permits.

---

# 147. Scheduler Independence Test

Same scheduling authority with different measurement-definition authority:

```text id="5.12-scheduler-independence"
same Preview
```

Mandatory.

---

# 148. Preview Staleness Test

Create/revise/stop/restart measurement.

Existing Preview remains current.

---

# 149. Goal Activity Independence Test

Measurement-definition changes do not alter Goal Activity result for same Goal/HistoricalPlan/ExecutionHistory/query.

---

# 150. Goal Lifecycle Independence Test

Complete/archive/reactivate Goal.

Definition authority unchanged.

---

# 151. Deprecated Goal Ref Independence Test

Change/restore legacy Goal measurementPolicyRef without definition authority changes.

Definition query remains unaffected.

If current Goal APIs do not permit mutation, use fixtures/restore equivalence.

---

# 152. Canonical Fixtures

Create reusable fixtures for:

### Definition A

Goal + active manual quantity:

```text id="5.12-fixture-a"
50,000 words
```

### Definition B

```text id="5.12-fixture-b"
100 miles
```

### Revised Definition

Same ID, next revision, changed target.

### Stopped Definition

Inactive revision.

### Restarted Definition

New active revision.

### Unsupported Future Policy

Structurally valid unknown policy.

### Orphan Definition

Invalid authority fixture.

---

# 153. Property Invariants

Where practical prove:

### A

Same semantic revision → same semantic fingerprint.

### B

Different target/unit/status/policy version → different fingerprint.

### C

ID/timestamp difference alone does not change semantic fingerprint where accepted.

### D

Old revisions never mutate.

### E

Only one lineage per Goal.

### F

Only one effective revision at a time.

### G

Normalized no-op appends nothing.

### H

Restart creates new epoch.

### I

Goal lifecycle does not change definition authority.

### J

Profile replacement does not change definition authority.

### K

Schedule output is independent.

### L

Goal Activity output is independent.

### M

Backup/restore preserves exact revision history.

### N

Legacy restore clears definition authority.

### O

Full clear prevents resurrection.

---

# 154. Required Definition Contract Matrix

Produce:

| Field         | Required? | Authored/derived | Mutable after record creation? | Semantic fingerprint? |
| ------------- | --------: | ---------------- | -----------------------------: | --------------------: |
| version       |           |                  |                                |                       |
| id            |           |                  |                                |                       |
| goalId        |           |                  |                                |                       |
| revision      |           |                  |                                |                       |
| status        |           |                  |                                |                       |
| policyRef     |           |                  |                                |                       |
| config        |           |                  |                                |                       |
| effectiveFrom |           |                  |                                |                       |
| createdAt     |           |                  |                                |                       |
| fingerprint   |           |                  |                                |                       |

---

# 155. Required Command Matrix

Produce:

| Command          | Appends revision? | New epoch? | ID allocation? | Clock allocation? |
| ---------------- | ----------------: | ---------: | -------------: | ----------------: |
| create           |                   |            |                |                   |
| revise           |                   |            |                |                   |
| normalized no-op |                   |            |                |                   |
| stop             |                   |            |                |                   |
| repeated stop    |                   |            |                |                   |
| restart          |                   |            |                |                   |

---

# 156. Required Epoch Matrix

Produce:

| Revision sequence                 | Effective current state |
| --------------------------------- | ----------------------- |
| none                              |                         |
| active r1                         |                         |
| active r1 → active r2             |                         |
| active r1 → inactive r2           |                         |
| inactive r2 → active r3           |                         |
| query before r1                   |                         |
| query exactly at r2.effectiveFrom |                         |

---

# 157. Required Policy Matrix

Produce:

| Policy                        | Supported for authoring? | Config validation | Runtime interpretation |
| ----------------------------- | -----------------------: | ----------------- | ---------------------- |
| manualQuantityTarget@1        |                          |                   |                        |
| unknown future policy         |                          |                   |                        |
| known policy malformed config |                          |                   |                        |

---

# 158. Required Unit Matrix

Produce:

| Unit       | Supported? | Conversion allowed? |
| ---------- | ---------: | ------------------: |
| count      |            |                     |
| words      |            |                     |
| pages      |            |                     |
| miles      |            |                     |
| kilometers |            |                     |
| minutes    |            |                     |
| custom     |            |                     |
| unknown    |            |                     |

---

# 159. Required Authority Matrix

Produce:

| Authority             | Runtime participant | Backup V5 | Restore | Full clear |
| --------------------- | ------------------: | --------: | ------: | ---------: |
| Active                |                     |           |         |            |
| Profiles              |                     |           |         |            |
| PlanDecision          |                     |           |         |            |
| ExecutionHistory      |                     |           |         |            |
| HistoricalPlan        |                     |           |         |            |
| Goal                  |                     |           |         |            |
| MeasurementDefinition |                     |           |         |            |

---

# 160. Required Goal Interaction Matrix

Produce:

| Goal event         | Definition mutation? | Reason |
| ------------------ | -------------------: | ------ |
| rename             |                      |        |
| description edit   |                      |        |
| target date change |                      |        |
| complete           |                      |        |
| archive            |                      |        |
| reactivate         |                      |        |
| profile load       |                      |        |
| Goal clear         |                      |        |

---

# 161. Required Backup Matrix

Produce:

| Backup version | Measurement Definition payload | Restore result |
| -------------- | ------------------------------ | -------------- |
| V1             |                                |                |
| V2             |                                |                |
| V3             |                                |                |
| V4             |                                |                |
| V5             |                                |                |

---

# 162. Required Restore Matrix

Produce:

| Target condition                    | Result |
| ----------------------------------- | ------ |
| valid definitions + matching Goals  |        |
| no definitions                      |        |
| orphan Goal reference               |        |
| malformed known-policy config       |        |
| unknown supported-structural policy |        |
| duplicate lineage                   |        |
| overlapping epochs                  |        |

---

# 163. Required Protection Matrix

Produce:

| Condition           | Authority state | Mutation allowed? | Backup allowed? |
| ------------------- | --------------- | ----------------: | --------------: |
| initializing        |                 |                   |                 |
| ready               |                 |                   |                 |
| protected           |                 |                   |                 |
| persistence failure |                 |                   |                 |
| restore active      |                 |                   |                 |

---

# 164. Required Cross-Surface Matrix

Produce:

| Measurement action | Goal | Plan draft | Schedule | Summary Goal Activity |
| ------------------ | ---- | ---------- | -------- | --------------------- |
| create             |      |            |          |                       |
| revise             |      |            |          |                       |
| stop               |      |            |          |                       |
| restart            |      |            |          |                       |

Expected:

* Goal authored content unchanged;
* Plan draft unchanged;
* Schedule unchanged/not stale;
* Goal Activity unchanged.

---

# 165. Required Legacy Compatibility Matrix

Produce:

| Existing source                | Measurement-aware result |
| ------------------------------ | ------------------------ |
| Goal with no policy ref        |                          |
| Goal with legacy policy ref    |                          |
| Backup V4                      |                          |
| Backup V1–V3                   |                          |
| HistoricalPlan Goal policy ref |                          |
| Profile load                   |                          |

---

# 166. Required Product-Boundary Matrix

Produce:

| Capability                    | Task 5.12 |
| ----------------------------- | --------- |
| Measurement Definition domain |           |
| immutable revisions           |           |
| epochs                        |           |
| policy registry               |           |
| manualQuantityTarget@1        |           |
| decimal strings               |           |
| units                         |           |
| IndexedDB authority           |           |
| runtime participant           |           |
| full clear                    |           |
| Backup V5                     |           |
| restore                       |           |
| measurement UI                |           |
| Progress Observation          |           |
| Progress projection           |           |
| Progress UI                   |           |
| Recommendation                |           |
| adaptation                    |           |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 167. Required Architectural Invariant Assessment

Classify at least:

1. Measurement Definition is independent authored authority.
2. It stores no Progress result.
3. It belongs to one Goal.
4. one Goal has at most one lineage V1.
5. Goal may have no definition.
6. definition ID is opaque.
7. definition ID is never reused.
8. revision is monotonic.
9. revision records are immutable.
10. semantic edits append.
11. no-op edits do not append.
12. epochs are revision-implied.
13. no separate epoch ID exists.
14. effectiveFrom is system-recorded.
15. no backdating exists.
16. per-lineage effective times strictly increase.
17. epochs do not overlap.
18. current definition resolution is deterministic.
19. historical revision resolution is deterministic.
20. status is active/inactive only.
21. inactive means notDefined.
22. stop appends inactive revision.
23. repeated stop does not append.
24. restart appends active revision.
25. restart never reopens old epoch.
26. policy ID/version is explicit.
27. policy meaning is immutable per version.
28. registry is closed/built-in.
29. manualQuantityTarget@1 is first policy.
30. config contains targetValue and unitId only.
31. direction is fixed policy semantics.
32. baseline is absent.
33. target is positive.
34. target uses canonical decimal string.
35. decimal representation is deterministic.
36. noncanonical decimals are rejected.
37. decimal length is bounded.
38. V1 units are bounded built-ins.
39. custom units are absent.
40. unit conversion is absent.
41. values above target remain valid future evidence.
42. definition semantic fingerprint is deterministic.
43. fingerprint excludes lifetime identity where governed.
44. config is clone-isolated.
45. old revisions remain retained.
46. no hard delete exists.
47. Goal must exist for definition.
48. orphan definition is invalid.
49. Goal lifecycle does not alter definition.
50. profile load does not alter definition.
51. Goal legacy measurement ref is non-operative.
52. no Goal V2 is introduced.
53. HistoricalPlan is unchanged.
54. ExecutionHistory is unchanged.
55. Goal Activity is unchanged.
56. scheduling is unchanged.
57. definition mutations do not stale Preview.
58. authority uses IndexedDB.
59. authority has explicit version.
60. malformed authority is protected.
61. unknown policy differs from corruption.
62. readiness is explicit.
63. mutation admission is centralized.
64. durability is explicit.
65. runtime snapshot is complete.
66. exact install has no side effects.
67. notification uses shared scheduler.
68. Measurement Definition joins runtime authority transaction.
69. participant architecture does not assume seven is final.
70. Measurement Definition joins full clear.
71. no resurrection after clear.
72. Backup V5 contains Measurement Definition.
73. Backup V5 contains all revision history.
74. derived Progress is absent from Backup.
75. V4 restore creates empty definition authority.
76. V1–V3 remain supported.
77. legacy Goal refs do not fabricate definitions.
78. restore validates Goal referential integrity.
79. restore stages Measurement Definition.
80. restore source-rechecks Measurement Definition.
81. restore commits it coherently.
82. restore rollback restores it coherently.
83. startup recovery includes it.
84. unsupported policy can survive restore where structurally valid.
85. observation authority is not implemented.
86. Progress projection is not implemented.
87. measurement UI is not implemented.
88. Progress UI is not implemented.
89. no recommendation exists.
90. no adaptation exists.
91. no pace/on-track semantics exist.
92. no formula DSL exists.
93. no machine learning exists.
94. focused validation is green.
95. canonical validation is green.
96. no unresolved stop condition remains.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Stop-condition violation.

---

# 168. Stop Conditions

Stop and report if:

* existing Goal IDs cannot safely anchor definition lineage;
* one-lineage-per-Goal cannot be enforced without Goal schema ownership;
* immutable revision records cannot fit current collection infrastructure;
* effective epochs cannot be made deterministic;
* the shared injected clock cannot guarantee/order revision effective times;
* canonical decimal strings cannot be validated/fingerprinted deterministically;
* unknown-policy preservation cannot be separated from malformed authority;
* Goal referential integrity cannot be validated during bootstrap/restore;
* participant seven cannot join runtime transaction coherently;
* full clear cannot include Measurement Definition coherently;
* Backup V5 cannot represent exact immutable revision history;
* restore cannot atomically/coherently replace Measurement Definition with existing durable authority;
* legacy Backup translation would require fabricating definitions;
* Goal.measurementPolicyRef would remain a competing source of truth;
* implementation requires HistoricalPlan changes;
* implementation requires ExecutionHistory changes;
* implementation requires Progress observations;
* implementation requires Progress projection;
* implementation requires measurement UI.

Do not weaken immutable-history or authority boundaries to avoid a stop condition.

---

# 169. Likely Files

Likely areas include:

```text id="5.12-likely-files"
domain / measurement types
measurement policy registry
decimal validation
unit registry
measurement definition authority surface
IndexedDB storage
runtime authority composition
restore participants
Backup
full clear
tests / fixtures
governance
```

Do not assume exact filenames before audit.

---

# 170. Test Strategy

Use layered tests.

### Core/domain

* decimal validation;
* unit registry;
* policy registry;
* definition validation;
* fingerprints;
* revision/epoch resolution.

### Authority

* create;
* revise;
* no-op;
* stale revision;
* stop;
* restart;
* Goal integrity;
* protection.

### Persistence

* reload;
* additive DB upgrade;
* append durability;
* failure handling.

### Runtime

* snapshot;
* exact install;
* notification;
* commit/abort cross-read.

### Full clear

* seven-participant behavior;
* no resurrection.

### Backup/restore

* V5;
* V4 translation;
* older compatibility;
* rollback;
* startup recovery;
* orphan Goal rejection;
* unsupported-policy preservation.

### Boundaries

* Goal lifecycle;
* profile;
* scheduling;
* Preview staleness;
* Goal Activity.

---

# 171. Focused Validation

Run focused suites covering at least:

* decimal/unit/policy registry;
* definition core;
* definition authority;
* runtime transaction;
* persistence;
* full clear;
* Backup V5;
* restore/recovery;
* scheduling independence;
* Goal Activity independence.

Record exact file/test counts.

---

# 172. Full Validation

Before completion run:

```bash id="5.12-validation"
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
* bundle advisory;
* diff result.

If a transient failure occurs:

* record it;
* investigate;
* rerun canonical suite;
* do not claim completion until clean.

---

# 173. Manual Validation

No measurement UI exists.

No browser walkthrough is required.

If existing Backup/full-clear UI behavior changes due to Backup V5, perform a bounded manual check only where supported.

Otherwise state:

> Manual measurement workflow validation not applicable; no measurement UI exists.

---

# 174. Governance

On success update minimally:

* Task 5.12 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* `DECISIONS.md` only if implementation introduces an enduring refinement beyond the accepted 5.11 ADR.

Do not rewrite the ADR casually.

Do not claim Progress implemented.

---

# 175. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.12_IMPLEMENT_MEASUREMENT_DEFINITION_V1_DURABLE_AUTHORITY_MANUAL_QUANTITY_POLICY_REGISTRY_AND_BACKUP_V5_INTEGRATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.11 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Domain Placement
7. Definition ID
8. Definition Contract
9. Authority Envelope
10. One-Lineage Rule
11. Revision Model
12. Immutable Records
13. Epoch Identity
14. Effective-From
15. Epoch Resolution
16. Active/Inactive Status
17. Policy Registry
18. Manual Quantity Policy
19. Config Contract
20. Decimal Representation
21. Decimal Validation
22. Unit Registry
23. Unit Validation
24. No Conversion
25. Custom-Unit Boundary
26. Fingerprint
27. Goal Referential Integrity
28. Goal Policy-Ref Boundary
29. Create Command
30. Revise Command
31. No-Op
32. Revision Guard
33. Stop Command
34. Restart Command
35. Queries
36. Clone Isolation
37. Persistence
38. Database Upgrade
39. Physical Record Model
40. Readiness
41. Protection
42. Unknown Policy
43. Durability
44. Mutation Admission
45. Runtime Snapshot
46. Exact Runtime Install
47. Notification Scheduler
48. Runtime Participant Seven
49. Cross-Read Coherence
50. Existing Participant Preservation
51. Full Clear
52. Anti-Resurrection
53. Backup V5
54. Backup V5 Definition Payload
55. Legacy V1–V4 Compatibility
56. Legacy Translation
57. Backup Protection
58. Restore Participant
59. Restore Target Validation
60. Restore Goal Integrity
61. Restore Staging
62. Combined IndexedDB Replacement
63. Restore Commit
64. Runtime Install
65. Rollback
66. Startup Recovery
67. Restore Fingerprints
68. HistoricalPlan Boundary
69. ExecutionHistory Boundary
70. Goal Activity Boundary
71. Scheduler Boundary
72. Preview Staleness
73. Goal UI Boundary
74. Summary Boundary
75. Profile Boundary
76. Goal Lifecycle Boundary
77. Deprecated Goal Ref Regression
78. Tests Added/Changed
79. Canonical Fixtures
80. Property Invariants
81. Focused Validation
82. Full Validation
83. Manual Validation
84. Governance Updates
85. Deviations
86. Discoveries
87. Deferred Work
88. Definition Contract Matrix
89. Command Matrix
90. Epoch Matrix
91. Policy Matrix
92. Unit Matrix
93. Authority Matrix
94. Goal Interaction Matrix
95. Backup Matrix
96. Restore Matrix
97. Protection Matrix
98. Cross-Surface Matrix
99. Legacy Compatibility Matrix
100. Product-Boundary Matrix
101. Architectural Invariant Assessment
102. Stop-Condition Assessment
103. Architectural Alignment Assessment
104. Recommended Next Task
105. Final Completion Determination

---

# 176. Completion Criteria

Task 5.12 is complete only when:

* Measurement Definition V1 exists as independent durable authored authority;
* one Goal may have zero or one definition lineage in V1;
* definition IDs are opaque, stable, never reused, and preserved through Backup/restore;
* every semantic revision is immutable;
* revisions are monotonic per lineage;
* ordinary edits never mutate historical revisions;
* semantic edits append exactly one new revision;
* normalized no-op edits append nothing and allocate no clock/ID;
* `(definitionId, revision)` is the exact measurement epoch identity;
* effectiveFrom uses injected save-time semantics;
* backdating is absent;
* epoch boundaries are deterministic and non-overlapping;
* active/inactive are the only definition statuses;
* stop measurement appends inactive revision;
* restart appends a new active revision rather than reopening history;
* historical revisions are retained indefinitely in V1;
* manualQuantityTarget@1 exists as the only authorable V1 policy;
* its config contains only targetValue and unitId;
* targetValue is a positive canonical unsigned decimal string;
* canonical decimal grammar is deterministic and strictly validated;
* invalid/noncanonical numeric strings are rejected;
* decimal strings are bounded for resource safety;
* built-in units are exactly count, words, pages, miles, kilometers, and minutes unless implementation evidence requires documented correction;
* custom units are absent;
* implicit unit conversion is absent;
* policy direction is fixed to increaseTowardTarget;
* no baseline exists;
* future values above target remain semantically permitted;
* policy registry performs deterministic config validation/normalization;
* structurally valid unsupported policies are distinct from malformed known-policy authority according to the accepted architecture;
* semantic fingerprints are deterministic and cover the agreed semantic inputs;
* identity/timestamp fields do not contaminate semantic fingerprint where Task 5.11 excludes them;
* every definition references an existing Goal;
* orphan Goal references are rejected/protected rather than dropped;
* Goal's legacy measurementPolicyRef remains roundtrippable but non-operative;
* no definition is fabricated from that legacy field;
* no Goal V2 migration occurs;
* create/revise/stop/restart commands use semantic result contracts and expected revisions;
* stale revisions cannot overwrite current semantics;
* exact revision/history/current-definition queries are deterministic and clone-isolated;
* Measurement Definition uses independent IndexedDB persistence;
* any physical DB upgrade is additive and preserves existing authority;
* immutable physical records reload exactly;
* authority has explicit readiness/protection/durability semantics;
* malformed authority never becomes empty silently;
* unsupported policy remains semantically distinct from corruption;
* mutation admission uses the centralized gate;
* runtime snapshot captures every state required for exact transaction abort/restore;
* exact runtime install performs no persistence, allocation, timestamps, commands, or unrelated side effects;
* notifications use the shared scheduler;
* Measurement Definition joins the generalized runtime authority transaction as participant seven;
* the architecture does not assume seven is final;
* commit and abort cross-read coherence includes Measurement Definition;
* all prior participant semantics remain unchanged;
* Measurement Definition joins full clear;
* no definition revision resurrects after clear/restart;
* canonical Backup evolves to V5;
* Backup V5 contains complete seven-authority durable state;
* Backup V5 preserves all immutable definition revisions exactly;
* derived Progress is absent from Backup;
* Backup V1–V4 remain supported inputs;
* complete V4-and-earlier restore translates Measurement Definition authority to canonical empty;
* pre-existing local definitions never survive a legacy whole-authority restore as a hybrid;
* legacy Goal policy refs do not fabricate definitions;
* protected Measurement Definition authority cannot be silently omitted from canonical complete export;
* Measurement Definition joins generic restore target/recovery staging;
* source recheck includes Measurement Definition;
* restore verifies Goal referential integrity before mutation;
* restore preserves structurally valid unsupported-policy definitions where architecture allows;
* restore rejects orphan/malformed target authority before live mutation;
* durable commit includes Measurement Definition coherently with existing IndexedDB authorities;
* runtime target installation includes Measurement Definition through shared transaction;
* rollback restores exact recovery-side definition authority;
* interrupted-startup recovery includes Measurement Definition without a new restore mechanism;
* whole-authority fingerprints include definition history;
* HistoricalPlan schema/semantics remain unchanged;
* ExecutionHistory schema/semantics remain unchanged;
* Goal Activity semantics/output remain unchanged;
* measurement-definition mutations have no scheduling effect;
* measurement-definition mutations do not stale Preview;
* Goal lifecycle edits do not mutate Measurement Definition;
* Profile load does not mutate Measurement Definition;
* no measurement configuration UI is introduced;
* no Progress Observation authority is introduced;
* no Progress projection is introduced;
* no Progress UI is introduced;
* no Recommendation, RecommendationDecision, adaptation, pace, on-track state, baseline policy, decrease-target policy, formula DSL, arbitrary custom unit, unit conversion, external integration, Goal score, or machine-learning behavior is introduced;
* focused tests pass;
* lint, typecheck, full tests, build, and `git diff --check` pass;
* governance records Measurement Definition as implemented durable substrate while observations and Progress remain deferred;
* no unresolved identity, epoch, policy, numeric, Goal-integrity, persistence, transaction, Backup, restore, protection, or semantic stop condition remains.

---

# 177. Recommended Next Task

If Task 5.12 completes successfully:

> **Task 5.13 — Progress Observation V1 Architecture and Durable Authority**

Its purpose should be to finalize and implement the separate correction-capable evidence ledger that records manually observed quantities against exact Measurement Definition revisions.

It should settle and implement:

* observation ID;
* exact definition binding;
* Goal binding;
* observedAt vs recordedAt;
* absolute quantity values;
* unit compatibility;
* correction/revision semantics;
* retraction if required;
* as-of resolution;
* protection;
* IndexedDB;
* runtime authority participation;
* Backup evolution beyond V5 if observation durability ships in the same task;
* restore/full clear;
* no Progress projection yet.

Do not combine Observation authority and Progress calculation unless the architecture audit proves the observation substrate trivial enough to do safely.

---

# 178. Final Implementation Principle

> **Task 5.12 should make the meaning of measurement durable before DayFrame records a single measured value.**

---

# 179. Final Completion Statement

**Task 5.12 is complete when DayFrame implements Goal Measurement Definition V1 as a seventh independent, versioned, protected, durable authored authority whose one-per-Goal lineage consists of immutable monotonic revision records; when each revision forms an exact non-overlapping measurement epoch identified by `(definitionId, revision)` and governed by system-recorded save-time `effectiveFrom`; when semantic edits append revisions rather than rewriting history, normalized no-op edits allocate and persist nothing, stopping measurement appends an inactive revision, restarting appends a new active epoch, and old revisions are retained without normal hard deletion; when the built-in closed policy registry recognizes `manualQuantityTarget@1` with exactly `targetValue` and `unitId`, fixed increase-toward-target semantics, no baseline, no formula system, no direction config, no custom units, and no implicit conversion; when target and future quantity semantics use canonical bounded unsigned decimal strings and the accepted built-in V1 unit identities; when definition semantic fingerprints are deterministic and separated from lifetime identity; when every definition references an existing Goal, Goal's existing measurement-policy reference remains non-operative compatibility metadata rather than competing authority, no definitions are fabricated from legacy Goal state, and no Goal schema migration is introduced; when create, revise, stop, restart, exact-revision, history, and current-definition operations enforce expected revisions, deterministic epoch resolution, clone isolation, Goal integrity, unsupported-policy versus malformed-authority distinction, and centralized mutation admission; when Measurement Definition persists in its own additive IndexedDB authority, has explicit readiness/protection/durability behavior, participates in shared runtime snapshots, exact installation, deferred notifications, commit/abort coherence, and generalized participant registration without assuming seven is final; when full clear removes all definition history without resurrection; when canonical Backup evolves to V5 containing complete seven-authority state and all definition revisions, V1–V4 remain governed legacy inputs whose whole-authority translation yields explicit empty Measurement Definition authority, and protected definitions cannot be silently omitted; when restore stages, source-rechecks, validates, commits, verifies, installs, rolls back, and startup-recovers Measurement Definition through the existing durable cross-storage restore architecture while rejecting orphan Goal references and preserving structurally valid unsupported future-policy definitions according to the accepted model; when HistoricalPlan, ExecutionHistory, Goal Activity, Profiles, Goal lifecycle, schedule generation, Preview staleness, Planner Goal UX, and Summary Goal Activity remain semantically unchanged; when no measurement UI, Progress Observation authority, Progress projection, Progress percentage, Goal score, pace, on-track state, recommendation, adaptation, baseline policy, decrease-target policy, formula language, arbitrary unit system, implicit conversion, external integration, or machine-learning behavior is introduced; when focused and canonical validation are green; when governance truthfully records the durable measurement-definition substrate as complete while Progress observations and Progress itself remain deferred; and when no unresolved identity, revision, epoch, policy, unit, decimal, Goal-integrity, persistence, runtime-transaction, full-clear, Backup, restore, protection, or historical-reproducibility stop condition remains.**
