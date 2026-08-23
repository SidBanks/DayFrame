# Task 3.11 — HistoricalPlan V1 Pure Domain Result

## 1. Executive Result

Completed. DayFrame now has a persistence-independent HistoricalPlan V1 domain with strict complete-day publication batches, lifetime-safe frozen occurrence snapshots, deterministic semantic deduplication, immutable append behavior, and explicit effective day/range projections.

## 2. Artifact Integrity

The supplied artifact and saved project copy were present, complete, byte-identical, and ended with the required completion statement. SHA-256 for both: `6f6cfa35cdce2ef9b36d722c5adad42f7e994e04ff99498f7a37552c026dd7aa`.

## 3. Governing Task 3.9 Contract

The implementation follows the accepted complete-user-day, append-only, atomic generation-batch model. Tasks 3.9 and 3.10 were complete and their checkpoint, ADR, result, identity primitives, Execution snapshot patterns, and Task 3.4 materialization boundary were reviewed.

## 4. Initial Domain Audit

The audit found canonical UUID/UTC/local-date and strict-key patterns in `ExecutionRecord V1`, lifetime-safe cloning/equality/validation in `DurableOccurrenceReference V1`, `BlockCategory`, `TimeString`, `Weekday`, and user-day types. No suitable shared canonical fingerprint helper existed.

## 5. Files Changed

- `code/src/core/historicalPlan/historicalPlan.ts`
- `code/src/core/historicalPlan/historicalPlanValidation.ts`
- `code/src/core/historicalPlan/historicalPlanFingerprint.ts`
- `code/src/core/historicalPlan/historicalPlanProjection.ts`
- `code/src/core/historicalPlan/historicalPlan.test.ts`
- this result artifact

## 6. Module Boundary

All production changes are in `core/historicalPlan`. The module has no store, React, localStorage, IndexedDB, infrastructure, or wall-clock projection dependency.

## 7. Surface Version

`HISTORICAL_PLAN_SURFACE_VERSION = 1` is independent from physical storage and all existing durable surfaces.

## 8. Nested Versioning Determination

Batch, day publication, and occurrence snapshot each carry independent V1 constants. This makes future nested migration boundaries explicit.

## 9. PlanPublicationBatchId

The batch ID is a branded canonical lowercase UUID-v4. Default allocation uses `crypto.randomUUID`; constructors accept an allocator for deterministic tests. Validation rejects uppercase, malformed, and wrong-version UUIDs.

## 10. Batch Meaning

One batch is one atomic authoritative publication over an inclusive requested visible user-day range.

## 11. publishedAt

`publishedAt` is a strict canonical UTC instant supplied by an injected clock during construction. Validation/projection never allocate time.

## 12. Batch Range

The inclusive start/end user-day dates are explicit and strictly validated.

## 13. Empty-Day Semantics

An empty `occurrences` array is valid authority. Every date in the requested range must still have a day record.

## 14. Day Publication Identity

Day identity is the composite `(batch ID, userDayDate)`; no redundant day UUID is allocated.

## 15. Complete-Day Authority

Each day is complete authority at its batch time. Absence in a later complete day represents removal from the operative plan.

## 16–19. Frozen Day Context

Each day freezes `userDayDate`, `dayBoundaryStartTime`, `weekStartsOn`, and `utcOffsetMinutes`. Boundary uses canonical `HH:mm`; offset units are minutes and range is `-840..840`. No current preference or timezone lookup is used.

## 20–23. HistoricalPlannedOccurrenceSnapshot

Snapshots are dedicated plan-history records containing a cloned `DurableOccurrenceReference V1`, source family, bounded historical title, stable `BlockCategory`, and plan state. User-day date is inherited from the containing complete day to avoid redundant state.

## 24–28. Plan State Union

The exact union is scheduled, unplaced, omitted, and blocked. Scheduled requires canonical UTC start/end with end after start. Every non-scheduled state is state-only and rejects interval or other keys.

## 29–30. Source Lifetime and Revisions

Exact source incarnation remains inside the durable reference. The same reference can recur across publications with revised metadata/state/geometry; a recreated source has a distinct semantic identity.

