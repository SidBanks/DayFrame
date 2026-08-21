# Task 2.19 — Active-Local Recovery Completion, Replacement, and Abandonment Authority — Result

## 1. Executive Determination

**Completed — architectural contract only.** DayFrame should resolve a protected active-local checkpoint through exactly two explicit store-owned commands: (1) replace it with the latest semantically valid current session, or (2) abandon it by removing the active checkpoint and resetting active runtime to safe defaults. Profile load and backup import remain non-destructive ways to prepare and review the current session; they do not receive independent recovery authority.

Protection clears only after explicit authority, a successful pre-recovery source recheck, and the requested durable operation returning `persisted` or `removed`. Failure never clears protection or falsely reports recovery. Core recovery requires no durable-format change.

## 2. Artifact Integrity

**Confirmed.** The supplied artifact and saved project copy were byte-identical before investigation: 58,828 bytes, 2,229 lines, SHA-256 `eb8be61d653931bcc19a27707c056331d7494b72b98fa1564bd33fbe88006fb6`. It contained every required section and ended with the required completion sentence. The immutable task artifact was not modified.

## 3. Evidence Reviewed

**Confirmed:** Task 2.18 contract/result; `code/src/state/types.ts`; active ingress loading/classification, write/removal guards, retry, desired-condition, durability, clear, profile, backup, and persistence code in `code/src/state/dayFrameStore.ts`; shared validation; durability classification/tests; active-ingress and persistence tests; `DayFrameApp` recovery awareness and tests; repository searches for storage events and all storage access.

## 4. Current Protected-Recovery State

**Confirmed.** `recoveryRequired` is retained outside `DayFrameState` for read failure, corrupt JSON, structural invalidity, and semantic invalidity. Runtime starts from safe defaults; readable source remains at the active key; all ordinary active writes/removals and retry are blocked. Runtime mutation, profile persistence, valid profile load, valid backup import, and Preview remain usable. The warning is read-only. Ingress status is currently immutable for the store lifetime and its subscriber therefore has no transition to report.

## 5. Recovery Completion Definition

Recovery completes only when an eligible explicit recovery command establishes its requested active durable condition and atomically reconciles store metadata:

- replacement: latest current authored snapshot validates, source recheck succeeds, active write returns `persisted`, active durability becomes `durable`, desired active condition becomes `snapshot`, and ingress becomes `accepted`;
- abandonment: source recheck succeeds, active removal returns `removed`, active runtime resets to safe defaults, active durability becomes `durable`, desired active condition becomes `absent`, and ingress becomes `noSource` with an explicit resolved/abandoned reason.

A request, confirmation, runtime replacement, validation, attempted write/removal, or failed persistence is not completion.

## 6. Initiation / Attempt / Completion Distinction

- **Initiation:** the workflow obtains explicit confirmation for one named destructive resolution.
- **Attempt:** the store proves eligibility, validates/rechecks as applicable, establishes command intent, and performs at most one write or removal.
- **Completion:** that operation succeeds and the store commits the corresponding status transition.

Cancellation or precondition failure is `notAttempted`; a real failed durable operation is `notResolved`; only durable success is `resolved`.

## 7. Eligible Recovery Modes

Adopt current-session promotion and active-only abandon/reset. Profile and backup data are eligible indirectly: load/import them into runtime, inspect or edit, then promote the current session. Direct profile/backup recovery is deferred because it duplicates validation/transaction paths and weakens review/freshness clarity. Repair or automatic migration is ineligible.

## 8. Current-Session Recovery Assessment

**Recommended and adopted.** Current runtime is already session authority and can contain fallback edits, a reviewed profile, or a reviewed backup. Promotion needs no runtime swap, naturally uses the latest state on every attempt, permits Preview review, and makes durability-first ordering straightforward. Untouched fallback may also be promoted, but requires the same explicit overwrite confirmation because it discards protected history.

## 9. Session Provenance Assessment

The command truthfully identifies its replacement as **current session**, not “profile recovery” or “backup recovery.” Immediate workflow context may explain how the session was prepared, but the store need not persist provenance. Subsequent edits mean original profile/backup identity is not authoritative for replacement bytes.

## 10. Profile-Based Recovery Assessment

