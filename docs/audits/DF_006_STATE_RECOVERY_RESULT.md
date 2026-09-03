# DF-006 State Recovery Result

## 1. Executive Recovery Result

State recovery materially narrowed `DF-006` but did not recover the decisive cycle assignments. The screenshots and repository evidence recover the likely Dogfood commit, exact shifts, annual Preview range, Monday-first Month, a fresh/current Preview presentation, selected September 2 Day Shift occurrence, and at least one weekend Work cell on Saturday, September 5, 2026. Historical and current direct weekday generation produce no weekend Work. The same historical/current cycle engine can produce September 5 Work only when repeating-sequence authority explicitly assigns a shift to that cycle day.

RC-H is now contradicted by visible “Schedule is up to date”/current coverage and the historical UI’s mandatory stale warning. RC-B remains plausible but unconfirmed because Advanced Work Schedule is collapsed and no profile/export preserves its mode, anchor, or entries. Root-cause decision: **SR-RC4 — Historical Observation Confirmed, Cause Still Ambiguous**. DF-006 remains **BR6 — Exact Reproduction Still Blocked**. Closure: **DF006-SR-C4 — Recovery Improved but Cause Remains Ambiguous**. Next gate: **Path B — One Final Bounded Technical Reproduction** using the original expanded cycle state or exported setup.

## 2. Scope

Only historical state needed to distinguish repeating-cycle authority, stale Preview, or another bounded mechanism was investigated. No defect was fixed; production, tests, prior audits, architecture, governance, and roadmap remain unchanged.

## 3. Governing History

The original ledger recorded Sunday Work without a cause. Reconciliation retained it as S1/Needs Reproduction. The first reproduction incorrectly promoted an overnight control to the causal explanation. The addendum superseded that BR3 after Mon–Fri/non-overnight screenshots emerged and selected state recovery. This result preserves all prior artifacts and adds the recovered state.

## 4. Source Inventory

- User-supplied screenshots rendered in this conversation; no image file was exposed in the attachment directory.
- `DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md` dated 2026-09-02.
- The reconciliation, targeted reproduction, and addendum result artifacts.
- `POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`, `CURRENT_STATE.md`, and `CHANGELOG.md`.
- Archived data-model/workflow examples.
- Phase 7 commit `a3d89e3` and focused Git history.
- Historical/current Work, cycle, Preview, profile, persistence, and Month code/tests.
- Repository-wide searches for JSON, screenshots, setup exports, storage dumps, IDs, dates, and shift names.

Image access limitation: the screenshots were visually inspectable in the conversation, but no original-resolution file was available to tooling. Small token text that could not be read reliably is marked unknown.

## 5. Recovery Method

Evidence priority followed the brief: Dogfood notes and screenshots, repository artifacts, Git history, historical code, then current compatibility. Screenshot anchors were mapped onto a Monday-first September 2026 grid. Historical and current source identity was checked with `git diff`. A temporary current-code replay used only recovered semantic values; an invented repeating sequence was explicitly isolated as a mechanism control, not original state.

## 6. Screenshot Evidence

Recovered visually/textually:

- Day Shift: 05:45–14:15, Monday–Friday, non-overnight.
- Evening Shift: 13:45–22:15, Monday–Friday, non-overnight.
- annual generated range: January 1–December 31, 2026.
- September 2026 Month with Monday-through-Sunday columns.
- “Schedule is up to date” and current month coverage wording.
- selected Wednesday, September 2, with Day Shift Work in detail.
- Saturday, September 5 contains a Work token; its small shift label is not reliably readable.
- Advanced Work Schedule is collapsed, hiding cycle mode and entries.

Red badges/dots were treated as attention/friction, not automatically as Work.

## 7. Recovery Confidence Model

**Recovered** means directly visible or durable. **Strongly Inferred** means independent sources converge. **Plausible** means executable but not linked to original state. **Not Recovered** means evidence is inadequate.

## 8. Dogfood Commit / Commit Range

Likely commit: `a3d89e3` (“Completed Phase 7 Implementation and Dogfood Testing Pass 01”), committed 2026-09-02 09:25 CDT. Confidence: **Recovered/high**. The ledger is dated September 2, the screenshot exposes the converged Phase 7 Planner/Month/Work Pattern UI, and the next commit is later that day’s post-Phase-7 specification work. No smaller competing implementation range was found.

