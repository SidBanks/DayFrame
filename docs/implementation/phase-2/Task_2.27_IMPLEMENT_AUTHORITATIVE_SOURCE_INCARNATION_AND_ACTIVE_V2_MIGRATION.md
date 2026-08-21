# Task 2.27 — Implement Authoritative Source Incarnation and Active V2 Migration

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded implementation task.

This task implements the first incarnation-bearing authoritative runtime model and the independently versioned **Active V2** durable surface established by Task 2.26.

It includes:

* mandatory runtime source incarnation for all lifetime-bearing active authored sources;
* incarnation allocation driven by Task 2.25 lifecycle-operation authority;
* Active V2 serialization and validation;
* a distinct Active V2 storage key/envelope;
* guarded eager migration from Active V1;
* verified durable-write-before-adoption semantics;
* exact rehydration of established incarnation;
* migration/durability/recovery integration;
* focused and full regression coverage.

It does **not** implement Profile V2, Backup V2, DurableOccurrenceReference, PlanDecision persistence, or scheduling-engine changes.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.27_IMPLEMENT_AUTHORITATIVE_SOURCE_INCARNATION_AND_ACTIVE_V2_MIGRATION_RESULT.md`

If implementation demonstrates that Active V2 cannot be introduced without changing Profile or Backup formats atomically, stop the affected work and document the evidence rather than broadening the task.

---

# 2. Purpose

Task 2.24 defined what source lifetime means.

Task 2.25 made lifecycle operations explicit so DayFrame can distinguish:

* create;
* update;
* delete;
* delete/recreate;
* replace;

without guessing from source IDs or final snapshots.

Task 2.26 defined the durable contract:

* each lifetime-bearing active authored source receives mandatory `incarnationId`;
* incarnation is a canonical lowercase UUID v4;
* ordinary update preserves incarnation;
* creation/recreation/replacement allocates a new incarnation;
* Active V2 preserves incarnation across restart;
* legacy Active V1 establishes a forward-only baseline incarnation;
* Active V2 uses a distinct storage key and explicit envelope;
* V1→V2 migration must complete durably before V2 runtime adoption;
* old V1 remains protected until verified V2 persistence succeeds;
* profiles and backups evolve independently and are not part of this implementation task.

Task 2.27 implements that contract for the active authoritative surface.

---

# 3. Governing Architectural Decision

This task is governed by:

`docs/adr/ADR_SOURCE_INCARNATION_AND_DURABLE_FORMAT_EVOLUTION.md`

and by the completed Task 2.26 result.

The implementation must not reinterpret or weaken the accepted decision.

In particular:

* incarnation is opaque identity metadata;
* incarnation does not influence scheduling;
* incarnation is mandatory on current active lifetime-bearing sources;
* Profile V2 intentionally remains a separate future format;
* Backup V2 intentionally remains a separate future format;
* `OccurrenceIdentity` V1 remains runtime-only and unchanged;
* DurableOccurrenceReference remains deferred;
* PlanDecision persistence remains deferred.

---

# 4. Architectural Objective

After Task 2.27:

```text
ACTIVE RUNTIME AUTHORITY

block template
    id
    incarnationId

block recurrence
    id
    incarnationId

manual event
    id
    incarnationId

shift definition
    id
    incarnationId

shift cycle
    id
    incarnationId

cycle segment
    id
    incarnationId

sequence entry
    id
    incarnationId
```

and:

```text
Active V1
    ↓
validate / normalize
    ↓
allocate complete baseline incarnation graph
    ↓
construct Active V2
    ↓
validate
    ↓
serialize
    ↓
write distinct V2 key
    ↓
reread
    ↓
validate persisted V2
    ↓
ONLY THEN
adopt incarnation-bearing runtime authority
```

Ordinary Active V2 rehydration must restore exact incarnation values without rotation.

---

# 5. Source Kinds Requiring Incarnation

Implement mandatory incarnation on exactly the source kinds established by Task 2.26:

1. `BlockTemplate`
2. `BlockRecurrence`
3. `ManualCalendarEvent`
4. `ShiftDefinition`
5. `ShiftCycle`
6. `ShiftSegment`
7. `ShiftCycleSequenceDay`

Do not add incarnation to:

* scheduling preferences;
* preview-range configuration;
* Preview;
* friction;
* SuggestedFix;
* profiles as a future Profile V2 representation;
* backup V1;
* durability state;
* workflow-local drafts except as necessary to carry active source data.

---

# 6. Incarnation Type

Introduce a narrowly defined incarnation type.

Preferred semantic shape:

`SourceIncarnationId`

or equivalent branded string.

Requirements:

* serialized as lowercase canonical UUID v4;
* immutable scalar semantics;
* exact equality;
* no semantic parsing beyond validation;
* no timestamp/device/user/content meaning;
* clone by scalar copy.

Do not overload ordinary source `id`.

---

# 7. UUID Generation

Implement one authoritative incarnation allocator.

Requirements:

* cryptographically strong random UUID v4;
* browser-compatible;
* test-injectable or otherwise deterministically controllable in tests;
* no Math.random fallback;
* no timestamps;
* no local incrementing counter;
* no content hashing;
* no source-ID derivation.

Prefer the platform cryptographic UUID facility if supported by the repository/runtime target, with a narrowly testable abstraction.

Do not introduce an external dependency unless necessary.

---

# 8. Generator Injection / Testability

Tests must not depend on unpredictable UUID values.

The implementation should provide the narrowest defensible test seam.

Possible:

* injected allocator into store creation;
* module-level allocator abstraction with test override;
* explicit constructor dependency.

Do not expose arbitrary user-controlled incarnation assignment in production authoring APIs merely for test convenience.

---

# 9. Canonical UUID Validation

Validate incarnation as canonical lowercase UUID v4.

Reject:

* empty strings;
* malformed UUIDs;
* uppercase representation if the accepted contract requires canonical lowercase serialization;
* non-v4 UUIDs;
* arbitrary opaque strings;
* missing fields in Active V2.

Normalization must not silently lowercase or fabricate malformed V2 values.

A claimed Active V2 payload missing or misrepresenting incarnation is invalid V2.

---

# 10. Runtime Source Model

Update the active authoritative runtime source types so every in-scope source has mandatory incarnation.

Do not make runtime incarnation optional merely to ease migration.

Legacy compatibility belongs in raw V1 adapters, not in current authority.

Target principle:

```text
RAW V1
    no incarnation allowed/expected
        ↓
