# Task 2.21 — Add Explicit Active-Local Recovery Controls and Confirmation

**Project:** DayFrame  
**Phase:** Phase 2 — Authority and State Alignment  
**Task ID:** 2.21  
**Execution Type:** Bounded Implementation  
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing implementation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution results must be recorded separately in:

`TASK_2.21_ADD_EXPLICIT_ACTIVE_LOCAL_RECOVERY_CONTROLS_AND_CONFIRMATION_RESULT.md`

This task authorizes only the UI/workflow integration required to expose the two Task 2.20 store-owned recovery commands.

Do not expand this task into:

- protected-checkpoint raw export;
- recovery artifact formats;
- repair;
- migration;
- source reclassification tooling;
- profile-specific recovery commands;
- backup-specific recovery commands;
- storage-event coordination;
- source incarnation;
- OccurrenceIdentity changes;
- PlanDecision;
- persistence-format changes;
- recovery-history persistence;
- architectural governance changes.

If a required user-facing behavior cannot be implemented truthfully with the existing Task 2.20 store results and ingress status, stop the affected work and record the blocker rather than recreating recovery policy in the UI.

---

# 2. Purpose

Task 2.18 introduced persistent active-local recovery awareness but intentionally made it read-only.

Task 2.19 defined explicit recovery authority.

Task 2.20 implemented two store-owned recovery transactions:

- `replaceProtectedActiveCheckpointWithCurrentState()`;
- `abandonProtectedActiveCheckpointAndReset()`.

Task 2.21 exposes those commands to the user through the existing persistent app-shell recovery surface.

The task must preserve the architecture:

    UI
        → explains current recovery state
        → gathers explicit destructive confirmation
        → invokes one store command
        → presents returned truth

    Store
        → checks eligibility
        → validates/rechecks source
        → performs durable operation
        → reconciles desired/durability/ingress state
        → decides whether recovery completed

The UI must never become the authority for recovery completion.

---

# 3. Governing Task 2.20 Behavior

Task 2.20 established:

- recovery commands are usable only while ingress is `recoveryRequired`;
- current-session replacement uses the latest valid runtime authored state;
- replacement does not change runtime or Preview;
- abandonment removes the protected active key and resets active runtime only after successful removal;
- profiles remain untouched by abandonment;
- both commands recheck the protected durable source;
- `sourceChanged` and `sourceUnreadable` are precondition failures;
- blocking invalid replacement returns `invalidReplacement`;
- real storage failures return `notResolved`;
- only `persisted` resolves replacement;
- only `removed` resolves abandonment;
- failed recovery leaves ingress protection active;
- ordinary retry remains recovery-protected;
- successful recovery changes ingress status and therefore clears persistent recovery awareness reactively;
- no production UI currently calls either command. :contentReference[oaicite:1]{index=1}

Task 2.21 must consume this contract as-is.

---

# 4. Objective

Implement:

1. explicit replacement control;
2. explicit abandonment control;
3. separate confirmations for each;
4. command invocation only after confirmation;
5. immediate workflow-local outcome feedback;
6. reactive persistent-awareness clearing on successful recovery;
7. precise handling of:
   - resolved;
   - notResolved;
   - notAttempted;
8. read/source-change risk communication;
9. no duplicate store policy;
10. direct UI regression tests.

---

# 5. Surface Placement

Add both controls to the existing persistent active-local recovery awareness surface introduced by Task 2.18.

Do not create:

- a second recovery panel;
- a modal destination page;
- a global settings workflow;
- a separate recovery screen.

The current persistent region is already the authoritative cross-navigation place for this session-level condition.

---

# 6. Control Eligibility

Render recovery controls only when active-local ingress status is:

`recoveryRequired`

Do not show them for:

- accepted;
- noSource;
- healthy/no-source startup;
- ordinary durability failures without ingress recovery.

The UI should derive eligibility from retained ingress status, not local workflow guesses.

---

# 7. Replacement Control

Add an explicit control with accessible intent equivalent to:

> Replace protected saved setup with current session

Exact product wording may be refined, but must communicate:

- current session is the replacement source;
- protected saved setup will be overwritten if durable recovery succeeds;
- the action is destructive to the protected checkpoint.

Avoid vague labels such as:

- Save;
- Retry;
- Recover;
- Continue.

---

# 8. Replacement Confirmation

Replacement must require one explicit confirmation before calling the store.

The confirmation must state that:

