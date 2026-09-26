# Task 9.16 — First-Class Sleep Legacy Conversion & Product Transition V1 — RESULT

**Status:** COMPLETE

**Date:** 2026-09-20

## 1. Executive Summary

Explicit legacy Sleep conversion is implemented through the ordinary Commitment Library. Review is read-only. Confirmation stages a fresh required-Sleep lifetime, dated retirement of one selected legacy recurrence, and durable conversion lineage, then commits the entire authored aggregate atomically. Legacy history is preserved. Conversion uses the existing Sleep solver, planning, correction, publication and execution lifecycle.

Conservative V1 exclusions are intentional: weekly/quota/custom/per-shift recurrence, Work-anchor-conditional applicability, resources/active attachments, multiple future recurrences on one template, an existing First-Class source, and conflicting future evidence are not guessed or merged. Final validation and bundle evidence appear in §§83–87.

## 2. Scope and Governing Architecture

Task 9.10’s accepted dedicated Sleep model and explicit `LegacySleepConversionV1` transition govern this work. Tasks 9.11–9.15 remain the domain, derivation, planning, corrective and historical authorities. No solver, occurrence identity, requiredness, precedence, pin, publication or actual-execution contract was redesigned. No additional dependencies, persistence silo, commit or push were introduced.

## 3. Pre-Implementation Repository State

HEAD before work: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. The working tree already contained 145 status entries, including Tasks 9.9–9.15 and the supplied Task 9.16 specification. A 919-file content/hash baseline and exact status were captured before edits at `/tmp/dayframe-916-baseline`. Baseline `npm run build` and `npm run check:bundle` passed: 166,310 initial gzip, 638,276 initial raw, 53,183 largest lazy chunk, 1,101,789 total emitted bytes.

No applicable AGENTS.md or task-specific skill was found. No subagents were used. The following is the exact pre-implementation dirty-file record; these changes are not attributed wholesale to Task 9.16:

<details><summary>Pre-existing git status</summary>

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
 M code/src/core/execution/executionSummary.ts
 M code/src/core/execution/historicalExecutionTarget.ts
 M code/src/core/friction/applySuggestedFix.ts
 M code/src/core/friction/types.ts
 M code/src/core/historicalIntelligence/completionDistribution.ts
 M code/src/core/historicalIntelligence/schedulingRealization.ts
 M code/src/core/historicalPlan/historicalPlan.ts
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
 M code/src/state/dayFrameBackupV3.ts
 M code/src/state/dayFrameProfiles.ts
 M code/src/state/dayFrameRestoreComposition.ts
 M code/src/state/dayFrameRestoreTranslation.ts
 M code/src/state/dayFrameStore.ts
 M code/src/state/executionHistorySurface.ts
 M code/src/state/historicalIntelligenceQuery.ts
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
 M code/src/state/todayQuery.ts
 M code/src/state/types.ts
 M code/src/ui/DayFrameApp.tsx
 M code/src/ui/GoalSection.tsx
 M code/src/ui/HistoricalIntelligenceSummary.tsx
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
 M code/src/ui/tests/HistoricalPlanReportingSection.test.tsx
 M code/src/ui/tests/PreviewScreen.test.tsx
 M code/src/ui/tests/ScheduleReviewPanel.test.tsx
 M code/src/ui/tests/TodaySurface.test.tsx
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
?? code/src/core/sleep/deriveSleepOccurrences.ts
?? code/src/core/sleep/publishedSleep.ts
?? code/src/core/sleep/resolveRequiredSleep.ts
?? code/src/core/sleep/sleepCorrective.test.ts
?? code/src/core/sleep/sleepCorrective.ts
?? code/src/core/sleep/sleepDerivation.test.ts
?? code/src/core/sleep/sleepExecution.ts
?? code/src/core/sleep/sleepFoundationalOccupancy.ts
?? code/src/core/sleep/sleepOccupancy.test.ts
?? code/src/core/sleep/sleepOffset.test.ts
?? code/src/core/sleep/sleepPlacementAuthority.ts
?? code/src/core/sleep/sleepPublication.test.ts
?? code/src/core/sleep/sleepPublicationSeams.ts
?? code/src/core/sleep/sleepPublicationTestFixtures.ts
?? code/src/core/sleep/sleepRequirement.test.ts
?? code/src/core/sleep/sleepRequirement.ts
?? code/src/core/sleep/sleepResolution.ts
?? code/src/core/sleep/sleepTestFixtures.ts
?? code/src/core/sleep/solveRequiredSleep.ts
?? code/src/core/time/physicalOccupancy.ts
?? code/src/state/activeV3.ts
?? code/src/state/backupTransferSurface.ts
?? code/src/state/constructivePlanningWorkflow.ts
?? code/src/state/dayFrameBackupV13.ts
?? code/src/state/dayFrameProfilesV3.ts
?? code/src/state/publicationEligibility.ts
?? code/src/state/sleepCorrectiveIntegration.test.ts
?? code/src/state/sleepExecutionCommand.ts
?? code/src/state/sleepFoundation.test.ts
?? code/src/state/sleepHistoryQuery.ts
?? code/src/state/sleepPlanningIntegration.test.ts
?? code/src/state/sleepPublicationExecution.test.ts
?? code/src/state/sleepPublicationStorage.test.ts
?? code/src/state/sleepResolutionQuery.test.ts
?? code/src/ui/GoalPlanningSection.tsx
?? code/src/ui/ScheduledGoalFacts.tsx
?? code/src/ui/SleepHistorySection.tsx
?? code/src/ui/planningResultCopy.ts
?? code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx
?? code/src/ui/tests/SleepHistorySection.test.tsx
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
?? docs/implementation/phase-9/TASK_9.15_FIRST_CLASS_SLEEP_PUBLICATION_EXECUTION_HISTORICAL_AUTHORITY_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.16_FIRST_CLASS_SLEEP_LEGACY_CONVERSION_AND_PRODUCT_TRANSITION_V1.md
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

## 4. Legacy Sleep Production Representation Audit

`core/blocks/types.ts` defines `BlockTemplate` with ordinary fixed/flexible placement, duration, optional protection, priority, preferred/fixed/custom clock fields, Work-anchor flag, resources and enabled status. `BlockRecurrence` carries daily/weekly/specific-weekday/quota/custom/per-shift frequencies and inclusive start/end dates. Active template and recurrence identities each have canonical UUID incarnations.

`generateBlockCandidates` filters canonical owner labels through inclusive recurrence dates. Weekly means the first eligible owner day in the effective user-week, not an invariant weekday; quota and unsupported custom/per-shift modes cannot be faithfully projected to required Sleep weekdays. `placeBlockCandidates` includes legacy category-specific before-Work/off-day neighbor propagation, distinct from First-Class derivation. These paths remain unchanged.

`createInitialDayFrameState` starts with empty authored arrays. Its older normalization contains a narrowly matched disabled `default_sleep` re-enable repair; that remains legacy-only. No seed was changed and no First-Class Sleep was inferred. Composition relationships live in the existing composition owner; accepted geometry lives in PlanDecision/realization owners; historical legacy occurrences remain template snapshots and generic planned execution subjects.

## 5. First-Class Sleep Authority Consumed

Conversion consumes the existing `SleepRequirementIntentV1`, `validateSleepRequirement`, `validateSleepRequirements`, Active incarnation graph, `SleepRequirementPatternV1`, canonical user-day resolver and `capacityFingerprint`. It creates revision 1, then `resolveRequiredSleep`/`deriveFoundationalSchedule` consume it normally. The resolver now reads the current Active V3/V4 envelope through `createCurrentActive`; its scheduling algorithm is unchanged. Accepted placement, frozen publication and actual/history owners remain those established in Tasks 9.14–9.15.

