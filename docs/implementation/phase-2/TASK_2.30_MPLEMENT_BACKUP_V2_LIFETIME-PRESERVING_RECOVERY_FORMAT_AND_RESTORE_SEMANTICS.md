# Task 2.30 — Implement Backup V2 Lifetime-Preserving Recovery Format and Restore Semantics

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded durable-surface implementation task.

Task 2.30 implements the independently versioned **Backup V2** durable/export format established by Task 2.26.

Backup V2 is the first DayFrame backup artifact intentionally capable of preserving and restoring active source-lifetime identity.

This task must preserve the distinction:

> Profile V2 instantiates reusable patterns.

> Backup V2 restores recoverable active authority.

Task 2.30 does **not** implement DurableOccurrenceReference, PlanDecision persistence, decision replay, scheduling changes, source history, or a general backup-management system.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify that the saved project copy exists;
2. verify that the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 2.27, 2.27A, 2.28, and 2.29 are accepted as complete;
6. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.30_IMPLEMENT_BACKUP_V2_LIFETIME_PRESERVING_RECOVERY_FORMAT_AND_RESTORE_SEMANTICS_RESULT.md`

If Backup V2 cannot safely restore source incarnation without changing the accepted Active V2 or source-incarnation architecture, stop and report rather than broadening scope.

---

# 2. Purpose

Tasks 2.24–2.29 established three distinct durable semantics:

## Active V2

Current active source-lifetime authority.

* incarnation-bearing;
* restart preserves lifetime;
* current active durable checkpoint.

## Profile V2

Reusable authored pattern.

* incarnation-free;
* activation creates fresh active lifetimes;
* repeated activation produces different lifetime identity.

## Backup V1

Legacy portable authored setup.

* incarnation-free;
* cannot prove lifetime continuity;
* current import instantiates fresh active lifetimes.

The remaining gap is Backup V2.

DayFrame needs a recovery artifact capable of truthfully saying:

> These are the same source lifetimes represented by the state that was backed up.

Task 2.30 implements that contract.

---

# 3. Governing Architectural Decisions

This task is governed by:

* Task 2.24 source-incarnation semantics;
* Task 2.25 lifecycle-operation authority;
* Task 2.26 durable source-incarnation ADR;
* Task 2.27/2.27A Active V2 implementation;
* Task 2.28 Profile V2;
* Task 2.29 protected/quarantined Profile V2 recovery;
* Phase 1 durable-data compatibility governance.

The following decisions are already settled:

1. active incarnation identifies one source lifetime;
2. Active V2 stores exact current incarnation;
3. Profile V2 excludes incarnation and instantiates fresh lifetimes;
4. Backup V1 lacks lifetime evidence and therefore cannot restore incarnation;
5. Backup V2 must preserve incarnation;
6. Backup V2 restore must preserve exact backed-up source lifetimes;
7. Backup V2 versioning is independent from Active/Profile formats;
8. historical Backup V1 remains supported;
9. importing Backup V1 continues to instantiate a new lifetime baseline;
10. Backup V2 restore must produce valid current Active V2 authority;
11. `OccurrenceIdentity` V1 remains unchanged;
12. DurableOccurrenceReference remains deferred;
13. PlanDecision remains deferred.

---

# 4. Architectural Objective

After Task 2.30:

```text
CURRENT ACTIVE AUTHORITY
    Active V2
    incarnation-bearing
        ↓
Backup V2 export
        ↓
portable recovery artifact
    incarnation-bearing
        ↓
Backup V2 restore
        ↓
same source-lifetime graph
        ↓
Current Active Runtime
        ↓
Active V2 persistence
```

while legacy behavior remains:

```text
Backup V1
    incarnation absent
        ↓
import
        ↓
fresh lifetime instantiation
        ↓
