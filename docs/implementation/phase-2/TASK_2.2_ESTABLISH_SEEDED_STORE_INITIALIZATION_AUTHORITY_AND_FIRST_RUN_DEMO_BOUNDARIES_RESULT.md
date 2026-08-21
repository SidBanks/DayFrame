# Task 2.2 Result — Establish Seeded-Store Initialization Authority and First-Run/Demo Boundaries

## 1. Executive Determination

**Confirmed:** ordinary shipped application startup uses `createSeededDayFrameStore()`. That helper first establishes runtime authority from local storage/defaults and then silently replaces four authored collections through four normal store mutations. Each mutation clones, marks an existing preview stale, writes a complete active snapshot, updates active durability status, and calls ordinary notification.

**Confirmed:** there is no reliable first-run signal, seed-consumed marker, demo mode, onboarding mode, or provenance field. Absence of the active storage key also follows intentional Clear Local Data and unreadable/corrupt storage, while empty collections are valid authored state.

**Authority decision — Recommended and adopted for follow-up:** normal application startup must use defaults/rehydrated authority only and must not automatically seed authored objects. Current seed objects are recognizable example/demo fixtures, not neutral structural defaults and not justified user-authored authority. They may become authored authority only through a future explicit user-adoption workflow or an explicit demo/test context. Neither mechanism is required for the smallest correction.

The next bounded implementation should remove automatic production seeding at the `DayFrameApp` default-store seam, retain existing persisted data exactly as user data, and update seed-dependent tests to use explicit fixtures. It should not add a marker, mode, migration, or UI.

## 2. Artifact Integrity

- Saved specification: `docs/implementation/phase-2/TASK_2.2_ESTABLISH_SEEDED_STORE_INITIALIZATION_AUTHORITY_AND_FIRST_RUN_DEMO_BOUNDARIES.md`
- Immutable attachment: `/home/sid/.codex/attachments/ba59a21e-d3ad-45ea-8e77-3302e5a17c79/pasted-text.txt`
- SHA-256 of both: `018ba68dd9fde608d809cbff4dd747835b114b82651abfbff030b0643310ac14`
- **Confirmed:** the title, metadata, required sections, and exact final completion sentence were present; both copies were byte-identical.
- **Confirmed:** the specification remained unmodified.

## 3. Evidence Reviewed

**Confirmed primary evidence:** `main.tsx`, `DayFrameApp.tsx`, `SetupScreen.tsx`, `createInitialDayFrameState.ts`, `dayFrameStore.ts`, state/store types, persistence/profile/backup helpers, and the directly relevant `dayFrameStore` and `DayFrameApp` tests.

**Confirmed supporting evidence:** current UI copy, Task 2.1 result, durable-data ADR, current architecture/audit material, repository history and blame for seed introduction, and an archived hydration note describing updates to the “Default seed.” Executable behavior was controlling.

## 4. Current Seeded-Store Implementation

`createSeededDayFrameStore()` is private to `DayFrameApp.tsx` and performs:

```text
createDayFrameStore()
setShiftDefinitions(createDemoShiftDefinitions())
setShiftCycles([createDemoShiftCycle()])
setBlockTemplates(createDemoBlockTemplates())
setBlockRecurrences(createDemoBlockRecurrences())
return store
```

**Confirmed:** no condition examines storage presence, collection emptiness, environment, route, product mode, or user consent. The setters execute on every construction of the default app-owned store.

**Confirmed:** each setter clones its input, replaces one authored collection, calls `markPreviewStale`, retains snapshot intent, calls full `persistState`, retains that write outcome, and calls `notify`.

## 5. Production Caller Inventory

| Caller/path | Classification | Behavior |
|---|---|---|
| `main.tsx` renders `<DayFrameApp />` | production application startup | no store prop, therefore seeded construction |
| `DayFrameApp` without a `store` prop | production component default and test convenience | constructs one seeded internal store per mounted instance |
| `DayFrameApp` with a `store` prop | explicit composition/test path | uses supplied store; no seed helper |
| `createSeededDayFrameStore` direct callers | **Not found** outside `DayFrameApp` | helper is private |
| equivalent production seeded helper | **Not found** | none |
| production direct `createDayFrameStore` | inside the seed helper only | no ordinary unseeded application path |

