# Task 6.3A Result — User-Day Boundary Transition and All-Day Publication Semantics Architecture Audit

## 1. Executive Result

**Decision complete; implementation remains blocked on two separate remediation tasks.** DayFrame shall model canonical user-days as half-open intervals between consecutive, strictly ordered starts. For each local date label `D`, the effective preferences authored for `D` supply `start(D)`; the window is `[start(D), start(D+1))`. Boundary changes therefore create truthful short or long days, never gaps, overlaps, or fixed-point iteration.

HistoricalPlan shall preserve timing intent in a new occurrence snapshot V2 with a required tagged timing value. V1 absence remains `unavailableLegacy` and is never backfilled. The two decisions concern different architectural layers and should be implemented as Tasks 6.3B and 6.3C before Task 6.3 resumes.

## 2. Artifact Integrity

Confirmed: the supplied artifact SHA-256 is `c1b8b8e088400633959f9674ceb5f75aaa37abbbc0220d83a94bf77a4e131bad`. The immutable project copy has the same bytes (validated below).

## 3. Task 6.3 Blocker Confirmation

Confirmed. The current instant-first composition is circular when segment boundaries differ; HistoricalPlan V1 drops `DraftScheduledBlock.isAllDay` during materialization. Task 6.3 stopped correctly.

## 4. Audit Method

Static trace of authored cycle validation, effective preference selection, fixed-boundary time helpers, generation, recurrence, placement, Preview, visualizer, manual events, HistoricalPlan domain/validation/fingerprint/materialization, IndexedDB, Backup V6, restore, and Today/Summary prerequisites. Existing tests were treated as evidence, not as authorization for new semantics.

## 5. Files Reviewed

Confirmed: principal evidence includes `core/time/userDay.ts`, `core/time/userWeek.ts`, `core/cycles/{types,getActiveShiftSegment,resolveEffectiveSchedulePreferences,generateCycleWorkBlocks,shiftCycleUtils}.ts`, `core/shifts/generateWorkBlocks.ts`, `core/blocks/{generateBlockCandidates,placeBlockCandidates}.ts`, `core/engine/generateSchedulePreview.ts`, `core/calendar/types.ts`, `state/manualCalendarEvents.ts`, `ui/{PreviewScreen,DayVisualizer}.tsx`, `core/historicalPlan/*`, `state/{historicalPlanSurface,dayFrameBackupV3,dayFrameBackupV5,dayFrameBackupV6,dayFrameRestoreTranslation,dayFrameRestoreComposition}.ts`, and their focused tests.

## 6. Current User-Day Model

Confirmed: `getUserDay(date, boundary)` chooses the preceding occurrence of one fixed local boundary and advances the end by one calendar date. It is a sound fixed-boundary primitive but cannot select an effective boundary across regimes.

## 7. Current Effective Preference Model

Confirmed: an active manual segment is selected by the supplied local calendar date. `resolveEffectiveSchedulePreferencesForUserDayDate` deliberately supplies noon on the label. Defaults fill missing overrides.

## 8. Current Segment Semantics

Confirmed: manual segment dates are inclusive; cycles cannot overlap; repeating sequences derive entries from label/date arithmetic. Segment preferences may override boundary and week start. `transitionStrategyId` is stored but has no scheduling semantics.

## 9. Segment Transition Semantics

Not found: no canonical transition instant, adaptation duration, transition weekend, or boundary-precedence rule. Adjacent labeled regimes are visible, but transition behavior is not authored.

## 10. Work-Shift Transition Behavior

Confirmed: work generation is calendar-start-date driven. An overnight definition such as 18:15–06:15 produces one block owned by its start-date segment; a following 06:15 day shift can start exactly when it ends. Nothing automatically inserts an off period, and generation can overlap when authored work intervals overlap.

## 11. Current Transition Representation

Confirmed: manual segments can explicitly encode `old segment → off/transition segment → new segment` only by supplying a real intermediate segment and an available shift definition; repeating sequences can encode null/off sequence days. There is no special transition entity. This is sufficient for temporal partition and raw context, not for expressing future adaptation preferences.

## 12. Boundary Increase Case

Decision: `03:00 → 06:00` makes the outgoing-labeled window 27 local-clock hours: `[D 03:00, D+1 06:00)`. The incoming label begins at its authored 06:00 start.

