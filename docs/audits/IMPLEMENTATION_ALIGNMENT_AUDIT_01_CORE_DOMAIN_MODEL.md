# DayFrame Implementation Alignment Audit 01

## Core Domain Model Compliance

**Normative source:** `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`, Chapter II  
**Implementation scope examined:** `code/src/core/**` and `code/src/state/**`  
**Audit date:** 2026-07-26

## Executive Summary

**Overall rating: Significantly Misaligned**

The implementation contains a coherent deterministic schedule-preview pipeline, but it does not
faithfully represent the published Core Domain Model as an explicit ontology. It implements useful
proxies for User Day, authored planning inputs, Planning Candidates, a proposed schedule, friction,
and advisory fixes. It does not define Domain Object Categories, does not assign Named Domain
Objects to exactly one category, and uses a parallel vocabulary based on shifts, templates, blocks,
previews, friction points, and suggested fixes.

The strongest alignment is in:

- User Day calculations and relationships to planning objects;
- deterministic generation of work blocks and block candidates;
- placing fixed work before flexible blocks;
- keeping the generated preview separate from persisted authored setup; and
- requiring a user-selected suggested fix before revising a preview.

The largest compliance gaps are:

- no explicit Commitment, Goal, Routine, Capacity Model, or canonical Generated Plan model;
- no Historical Domain Objects or Derived Analytical Domain Objects;
- no acceptance transition from Generated Plan to Accepted Schedule;
- no explicit ownership, provenance, category, or lifecycle metadata;
- conflation of authored objects and of Commitment/Goal occurrences in generic block types; and
- mutation/revision of a generated preview in place of producing a clearly distinct Generated Plan.

This is an implementation-alignment finding only. It does not challenge or propose changes to the
published architecture.

## Alignment Score

**Estimated compliance: 34%**

The estimate weights the Chapter II obligations as follows:

| Area | Weight | Assessment | Weighted result |
|---|---:|---:|---:|
| Four Domain Object Categories | 15% | 20% | 3.0% |
| Named Domain Objects | 35% | 31% | 10.9% |
| Relationships and lifecycle | 20% | 40% | 8.0% |
| Twelve architectural invariants | 20% | 40% | 8.0% |
| Canonical terminology | 10% | 40% | 4.0% |
| **Total** | **100%** |  | **33.9%** |

The score gives credit for semantic behavior even where canonical types are absent. It gives no
credit for future intent documented outside executable types and behavior. Missing historical and
analytical categories materially lower the score, as do the absence of explicit category
membership and the Commitment/Goal distinction.

## Audit Method and Classification

“Implemented” means that a distinct implementation type and behavior represent the architectural
object. “Partially implemented” means that one or more noncanonical types provide some of its
semantics but omit identity, lifecycle, ownership, authority, or required relationships. “Missing”
means no executable implementation representation was found.

Types used only as function inputs/results or UI/state envelopes are reported where they implement
part of a Named Domain Object. Incidental variable names such as `pattern`, `goal`, or `occurrence`
are not treated as Domain Objects.

## Domain Object Categories

| Category | Status | Implementation evidence | Finding |
|---|---|---|---|
| Authored Domain Objects | Partial | `DayFrameAuthoredSetup` selects preferences, shifts, templates, recurrences, and manual events (`code/src/state/types.ts:63-74`). Store setters modify those values (`code/src/state/dayFrameStore.ts:50-143`). | An authored-data boundary exists, but no type assigns its members to the Authored category and the members do not map one-to-one to the canonical authored objects. Author transformations are not represented. |
| Derived Domain Objects | Partial | `GenerateSchedulePreviewResult` contains generated work blocks, candidates, scheduled blocks, unplaced candidates, and friction points (`code/src/core/engine/generateSchedulePreview.ts:37-43`). The result is recomputed by `generateSchedulePreview` (`:45-200`). | Deterministic planning products exist, but there is no shared category marker, no Capacity Model, and several canonical products are conflated or renamed. |
| Historical Domain Objects | Missing | `ScheduledBlockStatus` includes `completed`, `missed`, and `skipped` (`code/src/core/blocks/types.ts:143-149`), but these statuses belong to `DraftScheduledBlock`; no recording operation or historical object is defined. | Status vocabulary is not a Historical Domain Object. No Accepted Schedule, Execution Event, or History Record model exists. |
| Derived Analytical Domain Objects | Missing | No corresponding types or producers were found under `code/src`. | Historical Analysis, Trend Analysis, and Planning Insight are absent. |

