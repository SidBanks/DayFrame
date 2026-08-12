# DayFrame Implementation Alignment Audit 05

## Architectural Provenance Compliance

**Normative source:** `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`  
**Audit standard:** `Implementation_Alignment_Standard.md`, Version 1.0.0  
**Implementation scope:** `code/src/**`  
**Audit date:** 2026-07-26

## Executive Summary

**Overall rating: Significantly Misaligned**

The implementation does not preserve complete architectural provenance for any produced Domain
Object or Domain Object proxy. No output identifies all required dimensions:

- originating Domain Objects;
- predecessor Domain Objects;
- transformations performed;
- producing Architectural Service; and
- coordinating Architectural Engine.

Several derived implementation objects retain useful local references. Generated work blocks
reference shift definitions and, for cycle generation, shift cycles and segments. Block candidates
reference templates and recurrences. Friction points reference affected block IDs. Deterministic
IDs often encode immediate predecessors. Preview and friction timestamps identify when a caller
requested generation or revision.

These fields provide partial behavioral traceability, not architectural provenance. Lineage is
lost or weakened at placement: a scheduled block retains `templateId` but not an explicit candidate
or recurrence reference. Manual-event conversion preserves the event ID only by reusing it as a
scheduled-block ID and hard-codes a user ID. Suggested fixes are nested under friction points and
do not identify the authored intent or Generated Plan from which they arose. Preview results do not
identify their input object versions, participating services, engine, transformations, or
predecessor plan.

The implementation has no canonical provenance model, provenance contract, transformation record,
service identity, engine identity, or provenance completeness validation. Record and Analyze stages
are absent, so cross-stage traceability cannot extend beyond current planning previews.

## Alignment Score

**Estimated compliance: 12%**

| Provenance dimension | Weight | Assessment | Weighted result |
|---|---:|---:|---:|
| Originating Domain Objects | 25% | 28% | 7.0% |
| Predecessor relationships | 15% | 20% | 3.0% |
| Transformation identity/lineage | 20% | 0% | 0.0% |
| Producing Architectural Service | 15% | 0% | 0.0% |
| Coordinating Architectural Engine | 15% | 0% | 0.0% |
| Cross-stage preservation and completeness | 10% | 15% | 1.5% |
| **Total** | **100%** |  | **11.5%** |

The score rounds to 12%. Credit is limited to explicit immediate-source fields, stable
predecessor-derived IDs, and copying of those fields across cloning/state boundaries. Timestamps,
file locations, function names, array containment, and storage keys do not receive architectural
provenance credit.

## Architectural Assumptions

- The published architecture is authoritative.
- Provenance is an architectural property.
- Provenance must survive every architectural transformation.
- Missing provenance is an implementation-alignment issue.
- Canonical provenance consists of origin, transformation lineage, producing service, coordinating
  engine, and predecessor relationships.
- Behavioral reconstructability does not substitute for provenance stored on or with the produced
  Domain Object.

The specification uses “all Domain Objects,” “every significant Domain Object,” and “every
workflow result” in related provenance requirements (Chapter I §1.3, Chapter III §3.4, Chapter V
§5.9, Chapter VI §6.10, and Appendix A.4). This audit applies the strongest consistent requirement:
every produced significant object and workflow result must preserve complete provenance.

## Audit Scope

This audit evaluates only provenance:

- origin preservation;
- predecessor and transformation lineage;
- producing-service and coordinating-engine identity;
- cross-stage traceability;
- completeness, consistency, and survival through state/clone boundaries; and
- responsibility for provenance.

Scheduling correctness, presentation, persistence technology, performance, and code quality are
outside scope except where they demonstrate creation, preservation, loss, or consumption of
provenance. Because the implementation does not define canonical Domain Objects, the inventory
includes significant implementation objects that act as Domain Object proxies. Operation-input,
validation-result, store-interface, scalar, enum, and serialization-envelope types are excluded
unless they themselves carry or destroy provenance.

## Provenance Inventory

Every significant object produced or materially reconstructed by executable code in scope appears
once below. “Missing” means no architectural provenance dimension is explicitly recorded.
“Partial” means at least one immediate origin/predecessor reference is explicit, while one or more
mandatory dimensions are absent.

