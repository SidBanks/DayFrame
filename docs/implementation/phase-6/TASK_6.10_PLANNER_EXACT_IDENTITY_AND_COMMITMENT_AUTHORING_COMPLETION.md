# Task 6.10 — Planner Exact-Identity and Commitment Authoring Completion

## Status

Ready for implementation.

## Phase

Phase 6 — Product-Surface Convergence

## Task Type

Planner bounded remediation of stale contextual Commitment identity, recurrence-authoring completeness, duplicate advanced Commitment authoring, directly related product-language cleanup, regression testing, accessibility/focus preservation, bundle discipline, and governance.

**This task does not redesign Commitment authority, recurrence semantics, scheduler behavior, Event authority, Work architecture, Today, Summary, Recommendations, Capacity, or transition planning.**

---

# 1. Objective

Resolve the remaining P1 Planner gaps identified by Task 6.9 so that Phase 6 can proceed to final manual/browser validation.

The required fixes are:

1. prevent stale Review Schedule Commitment actions from retargeting a recreated current source;
2. make ordinary Commitment recurrence authoring complete and truthful for every option exposed;
3. remove or reconcile the duplicate raw advanced Commitment Add/Delete path;
4. clean the directly related user-facing Preview / Block Template terminology without broad refactor.

Task 6.10 should leave Planner with one coherent ordinary Commitment workflow and exact contextual identity semantics.

---

# 2. Governing Audit Result

Task 6.9 determined:

* Planner, Today, and Summary are architecturally coherent;
* there is no P0 architecture blocker;
* Phase 6 requires bounded remediation, not a new architecture audit;
* the primary P1 defects are localized to Planner Commitment identity and authoring;
* Task 6.11 remains the final browser/accessibility/mobile publication pass.

Do not reopen settled Phase 6 authority architecture unless implementation evidence triggers a stop condition.

---

# 3. Governing Identity Principle

> **A stale generated occurrence may refer only to the exact source incarnation that produced it. It must never silently edit a recreated current source.**

Review Schedule contextual navigation must therefore use exact identity or refuse the edit.

Logical identity alone is insufficient when incarnation may have changed.

Never repair this by:

* title matching;
* recurrence matching;
* current logical-ID lookup without incarnation check;
* source-family fallback.

---

# 4. Governing Commitment Principle

Commitment remains a **product projection over existing canonical authored sources**.

Do not create:

* a new Commitment authority;
* a new Commitment store;
* a new Commitment persistence participant;
* a new Commitment incarnation model.

Use the existing template / recurrence identities and incarnations already governed by the current authored setup model.

---

# 5. Governing Recurrence Principle

> **Every recurrence option shown as selectable must be fully authorable from the bounded Commitment workflow.**

If an option requires additional parameters, the UI must collect and validate them.

If an option is not truthfully supported by the bounded Commitment workflow, it must not appear as a normal complete choice.

Do not weaken domain validation merely to accept incomplete UI output.

---

# 6. Governing One-Workflow Principle

Ordinary Commitment creation/removal must have one product path.

The existing bounded:

* Add Commitment;
* Edit Commitment;
* Remove Commitment;

workflow should be canonical for ordinary template/recurrence-backed Commitments.

The advanced Setup area may remain only for genuinely advanced fields/configuration.

It must not expose a parallel ordinary:

* Add Block Template;
* Delete Block Template;

path after Task 6.10 unless the audit proves a distinct non-Commitment semantic need.

---

# 7. Governing Terminology Principle

Clean only directly related product terminology.

Preferred direction where semantics support it:

```text
Preview Range      → Planning Range / Schedule Range
Include in Preview → Include in Schedule
Block Template     → Commitment
```

Do not perform broad internal symbol renames.

Do not mechanically rename technical terms that remain appropriate in code/tests.

---

# 8. Explicit Scope

Implement:

* exact Review Schedule Commitment provenance audit;
* exact incarnation-aware contextual edit targeting;
* stale/recreated target rejection;
* stale-target user feedback;
* recurrence chooser audit;
* complete `specificWeekdays` authoring;
* complete `timesPerUserWeek` authoring;
* truthful treatment of `perShiftSegment`;
* truthful treatment of `custom`;
* recurrence validation UI;
* recurrence edit preservation;
* recurrence hidden-field preservation;
* duplicate advanced Commitment Add/Delete path reconciliation/removal;
* advanced-field preservation for existing Commitments;
* directly related Preview/Block Template terminology cleanup;
* focus/accessibility preservation;
* profile/restore/full-clear target invalidation;
* regression coverage;
* bundle validation;
* governance.

---

# 9. Explicit Non-Goals

Do not implement:

* new recurrence type;
* new recurrence semantics;
* recurrence migration;
* new Commitment authority;
* Pattern Library;
* reusable Pattern authority;
* Event → Commitment collapse;
* Work → generic Commitment collapse;
* scheduler redesign;
* direct schedule editing;
* drag/drop;
* Capacity;
* Planned Allocation;
* Recommendations;
* Goal-based recurrence;
* transition-adaptation recurrence;
* Today contextual editing;
* Summary editing;
* Backup version bump unless a true schema change is unexpectedly required;
* broad Setup retirement.

---

# 10. Execution Artifact Rules

Before implementation:

1. verify this Task 6.10 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Task 6.9 result;
   * Task 6.8 result;
   * Task 6.7 result;
   * `CommitmentSection`;
   * `SetupScreen`;
   * `PreviewScreen` / Review Schedule;
   * occurrence/source identity types;
   * recurrence types;
   * recurrence validation;
   * recurrence generation;
   * Goal-link exact source resolution;
   * profile replacement;
   * restore;
   * full clear;
   * lazy Plan authoring;
   * bundle guard;
5. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-6/TASK_6.10_PLANNER_EXACT_IDENTITY_AND_COMMITMENT_AUTHORING_COMPLETION_RESULT.md`

---

# 11. Mandatory Initial Identity Audit

Before changing code, trace the current Review Schedule → Edit Commitment path mechanically.

Document:

* what identity Preview occurrence carries;
* what identity unplaced candidate carries;
* what identity friction participant carries;
* what exact fields contextual navigation sends;
* how Plan authoring resolves that target;
* whether current template incarnation is looked up from logical ID;
* whether recurrence identity/incarnation is independently checked;
* how deleted/recreated sources behave;
* how stale Preview behaves after Save Setup;
* how profile load, restore, and full clear invalidate targets.

Reproduce the Task 6.9 failure case in a focused test before remediation where practical.

---

# 12. Required Identity Failure Fixture

Create a deterministic fixture conceptually equivalent to:

```text
incarnation A
    Commitment logical ID = errands

generate schedule
    occurrence references A

remove A
save

recreate
    Commitment logical ID = errands
    incarnation B

old/stale Review Schedule occurrence from A
    user chooses Edit Commitment
```

Required result after remediation:

```text
A ≠ B

do not open B

show source unavailable / stale target
```

Do not rely on display label differences.

The fixture should still fail correctly if A and B have identical title, recurrence, duration, and display timing.

---

# 13. Exact Commitment Navigation Identity

Determine the narrowest existing exact identity required to prove current editability.

Likely dimensions may include:

* source kind;
* template logical ID;
* template incarnation;
* recurrence logical ID;
* recurrence incarnation.

Use actual repository types.

Do not invent extra durable identity if existing identity is sufficient.

---

# 14. Derived Preview Provenance

If Review Schedule currently omits an existing source incarnation that is required for exact navigation, Task 6.10 may add it as **derived Preview navigation provenance** only if:

* the value already exists in canonical authored identity;
* it does not alter scheduler behavior;
* it is non-durable;
* it is not persisted as new authority;
* it is not backfilled from history;
* it is used only to preserve exact current navigation.

If a durable schema change would be required, stop.

---

# 15. Navigation Target Contract

Prefer one exact contextual target contract.

Conceptually:

```text
editCommitment({
    templateId,
    templateIncarnation,
    recurrenceId,
    recurrenceIncarnation
})
```

Use actual canonical names/types.

Do not pass only logical IDs if incarnation exists.

---

# 16. Target Revalidation

After lazy Plan authoring loads:

1. re-read current canonical draft/state;
2. locate the exact source identity;
3. verify the exact incarnation;
4. verify any paired recurrence identity;
5. open editor only if all required identity checks pass.

Do not trust a target captured before lazy loading without revalidation.

---

# 17. Missing/Stale Target UX

If exact source is unavailable:

show concise product copy such as:

> This commitment has changed or is no longer available to edit from this schedule.

Possible action:

**Return to Plan**

or equivalent stable navigation.

Do not say:

* corrupted;
* broken;
* invalid data.

Do not silently select a current replacement.

---

# 18. Same-Identity Edit

If the same exact source incarnation still exists:

open the editor normally.

Renames/field edits that preserve incarnation must continue to resolve.

Mandatory regression.

---

# 19. Source Removal

If source no longer exists:

contextual edit unavailable.

Mandatory regression.

---

# 20. Source Recreation

If recreated under the same logical ID but new incarnation:

contextual edit unavailable from the stale occurrence.

Mandatory regression.

---

# 21. Profile Replacement

If profile load replaces current authored sources:

old contextual targets must not resolve to replacement sources unless exact incarnation remains valid under canonical semantics.

Use actual profile identity behavior.

---

# 22. Restore Replacement

Restore follows the same exact-target rule.

No stale retarget.

---

# 23. Full Clear

Any open/pending Commitment target becomes unavailable.

No stale editor survives.

---

# 24. Goal-Link Compatibility

Do not weaken Task 5 exact Goal-link semantics.

Verify:

* editing same source incarnation keeps Goal link available;
* removal makes old Goal link unavailable;
* recreation does not retarget Goal link;
* Review contextual edit now behaves consistently with Goal exact-link semantics.

---

# 25. Mandatory Recurrence Audit

Enumerate all current recurrence variants from the canonical domain.

For each document:

* required fields;
* optional fields;
* validator rules;
* engine support;
* current Commitment UI support;
* edit support;
* display summary support.

Do not assume enum membership implies V1 product support.

---

# 26. Expected Recurrence Families

Audit at minimum the currently known families:

```text
daily
weekly
specificWeekdays
timesPerUserWeek
perShiftSegment
custom
```

Use actual repository names.

Task 6.9 found that ordinary bounded authoring currently exposes them too uniformly.

---

# 27. Daily Recurrence

If `daily` requires no additional parameters:

retain simple selection.

Ensure existing saved values round-trip.

---

# 28. Weekly Recurrence

Audit what canonical `weekly` means.

If it requires an anchor/day parameter, the bounded UI must collect it.

If current domain derives it from another field, preserve that behavior.

Do not infer semantics.

---

# 29. Specific Weekdays

If `specificWeekdays` requires explicit weekday values:

show a complete weekday chooser.

Requirements:

* at least one valid weekday where validator requires it;
* deterministic ordering;
* keyboard accessibility;
* visible selected state;
* edit round-trip;
* no duplicate days;
* canonical weekday representation.

Do not persist an incomplete frequency object.

---

# 30. Times Per User-Week

If `timesPerUserWeek` requires a count:

show a bounded numeric control.

Requirements:

* canonical min/max if validator defines them;
* integer-only;
* visible label;
* validation;
* edit round-trip;
* user-week wording remains canonical;
* no 168-hour explanation.

Do not call it “times per 7 days” unless that exactly matches semantics.

---

# 31. Per-Shift-Segment

Task 6.3 audit previously found `perShiftSegment` unsupported by generation unless later implementation changed that.

Re-audit current engine before deciding UI.

If still unsupported:

* do not present it as an ordinary usable recurrence option;
* either omit it from bounded Commitment authoring;
* or show it as explicitly unavailable/advanced if there is a truthful product reason.

Do not let users save a configuration that generation will deterministically reject.

---

# 32. Custom Recurrence

Likewise re-audit.

If `custom` has no canonical bounded authoring semantics or engine support:

* omit it from ordinary recurrence choices;
* or expose only through an honest advanced path if current architecture already supports a meaningful representation.

Do not show a generic “Custom” choice that cannot be completed.

---

# 33. Unsupported Existing Data

If existing stored profiles/backups can contain recurrence variants that the bounded editor does not support editing:

do not destroy them.

Possible truthful behavior:

* read-only recurrence summary;
* advanced-fields editor;
* unsupported-edit message;
* preserve hidden fields on unrelated edits.

Do not normalize them to a supported recurrence.

---

# 34. Recurrence Edit Preservation

Editing:

* title;
* duration;
* priority;
* preferred timing;

must not erase recurrence-specific parameters.

Mandatory regression.

---

# 35. Recurrence Type Change

When changing recurrence family:

* initialize required fields truthfully;
* clear fields that are invalid for the new type only if canonical domain semantics require it;
* do not retain contradictory hidden parameters;
* do not silently persist invalid mixed shapes.

Use validator contracts.

---

# 36. Recurrence Validation UX

Invalid recurrence configuration must:

* block Add/Update into the canonical draft;
* show textual error;
* focus the first invalid control where practical;
* preserve the user's other entered values.

Do not rely only on domain validation after Save Setup.

---

# 37. Commitment Summary

Inventory recurrence summaries should remain truthful.

Examples only where supported:

```text
Every day
Every week
Monday, Wednesday, Friday
3 times per user-week
```

Unsupported/advanced recurrence should not be rendered as though fully editable if it is not.

---

# 38. Duplicate Advanced Commitment Path Audit

Trace all advanced Setup controls that can currently:

* Add Block Template;
* Delete Block Template;
* create recurrence;
* delete recurrence;
* create an ordinary flexible source equivalent to Add Commitment.

Identify exact duplicates of the bounded Commitment workflow.

---

# 39. Canonical Product Writer

After Task 6.10, ordinary flexible Commitment creation should have one product-facing writer:

**Add Commitment**

Ordinary removal should have one product-facing writer:

**Remove Commitment**

Do not leave a second equally prominent raw writer.

---

# 40. Advanced Escape Hatch

Advanced Setup may remain for fields not yet surfaced in the bounded workflow.

It may edit existing canonical Commitment sources if needed.

It should not function as a second generic source-creation UI.

Preferred direction:

```text
Advanced Commitment Fields
    selected existing Commitment
    uncommon canonical fields