Active V2
```

Backup V1 and Backup V2 therefore have intentionally different lifetime semantics.

---

# 5. Backup Semantic Definition

Adopt as an executable invariant:

> Backup V2 is a recovery artifact representing one complete authored active-state checkpoint, including source-lifetime identity.

Backup V2 is not:

* a reusable profile;
* a source template;
* a Preview;
* an execution history;
* a PlanDecision log;
* a mutation log.

It is a recoverable authored-state checkpoint.

---

# 6. Scope

Backup V2 must capture the complete current active authored authority necessary for exact source-lifetime restoration:

1. scheduling preferences;
2. preview range;
3. shift definitions;
4. shift cycles;
5. nested shift segments;
6. nested sequence entries;
7. block templates;
8. block recurrences;
9. manual events.

Every lifetime-bearing source must carry its exact current `incarnationId`.

Backup V2 must not capture:

* saved profiles;
* Profile V2 quarantine;
* Preview;
* durability status;
* ingress status;
* lifecycle-operation history;
* UI drafts;
* PlanDecision;
* source tombstones/history.

---

# 7. Required Initial Audit

Before modifying code, inspect:

* `dayFrameBackup.ts`;
* Backup V1 envelope/version;
* current export path;
* current import path;
* current Backup V1 validation;
* legacy singular `shiftCycle` normalization;
* Backup V1 active-instantiation adapter;
* UI backup export/import workflows;
* backup result types;
* Active V2 persistence after import;
* active durability status;
* active recovery/protected ingress;
* backup tests;
* store tests;
* relevant UI tests.

Document exact current Backup V1 behavior before implementation.

---

# 8. Backup V2 Version Contract

Introduce an explicit independent Backup V2 envelope.

It must identify:

* app;
* durable/export surface;
* format version;
* backup metadata;
* incarnation-bearing authored checkpoint.

Follow existing repository conventions where appropriate.

Do not reuse Active V2's envelope merely because its source graph is similar.

---

# 9. Backup V2 Is A File Artifact

Backup V2 remains an export/import artifact rather than a continuously persisted local-storage surface.

Do not introduce a Backup V2 local-storage key merely for versioning.

The version belongs to the artifact envelope.

---

# 10. Backup V2 DTO

Introduce an explicit Backup V2 durable DTO.

It must be distinct from:

* Active V2 envelope;
* Profile V2;
* Backup V1;
* current runtime aggregate.

Backup V2 may reuse the incarnation-bearing authored-data projection where semantically appropriate, but the file envelope and validation contract remain backup-specific.

---

# 11. Backup Metadata

Audit and preserve current Backup V1 metadata semantics.

Determine which metadata belongs in V2, such as:

* exported timestamp;
* application identifier;
* format version.

Do not add unrelated device/account information.

Do not use export timestamp as source-lifetime evidence.

---

# 12. Incarnation Inclusion

Backup V2 must include exact incarnation for all seven lifetime-bearing source kinds:

1. shift definition;
2. shift cycle;
3. shift segment;
4. sequence entry;
5. block template;
6. block recurrence;
7. manual event.

Direct persistence-shape tests required.

---

# 13. Nested Lifetime Preservation

Backup V2 must preserve:

* cycle incarnation;
* segment incarnation;
* sequence-entry incarnation.

Restoring the backup must restore those exact values.

Do not recreate nested incarnation merely because the parent graph is reconstructed in memory.

---

# 14. Backup V2 Export Projection

Export from current active runtime must produce:

```text
Current Active Runtime
    incarnation-bearing
        ↓
Backup V2 projection
        ↓
incarnation-bearing recovery artifact
```

Unlike Profile V2 projection, Backup V2 does not drop incarnation.

---

# 15. Export Purity

Creating/exporting Backup V2 must not:

* mutate active state;
* rotate incarnation;
* alter Preview;
* change profiles;
* write Active V2;
* change durability status;
* notify ordinary subscribers.

Backup generation is a pure read/export operation.

---

# 16. Backup V2 Validation

Validate at minimum:

* application identifier;
* surface/type;
* version;
* metadata;
* complete authored checkpoint;
* all required incarnation;
* canonical lowercase UUID-v4;
* global incarnation uniqueness;
* current plural cycle representation;
* authored semantic validity;
* nested references;
* source IDs/scopes.

Do not silently repair malformed Backup V2 lifetime identity.

---

# 17. Incarnation Is Mandatory In Backup V2

A claimed Backup V2 artifact missing incarnation is invalid V2.

Do not:

* allocate missing incarnation;
* downgrade automatically to V1;
* treat it as a valid restore artifact.

The version claim must match the actual representation.

---

# 18. Backup V1 Reader Preservation

Retain Backup V1 support.

Backup V1 continues to represent historical incarnation-free authored setup.

Its semantics remain:

> import as fresh active lifetimes.

Do not change V1 into a lifetime-preserving artifact retroactively.

---

# 19. Backup V1 Export

Determine whether current export UI should immediately switch to Backup V2 as the default/current writer.

Preferred result:

* current backup export emits V2;
* explicit historical V1 export is retired unless a product requirement exists;
* V1 remains reader only.

Do not keep writing V1 as the ordinary current backup format merely for compatibility.

---

# 20. Backup V1 Writer Retirement

After Task 2.30, production backup export should write Backup V2 only.

Backup V1 remains:

* supported import;
* historical compatibility representation;
* test fixture format where appropriate.

Audit and prove no ordinary production export still emits version 1.

---

# 21. Backup V1 Import Semantics

Preserve current truth:

```text
Backup V1
    no incarnation evidence
        ↓
validate / normalize
        ↓
instantiate complete fresh active graph
        ↓
Active V2
```

Repeated import of the same V1 backup must produce different active incarnation sets.

Direct tests required.

---

# 22. Backup V2 Restore Semantics

Backup V2 import/restore must:

1. parse;
2. validate;
3. preserve exact readable source IDs;
4. preserve exact source incarnation;
5. construct a complete current active graph;
6. validate current active graph;
7. replace active authored authority;
8. clear Preview;
9. persist exact restored authority as Active V2;
10. report active durability outcome;
11. preserve saved profiles.

No incarnation allocation occurs for restored sources.

---

# 23. Restore Means Same Lifetime

Directly prove:

```text
before export:
source X incarnation = A