There is no `DomainObject`, `NamedDomainObject`, or `DomainObjectCategory` implementation type.
Consequently the implementation cannot enforce exactly-one-category membership or category
stability.

## Named Domain Object Matrix

### Fundamental and Authored Objects

| Architectural object | Status | Implementation mapping | Ownership, lifecycle, and authority assessment |
|---|---|---|---|
| Time | Partial | `TimeString`, `ParsedTime`, `Date`, and `LocalDateString` (`code/src/core/time/types.ts:10-16`; `code/src/core/shifts/types.ts:4`). | Correctly treated as values related to other objects rather than a system-owned entity. The architectural object/category boundary is not explicit. |
| User Day | Implemented | `UserDayBoundary` and `UserDayRange` (`code/src/core/time/types.ts:18-20,28-32`); `getUserDayDate`/`getUserDayStart` in `code/src/core/time/userDay.ts`; planning objects carry `userDayDate`. | The user-authored boundary drives calculations. A stable User Day identity is represented by a date string, not a distinct Named Domain Object, so category and lifecycle remain implicit. |
| Commitment | Partial | `ShiftDefinition`, `ShiftCycle`, and `ManualCalendarEvent` (`code/src/core/shifts/types.ts:6-17`; `code/src/core/cycles/types.ts:29-42`; `code/src/core/calendar/types.ts:12-22`). | These authored inputs express obligations, but none is named or typed as a Commitment. `ManualCalendarEvent` is later labeled `category: "optional"` despite fixed placement (`generateSchedulePreview.ts:238-253`). Commitment authority is therefore implicit and inconsistent. |
| Goal | Partial | Goal-like work is represented by `BlockTemplate` and `BlockRecurrence` (`code/src/core/blocks/types.ts:58-79,94-102`). | The same types also represent fixed obligations, routines, and preferences. There is no distinct Goal identity, progress semantics, or authority boundary. |
| Pattern | Partial | `ShiftCycle`, `ShiftCycleSequenceDay`, `BlockTemplate`, and `BlockRecurrence` model reusable recurrence (`code/src/core/cycles/types.ts:23-42`; `code/src/core/blocks/types.ts:58-102`). | Reusable structure exists, but it is split among types and not related explicitly to canonical Commitments or Goals. |
| Routine | Missing | No authored collection explicitly relates Patterns and Commitments. | A profile is a snapshot of the entire authored setup (`code/src/state/types.ts:43-48`), not a Routine with the specified membership semantics. |
| Preference | Partial | `DayFrameSchedulingPreferences`, `PreferredWindow`, priority, and rescheduling behavior (`code/src/state/types.ts:10-13`; `code/src/core/blocks/types.ts:23-33,58-79`). | Preferences influence placement, but are embedded across unrelated types. Some fields, such as fixed start, act as constraints. No explicit Preference object or authority/lifecycle exists. |
| Constraint | Partial | Fixed placement/time, required work anchor, date bounds, duration, and planning windows are embedded fields (`code/src/core/blocks/types.ts:58-79,94-127`). Validation enforces some mandatory conditions. | Constraints exist as fields and validation rules, not Named Domain Objects. This prevents explicit ownership and relationships and blurs Preference versus Constraint. |
| Capacity | Missing | Placement searches for gaps around work blocks in `placeBlockCandidates` (`code/src/core/blocks/placeBlockCandidates.ts:11-62,65-108`). | Available opportunity is computed procedurally but is not produced as a Capacity or Capacity Model object. Capacity is not authored, which is aligned, but it is not represented. |

### Derived Planning Objects

