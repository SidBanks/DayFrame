# DF-006 Targeted Reproduction Addendum — Weekday-Only Work Appearing on Weekend

## Status

Ready for targeted reproduction.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Read-only targeted defect reproduction and correction of the prior `DF-006` reproduction conclusion.

This task reopens only:

> **DF-006 — Work appears on a weekend date despite the demonstrated authored Work configuration containing Monday–Friday Work only and no overnight Work.**

The previous targeted reproduction classified `DF-006` as:

> **BR3 — Valid Behavior / User-Day Interpretation**

That classification relied on reproducing a **Saturday-authorized overnight Work occurrence crossing into Sunday calendar time**.

Newly recovered Dogfood screenshot evidence demonstrates that this reproduction did **not** match the observed configuration.

The screenshots show:

* two authored Work shifts;
* both configured Monday through Friday;
* Saturday unchecked;
* Sunday unchecked;
* neither shift configured to cross midnight;
* resulting Month/planning output exhibiting weekend Work behavior.

Therefore the prior Saturday-overnight reproduction is a useful negative/control case but is **not a sufficient explanation of DF-006**.

This task must reproduce and trace the actual weekday-only, non-overnight condition.

This task does **not** fix DF-006.

This task does **not** reopen `DF-017` or `DF-018`.

This task does **not** redesign Work Pattern, Month, Preview, canonical user-day semantics, recurrence, cycles, or planning ranges.

This task is read-only with respect to the existing repository.

**The required addendum result artifact is the sole permitted repository write.**

---

## 1. Objective

Determine why DayFrame can display or generate Work on a weekend date when the demonstrated authored Work configuration contains:

```text
Day Shift:
Monday
Tuesday
Wednesday
Thursday
Friday
NOT Saturday
NOT Sunday
non-overnight
```

and:

```text
Evening Shift:
Monday
Tuesday
Wednesday
Thursday
Friday
NOT Saturday
NOT Sunday
non-overnight
```

The investigation must trace the anomalous weekend Work backward through the complete relevant path:

```text
Month display
← Month/day projection
← Preview scheduled/generated Work
← generated Work block
← cycle/rotation expansion
← weekday eligibility
← authored shift definition
```

The central question is:

> **At what exact transformation does a weekday-only Work definition become, or appear to become, weekend Work?**

---

## 2. Corrective Evidence Principle

Do not preserve the prior BR3 conclusion merely because it was already written to a durable audit artifact.

The architecture requires epistemic integrity and external calibration.

New evidence may invalidate a prior inference.

The prior reproduction established only:

> A Saturday-authorized overnight Work occurrence can legitimately contain Sunday calendar timestamps while remaining Saturday-owned Work.

It did **not** establish:

> The original DF-006 observation was caused by such an occurrence.

The recovered screenshots contradict the latter explanation because the demonstrated authored Work configuration contains no Saturday Work and no overnight Work.

Treat the screenshots as newly recovered **Experienced Truth evidence**.

---

## 3. Governing Sources

