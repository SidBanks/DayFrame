# Task 9.22 — My Schedule Convergence V1 RESULT

## A. Executive Summary

Implemented the My Schedule landing and its three authored domains: Work Pattern, Sleep and Commitments. First-Class Sleep now has ordinary create/edit/disable controls through its existing revision-checked command. Work retains its established modes and shared setup draft. Commitments gain bounded search/filter, human durations, focused advanced controls and read-only support relationships.

No new domain authority, persistence schema, dependency, scheduling semantics or recovery workflow. No compatibility surface retired. Task 9.22 is complete; all final verification gates pass.

## B. Repository Baseline

Starting HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Captured 964 files, their contents and SHA-256 hashes, HEAD and exact dirty status before editing in `/tmp/dayframe-922-baseline/`.

Fresh baseline: **152 test files / 1,527 tests passed in 62.66s**. Build and bundle hard policy passed. Initial JS 618,770 raw / 161,960 gzip bytes; largest lazy chunk 59,671; total JS 1,174,210; hard gzip headroom 8,040.

The repository already contained substantial uncommitted Phase 9 implementation, task documents and dogfood evidence. The exact starting status is retained here:

<details>
<summary>Exact starting git status --short (169 entries)</summary>

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
 M code/src/ui/HistoricalPlanReportingSection.tsx
 M code/src/ui/MonthlyPlannerSurface.tsx
 M code/src/ui/PlannerSurface.tsx
 M code/src/ui/PlanningReviewPanel.tsx
 M code/src/ui/PreviewScreen.tsx
 M code/src/ui/ScheduleReviewPanel.tsx
 M code/src/ui/SetupScreen.tsx
 M code/src/ui/TodaySurface.tsx
 M code/src/ui/acceptedDecisionPresentation.test.ts
 M code/src/ui/acceptedDecisionPresentation.ts
 M code/src/ui/dayFrameUi.css
 M code/src/ui/plannerReviewPresentation.ts
 M code/src/ui/scheduleReviewReadiness.ts
 M code/src/ui/tests/DayFrameApp.test.tsx
 M code/src/ui/tests/HistoricalPlanReportingSection.test.tsx
 M code/src/ui/tests/MonthlyPlannerSurface.test.tsx
 M code/src/ui/tests/PreviewScreen.test.tsx
 M code/src/ui/tests/ProductSurfaces.test.tsx
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
?? code/src/core/productEvidence/
?? code/src/core/sleep/
?? code/src/core/time/physicalOccupancy.ts
?? code/src/state/acceptedPlanningEvidenceQuery.ts
?? code/src/state/activeV3.ts
?? code/src/state/activeV4.ts
?? code/src/state/backupTransferSurface.ts
?? code/src/state/constructivePlanningWorkflow.ts
?? code/src/state/dayFrameBackupV13.ts
?? code/src/state/dayFrameBackupV14.ts
?? code/src/state/dayFrameProfilesV3.ts
?? code/src/state/legacySleepConversion.test.ts
?? code/src/state/productEvidence.test.ts
?? code/src/state/productEvidenceSources.ts
?? code/src/state/publicationEligibility.ts
?? code/src/state/selectedDayEvidenceQuery.ts
?? code/src/state/sleepCorrectiveIntegration.test.ts
?? code/src/state/sleepExecutionCommand.ts
?? code/src/state/sleepFoundation.test.ts
?? code/src/state/sleepHistoryQuery.ts
?? code/src/state/sleepPlanningIntegration.test.ts
?? code/src/state/sleepPublicationExecution.test.ts
?? code/src/state/sleepPublicationStorage.test.ts
?? code/src/state/sleepResolutionQuery.test.ts
?? code/src/ui/AcceptedPlanningSummary.tsx
?? code/src/ui/DayOutcomeControl.tsx
?? code/src/ui/DayWorksurface.tsx
?? code/src/ui/GoalPlanningSection.tsx
?? code/src/ui/LegacySleepConversionSection.tsx
?? code/src/ui/ScheduledGoalFacts.tsx
?? code/src/ui/SleepHistorySection.tsx
?? code/src/ui/acceptedPlanningSummaryContext.ts
?? code/src/ui/acceptedPlanningSummaryPresentation.ts
?? code/src/ui/dayWorksurfacePresentation.ts
?? code/src/ui/plannerNavigation.ts
?? code/src/ui/planningResultCopy.ts
?? code/src/ui/tests/AcceptedPlanningNavigation.test.tsx
?? code/src/ui/tests/AcceptedPlanningSummary.test.tsx
?? code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx
?? code/src/ui/tests/DayWorksurface.test.tsx
?? code/src/ui/tests/LegacySleepConversionSection.test.tsx
?? code/src/ui/tests/NavigationFoundation.test.tsx
?? code/src/ui/tests/SleepHistorySection.test.tsx
?? code/src/ui/tests/acceptedSummaryFixtures.ts
?? docs/adr/ADR_CANONICAL_PRODUCT_EVIDENCE_PROJECTIONS.md
?? docs/adr/ADR_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTENCE_FOUNDATION.md
?? docs/hydration/DayFrame_Complete_Hydration_Package_2026-09-21.md
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
?? docs/implementation/phase-9/TASK_9.16_FIRST_CLASS_SLEEP_LEGACY_CONVERSION_PRODUCT_TRANSITION_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.17_PLANNER_SUMMARY_PRODUCT_CONVERGENCE_MOBILE_UX_SPECIFICATION_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.17_Planner_SUMMARY_PRODUCT_CONVERGENCE_AND_MOBILE_UX_SPECIFICATION_V1.md
?? docs/implementation/phase-9/TASK_9.18_PLANNER_SUMMARY_NAVIGATION_FOUNDATION_V1.md
?? docs/implementation/phase-9/TASK_9.18_PLANNER_SUMMARY_NAVIGATION_FOUNDATION_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.19_CANONICAL_PRODUCT_EVIDENCE_PROJECTION_V1.md
?? docs/implementation/phase-9/TASK_9.19_CANONICAL_PRODUCT_EVIDENCE_PROJECTION_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.20_CANONICAL_DAY_WORKSURFACE_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.20_CANONICAL_DAY_WORKSURFACE_CONVERGENCE_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.21_ACCEPTED_PLANNING_SUMMARY_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.21_ACCEPTED_PLANNING_SUMMARY_CONVERGENCE_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.22_MY_SCHEDULE_CONVERGENCE_V1.md
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

