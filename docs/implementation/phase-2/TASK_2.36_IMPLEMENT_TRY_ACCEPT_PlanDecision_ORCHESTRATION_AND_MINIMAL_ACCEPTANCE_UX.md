# Task 2.36 — Implement Try → Accept PlanDecision Orchestration and Minimal Acceptance UX

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded workflow/orchestration and minimal-UX implementation task.

Task 2.36 connects the existing Preview/SuggestedFix/Try workflow to the durable `PlanDecision V1` authority implemented in Tasks 2.34–2.35.

This task implements:

* explicit Try → Accept workflow;
* supported SuggestedFix → PlanDecision semantic mapping;
* fresh-Preview acceptance enforcement;
* durable occurrence-reference construction at acceptance;
* call-through to store-owned `acceptPlanDecision`;
* regeneration after successful acceptance;
* resulting replay verification;
* durability feedback;
* minimal accepted/stale/blocked decision feedback;
* replacement/supersession behavior through existing store semantics.

It does **not** implement:

* a full decision-management screen;
* bulk decision editing;
* decision history;
* direct arbitrary decision authoring UI;
* conflict decisions;
* Backup V3;
* execution/history;
* broad recommendation redesign;
* new scheduling semantics.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 2.34 and 2.35 are complete and accepted;
6. review current SuggestedFix, Try, replay-result, and PlanDecision store APIs;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.36_IMPLEMENT_TRY_ACCEPT_PLANDECISION_ORCHESTRATION_AND_MINIMAL_ACCEPTANCE_UX_RESULT.md`

If the current SuggestedFix/Preview model cannot provide enough semantic information to construct a valid supported PlanDecision without broad redesign, stop and report rather than inventing a fragile mapping.

---

# 2. Purpose

DayFrame now has:

```text
SuggestedFix
    recommendation

Try
    Preview-only experiment

PlanDecision
    durable accepted planning authority

Replay
    deterministic regeneration from accepted authority
```

What is missing is the explicit transition:

```text
Try
    ↓
Accept
```

The user can currently experiment with a SuggestedFix, but there is no governed user-facing path that says:

> Keep this planning choice across regeneration.

Task 2.36 implements that path.

---

# 3. Governing Architectural Decisions

The following are fixed:

1. Try remains Preview-only;
2. Accept creates durable PlanDecision authority;
3. acceptance must target `DurableOccurrenceReference V1`;
4. acceptance requires current valid source lifetime;
5. stale Preview cannot authorize acceptance;
6. PlanDecision V1 supports only:

   * `placeOccurrence`;
   * `omitOccurrence`;
   * `setOccurrenceDuration`;
   * `setOccurrencePriority`;
7. one current decision per target;
8. acceptance may supersede an existing decision;
9. successful acceptance changes runtime decision authority;
10. changed decision authority stales existing Preview;
11. regeneration consumes the decision and produces a fresh Preview;
12. replay results are derived;
13. work/manual decisions are currently inapplicable;
14. `changeFixedTime` remains authored Setup navigation;
15. no PlanDecision history exists.

---

# 4. Architectural Objective

The end-to-end accepted workflow should become:

```text
fresh Preview
    ↓
friction
    ↓
SuggestedFix
    ↓
Try
    ↓
temporary revised Preview
    ↓
Accept
    ↓
construct semantic PlanDecision input
    ↓
acceptPlanDecision
    ↓
durable decision authority advances
    ↓
Preview marked stale
    ↓
Regenerate
    ↓
decision replayed
    ↓
