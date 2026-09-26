# Task 9.14 — First-Class Sleep Friction & Corrective Authority V1 RESULT

## 1. Executive Summary

Implemented typed required-Sleep Friction, pure placement Try, explicit fresh acceptance, retained revocation, and canonical solver replay in the existing PlanDecision owner. Required duration, both buffers, authored intent, Work, fixed authority and realized facts remain protected. No Sleep publication, execution, progress, history or legacy conversion was activated.

## 2. Scope and Governing Architecture

Task 9.10 remains the governing Sleep architecture. Tasks 9.11–9.13 supply authored revisions, durable identity, full physical domains, bounded joint feasibility and the shared planning qualification. This task adds only exact, occurrence-scoped corrective authority. The existing corrective UI and domain commands are reused.

## 3. Pre-Implementation Repository State

HEAD at entry: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. The tree was already dirty. A byte-for-byte baseline of 900 tracked and untracked, nonignored files was captured in `/tmp/dayframe-914-baseline`; inventory `/tmp/dayframe-914-files.json`; original status `/tmp/dayframe-914-status.txt`. No applicable AGENTS.md was found. No commit, push, dependency change or destructive cleanup was performed. Original status follows; these entries are earlier work, not the Task 9.14 change list.

```text
 M code/src/core/blocks/placeBlockCandidates.ts
 M code/src/core/blocks/types.ts
 M code/src/core/decisions/createPlanDecisionAcceptanceCandidate.ts
 M code/src/core/decisions/planDecision.ts
 M code/src/core/decisions/replayPlanDecisions.test.ts
 M code/src/core/decisions/replayPlanDecisions.ts
 M code/src/core/engine/generateSchedulePreview.ts
 M code/src/core/engine/reviseSchedulePreview.ts
 M code/src/core/engine/tests/generateSchedulePreview.test.ts
 M code/src/core/execution/executionRecord.ts
 M code/src/core/execution/historicalExecutionTarget.ts
 M code/src/core/friction/applySuggestedFix.ts
 M code/src/core/friction/types.ts
 M code/src/core/historicalPlan/historicalPlanFingerprint.ts
 M code/src/core/historicalPlan/historicalPlanValidation.ts
 M code/src/core/historicalPlan/materializePlanPublication.ts
 M code/src/core/occurrences/durableOccurrenceReference.ts
 M code/src/core/occurrences/occurrenceIdentity.ts
 M code/src/core/planning/acceptedAllocationRealization.ts
 M code/src/core/planning/allocation.ts
 M code/src/core/planning/capacity.ts
 M code/src/core/planning/competingDemand.ts
 M code/src/core/planning/goalFeasibility.ts
 M code/src/core/planning/proposal.ts
 M code/src/core/today/buildTodayReadModel.ts
 M code/src/state/activeV2.ts
 M code/src/state/activeV2Migration.test.ts
 M code/src/state/capacitySurface.ts
 M code/src/state/createInitialDayFrameState.ts
 M code/src/state/dayFrameBackup.ts
 M code/src/state/dayFrameProfiles.ts
 M code/src/state/dayFrameRestoreComposition.ts
 M code/src/state/dayFrameRestoreTranslation.ts
 M code/src/state/dayFrameStore.ts
 M code/src/state/historicalPlanSurface.test.ts
 M code/src/state/historicalPlanSurface.ts
 M code/src/state/lazyProposalSurface.ts
 M code/src/state/planningScopeQuery.test.ts
 M code/src/state/planningScopeQuery.ts
 M code/src/state/proposalSurface.ts
 M code/src/state/realizationSurface.ts
 M code/src/state/schedulePublication.test.ts
 M code/src/state/schedulePublication.ts
 M code/src/state/tests/dayFrameStore.test.ts
 M code/src/state/types.ts
 M code/src/ui/DayFrameApp.tsx
 M code/src/ui/GoalSection.tsx
 M code/src/ui/MonthlyPlannerSurface.tsx
 M code/src/ui/PlannerSurface.tsx
 M code/src/ui/PreviewScreen.tsx
 M code/src/ui/ScheduleReviewPanel.tsx
 M code/src/ui/TodaySurface.tsx
 M code/src/ui/acceptedDecisionPresentation.ts
 M code/src/ui/plannerReviewPresentation.ts
 M code/src/ui/scheduleReviewReadiness.ts
 M code/src/ui/tests/DayFrameApp.test.tsx
 M code/src/ui/tests/ScheduleReviewPanel.test.tsx
 M code/src/ui/tests/scheduleReviewReadiness.test.ts
 M docs/architecture/ARCHITECTURE_CHARTER.md
 M docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md
 M docs/architecture/DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md
?? DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf
?? code/src/core/engine/generatePlanningSchedule.ts
?? code/src/core/engine/tests/preMigrationCorrectness.test.ts
?? code/src/core/engine/tests/workRelativeFootprint.test.ts
?? code/src/core/occurrences/sleepOccurrenceReference.ts
?? code/src/core/planning/deriveFoundationalSchedule.ts
?? code/src/core/planning/foundationalPlanning.ts
?? code/src/core/planning/sleepPlanningIntegration.test.ts
?? code/src/core/sleep/
?? code/src/core/time/physicalOccupancy.ts
?? code/src/state/activeV3.ts
?? code/src/state/backupTransferSurface.ts
?? code/src/state/constructivePlanningWorkflow.ts
?? code/src/state/dayFrameBackupV13.ts
?? code/src/state/dayFrameProfilesV3.ts
?? code/src/state/publicationEligibility.ts
?? code/src/state/sleepFoundation.test.ts
?? code/src/state/sleepPlanningIntegration.test.ts
?? code/src/state/sleepResolutionQuery.test.ts
?? code/src/ui/GoalPlanningSection.tsx
?? code/src/ui/ScheduledGoalFacts.tsx
?? code/src/ui/planningResultCopy.ts
?? code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx
?? docs/adr/ADR_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTENCE_FOUNDATION.md
?? docs/implementation/phase-9/TASK_9.10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION.md
?? docs/implementation/phase-9/TASK_9.10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION_RESULT.md
?? docs/implementation/phase-9/TASK_9.11_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTANCE_FOUNDATION.md
?? docs/implementation/phase-9/TASK_9.11_FIRST_CLASS_SLEEP_DOMAIN_PERSISTENCE_FOUNDATION_RESULT.md
?? docs/implementation/phase-9/TASK_9.12_FIRST_CLASS_SLEEP_DERIVATION_AND_FEASIBILITY_FOUNDATION.md
?? docs/implementation/phase-9/TASK_9.12_FIRST_CLASS_SLEEP_DERIVATION_FEASIBILITY_FOUNDATION_RESULT.md
?? docs/implementation/phase-9/TASK_9.13_FIRST_CLASS_SLEEP_CAPACITY_AND_PLANNING_INTEGRATION_V1.md
?? docs/implementation/phase-9/TASK_9.13_FIRST_CLASS_SLEEP_CAPACITY_PLANNING_INTEGRATION_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.14_FIRST_CLASS_SLEEP_FRICTION_AND_CORRECTIVE_AUTHORITY_V1.md
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AND_WORKFLOW_AUDIT.md
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_AND_PRE_MIGRATION_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_PRE_MIGRATION_CONVERGENCE_RESULT.md
?? docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AND_WORKFLOW_AUDIT.md
?? docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
?? docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AND_AUTHORITY_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AUTHORITY_CONVERGENCE_V1_RESULT.md
```

