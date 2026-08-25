# Task 6.3A — User-Day Boundary Transition and All-Day Publication Semantics Architecture Audit

## Status

Ready for audit.

## Phase

Phase 6 — Platform Maturity

## Task Type

Read-only architecture, temporal-model, authored-schedule, transition-semantics, HistoricalPlan provenance, compatibility/versioning, and future transition-planning-readiness audit.

**No production behavior changes are authorized.**

---

# 1. Context

Task 6.3 attempted to implement the canonical Today current-user-day/current-plan read model and correctly stopped on two mandatory architecture blockers.

### Blocker A — variable user-day boundary transitions

Current architecture can answer:

> Given an already-selected user-day boundary, which user-day contains this instant?

But it cannot always answer:

> Given an instant whose neighboring effective schedule segments use different user-day boundaries, which user-day owns it?

Example:

```text
Day A boundary: 03:00
Day B boundary: 06:00

Instant: 04:00
```

Candidate windows produce a gap.

The reverse transition:

```text
Day A boundary: 06:00
Day B boundary: 03:00

Instant: 04:00
```

produces overlap.

Task 6.3 also found that naïve fixed-point iteration may oscillate.

### Blocker B — all-day HistoricalPlan provenance loss

Preview scheduled blocks may carry:

```text
isAllDay = true
```

but HistoricalPlan V1 preserves only the resulting interval.

Therefore these may become observationally indistinguishable after publication:

```text
all-day event
00:00 → 00:00 next day

ordinary timed event
00:00 → 00:00 next day
```

Today cannot reconstruct authored all-day intent truthfully from HistoricalPlan alone.

---

# 2. Why This Audit Matters Beyond Today

The user-day transition issue is not merely a Today rendering problem.

DayFrame is intended eventually to support transitions between substantially different operating schedules.

Representative real-world case:

```text
Midnight shift
    ends 06:15

transition weekend

Day shift
    begins 06:15
```

A mature DayFrame may eventually need to help construct a transition plan involving:

* altered sleep periods;
* temporary recovery blocks;
* changed usable capacity;
* lower or shifted Goal allocations;
* reduced discretionary commitments;
* transition-specific scheduling preferences;
* staged movement of wake/sleep time;
* different planning treatment of the transition days.

Task 6.3A does **not** implement any of those features.

However, it must ensure that the chosen foundational user-day model does not make such future reasoning impossible or internally contradictory.

---

# 3. Primary Objective

Resolve the architecture questions required before Task 6.3 can resume.

The audit must determine:

1. the canonical ownership rule for every instant when adjacent effective user-day boundaries differ;
2. how user-day transitions relate to shift-cycle/segment transitions;
3. whether the current authored preference model contains enough information to resolve transitions deterministically;
4. whether additional authored transition semantics are eventually needed;
5. whether those additional semantics are required **now** or may be deferred;
6. how a future schedule-transition planner could reason over these boundaries without replacing today's foundational model;
7. the correct durable HistoricalPlan representation for all-day intent;
8. compatibility/versioning consequences;
9. the smallest implementation remediation required before resuming Task 6.3.

---

# 4. Governing Temporal Principle

> **Every instant must belong to exactly one canonical user-day.**

The architecture must never knowingly permit:

* unowned instants;
* multiply owned instants;
* iterative ambiguity;
* dependence on arbitrary resolver order.

This invariant applies even when adjacent schedule segments use different day boundaries.

---

# 5. Governing User-Day Principle

A user-day is a DayFrame temporal partition.

It is not necessarily:

* a calendar date;
* a shift;
* a sleep period;
* a work period;
* midnight-to-midnight;
* always 24 hours long.

The audit must determine which of these properties are actually required.

---

# 6. Governing Transition Principle

A transition between two stable schedule regimes may legitimately produce a user-day that is:

* shorter than 24 hours;
* longer than 24 hours;
* otherwise irregular;

if that is the cleanest deterministic representation.

Do not assume every user-day must be exactly 24 hours.

But do not adopt variable-duration user-days without tracing every downstream consequence.

---

# 7. Governing Future-Planning Principle

> The low-level user-day partition should define temporal ownership. A future transition-planning engine may reason about how to live through that transition, but it should not need to redefine which instant belongs to which user-day.

Audit this separation explicitly.

Potential future structure:

```text
Temporal partition
    exact user-day ownership

Transition context
    identifies regime change

Future transition planner
    reasons about sleep/capacity/Goal allocation
```

Determine whether this is architecturally sound.

---

# 8. Governing Epistemic Principle

Do not encode behavioral interpretation into boundary resolution.

