# Task 1.38 Result — Establish Serialization-Failure Recovery Semantics and User Recovery Boundaries

## 1. Executive Determination

**Recommended:** adopt the minimal safe recovery boundary (Option B). Current serialization failure is primarily a defensive boundary for unexpected/programmatically invalid runtime values, not a state supported production UI can realistically create. Phase 1 should preserve current session intent and the last durable checkpoint, keep recovery-required awareness non-retryable, permit ordinary edited mutations to converge naturally, and explicitly communicate session-end risk. It should not build current-schema repair mechanics before the authored-data redesign.

## 2. Artifact Integrity

- Source: `TASK_1.38_ESTABLISH_SERIALIZATION_FAILURE_RECOVERY_SEMANTICS_AND_USER_RECOVERY_BOUNDARIES.md`
- Pre-investigation SHA-256: `47e050364cce9471edaff34227ac42d4ca6d59e2ec07228de399176e89ec3bfa`
- Supplied attachment and saved project artifact matched byte-for-byte.
- All required sections and the required final sentence were present.
- Post-investigation hash remained `47e050364cce9471edaff34227ac42d4ca6d59e2ec07228de399176e89ec3bfa`.

## 3. Evidence Reviewed

Reviewed active/profile persistence, store mutation and retry paths, authored/profile cloning, backup creation/import/download, current authored types and UI construction, serialization fixtures, retained-status/classifier tests, persistent awareness, retry-control tests, and the durable-data ADR lineage from Tasks 1.28–1.37.

Evidence labels below mean: **Confirmed** from executable code/tests; **Inferred** from implementation structure; **Recommended** architectural policy; **Deferred** intentionally postponed; **Unresolved** insufficient evidence.

## 4. Serialization Failure Producer Inventory

| Producer | Serialization/input | Runtime source | Production reachability |
| --- | --- | --- | --- |
| `persistState` | `JSON.stringify(PersistedDayFrameState)` | Current active authored fields; Preview and profiles excluded | **Confirmed** outcome producer. Supported UI creates plain typed data; realistic user reachability not found. |
| `persistProfiles` | `JSON.stringify(createDayFrameProfilesStorage(savedProfiles))` | Entire runtime profile collection, each containing authored setup | **Confirmed** outcome producer. One invalid profile blocks the collection. Realistic supported-UI reachability not found. |
| Active snapshot retry | Calls `persistState(current state)` | Latest runtime active state | **Confirmed** can transition retryable failure into serialization failure when an invalid state was injected. |
| Profile snapshot retry | Calls `persistProfiles(current profiles)` | Latest runtime collection | **Confirmed** uses the same profile producer; theoretical transition is equivalent. |
| Backup download | UI `JSON.stringify(DayFrameBackupV1, null, 2)` | Cloned active authored setup | **Confirmed** can throw, but does not return the durability outcome and is not a `serializationFailure` producer. |

`JSON.stringify` can throw for `BigInt`, circular graphs, or throwing `toJSON`/property access. Functions, symbols, `undefined`, `NaN`, and infinity can instead be omitted/coerced rather than throw. These are JavaScript possibilities, not supported DayFrame user states.

Important boundary detail: `persistState` constructs/clones its payload before its stringify `try`; a malicious throwing accessor during cloning could escape rather than become `serializationFailure`. `persistProfiles` performs storage-object creation inside its guarded expression, although profile creation may clone earlier. This is **defensive-boundary incompleteness**, not a supported production recovery case.

## 5. Active-State Serialization Boundary

**Confirmed:** active mutations assign the valid runtime transition, retain snapshot intent, then call `persistState`. A stringify failure returns `serializationFailure`, updates retained active durability, and still notifies/returns the applied runtime state. Persisted active payload includes authored setup and manual events; it excludes Preview and saved profiles.

## 6. Profile Serialization Boundary

**Confirmed:** profile save/delete update the runtime collection before `persistProfiles`; serialization failure leaves that runtime collection current for the session. Save clones current active authored data into the profile. Delete serializes the remaining whole collection. Profile load is an active-state write, not a profile-collection write.

## 7. Production Reachability

Classification: **B — primarily a defensive boundary for unexpected runtime/programming state**.

- UI forms construct strings, booleans, numbers, arrays, and plain objects.
- Manual events contain typed primitives.
- current UI-created block templates use empty resource arrays; no UI creates arbitrary metadata values.
- persisted hydration originates from JSON, which cannot contain `BigInt`, functions, circular references, or executable `toJSON`.
- backup import starts with JSON parse and normalization, likewise producing plain data.
- the store’s public TypeScript boundaries constrain values but cannot guarantee runtime callers obey them.