Inspect:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md`

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DOGFOOD_PASS_01_FINDINGS_RECONCILIATION_RESULT.md`

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DOGFOOD_PASS_01_TARGETED_BUG_REPRODUCTION_RESULT.md`

`/home/sid/Penn Digital Services/DayFrame/docs/architecture/POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`

and all relevant current production code/tests.

Also inspect any repository artifact preserving the Dogfood Work Pattern, planning range, Month state, Preview state, or cycle configuration corresponding to DF-006.

---

## 4. Screenshot Evidence

The user has supplied recovered Dogfood screenshots showing the relevant authored configuration and resulting planning state.

Use the following screenshot-derived facts as reconstruction constraints:

### Work Pattern

Two Work definitions are visible.

#### Day Shift

* weekday-based Work;
* Monday selected;
* Tuesday selected;
* Wednesday selected;
* Thursday selected;
* Friday selected;
* Saturday not selected;
* Sunday not selected;
* non-overnight.

#### Evening Shift

* weekday-based Work;
* Monday selected;
* Tuesday selected;
* Wednesday selected;
* Thursday selected;
* Friday selected;
* Saturday not selected;
* Sunday not selected;
* non-overnight.

The screenshots show no authored Saturday or Sunday Work.

The screenshots show no overnight Work capable of crossing from Saturday into Sunday.

### Resulting Planning State

The corresponding Month/planning state exhibits the weekend Work anomaly that produced `DF-006`.

Treat exact text that cannot be read reliably from the screenshots as unknown rather than inventing values.

Where repository evidence can recover exact times, dates, cycle configuration, or planning state, prefer that evidence.

---

## 5. Prior Reproduction Disposition

The prior audit's Saturday-overnight case remains valid as a control demonstrating canonical user-day behavior.

It must **not** remain the principal reproduction of DF-006.

Explicitly classify the prior reproduction as:

> **Valid control case; mismatched to recovered DF-006 conditions.**

Determine whether the prior `BR3` classification must be:

* withdrawn;
* superseded;
* or retained only as a classification of the control case rather than DF-006.

Do not modify the previous immutable result artifact.

The new addendum must preserve the correction historically.

---

## 6. Truth Model

Use:

### Experienced Truth

Recovered Dogfood screenshots and original Dogfood notes.

### Intended Truth

Accepted Work and canonical user-day architecture.

### Implemented Truth

Current executable behavior.

### Historical Audit Interpretation

The previous BR3 conclusion.

Keep all four distinguishable.

---

## 7. Intended Invariant

Establish the normative invariant before reproduction:

> **A Work definition whose recurrence excludes Saturday and Sunday must not generate a canonical Saturday or Sunday Work occurrence merely because those dates fall within the planning range.**

Also preserve:

> **Calendar overlap is not recurrence ownership.**

Therefore:

* a legitimate Friday overnight occurrence could occupy Saturday clock time while remaining Friday-owned;
* a legitimate Saturday overnight occurrence could occupy Sunday clock time while remaining Saturday-owned;

but those controls do not apply when:

* no weekend source day is authorized;
* and no Work occurrence crosses midnight.

---

## 8. Reconstruct the Exact Dogfood Configuration

Recover as much of the original configuration as evidence permits.

At minimum determine:

* Day Shift exact start time;
* Day Shift exact end time;
* Evening Shift exact start time;
* Evening Shift exact end time;
* weekdays for each;
* `crossesMidnight`;
* shift IDs;
* shift order;
* cycle/rotation configuration;
* cycle start/anchor date;
* segment/order configuration;
* effective day boundary;
* week-start preference;
* planning range;
* selected Month;
* generated Preview range;
* any per-cycle/per-segment overrides;
* any profile/load state relevant to the observation.

For every unrecoverable value write:

> **Not recovered**

rather than guessing.

---

## 9. Identify the Exact Anomalous Dates

From the screenshots and repository evidence, identify every weekend date that appears to contain Work unexpectedly.

For each anomalous cell/date record:

| Displayed Date | Displayed Weekday | Work Label | Apparent Shift | Other Events | Screenshot Evidence |
| -------------- | ----------------- | ---------- | -------------- | ------------ | ------------------- |

Do not assume every red/marked weekend cell represents Work.

Distinguish Work from:

* Sleep;
* Commitment;
* Friction;
* conflict indicator;
* manual event;
* other calendar annotation.

This distinction must be verified.

---

## 10. Trace One Anomalous Occurrence End-to-End

Select the clearest anomalous weekend occurrence.

Trace it backward.

### Layer 1 — Month UI

Determine:

* displayed date;
* event label;
* source/type;
* date/grouping key;
* canonical user-day if available;
* click/detail data.

### Layer 2 — Month Projection

Determine which underlying Preview/published object caused the rendered entry.

### Layer 3 — Preview

Determine:

* scheduled block ID;
* source ID;
* source type;
* start;
* end;
* `userDayDate`;
* local/source date;
* placement provenance.

### Layer 4 — Generated Work

Determine:

* generated Work block ID;
* shift definition ID;
* cycle source;
* generated local start date;
* generated user-day date;
* shift weekday.

### Layer 5 — Cycle Expansion

Determine:

* cycle index;
* segment index if applicable;
* anchor;
* offset;
* calculated date;
* weekday mapping.

### Layer 6 — Authored Shift

Verify the source definition actually excludes the anomalous weekend weekday.

The trace must stop at the **first layer where the date/source becomes incorrect**.

---

## 11. Source-vs-Presentation Gate

Before classifying DF-006 as an engine defect, answer:

> Does the anomalous weekend Work exist in generated source data?

### If Yes

Trace generation/cycle/weekday logic.

### If No

Trace Month projection/render grouping.

This is the primary defect-boundary gate.

---

## 12. Exact Weekday Mapping

Inspect all relevant weekday representations.

At minimum determine whether the system uses any mixture of:

```text
Sunday = 0
Monday = 1
...
Saturday = 6
```

and:

```text
Monday = 0
...
Sunday = 6
```

or string enums such as:

```text
monday
tuesday
...
sunday
```

Inspect conversion boundaries.

Search for:

* `getDay()`;
* weekday arrays;
* modulo arithmetic;
* cycle offsets;
* week-start transformations;
* Sunday/Monday indexing;
* ISO weekday conversion;
* date helper libraries;
* manual weekday tables.

Do not assume an off-by-one defect exists.

Prove or reject it.

---

## 13. Week-Start Preference

Determine whether changing:

```text
Sunday-start week
```

versus:

```text
Monday-start week
```

can alter Work recurrence eligibility rather than merely presentation/grouping.

Under intended semantics, week-start preference must not silently transform a Monday–Friday Work definition into weekend Work.

Test this boundary where relevant.

---

## 14. Cycle Anchor

Investigate whether Work cycles/rotations align authored weekdays relative to:

* absolute calendar weekday;
* cycle day index;
* planning-range start;
* user-day week start;
* cycle anchor.

Determine whether the anomaly occurs only at specific cycle offsets.

---

## 15. Planning-Range Start

Test whether the first day of the generated range affects weekday alignment.

Use otherwise identical semantic inputs with planning ranges beginning on different weekdays.

If Work occurrence dates shift when only irrelevant planning-range padding changes, record that as a deterministic invariant failure.

---

## 16. Expanded Planning Window

The engine may expand planning windows around requested ranges.

Inspect whether ±day padding or equivalent expansion can introduce a date-offset error when Work is projected back into the requested range.

Determine whether:

```text
requested start
expanded start
cycle enumeration start
render start
```

are being confused.

---

## 17. Canonical User-Day Boundary

Test the demonstrated weekday-only shifts using the actual/recovered day boundary.

Also test a neutral boundary where necessary to isolate behavior.

Because the shifts are non-overnight, canonical user-day conversion should not ordinarily create an unrelated weekend recurrence.

If it does, trace exactly why.

---

## 18. Shift Ordering

Because two shift definitions exist, determine whether:

* array index;
* active shift selection;
* cycle segment;
* shift-definition order;

can affect date assignment.

Swapping shift-definition order should not move a Work occurrence to another weekday unless order is semantically meaningful through an authored cycle.

---

## 19. Multiple-Shift Interaction

Test:

### Case A

Day Shift only.

### Case B

Evening Shift only.

### Case C

Both shifts.

Determine whether DF-006 requires multiple shift definitions.

This is especially important because Dogfood separately identified multiple-shift authoring as confusing.

Do not conflate the UX finding with the defect.

---

## 20. Cycle/Rotation Interaction

Test the smallest applicable configurations:

### Case A

Simple weekday Work without cycle complexity, if supported.

### Case B

Recovered Dogfood cycle/rotation.

### Case C

Equivalent cycle with shifted anchor.

### Case D

Cycle transition adjacent to weekend.

Determine whether the anomaly requires cycle expansion.

---

## 21. Month Boundary Interaction

The recovered screenshot covers a Month view.

Determine whether the anomaly occurs:

* within ordinary mid-month weeks;
* only at month boundaries;
* only at planning-range boundaries;
* only near cycle boundaries;
* only near the current/today date;
* or generally.

Do not broaden beyond evidence unless needed to isolate the defect.

---

## 22. Year-Scale Planning Range

The Dogfood screenshots appear to involve a very broad generated planning range.

Determine whether DF-006 depends on:

* year-scale generation;
* long-range cycle arithmetic;
* accumulated date offsets;
* range clipping;
* Month projection from a broad Preview.

Compare a narrow reproduction around the anomalous week with the recovered broader range.

If the narrow case is correct but the broad case fails, record this explicitly.

---

## 23. Timezone / DST Check

Investigate timezone or DST only if the anomalous date is adjacent to a relevant transition or current implementation uses timezone conversions capable of shifting the date.

Do not over-investigate timezone if evidence rules it out.

A daytime/evening Work block moving an entire recurrence weekday generally requires stronger evidence than ordinary timezone conversion.

---

## 24. Minimal Reproduction Matrix

At minimum execute the smallest meaningful set:

| Case | Shift Set    | Weekdays            | Overnight? | Cycle           | Range           |                                 Expected Weekend Work | Actual |
| ---- | ------------ | ------------------- | ---------: | --------------- | --------------- | ----------------------------------------------------: | ------ |
| A    | Day only     | Mon–Fri             |         No | minimal         | narrow          |                                                    No |        |
| B    | Evening only | Mon–Fri             |         No | minimal         | narrow          |                                                    No |        |
| C    | Both         | Mon–Fri             |         No | minimal         | narrow          |                                                    No |        |
| D    | Both         | Mon–Fri             |         No | recovered cycle | narrow          |                                                    No |        |
| E    | Both         | Mon–Fri             |         No | recovered cycle | broad/recovered |                                                    No |        |
| F    | Control      | Saturday authorized |        Yes | relevant        | narrow          | calendar Sunday allowed, canonical Sunday not implied |        |

Add only evidence-driven cases beyond these.

---

## 25. Screenshot-Date Reproduction

At least one reproduction must target the **actual anomalous week/date shown in the recovered screenshot**, if that date can be reliably identified.

Do not substitute an arbitrary September week if the exact date is recoverable.

Use the actual year and Month represented by the screenshot/repository evidence.

---

## 26. Current vs Historical Behavior

It is possible the Dogfood screenshot preserves a defect that current code no longer reproduces.

If so, distinguish:

### Historical Experienced Truth

The screenshot demonstrates the behavior existed.

### Current Implemented Truth

Current code does not reproduce it.

Then search repository history/current documentation only as necessary to determine whether an intervening change plausibly corrected it.

Do not rewrite history as “never a bug.”

---

## 27. Rendering Control

If current generated Work is correct, reproduce the Month rendering/projection with the same underlying data.

Determine whether:

* event grouping;
* clipping;
* day-label association;
* row/column indexing;
* calendar grid offset;
* Sunday/Monday week-start handling;

can display Work in the wrong cell.

A rendering defect must remain distinct from a recurrence defect.

---

## 28. Calendar Grid Alignment

Because Month grids commonly contain leading/trailing dates from adjacent months, explicitly inspect:

* grid start date;
* weekday column ordering;
* leading-day offset;
* Sunday/Monday week-start configuration;
* mapping from grid index to date;
* mapping from event date to grid cell.

Determine whether Work is attached to the wrong **date** or merely the wrong **visual cell**.

---

## 29. Event Identity Control

For an anomalous displayed Work item, determine whether its source identity corresponds to:

* previous Friday;
* following Monday;
* another weekday;
* duplicate occurrence;
* wrong shift;
* stale Preview occurrence.

This may reveal whether the defect is date assignment, duplication, or display projection.

---

## 30. Stale Preview Control

Because DayFrame intentionally retains stale Preview after authored changes, determine whether the screenshot could represent:

```text
old Work pattern
→ generated Preview
→ Work pattern edited to Mon–Fri
→ old Preview retained
```

rather than:

```text
Mon–Fri Work pattern
→ fresh generation
→ weekend Work
```

Use screenshot state, stale indicators, generated timestamp, repository behavior, and Dogfood notes where available.

Do **not** assume stale Preview is the explanation merely because that mechanism exists.

If the screenshot visibly identifies the Preview as current/fresh, record that.

---

## 31. Profile / Restore Control

Because Saved Setup Profiles existed during Dogfood, determine whether:

* loading a profile;
* replacing authored setup;
* restoring backup;

could leave Preview/source state mismatched.

Inspect current/historical behavior only where evidence makes this plausible.

Do not turn this into a general persistence audit.

---

## 32. Determinism

Once the smallest failing or closest reproduction is found, execute it repeatedly.

Equivalent semantic inputs must yield equivalent Work dates.

Record any hidden dependency on:

* current date;
* locale;
* timezone;
* array order;
* persisted state;
* range start;
* week-start preference.

---

## 33. Root-Cause Classification

If reproduced, classify the primary defect layer exactly once:

### RC-A — Work Weekday Eligibility

### RC-B — Cycle / Rotation Alignment

### RC-C — Planning-Range / Expansion Offset

### RC-D — Canonical User-Day Assignment

### RC-E — Preview Projection

### RC-F — Month Date Projection

### RC-G — Calendar Grid Rendering

### RC-H — Stale/Mismatched Derived State

### RC-I — Persistence/Profile State Mismatch

### RC-J — Other Bounded Root Cause

If multiple layers contribute, identify one primary and any secondary contributors.

---

## 34. DF-006 Final Classification

Supersede the previous DF-006 interpretation with exactly one:

### BR1 — Confirmed Current Defect

The recovered weekday-only, non-overnight condition reproduces in current code and contradicts Intended Truth.

### BR2 — Confirmed Current Defect, Different Mechanism

The weekend symptom reproduces, but through a mechanism different from the original suspicion.

### BR3 — Valid Behavior / User-Day Interpretation

Use only if the recovered weekday-only, non-overnight screenshot condition itself is demonstrated to be valid under Intended Truth.

The previous overnight control is insufficient for BR3.

### BR4 — Historical Defect / Currently Corrected

Screenshot evidence supports the historical defect, but current executable code no longer reproduces it and evidence supports an intervening correction.

### BR5 — Historical Observation Confirmed, Current Reproduction Not Achieved

The screenshot confirms Experienced Truth, but current code does not reproduce the condition and no correction can be established.

### BR6 — Exact Reproduction Blocked

Critical original state remains unrecoverable and prevents reliable classification beyond the screenshot evidence.

Choose exactly one.

---

## 35. Severity

Reassess the prior downgrade from S1 to S3.

If DF-006 is a current deterministic Work-date defect, evaluate severity based on consequences to:

* schedule correctness;
* Capacity;
* Friction;
* Goal planning;
* publication;
* execution;
* user trust.

Do not retain S3 merely because the previous audit assigned it.

Do not automatically restore S1 without consequence analysis.

---

## 36. Architecture Reopen Check

Answer explicitly:

> Does DF-006 reveal an architecture problem?

Expected result if the issue is date generation/rendering:

> **No. The accepted architecture already defines canonical user-day ownership and authored Work authority sufficiently.**

If current behavior contradicts that architecture, classify it as implementation defect/alignment evidence.

Architecture should be reopened only if the intended answer itself is ambiguous.

---

## 37. Implementation Alignment Consequence

State exactly what the future Implementation Alignment Strategy should receive.

If current defect:

* root cause;
* affected files/symbols;
* invariant;
* reproduction;
* regression requirement;
* downstream domains potentially contaminated by incorrect Work dates.

If historical-only:

* historical defect evidence;
* current preservation requirement;
* regression requirement.

If presentation-only:

* correct underlying source;
* faulty projection/render layer;
* UX trust consequence.

Do not create the implementation task.

---

## 38. Downstream Contamination Check

If incorrect Work exists in generated source data, determine which derived domains can inherit the bad date:

```text
Work
→ occupied time
→ Capacity
→ Commitment placement
→ Friction
→ Preview
→ publication
→ Execution
→ history
```

This does not require implementing future Capacity architecture.

It requires identifying how far current incorrect Work data propagates.

If the defect is rendering-only, explicitly state that underlying schedule semantics remain correct.

---

## 39. Regression Requirements

At minimum preserve these future regression requirements:

### DF006-REG-01

A Monday–Friday non-overnight Work definition must not generate canonical Saturday or Sunday Work.

### DF006-REG-02

Two Monday–Friday non-overnight shift definitions must not introduce weekend Work merely because both exist.

### DF006-REG-03

Changing planning-range start must not alter weekday recurrence eligibility.

### DF006-REG-04

Changing Review/Month presentation week-start must not alter authored Work recurrence.

### DF006-REG-05

Cycle alignment must preserve authored weekday membership.

### DF006-REG-06

Broad planning ranges must produce the same semantic Work occurrences for an overlapping interval as narrow planning ranges.

### DF006-REG-07

A calendar crossover control must remain distinguishable from canonical recurrence ownership.

### DF006-REG-08

Month rendering must place Work in the cell corresponding to its actual projected date.

### DF006-REG-09

A stale Preview must be visibly distinguishable from a freshly generated Preview.

Add more if root cause requires them.

Do not write the tests.

---

## 40. Required Evidence Table

Produce:

| Evidence                              | Truth Type  | Supports                    | Contradicts                 | Confidence |
| ------------------------------------- | ----------- | --------------------------- | --------------------------- | ---------- |
| Recovered Work Pattern screenshot     | Experienced | Mon–Fri/non-overnight setup | prior overnight explanation |            |
| Recovered Month screenshot            | Experienced | weekend anomaly             | clean expected presentation |            |
| Prior Saturday overnight reproduction | Implemented | valid crossover semantics   | use as DF-006 explanation   |            |
| Current reproduction                  | Implemented |                             |                             |            |
| Accepted architecture                 | Intended    |                             |                             |            |

Add repository evidence as required.

---

## 41. Required Date Trace Table

For each anomalous or reproduced Work occurrence:

| Layer                | Date | Weekday | User-Day | Source ID | Shift ID | Notes |
| -------------------- | ---- | ------- | -------- | --------- | -------- | ----- |
| Authored eligibility |      |         |          |           |          |       |
| Cycle expansion      |      |         |          |           |          |       |
| Generated Work       |      |         |          |           |          |       |
| Preview              |      |         |          |           |          |       |
| Month projection     |      |         |          |           |          |       |
| Rendered cell        |      |         |          |           |          |       |

This table is mandatory for at least one anomalous occurrence if reproduction succeeds.

---

## 42. Required Boundary Matrix

Produce:

| Boundary                    | Tested? | Changes Semantic Work Date? | Expected? | Evidence |
| --------------------------- | ------: | --------------------------: | --------: | -------- |
| Sunday vs Monday week start |         |                             |           |          |
| narrow vs broad range       |         |                             |           |          |
| range start weekday         |         |                             |           |          |
| cycle anchor                |         |                             |           |          |
| one vs two shifts           |         |                             |           |          |
| day boundary                |         |                             |           |          |
| Month grid start            |         |                             |           |          |
| stale vs fresh Preview      |         |                             |           |          |

---

## 43. Required Prior-Audit Correction Decision

Create a specific decision:

### `DF006-DEC-01 — Prior BR3 Reassessment`

It must state:

* why the prior reproduction was valid;
* why it did not match the recovered Dogfood configuration;
* why the previous inference is no longer sufficient;
* whether BR3 is withdrawn/superseded for DF-006;
* how historical audit integrity is preserved without editing the prior result.

---

## 44. Required Reproduction Decisions

Create:

`DF006-DEC-01`, `DF006-DEC-02`, etc.

Each must include:

* **Decision**
* **Evidence**
* **Intended Truth**
* **Implemented Truth**
* **Experienced Truth**
* **Reasoning**
* **Consequence**
* **Regression Requirement**
* **Remaining Question**

At minimum cover:

1. prior BR3 reassessment;
2. screenshot configuration reconstruction;
3. anomalous weekend-date identification;
4. generated-source versus rendering boundary;
5. weekday eligibility;
6. cycle alignment;
7. planning-range effect;
8. week-start effect;
9. canonical user-day effect;
10. multiple-shift effect;
11. broad-range effect;
12. stale Preview control;
13. root cause;
14. severity;
15. architecture reopen;
16. implementation-alignment consequence;
17. final DF-006 classification;
18. reproduction closure.

---

## 45. Targeted Validation

Inspect and run existing tests relevant to:

* Work generation;
* shift cycles;
* weekday eligibility;
* user-day boundaries;
* schedule generation;
* Month projection;
* Preview;
* stale Preview;
* Work Pattern persistence where relevant.

Temporary reproduction scripts may be created outside the repository.

Do not modify tests.

Do not add tests.

Report:

* exact commands;
* test files;
* passed;
* failed;
* reproduction commands;
* reproduction outputs relevant to DF-006.

---

## 46. Result Closure

Choose exactly one:

### DF006-C1 — Current Defect Confirmed and Bounded

Current code reproduces the weekday-only weekend anomaly and root cause is sufficiently identified for Implementation Alignment Strategy.

### DF006-C2 — Historical Defect Confirmed, Current Code Correct

Recovered screenshot establishes the historical behavior, current code does not reproduce it, and evidence supports correction since Dogfood.

### DF006-C3 — Historical Observation Confirmed, Current Cause Unresolved

Recovered screenshot establishes the observation, but current reproduction/root cause remains unresolved.

### DF006-C4 — Presentation Misinterpretation Demonstrated

The exact recovered condition is shown to be valid and the apparent weekend Work is conclusively not unauthorized Work.

### DF006-C5 — Additional State Recovery Required

The screenshot evidence is insufficient to isolate the behavior and a specific missing state is required.

Choose exactly one.

---

## 47. Next-Step Gate

Select exactly one.

### Path A — Implementation Alignment Strategy

Choose for `DF006-C1`, `DF006-C2`, or `DF006-C4` when DF-006 is sufficiently bounded.

### Path B — One Final Bounded DF-006 Investigation

Choose for `DF006-C3` only when one exact technical uncertainty remains.

### Path C — State Recovery

Choose for `DF006-C5`.

### Path D — Architecture Reconciliation

Choose only if the evidence exposes a genuine ambiguity or contradiction in Intended Truth.

Do not begin the selected task.

Do not create an implementation roadmap.

Do not name the next implementation phase.

---

## 48. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/DF_006_TARGETED_REPRODUCTION_ADDENDUM_RESULT.md`

