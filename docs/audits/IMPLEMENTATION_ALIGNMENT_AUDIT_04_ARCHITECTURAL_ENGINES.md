# DayFrame Implementation Alignment Audit 04

## Architectural Engines Compliance

**Normative source:** `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`, Chapter VI  
**Audit standard:** `Implementation_Alignment_Standard.md`, Version 1.0.0  
**Implementation scope:** `code/src/core/**` and `code/src/state/**`  
**Audit date:** 2026-07-26

## Executive Summary

**Overall rating: Significantly Misaligned**

The implementation does not explicitly represent any of the four Architectural Engines defined by
Chapter VI. It contains a substantial functional proxy for part of the Planning Engine in
`generateSchedulePreview`, and the state store coordinates some Teach-like authored-state actions.
The Live Engine and Learning Engine are missing.

The planning proxy sequences commitment-like occurrence generation, candidate generation,
placement, friction detection, and suggested-fix generation in a deterministic order. It is
independently tested and accepts explicit planning inputs. It is not a canonical Planning Engine:
two required derivation stages are absent, invoked functions are not explicit Architectural
Services, workflow results do not preserve mandatory provenance, and the coordinator directly
creates and filters plan information.

The Teach-like path is distributed across state setters, profile operations, import, initialization,
and persistence. It performs state mutation and owns persistence rather than coordinating the five
Authoring Services. No complete Teach → Plan → Live → Learn → Teach cycle exists. Suggested-fix
selection revises the current derived preview instead of returning through a future Teach
transformation that creates new authored intent.

The strongest aligned characteristic is deterministic sequencing in the core planning coordinator.
Engine identity, ownership, boundaries, Domain Object communication, provenance, and the complete
orchestration model remain substantially absent.

## Alignment Score

**Estimated compliance: 27%**

| Area | Weight | Assessment | Weighted result |
|---|---:|---:|---:|
| Four-engine existence and identity | 20% | 20% | 4.0% |
| Workflow ownership | 15% | 35% | 5.3% |
| Service coordination and delegation | 20% | 35% | 7.0% |
| Engine inputs and outputs | 10% | 35% | 3.5% |
| Engine boundaries | 15% | 20% | 3.0% |
| Composition and planning cycles | 10% | 10% | 1.0% |
| Determinism | 5% | 80% | 4.0% |
| Provenance | 5% | 5% | 0.3% |
| **Total** | **100%** |  | **28.1%** |

The score is conservatively reported as 27% because behavioral similarity alone does not establish
Architectural Engine alignment. The planning proxy receives substantial functional credit, while
the state-store proxy receives limited credit because it owns mutation and persistence. Missing
Live/Learning orchestration and the absent complete planning cycle materially lower the result.

## Architectural Assumptions

- The published architecture is authoritative.
- Canonical terminology is defined by the published glossary.
- Missing implementation does not imply architectural error.
- Existing implementation may predate the published architecture.
- Findings are implementation-alignment findings only.

Chapter VI §6.7 says that the Learning Engine coordinates an **Insight Learning Service**. Chapter
V §5.7 defines an **Insight Generation Service**, and no Insight Learning Service appears in the
service inventory. This is an internal naming contradiction in the published specification. The
audit can determine that no corresponding implementation exists under either name, but cannot
definitively determine which canonical service name the Learning Engine must invoke.

## Audit Scope

This audit evaluates:

- the existence, identity, ownership, inputs, outputs, and boundaries of Teach, Planning, Live, and
  Learning Engines;
- workflow sequencing, service invocation, dependency direction, aggregation, completion, and
  cross-engine composition;
- deterministic execution, provenance, and responsibility leakage within `code/src/core/**` and
  `code/src/state/**`; and
- all ten Chapter VI invariants.

Domain Object, Information Flow, and Architectural Service correctness are referenced only where
necessary to determine engine communication or delegation. UI, persistence technology,
performance, and code quality are out of scope. Presentation code is outside the stated
implementation scope, so this report makes no finding about engine responsibility leakage inside
`code/src/ui/**`.