export Backup V2

current state later changes

restore Backup V2

source X incarnation = A
```

This is the defining semantic difference from Profile V2 and Backup V1.

---

# 24. Complete Graph Preservation

Backup V2 restore must preserve exact incarnation across every lifetime-bearing source.

Add representative full-graph tests containing all seven source kinds.

---

# 25. Repeated Backup V2 Restore

Restoring the same Backup V2 multiple times must restore the same source incarnation each time.

This is correct because the artifact represents the same backed-up lifetimes.

Do not allocate new incarnation on each restore.

---

# 26. Backup Restore Versus Import Naming

Audit current product/API terminology.

If the same command currently handles V1 and V2, ensure semantics remain truthful:

* V1 is imported/instantiated;
* V2 is restored.

You do not need a broad UI redesign, but internal result types and documentation should distinguish the two operations where necessary.

---

# 27. Restore Atomicity

A Backup V2 restore must construct and validate the complete restored graph before replacing session authority.

No partially restored graph may become current.

If parse/validation fails:

* current active state remains unchanged;
* Preview remains unchanged;
* profiles remain unchanged;
* Active V2 remains unchanged.

---

# 28. Restore Session Authority

Once a valid Backup V2 graph is accepted by the restore action:

* restored runtime state becomes current session authority;
* Preview clears;
* active persistence is attempted.

If Active V2 persistence fails afterward, preserve established ordinary mutation semantics:

* restored runtime remains session authority;
* active durability reports failure;
* Retry targets exact restored V2 graph.

Do not roll back valid session restore merely because local persistence failed.

---

# 29. Restore Persistence

After Backup V2 restore, Active V2 writer must serialize the exact restored incarnation-bearing graph.

No new incarnation is allocated during persistence.

---

# 30. Restore Durability Outcome

The import/restore result must distinguish:

* validation/restore rejected before mutation;
* runtime restored but Active V2 persistence failed;
* runtime restored and durably persisted.

Use existing active persistence result semantics where possible.

---

# 31. Active Durability Integration

Backup restore affects active durable authority, not backup-file durability.

There is no "backup durability status" for a user-supplied file.

After restore:

* active durability status reflects Active V2 write outcome;
* desired active durable condition becomes restored V2 snapshot.

---

# 32. Profile Independence

Backup V2 restore must preserve `savedProfiles`.

It must not:

* overwrite Profile V2;
* clear Profile V2 quarantine;
* alter protected profile ingress;
* alter profile durability status.

The backup artifact does not include profiles.

---

# 33. Preview Semantics

Successful Backup V2 restore clears Preview.

Failed parse/validation leaves Preview unchanged.

This mirrors existing full active-authority replacement behavior.

Do not mark the existing Preview merely stale.

---

# 34. Setup Draft Semantics

Existing store subscriptions may rebuild Setup draft after successful restore.

Preserve existing behavior.

Do not preserve unsaved Setup draft across complete active restore.

---

# 35. Backup V2 And Clear

No special local backup retention exists.

Clear affects active/profile local surfaces according to existing semantics; it does not erase backup files previously exported by the user.

Do not introduce backup-file tracking.

---

# 36. Backup V2 And Recovery

Backup V2 itself provides a user-controlled recovery input.

Do not confuse importing a Backup V2 file with the protected Active V2 ingress-recovery actions.

A valid backup restore is an explicit full active replacement operation.

---

# 37. Protected Active Ingress

Audit whether Backup V2 restore is allowed while Active V2 ingress is protected.

There are two possible defensible models:

## A. Explicit backup restore is a governed replacement/recovery action.

The user may use a valid Backup V2 to replace protected active data.

## B. Backup restore remains blocked until protected active recovery is explicitly resolved.

Determine from existing active-local recovery authority.

Preferred principle:

> A user-selected valid recovery artifact may serve as explicit replacement authority, but it must not silently bypass source-recheck/protection semantics.

If integration requires a new explicit protected-source replacement action using the backup payload, implement only if already authorized by existing recovery architecture.

Otherwise stop and identify the prerequisite.

---

# 38. Source-Recheck Safety During Protected Replacement

If Backup V2 restore is permitted to replace protected Active V2:

* recheck the protected active source first;
* reject stale authority on sourceChanged;
* write/verify restored Active V2;
* clear protection only after success.

Do not overwrite externally changed protected bytes based on stale recovery evidence.

---

# 39. Backup V2 File Does Not Need Source Recheck

The imported file itself is immutable user-provided input for the operation.

Source recheck applies to protected local Active V2 evidence, not to the file unless the UI/file system abstraction provides a mutable reference rather than bytes.

Do not overcomplicate this.

---

# 40. Backup V1 Legacy Singular `shiftCycle`

Preserve Backup V1 historical support for raw singular `shiftCycle`.

On import:

* normalize to plural current pattern;
* instantiate fresh incarnation;
* persist Active V2.

Backup V2 must be plural-only.

---

# 41. Backup V2 Plural-Only Contract

Backup V2 writers must never emit singular `shiftCycle`.

Backup V2 validator should reject or classify unsupported/noncurrent singular form rather than silently accepting legacy V1 structure under version 2.

---

# 42. Backup V2 Unknown Version

An unknown/future backup version must:

* not be interpreted as V2;
* not be silently downgraded to V1;
* not mutate active state;
* return explicit unsupported-version failure.

Because the file is user-supplied rather than current local authority, protected-ingress persistence may not be necessary, but the import must be non-destructive.

---

# 43. Corrupt Backup

Malformed JSON or invalid Backup V2:

* reject;
* preserve active state;
* preserve Preview;
* preserve profiles;
* report factual validation error.

Do not import partial content.

---

# 44. Validation Failure Categories

Distinguish at least:

* parse failure;
* unsupported version;
* envelope validation failure;
* authored semantic validation failure;
* incarnation validation failure.

Use concise result types.

Do not expose raw exceptions directly to UI.

---

# 45. Backup V2 Global Incarnation Uniqueness

The backup validator must reject duplicate incarnation across the complete restored graph.

Include:

* same-kind duplicate;
* cross-kind duplicate;
* parent/nested duplicate;
* nested/nested duplicate.

Do not allow ambiguous lifetime identity into active authority.

---

# 46. Backup V2 Source Relationship Validation

Before restore, validate:

* recurrence template references;
* cycle shift-definition references;
* nested scope/IDs;
* current authored-state semantic rules.

A backup with internally broken references is invalid.

---

# 47. Backup V2 Export Filename

Use a deterministic/descriptive filename following current UI conventions.

Example:

`dayframe-backup-YYYY-MM-DD.json`

or existing project convention.

Do not encode sensitive data.

Do not make filename part of semantic identity.

---

# 48. Export Timestamp

Backup V2 should record export time if Backup V1 already does or if governed metadata requires it.

This timestamp is informational provenance only.

It must not:

* determine incarnation;
* change lifetime equality;
* affect restore semantics.

---

# 49. Backup Provenance

Backup V2 should preserve enough metadata to explain:

* this is a DayFrame backup;
* version 2;
* when exported if applicable.

Do not add device/account provenance unless specifically governed.

---

# 50. Backup V2 Export Readability

The artifact should remain ordinary JSON if that is current behavior.

No binary/encrypted format change is authorized.

---

# 51. Backup V2 Serialization

Implement a dedicated serializer.

Do not rely on `JSON.stringify(getState())`.

Only the governed backup DTO may be serialized.

---

# 52. Backup V2 Clone Isolation

Backup construction must clone the authored graph sufficiently that:

* mutating an exported DTO before serialization cannot mutate store state;
* mutating parsed import data after restore cannot mutate store state.

Direct tests required.

---

# 53. Import Does Not Mutate Input

Backup import/restore must not normalize the caller's parsed object in place.

Clone/convert before mutation.

Task 2.27/2.28 already protect similar boundaries.

---

# 54. Backup V2 Restore Result

Introduce/extend the backup import result so callers can distinguish:

* `restored`;
* `instantiatedFromLegacy`;
* `rejected`;
* persistence outcome.

Exact naming may follow project conventions.

The result should preserve the semantic difference between V1 and V2.

---

# 55. V1/V2 Dispatch

The backup reader must dispatch by version before interpreting payload semantics.

Conceptually:

```text
parse envelope
    ↓
