# Task 9.7 — Explicit Publication Workflow V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Subphase:** Publication and Historical Schedule Workflow
**Task Type:** Implementation / Explicit Publication Command / Publication Range / Immutable History / Review Schedule Integration / Regression
**Primary Responsibility:** Expose one explicit, bounded, user-authorized publication workflow that converts the currently reviewed and publication-ready schedule truth for an explicit `PublicationRangeV1` into immutable HistoricalPlan evidence without treating Preview as schedule authority, silently publishing the visible screen, mutating prior publications, creating execution or Progress, or introducing another schedule/history ownership model.

---

## 1. Objective

Complete the ordinary Phase 9 user path:

```text
Goal / Demand / Priority
→ planning derivation
→ Proposal
→ ProposalDecision
→ Accepted Allocation
→ Realization
→ Planner
→ Review Schedule
→ resolve attention
→ explicit Publish
→ immutable HistoricalPlan
```

Task 9.6 established:

```text
publicationReady
```

as a pure derived state.

Task 9.7 must now answer:

> **When Review Schedule says a bounded period is ready, how does the user explicitly authorize publication of that exact schedule range into immutable history?**

At completion:

1. Review Schedule can expose a real Publish action when eligible.
2. The action operates on an explicit `PublicationRangeV1`.
3. Publication uses authoritative current schedule truth through the existing publication/materialization architecture.
4. Preview may remain an operational materialization dependency where current architecture requires it.
5. Preview does not become schedule authority.
6. Publication creates immutable historical evidence.
7. Re-publication creates another immutable publication rather than rewriting history.
8. Failed publication creates no partial historical state.
9. Publication remains distinct from execution, Progress, acceptance, Realization, and current schedule ownership.

---

## 2. Governing Completed Foundations

Treat the following as settled.

### Phase 8

* provenance/freshness;
* Goal Structure;
* Demand/Priority/Projection;
* Commitment Composition;
* Capacity;
* Feasibility.

### Task 9.1

* Competition;
* Allocation.

### Task 9.2

* Proposal;
* ProposalDecision;
* Accepted Allocation.

### Tasks 9.2.0–9.2.2

* complete productive/support/Buffer footprints;
* complete Accepted Allocation authority;
* stable realized schedule identity;
* HistoricalPlan V3 realized lineage.

### Task 9.3

* `RealizationV1`;
* `ScheduledGoalWorkV1`;
* `ScheduledSupportActivityV1`;
* `RealizedBufferProtectionV1`;
* realization authority;
* accepted-liability handoff;
* explicit publication materialization seams.

### Task 9.4

* `PublicationRangeV1`;
* Planning Data Horizon;
* Review Scope;
* Preview Range;
* explicit publication coverage semantics;
* historical range fidelity.

### Task 9.5

* Planner/Month semantic presentation;
* historical-vs-current distinction.

### Task 9.6

* Review Schedule canonical workflow;
* `publicationReady`;
* publication blockers;
* explicit readiness reasons;
* Preview freshness/coverage requirements;
* publication action deliberately deferred.

Do not reopen these contracts without a stop condition.

---

## 3. Product Role

Publication means:

> **The user intentionally freezes an exact bounded representation of the current authoritative schedule into immutable planning history.**

Publication does not mean:

* schedule creation;
* schedule acceptance;
* realization;
* execution;
* completion;
* Progress;
* backup;
* export;
* Preview generation.

---

## 4. Epistemic Boundary

The governing sequence is:

```text
Current authoritative schedule
→ explicit publication operation
→ immutable HistoricalPlan evidence
```

HistoricalPlan records:

> what DayFrame considered the published schedule for that bounded range at that publication event.

It does not become current schedule authority.

---

## 5. Explicit User Authorization

Publication must require an explicit user action.

Never publish automatically because:

* Preview generated;
* Review becomes ready;
* Proposal accepted;
* Realization succeeds;
* Friction reaches zero;
* Review Scope changes.

---

## 6. Explicit Non-Goals

Do not:

* redesign HistoricalPlan semantics broadly;
* redesign Preview;
* redesign Planner;
* redesign Review Schedule;
* redesign Realization;
* redesign acceptance;
* introduce execution;
* infer Progress;
* implement Live adaptation;
* implement learning;
* create schedule version rollback;
* create publication editing;
* create mutable historical snapshots;
* auto-publish;
* add recurrence;
* add cloud sync;
* add export/PDF behavior unless already part of publication;
* create a new history store if HistoricalPlan already owns publication;
* add an approval workflow beyond the explicit publish action.

---

## 7. Existing Publication Audit

Before implementation, trace the full current publication path.

Identify:

1. public entry points;
2. materializer(s);
3. HistoricalPlan record factories;
4. persistence owner/store;
5. Preview dependency;
6. Publication Range source;
7. current transaction boundary;
8. existing publication IDs/revisions;
9. Work publication behavior;
10. authored Commitment publication behavior;
11. realized Goal work publication behavior;
12. support publication behavior;
13. Buffer publication behavior;
14. restore behavior;
15. Backup V12 behavior;
16. duplicate/multiple publication behavior;
17. error handling;
18. tests.

Classify each as:

```text
retain
adapt
wrap
replace
```

Do not add a second publication pipeline.

---

## 8. Canonical Public Command

Expose one canonical publication command materially equivalent to:

```ts
publishScheduleRange(input)
```

or:

```ts
publishReviewedSchedule(input)
```

Exact name should follow repository conventions.

It must be the sole public V1 command for explicit schedule publication.

---

## 9. Command Input

The command must accept an explicit structured input materially equivalent to:

```ts
PublishScheduleRangeInputV1 {
  publicationRange: PublicationRangeV1
  expectedSourceFingerprint?: ...
  publishedAt: ...
}
```

Include only fields required by existing architecture.

Do not pass raw component state.

---

## 10. Publication Range

Every publication command must receive an explicit:

```text
PublicationRangeV1
```

Do not infer the range from:

* current visible Month;
* selected day;
* Review Scope object identity;
* Preview's internal bounds;
* UI viewport.

