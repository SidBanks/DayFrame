# DF-006 Final Technical Reproduction — Manual Cycle Weekend Work

## Status

Ready for final reproduction.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Read-only final bounded reproduction and root-cause localization for `DF-006`.

This task follows the completed:

* Dogfood Pass 01 Findings Reconciliation;
* Targeted Bug Reproduction;
* DF-006 Targeted Reproduction Addendum;
* DF-006 State Recovery.

New recovered screenshot evidence now establishes the decisive historical state:

* the active Advanced Work Schedule used **Manual date ranges**;
* the Day Shift and Evening Shift were Monday–Friday only;
* neither shift crossed midnight;
* September 5, 2026 displayed Work;
* the visible Preview was current/up to date;
* the active manual Day Shift segment covered September 5.

This eliminates the two previously viable alternative explanations:

### Repeating-sequence authority

Rejected. The active cycle mode was Manual date ranges.

### Stale Preview

Rejected with high confidence. The screenshot showed the schedule as current/up to date, and historical UI behavior would have surfaced stale state distinctly.

The remaining task is therefore **not another state recovery exercise**.

It is a single root-cause localization pass:

> **Using the recovered manual-cycle state, trace September 5, 2026 from historical authored Work authority through generated Work, Preview, Month projection, and rendered Month evidence, and identify the first layer at which erroneous weekend Work appears.**

This task does **not** fix DF-006.

This task does **not** modify production code or tests.

This task does **not** reopen architecture.

This task does **not** revisit DF-017 or DF-018.

This task is read-only with respect to the existing repository.

**The required final reproduction result artifact is the sole permitted repository write.**

---

## 1. Objective

Resolve the final technical question for `DF-006`:

> **Given the recovered Monday–Friday, non-overnight Work definitions and active Manual date-range cycle covering September 5, 2026, where does erroneous Saturday Work first enter the historical DayFrame data flow?**

Trace exactly:

```text
Authored Work Pattern
→ Manual cycle segment
→ generateCycleWorkBlocks
→ generateWorkBlocks
→ generatedWorkBlocks
→ generateSchedulePreview
→ Preview result
→ queryMonthlyPlanner
→ Month day evidence
→ rendered September 5 cell
```

The investigation must identify the first incorrect layer.

---

## 2. Governing Evidence

Use the completed state-recovery artifact:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DF_006_STATE_RECOVERY_RESULT.md`

Use the predecessor artifacts:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DF_006_TARGETED_REPRODUCTION_ADDENDUM_RESULT.md`

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DOGFOOD_PASS_01_TARGETED_BUG_REPRODUCTION_RESULT.md`

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DOGFOOD_PASS_01_FINDINGS_RECONCILIATION_RESULT.md`

Use the original ledger and architecture synthesis where needed.

Do not modify any prior result.

---

## 3. Newly Recovered Manual-Cycle Evidence

The recovered expanded Advanced Work Schedule screenshot establishes:

### Active cycle mode

**Manual date ranges**

### Work definitions

#### Day Shift

* Monday–Friday
* Saturday excluded
* Sunday excluded
* non-overnight

#### Evening Shift

* Monday–Friday
* Saturday excluded
* Sunday excluded
* non-overnight

### Manual schedule

At minimum, the visible manual Day Shift segment spans a date range that includes:

> **Saturday, September 5, 2026**

The screenshot also shows later Evening Shift manual scheduling.

Use exact segment dates from the screenshot if they are readable in the execution environment.

If one or more dates are not fully legible, recover them from current persisted state, historical fixtures, or repository evidence where possible.

Do not guess unreadable values.

---

## 4. Current DF-006 Status Entering This Task

The state recovery concluded:

* historical observation confirmed;
* September 5 weekend Work recovered;
* Preview freshness recovered as Fresh/current;
* stale Preview rejected;
* direct weekday generation correct;
* manual-cycle control correct under reconstructed state;
* repeating-sequence was technically capable but original mode was unknown.

The new screenshot now removes that last ambiguity:

> **The original active mode was Manual date ranges.**

Therefore the task must no longer treat repeating sequence as a viable explanation for the screenshot.

---

## 5. Intended Invariant

Use this invariant:

> **A Manual date-range cycle selecting a Monday–Friday, non-overnight shift must still respect that shift's `workDays` and must not generate a canonical Saturday Work occurrence on September 5, 2026.**

This invariant is already supported by historical/current production semantics.

