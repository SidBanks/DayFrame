# Task 2.17 — Implement Non-Destructive Semantic Validation and Explicit Results for Profile Load and Backup Import

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.17
**Execution Type:** Bounded Implementation
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing implementation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution results must be recorded separately in:

`TASK_2.17_IMPLEMENT_NON_DESTRUCTIVE_PROFILE_AND_BACKUP_INGRESS_VALIDATION_RESULT.md`

This task authorizes one bounded historical-ingress implementation affecting:

* selected saved-profile load;
* backup import.

Do not expand into active local-state rehydration recovery, checkpoint preservation, write blocking, recovery UI, source incarnation, PlanDecision, durable-format migration, or broad profile-collection redesign.

If implementation reveals one of those as a prerequisite, stop the affected work and record the dependency rather than broadening scope.

---

# 2. Purpose

Task 2.16 established the historical authored-ingress contract.

Historical data must follow:

```
raw source
    ↓
parse / format-version gate
    ↓
deterministic compatibility normalization
    ↓
complete current DayFrameAuthoredSetup
    ↓
shared Task 2.15 semantic validation
    ↓
boundary-specific activation policy
```

Task 2.16 adopted for profile and backup ingress:

## Saved Profile

If selected normalized profile data is semantically invalid or ambiguous:

* do not replace current authored authority;
* preserve the selected profile;
* preserve the profile collection;
* preserve Preview;
* perform no active persistence;
* change no active durability/desired condition;
* notify neither ordinary nor durability subscribers;
* return an explicit non-persistence load result.

## Backup

If normalized backup data is semantically invalid or ambiguous:

* do not replace current authored authority;
* preserve current Preview;
* perform no persistence;
* change no durability/desired condition;
* notify neither subscriber channel;
* leave the external backup artifact untouched;
* return an explicit import failure/recovery result.

Task 2.17 implements those two policies.

---

# 3. Governing Decisions

Task 2.16 established:

1. reuse `validateDayFrameAuthoredSetup`;
2. validate only after supported compatibility normalization;
3. advisory-only data may activate;
4. blocking semantic invalidity may not activate;
5. semantic ambiguity is non-activatable;
6. activate a complete authored snapshot or none of it;
7. no partial import/load;
8. no silent repair/remapping;
9. profile and backup source artifacts remain preserved;
10. semantic invalidity is separate from:

    * parse corruption;
    * unsupported format;
    * structural invalidity;
    * durability failure;
11. successful activation still uses existing active persistence and durability behavior;
12. rejected ingress performs no active write or notification;
13. active-local rehydration remains a separate future seam.

---

# 4. Objective

Implement:

1. semantic validation of selected normalized profile data before activation;
2. semantic validation of normalized backup data before activation;
3. explicit profile-load result semantics;
4. explicit backup-import result semantics where required;
5. accepted-with-advisory behavior;
6. atomic rejection with no side effects;
7. preservation of profile/backup source artifacts;
8. production workflow caller adaptation;
9. regression protection for current valid activation/persistence behavior.

Do not change active local construction.

---

# 5. Shared Semantic Validator

Use the existing Task 2.15:

`validateDayFrameAuthoredSetup`

Do not create a second historical validator.

Historical ingress may wrap/classify its result differently, but the semantic authored-validity facts must come from the same pure validator.

---

# 6. Validation Placement — Profile

The selected profile pipeline must become conceptually:

```
profile collection already loaded
    ↓
selected profile
    ↓
existing compatibility-normalized DayFrameAuthoredSetup
    ↓
validateDayFrameAuthoredSetup
    ↓
valid / advisories only
    → activate

blocking invalid
    → reject load
```

Do not validate obsolete raw singular shapes before existing profile normalization.

---

# 7. Validation Placement — Backup

The backup pipeline must become:

```
file text
    ↓
parse
    ↓
app/version/envelope checks
    ↓
existing compatibility normalization
    ↓
complete DayFrameAuthoredSetup
    ↓
validateDayFrameAuthoredSetup
    ↓
valid / advisories only
    → activate

blocking invalid
    → reject import
```

