# Task 2.5 — Prevent Suggested-Fix Application Against Stale Preview State

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.5

**Task Name:** Prevent Suggested-Fix Application Against Stale Preview State

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_2.5_PREVENT_SUGGESTED_FIX_APPLICATION_AGAINST_STALE_PREVIEW_STATE_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* stale-preview behavior before and after;
* UI action availability;
* store-boundary rejection;
* `changeFixedTime` behavior;
* fresh-preview behavior preservation;
* stale warning/regeneration guidance;
* preview state preservation;
* authored-state preservation;
* persistence behavior;
* notification behavior;
* direct-store caller protection;
* tests added or updated;
* validation;
* deviations;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding user-owned planning overrides, persistence, new state classes, fix history, new durable formats, automatic regeneration, fix re-identification, or broader engine changes, stop the affected work and record the discrepancy rather than expanding Task 2.5.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Decision;
* Objective;
* UI Safety Contract;
* Store Safety Contract;
* Fresh-Preview Preservation;
* Stale-Preview Preservation;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when suggested-fix actions are unavailable for stale Preview state in the UI, the store independently rejects stale fix application, fresh Preview actions retain their current behavior, stale Preview content remains reviewable with regeneration guidance, and no planning-override, persistence, automatic regeneration, or broader authority behavior is introduced.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity discrepancy for project review.

---

# Purpose

Implement the stale-preview safety contract adopted by Task 2.4.

Task 2.4 established:

> A stale preview is reviewable historical output but is not an actionable base for suggested fixes.

Current behavior allows:

```text
generate preview
    ↓
change authored state
    ↓
preview becomes stale
    ↓
old suggested fix remains enabled
    ↓
store revises obsolete preview
```

That behavior is invalid because the recommendation was derived from authored inputs that are no longer current.

Task 2.5 prevents that execution path at both UI and store boundaries.

---

# Governing Decision

Task 2.4 adopted:

1. suggested fixes remain derived recommendations until user action;
2. stale Preview remains reviewable;
3. stale Preview must not execute suggested fixes;
4. UI controls should be unavailable when stale;
5. store must reject stale application independently of UI;
6. explicit regeneration is required before selecting a replacement recommendation;
7. old friction/fix IDs must not be auto-mapped to a regenerated Preview;
8. no automatic regeneration/revalidation is adopted.

Task 2.5 implements only that safety decision.

---

# Objective

Ensure that:

1. stale Preview still renders;
2. stale warning remains visible;
3. suggested-fix actions are unavailable while stale;
4. `changeFixedTime` follows the same stale rule;
5. fresh Preview suggested-fix actions remain unchanged;
6. `applySuggestedFixToPreview` rejects stale calls directly;
7. rejection does not mutate Preview;
8. rejection does not mutate authored state;
9. rejection performs no persistence;
10. rejection performs no ordinary state notification;
11. no automatic regeneration occurs;
12. no plan-override model is introduced.

---

# Current Behavior

Current stale path:

```text
authored mutation
    ↓
markPreviewStale()
    ↓
preview.isStale = true
    ↓
PreviewScreen shows stale warning
    ↓
suggested-fix buttons remain enabled
    ↓
handler invokes fix
    ↓
store revises obsolete preview
```

Task 2.5 must break the path at both:

```text
UI action boundary
```

and:

```text
store execution boundary
```

---

# Required Behavior After Implementation

```text
authored mutation
    ↓
preview.isStale = true
    ↓
Preview remains visible
    ↓
stale warning remains visible
    ↓
fix actions unavailable
    ↓
user explicitly regenerates
    ↓
new Preview created from current authored state
    ↓
only new fixes may be acted upon
```

---

# UI Safety Contract

`PreviewScreen` must prevent suggested-fix activation when:

```text
preview.isStale === true
```

This applies to every actionable suggested-fix control.

The stale Preview may continue displaying:

* friction points;
* suggested-fix descriptions;
* current derived schedule;
* prior revision metadata;
* existing warning.

But the user must not be able to execute a fix from that stale state.

---

# UI Implementation Preference

Prefer native control disablement where the current UI uses buttons.

