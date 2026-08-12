# DayFrame Implementation Alignment Audit 06

## Architectural Pillars Compliance

**Normative source:** `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`, Chapter IV  
**Audit standard:** `Implementation_Alignment_Standard.md`, Version 1.0.0  
**Implementation scope:** `code/src/**`  
**Audit date:** 2026-07-26

## Executive Summary

**Overall rating: Significantly Misaligned**

The implementation does not explicitly represent any of the four Architectural Pillars. It contains
partial behavioral proxies for Teach and Plan, while Live and Learn are absent.

Teach-like responsibilities are distributed through state setters, initialization normalization,
profile operations, and backup import. These paths maintain user-entered planning information, but
they do not declare Teach ownership or invoke the canonical Authoring Services. They also combine
authoring-like behavior with state mutation, persistence, migration, and notification.

Plan is the strongest partial pillar. Core functions deterministically generate work occurrences
and candidates, place blocks, detect friction, generate suggested fixes, and assemble a schedule
preview. The core planning coordinator generally does not mutate authored inputs or access
persistence. However, it does not produce all required Plan objects, does not declare Derive or
Plan ownership, communicates through implementation DTOs, performs service work inside
orchestration, and preserves only fragmentary provenance.

No executable path accepts a plan into an Accepted Schedule, records observed execution, preserves
History Records, analyzes history, or produces analytical insight. Therefore the legal
Teach → Plan → Live → Learn → Teach lifecycle is not implemented. The selected-fix revision path
also bypasses the required future Teach transformation: it directly revises a derived preview
without creating new authored intent.

No significant implementation capability has explicit exactly-one-Pillar ownership. Some
capabilities can be assigned with high behavioral confidence, but state management, profile/import
normalization, suggested-fix application, and preview orchestration mix conceptual responsibilities
or implementation support concerns.

## Alignment Score

**Estimated compliance: 25%**

| Area | Weight | Assessment | Weighted result |
|---|---:|---:|---:|
| Four-Pillar existence and identity | 15% | 20% | 3.0% |
| Responsibility ownership | 20% | 25% | 5.0% |
| Transformation legality and coverage | 15% | 35% | 5.3% |
| Cross-Pillar Domain Object communication | 10% | 15% | 1.5% |
| Boundary integrity | 15% | 30% | 4.5% |
| Provenance across Pillars | 10% | 10% | 1.0% |
| Dependency direction and planning cycle | 10% | 20% | 2.0% |
| Implementation capability coverage | 5% | 50% | 2.5% |
| **Total** | **100%** |  | **24.8%** |

The score rounds to 25%. Behavioral similarity receives partial credit, primarily for deterministic
Plan computation and separation of derived previews from authored persistence. Explicit Pillar
ownership, canonical communication, Live/Learn coverage, complete provenance, and end-to-end
transitions receive no full credit.

## Architectural Assumptions

- The published architecture is authoritative.
- Every architectural responsibility belongs to exactly one Architectural Pillar.
- Pillars define conceptual responsibility boundaries, not implementation layers.
- Missing implementation does not imply architectural error.
- Behavioral similarity alone does not establish Pillar ownership.
- Implementation support mechanisms such as storage and presentation are not themselves new
  Pillars; any architectural responsibility they perform must still remain owned by Teach, Plan,
  Live, or Learn.

Chapter IV §4.7 says that Learn produces **Capacity Insights**. Chapter II §2.6 and Chapter V §5.7
define **Planning Insights**, and the glossary defines Planning Insight but not Capacity Insight.
This is an internal normative terminology contradiction. No implementation exists for either term,
so the contradiction does not change the present missing-status conclusion. It prevents a
definitive future output-name mapping for Learn until the specification is corrected.

## Pillar Inventory

Every Architectural Pillar appears exactly once.

| Architectural Pillar | Implementation | Status | Confidence | Notes |
|---|---|---|---|---|
| Teach | Authored-like state setters, profile operations, backup import, and initialization in `code/src/state/**` | Partially Implemented | Medium | Maintains user-entered planning data but has no Teach identity, Author transformation, canonical objects/services, or exclusive boundary; mixed with persistence and migration. |
| Plan | Planning functions under `code/src/core/{shifts,cycles,blocks,friction,engine}/**` | Partially Implemented | High | Deterministic planning pipeline exists but omits required Plan products, lacks explicit ownership/provenance, and mixes service logic with orchestration. |
| Live | No implementation mapping found | Missing | High | No Accepted Schedule, Record transformation, Execution Event, History Record, or recording workflow. |
| Learn | No implementation mapping found | Missing | High | No Analyze transformation, historical/trend analysis, or Planning/Capacity Insight workflow. |

