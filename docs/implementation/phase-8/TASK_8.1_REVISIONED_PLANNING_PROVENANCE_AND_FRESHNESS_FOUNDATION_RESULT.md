# Task 8.1 — Revisioned Planning Provenance and Freshness Foundation Result

## 1. Executive Result

Task 8.1 is complete. DayFrame now has a bounded shared planning substrate and a thin internal Goal-relationship evidence slice proving revision, dependency, freshness, coverage, provenance, qualification, reason, migration, and exact-history behavior. Existing scheduling and user-facing behavior are unchanged.

## 2. Scope Delivered

Delivered shared planning types and validators, deterministic dependency fingerprints, freshness evaluation, explicit user-day coverage, structured reasons, a revisioned relationship fact, derived evidence, exact revision lookup, and additive legacy-to-empty snapshot migration. Full Goal Structure and all later Phase 8 domains remain out of scope.

## 3. Governing Evidence Used

Inspected exact repository sources: `docs/architecture/POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`, `docs/architecture/POST_PHASE_7_IMPLEMENTATION_ALIGNMENT_STRATEGY_RESULT.md`, `docs/roadmap/POST_PHASE_7_IMPLEMENTATION_ROADMAP_RESULT.md`, the Capacity, Goal Structure, Goal Demand/Allocation, Commitment Composition, and Constructive Proposal specification results, `CURRENT_STATE.md`, `CHANGELOG.md`, `DECISIONS.md`, and current Goal, measurement, Preview, publication, decision, restore, persistence, and Backup V6 code/tests.

## 4. Existing Primitive Assessment

- Reused unchanged: cryptographic UUID-v4 allocation convention, positive monotonic numeric revisions, canonical `semanticFingerprint`, canonical user-day concepts, exact `(id, revision)` lookup, protected validation, and immutable history patterns.
- Extended: shared typed dependency/provenance/freshness/coverage vocabulary for new planning domains.
- Adapted: semantic fingerprinting for declared set-like or ordered dependency inputs.
- Left domain-specific: Goal IDs, occurrence/source identities, PlanDecision provenance, HistoricalPlan snapshots, measurement histories, and Preview `isStale`.

## 5. Files Added

- `code/src/core/planning/planningFoundation.ts`
- `code/src/core/planning/revisionedGoalRelationship.ts`
- `code/src/core/planning/planningFoundation.test.ts`
- `code/src/core/planning/revisionedGoalRelationship.test.ts`
- `docs/implementation/phase-8/TASK_8.1_REVISIONED_PLANNING_PROVENANCE_AND_FRESHNESS_FOUNDATION_RESULT.md`

## 6. Files Modified

- `docs/architecture/CURRENT_STATE.md`
- `docs/architecture/CHANGELOG.md`

`DECISIONS.md` was not modified because implementation follows accepted architecture and introduces no new durable architectural decision.

## 7. Identity Model

`PlanningFactId` is an opaque validated UUID-v4. Creation uses the established cryptographic allocator. IDs contain no mutable domain meaning and survive clone/JSON restore.

## 8. Revision Model

`PlanningRevision` is a positive safe integer distinct from logical identity and timestamps. The slice retains ID and advances revision only when its declared semantic payload changes; canonical hashing makes object-key order irrelevant.

## 9. Provenance Model

`PlanningProvenanceV1` separates record role (`authoredAuthority`, `derivedArtifact`, `acceptedAuthority`, `historicalEvidence`) from a closed origin union. Origin supports recurring, direct scheduled, ordinary Proposal acceptance, Found-Time Proposal acceptance, corrective decision, direct spontaneous execution, and explicit `legacyUnknown`. Provenance describes lineage; it does not grant authority.

## 10. Dependency Reference Model

`PlanningDependencyReferenceV1` carries version, validated namespaced kind, opaque source ID, exact revision, and optional qualification version. It contains no object snapshot.

## 11. Fingerprint Model

`DependencyFingerprintV1` records algorithm `fnv1a64-canonical-v1` and explicit `set` or `ordered` semantics. Set mode validates, deduplicates, and sorts references; ordered mode preserves declared sequence. Only supplied dependencies participate, and no clock or application state is read.

