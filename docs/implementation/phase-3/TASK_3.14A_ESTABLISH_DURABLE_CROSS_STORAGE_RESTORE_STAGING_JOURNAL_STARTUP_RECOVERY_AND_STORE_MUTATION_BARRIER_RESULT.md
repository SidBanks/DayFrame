# Task 3.14A Result — Durable Cross-Storage Restore Foundation

## 1. Executive Result

Task 3.14A was stopped at its explicit application-bootstrap stop condition. The current synchronous store construction path exposes Active/Profile/PlanDecision authority before an asynchronous IndexedDB restore journal can be recovered, while ExecutionHistory and HistoricalPlan begin initialization from their constructors. Making recovery precede ordinary authority availability, and suppressing hybrid notifications across five independently observable surfaces, requires a shared async readiness/bootstrap and notification-transaction boundary that does not currently exist. No partial staging/coordinator implementation was added because it could not satisfy the governing interruption-safety invariant.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/3fbf4d49-6d20-4fe2-8ea0-d6b1fbd8ad24/pasted-text.txt`
- Saved artifact: `docs/implementation/phase-3/TASK_3.14A_ESTABLISH_DURABLE_CROSS_STORAGE_RESTORE_STAGING_JOURNAL_STARTUP_RECOVERY_AND_STORE_MUTATION_BARRIER.md`
- SHA-256: `288ff6eea3b0f0baeaf9125d91a42fc4f79d2350c73067cd79991f6958e45c21`
- Supplied and saved copies are byte-identical (`cmp` exit status 0).
- Size: 46,189 bytes and 2,227 lines.
- Required title, metadata, sections, stop conditions, determination, and final statement are present.
- The immutable task artifact was not modified.

## 3. Governing Task 3.14 Stop Condition

Task 3.14 correctly stopped because no failure-safe durable staging/journal prerequisite existed. Task 3.14A authorizes that prerequisite, but separately requires stopping if early recovery cannot precede ordinary authority use without a broad application-bootstrap rewrite, or if coherent notification suppression requires broad state-management redesign. Both conditions were found.

## 4. Initial Startup Audit

`createDayFrameStore()` is synchronous. It reads Active and Profiles immediately, constructs PlanDecision (which reads localStorage), constructs ExecutionHistory and HistoricalPlan, and returns the full mutable store. Both collection surfaces invoke asynchronous initialization with `void initialize...()` during construction. `DayFrameApp` creates the store synchronously during render and immediately calls its state/read/subscription APIs. There is no app bootstrap promise, readiness gate, restore-protected shell, shared participant registry, global mutation interceptor, or shared notification transaction.

## 5. Files Changed

Only this result artifact was added. No production code, tests, governance documents, or immutable task documents were changed.

## 6. Restore Bootstrap Coordinator

Not implemented. A coordinator created after the current participants would already be too late to meet the required ordering.

## 7. Bootstrap Ordering

The current order is incompatible with the contract: synchronous local ingress and public store exposure occur before async IndexedDB inspection can complete. Gating individual mutators after construction would still expose pre-recovery reads and subscriptions.

## 8. RestoreTransactionId

Not introduced. UUID allocation is straightforward but would not resolve the blocking lifecycle issue.

## 9. Journal Version

Not introduced.

## 10. Journal Location

The audited design choice remains a small strict localStorage journal, discoverable synchronously before participant readiness.

## 11. Journal Shape

The future journal should contain infrastructure metadata only: app/version, transaction ID, stage, mode, target/recovery fingerprints, staging references, and source fingerprints.

## 12. Journal Validation

Not implemented. It must be exact-key and reject unknown versions, stages, or inconsistent references into protected recovery-required state.

## 13. Restore Stage Machine

Not implemented. The task’s prepared, staged, indexedDbCommitted, localStorageCommitted, verified/finalizing, and rollback stages remain the appropriate finite model.

## 14. IndexedDB Schema Upgrade

Not performed. Current physical version is 2 and contains only live HistoricalPlan and ExecutionHistory stores.

## 15. Staging Stores

Missing. The recommended future additive stores are opaque restore metadata and payload stores keyed by transaction, side, and participant.

## 16. Target Staging

Not implemented.

## 17. Recovery Staging

Not implemented.

## 18. localStorage Staging

Not implemented. A single exact-key temporary envelope remains preferable.

## 19. Temporary Capacity Safety

Cannot be proved without durable target and recovery staging. No destructive mutation was added.

## 20. Participant Adapter Boundary

Missing. Existing surfaces expose domain workflows and reads, not a uniform readiness/capture/recheck/exact-replace/runtime-install/notification-suspension contract.

## 21. IndexedDB Participant Group

ExecutionHistory and HistoricalPlan share the same durable database and low-level `mutate` can span their stores. A combined transaction is technically feasible once governed physical-record adapters exist.

## 22. localStorage Participant Group

Active, Profiles, and PlanDecision use separate keys and separate state modules. There is no coordinated exact-replacement or runtime-install boundary.

## 23. Combined IndexedDB Replace

Not implemented. The low-level transaction primitive is adequate, but the two surfaces keep physical wrapper creation/validation and runtime state privately and independently.

## 24. Combined IndexedDB Rollback

Not implemented.

## 25. HistoricalPlan Exact Replace

Missing. Existing `publish` and `clearHistoricalPlan` have semantic events and are unsuitable for silent exact restore.

## 26. ExecutionHistory Exact Replace

Existing `replaceAuthority` replaces ExecutionHistory independently, not in the required combined transaction and notification barrier.

## 27. Active Exact Replace

Missing as a dedicated infrastructure participant operation. Existing V2 backup import is a synchronous Active-only workflow.

## 28. Profiles Exact Replace

Missing. Ordinary profile operations carry lifecycle and persistence semantics.

## 29. PlanDecision Exact Replace

Missing. Ordinary accept/remove workflows are not exact restoration primitives.

## 30. Source Fingerprints

Individual modules use several local equality/source checks, but no five-participant canonical fingerprint registry exists.

## 31. Source Recheck

Cannot cover all five authorities through one boundary today. IndexedDB source recheck also requires querying live rows rather than cached runtime state.

## 32. Mutation Barrier

Missing. There is no single store-level mutation authority covering methods spread across the store and two composed surfaces.

## 33. Barrier Coverage

Meeting required coverage would change many existing result unions and guard authored setters, profile workflows, PlanDecision workflows, execution reporting/recovery, HistoricalPlan publication/recovery, Preview generation, full clear, and backup operations.

## 34. Notification Barrier

Missing. Authored state, durability, ingress, PlanDecision, ExecutionHistory, and HistoricalPlan each own independent listener sets.

## 35. Notification Release

No shared batching/deferred-release API exists. Adding isolated suppression booleans would not guarantee a coherent cross-surface release.

## 36. Journal Write Ordering

Not implemented. No live mutations were introduced.

## 37. Restore Commit Sequence

Not implemented because startup ordering and notification coherence cannot currently be guaranteed.

## 38. IndexedDB Commit Failure

The existing low-level multi-store transaction can preserve old IndexedDB authority on abort, but no combined participant commit uses it.

## 39. IndexedDB Verification Failure

No combined recovery snapshot/rollback boundary exists.

## 40. localStorage Commit Failure

Without a journal resolved before public store readiness, a crash during three-key replacement would expose a hybrid state on restart.

## 41. Roll-Forward Policy

The future policy should roll forward after verified IndexedDB target commit when complete target staging remains valid.

## 42. Rollback Policy

Rollback should occur only from complete, validated recovery staging when target roll-forward is impossible.

## 43. Rollback Verification

Not implementable through current participant APIs as a coordinated whole-authority reread.

## 44. Rollback Failure

No durable app-level protected restore state exists.

## 45. Recovery-Required State

Missing. Current protected states are surface-specific and cannot represent cross-surface restore uncertainty.

## 46. Startup Recovery

Blocked by the synchronous construction contract. Recovery requires IndexedDB and therefore cannot finish before the current factory returns and the UI consumes the store.

## 47. prepared Recovery

Not implemented. Expected action: verify no live mutation, then safely abandon or resume staging.

## 48. staged Recovery

Not implemented. Expected action: source recheck and resume target commit.

## 49. indexedDbCommitted Recovery

Not implemented. Expected action: validate target staging and roll forward.

## 50. localStorageCommitted Recovery

Not implemented. Expected action: verify/repair target and finalize.

## 51. verified/finalized Recovery

Not implemented. Cleanup must be authority-neutral and retryable.

## 52. Missing Staging

Future behavior must protect and preserve evidence; never guess old versus new.

## 53. Orphan Staging

Future behavior should ignore it as authority and conservatively retain it unless unreferenced cleanup is proven safe.

## 54. Whole Target Fingerprint

Not implemented.

## 55. Whole Recovery Fingerprint

Not implemented.

## 56. Clone Isolation

Not implemented. Future opaque payload staging must clone on ingress and egress.

## 57. Staging Cleanup

Not implemented.

## 58. Cleanup Failure

Future cleanup failure after verified commit must not undo good authority; journal/finalizing evidence should enable retry.

## 59. Runtime Target Installation

Blocked by the absence of a participant/runtime transaction boundary.

## 60. Runtime Recovery Installation

Blocked for the same reason.

## 61. Ordinary Restore Readiness

Future participant readiness should reject initializing, pending, unavailable, busy, or protected authority.

## 62. Protected Recovery Replacement

Must remain an explicit mode with raw evidence availability and exact source recheck.

## 63. Pending-State Policy

Ordinary restore should reject pending participants. 3.14A must not attempt to serialize private pending queues.

## 64. Cross-Tab Determination

No global cross-tab lock exists. A first version may document single-active-tab support with immediate source rechecks and IndexedDB transaction atomicity, but that does not solve the in-process bootstrap blocker.

## 65. ExecutionHistory Anti-Resurrection Preservation

Existing marker behavior is separate from the IndexedDB transaction. Exact target and recovery adapters must capture, commit, and verify it with the local phase.

## 66. HistoricalPlan Publication-Event Isolation

Current exact replacement primitive is absent. Restore must not use `publish` or emit `publicationAccepted`.

## 67. DB Upgrade Preservation

No schema upgrade occurred, so existing collection data was not placed at risk.

## 68. Tests Added

None. No unsafe partial production contract was added.

## 69. Staging Tests

Not added.

## 70. Journal Tests

Not added.

## 71. Commit/Abort Tests

Not added.

## 72. Crash/Restart Tests

Not added; these specifically depend on the missing bootstrap boundary.

## 73. Roll-Forward Tests

Not added.

## 74. Rollback Tests

Not added.

## 75. Source-Recheck Tests

Not added.

## 76. Barrier Tests

Not added.

## 77. Subscriber-Coherence Tests

Not added; coherent batching is the identified blocker.

## 78. Exact-Replacement Tests

Not added.

## 79. Cleanup Tests

Not added.

## 80. No-Backup-V3 Audit

No Backup V3 schema, dispatch, reader, writer, or UI was introduced.

## 81. No-Domain-Change Audit

No domain versions, identities, timestamps, ExecutionHistory semantics, or HistoricalPlan semantics changed.

## 82. Architectural Alignment Assessment

Stopping is required for alignment. Adding physical staging stores without a recovery-first bootstrap would create durable evidence that the running app ignores at exactly the moment it matters. Adding per-surface notification suppression without a shared transaction would still permit hybrid observation.

## 83. Deviations

The authorized implementation was not completed because two explicit stop conditions were met. No scope expansion occurred.

## 84. Discoveries and Deferred Work

- The storage layer already supports atomic mutations across multiple IndexedDB stores.
- Physical staging can be additive, but cannot become safe authority infrastructure until bootstrap recovery owns readiness.
- `DayFrameApp` and extensive tests rely on immediate synchronous store construction.
- Both collection surfaces self-initialize, preventing a coordinator from being the first async authority action.
- Public operation result types generally lack a common restore-busy case.
- Listener sets are privately owned by each surface and cannot be coherently flushed by the current store composition model.

## 85. Resume Task 3.14 Recommendation

Do not resume Task 3.14 yet. First implement the narrower architectural prerequisite: **Task 3.14A.1 — Establish Async Store Bootstrap Readiness and a Shared Authority Transaction Boundary**. It should preserve synchronous factory compatibility by returning a gated store shell, move collection initialization under one bootstrap promise, expose readiness/recovery-protected status, centralize mutation admission, and provide begin/commit/abort notification batching across composed surfaces. It must not add restore staging or Backup V3. After that, resume 3.14A for journal/staging/recovery.

## 86. Focused Validation

Read-only inspection verified artifact integrity, Task 3.14’s stopped result, store construction order, UI construction use, surface self-initialization, listener ownership, store composition, persistence keys, and IndexedDB multi-store capability.

## 87. Full Validation

Not run because no executable code changed. The result artifact was checked with `git diff --check`; claiming prior suite counts as current validation would be misleading.

## 88. Final Completion Determination

**Stopped — narrower bootstrap prerequisite required.** Task 3.14A is not complete. Early journal recovery cannot run before ordinary authority is externally usable without changing the synchronous application bootstrap/readiness contract, and subscriber batching cannot prevent hybrid authority without a shared state-management transaction boundary. These are explicit Task 3.14A stop conditions.

## Required Matrices

### Journal Stage Matrix

| Stage | Live mutation occurred? | Required startup action |
| --- | ---: | --- |
| prepared | No | Verify/clear incomplete work or resume staging |
| staged | No | Recheck source and resume commit |
| indexedDbCommitted | Collection target only | Roll forward from target staging |
| localStorageCommitted | All target writes attempted | Verify/repair target, then finalize |
| verified/finalizing | Verified target | Finish cleanup only |
| rollback stage | Possibly | Resume and verify recovery install |

### Failure Recovery Matrix

| Failure point | Target staged? | Recovery staged? | Preferred action |
| --- | ---: | ---: | --- |
| Before staging | No | No | Leave authority untouched |
| Staging/quota | Partial | Partial | Leave authority untouched; clean safe orphans |
| Source recheck | Yes | Yes | Abort before live mutation |
| IndexedDB transaction | Yes | Yes | Verify old authority; abort |
| IndexedDB verification | Yes | Yes | Atomic rollback from recovery |
| localStorage commit | Yes | Yes | Journaled roll forward |
| Roll-forward unavailable | Invalid/missing | Yes | Verified rollback |
| Rollback failure | Any | Any | Protected recovery-required |

### Participant Matrix

| Participant | Storage | Exact replace supported? | Notification barrier? |
| --- | --- | ---: | ---: |
| Active | localStorage/runtime | No dedicated adapter | No |
| Profiles | localStorage/runtime | No dedicated adapter | No |
| PlanDecision | localStorage/runtime | No dedicated adapter | No |
| ExecutionHistory | IndexedDB/runtime | Independent only | No shared barrier |
| HistoricalPlan | IndexedDB/runtime | No | No shared barrier |

### Mutation Barrier Matrix

| Operation | Allowed during restore? |
| --- | ---: |
| Authored mutation | No |
| Profile save/load/delete | No |
| PlanDecision accept/remove/retry | No |
| Preview generation/publication | No |
| Execution report/correct/retract/recovery | No |
| HistoricalPlan publish/retry/recovery | No |
| Full clear | No |
| Backup import/export or concurrent restore | No |
| Readiness/recovery diagnostics | Yes |

### Crash Matrix

| Crash point | Required restart result |
| --- | --- |
| Before durable journal | Old authority |
| prepared | Old authority or safe staging resume |
| staged | Resume after source recheck |
| After IndexedDB commit | Roll forward from verified target |
| Mid-localStorage commit | Roll forward from verified target |
| After localStorage commit | Verify and finalize |
| After verified before cleanup | Keep target; retry cleanup |
| During rollback | Resume rollback and verify |
| Invalid journal/staging | Protected recovery-required |