migration
        ↓
CURRENT ACTIVE RUNTIME
    incarnation mandatory
```

---

# 11. Raw Legacy Types

If necessary, introduce explicit legacy/raw source DTO types without incarnation.

Do not weaken current runtime types to represent historical durable shapes.

Prefer:

* V1 DTO/input types;
* V2 runtime/durable types;
* explicit conversion boundary.

Avoid `incarnationId?: string` on current active sources unless there is overwhelming executable evidence that no cleaner boundary is possible.

---

# 12. Active V2 Envelope

Implement an explicit Active V2 envelope.

The envelope must include enough information to establish:

* DayFrame identity;
* active durable surface;
* format version;
* complete authored active payload.

Exact field naming should follow repository conventions and the accepted ADR.

Do not serialize Preview, profiles, durability status, ingress status, or lifecycle-operation provenance.

---

# 13. Active V2 Key

Introduce the distinct Active V2 storage key authorized by Task 2.26.

Do not overwrite the V1 key as the migration commit step.

The old V1 key must remain available as protected historical recovery material after successful migration until a future evidence-based retirement task explicitly authorizes removal.

---

# 14. Key Authority Order

Once valid Active V2 exists:

**Active V2 is authoritative.**

Do not silently prefer V1 merely because V1 also remains present.

On startup:

1. inspect V2;
2. if valid V2 exists, use it;
3. do not remigrate from V1;
4. treat V1 as historical recovery material.

Exact handling of invalid V2 must follow the recovery contract below.

---

# 15. Active V2 Serializer

Implement a dedicated Active V2 serializer/projection.

It must include:

* scheduling preferences;
* preview range;
* incarnation-bearing shift definitions;
* incarnation-bearing shift cycles;
* nested segment and sequence incarnation;
* incarnation-bearing block templates;
* incarnation-bearing block recurrences;
* incarnation-bearing manual events.

It must exclude:

* savedProfiles;
* preview;
* durability state;
* desired durable condition;
* ingress/recovery status;
* lifecycle-operation transaction metadata;
* draft-local provenance.

---

# 16. Active V2 Validation

Implement validation sufficient to establish that a V2 active graph is safe current authority.

At minimum validate:

* envelope identity/version;
* existing authored semantic validity;
* every lifetime-bearing source has valid UUID v4 incarnation;
* no duplicate incarnation IDs across the active graph;
* existing source-ID uniqueness rules;
* existing nested scope rules;
* nested parent relationships;
* references remain resolvable under current authored validation.

Do not silently repair invalid V2 identity.

---

# 17. Global Incarnation Uniqueness

Task 2.26 adopted global uniqueness within one active graph.

Therefore the same incarnation must not appear on:

* two templates;
* template and recurrence;
* two manual events;
* cycle and segment;
* segment and sequence entry;
* any other unrelated active sources.

Direct validation coverage required.

---

# 18. Nested Source Identity

Nested segments and sequence entries retain their own `incarnationId`.

Their durable semantic lineage will later include parent cycle incarnation.

Task 2.27 need not yet construct DurableOccurrenceReference, but Active V2 must preserve enough identity for that later work.

Do not flatten nested source lifetime into parent identity alone.

---

# 19. Authoring Create Semantics

Connect Task 2.25 lifecycle-aware `create` operations to incarnation allocation.

For every newly created source:

* allocate one fresh incarnation;
* assign it at the authoritative creation boundary;
* ensure resulting runtime source is incarnation-complete before state becomes authoritative.

This applies to:

* explicit user-created sources;
* default-created sources committed through normal authoring;
* synthesized recurrence/sequence sources that Task 2.25 classified as create;
* manual-event create.

---

# 20. Authoring Update Semantics

Lifecycle-aware `update` must preserve exact incarnation.

The store/authoring boundary must reject or prevent accidental incarnation replacement during ordinary update.

An update must not:

* allocate a new token;
* accept caller-provided arbitrary replacement token;
* recompute token from contents.

Direct tests required.

---

# 21. Authoring Delete Semantics

Delete removes the active source carrying its incarnation.

No tombstone is created.

No retired-incarnation registry is required.

If a new source later uses the same readable ID, its create operation receives a new incarnation.

---

# 22. Delete/Recreate Semantics

Directly prove:

```text
source:
id = X
incarnation = A

delete X
create X

