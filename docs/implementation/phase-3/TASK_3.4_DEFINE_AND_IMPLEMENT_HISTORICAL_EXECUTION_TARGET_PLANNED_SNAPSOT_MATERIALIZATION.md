# Task 3.4 — Define and Implement Historical Execution Target / Planned Snapshot Materialization

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded planning-to-history bridge implementation task.

Task 3.4 defines and implements the pure/application-level materialization boundary that converts a reportable planned occurrence into the exact historical input required by `ExecutionRecord V1`.

This task includes:

* `HistoricalExecutionTarget` or equivalent semantic report-target type;
* lifetime-safe planned occurrence reference construction;
* frozen historical snapshot materialization;
* scheduled occurrence materialization;
* unplaced occurrence materialization;
* omitted occurrence materialization;
* blocked occurrence materialization;
* manual-event materialization where valid;
* work-occurrence materialization where valid;
* template-occurrence materialization;
* current-Preview materialization;
* reportability evaluation;
* no-Preview/historical materialization where evidence is sufficient;
* user-day/timezone/offset capture;
* strict separation between planned context and actual execution evidence;
* deterministic pure helpers;
* direct regression coverage.

It does **not** implement:

* Complete / Partial / Skip UI;
* automatic execution reporting;
* history browsing;
* correction UI;
* progress;
* adherence;
* learning;
* timers;
* integrations;
* Backup V3;
* imported-calendar execution linkage;
* cancellation;
* quantity-based execution metrics.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 3.1–3.3 are complete and accepted;
6. review:

   * `ExecutionRecord V1`;
   * `ExecutionHistory V1`;
   * `DurableOccurrenceReference V1`;
   * Preview generation/replay result types;
   * current work/manual/template occurrence structures;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.4_DEFINE_AND_IMPLEMENT_HISTORICAL_EXECUTION_TARGET_PLANNED_SNAPSHOT_MATERIALIZATION_RESULT.md`

If a safe historical target cannot be materialized without persisting old Preview snapshots or changing DurableOccurrenceReference V1, stop and report rather than broadening scope.

---

# 2. Purpose

Task 3.2 established that a planned execution record requires:

```text
ExecutionSubjectId
+
DurableOccurrenceReference
+
frozen historical snapshot
+
execution assertion
```

Task 3.3 established durable history authority.

What remains missing is the bridge:

```text
current or defensibly reconstructable planned occurrence
        ↓
HistoricalExecutionTarget
        ↓
DurableOccurrenceReference
+
frozen ExecutionRecord snapshot
```

The report UI planned for a later task must not invent that snapshot itself.

---

# 3. Governing Epistemic Rule

The materializer may describe:

> what DayFrame planned or knew about the occurrence.

It may not describe:

> what actually happened.

Therefore it may produce:

* planned date;
* planned start/end;
* planned duration;
* planned state;
* source title/category;
* source family;
* user-day context;
* DurableOccurrenceReference.

It must not produce:

* actual start;
* actual end;
* actual duration;
* completed;
* partial;
* skipped;
* missed.

Those belong to execution authority.

---

# 4. Architectural Objective

After Task 3.4:

```text
Generated / reconstructable occurrence
        ↓
reportability evaluation
        ↓
HistoricalExecutionTarget
        ├─ planned DurableOccurrenceReference
        └─ frozen ExecutionHistoricalSnapshot
                ↓
future reporting workflow
                ↓