Task-relative hash comparison changes only the seven pre-existing files listed in D; all other captured contents remain unchanged, with no missing baseline files. A new `docs/architecture/DAYFRAME_GOAL_LIFECYCLE_ARCHITECTURE_SPECIFICATION_V1.md` appeared after the baseline through external work. It was not created or changed by this task.

## C. Discovery Findings

Recorded before implementation:

- My Schedule previously navigated directly to workPattern. PlannerSurface exposed Work Pattern and Commitments as its two child destinations. usePlannerNavigation owned the ephemeral Back stack and Calendar context.
- Work and Commitments already used one app-owned SetupDraft and commitAuthoredSetupTransaction. Save validates the complete authored snapshot and preserves source lifetimes. It does not generate, accept or publish.
- Work supports manualSegments (dated periods), repeatingSequence (rotation), and legacy shift weekdays. Existing explicit mode selection retains inactive structures; convergence requires no new conversion. Cross-midnight is an explicit ShiftDefinition field.
- Segment Day Boundary/week-start overrides are separate from global defaults. Global controls and previewRange previously lived in planningSettings/full SetupScreen. They can be reused in Work context without a second owner.
- authorSleepRequirement provides expected revision/incarnation checks, append-preserved revision history, canonical validation, protection and persistence outcomes. Disabling is enabled=false in an authored revision. Deletion is separate and unnecessary here.
- Sleep intent supports duration, buffers, weekdays, effective dates, clock/preferred-clock windows and beforeWork/afterWork windows with a span and off-day fallback. The contract supports an ordinary editor. No omission, shortening or splitting authority is needed.
- queryEffectiveSleepRequirement provides effective/notApplicable/disabled/notConfigured/protected/invalid states. No primary requirement is silently created for an unconfigured user.
- Accepted Sleep placements remain PlanDecision authority, reviewed/revoked in Review Plan. Requirement edits mark Preview stale without deleting decisions.
- Legacy conversion uses candidate discovery, explicit reviewed semantics, a fingerprint, confirmation and prospective cutover. Category/title heuristics are not conversion authorization. Existing First-Class Sleep blocking remains.
- CommitmentSection cloned a per-item entry and explicitly updated it into the shared setup draft. Its full-object copying preserves advanced values. Recurrence includes daily, weekly, specificWeekdays, timesPerUserWeek, perShiftSegment and custom.
- Commitment authority supports fixed/flexible placement, fixed/custom clocks, buffers, priority, resource fields, recurrence dates and requiresWorkAnchor. There is no canonical exclude-Work-days flag; this task does not invent one.
- CompositionSurface separately owns support/attachment relationships. Preserve exact endpoints and expose their current links read-only.
- Existing responsive Setup grids and focus helpers were reusable, but Commitment lists were unbounded and durations were raw minutes.