## 6. Candidate Discovery Model

`discoverLegacySleep` returns distinct template/recurrence selections with both live incarnations and copied source fields. It recognizes category `sleep`, a title containing the word Sleep, or `default_sleep`. Sources without recurrences produce no actionable candidate. Multiple templates remain separate; selection never merges them. Discovery neither allocates an ID nor invokes a writer.

## 7. Candidate Discovery Heuristics Versus Conversion Authority

Discovery labels are suggestions only. Neither ID, title, category, priority nor duration authorizes requiredness. Only `convertLegacySleepToFirstClass` with `confirmed: true`, the reviewed fingerprint, explicit cutover and selected lifetimes can create Sleep. Startup, profile activation, restore, Preview, publication and candidate rendering do not call conversion.

## 8. Conversion Compatibility Classification

`reviewLegacySleep` classifies `convertible`, `requiresReview`, `unsupported`, `protected`, or `alreadyConverted`. Complete daily/specific-weekday clock intent may be proposed exactly; incomplete relative/clock intent requires user input. Protected authored/planning/history authority blocks review. Disabled legacy sources and unsupported recurrence/conditional/resource semantics are not converted. Any existing First-Class revision history, even disabled/future-dated, requires review instead of overwrite.

## 9. Conversion Review Model

The review returns copied exact source/lifetime identities, selected recurrence, request, proposed validated Sleep intent, reasons, deterministic fingerprint and any prior conversion record. Product fields show duration, buffers, recurrence dates/weekdays, window, cutover, and discarded legacy priority. A technical-details disclosure preserves inspectable source identifiers. Review creates neither authored state nor history.

## 10. Required Explicit User Decisions

The user selects a legacy schedule and a future owner-day cutover, supplies a legal clock window or Work-relative span plus off-day window when absent, and explicitly confirms the result. Duration, applicable weekdays, dated end and before/after protection must remain equal to the selected source. Missing optional legacy buffers mean zero under the existing legacy model, not a new protection default. Preferred start remains optional and soft.

## 11. Conversion Cutover Semantics

The selected recurrence receives `endsOnDate = addUserDayLabels(cutover, -1)`. The new enabled requirement receives `effectiveFrom = cutover`; a legacy inclusive end becomes First-Class exclusive end plus one label. Source start/end applicability is checked. V1 requires cutover strictly after the current owner day and any explicit recurrence start, and no later than its existing end. A future source starting exactly on cutover requires a later choice because an empty retired recurrence interval is invalid in the existing model.

## 12. Canonical User-Day Cutover

`resolveUserDayContainingInstant` determines today using effective cycle/boundary preferences. Cutover is a label, never the physical Sleep start. Retirement and requirement applicability share that label. Existing publication geometry extending across the boundary also blocks conversion. Tests cover 00:00, 03:00 and 12:00 boundaries and Day→Evening, Evening→Night, Night→Day, Work→Off and Off→Work transitions.

## 13. Prospective-Only Conversion

Current and past owner days are rejected. The conversion keeps legacy source identity and all pre-cutover recurrence fields. No historical occurrence, publication, execution assertion, correction or retraction is rewritten. A new source incarnation represents the future obligation only.

## 14. Conversion Command

The store exposes `reviewLegacySleepConversion(request)` and `convertLegacySleepToFirstClass({request, expectedFingerprint, commandId, confirmed})`. Heavy analysis is dynamically imported. The command exports validated history, captures complete planning authority, stages through `stageLegacySleepConversion`, validates the complete authored result, serializes and revalidates its JSON round-trip, performs the single aggregate authority write, then installs runtime state and marks Preview stale. Failures return a concrete rejection.

## 15. Command Revalidation

The mutation gate and post-await authority capture reject initialization, restore/clear transactions, protected/quarantined planning authority and unavailable history. Review is recomputed immediately before staging. Source lifetimes, recurrence dates/fields, existing Sleep, future decisions/publication/realized facts, applicability and the current owner day are checked. There is no await between final staging and synchronous aggregate commit.

## 16. Conversion Idempotence

A successful record retains command ID, exact request, request fingerprint and review fingerprint. Repeating the identical command returns `alreadyConverted` without allocation or writes. Reusing its ID with changed material input or review token throws an idempotence mismatch. Replay validates current aggregate lineage first. An archived deleted source is acknowledged as a past conversion, never recreated.

## 17. Source-Lifetime Safety

Both template and recurrence ID/incarnation must match the reviewed selection. Delete/recreate or replacement rotates incarnations and invalidates the command. The new requirement receives an independently allocated ID and incarnation, and conversion gets its own UUID. The existing Active incarnation validator rejects collisions. This repository supports strong lifetime checks; no ID-only fallback is used.

## 18. Conversion Fingerprint / Stale Review Protection

The deterministic review fingerprint includes the authored setup, complete Sleep planning authority (decisions, realized facts and composition), retained publication history and explicit request. The command recomputes it. The clock is independently revalidated for prospective legality instead of making every elapsed millisecond stale. A stored mapping fingerprint covers immutable conversion evidence; a request fingerprint detects idempotence mismatch. These fingerprints detect inconsistency, not cryptographic tamper-proofing.

## 19. Atomic Conversion

All three effects are staged in memory and validated together. The existing localStorage active key receives one complete Active V4 `setItem`; native localStorage provides atomic replacement. Runtime state changes only after that call succeeds. The existing establishment marker is written first and contains no conversion authority. Failed staging, allocation, validation, serialization or aggregate write cannot leave a requirement-only or retirement-only runtime state, nor a pending partial conversion for retry. A post-commit listener exception cannot turn persisted success into a retryable rejection. No cross-owner transaction is needed because history/decisions are read-only inputs.

## 20. Legacy Retirement Semantics

Retirement changes only the selected recurrence’s inclusive end, preserving its ID, incarnation and original evidence. The relationship validator rejects reopening, field replacement or lifetime rotation. Generic whole-template/recurrence replacement APIs reject while conversion lineage exists; ordinary lifecycle-preserving setup transactions validate the complete relationship before installing state and return the existing setup-validation rejection for incompatible edits. Unrelated schedules may still be edited. No destructive reverse conversion is provided.

## 21. New First-Class Source Lifetime

The validated result contains exactly one new primary Sleep lifetime at revision 1, with explicit effective date, applicability, duration, window, protection and UTC creation/update time. Legacy priority, move/omit geometry and published/actual history are not copied into that source. Existing revisions cause reviewRequired.

## 22. Conversion Provenance

`LegacySleepConversionV1` stores version, conversion/command IDs, selected source snapshots with both incarnations, exact request and fingerprints, revision-1 requirement snapshot, cutover, converted time, explicit-confirmation evidence and a deleted-lifetime marker. Original mapping evidence remains immutable after normal Sleep edits. Request identity, source recurrence mapping, dated retirement and revision-1 lifetime are validated on ingress.

## 23. Conversion Provenance Ownership

Conversion records are an optional field of the existing active authored aggregate. Nonempty lineage requires Active V4. They are lineage/authority evidence only: they neither schedule nor occupy time, award Progress, provide pins or publish facts. No `sleep-conversions` storage key, IndexedDB collection, background queue or second writer exists.

## 24. One-Semantic-Owner Invariant

For the selected obligation, legacy candidates stop at the owner label immediately before cutover and required Sleep starts at cutover. Relationship validation prevents reopening the retired recurrence or introducing a later Sleep revision before cutover. Independent legacy Sleep sources may coexist and continue through ordinary scheduling. This is a per-conversion invariant, not a global ban on category Sleep.