A valid profile may continue to replace runtime while protection remains; its automatic write stays blocked. The user may review it and then explicitly promote the resulting current session. The profile artifact remains unchanged. No profile-specific guard bypass is justified.

## 11. Backup-Based Recovery Assessment

A valid backup may likewise populate current runtime, remain externally intact, and then be promoted explicitly. Existing backup validation is reused. Import alone remains non-completing and its blocked persistence is truthful.

## 12. Generic Versus Source-Specific Recovery

Adopt the generic current-session model. It gives one validation authority, one write transaction, current-state freshness, one confirmation meaning, and less API/test duplication. Direct source-specific commands may be reconsidered only if future UX demonstrates a need that review-then-promote cannot satisfy.

## 13. Recovery Model Matrix

| Model | Reviewable before overwrite | Uses latest runtime | Extra transaction paths | Adopted |
| --- | ---: | ---: | ---: | --- |
| current-session promotion | yes | yes | one | yes |
| direct profile recovery | limited | no | additional | no |
| direct backup recovery | limited | no | additional | no |
| hybrid | yes | mixed | highest | deferred |

## 14. Explicit Abandonment

Abandonment means: “permanently discard the protected active checkpoint and reset the active setup.” It is distinct from replacement and ordinary clear. It requires recovery state plus strong, action-specific confirmation.

## 15. Reset Versus Abandonment

The adopted operation combines active-checkpoint abandonment with reset of active runtime. Removing the key while keeping edited runtime would leave runtime and durable absence misaligned and make the next ordinary mutation silently repopulate data the user believed abandoned. Keeping the session is already served by replacement.

## 16. Abandonment Models

Model A (remove/keep runtime) preserves edits but creates an immediately non-durable, ambiguous postcondition. Model B (remove/reset) is destructive but coherent and clearly distinct. Model C (persist runtime) is replacement, not abandonment. Adopt Model B.

## 17. Abandonment Matrix

| Model | Protected Checkpoint Removed | Current Session Preserved | Durable/Runtime Aligned Immediately | User-Loss Risk | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| remove + keep runtime | yes | yes | no | medium/ambiguous | reject |
| remove + reset runtime | yes | no | yes | high/explicit | adopt as abandonment |
| persist current runtime | overwritten | yes | yes | protected history replaced | adopt separately as replacement |

The command may reuse the factual active-removal helper internally but must not invoke `clearLocalData()`: profiles are independent and remain untouched.

## 18. Readable Source Preservation Requirement

Readable protected bytes must remain unchanged until the successful destructive write/removal. Failed, cancelled, stale, unavailable, serialization-failed, or storage-failed recovery leaves them in place. A recovery attempt must identify that it is acting on the same checkpoint originally classified.

## 19. Unreadable Source Recovery

For initial `readFailure`, DayFrame cannot promise exact preservation or export. Before any destructive action it must retry the read. If still unreadable, no overwrite/removal is attempted; the user must retry after storage access returns. If it becomes readable, DayFrame classifies the newly observed source and requires a fresh decision rather than destroying unknown bytes under stale consent.

## 20. Minimum Preservation Obligation

Adopt this minimum: preserve readable bytes in place until success, expose truthful readable/preserved facts, recheck source identity immediately before destruction, and offer exact raw export before destructive recovery when that capability exists. Export is recommended but is not a prerequisite for the core recovery API; explicit informed confirmation may authorize destruction without exporting.

## 21. Protected Source Export Assessment

**Recommended, separately staged.** A future diagnostic export should contain the exact raw string and minimal non-authoritative metadata, not normalize or claim a valid DayFrame backup. It is valuable for corrupt and invalid readable sources. Defining its artifact format is outside this task and should not delay the core guarded transaction.

## 22. Existing Backup Export Distinction

**Confirmed.** `exportBackup()` serializes current authored runtime. Under protection this is the safe fallback or a subsequently loaded/edited session—not the protected raw checkpoint. It can preserve intended replacement state but cannot satisfy raw-source preservation.

## 23. Recovery Source Validation

Current-session replacement must project the complete authored setup and use `validateDayFrameAuthoredSetup` immediately before serialization. Invalid current state yields `notAttempted/invalidReplacement`; no persistence, status clearing, or runtime mutation occurs. No recovery-specific validator is created.

