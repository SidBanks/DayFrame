# Task 2.3 — Align Default Store Construction With the Adopted Seed Authority Contract

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.3

**Task Name:** Align Default Store Construction With the Adopted Seed Authority Contract

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_2.3_ALIGN_DEFAULT_STORE_CONSTRUCTION_WITH_ADOPTED_SEED_AUTHORITY_CONTRACT_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* default-store construction before and after;
* seed-helper removal or relocation;
* production caller audit;
* test-fixture changes;
* persisted-startup preservation;
* neutral-startup behavior;
* empty-state preservation;
* clear/restart behavior;
* persistence-write behavior;
* notification behavior;
* seed-looking persisted-data preservation;
* Preview behavior;
* durability behavior;
* validation;
* deviations;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding first-run markers, onboarding, demo mode, provenance, migration, new durable formats, new store APIs, or changes to clear semantics, stop the affected work and record the discrepancy rather than expanding Task 2.3.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Decision;
* Objective;
* Production Change;
* Test-Fixture Strategy;
* Persisted-Startup Invariants;
* Empty/Clear Invariants;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when ordinary DayFrame startup constructs an unseeded store from neutral defaults or rehydrated user-authored data, performs no hidden sample-data mutation or persistence, preserves intentional empty and cleared state across restart, leaves existing seed-looking persisted data untouched, and moves example scheduling content into explicit test/demo fixtures only where deliberately requested.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity discrepancy for project review.

---

# Purpose

Implement the authority contract adopted by Task 2.2.

Task 2.2 confirmed that ordinary production startup currently:

```text
rehydrates authored state
    ↓
silently replaces four authored collections
    ↓
persists four complete snapshots
```

through unconditional demo/sample seeding.

That behavior is architecturally invalid because:

* rehydrated user-authored data is already authoritative;
* intentional empty state is valid authority;
* Clear Local Data communicates neutral/empty state;
* no first-run/demo mode exists;
* sample objects have no provenance;
* sample content is not neutral structural state.

Task 2.3 removes that hidden startup mutation.

---

# Governing Decision

Task 2.2 adopted:

1. normal startup must use standard `createDayFrameStore()`;
2. rehydrated user-authored state must remain unchanged;
3. neutral defaults/empty collections are valid authority;
4. intentional emptiness must survive restart;
5. sample data may enter authored authority only through explicit future adoption or explicit demo/test composition;
6. existing persisted seed-origin data is user data and must not be cleaned up;
7. no marker, demo mode, onboarding, migration, or provenance system is required for this correction.

Task 2.3 implements only that contract.

---

# Objective

Make the smallest production change necessary to ensure:

1. `DayFrameApp` default construction uses `createDayFrameStore()`;
2. no sample/demo authored setters run during ordinary startup;
3. persisted authored state survives startup unchanged;
4. no-storage startup remains neutral/empty;
5. intentionally empty persisted state remains empty;
6. clear followed by reconstruction remains empty;
7. ordinary startup performs no hidden active persistence write;
8. ordinary startup performs no hidden authored mutation notification;
9. tests that need example data request it explicitly;
10. existing seed-looking durable data remains untouched.

---

# Production Change

The current conceptual production path is:

```text
DayFrameApp
    ↓
createSeededDayFrameStore()
    ↓
createDayFrameStore()
    ↓
setShiftDefinitions(...)
setShiftCycles(...)
setBlockTemplates(...)
setBlockRecurrences(...)
```

The required path is:

```text
DayFrameApp
    ↓
createDayFrameStore()
```

when no explicit store prop is supplied.

No other startup mutation should replace the removed seed writes.

---

# DayFrameApp Default Construction

Change the no-prop store initialization so it creates one standard persisted store.

Preserve current injected-store behavior:

```text
store prop supplied
    → use supplied store

store prop absent
    → createDayFrameStore()
```

Do not change store injection semantics.

---

# Seed Helper Removal

If `createSeededDayFrameStore()` becomes unreachable from production after the default-construction change:

* remove it from production code;
* remove now-unused imports/constants/helpers from production modules;
* do not preserve dead production code merely for tests.

If example builders are still useful for tests, move or recreate them in explicit test-fixture code rather than retaining production startup authority.

---

# Seed Content Preservation For Tests

Tests may still need the former example content.

