# DayFrame Implementation Alignment Audit 03

## Architectural Services Compliance

**Normative source:** `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`, Chapter V  
**Audit standard:** `Implementation_Alignment_Standard.md`, Version 1.0.0  
**Implementation scope:** `code/src/core/**` and `code/src/state/**`  
**Audit date:** 2026-07-26

## Executive Summary

**Overall rating: Significantly Misaligned**

The implementation contains narrow, deterministic functions that perform parts of several
Architectural Service responsibilities, especially commitment expansion, candidate generation,
placement, friction detection, and recommendation generation. These functions are independently
tested and generally remain free of presentation and persistence concerns.

The implementation does not, however, explicitly represent any of the 17 Architectural Services
defined by the normative specification. Ten services have partial functional proxies and seven are
missing. Authoring responsibilities are combined in generic state setters and generic block
models. Goal Occurrence and Capacity responsibilities are absent. Placement produces only partial
plan components. Recording and Analysis Services are entirely absent.

Service contracts do not identify their Architectural Pillar, transformation, output Domain Object
Category, producing service, or coordinating engine. Services therefore cannot preserve the
required architectural provenance. The preview coordinator also performs domain work—manual-event
conversion, visibility filtering, and result assembly—alongside orchestration. Suggested-fix
application combines proposal acceptance, plan mutation logic, and friction-state changes without
a canonical Architectural Service owner.

The current implementation is best understood as a precursor containing several service-level
capabilities, not as an aligned realization of the published Architectural Service layer.

## Alignment Score

**Estimated compliance: 34%**

| Area | Weight | Assessment | Weighted result |
|---|---:|---:|---:|
| Service existence and inventory | 25% | 35% | 8.8% |
| Responsibility ownership | 20% | 30% | 6.0% |
| Inputs and outputs | 15% | 35% | 5.3% |
| Service boundaries | 15% | 35% | 5.3% |
| Service composition and independence | 10% | 45% | 4.5% |
| Determinism | 10% | 80% | 8.0% |
| Provenance | 5% | 10% | 0.5% |
| **Total** | **100%** |  | **34.3%** |

The reported score is rounded to 34%. Functional similarity receives partial credit, but no proxy
is explicitly declared or constrained as an Architectural Service. Generic utilities, state
actions, orchestration, and future intent receive no full-service credit.

## Architectural Assumptions

- The published architecture is authoritative.
- Canonical terminology is defined by the published glossary.
- Missing implementation does not imply architectural error.
- Existing implementation may predate the published architecture.
- Findings are implementation-alignment findings only.

The supplied brief identifies “Chapter IV — Architectural Services.” In the normative v1.0.0
specification, Chapter IV defines Architectural Pillars and **Chapter V defines Architectural
Services**. This audit uses Chapter V §§5.1-5.11. That scope correction follows the requested
Architectural Services concern without reinterpreting the architecture.

## Audit Scope

This audit evaluates:

- all 17 services defined by Chapter V;
- their conceptual responsibilities, Pillar ownership, inputs, outputs, and determinism;
- responsibility uniqueness, service boundaries, provenance, independence, and composition;
- executable responsibility leakage within `code/src/core/**` and `code/src/state/**`; and
- all ten Chapter V invariants.

Domain Object and Information Flow findings are not repeated except where required to establish a
service input, output, ownership, or category boundary. UI, persistence technology, performance,
and code quality are outside scope. Presentation code was not included in the stated implementation
scope; no conclusion is made about responsibility leakage inside `code/src/ui/**`.

## Service Inventory

Every Architectural Service defined by Chapter V appears exactly once below.