## Responsibility Matrix

| Responsibility | Assigned Pillar | Implementation | Status |
|---|---|---|---|
| Establish and maintain user intent | Teach | State setters/profile/import paths | Partial; implicit and distributed |
| Own Authored Domain Objects | Teach | `DayFrameAuthoredSetup`-like state | Partial; no canonical category/Pillar ownership |
| Perform Author transformations | Teach | No explicit transformation; setter/load/normalization behavior | Missing boundary |
| Produce Commitments | Teach | Shift definitions/cycles/manual events as proxies | Partial |
| Produce Goals | Teach | Block templates/recurrences as proxies | Partial |
| Produce Patterns and Routines | Teach | Cycles/recurrences/profiles as ambiguous proxies | Partial; Routine missing |
| Produce Preferences | Teach | Scheduling and template preference fields | Partial |
| Produce Constraints | Teach | Embedded fixed/required fields and validation | Partial |
| Perform deterministic planning | Plan | `generateSchedulePreview` pipeline | Partial, substantial |
| Own Derived Domain Objects | Plan | Preview-only derived DTOs | Partial; ownership not declared |
| Perform Derive transformations | Plan | Core generation functions | Partial; transformation not recorded |
| Produce Capacity Models | Plan | Availability calculated inside placement | Missing object/owner |
| Produce Commitment Occurrences | Plan | Generated work blocks | Partial |
| Produce Goal Occurrences | Plan | Folded into block-candidate generation | Missing distinct output |
| Produce Planning Candidates | Plan | `BlockCandidate` | Partial |
| Produce Generated Plans | Plan | Preview result/scheduled arrays | Partial |
| Produce Friction Reports | Plan | `FrictionPoint[]` | Partial |
| Produce Recommendation Proposals | Plan | Nested `SuggestedFix[]` | Partial |
| Record observed reality | Live | No implementation | Missing |
| Own immutable Historical Domain Objects | Live | No implementation | Missing |
| Produce Accepted Schedules, Execution Events, History Records | Live | No implementation | Missing |
| Analyze completed execution | Learn | No implementation | Missing |
| Own Derived Analytical Domain Objects | Learn | No implementation | Missing |
| Produce Historical Analysis and Trend Analysis | Learn | No implementation | Missing |
| Produce Capacity/Planning Insights | Learn | No implementation | Missing; normative name contradiction |
| Preserve provenance in each Pillar | All four | Partial IDs only in current planning outputs | Misaligned |

The same implementation types and state operations currently stand in for multiple responsibility
rows. The matrix assigns the **architectural owner**, not a claim that the implementation enforces
that owner.

## Transformation Matrix

### Pillar-owned transformations

| Transformation | Legal | Implemented | Notes |
|---|---|---|---|
| Author | Yes—Teach only | Partial, implicit | Setters/load/import/normalization create or replace authored-like values, but no Author identity, canonical output, provenance, or exclusive enforcement exists. |
| Derive | Yes—Plan only | Partial, substantial | Core planning functions perform deterministic computation but do not declare Derive, produce all canonical outputs, or preserve complete provenance. |
| Record | Yes—Live only | No | No observation-to-history workflow or Historical Domain Object producer exists. |
| Analyze | Yes—Learn only | No | No history-to-analysis workflow or Derived Analytical Domain Object producer exists. |

### Cross-Pillar transitions

| Transformation transition | Legal | Implemented | Notes |
|---|---|---|---|
| Author → Derive / Teach → Plan | Yes | Partial | Store passes raw authored-like state into preview generation; canonical Domain Object handoff and provenance are absent. |
| Derive → Record / Plan → Live | Yes | No | No plan acceptance or recording boundary exists. |
| Record → Analyze / Live → Learn | Yes | No | Neither side exists. |
| Analyze → new Author / Learn → Teach | Yes, only as new authored intent | No | No analytical output or future Teach workflow exists. |
| Recommendation Proposal → future Author / Plan → Teach | Yes, after explicit acceptance | Misaligned | Selected suggested fixes directly revise a preview rather than create new authored intent through Teach. |

## Capability Coverage Matrix

