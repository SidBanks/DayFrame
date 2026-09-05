# Task 9.4 — Planning Horizon and Review Scope Convergence V1 RESULT

## 1. Executive Result

Complete. DayFrame now has one explicit scope contract without one ambiguous “range.”

## 2. Starting Baseline

Task 9.3: schema 11, Backup V12, 118 files/1,063 tests; the cumulative dirty Phase 9 worktree was preserved.

## 3. Governing Foundations

Canonical user-days, exact accepted geometry, immutable historical publication, and DF-006 remain governing.

## 4. Scope Delivered

Typed scopes, utilities, resolver, Preview metadata, Proposal footprint coverage, explicit publication, store query, tests, and governance.

## 5. Explicit Non-Goals

No Planner UX redesign, recurrence, new preference, authority, schema, backup, or persistence store.

## 6. Temporal Scope Taxonomy

Planning data answers what must be known; Proposal what may be offered; Review what is inspected; Preview what is rendered; Publication what is frozen.

## 7. Canonical User-Day Rule

All labels resolve through existing effective cycle/segment day-boundary policy, never calendar midnight.

## 8. Range Convention

All new scopes use finite `[startUserDayDate, endUserDayDateExclusive)` ranges.

## 9. Shared Range Primitive

`CanonicalUserDayRangeV1` owns neutral geometry; discriminated wrappers own semantics.

## 10. Planning Data Horizon Definition

The bounded authoritative/derived data span required for a trustworthy operation.

## 11. Requested Planning Horizon

The caller's bounded operation range is preserved unchanged.

## 12. Effective Planning Horizon

The deterministic union of requested range and governed context.

## 13. Expansion Policy

Adjacent boundary context and exact required footprint/context ranges may widen data, never authority.

## 14. Expansion Provenance

Reasons are sorted structured values: boundary, overnight, support, Buffer, liability, realized, or publication context.

## 15. Boundedness

Validation rejects empty/reversed ranges; all expansions are finite.

## 16. Proposal Horizon Definition

The exact productive-action authority interval retained on Proposal.

## 17. Proposal Coverage Requirement

Proposal Horizon must be contained by Planning Data Horizon.

## 18. Complete Footprint Coverage

Every productive/support/Buffer claim must be covered or Proposal returns typed `incompleteInput`.

## 19. Proposal/Footprint Boundary

Productive action stays in Proposal Horizon; overhead may cross it only within complete planning coverage.

## 20. Proposal Provenance

Acceptance and realization preserve the Proposal's exact horizon; other scopes do not reinterpret it.

## 21. Review Scope Definition

A deterministic day/week/month/custom canonical-user-day inspection interval.

## 22. Review Scope Authority Boundary

Navigation performs no authoring, acceptance, realization, movement, or publication.

## 23. Review Scope Identity

Identity fingerprints kind, policy, week start, and exact bounds.

## 24. Review Scope Kind

V1 supports `day`, `week`, `month`, and `custom`.

## 25. Week Construction

Configured effective week start is respected; Monday is not assumed.

## 26. Month Construction

Calendar month labels select canonical user-days; schedule boundaries still resolve through user-day policy.

## 27. Review/Proposal Relationship

Intersection filters presentation only; proposals outside Review remain current.

## 28. Review/Accepted Relationship

Accepted authority is independent and displayed when claims intersect.

## 29. Review/Realization Relationship

Realized truth is independent and displayed by actual interval intersection.

## 30. Preview Range Definition

The requested visible canonical-user-day interval rendered by one disposable snapshot.

## 31. Review→Preview Policy

Conversion copies bounds but produces a distinct type and retains Review identity provenance.

## 32. Effective Preview Generation Context

Generation retains requested Preview Range and a wider effective Planning Data Horizon.

## 33. Preview Metadata

Snapshots carry requested range, effective horizon, optional source Review, policy, and existing generated/freshness fields.

## 34. Preview Coverage Status

Derived status is `covers`, `partiallyCovers`, or `doesNotCover`.

## 35. Coverage vs Freshness

Navigation mismatch does not set `isStale`; authoritative mutation still does.

## 36. Publication Range Definition

An explicit independently typed range frozen by a publication operation.

## 37. Publication/Review Relationship

Publication may equal, subset, or otherwise differ when authoritative coverage permits.

## 38. Publication/Preview Relationship

Preview supplies materialization coverage, not scheduling authority.

## 39. Publication Coverage

Full range coverage is required; uncovered requests fail instead of clipping.

## 40. Publication Context Expansion

Context may be loaded separately without widening immutable published labels.

## 41. Historical Scope Fidelity

Existing inclusive HistoricalPlan range fields remain the exact compatible serialized publication scope.