| Domain Object / implementation proxy | Origin | Service | Engine | Transformation | Status |
|---|---|---|---|---|---|
| `DayFrameSchedulingPreferences` | Values supplied to setter or loaded state; no originating user action/object ID | Missing | Missing | Missing | Missing |
| `ShiftDefinition` | Caller/import value with user ID and timestamps; no Author origin record | Missing | Missing | Missing | Missing |
| `ShiftCycle` including segments/sequence days | Caller/import value; internal references to definition/cycle IDs, but no Author origin | Missing | Missing | Missing | Partial |
| `BlockTemplate` including `ExternalResource` | Caller/import value with IDs/timestamps; no Author origin record | Missing | Missing | Missing | Missing |
| `BlockRecurrence` | Explicit `blockTemplateId` predecessor-like relationship | Missing | Missing | Missing | Partial |
| `ManualCalendarEvent` | Caller/import value with ID/timestamps; no Author origin record | Missing | Missing | Missing | Missing |
| `DayFrameSavedProfile` | Contains cloned authored setup and `savedAt`; source setup versions/actions not identified | Missing | Missing | Missing | Partial |
| `UserDayRange` | Input `Date` and boundary are not retained on the result beyond derived dates | Missing | Missing | Missing | Partial |
| `UserWeekRange` | Derived start/end; source preferences are not retained | Missing | Missing | Missing | Partial |
| `CalendarHoliday` | Cloned from an internal static dataset; dataset/version/producer not identified | Missing | Missing | Missing | Missing |
| `GeneratedWorkBlock` / `GeneratedCycleWorkBlock` | `shiftDefinitionId`; cycle blocks also retain `shiftCycleId` and `shiftSegmentId` | Missing | Missing | Missing | Partial |
| `BlockCandidate` | Explicit `templateId` and `recurrenceId`; date and deterministic ID | Missing | Missing | Missing | Partial |
| `DraftScheduledBlock` | `templateId`; generated ID embeds candidate ID, or manual event ID is reused; no explicit complete predecessor set | Missing | Missing | Missing | Partial |
| `FrictionPoint` | `affectedBlockIds`, optional affected day/week, generation timestamps | Missing | Missing | Missing | Partial |
| `SuggestedFix` | ID often embeds a target block ID; nested under a friction point; no explicit plan/authored origin | Missing | Missing | Missing | Partial |
| `GenerateSchedulePreviewResult` / `DayFramePreview` | Contains current outputs and generation metadata; no input object/version set or plan predecessor | Missing | Missing | Missing | Partial |
| Revised preview and `SuggestedFixFeedback` | Selected IDs and `revisedAt` are operation inputs but are not retained as complete revision provenance | Missing | Missing | Missing | Partial |

`DayFrameBackupV1`, `DayFrameProfilesStorageV1`, `PersistedDayFrameState`, action inputs/results, and
`DayFrameState` are transport/application envelopes rather than independent Chapter II Named
Domain Objects. They are still assessed below as boundaries through which provenance would need to
survive.

No Accepted Schedule, Execution Event, History Record, Historical Analysis, Trend Analysis, or
Planning Insight is produced, so those canonical objects do not appear as implementation inventory
rows. Their missing provenance stages are assessed under Missing findings.

## Provenance Matrix

| Stage | Incoming Provenance | Outgoing Provenance | Preserved | Lost |
|---|---|---|---|---|
| Author-like store setters | Caller values and current state | Cloned authored-like values, timestamps already present | IDs and object timestamps supplied by caller | User action, Author transformation, authoring service, Teach Engine, predecessor version |
| Profile save/load and backup import | Current or serialized authored setup | Cloned/normalized authored setup | Most IDs, timestamps, and relationships | Source object versions, save/load transformation, producing service/engine; normalization changes are unrecorded |
| Commitment-like occurrence generation | Shift definition/cycle/segment inputs | Generated work blocks | Definition ID; cycle and segment IDs on cycle blocks | Transformation, service, engine, source object versions, planning-workflow identity |
| Candidate generation | Templates, recurrences, dates, preferences | Block candidates | Template ID, recurrence ID, User Day/week dates | Goal Occurrence predecessor, transformation, service, engine, input versions |
| Placement | Candidates, work blocks, window/boundary | Scheduled and unplaced arrays | Template ID; candidate identity encoded in scheduled ID; candidates preserved only if unplaced | Explicit candidate/recurrence predecessor, capacity source, placement reasoning, service/engine/transformation |
| Manual-event conversion | Manual events plus dates/preferences | Draft scheduled blocks | Event ID reused as block ID; title/timing copied | Explicit event reference, original user identity (`user_001` substituted), service/engine/transformation |
| Friction detection | Work blocks, scheduled blocks, unplaced candidates | Friction points | Affected block IDs and detection timestamp | Generated Plan identity, full authored lineage, service/engine/transformation |
| Recommendation generation | Friction and current planning collections | Friction points with nested suggested fixes | Friction containment and target-like IDs | Independent proposal predecessor, plan/authored origin, service/engine/transformation |
| Preview aggregation | All current derived collections | Preview result/envelope | Collections and workflow timestamps | Input object versions, participating services, engine identity, transformation list, plan identity |
| Preview revision | Prior preview, selected IDs, revision time | Replacement preview and optional feedback | Many current object fields; `generatedAt` and optional `revisedAt` | Explicit predecessor plan, accepted proposal ID on output, revision transformation/service/engine, changed-object lineage |
| Record | No implementation | No output | Nothing | Entire historical provenance stage |
| Analyze | No implementation | No output | Nothing | Entire analytical provenance stage |