result:
id = X
incarnation = B
B != A
```

This must work through the lifecycle-aware Setup transaction established in 2.25.

Same readable ID must not preserve incarnation.

---

# 23. Replacement Semantics

Explicit lifecycle-aware `replace` must:

* retire prior lifetime;
* allocate a fresh incarnation for replacement;
* never reuse prior incarnation simply because source ID is unchanged.

If no current production replacement UI exists, cover the authoritative API semantics directly.

---

# 24. Manual-Event Incarnation

`mutateManualEvent` must become incarnation-aware.

Required:

## create

Fresh incarnation.

## update

Preserve exact incarnation.

## delete

Remove source.

## replace

Fresh incarnation.

Do not route manual-event authoring back through snapshot array inference.

---

# 25. Setup Transaction Incarnation

`commitAuthoredSetupTransaction` must consume Task 2.25 lifecycle provenance.

It must construct the candidate incarnation-bearing authoritative graph before delegating to final current-state validation/persistence.

The transaction must use explicit operations, not collection diff inference, to decide:

* preserve existing incarnation;
* allocate new incarnation;
* retire incarnation.

---

# 26. Lifecycle Coverage Validation

Retain Task 2.25's requirement that the transaction completely accounts for supported source lifecycle changes.

Now additionally prove that:

* every create receives incarnation;
* every update corresponds to prior source incarnation;
* every delete targets an existing source lifetime;
* delete/create same ID cannot accidentally preserve token.

Do not permit an incomplete lifecycle transaction to produce partially initialized identity.

---

# 27. Caller-Controlled Incarnation

Interactive authoring callers must not be able to forge continuity by supplying an old incarnation on a `create`.

The authoritative boundary owns allocation.

Likewise, an `update` should derive/preserve the existing active incarnation rather than trusting a changed caller value.

This is an authority rule, not a security boundary.

---

# 28. Snapshot APIs

Task 2.25 retained some lifecycle-ambiguous snapshot APIs for compatibility/tests.

These APIs now require careful handling because current runtime sources require incarnation.

Audit each.

They may remain usable only where:

* callers supply already authoritative incarnation-bearing current data;
* they are explicitly test/bootstrap scaffolding;
* they do not claim create/update lifecycle semantics.

Do not let an ambiguous snapshot setter become the production incarnation allocator.

If any production interactive path still uses one, stop and correct that path.

---

# 29. Store Initialization With Injected State

Injected/test initial state must satisfy the current runtime incarnation model.

Provide narrowly scoped test helpers where necessary.

Do not silently allocate incarnation onto arbitrary injected current-state objects if doing so would disguise malformed current authority.

If a dedicated legacy/test bootstrap path is necessary, classify it clearly.

---

# 30. Default Initial State

`createInitialDayFrameState()` currently contains no authoritative occurrence-generating source collections.

Therefore it should not allocate meaningless incarnation values solely for empty collections.

Any future default source created through an actual authoring operation receives incarnation at creation.

Preserve current no-demo-authority behavior.

---

# 31. Seeded/Test Stores

Explicit seeded/demo/test stores that construct authored sources must become incarnation-aware.

Prefer dedicated fixture/build helpers so tests do not scatter arbitrary UUID strings unnecessarily.

Do not reintroduce default production seeding.

---

# 32. Active V1 Reader Preservation

Retain the current Active V1 reader/normalizer as a raw legacy compatibility boundary.

It must produce a validated normalized V1 authored representation suitable for migration.

It must **not** directly activate incarnation-less state into the new current runtime.

---

# 33. Migration Detection

On startup, distinguish at least:

1. valid Active V2 exists;
2. no Active V2, valid Active V1 exists;
3. neither exists;
4. Active V2 present but invalid/unreadable;
5. V1 present but invalid/unreadable;
6. storage unavailable/accessor failure.

Do not collapse these into generic defaults.

---

# 34. No-Source Startup

If neither Active V2 nor V1 exists:

* create the normal empty/default current runtime;
* no migration is needed;
* future authoring creates incarnation-bearing sources;
* durable active status follows current no-source semantics.

Do not fabricate a migration result.

---

# 35. Active V1 Migration Ordering

Implement the exact guarded ordering:

1. acquire/read raw V1 source;
2. preserve raw source evidence;
3. parse;
4. normalize;
5. validate V1 authored state;
6. allocate baseline incarnation for **every** lifetime-bearing source;
7. construct complete Active V2 graph;
8. validate V2 graph;
9. serialize V2;
10. write V2 under distinct key;
11. reread V2;
12. parse/validate reread bytes;
13. verify complete V2 durable success;
14. only then adopt V2 current runtime.

No earlier runtime adoption is allowed.

---

# 36. Migration Baseline Allocation

Every lifetime-bearing source in the migrated V1 graph receives one fresh baseline incarnation.

This includes nested sources.

The migration must allocate the entire graph coherently.

Do not infer historical continuity beyond the migration boundary.

---

# 37. Migration Baseline Meaning

Preserve the Task 2.26 epistemic contract:

> A migrated incarnation identifies the source lifetime as recognized from successful migration forward. It does not reconstruct pre-migration lifetime history.

Do not expose or document migration UUIDs as proof of pre-migration identity.

---

# 38. Migration Atomicity

Migration succeeds only after verified Active V2 persistence.

The system must never expose:

* some sources with incarnation and others without;
* runtime V2 adopted before durable V2 exists;
* migration success after failed reread/validation;
* V1 overwritten as the migration commit mechanism.

Treat the graph as one migration unit.

---

# 39. V2 Reread Verification

After writing V2:

* read it back;
* parse it;
* validate it;
* ensure it represents the V2 graph intended for adoption.

The implementation should compare the semantic serialized payload or equivalent complete graph rather than merely checking key existence.

Document exact verification.

---

# 40. UUID Allocation Failure

The allocator should expose failure if cryptographic generation is unavailable or throws.

Migration allocation failure must:

* leave V1 intact;
* perform no partial V2 write;
* adopt no V2 runtime;
* produce explicit migration failure status/result.

Interactive source creation allocation failure must likewise reject the authoritative mutation rather than create an incarnation-less source.

---

# 41. Active V2 Serialization Failure

If serialization fails:

* runtime migration not adopted;
* V1 remains protected;
* no V2 success;
* reuse existing serialization-failure durability semantics where applicable.

For ordinary current Active V2 mutation after migration, runtime/session authority follows existing durability principles: valid runtime mutation may exist despite persistence failure.

Do not conflate initial migration ordering with later ordinary mutation semantics.

---

# 42. Migration Versus Ordinary Mutation Durability

This distinction is critical.

## Migration

Incarnation-bearing V2 runtime authority is **not adopted until durable V2 migration succeeds**.

## Ordinary post-migration authored mutation

Valid current runtime mutation remains session authority even if Active V2 persistence fails, consistent with established Phase 1 durability semantics.

Implement both correctly.

---

# 43. Active V2 Persistence Helper

Introduce or adapt the active persistence helper so current incarnation-bearing runtime writes Active V2 only.

Once current runtime is Active V2 authority:

* ordinary authored persistence targets V2 key;
* it does not continue updating V1;
* V1 remains historical recovery material.

Do not dual-write V1 and V2 unless the ADR explicitly authorizes it; Task 2.26 did not.

---

# 44. Post-Migration V1 Preservation

After successful V2 migration:

* leave V1 raw checkpoint intact;
* do not keep it synchronized;
* do not delete it;
* do not treat it as current authority.

Future compatibility-retirement/recovery work may decide when it can be removed.

---

# 45. Invalid Active V2

A present but invalid Active V2 must not trigger silent fallback to V1.

This is explicitly prohibited by Task 2.26.

Required behavior:

* protect V2 source;
* do not overwrite it automatically;
* do not silently activate V1 as current authority;
* expose an explicit ingress/recovery-required condition appropriate to the existing recovery infrastructure.

Determine the narrowest integration.

---

# 46. V2 Read Failure

If Active V2 exists but cannot be read due to storage/access failure:

* do not fall back to V1;
* do not write;
* protect current durable uncertainty;
* use existing unavailable/recovery semantics where possible.

No destructive recovery implementation beyond what is needed to classify/protect this condition is authorized.

---

# 47. Invalid V1 During Migration

If no V2 exists and V1 fails parse/validation:

* preserve raw V1;
* do not allocate incarnation;
* do not write V2;
* do not activate incomplete V1;
* enter the existing protected/recovery-required safe-runtime posture.

Integrate with the current historical-ingress architecture rather than creating a parallel error system.

---

# 48. Migration Failure Status

Task 2.26 requires an explicit ingress migration-failure classification.

Add only the minimum new infrastructure necessary to represent:

* migration pending/failed because allocation/construction/serialization/write/verification did not complete.

Do not put migration status into `DayFrameState`.

Prefer the existing active-local ingress/recovery infrastructure.

---

# 49. Migration Retry

Determine and implement a safe retry path where Task 2.26 contract requires one.

Retry must:

* reread/protect the relevant source;
* rebuild a complete baseline graph;
* avoid partial reuse of failed transient allocation unless evidence shows it is safe;
* write one complete V2 candidate;
* verify before adoption.

If new random UUIDs are generated on a later failed retry, that is acceptable **provided no failed candidate was ever adopted or durably established as authoritative**.

Document this carefully.

---

# 50. Migration Desired Durable Condition

Reconcile migration with existing desired-durable-condition semantics.

Do not accidentally treat V1 as the desired current durable snapshot after current runtime becomes V2.

The result must explain:

* desired condition before migration;
* during failed migration;
* after successful V2 adoption;
* during later ordinary V2 mutation failure.

---

# 51. Active Durability Status

Reuse current durability-status semantics.

Do not create incarnation-specific durability categories.

The difference between:

* migration not completed;
* ordinary V2 write failed;

should be represented through ingress/migration authority plus existing factual durability outcome.

---

# 52. Recovery Protection

A failed or invalid migration must preserve the original active source.

Do not allow ordinary mutation persistence or Retry to overwrite a protected legacy checkpoint until the existing recovery authority permits it.

Reuse the active-local recovery model from Tasks 2.18–2.21.

---

# 53. Recovery Command Interaction

Audit existing:

* `replaceProtectedActiveCheckpointWithCurrentState()`;
* `abandonProtectedActiveCheckpointAndReset()`.

They were implemented before Active V2.

Task 2.27 must ensure they do not write an obsolete V1 format once current runtime is incarnation-bearing.

If recovery operates after an unsuccessful V1 migration, determine which format it should produce under the adopted Active V2 contract.

Preferred architectural direction:

* any newly accepted current authoritative recovery replacement should write valid Active V2.

Do not preserve obsolete writer behavior merely for implementation convenience.

---

# 54. Recovery Replacement Allocation

If safe fallback/current session must be promoted during a legacy migration-recovery scenario, its active sources must have legitimate incarnation before Active V2 write.

Do not invent incarnation from snapshot equality.

Determine whether:

* the safe current session already has incarnation-bearing sources;
* or the explicit recovery operation must instantiate a baseline using an authorized ingress operation.

Keep this tightly aligned with 2.26.

Document any special case.

---

# 55. Recovery Abandonment

Successful active-local abandonment:

* removes relevant active durable authority according to the V2 model;
* resets runtime to safe initial state;
* must not leave stale V2 authority that will reactivate on reload.

Audit whether abandonment now needs to remove V2 key, V1 key, or both.

This is a potentially important implementation issue.

Use the adopted recovery meaning:

> abandon the protected active checkpoint.

Do not silently leave a newer authoritative V2 key behind.

Document exact key semantics.

---

# 56. Clear / Reset

Similarly audit ordinary `clearLocalData()`.

Once Active V2 is current authority:

* clear must remove Active V2 current durable data;
* treatment of legacy V1 recovery material must be explicit.

Do not accidentally resurrect V1 after clearing V2.

If clear is supposed to clear all active local DayFrame data, update accordingly.

Preserve saved-profile independence.

---

# 57. V1 Resurrection Prevention

This task must explicitly prevent the following bug:

```text
successful V2 migration
    ↓
