# Task 2.24 — Establish Source-Incarnation and Lifetime-Safe Occurrence Reference Semantics

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.24
**Execution Type:** Investigation / Architectural Identity Decision
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

`TASK_2.24_ESTABLISH_SOURCE_INCARNATION_AND_LIFETIME_SAFE_OCCURRENCE_REFERENCE_SEMANTICS_RESULT.md`

This task is investigation and architectural decision only.

Do not modify:

* production code;
* tests;
* authored source IDs;
* source constructors;
* persistence;
* local-storage schemas;
* profile formats;
* backup formats;
* `OccurrenceIdentity`;
* occurrence-identity version;
* PlanDecision;
* PlanDecision persistence;
* generation behavior;
* UI;
* architecture governance documents;
* checkpoints.

No implementation is authorized by this task.

If lifetime-safe identity cannot be established without first resolving a durable-versioning or replacement-semantic prerequisite, identify that dependency rather than inventing behavior.

---

# 2. Purpose

Task 2.10 introduced explicit versioned runtime `OccurrenceIdentity`.

Task 2.10 also established an explicit limitation:

> V1 occurrence identity is suitable for runtime semantic equality but is not a durable foreign key because authored source IDs may be deleted and later reused.

Tasks 2.11–2.15 subsequently strengthened current authored-state uniqueness and validity.

Those protections ensure that one current authored snapshot does not contain ambiguous duplicate authority, but they do not prove that:

```
source ID X today
    =
source ID X from a prior source lifetime
```

Task 2.23 established concrete future PlanDecision reference requirements.

Durable PlanDecisions may target:

* template + recurrence occurrences;
* manual-event occurrences;
* work occurrences;
* conflicts involving any combination of those occurrence kinds.

A durable decision must never attach to a later source merely because visible/source IDs and occurrence coordinates happen to match.

Task 2.24 must therefore establish source-lifetime semantics before PlanDecision persistence or durable occurrence references are designed.

---

# 3. Core Architectural Question

Task 2.24 must answer:

> What facts prove that an authored source referenced today is the same semantic source lifetime that a durable occurrence reference originally targeted?

And therefore:

> What must change when a source is deleted, recreated, replaced, restored from a profile, restored from a backup, migrated, or structurally reconstructed?

The answer must distinguish:

```
source identity
    from
source incarnation / lifetime
    from
occurrence coordinate
    from
runtime object ID
```

---

# 4. Governing Task 2.23 Requirements

Task 2.23 established that durable PlanDecision semantics require lifetime safety for:

* block template;
* block recurrence;
* manual event;
* shift definition;
* shift cycle;
* nested segment / sequence entry.

It also established:

1. every occurrence target requires lifetime-safe source lineage;
2. every member of a conflict target set requires lifetime safety independently;
3. template occurrence lineage depends on both template and recurrence lifetime;
4. manual-event ID alone is insufficient durably;
5. cycle incarnation alone may be insufficient for work if nested segment/sequence-entry or shift-definition lifetime changes;
6. visible/source ID reuse must never transfer old decisions;
7. V1 `OccurrenceIdentity` remains runtime-only;
8. Task 2.24 must compare:

   * OccurrenceIdentity V2;
   * separate durable occurrence reference;
   * V1 occurrence identity plus incarnation-enriched source reference;
9. no PlanDecision persistence is authorized before this boundary is settled.

---

# 5. Objective

Determine:

1. the canonical definition of source incarnation;
2. whether incarnation is required for every authored source or only durable-referenceable sources;
3. what creates a new incarnation;
4. what preserves an existing incarnation;
5. whether editing a source preserves incarnation;
6. whether delete/recreate always creates a new incarnation;
7. how replacement semantics affect incarnation;
8. profile-load semantics;
9. backup-import semantics;
10. active-local historical rehydration semantics;
11. migration semantics;
12. clear/reset semantics;
13. copy/duplicate semantics;
14. nested-source incarnation requirements;
15. template + recurrence composition;
16. manual-event incarnation;
17. shift-definition incarnation;
18. cycle incarnation;
19. segment/sequence-entry incarnation;
20. occurrence-coordinate requirements;
21. conflict-reference requirements;
22. whether incarnation belongs inside authored objects;
23. whether incarnation is durable user data or infrastructure metadata;
24. durable serialization/versioning requirements;
25. whether existing V1 durable data can receive deterministic incarnation;
26. whether historical records require migration;
27. how unsupported/no-incarnation historical references behave;
28. which occurrence-reference representation should become canonical;
29. whether `OccurrenceIdentity` should evolve or remain runtime-only;
30. the dependency-correct implementation sequence.

---

# 6. Working Definition — Source Incarnation

Investigate and refine:

> A source incarnation is a stable identity for one semantic lifetime of an authored source, preserved across ordinary edits to that same source but changed whenever a new source lifetime is created, even if the human-visible/source ID is reused.

Core example:

```
sourceId = "exercise"
incarnation = A

edit title/duration
    → same incarnation A

delete source
    ↓
later create sourceId = "exercise"
    → new incarnation B
```

A durable reference to A must never resolve to B.

Assess and adopt/revise.

---

# 7. Source ID Versus Incarnation

Establish explicitly:

## Source ID

Current authored identifier used for references and current-snapshot uniqueness.

## Source incarnation

Lifetime discriminator proving continuity across time/replacement boundaries.

Determine whether durable semantic source identity becomes conceptually:

```
source kind
+
source ID
+
incarnation
```

or whether incarnation alone is globally sufficient.

Do not choose encoding prematurely.

---

# 8. Incarnation Stability Rule

Evaluate:

> Ordinary mutation of an existing authored source preserves incarnation.

Examples:

* rename template;
* change template duration;
* change priority;
* edit recurrence weekday;
* edit manual-event title/time;
* edit shift definition;
* edit cycle configuration.

These edits may stale/revalidate PlanDecisions, but they do not necessarily create a new source lifetime.

Determine exceptions.

---

# 9. Incarnation Replacement Rule

Evaluate:

> An operation that semantically replaces one source object with a different source lifetime must create/use a different incarnation even when the source ID is unchanged.

Examples:

* delete then recreate;
* explicit duplicate/copy;
* destructive replacement;
* imported source replacing current source.

This boundary requires precision.

---

# 10. Delete / Recreate

Adopt or reject:

> Delete followed by creation is always a new incarnation.

This must hold even when:

* same source ID is manually supplied;
* same title/content is reproduced;
* same recurrence configuration is recreated.

A later object that happens to be structurally equal is not automatically the same source lifetime.

---

# 11. Edit Versus Recreate

Identify executable operations that currently distinguish:

* edit existing object;
* delete existing + add new;
* full authored replacement.

Determine whether current code preserves enough operation provenance to assign lifetime semantics later.

If not, identify required future mutation-boundary changes.

---

# 12. Full Setup Commit

`commitAuthoredSetup` currently receives complete setup-owned collections.

It may not know which array object represents:

* edit of existing source;
* deletion;
* replacement by same ID;
* creation.

Task 2.24 must investigate whether incarnation preservation can be derived from:

* prior state + candidate state;
* matching source ID;
* explicit UI operation history;
* incarnation already embedded in source.

This is important.

---

# 13. ID-Match Preservation Hazard

If incarnation is preserved solely because old and new source share the same `id`, then:

```
delete source A
+
create source B with same id
in one atomic setup commit
```

could incorrectly inherit A's incarnation.

