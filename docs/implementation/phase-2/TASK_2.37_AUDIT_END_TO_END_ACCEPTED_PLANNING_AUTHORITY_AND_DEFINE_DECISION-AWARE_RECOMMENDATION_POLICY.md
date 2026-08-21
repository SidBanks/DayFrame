# Task 2.37 — Audit End-to-End Accepted Planning Authority and Define Decision-Aware Recommendation Policy

## Status

Ready for investigation, architectural audit, and policy definition.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Cross-layer architectural audit and recommendation-policy definition task.

Task 2.37 reviews the complete accepted-planning-authority path established by Tasks 2.32–2.36 and defines how DayFrame recommendations may interact with durable `PlanDecision V1` authority.

This task must answer:

* whether the complete Try → Accept → persist → regenerate → replay loop is internally coherent;
* whether accepted decisions remain correctly subordinate to authored authority and superior to ordinary heuristic placement;
* how SuggestedFix should behave when a friction point is caused by, constrained by, or directly contradicts an accepted decision;
* when a recommendation may propose superseding an accepted decision;
* how blocked, stale, outside-window, and applied decisions should affect recommendation generation;
* what recommendation language must communicate when user authority is involved;
* whether minimal accepted-decision visibility/removal is now architecturally required;
* whether Backup V3 has become a Phase 2 prerequisite rather than merely deferred enhancement.

Task 2.37 does **not** implement decision-aware SuggestedFix generation, decision-management UI, Backup V3, new PlanDecision kinds, conflict decisions, execution/history, or broad scheduling changes.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before investigation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 2.32 through 2.36 are complete and accepted;
6. review their result artifacts and current production code;
7. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.37_AUDIT_END_TO_END_ACCEPTED_PLANNING_AUTHORITY_AND_DEFINE_DECISION_AWARE_RECOMMENDATION_POLICY_RESULT.md`

If the audit discovers a correctness defect in accepted-decision authority, replay, persistence, or lifetime-safe targeting, stop recommendation-policy work on the affected path and identify the narrowest corrective task.

---

# 2. Purpose

DayFrame now supports:

```text
DurableOccurrenceReference
    ↓
PlanDecision V1
    ↓
independent durable authority
    ↓
deterministic schedule replay
    ↓
Try → explicit Accept
    ↓
automatic regeneration
```

The remaining recommendation-layer ambiguity is this:

> What should DayFrame recommend when the schedule already contains explicit durable user planning authority?

Current SuggestedFix generation intentionally does not know about PlanDecision authority.

That is safe as an implementation boundary, but not yet a complete planning-policy model.

Task 2.37 defines that model before any recommendation logic is changed.

---

# 3. Governing Architectural Evidence

Review and reconcile:

* Task 2.32 — DurableOccurrenceReference V1;
* Task 2.33 — PlanDecision V1 domain semantics;
* Task 2.34 — PlanDecision durable surface;
* Task 2.35 — deterministic replay and applicability;
* Task 2.36 — Try → Accept workflow;
* current friction detection;
* current SuggestedFix generation;
* current stale-preview protections;
* current replay-result semantics;
* current authored precedence;
* Task 2.31 source-incarnation checkpoint;
* current Backup V2 semantics.

Executable production behavior is authoritative for current-system claims.

Future recommendation policy must be explicitly labeled as architectural determination.

---

# 4. Architectural Objective

At completion, DayFrame must have a precise answer to:

```text
Given:
    authored authority
    +
    accepted PlanDecision authority
    +
    replay result
    +
    friction

