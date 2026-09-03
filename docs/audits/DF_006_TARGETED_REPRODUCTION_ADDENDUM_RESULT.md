# DF-006 Targeted Reproduction Addendum Result

## 1. Executive Result

Recovered screenshot evidence invalidates the prior explanation of `DF-006`: the demonstrated shifts were Monday–Friday and non-overnight, so a Saturday-authorized overnight crossover cannot explain the observed weekend Work. The prior **BR3** conclusion is superseded for `DF-006`; its reproduction remains a valid control only.

Current code did not reproduce weekend Work from Monday–Friday, non-overnight shifts under direct generation, manual dated cycles, one/two-shift combinations, changed range starts, narrow/year-scale ranges, changed boundaries, changed week-start preferences, Month projection, or grid alignment. A repeating-sequence cycle can explicitly schedule the same shift on weekend cycle days without consulting `workDays`, but the Dogfood cycle mode and sequence entries were not recovered. The anomalous screenshot dates, Preview freshness, event identity, and exact cycle state are likewise unavailable. Consequently the sole defensible classification is **BR6 — Exact Reproduction Blocked**, closure **DF006-C5 — Additional State Recovery Required**, and **Path C — State Recovery**.

## 2. Reason for Reopening DF-006

The earlier result inferred that a Sunday-visible block likely crossed midnight from Saturday. New Experienced Truth establishes no authored weekend weekday and no overnight shift. That control remains correct in isolation but does not match the reported configuration.

## 3. Scope

This addendum reopens only `DF-006`. It does not alter the prior result, fix code, add tests, redesign Work/cycles/Month, or revisit `DF-017`/`DF-018`.

## 4. Source Inventory

- `docs/audits/DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md`
- `docs/audits/DOGFOOD_PASS_01_FINDINGS_RECONCILIATION_RESULT.md`
- `docs/audits/DOGFOOD_PASS_01_TARGETED_BUG_REPRODUCTION_RESULT.md`
- `docs/architecture/POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`
- Addendum-provided screenshot facts; no image files were present in the repository or attachment set available to this investigation.
- `code/src/core/shifts/generateWorkBlocks.ts`
- `code/src/core/cycles/generateCycleWorkBlocks.ts`
- `code/src/core/cycles/shiftCycleUtils.ts`
- `code/src/core/time/userWeek.ts`
- `code/src/core/time/canonicalUserDay.ts`
- `code/src/core/engine/generateSchedulePreview.ts`
- `code/src/core/monthlyPlanner/queryMonthlyPlanner.ts`
- `code/src/state/dayFrameStore.ts`
- Tests enumerated in section 44.
- Phase 7 commit `a3d89e3` as historical executable comparison.

No preserved Dogfood setup/profile/backup/Preview payload or screenshot image was found.

## 5. New Screenshot Evidence

The supplied facts establish two weekday-based definitions named Day Shift and Evening Shift. Monday through Friday were selected, Saturday and Sunday were not, and neither time range crossed midnight. The corresponding Month/planning state visibly exhibited weekend Work. Exact labels beyond those facts are treated as unknown.

## 6. Prior BR3 Reassessment

The prior Saturday-overnight reproduction is a **valid control case; mismatched to recovered DF-006 conditions**. Its calendar-crossover conclusion remains true for that input. It does not explain two weekday-only, non-overnight definitions. The prior BR3 is therefore **superseded as the classification of DF-006** and retained only as classification of the control. Historical integrity is preserved by leaving the prior result unchanged and recording the correction here.

## 7. Truth Model

- **Experienced Truth:** screenshots show Mon–Fri/non-overnight authoring and weekend Work in planning output.
- **Intended Truth:** weekend-excluding Work authority must not yield canonical weekend Work merely because the range includes weekend dates.
- **Implemented Truth:** ordinary/direct and manual-cycle current paths enforce weekday membership; Month indexes Work by `userDayDate`. Repeating-sequence mode assigns shifts from explicit sequence days independently of `workDays`.
- **Historical Audit Interpretation:** BR3 attributed the symptom to overnight crossover; new evidence makes that inference insufficient.

## 8. Intended Work Invariant

A Monday–Friday, non-overnight Work definition must not generate canonical Saturday or Sunday Work merely because those dates occur in a planning range. Calendar overlap and canonical recurrence remain distinct controls, but neither explains this non-overnight configuration.

