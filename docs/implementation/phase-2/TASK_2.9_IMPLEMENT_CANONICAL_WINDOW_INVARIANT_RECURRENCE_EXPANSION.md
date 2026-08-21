# Task 2.9 — Implement Canonical Window-Invariant Recurrence Expansion

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.9

**Task Name:** Implement Canonical Window-Invariant Recurrence Expansion

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_2.9_IMPLEMENT_CANONICAL_WINDOW_INVARIANT_RECURRENCE_EXPANSION_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* recurrence expansion before and after;
* canonical week-bucket discovery;
* recurrence-bound application;
* weekly allocation;
* `timesPerUserWeek` allocation;
* clipping semantics;
* daily/specific-weekday preservation;
* effective week-start transition handling;
* engine-buffer interaction;
* ordering/deduplication;
* behavior changes;
* compatibility preservation;
* tests added or updated;
* validation;
* deviations;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires introducing `OccurrenceIdentity`, PlanDecision, persistence changes, recurrence semantic versioning, authored recurrence schema changes, UI changes, or broader engine refactoring, stop the affected work and record the discrepancy rather than expanding Task 2.9.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Decision;
* Objective;
* Authorized Implementation;
* Canonical Week Discovery;
* Weekly Allocation;
* `timesPerUserWeek` Allocation;
* Clipping Semantics;
* Preservation Requirements;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when weekly and `timesPerUserWeek` recurrence expansion determines canonical occurrences from complete effective user-week buckets and recurrence bounds before generation-window clipping, produces window-invariant occurrence dates and stable slot ordering, preserves daily and specific-weekday behavior, handles effective week-start transitions deterministically, and introduces no occurrence identity, PlanDecision, persistence, schema, or UI change.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Implement the canonical recurrence-expansion contract adopted by Task 2.8.

Task 2.8 established that current week-scoped recurrence is incorrectly coupled to the represented/requested generation window.

Current conceptual behavior:

```text
represented user-days
    ↓
group by effective week key
    ↓
weekly: first represented day
timesPerUserWeek: first N represented days
```

Required behavior:

```text
complete effective user-week bucket
    ↓
apply recurrence bounds
    ↓
assign canonical weekly/N-per-week occurrence dates
    ↓
clip those canonical occurrences to generation domain
```

This correction is required before stable occurrence identity can be implemented safely.

---

# Governing Decision

Task 2.8 adopted:

## Weekly

For each complete effective user-week:

1. enumerate canonical user-days in chronological order;
2. retain only recurrence-valid days;
3. assign slot 0 to the first retained day;
4. if no valid day exists, emit no weekly occurrence;
5. clip after assignment.

## `timesPerUserWeek`

For each complete effective user-week:

1. enumerate canonical user-days in chronological order;
2. retain recurrence-valid days;
3. assign slot `i` to valid day `i`;
4. allocate up to `min(N, validDays.length)` occurrences;
5. clip after assignment;
6. do not repack after clipping.

## Preservation

* `daily` remains unchanged;
* `specificWeekdays` remains unchanged;
* current effective per-user-day `weekStartsOn` authority remains unchanged;
* recurrence bounds remain inclusive;
* engine ±1-day planning buffer remains;
* current placement/filtering behavior remains;
* no recurrence semantic version is added.

---

# Objective

Implement the smallest change necessary so that:

1. weekly occurrence dates are independent of requested-window truncation;
2. `timesPerUserWeek` slot/date assignment is independent of requested-window truncation;
3. partial requested windows never create replacement occurrences;
4. recurrence start/end bounds are applied before allocation;
5. effective week-start changes are handled deterministically;
6. each effective week bucket is processed once per recurrence;
7. daily behavior is unchanged;
8. specific-weekday behavior is unchanged;
9. placement remains unchanged;
10. Preview filtering remains unchanged;
11. no occurrence identity is introduced yet.

---

# Authorized Implementation Scope

The primary implementation seam should be:

```text
generateBlockCandidates
```

or the smallest helper(s) directly supporting recurrence expansion.

Likely authorized changes include:

* helper(s) for discovering complete effective week buckets;
* helper(s) for canonical week-scoped allocation;
* direct recurrence tests;
* updating tests that currently encode window-coupled weekly behavior.

Do not broaden into engine architecture unless required by the adopted contract.

