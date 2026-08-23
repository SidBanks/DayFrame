# Task 3.6 — Implement Minimal Execution History Visibility and Correction Workflow

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded historical visibility, correction, and retraction workflow implementation task.

Task 3.6 makes durable `ExecutionHistory V1` reviewable beyond the immediate reporting control and adds the minimum explicit correction workflow required to keep execution history truthful over time.

This task includes:

* a minimal execution-history surface;
* recent/current history visibility;
* frozen historical planned-context display;
* current outcome display;
* revision-aware correction;
* correction from Complete ↔ Partial ↔ Skip where semantically legal;
* retraction;
* re-report after retraction;
* immutable revision preservation;
* optional correction of actual time/duration/note;
* durability feedback;
* retry;
* protected-ingress handling;
* quarantine-safe behavior;
* source-deletion independence;
* responsive/accessibility coverage;
* direct regression tests.

It does **not** implement:

* Progress;
* adherence;
* streaks;
* learning;
* historical scoring;
* schedule adaptation;
* generalized analytics;
* arbitrary plan-history reconstruction;
* timer timelines;
* integrations;
* quantity metrics;
* Backup V3;
* broad Planner/Summary redesign.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 3.1–3.5 are complete and accepted;
6. review:

   * `ExecutionRecord V1`;
   * `ExecutionHistory V1`;
   * `HistoricalExecutionTarget`;
   * Task 3.5 reporting UI;
   * current Preview/Planner structure;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.6_IMPLEMENT_MINIMAL_EXECUTION_HISTORY_VISIBILITY_AND_CORRECTION_WORKFLOW_RESULT.md`

If truthful correction requires changing `ExecutionRecord V1`, stop and report rather than silently changing the accepted domain contract.

---

# 2. Purpose

Task 3.5 established:

```text
planned occurrence
    ↓
user report
    ↓
ExecutionHistory
    ↓
current outcome
```

But durable history now exists beyond the selected Preview occurrence.

The user needs to be able to answer:

```text
What did I report?

What was the planned context at the time?

What is the current outcome?

Can I correct a mistake?

Can I retract the report entirely?
```

without depending on the original Preview still existing.

---

# 3. Governing Historical Principle

The history surface must display **historical authority**, not reconstructed current-plan interpretation.

Therefore:

> Frozen `ExecutionRecord` snapshot context outranks current source metadata for historical display.

And:

> Corrections append new immutable revisions; they never rewrite prior revisions in place.

---

# 4. Architectural Objective

After Task 3.6:

```text
ExecutionHistory V1
        ↓
current subjects
        ↓
recent history view
        ↓
selected subject
        ↓
current assertion
        ├─ correct
        ├─ retract
        └─ inspect historical context

correction/retraction
        ↓
new immutable revision
        ↓