## 24. Advisory-Only Source Eligibility

Advisory-only current snapshots are valid replacement sources. A successful result and accepted ingress status retain cloned advisories. Advisories require disclosure where already customary but do not block recovery.

## 25. Recovery Atomicity

Atomicity is a store-level observable contract: while attempting, protection remains; success commits all metadata/runtime consequences synchronously; failure commits no ingress/runtime resolution. Browser local storage provides no cross-tab transaction or compare-and-set, so source comparison followed immediately by synchronous `setItem`/`removeItem` is best-effort, not distributed atomicity.

## 26. Recovery Ownership

The workflow chooses and confirms resolution. The store exclusively checks eligibility/freshness, validates replacement, invokes the factual helper, interprets its outcome, reconciles desired/durability/ingress state, updates runtime when required, notifies subscribers, and returns the exact result. Persistence helpers only report storage facts.

## 27. Guard Bypass Authority

Only the two dedicated recovery commands may call a narrowly scoped guarded replacement/removal path. They must not toggle a global guard, temporarily set ingress healthy, expose a `forceSave`, or route through ordinary retry. The guard remains active until durable success.

## 28. Replacement Failure Semantics

`unavailable` or `storageFailure` produces `notResolved` with the exact persistence outcome. Runtime remains unchanged, protected bytes and ingress status remain, desired condition is `snapshot`, and active durability records the real outcome. No state or ingress notification occurs.

## 29. Removal Failure Semantics

`unavailable` or `storageFailure` produces `notResolved`; current runtime is not reset, profiles are untouched, protection remains, desired condition is `absent`, and active durability records the real removal outcome. Reset happens only after `removed`.

## 30. Serialization Failure Semantics

Replacement serialization failure is a real attempted outcome but performs no storage write. It yields `notResolved`, active durability `serializationFailure`, desired `snapshot`, unchanged runtime/source/ingress, and no state or ingress notification. The next recovery activation revalidates and serializes the latest runtime; ordinary retry remains ineligible/protected.

## 31. Durability During Recovery

Precondition failures do not alter durability. Real write/removal outcomes update active durability using existing mapping. Success is `durable`; failure is `unavailable`, `storageFailure`, or `serializationFailure`. Profile durability never changes. Durability remains separate from `DayFrameState` and ingress truth.

## 32. Recovery Success Semantics

Replacement success leaves runtime/Preview untouched, sets desired `snapshot`, active durability `durable`, ingress `accepted` with current validation advisories, and enables normal persistence. Abandonment success resets active runtime/Preview to initial defaults while preserving profiles, sets desired `absent`, durability `durable`, ingress `noSource/resolvedByAbandonment`, and enables normal future writes.

## 33. Desired Durable Condition Reconciliation

The explicit command supersedes accumulated guarded intent: promotion establishes `snapshot`; abandonment establishes `absent`. Intent is set when a real attempt begins and retained on failure so infrastructure truthfully knows what was requested, but it cannot be executed by ordinary retry while protection remains. A later explicit recovery command may replace it.

## 34. Desired-Condition Matrix

| Recovery Action | Desired Condition During Attempt | On Success | On Failure |
| --- | --- | --- | --- |
| promote current session | snapshot | snapshot; checkpoint equals current snapshot | snapshot; retry only through explicit recovery |
| direct profile/backup replacement | snapshot | not adopted | not adopted |
| abandon/remove | absent | absent; active key absent | absent; explicit recovery still required |

## 35. Runtime State On Recovery

Promotion never changes runtime. Failed abandonment never changes runtime. Successful abandonment performs one reset to `createInitialDayFrameState()` while preserving cloned saved profiles, with `preview: null`. A future direct-source recovery, if authorized, should be durability-first and change runtime only after successful persistence.

## 36. Ingress Status Transition

Ingress status must become mutable infrastructure state. Only successful replacement/removal transitions it. Replacement goes to `accepted`; abandonment goes to `noSource` with a new reason that distinguishes explicit resolution from startup missing. Failures retain the exact recovery status/evidence. A source mismatch requires refreshed/reclassified protection, not acceptance.

## 37. State Subscriber Semantics

Promotion success/failure and abandonment failure emit no state notification because runtime does not change. Successful abandonment emits exactly one state notification after removal succeeds and reset commits. No intermediate reset is observable.