## 13. Boundary Decrease Case

Decision: `06:00 → 03:00` makes the outgoing-labeled window 21 local-clock hours: `[D 06:00, D+1 03:00)`. No overlap is created.

## 14. Cycle-Wrap Case

Decision: derive each label independently through the existing effective-preference resolver, including repeating-sequence wrap. Consecutive starts remain ordered because each lies within its own consecutive local calendar date.

## 15. Fixed-Point Failure Assessment

Confirmed: iterative “choose boundary, derive day, choose boundary again” can oscillate or choose different answers in transition overlap/gap regions. It is rejected. The label-first start sequence removes circularity.

## 16. Previous-Boundary Policy

Inferred: this can be made unique only after separately defining when the incoming regime begins; stated alone it is underspecified and can assign the label/boundary inconsistently. Reject as canonical terminology.

## 17. Incoming-Boundary Policy

Inferred: this approximates the chosen result when “incoming” means the next label supplies `start(D+1)`, but instant-first wording remains ambiguous. Retain only as an explanatory consequence of the label-first sequence.

## 18. Segment-Transition-Instant Policy

Decision required and resolved: reject for V1. Authored state supplies a segment start date, not an independent instant. Midnight would invent semantics and truncate a boundary-defined day.

## 19. Piecewise-Start Policy

Recommended. It directly represents equality, increases, decreases, repeated changes, wrap, and DST as ordered boundary instants.

## 20. Other Candidate Policies

Reject fixed 24 elapsed hours (breaks local/DST semantics), fixed outgoing boundary forever (ignores authored overrides), fixed incoming boundary retroactively (rewrites prior labels), and heuristic work/sleep-based ownership (behavior cannot define temporal truth).

## 21. Recommended User-Day Policy

For each valid local date label `D`:

```text
prefs(D)  = resolve effective authored schedule preferences for label D
start(D)  = local date D at prefs(D).dayBoundaryStartTime
day(D)    = [start(D), start(D+1))

owner(T): find the unique D where start(D) <= T < start(D+1)
```

Search may inspect the local label at `T` and bounded adjacent labels until the bracketing starts are found. `getUserDay` remains the fixed-boundary primitive; it is not the variable-boundary resolver.

## 22. Coverage Proof

For the unbounded consecutive label sequence, adjacent half-open intervals share endpoints and leave no interior gap. Because starts are strictly increasing, every finite instant is bracketed by one adjacent pair.

## 23. Uniqueness Proof

Half-open intervals exclude their right endpoint, and strictly increasing starts prevent interval interiors from intersecting. A boundary instant belongs only to the incoming label.

## 24. Monotonicity

Covered by argument: boundary values are valid times in `[00:00, 24:00)`. On adjacent local dates, `start(D+1) - start(D)` is strictly positive and less than 48 local-clock hours. JavaScript local-time normalization at DST follows existing runtime convention; Task 6.3B must test supported zones and reject/handle any platform anomaly rather than assume.

## 25. User-Day Duration

Decision: variable. Boundary movement adds/subtracts its delta; DST already permits non-24-hour elapsed duration. A transition day is first-class, not an error.

## 26. User-Day Labeling

Decision: label `D` is the local calendar date whose effective boundary constructs `start(D)`. This matches existing generated label identity while making its end depend on `D+1`.

## 27. DST Interaction

Confirmed: calendar `setDate` already tolerates 23/25-hour elapsed local days. The candidate generalizes that approach. No timezone infrastructure is authorized; explicit DST tests are required.

## 28. Week-Start Interaction

User-week identity must be computed from user-day labels and the effective `weekStartsOn` for those labels, not elapsed duration. Current recurrence mostly does this; legacy instant-based `userWeek.ts` remains a remediation review point.

## 29. Recurrence Impact

Confirmed: daily, weekday, weekly, and times-per-user-week candidate expansion operate over canonical date labels, not seven 24-hour elapsed intervals. Safe in principle. The existing noon workaround and changing `weekStartsOn` need regression tests, but variable duration itself is not a blocker.

## 30. Work Generation Impact

Engine-sensitive. Calendar-start-date work generation and overnight interval construction remain valid, but `userDayDate` assignment must call the canonical variable resolver. Manual-segment generation currently applies one segment-start boundary across the whole segment and must be corrected.

