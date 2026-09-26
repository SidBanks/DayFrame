# Task 9.11 — First-Class Sleep Domain & Persistence Foundation RESULT

## 1. Executive Summary

Implemented a dedicated, validated, revisioned `SleepRequirementV1` and owner-day durable reference. Sleep now survives active-state persistence, portable profiles, full backup, coordinated restore, clear and restart. Active and profile envelopes advance to V3; full backup advances to V13. Existing physical aggregate keys remain the sole owners.

First-Class Sleep does not generate candidates, occupy time, subtract Capacity, or enter accepted decisions, publication or execution. Legacy Sleep Commitments retain their existing behavior. No default requirement, conversion, shadow template, new dependency, commit or push was introduced.

## 2. Scope and Governing Specification

The governing contract is [Task 9.10 RESULT](TASK_9.10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION_RESULT.md), bounded by Task 9.11's domain/persistence authorization. This implements the Authored layer and identity primitives, stopping before Derived scheduling. The authority chain remains Authored → Derived → Proposed → Accepted → Scheduled/Realized → Published → Execution/Progress → History → Learned → Explicit Preference.

The only UI integration change is selecting the current full-backup format and recognizing its restore result. Compile-time discrimination guards prevent the widened reference union from entering current operational consumers; no Sleep authoring UI was added.

## 3. Pre-Implementation Repository State