What recommendations may DayFrame generate?
```

The policy must prevent recommendations from accidentally treating accepted user authority as if it were merely another heuristic schedule result.

---

# 5. Current Authority Hierarchy

Audit and confirm the currently intended hierarchy:

```text
1. authored source/configuration authority
2. applicable accepted PlanDecision authority
3. ordinary scheduling heuristics
4. SuggestedFix recommendation
5. Try experiment
```

Determine whether this hierarchy remains sufficient once a recommendation proposes changing an accepted decision itself.

---

# 6. Accepted Decision Is User Authority

Adopt unless contradicted:

> An applicable accepted PlanDecision is user-authorized planning intent and must not be silently overridden by ordinary heuristic placement or recommendation application.

SuggestedFix may **propose** changing it only under explicitly governed policy.

---

# 7. Recommendation Is Not Authority

Reaffirm:

> SuggestedFix remains a recommendation.

It may not:

* mutate PlanDecision;
* remove PlanDecision;
* supersede PlanDecision;
* retarget PlanDecision;
* author a source;

without explicit user action through a separately governed workflow.

---

# 8. Required Initial End-to-End Audit

Trace one supported decision through:

1. friction;
2. SuggestedFix;
3. Try;
4. pending acceptance candidate;
5. Accept;
6. PlanDecision persistence;
7. Preview staleness;
8. regeneration;
9. target resolution;
10. applicability;
11. replay;
12. resulting friction;
13. new SuggestedFix generation.

Do this for all four V1 decision kinds where executable examples exist.

---

# 9. Supported Decision Kinds In Scope

Audit:

* `placeOccurrence`;
* `omitOccurrence`;
* `setOccurrenceDuration`;
* `setOccurrencePriority`.

Recommendation policy may differ by kind.

Do not define policy for:

* `acceptConflict`;
* recovery substitution;
* multi-target decisions;
* recurring pattern decisions.

---

# 10. Replay Result States In Scope

Policy must explicitly address:

* `applied`;
* `blocked`;
* `inapplicable`;
* `staleSourceMissing`;
* `staleLifetime`;
* `staleOccurrenceMissing`;
* `outsideWindow`;
* defensive `invalid`;
* defensive `unsupported`.

---

# 11. Decision-Aware Friction Classification

Determine whether friction should be classified relative to accepted authority.

At minimum distinguish conceptually:

## A. ordinary friction

No relevant accepted decision caused or constrained it.

## B. decision-shaped friction

An applied PlanDecision materially contributed to the schedule configuration producing the friction.

## C. decision-blocking friction

A hard accepted decision could not be realized because another constraint blocked it.

## D. stale-decision context

Decision exists but has no current scheduling effect.

Do not necessarily modify `FrictionPoint` yet.

---

# 12. Recommendation Context

Define the minimum context a future recommendation engine needs to know:

* relevant PlanDecision ID;
* target;
* replay outcome;
* whether the decision influenced the friction;
* whether changing the decision is required to resolve the friction;
* whether alternative non-decision-changing fixes exist.

Do not persist this context.

---

# 13. No Blind Contradiction

Adopt as a likely invariant:

> DayFrame should not present a recommendation that silently contradicts an accepted PlanDecision as though the accepted decision did not exist.

If such a recommendation is useful, it must be explicitly framed as a proposal to revise or supersede accepted intent.

---

# 14. Contradictory Recommendation Definition

Define when a SuggestedFix contradicts a decision.

Examples:

* accepted placement at 09:00 → suggestion moves same occurrence to 11:00;
* accepted omission → suggestion restores/schedules occurrence;
* accepted duration 30 min → suggestion changes same occurrence to 45 min;
* accepted priority 5 → suggestion changes same occurrence priority.

Also consider indirect contradiction.

---

# 15. Direct Versus Indirect Contradiction

## Direct contradiction

Recommendation changes the same target in a way incompatible with the current PlanDecision.

## Indirect contradiction

Recommendation changes another occurrence/source to accommodate the accepted decision.

Indirect contradiction with authored authority must be assessed separately.

---

# 16. Preferred Recommendation Hierarchy

Evaluate the following policy:

1. preserve authored hard constraints;
2. preserve applicable accepted decisions where possible;
3. prefer changes to ordinary heuristic placements;
4. if unresolved, recommend explicit reconsideration of accepted decision;
5. never silently supersede accepted authority.

Determine whether executable semantics support this.

---

# 17. Decision-Preserving Fixes

Define a recommendation as decision-preserving if it resolves/reduces friction without changing the accepted decision's semantic intent.

Examples:

* move another flexible occurrence;
* reduce another occurrence duration;
* reprioritize another occurrence;
* change an authored rule only through explicit Setup navigation if appropriate.

Prefer these before recommending decision supersession.

---

# 18. Decision-Superseding Recommendation

Define:

> A recommendation whose accepted outcome would create a new PlanDecision for the same durable target and thereby supersede the current decision.

Such recommendations are allowed only if explicitly labeled as revising an accepted choice.

---

# 19. Supersession Requires Explicit Accept

Even if a recommendation proposes revising an accepted decision:

* Try may remain Preview-only;
* Accept must explicitly create the new PlanDecision;
* store supersession semantics remain authoritative.

No recommendation itself supersedes.

---

# 20. SuggestedFix Provenance On Supersession

If a superseding recommendation is accepted:

* new decision provenance remains `suggestedFix`;
* old decision history is not retained under V1.

No special historical link is required unless future architecture demands it.

---

# 21. User-Facing Language Policy

Define copy principles.

A recommendation affecting an accepted decision should distinguish:

> “Try a different placement for your accepted choice”

from ordinary:

> “Move this block”

Exact UI copy may remain deferred, but semantic wording must be specified.

---

# 22. Accepted Decision Visibility Requirement

Determine whether a user must be able to tell that friction/recommendations involve an existing accepted choice.

Potential minimum:

* contextual accepted marker;
* replay-status text;
* recommendation annotation.

Task 2.36 already has contextual feedback immediately after acceptance.

Audit whether that is sufficient later.

---

# 23. Decision Management Requirement

Determine whether the current system now needs a minimal persistent affordance to:

* identify accepted decisions;
* remove an accepted decision;
* understand blocked/stale decisions.

Do not implement.

Classify as:

* required next;
* useful later;
* unnecessary for current milestone.

---

# 24. Reversibility Audit

A durable accepted decision can currently be superseded via another accepted Supported SuggestedFix, but there is no general persistent management surface.

Ask:

> Can the user reasonably withdraw an accepted choice if no new SuggestedFix appears?

If no, minimal Remove support may now be required.

---

# 25. Blocked Decision Policy

A blocked `placeOccurrence` means:

* user authority exists;
* target resolves;
* requested exact placement cannot currently be realized.

Determine what recommendations should do.

Preferred policy to evaluate:

1. recommend changes to blockers before recommending abandonment of accepted placement;
2. identify the blocked accepted choice explicitly;
3. if no feasible preserving fix exists, offer explicit reconsideration/supersession.

---

# 26. Blocked Decision Is Not Stale

Do not treat blocked decisions as obsolete.

The intent remains applicable.

Recommendation policy should try to satisfy it if feasible.

---

# 27. Applied Decision With New Friction

An applied decision may create overlap or pressure.

Determine whether recommendations should:

* preserve it by default;
* recommend moving other flexible occurrences first;
* eventually suggest reconsidering it.

Likely yes in that order.

---

# 28. Omit Decision Policy

An applied omission removes an occurrence.

SuggestedFix should not recommend scheduling that exact omitted occurrence unless explicitly proposing to reverse/supersede the omission.

Audit whether current engine can currently create such a contradictory recommendation.

---

# 29. Duration Decision Policy

If exact accepted duration contributes to friction:

* prefer decision-preserving changes elsewhere;
* if suggesting another duration for same occurrence, label as revision of accepted duration.

---

# 30. Priority Decision Policy

Same principle.

Do not let engine heuristics effectively erase accepted priority by recommending opposite priority without context.

---

# 31. Place Decision Policy

Hard placement deserves strongest preservation because replay intentionally forbids fallback.

Recommendation engine should recognize it as a hard user planning constraint unless explicitly suggesting supersession.

---

# 32. Fixed Template Relationship

Fixed templates are authored authority.

A PlanDecision cannot relocate them.

Recommendation policy must preserve that distinction:

* authored fixed time edit → Setup workflow;
* accepted occurrence decision → decision supersession workflow.

Do not conflate them.

---

# 33. Work/Manual Relationship

Work/manual are currently capability-inapplicable for PlanDecision V1.

Recommendations affecting them must continue to route through authored workflows if any are supported.

No decision-aware policy should imply work/manual PlanDecision support.

---

# 34. StaleSourceMissing Policy

A decision whose source is gone has no current schedule effect.

Should it influence recommendations?

Preferred:

* no scheduling recommendation constraint;
* optionally surface stale decision management separately.

Do not recommend around a non-existent occurrence merely because a stale record remains.

---

# 35. StaleLifetime Policy

Same.

Never let old decision authority constrain a fresh same-ID source.

This is a critical lifetime-safety invariant.

---

# 36. StaleOccurrenceMissing Policy

Source lifetime remains but occurrence currently does not exist.

No recommendation should retarget another occurrence.

If the occurrence later returns, decision may reactivate.

---

# 37. OutsideWindow Policy

Outside-window decision has no effect on current Preview but is not stale.

Do not recommend removing/changing it merely because it is absent from the current range.

---

# 38. Invalid / Unsupported Decision Policy

These should not reach replay from valid authority, but durable ingress quarantine/protection exists.

Recommendation engine should ignore quarantined/unsupported entries.

No repair suggestions in this task.

---

# 39. Decision Result And SuggestedFix Input

Determine whether future SuggestedFix generation should receive:

* PlanDecision collection;
* replay-result collection;
* decision-aware friction annotations;
* some smaller derived recommendation context.

Prefer the narrowest pure input.

---

# 40. No Persistence Dependency

Recommendation generation must not reach into decision storage.

Like replay, it should consume explicit derived/current inputs.

---

# 41. Recommendation Engine Boundary

Audit current:

* `generateSuggestedFixes`;
* inputs;
* relationship to `FrictionPoint`;
* block IDs;
* action payload generation.

Identify where decision context can be introduced later with minimal coupling.

---

# 42. Runtime-ID Concern

Current SuggestedFix often uses runtime IDs.

Decision-aware recommendation policy must not create new durable identity from those IDs.

A future superseding recommendation can still locate current occurrence by runtime ID for Try, then use the existing Task 2.36 mapper to create the durable target.

---

# 43. Recommendation Output Schema

Determine whether `SuggestedFix` itself needs future metadata such as:

```text
affectsAcceptedDecision
decisionId
recommendationRelationship:
    preserve
    supersede
    resolveBlocker
