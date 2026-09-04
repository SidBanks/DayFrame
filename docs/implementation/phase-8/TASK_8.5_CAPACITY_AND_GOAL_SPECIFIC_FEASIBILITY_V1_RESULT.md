# Task 8.5 — Capacity V1 and Goal-Specific Feasibility V1 Result

**Status:** Complete  
**Date:** 2026-09-04

## 1. Executive Result

Capacity V1 and one-Demand Goal-Specific Feasibility V1 are implemented as deterministic, non-authoritative read models. Phase 8 foundation semantics are complete.

## 2. Scope Delivered

Delivered canonical interval derivation, qualifications, liabilities, provenance, summaries, public query APIs, bounded opportunity enumeration, tests, lazy bundle architecture, and governance.

## 3. Governing Evidence

The Capacity specification/audit, Goal Demand/Allocation specification, Composition specification, post-Phase-7 strategy/roadmap, and Tasks 8.1–8.4 results governed implementation.

## 4. Task 8.1 Foundation Reuse

Capacity and Feasibility use versioned policies, deterministic fingerprints, derived provenance, exact coverage, and structured qualification semantics.

## 5. Task 8.2 Structural Eligibility Boundary

Feasibility consumes the structural state already frozen into Demand Projection; it does not rerun Goal Structure.

## 6. Task 8.3 Demand Projection Integration

Exactly one projected Demand supplies effort, horizon, session shape, satisfaction, cadence, applicability, and structural eligibility.

## 7. Task 8.4 Composition Integration

Attached scheduled blocks are ordinary occupied time, effective Buffers are protected time, and Composite Liability qualifies affected Capacity. Pairing is not rerun.

## 8. Existing Scheduling Read-Model Assessment

Fresh Preview is the current resolved schedule boundary. Capacity reads it without mutating placement, decisions, Friction, publication, or execution.

## 9. Files Added

Added `capacity.ts`, `goalFeasibility.ts`, their fingerprint helper and focused tests, plus lazy/eager Capacity query surfaces and this result.

## 10. Files Modified

Modified Preview result typing, composition post-processing retention, store/query typing and composition, tests/governance, `CURRENT_STATE.md`, and `CHANGELOG.md`.

## 11. Capacity Definition

Capacity is the explainable set of user-day-owned discretionary openings after authorized occupied/protected time and conservative liability qualification.

## 12. Capacity Policy

`capacity` version 1 governs half-open arithmetic, identity, qualification, provenance, and aggregation without Goal-specific semantics.

## 13. Capacity Query Scope

Queries accept one day or a half-open bounded user-day-label range and report requested and actually covered instants.

## 14. Canonical Capacity Unit

The unit is one positive-duration interval contained by exactly one resolved canonical user-day.

## 15. Capacity Identity

IDs hash policy, owning day/window, exact bounds, and dependency fingerprint; never array position, Goal, UI order, or random IDs.

## 16. User-Day Ownership

Existing piecewise resolver semantics define boundaries. Touching openings across a boundary remain distinct, including variable-duration days.

## 17. Occupied-Time Sources

Generated Work and scheduled template/manual blocks—including attached support activity and accepted decision outcomes—contribute exact occupied intervals.

## 18. Protected-Time Sources

Effective scheduled before/after Buffers contribute separate protected intervals with owner provenance and no execution identity.

## 19. Interval Union / Complement

All exclusions use `[start,end)`, overlap is unioned once while retaining contributors, and each day’s Capacity is the complement inside covered bounds.

## 20. Composition Footprint Integration

Normalized attached blocks and effective Buffers are consumed once. Composite envelopes or duplicate footprint intervals are never subtracted.

## 21. Composite Liability Integration

Required unresolved composition obligations become scoped `compositeCommitment` liabilities and qualify the owning day’s openings.

## 22. Ordinary Commitment Liability Integration

Unplaced candidates become conservative full-user-day liabilities because V1 lacks a safer public eligible-window contract. Their minutes remain separately reported.

## 23. General Availability Policy Decision

Decision B applies: no explicit general discretionary availability authority exists. V1 uses governed `neutral-geometric-openings` version 1 and infers no off-day philosophy.

## 24. Capacity Qualification Model

Orthogonal dimensions are freshness, coverage, integrity, liability, and allocability.

## 25. Freshness

Fresh Preview yields `current`; stale Preview yields `stale`, and no stale interval contributes to fully allocatable totals.

## 26. Coverage

Exact windows yield complete coverage; clipping yields partial coverage; absent/non-overlapping Preview is unavailable through the query surface.

## 27. Integrity

Valid current input is `valid`; protected store authority returns unavailable rather than zero. The contract retains protected/invalid states for later producers.

## 28. Liability