| Architectural Service | Implementation | Status | Notes |
|---|---|---|---|
| Commitment Authoring Service | `setShiftDefinitions`, `setShiftCycles`, `setManualEvents` in `code/src/state/dayFrameStore.ts:81-143` | Partially Implemented | Maintains commitment-like inputs, but no Commitment output or single service boundary exists. |
| Goal Authoring Service | `setBlockTemplates`, `setBlockRecurrences` in `code/src/state/dayFrameStore.ts:109-131` | Partially Implemented | Generic templates/recurrences conflate goals with patterns, preferences, and constraints. |
| Pattern Authoring Service | Shift-cycle and block-recurrence setters; `saveProfile`/`loadProfile` (`dayFrameStore.ts:93-191`) | Partially Implemented | Reusable structures exist, but neither Pattern nor Routine is produced. Profiles are full setup snapshots, not canonical Routines. |
| Preference Authoring Service | `setSchedulingPreferences`; preference fields inside `BlockTemplate` (`dayFrameStore.ts:50-65`; `code/src/core/blocks/types.ts:58-79`) | Partially Implemented | Maintains some preferences but has no Preference output or isolated responsibility. |
| Constraint Authoring Service | Fixed placement/time and validation embedded in block setters/types (`code/src/core/blocks/types.ts:58-79`; `validateBlockTemplate.ts`) | Partially Implemented | Mandatory conditions exist as fields/rules, not Constraints produced by a service. |
| Capacity Service | No implementation mapping found | Missing | Placement computes around occupied time without producing a Capacity Model. |
| Commitment Occurrence Service | `generateWorkBlocks`, `generateCycleWorkBlocks` (`code/src/core/shifts/generateWorkBlocks.ts`; `code/src/core/cycles/generateCycleWorkBlocks.ts`) | Partially Implemented | Expands shift-like authored inputs into work-block instances, but manual commitments use a separate coordinator path and no Commitment Occurrence is produced. |
| Goal Occurrence Service | No distinct implementation mapping found | Missing | Templates/recurrences are expanded directly into `BlockCandidate`. |
| Planning Candidate Service | `generateBlockCandidates` (`code/src/core/blocks/generateBlockCandidates.ts`) | Partially Implemented | Deterministically produces candidate-like values, but also performs occurrence expansion and emits `BlockCandidate`, not Planning Candidate. |
| Placement Service | `placeBlockCandidates` (`code/src/core/blocks/placeBlockCandidates.ts`) | Partially Implemented | Performs deterministic placement but returns scheduled/unplaced arrays, not a complete Generated Plan. |
| Friction Analysis Service | `detectScheduleFriction` (`code/src/core/friction/detectScheduleFriction.ts`) | Partially Implemented | Detects conflicts and inefficiencies but emits `FrictionPoint[]`, not a Friction Report with service provenance. |
| Recommendation Proposal Service | `generateSuggestedFixes` (`code/src/core/friction/generateSuggestedFixes.ts`) | Partially Implemented | Generates advisory alternatives but mutates the shape of friction points and emits nested `SuggestedFix` values rather than Recommendation Proposals. |
| Execution Recording Service | No implementation mapping found | Missing | No observed-execution capture path or Execution Event output exists. |
| History Recording Service | No implementation mapping found | Missing | No historical evidence preservation path or History Record output exists. |
| Historical Analysis Service | No implementation mapping found | Missing | No completed-execution analysis exists. |
| Trend Analysis Service | No implementation mapping found | Missing | No multi-analysis trend derivation exists. |
| Insight Generation Service | No implementation mapping found | Missing | No Planning Insight producer exists. |

## Responsibility Matrix

| Responsibility | Architectural Owner | Implementation | Status |
|---|---|---|---|
| Create and maintain user commitments | Commitment Authoring Service | Multiple shift/cycle/manual-event setters | Partial; distributed and noncanonical |
| Create and maintain user goals | Goal Authoring Service | Generic block-template and recurrence setters | Partial; conflated |
| Manage reusable planning structures | Pattern Authoring Service | Cycle, recurrence, template, and profile paths | Partial; duplicated with Goal/Commitment proxies |
| Maintain planning preferences | Preference Authoring Service | Scheduling setter plus embedded template fields | Partial; distributed |
| Maintain mandatory planning constraints | Constraint Authoring Service | Embedded validation and placement fields | Partial; no service owner |
| Determine available planning capacity | Capacity Service | Gap/occupancy logic inside `placeBlockCandidates` | Misplaced; no Capacity Model |
| Expand authored commitments into occurrences | Commitment Occurrence Service | `generateWorkBlocks`, `generateCycleWorkBlocks`, and coordinator manual-event conversion | Partial; duplicated paths |
| Expand authored goals into planning opportunities | Goal Occurrence Service | Folded into `generateBlockCandidates` | Missing owner / conflated |
| Generate candidate placements | Planning Candidate Service | `generateBlockCandidates` | Partial |
| Produce deterministic schedules | Placement Service | `placeBlockCandidates`, plus coordinator assembly/filtering | Partial; split ownership |
| Identify conflicts, overload, and inefficiencies | Friction Analysis Service | `detectScheduleFriction` | Partial |
| Generate advisory planning alternatives from authored intent | Recommendation Proposal Service | `generateSuggestedFixes` | Partial; consumes current derived context rather than an explicit authored-intent contract |
| Capture observed execution | Execution Recording Service | No implementation | Missing |
| Preserve historical planning evidence | History Recording Service | No implementation | Missing |
| Analyze completed execution | Historical Analysis Service | No implementation | Missing |
| Identify long-term behavioral patterns | Trend Analysis Service | No implementation | Missing |
| Derive explainable Planning Insights from history | Insight Generation Service | No implementation | Missing |

