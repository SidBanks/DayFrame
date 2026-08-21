# Task 2.39 — Implement Decision-Aware SuggestedFix Classification, Ranking, and Supersession Messaging

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded recommendation-policy implementation task.

Task 2.39 implements the decision-aware recommendation policy defined by Task 2.37.

This task makes current SuggestedFix generation and presentation aware of accepted `PlanDecision V1` authority without changing the authority model itself.

It includes:

* classification of SuggestedFix relationships to current PlanDecisions;
* exact-equivalent recommendation suppression;
* deterministic relationship-aware ranking;
* preservation of accepted user authority;
* explicit supersession labeling;
* decision-unblocking classification where evidence is sufficient;
* blocked-decision recommendation handling;
* stale/outside-window exclusion from current recommendation constraints;
* derived recommendation metadata;
* Try → Accept preservation;
* regression coverage.

It does **not** implement:

* automatic PlanDecision mutation;
* new PlanDecision kinds;
* conflict decisions;
* generalized counterfactual planning;
* broad recommendation redesign;
* decision history;
* Backup V3;
* execution/history;
* new durable formats.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 2.37 and 2.38 are complete and accepted;
6. review the accepted-planning-authority checkpoint;
7. review current `generateSuggestedFixes`, friction, replay results, accepted-choice visibility, and Try → Accept mapping;
8. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.39_IMPLEMENT_DECISION_AWARE_SUGGESTEDFIX_CLASSIFICATION_RANKING_AND_SUPERSESSION_MESSAGING_RESULT.md`

If decision-aware recommendation classification requires changing PlanDecision semantics, DurableOccurrenceReference, friction authority, or scheduling semantics, stop and report rather than broadening scope.

---

# 2. Purpose

DayFrame currently has a complete accepted-planning-authority loop:

```text
friction
    ↓
SuggestedFix
    ↓
Try
    ↓
Accept
    ↓
PlanDecision V1
    ↓
persistence
    ↓
regeneration
    ↓
deterministic replay
    ↓
new friction
    ↓
new SuggestedFixes
```

But current SuggestedFix generation is unaware of PlanDecision authority.

That means the recommendation engine can currently evaluate the resulting schedule correctly while lacking the semantic knowledge that some schedule outcomes were explicitly accepted by the user.

Task 2.39 implements the missing recommendation-awareness layer.

---

# 3. Governing Architectural Decisions

The following Task 2.37 policy is fixed:

1. accepted PlanDecision is user planning authority;
2. recommendations never silently override accepted authority;
3. exact-equivalent same-target recommendations are suppressed;
4. decision-preserving fixes are preferred where feasible;
5. blocked decisions should receive unblocking recommendations before supersession where reasonable;
6. superseding recommendations remain available when useful;
7. superseding recommendations must be explicitly described as revising an accepted choice;
8. Try remains temporary;
9. only explicit Accept changes PlanDecision authority;
10. stale decisions do not constrain current recommendations;
11. outside-window decisions do not constrain current Preview recommendations;
12. deterministic replay tie-breaks do not imply user-preference priority;
13. recommendation generation never mutates PlanDecision authority.

Do not reopen these rules.

---

# 4. Architectural Objective

After Task 2.39, recommendation derivation should conceptually become:

```text
replayed schedule
    +
friction
    +
current valid PlanDecisions
    +
current PlanDecision replay results
        ↓
ordinary SuggestedFix generation
        ↓
decision-aware relationship classification
        ↓
equivalent suppression
        ↓
relationship-aware deterministic ranking
        ↓
derived SuggestedFix metadata
        ↓
Try
        ↓