## Engine Inventory

Every Architectural Engine defined by Chapter VI appears exactly once.

| Architectural Engine | Implementation | Status | Confidence | Notes |
|---|---|---|---|---|
| Teach Engine | `createDayFrameStore` authored-state setters, profile load, and backup import (`code/src/state/dayFrameStore.ts:34-229`) | Partially Implemented | Medium | Coordinates some intent-maintenance operations, but no Teach Engine identity exists; it does not invoke five canonical Authoring Services and also owns state mutation/persistence. |
| Planning Engine | `generateSchedulePreview` and `reviseSchedulePreview` (`code/src/core/engine/*.ts`), invoked by store actions | Partially Implemented | High | A clear deterministic planning coordinator exists, but it skips required services, calls functional proxies, performs business logic, produces information directly, and lacks provenance. |
| Live Engine | No implementation mapping found | Missing | High | No recording workflow or coordination of Execution/History Recording Services exists. |
| Learning Engine | No implementation mapping found | Missing | High | No historical-analysis workflow or coordination of Analysis Services exists. |

## Workflow Matrix

| Workflow | Architectural Engine | Implementation | Status |
|---|---|---|---|
| Establish and maintain authored intent | Teach Engine | Store setters, profile load, backup import, initialization normalization | Partial; distributed state operations replace service coordination |
| Transform authored intent into deterministic planning proposals | Planning Engine | `generateSchedulePreview` via `DayFrameStore.generatePreview` | Partial; substantial sequence exists but omits Capacity and Goal Occurrence stages and performs service work |
| Re-plan following an advisory proposal | Planning Engine after future Teach acceptance | `applySuggestedFixToPreview` → `reviseSchedulePreview` | Misaligned; revision bypasses new authored intent/future Teach |
| Record observed execution as historical evidence | Live Engine | No implementation | Missing |
| Derive understanding from historical evidence | Learning Engine | No implementation | Missing |
| Complete successive Teach → Plan → Live → Learn → Teach cycles | All four engines | No end-to-end implementation | Missing |

Only the primary planning workflow has one identifiable coordinating proxy. Teach workflow ownership
is distributed through the state store. Live, Learning, and cross-engine cycle ownership are absent.

## Findings

### Fully Aligned

#### FA-01 — Core planning orchestration follows a stable, explicit sequence

**Architecture Reference:** Chapter VI §§6.2, 6.5, and 6.9.

**Implementation Evidence:**

- `generateSchedulePreview` invokes cycle work-block generation, block-candidate generation,
  placement, friction detection, and suggested-fix generation in a fixed order
  (`code/src/core/engine/generateSchedulePreview.ts:63-134`).
- The function aggregates and returns a single workflow result
  (`code/src/core/engine/generateSchedulePreview.ts:194-200`).
- Full-pipeline tests exist in
  `code/src/core/engine/tests/generateSchedulePreview.test.ts`, including a test explicitly
  described as running the full preview pipeline (`:15`).

**Finding:** The current planning proxy determines execution order, composes separable
capabilities, and aggregates their results.

**Severity:** Informational. These are aligned engine behaviors even though the coordinator is not
a canonical Architectural Engine.

**Architectural Impact:** The implementation has a usable orchestration seam for the partial Plan
workflow.

**Recommendation:** Preserve the fixed coordination sequence and aggregation behavior while
replacing functional proxies with the canonical Derivation Services and removing business logic
from the engine.

#### FA-02 — The core planning coordinator is deterministic for complete explicit inputs

**Architecture Reference:** Chapter VI §6.5 and the audit's deterministic-engine requirement;
Chapter VI §6.13 invariant 9 by preservation of deterministic transformations.

**Implementation Evidence:**

- `GenerateSchedulePreviewInput` explicitly supplies authored planning values, planning dates,
  preferences, and `generatedAt`
  (`code/src/core/engine/generateSchedulePreview.ts:23-35`).