## 9. Historical Data Model

At `a3d89e3`, `ShiftDefinition` has string `workDays` and times; `ShiftCycle` supports `manualSegments` and `repeatingSequence`; manual segments reference shifts over inclusive date ranges; sequence days map contiguous offsets to a shift ID or off-day; Preview stores generated blocks, range, `generatedAt`, and `isStale`; profiles/backups store authored setup separately from Preview. These relevant types and behaviors match current HEAD.

## 10. Shift Definition Recovery

| Shift | Start | End | Days | Overnight | Confidence |
| --- | --- | --- | --- | ---: | --- |
| Day Shift | 05:45 | 14:15 | Mon–Fri | No | Recovered; screenshot plus historical test/model |
| Evening Shift | 13:45 | 22:15 | Mon–Fri | No | Recovered; screenshot plus historical test/model |

Likely IDs `shift_day` and `shift_evening` are **Strongly Inferred** from historical fixtures/model, not visible in the screenshot.

## 11. Cycle Mode Recovery

**Not Recovered.** The screenshot’s Advanced Work Schedule is collapsed. Dogfood notes prove dated rotations were authored, which supports cycle use, but do not distinguish manual segments from repeating sequence with enough certainty.

## 12. Cycle Assignment Recovery

**Not Recovered.** No sequence entries, explicit off-days, or manual segment payload was found. The notes say Day/Evening transitions generated and the Evening portion generally aligned, but that does not reveal September 5 authority.

## 13. Cycle Anchor Recovery

**Not Recovered.** No screenshot field, backup, or serialized setup exposes `sequenceAnchorDate` or equivalent original anchor.

## 14. `workDays` vs Cycle Authority

Historical code establishes exact precedence:

- manual segment → `generateWorkBlocks` → `workDays` filters absolute local weekdays;
- repeating sequence → sequence offset selects a shift → `createWorkBlockForLocalDate` → `workDays` is not consulted.

Thus a Mon–Fri definition can validly appear on Saturday under implemented repeating-sequence semantics if the cycle explicitly assigns it there. Historical and current code are identical at this boundary.

## 15. Historical Cycle UI

The Phase 7 UI offers “Manual date ranges” and “Repeating sequence.” Manual mode exposes dated segments. Repeating mode exposes an anchor and Day N shift/off assignments. The screenshot shows only the collapsed Advanced Work Schedule summary, so neither mode can be selected from UI structure. If expanded, it would have contained the decisive evidence.

## 16. Planning Range Recovery

Recovered range: January 1–December 31, 2026, shown in the annual Preview summary. Generated timing is shown as “Today” with a clock time, but the exact minute is not material and is not asserted from the reduced-resolution image. September 2026 is the selected Month.

## 17. September 2026 Grid Reconstruction

Monday-first grid:

```text
Mon  Tue  Wed  Thu  Fri  Sat  Sun
31   1    2    3    4    5    6
7    8    9   10   11   12   13
14  15   16   17   18   19   20
21  22   23   24   25   26   27
28  29   30    1    2    3    4
```

The selected marker on 2 validates the column/date mapping. Therefore the first-row weekend Work cell is Saturday, September 5.

## 18. Anomalous Weekend Date Recovery

**Recovered:** Saturday, September 5, 2026 contains a visible Work token. The token’s shift text is **Not Recovered** at available resolution. Other weekend cells contain visible attention markings and/or small text, but they cannot be classified reliably as Work; no additional dates are promoted.

## 19. Visible Work Pattern Analysis

September 2 detail explicitly identifies Day Shift Work. September 5 contains Work. Weekday cells show alternating/transitioning Work across the month, consistent with the ledger’s shift-rotation observation, but the small labels do not support a reliable run-length or period derivation. Red indicators recur widely and represent friction/attention, not shift identity.

## 20. Cycle Pattern Reconstruction

No evidence-supported exact cycle can be reconstructed. Two bounded candidates remain:

- manual dated Day/Evening segments, supported by Dogfood wording but inconsistent with current/historical weekend generation for these `workDays`;
- repeating sequence with September 5 assigned to Work, executable and consistent with the weekend token but not exposed by screenshot state.

Standard rotations were not assumed.

## 21. Historical Replay

