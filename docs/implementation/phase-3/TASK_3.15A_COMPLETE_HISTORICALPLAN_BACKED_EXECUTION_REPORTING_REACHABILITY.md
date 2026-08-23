# Task 3.15A — Complete HistoricalPlan-Backed Execution Reporting Reachability

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded product-integration and historical-reporting reachability task.

Task 3.15 identified a confirmed Phase 3 gap:

> Production reporting is reachable only from a current, materially reproducible Preview target. HistoricalPlan is durable planned-history authority and already stores the matching `DurableOccurrenceReference` plus frozen historical occurrence snapshot, but no production reporting path reads HistoricalPlan. A planned occurrence that is no longer available through the current operative Preview therefore cannot be newly reported from durable planned history.

Task 3.15A closes that gap.

This task does **not** redesign reporting, HistoricalPlan, ExecutionHistory, Summary, or metrics. It introduces the smallest production path by which a user can select an eligible durable HistoricalPlan occurrence and submit the same execution report that current Preview-backed reporting already supports.

The intended new edge is:

```text
HistoricalPlan occurrence
        ↓
historical execution target
        ↓
existing execution reporting workflow
        ↓
ExecutionHistory
```

---

# 1. Execution Artifact Rules

Before implementation:

1. verify the supplied Task 3.15A artifact is complete;
2. save an immutable project copy;
3. compare copies when both are available;
4. record SHA-256;
5. review:

   * Task 3.15 result;
   * current HistoricalPlan query APIs;
   * `HistoricalExecutionTarget`;
   * `executionReportingWorkflow`;
   * current Preview-backed reporting UI;
   * ExecutionHistory report result contracts;
6. do not modify this task artifact during execution.

Create result:

`docs/implementation/phase-3/TASK_3.15A_COMPLETE_HISTORICALPLAN_BACKED_EXECUTION_REPORTING_REACHABILITY_RESULT.md`

---

# 2. Purpose

DayFrame already preserves durable planned history.

A HistoricalPlan occurrence contains the identity and frozen plan snapshot necessary to answer:

> What was planned for this occurrence at the time it became historical authority?

Execution reporting already knows how to consume a historical target and create execution evidence.

The missing piece is production reachability.

Current path:

```text
current Preview occurrence
        ↓
materialize reporting target
        ↓
report
```

Required additional path:

```text
HistoricalPlan occurrence
        ↓
materialize reporting target
        ↓
report
```

Both paths must converge on the same reporting workflow.

---

# 3. Governing Principle

> **Historical reporting must use durable historical planned authority, not reconstruct past planning from current Active state or current Preview.**

Do not regenerate a past Preview.

Do not look up the current source and assume it still represents the historical occurrence.

Do not synthesize a new `DurableOccurrenceReference`.

Use the stored HistoricalPlan occurrence authority.

---

# 4. Scope

Task 3.15A includes:

* a minimal production HistoricalPlan query boundary for reportable occurrences;
* historical occurrence selection;
* historical reporting target construction;
* reuse of existing execution reporting workflow;
* restart-safe reporting from durable history;
* reporting after source deletion;
* reporting after source recreation;
* reporting after current Preview changes;
* existing report/correction/retraction compatibility;
* minimal UI integration;
* focused regression coverage.

It does **not** include:

* adherence;
* historical metrics;
* missed-rate calculation;
* new outcome categories;
* new HistoricalPlan states;
* editing HistoricalPlan;
* HistoricalPlan publication changes;
* plan revision UI;
* calendar redesign;
* direct history explorer;
* Goals;
* Progress;
* learning.

---

# 5. Required Initial Audit

Before coding, trace:

1. current HistoricalPlan range/day query APIs;
2. HistoricalPlan occurrence state shapes;
3. current `HistoricalExecutionTarget` type;
4. how Preview occurrences become `HistoricalExecutionTarget`;
5. `executionReportingWorkflow` input requirements;
6. current reporting controls/UI;
7. how already-reported occurrences are recognized;
8. how retractions affect reportability;
9. which HistoricalPlan occurrence states are semantically reportable.

Document all findings in the result artifact.

---

# 6. HistoricalPlan as Source

HistoricalPlan is the authoritative source for this new reporting path.

The selected occurrence must come from a validated HistoricalPlan projection/query.