## 25. Existing First-Class Sleep Handling

Any current Sleep revision history blocks a new conversion: effective, disabled, future-dated and multi-revision cases are tested. No heuristic merge, replacement, second primary source or silent deletion is performed. The user must resolve existing setup separately.

## 26. Multiple Legacy Candidate Handling

Distinct templates yield independent candidates. More than one future recurrence on the same selected template requires review before conversion, avoiding an incomplete retirement that duplicates one source’s future obligation. Selecting one independent candidate leaves other templates and recurrences unchanged.

## 27. Legacy Priority Handling

Priority is displayed as legacy context and explicitly does not carry over. Required Sleep has no numeric priority field. First-Class requiredness is established by confirmation, not by priority 1 or a familiar title/category.

## 28. Legacy Move / Omit / Corrective Authority Handling

A selected legacy decision targeting an owner at/after cutover blocks conversion. A move from an earlier target into a future owner also blocks it. Historical decisions remain unchanged. No Move becomes a Sleep pin; no Omit becomes a one-off disabled day; no duration/buffer reduction becomes weaker Sleep protection. The user must resolve future decisions or choose a later date.

## 29. Existing Realized Legacy Fact Handling

Realized support/Goal facts retain exact geometry and lineage. A fact referencing the selected template through composition on/after cutover, or physically extending beyond its boundary, requires a later cutover. Unrelated realized Goal/protection facts remain hard occupancy for the normal Sleep solver. Conversion does not cancel accepted Goal allocations or mutate realization/proposal owners.

## 30. Existing Future Legacy Publication Handling

All retained selected-source publications are inspected, including superseded batches. Future owner labels or geometry crossing the cutover boundary block conversion; no immutable publication is rewritten. A later lawful cutover can pass. New publication uses the existing fresh materializer and seam checks. Backup V14 also rejects selected-source future legacy publications inconsistent with a conversion record.

## 31. Existing Legacy Execution Handling

Legacy execution subjects remain generic planned template references. Completed/partial/skipped evidence, corrections and retractions remain byte/semantically unchanged across conversion. Historical actuals do not prevent future conversion by themselves. Store integration tests create, correct and retract legacy execution, convert, publish/report First-Class Sleep and round-trip both generations in V14.

## 32. Clock-Sleep Mapping

A complete legacy custom clock window can be proposed directly, preserving represented duration and protection. A fixed clock or preferred start alone is not a legal required window: review asks for one. The user’s explicit clock window is validated by the existing Sleep domain. A fixed/preferred start is not fabricated into an accepted placement.

## 33. Work-Relative Sleep Mapping

Before/after-Work labels alone are insufficient. Explicit relative span and an off-day clock window are required; the before/after orientation must match the source. Optional preferred off-day start remains soft. Legacy Work-anchor-conditional applicability is unsupported because it cannot be faithfully expressed as current Sleep weekdays. No solver inference fills missing fields.

## 34. Buffer Mapping

Before/after minute protection maps exactly from legacy buffer fields, including their existing absent-means-zero semantics. Intent with reduced protection is rejected. Neither priority nor accepted legacy adjustments can reduce it. The normal foundation continues to protect the whole Sleep footprint.

## 35. Recurrence / Applicability Mapping

Daily maps to all owner days; specificWeekdays maps the exact authored set. Existing end date maps to exclusive end plus one. Weekly effective-user-week selection, timesPerUserWeek quota, custom and perShiftSegment are unsupported, not approximated with arbitrary weekdays. Retiring one recurrence never edits unrelated recurrence applicability.

## 36. Unsupported / Ambiguous Legacy Semantics

RequiresReview covers missing explicit window/span/fallback, conflicting future evidence, multiple future recurrences and existing Sleep. Unsupported covers disabled legacy templates, resources, active composition attachments, conditional Work anchors and unrepresentable recurrence. Malformed authored input/protected or incomplete authority yields protected. These are safe product outcomes, not silently skipped data.

## 37. Derived-State Invalidation

Successful conversion uses `markPreviewStale` and the existing store notification/fingerprint paths. It does not patch disposable schedule results in place. Planning review/publication recompute current authored/foundation inputs; cached proposals and accepted allocation realization retain their existing dependency checks. A stale review cannot authorize publication after conversion.

## 38. Capacity / Goal / Proposal Post-Conversion Behavior

Converted Sleep enters `deriveFoundationalSchedule` and existing Sleep-qualified Capacity, Goal feasibility, proposal and realization rules. Required protection is counted once; retired legacy recurrence no longer expands after cutover. Existing accepted Goal intent is not cancelled. New infeasibility is allowed and surfaced normally; conversion proves structural meaning, not permanent feasibility.

## 39. Friction / Corrective Authority Post-Conversion Behavior

Task 9.14 remains controlling for feasible/reviewRequired/inapplicable Sleep correction and explicit acceptance/revocation. Conversion creates no accepted pin and maps no legacy corrective decision. Any conflict is diagnosed by the shared foundation and normal Friction workflow after regeneration.

## 40. Publication Post-Conversion Behavior

Conversion creates no publication. The user regenerates, reviews and explicitly publishes. `materializePlanPublication` consumes the fresh converted requirement, uses PublishedSleepSnapshot V4/nested Sleep snapshot V1 and preserves whole-footprint/seam rules. Integration coverage verifies new First-Class snapshots and unchanged old legacy batches.

## 41. Today Post-Conversion Behavior

Today continues to read immutable Published Plan and explicit execution. The converted authored requirement cannot appear as planned Today truth before publication. No fallback from unpublished current Sleep, stale Preview or conversion metadata was added. Existing Today tests run in the focused suite.

## 42. Historical Query Transition

HistoricalPlan keeps template snapshots for legacy Sleep and SleepRequirement snapshots for First-Class Sleep. The historical reporting UI explicitly labels template/category-sleep rows “legacy Sleep Commitment.” Existing Sleep history remains a First-Class query, while generic historical reporting retains legacy evidence. The two sources are not merged into one rewritten timeline.

## 43. Profile Semantics

Profiles remain V3 portable authored patterns. Conversion of the active setup does not edit saved profiles. Saving afterward projects Sleep revision intent plus the retired recurrence’s dated end, stripping all live incarnations and conversion-command lineage. Profile ingress rejects a live conversion-lineage field rather than silently importing it.

## 44. Profile Save After Conversion

A newly saved converted profile retains the selected recurrence’s end date and the First-Class effective interval/weekdays/window/protection. This prevents duplicate converted ownership when reactivated. It deliberately contains no live command/conversion ID or prior active incarnation.

## 45. Profile Load After Conversion

`projectActiveToPattern` and `instantiateActiveSetup` preserve dated conversion outcome and allocate fresh lifetimes for Sleep, template and recurrence. The profile does not falsely claim the old active conversion identity. Historical evidence remains in its independent immutable owners; switching active profiles never rewrites it.

## 46. Old Profile Behavior

A pre-conversion profile remains legacy. Loading it restores a legacy candidate with no required Sleep and no conversion record. A new explicit review and command are required. This is covered by saving before conversion, converting, saving/loading after, then reloading the old profile.

## 47. Backup Semantics

Product export uses Backup V14, containing current Active V3/V4 and Profiles V3 plus all existing decision, execution, publication, Goal, measurement, observation, structure, planning, composition, proposal and realization collections. Full backup retains conversion IDs and live incarnations exactly. Historical V13 export remains available only for compatible aggregates.

## 48. Restore Semantics

