# Task 3.14 — Define and Implement Backup V3 Across Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan

## Status

Ready for resumed implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded backup-domain schema, complete-authority export, validation, cross-surface restore-target construction, compatibility, and integration task.

Task 3.14 previously stopped because DayFrame lacked an interruption-safe way to replace authority across localStorage and IndexedDB.

That prerequisite is now complete.

Task 3.14A established:

* durable `RestoreTransactionId`;
* startup-visible restore journal;
* durable target staging;
* durable recovery staging;
* source fingerprints and source recheck;
* exact five-participant participant adapters;
* atomic ExecutionHistory + HistoricalPlan IndexedDB replacement;
* verified Active/Profile/PlanDecision localStorage replacement;
* ExecutionHistory anti-resurrection preservation;
* deterministic roll-forward;
* exact rollback;
* startup recovery before ordinary authority commit;
* recovery-required protection;
* coherent five-participant runtime installation.

Task 3.14 therefore resumes with restore mechanics explicitly delegated to the established Task 3.14A infrastructure.

This task includes:

* Backup V3 envelope;
* complete five-surface authority export;
* strict Backup V3 validation;
* deterministic canonicalization;
* Backup V3 semantic fingerprinting;
* Active V2 backup representation;
* Profiles V2 backup representation;
* PlanDecision V1 backup representation;
* ExecutionHistory V1 backup representation;
* ExecutionHistory quarantine preservation;
* HistoricalPlan V1 complete publication-history representation;
* protected-state export policy;
* accepted-undurable-authority export policy;
* V3 JSON serialization;
* V3 version dispatch;
* exact five-participant restore-target construction;
* restore through the Task 3.14A coordinator;
* Preview clearing after successful V3 restore;
* no HistoricalPlan publication caused by restore;
* ExecutionHistory anti-resurrection verification;
* Backup V1/V2 compatibility preservation;
* round-trip and restart regression coverage;
* minimal existing backup UI/API integration.

It does **not** implement:

* another restore transaction mechanism;
* another journal;
* another staging format;
* Backup V4;
* cloud backup;
* synchronization;
* encryption;
* compression unless required for correctness;
* incremental backup;
* Progress;
* Goals;
* learning;
* historical metrics;
* Active/Profile/PlanDecision IndexedDB migration;
* new execution or HistoricalPlan semantics.

---

# 1. Execution Artifact Rules

This resumed task artifact is immutable once execution begins.

Before implementation:

1. verify the supplied resumed Task 3.14 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 3.14A is complete and accepted;
6. review:

   * original stopped Task 3.14 result;
   * Task 3.14A result;
   * existing Backup V1/V2 implementation;
   * current Active V2 authority;
   * Profiles V2 authority;
   * PlanDecision V1 authority;
   * ExecutionHistory V1 export/quarantine APIs;
   * HistoricalPlan V1 export APIs;
   * Task 3.14A restore coordinator participant contract;
   * current backup import/export UI;
7. do not modify the immutable execution artifact during implementation.

Write the resumed execution result separately to:

`docs/implementation/phase-3/TASK_3.14_RESUMED_DEFINE_AND_IMPLEMENT_BACKUP_V3_ACROSS_ALL_DURABLE_AUTHORITY_SURFACES_RESULT.md`

Preserve the earlier stopped Task 3.14 result as historical evidence.

---

# 2. Purpose

Backup V3 is the first DayFrame backup format intended to preserve the complete current durable authority model:

```text
Active V2
Profiles V2
PlanDecision V1
ExecutionHistory V1
HistoricalPlan V1
```

The format must be independent from whether those surfaces currently live in:

* localStorage;
* IndexedDB;
* some future storage engine.

The backup represents **domain authority**, not physical persistence.

---

# 3. Governing Backup Principle

> **A DayFrame backup is a portable representation of the authority the user owns, not a dump of the storage engine that happens to hold it.**

Therefore Backup V3 must not contain physical implementation details such as:

* localStorage keys;
* IndexedDB object-store wrappers;
* IndexedDB indexes;
* physical DB version;
* restore journal;
* restore staging;
* migration marker rows;
* cache structures;
* listener state.

---

# 4. Governing Restore Principle

Backup V3 restore is:

> **complete replacement of the five included authority surfaces with one validated Backup V3 authority snapshot.**

It is not:

* merge;
* reconciliation;
* timestamp winner selection;
* partial import;
* “restore what validates.”

Task 3.14A owns the physical/logical replacement transaction.

Task 3.14 owns what target authority that transaction receives.

---

# 5. Current Durable Surface Matrix

Audit and confirm:

| Surface          | Domain version | Current physical authority |
| ---------------- | -------------- | -------------------------- |
| Active           | V2             | localStorage               |
| Profiles         | V2             | localStorage               |
| PlanDecision     | V1             | localStorage               |
| ExecutionHistory | V1             | IndexedDB                  |
| HistoricalPlan   | V1             | IndexedDB                  |

ExecutionHistory retained legacy localStorage migration evidence is not current authority.

---

# 6. Backup V3 Version

Introduce:

```ts
BACKUP_VERSION_V3 = 3
```

or repository-equivalent.

Backup version is independent from:

* domain surface versions;
* IndexedDB physical version;
* restore journal version.

---

# 7. Backup V3 Envelope

Preferred conceptual shape:

```ts
type DayFrameBackupV3 = {
  app: "DayFrame";
  surface: "backup";
  version: 3;
  exportedAt: CanonicalUtcTimestamp;
  data: {
    active: ActiveV2BackupData;
    profiles: ProfilesV2BackupData;
    planDecisions: PlanDecisionV1BackupData;
    executionHistory: ExecutionHistoryV1BackupData;
    historicalPlan: HistoricalPlanV1BackupData;
  };
};
```

Use exact repository conventions where they already exist.

---

# 8. `exportedAt`

`exportedAt` is backup metadata only.

It must:

* be canonical UTC;
* not become restored domain evidence;
* not alter existing timestamps;
* not affect semantic authority equality.

---

# 9. Backup V3 Must Be Self-Contained

A valid V3 file must restore complete included authority without requiring:

* old localStorage;
* old IndexedDB;
* retained ExecutionHistory legacy evidence;
* current Preview;
* recurrence reconstruction;
* current clock;
* current source definitions outside the backup.

---

# 10. Active V2 Export

Export exact current Active V2 authority.

Preserve:

* authored source IDs;
* source incarnation IDs;
* nested source lifetimes;
* shift/segment/sequence-day incarnations where applicable;
* preferences;
* manual events;
* current authored configuration.

Do not project down to Active V1.

---

# 11. Active Source Incarnation Preservation

Backup V3 restores exact source incarnations.

This differs intentionally from earlier backup formats that may instantiate fresh Active lifetimes.

V3 is an exact authority restoration format.

---

# 12. Profiles V2 Export

Export exact current Profiles V2 authority.

Preserve:

* Profile IDs;
* names;
* saved timestamps;
* exact authored pattern/source incarnation content;
* quarantine/protection representation if current canonical Profile surface contains it.

Do not save/load Profiles through normal lifecycle workflows during V3 restore.

---

# 13. PlanDecision V1 Export

Preserve exact current PlanDecision authority:

* decision IDs;
* target references;
* decision semantics;
* accepted timestamps;
* applicable stored version fields.

Do not reconstruct decisions from Preview.

---

# 14. ExecutionHistory V1 Export

Export exact current ExecutionHistory domain authority.

Preserve every:

* `ExecutionSubjectId`;
* `ExecutionRecordId`;
* correction/retraction chain;
* `DurableOccurrenceReference`;
* historical snapshot;
* outcome;
* actual-time evidence;
* duration;
* note;
* provenance;
* `recordedAt`.

No historical record regeneration.

---

# 15. ExecutionHistory Quarantine

ExecutionHistory quarantine is governed preserved evidence and must be included in Backup V3.

Preserve:

* quarantine handles;
* reasons/codes;
* raw evidence;
* known IDs;
* current canonical quarantine structure.

A quarantine component is not equivalent to backup corruption.

---

# 16. ExecutionHistory Legacy Migration Evidence

Do **not** export the retained legacy ExecutionHistory localStorage checkpoint as authority.

After IndexedDB establishment it is migration evidence only.

Backup V3 represents the current ExecutionHistory authority.

---

# 17. ExecutionHistory Anti-Resurrection Marker

Do not serialize the marker as backup-domain content.

The V3 restore target must cause Task 3.14A’s ExecutionHistory participant to establish correct anti-resurrection infrastructure during restore.

---

# 18. HistoricalPlan V1 Export

Export the complete validated HistoricalPlan ledger.

Preserve:

* every publication batch ID;
* every `publishedAt`;
* requested ranges;
* every complete user-day publication;
* explicit empty days;
* frozen day boundary;
* frozen `weekStartsOn`;
* frozen UTC-offset context;
* all historical planned occurrence snapshots;
* scheduled/unplaced/omitted/blocked states;
* exact DurableOccurrenceReferences.

Do not regenerate from current Preview.

---

# 19. HistoricalPlan Publication Ordering

Use canonical deterministic ordering independent of IndexedDB physical insertion order.

Preserve semantic publication ordering.

---

# 20. HistoricalPlan Empty Day

Explicit empty historical day authority must remain present.

Do not collapse:

```text
published empty day
```

into:

```text
no publication
```

---

# 21. Protected Surface Export Policy

Canonical Backup V3 must not falsely claim completeness.

Adopt:

> If a whole authority surface is protected such that DayFrame cannot safely interpret canonical authority, standard Backup V3 export is unavailable.

Use existing raw recovery export separately.

Do not serialize unknown/corrupt bytes into a canonical V3 authority slot.

---

# 22. Quarantine Versus Whole Protection

Distinguish:

```text
governed quarantine
    → may be included canonically

whole-source protected/uninterpretable
    → block canonical Backup V3
```

Apply current surface semantics rather than inventing generic rules.

---

# 23. HistoricalPlan Protected State

Audit exact current HistoricalPlan protection representation.

If protected evidence prevents a complete canonical ledger export:

* canonical V3 export fails with explicit protected-surface result.

Do not silently export only valid batches while claiming complete authority.

---

# 24. Accepted Undurable Runtime Authority

Backup authority should represent **current accepted runtime authority**, not merely last durable checkpoint, where the surface can export it exactly.

Therefore:

* accepted pending ExecutionHistory records should be included;
* accepted pending HistoricalPlan publication batches should be included.

This makes Backup V3 useful as an external rescue artifact when local persistence is currently failing.

---

# 25. Non-Accepted Candidate State

Do not export:

* unaccepted HistoricalPlan materialization candidates;
* Try-only Preview;
* transient editor drafts;
* temporary restore candidates.

Only current authority.

---

# 26. Durability State

Do not serialize durability status itself.

For example:

```text
pending
failed
durable
```

are runtime persistence conditions, not user domain authority.

Backup includes the accepted authority those statuses refer to.

---

# 27. Preview

Do not export Preview.

Preview remains derived planning state.

---

# 28. Summary / Coverage

Do not export:

* OutcomeSummary;
* current reporting coverage;
* historical metrics;
* derived adherence;
* UI caches.

---

# 29. Restore Infrastructure Exclusion

Do not export:

* RestoreTransactionId;
* journal;
* target/recovery staging;
* source fingerprints;
* restore status.

---

# 30. Strict V3 Validation

Validate the entire parsed Backup V3 before invoking restore infrastructure.

No destructive operation begins until the complete backup validates.

---

# 31. Top-Level Validation

Require:

* correct app;
* correct surface;
* `version: 3`;
* canonical `exportedAt`;
* exact data keys;
* no unknown top-level fields.

---

# 32. Nested Validation

Reuse existing validators:

* Active V2 validator;
* Profiles V2 validator;
* PlanDecision V1 validator;
* ExecutionHistory V1 validator;
* HistoricalPlan V1 validators.

Do not duplicate domain validation.

---

# 33. Exact-Key Validation

V3 should be strict.

Unknown nested fields are accepted only if the underlying versioned surface explicitly permits them.

---

# 34. Cross-Surface Validation

Enforce only real architectural invariants.

Do not require all historical references to resolve in current Active.

Historical authority intentionally survives:

* source deletion;
* profile changes;
* source recreation.

---

# 35. PlanDecision Cross-Surface Validation

Audit whether current PlanDecision contracts require targets to resolve to current Active during import.

Preserve existing semantics.

Do not add a new referential restriction merely because V3 is complete.

---

# 36. Global Source-Incarnation Rules

Apply current Active/Profile validators exactly.

Do not invent cross-profile uniqueness if the existing Profile model does not require it.

---

# 37. Backup Canonicalization

Equivalent authority should export deterministically apart from explicitly non-authoritative metadata such as `exportedAt`.

Canonicalize:

* profiles;
* PlanDecision collections;
* ExecutionHistory records/quarantine;
* HistoricalPlan batches/days.

Do not rely on persistence insertion order.

---

# 38. Backup Semantic Fingerprint

Create a deterministic semantic fingerprint for V3.

Exclude:

* `exportedAt`;
* physical storage details;
* restore infrastructure.

Include all five authority payloads.

Uses:

* restore verification diagnostics;
* test equality;
* journal target identity if needed by adapter layer.

Do not use it as domain identity.

---

# 39. Export API

Provide:

```ts
exportBackupV3(...)
```

or integrate into current default backup export.

Use explicit result union.

Possible results:

* exported;
* initializing;
* restoreBusy;
* protectedSurface;
* validationFailure;
* exportFailure.

No generic boolean.

---

# 40. Export Readiness

V3 export requires coherent ready authority.

Do not export while:

* store initializing;
* authority transaction active;
* restore transaction active;
* bootstrap protected.

---

# 41. Pending Durability Export

Ready-but-undurable accepted authority may still export if exact authoritative payload is available.

Readiness and durability remain separate.

---

# 42. Clone Isolation

The returned V3 object must be fully detached from live runtime authority.

Mutating the exported object cannot mutate DayFrame.

---

# 43. JSON Safety

Plain JSON-safe values only.

No:

* Date objects;
* Map;
* Set;
* DOM objects;
* IDB wrapper records;
* functions.

---

# 44. Serialization

Support:

```text
V3 authority
    ↓
JSON.stringify
    ↓
parse
    ↓
validate V3
```

without semantic loss.

---

# 45. Backup Import Version Dispatch

Extend current import dispatch:

```text
version 1
    → existing V1 path

version 2
    → existing V2 path

version 3
    → V3 complete restore path
```

Unknown version → reject before mutation.

---

# 46. V1 Compatibility

Do not change Backup V1 behavior.

If V1 restore instantiates fresh Active source incarnations, retain that behavior.

Do not retroactively make V1 exact-lifetime restore.

---

# 47. V2 Compatibility

Preserve current V2 behavior exactly.

No V2 semantic upgrade.

---

# 48. V3 Restore Target Construction

After complete V3 validation, construct exact participant payloads for:

* Active;
* Profiles;
* PlanDecision;
* ExecutionHistory;
* HistoricalPlan.

Those payloads must satisfy Task 3.14A participant validators.

---

# 49. No Workflow-Based Target Construction

Do not build target by calling:

* profile load;
* PlanDecision accept;
* execution report;
* HistoricalPlan publish.

Construct exact authority payloads.

---

# 50. V3 Restore Invocation

Call the existing Task 3.14A restore coordinator.

Conceptually:

```text
validated Backup V3
        ↓
five participant target payloads
        ↓
restoreCoordinator.replaceAuthority(...)
```

Do not reimplement:

* staging;
* journal;
* source recheck;
* commit;
* roll-forward;
* rollback.

---

# 51. Ordinary Restore Preconditions

Use Task 3.14A’s existing ordinary restore readiness rules.

Do not create a second pending/protection policy.

---

# 52. Protected Recovery Restore