## 12. Freshness Model

`evaluatePlanningFreshness` yields `current`, `stale`, or conservative `unknown`. Missing or malformed decisive fingerprint information is Unknown; incompatible algorithm/order/value is Stale; only exact equality is Current.

## 13. Coverage Model

`CanonicalUserDayCoverageV1` carries explicit user-day labels, start/end instants, and boundary times. Validation rejects invalid dates, times, label ordering, and non-increasing instants. Calendar midnight is not inferred as ownership.

## 14. Qualification Model

Qualification is independently `qualified`, `partial`, or `unqualified`. Non-qualified states require structured reasons and remain distinct from freshness, validity, and authority.

## 15. Structured Reason Model

The bounded V1 namespace includes dependency mismatch/unavailable, unknown legacy provenance, and partial coverage. Codes and typed parameters round-trip independently of UI prose. Future domains own their additional reason unions.

## 16. Historical Resolution

`resolveGoalRelationshipRevision` resolves exact logical ID plus revision from validated retained history. Missing revision returns `notFound`; it never substitutes the latest revision.

## 17. Persistence Changes

Added a strict versioned `GoalRelationshipFoundationSnapshotV1` codec suitable for future persistence registration. No live authority/store participant was introduced, because the vertical slice is internal proof and adding an unused durable authority would be an empty framework.

## 18. Migration

Missing legacy foundation input deterministically migrates to explicit empty V1. Valid V1 is accepted and canonically ordered. Malformed and unsupported future versions fail closed; provenance is never inferred.

## 19. Backup / Restore Compatibility

The new V1 snapshot and records are structured-clone and JSON round-trip safe, with tests proving stable IDs/revisions and validation after round-trip. No live foundation state exists to add to Backup V6, so its schema and behavior remain unchanged. The codec is ready for the first domain that registers actual authority.

## 20. Thin Vertical Slice

Production code models one revisioned `contributesTo` Goal-relationship fact, derives bounded internal evidence from its exact dependency, detects staleness after a relationship revision, and resolves retained revisions exactly. It is not exported through store or UI and does not implement relationship authoring, arbitrary structure, Milestones, or Task 8.2.

## 21. Preview Freshness Relationship

Preview already approximates dependency invalidation through store-owned `isStale`, tied to its revision/applicability workflow. It remains intentionally Preview-specific. The new typed helper is an extension seam for future planning artifacts, not a behavior-changing retrofit.

## 22. DF-006 Relationship

DF-006 remains RC7 / BR5 / S2, historical and bounded. Work, cycles, Preview, Month, and freshness infrastructure were not modified, so no speculative repair or unrelated DF-006 change was made. Continuous REG-01–17 coverage remains governed by the roadmap and existing full suite.

## 23. Determinism

Fingerprint and revision comparison use canonical semantic serialization. Equivalent references, declared ordering mode, coverage, provenance, and reason inputs produce equivalent results. No ambient clock participates.

## 24. Future Capacity Compatibility

Namespaced exact references, qualification versions, explicit coverage, algorithm versions, structured reasons, and set fingerprints can represent authorized schedule, Commitment, composition, availability-policy, and derivation dependencies without implementing Capacity.

## 25. Future Demand Compatibility

The substrate can reference exact Goal, Demand Intent, Goal Priority, Progress evidence, projection algorithm, and bounded user-day coverage revisions without implementing Demand.

## 26. Future Proposal Compatibility

Set/ordered dependencies and explicit algorithms can capture Capacity, Demand Projection, priority, policy, Structure, composition, evaluation-input, and horizon dependencies. Unknown/mismatch cannot silently authorize acceptance.

## 27. Future Live Compatibility

Coverage supports short explicit intervals. Evaluation time can be declared as a dependency rather than read ambiently, and qualification can represent rapidly changing suitability. No Live Opportunity was implemented.

## 28. Tests Added

Two files add 11 focused tests covering identity/revision distinction, semantic no-op revisions, key-order invariance, namespaced references, set and ordered fingerprints, dependency revision changes, Current/Stale/Unknown, user-day coverage validation, all provenance compatibility behavior, structured reasons/qualification, evidence derivation, exact history, migration, JSON round-trip, and malformed-data failure.

