# Task 9.15 — First-Class Sleep Publication, Execution & Historical Authority V1 RESULT

## 1. Executive Summary

First-Class Sleep now travels from fresh canonical planning authority into immutable HistoricalPlan snapshots, Today, explicit execution assertions, corrections/retractions, and a read-only historical query. Unplanned Sleep is a distinct execution subject. Planned and actual geometry remain separate. Validation and completion status are recorded in sections 79 and 82.

## 2. Scope and Governing Architecture

Governing architecture: Task 9.10 First-Class Sleep specification, the existing Sleep domain/persistence ADR, and Tasks 9.11–9.14. The implementation consumes the existing requirement, occurrence identity, joint solver, foundational occupancy and accepted-placement authority. There is no second solver, publication ledger, execution ledger or historical database. No dependency, commit or push was added.

## 3. Pre-Implementation Repository State

Baseline HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Before implementation, 906 tracked/untracked nonignored inventory entries were captured in `/tmp/dayframe-915-baseline`; the inventory is `/tmp/dayframe-915-files.json`. The initial status is reproduced below. Task 9.15 changes are determined by byte comparison against that baseline, not by treating the entire dirty working tree as this task. The initial production build and bundle check passed: 656,207 initial raw bytes, 169,577 initial gzip bytes, and 1,068,512 total emitted bytes. Earlier task work is preserved.

