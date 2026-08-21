# Task 2.34 — Implement PlanDecision V1 Durable Surface, Validation, and Store Authority

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded durable-authority implementation task.

Task 2.34 implements the independently persisted `PlanDecision V1` authority defined by Task 2.33.

It includes:

* concrete decision types;
* `PlanDecisionId`;
* strict validation;
* independent V1 durable envelope;
* dedicated storage key;
* collection loading;
* deterministic same-target replacement;
* store-owned acceptance;
* store-owned removal;
* dedicated accessor/subscription;
* dedicated durability status;
* desired durable condition;
* persistence retry;
* protected ingress;
* entry-level quarantine;
* explicit recovery primitives;
* full-clear integration;
* focused and repository-wide regression coverage.

It does **not** implement PlanDecision replay into schedule generation, decision application to Preview, Accept UI, stale-decision UI, Backup V3, execution/history, or any change to scheduling semantics.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 2.33 is complete and accepted;
6. review the Task 2.33 result before implementation;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.34_IMPLEMENT_PLANDECISION_V1_DURABLE_SURFACE_VALIDATION_AND_STORE_AUTHORITY_RESULT.md`

If implementation demonstrates that persistence and replay must be introduced atomically for correctness, stop and report rather than broadening scope.

---

# 2. Purpose

Task 2.33 established `PlanDecision V1` as:

> independently persisted, explicitly accepted, single-occurrence planning authority.

It defined four V1 kinds:

* `placeOccurrence`;
* `omitOccurrence`;
* `setOccurrenceDuration`;
* `setOccurrencePriority`.

Each decision:

* has its own opaque identity;
* targets exactly one `DurableOccurrenceReference V1`;
* stores semantic intent rather than Preview or SuggestedFix snapshots;
* remains distinct from authored setup;
* survives Preview regeneration;
* is retained when stale;
* is explicitly removable;
* is deterministically superseded by a newer accepted choice for the same occurrence;
* belongs on an independent durable surface.

Task 2.34 makes that durable authority real.

It does **not yet make generation obey the decision**.

---

# 3. Governing Architectural Decisions

The following are fixed by Task 2.33 and must not be reopened:

1. PlanDecision is accepted planning authority;
2. Try remains Preview-only;
3. V1 is single-occurrence;
4. every V1 decision targets `DurableOccurrenceReference V1`;
5. supported kinds are:

   * `placeOccurrence`;
   * `omitOccurrence`;
   * `setOccurrenceDuration`;
   * `setOccurrencePriority`;
6. one current decision exists per semantic target;
7. a new accepted decision for that target replaces the old record;
8. stale valid decisions are retained;
9. invalid entries are quarantined;
10. PlanDecision is outside `DayFrameState`;
11. PlanDecision has its own durable surface;
12. Active V2 remains unchanged;
13. Profile V2 excludes decisions;
14. Backup V2 excludes decisions;
15. no replay is implemented in this task.

---

# 4. Architectural Objective

After Task 2.34:

```text id="plandecision-layer"
PlanDecision V1
    ↓
independent store-owned runtime collection
    ↓
strict validation
    ↓
independent durable envelope
    ↓
dedicated persistence / durability / retry
```

and:

```text id="plandecision-accept"
fresh accepted semantic intent
    ↓
validate target/reference
    ↓
construct PlanDecision V1
    ↓
replace same-target decision atomically
    ↓
runtime decision authority advances
    ↓
attempt durable write
```

but not yet:

```text id="no-replay"
PlanDecision
    ↓
schedule generation
```

That remains Task 2.35.

---

# 5. Required Initial Audit

Before changing code, inspect:

* current store construction;
* `DayFrameState`;
* store accessors/subscriptions;
* active durability model;
* profile durability model;
* desired durable condition representations;
* retry paths;
* protected ingress;
* source recheck;
* quarantine handling;
* clear/reset;
* `DurableOccurrenceReference V1`;
* current SuggestedFix application;
* current Preview staleness protections;
* backup/profile storage independence.

Document the narrowest way to add a fourth store-owned durable authority surface without contaminating the existing ones.

---

# 6. PlanDecision Core Module

Add a dedicated core/domain module for PlanDecision.

Likely location:

`code/src/core/decisions/planDecision.ts`

or equivalent.

The module should own:

* V1 types;
* constants;
* validator;
* clone helper;
* semantic target key;
* semantic equality where required.

Do not place decision domain logic in UI or persistence modules.

---

# 7. PlanDecision Version

Implement:

```ts
PLAN_DECISION_VERSION = 1
```

independent from:

* `DurableOccurrenceReference`;
* decision-surface envelope;
* Active;
* Profile;
* Backup.

---

# 8. `PlanDecisionId`

Introduce a branded opaque decision ID.

Requirements:

* canonical lowercase UUID-v4;
* graph-wide unique inside current decision collection;
* generated only for accepted new decision records;
* never derived from target;
* never reused merely because target/kind match.

Use the existing cryptographic identity pattern where appropriate.

---

# 9. Decision ID Allocator

Provide one authoritative allocator abstraction for decision IDs.

Requirements:

* cryptographically strong UUID-v4;
* test-injectable;
* no `Math.random`;
* no timestamp-derived ID;
* no target hashing.

Do not reuse `SourceIncarnationId` type even if the encoding is identical.

---

# 10. Concrete V1 Union

Implement the Task 2.33 conceptual union.

At minimum:

```ts
type PlanDecisionV1 =
  | PlaceOccurrenceDecisionV1
  | OmitOccurrenceDecisionV1
  | SetOccurrenceDurationDecisionV1
  | SetOccurrencePriorityDecisionV1;
