# Task 3.2 Result — ExecutionRecord V1 Pure Domain Model

**Task:** 3.2  
**Date:** 2026-08-21  
**Determination:** Complete

## 1. Executive Result

DayFrame now has a pure, independently versioned `ExecutionRecord V1` domain
model. It distinguishes immutable record-revision identity from semantic execution-
subject identity; supports planned and unplanned subjects; validates frozen
historical context and optional actual-time evidence; represents completed,
partial, skipped, correction, and retraction semantics; validates linear chains;
and deterministically projects a current assertion and `OccurrenceOutcome`.

No persistence, store authority, UI, progress, adherence, learning, or Phase 2
schema was changed.

## 2. Artifact Integrity

- Supplied artifact SHA-256:
  `4ced489f4883817c88480900446eeccdf273cb5908f6eef2a8a87349abfb3c54`
- Saved project copy:
  `TASK_3.2_IMPLEMENT_EXECUTION_RECORD_V1_IDENTITY_DOMAIN_SEMANTICS_PURE_VALIDATION_AND_CURRENT-OUTCOME_PROJECTION.md`
- Saved-copy SHA-256: identical.
- Byte comparison: identical.
- Completeness: sections 1–195 and required final completion statement present.
- The immutable task artifact was not modified.

## 3. Governing Checkpoint and ADR

Task 3.1 is complete and accepted through:

- `CHECKPOINT_Phase_3_Execution_History_Semantics.md`;
- `ADR_EXECUTION_RECORD_AND_COMPLETION_HISTORY_SEMANTICS.md`;
- the Task 3.1 result artifact.

The implementation preserves their fixed boundary: execution is independent
historical authority, absence is unknown, and planning never proves reality.

## 4. Initial Domain Audit

The implementation reused repository conventions for branded canonical UUID-v4
IDs, cryptographic `crypto.randomUUID()` allocation, canonical `Z` timestamps,
plain discriminated unions, explicit validation results, cloning, current
`BlockCategory`, `LocalDateString`/`TimeString`, and all DurableOccurrenceReference
validation/equality/cloning. It does not resolve references against authored state.

## 5. Files Changed

- `code/src/core/execution/executionRecord.ts` — new pure domain implementation.
- `code/src/core/execution/tests/executionRecord.test.ts` — direct regression suite.
- this result artifact.
- Phase 3 checkpoint/current-state/roadmap — bounded status publication.

No state, persistence, Profile, Active, Backup, Preview, PlanDecision, or
DurableOccurrenceReference implementation file changed.

## 6. Module and Version Boundary

The model lives in `code/src/core/execution/` and exports only pure domain types,
constructors, validators, cloning, and projections. `EXECUTION_RECORD_VERSION` is
`1`, independent of all durable-surface versions.

## 7. Identity Contract

`ExecutionRecordId` identifies one immutable assertion/retraction revision.
`ExecutionSubjectId` identifies the semantic historical subject shared by a chain.
They are distinct branded types. Both strictly accept lowercase UUID-v4, reject
uppercase/wrong-version/malformed values, and allocate through cryptographic
UUIDs. Constructors accept allocator and clock injection for deterministic tests.

## 8. Subject Contract

| Subject type | DurableOccurrenceReference | Snapshot required | Skip allowed |
| --- | ---: | ---: | ---: |
| planned | Required and cloned | Required | Yes |
| unplanned | Forbidden | Required, family/plan `unplanned` | No |

A planned subject uses a validated DurableOccurrenceReference V1 but does not
resolve it. Collection validation enforces at most one subject per semantically
equal planned reference. Multiple identical-looking unplanned subjects remain
distinct through their subject IDs.

## 9. Historical Snapshot

Every assertion carries a clone-isolated snapshot containing:

- stable family: `template | work | manualEvent | unplanned`;
- non-empty title bounded to 200 characters;
- existing stable `BlockCategory`;
- historical user-day date, canonical `HH:mm` boundary, and numeric UTC offset in
  minutes (`-840..840`);
- plan state: `scheduled | unplaced | omitted | blocked | unplanned`;
- canonical UTC start/end only for a scheduled plan, with end after start.

Family must match the planned reference. Unplanned subjects require unplanned
family/state. Current sources and PlanDecisions are not embedded or consulted.
Corrections may provide a complete corrected snapshot; earlier snapshots remain
immutable evidence and the current projection uses the head snapshot.