| Architectural object | Status | Implementation mapping | Ownership, lifecycle, and authority assessment |
|---|---|---|---|
| Commitment Occurrence | Partial | `GeneratedWorkBlock` / `GeneratedCycleWorkBlock` (`code/src/core/shifts/types.ts:19-31`; `code/src/core/cycles/types.ts:60-63`), produced by `generateCycleWorkBlocks`. | A work-shift instance has provenance IDs to a shift definition/cycle/segment. Manual commitments instead become `DraftScheduledBlock`, so the canonical occurrence concept is incomplete and inconsistent. |
| Goal Occurrence | Missing | `BlockCandidate` is generated directly from templates/recurrences. | No distinct Goal Occurrence exists between a Goal and Planning Candidate. A candidate points to `templateId` and `recurrenceId`, not `goalId` (`code/src/core/blocks/types.ts:104-127`). |
| Planning Candidate | Partial | `BlockCandidate` and `generateBlockCandidates` (`code/src/core/blocks/types.ts:104-139`; `code/src/core/blocks/generateBlockCandidates.ts`). | It is deterministically derived and disposable, but lacks canonical naming and cannot distinguish its source as a Goal Occurrence versus other authored structures. |
| Capacity Model | Missing | No type or returned value captures available capacity. | Placement consumes raw work blocks and candidates directly (`PlaceBlockCandidatesInput`, `code/src/core/blocks/types.ts:173-182`). |
| Generated Plan | Partial | `GenerateSchedulePreviewResult`, wrapped by `DayFramePreview` (`code/src/core/engine/generateSchedulePreview.ts:37-43`; `code/src/state/types.ts:31-41`). | It is a complete proposed preview and is not persisted with authored setup. It has no canonical identity, acceptance state, or transition to Accepted Schedule. `reviseSchedulePreview` creates a revised value but the store replaces the current preview (`dayFrameStore.ts:266-300`), making disposal/version identity implicit. |
| Friction Report | Partial | `FrictionPoint[]`, `DetectScheduleFrictionResult`, and `detectScheduleFriction` (`code/src/core/friction/types.ts:29-56`). | Conflicts are deterministically found, but no aggregate Friction Report exists. Individual points contain mutable-resolution fields (`ignored`, `resolved`, `updatedAt`), and revisions merge those fields (`reviseSchedulePreview.ts:115-140`). |
| Recommendation Proposal | Partial | `SuggestedFix` values nested in each `FrictionPoint` (`code/src/core/friction/types.ts:7-22,29-45`) and generated by `generateSuggestedFixes`. | Suggestions are advisory until a user selects one through `applySuggestedFixToPreview`. However, no canonical Recommendation Proposal type, provenance, acceptance record, or relationship to new authored intent exists. Selection directly revises derived blocks (`applySuggestedFix.ts:15-137`) rather than producing a separately typed accepted action or authored change. |

### Historical Objects

| Architectural object | Status | Evidence and assessment |
|---|---|---|
| Accepted Schedule | Missing | No accept operation or accepted schedule type exists. A preview remains a preview. |
| Execution Event | Missing | No recording type or operation exists. |
| History Record | Missing | No immutable historical record exists. Local backup/profile storage contains authored setup, not observed reality (`code/src/state/types.ts:43-48,63-74`). |

### Derived Analytical Objects

| Architectural object | Status | Evidence and assessment |
|---|---|---|
| Historical Analysis | Missing | No type or producer found. |
| Trend Analysis | Missing | No type or producer found. |
| Planning Insight | Missing | No type or producer found. |

## Implemented Noncanonical Domain Concepts

The following significant implementation concepts require an explicit canonical mapping during
alignment:

| Implementation concept | Current role | Closest architectural mapping / issue |
|---|---|---|
| `ShiftDefinition` | Authored work schedule definition | Part of Commitment or Pattern; currently ambiguous. |
| `ShiftCycle`, `ShiftSegment`, `ShiftCycleSequenceDay` | Authored recurring work structure | Pattern plus relationships to Commitments; currently split across concepts. |
| `ManualCalendarEvent` | Authored fixed event | Commitment; transformed directly into a draft scheduled block rather than a Commitment Occurrence. |
| `BlockTemplate` | Authored reusable scheduled activity | Conflates Goal, Commitment, Pattern, Preference, and Constraint. |
| `BlockRecurrence` | Authored recurrence rule | Pattern or relationship from a Pattern to a Goal/Commitment; not explicit. |
| `GeneratedWorkBlock` | Derived shift instance | Commitment Occurrence. |
| `BlockCandidate` | Derived potential activity instance | Conflates Goal Occurrence and Planning Candidate. |
| `DraftScheduledBlock` | Derived placed item | Element of Generated Plan, but includes execution-like status values. |
| `DayFramePreview` / `GenerateSchedulePreviewResult` | Proposed schedule envelope | Generated Plan. |
| `FrictionPoint` | Detected conflict plus suggestions and resolution state | Element of Friction Report; currently also owns recommendation and response state. |
| `SuggestedFix` | Proposed change to a preview | Recommendation Proposal. |
| `DayFrameSavedProfile` | Saved authored setup snapshot | No Chapter II equivalent; must not be treated as Routine or historical evidence without an explicit mapping. |

None of these types declares category membership. Several span more than one architectural meaning,
which prevents a definitive exactly-one-category assignment.

### Ancillary implementation types

The exported-type inventory also found the following meaningful data structures. They are not
treated as additional Chapter II Named Domain Objects because the implementation does not give them
an independent domain lifecycle, but their category must be resolved if they are intended to have
one:

| Type | Assessment |
|---|---|
| `CalendarHoliday` (`code/src/core/calendar/types.ts:4-10`) | Reference calendar information. It is not user intent, derived planning output, recorded reality, or historical analysis in the current implementation. If it affects mandatory placement, its relationship to a canonical Constraint must be explicit. |
| `ExternalResource` (`code/src/core/blocks/types.ts:47-56`) | Value owned by a `BlockTemplate`/candidate/scheduled block. It currently has its own ID and timestamps, but no category or canonical lifecycle. |
| `ShiftSegment` (`code/src/core/cycles/types.ts:12-21`) | Component of a `ShiftCycle`; its canonical Pattern/Commitment relationship is ambiguous. |
| `ShiftCycleSequenceDay` (`code/src/core/cycles/types.ts:23-27`) | Component of a recurring structure rather than a separately produced object. |
| `DayFramePreviewRange` (`code/src/state/types.ts:24-29`) | Planning-operation input/window, not a canonical Chapter II object. |
| `DayFrameBackupV1` and `DayFrameProfilesStorageV1` | Serialization envelopes around authored state; not historical evidence or History Records. |
| Validation, action-input, action-result, and store types | Operation contracts, not independently meaningful Domain Objects. |
| `FrictionSeverity`, `SuggestedFixAction`, block categories/statuses, recurrence/placement/source enums, `AnchorType`, IDs, dates, and time strings | Value classifications used by objects, not independently produced Named Domain Objects. |

`DayFrameState` is an application aggregate containing authored and derived information
(`code/src/state/types.ts:50-61`). It cannot itself belong to exactly one Domain Object Category and
should not be classified as a Named Domain Object.

## Domain Relationships

### Fully Aligned

1. **Planning is related to User Days.** Generated work blocks, candidates, and scheduled blocks
   carry `userDayDate` (`shifts/types.ts:19-31`; `blocks/types.ts:104-127,151-171`).
2. **Some derived occurrences retain source references.** `GeneratedWorkBlock` references
   `shiftDefinitionId`, and `GeneratedCycleWorkBlock` adds `shiftCycleId` and `shiftSegmentId`
   (`shifts/types.ts:19-31`; `cycles/types.ts:60-63`).
3. **Planning Candidates retain authored-source references.** `BlockCandidate` carries
   `templateId` and `recurrenceId` (`blocks/types.ts:104-127`).
4. **Friction relates to affected derived objects.** `FrictionPoint.affectedBlockIds` links
   findings to scheduled, work, or unplaced objects (`friction/types.ts:29-45`;
   `generateSchedulePreview.ts:169-191`).