## 38. Durability Subscriber Semantics

A real outcome emits only if the active durability value changes, preserving existing deduplication. Precondition failure emits none. Success may emit `durable`; a repeated identical failure may emit none. Profile status is unchanged.

## 39. Retry After Failed Recovery

Ordinary `retryActivePersistence()` remains `notAttempted/recoveryProtected`. A user must explicitly invoke the recovery command again, preserving the destructive authority boundary. The repeated command uses fresh runtime and repeats source preflight.

## 40. Recovery Repeatability

Each activation performs at most one active operation. Failed attempts are repeatable with new explicit intent. After success, either recovery command returns `notAttempted/notRecoveryRequired` and performs no write/removal. Repeated clicks cannot become generic force persistence.

## 41. Recovery Source Freshness

Replacement always snapshots and validates runtime at invocation, never a cached session candidate. Profiles/backups are copied through their existing load/import paths, so later edits are included. Abandonment has no replacement snapshot. Both destructive operations require a fresh durable-source identity check.

## 42. Recovery Result Contract

Recommended common result:

```ts
type ActiveLocalRecoveryResult =
  | {
      status: "resolved";
      resolution: "replaceWithCurrentState";
      persistence: { status: "persisted" };
      ingress: Extract<ActiveLocalIngressStatus, { status: "accepted" }>;
    }
  | {
      status: "resolved";
      resolution: "abandonAndReset";
      persistence: { status: "removed" };
      state: DayFrameState;
      ingress: Extract<ActiveLocalIngressStatus, { status: "noSource" }>;
    }
  | {
      status: "notResolved";
      resolution: "replaceWithCurrentState" | "abandonAndReset";
      reason: "unavailable" | "storageFailure" | "serializationFailure";
      persistence: PersistenceWriteOutcome | PersistenceRemovalOutcome;
    }
  | {
      status: "notAttempted";
      reason:
        | "notRecoveryRequired"
        | "invalidReplacement"
        | "sourceUnreadable"
        | "sourceChanged";
      validation?: Extract<AuthoredSnapshotValidationResult, { status: "invalid" }>;
    };
```

Implementation may split the two command result types to avoid impossible persistence combinations. Only abandonment success includes state because only it changes runtime. Source change/unreadability are precondition facts, not fabricated persistence failures.

## 43. Candidate Store APIs

Adopt descriptive commands:

- `replaceProtectedActiveCheckpointWithCurrentState()`
- `abandonProtectedActiveCheckpointAndReset()`

Both are valid only during `recoveryRequired`. Avoid `forceSave`, `forceRetry`, and overloading `clearLocalData`. A future read-only `exportProtectedActiveCheckpoint()` is a separate capability.

## 44. API Comparison Matrix

| API Model | Explicit Authority | Runtime Freshness | Source Provenance | Complexity | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| current-state promotion only | high | high | current session | low | adopt with separate abandonment |
| direct source-specific recovery | high | candidate-time | profile/backup | medium/high | defer |
| hybrid | high | mixed | mixed | high | reject initially |

## 45. Recovery UI Authority

Future UI may render controls only while ingress is `recoveryRequired`. It gathers explicit confirmation, invokes one store command, and presents the returned truth. It never clears warnings/status itself or calls persistence helpers directly. Detailed UX is deferred.

## 46. Confirmation Requirements

One explicit confirmation per activation is sufficient if its wording names the exact consequence. Replacement: “Replace the protected saved setup with my current session.” Abandonment: “Permanently discard the protected saved setup and reset active setup.” Abandonment deserves stronger destructive presentation; no typed phrase is architecturally required.

## 47. Readable / Unreadable Risk Distinction

Readable sources can be identified, preserved, compared, and potentially exported. Unreadable sources are unknown and therefore higher risk. They require a successful reread before destruction; acknowledgement alone cannot substitute for knowing whether storage changed or is accessible. UI must expose this distinction and never promise export/preservation when false.

## 48. Pre-Recovery Source Recheck

**Required.** Retain an opaque in-memory identity for the startup protected value (exact string or collision-resistant digest plus necessary equality evidence). Immediately before write/removal, re-read the key and prove equality. Missing/different data yields `sourceChanged`; read failure yields `sourceUnreadable`. Reclassify/refresh before a new decision. Do not expose raw bytes through general ingress status.

