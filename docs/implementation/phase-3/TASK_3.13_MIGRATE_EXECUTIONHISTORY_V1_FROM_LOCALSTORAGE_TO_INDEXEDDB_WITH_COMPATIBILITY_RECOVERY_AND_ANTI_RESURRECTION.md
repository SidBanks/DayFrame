# Task 3.13 — Migrate ExecutionHistory V1 from localStorage to IndexedDB with Compatibility, Recovery, and Anti-Resurrection

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded durable-authority migration, compatibility, recovery, and anti-resurrection implementation task.

Task 3.13 migrates the existing `ExecutionHistory V1` authority surface from its bounded localStorage representation onto the transactional IndexedDB collection-storage foundation established in Task 3.10 and proven in production by HistoricalPlan in Task 3.12.

This task includes:

* IndexedDB physical schema for ExecutionHistory;
* exact migration from existing localStorage ExecutionHistory V1;
* preservation of all ExecutionRecord identities and revision chains;
* preservation of quarantine evidence;
* preservation of protected-ingress semantics;
* IndexedDB-first startup authority;
* compatibility with legacy localStorage during migration;
* migration write/read-back/domain verification;
* migration marker / authority-establishment semantics;
* anti-resurrection;
* uncertain-commit recovery;
* transactional append/correct/retract persistence;
* dedicated desired durable condition;
* exact retry;
* IndexedDB-native current/history queries where useful;
* full-clear integration;
* export/recovery compatibility;
* no ExecutionRecord semantic changes;
* comprehensive regression coverage.

It does **not** implement:

* ExecutionRecord V2;
* new outcomes;
* historical-plan metrics;
* Progress;
* Goals;
* learning;
* Backup V3;
* execution-history redesign;
* new history UI;
* imported-calendar execution linkage.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 3.10–3.12 are complete and accepted;
6. review:

   * Task 3.3 ExecutionHistory V1 result;
   * Task 3.10 IndexedDB storage-foundation checkpoint and ADR;
   * Task 3.12 HistoricalPlan IndexedDB persistence result;
   * current ExecutionHistory localStorage persistence/recovery code;
   * current ExecutionHistory store APIs and tests;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.13_MIGRATE_EXECUTIONHISTORY_V1_FROM_LOCALSTORAGE_TO_INDEXEDDB_WITH_COMPATIBILITY_RECOVERY_AND_ANTI_RESURRECTION_RESULT.md`

If migration cannot preserve every existing ExecutionHistory V1 contract without domain/schema change, stop and report rather than broadening scope.

---

# 2. Purpose

ExecutionHistory currently has mature semantics but uses a bounded whole-value localStorage persistence model.

HistoricalPlan now uses the scalable transactional collection substrate.

Task 3.13 should produce:

```text
ExecutionRecord V1
    unchanged

ExecutionHistory authority
    unchanged semantically

Physical persistence
    localStorage
        ↓ migration
    IndexedDB
```

The migration must change **where history is stored**, not **what history means**.

---

# 3. Governing Migration Principle

The central rule is:

> **Storage migration may relocate execution evidence, but it must never reinterpret, regenerate, renumber, retimestamp, merge, discard, or recreate that evidence.**

Therefore migration preserves exactly:

* `ExecutionSubjectId`;
* `ExecutionRecordId`;
* correction links;
* retraction links;
* reported outcomes;
* provenance;
* `recordedAt`;
* actual-time evidence;
* notes;
* frozen snapshots;
* DurableOccurrenceReferences;
* quarantine evidence.

---

# 4. Architectural Objective

After Task 3.13:

```text
IndexedDB ExecutionHistory
        ↓
runtime authority
        ↓
record / correct / retract
        ↓
transactional durable append
        ↓
indexed history queries
```

while legacy localStorage becomes:

```text
migration-only compatibility source
```

and never again ordinary active authority after IndexedDB authority is established.

---

# 5. Required Initial Migration Audit

Before coding, inspect the exact current ExecutionHistory V1 persistence contract:

* storage key;
* envelope;
* records representation;
* quarantine representation;
* protection representation;
* serializer;
* startup loader;
* current authority state;
* durability status;
* desired condition;
* retry;
* raw-source export;
* recovery replace;
* recovery abandon;
* quarantine removal;
* full clear;
* subscriber behavior.

Document all behavior that must survive migration.

---

# 6. Legacy Storage Key

Record the exact current localStorage key.

Do not rename or remove it during migration until authority establishment is proven safe.

---

# 7. IndexedDB Physical Schema

Use the existing DayFrame durable IndexedDB database from Tasks 3.10/3.12.

Add explicit ExecutionHistory stores through a governed physical DB-version upgrade.

Possible stores:

## A. `executionHistoryRecords`

One physical row per immutable `ExecutionRecord V1`.

## B. `executionHistorySubjects`

Optional subject/index metadata if needed for efficient current-subject queries.

## C. `executionHistoryQuarantine`

Preserved invalid/quarantined components.

## D. `executionHistoryMetadata`

Authority/migration metadata if required.

Use the smallest schema that satisfies the current semantics.

---

# 8. Database Version Upgrade

Task 3.12 established the first production IndexedDB schema.

Adding ExecutionHistory stores now requires a physical DB-version bump.

Document:

```text
DB schema v1
    HistoricalPlan stores

DB schema v2
    + ExecutionHistory stores
