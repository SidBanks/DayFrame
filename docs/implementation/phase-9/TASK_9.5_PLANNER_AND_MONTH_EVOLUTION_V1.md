# Task 9.5 — Planner and Month Evolution V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Subphase:** Planner Surface Convergence
**Task Type:** Implementation / Planner Read Surface / Month Evolution / Epistemic Presentation / Scope Navigation / Schedule Inspection / Regression
**Primary Responsibility:** Evolve DayFrame’s existing planning/month-facing surfaces into the first canonical Planner experience by consuming the Task 9.4 `ReviewScopeV1` and `queryPlanningReview` contract, presenting authoritative scheduled reality, accepted-but-unrealized authority, constructive Proposals, planning coverage, Preview coverage/freshness, and relevant publication state without inventing a second planning model, flattening epistemically distinct facts into generic events, or introducing new scheduling authority.

---

## 1. Objective

Implement the first coherent user-facing Planner surface over the completed Phase 8/9 planning architecture.

The governing ordinary semantic chain is now:

```text
Goal
→ Demand
→ Projection
→ Feasibility
→ Competition
→ Allocation
→ Proposal
→ ProposalDecision
→ Accepted Allocation
→ Realization
→ Scheduled Goal Work / Support / Buffer
```

Task 9.4 established the temporal/read-model contract:

```text
Review Scope
→ Planning Data Horizon
→ planning coverage
→ scheduled reality
→ accepted liabilities
→ constructive Proposal state
→ Preview coverage/freshness
→ publication state
```

Task 9.5 must make that architecture inspectable through the product.

At completion, a user should be able to enter Planner, navigate an intentional Review Scope, and understand:

> **What is scheduled? What is protected? What has been accepted but is not yet realized? What is being proposed? Is DayFrame working from complete planning data? Does the current Preview cover what I am reviewing? Is that Preview current? What historical publication exists for this period?**

without those classes becoming indistinguishable generic calendar events.

---

## 2. Governing Completed Foundations

Treat the following as settled.

### Phase 8

* revision/provenance/freshness;
* Goal Structure;
* Goal Demand/Priority/Projection;
* Commitment Composition;
* Capacity;
* Goal-specific Feasibility.

### Task 9.1

* Competition;
* Allocation;
* provisional planning alternatives.

### Task 9.2

* Proposal;
* ProposalDecision;
* Accepted Allocation.

### Tasks 9.2.0–9.2.2

* complete productive/support/Buffer footprint;
* accepted footprint fidelity;
* scheduled/execution/publication identities.

### Task 9.3

* `RealizationV1`;
* durable `realizationAuthority`;
* `ScheduledGoalWorkV1`;
* `ScheduledSupportActivityV1`;
* `RealizedBufferProtectionV1`;
* accepted-unrealized Capacity liability;
* atomic realization;
* explicit publication integration.

### Task 9.4

* `CanonicalUserDayRangeV1`;
* Planning Data Horizon;
* Proposal Horizon;
* `ReviewScopeV1`;
* Preview Range;
* Publication Range;
* coverage semantics;
* `queryPlanningReview`;
* authoritative vs visible interval geometry;
* unknown vs empty;
* scope provenance.

Do not recreate these concepts in UI state.

---

## 3. Product Direction

The governing DayFrame UX model remains:

### Planner

* Review Schedule
* Add Commitment
* Edit Commitment
* Resolve Friction
* contextual Pattern Library

### Summary

* Capacity
* Goals
* Allocations
* Progress
* Recommendations

Task 9.5 focuses on **Planner**.

Do not turn Planner into Summary.

---

## 4. V1 Planner Responsibility

Planner V1 is primarily:

> **the place where the user inspects and navigates current planning/schedule truth and sees the relationship between scheduled reality, accepted authority, proposals, coverage, and history.**

It is not yet required to become the final all-purpose schedule editor.

---

## 5. Explicit Non-Goals

Do not:

* redesign Goal authoring;
* redesign Demand;
* redesign Priority;
* redesign Feasibility;
* redesign Allocation;
* redesign Proposal semantics;
* redesign acceptance;
* redesign Realization;
* redesign publication;
* redesign execution;
* redesign Progress;
* implement Live adaptation;
* implement learning;
* add recurrence;
* create another schedule engine;
* create another date-range architecture;
* create another planning read model;
* implement a drag-and-drop calendar unless already safely supported;
* implement arbitrary movement of realized Goal work;
* make Buffer executable;
* turn Preview into authority;
* make Month a second scheduling engine;
* move Summary concerns wholesale into Planner.

---

## 6. Existing Surface Audit

Before implementation, inspect all existing user-facing schedule/planning surfaces.

At minimum identify:

* current Month surface;
* Preview screen;
* Day visualizer;
* Today surface;
* Review Schedule surface if present;
* setup/calendar controls;
* day-detail workflow;
* Proposal/decision exposure;
* Friction controls;
* publication controls/status;
* any existing Planner-named route/component.

Document:

1. semantic owner;
2. data source;
3. range source;
4. authority assumptions;
5. overlap with future Planner;
6. whether it should be retained, adapted, composed, or eventually retired.

Do not begin by creating a parallel UI without auditing existing surfaces.

---

## 7. No Duplicate Planner Architecture

Task 9.5 should converge existing surfaces.

Avoid:

```text
Old Preview
+
Old Month
+
New Planner
+
New Planner Calendar
```

all independently reconstructing schedule truth.

Preferred direction:

```text
canonical planning read query
        ↓
shared Planner read-model adapter
        ↓
Planner / Month / day-detail presentation
```

---

## 8. Canonical Read Source

Planner must consume:

```text
queryPlanningReview(...)
```

or a thin presentation adapter over it.

Do not independently query:

* Proposal store;
* realization store;
* Preview;
* HistoricalPlan;
* accepted authority;

and reconstruct semantics inside components if `queryPlanningReview` already owns the combination.

---

## 9. Read Model Is Not Authority

Planner presentation state must not become a durable planning owner.

The read model may combine:

* scheduled truth;
* accepted authority;
* proposed action;
* derived Preview state;
* historical evidence.

It owns none of them.

---

## 10. Epistemic Classes

Planner must preserve visibly distinguishable classes.

At minimum:

```text
scheduledReality
acceptedAuthority
proposedAction
derivedPreview
historicalEvidence
coverageState
```

Do not flatten these into:

```text
event[]
```

without retaining the original class.

---

## 11. Scheduled Reality

Planner must present authoritative scheduled/protective facts including applicable:

* Work;
* authored/manual fixed schedule facts;
* scheduled Commitments;
* attached activities;
* `ScheduledGoalWorkV1`;
* `ScheduledSupportActivityV1`;
* `RealizedBufferProtectionV1`.

These represent actual current schedule ownership/protection.

---

## 12. Productive Goal Work Presentation

Scheduled Goal work must be identifiable as:

> Goal-serving scheduled work.

Retain access to:

* Goal identity/title where available;
* Demand lineage where useful;
* scheduled interval;
* canonical user-day;
* accepted-allocation provenance;
* execution eligibility.

Do not present it as a generic manual event.

---

## 13. Support Activity Presentation

Support activity must remain visibly distinguishable from productive Goal work.

The user should be able to understand:

> this scheduled activity exists because the productive session requires operational support.

Do not imply that support itself satisfies Goal Demand.

---

## 14. Buffer Presentation

Buffer must appear as protected time, not an ordinary activity.

It should communicate:

> DayFrame is protecting this interval around planned activity.

Do not present Buffer with action language implying execution/completion.

---

## 15. Work Presentation

Work remains external/committed schedule reality.

Do not reinterpret Work as:

* Goal work;
* accepted allocation;
* flexible commitment;
* Proposal.

---

## 16. Direct Authored Commitment Presentation

Direct authored commitments remain distinct from generated Goal work.

Do not manufacture Proposal/Accepted Allocation lineage for direct authoring.

---

## 17. Accepted-but-Unrealized Authority

Planner must surface complete Accepted Allocations that intersect Review Scope but have not successfully realized.

This is semantically important.

The user should be able to distinguish:

```text
Accepted
but not yet scheduled
```

from:

```text
Scheduled
```

---

## 18. Accepted Liability Presentation

Accepted-but-unrealized authority should not masquerade as a normal scheduled block.

Present it as a planning/authority state such as:

> Accepted — awaiting schedule realization

or equivalent.

If realization failed due to a current conflict and that state is available to the caller, surface the structured conflict meaning.

Do not invent persistent failure history.

---

## 19. Realized vs Accepted

Once realization exists:

* do not continue showing the same Accepted Allocation as an independent unresolved liability;
* preserve accepted provenance in details;
* present the realized scheduled facts as current schedule truth.

Avoid double representation that makes one accepted decision look like two separate commitments.

---

## 20. Proposal Presentation

Current constructive Proposals intersecting Review Scope should be inspectable as **proposed**, not scheduled.

A Proposal must not visually imply that time is already owned.

---

## 21. Proposal Decision Boundary

Where existing decision controls are safely reusable, Planner may expose:

* accept;
* reject;
* ignore;
* existing supported modification path.

Do not invent new decision semantics.

---

## 22. Proposal Scope

Proposal presentation must retain Proposal Horizon semantics.

Review Scope filters what is shown.

It does not redefine Proposal authority.

---

## 23. Proposal Outside Review Scope

A Proposal outside the current Review Scope remains current if otherwise valid.

Do not reject/stale/delete it merely because the user navigates away.

---

## 24. No-Proposal State

Where constructive planning has no Proposal, preserve typed meaning.

Differentiate where supported:

* no eligible Demand;
* no feasible opportunity;
* no useful Proposal;
* incomplete planning input;
* insufficient coverage;
* relevant work already satisfied/covered.

Do not show every state as:

> Nothing to suggest.

---

## 25. Planning Coverage

Planner must expose Task 9.4 coverage semantics:

```text
complete
partial
none
unknown
```

At minimum, incomplete/unknown coverage must be visible enough that an empty Planner is not mistaken for a free schedule.

---

## 26. Unknown Is Not Empty

Mandatory UX invariant:

```text
complete coverage + no facts
```

may communicate:

> No scheduled/planning items in this scope.

But:

```text
partial / none / unknown coverage
```

must not communicate that.

---

## 27. Preview Coverage

Planner must distinguish:

```text
covers
partiallyCovers
doesNotCover
```

for the current Review Scope.

---

## 28. Preview Freshness

Preview freshness remains independent.

Planner must be able to distinguish:

```text
Preview covers this scope but is stale
```

from:

```text
Preview is current but does not cover this scope
```

and:

```text
Preview is current and covers this scope
```

---

## 29. Preview Regeneration

If the existing Preview generation action can safely be invoked from Planner, provide a bounded path such as:

> Generate Preview

or:

> Refresh Preview

when appropriate.

Reuse existing generation semantics.

Do not build a second generator.

---

## 30. Preview Authority Boundary

Do not label Preview content as authoritative merely because Planner displays it.

Where authoritative scheduled truth and Preview presentation coexist, preserve their distinction.

---

## 31. Review Scope Navigation

Planner must use `ReviewScopeV1`.

V1 should support the kinds established by Task 9.4:

* day;
* week;
* month;
* custom where current controls make this practical.

---

## 32. Default Review Scope

Use the Task 9.4 default policy:

> current configured Preview range → custom product-default Review Scope

unless current implementation provides a more direct normalized source already established by 9.4.

Do not add a persistent preference.

---

## 33. Day Navigation

Provide or adapt a way to inspect one canonical user-day.

The displayed date label may be calendar-friendly.

Schedule geometry remains canonical-user-day based.

---

## 34. Week Navigation

Week navigation must respect effective configured week start.

Do not assume Monday.

---

## 35. Month Navigation

Month becomes a navigation/review surface over canonical user-day schedule truth.

Calendar month labels may remain conventional.

Do not change schedule semantics to calendar-midnight intervals.

---

## 36. Custom Scope

If existing UI already supports arbitrary Preview ranges cleanly, adapt it into custom Review Scope.

Otherwise a full custom-range picker may be deferred.

Do not expand UI scope unnecessarily.

---

## 37. Previous / Next Navigation

For day/week/month scopes, implement deterministic previous/next navigation.

Examples:

```text
day → ±1 canonical user-day
week → ±1 Review week
month → previous/next calendar month selection
```

Use Task 9.4 utilities.

---

## 38. Today Navigation

Provide/reuse a bounded:

> Today

navigation action where appropriate.

It selects a Review Scope.

It does not change planning authority.

---

## 39. Scope Header

Planner should clearly communicate the current Review Scope.

Examples:

```text
Sep 5
Sep 1–7
September 2026
```

Presentation formatting may be UI-friendly.

Underlying scope remains typed.

---

## 40. Month Surface Role

Month V1 is primarily:

> a navigable overview of planning/schedule state across the selected month.

It is not required to display every detail inside each calendar cell.

---

## 41. Month Cell Semantics

Each day cell should communicate useful high-level state without reconstructing planning logic.