Responsibility ownership is not one-to-one in the implementation. Generic authored block types and
setters span multiple authoring services; candidate generation absorbs Goal Occurrence work;
placement absorbs implicit Capacity work; and full-plan production is split between placement and
the preview coordinator.

## Findings

### Fully Aligned

#### FA-01 — Core derivation proxies are deterministic and independent of persistence/presentation

**Architecture Reference:** Chapter V §§5.2, 5.5, 5.8; §5.11 invariants 6, 7, and 9.

**Implementation Evidence:**

- `generateWorkBlocks`, `generateBlockCandidates`, `placeBlockCandidates`,
  `detectScheduleFriction`, and `generateSuggestedFixes` accept explicit arguments and return
  values.
- Repository search found no storage, network, random-number, or implicit-current-time access in
  those functions.
- State persistence is implemented separately in `code/src/state/dayFrameStore.ts:378-523`.
- Exact-output tests cover work-block generation, candidate generation, placement, friction, and
  suggested fixes under their respective core test directories.

**Finding:** The primary core capability functions do not own persistence or presentation and are
deterministic for their complete inputs.

**Severity:** Informational. This satisfies important service invariants for the implemented proxy
capabilities.

**Architectural Impact:** These functions can support aligned service implementations without
moving persistence or presentation into the service layer.

**Recommendation:** Preserve explicit dependencies, deterministic behavior, and the current
separation from persistence/presentation when canonical service contracts are introduced.

#### FA-02 — Several service-like capabilities are independently callable and tested

**Architecture Reference:** Chapter V §§5.1, 5.2, and 5.10.

**Implementation Evidence:**

- `generateBlockCandidates` is exported independently
  (`code/src/core/blocks/generateBlockCandidates.ts:14-55`).
- `placeBlockCandidates` is exported independently
  (`code/src/core/blocks/placeBlockCandidates.ts:11-63`).
- `detectScheduleFriction` and `generateSuggestedFixes` are separate exports
  (`code/src/core/friction/detectScheduleFriction.ts:33-50`;
  `code/src/core/friction/generateSuggestedFixes.ts:34-74`).
- Each has focused unit tests rather than being testable only through the preview coordinator.

**Finding:** Candidate generation, placement, friction detection, and suggestion generation exist
as separable building blocks and can participate in composition.

**Severity:** Informational. Independent invocation is aligned with the service-building-block
principle.

**Architectural Impact:** Workflow evolution does not necessarily require embedding all business
logic in one coordinator.

**Recommendation:** Retain their independent contracts while aligning their canonical inputs,
outputs, ownership, and provenance.

### Partially Aligned

#### PA-01 — Authoring responsibilities exist but are conflated in state management

**Architecture Reference:** Chapter V §5.4; §5.8; §5.11 invariants 1-3.

**Implementation Evidence:**

- `DayFrameStore` exposes independent setters for preferences, shifts, cycles, templates,
  recurrences, and manual events (`code/src/state/types.ts:90-110`).
- The setters clone, persist, and mark the preview stale
  (`code/src/state/dayFrameStore.ts:50-143`).
- `BlockTemplate` combines category, fixed/flexible placement, duration, priority, preferred
  window, rescheduling behavior, and resource requirements
  (`code/src/core/blocks/types.ts:58-79`).
- No setter returns Commitment, Goal, Pattern, Routine, Preference, or Constraint.

**Finding:** The implementation can maintain user-entered planning data, but generic state actions
and models perform portions of five distinct Authoring Service responsibilities. Persistence and
notification are also combined with the authoring action.

**Severity:** High. The exclusive canonical owners of authored responsibilities cannot be
identified or enforced.

**Architectural Impact:** A change to one generic block can simultaneously express goal,
preference, constraint, and pattern semantics, preventing exactly-one-service responsibility and
one-category output.

**Recommendation:** Route each authored responsibility through its designated Chapter V Authoring
Service and make each service produce only its specified Authored Domain Object types. Keep state
persistence/notification outside those service responsibilities.

#### PA-02 — Commitment expansion is implemented only for shift-specific inputs

**Architecture Reference:** Chapter V §5.5, Commitment Occurrence Service.

**Implementation Evidence:**