## 10. Actual-Time and Recorded-Time Contract

The chosen minimum actual-time shape is one optional object with independently
optional `occurredAt` and `durationMinutes`. At least one must be present.
`occurredAt` is canonical UTC ISO-8601 and cannot be later than `recordedAt`.
Duration is a positive integer from 1 through 1440 minutes. This supports an
occurrence instant and/or a defensible duration without redundant start/end
authority.

`recordedAt` is mandatory canonical UTC time for every revision. Retroactive,
early, and late evidence is valid. Scheduled timestamps never populate actual
evidence. Skipped records forbid all actual-time evidence.

| Outcome | Actual instant | Actual duration | recordedAt |
| --- | ---: | ---: | ---: |
| completed | Optional | Optional | Required |
| partial | Optional | Optional | Required |
| skipped | Forbidden | Forbidden | Required |
| retraction | Forbidden | Forbidden | Required |

## 11. Outcomes and Provenance

Stored assertion outcomes are exactly `completed | partial | skipped`. Completed
and partial support planned or unplanned subjects; skipped requires planned
expectation. `unknown` is only a derived outcome for no record or a retraction
head. `missed`, `cancelled`, generic success/failure, percentages, and quantities
are absent.

V1 provenance is exactly `{ kind: "userReported" }`. Unsupported observation or
integration provenance is rejected rather than silently interpreted. Notes are
optional, preserved exactly, plain text by contract, and bounded to 2000 characters.

## 12. Record-Kind Matrix

| Record kind | Outcome field | replacesRecordId | Snapshot | Actual-time evidence |
| --- | --- | ---: | ---: | ---: |
| first assertion | Required | Forbidden/absent | Required | Outcome-dependent optional |
| correction assertion | Required | Required | Required full replacement | Outcome-dependent optional |
| retraction | Forbidden | Required | Forbidden | Forbidden |

Constructors create full immutable objects and never patch or mutate prior records.
A new assertion may replace a retraction head, restoring a reported outcome while
keeping the chain linear.

## 13. Constructors and Construction Results

`createExecutionAssertion` owns both IDs, version, provenance, and recorded clock.
`correctExecutionAssertion` owns a new record ID, preserves the subject ID and
origin, links to the current head, and validates a complete replacement assertion.
`retractExecutionRecord` creates a minimal linked retraction. Expected failures are
returned as `invalidInput`, `invalidReplacement`, `notCurrentHead`, or
`allocationFailure`; constructors do not throw expected domain failures.

Correction/retraction of a non-head is rejected. Correction cannot switch planned
reference or planned/unplanned origin.

## 14. Strict Record Validation

Validators enforce exact keys at every supported level, strict IDs, canonical
timestamps/dates/times, bounds, discriminators, provenance, outcome constraints,
reference validation, and snapshot/reference consistency. Unknown numeric record
versions return `unsupportedVersion`. Retractions forbid all assertion-only fields.
Validation returns cloned records and never mutates input.

Deleted-source independence is inherent: validation calls the structural
DurableOccurrenceReference validator, never the authored-state resolver. A record
for incarnation A remains attached to A even if a structurally similar source is
later incarnation B.

## 15. Collection and Component Validation

Collection validation provides structured issue codes with index, record ID,
subject ID, and details when available. It detects:

- invalid/unsupported records;
- globally duplicate record IDs;
- missing or cross-subject replacement links;
- non-monotonic replacement `recordedAt`;
- competing replacements/heads;
- cycles;
- changed subject origin/reference across revisions;
- duplicate planned references across subject IDs.

`validateExecutionSubjectComponent` validates one selected subject independently,
preparing a pure boundary for later component quarantine without implementing it.

| Condition | Valid? | Result |
| --- | ---: | --- |
| one root and linear replacements | Yes | Valid cloned records |
| correction targets current head | Yes | New head |
| two replacements of one revision | No | `competingReplacement` |
| two disconnected heads | No | `competingHead` |
| replacement target missing | No | `missingReplacement` |
| cross-subject link | No | `crossSubjectReplacement` |
| cycle | No | `cycle` |
| replacement recorded earlier | No | `nonMonotonicRecordedAt` |
| duplicate planned reference subjects | No | `duplicatePlannedReference` |

## 16. Current Record and Outcome Projection