fresh Preview + replay result
```

The accepted result must not depend on the temporary Try Preview continuing to exist.

---

# 5. Required Initial Audit

Before implementation, audit:

* all current SuggestedFix kinds;
* all current SuggestedFix payloads;
* `applySuggestedFixToPreview`;
* Preview revision result;
* friction-point structure;
* grouped friction rendering;
* individual friction rendering;
* `changeFixedTime` special path;
* stale-preview disablement;
* current buttons/labels;
* current store `acceptPlanDecision`;
* replay-result structure;
* Preview freshness behavior;
* durability feedback infrastructure.

Document which current Try actions can be mapped safely to PlanDecision V1.

---

# 6. Supported SuggestedFix Mapping

Map only the semantically supported current actions.

Expected mapping:

| SuggestedFix action | PlanDecision kind       |
| ------------------- | ----------------------- |
| `moveBlock`         | `placeOccurrence`       |
| `skipBlock`         | `omitOccurrence`        |
| `reduceDuration`    | `setOccurrenceDuration` |
| `changePriority`    | `setOccurrencePriority` |

Confirm actual current names and payloads.

Do not map by button text.

---

# 7. Unsupported SuggestedFix Actions

The following must not produce Accept:

* `changeFixedTime`;
* `addResource`;
* `convertToRecovery`;
* `acceptConflict`;
* any future unsupported action.

Classify them explicitly.

---

# 8. `changeFixedTime`

Preserve current behavior:

> Review/edit authored Setup.

No PlanDecision is created.

Do not add Accept after the user merely navigates to Setup.

---

# 9. `acceptConflict`

Do not implement durable conflict acceptance.

Task 2.33 explicitly deferred it pending a lifetime-safe durable conflict-reference model.

No hidden single-target approximation.

---

# 10. Accept Availability

An Accept control should appear only when:

* a supported Try action was successfully applied;
* the underlying Preview was fresh at Try time;
* the resulting Try state still corresponds to a supported semantic decision candidate;
* enough durable-reference/source information remains available;
* the action is not capability-inapplicable.

Do not show a dead Accept button for unsupported actions.

---

# 11. Try State

Determine the narrowest runtime representation needed to remember:

* which SuggestedFix was tried;
* which friction/occurrence it concerned;
* what semantic PlanDecision input would be accepted.

Prefer transient workflow state, not durable state.

Do not persist Try state.

---

# 12. Try Candidate Semantics

After Try succeeds, construct or retain a **semantic acceptance candidate**.

Conceptually:

```ts
type PendingPlanDecisionAcceptance = {
  target: DurableOccurrenceReferenceV1;
  kind: PlanDecisionKind;
  payload: PlanDecisionPayload;
  provenance: PlanDecisionProvenance;
};
```

Exact shape may differ.

This candidate is transient.

---

# 13. Do Not Persist Try Candidate

The pending acceptance candidate must not be stored in:

* Active V2;
* Profile V2;
* Backup V2;
* PlanDecision surface;
* Preview persistence.

It exists only to support explicit user acceptance.

---

# 14. Acceptance Candidate Construction

Prefer constructing the acceptance candidate from authoritative semantic data at Try time or Accept time.

Do not derive durable intent by cloning:

* scheduled block object;
* Preview diff;
* friction object wholesale;
* SuggestedFix runtime ID.

---

# 15. Durable Target Construction

The target must come from `DurableOccurrenceReference V1`.

Use the current occurrence/source lineage.

Do not accept runtime IDs.

---

# 16. `moveBlock` Mapping

A successful Try of `moveBlock` must map to:

```ts
{
  kind: "placeOccurrence",
  target,
  payload: {
    userDayDate,
    startTime
  },
  provenance: {
    source: "suggestedFix",
    suggestedAction: "moveBlock"
  }
}
```

The stored placement must represent the exact accepted Try destination.

---

# 17. Move Coordinate Canonicalization

Convert the Try destination into canonical:

* `userDayDate`;
* local `startTime`.

Do not persist:

* absolute timestamp;
* runtime block start object;
* end time.

Use current effective user-day semantics.

---

# 18. `skipBlock` Mapping

Map to:

```ts
{
  kind: "omitOccurrence",
  target,
  payload: {},
  provenance: {
    source: "suggestedFix",
    suggestedAction: "skipBlock"
  }
}
```

---

# 19. `reduceDuration` Mapping

Map the **resulting exact duration**, not the delta, to:

```ts
{
  kind: "setOccurrenceDuration",
  payload: {
    durationMinutes: resultingDuration
  }
}
```

Do not persist “reduce by 15.”

---

# 20. `changePriority` Mapping

Map the resulting exact effective priority:

```ts
{
  kind: "setOccurrencePriority",
  payload: {
    priority: resultingPriority
  }
}
```

---

# 21. Provenance

SuggestedFix-origin acceptance must use the existing governed provenance vocabulary.

Do not store:

* SuggestedFix ID;
* friction-point ID;
* button label;
* explanatory copy.

---

# 22. Fresh Preview Requirement

Accept must require that the acceptance evidence derives from a fresh Preview.

If Preview becomes stale after Try but before Accept:

* Accept unavailable or rejected;
* no PlanDecision mutation;
* instruct user to regenerate/retry.

This is mandatory.

---

# 23. Why Freshness Matters

The Try result may refer to:

* old friction;
* old placement;
* old source state;
* old decision authority.

Therefore stale Try evidence cannot create new durable planning authority.

---

# 24. Decision Mutation During Pending Try

If another PlanDecision is accepted/removed/superseded after Try:

* existing Preview becomes stale;
* pending Accept must no longer be valid.

Do not let two overlapping workflow states race.

---

# 25. Authored Mutation During Pending Try

Same:

* authored state changes;
* Preview stale;
* pending Accept invalid.

---

# 26. Profile/Backup/Recovery During Pending Try

Any operation replacing active authority invalidates pending Try acceptance.

Do not preserve a pending acceptance candidate across:

* profile load;
* Backup V1 import;
* Backup V2 restore;
* active recovery replacement;
* active abandonment;
* clear.

---

# 27. Preview Regeneration During Pending Try

Regeneration replaces the Try-derived Preview.

Pending acceptance should clear unless the workflow explicitly reconstructs it from the new Preview.

Preferred:

> regeneration clears pending Try/Accept state.

---

# 28. Accept API Call

On explicit Accept:

1. recheck Preview freshness;
2. validate pending semantic candidate;
3. call `acceptPlanDecision`;
4. handle rejection;
5. on accepted runtime authority, clear pending acceptance state;
6. regenerate Preview using current PlanDecisions.

---

# 29. Automatic Regeneration After Accept

Unlike ordinary raw store acceptance APIs, the UI/workflow Accept action should regenerate automatically after successful runtime acceptance.

Reason:

* acceptance intentionally changes Preview derivation;
* leaving the user on a stale Preview after explicit Accept is unnecessary friction.

This workflow-level regeneration is authorized.

---

# 30. Persistence Failure After Accept

If `acceptPlanDecision` returns accepted runtime authority but persistence fails:

* decision remains session authority;
* automatically regenerate Preview;
* replay the decision;
* show durability failure/retry feedback.

Do not treat persistence failure as failed acceptance.

This follows established runtime/durable separation.

---

# 31. Allocation/Validation Rejection

If acceptance is rejected before runtime mutation:

* do not regenerate merely because Accept was clicked;
* keep or clear Try state according to factual cause;
* show concise failure feedback.

---

# 32. Stale Target Rejection

If target unexpectedly resolves stale at Accept time:

* no PlanDecision mutation;
* clear or invalidate pending candidate;
* require regeneration.

Do not silently rebuild target from current similar occurrence.

---

# 33. Supersession

If target already has a PlanDecision:

* Accept may supersede it through existing store semantics;
* no additional warning required unless product evidence demands one.

The user explicitly accepted a new choice for the same occurrence.

---

# 34. Supersession Feedback

Minimal feedback should indicate that the accepted choice is now the current one.

Do not expose superseded record history because none exists.

---

# 35. Try Remains Non-Durable

If user tries but does not Accept:

* regeneration removes the Try effect;
* durable PlanDecision collection unchanged.

Direct integration test required.

---

# 36. Accept Makes Effect Durable

If user Try → Accept:

* regenerate;
* effect remains through PlanDecision replay.

Direct integration test required.

---

# 37. Restart After Accept

After a successfully persisted acceptance:

* restart;
* regenerate;
* accepted effect returns.

No Try state survives restart.

---

# 38. Persistence Failure + Restart

If acceptance runtime succeeded but decision persistence failed and no retry occurred:

* current session effect exists;
* restart may lose it because it was not durable.

UI feedback must make this clear through existing durability status.

Do not claim durable success.

---

# 39. Retry Workflow

Provide or preserve a visible retry path for decision persistence failure.

Use existing decision durability API.

Retry:

* does not recreate decision;
* does not change acceptedAt;
* does not regenerate unless current UI needs to refresh durability display;
* does not stale Preview.

---

# 40. Durability Feedback

Minimum user-facing distinction:

* accepted and saved;
* accepted for this session but not saved;
* save retry succeeded;
* save retry failed/unavailable.

Do not expose storage exception details.

---

# 41. Accepted Replay Result Feedback

After regeneration, inspect the accepted decision's replay result.

Possible:

* applied;
* blocked;
* inapplicable;
* stale;
* outsideWindow.

The workflow should report the result minimally.

---

# 42. `applied`

Communicate that the accepted choice is active in the regenerated schedule.

Avoid celebratory verbosity.

---

# 43. `blocked`

Important case.

The decision is durable/current, but the engine could not realize its exact requested placement.

Communicate:

> Accepted, but DayFrame could not apply it in the current schedule.

or equivalent.

Do not delete the decision automatically.

---

# 44. `inapplicable`

This should be rare if acceptance mapping/capability checks are correct.

If encountered after authoritative changes between acceptance and regeneration:

* preserve decision;
* report it cannot currently apply.

Do not silently remove.

---

# 45. Stale Result

If the decision becomes stale immediately due to another authority transition, report factually.

No retargeting.

---

# 46. `outsideWindow`

The decision remains accepted but the targeted occurrence is outside the current Preview.

Communicate without implying failure.

---

# 47. Minimal Decision Status UI

Task 2.36 may expose limited decision status adjacent to the affected Preview/friction workflow.

Do not build a global management page.

Possible elements:

* “Accepted”
* “Accepted, blocked”
* “Accepted, outside this preview”
* save-status text.

Keep it contextual.

---

# 48. Decision Management Scope

The only management action authorized in this task is what is necessary to complete acceptance UX.

Do not add:

* list all decisions;
* bulk delete;
* stale-decision browser;
* edit decision;
* history.

---

# 49. Optional Remove/Undo Current Accepted Choice

Evaluate whether the contextual workflow needs a single minimal:

> Remove accepted choice

control.

If it naturally follows existing UX and can use `removePlanDecision`, it may be added narrowly.

However, it is not required for completion unless current accepted state would otherwise trap the user.

Prefer to include only if needed for reversibility.

---

# 50. If Remove Is Exposed

Removing:

* calls existing `removePlanDecision`;
* automatically regenerates;
* returns schedule to authored/other-decision behavior;
* handles persistence failure factually.

No historical undo.

---

# 51. No Direct Decision Authoring

Do not add controls like:

* “Move and remember” independent of SuggestedFix;
* arbitrary placement editor that writes PlanDecision.

Task 2.36 accepts supported Try results only.

---

# 52. SuggestedFix Button Model

Preserve current initial action as Try.

Do not replace Try with immediate Accept.

The experiment-first model remains intentional.

---

# 53. Button Language

Preferred conceptual progression:

```text
Try
↓
Accept
```

Use current product language style.

Avoid ambiguous “Save” if it could be confused with Setup persistence.

---

# 54. Unsupported Try Actions

Actions like `changeFixedTime` retain their current labels/workflow.

Do not show Accept afterward.

---

# 55. Grouped Friction

Audit grouped/repeated friction Try controls.

Accept must work correctly if a supported Try originates from grouped friction rendering.

Target exactly the semantic occurrence that was tried.

Do not accidentally accept a whole friction group unless the SuggestedFix itself represents one occurrence and the architecture supports it.

---

# 56. Individual Friction

Same semantic rules.

---

# 57. Repeated Friction SuggestedFix

If one SuggestedFix concept is rendered once for repeated friction but semantically spans multiple occurrences, stop and assess.

PlanDecision V1 is single-target.

Do not create a multi-target decision under this task.

---

# 58. Multi-Occurrence Stop Condition

If grouped Try currently changes multiple occurrences atomically:

* do not add Accept to that action;
* document unsupported V1 acceptance;
* preserve Try-only behavior.

---

# 59. Acceptance Candidate And Revised Preview

Do not assume every Preview revision can be durably accepted.

Only map actions whose semantic result exactly matches a V1 PlanDecision.

---

# 60. Try Failure

If Try cannot be applied:

* no Accept appears;
* no candidate created.

---

# 61. Accept Candidate Isolation

The pending semantic candidate must be cloned/immutable enough that later UI mutation cannot alter it.

---

# 62. Candidate Lifetime

Clear pending candidate when:

* Accept succeeds;
* Preview regenerates;
* active authored state changes;
* decision authority changes externally;
* profile/backup recovery replaces state;
* user performs a different Try;
* navigation destroys the relevant workflow context if current UX already resets it.

---

# 63. Second Try

Performing another supported Try should replace the previous pending acceptance candidate.

Only one contextual pending acceptance is needed for V1 unless current workflow demands otherwise.

---

# 64. Accepted Existing Decision And New Try

If Preview already contains replayed accepted decision effects and user tries another SuggestedFix:

* Try remains temporary;
* Accept may supersede existing target decision if same target;
* otherwise creates another target decision.

---

# 65. Try That Contradicts Existing Decision

This may happen because SuggestedFix generation is not decision-aware.

If a Try proposes a semantic change to the same target:

* trying is allowed on a fresh Preview;
* accepting supersedes the prior PlanDecision.

This is consistent with one-current-choice-per-target.

Document.

---

# 66. SuggestedFix Awareness Deferred

Do not attempt to suppress contradictory suggestions in this task.

That is a separate recommendation-policy task.

---

# 67. Fresh Preview Guard In UI

Accept button must use native disabled/unavailable semantics when stale, or disappear if the pending candidate is cleared immediately on stale transition.

Do not rely solely on click-handler rejection.

---

# 68. Store Boundary Still Authoritative

UI freshness guard does not replace store validation/resolution.

`acceptPlanDecision` still owns durable-domain acceptance checks.

---

# 69. Workflow Boundary

Create a narrow orchestration helper if useful.

Possible responsibility:

```text
SuggestedFix + fresh Preview
    ↓
