# Checkpoint — Phase 3 Complete

## 1. Phase 3 Purpose

Phase 3 extends DayFrame from deterministic planning into explicit execution and
history semantics. It preserves what was planned separately from what was
observed, permits observations to be revised without erasing evidence, and makes
the complete authority set durable, recoverable, exportable, and safely clearable.

## 2. Final Authority Model

The five durable authority surfaces are Active V2, Profiles V2, PlanDecision V1,
HistoricalPlan V1, and ExecutionHistory V1. They participate in Backup V3,
cross-storage restore, and full clear. Preview is derived operative planning state,
not a sixth durable authority. OutcomeSummary is a derived projection of current
effective execution evidence.

```text
operative Preview
    != durable HistoricalPlan
    != durable ExecutionHistory
    != runtime durability metadata
    != restore journal/staging
```

## 3. Planning History

HistoricalPlan is append-only durable planned-history authority in IndexedDB.
Fresh authoritative Preview generation explicitly publishes complete user-day
snapshots. Later publications form deterministic revisions and as-of projection;
identical publications deduplicate. A missing day is not the same fact as a
published day containing zero occurrences.

## 4. Execution History

ExecutionHistory is independent IndexedDB authority containing immutable assertion
and retraction records plus governed quarantine. Accepted runtime evidence may be
pending durability; retry preserves the exact accepted identity and timestamp.
Current outcomes are projections and are not separately authoritative.

## 5. Correction and Retraction

Corrections append assertions against the current revision head. Retractions append
retraction evidence. Original records remain immutable, stale heads are rejected,
and reporting after retraction appends a new accepted revision. The full chain is
preserved by persistence and Backup V3.

## 6. Outcome Summary

OutcomeSummary derives categorical counts of completed, partial, skipped, and
known-not-reported subjects from effective current outcomes. Optional current
Preview coverage is volatile and explicitly scoped. Summary is not adherence,
performance, completion percentage, missed-rate, or Goal progress.

## 7. Historical Reporting

The production “Report from plan history” UI queries HistoricalPlan directly for
one selected date. Stored scheduled, unplaced, omitted, and blocked occurrences
materialize through their exact frozen reference and snapshot into the existing
ExecutionHistory workflow. Current Active, Profile, and Preview authority is not
required, and reporting neither republishes nor mutates HistoricalPlan.

## 8. Identity and Incarnations

`DurableOccurrenceReference V1` is continuous from Preview publication through
HistoricalPlan, historical reporting, and ExecutionHistory. Source incarnation
identities prevent deleted and recreated logical sources from retargeting old
planned or observed history. Backup V3 preserves those values exactly.

## 9. Durability

Accepted authority and durability knowledge remain separate. Surfaces expose
pending, durable, failure, retry, and protected states as applicable. Backup V3
exports accepted domain authority—including accepted pending evidence—not runtime
durability metadata.

## 10. Migration and Anti-Resurrection

ExecutionHistory migrates legacy evidence only while legacy authority governs.
Once IndexedDB authority is established, its retained marker prevents fallback to
stale legacy bytes. Clear creates verified empty established IndexedDB authority
and retains the marker across restart.

## 11. Runtime Authority Transactions

The five-participant runtime transaction installs all final state before its first
commit notification. Cross-reading listeners observe one coherent authority set,
mutation is blocked during replacement/flush, and abort restores a clone-isolated
prior runtime snapshot without leaking notifications.

## 12. Cross-Storage Restore

Restore stages exact target and recovery authority, rechecks source fingerprints,
atomically replaces ExecutionHistory and HistoricalPlan, verifies local writes,
and maintains a strict startup journal. Deterministic roll-forward and rollback
precede ordinary readiness. Invalid or unverifiable recovery enters
`recoveryRequired` instead of guessing. Verified durable payloads are explicitly
translated into settled runtime authority before coherent installation.

## 13. Backup V3

Backup V3 is the canonical standard export and contains all five domain authority
surfaces. It excludes Preview, OutcomeSummary, durability status, migration
evidence, storage layout, and restore infrastructure while including governed
ExecutionHistory quarantine. Strict validation, clone isolation, JSON roundtrip,
semantic fingerprints, exact identity/timestamp preservation, protected-surface
blocking, V1/V2 import compatibility, and restart-stable V3 restore are executable.

## 14. Five-Authority Full Clear

`await clearLocalData()` settles Active, Profiles, PlanDecision, ExecutionHistory,
and HistoricalPlan before returning. Its canonical result enumerates all five;
Preview is separately guaranteed absent. Mixed terminal failures are truthful,
pending is never mislabeled partial, HistoricalPlan becomes an empty ledger without
an empty publication, and ExecutionHistory becomes empty established authority
without resurrection risk. Restore evidence is not erased by domain clear.

## 15. Validation Baseline

Task 3.16 independently verified on 2026-08-22:

- lint: pass;
- typecheck: pass;
- tests: 60 files, 769 tests, zero failures;
- focused closure tests: 10 files, 77 tests, zero failures;
- build: pass, 88 modules transformed;
- build advisory: one 580.27 kB minified chunk warning;
- `git diff --check`: pass.

## 16. User-Reachable Capabilities

Production UI exposes current-occurrence reporting, one-date historical reporting,
correction/retraction/re-reporting, execution-history inspection, categorical
Outcome Summary, standard Backup V3 export, V1/V2/V3 import, and terminal full
clear. Journal recovery, quarantine/protection, and durable-to-runtime translation
remain infrastructure safeguards rather than ordinary feature workflows.

## 17. Explicit Non-Features

Phase 3 completion does not claim historical metrics, adherence, completion
percentage, missed rate, Goals, Progress, streaks, learning, recommendation
adaptation, cloud/sync, broad history exploration, or Phase 4 analytics.

## 18. Residual Debt

The 580.27 kB Vite chunk advisory is low non-blocking optimization debt. Full-clear
flat compatibility aliases are low cleanup debt behind the canonical enumerable
authority result. A broader historical range explorer is deferred product breadth,
not a Phase 3 semantic defect.

## 19. Architectural Invariants

```text
HistoricalPlan   = what was planned
ExecutionHistory = what was observed
OutcomeSummary   = current categorical projection of observed evidence
```

Planning never proves execution. Missing evidence remains unknown. Missing plan
coverage differs from published empty coverage. Corrections do not erase evidence.
Accepted authority differs from durability knowledge. Quarantine differs from
whole-source protection and restore recovery. Backup represents domain authority,
not storage layout. Restore and clear never create planning or execution evidence.

## 20. Phase 4 / Next-Phase Readiness

Phase 3 is complete with non-blocking cleanup debt. HistoricalPlan denominator
authority, ExecutionHistory numerator authority, stable occurrence identity, and
empty-versus-missing coverage semantics make the system structurally ready for
metrics design, but no metric policy exists. The recommended next boundary is
Task 4.1 — Phase 4 Architecture Definition and Historical Metrics Semantics Audit,
a design/audit task before implementation.
