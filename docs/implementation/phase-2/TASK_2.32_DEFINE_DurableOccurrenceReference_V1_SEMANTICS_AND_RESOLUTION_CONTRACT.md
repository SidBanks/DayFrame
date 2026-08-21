# Task 2.32 — Define DurableOccurrenceReference V1 Semantics and Resolution Contract

## Status

Ready for investigation, architectural definition, and contract implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Architecture-first durable-reference contract task.

Task 2.31 completed and published the cross-surface source-incarnation checkpoint and determined that the source-lifetime substrate is ready for a separately governed durable occurrence reference.

Task 2.32 defines **DurableOccurrenceReference V1**.

Its purpose is to answer:

> How can durable DayFrame state refer to one semantic occurrence of one specific source lifetime without confusing recreated sources, overlapping preview windows, runtime IDs, or current schedule placement with durable identity?

This task defines:

* the V1 reference model;
* supported source kinds;
* source-lifetime lineage;
* canonical occurrence coordinates;
* nested-source lineage;
* equality;
* construction;
* validation;
* resolution;
* stale-reference outcomes;
* relationship to `OccurrenceIdentity` V1;
* persistence readiness.

Task 2.32 does **not** implement PlanDecision, decision persistence, decision replay, user-facing decision UI, or a general history system.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 2.31 is complete and its source-incarnation checkpoint is published;
6. review the checkpoint before defining the reference;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.32_DEFINE_DURABLE_OCCURRENCE_REFERENCE_V1_SEMANTICS_AND_RESOLUTION_CONTRACT_RESULT.md`

If a safe V1 reference cannot be defined from currently available authoritative coordinates, stop and report the missing prerequisite rather than inventing identity.

---

# 2. Purpose

`OccurrenceIdentity` V1 solved runtime semantic occurrence identity.

It is intentionally insufficient as a durable reference because it does not contain source incarnation.

For example:

```text
template ID = workout
recurrence ID = weekdays
userDayDate = 2026-08-20
```

may identify the same semantic recurrence coordinates before and after the authored source is deleted and recreated.

But:

```text
old template incarnation = A
new template incarnation = B
```

means those occurrences belong to different source lifetimes.

A durable reference therefore needs both:

```text
source lifetime
+
canonical occurrence coordinates
```

Task 2.32 defines that composition.

---

# 3. Governing Architectural Evidence

This task is governed by the accepted Task 2.31 checkpoint.

The following are settled:

1. all current active source kinds have mandatory incarnation;
2. same readable ID does not imply same lifetime;
3. source lifetime equality requires source kind, scoped source ID, and incarnation;
4. nested sources additionally depend on parent cycle lifetime;
5. Active V2 preserves lifetime;
6. Profile V2 activation creates fresh lifetime;
7. Backup V1 import creates fresh lifetime;
8. Backup V2 restore preserves lifetime;
9. retry preserves lifetime;
10. scheduling is incarnation-neutral;
11. `OccurrenceIdentity` V1 contains no incarnation;
12. `OccurrenceIdentity` V1 remains runtime semantic identity only;
13. durable occurrence references may now depend on source incarnation.

Do not reopen these decisions unless executable evidence contradicts the checkpoint.

---

# 4. Architectural Objective

Define a durable reference satisfying:

```text
DurableOccurrenceReference V1
    =
    versioned source-lifetime lineage
    +
    canonical occurrence coordinates
```

such that:

```text
same source lifetime
+
same semantic occurrence coordinates
=
same durable occurrence reference
```

while:

```text
same readable source ID
+
different source incarnation
=
different durable occurrence reference
```

and:

```text
same source lifetime
+
different preview placement/runtime ID
=
same durable occurrence reference
```

where the underlying semantic occurrence is unchanged.

---

# 5. Core Epistemic Rule

Adopt:

> A DurableOccurrenceReference may identify only what DayFrame can reconstruct from authoritative source lifetime and canonical occurrence coordinates.

Do not persist:

* runtime object identity;
* array index;
* preview position;
* scheduled block ID;
* generated candidate ID;
* visual position;
* transient friction ID;

as the durable identity of an occurrence.

---

# 6. Required Initial Audit

Before defining the V1 schema, inspect:

* `OccurrenceIdentity`;
* its constructors;
* all supported occurrence source kinds;
* template recurrence expansion;
* daily recurrence;
* specific-weekday recurrence;
* weekly recurrence;
* `timesPerUserWeek`;
* cycle-generated work occurrences;
* manual-event projection;
* preview-window clipping;
* placement;
* overnight work;
* generated candidate IDs;
* scheduled block IDs;
* manual projection IDs;
* source incarnation model;
* nested cycle source identity;
* Active V2 validation;
* Task 2.31 checkpoint.

Document which current coordinates are authoritative enough for durable reference.

---

# 7. Supported Occurrence Families

Audit current runtime occurrence families.

At minimum evaluate:

1. template-generated occurrence;
2. cycle-generated work occurrence;
3. manual-event occurrence.

Do not assume every lifetime-bearing authored source independently produces occurrences.

For example:

* block template + block recurrence may jointly define a generated occurrence;
* shift definition + cycle/segment/sequence lineage may jointly define work;
* manual event may directly define one projected occurrence.

The V1 reference must model actual occurrence provenance, not merely list all source kinds.

---

# 8. Reference Version

Introduce an explicit version discriminator.

Preferred:

```ts
version: 1
```

Use a named constant such as:

```ts
DURABLE_OCCURRENCE_REFERENCE_VERSION
```

Do not tie this version to:

* `OccurrenceIdentity` version;
* Active V2 version;
* Profile V2 version;
* Backup V2 version.

These are independent contracts.

---

# 9. Structured Representation

`DurableOccurrenceReference` must be structured data.

Do not create a concatenated opaque string such as:

```text
template|id|incarnation|date|slot
```

Structured fields are required for:

* validation;
* migration;
* diagnostics;
* resolution;
* future versioning.

---

# 10. Discriminated Union

Prefer a discriminated union by occurrence family/source semantics.

Conceptually:

```ts
type DurableOccurrenceReference =
  | DurableTemplateOccurrenceReference
  | DurableWorkOccurrenceReference
  | DurableManualEventOccurrenceReference;
