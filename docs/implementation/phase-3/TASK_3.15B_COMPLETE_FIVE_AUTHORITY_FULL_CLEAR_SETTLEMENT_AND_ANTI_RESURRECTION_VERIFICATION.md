# Task 3.15B — Complete Five-Authority Full-Clear Settlement and Anti-Resurrection Verification

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded authority-lifecycle correctness, full-clear completion-contract, restart verification, and anti-resurrection regression task.

Task 3.15 identified a confirmed Phase 3 gap in `clearLocalData()`:

> Active, Profiles, PlanDecision, ExecutionHistory, HistoricalPlan, and Preview are all targeted by `clearLocalData()`, but the returned result and aggregate classification remain four-surface-shaped. HistoricalPlan is omitted from the enumerable result, and accepted asynchronous ExecutionHistory clearing can be reported as `partiallyCleared` merely because its durable completion is still pending.

Task 3.15B closes P3-GAP-002.

This task must make full clear truthful across the current five durable authority surfaces while preserving ExecutionHistory anti-resurrection and establishing restart-safe empty authority.

The five durable authority surfaces are:

1. Active
2. Profiles
3. PlanDecision
4. ExecutionHistory
5. HistoricalPlan

Preview is derived and must also be cleared, but it is not a sixth durable authority participant.

---

# 1. Execution Artifact Rules

Before implementation:

1. verify the supplied Task 3.15B artifact is complete;
2. save an immutable project copy;
3. compare copies when both are available;
4. record SHA-256;
5. review:

   * Task 3.15 result;
   * current `clearLocalData()` implementation;
   * ExecutionHistory clear semantics;
   * HistoricalPlan clear semantics;
   * Active/Profile/PlanDecision clear behavior;
   * anti-resurrection marker handling;
   * bootstrap/restart behavior after clear;
   * restore journal/staging ownership;
6. do not modify this task artifact during execution.

Create result:

`docs/implementation/phase-3/TASK_3.15B_COMPLETE_FIVE_AUTHORITY_FULL_CLEAR_SETTLEMENT_AND_ANTI_RESURRECTION_VERIFICATION_RESULT.md`

---

# 2. Purpose

The current clear operation invokes all intended clearing work but does not truthfully represent completion.

Current conceptual problem:

```text
clear Active
clear Profiles
clear PlanDecision
start ExecutionHistory clear
start HistoricalPlan clear
        ↓
aggregate old result shape
        ↓
may say partiallyCleared
even while accepted async clear is merely pending
```

Required model:

```text
begin full clear
        ↓
clear all five durable authorities
        ↓
clear derived Preview
        ↓
observe/await required durable settlement
        ↓
verify anti-resurrection / empty authority
        ↓
return one truthful five-authority result
```

---

# 3. Governing Principle

> **A full-clear result must describe the authority state DayFrame actually established, not merely which synchronous calls returned immediately.**

And:

> **Clearing ExecutionHistory must establish valid empty IndexedDB authority without re-enabling stale legacy history.**

---

# 4. Scope

Task 3.15B includes:

* complete audit of current clear behavior;
* explicit five-authority clear result shape;
* HistoricalPlan inclusion;
* truthful asynchronous settlement;
* ExecutionHistory anti-resurrection preservation;
* HistoricalPlan empty-authority verification;
* Active/Profile/PlanDecision clear verification;
* Preview clearing;
* restart verification;
* no stale authority resurrection;
* restore journal/staging policy verification;
* UI/API compatibility updates where necessary;
* comprehensive focused tests.

It does **not** include:

* historical metrics;
* Goals;
* Progress;
* learning;
* Backup V3 redesign;
* new storage engines;
* new domain versions;
* restore journal redesign;
* cross-tab locking;
* broad UI redesign.

---

# 5. Required Initial Audit

Before coding, trace the complete current `clearLocalData()` path.

Document:

1. every authority it clears;
2. every underlying storage key/store affected;
3. whether each clear is synchronous or asynchronous;
4. current result type;
5. current aggregate classification logic;
6. current caller/UI assumptions;
7. restart behavior after each surface is cleared;
8. marker/migration behavior after ExecutionHistory clear;
9. restore metadata behavior.