---

# Current Behavior To Replace

For `weekly` and `timesPerUserWeek`, current code effectively:

```text
dates represented by generation input
    ↓
filter by recurrence bounds
    ↓
group represented dates by effective week key
    ↓
select first / first N dates
```

This makes requested-window truncation part of recurrence meaning.

Task 2.9 must remove only that coupling.

---

# Required Behavior After Implementation

Conceptually:

```text
generation domain
    ↓
discover relevant effective week keys
    ↓
for each key:
    discover all canonical dates belonging to that key
    ↓
apply recurrence bounds
    ↓
weekly:
    first valid date
timesPerUserWeek:
    first N valid dates
    ↓
clip canonical occurrence dates against generation domain
    ↓
materialize candidates
```

---

# Canonical Week-Bucket Discovery

This is the central implementation problem.

Task 2.8 preserved current per-user-day effective `weekStartsOn` resolution.

Therefore do not assume:

```text
week key → exactly seven dates derived from one global weekStartsOn
```

without evidence.

Instead, discover the actual dates whose current effective preference resolution maps them to a given effective week key.

---

# Effective Week-Key Discovery

For every user-day relevant to the generation domain:

1. resolve its effective scheduling preferences;
2. compute its effective `userWeekStartDate`;
3. collect the resulting week key.

Then expand sufficiently around each discovered key to find all dates that map to that same key under per-day effective resolution.

Do not allocate occurrences from only the originally represented subset.

---

# Bounded Search Requirement

Week-bucket discovery must remain bounded and deterministic.

Because a normal semantic user-week spans seven user-day labels, the search should inspect only the bounded surrounding date region needed to determine full membership for relevant keys.

Do not introduce unbounded recurrence enumeration.

Record the chosen bound in the result.

---

# Irregular Effective Week Buckets

Task 2.8 found that `weekStartsOn` transitions can create shortened or irregular buckets.

Implementation must:

* preserve per-day effective preference authority;
* collect every canonical date that resolves to the relevant key;
* process that bucket once;
* not assume seven members if the transition produces fewer;
* not synthesize dates that resolve to a different key.

---

# Week-Key Deduplication

Each tuple:

```text
recurrenceId + effectiveWeekKey
```

must be allocated exactly once.

Use deterministic set/map logic.

Do not rely on first-seen insertion from clipped output for semantic selection.

---

# Canonical Date Ordering

Within one effective week bucket:

```text
canonicalDates.sort(chronologically)
```

or equivalent deterministic behavior.

Allocation must use chronological canonical user-day order.

---

# Recurrence Bounds

Apply inclusive recurrence bounds before weekly/N-per-week allocation.

Conceptually:

```text
canonical bucket dates
    ↓
filter:
    date >= startsOnDate, if present
    date <= endsOnDate, if present
    ↓
recurrence-valid canonical dates
```

Do not allocate then repack after recurrence-bound filtering.

---

# Weekly Allocation

For recurrence frequency:

```text
weekly
```

after bounds:

```text
validDates.length === 0
    → no occurrence

otherwise
    → canonical occurrence = validDates[0]
```

Then apply generation-domain clipping.

---

# Weekly Partial Requested Window

Mandatory behavior:

```text
canonical occurrence = Saturday
requested generation domain = Wednesday–Friday
```

Result:

```text
no weekly candidate
```

Do not create a Wednesday replacement.

---

# Weekly Partial First Recurrence Week

Example:

```text
week: Sat–Fri
startsOnDate: Wednesday
```

Canonical valid dates begin Wednesday.

Weekly occurrence:

```text
Wednesday
```

A Friday-only generation domain must not create a Friday replacement.

---

# Weekly Partial Last Recurrence Week

Example:

```text
week: Sat–Fri
endsOnDate: Tuesday
```

Canonical weekly occurrence remains the first recurrence-valid date of that bucket, typically Saturday where valid.

Do not relocate it to Monday/Tuesday merely because only those days are requested.

---

# `timesPerUserWeek` Allocation

For:

```text
timesPerUserWeek
count = N
```

after bounds:

```text
validDates = chronological recurrence-valid bucket dates
occurrenceDates = validDates.slice(0, N)
```

No more than one occurrence per canonical valid user-day under current recurrence semantics.

Then clip each assigned occurrence independently against the generation domain.

---