- DayFrame will attempt to replace the protected saved setup;
- the replacement source is the current session;
- current session may include edits, a loaded profile, or an imported backup;
- successful replacement permanently supersedes the protected checkpoint;
- failed recovery leaves the checkpoint protected.

Do not claim success before the store returns `resolved`.

---

# 9. Replacement Confirmation Scope

Confirmation belongs to the UI workflow.

The store should not receive or persist confirmation text/state.

Do not add confirmation flags to durable/state infrastructure.

---

# 10. Abandonment Control

Add a separate explicit control equivalent to:

> Permanently discard protected saved setup and reset

Exact wording may vary, but it must communicate both consequences:

- protected active checkpoint will be permanently removed if successful;
- current active runtime will reset to safe initial defaults;
- saved profiles are not deleted.

Do not use plain `Clear` because that could be confused with existing `clearLocalData()` semantics.

---

# 11. Abandonment Confirmation

Abandonment requires a stronger destructive confirmation than ordinary recovery replacement.

The confirmation must state:

- the protected saved setup will be permanently discarded if removal succeeds;
- current active setup/session edits will reset;
- saved profiles remain;
- this action is separate from ordinary Clear;
- failure does not reset current runtime.

Do not imply that abandoned historical data can later be restored unless another preserved artifact exists.

---

# 12. Confirmation Model

Use the smallest existing confirmation interaction pattern consistent with DayFrame UI.

Possible forms:

- inline confirmation state;
- existing confirm/cancel pattern;
- semantic confirmation dialog if one already exists.

Do not introduce a new generalized modal framework merely for Task 2.21.

---

# 13. Confirmation Mutual Exclusivity

Only one destructive confirmation should be active at a time.

Entering replacement confirmation clears abandonment confirmation and vice versa.

This prevents ambiguous pending recovery intent.

---

# 14. Cancel Behavior

Cancelling either confirmation:

- invokes no store command;
- changes no ingress status;
- changes no runtime;
- changes no persistence/durability state;
- leaves persistent recovery awareness visible.

Clear only local confirmation state.

---

# 15. Store Command Invocation

Confirmed replacement invokes exactly once:

`replaceProtectedActiveCheckpointWithCurrentState()`

Confirmed abandonment invokes exactly once:

`abandonProtectedActiveCheckpointAndReset()`

Do not call:

- persistence helpers;
- `retryActivePersistence()`;
- `clearLocalData()`;
- profile APIs;
- backup APIs.

---

# 16. No Automatic Recovery

No recovery command may run:

- on mount;
- after ingress notification;
- after profile load;
- after backup import;
- after Setup save;
- after manual-event mutation;
- after storage becomes available;
- after user navigation.

Only confirmed user activation invokes recovery.

---

# 17. Replacement Success Handling

For:

`status: "resolved", resolution: "replaceWithCurrentState"`

the UI should:

- clear local confirmation state;
- render no false secondary recovery state;
- allow the ingress subscription to remove the persistent recovery warning;
- optionally show a concise workflow-local success message if consistent with current app conventions.

Do not manually set ingress status.

Do not navigate automatically unless current product behavior requires it.

---

# 18. Abandonment Success Handling

For successful abandonment:

- confirmation closes;
- runtime state reset arrives through the store's ordinary state notification;
- ingress warning disappears through ingress subscription;
- current screen/workflow state must remain coherent with the reset store;
- do not manually reconstruct defaults in React.

A concise success message may be shown if existing conventions support it.

---

# 19. `notResolved` Handling

A real durable recovery attempt occurred but failed.

The UI must distinguish that from a precondition rejection.

For replacement, possible persistence facts include:

- unavailable;
- storageFailure;
- serializationFailure.

For abandonment:

- unavailable;
- storageFailure.

The persistent recovery warning remains because ingress remains recoveryRequired.

Show a factual immediate message that:

- the recovery operation did not complete;
- the protected checkpoint remains protected;
- current session remains available as appropriate;
- the user may explicitly try again later.

Do not call ordinary Retry.

---

# 20. Replacement Serialization Failure Feedback

For replacement serialization failure, communicate that:

- current session remains available;
- protected checkpoint remains untouched;
- DayFrame could not prepare the current session for durable replacement;
- another explicit recovery attempt is required after the issue is resolved.

Do not expose raw internal type names.

---

# 21. `notAttempted: notRecoveryRequired`

This should normally be rare because the ingress subscription should remove controls when recovery resolves.