No architectural ambiguity remains.

---

## 6. Historical Commit

Use the likely Dogfood implementation commit established by state recovery:

`a3d89e3`

Verify that this remains the correct historical code point.

If a tighter commit can now be established from the screenshot state, record it.

Do not broaden history unnecessarily.

---

## 7. Recover Exact Manual Segment Values

Recover the exact visible manual segment containing September 5.

At minimum:

| Field                     | Value |
| ------------------------- | ----- |
| Cycle name                |       |
| Segment name              |       |
| Shift reference           |       |
| Segment start date        |       |
| Segment end date          |       |
| Notes                     |       |
| Cycle ID if recoverable   |       |
| Segment ID if recoverable |       |

Recover the Evening segment too if it helps validate the cycle state, but the Day segment containing September 5 is the primary target.

Classify each value:

* Recovered;
* Strongly Inferred;
* Not Recovered.

---

## 8. Recover Exact Work Definition Values

Use recovered screenshot evidence:

### Day Shift

* start: `05:45`
* end: `14:15`
* Monday–Friday
* non-overnight

### Evening Shift

* start: `13:45`
* end: `22:15`
* Monday–Friday
* non-overnight

Verify historical object shape and IDs.

Do not alter values.

---

## 9. Construct Exact Historical Authored State

Construct the smallest historical state matching the recovered screenshot:

* exact Day Shift;
* exact Evening Shift;
* exact Manual cycle;
* exact segment dates;
* exact annual range January 1–December 31, 2026 where relevant;
* historical week start if needed;
* historical day boundary if recoverable.

Use the actual historical data model at `a3d89e3`.

Do not substitute current-only fields.

---

## 10. Historical Replay Environment

Run the historical code corresponding to `a3d89e3` in a temporary external worktree or equivalent isolated checkout.

Do not modify the current repository working tree.

If the relevant production files are byte-identical to current HEAD, still execute the replay against the recovered historical state so that the exact pipeline is verified.

Temporary replay artifacts must remain outside the repository.

---

## 11. Layer 1 — Manual Cycle Expansion

Call the historical equivalent of:

`generateCycleWorkBlocks`

with the recovered manual cycle.

Inspect every generated Work block around:

* September 4;
* September 5;
* September 6;
* September 7.

For each record:

| Field            | Value |
| ---------------- | ----- |
| block ID         |       |
| shift ID         |       |
| cycle ID         |       |
| segment ID       |       |
| local start date |       |
| userDayDate      |       |
| start time       |       |
| end time         |       |
| source weekday   |       |

Primary assertion:

> **No generated Work block should exist for September 5.**

If one exists here, the root cause is in cycle/shift generation.

---

## 12. Layer 2 — Direct Shift Generation Within Segment

Independently invoke the historical ordinary Work generator for the same Day Shift and manual segment range.

Confirm whether:

`generateWorkBlocks`

produces September 5.

This distinguishes:

### Manual-cycle wrapper defect

from:

### underlying weekday-filter defect

If direct generation excludes September 5 but cycle expansion includes it, localize to manual-cycle composition.

If both include September 5, localize deeper.

---

## 13. Layer 3 — `generatedWorkBlocks`

Run the historical full Preview generation pipeline.

Inspect:

`preview.result.generatedWorkBlocks`

for September 5.

Record:

* presence/absence;
* exact ID;
* source identity;
* `userDayDate`;
* local start date;
* timestamps;
* cycle/segment provenance.

This is the central semantic boundary.

---

## 14. Layer 4 — Scheduled Blocks / Other Preview Data

If September 5 Work is absent from `generatedWorkBlocks`, inspect whether another Preview collection introduces a Work-like item.

At minimum inspect:

* scheduled blocks;
* manual events;
* generated candidates;
* merged schedule items;
* Friction-derived annotations.

Determine whether the Month token could be sourced from something other than `generatedWorkBlocks`.

Do not assume the rendered “Work” token must come from one collection.

---

## 15. Layer 5 — Month Query

Run historical `queryMonthlyPlanner` against the recovered Preview.

Inspect September 5.

Record:

* coverage state;
* generated Work evidence;
* scheduled blocks;
* event labels;
* Work count;
* source IDs;
* user-day key.

If no Work exists upstream but Month reports Work, localize to Month projection/query.

---

## 16. Layer 6 — Planner/Month Surface

If Month query data is correct but the rendered Month cell still shows Work incorrectly, reproduce the historical Planner/Month rendering path.

