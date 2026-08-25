# Task 6.5 — Today Outcome Reporting Integration

## Status

Ready for implementation.

## Phase

Phase 6 — Platform Maturity

## Task Type

Today write-path integration, exact occurrence reporting, completed/partial/skipped outcome actions, correction/retraction workflow, optimistic-concurrency/revision handling where supported, explicit evaluation-cutoff behavior, authority protection/error handling, stale-request safety, focus/accessibility, responsive interaction design, lazy-surface preservation, testing, bundle validation, and governance.

---

# 1. Objective

Make Today operational by allowing the user to report outcomes for eligible scheduled occurrences directly from the Today surface.

Task 6.5 must reuse the existing canonical ExecutionHistory write model.

The intended flow is:

```text
Today occurrence
    ↓
Record outcome

Completed
Partial
Skipped

    ↓
ExecutionHistory command
    ↓
authority publication/update
    ↓
Today re-query
```

Existing execution semantics must not be redefined.

---

# 2. Governing Prerequisite

Task 6.4 established the read-only Today surface.

Task 6.3 established the canonical Today read model.

Therefore the UI already knows:

* exact occurrence identity;
* current user-day;
* timing category;
* temporal position;
* effective execution state;
* outcome availability/protection;
* plan publication provenance.

Task 6.5 must act on that exact evidence rather than reconstructing occurrence identity from title/time.

---

# 3. Governing Write Principle

> **Today may write execution evidence, but it may not write the plan.**

Authorized writes:

* create/report execution outcome;
* correct execution outcome;
* retract execution outcome;

only through existing canonical ExecutionHistory commands.

Unauthorized writes:

* move occurrence;
* edit commitment;
* regenerate plan;
* change Goal;
* change Measurement;
* change schedule;
* change HistoricalPlan directly.

---

# 4. Governing Identity Principle

All reporting must bind to the exact durable occurrence reference supplied by Today.

Never match/report by:

* title;
* displayed time;
* category;
* current Active source;
* visual position.

Exact identity is mandatory.

---

# 5. Governing Outcome Principle

Reuse canonical execution categories exactly.

Expected governed outcomes:

```text
completed
partial
skipped
```

Do not introduce:

* done;
* failed;
* missed;
* abandoned;
* in progress;
* successful.

UI wording may be friendlier but must map exactly to governed outcomes.

---

# 6. Governing Epistemic Principle

Reporting an outcome records user evidence.

It does not imply:

* Goal success;
* schedule quality;
* capacity;
* recommendation;
* blame;
* causal explanation.

A skipped report means:

> user explicitly reported skipped.

It must never be conflated with:

* elapsed + not reported;
* unplaced;
* omitted;
* blocked.

---

# 7. Explicit Scope

Implement:

* outcome-reporting eligibility;
* Record Outcome action;
* completed action;
* partial action;
* skipped action;
* correction of existing report;
* retraction/removal of existing report where existing domain supports it;
* exact occurrence binding;
* ExecutionHistory command integration;
* existing authority readiness/protection;
* write-in-flight state;
* write failure/retry behavior;
* stale/revision conflict behavior where applicable;
* Today result invalidation/re-query;
* evaluation cutoff handling;
* same-cutoff semantics after writes;
* explicit Refresh interaction;
* keyboard/focus behavior;
* mobile interaction;
* read-only preservation for ineligible items;
* tests;
* bundle validation;
* governance.

---

# 8. Explicit Non-Goals

Do not implement:

* same-day schedule mutation;
* rescheduling;
* friction actions;
* manual-event editing from Today;
* Add Commitment;
* Goal context;
* Progress context;
* Goal measurement reporting;
* automatic completion;
* timers;
* reminders;
* notifications;
* recommendation/adaptation;
* Capacity;
* planned allocation;
* transition planning;
* sleep transition suggestions;
* current/next semantic changes;
* new ExecutionHistory authority;
* new outcome categories;
* new persistence schema;
* Backup version change.

---

# 9. Execution Artifact Rules

Before implementation:

1. verify this Task 6.5 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Task 6.4 result;
   * Task 6.3 result;
   * ExecutionHistory domain/types;
   * reporting commands;
   * correction/retraction commands;
   * mutation admission;
   * exact occurrence reference model;
   * protection/quarantine states;
   * existing reporting UI;
   * existing optimistic-concurrency behavior;
   * TodaySurface;
   * queryToday;
   * Today lazy loading;
   * bundle budgets;
5. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-6/TASK_6.5_TODAY_OUTCOME_REPORTING_INTEGRATION_RESULT.md`

---

# 10. Initial Source Audit

Before code changes, confirm:

* exact command for first outcome report;
* exact command for correction;
* exact command for retraction;
* exact required occurrence reference;
* whether command requires plan batch/publication identity;
* whether command requires expected revision;
* how execution subject identity is constructed;
* how command rejection/protection is surfaced;
* whether future occurrences may be reported;
* whether all-day occurrences may be reported;
* whether legacy V1 timing-unavailable occurrences may be reported;
* whether unplaced/omitted/blocked are execution-reportable;
* how existing reporting UI labels actions.

Do not assume.

---

# 11. Eligibility Audit

Classify every Today occurrence/state.

At minimum:

### Scheduled timed V2

Candidate for reporting.

### Scheduled all-day V2

Candidate if ExecutionHistory currently supports reporting them.

### Scheduled V1 timing-unavailable

Candidate only if exact occurrence identity/report semantics are still valid independent of timing provenance.

### Unplaced

Not scheduled execution occurrence unless existing domain says otherwise.

### Omitted

Not reportable.

### Blocked

Not reportable.

Use production authority rules, not intuition.

---

# 12. Temporal Position Must Not Gate Reporting

Do not assume only elapsed occurrences can be reported.

Audit current reporting commands.

If future/current occurrences can validly receive explicit reports, preserve that.

Task 6.3 explicitly allows odd combinations such as:

```text
upcoming + completed
current + skipped
```

if authority permits them.

---

# 13. Existing Report State

For occurrences with:

```text
notReported
```

show initial reporting action.

For occurrences with explicit report:

```text
completed
partial
skipped
```

show bounded correction/retraction affordance according to canonical domain capabilities.

---

# 14. Primary Interaction

Preferred first-report action:

**Record Outcome**

Opening a small inline/expanding action area is acceptable.

Avoid three permanently prominent buttons on every card if it creates excessive visual density.

---

# 15. Outcome Choices

Use clear choices:

* **Completed**
* **Partial**
* **Skipped**

The surrounding context should make clear these are reports.

Example:

```text
Record outcome
[Completed] [Partial] [Skipped]
```

Do not label skipped as “Missed.”

---

# 16. Confirmation

Audit whether existing reporting workflow requires confirmation.

Strong preference:

* Completed / Partial may write directly if current app conventions permit;
* Skipped may or may not require confirmation depending on existing semantics;
* retraction should likely require explicit confirmation if destructive.

Do not add unnecessary modal friction.

---

# 17. Correction Workflow

If an occurrence currently has:

```text
Reported completed
```

the user should be able to change it to:

* partial;
* skipped;

through the existing correction model.

Do not mutate the original history record in place if canonical ExecutionHistory uses append-only correction.

---

# 18. Retraction Workflow

If canonical ExecutionHistory supports retraction:

offer a clear action such as:

**Remove Report**

or repository-consistent copy.

Retraction must create canonical retraction evidence rather than delete history.

---

# 19. Retraction Confirmation

Use explicit confirmation if current design conventions require it.

Copy should explain:

> This removes the current reported outcome from Today; historical correction/retraction evidence remains preserved.

Avoid technical jargon in primary UI.

---

# 20. Exact Identity

Every write receives the exact occurrence reference already present in Today.

Mandatory test with visually identical occurrences.

---

# 21. Source Recreation

If commitment source was deleted/recreated after publication:

Today reports against the frozen exact historical occurrence.

Do not retarget to current recreated source.

---

# 22. Republication

If Today is showing occurrence A from effective publication A and a later publication replaces it with occurrence B:

a report initiated for A must remain bound to A.

If B becomes effective before write completion, stale handling must prevent UI from presenting A's result as B's outcome.

---

# 23. Write Cutoff Semantics

This is important.

Task 6.4 uses a fixed:

```text
evaluationAsOf
```

until Refresh.

A new execution report has:

```text
recordedAt > evaluationAsOf
```

in normal operation.

Therefore a same-cutoff Today re-query must not suddenly show the new report.

Do not break the cutoff model just to make the UI feel immediate.

---

# 24. Post-Write UX Decision

Choose one explicit model.

### Option A — Advance Today cutoff after successful write

After successful reporting:

```text
new evaluationAsOf = write completion/current clock
```

then re-query.

This makes the just-recorded report visible immediately and truthfully.

### Option B — Preserve cutoff and show pending/new-evidence notice

User must Refresh to see the report.

Strong preference:

> **Option A** for a user-initiated write, because the action itself creates a new knowledge event and advancing the local Today evaluation point is explicit and understandable.

Audit against Summary cutoff principles and current app conventions.

---

# 25. Cutoff Advancement Rule

If Option A is chosen:

only successful user-initiated Today writes advance Today’s evaluation cutoff.

Authority subscriptions alone do not.

This preserves:

```text
same-cutoff passive updates
```

versus:

```text
explicit user action creates new known evidence
```

Document this distinction.

---

# 26. Write Timestamp

Do not fabricate `recordedAt` separately if canonical command creates it.

If command accepts explicit timestamp, use the same canonical app clock source as Today.

---

# 27. Write In Flight

While reporting:

* disable duplicate action on that occurrence;
* show bounded status such as **Saving outcome…**;
* do not block unrelated Today items.

---

# 28. Concurrent Writes

Different occurrences may be reported independently unless application transaction semantics require serialization.

Audit current command behavior.

Do not add global locking unnecessarily.

---

# 29. Duplicate Submission

Double-click/Enter must not create duplicate reports.

Use disabled state/idempotency/current command semantics.

Mandatory test.

---

# 30. Write Failure

If command fails:

* retain current displayed outcome;
* show item-local or surface-bounded error;
* restore interaction;
* allow retry.

Do not optimistically claim success without durable command acceptance.

---

# 31. Durability Failure

If ExecutionHistory persistence enters degraded/session-only state:

reuse current product semantics.

Do not invent a Today-specific persistence model.

---

# 32. Protected ExecutionHistory

If ExecutionHistory is protected:

no outcome write controls.

Show existing:

**Outcome unavailable**

and recovery guidance.

Do not offer commands that cannot safely mutate authority.

---

# 33. HistoricalPlan Protection

If plan itself is protected, there are no trustworthy Today occurrence targets.

No reporting UI.

---

# 34. Missing Plan

No reporting UI.

---

# 35. Known-Empty Plan

No reporting UI.

---

# 36. Legacy Timing-Unavailable Reporting

Timing uncertainty alone should not necessarily prevent reporting if the exact scheduled occurrence remains valid.

Audit canonical reporting eligibility.

If allowed:

* show report action inside Timing unavailable item;
* do not force it into Current/Earlier.

If not allowed:

* explain minimally;
* do not invent a restriction reason.

---

# 37. All-Day Reporting

If canonical ExecutionHistory allows all-day occurrences:

support reporting.

Do not treat all-day as automatically completed at end of day.

---

# 38. Plan-Attention Items

Unplaced/omitted/blocked remain read-only.

No outcome controls.

Execution reporting applies to scheduled occurrences only unless authority proves otherwise.

---

# 39. Current Item Reporting

If permitted, allow it.

Do not require elapsed state.

---

# 40. Next/Later Reporting

If permitted by domain, allow it.

Future completion can represent explicit early completion.

Do not “correct” user evidence.

---

# 41. Earlier Reporting

This is the most obvious V1 reporting context.

Ensure elapsed `notReported` items expose Record Outcome prominently enough to be useful.

---

# 42. Outcome Metadata

After successful report and cutoff advance, Today should render canonical query output:

```text
Reported completed
```

not local optimistic state.

The query remains source of display truth.

---

# 43. No Local Outcome Shadow State

Do not maintain a second persistent/UI outcome map.

Temporary pending state is allowed.

After write, canonical query result governs.

---

# 44. Correction Metadata

If Today query exposes enough provenance to know an outcome exists, UI may label:

**Change Outcome**

Do not expose revision IDs.

---

# 45. Retraction Metadata

Use simple copy:

**Remove Report**

rather than:

* Retract assertion;
* Create retraction.

Architecture stays hidden.

---

# 46. Accessibility — Outcome Menu

Record Outcome control must be keyboard accessible.

If expanding inline choices:

* button exposes expanded state;
* focus moves predictably if current conventions support it;
* Escape may close if easy/consistent.

Do not require custom composite widgets if native buttons suffice.

---

# 47. Accessibility — Choice Labels

Buttons must expose full names:

* Completed;
* Partial;
* Skipped.

Do not use icons alone.

---

# 48. Accessibility — Save Status

Use restrained status semantics.

Do not announce every card in Today when one write completes.

---

# 49. Accessibility — Error

Write failure should be associated with the affected occurrence and announced through an alert/status pattern.

---

# 50. Focus After Success

Strong preference:

return focus to the action/control region for that same occurrence after the canonical re-query.

Do not dump focus at page top.

If the original Record Outcome control disappears because outcome is now reported, focus the new **Change Outcome** control or item heading.

---

# 51. Focus After Correction

Return to the same occurrence.

---

# 52. Focus After Retraction

Return to the restored **Record Outcome** control.

---

# 53. Focus After Error

Leave focus on/recover to the failed action.

---

# 54. Refresh Interaction

Existing Refresh remains available.

If write success advances cutoff automatically, Refresh remains useful for passive time/evidence progression.

---

# 55. Stale Write Race

Mandatory case:

```text
start report for occurrence A

