# DF-006 Final Technical Reproduction Result

## 1. Executive Final Result

The recovered screenshot state is internally inconsistent with the output of the screenshot-era executable pipeline. It shows Manual date ranges, saved Monday–Friday non-overnight shifts, a current Preview, and Saturday September 5 Work. Replaying the exact visible manual cycle through code byte-identical at `a3d89e3` and current HEAD produces no September 5 Work at direct generation, cycle generation, Preview, merge, or Month query. September 5 is a fresh generated-empty Month cell.

No supported draft/saved, repeating-sequence, or stale-Preview explanation survives: the screenshot says “All changes saved,” Manual mode, and “Schedule is up to date.” The screenshot therefore confirms an incorrect historical runtime state, but no executable layer reproduces it from the recoverable state. First-wrong layer is **L7 — historical runtime state cannot be reconstructed closely enough to localize a reproducing transformation**. Root cause is **DF006-RC7 — Historical Defect Confirmed, Exact Technical Layer Unresolved**. Classification is **BR5 — Historical Observation Confirmed, Current Reproduction Not Achieved**. Closure is **DF006-FINAL-C2 — Historical Defect Confirmed and Bounded**. Proceed by **Path A — Implementation Alignment Strategy** with regression/provenance constraints and no speculative code fix.

## 2. Scope

This final pass investigates only `DF-006`, uses the recovered manual cycle, and closes the investigation. It does not change production, tests, prior results, architecture, governance, or roadmap.

## 3. Governing Evidence

Evidence comprises the original ledger, reconciliation, targeted result, addendum, state-recovery result, new expanded screenshot, Phase 7 commit `a3d89e3`, current code, focused Git comparison, exact replay output, and targeted existing tests. The screenshot is Experienced Truth; replay is Implemented Truth.

## 4. Newly Recovered Manual-Cycle State

The screenshot establishes:

- mode: Manual date ranges;
- cycle: `2026 Second Half`, July 6, 2026 through January 4, 2027;
- Cycle Segment 1: Day Shift, July 6 through October 2, 2026;
- Cycle Segment 2: Evening Shift, October 5, 2026 through January 4, 2027;
- no segment preference overrides visible;
- September 5 lies inside Segment 1’s date interval;
- both shifts exclude weekends and do not cross midnight.

## 5. Historical Commit

`a3d89e3` remains the tightest supported code point: it was committed September 2, 2026, carries the visible Phase 7 UI, and is paired with the same-day Dogfood ledger. Focused `git diff --exit-code` confirms the relevant Work/cycle/Month/store/Planner source is byte-identical to current HEAD.

## 6. Historical Data Model

The historical `ShiftCycle` supports manual inclusive segments. A manual segment selects a shift for a dated window; it does not itself authorize every date. `generateManualSegmentWorkBlocks` clips the window and delegates to `generateWorkBlocks`, which enforces the shift’s string-enum `workDays`. Preview stores generated Work separately from scheduled Commitments/events and carries `isStale`.

## 7. Exact Work Definitions

| Definition | Time | Days | Overnight | ID |
| --- | --- | --- | ---: | --- |
| Day Shift | 05:45–14:15 | Monday–Friday | No | `shift_day` strongly inferred; screenshot ID not shown |
| Evening Shift | 13:45–22:15 | Monday–Friday | No | `shift_evening` strongly inferred; screenshot ID not shown |

Names, times, weekdays, and overnight state are recovered. IDs are semantic replay identifiers matching historical fixtures, not claimed screenshot IDs.

## 8. Exact Manual Segment Recovery

| Field | Value | Confidence |
| --- | --- | --- |
| Cycle name | 2026 Second Half | Recovered |
| Cycle mode | Manual date ranges | Recovered |
| Cycle start/end | 2026-07-06 / 2027-01-04 | Recovered |
| Segment 1 | Day Shift, 2026-07-06 / 2026-10-02 | Recovered |
| Segment 2 | Evening Shift, 2026-10-05 / 2027-01-04 | Recovered |
| Notes | blank in visible controls | Recovered |
| Preference overrides | unchecked/not enabled visibly | Recovered |
| Cycle/segment IDs | Not recovered | Not Recovered |

