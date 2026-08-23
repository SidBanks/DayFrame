# Task 3.3 — Implement ExecutionHistory V1 Durable Surface, Recovery, Quarantine, and Store Authority

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded durable-authority and persistence implementation task.

Task 3.3 implements the independently persisted `ExecutionHistory V1` authority surface for the pure `ExecutionRecord V1` domain established in Task 3.2.

This task includes:

* independently versioned history envelope;
* dedicated persistence key;
* startup loading and validation;
* subject-component quarantine;
* whole-source protected ingress;
* source-recheck-safe recovery;
* dedicated runtime authority;
* dedicated durability status;
* desired durable condition;
* persistence retry;
* append-first-report authority;
* correction authority;
* retraction authority;
* current outcome access;
* clone-safe subscriptions;
* export primitives;
* full-clear integration;
* exact cross-surface independence;
* direct regression coverage.

It does **not** implement:

* Complete/Partial/Skip UI;
* history browsing UI;
* history correction UI;
* progress;
* adherence;
* learning;
* timers;
* external integrations;
* Backup V3;
* imported-calendar execution linkage;
* cancellation semantics;
* quantity-based execution metrics.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 3.2 is complete and accepted;
6. review:

   * Task 3.2 result;
   * `CHECKPOINT_Phase_3_Execution_History_Semantics.md`;
   * `ADR_EXECUTION_RECORD_AND_COMPLETION_HISTORY_SEMANTICS.md`;
7. inspect current Active/Profile/PlanDecision durability patterns before choosing the narrowest history implementation;
8. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.3_IMPLEMENT_EXECUTIONHISTORY_V1_DURABLE_SURFACE_RECOVERY_QUARANTINE_AND_STORE_AUTHORITY_RESULT.md`

If history durability cannot be introduced independently without changing Phase 2 durable schemas or the accepted ExecutionRecord domain, stop and report rather than broadening scope.

---

# 2. Purpose

Task 3.2 established pure execution authority semantics:

```text
ExecutionSubjectId
    historical subject

ExecutionRecordId
    immutable assertion/revision

ExecutionRecord chain
    ↓
current record projection
    ↓
OccurrenceOutcome
```

Those records are currently only pure domain objects. Nothing owns them durably.

Task 3.3 establishes:

> where execution history lives, how it survives restart, how corrupt history is protected, how corrections/retractions append safely, and how runtime authority behaves when persistence fails.

---

# 3. Governing Architectural Decisions

The following are fixed by Tasks 3.1 and 3.2:

1. execution history is independent authority;
2. execution history is not authored setup;
3. execution history is not Preview;
4. execution history is not PlanDecision;
5. `ExecutionRecord V1` revisions are immutable;
6. current outcome is derived;
7. absence/retraction means unknown;
8. missed is not inferred;
9. one semantic subject has one valid linear correction chain;
10. one planned occurrence may correlate to at most one execution subject;
11. deleted source resolution is not required for history validity;
12. current source recreation does not retarget history;
13. user-reported is the only V1 provenance;
14. planned and unplanned subjects are both valid;
15. physical deletion is not normal correction;
16. persistence/recovery must not invent execution evidence.

Do not reopen these.

---

# 4. Architectural Objective

After Task 3.3:

```text
ExecutionHistory runtime authority
        ↓
independent V1 envelope
        ↓
dedicated persistent checkpoint
        ↓
restart rehydration
```

and:

```text
first report
    → append immutable assertion

correction
    → append immutable replacement

retraction
    → append immutable retraction

persistence failure
    → runtime authority remains current
    → desired durable condition retained
    → retry exact checkpoint