Where needed, create/use an explicit fixture equivalent to:

```text
createExampleDayFrameStore()
createSeededTestStore()
```

or equivalent repository-consistent naming.

The fixture may:

* construct a standard store;
* explicitly set sample shifts/cycles/templates/recurrences;
* support tests whose subject requires an existing schedule.

The fixture must live in test/support scope, not ordinary product startup.

---

# Test Meaning Standard

Do not mechanically convert every default `DayFrameApp` test into a seeded fixture.

Classify each affected test:

## Neutral-startup test

If the test does not require Day Shift / Sleep / Errands, keep it on the default app/store path.

This should now exercise real neutral product startup.

## Example-schedule test

If the test specifically requires schedule/example content, inject an explicit seeded fixture store.

This makes fixture dependency intentional.

## Existing explicit-store test

Preserve its current explicit composition unless the test itself is stale.

---

# Persisted Startup Preservation

Add direct regression coverage proving persisted authored state survives default app reconstruction unchanged.

At minimum preserve:

* scheduling preferences;
* preview range;
* shift definitions;
* shift cycles;
* block templates;
* block recurrences;
* manual events.

The test should establish that ordinary app construction does not replace any of the four previously seeded collections.

---

# Persisted Seed-Looking Data Preservation

Add direct coverage proving durable data whose IDs/values resemble former seed content is not removed or rewritten merely because it looks seeded.

Example:

```text
persisted shift_day
persisted default_sleep
```

must remain exactly as stored/normalized through ordinary startup.

Do not add cleanup logic.

---

# Neutral Startup

With no usable active durable data, ordinary default startup must produce the neutral store defined by `createInitialDayFrameState()`.

Expected authored collections:

```text
shiftDefinitions = []
shiftCycles = []
blockTemplates = []
blockRecurrences = []
manualEvents = []
```

Preserve scalar/default scheduling preferences and preview-range behavior from current initialization.

Do not redesign those defaults in Task 2.3.

---

# No-Write Startup

Directly test that neutral/default startup performs no hidden `setItem` write merely because the app was constructed.

Rehydration reads may occur.

A user mutation later may persist normally.

This test is important because Task 2.2 established that current seed writes made startup mutating.

---

# Persisted-Startup No-Write Semantics

Ordinary startup with valid persisted active state should rehydrate without immediately rewriting it merely because the app mounted.

Existing normalizers may transform data in memory according to established behavior, but Task 2.3 must not introduce eager migration or rewrite behavior.

Do not conflate seed removal with migration.

---

# Notification Behavior

Ordinary default store construction should not perform post-construction authored mutation notifications.

Because no store subscribers may yet exist, test the underlying mutation/write absence rather than relying only on React render counts.

If a direct store-construction path can be instrumented, establish that the default app does not call authored setters during construction.

---

# Intentional Empty-State Preservation

Add direct coverage for a persisted authored state whose relevant collections are intentionally empty.

After reconstruction they must remain empty.

Do not infer that emptiness means onboarding/first run.

---

# Clear → Restart

This is mandatory.

Test:

```text
existing state
    ↓
clearLocalData()
    ↓
runtime neutral / durable keys removed
    ↓
unmount / reconstruct default app
    ↓
neutral state remains neutral
```

No former samples may reappear.

This closes the lifecycle defect identified by Task 2.2.

---

# Clear Semantics Preservation

Do not alter `clearLocalData()` itself.

Current clear behavior remains:

* reset runtime to `createInitialDayFrameState()`;
* clear profiles;
* clear preview;
* set desired durable conditions to `absent`;
* remove active/profile durable keys;
* retain exact durability outcomes.

Task 2.3 changes only what happens on later ordinary reconstruction.

---

# Preview Behavior

Ordinary startup remains:

```text
preview = null
```

under normal persisted/local behavior.

No preview generation should occur automatically.

Do not add starter preview generation.

Tests that previously depended on seed-generated preview capability must explicitly supply sample authored data before calling generation.

---

# Generate Preview Guardrails

Any default-app test that previously assumed generation succeeds because sample cycles/shifts existed should be updated to reflect neutral startup.

If current product behavior prevents generation without required authored inputs, preserve that guardrail.

Do not weaken validation merely to keep old seeded tests passing.

---

# Setup Empty-State UX

