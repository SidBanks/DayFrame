# Task 9.6 — Review Schedule Evolution V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Subphase:** Schedule Review and Decision Workflow Convergence
**Task Type:** Implementation / Review Workflow / Attention Surface / Proposal Decision Integration / Friction Resolution Entry / Publication Readiness / Regression
**Primary Responsibility:** Evolve the existing Review Schedule surface into DayFrame’s canonical bounded schedule-review workflow by consuming the Task 9.4 scope contract and Task 9.5 Planner presentation foundation, so users can intentionally inspect current schedule truth, evaluate constructive Proposals, understand accepted-but-unrealized authority, identify Friction and coverage limitations, refresh Preview when necessary, and determine publication readiness without introducing another planning reader, another temporal model, another authority path, or new schedule semantics.

---

## 1. Objective

Implement the next Planner workflow:

```text id="wr1pw7"
Planner / Month
      ↓
select Review Scope
      ↓
Review Schedule
      ↓
inspect current schedule + planning state
      ↓
resolve attention
      ↓
evaluate Proposal / accepted state
      ↓
refresh Preview if required
      ↓
determine publication readiness
```

Task 9.6 must answer:

> **Given the period I am reviewing, what schedule truth exists, what requires my attention, what DayFrame is proposing, what I have already accepted, whether Preview is current and covers this scope, what conflicts remain unresolved, and whether this period is ready to publish?**

Review Schedule should become a coherent review workflow.

It must not become a second Planner, schedule engine, or authority store.

---

## 2. Governing Completed Foundations

Treat as settled:

### Phase 8

* Goal Structure;
* Demand/Priority/Projection;
* Commitment Composition;
* Capacity;
* Feasibility;
* provenance/freshness.

### Task 9.1

* Competition;
* Allocation.

### Task 9.2

* Proposal;
* ProposalDecision;
* Accepted Allocation.

### Tasks 9.2.0–9.2.2

* complete footprint;
* accepted-footprint fidelity;
* scheduled/execution/publication identities.

### Task 9.3

* atomic Realization;
* durable Goal work/support/Buffer;
* accepted liability;
* realization conflict behavior;
* explicit publication support.

### Task 9.4

* `ReviewScopeV1`;
* Planning Data Horizon;
* Preview Range;
* Publication Range;
* `queryPlanningReview`;
* coverage states;
* Preview coverage vs freshness;
* unknown vs empty.

### Task 9.5

* Planner/Month convergence;
* canonical semantic presentation adapter;
* explicit epistemic classes;
* selected-day detail;
* Planner navigation;
* no duplicate read model;
* Review Schedule retained as canonical action path.

Do not recreate these layers.

---

## 3. Product Role

Review Schedule V1 should become:

> **the place where the user intentionally evaluates a bounded schedule period and resolves the items that prevent that period from being considered reviewed and publication-ready.**

Planner answers:

> What is happening?

Review Schedule answers:

> Is this period acceptable, what needs attention, and what action should I take before I consider it reviewed?

---

## 4. Planner vs Review Schedule

Preserve the distinction:

### Planner

Broad inspection/navigation workspace.

### Review Schedule

Focused bounded review/action workflow.

Do not make both screens identical.

---

## 5. Explicit Non-Goals

Do not:

* redesign Planner/Month;
* redesign Preview;
* redesign schedule generation;
* redesign Goal/Demand;
* redesign Allocation;
* redesign Proposal semantics;
* redesign acceptance;
* redesign Realization;
* redesign Friction;
* redesign SuggestedFix;
* redesign publication history;
* introduce drag/drop;
* permit arbitrary movement of realized Goal work;
* introduce recurrence;
* introduce execution;
* infer Progress;
* implement Live adaptation;
* implement learning;
* create a new Review persistence authority;
* create another schedule-read query;
* create a second Proposal decision path;
* create a second Friction-resolution authority path.

---

## 6. Existing Review Schedule Audit

Before changes, document the current Review Schedule behavior.

At minimum identify:

* route/component;
* current data source;
* current Preview-generation behavior;
* current stale handling;
* current Friction presentation;
* SuggestedFix actions;
* Move behavior;
* selected range source;
* publication relationship;
* links from Month/Planner;
* any direct store mutation.

Classify each as:

```text id="6n9xuv"
retain
adapt
compose
retire
```

Do not rewrite proven behavior without evidence.

---

## 7. Canonical Read Source

Review Schedule must consume:

```text id="7yrpc2"
queryPlanningReview(...)
```

or the same thin presentation layer established in Task 9.5.

Do not reconstruct state from separate stores inside the screen.

---

## 8. Review Scope Source

Review Schedule must receive or construct a `ReviewScopeV1`.

Preferred integration:

```text id="lc2fde"
Planner Review Scope
→ Review Schedule
```

When launched contextually from Month/day detail, preserve the relevant selected scope.

Do not invent a new generic date range.

---

## 9. Direct Entry

If Review Schedule can still be entered directly:

* construct a deterministic default Review Scope using Task 9.4 policy;
* do not require Planner navigation first.

---

## 10. Review Workflow State

Use a derived presentation model materially equivalent to:

```ts id="bnpwfa"
ScheduleReviewStateV1 {
  reviewScope
  planningCoverage
  scheduledItems
  acceptedUnrealized
  proposals
  friction
  previewCoverage
  previewFreshness
  publicationState
  reviewBlockers
  reviewWarnings
  availableActions
}
```

This is not durable authority.

---

## 11. Review State Is Derived

Do not persist:

```text id="bc7zmk"
scheduleReviewed = true
```

unless an existing publication/review authority explicitly owns that concept.

Task 9.6 should determine readiness from current facts.

---

## 12. Review Attention Model

Introduce a deterministic derived attention classification.

At minimum distinguish:

```text id="7y6ly6"
blocking
warning
informational
none
```

Do not use visual severity alone.

---

## 13. Blocking Attention

A blocker means:

> this Review Scope should not be presented as ready for publication/final review without user action or missing authoritative data becoming available.

Candidates include:

* unresolved Friction;
* incomplete/unknown Planning Data coverage;
* accepted-but-unrealized authority;
* stale Preview where publication/review requires current Preview;
* Preview does not cover required scope;
* actionable Proposal awaiting explicit decision where policy requires resolution before review completion;
* failed realization conflict currently exposed.

Exact policy must be explicit.

---

## 14. Warnings

Warnings may include:

* publication/history coverage gap that does not block current review;
* stale Proposal not currently actionable;
* scope includes partially historical data;
* optional planning suggestions.

Warnings must not masquerade as blockers.

---

## 15. Informational State

Informational items may include:

* no Friction;
* Preview current;
* no Proposal;
* already published history;
* no accepted-unrealized authority.

---

## 16. Review Blocker Policy

Define one pure deterministic function materially equivalent to:

```text id="1o9lzz"
deriveScheduleReviewBlockers(...)
```

Do not scatter readiness conditions through UI components.

---

## 17. Publication Readiness

Define:

```text id="36m9p7"
publicationReady
```

as a derived state.

It must be based on explicit conditions.

Do not equate:

```text id="ybchof"
Preview exists
```

with publication readiness.

---

## 18. Minimum Publication Readiness Conditions

Expected V1 requirements:

1. planning coverage sufficient for the Publication Range;
2. authoritative schedule truth available;
3. required Review Scope/Publication Range relationship valid;
4. no unresolved blocking Friction;
5. no unresolved accepted-but-unrealized allocation intersecting the Publication Range;
6. Preview state satisfies current publication workflow requirements;
7. Proposal-decision policy satisfied;
8. Publication Range valid.

Adjust only where existing publication architecture proves otherwise.

---

## 19. Review Scope vs Publication Range

Preserve Task 9.4 distinction.

Review Schedule may offer:

```text id="8s2x5w"
Publish reviewed scope
```

only by explicitly constructing/validating a `PublicationRangeV1`.

Do not silently assume equal semantics.

---

## 20. Preview Dependency Decision

Audit existing publication implementation.

Determine whether publication requires:

### A. authoritative schedule truth directly;

or:

### B. a current generated Preview as its materialization source.

Task 9.4 established that Preview is not authority.

If publication currently materializes through Preview, preserve that implementation while making the dependency explicit.

Do not redesign publication unnecessarily.

---

## 21. Preview Status

Review Schedule must show:

* coverage;
* freshness;

separately.

Examples:

```text id="tl68i7"
Current and covers review scope
Stale but covers review scope
Current but does not cover full review scope
No Preview
```

---

## 22. Preview Refresh Action

Reuse the existing generation/regeneration path.

Review Schedule may expose:

```text id="806y1k"
Generate Preview
Refresh Preview
```

based on status.

Do not add another generation implementation.

---

## 23. Preview Refresh Semantics

After refresh:

* query canonical state again;
* update coverage/freshness;
* preserve Proposal/Accepted/Realization authority;
* do not manually patch screen state as truth.

---

## 24. Stale Preview

If Preview is stale because authoritative setup/schedule changed:

Review Schedule should explain:

> Setup or schedule changed; generate a new Preview to review current results.

Use existing product language where already established.

---

## 25. Preview Range Mismatch

If current Preview is not stale but does not cover Review Scope:

present range mismatch, not stale.

Action:

> Generate Preview for this review period

or equivalent.

---

## 26. Planning Coverage

Show complete/partial/none/unknown using Task 9.4 semantics.

Coverage must participate in readiness.

---

## 27. Unknown Coverage

If coverage is unknown:

* Review Schedule cannot claim the scope is conflict-free or empty;
* publication readiness should fail closed unless publication architecture proves independent complete coverage.

---

## 28. Partial Coverage

Known items may remain visible.

But Review Schedule must indicate:

> this review is incomplete.

---

## 29. Scheduled Reality Section

Provide a concise review of current authoritative schedule/protection facts intersecting scope.

This may reuse Task 9.5 presentation components.

Do not rebuild Month/day detail.

---

## 30. Review Density

Review Schedule should focus attention, not reproduce the entire Month interface.

Prefer:

* summary;
* attention items;
* expandable schedule detail;
* Preview visualization.

---

## 31. Preview Visualization

Retain DayVisualizer/Preview as the detailed visual schedule representation.

Do not replace it with a second bespoke timeline.

---

## 32. Goal Work

Goal work must remain identifiable as scheduled Goal-serving work.

Review Schedule may expose relevant Goal lineage in detail.

---

## 33. Support

Support remains operational support.

Do not imply Demand satisfaction.

---

## 34. Buffer

Buffer remains protected non-executable time.

It may contribute to review conflicts.

---

## 35. Accepted-Unrealized Section

If accepted authority intersects Review Scope without successful realization:

surface it prominently.

Expected user meaning:

> You accepted this allocation, but it is not yet installed in the schedule.

---

## 36. Realization Conflict

Where available during the active flow, show structured realization conflict.

Example meaning:

> Accepted, but current schedule truth prevents installation.

Do not reinterpret acceptance as failed.

---

## 37. Realization Retry

If current APIs safely support retrying realization:

Review Schedule may provide a contextual retry action.

It must call the existing idempotent realization command.

Do not create alternate realization behavior.

---

## 38. Retry Eligibility

Only offer retry when:

* allocation remains complete/current authority;
* no successful Realization exists;
* command semantics permit retry.

---

## 39. Proposal Review Section

Actionable Proposals intersecting scope should appear as decision-required items.

Review Schedule is the preferred V1 place to decide them.

---

## 40. Proposal Decision Actions

Reuse existing ProposalDecision commands.

Supported actions may include:

* accept;
* reject;
* ignore;
* supported modification path.

Do not invent new lifecycle states.

---

## 41. Acceptance Outcome

After accept:

* acceptance commits;
* automatic realization attempts;
* Review Schedule refreshes;
* show either:

  * realized scheduled facts;
  * accepted-unrealized conflict/failure state.

---

## 42. Reject Outcome

After reject:

* Proposal no longer appears as actionable;
* no schedule ownership is created.

---

## 43. Ignore Outcome

Preserve existing ignore semantics.

Do not treat ignore as rejection unless architecture already does.

---

## 44. Proposal Modification Boundary

If modification exists and is safely exposed:

reuse it.