No supported production UI path to an unserializable authored value was found. Programmatic misuse, future integrations, or future model changes can still reach the defensive boundary.

## 8. Current Failure Injection Strategy

**Confirmed:** the concrete store fixture casts `1n` into `ExternalResource.metadata`, whose declared value type is `string`. This is explicitly test-only invalid data. UI recovery-required tests otherwise override outcomes/statuses or use an injected result seam. No production fixture naturally creates the failure.

## 9. Runtime Preservation

**Confirmed:** for JSON failures that reach the outcome boundary, latest active mutations and profile collection changes remain in memory and are returned/notified. Recovery therefore begins with potentially valuable latest session intent.

## 10. Durable Checkpoint Preservation

**Confirmed:** both writers complete serialization before calling `setItem`; tests establish no `setItem`/new key on serialization failure. Therefore serialization failure does not overwrite or destroy the prior durable value.

Normative invariant:

> Serialization failure must never destroy or overwrite the last successfully durable representation.

## 11. Session-End Risk

**Confirmed/inferred:** active non-durable intent exists only in the current store instance. Reload/close discards it; the next store rehydrates the older durable active checkpoint, or defaults if none exists. Preview is derived and intentionally not a recovery target.

## 12. Profile Session-End Risk

**Confirmed/inferred:** runtime profile saves/deletes that failed serialization are lost at session end. The older durable collection rehydrates. A failed save disappears; a failed delete may reappear. This differs from active intent but has the same checkpoint-age risk.

## 13. Candidate Recovery Models

Recovery is an explicit representation change, source selection, or preservation action. It is not unchanged retry, automatic rollback, clear, or reload.

## 14. Recovery Candidate Matrix

| Recovery Candidate | Preserves Current Session Intent | Uses Existing Durable Checkpoint | Works If Current State Cannot Serialize | Destructive Risk | Model Coupling | Recommendation |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Edit and persist again | Yes, except edited part | No | Potentially, if bad value is removed | Low | Low | Primary generic path; no promise without diagnostics |
| Export current runtime | Yes | No | No guarantee; same shape/stringifier | Low | Low | Do not present as universal escape hatch |
| Diagnostic/sanitized export | Potentially | No | Potentially | Low | Medium | Preserve architectural room; defer design |
| Revert to durable active state | No unless preserved separately | Yes | Yes | High | Low | Explicit future option only |
| Load profile | Replaces active intent | Yes, profile checkpoint | Yes if selected profile serializes | High | Medium | Optional explicit source, never automatic |
| Import backup | Replaces active intent | External checkpoint | Yes if backup validates/serializes | High | Medium | Optional explicit source, never automatic |
| Reset/clear | No | Destroys/removes checkpoints | Yes by replacement/removal | Very high | Low | Not normal recovery |
| Reload application | No | Yes | Rehydrates older state | High/silent | Low | Not recovery; warn against as harmless action |

## 15. Edit-And-Repersist Viability

**Recommended with limitation:** an ordinary mutation is sufficient when it removes/replaces the unserializable value; successful persistence naturally changes retained status to durable and completes recovery. An unrelated edit cannot fix a hidden invalid value, and current outcomes identify no field. The current test value is in metadata not directly editable in UI, so edit-and-resave is viable as a generic principle but not a guaranteed current repair mechanism.

## 16. Current Runtime Export Viability

**Confirmed:** `exportBackup` clones the same active authored shape and UI download then calls `JSON.stringify`. A `BigInt` or circular value that defeats active persistence also defeats backup download; clone-time accessors may fail even earlier. Current backup export is not a reliable recovery-preservation path after serialization failure.

## 17. Diagnostic/Sanitized Export Viability

**Deferred:** a defensive diagnostic or sanitized export could preserve some information, but requires explicit rules for lossy values, paths, privacy, and validation. The architecture should allow a future dedicated operation; normal backup semantics must not silently sanitize.

## 18. Last-Durable-State Reversion

**Inferred feasible, not currently exposed:** storage retains the checkpoint, but the store has no dedicated non-destructive checkpoint-read/revert operation. Reversion would replace newer runtime intent and must require explicit consent plus a preservation opportunity where feasible. Never automatic.

## 19. Profile Recovery Sources

- **Active failure:** a known-good saved profile can be an explicit replacement source, but loading it discards current active intent and then attempts active persistence.
- **Profile failure:** the older durable profile collection is the checkpoint; current APIs do not expose a safe compare/revert recovery flow.
- Saving current active state as a new profile is **not** generic active recovery: it embeds the same problematic authored representation and can make the runtime profile collection non-durable too.