V14 validation first reads/validates the current active envelope and its conversion relationships, then delegates all existing authority validation to V13’s chain using an explicit projection without lineage. It restores the original validated Active V4 data through the same coordinated participants. No identity allocation or semantic repair occurs. The ordinary file picker dispatches V14 directly to the store validator.

## 49. Older Backup Compatibility

V1–V13 compatibility paths remain. An old valid backup without conversion restores legacy setup exactly under its established migration semantics and creates no Sleep or conversion record. Unknown Active successors and unknown conversion versions remain protected/rejected, never normalized into success.

## 50. Clear / Anti-Resurrection

Full clear removes active/profile authority through their existing owners. There is no conversion side store or queue to resurrect state. Integration tests convert, clear, invoke active/profile retries, restart, and verify no requirement, recurrence or conversion lineage returns; V14 restore subsequently restores all three exactly when explicitly requested.

## 51. Startup Migration / Non-Inference

Startup accepts current V4 at the existing active key and validates the relationship before installing state. V2→V3 migration remains structural. Old legacy title/category/default/duration are never a First-Class migration rule. Existing legacy-only normalization and empty fresh-install defaults were not changed.

## 52. Persistence Ownership

The active localStorage aggregate owns requirements, recurrence retirement and lineage. Profile projection owns portable intent only. Existing IndexedDB owners retain publication, execution and Goal-related facts. Existing restore composition/runtime adapters accept the current active envelope union. The conversion command performs no writes to any other authority collection.

## 53. Schema Evolution

| Surface | Old | New | Reason | Migration | Older reader | Unknown future version |
|---|---:|---:|---|---|---|---|
| Active with lineage | 3 | 4 | Validate durable conversion relationship | Only explicit command creates lineage; old V2/V3 remains structural | Protect unsupported V4 | Protect |
| Active without lineage | 3 | 3 | No new authority | Existing path | Existing support | Protect |
| Profiles | 3 | 3 | Existing dated intent/end dates suffice | Fresh incarnations on activation; no live lineage | Existing portable pattern | Reject/protect |
| Full backup | 13 | 14 | Preserve Active V4 relationship | Existing V13 remains readable, no inference | Reject unsupported V14 | Reject |
| HistoricalPlan / Execution / Sleep requirement / occurrence ref | existing | unchanged | No new historical or scheduling type required | None | Existing rules | Existing protection |

`activeV4.ts` exposes `createCurrentActive`/`readCurrentActive`. Legacy-named store aliases route to these current-envelope functions; the original V3 validator remains strict and refuses nonempty lineage.

## 54. Product Reachability

The normal Commitment Library/Setup screen includes `LegacySleepConversionSection`. Users select a candidate, inspect old semantics, supply missing windows/span, choose a cutover, review, check confirmation and click Confirm conversion. Unsaved setup drafts disable conversion. Success reports that it was saved and directs the user to regenerate and publish. No developer console or JSON editing is needed.

## 55. Product Placement / Copy / Confirmation

There is no new navigation destination or shell migration. Setup is already lazy, so the conversion UI and analysis stay outside startup. Ordinary copy describes an old schedule, required Sleep and preserved past history. Detailed identifiers are confined to a technical disclosure. Opening/changing/reviewing does not mutate; the confirmation button requires the checkbox and a convertible review. Changing fields clears prior review/confirmation.

## 56. Conversion Eligibility Matrix

| Legacy Candidate State | Conversion Status | User Review Required? | May Convert? | Reason |
|---|---|---|---|---|
| no candidate | none | No | No | Nothing selected |
| simple complete clock Sleep | convertible | Yes | After confirmation | Exact daily/weekday mapping |
| complete beforeWork Sleep | convertible | Yes | After explicit span/fallback | Complete First-Class intent |
| complete afterWork Sleep | convertible | Yes | After explicit span/fallback | Complete First-Class intent |
| missing required window semantics | requiresReview | Yes | After input | No legal window invented |
| missing off-day fallback | requiresReview | Yes | After input | Relative label insufficient |
| ambiguous recurrence | unsupported | Yes | No approximation | Weekly/quota/custom/per-shift unsupported |
| multiple candidate sources | individually classified | Yes | Selected independent source | No merge; multiple same-template future recurrences block |
| active First-Class Sleep exists | requiresReview | Yes | No merge | Includes disabled/future/revised source |
| future legacy accepted decision | requiresReview | Yes | Later cutover/resolution | No retargeting |
| future realized legacy fact | requiresReview | Yes | Later cutover | Immutable geometry |
| future published legacy Sleep | requiresReview | Yes | Later cutover | All retained batches considered |
| malformed/protected authored authority | protected | Yes | No | No authority assumed from absence |
| already converted | alreadyConverted | No new confirmation needed to inspect | No additional write | Same command is idempotent |
| resources / active attachments / conditional Work anchor | unsupported | Yes | Not in this V1 representation | No semantic loss |

## 57. Semantic Mapping Matrix

“Automatic mapping” below means a read-only proposal, never automatic conversion.

| Legacy Semantic | First-Class Equivalent | Automatic Mapping Allowed? | Explicit Review Needed? | Notes |
|---|---|---|---|---|
| title | none | Discovery only | Yes | Not requiredness |
| category | none | Discovery only | Yes | Not requiredness |
| duration | required minutes | Exact proposal | Yes | No guessed duration |
| priority | none | No | Yes | Omitted |
| preferred window | validated window intent | Complete custom only | Yes | Missing meaning needs input |
| fixed clock | optional preferred start | No legal-window inference | Yes | No accepted pin |
| beforeWork | beforeWork span/offDay | Orientation only | Yes | Explicit missing span/fallback |
| afterWork | afterWork span/offDay | Orientation only | Yes | Explicit missing span/fallback |
| buffers | exact before/after minutes | Exact legacy semantics | Yes | No reduction |
| recurrence | applicability | daily/specificWeekdays only | Yes | Unsupported modes not approximated |
| weekdays | exact set / all | Yes | Yes | No arbitrary quota placement |
| effective dates | cutover/exclusive end | Existing end + one label | Yes | Explicit future cutover |
| resources | none | No | Yes | Unsupported while present |
| attachments | none | No | Yes | Active relationships unsupported |
| accepted Move | none | No | Yes | Future decision blocks |
| accepted Omit | none | No | Yes | Never Sleep omission |
| publication | unchanged legacy snapshots | No | Preserved | Future publication blocks |
| execution | unchanged legacy records | No | Preserved | Never retargeted |

## 58. Cutover Authority Matrix

| Authority | Before Cutover | At/After Cutover | Mutated by Conversion? | Historical Identity Preserved? |
|---|---|---|---|---|
| selected legacy recurrence | Existing applicability | Retired, no candidates | Inclusive end only | Yes |
| legacy historical publication | Immutable | Retained; future conflicts block | No | Yes |
| legacy execution | Immutable append-only evidence | Retained | No | Yes |
| legacy PlanDecision | Retained | Conflicting future targets block | No | Yes |
| legacy realized fact | Hard immutable geometry | Selected future reference blocks | No | Yes |
| new SleepRequirement | Not applicable | Explicit required source | Created, revision 1 | Distinct lifetime |
| First-Class solver output | No converted obligation | Normal derived result | Recomputed after regeneration | Canonical reference |
| First-Class publication | No fabricated history | Separate explicit publish | No | Yes |
| First-Class execution | No fabricated actual | Separate explicit report | No | Yes |
| conversion provenance | No retroactive schedule | Lineage evidence | Created atomically | Both lifetimes retained |

## 59. Persistence Matrix