### Partially Aligned

1. **Commitments precede flexible placement.** Work blocks are generated before candidates are
   placed, and placement receives them as occupied time (`generateSchedulePreview.ts:63-103`).
   This supports Commitment authority for shifts, but manual fixed events are appended only after
   template placement (`:104-123`). They therefore do not reserve time during placement and can
   conflict rather than being accommodated first.
2. **Goals consume remaining opportunity only by proxy.** Flexible block candidates are placed
   around generated work blocks (`placeBlockCandidates.ts:11-62`), but there is no Goal or Capacity
   relationship and fixed block templates can behave like commitments.
3. **Recommendations relate to friction.** `SuggestedFix[]` is nested in `FrictionPoint`, but the
   Recommendation Proposal is not independently identifiable and lacks provenance to a Generated
   Plan.
4. **A generated result groups proposed schedule information.** Preview results contain placed
   blocks and friction, but do not identify a Capacity Model, occurrence graph, plan ID, or source
   version.

### Missing or Invalid

1. Commitment → Commitment Occurrence is incomplete for manual events and not canonical for shifts.
2. Goal → Goal Occurrence is absent.
3. Goal Occurrence → Planning Candidate is absent.
4. Commitments → Capacity Model and Capacity Model → Planning Candidate placement are absent.
5. Generated Plan → explicit user acceptance → Accepted Schedule is absent.
6. Accepted Schedule → Execution Event / History Record is absent.
7. Historical objects → Historical Analysis → Trend Analysis / Planning Insight is absent.
8. Planning Insight → Recommendation Proposal or new authored intent is absent.
9. Routine → related Patterns and Commitments is absent.
10. Recommendation acceptance → new Authored Domain Object is absent; a selected fix changes only
    the derived preview.

## Architectural Invariant Compliance

| # | Invariant | Status | Evidence |
|---:|---|---|---|
| 1 | Every Named Domain Object belongs to exactly one category. | **Violated** | No category representation exists; `BlockTemplate` and `DraftScheduledBlock` span multiple meanings. |
| 2 | Authored objects are the sole authoritative source of user intent. | **Partial** | Authored setup is separated (`state/types.ts:63-74`), but selected suggested fixes directly change preview blocks and no accepted change is represented as authored intent (`applySuggestedFix.ts:15-137`). |
| 3 | Derived objects are deterministic and reproducible. | **Partial** | Core generation is deterministic for supplied inputs, including caller-provided timestamps (`generateSchedulePreview.ts:23-47`). Revision depends on selected IDs and a supplied timestamp but is reproducible from those inputs. No formal provenance/source snapshot guarantees reproduction. |
| 4 | Historical objects are immutable. | **Not testable / missing** | No Historical Domain Objects exist. Draft statuses do not satisfy this category. |
| 5 | Commitments own time. | **Violated** | Shift blocks reserve time, but manual fixed commitments are appended after candidate placement (`generateSchedulePreview.ts:86-123`), and generic fixed templates lack Commitment identity. |
| 6 | Goals consume remaining capacity. | **Partial** | Flexible template candidates use gaps after shift blocks, but no Goal or Capacity model exists and fixed templates can bypass this distinction. |
| 7 | Capacity is always derived. | **Partial** | No authored capacity field was found, which is aligned; however, no Capacity Named Domain Object is produced. |
| 8 | Generated Plans are proposals, not commitments. | **Partial** | The result is named `preview` and stored separately from authored setup (`state/types.ts:31-41,63-74`). No acceptance lifecycle exists, so the boundary cannot be completed or enforced. |
| 9 | Recommendation Proposals remain advisory until accepted. | **Partial** | A user-selected fix is required (`dayFrameStore.ts:266-277`), but there is no explicit acceptance object or transition; selection immediately revises derived output. |
| 10 | Named objects never change categories. | **Not enforceable** | Categories are not modeled. |
| 11 | Domain Objects never change architectural categories. | **Not enforceable** | Categories are not modeled. |
| 12 | Categories classify Named Objects but are not Domain Objects. | **Not implemented** | Neither categories nor a category/type distinction exists in code. |

