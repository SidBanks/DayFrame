# Resumed Task 3.14A Result — Durable Cross-Storage Restore Foundation

## 1. Executive Result

Completed. DayFrame now has a domain-format-neutral restore foundation with durable target/recovery staging, a strict startup-visible journal, exact five-participant source recheck, atomic IndexedDB authority replacement, verified localStorage replacement, anti-resurrection handling, deterministic forward/rollback recovery, and coherent runtime installation through the five-participant authority transaction. Backup V3 was not introduced.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/fb1f4250-e191-4a4b-b054-dcea8bcc6be8/pasted-text.txt`
- Immutable project copy: `docs/implementation/phase-3/TASK_3.14A_ESTABLISH_DURABLE_CROSS_STORAGE_RESTORE_STAGING_JOURNAL_STARTUP_RECOVERY_AND_STORE_MUTATION_BARRIER.md`
- Both copies: 42,274 bytes, 2,052 lines
- SHA-256: `b3a12d401eda9228e2fd19548e7cdd92921856cdba4f047779e906a84f1639f0`
- `cmp`: identical

## 3. Prior Stop History and Prerequisite

Earlier attempts correctly stopped first for missing readiness/transaction authority, then for incomplete live participant adapters. Task 3.14A.1.2 subsequently completed and validated the five-participant runtime snapshot, exact install/abort, scheduler, mutation admission, and cross-read boundary. That prerequisite is now accepted.

## 4. Files Changed

Production:

- `code/src/infrastructure/restore/restoreIdentity.ts`
- `code/src/infrastructure/restore/restoreJournal.ts`
- `code/src/infrastructure/restore/restoreStaging.ts`
- `code/src/infrastructure/restore/restoreParticipants.ts`
- `code/src/infrastructure/restore/restoreCoordinator.ts`
- `code/src/infrastructure/storage/dayFrameDurableDb.ts`
- `code/src/infrastructure/storage/indexedDbCollectionStorage.ts`
- `code/src/state/dayFrameStore.ts`

Tests and governance:

- `code/src/infrastructure/restore/restoreInfrastructure.test.ts`
- `docs/checkpoints/CHECKPOINT_Phase_3_Durable_Cross_Storage_Restore_Foundation.md`
- `docs/adr/ADR_DURABLE_CROSS_STORAGE_RESTORE_FOUNDATION.md`
- `docs/architecture/CURRENT_STATE.md`
- `docs/architecture/DECISIONS.md`
- `docs/roadmap/ROADMAP.md`
- this result artifact

## 5. Identity, Journal, and Stage Machine

`RestoreTransactionId` is an infrastructure-only branded canonical lowercase UUID-v4 with a cryptographically strong default allocator and injectable test allocator. Journal version 1 uses `dayframe-restore-journal-v1`, exact-key validation, ISO timestamps, deterministic fingerprints, modes `ordinary`/`recoveryReplacement`, and validated transitions across prepared, forward, rollback, finalized, and recovery-required stages. Large payloads never enter the journal.

## 6. Durable Staging and Fingerprints

The additive physical DB upgrade from version 2 to 3 adds `restoreMetadata` and `restorePayloads`; payload keys are `[transactionId, side, participantId]`. Target and recovery payloads are structured-cloned, written in one durable batch, reread, participant-validated, and compared using participant and sorted whole-authority fingerprints. The three localStorage participants are also staged together under `dayframe-restore-local-stage-v1` with strict reread verification. Captured source fingerprints are durable staging metadata used by startup recovery.

## 7. Participant and Commit Boundary

The narrow adapter covers readiness, authority capture, validation, clone, semantic fingerprint, source capture/recheck, exact durable write/verification, and exact runtime installation. Exactly one adapter is required for Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan. ExecutionHistory and HistoricalPlan use one combined lower-level IndexedDB mutation spanning all five live collection stores. It clears and replaces both authorities atomically, preserving exact physical records, quarantine, metadata, batches, days, publication identities, and timestamps without invoking domain workflows.

Active, Profiles, and PlanDecision writes are ordered and individually reread/verified. ExecutionHistory anti-resurrection local state is an explicit exact write/verify participant in both target and rollback paths. No domain identifier or timestamp allocator is used.

## 8. Source Recheck, Admission, and Runtime Integration

Ordinary restore requires all participants ready; protected replacement requires explicit `recoveryReplacement`. The shared authority transaction begins before restore work, activating the existing centralized mutation barrier. Recovery authority and source evidence are captured before staging. All five sources are rechecked immediately before the first live mutation; mismatch returns `sourceChanged` and changes no authority.

After all durable target authority verifies, all five runtime targets install through the shared runtime authority controller and flush once. Partial runtime install aborts to the exact captured snapshot. Store bootstrap now starts only after the proxy/controller is registered, and the pre-bootstrap hook receives the runtime controller, allowing journal recovery to finish or protect readiness before participant initialization.

## 9. Roll-Forward, Rollback, and Protection

`indexedDbCommitted` and later forward stages use verified staged target and idempotently repair local writes. A failure after IndexedDB target commit moves to persisted rollback stages and restores both IndexedDB participants atomically, then local participants and anti-resurrection state, rereads all five, and installs recovery runtime coherently. Rollback failure persists `recoveryRequired` and retains journal/staging evidence. Invalid journal, invalid/missing stage after possible mutation, or unprovable runtime recovery protects bootstrap; no heuristic authority choice is made.

`prepared` without complete staging is conservatively cleaned because no live mutation can yet have occurred. `finalized` performs cleanup only. Staging cleanup precedes local-stage cleanup and journal removal; cleanup failure does not change already verified authority and leaves restart-visible evidence.

## 10. Result and Status Contracts

Runtime coordinator status is one of `idle`, `preparing`, `staging`, `committing`, `recovering`, `finalizing`, or `recoveryRequired`. Restore results distinguish completed, busy/readiness/protection/invalid-target failures, staging/source/commit/verification failures, rollback, and recovery-required outcomes. Startup distinguishes no recovery, resumed forward, rollback, finalized cleanup, and protected recovery-required.

## 11. Required Matrices

### Journal stage matrix

| Persisted stage | Deterministic startup action |
| --- | --- |
| `prepared` | Clean incomplete evidence, or validate complete stage and continue |
| `staged` | Revalidate stage/source, then commit target |
| `indexedDbCommitted` | Roll forward from verified target |
| `localStorageCommitted` | Verify/repair target, install runtime |
| `verified` | Finalize and clean |
| `finalized` | Cleanup only |
| rollback stages | Resume exact rollback side |
| `recoveryRequired`/invalid evidence | Protect; retain evidence |

### Participant matrix

| Participant | Durable authority | Replacement |
| --- | --- | --- |
| Active | localStorage | exact write/reread |
| Profiles | localStorage | exact write/reread |
| PlanDecision | localStorage | exact write/reread |
| ExecutionHistory | IndexedDB + local marker | combined atomic replace + marker verify |
| HistoricalPlan | IndexedDB | combined atomic replace, no publication |

### Failure matrix

| Failure point | Authority result |
| --- | --- |
| journal/staging/clone/quota/source recheck | no live mutation |
| atomic IndexedDB transaction | all old or all target IndexedDB authority |
| partial localStorage write | journal-visible roll forward, otherwise staged rollback |
| verification failure | staged exact rollback |
| rollback failure | durable recovery-required protection |
| cleanup failure after verification | verified authority retained; cleanup resumes |

### Roll-forward/rollback matrix

| Evidence | Chosen side |
| --- | --- |
| full staged target + IndexedDB committed | target roll forward |
| forward cannot be proven + full recovery stage | exact recovery rollback |
| either side invalid/unavailable | no guess; recovery required |

## 12. Tests Added and Validation

Direct tests cover UUID validation/allocation, journal strictness and transition rejection, clone-isolated durable staging and reread, additive restore-store use, exact combined IndexedDB replacement, five-participant coordinator success, source-changed rejection before mutation, coherent runtime install ordering, cleanup, and startup protection mapping. Existing storage tests continue to cover additive upgrade preservation and atomic transaction abort.

Final validation:

- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm test`: passed — 55 files, 746 tests
- `npm run build`: passed
- `git diff --check`: passed

## 13. Architectural Assessment, Deviations, and Deferred Work

The implementation aligns with the resumed contract. Optional browser locks and cross-tab coordination remain deliberately absent; source recheck is the single-active-tab safety boundary. No Backup V3 format, export/import path, restore UI, domain version, domain event, publication, execution allocation, Preview clearing, sync, Progress, Goal, or learning work was added.

The restore foundation is intentionally format-neutral. Task 3.14 must construct validated V3 participant payloads and supply the concrete adapters; it must not duplicate journal, staging, commit, or recovery mechanics.

## 14. Final Completion Determination

**Complete.** The interruption-safe five-participant durable authority-replacement prerequisite is established. Recommended next task: resume Task 3.14 — Backup V3.