Do not bypass existing parse/version/structure checks.

---

# 8. Ingress Semantic Classification

Introduce the smallest shared semantic classification necessary to describe normalized historical authored data.

Conceptually:

```
accepted
acceptedWithAdvisories
recoveryRequired
```

If implementation benefits from distinguishing:

```
semanticallyInvalid
ambiguous
```

that may be represented in the result, but do not build a broad ingress framework unless necessary.

Task 2.17 does not need to model active-local status yet.

---

# 9. Ambiguity Classification

Task 2.16 identified duplicate referents plus linked IDs as the primary confirmed ambiguity case.

If the existing validator provides enough information to deterministically recognize ambiguity, a narrow pure helper may classify it.

Examples:

* duplicate template IDs + recurrence referencing that ID;
* duplicate shift-definition IDs + segment/sequence reference.

Do not guess ambiguity where evidence is insufficient.

If the implementation cannot safely distinguish ambiguity from generic semantic invalidity, return a recovery-required semantic-invalid result while preserving the validator issues and document the limitation.

Do not block the task merely to invent a full ambiguity taxonomy.

---

# 10. Profile Load Result Contract

Replace or extend current profile-load result semantics with a discriminated result.

Preferred conceptual contract:

```
{
  status: "loaded",
  state,
  persistence,
  advisories
}
```

or:

```
{
  status: "recoveryRequired",
  reason: "invalidAuthoredState" | "ambiguousAuthoredState",
  validation
}
```

Existing not-found behavior must remain explicitly representable.

If current `loadProfile` throws for missing profile, determine the smallest type-safe migration consistent with existing callers and tests.

Do not conflate semantic rejection with persistence failure.

---

# 11. Profile Loaded Result

For a semantically valid normalized profile:

* replace all seven active authored fields;
* preserve saved-profile collection;
* clear Preview;
* retain active desired condition as snapshot according to existing mutation behavior;
* attempt active persistence;
* update active durability;
* notify ordinary subscribers once;
* return loaded state and persistence outcome;
* preserve advisories where present.

Do not change valid load behavior beyond explicit result shape/advisory information.

---

# 12. Profile Recovery-Required Result

For blocking semantic invalidity:

* active authored state unchanged;
* profile collection unchanged;
* selected profile preserved;
* Preview unchanged;
* no active persistence attempt;
* active desired durable condition unchanged;
* active durability status unchanged;
* profile durability status unchanged;
* no ordinary notification;
* no durability notification;
* return validator evidence.

Do not return a fake persistence outcome.

---

# 13. Profile Not-Found Behavior

Preserve current truthful missing-profile behavior.

If migrating from thrown error to discriminated `notFound` improves consistency without changing broader behavior, it is allowed only if bounded and production callers are adapted.

Do not turn Task 2.17 into general profile API redesign.

---

# 14. Invalid Profile Preservation

Semantic rejection must not:

* delete the profile;
* rewrite its data;
* normalize it back into durable storage;
* filter it from the runtime collection;
* replace it with defaults.

The selected profile remains a user artifact.

---

# 15. Profile Collection Preservation

Task 2.16 identified current collection behavior where invalid records may be silently filtered and outer errors may collapse the collection to empty.

Task 2.17's primary scope is **selected profile semantic validation**.

Do not silently expand into a full raw-profile-collection preservation redesign unless selected-profile validation cannot be implemented truthfully without it.

If current collection parsing already removes a semantically invalid profile before selection, identify that as a blocker/deferred seam.

Do not fabricate preservation after data has already been discarded upstream.

---

# 16. Profile Advisories

If selected normalized profile is valid with advisories only:

* load it;
* return advisories;
* do not mark recovery required;
* do not change authored data to remove unsupported intent.

No global advisory surface is required.

---

# 17. Backup Result Contract

Backup import must distinguish at least:

* existing parse/format/structural failures;
* semantic recovery-required rejection;
* successful import with persistence result.

Preferred conceptual shape:

```
{
  status: "imported",
  state,
  persistence,
  advisories
}
```

or:

```
{
  status: "recoveryRequired",
  reason: "invalidAuthoredState" | "ambiguousAuthoredState",
  validation
}
```

Existing parser/version failures may remain typed thrown errors if that is the established API, provided semantic rejection is not misreported as one of them.

Prefer the smallest coherent result model.

---

# 18. Backup Imported Result

For semantically valid normalized backup data:

* replace all seven active authored fields;
* preserve profiles;
* clear Preview;
* set active desired condition according to existing valid activation behavior;
* persist active state;
* update active durability;
* notify ordinary subscribers once;
* return imported state/persistence result;
* preserve advisories where present.

---

# 19. Backup Recovery-Required Result

For semantic invalidity/ambiguity:

* current authored state unchanged;
* profiles unchanged;
* Preview unchanged;
* no persistence attempt;
* no desired-condition change;
* no durability-status change;
* no ordinary notification;
* no durability notification;
* return semantic validation evidence;
* external backup data is not modified.

---

# 20. No Partial Backup Import

Do not:

* discard invalid templates;
* drop malformed manual events;
* remove dangling recurrences;
* import only valid cycles;
* synthesize defaults for invalid relationships.

The normalized complete snapshot either activates or does not.

Existing deterministic compatibility normalization may remain.

---

# 21. Parse Failure Preservation

Backup parse failure remains distinct from semantic invalidity.

Do not route malformed JSON into the authored validator.

Current workflow error behavior may remain.

---

# 22. Unsupported Backup Version Preservation

Unsupported version remains distinct.

Do not classify it as `recoveryRequired: invalidAuthoredState`.

Preserve current explicit version error semantics unless a narrow result migration is required.

---

# 23. Structural Invalidity Preservation

Input that fails existing backup structural/envelope checks must not proceed to semantic validation.

Preserve existing structural failure semantics.

---

# 24. Compatibility Normalization Preservation

Historical supported forms such as singular `shiftCycle` continue to normalize before validation.

Direct tests must prove valid legacy profile/backup data remains loadable/importable.

Do not retire compatibility readers.

---

# 25. Advisory-Only Historical Data

For `perShiftSegment` or `custom` recurrence advisory-only data:

* profile load succeeds;
* backup import succeeds;
* active authored state retains the recurrence unchanged;
* advisories remain derived result facts.

Do not trigger recovery-required.

---

# 26. Semantic Invalidity Versus Durability Failure

This distinction must be directly protected.

## Semantic rejection

```
source did not become authority
    → no persistence outcome
```

## Successful historical activation + persistence failure

```
source became runtime authority
    → persistence outcome reports failure
    → durability semantics apply normally
```

Do not collapse these states.

---

# 27. Profile Persistence Failure After Valid Load

A valid profile may load successfully while active persistence returns:

* unavailable;
* storageFailure;
* serializationFailure.

Result must remain `loaded`.

Runtime replacement remains authoritative for the session.

Existing durability feedback/retry behavior remains.

---

# 28. Backup Persistence Failure After Valid Import

Equivalent:

A valid backup may import into runtime while active persistence fails.

Result remains `imported`.

Do not reinterpret it as ingress recovery failure.

---

# 29. Desired Durable Condition

For rejected profile/backup semantic ingress:

* retain existing active desired condition.

For accepted activation:

* preserve current existing snapshot intent behavior.

No new desired-condition values.

---

# 30. Durability Status

Rejected semantic ingress changes no durability status.

Accepted activation updates active durability from its write outcome as before.

Profile collection durability is untouched by profile load semantic rejection.

---

# 31. State Subscriber Semantics

Rejected profile/backup semantic ingress:

* zero ordinary notifications.

Accepted activation:

* preserve existing one-notification behavior.

Direct tests required.

---

# 32. Durability Subscriber Semantics