## 20. Backup Recovery Sources

An existing external backup can be an explicit active-state replacement source. Import validates and clones it, then persists active state. It can be older than session intent and contains no saved-profile collection, so it is not a profile recovery source. Creating a new backup from the failing runtime state is not reliably viable.

## 21. Reset/Clear Risk

Clear resets runtime and removes both durable keys without serialization. It can eliminate the technical condition while destroying latest intent and checkpoints. **Recommended:** never describe clear as normal serialization recovery; any emergency destructive use requires separately designed confirmation and preservation warnings.

## 22. Reload Risk

Reload is a rollback-by-session-loss, not recovery. It silently replaces latest non-durable runtime intent with an older checkpoint/default. It must not be recommended as harmless troubleshooting.

## 23. Active Versus Profile Recovery

Active recovery has possible user-selected sources: current editable intent, durable active checkpoint, saved profile, and external backup. Profile recovery concerns an atomic collection: current runtime collection versus prior durable collection. Backups do not contain profiles, and active/profile replacement choices must not be unified into one generic restore command.

## 24. Profile Collection Atomicity

**Confirmed:** the whole collection is cloned and stringified as one document. One invalid runtime profile prevents any save/delete snapshot from becoming durable. Future isolation/removal may be useful, but identifying the offending profile/field is model-specific and unsupported by current outcomes.

## 25. Recovery Authority

Persistence helpers report/write only. The store owns runtime truth and ordinary mutation/persistence. A workflow or dedicated recovery surface presents choices. The user authorizes destructive/state-replacing choices. A future store-owned recovery operation executes the selected change; persistence then establishes durability.

## 26. Recovery Entry-Point Recommendation

**Recommended:** keep persistent recovery-required awareness as the stable entry point, but use a dedicated recovery explanation/panel if choices are later added. Recovery is too consequential for inline Retry-like buttons or duplicated originating-workflow controls.

## 27. Recovery Completion Semantics

No new status is needed. Recovery completes when an explicit edit/source selection produces an ordinary successful persistence result, retained durability becomes `durable`, and existing subscription-driven awareness disappears.

## 28. Recovery Safety Principles

Adopt all seven proposed principles:

1. Never automatically discard current runtime intent.
2. Never overwrite the last durable checkpoint with known-unserializable data.
3. Never describe reload as harmless after known non-durable changes.
4. Require explicit consent for destructive/state-replacing recovery.
5. Preserve independent recovery sources.
6. Allow ordinary successful mutation to resolve recovery-required state naturally.
7. Defer model-specific repair until the authored model stabilizes unless production reachability changes.

Also preserve authored intent, not recomputable Preview/schedule output.

## 29. Raw Diagnostic/Error Boundary

The outcome retains only `serializationFailure`; it has no error, path, entity, or cause. Field diagnosis is currently impossible. Do not expose raw exceptions: they may leak internals/data, are unstable, and are not necessarily actionable. A future diagnostic contract should use stable, privacy-reviewed structured facts.

## 30. User Communication Requirements

Future recovery-required UI must communicate, without claiming data loss:

- current session changes remain active;
- they are not durably saved;
- ordinary Retry is unavailable;
- reload/closing can lose those session changes and return to an older checkpoint;
- any replacement/reset choice is explicit.

## 31. Reload/Close Warning Determination

**Recommended:** persistent recovery-required awareness should explicitly warn about reload/close risk. A browser `beforeunload` prompt is premature and intrusive because supported production reachability is not established and browser prompts have limited/customization semantics. Reassess unload protection if integrations or the future model make this condition realistically reachable.

## 32. Future-Engine Coupling Assessment

Preservation, explicit consent, recovery-versus-retry, and durable convergence are stable. Field/entity diagnosis and repair depend strongly on the future authored model.

## 33. Future-Coupling Matrix

| Principle/Mechanism | Coupling | Survives redesign? | Phase 1 recommendation |
| --- | --- | ---: | --- |
| Preserve runtime intent | Low | Yes | Adopt now |
| Preserve durable checkpoint | Low | Yes | Adopt now |
| Edit and persist again | Low | Yes | Adopt as generic path |
| Generic recovery surface | Low/medium | Likely | Communication only next |
| Field-specific repair | High | No guarantee | Defer |
| Entity-specific diagnostics | High | No guarantee | Defer |
| Profile isolation/removal | Medium/high | Unclear | Defer |
| Backup restore | Medium | Likely concept survives | Keep as explicit source, no new flow now |
| Reset | Low mechanically | Yes, but unsafe | Exclude from normal recovery |