## 4. Current Corrective Architecture Trace

Before implementation, traced `planDecision.ts`, `planDecisionSurface.ts`, generic replay, Friction types/application, acceptance-candidate mapping, store Preview revisions, accepted-choice presentation, Backup V13 validation, and Sleep derivation/occupancy/solver/qualification. The existing surface kept one live choice per target, updated generic runtime before persistence, and physically removed choices. Sleep needed validated atomic commit and retained revocation without changing those existing non-Sleep semantics.

## 5. Task 9.13 Foundation Consumed

`resolveRequiredSleep` still builds the Task 9.12 requested-plus-guard problem with full domains and canonical Work/fixed/manual/composition/realized occupancy. `deriveFoundationalSchedule` still applies the Task 9.13 expanded planning scope and `qualifyFoundationalPlanning` still translates only a satisfied derived witness into activity and before/after protection pieces. Capacity and Goal planning never read a decision payload as occupied time.

## 6. Corrective Authority Boundary

Only an explicit exact placement for one durable Sleep occurrence may be accepted. Suggested fixes and Try are derived; authored Sleep remains unchanged. Revocation removes the placement constraint, not required Sleep. Ordinary movable content stays outside the foundational hard-blocker set.

## 7. Sleep Friction Model

`FrictionPoint.kind = sleep` carries a discriminated `sleepEvidence`: `provenIncompatibility` or `acceptedPlacementReview`. Proven evidence includes complete required occurrences (references, revisions, owner days, requested/guard membership, duration, buffers and full derivation domains), canonical blockers with source references, proof scope, reason category and dependency fingerprint. Review evidence identifies decision records, applicability reasons, scope, current dependency fingerprint and underlying resolution status.

## 8. Sleep Friction Identity

IDs hash semantic evidence, excluding created/updated timestamps, message text, Preview IDs and rendered row position. Solver occurrences and blockers are sorted canonically. Fix IDs hash the complete candidate; one diagnostic candidate per distinct reviewed occurrence avoids duplicate paths. Authority fingerprints normalize unordered top-level collections while retaining ordered nested authored semantics.

## 9. Proven Incompatibility Classification

Only the unconstrained canonical result `infeasible` is classified as proven required-Sleep incompatibility. A constrained failure with a satisfied unconstrained problem is an accepted-placement review. Budget exhaustion, invalid authority and incomplete/protected coverage never manufacture an infeasibility proof. A constrained budget failure is `unresolvedFoundation`, not `pinConflict`.

## 10. Blocking / Ignore Semantics

Sleep Friction is critical, unresolved and `canIgnore: false`. Generic `applySuggestedFix` refuses Sleep-evidence mutations, including forged acceptConflict/omission/duration actions. It also refuses acceptConflict when canIgnore is false. Nonallocatable foundation qualification blocks downstream planning and readiness independently of presentation.

## 11. Suggested Fix Policy

A Sleep Suggested Fix carries a typed exact `placeSleepOccurrence` candidate through existing `moveBlock` presentation. Generic block movement never moves Sleep. Proven unconstrained infeasibility has no lawful move under identical hard authority and receives no fabricated fix. Review Friction can offer a validated replacement; explicit revocation remains available when replacement is unavailable.

## 12. Lawful Sleep Placement Corrections

The replacement begins with the canonical unpinned diagnostic witness, then re-runs the complete relevant problem with the target constrained to that exact placement and every other live pin preserved. A fix is offered only on `satisfied`. The domain `trySleepPlacement` also permits an explicit user-selected physical start and applies the same checks.

## 13. Prohibited Sleep Corrections

Strict decision discrimination rejects generic omission, shortening, priority and generic placement variants against Sleep references. Exact payload validation rejects extra fields, unsupported versions, altered elapsed duration, missing/reduced protection and non-minute UTC geometry. No splitting, disabling, window editing, Work movement, fixed movement, realized movement, one-off override or protection waiver is introduced.

## 14. Corrective Candidate Ordering

For each reviewed occurrence in durable-reference order, consider its canonical unpinned witness; at most eight reviewed targets are attempted per derivation. Accepted candidates sort by distance from preferred start, earlier physical start, then durable target key. Each candidate is fully joint-validated. The presentation bound is not an infeasibility proof: no suggested option means no supported option was established in this bounded correction pass, and the user may revoke or try another exact start.

## 15. Try Semantics

`trySleepPlacement` captures current authored and hard authority, derives current occurrences, constructs an exact candidate and solves a cloned counterfactual authority snapshot. It does not call persistence or mutate authority. Store Preview Try recomputes the full schedule using that counterfactual; the original decision remains durable until explicit Accept. Regeneration/restart discards an unaccepted Try. Direct user-selected Try uses user provenance; generated Suggested Fix candidates retain suggestedFix/moveBlock provenance.

## 16. Complete Joint Revalidation During Try

The target is not checked against a local gap alone. Canonical Work, fixed/manual/composition and realized occupancy, full requested/guard domains, every other live pin, duration and both buffers participate. Tests include two individually lawful pins that collide jointly, rejected out-of-domain footprints and duplicate exact constraints. No partial witness is accepted.

## 17. Accepted Sleep Placement Model

`AcceptedSleepPlacementPayloadV1` is explicitly version 1 and stores sleepStart/sleepEnd, footprintStart/footprintEnd, duration, both buffers, requirementRevision, complete-authority dependencyFingerprint, Try proof-scope labels and revokedAt. The enclosing PlanDecision stores version, durable target (requirement ID/incarnation/owner day/slot), ID, acceptedAt and provenance. Geometry never becomes identity.

## 18. PlanDecision Integration

Added `placeSleepOccurrence` to PlanDecision V1. The existing envelope version and `dayframe-plan-decisions-v1` key remain unchanged. This is safe under the established strict discriminated reader: an older reader rejects/quarantines an unknown kind instead of reinterpreting it as an ordinary decision. Unknown payload versions and extra fields also fail validation. No migration or separate Sleep storage silo is needed.

## 19. Accepted Placement Scope

One requirement lifetime, one canonical owner day, slot 0. Acceptance does not propagate to adjacent days, weekdays, shift segments or cycles. Relevant missing/recreated sources retain inapplicable evidence and block; irrelevant records outside the finite requested/guard physical scope do not pin that query.

## 20. Solver Constraint Integration