Rejected semantic ingress:

* zero durability notifications.

Accepted activation:

* notifications only when existing active durability status changes according to current store semantics.

Direct tests required where practical.

---

# 33. Preview Semantics

Rejected ingress preserves Preview exactly.

Accepted profile/backup activation clears Preview exactly as current behavior.

Direct tests required.

---

# 34. Runtime State Clone Safety

Returned loaded/imported state must preserve existing clone semantics.

Validation results must not expose mutable references into profile/backup/store state.

---

# 35. Production Profile Caller

Audit `DayFrameApp` profile-load workflow.

It must branch on result status before:

* treating profile as loaded;
* displaying durable persistence feedback;
* navigating/clearing workflow state;
* assuming Preview was cleared.

Semantic rejection must remain local and truthful.

---

# 36. Production Backup Caller

Audit backup import workflow.

It must distinguish:

* parser/version/structure error;
* semantic recovery-required rejection;
* imported-with-persistence result.

Do not send semantic rejection to the durability classifier.

---

# 37. Minimal Profile Feedback

For recovery-required profile load, provide only the minimum truthful workflow-local feedback needed to indicate:

* the profile was not loaded;
* current DayFrame state remains unchanged;
* the profile was preserved;
* its authored data needs recovery before activation.

Do not build profile-recovery UI.

Exact copy may follow current message conventions.

---

# 38. Minimal Backup Feedback

For recovery-required backup import, provide only minimum truthful workflow-local feedback:

* backup was not imported;
* current state remains unchanged;
* the backup file is not modified;
* recovery/conversion is required before activation.

Do not add conversion controls.

---

# 39. No Persistent Global Recovery Surface

Task 2.17 handles operation-local profile/backup rejection.

Do not add app-shell persistent ingress recovery awareness.

That belongs primarily to future active-local recovery work.

---

# 40. No Recovery Actions

Do not add:

* repair;
* remap;
* migrate;
* convert;
* export invalid profile;
* reset;
* replace;
* abandon.

Task 2.17 only detects/rejects/preserves.

---

# 41. Profile Delete Preservation

Existing profile deletion remains allowed independently of whether a profile would fail semantic load.

Do not block deletion because profile contents are invalid.

---

# 42. Profile Save Preservation

Saving current valid authored state to a profile remains unchanged.

Task 2.15 already guarantees current authority is valid.

No additional semantic validator call is required unless code reuse makes it harmless and useful.

Do not alter profile save result semantics unnecessarily.

---

# 43. Backup Export Preservation

Export current valid authored state exactly as before.

No new validation/recovery metadata in backup format.

---

# 44. Profile Raw-Record Limitation

Task 2.16 found current profile collection normalization may discard invalid records before selection.

Task 2.17 must explicitly audit whether semantic-invalid-but-structurally-accepted profiles survive into `savedProfiles`.

If they do, implement selected-profile rejection as planned.

If they do not, record the exact upstream loss boundary.

Do not silently widen scope into raw-collection redesign without authorization.

---

# 45. Manual-Event Normalization Limitation

Task 2.16 found historical manual-event normalization can drop malformed events.

Task 2.17 must not claim that semantic validation preserves data already discarded by compatibility normalization.

Directly document this limitation.

Do not redesign manual-event ingress.

---

# 46. Ambiguous Duplicate Referents

Add representative semantic-invalid fixtures such as:

```
duplicate template IDs
    +
recurrence → duplicate ID
```

or:

```
duplicate shift-definition IDs
    +
segment → duplicate ID
```

Use the validator result to reject activation.

If a separate ambiguity classifier is implemented, directly prove classification.

Otherwise preserve issues and classify broadly as recovery-required.

---

# 47. Pure Ingress Classification Helper

If useful, introduce a narrow pure helper that accepts:

* surface;
* authored validation result;

and returns:

* accepted;
* acceptedWithAdvisories;
* recoveryRequired.

Do not include persistence outcomes.

Do not make it aware of UI.

---