## Findings

### Fully Aligned

#### FA-01 — Work-block and candidate proxies preserve explicit immediate source identifiers

**Architecture Reference:** Chapter III §3.4; Chapter V §5.9; Appendix A.4.

**Implementation Evidence:**

- `GeneratedWorkBlock.shiftDefinitionId` identifies the source shift definition
  (`code/src/core/shifts/types.ts:19-31`).
- `GeneratedCycleWorkBlock` adds `shiftCycleId` and `shiftSegmentId`
  (`code/src/core/cycles/types.ts:60-63`).
- Both manual-segment and repeating-sequence generation populate those fields
  (`code/src/core/cycles/generateCycleWorkBlocks.ts:100-113,147-165`).
- `BlockCandidate` explicitly stores `templateId` and `recurrenceId`
  (`code/src/core/blocks/types.ts:104-127`), populated by
  `generateBlockCandidates` (`code/src/core/blocks/generateBlockCandidates.ts:250-276`).
- Tests assert these source fields in cycle, block, friction, and engine test suites.

**Finding:** These two derivation outputs preserve useful, explicit references to their immediate
implementation sources.

**Severity:** Informational. The local origin fields are aligned as far as they go; missing
architectural dimensions are addressed separately.

**Architectural Impact:** Immediate authored-like inputs can often be located if the caller still
retains a matching object collection.

**Recommendation:** Retain these explicit source fields as part of complete provenance, while
adding source versions, transformation, service, engine, and predecessor-chain metadata.

#### FA-02 — Friction points explicitly identify the planning artifacts they assess

**Architecture Reference:** Chapter III §3.4 and Appendix A.5 Explainability.

**Implementation Evidence:**

- `FrictionPoint` includes `affectedBlockIds` and optional affected User Day/week values
  (`code/src/core/friction/types.ts:29-45`).
- Conflict friction stores both conflicting IDs
  (`code/src/core/friction/detectScheduleFriction.ts:139-167`).
- Unplaced-candidate friction stores the candidate ID
  (`code/src/core/friction/detectScheduleFriction.ts:75-136`).
- Tests assert exact affected IDs
  (`code/src/core/friction/tests/detectScheduleFriction.test.ts:54,335` and related cases).

**Finding:** Immediate subjects of a friction conclusion are explicit rather than inferable only
from message text.

**Severity:** Informational. This is aligned local traceability.

**Architectural Impact:** A conflict can be explained at the current-plan artifact level while
those artifacts remain available.

**Recommendation:** Preserve affected-object references and extend each Friction Report/finding to
the complete plan, authored origins, producing service, coordinating engine, and transformation.

#### FA-03 — Cloning boundaries preserve the provenance-like fields that currently exist

**Architecture Reference:** Chapter III §3.4 and §3.9 invariant 4.

**Implementation Evidence:**

- `cloneState` and `clonePreview` retain authored objects, preview result, generation time, and
  revision time (`code/src/state/dayFrameStore.ts:525-557`).
- `clonePreviewResult` copies work-block source IDs, candidate source IDs, scheduled-block fields,
  friction affected IDs, and suggested fixes
  (`code/src/state/dayFrameStore.ts:580-624`).
- `cloneDayFrameAuthoredSetup` copies shift, cycle, template, recurrence, resource, and event
  relationships (`code/src/state/dayFrameBackup.ts:72-102`).
- Tests verify deep cloning for profiles and backups
  (`code/src/state/dayFrameProfiles.test.ts:20-31`;
  `code/src/state/dayFrameBackup.test.ts:69-74`).

**Finding:** The state/backup clone operations do not intentionally strip the limited IDs and
timestamps currently available.

**Severity:** Informational. Existing partial traceability generally survives in-memory copying.

**Architectural Impact:** Introducing complete provenance need not require replacing these clone
boundaries, but every new provenance field must also be copied and validated.

**Recommendation:** Extend cloning/validation to preserve the future canonical provenance record
atomically with each Domain Object.

### Partially Aligned

#### PA-01 — Deterministic IDs encode lineage but are not explicit predecessor relationships

**Architecture Reference:** Chapter I §1.3 Explainability Through Provenance; Chapter III §3.4.