```

Each must contain:

* `version`;
* `id`;
* `kind`;
* `target`;
* `payload`;
* `acceptedAt`;
* `provenance`.

---

# 11. `placeOccurrence`

Required payload:

```ts
{
  userDayDate: LocalDateString;
  startTime: TimeString;
}
```

This stores exact accepted user-day-relative local placement intent.

Do not store:

* absolute timestamp;
* scheduled block ID;
* duration snapshot;
* end time unless contractually necessary.

---

# 12. `omitOccurrence`

Required payload is semantically empty.

Use a stable serializable shape consistent with repository conventions.

Do not use `null` versus `{}` arbitrarily; choose and validate one canonical representation.

---

# 13. `setOccurrenceDuration`

Required payload:

```ts
{
  durationMinutes: number;
}
```

Validate legal positive integer bounds based on existing scheduling/domain constraints.

Do not persist “reduce by N.”

Persist exact accepted duration.

---

# 14. `setOccurrencePriority`

Required payload:

```ts
{
  priority: 1 | 2 | 3 | 4 | 5;
}
```

Persist the exact accepted effective priority.

---

# 15. Provenance Type

Implement:

```ts
type PlanDecisionProvenance =
  | { source: "user" }
  | {
      source: "suggestedFix";
      suggestedAction:
        | "moveBlock"
        | "skipBlock"
        | "reduceDuration"
        | "changePriority";
    };
