# Task 3.1 — Audit and Define ExecutionEvent / Completion History Semantics

## Status

Ready for investigation and architectural specification.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Architecture-first audit, domain-model investigation, semantic-boundary definition, and publication task.

Task 3.1 begins Phase 3 by determining what DayFrame may truthfully represent about **what actually happened** after a schedule was planned.

This task must audit the existing repository for any execution-like, completion-like, history-like, progress-like, status-like, or outcome-like semantics already present; distinguish those semantics from authored intent, generated schedule state, and accepted `PlanDecision` authority; identify missing domain concepts; and define the minimum authoritative model required for durable execution/completion history.

This is primarily an **investigation and specification task**.

It does **not** implement the execution-history system.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before investigation:

1. verify that the saved project copy exists;
2. verify that the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify the Phase 2 completion checkpoint exists;
6. verify Phase 2 governance documents reflect formal closure;
7. review `PHASE_2_TASK_INDEX.md`;
8. review the final Phase 2 authority model;
9. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.1_AUDIT_AND_DEFINE_EXECUTION_EVENT_COMPLETION_HISTORY_SEMANTICS_RESULT.md`

If investigation reveals an existing authoritative execution/history subsystem, document it rather than replacing it conceptually.

If the repository contains contradictory execution semantics, identify the contradiction and recommend the narrowest prerequisite before implementation.

---

# 2. Purpose

Phase 2 established durable planning authority.

DayFrame can now distinguish:

```text
Authored intent
        ↓
Generated schedule
        ↓
Accepted one-off planning authority
        ↓
Deterministic regenerated schedule
```

But none of those layers necessarily describes reality.

For example:

```text
Authored:
Workout three times this week

Generated:
Workout Tuesday at 18:00

Accepted:
Move Tuesday's Workout to 19:30

Actual:
Workout began at 20:05 and was completed
```

Those are four different facts.

Likewise:

```text
Scheduled at 19:30
```

does not prove:

```text
Started at 19:30
Completed
Missed
Skipped
Partially completed
```

Task 3.1 establishes the semantic boundary between **planning facts** and **execution facts** before DayFrame begins persisting historical outcomes.

---

# 3. Governing Epistemic Principle

The central Phase 3 rule is:

> **DayFrame must distinguish what was planned, what the user decided, what the user reported, what the system directly observed, and what the system merely inferred.**

In particular:

> **A scheduled occurrence is not evidence that the occurrence happened.**

And:

> **Failure to record completion is not sufficient evidence that an occurrence was missed.**

These principles must govern the audit.

---

# 4. Phase 3 Core Question

Task 3.1 must answer:

> What durable facts does DayFrame need in order to represent execution and completion history truthfully, without confusing generated plans with observed outcomes?

The answer must distinguish at least:

* authored intent;
* generated plan;
* accepted PlanDecision;
* reported execution;
* observed execution, if any;
* inferred outcome;
* unknown outcome.

---

# 5. Phase 2 Authority Baseline

Begin from the accepted Phase 2 hierarchy:

```text
Authored source/configuration authority
        ↓
Applicable accepted PlanDecision authority
        ↓
Deterministic scheduling heuristics
        ↓
SuggestedFix recommendations
        ↓