## D. Implementation

All Task 9.22 files, relative to the repository root:

| File                                               | Role                                                                                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| code/src/ui/DayFrameApp.tsx                        | Lazy destination wiring, canonical Sleep capabilities, shared-draft discard, canonical setup issue context                                              |
| code/src/ui/PlannerSurface.tsx                     | My Schedule landing and Work/Sleep/Commitments child navigation                                                                                         |
| code/src/ui/plannerNavigation.ts                   | Two presentation destinations added to the existing navigation owner                                                                                    |
| code/src/ui/SetupScreen.tsx                        | Work context, Day Boundary/week/planning range reachability, Work item disclosure, one compatibility detail editor, discard and validation presentation |
| code/src/ui/CommitmentSection.tsx                  | Search/status/category filters, 10-row reveal, human duration, canonical validation, advanced/context integration and focus fallback                    |
| code/src/ui/dayFrameUi.css                         | Scoped responsive layout, 44px targets, focus, wrapping and short-viewport toolbar behavior                                                             |
| code/src/ui/tests/DayFrameApp.test.tsx             | Existing regressions follow new navigation/disclosure while retaining their authority assertions                                                        |
| code/src/ui/MyScheduleSurface.tsx                  | New saved-source landing summaries                                                                                                                      |
| code/src/ui/SleepRequirementSection.tsx            | New ordinary canonical Sleep requirement editor and contextual review/conversion links                                                                  |
| code/src/ui/DurationFields.tsx                     | New exact hours/minutes representation control                                                                                                          |
| code/src/ui/CommitmentAdvancedFields.tsx           | New per-item placement, buffers, Work relationship and date controls                                                                                    |
| code/src/ui/CommitmentRelationshipContext.tsx      | New read-only, incarnation-qualified support links                                                                                                      |
| code/src/ui/tests/MyScheduleConvergence.test.tsx   | New landing, bounded list, save/cancel, round-trip, relationship, separation and focus regressions                                                      |
| code/src/ui/tests/SleepRequirementSection.test.tsx | New Sleep authoring, invalid/stale/protected states and accepted-placement preservation regressions                                                     |
| code/src/ui/tests/myScheduleFixtures.ts            | New 50-Commitment/multiple-Work fixture shared with disposable browser validation                                                                       |
| This RESULT                                        | Durable discovery, implementation and validation evidence                                                                                               |

Temporary production-fixture entry/config files were copied to /tmp and removed. A test cache created by an early wrong-directory invocation was removed. No commit or push.

## E. Final My Schedule Structure

```text
Planner → My Schedule
├── Work Pattern
├── Sleep
└── Commitments
```

The landing shows saved-source orientation and explicit entry buttons. It warns when Work/Commitment setup changes remain unsaved; its counts do not pretend the draft was saved. Work edits the existing shared draft. Sleep saves independently through its own command. Commitments manages authored obligations, with one focused ordinary editor and separately preserved support relationships.

