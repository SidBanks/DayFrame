# Task 3.10 — Audit and Implement Phase 3 Durable Collection Storage Foundation

## Status

Ready for investigation and implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Architecture-informed infrastructure implementation task.

Task 3.10 audits the current persistence architecture and implements the reusable transactional durable collection-storage foundation required by future long-lived Phase 3 surfaces, especially:

* `ExecutionHistory`;
* `HistoricalPlanLedger`.

Task 3.9 established that the HistoricalPlan ledger requires:

* atomic publication batches;
* collection-oriented persistence;
* indexed temporal queries;
* potentially indefinite growth;
* explicit gap/recovery semantics;
* no silent trimming;
* stronger scalability than current whole-value localStorage persistence can reasonably provide.

Task 3.10 establishes that storage foundation.

This task includes:

* current persistence audit;
* IndexedDB suitability confirmation;
* storage abstraction boundary;
* database/schema versioning;
* transaction semantics;
* collection/store semantics;
* atomic batch writes;
* indexed reads;
* deterministic serialization boundaries;
* structured clone safety;
* open/upgrade lifecycle;
* blocked/versionchange handling;
* persistence failure classification;
* retry-safe exact write operations;
* collection clear/delete primitives;
* database availability detection;
* test harness/fakes;
* migration-readiness design;
* storage foundation regression coverage.

It does **not** implement:

* HistoricalPlanLedger;
* historical plan publication;
* historical follow-through;
* historical metrics;
* Goal progress;
* learning;
* Backup V3;
* broad ExecutionHistory migration unless explicitly required by the audit;
* UI.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 3.9 is complete and accepted;
6. review:

   * `CHECKPOINT_Phase_3_Historical_Plan_Ledger_Semantics.md`;
   * the Task 3.9 ADR;
   * current Active/Profile/PlanDecision/ExecutionHistory persistence;
   * current localStorage abstractions;
   * clear/recovery semantics;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.10_AUDIT_AND_IMPLEMENT_PHASE_3_DURABLE_COLLECTION_STORAGE_FOUNDATION_RESULT.md`

If IndexedDB cannot satisfy required semantics without a broader browser-storage redesign, stop and report rather than forcing an unsafe abstraction.

---

# 2. Purpose

Task 3.9 concluded:

> localStorage is unsuitable for the long-lived HistoricalPlan ledger because the ledger requires collection growth, atomic generation batches, indexed temporal reads, and robust collection-level durability semantics.

The desired infrastructure is:

```text
DurableCollectionStorage
        ↓
database
        ↓
versioned object stores
        ↓
transactions
        ↓
atomic logical operations
        ↓
