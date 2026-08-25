# Task 5.3 — Implement Goal V1 Durable Authority, Commitment Links, Historical Provenance, and Backup/Restore/Clear Integration

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Durable Goal authority implementation, Goal identity/lifecycle, exact commitment-link persistence, runtime-authority integration, mutation admission, protection/recovery, HistoricalPlan provenance extension, Backup evolution, restore/full-clear integration, regression testing, and governance.

**No Goal UI, Progress, Recommendation, or adaptive-planning behavior is authorized.**

---

# 1. Context

Task 5.1 established the Phase 5 architecture:

```text
Goal
    independent durable authored authority

Progress
    derived policy-versioned interpretation

Recommendation
    ephemeral explainable proposal

RecommendationDecision
    future durable user-decision authority

Adaptation
    explicitly authorized future authored-state mutation
```

Task 5.2 then finalized the Goal V1 semantic contract.

Accepted Goal V1 architecture:

```text
GoalAuthorityV1
    version: 1
    goals: GoalV1[]
```

A Goal:

* is independent durable user-authored authority;
* has one opaque, never-reused ID;
* does not require a separate incarnation in V1;
* has a monotonic revision counter;
* has authored lifecycle:

  * active;
  * completed;
  * archived;
* supports explicit reversible lifecycle transitions;
* may have:

  * optional description;
  * optional target date;
  * optional versioned measurement-policy reference;
* owns exact commitment-incarnation links;
* supports many-to-many Goal/Commitment relationships;
* has no direct scheduler effect;
* contains no Progress result;
* contains no Recommendation output.

Task 5.2 also established:

* links use exact source kind + logical ID + source incarnation;
* removed/recreated Commitments are never silently retargeted;
* unavailable links remain explicit until user reconciliation;
* Goal authority should use an independent versioned IndexedDB collection;
* Goal becomes a sixth runtime-authority participant;
* Goal must participate in mutation admission;
* Goal must participate in full clear;
* Goal must participate in the next canonical Backup version before Goal UI ships;
* restore must preserve exact Goal identity/revision/links;
* Profiles do not own Goals;
* future HistoricalPlan publication must freeze Goal/link context before Goal-linked planning becomes user-visible;
* Progress and Recommendations remain derived and excluded.

Task 5.2 selected:

> **Implementation Slice C, staged internally**

meaning Goal authority, links, historical provenance, Backup/restore/full-clear substrate must be complete before Planner Goal UI is introduced.

---

# 2. Purpose

Implement the complete non-UI Goal V1 substrate.

At completion DayFrame must have:

1. a durable Goal V1 authority;
2. strict Goal validation;
3. stable Goal identity and revision semantics;
4. lifecycle commands;
5. exact Goal-owned commitment links;
6. explicit unavailable-link behavior;
7. runtime readiness/protection/durability semantics;
8. Goal participation in the shared runtime authority transaction;
9. Goal participation in full clear;
10. Goal participation in Backup and restore;
11. deterministic semantic fingerprinting;
12. future-safe iterable participant registration;
13. HistoricalPlan publication support for frozen Goal provenance;
14. no scheduler behavior changes;
15. no Goal UI;
16. no Progress or Recommendation implementation.

---

# 3. Governing Implementation Principle

> **Goal becomes real authority before it becomes visible product state.**

DayFrame must not expose user-created Goals before:

* persistence;
* Backup;
* restore;
* full clear;
* protection;
* exact link identity;
* historical provenance

are trustworthy.

---

# 4. Governing Identity Principle

> **A Goal outlives the current planning mechanisms supporting it.**

Therefore:

```text
Goal rename
    preserves identity

Goal lifecycle change
    preserves identity

Goal link change
    preserves identity

Commitment recreation
    does NOT inherit old Goal link

Goal recreation
    receives a new Goal ID
```

---

# 5. Governing Scheduling Boundary

Goal V1 must not alter schedule generation.

The following must remain true:

```text
Goal active
≠ scheduling priority

Goal completed
≠ disable Commitment

Goal archived
≠ delete Commitment

Goal target date
≠ urgency escalation

Goal measurement policy
≠ scheduler input

Goal link
≠ scheduling preference
```

The engine must produce identical schedule output for otherwise identical authored scheduling authority regardless of Goal metadata.

---

# 6. Explicit Scope

Implement:

* Goal domain types;
* Goal authority envelope;
* Goal ID allocator/validator;
* Goal revision semantics;
* lifecycle validation;
* lifecycle commands;
* commitment-link representation;
* link validation;
* Goal IndexedDB storage;
* authority initialization/readiness;
* mutation admission;
* protection/quarantine behavior;
* runtime snapshot/exact install;
* shared authority transaction registration;
* semantic fingerprints;
* full-clear participation;
* Backup next-version support;
* legacy Backup compatibility;
* restore participant;
* HistoricalPlan Goal provenance snapshots;
* publication integration;
* tests;
* governance.

---

# 7. Explicit Non-Goals

Do not implement:

* Goal Planner UI;
* Add Goal button;
* Edit Goal UI;
* Goal list/card UI;
* Summary Goal presentation;
* Progress;
* Progress policies;
* Goal percentages;
* Recommendation;
* RecommendationDecision;
* recommendation UI;
* adaptive authored changes;
* counterfactual recommendation preview;
* Capacity;
* Planned Allocation;
* trends;
* comparisons;
* Goal priority;
* Goal category;
* Goal weighting;
* Project hierarchy;
* Goal templates;
* Profile-owned Goals;
* machine learning;
* automatic adaptation.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this Task 5.3 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.1 result;
   * Task 5.2 result;
   * accepted Goal ADR;
   * Phase 4 completion checkpoint;
   * `ARCHITECTURE_CHARTER.md`;
   * `CURRENT_STATE.md`;
   * `ROADMAP.md`;
   * `DECISIONS.md`;
   * `CHANGELOG.md`;
   * current domain types;
   * source-incarnation/reference types;
   * existing IndexedDB collection infrastructure;
   * runtime authority adapters;
   * runtime authority transaction;
   * mutation admission;
   * Backup V3;
   * restore participant infrastructure;
   * full-clear implementation;
   * HistoricalPlan types;
   * HistoricalPlan publication;
   * HistoricalPlan Backup/restore;
   * relevant test fixtures;
6. do not modify the immutable Task 5.3 artifact.

Create:

`docs/implementation/phase-5/TASK_5.3_IMPLEMENT_GOAL_V1_DURABLE_AUTHORITY_COMMITMENT_LINKS_HISTORICAL_PROVENANCE_AND_BACKUP_RESTORE_CLEAR_INTEGRATION_RESULT.md`

---

# 9. Prerequisite Audit

Before code changes, confirm Task 5.2 assumptions against current source.

At minimum verify:

* exact current source-incarnation reference shape;
* supported commitment source kinds;
* current runtime participant registration mechanism;
* whether participant registration is hardcoded to five;
* IndexedDB database version/store layout;
* collection storage abstraction;
* current Backup V3 shape;
* current Backup version dispatch;
* restore participant adapter structure;
* full-clear participant composition;
* HistoricalPlan occurrence snapshot unions;
* publication builder;
* exact publication-version validation;
* current strict-validation conventions.

If source materially contradicts Task 5.2, stop.

---

# 10. Goal Domain Types

Implement a canonical Goal V1 domain contract.

Conceptually:

```text
GoalAuthorityV1 {
    version: 1
    goals: GoalV1[]
}
```

and:

```text
GoalV1 {
    version: 1
    id: GoalId
    revision: number
    title: string
    description?: string
    status: GoalStatus
    createdAt: string
    updatedAt: string
    targetDate?: string
    measurementPolicyRef?: {
        id: string
        version: number
    }
    completedAt?: string
    archivedAt?: string
    links: GoalCommitmentLinkV1[]
}
```

This is conceptual.

Use the exact Task 5.2 contract and repository conventions.

Do not add fields not justified by 5.2.

---

# 11. Goal ID

Implement a branded Goal ID.

Requirements:

* opaque;
* canonical;
* durable;
* never title-derived;
* never reused;
* cryptographically strong default allocator if consistent with project identity conventions;
* injectable deterministic allocator for tests;
* preserved exactly through Backup/restore.

Do not use array index or title as identity.

---

# 12. No Goal Incarnation V1

Do not add a separate Goal incarnation field.

Task 5.2 explicitly determined:

```text
never-reused Goal ID
+
no hard delete
=
Goal ID is lifetime identity
```

Do not reintroduce a second identity layer without a stop-condition-level discovery.

---

# 13. Goal Revision

Implement a monotonic revision.

Requirements:

* created Goal starts at a canonical initial revision;
* semantic authored mutation increments revision exactly once;
* no-op mutation does not increment revision;
* lifecycle transition increments revision;
* link/unlink increments revision;
* title/description/target/policy mutation increments revision;
* runtime hydration/install does not allocate a new revision;
* Backup/restore preserves revision exactly.

---

# 14. Goal Status

Implement exactly:

```text
active
completed
archived
```

No other durable states.

Do not introduce:

* paused;
* failed;
* abandoned;
* deleted.

---

# 15. Lifecycle Commands

Implement semantic transitions.

At minimum:

```text
completeGoal
archiveGoal
reactivateGoal
```

Task 5.2 allows:

```text
active    → completed
active    → archived

completed → active
completed → archived

archived  → active
archived  → completed
```

Same-state transitions are deterministic no-ops.

---

# 16. Lifecycle Timestamp Coherence

Implement:

* `createdAt`;
* `updatedAt`;
* `completedAt` when completed;
* `archivedAt` when archived.

When leaving completed:

```text
completedAt = absent
```

When leaving archived:

```text
archivedAt = absent
```

A Goal cannot simultaneously carry completed and archived timestamps.

Use recording time, not claimed effective historical time.

---

# 17. Goal Creation

Implement Goal creation with:

* fresh Goal ID;
* initial revision;
* active status;
* canonical timestamps;
* validated title;
* optional description;
* optional target;
* optional measurement policy;
* optional initial links only if the semantic command explicitly supports them.

Do not infer links.

---

# 18. Goal Update

Implement authored field updates.

Normal edits preserve ID.

Do not allow update to replace:

* ID;
* version;
* createdAt

arbitrarily.

Use semantic mutation validation.

---

# 19. No Hard Delete

Do not implement `deleteGoal`.

Archive is the Goal V1 removal-from-active-intent path.

Full clear remains the only system-wide destructive Goal removal.

---

# 20. Goal Description

Implement only if included by the canonical Task 5.2 contract.

Validate according to current bounded-text conventions.

Do not interpret content programmatically.

---

# 21. Target Date

Implement optional canonical user-day/date semantics according to existing date conventions.

Target date:

* does not affect scheduling;
* does not complete Goal;
* does not mark failure;
* does not automatically alter status.

---

# 22. Measurement Policy Reference

Implement only the reference:

```text
{id, version}
```

No policy registry or Progress calculation is required.

Validation must ensure canonical identifier/version structure.

Unknown-but-well-formed policy references should follow the contract determined by the implementation audit.

Do not silently execute anything.

---

# 23. Commitment Link Type

Implement the exact Goal-owned commitment lifetime reference.

Conceptually:

```text
GoalCommitmentLinkV1 {
    sourceKind
    id
    incarnationId
}
```

Use existing source-reference primitives rather than duplicate identity types where possible.

---

# 24. Supported Link Source Kinds

Audit current commitment-like authored source families.

Only permit kinds that satisfy Task 5.2's concept of a schedulable/supporting Commitment.

Do not automatically link:

* arbitrary runtime blocks;
* Preview block IDs;
* HistoricalPlan occurrence IDs;
* ExecutionHistory subject IDs.

---

# 25. Exact Incarnation Links

Every Goal link must preserve exact source incarnation.

Mandatory:

```text
same logical source id
+
different incarnation
=
different Goal-link target
```

---

# 26. Goal-Owned Links

Links live inside Goal authority.

Do not modify Active commitment schema to add Goal references.

Reverse lookup is derived.

---

# 27. Many-to-Many

Support:

```text
Goal A → Commitment 1
Goal A → Commitment 2

Goal B → Commitment 2
```

Prevent duplicate identical links within one Goal.

---

# 28. No Link Weights/Roles

Do not add:

* weight;
* percentage;
* primary;
* supporting;
* milestone;
* priority.

---

# 29. Link Existing Commitment

Implement:

```text
linkCommitment
```

A normal live mutation must require:

* Goal exists;
* Goal authority writable;
* exact current commitment incarnation exists in saved authored authority;
* source kind supported;
* link not already present.

Do not use unsaved Planner draft because no Goal UI exists yet.

---

# 30. Unlink Commitment

Implement explicit unlink.

Unlink removes the current authored relationship from Goal authority.

It does not alter:

* Commitment;
* HistoricalPlan;
* ExecutionHistory.

---

# 31. Commitment Rename/Edit

Identity-preserving Active edits must leave links intact.

No Goal mutation is required.

---

# 32. Commitment Recreation

When a commitment is recreated with a new incarnation:

* old link remains exact to old incarnation;
* it becomes unavailable if the old incarnation no longer exists;
* new incarnation is not linked automatically.

Mandatory test.

---

# 33. Commitment Removal

Do not delete Goal link automatically.

The link remains authored Goal state and becomes unavailable.

This preserves the user's explicit prior relationship until reconciliation.

---

# 34. Unavailable Link State

Do not persist a mutable boolean like:

```text
available: false
```

unless Task 5.2 explicitly requires it.

Prefer:

```text
stored exact link
+
current Active lookup
=
derived availability
```

if supported by architecture.

The stored link remains the exact authored assertion.

---

# 35. Unavailable Link Query

Provide enough query support to distinguish:

* available link;
* unavailable exact reference.

Do not call it corrupted merely because current Active lacks the linked incarnation.

---

# 36. No Fuzzy Reconciliation

Never relink by:

* title;
* category;
* logical ID alone;
* recurrence similarity;
* nearest replacement.

Only explicit user action may reconcile later.

---

# 37. Profile Load

Profile load replaces Active but does not modify Goal authority.

After load:

* exact still-existing links remain available;
* missing incarnation links become unavailable;
* no Goal mutation;
* no link retargeting.

Add regression coverage.

---

# 38. Legacy Backup Import Active Replacement

Backup V1/V2/V3 paths that replace Active must not silently mutate Goal links except where the governed new Backup translation explicitly clears Goal authority as part of whole-authority restore.

Distinguish:

```text
ordinary Active replacement
```

from:

```text
complete Backup restore transaction
```

carefully.

---

# 39. Goal Authority Storage