**Implementation Evidence:**

- Work-block IDs include shift-definition ID and date
  (`code/src/core/shifts/generateWorkBlocks.ts:68-85`).
- Candidate IDs include template ID, recurrence ID, and User Day date
  (`code/src/core/blocks/generateBlockCandidates.ts:250-255`).
- Scheduled-block IDs prefix the candidate ID
  (`code/src/core/blocks/placeBlockCandidates.ts:152-164`).
- Friction and fix IDs embed affected block IDs
  (`code/src/core/friction/detectScheduleFriction.ts:82-93,152-165,226-291`).

**Finding:** IDs often permit a developer to infer immediate lineage, but no schema declares the
encoded segments, and consumers should not have to parse identity strings to recover provenance.

**Severity:** Medium. Functional traceability exists but is brittle and incomplete.

**Architectural Impact:** Renaming an ID format can destroy reconstructability without a type or
validation failure.

**Recommendation:** Preserve predecessor identities in explicit typed provenance relationships;
keep deterministic object IDs as identity, not as the sole lineage record.

#### PA-02 — Timestamps identify operation timing but not architectural origin

**Architecture Reference:** Chapter V §5.9 and Chapter VI §6.10.

**Implementation Evidence:**

- Friction points receive `createdAt` and `updatedAt` from caller-supplied `detectedAt`
  (`code/src/core/friction/detectScheduleFriction.ts:75-167`).
- Preview envelopes retain `generatedAt` and optional `revisedAt`
  (`code/src/state/types.ts:31-41`).
- Tests verify that supplied generation/revision timestamps are used consistently
  (`code/src/core/engine/tests/generateSchedulePreview.test.ts:479-551`;
  `code/src/core/engine/tests/reviseSchedulePreview.test.ts:427`).

**Finding:** Timing is explicit and reproducible, but a timestamp does not identify the
transformation, service, engine, source objects, or predecessor plan.

**Severity:** Low. Timing is a useful provenance component but receives too much implicit
responsibility in the absence of an architectural record.

**Architectural Impact:** Two outcomes can share a time without sharing origin, and one outcome
cannot be reconstructed from time metadata.

**Recommendation:** Retain transformation time as one provenance field, never as a substitute for
the required provenance dimensions.

#### PA-03 — Authored objects retain IDs and timestamps but no authoring lineage

**Architecture Reference:** Chapter I §1.5; Chapter III §§3.4-3.5 Author; Chapter IV §4.9.

**Implementation Evidence:**

- Shift definitions, cycles, templates, resources, and manual events include IDs and creation/update
  timestamps (`code/src/core/shifts/types.ts:6-17`;
  `code/src/core/cycles/types.ts:29-42`;
  `code/src/core/blocks/types.ts:47-79`;
  `code/src/core/calendar/types.ts:12-22`).
- Store setters accept replacement values but do not retain user-action, predecessor-version, or
  authoring-operation metadata (`code/src/state/dayFrameStore.ts:50-143`).
- Profile load and backup import replace authored setup without recording the source profile/backup
  on the resulting objects (`code/src/state/dayFrameStore.ts:174-229`).

**Finding:** Identity and lifecycle timestamps are present, but the implementation cannot establish
which explicit authoring action, Author transformation, service, or Teach Engine produced a
particular authored version.

**Severity:** High. Provenance is required from the first architectural stage, not only after
planning.

**Architectural Impact:** All downstream derivation begins from authored objects whose own
architectural origin is incomplete.

**Recommendation:** Record the originating authoring action, predecessor authored version, Author
transformation, producing Authoring Service, and coordinating Teach Engine for every authored
object version.

#### PA-04 — Current explanation text is derived from local context rather than retained lineage

**Architecture Reference:** Chapter I §1.3; Appendix A.5.

**Implementation Evidence:**

- `detectScheduleFriction` creates human-readable titles/messages from current block values
  (`code/src/core/friction/detectScheduleFriction.ts:139-202`).
- `generateSuggestedFixes` reconstructs context by looking up affected IDs in current arrays
  (`code/src/core/friction/generateSuggestedFixes.ts:34-126`).
- If an ID lookup fails, suggestion generation falls back to existing suggested fixes
  (`code/src/core/friction/generateSuggestedFixes.ts:129-143`;
  test at `code/src/core/friction/tests/generateSuggestedFixes.test.ts:518`).

**Finding:** Immediate explanations can be generated while all current arrays are co-located.
Explanation depends on reconstructing context at runtime rather than following preserved provenance.

**Severity:** Medium. Results are locally understandable, but the architectural reasoning chain is
not durable.