---

## 11. Review Scope Conversion

Review Schedule may offer:

> Publish this reviewed period

by explicitly constructing:

```text
ReviewScopeV1
→ PublicationRangeV1
```

through a governed conversion.

Equal geometry does not mean equal semantics.

---

## 12. Conversion Rule

Define one pure function materially equivalent to:

```ts
publicationRangeFromReviewScope(reviewScope)
```

It should:

* copy exact canonical user-day bounds;
* create a distinct publication type;
* preserve derivation provenance if repository patterns support it;
* validate the resulting range.

---

## 13. Publication Range Confirmation

The user-facing action must clearly identify the range being published.

Example:

```text
Publish September 1–7
```

or equivalent.

Do not use:

> Publish

with no nearby indication of scope if ambiguity is possible.

---

## 14. Current Publication Architecture

Task 9.6 found:

> current publication materializes through fresh Preview.

Preserve that implementation dependency in V1 unless evidence proves it can be safely removed.

Do not confuse operational dependency with authority.

---

## 15. Preview Dependency

The publication command may consume a fresh covering Preview as a materialization input.

But the semantic rule remains:

```text
Preview is evidence/materialization input
≠
Preview owns scheduled truth
```

---

## 16. Required Preview State

V1 publication eligibility requires:

* Preview exists;
* Preview is current;
* Preview covers the full Publication Range.

Use Task 9.6 readiness semantics.

---

## 17. No Silent Preview Generation

Pressing Publish should not silently generate a missing/stale Preview unless current product behavior already makes that explicit and safe.

Preferred:

```text
not ready
→ Refresh Preview
→ ready
→ Publish
```

This preserves understandable authority/action boundaries.

---

## 18. Authoritative Validation

Immediately before publication, revalidate current authoritative state.

Do not rely solely on readiness state calculated during an earlier render.

---

## 19. TOCTOU Protection

The publication command must guard against:

```text
Review was ready
→ schedule changed
→ user clicks Publish
```

The command must fail closed if relevant authoritative state changed.

---

## 20. Publication Fingerprint

Use or introduce a deterministic source fingerprint containing the dependencies required to prove the materialization still corresponds to current truth.

Potential dependencies:

* Preview identity/revision;
* effective Preview freshness fingerprint;
* schedule facts;
* Realization revisions;
* authored schedule revisions;
* relevant planning policy.

Reuse existing freshness/provenance architecture.

Do not invent a second generic revision system.

---

## 21. Command Result

Return a typed result materially equivalent to:

```ts
PublishScheduleRangeResultV1 =
  | { status: "published"; ... }
  | { status: "alreadyPublished"; ... } // only if semantics support it
  | { status: "stale"; ... }
  | { status: "incompleteCoverage"; ... }
  | { status: "invalid"; ... }
  | { status: "failed"; ... }
```

Do not use exceptions for ordinary expected applicability states.

---

## 22. Publication Multiplicity

Audit existing behavior and explicitly choose V1 semantics.

Preferred:

> Publishing the same range again after a later review creates a new immutable publication event/version rather than mutating the previous publication.

Do not deduplicate publications solely by range.

---

## 23. Exact Duplicate Invocation

Distinguish:

```text
same semantic publication command retried
```

from:

```text
user intentionally republishes the same range later
```

If the persistence/command architecture supports idempotency keys or semantic fingerprints, preserve retry safety without preventing legitimate future publication.

---

## 24. Publication Identity

Publication identity must be stable and deterministic according to existing HistoricalPlan conventions.

If IDs are event-based rather than deterministic, use the established ID policy.

Do not change historical identity architecture merely for UI convenience.

---

## 25. Publication Timestamp

Use injected/passed publication time.

Do not read uncontrolled wall-clock time inside pure factories.

---

## 26. Immutable HistoricalPlan

Once created, published records are immutable.

No Task 9.7 action may:

* edit;
* replace;
* rewrite;
* “refresh”

a prior publication.

---

## 27. Current Schedule Independence

Publishing does not freeze current schedule authority.

After publication:

* user may continue editing current schedule through allowed flows;
* later changes make current schedule differ from history;
* old HistoricalPlan remains unchanged.

---

## 28. Publication Snapshot Content

Preserve existing HistoricalPlan representation for:

* Work;
* authored Commitments;
* realized Goal work;
* support;
* Buffer;
* other current published schedule facts already governed.

Do not silently omit newly realized semantic roles.

---

## 29. Goal Work Snapshot

Published Goal work must retain existing HistoricalPlan V3 lineage:

* realized fact identity/reference;
* Goal identity;
* Demand/projection lineage where defined;
* accepted-allocation lineage;
* exact interval;
* canonical user-day;
* publication range.

---

## 30. Support Snapshot

Published support must remain:

> operational support activity

and preserve its relationship to productive work.

Do not imply Demand credit.

---

## 31. Buffer Snapshot

Published Buffer remains historical evidence of protected time.

It remains:

* non-executable;
* non-productive;
* provenance-bearing.

---

## 32. Direct Commitment Snapshot

Direct authored Commitments retain their existing semantic origin.

Do not invent accepted-allocation provenance.

---

## 33. Work Snapshot

Work remains external/fixed schedule truth according to existing HistoricalPlan semantics.

---

## 34. Cross-Boundary Facts

Audit existing publication clipping semantics.

A fact intersecting Publication Range may require:

* full authoritative identity;
* exact published visible interval;
* provenance.

Do not mutate the source fact.

---

## 35. Publication Range Boundary

Publishing a range must not silently widen historical range labels because adjacent context was loaded.

Context range and Publication Range remain distinct.

---

## 36. Canonical User-Day

Publication Range must retain canonical user-day semantics.

Do not serialize publication boundaries as calendar-midnight schedule truth.

---

## 37. Overnight Facts

Overnight Work/Commitments/realized activities must publish consistently with existing canonical user-day attribution.

---

## 38. Boundary Context

Where Preview/materialization loads adjacent context:

* use it to derive correct facts;
* do not publish facts outside the requested Publication Range except according to existing intersecting-fact rules;
* do not widen immutable publication metadata.

---

## 39. Publication Coverage

Publication must require complete authoritative/materialization coverage for the entire range.

Do not clip an uncovered requested publication to the portion Preview happens to contain.

---

## 40. Unknown Is Not Empty

If publication coverage is:

```text
unknown
partial
none
```

fail closed.

Do not publish a misleading empty/partial history snapshot.

---

## 41. Accepted-Unrealized Authority

Publication remains blocked where accepted-but-unrealized claims intersect the Publication Range.

Use the Task 9.6 policy.

---

## 42. Realization Conflict

If accepted authority cannot realize:

* acceptance remains intact;
* publication remains blocked;
* publication does not “skip” those claims.

---

## 43. Friction

Unresolved V1 Friction intersecting the Publication Range blocks publication.

Do not publish around Friction by clipping it away.

---

## 44. Proposal

Actionable non-authoritative Proposal does **not** block publication under the Task 9.6 policy.

Preserve this.

Do not elevate Proposal into required authority.

---

## 45. Review Readiness Reuse

Publication UI should consume:

```text
deriveScheduleReviewReadiness(...)
```

for presentation.

But the command must still revalidate independently.

UI readiness is not security/consistency authority.

---

## 46. Publication Readiness Reuse

Reuse:

```text
publicationReady
```

and structured reasons.

Do not rebuild the blocker logic in the Publish button.

---

## 47. Publish Action Placement

Integrate publication into Review Schedule.

Preferred location:

```text
Review readiness / publication readiness section
```

not individual schedule items.

---

## 48. Disabled Publish

When blocked:

* action may be disabled or absent according to existing UX conventions;
* every blocker must be visible nearby.

Do not rely on tooltip-only explanation.

---

## 49. Ready Publish

When eligible, show one clear action such as:

```text
Publish reviewed schedule
```

with the exact range visible.

---

## 50. Publication Confirmation UX

Choose the smallest appropriate explicit confirmation.

Acceptable V1:

### Option A

Button itself is sufficiently explicit:

> Publish Sep 1–7

### Option B

Small confirmation step:

> Publish this schedule as immutable history?

Do not add a complex wizard.

Document the choice.

---

## 51. Confirmation Meaning

If confirmation is used, explain:

* publication creates historical record;
* it does not lock future editing;
* prior publications remain unchanged.

---

## 52. Pending State

Disable duplicate Publish activation while the command is pending.

---

## 53. Success State

After successful publication:

* announce success;
* requery HistoricalPlan/review state;
* show historical coverage/publication;
* current schedule remains visible.

---

## 54. Failure State

On failed publication:

* preserve current schedule;
* preserve prior history;
* show typed reason;
* allow correction/retry where appropriate.

---

## 55. Stale-on-Click State

If the schedule changed between review and publish:

show materially equivalent:

> The schedule changed since this review. Refresh the Preview and review again before publishing.

Do not create history.

---

## 56. Atomicity

Publication persistence must be atomic for one publication operation.

If a publication contains multiple HistoricalPlan records/snapshots:

```text
all records succeed
or
none persist
```

---

## 57. Partial Failure

Explicitly test persistence failure after staging some records.

Expected:

```text
0 new historical records
```

not partial publication.

---

## 58. Transaction Boundary

Use one existing IndexedDB transaction or other established atomic publication transaction.

Do not write records one-by-one outside a transaction if that can produce partial history.

---

## 59. In-Memory Atomicity

Runtime state should not expose partial successful publication if durable commit fails.

---

## 60. Reopen / Restart

After successful publication and app restart:

* HistoricalPlan records remain;
* current schedule remains independent;
* publication range/history status reproduces correctly.

---

## 61. Backup V12

HistoricalPlan publication authority is already backed up.

Expected:

```text
Backup V12 remains unchanged
```

unless audit proves current explicit publication data is not already preserved.

---

## 62. Schema 11

Expected:

```text
IndexedDB schema remains 11
```

because no new semantic owner should be necessary.

---

## 63. Schema Stop Condition

If explicit publication requires a new durable record/store not represented by existing HistoricalPlan authority:

stop and report before bumping schema.

---

## 64. Backup Stop Condition

If a new durable publication semantic cannot be represented by Backup V12:

stop and report before changing Backup.

---

## 65. HistoricalPlan Version

Prefer using existing:

```text
HistoricalPlan V3
```

for realized roles.

Do not introduce V4 solely to add UI publication action.

A version bump requires actual serialized semantic change.

---

## 66. Publication Event Metadata

If existing historical representation lacks an explicit publication-event identity necessary for multiple publications, audit before changing.

Do not assume range-indexed snapshots alone are sufficient or insufficient.

Document actual behavior.

---

## 67. Multiple Publications

The history query must preserve multiple immutable publications over overlapping/equal ranges where existing architecture supports them.

Do not collapse them into one “latest” record destructively.

---

## 68. Latest Publication

UI may identify the newest publication for convenience.

This is a derived query.

Do not rewrite older history.

---

## 69. Historical Comparison

No full schedule-diff UI required.

If existing history UI can show publication date/range, reuse it.

Detailed historical comparison is deferred.

---

## 70. Publication List

If practical, Review Schedule may show:

* latest publication time;
* number of publications intersecting scope.

Do not build a full History browser here.

---

## 71. Planner Integration

Planner/Month historical state should refresh after publication through existing canonical query behavior.

Do not manually patch Month cells as truth.

---

## 72. Review Schedule Integration

After publication:

```text
publish command
→ durable result
→ canonical requery
→ updated publication/history state
```

---

## 73. Preview After Publication

Publishing should not automatically stale Preview merely because historical evidence was added.

History creation does not modify current schedule authority.

---

## 74. Readiness After Publication

Review/publication readiness may remain true after successful publication if current schedule is unchanged.

But UI should separately show:

> Published

or:

> Published previously

Do not replace readiness with history existence.

---

## 75. Schedule Change After Publication

