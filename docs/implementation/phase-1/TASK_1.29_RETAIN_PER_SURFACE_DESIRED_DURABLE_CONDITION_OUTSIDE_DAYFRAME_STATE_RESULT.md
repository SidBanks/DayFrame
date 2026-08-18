# Task 1.29 — Retain Per-Surface Desired Durable Condition Outside `DayFrameState` — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.29  
**Status:** Complete  
**Execution type:** Bounded implementation

---

# 1. Executive Result

The store now privately retains whether each durable surface currently intends a
complete runtime `snapshot` or key `absent`. Both surfaces initialize to snapshot,
ordinary persistence paths establish snapshot for only their affected surface, and
clear establishes absence for both regardless of removal outcome.

An immutable synchronous accessor directly protects the contract in tests and is
not consumed by production UI. No retry, subscription, persistence behavior,
runtime authority, durable format, or migration behavior changed.

---

# 2. Artifact Integrity

The immutable Task 1.29 attachment was verified complete at 1,790 lines and 37,678
bytes. It contains every required section and ends with the mandated completion
sentence. The saved project specification is byte-identical. SHA-256:

```text
87213506811bd646c4c0e804882c62d4927aacbd13d5fe24d6d59707ffe7d1e5
```

The specification remained unchanged.

---

# 3. Implementation Completed

Added the desired-condition types, private store-lifetime metadata, immutable read
boundary, affected-surface intent updates, clear absence integration, and focused
behavioral tests. Existing persistence calls remain the only durable operations.

---

# 4. Files Changed

- `code/src/state/types.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- `docs/implementation/phase-1/TASK_1.29_RETAIN_PER_SURFACE_DESIRED_DURABLE_CONDITION_OUTSIDE_DAYFRAME_STATE_RESULT.md`

No UI, persistence-format, migration, architecture, ADR, or governance file was
changed for Task 1.29. Pre-existing worktree changes were preserved.

---

# 5. Desired Durable Condition Contract

```ts
type DesiredDurableCondition = "snapshot" | "absent";

type StoreDesiredDurableCondition = {
  activeState: DesiredDurableCondition;
  profiles: DesiredDurableCondition;
};
```

There are exactly two surfaces and two values. No pending, dirty, failure, retry,
history, payload, timestamp, source, or command metadata was introduced.

---

# 6. Initialization Semantics

Default, hydrated, legacy-normalized, and explicitly seeded stores initialize:

```text
activeState = snapshot
profiles = snapshot
```

Task 1.27 durability status still initializes both surfaces to `unknown`. Snapshot
intent therefore makes no claim that persistence was attempted or succeeded.

---

# 7. Store-Lifetime Semantics

Desired condition is ephemeral closure state for one store instance. A new store
always begins with both surfaces at snapshot. It is neither persisted nor
rehydrated, and no storage key was added.

---

# 8. Active-State Integration

Every existing ordinary active persistence path sets active intent to snapshot
after applying its runtime transition and immediately before its existing
`persistState` call. Profile intent is not changed.

The operation matrix is:

| Operation | Active | Profiles |
| --- | --- | --- |
| Store initialization | `snapshot` | `snapshot` |
| Setup commit | `snapshot` | unchanged |
| Active narrow setter | `snapshot` | unchanged |
| Manual-event mutation | `snapshot` | unchanged |
| Profile save | unchanged | `snapshot` |
| Profile delete | unchanged | `snapshot` |
| Profile load | `snapshot` | unchanged |
| Backup import | `snapshot` | unchanged |
| Clear local data | `absent` | `absent` |
| Preview generation/revision | unchanged | unchanged |
| Backup export/read | unchanged | unchanged |

---

# 9. Setup Commit Integration

`commitAuthoredSetup` establishes active snapshot intent before its existing single
write. Its runtime transition, Preview staleness, durability mapping, one
notification, and `{ state, persistence }` result are unchanged.

---

# 10. Narrow Setter Integration

Scheduling preferences, Preview range, shift definitions, shift cycles, block
templates, and block recurrences all establish active snapshot intent. No
setter-specific intent was added.

---

# 11. Manual-Event Integration

`setManualEvents` establishes active snapshot intent because manual events are part
of the complete authored payload. No event-specific infrastructure state exists.

---

# 12. Profile Save Integration

`saveProfile` establishes profile snapshot intent before its existing complete
collection write. Active intent is unchanged. Snapshot remains the intent when the
write returns any failure category.

---

# 13. Profile Delete Integration

`deleteProfile` establishes profile snapshot intent, including when the resulting
collection is empty. It never means storage-key absence; only whole-surface clear
establishes absent.

---

# 14. Profile Load Integration

`loadProfile` establishes active snapshot intent only. It does not change profile
intent because the profile collection is a source and is not rewritten.

---

# 15. Backup Import Integration

`importBackup` establishes active snapshot intent only. No backup desired-condition
surface or retained source was introduced.

---

# 16. Clear Integration

Final clear ordering is:

```text
runtime reset
  → both desired conditions set to absent
  → active removal captured
  → profile removal captured
  → both durability statuses updated independently
  → aggregate calculated
  → one runtime snapshot notification
  → unchanged clear result returned