**Architectural Impact:** Removing or replacing current arrays can make an existing conclusion
unexplainable even if the conclusion survives.

**Recommendation:** Generate explanations from preserved provenance that travels with the
conclusion and identifies all originating information and transformations.

### Misaligned

#### MA-01 — No produced object records complete architectural provenance

**Architecture Reference:** Chapter I §1.3 and §1.7 invariant 4; Chapter III §3.4 and §3.9
invariant 4; Appendix A.4.

**Implementation Evidence:**

- The Provenance Inventory found no type containing origin object set, transformation history,
  producing service, coordinating engine, and predecessors.
- Repository search found no provenance type, field, builder, validator, or completeness test under
  `code/src`.
- Existing output types contain only implementation-specific IDs/timestamps
  (`code/src/core/shifts/types.ts`, `blocks/types.ts`, `friction/types.ts`, and
  `state/types.ts`).

**Finding:** Zero produced objects satisfy the complete normative provenance contract.

**Severity:** Critical. Complete provenance is a global architectural invariant and the basis for
explainability.

**Architectural Impact:** No architectural conclusion can prove its full conceptual origin,
responsible capability, coordinating workflow, or transformation history.

**Recommendation:** Add a canonical provenance record to every produced Domain Object and enforce
all required dimensions at construction boundaries.

#### MA-02 — Placement loses explicit candidate and recurrence lineage

**Architecture Reference:** Chapter III §3.4; Chapter V §5.9.

**Implementation Evidence:**

- `BlockCandidate` has both `templateId` and `recurrenceId`
  (`code/src/core/blocks/types.ts:104-127`).
- `buildScheduledBlock` stores `templateId` but no `candidateId` or `recurrenceId`
  (`code/src/core/blocks/placeBlockCandidates.ts:152-185`).
- The scheduled ID embeds the candidate ID as a string
  (`code/src/core/blocks/placeBlockCandidates.ts:160-164`).
- Candidate-to-scheduled conversion in `applySuggestedFix` has the same loss
  (`code/src/core/friction/applySuggestedFix.ts:415-436`).

**Finding:** An explicit source relationship becomes an encoded naming convention at the placement
transition. The source recurrence and candidate cannot be retrieved through typed references.

**Severity:** High. A concrete transformation weakens origin preservation.

**Architectural Impact:** Scheduled output cannot reliably traverse back through candidate and
recurrence predecessors without parsing IDs and retaining external arrays.

**Recommendation:** Preserve explicit candidate, recurrence, and all other participating Domain
Object references when Placement Service produces the plan object.

#### MA-03 — Manual-event conversion substitutes identity and omits an explicit predecessor link

**Architecture Reference:** Chapter III §3.4; Chapter V §5.9; Chapter VI §6.10.

**Implementation Evidence:**

- `buildManualEventScheduledBlocks` maps each `ManualCalendarEvent` directly to a
  `DraftScheduledBlock` (`code/src/core/engine/generateSchedulePreview.ts:203-255`).
- The output reuses `manualEvent.id` as its own ID but has no `manualEventId` field.
- It hard-codes `userId: "user_001"` rather than retaining an identified originating user object
  (`code/src/core/engine/generateSchedulePreview.ts:238-253`).
- No transformation, service, or engine metadata is added.

**Finding:** Identity equality is used as an undocumented source relationship, and user identity is
introduced by the coordinator rather than preserved from an originating object.

**Severity:** High. Origin cannot be unambiguously distinguished from output identity, and one
origin field is fabricated.

**Architectural Impact:** A manual scheduled block cannot prove which authored event and user
produced it or which capability performed the conversion.

**Recommendation:** Preserve an explicit originating commitment/event reference and user origin,
and record the Derive transformation, producing service, and coordinating engine.

#### MA-04 — Preview aggregation obscures participating inputs and workflow lineage

**Architecture Reference:** Chapter VI §6.10.

**Implementation Evidence:**

- `GenerateSchedulePreviewResult` contains only output collections
  (`code/src/core/engine/generateSchedulePreview.ts:37-43`).
- `generateSchedulePreview` receives authored-like arrays and executes multiple capability
  functions (`code/src/core/engine/generateSchedulePreview.ts:23-35,45-200`).
- Neither result nor `DayFramePreview` records the complete input identities/versions,
  participating services, Planning Engine, or transformations
  (`code/src/state/types.ts:31-41`).
- The store persists authored state but intentionally does not persist preview results
  (`code/src/state/dayFrameStore.ts:398-417`).

**Finding:** Aggregation retains current output values but discards the workflow-level provenance
needed to explain how that set was produced.

**Severity:** Critical. Engine workflow results have an explicit complete-provenance requirement.