Determine whether current workflow can produce that situation.

Do not assume ID equality proves lifetime continuity.

---

# 14. Explicit Mutation Identity

Assess whether future authoring APIs need to make operations explicit:

* create source;
* update source;
* delete source;
* replace source.

This may be cleaner than inferring lifetime from whole-snapshot diff.

Do not redesign store yet.

Determine architectural requirement.

---

# 15. Current Setup Draft Limitation

Setup currently edits a complete local draft and commits atomically.

Investigate whether a user can:

1. delete an item from draft;
2. create another with same source ID before commit;
3. produce final snapshot indistinguishable from an edit by ID.

If yes, source incarnation cannot be assigned correctly from final snapshot alone.

Record as a critical future authoring-boundary requirement.

---

# 16. Manual Event Mutation Boundary

Manual events currently use a dedicated create/edit/delete workflow.

Determine whether that workflow already provides enough explicit operation identity to:

* preserve incarnation on edit;
* create new incarnation on create;
* retire lifetime on delete.

Contrast with Setup collections.

---

# 17. Source-Incarnation Ownership

Determine which layer owns creation/preservation of incarnation.

Possible:

* UI;
* store;
* Authoring Service;
* source constructor/helper.

Architecture likely favors Authoring Service/store domain boundary.

UI must not assign arbitrary lifetime identity.

Assess.

---

# 18. Incarnation Allocator Requirements

Determine conceptual allocator requirements.

Potential properties:

* globally unique;
* source-kind scoped;
* opaque;
* deterministic;
* random UUID-like;
* monotonic.

Do not choose implementation library.

The core requirement is collision resistance sufficient for durable user-data references.

---

# 19. Deterministic Versus Random Incarnation

Compare:

## Deterministic from source content/ID

Risk:

* recreated identical source gets same incarnation;
* edits may accidentally change lifetime.

## Random/opaque at creation

Benefit:

* edit stability;
* delete/recreate distinction.

## Monotonic local generation

Potential durable/device implications.

Produce a decision matrix.

---

# 20. Required Incarnation Generation Matrix

| Strategy              | Stable Across Edit | Distinguishes Recreate | Offline | Import/Restore Friendly | Collision Risk | Recommendation |
| --------------------- | -----------------: | ---------------------: | ------: | ----------------------: | -------------: | -------------- |
| content-derived       |                    |                        |         |                         |                |                |
| ID-derived            |                    |                        |         |                         |                |                |
| random opaque token   |                    |                        |         |                         |                |                |
| local monotonic token |                    |                        |         |                         |                |                |

---

# 21. Incarnation As Authored Data

Determine whether incarnation itself should be treated as:

* authored user data;
* durable identity metadata attached to authored source;
* infrastructure metadata outside authored objects.

It is not user-entered intent, but durable references depend on it.

Assess how it fits:

* Domain Object identity;
* provenance;
* backup;
* profile;
* migration.

---

# 22. Durability Requirement

If incarnation is required for durable PlanDecision references, incarnation must itself survive:

* restart;
* profile/save/restore where appropriate;
* backup/export/import where appropriate;
* migration.

Therefore purely runtime incarnation is insufficient.

Confirm.

---

# 23. Source Object Integration

Assess whether durable source objects should eventually contain something conceptually equivalent to:

```
id
incarnation
```

or:

```
sourceIdentity {
    id
    incarnation
}
```

Do not design field names.

Determine whether embedding incarnation with the source is preferable to maintaining a separate mapping.

---

# 24. Separate Incarnation Registry Model

Alternative:

```
sourceId → incarnation
```

stored separately.

Assess:

* synchronization risk;
* deletion/recreation semantics;
* profile/backup portability;
* nested-source handling;
* migration.

Produce comparison.

---

# 25. Required Storage Model Matrix

| Model                          | Source Coupling | Portability | Replacement Clarity | Migration Complexity | Recommendation |
| ------------------------------ | --------------: | ----------: | ------------------: | -------------------: | -------------- |
| incarnation embedded in source |                 |             |                     |                      |                |
| separate registry              |                 |             |                     |                      |                |
| hybrid                         |                 |             |                     |                      |                |

---

# 26. Template Incarnation

Determine template lifetime semantics.

A template edit should generally preserve incarnation.

Template delete/recreate should not.

If profile/backup restoration contains the historical template, determine whether restoration should restore its incarnation or create a new one.

This depends on restore semantics addressed later in this task.

---

# 27. Recurrence Incarnation

Recurrence is an independently authored occurrence-production rule.

Determine:

* edit recurrence → same incarnation?
* delete/recreate recurrence → new incarnation?
* moving recurrence to different template → same lifetime or replacement?
* changing recurrence frequency fundamentally → edit or new lifetime?

Do not assume every structural change is edit.

Establish semantic boundary.

---

# 28. Recurrence Retargeting

If a recurrence's `templateId` changes from template A to B while recurrence object ID remains:

Is that:

* same recurrence lifetime now targeting a different source;
* semantically new recurrence lifetime;
* invalid current mutation under architecture?

Investigate executable support.

This matters because occurrence lineage uses both template and recurrence.

---

# 29. Template + Recurrence Composite Lineage

Task 2.23 established both template and recurrence lifetime matter.

Determine canonical concept:

```
TemplateOccurrenceLineage
    = template lifetime
    + recurrence lifetime
    + recurrence scope coordinate/slot
```

If either source incarnation changes, occurrence lifetime reference no longer matches.

Adopt/revise.

---

# 30. Daily / Weekday / Weekly Coordinates

Preserve Task 2.10 canonical occurrence coordinates:

* `userDayDate`;
* `userWeekStartDate`;
* stable slot.

Determine whether these remain sufficient once lifetime-safe source references are added.

---

# 31. `timesPerUserWeek` Slot

Task 2.10 established stable canonical slot before window clipping.

Confirm this remains appropriate for durable occurrence reference.

Investigate whether editing `timesPerUserWeek` count can cause old slots to refer ambiguously.

Example:

```
old count = 3
slot 2 decision exists

recurrence edited to count = 2
```

Old slot 2 likely becomes stale/obsolete, not reassigned.

Define.

---

# 32. Manual Event Incarnation

Manual events are one-off authored sources whose authored `id` becomes V1 occurrence identity.

Determine:

* edit existing manual event → preserve incarnation;
* delete/recreate same ID → new incarnation;
* copy event → new incarnation;
* profile/backup restore → semantics to decide.

Occurrence coordinate may be inherent in the event's date/time but source lifetime remains necessary.

---

# 33. Shift Definition Incarnation

Shift definitions may be referenced by multiple cycle segments.

Determine:

* ordinary shift-time edit preserves incarnation;
* delete/recreate same ID does not;
* retargeting segment to another shift definition changes work occurrence lineage;
* profile/backup restoration implications.

---

# 34. Shift Cycle Incarnation

Cycle defines work recurrence lineage.

Determine:

* ordinary cycle edit;
* cycle range/date edit;
* sequence edit;
* delete/recreate;
* full profile/backup restore.

Which preserve lifetime?

Some changes may cause occurrences to disappear or revalidate without necessarily creating a new cycle lifetime.

---

# 35. Nested Segment Incarnation

Task 2.23 requires nested work-source lifetime safety.

Determine whether every shift-cycle segment needs an independent durable incarnation.

If segment ID is unique only within cycle, durable semantic identity likely requires:

```
cycle incarnation
+
segment ID
+
segment incarnation
```

Assess.

---

# 36. Sequence-Entry Incarnation

Likewise for repeating cycle sequence entries.

Determine whether:

* reordering same entries preserves incarnation;
* editing shift assignment preserves incarnation;
* deleting/recreating entry creates new incarnation;
* stable slot/index is insufficient.

---

# 37. Reordering Nested Sources

If nested entries are moved in array order while retaining identity:

* should incarnation remain?
* occurrence coordinate/order semantics may change.

Determine whether order is source state subject to revalidation rather than lifetime.

Do not use array position as incarnation.

---

# 38. Nested ID Scope

Document current scope of:

* segment IDs;
* sequence-entry IDs.

Are they globally unique or cycle-local?

Lifetime-safe durable reference must encode enough parent lineage to resolve correctly.

---

# 39. Work Occurrence Durable Lineage

Establish required conceptual chain.

Candidate:

```
shift-cycle lifetime
    +
segment-or-sequence-entry lifetime
    +
shift-definition lifetime
    +
canonical local start date
    +
slot
```

Determine whether all are necessary.

Produce a work-reference matrix.

---

# 40. Required Work Reference Matrix

| Component                    | Needed? | Why |
| ---------------------------- | ------: | --- |
| cycle ID                     |         |     |
| cycle incarnation            |         |     |
| segment/sequence ID          |         |     |
| nested incarnation           |         |     |
| shift-definition ID          |         |     |
| shift-definition incarnation |         |     |
| local start date             |         |     |
| slot                         |         |     |

---

# 41. Conflict Reference Composition

PlanDecision conflict acceptance targets multiple occurrences.

A durable conflict reference must be composed from complete lifetime-safe occurrence references.

Do not introduce a separate source-lifetime shortcut for conflict.

Determine canonical ordering/canonicalization.

---

# 42. Conflict Set Canonicalization

Task 2.23 chose unordered occurrence pair/set.

Determine whether canonical durable comparison should sort references by:

* serialized stable semantic key;
* source kind + identity;
* another canonical representation.

Do not depend on insertion order.

---

# 43. Conflict Fingerprint Boundary

Incarnation solves source lifetime, not conflict equivalence.

Task 2.23 also requires material conflict fingerprint/revalidation.

Clarify:

```
durable occurrence reference
    proves same participants

conflict fingerprint
    proves same materially accepted conflict
```

Do not conflate these.

---

# 44. Occurrence Coordinate Versus Lifetime

Establish explicit layers:

## Source lifetime

Who/what generated the occurrence.

## Occurrence coordinate

Which occurrence in that lifetime.

Examples:

* user-day date;
* user-week start + slot;
* work local-start date;
* manual one-off coordinate.

Both are required.

---

# 45. DurableOccurrenceReference Working Definition

Investigate:

> A DurableOccurrenceReference is a stable semantic reference composed of lifetime-safe source lineage plus canonical occurrence coordinates, suitable for persisted PlanDecision targets.

Assess whether this should become distinct from `OccurrenceIdentity`.

---

# 46. Representation Model A — OccurrenceIdentity V2

Concept:

```
OccurrenceIdentity V2
    includes incarnation fields
    and becomes durable-reference safe
```

Advantages:

* one occurrence identity concept.

Risks:

* current runtime identity and durable reference responsibilities become coupled;
* migrations/version support required whenever reference semantics change.

Assess.

---

# 47. Representation Model B — Separate DurableOccurrenceReference

Concept:

```
OccurrenceIdentity V1
    = runtime semantic identity

DurableOccurrenceReference V1
    = durable source lifetime + occurrence coordinate
```

Advantages:

* runtime identity can remain lightweight;
* durable compatibility versioning independent.

Risks:

* two related identity concepts.

Assess.

---

# 48. Representation Model C — V1 Identity + Separate Source Incarnation

Concept:

```
{
  occurrenceIdentity: V1,
  sourceIncarnationReference: ...
}
```

Assess:

* duplication;
* mismatch risk;
* canonical comparison;
* migration.

---

# 49. Required Reference Model Matrix

| Model                               | Runtime Simplicity | Durable Clarity | Version Independence | Drift Risk | Migration Complexity | Recommendation |
| ----------------------------------- | -----------------: | --------------: | -------------------: | ---------: | -------------------: | -------------- |
| OccurrenceIdentity V2               |                    |                 |                      |            |                      |                |
| separate DurableOccurrenceReference |                    |                 |                      |            |                      |                |
| V1 + incarnation companion          |                    |                 |                      |            |                      |                |

---

# 50. Canonical Durable Reference Choice

Task 2.24 must adopt one representation model or explicitly identify a blocker.

The chosen model must support:

* all PlanDecision-ready occurrence kinds;
* conflicts;
* independent durable versioning;
* historical compatibility;
* unsupported-reference handling.

---

# 51. Runtime OccurrenceIdentity Future

Determine whether `OccurrenceIdentity V1` should:

* remain unchanged for runtime;
* eventually be generated from durable reference;
* eventually retire;
* coexist permanently.

No code change.

---

# 52. Reference Versioning

If separate durable reference is adopted, determine whether it needs an explicit independent version.

Likely yes.

Do not assign concrete version number beyond conceptual first version unless necessary.

---

# 53. Source Incarnation Versioning

Determine whether incarnation token itself needs a format/version or whether opaque string identity is enough.

The containing durable reference/schema may carry version.

Avoid unnecessary nested versioning.

---

# 54. Incarnation Preservation On Ordinary Active Rehydration

If current active durable state already contains incarnation metadata in future:

* rehydration preserves it exactly;
* ordinary load does not allocate new incarnation.

Confirm.

---

# 55. Legacy Active State Without Incarnation

Existing V1 authored data contains no incarnation metadata.

Task 2.24 must determine migration policy conceptually.

Possible:

## A. Allocate deterministic/new incarnations at migration.

## B. Treat legacy sources as one migration-established incarnation each.

## C. Require user recovery.

Likely deterministic migration is possible because there are no existing durable PlanDecision references yet.

Assess.

---

# 56. Legacy Migration Safety

Important current advantage:

> No durable PlanDecision currently exists.

Therefore legacy source incarnation can be assigned during migration without needing to preserve compatibility with preexisting decision references.

Confirm.

This may make first migration much easier.

---

# 57. Legacy Incarnation Allocation

If existing source receives a newly generated incarnation during migration:

* that incarnation must be durably written atomically;
* in-memory assignment alone is not completed migration;
* Phase 1 durable-data governance applies.

Determine migration implications.

---

# 58. Migration Idempotence

A partially/failed migration must not allocate a different incarnation every startup.

Therefore migration must be durable/atomic or have deterministic/resumable identity.

This is critical.

Determine whether random incarnation allocation creates special migration transaction requirements.

---

# 59. Migration Strategy Matrix

Compare:

| Strategy                                       | Stable Across Failed Migration Retry | Collision Safety | Requires Durable Write Before Runtime Use | Complexity | Recommendation |
| ---------------------------------------------- | -----------------------------------: | ---------------: | ----------------------------------------: | ---------: | -------------- |
| random allocate then atomic rewrite            |                                      |                  |                                           |            |                |
| deterministic legacy token from source+surface |                                      |                  |                                           |            |                |
| migration journal                              |                                      |                  |                                           |            |                |

Do not implement.

---

