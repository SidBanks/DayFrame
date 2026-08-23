# Task 3.4 Result — Historical Execution Target Materialization

**Task:** 3.4  
**Date:** 2026-08-21  
**Determination:** Complete

## 1. Executive Result

DayFrame now has a pure `HistoricalExecutionTarget` bridge that materializes a
supported planned occurrence into a lifetime-safe `DurableOccurrenceReference V1`
plus the existing clone-safe `ExecutionHistoricalSnapshot`. It truthfully handles
fresh scheduled, unplaced, omitted, and blocked planning context for template,
work, and manual-event families while rejecting stale Preview geometry, Try-only
revisions, imported/synthetic lineage, and unknowable historical context.

Materialization creates no execution authority, IDs, outcome, actual-time evidence,
note, provenance, history write, or Preview mutation.

## 2. Artifact Integrity

- Supplied and saved Task 3.4 copies are byte-identical.
- SHA-256 for both:
  `c4608d278700be6b60311496cc5cd15397bfd91ff88210ab19119981cecd254b`.
- Sections 1–204 and the final completion statement are present.
- The immutable task artifact was not modified.

## 3. Governing Contracts and Initial Audit

Tasks 3.1–3.3 remain governing. The audit confirmed:

- template candidates/scheduled blocks carry window-invariant OccurrenceIdentity;
- generated work blocks carry work lineage;
- manual scheduled blocks carry manual-event identity;
- DurableOccurrenceReference supports exactly those three families;
- Preview exposes original block candidates, scheduled/unplaced outputs,
  PlanDecision replay results, freshness, and `revisedAt`;
- `revisedAt` distinguishes Try-revised Preview from authoritative regeneration;
- omitted references remain discoverable through replay results and original
  candidates;
- blocked placement remains discoverable by replay-result target correlation;
- imported-calendar/synthetic scheduled vocabulary has no durable reference family.

No Preview schema or scheduling-engine change was necessary.

## 4. Files Changed

- `code/src/core/execution/historicalExecutionTarget.ts` — pure materializer.
- `code/src/core/execution/executionRecord.ts` — narrow standalone snapshot
  validator export; no schema or validation behavior weakened.
- `code/src/core/execution/tests/historicalExecutionTarget.test.ts` — focused tests.
- this result and bounded Phase 3 governance status.

No state, persistence, engine, friction, SuggestedFix, PlanDecision, Active,
Profile, Backup, or UI production behavior changed.

## 5. Type and Result Contracts

```text
HistoricalExecutionTarget = {
  reference: DurableOccurrenceReference;
  snapshot: ExecutionHistoricalSnapshot;
}
```

It is ephemeral report input, not execution authority or independently durable
history. Materialization results are explicit: `materialized`, `notReportable`,
`stalePreview`, `tryOnlyPreview`, `unsupportedFamily`, `sourceMissing`,
`lifetimeMismatch`, `occurrenceMissing`, `insufficientHistoricalContext`,
`invalidSnapshot`, and `invalidReference`.

The public selection boundary supports scheduled block, unplaced candidate, work
block, PlanDecision replay target, and an existing historical durable reference.
It accepts explicit authored/Preview inputs and never queries a store.

## 6. Reportability and Family Matrix

A target is reportable only when stable semantic occurrence identity, a valid
durable reference, a supported family, and enough defensible snapshot context all
exist.

| Family/state | Reportable? | Reference source | Snapshot state |
| --- | ---: | --- | --- |
| flexible/fixed template in fresh scheduled Preview | Yes | template occurrence lineage | scheduled |
| template unplaced candidate | Yes | candidate lineage | unplaced |
| applicable omitted template | Yes | replay target + original candidate | omitted |
| blocked exact-placement template | Yes | replay target/candidate correlation | blocked |
| generated work block | Yes | work occurrence lineage | scheduled |
| manual event scheduled block | Yes | manual-event lineage | scheduled |
| imported calendar | No | none exists | unsupportedFamily |
| rule/synthetic block without lineage | No | none exists | unsupportedFamily |
| unplanned activity | Not handled here | later explicit user input | unplanned elsewhere |