Otherwise leave modification where currently supported.

Do not design a new Proposal editor here.

---

## 45. Proposal Horizon

Review Scope filters visibility only.

Do not alter Proposal Horizon.

---

## 46. Proposal Blocker Policy

Explicitly decide whether an actionable Proposal blocks publication readiness.

Preferred V1:

> Actionable constructive Proposal is a review attention item but does **not automatically block publication** unless the proposal represents required unresolved planning according to existing policy.

Reason:

Proposal is non-authoritative.

Do not make a suggestion equivalent to a conflict.

Document the decision.

---

## 47. Accepted Authority Blocker Policy

Accepted-but-unrealized authority should ordinarily block publication for an intersecting Publication Range because authoritative resource intent has not reached scheduled reality.

Document any exception.

---

## 48. Friction Section

Review Schedule should make Friction a first-class attention area.

Display:

* friction type;
* affected items;
* interval;
* consequence;
* suggested correction where available.

---

## 49. Friction Scope

Only Friction relevant to Review Scope should be primary.

Do not hide global issues permanently; contextual navigation may expose them elsewhere.

---

## 50. Friction vs Competition

Never label constructive competition/allocation tradeoffs as Friction.

---

## 51. SuggestedFix

Preserve:

```text id="wfef3u"
Friction
→ SuggestedFix
→ explicit corrective action
```

Do not convert SuggestedFix into Proposal.

---

## 52. SuggestedFix Presentation

Where a SuggestedFix exists:

* describe proposed correction in user language;
* identify affected schedule fact;
* expose supported action.

Do not apply automatically.

---

## 53. Move Fix

Preserve the existing wired Move path.

Review Schedule should continue to route Move through the established corrective command.

---

## 54. SuggestedFix Result

After applying a fix:

* re-run/requery authoritative schedule/Preview state according to current architecture;
* update Friction;
* do not manually delete friction UI items.

---

## 55. Unresolved Friction

Any unresolved blocking Friction inside Publication Range should prevent `publicationReady`.

---

## 56. Non-Blocking Attention

If Friction taxonomy contains advisory/nonblocking types, preserve their actual semantics.

Do not assume every friction point is fatal without evidence.

---

## 57. Add Commitment

Review Schedule may retain contextual:

> Add Commitment

for gaps/issues the user chooses to address manually.

Use the existing unified authored workflow.

---

## 58. Edit Commitment

Existing authored schedule facts may expose edit where already supported.

Do not edit immutable realized Goal/support/Buffer through Commitment editor.

---

## 59. Delete Commitment

If existing confirmed delete semantics are available:

preserve them for authored commitments only.

---

## 60. Pattern Library

Pattern Library remains contextual to Add Commitment.

Do not promote it to a primary Review destination.

---

## 61. Review Summary

Provide a concise top-level summary of review state.

Materially equivalent:

```text id="i893g0"
Planning data: Complete
Preview: Current and covers this scope
Schedule conflicts: 1
Accepted awaiting realization: 0
Proposals requiring decision: 2
Publication: Not ready
```

Use user-friendly language.

---

## 62. Publication Readiness Summary

When not ready, explain blockers explicitly.

Example:

```text id="4s6f69"
Not ready to publish:
• 1 unresolved schedule conflict
• Preview needs refresh
```

Do not show only a disabled button with no explanation.

---

## 63. Ready State

When all blockers are cleared:

show materially equivalent:

> This period is ready for publication.

Do not imply it has already been published.

---

## 64. Already Published State

If publication history exists:

distinguish:

```text id="zn3lyq"
Ready to publish current schedule
```

from:

```text id="8j5c8x"
A previous version of this period was published
```

---

## 65. Republish / New Publication Boundary

Do not invent replacement semantics.

If existing publication architecture permits publishing another immutable snapshot over the same range, present it as a new publication/history event.

Do not mutate prior history.

---

## 66. Publication Action

If current explicit publication action is product-reachable:

integrate it into Review Schedule when `publicationReady`.

If not currently product-reachable:

show readiness and document publication action as deferred.

Do not fabricate a partial publication implementation.

---

## 67. Publication Confirmation

If publication is destructive/meaningful enough to warrant confirmation under current UX patterns:

reuse existing confirmation conventions.

Do not add needless modal friction if current publication workflow is already explicit and safe.

---

## 68. Publication Result

After publication:

* refresh HistoricalPlan state;
* show successful historical evidence;
* current schedule remains current;
* prior publication remains immutable.

---

## 69. Review Completion Concept

Task 9.6 must not introduce a durable “review complete” flag merely for UI convenience.

Preferred V1:

```text id="q5q03h"
reviewReady = blockers.length === 0
```

and:

```text id="udz3dl"
publicationReady = explicitPublicationConditionsSatisfied
```

These are derived.

---

## 70. Distinguish Review Ready vs Publication Ready

These may be equal in V1 if policy supports it.

But define them separately.

Example:

* review-ready may permit unresolved optional Proposal;
* publication-ready may require complete publication coverage.

Do not conflate without documenting the policy.

---

## 71. Review Readiness Policy

Define one pure function:

```text id="6v5cc7"
deriveReviewReadiness(...)
```

Inputs must be explicit.

---

## 72. Publication Readiness Policy

Define separately:

```text id="jhlamk"
derivePublicationReadiness(...)
```

Do not bury the rules in button `disabled` expressions.

---

## 73. Readiness Reason Codes

Introduce structured reasons materially equivalent to:

```text id="j8qouw"
planningCoverageIncomplete
previewMissing
previewStale
previewRangeMismatch
frictionUnresolved
acceptedAllocationUnrealized
realizationConflict
publicationCoverageIncomplete
```

Proposal attention reason may be separate/nonblocking depending policy.

---

## 74. Reason Explainability

Every blocked state should map to deterministic user-facing explanation.

No LLM required.

---

## 75. Readiness Ordering

Display blockers in deterministic priority order.

Suggested:

1. coverage/data;
2. accepted-unrealized/realization;
3. Friction;
4. Preview;
5. publication-range issue;
6. other warnings.

Adjust based on UX evidence.

---

## 76. Selected Day vs Full Review Scope