```

or the actual repository versioning.

Do not conflate this with `ExecutionHistory V1`.

---

# 9. Upgrade Discipline

The v1 → v2 physical upgrade must:

* preserve HistoricalPlan stores and data;
* add ExecutionHistory stores/indexes;
* never delete/recreate HistoricalPlan;
* abort fully if upgrade fails.

Direct regression required.

---

# 10. ExecutionHistory Domain Version

Remain:

`ExecutionHistory V1`

No V2 domain envelope merely because storage moved.

Physical migration is not semantic migration.

---

# 11. Record Store Shape

Prefer one immutable physical record per `ExecutionRecord V1`.

Potential wrapper:

```ts
{
  recordId,
  subjectId,
  recordedAt,
  record
}
```

with duplicated fields only for physical indexes.

The nested domain `record` remains authoritative.

---

# 12. Physical Metadata Consistency

If wrapper fields duplicate domain facts:

* wrapper `recordId` must equal record ID;
* wrapper `subjectId` must equal record subject;
* wrapper `recordedAt` must equal domain `recordedAt`.

Mismatch is corruption.

---

# 13. Record Primary Key

Use:

`ExecutionRecordId`

as primary physical key.

No storage-generated IDs.

---

# 14. Subject Index

Index:

`subjectId`

for subject-chain reads.

---

# 15. Planned Reference Index

Do not invent a brittle serialized reference index unless clearly needed.

Current one-subject-per-planned-reference lookup may use:

* subject metadata;
* canonical durable-reference key;
* or current validated in-memory map.

Audit.

---

# 16. Subject Metadata Store

Consider a small subject metadata row:

```ts
{
  subjectId,
  plannedReferenceKey?,
  headRecordId,
  latestRecordedAt
}
```

Potential benefits:

* current-head queries;
* planned-reference lookup;
* duplicate prevention.

Potential risks:

* duplicates derived authority;
* metadata drift.

Preferred:

> use derived/indexed metadata only if it can be updated atomically with immutable records and always validated/rebuilt.

Do not make it independent semantic authority.

---

# 17. Current Head Authority

ExecutionRecord chain remains authority.

Any head metadata is derived cache/index.

---

# 18. Quarantine Store

Preserve existing quarantine exactly enough to survive restart.

Each quarantine component must retain:

* stable quarantine handle;
* reason;
* raw evidence;
* known IDs if available.

Do not normalize away raw evidence.

---

# 19. Quarantine Identity

Preserve existing quarantine handles during migration.

Do not allocate replacements.

---

# 20. Protected Whole-Source State

Task 3.3 supports whole-source protected ingress.

Task 3.13 must preserve equivalent semantics for:

* invalid legacy localStorage during migration;
* corrupt IndexedDB authority;
* unsupported future records;
* migration verification failure.

---

# 21. Metadata / Authority Establishment

Introduce a durable authority-establishment mechanism.

The system must be able to distinguish:

```text
IndexedDB never established
```

from:

```text
IndexedDB established and currently empty
```

otherwise old localStorage could resurrect after clear/migration.

---

# 22. Anti-Resurrection Requirement

Once IndexedDB ExecutionHistory authority has been established:

> legacy localStorage ExecutionHistory must never become active authority again during ordinary startup.

Even if:

* IndexedDB history is empty;
* localStorage still contains old records;
* app restarts;
* a migration retry previously occurred.

Mandatory.

---

# 23. Authority Marker Options

Audit best location:

## A. IndexedDB metadata row

## B. localStorage compatibility marker

## C. both

Strong preference:

> authoritative marker in IndexedDB metadata plus an optional localStorage compatibility marker if needed to distinguish unavailable IndexedDB from never-migrated state.

But do not create contradictory dual authority.

---

# 24. IndexedDB Unavailable After Authority Established

This is important.

If authority was previously established but IndexedDB later cannot open:

* do **not** fall back to legacy localStorage;
* surface ExecutionHistory unavailable/protected;
* preserve anti-resurrection.

The app must not silently resurrect stale evidence.

---

# 25. How To Know Authority Was Established If IDB Is Unavailable

This may motivate a tiny localStorage authority marker.

Possible:

`dayframe-execution-history-idb-established`

This marker contains no execution data.

It only prevents fallback.

Assess carefully.

---

# 26. Marker Semantics

If used:

* marker establishes that ordinary legacy localStorage authority is retired;
* marker is written only after IndexedDB migration is verified;
* marker survives while legacy localStorage data remains;
* marker is handled explicitly by full clear.

---

# 27. Marker Write Failure

If migration data is durable in IndexedDB but marker write fails:

anti-resurrection could be ambiguous if IndexedDB later unavailable.

Determine safe migration completion criteria.

Preferred:

> authority is not considered fully established until both required durability proofs succeed.

But do not roll back valid IndexedDB data.

May remain migration-incomplete/protected.

---

# 28. Migration Eligibility

Legacy localStorage migration is eligible only when:

* no established IndexedDB authority exists;
* localStorage contains a valid interpretable ExecutionHistory V1 source.

---

# 29. No Legacy Data

If no legacy key and no IndexedDB authority:

establish valid empty IndexedDB ExecutionHistory authority prospectively.

Do not create fake records.

---

# 30. Valid Legacy Migration

Flow:

```text
read legacy localStorage
        ↓
validate full ExecutionHistory V1
        ↓
preserve exact records + quarantine
        ↓
write IndexedDB transaction
        ↓
reread all migrated components
        ↓
domain validate
        ↓
canonical semantic comparison
        ↓
establish authority marker
        ↓