Do not begin by changing the result type before understanding the actual clear semantics.

---

# 6. Durable Authority Set

The full-clear completion contract must explicitly represent all five durable authorities:

```text
active
profiles
planDecisions
executionHistory
historicalPlan
```

Do not hide HistoricalPlan as a non-enumerable or secondary property.

---

# 7. Preview

Preview must be cleared as part of full clear.

Because Preview is derived and non-durable:

* it does not need a durable-settlement result;
* its clear should be represented separately or as a guaranteed derived-state effect.

Do not count Preview as one of the five durable authority completion slots.

---

# 8. Full-Clear Result Shape

Introduce an explicit five-authority result.

Conceptually:

```ts
type FullClearAuthorityResults = {
  active: ClearSurfaceResult;
  profiles: ClearSurfaceResult;
  planDecisions: ClearSurfaceResult;
  executionHistory: ClearSurfaceResult;
  historicalPlan: ClearSurfaceResult;
};
```

Exact naming may follow current conventions.

---

# 9. Top-Level Full-Clear Result

Prefer a discriminated result that reflects terminal meaning.

Conceptually:

```ts
type FullClearResult =
  | {
      status: "cleared";
      authorities: FullClearAuthorityResults;
      previewCleared: true;
    }
  | {
      status: "partiallyCleared";
      authorities: FullClearAuthorityResults;
      previewCleared: boolean;
    }
  | {
      status: "failed";
      authorities: FullClearAuthorityResults;
      previewCleared: boolean;
    };
```

If existing result vocabulary differs, preserve compatibility where practical.

Do **not** use `partiallyCleared` merely because an operation is still pending.

---

# 10. Settlement Semantics

A public terminal `clearLocalData()` result should describe **settled authority** unless the API explicitly becomes a two-stage accepted/pending operation.

Preferred:

> `clearLocalData()` becomes asynchronous and awaits the durable clear settlement required to issue a terminal result.

This is likely the cleanest model.

Audit callers before changing the signature.

---

# 11. Alternative Pending Contract

If preserving synchronous/accepted semantics is architecturally required, the result must make pending explicit:

```text
pending
```

must not be folded into:

```text
partiallyCleared
```

The result would then require an observable terminal completion path.

Do not retain ambiguous behavior.

---

# 12. Recommended Contract

Unless repository evidence prevents it:

```ts
await store.clearLocalData()
```

should resolve only when:

* all five durable clear attempts have reached terminal outcomes;
* Preview has been cleared;
* required anti-resurrection state has been verified.

---

# 13. Active Clear

Confirm current Active clear semantics.

Determine whether clear means:

* remove persistence key and install canonical empty/default Active authority;
* replace with initial authored state;
* another established contract.

Preserve current product semantics.

Do not change what "clear Active" means solely to simplify result aggregation.

---

# 14. Profiles Clear

Confirm:

* all saved Profiles are removed;
* quarantine associated with Profiles is cleared according to current authority semantics;
* runtime Profile authority becomes valid empty authority;
* restart does not recreate stale Profiles.

---

# 15. PlanDecision Clear

Confirm:

* accepted decisions removed;
* governed quarantine cleared according to current semantics;
* runtime authority becomes valid empty PlanDecision state;
* restart does not rehydrate stale decisions.

---

# 16. ExecutionHistory Clear

This is the most important participant.

The audit established:

> ExecutionHistory clear replaces established authority with a valid empty established authority and only then removes legacy bytes, preserving anti-resurrection.

Task 3.15B must preserve and prove that behavior.

---

# 17. ExecutionHistory Empty Authority

After successful clear:

```text
IndexedDB authority = valid empty ExecutionHistory
authority mode = established IndexedDB
legacy fallback = prohibited
```

Do not implement clear by simply deleting the IndexedDB database and marker if doing so could make stale legacy localStorage eligible again.

---

# 18. ExecutionHistory Marker

Verify the exact anti-resurrection marker behavior.

After successful clear and restart:

* stale retained or artificially reintroduced legacy ExecutionHistory bytes must not become authority;
* the empty established IndexedDB authority wins.