| Surface | Legacy Source | Retirement | First-Class Requirement | Conversion Provenance | Historical Legacy | First-Class History |
|---|---|---|---|---|---|---|
| Active | Live retained identity | Dated end | Live revisions | V4 lineage | No | No |
| PlanDecision | References only | No | Pin references only | No | Existing decisions | Existing pins |
| Profile | Portable fields | Dated end | Portable intent | Outcome only; no live IDs | No | No |
| HistoricalPlan | Frozen references/snapshots | No | Frozen published snapshot | No scheduling role | Preserved | Preserved |
| Execution | Frozen planned subject | No | Published/unplanned subjects | No | Preserved | Preserved |
| Full Backup | Exact | Exact | Exact lifetime | Exact | Exact | Exact |
| Restore | Validate/preserve | Validate/preserve | Validate/preserve | Validate/preserve | Preserve | Preserve |
| Clear | Existing full clear | Removed with aggregate | Removed | Removed with aggregate | Existing full clear | Existing full clear |

## 60. Product Reachability Matrix

| Product Step | Reachable? | Writes Authority? | Required Input | Failure / Review State |
|---|---|---|---|---|
| discover candidate | Yes, Commitment Library | No | Existing legacy setup | No candidates |
| open review | Yes | No | Select exact schedule | Protected/unavailable |
| inspect legacy semantics | Yes | No | Selection | Technical details available |
| supply missing First-Class semantics | Yes | No | Window/span/fallback | Missing fields require review |
| choose cutover | Yes | No | Future owner day | Invalid/past/out-of-range date |
| confirm conversion | Yes | One aggregate write | Convertible review + checkbox/button | Stale/protected/storage failure |
| observe converted setup | Yes | No | Successful confirmation | Saved message / prior conversion details |
| regenerate planning | Existing Review Schedule | Disposable Preview | Existing generation controls | Normal foundation/Friction statuses |
| publish First-Class Sleep | Existing review/publish | Existing immutable publication | Fresh eligible planning review | Existing publication gates |

## 61. Lifecycle Transition Matrix

| Stage | Semantic Owner | Authority Class | Historical or Current? | May Conversion Rewrite It? |
|---|---|---|---|---|
| legacy authored recurrence | Active aggregate | Authored | Current/prospective | Selected end only |
| legacy generated occurrence | Existing scheduler | Derived | Disposable | Mark stale, regenerate |
| legacy publication | HistoricalPlan | Immutable frozen plan | Historical | No |
| legacy execution | ExecutionHistory | Append-only actual evidence | Historical | No |
| conversion review | Pure analysis | Non-authoritative proposal | Disposable | Recompute |
| conversion provenance | Active V4 | Lineage evidence | Origin of current lifetime | Create once; deletion marker only |
| First-Class requirement | Active V4/V3 | Authored required intent | Current/prospective | Create revision 1 |
| First-Class derived occurrence | Existing Sleep foundation | Derived | Disposable | Normal regeneration |
| First-Class publication | HistoricalPlan | Immutable frozen plan | Historical | No |
| First-Class execution | ExecutionHistory | Append-only actual evidence | Historical | No |

## 62. Behavioral Invariants

Evidence keys: **C** = `core/sleep/legacySleepConversion.test.ts`; **S** = `state/legacySleepConversion.test.ts`; **U** = `ui/tests/LegacySleepConversionSection.test.tsx` plus V14 file-picker tests; **P** = existing focused regression suites listed in §87. “Established” combines direct tests with inspected writer/read-model boundaries; it does not claim 100 separate new test functions.

