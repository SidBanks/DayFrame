# Task 1.8 Result — Stop Emitting Null `shiftCycle` in Profile/Backup Output

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.8  
**Result date:** 2026-08-11  
**Execution status:** Implementation complete; project review pending

## Implementation completed

New store-created profiles and store-exported Version 1 backups no longer
materialize the meaningless property `shiftCycle: null`. Both now emit complete
plural `shiftCycles` data with the optional singular property absent.

Every established singular-only reader remains intact. The literal Task 1.7 profile
and backup fixtures still normalize legacy singular data into plural runtime
authority.

## Compatibility result

| Boundary | Before new output | After new output | Legacy singular input retained? |
| --- | --- | --- | --- |
| Local storage | `shiftCycles` | Unchanged: `shiftCycles` | Yes |
| Saved profile | `shiftCycles` + `shiftCycle: null` | `shiftCycles`; singular property absent | Yes |
| V1 backup | `shiftCycles` + `shiftCycle: null` | `shiftCycles`; singular property absent | Yes |

All current durable writers now converge on plural-only output while legacy readers
remain directional compatibility inputs.

## Shared clone boundary inspected

The modified helper is `cloneDayFrameAuthoredSetup` in
`code/src/state/dayFrameBackup.ts`.

Executable caller categories inspected:

1. **Backup creation:** `createDayFrameBackup` clones exported authored data.
2. **Backup validation output:** `validateDayFrameBackup` clones normalized V1 data.
3. **Profile creation and storage cloning:** `createDayFrameSavedProfile` and
   `cloneSavedProfiles` use the helper.
4. **Store import/load defensive cloning:** profile load and backup import clone
   already normalized authored data before initial-state creation.
5. **Internal authored snapshot extraction:** store profile save and backup export
   obtain a cloned authored snapshot through `getAuthoredSetup`.
6. **Direct test/API cloning:** backup tests exercise meaningful singular clone
   behavior.

No runtime state transition, scheduling function, local-storage serializer,
validator acceptance rule, or comparison requires explicit null. Store runtime
state is reconstructed from plural cycles, so omission does not change
`DayFrameState.shiftCycle`.

The shared helper could therefore be changed safely; no writer-specific workaround
was required.

## Clone behavior after the change

The helper now follows the optional-property contract:

- when a meaningful singular `shiftCycle` is explicitly supplied, it is cloned and
  retained;
- when the singular input is null or absent, the property is omitted.

This prevents null compatibility output without changing meaningful clone input or
any singular reader.

## Files changed

Production:

- `code/src/state/dayFrameBackup.ts`

Tests:

- `code/src/state/dayFrameBackup.test.ts`
- `code/src/state/dayFrameProfiles.test.ts`
- `code/src/state/tests/dayFrameStore.test.ts`

No other production file changed.

## Tests updated

- Store backup export now explicitly asserts that `shiftCycle` is absent.
- Store profile save now explicitly asserts that `shiftCycle` is absent.
- Backup parse normalization asserts absence instead of explicit null.
- Profile fixtures representing current output no longer include a null singular
  property.
- Task 1.7's literal singular-only profile and V1 backup fixtures remain unchanged
  and passing.
- Existing meaningful-singular clone and versioned round-trip coverage remains
  passing.

## Legacy reader preservation

The following production fallbacks were not modified:

- local-storage singular rehydration;
- saved-profile singular normalization;
- V1-backup singular validation/normalization;
- plural precedence at all three boundaries;
- runtime singular mirror synthesis;
- store and core singular aliases.

Versions remain `1` for profiles and backups. Scheduling inputs and outputs are
unchanged.

## Validation

- Relevant backup/profile/store suites: 3 files, 34 tests — passed
- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm test -- --run` — passed: 22 files, 244 tests
- `npm run build` — passed

## Architectural result

```text
NEW DURABLE OUTPUT
local storage --+
profile --------+--> shiftCycles only
V1 backup ------+

LEGACY INPUT
local shiftCycle ---+
profile shiftCycle -+--> normalize --> shiftCycles authority
backup shiftCycle --+
```

Task 1.8 removes compatibility output, not compatibility input.

## Deviations

None. The shared clone change affected only the authorized profile/backup authored
data shapes and internal defensive copies whose consumers use plural authority. No
unrelated output or behavior change was required.

## Remaining singular writer boundary

The generic clone intentionally preserves a meaningful singular value when a caller
explicitly supplies one. This is not the redundant null writer addressed by Task
1.8 and protects existing clone semantics. Supported store-created profile and
backup outputs do not supply such a value and are plural-only.

## Discoveries and deferred work

- Runtime `DayFrameState.shiftCycle`, `setShiftCycle`, core singular aliases, and all
  durable-data singular readers remain transitional compatibility structures.
- Reader retirement still requires an explicit compatibility horizon.
- Profile/backup validation permissiveness and format versions remain unchanged.
- Further singular cleanup must be separately authorized.

## Recommended next task

After project review, inventory runtime and store/core singular aliases separately
from durable-data readers. A subsequent task may determine whether the runtime
first-cycle mirror or `setShiftCycle` has any supported production caller; it must
not remove durable-data readers without a compatibility policy.

## Final completion determination

Task 1.8 is complete. New profile and backup output no longer emits a meaningless
singular `shiftCycle` property, plural cycles remain complete, all established
legacy singular readers pass, and the full repository validation sequence succeeds.

The immutable task artifact remained unchanged with SHA-256
`6425c65e5860a87eb5125bb51f60777fbf4a8e720b55af7dd99423626ed3f857`.