- Repository search found no randomness, network access, storage access, implicit current-time
  read, or hidden mutable module state in `generateSchedulePreview` or
  `reviseSchedulePreview`.
- `generateSchedulePreview` clones authored arrays before passing them into candidate derivation
  (`code/src/core/engine/generateSchedulePreview.ts:74-84,336-347`).
- Tests verify that preview generation does not mutate input arrays
  (`code/src/core/engine/tests/generateSchedulePreview.test.ts:321`) and revision preserves original
  preview inputs (`code/src/core/engine/tests/reviseSchedulePreview.test.ts:284`).

**Finding:** The core coordinator behaves deterministically for the complete input, including
caller-supplied timestamps, and does not depend on persistence.

**Severity:** Informational. This is aligned behavior.

**Architectural Impact:** Planning workflow results can be reproduced when the complete inputs and
runtime time-zone environment are preserved.

**Recommendation:** Retain explicit clock inputs and side-effect-free core coordination in the
canonical Planning Engine.

### Partially Aligned

#### PA-01 — A Planning Engine proxy exists but coordinates an incomplete service sequence

**Architecture Reference:** Chapter VI §6.5.

**Implementation Evidence:**

- `generateSchedulePreview` invokes:
  - `generateCycleWorkBlocks`;
  - `generateBlockCandidates`;
  - `placeBlockCandidates`;
  - `detectScheduleFriction`; and
  - `generateSuggestedFixes`
  (`code/src/core/engine/generateSchedulePreview.ts:63-134`).
- No Capacity Service or Capacity Model is invoked or consumed.
- No Goal Occurrence Service or Goal Occurrence output exists.
- Invoked functions are not identified as the seven Architectural Services coordinated by the
  Planning Engine.

**Finding:** Five functional proxies approximate parts of the seven-service planning sequence.
Capacity and Goal Occurrence coordination are absent, and behavioral proxies do not establish
canonical service invocation.

**Severity:** High. The primary implemented engine workflow is materially incomplete.

**Architectural Impact:** The Planning Engine cannot coordinate all derivation capabilities or
demonstrate the published dependency chain.

**Recommendation:** Make the Planning Engine explicitly invoke all seven Derivation Services,
including Capacity and Goal Occurrence, using their canonical Domain Object contracts.

#### PA-02 — Teach-like coordination is distributed through a persistence-owning state store

**Architecture Reference:** Chapter VI §§6.4 and 6.11.

**Implementation Evidence:**

- `DayFrameStore` exposes setters for scheduling preferences, shift definitions/cycles, block
  templates/recurrences, and manual events
  (`code/src/state/types.ts:90-110`).
- Those setters directly replace state, mark preview state stale, persist to local storage, and
  notify listeners (`code/src/state/dayFrameStore.ts:50-143`).
- Profile load and backup import replace authored setup directly
  (`code/src/state/dayFrameStore.ts:174-229`).
- No Commitment, Goal, Pattern, Preference, or Constraint Authoring Service is invoked.

**Finding:** The store coordinates multiple authored-intent concerns and therefore resembles part
of a Teach workflow, but it directly mutates state and owns persistence rather than coordinating
the five Authoring Services.

**Severity:** Critical. The only Teach-like proxy violates core engine boundaries and does not
delegate to canonical services.

**Architectural Impact:** Teach workflow ownership, business capability, state mutation, and
persistence are combined in one implementation component.

**Recommendation:** Establish the Teach Engine as a pure coordinator of the five Authoring
Services; keep state mutation, persistence, and notification outside the engine.

#### PA-03 — Planning coordination and state mutation are separated only at the core/store seam

**Architecture Reference:** Chapter VI §§6.2, 6.5, and 6.11.

**Implementation Evidence:**

- Core `generateSchedulePreview` returns a value and does not access storage
  (`code/src/core/engine/generateSchedulePreview.ts:45-200`).