| # | Behavioral invariant | Status / evidence |
|---|---|---|
| 1 | Legacy Sleep is never automatically promoted. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 2 | `default_sleep` does not authorize conversion. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 3 | title `Sleep` does not authorize conversion. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 4 | category `sleep` does not authorize conversion. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 5 | candidate discovery is read-only. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 6 | conversion review is read-only. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 7 | conversion requires explicit confirmation. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 8 | conversion requires explicit First-Class semantics where legacy semantics are insufficient. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 9 | conversion does not invent required duration. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 10 | conversion does not invent legal window. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 11 | conversion does not invent off-day fallback. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 12 | conversion does not invent buffers. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 13 | conversion does not infer requiredness from priority. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 14 | conversion does not copy legacy priority into First-Class Sleep. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 15 | conversion does not translate legacy Omit into First-Class omission. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 16 | conversion does not translate legacy Move into accepted First-Class pin automatically. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 17 | conversion does not translate legacy buffer reduction into First-Class protection weakening. | Established — C: discovery, explicit confirmation, exact/ambiguous mapping; U: empty fields and final checkbox; schema has no priority/pin/omission. |
| 18 | conversion is prospective. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 19 | cutover uses canonical owner-day semantics. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 20 | historical legacy occurrences are not converted. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 21 | historical legacy publication is immutable. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 22 | historical legacy execution is immutable. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 23 | historical legacy correction/retraction remains legacy. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 24 | conversion creates a new First-Class source lifetime. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 25 | legacy identity is not reused as First-Class identity. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 26 | conversion provenance links the two lifetimes without collapsing them. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 27 | conversion provenance does not own physical time. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 28 | conversion provenance does not schedule Sleep. | Established — C: prospective/boundary/transition and fresh lifetime tests; S: unchanged historical assertions and V14 round-trip. |
| 29 | conversion is atomic. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 30 | partial requirement-only conversion cannot persist. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 31 | partial retirement-only conversion cannot persist. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 32 | conversion is idempotent. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 33 | repeated identical conversion does not create a second source. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 34 | stale conversion review cannot mutate changed authority. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 35 | deleted/recreated legacy source cannot be converted by stale request. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 36 | one converted future obligation has one semantic owner after cutover. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 37 | selected legacy recurrence no longer generates converted future ownership after cutover. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 38 | First-Class requirement begins according to explicit cutover. | Established — C: allocation failures, stale lifetime, idempotence and owner-day cutover; S: atomic setItem failure and restart. |
| 39 | unrelated legacy Sleep may coexist. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 40 | multiple candidates are not automatically merged. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 41 | active First-Class Sleep is not silently overwritten. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 42 | future-dated First-Class Sleep is not silently overwritten. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 43 | ambiguous merge is rejected/reviewed. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 44 | already-realized legacy facts are not deleted. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 45 | already-realized legacy facts are not reclassified. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 46 | future immutable legacy publication is not rewritten. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 47 | conversion accounts for future published legacy authority. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 48 | future accepted legacy decisions are not silently discarded. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 49 | future legacy Omit does not become First-Class omission. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 50 | future legacy Move does not become First-Class pin. | Established — C: independent candidates, existing Sleep, attachment/realized/decision guards; S: newly published future evidence rejects stale review. |
| 51 | conversion itself creates no Accepted Sleep placement. | Established — S: conversion leaves decisions/execution/publications empty; writer changes only authored aggregate. No Progress/recommendation/health writer is called. |
| 52 | conversion itself creates no publication. | Established — S: conversion leaves decisions/execution/publications empty; writer changes only authored aggregate. No Progress/recommendation/health writer is called. |
| 53 | conversion itself creates no execution. | Established — S: conversion leaves decisions/execution/publications empty; writer changes only authored aggregate. No Progress/recommendation/health writer is called. |
| 54 | conversion itself creates no Progress. | Established — S: conversion leaves decisions/execution/publications empty; writer changes only authored aggregate. No Progress/recommendation/health writer is called. |
| 55 | conversion itself creates no recommendation. | Established — S: conversion leaves decisions/execution/publications empty; writer changes only authored aggregate. No Progress/recommendation/health writer is called. |
| 56 | conversion itself creates no learned preference. | Established — S: conversion leaves decisions/execution/publications empty; writer changes only authored aggregate. No Progress/recommendation/health writer is called. |
| 57 | conversion itself creates no health inference. | Established — S: conversion leaves decisions/execution/publications empty; writer changes only authored aggregate. No Progress/recommendation/health writer is called. |
| 58 | conversion itself creates no one-off override. | Established — S: conversion leaves decisions/execution/publications empty; writer changes only authored aggregate. No Progress/recommendation/health writer is called. |
| 59 | converted requirement enters the existing solver normally. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 60 | converted requirement enters existing Capacity integration normally. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 61 | converted requirement enters existing Goal planning normally. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 62 | converted requirement enters existing Friction normally. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 63 | converted requirement enters existing publication normally. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 64 | converted requirement enters existing execution/history normally. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 65 | conversion does not create a parallel planning path. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 66 | conversion invalidates stale derived state through existing semantics. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 67 | stale publication readiness cannot survive conversion. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 68 | Today continues to consume Published Plan truth. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 69 | conversion does not make unpublished Sleep appear as Today planned truth. | Established — S: Preview stale, normal regeneration and fresh publication; P: Sleep planning, corrective, publication and Today suites; unchanged downstream contracts. |
| 70 | old profiles are not silently converted. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 71 | active conversion does not rewrite unrelated saved profiles. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 72 | profile saved after conversion does not restore duplicate converted legacy ownership. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 73 | converted profile activation creates fresh First-Class lifetime. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 74 | profile activation does not reuse live conversion incarnation incorrectly. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 75 | full backup preserves conversion authority. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 76 | full restore preserves First-Class lifetime identity. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 77 | full restore preserves legacy retirement. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 78 | full restore preserves conversion provenance. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 79 | full restore preserves legacy history. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 80 | full restore preserves First-Class history. | Established — S: old/new profiles, exact V14 backup/restore/restart, legacy and First-Class history round-trip; profile projection strips live lineage. |
| 81 | malformed conversion authority fails safely. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 82 | missing converted requirement is not treated as successful conversion. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 83 | retirement/cutover mismatch fails safely. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 84 | duplicate converted future ownership fails safely. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 85 | unknown conversion version fails safely. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 86 | older backups without conversion remain valid. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 87 | older backups do not gain inferred conversion. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 88 | startup migration does not convert legacy Sleep. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 89 | structural schema migration does not infer requiredness. | Established — C/S: malformed source/lifetime/retirement/version/fingerprint rejects; old V13 restore/startup produces no inferred Sleep. |
| 90 | clear removes conversion authority according to existing semantics. | Established — S: clear/retry/restart, edit/delete/recreate lifetime checks and distinct immutable histories; historical UI labels legacy template Sleep. |
| 91 | clear does not allow requirement resurrection. | Established — S: clear/retry/restart, edit/delete/recreate lifetime checks and distinct immutable histories; historical UI labels legacy template Sleep. |
| 92 | clear does not allow retired recurrence resurrection. | Established — S: clear/retry/restart, edit/delete/recreate lifetime checks and distinct immutable histories; historical UI labels legacy template Sleep. |
| 93 | conversion history remains lineage after later First-Class edits. | Established — S: clear/retry/restart, edit/delete/recreate lifetime checks and distinct immutable histories; historical UI labels legacy template Sleep. |
| 94 | deleting/recreating First-Class Sleep does not transfer old conversion authority to new incarnation. | Established — S: clear/retry/restart, edit/delete/recreate lifetime checks and distinct immutable histories; historical UI labels legacy template Sleep. |
| 95 | legacy and First-Class historical identities remain distinct across cutover. | Established — S: clear/retry/restart, edit/delete/recreate lifetime checks and distinct immutable histories; historical UI labels legacy template Sleep. |
| 96 | historical query may show both generations without merging them. | Established — S: clear/retry/restart, edit/delete/recreate lifetime checks and distinct immutable histories; historical UI labels legacy template Sleep. |
| 97 | candidate-discovery heuristics are distinct from conversion authority. | Established — C: deterministic/non-mutating review and independent candidate tests; existing active owner and solver reused; §§85/90 architecture assessment. |
| 98 | conversion preserves deterministic behavior. | Established — C: deterministic/non-mutating review and independent candidate tests; existing active owner and solver reused; §§85/90 architecture assessment. |
| 99 | conversion adds no second persistence owner unless unavoidable and explicitly justified. | Established — C: deterministic/non-mutating review and independent candidate tests; existing active owner and solver reused; §§85/90 architecture assessment. |
| 100 | Task 9.16 completes legacy transition without reopening First-Class Sleep architecture. | Established — C: deterministic/non-mutating review and independent candidate tests; existing active owner and solver reused; §§85/90 architecture assessment. |

## 63. Candidate Discovery Coverage

C covers no-candidate recovery, category/title/default-ID heuristics, deterministic copies and independent multiple candidates. Source arrays and Sleep authority remain unchanged by discovery.

## 64. Explicit Authority / Confirmation Coverage

C rejects unconfirmed commands; U reaches review through ordinary controls and proves no write until checkbox and Confirm conversion. Busy/dirty states prevent dependent actions; changes clear review.

## 65. Exact Mapping Coverage

C verifies exact minutes, protection, weekday/date mapping, complete clock intent and explicit before/after-Work span/fallback/preference. Existing Sleep domain tests validate clock/DST/window structure.

## 66. Ambiguity / Unsupported Coverage

C covers missing legal window/span/fallback, fixed-start-only input, unsupported recurrence, resources, active attachments, Work-anchor conditionality, multiple future recurrence and existing Sleep. No guessed conversion succeeds.

## 67. Atomicity Coverage

C injects each ID-allocation/staging failure and proves input non-mutation. S rejects a lossy serialization before commit, and injects actual localStorage aggregate commit failure and proves unchanged runtime/checkpoint, then successful retry. All requirement/retirement/provenance fields share one validated serialization; there is no independent intermediate durable write to inject between them.

## 68. Idempotence Coverage

C/S repeat the exact successful command without allocating or rewriting and reject a changed request with the same command ID. One record, requirement lifetime and retirement survive restart.

## 69. Cutover Coverage

C expands legacy candidates across the day before/cutover/day after and checks First-Class effective applicability. S regenerates and verifies no selected future legacy block remains.

## 70. Day Boundary / Shift Transition Coverage

C exercises boundaries 00:00/03:00/12:00 and all five required Work transition pairs, preserving owner label and source lifetimes. P exercises canonical user-day, Sleep Work/DST expansion and joint feasibility; no conversion-specific geometry resolver exists.

## 71. Historical Preservation Coverage

S publishes legacy Sleep, records completion, correction and retraction, compares exact history before/after conversion, publishes/reports First-Class Sleep, then restores the combined backup unchanged. C/S never mutate history as conversion output.

## 72. Future Publication / Realization / Decision Coverage

C verifies future omit/move/duration/priority and realized support guards with validated realized fact construction. S adds future publication after review, proves rejection/no partial change, and verifies later cutover. V14 rejects inconsistent retained future authority.

## 73. Existing First-Class Sleep Coverage

C tests effective/disabled/future/revised sources. S tests a First-Class source appearing after review. No overwrite/merge occurs.

## 74. Profile Coverage

C validates portable projection and fresh incarnation allocation. S saves before conversion, saves after conversion, loads each, and verifies retired dates/new lifetime versus old legacy candidate. Existing profile ingress/durability suites also run.

## 75. Backup / Restore Coverage

S validates V14, clears, restores through importBackupFile, restarts and compares live lineage. The combined historical round-trip covers both generations and actuals. DayFrameApp tests verify product V14 export and ordinary file-picker import.

## 76. Malformed Authority / Protection Coverage