- `generateWorkBlocks` expands `ShiftDefinition` workdays into dated `GeneratedWorkBlock` values
  (`code/src/core/shifts/generateWorkBlocks.ts:10-35,37-86`).
- `generateCycleWorkBlocks` expands manual cycle segments and repeating sequences
  (`code/src/core/cycles/generateCycleWorkBlocks.ts:20-68`).
- Produced cycle blocks retain shift-definition, cycle, and segment IDs
  (`code/src/core/shifts/types.ts:19-31`; `code/src/core/cycles/types.ts:60-63`).
- Manual calendar events are converted separately inside the preview coordinator
  (`code/src/core/engine/generateSchedulePreview.ts:203-255`).

**Finding:** A deterministic occurrence-expansion capability exists for shifts, but it does not
accept canonical Commitments or produce Commitment Occurrences. A second expansion path in the
coordinator handles manual commitment-like information.

**Severity:** High. The responsibility is split and limited to implementation-specific source
types.

**Architectural Impact:** Not all commitments use one service owner, and consumers cannot depend on
one Commitment Occurrence contract.

**Recommendation:** Consolidate all authored Commitment expansion under the Commitment Occurrence
Service, with canonical Commitment inputs and Commitment Occurrence outputs.

#### PA-03 — Planning candidate generation absorbs Goal Occurrence responsibility

**Architecture Reference:** Chapter V §5.5, Goal Occurrence Service and Planning Candidate Service;
§5.8.

**Implementation Evidence:**

- `generateBlockCandidates` accepts templates and recurrences directly
  (`code/src/core/blocks/types.ts:129-139`).
- It expands daily, weekly, weekday, and times-per-week recurrence rules
  (`code/src/core/blocks/generateBlockCandidates.ts:65-220`).
- It directly constructs `BlockCandidate` with source template and recurrence IDs
  (`code/src/core/blocks/generateBlockCandidates.ts:223-276`).
- No Goal Occurrence intermediate input/output exists.

**Finding:** One function both expands authored recurrence into dated opportunities and generates
candidate-like planning values. These are separately assigned to Goal Occurrence Service and
Planning Candidate Service by the architecture.

**Severity:** High. Two canonical service responsibilities are combined and one required output is
skipped.

**Architectural Impact:** Goal expansion cannot be reused independently, and candidate generation
does not communicate exclusively through the required Domain Object boundary.

**Recommendation:** Make Goal Occurrence Service produce Goal Occurrences first, then make Planning
Candidate Service consume the relevant Domain Objects and produce Planning Candidates.

#### PA-04 — Placement performs deterministic scheduling but does not produce a Generated Plan

**Architecture Reference:** Chapter V §5.5, Placement Service.

**Implementation Evidence:**

- `placeBlockCandidates` sorts candidates, selects placements, and returns scheduled and unplaced
  arrays (`code/src/core/blocks/placeBlockCandidates.ts:11-63`).
- Its input includes raw generated work blocks, planning dates, day-boundary values, and an
  optional preference resolver callback (`code/src/core/blocks/types.ts:173-187`).
- The complete preview result is assembled later by `generateSchedulePreview`
  (`code/src/core/engine/generateSchedulePreview.ts:135-200`).

**Finding:** Placement logic is present and deterministic, but its output is
`PlaceBlockCandidatesResult`, not the specified Generated Plan. It also consumes raw occupancy
inputs instead of an explicit Capacity Model.

**Severity:** High. The service's required output and upstream service boundary are absent.

**Architectural Impact:** Complete plan production is split between a service-like function and a
coordinator, and Capacity/Placement composition cannot be verified.

**Recommendation:** Make the Placement Service consume the canonical planning Domain Objects and
produce the complete Generated Plan, leaving the coordinating engine responsible only for
sequencing.

#### PA-05 — Friction detection is narrow, but no Friction Report is produced

**Architecture Reference:** Chapter V §5.5, Friction Analysis Service; §§5.8-5.9.

**Implementation Evidence:**

- `detectScheduleFriction` accepts generated work blocks, scheduled blocks, unplaced candidates,
  and an explicit detection time (`code/src/core/friction/types.ts:47-56`).
- It detects overlaps and unplaced candidates and returns `FrictionPoint[]`
  (`code/src/core/friction/detectScheduleFriction.ts:33-50`).
- `FrictionPoint` contains affected IDs and messages but no producing-service or coordinating-engine
  provenance (`code/src/core/friction/types.ts:29-45`).

**Finding:** Conflict and inefficiency identification is independently implemented, but the
specified Friction Report is not. Overload is not represented as a distinct assessed capability,
and provenance is incomplete.