## 9. Reconstructed Dogfood Configuration

| Field | Recovered value |
| --- | --- |
| Day Shift time | **Not recovered** |
| Evening Shift time | **Not recovered** |
| Both weekday sets | Monday–Friday; not Saturday/Sunday |
| Both `crossesMidnight` | False/non-overnight |
| Shift IDs and order | **Not recovered** |
| Cycle mode, IDs, anchor, segments/sequence | **Not recovered** |
| Day boundary / week start | **Not recovered** |
| Planning/Preview range and selected month | Broad range indicated; exact values **Not recovered** |
| Profile/load state and freshness | **Not recovered** |

Control times `09:00–17:00` and `17:00–21:00`, month August 2026, and boundary `03:00` were chosen solely to exercise non-overnight mechanics. They are not asserted as screenshot values.

## 10. Anomalous Weekend Dates

Exact anomalous dates and readable token details were **Not recovered**. The available textual screenshot constraints do not identify them.

| Displayed Date | Displayed Weekday | Work Label | Apparent Shift | Other Events | Screenshot Evidence |
| --- | --- | --- | --- | --- | --- |
| **Not recovered** | Weekend | Work | **Not recovered** | **Not recovered** | Addendum states Month/planning output exhibited weekend Work |

The addendum explicitly identifies the item as Work, but no image is available to independently distinguish its exact label from other annotations.

## 11. Current Work Generation Trace

`generateSchedulePreview` calls `generateCycleWorkBlocks`. Manual segments are clipped to their dated range and delegated to `generateWorkBlocks`, which enumerates local dates, maps each through `getWeekdayFromDate`, checks `shiftDefinition.workDays.includes(...)`, constructs a block, and assigns start/user-day provenance. Repeating sequences instead map anchor-relative sequence days directly to `createWorkBlockForLocalDate`; that path does not consult `workDays` because the sequence-day assignment is itself explicit cycle authority.

## 12. Current Month Projection Trace

`queryMonthlyPlanner` builds an anchored contiguous date grid. `indexEvidence` indexes every `preview.result.generatedWorkBlocks` item strictly by `block.userDayDate`, then each cell reads only its matching map bucket. `weekStartsOn` controls column/grid ordering. It does not rewrite block dates or recurrence eligibility.

## 13. Exact Anomalous Occurrence Trace

An exact anomalous occurrence cannot be traced because its date, Preview payload, source ID, shift ID, cycle identity, and UI detail data were **Not recovered**. Current reconstructed manual cases contain no anomalous occurrence; thus no false end-to-end trace is substituted.

## 14. Weekday Representation Audit

`Weekday` uses string values. The shared `WEEKDAYS` order is Sunday through Saturday, matching JavaScript `Date.getDay()` (`Sunday=0`). `getWeekdayFromDate` selects from that table. Month leading-cell arithmetic uses `first.getDay() - WEEKDAYS.indexOf(anchor)`. No Monday-zero/ISO conversion boundary was found in the traced path, and current cases reject an off-by-one hypothesis.

## 15. Week-Start Analysis

Sunday-first and Monday-first Month queries changed grid starts (`2026-07-26` versus `2026-07-27`) but kept all tested weekend Work counts at zero. Week start is presentational in this path and did not alter semantic dates.

## 16. Cycle Anchor Analysis

Manual dated segments do not use a recurrence anchor; they delegate weekday eligibility within segment dates. Repeating-sequence mode uses `sequenceAnchorDate` and modulo cycle position. An all-assigned seven-day control produced weekend Work under either tested anchor because every sequence position named a shift. Since the Dogfood cycle mode/entries are **Not recovered**, this identifies a possible first transformation boundary but not the historical cause.

## 17. Planning-Range Analysis

Changing the narrow start from Saturday `2026-08-01` to Friday `2026-07-31` added only the eligible Friday. It did not shift the overlapping Monday–Friday dates or create weekend Work.

## 18. Expanded-Window Analysis

`generateWorkBlocks` expands its candidate start by one local day to capture overlapping overnight work, then applies weekday eligibility to each candidate and clips by interval overlap. Non-overnight controls produced no padding-induced weekend block. Requested, candidate-expanded, and render dates remained distinct.

## 19. Canonical User-Day Analysis

With daytime/evening controls, boundaries `00:00` and `03:00` yielded start date equal to `userDayDate` and no weekend Work. The unresolved exact Dogfood boundary cannot be tested, but no ordinary boundary mechanism can explain a full non-overnight weekday block moving to weekend without the missing exact time.