The landing does not mount all editors. Planning review remains a separate explicit destination.

## F. Authority Analysis

| Boundary                                          | Evidence                                                                                      |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| My Schedule owns no time or authored domain state | Landing props are state snapshots and navigation callbacks; no persisted MySchedule aggregate |
| Work remains Work authority                       | Existing SetupDraft and commitAuthoredSetupTransaction                                        |
| SleepRequirement remains Sleep authority          | Existing authorSleepRequirement, exact expected revision/incarnation and canonical validation |
| Commitment remains Commitment authority           | Cloned full entries enter the existing setup transaction; no replacement recurrence model     |
| Form draft ≠ authored state                       | Typing and cancellation leave store snapshots unchanged                                       |
| Authored edit ≠ planning acceptance               | Browser command counts and tests show no generation/acceptance/publication from editing       |

Composition relationships, accepted Sleep placements, publications, execution and Progress remain outside the new editors' write scope.

## G. Work Pattern Evidence

Repeating rotations and dated periods are named in the landing/orientation. Existing detailed Cycle Type controls retain their established “Repeating sequence” / “Manual date ranges” values. Individual shifts, cycles and dated segments disclose their existing editors. Contextual Work requests can open their existing editing context.

Day Boundary and Week Starts On now appear in Work Pattern context. Copy explicitly identifies global defaults and dated-period overrides. Override checkboxes and “Use global” options are preserved. The fixture includes an overnight 22:00–06:00 shift, two dated segments, a 12:00/Wednesday segment override, and a separate repeating on/off rotation. Saving an ordinary Work edit preserves mode, sequence, override and cross-midnight fields.

Existing setup normalization may populate the inactive sequence anchor from a dated cycle's start date; that pre-existing behavior is covered in the round-trip assertion and is not a mode conversion. No new Work mode conversion was introduced.

Planning Range is reachable nearby but remains the existing independent previewRange generation setting, not Work recurrence.

## H. First-Class Sleep Evidence

Ordinary path: Planner → My Schedule → Sleep.

Editable recurring intent: enabled state; duration; before/after buffers; effective-from and optional exclusive-until date; all/specific weekdays; clock, before-Work or after-Work mode; Work-relative span; mandatory off-day window; optional preferred clock start.

Hours/minutes and native date/time controls translate representation only. The store appends a validated revision, preserving the source lifetime. New-form defaults are merely draft values until Save Sleep. Reopening consumes canonical state, not a UI-owned saved copy.

Invalid and stale writes retain the draft with an error. Protected/invalid source evidence disables authoring and is not presented as no configuration. Persistence pending/failure is explicitly distinguished from durable success.

The overview distinguishes latest authored configuration from the effective state for the current canonical user-day label. It does not equate configured intent with feasible placement. Review Plan evaluates placement. No solver call, health inference, numeric Sleep priority, one-off omission, shortening, split, nap or buffer waiver was added.

A regression creates an accepted Sleep placement through canonical resolution/trial/acceptance, edits the requirement through the UI, and verifies the full decision collection is unchanged. Review/revocation remains an explicit separate Review Plan path.

## I. Legacy Sleep Evidence

Category-Sleep Commitments are labeled as legacy Sleep in the list. The existing conversion section remains in Commitments, with an additional contextual disclosure from Sleep.

Opening My Schedule, Sleep or conversion does not convert anything. Existing candidate discovery, review, fingerprint, cutover and final confirmation semantics are unchanged. Busy/dirty states retain their existing gates. A local unsaved Sleep form also blocks conversion in its contextual path. Existing First-Class Sleep continues to block conversion through the canonical review owner.

Conversion stays lazy, prospective and explicit. No past publication or execution evidence is rewritten.

## J. Commitment Evidence

The list supports name search, enabled/disabled and category filtering, with 10 initial rows and Show more increments of 10. It includes long names, duration, recurrence, enabled state and legacy labeling. Counts explicitly describe the setup draft.

