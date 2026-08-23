# Task 3.14A.2 Result — Durable-to-Runtime Restore Translation and Pre-Bootstrap Composition

## 1. Executive Result

Complete. Restore now explicitly distinguishes durable participant payloads from private runtime targets, validates prospective translation before mutation, reconstructs settled runtime authority from verified target or recovery evidence, and installs it through the existing shared five-participant transaction. The store owns one concrete coordinator before readiness for both interrupted startup recovery and future live restore. No Backup V3 or persistence/domain version was added.

## 2. Artifact Integrity

The supplied artifact and immutable project copy `TASK_3.14A2_COMPLETE_DURABLE_TO_RUNTIME_RESTORE_TRANSLATION_AND_PRE_BOOTSTRAP_RESTORE_COMPOSITION.md` are byte-identical: 52,019 bytes, 1,847 lines, SHA-256 `a20941aef4257f040708fbb54a564c9dc1c4058a8e099497df53c73162a8538b`. The task artifact was not modified.

## 3. Blocking Task 3.14 Discovery

Resumed Task 3.14 proved that the coordinator passed strict physical durable payloads directly to incompatible private runtime installers. ExecutionHistory physical `{ records, quarantine, metadata, antiResurrection }` and HistoricalPlan physical `{ batches, days }` cannot be their runtime snapshots. That explicit stop condition motivated this amendment.

## 4. Existing Restore Contract Audit

Task 3.14A already correctly owned dual staging, journal transitions, source recheck, atomic IndexedDB replacement, verified local replacement, anti-resurrection, roll-forward, rollback, and runtime transaction mechanics. Only durable-to-runtime translation and real composition were missing.

## 5. Files Changed

Production changes cover `restoreParticipants.ts`, `restoreCoordinator.ts`, `dayFrameRestoreTranslation.ts`, `dayFrameRestoreComposition.ts`, `dayFrameStore.ts`, and narrow exports/helpers in the three governed surfaces. Tests update `restoreInfrastructure.test.ts` and add `dayFrameRestoreComposition.test.ts`. The restore checkpoint, ADR, current state, decisions, and this result were updated.

## 6. Durable vs Runtime Contract

`RestoreParticipantAdapter<TDurable, TRuntime>` now types capture/validation/clone/fingerprint/write/verification as durable operations and `buildRuntimeTargetFromDurable` as the only bridge to `TRuntime`. Journal and staging remain runtime-neutral and durable-only.

## 7. Generic Type Split

The real registry retains distinct payload maps. Heterogeneous registry mechanics use keyed maps; there is no cast from a durable payload to a runtime snapshot. A direct incompatible installation is no longer expressible through the participant contract.

## 8. Coordinator Changes

The coordinator translates every validated target before staging, so deterministic translation failure changes no live authority. After durable verification it retranslates the verified payload and installs only runtime targets. Rollback uses the identical recovery translation path. Runtime snapshots still govern exact in-memory abort.

## 9. Active Durable Payload

Active uses the current `DayFrameActiveV2` persisted envelope and existing validator.

## 10. Active Runtime Translation

Translation preserves authored data and source incarnations, allocates nothing, establishes accepted/durable snapshot state, removes protection evidence, and uses a generic safe `preview: null`. This is not a Backup V3 policy; generic cross-authority replacement never carries a stale pre-restore Preview.

## 11. Profiles Durable Payload

Profiles uses `DayFrameProfilesStorageV2`, including canonical reusable incarnation-free profiles and governed quarantined raw entries.

## 12. Profiles Runtime Translation

Profile IDs, names, timestamps, authored content, and quarantine are cloned exactly. Runtime becomes accepted, durable, and snapshot-desired without allocation or lifecycle workflow calls.

## 13. PlanDecision Durable Payload

PlanDecision uses its V1 persisted envelope. Existing decision validation and conflict/duplicate isolation determine canonical decisions and governed quarantine.

## 14. PlanDecision Runtime Translation