## 20. Shift-Ordering Analysis

Reversing definition-array order did not change selected shift identity or occurrence dates. Swapping which definition occupied the manual segment changed the shift label as authored but retained the same Monday–Friday dates.

## 21. Multiple-Shift Analysis

Day-only and Evening-only each produced five weekday blocks. Combining both produced ten weekday blocks and zero weekend blocks. Multiple definitions alone do not reproduce `DF-006`.

## 22. Cycle/Rotation Analysis

- No-cycle/direct generation: no weekend Work.
- Manual dated-cycle control: no weekend Work.
- Recovered Dogfood cycle: **Not recovered**, so not executable.
- Shifted manual selection/order: no date movement.
- Repeating-sequence control with a shift explicitly assigned to all seven sequence positions: weekend Work exists; first introduced during cycle expansion.

The last case does not contradict its explicit sequence input and cannot be attributed to the screenshots without their cycle state.

## 23. Month-Boundary Analysis

August 2026 begins on Saturday. Both Sunday- and Monday-anchored grids correctly included adjacent-month cells and mapped weekday Work only to August 3–7. No month-boundary displacement occurred.

## 24. Broad-Range Analysis

A 2026 year-scale manual-cycle generation produced the same semantic Work occurrences inside the August 1–10 overlap as the narrow generation. Range length did not accumulate an offset.

## 25. Timezone/DST Analysis

Execution used the repository environment timezone `America/Chicago`; August 2026 is not adjacent to a DST transition. The control times are non-overnight and not near midnight. Timezone was therefore bounded rather than expanded into an unsupported hypothesis. Exact screenshot dates/times remain unrecovered.

## 26. Calendar-Grid Analysis

Grid labels are generated from a local-noon month start, a shared weekday table, and sequential dates. Sunday-first and Monday-first controls produced unique contiguous labels and placed no Work in August 1/2/8/9 cells. The query model binds evidence to labels, so no wrong visual cell was reproduced.

## 27. Event-Identity Analysis

Current generated IDs encode `work_<shiftId>_<localStartDate>` and occurrence identity retains shift/cycle/segment/local-start provenance. In manual controls every identity was weekday-aligned. The anomalous historical identity is **Not recovered**, so Friday/Monday duplication, wrong shift, or stale identity cannot be selected among.

## 28. Stale-Preview Control

Current authored mutations retain and mark Preview stale; Month coverage becomes `coveredStale` while preserving indexed contents. A stale Preview generated under an earlier weekend-enabled setup could coexist visibly with newly edited Mon–Fri controls. The screenshot freshness indicator and generation timestamp are **Not recovered**, so this is plausible but unproven.

## 29. Profile/Restore Control

No Dogfood profile/backup was found. Current setup replacement marks derived Preview stale rather than silently making it fresh. A historical state mismatch remains possible but lacks evidence and was not promoted to cause.

## 30. Minimal Reproduction Matrix

| Case | Shift Set | Weekdays | Overnight? | Cycle | Range | Expected Weekend Work | Actual |
| --- | --- | --- | ---: | --- | --- | ---: | --- |
| A | Day only | Mon–Fri | No | none/direct | narrow | No | None |
| B | Evening only | Mon–Fri | No | none/direct | narrow | No | None |
| C | Both | Mon–Fri | No | none/direct | narrow | No | None |
| D | Both available | Mon–Fri | No | manual dated control | narrow | No | None |
| E | Both available | Mon–Fri | No | manual dated control | year-scale | No | None in overlap |
| F | Saturday authorized | Yes | Yes | prior control | narrow | Sunday calendar overlap allowed | Previously confirmed crossover only |
| G | Day definition | Mon–Fri | No | explicit seven-position repeating sequence | narrow | Depends on sequence authority | Sat/Sun canonical Work generated |
| H | Manual control | Mon–Fri | No | manual | Sunday/Monday grid anchors | No | None |
| I | Manual control | Mon–Fri | No | manual | stale projection | No new generation | Same data labeled stale |

## 31. Screenshot-Date Reproduction

Not executed: the actual anomalous week/date, month, year, and source occurrence were **Not recovered**. August 2026 is only a boundary-control month and is not represented as the screenshot month.

## 32. Current-vs-Historical Behavior