A boundary transition may tell DayFrame:

> the user's schedule regime changed here

It must not automatically mean:

* user slept;
* user is rested;
* user should sleep now;
* Goal capacity decreased by X%;
* specific commitments should be dropped.

Those belong to future derived/recommendation policy.

---

# 9. Explicit Scope

Audit:

* current user-day implementation;
* `getUserDay`;
* effective preference resolution;
* shift-cycle/segment selection;
* segment date semantics;
* segment transition semantics;
* schedule preference overrides;
* week-start interaction;
* overnight work generation;
* sleep placement;
* cycle transitions;
* planning-range expansion;
* Preview user-day rendering;
* HistoricalPlan publication;
* HistoricalPlan validation;
* HistoricalPlan fingerprinting;
* HistoricalPlan clone/serialization;
* Backup V6 compatibility;
* restore;
* all-day manual events;
* timed 24-hour events;
* publication republication;
* future transition-planning compatibility;
* required ADR decisions;
* remediation task slicing.

---

# 10. Explicit Non-Goals

Do not implement:

* new user-day resolver;
* new schedule engine behavior;
* Today read model;
* Today UI;
* transition sleep recommendation;
* sleep-phase algorithm;
* capacity projection;
* Goal reorientation;
* Goal reprioritization;
* transition recommendations;
* automatic commitment dropping;
* shift-transition UI;
* new Recommendation authority;
* new Goal policy;
* new Measurement policy;
* scheduler adaptation;
* HistoricalPlan schema changes;
* Backup V7;
* migrations;
* component changes.

This task decides architecture only.

---

# 11. Execution Artifact Rules

Before auditing:

1. verify this complete artifact;
2. save immutable project copy;
3. compare supplied/saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 6.1 result;
   * Task 6.2 result;
   * blocked Task 6.3 result;
   * architecture specification;
   * scheduling preference model;
   * shift-cycle model;
   * user-day helpers;
   * work generation;
   * sleep generation;
   * candidate placement;
   * Preview rendering;
   * HistoricalPlan domain/publication;
   * Backup V6;
   * relevant deterministic tests;
6. do not modify the immutable Task 6.3A artifact.

Create:

`docs/implementation/phase-6/TASK_6.3A_USER_DAY_BOUNDARY_TRANSITION_AND_ALL_DAY_PUBLICATION_SEMANTICS_ARCHITECTURE_AUDIT_RESULT.md`

---

# 12. Evidence Rules

Every finding must be marked:

* **Confirmed**
* **Covered by test**
* **Inferred**
* **Not found**
* **Decision required**
* **Future-compatible recommendation**
* **Blocked**

Production code and deterministic tests govern current behavior.

Do not infer semantics merely from type names or comments.

---

# 13. Current User-Day Model Audit

Document exactly how current user-day mapping works.

At minimum answer:

* what input `getUserDay` receives;
* whether it receives a boundary or resolves one;
* whether output day length is implicitly 24 hours;
* how user-day start/end are calculated;
* which parts of the application assume fixed-duration days;
* which tests prove current behavior.

---

# 14. Current Effective Preference Audit

Trace:

```text
instant/date
    ↓
active shift segment
    ↓
effective preferences
    ↓
day boundary
```

Document whether selection begins from:

* local calendar date;
* user-day date;
* cycle-relative day;
* shift date;
* another concept.

This relationship caused the Task 6.3 circularity and must be explicit.

---

# 15. Shift Segment Identity Audit

Determine what a shift segment actually owns.

Questions:

* Is a segment defined over calendar dates?
* user-day dates?
* work occurrence dates?
* cycle offsets?
* inclusive dates?
* transition instants?

If the segment itself has a deterministic date/instant range independent of user-day boundaries, that may be central to resolving the blocker.

---

# 16. Segment Transition Instant Audit

Determine whether current authored state already implies an exact transition instant between two adjacent segments.

Examples:

```text
segment A ends after calendar date D
segment B starts calendar date D+1
```

Does that imply transition at:

```text
calendar midnight?
old boundary?
new boundary?
first work occurrence?
another instant?
```

Do not invent the answer.

---

# 17. Work-Shift Transition Audit

Trace how work generation behaves when adjacent segments have radically different shifts.

Representative case:

```text
Midnight shift
18:15 → 06:15

Day shift
06:15 → 18:15
```

or actual project-equivalent semantics.

Determine:

* last work occurrence under old segment;
* first work occurrence under new segment;
* interval between them;
* whether generation can create overlap;
* whether a transition weekend is structurally represented;
* whether a segment change itself is visible to the scheduler.