`solveRequiredSleep.exactPlacements` filters the existing lawful, minute-aligned candidate domain before the same joint DFS. It validates exact-constraint references, timestamps and uniqueness. It does not inject geometry after solving or subtract payload intervals directly from Capacity. Ordinary ranking resumes when a pin is revoked.

## 21. Accepted Placement Revalidation

Every fresh resolution checks record validity through the existing occupancy boundary, source lifetime/occurrence relevance, current duration, both buffers, full physical domain, hard occupancy and complete joint feasibility. `solveSleepPlacementAuthority` orchestrates unconstrained and constrained calls to the one solver; it is not a second feasibility implementation.

## 22. Revision Compatibility

Revision equality is not the applicability rule. A later compatible wider window preserves the exact geometry; changed duration/buffers, exclusion from the lawful domain, disabling or occurrence disappearance require review. Revision and original acceptance evidence remain stored. A stale Try fingerprint is rejected before a new acceptance even if a fresh Try might establish compatibility.

## 23. Source Incarnation Safety

Target keys include Sleep requirement ID and incarnation, owner day and slot. Source recreation and profile activation allocate a new incarnation and cannot rebind old decisions. The old record remains review evidence until explicitly revoked or superseded; full backup requires a matching source lifetime for each live pin.

## 24. Accepted Placement Applicability / Review State

Derived placementReviews distinguish applicable, reviewRequired, inapplicable and revoked. Reasons include compatible, incompatibleRequirement, sourceOrOccurrenceUnavailable, pinConflict, underlyingInfeasibility and unresolvedFoundation. Incompatible relevant live pins force contextIncomplete/nonAllocatable; an unpinned witness is diagnostic only. The accepted-choice UI exposes these statuses.

## 25. Pin-Induced Incompatibility

If the unconstrained problem is satisfied but the exact constrained problem is proven infeasible, review evidence says pinConflict. The resolver returns a blocking review result, not the unpinned witness as authoritative planning. Current correction/revocation is required. Other unavailable constrained results remain unresolvedFoundation.

## 26. Underlying Sleep Infeasibility

An old pin cannot conceal unconstrained infeasibility. The underlying proof and blockers remain the canonical infeasible result, alongside placement review evidence. Moving ordinary flexible content cannot resolve this proof because it was never a hard blocker. No Sleep move fix is fabricated for the unchanged impossible problem.

## 27. Acceptance Freshness

The candidate fingerprint covers current authored setup, decisions, realized facts and composition authority/sources. Accept compares it to a fresh snapshot, re-runs Try over the recorded proof scope, checks exact payload equivalence and source resolution, then writes. Tests change Work, Sleep, manual Event, realized facts, source incarnation and boundary settings between Try and Accept; all stale requests are rejected without a decision write.

## 28. Atomicity and Idempotence

Sleep acceptance validates before allocating/writing authority. The complete decision envelope is serialized and verified in memory, then a single Web Storage setItem is the atomic commit point; runtime/desired state and notifications follow success. A throwing setItem leaves no pending Sleep authority to retry. A successful setItem is not misreported as failure because a later read becomes unavailable. This relies on the native Web Storage atomic-operation contract, not a multi-write rollback. Repeated equivalent durable acceptance returns the original record.

## 29. Revocation Model

The existing removePlanDecision command explicitly revokes Sleep by setting revokedAt on the existing record; it does not delete the record or requirement. UI labels the action Revoke and disables an already-revoked row. Superseding acceptance atomically marks prior live same-target Sleep records revoked and appends the new record, preserving prior geometry, acceptedAt and provenance. Generic decision removal retains its existing behavior.

## 30. Revocation Replay / Re-Solve

Revoked records are reported but contribute no exact constraint. A fresh canonical solve chooses ordinary ranking from current requirements and hard authority. Revoke is idempotent and persisted in the same envelope; restart cannot restore a revoked pin. Failed revocation leaves the active record intact.

## 31. Planning Integration After Accepted Placement

The production store routes relevant live/revoked Sleep decisions and protected/quarantined decision ingress through the foundational schedule path. Applicable pins yield a constrained solved witness. Review states block qualification. Flexible scheduling and subsequent planning consume that shared witness; no separate accepted-geometry placement path exists.

## 32. Capacity / Goal Planning Consequences

Capacity sees only qualified derived Sleep pieces and current hard occupancy. Existing Task 9.13 nonallocatable behavior propagates through feasibility, competition, allocation and Proposal. Accepted-pin changes alter the witness/fingerprint and stale caller-held planning is freshly checked. Tests exercise current Capacity, constructive planning, competing allocation and review blocking; existing focused planning tests cover the remaining stage contracts.

## 33. Accepted Allocation / Realization Consequences

Existing Accepted Allocation authority remains intact. An overlapping new Sleep pin prevents realization with sleepFoundationReviewRequired, and revocation can restore eligibility. If Goal facts realize between Sleep Try and Accept, stale acceptance is rejected; a new overlapping Try also fails. Productive facts, support and protection remain hard authority, never moved or deleted.

## 34. Preview Integration

Preview stores only a counterfactual derived result for Try and retains the existing explicit acceptance step. Sleep Friction needs no fake scheduled block: the existing day grouping now locates it by proof-scope intersection. The accepted-choice list shows review/revoked status and explicit Revoke without requiring a current Preview. No Sleep scheduled-block/publication identity is created.

## 35. Publication Readiness Consequences

Nonallocatable foundation causes unknown planning coverage; unresolved Friction and Try revision independently block publication readiness. Protected/unknown decision authority is not treated as absence. Readiness remains an eligibility check only: this task does not publish Sleep or add Sleep execution/history subjects.

## 36. Persistence Ownership

PlanDecision remains the sole accepted-placement owner. Active V3 continues to contain authored Sleep intent only; Profiles V3 and Backup V13 retain their existing versions and keys. Quarantine and recovery remain in the existing decision surface. The only persisted extension is the strict versioned Sleep payload and retained revocation semantics in that owner.

## 37. Profile Semantics

Saved profiles contain portable authored Sleep revisions, with no accepted placement or live incarnation. Loading a profile creates a fresh lifetime. Existing old decisions are not transported into that new lifetime; if still relevant they are visibly inapplicable and block rather than silently retarget.

## 38. Full Backup Semantics

Backup V13 roundtrips authored Sleep lineage plus exact accepted/revoked decision records through the existing decision surface. The V12 validation chain still validates all established authority; V13 additionally checks each live Sleep target against the original V3 source lifetime. No legacy publication or execution data is rewritten.

## 39. Restore / Protection Semantics

Strict malformed/unknown decision records quarantine or reject at existing ingress. Full backup import with a missing/wrong live Sleep source lifetime is rejected before replacement. Revoked evidence may retain a historical source reference. Current incompatible-but-same-lifetime placement remains a review state after revalidation. V13 restore uses the existing coordinator and exact runtime adapters.

## 40. Clear / Anti-Resurrection

The existing full clear removes the decision checkpoint and runtime/desired retry state along with authored/profile authority. New acceptance/revocation shares that owner, so no independent Sleep cache can resurrect it. Tested clear, retry and restart, plus earlier restore rollback and anti-resurrection suites.