Try experiments
```

Execution/history must not be inserted into this hierarchy casually.

Determine whether execution belongs:

* downstream as historical fact;
* upstream as future planning input;
* or both through separate derived mechanisms.

Do not assume.

---

# 6. Required Initial Repository Audit

Search production code, tests, documentation, fixtures, and persistence surfaces for concepts including:

* complete;
* completed;
* completion;
* done;
* skipped;
* skip;
* missed;
* executed;
* execution;
* actual;
* history;
* historical;
* progress;
* outcome;
* status;
* started;
* finished;
* partial;
* abandoned;
* canceled/cancelled;
* rescheduled;
* check-in;
* adherence;
* streak;
* success;
* failure.

Do not infer semantics from symbol names alone.

Trace behavior.

---

# 7. Existing Execution-Like Semantics

For every discovered execution-like concept, classify:

* Confirmed authoritative behavior;
* Derived presentation;
* Planning-only behavior;
* Placeholder;
* Test-only concept;
* Dead/disconnected path;
* Ambiguous.

Cite files, symbols, and tests.

---

# 8. Existing `skip` Semantics

Audit all current uses of “skip.”

This is especially important because Phase 2 contains planning semantics such as:

`skipBlock`

and:

`omitOccurrence`.

Determine whether any existing code incorrectly conflates:

> “Do not schedule this occurrence”

with:

> “This occurrence existed in the plan but was not performed.”

These must remain distinct unless explicit evidence says otherwise.

---

# 9. Existing Completion Semantics

Determine whether any current UI or state can mark a scheduled occurrence complete.

If yes, trace:

* where authority lives;
* whether it persists;
* what it references;
* whether regeneration destroys it;
* whether source deletion affects it;
* whether it represents user report or system inference.

If no such path exists, record:

**Not found.**

---

# 10. Existing History Semantics

Determine whether any durable history exists for:

* generated schedules;
* previous Previews;
* accepted decisions;
* completed occurrences;
* skipped occurrences;
* user actions;
* revisions.

Do not call current persisted authority “history” unless it actually records past state.

---

# 11. Existing Progress Semantics

Audit any current or planned Summary/Progress concepts.

Determine whether progress currently derives from:

* authored goals;
* generated schedule;
* completed actions;
* placeholder data;
* nothing yet.

Do not invent progress semantics.

---

# 12. Preview Historical Status

Reconfirm whether Preview remains:

> current derived planning output

rather than:

> immutable historical schedule record.

Determine the consequences for Phase 3.

---

# 13. PlanDecision Historical Status

Reconfirm whether PlanDecision represents:

> current accepted planning authority

rather than:

> immutable history of everything the user ever accepted.

Superseded and removed decisions are currently not retained as history.

Execution history must not rely on PlanDecision as an audit log.

---

# 14. DurableOccurrenceReference Suitability Audit

Investigate whether `DurableOccurrenceReference V1` is sufficient to identify the planned occurrence associated with an execution fact.

Test conceptually against:

* flexible template occurrence;
* fixed template occurrence;
* weekly recurrence;
* N-per-week recurrence;
* work occurrence;
* manual event;
* source deletion;
* source recreation;
* Profile activation;
* Backup V1 import;
* Backup V2 restore.

Do not assume it is sufficient merely because it is durable.

---

# 15. Historical Reference Problem

A historical execution record may need to remain meaningful after its source no longer exists.

Therefore answer:

> Should historical execution identity depend on the continued resolvability of the current authored source?

Expected concern:

A completed workout from six months ago should not disappear or become semantically meaningless because its template was later deleted.

---

# 16. Lifetime Safety Versus Historical Independence

Determine whether execution history should:

## A. retain a DurableOccurrenceReference plus historical snapshot metadata;

## B. use a new independently durable execution identity;

## C. use both.

Do not choose based only on implementation convenience.

---

# 17. Candidate `ExecutionEvent` Concept

Investigate whether a new domain object resembling:

```ts
type ExecutionEvent = {
  id: ExecutionEventId;
  ...
};
```

is appropriate.

Do not finalize exact fields until semantics are established.

---

# 18. ExecutionEvent Meaning

Determine whether an ExecutionEvent should represent:

## Model A — Current outcome record

One mutable current execution state per planned occurrence.

## Model B — Append-only factual event

Each execution-related fact is recorded independently.

## Model C — Hybrid

Immutable event history plus derived current outcome.

Compare tradeoffs.

---

# 19. Event Versus Outcome

Explicitly distinguish:

```text
ExecutionEvent
```

from:

```text
OccurrenceOutcome
```

Possible model:

```text
Execution events
    ↓
derived occurrence outcome
```

For example:

```text
Started
Paused
Resumed
Completed
```

could derive:

```text
Completed
```

Do not assume DayFrame needs that complexity in V1.

---

# 20. Minimum Useful V1

Identify the smallest execution model that supports meaningful DayFrame progress without premature complexity.

Potential user actions might include:

* Complete;
* Skip;
* Mark incomplete/partial;
* Undo/correct.

Audit which are genuinely required.

---

# 21. Completion Definition

Define what:

> Completed

means.

Possible meanings:

* user reports the occurrence was completed;
* user reports the intended activity was sufficiently completed;
* system observed elapsed scheduled duration;
* timer finished.

Prefer factual authority over inferred success.

---

# 22. Completion Authority

Determine who may author completion:

* user only;
* system based on direct observation;
* integration;
* derived inference.

Each must have explicit provenance if more than one is allowed.

---

# 23. Scheduled-Time Non-Authority

Explicitly determine:

> Passing the scheduled end time must not automatically mark an occurrence complete.

Unless existing requirements prove otherwise.

---

# 24. Missed Definition

Define whether `missed` is:

* an authoritative stored state;
* a derived state;
* a UI interpretation;
* not a valid concept.

This is a critical decision.

---

# 25. Missing Evidence Problem

Consider:

```text
Workout scheduled Monday
No completion event recorded
It is now Tuesday
```

Possible interpretations:

* missed;
* completed but unreported;
* intentionally ignored;
* user forgot to update DayFrame;
* schedule was no longer relevant.

Therefore determine whether DayFrame may truthfully claim “missed.”

---

# 26. Unknown Outcome

Strongly consider an explicit:

> unknown / unreported

semantic state.

The audit must determine whether absence of execution evidence should default to unknown.

---

# 27. Skip Definition

Distinguish at least:

## Planning omission

> Do not include this occurrence in the plan.

## Execution skip

> This planned occurrence existed, but the user reports choosing not to perform it.

These are not the same fact.

---

# 28. Cancel Definition

Determine whether “cancel” is needed and how it differs from execution skip.

Potential distinction:

* skip = user intentionally did not perform;
* cancel = occurrence became invalid/no longer expected.

Do not add both without meaningful semantics.

---

# 29. Partial Completion

Determine whether V1 needs partial completion.

Potential models:

* boolean partial;
* actual duration;
* completion percentage;
* quantity;
* user note.

Avoid generic percentage if activity semantics cannot support it truthfully.

---

# 30. Actual Duration

Determine whether execution history should record:

* actual start;
* actual end;
* actual duration;
* none unless user provides it.

A planned 30-minute block does not prove 30 minutes of execution.

---

# 31. Actual Start/End

Determine whether these fields should be:

* user-entered;
* timer-observed;
* integration-observed;
* optional.

Do not fabricate actual timestamps from scheduled timestamps.

---

# 32. Completion Timestamp

Distinguish:

* when the activity occurred;
* when the user recorded completion.

These may differ.

Potential fields:

```text
occurredAt
recordedAt
```

or equivalent.

---

# 33. Retroactive Entry

Determine whether the user may record an outcome after the planned occurrence date.

Expected:

> yes.

Historical correctness should not depend on same-day entry.

---

# 34. Future Completion

Determine whether an occurrence may be marked completed before its scheduled occurrence.

Likely policy choices:

* prohibited;
* allowed with explicit actual time;
* treated as early execution.

Audit desired semantics rather than assuming.

---

# 35. Early Execution

If user performs something earlier than planned, determine whether history should say:

* completed early;
* completed;
* rescheduled then completed;
* separate execution.

Do not make planning authority rewrite history automatically.

---

# 36. Late Execution

Same question for late execution.

---

# 37. Reschedule Semantics

This is a major boundary.

Determine whether:

> rescheduling

belongs to:

* PlanDecision/planning authority;
* ExecutionEvent/history;
* both as separate facts.

Likely distinction:

```text
Planning reschedule:
"I intend to do this later."