Results explicitly distinguish resolved from unresolved liability and retain every liability’s kind, scope, duration, reason, and source reference.

## 29. Allocability

Clean current complete openings are allocatable; liability/partial openings are qualified; stale aggregate truth is non-allocatable.

## 30. Zero vs Unavailable

A fully occupied valid day yields zero intervals. Missing Preview, outside coverage, or protected authority returns unavailable instead.

## 31. Capacity Reasons

Structured reasons cover ordinary/composite liability, incomplete coverage, stale dependency, invalid input, protected authority, and unavailable user-day resolution.

## 32. Capacity Provenance

Intervals retain inclusion policy, dependency fingerprint, day window, and adjacent occupied/protected contributors explaining their boundaries.

## 33. Dependency Fingerprint

The fingerprint includes policy, neutral availability, exact range/windows, normalized schedule exclusions, liabilities, coverage, and staleness—not Goal or Priority.

## 34. Capacity Read Model

The result exposes query, qualification, component days, canonical intervals, exclusions, liabilities, summaries, fingerprints, and derived provenance.

## 35. Capacity Aggregation

Totals, allocatable/qualified minutes, longest interval, count, liability minutes, and per-day totals derive from canonical intervals without merging days.

## 36. Persistence Decision

Capacity and Feasibility are recomputed and disposable; neither is persisted or authored.

## 37. Backup / Schema Decision

No new authority exists. IndexedDB remains schema 9 and Backup V9 remains canonical.

## 38. Profile Compatibility

Profiles remain authored setup snapshots and contain no derived Capacity or Feasibility.

## 39. Runtime / Cache Behavior

V1 derives on query and uses no cache, preventing stale-cache ambiguity.

## 40. Store / Query Surface

The store lazily exposes range/day Capacity queries and one-demand Feasibility evaluation. `resolveCapacityInterval` provides semantic-ID lookup within a result.

## 41. Goal-Specific Feasibility Definition

Feasibility is deterministic compatibility of one Demand Projection with fully allocatable Capacity over an exact horizon.

## 42. Feasibility Policy

`goal-specific-feasibility` version 1 governs legal slices, satisfaction, ordering, and the 64-set enumeration bound.

## 43. Capacity → Feasibility Contract

The evaluator receives only `CapacityResultV1`; it cannot inspect Work, recurrence, Buffer, Composition, decision, or scheduler internals.

## 44. Demand Projection Consumption

The evaluator receives projected semantics, never raw Demand storage and never Goal Priority.

## 45. Structural Eligibility

Ineligible, unknown, and conditional states remain distinct from temporal incompatibility.

## 46. Horizon / Coverage Compatibility

User-day labels and exact start/end instants must match, and Capacity coverage must be complete; otherwise evaluation is `unavailableCoverage`.

## 47. Indivisible Demand

One fully allocatable contiguous interval must contain the exact requested session; fragmented totals cannot satisfy it.

## 48. Splittable Demand

Deterministic slices may span intervals only when the projected session mode permits splitting.

## 49. Minimum Useful Session

Every splittable slice meets the authored minimum; unusably small fragments are skipped.

## 50. Maximum / Preferred Session

Maximum duration caps slices. Matching preferred duration adds a non-binding annotation and never changes hard compatibility.

## 51. Minimum / Target / Optional

Full requested effort is full. Partial sets exist only when target/optional Demand explicitly allows them and meets its minimum.

## 52. Session Count / Cadence Disposition

V1 enforces the represented exact session count without converting it into recurrence or choosing dates beyond Capacity slices.

## 53. Feasible Opportunity

Each derived slice references exact bounds, user-day, Capacity interval/fingerprint, Demand projection, compatibility, and optional preference annotation.

## 54. Opportunity Set

A set reports deterministic identity, slices, total, session count, full/permitted-partial satisfaction, and unmet minutes.

## 55. Enumeration Strategy

Sorted intervals are scanned from deterministic rotating starts, greedily bounded by requested/min/max/count constraints, deduplicated, sorted, and capped at 64.

## 56. Partial Satisfaction

Unauthorized partial fits are infeasible; authorized partial fits remain `partiallyFeasible` with explicit unmet effort.

## 57. Feasibility States

States distinguish feasible, partial, infeasible, structurally ineligible, conditionally eligible, unknown, stale, and unavailable coverage.

## 58. Feasibility Reasons

Reasons distinguish total versus contiguous shortage, count mismatch, structural state, stale/unavailable Capacity, coverage, liability, and inapplicable Demand.

## 59. Priority Boundary

Goal Priority is absent from both Capacity and single-Demand Feasibility dependencies; changing it has no semantic effect.

## 60. Competition Boundary

Separate Goals may reference the same Capacity interval. No conflict graph, fairness, ranking, or cross-Goal comparison exists.