The filename must contain `RESULT`.

Do not modify:

`DOGFOOD_PASS_01_TARGETED_BUG_REPRODUCTION_RESULT.md`

The previous result is historical evidence and must remain immutable.

The addendum supersedes its DF-006 interpretation where explicitly stated.

---

## 49. Required Result Structure

The artifact must contain at minimum:

1. Executive Result
2. Reason for Reopening DF-006
3. Scope
4. Source Inventory
5. New Screenshot Evidence
6. Prior BR3 Reassessment
7. Truth Model
8. Intended Work Invariant
9. Reconstructed Dogfood Configuration
10. Anomalous Weekend Dates
11. Current Work Generation Trace
12. Current Month Projection Trace
13. Exact Anomalous Occurrence Trace
14. Weekday Representation Audit
15. Week-Start Analysis
16. Cycle Anchor Analysis
17. Planning-Range Analysis
18. Expanded-Window Analysis
19. Canonical User-Day Analysis
20. Shift-Ordering Analysis
21. Multiple-Shift Analysis
22. Cycle/Rotation Analysis
23. Month-Boundary Analysis
24. Broad-Range Analysis
25. Timezone/DST Analysis
26. Calendar-Grid Analysis
27. Event-Identity Analysis
28. Stale-Preview Control
29. Profile/Restore Control
30. Minimal Reproduction Matrix
31. Screenshot-Date Reproduction
32. Current-vs-Historical Behavior
33. Determinism
34. Root Cause
35. DF-006 Final Classification
36. Severity Reassessment
37. Architecture Reopen Check
38. Downstream Contamination
39. Implementation Alignment Consequence
40. Regression Requirements
41. Evidence Table
42. Date Trace Table
43. Boundary Matrix
44. Existing-Test Evidence
45. Reproduction Decisions
46. Validation
47. Repository Modification Verification
48. Result Closure
49. Recommended Next Step
50. Conclusions
51. Completion Statement

