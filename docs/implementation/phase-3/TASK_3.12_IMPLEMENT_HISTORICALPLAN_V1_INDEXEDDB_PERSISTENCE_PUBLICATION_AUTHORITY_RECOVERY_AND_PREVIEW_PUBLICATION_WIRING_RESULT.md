# Task 3.12 — HistoricalPlan V1 Persistence and Publication Result

## 1. Executive Result

Completed. HistoricalPlan V1 is now a production IndexedDB collection surface. Fresh authoritative Preview generation freezes and queues a complete publication candidate after Preview adoption; validated batches commit atomically, reread/verify before becoming durable, remain exact pending session authority after failure, and support protected indexed queries, retry, export, recovery abandonment, subscriptions, and full clear.

## 2. Artifact Integrity

The supplied and saved task artifacts were complete, byte-identical, and ended with the required completion statement. SHA-256 for both: `8df7e37d9bb97a83c9593acf202da4c7ca95b80ee8337d7fb08dd7c2be5b6388`.

## 3. Governing Contracts

The implementation preserves Tasks 3.9–3.11: complete semantic user-day authority, immutable generation batches, lifetime-safe references, no backfill, latest-at-`asOf`, explicit gaps, and IndexedDB rather than localStorage collection persistence.

## 4. Initial Preview/Wiring Audit

`generatePreview` synchronously generates and adopts a fresh Preview. Authored/profile/backup mutations clear or stale Preview; Try writes `revisedAt`; accepted PlanDecision changes stale Preview and requires regeneration; execution reporting is independent. Engine output exposes scheduled blocks, generated work, unplaced candidates, replay results, durable occurrence identities, semantic user days, and requested visible range distinct from its internal buffer.

## 5. Files Changed

- `code/src/core/historicalPlan/materializePlanPublication.ts`
- `code/src/core/historicalPlan/materializePlanPublication.test.ts`
- `code/src/infrastructure/storage/dayFrameDurableDb.ts`
- `code/src/state/historicalPlanSurface.ts`
- `code/src/state/historicalPlanSurface.test.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/types.ts`
- this result artifact

## 6–8. Publication Hook, Ordering, and Failure Separation

The sole hook is after successful authoritative `generatePreview` adoption and authored-state notification. The exact candidate is immediately materialized, serialized behind earlier candidates, classified against durable plus pending authority, accepted into runtime, then persisted. IndexedDB failure never rolls back or stales Preview; the accepted batch remains queryable and retryable, and status exposes restart gap risk.

## 9–13. Physical Database Schema

The first production schema uses `dayframe-durable-v1`, physical version 1, with only `historicalPlanBatches` and `historicalPlanDays`.

- Batch key: `batchId`; index `byPublishedAt`.
- Day key: `[batchId, userDayDate]`; indexes `byUserDayDate`, `[userDayDate, publishedAt]`, and `byBatchId`.
- Batch wrappers preserve versions, range, ordered day membership, publication time, and derived fingerprint.
- Day wrappers preserve batch/time/day index facts, nested day authority, and derived fingerprint.

## 14. Batch Atomicity

One mixed two-store transaction writes the batch metadata and all complete days. There is no partial batch success.

## 15–19. Runtime, Pending, and Retry Authority

IndexedDB owns durable history. Runtime retains bounded batch metadata plus an ordered queue of exact accepted-but-undurable batches. Later failures never replace earlier revisions. Retry is batch-by-batch, stops at first failure, and preserves ID, time, content, and fingerprint.

## 20. Durability Status

Dedicated states are `initializing`, `ready`, `pending`, `failed`, `protected`, and `unavailable`, including pending count and normalized infrastructure errors where applicable.

## 21–23. Startup and Async Readiness

Store construction remains synchronous while HistoricalPlan initializes asynchronously. Startup opens the schema and validates lightweight batch metadata without loading all occurrences. Fresh candidates are immediately frozen and serialized behind the shared initialization/publication chain; Preview planning is never blocked. Initialization failure remains explicit and retains the exact failed candidate in the last publication result rather than claiming history.

## 24–26. Materialization and Gates

The pure bridge accepts authored setup plus Preview and returns explicit materialized/no-preview/stale/Try/inconsistent/unsupported/invalid results. It uses Preview `rangeStartDate`/`rangeEndDate`, never the expanded planning buffer.

## 27. Empty-Day Materialization

Every inclusive requested date receives a day record, including zero-occurrence days.

## 28–34. Occurrence Mapping