The focused editor clones the full source entry. Hours/minutes preserve canonical totals (90 → 1h30m; editing to 1h15m → 75). Advanced options are per-item: placement, fixed/custom clocks, requires-Work, priority, buffers, reschedule behavior and recurrence dates.

Changing placement does not silently delete incompatible clock values. Explicit Clear fixed start / Clear custom window controls let the user remove them; canonical validation rejects inconsistent combinations. Existing advanced recurrence types remain preserved unless explicitly changed. Resource metadata and other unedited fields round-trip unchanged.

The older detailed editor remains reachable for resource/advanced editing, but mounts at most one selected Commitment in this domain and is hidden while the focused editor is open. Expand All does not mount 50 complete editors.

Current support links match exact source ID and incarnation. Parent/child direction, requiredness and timing strictness are displayed read-only; relationships are not flattened or recreated. A real store relationship remains byte-equivalent through child editing.

“Requires a Work shift” uses requiresWorkAnchor. Excluding Work days is unsupported future authority, not a new inferred control in this task.

## K. Draft / Save Semantics

Work and Commitment changes share the established app-owned setup draft. Update Commitment changes that draft; Save Setup runs the canonical transaction. Sleep has its own revision-checked save. Tests verify a Sleep save does not consume an unsaved Work draft.

Canceling the focused Commitment or Sleep form makes no authored mutation. Discard unsaved setup changes explicitly restores the shared Work/Commitment draft from current canonical state. Failed canonical writes do not optimistically patch sources. Setup failures now expose source-oriented context from canonical validation issues; the existing overall failure message remains.

Successful state updates come from the store subscription/canonical result. Existing freshness and durability feedback remain. Work/Commitment draft contents persist across domain navigation; unsubmitted local forms are not separately persisted. Back uses the one existing Planner stack, while explicit form Cancel returns from inline editing.

## L. Planning Separation

At every tested width, the browser workflow made exactly two setup save calls and two Sleep author calls (one invalid and one successful). It made **zero generatePreview, acceptPlanDecision or publishScheduleRange calls**. Unsaved Work changes were compared against the pre-edit store snapshot before save.

The new Sleep editor receives no proposal, realization, publication, execution or Progress writer. Work/Commitments use the pre-existing authored setup command. Full regression coverage preserves the other authorities. No automatic Friction resolution, Goal movement, regeneration, realization, publication, execution or Progress mutation was added.

## M. Compatibility Disposition

| Surface                                                | Disposition                                             | Reason                                                                      |
| ------------------------------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| Full Setup compatibility editor                        | RETAIN                                                  | Existing advanced fields and canonical transaction semantics                |
| Calendar authored workspace                            | RETAIN                                                  | Existing contextual editing and Calendar return behavior                    |
| Detailed Commitment/resource fields                    | RETAIN                                                  | Some advanced/resource controls remain here; bounded to one selected source |
| Legacy Sleep conversion                                | TRANSITIONAL, retained                                  | Explicit prospective migration workflow remains necessary                   |
| Existing Review Plan / accepted Sleep placement review | BLOCKED BY LATER CONVERGENCE for redesign; retained now | Separate planning/acceptance authority                                      |
| Existing Summary, History, Progress and Sleep history  | RETAIN                                                  | Outside this authored-source slice                                          |

No surface was declared ready for retirement or deleted.

## N. Large-Data Behavior

Production fixture: 50 Commitments, long names, enabled/disabled entries, mixed daily/specific-weekday/custom/per-shift recurrence, exact resource metadata, buffers and overnight custom windows; one overnight shift; dated segments with an override; a repeating on/off cycle; a legacy Sleep source; and a First-Class Sleep requirement created through the UI.

Initial list: 10 rows, no focused ordinary editor. Show more reveals 20; search reduces to one. Only the selected ordinary editor is mounted. Work disclosure avoids opening all segments initially. No virtualization/dependency was needed.

## O. Mobile Acceptance Gate

Production Vite output was served with a disposable Chromium profile and real store/domain commands. The temporary fixture entry rendered the actual DayFrameApp, lazy editors and shared source fixture. The ordinary production entry was checked separately.