An exact replay was blocked by missing cycle mode/entries/anchor. Focused diff showed no changes between `a3d89e3` and HEAD in `generateWorkBlocks`, `generateCycleWorkBlocks`, `shiftCycleUtils`, `queryMonthlyPlanner`, `PlannerSurface`, or `dayFrameStore`. Consequently current execution is also execution of the relevant historical algorithms; a separate checkout would add no semantic evidence without the state.

## 22. Current Replay

Using recovered shifts and annual range, direct generation produced 44 September weekday blocks (22 dates × 2 shifts), zero weekend blocks, and none on September 5. A mechanism-only seven-position repeating sequence explicitly assigning Day/Evening shifts produced weekend blocks on September 5/6, 12/13, 19/20, and 26/27; September 5 identity was `work_shift_day_2026-09-05`, `userDayDate=2026-09-05`, sequence entry `seq_2`. Those invented entries are not claimed as Dogfood state.

## 23. Preview Freshness Model

At the likely commit, authored mutation marks an existing Preview stale. `PlannerSurface` necessarily displays “Schedule needs refresh because the saved planning setup changed” for stale Preview and “Schedule is up to date” for current Preview. Month coverage independently distinguishes stale and fresh. Profile load clears Preview rather than retaining it as current.

## 24. Preview Freshness Recovery

**Fresh (Recovered from presentation), with high confidence.** The screenshot visibly says “Schedule is up to date,” and Month states current coverage. Those strings occupy captured regions where the historical stale warning would have appeared. No contradictory stale marker is visible.

## 25. Dogfood Edit Chronology

The exact click chronology is **Not Recovered**. The screenshot nevertheless records a saved/current plan and fresh Preview after the visible Work Pattern, which weighs against an old Preview surviving a subsequent saved edit. It cannot prove whether cycle settings were changed before generation.

## 26. Profile / Restore State

Saved Setup Profiles UI is visible, but no profile load/import action or selected profile provenance is shown. Historical profile load clears Preview. No evidence ties DF-006 to profile replacement.

## 27. Backup / Export Search

No Dogfood backup/export JSON was found in the repository, attachments, fixtures, docs, or Git history. Examples/defaults were not treated as user state.

## 28. Persistence Evidence

Historical storage keys, migrations, and tests exist, but no real browser localStorage dump is preserved. Active authored setup and profiles are durable; Preview is runtime-derived state. No serialized occurrence identity for September 5 was found.

## 29. Git History Analysis

`a2471e8` introduced repeating sequences; Phase 7 commit `a3d89e3` contains the screenshot-era behavior. Focused history found no post-Dogfood correction to cycle precedence, weekday filtering, Month evidence indexing, or stale messaging. Historical/current equivalence rules out BR4 on current evidence.

## 30. RC-B Assessment

**Plausible, materially strengthened, not confirmed.** Conditions 3 and 4 are executable: sequence assignments generate canonical weekend Work, including September 5. Screenshot Work plus rotation use makes the mechanism credible. Conditions 1 and 2—original repeating mode and its weekend entries—remain unobserved, so SR-RC1 is not supportable.

## 31. RC-H Assessment

**Contradicted with high confidence.** Historical code would mark Preview stale and show a refresh warning; profile loading clears it. The screenshots instead show up-to-date/current coverage. Exact chronology is absent, but the required visible state for RC-H is missing, so SR-RC2 is not selected.

## 32. Other-Mechanism Assessment

Direct weekday indexing, range padding, broad range, boundary handling, week-start/grid mapping, and Month indexing were already rejected and historical/current implementations match. A hidden persistence split-brain is unsupported. The only material unresolved branch is whether the collapsed cycle explicitly authorized September 5 or an unpreserved historical state mismatch occurred.

## 33. State-Recovery Confidence Matrix