Implement Goal authority as its own durable IndexedDB collection/surface.

Do not place Goal data under Active localStorage.

Use existing durable collection abstraction where compatible.

---

# 40. Physical Database Upgrade

If a new object store/schema is required:

* make the IndexedDB version upgrade additive;
* preserve all existing stores and data;
* test upgrade from current physical DB version;
* do not reinterpret existing authority.

Record exact old/new physical versions.

---

# 41. Goal Storage Schema Version

Keep separate:

```text
Goal domain version
Goal authority envelope version
IndexedDB physical version
Backup version
```

Document each.

---

# 42. Storage Ordering

Persist canonical Goal ordering deterministically.

Task 5.2 recommends Goal ID canonical order.

Do not make UI ordering authoritative.

---

# 43. Goal Authority Surface

Implement a bounded authority API.

Likely capabilities:

```text
initialize
getSnapshot
subscribe

createGoal
updateGoal
completeGoal
archiveGoal
reactivateGoal
linkCommitment
unlinkCommitment

retry
captureRuntimeSnapshot
installRuntimeExact
```

Use current authority conventions.

Avoid generic `setGoals`.

---

# 44. Mutation Admission

Every Goal mutation must use existing centralized readiness/replacement admission.

Reject or block mutation while:

* initializing;
* protected;
* replacement/restore in progress;
* authority otherwise non-writable.

Do not invent a parallel admission system.

---

# 45. Durability Semantics

Follow existing durable-authority patterns.

A mutation must not report durable success before the durable write is confirmed according to project conventions.

If persistence fails:

* runtime truth must remain coherent;
* durability/protection state must be explicit;
* no silent success.

---

# 46. Runtime Snapshot

Implement a complete Goal runtime snapshot sufficient for:

* coherent transaction capture;
* exact abort;
* exact restore install;
* notification deferral.

Capture all private state required by existing runtime-authority protocol.

Do not expose runtime state in Backup.

---

# 47. Exact Runtime Install

Implement exact install without:

* persistence side effects;
* new timestamps;
* new IDs;
* commands;
* domain events;
* link reconciliation.

Restore means exact installation.

---

# 48. Notification Scheduler

Route Goal subscriber notifications through the shared notification scheduler.

Commit/abort cross-read coherence must match existing participants.

---

# 49. Runtime Authority Transaction

Register Goal with the shared runtime authority transaction.

The architecture must no longer conceptually assume exactly five participants.

Prefer iterable participant registration.

Do not hardcode:

```text
if participantCount === 6
```

as a permanent invariant.

---

# 50. Existing Participants

Adding Goal must not change semantics for:

* Active;
* Profiles;
* PlanDecision;
* ExecutionHistory;
* HistoricalPlan.

Run existing cross-participant transaction tests.

---

# 51. Goal Fingerprint

Implement deterministic semantic fingerprinting for Goal authority.

Fingerprint must:

* include authoritative Goal semantic state;
* include links;
* include revision/lifecycle authored fields;
* exclude runtime durability metadata;
* use canonical ordering.

Same authority → same fingerprint.

---

# 52. Clone Isolation

Returned snapshots/queries must not expose mutable internal references.

Mutation of a returned Goal must not mutate authority.

---

# 53. Strict Validation

Validate:

* envelope version;
* Goal exact keys;
* Goal ID;
* revision;
* title;
* optional description;
* lifecycle;
* timestamp coherence;
* target date;
* measurement-policy reference;
* link exact keys;
* source kind;
* source ID/incarnation;
* duplicate IDs;
* duplicate links;
* ordering/canonicalization where required.

Do not normalize malformed authority into validity silently.

---

# 54. Protection / Quarantine

Implement protection behavior consistent with the chosen durable collection pattern.

Invalid durable Goal authority must not become:

```text
[]
```

silently.

If individual-record quarantine is supported by the chosen abstraction, define it precisely.

Otherwise protect the Goal authority.

Dependent future Progress/Recommendations must later respect protection.

---

# 55. Bootstrap

Goal authority must initialize within the current readiness/bootstrap architecture.

Do not expose writable Goal authority before initialization completes.

---

# 56. Full Clear

Goal becomes a participant in five-authority → six-authority full clear.

Full clear must settle:

```text
GoalAuthorityV1 {
    version: 1
    goals: []
}
```

or canonical equivalent.

It must prevent stale Goal resurrection.

---

# 57. Full-Clear Atomicity

Preserve current cross-authority guarantees.

If full clear uses the durable restore/authority transaction infrastructure, extend it correctly.

Do not clear Goal after the existing five-participant transaction as an unrelated best-effort step.

---

# 58. Backup Evolution

Implement the next canonical Backup format required to include Goal authority.

Expected direction:

```text
Backup V4
```

unless repository versioning evidence requires another name.

Do not call a Goal-aware Backup `V3`.

---

# 59. Backup V4 Purpose

Backup V4 must represent the complete durable authority set existing after Task 5.3.

At minimum:

```text
Active
Profiles
PlanDecision
ExecutionHistory
HistoricalPlan
Goal
```

Use the existing canonical backup architecture.

---

# 60. Backup V4 Goal Payload

Serialize Goal domain authority, not:

* Goal runtime snapshot;
* durability state;
* ingress state;
* protection internals;
* Progress;
* Recommendations.

---

# 61. Backup Export Protection

If Goal authority is protected/unavailable, canonical complete Backup export must not silently omit Goals.

Follow existing whole-backup protection semantics.

---

# 62. Backup V3 Compatibility

Keep V1/V2/V3 import compatibility.

Task 5.2 recommends governed legacy translation:

```text
Backup V3
    five-authority snapshot

when restored into Goal-aware DayFrame
    → Goal authority becomes explicitly empty
```

Implement only if consistent with existing complete-replacement semantics.

Do not preserve unrelated current Goals when performing a full historical Backup V3 restore if that would create a hybrid six-authority result.

---

# 63. Backup V3 Translation Explicitness

The compatibility path must be intentional and tested.

Document:

> Legacy Backup V3 contains no Goal authority, therefore its canonical translation into the six-authority model has empty Goal authority.

Do not fabricate Goal data.

---

# 64. Backup V4 Restore

Extend restore participant construction for Goal.

Restore must:

* validate Goal payload;
* stage Goal target/recovery;
* source-recheck current Goal authority;
* commit Goal durable state coherently;
* install Goal runtime target coherently;
* abort Goal runtime exactly if needed;
* include Goal in fingerprints/whole-authority verification.

---

# 65. Restore Transaction Identity

Do not invent a Goal-specific restore mechanism.

Use Task 3.14A infrastructure.

---

# 66. Restore Participant Count

Refactor participant registration if necessary so restore handles an iterable authority set.

Do not merely duplicate five-participant code into six-participant code if a bounded generalized registry is feasible.

Keep the refactor narrow.

---

# 67. Rollback

Goal must participate in recovery staging and rollback exactly like other authority.

A failed restore after Goal durable mutation must not leave Goal on a different authority side from the other participants.

---

# 68. Startup Recovery

Interrupted restore involving Goal must be recoverable at bootstrap through existing journal semantics.

No Goal UI exists, but restart correctness is mandatory.

---

# 69. HistoricalPlan Goal Provenance

Extend future/current HistoricalPlan publication shape so a planned occurrence associated with Goals freezes sufficient Goal context.

Task 5.2 requires at minimum:

* Goal ID;
* Goal revision;
* exact linked commitment lifetime reference;
* link presence;
* frozen Goal title;
* publication-time status where relevant;
* measurement-policy reference where present.

Implement the smallest truthful representation.

---

# 70. HistoricalPlan Versioning

If Goal provenance changes the HistoricalPlan durable/domain format, increment the appropriate HistoricalPlan version.

Do not mutate V1 meaning while continuing to label it V1.

Preserve legacy read/restore compatibility.

---

# 71. HistoricalPlan Existing History

Existing historical records created before Goal support must remain valid.

Do not backfill Goal links from current Goal authority.

Historical absence of Goal provenance must mean:

> Goal-link context was not captured in that historical publication format.

not:

> the occurrence definitely supported no Goal.

---

# 72. Goal-Link Coverage Future Boundary

Where appropriate, encode enough format/version distinction so later Progress can identify:

* frozen linked context available;
* old publication lacks Goal-link provenance.

Do not implement Progress.

---

# 73. HistoricalPlan Publication Builder

At publication time:

1. inspect saved Goal authority;
2. resolve exact links for the commitment/source incarnation being published;
3. freeze matching Goal snapshots;
4. do not consult unsaved Goal draft;
5. do not infer relationships;
6. publish exact frozen Goal provenance into HistoricalPlan.

---

# 74. Publication and Protected Goal Authority

Critical.

If Goal authority is protected/unavailable when publishing a Goal-aware HistoricalPlan:

determine governed behavior from architecture.

Preferred safety:

> do not claim complete Goal provenance when Goal authority cannot be interpreted.

Possible responses:

* block Goal-aware publication;
* publish explicit provenance-unavailable state if format supports it.

Do not silently publish as "no linked Goals."

---

# 75. No Historical Relabeling

After publication:

* Goal rename;
* status change;
* target change;
* policy change;
* unlink;
* archive

must not change frozen historical Goal provenance.

Mandatory regression.

---

# 76. Goal Recreation

Because Goal ID is never reused:

```text
old Goal
new Goal with same title
```

remain historically distinct automatically.

Test.

---

# 77. Frozen Title

Historical Goal title comes from publication snapshot.

Summary/future Progress must not need current Goal lookup merely to explain old evidence.

---

# 78. Frozen Status

Freeze only if part of the final 5.2 contract.

Do not use current status to reinterpret past publication.

---

# 79. Frozen Measurement Policy

Freeze the authored reference:

```text
{id, version}
```

not a Progress result.

---

# 80. HistoricalPlan Backup

Backup V4 must preserve the updated HistoricalPlan representation exactly.

Legacy historical records remain valid.

---

# 81. HistoricalPlan Restore

Restore must preserve frozen Goal provenance without current Goal reconciliation.

A Backup may legitimately contain historical references to Goals no longer active/current.

---

# 82. ExecutionHistory

Do not modify ExecutionHistory schema merely to add Goal support.

Task 5.1/5.2 established:

```text
ExecutionHistory
    reports occurrences

Goal association
    comes through frozen HistoricalPlan context
```

Preserve this.

---

# 83. Scheduler Independence Test

Add a direct regression proving:

```text
same Active scheduling authority
same PlanDecision
same generation inputs
different Goal authority
=
same generated Preview
```

where Goal metadata/links differ.

Goal V1 must not enter the engine.

---

# 84. Goal Lifecycle Scheduler Test

Changing:

```text
active → completed
active → archived
```

must not disable or alter linked Commitment scheduling.

---

# 85. Target-Date Scheduler Test

Adding/changing targetDate must not change generated Preview.

---

# 86. Measurement-Reference Scheduler Test

Adding/changing measurementPolicyRef must not change generated Preview.

---

# 87. Link Scheduler Test

Linking/unlinking a Commitment must not change generated Preview.

---

# 88. Goal Command Result Semantics

Use deterministic result types.

Distinguish at minimum:

* success;
* not found;
* invalid input;
* duplicate link;
* unavailable commitment;
* protected;
* initializing/busy;
* persistence failure.

Follow repository conventions.

---

# 89. Goal Creation Timestamp Allocation

Allocate timestamps once per authored mutation according to current project clock conventions.

Use injectable clock where testing requires determinism.

Do not allocate during validation/read/restore.

---

# 90. Update Timestamp

`updatedAt` changes only on semantic authored mutation.

No-op command should not allocate timestamp or revision.

---

# 91. Link Availability Query

A reverse/current-resolution query may return something conceptually like:

```text
{
    link,
    availability: "available" | "unavailable"
}
```

without persisting availability.

Exact API may vary.

---

# 92. Goal Snapshot Query

Return canonical clone-isolated Goal authority.

Ordering deterministic.

---

# 93. Reverse Goal Lookup

Implement:

```text
getGoalsForCommitment
```

as derived lookup.

It should use exact commitment lifetime identity.

Do not match by title or logical ID alone.

---

# 94. Goal Mutation and Preview Staleness

Goal-only mutation must **not** stale Preview in V1 because Goal metadata is not a scheduling input.

Mandatory.

Do not mark current Schedule stale merely because Goal title/status/link changes.

---

# 95. Future Adaptation Boundary

No Goal mutation in 5.3 changes Active.

Therefore:

* Goal edit does not stale Schedule;
* Goal link does not stale Schedule;
* Goal target does not stale Schedule.

Only future accepted adaptations affecting scheduling authority would do so.

---

# 96. Historical Publication and Goal Changes

Goal changes may affect **future HistoricalPlan provenance** without affecting generated schedule.

This distinction is important:

```text
Goal link changes
    ↓
same schedule placement
but
future publication carries different Goal context
```

Document/test where appropriate.

---

# 97. Backup Export Roundtrip

Canonical Goal authority must survive:

```text
create
→ export
→ clear/replace
→ restore
```

with exact:

* Goal IDs;
* revisions;
* lifecycle;
* timestamps;
* links;
* targets;
* policy refs.

---

# 98. Legacy Backup V3 Roundtrip

Test governed translation.

Expected:

* five existing authorities restore according to V3 semantics;
* Goal becomes canonical empty;
* no hybrid pre-existing Goal state survives.

---

# 99. Full Clear After Goals

Test:

```text
Goal data exists
+
all existing authority exists
→ full clear
```

Expected:

* Goal empty;
* all other authority cleared according to existing semantics;
* no resurrection on restart.

---

# 100. Interrupted Restore Test

Add a focused Goal-inclusive restore/recovery test.

At minimum prove one failure after partial durable progress cannot leave Goal authority on a different logical restore side from the rest.

Reuse deterministic fault injection if infrastructure supports it.

---

# 101. Runtime Abort Test

Within shared authority transaction:

* mutate/install target snapshots;
* force failure;
* abort;
* Goal runtime returns to exact captured snapshot;
* subscribers observe coherent cross-reads.

---

# 102. Subscriber Cross-Read Test

A Goal subscriber triggered after a shared transaction commit must see all committed participant authority, not hybrid pre/post state.

Likewise existing participant subscribers must see committed Goal state.

---

# 103. Protection Test

Corrupt/invalid Goal durable authority must produce protection according to chosen model.

Do not expose empty Goals as though corruption meant no intent.

---

# 104. Retry Test

If protected/retry semantics are implemented by the chosen authority abstraction, add focused coverage.

---

# 105. IndexedDB Upgrade Test

