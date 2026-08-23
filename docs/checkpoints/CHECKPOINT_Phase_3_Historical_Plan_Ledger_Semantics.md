# Phase 3 Historical Plan Ledger Semantics Checkpoint

**Status:** Accepted architecture; implementation blocked on durable collection storage  
**Date:** 2026-08-21  
**Scope:** Task 3.9

## Denominator Problem and Necessity

ExecutionHistory durably knows only subjects that entered execution history. Preview is replaceable current output; PlanDecision is current accepted authority, not an audit log; an ExecutionRecord snapshot preserves plan context only for a reported subject. None can enumerate past planned occurrences that never received a report.

A Historical Plan Ledger is therefore required before DayFrame may derive arbitrary historical reporting coverage or plan follow-through. Missing ledger coverage remains uncertainty, never “no plan.” Current-Preview coverage and evidence-only summaries remain valid without the ledger.

## Chosen V1 Model

V1 uses append-only, complete **day publications**, created as one generation batch:

```text
HistoricalPlanSurface V1
  PlanPublicationBatch V1
    id
    publishedAt
    requested range
    HistoricalPlanDayPublication V1[]
      userDayDate
      dayBoundaryStartTime
      weekStartsOn
      occurrences[]
```

Each day publication asserts the complete authoritative, reportable plan facts for one requested user day at `publishedAt`. Day-level authority makes absence meaningful, resolves overlapping Preview ranges per day, localizes corruption, and assigns cross-midnight occurrences to their semantic user day. A batch records that its day publications came from one atomic Preview generation.

This hybrid beats:

- a bare occurrence ledger, where absence/removal is ambiguous;
- whole arbitrary-range snapshots, which duplicate large overlapping windows and complicate overlap resolution;
- persisting old Preview objects, which stores runtime/friction/UI geometry rather than governed historical facts.

## Publication Boundary

Every successful fresh authoritative generated or regenerated Preview is eligible for publication. This is the current operative-plan boundary because DayFrame has no stronger whole-plan publish/lock action.

- Initial fresh generation publishes.
- Fresh regeneration after accepted or removed PlanDecision publishes the effective replayed result.
- Try-only revised Preview never publishes.
- Stale Preview never publishes.
- Save Setup, first execution report, app exit, and day rollover do not publish independently.
- SuggestedFix IDs, runtime IDs, and temporary Try geometry never enter the ledger.

Publication is automatic but idempotent. A canonical semantic fingerprint per day covers the user-day context and sorted occurrence references/snapshots/states. If it equals the latest durable publication for that day, no new day revision is written. A changed occurrence set, plan state, interval, or frozen display context creates a new revision.

## Planned Occurrence Identity and Snapshot

One occurrence version is identified by publication/day identity plus `DurableOccurrenceReference V1`. The durable reference correlates the same semantic occurrence across publications and joins ExecutionHistory; it is not sufficient without publication context.

`HistoricalPlannedOccurrenceSnapshot V1` freezes plan facts, not metric policy:

- DurableOccurrenceReference V1;
- source family, historical title, and category;
- user-day date, day-boundary time, week-start preference, and UTC offset context;
- state: scheduled, unplaced, omitted, or blocked;
- canonical UTC start/end only for scheduled state.

No reportability flag is persisted. Eligibility is derived by a versioned metric policy from historical facts. Imported/synthetic families without durable references remain excluded.

## Plan States

Scheduled stores a real interval. Unplaced, omitted, and blocked store no fictional interval. All four can participate in historical reporting-coverage policy; only actionable scheduled entries are candidates for future plan follow-through under Task 3.7. Absence from the latest complete day publication means the occurrence was not in that operative day plan.

## Revisions, Supersession, and Queries

Publications are immutable. Later publications do not erase earlier ones. For each requested user day, the effective publication is the latest valid publication whose `publishedAt <= asOf`. A later publication for a past day is a new revision at its real publication time; it never masquerades as earlier knowledge.

The ledger preserves all publications so future metric policy can choose an explicit cutoff (for example, final publication before user-day end). V1 does not bake that metric cutoff into the ledger. No manual plan-history correction UI is adopted; privacy/full clear is the only physical deletion path.

Overlapping range publications resolve independently per day. A later complete day publication supersedes earlier day authority for matching `asOf`; absence can therefore withdraw an earlier occurrence. Earlier publications remain audit evidence.

## Source and Planning Lifecycles