## 61. Allocation Boundary

Opportunity slices reserve nothing and assign nothing. No provisional or accepted Allocation was implemented.

## 62. Proposal Boundary

Exact compatibility bounds are not recommendations. No Proposal, ranking, acceptance, or scheduled Goal work exists.

## 63. Friction Boundary

Infeasible Demand creates no Friction. Existing corrective Commitment/Composition Friction remains an upstream schedule fact.

## 64. Scheduling Non-Interference

Queries clone/derive from Preview truth and perform no mutations, decisions, placement, persistence, notifications, publication, or execution changes.

## 65. Historical Provenance Seam

Stable query/interval/opportunity IDs, bounds, qualifications, policies, liabilities, and fingerprints can be frozen later by Proposal/acceptance history; none is persisted now.

## 66. Summary Boundary

No UI Summary integration was added. Typed summaries keep current, qualified, feasible, allocated, scheduled, and executed semantics separable.

## 67. Tests Added

Added focused Capacity geometry/qualification/determinism tests, Feasibility constraint/state/non-mutation tests, and query-surface unavailable/protected tests.

## 68. Capacity Geometry Tests

Tests cover empty full-day Capacity, occupied/Buffer overlap union, canonical boundary splitting, and topology-derived totals.

## 69. Liability Tests

Unplaced ordinary liability is visible, preserves demanded minutes, qualifies openings, and contributes zero clean allocatable minutes.

## 70. Qualification Tests

Tests distinguish current/complete/valid/clean results from stale, clipped, qualified, and unavailable states.

## 71. Feasibility Tests

Tests cover indivisible contiguity, splittable min/max behavior, permitted partial satisfaction, structural states, stale Capacity, coverage, and shared opportunities.

## 72. Determinism Tests

Equivalent Capacity and Feasibility inputs produce equal results and IDs; neither schedule input nor Capacity objects mutate.

## 73. Scheduling Regressions

The complete scheduling, Preview, Friction, publication, execution, Progress, Goal, Composition, and DF-006 regression corpus remains green.

## 74. Full Regression Result

Final full-suite counts and gate evidence are recorded in Section 75 after validation.

## 75. Validation Commands

Focused Vitest, full `npm test`, Prettier, typecheck, lint, build, bundle policy, and `git diff --check` were run. Final counts: 110 test files and 1,025 tests, all passing.

## 76. Bundle Architecture Review

Capacity, Feasibility, and query composition are lazy chunks. Initial production JavaScript is 671,522 raw / 169,915 gzip bytes; largest lazy is 53,187 bytes; total is 854,356 bytes. Hard limits pass. Initial-headroom and total architecture-review warnings remain; no new eager UI/domain framework was accepted.

## 77. Performance Notes

Capacity uses sorted interval union and per-day complement. Feasibility is deterministically capped at 64 alternatives with early constraint pruning; no generic optimizer exists.

## 78. Accessibility Notes

No UI was added or changed, so no new interactive accessibility surface exists.

## 79. Compatibility Notes

Scheduling output changes only by retaining non-empty composition read results for downstream query consumption. Empty composition remains byte-equivalent; backups and schema are unchanged.

## 80. DF-006 Relationship

Capacity uses canonical piecewise user-day windows and exact Work occurrences, not weekday labels, calendar-midnight assumptions, or reconstructed first/last-Work heuristics.

## 81. V1 Design Decision Table

| Question            | V1 Decision                        | Architectural Basis   | Why Sufficient Now         | Deferred Capability     |
| ------------------- | ---------------------------------- | --------------------- | -------------------------- | ----------------------- |
| Capacity host       | lazy derived query                 | disposable truth      | protects bundle/state      | worker/cache            |
| policy version      | `capacity` V1                      | governed derivation   | stable meaning             | later policies          |
| query scopes        | day/range                          | canonical horizon     | required V1                | month presentation      |
| interval identity   | semantic hash                      | deterministic         | referenceable              | frozen acceptance       |
| user-day ownership  | exactly one window                 | canonical time        | prevents merging           | none                    |
| occupied sources    | Preview activity                   | resolved truth        | decision-aware             | other calendars         |
| protected sources   | effective Buffers                  | explicit authority    | preserves semantics        | availability windows    |
| ordinary liability  | full candidate day                 | conservative scope    | no false clean time        | narrower public windows |
| Composite Liability | owning-day qualification           | Task 8.4 contract     | future cost protected      | Capacity claims         |
| availability        | neutral V1                         | no existing authority | no inference               | authored policy         |
| qualifications      | orthogonal fields                  | epistemic integrity   | avoids giant enum          | richer reasons          |
| provenance          | dependencies + adjacent exclusions | explainability        | downstream seam            | full graph UI           |
| persistence/cache   | none                               | derived/disposable    | stale-safe                 | memoization             |
| summaries           | topology-derived                   | intervals canonical   | bounded diagnostics        | fragmentation score     |
| Feasibility policy  | V1 / max 64 sets                   | bounded deterministic | personal scale             | optimizer               |
| indivisible         | one contiguous slice               | Demand contract       | exact                      | none                    |
| splittable          | legal fragments                    | Demand contract       | exact V1                   | timing rules            |
| preferred duration  | annotation                         | non-hard preference   | no false exclusion         | ranking                 |
| maximum duration    | slice cap                          | hard session bound    | exact                      | variable shapes         |
| session count       | exact set count                    | represented cadence   | deterministic              | recurrence              |
| partial             | explicit minimum only              | authored semantics    | no inferred success        | utility scoring         |
| enumeration         | rotating greedy, 64                | bounded V1            | deterministic alternatives | optimization            |
| preferences         | preferred duration only            | Task 8.3 support      | no invented rules          | time/day preferences    |
| UI                  | none                               | task boundary         | domain/API complete        | inspection surface      |