“Cycle Segment 1/2” are UI ordinals, not assumed authored names.

## 9. Historical Save/Draft Model

`DayFrameApp` maintains a SetupScreen draft separate from store-authored state. `hasUnsavedSetupChanges` drives `isSetupDirty`. SetupScreen renders “Unsaved changes” when dirty and “All changes saved” otherwise. `saveCurrentSetup` commits the draft through store mutation; authored change marks an existing current Preview stale. The Work editor reads draft; Preview status and Month read store/Preview authority.

## 10. Preview Freshness Semantics

“Schedule is up to date” maps to a non-stale Preview relative to saved authored state. Dirty state has higher-priority copy: “Plan has unsaved changes. Schedule actions continue to use the saved plan.” Thus current Preview alone would not prove the draft is saved, but combined with “All changes saved” it does.

## 11. Screenshot Dirty-State Analysis

The expanded Work Pattern screenshot visibly shows “All changes saved.” The Planner header shows “Schedule is up to date.” Save Setup is present, but no pending-change count or unsaved warning appears. Therefore the visible Mon–Fri/manual configuration is represented as saved, not as an unsaved draft. Confidence: high.

## 12. Historical Authored-State Reconstruction

The replay uses the exact visible names, times, weekdays, overnight flags, manual mode, cycle/segment dates, annual January 1–December 31 Preview range, Monday week start, and a neutral 03:00 boundary. The boundary is not visible, but both shifts start well after it; it cannot change Saturday eligibility. Historical-only IDs/timestamps were supplied as nonsemantic identifiers.

## 13. Historical Replay

The relevant `a3d89e3` production files are byte-identical to HEAD. They were compiled from the working source and executed as a historical-equivalence replay with exact recovered semantics. Direct, manual-cycle, full Preview, and Month outputs contain no September 5 Work.

## 14. Current Replay

The same execution is the current replay because the relevant source has no diff. Result is identical: September 4 Day Shift and September 7 Day Shift surround an empty Saturday; no current defect reproduces.

## 15. Manual Cycle Expansion

`generateCycleWorkBlocks` emits:

- `work_shift_day_2026-09-04`, Friday, Segment 1;
- no September 5 or September 6 block;
- `work_shift_day_2026-09-07`, Monday, Segment 1.

Segment inclusivity correctly makes September 5 eligible for consideration, but `workDays` rejects it.

## 16. Direct Work Generation

Direct `generateWorkBlocks` over Segment 1 produces the same Friday/Monday pair and no Saturday/Sunday block. This rejects an underlying historical/current weekday-filter defect for the recovered input.

## 17. Preview `generatedWorkBlocks`

`generateSchedulePreview` expands the annual planning window and calls manual-cycle generation. Its `generatedWorkBlocks` contains September 4 and 7 with exact cycle/segment provenance and no September 5 entry.

## 18. Preview Merge Analysis

With no unrelated authored items in the minimal replay, September 5 has no scheduled block, candidate, unplaced candidate, or friction record. Work is never synthesized from those collections. The Month Work branch reads only `generatedWorkBlocks`; no merge defect reproduced.

## 19. Month Query Analysis

`queryMonthlyPlanner` indexes Work by `userDayDate`. September 5 returns `counts.work=0`, empty `evidence`, empty `tokens`, and `{kind: "coveredFresh", generatedEmpty: true}`. No query/projection defect reproduces.

## 20. Month Rendering Analysis

The rendering surface consumes each query cell’s tokens and counts; it does not independently generate Work. Since the replayed September 5 cell has no token, rendering cannot show Work for this state. Existing UI tests confirm query-token rendering and grid mapping. No rendering defect reproduces; the screenshot/runtime mismatch remains outside the recoverable snapshot.