## 31. Sleep Generation Impact

Engine-sensitive. Sleep is an ordinary schedulable template/category and can vary by segment through authored recurrence/anchors, but placement bounds assume 24 hours. Multiple authored templates are possible; no transition-specific temporary policy exists.

## 32. Placement Impact

Blocker for Task 6.3B completion. `placeBlockCandidates`, friction fixes, and suggested fixes use calendar-next-day or 1,440-minute ends. They must consume `start(D+1)`.

## 33. Preview Impact

Engine-sensitive. Range labels are safe, but manual all-day expansion and overlap/clipping helpers use `start + one calendar day`. Preview must consume canonical windows.

## 34. DayVisualizer Impact

Blocker for truthful transition display. It explicitly promises 24 hours and scales/clips to 1,440 minutes. It needs a supplied canonical window/duration before variable days are exposed.

## 35. HistoricalPlan Impact

Day context already freezes the label's boundary but not the next label's boundary. Task 6.3C concerns occurrence timing intent; Task 6.3B should decide whether frozen day-window provenance also needs an explicit end or next-boundary field for later historical interpretation. Current Today query may derive the current window from active authored state only as authorized by Task 6.3.

## 36. Today Impact

Today becomes deterministic after 6.3B and can select HistoricalPlan by the resolved label. It must not implement its own boundary loop or use Preview.

## 37. Real Transition Worked Example

Repository-defined shift semantics support an overnight 18:15–06:15 shift. Suppose labels Fri/Sat use boundary 03:00, Sun/Mon use 06:00, the Saturday overnight block ends Sunday 06:15, and a day shift starts Sunday 06:15:

```text
Fri day: [Fri 03:00, Sat 03:00)
Sat transition day: [Sat 03:00, Sun 06:00)  (27 local-clock hours)
Sun stable incoming day: [Sun 06:00, Mon 06:00)
work: Sat 18:15 -------- Sun 06:15 | Sun 06:15 -------- Sun 18:15
```

Future transition context may attach to the Sat/Sun label boundary and compare work/boundary deltas. Sleep adaptation, reduced load, and recommendations remain outside this audit. If an off weekend is intended, it must be authored with off sequence days or explicit segments; none is inferred.

## 38. Transition Context Derivation

Future-compatible recommendation: a pure query can compare previous/current/next effective label regimes, boundary delta, work definitions, week start, and days since/until change. Existing state is sufficient for these facts.

## 39. Shift-Change Magnitude Evidence

Confirmed derivable: old/new work start/end, boundary, and week start. These are provenance, not evidence that a change is difficult, unsafe, or requires a particular response.

## 40. Sleep-Transition Readiness

Partially ready. Sleep templates and schedule openings exist; temporary transition-specific sleep preferences, pace, and protection do not. Future logic may propose, never silently mutate.

## 41. Goal-Reorientation Readiness

Goal/commitment links identify candidate commitments, but no policy authorizes deprioritization. A future recommendation or temporary PlanDecision is plausible; direct commitment mutation/new allocation authority is not justified.

## 42. Capacity Readiness

Raw openings can be derived after variable-window remediation. Capacity meaning/policy remains unimplemented.

## 43. Transition Horizon Readiness

Confirmed: planning ranges and label enumeration are arbitrary; a future `N before + transition + N after` query need not be month-specific.

## 44. Stable-vs-Transition Regime Model

Future-compatible recommendation: derive this context by comparing adjacent label preferences/shift definitions. Do not make it durable authority until authored transition policy requires it.

## 45. Future Authored Transition Policy

Adaptation duration, desired sleep pace, protected days, and allowed load changes are not present. They are future authored preferences and do not block temporal ownership.

## 46. Recommended Layering

1. Canonical temporal partition (pure starts/windows).
2. Derived schedule-regime transition context.
3. Derived openings/capacity/friction evidence.
4. Advisory transition recommendations, including Goal reorientation.

Only layer 1 is prerequisite to Today ownership.

## 47. Current All-Day Semantics

Confirmed: `ManualCalendarEvent.allDay` is required authored state. Preview carries it as `DraftScheduledBlock.isAllDay`; presentation labels it “All day.”

## 48. Manual Event All-Day Meaning