| State Element | Recovered Value | Confidence | Evidence Source | Material? |
| --- | --- | --- | --- | ---: |
| Day Shift time | 05:45–14:15 | Recovered | screenshot + historical fixture | Yes |
| Evening Shift time | 13:45–22:15 | Recovered | screenshot + historical fixture | Yes |
| Work weekdays | Mon–Fri | Recovered | screenshot | Yes |
| Overnight | No | Recovered | screenshot | Yes |
| Cycle mode | Not recovered | Not Recovered | collapsed UI/no state | Yes |
| Sequence entries | Not recovered | Not Recovered | no export/UI | Yes |
| Cycle anchor | Not recovered | Not Recovered | no export/UI | Yes |
| Day boundary | Not recovered | Not Recovered | not visible | Maybe |
| Week start | Monday display | Recovered | screenshot grid | Low |
| Planning range | 2026-01-01–2026-12-31 | Recovered | screenshot summary | Maybe |
| Anomalous dates | 2026-09-05 minimum | Recovered | screenshot grid | Yes |
| Work identity | Work; exact shift/ID unknown | Partial | screenshot | Yes |
| Preview freshness | Fresh/current | Recovered | mandatory UI wording | Yes |
| Profile/load state | no action recovered | Not Recovered | UI only | Maybe |
| Historical commit | `a3d89e3` | Recovered/high | chronology/UI/Git | Yes |

## 34. September Calendar Matrix

Only dates with adequate screenshot evidence are classified; unknown is not “no Work.”

| Date | Weekday | Screenshot Work? | Replayed direct Work? | Shift | Weekend? | Match? |
| --- | --- | ---: | ---: | --- | ---: | ---: |
| 2026-09-02 | Wednesday | Yes | Yes | Day Shift visible | No | Yes |
| 2026-09-05 | Saturday | Yes | No | Not readable | Yes | No |
| 2026-09-06 | Sunday | Unknown | No | Unknown | Yes | Unknown |
| 2026-09-12 | Saturday | Unknown | No | Unknown | Yes | Unknown |
| 2026-09-13 | Sunday | Unknown | No | Unknown | Yes | Unknown |
| 2026-09-19 | Saturday | Unknown | No | Unknown | Yes | Unknown |
| 2026-09-20 | Sunday | Unknown | No | Unknown | Yes | Unknown |
| 2026-09-26 | Saturday | Unknown | No | Unknown | Yes | Unknown |
| 2026-09-27 | Sunday | Unknown | No | Unknown | Yes | Unknown |

## 35. Cycle Reconstruction Matrix

| Candidate Cycle | Source | Anchor | Length | Weekend Assignment? | Screenshot Match | Confidence |
| --- | --- | --- | ---: | ---: | --- | --- |
| Manual dated Day/Evening segments | Dogfood notes | Not recovered | date ranges | No under `workDays` | Misses Sep 5 | Plausible mode, inconsistent result |
| Repeating sequence with Sep 5 Work | historical engine + screenshot | Not recovered | Not recovered | Yes | Matches known anomaly | Plausible only |

## 36. Preview Freshness Matrix

| Evidence | Indicates Fresh | Indicates Stale | Ambiguous | Confidence |
| --- | ---: | ---: | ---: | --- |
| Screenshot stale notice | No notice; fresh wording visible | No | No | High |
| Header/generated metadata | Yes | No | No | Medium-high |
| Historical UI behavior | Fresh wording maps to non-stale | Mandatory stale warning differs | No | High |
| Dogfood action sequence | — | — | Yes | Low |
| Profile/load behavior | Load clears Preview | Does not preserve current-looking old Preview | — | High, but action unknown |
| Persisted Preview metadata | — | — | Not recovered | None |

## 37. Root-Cause Decision

**SR-RC4 — Historical Observation Confirmed, Cause Still Ambiguous.** Material state recovery rejects RC-H and narrows the cause toward cycle authority, but the required original sequence mode/assignments are absent. Promoting RC-B would violate its four-part evidence gate.

## 38. DF-006 Final Classification

**BR6 — Exact Reproduction Still Blocked.** September 5 Experienced Truth and freshness are recovered; exact cycle authority and occurrence identity remain missing. No current defect, valid authorization, or historical correction is yet proved.

## 39. Severity Reassessment

Retain **S1 pending the final cycle determination**. If the cycle explicitly authorized September 5, semantic severity falls but authority/provenance UX remains significant. If it did not, fresh generated Work contaminates schedule authority and downstream reasoning. Current evidence does not justify downgrading before that fork is resolved.

## 40. Product / UX Implication

If repeating-cycle authority is confirmed, the system is semantically following the cycle while the visible shift editor implies Mon–Fri. Hiding the independently effective authority behind collapsed “Advanced” configuration creates a serious comprehension/provenance problem even if generation is correct. This is separated from defect classification and not redesigned here.