## 42. Planning Operation Context

`PlanningScopeContextV1` holds only the scope values relevant to an operation.

## 43. Operation Requirements

The operation matrix below is the implemented V1 contract.

## 44. Current-Date Handling

No pure scope utility implicitly reads today.

## 45. Range Utilities

Validation, containment, intersection, equality, duration, expansion, coverage, and display clipping are pure.

## 46. Range Validation

Malformed real dates, empty/reversed geometry, negative/fractional expansion, and invalid context fail closed.

## 47. Containment/Intersection

Half-open comparisons are centralized; touching ranges do not intersect.

## 48. Scope Provenance

Only real derivations—Review→Preview and legacy adapters—record derivation provenance.

## 49. Proposal Horizon Source

The existing explicit Proposal caller input remains canonical.

## 50. Review Scope Default

The current configured Preview range becomes a custom product-default Review Scope.

## 51. Persistence of Review State

Review navigation is derived/session-only and does not enter profiles or backup.

## 52. Planning Horizon Resolver

`resolvePlanningDataHorizon` returns requested/effective ranges, reasons, and the complete-coverage requirement.

## 53. Existing Expansion Audit

The engine's hidden adjacent-day expansion moved to the shared boundary-context utility with equivalent behavior.

## 54. Footprint-Aware Expansion

Exact context ranges can widen the effective horizon with support/Buffer provenance.

## 55. Insufficient Coverage Behavior

Proposal fails closed as `incompleteInput`; publication returns inconsistent context.

## 56. Accepted Liability Horizon

Unrealized accepted claims are queried independently and displayed by interval intersection.

## 57. Realized Schedule Horizon

Realized facts participate by actual interval, not originating Proposal or Review equality.

## 58. Work Horizon

Existing Work generation retains governed adjacent boundary context.

## 59. Manual Event Horizon

Existing generation receives effective context before Review presentation filtering.

## 60. Composition Horizon

Support/Buffer claims remain complete and are never clipped into Proposal bounds.

## 61. Demand Projection Horizon

Demand projection remains explicitly bounded and does not infer from Preview.

## 62. Feasibility Horizon

Existing full-footprint feasibility remains fail-closed.

## 63. Competition Horizon

Competition remains bounded to supplied feasible opportunities.

## 64. Allocation Horizon

Allocation retains its constructive input horizon, not all loaded data.

## 65. Proposal Horizon Conservation

Productive options remain within explicit Proposal Horizon.

## 66. Acceptance Independence

Review and Preview navigation do not change accepted authority.

## 67. Realization Independence

Exact accepted geometry realizes without consulting current Review Scope.

## 68. Planner Read Model

`queryPlanningReview` combines relevant truth and statuses without storing authority.

## 69. Read-Model Epistemic Classes

Scheduled reality, accepted authority, proposed action, and historical evidence stay labeled.

## 70. Scope Membership

Facts/claims use interval intersection; Proposals use horizon intersection; history uses bounded indexed range reads.

## 71. Partial Intersection

Cross-boundary records remain single full authoritative records.

## 72. Display Geometry

Read items expose separate `authoritativeInterval` and clipped `visibleInterval`.

## 73. Cross-User-Day Display

Visual slicing never duplicates or replaces semantic identity.

## 74. Coverage Model

Planning/history coverage uses `complete`, `partial`, `none`, or `unknown`.

## 75. Unknown vs Empty

Only complete coverage permits an empty result to mean no facts.

## 76. No-Proposal Semantics

Existing typed reasons remain; insufficient footprint coverage is `incompleteInput`.

## 77. Scope Freshness

Derived current scopes are recomputed from current policy; historical scope is frozen.

## 78. Day-Boundary Changes

Existing authored-change invalidation stales Preview and regenerated scope metadata.

## 79. Week-Start Changes

Week Review recomputes; Proposal, acceptance, realization, and history do not mutate.

## 80. Cycle/Segment Preference Changes

Existing canonical resolver is reused rather than duplicated.

## 81. Persistence Strategy

Only existing Proposal/history authority is durable; operational scopes remain derived.

## 82. Schema Decision

IndexedDB schema remains 11; no stores or indexes were added.

## 83. Backup Decision

Backup remains V12; no new authored/durable semantic owner exists.

## 84. Migration

Legacy inclusive Preview/Historical ranges use explicit adapters; no meanings are invented.

## 85. Historical Compatibility

HistoricalPlan V1/V2/V3 readers and immutable range behavior remain green.

## 86. Proposal Compatibility

Existing Proposal horizon bytes remain readable and unchanged.

## 87. Preview Compatibility

Metadata is optional; old snapshots adapt from their exact inclusive visible range.