If existing product backup import is authorized to act as explicit recovery replacement, route through Task 3.14A `recoveryReplacement` mode.

Otherwise preserve ordinary protected-state behavior and leave recovery integration explicit.

Task result must determine based on current backup UX/semantics.

---

# 53. V3 Restore Replacement Semantics

All five surfaces become exactly backup authority.

No merge.

---

# 54. Active V3 Restore

Preserve exact Active V2 incarnations.

No ID allocation.

---

# 55. Profiles Restore

Preserve exact Profile IDs/content.

---

# 56. PlanDecision Restore

Preserve exact decision IDs/timestamps/targets.

---

# 57. ExecutionHistory Restore

Preserve exact:

* subjects;
* records;
* chains;
* quarantine.

Restore directly into IndexedDB authority via Task 3.14A.

---

# 58. ExecutionHistory Anti-Resurrection

After successful V3 restore:

```text
restored IndexedDB history
    = authority

legacy localStorage history
    ≠ authority
```

Mandatory restart test.

---

# 59. HistoricalPlan Restore

Preserve exact ledger.

No new publication ID.

No new `publishedAt`.

No semantic dedup as part of restore.

---

# 60. No HistoricalPlan Publication Event

Restore itself is not a planning publication.

Exact runtime install may emit the existing recovery/invalidation signal if required, but never publication-accepted semantics.

---

# 61. Preview After Successful V3 Restore

Preview is not in the backup.

After complete V3 restore:

> clear current Preview.

Reason:

* current Preview may belong to pre-restore Active/PlanDecision authority;
* restoring it would violate derived-state semantics.

---

# 62. Preview Clear Timing

Clear Preview only after the five-surface restore is durably established.

It must be coordinated so UI cannot treat an old Preview as valid after restored authority becomes visible.

Preferred:

* include Preview clearing in the final runtime authority installation/commit path where possible;
* do not create a sixth durable authority participant.

---

# 63. Preview Persistence Cleanup

If Preview has persisted derived representation:

* clear it according to current Preview-clear semantics.

Audit.

Do not alter HistoricalPlan ledger.

---

# 64. No Auto-Regeneration

Do not automatically generate a Preview after restore.

User/application normal flow may regenerate later.

---

# 65. No Auto-Publication

Clearing Preview and restoring HistoricalPlan must not generate a publication.

---

# 66. Post-Restore Summary

Outcome Summary derives naturally from restored ExecutionHistory.

Do not restore cached summary.

---

# 67. Post-Restore HistoricalPlan Queries

Must reproduce restored historical plan semantics immediately.

---

# 68. Post-Restore Execution Queries

Must reproduce restored current outcome/revision history immediately.

---

# 69. V3 Restore Result

Map Task 3.14A infrastructure results into backup-domain import results.

Possible:

* restored;
* invalidBackup;
* unsupportedVersion;
* initializing;
* restoreBusy;
* protectedCurrentState;
* stagingFailure;
* sourceChanged;
* persistenceFailure;
* rollbackCompleted;
* recoveryRequired.

Preserve actionable distinctions.

---

# 70. No Raw Restore-Infrastructure Leakage

Do not expose implementation-specific journal/store names through user-facing error text.

Domain/API may retain structured infrastructure diagnostic codes internally.

---

# 71. Restore Notifications

Rely on Task 3.14A/3.14A.1 coherent authority transaction.

Do not independently notify each restored surface from Backup V3 logic.

---

# 72. UI Integration

Extend current backup import/export interface minimally.

Required:

* standard backup export now produces V3;
* V1/V2/V3 files can be imported;
* V3 async restore is awaited;
* restoring/busy state prevents duplicate operation;
* success/failure reported using existing backup UX style.

No UI redesign.

---

# 73. Backup File Name

Use current naming convention.

If version is included, update to V3.

Example only:

```text
dayframe-backup-v3-2026-08-22.json
```

No new naming system required.

---

# 74. Backup Privacy Copy

Because V3 now contains:

* historical plans;
* execution outcomes;
* notes;
* timestamps;

audit current backup copy.

Add a concise factual warning if current UI/documentation would otherwise imply only setup data is exported.

No encryption implementation.

---

# 75. Export Size

V3 can be significantly larger than V1/V2.

Do not truncate:

* ExecutionHistory;
* HistoricalPlan;
* quarantine.

---

# 76. No Retention Limit

None introduced.

---

# 77. Memory Model

For current expected scale, complete JSON in-memory export/import is acceptable unless evidence contradicts it.

Document future streaming/compression as deferred only.

---

# 78. Restore Temporary Capacity

Task 3.14A already stages target/recovery and fails before live mutation if capacity is insufficient.

Backup V3 must not bypass staging because its payload is large.

---

# 79. Current Pending ExecutionHistory

Export exact accepted pending authority.

On successful restore to another/future instance, those records become ordinary restored durable authority.

Their previous “pending” persistence status is not restored.

Correct.

---

# 80. Current Pending HistoricalPlan

Same.

Export accepted exact pending batches.

On successful restore they become durable restored historical authority.

Do not preserve old pending durability state.

---

# 81. Restore Durability Status

After successful V3 restore:

* Active restored checkpoint durable;
* Profiles restored checkpoint durable;
* PlanDecision restored checkpoint durable;
* ExecutionHistory restored authority durable;
* HistoricalPlan restored authority durable.

