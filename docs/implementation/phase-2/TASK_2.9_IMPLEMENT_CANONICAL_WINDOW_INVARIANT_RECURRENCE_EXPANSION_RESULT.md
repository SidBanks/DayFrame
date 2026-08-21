# Task 2.9 — Implement Canonical Window-Invariant Recurrence Expansion — Result

## 1. Executive Result

Implementation completed. `weekly` and `timesPerUserWeek` now allocate occurrences from complete canonical effective-week buckets after applying recurrence bounds, then clip allocated dates to the generation domain. Partial requested windows no longer create replacement occurrences. Daily and specific-weekday behavior remains unchanged.

## 2. Artifact Integrity

The immutable task artifact was complete and ended with the required completion statement.

- Artifact: `/home/sid/.codex/attachments/83371972-f99b-4bda-998e-ceba4662f9f8/pasted-text.txt`
- Size: 29,456 bytes; 1,433 lines
- SHA-256: `5ec279f29706762aa71938cae9ed69885726c15968ffcfdf3120048222896f63`
- The specification remained unchanged.

## 3. Implementation Completed

- Routed both week-scoped recurrence frequencies through canonical effective-week discovery.
- Applied inclusive recurrence bounds to complete buckets before allocation.
- Allocated weekly slot 0 and first-N semantic slots before clipping.
- Clipped only allocated occurrence dates against the original candidate-generation user-day domain.
- Added direct invariant, boundary, transition, buffer, deduplication, and ordering tests.

## 4. Files Changed

- `code/src/core/blocks/generateBlockCandidates.ts`
- `code/src/core/blocks/tests/generateBlockCandidates.test.ts`
- This result artifact

No store, engine API, placement, Preview, UI, persistence, profile, backup, schema, identity, or governance file changed for Task 2.9.

## 5. Recurrence Expansion Before

Weekly and N-per-week paths received recurrence-valid dates already clipped to the generation input, grouped those represented dates by effective week key, and selected the first/first N represented dates. Window start therefore participated in occurrence meaning.

## 6. Recurrence Expansion After

Week-scoped paths receive the generation user-days only to discover relevant keys and define the final clipping set. Each key is expanded to its complete effective bucket, recurrence bounds are applied, occurrence dates are allocated canonically, and only then are dates outside the generation domain removed.

## 7. Canonical Week Discovery

Generation user-days resolve effective week keys using the existing per-date preference authority. Keys are deduplicated and sorted. For each key, the implementation performs a bounded scan from key + 0 through key + 7 and retains every date whose existing effective resolver maps back to that key.

The normal case is seven labels. The eighth bounded label preserves current noon-anchor behavior when a configured day boundary is later than noon; no unbounded recurrence enumeration was introduced.

## 8. Effective Week-Start Transition Handling

Every scanned date independently resolves its active segment and effective `weekStartsOn`. Dates that resolve to another key are not synthesized into the bucket. Irregular transition buckets are therefore deterministic, processed once, and independent of the clipped input subset.

Direct tests cover a transition from Saturday-start to Monday-start semantics, proving canonical dates for both effective buckets, no duplicates, and no narrow-window replacement.

## 9. Recurrence-Bound Application

Inclusive `startsOnDate` and `endsOnDate` filtering now occurs against each complete canonical bucket before weekly/N-per-week allocation. A bucket with no recurrence-valid dates emits nothing.

## 10. Weekly Allocation

Weekly selects the first chronological recurrence-valid date in each canonical bucket as semantic slot 0. It materializes that candidate only if the selected date belongs to the generation user-day set. A later visible date never replaces an earlier canonical occurrence.

## 11. `timesPerUserWeek` Allocation

N-per-week filters the complete bucket by recurrence bounds and takes `slice(0, N)`. These ordered dates are the future semantic slots. Each allocated date is clipped independently afterward. Counts above available dates remain capped at one occurrence per valid user-day.

## 12. Generation-Domain Clipping

Clipping uses the existing set of logical user-day labels whose intervals overlap the candidate-generation input. It does not use final placement time. The engine-provided expanded planning interval remains the candidate generation domain.

## 13. Slot Stability

Allocation happens before clipping. If canonical slot 0/1 falls outside a narrow window, later dates do not become new slots 0/1. No slot field was added; stable semantics are currently represented by canonical allocation order only, as authorized.

## 14. Daily Preservation

The daily switch path continues using the existing recurrence-valid represented user-day list and unchanged candidate builder. Existing daily tests pass without changed expectations.

## 15. Specific-Weekday Preservation

The specific-weekday path continues filtering the existing recurrence-valid represented dates by authored weekday. It does not enter week canonicalization. Existing weekday tests pass unchanged.

## 16. Partial First Week

A recurrence beginning midweek allocates from that inclusive start date within the complete bucket. Tests prove weekly begins on Wednesday, N=2 allocates Wednesday/Thursday, and a Friday-only domain does not repack either occurrence.

## 17. Partial Last Week

A recurrence ending midweek allocates from the bucket's first valid dates through the inclusive end. Tests prove weekly retains its earlier canonical date and a Monday–Tuesday clipped domain exposes only the already allocated Monday slot for N=3; Tuesday is not renumbered into the set.

## 18. N Greater Than Valid Days

Tests cover N=7 and N=9. Both emit exactly the seven distinct valid dates in a complete week. No duplicates or synthetic same-day occurrences are produced, and existing positive-integer validation remains unchanged.

## 19. Engine Buffer Preservation