Every major executable capability in scope is listed once. UI rendering/event handling is excluded
by the audit scope. Scalar parsing, cloning helpers, and type guards are grouped with their owning
major capability rather than treated as separate architectural responsibilities.

| Implementation Capability | Assigned Pillar | Confidence | Notes |
|---|---|---|---|
| User Day/User Week calculation | Plan | High | Planning temporal derivation; no explicit ownership |
| Static holiday lookup | Plan | Low | Reference information with no current preview-pipeline consumer or canonical Constraint mapping |
| Shift/cycle definition validation and normalization | Teach | Medium | Maintains authored-like structures but also runs during Plan input handling |
| Scheduling-preference state updates | Teach | High | User intent proxy mixed with persistence/state notification |
| Shift/cycle/manual-event state updates | Teach | High | Commitment/pattern proxies mixed with persistence |
| Block-template/recurrence state updates | Teach | High | Goal/pattern/preference/constraint responsibilities conflated |
| Profile save/load/delete | Unassigned/mixed | High | Persistence snapshot workflow plus authored-state replacement; no single Pillar contract |
| Backup export/import | Unassigned/mixed | High | Transport plus authored-state reconstruction; import can initiate Teach-like replacement |
| Persisted-state migration/normalization | Unassigned/mixed | High | Can change authored-like values without Author/Pillar provenance |
| Work-block/cycle occurrence generation | Plan | High | Commitment Occurrence proxy |
| Block-candidate generation | Plan | High | Combines Goal Occurrence and Planning Candidate work |
| Block placement | Plan | High | Combines Capacity-like gap calculation and Placement |
| Manual-event-to-scheduled-block conversion | Plan | High | Plan work performed inside coordinator |
| Schedule preview orchestration/filtering | Plan | High | Planning coordination plus direct business logic |
| Friction detection | Plan | High | Friction Report proxy |
| Suggested-fix generation | Plan | High | Recommendation Proposal proxy |
| Suggested-fix application | Unassigned/mixed | High | Interprets Plan recommendation, changes derived objects, and bypasses future Teach |
| Preview revision orchestration | Plan / future Teach boundary | Medium | Coordinates re-planning without new authored intent |
| Store subscription/notification | Unassigned support | High | Application state mechanism, not a published Pillar responsibility |
| Local authored-state/profile persistence | Unassigned support | High | Persistence mechanism combined with Teach-like operations |

Capabilities marked unassigned/mixed demonstrate missing implementation ownership, not additional
architectural responsibilities or Pillars.

## Findings

### Fully Aligned

#### FA-01 — Core planning functions derive output without persisting or mutating authored input

**Architecture Reference:** Chapter IV §4.5 and §4.8.

**Implementation Evidence:**

- `generateSchedulePreview` accepts authored-like inputs and returns derived output without storage
  access (`code/src/core/engine/generateSchedulePreview.ts:23-47,194-200`).
- It clones block templates and recurrences before candidate generation
  (`code/src/core/engine/generateSchedulePreview.ts:74-84,336-347`).
- Tests verify preview generation does not mutate input arrays
  (`code/src/core/engine/tests/generateSchedulePreview.test.ts:321`).
- Revision tests verify preservation of original preview inputs
  (`code/src/core/engine/tests/reviseSchedulePreview.test.ts:284`).

**Finding:** Within the core planning path, authored-like inputs are treated as inputs to
deterministic computation rather than modified in place.

**Severity:** Informational. This behavior aligns with Plan's “derive without modifying authored
intent” boundary.

**Architectural Impact:** The core Plan proxy has a useful non-mutating boundary even though
canonical ownership is absent.

**Recommendation:** Preserve this non-mutation behavior when Plan, Derive, and canonical Domain
Objects are made explicit.

#### FA-02 — Derived preview state is excluded from authored persistence and backups

**Architecture Reference:** Chapter IV §§4.4-4.5 and §4.8; §4.11 invariant 4.

**Implementation Evidence:**

- `DayFrameAuthoredSetup` excludes `preview`
  (`code/src/state/types.ts:63-74`).
- `persistState` writes authored-like setup but not the preview
  (`code/src/state/dayFrameStore.ts:398-417`).
- Backup export selects authored setup only
  (`code/src/state/dayFrameStore.ts:213-215,454-463`).
- Tests verify backup export omits preview and import clears current preview
  (`code/src/state/tests/dayFrameStore.test.ts:577-671`).

**Finding:** A Plan result is not transported or persisted as if it were Teach-owned intent.

