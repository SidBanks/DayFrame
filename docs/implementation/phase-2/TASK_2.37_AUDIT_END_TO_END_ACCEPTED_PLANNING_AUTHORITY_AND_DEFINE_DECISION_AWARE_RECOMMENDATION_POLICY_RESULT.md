# Task 2.37 Result — Accepted Planning Authority Audit and Decision-Aware Recommendation Policy

## 1. Executive Determination

**Confirmed:** the complete Try → Accept → persist → stale → regenerate → resolve → replay loop is coherent. No accepted-authority, lifetime-safety, persistence, or replay correctness defect was found.

**Architectural determination:** the recommendation baseline in Task 2.37 is accepted with refinements below. Recommendation implementation is **Ready with constraints**. Minimal persistent decision visibility/removal is **required before Phase 2 exit** and is the more urgent next task. Backup V3 is **required before broader release**.

## 2. Artifact Integrity

The supplied and saved Task 2.37 artifacts existed, were byte-identical, complete through the required final statement, and shared SHA-256 `769cf7aed68f58735fed3572ea43d1f96945d39bff7165869da932ca6702d179`. Tasks 2.32–2.36 result artifacts and current implementations were present.

## 3–4. Governing Evidence and Repository Baseline

Reviewed DurableOccurrenceReference construction/resolution, PlanDecision validation/surface, replay/applicability, placement, friction detection, SuggestedFix generation/application, Try → Accept UI orchestration, profiles, Backup V1/V2, recovery/protection, and Tasks 2.31–2.36 results. Executable production behavior is classified as **Confirmed**; policy below is an **Architectural determination**.

## 5. End-to-End Accepted Authority Trace

For each supported action, fresh friction yields a SuggestedFix; Try revises only a cloned Preview; the pure mapper constructs a semantic V1 candidate from occurrence lineage and exact revised output; explicit Accept allocates/validates/resolves and replaces the same-target decision; persistence records the independent decision surface; decision authority stales Preview; automatic generation resolves and replays decisions before placement; replay results are finalized; friction and SuggestedFixes are newly derived.

- Place: exact user-day/time becomes hard placement; applied or blocked.
- Omit: candidate is removed before placement; result applied.
- Duration: exact duration transforms candidate before placement; result applied even if later unplaced.
- Priority: exact priority transforms candidate before placement; result applied even if later unplaced.

## 6–8. Authority Hierarchy and Recommendation Boundary

| Rank | Authority |
| ---: | --- |
| 1 | authored source/configuration and current lifetime |
| 2 | applicable accepted PlanDecision |
| 3 | ordinary scheduling heuristics |
| 4 | SuggestedFix recommendation |
| 5 | Try experiment |

An accepted decision is user planning authority, not an immutable authored fact. A recommendation can propose revision, but cannot mutate/remove/supersede/retarget it. Explicit Accept remains the only supersession path.

## 9–12. Current SuggestedFix, Replay, Friction, and Decision-Shaped Friction

**Confirmed:** `generateSuggestedFixes` receives friction, work blocks, scheduled blocks, unplaced candidates, and boundary context only. It receives neither decisions nor replay results. SuggestedFix has action/parameters but no decision relationship. Friction similarly identifies block IDs and schedule facts, not decision causality.

Replay exposes `applied`, `blocked`, `outsideWindow`, three stale states, `inapplicable`, `invalid`, and `unsupported`. Therefore current friction is factually correct but cannot distinguish:

- ordinary friction;
- friction shaped by an applied decision;
- friction blocking an accepted placement;
- stale-decision context.

That distinction is necessary derived metadata, not new durable authority.

## 13–17. Contradiction and Fix Classes

**Direct contradiction:** the suggestion changes the same target and semantic dimension incompatibly (for example moving an accepted placement or changing an accepted duration).

**Indirect contradiction:** applying the suggestion to another target/constraint makes accepted intent harder or impossible to realize.

- **Preserving:** resolves friction without changing accepted target semantics.
- **Unblocking:** removes/changes a blocking constraint so accepted semantics can apply.
- **Superseding:** proposes different semantics for the same target and requires Try → explicit Accept.
- **Equivalent:** semantically duplicates current authority and must be suppressed.

## 18–20. Ranking, Suppression, and Provenance

Rank: preserving → unblocking → ordinary non-conflicting → explicitly superseding → unsupported/manual review. Within class retain current deterministic ranking. Suppress equivalent same-target fixes. A superseding Accepted choice retains existing `suggestedFix` provenance with the exact action; derived classification metadata is not persisted.

## 21–22. Try and Superseding Accept

Try may temporarily contradict a current decision because it is Preview-only. The UI must label superseding Try as reconsidering an accepted choice. Only Accept replaces same-target current authority through existing store semantics; no history is implied.

## 23–30. Per-Kind Policy and Boundaries