Today Refresh / republication / restore / clear happens

write resolves
```

Do not apply stale local UI state to a now-different occurrence/result.

Canonical authority may still contain the accepted write; surface must re-query safely.

---

# 56. Navigation-Away Race

Write may complete after leaving Today.

Do not mutate another surface.

On later re-entry, canonical query should reflect the write according to evaluation cutoff.

---

# 57. Full Clear During Write

Audit runtime transaction behavior.

If full clear occurs before write commit:

follow canonical transaction/mutation admission.

Do not resurrect cleared execution authority locally.

---

# 58. Restore During Write

Likewise preserve canonical transaction semantics.

No Today-specific conflict policy.

---

# 59. Revision Conflict

If ExecutionHistory command uses expected revision:

surface stale/conflict distinctly.

Copy conceptually:

> This outcome changed. Refresh Today and try again.

Do not silently overwrite.

---

# 60. Mutation Admission

Use existing authority mutation-admission layer.

Do not write directly to IndexedDB/store internals.

---

# 61. Execution Protection Subscription

Authority protection changes should remove/disable reporting controls after canonical re-query.

No stale writable UI.

---

# 62. Today Query Lifecycle Preservation

Do not weaken:

* generation identity;
* stale-response rejection;
* same-cutoff passive requery;
* lazy loading;
* Refresh behavior.

Extend carefully for write-induced cutoff advancement.

---

# 63. Lazy Surface Preservation

Today remains lazy-loaded.

Do not make Today eager because it now has write controls.

---

# 64. Query Chunk Preservation

Keep `queryToday` lazy unless implementation evidence requires otherwise.

---

# 65. Write-Code Chunking Audit

Outcome reporting command adapters may already be eager through Planner/reporting flows.

Measure.

Do not force duplicate lazy chunks merely to optimize a tiny command wrapper.

---

# 66. Bundle Constraint

Current 6.4:

```text
Initial raw      682,515
Initial gzip     169,838
Largest lazy      30,091
Total JS         724,751
```

Budgets:

```text
Initial raw      <= 685,000
Initial gzip     <= 170,000
Largest lazy     <= 100,000
Total JS         <= 750,000
```

Only ~162 gzip bytes of initial headroom remain.

Do not raise thresholds.

---

# 67. Expected Bundle Strategy

Strong preference:

* keep Today interaction code inside lazy Today chunk;
* avoid new eager shell imports;
* reuse existing command contracts/types without pulling large implementation families into eager path.

---

# 68. Total JS Headroom

Total-JS headroom is ~25 kB.

Task 6.5 should remain bounded.

If total JS exceeds budget, inspect duplication/chunking.

---

# 69. Responsive Interaction

On mobile:

* Record Outcome button spans/aligns naturally;
* choices stack or wrap;
* no horizontal button strip required;
* correction/retraction controls remain reachable.

---

# 70. Desktop Interaction

Keep action controls secondary to chronology.

Today should still scan as a schedule, not a form dashboard.

---

# 71. No Modal Requirement

Prefer inline expansion/card actions.

Use a modal only if existing reporting UI already has a well-tested reusable pattern and it clearly improves accessibility.

---

# 72. Existing Reporting UI Reuse

Audit current Planner/reporting component.

Reuse:

* command mapping;
* copy;
* validation;
* focus patterns;

where semantically appropriate.

Do not duplicate execution reporting policy.

---

# 73. No Generic Execution Form Rewrite

Task 6.5 is integration, not redesign.

---

# 74. Correction/Retraction Visibility

Do not expose every possible history action simultaneously.

Possible pattern:

```text
Reported completed
[Change Outcome] [Remove Report]
```

Keep compact.

---

# 75. No Execution History Timeline

Do not show historical correction chains in Today V1.

Summary/history surfaces own deeper historical analysis.

---

# 76. Same-Day Republication UX

If occurrence disappears after a write-triggered re-query due to a newer publication:

do not attempt to keep its card alive.

Canonical current plan wins.

The report remains in ExecutionHistory as historical evidence.

---

# 77. Outcome Against Superseded Occurrence

If command was accepted for an occurrence that was superseded during the race:

do not migrate it.

Exact historical identity remains.

---

# 78. Read-Model Independence

Do not modify Task 6.3 temporal classification to make reporting easier.

---

# 79. Outcome Eligibility Helper

If UI eligibility logic is non-trivial, prefer one pure/application helper based on canonical Today occurrence state and ExecutionHistory command capability.

Do not scatter conditionals across renderers.

---

# 80. UI State

Allowed ephemeral state:

* expanded reporting occurrence ref;
* pending occurrence ref(s);
* write error;
* confirmation state;
* focus return target;
* generation/write token.

No durable state.

---

# 81. Tests — First Report

Cover completed/partial/skipped from notReported.

---

# 82. Tests — Correction

Cover:

* completed → partial;
* partial → skipped;
* skipped → completed;

according to canonical command support.

---

# 83. Tests — Retraction

Cover report → remove → canonical notReported after re-query.

---

# 84. Tests — Exact Identity

Two visually identical occurrences.

Reporting one must not affect the other.

---

# 85. Tests — Recreated Source

Report old frozen occurrence after current source recreation; no retarget.

---

# 86. Tests — Current/Future/Elapsed

Cover each temporal position if reporting is allowed.

If domain forbids one, assert absence based on canonical eligibility.

---

# 87. Tests — All-Day

Cover allowed/forbidden reporting exactly as domain supports.

---

# 88. Tests — Legacy V1

Cover reporting eligibility without timing guess.

---

# 89. Tests — Attention Items

No reporting controls for unplaced/omitted/blocked.

---

# 90. Tests — Protected Execution

No writes; recovery/unavailable copy persists.

---

# 91. Tests — Missing/Empty/Protected Plan

No reporting controls.

---

# 92. Tests — Write Failure

Outcome remains unchanged; error shown; retry possible.

---

# 93. Tests — Duplicate Click

Only one canonical command accepted.

---

# 94. Tests — Cutoff Advancement

If chosen:

successful write advances Today cutoff and newly written outcome appears.

Passive same-cutoff authority change still does not.

Mandatory distinction.

---

# 95. Tests — Refresh After Write

Refresh continues to advance time normally.

---

# 96. Tests — Write/Refresh Race

Newest canonical query wins.

---

# 97. Tests — Write/Navigation Race

No cross-surface corruption.

---

# 98. Tests — Clear/Restore Race

No stale Today state resurrection.

---

# 99. Tests — Revision Conflict

If supported, conflict message and no silent overwrite.

---

# 100. Tests — Focus

After:

* report;
* correction;
* retraction;
* failure;

focus remains on same occurrence/action region.

---

# 101. Tests — Accessibility

Cover:

* Record Outcome accessible name;
* expansion state;
* outcome choice buttons;
* saving status;
* error alert;
* correction/retraction controls;
* confirmation if present.

---

# 102. Tests — Mobile Structure

No horizontal dependency for choice buttons.

---

# 103. Tests — Unauthorized Writes

Assert absence of:

* Move;
* Reschedule;
* Add Event;
* Resolve Friction;
* Record Goal Value;
* Edit Commitment.

---

# 104. Tests — Unauthorized Semantics

Assert reporting does not introduce:

* success;
* failure;
* missed;
* behind;
* capacity;
* recommendation.

---

# 105. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.5_TODAY_OUTCOME_REPORTING_INTEGRATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.4 Prerequisite Confirmation
4. Initial ExecutionHistory Audit
5. Files Changed
6. Reporting Eligibility
7. Temporal-Position Eligibility
8. All-Day Eligibility
9. Legacy V1 Eligibility
10. Attention-Item Exclusion
11. Command Boundary
12. Exact Identity
13. First Report Flow
14. Completed Flow
15. Partial Flow
16. Skipped Flow
17. Correction Flow
18. Retraction Flow
19. Confirmation Decisions
20. Write Timestamp
21. Evaluation Cutoff Decision
22. Post-Write Cutoff Advancement
23. Same-Cutoff Passive Changes
24. Write In-Flight State
25. Duplicate Submission
26. Write Failure
27. Durability Failure
28. Protection
29. Missing/Empty Plan
30. Current Reporting
31. Future Reporting
32. Earlier Reporting
33. All-Day Reporting
34. Legacy Reporting
35. Outcome Metadata
36. No Local Shadow State
37. Revision Conflict
38. Mutation Admission
39. Stale Write Race
40. Navigation Race
41. Refresh Race
42. Clear/Restore Race
43. Republication Race
44. Superseded Occurrence
45. Accessibility
46. Focus
47. Responsive Behavior
48. Mobile
49. Desktop
50. Lazy Surface Preservation
51. Bundle Architecture
52. Bundle Comparison
53. Tests Added/Changed
54. Focused Validation
55. Full Validation
56. Bundle Validation
57. Manual Product Walkthrough
58. Governance Updates
59. ADR Determination
60. Deviations
61. Discoveries
62. Deferred Work
63. Eligibility Matrix
64. Outcome Action Matrix
65. Cutoff Matrix
66. Race Matrix
67. Focus Matrix
68. Accessibility Matrix
69. Bundle Matrix
70. Product-Boundary Matrix
71. Epistemic Matrix
72. Architectural Invariant Assessment
73. Stop-Condition Assessment
74. Architectural Alignment Assessment
75. Task 6.6 Readiness
76. Recommended Next Task
77. Final Completion Determination

---

# 106. Required Eligibility Matrix

Produce:

| Today item          | Reportable? | Reason |
| ------------------- | ----------: | ------ |
| V2 timed current    |             |        |
| V2 timed upcoming   |             |        |
| V2 timed elapsed    |             |        |
| V2 all-day          |             |        |
| V1 legacy scheduled |             |        |
| unplaced            |             |        |
| omitted             |             |        |
| blocked             |             |        |

Use canonical domain evidence.

---

# 107. Required Outcome Action Matrix

Produce:

| Current state       | Available actions |
| ------------------- | ----------------- |
| notReported         |                   |
| completed           |                   |
| partial             |                   |
| skipped             |                   |
| execution protected |                   |
| write pending       |                   |

---

# 108. Required Cutoff Matrix

Produce:

| Event                          | Evaluation cutoff behavior |
| ------------------------------ | -------------------------- |
| enter Today                    |                            |
| passive authority notification |                            |
| Refresh                        |                            |
| successful outcome write       |                            |
| failed write                   |                            |
| correction                     |                            |
| retraction                     |                            |

---

# 109. Required Race Matrix

Produce:

| Race                         | Required behavior |
| ---------------------------- | ----------------- |
| write + Refresh              |                   |
| write + navigation away      |                   |
| write + republication        |                   |
| write + full clear           |                   |
| write + restore              |                   |
| two writes same occurrence   |                   |
| writes different occurrences |                   |

---

# 110. Required Focus Matrix

Produce:

| Action              | Focus after completion |
| ------------------- | ---------------------- |
| first report        |                        |
| correction          |                        |
| retraction          |                        |
| write failure       |                        |
| cancel confirmation |                        |

---

# 111. Required Accessibility Matrix

Produce:

| Interaction               | Requirement         |
| ------------------------- | ------------------- |
| Record Outcome            | named button        |
| expanded options          | exposed state       |
| Completed/Partial/Skipped | textual buttons     |
| saving                    | status              |
| error                     | alert               |
| Change Outcome            | named               |
| Remove Report             | named               |
| confirmation              | keyboard accessible |

---

# 112. Required Bundle Matrix

Use 6.4 baseline:

| Metric       |     6.4 | 6.5 | Delta |
| ------------ | ------: | --: | ----: |
| Initial raw  | 682,515 |     |       |
| Initial gzip | 169,838 |     |       |
| Today query  |   4,890 |     |       |
| Today UI     |   7,245 |     |       |
| Summary      |  30,091 |     |       |
| Largest lazy |  30,091 |     |       |
| Total JS     | 724,751 |     |       |

---

# 113. Required Product-Boundary Matrix

Produce:

| Capability           | Task 6.5   |
| -------------------- | ---------- |
| Today read model     | Preserved  |
| read-only chronology | Preserved  |
| first outcome report |            |
| correction           |            |
| retraction           |            |
| exact identity       |            |
| plan mutation        | Prohibited |
| commitment editing   | Prohibited |
| friction action      | Deferred   |
| Goal context         | Deferred   |
| Progress context     | Deferred   |
| Recommendation       | Prohibited |
| Capacity             | Prohibited |

---

# 114. Required Epistemic Matrix

Produce:

| Evidence/action        | DayFrame may say                     | Must not say                      |
| ---------------------- | ------------------------------------ | --------------------------------- |
| user reports completed | Reported completed                   | Goal success                      |
| user reports partial   | Reported partial                     | failure                           |
| user reports skipped   | Reported skipped                     | missed due to cause               |
| no report              | Not reported                         | skipped                           |
| retracted report       | Not reported/current canonical state | report never existed historically |
| current + completed    | Current + Reported completed         | inconsistency                     |
| upcoming + completed   | Next/Later + Reported completed      | invalid unless authority says so  |
| unplaced               | Unplaced                             | skipped                           |
| blocked                | Blocked                              | user failed                       |

---

# 115. Architectural Invariants

Assess at minimum:

1. Today read semantics remain unchanged.
2. reporting writes only ExecutionHistory.
3. HistoricalPlan is never mutated.
4. Active is never mutated by Today reporting.
5. Preview is never mutated.
6. Goal is never mutated.
7. Measurement is never mutated.
8. Observation is never mutated.
9. exact occurrence identity is used.
10. title matching is prohibited.
11. time matching is prohibited.
12. source recreation does not retarget report.
13. existing ExecutionHistory commands are reused.
14. no new outcome category is added.
15. completed remains explicit report.
16. partial remains explicit report.
17. skipped remains explicit report.
18. notReported remains absence of effective report.
19. elapsed does not auto-report.
20. current does not auto-report.
21. upcoming does not auto-report.
22. all-day does not auto-report.
23. reporting eligibility follows authority rules.
24. unplaced is not reportable unless authority explicitly supports it.
25. omitted is not reportable.
26. blocked is not reportable.
27. correction uses canonical append-only semantics.
28. retraction uses canonical semantics.
29. no historical record is deleted to correct outcome.
30. no local outcome shadow authority exists.
31. pending UI state is ephemeral.
32. successful write re-renders from canonical query.
33. failed write does not claim success.
34. duplicate submission is prevented.
35. mutation admission is respected.
36. protection disables writes.
37. missing plan disables writes.
38. known-empty disables writes.
39. stale writes do not corrupt new plan UI.
40. republication does not migrate outcome.
41. exact old occurrence remains historical subject.
42. post-write cutoff behavior is explicit.
43. passive authority updates do not silently advance cutoff.
44. Refresh continues to advance cutoff.
45. user-initiated successful write may advance cutoff if adopted.
46. write failure does not advance cutoff.
47. correction follows same cutoff rule.
48. retraction follows same cutoff rule.
49. stale responses remain rejected.
50. navigation-away race is safe.
51. clear race is safe.
52. restore race is safe.
53. write/Refresh race is safe.
54. write/republication race is safe.
55. focus remains local to occurrence.
56. reporting controls are keyboard accessible.
57. outcome choices are textual.
58. saving/error states are accessible.
59. mobile does not require horizontal controls.
60. Today remains lazy.
61. Summary remains lazy.
62. Planner remains default/eager.
63. bundle thresholds are unchanged.
64. initial raw remains within budget.
65. initial gzip remains within budget.
66. largest lazy remains within budget.
67. total JS remains within budget.
68. no new runtime dependency is added.
69. no new authority exists.
70. no new persistence key exists.
71. no DB migration exists.
72. Backup V6 remains unchanged.
73. no plan mutation exists.
74. no rescheduling exists.
75. no friction action exists.
76. no Goal context is implemented.
77. no Progress context is implemented.
78. no Recommendation exists.
79. no Capacity exists.
80. canonical validation passes.

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

# 116. Stop Conditions

Stop and report if:

* Today cannot write outcomes through the existing ExecutionHistory command surface;
* reporting requires matching by title/time;
* canonical command requires authority not present in Today result;
* reporting eligibility is ambiguous;
* correction/retraction semantics are not canonical;
* a same-day write cannot be reconciled with explicit evaluation-cutoff semantics without inventing a hidden exception;
* protection cannot reliably disable mutation;
* lazy Today must become eager;
* bundle budgets cannot remain green without raising thresholds;
* outcome reporting requires a new execution authority;
* task would require plan mutation or same-day rescheduling.

Do not widen scope around a stop condition.

---

# 117. Focused Validation

Run focused suites covering:

* TodaySurface;
* ExecutionHistory commands;
* reporting eligibility;
* first report;
* correction;
* retraction;
* cutoff advancement;
* exact identity;
* protection;
* stale races;
* focus/accessibility;
* lazy Today integration.

Record exact files/test counts.

---

# 118. Full Validation

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

* test-file count;
* test count;
* build modules;
* initial raw;
* initial gzip;
* Today chunks;
* Summary chunk;
* largest lazy;
* total JS;
* diff result.

---

# 119. Manual Product Walkthrough

If browser available, inspect:

### Earlier item

* Record Outcome;
* completed;
* correction;
* retraction.

### Current item

* reporting if eligible.

### Future item

* reporting if eligible.

### All-day

* reporting if eligible.

### Legacy

* timing warning + reporting behavior.

### Protected

* no write controls.

### Mobile

* choices and correction controls stack cleanly.

### Race sanity

* refresh after write;
* navigate away/back.

If unavailable, state explicitly.

---

# 120. Governance

Update:

* Task 6.5 result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

No ADR unless Task 6.5 creates a genuinely new enduring rule around user-initiated cutoff advancement that is not already covered by reporting/query governance.

If such a rule is accepted, consider:

> **ADR — User-Initiated Evidence Writes and Today Evaluation Cutoff Advancement**

Only if warranted.

---

# 121. Task 6.6 Readiness

If Task 6.5 completes:

> **Task 6.6 — Planner Schedule-Review Convergence** may begin.

At that point Today has become a useful live operational surface:

```text
see plan
    +