user later clears/removes V2
    ↓
stale V1 still present
    ↓
next startup migrates old V1 again
    ↓
old setup resurrects
```

Determine the correct authority marker/removal/recovery policy consistent with Task 2.26 and existing clear/abandon semantics.

This is a mandatory design/implementation point.

Do not leave stale V1 recovery material able to masquerade as a fresh migration candidate after an explicit later deletion of current authority.

---

# 58. Migration Completion / V1 Eligibility Marker

If preventing V1 resurrection requires distinguishing:

* "V1 has never been migrated";
* "V1 is retained historical recovery material after V2 migration";

implement the narrowest durable/infrastructure mechanism consistent with the ADR.

Do not invent a broad migration history system.

Possible options:

* V2 presence/history metadata;
* retirement marker;
* explicit state in V2 envelope;
* another narrow mechanism.

If no safe solution exists within scope, stop and report.

---

# 59. No Silent Legacy Fallback

Adopt as direct invariant:

> Once DayFrame has established V2 authority for an active lineage, retained V1 bytes can never automatically become current authority again.

This must remain true after:

* restart;
* ordinary clear;
* recovery abandonment;
* V2 corruption;
* V2 removal failure.

Only an explicit future recovery/conversion workflow may intentionally reactivate retained V1.

---

# 60. Current Authored Validator

Extend the current complete authored-state validator to incarnation-bearing current sources.

Do not duplicate the existing semantic validation logic.

The validator should now enforce both:

* authored scheduling semantic validity;
* current source identity validity.

If clean separation into identity subvalidation improves clarity, use it.

---

# 61. Lifecycle Transaction Validation

Task 2.25 validation remains authoritative for operation provenance.

Task 2.27 adds identity consequences.

Tests must prove:

* create results in new valid UUID;
* update preserves;
* delete/recreate changes;
* replace changes;
* lifecycle omissions still rejected;
* caller cannot use a same-ID final snapshot to retain old incarnation after explicit recreation.

---

# 62. Persistence Projection

Do not serialize lifecycle-operation history.

Active V2 contains resulting source incarnation only.

This is the durable outcome of lifecycle semantics, not the operation ledger.

---

# 63. Profile Boundary

Do not implement Profile V2.

Current saved-profile behavior must continue to work under its existing V1 contract.

However, runtime incarnation creates a representation mismatch.

Task 2.27 must therefore provide the narrowest temporary projection necessary so Profile V1 continues to serialize its existing incarnation-free reusable setup shape.

Do not leak active `incarnationId` into Profile V1.

This is critical.

---

# 64. Profile V1 Save Projection

When saving a current incarnation-bearing active setup into an existing V1 profile during Task 2.27:

* omit active incarnation;
* preserve existing profile V1 schema;
* preserve current user-visible profile behavior.

This is a compatibility adapter, not Profile V2 implementation.

Loading that profile must produce a valid active incarnation-bearing graph using the semantics available in this task.

Because profile activation is architecturally `instantiate`, it must allocate fresh active incarnation rather than copy absent tokens.

Implement only the minimum adaptation required to preserve existing profile functionality safely.

---

# 65. Profile V1 Load Instantiation

Although Profile V2 is deferred, Task 2.27 cannot leave current Profile V1 loading incapable of constructing mandatory current runtime sources.

Therefore existing Profile V1 activation must now instantiate fresh active incarnation for the complete loaded graph.

This is **not** Profile V2 persistence.

Requirements:

* profile durable bytes remain V1;
* each activation gets fresh lifetimes;
* nested sources get coherent fresh identities;
* no profile token is persisted.

Direct regression tests required.

---

# 66. Why Profile V2 Remains Deferred

Do not:

* increment profile collection version;
* add V2 profile DTO;
* rewrite profile collection;
* migrate V1 profiles.

Task 2.27 only adapts V1 profile ingress/egress to the new active runtime model.

Task 2.28 will implement the proper independently versioned Profile V2 durable surface.

---

# 67. Backup V1 Boundary

Likewise current Backup V1 must remain supported during Task 2.27.

Do not add incarnation to Backup V1.

Do not introduce Backup V2.

Existing Backup V1 import must instantiate baseline active incarnation because it cannot restore identity it never stored.

Existing Backup V1 export must retain its current schema and omit incarnation.

This is the compatibility bridge until Task 2.29.

---

# 68. Backup V1 Export Projection

Export from incarnation-bearing current runtime into V1 backup must deliberately omit incarnation.

Do not serialize new fields into a `version: 1` artifact.

This is essential format integrity.

---

# 69. Backup V1 Import Instantiation

Importing V1 backup into current runtime must:

* validate current V1 backup semantics;
* create fresh active incarnation for every lifetime-bearing source;
* replace current active authored authority according to existing import semantics;
* persist resulting Active V2 current state.

Do not claim lifetime restoration.

---

# 70. Backup V1 Recovery Semantics

Until Backup V2 exists, current V1 import remains baseline instantiation.

Update any internal naming/copy only if necessary to preserve truth; avoid broad UI changes.

If existing UI says "restore" in a way that materially contradicts the newly adopted identity semantics, document the issue and defer copy correction unless it would create a dangerous false claim.

---

# 71. Backup/Profile Snapshot Types

Introduce distinct projections/DTOs where necessary so:

* Active runtime requires incarnation;
* Profile V1 omits incarnation;
* Backup V1 omits incarnation.

Do not make incarnation optional everywhere to keep shared cloning convenient.

This is the point where Task 2.26's warning about universal `DayFrameAuthoredSetup` reuse becomes actionable.

---

# 72. `DayFrameAuthoredSetup` Strategy

Choose the narrowest safe type evolution.

Possible direction:

* current runtime authored setup becomes incarnation-bearing;
* V1 profile/backup use legacy pattern DTO;
* adapters map explicitly.

Document the final shape.

Do not conflate artifact representation with current active authority.

---

# 73. Clone Behavior

Every current active clone/snapshot must preserve exact incarnation.

Tests required for:

* store `getState`;
* authored setup clone;
* mutation results;
* active replacement;
* rehydration.

Mutation of returned clone must not alter store-owned incarnation.

---

# 74. Preview Boundary

No scheduling behavior changes.

Preview generation may receive incarnation-bearing source objects as part of current runtime, but:

* incarnation must not affect candidate ordering;
* incarnation must not affect date expansion;
* incarnation must not affect placement;
* incarnation must not affect friction;
* `OccurrenceIdentity` V1 remains unchanged.

Do not add incarnation to Preview output unless existing cloned source objects necessarily carry it internally and this does not alter persisted/semantic contracts.

Prefer keeping it out until DurableOccurrenceReference work.

---

# 75. Deterministic Scheduling Regression

Directly prove equivalent scheduling-authored values with different incarnation IDs produce equivalent schedule output under existing runtime identity semantics.

At minimum prove incarnation does not influence:

* generated work dates;
* candidate expansion;
* scheduled placement;
* friction.

No need to compare object equality where source metadata naturally differs; compare scheduling semantics.

---

# 76. OccurrenceIdentity Preservation

Do not change:

* version;
* sourceKind;
* template/recur coordinates;
* work coordinates;
* manual identity;
* canonical slot behavior.

Tests should prove occurrence identities remain structurally equal for otherwise equivalent source scheduling values even when incarnation differs, because V1 is still runtime-only and incarnation-independent.

---

# 77. Active Persistence Retry

Ordinary active persistence retry after V2 authority exists must retry V2 serialization/write.

It must never reconstruct or write Active V1.

Update desired durable condition to contain/derive from incarnation-bearing current authority.

Retain existing durability semantics.

---

# 78. Serialization Failure Recovery

Existing recovery-required semantics for serialization failure must remain coherent with Active V2.

No UI copy expansion is required unless existing wording becomes factually incorrect.

Do not add another retry/recovery system.

---

# 79. Active Recovery Source Recheck

Task 2.20 source recheck currently compares protected raw active source.

With two keys/formats, ensure recovery source identity includes the correct authoritative key/source.

Do not compare a V1 raw source when the protected subject is V2 or vice versa.

This may require enriching private protected-source evidence with surface/version/key information.

Keep it infrastructure-only.

---

# 80. Recovery SourceChanged

External mutation of protected V2 must still yield sourceChanged.

Retained V1 recovery material changing independently must not invalidate a recovery decision about V2 unless V1 is the actual protected subject.

Direct test where appropriate.

---

# 81. No Profile/Backup Durability Coupling

Active V2 migration must not make profile or backup persistence success a prerequisite.

These surfaces remain independently durable/versioned.

Active migration succeeds based only on the Active V2 contract.

---

# 82. Active V2 Writer Completeness

Every current active writer path must emit mandatory incarnation.

Audit all production paths that persist active data:

* Setup commit;
* manual event mutation;
* narrow setters;
* profile load;
* backup import;
* recovery replacement;
* clear/removal;
* persistence retry;
* any initialization persistence.

No V2 writer may omit source incarnation.

---

# 83. Active V1 Writer Retirement

Once Task 2.27 is complete, current production active-state writers should no longer emit Active V1.

The V1 code remains reader/migration compatibility only.

Search and prove no production path writes the old V1 key as current authority.

---

# 84. Active Migration Tests — Success

Direct test must establish:

1. V1 source exists;
2. no V2 source;
3. create store;
4. V1 parsed/validated;
5. all source kinds receive baseline UUIDs;
6. V2 written once;
7. V2 reread/validated;
8. runtime adopted with exact persisted UUIDs;
9. V1 remains unchanged;
10. active durability/ingress status reflects successful V2 authority.

Include nested segment/sequence coverage.

---

# 85. Active Migration Tests — Stable Rehydration

After successful migration:

* construct a new store over same storage;
* V2 wins;
* no new UUIDs allocated;
* exact incarnation values restored;
* V1 not remigrated.

---

# 86. Migration Parse-Failure Test

Malformed V1:

* no V2 write;
* no runtime adoption from malformed V1;
* protected/recovery status;
* raw V1 unchanged.

---

# 87. Migration Validation-Failure Test

Semantically invalid normalized V1:

* no UUID allocation if validation occurs first;
* or no durable effect from any transient allocation;
* no V2 write;
* protection retained.

Document ordering.

---

# 88. Migration Allocation-Failure Test

Injected UUID allocator failure:

* V1 unchanged;
* no V2 write;
* no partial runtime V2;
* explicit migration failure;
* retry remains possible.

---

# 89. Migration Serialization-Failure Test

Force V2 serialization failure:

* V1 unchanged;
* no successful V2;
* no V2 runtime adoption;
* factual durability outcome recorded.

---

# 90. Migration Write-Failure Test

Force V2 `setItem` failure:

* V1 unchanged;
* no adopted V2 runtime;
* no success marker;
* migration remains unresolved/protected.

---

# 91. Migration Reread-Failure Test

Write succeeds but reread/access fails:

* do not adopt V2 runtime;
* V2 may physically exist;
* ingress status must protect uncertainty;
* next startup must not silently overwrite/fallback.

This is important.

---

# 92. Migration Reread-Invalid Test

Write returns success but reread bytes are malformed/different:

* no runtime adoption;
* protect V2;
* do not remigrate over it automatically;
* do not fall back silently to V1.

---

# 93. Active V2 Invalid-Startup Test

Preexisting invalid V2 + valid V1:

* V1 does not silently activate;
* no migration overwrites V2;
* recovery protection active.

---

# 94. Active V2 Unknown Version Test

If V2 envelope/version discriminator is unsupported/future:

* explicit unsupported/protected behavior;
* no V1 fallback;
* no overwrite.

Do not guess.

---

# 95. No-Source Test

No V1/V2:

* healthy initial runtime;
* no migration;
* new source creation yields valid incarnation;
* first active write uses V2.

---

# 96. Create / Update / Recreate Tests

For each major source family prove:

## create

Fresh UUID.

## update

Exact same UUID.

## delete/recreate same ID

Different UUID.

At minimum direct coverage for:

* template;
* recurrence;
* shift definition;
* cycle;
* nested segment;
* sequence entry;
* manual event.

Use focused parameterization/helper where it improves maintainability.

---

# 97. Parent Recreation Test

Cycle recreation with reused cycle ID and nested reused IDs:

* new cycle incarnation;
* new nested incarnations;
* no old lifetime component survives.

---

# 98. Reorder Test

Reordering existing segments/sequence entries:

* preserves their exact incarnations.

Array position must not rotate identity.

---

# 99. Profile V1 Compatibility Tests

While Profile V2 is deferred:

* save profile emits unchanged V1 shape with no incarnation;
* load profile allocates fresh active incarnation graph;
* repeated load allocates different incarnations;
* readable IDs/internal relationships remain preserved;
* profile durable bytes remain version 1.

---

# 100. Backup V1 Compatibility Tests

* export remains version 1 and omits incarnation;
* import allocates fresh active incarnation graph;
* repeated import produces new active lifetimes;
* source file/string unchanged;
* resulting active persistence is V2.

---

# 101. Recovery Replacement Tests

Recovery replacement under current runtime:

* writes Active V2;
* includes incarnation;
* preserves current runtime incarnation;
* does not write V1;
* protection clears only after durable V2 success.

---

# 102. Recovery Abandonment Tests

Successful abandonment must leave no active durable source able to resurrect unexpectedly.

Test exact behavior for:

* V2 key;
* retained V1 historical checkpoint;
* authority marker/retirement state adopted under Section 57–58.

This test is mandatory.

---

# 103. Clear Tests

Clear after successful V2 migration:

* resets runtime;
* active durable authority absent;
* subsequent restart remains clear;
* retained V1 bytes do not remigrate automatically;
* saved profiles preserve existing current semantics.

---

# 104. Persistence Failure Tests

Ordinary post-migration active mutation with V2 write failure:

* runtime mutation remains session authority;
* incarnation correct;
* active durability records failure;
* retry targets latest V2 snapshot;
* no V1 write.

---

# 105. Snapshot Isolation Tests

Returned runtime snapshots:

* contain incarnation;
* clone source objects;
* cannot mutate store-owned ID/incarnation.

---

# 106. Validator Tests

Directly protect:

* missing incarnation invalid current authority;
* malformed UUID;
* uppercase/noncanonical UUID;
* wrong UUID version;
* duplicate UUID;
* nested duplicate collision;
* legitimate unique values accepted.

Legacy V1 validation remains separate and does not require incarnation.

---

# 107. Persistence Shape Tests

Assert Active V2:

* has explicit envelope/version;
* has all required source incarnations;
* has nested incarnations;
* has no preview;
* has no profiles;
* has no durability/ingress metadata;
* has no lifecycle-operation records.

Assert Active V1 writer is no longer used by production.

---

# 108. No DurableOccurrenceReference

Do not add:

* durable occurrence-reference types;
* constructors;
* serialization;
* resolution;
* canonical conflict keys.

Task 2.27 only makes Active incarnation ready for that work later.

---

# 109. No PlanDecision

Do not add:

* PlanDecision type;
* decision collection;
* Try/Accept workflow;
* decision persistence;
* replay;
* decision-aware generation.

---

# 110. No Profile V2

Do not:

* bump profile version;
* persist profile incarnation;
* migrate profile collection.

Only maintain Profile V1 interoperability with the new active runtime.

---

# 111. No Backup V2

Do not:

* bump backup version;
* export incarnation-bearing recovery artifacts;
* claim V1 import restores lifetime.

Only maintain Backup V1 interoperability.

---

# 112. No Scheduling Semantic Change

Do not alter:

* recurrence expansion;
* candidate generation;
* work generation;
* placement;
* friction;
* suggested fixes;
* preview range;
* day-boundary behavior.

Incarnation is identity/provenance only.

---

# 113. No UI Feature Expansion

Do not add:

* visible incarnation IDs;
* migration screens;
* backup-version UI;
* profile-version UI;
* PlanDecision UI.

Only adjust existing recovery/durability copy if required for factual correctness after Active V2.

Prefer no UI changes if existing semantics remain truthful.

---

# 114. Expected Files To Change

Likely areas include:

* `code/src/state/types.ts`;
* `code/src/state/dayFrameStore.ts`;
* active persistence/rehydration helpers;
* authored validation;
* lifecycle-operation application helpers;
* profile V1 projection/activation adapter;
* backup V1 projection/import adapter;
* active ingress/recovery infrastructure;
* state/store tests;
* possibly UI integration tests where recovery/clear behavior is affected.

A narrow new module for:

* incarnation allocation/validation;
* Active V2 DTO/serialization/migration;

is encouraged if it improves responsibility separation.

Do not force everything into `dayFrameStore.ts`.

---

# 115. Reference Audit

Before completion, audit every production reference to:

* active storage key(s);
* active serialize/write helper;
* active read/rehydration helper;
* authored source constructors;
* lifecycle-aware Setup transaction;
* manual-event lifecycle mutation;
* profile save/load;
* backup export/import;
* clear;
* recovery replacement/abandonment;
* active retry;
* seeded/test store constructors.

Confirm there is no supported current-authority path that can produce an incarnation-less runtime source.

---

# 116. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.27_IMPLEMENT_AUTHORITATIVE_SOURCE_INCARNATION_AND_ACTIVE_V2_MIGRATION_RESULT.md`