**Confirmed:** tests render many default `DayFrameApp` instances and therefore exercise or depend on seeded construction. Store tests overwhelmingly construct `createDayFrameStore` directly and are not tests of the production seed helper.

## 6. Seed Content Inventory

**Confirmed:** all seed objects use `userId: "user_001"` where applicable and fixed May 2026 timestamps/dates.

| Collection | Seed content |
|---|---|
| shift definitions | `shift_day`, “Day Shift,” 05:45–14:15, Monday, non-overnight |
| shift cycles | `cycle_001`, “Day Rotation,” fixed segments, May 1–31 2026; `segment_day` references `shift_day` and overrides boundary to 03:00/week start Monday |
| block templates | `default_sleep`, “Sleep,” flexible 480 minutes plus 60-minute after-buffer, before work, priority 1, daily intent; `template_errands`, “Errands,” flexible 60 minutes with 15-minute buffers, after work, priority 3 |
| block recurrences | `rec_sleep`, daily; `rec_errands`, Mondays |

**Confirmed:** names, fixed identity, user identity, calendar dates, a concrete work schedule, Sleep, and Errands are recognizable authored examples. They are not neutral values required to make the state structurally valid.

## 7. Defaults Versus Seeds

**Confirmed defaults from `createInitialDayFrameState`:** day boundary 03:00, week start Saturday, a three-day May 4–6 2026 preview-range value, empty shifts/cycles/templates/recurrences/manual events, empty profiles, and null preview. Defaults establish a valid neutral runtime shape when durable authored data is absent.

**Confirmed seeds:** additional domain objects written after store construction through authoritative mutation APIs. They are authored example content, not initialization normalization.

**Inferred:** the fixed default preview dates are product/bootstrap defaults rather than user-created objects; their future suitability is outside this task. Removing automatic objects does not require changing these structural defaults.

## 8. Startup/Rehydration Sequence

**Confirmed exact order:**

```text
main renders DayFrameApp without a store
  → DayFrameApp calls createSeededDayFrameStore
  → createDayFrameStore calls mergeInitialState
  → load active key
  → parse and normalize into createInitialDayFrameState
  → load/validate profiles key separately
  → establish runtime state, durability unknown, desired conditions snapshot
  → replace shifts with demo shifts; persist full snapshot; retain outcome; notify
  → replace cycles with demo cycle; persist full snapshot; retain outcome; notify
  → replace templates with demo templates; persist full snapshot; retain outcome; notify
  → replace recurrences with demo recurrences; persist full snapshot; retain outcome; notify
  → DayFrameApp reads the resulting state and later subscribes in an effect
```

**Confirmed:** normalization/rehydration precedes seeding. Seeding is not a fallback inside `createInitialDayFrameState`.

## 9. Persisted-Data Overwrite Behavior

**Confirmed by direct code:** existing durable `shiftDefinitions`, `shiftCycles`, `blockTemplates`, and `blockRecurrences` are replaced during ordinary default startup. Because every seed setter writes a complete active snapshot, local storage is immediately rewritten in four stages; the final snapshot contains all four seeded collections.

The overwrite does not require a user action and occurs before the application UI becomes interactive. Successful rehydration offers no protection.

## 10. Partial-Overwrite Semantics

**Confirmed final hybrid after a persisted startup:**

| Active field | Final source |
|---|---|
| scheduling preferences | persisted/default value preserved |
| preview range | persisted/default value preserved |
| shift definitions | seed replaces persisted value |
| shift cycles | seed replaces persisted value |
| block templates | seed replaces persisted value |
| block recurrences | seed replaces persisted value |
| manual events | persisted value preserved |

**Confirmed risk:** this can create combinations the user never authored—for example, preserved manual events/preferences/range combined with sample work and life commitments.

## 11. Persistence Effects

**Confirmed:** every seed setter emits a full seven-field active snapshot, not a partial patch. The write sequence progressively replaces the durable checkpoint:

1. seeded shifts plus rehydrated remaining fields;
2. seeded shifts/cycles plus remaining fields;
3. seeded shifts/cycles/templates plus remaining fields;
4. final seeded shifts/cycles/templates/recurrences plus preserved preferences/range/manual events.

**Confirmed:** Phase 1 session-first semantics apply. A failed write does not roll back the runtime seed mutation. Active durability status is overwritten by each successive outcome, so the retained final status describes the last seed write; a later successful seed write can supersede an earlier failure status.

