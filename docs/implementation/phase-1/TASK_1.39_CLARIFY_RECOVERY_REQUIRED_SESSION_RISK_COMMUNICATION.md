# Task 1.39 — Clarify Recovery-Required Session-Risk Communication

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.39

**Task Name:** Clarify Recovery-Required Session-Risk Communication

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded UI Communication Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the implementation outcome in a separate result artifact:

`TASK_1.39_CLARIFY_RECOVERY_REQUIRED_SESSION_RISK_COMMUNICATION_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* existing recovery-required communication before implementation;
* active-state recovery-required communication after implementation;
* profile recovery-required communication after implementation;
* session-end risk wording;
* durable-checkpoint wording;
* retry-language preservation;
* reload/close behavior;
* immediate workflow feedback interaction;
* persistent-awareness behavior;
* accessibility;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommendation on whether the Phase 1 durability sequence is complete;
* recommended next task if any;
* final completion determination.

If implementation requires adding recovery controls, reload interception, `beforeunload`, automatic rollback, export promises, repair actions, reset actions, new store APIs, persistence changes, or model-specific diagnostics, stop the affected work and record the discrepancy rather than expanding Task 1.39.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Communication Contract;
* Active-State Communication;
* Profile Communication;
* Reload/Close Risk;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame’s persistent recovery-required awareness clearly communicates that current session changes remain active but are not durably saved, ordinary Retry is unavailable, reload or close can discard those session changes and restore an older durable representation, and no recovery action, reload interception, rollback, export promise, or model-specific repair behavior is introduced.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity discrepancy for project review.

---

# Purpose

Close the final communication gap identified by Task 1.38.

DayFrame already distinguishes:

```text
unavailable
storageFailure
    → retryable

serializationFailure
    → recoveryRequired
```

Task 1.36 made `recoveryRequired` persistently visible.

Task 1.37 correctly suppresses Retry for that state.

Task 1.38 established that the remaining minimum Phase 1 recovery obligation is not repair machinery but accurate communication of the session-end risk.

The user must be able to understand that:

```text
current session state
    = still active

durable persistence
    = not established

ordinary Retry
    = not available

reload / close
    = may discard current session changes

next launch
    = may restore older durable data
```

Task 1.39 makes that consequence explicit.

---

# Architectural Context

Task 1.38 established two simultaneously valuable representations after serialization failure:

```text
latest current session intent
+
last successfully durable checkpoint
```

The current runtime representation remains authoritative for the active session.

The prior durable representation remains preserved because serialization failure occurs before successful durable replacement.

Therefore reloading or closing the application may cause:

```text
latest session intent
    ↓ lost with session

older durable checkpoint
    ↓ rehydrates later
```

That behavior must not be described as harmless.

---

# Governing Evidence

Task 1.38 established:

> Serialization failure must never destroy or overwrite the last successfully durable representation.

It also established:

> Recovery begins from a session in which the user's latest runtime intent may still be available even though the last durable checkpoint is older.

And:

> Reload is a rollback-by-session-loss, not recovery.

Task 1.38 selected:

**Option B — Minimal Safe Recovery Boundary**

with these Phase 1 obligations:

* retain persistent recovery-required awareness;
* keep ordinary Retry absent;
* preserve runtime intent;
* preserve the durable checkpoint;
* keep the session usable;
* allow ordinary edits to converge naturally;
* explicitly communicate reload/close/session-loss risk;
* add no current-schema repair system.

Task 1.39 implements only that communication requirement.

---

# Objective

Update persistent recovery-required communication so that it accurately conveys:

1. current session changes remain active;
2. those changes are not durably saved;
3. ordinary Retry is unavailable;
4. reload can discard the current non-durable session changes;
5. closing DayFrame can likewise discard them;
6. an older durable representation may return on the next load;
7. this is a risk statement, not a claim that loss has already occurred;
8. active authored state and saved profiles remain distinguishable;
9. no recovery action is added;
10. no reload interception is added.

---

# Communication Scope

Task 1.39 applies only to persistent:

```text
recoveryRequired
```

awareness.

Do not revise the ordinary retryable messaging for:

```text
retryableUnavailable
retryableStorageFailure
```

unless a tiny adjacent wording change is mechanically necessary.

The main target is serialization-failure communication.

---

# Current Recovery-Required Communication

Task 1.36 currently uses wording equivalent to:

## Active

> Active setup is available for this session, but could not be prepared for durable storage. Ordinary retry is not currently available.

## Profiles

> Saved profiles are available for this session, but could not be prepared for durable storage. Ordinary retry is not currently available.

Those statements are accurate but incomplete.

They do not communicate the key consequence established by Task 1.38:

```text
reload / close
    → current session-only changes may disappear