The result must contain at least:

1. Executive Result
2. Artifact Integrity
3. Governing ADR Compliance
4. Evidence Reviewed
5. Files Changed
6. Source Incarnation Type
7. UUID Allocation
8. UUID Validation
9. Runtime Source Model
10. Legacy Raw-Type Boundary
11. Active V2 Envelope
12. Active V2 Key
13. Active V2 Serializer
14. Active V2 Validation
15. Global Incarnation Uniqueness
16. Nested Incarnation Semantics
17. Setup Create Semantics
18. Setup Update Semantics
19. Delete/Recreate Semantics
20. Replacement Semantics
21. Manual-Event Semantics
22. Lifecycle Transaction Integration
23. Snapshot API Handling
24. Initialization / Fixture Handling
25. Active V1 Reader Preservation
26. Migration Detection
27. Migration Ordering
28. Baseline Allocation
29. Migration Atomicity
30. Migration Success
31. Migration Parse / Validation Failure
32. Migration Allocation Failure
33. Migration Serialization Failure
34. Migration Write Failure
35. Migration Reread Failure
36. Invalid V2 Handling
37. Unknown V2 Version Handling
38. Active V2 Authority Precedence
39. V1 Historical Preservation
40. V1 Resurrection Prevention
41. Migration Marker / Eligibility Mechanism
42. Ordinary V2 Persistence
43. Active Retry
44. Durability Semantics
45. Ingress / Recovery Integration
46. Recovery Replacement
47. Recovery Abandonment
48. Clear / Reset
49. Profile V1 Compatibility Bridge
50. Profile V1 Instantiation
51. Backup V1 Compatibility Bridge
52. Backup V1 Instantiation
53. `DayFrameAuthoredSetup` / DTO Boundary
54. Clone / Snapshot Preservation
55. Preview / Scheduling Preservation
56. OccurrenceIdentity Preservation
57. Tests Added or Updated
58. Reference Audit
59. Persistence Shape Audit
60. Architectural Alignment Assessment
61. Deviations
62. Discoveries and Deferred Work
63. Recommended Next Task
64. Validation
65. Final Completion Determination