## 41. Friction Matrix

| Sleep State | Proven Incompatibility? | Sleep Friction? | Blocking? | Ignore Allowed? | Corrective Path |
|---|---|---|---|---|---|
| notConfigured | No | No | No, absent relevant live pin | N/A | Author Sleep separately |
| notApplicable | No | No | No, absent relevant live pin | N/A | None |
| satisfied | No | No | No | N/A | Explicit domain Try if desired |
| infeasible | Yes | Proven proof | Yes | No | Review hard/authored inputs; no fabricated move |
| searchIncomplete | No | No physical proof | Yes | No bypass | Resolve bounded search uncertainty |
| contextIncomplete | No | No physical proof | Yes | No bypass | Restore complete context |
| invalid | No | No physical proof | Yes | No bypass | Correct invalid authority |
| protected | No | No physical proof | Yes | No bypass | Existing recovery |
| accepted placement reviewRequired | Only if underlying separately proven | Distinct review evidence | Yes | No | Lawful replacement or explicit revoke |

## 42. Suggested-Fix Matrix

| Fix Class | Allowed? | Authority Changed | Sleep Duration Preserved? | Buffers Preserved? | Requires Full Re-Solve? |
|---|---|---|---|---|---|
| Move Sleep within lawful domain | Yes | PlanDecision on explicit Accept only | Yes | Yes | Yes |
| Move ordinary flexible Commitment | Existing family | Existing decision semantics | Yes | Yes | Current foundation retained/rechecked |
| Move Work | No | None | Yes | Yes | Not offered |
| Move fixed Commitment | No Sleep fix | None | Yes | Yes | Not offered |
| Move realized Goal work | No | None | Yes | Yes | Not offered |
| Omit Sleep | No | None | Yes | Yes | Rejected |
| Shorten Sleep | No | None | Yes | Yes | Rejected |
| Reduce Sleep buffer | No | None | Yes | Yes | Rejected |
| Disable Sleep requirement | No corrective action | None | Yes | Yes | Separate authored command only |
| Edit authored Sleep window | No corrective action | None | Yes | Yes | Separate authored command only |

## 43. Accepted-Authority Matrix

| State | Decision Persisted? | Constrains Solver? | May Planning Proceed? | User Action | Evidence Retained? |
|---|---|---|---|---|---|
| no accepted placement | No | No pin | If foundation satisfied/safely absent | Optional Try | Derived proof |
| accepted + applicable | Yes | Exact candidate domain | Yes | Revoke/change if desired | Yes |
| accepted + reviewRequired | Yes | May not silently discard pin | No | Correct/revoke | Yes |
| accepted + source missing/recreated | Yes | No retarget; blocking review | No when relevant | Revoke | Yes |
| revoked | Yes | No | Fresh canonical qualification | None | Yes |
| malformed/protected | Raw protected/quarantined | Never trusted | No | Existing recovery | Yes |

## 44. Authority Matrix

| Object | Layer | Persisted? | Owns/Constrains Time? | May 9.14 Move It? | May 9.14 Delete It? |
|---|---|---|---|---|---|
| SleepRequirementV1 | Authored | Yes | Defines mandatory domain/duration/protection | No | No corrective deletion |
| SleepOccurrenceV1 | Derived | No | Defines one required occurrence | No identity change | No |
| ScheduledSleepOccurrenceV1 | Derived | No | Qualified physical witness | Lawful solver placement | No omission |
| Sleep Friction | Derived | No | Blocks readiness | Recomputed | Recomputed only |
| Sleep Suggested Fix | Derived | No | None before Accept | Counterfactual only | Recomputed |
| Accepted Sleep placement | Accepted | Yes | Exact solver constraint | Explicit replacement | Revoke retains record |
| Work | Authored/derived | Existing | Hard | No | No |
| Fixed Commitment | Authored/accepted | Existing | Hard | No Sleep fix | No |
| Movable Commitment | Authored/derived | Existing | Subordinate to foundation | Existing ordinary correction | Existing semantics only |
| Accepted Allocation | Accepted | Yes | Liability; unrealized not hard occupancy | No | No |
| Realized Goal work | Realized | Yes | Hard | No | No |
| Published Plan | Published | Yes | Historical authority | No | No |

## 45. Persistence Matrix

| Surface | Accepted Sleep Placement Stored? | Lifetime Behavior | Restore Behavior | Protection Behavior |
|---|---|---|---|---|
| Active authored setup | No | Authored incarnation preserved | Existing V3 | Existing active protection |
| PlanDecision authority | Yes | Exact target; revoked evidence retained | Strict V1 envelope | Quarantine/recovery blocks |
| Profile | No | Fresh incarnation on activation | Portable authored intent | Cannot inherit pins |
| Full Backup | Yes | Exact incarnation and decision provenance | V13 strict validation | Invalid live references rejected |
| Restore | Existing owner participant | No retarget | Existing coordinator/exact adapters | Reject before replacement |
| Clear | Removed | No pending pin resurrection | N/A | Existing clear/retry boundary |
| Preview | Derived Try only | No authority lifetime | Not restored as acceptance | Stale/Try readiness blocks |
| Publication | No new Sleep authority | Unchanged | Unchanged | Existing Sleep-target prohibition |
| Execution | No new Sleep authority | Unchanged | Unchanged | Existing Sleep-target prohibition |

## 46. Corrective Workflow Matrix

| Stage | Derived or Authority? | Writes? | Fresh Revalidation? | May Change Sleep Requirement? |
|---|---|---|---|---|
| detect Friction | Derived | No | Consumes current canonical result | No |
| generate Suggested Fix | Derived | No | Full joint solve per candidate | No |
| Try | Derived | Preview memory only when UI invoked | Yes | No |
| Accept | Accepted | One atomic envelope commit | Yes, before write | No |
| replay accepted placement | Derived | No | Every query | No |
| applicability/review query | Derived | No | Every query | No |
| Revoke | Accepted lifecycle | Same owner commit | Strict record validation | No |
| re-solve after revoke | Derived | No | Fresh canonical solve | No |

## 47. Behavioral Invariants

All 100 requested invariants are retained below with the implementation/test evidence family. Evidence combines new behavior tests and the unchanged owners exercised in the focused/full regressions; this is not a claim of 100 separately named tests.