## 31. Duplicate Reference Rules

Duplicate reference within one day and reuse of the exact reference across two days in one batch are invalid.

## 32. Canonical Ordering

Validated days sort by date and snapshots sort by a canonical durable-reference key. Input array order is never authoritative.

## 33–34. Semantic Equality

Snapshot/day/batch semantic equality compares canonical planning facts and exact reference identity while ignoring batch ID, publication time, and input order.

## 35–36. Fingerprint Design and Boundary

Fingerprints are deterministic canonical serialized strings with recursively sorted object keys and canonical arrays. This keeps the synchronous pure API browser-safe. Equality compares the full canonical value, so no collision-prone hash is treated as identity or authority.

## 37–38. Day and Batch Dedup Semantics

A candidate is a complete no-op only when every requested day equals its latest operative day immediately before/at candidate time. If any day changed, the full requested-range batch remains the atomic publication candidate.

## 39. Batch Constructor

`createPlanPublicationBatch` owns injected ID/time allocation, validates, canonically orders, and returns clone-isolated plain data or an explicit invalid/allocation result.

## 40–46. Preview Projection Determination

Preview-to-candidate projection was deliberately deferred to Task 3.12. Existing Preview data does not expose one narrow already-materialized input covering scheduled/unplaced/omitted/blocked with freshness and replay context; wiring it here would couple this pure model to runtime/store authority. Consequently fresh/stale/Try/no-preview acceptance remains outside this module, while its required complete candidate target shape is now executable.

## 47–48. Non-Historical IDs

Runtime block, PlanDecision, SuggestedFix, and Execution IDs have no fields in the schemas or fingerprints.

## 49–52. Validation

Validation is strict and exact-key at batch, range, day, snapshot, reference, and plan-state levels. It verifies versions, canonical ID/time/date/context, exact range coverage, duplicate days/references, supported source families, family/reference consistency, scheduled geometry, and coordinate/day membership where the V1 durable reference supplies an exact day.

## 53. Equal publishedAt Conflict Rule

Two batches at the same instant may coexist only when overlapping day facts are semantically identical. Differing same-day facts produce `ambiguousPublishedAtTie`; no lexical UUID winner exists.

## 54. Collection Validation

Collections reject duplicate batch IDs, invalid batches, and ambiguous equal-time authority without requiring input chronological order.

## 55–56. Effective Day Projection and asOf

`getEffectiveHistoricalPlanDay` selects the latest complete day at or before an explicit canonical `asOf`, independent of batch input order. It returns cloned authority, `unavailableNoPublication`, or explicit invalidity.

## 57–61. Operative Revision Semantics

Later complete publications naturally implement removal by absence, addition, state revision, interval revision, and title/category revision. Earlier facts remain queryable at an earlier `asOf`.

## 62–63. Effective Range Projection and Gaps

Range projection selects each day independently and returns available day views plus explicit `missingDays`. Missing history is never converted to an empty plan.

## 64. Backfill Prohibition

No backfill/current-state reconstruction helper exists.

## 65. Append/Dedup Helper

`appendPlanPublicationBatch` returns `appended`, `identicalNoOp`, `invalid`, or `nonMonotonicPublicationTime`. No-op and rejection allocate no identity/time.

## 66. Publication Immutability

Constructors, validation, append, and projections clone nested references/plans/arrays and never mutate caller values.

## 67–68. Corruption and Atomicity Boundary

Any invalid day invalidates its batch; a collection containing it is invalid. A stored batch is therefore treated as one atomic authority unit, not partially projected.

## 69–70. Validation Error Taxonomy

Stable codes cover unsupported versions, identity/time/range/context/occurrence/state/interval errors, missing/extra/duplicate days, duplicate/cross-day references, family mismatch, duplicate batch IDs, and ambiguous ties. Unknown keys are rejected rather than forward-accepted.

## 71. JSON Roundtrip

All records contain plain JSON-compatible objects, arrays, strings, and numbers. JSON-roundtripped batches revalidate.

## 72. Clone Isolation

Construction and projected output mutation tests prove isolation from source objects.

## 73. Determinism