new current outcome
```

No progress calculation occurs.

---

# 5. Required Initial UI Audit

Before coding, inspect:

* current Planner/Preview layout;
* execution reporting controls;
* accepted-choice panel;
* workflow/detail panel;
* mobile layout;
* existing navigation model;
* status/feedback patterns;
* current history surface accessors/subscriptions;
* current correction/retraction store APIs;
* current record projection helpers.

Determine the narrowest place for a persistent history view.

---

# 6. Surface Location

Preferred:

> a compact “Execution history” or “Recent outcomes” section in the current Planner/Preview-oriented workflow.

Do not create a broad analytics route.

A new small panel/section is allowed if current layout needs one.

---

# 7. No Dependency On Current Preview

Execution history must remain visible when:

* Preview is absent;
* Preview is stale;
* target source is deleted;
* source is recreated;
* profile changes;
* backup restore changes current planning authority.

History is its own durable authority.

---

# 8. History Source

The surface must read from:

`ExecutionHistory`

not from:

* Preview blocks;
* authored source;
* PlanDecision;
* reporting form state.

---

# 9. Current Subject Projection

Display one current item per `ExecutionSubjectId`.

Do not show every immutable revision in the default compact list.

The list represents current historical outcome per subject.

---

# 10. Revision History Visibility

Task 3.6 must determine the minimum revision visibility.

Preferred:

* compact list shows current outcome;
* selected history detail may show prior revisions chronologically.

This is allowed because correction history is already durable evidence.

Do not build a sophisticated audit log.

---

# 11. Revision Ordering

Use correction-chain topology, not array order.

Display:

root → current head.

---

# 12. Current Outcome States

Show:

* Completed
* Partial
* Skipped
* Not reported

`Not reported` corresponds to:

* retraction head;
* no current assertion.

Do not show “missed.”

---

# 13. Frozen Historical Context

For each history subject, display from stored snapshot:

* historical title;
* user-day date;
* planned state;
* scheduled interval if present;
* source family where useful.

Do not dynamically replace title/category with current source values.

---

# 14. Deleted Source

History remains fully readable using the frozen snapshot.

No warning is required merely because the source was deleted.

Optional context:

> “Original planning source no longer exists.”

Only if current source resolution is explicitly checked for enrichment.

Do not make this required.

---

# 15. Recreated Source

Do not relabel history with the recreated source.

No retargeting.

---

# 16. Current Source Enrichment

Preferred:

> do not enrich V1 history display from current source at all.

Frozen snapshot is sufficient and safer.

Document if any enrichment is used.

---

# 17. Planned State Display

Support:

* scheduled;
* unplaced;
* omitted;
* blocked;
* unplanned if future/unplanned records exist through lower-level APIs.

Even though Task 3.5 did not add unplanned UI, the history surface should not break if valid unplanned records exist.

---

# 18. Scheduled Historical Context

Show the frozen scheduled interval.

No recomputation.

---

# 19. Unplaced Historical Context

Show:

> Not placed in the schedule

No fictional time.

---

# 20. Omitted Historical Context

Show:

> Omitted from the plan

---

# 21. Blocked Historical Context

Show:

> Accepted placement was blocked

No invented scheduled interval.

---

# 22. Unplanned Historical Context

If encountered:

> Unplanned activity

Do not fabricate plan context.

---

# 23. Actual Evidence Display

For current assertion, show when present:

* reported actual occurrence time;
* reported duration;
* note.

These are user-reported historical evidence.

Do not label them observed/objective.

---

# 24. Actual Time Label

Prefer:

> Reported time

not:

> Actual time

if wording risks implying independent verification.

Task 3.1 explicitly distinguishes user report from observation.

---

# 25. Duration Label

Prefer:

> Reported duration

---

# 26. Note Display

Read-only in normal history display.

Correction form may replace it.

---

# 27. RecordedAt Display

Determine whether useful.

Preferred:

* show in revision detail;
* not necessary in compact list.

Label:

> Reported on

or:

> Recorded on

This is distinct from occurrence time.

---

# 28. Provenance Display

V1 provenance is only `userReported`.

No need to show repetitive provenance in compact UI.

Revision detail may say:

> User reported

if useful.

---

# 29. History Ordering

Use deterministic user-facing ordering.

Preferred:

1. historical user-day descending;
2. scheduled/planned time where present;
3. subject ID as deterministic fallback.

Do not rely on storage array order.

---

# 30. Recent History Scope

Task 3.6 is minimal.

Preferred:

> show a bounded recent set, such as recent N current subjects or current Preview-adjacent range.

But do **not** delete or truncate durable history.

If arbitrary retention UI complicates scope:

* show all current subjects for now with simple ordering.

Document choice.

---

# 31. No Silent Durable Trimming

Presentation limits must not delete history.

---

# 32. Filtering

No advanced filtering required.

Optional simple:

* All
* Completed
* Partial
* Skipped
* Not reported

Only if trivial.

Prefer no filter for V1.

---

# 33. Selected History Item

Selecting an item may open inline/detail panel with:

* frozen planned context;
* current outcome;
* evidence;
* correction controls;
* retraction;
* revision history.

No new route required.

---

# 34. Correction Meaning

Correction means:

> “My earlier report was wrong; replace the current assertion with this corrected assertion.”

It is not:

* edit in place;
* history deletion;
* PlanDecision change;
* schedule change.

---

# 35. Correction API

Use existing:

`correctExecutionRecord(...)`

or equivalent Task 3.3 authority.

Do not directly append arbitrary raw record objects.

---

# 36. Correction Target

Correction must identify:

* ExecutionSubjectId;
* current ExecutionRecordId.

Store rechecks current-head authority.

---

# 37. Stale Correction UI

If another revision becomes current before submit:

* correction rejects `notCurrentHead`;
* refresh item;
* show factual conflict;
* do not branch.

---

# 38. Correction Outcome Options

For a planned subject:

* Complete
* Partial
* Skip

For an unplanned subject:

* Complete
* Partial

Skip remains invalid.

---

# 39. Correct Complete → Partial

Allowed.

Append new assertion.

---

# 40. Correct Partial → Complete

Allowed.

---

# 41. Correct Complete → Skip

Allowed for planned subject.

---

# 42. Correct Skip → Complete

Allowed.

---

# 43. Correct Skip → Partial

Allowed.

---

# 44. Correct Unplanned → Skip

Forbidden.

UI should not offer it.

Domain remains final authority.

---

# 45. Correction Snapshot Semantics

Task 3.2 allows a complete corrected snapshot per revision.

Task 3.6 should determine whether normal correction UI edits snapshot fields.

Preferred:

> no.

The correction UI corrects the execution assertion/evidence while carrying forward the existing frozen snapshot unchanged.

Reason:

Task 3.6 is outcome correction, not historical-plan editing.

---

# 46. Snapshot Correction Deferred

If the historical snapshot itself is wrong, that requires a more explicit advanced correction workflow.

Defer unless unavoidable.

Document this limitation.

---

# 47. Correction Evidence

Allow corrected:

* outcome;
* reported occurrence time;
* reported duration;
* note.

Use same validation as initial report.

---

# 48. Correction `recordedAt`

Store owns new revision time.

Do not preserve old `recordedAt`.

The new revision truthfully records when correction was made.

---

# 49. Correction Provenance

Store/domain owns `userReported`.

---

# 50. Correction IDs

Store owns new record ID.

Subject ID remains the same.

---

# 51. Correction Form Defaults

Initialize from current assertion:

* outcome;
* occurredAt if present;
* duration if present;
* note.

Unlike first-report form, these are existing user-reported values and may safely prefill.

---

# 52. Skip Correction Form

When selecting Skip:

* clear/hide actual occurrence time;
* clear/hide duration;
* note may remain.

---

# 53. Complete/Partial Correction Form

Actual evidence remains optional.

---

# 54. Correction Validation

Reuse the same pure reporting builder/domain constraints where possible.

Do not create divergent validation.

---

# 55. Retraction Meaning

Retraction means:

> “I withdraw this report; DayFrame should no longer claim a current reported outcome for this subject.”

It does not delete prior evidence.

---

# 56. Retraction API

Use:

`retractExecutionRecord(...)`

---

# 57. Retraction Result

Current outcome becomes:

> Not reported

Previous revisions remain visible in history detail.

---

# 58. Retraction Note

Optional reason/note may be supported if existing API does.

Do not require.

---

# 59. Retraction Confirmation

Task 3.5 already exposes Undo without modal.

For history view, either:

* clear “Retract report” button with lightweight confirmation;
* or direct action with immediate reversibility.

Preferred:

> lightweight inline confirmation if easy.

Do not add heavy modal infrastructure.

---

# 60. Re-Report After Retraction

Allow:

* Complete
* Partial
* Skip for planned subject.

Use the existing same-subject restoration path.

Do not create a new subject.

---

# 61. Re-Report UI

A retracted item should show:

> Not reported

and:

> Report outcome

The subsequent report replaces the retraction head.

---

# 62. Revision History

For selected subject, show prior revisions.

At minimum each revision should display:

* revision kind:

  * Report
  * Correction
  * Retraction
* reported outcome if assertion;
* recordedAt;
* evidence summary;
* note if present.

---

# 63. Revision History Is Immutable

No editing individual historical revisions.

Only the current head may be corrected/retracted.

---

# 64. Historical Revision Labels

Prefer factual language:

* Initial report
* Corrected report
* Retracted report

Do not expose `replacesRecordId`.

---

# 65. Record IDs Hidden

Do not display IDs.

---

# 66. Subject IDs Hidden

Do not display IDs.

---

# 67. DurableOccurrenceReference Hidden

Do not display raw reference.

---

# 68. Current Outcome Determination

Always derive from ExecutionHistory.

Do not infer from last visible array element.

---

# 69. History Subscription

The view subscribes to ExecutionHistory authority.

Correction/retraction changes update immediately.

---

# 70. Durability Subscription

Subscribe to dedicated history durability.

Show save failure/retry separately from outcome.

---

# 71. Ingress Subscription

Protected history ingress must disable correction/retraction/new report actions.

Existing valid history under whole protection is safe-empty according to Task 3.3.

Do not expose protected raw bytes in ordinary history UI.

---

# 72. Quarantine

Quarantined components are not normal history.

Do not show them in the ordinary history list.

No quarantine-management UI in this task.

---

# 73. Protected History Copy

Use concise factual message:

> “Execution history needs recovery before it can be changed.”

Existing reporting workflow may already provide copy.

Reuse.

---

# 74. Persistence Success

Correction/retraction:

* runtime projection updates;
* durability success may show subtle status.

No need for loud confirmation.

---

# 75. Persistence Failure

Runtime corrected/retracted outcome remains current for session.

Show:

> “History changed for this session, but saving failed.”

Provide Retry.

---

# 76. Retry

Use exact `retryExecutionHistoryPersistence`.

No new revisions.

---

# 77. Retry Success

Durability becomes saved.

No current-outcome mutation.

---

# 78. Retry Failure

Current session history remains.

---

# 79. Serialization Failure

Do not offer blind retry if Task 3.5 established it as recovery-required.

Preserve existing durability semantics.

---

# 80. Correction During Failed Persistence

ExecutionHistory desired condition supports additional valid runtime mutations.

Determine UI policy.

Preferred:

> allow further corrections if store authority allows them safely.

Each new valid mutation advances the desired checkpoint.

Do not block merely because prior write failed unless the store says unsafe.

---

# 81. Retraction During Failed Persistence

Same.

---

# 82. Restart After Unsaved Correction

Old durable history may return.

The UI warning must remain truthful.

No extra magic.

---

# 83. Current Planned Source Independence

Correction/retraction does not require:

* source still existing;
* source lifetime resolving;
* current Preview;
* current PlanDecision.

History correction acts on frozen historical authority.

This is a major requirement.

---

# 84. Deleted-Source Correction

A history subject whose source no longer exists must still be correctable/retractable.

Direct test required.

---

# 85. Recreated-Source Correction

Same.

No retargeting.

---

# 86. Profile Activation

History list remains.

Correction continues to work.

---

# 87. Backup V1 Import

History remains.

---

# 88. Backup V2 Restore

History remains.

---

# 89. PlanDecision Mutation

History remains.

Correction unaffected.

---

# 90. Preview Regeneration

History remains.

Correction unaffected.

---

# 91. Full Clear

History view empties.

---

# 92. Full Clear Protection

Use existing clear semantics.

No additional history-specific clear UI.

---

# 93. Report Control Integration

Task 3.5 inline reporting remains.

Do not remove it.

After a report is created, both:

* inline selected occurrence;
* history surface

must show the same current outcome.

---

# 94. Duplicate UI State

Avoid separate mutable outcome state.

Both consume ExecutionHistory.

---

# 95. Correction From History Updates Inline Control

If the corresponding planned occurrence is still visible, Task 3.5 control should reflect the corrected outcome through the history subscription.

Direct integration test if practical.

---

# 96. Retraction Updates Inline Control

Same.

It should show Not reported / allow re-report.

---

# 97. Historical Context Source

History list/detail always uses frozen ExecutionRecord snapshot.

Inline current occurrence may use current plan context for the selected reportable target.

Do not confuse these.

---

# 98. Planned Versus Reported Display

History detail should visually distinguish:

### Planned

what DayFrame had planned when the first/current assertion snapshot was frozen

### Reported

what the user said occurred

No analytics.

---

# 99. Snapshot Across Corrections

Because correction carries forward the existing snapshot in this workflow, planned context remains stable.

Direct test.

---

# 100. Retraction Snapshot

Retraction record itself has no snapshot.

History detail for a retracted subject should display the most recent preceding assertion snapshot.

Use chain history.

Do not rematerialize current planning state.

---

# 101. Retracted Planned Context Helper

Add a pure helper if needed:

> find the latest assertion snapshot in the subject chain.

No persistence.

---

# 102. Current Assertion After Retraction

There is none.

But subject history still has historical planned context.

---

# 103. Re-Report After Retraction Snapshot

Preferred:

> carry forward the most recent assertion snapshot unchanged.

Do not rematerialize from current source.

This preserves historical subject meaning.

---

# 104. Task 3.5 Re-Report Audit

Audit current re-report behavior.

If it currently rematerializes the target rather than carrying historical snapshot for a retracted subject, determine whether correction is needed.

The intended semantics are:

> same historical subject → same frozen historical context unless explicitly correcting snapshot.

If current behavior contradicts this, fix narrowly under 3.6 if it is application orchestration only.

If domain change is required, stop.

---

# 105. Outcome Correction Does Not Re-Materialize

Mandatory.

---

# 106. History View For Omitted-Then-Completed

Must display coherently:

```text
Planned:
Omitted from the plan