Reportability does not imply execution. Friction, SuggestedFix IDs, runtime block
IDs, placement success, or current outcome are never identity.

## 7. Planning-State Semantics

| State | Interval? | Meaning |
| --- | ---: | --- |
| scheduled | Exact canonical UTC start/end | Fresh authoritative Preview establishes placement |
| unplaced | No | Occurrence existed but was not placed |
| omitted | No | Applicable accepted omission suppressed occurrence |
| blocked | No | Accepted hard placement could not be realized |

Blocked requested time is not mislabeled as scheduled geometry because the accepted
Task 3.2 snapshot schema has no distinct requested-placement field. State alone is
sufficient for V1. Priority is intentionally absent. Effective duration and exact
placement decisions are represented only through authoritative regenerated
scheduled geometry.

## 8. Preview Evidence Boundary

| Preview condition | Freeze scheduled interval? | Result |
| --- | ---: | --- |
| fresh generated/regenerated | Yes | materialized when supported |
| stale | No | stalePreview |
| fresh Try-only (`revisedAt`) | No | tryOnlyPreview |
| no Preview | No heuristic geometry | insufficientHistoricalContext |

After Try is accepted and Preview regenerated, `revisedAt` is absent and the
PlanDecision-backed fresh geometry materializes normally. No old Preview is
persisted. A flexible occurrence's former heuristic placement is never recreated
by rerunning today's scheduler and presented as historical fact.

## 9. Current Versus Historical and Retroactive Boundary

The supported core V1 path freezes the current effective plan at report time from
a fresh authoritative Preview. An existing durable reference may be checked later
for source missing, lifetime mismatch, or occurrence loss, but even successful
resolution returns `insufficientHistoricalContext`: source continuity cannot prove
past mutable title/category or lost placement.

This is deliberately conservative. Retroactive first reporting is safe only while
defensible plan evidence is supplied. Corrections use the snapshot already stored
in the ExecutionRecord and must not rematerialize from current planning state.

## 10. Durable Reference and Lifecycle Semantics

References are constructed only through the canonical Task 2 helpers from semantic
occurrence lineage. Runtime IDs merely locate Preview entries and never appear in
output. Structural reference validation runs before success.

| Transition | Old target newly materializable? | Reason |
| --- | ---: | --- |
| current fresh Preview, same lifetime | Yes | current plan evidence exists |
| same-lifetime source update, no preserved Preview | No | prior mutable fields unknowable |
| source deleted | No | sourceMissing |
| delete/recreate | No | lifetimeMismatch; never retargeted |
| Profile activation | No for old reference | fresh source lifetimes |
| Backup V1 import | No for old reference | fresh source lifetimes |
| Backup V2 restore | Reference may resolve | still needs defensible plan context |

Source missing, lifetime mismatch, and occurrence missing remain distinct. No
same-title or same-ID fallback exists.

## 11. Snapshot Materialization

Title/category come from the exact current source/candidate under fresh evidence.
Family must equal the durable reference family. Work uses shift name/category
`work`; manual events use authored title/category `optional`; templates retain
their category.

User-day date comes from the actual candidate/block occurrence. Effective
day-boundary preferences are resolved for that historical user day. UTC offset is
derived from the concrete placement instant (or target user-day noon for
non-scheduled states), so host timezone DST rules are evaluated for the target
date rather than today's offset. No IANA-zone schema was introduced.

Scheduled intervals use exact `Date.toISOString()` start/end. Overnight intervals
retain their real UTC endpoints while preserving the semantic user-day date.
Weekly/N-per-week identity remains governed by the reference's canonical
user-week/slot coordinate, not Preview order or range.

## 12. PlanDecision Semantics

Current fresh replay results are selected by `PlanDecisionId` and correlated by
durable target equality—not collection order. Applied omission becomes `omitted`;
blocked exact placement becomes `blocked`. Accepted placement/duration affect a
snapshot only after successful authoritative regeneration creates scheduled
geometry. Priority is not copied. Removed/superseded PlanDecision history is not
reconstructed because Phase 2 does not retain it.

## 13. Validation, Determinism, and Purity

