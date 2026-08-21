# Task 2.38 — Implement Minimal Persistent Accepted-Decision Visibility and Removal

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded visibility, reversibility, and minimal-management UX implementation task.

Task 2.38 implements the minimum persistent user-facing visibility and removal capability required by the accepted-planning-authority audit in Task 2.37.

The task must make durable accepted planning choices discoverable beyond the immediate Try → Accept workflow and allow the user to explicitly withdraw one accepted decision through the existing `removePlanDecision` store authority.

This task includes:

* persistent contextual visibility of current PlanDecision authority;
* derived current status display;
* visibility for applied, omitted, blocked, stale, and outside-window decisions;
* one-decision removal;
* automatic Preview regeneration where appropriate;
* truthful persistence/removal feedback;
* accessibility;
* exact cross-surface behavior;
* direct regression coverage.

It does **not** implement:

* direct decision editing;
* decision history;
* bulk removal;
* recurring/pattern decisions;
* decision-aware SuggestedFix generation;
* recommendation ranking changes;
* Backup V3;
* new PlanDecision kinds;
* conflict decisions;
* execution/history;
* a broad decision-management page.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify that the saved project copy exists;
2. verify that the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 2.37 is complete and its accepted-planning-authority checkpoint is published;
6. review Tasks 2.34–2.37 and current UI/store/replay APIs;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.38_IMPLEMENT_MINIMAL_PERSISTENT_ACCEPTED_DECISION_VISIBILITY_AND_REMOVAL_RESULT.md`

If persistent decision visibility cannot be added without creating a broad management surface or changing the PlanDecision durable contract, stop and report rather than broadening scope.

---

# 2. Purpose

Task 2.36 completed the immediate acceptance workflow:

```text
Try
    ↓
Accept
    ↓
PlanDecision
    ↓
Regenerate
    ↓
Replay feedback
```

But Task 2.37 found a persistent discoverability/reversibility gap:

> Once the immediate acceptance workflow is no longer in view, users cannot reliably tell which accepted decisions are still shaping their schedule, which are blocked, which are stale, or how to withdraw them.

This is particularly serious for:

* omitted occurrences, which no longer appear as ordinary scheduled blocks;
* stale decisions, which remain durable but may have no visible current target;
* blocked decisions, which represent active user authority that could not be realized;
* duration/priority decisions, whose effect may not be obvious from the schedule alone.

Task 2.38 closes exactly that gap.

---

# 3. Governing Architectural Decisions

The following are fixed:

1. PlanDecision V1 is durable accepted planning authority;
2. PlanDecision remains outside authored setup;
3. PlanDecision remains outside `DayFrameState`;
4. replay status is derived, not persisted;
5. stale valid decisions remain durable;
6. one current decision exists per semantic target;
7. removal is explicit user authority;
8. `removePlanDecision` already exists as the store-owned removal boundary;
9. removal stales current Preview;
10. regeneration derives the schedule without the removed decision;
11. PlanDecision history does not exist;
12. no decision editing contract exists;
13. no bulk-management contract exists;
14. current recommendation behavior remains decision-unaware until Task 2.39;
15. Backup V2 still excludes PlanDecision authority.

Do not reopen these decisions.

---

# 4. Architectural Objective

After Task 2.38, the user should be able to answer:

```text
What accepted planning choices are currently stored?

Which of those choices are:
    applied
    blocked
    stale
    outside this Preview
    currently inapplicable?

What did each accepted choice mean?

Can I stop DayFrame from remembering one of them?
```

without needing to reproduce the original friction or SuggestedFix workflow.

---

# 5. Minimal Surface Principle

The task must implement the **smallest persistent management surface that closes the visibility/removal gap**.

Preferred model:

```text
Preview
    ├─ contextual accepted marker where occurrence is visible
    └─ compact Accepted Choices section/panel
            ├─ current semantic choice
            ├─ derived status
            └─ Remove