# 60. Deterministic Legacy Token Risk

If deterministic legacy incarnation is derived from visible ID only:

* delete/recreate legacy-era source before migration may be indistinguishable.

But no durable PlanDecision existed during that era.

Determine whether this historical ambiguity matters after migration.

Likely current migrated object simply establishes the starting lifetime at migration time.

Assess.

---

# 61. Migration Moment As Lifetime Baseline

Potential principle:

> For historical source data created before incarnation existed, migration establishes the incarnation of the source object currently present in the durable snapshot; DayFrame makes no claim to distinguish its pre-migration lifetime history.

This may be sufficient because no durable lifetime-dependent references existed before migration.

Assess/adopt.

---

# 62. Profiles Without Incarnation

Existing profiles contain authored setup without incarnation.

Determine migration/restore semantics.

Possible approaches:

* migrate profile collection durably;
* allocate incarnations when profile is migrated;
* allocate new incarnations each time profile is loaded.

These produce very different semantics.

---

# 63. What Does Profile Represent?

Task 2.23 says profiles are reusable setup snapshots, not active plan authority.

This strongly affects incarnation.

Question:

> Does loading the same saved profile twice represent restoring the same source lifetimes or creating new active source lifetimes from a reusable template snapshot?

This is a fundamental decision.

---

# 64. Profile Model A — Preserve Source Incarnations

Profile stores source incarnation.

Loading profile restores those same source lifetimes.

Potential consequence:

* decisions from earlier use of the same profile could reattach after load.

Is that desirable?

Assess.

---

# 65. Profile Model B — Instantiate New Source Incarnations On Load

Profile remains reusable authored pattern snapshot.

Each load creates new active source lifetimes.

Potential consequence:

* existing active PlanDecisions never silently attach to restored profile objects merely because profile IDs match.

This may better match reusable-profile semantics.

Assess.

---

# 66. Required Profile Incarnation Matrix

| Model                   | Profile As Reusable Pattern | Restores Same Lifetime | Prevents Old Decision Reattachment | Portability | Recommendation |
| ----------------------- | --------------------------: | ---------------------: | ---------------------------------: | ----------: | -------------- |
| preserve incarnations   |                             |                        |                                    |             |                |
| instantiate new on load |                             |                        |                                    |             |                |
| hybrid                  |                             |                        |                                    |             |                |

---

# 67. Profile Save Semantics

If profile load creates fresh active incarnations, what does profile save store?

Possibilities:

* omit incarnation;
* preserve pattern-level source IDs only;
* store profile-internal identity separate from active incarnation.

Determine conceptual requirement.

This may be evidence that incarnation should not simply be embedded into `DayFrameAuthoredSetup` indiscriminately.

---

# 68. Backup Semantics

Backups are different from profiles.

Task 2.23 says backups are recovery artifacts.

Question:

> Should backup import restore the same source lifetimes represented at export, or instantiate new source lifetimes?

Recovery semantics may favor preservation.

Assess separately.

---

# 69. Backup Model A — Preserve Incarnations

Export includes source incarnation.

Import restores same lifetimes.

Benefits:

* true recovery continuity;
* future PlanDecision references could remain meaningful if included/coordinated.

Risks:

* duplicate copies/imported alongside existing state may recreate same lifetime in multiple contexts.

Assess.

---

# 70. Backup Model B — Instantiate New Incarnations

Import treats backup as reusable setup material.

This may violate recovery semantics.

Assess.

---

# 71. Required Backup Incarnation Matrix

| Model                 | Recovery Fidelity | Decision Continuity | Duplicate-Lifetime Risk | User Expectation | Recommendation |
| --------------------- | ----------------: | ------------------: | ----------------------: | ---------------: | -------------- |
| preserve incarnations |                   |                     |                         |                  |                |
| instantiate new       |                   |                     |                         |                  |                |
| context-dependent     |                   |                     |                         |                  |                |

---

# 72. Active Replacement Semantics

Profile load and backup import currently replace active authored state.

If incarnation policies differ:

```
profile load
    → may instantiate

backup import
    → may restore
```

Task 2.24 must decide whether that asymmetry is architecturally valid.

Likely yes if artifacts have different semantics.

---

# 73. Active Recovery Semantics

Tasks 2.18–2.21 added active-local recovery.

Future source incarnation affects:

* protected historical setup;
* current session replacement;
* abandonment.

Determine:

## Replace protected checkpoint with current session

Should preserve current session incarnations.

## Abandon/reset

New default/future-created sources get new incarnations.

Confirm conceptually.

---

# 74. Safe Fallback Incarnations

During future startup recovery safe fallback:

* empty/default source collections may have no source incarnation to allocate until sources exist;
* default authored source objects, if any, need identity semantics.

Inspect current defaults.

Do not over-design.

---

# 75. Clear / Reset

`clearLocalData()` removes active state.

After subsequent new source creation, new incarnations must be allocated.

Clear must never preserve hidden source-lifetime mappings that cause recreated IDs to inherit old incarnations.

This is a requirement against separate registry residue.

---

# 76. Copy / Duplicate Source

If future/current UI duplicates a template/source:

* copied data gets a new source ID and new incarnation;
* copying never means same lifetime.

Confirm current duplication capabilities or mark future.

---

# 77. Import / Merge

Current backup/profile load are replacement, not merge.

If future merge/import exists:

* imported objects require explicit lifetime policy.

Out of current scope, but note future requirement.

---

# 78. Cross-Device Portability

If backup preserves incarnation, source lifetime must remain stable across devices.

Therefore incarnation cannot depend on local device/session identity.

Confirm.

---

# 79. Collision Safety

Durable incarnation token must have collision risk low enough that independent offline DayFrame instances can generate identities safely.

This argues against simple local counters unless namespace exists.

Record requirement.

---

# 80. Human Readability

Incarnation need not be user-readable.

Avoid tying semantics to titles or visible IDs.

Opaque durable token is acceptable if provenance can explain associated source.

---

# 81. Privacy / Security

Incarnation should not encode sensitive source content unnecessarily.

Content hashes may leak equality/content clues and create recreate-equivalence problems.

Assess as secondary design criterion.

---

# 82. Referential Equality

Define semantic equality of source lifetime.

Potential:

```
same source kind
AND same source ID
AND same incarnation
```

If source IDs can change through rename-like operation, perhaps incarnation alone should dominate.

Determine whether source IDs are mutable today.

---

# 83. Source ID Mutation

Inspect whether authored IDs can be edited after creation.

If IDs are immutable by workflow, pair semantics are straightforward.

If IDs can change, determine whether incarnation preserves identity across ID change or ID change is effectively replacement.

This is critical.

---

# 84. Durable Reference Resolution

A durable reference should resolve by incarnation-safe lineage, not simply source ID lookup.

Determine conceptual resolver behavior when:

* source ID matches, incarnation differs;
* incarnation matches, source ID differs;
* source missing;
* historical unsupported reference.

---

# 85. ID As Diagnostic / Routing Hint

One possible model:

* incarnation is identity;
* source ID is routing/provenance metadata.

Or pair may be identity.

Assess.

---

# 86. Nested Source Resolution

For work references, resolver must avoid accidental matches across:

* cycle incarnation mismatch;
* nested incarnation mismatch;
* shift-definition incarnation mismatch.

Determine whether all components must match.

Likely yes.

---

# 87. Partial Lifetime Match

Example:

```
same cycle incarnation
same segment incarnation
different shift-definition incarnation
```

The work occurrence is semantically changed.

Should old PlanDecision:

* stale/revalidate;
* obsolete;
* orphaned?

Task 2.23 suggested work lineage includes shift definition.

Determine classification implications.

---

# 88. Occurrence Reference Resolution Result

Future resolver likely needs explicit statuses:

* matched;
* sourceLifetimeMismatch;
* sourceMissing;
* occurrenceMissing;
* unsupportedReferenceVersion;
* ambiguousLegacyReference.

Do not design final union.

Identify required semantic distinctions.

---

# 89. Unsupported Durable Reference

Future PlanDecision may outlive occurrence-reference version support.

Phase 1 governance requires non-destructive unsupported-format handling.

Determine:

* decision cannot apply;
* preserve decision;
* classify orphaned/recovery-required;
* conversion path needed.

No implementation.

---

# 90. Reference Migration

If durable occurrence reference evolves later:

* decisions require conversion/migration;
* source incarnation must remain stable across reference-version migrations.

Establish that source lifetime identity should outlive representation versions.

---

# 91. Incarnation Rotation

Determine whether incarnation should ever change for an existing source without deletion/recreation.

Potential reasons:

* semantic reset;
* migration;
* corruption recovery.

Preferred bias:

> No automatic rotation on ordinary edit or migration.

If rotation is ever needed, it is explicit source-lifetime replacement.

Assess.

---

# 92. Migration Must Preserve Lifetime Once Established

After incarnation is introduced and persisted:

* future migrations must preserve it unless architecture explicitly declares a source replacement.

This becomes a durable compatibility invariant.

---

# 93. Profile Duplication And Incarnation

If user saves active setup as two differently named profiles:

* do those profiles carry same pattern identity?
* if profiles instantiate fresh source lifetimes on load, incarnation may not belong in saved profile data.

This is important to source-incarnation storage model.

Investigate.

---

# 94. Backup Duplication And Incarnation

Copying a backup file should not alter represented lifetime.

If imported as recovery, repeated imports may restore same source incarnation repeatedly.

Determine implications for decision reattachment and active replacement.

---

# 95. Repeated Backup Import

If same backup is imported twice at different times:

* should it restore same source lifetime both times?
* if current source evolved in between, imported backup represents historical continuation or rewind of same lifetime?

This is subtle.

Assess recovery semantics and PlanDecision safety.

---

# 96. Restore Versus Fork

Potential distinction:

## Restore

Preserve source incarnation.

## Import as new/fork

Generate new incarnation.

Current DayFrame has one backup import workflow, not this distinction.

Determine which semantics existing "Import backup" most truthfully represents.

---

# 97. Backup Rollback

If backup import restores same incarnation but older source content:

existing PlanDecisions for that incarnation might revalidate against older state.

That may be correct recovery behavior, or unsafe.

Task 2.24 must identify implications.

Do not solve PlanDecision replacement policy here.

---

# 98. Profiles And Existing Decisions

If profile load instantiates new incarnations, existing decisions become orphaned/obsolete rather than matching by IDs.

This may be desirable and aligns Task 2.23's requirement that profile load revalidate decisions.

Assess.

---

# 99. Backup And Existing Decisions

If backup preserves incarnations, existing decisions may still match depending on occurrence/dependency facts.

Determine whether this creates surprising cross-artifact coupling.

May require future backup/decision transaction semantics.

Document.

---

# 100. Incarnation And PlanDecision Surface Separation

Task 2.23 recommends separate PlanDecision durable surface.

Source incarnation still belongs with/alongside source authority because decisions cannot own source lifetime.

Confirm.

---

# 101. Profiles Without Decisions

Profiles may be reusable setup without PlanDecisions.

If profile also omits active incarnation by design, source lifetime is instantiated on load.

This may preserve clean separation.

Assess as candidate architecture.

---

# 102. Backups With Future Decisions

If future backup includes active PlanDecisions, it almost certainly must preserve source incarnations consistently with those decisions.

This supports backup-preserve semantics.

Record.

---

# 103. Current Backup V1

Current V1 backup has no incarnation or decisions.

Do not modify.

Task 2.24 only defines future semantic requirement.

---

# 104. Current Profile Version

Current profile format has no incarnation.

Do not modify.

Future profile semantics depend on adopted profile model.

---

# 105. Active Local Format

Active local state eventually must preserve current source incarnations.

That implies independent active durable format migration/versioning under Phase 1 policy.

Identify but do not implement.

---

# 106. DayFrameAuthoredSetup Implication

Task 2.23 preserved PlanDecisions outside `DayFrameAuthoredSetup`.

Task 2.24 must determine whether incarnation metadata is logically part of each authored source's identity while still traveling through:

* active state;
* backup;
* maybe profile depending semantics.

Do not modify the type.

---

# 107. User-Authored Versus System-Assigned Identity

Incarnation is system-assigned but attached to user-authored source.

Clarify that this does not make it derived planning information.

It is identity/provenance metadata required to preserve authored-object continuity.

---

# 108. Architecture Category

Determine whether source incarnation is:

* part of Named Domain Object identity;
* provenance metadata;
* infrastructure identifier.

Use canonical architecture.

No new Domain Object required merely for token unless justified.

---

# 109. Authoring Service Responsibility

Future source-creation Authoring Service should assign incarnation.

Future source-edit service preserves it.

Future delete/recreate creates new.

Determine whether this should become an explicit architectural invariant.

---

# 110. Store Enforcement

Even if services produce sources, store boundary should likely reject:

* missing incarnation on current-format new source;
* duplicate incarnation among incompatible live sources;
* caller-supplied resurrection of retired incarnation without authorized restore semantics.

Assess future validation needs.

---

# 111. Duplicate Incarnation

Can two simultaneously live sources share one incarnation?

Likely no within same source kind/lifetime authority.

Backups/profiles may contain copied representations depending artifact semantics.

Define active-state uniqueness requirement.

---

# 112. Incarnation Reuse Prohibition

Once a source lifetime ends through deletion, ordinary creation must never reuse that incarnation.

Restore semantics may intentionally reintroduce a historical incarnation.

This distinction must be explicit.

---

# 113. Retired Incarnation Registry Question

To prevent random reuse, a strong random token may not need a durable registry of retired IDs.

If incarnation is user-supplied/local counter, registry may be needed.

This supports opaque collision-resistant generation.

Assess.

---

# 114. Deleted Source History

DayFrame currently has no source-lifetime tombstone/history.

Determine whether durable PlanDecision safety requires tombstones.

If random opaque incarnations and decisions retain their target incarnation, absence may be enough to classify source missing/obsolete.

Likely tombstones are not required initially.

Assess.

---

# 115. Orphan Classification Without Tombstone

A decision targeting a source incarnation absent from active authority can be orphaned.

To distinguish deleted versus not currently loaded/restored, future replacement semantics may matter.

Task 2.23 already allows obsolete/orphaned distinction.

Determine whether incarnation alone supports enough classification.

---

# 116. Historical Source Reappearance

A backup restore may intentionally bring an old incarnation back.

An orphaned decision could become applicable again if same lifetime is restored and dependencies match.

Is that desirable?

This depends strongly on backup-preserve semantics.

Assess.

---

# 117. Dormant Versus Orphaned Across Replacement

Profile load with fresh incarnations likely makes old decisions orphaned.

Backup restore preserving old incarnation may reactivate them.