**Severity:** Informational. This is an aligned partial boundary.

**Architectural Impact:** Current storage behavior reduces the risk of derived previews silently
becoming authoritative authored setup.

**Recommendation:** Retain the authored/derived separation while adding explicit Teach and Plan
ownership.

### Partially Aligned

#### PA-01 — Teach responsibilities are behaviorally present but have no exclusive Pillar boundary

**Architecture Reference:** Chapter IV §4.4 and §4.11 invariants 1, 2, and 8.

**Implementation Evidence:**

- Store methods update preferences, shifts, cycles, templates, recurrences, and manual events
  (`code/src/state/dayFrameStore.ts:50-143`).
- `DayFrameAuthoredSetup` groups those fields
  (`code/src/state/types.ts:63-74`).
- Profile load and backup import also replace them
  (`code/src/state/dayFrameStore.ts:174-229`).
- No Teach, Author, Authored Domain Object category, or Authoring Service ownership marker exists.

**Finding:** User-intent maintenance exists, but multiple application paths can perform it and none
is constrained as Teach.

**Severity:** High. Teach's exclusive authority over authored intent is not enforceable.

**Architectural Impact:** Authored-like information can enter through setters, initialization,
profile load, backup import, and normalization without one responsible Pillar.

**Recommendation:** Route every creation/update of Authored Domain Objects through an explicit
Teach-owned Author boundary implemented by the canonical Authoring Services.

#### PA-02 — Plan responsibilities are substantial but incomplete and structurally implicit

**Architecture Reference:** Chapter IV §4.5 and §4.11 invariants 1, 2, 8, and 9.

**Implementation Evidence:**

- The preview path sequences work-block generation, candidate generation, placement, friction, and
  suggested fixes (`code/src/core/engine/generateSchedulePreview.ts:63-134`).
- The returned result aggregates generated work blocks, candidates, scheduled blocks, unplaced
  candidates, and friction points (`code/src/core/engine/generateSchedulePreview.ts:37-43`).
- Capacity Models and Goal Occurrences are absent.
- No Plan Pillar, Derive transformation, Derivation Service, or Planning Engine ownership is
  recorded.

**Finding:** Most current domain computation is assignable to Plan with high behavioral confidence,
but required responsibilities and conceptual ownership are missing.

**Severity:** High. The strongest implemented Pillar remains only a proxy.

**Architectural Impact:** Plan's scope is inferred from module behavior and cannot guarantee
category ownership, legal outputs, or service/engine separation.

**Recommendation:** Declare Plan ownership and make its Derivation Services/Planning Engine produce
all and only the specified Derived Domain Objects.

#### PA-03 — Teach-to-Plan handoff exists through implementation DTOs rather than Domain Objects

**Architecture Reference:** Chapter IV §4.8 and §4.11 invariant 3.

**Implementation Evidence:**

- `DayFrameStore.generatePreview` reads state arrays/preferences and passes clones/primitives to
  `generateSchedulePreview` (`code/src/state/dayFrameStore.ts:232-248`).
- `GenerateSchedulePreviewInput` names shift definitions, cycles, templates, recurrences, manual
  events, date values, and primitive preferences
  (`code/src/core/engine/generateSchedulePreview.ts:23-35`).
- Canonical Commitments, Goals, Patterns, Preferences, and Constraints are not passed.

**Finding:** A practical forward dependency from authored-like state into planning exists, but the
cross-Pillar contract is coupled to application DTOs and primitives.

**Severity:** High. Pillars are required to communicate exclusively through Domain Objects.

**Architectural Impact:** Plan depends on Teach's implementation representation rather than
canonical authored information.

**Recommendation:** Replace the state/DTO handoff with canonical Authored Domain Objects and
preserve their identity and provenance at the Teach → Plan boundary.

#### PA-04 — Local source references survive some Plan computations but not Pillar provenance

**Architecture Reference:** Chapter IV §4.9 and §4.11 invariant 5.

**Implementation Evidence:**

- Work blocks retain shift-definition/cycle/segment IDs
  (`code/src/core/shifts/types.ts:19-31`;
  `code/src/core/cycles/types.ts:60-63`).
- Candidates retain template/recurrence IDs
  (`code/src/core/blocks/types.ts:104-127`).
- Friction points retain affected block IDs
  (`code/src/core/friction/types.ts:29-45`).