Possible indicators:

* scheduled activity exists;
* Goal work exists;
* accepted unresolved authority exists;
* Proposal exists;
* Friction/conflict exists;
* protected Buffer exists;
* publication/history exists.

Use data from the canonical read model.

---

## 42. Avoid Calendar Noise

Do not attempt to render full event titles for every item in a dense month cell if it destroys usability.

Prefer summary indicators/counts with detail available after selection.

---

## 43. Selected Day

Selecting a Month day should update the Planner/day-detail context using canonical Review Scope.

Do not create a separate calendar-event state model.

---

## 44. Day Detail

A selected day/detail view should present relevant authoritative and planning items in understandable order.

Prefer semantic grouping over raw store order.

---

## 45. Suggested Day-Detail Groups

Where supported, consider:

### Scheduled

* Work
* Commitments
* Goal work
* Support
* Buffer

### Planning

* Accepted but unrealized
* Proposals

### Attention

* Friction
* coverage problems
* stale/missing Preview

### History

* publication state/history

Do not force these exact labels if existing UI terminology is stronger.

---

## 46. Semantic Ordering

Within a day, ordering should be deterministic.

Time-owning/protective facts should normally sort by:

1. start time;
2. end time;
3. stable semantic identity.

Do not depend on insertion order.

---

## 47. Cross-Boundary Facts

Use Task 9.4:

```text
authoritativeInterval
visibleInterval
```

A fact crossing Review Scope boundaries remains one authoritative fact.

Display may clip.

---

## 48. Cross-User-Day Identity

If one semantic fact appears visually in multiple day cells/slices:

* retain one semantic ID;
* do not duplicate authority.

---

## 49. Overnight Facts

Overnight Work/Commitments/Goal work must remain correctly attributable under canonical user-day semantics.

Do not regress to calendar-day splitting.

---

## 50. Buffer Geometry

Buffer visualization must respect exact protection geometry.

Do not merge overlapping provenance-bearing Buffers into one semantic object merely for display.

Visual union may be considered only if individual provenance remains inspectable.

---

## 51. Planning Coverage Presentation

Coverage should be understandable without exposing engine jargon unnecessarily.

Possible presentation:

```text
Planning data complete
Planning data incomplete
Planning data unavailable
```

Retain exact structured status underneath.

---

## 52. Coverage Explainability

Where coverage is not complete, expose enough structured reason/context to answer:

> Why can't DayFrame fully reason about this period?

Do not invent LLM explanations.

---

## 53. Preview Status Presentation

Present Preview state separately from planning coverage.

Possible states:

* current and covers scope;
* stale and covers scope;
* current but partial coverage;
* current but outside scope;
* no Preview.

Do not collapse into one boolean.

---

## 54. Proposal Status Presentation

Preserve lifecycle state where relevant:

* generated;
* shown;
* accepted;
* rejected;
* ignored;
* stale;
* expired;
* superseded;
* inapplicable.

Planner need not display every historical lifecycle state simultaneously.

But do not mislabel stale/inapplicable Proposal as current recommendation.

---

## 55. Accepted State Presentation

Accepted Allocation should retain:

* accepted status;
* complete footprint;
* realization state;
* Proposal lineage.

Do not expose raw internal IDs as primary UI text.

---

## 56. Realization Conflict Presentation

If an accepted allocation currently cannot realize and the command result is available in the active flow, present:

* that acceptance succeeded;
* scheduling realization did not;
* conflict exists.

Do not say:

> Acceptance failed.

---

## 57. Friction Presentation

Planner should surface existing Friction relevant to Review Scope.

Friction remains:

> incompatibility among authoritative scheduled/protective facts.

Do not show Competition as Friction.

---

## 58. SuggestedFix Boundary

Where existing Resolve Friction UI is already wired:

* preserve it;
* adapt navigation into Planner if appropriate.

Do not convert Proposal into SuggestedFix or vice versa.

---

## 59. Resolve Friction Entry

Planner should provide a clear contextual path from a visible Friction point into existing correction behavior.

Do not redesign corrective authority in this task.

---

## 60. Add Commitment Entry

Planner should retain/provide contextual access to:

> Add Commitment

using the existing unified authored flow.

Do not recreate setup authoring inside Month.

---

## 61. Edit Commitment Entry

Existing authored schedule facts should retain contextual edit access where already supported.

Do not permit editing immutable accepted/realized provenance through the Commitment editor.

---

## 62. Pattern Library Boundary

Pattern Library remains contextual.

Do not make it a primary Planner destination.

---

## 63. Goal Detail Boundary

Planner may link/label scheduled Goal work by Goal.

Do not build the future full Goal management UI here.

---

## 64. Summary Boundary

Do not overload Planner with:

* aggregate Goal Progress;
* long-term recommendation dashboards;
* learning;
* trend analytics.

Those remain Summary/Learn concerns.

---

## 65. Publication State

Planner should be able to communicate whether relevant schedule history/publication exists for the Review Scope where `queryPlanningReview` exposes it.

Do not automatically publish.

---

## 66. Publication Action

If an existing publication action is already user-facing and safe to contextualize:

* expose/reuse it with explicit Publication Range.

Otherwise keep publication inspection-only and document the deferred control.

Do not create an implicit “publish current screen” operation.

---

## 67. Publication Range Confirmation

Any publication action must clearly operate on an explicit Publication Range.

Do not assume:

```text
Publication Range = Review Scope
```

without passing through the established conversion/confirmation policy.

---

## 68. Historical Evidence

Historical publication items must remain visibly historical.

Do not mix them with current scheduled reality as if both own current time.

---

## 69. Current vs Historical

Planner should make it possible to understand:

```text
Current schedule
```

versus:

```text
Previously published schedule
```

without duplicating history into current event lists.

---

## 70. Planner State Model

Use a small presentation-state model materially equivalent to:

```ts
PlannerViewStateV1 {
  reviewScope
  selectedUserDay?
  planningReview
  previewCoverage
  previewFreshness
  loading/error state
}
```

Do not copy domain records into a new durable store.

---

## 71. URL / Navigation State

If the app already has route/query-state conventions, use them where appropriate.

Do not introduce a routing framework solely for Planner.

Review navigation may remain store/component state in V1.

---

## 72. Persistence Boundary

Task 9.4 established Review Scope as derived/session-only.

Preserve that.

Do not add Review Scope to:

* authored setup;
* profiles;
* Backup V12;
* IndexedDB authority.

---

## 73. Schema Decision

Task 9.4 baseline:

```text
IndexedDB schema 11
```

Expected:

```text
schema 11
```