future domain-specific surfaces
```

Task 3.10 makes this storage capability executable without yet implementing HistoricalPlan.

---

# 3. Governing Architectural Principles

The storage foundation must preserve these existing DayFrame principles:

1. runtime authority and durable success are separate facts;
2. persistence failure must be observable;
3. retry must persist the exact desired condition;
4. recovery must never silently discard user data;
5. corrupt/unsupported ingress must not be rewritten casually;
6. durable surface versions remain independent;
7. current domain schemas do not become coupled to storage-engine internals;
8. no automatic repair;
9. no silent retention trimming;
10. full clear semantics remain explicit;
11. storage failure does not invent domain facts;
12. infrastructure does not become domain authority.

---

# 4. Required Initial Persistence Audit

Audit:

* Active V2 persistence;
* Profile V2 persistence;
* PlanDecision V1 persistence;
* ExecutionHistory V1 persistence;
* localStorage adapter/use;
* desired-condition/retry patterns;
* protected ingress;
* quarantine;
* full clear;
* backup/export;
* tests/fakes/mocks;
* browser-support assumptions;
* synchronous persistence dependencies.

Document what can remain and what future collection storage must support.

---

# 5. Storage Technology Decision

Confirm whether IndexedDB remains the correct foundation.

Evaluate:

* browser support;
* Arch/Linux target browsers;
* asynchronous API;
* transaction atomicity;
* object stores;
* indexes;
* quota behavior;
* structured clone;
* upgrade/version lifecycle;
* testability.

Expected:

> IndexedDB is the recommended V1 durable collection foundation unless repository/browser evidence contradicts it.

---

# 6. No IndexedDB Wrapper Library By Default

Prefer native IndexedDB unless:

* an existing dependency already standardizes persistence;
* native usage becomes materially unsafe/unmaintainable.

Do not add Dexie/idb/etc. merely for convenience without documenting why.

If a dependency is introduced, justify it explicitly.

---

# 7. Infrastructure Module Boundary

Create a dedicated infrastructure module.

Preferred:

`code/src/infrastructure/storage/`

or repository-equivalent.

Possible files:

* `durableCollectionStorage.ts`;
* `indexedDbCollectionStorage.ts`;
* `indexedDbSchema.ts`;
* `indexedDbErrors.ts`;
* tests.

Do not place IndexedDB primitives inside domain modules.

---

# 8. Domain Independence

Storage APIs must operate on plain durable records.

They must not know:

* HistoricalPlan semantics;
* ExecutionRecord semantics;
* PlanDecision semantics;
* Preview;
* React.

Future surfaces own domain validation.

---

# 9. Database Identity

Define one DayFrame IndexedDB database.

Preferred conceptual name:

`dayframe-durable-v1`

or equivalent.

Database name is independent from domain surface versions.

---

# 10. Database Version

Introduce an explicit IndexedDB schema version.

Example:

```ts
DAYFRAME_DURABLE_DB_VERSION = 1
```

This version governs physical object-store/index schema only.

It is not:

* ExecutionHistory version;
* HistoricalPlan version;
* Active version;
* Backup version.

---

# 11. Version Independence

Make explicit:

```text
database schema version
≠
domain envelope version
≠
record schema version
```

Do not conflate them.

---

# 12. Object Store Strategy

Determine whether V1 should use:

## A. one generic collection store;

## B. one object store per durable domain surface;

## C. hybrid metadata + domain stores.

Strong preference:

> one domain object store per long-lived collection surface.

Reason:

* independent indexes;
* easier upgrades;
* cleaner corruption boundaries;
* more explicit schema.

But Task 3.10 may implement only a generic test store plus infrastructure abstraction if future surface stores are not yet authorized.

---

# 13. No HistoricalPlan Store Yet

Do not create a production `historicalPlan` object store unless needed as an inert schema reservation and clearly justified.

Preferred:

> foundation supports future store creation through controlled DB upgrade.

No empty speculative durable surface required.

---

# 14. ExecutionHistory Store Migration Determination

Task 3.10 must decide one:

## Option A — foundation only; ExecutionHistory remains localStorage

Preferred if architecture can be proven independently.

## Option B — migrate ExecutionHistory now

Only if necessary to validate collection semantics or avoid maintaining two durability substrates immediately.

Do not migrate casually.

---

# 15. Recommended Bias

Prefer **Option A**:

> implement and fully test the storage foundation without changing current ExecutionHistory authority.

Reasons:

* smaller blast radius;
* Task 3.3 is already stable;
* HistoricalPlan is the first surface that actually requires transactional collection storage;
* migration can be independently governed later.

If audit finds this creates an unusable abstraction, report.

---

# 16. Storage Capability Interface

Define a narrow interface conceptually:

```ts
interface DurableCollectionStorage<T> {
  get(...)
  getAll(...)
  put(...)
  putMany(...)
  delete(...)
  deleteMany(...)
  clear(...)
  transact(...)
}
```

Exact API should reflect real needs, not imagined generic CRUD.

Avoid overengineering.

---

# 17. Typed Store Descriptor

Prefer a descriptor/config type that identifies:

* database;
* object store;
* key path;
* indexes;
* serializer/clone boundary if needed.

Do not pass arbitrary store names throughout application code.

---

# 18. Key Semantics

Support:

* explicit caller-owned durable keys;
* no random storage-layer keys unless domain says so.

Storage must not allocate domain IDs.

---

# 19. Record Shape

Use structured-clone-safe plain objects.

No:

* functions;
* class instances;
* cyclic graphs;
* DOM nodes.

Dates should generally remain canonical strings if domain schema already uses them.

---

# 20. Structured Clone Boundary

IndexedDB stores structured-clone data.

Storage foundation should clone inputs/outputs defensively as needed so caller mutation cannot alter in-memory values held by test adapters.

Browser IndexedDB already clones internally, but abstraction semantics must remain consistent across implementations.

---

# 21. Transaction Requirement

The foundation must support a logical operation where:

```text
all writes succeed
or
none commit
```

Mandatory for future PlanPublication batch writes.

---

# 22. Readwrite Transaction

Provide a safe way to perform:

* multiple puts;
* deletes;
* metadata updates;

atomically in one transaction.

---

# 23. No Transaction Callback Footguns

Native IndexedDB transactions can auto-close when callbacks await unrelated promises.

The abstraction must avoid patterns that accidentally cross asynchronous event-loop boundaries.

Document transaction-lifetime rules.

---

# 24. Transaction API Design

Preferred approaches:

## A. transaction object exposing request-based operations with internally awaited request wrappers;

## B. high-level batch primitives only.

Task 3.10 should choose the narrower safer approach.

Strong preference:

> high-level atomic batch primitives first, rather than arbitrary user callbacks.

HistoricalPlan mostly needs atomic batch publication.

---

# 25. Atomic `putMany`

Implement or prove:

```text
putMany(records)
```

commits all records or none.

Mandatory direct test.

---

# 26. Atomic Mixed Mutation

If future publication requires:

* publication batch;
* day entries;
* metadata;

in separate stores, multi-store atomic transaction support will be needed.

Task 3.10 should architect for it even if production stores do not yet exist.

---

# 27. Multi-Store Transaction

Determine whether interface supports a transaction across named stores.

IndexedDB does.

Foundation should not prevent it.

---

# 28. Query Requirements

Future HistoricalPlan needs indexed queries such as:

* publications by user-day;
* publications by publishedAt;
* latest publication for day before `asOf`;
* publication batch lookup;
* possibly DurableOccurrenceReference correlation.

Task 3.10 need not create those indexes yet, but infrastructure must support declared indexes and range queries.

---

# 29. Index Descriptor

Support object-store index definitions:

* name;
* keyPath;
* unique;
* multiEntry if necessary.

No dynamic runtime index creation outside DB upgrade.

---

# 30. Query API

Support future operations:

* exact key;
* key range;
* index equality;
* index range;
* cursor/order;
* limit.

Do not build SQL-like query language.

---

# 31. Indexed Range Query

Directly prove at least one index-range query in the foundation tests.

---

# 32. Ordering

IndexedDB key ordering is deterministic.

Do not depend on insertion order for domain authority.

---

# 33. Limits

Support bounded reads.

Future history UIs should not need to load years of data unnecessarily.

---

# 34. Cursor Boundary

Use cursors for range/limited queries if needed.

Do not expose raw `IDBCursor` outside infrastructure.

---

# 35. Database Open

Implement explicit open lifecycle.

Outcomes should distinguish:

* opened;
* upgrade needed/performed;
* unavailable;
* blocked;
* error.

---

# 36. `onupgradeneeded`

Schema creation/upgrades happen only here.

No normal-runtime object-store/index mutation.

---

# 37. Upgrade Atomicity

IndexedDB versionchange transaction must succeed fully or abort.

Test where feasible.

---

# 38. Blocked Upgrade

If another DayFrame tab holds an old DB connection:

* new upgrade may be blocked.

This must be observable.

Do not hang forever silently.

---

# 39. `versionchange`

Open connections should respond appropriately when another context upgrades.

Preferred:

* close connection;
* surface reopen-needed state.

Do not retain stale connections indefinitely.

---

# 40. Multi-Tab Consideration

Task 3.10 need not implement cross-tab synchronization of domain authority.

But database upgrade/connection behavior must not corrupt data.

Document multi-tab limitations.

---

# 41. Database Unavailable

Possible causes:

* browser policy;
* private mode quirks;
* environment;
* security exceptions;
* test environment.

Return structured error.

Do not silently fall back to localStorage for a surface that requires transactional semantics unless explicitly authorized.

---

# 42. Storage Error Taxonomy

Define stable infrastructure-level error codes.

At minimum consider:

* unavailable;
* openFailed;
* upgradeBlocked;
* transactionAborted;
* constraintViolation;
* quotaExceeded;
* serialization/cloneFailure;
* readFailed;
* writeFailed;
* deleteFailed;
* unknown.

Use actual DOMException mapping where reliable.

---

# 43. Error Normalization

Do not leak browser-specific exception strings as domain codes.

Preserve original error only as diagnostic detail if project convention allows.

---

# 44. QuotaExceeded

Detect where possible.

No silent eviction.

---

# 45. Transaction Abort

Return factual failure.

No partial success claim.

---

# 46. Constraint Error

Future unique indexes may intentionally enforce invariants.

Surface distinct constraint failure.

Do not automatically overwrite.

---

# 47. Clone/Data Error

Structured clone failures should be detected as storage failures.

No partial write.

---

# 48. Exact Retry Semantics

Infrastructure operations themselves should be idempotent where domain keys allow.

Domain-level desired-condition managers remain responsible for exact retry semantics.

Storage foundation should never:

* allocate IDs on retry;
* mutate timestamps;
* generate new values.

---

# 49. Storage Layer Does Not Own Desired Condition

Important:

> desired durable condition belongs to the domain persistence surface, not IndexedDB infrastructure.

Foundation performs requested operations exactly.

---

# 50. Read Consistency

Reads inside one transaction see transactionally consistent state.

Document.

---

# 51. Snapshot Reads

A multi-record query used to derive one logical checkpoint should occur under a consistent read transaction where needed.

---

# 52. `getAll`

Implement bounded/safe collection read.

Avoid unconstrained `getAll()` for future large stores where query/limit is known.

But a generic full read primitive may still be useful for export/recovery.

---

# 53. Export Requirement

Future surfaces must be exportable.

Foundation should support deterministic complete enumeration.

Domain layer owns envelope/export format.

---

# 54. Full Clear

Support object-store clear and potentially entire database deletion.

Domain full-clear orchestration may eventually use either.

---

# 55. Database Delete

Provide a foundation primitive for explicit full IndexedDB deletion if appropriate.

Must handle blocked deletion.

---

# 56. Full Local Data Clear Future

Task 3.10 should document how `clearLocalData()` will eventually coordinate:

* localStorage surfaces;
* IndexedDB surfaces.

Do not necessarily wire it now if no production domain uses IndexedDB yet.

---

# 57. No Hidden Destructive Upgrade

DB schema upgrades must never wipe a store merely because migration is inconvenient.

If future migration cannot safely transform data:

* protect/report;
* do not delete.

Task 3.10 should establish this policy.

---

# 58. Physical Schema Migration

Define upgrade discipline:

* additive store/index migrations preferred;
* destructive migration requires explicit domain migration plan;
* no silent store recreation.

---

# 59. Data Migration Versus Schema Upgrade

Distinguish:

```text
physical IndexedDB schema upgrade
```

from:

```text
domain record version migration
```

Do not conflate them.

---

# 60. Domain Validation Boundary

Infrastructure returns stored plain objects.

Domain surface must:

* validate envelope/record versions;
* quarantine/protect corrupt values.

Storage layer should not understand domain schemas.

---

# 61. Corruption Boundary

IndexedDB cannot prove domain validity.

Task 3.10 should not introduce generic “repair.”

---

# 62. Store Metadata

Determine whether infrastructure needs an internal metadata store for:

* schema information;
* migration markers;
* storage diagnostics.

Prefer none unless required.

IndexedDB database version already tracks physical schema.

---

# 63. Transactional Metadata

Future domain surfaces may maintain their own metadata atomically with records.

Foundation must permit it.

---

# 64. Connection Manager

Determine whether to:

* open per operation;
* cache one connection;
* lazy singleton connection.

Preferred:

> lazy managed connection with safe versionchange closure.

Document lifecycle.

---

# 65. Connection Failure Recovery

A failed open must not poison all future retries permanently.

Allow subsequent reopen attempt.

---

# 66. Closed Connection Recovery

If connection closes/versionchanges:

* next operation reopens.

---

# 67. Database Upgrade Testing

Use a real/fake IndexedDB test implementation.

Audit current dependencies.

---

# 68. Test Environment

Node/Vitest does not provide browser IndexedDB natively.

Determine test strategy:

## A. `fake-indexeddb`

Likely appropriate.

## B. hand-built fake adapter

Risk: fails to reproduce transaction behavior.

Strong preference:

> use `fake-indexeddb` if dependency policy permits.

Document added dependency.

---

# 69. Dependency Audit

If adding `fake-indexeddb`, it should be dev-only.

No production bundle dependency.

---

# 70. Browser Integration Test

If current environment supports browser/e2e tests, optional.

Not mandatory if fake IndexedDB provides strong coverage.

---

# 71. In-Memory Test Adapter

Consider whether interface should also have a pure in-memory adapter.

Pros:

* fast domain tests;
* deterministic failure injection.

Cons:

* may conceal IndexedDB semantics.

Recommended:

> IndexedDB adapter tests use fake-indexeddb; optional fault-injectable adapter may be added only if genuinely useful.

---

# 72. Fault Injection

Tests need to simulate:

* open failure;
* write failure;
* transaction abort;
* quota error;
* blocked upgrade if feasible.

Provide injection seam without polluting production API excessively.

---

# 73. Atomic Write Test

Start with existing data.

Attempt multi-record write that fails midway.

After abort:

* no partial new state visible.

Mandatory.

---

# 74. Multi-Store Atomic Test

If multi-store transaction API implemented:

* failure in second store rolls back first.

Mandatory.

---

# 75. Indexed Query Test

Insert records.

Query index/range.

Verify order and bounds.

---

# 76. Limit Test

Verify bounded result count.

---

# 77. Unique Constraint Test

If test schema includes unique index:

duplicate put fails atomically.

---

# 78. Clear Test

Object-store clear removes exact store contents.

Other stores unaffected.

---

# 79. Database Delete Test

If primitive included.

---

# 80. Connection Reopen Test

After close/versionchange simulation, next operation can reopen.

---

# 81. Upgrade Test

Open version 1, write data.

Upgrade to version 2 adding index/store.

Existing data survives.

Mandatory if upgrade machinery implemented generically.

---

# 82. Upgrade Failure Test

If schema upgrade throws:

* versionchange transaction aborts;
* old data remains available at prior version where browser semantics permit.

Document/test.

---

# 83. No Silent Downgrade

Opening app code with lower DB version than existing database should not delete/reset.

Surface version error.

---

# 84. VersionError Mapping

Normalize browser `VersionError`.

---

# 85. Blocked Open/Delete

Where feasible, direct test with two connections.

---

# 86. Structured Clone Test

Input nested object.

Mutate input after put.

Stored value unchanged.

Mutate returned object.

Stored value unchanged on reread.

---

# 87. Binary/Blob Support

Not required.

Do not add unless future backup/archive requires it.

---

# 88. Date Objects

Storage foundation may technically clone Date, but DayFrame durable domain contracts should continue to prefer strings.

Do not normalize Date implicitly.

---

# 89. Undefined Values

Audit IndexedDB behavior and project durable conventions.

Prefer domain records avoid undefined.

Do not silently strip values.

---

# 90. Deterministic Domain Serialization

Unlike localStorage JSON, IndexedDB structured clone does not produce bytes.

Domain recovery verification may therefore require semantic equality/canonicalization rather than byte equality.

This is an important architectural change.

---

# 91. Verification Semantics

Task 3.10 must define how future domain persistence can verify an IndexedDB write.

Preferred:

1. write transaction commits;
2. reread affected records/metadata;
3. domain validates;
4. canonical semantic comparison confirms desired condition.

Do not assume byte-for-byte verification.

---

# 92. Canonical Equality Boundary

Domain surface owns canonical semantic equality/fingerprint.

Infrastructure supplies exact stored clones.

---

# 93. HistoricalPlan Batch Verification Future

Future PlanPublication batch should be verifiable by:

* publication/batch ID;
* expected occurrence/day records;
* canonical fingerprints.

Task 3.10 should not implement domain logic.

---

# 94. ExecutionHistory Migration Future

If migrated, history could use:

* subject/record indexed stores;
* transactional append;
* better queryability.

But Task 3.10 does not redesign ExecutionHistory.

---

# 95. Migration Readiness API

Storage foundation should make a future migration task possible:

```text
read legacy localStorage
    ↓
