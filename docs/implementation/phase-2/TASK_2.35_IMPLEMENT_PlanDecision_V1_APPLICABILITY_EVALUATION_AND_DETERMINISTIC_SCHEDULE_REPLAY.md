# Task 2.35 — Implement PlanDecision V1 Applicability Evaluation and Deterministic Schedule Replay

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded engine-integration implementation task.

Task 2.35 makes persisted `PlanDecision V1` authority influence schedule generation for the first time.

This task implements:

* pure PlanDecision applicability evaluation;
* deterministic reference resolution during generation;
* replay of supported V1 decision kinds;
* omission before placement;
* exact duration override before placement;
* exact priority override before placement;
* exact placement as a hard placement constraint;
* derived per-decision replay outcomes;
* ordinary friction detection after replay;
* deterministic generation from authored authority + PlanDecision authority.

It does **not** implement:

* Accept UI;
* decision-management UI;
* decision persistence changes;
* decision recovery changes;
* new PlanDecision kinds;
* Backup V3;
* conflict decisions;
* execution/history;
* general scheduling redesign.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 2.34 is complete and accepted;
6. review Tasks 2.32–2.34 before modifying generation;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.35_IMPLEMENT_PLANDECISION_V1_APPLICABILITY_EVALUATION_AND_DETERMINISTIC_SCHEDULE_REPLAY_RESULT.md`

If replay cannot be introduced without changing the accepted `PlanDecision V1` or `DurableOccurrenceReference V1` contracts, stop and report rather than silently broadening scope.

---

# 2. Purpose

Tasks 2.32–2.34 established three complete layers:

```text
DurableOccurrenceReference V1
    identifies an exact lifetime-safe occurrence

PlanDecision V1
    records explicitly accepted occurrence-scoped intent

PlanDecision Surface V1
    durably owns that accepted intent
```

But schedule generation currently ignores PlanDecisions.

Task 2.35 completes the next layer:

```text
Authored authority
+
active PlanDecision authority
+
generation inputs
=
derived Preview
```

The goal is not to replace the scheduling engine.

The goal is to add a deterministic replay layer that allows supported accepted decisions to survive Preview regeneration.

---

# 3. Governing Architectural Decisions

The following Task 2.33/2.34 decisions are fixed:

1. PlanDecision is accepted planning authority;
2. V1 supports:

   * `placeOccurrence`;
   * `omitOccurrence`;
   * `setOccurrenceDuration`;
   * `setOccurrencePriority`;
3. each decision targets one `DurableOccurrenceReference V1`;
4. only one current decision exists per semantic target;
5. stale valid decisions remain retained;
6. replay outcomes are derived, not persisted;
7. authored source authority outranks PlanDecision when the source no longer exists or lifetime mismatches;
8. PlanDecision outranks ordinary flexible placement heuristics where applicable;
9. accepted decisions do not automatically mean conflict-free;
10. omission/duration/priority apply before ordinary placement;
11. exact placement acts as a hard placement constraint during placement;
12. friction detection runs after replayed scheduling;
13. Try remains Preview-only;
14. Accept UI remains deferred.

Do not reopen these unless executable evidence exposes a contradiction.

---

# 4. Architectural Objective

After Task 2.35, the generation pipeline should conceptually be:

```text
Authored setup
    ↓
expand work / occurrences
    ↓
resolve PlanDecision targets
    ↓
evaluate decision applicability
    ↓
apply pre-placement decisions
    ├─ omit
    ├─ duration
    └─ priority
    ↓
ordinary placement
    +
hard exact placement decisions
    ↓
scheduled / unplaced result
    ↓
decision replay outcomes
    ↓
ordinary friction detection
    ↓
SuggestedFix generation
    ↓