IndexedDB becomes authority
```

---

# 31. Migration Does Not Delete Legacy Data

Retain localStorage evidence after successful migration unless a later cleanup task explicitly removes it.

Reason:

* migration rollback diagnostics;
* compatibility evidence;
* safer recovery.

Anti-resurrection prevents it from becoming active again.

---

# 32. Migration Identity Preservation

Migration allocates:

* no record IDs;
* no subject IDs;
* no quarantine IDs;
* no timestamps.

Zero domain allocation.

Mandatory test.

---

# 33. Migration Ordering

Physical insertion order does not matter.

Semantic correction chains remain linked explicitly.

---

# 34. Migration Atomicity

Prefer one IndexedDB transaction covering:

* all records;
* all quarantine entries;
* metadata/authority staging.

If dataset size is reasonable.

If large history requires chunking, migration becomes more complex.

Audit current expected V1 size.

---

# 35. Atomic Migration Bias

Strong preference:

> one transaction.

ExecutionHistory localStorage was bounded whole-value state, so existing user data should reasonably fit a single IndexedDB migration transaction.

---

# 36. Migration Verification

After transaction commit:

* reread records;
* reread quarantine;
* validate;
* compare semantic canonical representation against validated legacy source.

Only then establish final authority.

---

# 37. Canonical Comparison

Reuse current ExecutionHistory serialization/domain equality where possible.

Do not compare IndexedDB bytes.

---

# 38. Migration Quarantine

A valid legacy envelope may already contain quarantined components.

Preserve them exactly.

Do not attempt to repair them during storage migration.

---

# 39. Invalid Legacy Source

If no IndexedDB authority and legacy localStorage is malformed/unsupported:

* preserve existing Task 3.3 protected-ingress behavior;
* do not establish empty IndexedDB authority;
* do not overwrite legacy source.

Migration blocked pending recovery.

---

# 40. Legacy Protected Source Export

Existing raw-source export must remain available.

---

# 41. Legacy Recovery Before Migration

If user explicitly recovers/replaces/abandons protected legacy history:

* establish a valid V1 source;
* then migration may proceed.

Do not bypass protection.

---

# 42. Migration Failure

Potential stages:

* legacy read;
* validation;
* IndexedDB open;
* transaction write;
* transaction commit;
* reread;
* semantic verification;
* marker establishment.

Expose stage-specific structured result.

---

# 43. Migration Failure Runtime Authority

Before IndexedDB authority is established:

* legacy validated ExecutionHistory may remain current session runtime authority according to existing semantics;
* ordinary writes require careful policy.

---

# 44. Writes During Migration

Task must decide.

Preferred:

> serialize migration initialization before enabling ordinary ExecutionHistory mutations.

Because mutating localStorage runtime while migration copy is in flight risks divergence.

Migration should complete quickly at startup.

---

# 45. Migration Initialization State

Expose:

* initializing;
* legacyMigrationRequired;
* migrating;
* readyIndexedDb;
* protected;
* unavailable.

Exact naming may follow conventions.

---

# 46. Execution Reporting During Migration

Preferred:

* temporarily disable execution-history mutations until migration initialization resolves.

Do not allow dual-writer divergence.

Planning/Preview can continue.

---

# 47. After IndexedDB Authority

All ordinary operations target IndexedDB only:

* first report;
* correction;
* retraction;
* re-report;
* quarantine removal;
* retry;
* recovery.

No active localStorage history writes.

---

# 48. Retire Ordinary localStorage Writer

After migration implementation, search all production ExecutionHistory writes.

Ordinary persistence must no longer write the legacy key.

---

# 49. Legacy Reader Remains

Legacy reader remains migration-only.

Clearly isolate it.

---

# 50. Startup Precedence

Required precedence:

```text
1. established IndexedDB authority
2. migration from eligible legacy localStorage
3. establish empty IndexedDB authority when no legacy source
4. protected legacy source if invalid
```

Never:

```text
invalid/unavailable IndexedDB
    → silently use legacy