| # | Invariant | Evidence |
|---|---|---|
| 1 | First-Class Sleep remains authored through `SleepRequirementV1`. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 2 | Sleep occurrence identity remains source lifetime + owner day + slot. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 3 | Accepted placement does not change occurrence identity. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 4 | Accepted placement does not rewrite authored Sleep. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 5 | Accepted placement is bounded to one occurrence. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 6 | Accepted placement does not propagate automatically. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 7 | Accepted placement preserves exact Sleep duration. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 8 | Accepted placement preserves exact before-buffer. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 9 | Accepted placement preserves exact after-buffer. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 10 | Accepted placement must remain inside lawful Sleep domain. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 11 | Accepted placement must respect Work. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 12 | Accepted placement must respect fixed authority. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 13 | Accepted placement must respect realized facts. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 14 | Accepted placement must preserve joint Sleep feasibility. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 15 | Canonical solver remains feasibility owner. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 16 | No second pin solver exists. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 17 | Accepted placement constrains solver rather than bypassing it. | C exact replay, prohibited payloads, joint collision; D/O canonical hard occupancy; P planning witness |
| 18 | `infeasible` may create Sleep Friction. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 19 | `searchIncomplete` is not Sleep incompatibility Friction. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 20 | `contextIncomplete` is not Sleep incompatibility Friction. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 21 | `invalid` is not physical incompatibility Friction. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 22 | `protected` is not physical incompatibility Friction. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 23 | Required-Sleep Friction is blocking. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 24 | Required-Sleep Friction cannot be ignored. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 25 | Sleep Friction retains machine-readable proof evidence. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 26 | Friction identity is semantic. | C proof/unknown/ignore tests; U proof-scope rendering; R readiness |
| 27 | Suggested Fix is corrective, not constructive Proposal. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 28 | Move-Sleep fix uses lawful canonical Sleep candidates. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 29 | Move-Sleep fix requires complete joint re-solve. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 30 | Suggested Fix cannot omit Sleep. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 31 | Suggested Fix cannot shorten Sleep. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 32 | Suggested Fix cannot split Sleep. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 33 | Suggested Fix cannot reduce buffers. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 34 | Suggested Fix cannot disable Sleep. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 35 | Suggested Fix cannot move Work. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 36 | Suggested Fix cannot move fixed authority. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 37 | Suggested Fix cannot move realized Goal work. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 38 | Suggested Fix ordering is deterministic. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 39 | Equivalent Suggested Fixes deduplicate. | C lawful/no-fix/prohibited/joint/permutation tests; sleepCorrective canonical ordering |
| 40 | Try is non-authoritative. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 41 | Try does not persist PlanDecision. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 42 | Try does not mutate authored Sleep. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 43 | Try does not mutate realized authority. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 44 | Try evaluates the complete relevant Sleep problem. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 45 | Successful Try does not imply acceptance. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 46 | Acceptance is explicit. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 47 | Acceptance revalidates current authority. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 48 | Stale Try cannot create invalid accepted authority. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 49 | Acceptance persistence is atomic. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 50 | Acceptance is idempotent. | S pure Try, freshness, atomic failure, idempotence; P realized-between-Try/Accept |
| 51 | Accepted placement survives restart when valid. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 52 | Accepted placement is source-incarnation safe. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 53 | Delete/recreate cannot rebind old placement. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 54 | Accepted placement is revalidated on every fresh Sleep resolution. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 55 | Revision number alone does not determine applicability. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 56 | Compatible current semantics may preserve placement. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 57 | Incompatible current semantics require review. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 58 | Stale accepted placement is retained as evidence. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 59 | Stale accepted placement is not silently ignored. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 60 | Pin-induced incompatibility is distinct from underlying Sleep infeasibility. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 61 | Underlying infeasibility remains detectable with an old pin. | C revision/incarnation/pin-versus-underlying tests; S restart and retained evidence |
| 62 | Revocation is explicit. | S revoke/idempotence/restart/failure; C fresh unpinned ranking |
| 63 | Revocation does not alter authored Sleep. | S revoke/idempotence/restart/failure; C fresh unpinned ranking |
| 64 | Revocation does not omit Sleep. | S revoke/idempotence/restart/failure; C fresh unpinned ranking |
| 65 | Revocation removes exact-placement constraint prospectively. | S revoke/idempotence/restart/failure; C fresh unpinned ranking |
| 66 | Revocation preserves decision provenance. | S revoke/idempotence/restart/failure; C fresh unpinned ranking |
| 67 | Revocation is idempotent. | S revoke/idempotence/restart/failure; C fresh unpinned ranking |
| 68 | Re-solve after revocation uses canonical unpinned ranking. | S revoke/idempotence/restart/failure; C fresh unpinned ranking |
| 69 | Downstream Capacity consumes derived solved Sleep, not decision geometry directly. | P accepted-pin Capacity/planning/realization tests; O hard realized facts |
| 70 | Goal planning consumes derived solved Sleep consequences. | P accepted-pin Capacity/planning/realization tests; O hard realized facts |
| 71 | Existing Accepted Goal Allocation is not silently deleted. | P accepted-pin Capacity/planning/realization tests; O hard realized facts |
| 72 | Realization is revalidated after Sleep placement changes. | P accepted-pin Capacity/planning/realization tests; O hard realized facts |
| 73 | Existing realized facts are not moved. | P accepted-pin Capacity/planning/realization tests; O hard realized facts |
| 74 | Existing realized facts are not deleted. | P accepted-pin Capacity/planning/realization tests; O hard realized facts |
| 75 | Profiles do not accidentally inherit live occurrence pins across fresh incarnations. | S profile/backup/restore/quarantine/clear/readiness; U visible controls |
| 76 | Full backups preserve valid accepted Sleep authority. | S profile/backup/restore/quarantine/clear/readiness; U visible controls |
| 77 | Restore validates accepted Sleep references. | S profile/backup/restore/quarantine/clear/readiness; U visible controls |
| 78 | Malformed accepted Sleep authority fails safely. | S profile/backup/restore/quarantine/clear/readiness; U visible controls |
| 79 | Clear prevents accepted Sleep authority resurrection. | S profile/backup/restore/quarantine/clear/readiness; U visible controls |
| 80 | Preview does not own accepted Sleep authority. | S profile/backup/restore/quarantine/clear/readiness; U visible controls |
| 81 | Regeneration replays canonical accepted authority. | S profile/backup/restore/quarantine/clear/readiness; U visible controls |
| 82 | Publication readiness cannot ignore unresolved Sleep corrective authority. | S profile/backup/restore/quarantine/clear/readiness; U visible controls |
| 83 | No First-Class Sleep publication is added. | C strict prohibited variants; S/P nonactivation; F earlier historical/legacy boundary suites |
| 84 | No First-Class Sleep execution is added. | C strict prohibited variants; S/P nonactivation; F earlier historical/legacy boundary suites |
| 85 | No Sleep Progress is added. | C strict prohibited variants; S/P nonactivation; F earlier historical/legacy boundary suites |
| 86 | No legacy conversion is added. | C strict prohibited variants; S/P nonactivation; F earlier historical/legacy boundary suites |
| 87 | No one-off Sleep override is added. | C strict prohibited variants; S/P nonactivation; F earlier historical/legacy boundary suites |
| 88 | No omission authority is added. | C strict prohibited variants; S/P nonactivation; F earlier historical/legacy boundary suites |
| 89 | No shortening authority is added. | C strict prohibited variants; S/P nonactivation; F earlier historical/legacy boundary suites |
| 90 | No protection-waiver authority is added. | C strict prohibited variants; S/P nonactivation; F earlier historical/legacy boundary suites |
| 91 | Pure corrective queries are deterministic. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 92 | Pure corrective queries do not mutate authority. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 93 | Accepted authority and derived geometry remain separate. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 94 | Authored requirement and accepted occurrence correction remain separate. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 95 | Sleep Friction and Goal Proposal remain separate. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 96 | Planning still adapts to Sleep rather than moving Sleep implicitly. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 97 | Accepted placement can only arise from explicit user authority. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 98 | Revoked placement cannot continue constraining fresh planning. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 99 | Unknown accepted-decision authority cannot be treated as absence. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |
| 100 | Task 9.14 adds bounded corrective authority without weakening required Sleep. | C determinism/purity/identity; S explicit acceptance/revocation; P shared qualification |