---

## 50. Artifact Verification

After writing:

1. verify the exact artifact exists;
2. reopen and read it;
3. verify screenshot evidence is represented;
4. verify no unreadable screenshot detail was invented;
5. verify the prior overnight reproduction is treated as a control rather than the recovered DF-006 condition;
6. verify `DF006-DEC-01` explicitly reassesses BR3;
7. verify the exact anomalous weekend date(s) are identified where evidence permits;
8. verify at least one occurrence is traced end-to-end if reproduction succeeds;
9. verify generated-source versus rendering is resolved;
10. verify weekday representations were inspected;
11. verify week-start was inspected;
12. verify cycle alignment was inspected;
13. verify planning-range behavior was inspected;
14. verify broad-versus-narrow range was inspected;
15. verify canonical user-day behavior was inspected;
16. verify multiple-shift behavior was inspected;
17. verify stale Preview was controlled;
18. verify Month grid alignment was inspected;
19. verify root cause is evidence-grounded;
20. verify exactly one BR classification is selected;
21. verify exactly one DF006-C closure is selected;
22. verify exactly one next-step path is selected;
23. verify severity is reassessed;
24. verify regression requirements are complete;
25. verify no implementation fix was performed;
26. verify no production code changed;
27. verify no tests changed;
28. verify no prior audit result changed;
29. verify no architecture/governance file changed;
30. inspect repository status;
31. verify the result artifact was the sole repository write.