Execution fact:
"I actually did this later."
```

Do not conflate them.

---

# 38. PlanDecision Relationship

Define the relationship between PlanDecision and execution history.

Potential rule:

> PlanDecision determines intended plan; ExecutionEvent records outcome; neither rewrites the other historically.

Audit.

---

# 39. Removed PlanDecision

If an accepted decision is later removed after execution occurred, historical execution must remain truthful.

Determine what historical context is required.

---

# 40. Superseded PlanDecision

Same.

A completion record must not silently change meaning when current PlanDecision authority changes.

---

# 41. Preview Regeneration

Execution history must survive Preview regeneration.

This should be treated as a likely invariant.

Verify implications.

---

# 42. Preview Range

Execution history must not disappear merely because an occurrence leaves the current Preview window.

Determine query/window semantics separately from persistence.

---

# 43. Source Deletion

If the source is deleted after execution:

* historical record remains;
* historical display remains understandable.

Determine required snapshot fields.

---

# 44. Source Recreation

A recreated same-readable-ID source must not inherit historical execution.

Lifetime safety remains mandatory.

---

# 45. Profile Activation

Determine how history behaves when the user activates another Profile.

Possible models:

* history is global and remains;
* history is profile-scoped;
* history references original lifetimes and remains globally queryable.

Do not assume.

---

# 46. Backup V1 Import

Same investigation.

---

# 47. Backup V2 Restore

Same.

Because Backup V2 may restore old source lifetimes, determine whether historical execution references could resolve again and whether that matters.

---

# 48. Backup V3 Relationship

Phase 2 deferred Backup V3 because PlanDecision authority is absent from Backup V2.

Task 3.1 must determine whether future execution/history data would also belong in a broader complete-state backup.

Do not implement Backup V3.

Document implications.

---

# 49. Historical Snapshot Metadata

Determine the minimum immutable/readable context needed so history remains understandable after source mutation/deletion.

Candidates:

* title at execution time;
* category;
* planned date;
* planned start;
* planned duration;
* source kind;
* occurrence coordinate;
* accepted placement;
* user-day context.

Avoid copying entire authored source unless necessary.

---

# 50. Snapshot Truth

Snapshot fields must represent facts at the appropriate historical moment.

For example:

> `plannedStartAtExecution`

must not later change when current source preferences change.

---

# 51. Historical Plan Context

Determine whether an execution record needs to preserve:

## A. only actual outcome;

## B. planned context at the time outcome was recorded;

## C. both.

For future adherence/progress analysis, both may be useful.

Do not overbuild without justification.

---

# 52. Immutable History Versus Correction

Determine whether historical records are:

* immutable;
* editable;
* supersedable;
* append-only with corrections.

Users make mistakes.

A truthful history system must allow correction without pretending the original entry never existed unless that is the chosen V1 semantics.

---

# 53. Delete Execution Record

Determine whether users may delete an erroneous history record.

If yes, decide whether deletion is:

* hard delete;
* tombstone;
* correction event.

No implementation yet.

---

# 54. Correction Provenance

If corrections are retained, determine minimum provenance.

Avoid enterprise audit-log complexity unless product requirements justify it.

---

# 55. ExecutionEvent Identity

Determine requirements for `ExecutionEventId`.

Likely:

* branded;
* canonical UUID;
* independently allocated;
* stable across edits/corrections if mutable model chosen.

Do not finalize without model decision.

---

# 56. One Outcome Per Occurrence?

Determine whether one planned occurrence may have:

* zero execution records;
* exactly one;
* multiple.

Examples:

* workout split into morning/evening;
* interrupted task resumed later;
* duplicate accidental completion report.

This affects V1 cardinality.

---

# 57. Unplanned Execution

Critical question:

> Can the user record something they did even though DayFrame did not schedule an occurrence?

Examples:

* spontaneous workout;
* unexpected overtime;
* unscheduled errand;
* additional study session.

Determine whether Phase 3 model should support this eventually.

---

# 58. Unplanned Execution Identity

If supported, it cannot require a DurableOccurrenceReference.

Determine whether ExecutionEvent must allow:

* planned-origin execution;
* unplanned execution.

Do not implement unless later authorized.

---

# 59. Manual Events

Audit whether a manual calendar event represents:

* planned commitment;
* actual historical event;
* both.

Current Phase 2 semantics should govern.

Do not reinterpret manual events as execution history merely because they have fixed dates/times.

---

# 60. Work Blocks

Likewise, generated work blocks represent schedule commitments, not proof the user worked them.

Determine whether future execution history needs work-specific handling.

---

# 61. Sleep

Sleep is especially epistemically sensitive.

A scheduled Sleep block does not prove actual sleep.

Determine whether future sleep execution requires:

* user report;
* device integration;
* separate observed metric.

Do not treat schedule as observation.

---

# 62. Recovery / Errands / Flexible Activities

Audit whether one generic completion model can meaningfully represent all current source categories.

If not, define what V1 can safely generalize.

---

# 63. Quantity-Based Goals

Consider future activities where completion is not duration-based:

* read 20 pages;
* drink water;
* complete 10 calls;
* run 5 km.

Determine whether ExecutionEvent V1 should avoid overcommitting to duration-only semantics.

---

# 64. Binary Completion

Assess whether the safest V1 is simply:

* completed;
* skipped;
* unknown by absence;

with optional actual timestamp/note.

Compare against richer models.

---

# 65. Notes

Determine whether execution records need optional user notes.

Potentially useful but not foundational.

Classify accordingly.

---

# 66. User-Reported Provenance

If the user marks something complete manually, history should be able to distinguish:

> user reported

from future:

> integration observed.

Determine whether provenance belongs in V1 now for forward compatibility.

---

# 67. Integration Provenance

Consider future:

* fitness tracker;
* calendar;
* time tracker;
* workplace integration.

Do not implement connectors.

Define whether the domain model should reserve clean provenance semantics.

---

# 68. Confidence

Determine whether inferred/observed events need confidence.

Preferred:

> avoid probabilistic inference in V1 unless a real requirement exists.

---

# 69. Inference Boundary

Define exactly what DayFrame may derive.

Potentially safe derived facts:

* scheduled time has passed;
* no execution record exists;
* completion was recorded after planned time.

Potentially unsafe derived claims:

* missed;
* failed;
* completed;
* intentionally skipped.

Audit and classify.

---

# 70. Derived Outcome Layer

Consider architecture:

```text
ExecutionEvent authority
        ↓