Scheduled template/manual/work facts retain exact UTC intervals. Unplaced, omitted, and blocked are state-only. Omitted replay facts are added even when absent from scheduled/unplaced lists. Work uses generated-work context. Manual and user-week references inherit the authoritative containing Preview user day, directly closing Task 3.11's coordinate limitation.

## 35–36. Duplicate Representations and Precedence

Occurrences deduplicate by exact DurableOccurrenceReference. Identical representations coalesce; disagreement fails materialization. A blocked replay result overrides generic unplaced for the same reference. Omission is materialized from applicable replay authority; scheduled/other contradictory duplicates are rejected.

## 37–38. Frozen Day Context

Each requested day freezes effective segment/default day boundary, `weekStartsOn`, and historical noon UTC offset. Overnight intervals remain intact and belong to their Preview semantic day once.

## 39. Batch Construction

The Task 3.11 constructor owns UUID, publication timestamp, validation, cloning, and canonical ordering.

## 40–42. Dedup and Meaningful Change

Each requested day is queried through IndexedDB and overlaid with pending batches. All identical days produce no write/no runtime event; any changed day appends the full requested range atomically.

## 43–47. Persistence, Verification, and Exact Retry

Validated physical records commit together, then the batch and all indexed day records are reread, wrapper metadata checked, domain validation rerun, and semantic fingerprint/equality verified. Normalized quota/transaction/constraint/read failures retain pending authority. An existing identical batch ID is idempotent success, covering uncertain commit acknowledgment; conflicting content protects the surface.

## 48. Same-Millisecond Publication Determination

The store uses a monotonic publication-order clock: `max(Date.now(), prior + 1ms)`. This is an explicit logical establishment timestamp, prevents ambiguous conflicting equal-time authority, and does not alter occurrence geometry.

## 49. Multi-Tab Determination

IndexedDB transactions prevent partial physical writes and conflicting primary-key corruption. V1 is conservatively single-active-tab for semantic publication ordering; no cross-tab scheduler authority or arbitrary UUID tie winner is claimed.

## 50–52. Indexed Queries and Pending Overlay

Latest/as-of reads use the compound day/time index when `IDBKeyRange` is available, with an indexed per-day fallback, then domain-revalidate the entire referenced batch. Range reads query days independently. Pending current-session batches overlay durable candidates before latest selection.

## 53–54. Gap and Protected Query Semantics

No publication returns `unavailableNoPublication`; an explicit empty publication returns available empty authority. Range results retain `missingDays`. Corrupt latest authority returns `unavailableProtected` and never falls back to an older valid publication.

## 55–57. Protected Ingress and Batch Quarantine

Invalid metadata, unsupported versions, missing/extra/invalid day membership, wrapper mismatch, orphan days, conflicting IDs, and ambiguous authority protect the surface. Raw records remain untouched. Because batch is atomic, one corrupt member invalidates the whole batch; V1 conservatively protects mutation/query authority rather than projecting partial history.

## 58–60. Source Recheck, Recovery, and Gap Metadata

Protection captures physical batch/day evidence. Export and destructive abandonment reread and fingerprint that evidence; changed source returns `sourceChanged`. Explicit abandonment atomically clears both stores and establishes empty prospective history. No new durable gap record was invented: absence remains unknown, while undurable session risk is observable but inherently cannot be durably marked when storage itself is unavailable.

## 61. Export

Export returns validated durable batches plus pending exact session batches in deterministic chronological order. Protected raw evidence has a separate export boundary.

## 62. Full Clear

`clearLocalData()` starts an atomic two-store HistoricalPlan clear and exposes its Promise as a non-enumerable compatibility field, preserving the established synchronous enumerable result contract. Direct `clearHistoricalPlan` provides the explicit async durable outcome. Runtime metadata/pending state clears only after durable success.

## 63–68. Cross-Surface Lifecycle

Profile activation, Backup V1/V2 restore, setup save/edit, and PlanDecision accept/remove do not publish directly; their next fresh regeneration may publish. Try never publishes. Execution assertion/correction/retraction never publishes. Existing HistoricalPlan history is not rewritten when source lifetimes change.

## 69. Subscription Model

Dedicated durability subscribers receive status only. History subscribers receive bounded `publicationAccepted`, `historyCleared`, and `recoveryChanged` invalidation events, not the whole ledger.

## 70. Whole-Ledger Getter Determination

No ordinary whole-ledger getter exists. Indexed day/range reads are the authority API; complete traversal is restricted to explicit export.

## 71–83. Tests Added

