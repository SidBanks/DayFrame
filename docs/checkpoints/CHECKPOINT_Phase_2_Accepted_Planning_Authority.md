# Phase 2 Accepted Planning Authority Checkpoint

**Status:** Accepted with bounded follow-on requirements  
**Date:** 2026-08-20  
**Scope:** Tasks 2.32–2.37

## Decision

DayFrame's accepted-planning-authority loop is internally coherent and safe to build upon:

```text
authored lifetime authority
  → DurableOccurrenceReference V1
  → PlanDecision V1
  → independent persistence
  → deterministic replay
  → derived replay result and friction
```

Try remains a temporary Preview experiment. Explicit Accept is the only SuggestedFix workflow operation that creates or supersedes durable planning authority. Accepted decisions remain subordinate to authored source/lifetime authority and superior to ordinary placement heuristics.

## Authority Contract

1. Authored source/configuration authority.
2. Applicable accepted PlanDecision authority.
3. Ordinary scheduling heuristics.
4. SuggestedFix recommendation.
5. Try experiment.

A recommendation may propose reconsidering an accepted decision, but it is not authority and may never mutate, remove, retarget, or supersede that decision without explicit user acceptance.

## Replay Contract

- Applicable decisions replay deterministically by semantic target key and ID.
- Omission, duration, and priority transform the generated candidate before placement.
- Exact placement becomes a hard placement request.
- An unrealizable exact placement is retained and reported as `blocked`.
- Missing source, lifetime mismatch, and missing occurrence remain distinct stale outcomes and never retarget.
- Outside-window decisions remain retained authority but do not affect the current Preview.
- Replay results and friction are derived and are not persisted into PlanDecision.

## Recommendation Policy Baseline

- Suppress equivalent same-target recommendations.
- Prefer decision-preserving fixes.
- For blocked decisions, prefer fixes that remove the blocking constraint while retaining accepted intent.
- A useful superseding recommendation may be shown only with explicit language that it revises an accepted choice.
- Try may temporarily contradict an accepted choice; only Accept supersedes it.
- Stale and outside-window decisions do not constrain current recommendations.
- Two conflicting accepted decisions have equal user-authority status. Deterministic replay order is an implementation tie-break, not semantic priority.
- Recommendation generation never mutates PlanDecision authority.

## Known Product Gaps

Current SuggestedFix generation is decision-unaware: it receives no PlanDecision or replay-result context and has no relationship metadata. It may therefore emit redundant or contradictory recommendations.

Current UI provides immediate post-Accept status but no persistent contextual visibility/removal boundary. Omitted and stale decisions can become undiscoverable. Minimal visibility and removal are required before Phase 2 exit.

Backup V2 preserves Active V2 lifetime identity but excludes PlanDecision V1 and Profile V2. Its UI describes a setup backup, so this is not an immediate correctness defect, but exact accepted planning recovery and cross-device transfer are incomplete. Backup V3 is required before broader release.

## Readiness

Decision-aware recommendation implementation is **Ready with constraints**. It may add derived classification/ranking/explanation metadata and decision/replay context, but must not change PlanDecision, DurableOccurrenceReference, persistence formats, or explicit Accept semantics.

The more urgent next implementation boundary is minimal persistent accepted-decision visibility and removal, especially for omissions and stale decisions. Recommendation awareness should follow that boundary.

## Evidence Baseline

- 36 test files passed.
- 576 tests passed.
- lint passed.
- TypeScript typecheck passed.
- production build passed (53 modules transformed).
- `git diff --check` passed.

Detailed evidence and matrices are recorded in `TASK_2.37_AUDIT_END_TO_END_ACCEPTED_PLANNING_AUTHORITY_AND_DEFINE_DECISION_AWARE_RECOMMENDATION_POLICY_RESULT.md`.