**Severity:** Medium. The core conceptual work is present but the output and traceability contract
are incomplete.

**Architectural Impact:** Consumers receive individual mutable-looking points rather than one
canonical report tied to its plan and producer.

**Recommendation:** Have Friction Analysis Service produce a Friction Report containing its
findings and required architectural provenance.

#### PA-06 — Recommendation generation is separate but its contract is coupled to friction storage

**Architecture Reference:** Chapter V §5.5, Recommendation Proposal Service; §§5.8-5.9.

**Implementation Evidence:**

- `generateSuggestedFixes` builds context maps and computes alternatives independently
  (`code/src/core/friction/generateSuggestedFixes.ts:34-74`).
- It accepts and returns `FrictionPoint[]`, replacing each point's nested `suggestedFixes`
  (`code/src/core/friction/types.ts:58-69`).
- Suggested fixes are not independent Recommendation Proposal objects and contain no producing
  service, coordinating engine, or originating authored-intent references
  (`code/src/core/friction/types.ts:7-22`).

**Finding:** Advisory-alternative generation exists, but it is structurally an enrichment of a
friction result rather than a service that produces Recommendation Proposals from its specified
architectural inputs.

**Severity:** High. The required output type, provenance, and input responsibility are not aligned.

**Architectural Impact:** Friction Analysis and Recommendation Proposal responsibilities are
coupled through one mutable-shaped object contract.

**Recommendation:** Make Recommendation Proposal Service independently produce Recommendation
Proposals with references to their authored origin and relevant Friction Report/plan context,
without changing the Friction Report's identity.

#### PA-07 — Preview orchestration sequences capabilities correctly but is not logic-free

**Architecture Reference:** Chapter V §§5.8 and 5.10; §5.11 invariant 5.

**Implementation Evidence:**

- `generateSchedulePreview` calls occurrence generation, candidate generation, placement, friction
  detection, and recommendation generation in sequence
  (`code/src/core/engine/generateSchedulePreview.ts:63-134`).
- It also expands the planning window, determines visible User Days, converts manual events into
  scheduled blocks, filters every output collection, and decides which friction points are visible
  (`code/src/core/engine/generateSchedulePreview.ts:51-61,135-200,203-255,350-449`).
- The full pipeline has integration tests in
  `code/src/core/engine/tests/generateSchedulePreview.test.ts`.

**Finding:** The coordinator demonstrates useful service composition and dependency direction, but
also owns transformation and result-selection rules that belong to Architectural Services.

**Severity:** High. Engine-like orchestration replaces or supplements service responsibilities.

**Architectural Impact:** Services are not independently responsible for complete canonical
outputs, and workflow changes can alter business results inside the coordinator.

**Recommendation:** Keep sequencing in the coordinating engine and move all Domain Object
production, conversion, and business filtering into the single responsible Architectural
Services.

### Misaligned

#### MA-01 — Architectural Service identity, Pillar ownership, and category output are absent

**Architecture Reference:** Chapter V §§5.2-5.7; §5.11 invariants 1-3 and 10.

**Implementation Evidence:**

- No `ArchitecturalService`, service category, service identifier, Pillar-owner field, or
  category-constrained service-result contract exists under `code/src`.
- Implementation modules are organized by time, shifts, cycles, blocks, friction, engine, and
  state rather than by the 17 canonical services.
- State actions and functions return implementation-specific structures rather than the Named
  Domain Objects listed in Chapter V.

**Finding:** No implementation component can be identified as an Architectural Service by contract.
Functional proxies do not declare one capability, one Pillar, one transformation class, or one
primary output category.

**Severity:** Critical. The governing service invariants cannot be enforced, and the canonical
conceptual capability layer is absent.

**Architectural Impact:** Responsibility allocation is inferred from code location and behavior
rather than guaranteed by architecture; every service remains replaceable by ambiguous utility
logic.

**Recommendation:** Implement each Chapter V service as an explicit conceptual contract declaring
its single responsibility, Pillar ownership, accepted Domain Object inputs, and category-limited
Named Domain Object outputs.

#### MA-02 — No produced value preserves required service and engine provenance

**Architecture Reference:** Chapter V §5.9; §5.11 invariant 8.

**Implementation Evidence:**

- Work blocks retain shift source IDs (`code/src/core/shifts/types.ts:19-31`).
- Candidates retain template/recurrence IDs (`code/src/core/blocks/types.ts:104-127`).
- Friction points retain affected block IDs (`code/src/core/friction/types.ts:29-45`).
- None of those outputs identifies the transformation performed, producing Architectural Service,
  or coordinating Architectural Engine.