For example:

```text
disabled={preview.isStale}
```

or an equivalent centralized condition.

Do not merely hide the control unless the current interaction design strongly requires it.

Keeping the recommendation visible preserves explanatory value while making its non-actionability explicit.

---

# Accessibility

Disabled actions must remain understandable.

Preserve accessible labels.

Do not rely solely on visual styling to indicate unavailability.

If existing HTML `button disabled` semantics are sufficient, prefer them over introducing custom ARIA behavior.

Do not add tooltip infrastructure solely for this task.

---

# Stale Guidance

Preserve the existing guidance:

> Setup changed. Generate a new preview to see updates.

If needed, minimally clarify the stale message so users understand regeneration is required before applying suggestions.

Do not redesign product copy broadly.

No new modal or recovery panel is required.

---

# `changeFixedTime` Safety

Task 2.4 classified `changeFixedTime` as an authored-edit recommendation.

Even though it does not invoke the revision engine in production, it still originates from a stale recommendation.

Therefore:

```text
stale preview
    → Review fixed time action unavailable
```

The user should regenerate first before acting on the new recommendation set.

Do not make `changeFixedTime` a special stale exception.

---

# Store Safety Contract

`DayFrameStore.applySuggestedFixToPreview(...)` must independently reject stale Preview state.

The store must not rely on UI disablement for correctness.

The preferred contract is conceptually:

```text
no preview
    → existing no-preview behavior

preview stale
    → reject / no revision

preview fresh
    → existing revision behavior
```

Use the smallest result shape consistent with the current API.

Do not invent a broad new error system unless required.

---

# Existing Store API Assessment

Inspect the current return type and existing failure/no-op semantics of:

```text
applySuggestedFixToPreview
```

Prefer extending or reusing existing semantics if they can truthfully represent:

```text
stale preview cannot be revised
```

If the method currently returns only state or throws, choose the smallest behavior-preserving adaptation.

Do not add a new global result framework solely for Task 2.5.

---

# No Exception If Avoidable

Prefer a factual rejected/no-op result over throwing for an expected stale-state condition, if the current API already supports non-success outcomes.

Staleness is a known runtime condition, not necessarily a programmer error.

However, do not redesign the entire API to avoid one throw if the existing contract is exception-based.

Document the decision in the result.

---

# Rejection Semantics

A stale store-level application attempt must:

* not call `reviseSchedulePreview`;
* not alter `preview.result`;
* not change `preview.revisedAt`;
* not alter `preview.actionFeedback` unless the existing rejected-operation contract explicitly does so;
* preserve `preview.isStale = true`;
* not change any authored field;
* not persist active state;
* not affect durability status;
* not alter desired durable condition;
* not notify ordinary state subscribers if no state changes.

This is the preferred invariant.

---

# Preview Snapshot Preservation

When rejection occurs, the existing stale Preview should remain exactly reviewable.

Do not:

* clear it;
* regenerate it;
* replace its fixes;
* remove friction;
* change timestamps.

The user should be able to inspect why the old Preview is stale while being directed to regenerate.

---

# Fresh-Preview Preservation

For:

```text
preview.isStale === false
```

preserve current behavior for:

* `moveBlock`;
* `skipBlock`;
* `convertToRecovery`;
* `reduceDuration`;
* `changePriority`;
* `acceptConflict`;
* `changeFixedTime`.

Task 2.5 is not a revision-semantics refactor.

---

# Unsupported `addResource`

Do not change current unsupported behavior for:

```text
addResource
```

unless stale prevention mechanically intercepts it before the unsupported executor.

A fresh direct call to unsupported `addResource` should retain existing behavior.

Do not implement it.

---

# Direct Store Caller Protection

Add direct store coverage proving:

```text
stale preview
    +
applySuggestedFixToPreview(...)
    ↓
no revision
```

This protects future callers that bypass `PreviewScreen`.

The store boundary is the authority enforcement point.

---

# UI Caller Protection

Add UI coverage proving:

```text
stale preview
    ↓
fix controls disabled/unavailable
```

and that user interaction cannot invoke the application callback/store path.

---