```

after authority establishment.

---

# 51. Existing IndexedDB Authority

If metadata says authority established:

* read IndexedDB records;
* validate;
* ignore legacy localStorage as active source.

Legacy may still be exportable for diagnostic purposes only.

---

# 52. IndexedDB Empty Established Authority

Valid empty history.

Do not migrate old localStorage.

Mandatory resurrection-prevention test.

---

# 53. IndexedDB Corruption

If established IndexedDB history is corrupt:

* protect IndexedDB authority;
* do not fall back to legacy.

---

# 54. Unknown IndexedDB Record Version

Protect/quarantine according to current component semantics.

No legacy fallback.

---

# 55. Component Quarantine On IndexedDB

Preserve Task 3.3 behavior:

* valid independent subjects may remain usable;
* invalid subject components quarantine;
* conflicting subjects quarantine jointly;
* whole-surface structural failure protects.

---

# 56. IndexedDB Component Isolation

Because records are individually stored, component validation may be more natural.

Do not weaken existing quarantine semantics.

---

# 57. Subject Chain Loading

Query records by subject index.

Validate through Task 3.2 collection/component validators.

---

# 58. Startup Strategy

Avoid loading every history record if unnecessary.

But current history UI and outcome summaries may currently assume full collection access.

Audit actual scale/API expectations.

---

# 59. Runtime Model

Possible:

## A. full valid history in memory

Preserves current APIs and simplest migration.

## B. indexed lazy history

More scalable but broader UI/store redesign.

Preferred for Task 3.13:

> retain current in-memory valid ExecutionHistory runtime authority after IndexedDB load, while changing persistence underneath.

Reason:
Task 3.13 is migration, not history API redesign.

Document long-term scalability consideration.

---

# 60. IndexedDB As Durable Source, Runtime As Session Authority

Preserve existing Task 3.3 model:

* runtime valid history is current session authority;
* persistence failure does not roll back accepted execution report;
* desired condition/retry preserves exact state.

---

# 61. Desired Durable Condition Under IndexedDB

Current localStorage model likely stores exact whole envelope.

IndexedDB may use append operations instead.

Task must choose whether to:

## A. persist exact whole desired history transactionally;

## B. maintain pending record/quarantine mutations.

Preferred:

> exploit append-only record semantics for report/correct/retract, but keep behavior equivalent.

Do not overcomplicate if whole-history transactional rewrite remains bounded.

---

# 62. Why Not Whole-History Rewrite

Moving to IndexedDB should ideally stop serializing/replacing the entire history on every report.

That is one reason for migration.

Prefer record-level transactional appends.

---

# 63. Ordinary First Report Persistence

Transaction writes:

* new immutable ExecutionRecord;
* subject/head metadata if used;
* required authority metadata.

No existing records rewritten.

---

# 64. Correction Persistence

Append new record + update derived head metadata atomically if metadata exists.

Old record unchanged.

---

# 65. Retraction Persistence

Same.

---

# 66. Re-Report Persistence

Same subject, new immutable assertion.

---

# 67. Quarantine Removal

Delete quarantine component record(s) transactionally.

Valid authority remains.

---

# 68. Runtime Failure Semantics

If IndexedDB write fails after valid runtime mutation:

* runtime history remains current session authority;
* durability failed;
* desired pending mutation retained;
* retry exact.

Same Task 3.3 contract.

---

# 69. Multiple Pending Mutations

Unlike localStorage whole-checkpoint retry, IndexedDB may need ordered mutation queue.

Example:

```text
R1 accepted, persist fails
R2 correction accepted
R3 retraction accepted
```

All three immutable records matter.

Do not collapse to only R3 if that would lose revision evidence.

---

# 70. Ordered Pending Record Queue

Strongly consider preserving exact immutable records in accepted order until durable.

Retry writes them in chain order.

---

# 71. Retry Exactness

No new:

* IDs;
* subject IDs;
* recordedAt;
* snapshots;
* notes;
* provenance.

---

# 72. Retry Already-Committed Case

If transaction committed but acknowledgment failed:

* same record ID may already exist;
* reread exact record;
* semantic equality → treat durable;
* conflicting same ID/content mismatch → protect.

---

# 73. Pending Correction Dependency

Do not persist correction before its replaced prior record is durable unless both are in the same transaction or ordered queue guarantees predecessor first.

---

# 74. Batch Pending Writes

When multiple dependent records are pending:

prefer one transaction containing the chain segment.

This preserves referential integrity.

---

# 75. Transactional Record Chain Commit

Example:

```text
R1
R2 replaces R1
R3 replaces R2
```

One retry transaction may write all three atomically.

Good.

---

# 76. Current-Head Metadata

If maintained physically, update to R3 in same transaction.

---

# 77. Durability Status

ExecutionHistory retains dedicated durability status, but adapt to IndexedDB/migration states.

Possible:

* initializing;
* durable;
* pending;
* failed;
* protected;
* unavailable.

Do not expose localStorage-specific language.

---

# 78. Existing UI Compatibility

Tasks 3.5–3.8 should continue consuming the same history/durability APIs wherever possible.

No UI rewrite.

---

# 79. Subscriber Compatibility

Preserve:

* history subscribers;
* durability subscribers;
* ordinary DayFrameState isolation.

---

# 80. Record Ordering

Runtime/public APIs remain semantically order-independent.

Do not make IndexedDB insertion order authoritative.

---

# 81. Current Outcome Projection

Reuse Task 3.2 projector unchanged.

---

# 82. Planned Reference Lookup

Reuse semantic DurableOccurrenceReference equality unchanged.

---

# 83. Outcome Summary

Task 3.8 behavior must remain unchanged.

---

# 84. Current Preview Coverage

Must remain unchanged.

---

# 85. History Panel

Task 3.6 behavior unchanged.

---

# 86. Reporting Workflow

Task 3.5 behavior unchanged apart from brief initialization gate if required.

---

# 87. IndexedDB Query Indexes

At minimum:

* by `subjectId`;
* by `recordedAt`.

Potential:

* compound `[subjectId, recordedAt]`.

This supports subject-chain and chronology queries.

---

# 88. Planned Reference Metadata Index

If implemented, use a canonical semantic reference key.

Do not index raw nested object directly unless browser key-path representation is reliable.

---

# 89. Canonical Planned Reference Key

If needed:

* deterministic;
* version-aware;
* lifetime-safe;
* same semantics as equality.

This is derived metadata, not authority.

---

# 90. Quarantine Store Indexes

Possible:

* by handle;
* by known subject ID.

Keep minimal.

---

# 91. Authority Metadata Store

May share a general metadata store if Task 3.12 established one.

Do not duplicate database metadata stores unnecessarily.

---

# 92. ExecutionHistory Authority Metadata

Potential fields:

```ts
{
  surface: "executionHistory",
  established: true,
  version: 1,
  migratedFromLegacy: boolean
}
```

No derived outcomes.

---

# 93. Legacy Migration Fingerprint

Store migration verification metadata only if useful.

Do not persist raw legacy payload redundantly inside IndexedDB unless required for recovery.

Legacy localStorage itself remains retained.

---

# 94. Migration Marker Atomicity

Authority metadata should ideally be written in the same transaction as records/quarantine.

But final authority establishment also depends on reread verification.

Potential two-phase state:

* `staged`;
* `established`.

Task must design carefully.

---

# 95. Two-Phase Migration State

Possible:

1. write records + metadata `migrationStaged`;
2. commit;
3. reread/verify;
4. transaction updates metadata `established`;
5. write localStorage anti-resurrection marker if used.

If crash after step 1:

* restart can verify staged data and finish.

Strong candidate.

---

# 96. No Duplicate Migration On Crash

Staged same records should be recognized.

No reallocation.

---

# 97. Crash After Establishment Before Legacy Marker

If local marker used:

* IndexedDB established metadata still takes precedence whenever DB opens.
* if DB unavailable, missing local marker could allow legacy fallback.

Therefore local marker may need to be staged before final establishment or carefully sequenced.

---

# 98. Marker Sequencing

One possible safe sequence:

1. validate legacy;
2. write/commit IndexedDB staged;
3. reread verify;
4. write local anti-resurrection marker;
5. update IndexedDB metadata established.

If crash after marker but before established:

* startup sees marker and must not fallback;
* staged IndexedDB data can be verified/finalized.

This is defensible.

Document.

---

# 99. Marker Without Valid IndexedDB Data

If local marker exists but IndexedDB staged data is missing/corrupt:

* protect/unavailable;
* do not fallback legacy.

Anti-resurrection wins.

---

# 100. Migration Failure Before Marker

Legacy remains eligible authority.

---

# 101. Legacy Ordinary Writes During Migration Failure

If migration cannot establish IndexedDB because database unavailable:

Should existing ExecutionHistory continue using legacy writer temporarily?

This is a product continuity question.

Options:

## A. continue legacy authority until migration succeeds;

## B. block mutations until IndexedDB available.

Strong preference:

> if migration has not crossed anti-resurrection marker, preserve existing validated legacy runtime/persistence behavior temporarily so reporting still works.

But this means dual migration-era code.

Audit complexity.

---

# 102. Continuity Versus Migration Simplicity

Task 3.13 must make an explicit determination.

Do not accidentally strand reporting because IndexedDB is temporarily unavailable before migration.

---

# 103. Recommended Pre-Establishment Policy

Likely:

> validated legacy authority remains fully functional until IndexedDB migration is successfully staged/verified and anti-resurrection marker is established.

Then switch permanently.

This gives safe continuity.

---

# 104. Mutation During Legacy Mode

If user reports while migration is deferred:

* legacy history changes normally;
* next migration attempt reads the latest valid legacy checkpoint.

Do not maintain two active writers.

---

# 105. Migration Attempt Timing

Possible:

* at startup;
* retry later when IndexedDB becomes available.

No background automation needed.

---

# 106. Switch-Over Boundary

Switch active writer only after:

* IndexedDB copy verified;
* anti-resurrection protection established.

Atomic enough to avoid split authority.

---

# 107. No Dual-Write Period

Strongly prefer no ordinary operation writing both localStorage and IndexedDB.

Dual writing creates reconciliation problems.

Use one authority at a time.

---

# 108. IndexedDB Established Migration Result

After switch:

* legacy writer disabled permanently;
* legacy reader migration-only/diagnostic;
* all history mutations IndexedDB-only.

---

# 109. Full Clear

`clearLocalData()` must now clear:

* ExecutionHistory IndexedDB stores;
* ExecutionHistory runtime/pending/protection;
* legacy ExecutionHistory localStorage key;
* anti-resurrection marker according to governed semantics.

This requires care.

---

# 110. Clear Anti-Resurrection Semantics

After full clear:

> old legacy history must not resurrect.

Therefore simply deleting the authority marker while legacy key remains would be dangerous.

Preferred:

* remove legacy key;
* clear IndexedDB history stores;
* leave/establish an empty IndexedDB authority marker.

---

# 111. Full Clear Established Empty Authority

After successful clear:

* IndexedDB authority remains established;
* history empty;
* legacy key absent;
* restart stays empty.

---

# 112. Clear Failure

If IndexedDB clear fails:

* full-clear result says failure;
* do not claim durable empty history.

If legacy-key deletion succeeds but IndexedDB clear fails:

* IndexedDB remains authority with old data;
* restart may restore old data;
* result must be truthful.

---

# 113. Clear Ordering

Prefer clear IndexedDB + establish empty metadata atomically, then delete legacy key.

Or choose sequence that cannot resurrect.

Document.

---

# 114. Protected Legacy Clear

Existing full clear may intentionally abandon protected data.

Task must preserve governed behavior.

---

# 115. Export

Current ExecutionHistory export behavior should continue.

After migration:

* export from current IndexedDB authority;
* include quarantine;
* preserve exact domain semantics.

Legacy raw export remains diagnostic only if retained.

---

# 116. Export During Legacy Mode

Before migration switch:

* current legacy export behavior remains.

---

# 117. Recovery Replace

Current ExecutionHistory protected replacement semantics must be adapted to IndexedDB.

Do not rewrite immutable history casually.

If whole-surface protection exists:

* explicit replacement with current valid runtime authority may be allowed according to Task 3.3 contract.

Use transactional rewrite.

---

# 118. Recovery Abandon

Explicit empty ExecutionHistory authority.

After IndexedDB establishment:

* remains IndexedDB established empty;
* no legacy fallback.

---

# 119. Source Recheck

For IndexedDB protected recovery:

* reread affected physical records/metadata;
* compare stable fingerprints/semantic evidence;
* if changed → `sourceChanged`.

Reuse HistoricalPlan's IndexedDB source-recheck pattern where applicable.

---

# 120. Quarantine Removal

Remove exact quarantined component from IndexedDB.

No legacy mutation after switch.

---

# 121. Quarantine Preservation Across Migration

Mandatory.

---

# 122. Duplicate Record ID Corruption

Same current semantics.

No IndexedDB constraint should silently overwrite duplicate conceptual records.

Primary key may prevent physically inserting duplicates during migration; migration validation must catch domain duplicate ID before write.

---

# 123. Duplicate Planned Subject Corruption

Preserve quarantine semantics.

---

# 124. Cross-Subject Replacement Corruption

Same.

---

# 125. Unsupported Record Version

Same.

---

# 126. Orphan Malformed Record

Same.

---

# 127. Physical Orphan Metadata

New IndexedDB-specific corruption:

* subject metadata with no records;
* head ID missing;
* record not represented in metadata.

If metadata is derived/cache, rebuild or quarantine according to explicit rule.

Prefer avoiding fragile metadata where possible.

---

# 128. Derived Metadata Rebuild

If metadata is explicitly non-authoritative and can be rebuilt entirely from valid records:

rebuilding is allowed.

Document distinction from repairing domain evidence.

---

# 129. No Domain Repair

Never reconnect chains or choose winners.

---

# 130. Migration With Existing IndexedDB Staged Data

If startup finds staged migration state:

* validate staged records;
* compare against current legacy source/fingerprint if anti-resurrection marker not yet established;
* finalize or restart safely.

Do not duplicate.

---

# 131. Legacy Source Changed During Staged Migration

If legacy mutated after staging but before authority switch:

* staged copy may be stale.

Require recheck before final establishment.

If changed:

* discard/rewrite staged data transactionally before marker;
  or
* restart migration.

Do not establish stale copy.

---

# 132. Legacy Source Fingerprint

Capture exact/canonical legacy source fingerprint during migration staging.

Before final switch:

* reread legacy;
* compare.

If changed:

* `sourceChanged`;
* migration restarts.

---

# 133. Migration Source Recheck

This mirrors protected-recovery safety.

Mandatory.

---

# 134. IndexedDB Existing Data Without Metadata

Unexpected records exist but authority not established.

Do not merge automatically with legacy.

Protect or classify as orphan/staged evidence.

---

# 135. No Winner Guessing

Never:

* choose larger dataset;
* choose newer timestamps;
* merge localStorage + IndexedDB records heuristically.

Authority transition must be explicit.

---

# 136. HistoricalPlan Independence

ExecutionHistory DB upgrade/migration must not modify HistoricalPlan records.

Mandatory cross-surface tests.

---

# 137. HistoricalPlan Query Independence

ExecutionHistory migration status does not affect HistoricalPlan query results.

---

# 138. Preview Independence

Migration does not stale or regenerate Preview.

---

# 139. PlanDecision Independence

None.

---

# 140. Profiles/Active Independence

None.

---

# 141. Backup V1/V2 Independence

Existing backup operations remain unchanged.

No ExecutionHistory enters Backup yet.

---

# 142. Backup V3 Deferred

Still next-stage work.

---

# 143. Production Schema Audit

After implementation, writers should be:

| Surface          | Durable storage |
| ---------------- | --------------- |
| Active           | localStorage    |
| Profiles         | localStorage    |
| PlanDecision     | localStorage    |
| HistoricalPlan   | IndexedDB       |
| ExecutionHistory | IndexedDB       |

No ordinary ExecutionHistory localStorage writes after establishment.

---

# 144. Migration Compatibility Audit

Legacy ExecutionHistory localStorage remains:

* readable before establishment;
* retained after establishment as migration evidence;
* non-authoritative after establishment.

---

# 145. Anti-Resurrection Test Matrix

Mandatory scenarios:

1. successful migration + legacy retained → restart uses IndexedDB;
2. IndexedDB established empty + legacy contains old data → empty IndexedDB wins;
3. IndexedDB established corrupt + valid legacy exists → protected IndexedDB, no fallback;
4. IndexedDB unavailable + local anti-resurrection marker exists → unavailable, no fallback;
5. full clear → no resurrection;
6. legacy data modified after migration → ignored as active authority.

---

# 146. Migration Test — Valid History

Preserve exact records and outcome projection.

---

# 147. Migration Test — Corrections

Exact revision chain survives.

---

# 148. Migration Test — Retraction

Unknown/current Not reported survives.

---

# 149. Migration Test — Re-Report

Same subject chain survives.

---

# 150. Migration Test — Planned References

Exact durable references preserved.

---

# 151. Migration Test — Actual Evidence

Exact.

---

# 152. Migration Test — Notes

Exact.

---

# 153. Migration Test — Quarantine

Exact raw evidence + handles preserved.

---

# 154. Migration Test — Empty Legacy

Establish empty IndexedDB authority.

---

# 155. Migration Test — No Legacy Key

Same.

---

# 156. Migration Test — Invalid Legacy

Protected; no empty IndexedDB authority.

---

# 157. Migration Test — Unsupported Legacy Version

Protected.

---

# 158. Migration Test — Write Failure

Legacy remains authority before switch.

---

# 159. Migration Test — Verification Failure

Authority not switched.

---

# 160. Migration Test — Marker Failure

Safe incomplete state; no ambiguous resurrection.

---

# 161. Migration Test — SourceChanged

Finalization rejected.

---

# 162. Migration Test — Crash After Staging

Restart resumes/finalizes safely.

---

# 163. Migration Test — Crash After Marker

No legacy fallback.

---

# 164. Migration Test — No Allocation

No ID/time allocator calls.

---

# 165. IndexedDB Test — First Report

New record durable.

---

# 166. IndexedDB Test — Correction

Append durable.

Old record intact.

---

# 167. IndexedDB Test — Retraction

Append durable.

---

# 168. IndexedDB Test — Re-Report

Append durable.

---

# 169. IndexedDB Test — Persistence Failure

Runtime authority updates; pending exact mutation retained.

---

# 170. IndexedDB Test — Retry

Exact IDs/timestamps.

---

# 171. IndexedDB Test — Already Committed

Recognized idempotently.

---

# 172. IndexedDB Test — Multiple Pending Chain

Persists in dependency order.

---

# 173. IndexedDB Test — Transaction Abort

No partial chain durable.

---

# 174. IndexedDB Test — Quota Failure

Observable.

No rollback runtime.

---

# 175. IndexedDB Test — Record Readback Verification

Mandatory.

---

# 176. IndexedDB Test — Corrupt Physical Wrapper

Protected/quarantined.

---

# 177. IndexedDB Test — Domain Corrupt Record

Existing semantics preserved.

---

# 178. IndexedDB Test — Component Isolation

Valid independent subjects remain usable.

---

# 179. IndexedDB Test — Whole Protection

Mutations blocked.

---

# 180. IndexedDB Test — Recovery

Replace/abandon/sourceChanged.

---

# 181. IndexedDB Test — Quarantine Removal

Persists.

---

# 182. IndexedDB Test — Full Clear

Established empty authority survives restart.

---

# 183. IndexedDB Test — Clear Failure

Truthful result.

---

# 184. IndexedDB Test — Export

Equivalent semantic history.

---

# 185. Cross-Surface Test — HistoricalPlan Survives DB Upgrade

Mandatory.

---

# 186. Cross-Surface Test — HistoricalPlan Survives ExecutionHistory Clear

Mandatory.

---

# 187. Cross-Surface Test — ExecutionHistory Survives HistoricalPlan Clear

Mandatory.

---

# 188. UI Regression — Reporting

Task 3.5 still works.

---

# 189. UI Regression — History Correction

Task 3.6 still works.

---

# 190. UI Regression — Outcome Summary

Task 3.8 unchanged.

---

# 191. Preview Coverage Regression

Same history joins after migration.

---

# 192. Restart Regression

Saved history rehydrates exactly.

---

# 193. Current Outcome Regression

Same before/after migration.

---

# 194. No Missed Regression

None introduced.

---

# 195. No Planning Mutation Regression

History mutation still does not affect Preview/PlanDecision/authored state.

---

# 196. Performance

Current bounded history can still load into memory.

Do not introduce premature streaming UI redesign.

---

# 197. DB Query Future Readiness

Indexes should permit future:

* records by subject;
* records by recordedAt range.

Good enough.

---

# 198. Physical Record Ordering

No authority.

---

# 199. Structured Clone

Exact JSON-safe domain objects.

---

# 200. Fake IndexedDB

Continue using `fake-indexeddb` in tests.

Dev-only.

No production import.

---

# 201. Browser Globals

Maintain lazy/injected IndexedDB access.

---

# 202. No localStorage Fallback After Establishment

Search production paths.

Mandatory audit.

---

# 203. No Dual Writer Audit

At any one authority state:

* either legacy localStorage writer;
  or
* IndexedDB writer.

Never ordinary dual-write.

---

# 204. Legacy Writer Retirement Audit

After `established` state:
zero writes to legacy history key.

---

# 205. Migration Reader Isolation

Legacy parsing/migration code should live in a compatibility module.

Preferred:

`state/executionHistoryLegacyV1.ts`

or equivalent.

Do not leave migration branching spread throughout store code.

---

# 206. IndexedDB Persistence Module

Preferred dedicated module:

`state/executionHistoryIndexedDb.ts`

or equivalent.

---

# 207. Authority Manager

A small manager/service may own:

* initialization;
* migration;
* writer selection;
* runtime state;
* pending queue;
* durability;
* recovery.

Avoid putting entire migration state machine in `DayFrameApp`.

---

# 208. Async Initialization

Task must reconcile async IndexedDB initialization with current synchronous store creation.

Use established HistoricalPlan patterns where possible.

---

# 209. Reporting Before Initialization

If valid legacy authority exists and migration not switched:

* legacy reporting may continue under chosen policy.

If anti-resurrection marker exists and IndexedDB not ready:

* reporting must wait/disable until authority resolved.

Do not write legacy.

---

# 210. Existing UI Initialization State

If a short initialization state must be surfaced:

* reuse execution-history availability status;
* do not redesign UI.

---

# 211. Migration Retry

Expose explicit migration retry if initialization failed pre-establishment.

May reuse ordinary durability retry only if semantics are clear.

---

# 212. Authority Transition Subscriber

When migration switches runtime writer:

* history content should not appear changed if semantically identical;
* avoid unnecessary history subscriber notification if possible.
* durability/readiness status may notify.

---

# 213. Exact Runtime Continuity

The user's visible history should not flicker/disappear during migration.

---

# 214. Legacy Quarantine Runtime Continuity

Preserve.

---

# 215. Error Taxonomy

Add migration-specific result codes where needed:

* migrationReadFailure;
* migrationInvalidLegacy;
* migrationWriteFailure;
* migrationVerificationFailure;
* migrationMarkerFailure;
* migrationSourceChanged;
* stagedMigrationInvalid;
* establishedIndexedDbUnavailable.

Do not expose UI prose from core.

---

# 216. IndexedDB Error Mapping

Reuse Task 3.10 normalized storage codes.

---

# 217. Full Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.13_MIGRATE_EXECUTIONHISTORY_V1_FROM_LOCALSTORAGE_TO_INDEXEDDB_WITH_COMPATIBILITY_RECOVERY_AND_ANTI_RESURRECTION_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contracts
4. Initial ExecutionHistory Persistence Audit
5. Files Changed
6. Physical DB Upgrade
7. HistoricalPlan Preservation During Upgrade
8. ExecutionHistory Object Stores
9. Record Physical Shape
10. Index Design
11. Quarantine Physical Shape
12. Authority Metadata
13. Legacy Key
14. Legacy Reader Isolation
15. Migration Eligibility
16. Startup Precedence
17. Valid Legacy Migration
18. Empty Legacy / No Legacy
19. Invalid Legacy Protection
20. Migration Atomicity
21. Migration Verification
22. Identity Preservation
23. Quarantine Preservation
24. Source Recheck
25. Staged Migration
26. Authority Establishment
27. Anti-Resurrection Marker Determination
28. Marker Sequencing
29. IndexedDB Unavailable After Establishment
30. No-Fallback Semantics
31. Legacy Retention
32. Legacy Writer Retirement
33. No-Dual-Writer Policy
34. Pre-Establishment Continuity
35. Async Initialization
36. Runtime Authority
37. Ordinary First Report Persistence
38. Correction Persistence
39. Retraction Persistence
40. Re-Report Persistence
41. Pending Mutation Model
42. Multiple Pending Revision Chain
43. Desired Durable Condition
44. Retry
45. Already-Committed Retry
46. Transactional Chain Integrity
47. Durability Status
48. History Subscription Compatibility
49. Current Outcome Compatibility
50. Reporting UI Compatibility
51. History UI Compatibility
52. Outcome Summary Compatibility
53. Quarantine Semantics
54. Whole Protection
55. Recovery Replace
56. Recovery Abandon
57. Quarantine Removal
58. IndexedDB Source Recheck
59. Export
60. Full Clear
61. Established Empty Authority
62. Clear Failure
63. Anti-Resurrection Tests
64. Migration Tests
65. Identity/Revision Preservation Tests
66. Quarantine Tests
67. Persistence/Retry Tests
68. Recovery Tests
69. Cross-Surface HistoricalPlan Tests
70. UI/Projection Regression Tests
71. Writer Audit
72. Reader Audit
73. No-Dual-Write Audit
74. No-Fallback Audit
75. No-Domain-Change Audit
76. No-Backup Audit
77. Architectural Alignment Assessment
78. Deviations
79. Discoveries and Deferred Work
80. Recommended Task 3.14
81. Focused Validation
82. Full Validation
83. Final Completion Determination

---

# 218. Required Matrices

## A. Startup Authority Matrix

| IndexedDB state | Legacy state | Marker | Authority |
| --------------- | ------------ | ------ | --------- |

Cover:

* no IDB authority + valid legacy;
* no IDB authority + empty legacy;
* no IDB authority + invalid legacy;
* staged IDB;
* established valid IDB;
* established empty IDB + populated legacy;
* established corrupt IDB + valid legacy;
* IDB unavailable + anti-resurrection marker.

## B. Migration Stage Matrix

| Stage failure | Active authority | Retry path | Legacy fallback allowed? |
| ------------- | ---------------- | ---------- | -----------------------: |

## C. Mutation Persistence Matrix

| Operation | Immutable record append | Metadata update | Atomic? |
| --------- | ----------------------: | --------------: | ------: |

Cover:

* first report;
* correction;
* retraction;
* re-report.

## D. Anti-Resurrection Matrix

| Scenario | Legacy becomes active? |
| -------- | ---------------------: |

## E. Cross-Surface Matrix

| Transition | ExecutionHistory | HistoricalPlan |
| ---------- | ---------------- | -------------- |

Cover:

* DB upgrade;
* ExecutionHistory clear;
* HistoricalPlan clear;
* full clear.

---

# 219. Validation Requirements

Run focused tests for:

* physical DB upgrade;
* HistoricalPlan preservation;
* valid/empty/invalid legacy migration;
* migration staging;
* source recheck;
* marker sequencing;
* anti-resurrection;
* established-empty behavior;
* IDB unavailable after establishment;
* first report/correction/retraction/re-report;
* multiple pending records;
* retry;
* already-committed retry;
* quarantine;
* whole protection;
* recovery;
* clear;
* export;
* cross-surface independence;
* UI/history/summary regressions.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Full suite must pass.

Record exact:

* test-file count;
* test count;
* build module count.

---

# 220. Completion Criteria

Task 3.13 is complete only when:

* ExecutionHistory V1 remains semantically unchanged;
* its ordinary durable authority is migrated from localStorage to IndexedDB;
* physical DB upgrade preserves HistoricalPlan exactly;
* all record IDs, subject IDs, timestamps, references, snapshots, notes, provenance, correction/retraction links, and quarantine handles survive migration unchanged;
* migration allocates no domain identity/time;
* valid legacy V1 migrates transactionally;
* empty/no legacy establishes empty IndexedDB authority safely;
* invalid legacy remains protected rather than discarded;
* migration requires write/commit/reread/domain validation/semantic verification;
* source recheck prevents stale migration finalization;
* staged/crash-interrupted migration resumes safely;
* authority establishment has explicit durable semantics;
* anti-resurrection prevents legacy localStorage from ever regaining ordinary authority after IndexedDB establishment;
* established empty IndexedDB authority beats stale populated legacy;
* corrupt/unavailable established IndexedDB never silently falls back to legacy;
* legacy history remains retained as migration evidence unless full clear removes it;
* ordinary legacy writer is retired after establishment;
* no ordinary dual-write exists;
* first report/correction/retraction/re-report persist transactionally to IndexedDB;
* valid runtime history remains session authority after persistence failure;
* multiple dependent undurable revisions are preserved exactly;
* retry creates no new evidence;
* already-committed uncertain writes are recognized idempotently;
* component quarantine and whole protection retain Task 3.3 semantics;
* recovery/abandonment remains explicit and source-rechecked;
* history/reporting/Summary UI behavior remains unchanged;
* full clear establishes durable empty IndexedDB authority with no resurrection;
* HistoricalPlan remains untouched by migration and ExecutionHistory clear;
* Backup V3 is not yet implemented;
* no execution-domain schema changes occur;
* full validation passes;
* result artifact is complete.

---

# 221. Explicit Non-Goals

Do **not**:

* create ExecutionHistory V2;
* alter ExecutionRecord V1;
* change outcomes;
* change correction/retraction semantics;
* change HistoricalExecutionTarget;
* change HistoricalPlan;
* add historical metrics;
* add Goal progress;
* add learning;
* implement Backup V3;
* add new history UI;
* add imported-calendar history linkage;
* silently merge localStorage and IndexedDB histories;
* silently fall back to legacy after establishment;
* dual-write indefinitely;
* delete legacy migration evidence automatically;
* regenerate historical records;
* renumber IDs;
* retimestamp records;
* perform unrelated persistence migration of Active/Profile/PlanDecision.

---

# 222. Stop Conditions

Stop and report if:

* preserving current ExecutionHistory quarantine/protection semantics requires a domain-version change;
* physical DB upgrade risks HistoricalPlan data loss;
* anti-resurrection cannot be guaranteed without a new prerequisite authority-marker design;
* crash-safe staged migration cannot be resolved deterministically;
* pre-establishment continuity and no-dual-writer requirements cannot coexist safely;
* IndexedDB record-level persistence cannot preserve ordered correction/retraction dependencies;
* current runtime APIs require broad lazy-query redesign;
* full clear cannot establish durable empty IndexedDB authority safely;
* migration requires changing ExecutionRecord semantics;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest corrective/prerequisite task.

---

# 223. Recommended Follow-On Boundary

If Task 3.13 completes successfully, the major Phase 3 durable surfaces will be:

```text
Active
Profiles
PlanDecision
    localStorage

