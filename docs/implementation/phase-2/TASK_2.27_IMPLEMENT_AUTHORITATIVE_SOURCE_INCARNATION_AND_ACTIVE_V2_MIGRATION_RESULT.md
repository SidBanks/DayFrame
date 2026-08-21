# Task 2.27 Result — Authoritative Source Incarnation and Active V2 Migration

## Artifact integrity

The immutable task artifact was complete (2,103 lines; 53,362 bytes), ended with the required completion statement, and had SHA-256 `338621548eb65f1b5b33d8fa7676ef50ded9198d77508ebab3e0c82e4a8eac1c`. The saved project copy and supplied attachment were byte-identical.

## Implementation completed

- Added a branded source-incarnation identifier, canonical lowercase UUID-v4 validation, cryptographically strong default allocation, and allocator injection.
- Added Active V2 envelope creation, validation, cloning, global incarnation uniqueness validation, active instantiation, and V1 pattern projection.
- Added the distinct `dayframe-active-v2` key and `dayframe-active-v2-established` authority marker.
- Added V2-first startup, protected invalid/unknown V2 handling, V1 migration, write/read-back verification, and V1 resurrection prevention.
- Retired ordinary active V1 writes. Active writes and retries now target V2; clear removes both active keys and establishes the marker.
- Kept profile and backup formats at V1 and projected incarnation fields out of their writes. Profile loads and backup imports instantiate fresh active incarnations.
- Added lifecycle behavior that preserves incarnation on explicit updates and allocates on create/replace. Manual-event create, update, delete, and replace follow the same rule.
- Preserved scheduling and occurrence-identity algorithms; no `DurableOccurrenceReference`, `PlanDecision`, Profile V2, Backup V2, or UI feature was introduced.

## Files changed by Task 2.27

- `code/src/core/authored/sourceIncarnation.ts` (new)
- `code/src/state/activeV2.ts` (new)
- `code/src/state/activeV2.test.ts` (new)
- `code/src/state/activeV2Migration.test.ts` (new)
- `code/src/state/types.ts`
- `code/src/state/createInitialDayFrameState.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/dayFrameProfiles.ts`
- `code/src/state/dayFrameBackup.ts`
- `docs/implementation/phase-2/Task_2.27_IMPLEMENT_AUTHORITATIVE_SOURCE_INCARNATION_AND_ACTIVE_V2_MIGRATION.md` (immutable saved execution artifact)

The worktree contained numerous earlier Phase 1/2 modifications before this execution; they were preserved and are not claimed as Task 2.27 changes.

## Durable representations

Active V1 remains readable at `dayframe-store-v1` only when neither Active V2 nor the V2-established marker exists. Active V2 is `{ app: "DayFrame", surface: "active", version: 2, data }`; its seven source kinds include incarnation IDs, including nested shift segments and sequence days. Profile V1 and Backup V1 continue to contain authored patterns without incarnation IDs.

## Migration and recovery behavior

Startup prefers V2. A present invalid or unsupported V2 is recovery-protected and never falls back to V1. Eligible V1 data is validated, assigned one fresh incarnation per source, serialized to V2, written, reread byte-for-byte, and only then adopted. V1 is retained. Migration allocation, serialization, write, or verification failure is represented as protected `migrationFailure`. Recovery replacement writes current state as V2. Abandon/clear removes both active representations and leaves the authority marker, preventing V1 resurrection.

## Tests added or updated

Added direct tests for injected canonical allocation, V1 projection, V2 validation, duplicate/noncanonical rejection, successful V1-to-V2 migration, V1 retention, marker establishment, and invalid-V2 no-fallback behavior. Existing backup compatibility tests were included in focused validation.

## Validation performed

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npx vitest run src/state/activeV2.test.ts src/state/activeV2Migration.test.ts src/state/dayFrameBackup.test.ts`: 3 files and 10 tests passed.
- `npm test`: 25 files passed and 2 failed; 450 tests passed and 31 failed (481 total).

The 31 broad-suite failures are predominantly obsolete assertions that read the retired V1 active key, expect active runtime objects without incarnation fields, or count the former single-key persistence calls. They were not rewritten wholesale because doing so would conceal remaining contract gaps described below.

## Deviations and incomplete requirements

- `DayFrameState` exposes incarnation as optional at the TypeScript compatibility edge so the existing test/UI fixture corpus remains compilable, although every store-created active runtime source is instantiated and V2 validation requires it. The task requires a statically mandatory runtime field.
- Migration success does not yet initialize retained active durability status to `durable`.
- Migration failure is classified at the public status level, but the detailed allocation/serialization/write/reread subtype is not retained.
- The complete required failure matrix, stable-rehydration matrix, lifecycle matrix for all seven source kinds, recovery replacement/abandonment matrix, snapshot-isolation suite, persistence-shape suite, and deterministic scheduling regression suite has not been added.
- Existing broad-suite expectations have not been migrated to Active V2 semantics.

No unsupported reader or external persistence contract was discovered. No authorized stop condition requiring scope expansion was encountered.

## Architectural result

The executable path now establishes a real Active V2 boundary and prevents new active V1 writes, while retaining V1/Profile V1/Backup V1 compatibility. However, the static model and validation corpus do not yet fully prove the complete architectural contract.

## Discoveries and deferred work

The prior suite treats local-storage key shape and incarnation-free store snapshots as public behavior. Those tests must be deliberately converted rather than mechanically weakened. The next task should finish the mandatory active type boundary, detailed migration outcome model, and full Task 2.27 matrix before starting durable occurrence references.

## Final completion determination

**Not complete.** The focused implementation is functional and its targeted validation passes, but Task 2.27's completion criteria require mandatory runtime typing and a fully passing, directly protective regression suite. The broad suite currently has 31 failures and the listed contract gaps remain.