### Additional lifecycle issue

The specification says each lifecycle transition creates new Domain Objects. Most implementation
functions clone inputs before revision, which avoids mutating caller-owned arrays. The state store,
however, replaces one unversioned `DayFramePreview` with its revision (`dayFrameStore.ts:279-298`).
Without Generated Plan identity or lineage, the implementation cannot demonstrate that a new
Generated Plan was created rather than that the same plan changed meaning.

## Terminology Findings

### Aligned terminology

- `UserDayBoundary`, `UserDayRange`, and `userDayDate` consistently express User Day.
- `PlanningWindow`, `Preference`, `Constraint`-like validation, and `friction` generally use terms
  compatibly with the specification, though not always as Named Domain Objects.

### Inconsistent or noncanonical terminology

| Current term | Canonical term | Problem |
|---|---|---|
| `GenerateSchedulePreviewResult`, `DayFramePreview` | Generated Plan | “Preview” describes UI/lifecycle posture but does not establish the canonical Domain Object. |
| `GeneratedWorkBlock` | Commitment Occurrence | The source relationship is shift-specific and hides Commitment identity. |
| `BlockCandidate` | Planning Candidate (and possibly Goal Occurrence) | One type collapses two lifecycle stages. |
| `DraftScheduledBlock` | Element of Generated Plan | `ScheduledBlockStatus` includes historical/execution terms on a derived proposal. |
| `FrictionPoint` / `DetectScheduleFrictionResult` | Friction Report | No named report aggregate exists. |
| `SuggestedFix` | Recommendation Proposal | The term omits its advisory architectural status and independent identity. |
| `BlockTemplate` | Goal, Commitment, or Pattern | Ambiguous: placement type and category determine semantics instead of the ontology. |
| `ShiftDefinition` / `ManualCalendarEvent` | Commitment and/or Pattern | Implementation-specific sources are not mapped to canonical authored objects. |
| `savedProfile` | No Chapter II synonym | Must remain an application storage concept unless explicitly composed from canonical objects. |

No code use of canonical `Commitment`, `Goal`, `Routine`, `Capacity Model`, `Accepted Schedule`,
`Execution Event`, `History Record`, `Historical Analysis`, `Trend Analysis`, or `Planning Insight`
was found. No clearly deprecated glossary term was found; the primary issue is a parallel,
ambiguous vocabulary rather than use of an expressly deprecated term.

## Findings

### Fully Aligned

**FA-01 — User Day boundaries drive planning calculations.**  
Evidence: `UserDayBoundary`/`UserDayRange` in `code/src/core/time/types.ts:18-32`;
`getUserDayDate` and `getUserDayStart` in `code/src/core/time/userDay.ts`; per-day boundary
resolution in `generateSchedulePreview.ts:55-61,94-102,148-164`.  
The implementation respects the user's intentional daily boundary rather than assuming midnight.

**FA-02 — Core preview generation is a deterministic derivation over explicit inputs.**  
Evidence: `generateSchedulePreview` accepts authored structures, a planning window, preferences, and
an explicit `generatedAt` (`generateSchedulePreview.ts:23-47`), then generates candidates, places
them, and detects friction (`:63-134`).  
No hidden random or current-time source was found in the derivation path examined.

**FA-03 — Derived previews are excluded from the persisted authored setup.**  
Evidence: `DayFrameAuthoredSetup` omits `preview` (`state/types.ts:63-74`), and `persistState`
persists preferences, shifts, templates, recurrences, and manual events but not preview
(`state/dayFrameStore.ts:398-417`).  
This supports derived disposability.

### Partially Aligned

**PA-01 — Authored inputs exist without canonical object boundaries.**  
Affected types: `DayFrameAuthoredSetup`, `ShiftDefinition`, `ShiftCycle`, `ManualCalendarEvent`,
`BlockTemplate`, and `BlockRecurrence`.  
These are user-maintained inputs, but do not uniquely represent Commitment, Goal, Pattern, Routine,
Preference, and Constraint.