- `DayFrameStore.generatePreview` reads current state, builds the core input, calls the coordinator,
  and assigns the returned preview into state
  (`code/src/state/dayFrameStore.ts:232-264`).
- `applySuggestedFixToPreview` similarly calls `reviseSchedulePreview` and replaces preview state
  (`code/src/state/dayFrameStore.ts:266-300`).

**Finding:** The core planning function is separated from persistence and state mutation, which is
aligned. The executable workflow boundary nevertheless spans the store, and no explicit Planning
Engine contract separates workflow input assembly/output delivery from application state
management.

**Severity:** Medium. There is a useful separation, but engine ownership is implicit and split.

**Architectural Impact:** It is unclear whether the store or core function owns workflow
completion, input assembly, and result return.

**Recommendation:** Define an explicit Planning Engine boundary that receives workflow Domain
Objects, coordinates services, and returns the outcome; let state management call that boundary
without becoming part of the engine.

#### PA-04 — Workflow results aggregate information but omit required provenance

**Architecture Reference:** Chapter VI §§6.2 and 6.10; §6.13 invariant 5.

**Implementation Evidence:**

- `GenerateSchedulePreviewResult` aggregates work blocks, candidates, scheduled blocks, unplaced
  candidates, and friction points
  (`code/src/core/engine/generateSchedulePreview.ts:37-43`).
- Work blocks and candidates retain some local source IDs
  (`code/src/core/shifts/types.ts:19-31`;
  `code/src/core/blocks/types.ts:104-127`).
- The aggregate does not identify originating Domain Objects, participating Architectural
  Services, a coordinating Planning Engine, or transformations performed.
- `DayFramePreview` adds dates and timestamps but not architectural provenance
  (`code/src/state/types.ts:31-41`).

**Finding:** The planning proxy performs result aggregation but does not preserve the four
provenance dimensions required for an engine workflow result.

**Severity:** Critical. Provenance preservation is an explicit engine responsibility and invariant.

**Architectural Impact:** The workflow outcome cannot establish which services participated or
which engine coordinated its production.

**Recommendation:** Require every engine outcome to preserve originating Domain Objects,
participating services, coordinating engine identity, and transformations performed.

#### PA-05 — Planning revision is separately coordinated but does not begin from new authored intent

**Architecture Reference:** Chapter VI §§6.5 and 6.12; §6.13 invariant 7.

**Implementation Evidence:**

- `reviseSchedulePreview` sequences suggested-fix application, friction redetection, and suggestion
  regeneration (`code/src/core/engine/reviseSchedulePreview.ts:23-81`).
- The store invokes it with selected recommendation-like IDs and the existing preview
  (`code/src/state/dayFrameStore.ts:266-300`).
- No Teach Engine or Authoring Service is invoked and no new authored intent is produced.
- Tests verify direct revision of the preview following a selected fix
  (`code/src/core/engine/tests/reviseSchedulePreview.test.ts`;
  `code/src/state/tests/dayFrameStore.test.ts:736-881`).

**Finding:** A distinct revision workflow is coordinated, but accepted recommendations flow
directly into derived preview revision rather than through a future Teach transformation and a new
planning cycle.

**Severity:** High. Implemented engine coordination bypasses a required cross-engine boundary.

**Architectural Impact:** Planning owns behavior that should cross from advisory Plan output to
future Teach-authored intent before planning resumes.

**Recommendation:** Coordinate explicit recommendation acceptance through the future Teach Engine
to create new authored intent, then invoke a new Planning Engine workflow.

### Misaligned

#### MA-01 — Planning orchestration directly performs business logic and produces plan information

**Architecture Reference:** Chapter VI §§6.1, 6.2, 6.9, and 6.11; §6.13 invariants 2 and 3.

**Implementation Evidence:**

- `generateSchedulePreview` expands the planning window and determines overlapping visible User
  Days (`code/src/core/engine/generateSchedulePreview.ts:51-61,350-414`).