No new durable authority should be required.

Any schema change requires explicit evidence and a stop/review before implementation.

---

## 74. Backup Decision

Task 9.4 baseline:

```text
Backup V12
```

Expected:

```text
Backup V12
```

Planner presentation state must not require a Backup bump.

---

## 75. Existing Preview Surface

Determine whether existing Preview should:

### A. become a Planner subview/component;

### B. remain a dedicated detailed schedule view reachable from Planner;

### C. share underlying presentation components with Planner.

Choose the smallest convergence path.

Do not maintain two competing schedule renderers indefinitely without documenting why.

---

## 76. Existing Month Surface

Determine whether existing Month should:

### A. evolve directly into Planner's Month mode;

or:

### B. become a shared Month component used by Planner.

Prefer reuse over replacement.

---

## 77. Existing Today Surface

Today should consume shared canonical schedule/read primitives where practical.

Do not redesign Today unless necessary to eliminate duplicate semantic logic.

---

## 78. Existing DayVisualizer

Reuse existing schedule visualization where it accurately represents:

* canonical user-day;
* fixed realized facts;
* support;
* Buffer;
* Work;
* commitments.

Extend rather than fork where practical.

---

## 79. Component Architecture

Prefer composable components such as:

```text
PlannerScreen
ReviewScopeNavigator
MonthOverview
PlannerDayDetail
PlanningCoverageStatus
PreviewStatus
ProposalCard/List
AcceptedAuthorityStatus
ScheduleFactPresentation
```

Exact names should follow codebase conventions.

Do not create one monolithic Planner component.

---

## 80. Domain-to-Presentation Adapter

Introduce a thin deterministic adapter if needed.

Its responsibility:

```text
queryPlanningReview output
→ presentation-ready semantic items
```

It may add:

* display labels;
* visible interval;
* grouping;
* deterministic sort keys;
* action eligibility.

It may not add planning authority.

---

## 81. Presentation Discriminators

Use explicit discriminators.

Examples:

```text
work
commitment
goalWork
supportActivity
bufferProtection
acceptedUnrealized
proposal
friction
historicalPublication
```

Do not infer type from title/category/color.

---

## 82. Action Eligibility

Derive actions from semantic type.

Examples:

### Work

inspect; no generic edit unless existing Work workflow allows.

### Authored Commitment

inspect/edit.

### Goal Work

inspect provenance; execution later where supported.

### Support

inspect; execution later where supported.

### Buffer

inspect only; never complete/execute.

### Accepted unrealized

inspect realization/conflict state.

### Proposal

decision actions where current.

### Historical

inspect only.

---

## 83. No Generic Edit Button

Do not place the same Edit action on every Planner item.

Editing semantics differ by authority class.

---

## 84. No Generic Complete Button

Do not add completion controls to:

* Buffer;
* Proposal;
* Accepted Allocation;
* Historical publication.

Execution remains separately governed.

---

## 85. Provenance Details

Planner does not need to expose the entire internal provenance graph by default.

But details/debug/read surfaces should preserve enough to explain:

* why Goal work exists;
* what Proposal/acceptance authorized it;
* why support/Buffer exists;
* whether an item is authored, accepted-derived, or external Work.

---

## 86. User-Facing Language

Prefer user language over engine terminology.

Examples:

```text
Scheduled
Accepted
Proposed
Protected time
Support
Planning data incomplete
Preview needs refresh
```

Avoid primary UI labels such as:

```text
AcceptedAllocationV2
RealizationV1
ProjectedResourceFootprintV1
```

unless in diagnostics.

---

## 87. “Commitment” Language

Preserve the architectural distinction between:

* direct authored Commitment;
* realized Goal work.

Do not call every time-owning fact a Commitment if that obscures provenance.

---

## 88. “Schedule” Language

“Scheduled” should mean actual current schedule truth.

Do not label Proposal or accepted-unrealized claims as scheduled.

---

## 89. “Plan” Language

Use “plan” carefully.

Preview is derived schedule representation.

Proposal is proposed action.

Published Plan is immutable history.

Avoid generic UI wording that collapses all three.

---

## 90. Loading State

Planner must distinguish:

```text
loading
```

from:

```text
complete and empty
```

and:

```text
coverage unknown
```

---

## 91. Error State

Query/adapter failure must not render as empty schedule.

Provide bounded error state.

---

## 92. Empty State

Only when relevant coverage is complete and no items exist should Planner show a true empty state.

Example:

> Nothing is scheduled or proposed in this period.

Exact copy may follow existing product voice.

---

## 93. Partial Coverage State

When planning coverage is partial:

* show known facts;
* indicate incomplete coverage;
* do not imply unknown portions are empty.

---

## 94. Month Coverage

Month cells/overview should not individually pretend complete knowledge when the month Review Scope has partial/unknown planning coverage.

Expose a scope-level coverage state.

---

## 95. Proposal Decision Refresh

After Proposal decision:

* refresh/requery canonical planning read model;
* if accepted and realization succeeds, realized facts should replace unresolved accepted presentation;
* if acceptance succeeds and realization conflicts, show accepted-unrealized/conflict state.

Do not manually patch duplicate UI models.

---

## 96. Realization Refresh

After successful realization:

* query current authoritative state;
* Preview becomes stale according to existing semantics;
* Planner shows realized facts;
* accepted liability disappears from unresolved presentation.

---

## 97. Preview Refresh

After Preview regeneration:

* requery;
* update coverage/freshness;
* do not change accepted/scheduled authority merely because Preview changed.

---

## 98. Authored Edit Refresh

After Add/Edit Commitment:

* preserve existing authored save semantics;
* requery Planner;
* Preview stale semantics remain governed by existing architecture.

---

## 99. Friction Resolution Refresh

After existing corrective action:

* requery;
* do not manually mutate Planner item arrays as authority.

---

## 100. Publication Refresh

After publication:

* requery publication/history state;
* current scheduled facts remain current;
* publication becomes historical evidence.

---

## 101. Determinism

Equivalent:

```text
ReviewScopeV1
+ queryPlanningReview result
```

must produce equivalent:

* Planner groups;
* Month indicators;
* day membership;
* visible intervals;
* action eligibility;
* sorting;
* status labels.

---

## 102. Stable React Keys

Use semantic stable identities.

Do not use:

* array index;
* visible slice index alone;
* display title.

For visual slices, combine stable semantic ID with deterministic slice identity if necessary.

---

## 103. Rendering Performance

Month rendering must not run expensive planning computation independently for every day cell.

Preferred:

```text
one bounded Review query
→ presentation aggregation
→ month cells
```

