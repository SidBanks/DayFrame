# Task 2.28 — Implement Profile V2 Reusable-Pattern Format and Fresh-Lifetime Instantiation

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded durable-surface implementation task.

Task 2.28 implements the independently versioned **Profile V2** durable format established by Task 2.26.

This task must preserve the architectural meaning of a saved profile:

> A profile is a reusable authored pattern artifact, not a recovery artifact and not a preserved active source lifetime.

Therefore Profile V2 must remain **incarnation-free as durable pattern data**, while every activation of a profile must instantiate a complete fresh active source-lifetime graph.

Task 2.28 does **not** implement Backup V2, DurableOccurrenceReference, PlanDecision persistence, scheduling changes, or source-history infrastructure.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. verify that Tasks 2.27 and 2.27A are accepted as complete;
6. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.28_IMPLEMENT_PROFILE_V2_REUSABLE_PATTERN_FORMAT_AND_FRESH_LIFETIME_INSTANTIATION_RESULT.md`

If implementation demonstrates that Profile V2 cannot be safely introduced without simultaneously changing Backup V1/V2 or Active V2 semantics, stop the affected work and report the dependency rather than broadening scope.

---

# 2. Purpose

Tasks 2.24–2.27A established the complete active source-incarnation foundation:

* active source lifetime identity is explicit;
* current active runtime incarnation is mandatory;
* Active V2 persists exact current source lifetimes;
* source creation allocates fresh incarnation;
* source update preserves incarnation;
* delete/recreate creates a new lifetime;
* Active V1 is legacy migration material only;
* Active V2 is current active authority;
* Profile V1 remains incarnation-free;
* loading a profile instantiates fresh active lifetimes;
* repeated activation of the same profile creates distinct active lifetimes.

Task 2.27A completed the runtime and migration contract and left Profile V2 as the next independent durable-surface task.

The remaining profile question is therefore not whether profile activation should preserve incarnation.

That decision is already settled:

> It must not.

The task is now to give profiles their own explicit versioned durable representation consistent with their semantics as reusable patterns.

---

# 3. Governing Architectural Decisions

Task 2.28 is governed by:

* Task 2.24 source-incarnation semantics;
* Task 2.25 lifecycle-operation authority;
* Task 2.26 durable source-incarnation ADR;
* Task 2.27 Active V2 implementation;
* Task 2.27A completion validation;
* the Phase 1 durable-data compatibility and independent format-versioning ADR.

The following decisions are already settled and must not be reopened:

1. active runtime source incarnation is mandatory;
2. Active V2 persists incarnation;
3. profiles are reusable authored patterns;
4. profiles do not represent restoration of active source lifetimes;
5. activation of a profile instantiates fresh active lifetimes;
6. repeated activation of the same profile must produce different incarnations;
7. Profile V1 is incarnation-free;
8. profile format versioning is independent from Active V2 and Backup formats;
9. profile activation must produce valid current Active V2 authority;
10. Backup V2 remains a separate later task.

---

# 4. Architectural Objective

After Task 2.28:

```text
PROFILE DURABLE AUTHORITY

Profile V1
    historical reusable-pattern format
        ↓
versioned profile migration/conversion
        ↓
Profile V2
    explicit reusable-pattern DTO
    incarnation-free
    independently versioned
        ↓
profile activation
        ↓
fresh active source-lifetime instantiation
        ↓
Current Active Runtime
    incarnation mandatory
        ↓