---

# 117. Validation Requirements

Run focused tests first for:

* incarnation allocation;
* lifecycle integration;
* Active V2 serialization;
* Active V1 migration;
* migration failure paths;
* active ingress/recovery;
* profile V1 bridge;
* backup V1 bridge;
* clear/reset;
* persistence retry.

Then run affected UI integration tests if recovery/clear behavior changed.

Then run full repository validation:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Record:

* focused test files/count;
* full test files/count;
* lint;
* typecheck;
* build;
* diff check;
* immutable task hash;
* source/ADR integrity.

---

# 118. Completion Criteria

Task 2.27 is complete only when:

* every current active lifetime-bearing source has mandatory incarnation;
* incarnation uses the accepted canonical UUID v4 representation;
* one authoritative allocator exists;
* authoring create allocates;
* authoring update preserves;
* delete/recreate changes;
* replace changes;
* manual events obey the same lifetime rules;
* nested segments/sequence entries carry independent incarnation;
* parent recreation cannot preserve prior nested lineage;
* current runtime cannot contain missing incarnation;
* Active V2 envelope exists;
* Active V2 uses a distinct key;
* Active V2 validation protects malformed/missing/duplicate incarnation;
* Active V1 remains readable for migration;
* V1 migration allocates a complete baseline graph;
* V1 migration writes/validates V2 before runtime adoption;
* migration failure never partially adopts V2;
* invalid V2 never silently falls back to V1;
* valid V2 outranks retained V1;
* V1 cannot resurrect automatically after later clear/abandon;
* ordinary current persistence writes V2 only;
* current retry writes V2 only;
* recovery replacement writes V2;
* recovery abandonment is safe under two-key history;
* profile V1 remains schema-compatible and instantiates fresh active lifetimes;
* backup V1 remains schema-compatible and instantiates fresh active lifetimes;
* no Profile V2 is implemented;
* no Backup V2 is implemented;
* no DurableOccurrenceReference is implemented;
* no PlanDecision is implemented;
* scheduling semantics remain unchanged;
* `OccurrenceIdentity` V1 remains unchanged;
* focused and full validation pass;
* result artifact is complete.