If current schedule changes later:

* old publication remains;
* Preview follows existing stale semantics;
* Review readiness recomputes;
* new publication can occur after subsequent review.

---

## 76. Publication Does Not Execute

Mandatory:

```text
publish
≠
execute
```

No ExecutionRecord is created.

---

## 77. Publication Does Not Complete Progress

Mandatory:

```text
publish
≠
complete Goal Demand
≠
Progress
```

No Progress inference.

---

## 78. Publication Does Not Accept

Publishing cannot create:

* ProposalDecision;
* Accepted Allocation.

---

## 79. Publication Does Not Realize

Publishing cannot materialize accepted-but-unrealized claims.

They block publication.

---

## 80. Publication Does Not Resolve Friction

Publishing cannot suppress/ignore Friction.

---

## 81. Publication Does Not Author

Publication does not create/edit Commitments.

---

## 82. Publication Does Not Create Preference

Publication history does not automatically become learned/reusable preference.

---

## 83. User-Facing Language

Prefer:

```text
Publish schedule
Ready to publish
Not ready to publish
Published on …
Previous publication
Schedule changed since review
```

Avoid raw terms such as:

```text
HistoricalPlanV3
PublicationRangeV1
```

in primary UI.

---

## 84. Historical Language

Use language making clear:

> published = historical snapshot

not:

> current schedule permanently locked.

---

## 85. Publication Success Copy

Materially equivalent:

> Schedule published. This creates an immutable historical record; you can still change the current schedule later.

Keep concise.

---

## 86. Republish Language

If a previous publication exists:

use materially equivalent:

> Publish current schedule again

rather than:

> Replace publication.

---

## 87. Accessible Action

Publish action must be:

* native button;
* keyboard accessible;
* clearly named.

---

## 88. Accessible Range

Screen reader context must make publication range understandable.

---

## 89. Live Success

Publication result should use appropriate accessible status semantics.

---

## 90. Error Accessibility

Publication failure should use appropriate alert semantics.

---

## 91. Confirmation Accessibility

If confirmation UI is added:

* keyboard focus contained appropriately;
* clear confirm/cancel labels;
* return focus sensibly.

Reuse existing confirmation components if available.

---

## 92. Color Boundary

Publication readiness/success/failure must not depend on color alone.

---

## 93. Loading State

Pending publication is not success.

Do not update history display until durable result confirms success.

---

## 94. Query Failure

If HistoricalPlan/current planning query fails:

publication must fail closed.

---

## 95. Command Error

Unexpected command error returns bounded failure and no partial publication.

---

## 96. Action Eligibility

Centralize publication action eligibility.

Do not duplicate readiness checks across:

* button rendering;
* click handler;
* command.

UI and command may share pure validation, but command revalidates current truth.

---

## 97. Domain Validation

Publication command is ultimate applicability guard.

UI disabled state is convenience only.

---

## 98. Publication Reason Codes

Introduce/reuse structured result reasons materially equivalent to:

```text
invalidPublicationRange
planningCoverageIncomplete
previewMissing
previewStale
previewRangeMismatch
frictionUnresolved
acceptedAllocationUnrealized
sourceChanged
persistenceFailure
```

Do not return generic `"notReady"` only.

---

## 99. Proposal Pending

Do not add:

```text
proposalDecisionPending
```

as publication failure under the existing Task 9.6 policy.

Proposal remains warning only.

---

## 100. Determinism

Equivalent:

```text
authoritative schedule
+ PublicationRangeV1
+ publication policy
+ publication timestamp
```

must create equivalent historical content except governed identity/timestamp fields.

---

## 101. Stable Snapshot Ordering

Published records within an event/range must use deterministic ordering.

Do not depend on store iteration order.

---

## 102. Stable Subject Identity

Historical records must preserve stable source identities.

Do not generate display-only replacements.

---

## 103. Serialization

Persist canonical date strings and existing typed historical representations.

Do not serialize UI labels as semantic truth.

---

## 104. Publication Provenance

Historical snapshots should retain provenance sufficient to trace to:

* source schedule fact;
* source Realization/Accepted Allocation where applicable;
* publication event/range.

Reuse existing V3 fields.

---

## 105. Publication Range Provenance

If HistoricalPlan currently stores inclusive legacy fields, preserve compatible serialization while adapting through `PublicationRangeV1`.

Do not rewrite old records.

---

## 106. Legacy Readers

HistoricalPlan V1/V2/V3 readers remain green.

---

## 107. Legacy History

Old publications remain readable and immutable.

Do not “upgrade” them by inferring new realized lineage that was never stored.

---

## 108. History Queries

Use existing indexed bounded reads.

Do not scan all history to render one Review Scope if an index already exists.

---

## 109. Performance

Publication staging should be bounded by facts intersecting the Publication Range.

No full-lifetime schedule scan.

---

## 110. Query Count

Use bounded queries for:

* current review state;
* Preview/materialization;
* existing history.

Avoid per-fact persistence reads.

---

## 111. Lazy UI

Keep publication workflow inside the existing lazy Review Schedule path.

Do not move history/publication modules into the initial application bundle unnecessarily.

---

## 112. Bundle Discipline

Task 9.6 final baseline:

* initial raw: **668,266 bytes**
* initial gzip: **169,997 bytes**
* largest lazy: **53,194 bytes**
* total: **971,254 bytes**
* Review workflow lazy chunk: **7,744 raw / 2,450 gzip**

Requirements:

1. no heavy dependency;
2. reuse existing HistoricalPlan logic;
3. publication UI remains lazy;
4. pure validation modules remain small;
5. record final bundle metrics;
6. hard limits must pass.

---

## 113. Bundle Architecture Warning

Total bundle size is approaching 1 MB raw.

Do not treat this task as permission to add broad history UI.

If publication work materially increases total size:

* identify exact chunk/import contribution;
* document follow-up decomposition opportunity.

---

## 114. Bundle Stop Condition

If hard limits fail:

* fix architecture/import boundaries;
* do not increase limits automatically.

---

## 115. Required Focused Tests — Range Conversion

