# Task 3.12 — Implement HistoricalPlan V1 IndexedDB Persistence, Publication Authority, Recovery, and Preview Publication Wiring

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded durable-authority, publication-orchestration, IndexedDB-persistence, and recovery implementation task.

Task 3.12 makes the pure `HistoricalPlan V1` model from Task 3.11 durable and connects fresh authoritative Preview generation/regeneration to historical plan publication.

This task includes:

* HistoricalPlan IndexedDB physical schema;
* HistoricalPlan runtime authority;
* publication candidate materialization from fresh authoritative Preview;
* complete requested-range publication batches;
* scheduled/unplaced/omitted/blocked candidate projection;
* work/manual/template candidate projection;
* exact lifetime-safe reference mapping;
* stale/Try/no-Preview rejection;
* semantic deduplication;
* atomic batch persistence;
* indexed day/publication reads;
* latest-day/as-of reads;
* durability status;
* desired durable publication condition;
* exact retry;
* protected ingress;
* publication/batch corruption handling;
* gap semantics;
* source-recheck-safe recovery;
* export;
* full-clear integration;
* subscriptions;
* direct regression coverage.

It does **not** implement:

* historical reporting coverage UI;
* historical plan follow-through;
* adherence;
* Progress;
* Goals;
* learning;
* ExecutionHistory IndexedDB migration;
* Backup V3;
* historical plan editing/correction UI;
* arbitrary backfill;
* imported-calendar historical identity.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 3.9–3.11 are complete and accepted;
6. review:

   * `CHECKPOINT_Phase_3_Historical_Plan_Ledger_Semantics.md`;
   * `ADR_HISTORICAL_PLAN_LEDGER_AND_DAY_PUBLICATION_SEMANTICS.md`;
   * `CHECKPOINT_Phase_3_Durable_Collection_Storage_Foundation.md`;
   * `ADR_INDEXEDDB_DURABLE_COLLECTION_STORAGE_FOUNDATION.md`;
   * Task 3.10 result;
   * Task 3.11 result;
   * current Preview generation/revision/freshness flows;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.12_IMPLEMENT_HISTORICALPLAN_V1_INDEXEDDB_PERSISTENCE_PUBLICATION_AUTHORITY_RECOVERY_AND_PREVIEW_PUBLICATION_WIRING_RESULT.md`

If fresh authoritative Preview publication cannot be wired without changing accepted HistoricalPlan V1 semantics or broad scheduling behavior, stop and report rather than expanding scope.

---

# 2. Purpose

Task 3.11 established the pure domain:

```text
PlanPublicationBatchV1[]
        ↓
strict validation
        ↓
semantic fingerprinting
        ↓
append/dedup
        ↓
effective day/range projection
```

Task 3.10 established transactional IndexedDB infrastructure with:

* atomic multi-record/multi-store transactions;
* compound indexes;
* indexed range queries;
* reverse/latest queries;
* additive upgrade discipline;
* normalized errors;
* clone isolation;
* no silent fallback.

Task 3.12 connects these to real application authority.

---

# 3. Governing Architectural Principles

The following are fixed:

1. fresh authoritative Preview generation/regeneration is the publication boundary;
2. Try Preview never publishes;
3. stale Preview never publishes;
4. Save Setup alone never publishes;
5. first execution report is not a publication trigger;
6. day rollover is not a publication trigger;
7. publication batches are immutable;
8. one generation batch covers the full requested visible user-day range;
9. empty requested days are part of authority;
10. identical semantic generation is a no-op;
11. any meaningful day change produces a full requested-range candidate batch;
12. complete-day absence represents removal;
13. hidden Preview buffer days do not publish;
14. historical publication does not change current scheduling;
15. IndexedDB persistence is authoritative for HistoricalPlan;
16. no localStorage fallback is allowed;
17. missing durable publication remains a historical gap;
18. failed persistence must be observable;
19. no fabricated backfill;
20. ExecutionHistory remains on localStorage during this task.

Do not reopen these.

---

# 4. Architectural Objective

After Task 3.12:

```text
fresh authoritative Preview generation
        ↓
materialize complete requested-range historical plan candidate
        ↓
HistoricalPlan V1 validate
        ↓
semantic append/dedup classification
        ↓
runtime HistoricalPlan authority
        ↓
atomic IndexedDB publication transaction
        ↓
indexed historical plan authority
```

with:

```text
stale Preview
Try Preview
no Preview
        ↓
NO PUBLICATION
```

---

# 5. Required Initial Wiring Audit

Before coding, trace:

* `generatePreview`;
* Preview persistence/update;
* Preview stale-state transition;
* Try/revise flow;
* Accept flow;
* authoritative regeneration;
* requested Preview range;
* engine planning-buffer expansion;
* scheduled blocks;
* unplaced candidates;
* PlanDecision replay results;
* omitted occurrence representation;
* blocked placement representation;
* work occurrence lineage;
* manual-event lineage;
* template occurrence lineage.

Document exact publication hook.

---

# 6. Publication Hook

Preferred:

> HistoricalPlan publication occurs only after `generateSchedulePreview`/equivalent has produced a successful fresh authoritative Preview and the store has accepted that Preview as current authority.

Do not publish before generation succeeds.

---

# 7. Publication Ordering

Preferred sequence:

```text
generate authoritative Preview
        ↓
adopt current Preview runtime authority
        ↓
materialize HistoricalPlan candidate
        ↓
append/dedup runtime HistoricalPlan authority
        ↓