Do not restore old persistence-failure statuses.

---

# 82. Quarantine Status

ExecutionHistory quarantine remains quarantine after restore.

That is domain evidence, not durability state.

---

# 83. HistoricalPlan Protection

A canonical V3 cannot contain uninterpretable whole-protected HistoricalPlan authority under the adopted export policy.

Therefore valid restored V3 HistoricalPlan should establish interpretable authority.

---

# 84. Exact Identity Preservation Audit

V3 restore must allocate zero domain IDs.

Cover:

* source incarnations;
* Profile IDs;
* PlanDecision IDs;
* ExecutionSubject IDs;
* ExecutionRecord IDs;
* HistoricalPlan batch IDs.

---

# 85. Timestamp Preservation Audit

Preserve all authority timestamps exactly.

Only new values allowed:

* backup `exportedAt`;
* restore infrastructure transaction/journal timestamps.

---

# 86. V3 Export Roundtrip

Required:

```text
Authority A
    ↓
export V3
    ↓
JSON stringify/parse
    ↓
validate
    ↓
restore into changed Authority B
    ↓
Authority = A
```

Across all five surfaces.

---

# 87. Cross-Session Roundtrip

Required:

1. construct/populate authority A;
2. export V3;
3. create different clean/restarted instance;
4. import V3;
5. restart again;
6. verify exact authority A.

Mandatory.

---

# 88. Restart Anti-Resurrection Test

After V3 restore:

* insert/retain stale legacy ExecutionHistory source;
* restart;
* restored IndexedDB ExecutionHistory remains authority.

---

# 89. Active Lifetime Test

Source incarnation before export equals source incarnation after restore.

---

# 90. Profile Lifetime Test

Exact.

---

# 91. PlanDecision Identity Test

Exact.

---

# 92. Execution Revision Test

Create:

* original report;
* correction;
* retraction;
* re-report where supported.

Export/restore.

Entire immutable chain identical.

---

# 93. Execution Quarantine Test

Quarantined component survives export/restore with same handle/evidence.

---

# 94. HistoricalPlan Revision Test

Multiple publications for same day survive.

`asOf` before/after restore produces same effective result.

---

# 95. HistoricalPlan Empty Day Test

Explicit empty publication preserved.

---

# 96. HistoricalPlan Occurrence Removal Test

Earlier publication contains occurrence, later complete publication removes by absence.

Restore preserves same as-of semantics.

---

# 97. Historical Source Deletion Test

Historical ExecutionHistory/HistoricalPlan references may point to no current Active source.

V3 validation/restore still succeeds if the historical domain itself is valid.

---

# 98. Recreated Source Lifetime Test

Old/new incarnations remain distinct after restore.

---

# 99. Export Protected ExecutionHistory Test

According to adopted policy:

* whole protected → canonical export blocked;
* canonical quarantine → included.

---

# 100. Export Protected HistoricalPlan Test

Blocked if canonical full authority cannot be interpreted.

---

# 101. Export Pending ExecutionHistory Test

Accepted pending records included.

---

# 102. Export Pending HistoricalPlan Test

Accepted pending publications included.

---

# 103. Export During Authority Transaction

Blocked.

---

# 104. Export During Restore

Blocked.

---

# 105. Export During Initializing

Blocked/not ready.

---

# 106. Export Clone Isolation Test

Mandatory.

---

# 107. Export Determinism Test

Equivalent authority, ignoring `exportedAt`, has same semantic fingerprint.

---

# 108. V3 Validation — Wrong App

Reject before restore.

---

# 109. V3 Validation — Wrong Surface

Reject.

---

# 110. V3 Validation — Unknown Version

Reject.

---

# 111. V3 Validation — Extra Top-Level Key

Reject.

---

# 112. V3 Validation — Invalid Active

Reject entire backup before mutation.

---

# 113. V3 Validation — Invalid Profiles

Same.

---

# 114. V3 Validation — Invalid PlanDecision

Same.

---

# 115. V3 Validation — Invalid ExecutionHistory

Same.

---

# 116. V3 Validation — Invalid HistoricalPlan

Same.

---

# 117. V3 Validation — HistoricalPlan Equal-Time Ambiguity

Reject.

---

# 118. V3 Validation — Duplicate Execution Identity

Follow current ExecutionHistory validation.

No invalid component allowed in canonical valid-record section.

---

# 119. V3 Restore — No Mutation On Validation Failure

Mandatory.

---

# 120. V3 Restore — SourceChanged

Task 3.14A result surfaces correctly.

No false success.

---

# 121. V3 Restore — Staging Failure

No live authority mutation.

---

# 122. V3 Restore — IndexedDB Failure

Map result truthfully.

---

# 123. V3 Restore — LocalStorage Mid-Commit Failure

Task 3.14A journal recovery/roll-forward handles it.

Backup importer must not start a second restore.

---

# 124. V3 Restore — Rollback Completed

Import result reflects restore did not complete and old authority was recovered.

---

# 125. V3 Restore — Recovery Required

Surface explicit protected failure.

No success message.

---

# 126. Interrupted Restore Test Through Backup API

At least one integration test should start a V3 import, simulate interruption after IndexedDB commit or partial localStorage commit, restart, and verify Task 3.14A completes recovery to the expected coherent side.

This proves Backup V3 actually consumes the infrastructure correctly.

---

# 127. Preview Clear Test

After successful V3 restore:

```text
preview = none
```

Mandatory.

---

# 128. No HistoricalPlan Publication Test

HistoricalPlan publication count/ledger remains exactly the restored backup.

No extra restore-generated batch.

---

# 129. No Execution Event Test

Restore creates no extra execution record.

---

# 130. V1 Import Regression

Mandatory.

---

# 131. V2 Import Regression

Mandatory.

---

# 132. Default Export Version

After successful Task 3.14:

> ordinary backup export produces V3.

Unless product currently explicitly exposes format selection.

---

# 133. Legacy Export Helpers

Retain only where necessary for compatibility/tests.

Do not expose confusing multiple default backup formats.

---

# 134. Backup V3 Does Not Require Physical Storage Knowledge

Static architecture audit.

Backup module should consume participant/domain export APIs and Task 3.14A restore coordinator rather than opening IndexedDB object stores directly.

---

# 135. No Restore Logic Duplication

Audit for Backup V3 code implementing:

* its own journal;
* its own rollback;
* its own source recheck;
* its own physical collection transaction.

None allowed.

---

# 136. Backup Surface Module

Preferred separation:

```text
dayFrameBackupV3.ts
dayFrameBackupV3Validation.ts
dayFrameBackupV3Restore.ts
```

or repository-equivalent.

Do not overload legacy Backup V1/V2 module unnecessarily.

---

# 137. Export Participant Boundary

Potential:

```ts
interface BackupV3Participant<T> {
  exportAuthority(): Result<T>;
  validateBackupAuthority(input: unknown): Result<T>;
  toRestoreTarget(authority: T): RestoreParticipantPayload;
}
```

Use only if it reduces duplication.

Avoid building a generic backup ORM.

---

# 138. Restore Target Immutability

Clone validated V3 authority before handing it to Task 3.14A.

Caller/file object mutation after import start must not alter restore target.

---

# 139. Backup Fingerprint Verification

Use V3 semantic fingerprint in roundtrip tests and optionally restore diagnostics.

Do not duplicate Task 3.14A whole-participant physical source fingerprints.

Different purposes:

```text
Backup V3 fingerprint
    = portable semantic authority

Restore participant fingerprints
    = transaction staging/source verification
```

---

# 140. No Backup Fingerprint As Identity

No.

---

# 141. Governance Checkpoint

Create:

`docs/checkpoints/CHECKPOINT_Phase_3_Backup_V3_Complete_Authority_Semantics.md`

---

# 142. Checkpoint Contents

Include:

1. V3 purpose;
2. included five authority surfaces;
3. excluded derived/infrastructure state;
4. exact lifetime preservation;
5. ExecutionHistory quarantine policy;
6. protected-surface export policy;
7. pending-authority export policy;
8. complete replacement semantics;
9. Task 3.14A integration;
10. anti-resurrection;
11. Preview clearing;
12. V1/V2 compatibility;
13. storage-engine independence;
14. Backup V4 trigger principle;
15. invariants.

---

# 143. ADR

Create/update:

`docs/adr/ADR_BACKUP_V3_COMPLETE_CROSS_SURFACE_AUTHORITY_RESTORE.md`

Record:

> Backup V3 is a domain-authority format, not a physical persistence dump.

Also record why Task 3.14A owns transactional restore mechanics.

---

# 144. Governance Updates

Update:

* `CURRENT_STATE.md`;
* `DECISIONS.md`;
* `ROADMAP.md`;
* `CHANGELOG.md` if backup-format work is tracked there.

Do not claim:

* sync;
* cloud backup;
* metrics;
* Goals.

---

# 145. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.14_RESUMED_DEFINE_AND_IMPLEMENT_BACKUP_V3_ACROSS_ALL_DURABLE_AUTHORITY_SURFACES_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Prior Stop History
4. Task 3.14A Prerequisite Confirmation
5. Initial Backup Audit
6. Files Changed
7. Backup V3 Version
8. V3 Envelope
9. Storage-Version Independence
10. Included Authority Matrix
11. Excluded State Matrix
12. Active V2 Export
13. Profiles V2 Export
14. PlanDecision V1 Export
15. ExecutionHistory V1 Export
16. ExecutionHistory Quarantine
17. ExecutionHistory Legacy-Evidence Exclusion
18. HistoricalPlan V1 Export
19. HistoricalPlan Empty-Day Preservation
20. Protected-Surface Export Policy
21. Pending-Authority Export Policy
22. Durability-State Exclusion
23. Preview/Summary Exclusion
24. Canonicalization
25. V3 Semantic Fingerprint
26. Export API
27. Export Readiness
28. Clone Isolation
29. JSON Roundtrip
30. Strict Validation
31. Cross-Surface Validation
32. Version Dispatch
33. V1 Compatibility
34. V2 Compatibility
35. Restore Target Construction
36. Task 3.14A Coordinator Integration
37. Full Replacement Semantics
38. Active Restore
39. Profiles Restore
40. PlanDecision Restore
41. ExecutionHistory Restore
42. Anti-Resurrection
43. HistoricalPlan Restore
44. Preview Clear
45. No Publication On Restore
46. No Execution Event On Restore
47. Identity Preservation
48. Timestamp Preservation
49. Restore Result Mapping
50. UI/API Integration
51. Backup Privacy/Size
52. Pending Authority After Restore
53. Post-Restore Durability
54. Full V3 Roundtrip
55. Cross-Session Roundtrip
56. Restart Stability
57. Historical Reference Independence
58. Protected Export Tests
59. Pending Export Tests
60. Validation Failure Tests
61. Restore Failure Tests
62. Interrupted Restore Integration Test
63. Preview Tests
64. HistoricalPlan Tests
65. ExecutionHistory Tests
66. V1/V2 Regression Tests
67. No Restore-Duplication Audit
68. No Physical-Storage Dump Audit
69. No Domain-ID Allocation Audit
70. No Domain-Retimestamp Audit
71. No Derived-State Audit
72. Checkpoint
73. ADR
74. Governance Updates
75. Architectural Alignment Assessment
76. Deviations
77. Discoveries and Deferred Work
78. Recommended Next Task
79. Focused Validation
80. Full Validation
81. Final Completion Determination