Preserve and test current empty-state behavior where practical, such as:

```text
No shifts yet.
```

or equivalent existing copy.

Do not redesign onboarding or blank-state UX.

The neutral state becoming visible is an intended consequence of fixing startup authority.

---

# Profile Behavior

Profiles remain separate.

Task 2.3 must not alter:

* profile persistence;
* profile save/delete/load;
* profile replacement semantics;
* profile compatibility readers.

A default startup may still rehydrate saved profiles while active authored state remains neutral or separately rehydrated.

---

# Backup Behavior

Do not alter backup creation/import.

Imported active state that was previously persisted must survive later restart unchanged now that automatic seeding is removed.

Where appropriate, preserve or add regression evidence through existing replacement tests.

---

# Durability Behavior

Removing seed writes means ordinary startup should no longer change active durability knowledge through sample persistence attempts.

Store construction still initializes retained durability according to existing semantics.

Do not alter:

* `StoreDurabilityStatus`;
* desired durable condition;
* persistence outcomes;
* retry APIs;
* durability subscriptions;
* workflow semantics.

---

# Existing Persisted Data

Do not migrate or rewrite already persisted data as part of Task 2.3.

This includes data originally created by automatic seeding.

The rule is:

```text
stored authored data
    = user data
```

unless a future explicit migration with reliable provenance authorizes otherwise.

---

# Seed IDs

Do not scan for:

* `shift_day`;
* `cycle_001`;
* `default_sleep`;
* `template_errands`;
* `rec_sleep`;
* `rec_errands`;

or equivalent former seed identities in production startup.

These IDs cannot prove disposability.

---

# Test Fixture Placement

Prefer a test-support location consistent with current repository organization.

Possible examples:

```text
src/test/
src/testFixtures/
src/ui/tests/fixtures/
```

Do not create a broad fixture framework unless needed.

A small helper local to `DayFrameApp.test.tsx` may be sufficient if reuse is limited.

Choose the smallest maintainable scope.

---

# Example Fixture Semantics

If a reusable seeded test fixture is introduced, make the naming explicit that it is test/example data.

Avoid ambiguous production-style names such as:

```text
createDefaultStore
```

Prefer names equivalent to:

```text
createExampleScheduleStore
createSeededTestStore
```

The fixture is not product authority.

---

# Production Seed Builder Removal

If former seed builders are currently embedded in `DayFrameApp.tsx`, remove them if production no longer consumes them.

Do not leave unused example object factories in shipped UI code solely because tests once received them implicitly.

---

# Test Migration Audit

Inventory every test affected by removal of automatic seeds.

For each, classify:

| Test                          |                 Needs Example Data? | New Setup                              |
| ----------------------------- | ----------------------------------: | -------------------------------------- |
| blank/default behavior        |                                  No | default app/store                      |
| seeded preview behavior       |                                 Yes | explicit seeded fixture                |
| setup editing existing shift  |                                 Yes | explicit fixture/store                 |
| clear behavior                | maybe initial fixture, then neutral | explicit fixture then clear            |
| durability workflow           |       only if domain setup required | smallest explicit fixture              |
| export current authored setup |                depends on assertion | explicit authored fixture if necessary |

Record the audit in the result artifact.

---

# Production Caller Audit

After implementation, confirm:

* no production caller of `createSeededDayFrameStore` remains;
* no equivalent hidden production seed path exists;
* `main.tsx → DayFrameApp → createDayFrameStore()` is the ordinary no-prop path;
* explicit test fixtures do not leak into production bundles/import graphs.

---

# Required Tests

Add/update focused coverage.

## Test 1 — Default Startup Is Neutral

Render/construct default app with no active storage.

Assert former sample shifts/cycles/templates/recurrences are absent.

---

## Test 2 — Default Startup Performs No Active Write

Instrument storage.

Assert app construction does not call `setItem` for active state.

---

## Test 3 — Persisted Shift Definitions Survive

Persist custom shifts.

Construct default app.

Assert exact authored shifts remain.

---

## Test 4 — Persisted Shift Cycles Survive

Equivalent for cycles.

---

## Test 5 — Persisted Templates Survive

Equivalent for templates.

---

## Test 6 — Persisted Recurrences Survive

Equivalent for recurrences.

---

## Test 7 — All Seven Authored Fields Survive Together