---

# 119. Explicit Non-Goals

Do **not**:

* implement Profile V2;
* implement Backup V2;
* add incarnation to Profile V1;
* add incarnation to Backup V1;
* implement durable occurrence references;
* modify `OccurrenceIdentity` V1;
* implement PlanDecision;
* persist PlanDecision;
* implement decision replay;
* redesign scheduling;
* redesign Preview;
* add tombstones;
* add source history;
* introduce event sourcing;
* expose incarnation in UI;
* use source ID as incarnation;
* infer incarnation from content;
* dual-write V1 and V2 as ongoing current authority;
* delete V1 merely because migration succeeded;
* silently fall back from invalid V2 to V1;
* weaken existing durability/recovery safety.

---

# 120. Stop Conditions

Stop and report rather than broadening scope if:

* Profile V1 cannot interoperate with incarnation-bearing runtime without changing its durable format;
* Backup V1 cannot interoperate without changing version semantics;
* Active V2 migration cannot be made durable-before-adoption;
* V1 resurrection cannot be prevented without an architectural decision absent from Task 2.26;
* recovery semantics across V1/V2 cannot be made unambiguous;
* current lifecycle-operation authority cannot reliably assign incarnation;
* nested lifetime identity requires an additional semantic decision;
* platform cryptographic UUID support requires an unsupported dependency/runtime change;
* current authored validation cannot separate legacy V1 from current V2 without broad weakening;
* implementation would require DurableOccurrenceReference or PlanDecision behavior.