```

The exact names may follow project conventions.

Do not force fundamentally different occurrence families into one ambiguous coordinate bag.

---

# 11. Source-Kind Discriminator

Each reference must explicitly identify its occurrence/source family.

Audit whether the existing `sourceKind` terminology remains appropriate.

Potential values:

* `template`;
* `work`;
* `manualEvent`.

Do not expose internal generator names unless they are stable semantic categories.

---

# 12. Source Lifetime Component

Every durable occurrence reference must contain enough source lineage to distinguish source lifetime.

At minimum:

```text
source kind
+
scoped readable source ID
+
SourceIncarnationId
```

For occurrence families involving multiple authored sources, include every lifetime-bearing source necessary to prevent false continuity.

---

# 13. Template Occurrence Lineage

A generated template occurrence currently depends on:

* block template;
* block recurrence.

Audit whether both are semantically necessary for durable occurrence identity.

Preferred default:

> include both template lifetime and recurrence lifetime.

Reason:

A recurrence can be deleted/recreated while retaining readable IDs, or a template can be recreated independently.

A durable occurrence must not survive either lifetime change accidentally.

---

# 14. Template Lineage Shape

Prefer explicit structured lineage such as:

```ts
template: {
  id: BlockTemplateId;
  incarnationId: SourceIncarnationId;
}

recurrence: {
  id: BlockRecurrenceId;
  incarnationId: SourceIncarnationId;
}
```

Use actual project ID types.

Do not rely on template ID alone.

---

# 15. Template Occurrence Coordinates

Audit the canonical coordinates already established by `OccurrenceIdentity` V1.

Expected supported recurrence semantics include:

* daily;
* specific weekday;
* weekly;
* N-per-user-week.

The durable reference should reuse the same semantic coordinates where valid rather than inventing parallel recurrence identity rules.

---

# 16. Daily Coordinate

Expected canonical coordinate:

```text
userDayDate
+
slot 0
```

Confirm from executable behavior.

Do not use generated calendar placement time.

---

# 17. Specific-Weekday Coordinate

Expected canonical coordinate:

```text
matching userDayDate
+
slot 0
```

Confirm from executable behavior.

---

# 18. Weekly Coordinate

Expected canonical coordinate:

```text
canonical userWeekStartDate
+
slot 0
```

Do not use whichever preview date first happened to expose the weekly occurrence.

---

# 19. `timesPerUserWeek` Coordinate

Expected canonical coordinate:

```text
canonical userWeekStartDate
+
stable slot
```

The slot must remain the canonical expansion slot assigned before planning-window clipping.

This is already an important `OccurrenceIdentity` V1 invariant.

Reuse it if evidence confirms it remains sufficient.

---

# 20. Partial Bounds

Audit recurrence start/end bounds.

A durable reference must remain stable when the same occurrence is observed through overlapping preview windows.

Do not incorporate preview range into identity.

---

# 21. Placement Independence

A template durable reference must not change merely because the occurrence:

* is placed at a different time;
* is moved by a suggested fix;
* is scheduled versus unplaced;
* appears through another preview range.

Placement is not occurrence identity.

---

# 22. Work Occurrence Provenance

Audit cycle-generated work occurrence provenance carefully.

Task 2.10 used the strongest then-defensible runtime identity:

* cycle ID;
* segment/sequence-entry ID;
* shift-definition ID;
* local start date;
* slot.

Task 2.31 established stronger lifetime semantics.

Durable work reference must now include sufficient incarnation-bearing lineage.

---

# 23. Work Parent Lifetime

At minimum, work lineage must include the shift-cycle lifetime.

This is required because nested segment and sequence-entry IDs are parent-scoped.

---

# 24. Work Nested Lifetime

If the work occurrence originates from:

* segment;
* sequence entry;

include that nested source's readable ID and incarnation.

Do not treat the nested ID as globally scoped.

---

# 25. Shift Definition Lifetime

Include the shift-definition readable ID and incarnation when the occurrence depends on that definition.

A recreated shift definition with the same readable ID must not be treated as the same work-source lineage.

---

# 26. Work Lineage Shape

Prefer an explicit structure such as:

```ts
cycle: {
  id: ShiftCycleId;
  incarnationId: SourceIncarnationId;
}

entry: {
  kind: "segment" | "sequenceEntry";
  id: ...;
  incarnationId: SourceIncarnationId;
}