Try
    ↓
PendingPlanDecisionAcceptance
    ↓
Accept
```

Do not put all logic directly into a React component if a domain/workflow helper improves testability.

---

# 70. SuggestedFix → PlanDecision Mapper

A pure mapper is encouraged.

Conceptual API:

```ts
createPlanDecisionAcceptanceCandidate({
  suggestedFix,
  friction,
  preview,
  authoredSetup
})
```

or equivalent.

It should return:

* supported candidate;
* unsupported;
* missing lineage;
* invalid action.

No persistence.

---

# 71. Mapper Purity

No state mutation.

No storage.

No decision ID allocation.

No timestamps.

The store creates record identity at Accept.

---

# 72. Mapper Target Source

Use authoritative/generated semantic occurrence evidence sufficient for DurableReference construction.

If current friction/SuggestedFix lacks lineage, resolve through Preview/generated occurrence records rather than guessing.

---

# 73. Runtime ID Use

Runtime IDs may be used only to locate the relevant current generated occurrence inside the fresh Preview.

Once found, durable target must be constructed from semantic lineage.

Do not persist runtime ID.

---

# 74. Missing Generated Occurrence

If the SuggestedFix points to a runtime block that cannot be mapped to a durable occurrence:

* Try may continue under existing Preview behavior;
* Accept unavailable;
* document as unsupported acceptance case.

Do not invent identity.

---

# 75. Acceptance Candidate Validation

Before showing Accept, validate candidate payload/reference structurally.

At Accept time, the store validates/resolves again.

---

# 76. Preview Revision Metadata

If needed, extend transient Preview revision result with:

* which SuggestedFix was tried;
* semantic acceptance candidate.

Do not add it to persisted Preview.

Prefer workflow-local state if simpler.

---

# 77. Preview Cloning

If pending candidate lives inside Preview-derived UI state, ensure clone isolation.

---

# 78. State Ownership

Pending Try/Accept workflow state should not become durable authority.

Possible owner:

* DayFrameApp workflow state;
* PreviewScreen container/controller state.

Do not put it into authored store state.

---

# 79. Existing Unified Setup

No Setup changes except preserving `changeFixedTime` behavior.

---

# 80. Acceptance And Preview Stale Transition

Store acceptance marks the current Try Preview stale immediately.

The UI should not flash the stale intermediate state unnecessarily if regeneration follows synchronously in the workflow.

But semantics must remain correct.

Do not bypass stale marking.

---

# 81. Regeneration Failure

Audit whether Preview generation can fail/throw under current workflow.

If acceptance succeeds but regeneration fails:

* PlanDecision remains accepted;
* durability status remains factual;
* show failure to regenerate;
* do not roll back decision.

---

# 82. Acceptance Result Correlation

After regeneration, identify the replay result by the accepted `PlanDecisionId`.

Do not search only by target because another operation could have superseded it.

---

# 83. Supersession Correlation

The store returns the newly accepted decision record.

Use its ID to locate the replay result.

---

# 84. Replay Result Missing

If regenerated Preview unexpectedly lacks a result for an accepted current decision:

* treat as implementation error/workflow failure;
* do not falsely report applied.

Direct test if feasible.

---

# 85. Acceptance Durability + Replay Combined Feedback

Keep durable and replay outcomes separate.

Example:

```text
Accepted and saved.
Current schedule: applied.
```

or:

```text
Accepted for this session; saving failed.
Current schedule: blocked.
```

Do not collapse them into one generic status.

---

# 86. Accessibility

Use:

* native buttons;
* disabled state;
* visible status text;
* existing status role/patterns.

Do not rely on color alone.

---

# 87. Confirmation

No confirmation is required for ordinary Accept if:

* Try already previewed the consequence;
* Accept simply makes that previewed choice durable.

This is a strong UX advantage of Try → Accept.

Do not add unnecessary modal confirmation.

---

# 88. Remove Confirmation

If contextual Remove is added, ordinary decision removal likely does not require confirmation because regeneration immediately shows the reversal.

Use current project conventions.

---

# 89. Keyboard Interaction

Native buttons should support keyboard activation automatically.

---

# 90. Mobile Layout

Ensure Try/Accept controls remain usable in existing responsive Preview layout.

No redesign.

---

# 91. Accepted Status Copy

Use concise factual language.

Possible concepts:

* “Accepted.”
* “Accepted and saved.”
* “Accepted for this session; retry saving.”
* “Accepted, but currently blocked.”

Avoid implying authored Setup changed.

---

# 92. Do Not Say “Saved Setup”

PlanDecision persistence is independent from Setup persistence.

Keep terminology distinct.

---

# 93. Stale Pending Copy

If Accept becomes unavailable because Preview changed:

> Regenerate the preview before accepting this choice.

or equivalent.

Reuse existing stale-preview language where possible.

---

# 94. Existing Stale Warning

Task 2.5 warning currently connects stale Preview to regeneration and suggestions.

Update only if necessary to include pending acceptance semantics.

Avoid redundant warnings.

---

# 95. SuggestedFix Stale Disablement

Existing Try/SuggestedFix buttons remain disabled on stale Preview.

Accept must likewise be unavailable.

---

# 96. Decision Durability UI Location

Use the existing workflow panel/status area if possible.

Do not create a global persistence dashboard.

---

# 97. Retry Control

If decision persistence fails after acceptance, expose a contextual Retry using existing store retry API.

Do not require the user to re-Accept.

---

# 98. Retry Success

Update status to saved/durable.

No schedule change/regeneration required.

---

# 99. Retry Failure

Preserve current accepted session authority and blocked/applied replay state.

---

# 100. Protected Decision Ingress

If PlanDecision whole-source ingress is protected:

* Accept must be unavailable/blocked;
* show factual recovery-required feedback if the user reaches this workflow.

Do not overwrite protected decision storage.

---

# 101. Quarantine

Quarantined entries do not block Accept if the current decision surface itself is valid.

New decisions preserve quarantine.

No quarantine UI expansion required here.

---

# 102. Decision Recovery UI

Deferred.

Task 2.36 only needs to handle the fact that acceptance may be blocked by protected ingress.

---

# 103. No Backup V3

Do not change backup export.

Keep existing limitation visible in documentation/result.

---

# 104. No Decision List UI

Do not build a management page.

---

# 105. No Stale Decision Management UI

Do not surface all stale retained decisions.

Only contextual accepted result feedback is authorized.

---

# 106. No Arbitrary Remove List

If Remove is implemented, expose it only contextually where an accepted choice is visible.

---

# 107. Decision Status Derivation

Current Preview `planDecisionResults` is the source for replay status.

Do not persist “applied/blocked” into PlanDecision.

---

# 108. Existing Decision Status On Fresh Preview

Audit whether the affected occurrence can show that it is shaped by an accepted decision.

A minimal contextual marker may be useful.

Examples:

* “Accepted placement”
* “Accepted omission”
* “Accepted duration”
* “Accepted priority”

Do not overbuild.

---

# 109. Omitted Occurrence Visibility

An omitted occurrence may not appear in the normal schedule.

Its `planDecisionResult` still exists.

If the workflow needs to show acceptance confirmation immediately after regeneration, use the result/status area rather than trying to render a nonexistent block.

---

# 110. Blocked Exact Placement Visibility

The occurrence remains unplaced and result blocked.

Surface both:

* accepted decision exists;
* exact placement could not be realized.

Do not present it as persistence failure.

---

# 111. Duration/Priority Applied But Unplaced

Remember Task 2.35 semantics:

* transformation may be `applied`;
* occurrence may still be unplaced.

Do not say “scheduled” merely because replay result is applied.

---

# 112. Acceptance Mapping Tests

Directly test mapper for:

* move;
* skip;
* reduce duration;
* change priority;
* changeFixedTime unsupported;
* addResource unsupported;
* convertToRecovery unsupported;
* acceptConflict unsupported.

---

# 113. Exact Move Mapping Test

Verify canonical user-day/time payload from Try destination.

---

# 114. Duration Exactness Test

Verify resulting duration, not delta.

---

# 115. Priority Exactness Test

Verify resulting priority.

---

# 116. Fresh Try → Accept Test

End-to-end:

1. generate fresh Preview;
2. Try supported SuggestedFix;
3. Preview visibly revised;
4. Accept;
5. PlanDecision created;
6. Preview regenerated;
7. result applied;
8. accepted effect remains.

---

# 117. Try Without Accept Test

Try.

Regenerate.

Effect disappears because no PlanDecision exists.

---

# 118. Stale Before Accept Test

Try.

Change authored state or decision authority.

Accept unavailable/rejected.

No PlanDecision created.

---

# 119. Persistence Failure Accept Test

Force PlanDecision write failure.

Accept:

* runtime decision exists;
* Preview regenerates with effect;
* durability failure shown;
* Retry available.

---

# 120. Retry Success Test

Retry succeeds.

No new decision ID.

No acceptedAt change.

No schedule semantic change.

---

# 121. Blocked Replay Accept Test

Try an exact move that can be shown in temporary Preview if current Try semantics allow it, then create a condition causing replay block before/at regeneration.

Expected:

* decision accepted;
* replay result blocked;
* status factual.

If current workflow cannot create this naturally, use direct orchestration test.

---

# 122. Supersession Test

Existing accepted decision for target.

Try another supported action on same target.

Accept.

Only new PlanDecision remains.

Regenerated Preview reflects new decision.

---

# 123. Different-Target Test

Existing decision T1.

Try/Accept T2.

Both retained/replayed.

---

# 124. Profile Activation Pending-Test

Try.

Profile load.

Pending Accept cleared/unavailable.

---

# 125. Backup Import Pending-Test

Try.

Backup import/restore.

Pending Accept cleared/unavailable.

---

# 126. Decision Removal Pending-Test

Try.

External decision mutation stales Preview.

Pending Accept invalid.

---

# 127. Preview Regeneration Pending-Test

Try.

Regenerate before Accept.

Pending Accept cleared.

---

# 128. Unsupported Try Test

`changeFixedTime`/other unsupported path never produces Accept.

---

# 129. Grouped Friction Test

Supported grouped rendered action produces at most one valid single-target pending candidate.

If impossible because group action spans multiple targets, verify Accept absent.

---

# 130. Individual Friction Test

Supported action maps correctly.

---

# 131. Protected Decision Surface Test

Protected ingress.

Try may remain Preview-only if existing behavior allows.

Accept blocked.

No decision mutation.

---

# 132. Quarantine Test

Valid decision surface with quarantine.

Accept works and quarantine preserved.

---

# 133. Restart Test

Accept saved decision.

Restart.

Generate.

Effect replays.

No pending Try state exists.

---

# 134. Backup V2 Reactivation UI Test

If practical:

* accepted decision becomes stale after profile activation;
* Backup V2 restore exact lifetime;
* regenerate;
* replay effect returns.

No re-Accept.

UI only needs to remain coherent.

---

# 135. State Subscriber Test

Accept workflow may:

* decision mutation notify decision subscriber;
* stale transition notify state subscriber;
* regeneration notify state subscriber.

Do not overconstrain exact count unless contractually meaningful.

---

# 136. Decision Subscriber Test

Try does not notify decision subscribers.

Accept does.

---

# 137. Durability Subscriber Test

Try does not.

Accept/retry do as governed.

---

# 138. SuggestedFix Try Regression

All existing Try behavior remains green.

---

# 139. `changeFixedTime` Regression

Still routes/focuses Setup exactly as before.

---

# 140. Stale Preview Regression

Existing stale SuggestedFix protections remain green.

---

# 141. Replay Regression

All Task 2.35 engine tests remain green.

---

# 142. Decision Persistence Regression

All Task 2.34 tests remain green.

---

# 143. No Direct Schedule Mutation On Accept

The workflow should accept then regenerate.

Do not manually edit Preview into the accepted state as a shortcut.

The regenerated engine output is authoritative derived result.

---

# 144. Try Preview Versus Accepted Preview

The post-Accept regenerated Preview may not be byte-identical to the temporary Try Preview if:

* replay blocks;
* other decisions influence generation;
* current friction/sorting changed.

That is acceptable.

The accepted semantic intent, not the temporary snapshot, is durable.

---

# 145. Workflow Error Handling

Expected errors should produce workflow feedback, not exceptions.

Examples:

* stale;
* unsupported action;
* protected decision surface;
* target no longer resolves;
* persistence failure.

---

# 146. No Raw Exceptions In UI

Use mapped status messages.

---

# 147. UI Location Audit

Choose the narrowest existing component(s).

Likely:

* `PreviewScreen.tsx`;
* `DayFrameApp.tsx`.

Avoid adding a new route.

---

# 148. Core Mapper Location

Keep SuggestedFix→PlanDecision semantic mapping outside React where possible.

Likely:

`core/decisions/createPlanDecisionAcceptanceCandidate.ts`

or equivalent.

---

# 149. Workflow Orchestrator Location

If needed, keep store/API orchestration in application/UI controller boundary, not core engine.

---

# 150. No Persistence Module Changes

Do not modify decision envelope/key/recovery unless a bug is uncovered.

---

# 151. No Replay Engine Changes

Task 2.35 replay semantics are fixed.

Only consume results.

If UI integration exposes a replay defect, stop and report rather than redefining replay under 2.36.

---

# 152. No SuggestedFix Engine Changes

Mapping uses existing SuggestedFix semantics.

Do not modify recommendation generation.

---

# 153. No Friction Changes

None.

---

# 154. No New PlanDecision Kinds

None.

---

# 155. No Multi-Target Decision

None.

---

# 156. Backup Completeness Reminder

Result artifact must continue to state that Backup V2 does not include decisions.

Accepting decisions creates durable authority not covered by current full backup export.

Do not hide this limitation.

---

# 157. Reference Audit

Before completion, audit:

* all SuggestedFix action kinds;
* all Try dispatch paths;
* grouped/individual friction controls;
* `changeFixedTime`;
* `acceptPlanDecision`;
* replay result lookup;
* stale-preview guards;
* decision durability feedback.

Confirm no supported Try→Accept path bypasses semantic mapping.

---

# 158. No Auto-Accept Audit

Search production code.

No SuggestedFix application may call `acceptPlanDecision` without explicit user Accept.

---

# 159. No Runtime-ID Persistence Audit

Confirm candidate/scheduled/friction/SuggestedFix IDs are not stored in PlanDecision payload/provenance.

---

# 160. Preview Freshness Audit

Confirm:

* Try does not inherently stale Preview;
* Accept does via decision mutation;
* workflow regeneration restores fresh Preview;
* Retry does not stale.

---

# 161. Persistence Writer Audit

No current writer changes:

* Active V2;
* Profile V2;
* Backup V2;
* PlanDecision V1 surface.

---

# 162. Expected Production Files

Likely changes:

* new SuggestedFix→PlanDecision mapper/helper;
* helper tests;
* `PreviewScreen.tsx`;
* `DayFrameApp.tsx`;
* possibly workflow/controller types/state;
* UI tests;
* app integration tests.

Avoid engine/persistence changes.

---

# 163. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.36_IMPLEMENT_TRY_ACCEPT_PLANDECISION_ORCHESTRATION_AND_MINIMAL_ACCEPTANCE_UX_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contract
4. Initial SuggestedFix / Try Audit
5. Files Changed
6. Supported Mapping Matrix
7. Unsupported SuggestedFix Actions
8. Try State Model
9. Pending Acceptance Candidate
10. Candidate Lifetime
11. Durable Target Construction
12. Move Mapping
13. Skip Mapping
14. Duration Mapping
15. Priority Mapping
16. Provenance
17. Fresh Preview Requirement
18. Stale Pending Behavior
19. Profile/Backup/Recovery Invalidation
20. Acceptance API Orchestration
21. Automatic Regeneration
22. Persistence Failure Behavior
23. Acceptance Rejection Behavior
24. Supersession
25. Try-Only Behavior
26. Durable Accept Behavior
27. Restart Behavior
28. Durability Feedback
29. Replay Result Feedback
30. Applied Feedback
31. Blocked Feedback
32. Inapplicable/Stale Feedback
33. Outside-Window Feedback
34. Minimal Decision Status UI
35. Remove/Undo Determination
36. Button Language
37. Grouped Friction
38. Individual Friction
39. Multi-Occurrence Determination
40. Mapper Boundary
41. Mapper Purity
42. Runtime-ID Boundary
43. Acceptance Candidate Validation
44. Preview Regeneration Behavior
45. Replay Result Correlation
46. Durability / Replay Feedback Separation
47. Accessibility
48. Decision Protection Behavior
49. Quarantine Behavior
50. Backup Completeness Limitation
51. Tests Added or Updated
52. SuggestedFix Regression
53. Stale Preview Regression
54. Replay Regression
55. Persistence Regression
56. Reference Audit
57. No-Auto-Accept Audit
58. Runtime-ID Persistence Audit
59. Preview Freshness Audit
60. Persistence Writer Audit
61. Architectural Alignment Assessment
62. Deviations
63. Discoveries and Deferred Work
64. Recommended Next Task
65. Focused Validation
66. Full Validation
67. Final Completion Determination

---

# 164. Required Matrices

## A. SuggestedFix → PlanDecision Matrix

| SuggestedFix action | Try supported? | Accept supported? | PlanDecision kind |
| ------------------- | -------------: | ----------------: | ----------------- |

## B. Acceptance Outcome Matrix

| Store acceptance | Persistence | Replay result | User-facing meaning |
| ---------------- | ----------- | ------------- | ------------------- |

## C. Pending Candidate Invalidation Matrix

| Event | Candidate remains valid? |
| ----- | -----------------------: |

Cover:

* authored edit;
* decision mutation;
* regeneration;
* profile load;
* Backup V1 import;
* Backup V2 restore;
* active recovery;
* second Try.

## D. Workflow Matrix

| Action                |            Preview-only effect | Durable decision effect | Regeneration |
| --------------------- | -----------------------------: | ----------------------: | -----------: |
| Try                   |                            yes |                      no |           no |
| Accept                | transient until store mutation |                     yes |    automatic |
| Retry save            |                             no |         durability only |           no |
| Remove if implemented |                             no |                 removes |    automatic |

## E. Feedback Matrix

Cover:

* accepted/durable/applied;
* accepted/not durable/applied;
* accepted/durable/blocked;
* accepted/outsideWindow;
* stale-before-Accept;
* protected decision surface.

---

# 165. Validation Requirements

Run focused tests for:

* mapper;
* move/skip/duration/priority mapping;
* unsupported actions;
* Try → Accept;
* Try without Accept;
* stale-before-Accept;
* persistence failure;
* retry;
* blocked replay feedback;
* supersession;
* grouped/individual friction;
* protected decision surface;
* quarantine coexistence.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact test-file/test counts.

---

# 166. Completion Criteria

Task 2.36 is complete only when:

* supported SuggestedFix actions map exactly to the four PlanDecision V1 kinds;
* unsupported SuggestedFix actions never expose durable Accept;
* Try remains Preview-only;
* successful Try creates a transient semantic acceptance candidate;
* candidate uses DurableOccurrenceReference V1;
* no runtime ID is persisted;
* move stores canonical user-day/time;
* duration stores exact resulting duration;
* priority stores exact resulting priority;
* skip stores canonical empty payload;
* acceptance requires fresh Preview;
* stale/changed authority invalidates pending acceptance;
* profile/backup/recovery replacement invalidates pending acceptance;
* explicit Accept calls `acceptPlanDecision`;
* successful runtime acceptance automatically regenerates Preview;
* accepted effect comes from replay, not manual Preview mutation;
* persistence failure does not roll back accepted session authority;
* durability failure is visible with Retry;
* Retry does not create a new decision;
* replay result is correlated by accepted decision ID;
* applied/blocked/inapplicable/stale/outsideWindow feedback is factual;
* same-target Accept supersedes prior decision through existing store semantics;
* Try without Accept disappears on regeneration;
* accepted decision survives restart if durably saved;
* protected decision ingress blocks Accept;
* quarantine does not block valid acceptance;
* grouped/individual friction paths are covered;
* multi-target SuggestedFixes are not improperly accepted;
* accessibility is preserved;
* no full decision-management UI is introduced;
* no PlanDecision schema/persistence changes occur;
* no replay semantics change;
* no new decision kind is introduced;
* no Backup V3 is introduced;
* full validation passes;
* result artifact is complete.

---

# 167. Explicit Non-Goals

Do **not**:

* build a decision-management page;
* add decision history;
* add bulk removal;
* add stale-decision browser;
* add direct arbitrary PlanDecision creation UI;
* add multi-target decisions;
* add conflict decisions;
* change PlanDecision persistence schema;
* change replay semantics;
* modify DurableOccurrenceReference V1;
* modify SuggestedFix generation;
* change friction detection;
* implement Backup V3;
* add execution/history;
* auto-accept Try;
* persist Try state;
* persist runtime IDs;
* treat persistence failure as failed runtime acceptance;
* silently retarget stale acceptance;
* broadly redesign Preview UI.

---

# 168. Stop Conditions

Stop and report if:

* current Supported SuggestedFix actions do not contain enough semantic information to construct exact PlanDecision payloads;
* grouped SuggestedFix behavior is inherently multi-target and cannot be represented safely;
* Try revises Preview in a way that cannot be mapped back to canonical user-day/time or exact duration/priority;
* acceptance candidate cannot be lifetime-safe without changing DurableOccurrenceReference;
* fresh-Preview enforcement cannot be implemented without broad workflow redesign;
* automatic regeneration after Accept conflicts with current Preview authority;
* replay result cannot be correlated to accepted decision;
* decision durability feedback cannot be surfaced without a broad UI redesign;
* full-suite failures expose an unrelated architectural regression.

Recommend the narrowest prerequisite or corrective task.

---

# 169. Recommended Follow-On Boundary

If Task 2.36 completes successfully, the next task should **not immediately expand into a large decision manager**.

Recommended next step:

> **Task 2.37 — Audit End-to-End Accepted Planning Authority and Define Decision-Aware Recommendation Policy**

That task should review:

* Try → Accept → persist → regenerate → replay;
* stale/blocked accepted decisions;
* contradictory SuggestedFixes;
* whether accepted decisions should suppress/reshape recommendations;
* minimal decision visibility/removal requirements;
* Backup V3 urgency.

If the acceptance loop is clean, the subsequent implementation task can address recommendation awareness and/or minimal management UX under an explicit contract.

---

# 170. Task Determination

**Authorized:** explicit Try → Accept PlanDecision orchestration for currently supported single-target SuggestedFix actions, transient acceptance-candidate construction, fresh-Preview enforcement, store-owned durable acceptance, automatic regeneration, durability/replay feedback, minimal contextual acceptance status, and narrowly necessary contextual removal if required for reversibility.

**Not authorized:** broad decision management, new PlanDecision kinds, multi-target/conflict decisions, persistence changes, replay changes, DurableOccurrenceReference changes, Backup V3, history, execution tracking, or recommendation-engine redesign.

The governing workflow principle is:

> Try lets the user inspect a temporary planning change. Accept durably records the semantic intent of that tried change against the exact lifetime-safe occurrence, then regeneration proves the accepted decision through the normal deterministic replay pipeline.

---

# 171. Final Completion Statement

**Task 2.36 is complete when DayFrame provides an explicit, fresh-Preview-safe Try → Accept workflow for every currently supported single-occurrence SuggestedFix action that maps exactly to PlanDecision V1; constructs a transient lifetime-safe semantic acceptance candidate without persisting runtime IDs or Preview snapshots; creates durable planning authority only after explicit user Accept; automatically regenerates Preview so the accepted effect is produced by deterministic replay rather than manual revision; preserves accepted session authority through PlanDecision persistence failure while exposing truthful save/retry status; reports applied, blocked, inapplicable, stale, and outside-window replay outcomes separately from durability; invalidates pending acceptance when authoritative inputs change; preserves unsupported authored-edit and multi-target paths as non-acceptable; passes complete regression and repository validation; and introduces no broad decision-management UI, persistence/replay changes, new decision kind, Backup V3, history, or unrelated scheduling behavior.**
