# Task 6.3B — Canonical Piecewise User-Day Windows and Variable-Duration Consumer Remediation

## Status

Ready for implementation.

## Phase

Phase 6 — Platform Maturity

## Task Type

Core temporal-model implementation, engine-consumer remediation, user-day ownership correction, variable-duration day support, recurrence/week regression validation, placement/friction boundary remediation, all-day expansion correction, Preview/visualization correction, restore determinism, testing, bundle validation, and governance.

**This task does not implement the Today read model, HistoricalPlan V2 timing provenance, Today UI, transition recommendations, sleep adaptation, Goal reorientation, Capacity, or Recommendations.**

---

# 1. Objective

Implement the accepted canonical user-day transition semantics:

```text
For every local date label D:

prefs(D)
    = effective authored schedule preferences for label D

start(D)
    = local calendar date D
      at prefs(D).dayBoundaryStartTime

userDay(D)
    = [start(D), start(D+1))
```

Then remediate every production consumer whose semantics currently assume that a user-day ends at:

* `start + 24 elapsed hours`;
* `start + 1 calendar day` using the same boundary;
* `1,440 minutes`;
* one segment's boundary across multiple labels.

At completion:

* every instant must belong to exactly one user-day;
* boundary changes must produce truthful shorter/longer user-days;
* current scheduling behavior must remain unchanged where adjacent boundaries are equal;
* transition-day generation, placement, clipping, visualization, and all-day expansion must consume the canonical next start;
* downstream recurring/work/week semantics must remain deterministic;
* no behavioral intelligence may be inferred from variable day duration.

---

# 2. Governing ADR

Task 6.3A accepted:

> **ADR — Canonical User-Day Boundary Transition Semantics**

The governing rule is:

```text
start(D) = boundary for authored label D
day(D)   = [start(D), start(D+1))
```

Boundary increases create longer user-days.

Boundary decreases create shorter user-days.

The label is the calendar date supplying the start.

Segment transition context is separate derived information and cannot affect ownership.

Sleep, Goals, execution evidence, work intervals, and Recommendations never determine user-day ownership.

Do not reopen this decision in Task 6.3B.

---

# 3. Governing Temporal Principle

> **A user-day does not have an intrinsic 24-hour duration.**

Its duration is:

```text
duration(D)
    = start(D+1) - start(D)
```

Examples:

```text
03:00 → 03:00
    normal local day

03:00 → 06:00
    longer transition day

06:00 → 03:00
    shorter transition day
```

DST may independently change elapsed duration.

Do not normalize any of these back to 24 hours.

---

# 4. Governing Monotonicity Principle

Canonical starts must be strictly ordered:

```text
start(D+1) > start(D)
```

The implementation must mechanically verify this invariant where appropriate.

If authored/host time semantics ever produce a non-increasing pair:

* do not silently repair it;
* surface a deterministic failure through the appropriate validation/query boundary;
* document the scenario.

---

# 5. Governing Label Principle

The user-day label remains the local calendar date `D` that supplies `start(D)`.

The end of that user-day comes from the next label:

```text
end(D) = start(D+1)
```

Do not relabel a transition day according to:

* duration;
* incoming shift;
* work start;
* sleep period;
* calendar date containing most hours.

---

# 6. Governing Scope Principle

This task changes **temporal geometry**.

It does not decide what a longer/shorter day means behaviorally.

DayFrame may know:

> This user-day lasts 27 local-clock hours.

It must not infer:

* 27 usable hours;
* additional Capacity;
* user should work more;
* user should sleep at a certain time;
* Goals should be reprioritized.

Those remain future layers.

---

# 7. Explicit Scope

Implement:

* canonical variable-boundary user-day start resolver;
* canonical user-day window resolver;
* instant → unique user-day resolver;
* bounded adjacent-label search;
* monotonicity checks;
* canonical next-start semantics;
* fixed-boundary helper preservation;
* effective-preference-by-label integration;
* work occurrence user-day ownership remediation;
* manual segment boundary remediation;
* user-week lookup review/remediation;
* recurrence regressions;
* candidate-placement user-day bounds;
* opening discovery bounds;
* friction/suggested-fix bounds where user-day ends are assumed;
* manual all-day event expansion to canonical user-day end;
* Preview clipping/overlap/window logic;
* DayVisualizer variable-duration support;
* any hour-label/timeline geometry changes required;
* transition-day deterministic tests;
* cycle-wrap tests;
* DST-focused tests within current timezone architecture;
* restore determinism;
* bundle validation;
* governance.

---

# 8. Explicit Non-Goals

Do not implement:

* HistoricalPlan occurrence V2;
* `timing: { kind: ... }`;
* legacy all-day coverage semantics;
* Today query;
* Today surface data;
* now/next/later;
* ExecutionHistory overlay;
* transition context query;
* transition strategies;
* transitional Sleep recommendations;
* adaptive scheduling;
* Capacity;
* Goal reorientation;
* Recommendation;
* new durable authority;
* new persistence key;
* Backup V7;
* router/deep links;
* timezone-selection infrastructure.

Task 6.3C owns HistoricalPlan timing provenance.

Task 6.3 remains blocked until 6.3B and 6.3C are both complete.

---

# 9. Execution Artifact Rules

Before implementation:

1. verify this complete Task 6.3B artifact;
2. save immutable project copy;
3. compare supplied/saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 6.3A result;
   * Canonical User-Day Boundary Transition ADR;
   * current `userDay.ts`;
   * `userWeek.ts`;
   * cycle/segment effective-preference resolvers;
   * work generation;
   * candidate generation;
   * placement;
   * friction;
   * suggested fixes;
   * manual event materialization;
   * Preview generation;
   * PreviewScreen;
   * DayVisualizer;
   * relevant tests;
6. do not modify the immutable Task artifact.

Create:

`docs/implementation/phase-6/TASK_6.3B_CANONICAL_PIECEWISE_USER_DAY_WINDOWS_AND_VARIABLE_DURATION_CONSUMER_REMEDIATION_RESULT.md`

---

# 10. Initial Production Audit

Before modifying code, identify every production use of assumptions equivalent to:

```text
+ 24 hours

+ 1 day with the same boundary

1440 minutes

24 displayed hours

segmentStartBoundary applied to every day in segment
```

Search production and tests.

Classify each occurrence:

* temporal semantic assumption;
* harmless display constant;
* unrelated duration;
* needs remediation;
* needs regression only.

Do not mechanically replace every `24` or `1440`.

---

# 11. Canonical Temporal API

Introduce the smallest coherent canonical API.

Conceptually:

```text
resolveUserDayStartForLabel(...)
resolveUserDayWindowForLabel(...)
resolveUserDayContainingInstant(...)
```

Exact names follow repository conventions.

Do not overload the existing fixed-boundary helper until its semantics become ambiguous.

---

# 12. Existing Fixed-Boundary Helper

Preserve the existing helper that answers:

> Given a fixed boundary, map this instant/day.

It remains valid as a primitive.

Do not silently change its semantics to consult authored state.

Prefer a new higher-level resolver for variable boundaries.

---

# 13. Preference Resolver Reuse

For label `D`, use the existing canonical effective schedule-preference resolver for that label.

Do not reproduce:

* segment selection;
* defaulting;
* boundary override logic;
* week-start logic.

The label-first preference lookup is the accepted architecture.

---

# 14. Canonical Start Resolver

For label `D`:

1. resolve effective preferences for `D`;
2. apply its boundary to local calendar date `D`;
3. return canonical start plus relevant provenance.

Potential result:

```text
{
    userDayDate: D,
    start,
    dayBoundaryStartTime,
    weekStartsOn,
    segment/cycle context where already available
}
```

Do not retain unnecessary current Active data.

---

# 15. Canonical Window Resolver

For label `D`:

```text
start = start(D)
end   = start(D+1)
```

Return:

```text
[start, end)
```

plus:

* label;
* effective preferences for the start label;
* possibly next-label boundary provenance where useful;
* duration.

Do not compute end by applying `D`'s boundary to `D+1`.

---

# 16. Duration Semantics

If returning duration, derive:

```text
end - start
```

Do not assume:

```text
1440 minutes
```

Use elapsed milliseconds/minutes only where needed.

Preserve local-clock/date semantics where existing UI requires them.

---

# 17. Instant → User-Day Resolver

Given instant `T`, find the unique `D` satisfying:

```text
start(D) <= T < start(D+1)
```

Do not use fixed-point iteration.

---

# 18. Bounded Search

The resolver should not require an unbounded scan.

A likely strategy:

1. derive local calendar label containing `T`;
2. compute candidate starts for nearby labels;
3. expand backward/forward only as necessary until `T` is bracketed.

Because each boundary lies within its own calendar date, a small deterministic neighborhood should suffice.

Prove the bound from accepted semantics.

Do not use arbitrary magic loop counts without justification.

---

# 19. Exact Boundary Ownership

At:

```text
T == start(D)
```

`T` belongs to `D`.

At:

```text
T == start(D+1)
```

`T` belongs to `D+1`.

Mandatory tests.

---

# 20. Boundary Increase

Required:

```text
D boundary     03:00
D+1 boundary   06:00
```

Expected:

```text
day(D)
    [D 03:00, D+1 06:00)
```

No gap.

---

# 21. Boundary Decrease

Required:

```text
D boundary     06:00
D+1 boundary   03:00
```

Expected:

```text
day(D)
    [D 06:00, D+1 03:00)
```

No overlap.

---

# 22. Equal Boundary Regression

All current fixed-boundary behavior must remain semantically identical when:

```text
boundary(D) == boundary(D+1)
```

This is a major backward-compatibility requirement.

---

# 23. Repeated Boundary Changes

Test:

```text
03:00
06:00
03:00
05:00
```

Consecutive windows must still be unique and ordered.

---

# 24. Cycle Wraparound

Test last repeating segment → first repeating segment.

Boundary changes at wrap must use the same label-first rule.

Do not special-case wrap.

---

# 25. Manual Segment Transition

Manual adjacent segments with different boundaries must produce correct starts independently for each label.

Remove any production assumption that one segment's starting boundary governs every day inside the segment.

---

# 26. Segment Interior

Within a segment whose boundary is unchanged, windows remain normal according to that boundary.

Only the segment edge changes duration unless adjacent labels differ for another reason.

---

# 27. Default / Override Transition

Test:

```text
global boundary 03:00

segment A
no override

segment B
override 06:00
```

and reverse.

The resolver must use effective resolved values, not raw override presence.

---

# 28. DST

Add deterministic tests in the repository's supported timezone/runtime context for:

* spring-forward;
* fall-back;
* boundary transition near DST where practical.

Do not add timezone selection.

The important invariant is:

```text
start(D+1) > start(D)
```

and correct local-boundary construction.

Do not assert every nominal fixed-boundary day is exactly 24 elapsed hours.

---

# 29. User Week

Audit `userWeek.ts`.

Week identity must be based on:

* canonical user-day label;
* effective `weekStartsOn`;

not by repeatedly adding elapsed 24-hour durations.

Remediate if needed.

---

# 30. Week Boundary Transition

If `weekStartsOn` changes across segments:

do not let elapsed duration determine week identity.

Use each user-day label's effective preference semantics according to existing architecture.

Add regression tests for at least one transition.

---

# 31. Recurrence Expansion

Audit:

* daily;
* weekly;
* specific weekdays;
* times-per-user-week.

Ensure they enumerate canonical labels rather than elapsed-day durations.

Do not redesign recurrence policy.

---

# 32. Recurrence Candidate Time Placement

When a recurrence applies time to user-day label `D`:

ensure time placement uses the canonical user-day start/window semantics.

Times before the boundary may still fall on the next civil calendar date according to existing authored-time semantics.

Do not regress Task 1.x overnight placement behavior.

---

# 33. Work Generation

Audit work block ownership and generated `userDayDate`.

Work generation currently begins from calendar-start-date/segment logic.

Correct user-day assignment using the canonical variable resolver where necessary.

---

# 34. Overnight Work

Required transition fixture:

```text
overnight work
18:15 → 06:15

boundary transition
03:00 → 06:00
```

Confirm exact ownership.

Do not infer recovery/off time.

---

# 35. Adjacent Shift Handoff

Test a work interval ending at the same instant the next regime's work begins.

Example:

```text
old work ends 06:15
new work begins 06:15
```

No temporal gap/overlap should be invented by user-day ownership.

Work intervals and user-day windows are separate facts.

---

# 36. Work Overlap

If authored work actually overlaps, preserve that overlap.

The temporal resolver must not “fix” scheduling conflicts.

---

# 37. Candidate Placement Bounds

Remediate any logic equivalent to:

```text
dayEnd = dayStart + 24h
```

Use:

```text
dayEnd = start(D+1)
```

---

# 38. Openings Discovery

Schedule openings within user-day `D` must respect its exact variable window.

A longer transition day may have a longer temporal window.

A shorter transition day may have less temporal space.

Do not interpret that as Capacity.

It is only raw scheduling geometry.

---

# 39. Placement on Longer Day

Add tests proving a valid opening after the old 24-hour endpoint but before canonical `start(D+1)` can be used where all other scheduling rules allow it.

Do not overconstrain placement to 1,440 minutes.

---

# 40. Placement on Shorter Day

Add tests proving candidates cannot be placed beyond the canonical early `start(D+1)` merely because `start(D)+24h` would extend farther.

---

# 41. Sleep Placement

Sleep remains an ordinary schedulable block/template.

Verify placement respects variable user-day windows.

Do not introduce transition sleep policy.

---

# 42. Preferred Windows

Audit preferred-window calculations such as:

* afterWork;
* beforeSleep;
* custom time;
* other windows.

Ensure any user-day end bounds use canonical next start.

Do not change preferred-window meanings.

---

# 43. Friction Detection

Audit temporal bounds in friction detection.

Variable user-day windows must not:

* hide a conflict after an assumed 24h cutoff;
* fabricate an opening after a shorter canonical end.

Do not change friction categories.

---

# 44. Suggested Fixes

Audit suggested-fix generation/application.

Any proposed move bounded by user-day end must use canonical end.

Do not introduce Recommendation semantics.

Suggested fixes remain deterministic scheduling remediation.

---

# 45. Move Fixes

Regression-test move fixes across a transition day.

Do not allow a move outside the canonical user-day merely because old 24h math permits it.

---

# 46. Manual All-Day Events

Task 6.3A confirmed:

> `ManualCalendarEvent.allDay` means **user-day-wide**.

Therefore a new all-day occurrence for label `D` must span:

```text
[start(D), start(D+1))
```

not:

```text
start(D) → same boundary on next civil date
```

if the next label's boundary differs.

---

# 47. All-Day Transition Example

For:

```text
Sat boundary 03:00
Sun boundary 06:00
```

Saturday all-day event must span:

```text
Sat 03:00 → Sun 06:00
```

It is a 27-local-clock-hour user-day-wide event.

Do not truncate to Sunday 03:00.

---

# 48. Reverse All-Day Example

For:

```text
Sat boundary 06:00
Sun boundary 03:00
```

Saturday all-day event spans:

```text
Sat 06:00 → Sun 03:00
```

Do not extend to Sunday 06:00.

---

# 49. Timed 24-Hour Event Preservation

A timed 24-hour event remains timed and is not automatically converted to user-day-wide semantics.

Task 6.3C will preserve that distinction historically.

Task 6.3B must not collapse authored semantics during generation.

---

# 50. Preview Range

Audit planning-range expansion.

Label enumeration can remain label-based.

Do not expand ranges by repeated elapsed 24-hour arithmetic.

---

# 51. Preview User-Day Window

Preview clipping and overlap calculations must use:

```text
[start(D), start(D+1))
```

for each rendered label.

---

# 52. Preview Cross-Boundary Items

Items crossing civil midnight or the configured boundary must remain correctly clipped inside a variable-duration user-day.

---

# 53. Preview Staleness

No change.

Temporal remediation must not alter when Preview becomes stale.