Historical Experienced Truth is accepted: the screenshot showed weekend Work alongside Mon–Fri/non-overnight definitions. Current ordinary/manual behavior does not reproduce it. A diff from Phase 7 commit `a3d89e3` through current `HEAD` found no intervening change in the traced shift, cycle, or Month modules capable of establishing a correction. Therefore BR4/C2 would overclaim; the missing state remains material.

## 33. Determinism

Repeated frozen cases returned identical semantic dates. No dependency on array order, range padding, week-start preference, day boundary, or run time appeared. Repeating-sequence weekend output was also deterministic for its explicit all-days sequence.

## 34. Root Cause

No RC-A–RC-J classification is assigned because the recovered condition was not exactly reproduced. Two bounded hypotheses survive:

1. explicit repeating-sequence assignment introduced weekend Work at cycle expansion (**RC-B candidate**);
2. old weekend-enabled Preview remained visible after the Work definition changed (**RC-H candidate**).

Neither is confirmed without the Dogfood cycle and Preview state. Direct weekday eligibility, planning-range offset, canonical user-day assignment, Month projection, and calendar-grid rendering were rejected for the tested controls.

## 35. DF-006 Final Classification

**BR6 — Exact Reproduction Blocked.** The screenshot establishes a material mismatch, but exact cycle/rotation authority, anomalous dates, occurrence identity, and Preview freshness are missing. The current nearest reconstruction is correct, while two materially different mechanisms remain possible. The previous BR3 no longer classifies DF-006.

## 36. Severity Reassessment

Severity returns from S3 to **S1 pending state recovery**. If fresh generated weekend Work is present, it contaminates schedule authority and potentially every downstream planning surface. If stale/presentation-only, impact is narrower but still a trust failure. The evidence cannot safely preserve the earlier downgrade.

## 37. Architecture Reopen Check

**No.** Accepted architecture sufficiently distinguishes authored Work authority, cycle authority, canonical ownership, and presentation. The uncertainty concerns which implemented/historical state produced the screenshot, not what the intended answer should be.

## 38. Downstream Contamination

If cycle expansion generated incorrect canonical weekend Work, occupied time, Capacity inputs, Commitment placement, Friction, Preview, publication, Execution, and history can inherit it. If the cause was stale Preview or rendering, underlying fresh schedule semantics remain correct and contamination stops at derived-state/presentation authority. Current evidence cannot choose between these branches.

## 39. Implementation Alignment Consequence

Do not carry a speculative defect fix. Carry the corrected historical evidence, S1 uncertainty, exact missing-state request, candidate boundaries (`generateRepeatingSequenceWorkBlocks` versus stale Preview), intended invariant, and regression requirements. Alignment should not treat the previous BR3 as closure for `DF-006`.

## 40. Regression Requirements

- **DF006-REG-01:** A Mon–Fri non-overnight definition must not generate canonical Saturday/Sunday Work absent explicit independent cycle authority.
- **DF006-REG-02:** Two such definitions must not introduce weekend Work merely because both exist.
- **DF006-REG-03:** Planning-range start must not alter weekday eligibility.
- **DF006-REG-04:** Review/Month week-start must not alter recurrence.
- **DF006-REG-05:** Manual cycle alignment must preserve weekday membership; repeating-cycle authority must be explicit and explainable.
- **DF006-REG-06:** Broad and narrow overlapping ranges must yield identical semantic occurrences.
- **DF006-REG-07:** Calendar crossover must remain distinguishable from canonical recurrence.
- **DF006-REG-08:** Month must place Work in its projected `userDayDate` cell.
- **DF006-REG-09:** Stale Preview must be visibly distinct from fresh Preview.
- **DF006-REG-10:** Work detail/provenance must expose cycle/segment/sequence origin sufficiently to audit weekend authority.

## 41. Evidence Table

