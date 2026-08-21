# Task 2.27A — Complete Active V2 Runtime Identity and Migration Contract Validation

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Parent Task

Task 2.27 — Implement Authoritative Source Incarnation and Active V2 Migration

## Task Type

Bounded completion and corrective-validation task.

Task 2.27 substantially implemented the Active V2/source-incarnation architecture but correctly returned **Not complete** because mandatory runtime typing, migration/durability outcome semantics, required regression coverage, and full-suite compatibility were not yet complete.

Task 2.27A exists solely to close those gaps.

It does **not** reopen the architectural decisions established by Tasks 2.24–2.27 and does not begin Profile V2, Backup V2, DurableOccurrenceReference, or PlanDecision work.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. verify the Task 2.27 result artifact and its `Not complete` determination;
6. do not modify either Task 2.27 or Task 2.27A specifications during execution.

Execution findings must be recorded separately in:

`TASK_2.27A_COMPLETE_ACTIVE_V2_RUNTIME_IDENTITY_AND_MIGRATION_CONTRACT_VALIDATION_RESULT.md`

If completion work exposes an actual contradiction in the accepted Task 2.26 ADR or Task 2.27 architecture, stop the affected work and report it rather than redesigning Active V2 under this completion task.

---

# 2. Purpose

Task 2.27 implemented the core incarnation-bearing active-authority path:

* branded source incarnation;
* canonical lowercase UUID-v4 validation;
* cryptographically strong allocation;
* allocator injection;
* Active V2 envelope;
* Active V2 validation;
* global incarnation uniqueness;
* distinct Active V2 storage key;
* V2-established authority marker;
* V2-first startup;
* V1→V2 baseline migration;
* durable write/read-back verification;
* V1 resurrection prevention;
* retirement of ordinary Active V1 writes;
* Profile V1 incarnation-free projection;
* Backup V1 incarnation-free projection;
* fresh active incarnation on Profile V1 load;
* fresh active incarnation on Backup V1 import;
* lifecycle-driven incarnation preservation/allocation.

However, Task 2.27 correctly determined itself incomplete.

Its result identified the following unresolved completion requirements:

1. `DayFrameState` still exposes `incarnationId` as optional at the TypeScript compatibility edge;
2. successful migration does not initialize retained active durability status to `durable`;
3. migration failure classification does not retain the detailed failure subtype;
4. required failure-matrix coverage remains incomplete;
5. stable-rehydration coverage remains incomplete;
6. lifecycle coverage across all seven source kinds remains incomplete;
7. recovery replacement/abandonment coverage remains incomplete;
8. snapshot-isolation coverage remains incomplete;
9. persistence-shape coverage remains incomplete;
10. deterministic scheduling / occurrence-identity non-interference coverage remains incomplete;
11. the broad suite contains 31 failures from obsolete V1-era/runtime-shape expectations;
12. therefore the full repository suite is not green.

Task 2.27A closes exactly those gaps.

---

# 3. Governing Evidence

This task is governed by:

* Task 2.24 source-incarnation semantics;
* Task 2.25 explicit lifecycle-operation authority;
* Task 2.26 durable source-incarnation and versioned-format ADR;
* Task 2.27 implementation specification;
* Task 2.27 result and its explicit `Not complete` determination;
* the executable Active V2 implementation now present in the repository;
* existing Phase 1 durability/recovery authority.

Where Task 2.27 implementation and Task 2.27 specification differ, Task 2.27A must close the difference unless doing so exposes a genuine architectural contradiction.

Do not reinterpret an unimplemented requirement as implicitly waived.

---

# 4. Completion Objective

After Task 2.27A:

```text
Task 2.27 architecture
        +
Task 2.27 implementation
        +
mandatory runtime typing
        +
complete migration outcome semantics
        +
complete required regression matrices
        +
deliberately updated V2-era expectations
        +
full repository suite green
        =
Task 2.27 accepted as complete
```

Task 2.27A succeeds only if the parent Task 2.27 can then be accepted without qualification.

---

# 5. Preserve Existing Architecture

Do not redesign the following accepted decisions:

* `incarnationId` identifies one source lifetime;
* incarnation is canonical lowercase UUID v4;
* incarnation is opaque;
* create allocates;
* update preserves;
* delete/recreate allocates a different incarnation;
* replace allocates;
* nested segments and sequence entries have independent incarnation;
* parent cycle lifetime participates in future nested durable identity;
* Active V2 is current active authority;
* Active V1 is legacy migration/recovery material only;
* valid V2 outranks retained V1;
* invalid V2 never silently falls back to V1;
* V1 cannot automatically resurrect after V2 authority has been established;
* Profile V1 remains incarnation-free;
* Profile V1 activation instantiates fresh active lifetimes;
* Backup V1 remains incarnation-free;
* Backup V1 import instantiates fresh active lifetimes;
* `OccurrenceIdentity` V1 remains unchanged;
* no DurableOccurrenceReference exists yet;
* no PlanDecision persistence exists yet.

This is completion work, not architecture reconsideration.

---

# 6. Required Initial Audit

