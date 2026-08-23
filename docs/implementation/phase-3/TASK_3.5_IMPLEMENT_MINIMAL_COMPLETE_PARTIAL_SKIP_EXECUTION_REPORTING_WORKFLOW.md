# Task 3.5 — Implement Minimal Complete / Partial / Skip Execution Reporting Workflow

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded user-facing execution-reporting workflow implementation task.

Task 3.5 implements the first explicit user workflow for reporting what actually happened to a planned occurrence.

This task includes:

* reportability gating through `HistoricalExecutionTarget`;
* Complete / Partial / Skip actions;
* explicit user-reported outcome;
* optional bounded actual-time evidence;
* optional bounded duration evidence;
* optional note;
* planned-target reporting;
* durability feedback;
* persistence retry;
* duplicate planned-subject handling;
* current-outcome feedback;
* protection/error handling;
* responsive/accessibility coverage;
* direct integration tests.

It does **not** implement:

* history browsing;
* history correction UI;
* retraction UI;
* unplanned execution UI;
* progress;
* adherence;
* streaks;
* learning;
* schedule adaptation;
* missed inference;
* cancellation;
* timer tracking;
* integrations;
* quantity-based metrics;
* Backup V3.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 3.1–3.4 are complete and accepted;
6. review:

   * `ExecutionRecord V1`;
   * `ExecutionHistory V1`;
   * `HistoricalExecutionTarget`;
   * current Preview/day-detail UI;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.5_IMPLEMENT_MINIMAL_COMPLETE_PARTIAL_SKIP_EXECUTION_REPORTING_WORKFLOW_RESULT.md`

If reporting cannot be safely implemented without broad history-management or Preview redesign, stop and report rather than broadening scope.

---

# 2. Purpose

DayFrame can now:

```text
plan occurrence
    ↓
materialize historical execution target
    ↓
persist immutable execution history
```

What is missing is the explicit user action:

```text
“What happened?”
    ↓
Complete / Partial / Skip
    ↓
ExecutionHistory.recordExecution(...)
```

Task 3.5 provides that narrow bridge.

---

# 3. Governing Epistemic Rule

The UI may record only what the user explicitly reports.

It must never infer:

* completed;
* partial;
* skipped;
* missed;
* failure;

from:

* scheduled time passing;
* disappearance from Preview;
* lack of interaction;
* friction;
* PlanDecision state.

No report means:

> unknown.

---

# 4. Architectural Objective

The workflow should become:

```text
reportable planned occurrence
        ↓
HistoricalExecutionTarget
        ↓
user explicitly selects:
    Complete
    Partial
    Skip
        ↓
optional execution evidence
        ↓
ExecutionHistory.recordExecution(...)
        ↓
runtime execution authority
        ↓
persistence attempt
        ↓