# 48. No Active-Local Status

Do not introduce the Task 2.16 retained active-local ingress status in this task.

That is explicitly deferred.

---

# 49. No Active-Write Guard

Do not block ordinary active persistence globally.

Profile/backup semantic rejection simply does not activate, so no guard is needed.

The write guard belongs to future local safe-fallback recovery.

---

# 50. No Retry Changes

Durability retry remains unchanged.

Rejected profile/backup ingress creates no durability failure and therefore no Retry.

---

# 51. No Source-Incarnation Changes

Do not:

* alter authored IDs;
* add incarnation tokens;
* change OccurrenceIdentity version;
* persist semantic identity.

---

# 52. No PlanDecision

Do not add PlanDecision state or durable occurrence references.

---

# 53. Profile Test — Valid Current Data

Load a semantically valid current profile.

Assert existing replacement, Preview clearing, persistence, durability, and subscriber behavior remain.

---

# 54. Profile Test — Valid Legacy Singular Cycle

Load a V1 legacy profile containing supported singular `shiftCycle`.

Assert:

* normalization occurs;
* semantic validation passes;
* profile loads;
* current plural authored state activates.

---

# 55. Profile Test — Semantic Invalidity

Construct a profile that survives existing structural normalization but fails the authored validator.

Assert:

* result is recovery-required;
* current authored state unchanged;
* Preview unchanged;
* profile preserved;
* collection preserved;
* no active persistence;
* no state notification;
* no durability notification;
* desired condition unchanged;
* durability status unchanged.

---

# 56. Profile Test — Ambiguous Duplicate Reference

Use a duplicate-ID/reference fixture where feasible.

Assert no activation.

If classification distinguishes ambiguity, assert exact result.

---

# 57. Profile Test — Advisory Only

Load valid profile containing unsupported declared recurrence.

Assert:

* load succeeds;
* advisories returned;
* recurrence retained unchanged;
* normal active persistence occurs.

---

# 58. Profile Test — Persistence Failure After Valid Load

Valid profile + failing active storage write.

Assert:

* result status is loaded;
* runtime state replaced;
* persistence outcome reports failure;
* durability status changes normally.

This protects ingress-versus-durability separation.

---

# 59. Profile Test — One Invalid Profile Does Not Destroy Collection

Where current upstream representation allows:

* collection contains valid and semantic-invalid profile;
* invalid load rejects;
* valid profile remains available and loadable;
* invalid profile remains present.

If current collection parser filters it before selection, document this as a discovered upstream blocker rather than falsifying the test.

---

# 60. Backup Test — Valid Current Data

Import semantically valid current backup.

Assert existing activation/persistence behavior.

---

# 61. Backup Test — Valid Legacy Singular Cycle

Import supported V1 singular-cycle backup.

Assert normalization + validation + successful activation.

---

# 62. Backup Test — Semantic Invalidity

Normalized backup fails validator.

Assert:

* recovery-required result or equivalent;
* active authored state unchanged;
* Preview unchanged;
* profiles unchanged;
* no persistence;
* no ordinary notification;
* no durability notification;
* desired condition unchanged;
* durability status unchanged.

---

# 63. Backup Test — Ambiguous Duplicate Reference

Representative ambiguity fixture.

Assert no activation.

---

# 64. Backup Test — Advisory Only

Valid backup with unsupported declared recurrence.

Assert import succeeds with advisories.

---

# 65. Backup Test — Persistence Failure After Valid Import

Valid backup activates; active persistence fails.

Assert:

* status remains imported;
* runtime replacement remains;
* persistence outcome reports failure;
* durability semantics unchanged.

---

# 66. Backup Test — Parse Failure Distinction

Existing malformed JSON test must continue to follow parse-error behavior, not semantic recovery-required.

---

# 67. Backup Test — Unsupported Version Distinction

Existing unsupported-version test remains distinct.

---

# 68. Backup Test — Structural Invalidity Distinction

Existing structural-invalid backup must fail before semantic validation.