Before changing code, reproduce and classify the current Task 2.27 state.

At minimum:

1. run the full test suite;
2. record exact current failing test files and failing tests;
3. classify every failure as:

   * obsolete V1 storage-key expectation;
   * obsolete incarnation-free runtime fixture;
   * obsolete persistence call-count expectation;
   * genuine Task 2.27 implementation defect;
   * unrelated/pre-existing failure;
4. inspect current runtime source types;
5. inspect current V1 DTO boundaries;
6. inspect Active V2 serializer/validator/migration;
7. inspect migration status representation;
8. inspect durability initialization;
9. inspect recovery replacement/abandonment;
10. inspect clear/reset;
11. inspect profile/backup compatibility adapters;
12. inspect scheduling and `OccurrenceIdentity` consumers.

The result artifact must include this classification.

Do not mechanically update tests before understanding what each assertion was protecting.

---

# 7. Mandatory Runtime Incarnation

The current active runtime source model must make `incarnationId` statically mandatory for all seven lifetime-bearing source kinds:

1. block templates;
2. block recurrences;
3. manual calendar events;
4. shift definitions;
5. shift cycles;
6. shift segments;
7. shift cycle sequence entries.

The current runtime type must not use:

`incarnationId?: ...`

as a compatibility escape hatch.

Task 2.27A must remove that ambiguity.

---

# 8. Legacy Compatibility Boundary

Legacy durable formats do not contain incarnation.

Represent that fact at explicit compatibility boundaries.

Prefer:

```text
Active V1 DTO
Profile V1 DTO
Backup V1 DTO
        ↓
explicit adapter / instantiation / migration
        ↓
Current active runtime model
    incarnation mandatory
```

Do not weaken the current runtime model to make historical fixtures compile.

---

# 9. Fixture Migration

Existing tests that hand-construct current active source objects must be updated deliberately.

Prefer centralized fixture/build helpers that:

* create valid canonical test incarnation IDs;
* make source lifetime explicit;
* avoid scattering meaningless optional fields;
* permit stable expected values where equality matters.

Do not introduce production optionality for test convenience.

---

# 10. Test UUID Strategy

Use deterministic valid UUID-v4 values in tests.

They must satisfy the production canonical validator.

Do not:

* weaken UUID validation;
* use malformed placeholder strings;
* bypass current validation merely to preserve old fixtures.

If a reusable test-incarnation helper is appropriate, add one in test infrastructure.

---

# 11. Runtime Completeness Invariant

Once a source has crossed into current active authority:

> It always has a valid incarnation.

No current runtime path may produce an incarnation-less lifetime-bearing source.

Audit:

* startup;
* V1 migration;
* V2 rehydration;
* Setup commit;
* manual-event mutation;
* profile activation;
* backup import;
* recovery replacement;
* snapshot setters retained for compatibility;
* injected initial/test state;
* clear/reset/default initialization.

---

# 12. Lifecycle Operation Authority

Task 2.25 remains the authority for operation meaning.

Task 2.27A must prove the incarnation consequence of each operation rather than infer it from snapshots.

At minimum:

| Lifecycle operation | Incarnation consequence |
| ------------------- | ----------------------- |
| create              | allocate fresh          |
| update              | preserve exact          |
| delete              | retire/remove           |
| delete + recreate   | allocate fresh          |
| replace             | allocate fresh          |

No final-state ID comparison may substitute for operation provenance.

---

# 13. All-Seven-Source Lifecycle Matrix

Add direct protective coverage for every lifetime-bearing source kind.

For each relevant source prove:

* create produces valid incarnation;
* update preserves exact incarnation;
* delete/recreate with same readable ID produces a different incarnation;
* replace produces a different incarnation where the operation is supported.

Required source kinds:

1. template;
2. recurrence;
3. manual event;
4. shift definition;
5. shift cycle;
6. segment;
7. sequence entry.

Use parameterization/helpers where appropriate, but ensure failures identify the source kind clearly.

---

# 14. Nested Reorder Preservation

For segments and sequence entries, prove:

* reordering preserves incarnation;
* array position is not lifetime identity;
* ordinary nested update preserves incarnation.

Do not accidentally classify reorder as recreation.

---

# 15. Parent Recreation

Directly prove:

```text
cycle:
id = cycle_1
incarnation = A

nested:
id = segment_1
incarnation = S1

delete cycle_1
recreate cycle_1
recreate segment_1

result:
cycle incarnation != A
segment incarnation != S1
```

Do the equivalent for sequence entries where appropriate.

---

# 16. Manual Event Matrix

Directly prove lifecycle-aware manual-event behavior:

## Create

Fresh incarnation allocated by authority.

## Update

Exact incarnation preserved.

## Delete

Source removed.

## Replace

Fresh incarnation.

## Same-ID delete/recreate

Fresh incarnation.

Do not use `setManualEvents` snapshot inference as the production proof.

---

# 17. Migration Success Durability

Task 2.27 identified that successful migration does not yet initialize retained active durability status to `durable`.

Correct this.

After verified V1→V2 migration:

* V2 has been durably written;
* V2 has been reread;
* V2 has been validated/verified;
* runtime adopts that exact durable graph.

Therefore retained active durability status must factually represent successful durability.

Use existing Phase 1 durability semantics.

Do not invent an incarnation-specific durability state.

---

# 18. Migration Success Desired Condition

After successful migration, the desired durable condition must correspond to the adopted Active V2 authority.

A later Retry must not:

* target V1;
* reconstruct the migration;
* omit incarnation;
* treat retained V1 as desired current state.

Add direct coverage where not already protected.

---

# 19. Migration Failure Outcome Model

Task 2.27 currently exposes public `migrationFailure` but does not retain the detailed failure subtype.

Complete the migration outcome model.

At minimum distinguish factual failure at:

* incarnation allocation;
* V2 construction/validation if independently fallible;
* serialization;
* durable write;
* reread/access;
* reread parse/validation;
* verification mismatch.

Use the narrowest representation that supports diagnosis and direct tests.

Do not put migration status into `DayFrameState`.

---

# 20. Failure Detail Semantics

Failure detail must represent **what actually failed**, not speculative cause.

Prefer a discriminated internal/private or ingress-facing type.

Example conceptual categories:

```text
allocationFailure
constructionFailure
serializationFailure
writeFailure
rereadFailure
rereadValidationFailure
verificationFailure
```

Exact naming may follow repository conventions.

Do not expose raw exception objects as durable/public state unless existing infrastructure already does so.

---

# 21. Failure Detail Retention

After migration failure, the relevant status/evidence must retain enough information for:

* current UI/recovery classification;
* tests;
* safe retry behavior;
* debugging/result reporting.

Retry or later successful migration may replace the previous factual status according to existing status semantics.

Do not create historical failure logging.

---

# 22. Migration Failure Matrix

Add direct tests for at least:

1. malformed V1 parse failure;
2. semantically invalid V1;
3. incarnation allocation failure;
4. V2 serialization failure;
5. V2 write failure;
6. V2 reread/access failure;
7. V2 reread malformed/validation failure;
8. V2 verification mismatch;
9. invalid preexisting V2;
10. unsupported/future V2 version.

For every applicable case verify:

* V1 preservation;
* V2 overwrite behavior;
* runtime adoption behavior;
* protected/recovery status;
* detailed failure classification;
* durability status where meaningful;
* no silent V1 fallback.

---

# 23. Allocation Failure

Injected allocator failure during migration must prove:

* no partial Active V2 authority;
* no incomplete runtime graph;
* no successful V2 write;
* V1 unchanged;
* failure subtype retained;
* safe retry possible.

If UUIDs were transiently allocated before a later failure, they have no lifetime authority until verified migration adoption.

---

# 24. Serialization Failure

Force serialization failure at the appropriate seam.

Prove:

* no runtime V2 adoption;
* V1 remains protected;
* no success marker incorrectly establishes authority;
* failure classified correctly.

Do not confuse serialization failure with storage write failure.

---

# 25. Write Failure

Force Active V2 durable write failure.

Prove:

* migration remains unresolved;
* no V2 runtime adoption;
* V1 unchanged;
* failure subtype retained;
* no durable-success status.

---

# 26. Reread Failure

When V2 write appears to succeed but reread fails:

* do not adopt V2 runtime;
* do not silently retry by overwriting unknown V2 bytes;
* protect uncertainty;
* classify the failure accurately;
* do not fall back to V1.

---

# 27. Reread Validation Failure

When reread returns malformed or semantically invalid V2:

* no runtime adoption;
* V2 protected;
* V1 not activated;
* migration failure/recovery state explicit;
* failure subtype distinguishes this from read-access failure.

---

# 28. Verification Mismatch

If persisted reread bytes/semantic graph do not match the candidate intended for adoption:

* no adoption;
* protect persisted V2;
* classify verification failure;
* do not overwrite automatically;
* do not fall back to V1.

Direct test required.

---

# 29. Stable V2 Rehydration

Add direct stable-rehydration coverage.

After successful migration or ordinary Active V2 persistence:

1. record every incarnation;
2. construct a fresh store over the same storage;
3. verify V2 is selected;
4. verify no new incarnation allocation occurs;
5. verify every incarnation is restored exactly;
6. verify V1 is not remigrated;
7. verify durability/ingress state reflects normal V2 authority.

Include nested sources.

---

# 30. V2-First Authority

Directly protect:

* valid V2 + valid V1 → V2;
* valid V2 + malformed V1 → V2;
* invalid V2 + valid V1 → protected V2 condition, not V1;
* unsupported V2 + valid V1 → protected unsupported condition, not V1.

V1 presence must not undermine established V2 authority.

---

# 31. V1 Established Marker

Audit and directly test `dayframe-active-v2-established`.

Confirm the marker's exact authority semantics.

At minimum it must prevent retained/historical V1 from becoming an automatic migration source after V2 authority has previously been established and current active V2 is intentionally absent.

Do not expand the marker into a generic migration-history system.

---

# 32. Clear / Reset Resurrection Protection