If returned because of stale UI timing:

- close pending confirmation;
- do not show an error suggesting data loss;
- allow the current retained ingress truth to drive presentation.

Treat as benign stale action.

---

# 22. `notAttempted: invalidReplacement`

Communicate:

- current session cannot currently be used as the replacement source;
- no protected data was overwritten;
- recovery remains unresolved.

If validation issues can be summarized safely through existing semantic presentation helpers, do so minimally.

Do not expose raw issue codes unless already mapped to user-facing text.

Do not build a full validation diagnostics panel.

---

# 23. `notAttempted: sourceChanged`

This is a significant recovery condition.

Communicate:

- the saved source changed after DayFrame originally detected the recovery problem;
- no overwrite/removal was attempted;
- the current recovery confirmation is no longer sufficient;
- the protected state must be reviewed/reloaded/reclassified before another destructive attempt.

Task 2.20 deliberately leaves reclassification deferred.

Therefore do not immediately offer another destructive retry in the same stale confirmation flow.

Close the confirmation.

---

# 24. `notAttempted: sourceUnreadable`

Communicate:

- DayFrame cannot currently read the protected active source;
- no destructive operation was attempted;
- the source remains protected;
- recovery can be attempted again only after the source can be read.

Do not claim exact source preservation if current ingress status says the original source was unreadable.

---

# 25. Initial Read-Failure Outcome

When initial recovery came from unreadable storage and a later recovery attempt discovers readable bytes, Task 2.20 returns a renewed/source-changed outcome rather than destroying them.

The UI must communicate that newly discovered saved data requires renewed review.

Do not immediately reissue recovery automatically.

---

# 26. Source-Preserved Truth

Use ingress status facts to distinguish:

- readable/preserved source;
- unreadable/unknown source.

Do not claim:

> Your original saved setup is preserved

when `sourcePreserved` is false or equivalent.

Use truthful conditional copy.

---

# 27. Persistent Recovery Awareness Copy

Review Task 2.18's existing read-only warning.

Update only as necessary now that actions exist.

The persistent surface should communicate:

- DayFrame is using safe/current session authority instead of the unsafe saved checkpoint;
- active saving remains protected until recovery succeeds;
- current session edits may be lost on reload/close while unresolved;
- recovery actions are available where appropriate.

Avoid duplicating the full confirmation text in the persistent warning.

---

# 28. Replacement Product Copy

The UI should distinguish:

> current session

from:

> protected saved setup

This is especially important after profile load or backup import.

Do not say:

> Restore profile

unless the store is actually performing profile-specific recovery, which it is not.

---

# 29. Backup/Profile Review Semantics

Task 2.20 established review-then-promote behavior.

No new controls are needed after profile load or backup import.

The persistent recovery replacement action always promotes the current session, regardless of how it was prepared.

This keeps one recovery mental model.

---

# 30. Preview Review Preservation

Replacement does not alter Preview.

If the user has generated/reviewed a Preview before recovery:

- successful replacement leaves it intact.

Do not clear or regenerate it from UI.

---

# 31. Abandonment Preview Behavior

Successful abandonment resets runtime and Preview through the store.

The UI must accept the resulting `preview: null` state normally.

Do not manually clear Preview before store success.

---

# 32. Current Screen After Abandonment

Determine the smallest coherent post-reset UI behavior.

Preferred bias:

- remain in current shell;
- if current screen depends on Preview that is now null, follow existing no-Preview behavior;
- do not invent a recovery-specific navigation unless needed.

Document exact behavior.

---

# 33. Confirmation Pending Across Ingress Transition

If recovery resolves from another source/action while confirmation is open:

- ingress subscription should remove the recovery surface;
- local confirmation state must be cleared or become unreachable;
- no stale confirm button may invoke a command after the surface disappears.

Use effect/state cleanup if necessary.

---

# 34. Store Replacement Lifecycle

If `DayFrameApp` receives a replacement store prop:

- clean up old ingress subscription;
- reset recovery confirmation/outcome state;
- initialize from replacement store status;
- subscribe to replacement store.

Preserve existing durability/store replacement cleanup behavior.

---

# 35. Recovery Outcome Local State

Use workflow-local state only for immediate action feedback.

Possible shape:

- last recovery action;
- result semantic category;
- message.

Do not retain recovery truth locally when ingress status already owns it.

The persistent surface remains derived from store status.

---