Do not use:

* current Preview;
* current Active source;
* current PlanDecision replay;
* regenerated schedule output.

HistoricalPlan already exists specifically to preserve planned-history authority.

---

# 7. Query Boundary

Introduce or reuse the narrowest HistoricalPlan query necessary to expose reportable historical occurrences.

Preferred options:

* by user-day;
* by bounded date range;
* by recent historical days.

Do not add a general analytics API.

---

# 8. Minimal Historical Reporting Window

Choose a bounded production selection experience.

Preferred default unless existing UX strongly suggests another:

> **Recent published plan days**, surfaced through an existing history/reporting area.

The implementation may use a recent bounded range such as the existing visible/reporting window if already governed by product conventions.

Do not invent an unlimited historical browser solely for this task.

The result must document the chosen boundary.

---

# 9. Missing Coverage

An unpublished HistoricalPlan day is not equivalent to an empty published day.

The reporting UI/query must preserve this distinction.

```text
published empty day
    → valid historical coverage, zero occurrences

missing publication
    → no historical planned authority
```

Do not generate reportable occurrences for missing coverage.

---

# 10. HistoricalPlan Occurrence States

Audit all stored occurrence states.

Likely examples may include:

* scheduled;
* unplaced;
* omitted;
* blocked.

Determine which are eligible for execution reporting under current execution semantics.

Do not infer eligibility merely from the state name.

Use accepted domain meaning.

---

# 11. Required Eligibility Rule

The result must explicitly define:

```text
HistoricalPlan state
        ↓
reportable?
```

The rule should be as narrow as possible.

Do not silently broaden reporting beyond what current Preview-backed reporting allows.

---

# 12. Scheduled Occurrences

If current reporting supports scheduled planned occurrences, HistoricalPlan scheduled occurrences with valid durable references should be reportable.

---

# 13. Unplaced / Omitted / Blocked Occurrences

Audit current semantics carefully.

Potential considerations:

* Was this occurrence still a planned obligation?
* Does current reporting permit `skipped` for an analogous Preview target?
* Is there enough frozen snapshot data to create a valid historical execution subject?

Do not add reportability without evidence.

Record the determination for each state.

---

# 14. Historical Execution Target Construction

Add a pure conversion from an eligible HistoricalPlan occurrence to the existing historical reporting target.

Conceptually:

```ts
historicalPlanOccurrenceToExecutionTarget(...)
```

or repository-equivalent.

It must use:

* stored `DurableOccurrenceReference`;
* stored historical snapshot;
* stored planned timing/duration/category/title data required by the existing target.

No current-authority lookup is required for identity.

---

# 15. No Identity Reconstruction

Mandatory invariant:

> The historical reporting target reuses the exact `DurableOccurrenceReference` stored in HistoricalPlan.

Do not derive a new occurrence ID from:

* date;
* title;
* source ID;
* current Active state.

---

# 16. Frozen Snapshot Preservation

The resulting execution subject must use the HistoricalPlan's frozen occurrence snapshot.

This ensures reports remain intelligible after:

* source rename;
* source deletion;
* category change;
* duration change;
* source recreation.

---

# 17. Source Deletion

A historical occurrence must remain reportable after its current Active source has been deleted.

Mandatory integration test.

The report must retain the old source incarnation/reference from HistoricalPlan.

---

# 18. Source Recreation

If a logical source is deleted and recreated:

* old historical occurrence remains tied to old incarnation;
* reporting it must not target the new incarnation.

Mandatory test.

---

# 19. Current Preview Independence

Historical reporting must still work if the current Preview:

* no longer covers that day;
* no longer contains the occurrence;
* has become stale;
* has been regenerated differently.

Mandatory test.

---

# 20. Restart Independence

A historical occurrence must remain reportable after restart based solely on durable HistoricalPlan authority.

Mandatory test.

---

# 21. Backup/Restore Independence

After Backup V3 restore:

* HistoricalPlan occurrence should remain reportable;
* its durable reference and frozen snapshot should remain exact;
* reporting should append new ExecutionHistory evidence normally.

Add focused coverage if current Backup V3 integration harness makes this practical.

---

# 22. Reporting Workflow Reuse

Historical reporting must call the existing execution reporting workflow.