## 21. September 5 Trace

The historical helper identifies `2026-09-05` as Saturday. It is inside Segment 1 but absent at every produced-data layer. No `work_<shift>_2026-09-05` identity exists. The screenshot nevertheless presents Work on that date, establishing the historical mismatch.

## 22. Draft-vs-Saved Analysis

The hypothetical chain “weekend-enabled saved state → current Preview → unsaved Mon–Fri draft” would require the screenshot to show dirty/pending state. It shows “All changes saved.” Historical UI computes that phrase from semantic draft/store equality. RC6 is rejected for the captured state.

## 23. Repeating-Sequence Rejection

The expanded control explicitly says Manual date ranges. No repeating sequence branch is active. It is removed from the candidate set.

## 24. Stale-Preview Rejection

The Planner explicitly says up to date; Month coverage is current. Historical stale state would show mandatory refresh/unsaved messaging. Stale Preview is removed from the candidate set.

## 25. Candidate Root-Cause Matrix

| Candidate | Supported? | Rejected? | Evidence | Confidence |
| --- | ---: | ---: | --- | --- |
| Manual-cycle generation bug | Historical screenshot only | Current/historical replay rejects | no Sep 5 generated block | High replay confidence |
| Weekday filtering bug | No | Yes for recovered state | direct replay excludes Saturday | High |
| Preview merge bug | No | Yes for recovered state | all Sep 5 collections empty | High |
| Month projection bug | No | Yes for recovered state | fresh empty query cell | High |
| Month rendering bug | Historical symptom only | Executable replay cannot reach token | renderer consumes empty tokens | Medium-high |
| Unsaved draft/saved mismatch | No | Yes | “All changes saved” + historical semantics | High |
| Repeating sequence | No | Yes | Manual mode recovered | High |
| Stale Preview | No | Yes | current/up-to-date wording | High |
| Unpreserved runtime/state discrepancy | Yes | No | screenshot contradicts replay-equivalent state | High historical, sublayer unknown |

## 26. First-Wrong-Layer Decision

**L7 — historical state cannot be reconstructed closely enough to reproduce the wrong transformation.** Authored visible state is correct and every reconstructable downstream layer remains correct. The screenshot proves some additional historical runtime fact existed, but no persisted Preview/store snapshot survives to place it at L1–L6. “No wrong layer reproduced” is therefore the operational result.

## 27. Root Cause Classification

**DF006-RC7 — Historical Defect Confirmed, Exact Technical Layer Unresolved.** The saved/current screenshot combination contradicts intended and historical executable semantics, establishing a defect in the historical runtime experience. Its precise state/projection/render sublayer cannot be recovered.

## 28. DF-006 Final Classification

**BR5 — Historical Observation Confirmed, Current Reproduction Not Achieved.** Exact current and historical-equivalent replay is correct. No intervening code correction supports BR4, and no current failure supports BR1/BR2.

## 29. Historical vs Current Status

The issue is **historical-only in available evidence and not reproducible** at either `a3d89e3`’s relevant code or current HEAD using recovered semantic state. Relevant code has not changed. The historical screenshot remains credible evidence of a state-dependent runtime defect whose extra state was not preserved.

## 30. Severity Reassessment

Reassess from provisional S1 to **S2**. The screenshot represented incorrect schedule authority and seriously harms trust, but replay finds no current semantic contamination and cannot prove the bad token existed upstream rather than in historical runtime presentation/state. Alignment should retain high-priority regression/provenance coverage without treating this as a reproduced current hard-authority defect.

## 31. Downstream Contamination

No contamination occurs in the replay: Work, Preview, Friction, Month, publication/execution inputs, future Capacity, and Goal planning receive no September 5 block. The historical screenshot cannot establish whether the original bad item contaminated these domains or stopped at Month/runtime presentation. Preserve both regression boundaries.

## 32. Product / UX Implication