---

# 18. Existing Transition-Weekend Representation

Determine whether the current model can explicitly encode:

```text
old segment
transition/off days
new segment
```

using existing cycle/segment structures.

If yes, document how.

If not, determine whether this matters for boundary ownership now or only for future transition planning.

---

# 19. Boundary Transition Cases

Analyze at minimum:

### Equal boundaries

```text
03:00 → 03:00
```

### Later incoming boundary

```text
03:00 → 06:00
```

### Earlier incoming boundary

```text
06:00 → 03:00
```

### Extreme movement

```text
12:00 → 00:00
00:00 → 12:00
```

### Repeated adjacent changes

```text
03:00 → 06:00 → 03:00
```

### Cycle wraparound

last segment → first segment

For each determine candidate ownership behavior.

---

# 20. Policy Alternative A — Previous Boundary Owns Transition

Audit a rule conceptually like:

> The current user-day continues using the outgoing regime's boundary until that user-day closes; the incoming regime begins immediately afterward.

This may produce variable-duration first incoming days.

Evaluate:

* uniqueness;
* gaps;
* overlaps;
* cycle consistency;
* intuitive meaning;
* implementation complexity;
* compatibility with work generation;
* transition planning.

---

# 21. Policy Alternative B — Incoming Boundary Owns Transition

Audit:

> The incoming regime's boundary determines the opening of the first user-day under that regime; the outgoing day ends when that incoming day begins.

Evaluate same dimensions.

---

# 22. Policy Alternative C — Segment Transition Instant Owns Partition

Audit whether user-day ownership can be based on an independently canonical segment transition instant.

Conceptually:

```text
old user-day
    ends at transition instant

new user-day
    begins at transition instant
```

Subsequent days then use the incoming boundary.

Questions:

* does authored state provide that instant?
* could it be derived from calendar segment start?
* would the transition day be irregular?
* does this preserve uniqueness cleanly?

---

# 23. Policy Alternative D — Boundary Schedule as Piecewise Temporal Function

Audit a model where effective day boundaries form a piecewise temporal schedule.

Instead of resolving:

```text
date → boundary
```

define explicit user-day start instants:

```text
...,
Aug 20 03:00,
Aug 21 03:00,
Aug 22 06:00,
Aug 23 06:00,
...
```

User-days become intervals between consecutive starts.

This naturally yields:

```text
03:00 → 06:00 transition
    27-hour day

06:00 → 03:00 transition
    21-hour day
```

Audit carefully.

This is a particularly important candidate.

---

# 24. Piecewise-Start Model Questions

If considering explicit consecutive user-day starts, answer:

* how is each start generated?
* which date supplies each boundary?
* does calendar date label the start?
* can starts ever become non-monotonic?
* what constraints guarantee strict increasing order?
* how cycle overrides apply;
* how far surrounding dates must be inspected;
* whether this removes circularity;
* whether existing `getUserDay` can remain as a fixed-boundary primitive.

---

# 25. Monotonicity Invariant

Any accepted transition policy should make canonical user-day starts strictly increasing.

Formally:

```text
start(D+1) > start(D)
```

Audit whether existing allowed boundary values guarantee this if start is:

```text
calendarDate(D) + boundary(D)
```

Since boundaries lie within one day, adjacent starts may naturally be between ~0 and 48 hours apart.

Determine exact constraints.

---

# 26. User-Day Duration

Under a piecewise model:

```text
duration(D)
    = start(D+1) - start(D)
```

Audit downstream assumptions about:

```text
duration == 24 hours
```

Search production code/tests.

Classify every fixed-24-hour assumption as:

* safe;
* display-only;
* engine-sensitive;
* blocker.

---

# 27. DST Interaction

Variable-duration user-days may already exist naturally under daylight-saving transitions.

Audit whether current architecture implicitly tolerates 23/25-hour local days.

This may provide useful evidence for whether variable-duration DayFrame user-days are conceptually acceptable.

Do not introduce new timezone infrastructure.

---

# 28. Week-Start Interaction

Determine whether variable day durations affect user-week assignment.

User-week identity should likely operate on user-day labels rather than elapsed durations.

Verify.

---

# 29. Times-Per-User-Week Recurrence

Audit whether recurrence expansion assumes seven 24-hour days or seven canonical user-day labels.

This is critical if boundary transitions create short/long days.

---

# 30. Schedule Candidate Placement

Audit whether placement opens/closes days using:

* fixed `+24h`;
* next canonical day boundary;
* calendar date arithmetic.

Identify consequences of irregular transition days.