Inspect:

* date-to-cell mapping;
* token-generation logic;
* label mapping;
* source-type mapping;
* stale cached props/state;
* neighboring-cell leakage.

Only go to this layer if upstream query data does not already contain the bad Work.

---

## 17. First-Wrong-Layer Rule

Stop causal localization at the first layer where September 5 changes from correct to incorrect.

Use this hierarchy:

### L1 — authored state already wrong

### L2 — manual cycle expansion wrong

### L3 — ordinary Work generation wrong

### L4 — Preview merge/projection wrong

### L5 — Month query wrong

### L6 — Month rendering wrong

### L7 — historical state cannot be reconstructed closely enough

Choose exactly one first-wrong layer.

---

## 18. Manual Cycle Semantics Verification

At `a3d89e3`, verify the exact historical behavior for Manual date ranges.

Document:

```text
manual segment
→ selected shift
→ generateWorkBlocks
→ workDays filter
```

Confirm whether any branch, shortcut, or legacy helper bypasses `workDays` under specific circumstances.

Do not infer from current code if historical code differs.

---

## 19. Segment Boundary Check

Because September 5 lies inside a manual date range, test whether manual segment boundaries are inclusive.

Verify:

* segment start inclusion;
* segment end inclusion;
* clipping behavior;
* Saturday inside range but outside `workDays`.

A date being inside the segment does not itself authorize Work if the selected shift excludes that weekday.

---

## 20. Date Parsing Check

Inspect historical parsing of manual segment dates.

Determine whether:

* ISO strings;
* local dates;
* UTC conversion;
* noon normalization;
* timezone parsing;

could shift the segment or generated date by one day.

Test September 5 specifically.

Do not broaden into DST unless evidence requires it.

---

## 21. September 5 Weekday Check

Explicitly verify that historical date helpers classify:

`2026-09-05`

as:

> **Saturday**

using the exact timezone/date helper path.

This should be trivial but must be recorded because weekday filtering is the central invariant.

---

## 22. Work ID Trace

If a September 5 Work block is generated, capture its full historical identity.

Expected form may resemble:

`work_<shiftId>_2026-09-05`

but do not assume exact format.

Record:

* block ID;
* shift ID;
* cycle ID;
* segment ID;
* local start date;
* canonical user-day;
* source provenance.

---

## 23. If No Current/Historical Replay Produces September 5

If the exact recovered manual-cycle state still produces no September 5 Work:

1. confirm the authored state matches the screenshot as closely as recoverable;
2. confirm Preview is fresh;
3. confirm Month query also contains no Work;
4. document the remaining mismatch as historical screenshot evidence not reproduced by current/historical code.

Then inspect only narrowly whether:

* the screenshot state had a third manual segment not visible;
* the saved Work definition differed from the visible unsaved draft;
* another Work source existed;
* a UI draft/current-state mismatch existed.

Do not reopen repeating sequence unless the screenshot evidence itself changes.

---

## 24. Saved Draft vs Saved State Check

The screenshot may show editable Work fields and a current Preview simultaneously.

Determine whether the Work editor represented:

### saved authored state

or:

### unsaved draft state

at the moment of the screenshot.

This is now an important alternate mechanism.

Inspect historical UI behavior:

* Save Setup semantics;
* dirty-state indicator;
* unsaved-change copy;
* whether Preview freshness is calculated from saved state rather than current draft;
* whether a draft could show Mon–Fri while the saved state still contained weekend days.

If so, this could explain:

```text
visible editor = Mon–Fri draft
saved authored state = weekend-enabled
Preview = fresh relative to saved state
```

This must be investigated explicitly.

---

## 25. Dirty Draft Indicator Recovery

Inspect the screenshot and historical UI for:

* unsaved changes count;
* Save Setup button state;
* dirty indicator;
* copy such as “X changes pending”;
* disabled/enabled save action.

Determine whether the screenshot itself indicates unsaved Work edits.

This may be the remaining missing explanation.

---

## 26. Save Semantics

At the historical commit, trace:

```text
SetupScreen draft
→ Save Setup
→ store authored state
→ mark Preview stale
```

Determine whether editing shift weekdays without saving would leave Preview marked current.

If yes, then current/up-to-date Preview does not necessarily prove the visible draft matches the saved authored setup.

This distinction must be explicit.

---

## 27. Draft-vs-Saved Hypothesis