ExecutionHistory.recordExecution(...)
```

The historical target is transient application/domain input.

It is not itself a new durable surface.

---

# 5. Required Initial Audit

Before coding, trace how current production code represents:

* generated scheduled template blocks;
* fixed template blocks;
* flexible template candidates;
* unplaced candidates;
* omitted occurrences under PlanDecision replay;
* blocked exact-placement decisions;
* work occurrences;
* manual calendar events;
* Preview clipping/window boundaries;
* source lineage;
* user-day date;
* source title/category;
* planned interval;
* current effective day boundary;
* UTC/local time conversion;
* DurableOccurrenceReference construction.

Document which occurrence families already carry sufficient lineage and which require narrowly derived materialization metadata.

---

# 6. Do Not Persist Preview

Task 3.4 must not solve history by saving old `Preview` objects.

The governing rule is:

> Materialize the minimum historical context required for an ExecutionRecord, not a copy of the current scheduling engine output.

---

# 7. Historical Execution Target Type

Introduce a pure semantic type such as:

```ts
type HistoricalExecutionTarget = {
  reference: DurableOccurrenceReferenceV1;
  snapshot: ExecutionHistoricalSnapshotV1;
};
```

or equivalent.

Use the snapshot type already defined by `ExecutionRecord V1`.

Do not create a second competing snapshot schema.

---

# 8. Target Is Not Execution Authority

`HistoricalExecutionTarget` says:

> this is the planned subject/context about which an execution report may be made.

It does not say:

> the activity occurred.

No outcome field.

---

# 9. Target Is Not Durable History

Do not persist the target independently.

Once execution is recorded, the `ExecutionRecord` owns its cloned reference and snapshot.

---

# 10. Materialization Result Union

Use an explicit pure result.

Suggested conceptual outcomes:

```text
materialized
notReportable
sourceMissing
lifetimeMismatch
occurrenceMissing
outsideEvidenceBoundary
unsupportedFamily
insufficientHistoricalContext
invalidInput
```

Exact naming may follow repository conventions.

Do not throw for expected inability to materialize.

---

# 11. Reportability Definition

A planned occurrence is reportable when DayFrame can establish:

1. a stable semantic planned occurrence;
2. a valid DurableOccurrenceReference;
3. enough historical context to freeze the ExecutionRecord snapshot;
4. a supported execution family.

Reportability does **not** require:

* scheduled placement;
* fresh placement success;
* PlanDecision application;
* current completion status.

---

# 12. Supported Planned Families

Audit and implement where evidence supports:

* template;
* work;
* manual event.

Imported-calendar linkage remains deferred unless DurableOccurrenceReference V1 already supports it.

Do not invent a durable imported-calendar identity.

---

# 13. Template Materialization

Template occurrences should support historical materialization from their semantic recurrence identity.

This includes:

* flexible scheduled occurrence;
* fixed scheduled occurrence;
* unplaced occurrence;
* omitted occurrence;
* blocked occurrence.

The same semantic occurrence must materialize the same DurableOccurrenceReference regardless of current placement outcome.

---

# 14. Work Materialization

Work occurrence materialization must use existing work DurableOccurrenceReference semantics.

Snapshot should preserve the effective historical work occurrence context.

Do not treat work schedule presence as proof the user worked it.

---

# 15. Manual Event Materialization

Manual event occurrences may be reportable as planned commitments.

Use manual-event lifetime-safe reference semantics.

Calendar presence remains planning context only.

---

# 16. Imported Calendar

If current Preview vocabulary includes imported calendar items but DurableOccurrenceReference does not support them:

return:

`unsupportedFamily`

or equivalent.

Do not create ad hoc identity.

---

# 17. Scheduled Occurrence

For a normally scheduled occurrence, materialize:

* reference;
* family;
* title;
* category;
* user-day context;
* plan state `scheduled`;
* exact planned start/end;
* historical UTC offset;
* effective day boundary.

---

# 18. Planned Interval Source

Use actual derived scheduled placement from the current authoritative fresh Preview when materializing a currently scheduled occurrence.

Do not recompute an alternative placement independently if the fresh Preview already establishes the effective plan.

---

# 19. Fresh Preview Requirement For Scheduled Placement

If materializing a **current scheduled interval** from Preview:

* Preview must be fresh.

A stale Preview must not freeze old placement as current historical plan context.

---

# 20. Stale Preview

If Preview is stale:

* do not materialize scheduled placement from stale block geometry;
* determine whether the semantic occurrence can still be materialized as unscheduled/no-current-placement from authoritative occurrence semantics.

Do not silently use old placement.

---

# 21. No Preview

A current Preview must not be mandatory for every reportable occurrence.

Task 3.1 explicitly allows retroactive reporting where a canonical occurrence plus defensible historical context exists.

Task 3.4 must determine the safe no-Preview boundary.

---

# 22. No-Preview Materialization Principle

Without a current fresh Preview, DayFrame may materialize a planned target only if the historical context can be reconstructed authoritatively from:

* source lifetime;
* canonical occurrence coordinate;
* authored source data;
* accepted PlanDecision authority where still applicable;
* stable time/user-day semantics.

Do not guess prior heuristic placement.

---

# 23. Heuristic Placement Is Not Reconstructable History

If a flexible occurrence had previously been heuristically scheduled at 18:30 but no immutable historical plan snapshot exists:

> DayFrame cannot later claim that 18:30 was the historical planned time merely by rerunning today's scheduler.

This distinction is mandatory.

---

# 24. Current Plan Versus Historical Plan

Task 3.4 must distinguish:

## Current report target

Materialized from the current fresh Preview/authority.

## Historical report target

Materialized later, after the original current Preview may no longer exist.

The latter has stricter evidence limits.

---

# 25. Retroactive Reporting Boundary

For retroactive reporting without preserved historical schedule geometry:

DayFrame may still materialize:

* semantic planned occurrence;
* title/category;
* user-day coordinate;
* plan state indicating no defensible frozen scheduled interval;

if that is truthful.

Do not fabricate the lost interval.

---

# 26. Historical Plan State Vocabulary

Reuse Task 3.2 snapshot plan states:

* `scheduled`;
* `unplaced`;
* `omitted`;
* `blocked`;
* `unplanned`.

Do not add `missed`.

---

# 27. `scheduled`

Use only when DayFrame has authoritative evidence of a concrete planned interval at materialization time.

---

# 28. `unplaced`

Use when:

* semantic occurrence existed;
* scheduler failed to place it;
* no concrete scheduled interval exists.

The user may still report completed or partial later.

---

# 29. `omitted`

Use when:

* semantic occurrence existed;
* an applicable `omitOccurrence` PlanDecision intentionally suppressed it.

No planned interval.

---

# 30. `blocked`

Use when:

* a hard accepted placement decision targeted the occurrence;
* replay result was blocked;
* exact requested placement could not be realized.

Determine whether the snapshot should contain the **requested** accepted placement.

Preferred:

> preserve blocked plan state and, if the existing snapshot schema permits only actual scheduled interval, do not mislabel requested-but-unrealized time as scheduled start/end.

If useful requested-plan context has no field, document rather than changing ExecutionRecord V1 without authorization.

---

# 31. Blocked Placement Context

Audit whether Task 3.2 snapshot can truthfully preserve enough blocked context.

If not, decide whether:

* blocked state alone is sufficient for V1;
* or a narrow compatible optional field is required.

If changing the accepted ExecutionRecord schema is required, stop and recommend Task 3.2A rather than silently modifying it.

---

# 32. Omitted Context

Likewise, do not store a fictional scheduled interval for an omitted occurrence.

---

# 33. Unplaced Context

No fictional interval.

---

# 34. Fixed Template

A fixed template that has a concrete authored time may materialize scheduled context from authoritative authored semantics if no fresh Preview is needed to establish the interval.

Audit carefully.

---

# 35. Work Context

Work blocks are generally anchored.

Determine whether historical interval may be reconstructed directly from shift occurrence semantics independent of Preview.

If yes, allow.

---

# 36. Manual Event Context

Manual events are authored fixed calendar commitments.

Historical interval may be reconstructable from the manual event itself if lifetime/occurrence identity remains exact.

Audit.

---

# 37. Flexible Template Without Fresh Preview

Do not claim a heuristic scheduled interval.

At most materialize semantic occurrence plus no-defensible-current-placement context if that representation remains truthful.

---

# 38. Accepted `placeOccurrence`

A durable accepted exact placement is stronger than ordinary heuristic placement.

If the target still resolves and the decision remains current/applicable:

* the requested accepted user-day/time is authoritative planning intent.

Determine whether this is sufficient to reconstruct scheduled historical plan context without a Preview.

But distinguish:

* requested placement;
* successfully replayed placement.

If replay feasibility at that historical moment is unknown, do not claim it actually became scheduled.

---

# 39. Accepted Duration

If current applicable `setOccurrenceDuration` decision exists:

* snapshot planned duration should reflect the effective accepted duration when the plan context can be established.

Do not alter authored source.

---

# 40. Accepted Priority

Priority affects scheduling but is not currently part of ExecutionRecord historical snapshot.

Do not add it unless checkpoint requires it.

Execution history records activity outcome, not every planning parameter.

---

# 41. Accepted Omission

If current applicable omission exists:

plan state:

`omitted`.

---

# 42. Current PlanDecision Only

Do not reconstruct superseded or removed PlanDecision history.

Phase 2 does not retain old PlanDecision history.

Therefore retroactive materialization cannot claim historical accepted intent that is no longer available.

Document this limitation.

---

# 43. Historical Evidence Limitation

This is important:

> DayFrame currently has durable execution history but not durable historical plan snapshots independent of execution records.

Therefore the first execution report is the moment at which historical plan context becomes frozen.

Before that report, some transient heuristic plan details may be unrecoverable later.

Task 3.4 must state this explicitly.

---

# 44. Materialize At Report Time

Preferred architecture:

> When the user reports execution, materialize the best defensible current/historical plan context immediately and embed it in the immutable ExecutionRecord assertion.

No separate plan-history persistence is introduced.

---

# 45. Durable Reference Construction

Reuse canonical DurableOccurrenceReference constructors/helpers.

Do not construct by runtime ID.

---

# 46. Runtime ID Boundary

Runtime IDs may locate current Preview objects.

Once located, materialization must use semantic source lineage.

No runtime ID appears in target/snapshot.

---

# 47. Canonical Occurrence Coordinate

Use existing semantics for:

* template daily/weekly/N-per-week;
* work local start date + slot;
* manual event coordinate.

No Preview index.

---

# 48. Durable Reference Validation

Every materialized reference must validate structurally before returning success.

---

# 49. Lifetime Resolution

When materializing from current authoritative state:

* source must still be the same incarnation.

If source ID exists with different incarnation:

return `lifetimeMismatch`.

Do not retarget.

---

# 50. Source Missing

Return explicit sourceMissing.

Do not silently use same-title source.

---

# 51. Occurrence Missing

If exact lifetime remains but canonical occurrence no longer exists:

return occurrenceMissing.

---

# 52. Materializing Existing Historical Reference

For a future correction to an existing ExecutionRecord:

Task 3.4 should **not rematerialize** the target from current planning state.

Corrections use the existing historical subject/snapshot contract.

This task is for first-report materialization.

---

# 53. Snapshot Title

Use the title belonging to the exact source lifetime at materialization.

Clone it into snapshot.

---

# 54. Snapshot Category

Use current exact source category/type at materialization.

No later dynamic lookup.

---

# 55. Source Family

Must match DurableOccurrenceReference family.

---

# 56. Historical User-Day Date

Capture the occurrence's effective semantic user-day coordinate.

Use reference semantics where possible.

---

# 57. Effective Day Boundary

Capture the exact effective day boundary governing that user day at materialization.

This prevents later preference changes from rewriting historical grouping.

---

# 58. UTC Offset

Capture the effective numeric UTC offset appropriate to the planned historical context.

Use current established date/time infrastructure.

Do not assume the present-day offset for a historical date if DST differs.

---

# 59. Offset Source

Use an actual timestamp/date contextual conversion, not a fixed “current offset.”

Direct test around differing historical offsets if current environment/helper permits deterministic testing.

---

# 60. IANA Zone

Do not add new mandatory IANA-zone infrastructure.

Task 3.2 intentionally deferred it.

---

# 61. Scheduled Start/End

For `scheduled` snapshot:

* canonical UTC;
* end after start;
* derived from effective planned block.

Do not store local-only times in interval fields.

---

# 62. Scheduled Duration

Snapshot schema may derive duration from start/end rather than store separately.

Use existing ExecutionRecord V1 contract exactly.

---

# 63. Unplaced Snapshot

Requirements:

* valid family;
* title/category;
* user-day;
* boundary;
* offset;
* plan state `unplaced`;
* no start/end.

---

# 64. Omitted Snapshot

Same except `omitted`.

---

# 65. Blocked Snapshot

Same except `blocked`.

No scheduled interval unless an actual scheduled block existed separately.

---

# 66. Work Snapshot

Confirm:

* family `work`;
* title;
* category;
* user-day;
* boundary;
* offset;
* scheduled interval if anchored occurrence exists.

---

# 67. Manual Event Snapshot

Confirm:

* family `manualEvent`;
* authored event title/category;
* effective user-day;
* boundary;
* offset;
* authored planned interval.

---

# 68. Template Snapshot

Confirm family `template`.

---

# 69. Unplanned Execution

Task 3.4 primarily handles planned targets.

Do not materialize an unplanned target from Preview.

Unplanned snapshots will be created by the later reporting workflow directly from explicit user input.

---

# 70. Materializer API

Prefer one high-level pure/application function.

Conceptual:

```ts
materializeHistoricalExecutionTarget({
  occurrence,
  authoredState,
  planDecisions,
  preview,
  preferences
})
```

But avoid passing giant state blobs if narrower inputs suffice.

---

# 71. Family-Specific Helpers

If clearer, implement:

* template materializer;
* work materializer;
* manual-event materializer;

behind one public API.

---

# 72. Store Dependency

Core materializer should not query the store directly.

Inputs must be explicit.

Store/application orchestration may assemble inputs.

---

# 73. Current Preview Materializer

Provide a helper for current Preview occurrence selection.

It may accept:

* scheduled block;
* unplaced candidate;
* replay result where omission/blocked context is needed.

Do not put React concerns into it.

---

# 74. Omitted Occurrence Discovery

Because omitted occurrences do not appear as scheduled/unplaced blocks, materialization may need to correlate:

* PlanDecision;
* replay result;
* DurableOccurrenceReference;
* source occurrence.

Audit the narrowest reliable path.

---

# 75. Blocked Occurrence Discovery

Blocked exact-placement occurrence may appear unplaced plus replay result.

Use both semantic occurrence lineage and replay status.

---

# 76. Fresh Replay Result

If using `planDecisionResults` to establish omitted/blocked state:

* Preview must be fresh.

Do not freeze stale replay status.

---

# 77. Unplaced Discovery

Use the actual `unplacedCandidates` output from fresh Preview where available.

---

# 78. Scheduled Discovery

Use actual scheduled output.

---

# 79. One Occurrence, One Materialization

The same semantic current occurrence should not materialize two different target references depending on which UI surface calls it.

Direct equality tests required.

---

# 80. Scheduled Versus Unplaced State

The reference remains equal.

Only frozen historical snapshot plan state differs.

---

# 81. Plan State Is Historical Context

Do not use snapshot plan state as durable occurrence identity.

---

# 82. Existing Execution Subject Check

Task 3.4 may optionally accept current ExecutionHistory to determine:

`alreadyReported`.

But this is store authority, not target validity.

Preferred:

> leave duplicate enforcement to ExecutionHistory `recordExecution`.

Do not couple materialization to history collection.

---

# 83. Reportable Scheduled Block Types

Audit all scheduled block `source`/family variants.

Do not assume every `ScheduledBlock` is reportable.

Produce an explicit matrix.

---

# 84. Reportability Matrix

At minimum:

| Preview/source family | Reportable? | Reference family | Snapshot state |
| --------------------- | ----------: | ---------------- | -------------- |

Cover:

* flexible template scheduled;
* fixed template scheduled;
* work;
* manual event;
* imported calendar if present;
* synthetic/derived blocks if any;
* unplaced template;
* omitted template;
* blocked template.

---

# 85. Synthetic Blocks

If current Preview contains synthetic/non-authored blocks without DurableOccurrenceReference lineage:

not reportable.

Do not invent historical subjects.

---

# 86. Friction

Friction alone is not a report target.

A friction point may help locate an occurrence but cannot define historical identity.

---

# 87. SuggestedFix

Same.

Do not materialize from SuggestedFix ID/payload.

---

# 88. Try Preview

Task 3.1 identified an important Try boundary.

Determine materialization behavior when current visible Preview is a temporary Try revision.

Preferred:

> do not freeze Try-only revised placement as authoritative historical plan context unless the Try was explicitly accepted.

This is mandatory unless current architecture distinguishes Try Preview lineage differently.

---

# 89. Try-Only Placement

If user reports execution while viewing a Try result:

* execution reporting must not accidentally turn the temporary experiment into historical “planned” authority.

Return/report materialization from the underlying authoritative fresh Preview or mark insufficient current authoritative plan context.

Do not use Try geometry blindly.

---

# 90. Accepted Try

After Accept/regeneration, PlanDecision-backed fresh Preview is authoritative planned context and can materialize normally.

---

# 91. Preview Revision Audit

Trace current revised Preview representation.

Determine whether Task 3.4 can distinguish:

* canonical regenerated Preview;
* Try-revised Preview.

If not, stop and identify a prerequisite because historical materialization must not confuse them.

---

# 92. Preview Freshness And Try State

Freshness alone may not distinguish Try.

Audit explicitly.

---

# 93. Report Target From Day Details

No UI yet, but future day-detail reporting may use the materializer.

Keep API suitable for a selected semantic occurrence rather than requiring friction context.

---

# 94. Retroactive Day Target

Provide or define a pure path capable of materializing a known canonical occurrence for a past date without requiring that the date is currently visible.

This may call existing recurrence/work/manual expansion logic.

---

# 95. No Arbitrary Unbounded Expansion

Do not scan all history.

Given a specific target date/reference, reconstruct only the required semantic occurrence.

---

# 96. Past Source Still Exists

If source lifetime remains and occurrence exists canonically, materialization may succeed.

---

# 97. Past Source Deleted

Without an existing ExecutionRecord snapshot or separate plan history:

new first-report materialization may no longer have enough historical source context.

Return:

`sourceMissing` / `insufficientHistoricalContext`.

Do not fabricate title/category.

This is an unavoidable current limitation.

---

# 98. Past Source Recreated

Lifetime mismatch.

No retargeting.

---

# 99. Source Updated, Same Lifetime

Current title/category may differ from what they were historically.

This exposes another important limitation.

For a first report long after an ordinary same-lifetime update:

DayFrame may no longer know the historical title/category at occurrence time.

Determine policy.

---

# 100. Historical Source Mutation Problem

Because Phase 2 ordinary updates preserve incarnation, a current source may be the same lifetime but have changed mutable fields.

Therefore:

> lifetime identity proves source continuity, not historical field values.

Task 3.4 must not pretend current title/duration/preferences were necessarily the same months ago.

---

# 101. Current-Time Materialization Safe Boundary

For current/recent reporting from a fresh Preview, current derived snapshot is defensible.

For retroactive first reporting after source mutation, historical field reconstruction may be uncertain.

Define a bounded rule.

Preferred:

> Task 3.4 guarantees exact materialization from the current fresh authoritative plan. Retroactive materialization outside preserved plan evidence is supported only for fields that are canonically reconstructable; otherwise return insufficientHistoricalContext.

---

# 102. No Hidden Historical Plan Claims

This limitation should be explicit rather than papered over.

---

# 103. Future Plan History

A future task may persist planned-occurrence snapshots at execution-report time only, or eventually maintain plan history.

Do not introduce plan history now.

---

# 104. Snapshot Materialization Timestamp

Do not add `materializedAt` to the ExecutionRecord snapshot unless Task 3.2 schema has it.

`recordedAt` will capture when the execution record is accepted.

---

# 105. Actual-Time Separation

Materializer outputs no `actualTime`.

The future reporting workflow combines:

```text
HistoricalExecutionTarget
+
user execution assertion
```

into `recordExecution`.

---

# 106. Outcome Separation

No completed/partial/skipped field.

---

# 107. Note Separation

No note.

---

# 108. Provenance Separation

No provenance.

ExecutionHistory constructor owns V1 provenance.

---

# 109. Identity Allocation

Materialization allocates:

* no ExecutionSubjectId;
* no ExecutionRecordId;
* no SourceIncarnationId.

It only constructs/validates durable reference and snapshot.

---

# 110. Determinism

Same authoritative planning inputs must materialize structurally equivalent target.

No current clock dependency except temporal conversion helpers where date/offset is explicit.

---

# 111. Input Order Independence

PlanDecision collection/storage order must not alter materialized target.

---

# 112. PlanDecision Selection

Because one current decision exists per target, use canonical target equality.

Do not rely on array order.

---

# 113. Replay Result Correlation

Use PlanDecisionId/target as appropriate.

No index matching.

---

# 114. Source Clone Isolation

Materialized snapshot clones strings/plain values.

No mutable authored references.

---

# 115. Durable Reference Clone Isolation

Return independent reference object.

---

# 116. Preview Clone Isolation

Materialization does not mutate Preview.

---

# 117. Authored-State Purity

No mutation.

---

# 118. PlanDecision Purity

No mutation.

---

# 119. ExecutionHistory Purity

No write.

---

# 120. JSON Safety

Historical target should be plain data compatible with ExecutionRecord input.

No `Date` objects.

---

# 121. Validation Reuse

Before returning materialized target:

* validate DurableOccurrenceReference;
* validate snapshot through ExecutionRecord domain helpers if exposed.

Prefer reusing Task 3.2 validation rather than duplicating snapshot validation.

---

# 122. Snapshot Validation API

If Task 3.2 does not expose standalone snapshot validation:

a narrow export/refactor is authorized if behavior does not change.

Do not weaken record validation.

---

# 123. Snapshot Constructor Helper

A pure snapshot constructor may be added to execution domain if appropriate.

No persistence.

---

# 124. UTC Conversion

Use existing date/time helper behavior.

No custom timezone arithmetic if repository already has canonical conversion utilities.

---

# 125. Overnight Planned Interval

Historical snapshot must preserve actual UTC start/end even when local end crosses midnight.

Direct test.

---

# 126. User-Day Boundary Crossing

Occurrence may belong to one user-day while calendar start is next/previous date.

Capture:

* correct user-day date;
* correct UTC interval.

Direct test.

---

# 127. Work Overnight

Direct coverage.

---

# 128. Manual Overnight Event

If supported by authored model, direct coverage.

---

# 129. Template Overnight

If duration can cross midnight, direct coverage.

---

# 130. DST/Offset

Test offset capture where deterministic infrastructure allows.

If environment-dependent, isolate conversion helper and inject/test explicit dates/offsets.

Do not skip validation of offset bounds.

---

# 131. Weekly Occurrence

Materialized reference remains canonical across overlapping Preview windows.

Snapshot current plan interval may differ only if actual authoritative plan differs.

---

# 132. N-Per-Week

Use canonical slot identity.

Do not bind to Preview order.

---

# 133. Manual Event Move

Manual event lifetime persists across authored move under Phase 2 semantics.

For current materialization:

* reference remains same semantic manual event occurrence;
* snapshot reflects current authoritative planned interval.

Historical first-report after earlier move cannot reconstruct old interval unless preserved elsewhere.

Document.

---

# 134. Work Source Update

Same historical-mutation caution.

---

# 135. Title Update

Do not pretend current title was historical if materializing retroactively without preserved plan evidence.

---

# 136. Category Update

Same.

---

# 137. Current Fresh Preview Snapshot Authority

For a fresh current Preview, the snapshot represents:

> current effective plan context at the moment of reporting.

That is sufficient for new history reporting.

This should be the core supported V1 path.

---

# 138. Historical Reporting UX Future

Task 3.5 may initially limit reporting to occurrences with safe materializable targets.

Do not force 3.4 to solve arbitrary years-old unmaterialized plans.

---

# 139. Reporting Window Policy

Task 3.4 may recommend that first reporting V1 be limited to:

* current Preview occurrences;
* explicitly reconstructable fixed/work/manual occurrences;

until richer plan-history support exists.

Document but do not implement UI restriction.

---

# 140. Materialization Error Codes

Provide structured codes suitable for future UX:

* stalePreview;
* tryOnlyPreview;
* unsupportedFamily;
* sourceMissing;
* lifetimeMismatch;
* occurrenceMissing;
* insufficientHistoricalContext;
* invalidSnapshot;
* invalidReference.

No UI strings in core.

---

# 141. `stalePreview`

Use when requested snapshot depends on stale Preview placement.

---

# 142. `tryOnlyPreview`

Use if temporary revised Preview cannot safely represent accepted plan.

---

# 143. `insufficientHistoricalContext`

Use instead of guessing lost historical field/placement data.

---

# 144. Current Scheduled Template Test

Materializes scheduled target.

---

# 145. Fixed Template Test

Materializes correct reference/snapshot.

---

# 146. Unplaced Template Test

Plan state unplaced, no interval.

---

# 147. Omitted Template Test

Plan state omitted, no interval.

---

# 148. Blocked Template Test

Plan state blocked.

No false scheduled interval.

---

# 149. Work Test

Correct family/reference/snapshot.

---

# 150. Manual Event Test

Correct.

---

# 151. Imported Calendar Rejection Test

Required if family exists.

---

# 152. Runtime ID Independence Test

Equivalent semantic occurrence with changed runtime ID materializes same reference/snapshot.

---

# 153. Fresh Preview Requirement Test

Scheduled placement from stale Preview rejected.

---

# 154. Try Preview Test

Temporary Try placement not materialized as authoritative plan.

---

# 155. Accepted/Replayed Preview Test

After authoritative regenerated placement, materialization succeeds.

---

# 156. PlanDecision Omission Test

Current applied omit → omitted snapshot.

---

# 157. PlanDecision Blocked Placement Test

Blocked status preserved.

---

# 158. Duration Decision Test

Current fresh scheduled target snapshot interval reflects replayed effective duration.

---

# 159. Priority Decision Test

No inappropriate priority field added.

---

# 160. Source Missing Test

No retarget.

---

# 161. Lifetime Mismatch Test

No retarget.

---

# 162. Occurrence Missing Test

Explicit.

---

# 163. Deleted Past Source Test

Retroactive first materialization fails safely rather than fabricating snapshot.

---

# 164. Same-Lifetime Mutated Source Test

Demonstrate/document bounded historical-context behavior.

Do not claim exact past mutable fields without evidence.

---

# 165. Profile Activation Test

Old reference does not materialize against fresh profile lifetime.

---

# 166. Backup V1 Test

Fresh lifetime mismatch.

---

# 167. Backup V2 Test

Exact lifetime may materialize again if occurrence/current plan context is otherwise defensible.

---

# 168. Preview Range Test

Same occurrence materialized from overlapping fresh Preview ranges has same reference.

---

# 169. N-Per-Week Test

Canonical slot stable.

---

# 170. Overnight Test

Correct user-day + UTC interval.

---

# 171. Offset Test

Historical offset captured correctly from target date context.

---

# 172. Clone Test

Mutating result does not mutate inputs.

---

# 173. Purity Test

No store/persistence writes.

---

# 174. No Execution ID Allocation Test

Required.

---

# 175. No Actual Evidence Test

Materialized target contains none.

---

# 176. No Outcome Test

Required.

---

# 177. JSON Roundtrip Test

Target survives plain JSON roundtrip and remains valid input to ExecutionRecord constructor.

---

# 178. ExecutionRecord Integration Test

Materialized target + user-reported outcome can be passed directly to Task 3.2 constructor / Task 3.3 semantic reporting API.

No UI.

---

# 179. Duplicate Planned Subject

Materializer itself need not reject based on history.

ExecutionHistory store remains authority.

Directly confirm boundary.

---

# 180. Store Wiring

Task 3.4 may expose a store/application convenience:

`materializeExecutionTarget(...)`

only if it simply supplies authoritative inputs to the pure materializer.

Do not make it mutate history.

---

# 181. Store Accessor Impact

No new persisted state.

No subscriptions required.

---

# 182. Preview Result Shape

Prefer no Preview schema change unless existing generated occurrence objects lack lineage needed for materialization.

If a narrowly scoped ephemeral lineage field is required:

* derived only;
* non-durable;
* runtime-ID-independent.

Document.

---

# 183. Engine Changes

No scheduling behavior changes.

Only expose/reuse lineage if necessary.

---

# 184. Friction Changes

None.

---

# 185. SuggestedFix Changes

None.

---

# 186. PlanDecision Changes

No domain/persistence changes.

---

# 187. ExecutionRecord Changes

No schema change unless a stop condition is reached.

Pure helper exports/refactors only.

---

# 188. ExecutionHistory Changes

No persistence semantics change.

Potential convenience read-only integration only.

---

# 189. Backup Changes

None.

---

# 190. Profile Changes

None.

---

# 191. Active Changes

None.

---

# 192. No UI

Search UI after implementation.

No Complete / Partial / Skip controls.

---

# 193. No Progress

None.

---

# 194. No Learning

None.

---

# 195. Expected Production Files

Likely:

* `core/execution/historicalExecutionTarget.ts`;
* tests;
* possibly narrow execution snapshot helper exports;
* possibly store/application read-only convenience;
* possibly generated-occurrence lineage typing if genuinely needed.

Avoid broad engine refactors.

---

# 196. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.4_DEFINE_AND_IMPLEMENT_HISTORICAL_EXECUTION_TARGET_PLANNED_SNAPSHOT_MATERIALIZATION_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Contracts
4. Initial Planning-Lineage Audit
5. Files Changed
6. HistoricalExecutionTarget Type
7. Materialization Result Contract
8. Reportability Definition
9. Supported Families
10. Unsupported Families
11. Template Materialization
12. Work Materialization
13. Manual Event Materialization
14. Scheduled State
15. Unplaced State
16. Omitted State
17. Blocked State
18. Fresh Preview Boundary
19. Stale Preview Boundary
20. Try Preview Boundary
21. No-Preview Boundary
22. Current Versus Historical Materialization
23. Retroactive Reporting Boundary
24. Heuristic Placement Limitation
25. PlanDecision Placement
26. PlanDecision Omission
27. PlanDecision Duration
28. PlanDecision Priority
29. Superseded/Removed PlanDecision Limitation
30. Historical Evidence Limitation
31. Durable Reference Construction
32. Runtime-ID Boundary
33. Source Missing
34. Lifetime Mismatch
35. Occurrence Missing
36. Snapshot Title/Category
37. Source Family
38. User-Day Context
39. Day Boundary
40. UTC Offset
41. Scheduled Interval
42. Overnight Semantics
43. Weekly/N-per-Week
44. Source Mutation Limitation
45. Deleted Source Limitation
46. Profile Activation
47. Backup V1
48. Backup V2
49. Materializer API
50. Family Helpers
51. Validation Reuse
52. Snapshot Validation
53. Determinism
54. Clone Isolation
55. JSON Safety
56. ExecutionRecord Integration
57. ExecutionHistory Boundary
58. Store Convenience Boundary
59. Preview Schema Determination
60. Engine Non-Interference
61. Tests Added
62. Scheduled Tests
63. Unplaced/Omitted/Blocked Tests
64. Work/Manual Tests
65. Stale/Try Tests
66. Reference/Lifetime Tests
67. Retroactive/Historical Limitation Tests
68. PlanDecision Tests
69. Overnight/Offset Tests
70. Purity Tests
71. No-ID-Allocation Tests
72. No-Outcome/Actual-Evidence Audit
73. UI Audit
74. Persistence Audit
75. Architectural Alignment Assessment
76. Deviations
77. Discoveries and Deferred Work
78. Recommended Next Task
79. Focused Validation
80. Full Validation
81. Final Completion Determination

---

# 197. Required Matrices

## A. Reportability Matrix

| Occurrence family/state | Reportable? | Reference source | Snapshot state |
| ----------------------- | ----------: | ---------------- | -------------- |

## B. Preview-State Matrix

| Preview condition | May freeze scheduled interval? | Result |
| ----------------- | -----------------------------: | ------ |

Cover:

* fresh generated Preview;
* stale Preview;
* Try-only revised Preview;
* no Preview.

## C. Planning-State Matrix

| State | Snapshot interval? | Meaning |
| ----- | -----------------: | ------- |

Cover:

* scheduled;
* unplaced;
* omitted;
* blocked.

## D. Lifecycle Matrix

| Transition | Old target materializable? | Why |
| ---------- | -------------------------: | --- |

Cover:

* source update same lifetime;
* source delete;
* delete/recreate;
* Profile activation;
* Backup V1;
* Backup V2.

## E. Evidence Matrix

| Historical field | Source of authority | May be reconstructed later? |
| ---------------- | ------------------- | --------------------------: |

---

# 198. Validation Requirements

Run focused tests for:

* materializer;
* scheduled template;
* fixed template;
* unplaced;
* omitted;
* blocked;
* work;
* manual event;
* stale Preview;
* Try-only Preview;
* accepted regenerated Preview;
* source missing;
* lifetime mismatch;
* occurrence missing;
* Profile activation;
* Backup V1/V2;
* weekly/N-per-week;
* overnight/user-day;
* UTC offset;
* clone/purity;
* ExecutionRecord integration.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact test-file/test counts.

---

# 199. Completion Criteria

Task 3.4 is complete only when:

* a pure historical execution target/materialization contract exists;
* reportable planned occurrences produce a valid DurableOccurrenceReference plus ExecutionRecord-compatible snapshot;
* runtime IDs are never historical identity;
* supported template/work/manual families are explicit;
* unsupported imported/synthetic families fail explicitly;
* scheduled fresh-Preview occurrences freeze exact current planned interval;
* stale Preview placement is never frozen as current truth;
* Try-only revised placement is never frozen as accepted plan authority;
* accepted/regenerated Preview materializes normally;
* unplaced occurrences materialize with no fictional interval;
* omitted occurrences materialize with no fictional interval;
* blocked occurrences materialize without falsely claiming requested placement was scheduled;
* current applicable omission/duration/placement semantics are reflected only where defensible;
* priority is not unnecessarily persisted into history;
* no current-source resolution failure causes retargeting;
* sourceMissing/lifetimeMismatch/occurrenceMissing remain distinct;
* user-day date, effective boundary, and historical UTC offset are captured correctly;
* overnight intervals remain correct;
* weekly/N-per-week references remain canonical;
* source mutation limitations for retroactive first reports are explicitly enforced/documented;
* historical heuristic placement is never reconstructed by rerunning the scheduler and presented as past fact;
* materialization allocates no ExecutionRecord/Subject/Source IDs;
* materialization produces no execution outcome, actual-time evidence, note, or provenance;
* output is clone-safe and JSON-safe;
* materialized target can feed Task 3.2/3.3 reporting APIs directly;
* no history write occurs during materialization;
* no scheduling behavior changes;
* no reporting UI is introduced;
* no progress/adherence/learning is introduced;
* no Phase 2 durable schema is changed;
* full validation passes;
* result artifact is complete.

---

# 200. Explicit Non-Goals

Do **not**:

* add Complete/Partial/Skip UI;
* automatically record execution;
* add history UI;
* persist historical targets independently;
* persist Preview history;
* invent lost historical heuristic placements;
* add PlanDecision history;
* add cancellation;
* add missed;
* add actual-time inference;
* add timer/integration evidence;
* add quantity metrics;
* add progress;
* add adherence;
* add learning;
* implement Backup V3;
* change ExecutionRecord V1 schema without separate authorization;
* change DurableOccurrenceReference V1;
* change PlanDecision V1;
* change scheduling semantics;
* add imported-calendar identity;
* perform unrelated UI redesign.

---

# 201. Stop Conditions

Stop and report if:

* current Preview does not distinguish Try-only revision from authoritative regenerated plan;
* DurableOccurrenceReference V1 cannot be reconstructed from current generated occurrence lineage without schema change;
* blocked/omitted occurrences lack enough semantic lineage for safe materialization;
* historical UTC offset cannot be captured correctly with existing time infrastructure;
* current ExecutionRecord snapshot cannot truthfully represent blocked/unplaced/omitted plan context;
* a same-lifetime source update makes the required historical snapshot inherently unknowable and no safe bounded policy can be enforced;
* materialization requires storing previous Preview snapshots;
* implementation requires changing Task 3.2 domain semantics;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest prerequisite or completion task.

---

# 202. Recommended Follow-On Boundary

If Task 3.4 completes successfully, the next task should introduce the first user-facing execution-reporting workflow.

Recommended:

> **Task 3.5 — Implement Minimal Complete / Partial / Skip Execution Reporting Workflow**

That task should:

* expose reporting only for safely materializable targets;
* use `HistoricalExecutionTarget`;
* collect explicit user-reported outcome;
* optionally collect bounded actual-time/duration/note evidence;
* call `ExecutionHistory.recordExecution`;
* show truthful durability feedback;
* never infer missed;
* preserve planning/execution separation.

History browsing and correction UI should remain later unless needed to keep first reporting reversible.

---

# 203. Task Determination

**Authorized:** pure/application historical execution target materialization, DurableOccurrenceReference construction, frozen ExecutionRecord-compatible planning snapshot generation, explicit reportability and failure semantics, supported current scheduled/unplaced/omitted/blocked/work/manual occurrence handling, stale/Try/no-Preview safety, historical-evidence limitations, and direct regression coverage.

**Not authorized:** execution reporting UI, automatic history writes, history browsing/correction UI, plan-history persistence, Preview-history persistence, progress/adherence/learning, Backup V3, timers/integrations, imported-calendar identity, new execution outcomes, or changes to accepted Phase 2/Task 3.2 durable contracts.

The governing materialization principle is:

> **A historical execution target may freeze only planning facts DayFrame can actually establish. When prior placement or mutable source context has been lost, uncertainty must remain explicit rather than being reconstructed from today's scheduler and presented as historical truth.**

---

# 204. Final Completion Statement

**Task 3.4 is complete when DayFrame can deterministically materialize every safely reportable current planned template, work, or manual-event occurrence into a lifetime-safe DurableOccurrenceReference V1 plus a clone-safe, JSON-safe, ExecutionRecord V1-compatible frozen historical snapshot; when scheduled, unplaced, omitted, and blocked planning states are represented truthfully without fabricating scheduled intervals; when fresh authoritative Preview, stale Preview, Try-only Preview, and no-Preview evidence boundaries are explicit; when current PlanDecision effects are reflected only where defensible and removed/superseded intent is not reconstructed as history; when source missing, lifetime mismatch, occurrence missing, same-lifetime mutable-history uncertainty, user-day boundary, UTC offset, overnight, weekly, and N-per-week semantics are handled explicitly; when runtime IDs, outcomes, actual execution evidence, notes, provenance, and execution IDs are absent from materialization; when the resulting target can feed the existing ExecutionRecord/ExecutionHistory reporting authority without additional historical inference; when no scheduling, persistence, UI, progress, learning, Backup, or Phase 2 durable semantics are changed; and when complete repository validation passes.**