Task 3.2 now exposes `validateExecutionHistoricalSnapshot`, reusing exactly the
existing internal validation and clone behavior. Materialized references use the
existing reference validator. Outputs are plain JSON and can feed
`ExecutionHistory.recordExecution` directly.

Same semantic occurrence and authoritative geometry produce the same target even
if the runtime block ID changes or Preview window overlaps differently. Inputs,
Preview, authored state, PlanDecisions, and ExecutionHistory are never mutated.
No clock or ID allocator is called.

## 14. Evidence Matrix

| Historical field | Authority | Reconstructable later? |
| --- | --- | ---: |
| durable occurrence coordinate/lifetime | canonical occurrence + authored lifetimes | While source/occurrence remains |
| title/category | fresh current source/Preview evidence | Not reliably after mutation |
| scheduled interval | fresh authoritative Preview | No after geometry is lost |
| unplaced state | fresh unplaced output | Not reliably later |
| omitted/blocked state | fresh replay result | Not after decision history is removed |
| user-day/boundary | occurrence + effective preferences | Only while context remains defensible |
| UTC offset | target-date concrete instant | Yes when target instant/context exists |
| actual execution/outcome | Never materializer authority | User report/observation only |

The first ExecutionRecord freezes this context; there is no independent plan-
history surface.

## 15. Tests Added

Eight focused tests directly cover:

- scheduled template and overnight interval;
- runtime-ID independence, cloning, and JSON safety;
- unplaced and blocked state without fictional intervals;
- PlanDecision omission correlation;
- work and manual-event families;
- imported/synthetic rejection and stale/Try boundaries;
- source deletion, lifetime recreation, occurrence loss, and insufficient historical context;
- direct ExecutionHistory reporting input with no materialization-side history.

The suite also verifies no outcome, actual evidence, note, provenance, execution
ID, or recorded timestamp leaks into the target.

## 16. Preview/Engine/Store and Persistence Determination

No Preview schema change was required. Existing occurrence identities, original
candidates, replay results, freshness, and `revisedAt` are sufficient. No engine,
friction, SuggestedFix, or PlanDecision logic changed. No store convenience was
added because the pure API's explicit inputs are already narrow and testable; a
future workflow can assemble them without creating new authority.

Materialization neither reads nor writes ExecutionHistory persistence. Duplicate
planned-subject prevention remains correctly owned by Task 3.3 `recordExecution`.

## 17. Validation Performed

- Focused materializer: 1 file, 8 tests passed.
- Lint: passed.
- TypeScript typecheck: passed.
- Full suite: 41 files, 642 tests passed.
- Production build: passed, 57 modules transformed.
- `git diff --check`: passed with no output.

## 18. Architectural Alignment and Deviations

The implementation follows the governing epistemic rule: only established current
plan facts are frozen; missing historical evidence remains explicit. The no-Preview
policy is intentionally stricter than speculative reconstruction: even a currently
resolving historical reference does not prove old mutable fields. This is within
the authorized bounded policy and introduces no scope deviation.

## 19. Discoveries and Deferred Work

The first report remains the first durable plan snapshot. Arbitrary retroactive
first reports after source/Preview/decision changes cannot recover exact historical
context. Deferred: persistent plan history, broader reconstructable fixed-source
policy, imported-calendar identity, IANA zones, reporting UI, history browsing,
progress/adherence/learning, and Backup V3.

## 20. Recommended Next Task

> **Task 3.5 — Implement Minimal Complete / Partial / Skip Execution Reporting Workflow**

It should expose reporting only for successfully materialized targets, collect an
explicit user outcome and optional bounded evidence, invoke ExecutionHistory
authority, surface durability truthfully, and never infer missed.

## 21. Final Completion Determination

Task 3.4 is complete. Supported current template/work/manual occurrences now
materialize deterministically into lifetime-safe references and ExecutionRecord-
compatible snapshots; scheduled/unplaced/omitted/blocked, stale/Try/no-Preview,
lifecycle, time, clone, and uncertainty boundaries are explicit and executable.
Full validation passes, and no scheduling, persistence, reporting UI, analytical,
Backup, or Phase 2 durable behavior changed.