Preview
```

No previous Preview is authoritative input.

---

# 5. Required Initial Audit

Before implementation, trace the current production generation path:

* `generateSchedulePreview`;
* cycle work generation;
* `generateBlockCandidates`;
* `placeBlockCandidates`;
* manual-event projection;
* work-block inclusion;
* unplaced candidates;
* friction detection;
* SuggestedFix generation;
* revision/Try behavior.

Identify the narrowest insertion points for each PlanDecision kind.

Document actual insertion points before coding.

---

# 6. No Persistence Changes

Task 2.35 must consume the already-owned runtime PlanDecision collection.

Do not modify:

* PlanDecision storage key;
* envelope;
* validation;
* quarantine;
* recovery;
* durability;
* retry;
* PlanDecision IDs;
* acceptedAt;
* persistence writers.

The replay layer is read-only with respect to decision authority.

---

# 7. Generation API Boundary

Determine the narrowest generation API extension.

Potential:

```ts
generateSchedulePreview({
  authoredSetup,
  planDecisions,
  ...
})
```

or equivalent.

Do not make the core engine reach into the store.

The engine should receive explicit inputs.

---

# 8. Store Generation Integration

`dayFrameStore.generatePreview()` should supply the current valid PlanDecision collection to the engine.

Do not supply:

* quarantined decisions;
* protected raw decision data;
* decision durability status.

Only valid current decision authority participates.

---

# 9. Pure Applicability Evaluator

Add a dedicated pure evaluator.

Likely conceptual API:

```ts
evaluatePlanDecisionApplicability(
  decision,
  authoredSetup
): PlanDecisionApplicabilityResult
```

It must:

1. validate/assume validated decision;
2. resolve target using `DurableOccurrenceReference V1`;
3. map reference outcome;
4. validate kind-specific capability/preconditions;
5. return derived applicability.

No Preview or persistence dependency.

---

# 10. Applicability Result

Define an explicit result union.

At minimum:

```text
applicable
staleSourceMissing
staleLifetime
staleOccurrenceMissing
invalid
unsupported
inapplicable
```

If `invalid` and `unsupported` should be unreachable because the store only supplies validated decisions, retain defensive handling without duplicating durable validation policy.

---

# 11. Replay Outcome

Replay result is distinct from applicability.

Suggested derived outcomes:

* `applied`;
* `outsideWindow`;
* `staleSourceMissing`;
* `staleLifetime`;
* `staleOccurrenceMissing`;
* `blocked`;
* `invalid`;
* `unsupported`.

No outcome is persisted.

---

# 12. Replay Result Identity

Each replay outcome must identify:

* `PlanDecisionId`;
* kind;
* target;
* outcome;
* structured reason where relevant.

Do not depend on decision-array index.

---

# 13. Preview Result Integration

Extend the generated Preview result only as necessary to expose replay outcomes.

Prefer an explicit field such as:

`planDecisionResults`

or equivalent.

This is derived Preview metadata.

Do not add PlanDecision records themselves into Preview if a result can instead refer by decision ID and semantic target.

---

# 14. Preview Persistence Boundary

Preview remains derived runtime state.

Adding decision replay results does not change durable Preview behavior.

Do not persist Preview or replay results.

---

# 15. Outside-Window Semantics

A valid decision may target an occurrence outside the requested Preview range.

That is not stale.

Return:

`outsideWindow`

or equivalent.

Do not classify it as `occurrenceMissing`.

---

# 16. Resolver Versus Preview Window

Use the durable resolver to determine semantic existence independently from the Preview range.

Then separately determine whether the occurrence lies within the generated window.

This distinction is mandatory.

---

# 17. Omit Decision Semantics

`omitOccurrence` means:

> suppress this specific occurrence from schedulable Preview output while its target remains applicable.

It does not:

* delete the source;
* disable recurrence;
* change authored state;
* change source incarnation.

---

# 18. Omit — Template Candidate

For a generated template occurrence:

* identify the exact candidate by durable semantic identity;
* remove/suppress it before placement;
* do not report it as ordinary unplaced failure.

Determine whether it should appear in a dedicated omitted/decision result only.

Preferred:

* replay outcome records omission;
* normal `unplacedCandidates` does not treat intentionally omitted occurrence as failed placement.

---

# 19. Omit — Work Occurrence

Audit whether current work blocks are always anchored/non-movable.

If omission is semantically supported for work under Task 2.33, suppress only the targeted work occurrence in derived generation.

Do not mutate cycle authored state.

If omission of work contradicts current hard-authority semantics, stop and report rather than silently supporting it.

---

# 20. Omit — Manual Event

Audit whether manual events are movable/anchored.

If omission is permitted by V1 semantics, suppress only the projected occurrence.

If manual events are semantically hard authored commitments that cannot be omitted through planning authority, classify this kind/family combination inapplicable and document.

Do not invent capability.

---

# 21. Duration Decision Semantics

`setOccurrenceDuration` means:

> use the exact accepted duration for this occurrence during derived scheduling while leaving the authored source unchanged.

---

# 22. Duration — Template Occurrence

Override candidate duration before placement.

Do not change block template duration.

The decision applies only to the targeted occurrence.

---

# 23. Duration — Work Occurrence

Audit whether work duration is structurally derived from shift start/end and whether per-occurrence override is semantically legal.

Do not truncate authoritative work merely because PlanDecision V1 abstractly supports duration.

If illegal, return `inapplicable` or `blocked` according to the accepted distinction.

---

# 24. Duration — Manual Event

Audit whether manual-event duration may be overridden in derived planning without contradicting authored fixed event authority.

Use executable source semantics.

If not legal, classify appropriately.

---

# 25. Duration Validation At Replay

Even though durable payload validation allows `1..1440`, applicability may impose stricter capability constraints.

Do not mutate stored decision when current constraints change.

---

# 26. Priority Decision Semantics

`setOccurrencePriority` means:

> use the exact accepted effective priority for placement/ranking of this occurrence.

It does not change authored source priority.

---

# 27. Priority — Template Occurrence

Override effective candidate priority before placement.

Preserve all other candidate semantics.

---

# 28. Priority — Work / Manual

Audit whether work/manual events participate in priority-based placement.

If they do not, `setOccurrencePriority` may be inapplicable for those target families.

Do not add artificial priority behavior to anchored occurrences.

---

# 29. Exact Placement Semantics

`placeOccurrence` is a hard derived placement instruction:

> if applicable and feasible, the occurrence must start exactly at the stored `userDayDate + startTime`.

No fallback gap is allowed.

---

# 30. Placement Coordinate Resolution

Use current effective user-day boundary semantics to convert:

```text
userDayDate
+
startTime
```

to the intended local date/time.

Reuse canonical time helpers.

Do not store or infer absolute timestamps from acceptance time.

---

# 31. Boundary Change Behavior

If day-boundary/segment preferences change after acceptance:

* stored payload remains unchanged;
* replay recomputes the current concrete instant;
* feasibility is re-evaluated.

Do not rewrite decision payload.

---

# 32. Exact Placement — Template Occurrence

For movable template occurrences:

* bypass ordinary heuristic gap choice;
* attempt exactly requested start;
* retain exact duration after any duration decision if V1 someday composes.

However, V1 currently permits one decision per target, so no simultaneous duration + placement decision exists.

Do not invent composition.

---

# 33. One-Decision-Per-Target Consequence

Because V1 has exactly one current decision per target:

* placement replay uses authored/default duration and priority;
* duration replay uses ordinary placement;
* priority replay uses ordinary placement;
* omission suppresses occurrence.

Do not attempt to combine superseded decisions.

---

# 34. Exact Placement Feasibility

Define hard feasibility checks using current placement constraints.

At minimum evaluate:

* target occurrence movable;
* requested start is inside permitted planning/generation bounds;
* target duration fits;
* hard anchored conflicts;
* source constraints;
* preferred window rules if those are hard versus heuristic.

Do not silently convert hard placement into preference.

---

# 35. Exact Placement Blocked

If exact placement cannot be achieved:

* keep decision durable;
* do not place it elsewhere because of that decision;
* return `blocked`.

Determine whether the underlying occurrence should then:

## A. remain unplaced

or:

## B. fall back to ordinary authored scheduling despite decision failure.

Task 2.33 says exact move never silently chooses another gap.

Preferred:

> occurrence remains unplaced for this Preview when the hard accepted placement cannot be realized.

Document and test.

---

# 36. Exact Placement Outside Preview Window

If requested exact placement lies outside current Preview range while target occurrence itself exists:

* return `outsideWindow`;
* do not mutate generation outside requested window.

Do not classify as blocked.

---

# 37. Omission Outside Preview Window

If targeted occurrence exists but is outside range:

* `outsideWindow`.

No visible omission is necessary.

---

# 38. Duration/Priority Outside Window

Same principle.

The decision remains applicable but has no effect in this generation window.

---

# 39. Canonical Target Matching

Do not match decisions to generated objects by runtime IDs.

Construct/derive `DurableOccurrenceReference` for generated occurrences or otherwise compare using canonical source lifetime + occurrence coordinates.

Use `durableOccurrenceReferencesEqual` / canonical target key.

---

# 40. Efficient Matching

Avoid resolving every decision against every candidate with unbounded generation.

Possible approach:

* pre-evaluate decisions;
* index applicable in-window decisions by canonical target key;
* construct keys for generated occurrences.

Keep complexity reasonable but prioritize correctness over premature optimization.

---

# 41. Generated Occurrence Provenance

Audit whether candidate/work/manual runtime objects currently carry enough lineage to create durable references efficiently.

If a narrowly scoped reference/key propagation field is required, add it without changing schedule semantics or runtime IDs.

Document exactly what is added.

---

# 42. No Runtime ID Changes

Do not change:

* candidate IDs;
* work block IDs;
* scheduled block IDs;
* manual projection IDs;

unless absolutely necessary.

Durable decision matching must remain independent.

---

# 43. Pre-Placement Replay Stage

Implement omission, duration, and priority after occurrence expansion and before ordinary placement.

For template candidates:

```text
expanded candidate
    ↓