# Stale Warning Preservation

Preserve current stale warning visibility.

Do not replace:

```text
stale but reviewable
```

with:

```text
preview removed
```

because Task 2.4 explicitly adopted reviewable historical output.

---

# Regeneration Path Preservation

Existing Generate Preview behavior remains authoritative for returning to actionable state.

After regeneration:

```text
preview.isStale = false
```

and newly generated fix actions become available again.

Add direct coverage where practical.

---

# No Automatic Regeneration

Do not implement:

```text
click stale fix
    ↓
auto regenerate
    ↓
try to locate same fix
    ↓
apply
```

Task 2.4 explicitly rejected this model.

A regenerated recommendation may differ or disappear.

The user must act on the newly generated state.

---

# No Fix-ID Translation

Do not attempt to carry:

```text
frictionId
fixId
```

from stale Preview into a newly generated Preview.

Current IDs are generated identities, not durable semantic commands.

---

# No Authored Mutation

Task 2.5 must not mutate:

* scheduling preferences;
* preview range;
* shift definitions;
* shift cycles;
* block templates;
* block recurrences;
* manual events.

`changeFixedTime` remains navigation-only on fresh Preview and unavailable on stale Preview.

---

# No Planning Override

Do not add:

```text
planOverrides
acceptedFixes
appliedFixes
revisionCommands
```

or any equivalent new authority state.

Task 2.4 identified the need for a later planning-override model, but did not authorize implementation.

---

# No Persistence Changes

Preview revision remains non-durable in the current implementation.

Task 2.5 must not change:

* active persistence payload;
* profile format;
* backup format;
* durability status;
* desired durable condition;
* storage keys;
* versions.

---

# No History

Do not add:

* accepted-fix history;
* command history;
* undo;
* revision log;
* provenance state.

Those remain deferred.

---

# UI Scope

Likely production changes should remain limited to:

* `PreviewScreen`;
* possibly `DayFrameApp` if handler-level safety is needed for `changeFixedTime`;
* store revision boundary.

Avoid broad navigation or workflow changes.

---

# Store Scope

Likely store change:

```text
applySuggestedFixToPreview
```

only.

If stale enforcement requires touching unrelated store mutation methods, stop and document why.

---

# Revision Engine Scope

Prefer not to modify:

```text
reviseSchedulePreview
applySuggestedFix
```

because freshness belongs to the store/state boundary that knows `preview.isStale`.

The pure revision engine receives a preview result and does not own authored-state freshness.

Do not push store lifecycle policy into the core engine without strong evidence.

---

# Responsibility Boundary

Recommended ownership:

```text
PreviewScreen
    → communicates/action-disable state

DayFrameApp
    → routes fresh user actions

DayFrameStore
    → enforces freshness invariant

reviseSchedulePreview
    → assumes caller supplied an actionable current preview result
```

This preserves separation of concerns.

---

# Required UI Tests

## Test 1 — Fresh Preview Fix Is Enabled

Generate/use a fresh Preview with a fix.

Assert the relevant fix control is enabled.

---

## Test 2 — Stale Preview Fix Is Disabled

Mark Preview stale through an authored mutation.

Assert the fix control remains visible but disabled/unavailable.

---

## Test 3 — Stale `changeFixedTime` Is Disabled

Use a stale Preview containing that action.

Assert `Review fixed time` cannot navigate/focus Setup.

---

## Test 4 — Stale Warning Remains Visible

Assert the existing stale message remains.

---

## Test 5 — Regenerate Restores Actionability

From stale state:

```text
regenerate
    ↓
fresh Preview
```

Assert current/new fix controls are actionable again where a fix still exists.

Do not assume the identical old fix survives unless the fixture guarantees it.

---

## Test 6 — Grouped Friction Controls Also Disable

If grouped and individual friction rendering use separate button paths, cover both.

Task 2.4 found both individual and grouped views render fix buttons.

---

# Required Store Tests

## Test 7 — Store Rejects Stale Fix

Create a preview, stale it, call:

```text
applySuggestedFixToPreview
```

directly.

Assert revision is not applied.

---

## Test 8 — Rejection Preserves Preview

