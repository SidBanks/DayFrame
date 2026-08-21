# Task 2.32 Result — Define DurableOccurrenceReference V1 Semantics and Resolution Contract

## 1. Executive Result

Implemented a separately versioned, structured `DurableOccurrenceReference V1` for template, work, and manual-event occurrences. It combines complete source-lifetime lineage with canonical occurrence coordinates and resolves against current authored authority without Preview, persistence, or allocation.

## 2. Artifact Integrity

The supplied 49,137-byte, 2,216-line artifact and saved project copy were byte-identical. SHA-256: `81270b9951d3e6f025475a21cb2336eada66e8bd42dc7c67383284b0ad79b33d`. Required sections and the exact final statement were present.

## 3. Governing Evidence

Task 2.31's completed result and accepted cross-surface source-incarnation checkpoint were reviewed. The implementation preserves its lifetime, migration, profile, backup, scheduling-neutrality, and epistemic decisions.

## 4. Initial Occurrence-Provenance Audit

`OccurrenceIdentity` constructors and template recurrence expansion, cycle work generation, manual projection, clipping, placement, runtime IDs, Active V2, and source-incarnation types were audited. All three occurrence families expose sufficient authoritative provenance.

## 5. Files Changed

- `code/src/core/occurrences/durableOccurrenceReference.ts`
- `code/src/core/occurrences/tests/durableOccurrenceReference.test.ts`
- this result artifact

## 6. Durable Reference Definition

`DurableOccurrenceReference` is a structured discriminated union of template, work, and manual-event forms. Each combines V1, a semantic family discriminator, and sufficient lifetime lineage; generated families additionally contain canonical coordinates.

## 7. Version Contract

`DURABLE_OCCURRENCE_REFERENCE_VERSION` is independently fixed at `1`. It is not coupled to OccurrenceIdentity, Active, Profile, or Backup versions.

## 8. Supported Families

Template-generated, cycle-generated work, and manual-event occurrences are supported. Unsupported occurrence families return an explicit construction outcome.

## 9. Source-Kind Contract

Stable semantic discriminators are `template`, `work`, and `manualEvent`; internal generator names are excluded.

## 10. Template Source Lineage

Template references include both block-template ID/incarnation and block-recurrence ID/incarnation. Resolution also verifies the recurrence-to-template relationship.

## 11. Template Coordinate Contract

Coordinates reuse `OccurrenceIdentity` V1's canonical frequency, scope, date/week, and slot values rather than placement or preview data.

## 12. Daily Coordinate

Daily uses `userDayDate` plus slot `0` under normal generation.

## 13. Specific-Weekday Coordinate

Specific-weekday uses the matching `userDayDate` plus slot `0`.

## 14. Weekly Coordinate

Weekly uses canonical `userWeekStartDate` plus slot `0`, independent of the first visible preview date.

## 15. N-per-Week Coordinate

`timesPerUserWeek` uses canonical `userWeekStartDate` plus the stable pre-clipping slot.

## 16. Partial-Bounds Behavior

Recurrence bounds determine whether a coordinate still expands. Preview range is absent from the reference, so overlapping observation windows do not change identity.

## 17. Placement Independence

No scheduled time, candidate ID, scheduled-block ID, position, or placed/unplaced status is stored.

## 18. Work Provenance

Work references bind the shift cycle, producing segment or sequence entry, and shift definition.

## 19. Work Parent Lifetime

Cycle ID and incarnation are mandatory and checked first.

## 20. Work Nested Lifetime

The nested entry contains explicit `segment`/`sequenceEntry` kind, ID, and incarnation. Its ID is interpreted within the referenced parent cycle.

## 21. Shift-Definition Lifetime

Shift-definition ID and incarnation are mandatory, preventing false continuity after same-ID recreation.

## 22. Work Coordinate

The canonical coordinate is local start date plus slot `0`.

## 23. Overnight Work

Tests construct and resolve an overnight occurrence by local start date; next-day end time and rendering/clipping are excluded.

## 24. Work Slot Determination

Current cycle generation produces at most one occurrence for a complete cycle/entry/shift-definition lineage and local start date. V1 fixes work slot to `0`, and validation rejects any other value.

## 25. Manual Event Semantics

One authored manual event represents one semantic occurrence. ID plus incarnation is therefore complete; projection ID and date/time are excluded.

## 26. Manual Event Update Semantics

An ordinary move or content edit preserves lifetime and remains resolved. Direct coverage moves both date and title.

## 27. Reference Equality

`durableOccurrenceReferencesEqual` performs structural semantic, field-by-field equality. It does not use object identity or depend on serialized key order.

## 28. Construction Contract

The general constructor dispatches by `OccurrenceIdentity` family; authoritative family constructors bind identities to current incarnated authored state and return cloned plain data.

## 29. Construction Failure Contract

Construction returns `missingSourceLineage` with a component or `unsupportedOccurrence`; it never fabricates lineage or silently returns undefined.

## 30. Runtime-to-Durable Mapping