```

Task 1.39 should extend, not redesign, that communication.

---

# Communication Contract

Recovery-required messaging must communicate four semantic facts.

## Fact 1 — Session Continuity

The current runtime representation remains available now.

Do not imply the current change failed entirely.

## Fact 2 — Lack of Durability

The current representation has not been durably saved.

## Fact 3 — Retry Unavailable

Ordinary Retry is not currently appropriate.

## Fact 4 — Session-End Risk

Reloading or closing DayFrame may discard the current session-only representation and allow an older durable representation to return.

---

# Wording Standard

Use concise, plain-language wording.

Avoid infrastructure terminology such as:

* serialization;
* JSON;
* checkpoint;
* snapshot;
* persisted payload;
* desired durable condition.

Those are architecture vocabulary, not product language.

Allowed conceptual wording includes:

```text
These changes are still available in this session,
but they could not be saved permanently.

Reloading or closing DayFrame may lose these session changes
and restore an older saved version.
```

Exact final wording should fit current UI style.

---

# No False Data-Loss Claim

Do not say:

```text
Your changes will be lost.
Your data has been lost.
Your saved data is corrupted.
```

The correct epistemic statement is:

```text
may be lost on reload/close
```

because the current session is still active.

---

# No Recovery Guarantee

Do not say:

```text
You can recover this later.
Your old version is definitely available.
```

Task 1.38 established that an older durable checkpoint **may** exist, or defaults may rehydrate if no checkpoint exists.

Use wording that does not promise a specific recovery source.

---

# Older Durable Representation Wording

Where communicating what may return after reload, prefer a concept such as:

```text
an older saved version
```

rather than:

```text
the last checkpoint
```

unless existing product vocabulary already exposes checkpoint terminology.

For active state, “older saved setup” may be appropriate.

For profiles, “older saved profile list” or equivalent may be appropriate.

Choose the least confusing phrase consistent with current product language.

---

# Active-State Communication

For active recovery-required status, future wording must communicate:

* current active setup/session data still applies now;
* it could not be durably saved;
* ordinary Retry is unavailable;
* reload/close may discard those current session changes;
* older saved active data may return.

Do not imply that every authored field necessarily changed during the failing operation.

The persistent surface represents the active durability surface as a whole.

---

# Profile Communication

For profile recovery-required status, wording must communicate:

* current runtime profile collection remains available in the session;
* the latest save/delete changes are not durably established;
* ordinary Retry is unavailable;
* reload/close may discard those session-only profile changes;
* an older saved profile collection may return.

This is particularly important because:

```text
failed profile save
    → runtime profile may disappear after reload

failed profile delete
    → older durable profile may reappear after reload
```

Do not attempt to identify which profile changed unless the store actually retains that information, which it does not.

---

# Surface-Specific Language

Keep active and profiles distinguishable.

Do not replace both with one generic:

```text
Some data may be lost.
```

The user should know whether the unresolved durability risk concerns:

* current active setup/data;
* saved profiles;
* or both.

---

# Both Surfaces Recovery Required

If both surfaces are `recoveryRequired`, both entries should communicate their own risk.

Do not collapse them into a single generic session-loss warning if that loses surface identity.

A shared container remains appropriate.

---

# Retry Control Preservation

Task 1.37 established:

```text
recoveryRequired
    → no Retry control