```

Do not implement.

Evaluate necessity.

---

# 44. Avoid Decision Type Leakage

If possible, SuggestedFix should carry semantic recommendation context rather than embed full PlanDecision records.

---

# 45. Decision-Aware SuggestedFix Categories

Define future categories conceptually:

* `ordinary`;
* `decisionPreserving`;
* `decisionSuperseding`;
* `decisionUnblocking`.

Determine whether all are necessary.

---

# 46. Decision-Unblocking Recommendation

A fix targeted at another occurrence that makes an accepted blocked decision feasible.

This should not be labeled as superseding the decision.

It is preserving user authority.

---

# 47. Decision-Preserving Ranking

Define whether decision-preserving recommendations should rank ahead of decision-superseding ones.

Preferred:

> yes, all else reasonably equal.

This aligns recommendation policy with accepted authority.

---

# 48. Recommendation Ranking

Current SuggestedFix ordering may be deterministic but not decision-aware.

Audit exact ranking.

Define future ranking constraints without overhauling all heuristics.

---

# 49. No False Promise

A recommendation should not say it will “fix” a blocked accepted decision unless Try/replay evidence proves the proposed change resolves it.

Recommendation language must remain probabilistic/accurate where appropriate.

---

# 50. Try Policy With Accepted Decisions

Current Try remains allowed on fresh decision-replayed Preview.

Confirm this remains appropriate.

A contradictory Try is allowed because it is experimental.

Durable authority does not change until Accept.

---

# 51. Try Preview Semantics

A Try may temporarily visually contradict an accepted PlanDecision.

This is acceptable if clearly temporary.

Regeneration restores durable authority.

Determine whether UI needs an indicator:

> “Trying a temporary change to an accepted choice.”

---

# 52. Accept Of Contradictory Try

Accept creates a superseding PlanDecision via existing one-target semantics.

No special persistence mechanism.

---

# 53. Decision Removal Versus Supersession

Recommendation policy should not use a “move somewhere else” decision to simulate removing an omission or other accepted choice where simple removal is semantically different.

Audit whether explicit removal is required.

---

# 54. Revert To Authored Behavior

Important user intent:

> “Stop remembering this accepted choice and go back to normal scheduling.”

This cannot always be represented by another PlanDecision.

It requires removal.

Determine whether Task 2.38 should implement contextual decision removal.

---

# 55. Removal And Preview

Existing store `removePlanDecision` already exists.

Task 2.35 stales Preview on removal.

A future UI can remove → regenerate.

No new domain semantics needed.

---

# 56. Recommendation To Remove Decision

Determine whether SuggestedFix should ever recommend:

> Remove your accepted decision.

Preferred initial policy:

* recommendation may suggest reconsideration;
* explicit removal/supersession remains user action.

Do not let engine automatically remove.

---

# 57. Current Acceptance Status Discoverability

Audit current UI after the immediate Task 2.36 feedback disappears or navigation changes.

Can the user later tell an accepted decision is shaping the Preview?

If not, this is an explainability gap.

---

# 58. Persistent Contextual Marker

Determine whether affected occurrences should show minimal accepted-decision state on fresh Preview.

Potential:

* accepted placement;
* accepted duration;
* accepted priority.

Omitted occurrences require another representation because the block is absent.

Do not implement.

---

# 59. Omitted Decision Discoverability

Because omitted occurrence is not shown in schedule output, determine how a user could know it is intentionally omitted.

Potential future:

* decision summary;
* day detail indicator;
* replay-result summary.

This may strengthen case for minimal management UI.

---

# 60. Blocked Decision Discoverability

Blocked placement leaves occurrence unplaced and replay result exists.

Determine whether current unplaced UI exposes enough context.

---

# 61. Stale Decision Discoverability

Stale decisions remain durable intentionally.

Without a management surface, they may become invisible.

Determine whether that is acceptable before Phase 2 closes.

---

# 62. Decision-Aware Summary

The user's preferred future Summary surface includes recommendations and progress.

Determine whether accepted/stale/blocked decisions conceptually belong there later.

Do not implement product redesign.

---

# 63. Recommendation Explainability

Future recommendation should be able to explain:

* whether it preserves an accepted choice;
* whether it asks to revise one;
* which accepted choice is involved;
* why DayFrame is proposing the change.

This is more important than exposing internal decision IDs.

---

# 64. PlanDecision ID In UI

Do not expose IDs.

Use semantic explanation.

---

# 65. Decision Provenance In Recommendation Policy

Whether a decision originated from user-direct intent or SuggestedFix should **not** change its authority.

Once accepted, both are user-authorized PlanDecision records.

Confirm.

---

# 66. acceptedAt In Recommendation Policy

Must not affect authority/ranking.

Do not prefer newer decisions merely because of timestamp unless supersession already resolved them.

---

# 67. Durability Failure And Recommendation Policy

A session-authoritative PlanDecision whose persistence failed still shapes the current Preview.

Recommendation engine must treat current runtime authority as real during the session.

Do not ignore it because durability is not yet `durable`.

---

# 68. Protected Decision Ingress

When whole decision ingress is protected, valid runtime decision authority may be unavailable or constrained.

Audit current safe state.

Recommendation engine must use only current valid runtime decisions, never raw protected data.

---

# 69. Quarantined Decisions

No recommendation effect.

They are preserved data, not active authority.

---

# 70. Profile Activation

Old decisions become staleLifetime.

Recommendations for newly instantiated profile occurrences must not be constrained by those old decisions.

---

# 71. Backup V1 Import

Same.

---

# 72. Backup V2 Restore

Exact old lifetimes may reactivate decisions.

Recommendations after regeneration must once again treat those decisions as accepted authority.

---

# 73. Active Abandonment

Decisions remain retained but stale against reset active authority.

No recommendation effect until exact target returns.

---

# 74. Full Clear

Decisions removed.

No recommendation effect.

---

# 75. Source Update

If target remains and decision still applies:

* recommendation must respect it.

If occurrence disappears:

* stale decision no longer constrains schedule.

---

# 76. Boundary Change

A `placeOccurrence` decision recomputes concrete placement from current boundary semantics.

Recommendation policy sees current replayed result, not old concrete timestamp.

---

# 77. Decision Blocked By Authored Hard Constraint

Authored authority outranks PlanDecision.

Recommendation policy may:

1. suggest moving other flexible material;
2. suggest authored-edit navigation where appropriate;
3. suggest revising decision.

It must not treat PlanDecision as capable of overriding authored hard constraint.

---

# 78. Decision Blocked By Another PlanDecision

Can this occur under one-decision-per-target? Yes, two decisions on different occurrences may compete.

Define policy.

Preferred:

* neither decision automatically outranks the other;
* recommendation engine should seek alternative resolution;
* if conflict requires revising one, identify both as accepted user choices and ask user to choose/reconsider.

---

# 79. PlanDecision Versus PlanDecision Priority

Do not derive priority from:

* acceptedAt;
* decision ID;
* provenance.

No accepted decision silently outranks another solely on metadata.

---

# 80. Mutual Hard Placement Conflict

Two accepted exact placements may conflict.

Current placement ordering may deterministically apply one and block the other.

Audit exact behavior.

Determine whether this deterministic processing order represents authority or only execution tie-breaking.

Likely:

> execution tie-break only, not semantic preference.

This distinction is important.

---

# 81. Recommendation For Decision-Decision Conflict

Future recommendations should make the conflict explicit rather than implying one accepted choice was less important.

Potential recommendation:

> These two accepted placements cannot both be satisfied.

Do not automatically select one.

---

# 82. Priority Decision Interaction

An accepted priority may legitimately make another flexible occurrence lose placement.

Recommendations can adjust the other occurrence first.

If suggesting changing accepted priority, label revision explicitly.

---

# 83. Omission And Goals/Allocations

Future Summary may treat omitted occurrence as intentional planning choice rather than scheduling failure.

Task 2.37 may note this, but no progress/goal implementation is authorized.

---

# 84. Friction Semantics With Omission

Omitted occurrence generates no ordinary unplaced friction.

Confirm this remains appropriate.

No recommendation should attempt to "fix" its absence as scheduling failure.

---

# 85. Friction Semantics With Duration

Applied duration changes actual derived occupancy.

Normal friction is correct.

Recommendation engine needs awareness only if suggesting change to that accepted duration.

---

# 86. Friction Semantics With Priority

Priority itself may not appear directly in friction but shapes placement.

Decision-aware explanation may require tracing that the accepted priority contributed to placement choice.

Determine whether current evidence can establish this causally.

Avoid claiming causation if not knowable.

---

# 87. Friction Semantics With Placement

Exact hard placement can directly produce friction.

This is easiest decision-shaped friction to identify.

---

# 88. Causality Standard

Recommendation engine should not claim:

> Your accepted decision caused this conflict

unless replay evidence can actually establish that relationship.

Prefer:

> This conflict involves an accepted placement.

when causality is uncertain.

---

# 89. Counterfactual Recommendation Analysis

Determine whether generating decision-preserving recommendations requires counterfactual scheduling.

Example:

* would conflict disappear if accepted placement were removed?

Do not authorize expensive/general counterfactual engine work without evidence.

Prefer local relationships where possible.

---

# 90. Minimal V1 Recommendation Awareness

Aim for the smallest useful policy implementation later.

Potential minimum:

1. know which current scheduled/unplaced occurrences have applied/blocked PlanDecisions;
2. annotate suggestions targeting them as superseding;
3. prefer non-targeted alternatives first;
4. never silently contradict accepted intent.

No full counterfactual planner required.

---

# 91. SuggestedFix Target Audit

Audit each current SuggestedFix action and determine:

* does it target one occurrence?
* can that occurrence have an active PlanDecision?
* would applying the fix preserve or supersede it?
* can the relationship be computed cheaply?

Produce a matrix.

---

# 92. `moveBlock`

If target already has accepted `placeOccurrence`, a different move directly supersedes it.

If target has duration/priority/omit decision, determine relationship.

Because V1 permits one decision per target, any accepted move would supersede whatever exists.

But Try may temporarily coexist visually.

---

# 93. `skipBlock`

Accepted skip supersedes any same-target current decision.

Suggested skip targeting an accepted occurrence should be labeled as replacing accepted choice.

---

# 94. `reduceDuration`

Same.

---

# 95. `changePriority`

Same.

---

# 96. `changeFixedTime`

Authored workflow.

If friction involves an occurrence with PlanDecision, determine whether editing fixed authored time may invalidate/stale decision coordinates.

The user should understand this is changing source authority rather than revising decision.

---

# 97. `addResource`

Audit current semantics.

Likely decision-preserving because it changes authored/resource context rather than same occurrence intent.

Do not assume.

---

# 98. `convertToRecovery`

Audit current semantics and whether current implementation exists.

Do not invent policy for unsupported behavior.

---

# 99. `acceptConflict`

Still deferred.

No recommendation-policy implementation should make it durable without DurableConflictReference architecture.

---

# 100. Recommendation Relationship Matrix

Produce:

| SuggestedFix action | Target has active decision | Relationship |
| ------------------- | -------------------------- | ------------ |

Use:

* preserves;
* supersedes;
* unrelated;
* authored-edit;
* unsupported;
* unresolved.

---

# 101. Replay Outcome → Recommendation Policy Matrix

Produce:

| Replay outcome | SuggestedFix policy |
| -------------- | ------------------- |

At minimum:

* applied;
* blocked;
* inapplicable;
* staleSourceMissing;
* staleLifetime;
* staleOccurrenceMissing;
* outsideWindow.

---

# 102. Applied Policy

Possible:

* decision is active authority;
* ordinary recommendations should preserve it where feasible;
* same-target changes explicitly supersede.

---

# 103. Blocked Policy

Possible:

* prioritize unblocking alternatives;
* make blocked accepted decision visible;
* if no alternative, propose explicit supersession/removal.

---

# 104. Inapplicable Policy

A valid decision targeting a currently unsupported family/action cannot shape schedule.

Determine whether it should trigger recommendation-management feedback rather than ordinary SuggestedFix.

Likely no scheduling recommendation based on it.

---

# 105. Stale Policy

No schedule effect.

Do not constrain ordinary recommendations.

Potential management notice only.

---

# 106. OutsideWindow Policy

No current-range recommendation effect.

---

# 107. Decision-Aware Recommendation Result Metadata

Determine future minimal schema.

Potential:

```ts
decisionContext?: {
  relationship:
    | "preserves"
    | "supersedes"
    | "unblocks";
  decisionId: PlanDecisionId;
}
```

Do not implement.

Assess whether storing decision ID in **derived SuggestedFix** is acceptable.

Unlike persistence, transient IDs are fine for current authority lookup, but semantic target may be safer.

---

# 108. Durable Decision ID In Derived SuggestedFix

A `PlanDecisionId` is durable stable identity and could safely be referenced transiently.

But if the decision changes before Try, Preview freshness guards should protect.

Assess.

---

# 109. Recommendation And Preview Freshness

Any decision mutation stales Preview.

Therefore any decision-aware SuggestedFix generated from the old decision context automatically becomes stale/unusable.

This is a strong safety foundation.

Confirm.

---

# 110. Recommendation Try Candidate

Task 2.36 mapper currently creates a new decision candidate from the tried occurrence.

If a SuggestedFix explicitly supersedes an existing decision, no new mapping machinery may be required.

The store's same-target supersession already handles it.

Confirm.

---

# 111. Recommendation Labeling Is Main Missing Piece

Potential conclusion:

> Decision-aware recommendation behavior may require only metadata/ranking/copy, not new PlanDecision workflow mechanics.

Audit this carefully.

---

# 112. Existing Contradictory Suggestion Reproduction

Create concrete current-system examples where:

* an accepted decision is replayed;
* friction is generated;
* SuggestedFix proposes changing the same target or conflicting with the decision.

If no such example exists under current generator, document.

Do not assume the problem exists merely because it is theoretically possible.

---

# 113. Existing Recommendation Ranking Audit

Inspect deterministic ordering and generation rules.

Determine whether decision-preserving suggestions already happen to rank first or whether policy changes will be required.

---

# 114. Recommendation Suppression

Determine whether some suggestions should be completely suppressed.

Preferred cautious rule:

> Do not suppress a potentially useful option solely because it revises accepted intent; relabel/rank it appropriately unless showing it would be misleading or redundant.

This preserves user agency.

---

# 115. Recommendation Redundancy

A SuggestedFix that proposes the exact same semantic choice as the current accepted PlanDecision is redundant.

Future policy should likely suppress it.

Define semantic equality using target + resulting PlanDecision candidate.

---

# 116. Decision-Equivalent Suggestion

If current accepted decision is:

```text
place target at 09:00
```

and SuggestedFix proposes exactly 09:00 again:

* no useful action;
* suppress.

Likewise exact duration/priority/omit.

---

# 117. Superseding Suggestion

If same target but different semantic decision:

* keep only if useful;
* mark as revision.

---

# 118. Decision-Preserving Suggestion

Different target/source adjustment that preserves current decision:

* ordinary Try/Accept behavior for that other occurrence;
* optionally mark as resolving around accepted choice.

---

# 119. Recommendation Against Stale Decision

No special relationship because stale decision is not current schedule authority.

Do not label ordinary suggestion as superseding stale intent unless the exact target is somehow being intentionally revived.

---

# 120. Decision Retention And User Expectations

Stale decisions can reactivate after Backup V2 restore.

Evaluate whether invisible retained decisions may surprise users.

This is likely a management/explainability issue.

---

# 121. Backup V3 Audit

Now that PlanDecision is durable and user-visible through Accept, audit backup claims and recovery completeness.

Current Backup V2:

* restores active authored lifetimes;
* does not include PlanDecisions.

Therefore:

> it no longer captures all durable planning authority.

Determine severity.

---

# 122. Backup Completeness Classification

Classify current Backup V2 as:

* authored-state recovery backup;
* incomplete full-user-state backup;
* another precise term.

Audit current UI copy/docs.

If they imply complete DayFrame recovery, mark mismatch.

---

# 123. Backup V3 Priority

Determine whether Backup V3 must occur:

## before Phase 2 completion;

## before any broader PlanDecision UI;

## later but before release;

## only when backup product claims require it.

Give a recommendation backed by current UX and data-risk analysis.

---

# 124. Backup V2 Restore With Retained Local Decisions

Current behavior may cause retained local PlanDecisions to reactivate when exact lifetimes return.

This is logically consistent but means restore result depends on local decision surface not contained in the backup.

Assess whether that violates user expectations.

---

# 125. Cross-Device Backup Risk

If Backup V2 is restored on another environment with no PlanDecision surface:

* authored lifetimes return;
* accepted planning decisions do not.

This may produce a different schedule than the exporting environment.

This is important.

Document.

---

# 126. Backup V3 Architectural Need

A future complete recovery package likely needs:

* Active authored authority;
* PlanDecision surface;
* perhaps Profile surface depending backup semantics.

Do not design full V3 here unless needed to rank urgency.

---

# 127. Profiles And Decisions

Profiles correctly exclude decisions because they instantiate fresh lifetimes.

No change.

---

# 128. Backup Versus Profile Epistemic Boundary

Reaffirm:

* Profile = reusable pattern;
* Backup = recovery.

As durable decisions become first-class user authority, recovery completeness should eventually include them.

---

# 129. Phase 2 Exit Criteria Audit

Determine whether Phase 2's conceptual goal requires:

* accepted decisions survive restart — yes;
* accepted decisions influence regeneration — yes;
* explicit acceptance exists — yes;
* recommendations respect decisions — not yet;
* backup captures decisions — possibly;
* user can remove decisions — possibly.

Use this to guide next tasks.

---

# 130. Minimum Decision Management Before Phase 2 Exit

Determine whether Phase 2 should require:

1. contextual remove;
2. accepted marker;
3. stale/blocked summary;
4. none.

Provide evidence-based recommendation.

---

# 131. Recommendation-Aware Policy Before Phase 2 Exit

Likely required because current engine may generate recommendations that ignore user authority.

Determine if this is a correctness issue or UX refinement.

---

# 132. Correctness Versus UX

Classify findings:

## Correctness defect

A suggestion/action can silently override or corrupt accepted authority.

## Policy/UX gap

A suggestion is technically safe because Try/Accept supersession is explicit, but its wording/ranking ignores accepted authority.

This distinction determines whether immediate correction is mandatory.

---

# 133. Auto-Override Audit

Confirm no SuggestedFix is automatically applied.

Because all accepted decision changes require explicit Accept, contradictory recommendations may be confusing but should not currently override authority automatically.

This likely keeps issue in policy/UX rather than correctness.

Verify.

---

# 134. Stale Preview Safety Audit

Because decision changes stale Preview and stale suggestions are disabled, a recommendation based on old decision authority cannot be accepted after the authority changes.

Confirm end to end.

---

# 135. Decision Protection Audit

Whole decision ingress protection blocks Accept.

Recommendation Try may remain Preview-only.

Confirm no recommendation path overwrites protected decision storage.

---

# 136. Persistence Failure Audit

Session-authoritative decision replay/recommendations use current runtime decisions despite save failure.

This is consistent with authority model.

Confirm UI wording doesn't imply durable state if save failed.

---

# 137. End-to-End Acceptance Determinism

Run accepted path multiple times from equivalent inputs.

Confirm:

* same semantic decision;
* same replay effect;
* same recommendation relationship classification conceptually.

No hidden Preview-history dependence.

---

# 138. Try Without Accept Audit

Confirm recommendations after regeneration ignore prior Try state.

Only durable decisions matter.

---

# 139. Supersession Audit

Accepted superseding decision replaces previous current record.

New recommendations must evaluate only current decision.

No history ambiguity.

---

# 140. Decision Removal Audit

Store operation exists even if UI does not.

Removing decision → Preview stale → regeneration returns authored/default behavior.

Confirm.

This informs management-UX recommendation.

---

# 141. Recommendation After Removal

No decision-aware labeling should remain for removed decision.

---

# 142. Decision Quarantine Audit

Quarantined invalid decisions are not replayed and should not affect recommendations.

Confirm.

---

# 143. Whole Decision Protection Audit

Protected surface may load safe empty current authority.

Document whether recommendations operate on that safe runtime state.

They must not infer accepted intent from raw protected bytes.

---

# 144. Explainability Contract

Define future recommendation explanation requirements.

At minimum, when recommendation supersedes an accepted decision:

* identify that an accepted choice is being revised;
* state the proposed new semantic outcome;
* preserve explicit Try → Accept.

When preserving/unblocking:

* explain that another change may help honor the accepted choice, if causal evidence is adequate.

---

# 145. No Anthropomorphic Intent Claims

Do not phrase engine-derived explanation as knowing why the user accepted the choice.

Persisted provenance is insufficient for psychological motive.

Say:

> “You accepted this placement.”

not:

> “You preferred this because…”

---

# 146. Recommendation Policy Output

Task 2.37 must produce a formal policy suitable for implementation.

Suggested form:

### Rule 1 — Accepted authority preservation

### Rule 2 — Equivalent suggestions suppressed

### Rule 3 — Preserving fixes preferred

### Rule 4 — Superseding fixes explicitly labeled

### Rule 5 — Blocked decisions get unblocking recommendations first

### Rule 6 — Stale/outside-window decisions do not constrain current recommendations

### Rule 7 — No automatic PlanDecision mutation

Refine from evidence.

---

# 147. Recommendation Ranking Policy

Define deterministic future ranking tiers.

Possible:

1. decision-preserving / ordinary fixes;
2. decision-unblocking fixes;
3. decision-superseding fixes.

Or unblocking ahead of preserving depending semantics.

Investigate.

---

# 148. Equivalent-Fix Suppression Policy

Define semantic equivalence test.

Potential:

* map SuggestedFix to prospective PlanDecision candidate;
* compare target/kind/payload with current decision.

Only for supported single-target actions.

No need for runtime-ID comparison.

---

# 149. Unsupported SuggestedFix Policy

`changeFixedTime`, `addResource`, etc. need separate relationship classification.

Do not force them through PlanDecision mapper.

---

# 150. Recommendation Metadata Proposal

Task 2.37 should propose an implementation-ready transient metadata shape if needed.

Do not implement.

Example conceptual:

```ts
type SuggestedFixDecisionContext =
  | { relationship: "none" }
  | { relationship: "preserves"; decisionId: PlanDecisionId }
  | { relationship: "unblocks"; decisionId: PlanDecisionId }
  | { relationship: "supersedes"; decisionId: PlanDecisionId };
