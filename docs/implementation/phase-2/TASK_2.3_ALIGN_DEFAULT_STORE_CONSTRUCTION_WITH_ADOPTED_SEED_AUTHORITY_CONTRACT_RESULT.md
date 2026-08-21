# Task 2.3 Result — Align Default Store Construction With the Adopted Seed Authority Contract

## 1. Executive Result

Task 2.3 is complete. Ordinary no-prop `DayFrameApp` startup now constructs one standard `createDayFrameStore()` and performs no sample-data mutations. Neutral startup exposes empty authored collections, valid persisted authority survives unchanged, intentional emptiness and clear/restart remain empty, and existing seed-looking durable data is preserved.

Example scheduling content now exists only in an explicit UI-test fixture. No first-run marker, onboarding, demo mode, provenance, migration, durable-format change, store API change, or clear-semantics change was introduced.

## 2. Artifact Integrity

- Saved specification: `docs/implementation/phase-2/TASK_2.3_ALIGN_DEFAULT_STORE_CONSTRUCTION_WITH_ADOPTED_SEED_AUTHORITY_CONTRACT.md`
- Immutable attachment: `/home/sid/.codex/attachments/8f20bab3-d218-4cb3-a034-b2380200e478/pasted-text.txt`
- Pre-execution SHA-256 for both: `bbe812bcd024b4f7d24148e95c93175eb30c4985d1d746e57b49d253178ec816`
- The required title, metadata, sections, and exact closing sentence were present.
- The task specification was not modified.

## 3. Implementation Completed

- Replaced the internal default `createSeededDayFrameStore()` call with `createDayFrameStore()`.
- Removed the production seed helper and all four embedded demo object builders.
- Removed production imports used only by those builders.
- Added a test-local `createExampleScheduleStore()` and `ExampleScheduleApp` wrapper.
- Migrated only tests whose subject requires an existing example schedule.
- Changed real default-startup assertions to expect neutral empty state and preview guardrails.
- Added lifecycle regressions for no-write construction, complete rehydration, intentional empty state, clear/restart, seed-looking data, and profile separation.

## 4. Files Changed

- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- `docs/implementation/phase-2/TASK_2.3_ALIGN_DEFAULT_STORE_CONSTRUCTION_WITH_ADOPTED_SEED_AUTHORITY_CONTRACT_RESULT.md`

No store implementation, state type, persistence helper, engine, durable schema, or governance file changed.

## 5. Default Construction Before

```text
DayFrameApp without store prop
  → createSeededDayFrameStore()
  → createDayFrameStore()
  → setShiftDefinitions(example)
  → setShiftCycles(example)
  → setBlockTemplates(example)
  → setBlockRecurrences(example)
```

The four setters each mutated runtime authority, persisted a full active snapshot, retained a durability outcome, and notified.

## 6. Default Construction After

```text
DayFrameApp with store prop
  → supplied store

DayFrameApp without store prop
  → createDayFrameStore()
  → neutral defaults or rehydrated authored authority
```

The existing `useRef` lifetime and injected-store behavior are preserved.

## 7. Production Seed Helper Removal

`createSeededDayFrameStore`, `createDemoShiftDefinitions`, `createDemoShiftCycle`, `createDemoBlockTemplates`, and `createDemoBlockRecurrences` were removed from shipped UI code. Their now-unused `BlockRecurrence`, `BlockTemplate`, and `ShiftDefinition` imports were removed.

No dead production seed path remains solely for test convenience.

## 8. Production Caller Audit

- `main.tsx` still renders `<DayFrameApp />`.
- The no-prop path now directly constructs `createDayFrameStore()`.
- No production reference to `createSeededDayFrameStore` or the removed demo builders remains.
- No equivalent hidden sample setter sequence was introduced.
- The explicit fixture is defined only in `DayFrameApp.test.tsx` and is absent from the production import graph.

## 9. Test Fixture Strategy

The smallest maintainable scope was a local UI-test fixture:

- `createExampleScheduleStore()` creates a standard store with the former Day Shift, Day Rotation, Sleep, Errands, and recurrences supplied as explicit initial state.
- `ExampleScheduleApp` injects that store into `DayFrameApp`.
- Fixture construction itself performs no persistence writes because it uses explicit initial state rather than authored setter calls.