---

# 54. Preview Publication

No change to publication trigger.

Task 6.3C owns timing-provenance changes.

---

# 55. DayVisualizer

Current 24-hour visualizer assumptions must be remediated.

It must accept/use the canonical window duration supplied for the selected user-day.

---

# 56. Visualization Scale

Do not render every user-day as a normalized fake 24-hour semantic timeline if doing so misrepresents hours.

Determine the smallest truthful rendering compatible with current visualizer structure.

Strong preference:

> scale against actual canonical window duration.

---

# 57. Hour Labels

A 27-hour day may contain more than 24 hourly positions across civil-date transition.

A 21-hour day contains fewer.

Hour labels must remain based on actual local times in the canonical interval.

Do not label vertical positions merely 0–23 if that becomes ambiguous.

---

# 58. Repeated Local Times

DST fall-back can repeat local hour labels.

Do not treat identical display labels as identical instants.

Use exact Date/instant positions internally.

Display disambiguation should follow current platform convention unless a blocker appears.

---

# 59. Missing Local Times

DST spring-forward may skip local times.

Do not fabricate an hour.

---

# 60. Visualizer Duration Contract

Prefer a contract like:

```text
userDayStart
userDayEnd
```

rather than:

```text
boundary + assumed 24h
```

Do not make the visualizer re-resolve authored preferences if the parent already owns the canonical window.

---

# 61. PreviewScreen Contract

Audit whether PreviewScreen should resolve windows or receive them.

Prefer canonical logic in core/application helpers, not repeated UI math.

---

# 62. Single Temporal Source

All production consumers should converge on the same canonical window helper.

Do not create separate implementations for:

* engine;
* Preview;
* visualizer;
* manual events.

---

# 63. HistoricalPlan Day Context

Task 6.3A identified a question: HistoricalPlan currently freezes the start label's boundary but not necessarily its canonical end/next boundary.

Task 6.3B must audit implementation impact but **must not perform the 6.3C occurrence timing provenance work**.

Determine whether variable user-day correctness requires adding day-window provenance now.

If yes, stop and report because that changes historical authority beyond the scoped ADR.

Do not silently widen HistoricalPlan schema.

---

# 64. New Publication Geometry

New plan generation may now produce all-day/timed intervals whose ends differ from legacy fixed-boundary behavior at transitions.

That is an intentional consequence of canonical temporal truth.

Document it.

Do not attempt to preserve incorrect old transition geometry for backward compatibility.

---

# 65. Existing HistoricalPlan Immutability

Do not rewrite existing historical plan intervals.

Task 6.3B changes future engine output only.

Legacy published history remains frozen.

---

# 66. Active/Preview Existing State

After application update, regenerating a Preview may yield different transition-day geometry from an old publication.

That is expected.

Do not silently mutate old plan history.

---

# 67. Restore Determinism

Given the same restored authored setup and same planning dates:

canonical user-day starts/windows must resolve identically.

Add focused test where practical.

---

# 68. Profiles

Profiles already carry authored setup.

Loading a profile changes active authored schedule preferences and therefore future canonical user-day windows.

That is correct.

Do not mutate HistoricalPlan merely on profile load unless current semantics already do so.

---

# 69. Full Clear

No new temporal authority exists to clear.

---

# 70. Persistence Boundary

No:

* new DB store;
* new localStorage key;
* cached user-day windows;
* transition authority.

Canonical windows are derived.

---

# 71. Query/Helper Purity

Core temporal helpers must be deterministic from explicit inputs.

Avoid `Date.now()`.

---

# 72. Locale/Timezone Boundary

Use existing local-date/time semantics.

Do not add IANA timezone configuration.

If platform-local timezone dependence exists today, preserve it and document.

---

# 73. Performance

Canonical window resolution may query effective preferences for adjacent labels.

Avoid repeated expensive re-resolution inside tight placement loops where a bounded memo/cache local to one pure computation can safely be used.

Do not persist the cache.

---

# 74. Planning-Range Precomputation

If engine generation touches many labels, consider precomputing canonical windows once for the generation range.

Only do so if it materially reduces repeated work and keeps logic clearer.

No new authority.

---

# 75. Clone Isolation

Any new returned window/context objects must be clone-safe and not expose mutable authored objects.

---

# 76. Invalid Authored State

Current authored validators already constrain boundary format and cycle overlap.

Reuse them.

Do not add UI repair behavior.

---

# 77. Monotonicity Failure Handling

If monotonicity unexpectedly fails despite valid authored boundaries:

throw/return a deterministic internal validation error rather than creating zero/negative-duration days.

Add a defensive test around the helper where feasible.

---

# 78. Compatibility — Stable Regimes

Most users/days with unchanged boundaries should observe no scheduling difference.

Add broad regression coverage around current default/night/day configurations.

---

# 79. Compatibility — Transition Regimes

Transition behavior is intentionally changing because it was previously undefined/inconsistent.

Document all expected differences.

---

# 80. Migration Boundary

No data migration.

The new semantics apply when authored state is projected/generated after upgrade.

Existing historical records remain unchanged.

---

# 81. Test Strategy — Core

Add focused tests for:

1. equal boundary;
2. increase;
3. decrease;
4. repeated changes;
5. exact start;
6. exact end;
7. bounded instant search;
8. cycle wrap;
9. manual-segment transition;
10. default-to-override;
11. override-to-default;
12. monotonicity;
13. clone isolation if applicable.