Mandatory test.

---

# 19. Legacy ExecutionHistory Bytes

Audit whether current clear:

* removes legacy bytes;
* leaves diagnostic residue;
* removes them only after established empty IndexedDB writes.

Preserve the safe ordering.

---

# 20. ExecutionHistory Pending Clear

If the clear surface currently returns accepted `pending` while IndexedDB persistence completes:

Task 3.15B must either:

* await terminal settlement before top-level return;
  or
* represent `pending` explicitly at the top level.

Do not count `pending` as a failure/partial clear.

---

# 21. ExecutionHistory Clear Failure

If durable empty authority cannot be established:

* do not remove anti-resurrection evidence in a way that enables fallback;
* return a truthful failed/partial result;
* preserve the safest existing authority state.

Do not report clear success merely because runtime records were emptied.

---

# 22. HistoricalPlan Clear

Confirm exact current semantics.

After successful clear:

```text
HistoricalPlan durable authority = valid empty ledger
runtime status = ready/healthy empty authority
pending publications = none
```

Do not treat "no query result yet" as equivalent to a verified empty ledger.

---

# 23. HistoricalPlan Settlement

HistoricalPlan's asynchronous clear outcome must be included in the top-level five-authority result.

This directly closes one half of P3-GAP-002.

---

# 24. HistoricalPlan Pending Publications

Before clear, HistoricalPlan may contain accepted pending publication authority.

Clear must define and test what happens to those accepted pending batches.

Expected:

* clear supersedes/removes them;
* no pending publication survives the successful full clear.

Use actual surface semantics.

---

# 25. HistoricalPlan Protection

If HistoricalPlan is whole-source protected, audit whether clear is an authorized recovery operation.

Preserve existing capability.

If clear can recover to valid empty authority:

* terminal result should reflect success after verified clear;
* protection should clear.

If current semantics forbid it, document and preserve.

---

# 26. Active/Profile/PlanDecision Protection

Apply the same audit.

Do not assume protected authority cannot be cleared.

Full clear is often an explicit destructive recovery operation.

Use existing semantics rather than introducing a new policy.

---

# 27. Restore Transaction Barrier

Full clear must remain blocked while a restore transaction or shared authority transaction is active.

Do not allow clear to race cross-storage restore.

Use existing centralized mutation admission.

---

# 28. Bootstrap Readiness

Full clear may run only when allowed by existing readiness/recovery semantics.

Audit whether protected-ready/recovery modes intentionally permit full clear.

Do not bypass central admission.

---

# 29. Restore Journal and Staging

Task 3.15 found:

> ordinary clear cannot run during restore, and no valid idle journal should be discarded by a domain clear.

Verify this remains correct.

Full clear should **not** casually delete an active or unresolved restore journal/staging transaction.

---

# 30. Idle Restore Residue

Audit what happens to orphan/finalized cleanup residue when no restore is active.

Do not expand this task into restore cleanup unless stale restore infrastructure demonstrably affects the authority-clear contract.

Document the current policy.

---

# 31. Preview Clear Timing

Preview should be cleared as part of the runtime transition.

Preferred:

```text
clear begins
    ↓
runtime derived Preview cleared
    ↓
durable clears settle
```

or another existing safe order.

The top-level result must not report `previewCleared: true` unless it actually happened.

---

# 32. No Preview Regeneration

Full clear does not regenerate Preview.

---

# 33. Full-Clear Runtime Authority

After successful full clear, the running application should expose one coherent cleared state.

At minimum:

* Active = cleared/default according to current contract;
* Profiles = empty;
* PlanDecision = empty;
* ExecutionHistory = valid empty established authority;
* HistoricalPlan = valid empty ledger;
* Preview = none.

---

# 34. Shared Authority Transaction

Audit whether multi-surface runtime clear should use the existing shared authority transaction.

Preferred if current clear mutates surfaces independently in a way subscribers can observe as hybrid:

> perform the runtime clear through one authority transaction.

However, do not unnecessarily rewrite clear if existing store-level state update already guarantees coherent visibility and participant clears are asynchronous durability operations.