shiftDefinition: {
  id: ShiftDefinitionId;
  incarnationId: SourceIncarnationId;
}
```

Adjust to actual production source model.

Do not invent a segment/sequence abstraction if generation provenance does not support it.

---

# 27. Work Occurrence Coordinate

Audit whether the current canonical work coordinate:

```text
local start date
+
slot 0
```

is sufficient once complete lifetime lineage is included.

The reference must survive:

* preview-window changes;
* overnight end-date changes;
* clipping;
* rendering differences.

Do not use end date as identity if start date is the authoritative occurrence coordinate.

---

# 28. Overnight Work

Directly prove that an overnight shift occurrence retains the same durable reference regardless of:

* next-calendar-day end;
* user-day clipping;
* preview rendering.

---

# 29. Work Slot

If work generation can produce multiple semantic work occurrences with identical lineage and local start date, V1 needs a stable slot/discriminator.

Audit this rather than assuming slot `0` is permanently sufficient.

If current authoritative generation guarantees one occurrence per lineage/start-date coordinate, document that invariant.

---

# 30. Manual Event Semantics

Audit manual events.

A manual event is authored rather than recurrence-generated.

Determine whether one authored manual event corresponds to exactly one semantic occurrence.

If yes, durable reference may consist primarily of:

```text
manual-event ID
+
manual-event incarnation
```

with no extra occurrence coordinate.

---

# 31. Manual Projection ID

Do not persist the runtime projection ID as durable identity unless the audit proves it is authoritative.

Task 2.10 preserved it as a runtime ID, not a lifetime-safe reference.

---

# 32. Manual Event Date/Time

If manual-event lifetime already uniquely defines one occurrence, date/time should not be duplicated into identity unless necessary for validation/resolution.

Changing the event through an ordinary update preserves source lifetime.

Therefore decide carefully:

> Does moving a manual event mean the same occurrence moved, or a different occurrence?

Task 2.31 says update preserves lifetime.

The durable-reference model should normally therefore continue to resolve the same manual event after an ordinary date/time update.

Document explicitly.

---

# 33. Manual Event Resolution

Preferred semantic result:

```text
same manual-event ID
+
same incarnation
=
same durable occurrence
```

even if its authored date/time changes.

Confirm this aligns with existing lifecycle semantics.

---

# 34. Reference Equality

Define structural semantic equality.

Two V1 references are equal only if:

* version equal;
* occurrence family equal;
* complete source lineage equal;
* canonical occurrence coordinates equal.

Do not use object identity.

---

# 35. Serialization Equality

References serialized and parsed without semantic change must compare equal.

Canonical JSON key order is not required unless current persistence infrastructure requires it.

---

# 36. Reference Construction

Provide authoritative constructors from supported runtime/generated occurrences.

Do not allow callers to hand-build references by guessing fields where avoidable.

Potential APIs:

```ts
createDurableTemplateOccurrenceReference(...)
createDurableWorkOccurrenceReference(...)
createDurableManualEventOccurrenceReference(...)
```

Exact naming may vary.

---

# 37. Construction Preconditions

Construction must require sufficient source-incarnation evidence.

If the runtime occurrence lacks necessary source lineage:

* do not fabricate;
* return explicit failure or stop implementation for that family.

No fallback to readable ID alone.

---

# 38. Runtime-to-Durable Mapping

Audit whether generated runtime occurrence objects currently carry enough incarnation-bearing provenance.

Task 2.10's `OccurrenceIdentity` does not.

If runtime scheduled/candidate/work objects need a narrowly scoped source-lineage field or construction lookup to build a durable reference, determine the smallest safe approach.

Do not change scheduling semantics.

---

# 39. No Automatic Persistence Yet

Even after the reference type exists, do not persist references into active/profile/backup state merely to prove serialization.

Persistence readiness is different from a persistence consumer.

Use tests/fixtures to prove roundtrip behavior.

---

# 40. Validator

Implement a strict V1 validator.

Validate:

* object structure;
* exact version;
* discriminator;
* source IDs;
* incarnation UUIDs;
* required parent lineage;
* coordinate format;
* slot constraints;
* family-specific required/forbidden fields.

Do not silently normalize malformed durable references.

---

# 41. Unknown Reference Version

Unknown/future versions must return unsupported-version validation/resolution failure.

Do not reinterpret them as V1.

---

# 42. Cross-Family Field Rejection

A manual-event reference should not silently accept template coordinates.

A template reference should not silently accept work lineage.

Prefer exact family validation.

---

# 43. Date Canonicalization

Use existing canonical date representation.

Validate exact expected format.

Do not accept ambiguous locale dates.

---

# 44. Slot Validation

Slots must be integer, non-negative, and semantically valid for the occurrence family.

If V1 currently only permits slot `0` for some families, enforce/document it.

---

# 45. Resolution Definition

Define resolution as:

> Given a validated durable occurrence reference and current authoritative authored state, determine whether the referenced source lifetime still exists and whether the semantic occurrence exists under current authoritative generation semantics.

Resolution must not mean:

> find whichever current runtime block looks similar.

---

# 46. Resolver Input

Prefer resolver inputs based on authoritative state plus required generation context.

Audit whether resolving template/work occurrences requires:

* current authored state;
* canonical recurrence expansion;
* date/week coordinate;
* effective schedule preferences;
* cycle expansion.

Do not require an existing Preview if the occurrence can be resolved from authoritative state.

---

# 47. Preview Independence

Preferred invariant:

> Durable occurrence resolution does not require the current Preview to contain the occurrence.

A Preview is derived and may be stale or absent.

Do not make durable-reference validity depend on Preview existence.

---

# 48. Resolution Result Union

Define explicit outcomes.

At minimum evaluate:

```ts
type DurableOccurrenceResolution =
  | { status: "resolved"; ... }
  | { status: "sourceMissing"; ... }
  | { status: "lifetimeMismatch"; ... }
  | { status: "occurrenceMissing"; ... }
  | { status: "invalidReference"; ... }
  | { status: "unsupportedVersion"; ... };