**Architectural Impact:** A preview is not independently auditable or reproducible from its own
metadata.

**Recommendation:** Attach an engine-level provenance record identifying all originating Domain
Objects and versions, participating services, coordinating engine, and transformations performed.

#### MA-05 — Preview revision replaces output without predecessor-plan or accepted-proposal lineage

**Architecture Reference:** Chapter III §§3.2 and 3.4; Chapter VI §§6.10 and 6.12.

**Implementation Evidence:**

- `reviseSchedulePreview` accepts a prior preview and selected IDs but returns a preview without a
  predecessor-plan ID or selected proposal ID
  (`code/src/core/engine/reviseSchedulePreview.ts:8-21,23-81`).
- The store retains `generatedAt` and adds `revisedAt`, then replaces current preview state
  (`code/src/state/dayFrameStore.ts:266-300`).
- The accepted selected IDs are not fields of `DayFramePreview`
  (`code/src/state/types.ts:31-41`).
- Revision tests verify preservation of input values, not preservation of architectural lineage
  (`code/src/core/engine/tests/reviseSchedulePreview.test.ts:284`).

**Finding:** The replacement can show when it was revised but cannot identify its predecessor plan,
accepted Recommendation Proposal, revision transformation, producing services, or engine.

**Severity:** Critical. An implemented multi-step workflow transition discards its lineage.

**Architectural Impact:** Revised output cannot be distinguished as new information derived from a
specific prior plan and explicit proposal acceptance.

**Recommendation:** Give plans/proposals stable identities and record predecessor plan, accepted
proposal, transformation, participating services, and coordinating engine on every revised
workflow outcome.

#### MA-06 — Persistence normalization can change authored values without provenance

**Architecture Reference:** Chapter III §3.4; Chapter IV §4.9.

**Implementation Evidence:**

- Persisted authored setup is normalized during initial-state creation
  (`code/src/state/createInitialDayFrameState.ts:26-49,88-106`).
- `normalizePersistedBlockTemplates` can change a matching template from disabled to enabled
  (`code/src/state/createInitialDayFrameState.ts:123-162`).
- Manual-event migration converts legacy date-time fields to User Day/time fields
  (`code/src/state/manualCalendarEvents.ts:19-66`).
- Resulting objects do not record migration source, prior representation, transformation, service,
  engine, or migration version.

**Finding:** Reconstruction/migration can create materially different authored-like objects while
discarding the predecessor and conversion lineage.

**Severity:** High. Provenance is lost at a boundary that can change the information being loaded.

**Architectural Impact:** Downstream results cannot distinguish user-authored values from values
introduced by unrecorded migration.

**Recommendation:** Preserve migration predecessor/version and the responsible architectural
origin for every changed Domain Object; do not silently replace authored meaning without the
required Author provenance.

### Missing

#### MI-01 — Transformation lineage is entirely absent

**Architecture Reference:** Chapter I §1.3; Chapter III §§3.4-3.6; Appendix A.4.

**Implementation Evidence:**

- No output records `Author`, `Derive`, `Record`, or `Analyze`.
- Function names and directories imply operations but are not stored transformation identity.
- No source-to-destination transformation record or transformation history type exists under
  `code/src`.

**Finding:** No produced object identifies which architectural transformation created it.

**Severity:** Critical. Transformation identity is mandatory provenance.

**Architectural Impact:** Category legality, forward flow, and reconstruction cannot be proven from
produced information.

**Recommendation:** Record the legal transformation and source/destination object relationships for
every production event.

#### MI-02 — Producing-service provenance is entirely absent

**Architecture Reference:** Chapter I §1.3; Chapter V §5.9; Appendix A.4.

**Implementation Evidence:**

- No produced type has a producing-service field.
- No canonical Architectural Service identity exists under `code/src`.
- File/module/function location is the only way to infer a producer.

**Finding:** No produced object identifies its producing Architectural Service.

**Severity:** Critical. Producing-service identification is mandatory provenance.

**Architectural Impact:** Responsibility cannot be audited from the output and module refactoring
can erase inferred producer identity.

**Recommendation:** Give every canonical service a stable identity and record that identity on all
objects it produces.

#### MI-03 — Coordinating-engine provenance is entirely absent

**Architecture Reference:** Chapter I §1.3; Chapter VI §6.10; Appendix A.4.

**Implementation Evidence:**

- No produced type has a coordinating-engine field.
- `GenerateSchedulePreviewResult` does not identify a Planning Engine
  (`code/src/core/engine/generateSchedulePreview.ts:37-43`).
- No canonical Architectural Engine identity exists under `code/src`.

