# Task 2.15 — Implement Authored-Snapshot Validation and Current-Mutation Rejection

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.15
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

`TASK_2.15_IMPLEMENT_AUTHORED_SNAPSHOT_VALIDATION_AND_CURRENT_MUTATION_REJECTION_RESULT.md`

This task authorizes one bounded validation-and-store-contract implementation.

Do not expand it into:

* historical local-state recovery;
* profile recovery;
* backup recovery;
* source incarnation;
* durable occurrence references;
* PlanDecision;
* recurrence implementation;
* broad validation UX;
* architecture/governance updates.

If the required implementation cannot be completed without one of those areas, stop the affected work and record the dependency rather than broadening scope.

---

# 2. Purpose

Task 2.14 established DayFrame's authored-snapshot validation authority and acceptance contract.

DayFrame currently accepts caller-proposed authored mutations without first proving that the resulting complete `DayFrameAuthoredSetup` is semantically valid enough to become current runtime authority.

Task 2.14 adopted:

```
workflow proposes mutation
    ↓
store derives complete candidate authored snapshot
    ↓
shared pure authored-domain validator
    ↓
valid
    → apply

invalid
    → reject before state transition
```

Task 2.15 implements that contract for **current authored mutations only**.

Historical durable ingress remains governed by separate compatibility/recovery work.

---

# 3. Governing Decisions

Task 2.14 established:

1. `DayFrameAuthoredSetup` is the semantic validation boundary.
2. One pure shared authored-domain validator owns validation truth.
3. The store owns enforcement for proposed current authority.
4. Setup may later use the same validator for preflight.
5. Historical ingress may reuse validation facts but must not use current-mutation rejection policy blindly.
6. Complete resulting authored state must be validated.
7. Invalid proposed state must never become runtime/session authority.
8. Rejection must occur before:

   * Preview invalidation;
   * state assignment;
   * persistence;
   * desired durable-condition changes;
   * durability-status changes;
   * state notifications;
   * durability notifications.
9. Validation rejection is separate from persistence failure.
10. Validation returns deterministic issue collections.
11. Store mutation results must distinguish:

    * applied;
    * rejected.
12. Unsupported declared recurrence intent is advisory, not blocking invalid state.
13. Templates without recurrences are valid dormant authored state.
14. Multiple recurrences may reference one template.
15. Inactive cycle-mode data remains authored data and must remain coherent.
16. Historical invalid data must not be silently repaired, remapped, discarded, or overwritten.

Task 2.15 implements only the current-authoring portion.

---

# 4. Objective

Implement:

1. shared pure `DayFrameAuthoredSetup` validation;
2. deterministic validation issue types/codes;
3. complete candidate derivation for every current authored mutation;
4. blocking validation before mutation;
5. advisory preservation for accepted unsupported authored intent;
6. applied/rejected store mutation results;
7. production caller adaptation;
8. rejection side-effect guarantees;
9. valid-mutation regression preservation.

Do not implement historical ingress enforcement or recovery.

---

# 5. Authorized Production Scope

Expected areas include:

* shared authored validation module;
* validation tests;
* store mutation result types;
* `dayFrameStore.ts`;
* store tests;
* immediate production mutation callers requiring result branching;
* minimal Setup/manual-event caller handling needed to preserve behavior and type safety.

Potential UI changes must remain semantic-minimum adaptations only.

Do not turn Task 2.15 into a validation-presentation redesign.

---

# 6. Shared Validator

Introduce one pure semantic validator equivalent to:

```
validateDayFrameAuthoredSetup(authoredSetup)
```

It must:

* read only explicit input;
* perform no mutation;
* perform no persistence;
* inspect no local storage;
* inspect no store infrastructure;
* inspect no UI state;
* produce deterministic semantic facts.

The exact function/module name may follow repository conventions.

---

# 7. Validator Input

Use:

`DayFrameAuthoredSetup`

as the complete semantic input.

Do not create a competing authored snapshot shape unless TypeScript mechanics require a narrow alias that is structurally equivalent.

Saved profiles, Preview, durability state, workflow state, and listener state are not validator input.

---

# 8. Validation Result

Implement a deterministic result equivalent to:

```
valid:
    {
      status: "valid",
      advisories: [...]
    }

invalid:
    {
      status: "invalid",
      issues: [...],
      advisories: [...]
    }
```

The exact naming may vary, but the contract must preserve:

* blocking issues;
* nonblocking advisories;
* deterministic issue collection.

Do not reduce to a boolean.

---

# 9. Validation Issue Shape

Each issue should minimally provide stable semantic information such as:

* stable `code`;
* classification:

  * invalid;
  * unsupported/advisory;
* source kind or semantic path;
* relevant source/reference ID where applicable.

Avoid embedding product copy in domain validation issues.

The issue model is semantic, not presentational.

---

# 10. Stable Issue Codes

Create a bounded stable code vocabulary sufficient for the adopted Task 2.14 rules.

Do not create a generic validation framework.

Likely issue families include:

* duplicate source ID;
* duplicate nested work-entry ID;
* missing source reference;
* cycle containment mismatch;
* invalid date range;
* overlapping cycle;
* overlapping segment;
* invalid sequence offsets;
* invalid template;
* invalid recurrence parameter;
* unsupported recurrence frequency;
* invalid scheduling preference;
* invalid preview range;
* invalid manual event.

Use more precise codes where they materially improve testing or caller interpretation.

---

# 11. Deterministic Issue Ordering

Validation output must be deterministic.

Prefer:

1. stable rule-family order;
2. authored collection order;
3. source/reference order where applicable.

Equivalent input must produce structurally equal validation results.

Do not rely on incidental `Map`/`Set` iteration where semantic ordering is not obvious.

---

# 12. Top-Level ID Uniqueness

Blocking validation must enforce unique non-empty IDs within:

* `shiftDefinitions`;
* `shiftCycles`;
* `blockTemplates`;
* `blockRecurrences`;
* `manualEvents`.

Task 2.13 prevents ordinary interactive creation from producing duplicates, but store validation must protect direct callers and complete authoritative acceptance.

---

# 13. Common Cycle-Local Work-Entry Namespace

Within each cycle, segment and sequence-entry IDs share one uniqueness namespace.

Blocking validation must reject collisions across:

* segment ↔ segment;
* sequence ↔ sequence;
* segment ↔ sequence.

IDs may still repeat in different cycles.

Do not impose global nested uniqueness.

---

# 14. Shift Definition Validation

Validate every shift definition according to current executable requirements.

At minimum:

* non-empty unique ID;
* valid start time;
* valid end time;
* valid/non-empty weekday set where required by current type/engine semantics;
* no duplicated weekday values if duplication is semantically invalid;
* `crossesMidnight` must agree with current time semantics.

Reuse existing parsing/validation helpers where possible.

Do not duplicate scheduling logic unnecessarily.

---

# 15. Segment → Shift Definition Integrity

For every segment:

* `shiftDefinitionId` must resolve exactly one active shift definition;
* `shiftCycleId` must equal containing cycle ID.

Missing reference is blocking.

Containment mismatch is blocking.

Do not tolerate "container wins" for newly proposed current authority.

---

# 16. Sequence → Shift Definition Integrity

For every sequence entry:

* `shiftDefinitionId === null` remains valid off-day semantics;
* non-null `shiftDefinitionId` must resolve exactly one active shift definition.

Missing non-null references are blocking.

---

# 17. Shift Cycle Validation

Validate cycle-level intrinsic semantics including:

* non-empty unique cycle ID;
* real local start/end dates;
* start <= end;
* no overlap between active cycles where Task 2.14 adopted overlap prohibition.

Reuse existing cycle/date helpers where possible.

---

# 18. Manual Segment Validation

Validate all authored manual segments, including inactive-mode segments.

Blocking rules include:

* unique common-namespace ID;
* real start/end dates;
* start <= end;
* segment date range inside containing cycle;
* no overlap with other manual segments in the same cycle;
* valid shift-definition reference;
* matching containing cycle ID.

Inactive-mode data must not be discarded or exempted from structural coherence.

---

# 19. Repeating Sequence Validation

Validate all authored sequence entries, including inactive-mode entries.

Blocking rules include:

* unique common-namespace ID;
* nonnegative integer `dayOffset`;
* unique offsets;
* contiguous offsets starting at zero;
* valid/non-null shift-definition references where applicable.

Array order need not equal offset order if current execution sorts by offset.

---

# 20. Active Cycle-Mode Completeness

Preserve Task 2.14 mode semantics.

For repeating-sequence mode:

* required anchor/date configuration must exist;
* at least one sequence entry must exist.

For manual mode:

* zero manual segments may remain valid dormant/empty authored schedule where currently allowed.

Do not delete or invalidate inactive-mode data merely because it is inactive.

---

# 21. Template Validation

Validate every block template using existing semantic rules where available.

At minimum:

* non-empty unique ID;
* nonblank title;
* positive integer duration;
* valid priority;
* coherent placement/window time configuration;
* coherent required resources.

Reuse `validateBlockTemplate` or equivalent existing semantics instead of creating contradictory logic.

---

# 22. Recurrence → Template Integrity

Every recurrence must reference exactly one active block template.

Missing reference is blocking.

Duplicate template IDs are already rejected independently.

Multiple distinct recurrences may target the same template.

Do not enforce one recurrence per template.

---

# 23. Template Without Recurrence

Templates with no recurrence are valid.

Do not produce a blocking issue solely because a template is dormant.

Setup fallback behavior remains unchanged.

---

# 24. Supported Recurrence Frequencies

Executable frequencies remain:

* `daily`;
* `weekly`;
* `specificWeekdays`;
* `timesPerUserWeek`.

Validate their frequency-specific parameters.

---

# 25. Unsupported Declared Recurrence Frequencies

`perShiftSegment` and `custom` remain accepted authored intent.

They must produce deterministic **nonblocking advisories**, not invalid rejection.

Store mutations containing them may still be applied if no blocking issues exist.

Do not attempt generation behavior changes.

---

# 26. Unknown Recurrence Frequency

A runtime value outside the declared/recognized recurrence vocabulary is blocking invalid input.

Do not classify arbitrary unknown strings as supported intent.

---

# 27. `specificWeekdays` Validation

Require:

* at least one weekday;
* recognized weekday values;
* no duplicates where duplicate values have no semantic meaning.

Invalid parameterization is blocking.

---

# 28. `timesPerUserWeek` Validation

Require a positive integer.

Do not invent a new maximum beyond current canonical-week behavior.

Values larger than the number of eligible canonical days remain semantically handled by current recurrence expansion.

---

# 29. Recurrence Date Bounds

Optional recurrence start/end values must be valid local dates.

If both exist:

```
startsOnDate <= endsOnDate
```

Invalid ordering is blocking.

---

# 30. Stale Recurrence Fields

Fields irrelevant to the currently selected recurrence frequency may remain present because Setup preserves them during frequency changes.

Do not reject merely stale but semantically inactive recurrence parameters unless they independently violate a universal structural requirement.

---

# 31. Scheduling Preferences

Validate authored global scheduling preferences.

At minimum:

* parseable day-boundary time;
* recognized `weekStartsOn`.

Validate cycle/segment overrides using the same field-level semantics where present.

Do not duplicate downstream time parsing rules inconsistently.

---

# 32. Preview Range

Validate structural authored Preview-range requirements:

* recognized source/preset values;
* real local start/end dates;
* start <= end.

Do not reject merely because:

* cycle-source range currently lacks cycles;
* configured range extends beyond cycle coverage.

Those remain nonblocking/warning concerns if surfaced at all.

Task 2.15 does not need new advisory UI for them.

---

# 33. Manual Event Validation

Validate every manual event.

At minimum:

* non-empty unique ID;
* nonblank title;
* real user-day date;
* valid boolean/all-day shape;
* timed events have parseable start/end times;
* supported optional notes shape.

Preserve current overnight semantics:

```
end <= start
    → next calendar day
```

Do not reject such timed events merely because end clock time is earlier than start clock time.

---

# 34. All-Day Manual Events

Current normalization strips operative time fields for all-day events.

For current-authoring validation, choose the narrowest behavior consistent with Task 2.14:

* accept normalized all-day events;
* do not invent broad repair behavior.

If stale time fields can reach current mutation callers despite ordinary workflow normalization, choose one bounded implementation policy and document it.

Do not silently mutate caller input inside the validator.

---

# 35. Complete Candidate Derivation

Every current authored mutation must derive a **complete candidate authored snapshot** before validation.

The candidate is:

```
current authored state
    +
proposed mutation
    ↓
complete DayFrameAuthoredSetup
```

Validation must never judge a narrow array in isolation.

---

# 36. `commitAuthoredSetup`

For Setup commit:

* merge proposed Setup-owned fields;
* retain current `manualEvents`;
* produce one complete candidate;
* validate once;
* reject before mutation if invalid;
* otherwise preserve existing atomic transition behavior.