Test:

1. Review Scope → Publication Range;
2. exact bounds preserved;
3. semantic type distinct;
4. invalid range rejected;
5. canonical user-day behavior;
6. end-exclusive semantics.

---

## 116. Required Focused Tests — Eligibility

Test publication command rejection for:

1. incomplete planning coverage;
2. unknown coverage;
3. missing Preview;
4. stale Preview;
5. Preview range mismatch;
6. unresolved Friction;
7. accepted-unrealized authority;
8. invalid range;
9. source changed since readiness;
10. query failure.

---

## 117. Required Focused Tests — Successful Publication

Prove:

1. ready Review Scope;
2. explicit Publication Range;
3. user action;
4. authoritative revalidation;
5. historical records created;
6. current schedule unchanged;
7. historical state visible after requery.

---

## 118. Required Focused Tests — Atomicity

Inject persistence failure.

Prove:

```text
no partial publication
```

for multi-record publication.

---

## 119. Required Focused Tests — Retry

Test immediate duplicate command/retry according to chosen idempotency semantics.

Prove no accidental duplicate caused solely by retry after ambiguous command completion.

---

## 120. Required Focused Tests — Republishing

If multiple immutable publications are supported:

1. publish range;
2. change current schedule;
3. refresh/review;
4. publish same range again;
5. both publications survive;
6. first remains byte/semantic immutable;
7. second reflects current truth.

---

## 121. Required Focused Tests — Goal Work

Published realized Goal work retains:

* fact identity/reference;
* Goal;
* accepted lineage;
* interval;
* canonical user-day;
* role.

---

## 122. Required Focused Tests — Support

Support publishes distinctly from productive Goal work and does not gain Demand credit.

---

## 123. Required Focused Tests — Buffer

Buffer publishes as protection and remains non-executable.

---

## 124. Required Focused Tests — Direct Commitments

Direct authored schedule facts retain authored origin.

---

## 125. Required Focused Tests — Work

Work retains existing historical representation.

---

## 126. Required Focused Tests — Cross-Boundary

Test:

* fact begins before range;
* fact ends inside;
* fact begins inside;
* fact ends after;
* exact touching boundary;
* overnight fact.

Verify correct published representation without widening range.

---

## 127. Required Focused Tests — History

Prove:

1. restart retention;
2. bounded history query;
3. old publication unchanged;
4. latest publication derivation;
5. equal-range multiple publications according to V1 policy.

---

## 128. Required Focused Tests — Review Schedule UI

Prove:

1. blocked state shows reasons;
2. ready state shows publish action;
3. exact range visible;
4. pending disables duplicate action;
5. success refreshes history;
6. failure leaves history unchanged;
7. source-changed failure instructs refresh/review.

---

## 129. Required Focused Tests — Proposal Policy

Prove actionable Proposal:

* remains visible as warning;
* does not block publication;
* is not implicitly rejected/accepted by publication.

---

## 130. Required Focused Tests — Accepted Authority

Accepted-unrealized:

* blocks;
* cannot be skipped;
* remains accepted after failed publication.

---

## 131. Required Focused Tests — Friction

Friction:

* blocks;
* publishing does not suppress it;
* once resolved through existing path and Preview refreshed, publication may become ready.

---

## 132. Required Focused Tests — Preview

Prove:

1. Preview acts as required materialization input;
2. does not become authority;
3. publish does not modify Preview;
4. history creation alone does not stale Preview.

---

## 133. Required Focused Tests — Execution/Progress Isolation

Prove successful publication creates:

```text
0 execution records
0 Progress changes
```

---

## 134. Required Focused Tests — Persistence

Keep:

```text
schema 11
Backup V12
```

and verify new explicit UI action creates only already-governed HistoricalPlan state.

---

## 135. Required Focused Tests — Accessibility

Test:

* publish button;
* range labeling;
* blockers;
* pending state;
* success announcement;
* error alert;
* confirmation if used.

---

## 136. Existing Review Schedule Regression

Task 9.6 readiness and Proposal/Friction behavior remains green.

---

## 137. Planner/Month Regression

Task 9.5 behavior remains green.

---

## 138. Preview Regression

Existing generation/stale/range behavior remains green.

---

## 139. Proposal Regression

Proposal lifecycle/decision remains green.

---

## 140. Acceptance Regression

Accepted Allocation semantics remain green.

---

## 141. Realization Regression

Atomic realization and accepted-liability handoff remain green.

---

## 142. Friction Regression

Detection/SuggestedFix/Move remain green.

---

## 143. HistoricalPlan Regression

V1/V2/V3 readers, publication, restore, range semantics, and immutable history remain green.

---

## 144. Canonical User-Day Regression

Preserve:

* day boundary;
* week start;
* overnight;
* cycle/segment effective preferences;
* DF-006.

---

## 145. Full Regression

Task 9.6 baseline:

```text
124 test files
1,079 tests
0 failures
```

Record final counts.

---

## 146. Required Validation Commands

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

* publication command;
* HistoricalPlan;
* Review Schedule;
* planning scope;
* Preview;
* realization;
* Friction;
* Proposal;
* persistence;
* accessibility.

---

## 147. Required V1 Design Decision Table

Include:

| Question                         | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| -------------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| canonical publication command    |             |                     |                    |                     |
| publication semantic owner       |             |                     |                    |                     |
| explicit user authorization      |             |                     |                    |                     |
| Review→Publication conversion    |             |                     |                    |                     |
| Preview dependency               |             |                     |                    |                     |
| authoritative revalidation       |             |                     |                    |                     |
| source fingerprint               |             |                     |                    |                     |
| publication identity             |             |                     |                    |                     |
| duplicate retry semantics        |             |                     |                    |                     |
| republish semantics              |             |                     |                    |                     |
| atomicity                        |             |                     |                    |                     |
| Goal work representation         |             |                     |                    |                     |
| support representation           |             |                     |                    |                     |
| Buffer representation            |             |                     |                    |                     |
| direct Commitment representation |             |                     |                    |                     |
| Work representation              |             |                     |                    |                     |
| cross-boundary behavior          |             |                     |                    |                     |
| Proposal blocker policy          |             |                     |                    |                     |
| accepted-unrealized policy       |             |                     |                    |                     |
| Friction policy                  |             |                     |                    |                     |
| success UX                       |             |                     |                    |                     |
| confirmation UX                  |             |                     |                    |                     |
| history display                  |             |                     |                    |                     |
| schema                           |             |                     |                    |                     |
| backup                           |             |                     |                    |                     |