decision transform/suppress
    ↓
placement
```

---

# 44. Work/Manual Replay Stage

Because work/manual may enter generation through different paths, identify the equivalent stage before final scheduled-output assembly/friction.

Do not force all occurrence families through the template candidate pipeline if that would redesign the engine.

---

# 45. Hard Placement Integration

Integrate exact placement into `placeBlockCandidates` or a narrowly adjacent layer.

Preferred:

* mark a targeted candidate with hard requested start through a replay-specific wrapper/input;
* placement honors it exactly.

Avoid encoding PlanDecision domain types deep inside generic placement if a semantic placement constraint input suffices.

---

# 46. Placement Engine Boundary

Keep generic placement as reusable as possible.

Potential new internal constraint:

```text
exactStart?: Date
```

or equivalent semantic structure.

Do not persist it.

Do not expose PlanDecision storage concerns in placement code.

---

# 47. Anchored Occupurrence Placement

If target is already anchored/fixed:

* exact placement to its existing start may be trivially applied if semantically legal;
* moving an immovable anchored occurrence elsewhere must be inapplicable/blocked.

Audit current `movable` semantics.

---

# 48. Priority Integration

Ensure effective priority override influences the same ranking/order mechanism as authored priority.

Do not create a parallel decision-specific placement queue.

---

# 49. Duration Integration

Ensure duration override influences:

* gap-fit feasibility;
* scheduled end time;
* friction;
* final Preview display.

Do not mutate source.

---

# 50. Omission Integration

Ensure omitted occurrences do not:

* participate in placement;
* become unplaced;
* generate normal friction;
* receive SuggestedFixes as though they failed.

Replay result provides explainability.

---

# 51. Friction After Replay

Run existing friction detection on the replayed schedule.

Do not exempt decision-applied blocks.

An exact placement may create friction.

That friction should appear normally.

---

# 52. SuggestedFix After Replay

Existing SuggestedFix generation should operate on the resulting friction.

Do not make suggestions aware of decision persistence unless necessary to avoid nonsensical loops.

If a SuggestedFix directly contradicts an accepted decision, document the behavior.

Do not redesign suggestion policy in this task unless a correctness problem makes replay unusable.

---

# 53. Accepted Decision Versus Suggestion Conflict

Audit whether current SuggestedFix engine might immediately recommend undoing an accepted exact placement or omission consequence.

If so:

* document as deferred recommendation-awareness issue;
* do not silently suppress suggestions without an authorized policy.

---

# 54. Applicability Capability Matrix

Produce and implement an explicit capability matrix by target family.

For each:

* template;
* work;
* manual event;

determine whether V1 supports:

* place;
* omit;
* duration;
* priority.

Do not assume all 12 combinations are valid.

---

# 55. Capability Result

If target resolves but decision kind is semantically unsupported for that family:

return:

`inapplicable`

or a structured equivalent.

Do not call it stale.

---

# 56. Blocked Versus Inapplicable

Use:

## Inapplicable

The decision kind does not semantically apply to that occurrence under current authority.

## Blocked

The kind applies, but its requested hard outcome cannot currently be realized.

Example:

* place decision on immovable work → likely inapplicable;
* place decision on movable template but requested slot conflicts with hard event → blocked.

Define consistently.

---

# 57. Outside Window Versus Stale

Outside window remains a valid/applicable decision not exercised during this Preview.

It is not stale.

---

# 58. Per-Decision Outcome Completeness

Every valid current decision should receive exactly one replay outcome per Preview generation.

Even if outside range or stale.

This supports explainability and later Summary UI.

---

# 59. Deterministic Outcome Ordering

Return results in deterministic order independent of storage order.

Use canonical target key + decision ID as already established.

---

# 60. Invalid/Unsupported Stored Entries

Quarantined entries are not supplied to replay.

Defensive engine handling may still support invalid/unsupported outcomes if API is public.

Do not duplicate quarantine behavior in generation.

---

# 61. Stale Decisions

Stale decisions:

* have no schedule effect;
* produce corresponding derived outcome;
* remain durable.

No persistence mutation.

---

# 62. Reactivation

If a previously stale decision resolves again:

* replay should automatically evaluate/apply it;
* no new acceptance required.

This includes exact Backup V2 lifetime restoration.

---

# 63. Restart Replay

After restart:

* decision surface rehydrates;
* Active V2 rehydrates;
* generating Preview produces same replay effect as before restart.

Direct test required.

---

# 64. Profile Activation Replay

After profile activation:

* old decisions remain durable;
* fresh lifetimes produce staleLifetime outcomes;
* no old decision affects new schedule.

Direct integration test required.

---

# 65. Backup V1 Import Replay

Same semantic result:

* staleLifetime;
* no old decision effect.

---

# 66. Backup V2 Restore Replay

If exact target lifetimes/coordinates return:

* old decisions resolve;
* replay effects return.

Direct integration test required.

---

# 67. Ordinary Source Update

When source lifetime remains:

## occurrence still exists

decision re-evaluates and may apply.

## occurrence removed

`staleOccurrenceMissing`.

No decision mutation.

---

# 68. Manual Event Move

A manual-event target remains the same occurrence after ordinary date/time update.

If its PlanDecision kind remains semantically supported:

* re-evaluate against the moved event.

Do not bind replay to the old manual date unless the decision payload itself specifies placement.

---

# 69. Decision Target Outside Requested Range

Resolver may establish the target exists even if not generated in the final Preview range.

Do not expand final Preview solely to show it.

Return outsideWindow.

---

# 70. Planning Window Expansion

Current engine uses ±1 day expansion for generation.

Do not let replay accidentally leak blocks from the expansion buffer into visible Preview.

Preserve clipping semantics.

---

# 71. N-Per-Week Stability

PlanDecision targeting N-per-week occurrence must continue using canonical pre-clipping slot.

Test overlapping Preview ranges.

---

# 72. Weekly Stability

Weekly decision must target canonical user week regardless of Preview start.

---

# 73. Overnight Work Stability

Work decision resolution/replay uses local start date lineage.

Overnight end date must not alter matching.

---

# 74. Exact Placement And Overnight

If exact placement of a duration crosses midnight:

* use existing time arithmetic;
* friction/clipping behavior remains ordinary.

Do not reject merely because end date differs.

---

# 75. Manual Event Capability Audit

Document current manual-event fields:

* scheduled;
* movable;
* priority if any;
* duration;
* fixed semantics.

Use actual executable model.

---

# 76. Work Capability Audit

Document current work semantics:

* anchored;
* movable?;
* priority?;
* duration source;
* omission legality.

This may narrow V1 replay support relative to Task 2.33's abstract target-family matrix.

That is permitted if evidence requires it; record as capability refinement.

---

# 77. Template Capability Audit

Likely supports all four decisions when candidate is movable and fields exist.

Confirm.

---

# 78. Replay Does Not Modify Decision Authority

Generation must not:

* delete stale decisions;
* alter decision records;
* update acceptedAt;
* rewrite payload;
* change durability status;
* trigger persistence.

Direct subscriber/durability tests where feasible.

---

# 79. Replay Does Not Modify Authored Authority

Generation remains pure with respect to authored setup.

No source field mutation.

---

# 80. Replay Does Not Modify Profiles

No profile effects.

---

# 81. Replay Does Not Modify Backup

No backup effects.

---

# 82. Replay And Preview Staleness

Existing authored changes still mark Preview stale.

Decision changes currently do not alter Preview in Task 2.34.

Task 2.35 must determine how decision mutations affect Preview freshness.

This is important.

---

# 83. Decision Mutation Preview Invalidation

Once Preview derivation depends on PlanDecisions, accepting/removing/superseding a decision changes Preview inputs.

Therefore an existing Preview must no longer remain semantically fresh after decision authority changes.

Implement the narrowest correct behavior:

> PlanDecision runtime mutation marks an existing Preview stale.

Do not regenerate automatically unless current architecture requires it.

---

# 84. Decision Persistence Failure And Preview Staleness

If runtime decision authority advances but persistence fails:

* Preview still becomes stale because runtime derivation inputs changed;
* session decision authority remains current.

Durability failure does not undo stale marking.

---

# 85. Retry Does Not Change Preview Freshness

Persistence retry does not change decision runtime authority.

Therefore Retry alone should not newly stale or regenerate Preview.

---

# 86. Decision Removal Preview Invalidation

Removal changes generation inputs.

Mark existing Preview stale.

---

# 87. Quarantine/Recovery Preview Invalidation

If decision recovery replacement/abandonment changes runtime valid decision authority:

* Preview becomes stale.

Read-only recovery export/recheck does not.

Task 2.34 previously guaranteed Preview isolation; Task 2.35 must update only those operations whose runtime decision authority now participates in Preview derivation.

Document this deliberate architectural transition.

---

# 88. Decision Startup And Existing Preview

Preview is not persisted as authoritative history.

Normal startup semantics likely have no retained Preview issue.

Audit rather than assuming.

---

# 89. Preview Freshness Source Revision

Task 2.4 established authored revision-based Preview freshness.

PlanDecision is now an additional derivation authority.

Determine how freshness is tracked.

Options:

## A. mark stale imperatively on every decision authority mutation;

## B. add independent decision revision metadata into Preview freshness evidence.

Prefer the smallest change consistent with existing stale semantics.

Do not redesign Preview versioning broadly.

---

# 90. Preferred Freshness Strategy

If current Preview already uses `isStale` and explicit mutation marking, extend existing orchestration so decision authority mutation marks it stale.

Do not add persisted decision revision unless necessary.

---

# 91. Stale SuggestedFix Safety

After decision mutation stales Preview, existing Task 2.5 protections must disable SuggestedFix application until regeneration.

Direct integration test required.

---

# 92. Generate Preview With Decisions

Regeneration consumes current decision authority and produces a fresh Preview reflecting it.

After generation:

* Preview `isStale` false;
* decision results correspond to current decisions.

---

# 93. Try Path Preservation

Current `applySuggestedFixToPreview` remains Preview-only.

Trying a change must not create/modify PlanDecision.

---

# 94. Try Against Decision-Replayed Preview

Audit behavior.

A user may Try a SuggestedFix on a Preview already shaped by PlanDecisions.

This remains allowed if Preview fresh.

Try revision may temporarily override visible result, but regeneration restores durable decisions.

That is acceptable.

Document.

---

# 95. Accept UI Still Deferred

Do not add UI controls to convert Try into Accept.

Store acceptance API already exists; orchestration comes later.

---

# 96. No Decision Auto-Accept

No SuggestedFix action automatically persists a decision.

---

# 97. Replay Result Clone Isolation

Returned decision results must be clone-safe.

Do not expose mutable PlanDecision internals.

---

# 98. Replay Result Target

Prefer replay result to include a cloned durable target or decision ID sufficient for lookup.

Do not expose mutable store record references.

---

# 99. Engine Result Type

Extend `GenerateSchedulePreviewResult` as narrowly as necessary.

Potential:

```ts
planDecisionResults: PlanDecisionReplayResult[];
```

Document.

---

# 100. Existing Callers

Audit all callers/fixtures constructing `GenerateSchedulePreviewResult`.

Update intentionally.

Do not make replay-results optional merely to avoid test changes unless backward-compatible partial results are a deliberate API requirement.

---

# 101. No Decision Surface Import In Low-Level Generators

Prefer core engine input types, not state persistence manager types.

`generateSchedulePreview` may depend on core `PlanDecisionV1`.

Low-level recurrence/work generation should not import state surface modules.

---

# 102. Replay Helper Location

Likely dedicated modules:

* `core/decisions/evaluatePlanDecision.ts`;
* `core/decisions/replayPlanDecisions.ts`;

or equivalent.

Keep persistence logic out.

---

# 103. No Circular Dependency

Ensure `DurableOccurrenceReference`, generation, and PlanDecision modules do not form problematic cycles.

If necessary, isolate shared semantic types/helpers.

Do not broadly reorganize modules unless required.

---

# 104. Replay Capability Validation

Implement direct pure capability checks based on occurrence type/properties.

Avoid hard-coding UI concepts.

---

# 105. Placement Hard Constraint Representation

If introducing an internal placement constraint, ensure it is derived anew each generation from PlanDecision.

Do not mutate/store it on authored source.

---

# 106. Unplaced Semantics For Blocked Exact Placement

If exact placement cannot be realized:

* targeted occurrence should remain represented as unplaced if it normally would be a candidate;
* replay result `blocked`;
* do not attempt heuristic fallback.

This preserves schedule truth and visibility.

For work/manual anchored families where placement decision is inapplicable, leave ordinary authored occurrence unchanged and return inapplicable.

Refine based on capability audit.

---

# 107. Duration Decision And Unplaced Candidate

If shorter/longer accepted duration causes ordinary placement failure:

* decision was applied to candidate transformation;
* occurrence may be unplaced;
* replay outcome should distinguish applied transformation from final scheduling success.

This raises an important result issue.

---

# 108. Applied Meaning

Define `applied` carefully.

For duration/priority:

> the decision's transformation was incorporated into generation.

It does not guarantee the occurrence was scheduled.

For place:

> exact requested placement succeeded.

For omit:

> target was intentionally suppressed.

Document kind-specific applied semantics.

---

# 109. Blocked Duration

When should duration be blocked?

Examples:

* target type cannot change duration → inapplicable;
* payload semantically legal but violates hard source minimum → blocked/inapplicable depending source rules.

Define.

---

# 110. Priority Applied

Priority override is applied even if occurrence later remains unplaced.

Replay result may still be `applied`.

Do not conflate placement outcome with decision transformation.

---

# 111. Per-Decision Secondary Detail

Replay result may include details such as:

* scheduled;
* unplaced;
* omitted;
* effective duration;
* effective priority;
* exact placement start.

Keep derived detail minimal.

---

# 112. Friction Correlation

Do not add durable-reference fields to friction in this task.

Existing friction may identify generated blocks by runtime IDs.

Decision replay result is separate.

Future explainability can correlate as needed.

---

# 113. SuggestedFix IDs

No changes.

---

# 114. Decision Outcome Persistence

None.

---

# 115. Decision Outcome Subscriber

No dedicated store subscriber required; outcomes live in Preview generation result.

---

# 116. Generation Determinism

Directly prove equivalent:

* authored setup;
* PlanDecision collection;
* planning range/preferences;

produces structurally equivalent scheduling output and replay results.

Decision durable storage order must not affect result.

---

# 117. Different Decision Order

Supply same decision set in different array orders.

Output identical.

---

# 118. Stale Decision Order

Multiple stale/active decisions in different order produce same outcomes.

---

# 119. No Randomness

Replay does not allocate IDs beyond existing deterministic runtime generation behavior.

No decision/source allocator use.

---

# 120. Decision ID Independence

Changing only PlanDecisionId while holding target/kind/payload equal would represent a different accepted record but should yield equivalent scheduling effect.

Replay traversal/result identity will differ by decision ID, schedule semantics should not.

Test where useful.

---

# 121. acceptedAt Independence

Changing acceptedAt must not change scheduling.

---

# 122. Provenance Independence

User versus SuggestedFix provenance must not change replay behavior.

---

# 123. Decision Validation Defense

Engine may assume store-supplied valid records but should guard malformed direct callers according to public API style.

Do not throw unexpectedly.

---

# 124. Unsupported Kind Defense

Future PlanDecision kind/version must not be guessed.

---

# 125. Stale Source Missing Test

Valid persisted decision + deleted source:

* no schedule effect;
* result staleSourceMissing.

---

# 126. Lifetime Mismatch Test

Recreated same-ID source:

* no schedule effect;
* staleLifetime.

---

# 127. Occurrence Missing Test

Same lifetime but recurrence coordinate removed:

* no effect;
* staleOccurrenceMissing.

---

# 128. Profile Activation Integration Test

Old decisions do not affect freshly instantiated equivalent sources.

---

# 129. Backup V1 Integration Test

Old decisions do not affect new imported lifetimes.

---

# 130. Backup V2 Integration Test

Restored exact lifetimes reactivate decision scheduling effect.

---

# 131. Active V2 Restart Test

Decisions replay identically after full store restart.

---

# 132. Place Occurrence Test

Template candidate:

* accepted exact placement;
* regenerate;
* exact start;
* replay result applied;
* no heuristic alternative.

---

# 133. Place Blocked Test

Conflict with hard anchored event:

* no alternative placement;
* target unplaced or governed representation;
* result blocked;
* friction behavior coherent.

---

# 134. Place Outside Window Test

Decision target valid but requested/target occurrence not visible:

* outsideWindow;
* no expansion leakage.

---

# 135. Omit Test

Target omitted from normal schedule/unplaced output.

Replay result applied.

---

# 136. Duration Test

Target duration exact accepted value.

Placement uses new duration.

Authored source unchanged.

---

# 137. Priority Test

Target effective priority changes placement ranking where competing flexible candidates make outcome observable.

Authored source unchanged.

---

# 138. Work Capability Tests

Directly cover every supported/unsupported V1 kind on work based on audit result.

---

# 139. Manual Capability Tests

Same.

---

# 140. Template Capability Tests

Same.

---

# 141. Overnight Work Test

Reference matching and applicable replay remain correct across midnight.

---

# 142. Weekly Test

Decision persists across overlapping Preview windows.

---

# 143. N-Per-Week Test

Stable slot replay.

---

# 144. Manual Move Test

Existing manual-event lifetime after authored move still resolves; decision capability outcome follows current semantics.

---

# 145. Decision Mutation Stales Preview Test

Generate fresh Preview.

Accept decision through store.

Assert:

* Preview retained;
* `isStale` true;
* existing schedule content unchanged until regeneration;
* SuggestedFix actions unavailable through existing stale guard.

---

# 146. Decision Removal Stales Preview Test

Same.

---

# 147. Supersession Stales Preview Test

One runtime authority mutation → stale.

---

# 148. Acceptance Persistence Failure Stales Preview Test

Runtime decision accepted despite storage failure.

Preview stale.

---

# 149. Retry Does Not Restale Test

No runtime authority change.

---

# 150. Quarantine Removal Preview Test

Quarantine removal does not affect valid decision authority.

Therefore Preview should not stale solely due to quarantine cleanup.

---

# 151. Protected Recovery Replacement Preview Test

If valid runtime decision collection changes as part of replacement:

* stale Preview.

If replacement merely rewrites identical current collection:

* determine whether stale marking is needed.

Prefer semantic authority comparison rather than unconditional stale if cheap.

---

# 152. Protected Abandonment Preview Test

Clearing runtime decisions changes derivation inputs if any valid decisions existed.

Mark Preview stale.

---

# 153. Full Clear Test

Existing full clear resets Preview anyway under current behavior.

No additional complexity.

---

# 154. State Subscriber Semantics

Decision mutations now may update Preview stale flag, which is part of state.

This is a deliberate change from Task 2.34.

Therefore:

* decision subscriber fires;
* state subscriber may now fire because Preview staleness changed;
* if no Preview exists, ordinary state need not change.

Document exact behavior.

---

# 155. No Preview Case

Accept/remove decision when `preview === null`:

* no state mutation;
* decision authority changes normally.

---

# 156. Already-Stale Preview

Accept/remove decision while Preview already stale:

* no redundant state notification unless existing store conventions emit one;
* decision authority changes.

Document.

---

# 157. Replay Regeneration Freshness

After `generatePreview()` with current decisions:

* new Preview fresh;
* decision effects visible;
* replay results included.

---

# 158. Current Try Tests

All existing Preview revision tests remain green.

---

# 159. Current SuggestedFix Stale Tests

Remain green and extend to decision-induced staleness.

---

# 160. Persistence Independence Tests

Generating Preview does not change decision durability.

---

# 161. Replay Does Not Persist

No decision storage write during generation.

Direct spy test if practical.

---

# 162. Replay Does Not Notify Decision Subscribers

Generation is read-only.

---

# 163. Preview Snapshot Isolation

Replay results in returned/store Preview clones must be clone-isolated.

---

# 164. Store Snapshot Isolation

Decision records remain separate; Preview replay result mutations cannot mutate decisions.

---

# 165. Engine Boundary Tests

Add focused core tests without store.

---

# 166. Store Integration Tests

Add tests proving current store decision collection is passed into generation.

---

# 167. UI Tests

No new UI feature.

Only update UI tests if rendering Preview object shape/replay metadata requires it.

Do not expose decision results visually yet unless existing generic rendering automatically does.

---

# 168. Replay Result UI Boundary

No UI display of replay outcomes in Task 2.35.

They exist for future Summary/Accept management.

---

# 169. Expected Production Files

Likely changes:

* new `core/decisions/evaluatePlanDecision.ts`;
* new `core/decisions/replayPlanDecisions.ts`;
* associated tests;
* `generateSchedulePreview.ts`;
* `placeBlockCandidates.ts` or narrowly adjacent placement code;
* relevant block/work/manual types if derived replay metadata is needed;
* `dayFrameStore.ts` for supplying decisions and stale marking;
* Preview result types;
* store/engine tests.

Do not modify persistence modules except perhaps shared type imports.

---

# 170. Reference Audit

Before completion, audit:

* all generation entry points;
* PlanDecision imports;
* DurableOccurrenceReference construction/resolution;
* placement;
* friction;
* SuggestedFix;
* Preview staleness;
* decision persistence writers.

Confirm no replay bypass path.

---

# 171. No-Replay-Bypass Audit

Any production Preview generation path must consume current decisions.

If there are alternate engine entry points used only for tests, classify clearly.

Do not allow the store's main generation to omit decision authority.

---

# 172. Direct Engine Call Semantics

If `generateSchedulePreview` is public and callers omit decisions, decide:

* default empty list; or
* required explicit list.

Prefer explicitness, but avoid unnecessary API churn.

Document.

---

# 173. Decision Capability Matrix Deliverable

Result must include:

| Target family | Place | Omit | Duration | Priority | Evidence |
| ------------- | ----: | ---: | -------: | -------: | -------- |

---

# 174. Replay Stage Matrix

| Decision kind | Applicability stage | Replay stage | Hard/soft |
| ------------- | ------------------- | ------------ | --------- |

---

# 175. Replay Outcome Matrix

| Condition | Outcome | Schedule effect |
| --------- | ------- | --------------- |

Cover:

* resolved/applied;
* outsideWindow;
* sourceMissing;
* lifetimeMismatch;
* occurrenceMissing;
* inapplicable;
* blocked;
* invalid/unsupported.

---

# 176. Freshness Matrix

| Decision operation | Preview exists/fresh | Preview stale? | Regenerate automatically? |
| ------------------ | -------------------: | -------------: | ------------------------: |

Cover:

* accept;
* supersede;
* remove;
* retry;
* quarantine removal;
* recovery replace;
* recovery abandon.

---

# 177. Cross-Surface Matrix

| Transition | Decision record retained? | Replay effect |
| ---------- | ------------------------: | ------------- |

Cover:

* restart;
* Profile V2 activation;
* Backup V1 import;
* Backup V2 restore;
* source update;
* delete/recreate;
* active abandonment;
* full clear.

---

# 178. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.35_IMPLEMENT_PLANDECISION_V1_APPLICABILITY_EVALUATION_AND_DETERMINISTIC_SCHEDULE_REPLAY_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contract
4. Initial Generation Audit
5. Files Changed
6. Generation API Boundary
7. Store Generation Integration
8. Applicability Evaluator
9. Applicability Result Contract
10. Replay Result Contract
11. Preview Result Integration
12. Outside-Window Semantics
13. Capability Matrix
14. Template Capabilities
15. Work Capabilities
16. Manual-Event Capabilities
17. Omit Semantics
18. Duration Semantics
19. Priority Semantics
20. Exact Placement Semantics
21. Placement Coordinate Resolution
22. Boundary-Change Semantics
23. Placement Feasibility
24. Blocked Placement
25. Pre-Placement Replay
26. Placement Integration
27. Runtime-ID Independence
28. Canonical Target Matching
29. Friction Integration
30. SuggestedFix Interaction
31. Replay Outcome Completeness
32. Outcome Ordering
33. Stale Decision Behavior
34. Reactivation
35. Restart Replay
36. Profile Activation
37. Backup V1 Import
38. Backup V2 Restore
39. Ordinary Update
40. Manual Move
41. Weekly / N-per-Week Stability
42. Overnight Work
43. Decision Authority Purity
44. Authored Authority Purity
45. Preview Freshness Change
46. Acceptance Staleness
47. Removal Staleness
48. Retry Freshness
49. Recovery Freshness
50. State Subscriber Semantics
51. Preview Regeneration Freshness
52. Try Preservation
53. Replay Result Isolation
54. Engine Tests
55. Store Integration Tests
56. Scheduling Determinism
57. Persistence Independence
58. No-Replay Persistence Audit
59. Reference Audit
60. No-Replay-Bypass Audit
61. Capability Matrix
62. Replay Stage Matrix
63. Replay Outcome Matrix
64. Freshness Matrix
65. Cross-Surface Matrix
66. Architectural Alignment Assessment
67. Deviations
68. Discoveries and Deferred Work
69. Recommended Next Task
70. Focused Validation
71. Full Validation
72. Final Completion Determination

---

# 179. Validation Requirements

Run focused tests for:

* applicability evaluator;
* target-family capability;
* omission;
* duration;
* priority;
* exact placement;
* blocked exact placement;
* outside window;
* stale outcomes;
* profile activation;
* Backup V1 import;
* Backup V2 reactivation;
* weekly/N-per-week;
* overnight work;
* Preview staleness after decision mutation;
* decision persistence independence.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact test-file and test-count results.

---

# 180. Completion Criteria

Task 2.35 is complete only when:

* current Preview generation consumes current valid PlanDecision authority;
* generation APIs receive decisions explicitly;
* applicability is pure and Preview-independent;
* reference outcomes map correctly;
* unsupported target/kind combinations are inapplicable rather than silently misapplied;
* omission suppresses only the targeted occurrence;
* duration applies exact occurrence-specific duration where supported;
* priority applies exact occurrence-specific effective priority where supported;
* exact placement is hard and never silently falls back;
* blocked exact placement is explicitly reported;
* outside-window decisions are distinguished from stale decisions;
* every current valid decision receives one replay result;
* replay result order is deterministic;
* storage order does not change scheduling;
* stale decisions have no scheduling effect;
* Backup V2 restoration can reactivate retained decisions;
* Profile V2 activation and Backup V1 import do not retarget old decisions;
* source recreation does not retarget;
* scheduling remains deterministic;
* friction runs after replay;
* current Try behavior remains Preview-only;
* decision acceptance/removal/supersession now stale an existing Preview because decision authority is a Preview input;
* retry/quarantine-only operations do not incorrectly stale Preview;
* stale Preview SuggestedFix protections still work;
* regeneration produces fresh decision-aware Preview;
* replay does not persist or mutate decisions;
* replay does not mutate authored state;
* decision durability remains unchanged by generation;
* no Accept UI is introduced;
* no decision persistence changes are introduced;
* no new PlanDecision kinds are introduced;
* no Backup V3/history is introduced;
* full validation passes;
* result artifact is complete.

---

# 181. Explicit Non-Goals

Do **not**:

* add Accept UI;
* add decision-management UI;
* change PlanDecision durable schema;
* change PlanDecision persistence;
* change DurableOccurrenceReference V1;
* implement conflict decisions;
* implement `convertToRecovery`;
* implement `acceptConflict`;
* implement Backup V3;
* persist replay outcomes;
* add execution/history;
* add multi-decision composition;
* retarget stale decisions;
* auto-delete stale decisions;
* mutate authored sources during replay;
* use runtime IDs for durable matching;
* rewrite SuggestedFix policy broadly;
* redesign placement beyond the narrow hard-constraint support required;
* perform unrelated engine refactors.

---

# 182. Stop Conditions

Stop and report if:

* any V1 decision kind cannot be replayed without contradicting authored-source authority;
* exact placement cannot be represented without redesigning placement architecture;
* work/manual capability semantics contradict Task 2.33 materially;
* replay requires mutating durable PlanDecision records;
* replay requires changing DurableOccurrenceReference V1;
* decision matching cannot be made runtime-ID-independent;
* Preview freshness cannot incorporate decision authority without broad state-version redesign;
* replay makes scheduling nondeterministic;
* accepted decisions cannot coexist with existing friction detection;
* full-suite failures reveal an unrelated architectural regression.

Recommend the narrowest corrective/prerequisite task.

---

# 183. Recommended Follow-On Boundary

If Task 2.35 completes successfully, the next task should connect the durable/replay layers to explicit user acceptance.

Recommended:

> **Task 2.36 — Implement Try → Accept PlanDecision Orchestration and Minimal Acceptance UX**

That task should:

* preserve existing Try;
* add explicit Accept for supported SuggestedFix outcomes;
* require fresh Preview;
* reconstruct durable semantic intent;
* call `acceptPlanDecision`;
* regenerate Preview;
* report persistence and replay outcome;
* expose accepted/stale/blocked decision status minimally.

Do not add broad decision-management UX until the acceptance path is proven.

---

# 184. Task Determination

**Authorized:** pure PlanDecision V1 applicability evaluation, deterministic replay into Preview generation, exact supported kind semantics, capability validation, per-decision replay outcomes, placement hard constraints, friction integration, store generation wiring, and decision-authority-driven Preview staleness.

**Not authorized:** Accept UI, decision persistence changes, new decision kinds, DurableOccurrenceReference changes, Backup V3, conflict/recovery decisions, execution history, broad recommendation redesign, or unrelated engine refactoring.

The governing replay principle is:

> Accepted PlanDecision authority constrains derived scheduling only when its exact lifetime-safe occurrence target and semantic action remain applicable; stale or infeasible intent is reported explicitly and never silently retargeted or degraded into a different scheduling choice.

---

# 185. Final Completion Statement

**Task 2.35 is complete when DayFrame deterministically derives Preview from authored authority plus current PlanDecision V1 authority; evaluates every valid decision through lifetime-safe DurableOccurrenceReference resolution and target-family capability rules; applies omission, exact duration, and exact priority before ordinary placement and exact user-day-relative placement as a hard non-fallback placement constraint; reports applied, outside-window, stale, inapplicable, blocked, invalid, and unsupported outcomes without mutating durable decision authority; runs ordinary friction detection over the replayed result; preserves Try as Preview-only behavior; marks existing Preview stale whenever runtime PlanDecision authority changes; restores decision effects after regeneration/restart/Backup V2 lifetime restoration while never retargeting Profile V2, Backup V1, recreated, missing, or occurrence-removed targets; remains deterministic, runtime-ID-independent, persistence-free during generation, and fully regression-tested; passes complete repository validation; and introduces no Accept UI, decision persistence change, new decision kind, Backup V3, history, or unrelated scheduling behavior.**