Existing DB data survives additive upgrade that introduces Goal storage.

At minimum verify existing ExecutionHistory/HistoricalPlan stores remain intact.

---

# 106. Goal Persistence Reload Test

Create Goals/links, reconstruct/reinitialize authority, verify exact durable state.

---

# 107. Revision Tests

Cover:

* creation revision;
* update increment;
* lifecycle increment;
* link increment;
* unlink increment;
* no-op does not increment;
* restore preserves revision.

---

# 108. Lifecycle Tests

Cover all allowed transitions.

Verify timestamp clearing/coherence.

---

# 109. Link Tests

Cover:

* link;
* duplicate link;
* unlink;
* rename;
* recurrence edit;
* delete;
* recreate;
* reverse lookup;
* unavailable link;
* explicit relink.

---

# 110. Profile Replacement Test

With a linked commitment:

1. load profile replacing Active;
2. Goal remains;
3. link remains exact;
4. it becomes unavailable if old incarnation disappears;
5. no fuzzy retarget.

---

# 111. Active Replacement Test

Test another wholesale Active replacement path if distinct from profile load.

---

# 112. Backup Import Replacement Test

Ensure Goal semantics differ correctly between:

* ordinary Active replacement;
* full Backup V4 restore;
* legacy V3 restore translated to empty Goal.

---

# 113. Historical Provenance Tests

At minimum cover:

### linked Goal publication

Occurrence freezes Goal ID/revision/title/link/status/policy context as required.

### later Goal rename

old historical snapshot unchanged.

### later Goal unlink

old historical snapshot unchanged.

### Goal archived

old snapshot unchanged.

### new publication

reflects new current Goal context.

---

# 114. Old HistoricalPlan Compatibility Test

Legacy historical record without Goal provenance remains readable and semantically valid.

No backfill.

---

# 115. Goal Recreation Historical Test

Two Goals with same title but different IDs remain distinct in frozen history.

---

# 116. Current Goal Independence of Historical Explanation

Changing current Goal fields must not alter the deserialized historical snapshot.

---

# 117. No Progress Test

Ensure no production module introduces:

* progressPercent;
* goalProgress;
* adherence;
* Goal score.

This can be static review rather than test if appropriate.

---

# 118. No Recommendation Test

No recommendation code or authority added.

---

# 119. No Goal UI

Do not expose Goal controls in Planner yet.

No user-created Goal data should become reachable through production UI during 5.3.

This allows the substrate to be validated before product exposure.

---

# 120. Backup UI

Existing export/import UI may begin emitting/accepting the new canonical Backup version automatically if it always exports latest authority.

This is infrastructure compatibility, not Goal UI.

Audit carefully.

Do not add Goal-specific UI copy.

---

# 121. Backup Version Display

If current export metadata exposes Backup version, update truthfully.

Do not claim V3 after V4 export.

---

# 122. Documentation of Legacy Compatibility

Governance must clearly state:

* V4 is complete six-authority Backup;
* V3 is supported legacy input;
* V3 has no Goals and translates Goal authority to empty during complete restore.

---

# 123. Performance

Goal authority scale is expected to be small.

Do not build elaborate indexing prematurely.

However:

* reverse link lookup should not require unsafe mutation;
* Goal list/load should remain bounded;
* HistoricalPlan publication may scan small Goal set or use a derived index.

Choose simplest correct implementation.

---

# 124. Privacy

Goal data remains local under current architecture.

No telemetry.

No external processing.

No network sync.

---

# 125. Accessibility

No Goal UI is introduced, so no new Goal-specific UI accessibility is required.

Do not regress existing Planner/Summary UI while changing infrastructure.

---

# 126. Event Model

Do not introduce event sourcing.

If current authority mutation infrastructure emits domain events, follow existing conventions only where required.

Do not add a speculative Goal event ledger.

---

# 127. Goal Audit Trail

V1 auditability comes from:

* stable Goal ID;
* revision;
* timestamps;
* frozen HistoricalPlan provenance;
* future RecommendationDecision references.

No immutable Goal edit ledger.

---

# 128. Goal Protection and Backup

Protected Goal authority should block canonical complete Backup if other protected participants would do so.

Do not omit Goal payload and label export complete.

---

# 129. Goal Protection and Historical Publication

Do not falsely assert "no Goal links" from protected Goal authority.

If necessary, add an explicit publication failure/protection path.

Document exact behavior.

---

# 130. Goal Authority and Profiles

Do not update Profile serialization to include Goals.

Profile save/load behavior remains otherwise unchanged.

---

# 131. Goal Authority and Active Backup

Do not embed Goal under Active payload.

It is a peer authority participant.

---

# 132. Goal Authority and PlanDecision

No dependency.

Goal links do not become PlanDecision inputs.

---

# 133. Goal Authority and Summary

No Summary integration.

Historical Goal provenance may become available in data but remains unused by current Summary until later tasks.

---

# 134. Goal Authority and Historical Intelligence

Do not modify current Scheduling Realization or Scheduled Outcomes semantics.

They may ignore Goal provenance.

No current metric denominator changes.

---

# 135. Goal Authority and Full Clear UI

Existing full-clear UI should clear Goal through the governed full-clear transaction automatically.

No Goal-specific checkbox or separate destructive option.

---

# 136. Restore Compatibility With Current UI

Existing import/restore path should remain the one user-facing path.

Do not add a Goal-specific restore flow.

---

# 137. No Backup V3 Export After Goal Authority Exists

Once Goal is part of complete durable authority, normal canonical export must include it.

Therefore latest export should use V4 or equivalent.

Do not provide a default export path that silently drops Goal authority, even before Goal UI exists.

---

# 138. Test Strategy

Tests should be layered.

### Goal core

* validation;
* identity;
* lifecycle;
* revision;
* links;
* fingerprints.

### Goal durable authority

* persistence;
* reload;
* protection;
* mutation admission;
* retry if applicable.

### Runtime transaction

* capture;
* exact install;
* abort;
* notification coherence.

### Full clear

* six-participant clearing.

### Backup/restore

* V4;
* V3 translation;
* rollback/recovery.

### HistoricalPlan

* frozen Goal provenance;
* legacy compatibility;
* no historical relabeling.

### Scheduling independence

* Goal changes do not affect Preview.

---

# 139. Canonical Fixtures

Create reusable fixtures for:

### Goal A

Active qualitative Goal, no links.

### Goal B

Active Goal with target date and measurement-policy ref.

### Goal C

Completed Goal.

### Goal D

Archived Goal.

### Link fixture

Goal linked to exact commitment incarnation.

### Unavailable link fixture

Goal references removed commitment incarnation.

### Recreation fixture

same logical commitment ID, new incarnation.

### Historical fixture

frozen Goal provenance at publication.

---

# 140. Property Invariants

Where practical prove:

### A

Same Goal semantic authority → same fingerprint.

### B

Input ordering does not affect canonical fingerprint.

### C

Returned snapshots are clone-isolated.

### D

Goal mutation does not affect schedule generation.

### E

Commitment recreation does not inherit links.

### F

Goal rename does not change identity.

### G

Historical publication remains frozen after Goal mutation.

### H

Backup/restore preserves exact Goal authority.

### I

Legacy V3 restore yields empty Goal authority.

### J

Full clear prevents Goal resurrection.

---

# 141. Required Goal Contract Matrix

Produce:

| Field                | Required? | Authored/derived | Mutable? | Identity significance |
| -------------------- | --------: | ---------------- | -------: | --------------------- |
| version              |           |                  |          |                       |
| id                   |           |                  |          |                       |
| revision             |           |                  |          |                       |
| title                |           |                  |          |                       |
| description          |           |                  |          |                       |
| status               |           |                  |          |                       |
| createdAt            |           |                  |          |                       |
| updatedAt            |           |                  |          |                       |
| completedAt          |           |                  |          |                       |
| archivedAt           |           |                  |          |                       |
| targetDate           |           |                  |          |                       |
| measurementPolicyRef |           |                  |          |                       |
| links                |           |                  |          |                       |

---

# 142. Required Command Matrix

Produce:

| Command          | Authority touched | Revision change? | Timestamp allocation? | Scheduler effect? |
| ---------------- | ----------------- | ---------------: | --------------------: | ----------------: |
| createGoal       |                   |                  |                       |                   |
| updateGoal       |                   |                  |                       |                   |
| completeGoal     |                   |                  |                       |                   |
| archiveGoal      |                   |                  |                       |                   |
| reactivateGoal   |                   |                  |                       |                   |
| linkCommitment   |                   |                  |                       |                   |
| unlinkCommitment |                   |                  |                       |                   |

---

# 143. Required Link Matrix

Produce:

| Current commitment condition | Link remains stored? | Available? | Auto-retarget? |
| ---------------------------- | -------------------: | ---------: | -------------: |
| unchanged                    |                      |            |                |
| renamed                      |                      |            |                |
| recurrence changed           |                      |            |                |
| removed                      |                      |            |                |
| recreated same logical ID    |                      |            |                |
| profile load replacement     |                      |            |                |
| Active import replacement    |                      |            |                |

---

# 144. Required Authority Matrix

Produce:

| Authority        | Durable | Runtime participant | Backup V4 | Full clear | Restore |
| ---------------- | ------: | ------------------: | --------: | ---------: | ------: |
| Active           |         |                     |           |            |         |
| Profiles         |         |                     |           |            |         |
| PlanDecision     |         |                     |           |            |         |
| ExecutionHistory |         |                     |           |            |         |
| HistoricalPlan   |         |                     |           |            |         |
| Goal             |         |                     |           |            |         |

---

# 145. Required Backup Matrix

Produce:

| Backup version | Goal payload | Restore Goal behavior | Canonical export after 5.3? |
| -------------- | ------------ | --------------------- | --------------------------: |
| V1             |              |                       |                             |
| V2             |              |                       |                             |
| V3             |              |                       |                             |
| V4/new latest  |              |                       |                             |

---

# 146. Required Historical Provenance Matrix

Produce:

| Goal context          | Frozen? | Source | Later current Goal edit affects it? |
| --------------------- | ------: | ------ | ----------------------------------: |
| Goal ID               |         |        |                                     |
| Goal revision         |         |        |                                     |
| title                 |         |        |                                     |
| status                |         |        |                                     |
| measurement policy    |         |        |                                     |
| exact commitment link |         |        |                                     |
| description           |         |        |                                     |
| Progress              |         |        |                                     |

---

# 147. Required Runtime Transaction Matrix

Produce:

| Concern                 | Before 5.3 | After 5.3 |
| ----------------------- | ---------- | --------- |
| participant count/model |            |           |
| Goal snapshot           |            |           |
| Goal exact install      |            |           |
| Goal notifications      |            |           |
| Goal abort              |            |           |
| cross-read coherence    |            |           |

---

# 148. Required Protection Matrix

Produce:

| Goal condition             | Read result | Mutation | Backup | Historical publication |
| -------------------------- | ----------- | -------- | ------ | ---------------------- |
| ready                      |             |          |        |                        |
| initializing               |             |          |        |                        |
| protected                  |             |          |        |                        |
| durability failure         |             |          |        |                        |
| restore/replacement active |             |          |        |                        |

---

# 149. Required Scheduling Independence Matrix

Produce:

| Goal-only change  | Preview changes? | Preview stale? | Historical future provenance changes? |
| ----------------- | ---------------: | -------------: | ------------------------------------: |
| rename Goal       |                  |                |                                       |
| target date       |                  |                |                                       |
| measurement ref   |                  |                |                                       |
| complete Goal     |                  |                |                                       |
| archive Goal      |                  |                |                                       |
| link commitment   |                  |                |                                       |
| unlink commitment |                  |                |                                       |

Expected scheduler behavior should remain unchanged.

---

# 150. Required Legacy Compatibility Matrix

Produce:

| Existing data/source                | After upgrade/restore |
| ----------------------------------- | --------------------- |
| current IndexedDB before Goal store |                       |
| HistoricalPlan legacy version       |                       |
| Backup V1                           |                       |
| Backup V2                           |                       |
| Backup V3                           |                       |
| Profile                             |                       |
| Active replacement                  |                       |

---

# 151. Required Product-Boundary Matrix

Produce:

| Capability                 | Task 5.3 |
| -------------------------- | -------- |
| Goal durable authority     |          |
| Goal lifecycle             |          |
| Goal links                 |          |
| Goal persistence           |          |
| Goal protection            |          |
| Goal Backup                |          |
| Goal restore               |          |
| Goal full clear            |          |
| historical Goal provenance |          |
| Goal Planner UI            |          |
| Goal Summary UI            |          |
| Progress                   |          |
| Recommendations            |          |
| adaptation                 |          |
| scheduler Goal awareness   |          |
| Goal priority              |          |
| Goal scoring               |          |
| machine learning           |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited by task.

---

# 152. Required Architectural Invariant Assessment

Classify at least:

1. Goal is independent durable authority.
2. Goal ID is opaque.
3. Goal ID is never reused.
4. Goal has no separate incarnation V1.
5. Goal revision is monotonic.
6. no-op mutations do not increment revision.
7. Goal status is active/completed/archived only.
8. completion is user-authored.
9. archive is not failure.
10. lifecycle transitions preserve Goal ID.
11. no hard delete exists.
12. qualitative Goals are valid.
13. target date is optional.
14. target date is not failure threshold.
15. measurement policy is optional reference only.
16. Progress is not stored.
17. Recommendation is not stored.
18. links are Goal-owned.
19. links use exact commitment incarnation.
20. links are many-to-many.
21. link weights do not exist.
22. link roles do not exist.
23. commitment rename preserves link.
24. recurrence change preserves link.
25. commitment removal does not silently delete Goal link.
26. removed link target becomes unavailable.
27. commitment recreation does not inherit link.
28. profile load does not retarget links.
29. Active replacement does not retarget links.
30. Goal lifecycle does not mutate Commitments.
31. Goal status does not affect scheduler.
32. Goal target does not affect scheduler.
33. measurement reference does not affect scheduler.
34. Goal link does not affect scheduler.
35. Goal mutation does not stale Preview.
36. Goal authority uses IndexedDB.
37. Goal authority has explicit schema version.
38. Goal mutations use readiness admission.
39. Goal protection is explicit.
40. malformed Goal authority does not become empty.
41. Goal runtime snapshot is complete.
42. exact runtime install has no persistence side effects.
43. notifications use shared scheduler.
44. Goal joins shared authority transaction.
45. transaction architecture does not assume six is final.
46. Goal semantic fingerprint is deterministic.
47. snapshots are clone-isolated.
48. Goal joins full clear.
49. Goal cannot resurrect after clear.
50. latest canonical Backup includes Goal.
51. Backup V3 remains supported legacy input.
52. V3 complete restore yields canonical empty Goal authority.
53. Backup V4 preserves exact Goal identity/revision/links.
54. Goal joins restore staging.
55. Goal joins restore source recheck.
56. Goal joins rollback/recovery.
57. interrupted restore cannot leave hybrid Goal authority.
58. HistoricalPlan freezes Goal identity.
59. HistoricalPlan freezes Goal revision.
60. HistoricalPlan freezes Goal title.
61. HistoricalPlan freezes exact link context.
62. HistoricalPlan freezes measurement-policy reference where present.
63. HistoricalPlan does not freeze Progress.
64. old HistoricalPlan without Goal provenance remains valid.
65. no current Goal lookup relabels old history.
66. Goal recreation remains historically distinct.
67. ExecutionHistory schema is unchanged.
68. Scheduling Realization semantics are unchanged.
69. Scheduled Outcomes semantics are unchanged.
70. Summary semantics are unchanged.
71. Profiles do not own Goals.
72. Planner Goal UI is absent.
73. Goal data is not user-creatable through production UI yet.
74. no Progress implementation exists.
75. no Recommendation implementation exists.
76. no RecommendationDecision exists.
77. no adaptive mutation exists.
78. no Goal priority exists.
79. no Goal category exists.
80. no universal Goal score exists.
81. no machine learning exists.
82. no automatic adaptation exists.
83. canonical validation is green.
84. no unresolved stop condition remains.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Stop-condition violation.