| Evidence | Truth Type | Supports | Contradicts | Confidence |
| --- | --- | --- | --- | --- |
| Recovered Work Pattern screenshot facts | Experienced | Mon–Fri/non-overnight setup | Prior overnight explanation | High for supplied facts |
| Recovered Month screenshot fact | Experienced | Weekend anomaly | Clean expected presentation | High for supplied fact; low for missing identity/date |
| Prior Saturday overnight reproduction | Implemented | Valid crossover semantics | Its use as DF-006 explanation | High |
| Current direct/manual reproduction | Implemented | Ordinary weekday enforcement | Current general recurrence defect | High within tested state |
| Current repeating-sequence control | Implemented | Explicit sequence can produce weekend Work | Claim that `workDays` always gates cycles | High; historical relevance unknown |
| Current Month projection | Implemented | Indexing by `userDayDate` and correct grids | Tested grid-offset hypothesis | High |
| Stale store behavior | Implemented | Viable old-Preview mechanism | Assumption display proves fresh generation | High current; historical relevance unknown |
| `a3d89e3..HEAD` relevant diff | Historical/Implemented | No demonstrated intervening correction | BR4/C2 correction claim | Medium-high |
| Accepted architecture | Intended | Authored/cycle authority and provenance | Prior premature closure | High |

## 42. Date Trace Table

No anomalous occurrence reproduced, so the mandatory anomalous trace cannot be populated without invention.

| Layer | Date | Weekday | User-Day | Source ID | Shift ID | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Authored eligibility | **Not recovered** | Mon–Fri only | — | **Not recovered** | **Not recovered** | Screenshot constraint |
| Cycle expansion | **Not recovered** | **Not recovered** | **Not recovered** | **Not recovered** | **Not recovered** | Cycle state absent |
| Generated Work | **Not recovered** | Weekend observed downstream | **Not recovered** | **Not recovered** | **Not recovered** | Payload absent |
| Preview | **Not recovered** | **Not recovered** | **Not recovered** | **Not recovered** | **Not recovered** | Fresh/stale absent |
| Month projection | **Not recovered** | Weekend | **Not recovered** | **Not recovered** | **Not recovered** | Screenshot fact only |
| Rendered cell | **Not recovered** | Weekend | **Not recovered** | **Not recovered** | **Not recovered** | Exact cell absent |

For the nearest manual control, `evening:2026-08-03:2026-08-03` remains Monday at authored eligibility, cycle expansion, generated Work, and Month cell; no transformation is incorrect.

## 43. Boundary Matrix

| Boundary | Tested? | Changes Semantic Work Date? | Expected? | Evidence |
| --- | ---: | ---: | ---: | --- |
| Sunday vs Monday week start | Yes | No | Yes | Grid start only changed |
| narrow vs broad range | Yes | No in overlap | Yes | Identical semantic list |
| range start weekday | Yes | No | Yes | Eligible Friday added; overlap stable |
| cycle anchor | Partial | Only explicit sequence position can select work/off | Yes for sequence semantics | Manual stable; all-days sequence produces weekends |
| one vs two shifts | Yes | No | Yes | 5/5/10 weekday blocks |
| day boundary | Yes, controls | No | Yes | `00:00`/`03:00` stable |
| Month grid start | Yes | No | Yes | Both anchors zero weekend tokens |
| stale vs fresh Preview | Yes, current control | No generation change | Yes | Coverage changes fresh→stale |

## 44. Existing-Test Evidence

| Test file | Relevant coverage |
| --- | --- |
| `core/shifts/__tests__/generateWorkBlocks.test.ts` | weekday filtering, overnight, boundaries |
| `core/cycles/__tests__/generateCycleWorkBlocks.test.ts` | manual/repeating cycles, anchor, off-days, occurrence provenance |
| `core/time/__tests__/canonicalUserDay.test.ts` | canonical windows/boundaries |
| `core/engine/tests/generateSchedulePreview.test.ts` | Work through Preview generation |
| `core/monthlyPlanner/queryMonthlyPlanner.test.ts` | grid anchors, projection, fresh/stale coverage |
| `state/tests/dayFrameStore.test.ts` | authored edits mark Preview stale |
| `ui/tests/MonthlyPlannerSurface.test.tsx` | Month presentation of query model |

Passing coverage supports current controls but cannot reconstruct absent Dogfood state.

## 45. Reproduction Decisions

### DF006-DEC-01 — Prior BR3 Reassessment

- **Decision:** Supersede BR3 for DF-006; retain it only for the overnight control.
- **Evidence:** Recovered shifts exclude weekends and overnight.
- **Intended Truth:** Controls must match observed authority.
- **Implemented Truth:** Overnight crossover control is valid.
- **Experienced Truth:** It is not the screenshot configuration.
- **Reasoning:** Correct control, incorrect causal inference.
- **Consequence:** Prior artifact stays immutable; this addendum corrects it.
- **Regression Requirement:** DF006-REG-07.
- **Remaining Question:** Actual historical mechanism.