## 41. Architecture Reopen Check

**No.** Accepted architecture can represent explicit cycle authority, exact Work provenance, and Preview freshness. The missing fact is authored historical state, not intended precedence ambiguity.

## 42. Implementation Alignment Consequence

Carry forward: recovered shifts/range/date/freshness; RC-H rejection; RC-B’s exact evidence gap; `generateRepeatingSequenceWorkBlocks` as the bounded semantic fork; September 5 as the replay assertion; S1 pending resolution; and an instruction not to invent a fix. The next reproduction needs only the expanded cycle configuration or exported authored setup.

## 43. Regression Requirements

Retain `DF006-REG-01` through `DF006-REG-10` from the addendum. Add:

- **DF006-REG-11:** If cycle authority schedules outside `workDays`, that authority and occurrence provenance must be explicit and auditable.
- **DF006-REG-12:** Work Pattern must not imply `workDays` alone describe effective dates when an active cycle independently authorizes them.
- **DF006-REG-13:** Every surface must visibly distinguish a stale Preview generated from materially different Work authority.

All three apply because RC-B is the remaining mechanism and freshness was part of the discrimination.

## 44. Recovery Decisions

### DF006-SR-DEC-01 — Screenshot Evidence
- **Decision:** Accept screenshot as first-class Experienced Truth.
- **Recovered State:** shifts, range, Month, current wording, Sep 2/Sep 5.
- **Confidence:** High except small labels.
- **Evidence:** supplied images.
- **Experienced Truth:** weekend Work exists.
- **Implemented/Historical Truth:** requires a source block.
- **Intended Truth:** provenance must explain it.
- **Reasoning:** visible anchors are coherent.
- **Consequence:** prior causal story remains superseded.
- **Remaining Question:** Sep 5 source identity.

### DF006-SR-DEC-02 — Dogfood Commit
- **Decision:** Select `a3d89e3`.
- **Recovered State:** Phase 7 screenshot-era implementation.
- **Confidence:** High.
- **Evidence:** same-day ledger, UI, Git chronology.
- **Experienced Truth:** captured after Phase 7 work.
- **Implemented/Historical Truth:** commit contains visible surfaces.
- **Intended Truth:** not affected.
- **Reasoning:** smallest supported point.
- **Consequence:** historical code is inspectable.
- **Remaining Question:** none material.

### DF006-SR-DEC-03 — Historical Model
- **Decision:** Use dual cycle modes and stale flag as historical truth.
- **Recovered State:** exact types at `a3d89e3`.
- **Confidence:** Recovered.
- **Evidence:** Git objects.
- **Experienced Truth:** could arise from either derived branch.
- **Implemented/Historical Truth:** model matches HEAD.
- **Intended Truth:** distinct authorities.
- **Reasoning:** direct code evidence.
- **Consequence:** current replay is compatible.
- **Remaining Question:** instantiated cycle.

### DF006-SR-DEC-04 — Shift Times
- **Decision:** Recover 05:45–14:15 and 13:45–22:15.
- **Recovered State:** exact non-overnight ranges.
- **Confidence:** High.
- **Evidence:** screenshot plus tests/archive.
- **Experienced Truth:** weekday-only sources.
- **Implemented/Historical Truth:** fixtures match.
- **Intended Truth:** ordinary eligibility applies.
- **Reasoning:** independent convergence.
- **Consequence:** exact shift controls replayed.
- **Remaining Question:** source IDs only inferred.

### DF006-SR-DEC-05 — Cycle Mode
- **Decision:** Mark Not Recovered.
- **Recovered State:** cycle existed; mode hidden.
- **Confidence:** High about absence.
- **Evidence:** collapsed Advanced section/no export.
- **Experienced Truth:** rotations authored.
- **Implemented/Historical Truth:** two modes possible.
- **Intended Truth:** mode determines authority.
- **Reasoning:** notes do not discriminate.
- **Consequence:** RC-B unconfirmed.
- **Remaining Question:** manual or repeating.

### DF006-SR-DEC-06 — Cycle Entries
- **Decision:** Mark Not Recovered.
- **Recovered State:** none.
- **Confidence:** High.
- **Evidence:** repository/image search.
- **Experienced Truth:** Sep 5 Work.
- **Implemented/Historical Truth:** sequence entry could authorize it.
- **Intended Truth:** explicit entry would be decisive.
- **Reasoning:** no assignment visible.
- **Consequence:** no valid-behavior classification.
- **Remaining Question:** Sep 5 sequence assignment.