---

# 146. Required Matrices

## A. Backup Surface Matrix

| Surface | Included? | Version | Exact restore? |
| ------- | --------: | ------- | -------------: |

Include:

* Active;
* Profiles;
* PlanDecision;
* ExecutionHistory;
* HistoricalPlan;
* Preview;
* OutcomeSummary;
* durability state;
* restore journal.

## B. Export-State Matrix

| Surface condition | V3 export behavior |
| ----------------- | ------------------ |

Cover:

* normal durable;
* accepted pending durability;
* governed quarantine;
* whole protected;
* initializing.

## C. Version Compatibility Matrix

| Backup version | Import supported? | Restore semantics |
| -------------- | ----------------: | ----------------- |

Include:

* V1;
* V2;
* V3;
* unknown.

## D. Restore Identity Matrix

| Domain concept | Preserve exact identity? |
| -------------- | -----------------------: |

Include:

* source incarnation;
* Profile;
* PlanDecision;
* ExecutionSubject;
* ExecutionRecord;
* HistoricalPlan batch.

## E. Restore Result Matrix

| Task 3.14A result | Backup V3 import result |
| ----------------- | ----------------------- |

---

# 147. Required Architectural Invariants

At minimum prove:

1. Backup V3 represents domain authority rather than storage layout.
2. All five current durable authority surfaces are included.
3. Preview is excluded.
4. derived Summary/coverage is excluded.
5. durability status is excluded.
6. restore journal/staging are excluded.
7. ExecutionHistory legacy migration evidence is excluded.
8. ExecutionHistory governed quarantine is preserved.
9. whole protected/uninterpretable authority cannot masquerade as canonical export.
10. accepted pending ExecutionHistory authority is exportable.
11. accepted pending HistoricalPlan authority is exportable.
12. exact Active V2 source incarnations survive restore.
13. exact Profile identities survive restore.
14. exact PlanDecision identities survive restore.
15. exact execution records/revisions survive restore.
16. exact HistoricalPlan publication identities/timestamps survive restore.
17. V3 restore allocates no domain identity.
18. V3 restore retimestamps no domain authority.
19. V3 restore is complete replacement, not merge.
20. entire V3 validates before restore coordinator invocation.
21. historical references need not resolve to current Active unless an existing domain invariant requires it.
22. Task 3.14A owns journal/staging/source-recheck/roll-forward/rollback.
23. Backup V3 duplicates none of those mechanisms.
24. ExecutionHistory restore remains IndexedDB-authoritative.
25. stale legacy ExecutionHistory cannot resurrect.
26. successful V3 restore clears Preview.
27. restore itself publishes no HistoricalPlan batch.
28. restore itself creates no ExecutionRecord.
29. V1 import semantics remain unchanged.
30. V2 import semantics remain unchanged.
31. default standard export becomes V3.
32. complete V3 export/import/restart roundtrip reproduces authority.
33. Backup version remains independent from physical storage version.
34. future physical storage migration alone does not require Backup V4.

---

# 148. Focused Validation Requirements

Run focused tests for:

* V3 envelope;
* validation;
* canonicalization;
* semantic fingerprint;
* five-surface export;
* protected/quarantine policy;
* pending authority export;
* JSON roundtrip;
* target construction;
* 3.14A coordinator integration;
* exact restore;
* anti-resurrection;
* Preview clearing;
* no HistoricalPlan publication;
* no ExecutionHistory record generation;
* full roundtrip;
* restart roundtrip;
* V1/V2 compatibility;
* failure/result mapping.

---

# 149. Full Validation

Run:

```text
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

The entire repository must pass.

Record exact:

* test-file count;
* test count;
* build module count.

---

# 150. Completion Criteria

Task 3.14 is complete only when:

* strict Backup V3 exists;
* it captures exact Active V2 authority;
* exact Profiles V2 authority;
* exact PlanDecision V1 authority;
* exact ExecutionHistory V1 authority including governed quarantine;
* exact HistoricalPlan V1 publication history;
* Preview/summary/durability/restore infrastructure/legacy ExecutionHistory evidence are excluded;
* accepted pending authority is exported truthfully;
* whole protected authority is not silently omitted;
* V3 export is canonical, clone-isolated, JSON-safe, and completely validated;
* V3 semantic fingerprinting exists;
* import dispatch supports V1, V2, and V3;
* unknown versions fail before mutation;
* complete V3 validation occurs before restore invocation;
* V3 restore constructs exact five-participant targets;
* Task 3.14A coordinator performs all cross-storage transaction work;
* restore is full replacement, never merge;
* exact source incarnations and all historical identities/timestamps are preserved;
* ExecutionHistory anti-resurrection remains established;
* HistoricalPlan restore preserves publication history without adding a publication;
* no execution evidence is generated by restore;
* successful V3 restore clears Preview;
* post-restore Summary/history derive correctly;
* complete V3 roundtrip passes;
* restart after V3 restore reproduces exact authority;
* V1 and V2 behavior remain unchanged;
* default backup export produces V3;
* no restore transaction mechanics are duplicated;
* no physical-storage dump semantics are introduced;
* no Backup V4/cloud/sync/encryption/metrics/Goals/learning work is introduced;
* full validation passes;
* result artifact is complete.

---

# 151. Explicit Non-Goals

Do **not**:

* create another restore coordinator;
* create another restore journal;
* create another staging store;
* implement Backup V4;
* implement cloud backup;
* implement synchronization;
* implement encryption;
* implement incremental backup;
* truncate history;
* migrate Active/Profile/PlanDecision storage;
* export Preview;
* export Summary caches;
* export durability statuses;
* export restore metadata;
* export legacy ExecutionHistory migration evidence;
* merge V3 with current authority;
* regenerate history;
* reallocate identities;
* retimestamp domain authority;
* add Progress;
* add Goals;
* add learning;
* add historical metrics;
* redesign backup UI broadly.

---

# 152. Stop Conditions

Stop and report if:

* one of the five current authority surfaces cannot produce a complete canonical export;
* accepted pending runtime authority cannot be represented without changing a domain schema;
* governed quarantine cannot be represented safely in V3;
* protected-state completeness requires serializing uninterpretable raw evidence as canonical authority;
* Task 3.14A cannot consume the five validated V3 targets without infrastructure changes;
* successful restore cannot clear Preview coherently without another authority-participant redesign;
* V1/V2 compatibility requires changing their existing semantics;
* V3 validation requires a new cross-surface domain invariant not already accepted;
* full roundtrip reveals an architectural inconsistency between exported authority and restore-target authority.

Do not weaken complete-authority or exact-restore semantics to finish the task.

---

# 153. Recommended Follow-On Boundary

If Task 3.14 completes successfully, the immediate Phase 3 persistence/recovery stack is finally coherent:

```text
Execution evidence
        ↓
ExecutionHistory
        +
HistoricalPlan
        ↓
transactional collection storage
        ↓
migration / anti-resurrection
        ↓
complete Backup V3
```

The next task should be review-first.

Recommended:

> **Task 3.15 — Phase 3 Integration Audit, Architecture Alignment Review, and Completion Gap Assessment**

It should assess:

* execution/reporting;
* history correction;
* current Summary;
* HistoricalPlan publication;
* historical denominator readiness;
* durability/recovery;
* migration residue;
* Backup V3;
* remaining Phase 3 requirements;
* readiness for historical metrics / Goals / next phase.

Do not begin a new feature family until that integration audit is complete.

---

# 154. Task Determination

**Authorized:** Backup V3 domain schema, exact five-surface authority export, strict validation, canonicalization/fingerprinting, protected/quarantine/pending-authority policy, V3 version dispatch, exact participant restore-target construction, Task 3.14A coordinator integration, Preview clearing, V1/V2 compatibility, minimal backup UI/API integration, and comprehensive roundtrip/restart/failure coverage.

**Not authorized:** restore infrastructure duplication, Backup V4, cloud/sync/encryption, storage migrations, historical metrics, Progress, Goals, learning, new domain semantics, or unrelated UI work.

The governing resumed-task principle is:

> **The restore transaction now exists. Backup V3 must therefore remain a domain-authority format: capture exactly what the user currently owns, validate the whole truth before replacement, and hand one complete five-surface target to the restore foundation. It must neither know nor care which storage engine currently holds that authority, and it must never replace exact historical truth with reconstruction.**

---

# 155. Final Completion Statement

**Task 3.14 is complete when DayFrame defines and implements a strict, portable Backup V3 domain format containing the complete current authority of Active V2, Profiles V2, PlanDecision V1, ExecutionHistory V1 including governed quarantine evidence, and HistoricalPlan V1 including the complete immutable publication ledger; when accepted pending authority is preserved while derived Preview, Summary, durability state, restore infrastructure, physical persistence wrappers, and legacy ExecutionHistory migration evidence are excluded; when exports are canonical, clone-isolated, JSON-safe, strictly validated, and semantically fingerprintable; when V1 and V2 imports retain their existing semantics while V3 is dispatched to a complete exact-replacement path; when every V3 surface validates before any restore begins; when the resulting exact five-participant target is handed to the established Task 3.14A restore coordinator rather than duplicating journal, staging, source-recheck, roll-forward, or rollback mechanics; when restore preserves every source incarnation, Profile identity, PlanDecision identity, ExecutionSubject/ExecutionRecord revision, quarantine component, HistoricalPlan publication ID, publication timestamp, empty-day authority, and historical occurrence reference without reallocation or retimestamping; when ExecutionHistory anti-resurrection remains established, successful restore clears derived Preview without generating a HistoricalPlan publication or execution record, complete export/import/restart roundtrips reproduce the original authority, default backup export becomes V3, complete repository validation passes, and no Backup V4, cloud/sync/encryption, storage migration, historical metric, Progress, Goal, learning, or unrelated feature is introduced.**