- No produced object records responsible Pillar or transformation; Audit 05 found zero complete
  provenance records (`docs/architecture/IMPLEMENTATION_ALIGNMENT_AUDIT_05_ARCHITECTURAL_PROVENANCE.md`).

**Finding:** Immediate source IDs provide partial traceability inside Plan, but no output identifies
Plan or Derive and the complete chain is not preserved.

**Severity:** Critical. Provenance preservation is a Pillar invariant.

**Architectural Impact:** Neither cross-Pillar origin nor responsible ownership can be reconstructed
from a result.

**Recommendation:** Require each Pillar-produced Domain Object to record originating information,
the legal transformation, and responsible Pillar, in addition to complete service/engine
provenance.

#### PA-05 — Module dependency direction is mostly forward for current Teach-like to Plan-like work

**Architecture Reference:** Chapter IV §§4.3 and 4.8.

**Implementation Evidence:**

- State code imports planning core functions and types
  (`code/src/state/dayFrameStore.ts:1-3`; `code/src/state/types.ts:1-8`).
- Core planning modules do not import the state store.
- The core preview coordinator receives input values instead of reaching into application state
  (`code/src/core/engine/generateSchedulePreview.ts:23-47`).
- No Live/Learn dependencies exist.

**Finding:** The existing authored-state-to-planning call direction is forward and the core does not
depend back on the state store. However, it is an application-layer dependency, not an explicit
Pillar-to-Pillar Domain Object transition.

**Severity:** Low. No reverse core-to-store import was found, but architectural direction remains
implicit.

**Architectural Impact:** Current module direction supports separation but cannot enforce legal
Pillar transitions.

**Recommendation:** Preserve the forward dependency while formalizing it as Teach-produced Domain
Objects consumed by Plan.

### Misaligned

#### MA-01 — No component declares exactly-one-Pillar ownership

**Architecture Reference:** Chapter IV §§4.1-4.3 and §4.11 invariants 1, 2, and 10.

**Implementation Evidence:**

- No Pillar type, owner field, Pillar-specific contract, or responsibility registry exists under
  `code/src`.
- Modules are organized around implementation concerns (`state`, `time`, `cycles`, `blocks`,
  `friction`, `engine`) rather than explicit Teach, Plan, Live, and Learn ownership.
- The Capability Coverage Matrix required inferential assignments for every row.

**Finding:** No significant capability can prove exactly-one-Pillar ownership through its
implementation contract.

**Severity:** Critical. Pillars are the highest-level responsibility decomposition and are absent.

**Architectural Impact:** Responsibility duplication, omission, and cross-boundary behavior cannot
be prevented or mechanically audited.

**Recommendation:** Assign every architectural responsibility, Domain Object producer, Service, and
Engine explicitly to exactly one of Teach, Plan, Live, or Learn.

#### MA-02 — State management combines Teach, Plan invocation, persistence, and workflow lifecycle

**Architecture Reference:** Chapter IV §§4.2, 4.4-4.5, 4.8, and 4.10.

**Implementation Evidence:**

- `createDayFrameStore` updates authored-like data, persists it, manages profiles/backups, invokes
  planning/revision, stores derived previews, and notifies subscribers
  (`code/src/state/dayFrameStore.ts:34-332`).
- The same `DayFrameState` contains authored-like fields and a derived preview
  (`code/src/state/types.ts:50-61`).
- Persistence helpers and planning workflow calls share the same closure and hidden state.

**Finding:** One application component spans Teach-like responsibility, Plan workflow invocation,
derived lifecycle, and persistence support without explicit ownership boundaries.

**Severity:** Critical. Major responsibilities are mixed and cannot belong to exactly one Pillar.

**Architectural Impact:** Changes in state management can directly redefine both authored-intent and
planning workflow behavior.

**Recommendation:** Keep Pillar-owned responsibilities behind explicit boundaries; make state
management transport/store results without owning Teach or Plan transformations and workflows.

#### MA-03 — Suggested-fix selection bypasses the future Teach boundary

**Architecture Reference:** Chapter IV §§4.4-4.5, §4.8, §4.11 invariant 7.

**Implementation Evidence:**

- `applySuggestedFixToPreview` sends selected IDs directly to `reviseSchedulePreview`
  (`code/src/state/dayFrameStore.ts:266-300`).
- `applySuggestedFix` changes derived block status, duration, category/title, priority, or placement
  (`code/src/core/friction/applySuggestedFix.ts:39-137` and action helpers).