Active V2 persistence
```

Profile V2 must never claim to restore the source lifetimes from which the profile was originally saved.

---

# 5. Profile Semantic Definition

Adopt as an executable invariant:

> A saved profile represents reusable authored scheduling pattern data and profile metadata. It is not a snapshot of current active source lifetime identity.

Therefore a profile may preserve:

* source readable IDs;
* source relationships;
* scheduling fields;
* recurrence definitions;
* manual-event definitions if they remain part of the governed profile pattern;
* preview-range configuration;
* scheduling preferences;
* profile name;
* profile timestamp/metadata.

But Profile V2 must not preserve **active source incarnation**.

---

# 6. Profile V2 Scope

Implement Profile V2 for the current saved-profile durable surface.

Determine and preserve the currently supported profile collection semantics:

* multiple named profiles;
* save;
* same-name replacement;
* delete;
* load/activate;
* durable profile collection;
* profile metadata;
* profile-data normalization;
* profile durability/retry behavior;
* invalid-profile handling.

Do not introduce new user-visible profile features.

---

# 7. Required Initial Audit

Before changing code, inspect:

* current profile collection key;
* current Profile V1 envelope/collection shape;
* profile version discriminator;
* `dayFrameProfiles.ts`;
* profile clone helpers;
* profile save path;
* same-name replacement behavior;
* profile delete path;
* profile load path;
* current Profile V1 validator/normalizer;
* current invalid-profile handling;
* profile persistence helper;
* profile durability status;
* profile desired-durable-condition behavior;
* profile Retry behavior;
* profile tests;
* active instantiation adapter;
* Active V2 interaction after profile load.

Record current Profile V1 behavior before implementation.

---

# 8. Profile V2 Versioning

Introduce an explicit independently versioned Profile V2 format.

Profile V2 must have an unambiguous discriminator establishing:

* application;
* durable surface;
* profile format version;
* profile collection data.

Follow the format/versioning conventions established by the Phase 1 ADR and Active V2 where appropriate.

Do not reuse Active V2's version as the profile version.

---

# 9. Profile V2 Key

Determine whether the accepted profile versioning contract requires:

* a distinct Profile V2 storage key;
* or a versioned envelope under the existing profile key.

Prefer the implementation that best satisfies the governing independent-versioning and non-destructive migration contract.

The task result must explicitly document the chosen key/version strategy.

Do not infer that Active V2's separate-key strategy must automatically be copied if profile semantics differ.

---

# 10. Profile V2 DTO

Introduce an explicit Profile V2 durable DTO.

The DTO must be semantically separate from:

* current incarnation-bearing active runtime sources;
* Active V2 DTO;
* Backup V1/V2 DTOs.

Profile V2 source pattern objects must be incarnation-free.

Do not make `incarnationId` optional on current runtime types to share one shape.

---

# 11. Profile Pattern Source Types

Use explicit pattern/source DTOs for profile durability.

The profile representation must be capable of preserving:

* block templates;
* block recurrences;
* manual events;
* shift definitions;
* shift cycles;
* nested segments;
* nested sequence entries;
* scheduling preferences;
* preview range.

It must preserve readable IDs and references needed to reconstruct the pattern.

It must not carry active lifetime identity.

---

# 12. `DayFrameAuthoredPattern` Boundary

Task 2.27A established `DayFrameAuthoredPattern` as an incarnation-free representation.

Assess whether it is the correct canonical basis for Profile V2.

If yes, use it explicitly.

If Profile V2 requires profile-specific wrapping or metadata, keep the pattern DTO separate from the profile envelope.

Do not expand `DayFrameAuthoredPattern` with profile-only metadata.

---

# 13. Profile V2 Profile Record

Each saved profile must preserve its governed metadata.

At minimum audit and retain current semantics for:

* profile ID;
* profile name;
* saved timestamp;
* profile data.

If profile ID itself has versioning/lifetime semantics, preserve current behavior unless this task exposes an actual conflict.

Do not introduce profile incarnation.

---

# 14. Profile V2 Collection

Define the V2 collection/envelope shape explicitly.

It must support:

* zero profiles;
* one profile;
* multiple profiles;
* same-name replacement semantics;
* deletion;
* independent validation of collection and entries.

Do not embed Active V2 state into the profile collection.

---

# 15. Incarnation Exclusion

Profile V2 must explicitly exclude active source incarnation.

Add direct persistence-shape tests proving no profile source contains:

`incarnationId`

This must remain true even when the profile is saved from an incarnation-bearing active runtime.

---

# 16. Save Projection

Saving the current active setup as a profile must project:

```text
Current Active Runtime
    incarnation-bearing
        ↓
profile-pattern projection
        ↓
Profile V2
    incarnation-free
```

The projection must preserve all governed pattern semantics while deliberately dropping active lifetime identity.

---

# 17. Save Does Not Mutate Active Authority

Saving a profile must not:

* rotate active incarnation;
* allocate new active incarnation;
* stale Preview merely because profile persistence changed;
* alter active scheduling authority;
* change Active V2 bytes unless existing behavior independently requires it.

Profile saving is a secondary durable artifact operation.

---

# 18. Load / Activation Semantics

Loading a Profile V2 profile must:

1. validate the profile pattern;
2. instantiate a complete fresh active source graph;
3. allocate fresh incarnation for every lifetime-bearing source;
4. preserve readable IDs/relationships according to profile pattern semantics;
5. validate the resulting current active graph;
6. replace active authored authority according to existing profile-load semantics;
7. clear Preview according to existing behavior;
8. persist the resulting active graph as Active V2;
9. preserve the saved profile collection.

---

# 19. Fresh-Lifetime Instantiation

Directly prove that activation does not preserve any prior active lifetime.

If a profile was saved from active sources with incarnations:

`A, B, C`

loading that profile must create:

`D, E, F`

where no new active incarnation equals the source incarnation from which the profile was saved.

Because Profile V2 does not persist those source incarnations, this should arise naturally from explicit instantiation.

---

# 20. Repeated Activation

Directly prove:

```text
load Profile P
    → active incarnations set A

load Profile P again
    → active incarnations set B