- It directly converts manual events into `DraftScheduledBlock` values
  (`code/src/core/engine/generateSchedulePreview.ts:203-255`).
- It filters work blocks, candidates, scheduled blocks, unplaced candidates, and friction points
  and directly assembles the result
  (`code/src/core/engine/generateSchedulePreview.ts:135-200`).
- `buildManualEventScheduledBlocks` assigns category, priority, status, placement, and temporal
  semantics rather than invoking a service (`:203-255`).

**Finding:** The Planning Engine proxy performs occurrence/placement conversion, visibility
business rules, and direct Domain Object-like production in addition to coordination and
aggregation.

**Severity:** Critical. Chapter VI expressly prohibits engines from business logic, replacing
services, and direct Domain Object production.

**Architectural Impact:** Service responsibilities vary with the workflow coordinator and cannot
remain conceptually independent.

**Recommendation:** Move every conversion, planning rule, and Domain Object production operation
into its designated Architectural Service. Retain only ordering, invocation, aggregation, and
workflow completion in the Planning Engine.

#### MA-02 — No implementation component has explicit Architectural Engine identity or ownership

**Architecture Reference:** Chapter VI §§6.3-6.7; §6.13 invariants 1 and 10.

**Implementation Evidence:**

- No `ArchitecturalEngine`, engine identifier, Pillar-owner contract, workflow contract, or
  four-engine registry exists under `code/src`.
- `code/src/core/engine/` contains functions named for schedule previews rather than an explicit
  Planning Engine.
- Teach-like work is in the state store, while Live and Learning have no modules.

**Finding:** Behavioral proxies do not identify themselves as one of the four engines or constrain
themselves to exactly one Pillar.

**Severity:** Critical. The four-engine orchestration model is not represented or enforceable.

**Architectural Impact:** Workflow ownership is inferred from filenames and behavior; the complete
orchestration model cannot be validated at implementation boundaries.

**Recommendation:** Represent Teach, Planning, Live, and Learning Engines explicitly, each with one
Pillar, one coordination responsibility, defined workflow inputs/outcomes, and no capability logic.

#### MA-03 — Engine communication does not occur exclusively through Domain Objects

**Architecture Reference:** Chapter VI §6.8; §6.13 invariant 4.

**Implementation Evidence:**

- `GenerateSchedulePreviewInput` accepts raw arrays of implementation-specific shift definitions,
  cycles, templates, recurrences, and manual events, plus dates and primitive preferences
  (`code/src/core/engine/generateSchedulePreview.ts:23-35`).
- `ReviseSchedulePreviewInput` accepts a generic preview result, selected string IDs, a time string,
  and timestamp (`code/src/core/engine/reviseSchedulePreview.ts:8-21`).
- `DayFrameStore.generatePreview` assembles those values from application state
  (`code/src/state/dayFrameStore.ts:232-248`).
- The corresponding canonical Domain Object/service-result contracts are absent.

**Finding:** The implemented coordinators communicate through raw arrays, primitives,
implementation DTOs, and application-state envelopes rather than exclusively through canonical
Domain Objects.

**Severity:** High. The required engine communication boundary is bypassed.

**Architectural Impact:** Engines are coupled to storage/application representations and cannot
preserve canonical ownership or forward-only stage boundaries.

**Recommendation:** Make engines receive and pass only the canonical Domain Objects produced by the
preceding stage and participating Architectural Services.

#### MA-04 — Engine responsibilities leak into state management and utility functions

**Architecture Reference:** Chapter VI §§6.2, 6.9, and 6.11.

**Implementation Evidence:**

- The store determines whether planning may start, assembles planning inputs, calls the planning
  coordinator, stores workflow metadata, and publishes completion through listener notification
  (`code/src/state/dayFrameStore.ts:232-264,303-310`).