```

Only adopt if evidence supports it.

---

# 151. Decision ID Versus Target In Metadata

Choose whether transient recommendation metadata should reference:

* `PlanDecisionId`;
* target key;
* both.

PlanDecision ID is likely sufficient for current authority lookup, but semantic relationship may require target.

Document choice.

---

# 152. No Durable SuggestedFix Change Required

Recommendation metadata is derived Preview state.

No persistence format change should be needed.

Confirm.

---

# 153. No Durable PlanDecision Change Required

Policy should work with current V1 records.

If it does not, stop and identify missing semantic data.

---

# 154. No DurableOccurrenceReference Change Required

Likewise.

---

# 155. Recommendation Test Strategy

Define future direct tests covering:

* equivalent recommendation suppression;
* preserving recommendation preferred;
* superseding recommendation labeled;
* blocked decision unblocking;
* stale decision ignored;
* outside-window ignored;
* two accepted decisions conflicting;
* decision mutation stales old recommendation.

---

# 156. Current-System Reproduction Tests

Task 2.37 may add investigation-only tests if needed to prove current contradictory recommendation behavior.

No production changes by default.

---

# 157. Decision-Decision Conflict Investigation

Construct two exact placement decisions that compete.

Observe:

* replay ordering;
* applied/blocked results;
* resulting friction;
* current SuggestedFix output.

Use this to define policy.

---

# 158. Deterministic Tie-Break Audit

Current replay sorts by target key/decision ID.

Confirm this is execution determinism only.

Recommendation explanations must not imply the applied decision outranks the blocked one in user importance.

---

# 159. Management UX Audit

Using current app, inspect whether the user can:

* see current accepted choice after leaving immediate workflow;
* understand omitted accepted occurrence;
* identify blocked decision later;
* remove a decision without waiting for a superseding SuggestedFix.

Record gaps.

---

# 160. Minimal Management Recommendation

If required, recommend a narrow next task, potentially:

> contextual accepted-decision indicator + Remove action

rather than a global manager.

---

# 161. Broader Management Deferred

Full Planner/Summary decision-management UX remains later unless audit proves necessary.

---

# 162. Architecture Checkpoint

If the accepted planning authority loop is clean, consider creating:

`docs/checkpoints/CHECKPOINT_Phase_2_Accepted_Planning_Authority.md`

It should summarize:

* durable target;
* decision authority;
* persistence;
* replay;
* Try → Accept;
* freshness;
* recommendation policy;
* known backup limitation;
* readiness for next implementation.

Create only if audit supports it.

---

# 163. Checkpoint Publication Criteria

Do not publish if:

* accepted decision can be silently overridden;
* stale decisions retarget;
* Try leaks into durable authority;
* recommendation acceptance bypasses explicit Accept;
* decision persistence/replay diverge;
* major correctness defect exists.

---

# 164. Governance Updates

If normal project practice requires it, update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;

only to record accepted policy/checkpoint.

No speculative roadmap expansion.

---

# 165. Evidence Classification

Use:

* **Confirmed**
* **Architectural determination**
* **Inferred**
* **Not found**
* **Mismatch**
* **Unresolved**
* **Blocked**
* **Ready**

Separate current executable behavior from future recommendation policy.

---

# 166. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.37_AUDIT_END_TO_END_ACCEPTED_PLANNING_AUTHORITY_AND_DEFINE_DECISION_AWARE_RECOMMENDATION_POLICY_RESULT.md`

