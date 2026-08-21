# Task 2.22 — Establish Suggested-Fix Acceptance and Preview-Revision Authority

**Project:** DayFrame  
**Phase:** Phase 2 — Authority and State Alignment  
**Task ID:** 2.22  
**Execution Type:** Investigation / Architectural Authority Decision  
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing the investigation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.22_ESTABLISH_SUGGESTED_FIX_ACCEPTANCE_AND_PREVIEW_REVISION_AUTHORITY_RESULT.md`

This task is investigation and architectural decision only.

Do not modify:

- production code;
- tests;
- store APIs;
- suggested-fix behavior;
- Preview behavior;
- authored state;
- persistence;
- source identity;
- OccurrenceIdentity;
- PlanDecision;
- history/execution state;
- architecture governance documents;
- checkpoints.

No implementation is authorized by this task.

If the evidence is insufficient to determine the authority class of a suggested-fix type, classify that type as unresolved rather than assigning semantics from its name.

---

# 2. Purpose

Task 2.1 established that DayFrame's generated Preview is derived, non-durable state whose ordinary source is current authored authority plus generation inputs.

Task 2.1 also discovered an architectural mismatch:

    authored state A
        ↓
    generate Preview P
        ↓
    accept suggested fix
        ↓
    Preview becomes P′

while:

    authored authority remains A

A later regeneration from unchanged authored authority can therefore discard the accepted revision.

Task 2.5 subsequently prevented suggested-fix application against stale Preview state, ensuring that a fix cannot operate against derived state that no longer corresponds to current authored authority.

Tasks 2.10–2.15 strengthened:

- occurrence identity;
- current authored-source uniqueness;
- complete authored-state validity;
- authority acceptance.

Tasks 2.16–2.21 completed historical-ingress and recovery authority.

The unresolved question is now narrower:

> What authority does an accepted suggested fix represent?

Task 2.22 must answer that question before DayFrame introduces:

- PlanDecision;
- durable planning overrides;
- replayable Preview decisions;
- durable occurrence references;
- revision history.

---

# 3. Core Architectural Question

Task 2.22 must answer:

> When a user accepts a suggested fix against a fresh Preview, is that action merely a disposable transformation of derived Preview state, a change to authored scheduling intent, a planning decision that must survive regeneration, or another explicitly governed form of information?

Do not answer this globally without first examining individual suggested-fix classes.

Different fix types may have different authority semantics.

---

# 4. Governing Architectural Context

Current relevant authority boundaries include:

## Authored authority

`DayFrameAuthoredSetup`

contains:

- scheduling preferences;
- Preview range configuration;
- shift definitions;
- shift cycles;
- block templates;
- block recurrences;
- manual events.

## Derived Preview

Generated from authored authority and generation provenance.

Contains:

- generated work blocks;
- candidates;
- scheduled blocks;
- unplaced candidates;
- friction;
- suggested fixes;
- Preview metadata.

## Preview revision

`applySuggestedFixToPreview` / `reviseSchedulePreview` can transform derived Preview state without changing authored state.

## Staleness

Task 2.5 prevents revision of stale Preview state.

## Occurrence identity

Task 2.10 introduced versioned runtime semantic occurrence identity.

It is not durable-reference safe.

## Source incarnation

Still unresolved.

## PlanDecision

Not implemented and not yet architecturally defined.

---

# 5. Objective

Determine:

1. every current suggested-fix type;
2. how each fix is generated;
3. what source information it references;
4. how each fix is applied;
5. what derived state each fix changes;
6. whether it changes authored state;
7. whether its effect survives regeneration;
8. whether equivalent authored inputs reproduce its accepted result;
9. whether acceptance expresses user intent beyond the original authored setup;
10. whether that intent should survive regeneration;
11. whether that intent should survive app restart;
12. whether that intent belongs in authored state;
13. whether it instead belongs in a future PlanDecision-like object;
14. whether some fix types are intentionally ephemeral;
15. whether `changeFixedTime` is already an authored-intent handoff rather than a Preview revision;
16. whether current `actionFeedback` represents authority or merely presentation;
17. whether Preview revision requires history/replay semantics;
18. whether source incarnation is a prerequisite for durable accepted fixes;
19. whether OccurrenceIdentity V1 is sufficient for session-only decisions;
20. what implementation sequence should follow.

---

# 6. Current Suggested-Fix Inventory

Inspect all production suggested-fix definitions and generators.

At minimum identify every current action/fix discriminant used by:

- `generateSuggestedFixes`;
- friction result structures;
- `applySuggestedFix`;
- `reviseSchedulePreview`;
- store revision orchestration;
- `PreviewScreen`;
- `DayFrameApp`.

Do not infer the inventory solely from type names.

Produce:

| Suggested Fix Type | Generator | User-Facing Action | Application Path | Current Authority Effect |
| --- | --- | --- | --- | --- |

---

# 7. Fix-Type Classification

For every current fix type classify its current behavior as one of:

- Preview-only schedule mutation;
- navigation to authored editing;
- no-op/advisory;
- another evidence-supported category.

Do not yet assign future authority semantics.

---

# 8. `changeFixedTime`

Task 2.1 found that `changeFixedTime` behaves differently from automatic Preview revisions.

Its current path is conceptually:

    suggested fix
        ↓
    navigate to Setup
        ↓
    focus authored fixed-time field
        ↓
    user edits
        ↓
    authored commit
        ↓
    regenerate Preview

Determine whether this should be classified as:

> a recommendation to change authored intent rather than an accepted planning revision.

If yes, state that clearly.

Determine whether pressing `Review fixed time` itself carries any durable authority.

Likely not; verify.

---

# 9. Preview-Only Fix Types

For every fix that currently modifies:

- scheduled blocks;
- unplaced candidates;
- friction;
- related Preview output

without modifying authored state:

determine exactly what acceptance means today.

Document:

- original occurrence;
- revised occurrence;
- whether recurrence/template/work/manual sources remain unchanged;
- whether source identity remains attached;
- whether revision metadata is retained.

---

# 10. Regeneration Test

For each Preview-only fix type, establish current behavior:

    generate Preview P
        ↓
    accept fix F
        ↓
    obtain P′
        ↓
    regenerate from same authored setup
        ↓
    P or P′ ?

Do not assume.

Use direct engine/store tests or executable behavior.

This is central evidence.

---

# 11. Deterministic Regeneration Boundary

Task 2.1 established that the underlying planning engine is deterministic for equivalent authored inputs and generation conditions.

Determine whether accepted Preview revisions violate the practical expectation:

> Current visible plan can be reconstructed from authoritative state.

If revised Preview cannot be reconstructed, classify the precise mismatch.

---

# 12. User Intent Question

For each fix ask:

> Does accepting this fix communicate a user preference or decision that DayFrame should remember?

Examples may include:

- move this occurrence here;
- skip this occurrence;
- choose this opening;
- alter this specific instance;
- change future recurrence behavior.

Do not infer intent merely because the user clicked a button.

Use product semantics and existing copy.

---

# 13. Ephemeral Experiment Model

Candidate authority model:

> Accepted fix is an intentionally disposable Preview experiment.

Under this model:

- authored state remains unchanged;
- regeneration discards the revision;
- reload discards the revision;
- the result is not promised to persist;
- user can explore alternative schedules non-destructively.

Assess:

- consistency with current UI language;
- user expectation;
- explainability;
- usefulness;
- architecture.

---

# 14. Authored Mutation Model

Candidate authority model:

> Accepted fix changes underlying authored scheduling intent.

Possible consequences:

- mutate template time/window;
- mutate recurrence;
- mutate manual event;
- mutate another authored source.

Assess whether each fix actually contains enough information to determine a valid authored mutation.

Determine whether applying the fix broadly would unintentionally alter future occurrences when the user intended only one occurrence.

This is critical.

---

# 15. Occurrence-Specific Authored Override Model

Candidate model:

> Accepted fix becomes authored planning data applying to one semantic occurrence.

This could conceptually require a new authored object such as:

- occurrence override;
- exception;
- explicit commitment;
- another named authored source.

Assess without designing implementation.

Determine whether this still belongs in `DayFrameAuthoredSetup`.

---

# 16. PlanDecision Model

Candidate model:

> Accepted fix becomes a PlanDecision: explicit user acceptance of one derived planning alternative against a semantic occurrence.

Assess whether such an object would need:

- occurrence identity;
- action type;
- selected outcome;
- provenance;
- authored-state revision/source lineage;
- replay semantics;
- invalidation rules;
- persistence.

Do not define the full PlanDecision model unless required to classify authority.

---

# 17. Replayable Command Model

Candidate model:

> Accepted fix is stored as a command that can be replayed after regeneration.

Assess:

- deterministic replay;
- stale source behavior;
- source disappearance;
- window changes;
- recurrence changes;
- occurrence identity;
- ordering between multiple commands.

Determine whether this is meaningfully different from PlanDecision or merely an implementation strategy.

---

# 18. Required Authority Model Matrix

Produce:

| Model | Survives Regeneration | Survives Restart | Alters Authored Intent | Occurrence-Specific | Requires New Domain Object | Explainable | Recommendation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| ephemeral Preview experiment | | | | | | | |
| direct authored mutation | | | | | | | |
| authored occurrence override | | | | | | | |
| PlanDecision | | | | | | | |
| replayable command | | | | | | | |

---

# 19. Per-Fix Authority Matrix

For each fix type produce:

| Fix Type | Current Behavior | User Intent Scope | Should Survive Regeneration? | Proposed Authority Class | Rationale |
| --- | --- | --- | ---: | --- | --- |

This matrix is mandatory.

Do not force all fixes into one class.

---

# 20. Instance Versus Pattern Scope

For every accepted fix determine whether intent applies to:

- one occurrence;
- all future occurrences of the recurrence;
- all occurrences in a range;
- the source template itself;
- the entire schedule.

This distinction must be explicit.

A one-occurrence move must not be casually translated into a template-wide authored mutation.

---

# 21. Work Occurrence Fixes

If suggested fixes can affect generated work blocks, determine:

- whether work is considered immutable authored commitment;
- whether moving work is allowed;
- whether such a fix actually means editing shift/cycle authority;
- whether Preview-only revision is semantically legitimate.

Use current fix inventory.

---

# 22. Manual Event Fixes

If fixes can affect manual-event projections:

determine whether accepted movement should:

- mutate the authored manual event;
- create an occurrence-specific planning decision;
- remain ephemeral.

Manual events are anchored user-authored events, so Preview-only mutation may conflict with source authority.

Use executable evidence.

---

# 23. Template / Recurrence Occurrence Fixes

For flexible generated blocks determine whether a movement/skip is:

- occurrence-specific;
- template-wide;
- recurrence-wide;
- ephemeral.

This is likely the central use case for a future PlanDecision.

---

# 24. Skip Semantics

If a current fix can skip/drop an occurrence, determine whether acceptance means:

> I do not want this occurrence in this plan

or:

> I no longer want this recurring commitment.

These are very different authorities.

Classify from current behavior/copy.

---

# 25. Move Semantics

If a current fix moves an occurrence:

determine whether the move means:

- choose another available placement for this occurrence only;
- revise preferred placement for all future occurrences;
- simply preview one alternative.

Do not infer broad authored meaning from a local move.

---

# 26. Suggested Fix Provenance

Inspect current fix objects for enough provenance to reconstruct:

- friction source;
- affected occurrence;
- target position/outcome;
- reason;
- generation timestamp;
- fix ID.

Determine whether current suggested-fix structure is:

- presentation recommendation only;
- sufficient to become durable decision;
- insufficient for durable semantics.

---

# 27. OccurrenceIdentity Coverage

Determine which suggested-fix types currently carry or can reach:

`OccurrenceIdentity`

for the affected occurrence.

Classify:

- direct occurrence identity available;
- indirect through scheduled block/candidate;
- no semantic occurrence identity.

This informs PlanDecision readiness.

---

# 28. OccurrenceIdentity V1 Adequacy — Session Only

Determine whether V1 identity is sufficient to identify an occurrence **within the current active authored lineage/session** for a non-durable planning decision.

Likely stronger than durable use.

Confirm.

---

# 29. OccurrenceIdentity V1 Adequacy — Durable

Task 2.10 explicitly stated V1 identity is not durable foreign-key safe because source IDs can be reused across lifetimes.

Task 2.22 must preserve this limitation.

If accepted fixes should survive restart, determine whether source incarnation becomes a prerequisite.

---

# 30. Source-Incarnation Dependency

For any proposed durable occurrence-specific fix authority, explicitly assess:

    durable accepted decision
        ↓
    references occurrence identity
        ↓
    source deleted/recreated or profile/backup restored
        ↓
    can decision still know whether this is the same source lifetime?

If not, source incarnation is a blocker.

---

# 31. Authored-State Revision / Lineage Dependency

Task 2.5 ensures a fix is applied only to a fresh Preview.

But if a decision is persisted and later authored state changes, determine how it knows whether it is still applicable.

Possible requirements:

- source identity;
- occurrence identity;
- authored-state revision/version;
- dependency fingerprint;
- semantic revalidation.

Do not design implementation, but identify required authority facts.

---

# 32. Generation Window Dependency

A semantic occurrence may appear in multiple overlapping Preview windows.

Task 2.10 made identity stable across overlapping windows.

Determine whether an accepted occurrence-specific decision should:

- apply whenever that occurrence appears in any later Preview window;
- apply only to the exact Preview generation;
- expire outside the original range.

This is fundamental to replay semantics.

---

# 33. Regeneration Scope

If accepted decision should survive regeneration, determine whether it survives:

- same range regeneration;
- overlapping range;
- larger range;
- smaller range;
- cycle-source range recalculation.

Use occurrence identity evidence.

---

# 34. Authored Mutation Invalidation

If authored inputs affecting a decided occurrence change:

examples:

- template duration;
- recurrence weekday;
- fixed time;
- cycle day boundary;
- shift pattern.

Determine whether the accepted decision should:

- remain;
- revalidate;
- become stale;
- be discarded;
- become friction.

Do not implement.

---

# 35. Decision Conflict

If multiple accepted decisions affect the same occurrence:

- latest wins?
- decisions compose?
- conflict?
- replace previous?

Task 2.22 only needs to determine whether conflict policy is a necessary prerequisite for implementation.

Do not build it.

---

# 36. Decision Ordering

If decisions can move multiple occurrences, replay order may affect scheduling.

Determine whether a durable/replayable model requires:

- deterministic ordering;
- timestamp order;
- explicit sequence;
- engine reconciliation.

This may be a reason not to model accepted fixes as raw replay commands.

---

# 37. Planning Engine Authority

Determine where a future accepted decision would enter planning.

Potential architecture:

    authored intent
        ↓
    generate candidates
        ↓
    apply PlanDecisions / overrides
        ↓
    placement
        ↓
    friction

or another location.

Do not redesign engine yet.

Identify only the logically required boundary.

---

# 38. Suggested-Fix Engine Responsibility

Suggested fixes are currently generated from friction/derived Preview.

Determine whether the suggested-fix engine should remain advisory even if accepted fixes become authoritative elsewhere.

Preferred separation may be:

    SuggestedFix
        → recommendation

    accepted SuggestedFix
        → creates another authority object

rather than mutating SuggestedFix itself into authority.

Assess.

---

# 39. Recommendation Versus Decision

Establish whether this distinction should become explicit:

> SuggestedFix is advisory derived information.

> User acceptance creates authoritative planning information of another type.

This is likely important to architectural layering.

Adopt or reject.

---

# 40. Derived Object Category

Determine whether SuggestedFix should remain a Derived Domain Object or equivalent derived recommendation.

Do not let user acceptance retroactively change the category of the same object if this conflicts with the architecture rule that Named Domain Objects do not change categories.

If acceptance requires authority, likely create a new object.

Assess against Architecture Specification.

---

# 41. Named Domain Object Requirement

If accepted fix becomes a persistent/replayable planning object, determine whether it should eventually be a Named Domain Object.

If yes, architectural rules require:

- producing service;
- owning pillar;
- information transformation;
- provenance.

Do not invent these unless needed for the determination.

Identify the likely architectural consequence.

---

# 42. Transformation Classification

If a user accepts a suggestion, what information transformation is occurring?

Possible:

- Author;
- Derive;
- another existing transformation through an architectural service.

The architecture only permits its established transformations.

Determine whether user acceptance is naturally **Author** even if the object records a planning decision.

---

# 43. Pillar Ownership

If a future PlanDecision exists, likely Plan pillar ownership may apply.

Verify from specification rather than assuming.

No implementation.

---

# 44. Service Ownership

If user acceptance produces a Named Domain Object, the architecture requires an Architectural Service to produce it.

Determine whether current UI/store revision path violates that future model.

Do not create service yet.

---

# 45. Current `reviseSchedulePreview`

Assess the architectural role of `reviseSchedulePreview`.

Today it:

- coordinates application of a fix;
- recomputes friction;
- returns revised derived output.

Determine whether this is:

- legitimate Preview experimentation engine;
- temporary substitute for PlanDecision replay;
- mixed responsibility.

Classify.

---

# 46. Current `applySuggestedFix`

Inspect whether it contains business logic that:

- moves blocks;
- skips blocks;
- changes placement.

Determine whether these are legitimate derived transformations versus planning-authority operations.

Use architectural service/engine rules.

---

# 47. `actionFeedback`

Determine whether `actionFeedback` is:

- workflow feedback only;
- derived revision metadata;
- implicit record of accepted decision.

Task 2.1 classified it as derived workflow metadata.

Confirm.

Do not treat it as history if it cannot reconstruct prior actions.

---

# 48. Revision History Absence

Task 2.1 found no durable or ordered history of accepted fixes.

Confirm current state after Tasks 2.2–2.21.

Determine whether a future authority model requires:

- current set of decisions only;
- ordered command history;
- audit history;
- none.

Do not add history unless necessary.

---

# 49. Undo Requirement

If accepted decisions become authoritative, determine whether undo semantics are architecturally required before implementation.

Possible models:

- remove/replace current decision;
- historical undo log;
- regenerate without decision.

Do not assume full undo stack.

Classify as prerequisite or later UX.

---

# 50. Persistence Requirement

For each proposed fix authority class determine expected persistence:

| Authority Class | Session | Regeneration | Restart | Profiles | Backup |
| --- | ---: | ---: | ---: | ---: | ---: |
| ephemeral Preview | | | | | |
| authored mutation | | | | | |
| authored occurrence override | | | | | |
| PlanDecision | | | | | |

This matrix is mandatory.

---

# 51. Profile Semantics

If accepted decisions become durable, determine whether profiles should capture them.

Questions:

- is a profile a snapshot of authored scheduling intent only?
- should planning choices belong to profiles?
- would loading a profile restore accepted occurrence decisions?

Do not decide casually.

Task 2.1 established profiles currently contain complete `DayFrameAuthoredSetup` only.

---

# 52. Backup Semantics

Likewise determine whether future backup should contain accepted planning decisions.

Backups currently contain authored setup only.

If decisions are separate durable user data, compatibility/versioning implications follow.

Identify but do not implement.

---

# 53. Active Persistence Semantics

If accepted decisions become durable but separate from authored setup:

determine whether they belong:

- in active local state;
- a separate durable surface;
- future plan record;
- another model.

Do not choose implementation storage prematurely.

---

# 54. Session-Only Decision Model

Consider whether Phase 2 can first support:

> accepted fix survives Preview regeneration during the current session but is not durable across restart.

Assess value and architectural risk.

This could use V1 occurrence identity without source-incarnation persistence issues.

But introducing a temporary authority model may create migration debt.

Compare.

---

# 55. Durable-First Decision Model

Alternative:

> Do not introduce PlanDecision until durable identity/incarnation is solved.

Assess whether current Preview-only revision can remain as explicit ephemeral exploration meanwhile.

This may be cleaner.

---

# 56. Required Staging Matrix

| Staging Model | Immediate UX Value | Architectural Debt | Requires Incarnation Now | Persistence Change | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| keep ephemeral until durable model ready | | | | | |
| session-only PlanDecision first | | | | | |
| durable PlanDecision directly | | | | | |

---

# 57. UI Language Audit

Audit current suggested-fix button/feedback language.

Determine whether copy implies:

- permanent change;
- accepted schedule decision;
- temporary Preview change;
- generic action without persistence promise.

This evidence matters for user expectation.

Do not change copy in this task.

---

# 58. Preview Persistence Communication

Determine whether current UI informs users that revised Preview choices disappear after regeneration/reload.

If not, and if the adopted model remains ephemeral, identify a future communication requirement.

---

# 59. Stale Protection Sufficiency

Task 2.5 ensures stale Preview cannot be revised.

Determine whether this is sufficient for ephemeral experimentation.

Likely yes.

If accepted decisions become replayable, additional staleness/revalidation semantics are required.

---

# 60. Fresh Preview Authority

A fresh Preview corresponds to current authored state at generation.

Determine whether this provides enough authority to create a **session-only** accepted decision safely.

Likely yes for current lineage if occurrence identity is available.

Confirm.

---

# 61. Manual Fixed-Time Edit Handoff

Determine whether `changeFixedTime` establishes a useful pattern:

    suggestion
        ↓
    user reviews authored source
        ↓
    explicit authored edit
        ↓
    new Preview

Ask whether other suggested fixes should similarly route back to authored/planning editing rather than directly mutating Preview.

Do not assume.

---

# 62. Automatic Fix Convenience

Direct Preview revision may be valuable because it lets the user immediately see what a suggested change would do.

Determine whether Preview revision should remain as a **preview/try** action even if durable acceptance later creates PlanDecision separately.

Potential distinction:

    Try suggestion
        → Preview-only

    Accept suggestion
        → authoritative decision

Assess whether current one-button flow conflates these concepts.

---

# 63. Try Versus Accept Model

Candidate UX/authority split:

## Try

Ephemeral Preview revision.

## Accept

Creates durable/session planning authority.

Determine whether architecture benefits from this distinction.

No UI implementation.

---

# 64. Existing Button Semantics

If current button wording uses terms such as:

- Apply;
- Move;
- Review;
- Fix;

determine whether "Apply" currently implies acceptance rather than experimentation.

This may affect migration strategy.

---

# 65. Required Current Behavior Map

Produce an end-to-end current map:

    friction
        ↓
    suggested fix generated
        ↓
    fix rendered
        ↓
    user action
        ↓
    DayFrameApp handler
        ↓
    store/revision path
        ↓
    revised Preview
        ↓
    subsequent regeneration/reload behavior

Include `changeFixedTime` as its separate branch.

---

# 66. Required Regeneration Matrix

For each fix type:

| Fix Type | Revised Preview Changes | Regeneration Preserves Choice? | Reload Preserves Choice? | Authored State Changed? |
| --- | --- | ---: | ---: | ---: |

---

# 67. Required Intent-Scope Matrix

For each fix:

| Fix Type | Occurrence-Specific | Pattern-Specific | Source-Wide | Ambiguous |
| --- | ---: | ---: | ---: | ---: |

Use evidence and UI semantics.

---

# 68. Required Identity Dependency Matrix

For each proposed future authority model:

| Authority | Needs OccurrenceIdentity | V1 Sufficient Session-Only? | Needs Source Incarnation Durable? | Needs Authored Revision Fingerprint? |
| --- | ---: | ---: | ---: | ---: |
| ephemeral Preview | | | | |
| authored mutation | | | | |
| authored override | | | | |
| PlanDecision | | | | |
| replayable command | | | | |

---

# 69. Required Persistence Matrix

Produce the matrix required in Section 50 with explicit adopted recommendations.

---

# 70. Required Architectural Object Matrix

If new authority is required:

| Candidate Object | Category | Transformation | Pillar | Producer Requirement | Persistence |
| --- | --- | --- | --- | --- | --- |

If architecture evidence is insufficient to name these, mark unresolved.

Do not fabricate canonical architecture.

---

# 71. Decision Invalidation Semantics

If accepted decision survives regeneration, establish at least conceptual invalidation conditions.

Potential:

- affected authored source deleted;
- recurrence changed so occurrence no longer exists;
- occurrence duration changed;
- date/range no longer intersects;
- source incarnation changed;
- manual event edited.

Determine whether decisions should become:

- obsolete;
- unresolved;
- invalid;
- silently disappear.

Do not implement.

---

# 72. Missing Occurrence On Replay

If a decision references an occurrence that no longer generates:

- should it remain dormant?
- be deleted?
- produce friction/diagnostic?
- require user review?

This matters for durable decision design.

Classify as prerequisite or later decision.

---

# 73. Changed Placement Feasibility

A previously accepted move may no longer be feasible after authored changes.

Determine whether replay should:

- force placement;
- fail;
- regenerate recommendation;
- create friction.

Do not assume.

This is likely a PlanDecision semantics issue.

---

# 74. Decision Versus Constraint

Ask whether an accepted move should be modeled as:

- exact placement decision;
- preference;
- constraint;
- exception.

These have different planning behavior.

Do not settle from naming alone.

If insufficient evidence, mark for a dedicated PlanDecision task.

---

# 75. Decision Strength

Potential planning authority strengths:

- hard decision;
- soft preference;
- advisory remembered choice.

Determine whether current suggested fixes imply any of these.

Likely insufficient; record.

---

# 76. Determinism

If accepted decisions become part of planning authority, equivalent:

    authored state
    +
    decision set
    +
    historical evidence

should reproduce equivalent derived plan.

State whether this is required by deterministic planning architecture.

Likely yes.

---

# 77. Explainability

A future accepted-decision model should make it possible to explain:

> Why is this occurrence here?

Potential answer:

- generated from recurrence;
- then placed/moved due to user-accepted decision.

Determine minimum provenance implication.

---

# 78. Information Provenance

If accepted decision becomes authoritative input to planning, provenance must distinguish:

- original authored source;
- generated occurrence;
- suggested recommendation;
- user acceptance;
- resulting placement.

Identify this requirement without designing schema.

---

# 79. Recommendation Provenance

Do not require persistence of the entire SuggestedFix object if acceptance can preserve sufficient decision provenance.

Determine whether the proposal itself must be retained historically to explain acceptance.

Unresolved if insufficient evidence.

---

# 80. Historical Immutability

Accepted planning decisions are not historical observations.

Do not confuse them with execution/history.

Determine whether future Live/Learn history is separate.

---

# 81. Execution / History Boundary

Task 2.1 found no execution history.

Task 2.22 must explicitly state whether solving accepted suggested fixes requires execution/history.

Likely not.

Plan decisions concern future planning authority, not recorded reality.

Confirm.

---

# 82. PlanDecision Necessity Test

Task 2.22 should adopt a simple necessity test:

A PlanDecision-like object is justified only if there is at least one accepted user planning choice that:

1. should survive Preview regeneration;
2. is not correctly expressible as existing authored source mutation;
3. is occurrence/plan-specific rather than source-pattern-wide.

Apply this test to current fix types.

---

# 83. If No Fix Passes The Test

If no current fix satisfies those conditions:

- do not introduce PlanDecision;
- retain Preview revisions as ephemeral or route to authored editing;
- source incarnation can remain deferred.

State clearly.

---

# 84. If One Or More Fixes Pass

If any fix satisfies the necessity test:

- identify the exact fix type(s);
- identify required scope;
- identify identity dependencies;
- recommend PlanDecision investigation before implementation.

Do not implement PlanDecision in 2.22.

---

# 85. Source-Incarnation Sequencing

If durable PlanDecision is required, decide whether next task should be:

## A. Source incarnation first.

or:

## B. PlanDecision semantics first, with durability deferred.

Likely semantics first may tell us exactly what incarnation needs to support.

Assess.

---

# 86. PlanDecision Investigation Scope

If recommended, future PlanDecision investigation should establish:

- object semantics;
- occurrence reference;
- strength;
- invalidation;
- replacement/conflict;
- replay placement;
- persistence;
- provenance;
- profiles/backups.

Do not draft it inside 2.22 beyond recommended next task.

---

# 87. Preview Revision Future

Determine what should happen to `reviseSchedulePreview` under the adopted authority model:

- remain legitimate ephemeral experimentation;
- become internal application of decision objects;
- eventually retire;
- split into try/apply paths.

No code change.

---

# 88. `applySuggestedFixToPreview` Future

Same classification.

Do not remove or rename yet.

---

# 89. Store Preview Revision Authority

Assess whether the store should continue owning Preview revision if it remains ephemeral.

Likely yes as derived-state coordination.

If acceptance becomes authoritative, a different store/domain command may be required.

Record.

---

# 90. UI Workflow Ownership

Determine whether future UI should call:

- Preview revision;
- authored edit workflow;
- decision-creation service;

based on fix classification.

Do not implement.

---

# 91. Current Behavior Safety

Even if current Preview-only acceptance is architecturally mismatched with desired future semantics, assess whether it is currently unsafe enough to disable before replacement exists.

Possible:

- safe but ephemeral;
- misleading but non-destructive;
- authority-corrupting.

Task 2.5 already ensures freshness.

Determine whether interim behavior may remain.

---

# 92. Interim Communication

If Preview-only fixes remain temporarily and are knowingly ephemeral, determine whether a future bounded task should clarify copy such as:

> Preview change only; regenerate to reset.

Do not implement in this task.

---

# 93. Backward Compatibility

Accepted Preview revisions are not durable today.

Therefore changing their future semantics likely requires no durable migration for existing accepted fixes because none survive restart.

Confirm.

This reduces migration risk.

---

# 94. Profiles / Backups Compatibility

Because current revised Preview is excluded from profiles/backups, no current artifact contains accepted-fix authority.

Confirm.

---

# 95. Test Coverage Assessment

Audit current coverage for:

- every fix generator;
- every fix application;
- Preview revision;
- stale rejection;
- regeneration after revision;
- occurrence identity preservation;
- authored state unchanged;
- profile/backup exclusion;
- reload/non-persistence;
- `changeFixedTime` handoff.

Identify gaps.

Do not add tests.

---

# 96. Required Evidence Labels

Material conclusions must use:

- **Confirmed**
- **Inferred**
- **Not found**
- **Unresolved**
- **Recommended**
- **Deferred**

Especially distinguish:

- what current click behavior does;
- what users likely intend;
- what architecture should adopt.

---

# 97. Explicit Non-Goals

Task 2.22 shall not:

- change SuggestedFix types;
- change revision behavior;
- disable current fixes;
- add PlanDecision;
- add occurrence overrides;
- add replay commands;
- add source incarnation;
- change OccurrenceIdentity;
- change occurrence version;
- persist Preview;
- persist accepted fixes;
- change profiles;
- change backups;
- change local persistence;
- add execution/history;
- change friction generation;
- change placement;
- change UI copy;
- add Try/Accept buttons;
- change stale behavior;
- update ADRs;
- update `CURRENT_STATE.md`;
- update `CHANGELOG.md`;
- create a checkpoint;
- perform unrelated cleanup.

Discovery does not authorize implementation.

---

# 98. Required Code Inspection

At minimum inspect:

- suggested-fix type definitions;
- `generateSuggestedFixes`;
- `applySuggestedFix`;
- `reviseSchedulePreview`;
- `generateSchedulePreview`;
- store Preview revision action;
- Preview clone/snapshot paths;
- `PreviewScreen`;
- `DayFrameApp` suggested-fix handlers;
- stale Preview enforcement;
- occurrence identity propagation;
- block/candidate/scheduled-block identity types;
- directly relevant tests.

Inspect architecture documents only as needed to classify:

- Named Domain Objects;
- Author/Derive transformations;
- Plan pillar/service/engine responsibilities;
- provenance/determinism rules.

---

# 99. Required Result Artifact Structure

The Task 2.22 result must contain at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Suggested-Fix Inventory
5. Current End-to-End Suggested-Fix Flow
6. Fix-Type Current Classification
7. `changeFixedTime` Authority
8. Preview-Only Fix Types
9. Current Regeneration Behavior
10. Regeneration Matrix
11. Deterministic Regeneration Assessment
12. Current User-Intent Evidence
13. Instance Versus Pattern Scope
14. Intent-Scope Matrix
15. Ephemeral Preview Model
16. Authored Mutation Model
17. Authored Occurrence-Override Model
18. PlanDecision Model
19. Replayable Command Model
20. Authority Model Matrix
21. Per-Fix Authority Matrix
22. Move Semantics
23. Skip Semantics
24. Manual-Event Fix Semantics
25. Work Fix Semantics
26. Template / Recurrence Fix Semantics
27. Suggested-Fix Provenance
28. OccurrenceIdentity Coverage
29. V1 Identity Session Adequacy
30. V1 Identity Durable Limitation
31. Source-Incarnation Dependency
32. Authored-Lineage / Revision Dependency
33. Generation-Window Semantics
34. Regeneration Scope
35. Decision Invalidation Requirements
36. Decision Conflict / Ordering
37. SuggestedFix Versus Accepted Decision
38. Domain Object Category Assessment
39. Transformation / Pillar / Service Implications
40. `reviseSchedulePreview` Architectural Assessment
41. `applySuggestedFix` Architectural Assessment
42. `actionFeedback` Assessment
43. Revision History Requirement
44. Undo Requirement
45. Persistence Matrix
46. Profile Semantics
47. Backup Semantics
48. Active Persistence Semantics
49. Session-Only Versus Durable Staging
50. Staging Matrix
51. UI Language Audit
52. Preview Persistence Communication
53. Try Versus Accept Assessment
54. Fixed-Time Handoff Pattern
55. PlanDecision Necessity Test
56. Fixes Satisfying Necessity Test
57. Source-Incarnation Sequencing
58. Preview Revision Future
59. Store / UI Future Authority
60. Current Behavior Safety
61. Interim Communication Requirement
62. Compatibility Assessment
63. Test Coverage Assessment
64. Architectural Alignment Assessment
65. Behavioral Invariants
66. Open Questions
67. Recommended Implementation / Investigation Sequence
68. Recommended Next Task
69. Deviations
70. Discoveries and Deferred Work
71. Validation
72. Final Completion Determination

Additional sections may be added where evidence requires them.

---

# 100. Behavioral Invariants To Evaluate

Task 2.22 should determine whether future architecture should preserve invariants such as:

1. SuggestedFix remains advisory derived information.
2. User acceptance does not mutate the SuggestedFix object into authority.
3. Any durable accepted planning choice is represented separately from derived recommendation.
4. One-occurrence decisions never silently become recurrence-wide authored mutations.
5. Fresh Preview is required before accepting any Preview-derived recommendation.
6. Equivalent authored inputs plus authoritative decision set produce equivalent derived planning output.
7. Decision replay preserves provenance.
8. Durable occurrence-specific decisions require lifetime-safe source identity.
9. Accepted planning choices remain distinct from execution/history.
10. `changeFixedTime` remains an authored-edit handoff unless evidence supports otherwise.
11. Ephemeral Preview experimentation is explicitly non-authoritative if retained.
12. Rebuilding Preview from unchanged authority must either reproduce accepted decisions or clearly discard them by documented contract.

Adopt only evidence-supported invariants.

---

# 101. Validation Requirements

This task is investigation only.

No executable or test files should change.

Run:

    npm run lint
    npm run typecheck
    npm test
    npm run build

Record:

- task artifact SHA-256;
- artifact immutability;
- full test-file count;
- full test count;
- build result;
- whether executable files changed;
- whether governance files changed.

Reference searches must cover every current suggested-fix type and production application path.

If the worktree contains earlier Phase 2 implementation changes, distinguish them from Task 2.22 work.

---

# 102. Completion Criteria

Task 2.22 is complete only when:

- every current suggested-fix type is inventoried;
- every current application path is traced;
- `changeFixedTime` is explicitly classified;
- every Preview-only fix is identified;
- regeneration behavior is established for each fix class;
- current user-intent scope is assessed;
- instance versus pattern authority is explicit;
- all candidate authority models are compared;
- one future authority class is recommended per fix type;
- Preview experimentation semantics are accepted or rejected;
- the distinction between SuggestedFix and accepted authority is decided;
- occurrence identity dependency is established;
- V1 session/durable adequacy is explicit;
- source-incarnation dependency is explicit;
- authored-state lineage/revalidation needs are identified;
- generation-window behavior is established;
- decision invalidation/conflict requirements are identified;
- architectural object/transformation consequences are assessed;
- PlanDecision necessity test is applied;
- the exact current fixes requiring PlanDecision-like authority are identified or none are found;
- persistence/profile/backup implications are established;
- session-only versus durable staging is decided;
- current UI language implications are recorded;
- interim safety of existing behavior is determined;
- current test gaps are documented;
- a dependency-correct next task is identified;
- no unauthorized implementation occurs;
- repository-standard validation passes;
- immutable task artifact remains unchanged.

---

# 103. Task Determination

Task 2.22 is a planning-authority investigation.

DayFrame now has strong boundaries around:

- authored-state validity;
- derived Preview freshness;
- historical authority activation;
- persistence truth;
- recovery authority.

The remaining mismatch is that the user can still interact with a derived recommendation and produce a revised visible plan without DayFrame having defined what authority that accepted choice represents.

The core distinction is:

    recommendation
        ≠
    user decision

A SuggestedFix is generated information.

If user acceptance creates enduring planning intent, that intent requires its own explicit architectural authority.

If user acceptance is intentionally ephemeral experimentation, DayFrame must say so and preserve that non-authoritative boundary.

Task 2.22 must determine which model applies to each current fix.

**Task 2.22 is complete when DayFrame has an evidence-backed authority classification for every current suggested-fix acceptance path, has determined whether any accepted fix requires a PlanDecision-like authoritative object, has established occurrence-identity and source-incarnation dependencies for any enduring decision, and has made no unauthorized implementation change.**