Review Schedule may be launched from a selected day.

But the review workflow must clearly indicate whether it is reviewing:

* one day;
* week;
* month;
* custom Review Scope.

Do not silently review the full month when launched from one day.

---

## 77. Review Scope Controls

Reuse Task 9.5 navigation where practical.

Task 9.6 does not need to add all missing day/week/custom controls unless necessary.

---

## 78. Scope Change

Changing scope:

* re-runs canonical query;
* recomputes readiness;
* does not mutate authority;
* does not stale Preview merely due to navigation.

---

## 79. Scope Header

Show exact user-facing period.

Where useful, expose canonical end-exclusive geometry in diagnostics, not primary prose.

---

## 80. Current DayFrame Day

Preserve the existing user-day concept.

Do not relabel calendar “today” incorrectly for night-shift users.

---

## 81. Existing Month Entry

Planner Month should link contextually into Review Schedule.

Examples:

* selected-day attention;
* Review Schedule action;
* scope-level review CTA.

Do not create a new router architecture if current state/navigation can handle it.

---

## 82. Return to Planner

Provide a coherent return path preserving relevant Review Scope where possible.

Do not make users lose their selected month/day unnecessarily.

---

## 83. Shared Presentation Components

Reuse Task 9.5 components/adapters for:

* semantic labels;
* schedule fact classes;
* accepted-unrealized;
* Proposals;
* coverage;
* Preview status.

Do not duplicate language maps.

---

## 84. Review-Specific Components

Prefer bounded components such as:

```text id="qspnp1"
ReviewScheduleScreen
ReviewSummary
ReviewBlockerList
ProposalReviewSection
AcceptedRealizationSection
FrictionReviewSection
PreviewReviewSection
PublicationReadinessSection
```

Exact naming should follow repository conventions.

---

## 85. No Monolithic Component

Do not place all review logic in one giant screen function.

Keep readiness logic pure/testable.

---

## 86. Action Eligibility

Centralize action eligibility.

Do not render buttons by checking random field combinations inside components.

---

## 87. Proposal Action Eligibility

Actions require:

* actionable current Proposal;
* valid lifecycle;
* current dependency state;
* supported authority transition.

Reuse domain validation.

---

## 88. SuggestedFix Eligibility

Use existing SuggestedFix applicability.

Do not infer correction eligibility in UI.

---

## 89. Realization Retry Eligibility

Use realization command/domain state.

Do not enable retry based only on “no scheduled facts.”

---

## 90. Publication Eligibility

Use `derivePublicationReadiness`.

Do not enable publish based on visual absence of warnings.

---

## 91. Loading State

Review Schedule must distinguish loading from reviewed-empty.

---

## 92. Query Error

A failed canonical read must block readiness.

Do not assume safe/empty.

---

## 93. Mutation Error

Proposal decision, realization retry, SuggestedFix, Preview generation, or publication failure must:

* preserve existing authority;
* show bounded error;
* allow retry where safe.

---

## 94. Optimistic UI

Avoid optimistic authority mutation.

Prefer:

```text id="86e68d"
command
→ durable/authoritative result
→ canonical requery
```

---

## 95. Pending Action State

Buttons should prevent duplicate submission while command is active.

Especially:

* accept;
* realization retry;
* SuggestedFix;
* Preview refresh;
* publish.

---

## 96. Idempotence

Existing idempotent domain commands remain the safety boundary.

UI should not create duplicate commands intentionally.

---

## 97. Acceptance Idempotence

Repeated user activation must not create duplicate Accepted Allocations.

Preserve command semantics.

---

## 98. Realization Idempotence

Repeated retry after successful realization returns already-realized and refreshes cleanly.

---

## 99. Publication Idempotence / Multiplicity

Do not assume publication is idempotent if architecture permits multiple immutable snapshots.

Use existing semantics.

---

## 100. Friction Resolution Authority

Corrective changes remain governed by PlanDecision/SuggestedFix paths.

Review Schedule is an action surface, not the semantic owner.

---

## 101. Preview Authority

Preview remains disposable.

Review Schedule may require it operationally but cannot treat it as schedule authority.

---

## 102. Publication Authority

HistoricalPlan remains immutable historical authority.

Review Schedule does not own historical records.

---

## 103. Review Authority

There is no new durable review authority in V1.

---

## 104. User-Facing Language

Prefer:

```text id="u2du1a"
Review schedule
Needs attention
Ready to publish
Accepted — awaiting scheduling
Proposed
Protected time
Preview needs refresh
Planning data incomplete
```

Avoid engine terms in primary UI.

---

## 105. “Conflict” Language

Use conflict when there is actual authoritative incompatibility.

Do not label:

* competition;
* proposal choice;
* incomplete coverage

as conflict.

---

## 106. “Needs Attention”

Use as broad UX category covering multiple classes.

Retain exact structured reason underneath.

---

## 107. “Ready”

Ready means derived readiness conditions satisfied.

It does not mean published/executed/completed.

---

## 108. “Published”

Published means immutable historical snapshot exists.

Do not use as synonym for scheduled.

---

## 109. Review Schedule Visual Hierarchy

Preferred order:

1. scope/title;
2. review/readiness summary;
3. blockers/attention;
4. Preview visualization/status;
5. proposal decisions;
6. accepted-unrealized state;
7. Friction/corrections;
8. schedule details;
9. publication state/action.

Adjust only if existing UX strongly supports another order.

---

## 110. Avoid Action Overload

Do not place all available actions in every schedule item.

Use contextual sections.

---

## 111. Mobile Layout

Review workflow must remain usable on narrow screens.

Prefer stacked sections.

Avoid requiring side-by-side panels for core actions.

---

## 112. Keyboard Accessibility

All review actions must be keyboard reachable.

---

## 113. Focus After Mutation

After an action:

* preserve sensible focus;
* avoid returning focus to page top unnecessarily;
* announce result where appropriate.

---

## 114. Live Status

Use accessible status semantics for:

* Preview generation;
* Proposal decision result;
* realization retry result;
* SuggestedFix result;
* publication result.

---

## 115. Error Accessibility

Errors should use accessible alert semantics.

---

## 116. Disabled Actions