OccurrenceOutcome derivation
        ↓
Progress / adherence / Summary
```

This keeps raw facts separate from interpretation.

Determine whether this is appropriate.

---

# 71. Progress Definition

Task 3.1 must not implement Progress, but should establish what data future Progress is allowed to consume.

Potential principle:

> Progress derives from execution evidence, not merely from scheduled allocation.

---

# 72. Goal Progress

Determine whether goal progress may require mapping execution back to:

* source;
* category;
* goal;
* allocation.

If goals are not yet architecturally formalized, record the dependency.

Do not invent a Goal domain model.

---

# 73. Adherence

Define whether “adherence” means:

* completed at all;
* completed near planned time;
* completed planned duration;
* accepted-plan compliance.

These are different metrics.

Do not implement one accidentally.

---

# 74. Success/Failure Language

Audit product language.

Prefer factual terms over judgmental ones.

Examples:

* Completed
* Skipped
* Not recorded
* Completed later

rather than:

* Success
* Failure

unless product semantics later require them.

---

# 75. History Query Model

Determine likely query dimensions:

* date range;
* source;
* category;
* outcome;
* goal.

No UI implementation.

This informs required indexing/context.

---

# 76. User-Day Semantics

Determine whether execution history groups by:

* calendar date;
* user-day date;
* actual timestamp;
* planned user-day.

Overnight workers make this important.

Do not assume midnight calendar grouping.

---

# 77. Historical User-Day Boundary

If user changes day-boundary preferences later, should an old execution move to a different historical user-day?

Likely concern:

> historical grouping should not rewrite itself because current preferences changed.

Determine required snapshot semantics.

---

# 78. Historical Time Zone

Investigate current timezone assumptions.

If execution history persists timestamps, determine whether V1 needs:

* local wall time;
* UTC instant;
* timezone/offset;
* user-day coordinate.

Do not invent timezone infrastructure beyond evidence.

---

# 79. DST

Consider daylight-saving transitions if actual timestamps become durable.

Identify requirement or defer explicitly.

---

# 80. Sequence / N-Per-Week Semantics

Determine how historical completion maps to occurrences whose identity is not simple date + source.

DurableOccurrenceReference audit should address this.

---

# 81. Multiple Generated Candidates

Ensure history references semantic occurrence, not whichever runtime candidate ID happened to be generated.

---

# 82. Unplaced Occurrence

Can the user complete an occurrence DayFrame failed to place?

Example:

```text
Workout candidate was unplaced
User did it anyway
```

This is important.

Determine whether execution may attach to a semantic occurrence even when no scheduled block exists.

---

# 83. Omitted Occurrence

Can the user later report performing an occurrence that had an accepted omit PlanDecision?

Potentially yes.

Planning authority and actual behavior can disagree.

Execution model must permit truth.

---

# 84. Blocked Accepted Placement

Same.

A blocked decision does not imply non-execution.

---

# 85. Try State

Execution history must never attach to transient Try output as though Try were accepted plan authority.

Determine what planned-context snapshot should use if user completes during a Try state.

Likely require explicit policy.

---

# 86. Freshness Boundary

Determine whether completion actions require fresh Preview.

Possible tension:

* planning actions require fresh Preview;
* execution reporting may need to remain possible even if current Preview is stale.

Audit carefully.

---

# 87. Reporting From Historical Schedule UI

Consider future UX where user marks yesterday's block complete after today's authored changes have made Preview stale.

Execution reporting should probably not depend entirely on current Preview validity.

Determine architectural implication.

---

# 88. Historical Occurrence Materialization

Consider whether Phase 3 requires a durable record of the planned occurrence itself at some point.

Possible concepts:

* `PlannedOccurrenceSnapshot`;
* `ExecutionTarget`;
* embedded plan snapshot.

Do not introduce unless justified.

---

# 89. Event Sourcing Question

Explicitly assess whether Phase 3 should use event sourcing.

Do not adopt event sourcing merely because the domain object is named `ExecutionEvent`.

Compare:

* complexity;
* correction semantics;
* historical truth;
* migration;
* queryability.

---

# 90. Mutable Record Question

Likewise assess a simple mutable `OccurrenceExecutionRecord`.

This may be sufficient for V1.

---

# 91. Recommended V1 Model

The audit must end with a concrete recommendation.

Examples:

## Option A

`ExecutionRecord V1`

one current user-reported outcome per occurrence.

## Option B

`ExecutionEvent V1`

append-only events with derived outcome.

## Option C

hybrid.

Choose one based on DayFrame's actual needs.

---

# 92. Naming Audit

Determine whether:

* `ExecutionEvent`;
* `ExecutionRecord`;
* `CompletionRecord`;
* `OccurrenceOutcome`;

best matches the chosen semantics.

Do not preserve the provisional task name if a better domain term emerges.

---

# 93. Persistence Surface

Recommend whether execution/history should have an independent durable surface.

Likely considerations:

* independent lifecycle;
* independent recovery;
* potentially large growth;
* should not contaminate Active V2;
* should not contaminate Profile V2.

No implementation.

---

# 94. Version Independence

If a new surface is recommended, it should likely have its own version.

Audit against Phase 2 precedent.

---

# 95. Active State Boundary

Determine whether execution/history belongs in `DayFrameState`.

Expected concern:

Historical outcome authority should not become authored setup state.

Audit explicitly.

---

# 96. Profile Boundary

Execution history should probably not be copied into reusable Profiles.

Verify.

---

# 97. Backup Boundary

Determine future backup requirements.

Likely:

* complete backup should include history;
* reusable profile should not.

Document for Backup V3/V4 planning.

---

# 98. Recovery Model

Recommend whether execution history needs:

* whole-source protection;
* entry quarantine;
* both.

Historical data may be particularly valuable and should not be silently discarded.

---

# 99. Migration Model

Determine likely migration requirements for future versions.

No implementation.

---

# 100. Retention

Determine whether history is:

* indefinite;
* user-configurable;
* bounded.

Do not impose retention without product need.

---

# 101. Data Volume

Estimate conceptual growth:

* one event/record per occurrence;
* potentially years of data.

Determine whether localStorage remains appropriate long term.

No storage migration implementation.

---

# 102. LocalStorage Suitability

Audit whether current persistence architecture can reasonably hold growing history.

Possible recommendation:

* V1 localStorage;
* future IndexedDB;
* other.

Base on evidence and likely scale.

---

# 103. Privacy Boundary

Execution history may contain more personal behavioral information than authored schedules.

Identify privacy implications at architectural level.

Do not expand into legal-policy drafting.

---

# 104. Export/Delete

Determine whether future user data export and clear semantics must include history.

Likely yes.

Document.

---

# 105. Full Clear

Future history surface must have explicit full-clear behavior.

Determine whether clear means:

* all execution history deleted;
* retained separately.

Expected user interpretation should govern.

---

# 106. Recovery Abandonment

If history ingress is corrupt, destructive abandonment should be especially explicit.

Document expected model.

---

# 107. Referential Integrity

Determine whether historical records require their source still to exist.

Preferred likely rule:

> no.

History must remain independently interpretable.

---

# 108. Historical Display

Define minimum information required to render a deleted-source historical record meaningfully.

---

# 109. Current Source Enrichment

If original source still exists, history UI may enrich display from current metadata.

But historical facts must not be rewritten.

Determine safe boundary.

---

# 110. Snapshot Versus Current Metadata

Establish precedence:

```text
historical snapshot
    = authoritative historical display context

