# Task 8.3 — Goal Demand Intent, Goal Priority, and Demand Projection V1 Result

## 1. Executive Result

Complete. DayFrame now has durable revisioned Demand and Priority authority and a pure,
deterministic Demand Projection contract, with no scheduling or allocation effect.

## 2. Scope Delivered

Delivered the bounded non-UI domain, state, persistence, restore, backup, migration,
history, projection, and regression slice required by Task 8.3.

## 3. Governing Evidence Used

Implementation followed the Goal Demand/Allocation specification, post-Phase-7
synthesis, alignment strategy and roadmap, and the Task 8.1 and 8.2 results.

## 4. Task 8.1 Foundation Reuse

Opaque planning IDs, positive revisions, provenance, dependency fingerprints,
freshness, canonical coverage, and typed reasons reuse Task 8.1 primitives.

## 5. Task 8.2 Goal Structure Reuse

Projection consumes `queryStructuralEligibility`; it neither copies nor reimplements
Goal Structure graph semantics.

## 6. Existing Goal Model Assessment

Goal remains outcome identity/lifecycle authority. No Demand or Priority fields were
added to Goal records, and Goal existence creates neither authority.

## 7. Files Added

- `core/planning/goalDemand.ts`, `goalDemandProjection.ts`, and their tests
- `state/goalPlanningSurface.ts`, `goalDemandProjectionQuery.ts`, and surface/boundary tests
- `state/dayFrameBackupV8.ts` and V8 integration tests
- this result artifact

## 8. Files Modified

Store/types, IndexedDB schema, restore staging/coordinator/participants/composition/
translation, runtime/notification registries, full-clear/test helpers, backup export
UI expectation, planning provenance origin validation, and governance documents were
extended for the new authority.

## 9. Demand Identity Model

Each Demand lifetime has an opaque `PlanningFactId`; creation starts at revision 1,
semantic changes append monotonically, and multiple lifetimes may reference one Goal.

## 10. Demand Lifecycle

V1 distinguishes `active`, `suspended`, `expired`, `completed`, and `retired`.
Non-active Demand projects as inapplicable; completion asserts no Progress.

## 11. Demand V1 Dimension Set

V1 records minute effort, bounded user-day horizon, session shape, explicit
satisfaction semantics, and total/session-count cadence.

## 12. Requested Effort Semantics

Effort is an explicit positive integer number of minutes. Projection copies it exactly
and never infers it from Goals, Progress, Commitments, execution, or dates.

## 13. Horizon Model

An exact half-open local-date interval resolves through canonical user-day semantics
to start/end instants and both boundary-time values.

## 14. Session Shape / Splittability

Indivisible Demand requires an exact session equal to total effort. Splittable Demand
requires a minimum and may declare coherent preferred and maximum durations.

## 15. Cadence / Count Semantics

`total` and bounded `sessionCount` are represented. Count constrains intent but creates
no recurrence pattern or dated session.

## 16. Minimum / Target / Optional Semantics

Minimum never permits partial satisfaction. Target/optional permit it only through an
explicit positive minimum-satisfied threshold.

## 17. Hard Constraint / Preference Boundary

Timing hard constraints and timing preferences are explicitly deferred; V1 does not
approximate them through session or horizon fields.

## 18. Goal Priority Model

Priority is separate authored authority with stable order `low < normal < high <
critical`, independent ID/revision/history, and no effect on Projection or scheduling.

## 19. Goal Priority Scope

V1 supports one applicable default plus non-overlapping half-open bounded overrides.
A bounded override takes precedence for a date; conflicting same-scope authority fails.

## 20. Structural Eligibility Integration

Eligible, conditionally eligible, ineligible, and unknown remain distinct in
Projection. Exact eligibility dependencies and reasons are retained.

## 21. Demand Projection Model

Projection identifies exact Demand/Goal revisions, policy, canonical coverage,
normalized intent, structural state, applicability, reasons, dependencies, fingerprint,
and derived provenance.

## 22. Projection Policy

Policy is explicitly `{ id: "goal-demand-projection", version: 1 }`; it normalizes and
explains authority only, without Capacity, urgency, ranking, or scheduling logic.

## 23. Provenance / Dependency Integration

Authored records use direct-authoring provenance. Projection uses derived-artifact
provenance and exact Demand, Goal, relationship, and Milestone dependencies.

## 24. Freshness / Reason Integration

Canonical dependency fingerprints produce Current/Stale/Unknown freshness. Relevant
revision changes stale evidence; unrelated authority is absent from the dependency set.

## 25. Progress Boundary

Demand satisfaction, scheduled/executed effort, and Goal Progress remain separate.
No Progress observation is read, inferred, created, or mutated.

## 26. Existing Commitment Attribution Disposition

Explicit Demand-satisfaction attribution is deferred. Existing Goal links, titles,
categories, and schedule blocks are not reinterpreted.

## 27. Persistence Model

One sibling mixed-record `goalPlanning` IndexedDB authority stores complete authored
Demand and Priority history. Projection remains disposable and is not persisted.

## 28. Migration