Assert:

* result unchanged;
* friction unchanged;
* suggested fixes unchanged;
* `revisedAt` unchanged;
* `isStale` remains true.

Use exact equality/deep equality appropriate to snapshot cloning.

---

## Test 9 — Rejection Preserves Authored State

Capture all seven authored fields before the stale call.

Assert unchanged afterward.

---

## Test 10 — Rejection Does Not Persist

Instrument storage.

Assert no `setItem` or removal occurs due to stale rejection.

Preview revision already should not persist on success; protect the stale path explicitly where useful.

---

## Test 11 — Rejection Does Not Notify Ordinary Subscribers

Subscribe before direct stale call.

Assert zero notifications if the store performs no state transition.

---

## Test 12 — Fresh Direct Store Fix Still Works

Preserve current direct revision behavior for a fresh Preview.

---

# Existing Tests To Preserve

Preserve existing coverage for:

* suggested-fix generation;
* revision actions;
* friction redetection;
* ignored conflict preservation;
* `changeFixedTime` navigation;
* stale Preview warning;
* authored invalidation;
* Preview regeneration;
* no persistence on Preview revision;
* profile/backup replacement;
* durability behavior.

---

# Result Contract Documentation

The Task 2.5 result must state exactly what the store method does on stale application.

Examples:

```text
returns unchanged snapshot
```

or:

```text
returns explicit rejected result
```

or equivalent actual implementation.

Do not leave rejection semantics ambiguous.

---

# Product-Copy Constraint

Task 2.5 may make a minimal stale guidance adjustment if necessary to explain disabled suggestions.

Preferred semantics:

> Setup changed. Generate a new preview to see updates and apply current suggestions.

Exact copy should remain concise and consistent.

Do not redesign all friction/recommendation language.

---

# Accessibility Validation

Confirm:

* disabled actions expose native disabled semantics;
* focus behavior does not misleadingly activate stale suggestions;
* current stale guidance remains perceivable;
* action labels remain intact.

Do not add a new announcement system.

---

# Reference Validation

After implementation confirm:

* stale fix buttons are unavailable;
* grouped stale fix buttons are unavailable;
* stale `changeFixedTime` is unavailable;
* store rejects stale direct calls;
* fresh calls remain functional;
* stale Preview remains visible;
* stale warning remains visible;
* no automatic regeneration exists;
* no fix-ID translation exists;
* no authored mutation occurs;
* no planning override exists;
* no persistence/durable format change exists;
* revision engine remains lifecycle-policy free.

---

# Architectural Alignment Improvement

Before:

```text
stale derived recommendation
    ↓
still executable
```

After:

```text
stale derived recommendation
    ↓
reviewable only
    ↓
regenerate required
```

This establishes freshness as a prerequisite for recommendation execution.

---

# Explicit Non-Goals

Task 2.5 shall not:

* implement planning overrides;
* persist accepted fixes;
* change suggested-fix authority;
* mutate authored intent from automatic fixes;
* add accepted-fix state;
* add command history;
* add undo;
* add provenance;
* auto-regenerate;
* translate stale fix IDs;
* change fix algorithms;
* change friction algorithms;
* implement `addResource`;
* redesign Preview;
* redesign Planner;
* change profiles;
* change backups;
* change durable formats;
* change compatibility readers;
* split state containers;
* refactor scheduling engine architecture;
* update governance documents before project review.

---

# Dependencies

Requires completion and acceptance of:

* Task 2.1 — Establish the Authoritative and Derived State Boundary;
* Task 2.4 — Establish Suggested-Fix and Preview-Revision Authority.

Task 2.2–2.3 startup authority alignment should remain preserved.

Governed by:

* current architecture;
* Phase 1 durability decisions;
* Task 2.4 stale-preview contract.

---

# Expected Files To Change

Likely:

* `code/src/state/dayFrameStore.ts`;
* `code/src/state/tests/dayFrameStore.test.ts`;
* `code/src/ui/PreviewScreen.tsx`;
* `code/src/ui/tests/PreviewScreen.test.tsx`;
* possibly `code/src/ui/DayFrameApp.tsx`;
* possibly `code/src/ui/tests/DayFrameApp.test.tsx`.