### DF006-DEC-02 — Screenshot Configuration

- **Decision:** Fix only Mon–Fri/non-overnight as recovered.
- **Evidence:** Supplied screenshot facts.
- **Intended Truth:** Do not invent inputs.
- **Implemented Truth:** Exact times/cycle not present.
- **Experienced Truth:** Two shifts shown.
- **Reasoning:** Other values are unrecovered.
- **Consequence:** Use controls, not claimed exact fixture.
- **Regression Requirement:** DF006-REG-01/02.
- **Remaining Question:** Times, IDs, cycle, range.

### DF006-DEC-03 — Anomalous Date

- **Decision:** Record date as Not recovered.
- **Evidence:** No image/date payload available.
- **Intended Truth:** Exact dates require evidence.
- **Implemented Truth:** Arbitrary August control is clean.
- **Experienced Truth:** At least one weekend cell had Work.
- **Reasoning:** Avoid false precision.
- **Consequence:** Screenshot-date replay blocked.
- **Regression Requirement:** DF006-REG-10.
- **Remaining Question:** Exact date and label.

### DF006-DEC-04 — Source vs Rendering

- **Decision:** Boundary unresolved historically; both current control layers are correct.
- **Evidence:** Clean generated blocks and Month projection.
- **Intended Truth:** Stop at first wrong layer.
- **Implemented Truth:** No wrong layer in manual reconstruction.
- **Experienced Truth:** Weekend output visible.
- **Reasoning:** Historical payload absent.
- **Consequence:** Do not assign engine/render defect.
- **Regression Requirement:** DF006-REG-08.
- **Remaining Question:** Historical generated block.

### DF006-DEC-05 — Weekday Eligibility

- **Decision:** Reject direct eligibility as reproduced cause.
- **Evidence:** Mon–Fri direct cases emit weekdays only.
- **Intended Truth:** Start weekday gates ordinary generation.
- **Implemented Truth:** String table aligns with `getDay()`.
- **Experienced Truth:** Weekend display remains unexplained.
- **Reasoning:** No indexing mismatch found.
- **Consequence:** RC-A unconfirmed.
- **Regression Requirement:** DF006-REG-01.
- **Remaining Question:** None in direct path.

### DF006-DEC-06 — Cycle Alignment

- **Decision:** Preserve repeating sequence as candidate boundary only.
- **Evidence:** Explicit all-days sequence emits weekend blocks; manual cycle does not.
- **Intended Truth:** Cycle authority must be explicit/explainable.
- **Implemented Truth:** Sequence days bypass `workDays`.
- **Experienced Truth:** Cycle configuration unknown.
- **Reasoning:** Mechanism exists but linkage does not.
- **Consequence:** RC-B candidate, not root cause.
- **Regression Requirement:** DF006-REG-05/10.
- **Remaining Question:** Dogfood cycle mode/entries.

### DF006-DEC-07 — Planning Range

- **Decision:** Reject tested range-start offset hypothesis.
- **Evidence:** Padding changed only included eligible Friday.
- **Intended Truth:** Overlap invariance.
- **Implemented Truth:** Overlap stable.
- **Experienced Truth:** Broad exact range unknown.
- **Reasoning:** Current arithmetic is date-based.
- **Consequence:** RC-C unconfirmed.
- **Regression Requirement:** DF006-REG-03.
- **Remaining Question:** Exact historical range.

### DF006-DEC-08 — Week Start

- **Decision:** Reject tested week-start recurrence hypothesis.
- **Evidence:** Only grid ordering changed.
- **Intended Truth:** Presentation preference is not recurrence.
- **Implemented Truth:** Zero weekend tokens under both anchors.
- **Experienced Truth:** Preference unknown.
- **Reasoning:** Shared weekday mapping is consistent.
- **Consequence:** No week-start defect.
- **Regression Requirement:** DF006-REG-04.
- **Remaining Question:** None material.

### DF006-DEC-09 — Canonical User Day

- **Decision:** Reject boundary cause for tested daytime controls.
- **Evidence:** Start and user-day dates match under `00:00`/`03:00`.
- **Intended Truth:** Non-overnight weekday work remains owned correctly.
- **Implemented Truth:** Stable.
- **Experienced Truth:** Exact time/boundary absent.
- **Reasoning:** No crossover in supplied condition.
- **Consequence:** RC-D unconfirmed.
- **Regression Requirement:** DF006-REG-01/07.
- **Remaining Question:** Exact historical time/boundary.