Use one realistic complete authored payload and assert:

* scheduling preferences;
* preview range;
* shifts;
* cycles;
* templates;
* recurrences;
* manual events

all survive default reconstruction.

This may subsume Tests 3–6 if strong enough, but the result should state the coverage clearly.

---

## Test 8 — Intentional Empty State Survives

Persist valid empty authored collections.

Reconstruct.

Assert they remain empty.

---

## Test 9 — Clear Then Restart Remains Empty

Mandatory end-to-end lifecycle test.

---

## Test 10 — Seed-Looking Persisted Data Is Preserved

Persist authored objects using former seed IDs and/or values.

Reconstruct.

Assert no removal, replacement, or normalization unrelated to existing compatibility rules.

---

## Test 11 — No Seed Mutation Notifications

Where practical, prove default construction does not call the four authored setter paths or equivalent notification-causing mutations.

---

## Test 12 — Explicit Seeded Fixture Still Supports Schedule Tests

Create example schedule store explicitly.

Assert at least one test that genuinely requires sample schedule generation still works.

This protects test ergonomics without restoring product seeding.

---

## Test 13 — Default Preview Generation Guardrail

From neutral startup, exercise the current Generate Preview affordance/path as appropriate.

Assert existing validation/guardrail behavior rather than silently generating the former demo schedule.

Do not redesign the guardrail.

---

## Test 14 — Profiles Still Rehydrate Separately

Default app with profile storage and neutral/no active data should preserve saved profiles without auto-seeding active state.

---

## Test 15 — Injected Store Is Never Seeded

Preserve existing behavior:

```text
<DayFrameApp store={explicitStore} />
```

must use the explicit store exactly.

---

# Existing Tests To Preserve

Preserve all Phase 1 durability tests and relevant Task 2.1 authority tests.

In particular, no change should regress:

* active/profile persistence separation;
* profile load replacement;
* backup import replacement;
* clear semantics;
* preview invalidation;
* durability retry;
* persistent durability awareness;
* historical singular compatibility.

---

# Reference Validation

After implementation verify:

* production startup no longer writes sample authored data;
* no default seed helper remains on the ordinary production path;
* rehydrated authored state remains authoritative;
* neutral defaults remain valid;
* intentional emptiness remains valid;
* clear → restart remains neutral;
* existing seed-looking data is untouched;
* no first-run marker exists;
* no demo mode was added;
* no onboarding UI was added;
* no provenance field was added;
* no migration exists;
* no durable version changed;
* no store API changed;
* no persistence semantic changed.

---

# Architectural Alignment Improvement

Task 2.3 should change initialization from:

```text
rehydrate authority
    ↓
hidden sample mutations
```

to:

```text
defaults / rehydrated authority
    ↓
stable startup authority
```

This makes ordinary startup non-mutating with respect to authored domain state.

---

# Explicit Non-Goals

Task 2.3 shall not:

* add first-run detection;
* add first-run markers;
* add onboarding;
* add starter-setup UI;
* add demo mode;
* add demo routing;
* add provenance;
* add sample-data metadata;
* delete seed-looking durable data;
* migrate existing data;
* change scalar/default preferences;
* change preview-range defaults;
* change clear semantics;
* change store APIs;
* change persistence keys;
* change durable versions;
* change compatibility readers;
* change preview revision;
* change suggested-fix authority;
* change engine behavior;
* split `DayFrameState`;
* add execution/history state;
* update governance documents before project review.

---

# Dependencies

Requires completion and acceptance of:

* Task 2.1 — Establish the Authoritative and Derived State Boundary;
* Task 2.2 — Establish Seeded-Store Initialization Authority and First-Run/Demo Boundaries.

Governed by:

* Phase 1 checkpoint;
* current architecture;
* durable-data ADR;
* current `DECISIONS.md`.

---

# Expected Files To Change

Likely:

* `code/src/ui/DayFrameApp.tsx`;
* `code/src/ui/tests/DayFrameApp.test.tsx`;
* possibly a small test fixture/helper file.

Potentially no store file should need modification.

If production store behavior itself must change, verify that the need is truly required by the adopted Task 2.2 contract and document it explicitly.

---

# Validation Requirements

Run focused tests for:

* default startup;
* persisted startup;
* clear/restart;
* explicit fixtures;
* profile separation;
* default app behavior.