- No new Authored Domain Object, Author transformation, or Teach workflow is produced.

**Finding:** An advisory Plan output is accepted into direct Plan revision rather than entering a
future Teach-owned Author transformation.

**Severity:** Critical. This is an implemented illegal/bypassed Pillar transition.

**Architectural Impact:** Plan effectively owns the consequence of recommendation acceptance and a
new planning cycle begins without new Teach-authored intent.

**Recommendation:** Send accepted Recommendation Proposals to future Teach, create new authored
intent through Author, and then begin a new Plan derivation.

#### MA-04 — Load-time normalization can redefine authored-like intent outside Teach provenance

**Architecture Reference:** Chapter IV §4.4, §4.8, and §4.9.

**Implementation Evidence:**

- Initial state normalizes persisted authored setup
  (`code/src/state/createInitialDayFrameState.ts:26-49,88-106`).
- A matching persisted template can be changed from `enabled: false` to `enabled: true`
  (`code/src/state/createInitialDayFrameState.ts:123-162`).
- Legacy manual events are transformed during load
  (`code/src/state/manualCalendarEvents.ts:19-66`).
- No responsible Teach Pillar, Author transformation, predecessor, or user acceptance is recorded.

**Finding:** Persistence reconstruction can produce changed authored-like values through an
unowned implementation path.

**Severity:** High. Only Teach may create/modify authored intent and must preserve provenance.

**Architectural Impact:** Plan may consume intent introduced by migration rather than explicitly
originating within Teach.

**Recommendation:** Keep value-changing authored migrations within an explicit Teach/Author
boundary with user authority and complete predecessor provenance.

#### MA-05 — Plan orchestration performs service work and directly produces derived information

**Architecture Reference:** Chapter IV §4.10 and §4.11 invariants 8-9.

**Implementation Evidence:**

- `generateSchedulePreview` coordinates core functions but also calculates visibility, converts
  manual events, filters derived collections, and assembles result objects
  (`code/src/core/engine/generateSchedulePreview.ts:51-61,135-255,350-449`).
- Manual conversion assigns category, priority, placement, status, and a hard-coded user ID
  (`code/src/core/engine/generateSchedulePreview.ts:238-253`).
- Audit 03 found service responsibility inside orchestration, and Audit 04 found Planning Engine
  business logic
  (`docs/architecture/IMPLEMENTATION_ALIGNMENT_AUDIT_03_ARCHITECTURAL_SERVICES.md`;
  `docs/architecture/IMPLEMENTATION_ALIGNMENT_AUDIT_04_ARCHITECTURAL_ENGINES.md`).

**Finding:** Although all this behavior is broadly Plan-related, the required separation between
Pillar responsibility, Service capability, and Engine coordination is not maintained.

**Severity:** High. Pillar ownership alone does not permit orchestration to replace Services.

**Architectural Impact:** The Plan Pillar cannot demonstrate that Services implement its
responsibilities and the Planning Engine only coordinates them.

**Recommendation:** Keep responsibility assigned to Plan while relocating each capability to its
canonical Plan Service and retaining only coordination in the Planning Engine.

### Missing

#### MI-01 — Live Pillar is absent

**Architecture Reference:** Chapter IV §4.6 and §4.11 invariants 2, 6, 8, and 9.

**Implementation Evidence:**

- No Accepted Schedule, Execution Event, History Record, Record transformation, Recording Service,
  or Live Engine exists under `code/src`.
- Mutable `DraftScheduledBlock` status literals include execution words but no recorder produces
  historical evidence (`code/src/core/blocks/types.ts:143-170`).
- Audits 01-05 consistently report the historical stage missing.

**Finding:** No implementation component owns or performs Live responsibility.

**Severity:** Critical. One of four complete responsibility boundaries is absent.

**Architectural Impact:** Derived plans cannot become accepted schedules or immutable observed
reality, and Plan has no legal downstream Pillar.

**Recommendation:** Implement Live ownership, Record, the specified Historical Domain Objects,
Recording Services, and Live Engine exactly as published.

#### MI-02 — Learn Pillar is absent

**Architecture Reference:** Chapter IV §4.7 and §4.11 invariants 2, 6, 8, and 9.

**Implementation Evidence:**

- No Historical Analysis, Trend Analysis, Capacity/Planning Insight, Analyze transformation,
  Analysis Service, or Learning Engine exists under `code/src`.