Directly prove:

```text
V1 exists
→ migrate successfully to V2
→ V1 retained
→ clear active data
→ restart
→ old V1 DOES NOT return
```

Verify:

* V2 removed;
* V1 treatment matches the implemented clear contract;
* marker remains/changes as required;
* runtime stays clear;
* no automatic remigration.

---

# 33. Recovery Abandonment Resurrection Protection

Directly prove:

```text
protected active state
→ abandon
→ reset runtime
→ restart
→ abandoned V1/V2 authority does not resurrect
```

Test exact key/marker behavior.

Do not merely assert in-memory reset.

---

# 34. Recovery Replacement

Complete direct recovery-replacement coverage under Active V2.

Prove:

* current safe runtime is written as valid V2;
* all sources have valid incarnation;
* current runtime incarnation is preserved;
* no Active V1 current write occurs;
* reread/source recheck behavior remains correct;
* protection clears only after successful durable replacement;
* retained durability becomes `durable`.

---

# 35. Recovery Source Recheck

Where recovery protects V2, source recheck must compare the correct protected V2 source.

Where recovery protects legacy V1 before migration, source recheck must compare V1.

Directly prove source identity/version/key is not confused.

A mutation to irrelevant retained V1 bytes must not invalidate a recovery action against protected V2.

---

# 36. Snapshot Isolation

Add direct tests proving current runtime incarnation survives cloning and cannot be mutated through returned snapshots.

Cover at least:

* `getState()`;
* authored setup clone;
* store mutation result;
* V2 rehydrated state.

Mutation of a returned object must not alter store-owned:

* `id`;
* `incarnationId`;
* nested incarnation.

---

# 37. Persistence Shape

Add direct Active V2 persistence-shape assertions.

Active V2 must contain:

* app/surface identity;
* version 2;
* authored active data;
* incarnation for every lifetime-bearing source;
* nested incarnation.

Active V2 must not contain:

* Preview;
* profiles;
* durability status;
* ingress/recovery state;
* lifecycle-operation records;
* draft provenance.

---

# 38. Active V1 Writer Retirement

Search all production writes.

Prove no ordinary current active writer still writes `dayframe-store-v1`.

Permitted V1 interaction after Task 2.27A:

* read as eligible legacy migration input;
* preserve as historical recovery material where governed;
* remove where clear/abandon explicitly requires it.

No current mutation or retry may serialize new Active V1 authority.

---

# 39. Profile V1 Shape

Protect the Task 2.27 compatibility bridge.

Saving a profile from incarnation-bearing current authority must:

* remain Profile V1;
* omit incarnation;
* preserve existing profile schema.

Do not update Profile V1 tests by merely accepting extra incarnation fields.

The absence of incarnation is intentional.

---

# 40. Profile V1 Activation

Directly prove:

* profile load produces valid current runtime incarnation;
* repeated activation of the same profile produces different active incarnations;
* readable source IDs remain as governed;
* nested relationships remain coherent;
* no incarnation is persisted into Profile V1.

This remains instantiation, not restoration.

---

# 41. Backup V1 Shape

Protect Backup V1 format integrity.

Export must:

* remain version 1;
* omit incarnation;
* preserve existing Backup V1 schema.

Do not silently evolve V1 by accepting new fields.

---

# 42. Backup V1 Import

Directly prove:

* import validates V1 artifact;
* imported active sources receive fresh incarnation;
* repeated import creates distinct active lifetimes;
* resulting current active persistence is V2;
* original backup payload remains unchanged;
* no historical continuity is fabricated.

---

# 43. Deterministic Scheduling Non-Interference

Add direct regression coverage proving incarnation has no scheduling effect.

Construct authored states that are equivalent in scheduling-relevant fields but use different valid incarnation IDs.

Compare scheduling semantics for:

* generated work blocks;
* block candidates;
* scheduled placement;
* unplaced candidates;
* friction.

Ignore identity metadata only where necessary for the comparison.

The actual schedule must be equivalent.

---

# 44. OccurrenceIdentity Non-Interference

Directly prove `OccurrenceIdentity` V1 remains unchanged by incarnation.

For otherwise equivalent source scheduling inputs with different incarnation IDs:

* generated `OccurrenceIdentity` values remain structurally equal;
* version remains 1;
* no incarnation field appears;
* canonical recurrence/work coordinates remain unchanged.

This is important because DurableOccurrenceReference remains a later layer.

---

# 45. Preview Preservation

Verify existing Preview behavior remains unchanged.

Incarnation must not change:

* stale-preview semantics;
* Preview generation requirement;
* friction detection;
* SuggestedFix generation;
* SuggestedFix application;
* Try behavior;
* accepted-fix behavior.

Do not add incarnation-driven Preview invalidation beyond ordinary authored mutation behavior.

---

# 46. Existing Test Failure Conversion

Every one of the broad-suite failures reproduced at task start must receive an explicit disposition.

For each:

## If obsolete V1-key expectation

Update it to assert the correct Active V2 contract.

## If incarnation-free runtime fixture

Update the fixture to valid current runtime identity.