---

# 31. Day Visualizer Audit

Determine whether timeline rendering can represent:

* 21-hour user-day;
* 27-hour user-day;
* other irregular duration.

Do not implement support.

Classify gap.

---

# 32. Preview Clipping Audit

Determine whether Preview currently clips against:

```text
user-day start + 24h
```

or an independently resolved next boundary.

This may reveal additional remediation needed if variable-duration days become canonical.

---

# 33. Manual Event Date Semantics

Audit manual event authoring:

* timed start/end;
* all-day marker;
* selected calendar date;
* user-day ownership;
* cross-boundary behavior.

Determine whether all-day means:

### calendar all-day

or:

### user-day all-day

This distinction must be explicit.

---

# 34. All-Day Semantic Definition

Determine current actual meaning of:

```text
isAllDay
```

Possible:

* calendar-date all day;
* no explicit time;
* user-day-wide commitment;
* UI presentation flag.

Do not assume.

This governs what HistoricalPlan must preserve.

---

# 35. 24-Hour Timed Event Distinction

Prove whether a timed event may legally have exactly 24-hour duration.

If yes, all-day marker is semantically necessary.

If no, audit whether interval alone could distinguish.

Do not choose schema until verified.

---

# 36. All-Day Historical Requirement

Determine what future readers need to know.

Potential minimum:

```text
isAllDay: boolean
```

But audit whether future semantics require:

* authored calendar date;
* authored all-day type;
* original local-day semantics;
* display mode.

Prefer smallest truthful frozen provenance.

---

# 37. HistoricalPlan Representation Alternatives

Compare at least:

### A. optional `isAllDay?: boolean`

Legacy absence = unknown.

### B. required `isAllDay: boolean` in new occurrence version

Legacy V1 remains unknown.

### C. tagged timing union

```text
timing:
    { kind: "timed", startsAt, endsAt }
    |
    { kind: "allDay", ... }
```

### D. new occurrence snapshot V2

### E. another minimal representation discovered during audit.

---

# 38. Legacy Compatibility Requirement

Historical records created before remediation must not be guessed.

If legacy HistoricalPlan lacks all-day provenance, future Today may need:

```text
allDaySemantics = unavailableLegacy
```

or treat them as timed intervals only if that is provably truthful.

Audit this carefully.

---

# 39. HistoricalPlan Versioning Audit

Determine which version layers exist:

* surface version;
* batch version;
* day version;
* occurrence snapshot version;
* frozen Goal provenance version.

Determine the smallest correct version change.

Do not bump everything mechanically.

---

# 40. Strict-Key Validation

Audit how adding an optional/required field interacts with strict key validation.

---

# 41. Fingerprint Semantics

HistoricalPlan semantic fingerprints must distinguish:

```text
all-day event
```

from:

```text
timed event with same interval
```

after remediation.

Audit required change.

---

# 42. Clone/Serialization Semantics

Ensure proposed representation survives:

* structured clone;
* JSON;
* IndexedDB;
* Backup;
* restore.

---

# 43. Backup V6 Compatibility

Determine whether adding all-day provenance requires:

* no Backup version change because HistoricalPlan is generically transported;
* Backup V7;
* migration;
* validation update only.

Do not assume.

---

# 44. Restore Compatibility

Legacy restored HistoricalPlan must remain accepted if current compatibility policy permits it.

No current Goal/manual-event authority may be consulted to backfill history.

---

# 45. No Historical Backfill

This is mandatory:

> Current authored state must never be used to infer whether a legacy frozen occurrence was all-day.

A recreated event may differ.

History stays incomplete where incomplete.

---

# 46. Republication Remediation

After all-day provenance support is added:

* old publication remains legacy/unknown;
* newly republished same day freezes explicit all-day semantics;
* cutoff determines which publication Today sees.

This should mirror Task 5.6's epistemic pattern if applicable.

Audit whether that analogy is structurally sound.

---

# 47. Transition Context vs User-Day Ownership

Mandatory distinction:

### User-day ownership

Which canonical day owns this instant?

### Transition context

Is this day near or within a schedule-regime transition?

Future recommendation logic may need the second without redefining the first.

Audit whether current cycle/segment data can derive transition context.

---

# 48. Transition Context Derivation

Determine whether a pure future query could identify:

```text
previous segment
current segment
next segment

boundary delta
work-time delta
days until transition
days since transition
```

from existing authored state.

No new authority should be needed if this is derivable.

---

# 49. Shift Change Magnitude

Audit whether transition context can calculate structural changes such as:

```text
old work start/end
new work start/end
old day boundary
new day boundary
old week start
new week start
```