### DF006-DEC-10 — Multiple Shifts

- **Decision:** Reject multiplicity alone.
- **Evidence:** One/one/both emit zero weekend blocks.
- **Intended Truth:** Independent sources retain dates.
- **Implemented Truth:** Definition order does not move dates.
- **Experienced Truth:** Two definitions existed.
- **Reasoning:** Current combination is additive only.
- **Consequence:** No multiplicity defect.
- **Regression Requirement:** DF006-REG-02.
- **Remaining Question:** Their cycle assignments.

### DF006-DEC-11 — Broad Range

- **Decision:** Reject current accumulated-offset hypothesis.
- **Evidence:** Year/narrow overlap identical.
- **Intended Truth:** Range-overlap consistency.
- **Implemented Truth:** Consistent.
- **Experienced Truth:** Broad exact bounds absent.
- **Reasoning:** No drift observed.
- **Consequence:** No current RC-C evidence.
- **Regression Requirement:** DF006-REG-06.
- **Remaining Question:** Exact bounds.

### DF006-DEC-12 — Stale Preview

- **Decision:** Retain stale mismatch as unproven candidate.
- **Evidence:** Current edits retain Preview marked stale.
- **Intended Truth:** Stale output is nonauthoritative and visible as stale.
- **Implemented Truth:** Month exposes stale coverage.
- **Experienced Truth:** Freshness marker unknown.
- **Reasoning:** Mechanism fits but evidence cannot select it.
- **Consequence:** RC-H candidate only.
- **Regression Requirement:** DF006-REG-09.
- **Remaining Question:** Screenshot stale indicator/generated time.

### DF006-DEC-13 — Root Cause

- **Decision:** Assign no primary RC class.
- **Evidence:** No exact failing reproduction.
- **Intended Truth:** Root cause requires causal evidence.
- **Implemented Truth:** Candidate RC-B and RC-H differ materially.
- **Experienced Truth:** Symptom confirmed.
- **Reasoning:** Choosing one would speculate.
- **Consequence:** State recovery required.
- **Regression Requirement:** All section 40 requirements.
- **Remaining Question:** Cycle and Preview payload.

### DF006-DEC-14 — Severity

- **Decision:** Reassess to S1 pending recovery.
- **Evidence:** Potential schedule-authority contamination.
- **Intended Truth:** Work is hard authority.
- **Implemented Truth:** Current controls are clean.
- **Experienced Truth:** Weekend Work was shown.
- **Reasoning:** Unbounded authority risk precludes S3.
- **Consequence:** Keep prominent, do not claim defect.
- **Regression Requirement:** DF006-REG-01.
- **Remaining Question:** Semantic versus derived-state scope.

### DF006-DEC-15 — Architecture Reopen

- **Decision:** Do not reopen architecture.
- **Evidence:** Intended invariant is unambiguous.
- **Intended Truth:** Weekday and cycle authority must be provenance-rich.
- **Implemented Truth:** Uncertainty is state/mechanism.
- **Experienced Truth:** Does not make intended answer ambiguous.
- **Reasoning:** This is reproduction evidence.
- **Consequence:** No architecture work.
- **Regression Requirement:** DF006-REG-10.
- **Remaining Question:** None architectural.

### DF006-DEC-16 — Alignment Consequence

- **Decision:** Carry uncertainty and recovery key, not a fix.
- **Evidence:** Candidate boundaries bounded; cause unselected.
- **Intended Truth:** Alignment uses evidence, not guesses.
- **Implemented Truth:** Current controls pass.
- **Experienced Truth:** Prior closure invalidated.
- **Reasoning:** Avoid both dismissal and speculative tasking.
- **Consequence:** Recover state first.
- **Regression Requirement:** Section 40.
- **Remaining Question:** Exact historical source state.

### DF006-DEC-17 — Final Classification

- **Decision:** Classify DF-006 as BR6.
- **Evidence:** Critical cycle/date/Preview state absent.
- **Intended Truth:** Exact condition must be tested.
- **Implemented Truth:** Nearest reconstruction passes.
- **Experienced Truth:** Screenshot symptom confirmed.
- **Reasoning:** Neither validity nor current defect is proven.
- **Consequence:** Supersedes prior BR3 for DF-006.
- **Regression Requirement:** Section 40.
- **Remaining Question:** Exact replay state.