**Confirmed:** desired active durability remains `snapshot`; profiles are neither mutated nor persisted by seeding.

## 12. Notification Effects

**Confirmed:** four calls to ordinary `notify()` occur, one per seed mutation. Durability listeners can also be notified when the retained status changes between outcomes.

**Confirmed:** in current construction, the helper completes before `DayFrameApp` initializes snapshots and installs its effect subscriptions. Thus the four ordinary notifications have no mounted UI subscriber and are not observed as four UI updates. They remain real mutation effects and would be observable if the helper were reused around a subscribed store.

**Inferred:** development React Strict Mode may remount component initialization and repeat construction according to React development semantics; this does not change the authority defect and is not relied upon in the decision.

## 13. Preview Effects

**Confirmed:** supported active persistence never rehydrates preview, and `createSeededDayFrameStore` accepts no injected initial state, so its normal preview is null throughout seeding.

**Confirmed setter semantics:** if the same four setters operate on a store with an injected/test-composed preview, the first marks it stale and each later setter preserves it as stale. Seeding neither clears nor regenerates it.

**Deferred:** no preview change is required by the later startup fix beyond stopping hidden authored mutations.

## 14. First-Run Detectability

**Not found:** explicit first-run flag, onboarding completion, seed-consumed marker, migration marker for this purpose, demo selection, route, environment switch, or application metadata.

**Confirmed:** active-key absence is observable only inside the private loader as “no usable persisted state”; this result is also produced by missing storage, access failure, malformed JSON, deliberate clear, and true first use. The store API does not expose provenance of initialization.

**Determination:** reliable first-run status is currently not detectable.

## 15. Empty-State Ambiguity

**Confirmed:** empty authored collections are structurally valid and can result from defaults, explicit deletion, profile/backup replacement, or clear. There is no provenance distinguishing “new” from “intentionally empty.”

**Determination:** collection-emptiness seeding would silently override legitimate user intent. Requiring all four collections to be empty would reduce but not remove that ambiguity.

## 16. Clear/Restart Semantics

**Confirmed current session behavior:** Clear Local Data resets active state to neutral defaults/empty collections, empties profiles and preview, requests removal of both durable keys, and the UI says “Clear all locally saved DayFrame setup data?” followed on success by “Local DayFrame setup data cleared from this device.” Tests assert “No shifts yet.” immediately after clear.

**Confirmed next startup behavior:** when removals succeed, default startup sees no active key and unconditionally restores and persists all seed objects. Thus clear is durable only until the next app construction and sample content returns.

**Clear semantics determination:** current wording and immediate behavior support “remove user-authored durable data and return to neutral defaults/empty state,” not “reset to starter/demo content.” Automatic reseeding therefore undermines the communicated clear contract.

## 17. Profile/Backup Interaction

**Confirmed:** loading a profile or importing a backup during an already mounted session is not followed by seeding. Seed logic runs only when the default app-owned store is constructed.

**Confirmed:** after restart, the four collections loaded from a profile/import and persisted as active state are again replaced by seeds. Saved profile records remain separately preserved and can be loaded again.

## 18. Demo-Mode Evidence

**Not found:** executable demo route, flag, environment variable, build mode, store option, user choice, or UI label that activates a demo mode.

**Confirmed:** helper and factory names use `Seeded` and `Demo`, which supports semantic classification but does not create a lifecycle boundary.

**Unresolved product intent:** whether a future explicit demo/showcase experience is desired. Current production execution is not explicit demo mode.

## 19. Development/Test Evidence

**Confirmed:** repository history introduced the helper and most seed values in the initial snapshot; later history adjusted cycle/default content. An archived hydration note calls the objects a “Default seed,” and UX audits call them seeded examples/demo schedule data.

**Confirmed test use:** numerous `DayFrameApp` tests omit a store prop and receive seed data as fixture convenience. One test explicitly “generates a seeded preview,” while setup, export, clear, stale-preview, and presentation tests also assert seed values. Many other tests inject explicit stores and do not depend on production seeding. Store tests do not call the private helper.

**Inferred:** seeds served early development and blank-state demonstration convenience. Historical evidence does not authorize current production overwrite.

## 20. Product-Behavior Evidence

**Not found:** visible wording describing an example schedule, demo setup, sample data, starter schedule, or user adoption of examples.