This is not yet a recommendation.

It is transition provenance.

---

# 50. Sleep Transition Readiness

Audit current Sleep modeling against future transitional-sleep planning.

Questions:

* Is Sleep a regular schedulable template?
* Is it bound to user-day semantics?
* Can multiple temporary Sleep periods be authored?
* Can Sleep differ by segment?
* Does scheduler permit a temporary transition-specific sleep window?
* Could future derived logic propose Sleep changes without new authority?

Do not implement or recommend specific sleep schedules.

---

# 51. Goal Reorientation Readiness

Audit whether existing Goal/commitment links and planning authorities could eventually support a transition planner saying conceptually:

> Reduce or defer some Goal-supporting commitments during transition.

Determine whether this would require:

* recommendation only;
* temporary PlanDecision;
* commitment mutation;
* new allocation authority;
* unknown future architecture.

Do not design the recommendation policy.

---

# 52. Capacity Readiness

Audit whether boundary transitions expose a future need for transition-aware Capacity.

Do not implement Capacity.

Classify whether existing schedule openings can provide deterministic raw capacity evidence.

---

# 53. Transitional Plan Horizon

Audit whether a future transition planner could operate over:

```text
N days before transition
+
transition days
+
N days after transition
```

using current arbitrary planning-range support.

This is relevant to avoiding a calendar-month-specific transition engine.

---

# 54. Stable Regime vs Transition Regime

Evaluate whether future architecture should distinguish:

```text
stable schedule regime

transition between regimes
```

as a derived concept rather than durable authority.

Strong preference: derived unless authored state is insufficient.

Audit.

---

# 55. Explicit Transition Authoring

Determine whether current authored cycles always provide enough information to identify the intended transition.

Possible issue:

A user may change a schedule definition without expressing:

* desired adaptation duration;
* preferred sleep transition pace;
* protected transition days.

Those may eventually require authored preferences.

Classify them as **future authored transition policy**, not present blocker, unless current boundary ownership depends on them.

---

# 56. Boundary Ownership Must Not Depend on Sleep Recommendation

Mandatory:

The canonical user-day resolver cannot require future adaptive sleep preferences.

Today must remain resolvable even when the user has configured no transition-planning preferences.

---

# 57. Boundary Ownership Must Not Depend on Goals

Likewise Goal priorities cannot determine which user-day owns an instant.

---

# 58. Boundary Ownership Must Not Depend on Execution Evidence

Execution reports cannot redefine temporal partition.

---

# 59. Recommended Layering

Audit whether the clean future architecture is:

```text
Layer 1
Canonical temporal partition
    user-day starts/windows

Layer 2
Schedule-regime transition context
    old/new segment differences

Layer 3
Planning projections
    capacity/openings/friction

Layer 4
Future transition recommendation policy
    sleep suggestions
    Goal allocation changes
    schedule adaptation proposals
```

Determine whether current architecture supports this layering.

---

# 60. Candidate Canonical User-Day Algorithm

The audit must produce a precise candidate algorithm, not merely prose.

For example, if piecewise start instants are recommended:

```text
for each local authored day label D:
    boundary = resolveEffectiveBoundaryForLabel(D)
    start(D) = apply boundary to calendar date D

userDay(D) = [start(D), start(D+1))

for instant T:
    find unique D such that
        start(D) <= T < start(D+1)
```

This is an example only.

Audit must determine exact canonical inputs and segment-selection semantics.

---

# 61. Candidate Algorithm Proof Obligations

For the recommended model prove or mechanically argue:

* coverage — every instant belongs somewhere;
* uniqueness — no instant belongs twice;
* monotonic starts;
* deterministic segment selection;
* cycle wrap;
* boundary equality;
* boundary increase;
* boundary decrease;
* overnight schedules;
* restoration determinism.

---

# 62. Naming of User-Day Labels

If canonical day windows become variable duration, determine what date labels them.

Candidate:

> The local calendar date on which the user-day begins according to that date's effective boundary.

Audit consistency with existing `getUserDayDate` semantics.

---

# 63. Transition Day Label Example

Required worked example:

```text
Boundary schedule

Fri 03:00
Sat 03:00
Sun 06:00
Mon 06:00
```

Show exact user-day windows and which owns:

* Sat 02:00
* Sat 04:00
* Sun 04:00
* Sun 07:00.

---

# 64. Reverse Transition Example

Required:

```text
Fri 06:00
Sat 06:00
Sun 03:00
Mon 03:00
```

Show exact windows and ownership.

---

# 65. Real Shift-Transition Example

