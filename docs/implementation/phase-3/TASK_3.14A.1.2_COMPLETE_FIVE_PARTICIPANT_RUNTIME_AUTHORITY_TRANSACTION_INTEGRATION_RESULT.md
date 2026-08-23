# Task 3.14A.1.2 Result — Five-Participant Runtime Authority Transaction Integration

## Executive Result

Complete. The existing transaction and notification cores are connected to all five live DayFrame authority participants. A capability-scoped controller can capture one clone-isolated five-surface runtime truth, install exact targets without persistence or workflow side effects, commit only after all targets are present, or abort back to the exact prior runtime condition without leaking target notifications.

## Artifact Integrity

- Supplied and saved artifacts are byte-identical.
- SHA-256: `31136a015bb7b38fa7b5cec42b00cd694b99026cbecc0ee6ea2b0bb678863055`
- Size: 22,552 bytes; 1,014 lines.
- The immutable task artifact was not modified.

## Discovery From Resumed 3.14A

Resumed 3.14A correctly exposed that the generic transaction core was not live integration. This task closes that exact gap; it does not add durable restore infrastructure.

## Existing Transaction-Core Audit

The prior core provided generic snapshot/begin/commit/abort and an ordered scheduler. It had only fake-participant proof. This task added target installation, whole-participant capture, a capability registry, five real adapters, live store registration, and transaction-aware mutation admission.

## Participant Runtime-State Audit

| Participant | Captured runtime state |
| --- | --- |
| Active | Authored runtime state, Preview, ingress/protection state, durability and desired condition |
| Profiles | Saved profiles, quarantine, ingress/protection state, durability and desired condition |
| PlanDecision | Decisions, quarantine, desired raw authority, durability, ingress and protected source |
| ExecutionHistory | Records, quarantine, desired authority, pending records/removals, durability, ingress/protection, authority mode, migration status and protected IndexedDB evidence |
| HistoricalPlan | Resident batch metadata, pending publications, durability/protection status and protected evidence |

Listeners, allocators, clocks, serializers, storage handles, initialization promises, and persistence chains are dependencies rather than runtime authority and are not snapshotted.

## Files Changed

- `code/src/state/dayFrameRuntimeAuthority.ts`
- `code/src/state/dayFrameAuthorityTransaction.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/planDecisionSurface.ts`
- `code/src/state/executionHistorySurface.ts`
- `code/src/state/historicalPlanSurface.ts`
- `code/src/state/types.ts`
- `code/src/state/dayFrameRuntimeAuthorityIntegration.test.ts`
- checkpoint, historical status note, and this result artifact

## Capability Boundary

Adapters require `DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY`. The ordinary `DayFrameStore` type omits participant adapter access. The live controller is held in a `WeakMap` and retrieved only with the capability token; participant listener sets and injected dependencies remain private.

## Active and Profiles Adapters

Active exact install preserves Profiles and allocates no source incarnation. Profiles exact install preserves Active and invokes no save/load/delete workflow. Both capture protection/durability intent and route their participant notification through the scheduler.

## PlanDecision Adapter

Captures and restores decisions, quarantine, desired persisted representation, durability, ingress, and protected source. It does not accept/remove a decision, allocate an ID, persist, or retimestamp.

## ExecutionHistory Adapter

Captures and restores valid records, quarantine, desired authority, pending accepted records, pending quarantine removals, durability, ingress/protection, legacy/IndexedDB authority mode, migration status, and protected physical evidence. Initialization/persistence promises and the IndexedDB dependency are not authority. Exact install reports/corrects/retracts nothing and allocates no IDs.

## HistoricalPlan Adapter

Captures resident metadata, pending publications, durability/protection status, and resolved protected evidence without loading the durable ledger. Snapshot capture rejects while protected evidence is still being acquired rather than creating an incomplete snapshot. Exact install never calls `publish` and emits no publication-accepted event.

## Snapshot Completeness and Clone Isolation

The transaction structured-clones every participant snapshot at begin, target input at install, and snapshot again at abort. Whole capture returns isolated values. Integration abort equality covers every captured private field.

## Exact Install and Restore Semantics

Exact install directly replaces private runtime variables. Abort invokes the same exact-install adapters with the begin snapshot. Neither path performs persistence, allocation, retimestamping, migration, retry, publication, or ordinary workflow behavior.

## Notification Scheduler Integration