current source
    = optional enrichment only
```

if supported by audit.

---

# 111. Execution And Recommendation Relationship

Future recommendations may learn from execution history.

Task 3.1 must define:

> historical outcomes may inform future recommendations only through a derived learning/policy layer, not by mutating historical facts.

No implementation.

---

# 112. Execution And Scheduling Relationship

Do not automatically let completion history change authored schedule.

Future adaptation must be explicit.

---

# 113. Learning Boundary

Phase 3 title includes Learning.

Define:

```text
Execution history
    ↓
derived observations
    ↓
future learning/recommendation policy
```

not:

```text
Execution history
    ↓
silent authored-state mutation
```

---

# 114. Outcome Feedback

Determine minimum feedback loop DayFrame eventually needs:

* record outcome;
* show history;
* derive progress;
* surface patterns;
* suggest planning changes;
* user explicitly accepts planning changes.

This should preserve Phase 2 authority principles.

---

# 115. Internal Consistency With Phase 2

Any recommended Phase 3 model must preserve:

* explicit authority;
* lifetime safety;
* deterministic planning;
* user-owned accepted decisions;
* non-destructive recovery;
* version independence;
* truthful derived state;
* explicit transitions between authority layers.

---

# 116. Candidate Authority Hierarchy

Audit and refine:

```text
AUTHORED AUTHORITY
What the user generally wants/has committed to
        ↓