```

but no user-facing reporting workflow yet.

---

# 5. Required Initial Persistence Audit

Before implementation, inspect:

* Active V2 durable surface;
* Profile V2 durable surface;
* PlanDecision V1 durable surface;
* durability-status types;
* desired durable condition patterns;
* retry behavior;
* startup ingress;
* protected raw-source behavior;
* source recheck;
* quarantine;
* full clear;
* subscriber isolation;
* export helpers;
* localStorage abstraction.

Document which patterns are reusable and which should not be copied blindly.

---

# 6. Storage Technology Determination

Task 3.1 identified localStorage as acceptable only for a bounded first version and poor as a long-term history store.

Task 3.3 must explicitly determine whether V1 will use:

## Option A — current localStorage infrastructure

Pros:

* consistent with current app;
* low implementation cost;
* existing recovery patterns.

Cons:

* whole-value serialization;
* synchronous writes;
* quota risk as history grows.

## Option B — IndexedDB now

Pros:

* collection-oriented;
* scalable.

Cons:

* substantial new persistence architecture;
* asynchronous durability/recovery model;
* broader scope.

Preferred for Task 3.3 unless evidence strongly contradicts:

> use the current bounded localStorage persistence infrastructure for V1, but document a future migration requirement before history grows materially.

Do not adopt IndexedDB merely for architectural purity if it would explode scope.

---

# 7. ExecutionHistory Surface Version

Introduce an independent surface version:

```ts
EXECUTION_HISTORY_SURFACE_VERSION = 1
```

Independent from:

* `EXECUTION_RECORD_VERSION`;
* Active V2;
* Profile V2;
* Backup V2;
* PlanDecision V1.

---

# 8. Storage Key

Introduce a dedicated key such as:

`dayframe-execution-history-v1`

or repository-convention equivalent.

No prior execution-history key exists.

No V0 migration exists.

---

# 9. Durable Envelope

Implement a strict envelope conceptually:

```ts
{
  app: "DayFrame",
  surface: "executionHistory",
  version: 1,
  records: [...],
  quarantinedComponents: [...]
}
```

Exact quarantine representation must be justified.

Do not embed:

* authored setup;
* profiles;
* PlanDecisions;
* Preview;
* derived outcomes;
* durability metadata.

---

# 10. Raw Records Are Authority

Persist immutable `ExecutionRecord V1` revisions.

Do not persist:

* current projection;
* OccurrenceOutcome;
* progress;
* adherence;
* current source enrichment.

Those are derived.

---

# 11. History Runtime Authority

Create a store-owned independent runtime authority outside `DayFrameState`.

Conceptually:

```ts
type ExecutionHistoryRuntimeState = {
  records: ExecutionRecordV1[];
  quarantinedComponents: ...;
};
```

Do not add history to authored state.

---

# 12. Store Accessor

Expose:

`getExecutionHistory()`

or equivalent.

Return clone-isolated valid records only.

Quarantine must use a separate accessor.

---

# 13. History Subscription

Expose:

`subscribeExecutionHistory(listener)`

Decision/history-only changes must not notify ordinary authored-state subscribers unless another state mutation also occurs.

---

# 14. Current Outcome Access

Expose pure convenience access based on existing projection:

* `getExecutionOutcome(subjectId)`;
* or equivalent.

It must derive from valid runtime history.

Do not store outcomes.

---

# 15. Planned Occurrence Lookup

Consider a pure store-level helper:

`findExecutionSubjectByPlannedReference(reference)`

or equivalent.

This supports future reporting without allowing duplicate planned subjects.

No UI.

---

# 16. Unplanned Subject Lookup

Do not deduplicate unplanned subjects by title/time.

Only explicit subject ID identifies them.

---

# 17. Dedicated Durability Status

ExecutionHistory must have its own durability state.

Do not reuse:

* active durability;
* profile durability;
* PlanDecision durability.

Follow established factual durability semantics.

---

# 18. Desired Durable Condition

Maintain latest intended history checkpoint separately from factual last-write outcome.

On valid runtime mutation:

* runtime authority advances;
* desired condition advances;
* persistence attempt follows.

---

# 19. Ordinary Persistence Failure

If a valid execution assertion/correction/retraction is accepted in runtime but write fails:

* runtime history remains session authority;
* current outcome derives from it;
* durability reports failure;
* retry persists exact latest history;
* no rollback.

This matches Phase 2 ordinary-mutation durability semantics.

---

# 20. Retry

Implement:

`retryExecutionHistoryPersistence()`

Requirements:

* no new IDs;
* no new `recordedAt`;
* no reconstruction;
* exact current desired checkpoint;
* blocked during whole-source protection;
* successful retry becomes durable.

---

# 21. Startup — No Key

No key means:

* valid empty history;
* no quarantine;
* healthy durable/clean status according to convention.

Do not create fake history.

---

# 22. Startup — Valid V1

Load:

* valid records;
* exact IDs;
* exact timestamps;
* exact correction chains;
* exact snapshots;
* exact references.

No allocator use.

No clock use.

---

# 23. Startup — Stale Source References

A valid record whose DurableOccurrenceReference no longer resolves is still valid history.

Do not quarantine.

Do not call authored resolver during ingress validation.

---

# 24. Startup — Whole-Envelope Failure

Malformed JSON, wrong app/surface, unsupported envelope version, or structurally uninterpretable envelope must trigger protected ingress.

Do not silently adopt empty history.

---

# 25. Protected Raw Source

Retain:

* exact raw source;
* key;
* reason;
* sufficient source fingerprint/evidence for recheck.

Do not expose raw bytes as current history.

---

# 26. Ordinary Mutations During Protection

While whole history ingress is protected:

* append assertion blocked;
* correction blocked;
* retraction blocked;
* physical delete blocked;
* retry blocked.

No overwrite.

---

# 27. Source Recheck

Before destructive protected recovery:

1. reread exact history key;
2. compare against protected evidence;
3. reject `sourceChanged` if bytes no longer match.

Reuse established safety pattern.

---

# 28. Protected Recovery Replace

Implement explicit replacement:

> replace protected execution-history checkpoint with current valid runtime authority.

Since startup under protection may expose safe empty runtime authority, this is destructive and must be explicit.

Requirements:

* source recheck;
* serialize;
* write;
* reread;
* validate;
* verify;
* clear protection only after success.

---

# 29. Protected Recovery Abandon

Implement explicit abandonment:

> discard protected durable execution history and establish authoritative empty history.

Requirements:

* explicit recovery API;
* source recheck;
* durable success before clearing protection;
* restart stays empty.

No UI yet.

---

# 30. Raw Export

Expose exact protected raw source read/export primitive.

No mutation.

Useful because execution history may be valuable user data.

---

# 31. Entry Versus Component Quarantine

Execution records form referential correction chains.

Therefore quarantine cannot safely operate purely one record at a time when a corrupt record affects a subject chain.

Task 3.3 must implement **subject-component quarantine**.

---

# 32. Component Definition

A quarantine component is the smallest connected history component whose integrity must be evaluated together.

Preferred:

> all records belonging to one `ExecutionSubjectId`, plus any malformed records claiming links into/out of that subject as needed to preserve evidence.

Cross-subject corruption may require quarantining both implicated components or a combined component.

Define deterministically.

---

# 33. Valid Independent Subjects

A corrupt subject chain must not destroy valid independent subjects.

If envelope parses and record-level boundaries can be identified safely:

* load valid subject components;
* quarantine invalid components;
* preserve raw evidence.

---

# 34. Duplicate Planned Reference Conflict

Two otherwise valid subjects with the same planned DurableOccurrenceReference are jointly inconsistent.

Do not arbitrarily choose one as authority.

Preferred:

> quarantine all conflicting subject components.

No latest-wins.

---

# 35. Duplicate Record ID Across Subjects

Because record IDs are globally unique, duplicate IDs create cross-component ambiguity.

Preferred:

> quarantine all components containing the duplicate ID.

Do not silently retain first.

---

# 36. Cross-Subject Replacement

Quarantine every implicated subject component.

No arbitrary winner.

---

# 37. Unknown/Unsupported Record Version

If the envelope is known V1 and one subject component contains an unsupported ExecutionRecord version:

* quarantine that component/raw record evidence;
* valid unrelated subjects may load.

Do not protect the whole surface if component isolation is safe.

---

# 38. Malformed Record With No Valid Subject ID

Provide a quarantine-local handle.

Do not fabricate `ExecutionSubjectId`.

Preserve raw record.

---

# 39. Quarantine Persistence

Quarantine must survive unrelated valid history writes.

Do not silently erase invalid evidence when the user later reports another completion.

---

# 40. Quarantine Representation

Use a durable V1 quarantine representation sufficient to preserve:

* raw component records;
* reason codes;
* stable quarantine handle;
* optional known subject IDs/record IDs.

Do not normalize away raw values.

---

# 41. Quarantine Is Not Authority

Quarantined records:

* do not contribute current outcomes;
* do not block unrelated valid subjects;
* are not surfaced by `getExecutionHistory()` as valid records.

---

# 42. Quarantine Accessor

Expose:

`getQuarantinedExecutionHistory()`

or equivalent.

Clone-safe.

---

# 43. Quarantine Export

Expose raw read/export primitive.

No UI.

---

# 44. Quarantine Removal

Provide explicit removal API for one quarantined component.

Requirements:

* preserve all valid history;
* persist next envelope;
* expected persistence failure semantics;
* no execution projection from removed invalid data.

No broad recovery UI.

---

# 45. Quarantine Removal During Protection

Blocked.

Whole-source protection outranks component-level cleanup.

---

# 46. Append First Report Authority

Implement store action conceptually:

`recordExecution(...)`

or:

`appendExecutionAssertion(...)`

The store/domain boundary should own:

* record ID;
* subject ID where first report;
* recordedAt;
* constructor call;
* duplicate planned-subject prevention;
* runtime append;
* persistence.

---

# 47. Reporting Input

Accept semantic input, not arbitrary caller-built records if possible.

For planned:

```ts
{
  subject: {
    kind: "planned";
    reference;
  };
  snapshot;
  outcome;
  actualTime?;
  note?;
}
```

For unplanned:

```ts
{
  subject: {
    kind: "unplanned";
  };
  snapshot;
  outcome;
  actualTime?;
  note?;
}
```

Store owns IDs/timestamps.

---

# 48. No UI Freshness Requirement Yet

Execution reporting is not a planning edit.

Do not require Preview freshness at the persistence/store layer.

Task 3.4/3.5 will determine materialization/reporting workflow.

---

# 49. Planned Reference Structural Validation

Store uses pure ExecutionRecord constructor/validator.

Do not require current source to resolve just to append history if the caller has valid historical materialization.

Higher-level reporting workflows may impose stronger constraints later.

---

# 50. Duplicate Planned Subject Prevention

Before first planned assertion:

* search current valid history for semantically equal planned reference;
* if subject already exists, reject creation of second subject.

Caller should correct/retract existing subject instead.

---

# 51. First Report Result

Return explicit result:

* accepted;
* invalidInput;
* duplicatePlannedSubject;
* protectedHistoryIngress;
* allocationFailure;
* durability outcome.

No expected exceptions.

---

# 52. Runtime Append

On accepted first report:

* immutable record appended;
* history subscriber notified;
* outcome immediately derivable;
* persistence attempted.

No authored/Preview mutation.

---

# 53. Correction Authority

Implement:

`correctExecutionRecord(...)`

or equivalent.

Input identifies:

* subject ID;
* current record ID;
* complete replacement assertion semantics.

Store must recheck current head before construction.

---

# 54. Stale Correction Target

If caller tries to correct a record that is no longer current:

* reject `notCurrentHead`;
* no mutation;
* no persistence.

---

# 55. Correction Runtime Semantics

Append new immutable record.

Do not modify prior revision.

---

# 56. Retraction Authority

Implement:

`retractExecutionRecord(...)`

or equivalent.

Input:

* subject ID;
* current head record ID;
* optional note/reason.

Append immutable retraction.

Current outcome becomes unknown.

---

# 57. Restore After Retraction

A later correction/assertion replacing the current retraction remains valid according to Task 3.2.

Store API may support this through correction semantics or a dedicated re-report action.

Choose one and document.

---

# 58. Physical Delete Boundary

Task 3.1 permits physical deletion only for explicit privacy/data deletion.

Task 3.3 must determine minimum store API.

Options:

## A. no per-subject physical deletion yet; only full clear

## B. explicit `deleteExecutionSubject(subjectId)` privacy primitive

Preferred:

> implement subject-level physical delete only if needed for the stated export/delete privacy boundary and it can remain clearly separate from ordinary correction.

If deferred, document that full clear is the only physical deletion in V1 until a later history-management task.

---

# 59. Full Local Clear

`clearLocalData()` must include ExecutionHistory once it becomes durable.

Requirements:

* runtime history cleared;
* quarantine cleared;
* protected history cleared according to governed safe semantics;
* history key removed/authoritative empty established;
* no resurrection after restart.

---

# 60. Clear Failure

Current full-clear result must truthfully represent history-surface failure.

Audit current multi-surface result.

If adding another durability surface cannot be represented without broad redesign, stop and report.

---

# 61. History-Only Recovery Independence

History recovery replace/abandon must not alter:

* Active;
* Profiles;
* PlanDecisions;
* Preview.

---

# 62. Active Recovery Independence

Active recovery must not alter history.

---

# 63. Profile Activation Independence

Profile activation must not alter history.

History remains global historical evidence.

---

# 64. Backup V1 Independence

Backup V1 import must not clear or rewrite history.

Fresh source lifetimes do not invalidate old historical records.

---

# 65. Backup V2 Independence

Backup V2 restore must not alter current local execution history.

Exact source lifetimes may make planned references resolvable again, but validity never depended on resolution.

---

# 66. PlanDecision Independence

Accept/remove/supersede PlanDecision does not rewrite history.

---

# 67. Preview Independence

Preview generation/regeneration does not write history.

---

# 68. SuggestedFix Independence

No recommendation action writes history.

---

# 69. Store Outcome Projection

Expose current outcome using pure projector.

Do not duplicate projection semantics inside store.

---

# 70. All Current Outcomes

Optional helper:

`getCurrentExecutionOutcomes()`

may return deterministic projections for each subject.

Useful for future progress/reporting.

Implement only if low-risk.

---

# 71. Outcome Subscription

Do not create a separately persisted outcome authority.

History subscription is sufficient; consumers derive outcomes.

A convenience derived subscription is optional but unnecessary.

---

# 72. Runtime Record Ordering

History authority must not depend on array order.

Persistence may serialize deterministically for verification.

Preferred stable ordering:

* subject ID;
* correction-chain order within subject;
* record ID only as deterministic fallback where structurally irrelevant.

---

# 73. Chain Ordering For Serialization

Because explicit links define authority, serialization order may be canonicalized without changing semantics.

Consider:

* root → head order within subject.

This improves readability and verification.

---

# 74. Quarantine Ordering

Stable by quarantine handle.

---

# 75. Serializer

Implement dedicated ExecutionHistory serializer.

Do not stringify store internals.

---

# 76. Envelope Strictness

Validate exact top-level keys.

Reject:

* Active envelope;
* Profile envelope;
* Backup envelope;
* PlanDecision envelope.

---

# 77. Cross-Surface Envelope Test

Directly prove rejection/protection.

---

# 78. Unknown Envelope Version

Whole-source protection.

Do not attempt record quarantine because envelope semantics are unknown.

---

# 79. Unsupported Record Version In Known Envelope

Component quarantine, not whole-source protection, where isolation is safe.

---

# 80. Persistence Verification

For ordinary writes:

* follow established ordinary mutation durability semantics.

For recovery replace/abandon:

* require write → reread → validate → verify before clearing protection.

---

# 81. Desired Condition Includes Quarantine

Retry must preserve:

* valid history records;
* quarantine raw evidence.

No data loss.

---

# 82. Runtime Authority During Quarantine

Valid independent records are current authority.

Quarantine remains non-authoritative preserved evidence.

---

# 83. Runtime Authority During Whole Protection

Choose explicit safe behavior.

Preferred:

> safe empty/previously established runtime history with protection status, but no raw protected records treated as authority.

Document startup behavior exactly.

---

# 84. No Automatic Repair

Do not:

* truncate bad chain;
* choose latest timestamp;
* choose lexical UUID;
* reconnect missing replacement;
* drop malformed entries silently.

---

# 85. Component Quarantine Reason Codes

At minimum preserve categories for:

* invalidRecord;
* unsupportedRecordVersion;
* duplicateRecordId;
* duplicatePlannedReference;
* missingReplacement;
* crossSubjectReplacement;
* competingReplacement;
* competingHead;
* cycle;
* nonMonotonicRecordedAt;
* subjectMismatch.

Can group where practical.

---

# 86. Quarantine Handle Identity

Dedicated quarantine-local identifier.

Do not use:

* ExecutionRecordId;
* ExecutionSubjectId;
* DurableOccurrenceReference;
* source ID.

---

# 87. Quarantine Handle Allocation

Deterministic from ingress order/fingerprint is preferable for stable restart if no durable explicit handle exists.

If stored in envelope, allocation may use UUID.

Choose and document.

Do not fabricate execution identity.

---

# 88. Startup Quarantine Rehydration

Persisted quarantine entries reload exactly.

Do not repeatedly wrap/re-quarantine them into nested quarantine.

---

# 89. Valid Record Revalidation

All valid records are revalidated structurally on startup.

No current-source resolution.

---

# 90. History Durability Status Startup

Define statuses for:

* no key;
* valid V1;
* V1 with quarantine;
* whole protected source.

Quarantine does not necessarily mean whole history durability failure if the current envelope preserves it validly.

Document factual semantics.

---

# 91. Acceptance With Existing Quarantine

Allowed if whole surface itself is valid.

New write preserves quarantine.

---

# 92. Correction With Existing Quarantine

Same.

---

# 93. Retraction With Existing Quarantine

Same.

---

# 94. Retry With Existing Quarantine

Preserve exactly.

---

# 95. Snapshot/Input Clone Isolation

Store APIs must not retain caller-owned mutable objects.

---

# 96. Record Access Clone Isolation

`getExecutionHistory()` returns deep-cloned records.

---

# 97. Quarantine Clone Isolation

Same.

---

# 98. Subscription Clone Isolation

Listeners receive clones.

---

# 99. Protected Raw Isolation

Read/export returns exact data in a safe value, not mutable internal references.

---

# 100. No Source Resolution On Startup

Direct test.

A history record referring to nonexistent current source still loads as valid.

---

# 101. No Source Allocation

Execution history load/retry/correction does not allocate source incarnations.

---

# 102. Execution ID Allocation

Only new assertion/correction/retraction creation allocates new record IDs.

New subject ID only on first new subject.

---

# 103. Retry Allocation Audit

No allocator calls.

---

# 104. Restart Stability

Persisted history roundtrips exact:

* subject IDs;
* record IDs;
* references;
* snapshots;
* timestamps;
* notes;
* correction links.

---

# 105. Current Outcome Restart Stability

Same outcome before and after restart.

---

# 106. Retraction Restart Stability

Unknown remains unknown.

---

# 107. Correction Restart Stability

Current replacement remains current.

---

# 108. Planned Duplicate Restart Validation

Conflicting duplicate planned subjects are quarantined deterministically.

---

# 109. Invalid Chain Startup Test

Valid unrelated subject remains available.

Bad subject quarantined.

---

# 110. Cross-Subject Corruption Startup Test

All implicated components quarantined.

No partial authority.

---

# 111. Duplicate Record ID Startup Test

All ambiguous components quarantined.

---

# 112. Malformed Orphan Record Startup Test

Quarantined with local handle.

Valid siblings load.

---

# 113. Whole Invalid JSON Test

Protected.

No ordinary history write.

---

# 114. Whole Unsupported Version Test

Protected.

---

# 115. Wrong Surface Test

Protected.

---

# 116. Recovery SourceChanged Test

Protected replacement/abandon fails if source bytes changed.

---

# 117. Recovery Replace Test

Write/reread/verify.

---

# 118. Recovery Abandon Test

Empty authoritative history survives restart.

---

# 119. Protected Raw Export Test

Exact.

---

# 120. Quarantine Export Test

Exact raw evidence.

---

# 121. Quarantine Removal Test

Explicit only.

Valid history untouched.

---

# 122. First Planned Report Test

Store appends a valid record.

Current outcome immediately completed/partial/skipped.

---

# 123. First Unplanned Report Test

Works for completed/partial.

---

# 124. Unplanned Skip Rejection

Store surfaces pure-domain rejection.

No write.

---

# 125. Duplicate Planned Report Test

Second first-report attempt for same durable occurrence rejected.

No new subject.

---

# 126. Correction Test

New revision appended.

Old record unchanged.

Projection changes.

---

# 127. Stale Correction Test

Rejected.

---

# 128. Retraction Test

New retraction appended.

Projection unknown.

---

# 129. Restore After Retraction Test

New assertion appended replacing current retraction.

Projection restored.

---

# 130. Persistence Failure First Report Test

Runtime record exists.

Outcome updates.

Durability failed.

Retry exact.

---

# 131. Persistence Failure Correction Test

Runtime correction remains.

Retry preserves IDs/timestamps.

---

# 132. Persistence Failure Retraction Test

Runtime unknown remains.

Retry exact.

---

# 133. Retry No-Reallocation Test

Required.

---

# 134. History Subscriber Test

Append/correct/retract/remove-quarantine as appropriate notify history subscribers.

Persistence retry without runtime history change should not notify history subscribers.

---

# 135. Durability Subscriber Test

Persistence status changes notify dedicated durability subscribers.

---

# 136. DayFrameState Subscriber Isolation

History-only mutations should not notify ordinary state subscribers.

---

# 137. Profile Subscriber Isolation

No effect.

---

# 138. PlanDecision Subscriber Isolation

No effect.

---

# 139. Preview Isolation

History mutations must not stale or regenerate Preview in Task 3.3.

Execution history is not yet a schedule derivation input.

This is important.

---

# 140. Future Learning Boundary

History may later influence recommendations through an explicitly authorized derived layer.

Do not make Preview freshness depend on history now.

---

# 141. Full Clear Test

All history authority and quarantine/protection removed.

Restart empty.

---

# 142. Profile Activation Test

History unchanged.

---

# 143. Backup V1 Import Test

History unchanged.

---

# 144. Backup V2 Restore Test

History unchanged.

---

# 145. PlanDecision Mutation Test

History unchanged.

---

# 146. Preview Generation Test

No history persistence writes.

---

# 147. Export Boundary

Task 3.3 should provide a history-surface export primitive for future user-data export/recovery tooling.

This is **not Backup V3**.

Possible:

`exportExecutionHistoryEnvelope()`

or exact raw serialized current checkpoint.

---

# 148. Export Includes Quarantine

A complete history-surface export should include preserved quarantine evidence.

Document.

---

# 149. Import Boundary

Do not implement general user import unless required for protected recovery.

Task 3.3 is not Backup V3.

---

# 150. Backup V3 Documentation

Record:

> future complete backup must include independently versioned ExecutionHistory in addition to Active, Profiles, and PlanDecisions as governed.

No implementation.

---

# 151. Storage Growth Guard

If using localStorage, do not introduce arbitrary retention trimming.

Persistence failure due quota must remain observable.

No silent deletion of oldest history.

---

# 152. Quota Failure

Treat as ordinary persistence failure:

* runtime authority remains;
* durability failed;
* no hidden eviction.

---

# 153. History Clear Versus Privacy Delete

Full clear physically removes all history.

Per-subject privacy deletion may remain deferred.

Document clearly.

---

# 154. Validation Layer Reuse

Use Task 3.2 pure validators/projectors.

Do not reimplement chain logic in state persistence.

---

# 155. No Derived Outcome Serialization

Direct shape test.

---

# 156. No Current-Source Enrichment Serialization

Direct shape test.

---

# 157. No Preview Serialization

Direct shape test.

---

# 158. No PlanDecision Serialization

Direct shape test.

---

# 159. No Durability Metadata Serialization

Direct shape test.

---

# 160. No Date Objects

Envelope remains JSON-safe.

---

# 161. Persistence Canonicalization

Serialized equivalent runtime history should be deterministic where practical.

This helps recovery verification.

---

# 162. Result APIs

Expected store APIs may include:

* `getExecutionHistory()`;
* `subscribeExecutionHistory(...)`;
* `getExecutionHistoryDurabilityStatus()`;
* `subscribeExecutionHistoryDurability(...)`;
* `recordExecution(...)`;
* `correctExecutionRecord(...)`;
* `retractExecutionRecord(...)`;
* `retryExecutionHistoryPersistence()`;
* quarantine access/export/remove;
* protected source export/recheck/replace/abandon.

Use repository naming conventions.

---

# 163. API Surface Restraint

Do not expose internal persistence manager details to UI.

---

# 164. Expected Production Files

Likely:

* `state/executionHistoryV1.ts` or equivalent;
* `state/executionHistoryPersistence.ts`;
* `dayFrameStore.ts`;
* state durability/result types;
* tests.

Keep pure core `executionRecord.ts` unchanged except only if a genuine bug is discovered.

If a Task 3.2 domain defect is found, stop and report rather than silently expanding 3.3.

---

# 165. Reference Audit

Before completion, search production code for:

* ExecutionRecord;
* ExecutionHistory key;
* record/correct/retract APIs;
* history persistence writer;
* current outcome projection;
* quarantine;
* clear;
* backup/profile/decision interactions.

---

# 166. Writer Audit

Expected:

| Surface          | Current writer |
| ---------------- | -------------- |
| Active           | V2             |
| Profile          | V2             |
| PlanDecision     | V1             |
| ExecutionHistory | V1             |
| Backup export    | V2             |

No cross-surface writer leakage.

---

# 167. Reader Audit

ExecutionHistory has no legacy reader.

Only:

* absent;
* V1;
* unsupported/protected.

---

# 168. No Migration Audit

No V0 history exists.

Do not fabricate migration.

---

# 169. No Completion UI Audit

Search UI production code.

No new reporting controls.

---

# 170. No Progress Audit

None.

---

# 171. No Learning Audit

None.

---

# 172. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.3_IMPLEMENT_EXECUTIONHISTORY_V1_DURABLE_SURFACE_RECOVERY_QUARANTINE_AND_STORE_AUTHORITY_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Domain Contract
4. Initial Persistence Audit
5. Storage Technology Determination
6. Files Changed
7. Surface Version
8. Storage Key
9. Envelope
10. Runtime Authority
11. Store Accessors
12. Subscription Model
13. Current Outcome Access
14. Durability Status
15. Desired Durable Condition
16. Ordinary Persistence Failure
17. Retry
18. Startup No-Key
19. Startup Valid V1
20. Deleted/Stale Source Independence
21. Whole-Surface Protection
22. Protected Raw Evidence
23. Mutation Blocking Under Protection
24. Source Recheck
25. Protected Replace
26. Protected Abandon
27. Raw Export
28. Component Quarantine Model
29. Component Definition
30. Duplicate Planned Reference Handling
31. Duplicate Record ID Handling
32. Cross-Subject Corruption Handling
33. Unsupported Record Version Handling
34. Orphan/Malformed Record Handling
35. Quarantine Representation
36. Quarantine Persistence
37. Quarantine Accessor
38. Quarantine Export
39. Quarantine Removal
40. First Report Authority
41. Report Input
42. Planned Duplicate Prevention
43. Report Result
44. Correction Authority
45. Current-Head Enforcement
46. Retraction Authority
47. Restore After Retraction
48. Physical Delete Determination
49. Full Clear
50. Clear Failure
51. Cross-Surface Independence
52. Profile Activation
53. Backup V1
54. Backup V2
55. PlanDecision Independence
56. Preview Independence
57. Outcome Projection Reuse
58. Serialization Ordering
59. Serializer
60. Envelope Strictness
61. Persistence Verification
62. Clone Isolation
63. Restart Stability
64. Quota Failure
65. Export Boundary
66. Backup V3 Implication
67. Tests Added
68. Startup Tests
69. Quarantine Tests
70. Protected Recovery Tests
71. Report/Correct/Retract Tests
72. Persistence Failure/Retry Tests
73. Subscriber Tests
74. Cross-Surface Tests
75. Full Clear Tests
76. Persistence Shape Tests
77. Reference Audit
78. Writer Audit
79. Reader Audit
80. No-Migration Audit
81. No-UI Audit
82. No-Progress Audit
83. No-Learning Audit
84. Architectural Alignment Assessment
85. Deviations
86. Discoveries and Deferred Work
87. Recommended Next Task
88. Focused Validation
89. Full Validation
90. Final Completion Determination

---

# 173. Required Matrices

## A. Ingress Matrix

| Input condition | Valid history loaded? | Component quarantine? | Whole protection? |
| --------------- | --------------------: | --------------------: | ----------------: |

Cover:

* no key;
* valid V1;
* one bad subject;
* duplicate planned subjects;
* duplicate record ID;
* cross-subject link;
* malformed JSON;
* unsupported envelope version;
* unsupported record version.

## B. Store Operation Matrix

| Operation | Runtime history changes? | Durable write? | Preview changes? |
| --------- | -----------------------: | -------------: | ---------------: |

Cover:

* first report;
* correction;
* retraction;
* retry;
* quarantine removal;
* recovery replace;
* recovery abandon;
* full clear.

## C. Durability Matrix

| Event | Runtime authority advances? | Desired condition | Durability status |
| ----- | --------------------------: | ----------------- | ----------------- |

## D. Cross-Surface Matrix

| Transition | History retained? | History written? |
| ---------- | ----------------: | ---------------: |

Cover:

* profile activation;
* Backup V1 import;
* Backup V2 restore;
* PlanDecision accept/remove;
* Preview regenerate;
* Active recovery;
* full clear.

## E. Quarantine Matrix

| Corruption | Quarantine scope | Valid unrelated history preserved? |
| ---------- | ---------------- | ---------------------------------: |

---

# 174. Validation Requirements

Run focused tests for:

* envelope validation;
* storage-key behavior;
* valid startup;
* component quarantine;
* whole protection;
* source recheck;
* recovery replace/abandon;
* first report;
* duplicate planned subject;
* correction;
* stale correction rejection;
* retraction;
* restore after retraction;
* persistence failure;
* retry;
* clone isolation;
* subscribers;
* profile/backup/decision/Preview independence;
* full clear;
* export;
* persistence shape.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The complete repository suite must pass.

Record exact file/test counts.

---

# 175. Completion Criteria

Task 3.3 is complete only when:

* ExecutionHistory V1 exists as an independent durable surface;
* its envelope/version/key are independent;
* raw ExecutionRecord revisions are persisted;
* OccurrenceOutcome is not persisted;
* runtime history remains outside `DayFrameState`;
* dedicated accessor/subscription exists;
* dedicated durability/retry exists;
* no-key startup gives healthy empty history;
* valid V1 rehydrates exact history;
* deleted/currently unresolved sources do not invalidate history;
* malformed/unsupported whole surface is protected;
* ordinary writes are blocked under protection;
* destructive recovery uses source recheck;
* recovery replacement is write/reread/validate/verify safe;
* recovery abandonment durably establishes empty history;
* valid independent subject components survive corrupt siblings;
* corrupt components quarantine non-destructively;
* duplicate planned-reference conflicts do not silently pick a winner;
* duplicate IDs/cross-subject corruption are handled without guessing;
* unsupported record versions can quarantine at component level when envelope V1 is known;
* quarantine survives unrelated writes;
* quarantine raw evidence is exportable/removable explicitly;
* first report appends immutable authority;
* duplicate planned subjects are rejected;
* correction appends a new current-head replacement;
* stale correction is rejected;
* retraction appends immutable retraction;
* retraction projects unknown;
* later re-report after retraction is supported according to chosen API;
* valid runtime history remains session authority after persistence failure;
* retry writes exact current authority without new IDs/timestamps;
* full clear includes history;
* profile activation does not alter history;
* Backup V1/V2 do not alter history;
* PlanDecision mutations do not alter history;
* Preview generation/regeneration does not alter or stale from history;
* history export exists independently of Backup V3;
* quota failure never silently evicts history;
* no execution-reporting UI is added;
* no progress/adherence/learning is added;
* no Phase 2 schema changes occur;
* full validation passes;
* result artifact is complete.

---

# 176. Explicit Non-Goals

Do **not**:

* add Complete/Partial/Skip UI;
* add history browser;
* add history correction UI;
* add progress;
* add adherence;
* add learning;
* add timer;
* add external integrations;
* add imported-calendar execution linkage;
* add cancellation;
* add quantity metrics;
* implement Backup V3;
* put history in Active V2;
* put history in Profile V2;
* put history in PlanDecision V1;
* persist OccurrenceOutcome;
* persist current-source enrichment;
* infer missed;
* auto-resolve corrupt chains;
* silently discard quarantine;
* add arbitrary retention trimming;
* modify ExecutionRecord V1 semantics without separate authorization;
* perform unrelated refactors.

---

# 177. Stop Conditions

Stop and report if:

* localStorage cannot safely accommodate the bounded V1 surface without broad durability failure;
* current clear orchestration cannot represent another independent surface;
* subject-component quarantine cannot isolate corruption safely;
* protected recovery cannot reuse established source-recheck semantics;
* store authority cannot enforce one-subject-per-planned-reference without changing Task 3.2;
* correction/retraction persistence requires mutable-record semantics;
* history persistence necessarily changes Preview scheduling behavior;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest corrective/prerequisite task.

---

# 178. Recommended Follow-On Boundary

If Task 3.3 completes successfully, the next task should establish a safe bridge from current planning state into historical report inputs without yet building the full reporting UI.

Recommended:

> **Task 3.4 — Define and Implement Historical Execution Target / Planned Snapshot Materialization**

That task should determine how a current or historical planned occurrence becomes a valid:

* `DurableOccurrenceReference`;
* frozen ExecutionRecord snapshot;
* reportable execution target;

for:

* scheduled;
* unplaced;
* omitted;
* blocked;
* stale/currently absent Preview situations.

Only after this bridge is stable should Task 3.5 add minimal Complete / Partial / Skip reporting UX.

---

# 179. Task Determination

**Authorized:** independent `ExecutionHistory V1` persistence, strict envelope validation, component-level quarantine, whole-source protection, source-recheck recovery, store-owned first-report/correction/retraction authority, dedicated durability/retry/subscriptions, export, full-clear integration, cross-surface independence, and direct regression coverage.

**Not authorized:** execution-reporting UI, history browsing/correction UI, progress, adherence, learning, Backup V3, timers/integrations, imported-calendar history linkage, cancellation, quantity metrics, or changes to ExecutionRecord/Phase 2 durable semantics.

The governing durability principle is:

> **Execution history is independent factual authority. Valid reported evidence may advance in the current session even when persistence fails, but corrupt durable history must never be silently discarded, repaired, retargeted, or overwritten.**

---

# 180. Final Completion Statement

**Task 3.3 is complete when DayFrame owns `ExecutionRecord V1` revisions through an independently versioned `ExecutionHistory V1` durable surface with a dedicated key, runtime authority, accessor/subscription, factual durability status, desired durable condition, exact retry, strict envelope validation, non-destructive subject-component quarantine, protected whole-source ingress, source-recheck-safe recovery replacement and abandonment, immutable first-report/correction/retraction store authority, deterministic reuse of the Task 3.2 current-outcome projection, deleted-source independence, exact restart stability, full-clear and export semantics, and explicit cross-surface isolation from Active, Profiles, PlanDecisions, Preview, and Backup V1/V2; when persistence failure never rolls back valid session history or silently evicts evidence; when corrupt components are preserved without contaminating valid independent subjects; when complete repository validation passes; and when no reporting/history UI, progress, adherence, learning, Backup V3, timer/integration, cancellation, quantity model, or Phase 2 schema change is introduced.**