Two new test files add 17 tests (in addition to Task 3.11's 22 domain tests). Coverage includes fresh store-hook publication; no/stale/Try gates; exact requested range and empty days; overnight geometry; manual and user-week containing-day mapping; unplaced/blocked/omitted states; unsupported hidden imported exclusion; empty startup; atomic persist/verify/restart; indexed latest/as-of/removal; semantic no-op; ordered multiple failure and retry; pending query overlay; uncertain-commit idempotency; corrupt latest/no fallback; orphan protection; source-changed recovery refusal; export; two-store clear; and bounded subscriptions.

## 84–88. Negative Scope Audits

HistoricalPlan has no localStorage fallback. ExecutionHistory remains on its accepted V1 surface. Backup V3, historical metrics, historical-plan UI/editing, Progress, Goals, and learning were not introduced. Scheduler inputs and deterministic schedule generation are unchanged.

## 89. Architectural Alignment Assessment

Aligned. Actual fresh operative plan facts become immutable runtime authority before persistence, are never regenerated for retry, and cannot silently disappear, partially commit, or be replaced by fabricated history.

## 90. Deviations

No unauthorized scope expansion. Recovery uses conservative whole-surface protection/abandonment rather than an ordinary corrupt-batch deletion API. Full-clear exposes its async HistoricalPlan outcome non-enumerably to preserve existing synchronous caller/test compatibility.

## 91. Discoveries and Deferred Work

Robust multi-tab semantic ordering requires future storage-level compare-and-publish or an explicit writer lock. Durable gap markers require a separately versioned domain decision and cannot solve storage-unavailable failures. Historical reporting UI and metrics must consume protected/missing distinctions later.

## 92. Recommended Task 3.13

Proceed with the specified ExecutionHistory localStorage-to-IndexedDB migration while preserving its IDs, corrections, quarantine, anti-resurrection marker, exact retry, and recovery semantics.

## 93. Focused Validation

`vitest` focused HistoricalPlan plus store compatibility: 4 files passed, 197 tests passed. The dedicated new Task 3.12 suites contain 17 tests.

## 94. Full Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 50 files passed, 713 tests passed.
- `npm run build`: passed; 72 modules transformed; the existing/configured bundle-size warning remains informational.
- `git diff --check`: passed.

## Required Matrices

### A. Publication Trigger Matrix

| Event | Preview changes? | HistoricalPlan publishes? |
| ----- | ---------------: | ------------------------: |
| Fresh generation | Fresh authority adopted | Yes |
| Stale state | Marked stale | No |
| Try | Revised only | No |
| Accept + regeneration | Fresh authority adopted | Yes if meaningful |
| Save Setup/profile activation/backup restore | Stale or cleared | No |
| Execution report/correction | No | No |

### B. Materialization Matrix

| Occurrence/state | Persisted state | Interval? |
| ---------------- | --------------- | --------: |
| Template/work/manual scheduled | scheduled | Yes |
| Unplaced template | unplaced | No |
| Applied omission | omitted | No |
| Blocked accepted placement | blocked | No |

### C. Durability Matrix

| Event | Runtime authority advances? | Durable state | Retry? |
| ----- | --------------------------: | ------------- | -----: |
| Verified commit | Yes | Durable | No |
| Write/quota failure | Yes | Pending/failed | Yes, exact |
| Identical generation | No | Unchanged | No |
| Protected ingress | No | Protected | Recovery only |

### D. Query Matrix

| Durable/pending/corrupt state | Historical day result |
| ----------------------------- | --------------------- |
| Latest durable | Available/durable |
| Latest pending | Available/pending |
| None | `unavailableNoPublication` |
| Explicit empty | Available with zero occurrences |
| Latest corrupt | `unavailableProtected`, no fallback |

### E. Cross-Surface Matrix

| Transition | HistoricalPlan effect |
| ---------- | --------------------- |
| Setup/profile/backup change | None until fresh regeneration |
| PlanDecision accept/remove | None until fresh regeneration |
| Try | None |
| Execution reporting/correction | None |
| Full clear | Atomic HistoricalPlan store clear requested |

## 95. Final Completion Determination

Complete. HistoricalPlan V1 now uses the transactional IndexedDB foundation for atomic verified batches; publishes only fresh operative Preview authority across exact requested days; truthfully maps supported states/families and containing-day context; retains ordered exact pending revisions and durability status; supports idempotent retry, protected indexed day/range reads, no-fallback corruption behavior, source-rechecked recovery abandonment, deterministic export, subscriptions, and full clear; and introduces no backfill, localStorage fallback, ExecutionHistory migration, Backup V3, metrics, UI, or scheduling-semantic changes.