PLANDECISION AUTHORITY
What the user explicitly accepted for this occurrence
        ↓
DERIVED PLAN
What DayFrame currently intends to happen
        ↓
EXECUTION AUTHORITY
What the user/system reports actually happened
        ↓
DERIVED OUTCOME / PROGRESS
What DayFrame can conclude from execution evidence
        ↓
RECOMMENDATION / LEARNING
What DayFrame suggests changing next
        ↓
explicit user acceptance
        ↺
```

Execution must not retroactively rewrite the original plan.

---

# 117. Provenance Matrix

Define candidate authority sources:

| Source                 | May create execution fact? | Authority level |
| ---------------------- | -------------------------: | --------------- |
| User report            |                            |                 |
| DayFrame timer         |                            |                 |
| External integration   |                            |                 |
| Scheduled time passing |                            |                 |
| Heuristic inference    |                            |                 |

---

# 118. Outcome Matrix

Evaluate at minimum:

| Situation                                       | Authoritative fact | Safe derived statement |
| ----------------------------------------------- | ------------------ | ---------------------- |
| User marks complete                             |                    |                        |
| User marks skip                                 |                    |                        |
| Time passes, no report                          |                    |                        |
| User reports actual start/end                   |                    |                        |
| Omitted plan but user reports completion        |                    |                        |
| Unplaced occurrence but user reports completion |                    |                        |

---

# 119. Planning/Execution Separation Matrix

| Planning concept | Execution analogue    | Same concept? |
| ---------------- | --------------------- | ------------: |
| omitOccurrence   | execution skip        |               |
| move occurrence  | actual execution time |               |
| planned duration | actual duration       |               |
| priority         | completion quality    |               |
| blocked          | missed                |               |

Expected answer should strongly distinguish these.

---

# 120. Lifetime Matrix

| Transition         | Planned identity | Historical execution behavior |
| ------------------ | ---------------- | ----------------------------- |
| ordinary update    |                  |                               |
| delete/recreate    |                  |                               |
| Profile activation |                  |                               |
| Backup V1 import   |                  |                               |
| Backup V2 restore  |                  |                               |

---

# 121. Correction Matrix

Evaluate:

| Existing record   | User action            | Recommended historical behavior |
| ----------------- | ---------------------- | ------------------------------- |
| completed         | change to skipped      |                                 |
| skipped           | change to completed    |                                 |
| completed         | remove erroneous entry |                                 |
| wrong actual time | correct time           |                                 |

---

# 122. Scope Matrix

Classify candidate features:

| Capability | V1 required | Later | Not recommended |
| ---------- | ----------: | ----: | --------------: |

Include:

* complete;
* execution skip;
* partial;
* actual start/end;
* actual duration;
* notes;
* unplanned execution;
* timer observation;
* integration observation;
* correction history;
* progress;
* adherence;
* learning.

---

# 123. Architectural Invariants

The result must propose explicit invariants.

At minimum consider:

1. planning state never proves execution;
2. absent execution evidence does not prove failure;
3. execution history survives Preview regeneration;
4. source recreation never inherits old execution;
5. historical facts remain interpretable after source deletion;
6. current source edits do not rewrite historical facts;
7. PlanDecision changes do not rewrite historical execution;
8. execution correction is explicit;
9. derived progress never mutates raw history;
10. learning never silently mutates authored authority.

---

# 124. Terminology Glossary

Define recommended meanings for:

* plan;
* planned occurrence;
* accepted choice;
* execution;
* completion;
* skip;
* missed;
* unknown;
* actual time;
* recorded time;
* outcome;
* history;
* progress;
* adherence;
* learning.

Avoid overloaded terminology.

---

# 125. Confirmed / Inferred / Proposed

Every audit finding must be labeled:

* **Confirmed** — executable/documented current behavior;
* **Inferred** — strongly implied but not directly enforced;
* **Proposed** — recommended Phase 3 architecture;
* **Not found** — no supporting implementation discovered;
* **Unresolved** — requires future decision/evidence.

Do not present proposed semantics as existing behavior.

---

# 126. No Production Implementation

Do not implement:

* ExecutionEvent;
* ExecutionRecord;
* completion buttons;
* history persistence;
* progress;
* learning;
* new backup format.

Task 3.1 is architecture-first.

---

# 127. Authorized Documentation

Task 3.1 may create:

* result artifact;
* architecture checkpoint;
* ADR(s), if repository convention supports them;
* Phase 3 task index/roadmap update if appropriate.

Do not mark implementation complete.

---

# 128. Publication Checkpoint

If the audit reaches a coherent recommended architecture, create:

`docs/checkpoints/CHECKPOINT_Phase_3_Execution_History_Semantics.md`

This checkpoint should define the accepted semantic foundation for subsequent implementation tasks.

---

# 129. Checkpoint Contents

Include:

1. problem statement;
2. epistemic boundary;
3. planning/execution distinction;
4. chosen V1 domain model;
5. authority model;
6. identity/reference model;
7. historical snapshot model;
8. outcome semantics;
9. provenance;
10. correction semantics;
11. persistence recommendation;
12. recovery recommendation;
13. Profile/Backup boundaries;
14. progress/learning boundary;
15. invariants;
16. deferred features;
17. implementation sequence.

---

# 130. ADR Requirement

If the audit chooses among materially different models—especially mutable record versus append-only event history—record that decision in an ADR or `DECISIONS.md` according to repository convention.

---

# 131. Governance Update

Update `CURRENT_STATE.md`, `DECISIONS.md`, `ROADMAP.md`, or Phase 3 index only if appropriate for an accepted architectural checkpoint.

Do not modify `CHANGELOG.md` as though implementation shipped unless repository convention treats architecture publication as changelog-worthy.

---

# 132. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.1_AUDIT_AND_DEFINE_EXECUTION_EVENT_COMPLETION_HISTORY_SEMANTICS_RESULT.md`