Frozen snapshots survive same-lifetime mutation and deletion. Recreated readable IDs have new incarnations and cannot inherit identity. Profile activation and Backup V1 create new lifetimes; Backup V2 may restore old lifetimes but never rewrites old publications. Active-state abandonment leaves the independent ledger intact.

Ledger entries preserve effective results after PlanDecision replay, not PlanDecision IDs or current records. Removing a decision later does not rewrite an old publication. A fresh regenerated plan may create a new day publication.

## Execution Relationship

ExecutionHistory joins by DurableOccurrenceReference. One execution subject may correspond to several historical plan revisions. ExecutionRecord snapshot remains report-time display authority; the ledger remains operative-plan history. They may differ legitimately.

The ledger enables future retroactive target materialization after source deletion/mutation, but Task 3.9 does not change HistoricalExecutionTarget.

## Time and Scope

Only the requested visible Preview user-day range publishes; hidden engine buffer occurrences are excluded. Occurrences partially crossing a boundary follow existing semantic user-day ownership and count once. Each day freezes `dayBoundaryStartTime`, `weekStartsOn`, and historical offset; scheduled instants remain UTC, including DST transitions.

## Persistence, Atomicity, and Recovery

HistoricalPlanSurface is independent of Active, Profiles, PlanDecision, and ExecutionHistory and has its own version, durability, desired checkpoint, retry, ingress, export, and full-clear participation.

A generation batch must commit atomically. Within stored history, each complete day publication is the smallest validation/quarantine component. A corrupt latest day publication makes affected day/as-of authority unavailable; queries must not silently fall back to an older day plan. Whole-envelope/version corruption protects the source. Gaps and protected/corrupt ranges must be observable to future metrics.

## Storage Technology

The ledger records unreported occurrences and repeated plan revisions, so it can grow much faster than ExecutionHistory. Indefinite retention, indexed range/as-of queries, and atomic batches make localStorage unsuitable beyond a toy prototype.

Before ledger implementation, DayFrame needs a collection-oriented durable storage foundation, preferably IndexedDB, with transactional writes and indexes by user day, publication time, and occurrence reference. The foundation should cover both HistoricalPlan and long-lived ExecutionHistory to avoid split recovery and export semantics. No storage migration is implemented by this checkpoint.

## Backup, Export, Privacy, and Backfill

The ledger is highly sensitive personal history. It is retained until explicit deletion; there is no silent trimming. Full clear removes it and user-data export includes it.

Backup V3 should wait until Phase 3 durable collection surfaces are finalized, then include Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan. Profiles remain pattern-only.

No fabricated historical backfill is permitted. On feature adoption, the current fresh Preview may be published prospectively. Ledger availability begins at the first durable publication; missing periods and persistence failures remain explicit gaps.

## Historical Metric Readiness

After a valid ledger exists, historical reporting coverage can enumerate reportable entries and join current execution projections. Future plan follow-through may use actionable scheduled entries under an explicit cutoff policy. Ledger facts never embed completion/adherence policy, and derived metrics remain non-durable.

Goal progress still requires a Goal domain. Learning remains downstream of explicit evidence and uncertainty.

## Architectural Invariants

1. Current scheduler replay cannot reconstruct past plan truth.
2. Try-only and stale Preview never become historical authority.
3. Historical day publications are immutable; later revisions never erase earlier publications.
4. Same readable ID with a new incarnation never inherits plan identity.
5. Same-lifetime mutation never rewrites frozen context.
6. Historical denominators derive only from durable publications.
7. Never-reported occurrences are enumerable only where ledger coverage exists.
8. Missing/corrupt ledger data is unknown, not no plan; corrupt latest authority never silently falls back.
9. Ledger facts and execution outcomes remain separate.
10. Current PlanDecision records are not historical dependencies; publications store effective state.
11. Derived historical metrics remain non-durable.
12. No fabricated backfill.
13. Full clear removes plan history; complete backup eventually includes it.
14. Hidden Preview buffers never enter published scope.
15. Publication batches are atomic and semantically identical day plans deduplicate.

## Implementation Sequence

1. Task 3.10 — establish scalable transactional Phase 3 durable collection storage and migration/recovery boundaries.
2. Implement pure HistoricalPlan V1 domain, validation, fingerprinting, and effective-day projection.
3. Implement independent ledger persistence/publication integration.
4. Extend Backup V3 only after Phase 3 durable surfaces stabilize.
5. Separately authorize historical reporting coverage/follow-through derivation and UI.