not:

```text
31 independent planning-engine calls
```

---

## 104. Read Query Count

Avoid N+1 persistence reads.

`queryPlanningReview` or its adapter should gather bounded data once per Review Scope where practical.

---

## 105. Memoization

Use memoization only where measurement/architecture warrants it.

Do not hide authority bugs behind stale React memoization.

---

## 106. Responsive Layout

Planner should remain usable on:

* desktop;
* tablet-like widths;
* phone.

Do not require the full desktop month grid to remain unchanged on narrow screens.

Use existing responsive conventions.

---

## 107. Mobile Month

For narrow screens, acceptable V1 approaches include:

* compact month grid + selected-day detail;
* horizontally constrained month with detail below.

Do not build a second mobile planner architecture.

---

## 108. Keyboard Navigation

Where Month uses interactive day cells:

* cells must be keyboard reachable;
* selected state must be accessible;
* activation must not depend on pointer only.

---

## 109. Semantic Controls

Use actual:

* buttons;
* links;
* headings;
* lists;

rather than clickable generic containers where possible.

---

## 110. Focus Behavior

When Review Scope/day changes:

* avoid unexpected focus loss;
* move focus only when intentional;
* preserve keyboard workflow.

---

## 111. Screen Reader Labels

Month/day controls should expose meaningful labels such as:

```text
September 5, 2026
3 scheduled items
1 proposal
```

where practical.

Do not rely solely on visual dots.

---

## 112. Color Boundary

Color may supplement semantic classes.

It must not be the only distinction between:

* scheduled;
* proposed;
* accepted;
* protected;
* historical;
* incomplete coverage.

---

## 113. Buffer Accessibility

Protected Buffer must have textual semantics.

Do not communicate it solely through shading.

---

## 114. Proposal Accessibility

Proposal actions must expose clear button names and lifecycle state.

---

## 115. Coverage Accessibility

Coverage/freshness status should be readable text or accessible status, not only icons.

---

## 116. Existing Visual Language

Reuse DayFrame's current:

* typography;
* spacing;
* cards;
* controls;
* schedule visual language;

unless a small change is necessary for semantic clarity.

This is not a visual-brand redesign.

---

## 117. No Premature Design System

Do not build a new component library for this task.

Extract shared components only where actual Planner/Month convergence warrants it.

---

## 118. Required Focused Tests — Planner Read Adapter

Prove:

1. scheduled Work remains scheduled;
2. direct Commitment remains authored;
3. Goal work is classified correctly;
4. support is distinct;
5. Buffer is protection;
6. accepted-unrealized is authority, not schedule;
7. Proposal is proposed;
8. historical publication is historical;
9. deterministic grouping;
10. deterministic sorting;
11. visible clipping preserves authority interval;
12. stable IDs/keys.

---

## 119. Required Focused Tests — Review Navigation

Prove:

1. day scope;
2. week scope;
3. configured week start;
4. month scope;
5. previous;
6. next;
7. Today;
8. selected day;
9. navigation causes no authority mutation;
10. navigation does not mark Preview stale merely by changing scope.

---

## 120. Required Focused Tests — Month

Prove:

1. correct month labels;
2. canonical user-day membership;
3. overnight item attribution;
4. Goal-work indicator;
5. support indicator;
6. Buffer indicator;
7. accepted indicator;
8. Proposal indicator;
9. Friction indicator where available;
10. selected-day detail;
11. no semantic identity duplication;
12. bounded query count.

---

## 121. Required Focused Tests — Coverage

Prove:

1. complete + empty → true empty state;
2. partial + empty-known-results → incomplete state;
3. none → unavailable state;
4. unknown → unknown state;
5. Preview coverage independent;
6. Preview freshness independent;
7. stale+covered;
8. current+not-covered.

---

## 122. Required Focused Tests — Proposal / Acceptance / Realization

Prove:

1. Proposal appears as proposed;
2. accepting uses existing authority path;
3. accepted+successful realization becomes scheduled reality;
4. accepted+failed realization remains accepted unresolved;
5. no double representation after realization;
6. rejection does not schedule;
7. ignored Proposal does not schedule;
8. navigation does not affect lifecycle.

---

## 123. Required Focused Tests — Preview

Prove:

1. Generate/Refresh uses existing Preview action;
2. Preview status updates from query;
3. regeneration does not alter accepted authority;
4. regeneration does not duplicate realized facts;
5. scope mismatch is not stale;
6. authored mutation remains stale.

---

## 124. Required Focused Tests — Friction

Prove:

1. relevant Friction appears;
2. Competition does not appear as Friction;
3. Resolve Friction entry uses existing corrective path;
4. correction refreshes read model;
5. no Proposal/SuggestedFix conflation.

---

## 125. Required Focused Tests — Publication

Where publication is surfaced:

1. publication state appears historical;
2. explicit Publication Range retained;
3. publication does not use Preview as authority;
4. publication does not mutate current schedule;
5. V3 realized lineage remains intact.

If action is deferred, test inspection state instead.

---

## 126. Required Focused Tests — Accessibility

Test applicable:

* keyboard day selection;
* semantic buttons;
* accessible selected state;
* textual semantic status;
* Buffer label;
* Proposal actions;
* coverage status;
* no color-only critical distinction.

Use current test stack.

---

## 127. Required Focused Tests — Responsive Behavior

Where current test infrastructure supports it, verify structural behavior at narrow layout.

Do not introduce brittle pixel tests.

---

## 128. Existing Preview Regression

Keep existing Preview suites green.

Task 9.5 must not change schedule-generation semantics.

---

## 129. Existing DayVisualizer Regression

Keep:

* canonical user-day;
* clipping;
* overnight;
* Work;
* manual;
* realized fixed facts;

green.

---

## 130. Phase 8/9 Regression

Keep green:

* Goal Structure;
* Demand/Priority/Projection;
* Composition;
* Capacity;
* Feasibility;
* Competition;
* Allocation;
* Proposal;
* ProposalDecision;
* Accepted Allocation;
* accepted liability;
* Realization;
* scope convergence.

---

## 131. Persistence Regression

Expected:

```text
IndexedDB schema 11
Backup V12
```

Keep:

* backup;
* restore;
* migration;
* downgrade protection;
* profiles;
* full clear;

green.

Planner navigation must not alter these formats.

---

## 132. DF-006 Regression

Preserve:

* canonical user-day;
* overnight;
* cycle provenance;
* variable-duration user-days;
* closed weekend/work-cycle behavior.

---

## 133. Full Regression

Task 9.4 baseline:

```text
120 test files
1,071 tests
0 failures
```