---

# 82. Test Strategy — DST

Add focused tests for current supported runtime semantics:

* spring-forward;
* fall-back;
* variable boundary plus DST where stable/reliable.

Avoid environment-dependent brittle tests.

If repository cannot safely pin timezone behavior, document and use lower-level deterministic date fixtures according to existing conventions.

---

# 83. Test Strategy — Work

Cover:

* normal daytime work;
* overnight work;
* transition ownership;
* adjacent old/new shifts;
* work ending exactly as next begins;
* authored overlap remains overlap.

---

# 84. Test Strategy — Placement

Cover:

* normal 24-ish day;
* longer transition day;
* shorter transition day;
* late opening valid only on longer day;
* forbidden late placement on shorter day;
* Sleep placement;
* custom-time before boundary;
* afterWork past midnight.

---

# 85. Test Strategy — Friction

Cover at least one conflict and one suggested move near each kind of transition-day edge.

---

# 86. Test Strategy — Manual All-Day

Cover:

* stable boundary;
* longer day;
* shorter day;
* exact generated start/end;
* timed 24-hour event remains distinct in authored/generated shape.

---

# 87. Test Strategy — Preview

Cover:

* transition user-day clipping;
* cross-midnight occurrence;
* item near extended end;
* item beyond shortened end;
* selected-day labels.

---

# 88. Test Strategy — Visualizer

Cover:

* normal duration;
* longer day;
* shorter day;
* clipping bounds;
* hour label count/order where deterministic;
* no hardcoded 1,440-minute geometry.

---

# 89. Test Strategy — Week/Recurrence

Cover:

* times-per-user-week across boundary transition;
* weekday recurrence;
* week-start transition;
* cycle wrap;
* no duplicate/omitted labels caused by elapsed-duration assumptions.

---

# 90. Test Strategy — Restore

If practical:

authored setup → Backup/restore → canonical window resolution should produce same result.

No Today state involved.

---

# 91. Property Invariants

Where practical prove:

### A

Every evaluated instant belongs to exactly one user-day.

### B

Consecutive windows meet exactly:

```text
end(D) == start(D+1)
```

### C

No windows overlap.

### D

No windows leave gaps.

### E

Equal-boundary behavior matches legacy fixed-boundary behavior.

### F

Boundary increase lengthens only according to actual start difference.

### G

Boundary decrease shortens only according to actual start difference.

### H

Storage/order of segment definitions does not affect canonical resolution after validation.

### I

Work/event geometry does not determine boundary ownership.

### J

Sleep does not determine boundary ownership.

### K

Goal/ExecutionHistory does not determine boundary ownership.

---

# 92. Required Temporal API Matrix

Produce:

| API/helper                  | Old role | New role | Authoritative? |
| --------------------------- | -------- | -------- | -------------: |
| fixed-boundary `getUserDay` |          |          |                |
| start-for-label resolver    |          |          |                |
| window-for-label resolver   |          |          |                |
| instant owner resolver      |          |          |                |
| user-week resolver          |          |          |                |

---

# 93. Required Boundary Matrix

Produce:

| D boundary     | D+1 boundary  | Window consequence |
| -------------- | ------------- | ------------------ |
| 03:00          | 03:00         |                    |
| 03:00          | 06:00         |                    |
| 06:00          | 03:00         |                    |
| 00:00          | 12:00         |                    |
| 12:00          | 00:00         |                    |
| DST transition | same boundary |                    |

Use actual elapsed/local duration evidence carefully.

---

# 94. Required Consumer Matrix

Produce:

| Consumer                            | Prior assumption | Remediation | Validation |
| ----------------------------------- | ---------------- | ----------- | ---------- |
| work generation                     |                  |             |            |
| recurrence                          |                  |             |            |
| user week                           |                  |             |            |
| placement                           |                  |             |            |
| friction                            |                  |             |            |
| suggested fixes                     |                  |             |            |
| manual all-day                      |                  |             |            |
| Preview clipping                    |                  |             |            |
| DayVisualizer                       |                  |             |            |
| HistoricalPlan publication geometry |                  |             |            |

---

# 95. Required Transition Example Matrix

Use a representative shift transition:

| Label | Boundary | Work regime | Canonical window |
| ----- | -------- | ----------- | ---------------- |
| Fri   |          |             |                  |
| Sat   |          |             |                  |
| Sun   |          |             |                  |
| Mon   |          |             |                  |

Show:

* old overnight block;
* transition window;
* first incoming day block.

Do not infer Sleep/recovery.

---

# 96. Required All-Day Matrix

Produce:

| User-day type      | All-day authored event interval |
| ------------------ | ------------------------------- |
| stable             |                                 |
| longer transition  |                                 |
| shorter transition |                                 |
| DST variation      |                                 |

---

# 97. Required Placement Matrix

Produce:

| Condition                                     | Canonical bound | Expected |
| --------------------------------------------- | --------------- | -------- |
| candidate before start                        |                 |          |
| candidate inside normal day                   |                 |          |
| candidate after old 24h but inside longer day |                 |          |
| candidate after shortened canonical end       |                 |          |
| candidate ending exactly at canonical end     |                 |          |

---

# 98. Required Visualization Matrix

Produce:

| Day type | Start | End | Duration used for scale | Hardcoded 24h? |
| -------- | ----- | --- | ----------------------- | -------------: |
| stable   |       |     |                         |                |
| longer   |       |     |                         |                |
| shorter  |       |     |                         |                |
| DST      |       |     |                         |                |