The result must include at least:

1. Executive Findings
2. Artifact Integrity
3. Phase 2 Baseline
4. Audit Method
5. Existing Execution-Like Concepts
6. Existing Completion Semantics
7. Existing Skip/Omit Semantics
8. Existing History
9. Existing Progress
10. Preview Historical Status
11. PlanDecision Historical Status
12. DurableOccurrenceReference Suitability
13. Historical Reference Problem
14. Lifetime Safety
15. ExecutionEvent / ExecutionRecord Model Options
16. Recommended V1 Model
17. Naming Determination
18. Completion Definition
19. Completion Authority
20. Missed Determination
21. Unknown Outcome
22. Execution Skip
23. Cancel Determination
24. Partial Completion
25. Actual Duration
26. Actual Start/End
27. Occurred Time vs Recorded Time
28. Retroactive Entry
29. Future/Early/Late Execution
30. Reschedule Boundary
31. PlanDecision Relationship
32. Preview Regeneration
33. Source Deletion
34. Source Recreation
35. Profile Activation
36. Backup V1
37. Backup V2
38. Backup V3 Implication
39. Historical Snapshot
40. Snapshot Truth
41. Historical Plan Context
42. Correction Model
43. Delete/Tombstone Determination
44. Execution Identity
45. Cardinality
46. Unplanned Execution
47. Manual Event Boundary
48. Work Boundary
49. Sleep Boundary
50. Generic Activity Model
51. Quantity-Based Activities
52. Notes
53. Provenance
54. Integration Future
55. Inference Boundary
56. Derived Outcome Layer
57. Progress Boundary
58. Goal Progress Dependency
59. Adherence Definition
60. Language Determination
61. User-Day Semantics
62. Timezone/DST
63. N-Per-Week/Sequence Identity
64. Unplaced Occurrence
65. Omitted Occurrence
66. Blocked Decision
67. Try-State Boundary
68. Preview Freshness Boundary
69. Historical Occurrence Materialization
70. Event-Sourcing Assessment
71. Mutable-Record Assessment
72. Persistence Surface Recommendation
73. Version Independence
74. Active/Profile Boundaries
75. Backup Boundary
76. Recovery
77. Migration
78. Retention/Data Volume
79. Storage Technology Assessment
80. Privacy Boundary
81. Export/Clear
82. Referential Integrity
83. Historical Display
84. Current-Source Enrichment
85. Recommendation Relationship
86. Scheduling Relationship
87. Learning Boundary
88. Outcome Feedback Loop
89. Final Authority Hierarchy
90. Provenance Matrix
91. Outcome Matrix
92. Planning/Execution Separation Matrix
93. Lifetime Matrix
94. Correction Matrix
95. Scope Matrix
96. Architectural Invariants
97. Terminology Glossary
98. Confirmed Findings
99. Proposed Architecture
100. Unresolved Questions
101. Deferred Work
102. Checkpoint Publication
103. Governance Updates
104. Recommended Implementation Sequence
105. Recommended Task 3.2
106. Validation Performed
107. Final Determination

---

# 133. Required Evidence Tables

## A. Existing-System Inventory

| Concept | Current representation | Durable? | Authority? | Evidence |
| ------- | ---------------------- | -------: | ---------: | -------- |

## B. Planning Versus Execution

| Fact | Planning authority | Execution authority | May be inferred? |
| ---- | -----------------: | ------------------: | ---------------: |

## C. Outcome Semantics

| Outcome | Stored or derived? | Required evidence | Meaning |
| ------- | ------------------ | ----------------- | ------- |

## D. Historical Identity

| Scenario | DurableOccurrenceReference sufficient? | Additional snapshot/identity needed? |
| -------- | -------------------------------------: | -----------------------------------: |

## E. V1 Scope

| Capability | V1 | Later | Reason |
| ---------- | -: | ----: | ------ |

---

# 134. Validation Requirements

Because this is primarily an audit task:

* no full test run is required merely to inspect code;
* run focused tests when needed to prove ambiguous behavior;
* if tests/docs are changed, run appropriate focused validation;
* if governance/checkpoint files only are added, run `git diff --check`;
* if any production code changes unexpectedly become necessary, stop and recommend a corrective/prerequisite task instead.

Before completion, run at minimum:

`git diff --check`

and record repository status.

Do not claim implementation validation that was not performed.

---

# 135. Completion Criteria

Task 3.1 is complete only when:

* existing execution/completion/history behavior has been comprehensively audited;
* planning omission is clearly separated from execution skip;
* Preview is classified correctly as current derived plan rather than history;
* PlanDecision is classified correctly as current planning authority rather than history;
* DurableOccurrenceReference suitability for historical linkage has been evaluated;
* source deletion/recreation historical semantics are defined;
* a concrete V1 execution/history domain model is recommended;
* completion authority is defined;
* absence of completion evidence has an explicit semantic treatment;
* `missed` has an explicit determination;
* actual versus scheduled time is separated;
* retroactive reporting is addressed;
* rescheduling is separated from actual execution;
* correction semantics are defined;
* planned/unplanned execution has an explicit boundary;
* manual/work/sleep semantics are addressed;
* provenance is defined;
* inference limits are explicit;
* progress/adherence/learning boundaries are defined;
* user-day/timezone implications are addressed;
* persistence/recovery/Profile/Backup boundaries are recommended;
* architectural invariants are published;
* terminology is unambiguous;
* unresolved questions are explicitly identified;
* a Phase 3 execution/history semantic checkpoint is published if the architecture is coherent;
* a bounded implementation sequence is recommended;
* no execution/history production implementation is introduced.

---

# 136. Explicit Non-Goals

Do **not**:

* implement completion buttons;
* implement execution persistence;
* implement history UI;
* implement Progress;
* implement adherence scoring;
* implement learning;
* implement automatic schedule adaptation;
* implement timers;
* implement external integrations;
* implement Backup V3;
* modify PlanDecision semantics;
* modify DurableOccurrenceReference without a separately authorized task;
* create DurableConflictReference;
* introduce multi-target decisions;
* persist old Previews as history;
* infer missed/completed from time passage;
* add broad Planner/Summary redesign;
* perform unrelated Phase 3 feature work.

---

# 137. Stop Conditions

Stop and report if:

* current repository already contains conflicting authoritative completion models;
* execution history cannot be lifetime-safe using existing identity primitives without redesigning Phase 2 identity;
* current persistence architecture fundamentally cannot support the recommended minimum history model;
* a truthful historical model requires a prerequisite domain concept not yet defined;
* user-day/timezone semantics are too ambiguous to define historical identity safely;
* governance documents contradict the Phase 2 completion checkpoint materially.

Recommend the narrowest prerequisite.

---

# 138. Recommended Implementation Sequence

If the audit supports a clean V1 model, recommend a sequence resembling:

```text
3.1  Execution/history semantic audit
        ↓
3.2  Execution identity + domain model
        ↓
3.3  Execution persistence + recovery
        ↓
3.4  Planned-occurrence → execution linkage
        ↓
3.5  Minimal Complete / Skip reporting workflow
        ↓
3.6  History visibility + correction
        ↓
3.7  Derived outcome/progress foundation
        ↓
3.8  Learning/recommendation audit
```

The audit may change this sequence based on evidence.

Do not pre-authorize these tasks merely by listing them.

---

# 139. Recommended Task 3.2

Task 3.1 must propose the narrowest next implementation task.

Preferred if evidence supports it:

> **Task 3.2 — Implement ExecutionRecord V1 Identity, Domain Semantics, and Pure Validation**

or:

> **Task 3.2 — Implement ExecutionEvent V1 Identity, Domain Semantics, and Pure Validation**

The exact name must follow the domain model selected by the audit.

Task 3.2 should not be drafted until 3.1 determines whether DayFrame wants a mutable record, append-only event, or hybrid model.

---

# 140. Task Determination

**Authorized:** repository-wide execution/history audit; semantic distinction between planning and reality; evaluation of DurableOccurrenceReference for historical linkage; comparison of execution-domain models; definition of completion, skip, unknown, actual time, correction, provenance, history, progress, adherence, and learning boundaries; persistence/recovery recommendations; publication of a Phase 3 semantic checkpoint; and recommendation of the next bounded implementation task.

**Not authorized:** execution/history production implementation, completion UI, persistent history, Progress, adherence scoring, learning, automatic adaptation, integrations, timers, Backup V3, identity redesign without separate authorization, or unrelated feature work.

The governing Phase 3 principle is:

> **DayFrame may remember what it planned and what the user accepted, but those facts do not establish what occurred. Historical claims must be grounded in explicit execution evidence, and uncertainty must remain uncertainty rather than being converted into convenient fiction.**

---

# 141. Final Completion Statement

**Task 3.1 is complete when DayFrame's existing execution-, completion-, skip-, history-, progress-, and outcome-like behavior has been comprehensively audited; when planned occurrences, accepted PlanDecisions, reported or observed execution, inferred outcomes, and unknown outcomes have explicit non-overlapping authority semantics; when the suitability of DurableOccurrenceReference V1 for historical linkage and the need for independent execution identity and immutable historical snapshot context have been determined across regeneration, source mutation/deletion/recreation, Profile activation, Backup V1/V2 restoration, unplaced/omitted/blocked occurrences, and user-day/time boundaries; when a concrete minimum V1 execution/history domain model, provenance model, correction model, persistence/recovery boundary, and progress/learning boundary have been recommended; when absence of execution evidence is not silently converted into completion, failure, or missed status; when the resulting architectural invariants and terminology are published in a canonical Phase 3 execution-history semantic checkpoint; when the narrowest Task 3.2 implementation boundary is identified; and when no execution-history production feature, completion UI, Progress system, learning system, Backup V3, or unrelated behavior has been implemented.**