### DF006-SR-DEC-07 — Cycle Anchor
- **Decision:** Mark Not Recovered.
- **Recovered State:** none.
- **Confidence:** High.
- **Evidence:** no field exposed.
- **Experienced Truth:** pattern insufficient.
- **Implemented/Historical Truth:** anchor controls modulo mapping.
- **Intended Truth:** anchor is authored authority.
- **Reasoning:** cannot infer safely.
- **Consequence:** no exact sequence replay.
- **Remaining Question:** anchor and length.

### DF006-SR-DEC-08 — Planning Range
- **Decision:** Recover full 2026.
- **Recovered State:** Jan 1–Dec 31, 2026.
- **Confidence:** High.
- **Evidence:** Preview summary.
- **Experienced Truth:** broad range.
- **Implemented/Historical Truth:** annual replay supported.
- **Intended Truth:** range must not shift recurrence.
- **Reasoning:** visible text.
- **Consequence:** exact broad control replayed.
- **Remaining Question:** boundary time.

### DF006-SR-DEC-09 — Anomalous Date
- **Decision:** Recover September 5 minimum.
- **Recovered State:** Saturday Work cell.
- **Confidence:** Medium-high.
- **Evidence:** anchored Monday-first screenshot.
- **Experienced Truth:** weekend anomaly localized.
- **Implemented/Historical Truth:** direct replay has none.
- **Intended Truth:** needs explicit authority.
- **Reasoning:** Sep 2 anchors grid.
- **Consequence:** final replay target fixed.
- **Remaining Question:** other weekends/label.

### DF006-SR-DEC-10 — Visible Shift Pattern
- **Decision:** Do not derive a period.
- **Recovered State:** Sep 2 Day Shift; Sep 5 unreadable Work.
- **Confidence:** Mixed.
- **Evidence:** screenshot detail/grid.
- **Experienced Truth:** rotations visible.
- **Implemented/Historical Truth:** many cycles fit sparse facts.
- **Intended Truth:** no standard rotation assumed.
- **Reasoning:** text resolution insufficient.
- **Consequence:** candidate matrix stays bounded.
- **Remaining Question:** full Work labels.

### DF006-SR-DEC-11 — Cycle Precedence
- **Decision:** Establish manual filters; repeating overrides weekday filter via explicit day assignment.
- **Recovered State:** historical production semantics.
- **Confidence:** Confirmed.
- **Evidence:** `generateCycleWorkBlocks` at `a3d89e3`.
- **Experienced Truth:** compatible with repeating authority.
- **Implemented/Historical Truth:** unchanged.
- **Intended Truth:** explicit authority must be auditable.
- **Reasoning:** separate code branches.
- **Consequence:** RC-B is technically viable.
- **Remaining Question:** original branch.

### DF006-SR-DEC-12 — Historical Freshness Behavior
- **Decision:** Stale state necessarily displays refresh warning.
- **Recovered State:** exact UI mapping.
- **Confidence:** High.
- **Evidence:** Phase 7 `PlannerSurface`/store.
- **Experienced Truth:** fresh wording instead.
- **Implemented/Historical Truth:** stale is visible.
- **Intended Truth:** stale is nonauthoritative.
- **Reasoning:** deterministic conditional.
- **Consequence:** RC-H weakened.
- **Remaining Question:** none about displayed flag.

### DF006-SR-DEC-13 — Dogfood Preview Freshness
- **Decision:** Classify Fresh.
- **Recovered State:** “Schedule is up to date”; current coverage.
- **Confidence:** High.
- **Evidence:** screenshot and historical strings.
- **Experienced Truth:** viewed result presented current.
- **Implemented/Historical Truth:** flag was non-stale.
- **Intended Truth:** current Preview corresponds to saved setup.
- **Reasoning:** stale alternative has different mandatory copy.
- **Consequence:** reject RC-H.
- **Remaining Question:** exact generated timestamp.