Disabled actions must have an understandable nearby reason.

Do not rely on tooltip only.

---

## 117. Color Boundary

Readiness/blocker/warning distinctions must have text/icon semantics beyond color.

---

## 118. Screen Reader Summary

The top review summary should communicate:

* period;
* blocker count;
* readiness;
* Preview state;

where practical.

---

## 119. Performance

Review Schedule should use one bounded planning query per Review Scope plus existing Preview visualization.

Do not independently derive Proposal/Capacity/etc. during render.

---

## 120. No N+1 Queries

Sections should consume shared review data.

Do not query one Proposal/Accepted Allocation at a time from components.

---

## 121. Requery Strategy

After mutation:

* requery once at the workflow boundary where practical;
* avoid cascading redundant full-range queries.

---

## 122. Bundle Discipline

Task 9.5 final baseline:

* initial raw: **668,262 bytes**
* initial gzip: **169,989 bytes**
* largest lazy: **53,194 bytes**
* total: **963,452 bytes**

Hard limits pass, but total architecture warning remains.

Requirements:

1. keep Review Schedule lazy;
2. reuse existing components;
3. no heavy new dependency;
4. readiness logic in small pure modules;
5. avoid importing Phase 8/9 engines eagerly into initial shell;
6. record before/after metrics.

---

## 123. Bundle Stop Condition

If hard limits fail:

* identify import cause;
* refactor;
* do not raise limits automatically.

---

## 124. Schema Decision

Expected:

```text id="dxfjwp"
IndexedDB schema 11
```

No new durable authority should be required.

Any proposed bump is a stop/review condition.

---

## 125. Backup Decision

Expected:

```text id="uq86ux"
Backup V12
```

Review state/readiness must remain derived.

---

## 126. Persistence Boundary

Do not add to Backup/profile/store authority:

* readiness;
* blocker list;
* selected review tab;
* expanded section;
* reviewed flag;
* publication-ready flag.

---

## 127. Full Clear

Existing full-clear behavior remains sufficient.

No new durable review data exists.

---

## 128. Profile Boundary

Profiles remain authored setup snapshots.

Review state remains excluded.

---

## 129. Existing Preview Regression

Preserve all Preview generation/stale behavior.

---

## 130. Existing Planner/Month Regression

Task 9.5 behavior remains intact.

---

## 131. Existing Friction Regression

Keep:

* detection;
* SuggestedFix;
* Move;
* correction/recompute;

green.

---

## 132. Proposal Regression

Keep Proposal lifecycle and decision semantics green.

---

## 133. Acceptance Regression

Keep acceptance immutable and separate from realization.

---

## 134. Realization Regression

Keep:

* atomicity;
* idempotence;
* accepted liability;
* conflict behavior;
* Goal/support/Buffer mapping.

---

## 135. Publication Regression

Keep:

* HistoricalPlan V1/V2/V3;
* explicit Publication Range;
* immutable snapshots;
* accepted lineage.

---

## 136. Canonical User-Day Regression

Preserve:

* day boundary;
* overnight;
* week start;
* cycle/segment preference;
* DF-006.

---

## 137. Required Focused Tests — Readiness

Test at minimum:

1. fully ready scope;
2. incomplete planning coverage;
3. unknown planning coverage;
4. unresolved Friction;
5. accepted-unrealized;
6. stale Preview;
7. Preview range mismatch;
8. no Preview;
9. actionable Proposal under chosen blocker policy;
10. historical publication exists;
11. publication coverage incomplete;
12. deterministic reason ordering.

---

## 138. Required Focused Tests — Review Summary

Prove:

* blocker counts;
* warning counts;
* status text;
* ready/not-ready;
* no false empty;
* accessible semantics.

---

## 139. Required Focused Tests — Proposal Actions

Prove:

1. accept;
2. reject;
3. ignore if supported;
4. stale/inapplicable cannot act;
5. accept refreshes state;
6. realization success appears scheduled;
7. realization conflict appears accepted-unrealized.

---

## 140. Required Focused Tests — Realization Retry

If exposed:

1. retry conflict;
2. conflict resolved then success;
3. already realized;
4. no duplicate facts;
5. command error preserves acceptance.

---

## 141. Required Focused Tests — Friction

Prove:

1. Friction appears as blocker where policy says;
2. SuggestedFix visible;
3. Move fix works;
4. fix refreshes Friction;
5. Competition never appears as Friction;
6. no auto-apply.

---

## 142. Required Focused Tests — Preview

Prove:

1. stale state;
2. missing coverage;
3. refresh action;
4. refreshed Preview;
5. scope navigation alone does not stale;
6. no authority mutation.

---

## 143. Required Focused Tests — Publication Readiness

Prove:

1. ready range;
2. invalid Publication Range;
3. incomplete coverage;
4. unresolved accepted authority;
5. Friction;
6. stale/missing Preview according to chosen dependency policy;
7. successful publication;
8. history appears after publication;
9. prior history remains immutable.

---

## 144. Required Focused Tests — Navigation

Prove Planner→Review and Review→Planner preserve intended Review Scope where current navigation architecture permits.

---

## 145. Required Focused Tests — Accessibility

Test:

* summary status;
* blocker list;
* proposal controls;
* Preview refresh;
* SuggestedFix action;
* publication control if exposed;
* disabled-action explanation;
* keyboard interaction;
* error/status announcements.

---

## 146. Required Focused Tests — No Durable Review State

Prove:

* schema 11;
* Backup V12;
* profile behavior;
* restore;
* no review/readiness fields serialized.

---

## 147. Full Regression

Task 9.5 baseline:

```text id="9h3qnv"
122 test files
1,074 tests
0 failures
```

Record final counts.

---

## 148. Required Validation Commands

Run repository-supported equivalents:

```bash id="ot4ikq"
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
git diff --check
```

Also run focused:

* Review Schedule;
* readiness;
* Planner/Month;
* Preview;
* Proposal/decision;
* acceptance/realization;
* Friction/SuggestedFix;
* publication;
* scope;
* accessibility.

---

## 149. Required V1 Design Decision Table

Include:

| Question                           | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ---------------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| Review Schedule product role       |             |                     |                    |                     |
| canonical read source              |             |                     |                    |                     |
| Review Scope source                |             |                     |                    |                     |
| readiness model                    |             |                     |                    |                     |
| blocker taxonomy                   |             |                     |                    |                     |
| warning taxonomy                   |             |                     |                    |                     |
| Proposal blocker policy            |             |                     |                    |                     |
| accepted-unrealized blocker policy |             |                     |                    |                     |
| Friction blocker policy            |             |                     |                    |                     |
| Preview dependency                 |             |                     |                    |                     |
| Preview blocker policy             |             |                     |                    |                     |
| publication readiness              |             |                     |                    |                     |
| publication action exposure        |             |                     |                    |                     |
| realization retry exposure         |             |                     |                    |                     |
| Proposal decision exposure         |             |                     |                    |                     |
| Friction correction exposure       |             |                     |                    |                     |
| review-ready vs publication-ready  |             |                     |                    |                     |
| Planner navigation                 |             |                     |                    |                     |
| persistence                        |             |                     |                    |                     |
| schema                             |             |                     |                    |                     |
| backup                             |             |                     |                    |                     |

---

## 150. Required Review State Matrix

Include:

| Condition                     | Attention Class | Blocks Review? | Blocks Publication? | Available Action       |
| ----------------------------- | --------------- | -------------: | ------------------: | ---------------------- |
| Planning coverage complete    | informational   |             No |                  No | None                   |
| Planning coverage partial     | blocking        |            Yes |                 Yes | Resolve coverage/input |
| Planning coverage unknown     | blocking        |            Yes |                 Yes | Resolve coverage/input |
| Preview stale                 |                 |                |                     | Refresh                |
| Preview range mismatch        |                 |                |                     | Generate for scope     |
| No Preview                    |                 |                |                     | Generate               |
| Friction unresolved           |                 |                |                     | Resolve                |
| Proposal actionable           |                 |                |                     | Decide                 |
| Accepted unrealized           |                 |                |                     | Retry/inspect          |
| Realization conflict          |                 |                |                     | Resolve schedule/retry |
| Historical publication exists | informational   |             No |                  No | Inspect                |
| Publication Range invalid     | blocking        |          Maybe |                 Yes | Adjust range           |

Populate exact V1 rules.

---

## 151. Required Authority/Action Matrix

Include:

| Item                | Review |              Decide |                                Correct |           Retry |            Publish | Mutates Authority Through |
| ------------------- | -----: | ------------------: | -------------------------------------: | --------------: | -----------------: | ------------------------- |
| Work                |    Yes |                  No |                             contextual |              No |          via range | existing Work path        |
| Authored Commitment |    Yes |                  No |                                   edit |              No |          via range | unified authored flow     |
| Goal Work           |    Yes |                  No | SuggestedFix/PlanDecision if supported |              No |          via range | corrective architecture   |
| Support             |    Yes |                  No |                             contextual |              No |          via range | corrective architecture   |
| Buffer              |    Yes |                  No |                             contextual |              No |          via range | corrective architecture   |
| Proposal            |    Yes |                 Yes |                                     No |              No |                 No | ProposalDecision          |
| Accepted unrealized |    Yes |     already decided |                             contextual | Yes if eligible |                 No | Realization               |
| Friction            |    Yes | corrective decision |                                    Yes |              No |                 No | SuggestedFix/PlanDecision |
| Preview             |    Yes |                  No |                        regenerate only |              No |       No authority | Preview generator         |
| HistoricalPlan      |    Yes |                  No |                                     No |              No | already historical | publication               |

---

## 152. Required Readiness Reason Matrix

Include:

| Reason Code                   | User Meaning | Review Blocking | Publication Blocking |
| ----------------------------- | ------------ | --------------: | -------------------: |
| planningCoverageIncomplete    |              |                 |                      |
| planningCoverageUnknown       |              |                 |                      |
| previewMissing                |              |                 |                      |
| previewStale                  |              |                 |                      |
| previewRangeMismatch          |              |                 |                      |
| frictionUnresolved            |              |                 |                      |
| acceptedAllocationUnrealized  |              |                 |                      |
| realizationConflict           |              |                 |                      |
| publicationCoverageIncomplete |              |                 |                      |
| proposalDecisionPending       |              |                 |                      |

---

## 153. Required Surface Convergence Matrix

Include:

| Surface                | Responsibility After 9.6                | Read Source                         | Main Actions                    |
| ---------------------- | --------------------------------------- | ----------------------------------- | ------------------------------- |
| Planner/Month          | broad inspection/navigation             | canonical planning review           | select scope/day                |
| Review Schedule        | bounded review/action workflow          | canonical planning review + Preview | decisions/corrections/readiness |
| Preview/DayVisualizer  | detailed derived schedule visualization | Preview                             | generate/view                   |
| Today                  | operational current day                 | existing Today model                | operational                     |
| Setup                  | authored planning setup                 | authored store                      | edit/save                       |
| Historical publication | immutable history                       | HistoricalPlan                      | inspect                         |

---

## 154. Required Invariants

Explicitly verify:

1. Review Schedule consumes Task 9.4/9.5 canonical read semantics.
2. no second planning query is created.
3. no second Review Scope model is created.
4. Review Schedule remains non-authoritative.
5. readiness is derived.
6. publication readiness is derived.
7. no durable reviewed flag is introduced.
8. no durable publication-ready flag is introduced.
9. planning coverage participates in readiness.
10. unknown coverage fails closed.
11. partial coverage fails closed where required.
12. complete+empty remains distinguishable.
13. Preview coverage is separate from freshness.
14. navigation mismatch does not imply stale.
15. authoritative mutation still stales Preview.
16. Preview refresh uses existing engine.
17. Preview remains non-authoritative.
18. scheduled reality remains authoritative.
19. Proposal remains non-authoritative.
20. accepted-unrealized remains accepted authority, not scheduled.
21. realization conflict does not invalidate acceptance.
22. retry uses existing Realization command.
23. retry remains idempotent.
24. successful realization removes unresolved accepted presentation.
25. no accepted/realized double representation.
26. Proposal decisions use existing ProposalDecision path.
27. accept does not bypass ProposalDecision.
28. rejection schedules nothing.
29. ignore preserves existing semantics.
30. Proposal Horizon remains unchanged.
31. Review Scope only filters Proposal visibility.
32. actionable Proposal blocker policy is explicit.
33. Proposal is not treated as Friction.
34. Competition is not treated as Friction.
35. Friction uses existing detection.
36. SuggestedFix uses existing correction path.
37. SuggestedFix is not Proposal.
38. Move fix remains wired through existing path.
39. no SuggestedFix auto-apply.
40. unresolved blocking Friction prevents readiness according to policy.
41. Buffer remains non-executable.
42. support remains distinct from productive work.
43. direct Commitment remains authored.
44. realized Goal work is not editable as generic Commitment.
45. Add Commitment uses unified authored flow.
46. Pattern Library remains contextual.
47. publication uses explicit Publication Range.
48. Review Scope is not automatically Publication Range.
49. Preview is not publication authority.
50. HistoricalPlan remains immutable.
51. prior publication does not become current schedule.
52. republishing does not mutate old history.
53. current schedule remains current after publication.
54. review-ready and publication-ready are explicitly defined.
55. blocker derivation is pure/deterministic.
56. readiness reason ordering is deterministic.
57. every blocker has user-facing explanation.
58. disabled actions have reasons.
59. query errors cannot render ready.
60. mutation errors preserve existing authority.
61. UI does not optimistically fabricate authority.
62. commands trigger canonical requery.
63. action pending state prevents duplicate clicks.
64. one bounded query feeds review sections.
65. no N+1 Proposal/Accepted reads.
66. Planner→Review scope is preserved where possible.
67. Review→Planner navigation remains coherent.
68. current DayFrame day semantics remain canonical.
69. overnight behavior remains correct.
70. week start remains correct.
71. DF-006 remains closed.
72. no new recurrence is introduced.
73. no execution is created.
74. no Progress is inferred.
75. no Live adaptation is introduced.
76. no learning is introduced.
77. schema remains 11 unless stop condition reached.
78. Backup remains V12 unless stop condition reached.
79. no Review state enters Backup.
80. no Review state enters profiles.
81. no new authority store is created.
82. Review Schedule stays lazy.
83. hard bundle limits pass.
84. keyboard action access remains.
85. readiness does not rely on color.
86. error/status messages are accessible.
87. Planner/Month behavior remains intact.
88. Preview behavior remains intact.
89. Proposal/acceptance behavior remains intact.
90. Realization behavior remains intact.
91. Friction behavior remains intact.
92. publication behavior remains intact.
93. Task 9.6 does not reopen scope architecture.
94. Task 9.6 does not reopen realization architecture.
95. Task 9.6 does not create a second Planner.
96. Review Schedule becomes the canonical review/action workflow.
97. review blockers are semantically grounded.
98. publication readiness is semantically grounded.
99. users can understand why a period is or is not ready.
100. the next Phase 9 task can build publication/review polish without redefining review semantics.

---

## 155. Stop / Architecture-Reopen Conditions

Stop and report if:

* Review Schedule cannot consume `queryPlanningReview` without losing required state;
* current Friction workflow depends on Preview as hidden authority;
* Proposal decisions cannot be reused without a duplicate path;
* realization retry cannot be exposed safely/idempotently;
* publication readiness cannot be determined from existing authoritative/derived state;
* publication requires an unidentified hidden range model;
* Review Scope cannot be preserved across Planner navigation;
* existing Review Schedule directly mutates authority in ways inconsistent with current architecture;
* readiness requires a durable “reviewed” state to function;
* a schema/Backup bump appears necessary purely for UI workflow;
* current publication architecture cannot distinguish current vs historical schedule truth;
* bundle hard limits fail due to unavoidable eager review imports.

Do not resolve these by weakening epistemic boundaries.

---

## 156. Governance