# 36. Outcome Clearing

Clear immediate recovery feedback when:

- a new recovery action begins;
- recovery surface disappears after success;
- active store is replaced.

Do not let stale failed-recovery text remain after successful resolution.

---

# 37. Durability Awareness Coexistence

A real failed recovery write can change active durability status while ingress protection remains.

Therefore two persistent truths may coexist:

- recovery-required ingress;
- durability failure awareness.

Review existing UI so these do not contradict each other.

If durability awareness already explains the failed write, recovery immediate feedback may remain concise.

Do not collapse the two status systems.

---

# 38. Retry Control Coexistence

Task 1.37 added ordinary durability Retry for retryable active failures.

During ingress protection, ordinary active retry is recovery-protected and should not become the recovery action.

If persistent durability awareness would otherwise expose active Retry while ingress is recoveryRequired, audit whether the UI already suppresses it based on semantic/result state.

If necessary, suppress the ordinary active durability Retry control while active ingress recovery protection exists.

Do not remove profile durability Retry.

This is important: the user must not be offered a button that the store will reject as lacking recovery authority.

---

# 39. Profile Retry Independence

Profile durability Retry remains eligible according to its own profile status even while active ingress recovery is required.

Do not hide it merely because active recovery exists.

---

# 40. Recovery Control Independence

Replacement and abandonment are not durability retry controls.

Their visibility depends on ingress recoveryRequired, not active durability category.

Even if active durability is unknown, unavailable, or storageFailure, explicit recovery controls remain based on ingress authority.

---

# 41. Button Disable During Synchronous Activation

Store commands are synchronous today.

No long-running loading state is required.

However, avoid double invocation through confirmation UI event structure.

One confirm activation → one command call.

---

# 42. Accessibility — Recovery Region

The existing persistent recovery awareness must remain a labelled semantic region.

Controls must be associated with the correct recovery text.

Do not rely on color alone.

---

# 43. Accessibility — Button Names

Use distinguishable accessible names.

Preferred semantic names:

- `Replace protected saved setup with current session`
- `Abandon protected saved setup and reset`

If visible labels are shorter, accessible names must retain the destructive meaning.

---

# 44. Accessibility — Confirmation

Confirmation controls must clearly identify which action is pending.

Examples:

- `Confirm replace protected saved setup`
- `Cancel replacement`
- `Confirm abandon protected saved setup`
- `Cancel abandonment`

Do not use two generic `Confirm` buttons with ambiguous context when both concepts exist.

---

# 45. Accessibility — Destructive Abandonment

The abandonment action must be distinguishable as destructive in text, not only styling.

No color-only danger indication.

---

# 46. No Aggressive Live Region

Do not add repeated assertive announcements for persistent recovery status.

Immediate action outcome may use existing feedback semantics.

Avoid re-announcing unchanged warning on unrelated rerenders.

---

# 47. No Raw Technical Status Copy

Do not expose literal internal identifiers such as:

- `sourceChanged`;
- `sourceUnreadable`;
- `storageFailure`;
- `serializationFailure`;
- `recoveryRequired`.

Translate them into plain product language.

---

# 48. No Unsupported Cause Claims

For storage failures, do not claim:

- browser privacy mode;
- disk full;
- permission denial;
- user setting;

unless the store actually knows that.

Preserve epistemic integrity.

---

# 49. No Raw Export Control

Do not add:

- Download protected source;
- Export recovery data;
- Copy raw checkpoint.

Task 2.19 recommends that as a later independent capability.

---

# 50. No Repair/Migration Control

Do not add:

- Repair;
- Fix IDs;
- Migrate;
- Convert.

Recovery replacement/abandonment are the only authorized actions.

---

# 51. No Profile/Backup Recovery Button

Do not add:

- Recover from profile;
- Recover from backup.

Existing load/import prepares current session.

Replacement promotes that current session.

---

# 52. No Direct LocalStorage Access

UI must not inspect:

- active key;
- source raw value;
- storage availability.

Use store accessor/status/result only.

---

# 53. No Direct Validation Call Required For Replacement

The store validates current replacement itself.

The UI may not assume current session validity from local form state.

Do not call the validator as a substitute for invoking the store command.

Minimal preflight presentation may be considered later.

---

# 54. Command Result Exhaustiveness

Production handlers must exhaustively branch on all Task 2.20 result variants.

Use discriminated union narrowing.

Do not add a generic fallback that treats unknown result variants as success.

