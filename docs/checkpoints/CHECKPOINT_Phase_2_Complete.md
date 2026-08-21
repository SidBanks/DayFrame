# Phase 2 Completion Checkpoint

**Status:** Accepted — Phase 2 complete with deferred release work
**Date:** 2026-08-20
**Scope:** Phase 2 authority, identity, persistence, replay, and recommendation alignment

## Phase Objective

Phase 2 closed the gap between generated schedules and durable, lifetime-safe user planning authority. DayFrame can now remember an accepted occurrence-scoped choice against the exact authored source lifetime, replay it deterministically, prevent retargeting after source recreation, expose it visibly and reversibly, and ensure recommendations recognize it as user authority.

## Final Authority Hierarchy

```text
authored source/configuration authority
  → applicable accepted PlanDecision authority
  → scheduling heuristics
  → SuggestedFix recommendations
  → Try experiments
```

Try is transient. Explicit Accept is the only SuggestedFix workflow operation that creates or supersedes PlanDecision authority. Explicit Remove is the only current UI operation withdrawing one decision.

## Source Lifetime Model

Seven runtime source kinds carry canonical UUID-v4 incarnations: shift definition, shift cycle, shift segment, shift sequence entry, block template, block recurrence, and manual event. Create/replace/delete-recreate rotate lifetime; update and Active V2 rehydration preserve it. Profile activation and legacy Active/Backup migration instantiate fresh lifetimes; Backup V2 restores exact validated lifetimes.

## Durable Surfaces

| Surface | Version | Incarnation | Current writer | Meaning |
| --- | ---: | ---: | ---: | --- |
| active local | V2 | yes | yes | current exact authored lifetime graph |
| saved profiles | V2 | intentionally no | yes | reusable authored pattern |
| backup | V2 | yes | yes | exact active setup recovery artifact |
| PlanDecision | V1 | via durable references | yes | accepted occurrence-scoped planning authority |

Active V1 and Profile V1 readers and Backup V1 imports remain historical compatibility boundaries; none is a current writer.

## Occurrence and Decision Model

Runtime `OccurrenceIdentity V1` remains incarnation-neutral and window-invariant. `DurableOccurrenceReference V1` combines semantic occurrence coordinates with source IDs and incarnations and resolves without retargeting. `PlanDecision V1` supports exact placement, omission, duration, and priority for one current decision per semantic target.

## Persistence and Recovery

PlanDecision has an independent versioned durable surface, desired checkpoint, status/subscriptions, retry, quarantine, and protected whole-source recovery. Runtime authority remains current after persistence failure; the last stored representation remains the durable checkpoint. Active, profile, backup, and decision protection boundaries remain independent and non-destructive.

## Deterministic Replay

Applicable decisions replay before ordinary placement. Omission removes a candidate; duration and priority transform it; placement creates an exact hard placement request. Unrealizable exact placement is retained as `blocked`. Stale source, lifetime, and occurrence states remain distinct; outside-window and inapplicable states remain factual. Canonical target/ID ordering is deterministic and never presented as user preference.

## Try, Accept, Visibility, and Removal

SuggestedFix Try revises only Preview. Supported exact Try results may be explicitly accepted through lifetime-safe candidate mapping, store validation/persistence, automatic regeneration, and ID-correlated replay feedback. Current accepted choices remain visible with applied, blocked, stale, outside-window, inapplicable, unevaluated, or error status and can be individually removed through the store authority.

## Decision-Aware Recommendations

Recommendations are post-classified as ordinary, preserving, directly unblocking, superseding, equivalent, or unknown. Exact equivalents are suppressed. Preserving/directly unblocking recommendations rank ahead of clearly labeled revisions to an accepted choice. Causality is bounded; uncertain indirect relationships remain neutral. Generation never mutates decisions.

## Historical Compatibility

| Legacy surface | Reader retained? | Current writer? | Semantics |
| --- | ---: | ---: | --- |
| Active V1 | yes | no | guarded migration to a fresh V2 baseline |
| Profile V1 | yes | no | migration as reusable pattern; fresh lifetime on activation |
| Backup V1 | yes | no | historical import establishing fresh active lifetimes |
| singular `shiftCycle` input | bounded legacy readers | no | plural `shiftCycles` remains current authority |

V2 authority markers prevent legacy resurrection.

## Validation Baseline

- lint passed;
- TypeScript typecheck passed;
- 38 test files and 595 tests passed;
- production build passed with 55 modules transformed;
- `git diff --check` passed.

## Deferred Release Work

Backup V3 is required before broader release because Backup V2 truthfully exports Setup but does not carry PlanDecision or Profile V2 authority. This does not block Phase 2 architectural closure.

## Deferred Future Architecture

- DurableConflictReference and conflict/multi-target decisions;
- decision and supersession history;
- execution/completion history and learning feedback;
- richer counterfactual recommendation reasoning;
- broader decision-management and Planner/Summary UX.

## Completion Statement

Phase 2 is complete with explicitly deferred release work. DayFrame now has coherent, lifetime-safe, durable and reversible occurrence-scoped planning authority; deterministic replay; non-destructive recovery; explicit Try/Accept semantics; and recommendation behavior that respects accepted authority. No unresolved Phase 2 correctness defect remains.