| Width | Work / Sleep / Commitments                                                    | Overflow and targets                                                | Navigation / semantics                    |
| ----- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| 320   | Complete editing, save/cancel, advanced/date/time and invalid-Sleep workflows | Document width 320; visible controls and checkbox labels ≥44 CSS px | Back and cross-domain paths pass          |
| 390   | Same authored capabilities                                                    | Width 390; targets ≥44px                                            | Same final semantic values/command counts |
| 768   | Same authored capabilities                                                    | Width 768; targets ≥44px                                            | Same final semantic values/command counts |
| 1280  | Same authored capabilities                                                    | Width 1280; targets ≥44px                                           | Same final semantic values/command counts |

Forty-four captures cover landing, Work source editing, dated override detail, Sleep form/error/saved state, bounded Commitment list, ordinary/advanced editing, all three domains at 320×360, and 200% reflow. Cross-width assertions compare authored semantic fields while excluding random identities/timestamps.

The mobile/short-viewport setup toolbar and section headers now scroll normally: they no longer cover the form with stacked sticky regions. Native input/selector and checkbox-label targets were measured alongside buttons and summaries, allowing only 0.01px floating-point tolerance. No horizontal overflow occurred.

Evidence: `/tmp/dayframe-922-browser.json`, `/tmp/dayframe-922-<width>-<case>.png`, `/tmp/dayframe-922-qa.mjs`. Findings are preserved here; browser artifacts are disposable.

## P. Accessibility

Touched controls use explicit labels/accessible names, semantic headings, native input semantics, visible focus and non-color-only status. Work disclosures expose aria-expanded; advanced/reference sections use native details/summary. Form errors use alert semantics and explanatory context.

Ordinary editor cancellation restores focus; when a renamed Commitment leaves the active search results, focus falls back to the list heading instead of disappearing. Existing app navigation focuses its destination context. The final production focus regression restores commitments-heading after a filtered rename; Tab continues to Add Commitment with a solid visible outline, no overflow and zero authored commands. Evidence: /tmp/dayframe-922-focus-browser.json. Keyboard focus, date input operation, touch reachability, short viewport operation and 200% reflow were exercised in Chromium.

This is not screen-reader certification, full WCAG certification, cross-browser certification or physical-device/hardware-keyboard/soft-keyboard testing.

## Q. Performance

My Schedule performs no G1/G2 planning query and creates no evidence cache. It reads existing authored state; Sleep uses the existing synchronous effective-requirement query. Support inspection subscribes to the existing composition owner. Filtering/reveal does not issue per-row planning queries.

In the production fixture, My Schedule resource loads were approximately 2.9–3.3ms, SetupScreen 6.1–9.0ms and Sleep editor 2.8–3.3ms across the four widths. The ordinary production entry at 320px reached the three-card landing in approximately 380ms, including lazy loading and automation wait overhead. These are local diagnostic observations, not an SLO or device-performance certification.

The standard entry loaded no My Schedule/Work/Sleep editor chunk before navigation. Entering the landing loaded only MyScheduleSurface among those chunks. Entering Sleep loaded its editor; the legacy conversion chunk remained unloaded until its explicit workflow.

## R. Bundle

| Measure                    | Fresh baseline |     Final |   Delta |
| -------------------------- | -------------: | --------: | ------: |
| Initial raw JS             |        618,770 |   621,318 |  +2,548 |
| Initial gzip JS            |        161,960 |   162,642 |    +682 |
| Largest lazy chunk         |         59,671 |    62,652 |  +2,981 |
| Total emitted JS           |      1,174,210 | 1,199,106 | +24,896 |
| Hard initial gzip headroom |          8,040 |     7,358 |    −682 |

The hard initial gzip limit remains **170,000 bytes**, unchanged; policy passes. Existing initial-gzip (>161,500) and total-JS (>825,000 architecture-review) advisories remain. The largest lazy chunk is SetupScreen, below its 100,000 hard and 80,000 advisory thresholds. Detailed editors and legacy conversion retain lazy boundaries.