---

## 148. Required Publication Eligibility Matrix

Include:

| Condition                      | Eligible? | Reason |
| ------------------------------ | --------: | ------ |
| Complete coverage              |           |        |
| Partial coverage               |           |        |
| Unknown coverage               |           |        |
| Preview current + covers       |           |        |
| Preview stale                  |           |        |
| Preview mismatch               |           |        |
| Friction unresolved            |           |        |
| Accepted unrealized            |           |        |
| Actionable Proposal            |           |        |
| Prior publication exists       |           |        |
| Invalid Publication Range      |           |        |
| Source changed after readiness |           |        |

---

## 149. Required Authority Transition Matrix

Include:

| Transition                  | Creates Current Schedule Authority? | Creates Historical Authority? | User Authorization Required? |
| --------------------------- | ----------------------------------: | ----------------------------: | ---------------------------: |
| Generate Preview            |                                  No |                            No |          explicit generation |
| Accept Proposal             |         Accepted resource authority |                            No |                          Yes |
| Realize Accepted Allocation |                                 Yes |                            No | inherited accepted authority |
| Publish Schedule            |            No new current ownership |                           Yes |                      **Yes** |
| Execute                     |       Historical execution evidence |                      separate |               later/explicit |
| Progress                    |               No schedule authority |   historical/outcome evidence |                     separate |

---

## 150. Required Publication Role Matrix

Include:

| Source Role         |             Publish? | Historical Meaning              | Executable Because Published? |
| ------------------- | -------------------: | ------------------------------- | ----------------------------: |
| Work                |   Yes where existing | scheduled external work         |    No new execution semantics |
| Authored Commitment |                  Yes | scheduled commitment            |    No new execution semantics |
| Goal Work           |                  Yes | published Goal-serving schedule |                            No |
| Support             |                  Yes | published operational support   |                            No |
| Buffer              |                  Yes | published protected time        |                        **No** |
| Accepted Unrealized |               **No** | not scheduled                   |                            No |
| Proposal            |               **No** | non-authoritative suggestion    |                            No |
| Friction            | Not as schedule fact | review/corrective state         |                            No |
| Preview             |                   No | materialization source only     |                            No |

---

## 151. Required Failure Matrix

Include:

| Failure             | Historical Writes | Current Schedule Mutation | User Recovery             |
| ------------------- | ----------------: | ------------------------: | ------------------------- |
| invalid range       |                 0 |                         0 | choose valid range        |
| incomplete coverage |                 0 |                         0 | restore planning coverage |
| stale Preview       |                 0 |                         0 | refresh                   |
| Preview mismatch    |                 0 |                         0 | generate correct range    |
| Friction            |                 0 |                         0 | resolve                   |
| accepted unrealized |                 0 |                         0 | resolve realization       |
| source changed      |                 0 |                         0 | refresh/review            |
| persistence failure |             **0** |                         0 | retry                     |
| unexpected error    |                 0 |                         0 | retry/report              |

---

## 152. Required Persistence Matrix

Include:

| Data                 | Owner                      | Durable? | Schema   | Backup |
| -------------------- | -------------------------- | -------: | -------- | ------ |
| Publication Range    | HistoricalPlan/publication |      Yes | existing | V12    |
| Historical snapshots | HistoricalPlan             |      Yes | 11       | V12    |
| readiness            | Review workflow            |       No | —        | No     |
| pending publish      | UI                         |       No | —        | No     |
| confirmation state   | UI                         |       No | —        | No     |
| success message      | UI                         |       No | —        | No     |

---

## 153. Required Invariants

Explicitly verify:

1. publication requires explicit user authorization.
2. publication uses explicit `PublicationRangeV1`.
3. Review Scope is not Publication Range.
4. conversion is explicit.
5. equal geometry does not collapse semantic types.
6. publication does not infer range from viewport.
7. publication does not infer range from selected day.
8. publication does not silently use all loaded data.
9. Preview may be materialization input.
10. Preview is not schedule authority.
11. current fresh covering Preview is required under V1 policy.
12. Preview mismatch is distinct from stale.
13. publication revalidates current truth.
14. rendered readiness is not sufficient command authority.
15. source changes fail closed.
16. planning coverage must be complete.
17. partial coverage cannot publish.
18. unknown coverage cannot publish.
19. no uncovered clipping is allowed.
20. accepted-unrealized blocks publication.
21. realization conflict cannot be skipped.
22. Proposal does not block under 9.6 policy.
23. publication does not implicitly decide Proposal.
24. Friction blocks.
25. publication does not resolve Friction.
26. SuggestedFix remains separate.
27. Goal work publishes with stable lineage.
28. support publishes distinctly.
29. support gains no Demand credit from publication.
30. Buffer publishes as protection.
31. Buffer remains non-executable.
32. direct Commitment retains authored provenance.
33. Work retains existing provenance.
34. cross-boundary source identity remains stable.
35. visible/historical geometry follows existing governed policy.
36. Publication Range metadata does not widen with context.
37. canonical user-day semantics are preserved.
38. overnight facts remain correct.
39. publication records are immutable.
40. prior publication is never rewritten.
41. same-range later republish creates new immutable history when supported.
42. duplicate retry does not accidentally create uncontrolled duplicates.
43. publication operation is atomic.
44. persistence failure creates zero partial historical records.
45. runtime state does not expose partial publication.
46. restart retains published history.
47. current schedule remains independent after publication.
48. schedule edits after publication do not mutate history.
49. history creation alone does not stale Preview.
50. publication does not create ExecutionRecord.
51. publication does not infer Progress.
52. publication does not satisfy Demand.
53. publication does not accept Proposal.
54. publication does not realize accepted authority.
55. publication does not author Commitment.
56. publication does not create Preference.
57. HistoricalPlan remains the semantic owner.
58. no new history owner/store exists.
59. schema remains 11 unless stop condition.
60. Backup remains V12 unless stop condition.
61. HistoricalPlan V1/V2/V3 remain readable.
62. old history is not semantically upgraded by inference.
63. publication timestamp is injected/governed.
64. snapshot ordering is deterministic.
65. source identities are stable.
66. UI labels are not persisted as authority.
67. publication eligibility is centralized.
68. command revalidates independently.
69. disabled Publish explains blockers.
70. ready Publish exposes exact range.
71. pending action prevents duplicate activation.
72. success follows durable confirmation.
73. failure preserves current schedule.
74. failure preserves prior history.
75. stale-on-click produces no history.
76. accessible result state is provided.
77. publication remains inside lazy Review Schedule path.
78. no heavy dependency is introduced.
79. hard bundle limits pass.
80. Planner requery reflects new history.
81. Review Schedule requery reflects new history.
82. no manual UI patch becomes source of truth.
83. prior publication and current readiness remain distinct.
84. already-published does not imply currently ready.
85. currently ready does not imply published.
86. review-ready and publication-ready remain separate concepts.
87. publication action uses publication-ready, not visual guesswork.
88. direct entry remains safe.
89. Planner→Review scope remains coherent.
90. Task 9.6 blocker semantics remain intact.
91. Task 9.5 Planner semantics remain intact.
92. Task 9.4 temporal scope semantics remain intact.
93. Task 9.3 realization semantics remain intact.
94. Proposal/acceptance semantics remain intact.
95. Friction semantics remain intact.
96. DF-006 remains closed.
97. no recurrence is introduced.
98. no execution is introduced.
99. no Progress behavior is introduced.
100. ordinary Phase 9 planning path reaches explicit immutable publication.

---

## 154. Stop / Architecture-Reopen Conditions

Stop and report if:

* current publication cannot be invoked independently of Preview generation;
* publication materially mutates current schedule authority;
* HistoricalPlan cannot represent multiple immutable publications;
* publication records are currently mutable;
* publication cannot be made atomic without a new persistence owner;
* there is no way to revalidate source freshness at command time;
* current HistoricalPlan loses realized Goal/support/Buffer lineage;
* publication range cannot be made explicit without serialized redesign;
* Preview currently owns schedule truth in a way Task 9.4/9.6 assumptions did not reveal;
* accepted-unrealized claims are silently omitted from publication validation;
* schema bump appears necessary;
* Backup bump appears necessary;
* explicit publication causes hard bundle-limit failure that cannot be corrected by import boundaries.

Do not patch around these findings.

---

## 155. Governance