---

## 51. Completion Criteria

The task is complete only when:

* [ ] recovered screenshot evidence was treated as new Experienced Truth;
* [ ] prior BR3 reasoning was reassessed;
* [ ] prior Saturday-overnight reproduction was retained only as a valid control unless exact evidence supports otherwise;
* [ ] demonstrated Work definitions were reconstructed as Monday–Friday/non-overnight;
* [ ] exact shift times were recovered where evidence permits;
* [ ] no unreadable value was guessed;
* [ ] anomalous weekend dates were identified where possible;
* [ ] anomalous displayed content was verified to actually be Work;
* [ ] Work generation path was traced;
* [ ] Month projection/render path was traced;
* [ ] source-vs-presentation boundary was resolved;
* [ ] weekday representation was inspected;
* [ ] Sunday/Monday indexing was inspected;
* [ ] week-start preference was tested where relevant;
* [ ] cycle anchor was tested;
* [ ] planning-range start was tested;
* [ ] expanded planning window was inspected;
* [ ] canonical user-day boundary was tested;
* [ ] one-shift versus two-shift behavior was tested;
* [ ] recovered cycle/rotation was tested where reconstructable;
* [ ] narrow versus broad range was tested;
* [ ] screenshot date/week was reproduced where possible;
* [ ] Month grid alignment was inspected;
* [ ] event identity was traced;
* [ ] stale Preview was controlled;
* [ ] profile/restore mismatch was considered only where evidence warranted;
* [ ] deterministic behavior was assessed;
* [ ] current versus historical behavior was distinguished;
* [ ] root cause was classified if reproduced;
* [ ] DF-006 received exactly one current BR classification;
* [ ] severity was reassessed;
* [ ] architecture reopen was explicitly assessed;
* [ ] downstream contamination was assessed;
* [ ] implementation-alignment consequence was stated;
* [ ] regression requirements were stated;
* [ ] Evidence Table is complete;
* [ ] Date Trace Table is complete where reproduction succeeds;
* [ ] Boundary Matrix is complete;
* [ ] Minimal Reproduction Matrix is complete;
* [ ] all required `DF006-DEC-*` decisions exist;
* [ ] exactly one DF006-C closure is selected;
* [ ] exactly one next-step path is selected;
* [ ] no defect was fixed;
* [ ] no production code was modified;
* [ ] no tests were modified;
* [ ] no prior audit artifact was modified;
* [ ] no architecture/governance artifact was modified;
* [ ] no implementation roadmap was created;
* [ ] no implementation phase was named;
* [ ] exact result artifact was created;
* [ ] result artifact was reopened and verified;
* [ ] repository status was inspected;
* [ ] result artifact was the sole repository write.