```

Do not persist:

* SuggestedFix ID;
* friction ID;
* UI message;
* source button label;
* Preview block snapshot.

---

# 16. `acceptedAt`

Require canonical UTC ISO-8601 timestamp.

Validate strictly enough to reject malformed durable input.

Do not use it for:

* record identity;
* target conflict authority;
* replay ordering.

---

# 17. Exact Key Validation

Each decision kind must accept exactly its permitted fields.

Reject:

* missing keys;
* extra keys;
* kind/payload mismatch;
* wrong payload fields;
* cross-kind contamination.

Use strict structural validation.

---

# 18. Target Validation

Each decision target must be a valid `DurableOccurrenceReference V1`.

Use Task 2.32 validation.

Do not accept:

* runtime occurrence ID;
* raw `OccurrenceIdentity`;
* malformed reference;
* unsupported reference version as a valid replayable decision.

---

# 19. Unsupported Reference Version

If a decision entry has a structurally recognizable but unsupported future durable-reference version:

* classify the entry unsupported/quarantinable;
* preserve raw;
* do not reinterpret;
* do not replay.

Do not treat it as malformed V1.

---

# 20. PlanDecision Validator

Implement a pure strict validator producing outcomes such as:

* `valid`;
* `invalid`;
* `unsupportedVersion`;
* `unsupportedTargetVersion`.

Exact result naming may follow repository conventions.

Validation must clone returned valid data.

---

# 21. Decision Semantic Equality

Implement semantic equality for PlanDecision records if useful for testing/retry.

Distinguish:

## record identity

same `PlanDecisionId`.

## semantic equivalence

same version, kind, target, payload, acceptedAt, provenance.

Do not collapse different IDs into the same record identity.

---

# 22. Canonical Semantic Target Key

Task 2.33 selected:

> one current decision per occurrence.

Implement a stable semantic conflict key from the target reference.

Do not use:

* object identity;
* `JSON.stringify` on arbitrary insertion order;
* Preview/runtime ID.

Prefer a canonical structured encoder based on validated target fields.

---

# 23. Target Key Stability

The same semantic `DurableOccurrenceReference` must produce the same decision target key across:

* clone;
* JSON roundtrip;
* restart;
* object key ordering.

Direct tests required.

---

# 24. Decision Collection Semantics

The runtime collection represents current durable planning authority.

Requirements:

* unique decision IDs;
* at most one current valid decision per semantic target key;
* stale valid decisions remain present;
* quarantined invalid entries remain separately preserved;
* collection order does not determine authority.

---

# 25. Collection Runtime Representation

Choose a store-owned runtime representation.

Potential:

```ts
type PlanDecisionCollectionState = {
  decisions: PlanDecisionV1[];
  quarantinedDecisions: QuarantinedPlanDecision[];
};
```

or equivalent.

Keep outside `DayFrameState`.

---

# 26. Store Ownership

`createDayFrameStore` should own the runtime PlanDecision surface.

Expose dedicated accessors:

* `getPlanDecisions()`;
* `subscribePlanDecisions(...)`.

Do not append decisions to existing `getState()` snapshots.

---

# 27. Dedicated Subscription

PlanDecision changes must notify PlanDecision subscribers.

They should not trigger ordinary `DayFrameState` subscribers unless another existing state mutation also occurs.

This preserves authority separation.

---

# 28. Dedicated Durability Status

Introduce a dedicated PlanDecision durability status.

Follow existing factual durability principles.

Do not reuse:

* active durability;
* profile durability.

Likely states should align with established store durability conventions.

---

# 29. Desired Durable Condition

PlanDecision surface needs its own desired condition:

* latest decision snapshot; or
* absence where clear/abandon requires it.

It must remain outside `DayFrameState`.

---

# 30. PlanDecision Durable Envelope

Implement an independent envelope:

```ts
{
  app: "DayFrame",
  surface: "planDecisions",
  version: 1,
  decisions: [...]
}
```

If quarantine requires extra current-envelope fields, justify them.

Do not add decisions to Active V2.

---

# 31. Envelope Version

The surface envelope version is also V1 initially, but remains conceptually independent from `PLAN_DECISION_VERSION`.

If named separately, use a separate constant.

Do not assume they must increment together forever.

---

# 32. Storage Key

Introduce the dedicated current key recommended by Task 2.33:

`dayframe-plan-decisions-v1`

or repository-convention equivalent.

No V0 key exists.

---

# 33. No Historical Decision Migration

There is no prior durable PlanDecision format.

Startup states:

1. no decision key → healthy empty collection;
2. valid V1 → adopt;
3. malformed/invalid V1 → protected or quarantine as governed;
4. unsupported future version → protected.

No migration from V0.

---

# 34. Envelope Validation

Validate:

* app;
* surface;
* version;
* decisions collection;
* entry IDs;
* semantic target uniqueness;
* entry structure.

Do not accept Active/Profile/Backup envelopes.

---

# 35. Entry-Level Quarantine

When the envelope is valid and individual entries can be isolated safely:

* valid nonconflicting decisions load;
* invalid/unsupported entries are quarantined;
* raw entry preserved;
* no silent loss.

Reuse Profile V2 quarantine lessons.

---

# 36. Quarantine Reasons

At minimum distinguish:

* invalid decision;
* unsupported decision version;
* unsupported target-reference version;
* duplicate decision ID;
* conflicting semantic target key.

Do not over-fragment diagnostics.

---

# 37. Duplicate Decision ID Policy

If two entries share a decision ID:

* do not silently merge;
* deterministically quarantine enough entries to restore a valid loaded set.

Define which entry, if any, remains active.

Preferred:

* first valid encountered remains;
* later duplicate quarantined;

or another deterministic policy.

Document and test.

---

# 38. Duplicate Target Conflict Policy

If durable input contains two valid decisions with different IDs but same semantic target key:

* no latest-wins inference;
* deterministic quarantine is required.

Because acceptedAt is not replay authority.

Choose a deterministic preservation policy and document it.

---

# 39. Quarantine Raw Preservation

Preserve the original raw decision entry where feasible.

Do not retain only a lossy normalized error representation.

---

# 40. Quarantine Handle

If an invalid entry lacks a usable unique decision ID, provide a quarantine-local stable handle.

Do not confuse it with:

* PlanDecisionId;
* DurableOccurrenceReference;
* source ID;
* source incarnation.

---

# 41. Quarantine Runtime Access

Expose enough store-owned access for future recovery/UI:

* list/count quarantine;
* export raw entry;
* remove entry.

Minimal support may be implemented now if required by the durable-surface recovery contract.

---

# 42. Whole-Surface Protected Ingress

If the decision envelope itself is:

* malformed JSON;
* wrong app/surface;
* unsupported envelope version;
* structurally uninterpretable;

protect the raw durable source.

Do not silently adopt an empty collection.

---

# 43. Ordinary Writes During Protection

While whole decision ingress is protected:

* `acceptPlanDecision` must be blocked before runtime mutation;
* `removePlanDecision` must be blocked;
* retry must not overwrite protected raw data unless explicitly authorized.

Mirror the safety learned from Profile V2.

---

# 44. Protected Source Evidence

Retain:

* raw source;
* key/surface identity;
* reason;
* enough evidence for source recheck.

Keep outside `DayFrameState`.

---

# 45. Protected Source Recheck

Implement or prepare explicit store-owned recheck.

Before destructive recovery:

* reread exact key;
* compare with protected evidence;
* reject `sourceChanged`.

Use existing source-recheck patterns.

---

# 46. Recovery Replacement

Provide an explicit recovery action:

> Replace the protected PlanDecision checkpoint with the current valid runtime decision collection.

Requirements:

* source recheck;
* serialize;
* write;
* reread;
* validate;
* verify;
* clear protection only on success;
* durability becomes durable.

---

# 47. Recovery Abandonment

Provide explicit abandonment:

> Discard protected decision authority and establish an authoritative empty decision surface.

Requirements:

* source recheck where appropriate;
* remove/neutralize old key;
* establish current empty authority;
* clear protection only after durable success;
* restart remains empty.

---

# 48. Raw Export

If existing recovery infrastructure supports read/export primitives cleanly, expose exact raw protected decision source and quarantined entries.

No UI required.

Do not mutate state on export.

---

# 49. Acceptance API

Implement conceptual Task 2.33 store action:

`acceptPlanDecision(...)`

The actual input should be semantic intent, not a caller-built arbitrary durable record if possible.

The store/domain boundary should own:

* decision ID allocation;
* `acceptedAt`;
* target validation;
* record construction;
* supersession.

---

# 50. Acceptance Input

Prefer a discriminated input such as:

```ts
type AcceptPlanDecisionInput =
  | {
      kind: "placeOccurrence";
      target: DurableOccurrenceReference;
      payload: ...;
      provenance: ...;
    }
  | ...