Update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` for durable choices including:

* canonical explicit publication command;
* Preview/materialization dependency;
* command-time revalidation;
* publication multiplicity/idempotency;
* atomic persistence;
* Review→Publication conversion;
* publication UX action;
* publication-history owner boundary.

Do not record incidental styling.

---

## 156. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve cumulative Phase 9 work;
3. preserve unrelated changes;
4. do not clean;
5. do not reset;
6. do not discard previous task work;
7. do not commit;
8. do not push unless explicitly instructed.

Report repository state.

---

## 157. Required RESULT Artifact

Create:

```text
TASK_9.7_EXPLICIT_PUBLICATION_WORKFLOW_V1_RESULT.md
```

Filename must contain **`RESULT`**.

Place it in the dedicated Phase 9 implementation-results folder.

---

## 158. Required RESULT Sections

The RESULT must include at minimum:

1. Executive Result
2. Starting Baseline
3. Governing Foundations
4. Existing Publication Audit
5. Scope Delivered
6. Explicit Non-Goals
7. Publication Product Role
8. Epistemic Boundary
9. User Authorization
10. Canonical Publication Command
11. Command Input
12. Publication Range
13. Review→Publication Conversion
14. Range Confirmation
15. Current Publication Architecture
16. Preview Dependency
17. Required Preview State
18. Silent Preview Generation Decision
19. Authoritative Revalidation
20. TOCTOU Protection
21. Source Fingerprint
22. Command Result
23. Publication Multiplicity
24. Duplicate Invocation Semantics
25. Publication Identity
26. Publication Timestamp
27. HistoricalPlan Immutability
28. Current Schedule Independence
29. Snapshot Content
30. Goal Work Snapshot
31. Support Snapshot
32. Buffer Snapshot
33. Direct Commitment Snapshot
34. Work Snapshot
35. Cross-Boundary Facts
36. Publication Range Boundary
37. Canonical User-Day
38. Overnight Handling
39. Boundary Context
40. Publication Coverage
41. Unknown-vs-Empty
42. Accepted-Unrealized Policy
43. Realization Conflict
44. Friction Policy
45. Proposal Policy
46. Review Readiness Reuse
47. Publication Readiness Reuse
48. Publish Action Placement
49. Disabled Publish
50. Ready Publish
51. Confirmation UX
52. Confirmation Meaning
53. Pending State
54. Success State
55. Failure State
56. Stale-on-Click
57. Atomicity
58. Partial Failure
59. Transaction Boundary
60. In-Memory Atomicity
61. Restart Behavior
62. Backup Decision
63. Schema Decision
64. HistoricalPlan Version
65. Publication Event Metadata
66. Multiple Publications
67. Latest Publication
68. Historical Comparison Boundary
69. Publication List
70. Planner Integration
71. Review Schedule Integration
72. Preview After Publication
73. Readiness After Publication
74. Schedule Change After Publication
75. Execution Boundary
76. Progress Boundary
77. Acceptance Boundary
78. Realization Boundary
79. Friction Boundary
80. Authoring Boundary
81. Preference Boundary
82. User-Facing Language
83. Historical Language
84. Success Copy
85. Republish Language
86. Action Accessibility
87. Range Accessibility
88. Live Success
89. Error Accessibility
90. Confirmation Accessibility
91. Color Boundary
92. Loading State
93. Query Failure
94. Command Error
95. Action Eligibility
96. Domain Validation
97. Publication Reason Codes
98. Proposal Pending Policy
99. Determinism
100. Stable Snapshot Ordering
101. Stable Subject Identity
102. Serialization
103. Publication Provenance
104. Publication Range Provenance
105. Legacy Readers
106. Legacy History
107. History Queries
108. Performance
109. Query Count
110. Lazy UI
111. Bundle Review
112. Range Conversion Tests
113. Eligibility Tests
114. Successful Publication Tests
115. Atomicity Tests
116. Retry Tests
117. Republish Tests
118. Goal Work Tests
119. Support Tests
120. Buffer Tests
121. Commitment Tests
122. Work Tests
123. Cross-Boundary Tests
124. History Tests
125. Review Schedule UI Tests
126. Proposal Policy Tests
127. Accepted Authority Tests
128. Friction Tests
129. Preview Tests
130. Execution/Progress Isolation Tests
131. Persistence Tests
132. Accessibility Tests
133. Review Schedule Regression
134. Planner/Month Regression
135. Preview Regression
136. Proposal Regression
137. Acceptance Regression
138. Realization Regression
139. Friction Regression
140. HistoricalPlan Regression
141. Canonical User-Day Regression
142. Full Regression
143. Validation Commands
144. V1 Design Decision Table
145. Publication Eligibility Matrix
146. Authority Transition Matrix
147. Publication Role Matrix
148. Failure Matrix
149. Persistence Matrix
150. Invariant Verification
151. Deviations
152. Governance Updates
153. Repository Status
154. Ordinary Path Assessment
155. Dogfood Publication Assessment
156. Remaining Phase 9 Gaps
157. Recommended Next Task
158. Completion Statement

---

## 159. Ordinary Path Assessment

The RESULT must explicitly answer:

> **Can a user now complete the ordinary constructive planning path from Goal/Demand planning through Proposal, acceptance, Realization, Planner inspection, Review Schedule readiness, and an explicit bounded publication action that creates immutable HistoricalPlan evidence?**

Expected:

> **Yes.**

If not, identify the exact remaining ordinary-path blocker.

---

## 160. Dogfood Publication Assessment

The RESULT must answer:

> **Can a dogfood user understand the exact range being published, why publication is currently allowed or blocked, explicitly authorize publication, receive a durable success/failure result, and later distinguish the historical publication from the current editable schedule?**

Expected:

> **Yes.**

---

## 161. Remaining Phase 9 Gaps

The RESULT must identify remaining gaps after publication.

Expected categories may include:

* typed realization-conflict recovery/retry;
* Review/Planner polish;
* history inspection polish;
* any remaining direct product access gaps revealed through dogfood.

Do not manufacture additional architecture work.

---

## 162. Recommended Next Task

If the ordinary path is now complete, inspect actual product behavior before assuming another implementation feature.

Preferred decision point:

### Option A — if dogfood path is fully reachable

> **Phase 9 Dogfood Pass 02 / Publication Checkpoint**

### Option B — if accepted-realization conflict recovery is the only meaningful product blocker

> **Task 9.8 — Realization Conflict Recovery and Retry Eligibility V1**

Choose based on evidence from Task 9.7.

---

## 163. Final Completion Statement

The RESULT must end with a completion statement materially equivalent to:

> **Task 9.7 — Explicit Publication Workflow V1 complete.**
>
> DayFrame now completes the ordinary constructive Phase 9 planning path with an explicit bounded publication transition from reviewed current schedule truth into immutable HistoricalPlan evidence: Review Schedule converts its non-authoritative `ReviewScopeV1` into a separately typed and validated `PublicationRangeV1`, exposes publication only when the existing derived publication-readiness policy is satisfied, clearly identifies the exact user-day range being published, and invokes one canonical publication command rather than treating Preview generation, screen visibility, or historical coverage as implicit authorization; the publication command independently revalidates authoritative current state at invocation time, fails closed when planning coverage is incomplete or unknown, Preview is missing, stale, or does not cover the range, unresolved Friction exists, accepted-but-unrealized authority intersects the publication range, the range is invalid, or the reviewed source changed before publication, while actionable non-authoritative Proposals remain warnings rather than mandatory blockers according to the Task 9.6 policy; Preview remains a required V1 materialization input where existing publication architecture requires it but never becomes schedule authority, adjacent generation context never widens immutable publication scope, and canonical user-day, overnight, cross-boundary, and exact range semantics remain governed by the Task 9.4 contract; publication atomically preserves the existing HistoricalPlan representations of Work, authored Commitments, realized Goal work, operational support, and Buffer protection together with stable identity and realized/accepted provenance, creates no partial history on persistence failure, does not mutate prior publications or current schedule authority, and permits later publication of changed current truth as another immutable historical event according to the documented multiplicity/idempotency policy; publication creates no ProposalDecision, Accepted Allocation, Realization, Commitment, ExecutionRecord, Progress, Demand satisfaction, reusable Preference, Friction suppression, or other authority outside HistoricalPlan; successful publication is followed by canonical re-query so Review Schedule and Planner expose the new historical evidence without manual UI-owned truth, while current readiness and prior publication remain separate concepts and subsequent schedule edits cannot retroactively alter published history; schema 11, Backup V12, HistoricalPlan V1/V2/V3 compatibility, Proposal/acceptance/Realization, Friction/SuggestedFix, Preview, Planner/Month, Review Schedule, canonical user-day, DF-006, accessibility, lazy loading, bundle governance, deterministic persistence, and full regression behavior remain intact; the ordinary DayFrame path is now product-reachable from authored planning truth through constructive recommendation, explicit user acceptance, durable schedule realization, Planner inspection, bounded review, corrective action, and explicit immutable publication without collapsing current schedule truth, proposed action, accepted authority, derived Preview, historical evidence, execution, or Progress.