**PA-02 — Planning Candidate behavior is present under `BlockCandidate`.**  
Evidence: `generateBlockCandidates` deterministically expands templates/recurrences, and
`placeBlockCandidates` considers each result for placement.  
It lacks a preceding Goal Occurrence and explicit canonical source relationship.

**PA-03 — The preview behaves as a disposable proposed plan.**  
Evidence: `GenerateSchedulePreviewResult` and `DayFramePreview`; regeneration replaces it, and it is
not persisted.  
Missing plan identity, source provenance, acceptance, and Accepted Schedule make the lifecycle
partial.

**PA-04 — Friction and recommendations exist as nested implementation details.**  
Evidence: `FrictionPoint.suggestedFixes` (`friction/types.ts:29-45`) and the generation calls in
`generateSchedulePreview.ts:112-134`.  
Neither Friction Report nor Recommendation Proposal is independently modeled.

**PA-05 — Recommendations require an explicit user action but do not cross a modeled acceptance
boundary.**  
Evidence: the selected friction/fix IDs are store action inputs (`state/types.ts:84-88`) and are
required by `applySuggestedFix` (`friction/applySuggestedFix.ts:15-31`).  
The result revises a derived plan; it does not create authoritative authored intent.

### Misaligned

**MA-01 — Domain Object Categories are absent and therefore unenforceable.**  
Affected implementation: all domain types under `code/src/core` and `code/src/state`.  
This conflicts with invariants 1, 10, 11, and 12.

**MA-02 — `BlockTemplate` conflates multiple authored categories and authority levels.**  
Evidence: one type combines category, fixed/flexible placement, duration, priority, preferred
window, recurrence behavior, resource requirements, and enabled state
(`blocks/types.ts:58-79`).  
A fixed obligation and a capacity-consuming goal can have the same type, so Commitment versus Goal
authority is not structurally enforceable.

**MA-03 — Manual commitments do not own time during placement.**  
Evidence: placement runs with generated work blocks at `generateSchedulePreview.ts:86-103`;
manual events are converted and appended only at `:104-123`.  
This can place goal-like blocks into manual commitment time, contrary to invariants 5 and 6.

**MA-04 — Derived planning objects contain execution/historical state vocabulary.**  
Evidence: `DraftScheduledBlock.status` can be `completed`, `missed`, `skipped`, `rescheduled`, or
`conflicted` (`blocks/types.ts:143-170`).  
Without a Record transformation and immutable Historical Domain Object, observed reality is
ambiguous and can be mistaken for mutable plan state.

**MA-05 — Suggested fixes directly rewrite derived candidates/blocks without canonical proposal
and acceptance objects.**  
Evidence: `applySuggestedFix` changes status, duration, category, title, priority, or placement
(`applySuggestedFix.ts:39-92,140-203` and subsequent action helpers), and the store replaces the
preview (`dayFrameStore.ts:266-300`).  
The explicit click is useful user authority, but the required Recommendation Proposal lifecycle and
new-object lineage are absent.

### Missing

**MI-01:** explicit Domain Object Category representation and category membership.  
**MI-02:** distinct Commitment and Goal models.  
**MI-03:** Routine.  
**MI-04:** explicit Preference and Constraint models.  
**MI-05:** Capacity and Capacity Model.  
**MI-06:** complete Commitment Occurrence model and relationship.  
**MI-07:** Goal Occurrence.  
**MI-08:** canonical Generated Plan identity and lifecycle.  
**MI-09:** aggregate Friction Report.  
**MI-10:** independent Recommendation Proposal.  
**MI-11:** Accepted Schedule and explicit acceptance transition.  
**MI-12:** Execution Event and History Record.  
**MI-13:** Historical Analysis, Trend Analysis, and Planning Insight.  
**MI-14:** explicit lifecycle provenance connecting authored, derived, historical, and analytical
objects.

## Recommendations

These recommendations change the implementation to match the published model; they do not alter
the architecture.