explicit Accept if supported
```

PlanDecision remains immutable during this process.

---

# 5. Required Initial Audit

Before coding, inspect:

* `generateSuggestedFixes`;
* every current SuggestedFix action;
* SuggestedFix data shape;
* friction data shape;
* scheduled/unplaced block structures;
* PlanDecision V1;
* `planDecisionResults`;
* `createPlanDecisionAcceptanceCandidate`;
* runtime-ID-to-occurrence correlation;
* existing SuggestedFix ordering;
* grouped friction rendering;
* individual friction rendering;
* stale Preview protections.

Document the current ranking and how each SuggestedFix identifies its target.

---

# 6. Derived Recommendation Context

Add a transient decision-awareness layer.

Preferred conceptual type:

```ts
type SuggestedFixDecisionContext = {
  relationship:
    | "ordinary"
    | "preserving"
    | "unblocking"
    | "superseding"
    | "equivalent"
    | "unknown";
  decisionId?: PlanDecisionId;
  replayStatus?: PlanDecisionReplayResult["status"];
  explanationCode?:
    | "sameTarget"
    | "exactEquivalent"
    | "blockedPlacement"
    | "constraintPreserved";
};
```

Adjust exact names to repository conventions.

This metadata is derived only.

---

# 7. No Persistence

Do not persist recommendation context in:

* PlanDecision surface;
* Active V2;
* Profile V2;
* Backup V2;
* local storage;
* authored setup.

SuggestedFix remains derived Preview/recommendation data.

---

# 8. Decision Relationship Categories

Implement the six policy relationships:

## `ordinary`

No relevant current accepted decision relationship.

## `preserving`

Recommendation changes something while preserving a relevant accepted decision.

## `unblocking`

Recommendation changes a blocker so an accepted blocked decision may become realizable.

## `superseding`

Recommendation proposes different semantic intent for the same target currently governed by a PlanDecision.

## `equivalent`

Recommendation proposes the exact semantic choice already accepted.

## `unknown`

An indirect relationship exists or may exist, but evidence is insufficient to claim preservation, unblocking, or contradiction.

---

# 9. Exact Same-Target Detection

For supported single-target SuggestedFix actions:

* locate current target occurrence;
* construct or derive the same semantic PlanDecision acceptance candidate used by Task 2.36;
* compare that candidate against current same-target PlanDecision.

Do not compare by runtime ID alone.

---

# 10. Equivalent Definition

A SuggestedFix is `equivalent` when:

* same durable occurrence target;
* same PlanDecision kind;
* same semantic payload.

Examples:

* accepted placement 09:00; suggested placement 09:00;
* accepted omission; suggested skip;
* accepted duration 30; suggested duration result 30;
* accepted priority 5; suggested priority result 5.

Equivalent suggestions must be suppressed.

---

# 11. Equivalent Suppression

Suppressed equivalent suggestions:

* are not rendered;
* are not Try-able;
* do not participate in ranking;
* do not produce duplicate recommendation copy.

Do not mutate the PlanDecision.

---

# 12. Superseding Definition

A recommendation is `superseding` when:

* it targets the same durable occurrence as a current PlanDecision;
* its mapped PlanDecision semantics differ.

Because PlanDecision V1 allows one current decision per target, any differing accepted Supported SuggestedFix for the same target supersedes the current decision.

---

# 13. Cross-Kind Supersession

Examples:

* accepted placement → suggested skip;
* accepted duration → suggested move;
* accepted priority → suggested duration.

All are superseding if they target the same occurrence.

Do not attempt multi-dimension composition.

---

# 14. Preserving Definition

A recommendation is `preserving` when it changes another occurrence or ordinary scheduling detail while leaving the relevant accepted decision's semantic target/action untouched.

Do not claim preserving merely because the target differs if the recommendation could invalidate the accepted outcome.

Use only evidence that can be established from current schedule/friction relationships.

---

# 15. Unblocking Definition

A recommendation is `unblocking` when:

* a current accepted decision has replay result `blocked`;
* the recommendation changes a distinct blocker;
* there is direct evidence that the recommended target participates in the blocking condition.

No general counterfactual engine is authorized.

---

# 16. Bounded Unblocking Evidence

Acceptable V1 evidence may include:

* blocked exact placement overlaps an anchored/scheduled block identified in the same friction relationship;
* SuggestedFix targets that blocker;
* removing/moving/reducing that blocker is directly relevant.

Do not infer unblocking from loose temporal proximity alone.

---

# 17. Unknown Indirect Relationship

If a recommendation affects another target but causal relation to the accepted decision cannot be proven:

* classify `unknown`;
* do not claim preserving or unblocking.

This is required by Task 2.37's causality standard.

---

# 18. No General Counterfactual Scheduler

Do not generate alternate schedules solely to determine recommendation relationship.

Task 2.39 must use bounded current evidence.

A future optimization/counterfactual task may expand this later.

---

# 19. Current Decision Set

Recommendation classification must use current valid PlanDecision authority only.

Do not include:

* quarantined decisions;
* protected raw data;
* removed decisions;
* superseded history.

---

# 20. Replay Status Context

Use current fresh `planDecisionResults`.

Do not use old replay results when Preview is stale.

SuggestedFix actions are already unavailable on stale Preview.

---

# 21. Applied Decision Policy

For `applied` decisions:

* exact-equivalent same-target suggestions are suppressed;
* differing same-target suggestions are superseding;
* different-target fixes may be preserving, unblocking, ordinary, or unknown.

---

# 22. Blocked Decision Policy

For `blocked` decisions:

* keep accepted decision as current user authority;
* identify direct unblocking recommendations where evidence supports it;
* rank unblocking recommendations ahead of superseding same-target recommendations;
* superseding remains available as a reconsideration option;
* equivalent suggestion suppressed.

---

# 23. Inapplicable Decision Policy

`inapplicable` current decisions have no executable effect.

They should not constrain ordinary recommendation ranking.

A same-target suggestion that would create another PlanDecision still requires careful classification:

* if same semantics → equivalent;
* if different → superseding.

Do not treat inapplicable as stale.

---

# 24. Stale Decision Policy

For:

* `staleSourceMissing`;
* `staleLifetime`;
* `staleOccurrenceMissing`;

the decision does not constrain current scheduling recommendations.

Do not annotate ordinary suggestions as preserving/superseding stale authority unless the exact same stale target is somehow the explicit subject.

Never retarget stale decisions.

---

# 25. Outside-Window Policy

Outside-window decisions do not constrain current Preview recommendation ranking.

Do not classify current-window fixes against them unless they directly target the same durable occurrence.

---

# 26. Invalid/Unsupported

Quarantined/unsupported records are not recommendation input.

No classification or repair.

---

# 27. SuggestedFix Kind Audit

Classify current actions:

* `moveBlock`;
* `skipBlock`;
* `reduceDuration`;
* `changePriority`;
* `changeFixedTime`;
* `addResource`;
* `convertToRecovery`;
* `acceptConflict`.

Do not assume every action has PlanDecision semantics.

---

# 28. `moveBlock`

For a same-target accepted decision:

* exact same destination → equivalent;
* any different destination → superseding;
* if current accepted kind is not placement → superseding.

Different-target move:

* preserving/unblocking/unknown/ordinary based on evidence.

---

# 29. `skipBlock`

Same target:

* accepted omit → equivalent;
* anything else → superseding.

Different target:

* classify by current friction relationship.

---

# 30. `reduceDuration`

Map to exact resulting duration using Task 2.36 mapper semantics.

Same target:

* same accepted duration → equivalent;
* otherwise → superseding.

---

# 31. `changePriority`

Map to exact resulting priority.

Same target:

* same accepted priority → equivalent;
* otherwise → superseding.

---

# 32. `changeFixedTime`

This remains an authored-edit workflow.

Classify:

`authoredReview`

or maintain relationship separately from PlanDecision categories if cleaner.

Do not suggest that Accept will supersede a decision.

If an accepted decision is involved, copy must distinguish:

> changing authored schedule rules

from:

> revising accepted planning intent.

---

# 33. `addResource`

Audit current actual behavior.

If it changes authored/resource context and may preserve a decision:

* classify preserving only with sufficient direct evidence;
* otherwise ordinary/unknown.

No PlanDecision Accept.

---

# 34. `convertToRecovery`

Remains Try-only and unsupported as durable V1 decision.

Do not classify as an acceptable superseding decision merely because its target overlaps an accepted choice.

Its relationship may be:

* unsupported;
* unknown;
* preserving;

according to evidence.

No Accept.

---

# 35. `acceptConflict`

Remains outside PlanDecision V1.

Do not classify as durable supersession.

No DurableConflictReference exists yet.

---

# 36. Relationship Metadata Placement

Determine whether decision context belongs:

## A. inside `SuggestedFix`

or

## B. in a wrapper such as `DecisionAwareSuggestedFix`.

Preferred:

> use derived metadata close enough to SuggestedFix rendering/ranking without changing durable semantics.

Do not introduce persistence consequences.

---

# 37. Generic SuggestedFix Core

Avoid contaminating generic fix semantics with store-specific PlanDecision authority where possible.

A post-generation classifier is encouraged:

```text
SuggestedFix[]
+
PlanDecision[]
+
ReplayResult[]
+
friction/schedule context
    ↓