The result must include at least:

1. Executive Determination
2. Artifact Integrity
3. Governing Evidence
4. Repository Baseline
5. End-to-End Accepted Authority Trace
6. Authority Hierarchy
7. Accepted-Decision Semantics
8. Recommendation Authority Boundary
9. Current SuggestedFix Audit
10. Current Replay Result Audit
11. Current Friction Audit
12. Decision-Shaped Friction Determination
13. Contradictory Recommendation Definition
14. Direct/Indirect Contradiction
15. Decision-Preserving Fixes
16. Decision-Superseding Fixes
17. Decision-Unblocking Fixes
18. Recommendation Ranking Policy
19. Equivalent Recommendation Suppression
20. SuggestedFix Provenance
21. Try Semantics With Existing Decisions
22. Superseding Accept Semantics
23. Applied Decision Policy
24. Blocked Decision Policy
25. Omit Decision Policy
26. Duration Decision Policy
27. Priority Decision Policy
28. Placement Decision Policy
29. Fixed Template Boundary
30. Work/Manual Boundary
31. StaleSourceMissing Policy
32. StaleLifetime Policy
33. StaleOccurrenceMissing Policy
34. OutsideWindow Policy
35. Invalid/Unsupported Policy
36. Decision-Decision Conflict
37. Tie-Break Semantics
38. Causality Standard
39. Counterfactual Requirement Assessment
40. Minimal Recommendation Awareness Model
41. SuggestedFix Relationship Matrix
42. Replay Outcome Policy Matrix
43. Recommendation Metadata Determination
44. Recommendation Copy/Explainability Contract
45. Persistent Accepted-Decision Visibility
46. Omitted Decision Discoverability
47. Blocked Decision Discoverability
48. Stale Decision Discoverability
49. Decision Removal Requirement
50. Management UX Determination
51. Profile Activation Behavior
52. Backup V1 Behavior
53. Backup V2 Behavior
54. Backup Completeness Assessment
55. Cross-Device Recovery Risk
56. Backup V3 Priority
57. Phase 2 Exit Criteria Assessment
58. Correctness Versus UX Classification
59. Stale Preview Safety
60. Protected Decision Ingress
61. Quarantine
62. Persistence Failure Semantics
63. End-to-End Determinism
64. Try-Only Audit
65. Supersession Audit
66. Removal Audit
67. Recommended Policy Rules
68. Recommended Ranking Rules
69. Recommended Metadata Shape
70. Future Test Strategy
71. Architecture Checkpoint Determination
72. Checkpoint Artifact
73. Governance Updates
74. Architectural Alignment Assessment
75. Correctness Defects, if any
76. Required Corrective Work, if any
77. Deviations
78. Discoveries and Deferred Work
79. Recommended Next Task
80. Validation
81. Final Completion Determination