Database schema advances to version 8. Older database and backup state receives the
explicit empty `{ version: 1, demands: [], priorities: [] }` authority without inference.

## 29. Backup Integration

Backup V8 includes complete Goal planning authority and validates Goal references.
V7 import migrates empty; V7 export refuses when it would lose Demand/Priority facts.

## 30. Profile Compatibility

Profile save/load remains limited to authored setup. It does not create, replace,
infer, or delete Goal planning authority.

## 31. Store Actions

The store exposes create/revise/lifecycle Demand actions, create/revise/retire Priority
actions, current and exact-history queries, projection, persistence retry, and recovery.

## 32. Mutation Atomicity

Commands validate the complete candidate authority before one durable replacement.
Invalid candidates and persistence failures do not publish partial accepted state.

## 33. Revision History

Semantic changes append exactly one revision; no-ops do not. Validators require
contiguous histories and reject duplicate `(ID, revision)` facts.

## 34. Retirement / Historical Resolution

Retirement appends terminal history and never reuses identity. Exact missing revisions
return `notFound` rather than aliasing current state.

## 35. Query Boundary

Current Demand, applicable Priority, exact revisions, and Demand Projection are explicit
queries. The projection query is lazy-loaded to preserve eager bundle headroom.

## 36. Scheduling Boundary

Byte-for-byte tests prove identical generated schedules before and after Demand,
Priority, and projection evaluation.

## 37. Capacity / Feasibility Boundary

Neither Capacity nor Goal-Specific Feasibility exists in this implementation.
Structural eligibility is not treated as time feasibility.

## 38. Allocation Boundary

No Competing Demand, Allocation Policy, allocation decision, or capacity claim exists.

## 39. Proposal / Acceptance Boundary

No Proposal, user acceptance, Accepted Allocation, or Scheduled Goal Work was added.

## 40. Friction Boundary

Unmet, inactive, or structurally ineligible Demand creates no Friction. Existing
Friction output remains byte-identical in the boundary test.

## 41. Tests Added

Ten focused tests cover authority validation, priority applicability, deterministic
projection/freshness, revision/no-op/lifecycle/history, persistence/protection, Backup
V8/migration, and scheduling/Friction non-interference.

## 42. Persistence / Backup Tests

Tests cover restart history, invalid stored authority protection, exact V8 round-trip,
V7-empty migration, lossy V7 export refusal, malformed backup rejection, and restore.

## 43. Scheduling Regressions

The new scheduling-boundary suite passes alongside existing Preview, publication,
execution, Month, Today, Summary, Friction, and DF-006 regressions.

## 44. Full Regression Results

`104` test files and `1,003` tests passed; `0` failed and no accepted baseline behavior
was intentionally changed.

## 45. Validation Commands / Results

- `npx prettier --check .` — pass
- `npm test -- --reporter=dot` — 104 files / 1,003 tests pass
- `npm run typecheck` — pass
- `npm run lint` — pass
- `npm run build` — pass
- `npm run check:bundle` — hard policy pass, warning findings recorded

## 46. Bundle Result

Initial raw: `677,971`; initial gzip: `169,985`; largest lazy: `53,187`; total:
`807,972` bytes. Against Task 8.2 this is +18,389 raw, +3,239 gzip, -1 largest lazy,
and +22,770 total. Initial headroom and total-growth warnings remain; all hard limits
and the 825,000-byte architecture-review threshold pass.

## 47. Performance Notes

No UI was added. Projection and its canonical-window query adapter plus Backup V8 codec
are lazy chunks; queries remain bounded personal-scale operations.

## 48. Compatibility Notes

Older formats retain their historical semantics, older imports acquire empty authority,
and V8 preserves exact new facts. Existing Goal identity and links are unchanged.

## 49. DF-006 Relationship

No Work, Month, cycle, or historical-publication semantics changed. Existing DF-006
protections remain green.

## 50. V1 Design Decision Table

### Boundary Matrix

| Concept             | Implemented in 8.3? | Authored / Derived             |              Owns Time? | May Affect Scheduling Now? |
| ------------------- | ------------------: | ------------------------------ | ----------------------: | -------------------------: |
| Goal                |            Existing | Authored                       |                      No |                         No |
| Goal Structure      |            Existing | Authored + derived eligibility |                      No |                         No |
| Demand Intent       |                 Yes | Authored                       |                      No |                         No |
| Goal Priority       |                 Yes | Authored planning authority    |                      No |                         No |
| Demand Projection   |                 Yes | Derived                        |                      No |                         No |
| Capacity            |                  No | Derived future                 |                      No |                         No |
| Feasibility         |                  No | Derived future                 |                      No |                         No |
| Competing Demand    |                  No | Derived future                 |                      No |                         No |
| Allocation          |                  No | Derived future                 |                      No |                         No |
| Proposal            |                  No | Proposed future                |                      No |                         No |
| Accepted Allocation |                  No | Accepted future                | Authorizes future claim |                         No |
| Scheduled Goal Work |                  No | Future scheduled reality       |                     Yes |                        N/A |
| Progress            |            Existing | Observation/derived outcome    |                      No |        No automatic effect |