Decisions, IDs, targets, timestamps, and quarantine are preserved. Desired authority is reconstructed; ingress is accepted and durability is `durable`. No accept/remove workflow or allocator runs.

## 15. ExecutionHistory Durable Payload

The durable target remains strict physical records, quarantine, established metadata, and the anti-resurrection value required by the existing participant.

## 16. ExecutionHistory Runtime Translation

Physical wrappers are verified against their contained records, metadata counts and established state are checked, and the existing V1 envelope validator reconstructs domain authority.

## 17. ExecutionHistory Settled-State Normalization

Runtime becomes `authorityMode: "indexedDb"`, `migrationStatus: "readyIndexedDb"`, `durability: "durable"`, accepted ingress, settled desired authority, empty pending-record and quarantine-removal queues, and no inherited protection evidence.

## 18. HistoricalPlan Durable Payload

HistoricalPlan remains strict physical batch metadata and day records accepted by the combined IndexedDB replacement.

## 19. HistoricalPlan Runtime Translation

Each batch is reconstructed and validated from metadata and complete day records. Fingerprints, day lists, IDs, ranges, and timestamps must match before a runtime target is produced.

## 20. HistoricalPlan Settled-State Normalization

Runtime becomes `{ status: "ready", pendingCount: 0 }` with empty pending publications, deterministic resident metadata, and no protected evidence.

## 21. Quarantine Preservation

ExecutionHistory quarantine remains exact governed authority. Profiles and PlanDecision governed quarantine are likewise reconstructed rather than discarded or accepted.

## 22. Protection Semantics

Participant readiness still blocks ordinary protected restore. A valid restored payload establishes interpretable healthy state and does not inherit unrelated source protection. Invalid payloads fail validation/translation.

## 23. Anti-Resurrection

The existing exact marker write/verify remains in forward and rollback paths. Successful real restore establishes `dayframe-execution-history-idb-established = "1"`; runtime recognizes IndexedDB authority and does not rerun legacy migration.

## 24. Translation Validation

Active/Profile/domain validators and strict physical validation are reused. Invalid ExecutionHistory/HistoricalPlan physical evidence is rejected rather than repaired or presented as healthy runtime state.

## 25. Translation Determinism

Translation uses only payload content, structured clones, existing validators, and deterministic ordering/fingerprints. It reads no clock and calls no random source.

## 26. Translation Failure

Prospective translation failure returns `invalidTarget` before staging/live writes. Unexpected post-commit translation failure cannot report success and leaves journal-visible recovery protection.

## 27. Rollback Translation

After verified durable recovery replacement, the coordinator translates the recovery durable side and installs the resulting settled runtime side. A focused injected-failure test proves `rolledBack` convergence through translation.

## 28. Coordinator Runtime Install

Only translated `TRuntime` values reach `runtime.install`. Installation remains inside the existing authority transaction, and commit flushes once after all five installs.

## 29. Heterogeneous Participant Registry

`RestoreDurablePayloadMap` and `RestoreRuntimeTargetMap` state every real mapping. The capability-scoped registry contains one typed adapter per required participant.

## 30. Unsafe Cast Audit

No durable-to-runtime `as unknown as RuntimeSnapshot` cast exists. The pre-existing heterogeneous runtime participant registration cast remains inside the runtime controller composition and receives only translator-produced runtime targets.

## 31. Store Composition Root

`createDayFrameStore` constructs or receives localStorage and shared IndexedDB services, builds the real participant registry, creates one coordinator, and registers it against the store proxy behind `DAYFRAME_RESTORE_CAPABILITY`.

## 32. Pre-Bootstrap Coordinator Construction

Surfaces and runtime shells exist before bootstrap but are not externally usable while readiness is initializing. The coordinator therefore requires no ready store and can resolve journal evidence before ordinary collection initialization.

## 33. Startup Recovery Policy