Even absent a current reproduction, simultaneous “All changes saved,” “Schedule is up to date,” and contradictory Work erodes authority legibility. Surfaces need auditable source/cycle/date provenance and unmistakable draft/current relationships. This is an alignment implication, not a redesign here.

## 33. Architecture Reopen Check

**No.** Architecture already separates draft, saved authored authority, derived Preview, freshness, occurrence provenance, and Month evidence. The mismatch is historical implementation/state behavior, not intended-truth ambiguity.

## 34. Implementation Alignment Handoff

Carry:

- DF006-RC7 / BR5 / historical-only nonreproduction;
- exact September 5 recovered fixture and L7 boundary;
- affected surfaces: Setup/Work Pattern state, manual cycle generation, Preview freshness/provenance, Month evidence/rendering;
- no speculative production correction;
- S2 trust risk;
- regression requirements below;
- requirement that any future failure stop at and expose the first wrong provenance layer.

## 35. Regression Requirements

Retain `DF006-REG-01` through `DF006-REG-13` from predecessor results, including weekday exclusion, multi-shift, range/week-start/cycle/broad-range invariance, crossover distinction, Month placement, freshness, and cycle authority provenance.

Add:

- **DF006-REG-14:** Current means current relative to saved authored state, not merely coexisting with a draft.
- **DF006-REG-15:** A materially different unsaved Work draft must be unmistakable.
- **DF006-REG-16:** Month must not imply its schedule reflects unsaved Work edits.
- **DF006-REG-17:** Manual cycle Work must respect its selected shift’s weekdays unless a separate explicit authority exists.

## 36. End-to-End Trace Table

| Layer | September 5 State | Correct? | Source | Notes |
| --- | --- | ---: | --- | --- |
| Visible Work draft | Mon–Fri Day Shift | Yes | screenshot | no Saturday |
| Saved authored Work | Equal to draft | Yes | “All changes saved” semantics | serialized object absent |
| Manual cycle segment | Segment 1 spans Sep 5 | Yes | screenshot | range inclusion is not weekday authority |
| Direct Work generation | no block | Yes | exact replay | Fri 4 / Mon 7 only |
| Cycle Work generation | no block | Yes | exact replay | manual wrapper preserves filter |
| Preview generatedWorkBlocks | no block | Yes | full pipeline replay | fresh Preview |
| Preview scheduled/merged state | no Work-like item | Yes | collection inspection | all empty for Sep 5 |
| Month query | work=0, empty tokens | Yes | query replay | coveredFresh/generatedEmpty |
| Rendered Month cell | screenshot shows Work; replay model cannot | No historically | screenshot versus renderer contract | no reproducible first transformation |

## 37. Draft-vs-Saved Matrix

| Concern | Draft | Saved Authored State | Preview |
| --- | --- | --- | --- |
| Work weekdays | Mon–Fri | Mon–Fri, inferred from equality | derived from saved authority |
| Cycle mode | Manual | Manual, inferred from equality | manual generation path |
| Segment dates | visible exact dates | equal to draft | generated across those dates |
| Freshness relationship | no pending difference | authoritative | current/up to date |
| Visible in screenshot? | Yes | status/equality only | Yes, current |

## 38. Final Candidate Matrix

| Candidate | Supported? | Rejected? | Evidence | Confidence |
| --- | ---: | ---: | --- | --- |
| Manual-cycle generation bug | Not currently | Yes in replay | exact manual output | High |
| Weekday filtering bug | No | Yes | direct output | High |
| Preview merge bug | No | Yes | empty collections | High |
| Month projection bug | No | Yes | empty Sep 5 cell | High |
| Month rendering bug | Only historical symptom | Not localizable | screenshot/replay mismatch | Medium |
| Unsaved draft/saved mismatch | No | Yes | all changes saved | High |
| Repeating sequence | No | Yes | Manual mode | High |
| Stale Preview | No | Yes | up-to-date/current | High |
| Unpreserved historical defect | Yes | No | internally inconsistent screenshot/replay | High |