Update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` for durable decisions such as:

* Review Schedule product role;
* readiness model;
* publication-readiness policy;
* Proposal blocker policy;
* Preview dependency policy;
* realization-retry exposure;
* canonical review action surface.

Do not record incidental component styling.

---

## 157. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve cumulative Phase 9 changes;
3. preserve unrelated work;
4. do not clean;
5. do not reset;
6. do not discard prior task changes;
7. do not commit;
8. do not push unless explicitly instructed.

Report repository state.

---

## 158. Required RESULT Artifact

Create:

```text id="rz2s7p"
TASK_9.6_REVIEW_SCHEDULE_EVOLUTION_V1_RESULT.md
```

Filename must contain **`RESULT`**.

Place it in the dedicated Phase 9 implementation-results folder.

---

## 159. Required RESULT Sections

The RESULT must include at minimum:

1. Executive Result
2. Starting Baseline
3. Governing Foundations
4. Existing Review Schedule Audit
5. Scope Delivered
6. Explicit Non-Goals
7. Review Schedule Product Role
8. Planner/Review Boundary
9. Canonical Read Source
10. Review Scope Source
11. Direct Entry Behavior
12. Review Workflow State
13. Review State Authority Boundary
14. Attention Model
15. Blocking Attention
16. Warning Model
17. Informational Model
18. Review Blocker Policy
19. Review Readiness
20. Publication Readiness
21. Minimum Publication Conditions
22. Review/Publication Range Relationship
23. Preview Dependency Decision
24. Preview Coverage
25. Preview Freshness
26. Preview Refresh
27. Preview Range Mismatch
28. Planning Coverage
29. Unknown Coverage
30. Partial Coverage
31. Scheduled Reality Review
32. Preview Visualization
33. Goal Work
34. Support
35. Buffer
36. Accepted-Unrealized Review
37. Realization Conflict
38. Realization Retry Decision
39. Retry Eligibility
40. Proposal Review
41. Proposal Decision Actions
42. Acceptance Outcome
43. Reject Outcome
44. Ignore Outcome
45. Modification Boundary
46. Proposal Horizon
47. Proposal Blocker Policy
48. Accepted Authority Blocker Policy
49. Friction Review
50. Friction Scope
51. Competition Boundary
52. SuggestedFix
53. SuggestedFix Presentation
54. Move Fix
55. SuggestedFix Result
56. Friction Blocker Policy
57. Add Commitment
58. Edit Commitment
59. Delete Commitment
60. Pattern Library
61. Review Summary
62. Publication Readiness Summary
63. Ready State
64. Already Published State
65. Republish Boundary
66. Publication Action
67. Publication Confirmation
68. Publication Result
69. Review Completion Concept
70. Review-vs-Publication Ready
71. Review Readiness Policy
72. Publication Readiness Policy
73. Readiness Reason Codes
74. Reason Explainability
75. Reason Ordering
76. Selected Day vs Scope
77. Review Scope Controls
78. Scope Change
79. Scope Header
80. Current DayFrame Day
81. Planner Entry
82. Return to Planner
83. Shared Components
84. Review-Specific Components
85. Component Architecture
86. Action Eligibility
87. Proposal Eligibility
88. SuggestedFix Eligibility
89. Retry Eligibility
90. Publication Eligibility
91. Loading
92. Query Error
93. Mutation Error
94. Optimistic UI Boundary
95. Pending Action State
96. Idempotence
97. Acceptance Idempotence
98. Realization Idempotence
99. Publication Multiplicity
100. Corrective Authority
101. Preview Authority
102. Publication Authority
103. Review Authority
104. User-Facing Language
105. Conflict Language
106. Attention Language
107. Ready Language
108. Published Language
109. Visual Hierarchy
110. Action Density
111. Mobile Layout
112. Keyboard Accessibility
113. Focus After Mutation
114. Live Status
115. Error Accessibility
116. Disabled Actions
117. Color Boundary
118. Screen Reader Summary
119. Performance
120. Query Performance
121. Requery Strategy
122. Bundle Review
123. Schema Decision
124. Backup Decision
125. Persistence Boundary
126. Full Clear
127. Profile Boundary
128. Preview Regression
129. Planner/Month Regression
130. Friction Regression
131. Proposal Regression
132. Acceptance Regression
133. Realization Regression
134. Publication Regression
135. Canonical User-Day Regression
136. Readiness Tests
137. Summary Tests
138. Proposal Action Tests
139. Realization Retry Tests
140. Friction Tests
141. Preview Tests
142. Publication Readiness Tests
143. Navigation Tests
144. Accessibility Tests
145. Persistence Tests
146. Full Regression
147. Validation Commands
148. V1 Design Decision Table
149. Review State Matrix
150. Authority/Action Matrix
151. Readiness Reason Matrix
152. Surface Convergence Matrix
153. Invariant Verification
154. Deviations
155. Governance Updates
156. Repository Status
157. Dogfood Review Assessment
158. Phase 9 Critical-Path Assessment
159. Recommended Next Task
160. Completion Statement

---

## 160. Dogfood Review Assessment

The RESULT must answer:

> **Can a user now navigate from Planner into a bounded Review Schedule workflow, understand the current schedule and planning state, identify what requires attention, make supported Proposal decisions, inspect or retry accepted-but-unrealized allocations, resolve existing Friction through established corrective paths, refresh Preview, and understand exactly why the period is or is not ready for publication?**

Expected:

> **Yes.**

---

## 161. Phase 9 Critical-Path Assessment

The RESULT must explicitly assess whether the following ordinary user loop is now product-reachable:

```text id="zybfii"
author Goal / Demand / Priority
→ derive planning truth
→ receive Proposal
→ accept / reject
→ realize accepted work
→ inspect Planner
→ Review Schedule
→ resolve attention
→ publish
```

Identify any remaining blocker precisely.

---

## 162. Expected Next Task

If Task 9.6 completes cleanly, inspect the roadmap and actual publication/product state before deciding the next task.

Likely next area:

> **Publication / History Workflow Evolution**

or a narrowly scoped Phase 9 Dogfood Pass checkpoint if publication is already sufficiently product-reachable.

Do not assume another architecture task is required.

---

## 163. Final Completion Statement

The RESULT must end with a completion statement materially equivalent to:

> **Task 9.6 — Review Schedule Evolution V1 complete.**
>
> DayFrame now has one canonical bounded schedule-review workflow layered over the Planner/Month, temporal-scope, constructive-planning, accepted-authority, Realization, Preview, Friction, and publication foundations already established in Phase 8 and Tasks 9.1–9.5: Review Schedule consumes the same `ReviewScopeV1`, `queryPlanningReview`, and semantic presentation model as Planner rather than reconstructing schedule truth or inventing another range system; it derives explicit review and publication readiness from planning-data coverage, current authoritative scheduled/protective facts, accepted-but-unrealized authority, realization conflicts, actionable Proposal state according to documented policy, Preview coverage/freshness, unresolved Friction, and Publication Range validity; users can see why a period needs attention, distinguish warnings from blockers, refresh Preview using the existing generation path, decide constructive Proposals through the existing ProposalDecision authority path, inspect or safely retry unrealized Accepted Allocations through the idempotent Realization command where supported, resolve Friction using existing SuggestedFix/PlanDecision behavior including the wired Move path, and understand when the current period is ready for publication without Proposal, Preview, accepted authority, historical publication, or review state masquerading as schedule authority; readiness remains a pure derived property rather than a durable reviewed flag, Review Scope remains non-authoritative navigation state, publication uses explicit `PublicationRangeV1` semantics and immutable HistoricalPlan truth, prior publications remain unchanged, current schedule remains current after publication, and all mutations return through authoritative commands followed by canonical re-query rather than optimistic UI-owned truth; Work, authored Commitments, realized Goal work, support activity, Buffer protection, Proposal, accepted-unrealized authority, Friction, Preview state, and history remain epistemically distinct; no recurrence, execution, Progress, Live adaptation, learning, new authority store, schema change, Backup change, or parallel review model is introduced; Planner/Month, Preview/DayVisualizer, Today, unified authoring, Friction, Proposal/acceptance/Realization, publication, canonical user-day, schema 11, Backup V12, DF-006, accessibility, bundle governance, and full regression behavior remain intact; the ordinary Phase 9 user path can now proceed from planning and acceptance through durable realization, Planner inspection, bounded schedule review, corrective action, and publication readiness using one coherent semantic architecture.