## 34. Model-Specific Work To Defer

Intentionally wait for the authored-data architecture to establish:

- field-path and entity-specific serialization diagnostics;
- editors for shift/cycle/template/recurrence/manual-event repair;
- invalid-profile isolation and selective collection reconstruction;
- sanitization/lossy-export rules;
- mapping engine/authored entities into recovery presentation;
- schema-specific checkpoint diffing;
- automatic repair or migration of invalid values.

## 35. Minimum Phase 1 Recovery Obligation

Choose **Option B — Minimal Safe Recovery Boundary**:

- keep persistent, surface-specific recovery-required awareness;
- keep ordinary Retry absent;
- preserve runtime intent and durable checkpoints;
- keep the session usable and allow ordinary edits to converge;
- add explicit reload/close/session-loss risk communication;
- add no repair, reset, rollback, export guarantee, or model-specific recovery control.

Because reachability is defensive, a full recovery implementation is not justified in Phase 1. Communication is the one remaining minimum obligation.

## 36. Required Recovery Decision Matrix

| Condition | Ordinary Retry? | Continue Session? | Editing May Resolve? | Explicit Recovery Needed? | Destructive Risk | Recommendation |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Active serialization failure | No unchanged retry | Yes | Yes, if invalid value changes | Only for replacement/rollback | High for source replacement | Preserve both representations; communicate session risk |
| Profile serialization failure | No unchanged retry | Yes | Yes, if offending profile/value changes | Possibly for collection repair/revert | High; atomic collection | Preserve runtime and durable collection; defer diagnosis |
| Retry transitions to serialization failure | Stop retry | Yes | Yes | Same as affected surface | Same as surface | Transition to recovery awareness; no loop |

## 37. Ownership Map

| Responsibility | Owner |
| --- | --- |
| Detect serialization failure | Persistence writer boundary |
| Retain durability status | DayFrame store |
| Preserve current runtime truth | DayFrame store/session |
| Preserve durable checkpoint | Persistence writer ordering/storage |
| Present recovery-required awareness | Persistent app workflow surface |
| Choose recovery action | User, informed by recovery workflow |
| Execute state-changing recovery | Future store-owned recovery/mutation boundary |
| Persist repaired/replaced state | Existing store persistence boundary |
| Diagnose model-specific invalid data | Future diagnostic/domain layer |
| Decide destructive reset | User through separately authorized, explicit workflow |

## 38. ADR Alignment

The contract preserves user data, avoids destructive defaults, retains checkpoints, separates runtime from durability, keeps recovery explicit, and avoids unsupported causal claims or premature schema coupling.

## 39. Unresolved Questions

- Whether future integrations can introduce non-plain runtime values.
- Whether the redesigned authored model needs structured serialization diagnostics.
- Whether a generic lossless diagnostic representation is feasible.
- Whether production reachability later warrants unload protection.
- How a future UI preserves current intent before checkpoint reversion.

## 40. Deviations

None. Investigation only; no executable behavior or test was modified.

## 41. Discoveries and Deferred Work

- Active payload cloning occurs outside the stringify guard, so some exotic clone-time exceptions are not normalized as `serializationFailure`.
- Backup download has no equivalent structured serialization outcome and can fail on the same bad authored value.
- Backup V1 excludes saved profiles.
- Profile save can spread an active serialization problem into the runtime profile collection.
- These findings are deferred because no supported production path creates the malformed values and changes were prohibited.

## 42. Recommended Next Task

**Task 1.39 — Clarify Recovery-Required Session-Risk Communication.** Add only concise active/profile-appropriate communication that current session changes may be lost on reload/close and older durable data may return. Do not add repair, rollback, reset, export promises, or unload interception.

## 43. Validation

- Targeted semantic/store/UI regression: 3 files, 189 tests passed.
- Full suite: 23 files, 363 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 43 modules transformed.
- Task 1.38 introduced no production-code, test, UI, persistence, retry, format, key, migration, or `DayFrameState` changes.
- Task specification remained immutable; result artifact is separate.

## 44. Final Completion Determination

Task 1.38 is complete. DayFrame now has an evidence-backed recovery contract: preserve latest runtime intent and the prior durable checkpoint; treat unchanged retry, reload, reset, and automatic rollback as unsafe or incorrect; allow ordinary edited persistence to complete recovery; distinguish active recovery sources from atomic profile-collection recovery; communicate session-end risk; and defer field/entity-specific diagnostics and repair until the authored-data architecture stabilizes.