At minimum:

```text
src/ui/tests/DayFrameApp.test.tsx
src/state/tests/dayFrameStore.test.ts
```

Then run:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Run affected-scope:

```text
git diff --check
```

Record:

* focused UI test count;
* focused store/UI regression count;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 2.3 specification remained immutable;
* result artifact exists separately;
* no governance document changed before review;
* no durable format changed.

---

# Documentation Rules

During Task 2.3:

## Create

`TASK_2.3_ALIGN_DEFAULT_STORE_CONSTRUCTION_WITH_ADOPTED_SEED_AUTHORITY_CONTRACT_RESULT.md`

## Preserve

* Task 2.3 specification;
* Tasks 2.1–2.2 results;
* Phase 1 history/checkpoint;
* ADRs;
* current governance documentation.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* phase checkpoints.

Those require project review.

Do not create a task-specific checkpoint unless explicitly authorized.

---

# Required Result Artifact Structure

The Task 2.3 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Default Construction Before
6. Default Construction After
7. Production Seed Helper Removal
8. Production Caller Audit
9. Test Fixture Strategy
10. Test Migration Audit
11. Neutral Startup
12. Persisted Startup Preservation
13. Seven-Field Authored Preservation
14. Intentional Empty-State Preservation
15. Clear/Restart Preservation
16. Seed-Looking Persisted Data Preservation
17. Persistence-Write Behavior
18. Notification Behavior
19. Preview Behavior
20. Generate Preview Guardrail
21. Profile Separation
22. Backup/Replacement Preservation
23. Durability Preservation
24. Compatibility Preservation
25. No Migration / Provenance
26. Tests Added or Updated
27. Reference Validation
28. Architectural Alignment Improvement
29. Deviations
30. Discoveries and Deferred Work
31. Recommended Next Task
32. Validation
33. Final Completion Determination

---

# Expected Architectural Result

Before Task 2.3:

```text
normal startup
    ↓
rehydrate authored state
    ↓
silently replace four authored collections
    ↓
persist examples
```

After Task 2.3:

```text
normal startup
    ↓
createDayFrameStore()
    ↓
rehydrated authored state
        or
neutral defaults
    ↓
no authored startup mutation
```

Example data remains available only through explicit test fixtures unless a future product task authorizes demo or starter content.

---

# Expected Follow-Up

If Task 2.3 completes cleanly, the seeded-store authority defect is resolved.

The next dependency-correct Phase 2 investigation should return to the second major Task 2.1 mismatch:

> **Task 2.4 — Establish Suggested-Fix and Preview-Revision Authority**

That investigation should determine whether accepting a suggested fix is:

* a disposable preview experiment;
* authored intent;
* a replayable command;
* another explicit state class.

It should also decide stale-preview action semantics before any engine or state-container redesign.

Do not address that question inside Task 2.3.

---

# Completion Criteria

Task 2.3 is complete when:

* default no-prop `DayFrameApp` construction uses the standard store;
* no automatic production sample-data mutation remains;
* rehydrated authored state survives startup unchanged;
* all seven authored fields preserve authority;
* neutral startup contains no sample authored objects;
* neutral startup performs no active persistence write;
* intentional empty state survives reconstruction;
* clear followed by restart remains empty;
* seed-looking persisted data remains untouched;
* tests needing examples explicitly request fixtures;
* production seed helpers are removed or no longer reachable;
* profile and backup behavior remain unchanged;
* Preview behavior remains unchanged apart from absence of hidden seed inputs;
* durability behavior remains unchanged;
* no migration, marker, provenance, onboarding, or demo mode is introduced;
* full validation passes;
* the result identifies the next dependency-correct Phase 2 seam.

---

# Task Determination

Task 2.3 is a bounded implementation correcting startup authority.

It does not redesign initialization, onboarding, or demo behavior.

Its purpose is to ensure that ordinary DayFrame startup respects already established authored authority rather than silently replacing it with example content.

**The task is complete when ordinary DayFrame startup constructs an unseeded store from neutral defaults or rehydrated user-authored data, performs no hidden sample-data mutation or persistence, preserves intentional empty and cleared state across restart, leaves existing seed-looking persisted data untouched, and moves example scheduling content into explicit test/demo fixtures only where deliberately requested.**