Record final counts.

---

## 134. Required Validation Commands

Run repository-supported equivalents:

```bash
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
git diff --check
```

Also run focused:

* Planner;
* Month;
* Review Scope;
* planning read query;
* Preview;
* Proposal/acceptance/realization;
* Friction;
* publication;
* accessibility;
* canonical user-day.

---

## 135. Bundle Discipline

Task 9.4 final baseline:

* initial raw: **668,337 bytes**
* initial gzip: **169,982 bytes**
* largest lazy: **53,188 bytes**
* total: **954,938 bytes**

Hard limits pass, but architecture-review warnings remain.

Task 9.5 is UI-heavy, so bundle discipline is mandatory.

Requirements:

1. Planner route/surface should be lazy where architecture permits;
2. reuse existing Month/Preview/DayVisualizer components;
3. do not eagerly import heavy planning modules into initial shell;
4. use `queryPlanningReview` through existing lazy store/query boundaries;
5. no new large dependency;
6. inspect before/after chunks;
7. record exact metrics;
8. if total-size warning materially worsens, document why and identify follow-up decomposition.

---

## 136. Bundle Stop Condition

If implementing Planner causes a hard bundle-budget failure:

* stop;
* identify the import path;
* fix architecture rather than raising the hard limit casually.

Do not hide regression by increasing thresholds without explicit authorization.

---

## 137. Performance Stop Condition

Stop and reassess if Month requires:

* one engine generation per day;
* repeated full-history scans;
* repeated Proposal derivation per cell;
* synchronous loading of all Phase 8/9 engines into initial UI.

Planner should consume bounded precomputed/read-model results.

---

## 138. Architecture Stop Conditions

Stop and report if:

* `queryPlanningReview` cannot represent a required Planner class without losing authority semantics;
* current Month has its own incompatible date model;
* current Preview is acting as hidden schedule authority;
* Proposal controls require UI-created authority not present in domain;
* accepted-unrealized cannot be distinguished from realized;
* Buffer cannot be presented without pretending it is activity;
* historical publication cannot be distinguished from current schedule;
* Review Scope navigation mutates authored setup;
* Month requires calendar-midnight schedule semantics;
* one semantic fact cannot retain identity across visual slices;
* Planner requires a new durable store merely to render;
* schema/Backup bump appears necessary for presentation state.

Do not solve these by flattening semantics.

---

## 139. Governance