---

# 99. Required Persistence Matrix

Produce:

| Concern                         | Task 6.3B effect |
| ------------------------------- | ---------------- |
| Active authored state           |                  |
| Preview                         |                  |
| HistoricalPlan existing records |                  |
| new HistoricalPlan publications |                  |
| Profiles                        |                  |
| Backup V6                       |                  |
| Restore                         |                  |
| Full clear                      |                  |

---

# 100. Required Product-Boundary Matrix

Produce:

| Capability                          | Task 6.3B |
| ----------------------------------- | --------- |
| variable user-day ownership         |           |
| variable duration                   |           |
| work ownership                      |           |
| placement                           |           |
| all-day expansion                   |           |
| Preview clipping                    |           |
| DayVisualizer                       |           |
| HistoricalPlan V2 timing provenance |           |
| Today read model                    |           |
| Today UI                            |           |
| transition context                  |           |
| sleep recommendation                |           |
| Goal reorientation                  |           |
| Capacity                            |           |
| Recommendation                      |           |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 101. Required Epistemic Matrix

Produce:

| Evidence/state               | DayFrame may say | Must not say |
| ---------------------------- | ---------------- | ------------ |
| 27-hour user-day             |                  |              |
| 21-hour user-day             |                  |              |
| extra schedule opening       |                  |              |
| reduced schedule opening     |                  |              |
| shift work changed           |                  |              |
| all-day event spans long day |                  |              |
| Sleep block scheduled        |                  |              |
| no Sleep block               |                  |              |

---

# 102. Architectural Invariants

Assess at minimum:

1. user-day starts are label-first.
2. each label resolves its own effective boundary.
3. end(D) equals start(D+1).
4. every instant has one owner.
5. no gap exists at boundary increase.
6. no overlap exists at boundary decrease.
7. exact boundary instant belongs to incoming day.
8. starts are strictly increasing.
9. user-day duration may vary.
10. fixed 24-hour duration is not canonical.
11. DST may produce variable elapsed duration independently.
12. label remains the calendar date supplying the start.
13. fixed-boundary helper remains a primitive.
14. fixed-point iteration is not used.
15. work does not define temporal ownership.
16. Sleep does not define temporal ownership.
17. Goal does not define temporal ownership.
18. ExecutionHistory does not define temporal ownership.
19. Recommendation policy does not define temporal ownership.
20. effective authored preferences remain source for boundary.
21. segment transition context remains separate.
22. manual segment boundaries resolve per label.
23. cycle wrap uses same semantics.
24. user-week uses labels, not elapsed-day duration.
25. recurrence enumeration remains label-based.
26. times-per-user-week does not assume 168 elapsed hours.
27. work ownership uses canonical resolver where needed.
28. overnight work remains supported.
29. adjacent shifts may meet exactly.
30. authored overlaps remain preserved.
31. placement uses canonical end.
32. openings use canonical end.
33. longer days may expose later raw openings.
34. shorter days truncate raw openings appropriately.
35. raw openings are not Capacity.
36. Sleep placement uses canonical end.
37. preferred windows retain semantic meaning.
38. friction uses canonical bounds.
39. suggested moves use canonical bounds.
40. manual all-day means user-day-wide.
41. all-day end uses start(D+1).
42. timed 24-hour event remains timed.
43. Preview clipping uses canonical windows.
44. Preview does not assume 1,440 minutes.
45. visualizer accepts actual window duration.
46. visualizer no longer semantically promises 24 hours.
47. civil-midnight crossing remains supported.
48. DST repeated/skipped hours do not collapse instant identity.
49. no current HistoricalPlan record is rewritten.
50. new generated geometry may differ at transitions.
51. Task 6.3C timing provenance remains deferred.
52. HistoricalPlan V1 timing semantics remain unchanged.
53. no Today query is implemented.
54. no Today UI is implemented.
55. no ExecutionHistory overlay is implemented.
56. no transition-context query is implemented.
57. no transitionStrategyId behavior is implemented.
58. no sleep-transition policy is implemented.
59. no Goal-reorientation policy is implemented.
60. no Capacity is implemented.
61. no Recommendation is implemented.
62. no new authority exists.
63. no persistence key is added.
64. no DB migration is introduced.
65. Backup V6 envelope is unchanged.
66. profiles remain authored setup only.
67. restore reproduces canonical windows.
68. full clear needs no temporal participant.
69. new core helpers are deterministic.
70. core does not read wall clock.
71. invalid/non-monotonic windows fail deterministically.
72. single canonical temporal implementation is reused.
73. duplicated engine/UI boundary math is removed where practical.
74. current stable-regime tests remain green.
75. transition fixtures are added.
76. cycle-wrap tests are added.
77. DST behavior is tested to repository-supported extent.
78. placement transition tests are added.
79. all-day transition tests are added.
80. Preview transition tests are added.
81. visualizer transition tests are added.
82. work transition tests are added.
83. recurrence/week transition tests are added.
84. no UI behavior outside temporal geometry changes unnecessarily.
85. accessibility remains preserved.
86. Summary remains unchanged.
87. Planner surface architecture remains unchanged.
88. Today placeholder remains unchanged.
89. bundle budgets remain governing.
90. no unnecessary dependency is added.
91. canonical validation passes.
92. Task 6.3 remains blocked pending 6.3C.