Do not partially apply valid subsets.

---

# 37. `setSchedulingPreferences`

Derive complete candidate with proposed scheduling preferences.

Validate full candidate.

Reject before mutation if blocking issues exist.

---

# 38. `setPreviewRange`

Equivalent complete-candidate validation.

---

# 39. `setShiftDefinitions`

Validate resulting full authored snapshot.

Example:

```
removing shift definition X
    +
surviving segment references X
```

must reject.

Do not cascade-delete segments.

---

# 40. `setShiftCycles`

Validate resulting full authored snapshot.

Reject malformed cycle/segment/sequence structures before mutation.

---

# 41. `setBlockTemplates`

Validate full candidate.

Deleting a template while recurrence still references it must reject.

Do not cascade-delete recurrence.

---

# 42. `setBlockRecurrences`

Validate full candidate.

Deleting recurrences is allowed if resulting state remains valid; templates may remain without recurrence.

---

# 43. `setManualEvents`

Validate full candidate, including all other current authored state.

This keeps one authoritative acceptance invariant.

Do not change the separate manual-event workflow ownership.

---

# 44. Store Mutation Result Migration

Change current authored mutation results to an explicit discriminated union equivalent to:

```
{
  status: "applied",
  state,
  persistence
}
```

or:

```
{
  status: "rejected",
  reason: "invalidAuthoredState",
  validation
}
```

The exact public names may follow project conventions.

Do not represent validation rejection as:

* `storageFailure`;
* `serializationFailure`;
* `unavailable`;
* thrown persistence exception.

---

# 45. Applied Result Preservation

For valid mutations, preserve existing semantics:

* state transitions normally;
* Preview stale/clear semantics unchanged;
* persistence attempted normally;
* durability status updated normally;
* ordinary subscriber notification unchanged;
* existing persistence failure semantics unchanged.

Only the surrounding result discriminant changes where required.

---

# 46. Rejected Result

Rejected result must include the complete invalid validation result.

It must not include a mutated state pretending application occurred.

If caller needs current state, it may obtain it through existing store accessors unless there is strong implementation reason to include an unchanged snapshot.

Prefer the smallest truthful contract.

---

# 47. Validation Before Preview Invalidation

This ordering is mandatory:

```
derive candidate
    ↓
validate
    ↓
invalid → return
```

Only after validation success may current mutation logic call:

* `markPreviewStale`;
* Preview clearing;
* state assignment;
* persistence.

---

# 48. Validation Before Durability Intent

Do not change desired durable condition to `snapshot` for a rejected candidate.

Rejected authored state was never current intended durable truth.

---

# 49. Validation Before Persistence

Rejected mutation performs:

* no serialization;
* no local-storage acquisition;
* no `setItem`.

Direct tests must establish this.

---

# 50. Validation Before State Notification

Rejected mutation emits no ordinary state subscriber notification.

Direct tests must establish this.

---

# 51. Validation Before Durability Notification

Rejected mutation emits no durability subscriber notification.

Direct tests must establish this.

---

# 52. Durability Status Preservation

Rejected mutation leaves:

* active-state durability status;
* profile durability status;
* desired durable conditions

unchanged.

Only authored active-state mutations are under this validation contract; profile collection mutation behavior is unchanged.

---

# 53. Preview Preservation

Rejected mutation must preserve the exact prior Preview semantics:

* same presence/null state;
* same schedule result;
* same stale flag;
* same generation/revision timestamps;
* same action feedback.

Do not clone-and-replace Preview unnecessarily.

---

# 54. State Preservation

Rejected mutation leaves the complete `DayFrameState` semantically unchanged.

A returned validation object must not mutate current store state.

Direct tests should compare state before/after.

---

# 55. Store Caller Migration

Audit all production consumers of affected current-authored mutation results.

Every caller must branch on:

* applied;
* rejected.

Do not blindly access `.state` or `.persistence` on rejected results.

---

# 56. Durability Semantic Classifier Integration

Task 1.34 durability classifiers consume persistence outcomes.

They must receive outcomes only from **applied** store mutation results.

Validation rejection is not a durability semantic category.

Do not add validation categories to durability classification.

---

# 57. Setup Caller Behavior

For normal valid Setup save/generation flows, behavior must remain unchanged.

For rejected Setup commit:

* no current state change;
* no persistence;
* remain in Setup context;
* minimal workflow-local validation feedback may be retained if necessary.

Do not build full validation UX in Task 2.15.

---

# 58. Generate Preview Workflow

If Generate Preview first commits Setup:

* branch on commit result;
* if rejected, do not generate Preview;
* do not navigate as though commit succeeded;
* remain on current workflow;
* provide only minimum semantic indication required for truthful behavior.

Do not generate from invalid draft authority.

---

# 59. Manual Event Caller Behavior

For rejected `setManualEvents`:

* keep current store events unchanged;
* do not treat create/edit/delete as applied;
* keep or restore editor/workflow state in the smallest truthful way;
* do not classify rejection as durability failure.

Avoid broad UX redesign.

---

# 60. Other Current Authored Callers

Audit production use of narrow setters.

If non-user-facing/demo/bootstrap callers exist, they must handle rejection explicitly or prove their proposed state remains valid.

Do not add silent unwrap helpers that erase the applied/rejected distinction.

---

# 61. Setup Preflight Scope

Task 2.14 recommends Setup preflight, but Task 2.15 should prioritize correctness at the store boundary.

Authorized minimum:

* use the validator in Setup preflight only if needed to avoid duplicate validation logic or to provide minimally truthful rejected-flow behavior.

Do not add elaborate issue lists, field highlighting, focus management, or new validation panels unless required for existing workflow continuity.

A later task may improve presentation.

---

# 62. Current Form Validation Preservation

Existing field/form checks remain.

The authored snapshot validator does not replace contextual UI validation.

Do not delete existing Setup or manual-event validation merely because a domain validator now exists.

---

# 63. Unsupported Recurrence Advisory Handling

A valid snapshot may contain advisories for `perShiftSegment` or `custom`.

Applied store mutation may proceed.

Do not automatically invoke Preview generation when the existing generation path would throw on a relevant enabled unsupported recurrence.

If an existing Preview workflow already prevents this, preserve it.

If caller adaptation is required to avoid a newly obvious blind generation path, make only the minimum guard necessary and document it.

Do not implement the recurrence.

---

# 64. Construction / Initialization Explicitly Excluded

Do not enforce the new current-mutation rejection contract during:

* local rehydration;
* initial persisted-state loading;
* profile normalization;
* backup normalization/import;
* arbitrary store construction merge.

Task 2.14 recommended separate construction/ingress behavior, but this task explicitly excludes it to avoid changing historical compatibility.

If a new validator module is reusable there later, do not wire it yet.

---

# 65. Injected `initialState`

Task 2.14 recommended eventual deterministic configuration validation for injected initial state.

Task 2.15 does **not** need to implement that unless current type/result changes make construction validation unavoidable.

Prefer to defer construction-boundary enforcement.

Document the deferral.

---

# 66. Profile Operations

Do not change:

* save profile;
* delete profile;
* load profile validation/activation semantics.

Even though profile load replaces authored state, it is historical durable ingress and requires its own compatibility-aware task.

---

# 67. Backup Operations

Do not change:

* export;
* import semantic validation;
* activation;
* recovery.

Historical ingress remains deferred.

---

# 68. Local Rehydration

Do not reject or rewrite existing persisted state through the new validator.

Do not silently fall back to defaults because validator reports an issue.

---

# 69. No Historical Repair

Do not:

* remap duplicate IDs;
* cascade-delete dangling historical references;
* rewrite segment containment;
* normalize unsupported recurrence into supported recurrence;
* strip problematic authored data.

Validator is reporting truth, not repairing data.

---

# 70. Relationship Deletion Behavior

Current mutation enforcement may make some narrow deletion sequences reject.

Example:

```
setBlockTemplates(without T)
    while R still references T
    → rejected
```

The workflow must submit an atomic valid resulting setup instead.

Do not add store cascades.

---

# 71. Atomic Setup Deletion

Where Setup currently deletes related objects together in its complete authored commit, preserve that atomic path.

Tests must prove valid related deletion still succeeds.

---

# 72. Validation Unit-Test Categories

Add direct pure-validator tests for:

1. fully valid authored setup;
2. duplicate shift definition ID;
3. duplicate shift cycle ID;
4. duplicate template ID;
5. duplicate recurrence ID;
6. duplicate manual-event ID;
7. segment/sequence common namespace collision;
8. missing recurrence template;
9. missing segment shift definition;
10. missing sequence shift definition;
11. valid null sequence shift definition;
12. segment cycle mismatch;
13. invalid cycle dates;
14. overlapping cycles;
15. invalid segment dates;
16. overlapping segments;
17. segment outside cycle bounds;
18. invalid sequence offsets;
19. invalid template;
20. template without recurrence valid;
21. multiple recurrences per template valid;
22. `specificWeekdays` invalid parameters;
23. `timesPerUserWeek` invalid parameters;
24. recurrence date bounds;
25. unsupported recurrence advisory;
26. unknown recurrence blocking;
27. invalid scheduling preferences;
28. invalid Preview range;
29. invalid manual event;
30. deterministic multiple-issue ordering.

Add more only where necessary to cover adopted rules.

---

# 73. Disabled / Inactive Source Tests

Directly prove that:

* disabled sources remain structurally validated;
* inactive manual/sequence cycle data remains structurally validated;
* inactive data is not silently dropped.

Do not confuse disabled with exempt.

---

# 74. Store Rejection Tests

For at least one representative invalid mutation, directly prove:

* result is `rejected`;
* state unchanged;
* Preview unchanged;
* stale bit unchanged;
* local-storage bytes unchanged;
* no persistence helper attempt where observable;
* durability status unchanged;
* desired durable condition unchanged;
* state subscribers not notified;
* durability subscribers not notified.

Prefer coverage at both:

* narrow setter;
* atomic Setup commit.

---

# 75. Cross-Collection Rejection Tests

Directly prove:

## Delete referenced shift definition

Rejected if cycles still reference it.

## Delete referenced template

Rejected if recurrence still references it.

This protects complete-snapshot validation.

---

# 76. Atomic Valid Relationship Change Test

Directly prove that a complete atomic Setup commit which removes both:

* template;
* its recurrence;

succeeds.

Likewise add a shift-related atomic transition if current Setup workflow naturally supports it.

The validator must not prevent valid relationship changes merely because individual narrow operations would reject.

---

# 77. Applied Mutation Regression

Existing valid mutations must retain:

* state behavior;
* Preview staleness;
* persistence outcome;
* durability behavior;
* notification count.

Update existing tests for the new result discriminant without weakening their semantic assertions.

---

# 78. Persistence Failure Regression

For a valid authored mutation whose persistence fails:

* result remains `applied`;
* runtime state remains authoritative;
* persistence outcome remains failure;
* durability status behaves exactly as Phase 1 established.

This test is critical to preserve:

```
validation rejection
    ≠
durability failure
```

---

# 79. Serialization Failure Regression

Equivalent regression:

Valid runtime mutation + serialization failure remains **applied** session authority with recovery-required durability semantics.

Do not reinterpret it as rejected authored state.

---

# 80. Production Caller Tests

Update workflow tests to cover:

* applied Setup save;
* rejected Setup save;
* rejected Generate Preview precommit;
* applied manual event create/edit/delete;
* representative rejected manual-event mutation if safely constructible.

Do not manufacture unsafe TypeScript corruption merely for UI tests if store/unit tests establish the invalid path more directly.

---

# 81. Validation Feedback Minimum

If UI needs a generic workflow-local message for rejected state, keep it factual and minimal.

Examples of semantic intent:

```
Setup contains conflicting or incomplete authored data and was not saved.
```

Do not expose raw issue codes directly.

Do not build full recovery UX.

Exact copy may follow existing conventions.

---

# 82. No Persistent Global Validation Surface

Task 1.36's persistent durability awareness is unrelated.

Do not add a global validation banner or new subscription.

Validation rejection belongs to the initiating workflow because rejected state never became authoritative.

---

# 83. No New Validation Subscription

Validation results are synchronous mutation results.

Do not add a validator subscription.

---

# 84. Existing Store Subscription Semantics

Only accepted authored mutations notify ordinary subscribers.

This must remain explicit.

---

# 85. Existing Durability Subscription Semantics

Only persistence/durability status changes notify durability subscribers.

Validation rejection must not.

---

# 86. Clone Safety

Validation must not mutate caller input or store state.

If validation issues contain arrays/paths, returned results should not expose mutable store-owned references.

Use immutable/scalar diagnostic data.

---

# 87. Performance

Current authored snapshots are small.

Favor correctness and deterministic complete validation over premature incremental validation.