# Slot Semantics

Even though Task 2.9 does not yet add explicit slot fields, implementation must preserve the semantic ordering:

```text
validDates[0] = slot 0
validDates[1] = slot 1
...
```

Window clipping must not renumber surviving occurrences.

The later occurrence-identity task will formalize these slot numbers.

---

# `timesPerUserWeek` Partial Requested Window

Example:

```text
full canonical week
N = 2
slot 0 = Saturday
slot 1 = Sunday

requested generation domain = Wednesday–Friday
```

Result:

```text
no candidate
```

not:

```text
Wednesday
Thursday
```

---

# Partial First Recurrence Week

Example:

```text
week: Sat–Fri
startsOnDate = Wednesday
N = 2
```

Canonical slots:

```text
slot 0 = Wednesday
slot 1 = Thursday
```

A Friday-only requested domain returns neither.

---

# Partial Last Recurrence Week

Example:

```text
week: Sat–Fri
endsOnDate = Tuesday
N = 3
```

Canonical recurrence-valid dates might be:

```text
Saturday
Sunday
Monday
Tuesday
```

Slots:

```text
0 = Saturday
1 = Sunday
2 = Monday
```

A Monday–Tuesday generation domain returns Monday only.

Tuesday must not become a newly renumbered slot.

---

# N Greater Than Available Valid Days

If:

```text
N > validDates.length
```

emit at most:

```text
validDates.length
```

occurrences.

Do not duplicate a date.

Do not synthesize multiple same-day occurrences.

---

# N Greater Than Seven

Preserve current validation/accepted state semantics.

If the recurrence type currently permits values greater than seven, candidate generation still emits no more than one occurrence per recurrence-valid canonical user-day.

Do not redesign validation in Task 2.9.

---

# Generation-Domain Clipping

After canonical allocation, include only occurrences whose canonical user-day belongs to/intersects the candidate generation domain under existing user-day/date semantics.

Reuse existing date/window helpers where possible.

Do not clip based on final placement time.

---

# User-Day Boundary Preservation

Occurrence selection remains based on logical user-day labels.

A candidate associated with:

```text
userDayDate = Saturday
```

remains Saturday even if a fixed placement before the user-day boundary materializes on Sunday calendar time.

Do not change `applyTimeToUserDay`.

---

# Overnight Preservation

No placement-time or overnight rule changes are authorized.

Canonical recurrence date is determined before placement.

Overnight placement must not change occurrence selection.

---

# Engine ±1-Day Buffer

Preserve:

```text
generateSchedulePreview
    → expanded planning window ±1 day
```

Task 2.9 should treat the expanded planning interval as the generation/clipping domain supplied to candidate expansion.

Canonical week discovery may inspect outside that domain only to determine the complete recurrence bucket.

Do not widen the engine buffer itself unless absolutely required and separately justified.

---

# Daily Preservation

For `daily`, preserve exact existing semantics.

Do not route daily through week canonicalization unless it is a no-behavior-change internal simplification.

Tests must prove unchanged output.

---

# Specific-Weekday Preservation

For `specificWeekdays`, preserve exact existing semantics.

Week grouping must not affect which matching dates are emitted.

Tests must prove unchanged output.

---

# Unsupported Recurrence Preservation

Keep:

```text
perShiftSegment
custom
```

unsupported exactly as before.

Do not implement canonical semantics for them.

---

# Candidate IDs

Do not change current runtime candidate ID format in Task 2.9.

Canonicalized weekly/N-per-week candidates may therefore receive different current IDs than before because their selected canonical date changes.

That is expected derived-output behavior.

Do not add `occurrenceId`.

---

# Candidate Ordering

Preserve current final candidate ordering unless canonicalization requires a deterministic precursor order.

No scheduling semantics should depend on map/set insertion order.

Where order matters internally, sort explicitly by canonical date and existing stable keys.

---

# Duplicate Prevention

Ensure canonical week discovery cannot emit duplicate candidates because:

* multiple generation dates discover the same week key;
* engine buffer overlaps a week in several places;
* irregular effective week buckets are discovered from more than one date.

Direct tests should cover this.

---

# Profile / Backup Loaded Recurrences

No separate path should exist.

Recurrence definitions loaded from:

* active persistence;
* profiles;
* backups

must flow through the same corrected candidate-generation semantics.