---

# 55. Replacement Handler

Conceptual flow:

    user selects replacement
        ↓
    show confirmation
        ↓
    confirm
        ↓
    call replaceProtectedActiveCheckpointWithCurrentState()
        ↓
    classify result for presentation
        ↓
    store subscriptions handle persistent truth

Do not manually clear recovery warning on `resolved`.

---

# 56. Abandonment Handler

Equivalent:

    user selects abandonment
        ↓
    stronger confirmation
        ↓
    call abandonProtectedActiveCheckpointAndReset()
        ↓
    present result
        ↓
    store subscriptions handle state/ingress truth

---

# 57. Presentation Helper

If result-to-copy mapping becomes nontrivial, introduce a small UI semantic helper.

It may classify:

- replacement resolved;
- abandonment resolved;
- transient durable failure;
- invalid current session;
- saved source changed;
- saved source unreadable;
- stale/no-longer-needed action.

Do not place store policy in the helper.

It maps already-decided results to presentation.

---

# 58. Immediate Replacement Success Copy

If a success message is shown, it should communicate:

> Current session is now the saved active setup.

Avoid claiming historical data was repaired.

---

# 59. Immediate Abandonment Success Copy

If shown:

> Protected saved setup was discarded and active setup was reset.

Mention profiles only if needed:

> Saved profiles were kept.

Do not imply `clearLocalData()` ran.

---

# 60. Failed Replacement Copy

For unavailable/storage failure:

> DayFrame could not complete the replacement. The protected saved setup is still protected, and your current session remains available.

Adjust if source preservation status differs.

Do not say current session was saved.

---

# 61. Failed Abandonment Copy

> DayFrame could not discard the protected saved setup. Your current session was not reset.

This directly reflects Task 2.20 ordering.

---

# 62. Invalid Replacement Copy

> The current session cannot be used as the replacement yet. Nothing was overwritten.

Do not promise automatic repair.

---

# 63. Source Changed Copy

> The saved setup changed since DayFrame detected the recovery problem. Nothing was overwritten. Review the current saved state before trying again.

No automatic reattempt.

---

# 64. Source Unreadable Copy

> DayFrame cannot currently read the protected saved setup, so no destructive recovery was attempted.

Do not claim it is unchanged if unreadable.

---

# 65. Confirmation Copy — Replacement

The confirmation should make explicit:

- current session becomes durable active setup;
- protected checkpoint will be overwritten;
- this cannot be undone through DayFrame unless another saved artifact exists.

Avoid absolute "cannot be undone" if profiles/backups may preserve equivalent data; phrase carefully.

---

# 66. Confirmation Copy — Abandonment

Must communicate:

- protected checkpoint permanently removed;
- current active runtime resets;
- saved profiles remain;
- this action is more destructive than replacement.

---

# 67. Read-Failure Confirmation Eligibility

Task 2.19 says unreadable sources require successful reread and renewed decision.

The UI may still offer recovery controls because store precheck owns final eligibility, but confirmation copy should reflect current ingress uncertainty.

If status says source was unreadable:

- warn that DayFrame could not preserve/read the original source;
- store may refuse the attempt until it can reread it.

Do not disable controls solely based on assumptions unless ingress status provides a definitive eligibility signal.

---

# 68. Confirmation Refresh After SourceChanged

After `sourceChanged`:

- close existing confirmation;
- immediate feedback explains renewed review requirement;
- do not leave a one-click Confirm button armed with stale authority.

This is mandatory.

---

# 69. Confirmation Refresh After SourceUnreadable

Close confirmation after failed precheck.

A later action requires a fresh confirmation.

Do not keep the destructive confirmation armed indefinitely.

---

# 70. Confirmation After Durable Failure

For `notResolved` storage/unavailable/serialization failure:

- close the confirmation;
- user must deliberately choose and confirm again to retry.

This preserves Task 2.19 explicit authority per activation.

Do not provide one-click "Try again" that bypasses reconfirmation unless that control itself re-enters the same confirmation flow.

---

# 71. No Automatic Command Replay

Never re-run the command from:

- durability retry result;
- ingress notification;
- rerender;
- recovered storage availability.

---

# 72. Replacement And Setup Draft

The current session replacement source is committed runtime authority, not unsaved Setup draft state.

If the user has unsaved Setup edits:

- replacement writes current store authority, not draft.

Determine whether existing UI makes this clear enough.