The result must explicitly determine whether shared runtime transaction integration is needed.

---

# 35. Subscriber Coherence

After successful clear:

a subscriber callback must not observe a permanently hybrid final state.

If clear uses the shared transaction, prove coherent cross-reads.

If runtime authority clears are accepted independently before durability settles, document why that is still correct under current accepted-authority semantics.

---

# 36. Terminal Result Definition

A `cleared` terminal result means:

> The five current durable authorities have each established the intended cleared authority state according to their persistence contracts, and Preview has been cleared.

It does not merely mean:

> clear calls were invoked.

---

# 37. Partial Result Definition

`partiallyCleared` is valid only when:

* at least one authority reached its intended cleared terminal state;
* at least one authority reached a terminal failure/non-clear state.

It must not mean:

* one authority is still pending.

---

# 38. Failed Result Definition

`failed` may be used when no authority was successfully cleared or when existing product result semantics require it.

Document exact classification rules.

---

# 39. Aggregate Classification

Replace removed-count logic that assumes four surfaces.

Preferred conceptual calculation:

```text
terminal success count / 5
terminal failure count / 5
pending count = 0 for terminal result
```

Then:

```text
5 success → cleared
1–4 success + failures → partiallyCleared
0 success → failed
```

Only if this matches existing product semantics.

---

# 40. Result Enumeration

Every authority result must be:

* enumerable;
* serializable if existing result is serialized;
* directly inspectable in tests.

Do not hide HistoricalPlan with `Object.defineProperty(... enumerable: false)` or equivalent compatibility trick.

---

# 41. Backward Compatibility

Audit callers/tests expecting old fields.

If necessary, preserve aliases temporarily, but do not preserve an incorrect four-authority aggregate.

Any compatibility alias must not obscure the new authoritative five-surface result.

---

# 42. UI Caller

Audit the current UI path invoking full clear.

If it expects a synchronous result, update it to await terminal clear if the store API becomes async.

Use existing busy/pending UI patterns.

Do not redesign settings/setup UI broadly.

---

# 43. Duplicate Clear Submission

While full clear is in progress:

* disable or reject duplicate clear action;
* do not start concurrent IndexedDB clears.

Use existing mutation/busy infrastructure where possible.

---

# 44. Clear Busy State

Introduce only the smallest state needed if none currently exists.

Prefer an operation-local UI busy flag over a new durable/domain authority.

---

# 45. Clear Result Messaging

User-facing messaging should distinguish:

* cleared;
* partially cleared;
* failed.

Do not expose internal storage engine names unless current UX already does.

No elaborate recovery UI required.

---

# 46. Restart Verification — Successful Clear

Mandatory integration test:

1. populate all five authorities;
2. create Preview;
3. execute full clear;
4. require terminal `cleared`;
5. restart store;
6. verify all five authorities remain cleared;
7. verify Preview absent.

---

# 47. Restart Verification — ExecutionHistory Anti-Resurrection

Mandatory:

1. establish IndexedDB ExecutionHistory;
2. place stale legacy ExecutionHistory bytes in localStorage;
3. full clear;
4. optionally reinsert stale legacy bytes if needed to stress marker behavior;
5. restart;
6. verify empty IndexedDB authority;
7. verify no stale records resurrect.

---

# 48. Restart Verification — HistoricalPlan

Populate HistoricalPlan batches.

Clear.

Restart.

Query prior published day.

Expected:

* no publication / empty cleared authority according to surface semantics;
* no old batch resurrection.

---

# 49. Restart Verification — Profiles

Populate Profiles.

Clear.

Restart.

Profiles remain empty.

---

# 50. Restart Verification — PlanDecision

Populate accepted/quarantined decisions.

Clear.

Restart.

No stale decisions/quarantine rehydrate unless current clear intentionally preserves quarantine—which should be documented.

---

# 51. Restart Verification — Active

Populate authored Active state.

Clear.

Restart.

Verify the exact cleared/default Active state required by existing contract.

---

# 52. Pending Durability Before Clear

Test full clear while ExecutionHistory/HistoricalPlan have accepted pending authority.

Successful clear must supersede that pending authority and settle to cleared durable state.