- Current friction/recommendation functions consume current derived plan information rather than
  historical evidence (`code/src/core/friction/types.ts:47-69`).

**Finding:** No implementation component owns or performs Learn responsibility.

**Severity:** Critical. One of four complete responsibility boundaries is absent.

**Architectural Impact:** Historical evidence cannot produce advisory knowledge and no legal
Learn → future Teach transition can occur.

**Recommendation:** After resolving the specification's insight-name contradiction, implement
Learn, Analyze, its Derived Analytical Domain Objects, Analysis Services, and Learning Engine
without modifying history or authored intent.

#### MI-03 — Complete legal Pillar lifecycle and cross-Pillar provenance are absent

**Architecture Reference:** Chapter IV §§4.3, 4.8-4.9, and §4.11 invariants 3, 5, 7, and 10.

**Implementation Evidence:**

- Executable workflow stops at preview generation or direct preview revision
  (`code/src/state/dayFrameStore.ts:232-300`).
- Live and Learn are absent (MI-01 and MI-02).
- The Teach → Plan handoff uses raw implementation values (PA-03).
- Audit 05 found no complete provenance record on any produced output.

**Finding:** The implementation cannot traverse Teach → Plan → Live → Learn → Teach through
canonical Domain Objects while preserving provenance.

**Severity:** Critical. The four Pillars do not collectively define an executable responsibility
decomposition or continuous planning cycle.

**Architectural Impact:** Cross-Pillar legality, ownership, immutability, and explainability cannot
be demonstrated end to end.

**Recommendation:** Implement all legal Pillar transitions with canonical Domain Object handoffs,
complete accumulated provenance, and new authored intent only at the future Teach boundary.

## Evidence

### Integrated ownership map

```text
Application state/store
        ├── authored-like setters ───────────────────────────── Teach proxy
        ├── profile/import/normalization ────────────────────── mixed/unowned
        ├── persistence/notification ────────────────────────── support mixed with Teach
        └── preview/revision invocation ─────────────────────── Plan workflow start
                        ↓
Core planning
        ├── occurrence generation ───────────────────────────── Plan proxy
        ├── candidate generation ────────────────────────────── Plan proxy
        ├── placement/capacity-like calculation ─────────────── Plan proxy
        ├── friction/recommendations ────────────────────────── Plan proxy
        └── orchestration plus business logic ───────────────── Plan, mixed capability layers

Live ─────────────────────────────────────────────────────────── missing
Learn ────────────────────────────────────────────────────────── missing
```

### Cross-Pillar communication assessment

| Boundary | Current carrier | Canonical Domain Objects | Provenance | Result |
|---|---|---|---|---|
| Teach-like → Plan-like | State arrays, DTOs, primitives, dates | No | Immediate IDs only | Partial/misaligned |
| Plan-like → Live | None | No | None | Missing |
| Live → Learn | None | No | None | Missing |
| Learn → future Teach | None | No | None | Missing |
| Plan recommendation → future Teach | Selected string IDs sent to preview revision | No | Selected IDs not retained on output | Bypassed |

### Dependency assessment

| Dependency | Direction | Assessment |
|---|---|---|
| State imports core planning | Teach-like/application → Plan-like | Forward in module terms; coupled through DTOs |
| Core planning imports state | None found | No direct backward module dependency |
| Planning coordinator imports domain capability modules | Engine-like → service-like | Expected direction, but coordinator performs capability work |
| Friction revision changes placement-like output | Plan utility → other Plan capability | Cross-capability leakage within Plan |
| Plan → Live | None | Missing |
| Live → Learn | None | Missing |
| Learn → Teach | None | Missing |

No import cycle between `code/src/core` and `code/src/state` was found. This does not establish
Pillar compliance because conceptual ownership and Domain Object contracts remain absent.

### Provenance reuse from Audit 05

Audit 05 established:

- zero complete provenance records;
- no transformation identity on any output;
- no producing-service identity;
- no coordinating-engine identity;
- weakened candidate lineage during placement;
- no historical/analytical provenance stages.

Those findings directly establish noncompliance with Chapter IV §4.9 and invariant 5. This audit
does not recalculate the provenance score; it applies that evidence to Pillar boundaries.

### Chapter IV invariant matrix