## 48. Friction Test Coverage

C (`core/sleep/sleepCorrective.test.ts`) verifies typed proof, timestamp-independent identity, no fabricated fix, unignorable evidence and unknown-state distinctions. U (`ui/tests/PreviewScreen.test.tsx`) verifies Friction with no fake block IDs is visible and actionable by proof scope. R (`state/sleepPlanningIntegration.test.ts`) verifies readiness remains blocked.

## 49. Suggested Fix Test Coverage

C covers lawful pin-review replacement, underlying impossibility with no move, strict prohibited variants/fields, elapsed geometry and full buffers. Determinism is checked under repeated input and joint-domain/decision permutations. Each target contributes at most one canonical diagnostic candidate; fixes use semantic IDs and canonical ordering.

## 50. Try Test Coverage

C verifies input immutability, exact derived geometry, whole-joint collisions and out-of-domain footprints. S (`state/sleepCorrectiveIntegration.test.ts`) verifies no durable write, restart without acceptance, existing Preview revision and acceptance-candidate mapping. P verifies newly realized facts reject overlapping Try.

## 51. Acceptance Test Coverage

S covers explicit acceptance, equivalent repeat acceptance, durable restart, stale snapshot rejection, direct-surface bypass denial, failed setItem atomicity, no retry resurrection and the successful-commit/later-read-failure boundary. The single native storage write happens only after current canonical validation.

## 52. Freshness / Revision Compatibility Coverage

C checks wider-window compatibility and changed duration, before buffer, after buffer, disabled applicability and excluded window. S checks Work, authored Sleep, manual Event, source recreation and boundary edits. P adds realization between Try and Accept. Failed acceptance leaves decision authority unchanged.

## 53. Incarnation / Replay Coverage

C checks source recreation without retargeting and exact one-owner scope/no automatic propagation. S checks durable replay, retained superseded decisions and profile-induced fresh lifetime review. Existing Sleep identity and replay suites remain green.

## 54. Pin-Induced Conflict Coverage

C establishes a feasible underlying problem with a conflicting pin and a valid replacement, then makes hard occupancy fully incompatible and checks underlying infeasibility. A separate two-occurrence joint collision verifies that individually legal pins are not sufficient. Diagnostic unpinned geometry never qualifies planning while review remains.

## 55. Revocation Coverage

S covers explicit revoke, original ID/acceptedAt/provenance retention, repeated revoke, restart, failed revoke and supersession. C compares revoked resolution with fresh canonical unpinned ranking. U names the action Revoke and disables the retained revoked row.

## 56. Backup / Profile / Restore / Clear Coverage

S roundtrips live and revoked authority through Backup V13/coordinator/restart, rejects wrong source lifetime before replacement, checks profile omission/fresh incarnation, malformed payload quarantine, and clear/retry/restart anti-resurrection. F (`state/sleepFoundation.test.ts`) additionally exercises the preexisting restore rollback and profile/legacy translation boundaries.

## 57. Planning / Capacity / Goal Coverage

P adds accepted-placement effects on fresh Capacity, constructive planning and competing allocation, plus review-induced blocking. Existing core planning suites cover feasibility/competition/allocation/Proposal and foundation fingerprints; no direct decision-payload occupancy path was introduced.

## 58. Accepted Allocation / Realization Coverage

P proves accepted Goal authority remains byte-equivalent through Sleep acceptance; overlapping realization is denied; revoke restores lawful realization. Realized-between-Try/Accept invalidates acceptance and a fresh overlapping Try. Existing O (`core/sleep/sleepOccupancy.test.ts`) covers productive work, support activity and buffer protection as hard facts.

## 59. Publication-Readiness Coverage

P/S verify unknown coverage and unresolved Sleep Friction block publication readiness. U verifies visible Friction. Existing publication suites cover Try/stale/protected readiness and historical Sleep-target rejection. No publication side effect is introduced by a corrective command.

## 60. Non-Activation Coverage

New state tests inspect decision and backup authority without creating Sleep execution records. Existing Sleep foundation, historical, realization and generic decision suites exercise publication/execution/history/legacy separation. No progress, learning, legacy conversion, omission, shortening or waiver owner was added.

## 61. Determinism / Non-Mutation Coverage

C compares pure input before/after Try, repeated fix output and permuted joint inputs; S compares durable storage and authority before Try and rejected acceptance. Canonical candidate sorting and normalized authority fingerprint inputs are explicit. UUID allocation and clocks are used only for accepted record lifecycle, not feasibility ranking.

## 62. Performance Assessment

Measured production pure functions using emitted TypeScript (`/tmp/dayframe-914-compiled`) and `/tmp/dayframe-914-benchmark.mjs`; one warm-up and five timed samples, no concurrent full test run. Seven-, 31- and 90-owner-day clock-domain fixtures include 120-minute Sleep and both 30-minute buffers. Detection includes fresh resolution of an impossible problem; fix generation includes full joint validation of a pin-conflict alternative. Replay/revoke timings include fresh resolution, not browser storage/UI.

| Owner days | Stage | Median ms | Max ms | Returned solver work |
|---|---|---|---|---|
| 7 | detect | 4.22 | 6 | — |
| 7 | generateFix | 5.84 | 8.43 | — |
| 7 | Try | 10.15 | 11.04 | — |
| 7 | replay | 3.1 | 3.79 | 2114 |
| 7 | revokeReSolve | 2.53 | 2.9 | 2114 |
| 31 | detect | 6.62 | 10.52 | — |
| 31 | generateFix | 16.72 | 17.53 | — |
| 31 | Try | 13.03 | 15.62 | — |
| 31 | replay | 7.08 | 7.89 | 9362 |
| 31 | revokeReSolve | 5.53 | 6.87 | 9362 |
| 90 | detect | 13.23 | 19.57 | — |
| 90 | generateFix | 30.79 | 39.76 | — |
| 90 | Try | 28.87 | 38.12 | — |
| 90 | replay | 16.41 | 16.92 | 27240 |
| 90 | revokeReSolve | 13.02 | 21.62 | 27240 |