## 88. Today Compatibility

Today remains unchanged and does not own planning horizon.

## 89. Month Compatibility

Month can construct a canonical month Review Scope without new UI.

## 90. Review Schedule Compatibility

The normalized read query is ready for later Review Schedule consumption.

## 91. Planner Compatibility

Future Planner can request one scope and receive coverage, facts, liabilities, proposals, Preview, and history.

## 92. Summary Boundary

Summary does not define Planning Data Horizon.

## 93. Authority Boundary

No scope type owns time or grants user authorization.

## 94. Determinism

Equivalent inputs and policy produce equivalent identity, ranges, reasons, coverage, and membership.

## 95. Date Handling

Canonical label arithmetic is reused; boundary instants use the established timezone-aware resolver.

## 96. Serialization

New serialized metadata uses version/discriminator and canonical date strings.

## 97. Validation

Public range and context inputs fail closed with structured results or range errors.

## 98. Design Decision Table

| Question                   | V1 Decision                       | Architectural Basis           | Why Sufficient Now       | Deferred Capability     |
| -------------------------- | --------------------------------- | ----------------------------- | ------------------------ | ----------------------- |
| canonical range convention | Half-open user-days               | Proposal precedent            | Removes edge ambiguity   | Other calendars         |
| shared range primitive     | Neutral V1 geometry               | Semantic separation           | Reusable pure utilities  | Nominal brands          |
| Planning Data Horizon      | Requested/effective               | Trustworthy bounded reasoning | Explains context         | Remote loading          |
| expansion policy           | Exact union + governed boundary   | DF-006/footprints             | Deterministic            | Policy registry         |
| Proposal Horizon           | Productive authority              | Task 9.2                      | Conserves authority      | Recurring proposals     |
| footprint outside Proposal | Allowed if fully covered          | Task 9.2.1                    | Keeps overhead complete  | Optimization            |
| Review Scope/default       | Non-authoritative; Preview config | Existing product              | No new preference        | View persistence        |
| week/month                 | Preferred week; canonical labels  | Existing preferences          | Planner-ready            | Full UI                 |
| Preview Range/coverage     | Typed requested range; 3 states   | Derived snapshot              | Separates stale          | Multi-preview cache     |
| Publication Range          | Explicit and fully covered        | Historical truth              | No clipping              | Standalone materializer |
| unknown vs empty           | Four-state coverage               | Epistemic integrity           | Safe V1                  | Rich diagnostics        |
| read membership/clipping   | Intersection; dual geometry       | Authority preservation        | UI-ready                 | Visual slices           |
| persistence                | Existing authority only           | Ownership                     | No accidental durability | Session restore         |
| schema / backup            | 11 / V12                          | No new durable store          | Compatible               | Evidence-driven only    |

## 99. Scope Relationship Matrix

| Relationship                    | Required Rule                                    |
| ------------------------------- | ------------------------------------------------ |
| Proposal vs Planning Data       | Proposal and complete footprint require coverage |
| Review vs Planning Data         | Review may be narrower                           |
| Review vs Proposal              | Independent; presentation filters                |
| Review vs Preview               | Deterministic requested mapping allowed          |
| Preview vs effective generation | Effective context may be wider                   |
| Publication vs Review           | Independent explicit scope                       |
| Publication vs Preview          | Preview supplies coverage, not authority         |
| realized/accepted vs Review     | Authority independent; presentation filtered     |

## 100. Operation Matrix

| Operation          | Required Scope Inputs                     | Produced Scope             | Authority Effect   |
| ------------------ | ----------------------------------------- | -------------------------- | ------------------ |
| Demand Projection  | Planning Data                             | bounded projection         | None               |
| Capacity           | Planning Data                             | capacity coverage          | None               |
| Feasibility        | Planning Data + constructive bounds       | bounded result             | None               |
| Competition        | bounded opportunities                     | competing set bounds       | None               |
| Allocation         | Planning Data + allocation bounds         | allocation bounds          | None               |
| Proposal           | Planning Data + Proposal                  | Proposal Horizon           | Proposed only      |
| Review read model  | Planning Data + Review                    | presentation membership    | None               |
| Preview generation | Planning Data + Preview (+ Review source) | effective context metadata | None               |
| Acceptance         | Proposal                                  | retained provenance        | Accepted authority |
| Realization        | accepted geometry                         | realized intervals         | Scheduled reality  |
| Publication        | Planning Data + Publication               | immutable published range  | Immutable history  |

## 101. Coverage Matrix

| State    | Meaning                        | May Treat Missing Facts as Empty? |
| -------- | ------------------------------ | --------------------------------: |
| complete | full required data available   |                               Yes |
| partial  | some required span unavailable |                                No |
| none     | no required span available     |                                No |
| unknown  | coverage cannot be established |                                No |