validate
    ↓
write IndexedDB transaction
    ↓
reread/validate
    ↓
establish migration marker
    ↓
retain legacy until proven
```

Do not implement migration now.

---

# 96. Anti-Resurrection Requirement

Future migrations must prevent falling back to stale localStorage after IndexedDB authority is established.

Task 3.10 should call this out explicitly.

---

# 97. Authority Marker Location

Do not decide prematurely whether migration marker belongs in:

* localStorage;
* IndexedDB;
* both.

Recommend future migration task decide.

---

# 98. Storage Availability Probe

Provide or define a safe availability check if useful.

Avoid simplistic:

```ts
if ("indexedDB" in window)
```

as proof of usable persistence.

Actual open attempt is stronger.

---

# 99. SSR/Test Safety

Current app may run under tests without `window`.

Infrastructure imports must not crash merely by being imported.

Access IndexedDB lazily/injected.

---

# 100. Dependency Injection

Allow an `IDBFactory` injection or equivalent for tests.

Do not hardcode global `indexedDB` in every function.

---

# 101. Clock Independence

Storage layer needs no clock.

---

# 102. ID Independence

Storage layer allocates no domain IDs.

---

# 103. No React Dependency

None.

---

# 104. No Store Dependency

The generic infrastructure module should not import DayFrame store.

---

# 105. No Preview Dependency

None.

---

# 106. No ExecutionHistory Domain Dependency

Unless a migration is explicitly authorized, none.

---

# 107. No HistoricalPlan Domain Dependency

None.

---

# 108. Generic Versus Over-Generic

Do not build a database ORM.

The foundation should cover actual anticipated needs:

* object stores;
* exact keys;
* transactions;
* indexes;
* range queries;
* clear/delete;
* error normalization.

Nothing more.

---

# 109. Type Safety

Prefer typed generic wrappers for records and keys where practical.

Do not use pervasive `any`.

---

# 110. IDB Key Type

Use browser-supported `IDBValidKey`.

But domain descriptors may narrow key types.

---

# 111. Compound Keys

Future HistoricalPlan may benefit from compound indexes:

* `[userDayDate, publishedAt]`.

Foundation should support array key paths/ranges.

Directly assess.

---

# 112. Compound Index Test

If supported, test one compound index query.

Strongly recommended because HistoricalPlan likely needs it.

---

# 113. Descending Query

Future “latest publication before asOf” needs reverse cursor.

Foundation should support direction:

* next;
* prev.

Test.

---

# 114. Upper-Bound Range

Support:

`<= asOf`

via `IDBKeyRange.upperBound`.

---

# 115. Bounded Range

Support lower/upper bounds.

---

# 116. Pagination

Not needed in V1 foundation unless easy.

A simple limit is sufficient.

---

# 117. Transaction Return Values

High-level transaction helpers may return domain-neutral stored/read results.

Do not expose raw `IDBRequest`.

---

# 118. Async Error Propagation

Promise rejection should be normalized to structured storage result/error.

Choose consistent pattern with repository conventions.

---

# 119. Result Style Audit

If repository commonly uses discriminated result unions, use them.

Do not mix thrown expected failures and result unions arbitrarily.

---

# 120. Unexpected Programmer Errors

May still throw according to project conventions.

Expected browser/storage failures should be modeled.

---

# 121. Abort Control

Transaction helper should abort on any expected operation failure.

No caller need to remember manually.

---

# 122. Request Wrapper

Centralize converting `IDBRequest` events to Promise/result.

Do not duplicate event handlers.

---

# 123. Transaction Completion

A successful individual request does not mean transaction committed.

Foundation must wait for transaction `complete`.

This is mandatory.

---

# 124. Early Success Bug

Direct regression:

* put request succeeds;
* later transaction aborts;
* API must return failure, not success.

---

# 125. Read Transaction Completion

Read operations may resolve once requests succeed; but connection errors/abort should still be handled correctly.

Choose consistent semantics.

---

# 126. Schema Declaration

Define physical schema declaratively in one place.

Example conceptual:

```ts
type DatabaseSchema = {
  stores: [...]
}
```

Upgrade logic compares target version/declared stores according to explicit migration steps.

Do not attempt automatic destructive schema diffing.

---

# 127. Explicit Upgrade Steps

Preferred:

```text
v1:
  create infrastructure test/initial stores as authorized