Runtime semantic coordinates are reused, then joined with current source lifetimes. Transient runtime IDs are not copied.

## 31. Validation Contract

Validation is strict and pure. It distinguishes `valid`, `invalid`, and `unsupportedVersion`, enforces exact per-family keys, and returns an isolated clone.

## 32. Unknown-Version Behavior

A numeric version other than 1 returns `unsupportedVersion`; malformed/missing version returns `invalid`.

## 33. Date/Slot Validation

Dates must be real canonical `YYYY-MM-DD` values. Slots must be nonnegative safe integers; work slot must equal zero. UUIDs must be canonical V4 source incarnations.

## 34. Resolution Definition

Resolution validates first, then looks up current readable lineage, compares incarnations, verifies relationships, and regenerates only the bounded canonical occurrence window where needed.

## 35. Resolver Inputs

The resolver accepts unknown reference input plus current `DayFrameAuthoredSetup`. Scheduling preferences, cycles, and source collections supply all generation context.

## 36. Preview Independence

Preview is neither an input nor a dependency. A stale, absent, or clipped Preview cannot affect resolution.

## 37. Resolution Result Union

Outcomes are `resolved`, `sourceMissing`, `lifetimeMismatch`, `occurrenceMissing`, `invalidReference`, and `unsupportedVersion`.

## 38. SourceMissing

Missing template, recurrence, cycle, nested entry, shift definition, or manual event reports `sourceMissing` with the exact component.

## 39. LifetimeMismatch

A matching readable ID with a differing incarnation reports `lifetimeMismatch`; resolution never aliases it to the recreated source.

## 40. Nested LifetimeMismatch

Work resolution diagnoses `cycle`, `entry`, and `shiftDefinition` independently. Direct tests cover all three.

## 41. OccurrenceMissing

Matching lifetimes whose current authored rules no longer produce the coordinate return `occurrenceMissing`.

## 42. Resolved

Success returns an isolated canonical reference and the current canonical `OccurrenceIdentity` as convenience metadata.

## 43. Relationship Mismatch

If matching template/recurrence lifetimes no longer have the referenced relationship, resolution returns `occurrenceMissing`; it does not falsely resolve.

## 44. Resolution Determinism

Resolution uses canonical generator primitives and semantic coordinate comparison. Repeated resolution against unchanged authority yields the same result.

## 45. Resolution Window

Template resolution generates a bounded window around its day/week anchor; work resolution generates around local start date; manual resolution requires no generation window.

## 46. Unsupported Recurrence Behavior

V1 validation accepts only daily, specific-weekday, weekly, and times-per-user-week coordinates. Other recurrence types cannot form a valid V1 template reference.

## 47. Relationship to OccurrenceIdentity V1

OccurrenceIdentity remains unchanged as runtime semantic identity. DurableReference wraps equivalent canonical coordinates with source lifetime; it does not replace or mutate V1 runtime identity.

## 48. Projection/Coordinate Reuse

Resolved generated references return the generator's current OccurrenceIdentity. Manual resolution creates the established manual runtime identity without using its projection ID as durable identity.

## 49. Restart Stability

Active V2 rehydration preserves source incarnations and authored coordinates, so old references continue to resolve.

## 50. Profile Activation Behavior

Profile activation allocates fresh source lifetimes; references from the prior active graph produce `lifetimeMismatch`.

## 51. Backup V1 Behavior

Backup V1 import establishes fresh lifetimes, so old references produce `lifetimeMismatch`.

## 52. Backup V2 Behavior

Backup V2 preserves the exact graph, so references continue to resolve when the occurrence remains authored.

## 53. Delete/Recreate Behavior

Same readable IDs with fresh incarnations return `lifetimeMismatch`.

## 54. Source-Deleted Behavior

Deletion returns `sourceMissing`, not null or an exception.

## 55. Update-Staleness Behavior

An update preserving lifetime may keep resolution successful or return `occurrenceMissing` if it removes the coordinate. Direct coverage changes recurrence bounds.

## 56. Manual Move Behavior

Manual movement remains resolved because the event lifetime itself identifies its sole occurrence.

## 57. Nested Parent Recreation

Parent cycle recreation is detected before nested lookup and returns cycle `lifetimeMismatch`, preventing scoped nested IDs from aliasing.

## 58. Persistence Readiness

References are explicit-versioned, plain structured data, JSON-roundtrip safe, clone-safe, strictly validated, and contain no functions/prototypes.

## 59. Clone/Input Isolation

Constructors and validation create new nested objects. Mutating a returned or validated reference cannot mutate state, an occurrence, or another construction.

## 60. Resolver Purity

Resolution performs lookups and bounded generation only. It does not mutate input state, the reference, Preview, or durable status.

## 61. Allocator Independence

The module does not import or call `createSourceIncarnationId` or an allocator. It consumes existing validated incarnation evidence only.

## 62. Durable-Surface Exclusion

No Active V2, Profile V2, Backup V2, Preview persistence, key, marker, serializer, or store state field was changed.