```

Exact naming may follow project conventions.

Do not collapse all stale cases into `null`.

---

# 49. `sourceMissing`

Use when the referenced readable source lineage no longer exists in current authority.

Examples:

* template deleted;
* recurrence deleted;
* cycle deleted;
* nested entry deleted;
* shift definition deleted;
* manual event deleted.

Document which missing component is reported.

---

# 50. `lifetimeMismatch`

Use when the relevant readable source ID exists but its incarnation differs.

This is the key protection against delete/recreate aliasing.

Example:

```text
reference:
template workout / incarnation A

current:
template workout / incarnation B

→ lifetimeMismatch
```

Do not resolve to the new source.

---

# 51. Nested Lifetime Mismatch

For work references, distinguish mismatch at:

* cycle;
* nested segment/sequence entry;
* shift definition.

The result may carry a component discriminator for diagnostics.

Do not require separate top-level status variants unless useful.

---

# 52. `occurrenceMissing`

Use when source lifetime still matches, but the referenced semantic occurrence is no longer produced.

Examples may include:

* recurrence rules updated while preserving recurrence lifetime;
* recurrence bounds changed;
* weekday changed;
* cycle schedule changed;
* occurrence coordinate no longer exists.

This is distinct from source deletion/recreation.

---

# 53. Update And Occurrence Staleness

Because ordinary update preserves source lifetime, some durable references may become `occurrenceMissing` after an update.

That is correct.

Do not rotate source incarnation merely to avoid this outcome.

---

# 54. Manual Event After Update

If manual event lifetime itself identifies the occurrence, an ordinary manual-event update should remain `resolved`, even if date/time changes.

This is an intentional contrast with generated recurrence coordinates.

Confirm and document.

---

# 55. `resolved`

A resolved result should return enough authoritative information for future consumers to reason about the occurrence.

Possible payload:

* reference;
* current source lineage;
* canonical occurrence identity/coordinates;
* generated occurrence descriptor.

Do not return or persist PlanDecision.

---

# 56. Runtime ID On Resolution

A resolver may optionally expose a current runtime/generated ID if generation naturally produces one.

That ID is convenience metadata only.

It must not become part of durable equality.

---

# 57. Resolution Determinism

Equivalent current authoritative state and the same reference must produce equivalent resolution result.

No dependence on:

* object insertion order;
* current Preview;
* random allocator;
* UI state.

---

# 58. Resolution Window

A durable reference may target an occurrence outside the current Preview range.

The resolver must determine the narrow canonical generation window needed for the reference.

Do not generate an unbounded schedule.

---

# 59. Template Resolution Window

For daily/specific-day references, resolve around the canonical user day.

For weekly/N-per-week references, resolve the canonical user week.

Use existing recurrence expansion semantics.

---

# 60. Work Resolution Window

Resolve the canonical local start date with sufficient adjacent expansion for overnight/user-day behavior.

Reuse current cycle generation semantics.

---

# 61. Manual Resolution Window

Manual-event resolution should not require schedule generation if lifetime uniquely identifies the authored event.

---

# 62. Unsupported Recurrence Types

Task 2.10 supported only current implemented recurrence frequencies.

Audit current status.

If `perShiftSegment`, `custom`, or another unsupported recurrence cannot produce a stable occurrence today:

* do not fabricate a durable reference;
* return unsupported construction/resolution outcome;
* document it.

---

# 63. Relationship To `OccurrenceIdentity` V1

Define explicitly:

```text
OccurrenceIdentity V1
    = runtime semantic occurrence coordinates

DurableOccurrenceReference V1
    = source lifetime lineage
      + durable semantic occurrence coordinates
```

Where possible, the durable reference should reuse the canonical coordinate semantics established by `OccurrenceIdentity`.

Do not embed `OccurrenceIdentity` wholesale unless the audit proves that is the cleanest versioning boundary.

---

# 64. No Incarnation In `OccurrenceIdentity`

Do not modify `OccurrenceIdentity` V1 to add incarnation.

The durable reference is the new layer.

---

# 65. Projection To Runtime Identity

Where meaningful, provide a pure projection:

```text
DurableOccurrenceReference V1
    ↓
OccurrenceIdentity V1-like semantic coordinates
```

But only if the reference contains enough information and the mapping is semantically exact.

Do not invent a runtime ID.

---

# 66. Durable Reference Is Not Current Truth

A durable reference is a claim about a previously identified occurrence.

It may become stale.

The resolver determines its relationship to current authority.

Do not validate a reference merely by checking that its JSON is structurally valid.

---

# 67. Validation Versus Resolution

Maintain the distinction:

## Validation

> Is this a well-formed supported reference?

## Resolution

> What does this valid reference mean relative to current authoritative state?

A valid reference may resolve to:

* source missing;
* lifetime mismatch;
* occurrence missing.

---

# 68. Source Lookup Order

Resolver should check source lineage before occurrence expansion.

Conceptually:

```text
validate reference
    ↓
find readable source lineage
    ↓
missing?
    → sourceMissing
    ↓
compare incarnation
    ↓
different?
    → lifetimeMismatch
    ↓
resolve occurrence coordinate
    ↓
missing?
    → occurrenceMissing
    ↓