Confirmed: it means **user-day-wide**, not civil-calendar-midnight-wide. Generation starts at the effective boundary for the authored `userDayDate` and currently ends one calendar day later. Task 6.3B must change that end to `start(D+1)`.

## 49. 24-Hour Timed Event Distinction

Confirmed: timed start/end fields can span to the next date when end time is not later than start time; no validation prohibits equal times, so an exact 24-hour timed event is legal. Interval alone cannot prove all-day intent.

## 50. Historical All-Day Requirement

Minimum truthful frozen provenance is authored timing kind: `allDay` or `timed`. Authored date is already carried by day publication; exact scheduled instants remain in the plan. No display-mode guess is needed.

## 51. Representation Alternatives

Optional boolean preserves legacy syntax but makes new completeness dependent on presence and mutates strict V1. A required boolean is clear but less extensible. A tagged union is explicit. A V2 snapshot is required to preserve immutable V1 meaning.

## 52. Recommended All-Day Representation

Decision: `HistoricalPlannedOccurrenceSnapshotV2` with required `timing: { kind: "allDay" } | { kind: "timed" }`, independent of plan disposition. The scheduled plan continues to carry exact interval. Use an occurrence V1|V2 union in compatible enclosing day/batch validation; do not mechanically bump surface, batch, or day versions unless implementation proves their contracts cannot safely contain versioned occurrences.

## 53. Legacy Interpretation

V1 means `timingSemantics: unavailableLegacy`. Readers may display its frozen interval as an interval but must not call it explicitly timed or all-day. Current authored/manual state is forbidden as a backfill source.

## 54. HistoricalPlan Version Decision

Smallest correct semantic bump: occurrence snapshot V2 only. Surface V1, batch V1, day V1, and Goal provenance V1 can remain if their validators/types explicitly accept a canonical snapshot union. If the enclosing V1 contract is documented as V1-only rather than version-extensible, 6.3C must bump the narrowest enclosing layer and record why; no mechanical cascade.

## 55. Strict Validation

Confirmed: current exact-key validation rejects an added V1 field. Therefore `isAllDay?` on V1 is not compatible. Validator dispatch must branch on occurrence version with exact keys for each version.

## 56. Fingerprint

Required: snapshot/day/batch semantic fingerprints include snapshot version and timing tag so identical intervals with different intent differ. Legacy and explicit timed also differ.

## 57. Clone/Serialization

Covered by design: the tag is plain structured-clone/JSON data. Clone helpers must retain it and preserve V1 unchanged.

## 58. IndexedDB

No database schema/index change is inherently required; records are structured-cloned values. Runtime validators and physical record reconstruction must accept both versions.

## 59. Backup V6

Decision: no Backup V7 solely for a versioned HistoricalPlan occurrence. V6 generically transports HistoricalPlan but validates it through the HistoricalPlan domain. Update that validator to accept V1/V2 and prove V6 round-trip/fingerprint behavior. This is a validation evolution, not a backup envelope change.

## 60. Restore

Restore must accept legacy V1 and new V2 records, preserve exact versions/tags, and install them without consulting Active or manual-event authority.

## 61. No-Backfill Boundary

Mandatory and accepted: no current Goal, manual event, Preview, or schedule state may infer missing historical timing intent.

## 62. Republication

Confirmed analogy to Goal provenance: old effective publications remain legacy/unknown; a later republished day freezes explicit V2 intent; the existing `publishedAt <= asOf` cutoff decides which is knowable.

## 63. All-Day Worked Example

```text
V1: plan=[00:00,next 00:00), no timing tag -> unavailableLegacy
V2: timing={kind:"allDay"}, same interval -> known user-day all-day
V2: timing={kind:"timed"}, same interval -> known timed 24-hour occurrence
```

## 64. Implementation Slicing

Recommend two tasks. 6.3B changes temporal core plus engine/UI consumers. 6.3C evolves an append-only historical authority. Combining them would obscure independent invariants and rollback/compatibility evidence.

## 65. ADR Recommendations

Create two accepted ADRs with this audit: **Canonical User-Day Boundary Transition Semantics** and **HistoricalPlan All-Day Occurrence Provenance**. Implementation tasks may refine mechanics but not reverse semantics without superseding ADRs.

## 66. Validation