1. **Introduce explicit category membership.** Add a type-level or runtime representation that
   assigns every canonical Named Domain Object to exactly one of the four categories. Do not model
   Domain Object Categories as Domain Objects. Add compile-time and unit checks for uniqueness and
   stability.
2. **Create canonical authored models.** Represent Commitment, Goal, Pattern, Routine, Preference,
   and Constraint as distinct types with stable identity. Map or migrate `ShiftDefinition`,
   `ShiftCycle`, `ManualCalendarEvent`, `BlockTemplate`, and `BlockRecurrence` to those canonical
   objects instead of allowing a generic block type to determine authority.
3. **Make authority structural.** Require Commitment inputs to reserve time before Goal placement.
   Convert manual fixed events to Commitments and Commitment Occurrences before capacity
   derivation, rather than appending them after placement.
4. **Materialize Capacity and Capacity Model.** Derive an explicit Capacity Model from Commitment
   Occurrences and Constraints, and make Goal placement consume that model. Do not add Capacity to
   authored state.
5. **Separate derivation stages.** Produce Commitment Occurrences and Goal Occurrences as distinct
   objects, then produce Planning Candidates with source IDs referencing their originating
   occurrences.
6. **Replace the preview envelope as the domain boundary.** Keep “preview” as UI terminology if
   useful, but have it display a canonical Generated Plan with identity, source references,
   generation metadata, and proposal status.
7. **Create new Generated Plans on revision.** Preserve predecessor/source lineage when applying an
   accepted Recommendation Proposal. Do not reuse one unversioned plan identity for changed
   meaning.
8. **Model Friction Report and Recommendation Proposal explicitly.** Give each an identity,
   category, source Generated Plan reference, and deterministic provenance. Keep proposals advisory
   and record explicit user acceptance before applying their effects.
9. **Implement the historical boundary.** Add explicit plan acceptance that creates an Accepted
   Schedule, then record observed outcomes as immutable Execution Events and/or History Records.
   Remove execution-only statuses from mutable draft-plan objects or clearly restrict them to
   proposal state.
10. **Implement analytical objects only from historical inputs.** Add Historical Analysis, Trend
    Analysis, and Planning Insight as disposable Derived Analytical Domain Objects whose source
    references are Historical Domain Objects.
11. **Align exported names and relationships with the glossary.** Prefer canonical names at domain
    boundaries. Where implementation-specific names remain, document and enforce a one-to-one
    mapping rather than relying on contextual interpretation.
12. **Add invariant tests.** Cover all twelve Chapter II invariants, including category uniqueness,
    historical immutability, deterministic regeneration, Commitment precedence, derived-only
    Capacity, Generated Plan disposability, and advisory Recommendation Proposals.

## Open Questions

These are implementation uncertainties that affect exact mapping; they do not require new
architectural concepts.

1. Is a `ShiftDefinition` intended to be a Commitment, a Pattern that generates Commitments, or an
   implementation input used to author both? The code does not declare the mapping.
2. Is a fixed `BlockTemplate` intended to be a Commitment while a flexible `BlockTemplate` is a
   Goal, or are both Patterns that reference separate absent objects?
3. Is `BlockCandidate` intended to represent a Goal Occurrence, a Planning Candidate, or both
   stages?
4. Is `DraftScheduledBlock` intended solely as part of a Generated Plan, or are its
   `completed`/`missed` statuses intended to record observed reality?
5. Does selecting a `SuggestedFix` represent acceptance of a Recommendation Proposal only, or is
   it also intended to author a lasting change? Current behavior revises only the preview and does
   not persist a corresponding authored change.
6. Are manual calendar events authoritative Commitments? Their fixed timing suggests yes, while
   their conversion to `category: "optional"` and post-placement insertion suggest otherwise.

## Completion Statement

Every canonical Named Domain Object stated or exemplified in Chapter II has been evaluated,
including the fundamental objects, all seven Derived Planning Objects, the three Historical
examples, and all three Derived Analytical Objects. All four Domain Object Categories and all
twelve Core Domain Model invariants have been assessed. Findings are tied to executable
implementation evidence, and recommendations are limited to bringing that implementation into
compliance with the published specification.