Classify each as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Not applicable;
* Blocked.

---

# 103. Stop Conditions

Stop and report rather than widening scope if:

* canonical starts cannot be made strictly increasing under valid authored state;
* instant ownership cannot be resolved with a bounded deterministic search;
* week semantics require redefining recurrence architecture;
* variable-duration windows require a new durable authority;
* placement cannot support variable windows without scheduler redesign beyond bounded remediation;
* DayVisualizer cannot truthfully render variable durations without a wholesale visualization rewrite;
* all-day user-day-wide semantics conflict with authored manual-event authority;
* HistoricalPlan requires a schema change merely to represent canonical user-day window geometry;
* Backup V6 would need an envelope change for temporal remediation alone;
* DST reveals an unsupported platform-level ambiguity that cannot be handled within existing time architecture.

If HistoricalPlan provenance needs change, defer it to or amend 6.3C rather than silently widening 6.3B.

---

# 104. Likely Files

Potential areas include:

```text
core/time/userDay*
core/time/userWeek*
core/cycles/*
core/shifts/*
core/blocks/*
core/friction/*
core/engine/*
core/calendar/*
ui/PreviewScreen*
ui/DayVisualizer*
state/manualCalendarEvents*
tests
governance
```

Audit actual paths before changes.

---

# 105. Focused Validation

Run focused suites covering at minimum:

* user-day;
* user-week;
* cycle preference resolution;
* shift/work generation;
* block candidate generation;
* placement;
* friction;
* suggested fixes;
* manual events;
* Preview;
* DayVisualizer.

Record exact files/test counts.

---

# 106. Full Validation

Before completion run repository-standard commands:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Use actual scripts if they differ.

Record:

* test-file count;
* test count;
* production module count;
* initial raw JS;
* initial gzip;
* largest lazy chunk;
* total JS;
* diff result.

---

# 107. Bundle Baseline

Task 6.3A did not change production bytes.

Current baseline remains:

```text
Initial raw     677,829
Initial gzip    168,596
Largest lazy     30,091
Total JS        707,920
```

Budgets remain:

```text
Initial raw     <= 685,000
Initial gzip    <= 170,000
Largest lazy    <= 100,000
Total JS        <= 750,000
```

Any >25 kB initial growth requires explicit review.

This task may add some core temporal code but should not add substantial dependencies.

---

# 108. Manual Product Walkthrough

Task 6.3B changes Preview/visualizer behavior and therefore should include a manual walkthrough if an interactive environment is available.

Inspect at minimum:

### Stable day

* normal boundary;
* normal Preview;
* no visual regression.

### Longer transition day

* actual extended user-day window;
* scheduled item near extended end;
* all-day event spans entire transition window;
* visualizer does not truncate at 24 hours.

### Shorter transition day

* shortened window;
* items clip correctly;
* no phantom late hours;
* all-day event ends at canonical next start.

### Overnight work

* old/new shift transition;
* civil-midnight crossing.

If not performed, explicitly state so.

---

# 109. Governance

Update:

* Task 6.3B result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

The accepted ADR already governs the decision.

Do not create another ADR unless implementation uncovers a genuinely new enduring temporal rule.

---

# 110. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.3B_CANONICAL_PIECEWISE_USER_DAY_WINDOWS_AND_VARIABLE_DURATION_CONSUMER_REMEDIATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.3A Prerequisite Confirmation
4. ADR Confirmation
5. Initial 24-Hour Assumption Audit
6. Files Changed
7. Temporal Module Placement
8. Fixed-Boundary Primitive
9. Canonical Start Resolver
10. Canonical Window Resolver
11. Instant Owner Resolver
12. Bounded Search
13. Preference Resolution
14. User-Day Labeling
15. Monotonicity
16. Duration Semantics
17. Equal Boundary
18. Boundary Increase
19. Boundary Decrease
20. Repeated Changes
21. Cycle Wrap
22. Segment Transition
23. Default/Override Transition
24. DST
25. User Week
26. Week-Start Transition
27. Recurrence
28. Work Ownership
29. Overnight Work
30. Adjacent Shift Handoff
31. Candidate Placement
32. Opening Discovery
33. Longer-Day Placement
34. Shorter-Day Placement
35. Sleep Placement
36. Preferred Windows
37. Friction
38. Suggested Fixes
39. Manual All-Day Semantics
40. Longer All-Day Event
41. Shorter All-Day Event
42. Timed 24-Hour Event Preservation
43. Preview Range
44. Preview Clipping
45. Cross-Boundary Preview
46. DayVisualizer
47. Visualization Scale
48. Hour Labels
49. DST Visualization
50. HistoricalPlan Boundary
51. Existing History Preservation
52. New Publication Geometry
53. Restore Determinism
54. Profile Boundary
55. Full Clear
56. Persistence Boundary
57. Query/Helper Purity
58. Performance
59. Stable-Regime Compatibility
60. Transition-Regime Behavioral Changes
61. Tests Added/Changed
62. Property Invariants
63. Focused Validation
64. Full Validation
65. Bundle Validation
66. Manual Product Walkthrough
67. Governance Updates
68. ADR Determination
69. Deviations
70. Discoveries
71. Deferred Work
72. Temporal API Matrix
73. Boundary Matrix
74. Consumer Matrix
75. Transition Example Matrix
76. All-Day Matrix
77. Placement Matrix
78. Visualization Matrix
79. Persistence Matrix
80. Product-Boundary Matrix
81. Epistemic Matrix
82. Architectural Invariant Assessment
83. Stop-Condition Assessment
84. Architectural Alignment Assessment
85. Task 6.3C Readiness
86. Task 6.3 Resume Status
87. Recommended Next Task
88. Final Completion Determination