Reported:
Completed
```

No contradiction warning.

---

# 107. Blocked-Then-Completed

Same.

---

# 108. Unplaced-Then-Completed

Same.

---

# 109. Scheduled-Then-Skipped

Normal.

---

# 110. Partial Semantics

Do not infer percent complete.

---

# 111. No Missed

No history view state named:

* missed;
* failed;
* unsuccessful.

---

# 112. Unknown/Not Reported

Retraction projects Not reported.

Do not infer skipped.

---

# 113. No Passage-Of-Time Mutation

History view does not change because time passed.

---

# 114. No Progress Derived Here

Do not count completions.

---

# 115. No Summary Metrics

No:

* completed this week;
* completion rate;
* adherence percentage.

---

# 116. No Streaks

None.

---

# 117. No Learning Suggestions

None.

---

# 118. History Surface Naming

Preferred user-facing name:

> Execution history

Alternative:

> Reported outcomes

Choose according to current terminology.

Avoid:

> Performance history

or judgmental language.

---

# 119. Empty State

When no history exists:

> “No outcomes reported yet.”

No encouragement/gamification needed.

---

# 120. History Item Summary

Recommended compact item:

```text
Workout
Aug 21
Completed
```

with optional planned state/time.

---

# 121. Current Outcome Emphasis

Outcome should be visible but not treated as score.

---

# 122. Accessibility

History surface must use:

* semantic heading;
* list structure;
* native buttons;
* labeled correction form;
* status messages;
* accessible current-outcome labels;
* keyboard navigation.

---

# 123. Revision List Accessibility

Use semantic list.

Each revision should have readable chronological label.

---

# 124. Responsive Layout

Use stacked history cards/list.

No wide desktop-only table.

---

# 125. Modal Policy

Prefer inline/detail-panel correction.

Do not introduce a new modal system unless current app already uses one appropriately.

---

# 126. Correction Form

Use one compact editor.

Fields:

* outcome;
* reported datetime optional;
* duration optional;
* note optional.

---

# 127. Correction Form Date/Time Conversion

Reuse Task 3.5 helper.

Do not implement a second local-time conversion.

---

# 128. Shared Reporting Builder

Refactor if necessary so initial reporting and correction use the same evidence validation.

Authorized narrow refactor.

---

# 129. Correction Input Builder

Must accept:

* current frozen snapshot;
* current subject origin;
* new outcome/evidence.

It must not construct new planned target.

---

# 130. Retraction Builder

Use store API directly.

No UI-generated record.

---

# 131. Re-Report Builder

Use same correction path against retraction head, preserving subject/snapshot.

---

# 132. Store API Audit

Task 3.3 currently supports correction after retraction.

Reuse.

No new persistence schema.

---

# 133. Current Head Race

Correction form opened on R2.

R3 becomes head elsewhere.

Submit must fail safely.

UI refreshes to R3.

No branch.

---

# 134. Double Submit

Disable submit during operation.

Store current-head rules provide final defense.

---

# 135. Correction Persistence Failure

New revision exists in runtime.

UI immediately shows corrected outcome and warning.

---

# 136. Retraction Persistence Failure

UI shows Not reported + warning.

---

# 137. Re-Report Persistence Failure

Runtime restored outcome visible + warning.

---

# 138. Retry No-Reallocation

Direct regression inherited from Task 3.3; add UI integration where useful.

---

# 139. History Ordering After Correction

Correction should not create a duplicate subject list item.

Same subject remains one current history item.

---

# 140. Revision Count

Optional:

> “3 revisions”

Useful but not required.

---

# 141. Subject Current Item Date

Use frozen planned user-day, not latest `recordedAt`, for primary chronological organization.

This represents what occurrence the history is about.

---

# 142. Unplanned Item Date

If valid unplanned record lacks planned user-day semantics, use snapshot user-day context already required by ExecutionRecord.

No new semantics.

---

# 143. Multi-Year History

UI should not assume source still exists.

---

# 144. Presentation Performance

With localStorage-bounded V1 history, simple in-memory sort/projection is acceptable.

Do not optimize prematurely.

---

# 145. Projection Helper

Add pure helper to build history presentation items if useful.

Preferred.

---

# 146. Presentation Helper Purity

No store access.

Inputs:

* ExecutionRecord collections/components.

Outputs:

* current subject/history view model.

---

# 147. Presentation Model

Conceptual:

```ts
type ExecutionHistoryItem = {
  subjectId;
  currentOutcome;
  snapshot;
  currentRecord?;
  revisions;
};
```

Do not expose internal mutable objects.

---

# 148. Retraction Presentation

Current outcome Not reported.

Snapshot sourced from latest prior assertion.

---

# 149. Invalid Subject Component

Should never enter valid history accessor.

No UI repair.

---

# 150. Quarantined History Visibility

Deferred to recovery/history-management work.

Do not list in normal history.

---

# 151. History Export

No new export UI required.

Task 3.3 already has export primitive.

---

# 152. Backup V3

Still deferred.

History surface remains outside Backup V2.

---

# 153. Per-Subject Physical Delete

Still deferred.

Retraction remains ordinary user correction.

---

# 154. Correction Of Snapshot

Deferred.

---

# 155. Correction Of Planned Reference

Forbidden.

---

# 156. Correction Of Subject Identity

Forbidden.

---

# 157. Correction Of Source Family

Forbidden in this workflow.

---

# 158. Correcting Historical Context

If later needed, it should be an explicit advanced history-correction task.

---

# 159. Current Plan Relationship

History corrections do not change:

* current occurrence;
* current PlanDecision;
* current Preview;
* future recurrence.

---

# 160. Learning Relationship

No learning yet.

---

# 161. Future Progress Boundary

Task 3.6 establishes the trustworthy visible history that future Progress may consume.

But no metric is authorized here.

---

# 162. History Completeness

Do not claim history is complete merely because visible records exist.

No report remains unknown/unreported.

---

# 163. Copy Discipline

Use:

* Reported
* Completed
* Partial
* Skipped
* Not reported
* Correct report
* Retract report

Avoid:

* success;
* failure;
* compliance;
* adherence;
* missed.

---

# 164. Initial Report Label

In revision history:

> Initial report

---

# 165. Correction Label

> Correction

---

# 166. Retraction Label

> Retraction

---

# 167. Re-Report After Retraction Label

It is technically a correction assertion replacing the retraction.

User-facing label may be:

> New report

or:

> Corrected report

Choose consistently.

---

# 168. Existing Reporting Control Copy

Do not change unless required for terminology consistency.

---

# 169. Tests — Empty History

Surface shows empty state.

---

# 170. Tests — Completed Item

Frozen planned context + Completed visible.

---

# 171. Tests — Partial Item

Visible.

---

# 172. Tests — Skipped Item

Visible.

---

# 173. Tests — Retracted Item

Not reported visible.

Prior assertion remains in revision detail.

---

# 174. Tests — Omitted Completed

Mandatory.

---

# 175. Tests — Blocked Completed

Mandatory.

---

# 176. Tests — Unplaced Completed

Mandatory.

---

# 177. Tests — Deleted Source

History remains displayable and correctable.

---

# 178. Tests — Recreated Source

No relabel/retarget.

---

# 179. Tests — Profile Activation

History remains.

---

# 180. Tests — Backup V1

History remains.

---

# 181. Tests — Backup V2

History remains.

---

# 182. Tests — Preview Regeneration

History remains.

---

# 183. Tests — PlanDecision Mutation

History remains.

---

# 184. Tests — Complete → Partial

New revision appended.

Old remains.

Current projection Partial.

---

# 185. Tests — Partial → Complete

Same.

---

# 186. Tests — Complete → Skip

Planned only.

---

# 187. Tests — Skip → Complete

Allowed.

---

# 188. Tests — Unplanned Skip Hidden/Rejected

Required if unplanned subjects can appear.

---

# 189. Tests — Evidence Correction

Time/duration/note replacement works.

---

# 190. Tests — Snapshot Carried Forward

Mandatory.

---

# 191. Tests — No Rematerialization

Correction succeeds even when current source deleted.

Mandatory.

---

# 192. Tests — Retraction

Current outcome Not reported.

---

# 193. Tests — Re-Report

Same subject chain restored.

---

# 194. Tests — Current Head Race

Rejected and refreshed.

---

# 195. Tests — Persistence Failure

Runtime correction visible + warning.

---

# 196. Tests — Retry

No new revision.

---

# 197. Tests — Protected Ingress

Corrections disabled.

---

# 198. Tests — Quarantine Coexistence

Valid history remains editable.

---

# 199. Tests — Inline Reporting Synchronization

History correction updates Task 3.5 occurrence control if still visible.

---

# 200. Tests — No Missed

No time-passage logic.

---

# 201. Tests — Planning Isolation

Correction/retraction leaves:

* authored state;
* PlanDecision;
* Preview

unchanged.

---

# 202. Tests — Revision Ordering

Root-to-head deterministic.

---

# 203. Tests — Array Order Independence

History presentation remains identical under shuffled record storage order.

---

# 204. Tests — Clone Isolation

Presentation helper/UI cannot mutate store history.

---

# 205. Tests — Accessibility

Correction/retraction controls have accessible labels/status.

---

# 206. UI Audit

No Progress/analytics UI.

---

# 207. Persistence Audit

No schema/key/envelope change.

---

# 208. Backup Audit

No Backup V3.

---

# 209. Domain Audit

No ExecutionRecord schema change.

---

# 210. Expected Production Files

Likely:

* `code/src/core/execution/executionHistoryPresentation.ts` or equivalent;
* `code/src/ui/ExecutionHistoryPanel.tsx`;
* `code/src/ui/executionReportingWorkflow.ts` shared correction helper additions;
* `code/src/ui/PreviewScreen.tsx` or application container;
* `code/src/ui/dayFrameUi.css`;
* tests.

Avoid persistence/domain changes.

---

# 211. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.6_IMPLEMENT_MINIMAL_EXECUTION_HISTORY_VISIBILITY_AND_CORRECTION_WORKFLOW_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contracts
4. Initial UI Audit
5. Files Changed
6. History Surface Location
7. History Source
8. Presentation Model
9. Current Subject Projection
10. Revision History
11. Ordering
12. Frozen Historical Context
13. Deleted/Recreated Source Behavior
14. Planned-State Display
15. Actual Evidence Display
16. recordedAt Display
17. Empty State
18. Current Outcome Display
19. Correction Meaning
20. Correction API
21. Current-Head Enforcement
22. Outcome Correction Matrix
23. Unplanned Skip Boundary
24. Snapshot Carry-Forward
25. Snapshot Correction Boundary
26. Correction Evidence
27. Correction recordedAt/IDs/Provenance
28. Correction Form Defaults
29. Retraction Meaning
30. Retraction Workflow
31. Re-Report After Retraction
32. Revision History Presentation
33. Retraction Snapshot Presentation
34. Existing Reporting Integration
35. Inline Synchronization
36. Durability Feedback
37. Retry
38. Protected Ingress
39. Quarantine
40. Cross-Surface Independence
41. Profile Activation
42. Backup V1
43. Backup V2
44. PlanDecision Mutation
45. Preview Regeneration
46. Full Clear
47. Accessibility
48. Responsive Layout
49. Tests Added
50. History Display Tests
51. Correction Tests
52. Retraction/Re-Report Tests
53. Deleted/Recreated Source Tests
54. Cross-Surface Tests
55. Persistence Failure/Retry Tests
56. Protected/Quarantine Tests
57. Synchronization Tests
58. No-Missed Tests
59. Planning-Isolation Tests
60. Determinism/Clone Tests
61. UI Audit
62. Persistence Audit
63. Backup Audit
64. Architectural Alignment Assessment
65. Deviations
66. Discoveries and Deferred Work
67. Recommended Next Task
68. Focused Validation
69. Full Validation
70. Final Completion Determination

---

# 212. Required Matrices

## A. Current Outcome Matrix

| Current head | User-facing outcome |
| ------------ | ------------------- |

## B. Correction Matrix

| Current outcome | New outcome | Allowed? |
| --------------- | ----------- | -------: |

## C. Historical Context Matrix

| Planned state | Historical display |
| ------------- | ------------------ |

## D. Cross-Surface Matrix

| Transition | History retained? | Correction still possible? |
| ---------- | ----------------: | -------------------------: |

## E. Durability Matrix

| Operation | Runtime result | Persistence result | UI feedback |
| --------- | -------------- | ------------------ | ----------- |

---

# 213. Validation Requirements

Run focused tests for:

* history presentation;
* revision ordering;
* completed/partial/skipped/retracted states;
* omitted/blocked/unplaced historical context;
* correction transitions;
* actual evidence correction;
* snapshot carry-forward;
* deleted-source correction;
* recreated-source safety;
* retraction;
* re-report;
* stale current-head rejection;
* persistence failure;
* retry;
* protected ingress;
* quarantine;
* inline synchronization;
* planning isolation;
* no-missed semantics.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The complete repository suite must pass.

Record exact test-file/test counts.

---

# 214. Completion Criteria

Task 3.6 is complete only when:

* durable execution history is visible independently of current Preview;
* history uses frozen ExecutionRecord snapshot context rather than current source reconstruction;
* one current item is shown per execution subject;
* current outcome is derived from ExecutionHistory;
* completed/partial/skipped/not-reported states are clear;
* revision history can be inspected at least minimally;
* immutable prior revisions remain visible;
* corrections append replacement assertions rather than mutate records;
* planned subjects can correct among Complete/Partial/Skip;
* unplanned subjects cannot become Skip;
* correction may replace reported actual time/duration/note;
* ordinary correction preserves the historical snapshot and subject identity;
* correction does not rematerialize current planning state;
* deleted/recreated sources do not prevent correction;
* retraction projects Not reported;
* re-report after retraction preserves the same subject chain;
* current-head races fail without branching;
* persistence failure preserves runtime correction/retraction and exposes truthful Retry;
* protected ingress disables history mutation;
* quarantine does not contaminate valid history;
* Task 3.5 inline reporting and history view stay synchronized through shared ExecutionHistory authority;
* history corrections do not mutate authored setup, PlanDecision, Preview, or recommendations;
* no missed/failure/adherence inference is added;
* no progress/learning/analytics are introduced;
* no ExecutionRecord/ExecutionHistory durable schema change occurs;
* no Backup V3 is introduced;
* accessibility and responsive behavior are preserved;
* full validation passes;
* result artifact is complete.

---

# 215. Explicit Non-Goals

Do **not**:

* implement Progress;
* calculate completion rate;
* implement adherence;
* add streaks;
* add learning;
* adapt schedule automatically;
* add broad analytics;
* add arbitrary unplanned reporting UI;
* add imported-calendar history linkage;
* add missed;
* add cancellation;
* add quantity metrics;
* add timers;
* add integrations;
* implement Backup V3;
* physically delete individual history subjects;
* edit immutable old revisions;
* edit DurableOccurrenceReference;
* change subject identity;
* rewrite historical snapshot from current plan;
* persist old Preview;
* redesign Planner/Summary broadly.

---

# 216. Stop Conditions

Stop and report if:

* current correction API cannot preserve subject/snapshot semantics without changing `ExecutionRecord V1`;
* re-report after retraction currently requires rematerializing current plan;
* history cannot be displayed independently of current source without domain changes;
* valid current-head projection cannot be exposed efficiently without persistence changes;
* correction UI requires general plan-history editing;
* protected history semantics cannot be respected without broad recovery UI;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest prerequisite/completion task.

---

# 217. Recommended Follow-On Boundary

If Task 3.6 completes successfully, DayFrame will finally have:

```text
planned occurrence
    ↓