## 63. PlanDecision Boundary

No PlanDecision, decision replay, decision persistence, history, UI, friction, or SuggestedFix behavior was introduced.

## 64. Error Detail

Expected stale conditions are typed return values with component diagnostics. Validation issues are stable descriptive strings. No expected staleness throws.

## 65. Core Dependency Boundary

The module resides under `core/occurrences` and depends only on authored incarnation/types, occurrence identity, and canonical block/cycle generation. It has no React, UI, storage, or browser dependency.

## 66. Tests Added or Updated

Added seven direct tests covering all families, strict validation, JSON roundtrip, semantic equality, clone isolation, overnight work, explicit construction failure, source deletion, lifetime mismatch, occurrence removal, every work-lineage mismatch, nested parent recreation, and manual move.

### Reference Family Matrix

| Family | Source lifetime lineage | Canonical occurrence coordinate | Runtime ID excluded? |
| --- | --- | --- | ---: |
| Template | template + recurrence | day/slot or canonical week/slot | yes |
| Work | cycle + nested entry + shift definition | local start date + slot 0 | yes |
| Manual event | manual event | lifetime itself | yes |

### Resolution Outcome Matrix

| Current condition | Expected result |
| --- | --- |
| exact lineage + occurrence exists | resolved |
| readable source missing | sourceMissing |
| readable source exists, incarnation differs | lifetimeMismatch |
| lifetime matches, occurrence gone | occurrenceMissing |
| malformed V1 reference | invalidReference |
| future version | unsupportedVersion |

### Cross-Surface Resolution Matrix

| Transition | Old reference expected result |
| --- | --- |
| Active V2 restart | resolved |
| ordinary update, occurrence retained | resolved |
| ordinary update, occurrence removed | occurrenceMissing |
| delete/recreate same ID | lifetimeMismatch |
| Profile V2 activation | lifetimeMismatch |
| Backup V1 import | lifetimeMismatch |
| Backup V2 restore | resolved |

### Work Lineage Matrix

| Work provenance component | Readable ID | Incarnation required | Parent scope required |
| --- | ---: | ---: | ---: |
| Shift cycle | yes | yes | no |
| Segment/sequence entry | yes | yes | yes, cycle lifetime |
| Shift definition | yes | yes | no |

### Persistence Matrix

| Surface | Stores DurableOccurrenceReference in Task 2.32? |
| --- | ---: |
| Active V2 | No |
| Profile V2 | No |
| Backup V2 | No |
| Preview | No new persistence |
| PlanDecision | Not implemented |

## 67. Scheduling Regression

The complete engine and scheduling suite passed. No generator behavior or scheduling types were changed.

## 68. OccurrenceIdentity Regression

OccurrenceIdentity source and tests were unchanged; the complete suite passed.

## 69. Source-Incarnation Regression

Source-incarnation source and lifecycle behavior were unchanged; the complete suite passed.

## 70. Reference Audit

Reference search found the new symbol only in its dedicated core module and direct tests. No accidental UI/store coupling exists.

## 71. Persistence Audit

Reference search found no durable-reference field in Active, Profile, Backup, state, or UI code. No persistence surface emits it.

## 72. Architectural Alignment Assessment

The result aligns with Task 2.31: equality requires complete lifetime lineage, profiles/V1 imports intentionally stale old references, V2 active/backup preserve them, nested scope includes parent lifetime, and canonical scheduling identity remains incarnation-neutral.

## 73. Deviations

None. The preferred structured union, explicit constructors/results, validation outcomes, and pure resolver were implemented without scope expansion.

## 74. Discoveries and Deferred Work

- Runtime work identity retains the historical field name `shiftSegmentId` for both segment and sequence-entry provenance; DurableReference makes the semantic entry kind explicit.
- Relationship mismatch is represented as `occurrenceMissing`, as authorized.
- Persistence ownership, PlanDecision schema, replay policy, stale-decision UX, and reference migration remain deferred.

## 75. Recommended Next Task

Define PlanDecision V1 ownership and persistence semantics using `DurableOccurrenceReference V1`, including explicit behavior for every resolver outcome without changing the reference contract.

## 76. Focused Validation

`npx vitest run src/core/occurrences/tests/durableOccurrenceReference.test.ts` passed: 1 file, 7 tests. Focused typecheck and lint passed.

## 77. Full Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — passed: 32 files, 547 tests.
- `npm run build` — passed: TypeScript and Vite, 48 modules transformed.
- `git diff --check` — passed.

## 78. Final Completion Determination

**Complete.** DayFrame now has a separately versioned, structured, lifetime-safe DurableOccurrenceReference V1 with authoritative constructors, strict validation, semantic equality, pure Preview-independent resolution, explicit stale outcomes, complete lineage for template/work/manual families, canonical coordinates, persistence readiness, and direct regression coverage. No identity allocation, durable-surface change, scheduling change, PlanDecision, history, or unrelated behavior was introduced.