```

Do not build a general-purpose decision manager.

---

# 6. Required Initial Audit

Before coding, inspect:

* current `PreviewScreen`;
* current workflow panel;
* current Preview header/status areas;
* current `planDecisionResults`;
* current `getPlanDecisions()`;
* decision subscription;
* `removePlanDecision`;
* decision durability status;
* decision persistence retry;
* current unplaced-candidate UI;
* grouped friction UI;
* existing day/details structures;
* current responsive layout.

Determine the narrowest placement for persistent accepted-choice visibility.

---

# 7. Accepted Choices Collection

Create a derived presentation model combining:

```text
PlanDecision authority
+
current Preview planDecisionResults
=
Accepted Choice View Model
```

Do not persist the view model.

---

# 8. Current Decision Source

The authoritative record comes from:

`getPlanDecisions()`

or its subscribed equivalent.

Do not infer accepted decisions from:

* scheduled blocks;
* friction;
* replay results alone;
* UI markers;
* previous Try state.

---

# 9. Current Status Source

Current status should derive primarily from:

`Preview.planDecisionResults`

when a fresh Preview exists.

Do not persist status into PlanDecision.

---

# 10. No Preview Status

If PlanDecision authority exists but Preview is absent:

* accepted decisions must still be visible;
* status should indicate that current schedule status has not yet been evaluated.

Possible semantic status:

* `notEvaluated`;
* “Generate a preview to evaluate this choice.”

Do not classify as stale merely because no Preview exists.

---

# 11. Stale Preview Status

If current Preview is stale:

* do not present replay results as current truth;
* accepted decisions remain visible;
* status must indicate regeneration is required for current schedule evaluation.

Do not falsely display previous `applied`/`blocked` as current.

---

# 12. Fresh Preview Status

When Preview is fresh, display the matching replay result for each current decision.

Correlate by:

`PlanDecisionId`

not target inference alone.

---

# 13. Missing Replay Result

If a current decision has no result in a fresh Preview:

* show factual unknown/error state;
* do not report it as applied.

This should be rare and should remain diagnosable.

---

# 14. Decision Presentation Model

Define a pure mapper/view-model function if practical.

Conceptual shape:

```ts
type AcceptedDecisionViewModel = {
  decisionId: PlanDecisionId;
  kind: PlanDecisionKind;
  summary: string;
  targetSummary: string;
  status: ...;
  canRemove: boolean;
};
```

Exact implementation may differ.

No durable mutation.

---

# 15. Semantic Summary

Each decision should be described by its accepted semantic intent.

Examples:

* “Place Workout at 9:00 AM”
* “Omit Errands”
* “Use 30 minutes for Workout”
* “Use priority 5 for Workout”

Do not expose internal discriminators unless necessary.

---

# 16. Target Label

Use current human-readable occurrence/source title where available.

Do not expose:

* source ID;
* incarnation;
* DurableOccurrenceReference JSON;
* decision ID.

If the source is stale/missing and no current source title can be resolved, derive the best safe label from durable reference/readable source identity without fabricating a current source.

---

# 17. Stale Target Labeling

For stale decisions, language should not imply the old target is still current.

Example concept:

> “Accepted choice for Workout — source no longer matches current setup.”

Do not silently resolve it to a recreated same-name source.

---

# 18. Decision Kinds

Support all four V1 kinds:

* `placeOccurrence`;
* `omitOccurrence`;
* `setOccurrenceDuration`;
* `setOccurrencePriority`.

No additional kinds.

---

# 19. Applied Placement Visibility

For fresh Preview + applied placement:

* contextual schedule marker may indicate accepted placement;
* accepted-choice panel lists it.

Do not duplicate excessive information.

---

# 20. Applied Duration Visibility

Show accepted duration in compact form.

If schedule block already reflects duration, accepted marker explains why it differs from authored default.

---

# 21. Applied Priority Visibility

Priority may not be directly visible in schedule geometry.

The accepted-choice panel must therefore show it clearly.

---

# 22. Omission Visibility

This is a mandatory case.

Because the occurrence is absent from scheduled/unplaced output, the accepted-choice panel must retain visible evidence:

> “Omit [occurrence]”

with current replay status.

Do not rely on schedule blocks.

---

# 23. Blocked Visibility

Blocked accepted decisions must be clearly visible.

Show:

* accepted semantic intent;
* “Blocked” or equivalent current status;
* no implication that persistence failed;
* Remove action.

---

# 24. StaleSourceMissing Visibility

Display as stale/inactive accepted choice.

Explain factually:

> The original source is no longer present.

Do not retarget.

---

# 25. StaleLifetime Visibility

Display as stale/inactive.

Example concept:

> The source was replaced or recreated.

Do not claim exact historical operation unless the resolver only proves lifetime mismatch.

Prefer:

> “This choice no longer matches the current source lifetime.”

---

# 26. StaleOccurrenceMissing Visibility

Display:

> “This occurrence is not currently generated.”

Do not classify the source itself as deleted.

---

# 27. Outside-Window Visibility

Decision remains valid authority.

Show:

> “Outside this preview”

or equivalent.

Do not call stale.

---

# 28. Inapplicable Visibility

If replay returns `inapplicable`:

* decision remains durable;
* indicate it cannot currently apply.

Do not automatically remove it.

---

# 29. Invalid/Unsupported

Invalid/unsupported entries should normally be quarantined and absent from current decision authority.

If defensive replay result appears for a current record:

* display a generic unsupported/error state;
* do not offer misleading semantic claims.

No recovery UI expansion in this task.

---

# 30. Status Vocabulary

Use a compact user-facing vocabulary.

Recommended:

* Applied
* Blocked
* Outside this preview
* Stale
* Not currently applicable
* Regenerate to evaluate
* Unable to evaluate

Do not mirror internal status names mechanically.

---

# 31. Accepted Choices Section

Implement a compact persistent section in an existing primary workflow surface.

Preferred:

* Preview/Planner area;
* not Setup;
* not a new route.

The section should appear whenever at least one current PlanDecision exists.

---

# 32. Empty State

If no PlanDecisions:

* omit the section;
* do not add unnecessary empty management UI.

---

# 33. Section Naming

Preferred conceptual labels:

* “Accepted choices”
* “Accepted planning choices”

Use current language style.

Avoid:

* “Overrides”
* “Rules”
* “History”

because those misstate semantics.

---

# 34. Ordering

Accepted choices must display deterministically.

Prefer current canonical decision ordering:

* semantic target key;
* decision ID;

or another stable presentation order.

Do not use replay result array order accidentally.

---

# 35. Status Grouping

Do not overbuild grouping unless it improves clarity.

A flat compact list with status is sufficient.

Optional ordering refinement:

1. blocked;
2. applied/current;
3. stale;
4. outside-window.

Only adopt if deterministic and justified.

---

# 36. Contextual Markers

Where a visible scheduled/unplaced occurrence has an active applied/blocked decision, consider a minimal marker such as:

* “Accepted”
* accepted-choice icon + accessible text.

This is useful but secondary to the persistent list.

---

# 37. Marker Source

Do not infer marker from schedule differences.

Use current PlanDecision result correlation.

---

# 38. Omission Has No Block Marker

The persistent list is the required visibility mechanism.

Do not create fake placeholder schedule blocks unless current UI already has a suitable omitted representation.

---

# 39. Remove Action

Each current valid decision must expose a single:

> Remove

or:

> Remove accepted choice

action.

Use existing `removePlanDecision(decisionId)`.

---

# 40. Removal Meaning

Removal means:

> Stop applying/storing this accepted planning choice and return this occurrence to authored/default planning behavior.

It is not:

* undo history;
* delete source;
* remove occurrence;
* reject friction;
* revert authored edits.

---

# 41. Removal Confirmation

Preferred:

> no confirmation.

Reason:

* one decision only;
* effect is reversible through a future new acceptance;
* regeneration immediately exposes resulting schedule;
* no history claim is made.

If existing product patterns require confirmation for durable deletion, use a lightweight confirmation.

Do not introduce modal complexity without need.

---

# 42. Remove Availability

Remove should be available for:

* applied;
* blocked;
* stale;
* outside-window;
* inapplicable;

because all are durable current PlanDecision records.

---

# 43. Remove During Protected Decision Ingress

If whole decision ingress is protected, ordinary removal is already blocked by the store.

UI should:

* disable Remove;
* show recovery-required feedback.

Do not attempt destructive recovery.

---

# 44. Remove With Quarantine

Valid current decision removal remains allowed.

Quarantine is preserved by the durable surface.

No special UI required.

---

# 45. Remove Workflow

On Remove:

1. call `removePlanDecision(decisionId)`;
2. handle notFound/protected/rejection;
3. if runtime authority changed:

   * current Preview becomes stale through store semantics;
   * automatically regenerate if appropriate;
4. display durability outcome;
5. update accepted-choice list.

---

# 46. Automatic Regeneration After Remove

Preferred:

> yes, when a Preview currently exists and runtime decision removal succeeds.

Reason:

* removal intentionally changes schedule derivation;
* the user expects to see the schedule return to authored/default behavior.

This mirrors Accept orchestration.

---

# 47. No Preview Removal

If no Preview exists:

* remove decision;
* do not generate one automatically merely because Remove was clicked.

Keep existing user workflow.

---

# 48. Stale Preview Removal

If Preview is already stale, determine whether removal should automatically regenerate.

Preferred:

* do not implicitly resolve unrelated authored staleness;
* remove decision;
* retain stale Preview;
* user uses normal regeneration.

Document exact policy.

---

# 49. Fresh Preview Removal

If Preview fresh:

* remove;
* automatically regenerate.

---

# 50. Persistence Failure On Remove

If runtime removal succeeds but PlanDecision write fails:

* decision is removed for current session;
* regeneration reflects removal;
* durability feedback reports saving failure;
* Retry available.

Do not restore the decision merely because persistence failed.

---

# 51. Restart Risk After Failed Removal

If persistence failed and user restarts before retry:

* old durable decision may return.

Feedback must make the save failure clear.

Do not claim permanent removal.

---

# 52. Removal Retry

Use existing `retryPlanDecisionPersistence`.

No new decision ID.

No schedule regeneration merely from successful Retry because runtime decision authority did not change.

---

# 53. Remove NotFound

If decision vanished before action:

* refresh presentation;
* show concise factual feedback;
* no regeneration if runtime collection unchanged.

---

# 54. Remove Correlation

Use decision ID.

Do not remove by target alone.

---

# 55. Supersession Visibility

Only current decision exists after same-target supersession.

The old decision must not appear.

No history.

---

# 56. Decision List Subscription

UI must subscribe to current PlanDecision authority.

Do not rely on Preview regeneration alone to update the list.

This matters when:

* decision exists but Preview absent;
* persistence retry occurs;
* cross-surface operation makes decision stale before regeneration.

---

# 57. Replay Result Subscription

Replay results arrive via current Preview.

Presentation model combines independent sources cleanly.

---

# 58. Source Mutation Before Regeneration

If authored state changes and Preview becomes stale:

* accepted list remains;
* prior replay statuses become “Regenerate to evaluate”;
* do not keep showing old applied/blocked as current.

---

# 59. Profile Activation

Decisions remain stored.

After profile load:

* Preview clears according to current behavior;
* accepted list remains;
* statuses become not evaluated until Preview generated;
* after generation they likely become staleLifetime.

This must be directly covered.

---

# 60. Backup V1 Import

Same pattern:

* decisions retained;
* Preview clears;
* list remains;
* fresh generation derives staleLifetime.

---

# 61. Backup V2 Restore

Decisions retained.

After restore + regeneration:

* previously stale decision may return to applied/blocked/etc.

Presentation must update from replay results.

---

# 62. Active Abandonment

Decisions retained under current policy.

Accepted list remains.

No active target currently resolves.

If no Preview exists, show not evaluated/current-authority-reset state rather than fabricating stale resolver status unless evaluator is run separately.

---

# 63. Full Clear

PlanDecisions removed.

Accepted-choice section disappears.

No stale UI remnants.

---

# 64. Decision Recovery Replacement

If decision recovery replacement changes runtime decision collection:

* list updates;
* Preview staleness follows Task 2.35;
* no special recovery UI.

---

# 65. Decision Recovery Abandonment

Collection becomes empty.

Section disappears.

---

# 66. Protected Decision Ingress

If protected whole-source ingress means current decision authority is unavailable/empty:

* do not expose raw protected records as accepted choices;
* existing recovery notice remains authoritative.

Do not parse raw protected data for presentation.

---

# 67. Quarantined Entries

Do not list quarantined entries as accepted choices.

They are preserved invalid data, not current planning authority.

---

# 68. Decision Durability Status

Accepted-choice management should expose decision surface durability only when relevant.

Do not display “saved” on every entry continuously unless useful.

Prefer contextual warning/retry when durability is failing.

---

# 69. Shared Durability Feedback

If existing Task 2.36 feedback infrastructure can be reused for Remove, do so.

Avoid parallel persistence-notification systems.

---

# 70. Applied Decision Marker And Durability

Do not make UI imply an accepted choice is durable if current decision surface has failed persistence.

Current session authority can still be active.

Use factual wording.

---

# 71. Persistent Visibility Versus Immediate Feedback

The new section is persistent visibility.

Task 2.36 immediate feedback remains transient workflow feedback.

Do not remove the immediate feedback merely because the list exists.

---

# 72. Contextual Decision Status

If the user clicks/selects an accepted choice, do not build a detail editor.

Simple semantic summary + status + Remove is sufficient.

---

# 73. No Edit

No:

* change time;
* change duration;
* change priority;
* switch kind;

inside accepted-choice panel.

A new SuggestedFix + Accept supersedes the record.

---

# 74. No Direct Creation

No “Add accepted choice.”

Decisions still originate from explicit Try → Accept workflow.

---

# 75. No Bulk Remove

No “Clear all accepted choices” in this task.

Full local clear exists at a broader destructive level.

Bulk decision removal requires separate authorization if desired.

---

# 76. No History

Do not display:

* acceptedAt chronology as a history list;
* superseded decisions;
* removed decisions.

`acceptedAt` may optionally support explanatory metadata, but history is out of scope.

---

# 77. acceptedAt Display

Determine whether showing acceptance timestamp adds meaningful value.

Preferred:

> do not show by default.

The task is about current authority, not historical audit.

---

# 78. Provenance Display

Do not display:

* “Suggested by DayFrame”
* raw SuggestedFix provenance

unless current UX strongly benefits.

Once accepted, authority is user-owned regardless of origin.

---

# 79. Source Title Resolution

Build a pure helper if necessary to resolve human-readable labels from:

* decision target;
* current authored state;
* Preview occurrence metadata.

Use current source title when exact lifetime matches.

For stale lifetime mismatch, do not use the recreated current source as though it were the target.

---

# 80. Stale Label Fallback

The durable reference contains readable IDs but may not contain original display title.

If original title is unavailable after source deletion:

* display safe fallback such as source type + readable ID;
* do not invent historical title.

Document limitation.

---

# 81. Manual/Work Decisions

Current valid PlanDecision collection may theoretically contain these from malformed/manual testing, but acceptance/replay capability is inapplicable.

If a structurally valid retained decision targets work/manual:

* show it if it is current decision authority;
* status likely inapplicable;
* Remove available.

Do not hide durable authority merely because no current UI can create it.

---

# 82. Unsupported Future Kind

Such entries should be quarantined, not current list items.

---

# 83. Current Kind Summary Mapper

Implement exact semantic copy mapping:

## placeOccurrence

“Place [target] at [time]”

Optionally include user-day date when necessary.

## omitOccurrence

“Omit [target]”

## setOccurrenceDuration

“Use [N] minutes for [target]”

## setOccurrencePriority

“Use priority [N] for [target]”

Use existing date/time formatting helpers.

---

# 84. Placement Date Visibility

If decision targets a future occurrence outside the currently visible day, include date in summary.

Do not make two distinct occurrence decisions look identical.

---

# 85. Weekly/N-Per-Week Target Distinction

A durable occurrence may be occurrence-specific even if title repeats.

Presentation should include enough occurrence date/week context to disambiguate.

Do not expose slot numbers unless no better representation exists.

---

# 86. Occurrence Context

Use canonical date/week coordinate for human-readable context.

Examples:

* “Workout — Aug 22”
* “Errands — week of Aug 24”

Choose based on reference family.

---

# 87. Work/Manual Context

Use current semantic occurrence date if resolvable.

Again, no editing.

---

# 88. Sorting By Occurrence Context

Optional.

Prefer simple deterministic order matching semantic target order.

No need for custom user sorting.

---

# 89. Accessibility

The accepted-choice section must:

* have a meaningful heading;
* expose each decision as readable text;
* expose status text;
* use native Remove buttons;
* not rely on icons/color alone;
* provide accessible persistence failure/retry feedback.

---

# 90. Keyboard

Native controls suffice.

No custom keyboard shortcuts.

---

# 91. Responsive Layout

The section must fit existing mobile Preview/Planner layout.

Prefer stacked compact entries.

No desktop-only table.

---

# 92. Status Semantics For Screen Readers

Status labels should be visible text.

If status changes after regeneration/removal, use existing live-status patterns only where appropriate.

Avoid excessive announcements.

---

# 93. Removal Button Label

Prefer contextual accessible name:

> “Remove accepted choice for Workout”

Visible text may remain “Remove.”

---

# 94. Decision Count

A simple heading count such as:

> “Accepted choices (3)”

may help.

Optional.

Do not treat count as core authority.

---

# 95. Omitted Count

No separate omitted counter required.

---

# 96. Blocked Warning

If one or more accepted decisions are blocked, consider a compact warning at section level.

Optional if individual statuses are sufficiently visible.

Do not over-alert.

---

# 97. Stale Warning

Likewise no global alarming warning required.

Stale retained decisions are expected domain state.

---

# 98. Remove And Decision-Aware Recommendations

Task 2.39 will use accepted-decision context.

Removing a decision should naturally mean future SuggestedFix policy no longer treats it as accepted authority.

No recommendation code change in 2.38.

---

# 99. Existing SuggestedFix Behavior

Unchanged.

A visible accepted choice does not yet change recommendation generation.

Task 2.37 policy remains awaiting 2.39.

---

# 100. Try → Accept Regression

Existing 2.36 workflow remains unchanged.

After Accept, new persistent section should reflect the accepted record.

---

# 101. Immediate Accept Feedback + Persistent List

Direct test:

* Accept;
* immediate workflow feedback appears;
* accepted-choice list also contains current decision after regeneration.

---

# 102. Try Without Accept

No accepted-choice entry appears.

---

# 103. Supersession Test

Accept first choice.

Accept second same-target choice.

List contains only second decision.

---

# 104. Different-Target Test

Two decisions appear.

---

# 105. Omit Visibility Test

Accept omission.

Regenerate.

Occurrence absent from schedule.

Accepted-choice entry remains visible and says omission applied.

Mandatory.

---

# 106. Blocked Visibility Test

Have a blocked exact placement decision.

List shows blocked.

Remove available.

---

# 107. Stale Lifetime Visibility Test

Create decision.

Profile activation/new lifetime.

Regenerate.

Entry remains and shows stale.

No retargeted current title if lifetime mismatches.

---

# 108. Stale Source Missing Test

Delete target source.

Regenerate.

Entry visible/stale.

---

# 109. Occurrence Missing Test

Update recurrence preserving lifetime but removing targeted occurrence.

Entry visible/stale.

---

# 110. Outside Window Test

Decision occurrence outside current Preview.

List shows outside-window status.

---

# 111. Preview Null Test

PlanDecision exists.

Preview cleared.

List remains with “Generate a preview to evaluate” status.

---

# 112. Preview Stale Test

Fresh applied decision.

Mutate authored setup.

Old Preview becomes stale.

List no longer claims currently applied.

Shows regeneration-needed state.

---

# 113. Fresh Regeneration Test

Regenerate.

List updates to current replay status.

---

# 114. Removal From Applied Test

Fresh Preview.

Remove applied decision.

Runtime decision removed.

Auto-regenerate.

Schedule reflects authored/default behavior.

List entry gone.

---

# 115. Removal From Omitted Test

Remove omit decision.

Auto-regenerate.

Previously omitted occurrence returns if authored scheduling would produce it.

---

# 116. Removal From Blocked Test

Remove.

Regenerate.

Hard decision no longer blocks/default placement resumes.

---

# 117. Removal From Stale Test

Remove stale decision.

No target scheduling mutation required.

List entry disappears.

If Preview fresh and stale decision had no effect, decide whether regeneration is necessary.

Preferred:

> if fresh Preview exists, removal may avoid regeneration when replay result proves stale/no-effect.

But simplicity may favor always regenerate for fresh Preview.

Choose and document.

---

# 118. Removal Outside Window

Same decision.

Because current Preview unaffected, regeneration may be unnecessary.

Prefer semantic optimization only if implementation remains simple.

Do not overcomplicate.

---

# 119. Removal Regeneration Policy

Task result must explicitly state one of:

## Simple policy

Every successful decision removal with an existing fresh Preview regenerates.

or:

## Effect-aware policy

Only removal of current-window/effectful decisions regenerates.

Preferred for bounded scope:

> simple policy.

Correctness over optimization.

---

# 120. Removal From Stale Preview

Remove.

Do not auto-regenerate unrelated stale Preview.

List updates immediately from decision subscription.

---

# 121. Removal With No Preview

No generation.

---

# 122. Removal Persistence Failure Test

Runtime decision removed.

Fresh Preview auto-regenerates without it.

Persistence feedback reports failure.

Retry available.

---

# 123. Retry After Failed Removal Test

Retry saves current empty/updated collection.

No decision recreated.

No schedule regeneration.

---

# 124. Restart After Successful Removal

Decision stays gone.

---

# 125. Restart After Failed Removal Before Retry

Old durable decision may return.

Ensure existing durability warning behavior was factual.

No additional architecture needed.

---

# 126. Protected Ingress Removal Test

Remove disabled/rejected.

No runtime decision mutation.

No regeneration.

---

# 127. Quarantine Coexistence Removal Test

Valid decision removed.

Quarantine preserved.

---

# 128. Profile Activation Visibility Test

Decision list persists through profile activation.

After new Preview, status staleLifetime.

---

# 129. Backup V1 Visibility Test

Same.

---

# 130. Backup V2 Reactivation Visibility Test

Stale decision becomes applied/blocked/etc. again after exact restore and regeneration.

---

# 131. Active Abandonment Visibility Test

Decisions retained.

List remains.

Status not falsely applied.

---

# 132. Full Clear Test

List disappears.

---

# 133. State Subscriber Test

Decision removal causes:

* decision subscriber update;
* Preview state update if stale/regeneration occurs.

Do not overconstrain exact count.

---

# 134. Decision Subscription Test

List updates even without Preview mutation.

---

# 135. Replay Result Correlation Test

Multiple decisions.

Correct status attached to correct record by ID.

---

# 136. Missing Replay Result Test

Fresh Preview missing one decision result.

Entry shows unable-to-evaluate, not applied.

---

# 137. Clone Isolation

Presentation mapping must not mutate:

* PlanDecision records;
* Preview replay results;
* authored state.

---

# 138. No Persistence In View Mapper

Pure.

---

# 139. No Source Allocation

Visibility/removal UI does not allocate source incarnation or decision IDs.

---

# 140. No Decision Reconstruction

Do not rebuild PlanDecision records from Preview.

Use store authority.

---

# 141. No Replay Mutation

UI only displays current replay status.

No schedule changes except through removal → normal regeneration.

---

# 142. No Recommendation Policy Change

Task 2.39 remains responsible.

---

# 143. No Backup Change

Backup V2 remains unchanged.

Result artifact must continue to note Backup V3 before broader release.

---

# 144. No Profile Change

None.

---

# 145. No PlanDecision Schema Change

None.

---

# 146. No DurableOccurrenceReference Change

None.

---

# 147. No New Decision Status Persistence

Do not persist:

* applied;
* blocked;
* stale;
* outsideWindow.

Derived only.

---

# 148. No New Route

Preferred.

If an existing panel/tab can contain Accepted Choices, use it.

Do not create `/decisions`.

---

# 149. Planner Mental Model

Accepted choices conceptually belong to Planner rather than Setup.

Keep placement consistent with current Preview/Planner-oriented surface.

Do not perform the larger Planner/Summary redesign in this task.

---

# 150. Accepted Choices Panel Location

Result must document why chosen location supports:

* persistent discoverability;
* omitted decisions;
* stale decisions;
* blocked decisions;
* mobile layout.

---

# 151. Result Wording

Use “accepted choice” rather than “decision” in user-facing copy unless product terminology already uses Decision.

Internal type remains PlanDecision.

---

# 152. User Agency

The panel must communicate:

> DayFrame is remembering this because you accepted it.

without implying immutability.

Remove demonstrates reversibility.

---

# 153. No Guilt/Warning Tone

Stale/blocked decisions are normal planning states.

Use neutral factual copy.

---

# 154. Reference Audit

Before completion, search all UI production references to:

* `getPlanDecisions`;
* `subscribePlanDecisions`;
* `planDecisionResults`;
* `removePlanDecision`;
* decision durability;
* accepted feedback;
* Preview stale state.

Confirm there is one clear presentation pipeline.

---

# 155. Remove Path Audit

Confirm every user-visible Remove control goes through store-owned `removePlanDecision`.

No direct collection mutation.

---

# 156. No History Audit

Search for no new retained superseded/removed decision list.

---

# 157. No Recommendation Change Audit

Confirm `generateSuggestedFixes` unchanged.

---

# 158. Persistence Writer Audit

No format/key changes.

---

# 159. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.38_IMPLEMENT_MINIMAL_PERSISTENT_ACCEPTED_DECISION_VISIBILITY_AND_REMOVAL_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contract
4. Initial UI/Store Audit
5. Files Changed
6. Accepted Choices Surface
7. Surface Location Determination
8. Presentation Model
9. Decision Authority Source
10. Replay Status Source
11. Preview-Null Behavior
12. Stale-Preview Behavior
13. Fresh-Preview Behavior
14. Missing Replay Result
15. Semantic Summary
16. Target Labeling
17. Stale Target Labeling
18. Placement Visibility
19. Duration Visibility
20. Priority Visibility
21. Omission Visibility
22. Blocked Visibility
23. Stale Source Visibility
24. Stale Lifetime Visibility
25. Stale Occurrence Visibility
26. Outside-Window Visibility
27. Inapplicable Visibility
28. Status Vocabulary
29. Contextual Markers
30. Deterministic Ordering
31. Remove Action
32. Remove Meaning
33. Confirmation Determination
34. Protected-Ingress Removal
35. Quarantine Coexistence
36. Remove Orchestration
37. Regeneration Policy
38. No-Preview Removal
39. Stale-Preview Removal
40. Persistence Failure
41. Retry
42. Restart Semantics
43. Supersession Visibility
44. Subscription Model
45. Profile Activation
46. Backup V1
47. Backup V2 Reactivation
48. Active Abandonment
49. Full Clear
50. Decision Recovery
51. Durability Feedback
52. Immediate Versus Persistent Feedback
53. No-Edit Boundary
54. No-Create Boundary
55. No-Bulk Boundary
56. acceptedAt / Provenance Display Determination
57. Target Context Formatting
58. Accessibility
59. Responsive Layout
60. Tests Added or Updated
61. Try→Accept Regression
62. Omit Visibility Test
63. Blocked Visibility Test
64. Stale Visibility Tests
65. Outside-Window Test
66. Removal Tests
67. Persistence Failure/Retry Tests
68. Cross-Surface Tests
69. Reference Audit
70. Remove Path Audit
71. No-History Audit
72. No-Recommendation-Change Audit
73. Persistence Writer Audit
74. Architectural Alignment Assessment
75. Deviations
76. Discoveries and Deferred Work
77. Recommended Next Task
78. Focused Validation
79. Full Validation
80. Final Completion Determination

---

# 160. Required Matrices

## A. Visibility Matrix

| Decision state | Visible? | Status copy | Remove available? |
| -------------- | -------: | ----------- | ----------------: |

Cover:

* applied;
* blocked;
* staleSourceMissing;
* staleLifetime;
* staleOccurrenceMissing;
* outsideWindow;
* inapplicable;
* Preview absent;
* Preview stale.

## B. Decision Kind Presentation Matrix

| Kind | Summary format | Schedule marker possible? |
| ---- | -------------- | ------------------------: |

## C. Removal Matrix

| Starting state | Runtime removal | Auto-regenerate? | Durability consequence |
| -------------- | --------------: | ---------------: | ---------------------- |

## D. Cross-Surface Matrix

| Transition | Decision remains? | Visibility after transition | Status after fresh Preview |
| ---------- | ----------------: | --------------------------- | -------------------------- |

Cover:

* profile load;
* Backup V1 import;
* Backup V2 restore;
* active abandonment;
* full clear.

## E. Persistence Failure Matrix

| Operation | Runtime authority | Visible schedule | Durable status | Retry |
| --------- | ----------------- | ---------------- | -------------- | ----- |

---

# 161. Validation Requirements

Run focused tests for:

* accepted-choice presentation mapper;
* Preview absent;
* Preview stale;
* fresh applied result;
* omission;
* blocked;
* stale source/lifetime/occurrence;
* outside-window;
* missing replay result;
* remove from applied/omitted/blocked/stale;
* persistence failure;
* retry;
* protected ingress;
* quarantine coexistence;
* profile/Backup transitions;
* full clear.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact file/test counts.

---

# 162. Completion Criteria

Task 2.38 is complete only when:

* current PlanDecision authority is persistently discoverable in the primary planning/Preview workflow;
* the accepted-choice surface appears whenever current decisions exist;
* all four V1 kinds have clear semantic summaries;
* occurrence context sufficiently distinguishes repeated instances;
* current replay status is displayed only when Preview is fresh;
* stale Preview does not present old replay status as current;
* Preview absence does not hide decisions;
* omission remains visible despite absent scheduled block;
* blocked decisions are visible;
* stale source/lifetime/occurrence decisions remain visible;
* outside-window decisions remain visible and are not mislabeled stale;
* each current decision can be explicitly removed;
* removal uses store-owned `removePlanDecision`;
* no direct decision collection mutation exists;
* removal from a fresh Preview automatically regenerates under the chosen policy;
* removal from absent/stale Preview follows explicit documented behavior;
* removal persistence failure preserves session removal and exposes Retry;
* Retry does not recreate the decision or alter schedule authority;
* protected decision ingress prevents ordinary removal;
* quarantine coexists without blocking valid removal;
* superseded decisions do not remain visible;
* profile activation retains decisions and later displays stale results;
* Backup V1 import retains decisions and displays stale results;
* Backup V2 restoration can reactivate visible decision status;
* full clear removes all accepted-choice visibility;
* immediate Task 2.36 feedback remains intact;
* no decision editing is added;
* no direct creation is added;
* no bulk management is added;
* no history is added;
* no PlanDecision schema/persistence/replay changes are added;
* no recommendation policy implementation is added;
* accessibility and responsive behavior are preserved;
* full validation passes;
* result artifact is complete.

---

# 163. Explicit Non-Goals

Do **not**:

* implement decision-aware SuggestedFix policy;
* change recommendation ranking;
* suppress recommendations;
* add recommendation metadata;
* build a full decision-management page;
* add decision editing;
* add decision history;
* add supersession history;
* add bulk remove;
* add direct PlanDecision authoring;
* add new decision kinds;
* change PlanDecision schema;
* change PlanDecision persistence;
* change replay semantics;
* change DurableOccurrenceReference;
* change Active/Profile/Backup formats;
* implement Backup V3;
* add execution/history;
* persist replay statuses;
* expose internal IDs/incarnation;
* perform unrelated Planner/Summary redesign.

---

# 164. Stop Conditions

Stop and report if:

* current PlanDecision/replay APIs cannot produce safe persistent presentation without changing durable schemas;
* stale decisions cannot be labeled without incorrectly resolving recreated sources;
* omission cannot remain discoverable without a broad new route;
* removal orchestration requires changing store removal semantics;
* removal persistence failure cannot be surfaced without broad durability redesign;
* decision subscriptions cannot be added to current workflow without contaminating `DayFrameState`;
* responsive placement requires a broad Preview redesign;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest prerequisite.

---

# 165. Recommended Follow-On Boundary

If Task 2.38 completes successfully, the next task should implement the recommendation policy already defined by Task 2.37:

> **Task 2.39 — Implement Decision-Aware SuggestedFix Classification, Ranking, and Supersession Messaging**

That task should:

* consume current PlanDecision + replay context;
* classify recommendation relationship;
* suppress exact equivalent recommendations;
* rank preserving/unblocking recommendations ahead of superseding ones;
* mark superseding recommendations as revisions to accepted choices;
* preserve explicit Try → Accept;
* avoid automatic PlanDecision mutation;
* keep stale/outside-window decisions out of current recommendation constraints;
* preserve current durable schemas.

Backup V3 should remain required before broader release but not block Task 2.39 or Phase 2 completion unless new evidence changes that determination.

---

# 166. Task Determination

**Authorized:** minimal persistent accepted-decision visibility, semantic summaries, current derived status presentation, contextual accepted markers where useful, one-decision removal through existing store authority, automatic regeneration after removal under a bounded policy, persistence/retry feedback, and cross-surface visibility behavior.

**Not authorized:** decision-aware recommendation implementation, broad decision management, direct editing/creation, bulk operations, history, PlanDecision schema/persistence/replay changes, Backup V3, new decision kinds, or unrelated UI redesign.

The governing reversibility principle is:

> A durable accepted planning choice must remain visible and withdrawable after the moment of acceptance. DayFrame may remember the user's choice, but it must not make that remembered authority invisible or practically irreversible.

---

# 167. Final Completion Statement

**Task 2.38 is complete when DayFrame persistently exposes every current PlanDecision V1 as a human-readable accepted planning choice in the primary planning workflow, including applied, omitted, blocked, stale, outside-window, inapplicable, unevaluated, and unable-to-evaluate states; derives current status only from fresh replay evidence without retargeting stale lifetimes; keeps omitted and stale authority discoverable even when no schedule block exists; allows explicit single-decision removal through the existing store-owned authority with truthful runtime, regeneration, durability-failure, retry, restart, protection, quarantine, profile, backup, abandonment, and clear semantics; preserves immediate Try → Accept feedback, accessibility, and responsive layout; passes complete repository validation; and introduces no decision editing, direct creation, bulk management, history, recommendation-policy implementation, durable-schema change, Backup V3, or unrelated scheduling/UI behavior.**