Assess:

### RC-K — Unsaved Draft / Saved Authority Mismatch

Possible chain:

```text
saved Work setup contains weekend authority
→ Preview generated and current
→ user edits visible Work draft to Mon–Fri
→ changes not yet saved
→ Preview remains current relative to saved state
→ screenshot shows Mon–Fri editor + current Preview + weekend Work
```

This hypothesis was not previously tested.

Confirm or reject it using:

* screenshot dirty-state indicators;
* historical UI state flow;
* saved-change counter;
* button behavior;
* Dogfood chronology.

Do not promote it without evidence.

---

## 28. Full Candidate Root-Cause Set

At this final pass, candidates are:

### RC-A

Historical manual-cycle/weekday-generation defect.

### RC-B

Preview-generation/merge defect.

### RC-C

Month query/projection defect.

### RC-D

Month rendering defect.

### RC-E

Unsaved draft versus saved authored-state mismatch.

### RC-F

Another bounded mechanism directly supported by evidence.

Repeating-sequence and stale Preview are no longer active candidates unless new contradictory evidence appears.

---

## 29. Historical UI State Trace

Trace exact historical component flow for:

* Work Pattern draft;
* Save Setup;
* dirty changes;
* Preview stale flag;
* Generate Preview;
* Month display.

This must establish which state each visible surface reads from:

| Surface        | Draft state? | Saved authored state? | Preview snapshot? |
| -------------- | -----------: | --------------------: | ----------------: |
| Work editor    |              |                       |                   |
| Preview status |              |                       |                   |
| Month          |              |                       |                   |
| Work detail    |              |                       |                   |

---

## 30. Screenshot Dirty-State Analysis

Using the recovered screenshot, inspect visible UI around:

* Save Setup;
* change count;
* unsaved indicator;
* Preview status;
* Advanced Work Schedule.

Record exact visible wording where legible.

This may distinguish a true engine defect from a draft/saved-state UX trap.

---

## 31. Root Cause Classification

Select exactly one:

### DF006-RC1 — Manual Cycle Generation Defect

### DF006-RC2 — Underlying Weekday Filtering Defect

### DF006-RC3 — Preview Merge / Derived-State Defect

### DF006-RC4 — Month Query / Projection Defect

### DF006-RC5 — Month Rendering Defect

### DF006-RC6 — Unsaved Draft / Saved Authority Mismatch

### DF006-RC7 — Historical Defect Confirmed, Exact Technical Layer Unresolved

### DF006-RC8 — Screenshot Behavior Validly Explained by Historical UI State

### DF006-RC9 — Final Reproduction Inconclusive

Choose exactly one.

---

## 32. DF-006 Classification

Select exactly one:

### BR1 — Confirmed Current Defect

### BR2 — Confirmed Current Defect, Different Mechanism

### BR3 — Valid Behavior / Correctly Explained State

### BR4 — Historical Defect / Currently Corrected

### BR5 — Historical Observation Confirmed, Current Reproduction Not Achieved

### BR6 — Exact Reproduction Still Blocked

Use evidence from this final pass.

---

## 33. Historical vs Current Status

Explicitly answer:

* Does the issue reproduce at `a3d89e3`?
* Does the same semantic state reproduce at current HEAD?
* Has relevant code changed?
* Is this historical-only, current, or state-dependent?

Do not conflate historical screenshot evidence with current executable behavior.

---

## 34. Severity Reassessment

Reassess S1.

If RC6/RC8 explains the screenshot as draft/saved mismatch, severity may shift from schedule-correctness defect to significant UX/authority-visibility issue.

If generated Work is actually wrong, retain severity appropriate to hard-authority contamination.

Explain.

---

## 35. Downstream Contamination

If semantic Work is wrong upstream, trace potential contamination into:

* Preview;
* Friction;
* publication;
* execution;
* future Capacity;
* Goal planning.

If issue is only UI draft/saved mismatch, state that underlying saved schedule may be internally consistent even though presentation is misleading.

---

## 36. Architecture Reopen Check

Expected: **No**.

Existing architecture already distinguishes:

* authored authority;
* drafts;
* derived Preview;
* provenance;
* stale state;
* current schedule truth.

If the final mechanism is draft/saved mismatch, treat it as implementation/UX alignment, not architecture.

---

## 37. Implementation Alignment Handoff

The final result must provide exactly what Implementation Alignment Strategy needs:

* root cause/classification;
* historical/current status;
* exact affected subsystem;
* regression requirements;
* preservation requirements;
* UX/provenance implications;
* whether a defect fix is required;
* whether only workflow/presentation alignment is required.

Do not create implementation tasks.

---

## 38. Required End-to-End Trace Table

Produce:

| Layer                          | September 5 State | Correct? | Source | Notes |
| ------------------------------ | ----------------- | -------: | ------ | ----- |
| Visible Work draft             |                   |          |        |       |
| Saved authored Work            |                   |          |        |       |
| Manual cycle segment           |                   |          |        |       |
| Direct Work generation         |                   |          |        |       |
| Cycle Work generation          |                   |          |        |       |
| Preview generatedWorkBlocks    |                   |          |        |       |
| Preview scheduled/merged state |                   |          |        |       |
| Month query                    |                   |          |        |       |
| Rendered Month cell            |                   |          |        |       |

This is mandatory.

---

## 39. Required Draft-vs-Saved Matrix

Produce:

| Concern                | Draft | Saved Authored State | Preview |
| ---------------------- | ----- | -------------------- | ------- |
| Work weekdays          |       |                      |         |
| Cycle mode             |       |                      |         |
| Segment dates          |       |                      |         |
| Freshness relationship |       |                      |         |
| Visible in screenshot? |       |                      |         |

---

## 40. Required Final Candidate Matrix

Produce:

| Candidate                    |             Supported? | Rejected? | Evidence              | Confidence |
| ---------------------------- | ---------------------: | --------: | --------------------- | ---------- |
| Manual-cycle generation bug  |                        |           |                       |            |
| Weekday filtering bug        |                        |           |                       |            |
| Preview merge bug            |                        |           |                       |            |
| Month projection bug         |                        |           |                       |            |
| Month rendering bug          |                        |           |                       |            |
| Unsaved draft/saved mismatch |                        |           |                       |            |
| Repeating sequence           | No unless new evidence |       Yes | Manual mode recovered | High       |
| Stale Preview                | No unless new evidence |       Yes | Fresh/current wording | High       |

---

## 41. Required Regression Requirements

Retain `DF006-REG-01` through `DF006-REG-13`.

Add where applicable:

### DF006-REG-14

A current Preview must be explicitly current relative to the **saved authored state**, not merely coexist with an unsaved draft.

### DF006-REG-15

When an unsaved Work draft differs materially from the saved schedule authority, the UI must make that distinction unmistakable.

### DF006-REG-16

A Month surface must not visually imply that its schedule reflects unsaved Work edits.

### DF006-REG-17

Manual cycle Work must respect the selected shift's weekday constraints unless another explicit authority says otherwise.

---

## 42. Required Final Decisions

Create:

`DF006-FINAL-DEC-01`, `DF006-FINAL-DEC-02`, etc.

Each must include:

* **Decision**
* **Evidence**
* **Experienced Truth**
* **Historical Implemented Truth**
* **Current Implemented Truth**
* **Intended Truth**
* **Reasoning**
* **Consequence**
* **Regression Requirement**
* **Remaining Question**

At minimum cover:

1. manual mode confirmation;
2. recovered exact segment;
3. saved vs draft state;
4. historical Save Setup semantics;
5. Preview freshness meaning;
6. September 5 direct generation;
7. September 5 cycle generation;
8. Preview generatedWorkBlocks;
9. Month query;
10. rendered Month cell;
11. draft-vs-saved hypothesis;
12. repeating-sequence rejection;
13. stale-preview rejection;
14. first-wrong layer;
15. root cause;
16. historical/current status;
17. severity;
18. downstream contamination;
19. architecture reopen;
20. implementation alignment handoff;
21. final DF-006 classification;
22. closure.

---

## 43. Validation

Run only targeted existing tests needed to support the final conclusion.

Potential suites include:

* Work generation;
* manual cycle generation;
* schedule preview;
* Month query;
* Planner/Month UI;
* DayFrameApp/Setup save-state behavior;
* stale-preview state;
* draft-change behavior.

Temporary external reproduction scripts/worktrees are permitted.

Report:

* exact test commands;
* files;
* passed;
* failed;
* historical replay command;
* current replay command;
* September 5 outputs at each layer.

Do not modify tests.

---

## 44. Final Closure

Select exactly one:

### DF006-FINAL-C1 — Root Cause Confirmed

Exact mechanism identified; implementation alignment may proceed.