Do not add caching or dirty-rule tracking.

---

# 88. Pure Validation Reuse

Design the validator so it can later be reused for historical ingress **detection**.

Do not encode current store policy such as:

```
"throw"
"reject mutation"
"show error"
```

inside the validator.

It reports facts only.

---

# 89. No Compatibility Policy In Validator

The validator must not decide:

* whether old local data activates;
* whether profile load falls back;
* whether backup import is recoverable;
* whether IDs should be migrated.

Those are boundary policies.

---

# 90. Existing Validation Helper Reuse

Audit and reuse existing helpers such as:

* block-template validation;
* cycle validation;
* time/date parsers;
* recurrence utilities.

If an existing helper throws, wrap/translate its semantic facts in the pure validator without allowing exceptions to escape for expected invalid authored state.

Do not duplicate large validation algorithms.

---

# 91. Throwing Helper Boundary

The new validator itself should be total for structurally representable runtime inputs covered by `DayFrameAuthoredSetup`.

Expected invalid authored data should become issues rather than thrown exceptions.

Unexpected programmer errors may still throw according to project conventions.

---

# 92. Current Store API Compatibility

The `StoreMutationResult` type migration is intentionally breaking at compile time for callers.

Use this to force exhaustive handling.

Do not preserve an ambiguous backward-compatible shape such as always including fake `.state`/`.persistence` values on rejection.

---

# 93. Type Narrowing

Production callers should branch explicitly:

```
if (result.status === "rejected") {
    ...
}

// applied path
```

Use discriminated union narrowing.

Avoid unsafe casts.

---

# 94. Profile Mutation Results

Profile save/delete results are outside authored-snapshot mutation validation unless they reuse the same result type.

If `StoreMutationResult` currently also types profile mutations, inspect whether separating type aliases is necessary.

Do not force profile operations into authored validation semantics.

Prefer the smallest truthful type decomposition.

---

# 95. Backup Import Results

Do not change backup import semantic validation in this task.

If current type reuse causes compiler pressure, introduce narrowly truthful result aliases rather than accidentally subjecting import to current-authoring enforcement.

---

# 96. Clear Result

`clearLocalData` remains outside authored mutation validation.

Clear is an explicit reset/removal operation with its existing independent result contract.

Do not validate defaults/empty authored state as a prerequisite to clear.

---

# 97. Retry APIs

Durability retry APIs remain unchanged.

Validation rejection creates no retryable durability condition.

Do not surface Retry.

---

# 98. OccurrenceIdentity Preservation

Task 2.10 V1 occurrence identity remains unchanged.

No:

* new fields;
* version changes;
* durable use.

Valid current snapshots now provide stronger non-ambiguous active references, but source incarnation remains unresolved.

---

# 99. Source Incarnation Boundary

Task 2.11 remains fully in force.

A valid unique snapshot proves:

```
one current referent
```

It does not prove:

```
one continuous historical source lifetime
```

Do not describe Task 2.15 as making occurrence identity durable-ready.

---

# 100. PlanDecision Boundary

Do not add PlanDecision.

Task 2.15 merely establishes that current authority is coherent enough for future decisions to reference unambiguously during the active lineage.

Durable PlanDecision remains blocked on source incarnation and later durable-reference governance.

---

# 101. Compatibility Boundary

Task 2.15 changes only acceptance of **new proposed current authored mutations**.

It must not change:

* persistence schema;
* local format version;
* profile format version;
* backup format version;
* compatibility readers;
* normalization behavior;
* migration evidence.

---

# 102. Expected Production Files

Likely changes include:

* new authored validation module;
* authored validation tests;
* state/store result types;
* `dayFrameStore.ts`;
* store tests;
* `DayFrameApp.tsx`;
* `SetupScreen.tsx` only if minimum caller/preflight adaptation requires it;
* related UI tests.

Exact files should follow repository boundaries.

---

# 103. Production Reference Audit

After implementation, audit every current-authored mutation caller.

Confirm:

* all affected store result consumers branch on status;
* no caller assumes `.state` exists on rejection;
* no caller sends rejection into durability classifiers;
* no caller generates Preview after rejected Setup commit;
* no current-authoring path bypasses complete validation.

Also confirm historical ingress paths remain unwired.

---

# 104. Required Result Artifact Structure