---

# 111. Task 6.3C Readiness

At completion explicitly determine whether:

> **Task 6.3C — HistoricalPlan V2 Timing Provenance and V1 Compatibility**

may proceed exactly as architected.

If 6.3B discovers additional HistoricalPlan provenance needed for variable user-day interpretation, report it before 6.3C begins.

Do not absorb it silently.

---

# 112. Task 6.3 Resume Status

Even if Task 6.3B passes:

```text
Task 6.3
Canonical Today read model
```

remains blocked until Task 6.3C also passes.

Do not resume 6.3 inside this task.

---

# 113. Recommended Next Task

If canonical temporal remediation is green and no new historical blocker is discovered:

> **Task 6.3C — HistoricalPlan V2 Timing Provenance and V1 Compatibility.**

---

# 114. Completion Criteria

Task 6.3B is complete only when:

* the accepted label-first piecewise temporal model is implemented;
* each user-day start is derived from that label's effective schedule preferences;
* each user-day end comes from the next label's canonical start;
* every valid instant belongs to exactly one user-day;
* boundary increases create no gap;
* boundary decreases create no overlap;
* exact boundary ownership is deterministic;
* starts are strictly increasing;
* variable-duration user-days are supported;
* fixed-boundary stable-regime behavior remains compatible;
* the old fixed-boundary helper remains a bounded primitive;
* no fixed-point resolver exists;
* manual segment boundaries resolve per label;
* cycle wrap is covered;
* default/override transitions are covered;
* supported DST behavior preserves unique ownership;
* user-week identity uses canonical labels rather than elapsed-day assumptions;
* recurrence expansion does not lose/duplicate labels on transition days;
* work blocks receive correct user-day ownership;
* overnight work remains correct;
* adjacent old/new shifts may meet exactly without temporal ownership ambiguity;
* placement uses canonical next start;
* openings discovery uses canonical next start;
* longer days can expose valid later temporal openings;
* shorter days cannot place work after their true end;
* raw openings are not interpreted as Capacity;
* Sleep placement respects canonical windows without new Sleep policy;
* preferred-window semantics remain unchanged;
* friction uses canonical bounds;
* suggested fixes use canonical bounds;
* manual all-day events span the exact canonical user-day window;
* a longer transition-day all-day event spans the longer window;
* a shorter transition-day all-day event spans the shorter window;
* timed 24-hour events remain timed;
* Preview clipping and overlap use canonical user-day windows;
* Preview stable-day behavior remains compatible;
* DayVisualizer no longer assumes every day is 1,440 minutes;
* visualization can truthfully represent shorter/longer days;
* repeated/skipped DST local hours do not corrupt exact instant geometry;
* existing HistoricalPlan records remain immutable;
* no HistoricalPlan V2 timing provenance is introduced;
* no Today query/UI/reporting is introduced;
* no transition strategy/recommendation behavior is introduced;
* no new authority/persistence/schema/Backup envelope is introduced;
* restore deterministically reproduces canonical windows;
* focused transition fixtures and broad regressions pass;
* full repository validation is green;
* bundle budgets remain green;
* governance records that canonical temporal ownership is implemented;
* Task 6.3C remains the next prerequisite;
* Task 6.3 itself remains blocked pending 6.3C.

---

# 115. Final Implementation Principle

> **The end of a DayFrame day is not “24 hours after it started.” It is the moment the next canonical user-day begins.**

Every engine, placement, event, Preview, and visualization consumer must derive its temporal bounds from that fact.

---

# 116. Final Completion Statement

**Task 6.3B is complete when DayFrame's accepted piecewise user-day architecture is implemented as one canonical temporal foundation in which each local date label supplies its own effective boundary and canonical start, each user-day is the half-open interval from that start to the next label's start, and every instant is therefore owned exactly once even when adjacent schedule regimes change boundaries; when boundary increases produce truthful longer transition days and decreases produce truthful shorter transition days without gaps, overlaps, fixed-point iteration, or behavioral inference; when the existing fixed-boundary helper remains only a primitive while work generation, user-week resolution, recurrence, candidate placement, opening discovery, Sleep placement, friction, suggested fixes, manual user-day-wide events, Preview clipping, and DayVisualizer consume canonical consecutive starts instead of fixed 24-hour/1,440-minute/same-boundary-next-day assumptions; when manual segment transitions, cycle wrap, default/override changes, overnight work, adjacent shift handoffs, DST, and representative longer/shorter transition days are mechanically covered; when all-day events span the actual canonical user-day while timed 24-hour events remain semantically distinct; when existing HistoricalPlan records remain frozen and no Task 6.3C timing-provenance semantics are leaked forward; when no Today query/UI, execution overlay, transition strategy, sleep adaptation, Goal reorientation, Capacity, Recommendation, new authority, migration, persistence key, or Backup envelope change is introduced; when restore determinism, compatibility, property invariants, focused tests, canonical validation, Preview/visualizer manual checks where available, and Task 5.19 bundle budgets are green; and when Task 6.3C is ready to preserve all-day/timed intent in HistoricalPlan before the blocked Task 6.3 Today read model resumes.**