The implementation uses Model A with a guarded second phase: recovery converges durable authority and installs translated targets into non-public runtime shells; ordinary ExecutionHistory/HistoricalPlan initialization then rereads that converged durable authority. Readiness becomes usable only after both phases.

## 34. Live Restore Policy

Live restore validates/translates, stages both sides, rechecks sources, commits and verifies durable authority, retranslates, and atomically installs all runtime targets.

## 35. Startup Forward Recovery

A real test persists complete staging and an `indexedDbCommitted` journal, restarts with real adapters, completes local authority and marker writes, installs translated targets, initializes collections, reaches ready, and cleans the journal.

## 36. Startup Rollback Recovery

The existing rollback state machine is unchanged. Focused rollback coverage proves recovery durable authority is retransformed before coherent runtime installation.

## 37. Protected Startup Recovery

Invalid journal evidence produces `authorityRecoveryRequired`; ordinary initialization does not expose usable authority.

## 38. Runtime Notification

Translation emits nothing. Exact installs use the existing scheduler, preserving deferred five-participant notification and cross-read coherence.

## 39. Persistence Side-Effect Audit

Translation functions contain no storage, journal, staging, marker, or persistence dependency. Only coordinator commit adapters write.

## 40. Identity Allocation Audit

No translator imports or calls a source, profile, decision, execution, or publication identity allocator.

## 41. Timestamp Audit

No translator reads the clock or rewrites domain timestamps. Existing timestamps are cloned and validated.

## 42. Domain-Event Audit

No profile workflow, PlanDecision acceptance, execution report/correction/retraction, or HistoricalPlan publication runs. HistoricalPlan exact install retains only the existing recovery invalidation signal.

## 43. Tests Added

Tests cover pure settled translation, invalid physical rejection, real five-participant live replacement, interrupted forward startup, invalid-evidence startup protection, prospective translation rejection, and translated rollback.

## 44. Translation Unit Tests

ExecutionHistory and HistoricalPlan tests assert settled queues/state and invalid-target rejection. Existing domain validators retain deeper record, quarantine, and ledger coverage.

## 45. Live Five-Participant Restore Test

The real store, localStorage, shared IndexedDB, real surfaces, registry, combined adapter, marker adapter, staging, journal, coordinator, and runtime transaction are exercised together.

## 46. Interrupted Startup Test

The test constructs shells, resolves staged forward recovery before readiness, initializes authority once from the converged durable side, and observes ready target authority.

## 47. Rollback Test

An injected target local-write failure forces durable rollback and confirms translated recovery runtime installation with `rolledBack` result.

## 48. Cross-Read Test

The real restore path uses the same shared authority transaction already covered by real five-channel cross-read tests; focused runtime integration regression remains green.

## 49. Compile-Time Contract Test

Separate generic parameters and keyed payload maps prevent a physical ExecutionHistory/HistoricalPlan payload from type-checking as its runtime snapshot.

## 50. Anti-Resurrection Regression

Real restore verifies the marker and established ExecutionHistory metadata together with `readyIndexedDb` runtime state.

## 51. HistoricalPlan Regression

Translation rebuilds resident metadata without publishing; pending remains empty and no publication identity/time is allocated.

## 52. ExecutionHistory Regression

The complete existing history, migration, correction, quarantine, and anti-resurrection suites remain green.

## 53. No Persistence Schema Change Audit

No IndexedDB store, index, key, localStorage key, or physical database version changed.

## 54. No Backup V3 Audit

No Backup V3 type, writer, reader, import dispatch, export path, or UI was introduced. Runtime translation is explicitly infrastructure and is not backup content.

## 55. Documentation Updates

The Task 3.14A checkpoint and ADR now state the durable/runtime split and composition. `CURRENT_STATE.md` and `DECISIONS.md` record the implemented amendment without claiming Backup V3.

## 56. Architectural Alignment

The implementation preserves domain/infrastructure separation, exact replacement, dual staging, deterministic recovery, runtime atomicity, identities/timestamps, append-only historical semantics, anti-resurrection, quarantine, and no workflow replay. It provides the required portable Backup V3 seam.