version 1
    → validate V1
    → instantiate

version 2
    → validate V2
    → restore

unknown
    → reject unsupported
```

Do not normalize V2 through V1 first.

---

# 56. No Automatic Backup Migration

Unlike local Active/Profile durable surfaces, a backup file is an external artifact.

Do not rewrite the user's V1 backup file to V2 automatically.

Import V1 according to its semantics.

If the user later exports a backup, it will be V2.

---

# 57. Conversion Utility

A pure V1→V2 conversion utility is **not** automatically authorized because a V1 file lacks source incarnation.

Creating V2 would require allocating new lifetime identity and therefore would produce a new baseline artifact.

Do not call that "migration" or "restore" unless explicitly modeled.

Current V1 import + later V2 export is sufficient.

---

# 58. Legacy Backup V1 Compatibility

Preserve all current supported V1 forms.

At minimum:

* current V1 authored pattern;
* singular-only shiftCycle compatibility;
* existing manual events;
* preview-range semantics;
* scheduling preferences.

Do not break historical files unnecessarily.

---

# 59. Backup V1 Validation

Keep V1 validation incarnation-free.

Do not require current runtime identity in the historical DTO.

---

# 60. Backup V2 Validation Separate From Active V2

Backup V2 and Active V2 may share authored-graph validation primitives.

They must still have separate envelope validators.

Do not accept an Active V2 local-storage envelope as a Backup V2 file merely because the data sections match.

Surface identity matters.

---

# 61. Cross-Surface Envelope Rejection

Directly test:

* Active V2 envelope supplied as Backup V2 → reject;
* Profile V2 envelope supplied as Backup V2 → reject;
* Backup V2 supplied to Active local reader → reject where relevant.

This protects durable-surface meaning.

---

# 62. Profile V2 Exclusion

Backup V2 must not embed Profile V2.

Direct shape test:

* no `savedProfiles`;
* no `profiles`;
* no `quarantinedProfiles`.

---

# 63. Active Infrastructure Exclusion

Backup V2 must exclude:

* active durability status;
* desired durable condition;
* migration status;
* protected ingress evidence;
* V2-established marker.

These are local infrastructure, not authored backup data.

---

# 64. Source Lifecycle Operation Exclusion

Backup V2 stores the resulting source lifetime identity, not lifecycle-operation records.

Do not include:

* create/update/delete provenance;
* draft lifecycle handles;
* authoring transaction records.

---

# 65. No Tombstones

Do not add deleted source records to Backup V2.

Backup V2 captures the active authored checkpoint at export time.

---

# 66. No Execution History

Do not add past schedule execution/history.

Backup V2 is not Live/Learn history.

---

# 67. No PlanDecision

Do not include or implement PlanDecision.

If PlanDecision becomes durable later, backup semantics will require a new explicit version/governance task.

Do not reserve fake placeholder fields.

---

# 68. No DurableOccurrenceReference

Do not implement or serialize durable occurrence references.

Source incarnation is now preserved so that work can occur later.

---

# 69. No Scheduling Changes

Backup V2 must not affect:

* schedule generation;
* recurrence expansion;
* placement;
* friction;
* SuggestedFix;
* Preview algorithms;
* `OccurrenceIdentity` V1.

---

# 70. Scheduling Non-Interference

A Backup V2 roundtrip:

```text
export → restore
```

must preserve scheduling semantics for the restored authored state.

Direct regression coverage required.

---

# 71. OccurrenceIdentity Preservation

For the same restored lifetime/source data:

* `OccurrenceIdentity` V1 remains unchanged;
* no incarnation field appears in it;
* deterministic recurrence/work coordinates remain unchanged.

Backup V2 should not force an occurrence identity revision.

---

# 72. Lifetime Equality Roundtrip

Directly prove all incarnation values are exactly equal before export and after restore.

This is stronger than merely validating UUID shape.

---

# 73. Readable-ID Equality Roundtrip

Source readable IDs and nested IDs must also roundtrip exactly.

Backup V2 restore is not a cloning/duplication operation.

---

# 74. Pattern Equality Roundtrip

All authored scheduling values must roundtrip exactly apart from any established normalization that is explicitly canonical for V2.

Do not silently alter valid current data.

---

# 75. Preview Exclusion Roundtrip

Preview is not exported.

After restore:

* Preview is null/cleared;
* newly generated Preview derives from restored authored authority.

---

# 76. Saved Profiles Preservation Roundtrip

Profiles are not exported.

Restoring backup must preserve whatever Profile V2 collection is currently stored/runtime.

Direct test required.

---

# 77. Backup Export UI

Update existing backup export control to emit V2.

Keep user-visible workflow minimal.

No need to ask the user which backup version to use.

Current export should use the current format.

---

# 78. Backup Import UI

Existing import UI should accept V1 and V2.

Feedback should distinguish where useful:

* legacy backup imported as fresh active setup;
* Backup V2 restored.

Do not expose incarnation IDs.

---

# 79. Import Confirmation

Audit whether current backup import already confirms full active-state replacement.

If yes, preserve it.

If not, consider whether existing workflow already provides sufficient explicit user authority.

Backup restore replaces active authored state and clears Preview; this is significant.

Do not introduce unnecessary new modal complexity if current action is already explicit.

---

# 80. Restore Feedback

UI should report at least:

* restore/import success;
* unsupported version;
* invalid backup;
* active persistence failure after accepted restore.

Do not expose raw validation stack traces.

---

# 81. Accessibility

Preserve existing file input/button accessibility.

Any new status text should use existing status/error patterns.

No backup-specific UI redesign is authorized.

---

# 82. Backup File Input Safety

Do not trust filename or MIME type as validation.

Parse and validate content.

---

# 83. Maximum Size / Resource Limits

Audit whether current import already has reasonable browser constraints.

Do not add elaborate size governance unless existing code needs a simple defensive limit.

Avoid expanding scope.

---

# 84. Active Persistence Failure After V2 Restore

Direct test:

1. valid Backup V2;
2. restore accepted;
3. Active V2 write fails;
4. runtime restored state remains;
5. exact backup incarnations remain current;
6. Preview cleared;
7. active durability failure recorded;
8. Retry writes exact restored graph.

---

# 85. Active Persistence Retry After Restore

Retry must not:

* allocate new incarnation;
* reinterpret restore as instantiation;
* write Active V1.

It writes the exact current restored Active V2 snapshot.

---

# 86. Backup V1 Import Persistence Failure

Preserve current V1 behavior:

* fresh active lifetime graph instantiated;
* runtime replacement accepted;
* Active V2 persistence may fail;
* Retry targets instantiated graph.

No change in lifetime semantics.

---

# 87. Restore Allocation Failure

Backup V2 restore should not allocate source incarnation.

Therefore source-incarnation allocator failure should not block a valid Backup V2 restore solely for lifetime restoration.

If current runtime construction calls allocator unnecessarily, remove that dependency.

This is a direct architectural test.

---

# 88. Backup V1 Allocation Failure

Backup V1 import does require fresh incarnation.

Allocator failure must:

* reject before active replacement;
* preserve current active state;
* preserve Preview;
* preserve profiles;
* perform no Active V2 write.

---

# 89. Full Replacement Semantics

Both Backup V1 import and Backup V2 restore replace all seven active authored fields.

Difference:

* V1 instantiates source lifetime;
* V2 preserves source lifetime.

Profiles remain preserved.

Preview clears on successful replacement.

---

# 90. Backup Version Matrix

The result must explicitly document:

| Backup version | Incarnation stored? | Current reader? | Current writer? | Import meaning                     |
| -------------- | ------------------: | --------------: | --------------: | ---------------------------------- |
| V1             |                  No |             Yes |              No | Instantiate fresh active lifetimes |
| V2             |                 Yes |             Yes |             Yes | Restore exact active lifetimes     |

---

# 91. Cross-Surface Semantics Matrix

The result must explicitly compare:

| Surface    | Incarnation stored? | Activation/import semantics |
| ---------- | ------------------: | --------------------------- |
| Active V2  |                 Yes | Rehydrate same lifetimes    |
| Profile V2 |                  No | Instantiate fresh lifetimes |
| Backup V1  |                  No | Instantiate fresh lifetimes |
| Backup V2  |                 Yes | Restore same lifetimes      |

This is a central completion artifact.

---

# 92. Backup V2 Tests — Export Shape

Directly prove:

* version 2;
* correct surface;
* metadata;
* all seven lifetime-bearing sources contain incarnation;
* nested incarnation included;
* plural cycles only;
* no Preview;
* no profiles;
* no infrastructure.

---

# 93. Backup V2 Tests — Restore Exact Lifetimes

Build a representative complete graph.

Export then restore.

Prove exact incarnation equality for every source.

---

# 94. Backup V2 Tests — Repeated Restore

Restore same artifact twice.

Prove exact same incarnation both times.

---

# 95. Backup V1 Tests — Repeated Import

Import same V1 artifact twice.

Prove disjoint incarnation sets.

This contrasts directly with V2.

---

# 96. Backup V2 Tests — Invalid Incarnation

Reject:

* missing incarnation;
* malformed UUID;
* uppercase;
* wrong UUID version;
* duplicate incarnation.

No active mutation.

---

# 97. Backup V2 Tests — Broken References

Reject:

* recurrence referencing missing template;
* cycle entry referencing missing shift definition;
* invalid nested structure.

No active mutation.

---

# 98. Backup V2 Tests — Surface Mismatch

Reject Active V2/Profile V2 envelopes as Backup V2.

---

# 99. Backup V2 Tests — Unknown Version

Reject unknown future version without mutation.

---

# 100. Backup V2 Tests — Corrupt JSON

Reject malformed input without mutation.

---

# 101. Backup V1 Legacy Singular Test

Retain and update direct coverage for singular-only V1 backup.

Prove:

* normalized plural runtime;
* fresh incarnation;
* resulting Active V2 persistence;
* original input not mutated.

---

# 102. Backup V2 Input Immutability Test

Restore must not mutate caller-provided parsed payload.

---

# 103. Backup V2 Snapshot Isolation

Restored store state must not share references with parsed backup object.

Mutating imported object after restore cannot alter store.

---

# 104. Backup V2 Export Isolation

Mutating a constructed/export DTO cannot alter store-owned state.

---

# 105. Backup V2 Profile Independence Test

Restore while Profile V2 contains:

* valid profiles;
* quarantine.

Prove both remain unchanged.

---

# 106. Backup V2 Preview Test

Successful restore clears Preview.

Rejected restore preserves it.

---

# 107. Backup V2 Scheduling Roundtrip Test

Generate schedule before export.

Mutate current active setup.

Restore.

Regenerate with equivalent generation inputs.

Prove restored scheduling output matches the exported-state schedule.

---

# 108. Backup V2 OccurrenceIdentity Test

Prove V1 occurrence identities return to the same semantic values after restore where the authored inputs/coordinates match.

No incarnation field added.

---

# 109. Backup V2 Active Durability Test

Successful restore + successful persistence:

* active durability `durable`;
* desired condition exact restored snapshot.

---

# 110. Backup V2 Active Persistence Failure Test

Covered as Section 84.

Include direct result assertion.

---

# 111. Backup V1 Allocation Failure Test

Covered as Section 88.

---

# 112. Backup V2 No-Allocator Test

Inject allocator that throws.

Valid V2 restore must still succeed if no unrelated source creation occurs.

This directly proves restoration uses artifact identity.

---

# 113. Backup V2 Current Writer Audit

Search all production backup exporters.

No V1 current export remains.

---

# 114. Active Writer Audit

Backup restore persists through Active V2 writer only.

No V1 active write introduced.

---

# 115. Profile Writer Audit

Backup work must not modify Profile V2 writer/recovery behavior.

---

# 116. Type Boundary Audit

Document final shapes:

| Representation         | Incarnation required? | Meaning                                 |
| ---------------------- | --------------------: | --------------------------------------- |
| Current active runtime |                   Yes | current lifetime authority              |
| Active V2              |                   Yes | current local durable authority         |
| Profile V2             |                    No | reusable pattern                        |
| Backup V1              |                    No | legacy portable pattern                 |
| Backup V2              |                   Yes | lifetime-preserving recovery checkpoint |

---

# 117. Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.30_IMPLEMENT_BACKUP_V2_LIFETIME_PRESERVING_RECOVERY_FORMAT_AND_RESTORE_SEMANTICS_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Decisions
4. Evidence Reviewed
5. Current Backup V1 Inventory
6. Files Changed
7. Backup Semantic Definition
8. Backup V2 Version Contract
9. Backup V2 DTO
10. Backup Metadata
11. Incarnation Inclusion
12. Nested Lifetime Preservation
13. Export Projection
14. Export Purity
15. Backup V2 Validation
16. Backup V1 Reader Preservation
17. Backup V1 Writer Retirement
18. Backup V1 Import Semantics
19. Backup V2 Restore Semantics
20. Same-Lifetime Restoration
21. Complete-Graph Preservation
22. Repeated V2 Restore
23. Restore / Import Terminology
24. Restore Atomicity
25. Session Authority
26. Active Persistence Integration
27. Durability Outcome
28. Profile Independence
29. Preview Semantics
30. Setup Draft Semantics
31. Protected Active Ingress Assessment
32. Source-Recheck Integration, if required
33. Legacy Singular `shiftCycle`
34. Plural-Only V2 Contract
35. Unsupported Version
36. Corrupt Backup
37. Failure Categories
38. Global Incarnation Uniqueness
39. Source Relationship Validation
40. Backup Provenance
41. Serializer Boundary
42. Clone / Input Isolation
43. Backup Result Types
44. V1/V2 Dispatch
45. No Automatic Backup Migration
46. Cross-Surface Envelope Validation
47. Infrastructure Exclusion
48. Scheduling Non-Interference
49. OccurrenceIdentity Preservation
50. Lifetime Equality Roundtrip
51. Pattern Equality Roundtrip
52. Saved-Profile Preservation
53. Backup UI
54. Import/Restore Feedback
55. Active Persistence Failure After Restore
56. Active Retry After Restore
57. V1 Allocation Failure
58. V2 No-Allocation Restore
59. Tests Added or Updated
60. Writer Audit
61. Type Boundary Audit
62. Cross-Surface Semantics Audit
63. Architectural Alignment Assessment
64. Deviations
65. Discoveries and Deferred Work
66. Recommended Next Task
67. Focused Validation
68. Full Validation
69. Final Completion Determination

---

# 118. Required Matrices

## A. Backup Version Matrix

| Version | Incarnation? | Reader | Writer | Semantics |
| ------- | -----------: | -----: | -----: | --------- |

## B. Cross-Surface Lifetime Matrix

| Surface | Incarnation? | Use | Lifetime behavior |
| ------- | -----------: | --- | ----------------- |

Cover Active V2, Profile V2, Backup V1, Backup V2.

## C. Restore Failure Matrix

| Failure | Active state mutated? | Preview changed? | Profiles changed? | Persistence attempted? |
| ------- | --------------------: | ---------------: | ----------------: | ---------------------: |

Cover parse, unsupported version, validation, V1 allocation failure, V2 active write failure.

## D. Source Lifetime Matrix

| Source kind | Backup V2 stores incarnation? | Restore exact? | Backup V1 allocates fresh? |
| ----------- | ----------------------------: | -------------: | -------------------------: |

Cover all seven source kinds.

## E. Operation Matrix

| Operation       | Active state | Incarnation         | Preview   | Profiles  |
| --------------- | ------------ | ------------------- | --------- | --------- |
| Export V2       | unchanged    | unchanged           | unchanged | unchanged |
| Import V1       | replaced     | fresh               | cleared   | preserved |
| Restore V2      | replaced     | preserved from file | cleared   | preserved |
| Rejected import | unchanged    | unchanged           | unchanged | unchanged |

---

# 119. Validation Requirements

Run focused tests for:

* Backup V2 serializer/validator;
* V2 export shape;
* V2 exact-lifetime restore;
* V2 repeated restore;
* V1 fresh-lifetime import;
* V1 singular compatibility;
* invalid V2;
* active persistence failure;
* profile independence;
* scheduling roundtrip;
* occurrence identity;
* UI export/import.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The complete repository suite must pass.

Record exact test-file and test-count results.

---

# 120. Completion Criteria

Task 2.30 is complete only when:

* Backup V2 exists as an independent current backup format;
* current backup export writes V2 only;
* Backup V2 preserves exact incarnation for all seven lifetime-bearing source kinds;
* nested incarnation is preserved;
* Backup V2 restore preserves exact source lifetime identity;
* repeated V2 restore restores the same lifetimes;
* Backup V1 remains readable;
* Backup V1 import continues to instantiate fresh lifetimes;
* repeated V1 import creates different lifetimes;
* V1 writer is retired;
* V2 is plural-only;
* historical singular V1 remains supported;
* invalid/malformed/unsupported V2 is rejected non-destructively;
* duplicate/malformed incarnation is rejected;
* cross-surface envelopes are rejected;
* restore is atomic before session mutation;
* successful restore replaces all active authored fields;
* successful restore clears Preview;
* profiles and profile quarantine remain preserved;
* Active V2 persists the exact restored graph;
* Active V2 persistence failure preserves valid restored session authority;
* Retry writes the same restored graph;
* Backup V2 restore requires no incarnation allocation;
* Backup V1 import does require allocation;
* export and import are clone-safe;
* backup UI supports V1 and V2 appropriately;
* scheduling semantics remain unchanged;
* `OccurrenceIdentity` V1 remains unchanged;
* no Backup V3 is introduced;
* no DurableOccurrenceReference is implemented;
* no PlanDecision is implemented;
* no source history/tombstones are introduced;
* full repository validation passes;
* result artifact is complete.

---

# 121. Explicit Non-Goals

Do **not**:

* include profiles in Backup V2;
* include profile quarantine;
* include Preview;
* include durability/ingress metadata;
* include lifecycle-operation history;
* include source tombstones;
* include execution/history;
* implement DurableOccurrenceReference;
* modify `OccurrenceIdentity` V1;
* implement PlanDecision;
* persist PlanDecision;
* redesign scheduling;
* redesign Preview;
* add backup encryption;
* add cloud backup;
* add backup history/management;
* rewrite user V1 files automatically;
* reinterpret Backup V1 as lifetime-preserving;
* allocate new incarnation during valid Backup V2 restore;
* silently repair invalid V2 incarnation;
* accept Active/Profile envelopes as backups;
* change Profile V2 semantics;
* change Active V2 architecture beyond narrow restore integration.

---

# 122. Stop Conditions

Stop and report if:

* Backup V2 restore cannot preserve exact incarnation without changing Active V2 identity semantics;
* current protected Active V2 ingress cannot safely accept explicit Backup V2 recovery without another governed recovery task;
* Backup V1 compatibility requires destructive reader retirement;
* cross-surface DTO reuse makes surface identity ambiguous;
* current restore path cannot preserve profiles without broad state redesign;
* Backup V2 would require DurableOccurrenceReference or PlanDecision data to be coherent;
* restoring V2 requires source-incarnation allocation;
* full-suite failures expose an unrelated architectural regression.

Recommend the narrowest prerequisite.

---

# 123. Recommended Follow-On Boundary

If Task 2.30 completes successfully, do **not** immediately begin DurableOccurrenceReference.

The next task should be a cross-surface review:

> **Task 2.31 — Audit and Checkpoint Cross-Surface Source-Incarnation Semantics**

That review should verify end-to-end consistency across:

* Active V2;
* Profile V2;
* Profile V2 recovery;
* Backup V1;
* Backup V2;
* lifecycle operation authority;
* migration;
* restore;
* instantiate;
* clear/recovery;
* source incarnation validation.

Only after that review should DayFrame authorize implementation of `DurableOccurrenceReference`.

---

# 124. Task Determination

**Authorized:** implementation of independently versioned Backup V2, incarnation-bearing recovery serialization, exact lifetime-preserving restore, Backup V1 compatibility and fresh-lifetime import semantics, Active V2 persistence integration, profile preservation, backup UI adaptation, and direct regression coverage.

**Not authorized:** profile inclusion in backups, Preview inclusion, Backup history, source history, DurableOccurrenceReference, PlanDecision, decision replay, scheduling redesign, or changes to Profile V2 semantics.

The governing epistemic rule is:

> Backup V2 may claim lifetime continuity because it explicitly records source incarnation. Backup V1 may not make that claim because it does not.

---

# 125. Final Completion Statement

**Task 2.30 is complete when DayFrame has an independently versioned Backup V2 recovery artifact that exports and restores the exact incarnation-bearing active authored source graph; preserves all seven source lifetimes and nested lifetime identity across repeated restore; retains Backup V1 as incarnation-free compatibility input that instantiates fresh active lifetimes; validates surface/version/incarnation/reference integrity without silent repair; replaces active authority atomically while preserving profiles and clearing Preview; persists restored state through Active V2 with truthful durability/retry behavior; leaves scheduling and OccurrenceIdentity V1 unchanged; passes complete repository validation; and introduces no DurableOccurrenceReference, PlanDecision, source history, execution history, or unrelated backup-system expansion.**