Adversarial five-occurrence overlapping full-domain case: budget 10,000; `searchIncomplete` after exactly 10,000 work units; median 2.26 ms, max 2.39 ms. No false infeasible result. Default canonical budget stays 1,000,000 per solve (existing maximum override 10,000,000). Replay may perform an unconstrained and constrained solve; each Try can perform both current and trial resolution. Fix generation attempts at most eight reviewed targets, each with complete bounded solves. These are finite deterministic work bounds; no wall-clock deadline decides feasibility. Search diagnostics on a returned result describe that returned solver pass, not aggregate orchestration cost.

Pinned adversarial corrective replay of the same five-occurrence problem: median 4.72 ms, max 5.59 ms; result `contextIncomplete`, underlying `searchIncomplete`, review reason `unresolvedFoundation`, budget 10,000 per canonical solve. This confirms bounded uncertainty remains a blocking review rather than a fabricated pin-conflict or physical-incompatibility claim.

## 63. Bundle Assessment

Final `npm run check:bundle` passed. Initial gzip **169,577 bytes**, versus Task 9.13 **167,553**, delta **+2,024**; hard limit **170,000**, remaining headroom **423**. Initial raw **656,207**; largest lazy chunk **53,188**; total emitted **1,068,512**, versus 1,053,542 previously (delta +14,970). Existing startup warning thresholds and total architecture-review warning remain exceeded; all hard thresholds pass. No threshold was changed. Growth is the typed decision validator/lifecycle and small corrective presentation adapters plus lazy Sleep orchestration; no new dependency or large eager solver import.

## 64. Architecture Governance Assessment

No architecture charter change was needed: the new discriminant remains bounded accepted corrective authority in PlanDecision; the existing canonical solver owns feasibility; the shared foundation owns planning qualification; Profile/Backup/restore/clear preserve their established roles. No extra persistence silo, dependency, solver, historical mutation, generalized constraint engine or UI redesign was introduced. The lazy foundation import keeps correction search outside startup JavaScript; only decision validation/lifecycle and small UI adapters are eager.

## 65. Test Coverage

Test families used above: C = core Sleep corrective; D = Sleep derivation/offset/solver; O = Sleep occupancy; S = state Sleep corrective integration; P/R = state/core Sleep planning integration and readiness; F = Sleep foundation; U = PreviewScreen and accepted-decision presentation. New task-specific coverage adds 54 tests: 33 core corrective, 16 state corrective, three planning/realization, and two UI tests. Existing regression cases were preserved except one obsolete no-Sleep-Friction expectation, updated to the now-authorized typed Friction behavior, and a generic test helper narrowed to its actual non-Sleep variants.

## 66. Validation Record

All final commands below ran from `code/` unless marked repository root. Logs are retained under `/tmp/dayframe-914-*`; counts are actual results, not planned checks.

| Command | Final result | Evidence |
|---|---|---|
| `npm run format` | PASS | `format-final.log` |
| `npx prettier --check .` | PASS, all matched files formatted | `format-check.log` |
| `npm run lint` | PASS, exit 0 | `lint-final.log` |
| `npm run build` | PASS, TypeScript no-emit check and Vite production build | `build-final.log` |
| `npm test` | PASS: 138 files, 1,354 tests; 36.37 s | `full-final.log` |
| Focused command below | PASS: 65 files, 596 tests; 12.79 s | `focused-wide-final.log` |
| `npm run check:bundle` | PASS hard policy; existing warning tiers reported | `bundle-final.log` |
| `npx tsc --noEmit false --outDir /tmp/dayframe-914-compiled` | PASS; temporary benchmark output only | `compile.log` |
| `node /tmp/dayframe-914-benchmark.mjs` (root) | PASS; measured results in Section 62 | `performance.log` |
| `git diff --check` (root) | PASS | Final repository hygiene check |

Exact focused command:

```sh
npx vitest run src/core/sleep src/core/friction src/core/decisions src/core/planning src/core/engine src/core/blocks src/core/cycles src/core/time src/core/occurrences src/state/sleep src/state/planDecisionSurface.test.ts src/state/dayFrameBackup src/state/dayFrameRestoreComposition.test.ts src/state/dayFrameProfiles.test.ts src/state/proposalSurface.test.ts src/state/realizationSurface.test.ts src/state/schedulePublication.test.ts src/ui/acceptedDecisionPresentation.test.ts src/ui/tests/PreviewScreen.test.tsx src/ui/tests/scheduleReviewReadiness.test.ts
```

This focused selection covers Sleep identity/requirements/derivation/occupancy, Friction/Suggested Fix/Try, decisions/replay/persistence/revocation, foundation planning, Capacity/feasibility/competition/allocation/Proposal/realization, backup/restore/profiles/clear, readiness, legacy placement, Work-relative footprints, canonical boundaries and cycle transitions. The full suite additionally covers all UI/application, historical and other existing owners.

Earlier development runs are not hidden: the first core run had 28/29 passing because a manual Event fixture used unsupported fields; the first store integration run had 42/44 passing because Preview fixtures lacked required Work setup; the next had 43/44 because the Work-edit fixture attempted to remove a referenced definition instead of editing its existing ID. Those fixtures were corrected, and the combined core/store/planning run passed 54/54. TypeScript also caught new test calls missing existing query/range fields, and a generic presentation test helper needed narrowing after the decision union extension. No baseline production behavior was weakened to make those tests pass. Subsequent broad runs passed 198 focused tests, then 596 focused tests and the complete 1,354-test suite. The UI trace identified and corrected a real proof-scope grouping omission, with dedicated UI tests added before final validation. Final implementation changes received the final full and focused runs recorded above. The final structural audit verified exactly 69 report sections, every one of the 25 task files accounted for, 880 byte-identical baseline files, no baseline deletion and unchanged HEAD.


## 67. Changed Files

Task-local comparison: **25 files** (20 existing baseline files changed, four new code/test files, this one new RESULT); **880 of 900 baseline files remain byte-identical**, with no baseline deletion. Git diff against HEAD also includes earlier Phase 9 work and is not a Task 9.14-only diff. In the table, “pre-existing modification” includes earlier untracked files present in the captured baseline. Every row describes only the Task 9.14 additional modification.