- Applied: constrain same-target recommendations; suppress equivalents and prefer preserving fixes.
- Blocked: retain as current authority; recommend unblocking first, then clearly labeled supersession/removal.
- Omit: do not recommend rescheduling the omitted occurrence as ordinary work; any restoration is supersession/removal.
- Duration: suppress same exact duration; other durations are superseding.
- Priority: suppress same exact priority; other priorities are superseding.
- Placement: preserve exact placement where possible; moves are superseding; constraint changes may be unblocking.
- Fixed authored template: authored fixed time outranks PlanDecision capability; keep current inapplicable behavior and direct authored edits to Setup.
- Work/manual: current PlanDecision replay is capability-inapplicable; do not offer PlanDecision Accept.

## 31–35. Stale, Outside-Window, Invalid, and Unsupported Policy

- `staleSourceMissing`: no constraint on current recommendations; expose removal/export context.
- `staleLifetime`: never retarget recreated source; no constraint; expose removal.
- `staleOccurrenceMissing`: no constraint; expose removal.
- `outsideWindow`: retain authority but exclude from current-window ranking/causality.
- invalid/unsupported: protected/quarantined infrastructure fact, not recommendation input; never guess or mutate.

## 36–39. Decision Conflicts, Tie-Break, Causality, Counterfactuals

Two accepted decisions have equal user-authority status. Current replay/placement is deterministic: decisions sort by semantic target key then ID; hard placements then use deterministic candidate ordering. If exact placements conflict, one may apply and the other is `blocked`. This is an implementation tie-break, not semantic priority.

Recommendations must not claim a decision “caused” friction merely because it shares a block. Decision causality requires either direct semantic comparison or a bounded counterfactual showing friction changes without that decision. V1 may classify direct same-target relationships and exact blocked placement without a general counterfactual engine; indirect causality must remain `unknown` until proven.

## 40. Minimal Recommendation Awareness Model

Pass current decisions plus replay results into a derived recommendation-classification boundary keyed by durable target, while block runtime IDs are used only for current Preview correlation. Produce relationship/ranking/explanation metadata after ordinary friction detection; do not persist it and do not leak domain unions into generic UI rendering.

## 41. SuggestedFix / Decision Relationship Matrix

| SuggestedFix kind | No current decision | Same-target current decision | Different-target decision | Relationship |
| --- | --- | --- | --- | --- |
| moveBlock | ordinary | equivalent or superseding | preserving/unblocking/indirect unknown | classify exact destination |
| skipBlock | ordinary | equivalent for omit; otherwise superseding | preserving or indirect unknown | classify omission |
| reduceDuration | ordinary | equivalent or superseding | preserving/unblocking/indirect unknown | compare exact result |
| changePriority | ordinary | equivalent or superseding | preserving/indirect unknown | compare exact result |
| changeFixedTime | authored review | authored review | authored review | never PlanDecision Accept |
| addResource | unsupported Try | unsupported | possibly preserving | no decision mutation |
| convertToRecovery | Try-only | superseding but unsupported V1 | possibly preserving | no Accept |
| acceptConflict | Try-only ignore | never durable conflict decision | ordinary ignore | no Accept |

## 42. Replay Outcome → Recommendation Matrix

| Replay outcome | Constrains recommendations? | Preferred policy |
| --- | ---: | --- |
| applied | yes, same target | suppress equivalent; prefer preserving |
| blocked | yes | unblocking first; labeled supersession/removal second |
| inapplicable | no current executable effect | explain capability; do not silently remove |
| stale source/lifetime/occurrence | no | visibility/removal; never retarget |
| outsideWindow | no for current Preview | retain silently outside current ranking |
| invalid/unsupported | no | protection/recovery boundary, not recommendation |

## 43–44. Metadata and Explainability Contract

Recommended transient shape:

```ts
type SuggestedFixDecisionContext = {
  relationship: "ordinary" | "preserving" | "unblocking" | "superseding" | "equivalent" | "unknown";
  decisionId?: PlanDecisionId;
  replayStatus?: PlanDecisionReplayResult["status"];
  explanationCode?: "sameTarget" | "exactEquivalent" | "blockedPlacement" | "constraintPreserved";
};
```

Use decision ID for correlation and semantic target comparison for meaning. Copy must say “accepted choice,” distinguish authored constraints from accepted planning choices, avoid claiming intent/motivation, and never promise a blocked result will schedule successfully.

## 45–50. Visibility, Discoverability, Removal, and Management UX

| Decision state | Currently visible later? | Visibility required? | Recommended surface |
| --- | ---: | ---: | --- |
| applied placement | only immediate workflow/result data | yes | contextual Preview marker + compact accepted choices panel |
| applied duration | only immediate workflow/result data | yes | same |
| applied priority | only immediate workflow/result data | yes | same |
| omission | no scheduled block; result only | yes, urgent | compact accepted choices panel |
| blocked | replay result exists; limited immediate copy | yes | Preview warning + panel |
| stale | not generally visible | yes | compact panel with remove |

Determination: **Required before Phase 2 exit.** A minimal read-only list/status and single-decision Remove action are needed for reversibility, especially omissions and stale decisions. Broader history/edit/bulk management remains deferred.

## 51–56. Profiles, Backups, Completeness, and Backup V3