DecisionAwareSuggestedFix[]
```

---

# 38. Classification Stage

Preferred pipeline:

```text
detect friction
    ↓
generate ordinary SuggestedFixes
    ↓
classify against accepted authority
    ↓
suppress equivalents
    ↓
rank
    ↓
Preview result
```

Do not modify core friction detection solely for decision awareness unless necessary.

---

# 39. Decision-Shaped Friction Metadata

If direct friction relationships are required for unblocking classification, derive them transiently during classification.

Do not persist them.

---

# 40. No Friction Schema Expansion Unless Needed

Prefer not to change `FrictionPoint`.

If an ephemeral helper can correlate friction/block IDs with decision targets, use it.

If schema expansion is necessary, keep fields derived and non-durable.

---

# 41. Target Correlation

Runtime IDs may be used to correlate:

* friction block;
* scheduled candidate;
* current SuggestedFix.

Then map to durable semantic occurrence for decision comparison.

Do not persist runtime IDs.

---

# 42. Decision Correlation

Use:

* PlanDecisionId for current record lookup;
* durable target equality for semantic comparison.

Do not rely solely on acceptedAt/provenance.

---

# 43. Provenance Neutrality

A decision created from:

* user source; or
* SuggestedFix source

has equal user authority once accepted.

Recommendation ranking must not weight provenance.

---

# 44. acceptedAt Neutrality

acceptedAt must not affect recommendation rank or semantic authority.

---

# 45. Deterministic Ranking

Task 2.37 established relationship-aware ranking.

Implement deterministic ranking tiers:

1. decision-preserving;
2. decision-unblocking;
3. ordinary non-conflicting;
4. decision-superseding;
5. unsupported/manual-review.

If evidence suggests unblocking should precede preserving specifically for a blocked decision, apply a narrow refinement and document it.

---

# 46. Blocked-Decision Ranking Refinement

Preferred:

For friction directly blocking an accepted decision:

1. unblocking;
2. preserving;
3. ordinary;
4. superseding.

For ordinary friction:

1. preserving;
2. ordinary;
3. superseding.

Do not overcomplicate if current fix set does not require multiple contexts.

---

# 47. Within-Class Ordering

Retain current deterministic SuggestedFix ordering inside each relationship tier.

Do not rewrite heuristic ranking.

---

# 48. Storage Order Independence

PlanDecision array order must not affect recommendation output.

Use canonical lookup/indexing.

---

# 49. SuggestedFix Array Order

Result order must be deterministic across equivalent generation.

---

# 50. Equivalent Suppression Before Ranking

Remove equivalent suggestions before sorting.

Do not merely rank them last.

---

# 51. Duplicate Suggestion Audit

If ordinary generator produces duplicate semantic suggestions, Task 2.39 may suppress exact semantic duplicates only where decision-equivalence comparison already makes it safe.

Do not broaden into general deduplication unless necessary.

---

# 52. Supersession Messaging

A superseding recommendation must visibly tell the user it would revise an accepted choice.

Examples:

* “Try a different placement for your accepted choice”
* “Try omitting this instead of your accepted placement”
* “Try a different duration for your accepted choice”

Exact copy should follow current style.

---

# 53. Do Not Say “Override”

Prefer:

* “revise”
* “change”
* “try a different…”

Avoid technical/hostile language such as:

* override;
* invalidate;
* supersede;

in user-facing copy unless already established product terminology.

---

# 54. Preserving Messaging

Preserving recommendations may remain ordinary if no special explanation is needed.

Where helpful:

> “This keeps your accepted placement.”

Do not claim preservation unless classification is certain.

---

# 55. Unblocking Messaging

For directly proven unblocking recommendations:

> “This may make your accepted placement possible.”

Avoid guaranteed language unless the engine proves the resulting schedule.

Try still provides confirmation.

---

# 56. Unknown Messaging

Do not add speculative decision language.

Render as ordinary/neutral recommendation if relationship is unknown, or expose no relationship annotation.

Do not claim it preserves user intent.

---

# 57. Equivalent Suggestions

No UI copy because they are suppressed.

---

# 58. Authored Review Messaging

`changeFixedTime` remains clear that the user must edit Setup.

If an accepted decision is involved, do not describe the authored edit as modifying PlanDecision.

---

# 59. Try Semantics

All recommendation types remain Try-first where current UI supports Try.

Decision-aware classification must not auto-accept anything.

---

# 60. Superseding Try

Trying a superseding recommendation:

* temporarily revises Preview only;
* current PlanDecision remains authoritative;
* regeneration without Accept restores current accepted decision.

Task 2.36 behavior remains valid.

---

# 61. Superseding Accept

Explicit Accept:

* uses existing mapper;
* calls existing store `acceptPlanDecision`;
* same-target decision is replaced;
* automatic regeneration occurs.

No new supersession mechanism.

---

# 62. Preserving Accept

If recommendation targets another occurrence:

* Accept creates a decision for that occurrence;
* current accepted decision remains.

No multi-target linkage.

---

# 63. Unblocking Accept

Same.

The accepted blocker-target decision is independent durable authority.

Do not create dependency graphs between decisions.

---

# 64. No Recommendation Auto-Removal

Recommendation engine may propose reconsideration/removal conceptually, but Task 2.39 does not automatically call `removePlanDecision`.

---

# 65. Decision Removal Recommendation

Determine whether the existing SuggestedFix vocabulary can express:

> remove the accepted choice

It likely cannot.

Do not add a new SuggestedFix action in this task unless required.

The Task 2.38 Accepted Choices panel already provides Remove.

---

# 66. Use Existing Remove UI

When a blocked/stale decision should be reconsidered, recommendation copy may direct the user toward Accepted Choices rather than create a fake PlanDecision action.

Keep minimal.

---

# 67. Applied Placement Conflict

Create direct regression case:

* accepted exact placement applies;
* resulting friction exists;
* ordinary SuggestedFix currently proposes moving same occurrence.

Expected after 2.39:

* same-target equivalent suppressed if identical;
* different move classified superseding;
* another-target preserving fix ranks ahead where available.

---

# 68. Blocked Placement Case

Create:

* accepted exact placement;
* hard blocker prevents it;
* replay result blocked;
* SuggestedFixes exist for blocker and/or target.

Expected:

* blocker fix classified unblocking where provable;
* same-target alternative classified superseding;
* unblocking ranks ahead.

---

# 69. Decision-Decision Conflict

Create two accepted hard placements that conflict.

Current replay may apply one and block another due deterministic processing.

Policy:

* neither has semantic priority;
* recommendations must not imply the applied one was “more important”;
* direct recommendation to change blocked target is superseding;
* recommendation to change applied conflicting target may be unblocking for blocked decision only if evidence supports it.

---

# 70. Tie-Break Language

Do not expose deterministic internal ordering as user preference.

---

# 71. Omit Case

Accepted omission:

* occurrence absent;
* no ordinary fix should recommend placing/scheduling that same occurrence as though omission were accidental.

If such suggestion appears:

* equivalent omit suppressed;
* restore/different decision classified superseding if representable.

---

# 72. Duration Case

Accepted duration applied.

If friction leads to same exact duration recommendation:

* suppress.

Different duration:

* superseding.

Different-target fix:

* preserving/unblocking/ordinary/unknown.

---

# 73. Priority Case

Same principles.

---

# 74. Stale Decision Case

Decision retained but replay stale.

Current SuggestedFixes for current schedule should be unaffected by that stale authority.

No relationship metadata unless recommendation literally targets the stale reference—which current source lifetime safety should prevent.

---

# 75. Outside-Window Case

No current-window ranking impact.

---

# 76. No Preview

No SuggestedFix generation anyway.

No extra behavior.

---

# 77. Stale Preview

Existing stale guard prevents Try.

Decision-aware recommendation metadata from stale Preview must not be treated as current.

No special persistence.

---

# 78. Preview Generation Input

The classifier should receive only current PlanDecision authority and fresh replay results produced in the same generation.

Avoid querying store inside core engine.

---

# 79. Engine API

Potentially extend `generateSchedulePreview` internal flow to pass current decisions/replay results into recommendation classification.

Do not make `generateSuggestedFixes` itself fetch store data.

---

# 80. Store Boundary

Store continues to pass decisions to generation as established by Task 2.35.

No new persistence/store authority changes.

---

# 81. Preview Result Shape

If `SuggestedFix` gains transient decision context, it remains part of derived Preview.

No persistence.

---

# 82. Existing UI Consumers

Audit all SuggestedFix rendering and test fixtures.

Update to support optional/required decision context appropriately.

Do not make metadata optional solely to avoid updating tests unless absent context is semantically legitimate.

---

# 83. Grouped Friction

Grouped rendering must preserve relationship metadata.

Do not lose supersession messaging when fixes are grouped.

---

# 84. Group Deduplication

If grouped UI merges identical fixes, ensure:

* relationship classification remains coherent;
* a superseding fix is not merged into an ordinary fix in a way that loses authority context.

---

# 85. Multi-Target Group

If grouped rendering represents multiple targets:

* do not claim one relationship if members differ;
* either preserve per-fix relationship or classify group as mixed/unknown;
* do not create multi-target PlanDecision semantics.

---

# 86. Individual Friction

Render relationship-specific messaging directly.

---

# 87. Decision Context UI

Recommended visible treatment:

* ordinary/preserving: current action copy;
* unblocking: short note that it may help honor an accepted choice;
* superseding: explicit note that accepting would revise an accepted choice;
* equivalent: suppressed.

No elaborate badges required.

---

# 88. Decision ID Hidden

Do not expose IDs.

---

# 89. Replay Status Hidden Unless Useful

Do not mechanically display internal replay status on every recommendation.

Use it to determine wording.

Accepted Choices panel remains the primary status surface.

---

# 90. Recommendation Copy And Accessibility

Relationship messaging must be visible text, not tooltip-only.

Screen-reader users must hear that a suggestion would revise an accepted choice.

---

# 91. Button Labels

Keep action button itself concise if surrounding text provides relationship context.

Do not necessarily rename every Try button.

---

# 92. Freshness Safety

If PlanDecision authority changes after Preview generation:

* Preview becomes stale;
* old decision-aware SuggestedFixes cannot be tried/accepted.

Direct regression required.

---

# 93. Supersession Safety

Accepted superseding decision regenerates and reclassifies future recommendations against the new current PlanDecision.

Old classification does not survive.

---

# 94. Removal Safety

Removing a decision through Task 2.38:

* regenerates when appropriate;
* future suggestions are classified with no old current decision.

No stale relationship remnants.

---

# 95. Persistence Failure

A session-authoritative PlanDecision still constrains recommendations even if its durable write failed.

Recommendation policy uses current runtime authority, not durability state.

---

# 96. Protected Ingress

Only current valid runtime decision authority participates.

Raw protected bytes do not.

---

# 97. Quarantine

No effect.

---

# 98. Profile Activation

Old decisions become stale.

Newly generated recommendations for fresh profile lifetimes are ordinary unless constrained by current applicable decisions.

No stale-decision metadata leaks.

---

# 99. Backup V1 Import

Same.

---

# 100. Backup V2 Restore

Reactivated decisions again influence classification after regeneration.

---

# 101. Full Clear

No decision context remains.

---

# 102. Recommendation Causality

Use conservative language.

Allowed:

* “This changes your accepted placement.”
* “This may help make your accepted placement possible.”

Avoid unless proven:

* “Your accepted placement caused this conflict.”

---

# 103. Exact Causality Cases

Direct same-target supersession is semantically certain.

Blocked exact placement with identified overlapping blocker can support unblocking language.

Indirect scheduling consequences remain unknown absent stronger evidence.

---

# 104. No Causal Overclaim Tests

Add text/metadata assertions ensuring unknown indirect cases do not receive unblocking/preserving claims.

---

# 105. Recommendation Relationship Purity

Classifier must not:

* mutate SuggestedFix;
* mutate PlanDecision;
* mutate replay result;
* mutate friction;
* persist;
* allocate IDs.

Return cloned/wrapped output.

---

# 106. No PlanDecision Allocation

No decision ID/source-incarnation allocation during classification.

---

# 107. No DurableReference Allocation

References may be constructed from existing source lineage if needed, but no identity allocation.

---

# 108. No Schedule Replay

Classifier operates after replay.

Do not run decision replay a second time.

---

# 109. No Preview Revision

Classification does not Try anything.

---

# 110. Deterministic Semantic Candidate Mapping

Reuse Task 2.36's mapper logic where feasible.

Do not create a second incompatible SuggestedFix→PlanDecision interpretation.

Prefer factoring shared pure semantic mapping if necessary.

---

# 111. Shared Mapper Refactor

A narrow refactor is authorized if needed so:

* Task 2.36 Accept candidate construction;
* Task 2.39 equivalence/supersession classification;

use the same canonical semantic conversion.

Do not change behavior.

---

# 112. Mapper Without Try Result

Current mapper may depend on revised Preview output.

Classification may need to compute prospective exact outcome before Try.

Audit whether SuggestedFix parameters already contain sufficient result semantics.

If not, create a pure semantic prospective mapping using existing revision logic without mutating Preview.

Do not run arbitrary UI Try side effects.

---

# 113. Prospective Mapping

For each supported action, determine exact candidate semantics:

* move → destination user-day/time;
* skip → omit;
* reduceDuration → resulting exact duration;
* changePriority → resulting exact priority.

Must match Task 2.36 acceptance after Try.

Direct consistency tests required.

---

# 114. Consistency Invariant

For the same SuggestedFix and fresh Preview:

```text
prospective decision semantics used by classifier
==
decision semantics created after Try by Task 2.36 mapper
```

This is mandatory.

---

# 115. Equivalent Test

Current decision exactly equals prospective candidate.

Suggestion absent from final recommendation list.

---

# 116. Superseding Test

Same target, different candidate.

Suggestion present with superseding metadata/copy and lower relationship rank.

---

# 117. Preserving Test

Decision T1, recommendation changes T2 with no direct contradiction.

Classification preserving only where evidence supports it.

---

# 118. Unknown Test

Indirect relationship not provable.

Classification unknown/ordinary-neutral.

No overclaim.

---

# 119. Unblocking Test

Blocked exact placement + direct blocker.

Fix for blocker classified unblocking.

---

# 120. Ranking Test

Given:

* preserving;
* unblocking;
* ordinary;
* superseding;

output matches adopted policy.

---

# 121. Within-Class Stable Order Test

Existing ranking remains stable inside tier.

---

# 122. Input Order Independence

Shuffle decisions and equivalent fix inputs where applicable.

Same ordered output.

---

# 123. PlanDecisionId Independence

Different decision IDs with same current semantic authority should not change relationship classification except metadata ID.

---

# 124. acceptedAt Independence

No effect.

---

# 125. Provenance Independence

No effect on relationship/rank.

---

# 126. Applied Placement Test

Direct case.

---

# 127. Blocked Placement Test

Direct case.

---

# 128. Omit Test

Direct case.

---

# 129. Duration Test

Direct case.

---

# 130. Priority Test

Direct case.

---

# 131. Stale Source Test

No constraint.

---

# 132. Stale Lifetime Test

No constraint.

---

# 133. Occurrence Missing Test

No constraint.

---

# 134. Outside Window Test

No current-window constraint.

---

# 135. Profile Activation Integration Test

Old decision stale → no supersession labeling on fresh-lifetime suggestion.

---

# 136. Backup V1 Integration Test

Same.

---

# 137. Backup V2 Reactivation Integration Test

Restored decision again influences classification.

---

# 138. Decision Removal Integration Test

Remove → regenerate → recommendation classification no longer references removed decision.

---

# 139. Persistence Failure Integration Test

Runtime decision constrains classification despite failed durable write.

---

# 140. Stale Preview Integration Test

Decision mutation stales Preview; old recommendation controls unavailable.

---

# 141. Try Without Accept

Temporary Try does not change recommendation authority after regeneration.

---

# 142. Superseding Try

Can be tried.

Current PlanDecision still exists until Accept.

---

# 143. Superseding Accept

Existing Task 2.36 flow replaces decision.

No new API.

---

# 144. Accepted Choices Regression

Task 2.38 panel remains accurate.

Superseding Accept shows only new current record after regeneration.

---

# 145. Recommendation Metadata In Preview Clone

Ensure cloned Preview preserves derived decision context without shared mutation.

---

# 146. No Persistence Shape Change

Search serialized Preview/durable surfaces.

No new persisted fields.

---

# 147. No PlanDecision Schema Change

None.

---

# 148. No Replay Schema Change

No replay-result durable change.

Transient additions only if necessary.

---

# 149. No Friction Durable Change

None.

---

# 150. No Backup Change

None.

Backup V3 remains deferred until before broader release.

---

# 151. No Management Expansion

No new Accepted Choices features beyond existing Task 2.38 surface.

---

# 152. No New SuggestedFix Actions

Use current action vocabulary.

Do not add `removeDecision`, `reviseDecision`, or conflict actions.

---

# 153. No Automatic Decision Mutation

Search after implementation.

No recommendation generation/classification code may call:

* `acceptPlanDecision`;
* `removePlanDecision`;
* persistence writer.

---

# 154. SuggestedFix Acceptance Remains Explicit

Only Task 2.36 user Accept path mutates PlanDecision.

---

# 155. Existing `changeFixedTime` Regression

Still authored navigation.

---

# 156. Existing `acceptConflict` Regression

Still no durable PlanDecision mapping.

---

# 157. Existing Try Regression

Try remains Preview-only.

---

# 158. Existing Ranking Regression

When no applicable PlanDecisions exist, final SuggestedFix ordering and copy should remain equivalent to pre-2.39 behavior.

This is important.

---

# 159. Zero-Decision Equivalence

Given no current PlanDecision authority:

* recommendation set;
* ordering;
* action semantics;

must remain unchanged except any harmless default metadata.

Direct regression required.

---

# 160. All-Stale Decision Equivalence

When all decisions are stale/outside current range:

* ordinary recommendation behavior should remain equivalent.

---

# 161. Explanation Code

If implemented, use stable coded semantics, not UI text as data.

Do not persist.

---

# 162. UI Rendering Helper

Prefer mapping relationship metadata to copy in a dedicated presentation helper rather than scattering conditionals.

---

# 163. Accessibility Test

Superseding recommendation must have visible/accessibly discoverable indication before Accept.

---

# 164. Grouped Friction Tests

Cover:

* same relationship group;
* mixed relationships;
* superseding message preservation.

---

# 165. Mixed Group Policy

If one rendered grouped recommendation represents members with different relationships:

Preferred:

* do not flatten to a misleading single classification;
* either split rendering or label conservatively.

Do not say preserving if one member supersedes an accepted choice.

---

# 166. Multi-Occurrence Group Stop Condition

If safe classification cannot be represented without redesigning grouped SuggestedFix semantics:

* preserve existing group as ordinary/unknown;
* disable superseding Accept if mapping is ambiguous;
* report limitation.

Do not invent multi-target decision behavior.

---

# 167. Decision-Aware Recommendation Snapshot

Task result should document exact final pipeline.

---

# 168. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.39_IMPLEMENT_DECISION_AWARE_SUGGESTEDFIX_CLASSIFICATION_RANKING_AND_SUPERSESSION_MESSAGING_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Policy
4. Initial SuggestedFix Audit
5. Files Changed
6. Recommendation Context Type
7. Classification Boundary
8. Ordinary Relationship
9. Preserving Relationship
10. Unblocking Relationship
11. Superseding Relationship
12. Equivalent Relationship
13. Unknown Relationship
14. Same-Target Detection
15. Semantic Candidate Mapping
16. Mapper Consistency
17. Equivalent Suppression
18. Cross-Kind Supersession
19. Bounded Unblocking Evidence
20. Causality Limits
21. Applied Decision Policy
22. Blocked Decision Policy
23. Inapplicable Policy
24. Stale Policy
25. Outside-Window Policy
26. Invalid/Unsupported Policy
27. moveBlock
28. skipBlock
29. reduceDuration
30. changePriority
31. changeFixedTime
32. addResource
33. convertToRecovery
34. acceptConflict
35. Classification Stage
36. Friction Correlation
37. Runtime-ID Boundary
38. Decision Correlation
39. Ranking Tiers
40. Blocked Ranking Refinement
41. Within-Class Ordering
42. Input-Order Determinism
43. Supersession Messaging
44. Preserving Messaging
45. Unblocking Messaging
46. Unknown Messaging
47. Authored Review Messaging
48. Try Semantics
49. Superseding Try
50. Superseding Accept
51. Removal Relationship
52. Decision-Decision Conflict
53. Tie-Break Semantics
54. Grouped Friction
55. Mixed Group Policy
56. Accessibility
57. Preview Freshness Safety
58. Profile Activation
59. Backup V1
60. Backup V2 Reactivation
61. Decision Removal
62. Persistence Failure
63. Zero-Decision Regression
64. All-Stale Regression
65. Accepted Choices Regression
66. No-Automatic-Mutation Audit
67. No-Persistence-Change Audit
68. No-PlanDecision-Schema Audit
69. No-Replay-Change Audit
70. Tests Added or Updated
71. Classification Matrix
72. Ranking Matrix
73. Messaging Matrix
74. Architectural Alignment Assessment
75. Deviations
76. Discoveries and Deferred Work
77. Recommended Next Task
78. Focused Validation
79. Full Validation
80. Final Completion Determination

---

# 169. Required Matrices

## A. SuggestedFix Relationship Matrix

| SuggestedFix action | Same-target equivalent | Same-target different | Different target | Unsupported case |
| ------------------- | ---------------------- | --------------------- | ---------------- | ---------------- |

## B. Replay Status Policy Matrix

| Replay status | Constrains recommendations? | Relationship policy |
| ------------- | --------------------------: | ------------------- |

## C. Ranking Matrix

| Relationship | Rank tier | Notes |
| ------------ | --------: | ----- |

## D. Messaging Matrix

| Relationship | Required user-facing treatment |
| ------------ | ------------------------------ |

## E. Cross-Surface Matrix

| Transition | Decision relationship after regeneration |
| ---------- | ---------------------------------------- |

Cover:

* profile load;
* Backup V1;
* Backup V2;
* decision removal;
* supersession;
* full clear.

---

# 170. Validation Requirements

Run focused tests for:

* classification;
* prospective mapper consistency;
* equivalent suppression;
* superseding classification;
* unblocking classification;
* unknown indirect relationships;
* ranking;
* zero-decision regression;
* stale/outside-window behavior;
* superseding UI messaging;
* grouped friction;
* profile/backup transitions;
* removal;
* stale Preview safety.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The complete repository suite must pass.

Record exact test-file and test-count results.

---

# 171. Completion Criteria

Task 2.39 is complete only when:

* current SuggestedFixes are classified against current valid PlanDecision authority;
* decision-awareness remains derived and non-durable;
* exact same-target semantic suggestions are suppressed;
* same-target differing suggestions are classified as superseding;
* direct decision-preserving relationships are identified where evidence supports them;
* direct blocked-decision unblocking relationships are identified where evidence supports them;
* uncertain indirect relationships remain unknown rather than overclaimed;
* accepted decision provenance and acceptedAt do not affect authority/ranking;
* preserving/unblocking recommendations rank ahead of superseding ones under the adopted policy;
* existing deterministic ranking remains stable within classes;
* no-decision behavior remains equivalent to pre-2.39 behavior;
* stale/outside-window decisions do not constrain current recommendation ranking;
* invalid/quarantined/protected data do not influence recommendations;
* superseding recommendations visibly state that they would revise an accepted choice;
* equivalent recommendations are absent from the UI;
* unblocking copy remains cautious and non-promissory;
* Try remains temporary;
* only explicit Accept supersedes PlanDecision authority;
* decision removal naturally removes decision-aware recommendation context after regeneration;
* profile activation and Backup V1 do not cause old decisions to constrain fresh lifetimes;
* Backup V2 exact restoration reactivates decision awareness;
* grouped friction does not lose or misstate decision relationship;
* runtime IDs are not persisted;
* no PlanDecision mutation occurs during recommendation generation/classification;
* no PlanDecision schema/persistence/replay changes occur;
* no new SuggestedFix or PlanDecision kind is introduced;
* no Backup V3 is implemented;
* full validation passes;
* result artifact is complete.

---

# 172. Explicit Non-Goals

Do **not**:

* mutate PlanDecision automatically;
* add new PlanDecision kinds;
* add new SuggestedFix actions;
* implement `acceptConflict`;
* implement DurableConflictReference;
* add multi-target decisions;
* build a counterfactual planning engine;
* redesign friction;
* redesign placement;
* change PlanDecision persistence;
* change replay semantics;
* change DurableOccurrenceReference;
* build decision history;
* expand Accepted Choices management UI;
* implement Backup V3;
* add execution/history;
* persist recommendation metadata;
* infer user motivation;
* claim causality without evidence;
* perform unrelated recommendation-engine refactoring.

---

# 173. Stop Conditions

Stop and report if:

* current SuggestedFix parameters cannot be converted prospectively into the exact same semantic candidate as Task 2.36;
* equivalent/superseding detection requires changing DurableOccurrenceReference;
* direct unblocking cannot be identified safely from current friction/schedule evidence;
* recommendation ranking cannot be made decision-aware without rewriting generic scheduling heuristics;
* grouped friction inherently merges incompatible relationship states and cannot be represented safely;
* decision-aware messaging cannot be surfaced without broad Preview redesign;
* implementing classification changes replay or durable PlanDecision semantics;
* full-suite failures reveal an unrelated architectural regression.

Recommend the narrowest prerequisite or completion task.

---

# 174. Recommended Follow-On Boundary

If Task 2.39 completes successfully, Phase 2 should undergo a final exit review before beginning the next major architectural phase.

Recommended:

> **Task 2.40 — Phase 2 Completion Audit and Publication Checkpoint**

That task should verify:

* source incarnation;
* durable occurrence references;
* PlanDecision semantics;
* PlanDecision persistence/recovery;
* replay;
* Try → Accept;
* accepted-choice visibility/removal;
* decision-aware recommendations;
* outstanding Backup V3 requirement;
* remaining deferred conflict/multi-target/history work;
* full documentation/governance status.

If the audit identifies only non-Phase-2 release work such as Backup V3, Phase 2 may close with that explicitly tracked before broader release.

---

# 175. Task Determination

**Authorized:** derived decision-aware SuggestedFix relationship classification, exact-equivalent suppression, decision-preserving/unblocking/superseding distinction, deterministic relationship-aware ranking, explicit supersession messaging, conservative causality handling, grouped-friction-safe presentation, and direct regression coverage.

**Not authorized:** PlanDecision mutation during recommendation generation, new decision/fix kinds, conflict decisions, counterfactual scheduling, durable schema changes, replay changes, broader management UI, Backup V3, history, or unrelated scheduling redesign.

The governing recommendation principle is:

> DayFrame should work around an accepted planning choice before asking the user to reconsider it; when reconsideration is useful, DayFrame may recommend it, but the recommendation must explicitly acknowledge that it is proposing a revision to accepted user authority, and only explicit Accept may make that revision authoritative.

---

# 176. Final Completion Statement

**Task 2.39 is complete when DayFrame classifies current SuggestedFixes against current valid PlanDecision V1 authority as ordinary, preserving, unblocking, superseding, equivalent, or unknown using lifetime-safe semantic target comparison and bounded causal evidence; suppresses semantically equivalent recommendations; deterministically ranks decision-preserving and directly unblocking options ahead of explicit supersession where policy requires; clearly tells users when a Try would revise an accepted choice without implying deterministic replay tie-breaks are user preference or claiming unsupported causality; preserves existing Try → explicit Accept supersession semantics, stale-Preview safety, profile/Backup lifetime boundaries, and accepted-choice removal behavior; leaves recommendation metadata derived and non-durable; passes complete regression and repository validation; and introduces no automatic PlanDecision mutation, new decision/fix kind, DurableConflictReference, counterfactual planning engine, persistence/replay change, Backup V3, history, or unrelated scheduling behavior.**