| File | Entry state | Classification; purpose and semantic change | Authority / persistence impact | Schema/version impact | Tests |
|---|---|---|---|---|---|
| `code/src/core/decisions/createPlanDecisionAcceptanceCandidate.ts` | Pre-existing modification; Task 9.14 additional modification | Try / PlanDecision. Maps only a satisfied exact Sleep Try witness to the existing explicit acceptance step. | No write; validates derived handoff. | None | C, S |
| `code/src/core/decisions/planDecision.ts` | Pre-existing modification; Task 9.14 additional modification | PlanDecision / Accepted Sleep Placement. Adds strict versioned exact Sleep payload, target-family restrictions and live-versus-revoked conflict key. | Bounded accepted placement only. | V1 discriminant extension; same envelope/key | C, S, generic PlanDecision |
| `code/src/core/decisions/replayPlanDecisions.ts` | Pre-existing modification; Task 9.14 additional modification | Decision Replay. Routes Sleep away from generic template-block replay to canonical Sleep solving. | Prevents generic placement/omission interpretation. | None | C, generic replay |
| `code/src/core/friction/applySuggestedFix.ts` | Pre-existing modification; Task 9.14 additional modification | Friction / Try. Rejects generic mutation of Sleep evidence and forbidden Ignore. | No bypass of requiredness. | None | C, Friction regression |
| `code/src/core/friction/types.ts` | Pre-existing modification; Task 9.14 additional modification | Sleep Friction / Suggested Fix. Adds typed proof/review evidence and exact candidate field. | Derived only. | None | C, S, U |
| `code/src/core/planning/deriveFoundationalSchedule.ts` | Pre-existing modification; Task 9.14 additional modification | Planning Integration / Preview. Adds current Sleep Friction to nonallocatable schedule and exports lazy corrective functions. | One shared qualification/witness. | None | P, C, S |
| `code/src/core/sleep/resolveRequiredSleep.ts` | Pre-existing modification; Task 9.14 additional modification | Sleep Solver. Hands full canonical problem and decisions to bounded placement orchestration. | Current authority only. | None | C, D, O, P |
| `code/src/core/sleep/sleepCorrective.test.ts` | New in Task 9.14 | Test. Adds 33 pure proof/placement/compatibility/joint/revocation/identity tests. | Test only. | None | C |
| `code/src/core/sleep/sleepCorrective.ts` | New in Task 9.14 | Sleep Friction / Suggested Fix / Try. Produces semantic proof/fixes, authority freshness fingerprints and pure exact trial solve. | Derived only; no persistence calls. | None | C, S, U |
| `code/src/core/sleep/sleepFoundationalOccupancy.ts` | Pre-existing modification; Task 9.14 additional modification | Decision Replay / Sleep Solver. Validates all decisions, excludes Sleep from ordinary-template replay. | Preserves hard occupancy ownership. | None | D, O, C |
| `code/src/core/sleep/sleepPlacementAuthority.ts` | New in Task 9.14 | Accepted Sleep Placement / Revocation. Derives applicability and distinguishes underlying infeasibility from constrained failure. | Fail-closed review, revoked constraints absent. | None; reads existing decisions | C, S, P |
| `code/src/core/sleep/sleepResolution.ts` | Pre-existing modification; Task 9.14 additional modification | Accepted Sleep Placement / Protection. Carries derived review and unpinned diagnostic evidence. | Diagnostic geometry cannot qualify planning. | None | C, S, P |
| `code/src/core/sleep/solveRequiredSleep.ts` | Pre-existing modification; Task 9.14 additional modification | Sleep Solver. Filters canonical candidate domains with validated exact constraints before joint search. | Only the solver grants a witness. | None | C, D |
| `code/src/state/dayFrameBackupV13.ts` | Pre-existing modification; Task 9.14 additional modification | Backup / Restore / Protection. Checks live Sleep decision source lifetimes against original Active V3. | Rejects invalid imports before replacement. | Same Backup V13; stricter new-variant validation | S, F, Backup suites |
| `code/src/state/dayFrameStore.ts` | Pre-existing modification; Task 9.14 additional modification | Store / Query / Try / Preview. Captures current authority, validates fresh acceptance, exposes Try and recomputes counterfactual Preview. | Explicit decision writes through owner; Preview stays derived. | No new store/key/version | S, P, UI regressions |
| `code/src/state/planDecisionSurface.ts` | Clean at entry; changed by Task 9.14 | Decision Persistence / Revocation / Clear. Single atomic Sleep commit; strict admission; idempotence; retained revocation/supersession; conflict validation. | Sleep authority changes only after valid explicit command. | Same V1 key/envelope; archived revoked records retained | S, decision-surface and restore regressions |
| `code/src/state/sleepCorrectiveIntegration.test.ts` | New in Task 9.14 | Test. Adds 16 production store lifecycle/persistence/freshness/restore/readiness tests. | Test only. | None | S |
| `code/src/state/sleepPlanningIntegration.test.ts` | Pre-existing modification; Task 9.14 additional modification | Test / Capacity / Goal Planning / Realization. Adds accepted-pin planning/realization freshness cases; updates authorized Friction assertion. | Test only. | None | P (10 cases total) |
| `code/src/state/types.ts` | Pre-existing modification; Task 9.14 additional modification | Store / Query. Declares pure typed Sleep Try command. | No write. | None | Typecheck, S |
| `code/src/ui/DayFrameApp.tsx` | Pre-existing modification; Task 9.14 additional modification | UI Copy / Revocation. Explains explicit Sleep revoke and failed-save retention. | Calls existing explicit command. | None | U, DayFrameApp regression |
| `code/src/ui/PreviewScreen.tsx` | Pre-existing modification; Task 9.14 additional modification | Preview / UI Copy. Groups Sleep proof by scope; labels Revoke and disables revoked record action. | Presentation only. | None | U |
| `code/src/ui/acceptedDecisionPresentation.test.ts` | Clean at entry; changed by Task 9.14 | Test. Narrows existing generic helper to non-Sleep variants after union extension. | Test only. | None | Presentation suite |
| `code/src/ui/acceptedDecisionPresentation.ts` | Pre-existing modification; Task 9.14 additional modification | Preview / UI Copy. Formats exact Sleep acceptance, owner day and applicability/revoked statuses. | Read-only projection. | None | Presentation regression, U |
| `code/src/ui/tests/PreviewScreen.test.tsx` | Clean at entry; changed by Task 9.14 | Test / Preview. Adds visible proof/Try and explicit retained Revoke UI cases. | Test only. | None | U |
| `docs/implementation/phase-9/PHASE_9_TASK_9_14_FIRST_CLASS_SLEEP_FRICTION_CORRECTIVE_AUTHORITY_V1_RESULT.md` | New in Task 9.14 | RESULT / Governance. Records complete task semantics, matrices, evidence and baseline accounting. | Documentation only. | None | Report structure and diff checks |


## 68. Deferred First-Class Sleep Work

First-Class Sleep publication, execution, progress/learning/history, legacy conversion, generalized UI authoring/redesign, omission/shortening/splitting/waivers, and any multi-occurrence accepted propagation remain deferred and prohibited here. Suggestion generation is deliberately bounded to eight reviewed targets and one canonical diagnostic placement per target; lack of a suggestion never asserts infeasibility. Full canonical search retains its existing deterministic budget and honest searchIncomplete outcome.

## 69. Completion Assessment

The bounded chain is implemented: current proof/review → typed blocking Friction → lawful bounded candidate → pure Try → explicit fresh atomic Accept → incarnation-safe canonical replay → shared planning consequences → explicit retained Revoke. Validation, bundle checks, performance measurements, persistence boundaries and per-file baseline accounting are recorded above. No known required implementation or evidence blocker remains.

Task 9.14 — First-Class Sleep Friction & Corrective Authority V1 is COMPLETE.