C/S reject missing requirement, wrong incarnation, missing legacy source, retirement mismatch, unsupported conversion version and broken mapping fingerprint. Existing protected Active/restore/historical tests exercise surrounding admission. No malformed state is repaired.

## 77. Clear / Anti-Resurrection Coverage

S clears active authority after conversion, invokes active/profile retries and restarts; neither requirement, retired recurrence nor provenance returns. Existing full-clear/runtime transaction tests remain in focused validation.

## 78. Stale Review Coverage

C detects lifetime replacement and changed idempotence input. S detects recurrence replacement, changed day boundary, an appearing Sleep source and newly published future evidence. Future decision tests verify the selected-source guard; complete authority is part of the fingerprint.

## 79. Derived-State Freshness Coverage

S proves Preview stale then regeneration and fresh publication. P covers Capacity, Goal feasibility/proposals, accepted-allocation realization, corrective freshness and publication source changes. Conversion only changes their canonical authored dependencies; it creates no parallel cache-update path.

## 80. Legacy / First-Class Coexistence Coverage

C converts one independent source and compares the other recurrence unchanged. S preserves distinct legacy versus First-Class historical identities. Existing Task 9.15 coexistence tests remain in the focused suite.

## 81. Non-Activation Coverage

S confirms conversion itself creates no plan decision, publication or execution. Inspected command staging writes only the active aggregate and notifies existing consumers. No Progress/learning/recommendation/score/device/health subsystem was added or invoked.

## 82. Determinism / Non-Mutation Coverage

C compares repeated reviews, whole context copies, failed staging inputs and retained realized facts. Discovery/review never allocate. Conversion ordering and fingerprints are deterministic for fixed inputs; UUIDs are intentionally fresh only at confirmation.

## 83. Performance Assessment

Observed in the focused Node/Vitest run with fake IndexedDB, one daily legacy candidate, one Work cycle, and a 31-owner-day regeneration. These are local observations, not budgets or semantic timeouts. Discovery is the mean of 100 calls; other operations are single measured calls. The regeneration test asserts no duplicate selected legacy future expansion.

| Operation | Milliseconds |
|---|---:|
| discoveryMeanMs | 0.008 |
| reviewMs | 0.255 |
| conversionMs | 0.906 |
| profileSaveMs | 0.257 |
| backupMs | 2.015 |
| backupValidationMs | 0.669 |
| profileLoadMs | 0.233 |
| restoreMs | 15.448 |
| regenerate31DaysMs | 10.874 |

No large-history production latency guarantee is claimed. Review deliberately scans retained publication/decision evidence; it runs on demand outside startup.

## 84. Bundle Architecture Assessment

| Metric | Task 9.15 / captured baseline | Task 9.16 final |
|---|---:|---:|
| Initial gzip | 166,310 | 168,185 |
| Initial raw | 638,276 | 645,745 |
| Largest lazy chunk | 53,183 | 59,671 |
| Total emitted | 1,101,789 | 1,127,513 |

Initial gzip delta: **+1,875 bytes**. Unchanged hard limit: **170,000 bytes**. Remaining hard headroom: **1,815 bytes**. Raw and largest-lazy hard gates also pass. Initial-gzip headroom advisory (>161,500) and total architecture-review advisory (>825,000) remain visible.

`legacySleepConversion` is dynamically imported by store commands and stays with the lazy Setup path for UI discovery/review. Only current aggregate validation and thin command wiring enter the existing startup graph. `dayFrameBackupV14` stays lazy with existing backup transfer/restore machinery. No solver or historical engine was duplicated into startup and no threshold was raised.

## 85. Architecture Governance Assessment

No unresolved normative Sleep authority question was found, so no new ADR was created. The existing `ADR_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTENCE_FOUNDATION.md` received a bounded schema-extension note documenting Active V4, Backup V14, unchanged Profiles V3 and portable-vs-live lineage. This fulfills the schema-documentation requirement without reopening Sleep architecture. Bundle thresholds and dependencies are unchanged.

## 86. Test Coverage

New tests cover the explicit conversion core, actual store persistence/restore/history flow, and ordinary conversion controls. The existing app test now expects V14 and exercises V14 file-picker import. Existing Sleep/legacy/profile/restore/clear/decision/realization/planning/Today suites provide regression coverage for downstream behavior. §87 records commands and observed results, including initial failures rather than claiming every first attempt passed.

## 87. Validation Record

All commands below ran from `code/` except git inspection/diff checks at repository root.

| Command | Result |
|---|---|
| `npm run format` | Passed; unchanged pre-existing files retained |
| `npx prettier --check .` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed (TypeScript + Vite) |
| `npm test -- --maxWorkers=2` (final) | Test Files  145 passed (145); Tests  1470 passed (1470); Duration  57.28s (transform 5.19s, setup 0ms, import 16.69s, tests 64.98s, environment 13.02s) |
| Broad focused command below (before the last three defensive regressions) | Test Files  76 passed (76); Tests  859 passed (859); Duration  35.74s (transform 3.49s, setup 0ms, import 10.01s, tests 46.70s, environment 5.97s) |
| `DAYFRAME_916_METRICS=/tmp/dayframe-916-performance.json npx vitest run src/core/sleep/legacySleepConversion.test.ts src/state/legacySleepConversion.test.ts src/ui/tests/LegacySleepConversionSection.test.tsx` (final) | 3 files, 58 tests passed; 1.93 s |
| `npm run check:bundle` | Passed all hard gates; advisory warnings retained |
| `git diff --check` | Passed |

Exact focused invocation (performance environment only writes observational test data):