## 82. Boundary Matrix

| Concept                             | Status   | Authored / Derived   | Owns Time?         | Changes Scheduling? |
| ----------------------------------- | -------- | -------------------- | ------------------ | ------------------- |
| Commitment                          | Existing | Authored → scheduled | Yes                | Yes                 |
| Attachment / Buffer                 | Existing | Authored constraint  | No / protects      | Via composition     |
| Composite Liability                 | Existing | Derived obligation   | No duplicate       | Corrective only     |
| Demand / Priority                   | Existing | Authored             | No                 | No                  |
| Demand Projection                   | Existing | Derived              | No                 | No                  |
| Capacity / interval                 | New      | Derived              | No                 | No                  |
| Feasibility / opportunity           | New      | Derived              | No                 | No                  |
| Competition / Allocation / Proposal | Future   | Derived/proposed     | No                 | No                  |
| Accepted Allocation / Goal work     | Future   | Accepted/scheduled   | Future claim / yes | Future              |
| Progress                            | Existing | Observation/derived  | No                 | No automatic effect |

## 83. Invariant Verification

Capacity is demand-neutral, derived, topology-first, one-user-day-owned, non-midnight-assuming, overlap-unioned, Buffer/activity-distinct, composition-aware without double count, liability-conservative, zero/unavailable-distinct, qualification-safe, Priority-independent, non-ranking, non-recommending, non-mutating, and deterministic. Feasibility evaluates one projection through Capacity only; preserves structural state; cannot sum fragments for indivisible Demand; splits only when allowed; honors minimum/max/count/partial rules; never mutates Capacity, reserves time, allocates, proposes, creates Friction, or schedules; and is deterministic.

## 84. Implementation Decisions

Neutral availability was selected; Preview is the resolved schedule input; ordinary unplaced scope is conservatively one owning day; composition read results are retained only when non-empty; opportunities use earliest deterministic sub-slices; enumeration is capped at 64.

## 85. Deviations

No authored availability policy or persistent cache was needed. Integrity-invalid Capacity has a representable contract, while current public production paths return protected/unavailable before derivation. No broad Summary UI was added.

## 86. Architecture Reopen Check

No contradiction requires reopen. Existing canonical windows, Preview truth, Composition results, and Demand Projection provide sufficient bounded public contracts.

## 87. Governance Updates

`CURRENT_STATE.md` and `CHANGELOG.md` record the derived-resource boundary, Phase 8 completion, non-authority decisions, and bundle review.

## 88. Repository Status

Changes remain uncommitted. Existing Task 8.1–8.4 and unrelated user work were preserved.

## 89. Completion Assessment

The roadmap statement “User can inspect whether structured Goal demand fits actual Capacity” is technically true through domain/query APIs, with broad UI intentionally deferred.

## 90. Recommended Next Task

**Task 9.1 — Competing Demand and Allocation V1**, consuming Capacity, Feasibility, Priority, Demand Projection, and explicit Allocation Policy without scheduling work.

## 91. Completion Statement

**Task 8.5 — Capacity V1 and Goal-Specific Feasibility V1 complete.**

DayFrame now derives canonical demand-neutral Capacity as deterministic, explainable user-day-owned interval truth downstream of current authorized scheduling, attached support activity, protected Buffer, accepted decisions, and unresolved liability. Goal-Specific Feasibility evaluates exactly one Demand Projection against that contract without mutating Capacity, comparing Goals, consuming Priority, allocating resources, proposing action, creating Friction, or scheduling work. Capacity and Feasibility remain derived and unpersisted; all required gates pass; Phase 8 foundation semantics are complete; and the repository is ready for bounded Phase 9 competing-demand and Allocation work without reopening accepted architecture.