### DF006-FINAL-C2 — Historical Defect Confirmed and Bounded

Screenshot behavior is definitely incorrect, but exact sublayer cannot be reconstructed further; evidence is still sufficient for alignment.

### DF006-FINAL-C3 — Behavior Validly Explained by Draft/Saved or Other State

No scheduling defect; remaining issue is UX/authority clarity.

### DF006-FINAL-C4 — Historical Observation Retained, Technical Cause Still Unrecoverable

All practical reconstruction exhausted; proceed to alignment with preserved regression constraints and no speculative defect fix.

Choose exactly one.

---

## 45. Recommended Next-Step Gate

### Path A — Implementation Alignment Strategy

Choose for:

* DF006-FINAL-C1;
* DF006-FINAL-C2;
* DF006-FINAL-C3;
* DF006-FINAL-C4.

This is the **final DF-006 pass**.

Do not recommend another broad audit or state-recovery task unless execution is genuinely blocked by unavailable repository state.

The purpose of this task is to terminate the DF-006 investigation with the best evidence available and carry the result into alignment.

Do not begin Implementation Alignment Strategy here.

Do not create an implementation roadmap.

Do not name the next implementation phase.

---

## 46. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DF_006_FINAL_TECHNICAL_REPRODUCTION_RESULT.md`

The filename must contain `RESULT`.

This is the sole permitted repository write.

Do not modify any predecessor artifact.

---

## 47. Required Result Structure

The artifact must contain at minimum:

1. Executive Final Result
2. Scope
3. Governing Evidence
4. Newly Recovered Manual-Cycle State
5. Historical Commit
6. Historical Data Model
7. Exact Work Definitions
8. Exact Manual Segment Recovery
9. Historical Save/Draft Model
10. Preview Freshness Semantics
11. Screenshot Dirty-State Analysis
12. Historical Authored-State Reconstruction
13. Historical Replay
14. Current Replay
15. Manual Cycle Expansion
16. Direct Work Generation
17. Preview generatedWorkBlocks
18. Preview Merge Analysis
19. Month Query Analysis
20. Month Rendering Analysis
21. September 5 Trace
22. Draft-vs-Saved Analysis
23. Repeating-Sequence Rejection
24. Stale-Preview Rejection
25. Candidate Root-Cause Matrix
26. First-Wrong-Layer Decision
27. Root Cause Classification
28. DF-006 Final Classification
29. Historical vs Current Status
30. Severity Reassessment
31. Downstream Contamination
32. Product / UX Implication
33. Architecture Reopen Check
34. Implementation Alignment Handoff
35. Regression Requirements
36. End-to-End Trace Table
37. Draft-vs-Saved Matrix
38. Final Candidate Matrix
39. Final Decisions
40. Validation
41. Repository Modification Verification
42. Final Closure
43. Recommended Next Step
44. Conclusions
45. Completion Statement

---

## 48. Artifact Verification

After writing:

1. verify the exact result path;
2. reopen and read it;
3. verify manual mode is established;
4. verify repeating-sequence is not retained without new evidence;
5. verify stale Preview is not retained without new evidence;
6. verify exact manual segment values are recovered where possible;
7. verify draft-vs-saved state is explicitly investigated;
8. verify Save Setup semantics are traced;
9. verify Preview freshness semantics are traced;
10. verify September 5 is tested through direct Work generation;
11. verify September 5 is tested through manual cycle generation;
12. verify Preview `generatedWorkBlocks` is inspected;
13. verify Preview merged state is inspected;
14. verify Month query is inspected;
15. verify Month rendering is inspected where needed;
16. verify first-wrong layer is selected;
17. verify root cause classification is selected;
18. verify DF-006 has exactly one BR classification;
19. verify historical/current status is explicit;
20. verify severity is reassessed;
21. verify downstream contamination is addressed;
22. verify architecture reopen is answered;
23. verify alignment handoff is explicit;
24. verify regression requirements are complete;
25. verify End-to-End Trace Table is complete;
26. verify Draft-vs-Saved Matrix is complete;
27. verify Final Candidate Matrix is complete;
28. verify all required `DF006-FINAL-DEC-*` decisions exist;
29. verify exactly one final closure;
30. verify Path A is selected unless catastrophic evidence requires otherwise;
31. verify no fix was implemented;
32. verify no production code changed;
33. verify no tests changed;
34. verify no predecessor audit changed;
35. verify no architecture/governance file changed;
36. inspect repository status;
37. verify the result artifact was the sole repository write.