- `reviseSchedulePreview` coordinates multiple capability functions
  (`code/src/core/engine/reviseSchedulePreview.ts:23-81`), while `applySuggestedFix` contains
  placement adjustment and response logic
  (`code/src/core/friction/applySuggestedFix.ts:15-137` and helpers).
- Teach-like coordination, persistence, and reset behavior share `createDayFrameStore`.

**Finding:** Workflow start, input assembly, coordination, completion, and cross-capability
revision are distributed between state management, engine-named functions, and friction utilities.

**Severity:** High. Workflow ownership is neither exclusive nor located wholly within canonical
engines.

**Architectural Impact:** Multiple implementation layers can redefine workflow order and
completion, producing ownership conflicts and duplicated orchestration.

**Recommendation:** Assign each complete workflow to exactly one canonical engine and keep state
management/utilities outside engine coordination responsibilities.

### Missing

#### MI-01 — Live Engine is absent

**Architecture Reference:** Chapter VI §6.6; §§6.8 and 6.12.

**Implementation Evidence:**

- No Live Engine, Execution Recording Service invocation, History Recording Service invocation, or
  recording workflow was found under `code/src`.
- State persistence stores authored setup, not observed execution or historical evidence
  (`code/src/state/dayFrameStore.ts:398-417`).
- Execution-like status literals on `DraftScheduledBlock` have no coordinating recording workflow
  (`code/src/core/blocks/types.ts:143-170`).

**Finding:** No engine coordinates the recording of observed execution.

**Severity:** Critical. One of four required engines and the complete Live workflow are absent.

**Architectural Impact:** Planning outcomes cannot progress into historical evidence, and the
Planning Engine has no legal downstream engine.

**Recommendation:** Implement the Live Engine to coordinate Execution Recording Service and History
Recording Service only, without prediction, business logic, persistence ownership, or direct
Domain Object production.

#### MI-02 — Learning Engine is absent

**Architecture Reference:** Chapter VI §6.7; §§6.8 and 6.12.

**Implementation Evidence:**

- No Learning Engine, Historical Analysis Service invocation, Trend Analysis Service invocation,
  or insight-service invocation was found under `code/src`.
- Current friction/recommendation functions consume draft planning information, not historical
  evidence (`code/src/core/friction/types.ts:47-69`).

**Finding:** No engine coordinates understanding derived from historical evidence.

**Severity:** Critical. One of four required engines and the complete Learn workflow are absent.

**Architectural Impact:** Historical evidence cannot be transformed into analysis, trends, or
Planning Insights for a future cycle.

**Recommendation:** Implement the Learning Engine to coordinate the three Analysis Services named
by the resolved normative service terminology, preserving history and containing no analysis
business logic.

#### MI-03 — Complete four-engine planning cycles are absent

**Architecture Reference:** Chapter VI §§6.3, 6.8, and 6.12; §6.13 invariants 9 and 10.

**Implementation Evidence:**

- Executable workflow ends at preview generation or direct preview revision
  (`code/src/state/dayFrameStore.ts:232-300`).
- Live and Learning Engines are absent (MI-01 and MI-02).
- No engine-to-engine Domain Object handoff or future Teach workflow exists.
- Suggested-fix selection does not produce new authored intent through Teach (PA-05).

**Finding:** The implementation cannot perform Teach → Plan → Live → Learn → Teach or successive
forward-only planning cycles.

**Severity:** Critical. The collective four-engine orchestration model and lifecycle are
incomplete.

**Architectural Impact:** There is no end-to-end workflow ownership, no legal feedback cycle, and
no preservation of historical learning into newly authored intent.

**Recommendation:** Implement all four engine workflows and their Domain Object handoffs so each
cycle proceeds forward and returns to Teach only to create new authored intent.

## Evidence

### Current orchestration paths

Authored-state path:

```text
DayFrameStore action
        ├── replace/normalize authored-like state
        ├── mark preview stale
        ├── persist state
        └── notify subscribers
```

Planning path:

```text
DayFrameStore.generatePreview
        ├── reads application state
        ├── validates presence of cycles
        └── generateSchedulePreview
                ├── derives visibility/window rules
                ├── generateCycleWorkBlocks
                ├── generateBlockCandidates
                ├── placeBlockCandidates
                ├── converts manual events directly
                ├── detectScheduleFriction
                ├── generateSuggestedFixes
                ├── filters/assembles results
                └── returns preview result
        ├── mutates store preview state
        └── notifies subscribers
```

Revision path:

```text
DayFrameStore.applySuggestedFixToPreview
        └── reviseSchedulePreview
                ├── applySuggestedFix
                ├── detectScheduleFriction
                ├── generateSuggestedFixes
                └── returns revised preview
        └── replaces store preview state
```

No executable orchestration path follows Planning with Live or Learning.

### Engine-to-service coordination matrix

| Engine | Required service coordination | Observed coordination | Result |
|---|---|---|---|
| Teach | Five Authoring Services | Direct state setters/profile/import paths; no services | Misaligned proxy |
| Planning | Seven Derivation Services | Five functional proxies; Capacity and Goal Occurrence absent | Partial proxy |
| Live | Two Recording Services | None | Missing |
| Learning | Three Analysis Services | None | Missing |

The Learning row is subject to the normative `Insight Learning Service` versus `Insight Generation
Service` naming contradiction described under Architectural Assumptions.

### Input/output and boundary assessment

| Proxy | Inputs | Outputs | Boundary assessment |
|---|---|---|---|
| Teach/store | Partial values, profiles, backup DTOs, hidden current store state and local storage | Entire state snapshots and persistence effects | Owns mutation/persistence; not Domain Object-only |
| Planning/generate | Raw authored-like arrays, date primitives, preferences, timestamp | Aggregated preview DTO | Explicit inputs and deterministic, but performs business logic and direct information production |
| Planning/revise | Existing preview DTO, selected IDs, boundary time, timestamp | Revised preview DTO and feedback | Coordinates capabilities but bypasses future Teach and directly changes derived plan |
| Live | None | None | Missing |
| Learning | None | None | Missing |

### Determinism assessment

| Engine/proxy | Hidden state | Clock/random/network | Persistence | Assessment |
|---|---|---|---|---|
| Core planning generation | None found | Timestamps explicit; no random/network | None | Deterministic for complete input |
| Core planning revision | None found | Timestamp explicit; no random/network | None | Deterministic for complete input |
| Teach/store proxy | Current mutable store state | Caller supplies most timestamps; profile ID derived from input | Reads/writes local storage | Stateful application component, not an independent deterministic engine |
| Live/Learning | Not applicable | Not applicable | Not applicable | Missing |

Core planning uses native local `Date` constructors, so the runtime time zone is an implicit
environmental input for absolute instants. Equivalent serialized inputs are not guaranteed to
produce the same absolute timestamps across different time-zone environments.

### Workflow ownership assessment

| Coordination responsibility | Current owner(s) | Ownership result |
|---|---|---|
| Teach workflow start/completion | Store setters, profile/import paths | Distributed; no engine |
| Plan workflow start/input assembly | `DayFrameStore.generatePreview` | State manager |
| Plan sequencing/aggregation | `generateSchedulePreview` | One identifiable proxy |
| Plan revision | Store, `reviseSchedulePreview`, `applySuggestedFix` | Distributed |
| Live workflow | None | Missing |
| Learn workflow | None | Missing |
| Cross-engine cycle | None | Missing |

### Chapter VI invariant matrix