All required validation passed on 2026-08-24. `npm run lint` and `npm run
typecheck` exited 0. `npm run test` passed 84 files / 884 tests. `npm run build`
transformed 112 modules and emitted 707,920 total JavaScript bytes. `npm run
check:bundle` passed with 677,829 initial raw bytes, 168,596 initial gzip bytes,
and a 30,091-byte largest lazy chunk. `git diff --check` exited 0. The immutable
artifact hashes both equal
`c1b8b8e088400633959f9674ceb5f75aaa37abbbc0220d83a94bf77a4e131bad`.
No production test was changed for this audit. Global write-formatting was not run
because it would rewrite the required byte-identical immutable artifact copy.

## 67. Governance Updates

Roadmap, Current State, Changelog, a Phase 6 checkpoint, and two ADRs record the decision and continued Task 6.3 block.

## 68. Deviations

No production behavior was implemented. The audit does not claim immediate Task 6.3 resumption because downstream 24-hour assumptions are material.

## 69. Discoveries

The manual all-day marker means user-day-wide; manual-segment work generation applies one boundary across a segment; DayVisualizer is explicitly 24-hour; Backup V6 can carry evolved HistoricalPlan without an envelope bump; `transitionStrategyId` has no executable semantics.

## 70. Deferred Work

6.3B resolver/consumer remediation; 6.3C HistoricalPlan V2 timing provenance; Task 6.3 Today query; future transition-context and recommendation policies; any timezone hardening beyond current local semantics.

## 71. Transition-Policy Matrix

| Policy | Unique ownership | Variable days | Requires new authored data | Future transition-planning fit | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| Previous-boundary ownership | only with extra rule | possible | possibly | medium | reject wording |
| Incoming-boundary ownership | only when label-defined | yes | no | good | consequence only |
| Explicit segment transition instant | yes | yes | yes | good | defer |
| Piecewise user-day starts | yes | yes | no | excellent | **adopt** |
| Fixed 24 elapsed hours | yes | no | no | poor | reject |

## 72. User-Day Invariant Matrix

| Invariant | Current | Candidate model |
| --- | --- | --- |
| every instant owned | fixed boundary only | yes |
| one owner only | fixed boundary only | yes |
| deterministic | fixed boundary only | yes |
| supports variable boundary | no | yes |
| supports cycle wrap | generation only | yes |
| overnight-safe | fixed regimes | yes |
| restoration-safe | incomplete | pure from restored authored state |
| Today-query-safe | no | after 6.3B |

## 73. Downstream Impact Matrix

| Subsystem | Assumes 24h? | Transition impact | Remediation required? |
| --- | ---: | --- | ---: |
| recurrence expansion | mostly no | labels remain canonical | tests |
| work generation | ownership path | wrong boundary/label possible | yes |
| sleep generation | via placement | short/long bounds | yes |
| candidate placement | yes | can place outside/omit real window | yes |
| Preview range | label-based | low | tests |
| Preview clipping | yes | wrong overlap | yes |
| DayVisualizer | explicitly yes | wrong scale/clip | yes |
| HistoricalPlan | day context fixed-boundary | timing/window provenance review | yes |
| Summary | no direct ownership | consumes existing history | no immediate |
| Today | unresolved | cannot query canonically | yes |

## 74. Transition-Readiness Matrix

| Future capability | Existing evidence sufficient? | New authored policy eventually needed? | New authority likely? |
| --- | ---: | ---: | ---: |
| identify shift transition | yes | no | no |
| quantify boundary shift | yes | no | no |
| compare work windows | yes | no | no |
| propose temporary sleep schedule | partial | yes | recommendation/decision likely |
| reduce transitional load | partial | yes | recommendation/decision likely |
| reprioritize Goal commitments | links only | yes | recommendation likely |
| restore stable schedule | derivable regime | perhaps | not yet known |

## 75. All-Day Representation Matrix

| Representation | Legacy compatibility | Strictness | Fingerprint-safe | Version impact | Recommendation |
| --- | --- | --- | --- | --- | --- |
| optional boolean | syntactic only | weak/ambiguous | if presence included | mutates V1 | reject |
| required boolean + new version | good | strong | yes | occurrence V2 | acceptable |
| timing tagged union | good | strongest/extensible | yes | needs version | **shape adopted** |
| snapshot V2 | preserves V1 | strong | yes | narrow | **version adopted** |
| infer from interval | false | false | false | none | prohibited |