Canonical output, fingerprints, equality, and projections are independent of snapshot/batch input ordering and current clock.

## 74. ID/Time Allocation Audit

Only new batch construction allocates ID/time. Validation, fingerprint, equality, projection, classification, and append/no-op do not.

## 75–84. Tests Added

One focused test file adds 22 tests covering UUID identity, deterministic construction, allocation failure, empty-day and JSON validity, missing/extra/duplicate coverage, strict shapes, invalid intervals/families/day membership, duplicate reference rules, collection collisions/ties, order-independent fingerprints, every material dedup change class, complete and mixed batch dedup, latest/as-of removal, explicit gaps, non-monotonic append, clock independence, and clone isolation.

Preview-candidate tests were not added because that optional boundary was deferred as described above.

## 85–88. Scope Audits

No persistence, durable store authority, historical metrics, UI, backup format, ExecutionHistory migration, or accepted Phase 2/Execution schema change was introduced.

## 89. Architectural Alignment Assessment

Aligned. The implementation makes Task 3.9's complete-day, immutable, lifetime-safe, superseding publication authority executable while retaining uncertainty for missing history.

## 90. Deviations

No unauthorized deviation. The optional Preview projection was deferred to the authorized follow-on boundary instead of importing runtime authority into the pure core.

## 91. Discoveries and Deferred Work

Manual-event and user-week template durable references do not encode an exact occurrence user-day. V1 therefore validates exact day membership for work and user-day template coordinates and relies on containing-day authority for the two portable reference forms. Task 3.12 must materialize these candidates from fresh Preview authority and directly test the mapping. Persistence, protection/quarantine, retry, export/clear, and indexed reads also remain deferred.

## 92. Recommended Task 3.12

Implement the HistoricalPlan durable surface and fresh-authoritative Preview publication orchestration over this model, preserving atomic full-range batches and explicit stale/Try/no-preview rejection.

## 93. Focused Validation

`npx vitest run src/core/historicalPlan/historicalPlan.test.ts`: 1 file passed, 22 tests passed.

## 94. Full Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 48 files passed, 696 tests passed.
- `npm run build`: passed; 64 modules transformed.
- `git diff --check`: passed.

## Required Matrices

### A. Plan State Matrix

| State | Interval required? | Meaning |
| ----- | -----------------: | ------- |
| scheduled | Yes | Published planned geometry |
| unplaced | No | Demand existed without placement |
| omitted | No | Effective accepted omission |
| blocked | No | Accepted hard placement could not be realized |

### B. Publication Authority Matrix

| Condition | Historical publication allowed? |
| --------- | ------------------------------: |
| Fresh authoritative Preview | Yes, future orchestration |
| Stale Preview | No |
| Try Preview | No |
| No Preview | No |

### C. Dedup Matrix

| Latest day vs candidate | Result |
| ----------------------- | ------ |
| Identical | `identicalNoOp` |
| Interval/state/metadata changed | Meaningful publication |
| Occurrence added/removed | Meaningful publication |

### D. Effective Projection Matrix

| Publications for day | `asOf` | Result |
| -------------------- | ------ | ------ |
| None | Any valid instant | `unavailableNoPublication` |
| One before instant | After publication | That complete day |
| Earlier and later | Between them | Earlier day |
| Earlier and later | After both | Later day |
| Conflicting equal-time | At/after instant | Invalid collection |

### E. Identity Matrix

| Concept | Identity |
| ------- | -------- |
| Batch | Independent UUID-v4 |
| Day publication | Batch ID + user-day date |
| Planned occurrence | Exact DurableOccurrenceReference V1 |
| Same occurrence across revisions | Same durable reference in different publication contexts |

## 95. Final Completion Determination

Complete. HistoricalPlan V1 now has independently versioned, strict, clone-safe pure domain authority; atomic complete-range batches including empty days; deterministic semantic fingerprint/dedup behavior; explicit immutable append outcomes; lifetime-safe planned snapshots; latest-day/as-of and gap-preserving range projections; direct regression coverage; and no persistence, runtime wiring, metrics, UI, backup, or unrelated schema expansion. All required repository validation passed.