## 39. Final Decisions

### DF006-FINAL-DEC-01 — Manual Mode
- **Decision:** Confirm Manual date ranges.
- **Evidence:** expanded screenshot.
- **Experienced Truth:** manual cycle active.
- **Historical Implemented Truth:** manual delegates to weekday filter.
- **Current Implemented Truth:** unchanged.
- **Intended Truth:** manual range does not erase weekdays.
- **Reasoning:** direct visible control.
- **Consequence:** reject repeating sequence.
- **Regression Requirement:** REG-17.
- **Remaining Question:** none.

### DF006-FINAL-DEC-02 — Exact Segment
- **Decision:** Recover Segment 1 as 2026-07-06–2026-10-02 Day Shift.
- **Evidence:** screenshot fields.
- **Experienced Truth:** Sep 5 is in range.
- **Historical Implemented Truth:** inclusive clipping.
- **Current Implemented Truth:** same.
- **Intended Truth:** weekday filter still applies.
- **Reasoning:** dates legible.
- **Consequence:** exact replay possible.
- **Regression Requirement:** REG-17.
- **Remaining Question:** IDs only.

### DF006-FINAL-DEC-03 — Saved vs Draft
- **Decision:** Treat visible draft as equal to saved state.
- **Evidence:** “All changes saved.”
- **Experienced Truth:** no dirty warning.
- **Historical Implemented Truth:** copy follows semantic equality.
- **Current Implemented Truth:** same.
- **Intended Truth:** status must expose authority.
- **Reasoning:** deterministic UI mapping.
- **Consequence:** reject RC6.
- **Regression Requirement:** REG-14–16.
- **Remaining Question:** raw state absent.

### DF006-FINAL-DEC-04 — Save Semantics
- **Decision:** Saving commits draft and stales prior Preview.
- **Evidence:** historical UI/store trace.
- **Experienced Truth:** saved and later current.
- **Historical Implemented Truth:** authored mutation marks stale.
- **Current Implemented Truth:** unchanged.
- **Intended Truth:** derived state follows saved authority.
- **Reasoning:** source trace.
- **Consequence:** current Preview implies regeneration/equality.
- **Regression Requirement:** REG-14.
- **Remaining Question:** click chronology unnecessary.

### DF006-FINAL-DEC-05 — Freshness Meaning
- **Decision:** Accept Preview as current relative to saved setup.
- **Evidence:** up-to-date copy and no dirty override.
- **Experienced Truth:** current schedule shown.
- **Historical Implemented Truth:** stale/dirty strings differ.
- **Current Implemented Truth:** same.
- **Intended Truth:** current is explicit.
- **Reasoning:** combined status evidence.
- **Consequence:** reject stale route.
- **Regression Requirement:** REG-13/14.
- **Remaining Question:** none material.

### DF006-FINAL-DEC-06 — Direct September 5
- **Decision:** No block.
- **Evidence:** exact replay.
- **Experienced Truth:** screenshot shows Work.
- **Historical Implemented Truth:** Saturday rejected.
- **Current Implemented Truth:** rejected.
- **Intended Truth:** correct.
- **Reasoning:** `workDays.includes(saturday)` false.
- **Consequence:** no weekday defect reproduction.
- **Regression Requirement:** REG-01/17.
- **Remaining Question:** historical runtime extra state.

### DF006-FINAL-DEC-07 — Cycle September 5
- **Decision:** No block.
- **Evidence:** exact manual replay.
- **Experienced Truth:** Segment 1 spans date.
- **Historical Implemented Truth:** delegates and rejects.
- **Current Implemented Truth:** same.
- **Intended Truth:** correct.
- **Reasoning:** range membership is not Work-day membership.
- **Consequence:** no manual wrapper defect reproduction.
- **Regression Requirement:** REG-05/17.
- **Remaining Question:** original serialized state.