## 76. Legacy Matrix

| Record | Interpretation after remediation |
| --- | --- |
| legacy occurrence with no all-day provenance | unavailableLegacy; interval only |
| new explicit all-day occurrence | known user-day all-day |
| new explicit timed occurrence | known timed |
| legacy day republished under new semantics | later V2 truth applies only after its cutoff |

## 77. Historical Boundary Matrix

| Concern | Change required? |
| --- | ---: |
| HistoricalPlan validator | yes, V1/V2 dispatch |
| fingerprint | yes |
| clone | yes |
| JSON | tests only |
| IndexedDB | validation/tests; no DB version expected |
| Backup V6 | validator/round-trip tests; no V7 expected |
| restore | union acceptance/tests |
| full clear | no semantic change; regression test |
| republication | materialize V2 and cutoff tests |

## 78. Future-Layer Matrix

| Layer | Responsibility | Durable? |
| --- | --- | ---: |
| user-day partition | exact temporal ownership | derived pure truth |
| transition context | adjacent-regime facts | derived |
| capacity evidence | openings/constraints | derived |
| transition recommendation | advisory adaptation proposal | not by default |
| Goal reorientation recommendation | advisory commitment changes | not by default |

## 79. Epistemic Matrix

| Evidence | DayFrame may say | Must not say |
| --- | --- | --- |
| boundary changes by 3h | exact delta/day duration | user needs adaptation |
| work regime changes | exact old/new windows | change is harmful |
| transition day is 27h | exact canonical duration | 27 usable hours |
| available schedule opening | deterministic opening | capacity/productivity |
| no sleep record | no record available | user did not sleep |
| Sleep commitment exists | authored commitment exists | medically appropriate |
| Goal-linked commitment exists | frozen/current link as scoped | should be deprioritized |
| legacy event has 24h interval | interval is 24h | it was all-day or timed |
| explicit isAllDay true | authored all-day | actual behavior occurred |

## 80. Architecture Decision Set

1. Adopt piecewise consecutive user-day starts.
2. Permit variable-duration user-days.
3. Label `D` supplies its own effective boundary and start; `D+1` supplies its end.
4. Derive segment transition context; author future adaptation policy separately if needed.
5. Add occurrence snapshot V2 with required tagged timing kind.
6. Treat V1 absence as unavailable legacy, never guessed.
7. Prefer occurrence-only version bump; update HistoricalPlan/Backup V6 validation without Backup V7 unless implementation disproves generic transport.
8. Complete separate Tasks 6.3B and 6.3C, then resume 6.3.

## 81. Stop-Condition Assessment

No audit stop condition prevents choosing architecture. A candidate guarantees ownership; authored label preferences guarantee monotonic starts; variable duration requires bounded consumer remediation, not engine redesign; manual all-day meaning is explicit; versioned preservation keeps legacy data truthful.

## 82. Architectural Alignment Assessment

Aligned with deterministic planning, provenance, historical immutability, user authority, and epistemic integrity. Temporal truth remains independent of Sleep, Goals, execution evidence, or recommendation policy.

## 83. Recommended Remediation Task(s)

**Task 6.3B — Implement Canonical Piecewise User-Day Windows and Variable-Duration Consumer Remediation.** Include resolver, proofs/tests, work ownership, week lookup, placement, friction/suggestion bounds, manual all-day expansion, Preview clipping, visualizer, DST, wrap, and restore determinism.

**Task 6.3C — Implement HistoricalPlan V2 Timing Provenance and V1 Compatibility.** Include materialization, strict union validation, fingerprints, clones, reads, IndexedDB, Backup V6, restore, republication, full clear regression, and legacy coverage.

## 84. Task 6.3 Resume Criteria

Both tasks must be implemented and all repository validation green. Mechanical evidence must prove unique ownership across equal/increase/decrease/repeated/wrap/DST cases, all engine consumers must use canonical ends, new publications must freeze timing kind, V1 must remain distinguishable, and Backup/restore must round-trip both.

## 85. Final Audit Determination

**Task 6.3A is complete as an architecture decision audit. Task 6.3 remains blocked, now on two precise implementation prerequisites rather than unresolved policy.** A transition day is an exact variable-duration user-day, and all-day intent is explicit frozen provenance for new history while old history remains honestly incomplete.