```

rather than:

```text
Add Block Template
Delete Block Template
```

Use actual implementation evidence.

---

# 41. Advanced Existing-Source Selection

If advanced fields need an existing Commitment target:

reuse exact canonical Commitment identity.

Do not create an advanced list keyed only by title.

---

# 42. Advanced Delete

If Remove Commitment already covers canonical ordinary deletion:

remove the duplicate advanced delete control.

If an advanced delete operation has distinct semantics, document them before retaining it.

---

# 43. Hidden Field Preservation

The bounded Commitment editor and any advanced editor must preserve canonical fields not currently visible in the active form unless intentionally changed.

Mandatory regression.

---

# 44. Preview Range Terminology

Replace user-facing **Preview Range** with a truthful planning/schedule term.

Preferred candidate:

**Planning Range**

if it means the authored horizon over which a schedule is generated.

Audit actual semantics before selecting final copy.

Do not rename internal `previewRange` types solely for UI consistency.

---

# 45. Include in Preview Terminology

Replace **Include in Preview** with schedule-oriented language if semantics are equivalent.

Likely:

**Include in Schedule**

or:

**Include when generating the schedule**

Use actual meaning.

Do not imply execution.

---

# 46. Block Template Terminology

Remove primary product-facing **Block Template** where it refers to ordinary Commitments.

Internal advanced technical labeling may remain only where genuinely necessary.

Do not perform repository-wide symbol renames.

---

# 47. Segment Terminology

Task 6.9 classified raw cycle/segment wording as P2.

Task 6.10 may clean directly adjacent labels/help text if touching the same advanced Plan region.

Do not redesign Work/cycle semantics.

If cleanup becomes substantial, defer remaining Work terminology to Task 6.11 only if browser evidence shows a material usability issue.

---

# 48. Save Setup Boundary

Do not rename **Save Setup** merely because other terminology is changing.

Audit whether Task 6.10 changes enough visible Setup composition to justify a rename.

Default:

> preserve Save Setup.

A broader rename can be a future product-language decision.

---

# 49. Commitment Draft Semantics

Preserve Task 6.7:

```text
field typing
    → local ephemeral editor state

Add to Plan / Update Commitment
    → canonical SetupDraft

Save Setup
    → durable authored scheduling state

Refresh Schedule
    → regenerate derived schedule
```

Do not introduce per-Commitment persistence.

---

# 50. Schedule Staleness

Equivalent Commitment changes must preserve the same schedule-staleness behavior as before.

Do not change stale semantics while fixing recurrence or identity.

---

# 51. Review Schedule Stale Visibility

The exact-identity fix must work while old stale Review Schedule remains visible.

Do not solve retargeting by automatically clearing stale Preview.

The governing UX remains:

```text
saved authored change
    ↓
old schedule remains visible
    ↓