## If obsolete write-count expectation

Update it to assert the actual semantic persistence contract, not an incidental old single-key implementation detail.

## If genuine implementation defect

Fix production behavior and retain/add regression coverage.

## If unrelated

Document separately and do not hide it.

The result must summarize this conversion.

---

# 47. Do Not Weaken Assertions Mechanically

Do not solve failures by:

* deleting tests;
* removing meaningful assertions;
* replacing exact semantic checks with generic truthiness;
* making incarnation optional;
* accepting either V1 or V2 behavior;
* broadly increasing call-count tolerances;
* suppressing validation.

Tests should become **more accurate**, not less protective.

---

# 48. Storage Call-Count Tests

Where old tests assert exact `getItem`, `setItem`, or `removeItem` counts because Active V1 used one key, determine the actual semantic contract.

Prefer assertions such as:

* correct key written;
* V1 not written;
* V2 verified;
* marker established;
* profiles unaffected;
* retry targets correct payload.

Retain exact call counts only when count itself is meaningful behavior.

---

# 49. Runtime Shape Tests

Where old tests compare complete runtime objects without incarnation:

* update expected current runtime shape;
* use deterministic valid test incarnations;
* preserve all previous semantic assertions.

Do not strip incarnation from current runtime just to preserve historical object equality.

---

# 50. Typecheck as Architectural Validation

`npm run typecheck` must prove current runtime source incarnation is mandatory.

The task is not complete if the codebase compiles only because current runtime types still permit missing incarnation.

Tests/fixtures must conform to the stronger model.

---

# 51. Legacy DTO Typecheck

At the same time, V1 DTOs must remain able to represent incarnation-free legacy artifacts.

The type system should distinguish:

```text
legacy durable pattern
```

from:

```text
current active source lifetime
```

without widespread unsafe casting.

---

# 52. Unsafe Cast Audit

Search for:

* `as` casts involving incarnation-bearing source types;
* non-null assertions on `incarnationId`;
* fallback generation such as `incarnationId ?? allocate...`;
* broad `any` around V1/V2 conversion.

Any such use must be justified.

Do not hide an incomplete type boundary behind casts.

---

# 53. Optional Incarnation Audit

Search production current-authority code for optional incarnation access.

Examples:

* `source.incarnationId?`
* `source.incarnationId ??`
* conditional serialization of incarnation.

For current Active V2/runtime sources, incarnation should be mandatory.

Optional handling belongs only at explicit legacy/raw boundaries.

Document exceptions.

---

# 54. Current Validator

Ensure current authored validation rejects missing or invalid incarnation.

Legacy V1 validation must remain separate.

Direct tests must distinguish:

* valid V1 without incarnation;
* invalid current/V2 without incarnation.

Do not allow generic normalization to fabricate missing incarnation in a claimed V2 payload.

---

# 55. Duplicate Incarnation Validation

Retain/add direct coverage for global active-graph uniqueness.

Include at least:

* duplicate among same source kind;
* duplicate across different top-level kinds;
* duplicate between parent and nested source;
* duplicate between two nested sources.

Valid distinct incarnations pass.

---

# 56. Canonical UUID Validation

Directly protect:

* lowercase UUID v4 accepted;
* uppercase rejected;
* wrong version rejected;
* malformed rejected;
* empty rejected.

Do not loosen the Task 2.26 contract.

---

# 57. Ordinary V2 Persistence Failure

Complete regression coverage for post-migration mutation failure.

When valid runtime mutation occurs but V2 persistence fails:

* runtime mutation remains session authority;
* incarnation consequence is correct;
* durability records failure;
* desired durable condition becomes the latest V2 snapshot;
* Retry writes V2;
* V1 is not written;
* successful Retry converges to `durable`.

This differs intentionally from initial migration adoption semantics.

---

# 58. Migration Versus Mutation Distinction

Directly protect the architectural distinction:

## Initial V1→V2 migration

No V2 runtime adoption until durable verification succeeds.

## Ordinary current V2 mutation

Runtime authority may advance even when persistence fails.

Tests must make this difference unmistakable.

---

# 59. Migration Retry

Add/complete direct migration-retry coverage.

After a retryable migration failure:

* source eligibility/recovery authority remains safe;
* retry reconstructs a complete candidate;
* no partial prior candidate becomes authority;
* successful retry writes/verifies V2;
* runtime then adopts V2;
* durability becomes `durable`.

If retry allocation creates different transient UUIDs than a previous failed attempt, this is acceptable because failed candidates never became authoritative.

---

# 60. No Partial Graph

No code path may expose a graph where only some lifetime-bearing sources have incarnation.

Add a direct assertion over a complete representative authored graph containing all seven source kinds.

After:

* migration;
* profile instantiation;
* backup instantiation;
* Setup transaction;
* V2 rehydration;

every lifetime-bearing source must satisfy current identity validation.

---

# 61. Clear Behavior

Clarify and directly test current `clearLocalData()` semantics under Active V2.

It must:

* reset active runtime as currently governed;
* remove current active durable authority;
* prevent retained V1 resurrection;
* preserve profile independence according to existing behavior;
* leave ingress/durability status coherent.