resolved
```

For multi-source lineage, define deterministic component order.

---

# 69. Template Lookup Order

Preferred:

1. template readable ID;
2. template incarnation;
3. recurrence readable ID;
4. recurrence incarnation;
5. relationship between recurrence and template;
6. occurrence coordinate.

Audit actual relationship model.

---

# 70. Work Lookup Order

Preferred:

1. cycle ID;
2. cycle incarnation;
3. nested entry ID/scope;
4. nested incarnation;
5. shift definition ID;
6. shift-definition incarnation;
7. occurrence coordinate.

Adjust if actual generation provenance requires another order.

---

# 71. Manual Lookup Order

Preferred:

1. manual-event ID;
2. incarnation.

If both match, resolve.

---

# 72. Relationship Mismatch

A source may exist with matching lifetime components individually but no longer have the same relationship.

Example:

* recurrence still exists;
* template still exists;
* both incarnations match;
* recurrence is now assigned to another template.

Determine whether this is:

* `occurrenceMissing`;
* a dedicated relationship mismatch detail.

Do not falsely resolve.

---

# 73. Reference Canonicality

Two constructors observing the same semantic occurrence/source lifetime should produce structurally equal references.

Direct tests required.

---

# 74. Overlapping Preview Stability

Construct durable references for the same occurrence observed through overlapping generation windows.

They must compare equal.

Cover:

* daily;
* specific weekday;
* weekly;
* N-per-week;
* work.

---

# 75. Placement Stability

Construct before/after placement or suggested move.

Reference remains equal.

---

# 76. Regeneration Stability

Equivalent authoritative state regenerated multiple times yields equal durable references.

---

# 77. Restart Stability

Active V2 restart preserves source incarnation.

Therefore a reference constructed before restart should resolve after restart to the same occurrence when semantic source data remains unchanged.

Direct test required.

---

# 78. Profile Activation Mismatch

Construct a durable reference.

Save/load equivalent profile so readable IDs recur with fresh incarnations.

Old reference must **not** resolve to the newly instantiated occurrence.

Expected result:

* `lifetimeMismatch`.

This is a critical test.

---

# 79. Backup V1 Import Mismatch

Same as profile activation.

Old reference must not resolve to the newly instantiated V1-import graph even if readable IDs and occurrence coordinates match.

---

# 80. Backup V2 Restore Preservation

Construct reference.

Export Backup V2.

Change current state.

Restore backup.

Reference should resolve again because exact source lifetimes were restored.

This is another critical test.

---

# 81. Delete/Recreate Mismatch

Construct reference.

Delete source.

Recreate same readable ID and equivalent authored data.

Old reference must return `lifetimeMismatch`, not `resolved`.

---

# 82. Source Deleted

Construct reference.

Delete source without recreation.

Expected:

`sourceMissing`.

---

# 83. Occurrence Removed By Update

Construct reference to generated recurrence occurrence.

Update same source lifetime so that occurrence no longer exists.

Expected:

`occurrenceMissing`.

---

# 84. Occurrence Moved By Placement

Construct reference.

Change only flexible placement.

Expected:

`resolved`.

Reference equality unchanged.

---

# 85. Manual Event Move

Construct manual-event reference.

Update event date/time through ordinary update preserving lifetime.

Expected:

`resolved` to current event.

This directly establishes whether manual event identity follows source lifetime rather than old coordinates.

---

# 86. Nested Parent Recreation

Construct work reference.

Delete/recreate parent cycle with same IDs and equivalent nested content.

Expected:

`lifetimeMismatch`.

Do not accidentally resolve based on nested readable IDs.

---

# 87. Shift Definition Recreation

Construct work reference.

Delete/recreate referenced shift definition with same readable ID.

Expected:

`lifetimeMismatch`.

---

# 88. Nested Entry Recreation

Construct work reference.

Delete/recreate nested segment/sequence entry with same readable ID under same cycle lifetime where supported.

Expected:

`lifetimeMismatch`.

---

# 89. Work Schedule Update

If cycle/entry/shift definition ordinary update preserves lifetime but removes a particular local-start-date occurrence:

Expected:

`occurrenceMissing`.

If occurrence still exists:

Expected:

`resolved`.

---

# 90. Reference Persistence Readiness

Prove references are:

* plain serializable structured data;
* clone-safe;
* validation-safe after JSON roundtrip;
* independent from class prototypes/functions;
* explicit-versioned.

Do not add a storage surface.

---

# 91. Clone Isolation

Mutating a returned durable reference must not mutate:

* source state;
* generated occurrence;
* another separately constructed reference.

---

# 92. Parser/Validator Purity

Validation must not mutate caller input.

---

# 93. Resolver Purity

Resolution must not:

* mutate authored state;
* mutate Preview;
* write persistence;
* allocate incarnation;
* notify store subscribers.

It is a read operation.

---

# 94. No Allocator Use

Durable reference construction and resolution must never allocate `SourceIncarnationId`.

They consume existing lifetime identity.

Inject a throwing allocator where useful to prove independence.

---

# 95. No New Durable Surface

Do not add:

* local-storage key;
* profile field;
* backup field;
* Active V2 field;

for durable references in this task.

A future consumer will govern persistence.

---

# 96. Backup V2 Exclusion

Do not add references to Backup V2 yet.

Backup V2 currently represents active authored authority only.

If future PlanDecision becomes backup-worthy, that requires explicit format governance.

---

# 97. Profile V2 Exclusion

Profiles must not store durable occurrence references.

They instantiate new lifetimes, which would invalidate active-lifetime references by design.

---

# 98. Active V2 Exclusion

Do not add durable occurrence references to Active V2 until a durable consumer exists.

Avoid speculative schema growth.

---

# 99. PlanDecision Boundary

Task 2.32 must not define full PlanDecision semantics.

It may document only what a future decision can safely rely upon:

> A future durable decision may target an occurrence using a validated `DurableOccurrenceReference`, and must resolve that reference against current authority before application.

Do not implement decisions.

---

# 100. Friction Boundary

Do not persist friction points using durable references in this task.

Friction remains derived Preview data.

---

# 101. SuggestedFix Boundary

Do not migrate SuggestedFix to durable references.

Suggested fixes remain current derived/revision behavior unless separately governed.

---

# 102. Execution/History Boundary

Do not add execution history.

Durable reference capability does not itself imply history persistence.

---

# 103. Error Detail

Resolution failures should carry enough structured detail for future explainability.

For example:

```ts
{
  status: "lifetimeMismatch",
  component: "template",
}
```

or:

```ts
{
  status: "sourceMissing",
  component: "sequenceEntry",
}
```

Do not include verbose UI prose in the core result.

---

# 104. Stable Component Names

If result details identify components, use stable semantic names.

Potential:

* `template`;
* `recurrence`;
* `cycle`;
* `segment`;
* `sequenceEntry`;
* `shiftDefinition`;
* `manualEvent`.

---

# 105. No Exception For Expected Staleness

`sourceMissing`, `lifetimeMismatch`, and `occurrenceMissing` are expected domain outcomes.

Do not throw exceptions for them.

Throw only for genuine programming-contract violations if consistent with project style.

---

# 106. Construction Result

If construction can fail because runtime provenance is incomplete/unsupported, prefer an explicit result union rather than returning `undefined` without explanation.

Possible statuses:

* `created`;
* `unsupportedOccurrence`;
* `missingSourceLineage`.

Follow repository conventions.

---

# 107. Validation Result

Audit existing validator conventions.

Use a result that distinguishes:

* valid;
* invalid;
* unsupportedVersion.

Do not conflate unsupported future version with malformed V1.

---

# 108. Resolver API Location

Place durable occurrence reference code in a dedicated core boundary, such as:

`code/src/core/occurrences/durableOccurrenceReference.ts`

and tests nearby.

Use actual repository organization if another existing location is more appropriate.

Do not put durable-reference semantics in UI/store files.

---

# 109. Resolver Separation

Consider separating:

* type/validation/construction;
* resolution;

if this produces clearer dependency boundaries.

For example:

```text
occurrences/
    durableOccurrenceReference.ts
    resolveDurableOccurrenceReference.ts