No pending pre-clear record/batch may reappear after restart.

---

# 53. Failed Durability Before Clear

If a surface currently has failed persistence but accepted authority:

clear should follow its recovery-capable clear semantics.

Test where infrastructure injection makes this practical.

---

# 54. Protected Authority Before Clear

Where current surface supports recovery clear:

test protected → clear → healthy empty authority.

Do not invent recovery support where none exists.

---

# 55. Clear Failure Injection — ExecutionHistory

Inject IndexedDB clear/write failure.

Assert:

* terminal top-level result is not `cleared`;
* marker/legacy behavior remains safe;
* restart does not incorrectly claim empty clear if durability failed.

---

# 56. Clear Failure Injection — HistoricalPlan

Inject persistence failure.

Assert:

* HistoricalPlan result is included and terminally failed;
* top-level aggregate is truthful;
* no false `cleared`.

---

# 57. Clear Failure Injection — Local Authorities

Inject localStorage failure for Active/Profile/PlanDecision individually if current test seams permit.

Verify aggregate classification.

---

# 58. Mixed Result Test

For example:

```text
Active success
Profiles success
PlanDecision success
ExecutionHistory success
HistoricalPlan failure
```

Expected:

```text
partiallyCleared
```

HistoricalPlan must be visible in the result.

---

# 59. No Pending-as-Partial Test

Simulate delayed ExecutionHistory durability with eventual success.

Before settlement, top-level terminal result must not be returned as `partiallyCleared`.

After settlement:

```text
cleared
```

Mandatory.

This directly closes the other half of P3-GAP-002.

---

# 60. Delayed HistoricalPlan Clear Test

Same principle.

---

# 61. Concurrent Settlement

ExecutionHistory and HistoricalPlan clears may run concurrently if safe.

Await both deterministically.

Do not use fixed arbitrary sleeps.

---

# 62. Deterministic Completion

Use:

* returned persistence promise;
* explicit durability subscription;
* injectable completion control;
* another deterministic mechanism.

Do not rely on:

```text
setTimeout(10)
```

This is particularly important given P3-GAP-003, though that separate test cleanup remains Task 3.15C.

---

# 63. No Arbitrary Sleeps in New Tests

Mandatory.

---

# 64. Clear and Backup V3

After successful full clear:

* Backup V3 export should represent the cleared authorities truthfully;
* no stale HistoricalPlan/ExecutionHistory should appear.

Add focused test if practical.

---

# 65. Backup Restore After Clear

A later Backup V3 restore should still be able to repopulate all five authorities.

Do not weaken restore infrastructure.

A focused regression may be appropriate.

---

# 66. Clear and Historical Reporting

After successful full clear:

* prior HistoricalPlan occurrences are no longer reportable because the plan history authority was intentionally cleared.

This is expected destructive behavior.

Do not leave stale UI rows cached.

---

# 67. Historical Reporting UI Refresh

If current UI has loaded a HistoricalPlan day when full clear occurs:

audit whether normal store/subscription changes cause it to refresh.

Fix only if the new 3.15A UI can display stale historical authority after a successful clear.

This is in scope because full clear must have truthful user-visible effect.

---

# 68. Summary After Clear

OutcomeSummary should naturally become empty because ExecutionHistory is cleared.

No Summary-specific mutation.

---

# 69. Current Preview Coverage After Clear

Preview is cleared, so current Preview coverage should become unavailable/empty according to current semantics.

---

# 70. No HistoricalPlan Publication

Full clear must not publish an empty HistoricalPlan batch.

Cleared authority is not a planning publication.

Mandatory test.

---

# 71. No Execution Evidence

Full clear must not create an ExecutionHistory record.

Mandatory.

---

# 72. No New Domain IDs

Clearing should allocate no historical/execution/decision/profile identities unless existing Active default reconstruction legitimately creates fresh authored identity under its already accepted semantics.

Audit.

Do not add IDs merely to represent clear completion.

---

# 73. No Domain Retimestamp

Do not retimestamp surviving domain authority because full clear ran.

Deleted authority is gone.

Infrastructure clear timestamps may exist only if already part of persistence metadata.