Invariant verification: Goal existence produces no Demand; Demand requests resources
without owning time; Projection traces to exact authorized Demand and policy and invents
no effort; authored/derived facts remain separate; Goal Priority is not Commitment
priority or inferred pressure; structural eligibility is not feasibility; evaluation
does not mutate scheduling; session count creates no recurrence; Goal links establish
no satisfaction; satisfaction and Progress remain distinct; unmet Demand creates no
Friction; no unaccepted work becomes scheduled reality; exact histories remain
resolvable; Projection is deterministic and stale-aware; older state gains no invented
authority.

| Question                            | V1 Decision                                          | Architectural Basis               | Why Sufficient Now                                                | Deferred Capability                      |
| ----------------------------------- | ---------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| effort unit(s)                      | Implemented: minutes                                 | explicit normalized request       | matches current scheduling duration vocabulary without scheduling | other resources/units                    |
| horizon forms                       | Implemented: bounded user-day interval               | exact canonical coverage          | deterministic future evaluator input                              | rolling/open/calendar-display horizons   |
| session shape                       | Implemented: exact indivisible or bounded splittable | preserve contiguity               | prevents total-only equivalence                                   | richer shapes                            |
| splittability                       | Implemented explicitly                               | authored constraint               | sufficient for later feasibility                                  | fragment-placement policy                |
| cadence/count                       | Represented, not consumed: total/session count       | repeated Demand is not recurrence | preserves count requirement                                       | advanced cadence                         |
| minimum/target/optional             | Implemented                                          | accepted satisfaction distinction | prevents implicit partial satisfaction                            | allocation accounting                    |
| timing hard constraints             | Explicitly deferred                                  | no silent approximation           | not needed for coherent projection                                | work-relative/windows                    |
| timing preferences                  | Explicitly deferred                                  | hardness must be explicit         | avoids ambiguous field                                            | preference vocabulary                    |
| Goal Priority levels                | Implemented: four ordered labels                     | small total order                 | stable future ranking input                                       | pairwise/numeric policies                |
| Priority scope                      | Implemented: default + bounded override              | horizon-capable authority         | current and future-bounded applicability                          | complex policy calendars                 |
| Progress relationship               | Explicitly deferred                                  | strict semantic separation        | coherent V1 needs no inference                                    | explicit versioned policy                |
| Commitment satisfaction attribution | Explicitly deferred                                  | Goal link is insufficient         | avoids implicit/double accounting                                 | exact attribution authority              |
| Projection policy                   | Implemented: versioned normalization/eligibility     | derived disposable truth          | complete future feasibility input contract                        | pressure/feasibility/allocation policies |

## 51. Implementation Decisions

Demand and Priority share a strictly discriminated sibling collection; projection is
pure and disposable; bounded Priority overrides beat defaults; V8 is the first backup
format containing the authority; projection code is a lazy non-UI boundary.

## 52. Deviations

No semantic deviation. Timing constraints/preferences, advanced cadence, Progress
response, and Commitment satisfaction attribution are deliberately deferred as allowed.

## 53. Architecture Reopen Check

No. Implementation evidence revealed no contradiction with accepted architecture.

## 54. Governance Updates

`CURRENT_STATE.md` and `CHANGELOG.md` record Task 8.3. No new durable architectural
decision required a `DECISIONS.md` entry, and accepted specifications were not rewritten.

## 55. Repository Status

Task 8.3 changes remain uncommitted and unpushed. Existing Task 8.1/8.2 work and the
pre-existing corrected Goal Demand specification filename were preserved.

## 56. Completion Assessment

All 34 completion criteria are satisfied: authority, exact history, projection,
cross-domain persistence, non-interference, compatibility, documentation, and gates.

## 57. Recommended Next Task

Proceed to the bounded Phase 8 Commitment Composition increment before Capacity, so a
future Capacity model can account for complete support and Buffer footprint.

## 58. Completion Statement

**Task 8.3 — Goal Demand Intent, Goal Priority, and Demand Projection V1 complete.**

DayFrame now has first-class revisioned Goal Demand Intent and independent Goal
Priority authority built on the Phase 8 planning provenance/freshness foundation and
existing Goal Structure authority; Demand represents explicit user-authorized
resource-seeking intent without owning time, Priority represents separate planning
importance without becoming Commitment priority or allocation policy, and Demand
Projection deterministically interprets exact Demand authority over bounded canonical
user-day horizons with explicit provenance, dependencies, structural eligibility,
freshness, reasons, and coverage; exact Demand and Priority history remains resolvable;
persistence, migration, Backup V8, restore, full-clear, and compatibility behavior
preserve authority without inventing it for older state; Goal links, scheduled effort,
execution, and Progress remain semantically distinct from Demand satisfaction; unmet
or structurally ineligible Demand creates no Friction; Goal Demand, Goal Priority, and
Projection have no scheduling effect; Capacity, Goal-Specific Feasibility, Competing
Demand, Allocation, Proposal, Accepted Allocation, and Scheduled Goal Work remain
outside this task; existing deterministic scheduling and historical behavior remain
intact; and the repository is ready for the next bounded Phase 8 Commitment
Composition increment without reopening accepted architecture.