see reported reality
    +
record reality
```

without yet gaining schedule mutation.

---

# 122. Recommended Next Task

If green:

> **Task 6.6 — Planner Schedule-Review Convergence.**

---

# 123. Completion Criteria

Task 6.5 is complete only when:

* eligible Today scheduled occurrences expose bounded outcome-reporting controls;
* eligibility comes from canonical ExecutionHistory/domain rules;
* exact durable occurrence identity is used for every write;
* title/time matching is absent;
* Completed/Partial/Skipped map to existing governed outcomes;
* first reports use canonical ExecutionHistory commands;
* corrections use canonical correction semantics;
* retractions use canonical retraction semantics;
* unplaced/omitted/blocked remain non-reporting plan attention;
* all-day/legacy reporting follows authority capability without timing guesses;
* temporal position does not automatically gate/report outcome unless existing domain requires it;
* writes never mutate HistoricalPlan/Active/Preview/Goal;
* no local shadow outcome authority is created;
* pending state is ephemeral;
* successful writes render canonical query output;
* failed writes retain prior canonical result and expose retry;
* duplicate submissions are prevented;
* protection disables writes;
* missing/empty/protected plan states expose no reporting controls;
* user-initiated write cutoff behavior is explicit;
* passive authority changes continue respecting fixed-cutoff semantics;
* Refresh still advances evaluation time;
* stale write/query/republication/navigation/clear/restore races cannot corrupt visible state;
* correction/retraction preserve historical evidence;
* source recreation does not retarget reports;
* focus returns to the affected occurrence;
* keyboard/accessibility/mobile behavior is sound;
* Today remains lazy;
* initial bundle budgets remain green without threshold inflation;
* no new authority/schema/persistence/Backup version exists;
* no plan mutation/rescheduling/friction/Goal/Progress/Recommendation/Capacity behavior is introduced;
* focused and full validation pass;
* governance records Today as the first write-enabled operational surface;
* Task 6.6 is cleared.

---

# 124. Final Implementation Principle

> **Today may record what the user says happened, but it must never reinterpret what was planned or silently change the plan in response.**

Execution reporting belongs beside the occurrence the user is living, while planning remains Planner's responsibility.

---

# 125. Final Completion Statement

**Task 6.5 is complete when DayFrame makes the Today surface operational by allowing canonically eligible scheduled occurrences to record, correct, and retract explicit completed/partial/skipped outcomes through the existing ExecutionHistory mutation surface and exact durable occurrence identity; when temporal position remains independent of reported outcome, elapsed items are never auto-skipped, current items are never auto-underway, and future/all-day/legacy reporting eligibility follows existing authority semantics rather than UI assumptions; when user-initiated writes use mutation admission, durability/protection/error behavior, and append-only correction/retraction semantics already governed by ExecutionHistory; when a successful write causes Today to display the newly canonical evidence through an explicit, documented evaluation-cutoff rule rather than local shadow state, while passive authority changes continue to respect the existing fixed cutoff and Refresh remains the deliberate time-advancement mechanism; when duplicate submissions, revision conflicts, stale queries, navigation-away, republication, clear, restore, and concurrent-write races cannot attach an outcome to the wrong visible occurrence or resurrect stale UI; when all interaction remains keyboard-accessible, focus-stable, responsive, and compact enough that Today remains primarily an operational schedule rather than a form dashboard; when Today remains lazy-loaded and all Task 5.19 bundle budgets remain green without raising thresholds; when no HistoricalPlan, Active, Preview, Goal, Measurement, Progress, commitment, schedule, friction, Capacity, Recommendation, transition, persistence, schema, or Backup semantics are widened; and when canonical validation passes and Task 6.6 may proceed with Planner Schedule-Review Convergence.**