---

# 167. Required Matrices

## A. SuggestedFix / Decision Relationship Matrix

| SuggestedFix kind | No current decision | Same-target current decision | Different-target decision | Relationship |
| ----------------- | ------------------- | ---------------------------- | ------------------------- | ------------ |

## B. Replay Outcome → Recommendation Matrix

| Replay outcome | Constrains recommendations? | Preferred policy |
| -------------- | --------------------------: | ---------------- |

## C. Recommendation Authority Matrix

| Recommendation type | May Try? | May Accept? | Effect on existing decision |
| ------------------- | -------: | ----------: | --------------------------- |

Cover:

* ordinary;
* preserving;
* unblocking;
* superseding;
* equivalent/redundant.

## D. Decision Visibility Matrix

| Decision state | Currently visible later? | Visibility required? | Recommended surface |
| -------------- | -----------------------: | -------------------: | ------------------- |

Cover:

* applied placement;
* applied duration;
* applied priority;
* omission;
* blocked;
* stale.

## E. Backup Completeness Matrix

| Durable surface | Backup V2 includes? | Required for exact planning recovery? |
| --------------- | ------------------: | ------------------------------------: |

Cover:

* Active V2;
* PlanDecision V1;
* Profile V2.

## F. Phase 2 Exit Matrix