```

Do not let callers set:

* decision ID;
* version;
* acceptedAt arbitrarily.

Testing may use injected clocks/allocators.

---

# 51. Acceptance Target Requirement

Task 2.34 does not yet require the store to prove current Preview freshness unless the acceptance API is called by future UI.

However, it must at least:

* validate the reference;
* reject malformed/unsupported target;
* reject unsupported kind/payload.

If freshness enforcement belongs in a future orchestration layer, document that boundary.

Do not fake a Preview dependency into the persistence store solely because Task 2.33's eventual UI acceptance requires freshness.

---

# 52. Acceptance Target Resolution

Determine whether accepting a durable decision at store level must require the target to currently `resolved`.

Preferred:

> yes, an acceptance of new planning intent should target a currently resolvable occurrence.

Use `resolveDurableOccurrenceReference`.

If the target is stale:

* reject acceptance;
* do not persist a new stale decision intentionally.

This is distinct from loading an already-stored decision that later becomes stale.

---

# 53. Applicability Versus Acceptance

Task 2.34 does not implement full kind-specific replay applicability.

But acceptance can still validate minimum domain compatibility where cheap and authoritative.

At minimum:

* target family exists/resolves;
* duration positive/legal;
* priority legal;
* placement date/time canonical.

Work/manual kind capability validation deferred only if it truly requires replay-stage knowledge.

Document any deferred validation explicitly.

---

# 54. Acceptance Supersession

When accepting a new decision:

1. validate/resolve target;
2. construct new record with fresh decision ID;
3. compute target key;
4. remove existing current decision for that same target;
5. insert new decision;
6. produce one next coherent collection.

This is atomic in runtime.

---

# 55. New Decision ID On Supersession

Superseding decision receives a new `PlanDecisionId`.

Do not reuse the old record ID.

No supersession history is retained.

---

# 56. Acceptance Persistence Failure

Follow established durability semantics.

After a valid runtime acceptance:

* new decision collection is session authority;
* persistence may fail;
* durability records failure;
* desired condition retains latest collection;
* retry writes exact collection.

Do not roll back valid runtime decision authority solely because storage failed.

---

# 57. Acceptance Notifications

On runtime acceptance:

* PlanDecision subscribers notified once;
* decision durability subscribers notified according to persistence outcome;
* ordinary `DayFrameState` subscribers not notified.

No Preview regeneration occurs yet.

---

# 58. Acceptance Result

Return an explicit result containing at least:

* accepted/rejected;
* current cloned decision collection;
* decision record where accepted;
* durability outcome;
* rejection reason where expected.

Do not throw for expected validation/stale/protection conditions.

---

# 59. Rejection Reasons

At minimum consider:

* protectedDecisionIngress;
* invalidTarget;
* unsupportedTargetVersion;
* targetSourceMissing;
* targetLifetimeMismatch;
* targetOccurrenceMissing;
* invalidPayload;
* unsupportedDecisionKind;
* allocationFailure.

Exact shape may follow existing result conventions.

---

# 60. Remove API

Implement:

`removePlanDecision(decisionId)`

or equivalent.

Requirements:

* explicit current record identity;
* remove only that record;
* preserve all others/quarantine;
* persist next collection;
* notify decision subscribers;
* no authored/Preview mutation.

---

# 61. Remove Missing ID

Removing unknown ID is an expected no-op/rejection.

Define whether it:

* returns `notFound`;
* returns unchanged success.

Prefer explicit result.

No write should occur if collection is unchanged.

---

# 62. Remove Persistence Failure

Runtime removal remains session authority if write fails.

Retry writes latest desired collection.

---

# 63. Remove During Protected Ingress

Blocked before runtime mutation.

Do not overwrite protected source.

---

# 64. Accessor

Implement:

`getPlanDecisions()`

Return clone-isolated current valid decisions.

Do not include quarantined raw entries unless another dedicated accessor is used.

---

# 65. Subscription

Implement:

`subscribePlanDecisions(listener)`

Use cloned snapshots.

No mutable internal references.

---

# 66. Quarantine Accessor

Expose a dedicated accessor if useful:

`getQuarantinedPlanDecisions()`

or equivalent.

Keep raw preserved data isolated/cloned.

---

# 67. Durability Accessor

Implement a dedicated:

`getPlanDecisionDurabilityStatus()`

or a generalized surface-aware durability accessor if repository architecture already supports it cleanly.

Do not overload profile status.

---

# 68. Durability Subscription

Implement dedicated subscription.

No ordinary-state notification needed for durability-only changes.

---

# 69. Retry API

Implement:

`retryPlanDecisionPersistence()`

Requirements:

* if protected ingress exists, do not overwrite it;
* otherwise serialize latest desired decision collection;
* write current key;
* record factual outcome;
* on success durability becomes durable.

No decision IDs or acceptedAt values change.

---

# 70. Retry Exactness

Directly prove retry preserves:

* decision IDs;
* targets;
* payloads;
* acceptedAt;
* provenance.

No regeneration.

---

# 71. Startup Valid V1

Valid current envelope:

* adopt valid decisions;
* preserve decision IDs;
* preserve acceptedAt;
* preserve targets;
* quarantine none;
* no source-incarnation allocation;
* no decision-ID allocation.

---

# 72. Startup Stale Decisions

A structurally valid decision whose target no longer resolves is still a valid decision record.

Do not quarantine based on current target staleness.

Load it normally.

Stale/applicable status is derived later.

This is critical.

---

# 73. Startup Invalid Decisions

Structurally invalid decision entries are quarantined.

Do not treat staleness as invalidity.

---

# 74. Startup Unknown Decision Version Entry

If the envelope is known V1 but one entry advertises unknown decision record version:

* quarantine entry;
* load valid supported siblings.

---

# 75. Startup Unsupported DurableReference Entry

Likewise quarantine unsupported target-reference version.

---

# 76. Startup Duplicate Target

Deterministic quarantine.

No implicit newest-wins.

---

# 77. Startup Duplicate ID

Deterministic quarantine.

---

# 78. Whole Envelope Unsupported Version

Protect whole source.

Do not entry-quarantine an envelope whose schema version is unknown.

---

# 79. Whole Envelope Wrong Surface

Protect/reject as whole-source ingress.

Do not parse as PlanDecision.

---

# 80. Cross-Surface Envelope Rejection

Directly reject:

* Active V2;
* Profile V2;
* Backup V2;

if supplied under decision key.

---

# 81. Current Writer

After Task 2.34, the only production decision writer emits current V1 envelope.

No alternate legacy decision writer exists.

---

# 82. No Active V2 Change

Accept/remove/retry decision must not write Active V2.

Direct tests required.

---

# 83. No Profile V2 Change

Decision operations must not write Profile V2.

---

# 84. No Backup Change

No backup export/import code changes are authorized.

---

# 85. `DayFrameState` Isolation

Decision operations must not alter:

* authored setup;
* saved profiles;
* Preview.

`getState()` before/after acceptance should remain semantically identical.

---

# 86. Preview Isolation

Acceptance/removal does not:

* stale Preview;
* clear Preview;
* revise Preview;
* regenerate Preview.

Replay integration is explicitly deferred.

This may temporarily mean durable decisions exist without visible schedule effect.

That is acceptable and intentional for layering.

---

# 87. SuggestedFix Isolation

Do not modify SuggestedFix engine or current Try behavior.

No automatic conversion from SuggestedFix to PlanDecision yet unless an internal constructor helper is purely semantic and unused by UI.

---

# 88. Clear Integration

`clearLocalData()` must clear the PlanDecision durable surface once it exists.

Requirements:

* runtime decisions cleared;
* quarantine cleared;
* protected decision state cleared according to safe recovery semantics;
* key removed/authoritative absence established;
* desired condition reset;
* no decision resurrection on restart.

---

# 89. Clear Failure

If decision-key removal fails during full clear:

* clear result must truthfully report decision-surface durability failure;
* runtime clear semantics should remain consistent with established multi-surface clear policy.

Audit current clear result shape.

If it cannot represent a fourth surface without broad redesign, stop and report.

---

# 90. Active-Only Recovery Abandonment

Task 2.33 explicitly deferred the policy.

Task 2.34 must determine the narrow implementation behavior.

Preferred:

> active protected-checkpoint abandonment does not automatically delete independent PlanDecisions; they remain retained and become stale/sourceMissing against empty active authority.

This aligns with stale retention.

But full `clearLocalData()` deletes decisions.

Document and test.

---

# 91. Active Recovery Replacement

Retain decisions.

After active replacement, references may:

* still resolve;
* become stale;
* later reactivate.

No decision mutation occurs.

---

# 92. Profile Activation

Retain PlanDecisions.

No decision write.

Fresh active source incarnations naturally stale prior decisions.

Do not clear decision surface.

---

# 93. Backup V1 Import

Retain PlanDecisions.

Fresh source incarnations stale them.

---

# 94. Backup V2 Restore

Retain PlanDecisions.

Exact lifetime restoration may make stale decisions resolvable again.

No decision persistence change occurs.

---

# 95. Decision Surface And Profile Clear

If profile-only destructive recovery/abandonment occurs, decisions are unaffected.

Surfaces remain independent.

---

# 96. Decision Surface Recovery Replacement

Explicit recovery only for decision durable authority.

Must not write active/profile surfaces.

---

# 97. Decision Surface Recovery Abandonment

Establish authoritative empty decision collection.

No active/profile change.

Restart remains empty.

---

# 98. Anti-Resurrection

There is no V0 decision key, so initial V1 has no legacy-format resurrection problem.

However, after explicit abandonment/clear:

* stale bytes must not reactivate.

Ensure deletion/authoritative-empty semantics are robust.

If a marker is unnecessary because only one version exists, do not add one speculatively.

---

# 99. Persistence Verification

For protected recovery replacement, use write/reread/validate/verify before clearing protection.

For ordinary acceptance/removal, follow established runtime-authority durability semantics; verified reread is not necessarily required for every ordinary write unless existing persistence helpers already do so.

Keep these distinctions explicit.

---

# 100. Serializer

Implement dedicated PlanDecision envelope serialization.

Do not stringify store internals.

---

# 101. Clone Isolation

All runtime/durable boundaries must clone:

* decisions;
* target nested objects;
* payload;
* provenance;
* quarantine raw values as appropriate.

---

# 102. Input Mutation Protection

Acceptance must not retain mutable caller-owned target/payload references.

---

# 103. Validation Purity

Validator must not mutate input.

---

# 104. Persistence Projection

Durable decision envelope contains only decision authority and required quarantine representation if governed.

Exclude:

* Preview;
* authored setup;
* profiles;
* active durability;
* decision durability;
* desired condition;
* protected ingress status;
* replay results.

---

# 105. Quarantine Persistence Design

Choose whether current V1 envelope stores quarantined raw entries alongside valid decisions.

Preferred, based on Task 2.33:

> yes, if entry-level quarantine must survive unrelated writes without data loss.

If so, define explicit envelope shape, e.g.:

```ts
{
  app: "DayFrame";
  surface: "planDecisions";
  version: 1;
  decisions: [...];
  quarantinedDecisions: [...];
}
```

Do not silently discard raw invalid entries on the next valid acceptance.

---

# 106. Quarantine Envelope Semantics

If quarantined entries are stored:

* they are preserved raw user data;
* not PlanDecision authority;
* not replayable;
* removable only explicitly.

---

# 107. Save With Quarantine

Acceptance/removal of valid decisions must preserve quarantine.

---

# 108. Retry With Quarantine

Retry persists quarantine unchanged.

---

# 109. Quarantine Removal

Implement explicit removal if required to keep the surface operationally recoverable.

No UI necessary.

Removal:

* deletes one quarantine entry;
* preserves valid decisions;
* persists next envelope;
* no active/Preview effect.

---

# 110. Protected Raw Export

Implement a read-only accessor/export primitive if the existing recovery pattern warrants it.

No UI.

---

# 111. Quarantine Raw Export

Likewise if operationally appropriate.

---

# 112. Decision Collection Canonicalization

Normal runtime writes should use deterministic ordering for serialized decisions.

Suggested:

* canonical target key;
* then decision ID.

Quarantine ordering should be deterministic/stable as well.

This improves testability and verification.

Ordering does not determine authority.

---

# 113. Decision Acceptance Clock Injection

Inject a clock or acceptedAt provider for deterministic tests.

Do not allow arbitrary production caller timestamps.

---

# 114. Decision ID Collision

If allocator produces an ID already present:

* retry allocation a bounded number of times or reject;
* do not silently replace unrelated decision.

Choose a simple deterministic testing strategy.

---

# 115. Target-Key Collision Versus Supersession

Same target key is intentional supersession.

Same decision ID on unrelated target is identity collision and must be rejected.

---

# 116. Decision Acceptance Validation Matrix

Directly cover each kind:

## placeOccurrence

* valid target;
* valid date;
* valid time;
* malformed date/time rejected.

## omitOccurrence

* canonical empty payload.

## setOccurrenceDuration

* positive/legal integer;
* invalid values rejected.

## setOccurrencePriority

* only 1–5.

---

# 117. Target Family Support

Task 2.33 allows template/work/manual targets for all four kinds where semantically legal.

Task 2.34 should validate what can be determined without replay.

If current source types make a kind clearly impossible for a family, reject.

Do not invent scheduling capability semantics beyond evidence.

---

# 118. Stale Acceptance Test

Attempt to accept against:

* sourceMissing;
* lifetimeMismatch;
* occurrenceMissing.

All rejected with no runtime decision mutation and no write.

---

# 119. Valid Stale Load Test

Persist a valid decision, then change active authority so it becomes stale, restart.

Decision still loads normally.

This proves durable validity is not current applicability.

---

# 120. Profile Activation Retention Test

Create decision.

Activate profile.

Decision collection unchanged.

Reference now lifetime-mismatches when evaluated separately.

No decision write required.

---

# 121. Backup V1 Retention Test

Same pattern.

---

# 122. Backup V2 Reactivation Test

Create decision.

Change active graph to mismatch.

Restore exact Backup V2 lifetime.

Decision record remains unchanged and reference resolves again.

Task 2.34 need not replay it.

---

# 123. Active Restart Test

Decision durable collection survives restart exactly.

Targets remain clone/equality stable.

---

# 124. Acceptance Supersession Test

Accept decision A for target T.

Accept decision B for same target T.

Prove:

* A removed;
* B present;
* B new ID;
* exactly one current decision for T;
* no supersession history.

---

# 125. Cross-Kind Supersession Test

Accept move for T.

Accept omit for T.

Only omit remains.

This directly protects one-choice-per-target V1.

---

# 126. Different Target Coexistence Test

Decisions for different references coexist.

---

# 127. Remove Test

Remove one decision by ID.

Others remain.

---

# 128. Remove Persistence Failure Test

Runtime removal retained, durability failure recorded, retry writes latest collection.

---

# 129. Acceptance Persistence Failure Test

Runtime acceptance retained, durability failure recorded, retry preserves exact ID/time/payload.

---

# 130. Retry Test

No reallocation or reconstruction.

---

# 131. Whole-Surface Invalid JSON Test

Protected.

No ordinary acceptance/remove.

Raw preserved.

---

# 132. Unsupported Envelope Version Test

Protected.

No overwrite.

---

# 133. Cross-Surface Envelope Test

Protected/rejected.

---

# 134. Invalid Entry Quarantine Test

Valid sibling loads.

Invalid raw preserved.

---

# 135. Duplicate ID Quarantine Test

Deterministic outcome.

---

# 136. Duplicate Target Quarantine Test

Deterministic outcome.

---

# 137. Unsupported Decision Version Quarantine Test

Preserved.

---

# 138. Unsupported Target Version Quarantine Test

Preserved.

---

# 139. Save Preserves Quarantine Test

Accept valid new decision.

Quarantine unchanged.

---

# 140. Remove Quarantine Test

If implemented, explicit removal only.

---

# 141. Protected Replacement Test

Source recheck, verified write, protection clears on success.

---

# 142. Protected SourceChanged Test

Reject destructive replacement.

---

# 143. Protected Abandon Test

Empty decision authority established and survives restart.

---

# 144. Full Clear Test

Decisions, quarantine, and protected state cleared according to full-clear semantics.

Restart empty.

---

# 145. Active Abandon Retention Test

If adopted policy retains decisions:

* active abandonment resets active state;
* decision collection remains;
* decisions become stale;
* no decision persistence write caused solely by active abandonment.

---

# 146. Profile Recovery Independence Test

Profile protected recovery does not alter decision collection.

---

# 147. Active Durability Independence Test

Decision write failure does not change active durability.

---

# 148. Profile Durability Independence Test

Decision write failure does not change profile durability.

---

# 149. Decision Durability Independence Test

Active/profile writes do not change decision durability status.

---

# 150. `DayFrameState` Subscriber Isolation Test

Accept/remove decision:

* no ordinary state subscriber notification;
* decision subscriber fires;
* decision durability subscriber behaves appropriately.

---

# 151. Preview Preservation Test

Decision acceptance/removal leaves existing Preview byte/structure-equivalent.

No stale bit change.

---

# 152. Persistence Shape Test

Assert decision envelope contains exactly governed data.

No Active/Profile/Preview leakage.

---

# 153. JSON Roundtrip

Decision envelope roundtrips and validates identically.

---

# 154. No SourceIncarnation Allocation

Decision acceptance allocates only `PlanDecisionId`.

It must not allocate source incarnation.

---

# 155. No Replay

Search production code after implementation.

No schedule generator or preview-generation path consumes plan decisions.

---

# 156. No SuggestedFix Change

Current Try path remains unchanged.

---

# 157. No UI Change

No Accept button or decision-management UI.

---

# 158. Backup Completeness Warning

Because PlanDecision is now durable while Backup V2 excludes it, record the architecture limitation in the result.

If existing backup UI/docs claim complete durable-user-state backup, inspect whether wording must be corrected.

Do not implement Backup V3.

Only correct misleading claim if necessary.

---

# 159. Current Backup Behavior

Backup V2 restore may make retained local decisions applicable again because source lifetimes return.

This remains intended according to Task 2.33.

Do not modify backup code unless a factual compatibility test is required.

---

# 160. Future Backup V3 Requirement

Record as deferred required work:

> complete recovery of all durable planning authority will require Backup V3 or an explicitly governed multi-surface recovery package.

---

# 161. Decision Surface Recovery UX

No UI required yet.

Store/domain recovery APIs must be sufficient for a later UI task.

---

# 162. Expected Production Files

Likely changes:

* new `core/decisions/planDecision.ts`;
* new decision validator/tests;
* new `state/planDecisionPersistence.ts` or equivalent;
* `dayFrameStore.ts`;
* state/store types for decision-specific accessors/status;
* clear/recovery orchestration;
* focused state tests.

Keep modules separated where practical.

---

# 163. Reference Audit

Before completion, search for:

* PlanDecision symbols;
* decision key;
* DurableOccurrenceReference usage;
* Active/Profile/Backup serializers;
* state subscriptions;
* clear;
* retries;
* protected recovery.

Confirm no accidental replay or surface coupling.

---

# 164. Persistence Writer Audit

Expected:

| Surface       | Current writer          |
| ------------- | ----------------------- |
| Active        | Active V2               |
| Profile       | Profile V2              |
| Backup export | Backup V2               |
| PlanDecision  | PlanDecision surface V1 |

No writer should emit decisions into another surface.

---

# 165. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.34_IMPLEMENT_PLANDECISION_V1_DURABLE_SURFACE_VALIDATION_AND_STORE_AUTHORITY_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contract
4. Initial Store/Durability Audit
5. Files Changed
6. PlanDecision Module
7. Decision Version
8. PlanDecisionId
9. Decision ID Allocation
10. Concrete Decision Union
11. Kind Payloads
12. Provenance
13. acceptedAt
14. Strict Validation
15. Target Validation
16. Unsupported Reference Handling
17. Semantic Equality
18. Target Key
19. Collection Semantics
20. Store Ownership
21. Accessor / Subscription
22. Durability Status
23. Desired Durable Condition
24. Envelope
25. Storage Key
26. Startup Semantics
27. Whole-Surface Protection
28. Entry Quarantine
29. Duplicate-ID Policy
30. Duplicate-Target Policy
31. Quarantine Preservation
32. Protected Recheck
33. Recovery Replacement
34. Recovery Abandonment
35. Acceptance API
36. Acceptance Validation
37. Target Resolution At Acceptance
38. Supersession
39. Acceptance Persistence Failure
40. Acceptance Notifications
41. Removal API
42. Removal Persistence Failure
43. Retry
44. Restart
45. Stale Decision Loading
46. Profile Activation Retention
47. Backup V1 Retention
48. Backup V2 Reactivation
49. Full Clear
50. Active Abandonment Policy
51. Active/Profile Recovery Independence
52. DayFrameState Isolation
53. Preview Isolation
54. Quarantine Raw Export/Removal
55. Persistence Shape
56. Ordering / Canonicalization
57. Clone Isolation
58. Cross-Surface Envelope Rejection
59. Backup Completeness Limitation
60. Tests Added or Updated
61. Reference Audit
62. Persistence Writer Audit
63. No-Replay Audit
64. Architectural Alignment Assessment
65. Deviations
66. Discoveries and Deferred Work
67. Recommended Next Task
68. Focused Validation
69. Full Validation
70. Final Completion Determination

---

# 166. Required Matrices

## A. Decision Kind Matrix

| Kind | Target | Payload | Accepted now? | Replay implemented? |
| ---- | ------ | ------- | ------------: | ------------------: |

## B. Store Operation Matrix

| Operation | Decision runtime changes? | Durable write? | Preview changes? | Active state changes? |
| --------- | ------------------------: | -------------: | ---------------: | --------------------: |

Cover:

* accept;
* supersede;
* remove;
* retry;
* quarantine removal;
* protected replace;
* protected abandon;
* full clear.

## C. Ingress Matrix

| Input condition | Valid decisions loaded? | Quarantine? | Whole protection? |
| --------------- | ----------------------: | ----------: | ----------------: |

## D. Cross-Surface Lifecycle Matrix

| Operation | Decisions preserved? | Decision surface written? |
| --------- | -------------------: | ------------------------: |

Cover:

* profile activation;
* Backup V1 import;
* Backup V2 restore;
* active recovery replacement;
* active abandonment;
* full clear.

## E. Durability Matrix

| Event | Runtime authority advances? | Durability status | Desired condition |
| ----- | --------------------------: | ----------------- | ----------------- |

---

# 167. Validation Requirements

Run focused tests for:

* PlanDecision validator;
* target-key semantics;
* persistence envelope;
* startup valid/invalid/quarantine;
* acceptance all four kinds;
* stale acceptance rejection;
* supersession;
* removal;
* persistence failure/retry;
* protected ingress;
* recovery replacement/abandonment;
* clear;
* subscriber isolation;
* profile/backup retention;
* Preview isolation.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact file/test counts.

---

# 168. Completion Criteria

Task 2.34 is complete only when:

* concrete `PlanDecision V1` types exist;
* `PlanDecisionId` exists and is validated;
* decision ID allocation is store/domain-owned;
* all four decision kinds validate strictly;
* target must be valid `DurableOccurrenceReference V1`;
* acceptance rejects stale/unresolved targets;
* one current decision per semantic target is enforced;
* supersession creates a new decision ID;
* durable envelope exists;
* independent storage key exists;
* decisions remain outside `DayFrameState`;
* dedicated accessor/subscription exists;
* dedicated durability status exists;
* dedicated desired durable condition exists;
* valid startup rehydrates exact records;
* stale valid records load normally;
* invalid entries quarantine non-destructively;
* unsupported entries preserve raw data;
* duplicate IDs/targets are handled deterministically without silent merging;
* malformed/unsupported whole surface is protected;
* ordinary writes are blocked during whole-source protection;
* protected recovery is source-recheck safe;
* acceptance persists independently;
* runtime acceptance/removal remains authority after write failure;
* retry writes exact latest collection;
* acceptance/removal do not alter active/profile state or Preview;
* profile activation retains decisions;
* Backup V1 import retains decisions;
* Backup V2 restore retains decisions;
* active abandonment follows the explicitly chosen retention policy;
* full local clear clears decision authority;
* decision surface is clone-safe;
* no replay is implemented;
* no UI is implemented;
* no Active/Profile/Backup schema changes occur;
* full validation passes;
* result artifact is complete.

---

# 169. Explicit Non-Goals

Do **not**:

* implement replay;
* alter schedule generation;
* alter Preview generation;
* add Accept UI;
* add decision-management UI;
* change SuggestedFix;
* change Try behavior;
* modify `DurableOccurrenceReference V1`;
* modify `OccurrenceIdentity V1`;
* modify Active V2;
* modify Profile V2;
* modify Backup V2;
* implement Backup V3;
* add decision history;
* add supersession history;
* add execution history;
* auto-delete stale decisions;
* retarget stale decisions;
* make PlanDecision part of authored setup;
* make PlanDecision part of `DayFrameState`;
* persist derived applicability/replay status;
* perform unrelated refactors.

---

# 170. Stop Conditions

Stop and report if:

* independent decision durability cannot be added without broad store redesign;
* `clearLocalData()` cannot safely incorporate the fourth surface without changing established clear authority;
* current durability infrastructure cannot represent an additional independent surface cleanly;
* entry-level quarantine requires an incompatible envelope redesign;
* acceptance cannot validate current target without Preview authority;
* target-key canonicalization is not stable;
* Active/Profile/Backup flows unexpectedly depend on `DayFrameState` containing decisions;
* implementing store authority necessarily changes generation/replay;
* full-suite failures reveal an unrelated architecture defect.

Recommend the narrowest prerequisite or completion task.

---

# 171. Recommended Follow-On Boundary

If Task 2.34 completes successfully, the next task should implement **PlanDecision replay into schedule generation**, still without broad UI expansion.

Recommended:

> **Task 2.35 — Implement PlanDecision V1 Applicability Evaluation and Deterministic Schedule Replay**

That task should:

* derive applicability;
* resolve targets;
* apply omission/duration/priority before placement;
* enforce exact placement during placement;
* produce per-decision replay outcomes;
* integrate normal friction detection;
* preserve Try as Preview-only;
* leave decision persistence unchanged.

Accept UI should follow only after replay is proven.

---

# 172. Task Determination

**Authorized:** concrete `PlanDecision V1` domain types, decision ID/version validation, independent durable envelope/key, collection authority, store-owned acceptance/supersession/removal, dedicated persistence/durability/retry, protected ingress, entry quarantine, recovery operations, clear integration, cross-surface retention semantics, and direct regression coverage.

**Not authorized:** decision replay/application, Accept UI, scheduling changes, DurableOccurrenceReference changes, Active/Profile/Backup format changes, Backup V3, history, or unrelated refactoring.

The governing authority principle is:

> Task 2.34 makes accepted planning intent durable and independently owned; it does not yet make that intent alter the generated schedule.

---

# 173. Final Completion Statement

**Task 2.34 is complete when DayFrame has a concrete, independently versioned and persisted `PlanDecision V1` authority surface with strict decision/reference validation, canonical decision identity, one-current-decision-per-target supersession, store-owned acceptance and removal, dedicated clone-safe access/subscription, factual durability and retry, non-destructive entry quarantine, protected whole-source ingress and source-recheck-safe recovery, explicit full-clear and cross-surface retention semantics, and complete regression coverage; when valid stale decisions remain durable but are not silently retargeted; when acceptance/removal do not mutate authored state, Preview, profiles, or existing durable surfaces; when complete repository validation passes; and when no decision replay/application, scheduling change, Accept UI, Backup V3, history, or unrelated behavior is introduced.**