```

Preserve this exactly.

Task 1.39 must not add Retry merely because the warning becomes more explicit.

---

# Retryable Failure Communication Preservation

For:

```text
retryableUnavailable
retryableStorageFailure
```

existing Retry controls and wording remain unchanged unless required by a minimal consistency adjustment.

Do not add reload/close warnings to every transient retryable failure unless Task 1.38 evidence specifically justifies it.

Task 1.39 is about `recoveryRequired`.

---

# Why Recovery-Required Gets Stronger Communication

`serializationFailure` differs because:

```text
ordinary unchanged Retry is blocked
```

and the current session may contain the only copy of the newest representation.

This creates a stronger session-end risk than an ordinary transient persistence failure with an immediately available Retry path.

Task 1.39 should reflect that distinction without becoming alarmist.

---

# Reload Communication

Explicitly include:

```text
reload
```

or equivalent common-language terminology.

Do not rely on users inferring that closing the browser destroys in-memory state.

---

# Close Communication

Explicitly include:

```text
close DayFrame / close this tab or window
```

or an equivalent phrase appropriate to the current app environment.

Do not attempt to enumerate every browser lifecycle event.

---

# No `beforeunload`

Task 1.38 explicitly determined browser unload interception is premature.

Do not add:

* `beforeunload`;
* browser confirmation prompts;
* page-leave blocking;
* unload listeners;
* navigation guards.

This task communicates risk only.

---

# In-App Navigation

Do not warn against ordinary in-app navigation.

Task 1.36 persistent awareness survives workflow navigation.

The risk concerns ending/reloading the application session, not switching between DayFrame workflows.

---

# Session-First Usability Preservation

Do not disable editing because recovery-required exists.

The user may continue modifying current runtime data.

A later ordinary mutation may remove the unserializable value and persist successfully.

If that occurs:

```text
retained durability → durable
    ↓
persistent recovery-required awareness disappears
```

Existing subscription behavior remains authoritative.

---

# Natural Recovery Through Editing

Task 1.39 may communicate, if concise and supported, that continuing to edit is allowed.

Do not promise that editing will repair the issue.

Avoid wording like:

```text
Edit something and this will be fixed.
```

Current diagnostics cannot identify the problematic value.

---

# No Repair Guidance

Do not instruct users to:

* delete a shift;
* remove a manual event;
* edit metadata;
* rebuild a profile;
* re-enter a recurrence.

Task 1.38 specifically deferred current-model repair guidance.

---

# No Export Promise

Do not recommend:

```text
Export a backup now.
```

Task 1.38 established that the same bad authored value may prevent backup serialization.

Task 1.39 must not present backup export as a guaranteed escape path.

---

# No Profile-Save Escape Promise

Do not recommend saving current active state as a profile.

Task 1.38 found the same authored representation may make profile persistence fail too.

---

# No Reload-as-Recovery Guidance

Never suggest:

```text
Try refreshing.
Restart DayFrame.
```

after recovery-required state.

Task 1.38 classified reload as rollback-by-session-loss, not recovery.

---

# No Clear/Reset Guidance

Do not suggest clear/reset as normal recovery.

Those actions may destroy current session intent and durable checkpoints.

---

# No Rollback Control

Do not add:

* Restore previous version;
* Revert;
* Reload saved state.

Those require separately designed preservation/consent semantics.

---

# No Recovery Panel Yet

Task 1.38 recommended a dedicated recovery explanation/panel only **if recovery choices are later added**.

Task 1.39 does not create one.

The existing persistent awareness surface is sufficient for this communication-only task.

---

# Product Copy Scope

Task 1.39 may modify only the recovery-required persistent copy needed to communicate session risk.

Do not rewrite:

* Setup success messages;
* profile success messages;
* retryable failure messages;
* clear messages;
* retry button labels;
* broader application copy.

---

# Recommended Copy Shape

Exact wording is implementation-dependent, but a concise two-part structure is preferred.

Example conceptual structure:

```text
Active setup is still available in this session,
but it could not be durably saved and ordinary Retry is unavailable.

Reloading or closing DayFrame may discard these session changes
and restore an older saved version.
```

Profiles equivalent:

```text
Saved-profile changes are still available in this session,
but they could not be durably saved and ordinary Retry is unavailable.

Reloading or closing DayFrame may discard these session changes
and restore an older saved profile collection.
```

Do not copy these verbatim if current UI style suggests clearer wording.

---

# Persistent Surface Behavior

The warning remains:

* persistent across in-app navigation;
* non-dismissible;
* reactive to retained durability.

Task 1.39 changes only its semantic content.

---

# Automatic Clearing

When a subsequent ordinary mutation succeeds and retained durability becomes:

```text
durable
```

the recovery-required warning and session-risk communication disappear through the existing subscription.

No special recovery-complete state is added.

---

# Recovery Completion Preservation

Task 1.38 established:

```text
recovery completes
    when a changed/replaced representation
    persists successfully