## 49. Concurrent Storage Change Assessment

**Not found:** storage-event handling, multi-tab coordination, locks, or another production writer outside the store helpers. A second tab or external script can still modify local storage. Compare-before-replace materially reduces stale destruction, but Web Storage has no CAS, leaving a narrow check/write race. Document this browser limitation; distributed locking and storage-event synchronization are deferred.

## 50. Recovery Transaction Ordering

Replacement: eligibility → capture latest runtime → shared validation → re-read/compare protected source → set desired `snapshot` → factual write → on success durability then ingress transition → notify dedicated channels.

Abandonment: eligibility → re-read/compare source → set desired `absent` → factual removal → on success durability, runtime reset, ingress transition → one state notification plus dedicated changed-status notifications. Protection remains true through the storage operation.

## 51. Session-First Versus Durability-First Recovery

Adopt durability-first recovery. The normal session-first mutation rule remains valid for ordinary editing, but recovery's purpose is durable resolution. Current-session promotion already has its selected runtime; abandonment defers reset until removal success. Any future direct recovery must persist a validated candidate before making it runtime authority, avoiding a partially applied “recovery.”

## 52. Review-Before-Replace Assessment

The adopted flow lets a user load a valid profile/import a valid backup, edit, generate Preview, optionally export the current session as a normal backup, and only then authorize overwrite. This provides meaningful non-destructive review without adding a second candidate-state model.

## 53. Raw Source Export Recommendation

Provide exact protected-source export in a subsequent bounded task, but do not make successful download mandatory. Offer it before readable-source replacement/abandonment; disclose when unavailable. Keep it distinct from valid backup import and avoid asserting recoverability.

## 54. Recovery From Corrupt Data

Eligible actions are exact raw export when readable, current-session replacement, or abandonment/reset. No repair is inferred. Recheck exact bytes before destruction.

## 55. Recovery From Semantic Invalidity

Validator evidence may inform future repair, but current-session replacement or abandonment may proceed under explicit authority. The invalid historical data is never activated or silently normalized into validity.

## 56. Recovery From Ambiguity

Duplicate/ambiguous references receive the same explicit replacement/abandonment choices. Recovery does not choose a referent, remap IDs, or claim migration.

## 57. Recovery From Read Failure

No destructive attempt is permitted until a pre-recovery read succeeds. A newly readable value is classified and surfaced for renewed confirmation. Persistent read failure retains protection; the session remains usable but non-durable on the active surface.

## 58. Recovery Completion Evidence

Replacement evidence is explicit command authority, valid current snapshot, matching protected-source identity, `persisted`, active durability `durable`, desired `snapshot`, ingress `accepted`, and disabled guard. Abandonment evidence is explicit command authority, matching source, `removed`, active durability `durable`, desired `absent`, reset runtime, resolved no-source ingress, and disabled guard.

## 59. Migration-Evidence Separation

Recovery resolves only this store instance. It does not prove historical population migration, compatibility-reader retirement, semantic repair, a new format, or source-lifetime continuity. Compatibility retirement still requires separate evidence and governance.

## 60. Recovery Awareness On Success/Failure

On success the persistent warning disappears because the ingress subscriber observes a real transition; optional transient success is UX-only. On failure the warning remains and immediate feedback states the precise failure/precondition. No result is persisted as history.

## 61. Ownership Matrix

| Responsibility | Owner |
| --- | --- |
| choose resolution | user-facing workflow/user |
| validate replacement | shared validator invoked by store |
| preserve/export source | store read boundary; workflow offers export |
| execute write/remove | factual persistence helper invoked only by store |
| interpret persistence result | store |
| update durability status | store |
| reconcile desired condition | store |
| clear ingress protection | store, after durable success only |
| update runtime if applicable | store |
| present confirmation | UI workflow |
| present failure/success | UI from returned/subscribed truth |

## 62. Recovery Mode Matrix