current derived outcome
```

No planning authority changes.

---

# 5. Required Initial UI Audit

Before coding, inspect:

* `PreviewScreen`;
* day-detail panel;
* workflow panel;
* scheduled block interaction;
* unplaced block interaction;
* accepted-choice panel;
* mobile layout;
* current status/feedback patterns;
* existing button conventions;
* Preview stale/`revisedAt` handling.

Choose the narrowest place where occurrence-specific reporting belongs.

---

# 6. Preferred UI Location

Preferred:

> occurrence/day-detail context inside the Planner/Preview workflow.

Do not create a new route.

Do not place execution reporting in Setup.

---

# 7. Reporting Entry Point

A report action should be available only when a selected occurrence can successfully materialize a `HistoricalExecutionTarget`.

No materialized target:

* no reporting mutation;
* show appropriate unavailable reason if useful.

---

# 8. Reportability Gate

Use Task 3.4 as the single authority.

Do not duplicate materialization logic in React.

---

# 9. Supported Planned Targets

Reporting may be exposed for:

* scheduled template occurrence;
* fixed template occurrence;
* unplaced template occurrence;
* omitted template occurrence where discoverable in current workflow;
* blocked template occurrence;
* work occurrence;
* manual event occurrence.

Only when materialization succeeds.

---

# 10. Unsupported Targets

Do not report against:

* imported calendar without durable reference;
* synthetic blocks;
* friction-only items;
* SuggestedFix-only items;
* Try-only geometry;
* stale Preview geometry;
* arbitrary historical source guesses.

---

# 11. Fresh Preview Scheduled Reporting

For scheduled occurrences:

* current authoritative Preview must satisfy Task 3.4 materialization;
* stale Preview blocks scheduled-geometry reporting;
* Try-only Preview blocks reporting from temporary geometry.

---

# 12. Accepted Try

After Accept + authoritative regeneration:

* reporting becomes available again.

---

# 13. Unplaced Reporting

An unplaced occurrence may still be reported:

* Complete;
* Partial;
* Skip.

Execution truth can differ from planning success.

---

# 14. Omitted Reporting

An omitted occurrence may still be reported Complete or Partial.

This is intentional:

> “DayFrame omitted it from the plan, but I did it anyway.”

Skip semantics require care.

If the occurrence was already planning-omitted, an execution `skipped` report may be redundant or misleading.

Audit and define.

Preferred:

* allow `skipped` only if it remains semantically meaningful to the user;
* otherwise suppress Skip for an omitted target.

Document explicitly.

---

# 15. Blocked Reporting

A blocked occurrence may still be:

* completed;
* partial;
* skipped.

Blocked planning does not prove execution outcome.

---

# 16. Work Reporting

Work occurrence may be user-reported Complete/Partial/Skip if materializable.

Do not infer worked hours.

---

# 17. Manual Event Reporting

Same.

Calendar presence is not proof of attendance.

---

# 18. Outcome Actions

The primary actions are:

* Complete
* Partial
* Skip

Use exactly the V1 semantic vocabulary in user-friendly form.

---

# 19. Complete Meaning

Visible semantics:

> “I completed this.”

Do not imply objective verification.

---

# 20. Partial Meaning

Visible semantics:

> “I did some of this, but not enough to call it complete.”

No percentage required.

---

# 21. Skip Meaning

Visible semantics:

> “I chose not to do this planned occurrence.”

Do not use “missed.”

---

# 22. No Missed Action

Do not add:

* Missed;
* Failed;
* Didn’t do it automatically.

---

# 23. Reporting Form

After outcome selection, allow optional evidence:

* actual occurrence time;
* actual duration;
* note.

Do not require these for Complete/Partial.

Skip forbids actual execution evidence.

---

# 24. Optional Evidence UI

Keep lightweight.

Possible fields:

* “When did this happen?” optional datetime;
* “How long?” optional minutes;
* “Note” optional.

Do not introduce complex interval editor.

---

# 25. Actual Time Default

Do not silently default actual occurrence time to:

* scheduled time;
* scheduled start;
* current time.

If product UX chooses to prefill current time, it must be clearly user-editable and treated as user input.

Preferred for V1:

> blank by default.

---

# 26. Duration Default

Blank by default.

Do not copy planned duration automatically.

---

# 27. Note

Optional.

Respect Task 3.2 bounds.

---

# 28. Skip Form

For Skip:

* no actual time field;
* no duration field;
* optional note only.

---

# 29. Input Validation

Use Task 3.2 domain constraints.

Do not duplicate looser UI-only semantics.

---

# 30. `recordedAt`

UI does not supply authoritative `recordedAt`.

ExecutionHistory owns clock allocation.

---

# 31. Provenance

UI does not supply provenance.

ExecutionHistory owns V1 `userReported`.

---

# 32. IDs

UI does not allocate:

* ExecutionRecordId;
* ExecutionSubjectId.

Store owns them.

---

# 33. Runtime IDs

UI may locate the selected occurrence with runtime IDs, but HistoricalExecutionTarget strips them before history mutation.

No runtime ID enters history.

---

# 34. Reporting Orchestration

On submit:

1. materialize target;
2. validate outcome/evidence input;
3. call `recordExecution`;
4. handle result;
5. derive/display current outcome;
6. surface durability state.

No Preview mutation.

---

# 35. Duplicate Planned Subject

If a planned execution subject already exists:

`recordExecution` will reject a second first report.

The UI must not create a duplicate.

Preferred behavior:

> detect existing subject and show current reported outcome rather than offering a second first-report form.

Use existing history lookup.

---

# 36. Existing Report Visibility

If a selected planned occurrence already has a current execution outcome:

show:

* Completed;
* Partial;
* Skipped;
* Unknown if retracted.

Do not offer a second first report.

---

# 37. Correction UI Deferred

Do not allow changing an existing report in Task 3.5.

If already reported, show status and a neutral message such as:

> “Editing this report will be available later.”

Avoid dead-end if a low-cost correction button is architecturally required.

Preferred:

> defer correction UI to Task 3.6.

---

# 38. Retraction UI Deferred

No “undo report” yet unless reversibility is deemed mandatory for first reporting.

Task 3.1 selected correction/retraction semantics explicitly.

Task 3.5 must assess whether shipping first-report UI without correction/retraction creates an unacceptable trap.

---

# 39. Reversibility Determination

Make an explicit determination:

## Option A — defer correction/retraction

Allowed if:

* reporting is clearly deliberate;
* the architecture immediately follows with history correction UI.

## Option B — include minimal Undo Report

Use `retractExecutionRecord`.

Preferred:

> include a minimal contextual “Undo report” if it can be added narrowly.

Reason:
Users make mistakes, and execution history is durable authority.

Do not build full correction editing.

---

# 40. If Undo Report Is Included

Undo:

* calls `retractExecutionRecord`;
* current outcome becomes unknown;
* no history deletion;
* durability feedback shown;
* user may report again afterward.

This is architecturally clean.

---

# 41. Re-Report After Retraction

If current outcome is unknown because the head is a retraction:

* allow a new report through the store’s restore-after-retraction path.

Do not allocate a new subject.

---

# 42. Report UI State Model

Use transient UI state only:

* selected outcome;
* optional evidence fields;
* submission state;
* feedback.

Do not persist draft reporting forms.

---

# 43. Draft Reset

Clear reporting draft when:

* report succeeds;
* selected occurrence changes;
* Preview/authority transition invalidates materialization;
* navigation leaves context.

---

# 44. Stale Preview While Form Open

If the underlying plan becomes stale before submission:

* re-materialize/revalidate target;
* reject submission if current materialization is unsafe.

Do not rely on the old transient target blindly.

---

# 45. Source Changed Before Submit

If source deleted/recreated/occurrence removed:

* materialization fails;
* no history write;
* show factual “This planned occurrence is no longer available to report from the current plan.”

Do not retarget.

---

# 46. PlanDecision Changed Before Submit

Same principle.

If the frozen target no longer reflects current authoritative plan evidence before first report:

* re-materialize;
* if changed materialization is still valid, consider whether user must review it.

Preferred:

> rebuild and require resubmission if materialized plan context changes materially.

Do not silently submit against a different plan snapshot.

---

# 47. Submission Snapshot Consistency

The user’s report should be attached to the plan context they saw when submitting.

Therefore:

* materialize immediately before mutation;
* compare against any form-initial target if one was retained;
* if materially changed, invalidate draft and ask user to review.

---

# 48. Materialization Equality

Use structural reference/snapshot equality.

No runtime ID comparison.

---

# 49. Persistence Success

Show concise status:

* “Recorded.”
* or “Recorded and saved.”

Avoid success/failure language about the activity itself.

---

# 50. Persistence Failure

If runtime report succeeds but persistence fails:

* current execution outcome remains session authority;
* show “Recorded for this session; saving failed.”
* expose Retry.

Do not ask user to report again.

---

# 51. Retry

Use `retryExecutionHistoryPersistence`.

No new report IDs or timestamps.

No new execution mutation.

---

# 52. Retry Success

Update durability feedback.

No Preview change.

---

# 53. Retry Failure

Retain current session outcome.

---

# 54. Protected History Ingress

If ExecutionHistory whole-source ingress is protected:

* reporting disabled;
* show factual recovery-required feedback;
* do not overwrite protected data.

---

# 55. Quarantine

Existing quarantined history components do not block unrelated valid reporting.

No quarantine UI expansion required.

---

# 56. Current Outcome Feedback

After recording:

* display current outcome from ExecutionHistory projection;
* do not infer from form state alone.

---

# 57. Outcome Labels

Use:

* Completed
* Partial
* Skipped
* Not reported / Unknown

Prefer “Not reported” in user-facing copy over raw “unknown.”

---

# 58. Retraction Label

After Undo Report:

> Not reported

not:

> Deleted

because history retains retraction evidence.

---

# 59. Planned Context Summary

Before reporting, show enough context to reduce mistakes:

* title;
* date/user-day;
* planned state;
* scheduled time if available.

Do not expose internal IDs.

---

# 60. Scheduled Context

Example:

> Workout — Aug 21, 6:00 PM

---

# 61. Unplaced Context

Example:

> Workout — Aug 21 — Not placed in the schedule

---

# 62. Omitted Context

Example:

> Workout — Aug 21 — Omitted from the plan

---

# 63. Blocked Context

Example:

> Workout — Aug 21 — Accepted placement was blocked

Do not show requested time as scheduled unless snapshot supports it.

---

# 64. Work/Manual Context

Use title/date/time.

---

# 65. User-Day Language

Use human-readable date/time consistent with existing Planner.

Do not expose UTC.

---

# 66. Actual-Time Input Parsing

Convert explicit local UI input to canonical UTC before calling history.

Respect the target date’s temporal context.

---

# 67. Timezone Boundary

Use existing temporal helpers.

Do not add IANA-zone infrastructure.

---

# 68. Actual Time Ambiguity

If local datetime conversion is ambiguous/invalid around DST and current helpers cannot resolve safely:

* reject with actionable validation;
* do not guess.

---

# 69. Duration Input

Accept integer minutes only.

Respect 1–1440.

---

# 70. Partial Without Evidence

Allowed.

---

# 71. Completed Without Evidence

Allowed.

---

# 72. Skip Without Evidence

Expected.

---

# 73. Future Actual Time

Domain rejects actual evidence after `recordedAt`.

UI should catch obvious future time where possible, but store/domain remains final authority.

---

# 74. Retroactive Reporting

Allowed when materialization succeeds.

No same-day requirement.

---

# 75. Early/Late Reporting

Allowed.

Do not add judgmental labels yet.

---

# 76. No Automatic Outcome On Time Passage

Direct audit and regression.

---

# 77. Preview Does Not Change

Recording execution must not:

* stale Preview;
* regenerate Preview;
* mutate PlanDecision;
* alter authored setup.

---

# 78. History Does Not Change Planning

No schedule effect.

---

# 79. Reporting Does Not Remove Omission

Reporting Complete for an omitted occurrence does not remove the PlanDecision omission.

Planning and history remain separate.

---

# 80. Reporting Blocked Occurrence

Does not change blocked PlanDecision.

---

# 81. Reporting Unplaced Occurrence

Does not force schedule placement.

---

# 82. Reporting Work

Does not modify shift source.

---

# 83. Reporting Manual Event

Does not modify calendar event.

---

# 84. Existing Execution Subject Lookup

Use `findExecutionSubjectByPlannedReference` or equivalent.

Do not scan by title/date heuristics.

---

# 85. Current Outcome Lookup

Use store projection helper.

---

# 86. Report Form Availability Matrix

| Planned target | Materializes? | Existing report? | UI                                 |
| -------------- | ------------: | ---------------: | ---------------------------------- |
| yes            |            no |                — | unavailable reason                 |
| yes            |           yes |               no | report form                        |
| yes            |           yes |              yes | current outcome + undo if included |

---

# 87. Reporting Outcomes Matrix

| Outcome  | Actual time | Duration |     Note |
| -------- | ----------: | -------: | -------: |
| Complete |    optional | optional | optional |
| Partial  |    optional | optional | optional |
| Skip     |          no |       no | optional |

---

# 88. Reporting State Does Not Persist

Refresh/restart clears in-progress form.

That is acceptable.

---

# 89. Restart After Saved Report

Current outcome remains.

---

# 90. Restart After Unsaved Runtime Report

If persistence failed and retry not completed:

* report may be lost on restart;
* UI must have shown truthful warning.

No extra recovery magic.

---

# 91. Existing Report After Restart

UI reflects history projection.

---

# 92. Undo After Restart

If included, works against current head.

---

# 93. Duplicate Submission Guard

Disable submit while request is in-flight/synchronous action is processing.

Also rely on store duplicate/current-head checks.

---

# 94. Double Click

Must not create two subjects or duplicate assertions.

Direct test.

---

# 95. Accessibility

Use:

* native buttons;
* field labels;
* validation text;
* outcome state text;
* disabled states;
* retry button;
* accessible status region where appropriate.

---

# 96. Keyboard

All controls keyboard accessible.

---

# 97. Mobile Layout

Report controls must fit current mobile workflow panel.

Prefer stacked form.

No modal unless existing app pattern strongly favors it.

---

# 98. Confirmation

Complete/Partial/Skip should not require modal confirmation if the user explicitly selects the outcome and submits.

If one-click buttons immediately record without a form, then Skip/Undo may need clearer confirmation.

Preferred:

> outcome selection + small form + Record button.

---

# 99. Button Copy

Preferred:

* “Record outcome”
* “Undo report” if included
* “Retry saving”

Avoid:

* “Save schedule”
* “Mark missed”

---

# 100. Reporting Panel Naming

Possible:

> “What happened?”

This directly reflects the Phase 3 epistemic model.

Alternative:

> “Report outcome”

Use current tone.

---

# 101. No Gamification

No:

* streaks;
* score;
* praise;
* failure warnings.

---

# 102. No Progress Copy

Do not show percentages.

---

# 103. No Adherence Copy

None.

---

# 104. Existing Accepted Choice Visibility

Reporting UI may coexist with Accepted Choices.

Do not conflate:

* accepted planning choice;
* reported outcome.

---

# 105. Example Distinction

UI should make it possible to see:

```text
Accepted choice:
Omit Workout