---

# 69. No Partial Activation Test

Create backup/profile snapshot with one valid and one invalid authored area.

Assert none of the snapshot activates.

---

# 70. Preview Preservation Test

Use non-null current Preview before rejected profile/backup ingress.

Assert exact Preview preservation.

---

# 71. Persistence Byte Preservation

For rejected ingress, if test storage is available:

* capture active persisted payload before operation;
* reject profile/backup;
* assert payload unchanged.

---

# 72. Result Type Exhaustiveness

Use discriminated unions so production callers must explicitly handle recovery-required outcomes.

Do not return ambiguous objects containing optional `.state`, `.persistence`, and `.validation` simultaneously.

---

# 73. Profile Result Type Scope

Avoid unnecessarily changing profile save/delete result contracts.

If `loadProfile` currently shares a broad result type, split it narrowly.

Do not make unrelated profile mutations handle load-specific recovery statuses.

---

# 74. Backup Result Type Scope

Likewise keep import-specific result semantics separate from backup export/parser types.

---

# 75. Durability Semantic Classifier

Only imported/loaded results containing a real persistence outcome may flow into existing durability classification.

Add no ingress recovery category to `durabilitySemantics.ts` unless compile architecture absolutely requires a separate non-durability helper.

Prefer not to touch durability semantics.

---

# 76. Compatibility Readers

Keep all existing supported legacy readers.

No compatibility reader retirement.

---

# 77. Durable Formats

No changes to:

* local storage format;
* profile format/version;
* backup format/version.

Validation results are runtime/workflow metadata.

---

# 78. Migration Evidence

Successful legacy normalization plus validation does not constitute completed durable migration.

Do not mark migration complete or alter compatibility governance.

---

# 79. Result Artifact — Upstream Profile Loss

The result must explicitly state whether current profile collection loading can preserve semantic-invalid profiles through selection.

If not, identify:

* which records are discarded;
* where;
* why Task 2.17 could not correct that without broader raw-ingress work;
* recommended follow-up.

This is a mandatory truthfulness section.

---

# 80. Result Artifact — Manual Event Loss

Likewise state whether compatibility normalization may discard malformed historical manual events before semantic validation.

Do not claim complete non-destructive preservation if this remains true.

---

# 81. Production Reference Audit

After implementation confirm:

* selected profile validation happens before active replacement;
* backup validation happens before active replacement;
* rejected results cannot reach persistence classifier;
* no caller assumes load/import always succeeded;
* no active-local construction path uses the new ingress logic;
* no durable writer changed.

---

# 82. Expected Files To Change

Likely:

* `code/src/state/types.ts`;
* `code/src/state/dayFrameStore.ts`;
* perhaps a narrow historical-ingress semantic helper;
* store tests;
* `code/src/ui/DayFrameApp.tsx`;
* UI tests;
* backup/profile tests if separate.

Do not broaden into persistence reader redesign unless needed for selected-profile truthfulness.

---

# 83. Explicit Non-Goals

Task 2.17 shall not:

* change active local rehydration;
* add safe fallback;
* preserve local raw checkpoint into new storage;
* add active write guard;
* add ingress-status subscription;
* add persistent recovery banner;
* redesign profile collection storage;
* guarantee preservation of records already discarded by current parser;
* redesign manual-event normalization;
* implement migration;
* repair duplicates;
* remap references;
* convert backups;
* add recovery controls;
* alter durable formats;
* alter format versions;
* remove compatibility readers;
* add source incarnation;
* change occurrence identity;
* add PlanDecision;
* update ADRs;
* update `CURRENT_STATE.md`;
* update `CHANGELOG.md`;
* create a checkpoint;
* perform unrelated cleanup.

---

# 84. Required Result Artifact Structure