Update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` only for durable product/architecture decisions such as:

* canonical Planner read source;
* Month role;
* Preview convergence strategy;
* epistemic presentation model;
* accepted-unrealized presentation;
* shared day-detail architecture.

Do not record ordinary CSS/component choices as architecture decisions.

---

## 140. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve cumulative Phase 9 work;
3. preserve unrelated changes;
4. do not reset;
5. do not clean;
6. do not discard prior task work;
7. do not commit;
8. do not push unless explicitly instructed.

Report repository state.

---

## 141. Required RESULT Artifact

Create:

```text
TASK_9.5_PLANNER_AND_MONTH_EVOLUTION_V1_RESULT.md
```

Filename must contain **`RESULT`**.

Place it in the dedicated Phase 9 implementation-results folder.

---

## 142. Required RESULT Sections

The RESULT must include at minimum:

1. Executive Result
2. Starting Baseline
3. Governing Foundations
4. Existing Surface Audit
5. Scope Delivered
6. Explicit Non-Goals
7. Planner Product Role
8. Canonical Read Source
9. Read-Model Authority Boundary
10. Epistemic Presentation Classes
11. Scheduled Reality Presentation
12. Goal Work Presentation
13. Support Presentation
14. Buffer Presentation
15. Work Presentation
16. Direct Commitment Presentation
17. Accepted-Unrealized Presentation
18. Accepted Liability Handling
19. Realized-vs-Accepted Deduplication
20. Proposal Presentation
21. Proposal Decision Integration
22. Proposal Horizon Handling
23. No-Proposal Presentation
24. Planning Coverage Presentation
25. Unknown-vs-Empty Presentation
26. Preview Coverage
27. Preview Freshness
28. Preview Regeneration
29. Review Scope Navigation
30. Default Review Scope
31. Day Navigation
32. Week Navigation
33. Month Navigation
34. Custom Scope Decision
35. Previous/Next Navigation
36. Today Navigation
37. Scope Header
38. Month Product Role
39. Month Cell Semantics
40. Month Density Strategy
41. Selected Day
42. Day Detail
43. Day-Detail Grouping
44. Semantic Ordering
45. Cross-Boundary Facts
46. Cross-User-Day Identity
47. Overnight Handling
48. Buffer Geometry
49. Coverage Explainability
50. Preview Status Presentation
51. Proposal Lifecycle Presentation
52. Accepted State Presentation
53. Realization Conflict Presentation
54. Friction Presentation
55. SuggestedFix Boundary
56. Resolve Friction Entry
57. Add Commitment Entry
58. Edit Commitment Entry
59. Pattern Library Boundary
60. Goal Detail Boundary
61. Summary Boundary
62. Publication State
63. Publication Action Decision
64. Publication Range Handling
65. Historical Evidence
66. Current-vs-Historical
67. Planner View State
68. Navigation State
69. Persistence Boundary
70. Schema Decision
71. Backup Decision
72. Preview Surface Convergence
73. Month Surface Convergence
74. Today Compatibility
75. DayVisualizer Reuse
76. Component Architecture
77. Presentation Adapter
78. Presentation Discriminators
79. Action Eligibility
80. Provenance Details
81. User-Facing Language
82. Commitment Language
83. Schedule Language
84. Plan Language
85. Loading State
86. Error State
87. Empty State
88. Partial Coverage State
89. Month Coverage
90. Proposal Decision Refresh
91. Realization Refresh
92. Preview Refresh
93. Authored Edit Refresh
94. Friction Resolution Refresh
95. Publication Refresh
96. Determinism
97. Stable Keys
98. Rendering Performance
99. Query Performance
100. Responsive Layout
101. Mobile Month
102. Keyboard Navigation
103. Semantic Controls
104. Focus Behavior
105. Screen Reader Labels
106. Color Boundary
107. Buffer Accessibility
108. Proposal Accessibility
109. Coverage Accessibility
110. Existing Visual Language
111. Planner Adapter Tests
112. Navigation Tests
113. Month Tests
114. Coverage Tests
115. Proposal/Acceptance/Realization Tests
116. Preview Tests
117. Friction Tests
118. Publication Tests
119. Accessibility Tests
120. Existing Preview Regression
121. DayVisualizer Regression
122. Phase 8/9 Regression
123. Persistence Regression
124. DF-006 Regression
125. Full Regression
126. Validation Commands
127. Bundle Architecture Review
128. Performance Assessment
129. V1 Design Decision Table
130. Epistemic Presentation Matrix
131. Action Eligibility Matrix
132. Planner State Matrix
133. Surface Convergence Matrix
134. Invariant Verification
135. Deviations
136. Governance Updates
137. Repository Status
138. Dogfood Readiness Assessment
139. Review Schedule Readiness
140. Recommended Next Task
141. Completion Statement

---

## 143. Required V1 Design Decision Table

Include:

| Question                         | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| -------------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| Planner primary read source      |             |                     |                    |                     |
| Planner product role             |             |                     |                    |                     |
| Month product role               |             |                     |                    |                     |
| Preview relationship             |             |                     |                    |                     |
| Today relationship               |             |                     |                    |                     |
| Review Scope default             |             |                     |                    |                     |
| supported scope navigation       |             |                     |                    |                     |
| selected-day model               |             |                     |                    |                     |
| day-detail model                 |             |                     |                    |                     |
| scheduled presentation           |             |                     |                    |                     |
| Goal-work presentation           |             |                     |                    |                     |
| support presentation             |             |                     |                    |                     |
| Buffer presentation              |             |                     |                    |                     |
| accepted-unrealized presentation |             |                     |                    |                     |
| Proposal presentation            |             |                     |                    |                     |
| coverage presentation            |             |                     |                    |                     |
| Preview coverage/freshness       |             |                     |                    |                     |
| Friction entry                   |             |                     |                    |                     |
| publication exposure             |             |                     |                    |                     |
| component reuse                  |             |                     |                    |                     |
| responsive strategy              |             |                     |                    |                     |
| navigation persistence           |             |                     |                    |                     |
| schema                           |             |                     |                    |                     |
| backup                           |             |                     |                    |                     |

---

## 144. Required Epistemic Presentation Matrix

Include:

| Class                  | Current Time Authority? |        User Decision Required? | Planner Presentation            |   May Look Scheduled? |
| ---------------------- | ----------------------: | -----------------------------: | ------------------------------- | --------------------: |
| Work                   |                     Yes |     Existing external/authored | Scheduled                       |                   Yes |
| Authored Commitment    |                     Yes |               Already authored | Scheduled                       |                   Yes |
| Scheduled Goal Work    |                     Yes |               Prior acceptance | Scheduled Goal work             |                   Yes |
| Scheduled Support      |                     Yes |               Prior acceptance | Scheduled support               |                   Yes |
| Buffer Protection      |                Protects |               Prior acceptance | Protected time                  | No activity semantics |
| Accepted Unrealized    |      Resource authority |               Already accepted | Accepted / awaiting realization |                    No |
| Proposal               |                      No |                            Yes | Proposed                        |                    No |
| Preview                |          No independent |                             No | Derived schedule view/status    |       Never authority |
| Historical Publication |         Historical only |              Prior publication | History                         |  No current authority |
| Friction               | Derived incompatibility | Corrective decision may follow | Attention                       |                    No |

---

## 145. Required Action Eligibility Matrix

Include implemented actions:

| Item                | Inspect |            Edit |    Accept/Reject |       Resolve |                Execute |             Publish |
| ------------------- | ------: | --------------: | ---------------: | ------------: | ---------------------: | ------------------: |
| Work                |         |                 |               No |    contextual |          existing only |           via range |
| Authored Commitment |     Yes |             Yes |               No |    contextual |          existing only |           via range |
| Goal Work           |     Yes | No generic edit |               No |    contextual | supported subject only |           via range |
| Support             |     Yes | No generic edit |               No |    contextual | supported subject only |           via range |
| Buffer              |     Yes |              No |               No |    contextual |                 **No** |           via range |
| Accepted Unrealized |     Yes |              No | already accepted | conflict path |                     No | No current schedule |
| Proposal            |     Yes | No generic edit |              Yes |            No |                     No |                  No |
| Historical          |     Yes |              No |               No |            No |                     No |  already historical |

Adjust only to actual existing capabilities.

---

## 146. Required Planner State Matrix

Include at minimum:

| Planning Coverage | Preview Coverage | Preview Freshness  | Expected Planner Meaning                            |
| ----------------- | ---------------- | ------------------ | --------------------------------------------------- |
| complete          | covers           | current            | fully reviewable current scope                      |
| complete          | covers           | stale              | planning truth available; Preview refresh needed    |
| complete          | partial          | current            | current Preview does not fully render scope         |
| complete          | none             | current/no preview | schedule truth available; Preview missing for scope |
| partial           | any              | any                | known facts plus incomplete planning-data warning   |
| none              | any              | any                | cannot claim scope is empty                         |
| unknown           | any              | any                | coverage unknown; fail epistemically closed         |

---

## 147. Required Surface Convergence Matrix

Include:

| Existing Surface | V1 Decision | Canonical Data Source | Long-Term Role |
| ---------------- | ----------- | --------------------- | -------------- |
| Month            |             |                       |                |
| Preview          |             |                       |                |
| DayVisualizer    |             |                       |                |
| Today            |             |                       |                |
| Day Detail       |             |                       |                |
| Review Schedule  |             |                       |                |
| Planner          |             |                       |                |

Do not leave duplicate responsibilities unexplained.

---

## 148. Required Invariants

Explicitly verify:

1. Planner consumes Task 9.4 scope semantics.
2. Planner does not create another range model.
3. Planner consumes canonical planning read data.
4. Planner read state is non-authoritative.
5. Work remains scheduled reality.
6. direct Commitment remains authored reality.
7. Goal work remains distinct from direct Commitment.
8. support remains distinct from productive Goal work.
9. Buffer remains protection.
10. Buffer is never presented as executable activity.
11. accepted-unrealized is not presented as scheduled.
12. Proposal is not presented as scheduled.
13. Preview is not presented as authority.
14. historical publication is not presented as current authority.
15. current vs historical truth remains distinguishable.
16. epistemic class is not inferred from color/title.
17. Review Scope navigation creates no authority.
18. day navigation uses canonical user-day semantics.
19. week navigation respects configured week start.
20. month navigation does not impose calendar-midnight schedule semantics.
21. custom scope does not become persistent preference without evidence.
22. previous/next navigation is deterministic.
23. Today is navigation only.
24. Review Scope identity remains stable.
25. Month uses one bounded read query, not one engine call per cell.
26. Month cells do not own planning logic.
27. selected day derives from Review navigation.
28. day detail preserves semantic identities.
29. authoritative intervals remain unclipped.
30. visible intervals may be clipped separately.
31. cross-day visual slices retain one authority identity.
32. overnight facts retain canonical attribution.
33. overlapping Buffers retain provenance identity.
34. complete+empty is distinguishable from unknown+empty.
35. partial coverage does not imply free time.
36. none coverage does not imply free time.
37. unknown coverage does not imply free time.
38. Preview coverage remains separate from freshness.
39. Review navigation mismatch does not stale Preview.
40. authoritative mutation still stales Preview.
41. Preview regeneration uses existing engine.
42. Preview regeneration does not change authority.
43. Proposal lifecycle remains intact.
44. Proposal Horizon remains intact.
45. Review filtering does not stale Proposal.
46. acceptance uses existing ProposalDecision path.
47. successful realization replaces unresolved accepted presentation.
48. realization conflict preserves accepted presentation.
49. no accepted/realized double representation occurs.
50. Friction remains distinct from Competition.
51. SuggestedFix remains distinct from Proposal.
52. Resolve Friction uses existing corrective authority.
53. Add Commitment uses existing authored flow.
54. Edit Commitment cannot rewrite immutable realized authority.
55. Pattern Library remains contextual.
56. Planner does not become Summary.
57. publication remains explicit.
58. Publication Range remains explicit.
59. publication does not use Preview as authority.
60. historical publication remains immutable.
61. Planner navigation is not added to profiles.
62. Planner navigation is not added to Backup.
63. schema remains evidence-driven.
64. Backup version remains evidence-driven.
65. no new durable Planner authority store exists.
66. presentation adapter is deterministic.
67. sorting is deterministic.
68. React keys use stable semantic identity.
69. UI labels do not depend on raw internal type names.
70. critical distinctions are not color-only.
71. Month day selection is keyboard accessible.
72. Buffer has textual protection semantics.
73. Proposal actions are semantically labeled.
74. coverage status is accessible.
75. loading is not empty.
76. error is not empty.
77. partial coverage may show known facts without claiming completeness.
78. Planner re-queries authority after mutations.
79. UI does not manually patch authority as source of truth.
80. realization remains idempotent.
81. accepted liability Capacity semantics remain intact.
82. realized Capacity semantics remain intact.
83. no execution is created by Planner inspection.
84. no Progress is inferred.
85. no recurrence is introduced.
86. no autonomous movement is introduced.
87. no Goal/Demand architecture is changed.
88. no Allocation architecture is changed.
89. no Proposal architecture is changed.
90. no realization architecture is changed.
91. no publication architecture is changed.
92. existing Preview behavior remains compatible.
93. existing Today behavior remains compatible unless explicitly converged.
94. existing DayVisualizer canonical behavior remains intact.
95. DF-006 remains closed.
96. schema 11 remains compatible unless evidence forces review.
97. Backup V12 remains compatible unless evidence forces review.
98. hard bundle limits pass.
99. future Review Schedule can consume the same Planner/read primitives.
100. Planner/Month no longer needs to invent its own planning semantics.

---

## 149. Dogfood Readiness Assessment

The RESULT must explicitly answer:

> **Can a user now use Planner to inspect a bounded period and correctly distinguish scheduled reality, protected time, accepted-but-unrealized authority, constructive Proposals, planning-data coverage, Preview coverage/freshness, Friction, and relevant publication history without needing knowledge of DayFrame's internal architecture?**

Expected:

> **Yes.**

If not, identify the exact remaining semantic or UX blocker.

---

## 150. Review Schedule Readiness

The RESULT must explicitly answer:

> **Can the next Review Schedule task consume the Planner/Review Scope/read-model/component foundation without creating another schedule reader or temporal model?**

Expected:

> **Yes.**

If not, do not proceed to Review Schedule evolution.

---

## 151. Expected Next Task

If Task 9.5 completes cleanly, the expected next bounded area is:

> **Task 9.6 — Review Schedule Evolution V1**

That task should focus on intentional schedule review, attention/Friction workflow, proposal/accepted state review, and publication readiness using the Planner foundation.

Do not reopen Month or scope architecture unless Task 9.5 uncovers a genuine stop condition.

---

## 152. Final Completion Statement

The RESULT must end with a completion statement materially equivalent to:

> **Task 9.5 — Planner and Month Evolution V1 complete.**
>
> DayFrame now exposes the completed Phase 8/9 planning architecture through one canonical Planner experience rather than requiring users or UI components to reconstruct planning truth from separate stores and date models: Planner consumes the Task 9.4 `ReviewScopeV1` and `queryPlanningReview` contract, preserves canonical user-day day/week/month navigation and deterministic Review Scope semantics, and presents authoritative Work, direct Commitments, realized productive Goal work, operational support activity, and Buffer protection as distinct current schedule classes while separately presenting accepted-but-unrealized authority, constructive Proposals, planning-data coverage, Preview coverage and freshness, Friction/attention state, and relevant immutable publication history according to their actual epistemic roles; Month operates as a bounded overview over the same canonical read model rather than as a second planning engine, selected-day and day-detail presentation preserve full semantic identity and authoritative geometry while permitting separate visible clipping, overnight and cross-user-day facts retain canonical attribution, and dense calendar presentation does not flatten support, Buffer, Proposal, acceptance, or history into generic events; navigation changes inspection context only and cannot mutate Goal, Demand, Priority, Proposal, Accepted Allocation, Realization, schedule truth, publication, execution, or Progress; Proposal decisions, realization results, Preview regeneration, authored edits, Friction correction, and publication state refresh through authoritative re-query rather than UI-owned mutation; complete, partial, none, and unknown planning coverage remain distinguishable from true empty state, Preview range coverage remains independent from Preview freshness, accepted authority cannot masquerade as scheduled reality, Buffer cannot masquerade as executable activity, Proposal cannot masquerade as time ownership, and HistoricalPlan cannot masquerade as current schedule; existing unified Commitment authoring, Resolve Friction, Pattern Library boundaries, Preview generation, DayVisualizer, Today, Proposal/acceptance/realization, Capacity liability handoff, publication, canonical user-day, persistence, schema 11, Backup V12, and DF-006 behavior remain intact; Planner navigation remains derived/session state rather than a new durable authority or preference; accessibility, responsive behavior, deterministic ordering and identity, bounded query behavior, bundle governance, and regression coverage are preserved; the first user-facing Planner/Month convergence is complete, and Task 9.6 may evolve Review Schedule using the same scope, read-model, semantic presentation, and component foundation rather than inventing another schedule or temporal architecture.