Include a representative transition similar to:

```text
Midnight regime
    work ends 06:15

transition period

Day regime
    work begins 06:15
```

Use repository-defined shift/cycle semantics rather than inventing a personal schedule.

Demonstrate:

* old regime user-day;
* transition user-day(s);
* new regime user-day;
* where future sleep-transition logic could attach;
* what remains outside this audit.

---

# 66. All-Day Worked Example

Show:

### Legacy

```text
startsAt 00:00
endsAt next-day 00:00
no isAllDay
```

Interpretation:

* unknown whether authored all-day.

### New

```text
isAllDay = true
```

Interpretation:

* known all-day.

### Timed 24h

```text
isAllDay = false
```

Interpretation:

* known timed.

If another representation is recommended, use that.

---

# 67. Required Transition-Policy Matrix

Produce:

| Policy                              | Unique ownership | Variable days | Requires new authored data | Future transition-planning fit | Recommendation |
| ----------------------------------- | ---------------: | ------------: | -------------------------: | -----------------------------: | -------------- |
| Previous-boundary ownership         |                  |               |                            |                                |                |
| Incoming-boundary ownership         |                  |               |                            |                                |                |
| Explicit segment transition instant |                  |               |                            |                                |                |
| Piecewise user-day starts           |                  |               |                            |                                |                |
| other                               |                  |               |                            |                                |                |

---

# 68. Required User-Day Invariant Matrix

Produce:

| Invariant                  | Current | Candidate model |
| -------------------------- | ------- | --------------- |
| every instant owned        |         |                 |
| one owner only             |         |                 |
| deterministic              |         |                 |
| supports variable boundary |         |                 |
| supports cycle wrap        |         |                 |
| overnight-safe             |         |                 |
| restoration-safe           |         |                 |
| Today-query-safe           |         |                 |

---

# 69. Required Downstream Impact Matrix

Produce:

| Subsystem            | Assumes 24h? | Transition impact | Remediation required? |
| -------------------- | -----------: | ----------------- | --------------------: |
| recurrence expansion |              |                   |                       |
| work generation      |              |                   |                       |
| sleep generation     |              |                   |                       |
| candidate placement  |              |                   |                       |
| Preview range        |              |                   |                       |
| Preview clipping     |              |                   |                       |
| DayVisualizer        |              |                   |                       |
| HistoricalPlan       |              |                   |                       |
| Summary              |              |                   |                       |
| Today                |              |                   |                       |

---

# 70. Required Transition-Readiness Matrix

Produce:

| Future capability                | Existing evidence sufficient? | New authored policy eventually needed? | New authority likely? |
| -------------------------------- | ----------------------------: | -------------------------------------: | --------------------: |
| identify shift transition        |                               |                                        |                       |
| quantify boundary shift          |                               |                                        |                       |
| compare work windows             |                               |                                        |                       |
| propose temporary sleep schedule |                               |                                        |                       |
| reduce transitional load         |                               |                                        |                       |
| reprioritize Goal commitments    |                               |                                        |                       |
| restore stable schedule          |                               |                                        |                       |

Do not implement any capability.

---

# 71. Required All-Day Representation Matrix

Produce:

| Representation                 | Legacy compatibility | Strictness | Fingerprint-safe | Version impact | Recommendation |
| ------------------------------ | -------------------- | ---------- | ---------------- | -------------- | -------------- |
| optional boolean               |                      |            |                  |                |                |
| required boolean + new version |                      |            |                  |                |                |
| timing tagged union            |                      |            |                  |                |                |
| snapshot V2                    |                      |            |                  |                |                |
| other                          |                      |            |                  |                |                |

---

# 72. Required Legacy Matrix

Produce:

| Record                                       | Interpretation after remediation |
| -------------------------------------------- | -------------------------------- |
| legacy occurrence with no all-day provenance |                                  |
| new explicit all-day occurrence              |                                  |
| new explicit timed occurrence                |                                  |
| legacy day republished under new semantics   |                                  |

---

# 73. Required Historical Boundary Matrix

Produce:

| Concern                  | Change required? |
| ------------------------ | ---------------: |
| HistoricalPlan validator |                  |
| fingerprint              |                  |
| clone                    |                  |
| JSON                     |                  |
| IndexedDB                |                  |
| Backup V6                |                  |
| restore                  |                  |
| full clear               |                  |
| republication            |                  |

---

# 74. Required Future-Layer Matrix

Produce:

| Layer                             | Responsibility | Durable? |
| --------------------------------- | -------------- | -------: |
| user-day partition                |                |          |
| transition context                |                |          |
| capacity evidence                 |                |          |
| transition recommendation         |                |          |
| Goal reorientation recommendation |                |          |

---

# 75. Required Epistemic Matrix

Produce:

| Evidence                      | DayFrame may say | Must not say |
| ----------------------------- | ---------------- | ------------ |
| boundary changes by 3h        |                  |              |
| work regime changes           |                  |              |
| transition day is 27h         |                  |              |
| available schedule opening    |                  |              |
| no sleep record               |                  |              |
| Sleep commitment exists       |                  |              |
| Goal-linked commitment exists |                  |              |
| legacy event has 24h interval |                  |              |
| explicit isAllDay true        |                  |              |

---

# 76. Required Architecture Decision Set

The audit must end with explicit recommendations for:

### Decision 1

Canonical user-day ownership across boundary changes.

### Decision 2

Whether user-day duration may vary.

### Decision 3

How effective boundary is mapped to a user-day label.

### Decision 4

Whether segment transition context is derived or authored.

### Decision 5

HistoricalPlan all-day representation.

### Decision 6

Legacy all-day interpretation.

### Decision 7

Versioning/Backup consequences.

### Decision 8

Whether Task 6.3 can resume immediately after one remediation task or needs multiple tasks.

---

# 77. Implementation Slicing Audit

Evaluate at least:

### Option A

One remediation task:

```text
6.3B
Boundary resolver + HistoricalPlan all-day provenance
```

### Option B

Two remediation tasks:

```text
6.3B
Canonical variable-boundary user-day semantics

6.3C
HistoricalPlan all-day provenance remediation
```

then resume 6.3.

Strong preference:

> separate them if they touch materially different architectural layers.

But evidence governs.

---

# 78. ADR Requirements

This audit is likely to produce enduring decisions.

Evaluate whether to create:

### ADR A

**Canonical User-Day Boundary Transition Semantics**

and possibly:

### ADR B

**HistoricalPlan All-Day Occurrence Provenance**

Prefer separate ADRs if the decisions are independently durable.

Do not create them until the audit has chosen semantics.

---

# 79. Stop Conditions

Stop and report if:

* no candidate boundary policy guarantees unique ownership;
* existing authored segment semantics are insufficient to generate monotonic user-day starts;
* solving ownership requires introducing behavioral assumptions;
* variable user-day duration breaks core scheduler invariants in ways requiring a larger engine redesign;
* all-day intent cannot be preserved without incompatible HistoricalPlan migration;
* Backup compatibility cannot preserve legacy data truthfully;
* current manual-event semantics do not define what all-day actually means;
* transition planning would require boundary semantics that conflict with Today requirements.

Do not choose a convenient rule over a truthful one.

---

# 80. No-Code Rule

No production code changes.

Permitted:

* audit result;
* checkpoint;
* Roadmap;
* Current State;
* Changelog;
* ADR draft only if repository convention permits audit-created accepted decisions.

No production tests should be changed to encode future semantics.

---

# 81. Validation

Run baseline validation sufficient to prove no production behavior changed:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Run formatting if documentation changed.

Record exact counts.

---

# 82. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.3A_USER_DAY_BOUNDARY_TRANSITION_AND_ALL_DAY_PUBLICATION_SEMANTICS_ARCHITECTURE_AUDIT_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.3 Blocker Confirmation
4. Audit Method
5. Files Reviewed
6. Current User-Day Model
7. Current Effective Preference Model
8. Current Segment Semantics
9. Segment Transition Semantics
10. Work-Shift Transition Behavior
11. Current Transition Representation
12. Boundary Increase Case
13. Boundary Decrease Case
14. Cycle-Wrap Case
15. Fixed-Point Failure Assessment
16. Previous-Boundary Policy
17. Incoming-Boundary Policy
18. Segment-Transition-Instant Policy
19. Piecewise-Start Policy
20. Other Candidate Policies
21. Recommended User-Day Policy
22. Coverage Proof
23. Uniqueness Proof
24. Monotonicity
25. User-Day Duration
26. User-Day Labeling
27. DST Interaction
28. Week-Start Interaction
29. Recurrence Impact
30. Work Generation Impact
31. Sleep Generation Impact
32. Placement Impact
33. Preview Impact
34. DayVisualizer Impact
35. HistoricalPlan Impact
36. Today Impact
37. Real Transition Worked Example
38. Transition Context Derivation
39. Shift-Change Magnitude Evidence
40. Sleep-Transition Readiness
41. Goal-Reorientation Readiness
42. Capacity Readiness
43. Transition Horizon Readiness
44. Stable-vs-Transition Regime Model
45. Future Authored Transition Policy
46. Recommended Layering
47. Current All-Day Semantics
48. Manual Event All-Day Meaning
49. 24-Hour Timed Event Distinction
50. Historical All-Day Requirement
51. Representation Alternatives
52. Recommended All-Day Representation
53. Legacy Interpretation
54. HistoricalPlan Version Decision
55. Strict Validation
56. Fingerprint
57. Clone/Serialization
58. IndexedDB
59. Backup V6
60. Restore
61. No-Backfill Boundary
62. Republication
63. All-Day Worked Example
64. Implementation Slicing
65. ADR Recommendations
66. Validation
67. Governance Updates
68. Deviations
69. Discoveries
70. Deferred Work
71. Transition-Policy Matrix
72. User-Day Invariant Matrix
73. Downstream Impact Matrix
74. Transition-Readiness Matrix
75. All-Day Representation Matrix
76. Legacy Matrix
77. Historical Boundary Matrix
78. Future-Layer Matrix
79. Epistemic Matrix
80. Architecture Decision Set
81. Stop-Condition Assessment
82. Architectural Alignment Assessment
83. Recommended Remediation Task(s)
84. Task 6.3 Resume Criteria
85. Final Audit Determination