The explicit name communicates example/test semantics rather than product defaults.

## 10. Test Migration Audit

| Test class | Needs example data? | Result |
|---|---:|---|
| default shell / empty state | no | retained real `<DayFrameApp />`; now asserts no sample objects |
| default preview guardrail | no | retained neutral/explicit-empty store behavior |
| schedule generation, calendar range, stale preview | yes | injects `ExampleScheduleApp` |
| editing existing shift/template | yes | injects example fixture or retains its existing explicit store |
| clear confirmation that checks pre-clear value | yes | explicit example fixture, then existing clear path |
| clear/restart lifecycle | pre-clear only | persisted explicit example state, reconstructs real default app after clear |
| export assertions for former example payload | yes | explicit example fixture |
| durability/manual-event workflow requiring generated days | yes | explicit example fixture |
| profile/backup and specialized engine cases | varies | existing explicit stores preserved |

Twenty schedule-oriented usages were made explicit. Tests unrelated to example content were not mechanically converted.

## 11. Neutral Startup

With no active durable payload, default startup retains scalar/default scheduling preferences and preview range while producing empty shifts, cycles, templates, recurrences, and manual events. The current “No shifts yet” empty-state UI is visible. Former Day Shift, Day Rotation, Sleep, and Errands values are absent.

## 12. Persisted Startup Preservation

A new default-app regression preloads a complete custom active payload and verifies construction makes no `setItem` call, leaves the serialized payload byte-for-byte unchanged, and exposes the persisted custom preferences, range, shift, cycle, and template through the UI.

This directly protects the four collections formerly overwritten by seeding.

## 13. Seven-Field Authored Preservation

The complete persisted-startup test includes and protects:

1. scheduling preferences;
2. preview range;
3. shift definitions;
4. shift cycles;
5. block templates;
6. block recurrences;
7. manual events.

Manual events, shifts, and recurrences are additionally asserted from a rehydrated store snapshot; visible setup values cover the remaining UI-facing fields. No eager rewrite occurs.

## 14. Intentional Empty-State Preservation

A valid persisted payload containing empty authored collections is reconstructed through the real default app. The test verifies all sample values remain absent, the empty-state UI remains visible, no startup `setItem` occurs, and the serialized empty payload remains unchanged.

No collection-emptiness heuristic was added.

## 15. Clear/Restart Preservation

The mandatory lifecycle regression now:

1. starts from an explicitly persisted example schedule;
2. constructs the default app;
3. confirms Clear Local Data;
4. verifies the active key is removed;
5. unmounts and reconstructs the default app;
6. verifies the key remains absent and neutral empty state remains visible.

`clearLocalData()` itself was not changed.

## 16. Seed-Looking Persisted Data Preservation

The seven-field preservation payload deliberately uses former seed IDs including `shift_day`, `cycle_001`, `default_sleep`, and `rec_sleep`, but supplies custom user IDs, names, dates, durations, and behavior. Default startup preserves the exact serialized representation and displays the custom values.

Production code performs no ID/value scan, deletion, cleanup, or seed-origin inference.

## 17. Persistence-Write Behavior

Neutral and valid persisted default construction are both directly instrumented against `Storage.prototype.setItem`. Neither performs an active write. Reads and established in-memory normalization remain available, but no eager migration or rewrite was introduced.

Subsequent explicit user mutations continue to persist through existing store behavior.

## 18. Notification Behavior

Ordinary construction no longer calls any of the four authored setter paths. In the available-storage test environment, each such setter would synchronously call `setItem` and `notify`; the direct zero-write assertion therefore protects absence of the former mutation sequence rather than relying on React render counts before subscription.

No listener API or subscription behavior changed.

## 19. Preview Behavior

Normal default startup still has `preview = null`, performs no generation, and displays “No preview generated yet.” Existing persisted active data still cannot rehydrate preview. Explicit example tests can generate the same schedules through an injected fixture.

## 20. Generate Preview Guardrail

The neutral default path preserves existing incomplete-setup validation. It reports missing shift definitions and enabled templates instead of silently generating the former demo schedule. Guardrail logic and copy were not changed.

The former “generates a seeded preview” test was renamed to state that generation uses an explicit example schedule.

## 21. Profile Separation