---

# 153. Stop Conditions

Stop and report if:

* actual source-incarnation types cannot support exact Goal links;
* adding Goal cannot fit existing durable collection/storage architecture without redesign;
* runtime transaction cannot safely evolve beyond five participants;
* full clear cannot include Goal coherently;
* restore infrastructure requires a separate Goal-specific mechanism;
* Backup evolution cannot represent complete six-authority state;
* legacy V3 restore cannot be given a truthful Goal translation;
* Goal protection semantics require silently treating corruption as empty;
* HistoricalPlan cannot add Goal provenance without invalidating existing historical records;
* historical Goal provenance requires current Goal lookup;
* publication cannot distinguish protected Goal authority from no links;
* Goal changes must alter scheduler output to satisfy implementation;
* Goal UI would be necessary to validate the substrate;
* Progress or Recommendation infrastructure is required to implement Goal authority.

Do not weaken the Goal contract to avoid a stop condition.

---

# 154. Likely Files

Follow existing project organization.

Likely areas include:

```text
domain/types
Goal authority/state modules
IndexedDB storage
runtime authority
restore participants
Backup
full clear
HistoricalPlan
publication
tests/fixtures
governance
```

Do not assume exact filenames before source audit.

---

# 155. Dead-Code Boundary

Do not remove existing authority infrastructure merely because Goal requires participant generalization.

Any participant refactor must remain behavior-preserving.

Do not perform unrelated cleanup.

---

# 156. Validation Stages

Recommended staged validation:

1. Goal domain/validation;
2. Goal persistence;
3. Goal commands/lifecycle;
4. links/unavailable behavior;
5. runtime transaction;
6. full clear;
7. Backup V4;
8. restore/recovery;
9. HistoricalPlan provenance;
10. scheduler independence;
11. existing Historical Intelligence regressions;
12. full repository validation.

---

# 157. Focused Validation

Record exact focused files and counts.

At minimum include:

* Goal core;
* Goal durable authority;
* authority transaction;
* Backup;
* restore;
* full clear;
* HistoricalPlan;
* schedule generation.

---

# 158. Full Validation

Before completion run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* full test-file count;
* full test count;
* build module count;
* bundle advisory;
* diff result.

Do not claim results not executed.

---

# 159. Manual Validation

No Goal UI exists, so no Goal-specific visual walkthrough is required.

If existing export/import/full-clear UI behavior changes because latest Backup version changes, perform a bounded manual check where supported.

Otherwise state that Goal substrate was validated through automated tests only.

---

# 160. Governance

On success update minimally:

* Task 5.3 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `DECISIONS.md`;
* `CHANGELOG.md`;
* Goal ADR only if implementation reveals a genuine enduring refinement.

Do not modify the accepted architectural decision casually.

---

# 161. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.3_IMPLEMENT_GOAL_V1_DURABLE_AUTHORITY_COMMITMENT_LINKS_HISTORICAL_PROVENANCE_AND_BACKUP_RESTORE_CLEAR_INTEGRATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.1/5.2 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Goal Domain Contract
7. Goal ID
8. Goal Revision
9. Goal Lifecycle
10. Lifecycle Timestamps
11. Goal Creation
12. Goal Updates
13. No-Hard-Delete Enforcement
14. Target Date
15. Measurement Policy Reference
16. Link Type
17. Supported Link Sources
18. Link Ownership
19. Many-to-Many
20. Link/Unlink Commands
21. Commitment Rename/Edit
22. Commitment Removal
23. Commitment Recreation
24. Unavailable Links
25. Profile Load
26. Active Replacement
27. Goal Persistence
28. Database Upgrade
29. Storage/Domain Versions
30. Authority Surface
31. Mutation Admission
32. Durability
33. Runtime Snapshot
34. Exact Runtime Install
35. Notification Scheduling
36. Runtime Authority Transaction
37. Participant Generalization
38. Fingerprint
39. Clone Isolation
40. Validation
41. Protection/Quarantine
42. Bootstrap
43. Full Clear
44. Full-Clear Atomicity
45. Backup Version
46. Backup Goal Payload
47. Backup Protection
48. Legacy V1/V2/V3 Compatibility
49. Backup V3 Translation
50. Backup V4 Restore
51. Restore Participant
52. Rollback/Recovery
53. Startup Recovery
54. HistoricalPlan Goal Provenance
55. HistoricalPlan Versioning
56. Legacy HistoricalPlan Compatibility
57. Publication Builder
58. Protected Goal Publication Behavior
59. Frozen Goal Identity
60. Frozen Goal Title
61. Frozen Goal Status
62. Frozen Measurement Context
63. Historical Rename/Unlink Safety
64. Goal Recreation History
65. ExecutionHistory Boundary
66. Scheduler Independence
67. Goal Lifecycle Scheduler Independence
68. Goal Target Scheduler Independence
69. Goal Link Scheduler Independence
70. Preview Staleness Boundary
71. Command Result Semantics
72. Timestamp Semantics
73. Queries/Reverse Lookup
74. Backup Roundtrip
75. Legacy Backup Translation
76. Full Clear Regression
77. Interrupted Restore
78. Runtime Abort
79. Subscriber Cross-Read
80. Protection/Retry
81. IndexedDB Upgrade
82. Persistence Reload
83. Revision Tests
84. Lifecycle Tests
85. Link Tests
86. Profile Replacement Tests
87. Historical Provenance Tests
88. Old HistoricalPlan Compatibility
89. No Progress/Recommendation/UI Boundary
90. Performance
91. Privacy
92. Tests Added/Changed
93. Focused Validation
94. Full Validation
95. Manual Validation
96. Governance Updates
97. Deviations
98. Discoveries
99. Deferred Work
100. Goal Contract Matrix
101. Command Matrix
102. Link Matrix
103. Authority Matrix
104. Backup Matrix
105. Historical Provenance Matrix
106. Runtime Transaction Matrix
107. Protection Matrix
108. Scheduling Independence Matrix
109. Legacy Compatibility Matrix
110. Product-Boundary Matrix
111. Architectural Invariant Assessment
112. Stop-Condition Assessment
113. Architectural Alignment Assessment
114. Recommended Next Task
115. Final Completion Determination