The live store supplies one scheduler to PlanDecision, ExecutionHistory, and HistoricalPlan and owns Active/Profile callbacks. Exact installs mark participant channels dirty. No external callback fires during installation. Commit flush order remains main, profiles, PlanDecision, ExecutionHistory, HistoricalPlan, durability, readiness.

## Five-Participant Registration and Mutation Admission

The store registers all five adapters in one authority transaction. The store proxy now consults live transaction state, so ordinary mutation is rejected during active installation and through notification flush. Runtime controller methods are not part of ordinary store API.

## Commit Ordering and Cross-Read Guarantee

All target installs complete while notification deferral is active. The real-participant test subscribes to all five channels; each callback reads Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan and observes the same final target tuple.

## Dirty-Channel Deduplication

The scheduler retains one final callback per participant channel. Repeated exact installs do not replay intermediate values.

## Mutation During Flush

An Active callback attempts an authored mutation during flush and receives `DayFrameMutationAdmissionError`, proving admission remains closed until commit returns.

## Abort Restoration

The real abort test captures all five participants, partially installs a changed target, aborts, and asserts complete whole-snapshot equality. Scheduler abort discards every target dirty notification.

## Side-Effect Audits

- localStorage `setItem`: zero calls during exact install/abort test
- IndexedDB/HistoricalPlan persistence: unreachable from adapter implementations; no persistence methods are invoked
- identity allocators and clocks: not referenced by adapter implementations
- timestamps: copied unchanged through structured cloning
- domain events: no PlanDecision workflow event, execution report/correction/retraction, authored lifecycle event, or HistoricalPlan publication event

## Bootstrap and Normal-Operation Regression

The existing coordinated bootstrap remains green. Outside transactions the existing surface persistence and notification paths are unchanged; the scheduler is used by exact runtime installation only.

## Real Commit, Abort, and Cross-Read Tests

`dayFrameRuntimeAuthorityIntegration.test.ts` uses the actual store and five actual adapters. Commit proves five channel callbacks all see the final five-surface target. Abort proves exact old authority restoration and no localStorage write. Generic transaction tests continue to prove nested rejection, clone isolation, and notification deduplication.

## Cross-Read Matrix

| Callback channel | Reads coherent final Active/Profile/Decision/Execution/Plan target? |
| --- | ---: |
| Active/main | Yes |
| Profiles | Yes |
| PlanDecision | Yes |
| ExecutionHistory | Yes |
| HistoricalPlan | Yes |

## No Restore Infrastructure Audit

No journal, RestoreTransactionId, staging key/store, fingerprint, cross-storage commit, roll-forward, rollback, Backup V3, or persistence/domain version was introduced.

## Documentation and Governance

Added the five-participant runtime transaction checkpoint and a historical note to the prior stopped result. No current-state claim of durable restore was added.

## Architectural Alignment

The implementation closes the distinction between generic transaction machinery and real live integration. Runtime atomic observability is now available for resumed 3.14A to coordinate with durable cross-storage recovery.

## Deviations

The capability token is exported from an infrastructure-focused module for store integration and direct tests, while adapter access is omitted from the ordinary store type. HistoricalPlan exact install uses the existing non-publication `recoveryChanged` invalidation at commit so subscribers can refresh without manufacturing a publication.

## Discoveries and Deferred Work

HistoricalPlan protection evidence can be asynchronously captured after a read detects corruption. Transaction begin truthfully fails while that capture is in flight. Resumed 3.14A should treat this as participant-not-ready and retry only after evidence settles.

## Resume 3.14A Recommendation

Resume Task 3.14A. Its previously missing runtime prerequisite is now implemented and directly tested.

## Focused Validation

- authority transaction + real five-participant integration: 2 files, 5 tests passed
- full integration test covers commit cross-reads, mutation during flush, partial install abort, snapshot equality, and persistence spy

## Full Validation

- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm test`: 54 files, 738 tests passed
- `npm run build`: passed; 78 modules transformed
- `git diff --check`: passed
- existing Vite chunk-size warning remains informational

## Final Determination

**Complete.** All five real authority participants now support capability-scoped complete runtime capture, exact target installation, exact abort restoration, scheduler-governed coherent commit, and transaction-aware mutation admission without persistence, allocation, retimestamping, workflow side effects, durable restore infrastructure, Backup V3, or domain-version changes.