**Confirmed:** the UI instead says “Edit your authored setup,” “Save Setup,” and “Clear all locally saved DayFrame setup data.” The examples reduce blank-state burden implicitly, but users are not told their provenance.

**Unresolved:** observation would be required to know whether users perceive the seeded values as examples or as unexplained existing data.

## 21. Current Seed Authority Classification

**Current behavior — Confirmed:** seed content becomes authoritative runtime and durable authored state automatically, including over rehydrated user data.

**Architectural classification — Mismatched:** that authority is unjustified because the data is example-like, silent, unconditional, unprovenanced, and conflicts with durable-data preservation.

**Adopted contract — Recommended:** seed content is never automatic user authority in normal startup. It may become authority only after explicit adoption, or exist within an explicitly selected demo/test context whose data boundary is clear.

## 22. Candidate Initialization Models

- **A — Always seed:** current behavior; maximizes immediate demo content but violates rehydration, clear, empty-state, and explicit-authority requirements. Rejected.
- **B — Seed if active key absent:** protects readable persisted state but conflates first run with clear, storage failure, and unreadable state. Rejected without a marker and clear-policy change.
- **C — Seed if collections empty:** treats valid empty intent as absence and recreates deleted examples. Rejected.
- **D — Explicit first-run marker:** can distinguish lifecycle state but adds durable product metadata, clear/version policy, migration, and onboarding decisions not currently justified. Deferred.
- **E — Explicit demo mode:** cleanly isolates sample behavior if a real mode is later required. Viable future option, not needed for normal startup correction.
- **F — UI-owned optional starter setup:** clearest path for user adoption and authority, with additional UX scope. Viable future option, deferred.
- **G — Never auto-seed:** normal startup uses neutral defaults or durable authority only. Protects current data with the smallest change. Adopted for the next implementation.

## 23. Candidate Model Matrix

| Model | Protects Rehydrated User Data | Distinguishes Intentional Clear | Requires New Marker/Mode | Silent Authored Write | Demo Capability | Architectural Clarity | Recommendation |
|---|---:|---:|---:|---:|---:|---:|---|
| Always seed | No | No | No | Yes | Yes | Low | reject |
| Seed if key absent | Yes when readable | No | No, but safe use needs one | Yes | Yes | Low | reject |
| Seed if collections empty | Partly | No | No | Yes | Yes | Low | reject |
| Explicit first-run marker | Yes | Yes if clear contract defines marker | Yes | Potentially | Yes | Medium/high | defer |
| Explicit demo mode | Yes | Yes | Yes | only inside explicit mode | Yes | High | viable future option |
| User-adopted starter setup | Yes | Yes | UI choice, not necessarily marker | No | Yes | High | viable future option |
| Never auto-seed | Yes | Yes | No | No | fixture-only unless a mode is later added | High | **adopt now** |

## 24. Clear Semantics Determination

**Confirmed and adopted:** Clear Local Data means removal of locally saved authored data and return to neutral defaults/empty state. It does not promise starter content. A later implementation must ensure restart does not repopulate samples.

**Deferred:** whether a separate “reset to starter” action should ever exist.

## 25. Defaults Authority

**Confirmed:** `createInitialDayFrameState` supplies the minimum complete runtime representation and valid empty collections. Its scalar defaults become initial session authority only where no durable/injected value exists; normalization can establish compatible runtime forms.

**Recommended:** preserve these defaults in Task 2.3. They are distinct from concrete shifts, cycles, activities, and recurrence commitments.

## 26. Seed Data Provenance

**Confirmed:** current runtime/durable formats retain no “system example,” “seeded,” or “adopted” provenance. Seed IDs and fixed values are the only clues.

**Recommended:** any future explicit demo environment should isolate its store/lifecycle; any optional starter adoption can commit ordinary authored data after the user chooses it. Provenance fields are necessary only if product requirements need later distinction after adoption.

**Deferred:** provenance schema design; no evidence justifies adding it now.

## 27. User-Data Preservation Determination

**Adopted:** once any sample content has entered active authored state and been durably persisted, the stored representation must be treated as user data unless reliable provenance and an explicit migration authorize otherwise.

This applies even if objects still exactly match current seed values. Users may have accepted, edited around, profiled, backed up, or relied on them. It aligns with the durable-data ADR's preservation and explicit-migration principles.

## 28. Existing Seed-ID/Recognition Assessment