This may be coherent if artifact semantics are explicit.

Record.

---

# 118. Incarnation And Retention

Source incarnation has no independent retention lifecycle once source and all references are gone unless history exists.

Do not add registry/history without need.

---

# 119. Reference Provenance

Durable occurrence reference should expose enough provenance to identify:

* source kind;
* human/source IDs where useful;
* incarnation;
* recurrence/work lineage;
* occurrence coordinate.

Opaque incarnation alone is insufficient for explainable diagnostics.

---

# 120. Explainability

Future UI should be able to explain:

> This decision referred to the occurrence generated by Template X / Recurrence Y from those specific source lifetimes.

If source is gone:

> The original source lifetime is no longer active.

No raw token display is required.

---

# 121. Serialization Equality

Durable reference needs a canonical structural equality rule.

Do not rely on object reference equality.

Determine required normalization/order rules.

---

# 122. Canonical Key

PlanDecisionSet is keyed by semantic target/dimension.

A durable occurrence/conflict reference may need a canonical key representation.

Determine whether key should be:

* serialized structured identity;
* separate stable reference ID;
* another deterministic canonical encoding.

No implementation.

---

# 123. Key Versioning

If canonical key embeds reference structure, schema evolution becomes harder.

Separate decision ID plus structural target may be preferable.

Assess without over-design.

---

# 124. Conflict Key

Conflict decisions need canonical unordered target set + kind.

Determine whether a derived key can be computed from durable references rather than persisted as authority.

Likely yes.

---

# 125. Validation Requirements For Future Durable References

Future validator must establish:

* supported reference version;
* supported source kind;
* complete source lifetime components;
* valid occurrence coordinate;
* no malformed/duplicate target members;
* canonical conflict ordering where applicable.

Identify.

---

# 126. Reference Resolution Versus Structural Validation

Keep separate:

## Structural reference validity

Reference shape is understood.

## Semantic resolution

Referenced source lifetime/occurrence exists in current authority.

Do not classify unresolved references as malformed.

---

# 127. Historical Unsupported Reference

A structurally valid old reference version that cannot be resolved under current code is user data.

Preserve non-destructively.

Phase 1 compatibility governance applies.

---

# 128. Migration Atomicity

When active sources gain incarnation for first time, migration must ensure:

```
source incarnation assignment
    +
durable active rewrite
```

becomes one recoverable migration boundary.

Do not expose runtime as durably migrated before rewrite succeeds.

---

# 129. Profile Migration Atomicity

If profiles eventually store pattern/source incarnation metadata, collection migration must preserve invalid records according to Phase 1 policy.

Task 2.17 identified existing raw-profile preservation gaps.

Source-incarnation migration should not ignore those.

Record dependency.

---

# 130. Backup Versioning

If future backup preserves incarnations, it requires explicit newer version/envelope semantics.

V1 remains unchanged.

---

# 131. PlanDecision Persistence Prerequisite

Before first durable PlanDecision is written, DayFrame must already have:

1. lifetime-safe active source identities;
2. durable occurrence-reference representation;
3. migrated current active source authority;
4. source-reference validation;
5. explicit decision durable format/version.

This sequencing is mandatory.

---

# 132. Source-Incarnation Implementation Sequencing

Task 2.24 should determine whether implementation should proceed:

## A. identity model/types first;

## B. source-authoring operation semantics first;

## C. durable migration/versioning first;

## D. combined staged sequence.

Likely multiple tasks are required.

---

# 133. Setup Workflow Problem

If Setup atomic commits cannot distinguish edit from delete/recreate with same ID, source incarnation implementation cannot be correct merely by adding fields.

This may become the immediate next prerequisite.

Task 2.24 must explicitly determine whether such ambiguity exists.

---

# 134. Candidate Task 2.25 — Authoring Operation Identity

If required:

> **Task 2.25 — Establish Explicit Source Creation, Update, Deletion, and Replacement Authority for Incarnation Preservation**

Investigation or implementation depending evidence.

---

# 135. Candidate Task 2.25 — Incarnation Model

If operation semantics are already sufficient:

> **Task 2.25 — Implement Runtime Source-Incarnation Model and Lifetime Allocation**

without persistence yet, if safe.

But beware temporary non-durable incarnation authority.

Task 2.22 rejected temporary session-only PlanDecision; similar reasoning may reject runtime-only incarnation if it creates migration debt.

Assess.

---

# 136. Durable-First Incarnation

Likely preferable:

> Do not introduce incarnation into current authority until durable migration/version semantics are ready.

Because incarnation exists specifically to support durable references.

Assess.

---

# 137. Required Staging Matrix

| Staging Model                            | Immediate Value | Migration Debt | Durable Safety | Complexity | Recommendation |
| ---------------------------------------- | --------------: | -------------: | -------------: | ---------: | -------------- |
| runtime incarnation first                |                 |                |                |            |                |
| durable incarnation + migration together |                 |                |                |            |                |
| authoring-operation boundary first       |                 |                |                |            |                |

---

# 138. Interim OccurrenceIdentity

V1 remains adequate for ephemeral Try/Preview behavior.

No urgency to mutate it before durable-reference work.

Confirm.

---

# 139. Interim PlanDecision

No PlanDecision implementation before lifetime-safe references.

Current Try behavior remains.

Confirm.

---

# 140. Recovery Substitution

Task 2.23 blocked recovery-substitution PlanDecision semantics.

Source-incarnation work should not wait for it.

Reference model must be general enough for template occurrence targets but need not model replacement-source lineage yet.

---

# 141. `addResource`

Out of scope.

Do not include resource identity in incarnation design without executable semantics.

---

# 142. Required Source-Incarnation Matrix

Produce:

| Source Type      | Current ID Scope | Edit Preserves Incarnation? | Delete/Recreate New? | Needed In Durable Occurrence Reference? | Artifact Restore Policy |
| ---------------- | ---------------- | --------------------------: | -------------------: | --------------------------------------: | ----------------------- |
| block template   |                  |                             |                      |                                         |                         |
| recurrence       |                  |                             |                      |                                         |                         |
| manual event     |                  |                             |                      |                                         |                         |
| shift definition |                  |                             |                      |                                         |                         |
| shift cycle      |                  |                             |                      |                                         |                         |
| segment          |                  |                             |                      |                                         |                         |
| sequence entry   |                  |                             |                      |                                         |                         |

---

# 143. Required Operation Matrix

For each source type:

| Operation           | Preserve Incarnation | New Incarnation | Restore Existing | Unresolved |
| ------------------- | -------------------: | --------------: | ---------------: | ---------: |
| ordinary edit       |                      |                 |                  |            |
| delete              |                      |                 |                  |            |
| recreate same ID    |                      |                 |                  |            |
| duplicate           |                      |                 |                  |            |
| profile load        |                      |                 |                  |            |
| backup import       |                      |                 |                  |            |
| active rehydrate    |                      |                 |                  |            |
| migration           |                      |                 |                  |            |
| clear then recreate |                      |                 |                  |            |

---

# 144. Required Artifact Semantics Matrix

| Artifact / Surface                 | Represents Reusable Pattern? | Represents Recovery Continuity? | Store Incarnation? | Restore Or Instantiate? |
| ---------------------------------- | ---------------------------: | ------------------------------: | -----------------: | ----------------------- |
| active local state                 |                              |                                 |                    |                         |
| saved profile                      |                              |                                 |                    |                         |
| backup                             |                              |                                 |                    |                         |
| future active PlanDecision surface |                          n/a |               references source |    target ref only | n/a                     |