### DF006-FINAL-DEC-08 — Preview Work
- **Decision:** No generated block.
- **Evidence:** full Preview output.
- **Experienced Truth:** displayed Work mismatch.
- **Historical Implemented Truth:** clean output.
- **Current Implemented Truth:** clean.
- **Intended Truth:** correct.
- **Reasoning:** generated source is absent.
- **Consequence:** no upstream contamination in replay.
- **Regression Requirement:** REG-01.
- **Remaining Question:** original Preview payload.

### DF006-FINAL-DEC-09 — Month Query
- **Decision:** September 5 is fresh empty.
- **Evidence:** work=0/evidence=[]/tokens=[].
- **Experienced Truth:** screenshot differs.
- **Historical Implemented Truth:** query indexes by user-day.
- **Current Implemented Truth:** same.
- **Intended Truth:** correct.
- **Reasoning:** no source to index.
- **Consequence:** no projection defect reproduction.
- **Regression Requirement:** REG-08.
- **Remaining Question:** historical runtime query input.

### DF006-FINAL-DEC-10 — Rendered Cell
- **Decision:** Record historical mismatch, not a reproduced renderer defect.
- **Evidence:** screenshot versus empty query model.
- **Experienced Truth:** Work visible.
- **Historical Implemented Truth:** renderer consumes tokens.
- **Current Implemented Truth:** same.
- **Intended Truth:** empty model renders no Work.
- **Reasoning:** input snapshot absent.
- **Consequence:** sublayer unresolved.
- **Regression Requirement:** REG-08/10.
- **Remaining Question:** original component props/state.

### DF006-FINAL-DEC-11 — Draft/Saved Hypothesis
- **Decision:** Reject.
- **Evidence:** equality and current status.
- **Experienced Truth:** saved UI state.
- **Historical Implemented Truth:** dirty copy would appear.
- **Current Implemented Truth:** same.
- **Intended Truth:** draft distinction visible.
- **Reasoning:** necessary predicate absent.
- **Consequence:** no RC6/RC8.
- **Regression Requirement:** REG-14–16.
- **Remaining Question:** none material.

### DF006-FINAL-DEC-12 — Repeating Sequence
- **Decision:** Reject.
- **Evidence:** Manual mode.
- **Experienced Truth:** no sequence active.
- **Historical Implemented Truth:** branch exclusive.
- **Current Implemented Truth:** same.
- **Intended Truth:** explicit modes.
- **Reasoning:** recovered control.
- **Consequence:** remove prior candidate.
- **Regression Requirement:** REG-11/12 retained generally.
- **Remaining Question:** none.

### DF006-FINAL-DEC-13 — Stale Preview
- **Decision:** Reject.
- **Evidence:** up-to-date/current wording.
- **Experienced Truth:** fresh state.
- **Historical Implemented Truth:** stale warning mandatory.
- **Current Implemented Truth:** same.
- **Intended Truth:** freshness explicit.
- **Reasoning:** recovered state.
- **Consequence:** remove prior candidate.
- **Regression Requirement:** REG-09/13.
- **Remaining Question:** none.

### DF006-FINAL-DEC-14 — First Wrong Layer
- **Decision:** Select L7; no executable wrong layer reproduced.
- **Evidence:** L1-visible state correct; L2–L6 replay correct.
- **Experienced Truth:** historical cell wrong.
- **Historical Implemented Truth:** requires missing runtime snapshot.
- **Current Implemented Truth:** correct.
- **Intended Truth:** clear.
- **Reasoning:** cannot fabricate transition.
- **Consequence:** bounded unresolved sublayer.
- **Regression Requirement:** REG-10.
- **Remaining Question:** original store/Preview/component state.