## S. Tests

Fresh baseline: **152 files / 1,527 tests**.

Focused UI/navigation/Commitment/Sleep suites passed **4 files / 142 tests** before the final focus-edge regression. The final added focus regression suite passed **1 file / 7 tests**. Canonical Sleep, corrective integration, legacy conversion and setup lifecycle focus passed **5 files / 64 tests**.

New regressions cover three-domain navigation/Back with no writes, bounded 50-item lists, exact advanced/resource/recurrence preservation, human durations, Work mode/override/overnight preservation, shared-draft discard, independent Sleep save, canonical support links, explicit clock clearing, invalid duration, no implicit requirement, invalid/stale/protected Sleep, Work-relative/off-day/applicability round-trip, recurring disable and accepted-placement preservation.

Final whole suite: **154 test files / 1,540 tests passed in 80.35s** (+2 files / +13 tests over baseline). Final typecheck, lint, Prettier, build, bundle hard policy and diff checks pass.

## T. Validation Commands

Executed in `code/` unless stated otherwise:

- Fresh baseline and final `npm test -- --maxWorkers=2`.
- `npm run format`; `npx prettier --check .`.
- `npm run lint`; `npm run typecheck`.
- `npm run build`; `npm run check:bundle`.
- Focused Vitest runs for MyScheduleConvergence, SleepRequirementSection, DayFrameApp, CommitmentSection, LegacySleepConversionSection, SetupLifecycle, sleepFoundation, sleepCorrectiveIntegration and legacySleepConversion.
- Temporary fixture: `npx vite build --config qa922.config.ts`; preview on 127.0.0.1:4922 with /tmp/dayframe-922-qa-dist.
- Ordinary production preview on 127.0.0.1:4923.
- `node /tmp/dayframe-922-qa.mjs` and `--production`, using the disposable local CDP profile.
- Repository `git diff --check` and complete task-relative SHA-256 audit.

Logs use `/tmp/dayframe-922-` with baseline-tests, baseline-build, baseline-bundle, focused, domain-focused, focus-regression, tests-final, types, lint, prettier, build-final and bundle-final suffixes.

Intermediate fixture/JSX/test-selector failures were corrected. The first browser driver access required approved local CDP access after sandbox rejection. Browser command instrumentation was moved outside the store's cached proxy wrappers so counts measure the actual public calls. All final claims use the corrected runs.

## U. Persistence / Dependencies

No schema, persistence version, package manifest/lockfile, runtime dependency, bundle policy, backup, profile, restore or clear/restart contract changed. No persisted My Schedule aggregate or UI-only authored field was added. Existing full-suite profile/backup/restore coverage passes.

## V. Preserved Dogfood Evidence

The original preserved dogfood state was not mutated, cleared, migrated, normalized or repaired. Browser work used only the dedicated /tmp/dayframe-922-chrome profile. Captured repository evidence, including the dogfood PDF, remains hash-identical. Existing unrelated dirty work and the externally added Goal lifecycle document are preserved.

## W. Remaining Gaps

No new Work mode conversion policy, exclude-Work-days Commitment semantics, one-off Sleep exception authority, HistoricalPlan recovery or compatibility retirement is included. These are future architecture/convergence tasks, not partially implemented controls. Resource editing remains in the retained per-source compatibility editor. Physical-device and cross-browser certification remain unclaimed.

## X. Next-Task Assessment

The smallest next product-convergence slice appears to be Goals: the Planner destination remains its existing GoalSection while My Schedule now has a coherent authored home. The externally added Goal lifecycle specification should be reviewed as that task's input; this result does not implement or approve its semantics.

Review Plan convergence remains separate because it spans generation, freshness, proposal acceptance, Sleep placements and publication. Protected History Access is an independent access/recovery task; it is not a prerequisite for My Schedule. Broader Summary convergence can likewise proceed independently after its own contract review. No next task number is assumed.

Task 9.22 — My Schedule Convergence V1 is COMPLETE.