Do not silently commit Setup draft as part of recovery.

If necessary, confirmation copy can say "current saved-in-session setup" or equivalent.

Do not expand recovery into Setup commit.

---

# 73. Manual Event Draft

Same principle.

An unsaved manual-event editor draft is not part of current runtime and will not be promoted.

Do not auto-save drafts before recovery.

---

# 74. Review Before Replacement

The UI may encourage the user to review current session before replacement.

Do not require Preview generation as a technical precondition.

Store validation is authoritative.

---

# 75. Existing Backup Export During Recovery

Current backup export preserves current session, not protected raw source.

Do not label it as:

> Backup the protected setup

No change required unless existing recovery copy could create confusion.

---

# 76. Clear Control During Recovery

Task 2.18 keeps ordinary clear guarded.

If existing clear UI remains visible during active recovery:

- it may still operate according to guarded semantics;
- it must not be presented as abandonment.

If current UI wording could imply it destroys the protected checkpoint, update only enough to avoid confusion.

Do not replace it with recovery abandonment.

---

# 77. Recovery Surface Layout

Keep the recovery controls visually grouped with the active-local recovery entry.

Suggested conceptual hierarchy:

    saved active setup needs recovery
        explanatory text
        [Replace with current session]
        [Abandon and reset]

Then confirmation state appears contextually.

Avoid burying abandonment beside ordinary non-destructive actions without warning.

---

# 78. Both Durability And Recovery Warnings

If active durability awareness and active recovery awareness both render:

- recovery should explain why ordinary save/retry may be constrained;
- durability should remain truthful about real attempts.

Do not merge them into one generic warning in this task.

---

# 79. Recovery Success And Durability Warning

Successful replacement/abandonment sets active durability durable.

Both relevant warnings should disappear reactively if their retained state no longer requires attention.

No manual clearing.

---

# 80. Recovery Failure And Durability Warning

A real failed recovery can produce durability failure plus recoveryRequired.

Both may remain.

Immediate action feedback should avoid repeating all persistent text verbatim.

---

# 81. Profile Durability Warning

Unrelated profile durability warning/control remains independent.

Do not hide or reword it unless layout requires minor coexistence adjustment.

---

# 82. Tests — Recovery Controls Hidden When Healthy

With healthy/no-source/accepted ingress:

- neither recovery action exists;
- no confirmation exists.

---

# 83. Tests — Recovery Controls Visible

With recoveryRequired ingress:

- replacement action visible;
- abandonment action visible;
- accessible names distinct.

---

# 84. Tests — Replacement Confirmation

Activation:

- does not call store command yet;
- shows replacement-specific confirmation;
- confirm calls replacement exactly once;
- cancel calls nothing.

---

# 85. Tests — Abandonment Confirmation

Equivalent with stronger destructive semantics.

---

# 86. Tests — Confirmation Mutual Exclusivity

Open replacement confirmation, then abandonment:

- replacement pending state clears;
- only abandonment confirmation remains.

And inverse if UI permits.

---

# 87. Tests — Replacement Success

Injected/mock store returns resolved replacement and transitions ingress accepted.

Assert:

- command once;
- persistent recovery awareness disappears through subscription/state update;
- confirmation disappears;
- no extra UI persistence operation.

---

# 88. Tests — Abandonment Success

Store command returns resolved abandonment and emits reset state + noSource ingress.

Assert:

- current UI reflects reset store state;
- recovery warning disappears;
- profiles remain displayed/available where relevant;
- confirmation cleared.

---

# 89. Tests — Replacement Storage Failure

Return notResolved/storageFailure.

Assert:

- recovery warning remains;
- confirmation closes;
- immediate failure feedback;
- no ordinary Retry command automatically called.

---

# 90. Tests — Replacement Serialization Failure

Assert recovery remains and message distinguishes preparation problem from storage cause.

---

# 91. Tests — Abandonment Failure

Assert:

- recovery warning remains;
- current runtime UI remains;
- no reset occurred;
- failure feedback truthful.

---

# 92. Tests — Invalid Replacement

Return notAttempted/invalidReplacement.

Assert:

- no success;
- no recovery warning disappearance;
- confirmation closes;
- current session remains.

---

# 93. Tests — SourceChanged

Assert:

- no success;
- confirmation closed;
- warning remains;
- renewed-review feedback visible;
- no automatic second command.

---

# 94. Tests — SourceUnreadable

Assert:

- warning remains;
- confirmation closed;
- feedback says destructive action was not attempted;
- no automatic retry.

---

# 95. Tests — NotRecoveryRequired Race

Start confirmation, transition store to accepted before confirm, then command returns notRecoveryRequired or control disappears.

Assert benign behavior and no false error.

---

# 96. Tests — Explicit Reconfirmation

After real recovery failure:

- activating recovery again reopens confirmation;
- no automatic command occurs until confirmed again.

---

# 97. Tests — Profile Review Then Replace

While recovery-required:

1. load a valid profile;
2. current runtime updates;
3. recovery actions remain;
4. replacement confirmation still describes current session;
5. replacement command invoked only after explicit confirm.

Do not test storage bytes here; Task 2.20 owns those tests.

---

# 98. Tests — Backup Review Then Replace

Equivalent.

---

# 99. Tests — Unsaved Setup Draft Not Auto-Committed

If feasible in existing UI test architecture:

- create unsaved Setup draft;
- invoke replacement;
- assert recovery handler does not call `commitAuthoredSetup`.

This protects authority boundaries.

---

# 100. Tests — Unsaved Manual Event Draft Not Auto-Saved

Likewise ensure recovery does not call `setManualEvents` as preflight.

Add only if practical.

---

# 101. Tests — Active Durability Retry Suppression

If active durability status is retryable while ingress is recoveryRequired:

- ordinary active durability Retry control must not be shown or enabled if it would merely return recoveryProtected.

Profile Retry remains available where applicable.

This is an important integration regression.

---

# 102. Tests — Persistent Awareness Across Navigation

Recovery warning/actions survive ordinary in-app navigation until successful recovery.

Confirmation state may close on navigation according to existing workflow convention; document behavior.

Do not let navigation clear retained recovery truth.

---

# 103. Tests — Store Replacement Cleanup

Injected store replacement:

- unsubscribe old ingress listener;
- clear confirmation/outcome state;
- display new store's recovery status/actions correctly.

---

# 104. Tests — Accessibility

Assert:

- named recovery region;
- distinguishable recovery action names;
- confirmation actions named;
- abandonment destructive meaning present in text;
- no raw technical status labels.

---

# 105. Test Philosophy

UI tests prove:

    user intent
        → confirmation
        → exact store command
        → truthful result presentation

They do not duplicate store transaction tests for:

- bytes;
- source compare;
- persistence ordering;
- durability mapping.

Task 2.20 already owns those.

---

# 106. Production Reference Audit

After implementation search production UI for:

- both recovery store methods;
- active-local recovery status consumers;
- ordinary active durability Retry controls;
- clear behavior;
- recovery confirmation state.

Confirm:

- exactly the intended UI handlers call the recovery commands;
- no automatic caller exists;
- UI never touches localStorage;
- no profile/backup-specific recovery invocation exists.

---

# 107. Expected Files To Change

Likely:

- `code/src/ui/DayFrameApp.tsx`;
- `code/src/ui/tests/DayFrameApp.test.tsx`.

Potentially a small UI semantic presentation helper if needed.

CSS may change only if required for existing UI consistency; avoid redesign.

No store implementation changes should be needed unless a narrow type export/import issue is discovered.

---

# 108. No Store Policy Changes

Task 2.21 must not alter:

- recovery result semantics;
- ingress transitions;
- source recheck;
- desired-condition reconciliation;
- durability semantics;
- persistence helper behavior.

If UI needs information not exposed by current API/status, document the missing contract rather than inferring it.

---

# 109. No Durable Changes

No:

- key;
- schema;
- version;
- persisted confirmation;
- recovery metadata;
- history.

---

# 110. No Governance Changes

Do not update:

- ADRs;
- `CURRENT_STATE.md`;
- `CHANGELOG.md`;
- checkpoints.

Those remain publication/checkpoint work.

---

# 111. Required Result Artifact Structure