---

## 49. Completion Criteria

The task is complete only when:

* [ ] the recovered Manual date-range mode is used;
* [ ] the exact Day and Evening Work definitions are preserved;
* [ ] the Day segment containing September 5 is reconstructed;
* [ ] historical `workDays` filtering is verified;
* [ ] September 5 is verified as Saturday;
* [ ] historical direct Work generation is tested;
* [ ] historical manual cycle generation is tested;
* [ ] current equivalent replay is tested;
* [ ] Preview `generatedWorkBlocks` is inspected;
* [ ] Preview merge behavior is inspected;
* [ ] Month query behavior is inspected;
* [ ] rendering is inspected only if necessary;
* [ ] saved authored state is distinguished from visible draft;
* [ ] historical Save Setup behavior is traced;
* [ ] dirty-state indicators are inspected;
* [ ] Preview freshness meaning is interpreted relative to saved authored state;
* [ ] RC6 draft/saved mismatch is confirmed or rejected;
* [ ] repeating sequence remains rejected unless new evidence requires reopening;
* [ ] stale Preview remains rejected unless new evidence requires reopening;
* [ ] the first wrong layer is selected;
* [ ] one root cause classification is selected;
* [ ] DF-006 receives one final BR classification;
* [ ] historical/current status is explicit;
* [ ] severity is reassessed;
* [ ] contamination scope is explicit;
* [ ] UX implications are separated from semantic defect;
* [ ] architecture reopen is explicitly answered;
* [ ] implementation-alignment handoff is complete;
* [ ] all regression requirements are preserved;
* [ ] End-to-End Trace Table is complete;
* [ ] Draft-vs-Saved Matrix is complete;
* [ ] Final Candidate Matrix is complete;
* [ ] all required final decisions exist;
* [ ] exactly one final closure is selected;
* [ ] Path A is selected after closure;
* [ ] no defect was fixed;
* [ ] no production code was modified;
* [ ] no tests were modified;
* [ ] no prior audit was modified;
* [ ] no architecture/governance artifact was modified;
* [ ] no implementation roadmap was created;
* [ ] no future implementation phase was named;
* [ ] exact result artifact was created;
* [ ] result artifact was reopened and verified;
* [ ] repository status was inspected;
* [ ] result artifact was the sole repository write.

---

## 50. Final Completion Statement

End `DF_006_FINAL_TECHNICAL_REPRODUCTION_RESULT.md` with exactly:

> **DF-006 Final Technical Reproduction complete.**
>
> The final reproduction uses the recovered Manual date-range Work Schedule, exact Monday-through-Friday non-overnight Day and Evening shifts, fresh September 2026 Preview state, and Saturday September 5 weekend-Work observation to trace the anomaly through historical saved authored state, visible Work draft state, manual cycle expansion, ordinary Work generation, Preview generated and merged data, Month query, and rendered calendar evidence; explicitly rejects the previously eliminated repeating-sequence and stale-Preview explanations unless new contradictory evidence appears; investigates whether the visible Mon–Fri editor represented unsaved draft state while the current Preview remained valid relative to different saved authority; identifies the first layer at which September 5 becomes incorrect or establishes that the screenshot is validly explained by draft/saved state; classifies the resulting historical/current behavior, severity, downstream contamination risk, UX/provenance implications, regression requirements, and Implementation Alignment consequence; preserves all prior audit artifacts as immutable evidence; and closes the DF-006 investigation so DayFrame can proceed to Implementation Alignment Strategy without another broad reproduction or architecture pass.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/audits/DF_006_FINAL_TECHNICAL_REPRODUCTION_RESULT.md`
>
> **Repository modifications:** The required final DF-006 result artifact was the sole repository write.
>
> **First wrong layer:** Report L1, L2, L3, L4, L5, L6, or explain that no wrong layer was reproduced.
>
> **Root cause:** Report DF006-RC1 through DF006-RC9.
>
> **DF-006 classification:** Report BR1, BR2, BR3, BR4, BR5, or BR6.
>
> **Historical/current status:** State whether the issue is historical-only, current, state-dependent, or not reproducible.
>
> **Final closure:** Report DF006-FINAL-C1, C2, C3, or C4.
>
> **Validation:** Report targeted tests and historical/current September 5 replay results.
>
> **Recommended next step:** Path A — Implementation Alignment Strategy.