---

# 74. Restore Infrastructure Isolation

Full clear does not erase unresolved restore evidence.

If a restore is active or recoveryRequired:

* central admission/protection governs behavior;
* do not bypass it.

---

# 75. Cross-Tab Scope

No new cross-tab clear serialization.

Preserve current single-active-tab limitations.

---

# 76. Result Type Tests

Add unit/type tests ensuring all five authority fields are part of the public result.

---

# 77. Enumerable HistoricalPlan Test

Explicitly prove:

```ts
Object.keys(result.authorities)
```

or equivalent contains HistoricalPlan.

If result is flat, prove the flat enumerable property exists.

---

# 78. Result Count Tests

No hard-coded `4`.

Use the explicit five-authority set.

---

# 79. Existing Clear Tests

Audit all existing tests that assert:

* removed count;
* partial status;
* surface results.

Update them deliberately rather than loosening assertions.

---

# 80. Current Callers

Search for:

```text
clearLocalData
partiallyCleared
removedCount
executionHistory
historicalPlan
```

Audit every caller.

---

# 81. Old Aggregate Compatibility

If `removedCount` remains for UI/backward compatibility:

* it must reflect all five durable authorities;
* define whether it counts terminally cleared authorities;
* it must never silently exclude HistoricalPlan.

Preferred long-term design may use structured results rather than a scalar count.

---

# 82. Clear Result Naming

Do not name a result `removed` if a surface establishes canonical empty durable authority rather than physically deleting storage.

Prefer semantic language:

* cleared;
* settled;
* authorityCleared.

Use current public vocabulary carefully.

---

# 83. Storage Delete vs Authority Clear

Document this distinction in the result:

> Full clear is a domain-authority operation. A surface may establish empty authority by replacement rather than physical deletion.

Especially important for ExecutionHistory anti-resurrection.

---

# 84. Full-Clear Matrix

Required result matrix:

| Authority        | Runtime action | Durable action | Terminal verification | Restart expectation |
| ---------------- | -------------- | -------------- | --------------------- | ------------------- |
| Active           |                |                |                       |                     |
| Profiles         |                |                |                       |                     |
| PlanDecision     |                |                |                       |                     |
| ExecutionHistory |                |                |                       |                     |
| HistoricalPlan   |                |                |                       |                     |
| Preview          | clear derived  | none           | runtime none          | absent              |

Populate from actual implementation.

---

# 85. Clear Result Matrix

Required:

| Surface outcome combination | Top-level status                          |
| --------------------------- | ----------------------------------------- |
| all five success            | cleared                                   |
| success + terminal failures | partiallyCleared                          |
| all failures                | failed                                    |
| any still pending           | no terminal result yet / explicit pending |

Use exact implemented terminology.

---

# 86. Anti-Resurrection Matrix

Required:

| State                           | Legacy bytes | IndexedDB authority | Marker | Restart result |
| ------------------------------- | ------------ | ------------------- | ------ | -------------- |
| before established clear        |              |                     |        |                |
| after successful clear          |              |                     |        |                |
| stale legacy bytes reintroduced |              |                     |        |                |
| clear persistence failure       |              |                     |        |                |

---

# 87. Required Architectural Invariants

At completion prove:

1. Full clear explicitly covers all five durable authorities.
2. HistoricalPlan is enumerable in the public result.
3. Preview is cleared but is not counted as a durable authority.
4. Terminal success means five settled clear outcomes, not five invoked calls.
5. `pending` is never misclassified as `partiallyCleared`.
6. ExecutionHistory clear establishes valid empty IndexedDB authority.
7. ExecutionHistory anti-resurrection remains effective after clear.
8. Stale legacy ExecutionHistory cannot resurrect after restart.
9. HistoricalPlan clear establishes valid empty durable authority.
10. Pending HistoricalPlan publications do not survive successful clear.
11. Active/Profile/PlanDecision restart in their intended cleared states.
12. Successful full clear survives restart.
13. Mixed terminal success/failure returns truthful partial status.
14. HistoricalPlan failure can prevent top-level `cleared`.
15. ExecutionHistory failure can prevent top-level `cleared`.
16. No new plan publication is created by clear.
17. No execution evidence is created by clear.
18. Full clear obeys readiness/restore/authority-transaction barriers.
19. Unresolved restore journal/staging is not casually discarded.
20. Backup V3 after clear cannot contain stale pre-clear historical authority.
21. HistoricalPlan-backed reporting cannot continue using stale pre-clear history.
22. No new domain/storage version is required.