A != B
```

while:

* readable source IDs remain equivalent;
* scheduling pattern data remains equivalent;
* source relationships remain valid.

Repeated activation represents repeated instantiation.

---

# 21. Profile Replacement By Name

Preserve existing same-name profile replacement semantics.

Audit whether replacing a saved profile:

* retains profile ID;
* creates a new profile ID;
* updates `savedAt`;
* preserves collection ordering.

Do not change these semantics unless required by current evidence.

Profile replacement changes the reusable pattern artifact, not active source incarnation.

---

# 22. Profile Delete

Deleting a profile must:

* remove only the profile artifact;
* preserve active authored authority;
* preserve Active V2;
* preserve Preview;
* update profile durability only.

Do not interpret profile deletion as source-lifetime deletion.

---

# 23. Profile V1 Reader Preservation

Retain Profile V1 as a supported historical durable-data input.

Do not delete its reader.

Profile V1 contains incarnation-free pattern data and therefore remains semantically convertible to Profile V2.

---

# 24. Profile V1 → V2 Migration

Define and implement the conversion/migration from Profile V1 to Profile V2.

Because both surfaces represent reusable patterns and neither should contain active source incarnation, the migration should not allocate active incarnation merely to rewrite profile storage.

The conversion should operate on pattern data.

---

# 25. Migration Authority

Profile migration must be owned by the profile durable surface.

Do not require active-state migration or active-source incarnation allocation as a prerequisite merely to convert profile storage.

Profiles are independently versioned durable user data.

---

# 26. Migration Ordering

Use a safe migration sequence consistent with Phase 1 durability governance.

At minimum:

1. acquire Profile V1 raw source;
2. preserve raw source evidence;
3. parse;
4. validate/normalize individual entries;
5. preserve invalid/unsupported entries non-destructively according to profile policy;
6. construct Profile V2 collection;
7. validate V2;
8. serialize;
9. write V2;
10. reread;
11. validate/verify;
12. only then treat Profile V2 as established current profile authority.

Do not destroy V1 before verified V2 persistence.

---

# 27. Invalid Profile Preservation

Task 2.26 and earlier profile work identified stronger recovery requirements for profiles.

Task 2.28 must not silently discard invalid individual profiles merely because the rest of the collection can migrate.

Determine the existing invalid-entry behavior and improve only as required by the accepted durable-data policy.

At minimum, an invalid entry must not be silently rewritten as a default/empty valid profile.

---

# 28. Collection-Level Versus Entry-Level Failure

Distinguish:

## Collection-level corruption

The profile collection cannot be parsed/interpreted safely.

## Entry-level invalidity

The collection is understood, but one or more profiles are invalid.

Task 2.28 must define migration/preservation behavior for both.

Do not collapse them.

---

# 29. Quarantine / Preserved Invalid Entry

If the governing evidence requires preserving invalid individual profile data outside the active valid collection, implement the narrowest non-destructive representation.

Possible approaches include:

* raw invalid-entry preservation in the V2 envelope;
* quarantine collection;
* migration-recovery structure.

Do not invent a user-facing repair workflow unless necessary.

The result must explain exactly how invalid user-authored profile data is preserved.

---

# 30. Unsupported Profile Version

A future/unknown profile format version must:

* not be parsed as V2;
* not be silently downgraded;
* not be overwritten automatically;
* be preserved for recovery/conversion.

Reuse existing profile durability/recovery infrastructure where possible.

---

# 31. Profile V2 Validation

Validate at least:

* envelope identity;
* profile version;
* collection structure;
* profile IDs;
* names;
* timestamps;
* pattern data;
* current authored-pattern semantic validity where applicable;
* duplicate profile identifiers;
* any required uniqueness rules.

Do not validate active source incarnation because Profile V2 does not contain it.

---

# 32. Profile Pattern Validation

Use the incarnation-free pattern validator, not current Active V2 runtime validation.

Do not instantiate active source incarnation merely to determine whether a profile pattern is structurally valid.

Pattern validity and active lifetime instantiation are distinct operations.

---

# 33. Activation Validation

After a valid profile pattern is instantiated:

* validate the complete current active graph;
* validate all newly allocated incarnation;
* validate global active incarnation uniqueness;
* validate source references.

A pattern may be valid while a specific instantiation fails due to allocator failure.

Keep these outcomes separate.

---

# 34. Allocation Failure During Load

If active incarnation allocation fails while activating a valid profile:

* do not partially replace active runtime;
* do not alter the profile artifact;
* do not persist incomplete Active V2;
* preserve current active authority;
* report a factual activation failure through the existing workflow/result boundary.

Do not classify the profile itself as malformed merely because active instantiation failed.

---

# 35. Active Persistence Failure After Load

Profile activation can validly instantiate and replace session authority while Active V2 persistence subsequently fails.

Preserve established active durability semantics:

* runtime/session authority may advance;
* active durability records failure;
* retry targets latest Active V2 snapshot.

The profile durable surface remains independent.

---

# 36. Profile Persistence Failure

Saving/deleting/migrating profiles must use the existing profile durability status and desired durable condition.

Do not use active durability status for profile writes.

No profile write failure should invalidate otherwise valid active runtime authority.

---

# 37. Profile Retry

Update profile Retry semantics to target Profile V2 once V2 authority is established.

Retry must never emit Profile V1 as current profile authority.

Retain V1 only as compatibility/historical material according to the migration design.

---

# 38. Profile V1 Writer Retirement

After Task 2.28:

* production profile writers must emit Profile V2 only;
* Profile V1 remains reader/migration compatibility only.

Search and prove no production current profile write still writes a V1 collection.

---

# 39. Profile V1 Resurrection Prevention

If Profile V1 is retained after successful Profile V2 migration, it must not automatically become current profile authority later merely because Profile V2 becomes intentionally empty/absent.

Audit whether a migration-established marker or equivalent authority rule is required.

Do not repeat the Active V1 resurrection defect on the profile surface.

---

# 40. Profile Clear Interaction

Audit `clearLocalData()` and any profile-clear semantics.

Task 2.27A currently establishes that clear independently clears profiles.

Once Profile V2 exists:

* profile durable authority must be correctly removed;
* retained Profile V1 must not resurrect;
* active/profile independence must remain explicit.

Add direct restart coverage.

---

# 41. Profile Delete-All / Empty Collection

An intentionally empty Profile V2 collection is valid current authority.

Do not treat empty V2 as equivalent to "no V2 ever existed" if doing so could remigrate retained V1.

This may require explicit establishment semantics.

---

# 42. Profile V2 Authority Precedence

Once valid Profile V2 authority exists:

* V2 outranks retained Profile V1;
* V1 is not automatically remigrated;
* invalid V2 must not silently fall back to V1.

This mirrors the epistemic principle established for Active V2, even if implementation details differ.

---

# 43. Invalid Profile V2

If Profile V2 is present but invalid:

* protect V2;
* do not silently activate V1;
* do not overwrite V2;
* preserve raw evidence;
* expose truthful profile recovery/durability status.

Do not substitute an empty profile collection and call it success.

---

# 44. Profile V2 Reread Verification

For migration and any profile-recovery operation requiring verified durable establishment:

* write;
* reread;
* parse;
* validate;
* compare intended semantic graph or exact bytes as appropriate.

Do not mark migration success solely because `setItem` returned.

---

# 45. Profile Migration Durability

Successful Profile V1→V2 migration should initialize retained profile durability status consistently with the fact that verified current Profile V2 data is durably stored.

Use the same factual durability principles established by 2.27A for active migration.

---

# 46. Profile Migration Failure Detail

Assess whether the existing profile durability/recovery model already retains enough factual migration detail.

If not, add the narrowest profile-ingress migration outcome classification.

Do not reuse Active migration failure types if that would falsely couple the surfaces.

---

# 47. Profile Migration Failure Matrix

Directly cover at minimum:

* V1 parse failure;
* V1 collection validation failure;
* invalid individual entry;
* V2 serialization failure;
* V2 write failure;
* V2 reread failure;
* V2 reread validation failure;
* V2 verification mismatch;
* invalid preexisting Profile V2;
* unsupported future Profile V2.

For each, assert preservation and no silent V1 fallback.

---

# 48. Active/Profile Independence

Directly prove:

* Profile V2 migration does not rewrite Active V2;
* Active V2 failure does not corrupt profiles;
* profile save/delete does not rotate active source incarnation;
* profile migration does not rotate active source incarnation;
* profile activation does rotate/instantiate active source incarnation because that is an active replacement action, not because profile storage itself changed.

---

# 49. Saved Profile Collection Runtime Representation

Determine whether current runtime `savedProfiles` should hold:

* Profile V2 pattern records;
* a normalized in-memory profile model;
* another explicit runtime representation.

Whatever model is used must not carry active source incarnation.

Do not make `savedProfiles` an accidental copy of active runtime source types.

---

# 50. `DayFrameState.savedProfiles`

Task 2.1 classified `savedProfiles` as secondary authoritative artifacts.

Task 2.28 may refine their type boundary but must preserve their semantic role.

They are:

* authoritative saved reusable patterns;
* not active scheduling authority until loaded;
* not derived Preview state;
* not active source lifetime identity.

---

# 51. Profile Cloning

Profile clones must preserve:

* profile metadata;
* readable IDs;
* pattern data.

They must remain incarnation-free.

Returned profile snapshots must not share mutable references with store-owned profile data.

Direct regression coverage required.

---

# 52. Profile Save From Active Runtime

When projecting current active runtime into a profile:

* readable source IDs are copied;
* scheduling relationships are copied;
* active incarnation is dropped;
* Preview is dropped;
* active durability/ingress status is dropped;
* PlanDecision is absent because it does not exist yet.

Add a direct shape test.

---

# 53. Manual Events in Profiles

Preserve current governed profile inclusion of manual events.

Profile V2 manual events remain reusable pattern data and therefore have no active incarnation.

On activation they receive fresh active incarnation.

Do not remove manual events from profiles under this task.

---

# 54. Nested Source Pattern Preservation

Profile V2 must preserve:

* cycle readable IDs;
* nested segment IDs;
* sequence-entry IDs;
* shift-definition references;
* relative ordering/configuration.

On activation:

* cycle gets fresh active incarnation;
* each segment/sequence entry gets fresh active incarnation;
* relationships remain coherent.

---

# 55. Profile Activation and Preview

Preserve current behavior:

* profile activation replaces active authored setup;
* saved profile collection remains preserved;
* Preview is cleared.

Do not change this to mark Preview stale.

Full active replacement retains the current replacement semantics.

---

# 56. Profile Activation and Setup Draft

Existing subscriptions may rebuild Setup draft from committed active state after profile load.

Preserve current behavior.

Do not add retained unsaved-draft history.

---

# 57. Profile Activation and PlanDecision

PlanDecision does not exist yet.

Do not create placeholder decision invalidation state.

Task 2.23 already established that future profile activation will require explicit PlanDecision revalidation/replacement semantics.

Keep that deferred.

---

# 58. Profile V2 and Backup V1

Do not alter Backup V1 merely because profile format evolves.

Backup V1 remains incarnation-free portable authored pattern under its current contract until the later Backup V2 task.

No Profile V2 metadata belongs in Backup V1.

---

# 59. Profile V2 and Active V2

Do not embed Profile V2 collection into Active V2.

Keep separate keys/surfaces and independent durability.

Active V2 continues excluding profiles.

---

# 60. Profile Format Compatibility

Document the final supported matrix:

* Profile V1 → current runtime;
* Profile V2 → current runtime;
* current runtime → Profile V2;
* unsupported future profile version;
* corrupt Profile V1;
* corrupt Profile V2.

Do not claim compatibility that is not directly protected.

---

# 61. Legacy Singular `shiftCycle`

Preserve historical Profile V1 compatibility for singular-only `shiftCycle` where currently governed.

Migration/normalization should continue promoting legacy singular data into the current plural pattern representation.

Profile V2 writers must emit plural-only current pattern data.

Do not reintroduce singular output.

---

# 62. Profile V2 Writer Shape

Profile V2 must emit:

* plural `shiftCycles`;
* no singular `shiftCycle`;
* no active incarnation;
* current normalized pattern representation;
* explicit profile version.

Direct persistence-shape coverage required.

---

# 63. Profile V1 Migration Convergence

After successful migration to Profile V2:

* future profile writes use V2;
* current normalized patterns use plural current fields;
* V1 remains historical/compatibility material according to chosen retention policy;
* no current writer emits legacy singular fields.

---

# 64. Profile ID Semantics

Audit profile IDs separately from source IDs.

Do not add source incarnation semantics to profile IDs.

A profile itself may have a stable artifact ID independent from the source lifetimes it instantiates.

Preserve current profile ID behavior unless an actual contradiction is discovered.

---

# 65. Same-Name Replacement

If save by same name replaces an existing profile, determine whether:

* profile artifact ID remains stable;
* metadata timestamp changes;
* durable collection ordering changes.

Preserve existing semantics and directly protect them.

This operation does not preserve or restore active source lifetimes because those are not stored.

---

# 66. Profile Collection Ordering

Preserve existing deterministic profile ordering.

Migration must not silently reorder profiles unless current normalization already defines a canonical order.

If order is user-visible, treat it as part of durable behavior.

---

# 67. Profile Timestamps

Preserve current timestamp semantics.

Do not reinterpret `savedAt` as source lifetime evidence.

Profile timestamps are profile metadata only.

---

# 68. Profile Migration Baseline

Unlike Active V1 migration, Profile V1→V2 migration does **not** establish source incarnation baselines.

It establishes only a new durable reusable-pattern representation.

State this explicitly.

---

# 69. Epistemic Boundary

Adopt as an explicit invariant:

> A profile can reproduce a scheduling pattern, but it cannot prove continuity with the active source lifetimes from which that pattern was originally saved.

Therefore profile activation always authors/instantiates fresh active lifetime identity.

---

# 70. Allocation During Activation

Use the same authoritative source-incarnation allocator used for active source creation.

Do not invent a profile-specific UUID scheme.

The activation adapter owns complete graph instantiation.

---

# 71. Activation Atomicity

Profile activation must construct and validate the complete incarnation-bearing active graph before replacing active runtime authority.

No partially instantiated active graph may become authoritative.

If allocation or validation fails:

* current active state remains unchanged;
* profile remains unchanged;
* no partial Active V2 write occurs.

---

# 72. Profile Save Atomicity

Profile save/replace must preserve existing atomic collection behavior.

If the profile write fails:

* runtime profile collection behavior must follow the established store/durability authority contract;
* durability failure must remain observable;
* desired durable condition must retain the intended latest Profile V2 collection.

Do not introduce partial entry writes.

---

# 73. Profile Delete Atomicity

Deleting a profile should produce one coherent next profile collection.

Persistence failure follows established profile durability semantics.

Do not delete durable bytes entry-by-entry if the current collection writer is atomic.

---

# 74. Profile Desired Durable Condition

After Profile V2 authority is established, desired durable condition for profiles must represent:

* the latest Profile V2 collection snapshot; or
* absence where the governed operation requires it.

Retry must target V2.

---

# 75. Profile Durability Subscription

Preserve existing profile durability subscription semantics.

Do not add profile migration status to ordinary `DayFrameState`.

UI awareness should continue deriving from store-level durability/recovery status.

---

# 76. Existing UI

No new profile UI feature is required.

Existing:

* save profile;
* load profile;
* delete profile;
* profile Retry/durability feedback;

must continue to work.

Only adjust copy if current wording becomes factually wrong under Profile V2.

Prefer no user-visible change.

---

# 77. Profile Recovery Actions

Audit whether current recovery actions apply to profile durability only through Retry, or whether any destructive profile recovery path exists.

Do not invent destructive profile recovery in this task.

If Profile V2 invalid ingress requires additional recovery semantics not already governed, stop and identify the prerequisite rather than improvising.

---

# 78. Invalid Entry User Preservation

Profiles are user-authored durable data.

Do not silently drop invalid profiles during migration simply so a V2 collection can be written.

If the current system lacks a complete preservation mechanism, this task must either:

* implement the narrow required quarantine/preservation boundary; or
* stop under the relevant condition and recommend the smallest prerequisite.

---

# 79. No Incarnation Registry

Do not introduce a profile/source incarnation registry.

Profile patterns do not own active lifetime identity.

Fresh active incarnation is generated at activation time only.

---

# 80. No Profile Source Lifetime

Do not invent "profile incarnation" for each pattern source unless the accepted Task 2.26 ADR explicitly requires artifact-local pattern identity.

Profile V2's purpose is reusable pattern durability.

If artifact-internal stable identity is needed for migration or profile editing, distinguish it clearly from active `SourceIncarnationId`.

---

# 81. No Backup V2

Do not implement Backup V2.

Do not add incarnation to backup export.

Do not change Backup V1's recovery claim beyond preserving truthful existing behavior.

Backup V2 will be a separate task.

---

# 82. No DurableOccurrenceReference

Do not implement:

* durable occurrence references;
* incarnation-aware target keys;
* resolvers;
* conflict-reference serialization.

Profile V2 is still upstream durable-surface work.

---

# 83. No PlanDecision

Do not implement:

* PlanDecision;
* accepted decision authority;
* decision persistence;
* replay;
* profile decision capture.

Profiles remain reusable authored setup patterns only.

---

# 84. No Scheduling Changes

Do not modify:

* schedule generation;
* recurrence expansion;
* placement;
* friction;
* SuggestedFix;
* Preview behavior;
* `OccurrenceIdentity` V1.

Profile V2 affects durable artifacts and activation only.

---

# 85. No Active V2 Redesign

Do not reopen Active V2 architecture.

Only make narrow Active V2 integration changes required for profile activation to persist valid current authority.

Any broader Active V2 problem should be treated as a stop condition.

---

# 86. Profile V2 Test Requirements — Save

Direct tests must prove:

* current active setup can save as Profile V2;
* saved profile contains complete governed pattern;
* saved profile contains no incarnation;
* Active V2 is unchanged;
* Preview is unchanged;
* profile metadata preserved;
* profile durability converges correctly.

---

# 87. Profile V2 Test Requirements — Load

Direct tests must prove:

* valid Profile V2 loads successfully;
* all seven active source kinds receive incarnation;
* activation replaces all active authored fields;
* profiles remain preserved;
* Preview clears;
* Active V2 persists the instantiated graph;
* profile bytes remain unchanged by activation.

---

# 88. Repeated Activation Test

Load same Profile V2 twice.

Prove:

* identical pattern semantics;
* different active incarnation for every lifetime-bearing source;
* valid Active V2 after each activation.

---

# 89. Profile V1 Migration Success Test

Start with valid Profile V1 collection.

Prove:

* V1 parsed/normalized;
* V2 constructed incarnation-free;
* V2 durably written;
* reread verified;
* V2 becomes current profile authority;
* future writes target V2;
* V1 retained or retired only according to explicit migration policy.

---

# 90. Legacy Singular Profile Test

Profile V1 containing singular-only historical `shiftCycle`:

* remains readable;
* migrates to plural Profile V2 pattern;
* Profile V2 contains no singular output;
* activation creates plural current active state with fresh incarnation.

---

# 91. Invalid Collection Test

Malformed Profile V1 or Profile V2 collection:

* no silent reset;
* no destructive overwrite;
* raw data protected;
* no silent fallback from invalid V2 to V1.

---

# 92. Invalid Entry Test

Collection containing one valid profile and one invalid profile:

* valid data preserved;
* invalid raw user data preserved according to adopted strategy;
* migration does not silently lose the invalid entry;
* status truthfully reflects partial/recovery condition.

---

# 93. Unsupported Version Test

Future Profile V2+ version:

* not interpreted as V2;
* not overwritten;
* no V1 fallback;
* explicit protected/unsupported status.

---

# 94. Profile Migration Serialization Failure

Force serialization failure.

Prove:

* no V2 authority established;
* V1/raw source preserved;
* no false durable success;
* migration/recovery status factual.

---

# 95. Profile Migration Write Failure

Force storage write failure.

Prove:

* no verified V2 authority;
* raw source protected;
* status factual;
* retry/recovery remains possible.

---

# 96. Profile Migration Reread Failure

Write succeeds but reread fails.

Prove:

* V2 authority not adopted blindly;
* uncertainty protected;
* no V1 fallback;
* factual status retained.

---

# 97. Profile Verification Failure

Persisted reread differs semantically from intended V2 collection.

Prove:

* no adoption;
* persisted source protected;
* no automatic overwrite;
* explicit failure.

---

# 98. Save Failure Test

Post-migration ordinary save with Profile V2 write failure:

* session profile collection follows current store-authority semantics;
* profile durability records failure;
* desired durable condition retains latest V2 profile collection;
* Retry writes V2;
* active state unchanged.

---

# 99. Delete Failure Test

Profile delete with persistence failure:

* session collection reflects governed runtime mutation;
* durability failure retained;
* retry targets Profile V2;
* active state unchanged.

---

# 100. Profile Retry Test

After profile V2 persistence failure:

* Retry writes Profile V2;
* no Profile V1 current write;
* success converges to durable;
* latest desired collection wins.

---

# 101. Empty Collection / Resurrection Test

Prove:

```text
migrate Profile V1 → V2
delete profiles / establish empty V2
restart
```

does not restore retained V1 profiles.

This is mandatory.

---

# 102. Clear / Restart Test

After clear:

* profile V2 authority removed according to clear contract;
* retained Profile V1 cannot resurrect;
* active state remains cleared;
* restart remains cleared.

---

# 103. Clone Isolation Test

Returned saved-profile snapshots:

* remain incarnation-free;
* are deeply cloned sufficiently to prevent mutation of store-owned pattern data.

---

# 104. Persistence Shape Test

Assert Profile V2:

* explicit app/surface/version;
* profile collection;
* normalized plural pattern data;
* profile metadata;
* no source incarnation;
* no Preview;
* no active durability state;
* no ingress/recovery state;
* no lifecycle operations;
* no PlanDecision.

---

# 105. Writer Retirement Test

Search and direct assertions must prove:

* no current production writer emits Profile V1;
* Profile V1 remains reader/migration only.

---

# 106. Active Incarnation Non-Interference

Saving/migrating/deleting profiles must not alter active source incarnation.

Directly record active incarnation before profile operation and compare afterward.

Loading profile is the intentional exception because it instantiates a new active graph.

---

# 107. Scheduling Equivalence

Profile activation of equivalent pattern must preserve scheduling semantics despite fresh active incarnation.

Where useful, compare generated schedule before/after equivalent profile activation while accounting for intentionally replaced runtime source lifetimes.

Incarnation itself must remain scheduling-neutral.

---

# 108. OccurrenceIdentity Preservation

No `OccurrenceIdentity` V1 changes are authorized.

Fresh incarnation after profile activation must not alter V1 occurrence-identity semantics for otherwise equivalent scheduling pattern and occurrence coordinates.

Add direct regression if not already sufficiently protected by 2.27A.

---

# 109. Source-ID Preservation

Profile activation should preserve the readable/source IDs represented by the profile pattern unless existing semantics explicitly regenerate them.

Task 2.26 profile semantics require fresh **incarnation**, not necessarily fresh readable IDs.

Verify current behavior and preserve it.

---

# 110. Relationship Preservation

After profile activation verify:

* recurrence references existing template;
* cycle entries reference existing shift definitions;
* nested IDs/scopes valid;
* manual events valid;
* active graph passes current validation.

Fresh incarnation must not break readable-reference relationships.

---

# 111. Test Fixture Boundary

Update profile tests to use:

* Profile V1 DTO for historical input;
* Profile V2 DTO for current profile persistence;
* current incarnation-bearing runtime types after activation.

Do not make runtime incarnation optional.

---

# 112. Expected Production Files

Likely affected areas include:

* `code/src/state/dayFrameProfiles.ts`;
* profile types/DTOs;
* profile persistence/migration helper;
* `code/src/state/dayFrameStore.ts`;
* profile durability/ingress status;
* pattern projection helpers;
* profile tests;
* store tests;
* UI tests where profile save/load/retry behavior is asserted.

A separate `profileV2.ts` or equivalent module is encouraged if it produces cleaner responsibility boundaries.

---

# 113. Reference Audit

Before completion, search all production references to:

* profile storage key(s);
* profile version;
* profile serialize/write;
* profile read/rehydration;
* saveProfile;
* loadProfile;
* deleteProfile;
* profile Retry;
* profile durability status;
* profile desired durable condition;
* `savedProfiles`;
* Profile V1 normalization;
* `projectActiveToPattern`;
* active instantiation.

Confirm no supported writer bypasses Profile V2 once V2 authority is established.

---

# 114. Type Boundary Audit

Document final representations:

| Representation         | Incarnation? | Meaning                                         |
| ---------------------- | -----------: | ----------------------------------------------- |
| Current active runtime |          yes | active source lifetime authority                |
| Active V2              |          yes | active durable authority                        |
| Profile V1             |           no | legacy reusable pattern                         |
| Profile V2             |           no | current reusable pattern                        |
| Backup V1              |           no | legacy/current portable pattern until Backup V2 |

No ambiguity should remain.

---

# 115. Durable Surface Audit

Document:

* storage keys;
* versions;
* current writers;
* historical readers;
* migration eligibility;
* authority precedence.

Profile V2 must be independently governed from Active V2.

---

# 116. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.28_IMPLEMENT_PROFILE_V2_REUSABLE_PATTERN_FORMAT_AND_FRESH_LIFETIME_INSTANTIATION_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Decisions
4. Evidence Reviewed
5. Current Profile V1 Inventory
6. Files Changed
7. Profile V2 Version Contract
8. Profile V2 Key / Authority Strategy
9. Profile V2 DTO
10. Profile Pattern Boundary
11. Incarnation Exclusion
12. Profile Save Projection
13. Profile Save Semantics
14. Profile Load Semantics
15. Fresh-Lifetime Instantiation
16. Repeated Activation
17. Same-Name Replacement
18. Profile Delete
19. Profile V1 Reader Preservation
20. V1→V2 Migration
21. Migration Ordering
22. Collection-Level Failure
23. Entry-Level Invalidity
24. Invalid-Entry Preservation
25. Unsupported Version
26. Profile V2 Validation
27. Pattern Validation
28. Activation Validation
29. Allocation Failure
30. Active Persistence Failure After Load
31. Profile Persistence Failure
32. Profile Retry
33. Profile V1 Writer Retirement
34. V1 Resurrection Prevention
35. Empty Collection Authority
36. Clear / Reset Interaction
37. V2 Authority Precedence
38. Invalid V2 No-Fallback
39. Migration Durability
40. Migration Failure Classification
41. Active/Profile Independence
42. `savedProfiles` Runtime Model
43. Profile Cloning
44. Manual Events
45. Nested Source Patterns
46. Preview Behavior
47. Setup Draft Behavior
48. Profile/Backup Separation
49. Legacy Singular `shiftCycle`
50. Profile ID Semantics
51. Collection Ordering
52. Timestamp Semantics
53. Epistemic Boundary
54. Activation Atomicity
55. Save/Delete Atomicity
56. Desired Durable Condition
57. Profile Durability Subscription
58. Tests Added or Updated
59. Persistence Shape
60. Writer Audit
61. Type Boundary Audit
62. Durable Surface Audit
63. Scheduling Non-Interference
64. OccurrenceIdentity Preservation
65. Architectural Alignment Assessment
66. Deviations
67. Discoveries and Deferred Work
68. Recommended Next Task
69. Focused Validation
70. Full Validation
71. Final Completion Determination

---

# 117. Required Matrices

The result must include at least:

## A. Profile Version Matrix

| Format | Current reader | Current writer | Incarnation stored? | Meaning |
| ------ | -------------- | -------------- | ------------------: | ------- |

Cover Profile V1 and Profile V2.

## B. Activation Matrix

| Source kind | Pattern ID preserved? | Fresh active incarnation? | Relationship preserved? |
| ----------- | --------------------: | ------------------------: | ----------------------: |

Cover all seven lifetime-bearing source kinds.

## C. Migration Failure Matrix

| Failure | V1 preserved? | V2 adopted? | Profile runtime changed? | Status |
| ------- | ------------: | ----------: | -----------------------: | ------ |

## D. Durable Surface Matrix

| Surface | Version | Incarnation? | Semantics |
| ------- | ------- | -----------: | --------- |

Cover Active V2, Profile V1, Profile V2, Backup V1.

## E. Operation Independence Matrix

| Operation | Active authored state changes? | Active incarnation changes? | Profile collection changes? | Preview changes? |
| --------- | -----------------------------: | --------------------------: | --------------------------: | ---------------: |

Cover save profile, load profile, delete profile, profile migration, profile retry.

---

# 118. Validation Requirements

Run focused tests for:

* Profile V2 serializer/validator;
* Profile V1→V2 migration;
* invalid-entry preservation;
* save;
* load;
* repeated activation;
* delete;
* retry;
* clear/resurrection prevention;
* Active V2 interaction;
* legacy singular profile compatibility.

Then run relevant UI integration tests.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Record exact test-file and test-count results.

The complete repository suite must remain green.

---

# 119. Completion Criteria

Task 2.28 is complete only when:

* Profile V2 exists as an independently versioned durable format;
* Profile V2 is explicitly a reusable-pattern representation;
* Profile V2 contains no active source incarnation;
* saving current active setup projects correctly to Profile V2;
* save does not alter active incarnation;
* loading Profile V2 instantiates a complete fresh active incarnation graph;
* all seven lifetime-bearing source kinds instantiate correctly;
* repeated activation produces fresh lifetimes;
* source-readable relationships remain valid;
* Preview clears on profile load as currently governed;
* Profile V1 remains readable;
* Profile V1 migrates safely to V2;
* historical singular `shiftCycle` profile data remains supported;
* current Profile V2 output is plural-only;
* invalid profile data is preserved non-destructively;
* unsupported Profile V2+ does not silently fall back;
* valid Profile V2 outranks retained V1;
* intentionally empty/deleted Profile V2 state cannot resurrect retained V1;
* Profile V2 migration is durably verified before authority adoption;
* profile migration success converges profile durability correctly;
* profile migration failure remains observable;
* ordinary save/delete persistence failures preserve established profile durability semantics;
* Retry targets Profile V2;
* no current Profile V1 writer remains;
* Active V2 remains independent;
* Backup V1 remains unchanged;
* `OccurrenceIdentity` V1 remains unchanged;
* scheduling semantics remain unchanged;
* no Backup V2 is implemented;
* no DurableOccurrenceReference is implemented;
* no PlanDecision behavior is implemented;
* full repository tests, lint, typecheck, build, and diff validation pass;
* required result artifact is complete.

---

# 120. Explicit Non-Goals

Do **not**:

* persist active incarnation inside Profile V2;
* preserve active source lifetime across profile activation;
* add a source-incarnation registry;
* implement Backup V2;
* add incarnation to Backup V1;
* modify Active V2 architecture beyond narrow integration;
* implement DurableOccurrenceReference;
* modify `OccurrenceIdentity` V1;
* implement PlanDecision;
* persist PlanDecision;
* capture PlanDecision in profiles;
* redesign profile UX;
* add profile history;
* add profile tombstones unless required solely for non-destructive migration and explicitly justified;
* redesign scheduling;
* redesign Preview;
* change source-readable ID semantics;
* silently discard invalid profiles;
* silently fall back from invalid Profile V2 to Profile V1;
* allow retained V1 profiles to resurrect after explicit V2 empty/clear authority;
* weaken runtime incarnation requirements;
* perform unrelated cleanup.

---

# 121. Stop Conditions

Stop and report rather than broadening scope if:

* Profile V2 cannot preserve invalid user-authored entries without a new recovery architecture not governed by existing ADRs;
* profile migration requires changing Active V2 durable semantics;
* profile activation cannot instantiate mandatory current runtime incarnation without changing source-lifecycle architecture;
* V1 resurrection prevention requires a new governance decision not implied by Task 2.26;
* existing profile IDs have unresolved semantics that block safe V2 conversion;
* current Profile V1 cannot be migrated non-destructively;
* Backup V2 must be introduced to make Profile V2 coherent;
* `OccurrenceIdentity` or scheduling logic must change;
* full-suite failures expose an unrelated architectural regression.

Recommend the narrowest prerequisite.

---

# 122. Recommended Follow-On Boundary

If Task 2.28 completes successfully, the next genuine durable-surface task should implement:

> **Task 2.29 — Backup V2 Lifetime-Preserving Recovery Format and Restore Semantics**

That task should establish:

* Backup V2;
* incarnation-bearing recovery artifact;
* exact lifetime restoration;
* V1 backup compatibility;
* V1 import as fresh-lifetime instantiation/conversion;
* Backup V2 restore as continuity-preserving recovery;
* independent backup versioning;
* durable compatibility/recovery guarantees.

After Active V2, Profile V2, and Backup V2 are all implemented and validated, perform a cross-surface source-incarnation review before beginning `DurableOccurrenceReference`.

---

# 123. Task Determination

**Authorized:** implementation of independently versioned Profile V2 reusable-pattern durability, Profile V1 migration/compatibility, incarnation-free profile projections, fresh active incarnation on every profile activation, profile durability/retry integration, non-destructive invalid-profile preservation, V1 resurrection prevention, and direct regression coverage.

**Not authorized:** active-lifetime restoration from profiles, Backup V2, DurableOccurrenceReference, PlanDecision, scheduling redesign, profile history, source-history infrastructure, or UI feature expansion.

The governing epistemic rule is:

> A saved profile preserves reusable authored pattern information. It does not preserve proof that any future active source is the same lifetime as the source from which that profile was saved.

---

# 124. Final Completion Statement

**Task 2.28 is complete when DayFrame has an independently versioned, non-destructive Profile V2 durable surface that preserves reusable authored patterns without active source incarnation; safely migrates and continues reading Profile V1; prevents invalid or intentionally retired V2 authority from silently falling back to V1; projects incarnation-bearing active state into incarnation-free profile data; instantiates a complete fresh active source-lifetime graph on every profile activation while preserving pattern IDs and relationships; maintains profile durability, retry, Preview, Active V2, scheduling, and OccurrenceIdentity invariants; passes complete repository validation; and introduces no Backup V2, DurableOccurrenceReference, or PlanDecision behavior.**