attempt IndexedDB persistence
```

Determine whether Preview adoption should wait for HistoricalPlan persistence.

Preferred:

> no.

Current planning authority and historical-plan durability are separate facts.

A persistence failure must not prevent current Preview from becoming operative.

---

# 8. Publication Failure Semantics

If fresh Preview succeeds but HistoricalPlan persistence fails:

* Preview remains current operative plan;
* runtime HistoricalPlan publication remains current session authority if candidate append succeeded;
* HistoricalPlan durability reports failure;
* exact retry remains available;
* restart may lose that publication if retry never succeeds;
* this creates an explicit ledger gap risk.

Do not roll back Preview.

---

# 9. Gap Semantics

A failed historical-plan write creates potential historical incompleteness.

The system must preserve enough durability status to avoid later claiming complete history.

Task 3.12 must define runtime gap/durability semantics.

---

# 10. No Background Reconstruction

If a write failed and app restarted before retry:

do not regenerate old publication from current state automatically.

That would be fabricated backfill.

---

# 11. HistoricalPlan Physical Schema

Create the first production consumer of Task 3.10 IndexedDB infrastructure.

Preferred database:

`dayframe-durable-v1`

using physical DB schema version 1 if no prior production stores exist.

---

# 12. Object Stores

Choose a schema optimized for Task 3.9/3.11 semantics.

Recommended stores:

## A. `historicalPlanBatches`

One record per `PlanPublicationBatch`.

## B. `historicalPlanDays`

One record per complete day publication, keyed by a composite physical identity.

Potential key:

```text
[batchId, userDayDate]
```

or a stable encoded key.

## C. optional metadata store

Only if required for authority marker/durability/migration metadata.

Prefer minimal.

---

# 13. Batch Store Purpose

Preserve:

* batch ID;
* publishedAt;
* requested range;
* versions;
* semantic fingerprint if derived/cached;
* complete batch membership metadata.

Do not persist derived effective-plan projection.

---

# 14. Day Store Purpose

Support indexed query:

> latest publication for userDayDate at or before asOf.

Each stored day record should preserve:

* batch ID;
* publishedAt;
* userDayDate;
* frozen day context;
* occurrences.

---

# 15. Batch Atomicity

One publication batch transaction must atomically write:

* batch record;
* every day publication record;
* any required metadata.

All commit or none.

Mandatory.

---

# 16. Batch/Day Validation Before Write

Never persist an unvalidated candidate.

Flow:

```text
candidate
→ pure HistoricalPlan validation
→ append classification
→ persist
```

---

# 17. Indexed Query Design

Create indexes needed for:

* days by `userDayDate`;
* days by `[userDayDate, publishedAt]`;
* batches by `publishedAt`;
* batch ID lookup.

Prefer compound day/as-of index.

---

# 18. Latest-Day Query

Use reverse cursor/upper bound:

```text
[userDayDate, <= asOf]
```

to retrieve latest valid candidate efficiently.

Do not scan full ledger.

---

# 19. Range Query

Future metrics need user-day ranges.

Support bounded day reads by:

* userDayDate range;
* publication/asOf filtering.

Task 3.12 may implement store-level historical range query by repeatedly querying days or via indexed scan.

Keep correctness first.

---

# 20. Domain Revalidation On Read

Every durable batch/day read must be revalidated through Task 3.11 domain validators before becoming runtime authority.

IndexedDB structured-clone success is not domain validity.

---

# 21. Runtime HistoricalPlan Authority

Create independent runtime authority outside:

* `DayFrameState`;
* ExecutionHistory;
* Active;
* Profiles;
* PlanDecision.

Conceptually:

```ts
type HistoricalPlanRuntimeState = {
  batches: PlanPublicationBatchV1[];
  ...
}
```

But do not require loading every day publication into one huge array if the architecture supports indexed lazy reads.

Task 3.12 must choose runtime model deliberately.

---

# 22. Runtime Model Options

## Option A — full in-memory batch collection

Simple, but does not scale.

## Option B — IndexedDB remains durable query authority; runtime stores only publication metadata/cache

More scalable.

## Option C — bounded cache + indexed durable queries

Strong candidate.

Task 3.9/3.10 favor collection scale, so avoid recreating a whole-ledger localStorage-style model in memory without justification.

---

# 23. Recommended Runtime Bias

Prefer:

> IndexedDB is durable source; runtime owns current append/durability state and optional bounded cache, while historical queries read through indexed validated storage.

However, current-session failed writes require runtime desired authority that may not yet be durable.

Therefore runtime must be able to merge:

* durable historical data;
* pending current-session publication(s).

Define carefully.

---

# 24. Pending Publication Authority

If candidate append succeeds in runtime but persistence fails:

* that batch remains current session HistoricalPlan authority;
* historical queries in-session must see it;
* retry writes exact pending batch;
* it must not disappear merely because DB read lacks it.

---

# 25. Desired Durable Condition

HistoricalPlan needs its own desired durable state.

Unlike whole-value localStorage, likely best represented as:

* pending append batch(es);
* or exact latest desired publication operations.

Task must define.

---

# 26. Append-Only Simplification

Because HistoricalPlan ordinary authority is append-only:

desired durable condition can often be:

> exact set/queue of validated publication batches accepted in runtime but not yet confirmed durable.

This may be better than serializing the entire ledger.

Audit.

---

# 27. Multiple Failed Publications

If publication A fails, then later publication B is accepted:

* both may be required for immutable history;
* B must not replace A in desired durability queue.

Important difference from whole-checkpoint localStorage surfaces.

Task 3.12 must explicitly handle it.

---

# 28. Ordered Pending Queue

Preferred:

```text
pending publications:
A
B
C
```

Retry persists all undurable accepted batches in publication order, atomically per batch or safely in one larger transaction if supported.

Do not discard A because B superseded current operative plan.

Historical revision history requires both.

---

# 29. Retry Exactness

Retry must preserve exact:

* batch IDs;
* publishedAt;
* day contents;
* fingerprints.

No regeneration.

No new IDs.

No new time.

---

# 30. Batch Retry Atomicity

Each batch remains atomic.

If retrying multiple batches in one transaction:

* all may commit atomically;
  or
* retry sequentially with clear status.

Choose simpler truthful model.

Preferred:

> batch-by-batch ordered retry.

A later batch should not become durable while an earlier accepted historical revision remains missing if that would create a gap in revision history.

---

# 31. Gap Ordering

Strongly consider:

> stop retry at first failed pending batch.

Do not durably skip over earlier failed accepted publication.

This preserves ledger continuity.

---

# 32. Durability Status

HistoricalPlan needs dedicated status.

Possible:

* durable;
* pending;
* failed;
* protected;
* unavailable.

Exact naming should match project conventions.

---

# 33. Durability Subscriber

Expose dedicated subscription.

Do not notify authored-state subscribers for durability-only changes.

---

# 34. HistoricalPlan Subscription

Notify on:

* accepted new runtime publication;
* recovery replacement/abandon;
* clear;
* possibly durable-load changes.

Do not notify merely because retry status changed if history content unchanged.

---

# 35. Startup

On app startup:

1. open IndexedDB;
2. validate physical schema availability;
3. load/validate required HistoricalPlan metadata;
4. establish authority state;
5. expose gaps/protection if corruption exists.

Do not block unrelated current planning indefinitely unless current architecture requires.

---

# 36. No Historical Data

No stores/records:

* valid empty historical ledger;
* no backfill;
* prospective publication begins with next fresh Preview.

---

# 37. Startup Publication

Do not automatically publish merely because a Preview was persisted from prior session unless that Preview is explicitly regenerated/validated as fresh under accepted publication semantics.

Audit current persisted Preview behavior.

Preferred:

> publication occurs on fresh generation/regeneration events only.

---

# 38. Existing Preview On Rehydration

If app rehydrates a current Preview without generating it anew:

do not fabricate a HistoricalPlan publication from it unless evidence proves it was already durably published.

This is important.

---

# 39. Publication Marker

Task 3.12 may need a way to determine whether a current Preview generation has already been published, especially across retry/restart.

Potential:

* batch ID associated transiently with Preview generation;
* semantic dedup against durable latest days.

Prefer semantic dedup over new Preview schema if possible.

---

# 40. Preview Schema Change

Avoid persisting HistoricalPlan batch IDs into Preview unless necessary.

Preview remains derived planning output.

---

# 41. Candidate Materialization Module

Create application/core bridge separate from pure HistoricalPlan domain.

Preferred location:

`code/src/core/historicalPlan/materializePlanPublication.ts`

or application layer.

It may depend on:

* fresh Preview;
* authored/source state;
* effective preferences;
* PlanDecision replay results.

No IndexedDB inside materializer.

---

# 42. Candidate Materialization Result

Use explicit result:

* materialized;
* noPreview;
* stalePreview;
* tryPreview;
* inconsistentPlanContext;
* unsupportedOccurrenceFamily;
* invalidCandidate.

No throwing for expected conditions.

---

# 43. Freshness Gate

Reuse exact Preview staleness authority.

Do not duplicate stale logic.

---

# 44. Try Gate

Reuse `revisedAt`/accepted-authority distinction established in Task 3.4.

Try-only revised Preview never materializes publication.

---

# 45. Requested Visible Range

Materializer must use the user-requested Preview range.

Not engine-expanded hidden buffer.

Mandatory.

---

# 46. Empty Days

Materializer must produce day entries for every requested date, even when no occurrences exist.

---

# 47. Scheduled Template Mapping

Map:

* durable reference;
* family;
* frozen title/category;
* `scheduled`;
* exact UTC interval.

---

# 48. Unplaced Template Mapping

Map:

* same semantic occurrence reference;
* `unplaced`;
* no interval.

---

# 49. Omitted Template Mapping

Map current accepted/effective omission:

* reference;
* `omitted`;
* no interval.

Do not persist PlanDecision ID.

---

# 50. Blocked Template Mapping

Map:

* durable occurrence reference;
* `blocked`;
* no fictional scheduled interval.

---

# 51. Work Mapping

Map anchored generated work occurrence:

* `work`;
* exact reference;
* scheduled interval;
* frozen title/category;
* containing semantic user day.

---

# 52. Manual Event Mapping

Map manual event:

* `manualEvent`;
* durable reference;
* scheduled interval;
* frozen title/category;
* containing semantic user day.

Task 3.11 discovered manual references do not themselves encode exact user-day coordinate. Therefore current fresh Preview lineage must establish containing day unambiguously.

---

# 53. User-Week Template Mapping

Task 3.11 discovered some user-week template references do not encode exact occurrence user day.

Materializer must assign them using authoritative Preview occurrence context.

Direct test mandatory.

---

# 54. Day Membership Validation

Candidate day membership must be established before constructing batch.

For reference forms without exact day coordinate:

* containing fresh Preview user-day context is the authority.

Do not infer from title or current recurrence.

---

# 55. Duplicate Representation Dedup

Same semantic occurrence may appear through multiple runtime representations.

Materializer must deduplicate by DurableOccurrenceReference per day.

If two representations disagree semantically:

* return `inconsistentPlanContext`.

Do not choose winner.

---

# 56. Scheduled + Replay Duplicate

Example:
scheduled block plus accepted-choice metadata.

Do not publish twice.

---

# 57. Blocked + Unplaced Duplicate

If blocked replay target corresponds to unplaced candidate:

* final historical state must be `blocked`, not both entries.

Define precedence from effective plan authority.

Preferred:

> blocked accepted replay status overrides generic unplaced state for same reference.

---

# 58. Omitted Presence

If omitted occurrence is absent from scheduled/unplaced lists:

* replay/decision context must still add it as `omitted`.

---

# 59. State Precedence

Define deterministic effective-state precedence based on actual replay semantics.

Potential:

```text
omitted
blocked
scheduled
unplaced
```

But do not invent purely by intuition.

Audit existing replay outputs and derive exact rule.

---

# 60. Work/Manual Collision

Should not collide with template reference families.

If same durable semantic reference somehow appears twice:

* inconsistent.

---

# 61. Unsupported Imported/Synthetic

Exclude only if they are genuinely outside HistoricalPlan supported identity.

Task 3.11 rejects unsupported reference families.

Document any exclusions.

---

# 62. Unsupported Item Impact

A non-ledger-eligible synthetic Preview item should not necessarily fail entire publication if it is not part of authored/reportable plan authority.

But if a planned user commitment lacks durable identity:

* publication may be incomplete.

Task must classify.

---

# 63. Publication Completeness Principle

HistoricalPlan should represent every supported authoritative planned occurrence that can later matter to denominator semantics.

Do not silently omit supported occurrences due materializer convenience.

---

# 64. Effective Day Context

For each requested day freeze:

* userDayDate;
* effective day boundary;
* effective weekStartsOn;
* historical UTC offset.

Use existing per-user-day preference resolution.

---

# 65. UTC Offset

Compute for historical day context, not current moment.

No current-offset shortcut.

---

# 66. Overnight

Cross-midnight blocks belong once to semantic user day.

Exact UTC interval preserved.

---

# 67. Canonical Ordering

Pass candidate through Task 3.11 constructor/validator.

Do not duplicate ordering logic.

---

# 68. Batch ID/Time Ownership

Publication orchestration owns fresh batch construction through Task 3.11 constructor.

Materializer does not manually generate ID/time fields.

---

# 69. Generation-Time `publishedAt`

Use store/application clock at publication establishment.

Do not use Preview generation-start time unless that is the actual accepted publication moment.

---

# 70. Dedup Before Runtime Append

Use `appendPlanPublicationBatch`.

If result:

* `identicalNoOp`: no runtime history mutation, no IndexedDB write;
* `appended`: runtime publication accepted and persistence attempted;
* invalid/nonmonotonic: publication failure surfaced.

---

# 71. Dedup Against Durable + Pending Authority

The append helper must compare against current effective HistoricalPlan collection including pending runtime publications.

Do not dedup only against durable DB state.

---

# 72. Runtime Collection Scale

If runtime does not load full ledger, construct enough recent/effective state to classify append correctly.

At minimum:

* latest operative day publication for each requested day;
* latest accepted publication timestamp.

Use indexed reads + pending queue.

---

# 73. No Full Ledger Scan For Every Generation

Avoid reading all HistoricalPlan batches merely to dedup a 14-day Preview.

Use indexed latest-day queries.

This is one reason IndexedDB exists.

---

# 74. Domain Append Helper Adaptation

Task 3.11 append helper currently accepts a collection.

Task 3.12 may need a narrower helper using latest day projections.

Do not change domain semantics.

If a pure helper refactor is needed, preserve behavior/tests.

---

# 75. Persistence Record Shape

Do not persist UI/store objects.

Persist plain HistoricalPlan V1 durable records.

---

# 76. Physical Batch Record

Define explicit physical schema.

Potential:

```ts
{
  batchId,
  publishedAt,
  rangeStart,
  rangeEnd,
  batchVersion,
  fingerprint
}
```

Day contents stored separately.

---

# 77. Physical Day Record

Potential:

```ts
{
  batchId,
  publishedAt,
  userDayDate,
  dayPublication
}
```

Indexes on:

* `[userDayDate, publishedAt]`;
* `batchId`;
* `publishedAt`.

---

# 78. Domain/Physical Shape Separation

Physical wrapper may contain query/index duplication (`userDayDate`, `publishedAt`) outside nested domain object.

On read:

* verify wrapper metadata matches nested domain facts.

Mismatch = corruption.

---

# 79. Physical Metadata Consistency

Direct validation:

* batch ID matches;
* publishedAt matches;
* day date matches;
* versions match where duplicated.

No trusting index wrapper blindly.

---

# 80. Atomic Persist

Use Task 3.10 mixed multi-store transaction.

All batch/day records written in one transaction.

---

# 81. Commit Verification

After transaction complete:

1. reread batch record;
2. reread all expected day records or canonical fingerprint metadata;
3. validate domain objects;
4. compare canonical semantic equality;
5. mark batch durable only after successful verification.

This follows Task 3.10 structured-clone verification semantics.

---

# 82. Verification Failure

If transaction committed but reread/semantic verification fails:

* durability reports failed/protected as appropriate;
* do not allocate replacement batch;
* preserve runtime accepted authority;
* recovery required.

Define carefully.

---

# 83. IndexedDB Failure

Normalize through Task 3.10 errors.

Map infrastructure error into HistoricalPlan durability/recovery result without leaking raw browser text.

---

# 84. Quota Failure

Runtime publication remains session authority.

Pending queue retained.

Retry available when conditions change.

---

# 85. Constraint Failure

Unexpected duplicate physical key or unique constraint must not silently overwrite.

Treat as corruption/consistency issue unless exact idempotent same-value write.

---

# 86. Idempotent Retry

Retrying the exact same batch may encounter existing records if prior commit happened but acknowledgment failed.

Persistence must distinguish:

* exact same durable batch already present → treat as verified durable;
* conflicting same key/different content → protected inconsistency.

This is critical.

---

# 87. Crash/Uncertain Commit Window

IndexedDB transaction may commit before app observes success.

On restart/retry:

* exact batch ID + semantic equality should recognize already-durable publication;
* no duplicate historical revision.

---

# 88. Publication Authority Marker

No separate authority marker is needed if IndexedDB durable collection presence and batch IDs provide authoritative history.

But migration/startup epoch may eventually need one.

Task result should state.

---

# 89. Protected Ingress

HistoricalPlan durable ingress must protect rather than guess when:

* physical DB/store unavailable;
* unsupported domain version blocks interpretation;
* batch metadata conflicts;
* batch/day mismatch;
* ambiguous equal-time conflict;
* structurally invalid batch;
* latest authoritative day is corrupt.

Do not rewrite.

---

# 90. Protection Scope

Use the narrowest safe boundary.

Task 3.9 suggested:

* day publication is smallest complete semantic component;
* batch is atomic publication event;
* latest corrupt day makes affected historical scope unavailable;
* envelope/version failure can protect whole surface.

Task 3.12 must operationalize this.

---

# 91. Batch Corruption

If one day record in a batch is invalid/missing:

* entire batch cannot be treated as authoritative;
* preserve raw evidence;
* do not partially project that batch.

---

# 92. Older Valid Batches

Do not automatically fall back to older authority for affected day if the latest publication is known corrupt.

This would rewrite history.

Return unavailable/protected for affected scope.

---

# 93. Independent Other Days

If corruption affects one batch covering many days, because batch atomicity means whole batch was one publication event, determine whether all days in batch become unavailable.

Strong preference:

> yes, the batch is invalid as a unit.

Earlier/later unrelated batches remain valid.

---

# 94. Quarantine Model

Potential:

* quarantine invalid batch as one component;
* retain raw batch/day physical records;
* valid independent batches remain queryable.

Do not delete automatically.

---

# 95. Unsupported Version

If one batch/domain version unsupported:

* quarantine/protect that batch;
* if it is latest authority for queried day, return unavailable rather than older fallback.

---

# 96. Whole DB Schema Version Error

Protected/unavailable surface.

Do not recreate database.

---

# 97. Protected Mutation Behavior

If HistoricalPlan persistence surface is globally protected:

* do not publish new durable batches that could overwrite/reinterpret state.

Question:
Should current Preview still generate?

Yes.

Preview planning remains independent.

But HistoricalPlan publication mutation should be blocked until recovery.

---

# 98. Runtime Publication During Protection

Preferred:

> do not accept new HistoricalPlan runtime publications while whole surface is protected, because ordering/history continuity cannot be established safely.

Record a durability/publication warning.

Do not invent a separate branch.

---

# 99. Batch-Level Quarantine Coexistence

If only an older independent batch is quarantined but current append ordering/latest publication state remains safely known:

* new publications may proceed.

Define conservatively.

---

# 100. Recovery APIs

Provide explicit HistoricalPlan recovery primitives appropriate to IndexedDB:

* inspect/export protected batch/source evidence;
* remove/abandon quarantined batch only explicitly;
* replace/re-establish surface if whole protection;
* clear HistoricalPlan.

No UI required.

---

# 101. Source Recheck Equivalent

Task 3.3 localStorage protection uses raw-byte source recheck.

IndexedDB needs semantic/physical fingerprint recheck.

Before destructive recovery:

* reread exact affected batch/day records;
* compare stored physical/domain fingerprints;
* if changed, return `sourceChanged`.

No blind overwrite.

---

# 102. Recovery Replace

If whole surface protected and user explicitly replaces with current valid runtime authority:

* source recheck;
* transactional rewrite only as separately authorized recovery;
* reread/validate;
* clear protection after verified success.

However, because append-only HistoricalPlan should not normally rewrite history, consider whether replacement is too destructive.

Task must define carefully.

---

# 103. Recovery Abandon

Explicitly abandon protected HistoricalPlan data and establish empty ledger.

This is destructive but valid user recovery.

No automatic fallback.

---

# 104. Batch Quarantine Removal

If implemented:

* explicit only;
* removing a corrupt batch creates a known history gap;
* future historical queries expose gap;
* no older automatic substitute unless metric/query semantics explicitly allow "latest valid after explicit removal".

Document.

---

# 105. Gap Metadata

Question:
Do we need durable gap records when quarantined/removed publication is abandoned?

Potentially yes.

Otherwise absence could later be mistaken for never-published history.

Task 3.9 says missing publication is unknown/gap, not no plan.

Task 3.12 must decide how explicit gaps survive recovery.

---

# 106. Recommended Gap Model

Strongly consider a separate durable `HistoricalPlanGap`/coverage metadata record for:

* abandoned corrupt publication interval;
* known failed publication if captured;
* migration start boundary.

But this would be a new domain concept not specified in 3.11.

If required for correctness, stop and recommend 3.11A rather than silently inventing it.

---

# 107. Ordinary Write Failure Gap

A runtime failed publication that never becomes durable and then app closes creates an unknowable missing publication unless durable gap metadata existed.

This is difficult.

Task must assess whether current durability warning is sufficient or whether a durable gap marker is required.

---

# 108. No Fabricated Gap Claim

Do not persist a “gap” marker unless failure itself can be durably established.

If storage is unavailable, even gap persistence may fail.

Document inherent limitation.

---

# 109. Ledger Coverage Semantics

Historical metrics later must know:

* first successful durable publication;
* days with valid publication authority;
* protected/quarantined unavailable periods.

Task 3.12 should expose query status, not necessarily solve all future coverage metadata.

---

# 110. Latest-Day Read API

Expose read-only HistoricalPlan API:

```ts
getHistoricalPlanDay(userDayDate, asOf)
```

or equivalent.

Return:

* available;
* unavailableNoPublication;
* unavailableProtected;
* invalid/corrupt.

Reuse Task 3.11 projection semantics where possible.

---

# 111. Range Read API

Expose:

```ts
getHistoricalPlanRange(start, end, asOf)
```

with:

* available days;
* explicit missing days;
* protected/corrupt days status.

Do not flatten all unavailable cases into missing.

---

# 112. Subscription

HistoricalPlan subscribers should receive:

* new accepted publication;
* recovery/clear changes.

Do not send whole multi-year ledger unless necessary.

Could notify invalidation/event and require query.

Choose scalable model.

---

# 113. Recommended Subscription Model

Prefer event/invalidation style:

```text
publicationAccepted
historyCleared
recoveryChanged
```

rather than cloning the whole ledger.

This is the first scalable collection surface.

---

# 114. Read API Clone Isolation

Return clone-isolated domain values.

IndexedDB and Task 3.11 already support this.

---

# 115. Publication Result

Fresh generation publication should return explicit status:

* publishedAndDurable;
* publishedPendingDurability;
* identicalNoOp;
* publicationBlockedProtected;
* materializationUnavailable;
* invalidCandidate;
* persistenceFailed;
* verificationFailed.

Do not confuse Preview generation success with historical publication success.

---

# 116. Preview Generation API Compatibility

Do not make existing UI generation fail merely because historical publication failed.

If store `generatePreview()` currently returns only Preview result, either:

* expose HistoricalPlan durability separately;
* or extend result carefully without breaking callers.

Prefer separate status/subscription.

---

# 117. User Feedback

No new major UI is required.

But HistoricalPlan durability failure should not be completely invisible forever.

Task 3.12 may expose state for later UI.

Do not build historical recovery UI.

---

# 118. Current Preview Staleness

HistoricalPlan publication itself must not mark Preview stale.

---

# 119. HistoricalPlan Does Not Affect Scheduler

No scheduling engine input.

---

# 120. PlanDecision Accept Flow

Accept:

* current decision changes;
* authoritative Preview regeneration occurs;
* new HistoricalPlan batch may publish if semantically changed.

The decision action itself does not publish before regeneration.

---

# 121. PlanDecision Remove Flow

Same.

---

# 122. Try Flow

Try may produce revised Preview geometry.

Never publish.

Accept + regeneration may publish.

---

# 123. Setup Edit

Marks Preview stale.

No publication until regeneration.

---

# 124. Profile Activation

Current authored setup changes/fresh lifetimes.

No historical mutation immediately.

Next fresh Preview generation publishes new plan.

Old HistoricalPlan remains.

---

# 125. Backup V1 Import

Same.

---

# 126. Backup V2 Restore

Same.

Old historical plan remains.

Restored lifetimes may recur in future publications.

No merge/rewrite.

---

# 127. Execution Reporting

No HistoricalPlan publication.

---

# 128. Execution Correction

No publication.

---

# 129. Full Clear

`clearLocalData()` must now include HistoricalPlan IndexedDB surface.

This is the first production IndexedDB consumer, so clear orchestration must expand.

---

# 130. Full Clear Result

Add HistoricalPlan clear status explicitly.

Do not hide failure.

---

# 131. IndexedDB Delete Or Store Clear

Choose:

## A. clear HistoricalPlan stores only

Preserves database for future consumers.

## B. delete entire database

Unsafe once ExecutionHistory later shares DB.

Preferred:

> clear HistoricalPlan stores, not whole DB.

---

# 132. Clear Atomicity

HistoricalPlan batch/day stores must clear atomically if possible.

Use multi-store transaction.

---

# 133. Clear Runtime State

Pending queue/protection/cache cleared only after governed semantics.

If durable clear fails:

* runtime full-clear result must say failure;
* do not pretend restart will stay empty.

Follow existing clear truthfulness.

---

# 134. Export

Expose HistoricalPlan export independent of Backup V3.

Potential:

* validated domain export containing all batches/days;
* or collection stream.

For Task 3.12, a complete semantic export helper is acceptable.

No import.

---

# 135. Export Ordering

Deterministic chronological/order canonical.

---

# 136. Export With Quarantine/Protection

Preserve raw protected evidence where possible.

Do not omit silently.

Domain export of valid history and protected raw export may be separate.

---

# 137. No Backup V3

Do not add HistoricalPlan to Backup yet.

---

# 138. No ExecutionHistory Migration

ExecutionHistory remains localStorage.

---

# 139. IndexedDB Database Upgrade

Task 3.10 production currently has no consumer/store.

Task 3.12 likely introduces first real object stores.

If DB version 1 had no production database opening, schema version may remain 1 if stores are part of initial production schema.

But if version constant/schema already shipped/opened in production code, adding stores requires bump.

Audit exact current behavior.

Task 3.10 says no production consumer opens DB currently.

Therefore likely:

> Task 3.12 establishes the first production schema at physical version 1.

Document.

---

# 140. No Empty Speculative Stores

Only HistoricalPlan stores now.

---

# 141. Store Names

Use explicit stable names.

Potential:

* `historicalPlanBatches`
* `historicalPlanDays`

Avoid generic `records`.

---

# 142. Physical Key Design

Batch:

* keyPath `batchId`.

Day:

* compound primary key `[batchId, userDayDate]`.

Indexes:

* `byUserDayAndPublishedAt`;
* `byPublishedAt`;
* `byBatchId`.

Exact naming may vary.

---

# 143. Compound Index PublishedAt

Index key path:

```text
[userDayDate, publishedAt]
```

This directly supports latest-as-of.

---

# 144. Canonical Time Strings In Index

Canonical UTC ISO strings sort lexicographically chronologically if format is fixed.

Validate before persistence.

---

# 145. LocalDate Index

Canonical YYYY-MM-DD lexical order works chronologically.

---

# 146. IndexedDB Key Compatibility

Compound array of strings is valid.

Direct tests.

---

# 147. Physical Read Validation

Query result wrappers must be validated before domain use.

---

# 148. Orphan Day Record

Day record references missing batch:

* corrupt/quarantine.

Do not project.

---

# 149. Batch Missing Day Record

If batch says range includes date but physical day missing:

* corrupt batch.

---

# 150. Extra Day Record For Batch

If physical store has day outside batch range:

* corrupt batch or orphan evidence.

Do not silently attach.

---

# 151. Duplicate Physical Day

Primary key prevents exact duplicate batch/day.

But differing batch IDs same publication time may still create domain tie conflict.

Task 3.11 collection validation handles.

---

# 152. Startup Full Validation Strategy

Do not necessarily load every historical occurrence on startup.

Possible:

* validate batch metadata/index structure;
* lazily validate day records on query;
* maintain protected index of known corruption.

But append dedup needs latest days.

Task must balance scale and correctness.

---

# 153. Recommended Validation Bias

For V1 initial implementation, if expected ledger size is still moderate:

> full batch/domain validation on startup may be acceptable.

But this undermines IndexedDB scalability.

Better:

* validate stored batch metadata;
* validate batch/day records when queried/used;
* periodically or export validates all.

Task should decide with evidence.

---

# 154. No False Scalability

Do not build IndexedDB and then immediately `getAll()` multi-year ledger on every startup unless explicitly justified as temporary V1 behavior.

---

# 155. Batch Metadata Completeness

Persist enough batch metadata to validate/query without loading all occurrence snapshots.

---

# 156. Fingerprint Cache

May persist Task 3.11 semantic batch/day fingerprint as derived verification/dedup metadata.

Because fingerprint is derived, mismatch requires revalidation.

Do not treat cache as authority.

---

# 157. Latest-Day Dedup Query

On publication:

1. query latest durable day per requested date at candidate `publishedAt`;
2. overlay pending accepted runtime publications;
3. compare Task 3.11 semantic equality;
4. identical all days → no-op;
5. any change → append full batch.

No full scan.

---

# 158. Latest Publication Timestamp

Need to enforce non-monotonic append.

Query latest durable batch publishedAt plus pending queue.

New `publishedAt` must be >= latest according to Task 3.11 rule.

If equal and conflicting, invalid.

---

# 159. Clock Resolution

Two publications may occur within same millisecond if timestamp format uses milliseconds.

Task 3.11 same-time conflict rule could reject legitimate rapid different generations.

Audit constructor timestamp precision.

Potential mitigation:

* monotonic clock allocator at application layer;
* wait/increment;
* higher precision unavailable in JS Date.

Do not silently alter `publishedAt`.

This may be a real implementation issue.

---

# 160. Same-Millisecond Publication Handling

Task 3.12 must decide safe application policy.

Options:

## A. reject second conflicting publication at same canonical instant and require retry later.

## B. inject monotonic timestamp provider that ensures strictly increasing canonical milliseconds.

Preferred:

> monotonic publication clock layered over wall-clock `Date.now()`, preserving actual ordering while ensuring uniqueness.

But Task 3.11 allowed equal-time semantically identical publications.

If introducing monotonic timestamp semantics requires domain change, evaluate carefully.

---

# 161. Monotonic Publication Clock

Could maintain last publication instant in runtime and if current clock <= last:

* use last + 1 ms.

Is this still truthful?

It slightly adjusts recorded publication time.

Alternative:

* publication identity alone could resolve ordering, but domain forbids arbitrary tie.

This warrants explicit result documentation.

If uncomfortable, stop and recommend Task 3.11A.

---

# 162. Preferred Conservative Rule

Do not falsify time automatically unless architecture explicitly accepts monotonic logical timestamping.

Safer:

* if conflicting publication occurs at same `publishedAt`, allocate next clock tick through injected monotonic clock abstraction clearly defined as publication-order timestamp.

Task result must be explicit.

---

# 163. Publication Clock Is Authority

Whatever chosen must preserve strict ordering needed for effective projection.

---

# 164. Pending Queue Ordering

Sort by `publishedAt`, but accepted append sequence also matters.

No lexical UUID tie winner.

---

# 165. Multi-Tab Publication

Task 3.10 does not provide cross-tab authority synchronization.

This becomes relevant now.

Two tabs could publish overlapping days concurrently.

Task 3.12 must audit.

---

# 166. Multi-Tab Risk

Potential:

* both read same latest plan;
* both create different same-time/near-time publications;
* both commit.

IndexedDB transaction protects physical consistency but not semantic concurrency.

Need a strategy.

---

# 167. Multi-Tab V1 Options

## A. explicitly unsupported single-writer assumption

## B. use transactional latest metadata/unique constraint to serialize publications

## C. BroadcastChannel/lock

Prefer narrow storage-level serialization if feasible.

---

# 168. Publication Sequence Metadata

Could maintain an IndexedDB metadata record updated atomically with batch:

* lastPublicationAt;
* perhaps revision counter.

But introducing sequence authority was not in Task 3.11.

Do not use hidden sequence to override domain tie semantics.

May still use metadata only to prevent stale concurrent append.

---

# 169. Optimistic Compare-And-Publish

Within one transaction:

1. read latest metadata/fingerprint for affected days;
2. compare expected latest state;
3. if unchanged, write new batch;
4. otherwise abort and rematerialize/reclassify.

IndexedDB transaction serializes conflicting writes.

Strong candidate.

---

# 170. Domain Candidate Reclassification After Concurrency

If another tab published first:

* reread latest;
* candidate may now be identical or still meaningfully different;
* do not blindly append stale candidate if it no longer represents current publication ordering.

However the candidate did represent a real fresh plan in this tab.

Historical revision ordering across concurrent tabs is tricky.

Task result must bound multi-tab support honestly.

---

# 171. V1 Multi-Tab Determination

If robust cross-tab semantic publication is too broad:

> support safe physical transactions but document HistoricalPlan publication as single-active-tab authority in V1.

Do not claim more.

No corruption should occur; ambiguous semantic ties must still be detected/protected.

---

# 172. Production Publication Service

Create a dedicated service/manager.

Preferred location:

`state/historicalPlanStore.ts`
or
`state/historicalPlanAuthority.ts`

It owns:

* publication orchestration;
* durability;
* pending queue;
* IndexedDB persistence;
* query/recovery APIs.

Do not bury in `dayFrameStore.ts` entirely.

---

# 173. DayFrame Store Integration

Main store may expose:

* generate Preview as before;
* HistoricalPlan accessors/status;
* retry/clear.

But storage manager remains isolated.

---

# 174. Startup Async Boundary

Current store construction may be synchronous while IndexedDB is async.

Task 3.12 must define readiness.

Possible:

* HistoricalPlan authority initializes asynchronously after app start;
* accessors expose `loading/ready/protected/unavailable`.

Do not block store construction with impossible sync assumptions.

---

# 175. Readiness State

HistoricalPlan status should distinguish:

* initializing;
* ready;
* failed/unavailable;
* protected.

Preview generation occurring before initialization completes needs policy.

---

# 176. Generate Before HistoricalPlan Ready

Options:

## A. allow Preview generation, queue publication until ready.

## B. allow Preview, publication skipped with explicit gap warning.

## C. block generation until HistoricalPlan ready.

Preferred:

> allow planning, queue/materialize publication if possible, then persist once authority ready.

But historical dedup requires latest durable state.

Could hold candidate temporarily.

---

# 177. Candidate Queue Before Ready

If fresh Preview generated before DB ready:

* retain exact materialized candidate in runtime;
* once ready, classify against durable latest state and append/persist.

No regeneration.

This preserves truth.

---

# 178. Initialization Failure

Preview still works.

HistoricalPlan publication unavailable/protected.

Expose status.

---

# 179. No Silent Historical Loss

If initialization fails and user generates Preview:

* UI/system must at least retain status that historical publication could not be established.

No plan-history false confidence.

---

# 180. Publication Materialization Timing

Materialize immediately from the fresh Preview while exact context is available.

Do not wait until DB opens if that risks source/Preview mutation.

This is crucial.

---

# 181. Pending Candidate Versus Accepted Publication

Before dedup/append against durable state, a queued candidate is not yet accepted historical authority.

Distinguish:

* candidate;
* accepted pending durable publication.

---

# 182. Initialization Candidate Reclassification

When DB ready:

* compare queued candidate with latest durable state at its `publishedAt`;
* identical → discard as no-op;
* changed → accept append with original batch ID/time;
* invalid ordering → surface conflict/protection.

---

# 183. Multiple Pre-Ready Candidates

Preserve generation order and exact timestamps.

Process sequentially.

Do not collapse to latest because prior plan revisions are historical facts.

---

# 184. Publication Persistence Verification Tests

Directly test:

* full batch commit;
* reread;
* equality;
* no partial batch.

---

# 185. Crash-Like Retry Test

Simulate durable records present but runtime thinks pending.

Retry recognizes exact already-durable batch.

No duplicate.

---

# 186. Failure Then Later Publication Test

A fails durability.
B accepted later.

Pending queue contains both.
Retry A then B.

No history loss.

Mandatory.

---

# 187. Dedup Test

Generate semantically identical fresh Preview twice.

Second creates no HistoricalPlan batch/write.

---

# 188. One-Day Change In Multi-Day Batch

Second generation changes one day.

Full requested-range batch persists.

Mandatory.

---

# 189. Empty Day Test

Requested range includes empty day.

Persisted day record exists with zero occurrences.

---

# 190. Removal Test

Earlier publication contains occurrence.

Later complete day omits it.

Latest indexed query shows absence.

Earlier asOf still shows presence.

---

# 191. Scheduled Revision Test

Time changes.

Latest/asOf behavior correct.

---

# 192. Omission Test

Accepted omit + regeneration publishes omitted state.

---

# 193. Remove Omission Test

Decision removed + regeneration publishes new effective state.

---

# 194. Blocked Test

Publishes blocked state/no interval.

---

# 195. Unplaced Test

Publishes unplaced state.

---

# 196. Work Test

Publishes work reference and interval.

---

# 197. Manual Event Test

Publishes correct containing user day despite reference lacking exact day coordinate.

Mandatory due Task 3.11 discovery.

---

# 198. User-Week Template Test

Publishes correct containing user day.

Mandatory.

---

# 199. Hidden Buffer Test

No out-of-range day publication.

---

# 200. Overnight Test

Correct semantic user day and UTC interval.

---

# 201. Day Boundary Override Test

Frozen effective boundary correct.

---

# 202. WeekStartsOn Override Test

Frozen effective week start correct.

---

# 203. DST Offset Test

Historical offset correct for target day.

---

# 204. Stale Preview Test

No candidate/publication.

---

# 205. Try Preview Test

No publication.

---

# 206. Accept Regeneration Test

Publishes.

---

# 207. Save Setup Test

No publication until regenerate.

---

# 208. Profile Activation Test

No immediate publication; next fresh Preview publishes new lifetime references.

---

# 209. Backup V1 Test

Same.

---

# 210. Backup V2 Test

Same without rewriting old plan.

---

# 211. Execution Report Test

No publication.

---

# 212. Correction/Retraction Test

No publication.

---

# 213. Persistence Failure Test

Preview succeeds.
Runtime HistoricalPlan accepted.
Durability failed/pending.
Retry exact.

---

# 214. Quota Failure Test

Same.

---

# 215. Verification Failure Test

Surface reports failure/protection.

---

# 216. Retry No New ID/Time

Mandatory.

---

# 217. Multiple Pending Batches Test

Mandatory.

---

# 218. Startup Empty Test

Ready empty ledger.

No fabricated backfill.

---

# 219. Startup Existing Test

Indexed queries return exact history.

---

# 220. Startup Corrupt Batch Test

Affected authority protected/quarantined.

No silent fallback.

---

# 221. Latest Corrupt Batch Test

Older valid publication is not silently used as current authority for same day.

Mandatory.

---

# 222. Independent Valid Batch Test

Unaffected days/ranges remain queryable if isolation model allows.

---

# 223. Protected Publication Block Test

Fresh Preview still succeeds, HistoricalPlan publication blocked/status surfaced.

---

# 224. Recovery SourceChanged Test

Destructive recovery refuses if physical records changed.

---

# 225. Recovery Abandon Test

Explicit empty ledger established.

---

# 226. Export Test

Valid ledger export deterministic.

---

# 227. Full Clear Test

HistoricalPlan stores emptied.

Restart historical ledger empty.

Other IndexedDB future stores unaffected.

---

# 228. Full Clear Failure Test

Reported truthfully.

---

# 229. No localStorage HistoricalPlan Test

Search writers.

None.

---

# 230. No ExecutionHistory Migration Test

Existing key/storage unchanged.

---

# 231. No Backup V3 Test

No format change.

---

# 232. No Metrics Test

No historical coverage/follow-through.

---

# 233. No UI Test

No new historical-plan UI.

---

# 234. No Scheduler Behavior Change Test

Schedule output unchanged apart from side-effect publication after successful generation.

---

# 235. Publication Does Not Affect Determinism

Same scheduling inputs produce same Preview regardless of HistoricalPlan storage state.

---

# 236. HistoricalPlan Query APIs

Recommended public APIs:

* `getHistoricalPlanDay({ userDayDate, asOf })`;
* `getHistoricalPlanRange({ startUserDayDate, endUserDayDate, asOf })`;
* `getHistoricalPlanDurabilityStatus()`;
* `subscribeHistoricalPlan(...)`;
* `subscribeHistoricalPlanDurability(...)`;
* `retryHistoricalPlanPersistence()`;
* export/recovery/clear primitives.

Keep API restrained.

---

# 237. No Whole-Ledger Getter By Default

Avoid:
`getAllHistoricalPlan()` for ordinary UI.

Export can enumerate all.

This keeps collection architecture scalable.

---

# 238. Query `asOf` Required

Historical reads require explicit `asOf`.

Do not default to now in core APIs.

Application convenience may pass current canonical time explicitly.

---

# 239. Query Pending Overlay

In-session accepted pending publications must participate in query results before durability succeeds.

HistoricalPlan runtime authority includes them.

---

# 240. Query Protected Latest

If latest known publication for a day is corrupt/protected:

* return unavailableProtected;
* do not use older durable day.

---

# 241. Query Missing Day

No publication:

* unavailableNoPublication.

Not empty.

---

# 242. Query Explicit Empty Day

Publication exists with zero occurrences:

* available empty day.

This distinction is fundamental.

---

# 243. Query Range Gaps

Return:

* available days;
* missing days;
* protected/unavailable days separately.

Do not conflate.

---

# 244. Historical Plan Export

Should distinguish:

* valid batches;
* quarantined/protected raw evidence if applicable.

No silent omission.

---

# 245. Database Close/Test Isolation

Provide test cleanup.

No leaked fake-indexeddb connections causing blocked test suite.

---

# 246. Production Bundle

`fake-indexeddb` remains test-only.

No production import.

---

# 247. Expected Production Files

Likely:

* `code/src/core/historicalPlan/materializePlanPublication.ts`;
* `code/src/state/historicalPlanV1.ts`;
* `code/src/state/historicalPlanPersistence.ts`;
* `code/src/infrastructure/storage/dayFrameDurableDb.ts`;
* `code/src/state/dayFrameStore.ts` integration;
* clear/result types;
* tests.

Potential narrow Task 3.11 helper refactors allowed if semantics unchanged.

---

# 248. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.12_IMPLEMENT_HISTORICALPLAN_V1_INDEXEDDB_PERSISTENCE_PUBLICATION_AUTHORITY_RECOVERY_AND_PREVIEW_PUBLICATION_WIRING_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contracts
4. Initial Preview/Wiring Audit
5. Files Changed
6. Publication Hook
7. Publication Ordering
8. Preview/Publication Failure Separation
9. Physical Database Schema
10. Object Stores
11. Batch Record Shape
12. Day Record Shape
13. Indexes
14. Batch Atomicity
15. Runtime Authority Model
16. Pending Publication Model
17. Desired Durable Condition
18. Multiple Failed Publications
19. Retry Ordering
20. Durability Status
21. Startup/Initialization
22. Async Readiness
23. Pre-Ready Candidate Handling
24. Materialization Module
25. Fresh/Stale/Try Gates
26. Requested-Range Boundary
27. Empty-Day Materialization
28. Scheduled Mapping
29. Unplaced Mapping
30. Omitted Mapping
31. Blocked Mapping
32. Work Mapping
33. Manual Mapping
34. User-Week Template Mapping
35. Duplicate Runtime Representation Handling
36. Effective-State Precedence
37. Day Context
38. UTC/Boundary/Week Context
39. Batch Construction
40. Dedup Against Durable+Pending State
41. No-Op Publication
42. Multi-Day Meaningful Change
43. Persistence Transaction
44. Commit Verification
45. Failure Classification
46. Idempotent Retry
47. Crash/Uncertain-Commit Handling
48. Same-Millisecond Publication Determination
49. Multi-Tab Determination
50. Indexed Latest-Day Queries
51. Indexed Range Queries
52. Pending Overlay Queries
53. Query Gap Semantics
54. Query Protected Semantics
55. Protected Ingress
56. Batch Quarantine
57. Latest-Corrupt No-Fallback
58. Source Recheck
59. Recovery Replace/Abandon Determination
60. Gap Metadata Determination
61. Export
62. Full Clear
63. Profile Activation
64. Backup V1
65. Backup V2
66. PlanDecision Accept/Remove
67. Try
68. Execution Reporting Independence
69. Subscription Model
70. No Whole-Ledger Getter Determination
71. Tests Added
72. Publication Tests
73. Materialization Tests
74. Manual/User-Week Mapping Tests
75. Dedup Tests
76. Atomicity Tests
77. Failure/Retry Tests
78. Pending-Queue Tests
79. Query Tests
80. Corruption/Protection Tests
81. Recovery Tests
82. Clear/Export Tests
83. Lifecycle Tests
84. No-Persistence-Fallback Audit
85. No-ExecutionHistory-Migration Audit
86. No-Backup Audit
87. No-Metrics Audit
88. No-UI Audit
89. Architectural Alignment Assessment
90. Deviations
91. Discoveries and Deferred Work
92. Recommended Task 3.13
93. Focused Validation
94. Full Validation
95. Final Completion Determination

---

# 249. Required Matrices

## A. Publication Trigger Matrix

| Event | Preview changes? | HistoricalPlan publishes? |
| ----- | ---------------: | ------------------------: |

Cover:

* fresh generation;
* stale state;
* Try;
* Accept + regeneration;
* Save Setup;
* Profile activation;
* Backup restore;
* execution report.

## B. Materialization Matrix

| Occurrence/state | Persisted state | Interval? |
| ---------------- | --------------- | --------: |

## C. Durability Matrix

| Event | Runtime authority advances? | Durable state | Retry? |
| ----- | --------------------------: | ------------- | -----: |

## D. Query Matrix

| Durable/pending/corrupt state | Historical day result |
| ----------------------------- | --------------------- |

## E. Cross-Surface Matrix

| Transition | HistoricalPlan effect |
| ---------- | --------------------- |

---

# 250. Validation Requirements

Run focused tests for:

* Preview candidate materialization;
* manual/user-week day mapping;
* fresh/stale/Try gates;
* requested-range/empty days;
* scheduled/unplaced/omitted/blocked;
* work/manual;
* semantic dedup;
* full-range publication;
* atomic IndexedDB write;
* latest-day query;
* range query;
* pending overlay;
* persistence failure;
* quota failure;
* retry;
* multiple pending publications;
* idempotent already-committed retry;
* corrupt latest batch;
* protected ingress;
* recovery;
* export;
* full clear;
* lifecycle transitions.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Full repository suite must pass.

Record exact:

* test-file count;
* test count;
* build module count.

---

# 251. Completion Criteria

Task 3.12 is complete only when:

* HistoricalPlan V1 has a production IndexedDB durable surface;
* physical stores/indexes are explicitly versioned and domain-independent;
* fresh authoritative Preview generation/regeneration is wired as the publication boundary;
* stale and Try Preview never publish;
* Save Setup/profile/backup/execution actions do not publish directly;
* requested visible range, including empty days, materializes completely;
* hidden engine buffers are excluded;
* scheduled/unplaced/omitted/blocked states map truthfully;
* work/manual/template references map lifetime-safely;
* manual and user-week reference forms map to the correct containing user day from fresh Preview evidence;
* publication candidates validate through Task 3.11;
* semantic no-op generations produce no new history;
* any meaningful change creates a full requested-range atomic batch;
* runtime accepted publications remain session authority after persistence failure;
* multiple failed accepted publications are preserved in order;
* retry persists exact original batches without new IDs/timestamps;
* atomic IndexedDB persistence prevents partial batch publication;
* commit is verified by reread/domain validation/semantic equality;
* already-committed uncertain retry does not duplicate publication;
* indexed latest-day/as-of reads work;
* indexed range reads preserve explicit missing days;
* pending runtime publications overlay durable query results;
* explicit empty publication is distinct from no publication;
* corrupt latest authority never silently falls back to older history;
* protected ingress blocks unsafe publication;
* recovery is explicit and source-rechecked;
* full clear includes HistoricalPlan and reports failure truthfully;
* export exists independently of Backup V3;
* HistoricalPlan does not affect scheduler output or Preview freshness;
* ExecutionHistory remains on localStorage;
* Backup V3 is not implemented;
* historical metrics/UI are not implemented;
* no fabricated backfill occurs;
* full validation passes;
* result artifact is complete.

---

# 252. Explicit Non-Goals

Do **not**:

* implement historical reporting coverage;
* implement plan follow-through/adherence;
* implement Progress;
* implement Goals;
* implement learning;
* implement historical plan editing;
* implement Backup V3;
* migrate ExecutionHistory;
* persist old Preview objects wholesale;
* fabricate backfill;
* add imported-calendar historical identity;
* add historical plan UI;
* silently fall back to localStorage;
* silently skip failed publication batches;
* silently use older history when latest is corrupt;
* change HistoricalPlan V1 semantics;
* change ExecutionRecord/ExecutionHistory semantics;
* change DurableOccurrenceReference;
* redesign scheduling.

---

# 253. Stop Conditions

Stop and report if:

* Preview runtime data cannot materialize complete scheduled/unplaced/omitted/blocked day authority without changing accepted engine/replay contracts;
* manual/user-week durable references cannot be mapped safely to containing user day;
* IndexedDB physical schema cannot represent atomic generation batches cleanly;
* multiple pending failed publications cannot be preserved without a new domain concept;
* historical gap correctness requires a new durable gap-record schema not authorized by Task 3.11;
* same-millisecond publication conflicts cannot be governed safely;
* multi-tab concurrency can create unresolved historical authority conflicts that require a separate coordination design;
* async HistoricalPlan initialization cannot coexist safely with synchronous Preview generation;
* full clear cannot coordinate localStorage + IndexedDB truthfully;
* implementation requires ExecutionHistory migration;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest corrective/prerequisite task.

---

# 254. Recommended Follow-On Boundary

If Task 3.12 completes successfully, HistoricalPlan will become a real durable authority surface.

The next task should then migrate the other long-lived Phase 3 collection—ExecutionHistory—onto the same transactional storage foundation before Backup V3.

Recommended:

> **Task 3.13 — Migrate ExecutionHistory V1 from localStorage to IndexedDB with Compatibility, Recovery, and Anti-Resurrection**

That task should include:

* V1 historical localStorage reader;
* transactional IndexedDB authority;
* migration marker/epoch;
* write/reread/verify migration;
* localStorage retention during migration;
* no fallback after IndexedDB authority established;
* preservation of IDs/revisions/quarantine;
* exact retry/recovery;
* full-clear integration;
* restart stability.

It should not change ExecutionRecord semantics or add new UI.

---

# 255. Task Determination

**Authorized:** HistoricalPlan IndexedDB physical schema, publication candidate materialization, fresh authoritative Preview publication wiring, atomic durable batch authority, indexed queries, pending publication durability/retry, protected ingress, batch corruption handling, source-rechecked recovery, export/full-clear integration, subscriptions, and direct regression coverage.

**Not authorized:** historical metrics, historical plan UI/editing, Progress, Goals, learning, Backup V3, ExecutionHistory migration, imported-calendar identity, fabricated backfill, or changes to accepted HistoricalPlan/Execution semantics.

The governing persistence principle is:

> **A published plan becomes historical authority only when DayFrame actually established it as the fresh operative plan. Once accepted, that publication must either remain exact current-session historical authority until it becomes durably committed, or be reported as undurable—never regenerated, silently skipped, partially stored, or replaced by a more convenient reconstruction.**

---

# 256. Final Completion Statement

**Task 3.12 is complete when DayFrame uses the Task 3.10 transactional IndexedDB foundation to persist validated HistoricalPlan V1 generation batches atomically; when every successful fresh authoritative Preview generation/regeneration is materialized over exactly its requested visible user-day range into complete day publications—including empty days and truthful scheduled/unplaced/omitted/blocked/template/work/manual states—while stale, Try-only, no-Preview, hidden-buffer, and unsupported authority are excluded; when runtime HistoricalPlan authority, ordered pending undurable publications, dedicated durability/retry, semantic no-op deduplication, exact idempotent retry, commit/reread/domain verification, indexed latest-day/as-of and range queries, explicit historical gaps, protected/corrupt latest-authority semantics, source-rechecked recovery, export, subscriptions, and full-clear behavior are established; when manual-event and user-week references are proven to map to the correct containing user day from fresh Preview authority; when publication failure never rolls back the operative Preview or invents historical backfill; when corrupt latest history never silently falls back to older authority; when ExecutionHistory remains unmigrated, Backup V3 and historical metrics remain unimplemented, and no scheduling semantics or accepted Phase 2/3 durable contracts are changed; and when complete repository validation passes.**