A new regression preloads only versioned profile storage, constructs the default app, verifies the saved profile is present, verifies active authored state remains neutral/empty, and verifies no active key is created. Profile read/write formats and workflows are unchanged.

## 22. Backup/Replacement Preservation

Backup creation/import implementation was untouched. Existing tests for valid import, invalid import, runtime replacement, export payloads, and persistence outcomes continue to pass. Export tests that intentionally assert the former example payload now request the example fixture explicitly.

## 23. Durability Preservation

Store durability types, initial `unknown` status, desired `snapshot` condition, persistence outcomes, retry APIs, subscriptions, and workflow semantics were unchanged. The behavioral improvement is that startup no longer changes active durability knowledge through four sample write attempts.

All existing durability-awareness and retry tests pass.

## 24. Compatibility Preservation

No compatibility reader or normalizer changed. Historical singular `shiftCycle` ingress, profile compatibility, backup compatibility, manual-event normalization, and persisted default-sleep normalization remain intact. The complete store/UI and full suites pass.

## 25. No Migration / Provenance

No durable migration, version change, marker, provenance field, first-run state, demo mode, onboarding path, route, environment switch, or store API was added. Existing stored authored data—including data once produced by automatic seeding—is treated as user data.

## 26. Tests Added or Updated

Five focused UI tests were added:

- neutral default startup performs no persistence/mutation sequence;
- all seven fields and seed-looking data survive without rewrite;
- intentionally empty persisted state survives;
- clear followed by default reconstruction remains neutral;
- saved profiles rehydrate separately from neutral active state.

Existing default shell assertions now verify neutral state. Twenty schedule-dependent test sites use the explicit fixture. The explicit schedule-generation test continues to protect fixture ergonomics. The UI suite increased from 74 to 79 tests; the repository total increased from 366 to 371.

## 27. Reference Validation

- Production startup uses only `createDayFrameStore`: confirmed.
- Production seed helpers/references absent: confirmed by repository search.
- Neutral startup empty and no-write: directly tested.
- Persisted all-seven-field authority preserved: directly tested.
- Intentional empty and clear/restart preserved: directly tested.
- Seed-looking stored data untouched: directly tested.
- Profiles separate: directly tested.
- Injected-store semantics: preserved by existing extensive explicit-store coverage.
- No first-run/demo/onboarding/provenance/migration/API/format change: confirmed by diff audit.

## 28. Architectural Alignment Improvement

Initialization changed from:

```text
rehydrate authority → hidden sample mutations → repeated persistence
```

to:

```text
neutral defaults or rehydrated authority → stable, non-mutating startup
```

Active authored objects can now be treated as deliberate user/default authority without an unadvertised production example writer immediately replacing them.

## 29. Deviations

None. The implementation stayed within the expected UI production file, its UI test file, and the required result artifact. The store implementation did not require modification.

## 30. Discoveries and Deferred Work

The fixture could remain local because only the UI suite consumes the former example schedule. A broader test-fixture framework was unnecessary.

Deferred exactly as authorized: explicit demo/showcase mode, starter/onboarding UI, provenance, first-run detection, migrations, scalar/date default review, suggested-fix authority, and preview-revision authority.

## 31. Recommended Next Task

**Task 2.4 — Establish Suggested-Fix and Preview-Revision Authority.**

That investigation should decide whether accepting a fix is a disposable preview experiment, authored intent, a replayable command, or another explicit state class, and should define stale-preview action semantics before changing engine or state-container design.

## 32. Validation

- Focused UI suite: 79 tests passed.
- Focused store/UI regression: 2 files, 169 tests passed.
- Full suite: 23 files, 371 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; TypeScript and Vite production build completed.
- `git diff --check`: passed.
- Production seed/caller search: passed; only explicit test fixture references remain.
- No durable format, key, version, or store API changed.
- Governance documents and Tasks 2.1–2.3 specifications remained unchanged.

## 33. Final Completion Determination

**Complete.** Ordinary DayFrame startup now constructs an unseeded standard store from neutral defaults or rehydrated user-authored data, performs no hidden sample mutation or persistence, preserves intentional empty and cleared state across reconstruction, leaves existing seed-looking durable data untouched, and keeps example scheduling content exclusively in explicit test scope. All focused and full validation passed with no scope deviation.