schedule marked stale
    ↓
old source action may become unavailable
    ↓
explicit Refresh Schedule
```

This distinction is important.

---

# 52. Generated Schedule Identity

Do not mutate old derived occurrence identity after current source recreation merely to keep Edit available.

The stale schedule must continue representing what generated it.

---

# 53. Unplaced Contextual Identity

Apply the same exact-incarnation rule to unplaced Commitment actions if they can survive source replacement/staleness.

Do not fix only scheduled occurrences.

---

# 54. Friction Participant Identity

Audit whether friction participant contextual edits use the same navigation contract.

If so, exact-incarnation remediation must cover them too.

Do not leave a second stale-retarget path.

---

# 55. Event Boundary

Do not modify Event identity or write semantics.

Task 6.9 found Event contextual navigation already revalidates exact incarnation correctly.

Use Event behavior as a consistency reference, not as a reason to merge authorities.

---

# 56. Work Boundary

Do not modify Work's composite contextual navigation unless exact-identity remediation shares generic infrastructure safely.

Work does not need to pretend to have singular Commitment identity.

---

# 57. Today Boundary

No changes to:

* Today query;
* Today cutoff;
* outcome reporting;
* ExecutionHistory;
* current user-day.

Mandatory regression where relevant.

---

# 58. Summary Boundary

No changes to:

* Summary projections;
* Goal Activity;
* Progress;
* historical evidence;
* Summary navigation.

---

# 59. Profile Behavior

Profile load must:

* replace current authored scheduling setup as before;
* update Commitment inventory;
* invalidate stale contextual exact targets;
* preserve Goal authority independence.

---

# 60. Backup/Restore

No new Backup version expected.

All recurrence fields already belong to canonical authored setup if this task is truly UI remediation.

Verify Backup V6 still round-trips all recurrence variants.

If a schema change becomes necessary, stop.

---

# 61. Full Clear

Clear:

* Commitment inventory naturally through authored state;
* local Add/Edit recurrence form;
* advanced selected source;
* pending contextual target;
* stale-target message where appropriate.

No new clear participant.

---

# 62. Protection

If canonical authored setup is protected/unavailable:

* do not render an editable empty Commitment inventory;
* do not expose advanced raw writers;
* contextual stale-target state must not bypass protection.

Reuse existing recovery semantics.

---

# 63. Accessibility — Exact Target Failure

The stale-target message must be textual and accessible.

If a contextual action opens a lazy authoring surface and then fails revalidation:

* announce the failure through existing status/alert conventions;
* move focus to a stable Planner heading/action.

---

# 64. Accessibility — Recurrence Chooser

Every recurrence option must be keyboard operable.

Conditional controls must have:

* visible labels;
* programmatic association;
* validation messaging;
* selected state where applicable.

Specific weekday controls must not be color-only.

---

# 65. Accessibility — Advanced Fields

If advanced fields remain collapsible:

* expose expanded state;
* retain logical heading hierarchy;
* do not hide the only way to fix a bounded-editor unsupported existing recurrence without explaining it.

---

# 66. Focus — Add Commitment

Opening Add Commitment focuses the correct first control.

If recurrence selection reveals required fields, focus remains predictable.

Invalid submission focuses the first recurrence-specific error when appropriate.

---

# 67. Focus — Contextual Edit

Review → Edit Commitment:

* lazy-load authoring;
* revalidate exact target;
* if valid, focus exact editor;
* if invalid, focus stable unavailable message/Planner context.

No focus should land in the recreated replacement.

---

# 68. Focus — Remove Duplicate Path

Removing the advanced duplicate writer must not leave keyboard users without a reachable Add/Remove Commitment control.

---

# 69. Responsive Behavior

Conditional recurrence controls must work on mobile without horizontal dependence.

Weekday controls may wrap.

Numeric count fields remain usable at narrow width.

Advanced fields remain readable.

---

# 70. Loading Architecture

Preserve Task 6.7/6.8 architecture.

Plan authoring remains lazy.

Do not move recurrence forms or exact-target resolution logic into the eager shell unless the logic is tiny and purely necessary navigation metadata.

Prefer resolving UI-heavy recurrence controls inside the existing Plan authoring chunk.

---

# 71. Bundle Baseline

Task 6.9 validated the Task 6.8 baseline unchanged:

```text
Initial raw        648,162
Initial gzip       164,161
Plan authoring      50,645
Today query          4,890
Today UI            11,282
Summary             30,100
Largest lazy        50,645
Total JS           745,080
```

Fixed budgets remain:

```text
Initial raw   <= 685,000
Initial gzip  <= 170,000
Largest lazy  <= 100,000
Total JS      <= 750,000
```

Task 6.10 begins with only **4,920 raw bytes of total-JS headroom**.

---

# 72. Bundle Strategy

Prefer:

* deleting duplicate advanced writer UI;
* reusing existing recurrence/domain controls/helpers;
* conditional rendering;
* no new runtime dependency;
* no duplicated editor implementation.

Task 6.10 should ideally be approximately bundle-neutral.

A net reduction is welcome but not required.

---

# 73. No Threshold Inflation

Mandatory.

Do not change bundle budgets.

---

# 74. No New Runtime Dependency

Mandatory.

---

# 75. Bundle Stop Condition

Stop if the bounded fixes cannot fit without:

* raising total-JS limit;
* adding a runtime dependency;
* duplicating recurrence editor logic;
* moving heavy Plan code eagerly;
* weakening validation.

Report the pressure rather than hacking around the guard.

---

# 76. Tests — Stale Recreated Commitment

Mandatory regression:

* schedule generated from incarnation A;
* A removed;
* same logical source recreated as B;
* old Review action invoked;
* B does not open.

---

# 77. Tests — Exact Current Commitment

Generated occurrence referencing current incarnation opens exact editor.

---

# 78. Tests — Rename Same Incarnation

Same source renamed without recreation still opens correctly.

---

# 79. Tests — Source Removal

Removed exact source yields unavailable target.

---

# 80. Tests — Profile Replacement

Old target does not retarget into profile replacement.

---

# 81. Tests — Restore Replacement

Old target does not retarget after restore replacement.

---

# 82. Tests — Full Clear

Old target cannot open after clear.

---

# 83. Tests — Unplaced Exact Identity

If unplaced contextual editing exists, reproduce exact/recreated behavior there too.

---

# 84. Tests — Friction Participant Identity

If contextual participant editing shares the path, cover recreation there too.

---

# 85. Tests — Daily Recurrence

Create/edit/round-trip.

---

# 86. Tests — Weekly Recurrence

Create/edit/round-trip according to actual required parameters.

---

# 87. Tests — Specific Weekdays

Cover:

* empty invalid state;
* one weekday;
* multiple weekdays;
* deterministic display order;
* edit round-trip;
* no duplicate weekdays.

---

# 88. Tests — Times Per User-Week

Cover:

* missing count;
* lower/upper bounds;
* non-integer rejection if applicable;
* valid count;
* edit round-trip;
* product summary.

---

# 89. Tests — Unsupported Per-Shift-Segment

If unsupported by generation:

assert bounded ordinary Commitment UI does not present it as a valid complete option.

If current existing data may contain it:

assert it remains preserved/readable through the chosen advanced/unsupported path.

---

# 90. Tests — Unsupported Custom

Same rule as above.

---

# 91. Tests — Recurrence Type Change

Cover transitions among supported recurrence kinds.

No stale incompatible fields.

No invalid saved shape.

---

# 92. Tests — Hidden Field Preservation

Editing unrelated Commitment fields preserves recurrence-specific values.

---

# 93. Tests — Duplicate Writer Removal

Assert ordinary Add/Delete Block Template controls are absent from primary/advanced user-facing Setup where Task 6.10 removes them.

Assert Add/Remove Commitment remains available.

---

# 94. Tests — Product Terminology

Assert current product UI uses the chosen:

* Planning/Schedule Range;
* Include in Schedule;
* Commitment;

language in the remediated areas.

Do not assert against internal code identifiers.

---

# 95. Tests — Schedule Staleness

Verify recurrence/Commitment edits retain canonical Save Setup → stale schedule behavior.

No auto-refresh.

---

# 96. Tests — Goal Links

Same-incarnation edit preserves links.

Remove/recreate does not retarget.

---

# 97. Tests — Event Independence

Event workflow remains unchanged.

---

# 98. Tests — Today/Summary Independence

No changed surface behavior.

Representative integration regression is sufficient.

---

# 99. Tests — Accessibility

Cover:

* recurrence labels;
* weekday selected state;
* count validation;
* stale-target alert/status;
* focus path;
* advanced disclosure;
* Add/Remove Commitment accessible controls.

---

# 100. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.10_PLANNER_EXACT_IDENTITY_AND_COMMITMENT_AUTHORING_COMPLETION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.9 Prerequisite Confirmation
4. Initial Identity Audit
5. Initial Recurrence Audit
6. Advanced Writer Audit
7. Files Changed
8. Exact Commitment Identity Model
9. Preview Navigation Provenance
10. Contextual Target Contract
11. Lazy Revalidation
12. Same-Incarnation Behavior
13. Removed-Source Behavior
14. Recreated-Source Behavior
15. Profile Replacement
16. Restore Replacement
17. Full Clear
18. Unplaced Identity
19. Friction Participant Identity
20. Goal-Link Compatibility
21. Recurrence Domain Inventory
22. Daily
23. Weekly
24. Specific Weekdays
25. Times Per User-Week
26. Per-Shift-Segment
27. Custom
28. Unsupported Existing Data
29. Recurrence Type Changes
30. Recurrence Validation
31. Recurrence Summary
32. Hidden Field Preservation
33. Original Advanced Commitment Path
34. Resulting Commitment Write Path
35. Advanced Escape Hatch
36. Advanced Existing-Source Selection
37. Duplicate Add Removal
38. Duplicate Delete Removal
39. Planning Range Terminology
40. Include-in-Schedule Terminology
41. Block Template Terminology
42. Segment Terminology
43. Save Setup Decision
44. Draft Semantics
45. Schedule Staleness
46. Stale Review Visibility
47. Event Boundary
48. Work Boundary
49. Today Boundary
50. Summary Boundary
51. Profile Behavior
52. Backup/Restore
53. Protection
54. Accessibility
55. Focus
56. Responsive Behavior
57. Loading Architecture
58. Bundle Strategy
59. Tests Added/Changed
60. Focused Validation
61. Full Validation
62. Bundle Validation
63. Manual Product Walkthrough
64. Governance Updates
65. ADR Determination
66. Deviations
67. Discoveries
68. Deferred Work
69. Identity Matrix
70. Recurrence Support Matrix
71. Recurrence Field Matrix
72. Advanced-Path Matrix
73. Terminology Matrix
74. Staleness Matrix
75. Replacement Matrix
76. Goal-Link Matrix
77. Accessibility Matrix
78. Loading Matrix
79. Bundle Matrix
80. Product-Boundary Matrix
81. Epistemic Matrix
82. Architectural Invariant Assessment
83. Stop-Condition Assessment
84. Architectural Alignment Assessment
85. Task 6.11 Readiness
86. Recommended Next Task
87. Final Completion Determination

---

# 101. Required Identity Matrix

| Context                  | Required exact identity | Current source must match incarnation? | Behavior if mismatch |
| ------------------------ | ----------------------- | -------------------------------------: | -------------------- |
| scheduled Commitment     |                         |                                    Yes |                      |
| unplaced Commitment      |                         |                                    Yes |                      |
| friction participant     |                         |                        Yes if editable |                      |
| Commitment inventory     |                         |                                    Yes |                      |
| same-source rename       |                         |                                    Yes |                      |
| recreated logical source |                         |                               No match | unavailable          |

---

# 102. Required Recurrence Support Matrix

| Recurrence       | Engine supported? | Validator requirements | Bounded Add | Bounded Edit | Advanced preservation |
| ---------------- | ----------------: | ---------------------- | ----------: | -----------: | --------------------: |
| daily            |                   |                        |             |              |                       |
| weekly           |                   |                        |             |              |                       |
| specificWeekdays |                   |                        |             |              |                       |
| timesPerUserWeek |                   |                        |             |              |                       |
| perShiftSegment  |                   |                        |             |              |                       |
| custom           |                   |                        |             |              |                       |

Use production evidence.

---

# 103. Required Recurrence Field Matrix

| Recurrence       | Required fields | UI controls | Validation | Summary copy |
| ---------------- | --------------- | ----------- | ---------- | ------------ |
| daily            |                 |             |            |              |
| weekly           |                 |             |            |              |
| specificWeekdays |                 |             |            |              |
| timesPerUserWeek |                 |             |            |              |
| supported other  |                 |             |            |              |

---

# 104. Required Advanced-Path Matrix

| Capability                          | Before 6.10 | After 6.10 | Canonical product writer |
| ----------------------------------- | ----------- | ---------- | ------------------------ |
| add ordinary Commitment             |             |            |                          |
| edit ordinary Commitment            |             |            |                          |
| remove ordinary Commitment          |             |            |                          |
| edit uncommon fields                |             |            |                          |
| unsupported recurrence preservation |             |            |                          |

---

# 105. Required Terminology Matrix

| Old user-facing term | New treatment |                  Internal rename? |
| -------------------- | ------------- | --------------------------------: |
| Preview Range        |               | No unless independently warranted |
| Include in Preview   |               |                                No |
| Block Template       |               |                   No broad rename |
| Segment              |               |                   audit-dependent |
| Save Setup           |               |                   likely preserve |

---

# 106. Required Staleness Matrix

| Action                      |      Draft mutation | Durable mutation | Schedule stale | Auto-refresh |
| --------------------------- | ------------------: | ---------------: | -------------: | -----------: |
| local recurrence typing     |                     |                  |                |              |
| Add to Plan                 |                     |                  |                |              |
| Update Commitment           |                     |                  |                |              |
| Save Setup                  |                     |                  |                |              |
| stale contextual navigation |                  No |               No |      unchanged |           No |
| recurrence validation error | No canonical change |               No |             No |           No |

---

# 107. Required Replacement Matrix

| Replacement      | Stale Review target | Open editor | Retarget allowed? |
| ---------------- | ------------------- | ----------- | ----------------: |
| source removed   |                     |             |                No |
| source recreated |                     |             |                No |
| profile load     |                     |             |                No |
| restore          |                     |             |                No |
| full clear       |                     |             |                No |

---

# 108. Required Goal-Link Matrix

| Scenario                    | Goal link                    | Review contextual edit          |
| --------------------------- | ---------------------------- | ------------------------------- |
| same-incarnation rename     | remains available            | opens exact source              |
| same-incarnation field edit | remains available            | opens exact source              |
| remove                      | unavailable                  | unavailable                     |
| recreate                    | old link unavailable         | old Review target unavailable   |
| profile replacement         | resolves exact current state | stale old target not retargeted |

---

# 109. Required Accessibility Matrix

| Interaction          | Requirement                       |
| -------------------- | --------------------------------- |
| stale target         | textual status/alert              |
| recurrence type      | labeled control                   |
| weekdays             | keyboard + selected state         |
| times/week           | labeled validated number          |
| validation error     | associated text + focus           |
| advanced fields      | disclosure semantics              |
| Add Commitment       | accessible primary control        |
| Remove Commitment    | contextual accessible name        |
| lazy contextual edit | deterministic valid/invalid focus |

---

# 110. Required Loading Matrix

| Area                | Eager/lazy |    Changed? | Reason |
| ------------------- | ---------- | ----------: | ------ |
| Planner shell       | eager      |             |        |
| Plan authoring      | lazy       | No expected |        |
| recurrence editor   |            |             |        |
| Review Schedule     | eager      |             |        |
| target revalidation |            |             |        |
| Today               | lazy       |          No |        |
| Summary             | lazy       |          No |        |

---

# 111. Required Bundle Matrix

| Metric         | 6.9 baseline | 6.10 | Delta |           Budget |
| -------------- | -----------: | ---: | ----: | ---------------: |
| Initial raw    |      648,162 |      |       |          685,000 |
| Initial gzip   |      164,161 |      |       |          170,000 |
| Plan authoring |       50,645 |      |       | 100,000 lazy max |
| Today query    |        4,890 |      |       |                  |
| Today UI       |       11,282 |      |       |                  |
| Summary        |       30,100 |      |       |                  |
| Largest lazy   |       50,645 |      |       |          100,000 |
| Total JS       |      745,080 |      |       |          750,000 |

---

# 112. Required Product-Boundary Matrix

| Capability                           | Task 6.10        |
| ------------------------------------ | ---------------- |
| exact Commitment contextual identity | Implement        |
| stale recreated-source rejection     | Implement        |
| recurrence completeness              | Implement        |
| duplicate ordinary advanced writer   | Remove/reconcile |
| directly related terminology         | Clean            |
| new Commitment authority             | Prohibited       |
| recurrence redesign                  | Prohibited       |
| Event changes                        | Prohibited       |
| Work redesign                        | Prohibited       |
| Today changes                        | Prohibited       |
| Summary changes                      | Prohibited       |
| Recommendations                      | Prohibited       |
| Capacity                             | Prohibited       |
| transition adaptation                | Prohibited       |

---

# 113. Required Epistemic Matrix

| Evidence/state               | DayFrame may say                                            | Must not say                     |
| ---------------------------- | ----------------------------------------------------------- | -------------------------------- |
| exact source still exists    | Edit Commitment                                             | assume recreated source is same  |
| exact source missing         | no longer available from this schedule                      | corrupted                        |
| recreated logical source     | current distinct Commitment                                 | continuation of old incarnation  |
| specific weekdays incomplete | choose at least one weekday                                 | silently save invalid recurrence |
| unsupported recurrence       | not available in ordinary editor / preserved advanced state | fully supported                  |
| stale schedule               | generated before current authored state                     | invalid schedule                 |
| advanced fields              | uncommon authored configuration                             | second ordinary Commitment model |

---

# 114. Architectural Invariants

Assess at minimum:

1. Commitment remains a product projection.
2. no generic Commitment authority is added.
3. existing template/recurrence authority remains canonical.
4. exact incarnation governs contextual editing.
5. logical ID alone is insufficient across recreation.
6. title matching remains prohibited.
7. time matching remains prohibited.
8. same-incarnation rename remains editable.
9. same-incarnation field edit remains editable.
10. removed source is unavailable.
11. recreated source does not retarget.
12. profile replacement does not retarget.
13. restore replacement does not retarget.
14. full clear does not retarget.
15. lazy target is revalidated after load.
16. stale Review Schedule may remain visible.
17. stale schedule does not gain rewritten identity.
18. unplaced contextual edit follows exact identity.
19. friction participant contextual edit follows exact identity.
20. Event exact identity remains unchanged.
21. Goal exact-link behavior remains unchanged.
22. recurrence domain semantics remain unchanged.
23. recurrence validator remains authoritative.
24. every selectable bounded recurrence is fully authorable.
25. incomplete recurrence cannot enter canonical draft.
26. `specificWeekdays` required parameters are collected.
27. `timesPerUserWeek` required parameters are collected.
28. unsupported recurrence is not presented as fully supported.
29. existing unsupported data is preserved.
30. unrelated edits preserve recurrence-specific fields.
31. recurrence type changes do not leave contradictory fields.
32. no recurrence migration is introduced.
33. one ordinary Add Commitment writer remains.
34. one ordinary Remove Commitment writer remains.
35. advanced fields do not duplicate ordinary creation.
36. advanced fields do not duplicate ordinary removal.
37. advanced existing-source edits preserve exact identity.
38. Block Template is not primary product language.
39. Preview terminology is removed from the bounded remediated product areas.
40. internal domain names need not change.
41. Save Setup remains canonical unless evidence requires otherwise.
42. local typing remains ephemeral.
43. Add/Update modifies SetupDraft only.
44. Save Setup remains durable scheduling persistence boundary.
45. schedule staleness semantics remain unchanged.
46. no auto-refresh is added.
47. Review Schedule remains derived Preview.
48. HistoricalPlan remains frozen history.
49. Event authority remains unchanged.
50. Work authority remains unchanged.
51. Today remains unchanged.
52. Summary remains unchanged.
53. no scheduler algorithm changes.
54. no recurrence-engine changes except tests/fixes required to preserve existing semantics.
55. no Pattern Library is added.
56. no Capacity is added.
57. no Recommendations are added.
58. no transition adaptation is added.
59. no direct schedule manipulation is added.
60. profile semantics remain unchanged.
61. Backup V6 remains unchanged.
62. restore remains exact replacement.
63. full clear adds no new participant.
64. protection never becomes editable empty state.
65. recurrence validation is accessible.
66. stale-target feedback is accessible.
67. contextual target focus is deterministic.
68. mobile recurrence controls are usable.
69. Plan authoring remains lazy.
70. no heavy authoring code becomes eager.
71. no runtime dependency is added.
72. bundle thresholds remain unchanged.
73. initial raw remains green.
74. initial gzip remains green.
75. largest lazy remains green.
76. total JS remains green.
77. duplicate UI removal is preferred over code duplication.
78. full canonical validation passes.
79. Task 6.11 remains manual/browser QA rather than architecture remediation.
80. Phase 6 is not declared complete until Task 6.11 finishes.

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

# 115. Stop Conditions

Stop and report if:

* exact incarnation cannot be carried/resolved without a durable schema migration;
* Preview lacks any recoverable exact source identity needed for truthful navigation;
* fixing navigation would require rewriting stale Preview identity;
* recurrence domain semantics are themselves ambiguous;
* a supposedly supported recurrence has no deterministic validator/engine contract;
* removing the advanced writer would eliminate access to canonical functionality not represented elsewhere;
* unsupported existing recurrence data cannot be preserved without mutation;
* a Backup version change becomes necessary;
* total JS cannot stay within guard without threshold inflation;
* the fix requires a new runtime dependency;
* the fix requires re-eagerizing Plan authoring.

Do not widen scope around a stop condition.

---

# 116. Focused Validation

Run focused suites covering:

* CommitmentSection;
* SetupScreen;
* DayFrameApp;
* PreviewScreen / Review Schedule;
* occurrence/source identity;
* recurrence validation;
* recurrence generation;
* Goal link resolution;
* profile replacement;
* restore;
* full clear;
* lazy Plan authoring;
* bundle architecture.

Record exact files and test counts.

---

# 117. Full Validation

Run:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Record:

* test files;
* total tests;
* transformed modules;
* initial raw;
* initial gzip;
* Plan authoring chunk;
* Today chunks;
* Summary chunk;
* largest lazy;
* total JS;
* diff result.

---

# 118. Manual Product Walkthrough

If browser access is available, inspect:

### Identity

* stale schedule;
* remove Commitment;
* recreate same logical source;
* old contextual Edit;
* exact unavailable behavior.

### Recurrence

* daily;
* weekly;
* specific weekdays;
* times per user-week;
* unsupported/advanced recurrence handling;
* edit round-trip;
* type switching;
* validation.

### Advanced Setup

* ordinary duplicate Add/Delete path absent;
* advanced existing-source fields remain reachable where needed.

### Terminology

* Planning/Schedule Range;
* Include in Schedule;
* Commitment language.

### Mobile

* weekday chooser;
* numeric recurrence;
* validation;
* stale-target message.

If browser access is unavailable, state so explicitly.

Task 6.11 remains responsible for the complete required production-browser QA pass.

---

# 119. Governance

Update:

* Task 6.10 result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

No ADR is expected if the task simply applies already-governed exact-incarnation semantics and existing recurrence contracts.

Create an ADR only if implementation uncovers a genuinely new enduring architecture decision.

---

# 120. Task 6.11 Readiness

Task 6.11 becomes authorized only if:

* stale recreated-source retargeting is mechanically impossible;
* exact identity regression coverage passes;
* ordinary recurrence choices are complete/truthful;
* unsupported recurrence behavior is explicit;
* duplicate ordinary advanced writer is removed/reconciled;
* related terminology debt is cleaned;
* bundle guard remains green;
* no new architecture blocker remains.

---

# 121. Recommended Next Task

If green:

> **Task 6.11 — Phase 6 Cross-Surface Manual QA, Accessibility/Mobile Remediation, and Publication Checkpoint.**

---

# 122. Completion Criteria

Task 6.10 is complete only when:

* Task 6.9's stale Commitment retargeting defect is reproduced and repaired;
* Review Schedule contextual editing uses exact current source incarnation;
* old stale occurrences cannot open recreated replacements;
* same-incarnation edits/renames continue to open correctly;
* removed sources produce truthful unavailable state;
* profile/restore/full-clear replacements do not retarget;
* unplaced/friction contextual editing uses the same exact rules where applicable;
* Goal-link exact identity remains consistent;
* all canonical recurrence variants are mechanically audited;
* every recurrence offered by bounded Add/Edit Commitment can be fully configured;
* `specificWeekdays` collects its required weekday set;
* `timesPerUserWeek` collects its required count;
* unsupported `perShiftSegment`/`custom` behavior is truthful and does not create invalid drafts;
* existing unsupported data remains preserved;
* recurrence-specific fields survive unrelated edits;
* recurrence type changes remain canonical and valid;
* invalid recurrence cannot enter SetupDraft;
* ordinary Commitment creation has one product writer;
* ordinary Commitment removal has one product writer;
* the advanced Setup path no longer duplicates Add/Delete Block Template behavior;
* advanced canonical fields remain reachable where needed;
* direct related Preview/Block Template terminology is cleaned;
* Save Setup, schedule staleness, explicit Refresh Schedule, Event, Work, Today, Summary, HistoricalPlan, profile, Backup, restore, and full-clear semantics remain unchanged;
* no new authority, schema, Backup version, scheduler behavior, recurrence semantics, runtime dependency, Capacity, Recommendation, Pattern Library, or transition adaptation is introduced;
* Plan authoring remains lazy;
* fixed bundle budgets remain green;
* accessibility/focus/mobile structure is mechanically sound;
* focused validation passes;
* full canonical validation passes;
* governance is updated;
* Task 6.11 can proceed as final real-browser QA/publication work rather than another architecture remediation task.

---

# 123. Final Implementation Principle

> **If Review Schedule says “edit this Commitment,” DayFrame must mean this exact Commitment—not whatever currently happens to share its logical name. And if Planner offers a recurrence choice, Planner must be capable of authoring that choice completely.**

Identity must be exact.

Authoring must be truthful.

There should be one ordinary Commitment workflow.

---

# 124. Final Completion Statement

**Task 6.10 is complete when DayFrame closes the Planner P1 gaps identified by Task 6.9 without reopening settled architecture: when every Review Schedule, unplaced, or friction-participant Commitment edit that is exposed is resolved and revalidated against the exact canonical current source incarnation so that a stale occurrence from an old source can never silently target a recreated source sharing its logical IDs, while same-incarnation renames and edits continue to work; when the bounded Add/Edit Commitment workflow mechanically audits every recurrence family and either fully authors all validator-required parameters for each selectable supported recurrence—including specific weekdays and times per user-week—or truthfully withholds unsupported recurrence types while preserving existing unsupported data without mutation; when recurrence type changes, hidden-field preservation, validation, focus, accessibility, and mobile behavior remain canonical; when the older Advanced Setup area ceases to provide a parallel ordinary Add/Delete Block Template workflow and instead remains only a truthful escape hatch for uncommon existing-source fields where necessary; when directly related product language such as Preview Range, Include in Preview, and Block Template is replaced with Planning/Schedule/Commitment terminology without broad internal renames; when SetupDraft ownership, Save Setup persistence, stale-schedule visibility, explicit Refresh Schedule, Event authority, Work configuration, Goal links, HistoricalPlan immutability, Today, Summary, profile, Backup V6, restore, full clear, protection, lazy Plan authoring, and fixed bundle guards all remain unchanged; when no new authority, scheduler behavior, recurrence semantics, Pattern Library, Capacity, Recommendations, transition adaptation, runtime dependency, or threshold inflation is introduced; when focused and full validation pass; and when Task 6.11 is authorized to perform the final production-browser cross-surface accessibility, mobile, transition-day, lazy-loading, and publication-checkpoint validation needed to close Phase 6.**