## 29. Regression Tests Run

Targeted Goal, Goal surface, Preview generation/revision, HistoricalPlan materialization/surface, PlanDecision domain/replay/surface, Backup V6/unit integration, and store suites passed: 12 files, 244 tests. The full repository then passed: 96 files, 987 tests.

## 30. Validation Commands / Results

- `npm run format` — passed; all repository files unchanged except Task 8.1 files formatted.
- `npm test` — passed; 96 files, 987 tests, zero failures.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed; Vite transformed 116 modules.
- `npm run check:bundle` — hard policy passed; 636,234 initial bytes, 162,015 initial gzip, 53,188 largest lazy, 761,854 total. Existing initial-gzip warning threshold (161,500) remains exceeded by 515 bytes.

## 31. Performance Notes

Fingerprinting serializes only declared references. Set canonicalization is bounded to that list. Exact-history lookup currently scans only the supplied relationship lineage snapshot; no unrelated application history or store is scanned. No speculative cache was added.

## 32. Compatibility Notes

No existing ID, store schema, backup schema, scheduling input/output, Preview flag, history record, surface, or profile behavior changed. New types coexist with established domain-specific identities.

## 33. Implementation Decisions

Numeric positive revisions align with current Goal/measurement histories. UUID-v4 aligns with current opaque durable IDs. Existing canonical FNV-1a hashing is reused and named in the envelope. Dependency kinds are validated namespaced identifiers so future domains retain typed constructors without a central uncontrolled string pool. Persistence activation is deferred until a real authority exists.

## 34. Deviations

The requested result path `/docs/results` is not the established convention. The result uses established `docs/implementation/phase-8/`. No behavioral deviation occurred. A live persistence participant and Backup V7 were deliberately not created because there is no new live authority to persist; strict codecs, migration, and round-trip proof satisfy the foundation boundary without speculative state.

## 35. Architecture Reopen Check

No. Existing UUID, numeric revision, canonical hashing, exact history, canonical user-day, validation, and protected-state conventions support the accepted foundation without contradiction.

## 36. Repository Status

Task-created production/tests are the four `code/src/core/planning/` files. Task-modified governance is `CURRENT_STATE.md` and `CHANGELOG.md`; this result is added beside the pre-existing untracked Task 8.1 specification. The specification itself was present before implementation and was not modified. No commit or push was performed.

## 37. Completion Assessment

All T81-INV-01–18 are implemented or protected by focused/full regressions: identity/revision separation; semantic revision inputs; declared, canonical, clock-free fingerprints; fail-conservative freshness; distinct qualification/authority; exact history; explicit unknown provenance; user-day boundaries; structured reasons; restore identity stability; malformed failure; unchanged schedules; and no new UI authority.

## 38. Recommended Next Task

Task 8.2 — Goal Structure V1 Domain and Persistence: consume the foundation to implement the first bounded typed relationship authority, lifecycle, exact history, additive persistence/backup registration, and non-UI query boundary. Do not begin it in Task 8.1.

## 39. Completion Statement

**Task 8.1 — Revisioned Planning Provenance and Freshness Foundation complete.**

DayFrame now has the bounded cross-domain identity, revision, provenance, dependency-fingerprint, freshness, coverage, qualification, structured-reason, persistence, migration, backup, and historical-resolution substrate required by the first Phase 8 planning domains; the foundation is proven through a thin internal production vertical slice rather than an empty generalized framework; logical identity remains distinct from revision identity; derived freshness is deterministic and dependency-based rather than timestamp-based; unknown or malformed provenance cannot silently become current authority; exact historical revisions remain distinct from current state; existing deterministic scheduling, Preview, Friction, decision, publication, execution, Progress, persistence, backup, and surface behavior remains intact; DF-006 remains bounded historical regression and observability evidence rather than a speculative repair target; no new user-facing planning authority has been introduced; and the repository is ready for the next bounded Phase 8 implementation task without reopening accepted architecture.