## 57. Deviations

HistoricalPlan and ExecutionHistory translation helpers are exported narrowly from their existing surface modules rather than moved into a new domain package; this avoids duplicating private physical validation. No architectural consequence or follow-up is required.

## 58. Discoveries and Deferred Work

The generic safe Active translation clears Preview because durable restore targets do not contain derived Preview and preserving the pre-restore value would be stale. Task 3.14 still owns explicitly testing and documenting Backup V3's Preview policy. Cross-tab locking remains deferred.

## 59. Resume Task 3.14 Recommendation

**Resume Task 3.14 — Define and Implement Backup V3 Across Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan.** It can now construct five durable targets and hand them to this coordinator without serializing runtime state or duplicating restore mechanics.

## 60. Focused Validation

`npx vitest run src/infrastructure/restore/restoreInfrastructure.test.ts src/state/dayFrameRestoreComposition.test.ts src/state/dayFrameReadiness.test.ts src/state/dayFrameRuntimeAuthorityIntegration.test.ts` passed: 4 files, 21 tests. The expanded two-file restore run passes 15 tests after rollback and prospective-failure additions.

## 61. Full Validation

- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm test`: passed, 56 files and 753 tests
- `npm run build`: passed, 85 modules transformed; existing chunk-size warning remains informational
- `git diff --check`: recorded after documentation completion

## Required Durable / Runtime Matrix

| Participant | Durable representation | Runtime representation | Translation required? |
| --- | --- | --- | ---: |
| Active | `DayFrameActiveV2` | Active state + ingress/durability/desired state | Yes |
| Profiles | `DayFrameProfilesStorageV2` | Profiles + quarantine + ingress/durability/desired state | Yes |
| PlanDecision | V1 persisted envelope | Decisions/quarantine/desired + settled surface state | Yes |
| ExecutionHistory | Physical records/quarantine/metadata + marker intent | V1 authority + queues/ingress/durability/migration/mode | Yes |
| HistoricalPlan | Physical batches/days | Ready status + empty pending + resident metadata | Yes |

## Required Restored Runtime State Matrix

| Participant | Pending after successful restore? | Durability/state | Protection |
| --- | ---: | --- | --- |
| Active | No | `durable`, snapshot desired | accepted; none retained |
| Profiles | No | `durable`, snapshot desired | accepted; none retained |
| PlanDecision | No | `durable` | accepted; none retained |
| ExecutionHistory | No | durable `readyIndexedDb` authority | accepted; none retained |
| HistoricalPlan | No | ready ledger, pending count 0 | none retained |

## Required Startup Recovery Matrix

| Journal/outcome | Durable action | Runtime/bootstrap action |
| --- | --- | --- |
| no journal | none | normal bootstrap |
| staged/pre-mutation | existing source-rechecked forward policy | translated install, then initialization |
| forward stage | finish verified target | translate target, install, initialize |
| rollback stage | finish verified recovery | translate recovery, install, initialize |
| finalized | cleanup | normal bootstrap |
| recoveryRequired/invalid evidence | protect and retain governed evidence | no unsafe ready authority |

## Required Live Restore Matrix

| Phase | Durable authority | Runtime authority |
| --- | --- | --- |
| before restore | source | source |
| staging | source | source snapshot held |
| source recheck | source | source |
| durable commit | journal-governed transition | source |
| durable verified | target | source |
| runtime transaction | target | atomically transitioning |
| complete | target | translated target |
| runtime abort | journal-governed | exact captured snapshot |
| durable rollback | recovery | translated recovery runtime |

## 62. Final Determination

**Complete.** All five real participants distinguish durable from runtime authority, deterministic settled translation is integrated into forward and rollback completion, one pre-ready store-owned coordinator handles real live and interrupted startup recovery, full validation passes, and no Backup V3, persistence schema, domain version, or unrelated workflow was added.