```

No new `recovered` status or success banner is required.

Task 1.39 must preserve that.

---

# Immediate Workflow Feedback

Task 1.35 local `recoveryRequired` feedback may coexist with the persistent session-risk message.

Task 1.39 does not need to duplicate the full reload/close warning into every immediate workflow message.

The persistent shell is the authoritative long-lived risk communication.

---

# Semantic Classifier Preservation

Keep using:

```text
recoveryRequired
```

from Task 1.34.

Do not raw-switch on:

```text
serializationFailure
```

inside UI merely to choose copy if the existing semantic classification already drives the branch.

---

# No New Semantic Category

Do not introduce:

```text
sessionAtRisk
dataLossRisk
reloadUnsafe
```

into the shared semantic layer unless current implementation absolutely requires it.

Task 1.38 determined session risk is a communication consequence of `recoveryRequired`, not a new durability fact.

---

# Accessibility

Ensure the additional risk information:

* is included in the existing named persistent region;
* is textual, not color-only;
* remains available to assistive technology;
* does not introduce repeated live announcements on unrelated renders.

No new alert system is required.

---

# Information Hierarchy

The user should be able to understand, in order:

1. which surface has a problem;
2. that current session data still exists;
3. that it is not durably saved;
4. that Retry is unavailable;
5. that reload/close may discard it.

Avoid burying the session-end risk after excessive technical explanation.

---

# Message Length

Keep the persistent warning concise enough to remain usable as an app-level surface.

Do not turn it into a recovery manual.

A short secondary sentence or subordinate line for session risk is preferred.

---

# Current Session Versus Historical Operation

Persistent communication must remain about **current retained risk**.

Do not mention:

```text
Your last Setup save...
Your profile delete...
Your backup import...
```

because the app-level surface does not retain operation history.

---

# Active Warning Example Semantics

Allowed semantic meaning:

```text
Current active changes are still available now.
They are not durably saved.
Retry is unavailable.
Reload/close may return you to older saved data.
```

---

# Profile Warning Example Semantics

Allowed semantic meaning:

```text
Current saved-profile changes are still available now.
They are not durably saved.
Retry is unavailable.
Reload/close may return the profile collection to an older saved state.
```

---

# Required Tests

Add/update focused UI tests.

## Test 1 — Active Recovery Required Includes Session Continuity

Cause active recovery-required state.

Assert persistent communication indicates current/session changes remain available.

---

## Test 2 — Active Recovery Required States Non-Durability

Assert the warning makes clear the current active representation is not durably saved.

---

## Test 3 — Active Recovery Required States Retry Unavailable

Preserve or update coverage proving no Retry control exists and communication reflects that ordinary Retry is unavailable.

---

## Test 4 — Active Recovery Required States Reload Risk

Assert persistent communication explicitly mentions reload/refresh risk.

Use wording-level assertion appropriate to the final copy.

---

## Test 5 — Active Recovery Required States Close Risk

Assert closing/end-of-session risk is communicated.

---

## Test 6 — Active Recovery Required Mentions Older Saved Data

Assert wording communicates that an older saved representation may return.

Do not require internal word `checkpoint`.

---

## Test 7 — Profile Recovery Required Includes Session Continuity

Assert current profile changes remain available for the session.

---

## Test 8 — Profile Recovery Required States Session-End Risk

Assert reload/close may discard session-only profile changes.

---

## Test 9 — Profile Recovery Required Mentions Older Saved Profiles

Assert an older saved profile representation may return.

---

## Test 10 — Retryable Failure Copy Remains Unchanged

For active/profile retryable storage failure or unavailable state, assert the Task 1.36/1.37 ordinary retryable path remains intact and still offers Retry.

Task 1.39 must not accidentally turn transient failure into recovery-required messaging.

---

## Test 11 — No Recovery Action

Recovery-required warning contains:

```text
no Retry
no Restore
no Reset
no Export
no recovery button/link
```

Use robust accessibility queries.

---

## Test 12 — No Reload Interception

Reference/source validation should establish no `beforeunload`/navigation-blocking behavior was added.

Do not try to simulate browser unload unless needed.

---

## Test 13 — Persistent Across Navigation

Preserve Task 1.36 behavior: recovery-required risk communication remains across in-app navigation.

---

## Test 14 — Clears After Natural Convergence

Cause recovery-required state, then perform a subsequent ordinary mutation that successfully establishes durability using an appropriate injected fixture seam.

Assert the persistent risk message disappears.

If manufacturing this end-to-end through UI would require invalid production fixture corruption, use the existing safe retained-status test seam and preserve store-level convergence coverage.

---

## Test 15 — Both Surfaces Remain Distinguishable

With both active and profiles recovery-required, assert both session-risk entries remain distinguishable.

---

# Existing Tests to Preserve

Preserve:

* Task 1.35 immediate semantic tests;
* Task 1.36 persistent-awareness tests;
* Task 1.37 retry eligibility tests;
* Task 1.38 lower-level behavior evidence.

Do not rewrite the subsystem merely to make copy tests easier.

---

# Testing Strategy

Prefer existing UI status injection mechanisms for `recoveryRequired`.

Do not corrupt production data models simply to cause real serialization failure if Task 1.38 already established that the production path is defensive.

This task tests communication, not serialization reachability.

---

# Expected Files to Change

Likely:

* `code/src/ui/DayFrameApp.tsx`;
* `code/src/ui/tests/DayFrameApp.test.tsx`.

Possibly a dedicated persistent-awareness component if Task 1.36 extracted one.

No store file is expected to change.

No semantic classifier file is expected to change.

No CSS change should be necessary unless the longer risk copy needs a tiny existing-layout adjustment.

---

# Reference Validation

After implementation verify:

* recovery-required active copy communicates session continuity;
* active copy communicates non-durability;
* active copy communicates Retry unavailability;
* active copy communicates reload/close risk;
* active copy allows for older saved data returning;
* profile copy communicates equivalent profile-specific risk;
* retryable failure copy/control remains distinct;
* no Retry exists for recovery-required;
* no recovery action exists;
* no unload interception exists;
* no reload/navigation blocking exists;
* no reset/export/rollback guidance exists;
* no desired-condition exposure exists;
* persistent behavior remains store-driven;
* no new semantic category exists;
* no store API or persistence behavior changed;
* no durable format changed.

---

# Explicit Non-Goals

Task 1.39 shall not:

* implement recovery;
* add recovery buttons;
* add Retry for recovery-required;
* add rollback;
* add revert;
* add reset;
* add clear-as-recovery;
* add backup-export recovery;
* promise profile save as recovery;
* add diagnostics;
* expose raw exceptions;
* identify offending fields;
* add `beforeunload`;
* add unload prompts;
* block refresh;
* block browser close;
* block in-app navigation;
* add automatic retry;
* change store APIs;
* change retry semantics;
* change durability subscription;
* change retained durability;
* change desired durable condition;
* change `DayFrameState`;
* change persistence helpers;
* change durable schemas;
* change storage keys;
* increment versions;
* modify migrations;
* remove compatibility readers;
* redesign broader DayFrame UX;
* implement authored-model-specific recovery;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.34 — shared durability semantics;
* Task 1.36 — persistent app-level durability awareness;
* Task 1.37 — user-triggered retry with recovery-required suppression;
* Task 1.38 — serialization-failure recovery semantics and Phase 1 minimum obligation.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

---

# Evidence Standards

Communication may state:

```text
current session changes remain available
```

because Task 1.38 confirmed session-first runtime preservation.

Communication may state:

```text
reload/close may lose those current changes
```

because non-durable runtime state exists only in the current store instance.

Communication may state:

```text
older saved data may return
```

because the prior durable representation is preserved when serialization fails.

Communication may **not** state:

```text
data definitely will be lost
the old version definitely exists
the data is corrupted
```

because those claims exceed current evidence.

---

# ADR Alignment

Task 1.39 should improve:

* user-data risk transparency;
* recovery safety;
* session/durability distinction;
* non-destructive recovery posture;
* epistemic integrity.

It should not increase implementation coupling to the current authored model.

---

# Validation Requirements

Run focused UI tests covering:

* active recovery-required wording;
* profile recovery-required wording;
* reload/close risk;
* older saved-data semantics;
* no Retry;
* no recovery actions;
* retryable-state preservation;
* cross-navigation persistence;
* convergence clearing;
* both-surface distinction.

Then run relevant regression tests:

```text
src/state/durabilitySemantics.test.ts
src/state/tests/dayFrameStore.test.ts
src/ui/tests/DayFrameApp.test.tsx
```

Then run:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```text
git diff --check
```

for affected scope.

Record:

* focused UI test count;
* semantic/store/UI regression count;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 1.39 specification remained immutable;
* result artifact exists separately;
* no recovery controls exist;
* no unload interception exists;
* no store behavior changed;
* no durable format changed.

---

# Documentation Rules

During Task 1.39:

## Create

* `TASK_1.39_CLARIFY_RECOVERY_REQUIRED_SESSION_RISK_COMMUNICATION_RESULT.md`

## Preserve

* Task 1.39 specification;
* Tasks 1.23–1.38 results;
* durable-data ADR;
* architecture/governance documentation;
* checkpoints and historical artifacts.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* durable-data ADR;
* Session Checkpoint.

Those require project review.

Do not create a task-specific checkpoint.

---

# Required Result Artifact Structure

The Task 1.39 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Prior Recovery-Required Communication
6. Updated Communication Contract
7. Active-State Session Continuity
8. Active-State Non-Durability
9. Active-State Retry Unavailability
10. Active-State Reload Risk
11. Active-State Close Risk
12. Active-State Older-Saved-State Risk
13. Profile Session Continuity
14. Profile Non-Durability
15. Profile Retry Unavailability
16. Profile Reload/Close Risk
17. Profile Older-Saved-State Risk
18. Surface Distinction
19. Retryable-Failure Preservation
20. No Recovery Action
21. No Reload Interception
22. Persistent-Awareness Preservation
23. Natural Convergence Clearing
24. Immediate-Feedback Coexistence
25. Accessibility
26. Product Copy
27. Tests Added or Updated
28. Reference Validation
29. ADR Alignment Improvement
30. Deviations
31. Discoveries and Deferred Work
32. Phase 1 Durability Sequence Completion Assessment
33. Recommended Next Task
34. Validation
35. Final Completion Determination

---

# Phase 1 Durability Sequence Completion Assessment

The result artifact must explicitly answer:

> **After Task 1.39, is any additional durability implementation required before Phase 1 can return to the next architectural-alignment domain?**

Decision standard:

If Task 1.39 closes the minimum communication obligation established by Task 1.38, and no new blocking discrepancy is discovered, recommend:

```text
Phase 1 durability alignment sequence
    → complete for now