---

# 162. Completion Criteria

Task 5.3 is complete only when:

* Task 5.2's Goal V1 contract is implemented without semantic weakening;
* Goal exists as independent durable authority;
* Goal ID is opaque, stable, never reused, and preserved through restore;
* no separate Goal incarnation is introduced without architecture justification;
* Goal revision increments exactly on semantic authored mutation;
* Goal lifecycle implements only active/completed/archived;
* lifecycle transitions preserve Goal identity;
* lifecycle timestamps remain coherent;
* no hard-delete Goal command exists;
* target date remains optional context and does not affect scheduling;
* measurement policy remains an optional versioned reference only;
* qualitative Goals remain valid;
* Goal-owned commitment links use exact source kind/logical ID/incarnation;
* many-to-many links are supported;
* no weights or roles are introduced;
* duplicate links are rejected/no-op according to governed semantics;
* commitment rename/edit preserves links;
* commitment removal leaves exact links unavailable rather than silently deleting them;
* commitment recreation does not inherit previous links;
* profile load and Active replacement do not silently retarget Goal links;
* Goal authority is persisted in its own versioned IndexedDB surface;
* existing durable data survives any database upgrade;
* Goal mutations use centralized readiness/mutation admission;
* durability failure cannot masquerade as success;
* Goal runtime snapshots are complete;
* Goal exact installation has no persistence/allocation side effects;
* Goal notifications route through the shared scheduler;
* Goal participates in the runtime authority transaction;
* participant composition no longer assumes the authority set can never grow beyond six;
* Goal fingerprints are deterministic and semantic;
* Goal snapshots/results are clone-isolated;
* malformed Goal authority is protected/quarantined according to explicit rules rather than treated as empty;
* Goal joins full clear coherently;
* cleared Goals cannot resurrect;
* canonical Backup evolves to a Goal-aware complete-authority version;
* canonical Backup export includes Goal authority;
* Goal runtime/private state is excluded from Backup;
* Backup V1/V2/V3 compatibility remains supported;
* full V3 restore into Goal-aware DayFrame yields explicit empty Goal authority rather than a hybrid result;
* Goal joins restore target/recovery staging, source recheck, commit, verification, runtime install, rollback, startup recovery, and cleanup;
* interrupted restore cannot leave Goal authority on a different logical side from other authority;
* HistoricalPlan publication freezes the Goal context required by Task 5.2;
* HistoricalPlan format/versioning remains truthful;
* legacy historical records remain valid;
* Goal provenance is never retroactively backfilled from current Goal authority;
* protected Goal authority is not interpreted as no Goal links during publication;
* Goal rename/unlink/status change after publication cannot rewrite frozen history;
* Goal recreation remains historically distinct;
* ExecutionHistory schema is unchanged;
* current Scheduling Realization semantics are unchanged;
* current Scheduled Outcomes semantics are unchanged;
* Goal metadata, status, targets, policy references, and links do not alter schedule generation;
* Goal-only mutations do not stale current Preview;
* Goal query/reverse-link results use exact identity;
* Goal authority roundtrips exactly through latest Backup/restore;
* full clear clears Goal along with all existing authority;
* runtime abort and subscriber cross-read coherence include Goal;
* IndexedDB upgrade preservation is tested;
* Goal persistence reload is tested;
* revision/lifecycle/link/replacement tests pass;
* HistoricalPlan frozen-provenance tests pass;
* no Goal Planner UI is introduced;
* no Goal Summary UI is introduced;
* no Progress implementation is introduced;
* no Recommendation or RecommendationDecision is introduced;
* no adaptive planning is introduced;
* no Goal priority, Goal category, Goal score, Goal success metric, machine learning, or automatic adaptation is introduced;
* focused validation passes;
* canonical lint, typecheck, full tests, build, and diff validation pass;
* governance accurately records Goal substrate implementation without claiming user-facing Goal functionality;
* no unresolved stop condition remains.

---

# 163. Recommended Next Task

If Task 5.3 completes successfully, the preferred next task is:

> **Task 5.4 — Planner Goal V1 UX and Workflow Integration**

Its likely purpose:

* expose Goals in Planner / Plan;
* create Goal;
* edit Goal;
* complete/archive/reactivate;
* link/unlink existing Commitments;
* surface unavailable links truthfully;
* preserve explicit save/draft semantics;
* keep Goal semantics separate from Progress.

Do **not** begin Progress as part of 5.4.

If 5.3 discovers a substrate problem, recommend the smallest prerequisite instead.

---

# 164. Final Implementation Principle

> **When Goals become visible to the user, DayFrame should already know how to preserve them, restore them, clear them, identify what they support, and remember their historical context correctly.**

The Goal UI should be the last step of making Goal V1 trustworthy, not the first.

---

# 165. Final Completion Statement

**Task 5.3 is complete when DayFrame implements Goal V1 as an independent, versioned, protected, durable authored authority with opaque never-reused identity, monotonic revision, active/completed/archived lifecycle, coherent timestamps, optional target context, optional measurement-policy reference, exact Goal-owned many-to-many commitment-incarnation links, explicit unavailable-link behavior, deterministic fingerprinting, strict validation, clone isolation, centralized mutation admission, durable IndexedDB persistence, complete runtime snapshots, exact runtime installation, shared notification scheduling, and participation in the generalized runtime authority transaction; when Goal joins full clear and cannot resurrect afterward; when the canonical Backup format evolves to include complete Goal authority while V1/V2/V3 remain governed legacy inputs and a complete V3 restore translates Goal authority explicitly to empty rather than preserving a hybrid current Goal state; when Goal joins restore staging, source recheck, durable commit, verification, runtime installation, rollback, interrupted-startup recovery, and cleanup without creating a Goal-specific restore mechanism; when future/current HistoricalPlan publication freezes exact Goal identity, revision, frozen display context, exact commitment-link reference, and versioned measurement context sufficient to prevent later Goal edits from reinterpreting historical planned evidence while legacy history remains valid and is never retroactively backfilled; when protected Goal authority is never mistaken for no Goal relationships; when Goal rename, lifecycle, target, measurement reference, link, and unlink mutations leave schedule generation unchanged and do not stale Preview; when commitment rename preserves Goal links, commitment recreation never inherits them, profile/import replacement never silently retargets them, and unavailable exact references remain explicit until user reconciliation; when ExecutionHistory and existing Historical Intelligence semantics remain unchanged; when the Goal substrate roundtrips exactly through persistence and canonical Backup/restore, participates coherently in runtime abort and subscriber cross-read behavior, survives additive IndexedDB upgrade, and clears atomically with the rest of durable authority; when no Goal UI, Progress calculation, Recommendation, RecommendationDecision, adaptive mutation, Goal priority, Goal category, Goal score, universal success measure, machine-learning behavior, or automatic adaptation has been introduced; when focused and canonical validation are green; when governance records Goal durability as implemented while leaving Planner Goal UX and all derived/prescriptive intelligence deferred; and when no unresolved identity, persistence, transaction, Backup, restore, historical-provenance, scheduler-independence, or authority stop condition remains.**