```

Do not over-fragment unnecessarily.

---

# 110. Dependency Direction

Core durable-reference code may depend on:

* authored source types;
* source incarnation;
* recurrence/cycle generation primitives;
* occurrence coordinate helpers.

It should not depend on:

* React;
* UI;
* local storage;
* browser download;
* profile persistence;
* backup UI.

---

# 111. Direct Tests — Validation

Cover:

* each supported family;
* exact V1 version;
* malformed version;
* unsupported version;
* malformed incarnation;
* uppercase UUID;
* wrong UUID version;
* missing parent lineage;
* invalid date;
* invalid slot;
* cross-family field contamination.

---

# 112. Direct Tests — Template Construction

Cover:

* daily;
* specific weekday;
* weekly;
* N-per-week;
* partial recurrence bounds.

---

# 113. Direct Tests — Work Construction

Cover:

* segment-backed work;
* sequence-entry-backed work;
* overnight work;
* nested parent lineage.

If one work provenance family does not actually exist, document rather than fabricate.

---

# 114. Direct Tests — Manual Construction

Cover manual event lifetime reference and update behavior.

---

# 115. Direct Tests — Determinism

Equivalent authoritative state produces equal references.

---

# 116. Direct Tests — Overlapping Windows

Same occurrence observed through overlapping windows produces equal reference.

---

# 117. Direct Tests — Runtime-ID Independence

Change or regenerate runtime IDs where possible.

Durable reference remains equal.

---

# 118. Direct Tests — Placement Independence

Moved scheduled occurrence retains same durable reference.

---

# 119. Direct Tests — Restart

Reference survives Active V2 rehydration.

---

# 120. Direct Tests — Profile Activation

Old reference lifetime-mismatches after equivalent profile activation.

---

# 121. Direct Tests — Backup V1

Old reference lifetime-mismatches after equivalent Backup V1 import.

---

# 122. Direct Tests — Backup V2

Old reference resolves after exact Backup V2 restoration.

---

# 123. Direct Tests — Delete/Recreate

Same readable ID, fresh incarnation → lifetime mismatch.

---

# 124. Direct Tests — Source Missing

Deleted source → source missing.

---

# 125. Direct Tests — Occurrence Missing

Same source lifetime, recurrence/work rule changed so coordinate disappears → occurrence missing.

---

# 126. Direct Tests — Manual Move

Same manual-event lifetime after authored move → resolved.

---

# 127. Direct Tests — Nested Parent Recreation

Same nested readable IDs under recreated parent → lifetime mismatch.

---

# 128. Direct Tests — JSON Roundtrip

Reference serializes/parses/validates/resolves equivalently.

---

# 129. Direct Tests — Purity

Construction/validation/resolution do not mutate source/input/reference.

---

# 130. Direct Tests — No Allocation

Construction/resolution do not invoke source-incarnation allocator.

---

# 131. Scheduling Regression

Full scheduling behavior must remain unchanged.

If source-lineage propagation is added to generated runtime objects solely to enable reference construction:

* generated schedule timing must remain identical;
* friction must remain identical;
* placement must remain identical;
* runtime IDs must remain unchanged unless unavoidable and separately justified.

---

# 132. `OccurrenceIdentity` Regression

All existing `OccurrenceIdentity` tests must remain green.

No version bump.

No incarnation field.

No durable claim added to it.

---

# 133. Source-Incarnation Regression

All lifecycle/durable-surface tests from Tasks 2.27–2.31 must remain green.

The durable-reference layer must consume the source-lifetime model without changing it.

---

# 134. Reference Audit

Before completion, search all production references to:

* `OccurrenceIdentity`;
* `incarnationId`;
* source IDs;
* generated occurrence IDs;
* scheduled block IDs;
* manual projection IDs.

Confirm no existing transient identifier has accidentally become a durable reference.

---

# 135. Persistence Audit

Search:

* Active V2 serializer;
* Profile V2 serializer;
* Backup V2 serializer;
* local-storage writes.

Confirm `DurableOccurrenceReference` is not persisted by Task 2.32.

---

# 136. Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.32_DEFINE_DURABLE_OCCURRENCE_REFERENCE_V1_SEMANTICS_AND_RESOLUTION_CONTRACT_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Evidence
4. Initial Occurrence-Provenance Audit
5. Files Changed
6. Durable Reference Definition
7. Version Contract
8. Supported Families
9. Source-Kind Contract
10. Template Source Lineage
11. Template Coordinate Contract
12. Daily Coordinate
13. Specific-Weekday Coordinate
14. Weekly Coordinate
15. N-per-Week Coordinate
16. Partial-Bounds Behavior
17. Placement Independence
18. Work Provenance
19. Work Parent Lifetime
20. Work Nested Lifetime
21. Shift-Definition Lifetime
22. Work Coordinate
23. Overnight Work
24. Work Slot Determination
25. Manual Event Semantics
26. Manual Event Update Semantics
27. Reference Equality
28. Construction Contract
29. Construction Failure Contract
30. Runtime-to-Durable Mapping
31. Validation Contract
32. Unknown-Version Behavior
33. Date/Slot Validation
34. Resolution Definition
35. Resolver Inputs
36. Preview Independence
37. Resolution Result Union
38. SourceMissing
39. LifetimeMismatch
40. Nested LifetimeMismatch
41. OccurrenceMissing
42. Resolved
43. Relationship Mismatch
44. Resolution Determinism
45. Resolution Window
46. Unsupported Recurrence Behavior
47. Relationship to OccurrenceIdentity V1
48. Projection/Coordinate Reuse
49. Restart Stability
50. Profile Activation Behavior
51. Backup V1 Behavior
52. Backup V2 Behavior
53. Delete/Recreate Behavior
54. Source-Deleted Behavior
55. Update-Staleness Behavior
56. Manual Move Behavior
57. Nested Parent Recreation
58. Persistence Readiness
59. Clone/Input Isolation
60. Resolver Purity
61. Allocator Independence
62. Durable-Surface Exclusion
63. PlanDecision Boundary
64. Error Detail
65. Core Dependency Boundary
66. Tests Added or Updated
67. Scheduling Regression
68. OccurrenceIdentity Regression
69. Source-Incarnation Regression
70. Reference Audit
71. Persistence Audit
72. Architectural Alignment Assessment
73. Deviations
74. Discoveries and Deferred Work
75. Recommended Next Task
76. Focused Validation
77. Full Validation
78. Final Completion Determination

---

# 137. Required Matrices

## A. Reference Family Matrix

| Family | Source lifetime lineage | Canonical occurrence coordinate | Runtime ID excluded? |
| ------ | ----------------------- | ------------------------------- | -------------------: |

## B. Resolution Outcome Matrix

| Current condition                           | Expected result    |
| ------------------------------------------- | ------------------ |
| exact lineage + occurrence exists           | resolved           |
| readable source missing                     | sourceMissing      |
| readable source exists, incarnation differs | lifetimeMismatch   |
| lifetime matches, occurrence gone           | occurrenceMissing  |
| malformed V1 reference                      | invalidReference   |
| future version                              | unsupportedVersion |

## C. Cross-Surface Resolution Matrix

| Transition                           | Old reference expected result |
| ------------------------------------ | ----------------------------- |
| Active V2 restart                    | resolved                      |
| ordinary update, occurrence retained | resolved                      |
| ordinary update, occurrence removed  | occurrenceMissing             |
| delete/recreate same ID              | lifetimeMismatch              |
| Profile V2 activation                | lifetimeMismatch              |
| Backup V1 import                     | lifetimeMismatch              |
| Backup V2 restore                    | resolved                      |

## D. Work Lineage Matrix

| Work provenance component | Readable ID | Incarnation required | Parent scope required |
| ------------------------- | ----------: | -------------------: | --------------------: |

## E. Persistence Matrix

| Surface      | Stores DurableOccurrenceReference in Task 2.32? |
| ------------ | ----------------------------------------------: |
| Active V2    |                                              No |
| Profile V2   |                                              No |
| Backup V2    |                                              No |
| Preview      |                              No new persistence |
| PlanDecision |                                 Not implemented |

---

# 138. Architectural Alignment Assessment

Assess against:

* source-lifetime correctness;
* canonical recurrence semantics;
* durable-data epistemic integrity;
* provenance;
* deterministic resolution;
* historical compatibility;
* separation of authored and derived state;
* explainability;
* future versionability.

Use:

* Aligned
* Partially aligned
* Misaligned
* Unresolved

---

# 139. Validation Requirements

Run focused tests for:

* durable-reference validation;
* template construction;
* work construction;
* manual construction;
* equality/determinism;
* overlapping windows;
* placement independence;
* restart;
* Profile V2 activation;
* Backup V1 import;
* Backup V2 restore;
* delete/recreate;
* source missing;
* occurrence missing;
* manual move;
* nested recreation;
* JSON roundtrip;
* purity/no allocation.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact file/test counts.

---

# 140. Completion Criteria

Task 2.32 is complete only when:

* DurableOccurrenceReference V1 is explicitly defined;
* its version is independent;
* supported occurrence families are explicit;
* source lifetime lineage is complete;
* template references include every required source lifetime;
* work references include parent/nested/shift-definition lifetime as required;
* manual-event semantics are explicit;
* canonical occurrence coordinates are evidence-backed;
* reference equality is defined;
* constructors are authoritative;
* validation is strict and non-mutating;
* unknown versions are rejected explicitly;
* resolution does not depend on Preview;
* sourceMissing is distinct;
* lifetimeMismatch is distinct;
* occurrenceMissing is distinct;
* resolved is explicit;
* ordinary updates do not rotate lifetime;
* generated occurrences may become occurrenceMissing without lifetime mismatch;
* manual-event ordinary movement resolves according to its lifetime semantics;
* overlapping windows produce equal references;
* placement changes do not change references;
* Active V2 restart preserves resolution;
* Profile V2 activation causes old-reference lifetime mismatch;
* Backup V1 import causes old-reference lifetime mismatch;
* Backup V2 restore preserves old-reference resolution;
* delete/recreate causes lifetime mismatch;
* nested parent recreation is safe;
* references JSON-roundtrip safely;
* construction/resolution do not allocate incarnation;
* resolver is pure;
* no current durable surface persists the reference;
* `OccurrenceIdentity` V1 remains unchanged;
* scheduling remains unchanged;
* source-incarnation semantics remain unchanged;
* full repository validation passes;
* result artifact is complete.

---

# 141. Explicit Non-Goals

Do **not**:

* implement PlanDecision;
* persist PlanDecision;
* apply decisions;
* replay decisions;
* add decision UI;
* modify `OccurrenceIdentity` V1;
* add incarnation to `OccurrenceIdentity`;
* modify Active V2 schema;
* modify Profile V2 schema;
* modify Backup V2 schema;
* persist durable references anywhere;
* add source history;
* add execution history;
* add tombstones;
* change scheduling semantics;
* change friction semantics;
* change SuggestedFix semantics;
* make Preview authoritative;
* use runtime IDs as durable identity;
* allocate incarnation during reference construction/resolution;
* infer historical lifetime from V1 artifacts.

---

# 142. Stop Conditions

Stop and report if:

* a supported occurrence family lacks sufficient authoritative coordinates;
* generated runtime objects cannot be connected to source incarnation without redesigning schedule generation;
* work provenance cannot distinguish nested source lifetime;
* N-per-week slot identity is not stable enough for durable use;
* manual-event update semantics contradict source-lifetime semantics;
* resolution requires current Preview as authority;
* a durable reference would need a new Active/Profile/Backup schema;
* `OccurrenceIdentity` V1 must change to make the reference work;
* scheduling behavior must change;
* source-incarnation semantics must change;
* full-suite failures reveal an unrelated architectural regression.

Recommend the narrowest prerequisite or corrective task.

---

# 143. Recommended Follow-On Boundary

If Task 2.32 completes successfully, do not immediately persist decisions unless the result confirms the reference contract is fully stable.

Recommended next task:

> **Task 2.33 — Define PlanDecision V1 Domain Semantics and Durable Decision Lifecycle**

That task should define:

* what constitutes a decision;
* which occurrence/reference it targets;
* decision kinds;
* decision provenance;
* applicability;
* supersession;
* stale-reference handling;
* conflict with changed authority;
* durable status;
* replay semantics;
* relationship to Preview generation.

Only after that contract is stable should a later task implement PlanDecision persistence/application.

---

# 144. Task Determination

**Authorized:** architecture and implementation of a versioned, structured, lifetime-safe `DurableOccurrenceReference V1`; authoritative constructors; strict validation; pure current-authority resolution; explicit stale-reference outcomes; canonical template/work/manual coordinates; direct regression coverage; and any narrowly necessary runtime provenance propagation that does not alter scheduling behavior.

**Not authorized:** PlanDecision, decision persistence/application, durable-surface schema changes, `OccurrenceIdentity` modification, scheduling redesign, history, or unrelated refactoring.

The governing identity principle is:

> A durable occurrence is not merely an occurrence at familiar coordinates. It is an occurrence at canonical coordinates belonging to a specific, provable source lifetime.

---

# 145. Final Completion Statement

**Task 2.32 is complete when DayFrame has a separately versioned, structured `DurableOccurrenceReference V1` whose supported template, work, and manual-event forms combine complete source-lifetime lineage with evidence-backed canonical occurrence coordinates; whose constructors, validator, equality semantics, and pure Preview-independent resolver distinguish resolved, source-missing, lifetime-mismatched, occurrence-missing, invalid, and unsupported references without relying on transient runtime IDs; whose references remain stable across regeneration, placement changes, overlapping windows, Active V2 restart, and Backup V2 restoration while correctly becoming stale across source recreation, Profile V2 activation, Backup V1 import, or occurrence-removing updates; whose construction and resolution allocate no new source identity and modify no durable surface; whose implementation leaves `OccurrenceIdentity` V1, scheduling, Active V2, Profile V2, Backup V2, and source-incarnation semantics unchanged; whose complete regression and repository validation pass; and which introduces no PlanDecision, decision persistence, history, or unrelated behavior.**