| Recovery Mode | Replacement Source | Changes Runtime? | Durable Operation | Resolves Readable Invalid? | Resolves Read Failure? | Destructive? | Recommendation |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- |
| promote current session | current valid runtime | no | write | yes | after successful reread | yes | adopt |
| recover directly from profile | selected profile | maybe | write | yes | after reread | yes | defer; load then promote |
| recover directly from backup | parsed backup | maybe | write | yes | after reread | yes | defer; import then promote |
| abandon/reset | none/defaults | yes | remove | yes | after successful reread | yes | adopt |

## 63. Completion Matrix

| Attempt Outcome | Protection Clears? | Durability Update? | Runtime Change? | Next Action |
| --- | ---: | --- | ---: | --- |
| replacement persisted | yes | active durable | no | ordinary operation |
| replacement unavailable | no | active unavailable | no | explicit retry later |
| replacement storageFailure | no | active storageFailure | no | explicit retry later |
| replacement serializationFailure | no | active serializationFailure | no | correct/change session, explicit retry |
| abandonment removed | yes | active durable | reset once | ordinary operation |
| abandonment unavailable | no | active unavailable | no | explicit retry later |
| abandonment storageFailure | no | active storageFailure | no | explicit retry later |
| not recovery-required | no transition | none | no | use ordinary APIs |

## 64. Preservation Matrix

| Source Condition | Exact Raw Captured? | Export Possible? | Destructive Recovery Allowed? | Required Warning/Consent Level |
| --- | ---: | ---: | ---: | --- |
| semantic invalidity | yes | yes | after equality recheck | explicit destructive; offer export |
| corrupt JSON | yes | yes | after equality recheck | explicit destructive; emphasize unreadable format |
| structural invalidity | yes | yes | after equality recheck | explicit destructive; offer export |
| read failure | no initially | no initially | only after successful reread and renewed decision | heightened uncertainty; no false preservation claim |

## 65. Behavioral Invariants

1. Recovery begins only from `recoveryRequired` and requires explicit workflow/user authority.
2. Ordinary retry, mutation, profile load, backup import, and clear never become recovery.
3. Protection remains active throughout an attempt.
4. Replacement uses the latest complete semantically valid current snapshot.
5. A destructive attempt proves source freshness and performs exactly one active write/removal.
6. Failed or skipped resolution never clears protection or changes runtime.
7. Only `persisted`/`removed` clears protection.
8. Outcomes update durability truthfully and the explicit command owns desired intent.
9. Profiles are independent; abandonment never clears them.
10. Readable source stays unchanged until successful resolution; no data is silently repaired/remapped.
11. Success notifications reflect only committed changes.
12. Recovery completion is not migration or source-incarnation evidence.

## 66. Required Future Test Contract

Future tests must directly cover: healthy-store ineligibility; current state freshness and shared validation; advisory success; exact one-write/one-remove success; exact protected bytes on every failure; unavailable/storage/serialization failures; read-failure reread; missing/changed source rejection; successful status/durability/desired reconciliation; failed protection retention; ordinary retry still blocked; normal persistence after success; abandonment reset with profiles preserved; no `clearLocalData` coupling; Preview unchanged on promotion and cleared on reset; no state notification for promotion/failure; one state notification for successful reset; deduplicated durability notification; one ingress notification on success; no false UI success; control eligibility/confirmation/readability copy; and a best-effort external-change case.

## 67. OccurrenceIdentity Implications

OccurrenceIdentity remains runtime V1. Replacement regenerates future occurrences from the chosen authored state; this task neither changes identity syntax nor grants durable-reference continuity.

## 68. Source-Incarnation Implications

Replacement or abandonment is a new source-lifetime boundary in substance, but no incarnation field exists. Reused authored IDs across old/new checkpoints may represent different real entities. Recovery must not claim identity continuity; explicit incarnation design remains deferred.

## 69. PlanDecision Implications

No PlanDecision exists. Future durable decisions cannot safely survive arbitrary recovery replacement without source-incarnation and revalidation rules. Recovery should invalidate derived Preview as already specified only where runtime changes; durable decision behavior is deferred.

## 70. Compatibility Assessment

Core implementation can use the existing active key, current plural authored representation, validator, and persistence outcomes. It requires runtime API/status/result extensions but no active/profile/backup format or migration. Raw protected-source export may need a separately governed diagnostic artifact format. Singular compatibility readers remain unchanged.

## 71. Architectural Alignment Assessment