v2:
  future ...
```

Do not auto-drop unknown stores/indexes.

---

# 128. Empty Initial Database Question

If no production domain store uses IndexedDB yet, opening an empty database just to prove infrastructure may be unnecessary.

Task 3.10 can:

* implement schema machinery/tests without app opening DB in production.

Preferred unless a real consumer is introduced.

---

# 129. No Production Side Effect

Importing the module should not create/open the DB automatically.

Future surface initialization should trigger it.

---

# 130. Future HistoricalPlan Schema Reservation

Do not create it now simply because we know the name.

Let Task 3.11 own domain physical schema if appropriate.

---

# 131. ExecutionHistory Migration Decision Artifact

Task result must explicitly state:

* migrated now;
  or
* remains localStorage;
* reason.

---

# 132. If ExecutionHistory Remains localStorage

Document mixed-storage transition state:

```text
Active/Profile/PlanDecision/ExecutionHistory
    localStorage

HistoricalPlan future
    IndexedDB
```

This is temporary but acceptable if clearly governed.

---

# 133. Long-Term Consolidation

Recommend whether ExecutionHistory should migrate before:

* Backup V3;
* Phase 3 completion;
* broader release.

Task 3.10 must state timing.

---

# 134. HistoricalPlan Before ExecutionHistory Migration?

Possible sequence:

1. storage foundation;
2. HistoricalPlan domain + IndexedDB persistence;
3. migrate ExecutionHistory;
4. Backup V3.

Or:

1. foundation;
2. migrate ExecutionHistory;
3. HistoricalPlan.

Task 3.10 should recommend sequence based on complexity/risk.

---

# 135. Preferred Sequence Bias

Likely:

```text
3.10 storage foundation
3.11 HistoricalPlan pure domain/publication projection
3.12 HistoricalPlan IndexedDB persistence/publication
3.13 ExecutionHistory IndexedDB migration
3.14 Backup V3
```

But the audit should decide.

---

# 136. Why HistoricalPlan Domain Before Persistence

Keep domain semantics pure.

Task 3.9 already defines architecture; 3.11 can make it executable without storage.

Then persistence can use 3.10 foundation.

This mirrors ExecutionRecord → ExecutionHistory sequencing.

---

# 137. Existing localStorage Tests

Do not rewrite unrelated persistence tests.

---

# 138. Browser Compatibility

Document supported baseline.

IndexedDB is widely supported, but use only stable APIs.

Avoid experimental features.

---

# 139. Safari/Firefox Concerns

Audit broad known IndexedDB pitfalls only enough to avoid unsafe assumptions.

No deep cross-browser research required unless implementation needs it.

---

# 140. Transaction Durability Hint

Do not rely on experimental transaction durability modes unless justified.

---

# 141. Quota Estimation API

Do not require `navigator.storage.estimate()`.

Optional diagnostics later.

---

# 142. Persistent Storage Request

Do not request `navigator.storage.persist()` in this task.

Could be later UX/persistence-hardening work.

---

# 143. Storage Eviction

Browser storage may still be evicted under some conditions.

Document that Backup remains necessary.

Do not overpromise.

---

# 144. Privacy / At-Rest Encryption

No encryption implementation.

Document only if relevant.

---

# 145. Data Sensitivity

Historical plan/execution data are sensitive local behavioral data.

Storage abstraction must not log records.

No debug `console.log` of persisted payloads.

---

# 146. Logging

Errors may log diagnostics according to project policy, but not raw user data.

---

# 147. Full Database Export

No generic raw IndexedDB binary export.

Domain surfaces produce semantic exports.

---

# 148. Database Inspection

No UI.

---

# 149. Recovery UI

None.

---

# 150. Clear API

Foundation may expose:

* clearStore;
* deleteDatabase.

No user-facing controls.

---

# 151. Tests — Basic Put/Get

Required.

---

# 152. Tests — PutMany Atomic

Required.

---

# 153. Tests — Delete

Required.

---

# 154. Tests — DeleteMany Atomic

If implemented.

---

# 155. Tests — Clear Store

Required.

---

# 156. Tests — Index Equality Query

Required.

---

# 157. Tests — Index Range Query

Required.

---

# 158. Tests — Compound Index

Strongly recommended.

---

# 159. Tests — Reverse/Latest Query

Required if API supports direction/limit.

---

# 160. Tests — Transaction Commit

Required.

---

# 161. Tests — Transaction Abort

Required.

---

# 162. Tests — No Partial Writes

Mandatory.

---

# 163. Tests — Multi-Store Atomicity

Required if API supports multi-store transaction.

---

# 164. Tests — Clone Isolation

Required.

---

# 165. Tests — Upgrade Preserves Data

Required.

---

# 166. Tests — Upgrade Adds Store/Index

Required.

---

# 167. Tests — Upgrade Failure

Required if reliably testable.

---

# 168. Tests — Versionchange Close

Required if reliably testable.

---

# 169. Tests — Blocked Upgrade

Required if fake IndexedDB supports.

Otherwise document limitation and test behavior at lower seam.

---

# 170. Tests — Open Failure

Fault-injected.

---

# 171. Tests — Quota Error

Fault-injected/normalized.

---

# 172. Tests — Constraint Error

Required.

---

# 173. Tests — DataClone Error

Required if practical.

---

# 174. Tests — Transaction Early-Success Regression

Mandatory.

---

# 175. Tests — Reopen After Close

Required.

---

# 176. Tests — Import Safety

Import module without browser global.

No crash.

---

# 177. Tests — Injection

Injected `IDBFactory` works.

---

# 178. Tests — No Domain ID Allocation

Static/code audit.

---

# 179. Tests — No LocalStorage Fallback

If IndexedDB operation fails, foundation reports failure.

No silent fallback.

---

# 180. No Production Consumer Test

If foundation-only choice adopted, confirm no runtime app behavior changes.

---

# 181. Bundle Impact

If only native IndexedDB + dev dependency, production bundle impact should be negligible.

Record build result.

---

# 182. Documentation

Create a storage-foundation architecture note/checkpoint if implementation is substantial.

Recommended:

`docs/checkpoints/CHECKPOINT_Phase_3_Durable_Collection_Storage_Foundation.md`

if completed successfully.

---

# 183. Checkpoint Contents

Include:

1. technology choice;
2. database/version boundary;
3. transaction semantics;
4. index/query support;
5. error taxonomy;
6. connection lifecycle;
7. upgrade discipline;
8. domain validation boundary;
9. verification semantics;
10. migration readiness;
11. current localStorage coexistence;
12. long-term migration recommendation;
13. non-goals.

---

# 184. ADR

Create ADR if repository convention supports:

`ADR_INDEXEDDB_DURABLE_COLLECTION_STORAGE_FOUNDATION.md`

Record why localStorage remains suitable for bounded existing surfaces but not HistoricalPlan scale.

---

# 185. Governance Updates

Update:

* `CURRENT_STATE.md`;
* `DECISIONS.md`;
* `ROADMAP.md`;

if the storage foundation is accepted.

Do not claim HistoricalPlan implementation exists.

---

# 186. No Changelog Inflation

Only update product changelog if infrastructure changes are conventionally recorded there.

No user-visible feature shipped.

---

# 187. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.10_AUDIT_AND_IMPLEMENT_PHASE_3_DURABLE_COLLECTION_STORAGE_FOUNDATION_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Task 3.9 Finding
4. Initial Persistence Audit
5. IndexedDB Suitability Determination
6. Dependency Determination
7. Files Changed
8. Infrastructure Module Boundary
9. Database Identity
10. Database Schema Version
11. Version Independence
12. Object Store Strategy
13. ExecutionHistory Migration Determination
14. Storage Capability Interface
15. Key Semantics
16. Structured Clone Boundary
17. Transaction Model
18. Atomic Batch Writes
19. Multi-Store Transactions
20. Query Model
21. Index Model
22. Compound Index Support
23. Range Queries
24. Reverse/Latest Queries
25. Open Lifecycle
26. Upgrade Lifecycle
27. Blocked Upgrade
28. versionchange Handling
29. Multi-Tab Limitation
30. Storage Availability
31. Error Taxonomy
32. Error Normalization
33. Quota Failure
34. Transaction Abort
35. Constraint Failure
36. Clone Failure
37. Retry Semantics Boundary
38. Desired-Condition Boundary
39. Read Consistency
40. Export/Clear Primitives
41. Schema Migration Discipline
42. Domain Validation Boundary
43. Connection Management
44. Test Strategy
45. fake-indexeddb Determination
46. Fault Injection
47. Atomicity Tests
48. Query Tests
49. Upgrade Tests
50. Connection Tests
51. Clone Isolation Tests
52. Verification Semantics
53. Canonical Equality Boundary
54. Migration Readiness
55. Anti-Resurrection Requirement
56. Browser Import Safety
57. Dependency Injection
58. Privacy/Logging
59. Production Consumer Determination
60. Current localStorage Coexistence
61. Long-Term ExecutionHistory Migration Recommendation
62. Recommended Phase 3 Persistence Sequence
63. Checkpoint
64. ADR
65. Governance Updates
66. Architectural Alignment Assessment
67. Deviations
68. Discoveries and Deferred Work
69. Recommended Task 3.11
70. Focused Validation
71. Full Validation
72. Final Completion Determination

---

# 188. Required Matrices

## A. Storage Technology Matrix

| Technology | Atomic batch | Indexed query | Scale | Current fit |
| ---------- | -----------: | ------------: | ----: | ----------- |

Include:

* localStorage;
* IndexedDB.

## B. Error Matrix

| Failure | Normalized code | Partial commit possible? | Retryable? |
| ------- | --------------- | -----------------------: | ---------: |

## C. Transaction Matrix

| Operation | Atomic? | Multi-record? | Multi-store? |
| --------- | ------: | ------------: | -----------: |

## D. Current/Future Surface Matrix

| Surface | Current storage | Future migration? | Reason |
| ------- | --------------- | ----------------: | ------ |

Include:

* Active;
* Profiles;
* PlanDecision;
* ExecutionHistory;
* HistoricalPlan.

## E. Upgrade Matrix

| Change | Requires DB version bump? | Data migration? |
| ------ | ------------------------: | --------------: |

---

# 189. Validation Requirements

Run focused infrastructure tests for:

* put/get;
* atomic putMany;
* transaction commit/abort;
* no partial writes;
* index equality;
* index range;
* compound index;
* reverse latest query;
* clear/delete;
* structured-clone isolation;
* open/reopen;
* upgrade preserving data;
* blocked/versionchange behavior where testable;
* normalized failures;
* injected IDBFactory;
* import safety.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

If a dev dependency is added:

* lockfile must be updated;
* production build must confirm no unintended runtime inclusion.

Record exact test-file/test counts.

---

# 190. Completion Criteria

Task 3.10 is complete only when:

* current persistence architecture has been audited;
* IndexedDB suitability is explicitly confirmed or rejected;
* a narrow reusable durable collection-storage module exists;
* physical database version is independent from domain versions;
* storage APIs are domain-neutral;
* object-store/index schema upgrades occur only in versionchange transactions;
* atomic multi-record writes are supported;
* multi-store transaction architecture is supported or explicitly bounded;
* transaction success is reported only after transaction commit;
* partial writes are prevented on failure;
* exact-key reads/writes/deletes exist;
* indexed equality/range queries exist;
* compound index/range support needed by HistoricalPlan is supported;
* reverse/latest bounded query semantics exist;
* connection open/close/reopen behavior is governed;
* versionchange behavior closes stale connections safely;
* blocked upgrade is observable;
* storage errors are normalized;
* quota failure is observable;
* structured clone errors are observable;
* no silent localStorage fallback exists;
* no domain ID/time allocation occurs;
* storage foundation owns no desired durable condition;
* verification semantics for structured-clone persistence are documented;
* domain validation remains outside infrastructure;
* upgrade policy prohibits silent destructive resets;
* test strategy exercises real IndexedDB semantics through an appropriate fake/browser implementation;
* import is safe when browser globals are absent;
* current ExecutionHistory migration decision is explicit;
* future migration/anti-resurrection requirements are documented;
* no HistoricalPlan domain/persistence is implemented;
* no historical metrics, Goals, learning, or Backup V3 are implemented;
* full validation passes;
* result artifact is complete.

---

# 191. Explicit Non-Goals

Do **not**:

* implement HistoricalPlanLedger;
* create historical plan publications;
* implement historical metrics;
* implement adherence;
* implement Goal progress;
* implement learning;
* implement Backup V3;
* silently migrate ExecutionHistory unless explicitly justified;
* migrate Active/Profile/PlanDecision;
* add user-facing storage UI;
* add recovery UI;
* add arbitrary database ORM features;
* add silent localStorage fallback;
* add silent retention trimming;
* add destructive schema-reset migration;
* store domain-specific interpretation in the infrastructure layer;
* allocate domain identities;
* perform unrelated UI work.

---

# 192. Stop Conditions

Stop and report if:

* IndexedDB cannot be used safely in the supported runtime;
* transactional semantics cannot be reliably tested;
* current app architecture cannot tolerate asynchronous persistence without broad store redesign;
* database upgrade/versionchange behavior cannot be made safe;
* native IndexedDB requires so much boilerplate that a wrapper dependency becomes architecturally necessary and needs explicit approval;
* storage abstraction cannot support future complete-day publication atomicity;
* storage errors cannot be normalized without losing critical recovery information;
* ExecutionHistory must migrate immediately for the foundation to be usable and that migration exceeds this task boundary;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest prerequisite/completion task.

---

# 193. Recommended Follow-On Boundary

If Task 3.10 completes successfully, the next task should make the Task 3.9 ledger architecture executable as a **pure domain model** before persistence is wired.

Recommended:

> **Task 3.11 — Implement HistoricalPlan V1 Pure Domain, Day-Publication Semantics, and Effective-Plan Projection**

That task should implement:

* PlanPublicationBatch identity;
* HistoricalPlanDayPublication;
* HistoricalPlannedOccurrenceSnapshot;
* scheduled/unplaced/omitted/blocked states;
* batch/day validation;
* semantic fingerprint/dedup rules;
* complete-day authority;
* latest-day/as-of projection;
* overlapping publication resolution;
* immutable publication semantics;
* pure regression coverage.

It should not yet persist publications.

Then Task 3.12 can wire HistoricalPlan into the durable collection foundation.

---

# 194. Task Determination

**Authorized:** persistence audit, IndexedDB decision, reusable transactional collection-storage infrastructure, object-store/index/version lifecycle, atomic batch primitives, structured-clone-safe reads/writes, indexed/range queries, error normalization, connection/upgrade handling, migration-readiness boundaries, regression tests, and infrastructure checkpoint/governance.

**Not authorized:** HistoricalPlan domain/persistence, historical metrics, Goal system, learning, Backup V3, unrelated durable-surface migrations, or user-facing storage behavior.

The governing infrastructure principle is:

> **A durable collection layer must guarantee transactional storage behavior without becoming domain authority. It stores exactly what a validated surface asks it to store, reports durability failures truthfully, and never repairs, reinterprets, reallocates, or silently discards user data.**

---

# 195. Final Completion Statement

**Task 3.10 is complete when DayFrame has an evidence-backed and fully tested transactional durable collection-storage foundation suitable for the HistoricalPlan ledger and future long-lived Phase 3 collections; when IndexedDB or an explicitly justified equivalent provides atomic multi-record transactions, indexed and bounded temporal queries, safe structured-clone persistence, explicit schema/version upgrades, connection/versionchange/blocked handling, normalized failure semantics, quota and transaction-abort visibility, non-destructive upgrade policy, exact caller-controlled keys, clone isolation, export/clear primitives, domain-independent validation boundaries, semantic reread-verification guidance, browser-global-safe dependency injection, and migration/anti-resurrection readiness; when current localStorage coexistence and ExecutionHistory migration timing are explicitly determined; when focused and full repository validation pass; and when no HistoricalPlan publication, historical metric, Goal, learning, Backup V3, silent persistence fallback, destructive schema reset, or unrelated product behavior is introduced.**