---

# 145. Required Durable Reference Matrix

For each occurrence kind:

| Occurrence Kind         | Source Lifetime Components | Coordinate Components | V1 Adequate? | Proposed Durable Model |
| ----------------------- | -------------------------- | --------------------- | -----------: | ---------------------- |
| daily template          |                            |                       |              |                        |
| weekday template        |                            |                       |              |                        |
| weekly template         |                            |                       |              |                        |
| times-per-week template |                            |                       |              |                        |
| manual event            |                            |                       |              |                        |
| work segment            |                            |                       |              |                        |
| work sequence           |                            |                       |              |                        |

---

# 146. Required Representation Matrix

Include Section 49's V2/separate/companion comparison and make an explicit recommendation.

---

# 147. Required Migration Matrix

| Surface         |    Existing Incarnation? | Can Deterministically Establish Initial Lifetime? | Durable Rewrite Required? | Recovery Requirement |
| --------------- | -----------------------: | ------------------------------------------------: | ------------------------: | -------------------- |
| active local    |                       no |                                                   |                           |                      |
| profiles        |                       no |                                                   |                           |                      |
| backups V1      |                       no |                                                   |                           |                      |
| runtime Preview | V1 runtime identity only |                                               n/a |                        no | n/a                  |

---

# 148. Required Identity Invariants

Candidate invariants to evaluate:

1. visible/source ID is not sufficient durable lifetime identity;
2. ordinary edit preserves source incarnation;
3. delete/recreate creates a new incarnation;
4. duplicate/copy creates a new incarnation;
5. incarnation is never derived from mutable content;
6. incarnation is collision-resistant across offline instances;
7. no normal creation reuses retired incarnation;
8. restore semantics may explicitly restore historical incarnation only where artifact semantics authorize it;
9. lifetime-safe occurrence reference combines source incarnation(s) with canonical occurrence coordinate;
10. every conflict participant is lifetime-safe independently;
11. runtime IDs never serve as durable references;
12. V1 OccurrenceIdentity remains non-durable unless explicitly superseded;
13. unsupported references remain preserved rather than silently remapped;
14. migration assignment is not complete until durable rewrite succeeds;
15. future migrations preserve established incarnation;
16. profile and backup incarnation semantics may differ because artifact purposes differ;
17. source lifetime identity survives reference-schema version evolution;
18. a reused visible ID never inherits old PlanDecision authority automatically.

Adopt only evidence-supported invariants.

---

# 149. Required Future Test Contract

Do not add tests now.

Specify future tests for:

## Creation/edit/delete

* creation gets unique incarnation;
* ordinary edit preserves it;
* delete/recreate same ID changes it;
* duplicate source changes it;
* cross-source collision rejection.

## Setup transaction ambiguity

* delete/recreate same ID within one draft commit;
* simple edit;
* atomic multi-source changes.

## Manual events

* edit preserves;
* delete/recreate changes.

## Work lineage

* shift edit preservation;
* shift delete/recreate;
* cycle edit;
* cycle recreate;
* segment recreation;
* sequence-entry recreation;
* reorder without lifetime replacement if adopted.

## References

* same occurrence across overlapping windows has same durable reference;
* same IDs/new incarnation differ;
* conflict canonical ordering;
* source lifetime mismatch;
* missing source;
* unsupported reference version.

## Profiles

According to adopted semantics:

* repeated profile load;
* profile save/load;
* decisions cannot silently attach to fresh-instantiated lifetimes if that model is adopted.

## Backups

* export/import preserves or instantiates according to adopted model;
* repeated import semantics;
* legacy V1 migration.

## Migration

* stable allocation across failed/retried migration;
* in-memory assignment not treated as migration success;
* current plural compatibility preserved.

---

# 150. Architectural Alignment Assessment

Assess source-incarnation model against:

* explicit authority;
* Named Domain Object identity;
* provenance;
* deterministic planning;
* explainability;
* historical compatibility;
* durable-data governance;
* user-data preservation;
* source/decision separation;
* epistemic integrity.

Use:

* Aligned;
* Partially aligned;
* Misaligned;
* Unresolved.

---

# 151. Compatibility Assessment

Determine:

* current V1 durable formats remain readable;
* existing data has no lifetime-dependent durable references;
* initial incarnation migration can therefore establish a baseline without remapping old decisions;
* profile/backup artifact semantics must be explicit before adding incarnation to them;
* no historical reader may be retired as part of this task.

---

# 152. Test Coverage Assessment

Audit current evidence for:

* current ID creation;
* delete/recreate behavior;
* Setup draft operations;
* manual-event workflows;
* profile save/load replacement;
* backup export/import replacement;
* cycle/segment/sequence IDs;
* occurrence identity stability.

Identify gaps relevant to lifetime semantics.

---

# 153. Evidence Classification

Material findings must use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Distinguish current executable identity behavior from proposed lifetime semantics.

---

# 154. Explicit Non-Goals

Task 2.24 shall not:

* add incarnation fields;
* allocate incarnation tokens;
* change source IDs;
* change source constructors;
* change Setup commit;
* change manual-event mutation;
* alter profile load;
* alter backup import;
* alter active rehydration;
* migrate durable data;
* change durable versions;
* change `OccurrenceIdentity`;
* introduce `DurableOccurrenceReference`;
* add PlanDecision;
* persist PlanDecision;
* add identity UI;
* add tombstones/history;
* add storage-event coordination;
* add resource identity;
* resolve recovery-substitution semantics;
* update ADRs;
* update `CURRENT_STATE.md`;
* update `CHANGELOG.md`;
* create a checkpoint;
* perform unrelated cleanup.

Discovery does not authorize implementation.

---

# 155. Required Code And Architecture Inspection

At minimum inspect:

* current source types;
* source ID generators/constructors;
* template creation/edit/delete paths;
* recurrence creation/edit/delete paths;
* manual-event create/edit/delete;
* shift-definition and cycle creation/edit/delete;
* nested segment/sequence identity generation;
* Setup draft and `commitAuthoredSetup`;
* complete authored validator;
* profile save/load normalization;
* backup export/import normalization;
* active local persistence/rehydration;
* clear/reset;
* source creation tests;
* Task 2.10 occurrence identity constructors/tests;
* Task 2.11–2.15 identity/validation results;
* Task 2.23 result;
* durable-data ADR/governance where required.

Use executable evidence for current behavior and architecture/governance for future semantics.

---

# 156. Required Result Artifact Structure