| # | Invariant | Status | Primary evidence/finding |
|---:|---|---|---|
| 1 | Every Engine coordinates exactly one Pillar. | Not implemented | MA-02 |
| 2 | Engines coordinate but never implement business logic. | Violated | MA-01 |
| 3 | Engines invoke Services rather than replace them. | Violated | PA-01, PA-02, MA-01 |
| 4 | Engines communicate exclusively through Domain Objects. | Violated | MA-03 |
| 5 | Workflow coordination preserves provenance. | Violated | PA-04 |
| 6 | Historical evidence remains immutable. | Missing / not testable | MI-01 |
| 7 | Recommendations remain advisory until accepted through future Teach. | Violated after selection | PA-05 |
| 8 | Workflow evolution does not alter Service responsibilities. | Not enforceable | No canonical service/engine contracts; MA-01, MA-02 |
| 9 | Successive cycles use forward-only transformations. | Missing | MI-03 |
| 10 | Four Engines define the complete orchestration model. | Violated/incomplete | MA-02, MI-01–MI-03 |

## Recommendations

1. Represent Teach, Planning, Live, and Learning Engines explicitly, each assigned to exactly one
   Architectural Pillar and one workflow-coordination responsibility.
2. Define Domain Object-only engine inputs, inter-engine handoffs, and workflow outcomes.
3. Make Teach Engine invoke all five Authoring Services; remove state mutation, persistence,
   migration, and notification from its engine responsibility.
4. Make Planning Engine invoke all seven Derivation Services, including Capacity and Goal
   Occurrence, in the required sequence.
5. Remove manual-event conversion, visibility rules, plan filtering, and all direct Domain Object
   production from Planning Engine orchestration and assign them to their canonical Services.
6. Preserve originating Domain Objects, participating Services, coordinating Engine, and
   transformations on every workflow result.
7. Keep application state management responsible only for delivering engine inputs and storing or
   presenting outcomes; do not let it own workflow coordination.
8. Route Recommendation Proposal acceptance through a future Teach workflow that creates new
   authored intent before another Planning Engine run.
9. Implement Live Engine as the coordinator of the two Recording Services without prediction or
   persistence ownership.
10. Resolve the specification's insight-service naming contradiction, then implement Learning
    Engine as coordinator of the three canonical Analysis Services without performing analysis.
11. Implement explicit forward-only engine-to-engine handoffs and complete successive planning
    cycles.
12. Add contract tests for exact Pillar ownership, service invocation, absence of engine business
    logic, Domain Object-only communication, provenance, deterministic coordination, and complete
    cycle sequencing.
13. Make time-zone context explicit wherever required to reproduce engine outcomes across runtime
    environments.

These recommendations are implementation-alignment statements, not implementation tasks or an
implementation plan.

## Open Questions

1. Is `generateSchedulePreview` intended to become the canonical Planning Engine, or is it a
   temporary preview coordinator? Its directory and sequencing suggest the former, while its name,
   output, and embedded business logic support only partial confidence.
2. Is `createDayFrameStore` intended to host the Teach Engine, or only application state
   management? It currently combines intent updates, persistence, notification, preview lifecycle,
   and planning invocation.
3. Is `reviseSchedulePreview` intended as a Planning Engine workflow after accepted authored
   change, or as a direct manipulation of one disposable Generated Plan? No Teach handoff exists.
4. Which canonical Analysis Service must the Learning Engine coordinate: the Chapter V **Insight
   Generation Service** or Chapter VI **Insight Learning Service**?
5. What runtime time-zone context is intended to be part of a complete Planning Engine input?
6. Are engine workflow outcomes intended to be retained outside application state so their
   provenance and predecessor relationships remain available? No such boundary is implemented.

No additional open questions.

## Completion Statement

All four Architectural Engines have been evaluated exactly once in the Engine Inventory. Every
defined workflow and the complete planning cycle have been assigned in the Workflow Matrix.
Service coordination, inputs, outputs, sequencing, dependency direction, ownership, boundaries,
composition, determinism, provenance, responsibility leakage, and all ten Chapter VI invariants
have been assessed against executable evidence.

Every finding includes an architecture reference, implementation evidence, severity,
architectural impact, and an alignment-preserving recommendation. The audit contains no additional
findings beyond those reported above.