### DF006-FINAL-DEC-15 — Root Cause
- **Decision:** DF006-RC7.
- **Evidence:** confirmed screenshot contradiction without replay.
- **Experienced Truth:** defect occurred.
- **Historical Implemented Truth:** source alone does not reproduce.
- **Current Implemented Truth:** no defect.
- **Intended Truth:** screenshot behavior invalid.
- **Reasoning:** best terminating classification.
- **Consequence:** align without speculative fix.
- **Regression Requirement:** REG-01–17.
- **Remaining Question:** exact historical sublayer.

### DF006-FINAL-DEC-16 — Historical/Current Status
- **Decision:** Historical-only, state-dependent, nonreproducible.
- **Evidence:** unchanged code plus exact replay.
- **Experienced Truth:** screenshot historical.
- **Historical Implemented Truth:** reconstructed semantics correct.
- **Current Implemented Truth:** correct.
- **Intended Truth:** correct.
- **Reasoning:** extra runtime state not preserved.
- **Consequence:** no current confirmed defect.
- **Regression Requirement:** full fixture preservation.
- **Remaining Question:** none blocking alignment.

### DF006-FINAL-DEC-17 — Severity
- **Decision:** Set S2.
- **Evidence:** trust failure without current contamination proof.
- **Experienced Truth:** authoritative-looking contradiction.
- **Historical Implemented Truth:** scope unknown.
- **Current Implemented Truth:** clean.
- **Intended Truth:** hard authority must be reliable.
- **Reasoning:** high impact, reduced current likelihood.
- **Consequence:** retain prominent regression coverage.
- **Regression Requirement:** REG-01/08/10.
- **Remaining Question:** historical contamination extent.

### DF006-FINAL-DEC-18 — Downstream Contamination
- **Decision:** None in replay; historical extent unknown.
- **Evidence:** no Sep 5 source/item.
- **Experienced Truth:** Month alone proven.
- **Historical Implemented Truth:** bad source could propagate if present.
- **Current Implemented Truth:** no source.
- **Intended Truth:** provenance bounds propagation.
- **Reasoning:** distinguish observed from possible.
- **Consequence:** cover semantic and rendering gates.
- **Regression Requirement:** REG-01/08.
- **Remaining Question:** original Preview payload.

### DF006-FINAL-DEC-19 — Architecture
- **Decision:** Do not reopen.
- **Evidence:** intended invariant unambiguous.
- **Experienced Truth:** implementation/state anomaly.
- **Historical Implemented Truth:** model sufficient.
- **Current Implemented Truth:** correct replay.
- **Intended Truth:** already defined.
- **Reasoning:** no normative conflict.
- **Consequence:** alignment path.
- **Regression Requirement:** REG-10.
- **Remaining Question:** none.

### DF006-FINAL-DEC-20 — Alignment Handoff
- **Decision:** Carry RC7/BR5 and constraints, no speculative correction.
- **Evidence:** bounded final evidence.
- **Experienced Truth:** preserved.
- **Historical Implemented Truth:** exact sublayer absent.
- **Current Implemented Truth:** passes.
- **Intended Truth:** clear.
- **Reasoning:** terminate responsibly.
- **Consequence:** Path A.
- **Regression Requirement:** REG-01–17.
- **Remaining Question:** nonblocking archaeology only.

### DF006-FINAL-DEC-21 — Final Classification
- **Decision:** Select BR5.
- **Evidence:** historical screenshot confirmed; current replay clean.
- **Experienced Truth:** observation stands.
- **Historical Implemented Truth:** not reproducible.
- **Current Implemented Truth:** not reproducible.
- **Intended Truth:** behavior invalid.
- **Reasoning:** neither valid nor currently defective.
- **Consequence:** preserve historical evidence.
- **Regression Requirement:** all.
- **Remaining Question:** none blocking.

### DF006-FINAL-DEC-22 — Closure
- **Decision:** DF006-FINAL-C2; Path A.
- **Evidence:** incorrect experience certain, technical uncertainty bounded.
- **Experienced Truth:** confirmed defect symptom.
- **Historical Implemented Truth:** sublayer unresolved.
- **Current Implemented Truth:** correct.
- **Intended Truth:** sufficient for alignment.
- **Reasoning:** further broad investigation has no durable state.
- **Consequence:** close DF-006 investigation.
- **Regression Requirement:** REG-01–17.
- **Remaining Question:** none required before alignment.