Recommend the narrowest prerequisite.

---

# 121. Recommended Follow-On Boundary

If Task 2.27 completes successfully, the next task should implement the independently versioned **Profile V2 reusable-pattern format** and its fresh-incarnation activation semantics.

That task should address:

* Profile Collection V2;
* incarnation-free pattern DTOs;
* V1→V2 collection conversion;
* non-destructive invalid-entry preservation/quarantine;
* repeated activation producing distinct active source lifetimes;
* profile durability/retry/recovery behavior.

Backup V2 should follow separately.

DurableOccurrenceReference must remain blocked until all source-incarnation-bearing active authority and required artifact boundaries are validated.

---

# 122. Task Determination

**Authorized:** implementation of mandatory current active source incarnation, lifecycle-driven incarnation allocation/preservation, Active V2 durable representation, guarded eager Active V1 migration, durability/recovery integration, and compatibility adapters necessary to keep existing Profile V1 and Backup V1 behavior functioning against incarnation-bearing runtime authority.

**Not authorized:** Profile V2, Backup V2, DurableOccurrenceReference, PlanDecision, decision persistence/replay, scheduling changes, source history, or UI identity features.

The implementation must preserve the central epistemic rule:

> Existing V1 data may establish a new forward-safe lifetime baseline, but DayFrame must never fabricate historical incarnation continuity that the old format did not record.

---

# 123. Final Completion Statement

**Task 2.27 is complete when DayFrame's current active authored authority carries mandatory lifecycle-correct UUID-v4 source incarnation for every lifetime-bearing source; ordinary creation, update, deletion, recreation, replacement, rehydration, recovery, and legacy migration preserve the Task 2.24–2.26 lifetime contract; Active V2 is independently versioned, durably verified before migration adoption, authoritative over retained V1 without permitting silent V1 resurrection; existing Profile V1 and Backup V1 remain compatible through explicit incarnation-free projections and fresh active instantiation; all persistence, durability, recovery, Preview, scheduling, and OccurrenceIdentity invariants remain validated; and no Profile V2, Backup V2, DurableOccurrenceReference, or PlanDecision behavior is introduced.**