---

# 83. Task 6.3 Resume Criteria

The blocked Task 6.3 may resume only after:

* every instant has unique user-day ownership under variable boundary changes;
* resolver semantics are deterministic;
* downstream fixed-24h assumptions are either compatible or remediated;
* HistoricalPlan can preserve explicit all-day/timed intent for new publications;
* legacy absence remains truthfully distinguishable;
* fingerprint/validation/clone/Backup/restore consequences are resolved;
* any required remediation tasks are implemented and green.

---

# 84. Desired Architectural Outcome

A particularly promising architecture to evaluate is:

```text
Canonical temporal layer

effective boundary by authored day label
        ↓
ordered user-day start instants
        ↓
interval between consecutive starts
        ↓
unique user-day ownership

Transition context layer

compare adjacent schedule regimes
        ↓
derive transition metadata

Future planning layer

use transition metadata
        +
capacity/openings
        +
Goals/commitments
        ↓
propose transitional schedule
```

This is a hypothesis, not a predetermined result.

---

# 85. Future Vision Boundary

The audit should explicitly comment on whether the recommended architecture can eventually support scenarios such as:

```text
Night shift
        ↓
transition weekend

DayFrame recognizes:
    large work-window change
    large user-day-boundary change
    temporary recovery constraint

Future engine may propose:
    transitional sleep timing
    reduced discretionary load
    shifted Goal-support commitments
    re-entry into stable day schedule
```

But it must not define:

* medical sleep advice;
* optimal circadian shift rates;
* Goal scoring;
* Recommendation policies.

The question is architectural readiness only.

---

# 86. Final Audit Principle

> **A transition day is not an error condition. It is a first-class temporal situation that the architecture must represent exactly before future intelligence can reason about how the user should move through it.**

---

# 87. Final Completion Statement

**Task 6.3A is complete when DayFrame's current user-day, schedule-preference, shift-cycle, segment-transition, recurrence, placement, visualization, HistoricalPlan, manual-event, all-day, Backup, and restore semantics have been traced sufficiently to choose a deterministic rule under which every instant belongs to exactly one canonical user-day even when adjacent schedule regimes use different boundaries; when the audit establishes whether variable-duration user-days are necessary and whether downstream scheduling code can safely support them; when the chosen user-day labeling and boundary-resolution model is demonstrated across boundary increases, decreases, cycle wraparound, overnight work, and a representative major shift-regime transition; when temporal ownership is cleanly separated from future transition-planning intelligence so later sleep-transition, capacity, Goal-allocation, and schedule-adaptation policies may reason about a transition without redefining user-day truth; when current all-day manual-event semantics are established and HistoricalPlan's loss of all-day provenance is resolved architecturally through a precise recommended representation with truthful legacy behavior; when validation, fingerprinting, cloning, IndexedDB, Backup V6/versioning, restore, republication, and no-backfill consequences are explicitly determined; when the audit recommends whether the two blockers should be remediated together or in separate bounded tasks; when any required ADRs are identified; when no production behavior, user-day rule, HistoricalPlan schema, Backup format, scheduler logic, Today query, transition recommendation, sleep recommendation, Capacity model, Goal reorientation policy, or adaptive behavior has been implemented prematurely; and when the exact prerequisites for resuming Task 6.3 are mechanically clear.**