| Capability | Status | Required before Phase 2 exit? |
| ---------- | ------ | ----------------------------: |

---

# 168. Recommended Policy Baseline To Evaluate

The audit should explicitly accept, refine, or reject this baseline:

1. **Accepted decisions are user planning authority.**
2. **Recommendations never silently override them.**
3. **Equivalent same-target recommendations are suppressed.**
4. **Decision-preserving fixes are preferred where feasible.**
5. **Blocked decisions trigger unblocking recommendations before supersession recommendations where reasonable.**
6. **Superseding recommendations remain available when useful but are explicitly labeled as revisions to accepted intent.**
7. **Try remains safe and temporary even when it contradicts an accepted decision.**
8. **Only explicit Accept supersedes current PlanDecision authority.**
9. **Stale decisions do not constrain current scheduling recommendations.**
10. **Outside-window decisions do not constrain the current Preview's recommendations.**
11. **Two conflicting accepted decisions have equal user-authority status; deterministic replay order is not semantic priority.**
12. **Recommendation explanations must distinguish authored constraints from accepted planning choices.**
13. **No recommendation mutation occurs during generation.**

---

# 169. Backup V3 Determination Requirement

Task 2.37 must produce one of:

* **Backup V3 required immediately**
* **Backup V3 required before Phase 2 exit**
* **Backup V3 required before broader release**
* **Backup V3 safely deferred**