Reported outcome:
Completed
```

without contradiction.

That is truthful.

---

# 106. Historical Snapshot Is Invisible Internally

User need not see raw snapshot fields.

Show human-readable planned context.

---

# 107. No History Browser

Current outcome for the selected occurrence is enough.

Do not list revisions.

---

# 108. No Correction Editor

No editing old note/time/outcome yet unless minimal Undo is included.

---

# 109. Undo Versus Correction

Undo uses retraction.

Changing Complete → Partial requires future correction UI.

Do not fake correction by retraction + new subject.

---

# 110. Re-Report After Undo

Same subject, new revision.

Store/domain must preserve chain.

---

# 111. Reporting From Omitted Accepted Choice

Ensure target can be surfaced from Accepted Choices or day context if the occurrence block is absent.

Task 3.5 may need a narrow UI affordance from the Accepted Choices panel.

---

# 112. Omitted Reporting Entry Point

Preferred:

* if omitted decision appears in Accepted Choices, offer “Report outcome” there.

Do not invent a ghost schedule block.

---

# 113. Blocked Reporting Entry Point

Could be from:

* unplaced occurrence;
* accepted-choice panel.

Choose one or both narrowly.

---

# 114. Unplaced Reporting Entry Point

Use existing unplaced context if visible.

---

# 115. Work/Manual Entry Point

Use day-detail occurrence.

---

# 116. Grouped Friction

Do not report execution from friction groups.

Use occurrence context.

---

# 117. SuggestedFix

No execution-report action from SuggestedFix.

---

# 118. Try State

If visible Preview is Try-revised:

reporting from affected occurrence is unavailable until regeneration/Accept according to Task 3.4.

---

# 119. Stale Preview

Reporting from stale scheduled geometry unavailable.

If an omitted/blocked target can still materialize safely without stale geometry, Task 3.4 result governs.

Do not override materializer.

---

# 120. No Preview

No generic planned reporting UI unless Task 3.4 can materialize target from another authoritative source.

V1 UI may be Preview-centric.

---

# 121. Reporting UI Scope

Prefer current-day/current-preview reporting first.

Do not build arbitrary history-date picker.

---

# 122. Retroactive Current Preview

If Preview includes yesterday/past user-day and materializer succeeds, reporting allowed.

---

# 123. Historical First-Report Limitation

If old plan context is no longer materializable:

show unavailable state rather than fabricate.

---

# 124. Error Categories

Map core/store failures to user-facing categories:

* planning context changed;
* source no longer available;
* report already exists;
* execution history protected;
* invalid evidence;
* save failed;
* unable to record.

Do not expose raw error codes directly.

---

# 125. `sourceMissing`

Copy:

> “This planned occurrence is no longer available to report from the current plan.”

---

# 126. `lifetimeMismatch`

Copy should avoid incarnation jargon.

> “This occurrence belongs to an earlier version of the plan.”

---

# 127. `occurrenceMissing`

> “This occurrence is no longer generated by the current plan.”

---

# 128. `insufficientHistoricalContext`

> “DayFrame no longer has enough planning context to record this as a planned occurrence.”

---

# 129. `stalePreview`

> “Regenerate the preview before reporting this outcome.”

---

# 130. `tryOnlyPreview`

> “Accept or discard the temporary Try result before reporting this outcome.”

---

# 131. Protected History

> “Execution history needs recovery before new outcomes can be recorded.”

---

# 132. Duplicate Planned Subject

Show existing outcome rather than generic error.

---

# 133. Existing Retraction

Outcome is Not reported and re-report form may be available.

---

# 134. Persistence Failure Copy

> “Recorded for this session, but saving failed.”

Retry button.

---

# 135. Success Copy

> “Outcome recorded.”

Optional:

> “Outcome recorded and saved.”

---

# 136. UI Feedback Separation

Keep separate:

* execution outcome;
* durability status.

Do not say “Completed and saved” in a way that confuses activity completion with persistence.

---

# 137. Reporting Workflow Helper

A narrow application helper is encouraged.

Conceptual:

```text
selected occurrence
    ↓