Do not branch based on provenance.

---

# Compatibility Preservation

Do not modify durable recurrence objects.

No:

* schema change;
* format version;
* migration;
* profile version change;
* backup version change.

Task 2.8 classified this as corrected derived scheduling behavior.

---

# Behavior Changes To Document

The result must explicitly record affected user-visible cases.

At minimum:

## Weekly clipped partial week

Before:

```text
first represented day
```

After:

```text
canonical earlier occurrence may be omitted
```

## N-per-week clipped partial week

Before:

```text
repacked first N visible days
```

After:

```text
only canonical slots within the domain appear
```

Full-week behavior should remain the same under ordinary stable week preferences.

---

# Test Strategy

Do not merely update old expected dates.

Tests must prove the invariant by comparing multiple windows.

The essential structure is:

```text
same recurrence
same effective preferences
different overlapping generation windows
    ↓
canonical occurrence date/slot meaning remains stable
```

---

# Required Direct Candidate Tests

## Test 1 — Daily Regression

Prove current daily outputs remain unchanged.

---

## Test 2 — Specific Weekdays Regression

Prove current weekday-filtered outputs remain unchanged.

---

## Test 3 — Weekly Full Week

Generate one complete semantic week.

Assert first recurrence-valid canonical date.

---

## Test 4 — Weekly Narrow Midweek Window

Generate only a later partial portion of a week whose canonical weekly occurrence lies earlier.

Assert no replacement occurrence appears.

---

## Test 5 — Weekly Narrow → Wide

Compare narrow and full-week generation.

Assert the full-week occurrence date remains canonical and the narrow window does not produce a different same-week occurrence.

---

## Test 6 — Weekly Wide → Narrow

Equivalent reverse-direction regression.

---

## Test 7 — `timesPerUserWeek = 1`

Prove canonical slot 0 behavior.

---

## Test 8 — `timesPerUserWeek = 2`

Full week:

```text
slot 0 = first valid canonical day
slot 1 = second valid canonical day
```

---

## Test 9 — `timesPerUserWeek = 3`

Equivalent stable ordering.

---

## Test 10 — `timesPerUserWeek = 7`

One occurrence per valid user-day where all seven are recurrence-valid.

---

## Test 11 — `timesPerUserWeek > valid days`

Assert no duplicate user-day candidate.

---

## Test 12 — N-per-week Partial Requested Window

Canonical slots outside the requested domain do not repack.

---

## Test 13 — Partial First Week — Weekly

Recurrence starts midweek.

Assert first canonical valid date.

---

## Test 14 — Partial First Week — N-per-week

Assert first N recurrence-valid dates from start bound.

---

## Test 15 — Partial Last Week — Weekly

Assert correct first valid canonical date if one exists.

---

## Test 16 — Partial Last Week — N-per-week

Assert clipping does not renumber later dates.

---

## Test 17 — No Valid Days In Bucket

Bound recurrence so relevant bucket has zero valid dates.

Assert no occurrence.

---

## Test 18 — Custom Global Week Start

Use a non-default `weekStartsOn`.

Assert canonical allocation follows it.

---

## Test 19 — Effective Week-Start Transition

Construct cycle/segment preferences that change effective `weekStartsOn` across relevant dates.

Assert:

* deterministic bucket discovery;
* no duplicates;
* no clipped-window replacement occurrences.

This test is mandatory because Task 2.8 identified it as the main implementation risk.

---

## Test 20 — User-Day Boundary

Use a non-midnight boundary.

Assert recurrence date selection remains based on logical user-day labels.

---

## Test 21 — Overnight Placement Independence

Where practical, prove canonical candidate date does not change because eventual placement crosses midnight.

This may remain in existing placement/engine tests if candidate tests cannot observe placement.

---

## Test 22 — Engine Buffer Stability

Compare direct/caller behavior around the engine's ±1-day expanded planning window.

Assert the buffer does not alter weekly slot selection.

---

## Test 23 — Duplicate Prevention

Ensure one canonical candidate per allocated occurrence even when several represented dates discover the same effective week key.

---

## Test 24 — Deterministic Ordering

Repeat with equivalent recurrence/template ordering where the engine promises deterministic output.

---

# Existing Weekly Test Update

Task 2.8 identified a current test expecting a week keyed `2026-05-02` to emit `2026-05-08` because May 8 was the first represented date.