**Confirmed recognizable IDs:** `shift_day`, `cycle_001`, `segment_day`, `default_sleep`, `template_errands`, `rec_sleep`, and `rec_errands`. Only some names explicitly imply “default”; none proves unchanged origin or user non-acceptance.

**Determination:** IDs/shape may support diagnostics but cannot authorize deletion or migration. Task 2.3 must not scan for or remove seed-looking data.

## 29. Future Engine Implications

**Confirmed risk:** the engine already treats every active object as actual scheduling intent. Future capacity, goal, recommendation, execution, and history features would likewise interpret sample shifts and activities as real commitments, amplifying incorrect results and provenance confusion.

**Recommended:** correct startup authority before richer engine state or execution/history work assumes active authored data is settled.

## 30. Durable-Data / Migration Implications

**Recommended immediate approach:** no new durable format or migration. Stop future automatic writes while retaining every existing active payload verbatim through normal rehydration.

**Confirmed:** a first-run marker would be application metadata rather than authored scheduling intent and would need ADR-governed versioning, clear semantics, failure handling, and migration. It is unnecessary for the adopted no-auto-seed model.

**Deferred:** explicit demo/onboarding metadata until a product requirement exists.

## 31. Initialization Authority Map

| Initialization source | May establish active authored authority? | Conditions | Current behavior | Recommended behavior |
|---|---:|---|---|---|
| structural defaults | Yes, as neutral fallback values | no usable persisted/injected value | establishes defaults/empty collections | preserve |
| persisted active state | Yes | readable/normalizable payload | establishes authority, then four fields overwritten | establish authority and remain unchanged |
| profile storage | No | separate rehydration | restores profile collection only | preserve separation |
| injected initial state | Yes | explicit composition supplies fields | supplied fields override loaded/default fields | preserve explicit injection contract |
| seed/demo data | Not in normal startup | only explicit future demo or adoption | always becomes authority | remove automatic path; explicit contexts only |
| future first-run marker | Potentially authorizes an onboarding decision, not authored data itself | explicit governed product contract | absent | not required; defer |

## 32. Startup Ownership Map

| Responsibility | Current owner | Recommended owner |
|---|---|---|
| read active persisted state | store persistence loader | unchanged |
| normalize active state | `createInitialDayFrameState` and normalizers | unchanged |
| establish runtime authority | `createDayFrameStore` merge boundary, then seed helper mutates | `createDayFrameStore` merge boundary only for normal startup |
| decide first-run status | nobody | nobody until a product contract requires it |
| decide demo mode | nobody | explicit future composition boundary, if required |
| apply sample content | private production UI helper | explicit demo fixture or user-adoption workflow only |
| persist sample adoption | four hidden setters | normal authored commit only after explicit context/adoption |
| notify runtime subscribers | store mutation APIs | store mutation APIs; ordinary startup performs no mutation notification |

## 33. Adopted Authority Contract

1. **Recommended:** normal DayFrame startup constructs a standard `createDayFrameStore()` and performs no seed mutation.
2. **Recommended:** successfully rehydrated active data outranks sample content and remains unchanged.
3. **Recommended:** neutral defaults/empty collections are valid authority when no usable active data exists.
4. **Recommended:** intentional emptiness and post-clear emptiness remain valid across restart.
5. **Recommended:** sample data may enter authority only through an explicit user action or explicit non-ordinary demo/test composition.
6. **Recommended:** existing persisted seed-origin data is ordinary user data and receives no cleanup or migration.
7. **Deferred:** first-run onboarding, explicit demo mode, and starter-setup UI until separately authorized.

## 34. Required Behavioral Invariants

The later implementation must protect:

1. persisted shifts, cycles, templates, and recurrences survive ordinary startup unchanged;
2. preferences, preview range, and manual events likewise remain unchanged;
3. ordinary startup performs no authored mutation, active write, or mutation notification;
4. no-storage startup produces neutral defaults/empty authored collections;
5. intentionally empty collections remain empty across restart;
6. successful clear remains neutral/empty after restart;
7. existing seed-looking durable objects are neither identified nor deleted;
8. injected stores remain explicit and are never automatically seeded;
9. any tests needing example schedule data opt into an explicit fixture;
10. profiles, compatibility readers, durability semantics, and durable formats remain unchanged.

## 35. Required Later Test Contract