### DF006-SR-DEC-14 — Profile Chronology
- **Decision:** Mark action chronology Not Recovered.
- **Recovered State:** profile UI only.
- **Confidence:** High.
- **Evidence:** screenshot/repository absence.
- **Experienced Truth:** no visible load event.
- **Implemented/Historical Truth:** loads clear Preview.
- **Intended Truth:** replacement invalidates derived state.
- **Reasoning:** no link to anomaly.
- **Consequence:** profile mismatch unsupported.
- **Remaining Question:** whether a profile was used earlier.

### DF006-SR-DEC-15 — RC-B
- **Decision:** Retain as Plausible, not confirmed.
- **Recovered State:** mechanism and target date, not entries.
- **Confidence:** Medium.
- **Evidence:** historical code/current mechanism replay.
- **Experienced Truth:** fresh Sep 5 Work.
- **Implemented/Historical Truth:** explicit sequence can create it.
- **Intended Truth:** explicit cycle authority may be valid.
- **Reasoning:** two required original-state predicates missing.
- **Consequence:** no SR-RC1/BR3.
- **Remaining Question:** mode/entry/anchor.

### DF006-SR-DEC-16 — RC-H
- **Decision:** Reject for shown state.
- **Recovered State:** current/fresh UI.
- **Confidence:** High.
- **Evidence:** screenshot plus mandatory historical warning.
- **Experienced Truth:** no stale presentation.
- **Implemented/Historical Truth:** stale flag would surface.
- **Intended Truth:** stale cannot masquerade current.
- **Reasoning:** required predicate fails.
- **Consequence:** no SR-RC2.
- **Remaining Question:** chronology does not overturn visible flag.

### DF006-SR-DEC-17 — Other Mechanism
- **Decision:** Find no supported third mechanism.
- **Recovered State:** focused negative controls/history.
- **Confidence:** Medium-high.
- **Evidence:** addendum replays and unchanged code.
- **Experienced Truth:** still unexplained absent cycle.
- **Implemented/Historical Truth:** projection/date paths clean.
- **Intended Truth:** no ambiguity.
- **Reasoning:** no new positive evidence.
- **Consequence:** keep investigation on cycle state.
- **Remaining Question:** unpreserved split-brain is remote.

### DF006-SR-DEC-18 — Root Cause
- **Decision:** Select SR-RC4.
- **Recovered State:** cause narrowed, not proven.
- **Confidence:** High.
- **Evidence:** RC-B partial; RC-H contradicted.
- **Experienced Truth:** anomaly confirmed.
- **Implemented/Historical Truth:** exact state absent.
- **Intended Truth:** classification requires provenance.
- **Reasoning:** evidence gate not complete.
- **Consequence:** one bounded final replay.
- **Remaining Question:** cycle payload.

### DF006-SR-DEC-19 — DF-006 Classification
- **Decision:** Retain BR6.
- **Recovered State:** exact date/freshness but not authority.
- **Confidence:** High.
- **Evidence:** recovery matrix.
- **Experienced Truth:** weekend Work is real.
- **Implemented/Historical Truth:** direct path does not create it.
- **Intended Truth:** explicit cycle could validate it.
- **Reasoning:** defect versus valid cycle remains unresolved.
- **Consequence:** no implementation defect asserted.
- **Remaining Question:** original cycle.

### DF006-SR-DEC-20 — Severity
- **Decision:** Retain S1 pending fork resolution.
- **Recovered State:** current-looking weekend Work.
- **Confidence:** Medium-high.
- **Evidence:** hard-authority implications.
- **Experienced Truth:** user saw contradiction.
- **Implemented/Historical Truth:** cycle may explain it.
- **Intended Truth:** Work provenance is consequential.
- **Reasoning:** potential contamination remains.
- **Consequence:** preserve priority.
- **Remaining Question:** semantic or UX-only.

### DF006-SR-DEC-21 — Architecture
- **Decision:** Do not reopen.
- **Recovered State:** no intended contradiction.
- **Confidence:** High.
- **Evidence:** accepted authority/provenance model.
- **Experienced Truth:** implementation/state question.
- **Implemented/Historical Truth:** two explicit branches.
- **Intended Truth:** sufficient.
- **Reasoning:** missing state is not ambiguity.
- **Consequence:** no architecture work.
- **Remaining Question:** none.