```sh
DAYFRAME_916_METRICS=/tmp/dayframe-916-performance.json \
npx vitest run \
--maxWorkers=2 \
src/core/blocks/tests/generateBlockCandidates.test.ts \
src/core/blocks/tests/placeBlockCandidates.test.ts \
src/core/decisions/createPlanDecisionAcceptanceCandidate.test.ts \
src/core/decisions/planDecision.test.ts \
src/core/decisions/replayPlanDecisions.test.ts \
src/core/execution/tests/executionRecord.test.ts \
src/core/execution/tests/executionSummary.test.ts \
src/core/execution/tests/historicalExecutionTarget.test.ts \
src/core/execution/tests/historicalPlanExecutionTarget.test.ts \
src/core/friction/tests/applySuggestedFix.test.ts \
src/core/friction/tests/detectScheduleFriction.test.ts \
src/core/friction/tests/generateSuggestedFixes.test.ts \
src/core/historicalIntelligence/completionDistribution.test.ts \
src/core/historicalIntelligence/goalActivity.test.ts \
src/core/historicalIntelligence/schedulingRealization.test.ts \
src/core/historicalPlan/historicalPlan.test.ts \
src/core/historicalPlan/materializePlanPublication.test.ts \
src/core/planning/capacity.test.ts \
src/core/planning/goalFeasibility.test.ts \
src/core/planning/realizedScheduleIdentity.test.ts \
src/core/planning/sleepPlanningIntegration.test.ts \
src/core/sleep/legacySleepConversion.test.ts \
src/core/sleep/sleepCorrective.test.ts \
src/core/sleep/sleepDerivation.test.ts \
src/core/sleep/sleepOccupancy.test.ts \
src/core/sleep/sleepOffset.test.ts \
src/core/sleep/sleepPublication.test.ts \
src/core/sleep/sleepRequirement.test.ts \
src/core/time/__tests__/canonicalUserDay.test.ts \
src/core/today/buildTodayReadModel.test.ts \
src/infrastructure/restore/restoreInfrastructure.test.ts \
src/state/activeV2.test.ts \
src/state/activeV2Migration.test.ts \
src/state/capacitySurface.test.ts \
src/state/dayFrameBackup.test.ts \
src/state/dayFrameBackupV10Integration.test.ts \
src/state/dayFrameBackupV12.test.ts \
src/state/dayFrameBackupV3.test.ts \
src/state/dayFrameBackupV4.test.ts \
src/state/dayFrameBackupV5.test.ts \
src/state/dayFrameBackupV5Integration.test.ts \
src/state/dayFrameBackupV6.test.ts \
src/state/dayFrameBackupV6Integration.test.ts \
src/state/dayFrameBackupV7.test.ts \
src/state/dayFrameBackupV7Integration.test.ts \
src/state/dayFrameBackupV8Integration.test.ts \
src/state/dayFrameBackupV9Integration.test.ts \
src/state/dayFrameFullClear.test.ts \
src/state/dayFrameProfiles.test.ts \
src/state/dayFrameRestoreComposition.test.ts \
src/state/executionHistoryIndexedDb.test.ts \
src/state/executionHistorySurface.test.ts \
src/state/historicalIntelligenceQuery.test.ts \
src/state/historicalPlanSurface.test.ts \
src/state/legacySleepConversion.test.ts \
src/state/planDecisionSurface.test.ts \
src/state/realizationSurface.test.ts \
src/state/schedulePublication.test.ts \
src/state/sleepCorrectiveIntegration.test.ts \
src/state/sleepFoundation.test.ts \
src/state/sleepPlanningIntegration.test.ts \
src/state/sleepPublicationExecution.test.ts \
src/state/sleepPublicationStorage.test.ts \
src/state/sleepResolutionQuery.test.ts \
src/state/todayQuery.test.ts \
src/ui/tests/ConstructivePlanningWorkflow.test.tsx \
src/ui/tests/DayFrameApp.test.tsx \
src/ui/tests/ExecutionHistoryPanel.test.tsx \
src/ui/tests/ExecutionSummarySection.test.tsx \
src/ui/tests/HistoricalIntelligenceSummary.test.tsx \
src/ui/tests/HistoricalPlanReportingSection.test.tsx \
src/ui/tests/LegacySleepConversionSection.test.tsx \
src/ui/tests/SleepHistorySection.test.tsx \
src/ui/tests/TodaySurface.test.tsx \
src/ui/tests/executionHistoryPresentation.test.ts \
src/ui/tests/executionReportingWorkflow.test.ts
```

Earlier development runs found fixture/type/lint issues, which were corrected. The first complete run had 2 failures: the existing app export assertion still expected V13, and ConstructivePlanningWorkflow timed out awaiting the lazy Goal planning region under full parallel load. The export expectation was updated to V14; no Goal workflow production code or timeout was changed. The subsequent five-file regression passed 189 tests, and the ordinary full run passed 1,467 tests. A repeat focused run encountered the same Goal-region timing failure; rerunning focused validation with two workers passed without changing assertions or timeout. Final full validation also uses two workers. Final serialization round-trip and post-commit observer failure regressions were added: committed authority is reported as success even if a notification listener throws. Initial lint reported unused projection bindings; these were resolved. Only final passing evidence is used for completion.

Temporary raw evidence is retained under `/tmp/dayframe-916-*` (baseline, build, format, prettier, lint, full/focused test logs, bundle JSON and observations). This RESULT is the sole durable task report.

## 88. Changed Files

Accounting compares current bytes to the saved Task 9.16 content baseline, not just git’s much larger accumulated Phase 9 diff. **24 files** differ, including this required RESULT. The 145 pre-existing status entries are preserved in §3. No pre-existing file was deleted or reset; no unrelated baseline hash changed. New files from earlier tasks that were still untracked are correctly classified as modified pre-existing content here.

| File | Task 9.16 accounting |
|---|---|
| `code/src/core/sleep/legacySleepConversion.test.ts` | New Task 9.16 file |
| `code/src/core/sleep/legacySleepConversion.ts` | New Task 9.16 file |
| `code/src/core/sleep/legacySleepConversionRecord.ts` | New Task 9.16 file |
| `code/src/core/sleep/legacySleepConversionTestFixtures.ts` | New Task 9.16 file |
| `code/src/core/sleep/resolveRequiredSleep.ts` | Modified pre-existing dirty/untracked content |
| `code/src/state/activeV2.ts` | Modified pre-existing dirty/untracked content |
| `code/src/state/activeV3.ts` | Modified pre-existing dirty/untracked content |
| `code/src/state/activeV4.ts` | New Task 9.16 file |
| `code/src/state/backupTransferSurface.ts` | Modified pre-existing dirty/untracked content |
| `code/src/state/dayFrameBackupV14.ts` | New Task 9.16 file |
| `code/src/state/dayFrameProfilesV3.ts` | Modified pre-existing dirty/untracked content |
| `code/src/state/dayFrameRestoreComposition.ts` | Modified pre-existing dirty/untracked content |
| `code/src/state/dayFrameRestoreTranslation.ts` | Modified pre-existing dirty/untracked content |
| `code/src/state/dayFrameStore.ts` | Modified pre-existing dirty/untracked content |
| `code/src/state/legacySleepConversion.test.ts` | New Task 9.16 file |
| `code/src/state/types.ts` | Modified pre-existing dirty/untracked content |
| `code/src/ui/DayFrameApp.tsx` | Modified pre-existing dirty/untracked content |
| `code/src/ui/HistoricalPlanReportingSection.tsx` | Modified previously clean file |
| `code/src/ui/LegacySleepConversionSection.tsx` | New Task 9.16 file |
| `code/src/ui/SetupScreen.tsx` | Modified previously clean file |
| `code/src/ui/tests/DayFrameApp.test.tsx` | Modified pre-existing dirty/untracked content |
| `code/src/ui/tests/LegacySleepConversionSection.test.tsx` | New Task 9.16 file |
| `docs/adr/ADR_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTENCE_FOUNDATION.md` | Modified pre-existing dirty/untracked content |
| `docs/implementation/phase-9/PHASE_9_TASK_9_16_FIRST_CLASS_SLEEP_LEGACY_CONVERSION_PRODUCT_TRANSITION_V1_RESULT.md` | New Task 9.16 file |

Final HEAD remains `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. No commit or push. `git status --short`, `git diff --stat`, task-baseline diffs and `git diff --check` were inspected. Schema-note edits are accounted for separately from the single RESULT; no second task report was created.

## 89. Deferred Work

Deferred by scope: automatic migration/inference, reverse conversion, split Sleep/naps, one-off omission/shortening/buffer waiver, health/learning/scoring/recommendations, devices, final Planner/Summary shell, general HistoricalPlan recovery UX, new default-install Sleep policy, and conversion of unsupported recurrence/resource/composition/conditional-Work semantics. These cases return explicit review/unsupported results; they do not prevent the bounded supported transition from completing.

## 90. First-Class Sleep Foundation Completion Assessment

The required First-Class Sleep foundation is complete across Tasks 9.10–9.16: authored domain/persistence, canonical derivation and joint feasibility, Capacity/Goal planning integration, Friction/corrective authority, frozen publication, explicit execution/history, and conservative explicit legacy transition. Task 9.16 closes the final required transition seam. No additional required pre-shell Sleep architecture task is identified. This does not declare every future Sleep product feature implemented or every legacy shape convertible.

## 91. Completion Assessment

Task 9.16 — First-Class Sleep Legacy Conversion & Product Transition V1 is COMPLETE.

Supported conversions are reachable, explicit, prospective, atomic and lifetime-safe; history remains distinct and unchanged. Unsupported/ambiguous configurations fail conservatively. No commit or push was performed.