- `GenerateSchedulePreviewResult` has no provenance envelope
  (`code/src/core/engine/generateSchedulePreview.ts:37-43`).

**Finding:** Local source identifiers provide partial traceability, but every service proxy omits
mandatory architectural provenance.

**Severity:** Critical. Chapter V requires every produced Domain Object to identify all four
provenance dimensions.

**Architectural Impact:** Conceptual origin cannot be reconstructed from output values, preventing
service-level explanation, auditing, and responsibility verification.

**Recommendation:** Require every Architectural Service output to preserve originating
information, transformation, producing service, and coordinating engine.

#### MA-03 — Suggested-fix application combines responsibilities without a canonical service owner

**Architecture Reference:** Chapter V §§5.2, 5.4, 5.5, and 5.8; §5.11 invariant 1.

**Implementation Evidence:**

- `applySuggestedFix` validates proposal selection and can ignore a conflict, skip a block, reduce
  duration, convert category/title, change priority, or move a block
  (`code/src/core/friction/applySuggestedFix.ts:15-137` and action helpers).
- `reviseSchedulePreview` then reruns friction detection and recommendation generation
  (`code/src/core/engine/reviseSchedulePreview.ts:23-81`).
- The store coordinates selection and replaces preview state
  (`code/src/state/dayFrameStore.ts:266-300`).
- Chapter V defines Recommendation Proposal generation but no service whose responsibility is to
  mutate a derived preview directly.

**Finding:** Proposal validation, user-response interpretation, placement adjustment, draft
attribute changes, and friction resolution are combined across a friction utility, coordinator,
and state store. The work is not allocated to exactly one defined Architectural Service.

**Severity:** High. Implemented business responsibility bypasses the published service ownership
model.

**Architectural Impact:** Multiple conceptual capabilities change plan output through a path that
cannot be assigned to one service and does not communicate through canonical Domain Objects.

**Recommendation:** Route accepted recommendations through the existing canonical service
responsibilities and transformations defined by the specification; do not retain an unowned
multi-responsibility preview-mutation service.

### Missing

#### MI-01 — Capacity Service and Goal Occurrence Service are absent

**Architecture Reference:** Chapter V §5.5, Capacity Service and Goal Occurrence Service.

**Implementation Evidence:**

- No Capacity Model type or producer was found.
- `placeBlockCandidates` calculates placement around raw work blocks and already placed blocks
  (`code/src/core/blocks/placeBlockCandidates.ts:11-108`).
- `generateBlockCandidates` expands templates/recurrences directly into candidates
  (`code/src/core/blocks/generateBlockCandidates.ts:14-55,65-276`).
- No Goal Occurrence type or producer was found.

**Finding:** Capacity determination is embedded in placement, and goal occurrence expansion is
embedded in candidate generation. Neither required service exists independently.

**Severity:** Critical. Two required derivation capabilities and their Domain Object communication
boundaries are absent.

**Architectural Impact:** Placement cannot consume a Capacity Model, Planning Candidate Service
cannot consume Goal Occurrences, and service composition skips defined stages.

**Recommendation:** Implement Capacity Service and Goal Occurrence Service with exactly the
responsibilities, inputs, and outputs specified in Chapter V.

#### MI-02 — Recording Services are absent

**Architecture Reference:** Chapter V §5.6.

**Implementation Evidence:**

- No Execution Recording Service, History Recording Service, Execution Event producer, or History
  Record producer was found under `code/src`.
- `DraftScheduledBlock` permits execution-like status values, but no recording function produces
  immutable observed information (`code/src/core/blocks/types.ts:143-170`).
- State persistence stores authored setup rather than historical evidence
  (`code/src/state/dayFrameStore.ts:398-417`).

**Finding:** Neither Recording Service exists. Execution-like enum values do not implement the
specified capture or preservation responsibilities.

**Severity:** Critical. The Live Pillar has no Architectural Service implementation.

**Architectural Impact:** Observed execution cannot enter the architecture as Execution Events or
be preserved as History Records.

**Recommendation:** Implement Execution Recording Service and History Recording Service as separate
single-responsibility producers of their specified Historical Domain Objects.

#### MI-03 — Analysis Services are absent

**Architecture Reference:** Chapter V §5.7.

**Implementation Evidence:**

- No Historical Analysis, Trend Analysis, Planning Insight, or corresponding producer was found
  under `code/src`.