```

with model-specific serialization repair, unload protection, recovery tooling, migration implementation, and future durable-schema changes deferred to their appropriate architectural stage.

Do not invent another durability task merely to continue the sequence.

---

# Expected Architectural Result

Before Task 1.39:

```text
serializationFailure
    ↓
persistent recovery-required warning
    ↓
Retry unavailable
but
session-end consequence is implicit
```

After Task 1.39:

```text
serializationFailure
    ↓
persistent recovery-required warning
    ↓
current session data still active
    +
not durably saved
    +
ordinary Retry unavailable
    +
reload/close may lose session changes
    +
older saved data may return
```

No recovery machinery is added.

---

# Expected Follow-Up

If Task 1.39 completes cleanly and finds no blocking durability discrepancy, the preferred outcome is:

> **Conclude the Phase 1 durability alignment sequence and return to the next unresolved architectural-alignment domain.**

The result should identify that domain from the existing Phase 1 execution plan/current findings rather than automatically creating Task 1.40 as another durability task.

If a concrete blocking issue is discovered, recommend only the smallest dependency-correct follow-up.

---

# Completion Criteria

Task 1.39 is complete when:

* persistent active recovery-required communication states that current session changes remain available;
* it states those changes are not durably saved;
* it states ordinary Retry is unavailable;
* it states reload can discard those session changes;
* it states closing DayFrame can discard those session changes;
* it communicates that older saved data may return;
* equivalent profile-specific communication exists;
* active/profile risks remain distinguishable;
* retryable unavailable/storage-failure communication remains distinct;
* Retry remains absent for recovery-required;
* no recovery action is added;
* no export/reset/rollback promise is added;
* no unload interception is added;
* no in-app navigation blocking is added;
* persistent cross-navigation awareness remains intact;
* successful later persistence still clears the warning reactively;
* no new semantic category is introduced;
* no store behavior changes;
* no durable schema/key/version changes;
* focused tests protect the new risk communication;
* full validation passes;
* the result explicitly determines whether the Phase 1 durability sequence can now stop.

---

# Task Determination

Task 1.39 is a bounded communication implementation.

It does not implement recovery mechanics.

Its purpose is to complete the minimum safe Phase 1 recovery boundary established by Task 1.38 by ensuring that users are told the consequence of keeping important state only in the current session.

**The task is complete when DayFrame’s persistent recovery-required awareness clearly communicates that current session changes remain active but are not durably saved, ordinary Retry is unavailable, reload or close can discard those session changes and restore an older durable representation, and no recovery action, reload interception, rollback, export promise, or model-specific repair behavior is introduced.**