Do not create a second record-creation path.

Conceptually:

```text
Preview reporting
        ┐
        ├→ executionReportingWorkflow → ExecutionHistory
History reporting
        ┘
```

This ensures:

* validation;
* subject creation;
* outcome rules;
* persistence behavior;
* error mapping

remain shared.

---

# 23. Report Inputs

Reuse existing supported inputs:

* `completed`;
* `partial`;
* `skipped`;
* actual occurrence time where supported;
* duration where supported;
* note where supported.

Do not add new execution fields.

---

# 24. Skipped Semantics

Current audit says `skipped` is limited to planned subjects.

HistoricalPlan-backed subjects are planned historical subjects.

Confirm the existing workflow accepts them without special-case semantics.

---

# 25. Existing Report Detection

Determine how the UI should treat a HistoricalPlan occurrence that already has current effective execution evidence.

Preferred behavior:

* show current reported state;
* allow correction/retraction through existing history workflow where applicable;
* avoid accidental duplicate first-report submission if current UI already prevents it.

Do not silently create parallel heads.

---

# 26. Retracted Occurrences

Audit existing semantics.

If an occurrence's current execution head is retracted:

* determine whether the historical occurrence should offer a new report;
* or route through existing correction/re-report semantics.

Preserve current immutable revision rules.

Do not invent a second revision model.

---

# 27. Quarantined Execution Evidence

If ExecutionHistory contains quarantined evidence for the same occurrence:

* do not silently treat quarantine as a valid current report;
* do not block historical reporting unless existing subject/identity rules require it;
* surface existing quarantine messaging if relevant.

Document behavior.

---

# 28. HistoricalPlan Protection

If HistoricalPlan is whole-source protected:

* historical reporting selection is unavailable;
* do not present partially interpretable historical occurrences as authoritative.

Use existing protected-state semantics.

---

# 29. ExecutionHistory Protection

If ExecutionHistory is whole-source protected:

* reporting remains blocked according to existing mutation admission/recovery semantics.

Do not bypass protection because HistoricalPlan is healthy.

---

# 30. Readiness

Historical reporting UI is available only when store readiness is `ready`.

No pre-bootstrap reporting.

---

# 31. Authority Transaction Barrier

Historical reporting must respect the existing centralized mutation-admission barrier.

No reporting during:

* restore;
* shared authority transaction;
* protected state.

---

# 32. UI Location

Use the smallest existing surface that fits.

Preferred candidates:

* existing Execution History/reporting panel;
* an existing day-detail/history panel;
* a compact “Report from plan history” subsection.

Do **not** create a new primary navigation destination.

---

# 33. UI Mental Model

The UI should communicate:

> “These are occurrences DayFrame previously recorded as planned.”

It should not imply:

* current schedule;
* future schedule;
* adherence result;
* missed judgment.

---

# 34. Historical Day Selection

If a date selector is required, reuse existing date/calendar primitives where reasonable.

Do not build a new calendar system.

---

# 35. Bounded List

A simple bounded list is sufficient.

Potential row information:

* historical date;
* title;
* planned time/window;
* category;
* current report status;
* report action.

Use only fields already supported by historical snapshot authority.

---

# 36. Missing Coverage UI

If a selected day lacks HistoricalPlan publication:

use factual wording such as:

> No published plan history is available for this day.

Do not say:

> Nothing was planned.

unless the day is explicitly published empty.

---

# 37. Published Empty Day UI

For explicit empty HistoricalPlan coverage:

> No occurrences were published for this day.

Keep missing versus empty distinct.

---

# 38. Already Reported UI

If current effective execution evidence exists:

* display the reported outcome;
* use existing correction/retraction entry points;
* avoid creating a competing ordinary report.

---

# 39. Historical Reporting Form

Reuse current `ExecutionReportControl` or extract a shared control if needed.

Do not fork reporting form validation.

Any extraction must remain behavior-preserving for Preview reporting.

---

# 40. Preview Reporting Regression

Existing current-Preview reporting must remain unchanged.

Task 3.15A adds a second source of valid historical targets; it does not replace the Preview flow.

---

# 41. HistoricalPlan Does Not Mutate

Reporting an occurrence must not modify:

* HistoricalPlan batch;
* HistoricalPlan day;
* occurrence state;
* publication time;
* plan snapshot.

Execution observation belongs exclusively to ExecutionHistory.

---

# 42. No Plan “Completion” Mutation

Do not mark the HistoricalPlan occurrence itself complete.

The relation is:

```text
HistoricalPlan
    = what was planned

ExecutionHistory
    = what was observed
```

Keep the two authorities independent.

---

# 43. Summary Compatibility

After a historical report is appended:

* categorical OutcomeSummary should naturally reflect the new effective ExecutionHistory outcome;
* no Summary-specific mutation should be necessary.

Verify.

---

# 44. Current Preview Coverage

Reporting a historical occurrence outside the current Preview must **not** inflate current-Preview reporting coverage.

This is important.

The current coverage projection is intentionally:

```text
current fresh Preview
+
ExecutionHistory
```

Historical reporting should only affect coverage if that same occurrence is actually eligible in the current Preview.

Mandatory regression test.

---

# 45. Future Historical Metrics

Do not calculate historical reporting coverage or adherence in this task.

This task only establishes reportability from durable plan history.

---

# 46. HistoricalPlan Query Performance

Use bounded/indexed queries already supported by the HistoricalPlan surface.

Do not load the complete multi-year ledger for every UI render if a bounded query exists.

---

# 47. Async UI State

HistoricalPlan queries may be async.

Use explicit:

* loading;
* ready;
* protected/error

states consistent with current UI conventions.

Do not hide async failure as an empty historical day.

---

# 48. Race Safety

If the selected historical date/range changes while a query is in flight:

* stale query result should not overwrite the newer selection.

Use current React async request patterns.

---

# 49. HistoricalPlan Pending Publications

HistoricalPlan queries include accepted pending publication authority according to current semantics.

Therefore an accepted pending historical occurrence should be reportable in-session if the HistoricalPlan surface already exposes it as authority.

Do not require durability if current HistoricalPlan query semantics do not.

---

# 50. HistoricalPlan As-Of

For ordinary reporting selection, use current effective HistoricalPlan authority for the historical day unless accepted architecture says otherwise.

Do not ask the user to choose among publication revisions in this task.

---

# 51. Revision History Retention

Multiple HistoricalPlan publications remain preserved.

Reporting the current effective historical occurrence must not delete or rewrite earlier plan revisions.

---

# 52. Ambiguous Historical Identity

If HistoricalPlan projection cannot produce one valid effective occurrence because of corrupted/ambiguous authority:

* do not report it;
* use existing protection/validation semantics.

Do not choose arbitrarily.

---

# 53. Execution Subject Uniqueness

Historical reporting must obey existing ExecutionHistory subject uniqueness rules.

A historical selection must not produce a different subject identity from the same occurrence reported through Preview.

Mandatory equivalence test:

```text
Preview target.reference
    ==
HistoricalPlan target.reference
```

for the same published occurrence.

---

# 54. Preview vs Historical Target Equivalence

For an occurrence still present in both current Preview and HistoricalPlan:

materializing either target should produce semantically equivalent planned execution subjects.

Mandatory test.

---

# 55. No Duplicate Report Path

If an occurrence is reportable from both surfaces simultaneously, the user should not accidentally create two independent ordinary report heads.

Existing ExecutionHistory validation must remain the final safety boundary, but UI should also avoid encouraging duplication.

---

# 56. Result Mapping

Historical UI should use the existing reporting result mapping.

Do not create new domain error meanings unless HistoricalPlan selection itself fails.

Potential selection-layer results:

* loading;
* unavailable;
* missingCoverage;
* emptyPublishedDay;
* protectedHistoricalPlan;
* eligibleOccurrences.

Reporting results remain existing reporting results.

---

# 57. No New Persistence

Task 3.15A should add no new durable storage surface.

Historical selection state is UI/runtime state only.

---

# 58. No Domain Version Changes

Do not introduce:

* HistoricalPlan V2;
* ExecutionHistory V2;
* new occurrence reference version.

The current models are already sufficient according to Task 3.15.

---

# 59. No New Identity

Do not add a “historical report occurrence ID.”

Use the existing `DurableOccurrenceReference`.

---

# 60. No Publication Side Effect

Historical reporting selection and report creation must not cause a new HistoricalPlan publication.