### DF006-DEC-18 — Reproduction Closure

- **Decision:** Close as DF006-C5 and select Path C.
- **Evidence:** One exact state package would discriminate RC-B/RC-H/other.
- **Intended Truth:** Do not continue broad speculation.
- **Implemented Truth:** Tested paths are deterministic.
- **Experienced Truth:** Anomaly remains historically credible.
- **Reasoning:** Missing state is specific and material.
- **Consequence:** State recovery, without beginning it here.
- **Regression Requirement:** Preserve all listed controls.
- **Remaining Question:** Dogfood setup/Preview/screenshot detail package.

## 46. Validation

Targeted existing tests:

```text
npm test -- --run src/core/shifts/__tests__/generateWorkBlocks.test.ts src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts src/core/time/__tests__/canonicalUserDay.test.ts src/core/engine/tests/generateSchedulePreview.test.ts src/core/monthlyPlanner/queryMonthlyPlanner.test.ts src/state/tests/dayFrameStore.test.ts src/ui/tests/MonthlyPlannerSurface.test.tsx
```

Result: **7 files passed; 233 tests passed; 0 failed**.

Temporary reproduction:

```text
./node_modules/.bin/tsc --outDir /tmp/df006-addendum-build --noEmit false --declaration false --sourceMap false
node /tmp/df006-addendum-repro.mjs
```

The first Node attempt used the wrong compiled-root path and failed before executing a reproduction; imports were corrected in the temporary script and the reported run passed. Outputs: direct cases 5/5 weekday blocks, combined 10 weekday blocks, manual narrow/broad overlap 5 identical weekday blocks, zero weekend Month tokens under both week starts, stale coverage explicitly marked, and the explicit all-days repeating sequence generated canonical weekend blocks. Repetition was identical.

## 47. Repository Modification Verification

The sole repository write made for this addendum is `docs/audits/DF_006_TARGETED_REPRODUCTION_ADDENDUM_RESULT.md`. The earlier targeted result remained unchanged. Pre-existing working-tree modifications and untracked files were not touched. No production, test, architecture, governance, or roadmap file was modified. Temporary compilation/script artifacts were removed after evidence capture.

## 48. Result Closure

**DF006-C5 — Additional State Recovery Required.** The screenshot evidence corrects the prior causal story, but an exact replay requires the missing Dogfood cycle/rotation configuration, anomalous date and occurrence identity, and Preview freshness/payload.

## 49. Recommended Next Step

**Path C — State Recovery.** Recover the original or screenshot-correlated setup/profile/backup plus Preview metadata and exact anomalous date. Do not begin implementation alignment or a defect fix from the current incomplete causal record.

## 50. Conclusions

The current direct/manual Work and Month paths behave correctly under the reconstructed Mon–Fri/non-overnight constraints. The earlier overnight story is no longer an explanation of `DF-006`. Explicit repeating-sequence authority and stale derived state are concrete, distinguishable candidate mechanisms, but neither can be tied to Experienced Truth without the missing state. Epistemic correction therefore requires superseding BR3 while resisting an unsupported defect claim.

## 51. Completion Statement

**DF-006 Targeted Reproduction Addendum complete.**

The addendum reopens DF-006 in response to recovered Dogfood screenshot evidence demonstrating a Monday-through-Friday, non-overnight Work configuration inconsistent with the prior Saturday-overnight crossover explanation; preserves the earlier reproduction as a valid canonical user-day control without allowing it to overwrite the recovered Experienced Truth; reconstructs the demonstrated Work configuration and anomalous weekend planning state; traces Work from authored weekday authority through cycle expansion, generated Work, Preview projection, Month projection, and rendered calendar placement; tests weekday indexing, cycle anchors, planning-range boundaries, canonical user-day behavior, multiple-shift interaction, broad-range generation, stale Preview, and calendar-grid alignment as evidence requires; determines whether the anomaly originates in schedule semantics, derived-state projection, presentation, historical behavior, or another bounded mechanism; supersedes the prior DF-006 classification where warranted while preserving immutable audit history; states the resulting severity, regression requirements, downstream contamination risk, and Implementation Alignment consequence; and determines whether DayFrame may proceed to Implementation Alignment Strategy without modifying production code, tests, prior audits, architecture, governance, or the implementation roadmap.