materialize
    ↓
build report input
    ↓
recordExecution
```

Do not bury all orchestration in React.

---

# 138. Report Input Builder

Pure helper may convert:

* HistoricalExecutionTarget;
* selected outcome;
* optional evidence;

into ExecutionHistory semantic input.

No IDs/timestamps.

---

# 139. Input Builder Validation

Use Task 3.2 constraints.

---

# 140. No History Mutation During Materialization

Still true.

---

# 141. No Materialization During Existing Report Display

If subject exists, use current history snapshot rather than rematerializing for display if appropriate.

Historical record already froze context.

---

# 142. Existing Report Display Source

Use ExecutionRecord current projection and frozen snapshot.

Do not re-render current title/category from authored state as historical truth.

---

# 143. Current Source Enrichment

Optional current-source enrichment is not required.

Prefer frozen history context.

---

# 144. Existing Report Planned Context

Show snapshot:

* title;
* user-day date;
* state;
* scheduled interval if present.

---

# 145. Existing Report Note

Do not expose/edit unless needed.

Could show note read-only if simple.

Optional.

---

# 146. Current Outcome Actual Evidence

Can show read-only:

* reported time;
* duration.

Optional.

Do not overbuild.

---

# 147. Minimum Existing Report UI

At minimum:

* outcome label;
* planned-context summary;
* durability warning if relevant;
* Undo Report if included.

---

# 148. Decision On Undo Requirement

Task result must explicitly conclude:

* Included;
  or
* Deferred safely.

Do not leave unresolved.

---

# 149. Recommended Choice

Preferred:

> Include minimal Undo Report through retraction.

It gives immediate reversibility while remaining within existing semantics.

---

# 150. Undo Confirmation

A lightweight confirmation is optional.

Because undo changes durable history but is itself reversible through re-report, modal is likely unnecessary.

Button label should be clear.

---

# 151. Undo Persistence Failure

Runtime retraction remains session authority.

Outcome displays Not reported.

Retry available.

Restart may restore old durable outcome if retry never succeeds.

Feedback must be truthful.

---

# 152. Re-Report After Undo Persistence Failure

Current runtime head is retraction.

A new report may technically be allowed, but this complicates desired durable chain while prior write failed.

Store desired condition can still serialize exact latest chain.

Audit.

Preferred:

* allow if store supports it safely;
* otherwise require Retry first.

Document.

---

# 153. Protected Ingress Undo

Blocked.

---

# 154. Quarantine

Unrelated quarantine does not block report/undo.

---

# 155. Full Clear

Reporting state disappears with all other local data.

No UI-specific work beyond existing clear.

---

# 156. Profile Activation

History remains.

Selected occurrence context may change, so transient reporting draft clears.

Existing history remains visible only where selected historical subject can be found.

---

# 157. Backup V1/V2

Same transient UI invalidation.

No history mutation.

---

# 158. PlanDecision Accept/Remove

May change materialization context.

Clear open reporting draft if target context changes/stales.

---

# 159. Preview Regeneration

Clear or revalidate draft.

Preferred:

* invalidate draft if snapshot changed;
* preserve if structurally equal and occurrence remains selected.

Simplest safe policy:

> clear draft on regeneration.

---

# 160. Reported History Survives Regeneration

Current outcome remains.

---

# 161. Reporting Does Not Cause Preview Regeneration

No.

---

# 162. Store Subscription

UI must subscribe to ExecutionHistory and its durability status.

---

# 163. Outcome Update

After report/undo, UI updates from store authority immediately.

---

# 164. Durability Retry Status

Use dedicated history durability subscriber.

---

# 165. Existing Report Discovery

Use planned reference equality.

No title/date heuristics.

---

# 166. HistoricalExecutionTarget Equality

If retaining target in UI draft, clone it.

---

# 167. Accessibility Test

Required.

---

# 168. Responsive Test

Required where existing test infrastructure supports layout semantics.

---

# 169. Complete Test

Scheduled target:

* materializes;
* user reports Complete;
* history record created;
* outcome Completed;
* Preview unchanged.

---

# 170. Partial Test

Same.

---

# 171. Skip Test

Same.

No actual-time/duration.

---

# 172. Skip Evidence Rejection Test

UI/domain rejects supplied duration/time.

---

# 173. Unplanned Skip

No unplanned UI in this task.

---

# 174. Unplaced Complete Test

Allowed.

---

# 175. Omitted Complete Test

Allowed.

---

# 176. Omitted Skip Determination Test

According to chosen policy.

---

# 177. Blocked Complete Test

Allowed.

---

# 178. Work Complete Test

Allowed.

---

# 179. Manual Complete Test

Allowed.

---

# 180. Stale Preview Test

Reporting unavailable/rejected.

---

# 181. Try-Only Test

Unavailable/rejected.

---

# 182. Accepted/Replayed Test

Available.

---

# 183. Source Deleted Before Submit Test

No write.

---

# 184. Lifetime Changed Before Submit Test

No retarget.

---

# 185. Occurrence Removed Before Submit Test

No write.

---

# 186. Duplicate Report Test

No second subject.

Existing outcome shown.

---

# 187. Persistence Failure Test

Runtime outcome updates.

Save failure shown.

---

# 188. Retry Test

No new IDs/timestamps.

---

# 189. Protected Ingress Test

Report blocked.

---

# 190. Quarantine Coexistence Test

Report works.

---

# 191. Restart Test

Saved outcome remains.

---

# 192. Undo Test

If included:

* retraction appended;
* outcome Not reported;
* old record retained.

---

# 193. Re-Report After Undo Test

Same subject restored.

---

# 194. Double-Submit Test

No duplicate subject/record.

---

# 195. Actual Time Test

Explicit time stored canonically.

---

# 196. Duration Test

Explicit duration stored.

---

# 197. Note Test

Bounded note stored.

---

# 198. No Scheduled-Time Inference Test

Complete with blank actual evidence:

* no actualTime stored.

Mandatory.

---

# 199. No Missed Regression

Passing scheduled end with no report:

* no history record;
* UI remains Not reported;
* no missed state.

Mandatory.

---

# 200. Planning Isolation Test

Reporting:

* does not modify PlanDecision;
* does not stale Preview;
* does not edit source.

---

# 201. Omission Isolation Test

Report Complete on omitted occurrence:

* omission PlanDecision still exists;
* history says Completed.

Mandatory.

---

# 202. Blocked Isolation Test

Same.

---

# 203. Persistence Shape Test

No UI/transient state persisted.

---

# 204. No Progress Test

None.

---

# 205. No Learning Test

None.

---

# 206. No Backup Change Test

None.

---

# 207. Expected Production Files

Likely:

* reporting workflow/helper module;
* `PreviewScreen.tsx`;
* `DayFrameApp.tsx` or appropriate container;
* execution-history subscription wiring;
* UI/application tests.

Avoid execution-domain/persistence changes unless a genuine bug is discovered.

---

# 208. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.5_IMPLEMENT_MINIMAL_COMPLETE_PARTIAL_SKIP_EXECUTION_REPORTING_WORKFLOW_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contracts
4. Initial UI Audit
5. Files Changed
6. UI Location
7. Reportability Gate
8. Supported Targets
9. Unsupported Targets
10. Complete Semantics
11. Partial Semantics
12. Skip Semantics
13. Omitted Skip Determination
14. Form Model
15. Actual-Time Input
16. Duration Input
17. Note Input
18. recordedAt/Provenance/ID Ownership
19. Reporting Orchestration
20. Existing Subject Discovery
21. Existing Outcome Display
22. Correction UI Boundary
23. Retraction/Undo Determination
24. Undo Workflow
25. Re-Report After Undo
26. Draft Lifetime
27. Preview/Authored Invalidation
28. Submission Snapshot Consistency
29. Persistence Success
30. Persistence Failure
31. Retry
32. Protected Ingress
33. Quarantine Coexistence
34. Outcome Feedback
35. Planned Context Display
36. Scheduled Context
37. Unplaced Context
38. Omitted Context
39. Blocked Context
40. Work/Manual Context
41. Timezone Conversion
42. Retroactive/Early/Late Reporting
43. Planning Isolation
44. PlanDecision Isolation
45. Preview Isolation
46. Omission/Execution Independence
47. Subscription Model
48. Accessibility
49. Responsive Layout
50. Tests Added
51. Complete/Partial/Skip Tests
52. Unplaced/Omitted/Blocked Tests
53. Work/Manual Tests
54. Stale/Try Tests
55. Lifecycle Change Tests
56. Duplicate Report Tests
57. Persistence Failure/Retry Tests
58. Protected/Quarantine Tests
59. Restart Tests
60. Undo/Re-Report Tests
61. Actual-Time/Duration/Note Tests
62. No-Inference Tests
63. Planning-Isolation Tests
64. UI Audit
65. Persistence Audit
66. No-Progress Audit
67. No-Learning Audit
68. Architectural Alignment Assessment
69. Deviations
70. Discoveries and Deferred Work
71. Recommended Next Task
72. Focused Validation
73. Full Validation
74. Final Completion Determination

---

# 209. Required Matrices

## A. Outcome UI Matrix

| Outcome | Actual time | Duration | Note | Reportable for planned subject |
| ------- | ----------: | -------: | ---: | -----------------------------: |

## B. Planned-State Matrix

| Plan state | Complete | Partial | Skip |
| ---------- | -------: | ------: | ---: |

## C. Preview-State Matrix

| Preview state | Reporting available? | Reason |
| ------------- | -------------------: | ------ |

## D. Persistence Matrix

| Runtime mutation | Durable write | UI outcome | Retry |
| ---------------- | ------------- | ---------- | ----- |

## E. Planning-Isolation Matrix

| Reporting action | Authored state changes? | PlanDecision changes? | Preview changes? |
| ---------------- | ----------------------: | --------------------: | ---------------: |

---

# 210. Validation Requirements

Run focused tests for:

* reportability;
* Complete;
* Partial;
* Skip;
* unplaced;
* omitted;
* blocked;
* work;
* manual event;
* stale Preview;
* Try-only Preview;
* duplicate report;
* persistence failure;
* retry;
* protected ingress;
* quarantine;
* restart;
* Undo/re-report if included;
* no missed inference;
* planning isolation.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Full suite must pass.

Record exact test counts.

---

# 211. Completion Criteria

Task 3.5 is complete only when:

* users can explicitly report Complete, Partial, or Skip for safely materializable planned occurrences;
* reporting uses HistoricalExecutionTarget rather than runtime IDs;
* only explicit user input creates execution history;
* no missed/completed/skipped inference exists;
* scheduled, unplaced, omitted, blocked, work, and manual targets follow explicit reportability rules;
* stale and Try-only Preview geometry cannot become execution history context;
* Complete/Partial allow optional actual time/duration/note;
* Skip forbids actual execution evidence;
* UI does not allocate IDs/timestamps/provenance;
* ExecutionHistory owns durable mutation;
* duplicate planned subjects are not created;
* existing reported outcome is visible;
* reporting draft is transient;
* changed plan context invalidates or revalidates the draft safely;
* persistence failure preserves runtime outcome and exposes Retry;
* Retry does not create new evidence;
* protected ingress blocks reporting;
* quarantine does not block unrelated reporting;
* reporting does not stale/regenerate Preview;
* reporting does not mutate authored state;
* reporting does not mutate PlanDecision;
* reporting Complete for omitted/blocked/unplaced occurrence remains valid and does not change the plan;
* no actual time is inferred from scheduled time;
* no progress/adherence/learning is introduced;
* no Backup change is introduced;
* accessibility and responsive behavior are preserved;
* full validation passes;
* result artifact is complete.

If minimal Undo Report is included:

* retraction is used rather than physical deletion;
* outcome returns to Not reported;
* re-report preserves the same subject chain.

---

# 212. Explicit Non-Goals

Do **not**:

* build history browser;
* build full correction editor;
* add arbitrary unplanned execution UI;
* add missed;
* add failure/success scoring;
* add progress;
* add adherence;
* add streaks;
* add learning;
* alter scheduling based on history;
* add timers;
* add integrations;
* add cancellation;
* add quantity metrics;
* implement Backup V3;
* persist reporting drafts;
* use runtime IDs as history identity;
* infer actual times;
* change ExecutionRecord V1 schema;
* change ExecutionHistory V1 persistence;
* change DurableOccurrenceReference V1;
* change PlanDecision semantics;
* redesign Planner/Summary broadly.

---

# 213. Stop Conditions

Stop and report if:

* current UI cannot expose reportable occurrence context without broad Preview redesign;
* Task 3.4 materialization cannot be called safely from current workflow;
* duplicate planned-subject discovery cannot be performed without persistence changes;
* report form cannot distinguish Try-only/stale/current plan context;
* local datetime conversion cannot be made safe with existing temporal helpers;
* shipping first-report UI without correction/retraction would create unacceptable irreversible behavior and Undo cannot be added narrowly;
* reporting requires changing ExecutionRecord/ExecutionHistory schemas;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest prerequisite/completion task.

---

# 214. Recommended Follow-On Boundary

If Task 3.5 completes successfully, the next task should make durable execution evidence reviewable and correctable.

Recommended:

> **Task 3.6 — Implement Minimal Execution History Visibility and Correction Workflow**

That task should:

* list recent execution subjects/revisions or current outcomes;
* expose immutable historical planned context;
* support correction to Complete/Partial/Skip;
* support retraction;
* keep prior revisions;
* distinguish planned versus actual;
* remain separate from Progress.

Only after history is visible/correctable should Phase 3 begin deriving progress/adherence.

---

# 215. Task Determination

**Authorized:** minimal explicit Complete/Partial/Skip reporting for safely materializable planned occurrences, bounded optional actual-time/duration/note evidence, ExecutionHistory mutation orchestration, existing-outcome display, durability/retry feedback, and narrowly scoped Undo/retraction if selected for reversibility.

**Not authorized:** broad history management, arbitrary unplanned reporting, progress, adherence, learning, schedule adaptation, missed inference, timers, integrations, Backup V3, new execution outcomes, or changes to accepted Phase 2/Task 3.2–3.4 durable contracts.

The governing reporting principle is:

> **DayFrame records execution only when the user explicitly reports it. The schedule can provide context for the report, but it can never provide the report itself.**

---

# 216. Final Completion Statement

**Task 3.5 is complete when DayFrame provides a minimal accessible user workflow for explicitly reporting Complete, Partial, or Skip against every safely materializable planned occurrence authorized by HistoricalExecutionTarget; when the workflow shows defensible planned context, gathers only optional user-supplied actual-time/duration/note evidence permitted by ExecutionRecord V1, delegates IDs/timestamps/provenance and immutable authority to ExecutionHistory V1, prevents duplicate planned subjects, reflects current derived outcome and factual durability, supports exact retry after persistence failure, blocks reporting under protected history ingress, preserves unrelated quarantine, and remains safe across stale Preview, Try-only Preview, source/lifetime/occurrence changes, restart, unplaced/omitted/blocked planning states, work, and manual events; when no scheduled time or lack of report is converted into actual execution or missed status; when reporting leaves authored setup, PlanDecision authority, Preview scheduling, and recommendations untouched; when any included Undo uses immutable retraction rather than deletion; when full repository validation passes; and when no history browser, progress, adherence, learning, timer/integration, Backup V3, cancellation, quantity model, or unrelated planning behavior is introduced.**