| Principle | Assessment | Basis |
| --- | --- | --- |
| explicit authority | Aligned | named commands and confirmations |
| user-data preservation | Aligned | preserve/recheck/offer export |
| epistemic integrity | Aligned | no success before durable fact |
| session-first runtime authority | Aligned | current session remains editing authority |
| durability truth | Aligned | factual outcomes retained separately |
| deterministic transition | Aligned | durability-first ordered commands |
| historical compatibility | Aligned | readers/formats unchanged |
| information provenance | Partially aligned | current-session truth clear; no persisted provenance needed |
| non-destructive recovery | Partially aligned | review/export available, final resolution necessarily destructive |
| source-incarnation separation | Unresolved/deferred | no incarnation model exists |

## 72. Open Questions

- Exact diagnostic raw-export envelope, filename, and browser delivery remain open.
- Whether to retain raw string or digest internally for comparison is an implementation choice; collision-free equality and export needs must govern it.
- Web Storage cannot eliminate the final compare/write race without broader coordination; storage events/locking remain deferred.
- The precise new `noSource` reason and refreshed-source UI flow require naming during implementation.
- Direct profile/backup recovery remains deferred pending demonstrated UX need.

None blocks the bounded core transaction because the adopted contract defines safe behavior: reject uncertain/stale source and retain protection.

## 73. Recommended Implementation Sequence

1. Implement mutable ingress transition infrastructure, protected-source identity/recheck, the two store commands, result unions, ordered desired/durability reconciliation, and direct store tests.
2. Add minimal recovery controls with separate confirmations and truthful immediate/persistent feedback.
3. Define and implement exact protected-source diagnostic export as a separate bounded capability.
4. Consider source-specific shortcuts only after product evidence; address storage-event coordination and source incarnation separately.

## 74. Recommended Next Task

**Task 2.20 — Implement Store-Owned Active-Local Recovery Replacement and Abandonment.** Scope it to current-session promotion, active-only abandon/reset, compare-before-replace, explicit results/status transitions, durability/desired-condition/subscriber semantics, and direct tests. Do not include UI or raw-export format in that core task.

## 75. Deviations

None. This task changed only this result artifact. No production code, tests, APIs, UI, durable data, governance documents, ADRs, `CURRENT_STATE.md`, `CHANGELOG.md`, or checkpoint was changed.

## 76. Discoveries and Deferred Work

**Confirmed:** ingress status is currently declared `const`; its subscription is prepared but cannot yet publish a recovery transition. The exact protected raw value is preserved only at the key, not retained in status. `clearLocalData()` resets runtime before attempting removals and clears profiles, so it cannot implement atomic active abandonment. Profile/backup runtime replacement already supplies a strong review-then-promote path. No storage event/multi-tab coordination was found.

**Deferred:** raw export format/UI; storage-event awareness or locking; direct source-specific recovery; repair/migration; profile raw-record preservation; source incarnation; PlanDecision; compatibility retirement.

## 77. Validation

- Task artifact: byte-identical saved copy; SHA-256 recorded above; immutable after work.
- Reference audit: covered every store-owned active writer via `persistActiveState`, active removal via `removeActiveState`, retry direct paths, `clearLocalData`, profile load/save, backup import/export, desired/durability/ingress state, UI warning, relevant tests, and repository-wide storage-event search.
- Test-file count before validation: 26.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed — 26 files, 441 tests.
- `npm run build`: passed — 46 modules transformed.
- `git diff --check`: passed.
- Task-specific executable/test changes: none.
- Governance changes: none.
- Earlier cumulative Phase 2 executable and documentation changes were present before Task 2.19 and preserved without modification.

## 78. Final Completion Determination

Task 2.19 is complete. The adopted contract gives DayFrame explicit, store-owned, durability-first replacement and abandonment authority; distinguishes initiation, attempt, and completion; preserves/rechecks protected evidence; reconciles desired and durability truth; defines runtime/status/subscriber/failure behavior; and bounds the next implementation seam without making any unauthorized executable change.

**The task is complete when DayFrame has an evidence-backed contract for explicitly replacing or abandoning a protected active-local historical checkpoint, has defined preservation requirements, recovery transaction/result semantics, durability and desired-condition reconciliation, protection-clearing authority, and failure behavior, and has made no unauthorized implementation change.**