The Task 2.24 result must contain at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Governing Task 2.23 Requirements
5. Source-Incarnation Working Definition
6. Source ID Versus Incarnation
7. Incarnation Stability Rule
8. Incarnation Replacement Rule
9. Delete / Recreate Semantics
10. Edit Versus Recreate Boundary
11. Full Setup Commit Assessment
12. Same-ID Draft Replacement Hazard
13. Explicit Mutation Identity Requirement
14. Manual-Event Operation Boundary
15. Incarnation Ownership
16. Incarnation Allocator Requirements
17. Generation Strategy Matrix
18. Incarnation As Authored Identity Metadata
19. Durability Requirement
20. Source-Embedded Versus Registry Model
21. Storage Model Matrix
22. Template Incarnation
23. Recurrence Incarnation
24. Recurrence Retargeting
25. Template + Recurrence Composite Lineage
26. Canonical Template Occurrence Coordinates
27. Times-Per-Week Slot Semantics
28. Manual-Event Incarnation
29. Shift-Definition Incarnation
30. Shift-Cycle Incarnation
31. Nested Segment Incarnation
32. Sequence-Entry Incarnation
33. Nested Reordering Semantics
34. Nested ID Scope
35. Work Occurrence Durable Lineage
36. Work Reference Matrix
37. Conflict Reference Composition
38. Conflict Canonicalization
39. Conflict Fingerprint Separation
40. Source Lifetime Versus Occurrence Coordinate
41. DurableOccurrenceReference Working Definition
42. OccurrenceIdentity V2 Assessment
43. Separate DurableOccurrenceReference Assessment
44. V1 + Incarnation Companion Assessment
45. Reference Model Matrix
46. Canonical Durable Reference Recommendation
47. Runtime OccurrenceIdentity Future
48. Reference Versioning
49. Incarnation Token Versioning
50. Active Rehydration Semantics
51. Legacy Active-State Incarnation
52. Legacy Migration Safety
53. Initial Lifetime Baseline
54. Migration Idempotence
55. Migration Strategy Matrix
56. Profile Incarnation Semantics
57. Profile Model Matrix
58. Profile Save Semantics
59. Backup Incarnation Semantics
60. Backup Model Matrix
61. Restore Versus Instantiate Determination
62. Active Replacement Semantics
63. Active Recovery Semantics
64. Clear / Reset Semantics
65. Duplicate / Copy Semantics
66. Cross-Device Requirements
67. Collision-Safety Requirements
68. Source ID Mutation Assessment
69. Durable Reference Resolution
70. Nested Resolution
71. Partial Lifetime Match
72. Reference Resolution Status Requirements
73. Unsupported Reference Semantics
74. Reference Migration
75. Incarnation Rotation
76. Profile Duplication
77. Backup Duplication
78. Repeated Backup Import
79. Restore Versus Fork
80. Backup Rollback Implications
81. Existing Decision Reattachment Implications
82. PlanDecision Surface Separation
83. Current V1 Profile / Backup Implications
84. Active Local Format Implications
85. DayFrameAuthoredSetup Implications
86. Architecture Category / Provenance
87. Authoring-Service Responsibility
88. Store Enforcement Requirements
89. Duplicate / Reuse Prohibition
90. Tombstone Requirement
91. Orphan Resolution
92. Historical Source Reappearance
93. Explainability Requirements
94. Canonical Equality / Key Requirements
95. Structural Validation Versus Resolution
96. Migration Atomicity
97. Profile Migration Dependencies
98. Backup Versioning Implications
99. PlanDecision Persistence Prerequisites
100. Implementation Sequencing
101. Setup Workflow Prerequisite Assessment
102. Runtime-Only Incarnation Assessment
103. Staging Matrix
104. Interim OccurrenceIdentity
105. Source-Incarnation Matrix
106. Operation Matrix
107. Artifact Semantics Matrix
108. Durable Reference Matrix
109. Representation Matrix
110. Migration Matrix
111. Behavioral Invariants
112. Required Future Test Contract
113. Architectural Alignment Assessment
114. Compatibility Assessment
115. Test Coverage Assessment
116. Open Questions
117. Recommended Implementation / Investigation Sequence
118. Recommended Next Task
119. Deviations
120. Discoveries and Deferred Work
121. Validation
122. Final Completion Determination

Additional sections may be added where evidence requires them.

---

# 157. Validation Requirements

This task is investigation only.

No executable or test files should change.

Run:

```
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* task artifact SHA-256;
* artifact immutability;
* full test-file count;
* full test count;
* build result;
* diff-check result;
* whether executable/test files changed;
* whether governance files changed.

Reference searches must cover:

* every durable-referenceable source type;
* current source ID allocation;
* delete/recreate behavior;
* atomic Setup commit behavior;
* profile/backup replacement semantics;
* active rehydration/migration boundaries;
* nested work identity;
* occurrence-identity construction.

If earlier Phase 2 changes are present in the worktree, distinguish them from Task 2.24 work.

---

# 158. Completion Criteria

Task 2.24 is complete only when:

* source incarnation has a precise canonical definition;
* source ID/incarnation responsibilities are separated;
* edit-preservation semantics are established;
* delete/recreate semantics are established;
* same-ID replacement hazard is assessed;
* Setup operation identity sufficiency is determined;
* incarnation ownership is established;
* generation requirements are established;
* source-embedded versus registry representation is decided conceptually;
* template incarnation is defined;
* recurrence incarnation is defined;
* manual-event incarnation is defined;
* shift-definition incarnation is defined;
* shift-cycle incarnation is defined;
* nested segment/sequence incarnation is defined;
* work occurrence lifetime lineage is explicit;
* conflict lifetime references are explicit;
* occurrence coordinate is separated from source lifetime;
* canonical durable occurrence-reference representation is selected;
* V1 `OccurrenceIdentity` future role is established;
* versioning requirements are explicit;
* legacy active-state migration semantics are defined;
* migration idempotence/atomicity requirements are established;
* profile incarnation semantics are adopted;
* backup incarnation semantics are adopted;
* profile and backup differences are explicitly justified;
* restore/instantiate semantics are explicit;
* clear/reset/copy semantics are established;
* collision/offline portability requirements are established;
* source ID mutation implications are assessed;
* reference resolution semantics are defined;
* unsupported reference behavior is explicit;
* incarnation preservation across future migration is established;
* PlanDecision persistence prerequisites are listed;
* Setup authoring-operation ambiguity is resolved or identified as blocker;
* implementation staging is selected;
* required matrices are complete;
* future test contract is specified;
* no unauthorized implementation occurs;
* repository-standard validation passes;
* immutable task artifact remains unchanged.

---

# 159. Task Determination

Task 2.24 is a source-lifetime and durable-reference investigation.

Task 2.10 gave DayFrame stable semantic occurrence identity inside current runtime planning.

Task 2.23 established that durable PlanDecision authority requires a stronger guarantee:

> The occurrence referenced later must descend from the same authored source lifetime the user originally decided about.

Visible IDs do not prove that.

Structural equality does not prove that.

Matching dates do not prove that.

A durable PlanDecision must survive ordinary edits to the same source while refusing to attach to a deleted-and-recreated source that merely reused the same ID.

Therefore DayFrame needs explicit lifetime semantics before durable planning references can exist.

The conceptual target is:

```
authored source ID
    +
source incarnation
    ↓
lifetime-safe source lineage
    +
canonical occurrence coordinate
    ↓
DurableOccurrenceReference
    ↓
PlanDecision target
```

with every member of a semantic conflict carrying the same lifetime safety independently.

Task 2.24 must also decide how artifact semantics affect lifetime:

```
active local state
    → continuity

saved profile
    → reusable pattern or restored lifetime?

backup
    → recovery continuity or new instantiation?
```

Those answers govern whether old PlanDecisions may legitimately reattach after replacement or restoration.

**Task 2.24 is complete when DayFrame has an evidence-backed source-incarnation contract for every durable-referenceable source type, a canonical lifetime-safe occurrence-reference model, explicit edit/create/delete/restore/migration semantics, profile and backup lifetime policies, and a dependency-correct implementation sequence, with no unauthorized incarnation, persistence, migration, PlanDecision, or occurrence-identity implementation.**