**Finding:** No produced object or workflow outcome identifies its coordinating Architectural
Engine.

**Severity:** Critical. Coordinating-engine identification is mandatory provenance.

**Architectural Impact:** The workflow responsible for an outcome cannot be determined from the
outcome.

**Recommendation:** Give each canonical engine a stable identity and record it in every coordinated
workflow result and produced-object provenance chain.

#### MI-04 — Historical and analytical provenance stages are absent

**Architecture Reference:** Chapter III §3.4; Chapter IV §4.9; Chapter V §5.9; Chapter VI §6.10.

**Implementation Evidence:**

- No Accepted Schedule, Execution Event, History Record, Historical Analysis, Trend Analysis, or
  Planning Insight producer exists under `code/src`.
- No Record or Analyze workflow exists.
- Current recommendation functions consume planning-state artifacts, not historical evidence
  (`code/src/core/friction/types.ts:47-69`).

**Finding:** Provenance cannot cross from derived plans into observed reality or from historical
evidence into analytical understanding.

**Severity:** Critical. Entire required provenance transitions are missing.

**Architectural Impact:** End-to-end traceability across a complete planning cycle is impossible.

**Recommendation:** When Record and Analyze are implemented, require each output to identify its
observed/historical predecessors and preserve the full accumulated provenance chain.

## Evidence

### Observed traceability chains

Strongest current shift chain:

```text
ShiftDefinition.id
        ↓ explicit shiftDefinitionId
GeneratedWorkBlock
        ↓ explicit affectedBlockIds when friction exists
FrictionPoint
        ↓ containment and target-like fix ID
SuggestedFix
        ↓ selected ID passed transiently
Revised preview (selected ID no longer retained)
```

Strongest current template chain:

```text
BlockTemplate.id + BlockRecurrence.id
        ↓ explicit templateId + recurrenceId
BlockCandidate
        ↓ candidate ID embedded in scheduled ID; recurrenceId dropped
DraftScheduledBlock
        ↓ explicit affectedBlockIds when friction exists
FrictionPoint
        ↓ nested SuggestedFix
Preview / revised preview (no workflow provenance)
```

Manual-event chain:

```text
ManualCalendarEvent.id
        ↓ same ID reused; no explicit source field
DraftScheduledBlock with hard-coded userId
        ↓ optional affectedBlockIds
FrictionPoint
```

None of these chains records a transformation, producing service, or coordinating engine.

### Completeness matrix by output family

| Output family | Origin | Predecessor | Transformation | Service | Engine | Complete |
|---|---|---|---|---|---|---|
| Authored-like values | Weak | Missing | Missing | Missing | Missing | No |
| Work occurrences | Partial | Partial | Missing | Missing | Missing | No |
| Candidates | Partial | Partial | Missing | Missing | Missing | No |
| Placed blocks | Weak/partial | Encoded only | Missing | Missing | Missing | No |
| Friction | Partial | Partial | Missing | Missing | Missing | No |
| Suggested fixes | Weak/partial | Containment/encoded | Missing | Missing | Missing | No |
| Preview workflow outcome | Weak | Missing | Missing | Missing | Missing | No |
| Revised preview | Weak | Missing | Missing | Missing | Missing | No |
| Historical outputs | Missing | Missing | Missing | Missing | Missing | No |
| Analytical outputs | Missing | Missing | Missing | Missing | Missing | No |

### Provenance survival across implementation boundaries

| Boundary | Survives | Does not survive / never existed |
|---|---|---|
| Core function return | Current object fields and IDs | Complete architectural provenance |
| Store snapshot clone | Current IDs, dates, references, preview timestamps | Service/engine/transformation/predecessor chain |
| Local authored-state persistence | Authored-like values, IDs, timestamps | Preview lineage; authoring action/service/engine |
| Profile save/load | Cloned authored setup and save timestamp | Authored object versions/origin; load transformation |
| Backup export/import | Cloned authored setup and export timestamp | Per-object provenance; import/migration lineage |
| Preview revision | Current result fields and revision timestamp | Prior-plan identity; accepted proposal ID; transformation/service/engine |

### Provenance responsibility leakage

Provenance-like behavior is distributed among:

- individual constructors that embed parent IDs in child IDs;
- type-specific fields such as `templateId` and `affectedBlockIds`;
- the preview coordinator that supplies timestamps;
- the state store that copies current fields;
- persistence/profile/backup code that transports partial IDs; and
- tests that assert selected fields.

No single architectural contract requires producers to supply provenance, while the architecture
assigns preservation to every Pillar, Service, and Engine. The implementation therefore leaves
provenance to ad hoc object construction and storage cloning rather than enforcing it at each
architectural boundary.