Do not expand scope merely because related code is nearby.

---

# Validation Requirements

Run focused tests covering:

* store revision;
* PreviewScreen fix rendering;
* DayFrameApp fix routing if touched;
* stale invalidation/regeneration.

At minimum consider:

```text
src/state/tests/dayFrameStore.test.ts
src/ui/tests/PreviewScreen.test.tsx
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

* focused store test count;
* focused PreviewScreen test count;
* focused UI regression count;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 2.5 specification remained immutable;
* result artifact exists separately;
* no governance document changed;
* no durable format changed.

---

# Documentation Rules

During Task 2.5:

## Create

`TASK_2.5_PREVENT_SUGGESTED_FIX_APPLICATION_AGAINST_STALE_PREVIEW_STATE_RESULT.md`

## Preserve

* Task 2.5 specification;
* Tasks 2.1–2.4 results;
* Phase 1 checkpoint;
* ADRs;
* current governance documentation.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* phase checkpoints.

Those require project review.

Do not create a task-specific checkpoint unless explicitly authorized.

---

# Required Result Artifact Structure

The Task 2.5 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Stale Behavior Before
6. Stale Behavior After
7. UI Action Availability
8. Grouped Friction Action Availability
9. `changeFixedTime` Behavior
10. Store Rejection Contract
11. Store Direct-Caller Protection
12. Stale Preview Preservation
13. Authored-State Preservation
14. Persistence Preservation
15. Notification Preservation
16. Fresh Preview Preservation
17. Regeneration Behavior
18. Stale Guidance
19. Accessibility
20. Revision Engine Boundary
21. Unsupported Action Preservation
22. Tests Added or Updated
23. Reference Validation
24. Architectural Alignment Improvement
25. Deviations
26. Discoveries and Deferred Work
27. Recommended Next Task
28. Validation
29. Final Completion Determination

---

# Expected Architectural Result

Before Task 2.5:

```text
Preview generated from A
    ↓
A changes
    ↓
Preview stale
    ↓
old fix still executable
```

After Task 2.5:

```text
Preview generated from A
    ↓
A changes
    ↓
Preview stale
    ↓
old fix remains visible for review
    ↓
execution blocked
    ↓
Generate Preview
    ↓
new recommendations from current A'
```

No new planning authority is introduced.

---

# Expected Follow-Up

If Task 2.5 completes cleanly, proceed to the larger authority investigation identified by Task 2.4:

> **Task 2.6 — Establish User-Owned Plan Override Semantics**

That task should define:

* occurrence identity;
* override scope;
* base/version relationship;
* invalidation;
* conflict semantics;
* regeneration;
* durability;
* provenance;
* profile/backup boundaries;
* whether ordered history is actually required.

Do not implement plan overrides inside Task 2.5.

---

# Completion Criteria

Task 2.5 is complete when:

* every suggested-fix action is unavailable in stale Preview UI;
* grouped friction actions are also unavailable;
* stale `changeFixedTime` cannot execute;
* store directly rejects stale fix application;
* stale rejection changes no Preview content;
* stale rejection changes no authored state;
* stale rejection performs no persistence;
* stale rejection performs no ordinary state notification;
* stale Preview remains visible;
* stale guidance remains visible;
* explicit regeneration restores fresh actionable recommendations;
* fresh fix behavior remains unchanged;
* revision engine behavior remains unchanged;
* no auto-regeneration or fix translation is introduced;
* no plan-override or authority model is implemented;
* full validation passes.

---

# Task Determination

Task 2.5 is a bounded stale-state safety implementation.

It does not resolve durable suggested-fix acceptance.

Its purpose is to ensure DayFrame never executes a recommendation derived from obsolete authored inputs while preserving stale Preview as reviewable historical output.

**The task is complete when suggested-fix actions are unavailable for stale Preview state in the UI, the store independently rejects stale fix application, fresh Preview actions retain their current behavior, stale Preview content remains reviewable with regeneration guidance, and no planning-override, persistence, automatic regeneration, or broader authority behavior is introduced.**