| # | Invariant | Status | Primary finding |
|---:|---|---|---|
| 1 | Every responsibility belongs to exactly one Pillar. | Violated/not enforceable | MA-01, MA-02 |
| 2 | Every Pillar owns one or more object categories/information. | Partial/missing | PA-01, PA-02, MI-01, MI-02 |
| 3 | Pillars communicate exclusively through Domain Objects. | Violated | PA-03 |
| 4 | No Pillar modifies information owned by another. | Partial violation | Core Plan preserves authored inputs; MA-03 bypasses future Teach |
| 5 | Every Pillar preserves provenance. | Violated | PA-04; Audit 05 |
| 6 | Historical evidence remains immutable. | Missing / not testable | MI-01 |
| 7 | Recommendations remain advisory until future Author acceptance. | Violated after selection | MA-03 |
| 8 | Services implement Pillar responsibilities. | Violated/incomplete | MA-05; Audit 03 |
| 9 | Engines coordinate Pillar workflows. | Violated/incomplete | MA-05; Audit 04 |
| 10 | Four Pillars define complete decomposition. | Violated/incomplete | MA-01, MI-01–MI-03 |

## Recommendations

1. Represent Teach, Plan, Live, and Learn explicitly as the only architectural responsibility
   owners.
2. Assign every Domain Object producer, Service, Engine, transformation, and workflow to exactly one
   Pillar.
3. Make Teach the exclusive owner of Author and all Authored Domain Object creation/update paths,
   including authorized imports and value-changing migrations.
4. Make Plan the exclusive owner of Derive and complete its missing Capacity Model and Goal
   Occurrence responsibilities.
5. Replace state arrays, primitives, callbacks, and DTO envelopes at cross-Pillar boundaries with
   canonical Domain Objects.
6. Keep application state/persistence as support mechanisms that invoke Pillar-owned boundaries
   without owning transformations or workflows.
7. Separate Plan Services from Planning Engine coordination while retaining both under Plan
   responsibility.
8. Route accepted Recommendation Proposals into a future Teach Author transformation, then begin a
   new Plan cycle.
9. Implement Live as the exclusive owner of Record, immutable Historical Domain Objects, Recording
   Services, and Live Engine.
10. Resolve `Capacity Insights` versus `Planning Insights`, then implement Learn as the exclusive
    owner of Analyze, Derived Analytical Domain Objects, Analysis Services, and Learning Engine.
11. Preserve originating information, transformation, responsible Pillar, producing Service, and
    coordinating Engine across every Pillar transition.
12. Implement the complete Teach → Plan → Live → Learn → Teach lifecycle through forward-only
    Domain Object handoffs.
13. Add boundary tests for exactly-one-Pillar ownership, legal transformations, prohibited
    modifications, Domain Object-only communication, provenance, historical immutability,
    advisory recommendations, and complete cycle order.

These recommendations preserve the published architecture and are implementation-alignment
statements, not implementation tasks or an implementation plan.

## Open Questions

1. Are profile load and backup import intended to be Teach/Author workflows or transport-only
   restoration of previously authored intent? The implementation records neither origin nor Pillar.
2. Which Pillar owns validation/normalization of authored structures when the same functions are
   invoked during Plan input preparation? Current ownership is not expressed.
3. Is static holiday reference data intended to become a Teach-owned Constraint source, a
   Plan-consumed external Domain Object, or remain outside architectural planning? It is not used by
   the current pipeline.
4. Is `reviseSchedulePreview` intended to follow a future Teach acceptance or remain within one
   disposable Plan workflow? No authored handoff exists.
5. Which Learn output term is normative: Chapter IV's **Capacity Insights** or Chapters II/V's
   **Planning Insights**?
6. Are profile, backup, migration, notification, and local persistence intended solely as
   application support mechanisms, or do any implement architectural workflows? Current code mixes
   them with Teach/Plan behavior.

No additional open questions.

## Completion Statement

Teach, Plan, Live, and Learn have each been evaluated exactly once in the Pillar Inventory. Every
major Chapter IV responsibility has been assigned in the Responsibility Matrix. Author, Derive,
Record, and Analyze and all legal cross-Pillar transitions have been examined. Every major
executable capability in scope has been mapped once in the Capability Coverage Matrix.

Responsibility ownership, transformation legality, communication, boundary integrity, provenance,
dependency direction, implementation coverage, and all ten Chapter IV invariants have been
assessed against executable evidence and prior audits. Every finding includes an architecture
reference, implementation evidence, severity, architectural impact, and an alignment-preserving
recommendation. The audit contains no additional findings beyond those reported above.