## 102. Persistence Matrix

| Scope                 |               Durable? | Semantic Owner             |                       Backup? | Historical? |
| --------------------- | ---------------------: | -------------------------- | ----------------------------: | ----------: |
| Planning Data Horizon |                     No | planning operation         |                            No |          No |
| Proposal Horizon      |                    Yes | Proposal authority/history |                           Yes |         Yes |
| Review Scope          |                     No | Planner/read state         |                            No |          No |
| Preview Range         | snapshot metadata only | Preview                    | existing non-durable behavior |          No |
| Publication Range     |                    Yes | HistoricalPlan/publication |                           Yes |         Yes |

## 103. Range Primitive Tests

One/multi-day, malformed, empty/reversed, containment, partial/touching, equality, expansion, duration, and typed serialization are covered.

## 104. Canonical User-Day Tests

Existing canonical boundary/overnight/cycle tests plus week/month scope construction remain green.

## 105. Planning Horizon Tests

Requested/effective bounds, deterministic reasons, boundary and footprint expansion, and coverage states are covered.

## 106. Proposal Horizon Tests

Productive authority, outside support coverage, fail-closed incomplete coverage, and provenance are covered.

## 107. Review Scope Tests

Kinds, week start, identity, membership, full identity, and display clipping are covered.

## 108. Preview Range Tests

Review mapping, metadata, wider generation context, and coverage/freshness separation are covered.

## 109. Publication Range Tests

Explicit subset publication and uncovered refusal are covered; historical immutability suites remain green.

## 110. Unknown vs Empty Tests

The review query proves unknown planning coverage and known-empty publication differ.

## 111. Existing Engine Regression

Preview, overnight Work, events, templates, placement, Friction, fixes, and realization suites pass.

## 112. Phase 8/9 Regression

Demand, Capacity, Feasibility, Competition, Allocation, Proposal, acceptance, liabilities, and Realization pass.

## 113. Persistence Regression

Schema 11, Backup V12, restore, protected authority, and compatibility suites pass.

## 114. Full Regression

Final suite: **120 test files, 1,071 tests, 0 failures**.

## 115. Validation Commands

Executed Prettier, focused/full Vitest, typecheck, lint, build, bundle governance, and `git diff --check` (final metrics below).

## 116. Bundle Discipline

No dependency or eager Planner UI was added; lightweight core utilities are shared.

## 117. Performance

Range operations are constant-time except bounded user-day duration/history reads and linear relevant-fact filtering.

## 118. Accessibility

No interactive UI changed; statuses are semantic text values suitable for accessible presentation.

## 119. Compatibility Adapters

Legacy inclusive Preview and HistoricalPlan bounds convert explicitly to half-open wrappers.

## 120. Files Delivered

Primary additions: `planningScope.ts`, `planningScopeQuery.ts`, their tests, and this RESULT; integration touches engine, Proposal, Preview/store, publication, types, and governance.

## 121. Repository Discipline

No reset, cleanup, commit, or push occurred; cumulative Phase 9 changes remain intact.

## 122. Risks and Deferred Work

Full Planner controls, persisted navigation, independent publication workflow, remote horizon loading, and richer diagnostics remain future work.

## 123. Schema and Backup Evidence

No durable format/store changed; existing constants and regression tests remain schema 11/Backup V12.

## 124. Bundle Metrics

Starting baseline: initial raw 655,722; gzip 167,447; largest lazy 53,187; total 927,513 bytes. Final: initial raw **668,337**, gzip **169,982**, largest lazy **53,188**, total **954,938** bytes. Hard limits pass; governed initial-headroom and total-architecture-review warnings remain.

## 125. Scope Relationship Verification

All ten pairwise semantic distinctions are enforced by wrappers/provenance even when geometry matches.

## 126. Authority Verification

Review, Preview, and Planning Data scopes have no mutation path; Proposal, accepted, realized, and publication owners remain unchanged.

## 127. DF-006 Verification

Canonical user-day resolution and governed adjacent boundary context preserve the closed weekend/overnight behavior.

## 128. Required Invariants

All 75 task invariants are satisfied: separately typed finite canonical scopes; half-open non-overlap; deterministic explainable expansion; full-footprint coverage without productive widening; non-authoritative Review; coverage distinct from freshness; explicit fully covered publication; immutable history; independent accepted/realized authority; bounded operation semantics; unknown not empty; full authority plus clipped display geometry; preference-aware recomputation; no accidental persistence/version bump; compatibility; determinism; no recurrence or new authority; and a reusable future Planner contract.