<details>
<summary>Complete pre-implementation git status (108 entries)</summary>

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
 M code/src/state/planDecisionSurface.ts
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
 M code/src/ui/acceptedDecisionPresentation.test.ts
 M code/src/ui/acceptedDecisionPresentation.ts
 M code/src/ui/plannerReviewPresentation.ts
 M code/src/ui/scheduleReviewReadiness.ts
 M code/src/ui/tests/DayFrameApp.test.tsx
 M code/src/ui/tests/PreviewScreen.test.tsx
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
?? code/src/state/sleepCorrectiveIntegration.test.ts
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
?? docs/implementation/phase-9/TASK_9.14_FIRST_CLASS_SLEEP_FRICTION_CORRECTIVE_AUTHORITY_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.15_FIRST_CLASS_SLEEP_PUBLICATION_EXECUTION_AND_HISTORICAL_AUTHORITY_V1.md
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AND_WORKFLOW_AUDIT.md
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_AND_PRE_MIGRATION_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_PRE_MIGRATION_CONVERGENCE_RESULT.md
?? docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AND_WORKFLOW_AUDIT.md
?? docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
?? docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AND_AUTHORITY_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AUTHORITY_CONVERGENCE_V1_RESULT.md
```

</details>

## 4. Current Publication / Execution / History Architecture Trace

Publication runs through `queryPlanningReview` → shared `publicationBlockers` → `publishScheduleRangeV1` → `materializePlanPublication` → serialized `HistoricalPlanSurface.publishAtomically`. HistoricalPlan already owns batch/day IndexedDB transactions and verification. Today reads `getHistoricalPlanDay`; execution already owns append-only assertion/retraction chains, ingress protection, quarantine and IndexedDB migration. Full backup/restore already includes both owners; profiles contain authored patterns only. The gaps were absent Sleep snapshot and subject variants, no frozen-context query, and no bounded Today/history controls.

## 5. Task 9.14 Authority Consumed

`captureSleepAuthority` supplies current PlanDecisions, realized hard facts and composition authority. `deriveFoundationalSchedule` invokes the existing joint Sleep solution and exact accepted pins, preserving all required duration/buffers. A review-required pin remains nonallocatable; publication never substitutes the diagnostic unconstrained witness. No changes were made to Task 9.14 solver or acceptance semantics.

## 6. Planned Truth Versus Actual Truth

Published geometry is the planned fact. Actual geometry is an explicit user assertion with its own physical start and elapsed minutes. Actuals can precede, follow, shorten, exceed or lie outside the plan. Completion, partial execution, skipped execution, unknown evidence and retraction are distinct. No actual evidence is inferred from elapsed wall time.

## 7. Publication Eligibility Integration

Review and command preflight share `materializePlanPublication` and `publicationBlockers`. Existing coverage, current Preview, non-Try, Friction, unrealized accepted-liability and historical-availability prerequisites remain. Sleep introduces fresh foundational eligibility and neighboring-publication seam checks. A satisfied Sleep solution is necessary when applicable, but does not bypass any existing prerequisite.

## 8. Fresh Publication Revalidation

The materializer re-derives Sleep with current authored setup and current captured authority; it does not serialize Preview Sleep as authoritative. Source fingerprinting includes the canonical materialized truth. The command detects changes while awaiting review and supplies an authority guard to the serialized publisher, checked immediately before the storage transaction. That guard includes authored setup, Preview, goals, Sleep decisions, realized facts and composition.

## 9. Published Sleep Snapshot Model

`PublishedSleepSnapshotV1` is nested inside HistoricalPlan snapshot variant 4. It freezes requirement/lifetime/revision, canonical occurrence reference and owner, solved Sleep and full footprint instants, duration, both buffers, window intent, derivation context, owner UTC offset, publication batch/range, snapshot identity and accepted-placement evidence. It is strict and self-contained; current authored authority is not needed to validate it.

## 10. Published Sleep Identity

The durable Sleep occurrence reference remains unchanged: source id/incarnation plus canonical owner-day coordinate and slot. Snapshot identity is a deterministic fingerprint of publication batch plus that reference, rather than geometry or title. A later changed publication has a different immutable snapshot identity; execution subjects cannot drift to that later publication.

## 11. Published Sleep Provenance

Frozen provenance includes canonical derivation policy/dependency fingerprint, physical window, owner window, effective boundaries, week start, Work evidence and anchor, off-day interpretation, timezone/offset context, source revision and publication provenance. Historical validation uses frozen values and physical instants, without solving current Sleep.

## 12. Accepted Placement Publication Provenance

When the solver consumes an applicable accepted pin, the snapshot retains its complete PlanDecision evidence, including acceptance provenance and exact placement payload. Revocation, subsequent acceptance or deletion of the active source does not mutate this copy. The integrated lifecycle test publishes an accepted pin, revokes it, rotates profile lifetimes and restores history without the original active source.

## 13. Published Sleep Immutability

Constructors, storage ingress, exports and read models clone their data. Published batches are never edited by actual reporting, correction or retraction. Physical verification fingerprints include the entire frozen Sleep payload; changing even dependency provenance while preserving geometry protects the historical owner.

## 14. Cross-Boundary Publication

Publication selects Sleep by canonical owner day and retains the complete physical Sleep interval and required footprint. A cross-midnight or cross-boundary occurrence is not split or clipped. Guard occurrences owned outside the publication range do not become duplicate publications merely because their footprint intersects the display range.

## 15. Publication Seam Safety

A candidate is compared against effective neighboring historical owner days. Sleep full footprints cannot conflict with neighboring Sleep or ordinary scheduled occupancy. Batch validation also rejects internal Sleep overlap, and collection validation checks the ordered publication history, including retroactive insertion. A contradiction rejects the candidate before writing; existing authority remains unchanged.

## 16. Publication Idempotence / Overlap Semantics

Identical historical truth follows the existing `identicalNoOp` path and retains its original batch/snapshot identity. A materially changed owner-day publication supersedes that day through a new immutable batch, preserving the old batch. Historical queries retain superseded Sleep publications and their execution evidence rather than retargeting assertions to the latest geometry.

## 17. Publication Fingerprinting

Semantic equivalence includes the frozen requirement, physical occurrence/context, owner offset and accepted-placement provenance. Query-scope membership/dependency fingerprint and new batch identity do not alone force a new semantic publication. Storage fingerprints are separate: they include every frozen Sleep field so equivalence normalization cannot hide altered physical evidence.

## 18. Publication Atomicity

Sleep snapshots are ordinary members of the existing day records. Batch metadata and every day in the publication are committed by the same existing IndexedDB mutation transaction. There is no additional Sleep write, keyspace or partial secondary commit.

## 19. Publication Failure / Commit Certainty

Existing certainty distinctions remain: failure known before commit, verified durable commit, verification failure after commit, and uncertain commit response. Postcommit/uncertain failures protect history and block blind retry. Failed explicit publication is not installed as a retryable pending candidate. Fault-injection tests use actual Sleep batches for abort, postcommit throw, metadata read failure and day read failure.

## 20. Historical Protection

Unknown snapshot/subject versions, invalid geometry, missing context, wrong owner/batch/reference, missing immutable execution targets, changed stored provenance and broken chains fail validation or produce protected coverage. No Sleep query silently falls back to current planning or silently treats unreadable evidence as no Sleep.

## 21. Today Planned Sleep Integration

Today receives snapshot variant 4 only from the effective Published Plan day. Generated Sleep without publication produces no planned Today Sleep. Canonical timing uses the published interval. Bounded controls submit to `recordSleepExecution`; the generic planned-execution command cannot bypass publication validation.

## 22. Today Canonical Owner-Day Semantics

Today retains the occurrence’s published owner label and exposes its frozen requirement/protection context. Actual geometry never recomputes or moves the planned subject’s owner. The Today navigation day still uses the application’s established current canonical-day selection; individual historical Sleep intervals and owner identities are not reinterpreted by it.

## 23. Today Planned / Actual Presentation

Today shows planned Sleep, required minutes, before/after protection and whether placement was accepted. Actuals are displayed separately. Unknown remains unreported; retraction is labeled “Report retracted; actual unknown”; corrected outcomes are identified. Actual entry begins empty and supports an explicit UTC offset to disambiguate repeated local clock times.

## 24. Sleep Execution Subject

`PublishedSleepExecutionSubjectV1` is a distinct `publishedSleep` discriminator with version 1, publication batch id, snapshot id and durable Sleep reference. `UnplannedSleepExecutionSubjectV1` is a separate `unplannedSleep` discriminator. Legacy planned/unplanned records and category-sleep records retain their existing meaning.

## 25. Sleep Execution Identity

Execution chain identity remains the existing ExecutionSubjectId and append-only ExecutionRecordId. The planned Sleep target is additionally tied to one immutable publication identity. Duplicate origins for the same published snapshot are rejected. Corrections cannot change subject origin or its frozen historical snapshot.

## 26. Planned Sleep Execution Assertion

`recordSleepExecution` resolves the requested snapshot from validated historical authority, builds the canonical execution target, then delegates to the existing execution owner. A narrowly scoped synchronous authorization callback prevents raw generic writes from forging a Sleep origin. Existing execution persistence and pending/durable semantics remain in force.

## 27. Explicit Nonexecution

`skipped` is explicit planned-Sleep nonexecution, with no actual-time evidence. It neither invalidates the publication nor creates omission, shortening or buffer-waiver authority. An unplanned Sleep subject cannot be skipped or transformed into skipped planned Sleep.

## 28. Execution Correction

A correction appends a replacement assertion to the same current chain, with new user-reported outcome/actual geometry. The frozen origin snapshot and subject are unchanged. Corrections to unplanned Sleep likewise retain the original canonical owner association even if corrected actual geometry crosses a different day.

## 29. Execution Retraction

A retraction appends the existing retraction record; it does not delete revisions or rewrite publication. Effective actual evidence becomes unknown. A later assertion can correct the retraction head on the same subject. Today and history distinguish this from explicit skipped evidence.

## 30. Missing Execution / Unknown Semantics

No execution record means unknown. An elapsed planned interval remains unknown until reported. A retracted report also resolves to unknown, while preserving a distinct lifecycle label and its full chain. Neither case means completed, partial or skipped.

## 31. Unplanned Sleep Execution

Unplanned Sleep requires explicit start and elapsed duration and uses the existing execution owner. It fabricates neither a requirement nor a publication, and it is returned separately from published Sleep. It is reachable from the bounded Sleep history section. Reporting still respects execution ingress and the command’s historical-availability gate.

## 32. Execution Physical-Time Semantics

Sleep completed/partial assertions require both a canonical physical start and integer elapsed minutes, using the existing 1–1440-minute evidence bound. Actual end is start plus elapsed minutes and must not exceed recordedAt. Duration is never local-clock subtraction or clamped to the planned interval. Spring/fall DST and cross-boundary cases are tested.

## 33. Execution Owner Association

Planned execution takes its owner label and boundary context from its frozen published occurrence. Unplanned execution initially resolves the canonical user day containing the explicit actual start using the current established resolver; that association is then frozen throughout corrections and retractions. It is not recomputed during historical reads.

## 34. Planned / Actual Comparison

The historical query derives planned duration, actual duration, duration difference, start difference and actual end only when actual evidence exists. These comparisons are not persisted and do not affect planning, Progress or requirements. Skipped/unknown/retracted states do not fabricate an actual interval.

## 35. Historical Sleep Query

`querySleepHistory` accepts a bounded owner-day range and as-of instant. It reads validated historical batches and canonical execution chains, returning per-day coverage, immutable published rows, supersession, planned/actual comparison, effective actual state and separate unplanned records. It does not call the planner or solver.

## 36. Historical Requirement Independence

Historical snapshots embed the effective Sleep requirement revision and lifetime. Queries and backup validation do not require that source to exist in Active. Tests delete the source after publication and restore the complete backup with the source absent.

## 37. Historical Accepted-Decision Independence

The accepted placement is frozen evidence rather than a live PlanDecision lookup. Later revocation and profile source-lifetime rotation leave historical reads byte-equivalent. The current PlanDecision owner continues to govern only current planning.

## 38. Historical Boundary / Timezone Independence

Frozen physical UTC instants, owner label/window, boundaries, timezone, offsets and clock policy survive current boundary/timezone changes. Historical reads do not use host-local parsing to reconstruct planned Sleep. An integration test switches to Pacific/Honolulu and obtains the same historical read model.

## 39. Historical Coverage

New day variant 2 records per-owner `notConfigured`, `notApplicable` or `satisfied`. The value is determined per owner, so a satisfied neighboring guard does not label a nonapplicable owner as configured Sleep. Legacy days return `legacyUnavailable`; missing publication returns `noPublication`; protected/unavailable owners remain explicit query states.

## 40. Summary / History Integration Boundary

Summary gains a bounded Sleep history section showing planned/actual facts, superseded publications, unplanned reports and correction/retraction controls. Sleep is excluded from existing generic completion/scheduling outcome aggregates. No Sleep score, Goal Progress, trend, recommendation or new Summary shell was introduced.

## 41. Persistence Ownership

Persistence owners remain Active for authored intent, PlanDecision for accepted placements, HistoricalPlan for immutable planned snapshots, and ExecutionHistory for actual evidence. Read models and comparisons are disposable. Existing restore composition, runtime transaction admission and clear mechanisms remain authoritative.

## 42. Publication Schema Evolution

HistoricalPlan envelope/batch version 1 is retained; day publication variant 2 introduces strict Sleep coverage, and planned snapshot variant 4 carries PublishedSleepSnapshotV1. Old day/snapshot variants still validate with their original semantics. Older readers reject unsupported variants rather than interpreting them as legacy category-sleep records.

## 43. Execution Schema Evolution

Execution envelope and record version 1 remain; the discriminated subject union adds explicit version-1 published/unplanned Sleep subjects and matching snapshot families. Unknown subject versions fail validation. Chain validation additionally enforces immutable Sleep snapshots and uniqueness of published Sleep origins.

## 44. Backup Semantics

Full Backup V13 already composes these historical owners. Its underlying historical/execution validation now checks frozen Sleep shapes and immutable cross-owner references. It preserves source/snapshot/batch/subject/record identities and complete correction/retraction chains. No unrelated backup or Active/Profile version was bumped.

## 45. Restore Semantics

Restore validates publication collections and Sleep execution references before authority replacement. Retired Active Sleep sources do not invalidate frozen history. Missing publication evidence causes `invalidBackup`, leaving current authority unchanged. Integrated clear/restore tests compare complete historical read models and preserved identities.

## 46. Profile Semantics

Profiles remain authored patterns only. Saving/loading one rotates the active Sleep lifetime through existing profile behavior without transporting, cloning or retargeting publication/execution authority. The previous immutable history remains associated with its original source lifetime.

## 47. Clear / Anti-Resurrection

Full clear uses existing multi-owner clearing and runtime transaction admission. Sleep introduces no separate pending queue/checkpoint. Tests clear published and executed Sleep, invoke both existing retry paths, restart the store and observe empty history. A publication authority guard also prevents stale queued writes after current state changes.

## 48. Backward Compatibility

Old publication/record variants and generic planned/unplanned subjects remain supported. Legacy historical days explicitly lack first-class Sleep coverage. Existing HistoricalPlan, execution, backup versions, profile, clear, Today and scheduling suites run alongside the new variants.

## 49. Legacy Sleep Regression

Legacy `default_sleep`, category-sleep Commitments and ordinary legacy execution retain existing semantics. They do not gain a SleepRequirement, frozen first-class context, strict actual-time requirement or automatic conversion. Dedicated coexistence coverage records a legacy completed outcome without fabricating first-class actual evidence.

## 50. Legacy / First-Class Coexistence

A legacy template titled “Sleep” and First-Class Sleep can coexist in the same publication. They retain template versus SleepRequirement references and provenance; there is no title/category deduplication. First-Class history reports only its explicit subject families, leaving the legacy record distinct.

## 51. Publication Matrix

| Current Sleep State               | Publication Eligible? | Historical Write Allowed? | Reason                                                       |
| --------------------------------- | --------------------- | ------------------------- | ------------------------------------------------------------ |
| notConfigured                     | Conditional           | Yes, ordinary plan        | No required Sleep; other prerequisites still apply           |
| notApplicable                     | Conditional           | Yes                       | No owned applicable occurrence; no fabricated Sleep snapshot |
| satisfied                         | Conditional           | Yes                       | Fresh joint witness plus all existing gates/seam checks      |
| infeasible                        | No                    | No                        | No feasible canonical foundation                             |
| searchIncomplete                  | No                    | No                        | No complete proof                                            |
| contextIncomplete                 | No                    | No                        | Authority/context insufficient                               |
| invalid                           | No                    | No                        | Invalid canonical authority                                  |
| protected                         | No                    | No                        | Protected authority cannot be assumed empty                  |
| accepted placement applicable     | Conditional           | Yes                       | Exact compatible pin retained in fresh witness               |
| accepted placement reviewRequired | No                    | No                        | Unconstrained diagnostic witness is not authority            |
| blocking Sleep Friction           | No                    | No                        | Shared publication Friction gate                             |

## 52. Planned / Actual Matrix

| Planned State      | Execution State       | Historical Meaning                           | Publication Mutated? | Requirement Mutated? |
| ------------------ | --------------------- | -------------------------------------------- | -------------------- | -------------------- |
| Published Sleep    | no execution          | Unknown                                      | No                   | No                   |
| Published Sleep    | completed as planned  | Explicit actual evidence matching plan       | No                   | No                   |
| Published Sleep    | shifted actual        | Independent reported start                   | No                   | No                   |
| Published Sleep    | shorter actual        | Independent reported duration                | No                   | No                   |
| Published Sleep    | longer actual         | Independent reported duration                | No                   | No                   |
| Published Sleep    | explicit nonexecution | Skipped; no actual interval                  | No                   | No                   |
| Published Sleep    | corrected execution   | Latest assertion, original chain retained    | No                   | No                   |
| Published Sleep    | retracted execution   | Unknown, retraction provenance retained      | No                   | No                   |
| no Published Sleep | unplanned Sleep       | Separate actual evidence, no fabricated plan | No                   | No                   |

## 53. Authority Matrix

| Object                      | Authority Layer               | Persisted? | Mutable?                | Owns Historical Truth?                       | May Execution Rewrite It? |
| --------------------------- | ----------------------------- | ---------- | ----------------------- | -------------------------------------------- | ------------------------- |
| SleepRequirementV1          | Active authored intent        | Yes        | Revisioned              | No; snapshot carries frozen copy             | No                        |
| SleepOccurrenceV1           | Derived applicability/context | No         | Regenerated             | No                                           | No                        |
| ScheduledSleepOccurrenceV1  | Derived joint witness         | No         | Regenerated             | No                                           | No                        |
| Accepted Sleep placement    | PlanDecision                  | Yes        | Append/revoke/supersede | Current planning; frozen copy in publication | No                        |
| Published Sleep snapshot    | HistoricalPlan                | Yes        | No                      | Planned historical truth                     | No                        |
| Sleep Execution assertion   | ExecutionHistory              | Yes        | Append-only             | Actual evidence                              | No; append correction     |
| Sleep Execution correction  | ExecutionHistory              | Yes        | Append-only             | Effective actual evidence                    | No; append replacement    |
| Sleep Execution retraction  | ExecutionHistory              | Yes        | Append-only             | Withdrawal of actual assertion               | No; append replacement    |
| Historical Sleep read model | Query                         | No         | Disposable              | Projects existing truth                      | No                        |

## 54. Persistence Matrix

| Surface         | Authored Sleep       | Accepted Pin    | Published Sleep             | Sleep Execution | Portable or Authority-Preserving? |
| --------------- | -------------------- | --------------- | --------------------------- | --------------- | --------------------------------- |
| Active          | Yes                  | No              | No                          | No              | Current authored lifetime         |
| PlanDecision    | No                   | Yes             | No                          | No              | Authority-preserving              |
| Profile         | Pattern              | No              | No                          | No              | Portable; fresh active lifetime   |
| HistoricalPlan  | Frozen revision copy | Frozen evidence | Yes                         | No              | Authority-preserving              |
| Execution owner | No                   | No              | Immutable reference/context | Yes             | Authority-preserving              |
| Full Backup     | Yes                  | Yes             | Yes                         | Yes             | Authority-preserving              |
| Restore         | Yes                  | Yes             | Yes                         | Yes             | Preserves validated identities    |
| Clear           | Remove               | Remove          | Remove                      | Remove          | Established full clear            |
| Preview         | Reads                | Reads           | No                          | No              | Disposable derived witness        |

## 55. Publication / Execution Lifecycle Matrix

| Stage               | Authority Class       | Writes?     | Source of Truth                             | Fresh Revalidation?              |
| ------------------- | --------------------- | ----------- | ------------------------------------------- | -------------------------------- |
| Review readiness    | Derived review        | No          | Current foundation plus historical seams    | Yes                              |
| Publish preflight   | Admission             | No          | Current owners and shared gates             | Yes                              |
| Materialize         | Frozen candidate      | No          | Fresh canonical joint witness               | Yes                              |
| Persist publication | HistoricalPlan        | Yes, atomic | Validated immutable candidate               | Final current-authority guard    |
| Today planned query | Historical projection | No          | Effective published day                     | Historical validation; no solver |
| Record actual       | ExecutionHistory      | Yes, append | Explicit user evidence and immutable target | Publication/ingress validation   |
| Correct actual      | ExecutionHistory      | Yes, append | Current chain and immutable origin          | Yes                              |
| Retract actual      | ExecutionHistory      | Yes, append | Current chain                               | Yes                              |
| Historical query    | Read model            | No          | Frozen batches and execution chain          | Validation; no planning          |

## 56. Historical Independence Matrix

| Current-State Change After Publication | May Old Published Sleep Change? | May Old Execution Change? | Historical Query Dependency                    |
| -------------------------------------- | ------------------------------- | ------------------------- | ---------------------------------------------- |
| Sleep requirement edit                 | No                              | No                        | Frozen publication and explicit execution only |
| Sleep source delete/recreate           | No                              | No                        | Frozen publication and explicit execution only |
| Work edit                              | No                              | No                        | Frozen publication and explicit execution only |
| Day Boundary edit                      | No                              | No                        | Frozen publication and explicit execution only |
| accepted pin revoke                    | No                              | No                        | Frozen publication and explicit execution only |
| new Preview                            | No                              | No                        | Frozen publication and explicit execution only |
| new current Sleep solution             | No                              | No                        | Frozen publication and explicit execution only |

## 57. Behavioral Invariants

| #   | Established invariant                                                                                                                                               | Evidence / enforcement                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Publication consumes fresh canonical Sleep authority.                                                                                                               | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 2   | Publication does not trust stale Preview Sleep.                                                                                                                     | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 3   | Publication does not trust stale readiness.                                                                                                                         | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 4   | Satisfied Sleep may publish only when all existing prerequisites pass.                                                                                              | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 5   | Infeasible Sleep cannot publish.                                                                                                                                    | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 6   | Search-incomplete Sleep cannot publish.                                                                                                                             | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 7   | Context-incomplete Sleep cannot publish.                                                                                                                            | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 8   | Invalid Sleep authority cannot publish.                                                                                                                             | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 9   | Protected Sleep authority cannot publish.                                                                                                                           | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 10  | Review-required accepted placement cannot publish.                                                                                                                  | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 11  | Blocking Sleep Friction cannot publish.                                                                                                                             | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 12  | Review/preflight/materializer share canonical eligibility semantics.                                                                                                | Core publication eligibility; schedulePublication; final storage guard; Sleep planning/corrective suites           |
| 13  | Published Sleep freezes solved occurrence truth.                                                                                                                    | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 14  | Published Sleep does not merely serialize authored intent.                                                                                                          | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 15  | Published Sleep has durable occurrence provenance.                                                                                                                  | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 16  | Published Sleep preserves source lifetime provenance.                                                                                                               | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 17  | Published Sleep preserves effective revision provenance.                                                                                                            | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 18  | Published Sleep preserves canonical owner day.                                                                                                                      | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 19  | Published Sleep preserves physical start/end.                                                                                                                       | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 20  | Published Sleep preserves full required footprint.                                                                                                                  | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 21  | Published Sleep preserves duration.                                                                                                                                 | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 22  | Published Sleep preserves both buffers.                                                                                                                             | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 23  | Published Sleep preserves required interpretation context.                                                                                                          | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 24  | Published Sleep preserves accepted-placement provenance when applicable.                                                                                            | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 25  | Published Sleep is immutable.                                                                                                                                       | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 26  | Current Sleep edits do not mutate prior publication.                                                                                                                | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 27  | Work edits do not mutate prior publication.                                                                                                                         | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 28  | Day Boundary edits do not reinterpret prior publication.                                                                                                            | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 29  | accepted-pin revocation does not rewrite prior publication.                                                                                                         | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 30  | source delete/recreate does not erase prior publication.                                                                                                            | Strict frozen snapshot validation; accepted-pin/source/profile independence integration                            |
| 31  | cross-midnight Sleep publishes as one occurrence.                                                                                                                   | Core cross-boundary/seam/fingerprint tests; store idempotent publication                                           |
| 32  | cross-boundary Sleep retains owner identity.                                                                                                                        | Core cross-boundary/seam/fingerprint tests; store idempotent publication                                           |
| 33  | publication range edges do not clip Sleep.                                                                                                                          | Core cross-boundary/seam/fingerprint tests; store idempotent publication                                           |
| 34  | adjacent publication does not create contradictory duplicate Sleep truth.                                                                                           | Core cross-boundary/seam/fingerprint tests; store idempotent publication                                           |
| 35  | publication identity is semantic, not geometry-only.                                                                                                                | Core cross-boundary/seam/fingerprint tests; store idempotent publication                                           |
| 36  | materially changed Sleep truth affects publication equivalence.                                                                                                     | Core cross-boundary/seam/fingerprint tests; store idempotent publication                                           |
| 37  | identical historical Sleep truth follows existing idempotence semantics.                                                                                            | Core cross-boundary/seam/fingerprint tests; store idempotent publication                                           |
| 38  | Sleep publication shares ordinary publication atomicity.                                                                                                            | Sleep storage fault injection plus existing HistoricalPlan certainty suite                                         |
| 39  | Sleep publication preserves commit-certainty taxonomy.                                                                                                              | Sleep storage fault injection plus existing HistoricalPlan certainty suite                                         |
| 40  | uncertain publication commit protects history.                                                                                                                      | Sleep storage fault injection plus existing HistoricalPlan certainty suite                                         |
| 41  | Today planned Sleep comes from Published Plan authority.                                                                                                            | Today store and UI Sleep tests; existing Today protection suite                                                    |
| 42  | Today does not substitute generated Sleep for publication.                                                                                                          | Today store and UI Sleep tests; existing Today protection suite                                                    |
| 43  | Today respects historical protection.                                                                                                                               | Today store and UI Sleep tests; existing Today protection suite                                                    |
| 44  | Today preserves canonical published owner day.                                                                                                                      | Today store and UI Sleep tests; existing Today protection suite                                                    |
| 45  | Today can distinguish planned Sleep from actual Sleep.                                                                                                              | Today store and UI Sleep tests; existing Today protection suite                                                    |
| 46  | passage of time does not auto-complete Sleep.                                                                                                                       | Today store and UI Sleep tests; existing Today protection suite                                                    |
| 47  | planned Sleep execution targets immutable published Sleep.                                                                                                          | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 48  | execution does not target mutable current requirement as planned subject.                                                                                           | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 49  | actual Sleep is user-asserted.                                                                                                                                      | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 50  | actual Sleep may differ from planned start.                                                                                                                         | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 51  | actual Sleep may differ from planned duration.                                                                                                                      | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 52  | actual Sleep may extend outside planned interval.                                                                                                                   | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 53  | actual Sleep does not mutate published geometry.                                                                                                                    | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 54  | actual Sleep does not mutate authored required duration.                                                                                                            | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 55  | missing execution means unknown.                                                                                                                                    | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 56  | explicit nonexecution is valid evidence.                                                                                                                            | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 57  | nonexecution does not invalidate publication.                                                                                                                       | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 58  | nonexecution does not create omission authority.                                                                                                                    | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 59  | execution corrections preserve provenance.                                                                                                                          | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 60  | execution retractions preserve provenance.                                                                                                                          | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 61  | retraction does not mean explicit nonexecution.                                                                                                                     | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 62  | effective actual evidence resolves through canonical execution lifecycle.                                                                                           | Sleep execution integration and ExecutionRecord chain validation                                                   |
| 63  | unplanned Sleep may be recorded.                                                                                                                                    | Unplanned correction/retraction, DST physical evidence and explicit-offset UI tests                                |
| 64  | unplanned Sleep does not fabricate publication.                                                                                                                     | Unplanned correction/retraction, DST physical evidence and explicit-offset UI tests                                |
| 65  | unplanned Sleep does not fabricate requirement.                                                                                                                     | Unplanned correction/retraction, DST physical evidence and explicit-offset UI tests                                |
| 66  | unplanned Sleep remains distinct from skipped published Sleep.                                                                                                      | Unplanned correction/retraction, DST physical evidence and explicit-offset UI tests                                |
| 67  | actual duration uses physical elapsed time.                                                                                                                         | Unplanned correction/retraction, DST physical evidence and explicit-offset UI tests                                |
| 68  | DST does not corrupt actual elapsed duration.                                                                                                                       | Unplanned correction/retraction, DST physical evidence and explicit-offset UI tests                                |
| 69  | published execution owner association follows published occurrence identity.                                                                                        | Unplanned correction/retraction, DST physical evidence and explicit-offset UI tests                                |
| 70  | unplanned Sleep owner association is deterministic.                                                                                                                 | Unplanned correction/retraction, DST physical evidence and explicit-offset UI tests                                |
| 71  | historical query is read-only.                                                                                                                                      | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 72  | historical query does not regenerate planning.                                                                                                                      | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 73  | historical query does not infer missing execution.                                                                                                                  | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 74  | historical query distinguishes planned/unknown/reported/nonexecution.                                                                                               | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 75  | historical query resolves correction/retraction chains.                                                                                                             | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 76  | historical query includes unplanned Sleep distinctly.                                                                                                               | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 77  | historical publication remains interpretable without current Sleep source.                                                                                          | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 78  | historical publication remains interpretable after accepted-pin revocation.                                                                                         | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 79  | historical publication remains interpretable after Day Boundary change.                                                                                             | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 80  | historical physical interval does not depend on current timezone interpretation.                                                                                    | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 81  | malformed historical Sleep authority fails safely.                                                                                                                  | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 82  | protected historical Sleep cannot masquerade as complete absence.                                                                                                   | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 83  | historical coverage distinguishes no configured Sleep from uninterpretable Sleep.                                                                                   | Sleep historical query, per-owner coverage, source/pin/boundary/timezone independence and malformed evidence tests |
| 84  | execution does not automatically create Goal Progress.                                                                                                              | Execution-owner-only write path; strict empty Goal provenance; no Progress/learning dispatch; aggregate exclusion  |
| 85  | execution does not automatically change Sleep requirement.                                                                                                          | Execution-owner-only write path; strict empty Goal provenance; no Progress/learning dispatch; aggregate exclusion  |
| 86  | history does not automatically create learned Sleep preferences.                                                                                                    | Execution-owner-only write path; strict empty Goal provenance; no Progress/learning dispatch; aggregate exclusion  |
| 87  | full backup preserves Published Sleep.                                                                                                                              | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 88  | full backup preserves Sleep execution chain.                                                                                                                        | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 89  | full backup preserves unplanned Sleep.                                                                                                                              | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 90  | restore preserves historical identities.                                                                                                                            | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 91  | restore does not require current active Sleep source for immutable historical truth.                                                                                | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 92  | profile does not transport Published Sleep.                                                                                                                         | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 93  | profile does not transport Sleep execution.                                                                                                                         | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 94  | full clear follows existing historical clear semantics.                                                                                                             | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 95  | cleared Sleep history cannot resurrect.                                                                                                                             | Backup V13 clear/restore/profile integration; retry/restart; existing full-clear and restore suites                |
| 96  | legacy Sleep remains legacy.                                                                                                                                        | Legacy coexistence test and completed publication-to-execution lifecycle suites; no conversion path                |
| 97  | legacy Sleep is not inferred into First-Class history.                                                                                                              | Legacy coexistence test and completed publication-to-execution lifecycle suites; no conversion path                |
| 98  | legacy and First-Class Sleep may coexist with distinct identities.                                                                                                  | Legacy coexistence test and completed publication-to-execution lifecycle suites; no conversion path                |
| 99  | Task 9.15 does not perform legacy conversion.                                                                                                                       | Legacy coexistence test and completed publication-to-execution lifecycle suites; no conversion path                |
| 100 | Task 9.15 completes First-Class Sleep from authored plan through immutable publication and append-only actual evidence without collapsing planned and actual truth. | Legacy coexistence test and completed publication-to-execution lifecycle suites; no conversion path                |

## 58. Publication Test Coverage

New core publication tests cover full cross-boundary snapshots, fresh re-derivation, eligibility rejection, per-owner coverage, seam conflicts, physical execution and strict variants. State integration tests exercise the real store → review → command → IndexedDB → Today/history path. Existing publication prerequisite suites remain passing.

## 59. Publication Freshness Coverage

Readiness-to-command tests change requirement, Work, fixed Event, Day Boundary, accepted pin and revocation. A command test changes realized hard authority while awaiting review and verifies no publisher call. A storage test changes the final guard during a precommit read and verifies zero writes. Solver search-incomplete/invalid/protected/context-incomplete outputs are separately injected at the materializer boundary to prove rejection; real solver behavior remains covered by the established Sleep suites.

## 60. Published Snapshot Coverage

Snapshot tests validate source/revision/owner/duration/buffers/physical geometry/context, reject missing context, wrong owner/batch, unknown version, invalid timezone/offset/timestamp and extra fields, and verify constructor non-mutation. Physical tampering with otherwise semantically equivalent provenance protects storage.

## 61. Cross-Boundary / Seam Coverage

Cross-midnight publication emits one owner occurrence with its full footprint. Adjacent compatible publications remain valid; an adjacent changed window that conflicts with the previous full footprint is rejected without altering history. Overlap/idempotence and per-owner guard coverage are tested.

## 62. Publication Failure Coverage

Actual Sleep batches are used for known prewrite abort, postcommit lost response, metadata-read failure and day-read failure. Tests verify certainty classifications, complete physical batch presence where committed, protection, no pending publication and no blind retry. The broader established commit-certainty suite also passes.

## 63. Today Coverage

Store tests prove no generated-to-Today fallback, frozen planned data, no elapsed auto-completion, skipped evidence and retracted-unknown state. UI tests prove explicit actual inputs use the dedicated command and a report after retraction corrects the existing subject chain.

## 64. Execution Coverage

Tests cover published origin validation, duplicate/bypass rejection, missing immutable publication, explicit start/duration, outside-plan geometry, physical elapsed time, skipped evidence, invalid actual data and unknown subject version. The existing generic execution model remains under its full regression suite.

## 65. Correction / Retraction Coverage

Integrated planned and unplanned tests assert, correct and retract, verify canonical effective outcomes, immutable origin/owner, preserved chains and unknown after retraction. Ten-correction chains are included in each performance range. Broken/mutated chain evidence is rejected.

## 66. Unplanned Sleep Coverage

Unplanned Sleep records are distinct from publication and requirement authority. Tests report, correct across a day boundary, reject skipped conversion and retract to unknown. A UI test enters the second fall-fold occurrence with explicit -06:00 offset and verifies its UTC instant.

## 67. DST / Boundary Execution Coverage

Physical actual evidence covers spring transition, fall transition and a cross-boundary 300-minute interval without naive clock subtraction. UI permits an explicit UTC offset for fold disambiguation. Existing canonical-day and Sleep offset suites cover 23/25-hour days and skipped civil labels.

## 68. Historical Query Coverage

Historical queries return unknown/reported/corrected/retracted states, unplanned evidence, per-owner coverage, superseded immutable identity and physical comparisons. Querying is read-only and does not invoke canonical planning. Legacy/unavailable/protected distinctions remain explicit.

## 69. Historical Independence Coverage

The integrated independence scenario publishes an accepted pin, reports actuals, revokes the pin, loads a fresh profile lifetime, deletes the source, changes Day Boundary, changes host timezone, exports, clears and restores. Historical evidence remains equal. Current Work/Event changes are independently tested as publication-freshness inputs and cannot mutate stored batches.

## 70. Backup / Restore / Profile / Clear Coverage

Full backup validation preserves chains and rejects missing publication references. Profile loading does not rebind immutable history. Clear plus both retry paths plus restart does not resurrect Sleep. Existing restore failure/rollback, profile, migration and anti-resurrection suites remain included in focused/full validation.

## 71. Malformed Authority / Protection Coverage

Malformed snapshots and subject versions fail closed. Execution collection validation checks missing/cross-subject replacement, cycles, competing heads, monotonicity, immutable origin and duplicate published targets. Today and Sleep history expose protected execution coverage when quarantined or cross-owner evidence is broken.

## 72. Legacy / Coexistence Coverage

Dedicated coexistence testing publishes a legacy default_sleep template and First-Class Sleep simultaneously, then records ordinary legacy completion and verifies First-Class actual remains unknown. Earlier legacy Sleep/domain/profile regressions are preserved.

## 73. Non-Activation Coverage

No conversion, Progress mapping, scoring, recommendation, learned preference, device/medical integration, waiver/omission/shortening authority or new persistence owner was added. The strict published snapshot permits no Goal provenance, and existing completion/realization aggregates exclude the new Sleep family. Execution writes only its existing owner.

## 74. Determinism / Non-Mutation Coverage

The materializer uses the existing deterministic joint solver. Inputs and returned snapshots are cloned; tests compare input before/after materialization and preserve original publication through actual edits. Semantic idempotence preserves original published identity. Source guards reject interleaved changes instead of publishing a stale witness.

## 75. Performance Assessment

Observational milliseconds from the explicit benchmark command in section 79. Each range uses cross-boundary 22:00–08:00 Sleep and a ten-correction chain. Publish includes Preview generation and review, so it is a conservative end-to-end measurement. No semantic wall-clock timeout was introduced.

| Days | Publish + Preview/review | Today  | Record actual | 10 corrections | Mean correction | Retract | History |
| ---- | ------------------------ | ------ | ------------- | -------------- | --------------- | ------- | ------- |
| 7    | 284.38                   | 41.18  | 32.48         | 414.88         | 41.49           | 49.05   | 47.9    |
| 31   | 975.44                   | 162.08 | 113.23        | 1477.19        | 147.72          | 155.25  | 164.78  |
| 90   | 953.93                   | 90.89  | 89.57         | 961.28         | 96.13           | 97.22   | 97.82   |

These are local single-run observations under the test runner, not latency guarantees. Reads validate retained historical evidence; large retained ledgers may require later indexing/projection optimization.

## 76. Bundle Architecture Assessment

| Measure                         | Bytes   |
| ------------------------------- | ------- |
| Task 9.14 baseline initial gzip | 169577  |
| Task 9.15 final initial gzip    | 166310  |
| Delta                           | -3267   |
| Unchanged hard gzip limit       | 170000  |
| Remaining hard headroom         | 3690    |
| Initial raw                     | 638276  |
| Largest lazy chunk              | 53183   |
| Total emitted output            | 1101789 |

Bounded import changes: asynchronous historical-intelligence queries load their projection/validation modules on demand; PreviewScreen now uses the same lazy/Suspense/error-boundary pattern as existing product surfaces. No solver/validator duplication, new owner, dependency or threshold change was introduced. Test mode uses the existing synchronous-loading convention; production build output verifies the actual split. Warnings: initialGzip 166310 > advisory 161500 (headroom); totalBytes 1101789 > advisory 825000 (architecture-review).

## 77. Architecture Governance Assessment

No new ADR was needed: Task 9.10 already governs immutable PublishedSleepSnapshotV1, explicit published execution identity, unplanned Sleep and append-only correction/retraction. Versioned variants and the bounded lazy refactor implement those decisions without introducing a new normative authority owner.

## 78. Test Coverage

The final full and focused results are recorded in section 79. New tests live in core Sleep publication, state publication/execution, storage fault-injection, Sleep history UI, and bounded Today UI coverage. Existing tests changed only for the obsolete pre-9.15 publication expectation, a narrowed legacy fixture type, the new realized-authority freshness assertion, and isolation of a mocked historical query from unrelated fixture bootstrap notifications.

## 79. Validation Record

All npm/npx commands run from `code/`. Logs below are session-local evidence; the exact results and focused file list are retained here.

| Command                  | Result                               | Session log                              |
| ------------------------ | ------------------------------------ | ---------------------------------------- |
| `npm run format`         | PASS                                 | `/tmp/dayframe-915-format-final.log`     |
| `npx prettier --check .` | PASS                                 | `/tmp/dayframe-915-prettier-final.log`   |
| `npm run lint`           | PASS                                 | `/tmp/dayframe-915-lint-final.log`       |
| `npm run build`          | PASS                                 | `/tmp/dayframe-915-build-final.log`      |
| `npm test`               | 142 passed (142); 1411 passed (1411) | `/tmp/dayframe-915-full-final.log`       |
| `npm run check:bundle`   | PASS                                 | `/tmp/dayframe-915-bundle-final.log`     |
| `git diff --check`       | PASS                                 | `/tmp/dayframe-915-diff-check-final.log` |

Focused command: `python3 /tmp/dayframe-915-run-focused.py`, which invokes `npx vitest run` with the exact file list below. Result: **68 passed (68); 639 passed (639)**. Benchmark command: `DAYFRAME_SLEEP_BENCH_FILE=/tmp/dayframe-915-performance-final.jsonl python3 /tmp/dayframe-915-run-focused.py` (68 files / 639 tests passed; the same exact focused file list below).

Earlier checks exposed an obsolete pre-9.15 publication expectation, a no-Sleep preflight regression, a per-owner coverage omission and test-fixture/UI selector issues; these were corrected before final validation. A later full run exposed a pre-existing historical-report UI fixture race: a mocked historical query was paired with real bootstrap notifications, which could remount the form after clicking. The isolated rerun passed; the fixture now consistently uses a no-op history subscription for its immutable mocked query. Its unsubscribe return type was then corrected to match the existing boolean-returning API; the final build and a 3-test targeted rerun passed afterward (`npx vitest run src/ui/tests/HistoricalPlanReportingSection.test.tsx`, `/tmp/dayframe-915-ui-final.log`). The first bundle attempt exceeded the hard limit; the bounded lazy changes restored compliance.

<details>
<summary>Exact focused test paths</summary>

```text
src/core/decisions/classifySuggestedFixes.test.ts
src/core/decisions/createPlanDecisionAcceptanceCandidate.test.ts
src/core/decisions/planDecision.test.ts
src/core/decisions/replayPlanDecisions.test.ts
src/core/engine/tests/preMigrationCorrectness.test.ts
src/core/engine/tests/workRelativeFootprint.test.ts
src/core/execution/tests/executionRecord.test.ts
src/core/execution/tests/executionSummary.test.ts
src/core/execution/tests/historicalExecutionTarget.test.ts
src/core/execution/tests/historicalPlanExecutionTarget.test.ts
src/core/historicalIntelligence/completionDistribution.test.ts
src/core/historicalIntelligence/goalActivity.test.ts
src/core/historicalIntelligence/schedulingRealization.test.ts
src/core/historicalPlan/historicalPlan.test.ts
src/core/historicalPlan/materializePlanPublication.test.ts
src/core/occurrences/tests/durableOccurrenceReference.test.ts
src/core/planning/allocation.test.ts
src/core/planning/planningScope.test.ts
src/core/planning/sleepPlanningIntegration.test.ts
src/core/sleep/sleepCorrective.test.ts
src/core/sleep/sleepDerivation.test.ts
src/core/sleep/sleepOccupancy.test.ts
src/core/sleep/sleepOffset.test.ts
src/core/sleep/sleepPublication.test.ts
src/core/sleep/sleepRequirement.test.ts
src/core/time/__tests__/canonicalUserDay.test.ts
src/core/today/buildTodayReadModel.test.ts
src/infrastructure/restore/restoreInfrastructure.test.ts
src/state/dayFrameBackup.test.ts
src/state/dayFrameBackupV10Integration.test.ts
src/state/dayFrameBackupV12.test.ts
src/state/dayFrameBackupV3.test.ts
src/state/dayFrameBackupV4.test.ts
src/state/dayFrameBackupV5.test.ts
src/state/dayFrameBackupV5Integration.test.ts
src/state/dayFrameBackupV6.test.ts
src/state/dayFrameBackupV6Integration.test.ts
src/state/dayFrameBackupV7.test.ts
src/state/dayFrameBackupV7Integration.test.ts
src/state/dayFrameBackupV8Integration.test.ts
src/state/dayFrameBackupV9Integration.test.ts
src/state/dayFrameFullClear.test.ts
src/state/dayFrameProfiles.test.ts
src/state/dayFrameRestoreComposition.test.ts
src/state/executionHistoryIndexedDb.test.ts
src/state/executionHistorySurface.test.ts
src/state/historicalIntelligenceQuery.test.ts
src/state/historicalPlanSurface.test.ts
src/state/planDecisionSurface.test.ts
src/state/planningScopeQuery.test.ts
src/state/realizationSurface.test.ts
src/state/schedulePublication.test.ts
src/state/sleepCorrectiveIntegration.test.ts
src/state/sleepFoundation.test.ts
src/state/sleepPlanningIntegration.test.ts
src/state/sleepPublicationExecution.test.ts
src/state/sleepPublicationStorage.test.ts
src/state/sleepResolutionQuery.test.ts
src/state/todayQuery.test.ts
src/ui/acceptedDecisionPresentation.test.ts
src/ui/tests/ExecutionHistoryPanel.test.tsx
src/ui/tests/ExecutionSummarySection.test.tsx
src/ui/tests/HistoricalIntelligenceSummary.test.tsx
src/ui/tests/HistoricalPlanReportingSection.test.tsx
src/ui/tests/SleepHistorySection.test.tsx
src/ui/tests/TodaySurface.test.tsx
src/ui/tests/executionHistoryPresentation.test.ts
src/ui/tests/executionReportingWorkflow.test.ts
```

</details>

## 80. Changed Files

38 task-changed files, including this single RESULT artifact. No earlier task-result artifact is modified. No commit, push, dependency or bundle-policy change.

| File                                                                                                                      | Baseline distinction                                      | Classification                                               | Purpose / semantic change                                                     | Authority impact                             | Persistence impact                   | Schema / version impact                     | Associated validation                                                |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------- |
| `code/src/core/execution/executionRecord.ts`                                                                              | Pre-existing dirty; Task 9.15 additional modification     | Sleep Execution / Execution Correction / Schema / Validation | Explicit Sleep subject families, physical evidence and immutable chains       | Append-only actual evidence                  | Existing ExecutionHistory            | New versioned subject variants; envelope V1 | executionRecord; sleepPublication; sleepPublicationExecution         |
| `code/src/core/execution/executionSummary.ts`                                                                             | Tracked baseline file; Task 9.15 modification             | Sleep Execution / HistoricalPlan                             | Keep First-Class Sleep out of existing generic outcome aggregates             | Read-only non-activation                     | None                                 | None                                        | ExecutionSummary; historical-intelligence suites; coexistence        |
| `code/src/core/historicalIntelligence/completionDistribution.ts`                                                          | Tracked baseline file; Task 9.15 modification             | Sleep Execution / HistoricalPlan                             | Keep First-Class Sleep out of existing generic outcome aggregates             | Read-only non-activation                     | None                                 | None                                        | ExecutionSummary; historical-intelligence suites; coexistence        |
| `code/src/core/historicalIntelligence/schedulingRealization.ts`                                                           | Tracked baseline file; Task 9.15 modification             | Sleep Execution / HistoricalPlan                             | Keep First-Class Sleep out of existing generic outcome aggregates             | Read-only non-activation                     | None                                 | None                                        | ExecutionSummary; historical-intelligence suites; coexistence        |
| `code/src/core/historicalPlan/historicalPlan.ts`                                                                          | Tracked baseline file; Task 9.15 modification             | HistoricalPlan / Schema / Validation                         | Add strict snapshot/day variants and clone/timing support                     | Historical planned truth                     | Existing day/batch owners            | Day V2 and snapshot V4                      | historicalPlan; sleepPublication                                     |
| `code/src/core/historicalPlan/historicalPlanFingerprint.ts`                                                               | Pre-existing dirty; Task 9.15 additional modification     | Publication Fingerprint                                      | Separate semantic equivalence from complete frozen storage verification       | Idempotence and corruption detection         | Existing physical fingerprints       | Sleep-aware fingerprints only               | sleepPublication; sleepPublicationStorage                            |
| `code/src/core/historicalPlan/historicalPlanValidation.ts`                                                                | Pre-existing dirty; Task 9.15 additional modification     | Historical Protection / Schema / Validation                  | Validate frozen context, batch linkage, overlap and collection seams          | Fail closed                                  | Validation only                      | Recognizes new strict variants              | historicalPlan; Sleep publication/storage                            |
| `code/src/core/historicalPlan/materializePlanPublication.ts`                                                              | Pre-existing dirty; Task 9.15 additional modification     | Publication Materialization / Publication Eligibility        | Fresh canonical re-derivation and complete owner-based snapshot creation      | Current foundation to immutable candidate    | No write; existing candidate         | Produces day V2 / snapshot V4               | materializePlanPublication; sleepPublication                         |
| `code/src/core/sleep/publishedSleep.ts`                                                                                   | New Task 9.15 file                                        | Sleep Publication / Schema / Validation                      | Strict immutable snapshot variant, provenance and identity                    | Historical planned truth                     | Embedded in existing HistoricalPlan  | Snapshot V4 / nested Sleep V1               | sleepPublication; sleepPublicationExecution; sleepPublicationStorage |
| `code/src/core/sleep/sleepExecution.ts`                                                                                   | New Task 9.15 file                                        | Execution Subject / Schema / Validation                      | Build frozen execution target and validate immutable cross-owner references   | Preserve publication identity                | Existing execution/backup validation | Published Sleep subject V1                  | sleepPublicationExecution; backup tests                              |
| `code/src/core/sleep/sleepPublication.test.ts`                                                                            | New Task 9.15 file                                        | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/core/sleep/sleepPublicationSeams.ts`                                                                            | New Task 9.15 file                                        | Publication Eligibility / Historical Protection              | Compare full footprints against effective neighboring owner days              | Reject contradictory publication             | No new store                         | None                                        | sleepPublication; sleepPublicationStorage                            |
| `code/src/core/sleep/sleepPublicationTestFixtures.ts`                                                                     | New Task 9.15 file                                        | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/core/today/buildTodayReadModel.ts`                                                                              | Pre-existing dirty; Task 9.15 additional modification     | Today / Historical Protection                                | Use immutable Sleep publication identity and canonical execution state        | Read-only; protected evidence stays explicit | None                                 | Read model only                             | todayQuery; buildTodayReadModel; Sleep integration/UI                |
| `code/src/state/dayFrameBackupV3.ts`                                                                                      | Tracked baseline file; Task 9.15 modification             | Backup / Restore / Schema / Validation                       | Validate Sleep cross-owner identities and historical seams                    | Authority-preserving backup admission        | Existing restore composition         | No backup bump                              | backup V3/V13; sleepPublicationExecution                             |
| `code/src/state/dayFrameStore.ts`                                                                                         | Pre-existing dirty; Task 9.15 additional modification     | Sleep Execution / Today / Publication Eligibility            | Wire current Sleep authority, guarded execution and lazy historical query     | Existing store admission                     | Existing owners only                 | API types only                              | Store Sleep/publication/Today and full clear suites                  |
| `code/src/state/executionHistorySurface.ts`                                                                               | Tracked baseline file; Task 9.15 modification             | Sleep Execution                                              | Gate generic Sleep writes and prevent duplicate published origins             | Existing execution write owner               | Existing pending/durable lifecycle   | None beyond execution variants              | executionHistorySurface; sleepPublicationExecution                   |
| `code/src/state/historicalIntelligenceQuery.ts`                                                                           | Tracked baseline file; Task 9.15 modification             | Lazy / Bundle Architecture                                   | Load existing async historical projections at query time                      | Unchanged                                    | None                                 | None                                        | historicalIntelligenceQuery; Summary tests; production bundle        |
| `code/src/state/historicalPlanSurface.test.ts`                                                                            | Pre-existing dirty; Task 9.15 additional modification     | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/state/historicalPlanSurface.ts`                                                                                 | Pre-existing dirty; Task 9.15 additional modification     | HistoricalPlan / Historical Protection                       | Serialized seam checks, final current-authority guard and full verification   | Existing atomic publication owner            | Same two-store transaction           | Uses strict Sleep variants                  | historicalPlanSurface; sleepPublicationStorage                       |
| `code/src/state/planningScopeQuery.ts`                                                                                    | Pre-existing dirty; Task 9.15 additional modification     | Publication Eligibility                                      | Shared fresh materialization, fingerprint/seam review and guarded publication | Readiness/admission                          | Existing publisher only              | None                                        | planningScopeQuery; schedulePublication; sleepPublicationExecution   |
| `code/src/state/schedulePublication.test.ts`                                                                              | Pre-existing dirty; Task 9.15 additional modification     | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/state/schedulePublication.ts`                                                                                   | Pre-existing dirty; Task 9.15 additional modification     | Publication Eligibility                                      | Shared fresh materialization, fingerprint/seam review and guarded publication | Readiness/admission                          | Existing publisher only              | None                                        | planningScopeQuery; schedulePublication; sleepPublicationExecution   |
| `code/src/state/sleepExecutionCommand.ts`                                                                                 | New Task 9.15 file                                        | Sleep Execution / Execution Correction                       | Validate immutable target, ingress and current authority before writes        | User assertions only                         | Delegates to ExecutionHistory        | Uses new subjects                           | sleepPublicationExecution; Today/Sleep history UI                    |
| `code/src/state/sleepHistoryQuery.ts`                                                                                     | New Task 9.15 file                                        | HistoricalPlan / Historical Protection                       | Frozen planned/actual projection, coverage, supersession and comparisons      | Read-only                                    | None                                 | Query only                                  | sleepPublicationExecution                                            |
| `code/src/state/sleepPublicationExecution.test.ts`                                                                        | New Task 9.15 file                                        | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/state/sleepPublicationStorage.test.ts`                                                                          | New Task 9.15 file                                        | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/state/sleepResolutionQuery.test.ts`                                                                             | Pre-existing untracked; Task 9.15 additional modification | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/state/todayQuery.ts`                                                                                            | Tracked baseline file; Task 9.15 modification             | Today / Historical Protection                                | Use immutable Sleep publication identity and canonical execution state        | Read-only; protected evidence stays explicit | None                                 | Read model only                             | todayQuery; buildTodayReadModel; Sleep integration/UI                |
| `code/src/state/types.ts`                                                                                                 | Pre-existing dirty; Task 9.15 additional modification     | Sleep Execution / Today / Publication Eligibility            | Wire current Sleep authority, guarded execution and lazy historical query     | Existing store admission                     | Existing owners only                 | API types only                              | Store Sleep/publication/Today and full clear suites                  |
| `code/src/ui/DayFrameApp.tsx`                                                                                             | Pre-existing dirty; Task 9.15 additional modification     | Lazy / Bundle Architecture                                   | Lazy PreviewScreen with established loading/error boundaries                  | Unchanged                                    | None                                 | None                                        | App/Planner UI regression suites; production bundle                  |
| `code/src/ui/HistoricalIntelligenceSummary.tsx`                                                                           | Tracked baseline file; Task 9.15 modification             | Today / UI Copy / Sleep Execution                            | Bounded planned/actual display and explicit reporting/correction/retraction   | Delegates to existing guarded commands       | No direct storage                    | None                                        | TodaySurface; SleepHistorySection; HistoricalIntelligenceSummary     |
| `code/src/ui/SleepHistorySection.tsx`                                                                                     | New Task 9.15 file                                        | Today / UI Copy / Sleep Execution                            | Bounded planned/actual display and explicit reporting/correction/retraction   | Delegates to existing guarded commands       | No direct storage                    | None                                        | TodaySurface; SleepHistorySection; HistoricalIntelligenceSummary     |
| `code/src/ui/TodaySurface.tsx`                                                                                            | Pre-existing dirty; Task 9.15 additional modification     | Today / UI Copy / Sleep Execution                            | Bounded planned/actual display and explicit reporting/correction/retraction   | Delegates to existing guarded commands       | No direct storage                    | None                                        | TodaySurface; SleepHistorySection; HistoricalIntelligenceSummary     |
| `code/src/ui/tests/HistoricalPlanReportingSection.test.tsx`                                                               | Tracked baseline file; Task 9.15 modification             | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/ui/tests/SleepHistorySection.test.tsx`                                                                          | New Task 9.15 file                                        | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `code/src/ui/tests/TodaySurface.test.tsx`                                                                                 | Tracked baseline file; Task 9.15 modification             | Test                                                         | Regression/scenario fixtures and assertions described in sections 58–74       | None                                         | No production writes                 | None                                        | This file / consuming Sleep tests                                    |
| `docs/implementation/phase-9/PHASE_9_TASK_9_15_FIRST_CLASS_SLEEP_PUBLICATION_EXECUTION_HISTORICAL_AUTHORITY_V1_RESULT.md` | New Task 9.15 file                                        | RESULT                                                       | Single required 82-section result, matrices, invariants and evidence          | None                                         | Documentation only                   | None                                        | Structure and accounting checks                                      |

## 81. Deferred First-Class Sleep Work

Deferred: legacy Sleep conversion/transition; Sleep Progress, scoring, recommendations and learning; devices/health integrations; authored split Sleep/naps; omission/shortening/buffer waivers; Planner shell migration, Summary redesign and general HistoricalPlan recovery UX. Historical queries currently validate/export the retained owners before projection; scaling beyond the measured ranges remains future optimization, without changing authority semantics.

## 82. Completion Assessment

All required lifecycle owners are connected and the recorded validation gates pass. The unchanged bundle hard limit is met.

Task 9.15 — First-Class Sleep Publication, Execution & Historical Authority V1 is COMPLETE.