Provide reasoning based on:

* durable PlanDecision value;
* existing Backup UI claims;
* cross-device restore behavior;
* user expectations;
* recovery completeness.

---

# 170. Decision Management Determination Requirement

Task 2.37 must produce one of:

* **Minimal removal/visibility required immediately**
* **Required before Phase 2 exit**
* **Useful but safely deferred**
* **Not currently required**

Do not leave this unresolved.

---

# 171. Recommendation Implementation Readiness

Task 2.37 must conclude:

* **Ready**
* **Ready with constraints**
* **Blocked**

for implementing decision-aware recommendation behavior.

If ready, specify the exact next implementation scope.

---

# 172. Investigation-Only Changes

Prefer no production changes.

Narrow regression/investigation tests are authorized only if they prove current behavior.

Do not implement the recommendation policy under Task 2.37.

---

# 173. Full Validation

Run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Record exact counts.

No checkpoint publication if validation fails.

---

# 174. Architectural Alignment Assessment

Assess against:

* explicit user authority;
* internal consistency;
* lifetime safety;
* deterministic scheduling;
* non-destructive durable data;
* explainability;
* recommendation humility;
* authored-versus-derived separation;
* recovery completeness;
* user reversibility.

Use:

* Aligned
* Partially aligned
* Misaligned
* Unresolved

---

# 175. Stop Conditions

Stop and report if:

* SuggestedFix application can currently mutate PlanDecision without explicit Accept;
* replay can silently override another accepted decision without surfaced blocked status;
* stale decision can retarget a recreated lifetime;
* current decision persistence or replay behavior contradicts Tasks 2.33–2.36;
* recommendation policy requires changing DurableOccurrenceReference;
* recommendation awareness requires PlanDecision schema changes;
* current friction lacks enough information to identify decision relationship safely and needs a prerequisite architectural task;
* Backup V2 currently claims complete recovery in a materially misleading way requiring immediate correction;
* full validation fails from an unrelated regression.

---

# 176. Recommended Follow-On Boundary

If Task 2.37 determines recommendation awareness is ready and no prerequisite is more urgent, the likely next task should be:

> **Task 2.38 — Implement Decision-Aware SuggestedFix Classification, Ranking, and Supersession Messaging**

That task should:

* consume current replay/decision context;
* suppress semantically redundant suggestions;
* classify preserving/unblocking/superseding recommendations;
* rank decision-preserving options appropriately;
* annotate superseding suggestions;
* preserve Try → Accept;
* make no automatic decision mutation.

However, if Task 2.37 determines minimal decision removal/visibility or Backup V3 is a more urgent correctness/recovery prerequisite, recommend that task instead.

---

# 177. Task Determination

**Authorized:** end-to-end audit of accepted PlanDecision authority from recommendation through Try, acceptance, persistence, replay, friction, and subsequent recommendations; formal definition of decision-aware recommendation policy; decision visibility/removal and Backup V3 urgency assessment; narrowly scoped investigation tests; optional checkpoint publication if the architecture is clean.

**Not authorized:** implementation of recommendation awareness, decision-management UI, Backup V3, new PlanDecision kinds, conflict decisions, DurableOccurrenceReference changes, scheduling redesign, execution/history, or unrelated refactoring.

The governing recommendation principle is:

> DayFrame may recommend reconsidering an accepted planning choice, but it must first recognize that choice as user authority. It must never silently treat durable accepted intent as disposable heuristic output.

---

# 178. Final Completion Statement

**Task 2.37 is complete when DayFrame has an evidence-backed end-to-end audit of accepted planning authority from SuggestedFix through Try, explicit Accept, PlanDecision persistence, Preview invalidation, deterministic replay, friction, and subsequent recommendation generation; when applied, blocked, stale, outside-window, and mutually conflicting accepted decisions have explicit recommendation-policy semantics; when decision-preserving, decision-unblocking, equivalent, and decision-superseding recommendations are formally distinguished and ranked without permitting silent mutation of accepted authority; when recommendation explainability, accepted-decision visibility/removal needs, Backup V3 urgency, and Phase 2 exit requirements are explicitly determined; when recommendation-awareness implementation readiness is classified; when any checkpoint is published only if supported by evidence; when complete repository validation passes; and when no decision-aware recommendation implementation, new durable format, broad management UI, conflict decision, history, or unrelated scheduling behavior is introduced.**