---

# 88. UI/API Integration

If `clearLocalData()` becomes asynchronous:

* update production callers to await it;
* expose a clear-in-progress state;
* prevent duplicate clear submission;
* preserve current confirmation behavior;
* render terminal success/partial/failure accurately.

Do not redesign setup/settings.

---

# 89. Accessibility

If UI busy/result behavior changes:

* status text must be readable;
* destructive action remains clearly labelled;
* disabled/busy state is conveyed semantically;
* no color-only success/failure.

---

# 90. Governance Updates

After implementation and full validation, update as appropriate:

* `CURRENT_STATE.md`;
* `DECISIONS.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

State precisely:

> Full clear now settles and reports all five durable authorities and preserves ExecutionHistory anti-resurrection across restart.

Do not claim Phase 3 is complete yet.

P3-GAP-003 and P3-GAP-004 still belong to Task 3.15C.

---

# 91. Checkpoint

Create:

`docs/checkpoints/CHECKPOINT_Phase_3_Five_Authority_Full_Clear.md`

Include:

1. five-authority scope;
2. terminal settlement semantics;
3. ExecutionHistory empty-established authority;
4. anti-resurrection;
5. HistoricalPlan empty authority;
6. Preview clear;
7. partial-failure semantics;
8. restart behavior;
9. restore isolation;
10. invariants.

---

# 92. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.15B_COMPLETE_FIVE_AUTHORITY_FULL_CLEAR_SETTLEMENT_AND_ANTI_RESURRECTION_VERIFICATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Governing P3-GAP-002
4. Initial Full-Clear Audit
5. Files Changed
6. Previous Result Contract
7. New Five-Authority Result Contract
8. Active Clear
9. Profiles Clear
10. PlanDecision Clear
11. ExecutionHistory Clear
12. ExecutionHistory Empty Authority
13. Anti-Resurrection Marker
14. Legacy ExecutionHistory Evidence
15. HistoricalPlan Clear
16. HistoricalPlan Empty Authority
17. Pending HistoricalPlan Handling
18. Protection/Recovery Clear Semantics
19. Preview Clear
20. Settlement Model
21. Async API Determination
22. Aggregate Classification
23. HistoricalPlan Enumerability
24. Removed Count Compatibility
25. Mutation Admission
26. Restore Isolation
27. Runtime Coherence
28. Subscriber Behavior
29. Successful Restart
30. ExecutionHistory Restart
31. HistoricalPlan Restart
32. Active/Profile/PlanDecision Restart
33. Pending-Before-Clear Test
34. Failure Injection
35. Mixed Result
36. No-Pending-As-Partial
37. Deterministic Completion
38. Backup V3 After Clear
39. Historical Reporting After Clear
40. Summary/Preview After Clear
41. No Publication/Event Side Effects
42. Tests Added
43. Result-Type Tests
44. Anti-Resurrection Tests
45. Restart Tests
46. Failure Tests
47. UI/API Tests
48. Accessibility
49. No Persistence/Domain Version Audit
50. Governance Updates
51. Checkpoint
52. Architectural Alignment Assessment
53. Deviations
54. Discoveries and Deferred Work
55. P3-GAP-002 Closure Determination
56. Focused Validation
57. Full Validation
58. Final Completion Determination

---

# 93. Focused Validation

Run focused tests for:

* full-clear result typing;
* five-authority enumeration;
* asynchronous settlement;
* delayed ExecutionHistory clear;
* delayed HistoricalPlan clear;
* successful clear;
* mixed clear;
* ExecutionHistory failure;
* HistoricalPlan failure;
* anti-resurrection after clear;
* stale legacy-byte restart;
* HistoricalPlan restart;
* pending authority before clear;
* Backup V3 after clear;
* HistoricalPlan reporting after clear;
* UI clear flow.

No arbitrary sleeps.

---

# 94. Full Validation

Run:

```text
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Full suite must pass unless the already-identified unrelated P3-GAP-003 fixed-delay test flakes again.