HEAD was `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. The workspace already contained tracked modifications and untracked Task 9.8B/9.9 implementation and audit/specification artifacts, including Task 9.10. It was not clean. Before implementation, status and 870 baseline files were captured outside the repository under `/tmp/dayframe-911-status.txt`, `/tmp/dayframe-911-files.json`, and `/tmp/dayframe-911-baseline/`.

Pre-existing changes covered placement, accepted-decision replay, Preview, Friction, publication eligibility, historical/planning surfaces, constructive planning UI and regression tests. Existing Phase 9 artifacts and the dogfood PDF were preserved. Comparison against the captured baseline, rather than HEAD alone, identifies Task 9.11's additions in section 34. Only `state/types.ts` and `ui/DayFrameApp.tsx` have both pre-existing modifications and additional Task 9.11 changes. No existing task-result artifact was deleted or rewritten.

## 4. Architecture Governance Update

[ADR — First-Class Sleep Domain and Persistence Foundation](../../adr/ADR_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTENCE_FOUNDATION.md) records the dedicated authored domain decision, the future precedence of foundational Work/required Sleep over ordinary movable Commitments, and future Capacity consumption of dedicated Sleep resolution.

The canonical complete architecture advances narrowly to 1.0.1; its historical `v1.0.0` filename remains to preserve links. The Charter version reference and Capacity specification's legacy Sleep wording now point to this bounded amendment. Fixed, locked and explicitly accepted geometry remains constraining authority. These governance changes authorize the foundation without activating future scheduling semantics.

## 5. Current Persistence Ownership Trace

| Production path                                                                  | Owner and Task 9.11 integration                                                                                                                                                               |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Startup → `createDayFrameStore` → persisted active reader                        | `dayFrameStore.ts` reads the existing `dayframe-active-v2` key, dispatches V2/V3 validation, and protects unsupported/malformed ingress. `activeV3.ts` owns the new envelope.                 |
| Initial portable input → `createInitialDayFrameState` → `instantiateActiveSetup` | Normalizes legacy authored patterns, then allocates source incarnations. Explicit portable Sleep intent is validated and instantiated; absent intent stays absent.                            |
| Authored command → retained active snapshot → `persistActiveState`               | Sleep commands use the existing active aggregate writer and runtime authority transaction gate. No independent Sleep key or writer exists.                                                    |
| Save profile → `projectActiveToPattern` → Profiles V3 writer                     | Removes live incarnations and preserves portable dated revisions. Existing profile storage key and quarantine remain authoritative.                                                           |
| Load profile → instantiate active aggregate                                      | Allocates one fresh Sleep incarnation for all revisions, alongside existing source allocation.                                                                                                |
| Export/import → backup transfer surface/store dispatch                           | V13 includes Active/Profiles V3 and all existing V12 domain surfaces. Older format readers remain available.                                                                                  |
| Restore → `dayFrameRestoreComposition` → translation → coordinator               | Active and profiles remain existing participants; staging, validation, commit, verification, rollback/recovery, adoption and transaction gating continue through the established coordinator. |
| Full clear → existing coordinated clear                                          | Settles active/profile aggregates, durability markers and restore state together. Restart cannot fall back to superseded legacy storage.                                                      |
| Durable references → canonical occurrence helpers                                | Adds the Sleep variant without changing old source families. Incarnations reuse the existing canonical UUID-v4 allocator/validator.                                                           |

`core/blocks/types.ts`, candidate generation, placement and current decision references were inspected: legacy Sleep remains a BlockTemplate, while the new authored source is separate. Existing active validators, profile/backup translation chains and restore participants were traced through callers rather than inferred from filenames.

## 6. Implemented Sleep Domain Model

`core/sleep/sleepRequirement.ts` implements the specification's names directly: `SleepRequirementV1` and `SleepWindowIntentV1`, with `clock`, `beforeWork` and `afterWork` variants. `SleepClockWindowV1` names the shared clock structure. Fields retain the specified meanings: ID/incarnation, revision, enabled, effective dates, weekdays, exact duration, window, two buffers and metadata timestamps. There is no priority.

`SleepRequirementPatternV1` omits only live `incarnationId`; `SleepRequirementIntentV1` further omits generated identity/revision/timestamp fields for authoring commands. Active `sleepRequirements` is a revision collection, not a collection of simultaneous primary sources. Canonical validation permits zero or one source lifetime, including disabled records. Runtime optionality supports existing caller fixtures; serialized Active V3 always requires an explicit array.

## 7. Validation Rules

Validation rejects unknown fields and unsupported versions, blank IDs, noncanonical UUID-v4 incarnations, nonpositive/noninteger revisions, nonboolean enabled values, invalid civil dates, non-increasing exclusive ends, empty/duplicate/invalid weekday sets, noninteger or out-of-range durations/buffers, malformed clock strings and timestamps.

Duration is 1–1440 minutes; each buffer is 0–1440 minutes. These are representation bounds. Clock strings use canonical `HH:mm`; equal endpoints are valid without deriving geometry. Work-relative spans are integer 1–4320 minutes, require a valid explicit off-day window, and must contain duration plus both buffers. No dated Work feasibility is evaluated.

Timestamps accept valid UTC ISO strings with seconds or milliseconds and compare chronologically. `updatedAt` cannot precede `createdAt`. Collections preserve a common creation timestamp, monotonic update timestamps, unique increasing revisions and nondecreasing effective starts. Explicit malformed/null authority is rejected, not normalized to an empty list.

## 8. Revision Semantics

`authorSleepRequirement` creates revision 1 with a newly allocated incarnation. Editing requires matching ID, expected incarnation and expected revision, then appends a new immutable record. It preserves creation metadata and lifetime. A stale command cannot edit a recreated source with the same ID/revision. Invalid edits do not install a new active snapshot.

The collection validator sorts a detached copy by revision. Effective dates cannot run backward as revisions increase; same-date revisions are permitted and the highest wins. Old records remain stored across edits, profile projection and backup. Deletion removes the current authored lifetime and its revision collection; a subsequent creation allocates a new incarnation. Persisting an edit does not schedule it.

## 9. Effective-Requirement Query

`queryEffectiveSleepRequirement(revisions, ownerDay)` is pure and validates its inputs. It selects the highest revision whose effective start is no later than the owner day. A selected revision's exclusive end prevents applicability without falling back to an older revision. Results distinguish `notConfigured`, `notApplicable`, `disabled`, `effective`, and invalid authority. Disabled selected intent is reported before weekday filtering; enabled intent must match its weekday set.

The store exposes the query and returns `protected` when active authority requires recovery. Neither query uses Preview, Work anchors, physical geometry, clock time, view range, Capacity or metadata timestamps as scheduling inputs. Returned records are detached from authority.

## 10. Source Incarnation Semantics

Existing `SourceIncarnationId` validation and cryptographic UUID-v4 allocation are reused. An edit keeps the lifetime; delete/recreate changes it. The active incarnation graph includes Sleep exactly once despite multiple revision records, preserving graph-wide uniqueness. Profile activation creates a fresh lifetime; full backup/restore preserves the recorded lifetime. Stale durable references return lifetime mismatch or source missing and cannot bind to a recreated ID.

## 11. Durable Occurrence Identity

`SleepOccurrenceReferenceV1` contains version 1, `sourceKind: sleepRequirement`, requirement ID/incarnation, and `{ scopeKind: userDay, userDayDate, slot: 0 }`. Those fields alone determine identity. Physical endpoints, duration, revision, title, Work anchor, cycle, segment, week start and view range are excluded.

The companion runtime identity names the requirement and owner day. Canonical construction, validation, cloning, equality, JSON round-trip and authored applicability resolution support Sleep. Resolution establishes source lifetime and applicable authored intent only; it does not construct an operational Sleep occurrence or prove feasibility.

## 12. Durable Reference Compatibility

The reference envelope remains version 1 with an added explicit source discriminator. Existing template, Work, manual-event and realized-schedule references remain readable. Unknown source kinds and unsupported versions fail safely. Legacy template references cannot compare equal to Sleep references, even with matching-looking identifiers and dates.

`validateScheduledOccurrenceReference` deliberately rejects Sleep for current PlanDecision, publication and execution validation. Narrow guards in historical/Today/accepted-decision consumers handle the widened TypeScript union without introducing an actionable Sleep subject. Current decision, publication and execution schema versions are unchanged. Fingerprint serialization understands the new identity but does not publish it.

## 13. Active Authored-State Integration

`DayFrameActiveV3` preserves the existing aggregate and adds validated `sleepRequirements`. Clone, initial-pattern, authored projection and store snapshot helpers preserve it. Canonical author/delete commands participate in existing write protection, runtime transaction gating, snapshot retention and persistence reporting. Queries remain available without a UI semantic owner.

No separate storage surface is created. Existing unrelated authoring commands preserve Sleep. Fresh state has no First-Class Sleep requirement; absence and invalid/protected authority remain distinct.

## 14. Active-State Migration

`translateActiveV2ToV3` first validates V2, preserves its existing sources/lifetimes and supplies an empty Sleep array. `readActiveV3` accepts either a valid V2 predecessor or V3. V3 validation is idempotent. Legacy V1 startup continues its established source-instantiation path, then writes V3; it does not promote legacy Sleep markers.

V2 startup migration serializes and validates the successor before writing, verifies the exact reread and then records the existing establishment marker. Invalid serialization leaves the predecessor protected and untouched; restarting with a working serializer recovers it. Unsupported/malformed input protects raw source bytes rather than writing neutral state. Physical key names stay `dayframe-active-v2` and its existing marker: envelope version, not a second key, defines the successor. This avoids parallel owners and stale-key resurrection.

## 15. Profile Integration

Profiles V3 preserve portable dated Sleep revision history, including enabled/applicability, duration, windows, buffers, revision values and metadata. This follows existing profiles' authored-pattern semantics, which already preserve authored dates and IDs. Dates are not rebased on activation. A future authoring UX may explicitly create different dated intent; activation itself does not invent it.

Live Sleep incarnation is forbidden. No accepted decisions, publication IDs or execution history enter the portable pattern. Empty portable Sleep may remain omitted for stable legacy patterns. V3 validation applies the new Sleep validator and the established V2 profile validation for all existing fields.

## 16. Profile Activation and Fresh Lifetimes

`instantiateActiveSetup` validates portable revisions and assigns one new incarnation to the source, shared across its revisions. Loading the same saved profile twice creates different active lifetimes. Portable intent remains equal after projection; saved profile bytes never acquire active incarnations. Existing profile activation behavior for other domains is unchanged.

## 17. Profile Migration

Profiles V2 translate through their existing validator into V3 without adding Sleep intent. Existing V1 translation/quarantine remains supported. Legacy Sleep templates stay templates. Old schema readers refuse nonempty/invalid new Sleep authority instead of silently discarding it; malformed new profile authority follows protected ingress. The existing `dayframe-profiles-v2` key and establishment/clear mechanisms remain the sole profile owner.

## 18. Backup Integration

Backup V13 contains Active V3 and Profiles V3, preserving live Sleep incarnations and every revision in active authority while keeping profiles portable. All other domain surfaces retain their V12 representations and validators: decisions, execution, historical publications, Goals, measurement definitions, observations, Goal structure/planning, composition, proposals/accepted allocations and realizations.

The V13 validator validates new active/profile authority, explicitly projects the new field out for the established V12 validation chain, and reinstalls the validated new fields. Semantic fingerprinting covers the complete validated payload. Export checks initialization, participant readiness and restore/transaction state; import validates before coordinated replacement. The existing backup button now exports V13 and restore dispatch recognizes it.

Backup export V3–V13 and legacy import V3–V7 orchestration moved into lazy `backupTransferSurface.ts` to keep the unchanged initial bundle budget. It accesses live store state through getters and uses the same authority surfaces/coordinator; it is not a new persistence owner.

## 19. Backup Migration

`translateBackupV12ToV13` preserves existing backup authority and source lifetimes, upgrades active/profile representations, and adds no Sleep requirement. Older supported imports continue through established version-specific validation and restore translation into current active/profile envelopes. Legacy Sleep Commitments remain legacy. A V12 producer already canonicalizes optional legacy fields; the new translator preserves that validated V12 payload without introducing an additional reinterpretation.

Legacy backup creators/readers reject new nonempty Sleep authority when their schemas cannot represent it. A user cannot silently export current Sleep through an older format and lose its lineage. No downstream schema receives a speculative version bump.

## 20. Restore Integration

Sleep travels inside the existing active participant and portable profiles inside the existing profiles participant. Restore translation accepts old and current payloads and writes current envelopes. The existing coordinator's durable staging, participant ordering, post-write verification, rollback/recovery and runtime adoption remain responsible for atomic authority replacement.

The integration test injects a profile commit failure after active Sleep has been written. The coordinator completes rollback, restoring the original active lifetime and profile set; restart sees the original lifetime. Valid full restore and restart preserve the backup's incarnation and revisions. Invalid Sleep backup content is rejected before replacement. No side channel can partially adopt Sleep outside the aggregate transaction.

## 21. Clear / Anti-Resurrection Integration

Full clear uses the existing coordinator and aggregate participants. It clears active Sleep and saved profiles because the existing full-clear contract clears profiles. Establishment markers, legacy-key handling and restore cleanup continue to prevent fallback resurrection. Create → save profile → clear → restart yields `notConfigured` and no saved profiles. No additional Sleep storage layer exists to outlive the clear.

## 22. Unsupported / Malformed Authority Protection

Malformed version, dates, cardinality, incarnation, revisions and missing required V3 Sleep data fail validation. Unsupported active envelope versions retain protected ingress. The store query reports protection rather than treating the neutral fallback as the user's authored `notConfigured` state. Raw malformed persisted bytes remain available to existing recovery handling; authoring does not overwrite protected authority.

Profiles reject live Sleep incarnations. Backups reject invalid new authority before restore. Legacy readers reject unexpected nonempty Sleep authority rather than stripping it. Direct canonical creators also reject explicit null collections. Unknown durable reference variants/versions cannot silently resolve as legacy sources.

## 23. Legacy Sleep Commitment Coexistence

`default_sleep`, title `Sleep`, category `sleep` and legacy normalization are not conversion evidence. Existing BlockTemplates and recurrences keep their IDs, incarnations and ordinary Commitment semantics. First-Class Sleep has a separate explicit source family and performs no shadow writes. Both may coexist in persisted state, but only the legacy family participates in current scheduling, preventing duplicate occupancy from this foundation.

## 24. Conversion Foundation Status

Conversion provenance is **Not yet implemented**. No fake lineage record or conversion command is persisted. Future explicit conversion must add validated provenance to the active aggregate, backup validation and the same restore participant, then atomically create the requirement and retire selected future legacy recurrence generation while preserving history. Profiles must carry portable intent rather than live conversion lifetimes. That future schema/workflow change requires its own authorization and tests.

## 25. Scheduling Non-Activation Verification

A production-store fixture combines Work, a legacy `default_sleep` template and recurrence, and a new Sleep requirement. Before/after comparisons establish identical complete Preview results (including current scheduling/Friction data), Capacity query results and publication materialization. Authored Sleep adds no template, decision, published batch or execution record. The test verifies the publication comparison is a successful materialization, not equality of two failures.

No Task 9.11 change touches candidate generation, placement, Capacity, Goal feasibility, Friction or Suggested Fix implementation. Pre-existing changes in those files belong to earlier tasks and match the captured baseline. Current Sleep omit/move behavior is retained for legacy templates. Compile-time guards do not activate Sleep in Today or historical execution.

## 26. Persistence Matrix

| Object                     | Active State                                                 | Profile                        | Backup                             | Restore                              | Clear               | Authority           |
| -------------------------- | ------------------------------------------------------------ | ------------------------------ | ---------------------------------- | ------------------------------------ | ------------------- | ------------------- |
| Sleep Requirement          | V3                                                           | Portable V3 intent             | V13                                | Existing active/profile participants | Existing full clear | Authored            |
| Sleep Revision History     | All revisions of current lifetime                            | Portable dated revisions       | Preserved                          | Preserved                            | Removed with source | Authored            |
| Sleep Source Incarnation   | Live UUID-v4                                                 | Forbidden; fresh on activation | Live active lineage preserved      | Preserved from backup                | Removed             | Authored lifetime   |
| Sleep Occurrence Reference | Pure reference primitive; no persisted occurrence collection | Not carried                    | No operational reference owner yet | No operational reference owner yet   | No standalone store | Identity only       |
| Legacy Sleep Commitment    | Existing aggregate                                           | Existing portable pattern      | Existing representation            | Existing semantics                   | Existing semantics  | Ordinary Commitment |
| Conversion Provenance      | Not yet implemented                                          | Not yet implemented            | Not yet implemented                | Not yet implemented                  | Not yet implemented | Not yet implemented |
| Accepted Sleep Decision    | Not yet implemented                                          | Not yet implemented            | Not yet implemented                | Not yet implemented                  | Not yet implemented | Not yet implemented |
| Published Sleep            | Not yet implemented                                          | Not yet implemented            | Not yet implemented                | Not yet implemented                  | Not yet implemented | Not yet implemented |
| Sleep Execution            | Not yet implemented                                          | Not yet implemented            | Not yet implemented                | Not yet implemented                  | Not yet implemented | Not yet implemented |

## 27. Schema Migration Matrix

| Schema Family                | Previous Version | New Version       | Sleep Change                        | Legacy Reader / Translator                              | Authority Risk                                | Evidence                                              |
| ---------------------------- | ---------------- | ----------------- | ----------------------------------- | ------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| Active authored state        | 2                | 3                 | Explicit revision array             | `readActiveV3`, V2 translator; existing V1 ingress      | Loss/inference blocked; same owner/key        | Migration, raw-protection, restart tests              |
| Profiles                     | 2                | 3                 | Portable dated intent               | `readProfilesV3`, V2 translator; existing V1 quarantine | Live incarnation rejected                     | Profile round-trip/activation/legacy tests            |
| Backup                       | 12               | 13                | Active/Profiles V3                  | V12 translator; older import dispatch retained          | Lossy downgrade rejected; coordinated restore | V13 round-trip, rollback, old-backup tests            |
| Durable occurrence reference | 1                | 1, extended union | Explicit Sleep variant              | Existing source-kind readers unchanged                  | No cross-family retargeting                   | Identity and legacy reference suites                  |
| PlanDecision                 | Existing         | Deferred          | Sleep rejected by current validator | Existing reader                                         | No accepted Sleep placement                   | Domain rejection and decision suites                  |
| Publication                  | Existing         | Deferred          | No Sleep snapshot/context           | Existing reader                                         | No new published authority                    | Non-activation materialization and publication suites |
| Execution                    | Existing         | Deferred          | No Sleep execution subject          | Existing reader                                         | No unpublished Sleep execution                | Scheduled-reference rejection and execution suites    |

## 28. Legacy Coexistence Matrix

| Scenario                      | Legacy Commitment Exists?     | First-Class Requirement Exists? | Scheduling Owner in 9.11 | Automatic Conversion? | Expected Behavior                               |
| ----------------------------- | ----------------------------- | ------------------------------- | ------------------------ | --------------------- | ----------------------------------------------- |
| Old setup with Sleep template | Yes                           | No                              | Legacy Commitment        | No                    | Preserve existing template and lineage          |
| Fresh setup                   | No inferred template          | No                              | None                     | No                    | Query `notConfigured`                           |
| New requirement authored      | Only if independently present | Yes                             | Legacy only if present   | No                    | Persist intent, no new occupancy                |
| Both temporarily present      | Yes                           | Yes                             | Legacy Commitment only   | No                    | Distinct families; no duplicate generated Sleep |
| Old profile loaded            | As saved                      | No                              | Legacy if saved          | No                    | Fresh legacy lifetimes; no promotion            |
| New profile loaded            | As saved                      | As saved                        | Legacy if saved          | No                    | Fresh Sleep lifetime; no Sleep occupancy        |
| Old backup restored           | As backed up                  | No                              | Legacy if backed up      | No                    | Preserve legacy authority                       |
| New backup restored           | As backed up                  | As backed up                    | Legacy if backed up      | No                    | Preserve both distinct source families          |

## 29. Identity Matrix

| Change                         | Same Sleep Source Lifetime?  | Same Occurrence Reference?                    | New Revision?                     | New Incarnation?         |
| ------------------------------ | ---------------------------- | --------------------------------------------- | --------------------------------- | ------------------------ |
| Change duration prospectively  | Yes                          | Yes, for same owner day                       | Yes                               | No                       |
| Change window prospectively    | Yes                          | Yes, for same owner day                       | Yes                               | No                       |
| Change buffers prospectively   | Yes                          | Yes, for same owner day                       | Yes                               | No                       |
| Disable prospectively          | Yes                          | Same identity; not applicable for resolution  | Yes                               | No                       |
| Re-enable through new revision | Yes                          | Yes, for same owner day                       | Yes                               | No                       |
| Delete source                  | Lifetime ends                | Old reference remains distinct but unresolved | No                                | No replacement allocated |
| Recreate source                | No                           | No                                            | New lifetime starts at 1          | Yes                      |
| Load profile                   | No                           | No                                            | Portable revision values retained | Yes                      |
| Restore full backup            | Preserves backed-up lifetime | Preserves backed-up reference identity        | No new revision                   | No new allocation        |
| Change Work Pattern            | Yes                          | Yes, for same owner day                       | No                                | No                       |
| Change Day Boundary            | Yes                          | Yes, for same owner-day coordinate            | No                                | No                       |

The owner-day date is an identity coordinate. Future physical intervals may change when Work or day boundaries change, but those dependencies cannot become part of the reference identity. No physical remapping occurs in Task 9.11.

## 30. Behavioral Invariants

The following mapping covers the task's thirty invariants:

| Invariants                                                                                                       | Implementation / evidence                                                                                      |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1–6: explicit family, separate representation, no shadow template/promotion/default                              | Domain types, empty migration defaults, legacy fixtures and non-activation test                                |
| 7–11: one primary, stable edit lifetime, new recreation lifetime, retained history, deterministic revision query | Collection validation, guarded store commands, revision/lifecycle tests                                        |
| 12–14: revision/geometry-independent owner-day identity, family separation                                       | Strict reference shape, construction/equality/round-trip tests                                                 |
| 15–18: portable profiles, fresh activation, full-backup lineage, no old-backup inference                         | Profile projection/instantiation and V13/V12 integration tests                                                 |
| 19–21: coordinated restore, anti-resurrection clear, protected malformed authority                               | Injected rollback/restart, clear/restart, raw-ingress protection tests                                         |
| 22–27: no scheduling/Capacity/Friction/Suggested Fix/publication/execution activation; UI not owner              | Unchanged operational owners, full Preview/Capacity/publication comparison, downstream reference rejection     |
| 28–30: deterministic authored query, supported predecessor migration, preserved historical legacy references     | Shuffled revision input test, migration/backup suites, existing durable-reference/publication/execution suites |

## 31. Test Coverage

`core/sleep/sleepRequirement.test.ts` contains 32 cases covering valid clock/beforeWork/afterWork input, structural rejection, timestamp precision, revision selection/expiry, disabled and weekday outcomes, cardinality, identity, stale lifetime resolution, canonical factory, legacy-family inequality and downstream rejection.

`state/sleepFoundation.test.ts` contains 18 cases covering canonical creation/edit/restart/delete/recreate, malformed active ingress, null rejection, Active V2 migration with legacy templates and incarnations, portable profile round-trip and repeated activation, old-profile activation, V13 backup/restore/restart, V12 translation with legacy Sleep, invalid backup isolation, coordinated rollback, serializer failure/recovery, stale lifetime edit rejection, full clear and non-activation.

Existing active migration/store/UI tests changed only current envelope/export expectations and active snapshot shape. Existing domain, decision, source-incarnation, profile, backup, restore, clear, publication, execution and legacy scheduling suites remain regression coverage.

## 32. Legacy Regression Assessment

Existing tests still exercise `default_sleep` normalization, template persistence and candidate generation, Work-relative/beforeWork and off-day behavior, Friction/Suggested Fix, legacy durable references, publication and execution. No scheduling expectation was rewritten to claim First-Class Sleep occupancy. The new coexistence test supplements those suites with explicit First-Class Sleep present.

During implementation, stale version expectations and backup UI message handling caused intermediate failures; these were corrected. A stronger migration test initially compared a runtime optional false field against V12's already-canonicalized representation; it now compares the translator against the actual V12 payload and separately checks runtime incarnation preservation. This did not require changing legacy behavior.

## 33. Validation Record

Commands ran from `code/` unless stated otherwise. Final validation results are recorded below after the last implementation/test edits.

- `npm run format`: passed using the repository script (`prettier --write .`). Baseline comparison confirmed unrelated files were not changed. Targeted formatting/checks of Task 9.11 code and the new ADR/RESULT also passed. Existing architecture documents retain their original formatting outside the narrow governance amendment.
- `npm run lint`: passed.
- `npm run build`: passed; includes `tsc --noEmit` and production Vite build.
- `npm test`: **130 files, 1,212 tests passed**, final run 38.58 seconds.
- `npm test -- src/core/sleep src/state/sleepFoundation.test.ts src/state/activeV2Migration.test.ts src/state/tests/dayFrameStore.test.ts src/state/dayFrameBackup src/state/dayFrameProfiles.test.ts src/state/dayFrameRestore src/state/sourceIncarnationLifecycle.test.ts src/core/occurrences src/core/blocks/tests/generateBlockCandidates.test.ts src/core/friction/tests`: **26 files, 328 tests passed**, 3.60 seconds. This includes the final strengthened legacy fixtures.
- `npm run check:bundle`: passed the unchanged hard budget after lazy backup orchestration extraction. Initial gzip was reduced from an intermediate failing 171,902 bytes to **166,636 bytes** (hard limit 170,000). Advisory warnings remain at 161,500 initial gzip bytes and 825,000 total bytes; total output is 1,027,903 bytes. Policy thresholds were not changed.
- Repository-root `git diff --check`: passed.
- Final status/stat and baseline-relative changed-file inspection: completed; unrelated pre-existing edits preserved. No commit/push performed.

The full suite includes the focused domain families requested by the task, including source incarnation and legacy Sleep. Temporary validation logs are `/tmp/dayframe-911-{full,focused,lint,build,bundle,format}-final.log`; they are execution evidence, not additional repository task reports.

## 34. Changed Files

Paths below are relative to the repository. “Authority” means a Task 9.11 authority contract changed, not merely a TypeScript guard. Test abbreviations: D = `core/sleep/sleepRequirement.test.ts`; F = `state/sleepFoundation.test.ts`; E = existing relevant suite/full suite. Every Task 9.11 file is listed, excluding untouched pre-existing dirty files.

| File                                                                                                      | Classification                                       | Purpose / semantic change                                                        | Authority                                    | Tests                        |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------- |
| `code/src/core/sleep/sleepRequirement.ts`                                                                 | Domain                                               | Dedicated intent, strict validation and pure effective query                     | New authored contract                        | D, F                         |
| `code/src/core/sleep/sleepTestFixtures.ts`                                                                | Test                                                 | Shared valid authored fixture                                                    | No production change                         | D, F                         |
| `code/src/core/sleep/sleepRequirement.test.ts`                                                            | Test                                                 | Domain/identity/rejection coverage                                               | No production change                         | D                            |
| `code/src/core/occurrences/sleepOccurrenceReference.ts`                                                   | Identity                                             | Owner-day reference and applicability resolution                                 | Identity only                                | D, F                         |
| `code/src/core/occurrences/occurrenceIdentity.ts`                                                         | Identity                                             | Runtime identity discriminator                                                   | Identity only                                | D, E                         |
| `code/src/core/occurrences/durableOccurrenceReference.ts`                                                 | Identity                                             | Canonical union/helpers and operational rejection wrapper                        | Identity only                                | D, E                         |
| `code/src/core/decisions/planDecision.ts`                                                                 | Identity                                             | Reject foundation-only Sleep in current decisions                                | Existing authority preserved                 | D, E                         |
| `code/src/core/execution/executionRecord.ts`                                                              | Identity                                             | Use operational reference validator                                              | Existing authority preserved                 | D, E                         |
| `code/src/core/execution/historicalExecutionTarget.ts`                                                    | Identity                                             | Reject unsupported Sleep target/context                                          | Existing authority preserved                 | E                            |
| `code/src/core/historicalPlan/historicalPlanFingerprint.ts`                                               | Identity                                             | Exhaustive canonical reference key                                               | No publication activation                    | D, E                         |
| `code/src/core/historicalPlan/historicalPlanValidation.ts`                                                | Identity                                             | Reject Sleep in current publication records                                      | Existing authority preserved                 | D, E                         |
| `code/src/core/historicalPlan/materializePlanPublication.ts`                                              | Identity                                             | Exhaustive Goal-link source guard                                                | No semantic change                           | F, E                         |
| `code/src/core/today/buildTodayReadModel.ts`                                                              | Identity                                             | Unsupported-source guard                                                         | No Today change                              | E                            |
| `code/src/state/activeV2.ts`                                                                              | Persistence / Profile / Identity                     | Clone/project/instantiate Sleep; graph validation; V2 downgrade rejection        | New source carried by existing aggregate     | D, F, E                      |
| `code/src/state/activeV3.ts`                                                                              | Persistence / Migration                              | Current active envelope and V2 translation                                       | Active V3                                    | F, E                         |
| `code/src/state/createInitialDayFrameState.ts`                                                            | Persistence                                          | Preserve explicit portable intent, no default                                    | Explicit input only                          | F, E                         |
| `code/src/state/dayFrameProfiles.ts`                                                                      | Profile / Migration                                  | Old reader rejection/quarantine for new authority                                | Loss prevention                              | F, E                         |
| `code/src/state/dayFrameProfilesV3.ts`                                                                    | Profile / Migration                                  | Portable V3 envelope and V2 translator                                           | Profiles V3                                  | F, E                         |
| `code/src/state/dayFrameBackup.ts`                                                                        | Backup                                               | Portable cloning and old-format loss prevention                                  | Loss prevention                              | F, E                         |
| `code/src/state/dayFrameBackupV13.ts`                                                                     | Backup / Migration                                   | V13 validation/fingerprint/V12 translation                                       | Full backup V13                              | F                            |
| `code/src/state/backupTransferSurface.ts`                                                                 | Backup / Restore                                     | Lazy export/import orchestration; V13 full export                                | Existing owners retained                     | F, E                         |
| `code/src/state/dayFrameRestoreComposition.ts`                                                            | Restore                                              | Current active/profile types under same participants                             | Existing transaction retained                | F, E                         |
| `code/src/state/dayFrameRestoreTranslation.ts`                                                            | Restore / Migration                                  | Accept old/current envelopes, write V3                                           | Existing transaction retained                | F, E                         |
| `code/src/state/dayFrameStore.ts`                                                                         | Persistence / Migration / Profile / Backup / Restore | Guarded Sleep commands, V3 ingress/writes, V13 dispatch and lazy transfer wiring | New authored aggregate member                | F, E                         |
| `code/src/state/types.ts`                                                                                 | Domain / Persistence / Backup                        | Sleep authored/pattern/API and V13 result types                                  | New explicit contracts                       | D, F, E                      |
| `code/src/state/sleepFoundation.test.ts`                                                                  | Test                                                 | Production lifecycle, fault and non-activation coverage                          | No production change                         | F                            |
| `code/src/state/activeV2Migration.test.ts`                                                                | Test                                                 | Expect current persisted envelope V3                                             | No production change                         | E                            |
| `code/src/state/tests/dayFrameStore.test.ts`                                                              | Test                                                 | Current snapshot/profile-version expectations                                    | No production change                         | E                            |
| `code/src/ui/DayFrameApp.tsx`                                                                             | Backup                                               | Export/import V13 using canonical store; retain error text                       | Transport only                               | F, E                         |
| `code/src/ui/TodaySurface.tsx`                                                                            | Identity                                             | Exhaustive unsupported-source guard                                              | No product behavior change                   | E                            |
| `code/src/ui/acceptedDecisionPresentation.ts`                                                             | Identity                                             | Exhaustive unsupported-source guards                                             | No product behavior change                   | E                            |
| `code/src/ui/tests/DayFrameApp.test.tsx`                                                                  | Test                                                 | Expect current backup version 13                                                 | No production change                         | E                            |
| `docs/adr/ADR_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTENCE_FOUNDATION.md`                                     | Governance                                           | Dedicated domain, ownership and deferred activation decision                     | Normative foundation authorization           | Review                       |
| `docs/architecture/ARCHITECTURE_CHARTER.md`                                                               | Governance                                           | Canonical version 1.0.1 reference                                                | Narrow governance update                     | Review                       |
| `docs/architecture/DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`                                | Governance                                           | Revision entry, Sleep authored concept and narrowed precedence                   | Narrow governance update                     | Review                       |
| `docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md`                                         | Governance                                           | Required future dedicated Sleep consumption amendment                            | Future semantics explicit; runtime unchanged | Review                       |
| `docs/implementation/phase-9/PHASE_9_TASK_9_11_FIRST_CLASS_SLEEP_DOMAIN_PERSISTENCE_FOUNDATION_RESULT.md` | RESULT                                               | Required evidence and accounting                                                 | None                                         | Structure and hygiene checks |

`state/types.ts`: pre-existing modification = earlier constructive planning/publication contracts; Task 9.11 additional modification = Sleep and V13 types/API. `ui/DayFrameApp.tsx`: pre-existing modification = earlier constructive planning integration; Task 9.11 additional modification = current backup transport/version handling. Baseline comparison separates both additions from earlier work. All other files in this table were clean or absent at Task 9.11 start.

## 35. Deferred First-Class Sleep Work

Still deferred: operational Sleep occurrences, physical context and Work-anchor derivation, deterministic joint feasibility solver, protected occupancy, ordinary movable Commitment ordering, Capacity/Goal feasibility integration, Friction, Suggested Fix, placement/omit decision semantics, immutable Sleep publication/context/seam validation, execution/history/Today/Summary integration, Planner authoring UX, explicit legacy conversion/provenance and overrides. No empty future schema versions or placeholder persisted objects reserve these features.

Future tasks can consume validated active revisions and stable references, but cannot treat this task's applicability result as a scheduled or feasible Sleep occurrence.

## 36. Completion Assessment

The dedicated domain, revision query, lineage, active/profile/backup schemas, supported migrations, coordinated restore/clear behavior, malformed-authority protection and conservative legacy coexistence are implemented. Required matrices and file accounting are present. All 1,212 tests, focused validation, lint, typecheck/build, formatting, the hard bundle gate and diff hygiene pass. Task 9.8B/9.9/9.10 work remains preserved; no commit or push occurred. Scheduling and downstream Sleep authority remain deliberately deferred.

Task 9.11 — First-Class Sleep Domain & Persistence Foundation is COMPLETE.