The Task 2.17 result must contain at least:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Shared Validator Reuse
6. Profile Validation Placement
7. Backup Validation Placement
8. Ingress Semantic Classification
9. Profile Load Result Contract
10. Profile Valid Load Semantics
11. Profile Recovery-Required Semantics
12. Profile Advisory Semantics
13. Profile Persistence-Failure Separation
14. Profile Source Preservation
15. Profile Collection Preservation
16. Profile Raw-Record Limitation
17. Backup Import Result Contract
18. Backup Valid Import Semantics
19. Backup Recovery-Required Semantics
20. Backup Advisory Semantics
21. Backup Persistence-Failure Separation
22. Backup Source Preservation
23. Parse / Version / Structure Distinction
24. Compatibility-Normalization Preservation
25. Atomic Activation / No Partial Import
26. Preview Preservation
27. Persistence / Durability Preservation On Rejection
28. Subscriber Preservation On Rejection
29. Desired-Condition Preservation
30. Production Profile Caller Migration
31. Production Backup Caller Migration
32. Workflow Feedback
33. Manual-Event Normalization Limitation
34. Historical-Ingress Scope Preservation
35. Active-Local Exclusion
36. OccurrenceIdentity / Source-Incarnation Preservation
37. Tests Added or Updated
38. Production Reference Audit
39. Compatibility Assessment
40. Deviations
41. Discoveries and Deferred Work
42. Recommended Next Task
43. Validation
44. Final Completion Determination

---

# 85. Validation Requirements

Run focused tests first:

```
profile/store load tests
backup/store import tests
DayFrameApp workflow tests
```

Then repository-standard validation:

```
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```
git diff --check
```

Record:

* focused profile test count;
* focused backup test count;
* workflow test count;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result;
* task artifact SHA-256;
* specification immutability.

Confirm:

* active local rehydration unchanged;
* no active write guard added;
* no durable format changed;
* no governance document changed;
* no migration added;
* no source-incarnation or PlanDecision behavior added.

---

# 86. Completion Criteria

Task 2.17 is complete only when:

* selected normalized profiles are semantically validated before activation;
* normalized backups are semantically validated before activation;
* the Task 2.15 validator remains the semantic source of truth;
* advisory-only historical data may load/import normally;
* blocking invalid profile data cannot replace current authority;
* blocking invalid backup data cannot replace current authority;
* profile rejection preserves current authored state and Preview;
* backup rejection preserves current authored state and Preview;
* rejected ingress performs no active persistence;
* rejected ingress changes no durability status or desired condition;
* rejected ingress notifies neither subscriber channel;
* invalid profile source remains preserved to the extent current upstream collection handling permits;
* external backup remains untouched;
* no partial activation occurs;
* successful valid load/import preserves existing persistence and durability behavior;
* persistence failure after successful activation remains a durability issue, not ingress failure;
* production callers handle all result variants explicitly;
* parse/version/structural errors remain distinct;
* compatibility readers remain active;
* current known profile/manual-event preservation limitations are truthfully recorded;
* active-local recovery remains untouched;
* focused and repository-standard validation pass;
* immutable task artifact remains unchanged.

---

# 87. Task Determination

Task 2.17 is a bounded historical-ingress safety implementation.

It exists because profile load and backup import currently have an already-valid active session to preserve when historical source data cannot safely become authority.

The implementation must establish:

```
normalized historical source
    ↓
semantic validation
    ↓
valid
    → activate atomically

invalid / ambiguous
    → preserve current authority
    → preserve source
    → reject explicitly
```

This is intentionally simpler than active local-state recovery, where DayFrame must construct usable runtime authority while simultaneously protecting the invalid checkpoint from overwrite.

Task 2.17 must therefore solve only the profile and backup seams and leave active-local safe fallback, retained recovery state, and write blocking for the next dedicated task.

**Task 2.17 is complete when DayFrame validates selected profiles and normalized backups before activation, atomically rejects semantic-invalid historical ingress without state/Preview/persistence/durability/subscriber effects, preserves valid historical activation and post-activation durability semantics, truthfully records current upstream preservation limitations, and introduces no active-local recovery, migration, source-incarnation, or PlanDecision behavior.**