- Friction and suggestion functions consume current planning values, not completed execution or
  Historical Domain Objects (`code/src/core/friction/types.ts:47-69`).

**Finding:** Historical Analysis Service, Trend Analysis Service, and Insight Generation Service
are all absent.

**Severity:** Critical. The Learn Pillar has no Architectural Service implementation.

**Architectural Impact:** The implementation cannot analyze execution, identify long-term
behavioral patterns, or produce explainable Planning Insights.

**Recommendation:** Implement the three Analysis Services separately, using Historical Domain
Objects as specified and producing only their assigned Derived Analytical Domain Objects.

## Evidence

### Current composition path

```text
DayFrameStore.generatePreview
        ↓
generateSchedulePreview                         coordinator plus domain logic
        ├── generateCycleWorkBlocks             partial Commitment Occurrence capability
        │     └── generateWorkBlocks
        ├── generateBlockCandidates             Goal Occurrence + candidate generation conflated
        ├── placeBlockCandidates                Capacity + placement partially conflated
        ├── buildManualEventScheduledBlocks     occurrence/placement logic in coordinator
        ├── detectScheduleFriction               partial Friction Analysis capability
        ├── generateSuggestedFixes               partial Recommendation Proposal capability
        └── filtering/result assembly           plan-production logic in coordinator
```

The optional revision path is:

```text
DayFrameStore.applySuggestedFixToPreview
        ↓
reviseSchedulePreview
        ├── applySuggestedFix                    multi-responsibility plan adjustment
        ├── detectScheduleFriction
        └── generateSuggestedFixes
```

### Input/output assessment

| Proxy capability | Inputs | Output | Primary variance from Chapter V |
|---|---|---|---|
| Shift expansion | Shift definitions/cycles, raw dates/preferences | Generated work blocks | Not canonical Commitments/Commitment Occurrences |
| Candidate generation | Templates, recurrences, dates, cycles/preferences | Block candidates | Skips Goal Occurrence Service and accepts callback/environment-shaped planning inputs |
| Placement | Candidates, work blocks, dates, boundary, optional resolver callback | Scheduled and unplaced arrays | No Capacity Model input; no Generated Plan output |
| Friction detection | Work blocks, scheduled blocks, candidates, timestamp | Friction points | No Friction Report or service/engine provenance |
| Suggestion generation | Friction points plus all current plan collections and resolver | Friction points with nested fixes | Does not independently output Recommendation Proposals |
| State authoring | Partial/generic authored values | Entire `DayFrameState` snapshot | Adds persistence, stale-preview marking, and notification; no canonical authored output |

The optional resolver callbacks accepted by placement and recommendation generation are explicit,
not hidden dependencies. They nonetheless permit behavior to be supplied from outside the Domain
Object contract, contrary to the rule that services communicate exclusively through Domain
Objects.

### Responsibility duplication and leakage

| Responsibility | Locations | Assessment |
|---|---|---|
| Reusable recurrence expansion | `generateCycleWorkBlocks`, `generateBlockCandidates` | Different source concepts, but canonical Pattern/Occurrence ownership is not expressed |
| Capacity determination | Gap search inside `placeBlockCandidates`; move-gap search inside `applySuggestedFix` | Duplicated capacity-like logic outside Capacity Service |
| Plan production | `placeBlockCandidates`, manual-event conversion and result assembly in `generateSchedulePreview`, revision in `applySuggestedFix` | Split across service proxy, coordinator, and adjustment utility |
| Friction proposal storage | `detectScheduleFriction` seeds fixes; `generateSuggestedFixes` replaces fixes; `reviseSchedulePreview` merges resolved state | Friction Analysis, Recommendation Proposal, and response-state responsibilities coupled |
| Authoring | Store setters, profile load, backup import, initialization normalization | No exclusive Authoring Service ownership |

### Determinism assessment

| Service proxy | Hidden clock/randomness | Persistence/network | Ordering | Assessment |
|---|---|---|---|---|
| Work/occurrence generation | None found | None | Explicit date iteration and sort | Deterministic for complete inputs |
| Candidate generation | None found | None | Final explicit sort | Deterministic for complete inputs |
| Placement | None found | None | Candidate/output sorts | Deterministic for complete inputs |
| Friction detection | Timestamp is explicit | None | Explicit sort | Deterministic for complete inputs |
| Suggestion generation | None found | None | Explicit tie-break sorts/deduplication | Deterministic for complete inputs |
| Authoring state actions | IDs/timestamps sometimes caller supplied; profile ID helper is deterministic | Owns local persistence through store | State-dependent | Not an aligned service boundary |