### DF006-SR-DEC-22 — Alignment Handoff
- **Decision:** Carry evidence and prohibit speculative fix.
- **Recovered State:** sections 33/42.
- **Confidence:** High.
- **Evidence:** bounded recovery.
- **Experienced Truth:** preserved.
- **Implemented/Historical Truth:** RC-B fork identified.
- **Intended Truth:** provenance requirement.
- **Reasoning:** actionable without overclaim.
- **Consequence:** await final cycle replay.
- **Remaining Question:** original cycle export.

### DF006-SR-DEC-23 — Recovery Closure
- **Decision:** Select DF006-SR-C4 and Path B.
- **Recovered State:** material progress with one hinge.
- **Confidence:** High.
- **Evidence:** exact state matrix.
- **Experienced Truth:** date/freshness recovered.
- **Implemented/Historical Truth:** one viable branch remains.
- **Intended Truth:** final classification depends on authority.
- **Reasoning:** expanded cycle state enables precise replay.
- **Consequence:** one bounded reproduction only.
- **Remaining Question:** cycle mode/assignments/anchor.

## 45. Validation / Replay Evidence

Repository/history commands included repository-wide `rg`, focused `git log`, historical `git show`, and:

```text
git diff --exit-code a3d89e3 -- code/src/core/shifts/generateWorkBlocks.ts code/src/core/cycles/generateCycleWorkBlocks.ts code/src/core/cycles/shiftCycleUtils.ts code/src/core/monthlyPlanner/queryMonthlyPlanner.ts code/src/ui/PlannerSurface.tsx code/src/state/dayFrameStore.ts
```

Result: exit 0; no relevant historical/current difference.

Replay:

```text
./node_modules/.bin/tsc --outDir /tmp/df006-state-build --noEmit false --declaration false --sourceMap false
node /tmp/df006-state-recovery.mjs
```

Result: recovered direct shifts produced 44 September blocks, zero weekends, no September 5 block. Mechanism-only repeating sequence produced September 5 and other weekend blocks with explicit sequence provenance. The predecessor addendum’s targeted suite already passed 7 files/233 tests/0 failures; no production/test change occurred between that validation and this read-only recovery.

## 46. Repository Modification Verification

The sole repository write for this task is `docs/audits/DF_006_STATE_RECOVERY_RESULT.md`. Previous results are unchanged. Pre-existing dirty/untracked files were left untouched. Temporary build/replay artifacts were removed. No production, test, architecture, governance, or roadmap file was modified.

## 47. Recovery Closure

**DF006-SR-C4 — Recovery Improved but Cause Remains Ambiguous.** Shift times, range, date, freshness, commit, and historical precedence were recovered; original cycle mode/entries/anchor remain the single material hinge.

## 48. Recommended Next Step

**Path B — One Final Bounded Technical Reproduction.** Obtain one expanded Advanced Work Schedule screenshot or the original exported authored setup, then replay its exact cycle against September 5 at `a3d89e3`/HEAD. Do not broaden the audit or begin implementation work.

## 49. Conclusions

The screenshots disprove overnight crossover and strongly reject stale Preview. They localize the anomaly to a fresh September 5 Work occurrence and make repeating-cycle authority the sole demonstrated positive mechanism, but they do not expose the authority needed to call that mechanism historical fact. DF-006 therefore stays unresolved by exactly one recoverable state boundary rather than by a broad engine uncertainty.

## 50. Completion Statement

**DF-006 State Recovery complete.**

The recovery investigates the historical state required to explain the Dogfood Pass 01 weekend-Work anomaly after recovered screenshot evidence disproved the prior overnight-crossover explanation; treats the demonstrated Monday-through-Friday, non-overnight Work Pattern and September 2026 Month state as first-class Experienced Truth; reconstructs the historical Work/cycle model, likely Dogfood commit, shift configuration, cycle mode and assignments, planning range, anomalous weekend dates, visible shift pattern, Preview freshness, profile/restore chronology, and persistence provenance as far as durable evidence permits; compares recovered state against historical and current executable behavior; explicitly tests the remaining repeating-sequence-authority and stale-Preview hypotheses without promoting either from plausibility to fact without evidence; preserves immutable prior audit history while refining DF-006's classification, severity, regression requirements, and Implementation Alignment consequence; and determines whether the remaining evidence is sufficient to explain the anomaly, requires one final bounded reproduction, or should be retained as unresolved historical evidence while DayFrame proceeds to Implementation Alignment Strategy.