ExecutionHistory
HistoricalPlan
    IndexedDB
```

At that point the next task should establish the first complete backup format covering all current durable authority surfaces.

Recommended:

> **Task 3.14 — Define and Implement Backup V3 Across Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan**

That task should include:

* architecture-first complete-backup scope audit;
* exact current lifetimes;
* execution revision history;
* HistoricalPlan publication history;
* quarantine/protected-data treatment;
* validation;
* import transaction/order;
* cross-storage restore;
* rollback/protection semantics;
* no resurrection;
* Backup V1/V2 compatibility.

It should not add Progress or learning.

---

# 224. Task Determination

**Authorized:** ExecutionHistory V1 physical migration to IndexedDB, compatibility legacy reader, staged migration, validation and semantic verification, authority establishment, anti-resurrection, ordinary IndexedDB mutation persistence, exact retry, quarantine/protection/recovery preservation, full-clear/export integration, DB-upgrade safety, and comprehensive compatibility regression coverage.

**Not authorized:** ExecutionHistory V2, semantic redesign, Backup V3, new UI, historical metrics, Goals, learning, Active/Profile/PlanDecision migration, or unrelated execution/planning changes.

The governing migration principle is:

> **ExecutionHistory may move to a new storage engine, but its evidence must not move semantically. Every historical assertion, correction, retraction, quarantine component, and uncertainty state must survive exactly, and once the new authority is established the old persistence surface must never quietly come back to life.**

---

# 225. Final Completion Statement

**Task 3.13 is complete when DayFrame has migrated the unchanged ExecutionHistory V1 authority from its legacy localStorage representation to the Phase 3 transactional IndexedDB foundation through a crash-safe, source-rechecked, write/commit/reread/domain-verified compatibility migration that preserves every record, subject, immutable revision, DurableOccurrenceReference, frozen snapshot, reported-time value, note, provenance field, quarantine component, and current outcome exactly; when IndexedDB-first startup, staged migration, explicit authority establishment, anti-resurrection, retained legacy migration evidence, no ordinary dual-write, permanent legacy-writer retirement after establishment, transactional first-report/correction/retraction/re-report persistence, exact pending-chain retry, idempotent uncertain-commit handling, existing quarantine/protection/recovery behavior, export, subscriptions, and durable full-clear semantics are established; when established empty IndexedDB authority cannot resurrect stale legacy history and corrupt or unavailable established IndexedDB never silently falls back to localStorage; when HistoricalPlan survives the physical database upgrade untouched; when Tasks 3.5–3.8 behavior remains unchanged; when complete repository validation passes; and when no ExecutionHistory V2, Backup V3, historical metric, Goal, learning, new UI, or unrelated durable-surface migration is introduced.**