Mandatory test.

---

# 61. No Preview Generation Side Effect

Opening historical reporting must not generate a Preview.

Mandatory test.

---

# 62. No Active Lookup Requirement

Historical target materialization must succeed when the referenced source no longer exists in Active.

Mandatory.

---

# 63. No Profile Lookup Requirement

Historical target materialization must not depend on a Profile.

---

# 64. Test — Pure Historical Target Materialization

Given a stored HistoricalPlan occurrence:

* returns valid historical execution target;
* preserves durable reference;
* preserves frozen snapshot.

---

# 65. Test — Preview/Historical Equivalence

For the same occurrence:

* Preview-derived target reference;
* HistoricalPlan-derived target reference

are equal.

Frozen reporting subject semantics should match where both represent the same published occurrence.

---

# 66. Test — Source Deleted

Publish occurrence.

Delete source.

Remove/change Preview context.

Report from HistoricalPlan.

ExecutionHistory receives the old incarnation.

---

# 67. Test — Source Recreated

Publish old incarnation.

Delete.

Recreate logical source with new incarnation.

Report old HistoricalPlan occurrence.

Assert old incarnation remains.

---

# 68. Test — Restart

Publish historical occurrence.

Restart.

Without generating a new Preview for that historical day:

* query HistoricalPlan;
* report occurrence;
* verify ExecutionHistory.

Mandatory.

---

# 69. Test — Backup V3 Restore

Where practical:

* export;
* change/clear authority;
* restore;
* select restored HistoricalPlan occurrence;
* report;
* verify identity.

---

# 70. Test — Missing Coverage

Unpublished day returns missing coverage.

No occurrence actions.

---

# 71. Test — Explicit Empty Day

Published empty day returns valid empty state, not missing coverage.

---

# 72. Test — Eligible State Matrix

Test every HistoricalPlan occurrence state and expected reportability.

Mandatory.

---

# 73. Test — Already Reported

Historical row identifies existing current outcome.

Ordinary duplicate-report path is not presented or is rejected according to existing UX.

---

# 74. Test — Retracted

Verify historical reporting uses existing re-report/correction semantics.

---

# 75. Test — Quarantine

Quarantine behavior remains governed and does not masquerade as a valid current report.

---

# 76. Test — Current Preview Coverage Regression

Report an occurrence from historical plan that is not in current Preview.

Current Preview reporting coverage remains unchanged.

---

# 77. Test — OutcomeSummary Regression

Historical report updates categorical ExecutionHistory-derived Summary correctly.

---

# 78. Test — No HistoricalPlan Mutation

Before/after ledger semantic fingerprint or exact projection is unchanged by reporting.

---

# 79. Test — No New Publication

HistoricalPlan batch count/identity remains unchanged.

---

# 80. Test — No Preview Generation

Spy/assert generation not invoked.

---

# 81. Test — Readiness Barrier

Historical reporting cannot mutate while initializing/protected.

---

# 82. Test — Authority Transaction Barrier

Historical reporting cannot mutate during restore/runtime transaction.

---

# 83. Test — Async Historical Query

Loading and resolved states.

No false empty state.

---

# 84. Test — Stale Request Protection

If relevant to implementation.

---

# 85. UI Test — Historical Reporting Entry

Production UI exposes the minimal new entry point.

---

# 86. UI Test — Missing vs Empty

Both states rendered distinctly.

---

# 87. UI Test — Report Submission

Historical selection submits through existing reporting workflow.

---

# 88. UI Test — Current Reporting Unchanged

Existing Preview reporting tests remain green.

---

# 89. Accessibility

New historical reporting controls must:

* have semantic labels;
* support keyboard activation;
* identify dates/outcomes textually;
* not rely on color alone.

No broader accessibility redesign.

---

# 90. Documentation

If implementation closes P3-GAP-001, update governance as appropriate after code/test completion:

* `CURRENT_STATE.md`;
* `DECISIONS.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

State precisely:

> HistoricalPlan-backed reporting reachability exists.

Do not claim historical metrics/adherence exists.

---

# 91. Checkpoint

Create if project convention warrants:

`docs/checkpoints/CHECKPOINT_Phase_3_HistoricalPlan_Backed_Execution_Reporting.md`

Include:

1. purpose;
2. HistoricalPlan source authority;
3. eligibility rule;
4. target materialization;
5. identity continuity;
6. source deletion/recreation behavior;
7. restart behavior;
8. Preview independence;
9. Summary interaction;
10. current coverage non-interference;
11. invariants.

---

# 92. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.15A_COMPLETE_HISTORICALPLAN_BACKED_EXECUTION_REPORTING_REACHABILITY_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Governing P3-GAP-001
4. Initial Historical Reporting Audit
5. Files Changed
6. HistoricalPlan Query Boundary
7. Historical Reporting Window
8. Missing Coverage Semantics
9. Empty Published Day Semantics
10. Occurrence State Eligibility
11. Historical Target Materialization
12. DurableOccurrenceReference Preservation
13. Frozen Snapshot Preservation
14. Preview/Historical Target Equivalence
15. Source Deletion
16. Source Recreation
17. Restart Independence
18. Backup V3 Restore Independence
19. Reporting Workflow Reuse
20. Outcome Support
21. Existing Report Detection
22. Retraction/Re-Report
23. Quarantine
24. HistoricalPlan Protection
25. ExecutionHistory Protection
26. Readiness/Transaction Admission
27. UI Location
28. UI Selection Model
29. Missing/Empty UI
30. Report Form Reuse
31. HistoricalPlan Immutability
32. Summary Interaction
33. Current Preview Coverage Non-Interference
34. Query Performance
35. Async UI Behavior
36. Pending HistoricalPlan Authority
37. As-Of Determination
38. Identity Uniqueness
39. Tests Added
40. Pure Materialization Tests
41. Deleted/Recreated Source Tests
42. Restart Test
43. Backup Restore Test
44. Eligibility Matrix Tests
45. Duplicate/Retraction Tests
46. Coverage/Summary Regressions
47. No Publication/Preview Side-Effect Tests
48. UI Tests
49. Accessibility
50. No Persistence/Domain Version Audit
51. Governance Updates
52. Checkpoint
53. Architectural Alignment Assessment
54. Deviations
55. Discoveries and Deferred Work
56. P3-GAP-001 Closure Determination
57. Focused Validation
58. Full Validation
59. Final Completion Determination

---

# 93. Required Eligibility Matrix

The result must include:

| HistoricalPlan occurrence state | Reportable? | Reason |
| ------------------------------- | ----------: | ------ |

Populate from actual source semantics.

Do not pre-fill assumptions.

---

# 94. Required Historical State Matrix

Include:

| Historical day condition            | UI/query result | Reporting available? |
| ----------------------------------- | --------------- | -------------------: |
| missing publication                 |                 |                      |
| published empty                     |                 |                      |
| published with eligible occurrences |                 |                      |
| protected                           |                 |                      |

---

# 95. Required Identity Matrix

Include:

| Scenario                 | Expected source incarnation/reference |
| ------------------------ | ------------------------------------- |
| still in current Active  | historical stored reference           |
| source deleted           | historical stored reference           |
| logical source recreated | old historical incarnation            |
| Backup V3 restored       | exact restored historical reference   |
| restart                  | exact durable historical reference    |

---

# 96. Required Architectural Invariants

At completion prove:

1. HistoricalPlan is now a production source for execution reporting.
2. Historical reporting uses durable HistoricalPlan authority, not regenerated Preview.
3. Historical reporting preserves the exact stored `DurableOccurrenceReference`.
4. Historical reporting preserves the frozen planned occurrence snapshot.
5. Source deletion does not prevent historical reporting.
6. Source recreation does not retarget old history.
7. Restart does not prevent historical reporting.
8. Backup V3 restore does not prevent historical reporting.
9. Missing HistoricalPlan coverage differs from explicit empty publication.
10. Only semantically eligible HistoricalPlan states are reportable.
11. Historical and Preview reporting converge on the same execution reporting workflow.
12. The same occurrence cannot acquire two different planned subject identities depending on reporting entry point.
13. Reporting does not mutate HistoricalPlan.
14. Reporting does not publish HistoricalPlan.
15. Historical reporting does not generate Preview.
16. Historical reporting obeys readiness/protection/transaction barriers.
17. Existing immutable correction/retraction semantics remain unchanged.
18. Historical reporting updates ExecutionHistory-derived Summary naturally.
19. Historical reports outside current Preview do not inflate current Preview reporting coverage.
20. No metrics/adherence semantics are introduced.

---

# 97. Focused Validation

Run focused tests for:

* HistoricalPlan query/selection;
* historical target materialization;
* Preview target equivalence;
* occurrence-state eligibility;
* deleted source;
* recreated source;
* restart reporting;
* Backup V3 restored history reporting;
* existing report/retraction behavior;
* Summary interaction;
* current Preview coverage non-interference;
* no HistoricalPlan mutation/publication;
* no Preview generation;
* UI selection/reporting.

Record exact focused commands and results.

---

# 98. Full Validation

Run:

```text
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