`generateSchedulePreview` and its ±1-day expansion were not modified. A direct test supplies the equivalent expanded domain around a midweek visible interval and proves that the buffer cannot select a replacement weekly date. All 27 `generateSchedulePreview` regression tests pass.

## 20. User-Day / Overnight Preservation

Canonical recurrence selection continues using logical `userDayDate` labels and existing effective preferences. Placement functions, `applyTimeToUserDay`, work generation, and overnight rules were untouched. Existing user-day, placement, overnight, and engine regressions pass in the full suite.

## 21. Duplicate Prevention

Effective week keys use a `Set` and each sorted key produces one canonical bucket per recurrence invocation. Each canonical date is scanned once per key and N-per-week slices distinct chronological dates. Tests also assert unique candidate IDs across equivalent recurrence input order.

## 22. Deterministic Ordering

Week keys are explicitly lexically sorted, canonical dates are generated chronologically, and existing final candidate sorting remains user-day, priority, then runtime ID. Equivalent recurrence arrays in reverse order produce identical ordered candidate IDs.

## 23. Runtime ID Preservation

The candidate ID format remains `candidate_{templateId}_{recurrenceId}_{userDayDate}`, and scheduled IDs remain unchanged in format. Canonical date correction can legitimately change or omit derived IDs compared with prior partial-window output. No `occurrenceId` or slot property was introduced.

## 24. Profile / Backup Behavior

No provenance-specific path exists. Active, profile-loaded, backup-imported, and directly supplied recurrence definitions all use the corrected candidate generator. Durable representations and compatibility readers were not changed.

## 25. Compatibility Preservation

No recurrence schema, semantic version, persistence key/version, profile format, backup version, or migration changed. Task 2.8 classified this as corrected derived scheduling behavior. Authored recurrence objects remain byte/field compatible.

## 26. Behavior Changes

| Scenario | Before | After |
|---|---|---|
| weekly partial requested week | first represented later day became weekly occurrence | earlier canonical occurrence remains authoritative and is omitted when outside domain |
| N-per-week partial requested week | first N represented dates were repacked | only preallocated canonical slots inside domain appear |
| full ordinary week | first day / first N days | unchanged |
| recurrence-bound partial week | first represented valid days | first canonical recurrence-valid days, then clipped |
| daily/specific weekdays | date-based represented occurrences | unchanged |

The former weekly test's window-coupled May 8 occurrence was removed; canonical May 2 lies outside that generation domain, while May 9 and May 16 remain.

## 27. Tests Added or Updated

The direct candidate suite now has 23 passing tests. Added/strengthened coverage includes:

- canonical weekly clipping and narrow/full comparison;
- N=1, 2, 3, 7, and 9 allocation;
- N-per-week no-repacking;
- partial first and last recurrence weeks;
- zero-valid-date buckets;
- custom Monday week start;
- effective week-start transition;
- engine-style buffer stability;
- deduplication and deterministic recurrence-order behavior;
- retained daily and specific-weekday regressions.

The existing weekly test was updated to assert canonical omission rather than merely replacing one expected date.

## 28. Reference Audit

Production search found one dispatch and one implementation function for each of `weekly` and `timesPerUserWeek`, both in `generateBlockCandidates.ts`. The obsolete `firstDayByUserWeek` and `userDaysByWeek` represented-date allocation paths no longer exist. Direct and Preview generation share the corrected path.

## 29. Architectural Alignment Improvement

Before: requested window → represented dates → weekly occurrence selection.

After: effective recurrence week → recurrence bounds → canonical allocation → requested generation-domain clipping.

This removes the behavioral blocker identified by Tasks 2.7–2.8 and makes future week-key + slot occurrence identity possible.

## 30. Deviations

None.

## 31. Discoveries and Deferred Work

The existing noon-based helper can map a user-day label at key + 7 back to the key when the boundary is later than noon; canonical discovery therefore uses an explicit eight-label bound rather than assuming key + 0…6.

Deferred as required: explicit/versioned occurrence identity, source-incarnation protection, PlanDecision, persistence, richer weekly intent, unsupported recurrence types, timezone architecture, UI, and governance adoption.

## 32. Recommended Next Task

Proceed with **Task 2.10 — Introduce Explicit Versioned Occurrence Identity Without Plan-Decision Behavior**, while explicitly resolving or prerequisiting Task 2.7's source-incarnation concern before any occurrence identity becomes a durable foreign key.

## 33. Validation

- Direct candidate tests: 1 file passed, 23 tests passed.
- Focused recurrence/engine/date tests: 4 files passed, 60 tests passed.
- Engine regression: 1 file passed, 27 tests passed.
- Full suite: 23 files passed, 389 tests passed.
- ESLint: passed.
- TypeScript typecheck: passed.
- Production build: passed (`vite v8.0.10`, 43 modules transformed).
- `git diff --check`: passed.
- Prettier applied only to the two changed TypeScript files.
- Immutable task hash reverified; no governance or durable-format file changed.

## 34. Final Completion Determination

Complete. Weekly and `timesPerUserWeek` expansion now allocates from complete, bounded, deduplicated effective-week buckets after inclusive recurrence bounds and before generation clipping; canonical dates and implicit slot order are window-invariant; daily/specific-weekday, engine buffer, user-day/overnight, runtime ID formats, and durable compatibility remain preserved; transition and boundary behavior is directly tested; and no occurrence identity, PlanDecision, persistence, schema, or UI change was introduced.