```

Both desired conditions remain absent for successful, partial, unavailable, and
failed removals.

---

# 17. Snapshot/Absence Semantics

`snapshot` means future ordinary durability work would derive the current complete
runtime representation for that surface. `absent` means clear established durable
key absence as the current intent. Neither value reports an outcome or authorizes
retry.

---

# 18. Mutation After Clear

An active mutation after clear replaces active absent with snapshot while leaving
profile absent unchanged. This replacement occurs even when the active write fails.

---

# 19. Profile Mutation After Clear

Profile save after clear replaces profile absent with snapshot while leaving active
intent unchanged. Ordinary delete also establishes snapshot, including the valid
current behavior of deleting a missing identifier from an empty collection.

---

# 20. Clear After Mutation

Clear replaces snapshot intent for both surfaces with absent, regardless of prior
ordinary active/profile operations or either removal outcome.

---

# 21. Latest-Intent-Wins Semantics

Only the latest operation affecting a surface determines that surface's condition:

| Prior | Operation | Result |
| --- | --- | --- |
| `snapshot` | clear | `absent` |
| `absent` | active mutation | active `snapshot` |
| `absent` | profile save/delete | profiles `snapshot` |
| any | clear | both `absent` |
| any | ordinary persisting mutation | affected surface `snapshot` |

No operation history is retained.

---

# 22. Relationship to Durability Status

Desired condition and Task 1.27 status remain independent. Tests directly establish
snapshot plus storage failure, absent plus storage failure, absent plus durable,
and partial-clear combinations. Existing exact outcome-to-status mappings are
unchanged.

---

# 23. Relationship to Mutation Results

Task 1.26 `StoreMutationResult` and `ClearLocalDataResult` types and values are
unchanged. Desired condition is not returned from mutations. Representative tests
continue asserting exact ordinary and clear result structures.

---

# 24. Read/Test Boundary

Direct behavioral proof required one narrow legitimate boundary because the future
retry consumer does not exist yet:

```ts
getDesiredDurableCondition(): StoreDesiredDurableCondition;
```

It is synchronous, returns a fresh object, performs no persistence, triggers no
notification, and exposes no mutable closure reference. It has no production UI
consumer and no subscription. This avoids brittle source-text assertions while the
underlying metadata remains private.

---

# 25. `DayFrameState` Separation

`DayFrameState` was not changed. Desired condition is absent from state clones,
subscriber payloads, authored setup, local persistence, profiles, backups,
scheduling inputs, and Preview results.

---

# 26. Subscriber Preservation

No desired-condition notification channel exists. Existing persisting operations
still notify ordinary state subscribers exactly once; accessor reads notify zero
times. Intent assignment itself never calls `notify()`.

---

# 27. UI Preservation

No production UI imports or calls the accessor. Setup, manual events, profiles,
backup workflows, clear feedback, navigation, and Preview behavior remain
unchanged.

---

# 28. Storage-Accessor Boundary

Storage-accessor exceptions remain unnormalized. Because runtime assignment and
intent assignment precede storage acquisition, an ordinary active mutation after
clear changes active intent to snapshot even if the accessor throws. The existing
exception still propagates, no factual durability outcome is fabricated, retained
durability remains at its prior value, and the ordinary notification after the
write is still skipped. A focused test records this exact boundary.

Clear sets both intents absent before its first removal accessor. If that accessor
throws, both intents already express the runtime reset, while the later removal,
status update, notification, and result do not occur. No exception semantics were
changed.

---

# 29. Migration Separation

Desired condition is store-session operational intent only. Snapshot or absence is
not a format marker, migration attempt, migration completion fact, population
evidence, or authority to retire compatibility readers.

---

# 30. Tests Added or Updated

Eleven focused tests were added, increasing `dayFrameStore.test.ts` from 47 to 58.
They cover:

- default/seeded snapshot initialization and accessor isolation;
- separation from durability status and `DayFrameState`;
- active mutation-after-clear with failed persistence and one notification;
- every ordinary active persistence category;
- profile save failure and delete-as-snapshot behavior after clear;
- profile-load and backup-import surface isolation;
- successful, partial, and fully failed clear absence intent;
- clear-after-snapshot replacement and exact clear result;
- reads, backup export, and Preview generation preserving intent; and
- intent behavior under the unchanged storage-accessor exception boundary.

Existing Task 1.26 and 1.27 tests continue protecting results and status behavior.

---

# 31. Reference Validation

Confirmed:

- exactly two surfaces and `snapshot | absent` values;
- both initialize to snapshot independent of storage;
- all ten active mutation categories establish active snapshot;
- save/delete establish profile snapshot;
- profile deletion never establishes absence;
- clear establishes both absent before existing removals;
- latest affected-surface intent wins;
- durability status and result types remain separate;
- no desired condition is serialized or rehydrated;
- no retry method, automatic retry, subscription, UI consumer, migration marker,
  new storage key, schema/version change, or compatibility change exists.

---

# 32. ADR Alignment Improvement

The store can now distinguish failed snapshot durability from failed absence
durability without retaining stale user operations or payloads. This improves
deterministic retry authority, clear correctness, non-destructive future retry,
recovery readiness, and epistemic integrity while preserving session-first runtime
authority and migration-evidence separation.

---

# 33. Deviations

No scope deviations. The optional synchronous accessor was introduced because
direct executable testing cannot observe private intent before retry exists. It
satisfies the task's expressly authorized read-boundary exception and remains
isolated from production UI and subscriptions.

---

# 34. Discoveries and Deferred Work

- Intent assignment correctly belongs before helper invocation because intent does
  not depend on outcome.
- The existing accessor-exception boundary leaves runtime and desired intent
  updated while skipping outcome retention and notification; this is documented,
  not changed.
- An empty ordinary profile collection is snapshot intent, distinct from clear.
- Retry APIs, storage-accessor normalization, automatic policy, durability
  subscriptions, UI feedback, recovery, migration, and compatibility work remain
  deferred.

---

# 35. Recommended Next Task

**Implementation Task 1.30 — Normalize Local-Storage Accessor Failures Into
Existing Persistence Outcomes.**

It should establish a consistent helper boundary for writes and removals while
explicitly deciding and protecting ordinary mutation/clear continuation and
subscriber behavior. It should not yet add retry APIs, UI, subscriptions,
migrations, or durable-format changes. Store-owned retry implementation should
follow once every attempt can truthfully return an existing outcome.

---

# 36. Validation

Focused validation:

```text
npm test -- src/state/tests/dayFrameStore.test.ts
Test Files  1 passed (1)
Tests      58 passed (58)

npx eslint src/state/types.ts src/state/dayFrameStore.ts \
  src/state/tests/dayFrameStore.test.ts
passed

npm run typecheck
passed

git diff --check -- affected executable files
passed
```

Repository-standard validation is recorded after final execution:

```text
npm run lint
passed

npm run typecheck
passed

npm test
Test Files  22 passed (22)
Tests      279 passed (279)

npm run build
passed (TypeScript validation and Vite production build; 42 modules transformed)
```

---

# 37. Final Completion Determination

Task 1.29 is complete from an implementation standpoint. The store retains current
snapshot/absence intent independently for active state and profiles, deterministically
replaces it from existing mutation and clear paths, exposes only an immutable read
snapshot, and preserves all current durability, runtime, result, subscriber, UI,
persistence-format, compatibility, and migration behavior without implementing
retry.