Native local `Date` construction makes the execution environment's time zone an implicit
dependency for absolute instants. This is a reproducibility limitation across different
environments, even though results are stable within one unchanged environment.

### Architectural invariant matrix

| # | Invariant | Status | Evidence/finding |
|---:|---|---|---|
| 1 | Every service performs exactly one conceptual capability. | Violated | PA-01, PA-03, PA-07, MA-03 |
| 2 | Every service belongs to exactly one Pillar. | Not implemented | MA-01 |
| 3 | Every service produces objects within one primary category. | Not implemented | MA-01 |
| 4 | Services communicate exclusively through Domain Objects. | Violated | Generic implementation types and resolver callbacks; PA-02–PA-06 |
| 5 | Services never coordinate workflows. | Partial violation | Service proxies are narrow, but coordinator owns business work; PA-07 |
| 6 | Services never own persistence. | Partial | Core proxies do not; authoring proxies are state-store methods that persist; PA-01 |
| 7 | Services never own presentation. | Aligned in audited scope | FA-01 |
| 8 | Services preserve provenance. | Violated | MA-02 |
| 9 | Services remain deterministic unless designated otherwise. | Mostly aligned | FA-01; environment time-zone limitation |
| 10 | Services collectively define DayFrame capabilities. | Violated/incomplete | Seven missing services; MA-01, MI-01–MI-03 |

## Recommendations

1. Represent all 17 Chapter V services explicitly and assign each to its specified service category
   and Architectural Pillar.
2. Define each service contract with only the canonical Domain Object inputs necessary for its
   responsibility and only its specified Named Domain Object outputs.
3. Separate the five Authoring Service responsibilities currently combined in generic state types
   and setters; keep persistence and state notification outside the services.
4. Consolidate all Commitment expansion, including manual commitments, under Commitment Occurrence
   Service.
5. Implement Goal Occurrence Service as a distinct stage before Planning Candidate Service.
6. Implement Capacity Service and make Placement Service consume its Capacity Model rather than
   independently deriving availability.
7. Make Placement Service produce the complete Generated Plan; remove Domain Object production and
   business filtering from engine orchestration.
8. Make Friction Analysis Service produce a Friction Report and Recommendation Proposal Service
   produce independent Recommendation Proposals without rewriting the report object.
9. Remove unowned multi-responsibility suggested-fix application behavior by routing accepted
   proposals through the canonical Authoring and Derivation Services.
10. Implement the two Recording Services and three Analysis Services with their exact published
    responsibilities.
11. Preserve originating information, transformation, producing service, and coordinating engine
    on every produced Domain Object.
12. Replace behavior callbacks and generic state envelopes at service boundaries with the required
    Domain Object communication contracts.
13. Add service-contract tests for single responsibility, correct Pillar/category ownership,
    allowed input/output types, provenance, orchestration independence, and determinism.

These recommendations are implementation-alignment statements, not implementation tasks or an
implementation plan.

## Open Questions

1. Are `ShiftDefinition`, `ShiftCycle`, and `ManualCalendarEvent` intended as inputs to Commitment
   Authoring Service, Pattern Authoring Service, or both? No canonical service mapping is expressed.
2. Is `BlockTemplate` intended to be authored by Goal, Pattern, Preference, or Constraint Authoring
   Service? Its fields currently combine all four responsibilities.
3. Is `DayFrameSavedProfile` intended to implement a Routine, or is it only a persistence snapshot?
   Its current whole-setup shape supports only the latter conclusion.
4. Is `generateSchedulePreview` intended to be the coordinating Planning Engine? Its location and
   sequencing suggest that role, but it is not identified as an Architectural Engine and it
   performs service work.
5. Which canonical service is intended to own behavior after a user selects a suggested fix?
   Current behavior spans proposal interpretation, placement, plan revision, and friction state.
6. Are resolver callbacks at placement/recommendation boundaries temporary adapters, or intended
   service inputs? They are not Domain Objects.

No additional open questions.

## Completion Statement

All 17 Architectural Services have been evaluated exactly once in the Service Inventory. Every
published service responsibility has been assigned in the Responsibility Matrix. Inputs, outputs,
Pillar/category ownership, service independence, composition, determinism, provenance,
responsibility leakage, and all ten Chapter V invariants have been assessed against executable
evidence.

Every finding includes an architecture reference, implementation evidence, severity,
architectural impact, and an alignment-preserving recommendation. The audit contains no additional
findings beyond those reported above.