The Task 2.15 result must contain at least:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Validator Architecture
6. Validation Result Contract
7. Issue Model / Deterministic Ordering
8. ID Uniqueness Validation
9. Shift Definition Validation
10. Shift Relationship Validation
11. Cycle Validation
12. Segment Validation
13. Sequence Validation
14. Template Validation
15. Recurrence Relationship Validation
16. Template-Without-Recurrence Preservation
17. Supported Recurrence Validation
18. Unsupported Recurrence Advisories
19. Scheduling Preference Validation
20. Preview Range Validation
21. Manual Event Validation
22. Complete Candidate Derivation
23. Setup Commit Enforcement
24. Narrow Setter Enforcement
25. Manual Event Enforcement
26. Store Mutation Result Migration
27. Applied Mutation Semantics
28. Rejected Mutation Semantics
29. Preview Preservation On Rejection
30. Persistence / Durability Preservation On Rejection
31. Subscriber Preservation On Rejection
32. Production Caller Migration
33. Setup Workflow Handling
34. Generate Preview Rejection Handling
35. Manual Event Workflow Handling
36. Validation / Durability Separation
37. Historical Ingress Exclusion
38. Profile / Backup Preservation
39. OccurrenceIdentity Preservation
40. Source-Incarnation Boundary
41. Tests Added or Updated
42. Production Reference Audit
43. Compatibility Assessment
44. Architectural Alignment Improvement
45. Deviations
46. Discoveries and Deferred Work
47. Recommended Next Task
48. Validation
49. Final Completion Determination

---

# 105. Validation Requirements

Run validator/store-focused tests first.

At minimum:

```
authored validator tests
dayFrameStore tests
```

Then run affected workflow tests.

Then repository-standard validation:

```
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```
git diff --check
```

Record:

* validator test count;
* store focused test count;
* UI/workflow focused test count;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result;
* artifact hash;
* task artifact immutability.

Confirm:

* no historical-ingress policy changed;
* no durable format changed;
* no governance document changed;
* no source-incarnation behavior added;
* no PlanDecision behavior added.

---

# 106. Completion Criteria

Task 2.15 is complete only when:

* one pure complete authored-snapshot validator exists;
* validation returns deterministic issue collections;
* blocking invalid state is distinguished from nonblocking unsupported advisories;
* all adopted uniqueness rules are enforced;
* required authored relationships are enforced;
* cycle/segment/sequence structural invariants are enforced;
* template/recurrence structural rules are enforced;
* templates without recurrence remain accepted;
* multiple recurrences per template remain accepted;
* unsupported declared recurrence intent remains accepted with advisory;
* preferences/range/manual-event rules are enforced as adopted;
* every current authored mutation derives and validates the complete candidate snapshot;
* store mutation results distinguish applied from rejected;
* rejected state never becomes runtime authority;
* rejected mutations do not stale or alter Preview;
* rejected mutations do not persist;
* rejected mutations do not change durability state or desired condition;
* rejected mutations notify neither state nor durability subscribers;
* valid mutations preserve current session-first persistence behavior;
* production callers branch correctly;
* Generate Preview cannot proceed after rejected Setup commit;
* historical local/profile/backup ingress remains unchanged;
* occurrence identity remains V1 and unchanged;
* source incarnation remains unresolved;
* PlanDecision remains unimplemented;
* focused and repository-standard validation pass;
* immutable task specification remains unchanged.

---

# 107. Task Determination

Task 2.15 is a bounded current-authority validation implementation.

It exists because collision-free interactive creation alone cannot guarantee that every caller-proposed authored snapshot is semantically coherent enough to become DayFrame's current authority.

Its purpose is to make the store acceptance boundary explicit:

```
candidate authored snapshot
    ↓
semantic validation
    ↓
valid
    → may become authority

invalid
    → never becomes authority
```

This is intentionally different from persistence failure:

```
valid authored authority
    ↓
persistence failure
    ↓
remains runtime authority for the session
```

Validation answers whether the proposed state is legitimate current authored truth.

Durability answers whether accepted current truth was successfully preserved.

Historical compatibility remains a separate boundary.

**Task 2.15 is complete when DayFrame validates every proposed current authored mutation as a complete `DayFrameAuthoredSetup`, explicitly applies or rejects that mutation before any state/Preview/persistence/durability/subscriber effect, preserves valid session-first mutation behavior and historical-ingress compatibility, and introduces no source-incarnation, durable-reference, or PlanDecision behavior.**