Task 2.3 should add/update direct tests proving:

- persisted user shifts, cycles, templates, and recurrences survive a default app restart;
- preferences, range, and manual events survive unchanged in the same scenario;
- a neutral first construction has empty authored collections and does not write the active key;
- deliberately persisted empty collections remain empty;
- clear followed by unmount/reconstruction remains empty and does not re-seed;
- ordinary startup makes no `setItem` call and no post-construction mutation notification;
- seed-looking persisted IDs/values remain present and untouched;
- preview generation guardrails work for the neutral default app;
- tests that need Day Shift/Sleep/Errands inject a fixture store explicitly;
- existing profile, backup, persistence-failure, and durability behavior remains covered.

If a future explicit demo/adoption model is authorized, its opt-in, isolation, one-time mutation, persistence, and notification semantics require separate tests.

## 36. Architectural Alignment Assessment

| Concern | Current classification | Reason |
|---|---|---|
| user-data preservation | **Mismatched** | four rehydrated collections silently replaced and rewritten |
| explicit authority | **Mismatched** | examples become authored data without consent/mode |
| deterministic initialization | **Partially aligned** | sequence is deterministic but contains four hidden mutations |
| demo/product semantics | **Unresolved / mismatched implementation** | no explicit demo product contract exists |
| clear semantics | **Mismatched** | samples return after communicated durable clear |
| future migration safety | **Partially aligned** | durable ADR protects data, but seeds have no provenance |

Overall current seeded initialization is **architecturally mismatched**. The adopted no-auto-seed startup contract is aligned with Task 2.1 authority and Phase 1 durable-data rules.

## 37. Open Questions

- **Unresolved:** does the product eventually want an explicit demo/showcase mode?
- **Unresolved:** should first-time users be offered a starter setup through explicit onboarding?
- **Unresolved:** are the scalar/date defaults suitable long term? This is separate from object seeding.
- **Unresolved:** should future adopted starter data retain provenance after the user commits it?
- **Deferred:** answers are not blockers for removing automatic production seeding.

## 38. Recommended Implementation Task

**Task 2.3 — Align Default Store Construction With the Adopted Seed Authority Contract.**

Smallest dependency-correct scope:

1. make the no-prop `DayFrameApp` path construct `createDayFrameStore()` without mutations;
2. remove production-only seed helpers/imports that become unreachable, without changing store APIs or durable formats;
3. move/recreate example builders only as explicit test fixtures where tests genuinely need them;
4. update blank/default UI expectations and seed-dependent tests;
5. add direct persisted-startup, empty-state, clear/restart, no-write, and no-deletion protections listed above;
6. do not add demo mode, onboarding, markers, provenance, or migration.

This corrects the authority defect before suggested-fix or preview-range work proceeds.

## 39. Deviations

None. **Confirmed:** Task 2.2 changed no executable code, tests, types, APIs, UI, seed values, defaults, persistence behavior, architecture/governance documents, ADRs, or checkpoints. Only this result artifact was created.

## 40. Discoveries and Deferred Work

**Discovery:** four startup writes create intermediate durable hybrid snapshots and only the last write outcome remains as current active durability knowledge.

**Discovery:** seed mutation notifications occur before current UI subscription, so their mutation cost is hidden from UI observers while persistence remains real.

**Discovery:** clear's visible empty-state contract is contradicted only on reconstruction, a lifecycle gap not covered by the current clear test.

**Deferred:** demo mode, onboarding, marker/provenance design, migration of any seed-origin data, preview revision authority, and preview-range authority.

## 41. Validation

Validation results:

- targeted `dayFrameStore` and `DayFrameApp` suites: passed, 2 files and 164 tests
- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm test`: passed, 23 files and 366 tests
- `npm run build`: passed; TypeScript and Vite production build completed
- specification hash/immutability recheck: passed; saved specification and attachment remained byte-identical at `018ba68dd9fde608d809cbff4dd747835b114b82651abfbff030b0643310ac14`
- executable/governance diff check: passed; Task 2.2 created only this separate result artifact

## 42. Final Completion Determination

**Complete.** The investigation established executable overwrite behavior; distinguished defaults, examples, and user data; compared all required models; adopted an authority-safe normal-startup contract; specified migration-safe invariants and tests; identified the bounded Task 2.3 implementation; passed all validation; and preserved executable and governance artifacts.