The Task 2.21 result must contain at least:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Recovery Surface Placement
6. Control Eligibility
7. Replacement Control
8. Replacement Confirmation
9. Abandonment Control
10. Abandonment Confirmation
11. Confirmation Mutual Exclusivity
12. Cancel Semantics
13. Store Command Invocation
14. Replacement Success Presentation
15. Abandonment Success Presentation
16. `notResolved` Presentation
17. Serialization Failure Presentation
18. Invalid Replacement Presentation
19. Source Changed Presentation
20. Source Unreadable Presentation
21. Not-Recovery-Required Race Handling
22. Confirmation Re-entry After Failure
23. Persistent Awareness Copy
24. Readable / Unreadable Source Distinction
25. Durability Awareness Coexistence
26. Active Durability Retry Suppression
27. Profile Retry Independence
28. Profile Review-Then-Promote UX
29. Backup Review-Then-Promote UX
30. Preview Preservation
31. Abandonment Reset Presentation
32. Unsaved Draft Authority Preservation
33. Navigation Persistence
34. Store Replacement Cleanup
35. Accessibility
36. No Automatic Recovery
37. No Raw Export / Repair Controls
38. Tests Added or Updated
39. Production Reference Audit
40. Store Policy Preservation
41. Durable Format Preservation
42. Architectural Alignment Improvement
43. Deviations
44. Discoveries and Deferred Work
45. Recommended Next Task
46. Validation
47. Final Completion Determination

---

# 112. Validation Requirements

Run focused UI tests first:

    DayFrameApp recovery workflow tests

Then relevant regression sets:

- active ingress awareness;
- durability awareness/retry;
- profile workflow;
- backup workflow;
- clear behavior;
- Setup/manual-event workflow where recovery coexistence is involved.

Then repository-standard validation:

    npm run lint
    npm run typecheck
    npm test
    npm run build

Run:

    git diff --check

Record:

- recovery UI tests added;
- focused UI test count;
- full test-file count;
- full test count;
- lint result;
- typecheck result;
- build result;
- diff-check result;
- task artifact SHA-256;
- specification immutability.

Confirm:

- exactly two explicit UI recovery command call sites;
- no automatic recovery;
- no raw export;
- no recovery artifact format;
- no store policy changes;
- no migration;
- no source incarnation;
- no OccurrenceIdentity changes;
- no PlanDecision;
- no governance changes.

---

# 113. Completion Criteria

Task 2.21 is complete only when:

- recovery actions appear only for active ingress recoveryRequired;
- replacement and abandonment are separate explicit controls;
- both require confirmation before store invocation;
- abandonment confirmation communicates reset and permanent active-checkpoint removal;
- replacement confirmation communicates current-session overwrite;
- one confirmation activation causes exactly one store command invocation;
- cancellation performs no recovery action;
- confirmation states are mutually exclusive;
- resolved replacement clears recovery awareness reactively;
- resolved abandonment clears recovery awareness reactively and reflects store reset;
- real failed recovery keeps persistent recovery awareness;
- failed recovery requires a new explicit confirmation to attempt again;
- invalid replacement is presented without false persistence failure;
- sourceChanged closes stale confirmation and requires renewed review;
- sourceUnreadable communicates that no destructive operation was attempted;
- stale notRecoveryRequired action is benign;
- ordinary active durability Retry is not presented as an alternative recovery path while protection is active;
- profile durability Retry remains independent;
- profile/backup review-then-promote behavior remains intact;
- no unsaved Setup/manual-event draft is implicitly committed;
- UI never clears ingress status itself;
- UI never accesses storage directly;
- no recovery command runs automatically;
- no raw export/repair/migration control exists;
- accessibility requirements are met;
- store result semantics remain unchanged;
- focused and full validation pass;
- immutable task artifact remains unchanged.

---

# 114. Task Determination

Task 2.21 is a bounded recovery-workflow presentation implementation.

Task 2.18 made unsafe historical active data visible and protected.

Task 2.20 made explicit durable recovery transactions executable.

Task 2.21 gives the user the authority to invoke those transactions intentionally.

The workflow must preserve the architecture:

    persistent recovery truth
        ↓
    explicit named user choice
        ↓
    explicit confirmation
        ↓
    exactly one store-owned command
        ↓
    exact returned result
        ↓
    truthful immediate feedback

while:

    store subscriptions
        ↓
    remain the sole authority for
    persistent recovery/durability/state convergence

The UI must never infer that recovery succeeded merely because the user confirmed the action.

**Task 2.21 is complete when DayFrame exposes explicit, accessible, separately confirmed current-session replacement and protected-checkpoint abandonment controls only during active-local recovery; invokes only the two Task 2.20 store-owned commands; presents every resolved, failed, or precondition outcome truthfully; preserves ordinary durability/profile/workflow authority boundaries; and introduces no automatic recovery, raw-source export, repair/migration, source-incarnation, OccurrenceIdentity, PlanDecision, or durable-format behavior.**