### Normative requirement matrix

| Architecture location | Requirement | Implementation status |
|---|---|---|
| Chapter I §1.3 | All Domain Objects identify origin, transformations, service, engine | Violated |
| Chapter I §1.7 invariant 4 | Every significant object/conclusion preserves complete provenance | Violated |
| Chapter III §3.4 | Derived, historical, and analytical objects identify originating information | Partial for some derived objects; historical/analytical missing |
| Chapter III §3.9 invariant 4 | Provenance preserved across every transformation | Violated |
| Chapter IV §4.9 | Every Pillar preserves origin and transformation | Not implemented |
| Chapter IV §4.11 invariant 5 | Every Pillar preserves provenance | Not implemented |
| Chapter V §5.9 | Every Service preserves all four dimensions | Violated/not implemented |
| Chapter V §5.11 invariant 8 | Services preserve provenance | Violated/not implemented |
| Chapter VI §6.10 | Workflow results identify origins, services, engine, transformations | Violated |
| Chapter VI §6.13 invariant 5 | Workflow coordination preserves provenance | Violated |
| Appendix A.4 | No conclusion lacks explainable origin | Violated |
| Appendix A.5 | Recommendations, analyses, and plans trace to authored/history sources | Violated; analyses absent |

## Recommendations

1. Define one canonical provenance contract containing originating Domain Object identities and
   versions, predecessor relationships, transformation history, producing service, coordinating
   engine, and transformation time.
2. Require complete provenance when every Authored, Derived, Historical, or Derived Analytical
   Domain Object is constructed; reject incomplete production at the boundary.
3. Give all canonical Architectural Services and Engines stable identities suitable for provenance
   records.
4. Record Author provenance for every authored-object version, including the explicit user action,
   predecessor version, Authoring Service, and Teach Engine.
5. Preserve explicit source versions on work occurrences and candidates in addition to the current
   source IDs.
6. Preserve candidate, recurrence, capacity, and all other predecessor references through placement
   rather than encoding them only in IDs.
7. Preserve an explicit manual-event/Commitment predecessor and originating user instead of reusing
   output identity and hard-coding user identity.
8. Attach complete workflow provenance to every Generated Plan/preview, including participating
   services, Planning Engine, transformations, and the exact input object versions.
9. Record predecessor plan and accepted Recommendation Proposal on every revised planning outcome.
10. Preserve migration/import/profile lineage whenever persisted authored information is
    reconstructed or changed.
11. Extend clone, validation, persistence, profile, and backup boundaries to transport provenance
    atomically with each Domain Object.
12. Implement historical and analytical provenance from observed event through Record, Historical
    Domain Objects, Analyze, and Derived Analytical Domain Objects.
13. Generate explanations from preserved provenance rather than transient array co-location or
    parsed ID strings.
14. Add tests that fail when any provenance dimension is missing and verify complete backward
    traversal across each transformation and a full planning cycle.

These recommendations preserve the published architecture and are implementation-alignment
statements, not implementation tasks or an implementation plan.

## Open Questions

1. Are current IDs intended as stable cross-version Domain Object identities or only local
   implementation identifiers? No versioning or identity contract is represented.
2. Does reuse of `ManualCalendarEvent.id` as `DraftScheduledBlock.id` intentionally assert identity,
   or is it an implicit source shortcut? No explicit relationship documents the meaning.
3. Are `createdAt`/`updatedAt` fields intended to identify Author transformations, or only storage
   timestamps? No producing action/service/engine accompanies them.
4. Is `generatedAt` intended as workflow provenance or only display metadata? Its type and use do
   not distinguish those roles.
5. Are profiles/backups expected to preserve object-level architectural provenance when canonical
   provenance is added? Current envelopes preserve only data and an envelope timestamp.
6. Is a revised preview intended to be a new Generated Plan with a predecessor, or the same plan
   identity changed over time? No plan identity exists.
7. Is `CalendarHoliday` intended to participate in architectural planning provenance? It is
   currently returned from a static dataset but is not consumed by the audited planning pipeline.

No additional open questions.

## Completion Statement

Every significant produced Domain Object or implementation proxy in `code/src/**` has been
examined exactly once in the Provenance Inventory. Origin preservation, predecessor relationships,
transformation lineage, producing-service identity, coordinating-engine identity, cross-stage
traceability, completeness, consistency, persistence/clone survival, and responsibility leakage
have been evaluated.

Author-like, Derive, revision, Record, and Analyze provenance transitions have each been assessed.
Every finding includes an architecture reference, executable implementation evidence, severity,
architectural impact, and an alignment-preserving recommendation. The audit contains no additional
findings beyond those reported above.