Projection validates the subject set, follows explicit replacement topology rather
than array order, rejects ambiguity, and returns clones.

| Chain head | Current outcome |
| --- | --- |
| no records | `unknown` |
| completed assertion | `completed` plus cloned record |
| partial assertion | `partial` plus cloned record |
| skipped assertion | `skipped` plus cloned record |
| retraction | `unknown` |
| invalid chain | explicit structured invalid result |

Equivalent shuffled arrays project identically. No lexical-ID or array-order tie
break exists.

## 17. Planning and Lifecycle Boundaries

Omitted, unplaced, and blocked planned contexts may validly be completed or partial:
planning and reality may differ. Current-source deletion does not invalidate a
record. Source recreation with a new incarnation is structurally distinct and is
never retargeted. Profile/Backup activation and current PlanDecision state are not
dependencies.

## 18. JSON, Clone, and Purity Guarantees

All durable shapes contain only strings, numbers, arrays/unions, and plain objects;
no `Date`, class, or function is stored. Assertions, corrections, and retractions
roundtrip through JSON and validate/project equivalently. Constructors clone
references/snapshots/evidence, validators clone output, projections clone current
records, and tests prove input mutation isolation.

## 19. Persistence and Application Boundaries

Repository audits after implementation confirm:

- no localStorage/IndexedDB key, serializer, durability, retry, or recovery added;
- no store action/accessor/subscription or `DayFrameState` field added;
- no Active V2, Profile V2, Backup V1/V2, PlanDecision V1, Preview, or
  DurableOccurrenceReference V1 schema/behavior changed;
- no UI consumer or completion/history copy added;
- no progress, adherence, learning, timer, or integration added.

The only production reference is the new pure domain module itself; direct tests
are its only current consumers.

## 20. Tests Added

One focused test module with 21 tests covers:

- strict identity validation and injected allocation;
- planned/unplanned construction and unplanned-skip rejection;
- completed/partial/skipped semantics;
- omitted/unplaced/blocked planned outcomes;
- actual evidence, scheduled-time isolation, future and retroactive time;
- title/note/duration/user-day/offset/exact-key/provenance bounds;
- unsupported versions and reference-family mismatch;
- deleted-source independence and recreated-incarnation distinction;
- immutable correction, retraction, restoration after retraction, and stale-head rejection;
- duplicate/missing/cross-subject/non-monotonic/branch/cycle corruption;
- duplicate planned-reference and unplanned cardinality;
- component validation and structured issues;
- input-order projection, unknown/no-missed behavior, JSON roundtrip, cloning, and purity.

## 21. Validation Performed

- Focused: 1 test file, 21 tests passed.
- Lint: passed.
- TypeScript typecheck: passed.
- Full suite: 39 test files, 616 tests passed.
- Production build: passed; 55 modules transformed.
- `git diff --check`: passed with no output.

## 22. Architectural Alignment Assessment

The implementation matches Task 3.1's hybrid model without implementing event
sourcing or mutable records. Record revisions preserve evidence; current outcome
is derived; uncertainty remains uncertainty; planning and current source state are
not runtime dependencies.

## 23. Deviations, Discoveries, and Deferred Work

No authorized-scope deviation occurred. The concrete actual-time representation
selects `occurredAt` plus optional duration rather than an interval, avoiding
redundant/conflicting start/end/duration authority. Timezone context uses an
explicit historical numeric offset plus user-day boundary; IANA zones remain
deferred as Task 3.1 allowed.

Deferred: persistence technology and envelope, component quarantine/recovery,
store authority/durability, export/clear, reporting/history UI, imported-calendar
linkage, cancellation, intervals/timers/integrations, quantities, progress,
adherence, learning, and Backup V3.

## 24. Recommended Next Task

> **Task 3.3 — Implement ExecutionHistory V1 Durable Surface, Recovery, Quarantine, and Store Authority**

It should consume this domain boundary without adding reporting UI unless a later
contract explicitly authorizes it.

## 25. Final Completion Determination

Task 3.2 is complete. ExecutionRecord V1 identity, planned/unplanned semantics,
snapshot context, strict validation, immutable correction/retraction, chain
integrity, deterministic current-record/outcome projection, JSON/clone purity, and
direct regressions are implemented. Full validation passes, and no persistence,
store, UI, progress, adherence, learning, Backup, or Phase 2 contract change was
introduced.