Update that test to the canonical contract.

Do not merely change:

```text
2026-05-08
```

to another date without adding narrow/wide invariance coverage.

The important contract is window independence.

---

# Existing N-Per-Week Tests

Preserve full-week expectations where they remain semantically correct.

Add partial-window comparisons because current full-week tests do not expose the defect.

---

# Store Tests

Store behavior should not require mutation.

If existing store/Preview tests rely on changed recurrence output, update only the expected derived schedule where justified.

Do not change store APIs.

---

# Preview Tests

Preview filtering and rendering are out of scope.

If canonical recurrence causes a legitimate expected Preview output change in an existing test, update the fixture expectation without changing Preview behavior.

Document any such changes.

---

# Production Scope Constraint

Prefer production changes limited to:

* `generateBlockCandidates.ts`;
* narrowly scoped recurrence/date helper(s) if necessary.

Do not modify:

* placement;
* friction;
* suggested fixes;
* store;
* profiles;
* backup;
* UI;

unless a direct compile/test dependency requires a non-semantic adjustment.

---

# Helper Design

A small helper may be introduced for concepts such as:

```text
collectCanonicalEffectiveWeekBucket(...)
allocateWeeklyOccurrences(...)
```

or equivalent.

Avoid building a broad recurrence service abstraction.

Task 2.9 is about one correctness seam.

---

# Pure Function Preference

Prefer pure helpers whose outputs depend only on explicit inputs:

* recurrence;
* relevant date domain;
* shift cycles/effective preferences;
* global preferences.

This will make Task 2.9's invariance tests direct and make later occurrence identity easier to layer on.

---

# No Occurrence Identity Yet

Do not add:

```text
OccurrenceIdentity
occurrenceId
slot
```

to production types in Task 2.9.

Stable slots exist conceptually in allocation order only.

Task 2.10 can introduce explicit identity after canonical recurrence behavior is proven.

---

# No Source-Incarnation Work

Task 2.7 identified authored ID reuse.

Do not address it here.

Canonical recurrence is independent of source-incarnation protection.

---

# No PlanDecision

Do not add:

```text
PlanDecision
OccurrenceOverride
ConflictAcknowledgement
```

or related state.

---

# No Persistence Changes

Do not alter:

* active persistence;
* profile format;
* backup format;
* version identifiers;
* compatibility readers;
* migration behavior.

---

# No UI Changes

Do not change recurrence Setup controls, labels, or wording.

Current UI already authors:

```text
weekly
timesPerUserWeek
count
```

Task 2.9 only corrects engine interpretation.

---

# Required Reference Audit

After implementation search production code for all recurrence expansion logic.

Confirm:

* week-scoped selection has one canonical path;
* no alternate helper continues selecting first N represented days;
* direct/Preview generation use the corrected path.

---

# Architectural Alignment Improvement

Before:

```text
requested window
    ↓
defines represented dates
    ↓
defines weekly occurrences
```

After:

```text
recurrence semantics
    ↓
define canonical occurrences
    ↓
requested window clips output
```

This is the required prerequisite for durable occurrence identity.

---

# Explicit Non-Goals

Task 2.9 shall not:

* add occurrence identity;
* add PlanDecision;
* add plan overrides;
* add conflict acknowledgements;
* change runtime ID formats;
* change recurrence schema;
* add preferred weekdays;
* add spacing optimization;
* change UI recurrence controls;
* change placement;
* change friction;
* change suggested fixes;
* change Preview filtering;
* change persistence;
* change profiles;
* change backups;
* add recurrence semantic versions;
* add migrations;
* solve source-incarnation/ID reuse;
* implement `perShiftSegment`;
* implement `custom`;
* add timezone architecture;
* refactor the engine broadly;
* update governance documents before review.

---

# Dependencies

Requires completion and acceptance of:

* Task 2.7 — Establish Stable Generated-Occurrence Identity;
* Task 2.8 — Establish Canonical Window-Invariant Recurrence Expansion.

Earlier Phase 2 authority and stale-safety work must remain preserved.

Governed by:

* current architecture;
* durable-data ADR;
* Task 2.8 canonical recurrence contract.

---

# Expected Files To Change

Likely:

* `code/src/core/blocks/generateBlockCandidates.ts`;
* direct candidate-generation tests;
* possibly one or more narrow date/week helper test files;
* existing engine tests whose expected derived output legitimately changes.

Avoid expanding beyond this set without evidence.

---

# Validation Requirements

Run focused recurrence tests first.

At minimum include:

```text
generateBlockCandidates
generateSchedulePreview
user-week/date utilities
```

where relevant.

Then run:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```text
git diff --check
```

Record:

* focused recurrence test count;
* engine regression count;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 2.9 specification remained immutable;
* result artifact exists separately;
* no governance document changed;
* no durable format changed.

---

# Documentation Rules

During Task 2.9:

## Create

`TASK_2.9_IMPLEMENT_CANONICAL_WINDOW_INVARIANT_RECURRENCE_EXPANSION_RESULT.md`

## Preserve

* Task 2.9 specification;
* Tasks 2.1–2.8 results;
* Phase 1 checkpoint;
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

The Task 2.9 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Recurrence Expansion Before
6. Recurrence Expansion After
7. Canonical Week Discovery
8. Effective Week-Start Transition Handling
9. Recurrence-Bound Application
10. Weekly Allocation
11. `timesPerUserWeek` Allocation
12. Generation-Domain Clipping
13. Slot Stability
14. Daily Preservation
15. Specific-Weekday Preservation
16. Partial First Week
17. Partial Last Week
18. N Greater Than Valid Days
19. Engine Buffer Preservation
20. User-Day / Overnight Preservation
21. Duplicate Prevention
22. Deterministic Ordering
23. Runtime ID Preservation
24. Profile / Backup Behavior
25. Compatibility Preservation
26. Behavior Changes
27. Tests Added or Updated
28. Reference Audit
29. Architectural Alignment Improvement
30. Deviations
31. Discoveries and Deferred Work
32. Recommended Next Task
33. Validation
34. Final Completion Determination

---

# Expected Architectural Result

Before Task 2.9:

```text
weekly/N-per-week recurrence
    ↓
requested window participates in selection
```

After Task 2.9:

```text
weekly/N-per-week recurrence
    ↓
complete effective week
    ↓
canonical allocation
    ↓
requested window clips output
```

This establishes the behavioral prerequisite for explicit versioned occurrence identity.

---

# Expected Follow-Up

If Task 2.9 completes cleanly, the next dependency-correct task should return to Task 2.7's identity contract.

Likely:

> **Task 2.10 — Introduce Explicit Versioned Occurrence Identity Without Plan-Decision Behavior**

That task should:

* add explicit semantic `OccurrenceIdentity`;
* propagate it through candidates/work/manual projections and scheduled/unplaced output;
* preserve current runtime `id`;
* add no PlanDecision behavior yet;
* handle source-kind/context and canonical scope/slot;
* address or explicitly prerequisite source-incarnation protection if still blocking durable use.

Do not implement identity inside Task 2.9.

---

# Completion Criteria

Task 2.9 is complete when:

* weekly expansion allocates from complete effective week buckets;
* `timesPerUserWeek` expansion allocates from complete effective week buckets;
* recurrence bounds are applied before allocation;
* clipping occurs after allocation;
* partial requested windows do not create replacement occurrences;
* canonical slot order survives clipping;
* daily behavior remains unchanged;
* specific-weekday behavior remains unchanged;
* effective week-start transitions are deterministic and tested;
* duplicate canonical allocation is prevented;
* engine ±1-day behavior remains intact;
* runtime IDs remain unchanged in format;
* persistence/profile/backup behavior remains unchanged;
* no recurrence semantic version/migration is added;
* full validation passes;
* the result identifies the next identity task.

---

# Task Determination

Task 2.9 is a bounded recurrence-correctness implementation.

It does not introduce stable occurrence identity or user-owned planning state.

Its purpose is to make week-scoped recurrence occurrence selection independent of requested-window truncation so that future occurrence identity can safely reference canonical week/slot semantics.

**The task is complete when weekly and `timesPerUserWeek` recurrence expansion determines canonical occurrences from complete effective user-week buckets and recurrence bounds before generation-window clipping, produces window-invariant occurrence dates and stable slot ordering, preserves daily and specific-weekday behavior, handles effective week-start transitions deterministically, and introduces no occurrence identity, PlanDecision, persistence, schema, or UI change.**