Profile activation creates fresh authored lifetimes; existing decisions therefore become stale rather than retargeting. Backup V1 import creates fresh lifetimes; decisions become stale. Backup V2 restores exact Active V2 lifetimes, so retained local decisions may reactivate if references match, but decisions do not travel with the backup. Active abandonment/clear establish/reset authority according to existing protected boundaries.

| Durable surface | Backup V2 includes? | Required for exact planning recovery? |
| --- | ---: | ---: |
| Active V2 | yes | yes |
| PlanDecision V1 | no | yes for accepted planning choices |
| Profile V2 | no | no for active schedule; yes for full app recovery |

The UI calls this a Setup Backup, so omission is not an immediate misleading correctness defect. Cross-device restoration cannot reproduce accepted planning authority, however. Determination: **Backup V3 required before broader release**, with explicit inclusion policy for Active V2, PlanDecision V1, and profiles plus independent validation/recovery semantics.

## 57–58. Phase 2 Exit and Correctness Versus UX

| Capability | Status | Required before Phase 2 exit? |
| --- | --- | ---: |
| lifetime-safe target | complete | yes, met |
| decision surface/persistence | complete | yes, met |
| deterministic replay | complete | yes, met |
| explicit Try → Accept | complete | yes, met |
| minimal visibility/removal | missing | yes |
| decision-aware recommendations | policy ready, implementation missing | yes |
| Backup V3 | missing | no; required before broader release |
| broad decision manager/history | deferred | no |

No correctness defect was found. Decision-unaware suggestions and missing persistent discoverability/removal are policy/UX gaps that become Phase 2 exit requirements.

## 59–66. Safety Audits

- Stale Preview: Try disabled and Accept unavailable/rechecked.
- Protected ingress: decision mutation rejected; UI blocks candidate availability.
- Quarantine: valid decisions coexist and quarantine is preserved.
- Persistence failure: accepted runtime authority remains; retry is separate and does not recreate/stale.
- Determinism: semantic target/ID ordering and deterministic placement; replay status correlated by ID.
- Try-only: Preview revisions never call decision persistence.
- Supersession: one current decision per target, explicit Accept only.
- Removal: store API exists and stales Preview, but no persistent UI path currently exposes it.

## 67–69. Adopted Policy and Ranking Rules

All thirteen baseline rules in Task 2.37 are adopted. Refinement: indirect contradiction must be `unknown` absent causal evidence; deterministic conflict tie-breaks never imply preference. Recommended metadata is transient `relationship`, optional `decisionId`, optional `replayStatus`, and coded factual explanation.

## 70. Future Test Strategy

Cover all action/relationship combinations; equivalent suppression; preserving/unblocking/superseding ordering; blocked placement; decision-decision conflict; stale/outside-window exclusion; explicit superseding Accept; no mutation during generation/Try; runtime-ID non-persistence; profile/backup lifetime effects; protected/quarantine coexistence; and deterministic repeated output.

## 71–73. Architecture Checkpoint and Governance

Checkpoint publication criteria are met. Published `docs/checkpoints/CHECKPOINT_Phase_2_Accepted_Planning_Authority.md`. No `CURRENT_STATE.md`, `CHANGELOG.md`, or `DECISIONS.md` update was made because those broad architecture documents remain Phase 1/publication records and changing them was not required to record this bounded checkpoint.

## 74. Architectural Alignment Assessment

| Concern | Assessment |
| --- | --- |
| explicit user authority | Aligned |
| internal consistency | Aligned |
| lifetime safety | Aligned |
| deterministic scheduling | Aligned |
| non-destructive durable data | Aligned |
| explainability | Partially aligned; recommendation metadata absent |
| recommendation humility | Partially aligned; policy not implemented |
| authored/derived separation | Aligned |
| recovery completeness | Partially aligned; Backup V2 excludes decisions |
| user reversibility | Partially aligned; store API exists, persistent UI absent |

## 75–77. Defects, Corrective Work, and Deviations

Correctness defects: none. Required corrective prerequisite: none. Deviations: none; no production or test behavior was changed because repository evidence was sufficient.

## 78. Discoveries and Deferred Work

Decision-aware SuggestedFix classification, recommendation metadata, minimal management UX, Backup V3, conflict/multi-target kinds, history, and broader counterfactual causality remain deferred. `acceptedAt` must not affect semantic ranking; provenance may inform explanation only, not authority weight.

## 79. Recommended Next Task

**Task 2.38 — Implement Minimal Persistent Accepted-Decision Visibility and Removal.** It should expose applied/omitted/blocked/stale/outside-window decisions, allow one-decision removal through the existing store API, automatically regenerate when appropriate, preserve persistence/recovery semantics, and avoid edit/history/bulk management. Decision-aware SuggestedFix classification should follow as Task 2.39.

## 80. Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 36 files / 576 tests passed.
- `npm run build`: passed; 53 modules transformed.
- `git diff --check`: passed.

## 81. Final Completion Determination

Complete. The accepted-authority loop is evidence-backed and checkpointed; recommendation relationships, ranking, causality, copy, visibility/removal, Backup V3 urgency, and Phase 2 exit requirements are explicitly determined. Recommendation implementation is **Ready with constraints**, with minimal persistent decision visibility/removal selected as the immediate next boundary.