explicit execution report
    ↓
durable historical evidence
    ↓
review
    ↓
correction/retraction
```

The next task should therefore define, before implementing, what **Progress** is allowed to mean.

Recommended:

> **Task 3.7 — Audit and Define Progress, Completion, and Adherence Derivation Semantics**

That task should answer:

* what counts toward Progress;
* how completed/partial/skipped/unknown differ;
* whether omitted or unplaced activities belong in denominators;
* whether timing matters;
* whether “adherence” is a useful or misleading concept;
* how goals eventually map to execution subjects;
* how uncertainty propagates;
* what Summary may truthfully claim.

Task 3.7 should be architecture-first, not a metrics implementation task.

---

# 218. Task Determination

**Authorized:** persistent execution-history visibility, frozen historical-context presentation, minimal revision-history inspection, explicit correction of current execution assertions, retraction, same-subject re-report, shared validation, durability/retry feedback, cross-surface independence, and direct regression coverage.

**Not authorized:** Progress, adherence, streaks, learning, schedule adaptation, broad analytics, Backup V3, new execution outcomes, arbitrary unplanned UI, plan-history editing, physical history deletion, or changes to accepted Phase 2/Task 3.2–3.5 durable contracts.

The governing correction principle is:

> **Execution history may be corrected, but never rewritten invisibly. A new report may replace what DayFrame currently believes about the outcome, while the earlier assertion remains part of the immutable evidence chain.**

---

# 219. Final Completion Statement

**Task 3.6 is complete when DayFrame exposes durable ExecutionHistory V1 independently of current Preview or source existence; presents each execution subject using frozen historical planned context and the deterministic current outcome; provides minimal revision-history visibility; allows explicit current-head correction among the V1 outcomes and optional reported time/duration/note evidence while preserving subject identity and historical snapshot; allows immutable retraction to return the subject to Not reported and same-subject re-report thereafter; remains correct across deleted/recreated sources, Profile/Backup transitions, PlanDecision changes, Preview regeneration, persistence failure, retry, protected ingress, and quarantine; keeps the Task 3.5 inline reporting control synchronized through the shared history authority; never mutates old revisions, authored setup, PlanDecision, Preview, or scheduling behavior; never derives missed, failure, progress, adherence, or learning from history; passes complete repository validation; and introduces no ExecutionRecord/ExecutionHistory schema change, Backup V3, analytics system, or unrelated planning behavior.**