## 40. Validation

Replay commands:

```text
./node_modules/.bin/tsc --outDir /tmp/df006-final-build --noEmit false --declaration false --sourceMap false
node /tmp/df006-final-repro.mjs
```

Results: September 5 classified `saturday`; direct Work absent; manual-cycle Work absent; Preview generated Work absent; scheduled/candidate/unplaced/friction collections empty; Month work count zero, evidence/tokens empty, coverage fresh/generated-empty. September 4 and 7 identities/provenance were correct.

Targeted tests:

```text
npm test -- --run src/core/shifts/__tests__/generateWorkBlocks.test.ts src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts src/core/engine/tests/generateSchedulePreview.test.ts src/core/monthlyPlanner/queryMonthlyPlanner.test.ts src/state/tests/dayFrameStore.test.ts src/ui/tests/MonthlyPlannerSurface.test.tsx src/ui/tests/DayFrameApp.test.tsx
```

Result: **7 files passed; 348 tests passed; 0 failed**. Incidental `sed` probes used repository-prefixed paths while already in `code/` and reported path-not-found before the tests; this did not affect validation.

Historical equivalence:

```text
git diff --exit-code a3d89e3 -- <relevant Work/cycle/Month/Planner/store files>
```

Result: exit 0. The historical and current September 5 replays are semantically identical.

## 41. Repository Modification Verification

The required `docs/audits/DF_006_FINAL_TECHNICAL_REPRODUCTION_RESULT.md` is the sole repository write for this task. All predecessor artifacts remain immutable. Existing unrelated working-tree changes were untouched. No production, test, architecture, governance, or roadmap file changed. Temporary build and replay files were removed.

## 42. Final Closure

**DF006-FINAL-C2 — Historical Defect Confirmed and Bounded.** The screenshot establishes incorrect historical behavior; the exact runtime sublayer cannot be reconstructed, but current/historical-equivalent code, state semantics, candidate rejection, impact, and regression surface are sufficiently bounded for alignment.

## 43. Recommended Next Step

**Path A — Implementation Alignment Strategy.** Carry this result as a historical regression/provenance constraint. Do not begin the strategy in this task.

## 44. Conclusions

The final recovered manual state does not generate September 5 Work in any executable layer. The screenshot’s saved/current indicators reject draft mismatch and stale state, while Manual mode rejects sequence authority. DF-006 is therefore a real historical experience but not a current reproduced defect. Its precise runtime transformation is unrecoverable without the original store/Preview/component snapshot; that uncertainty is bounded and no longer justifies delaying implementation alignment.

## 45. Completion Statement

**DF-006 Final Technical Reproduction complete.**

The final reproduction uses the recovered Manual date-range Work Schedule, exact Monday-through-Friday non-overnight Day and Evening shifts, fresh September 2026 Preview state, and Saturday September 5 weekend-Work observation to trace the anomaly through historical saved authored state, visible Work draft state, manual cycle expansion, ordinary Work generation, Preview generated and merged data, Month query, and rendered calendar evidence; explicitly rejects the previously eliminated repeating-sequence and stale-Preview explanations unless new contradictory evidence appears; investigates whether the visible Mon–Fri editor represented unsaved draft state while the current Preview remained valid relative to different saved authority; identifies the first layer at which September 5 becomes incorrect or establishes that the screenshot is validly explained by draft/saved state; classifies the resulting historical/current behavior, severity, downstream contamination risk, UX/provenance implications, regression requirements, and Implementation Alignment consequence; preserves all prior audit artifacts as immutable evidence; and closes the DF-006 investigation so DayFrame can proceed to Implementation Alignment Strategy without another broad reproduction or architecture pass.