---

## 52. Final Completion Statement

End `DF_006_TARGETED_REPRODUCTION_ADDENDUM_RESULT.md` with exactly:

> **DF-006 Targeted Reproduction Addendum complete.**
>
> The addendum reopens DF-006 in response to recovered Dogfood screenshot evidence demonstrating a Monday-through-Friday, non-overnight Work configuration inconsistent with the prior Saturday-overnight crossover explanation; preserves the earlier reproduction as a valid canonical user-day control without allowing it to overwrite the recovered Experienced Truth; reconstructs the demonstrated Work configuration and anomalous weekend planning state; traces Work from authored weekday authority through cycle expansion, generated Work, Preview projection, Month projection, and rendered calendar placement; tests weekday indexing, cycle anchors, planning-range boundaries, canonical user-day behavior, multiple-shift interaction, broad-range generation, stale Preview, and calendar-grid alignment as evidence requires; determines whether the anomaly originates in schedule semantics, derived-state projection, presentation, historical behavior, or another bounded mechanism; supersedes the prior DF-006 classification where warranted while preserving immutable audit history; states the resulting severity, regression requirements, downstream contamination risk, and Implementation Alignment consequence; and determines whether DayFrame may proceed to Implementation Alignment Strategy without modifying production code, tests, prior audits, architecture, governance, or the implementation roadmap.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/audits/DF_006_TARGETED_REPRODUCTION_ADDENDUM_RESULT.md`
>
> **Repository modifications:** The required DF-006 addendum result artifact was the sole repository write.
>
> **Prior BR3 disposition:** State whether the previous DF-006 BR3 classification is withdrawn, superseded, or retained.
>
> **DF-006 classification:** Report BR1, BR2, BR3, BR4, BR5, or BR6.
>
> **DF-006 closure:** Report DF006-C1, DF006-C2, DF006-C3, DF006-C4, or DF006-C5.
>
> **Validation:** Report targeted existing tests and reproduction commands/results.
>
> **Recommended next step:** Report Path A, B, C, or D without beginning that work.