If that known test fails:

* record it exactly;
* do not modify it solely under 3.15B unless your changes directly touch its timing;
* Task 3.15C remains responsible for deterministic cleanup.

Record:

* test-file count;
* test count;
* build module count;
* warnings.

---

# 95. Stop Conditions

Stop and report if:

* ExecutionHistory cannot expose deterministic clear settlement without redesigning its persistence contract;
* HistoricalPlan cannot expose deterministic clear settlement without redesigning its persistence contract;
* preserving anti-resurrection requires changing ExecutionHistory domain schema;
* a truthful five-authority result would require changing Backup V3 or restore transaction architecture;
* full clear cannot safely await both IndexedDB participants because of an architectural deadlock;
* protected-source clear semantics are undefined and materially block a terminal contract;
* successful clear cannot be proven restart-stable;
* fixing full clear requires a new persistence version.

Do not preserve the incorrect four-authority result merely for compatibility.

---

# 96. Follow-On Boundary

If Task 3.15B completes successfully:

> **Proceed to Task 3.15C — Stabilize Phase 3 Validation and Reconcile Governance.**

Task 3.15C should then:

* replace the fixed-delay ExecutionHistory durability assertion;
* require a fully green deterministic repository baseline;
* reconcile superseded CURRENT_STATE/ROADMAP prose;
* make no new product semantics.

Do not begin historical metrics.

---

# 97. Task Determination

**Authorized:** truthful five-authority full-clear result semantics, asynchronous settlement where required, HistoricalPlan result inclusion, ExecutionHistory anti-resurrection verification, restart-stable empty authority, Preview clear integration, minimal caller/UI adaptation, and comprehensive clear/failure/restart tests.

**Not authorized:** metrics, Goals, Progress, learning, Backup V3 redesign, restore redesign, new persistence/domain versions, broad UI changes, cross-tab locking, or unrelated cleanup.

The governing completion principle is:

> **A destructive reset is only as trustworthy as its completion contract. DayFrame must not say that five-authority history has been cleared merely because clear operations were started, nor say that clearing was partial merely because durable work was still settling. A successful full clear must establish one restart-stable empty authority across all five durable surfaces while preserving the very anti-resurrection rules that prevent old history from returning.**

---

# 98. Final Completion Statement

**Task 3.15B is complete when DayFrame's full-clear operation explicitly includes Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan as five enumerable durable authority outcomes; when Preview is cleared as derived state without being miscounted as a sixth authority; when the public clear contract waits for or otherwise truthfully represents asynchronous IndexedDB settlement so that `pending` is never misclassified as `partiallyCleared`; when terminal `cleared` means all five authorities have actually established their intended cleared state; when mixed terminal outcomes produce an accurate partial result; when ExecutionHistory clearing establishes valid empty IndexedDB authority while preserving the anti-resurrection marker and preventing stale legacy history from returning after restart; when HistoricalPlan clearing establishes a valid empty ledger with no surviving pending publication or historical occurrence; when Active, Profiles, and PlanDecision remain cleared across restart; when a complete successful clear survives application restart with all five authorities empty according to their accepted semantics and Preview absent; when failure injection proves neither ExecutionHistory nor HistoricalPlan can be silently omitted from aggregate truth; when full clear continues to obey readiness, protection, restore, and shared-authority transaction barriers and does not casually discard unresolved restore evidence; when clear creates no HistoricalPlan publication or ExecutionHistory event and introduces no new domain identity, storage surface, or version; when callers and UI accurately await/display the terminal result; when Backup V3 and HistoricalPlan-backed reporting cannot expose stale pre-clear history; when comprehensive focused and full repository validation passes or the already-assigned unrelated timing flake is recorded under Task 3.15C; and when P3-GAP-002 is demonstrably closed without introducing historical metrics, Goals, Progress, learning, restore redesign, or unrelated behavior.**