Do not redesign clear beyond the two-key/marker requirements.

---

# 62. Recovery Abandon Behavior

Clarify and directly test active-local abandonment.

Successful abandonment must not leave:

* valid V2 current authority;
* eligible V1 automatic migration source;
* stale protected evidence;
* stale desired durable condition.

Restart must remain abandoned/reset.

---

# 63. Recovery Replacement Durability

After successful recovery replacement:

* current Active V2 bytes equal the accepted current authoritative graph;
* retained durability status is `durable`;
* protected evidence is cleared;
* V1 is not newly written;
* reload restores exact incarnation.

---

# 64. Profile and Backup Independence

Active V2 completion must not alter the independent durability semantics of profiles or Backup V1 artifacts.

No profile or backup write should be required for Active V2 migration success.

No active migration failure should corrupt profiles.

Add assertions only where existing tests do not already protect this.

---

# 65. No New Durable Surface

Task 2.27A must not introduce another durable schema/version.

Permitted existing surfaces remain:

* Active V1 legacy input/historical material;
* Active V2 current authority;
* Profile V1;
* Backup V1;
* V2-established authority marker.

Do not introduce:

* Active V3;
* Profile V2;
* Backup V2;
* incarnation registry;
* migration journal.

---

# 66. No Tombstones

Do not add retired-source tombstones.

Deletion removes active source authority.

Future unresolved durable references may fail to resolve naturally.

Tombstone/history policy remains deferred.

---

# 67. No Source History

Do not persist:

* lifecycle operations;
* retired incarnation;
* mutation history;
* migration allocation history.

Task 2.27A validates current lifetime authority only.

---

# 68. No DurableOccurrenceReference

Do not implement or partially introduce:

* `DurableOccurrenceReference`;
* durable source reference;
* incarnation-aware occurrence key;
* resolver;
* canonical decision key.

Incarnation readiness is sufficient.

---

# 69. No PlanDecision

Do not implement:

* PlanDecision model;
* PlanDecision persistence;
* accepted decision history;
* replay;
* targeting;
* Try/Accept redesign.

---

# 70. No Profile V2

Do not:

* increment profile format;
* add incarnation-bearing profile representation;
* migrate profile collection;
* add Profile V2 validation.

Profile V1 bridge only.

---

# 71. No Backup V2

Do not:

* increment backup version;
* add recovery-grade incarnation-bearing backup;
* change Backup V1 schema;
* claim V1 lifetime restoration.

Backup V1 bridge only.

---

# 72. No Scheduling Changes

Do not change scheduling algorithms.

If deterministic non-interference tests fail because incarnation influences scheduling, fix the unintended identity leakage rather than changing expected schedule output.

---

# 73. No UI Expansion

No new UI feature is authorized.

Do not add:

* migration-detail UI;
* incarnation display;
* identity debugging UI;
* profile-version UI;
* backup-version UI.

Existing recovery UI may consume corrected status only if necessary to preserve current factual behavior.

---

# 74. Expected Production Changes

Likely production changes are limited to:

* runtime source type definitions;
* explicit V1 DTO boundaries/adapters;
* migration outcome/status typing;
* migration durability initialization;
* migration/retry orchestration;
* narrow recovery/clear fixes exposed by required tests.

Most remaining work should be tests and fixtures.

If broad production redesign becomes necessary, stop and report.

---

# 75. Expected Test Changes

Expect deliberate changes across tests that currently:

* construct incarnation-free runtime sources;
* inspect Active V1 current persistence;
* assume one active local-storage key;
* compare old full runtime shapes;
* assume old write counts.

Also add dedicated contract tests for the missing Task 2.27 matrices.

Do not rewrite unrelated tests.

---

# 76. Required Full-Suite Outcome

The full repository suite must pass.

Task 2.27A is not complete with known failing tests attributable to the Active V2 change.

Required:

`0 failed test files`

`0 failed tests`

If an unrelated pre-existing failure is genuinely discovered, document evidence that it predates 2.27A and stop for review rather than simply declaring completion.

---

# 77. Lint

`npm run lint` must pass.

Do not suppress new errors with broad disable directives.

---

# 78. Typecheck

`npm run typecheck` must pass with statically mandatory current incarnation.

This is a core completion criterion, not routine validation.

---

# 79. Production Build

`npm run build` must pass.

No Active V2/test-only helper may leak into production incorrectly.

---

# 80. Diff Integrity

`git diff --check` must pass.

The immutable Task 2.27A artifact must remain unchanged after execution begins.

---

# 81. Focused Validation

Before full validation, run focused suites covering at minimum:

* source incarnation;
* Active V2;
* Active V2 migration;
* dayFrameStore;
* profiles;
* backup;
* scheduling generation;
* occurrence identity;
* recovery/clear integration.

Record exact files and test counts.

---

# 82. Reference Audit

Before completion, search all production references to:

* `incarnationId`;
* `SourceIncarnationId`;
* Active V1 key;
* Active V2 key;
* V2-established marker;
* active serializer;
* active reader;
* migration;
* migration failure status;
* authored source constructors;
* lifecycle-aware Setup transaction;
* manual-event lifecycle mutation;
* profile projection/load;
* backup projection/import;
* clear;
* recovery replacement;
* recovery abandonment;
* active retry.

Confirm no unsupported path bypasses current identity authority.

---

# 83. Type Boundary Audit

Explicitly document:

* current runtime types;
* Active V1 DTOs;
* Profile V1 DTOs;
* Backup V1 DTOs;
* Active V2 DTO/envelope;
* conversion boundaries.

The result should make clear where incarnation is mandatory and where its absence is intentional.

---

# 84. Persistence Audit

Document every production writer after completion.

Expected:

## Active current authority

Active V2 only.

## Profile

Profile V1 only.

## Backup export

Backup V1 only.

## Active V1

No current writer.

If reality differs, explain and justify it against the governing architecture.

---

# 85. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.27A_COMPLETE_ACTIVE_V2_RUNTIME_IDENTITY_AND_MIGRATION_CONTRACT_VALIDATION_RESULT.md`

The result must include at least:

1. Executive Result
2. Parent Task Completion Determination
3. Artifact Integrity
4. Governing Evidence
5. Initial Full-Suite Reproduction
6. Initial Failure Classification
7. Files Changed
8. Mandatory Runtime Type Boundary
9. Legacy DTO Boundary
10. Fixture Migration
11. UUID Test Strategy
12. Runtime Completeness Invariant
13. Lifecycle Operation Integration
14. Seven-Source Lifecycle Matrix
15. Nested Reorder Semantics
16. Parent Recreation Semantics
17. Manual-Event Matrix
18. Migration Success Durability
19. Desired Durable Condition
20. Migration Outcome Model
21. Migration Failure Detail
22. Parse Failure
23. V1 Validation Failure
24. Allocation Failure
25. Serialization Failure
26. Write Failure
27. Reread Failure
28. Reread Validation Failure
29. Verification Failure
30. Stable V2 Rehydration
31. V2-First Authority
32. V2-Established Marker
33. V1 Resurrection Prevention
34. Clear / Reset
35. Recovery Abandonment
36. Recovery Replacement
37. Recovery Source Recheck
38. Snapshot Isolation
39. Active V2 Persistence Shape
40. Active V1 Writer Retirement
41. Profile V1 Compatibility
42. Profile V1 Instantiation
43. Backup V1 Compatibility
44. Backup V1 Instantiation
45. Scheduling Non-Interference
46. OccurrenceIdentity Non-Interference
47. Preview Preservation
48. Broad-Suite Failure Conversion
49. Storage Call-Count Conversion
50. Runtime Shape Conversion
51. Current Validator
52. Duplicate Incarnation Validation
53. UUID Validation
54. Ordinary V2 Persistence Failure
55. Migration Versus Mutation Durability
56. Migration Retry
57. Complete-Graph Validation
58. Profile / Backup Independence
59. Reference Audit
60. Type Boundary Audit
61. Persistence Writer Audit
62. Architectural Alignment Assessment
63. Deviations
64. Discoveries and Deferred Work
65. Recommended Next Task
66. Focused Validation
67. Full Validation
68. Final Completion Determination

---

# 86. Required Result Matrices

The result must include the following matrices.

## A. Initial Failure Disposition Matrix

| Failing test | Initial cause | Corrective action | Final status |
| ------------ | ------------- | ----------------- | ------------ |

Include all failures reproduced from the Task 2.27 broad-suite state.

## B. Source Lifecycle Matrix

| Source kind | Create fresh | Update preserves | Delete/recreate fresh | Replace fresh | Reorder preserves |
| ----------- | -----------: | ---------------: | --------------------: | ------------: | ----------------: |

Use N/A only where an operation genuinely does not exist.

## C. Migration Failure Matrix

| Failure point | Runtime adopted? | V1 preserved? | V2 protected? | Failure subtype | Retry path |
| ------------- | ---------------: | ------------: | ------------: | --------------- | ---------- |

## D. Durable Surface Matrix

| Surface | Current writer | Incarnation stored? | Current authority semantics |
| ------- | -------------- | ------------------: | --------------------------- |

Cover Active V1, Active V2, Profile V1, Backup V1, and the established marker.

## E. Runtime Type Matrix

| Representation | Incarnation required? | Purpose |
| -------------- | --------------------: | ------- |

Cover current runtime, Active V1 DTO, Active V2 DTO, Profile V1 DTO, Backup V1 DTO.

---

# 87. Completion Criteria

Task 2.27A is complete only when:

* current active runtime incarnation is statically mandatory;
* all seven lifetime-bearing source kinds satisfy that type boundary;
* legacy V1 absence of incarnation is isolated to explicit DTO/adapter boundaries;
* no production current-authority path produces incarnation-less sources;
* create allocates;
* update preserves;
* delete/recreate allocates fresh;
* replace allocates fresh;
* nested reorder preserves;
* parent recreation rotates parent and recreated nested lifetimes;
* manual events satisfy the full lifecycle contract;
* successful migration initializes correct durable status;
* desired durable condition targets Active V2;
* migration failure retains meaningful factual subtype;
* the required migration failure matrix is directly tested;
* stable V2 rehydration preserves exact incarnation;
* valid V2 outranks V1;
* invalid/unsupported V2 never silently falls back;
* V1 resurrection remains impossible after clear/abandon;
* recovery replacement writes and verifies V2;
* recovery abandonment survives restart;
* snapshot isolation is directly protected;
* Active V2 persistence shape is directly protected;
* no current Active V1 writer remains;
* Profile V1 remains incarnation-free and activates fresh lifetimes;
* Backup V1 remains incarnation-free and imports fresh lifetimes;
* incarnation does not alter scheduling;
* `OccurrenceIdentity` V1 does not change;
* all Task 2.27-caused broad-suite failures are deliberately converted or fixed;
* full test suite passes with zero failures;
* lint passes;
* typecheck passes;
* production build passes;
* `git diff --check` passes;
* no Profile V2 is introduced;
* no Backup V2 is introduced;
* no DurableOccurrenceReference is introduced;
* no PlanDecision behavior is introduced;
* the result artifact is complete;
* Task 2.27 can consequently be accepted as complete.

---

# 88. Explicit Non-Goals

Do **not**:

* redesign source incarnation;
* change UUID representation;
* reconsider Task 2.26's durable-surface decisions;
* introduce Active V3;
* implement Profile V2;
* implement Backup V2;
* persist incarnation in Profile V1;
* persist incarnation in Backup V1;
* implement DurableOccurrenceReference;
* modify `OccurrenceIdentity` V1;
* implement PlanDecision;
* persist PlanDecision;
* redesign scheduling;
* redesign Preview;
* add source tombstones;
* add source history;
* introduce event sourcing;
* expose incarnation in UI;
* delete meaningful failing tests instead of converting them;
* make current incarnation optional;
* loosen UUID validation;
* silently accept either V1 or V2 behavior;
* hide migration failures behind generic success;
* change unrelated Phase 2 behavior.

---

# 89. Stop Conditions

Stop and report rather than broadening scope if:

* making incarnation statically mandatory requires changing Profile V1 or Backup V1 durable schemas;
* an accepted Task 2.26 decision proves internally inconsistent;
* V1 resurrection prevention cannot be maintained under clear/recovery semantics without new architecture;
* detailed migration failure classification requires a new durable state surface;
* a current production path still fundamentally lacks lifecycle authority after Task 2.25;
* scheduling behavior genuinely depends on incarnation by architectural necessity;
* `OccurrenceIdentity` V1 must change to make Active V2 function;
* fixing the broad suite requires weakening an unrelated established contract;
* an unrelated repository regression prevents a clean full-suite determination.

Recommend the narrowest prerequisite and preserve the incomplete parent-task status.

---

# 90. Recommended Follow-On Boundary

If Task 2.27A completes successfully:

1. formally accept Task 2.27 as complete;
2. create a Phase 2 checkpoint if appropriate;
3. proceed to the next genuine architectural seam as **Task 2.28**.

Task 2.28 should implement the independently versioned **Profile V2 reusable-pattern format and fresh-lifetime instantiation contract** established by Task 2.26.

Backup V2 should remain a later independent task.

DurableOccurrenceReference should remain blocked until the required incarnation-bearing durable surfaces have been implemented and reviewed.

---

# 91. Task Determination

**Authorized:** completion of Task 2.27 through mandatory current-runtime incarnation typing, explicit legacy DTO separation, migration/durability outcome completion, required lifecycle/migration/recovery/persistence/scheduling regression matrices, deliberate conversion of obsolete V1-era tests, and restoration of a fully green repository validation state.

**Not authorized:** reconsideration of the accepted incarnation architecture, new durable formats beyond Active V2, Profile V2, Backup V2, DurableOccurrenceReference, PlanDecision, scheduling redesign, source history, or UI feature expansion.

Task 2.27A must preserve the historical truth of the work:

> Task 2.27 substantially implemented Active V2 but did not meet its own completion criteria. Task 2.27A exists to finish and prove that implementation, not to retroactively redefine Task 2.27 as having already been complete.

---

# 92. Final Completion Statement

**Task 2.27A is complete when DayFrame's Active V2 implementation fully satisfies the unfinished Task 2.27 contract: incarnation is statically mandatory throughout current active runtime authority and isolated from legacy incarnation-free DTOs; all seven source lifecycles, migration success and failure outcomes, stable rehydration, recovery, clear/abandon resurrection protection, snapshot isolation, persistence shape, Profile V1 and Backup V1 compatibility, scheduling non-interference, and OccurrenceIdentity V1 preservation are directly protected; every obsolete V1-era regression expectation is deliberately converted without weakening its semantic protection; the complete repository test suite, lint, typecheck, production build, and diff validation pass; and Task 2.27 can then be accepted as complete without introducing Profile V2, Backup V2, DurableOccurrenceReference, or PlanDecision behavior.**
