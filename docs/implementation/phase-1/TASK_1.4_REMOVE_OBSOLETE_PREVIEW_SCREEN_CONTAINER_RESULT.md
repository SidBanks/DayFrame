# Task 1.4 Result — Remove Obsolete PreviewScreenContainer Path

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.4  
**Result date:** 2026-08-10  
**Execution status:** Implementation complete; project review pending

## Implementation completed

The obsolete `PreviewScreenContainer` path and its isolated test support were
removed. DayFrame now has one supported application-level Preview coordination
path:

```text
DayFrameApp
    -> PreviewScreen
```

No replacement container, adapter, subscription mechanism, or action path was
introduced.

## Files removed

- `code/src/ui/PreviewScreenContainer.tsx`
- `code/src/ui/tests/PreviewScreenContainer.test.tsx`

The removed `PreviewScreenStore` and `PreviewScreenContainerProps` types were owned
only by the deleted module and had no other executable consumer.

## Documentation reviewed and updated

Updated current implementation guidance:

- `docs/hydration/Phase_1_1_6_Hydration.md` now identifies `DayFrameApp` as the
  supported store-to-Preview bridge, including its navigation, range-context, and
  fixed-time-review responsibilities.

Preserved unchanged:

- architecture and UX audits that cite the former adapter as historical executable
  evidence;
- archive material;
- Task 1.1 through Task 1.4 specifications and completed result artifacts.

`CURRENT_STATE.md` was not advanced because the Task 1.4 execution contract
requires project review first. `CHANGELOG.md` was not changed because this bounded
removal is not, by itself, a larger Phase 1 publication milestone.

## Behavioral outcomes

- Production Preview remains reachable through `DayFrameApp`.
- `DayFrameApp` continues to render `PreviewScreen` directly with the same inputs.
- Ordinary suggested fixes continue through the supported store revision path.
- Resolvable fixed-time review continues to navigate to Setup and focus the
  relevant field.
- Preview generation, revision, scheduling, dates, state, persistence, profiles,
  backups, manual events, navigation, focus, and feedback were not modified.
- The obsolete direct-dispatch behavior for fixed-time review was not transferred
  into the supported path.

## Validation performed

### Reference validation

- Repository executable sources, entry/configuration files, and package metadata
  contain no remaining `PreviewScreenContainer` or `PreviewScreenStore` reference.
- Both removed paths were confirmed absent.
- No broken export or module reference was found.

### Targeted validation

`PreviewScreen` and `DayFrameApp` suites passed:

- 2 test files;
- 62 tests.

Existing application coverage continues to exercise Preview rendering, ordinary
suggested fixes, fixed-time Setup navigation/focus, Preview staleness, and
regeneration.

### Full validation

- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm test -- --run` — passed: 22 files, 242 tests
- `npm run build` — passed

The baseline decreased from 23 files/246 tests by exactly the one deleted suite and
its four obsolete tests.

The immutable Task 1.4 specification was preserved. Its SHA-256 observed before
and after implementation was
`836fc7ba0f705c133979ad4edd78e3a397abf60616a56e3d83be4a3f6d8ded11`.

## Architectural result

Before:

```text
Supported: DayFrameApp -> PreviewScreen
Obsolete:  PreviewScreenContainer -> PreviewScreen
```

After:

```text
Supported: DayFrameApp -> PreviewScreen
```

Preview ownership is now represented by one executable application path, matching
the Task 1.3 determination.

## Deviations

None. The implementation remained within the authorized two-file deletion and one
active-documentation correction. No supported behavior or adjacent architecture
was changed.

## Discoveries and deferred work

- Historical audit references now point to evidence that has subsequently been
  removed. They remain valid historical records and were intentionally preserved.
- Whether `DayFrameApp` should use `useSyncExternalStore` remains a separate
  architectural question; this task supplies no evidence requiring that change.
- Manual-event command ownership, feedback aggregation, focus/continuity
  ownership, duplicated date conversion, singular `shiftCycle` compatibility,
  persistence-failure authority, and seeded-store purpose remain deferred.

## Recommended next task

After project review, advance `CURRENT_STATE.md` and select the next
dependency-correct Phase 1 task from the remaining ownership findings. No Preview
container replacement task is required.

## Final completion determination

Task 1.4 is implementation-complete. The obsolete component and its test-only path
are removed, current hydration guidance is accurate, historical evidence is
preserved, the supported Preview workflow remains validated, and no replacement
architecture was introduced.