The full suite must pass.

Record:

* test-file count;
* test count;
* build module count;
* warnings.

If the known fixed-delay ExecutionHistory test still flakes, do not modify it unless necessary for this task's own implementation. Record it exactly; Task 3.15C owns that closure issue.

---

# 99. Stop Conditions

Stop and report if:

* HistoricalPlan lacks enough frozen occurrence data to construct the existing execution reporting target;
* reportable HistoricalPlan state cannot be defined without introducing new execution semantics;
* stored `DurableOccurrenceReference` cannot be reused directly;
* Historical and Preview paths produce incompatible execution subject identities;
* querying HistoricalPlan for production selection requires a new persistence/domain schema;
* reporting from historical authority would require mutating HistoricalPlan;
* correction/retraction architecture cannot safely recognize an occurrence reported through the historical path;
* the minimum UI path requires a broad Planner/History redesign.

Recommend the narrowest prerequisite rather than weakening historical authority semantics.

---

# 100. Follow-On Boundary

If Task 3.15A completes successfully:

> **Proceed to Task 3.15B — Complete Five-Authority Full-Clear Settlement and Anti-Resurrection Verification.**

Do not begin historical metrics.

P3-GAP-001 should be considered closed only after the production historical reporting path and full validation are complete.

---

# 101. Task Determination

**Authorized:** bounded HistoricalPlan querying for reporting, occurrence eligibility, historical execution-target materialization, reuse of current reporting workflow, minimal production UI reachability, restart/source-lifecycle/backup-restore integration, and regression coverage.

**Not authorized:** metrics, adherence, new outcome semantics, new history domain versions, HistoricalPlan editing, execution-domain redesign, Goals, Progress, learning, or broad UI redesign.

The governing completion principle is:

> **Once DayFrame has preserved a plan as durable historical authority, the user's ability to report what actually happened must not depend on that occurrence still existing in today's operative Preview. Durable planned history should remain actionable as the stable reporting context from which ExecutionHistory can be observed.**

---

# 102. Final Completion Statement

**Task 3.15A is complete when DayFrame provides a minimal production reporting path from durable HistoricalPlan authority into the existing ExecutionHistory reporting workflow; when a user can select an eligible historically published occurrence after it has left the current Preview, after its source has been deleted, after the logical source has been recreated with a different incarnation, after application restart, and after exact Backup V3 restoration; when the historical reporting target reuses the exact stored `DurableOccurrenceReference` and frozen occurrence snapshot rather than reconstructing identity or meaning from current Active state; when missing HistoricalPlan coverage remains distinct from an explicitly published empty day and only semantically eligible HistoricalPlan occurrence states are reportable; when Preview-backed and HistoricalPlan-backed reporting produce the same planned execution subject identity for the same occurrence and both converge on the existing execution reporting workflow; when reporting from historical authority preserves immutable correction/retraction semantics, updates ExecutionHistory-derived categorical Summary naturally, does not inflate current-Preview reporting coverage for occurrences outside the current Preview, and neither mutates nor republishes HistoricalPlan nor regenerates Preview; when readiness, protection, quarantine, and authority-transaction barriers remain governed by existing infrastructure; when the production UI exposes the smallest usable historical reporting entry point without introducing metrics, adherence, a new primary destination, or a HistoricalPlan redesign; when full repository validation passes or any unrelated known timing flake is recorded under its already assigned closure task; and when P3-GAP-001 is demonstrably closed without introducing new persistence, domain versions, Goals, Progress, learning, or unrelated behavior.**
