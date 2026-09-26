# Task 9.13 — First-Class Sleep Capacity & Planning Integration V1 RESULT

## 1. Executive Summary

First-Class Sleep now constrains ordinary movable placement, demand-neutral Capacity, Goal feasibility, Competition, Allocation, Proposal derivation and realization eligibility. The existing 9.12 solver runs first against current authored/hard authority. One adapter protects its activity and both buffers; downstream planning cannot reposition it.

Every unresolved Sleep state fails closed through explicit derived qualification. Accepted Allocations and existing realized facts survive Sleep changes. No new persisted schema, Sleep decision, publication subject, execution subject, conversion or dependency was introduced.

## 2. Scope and Governing Architecture

Scope is Task 9.13 under the Task 9.10 architecture and completed 9.11/9.12 foundations. Authority remains Authored → Derived → Proposed → Accepted → Scheduled/Realized → Published → Execution/Progress → History. This task changes derived planning and adds a pre-realization eligibility check; it does not authorize planning to change Sleep.

No architecture document or ADR needed amendment. Existing Sleep authoring/persistence, identity and solver policy remain unchanged.

## 3. Pre-Implementation Repository State

HEAD before work: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. The workspace was already extensively dirty from earlier Phase 9 tasks, including untracked Sleep foundation code and user-supplied task documents. No applicable AGENTS.md was found.

Before implementation, all 893 existing tracked/untracked nonignored files were copied to `/tmp/dayframe-913-baseline`; the file list and status were recorded in `/tmp/dayframe-913-files.json` and `/tmp/dayframe-913-status.txt`. A build from that copied baseline independently confirmed initial gzip 166,973 bytes. Task-only comparison is against this snapshot, not against HEAD. No files were deleted; no commit or push occurred.

## 4. Current Planning Pipeline Trace

Pre-implementation production trace:

| Path                     | Actual owner and behavior before integration                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sleep                    | `sleepRequirement.ts` validates dated revisions; `deriveSleepOccurrences.ts` resolves canonical windows and Work anchors; `sleepFoundationalOccupancy.ts` replays hard authority/composition; `solveRequiredSleep.ts` performs bounded exhaustive minute-domain joint search; `resolveRequiredSleep.ts` composes H, guards and complete context. Store exposed a lazy, read-only query.                                                                                                         |
| Ordinary placement       | `generateSchedulePreview.ts` generated Work/candidates, replayed accepted PlanDecisions, called `placeBlockCandidates`, then derived ordinary Friction/Suggested Fixes and visible projections. `generateBlockCandidates` owns daily/weekly/specific-weekday/times-per-week expansion. `placeBlockCandidates` owns preferred windows, before/after Work, buffers, legacy Sleep propagation and unplaced handling. Shared `physicalOccupancy.ts` owns buffer-expanded interval union/complement. |
| Composition              | Store filtered independently recurring attached children, then `compositionSurface.applyCompositionToSchedule` called `projectCompositeOccurrence`. Required missing/conflicting support remains a liability.                                                                                                                                                                                                                                                                                   |
| Capacity                 | `capacitySurface.queryCapacity` required cached Preview and passed scheduled/Work geometry, composites, realized facts, accepted-unrealized liabilities, stale flag and planning window to `deriveCapacity`. Core Capacity unions exclusions and constructs day intervals/aggregates.                                                                                                                                                                                                           |
| Goal feasibility         | `evaluateGoalDemandFeasibility` projects the authored demand and resolves its resource footprint, then `evaluateGoalFeasibility` converts Capacity intervals into Goal opportunities. This is where physical Capacity becomes Goal-specific feasibility.                                                                                                                                                                                                                                        |
| Competition / Allocation | `allocationSurface.evaluateCompetingAllocation` queries Capacity, projects current demands/priorities, computes feasibility, then invokes `deriveCompetingDemandSets` and `allocateAllCompetitionSets`.                                                                                                                                                                                                                                                                                         |
| Proposal / Acceptance    | `constructivePlanningWorkflow.evaluatePlanningRequest` derives/records Proposals from evaluated allocations; `proposalSurface` owns records and explicit acceptance. Production acceptance revalidates using current allocation.                                                                                                                                                                                                                                                                |
| Realization              | `realizationSurface.realizeAcceptedAllocation` resolves accepted authority, stages immutable productive/support/protection facts, checks existing facts plus current Preview schedule, and atomically persists. It had no current Sleep guard.                                                                                                                                                                                                                                                  |

Inspected existing placement, Work-relative, canonical boundary/cycle, Capacity, feasibility, Allocation, Proposal, realization, publication and execution suites before implementation. The existing generic scheduling algorithm was reusable, but its exported function/file name made Preview appear to own it.

## 5. Task 9.12 Foundation Consumed

Consumed `SleepResolutionV1`, full solved occurrence footprints, source incarnation/owner/slot references, requirement revision, dependency fingerprint, finite direct guards, physical context, deterministic budget diagnostics and typed failure states. The solver, occurrence derivation, identity, requirement schema and persistence remain unchanged.

The hard-occupancy adapter is reused for downstream physical protection, including authoritative geometry outside the visible owner labels. Goal Demand, ordinary movable candidates, Proposals and accepted-unrealized claims never enter the Sleep solver as physical blockers.

## 6. Canonical Planning Dependency Order

Current authored snapshot + canonical time + Work/manual/fixed/exact accepted/realized authority → `resolveRequiredSleep` → `qualifyFoundationalPlanning` → `generatePlanningSchedule` ordinary placement → composition → `deriveCapacity` → Goal feasibility → Competition → Allocation → Proposal.

`deriveFoundationalSchedule` is the shared composition owner. Store queries recompute it; Preview consumes it when Sleep is authored. Its engine delegates remain pure derived functions. No Goal or Commitment preference feeds back into Sleep ranking.

## 7. Foundational Planning Qualification

`FoundationalPlanningQualificationV1` exposes `status: allocatable | nonAllocatable`, the complete typed Sleep resolution, and the canonical protection pieces. Absence/non-applicability is explicit. An unresolved result has no protection witness and cannot yield allocatable intervals.

Capacity retains this qualification rather than representing unresolved Sleep solely by a numeric total. Competition and Allocation carry explicit non-allocatable markers. The constructive workflow returns `blocked` before looking for a selected demand or fabricating a Proposal.

## 8. Sleep Resolution State Mapping

`notConfigured`, `notApplicable`, and `satisfied` pass the foundation gate. All other Sleep states fail it. Existing non-Sleep liabilities may still qualify otherwise safe Capacity. Section 33 gives the exact consumer mapping.

## 9. Solved Sleep Physical Geometry Adapter

`core/planning/foundationalPlanning.ts::qualifyFoundationalPlanning` is the only solved-Sleep adapter. It takes the actual witness endpoints and emits distinct `activity`, `beforeBuffer`, and `afterBuffer` pieces, each with source reference and dependency fingerprint. Zero-length buffers are omitted.

Placement, Capacity and realization consume these pieces. None independently constructs a Sleep window or reranks its candidates. `FoundationalOccupancyV1` classifies authoritative blockers of Sleep; derived Sleep protection deliberately remains a separate derived type so it cannot become self-blocking accepted authority.

## 10. Sleep Footprint Protection Semantics

The physical union of the three pieces is exactly `[footprintStart, footprintEnd)`. Activity is an occupied contributor; buffers are protection contributors. Half-open adjacency is legal. The authored valid window remains a flexibility domain and is never subtracted wholesale.

The adapter retains complete guard footprints. Consumers use physical intersection, not owner-label equality.

## 11. Dependency Freshness

There is no mutable solution cache. The cached object in the store is the dynamically imported module, not any planning result. Every query captures current authored setup, decisions, composition and realization authority and derives a new foundation. The returned temporal resolver belongs to that snapshot, avoiding a later live boundary lookup during Capacity construction.

Sleep authoring/deletion now marks cached Preview stale. Capacity ignores Preview geometry/freshness. Goal feasibility refreshes a supplied Capacity query in the production store, so an older caller-held result cannot bypass new Sleep. Allocation carries a derived foundation fingerprint; production Proposal derivation checks it against current foundation and returns incomplete input on mismatch. Acceptance retains its existing current-allocation revalidation. Realization checks current geometry synchronously immediately before staging.

## 12. Planning Scope / Sleep Scope Relationship

The requested planning owner range H determines Capacity aggregation. Ordinary candidate generation includes adjacent owners; Work-relative searches can reach 24 hours, and legacy propagation can reach a full candidate footprint.

The Sleep owner range is H padded on each side by `3 + ceil(max ordinary template full-footprint minutes / 1440)` civil labels. This covers adjacent generation, Work-relative reach, clock/offset carry and full template footprints. Task 9.12 then adds its own directly intersecting guard domains and complete Work/hard context. All those full Sleep domains are solved jointly, without recursive infinite guard closure.

Movable placement additionally has physical fences at the padded owner-range envelope. Composition uses the same envelope and rejects support outside it. Capacity clips exclusions to H; realization rejects claims outside its accepted horizon. This prevents cross-boundary placement from using unvalidated physical time.

The 9.12 limit remains 366 Sleep owner labels, including this explicit planning padding. A 366-day requested planning range therefore fails `contextIncomplete`; it is not silently clipped. With no templates, 360 requested days plus six context days succeeds in the measured fixture. Wider/other scopes are separate deterministic problems and can select a different unpublished witness.

## 13. Ordinary Movable Commitment Integration

The old scheduling implementation now lives in `generatePlanningSchedule.ts`; `generateSchedulePreview.ts` is a compatibility export. `placeBlockCandidates` receives additional foundational occupancy only for movable searches, including propagated legacy Sleep. Existing fixed/exact replay does not collide with its own hard witness.

The shared composition supplies Work, hard authority and solved Sleep before ordinary placement. Flexible Commitments retain existing preferred-window, recurrence, priority, buffer and unplaced rules. They move to an available opening or remain unplaced; they never request a new Sleep witness.

## 14. Fixed / Locked Commitment Semantics

Fixed/exact authoritative geometry is resolved by the existing 9.12 blocking adapter before Sleep. A conflict can make the entire foundation infeasible. No fixed authority is moved or rewritten. On a failed gate, the shared schedule contains no successful ordinary scheduling result; fixed geometry remains authored/accepted authority rather than being repaired here.

## 15. Legacy Sleep Coexistence

Legacy title/category does not classify First-Class Sleep. Movable legacy Sleep participates in ordinary placement around the solved witness and may become unplaced. Fixed legacy Sleep remains a hard blocker. Neither family is merged, converted, deleted, hidden or retired. Backup regression still retains both authored families.

## 16. Capacity Integration

Production Capacity now queries current shared planning rather than requiring Preview. The old standalone surface adapter retains its legacy Preview fallback for callers without a planning provider; the production store always supplies the provider.

Core Capacity unions existing scheduled/Work/realized/hard exclusions with canonical Sleep pieces. Duplicate/overlapping exclusions do not subtract durations twice. Full hard geometry is available even when its owner lies outside the displayed day. Accepted-unrealized claims remain liabilities, not Sleep blockers or physical ownership.

## 17. Capacity Coverage / Qualification Semantics

A failed foundation sets Capacity allocability to `nonAllocatable` and coverage to `unavailable`, retains the complete Sleep reason, and exposes no allocatable intervals. Day qualification follows the same gate. Numeric summary fields remain structurally compatible but are not evidence of known zero; consumers inspect qualification first.

A valid fully occupied day still has complete, allocatable qualification and zero intervals/minutes. Feasibility and UI distinguish that known insufficiency from foundational unknown.

## 18. Cross-Boundary Capacity

Capacity excludes every intersecting physical piece regardless of its Sleep owner day. Tests at boundaries 00:00, 03:00 and 12:00 include a previous-owner physical tail. The same solved witness feeds ordinary placement and Goal opportunities for those boundaries.

## 19. Goal Feasibility Integration

`evaluateGoalFeasibility` returns `unknown` with `sleepFoundationNonAllocatable` before enumerating opportunities from an unresolved foundation. Known insufficient post-Sleep Capacity remains `infeasible`; smaller demand can remain `feasible`. Requested effort/session intent is unchanged. Production supplied-Capacity evaluation refreshes from current planning dependencies.

## 20. Goal Competition Integration

Competition admits claims only from non-blocked Capacity and matching feasibility fingerprints. Its derived result marks `nonAllocatable` when blocked. Sleep never becomes a Goal/Demand competitor. Existing priority and tie-break behavior is unchanged. The integration fixture proves two 600-minute demands can fit before Sleep but only one after Sleep removes one eligible opening.

## 21. Allocation Integration

Allocation does not search a non-allocatable Capacity result and returns no ordinary alternatives. Both per-set and aggregate results retain explicit qualification; the per-set result carries the Sleep foundation fingerprint for downstream freshness checking. Existing assignment/ranking semantics remain unchanged. Physical claims come only from post-Sleep opportunities.

## 22. Proposal Integration

Core Proposal derivation maps blocked Allocation to the existing typed `noProposal` reason `incompleteInput`, distinct from ordinary no-fit/no-demand reasons. Production derivation also checks current Sleep qualification/fingerprint. The application workflow returns `blocked / sleepFoundationNonAllocatable` before ordinary empty/no-demand handling.

The existing Goal planning surface displays a concise blocked explanation. No Planner redesign or new decision workflow was added.

## 23. Accepted Allocation Preservation

Sleep edits do not mutate Proposal decisions or Accepted Allocation records. Unrealized accepted claims remain liability/evidence. Current mismatches are derived, not persisted as a new accepted lifecycle. Tests preserve the full accepted collection before/after Sleep editing and a rejected realization.

## 24. Realization Eligibility

`realizationSurface` accepts a synchronous foundation eligibility callback. After resolving a complete accepted allocation and before staging any new facts, production recomputes current shared planning, rejects unresolved foundations, rejects claims outside the accepted physical horizon, and rejects any claim overlapping solved Sleep activity or buffers.

The existing command result is `inapplicable` with new reason `sleepFoundationReviewRequired`; no fact is persisted. Matching current geometry remains realizable, and already-realized idempotence is preserved. A dependency edit that still leaves all accepted physical claims safe is not an automatic cancellation. Existing non-Sleep schedule-conflict checks remain in place.

## 25. Existing Realized Authority Preservation

Existing productive Goal work, support activity and protected buffer remain hard immutable facts. They enter 9.12 resolution and downstream Capacity. Tests exercise all three roles making new Sleep infeasible, then assert non-allocatable planning and unchanged authority. A production store test realizes Goal work first and verifies it survives a later incompatible Sleep revision.

## 26. Preview Integration Boundary

Preview is not a prerequisite for production Capacity, feasibility, Allocation or Proposal. When Sleep is authored, Preview consumes the same shared derivation and retains a distinct `foundation` field; cloning preserves that field and composition results. It does not insert First-Class Sleep into `scheduledBlocks` or create a hidden template.

Without authored Sleep, Preview preserves its compatibility path. Trial Suggested Fix application cannot replace a Preview with movable geometry overlapping its solved Sleep protection. No Sleep-specific visual rendering was needed.

## 27. Planning Coverage Semantics

Review's existing planning-data coverage becomes `unknown` when its generated Preview has a non-allocatable foundation. Its source fingerprint observes the foundation. Existing publication readiness consequently returns `planningCoverageIncomplete`; no new Sleep publication semantics are introduced.

An authored Sleep edit also marks old Preview stale, so old planning cannot be presented as fresh publication readiness.

## 28. Failure-Closed Behavior

All five unresolved states terminate the shared scheduling gate and propagate through unavailable Capacity, unknown Goal feasibility, non-allocatable Competition/Allocation and blocked/incomplete Proposal. None is translated into absence, ordinary known-zero time or known Goal insufficiency. A protected active checkpoint is exercised through production ingress, not a mock boolean.

## 29. Determinism and Non-Mutation

Domain tests permute shift/sequence/recurrence insertion order and compare solved Sleep, placement, Capacity and Goal pipeline results. Store tests repeat queries without Preview, change the selected Preview range, and compare results. Core scheduling timestamps used for query-only diagnostics are fixed; semantic geometry does not depend on the wall clock.

Pure queries preserve authored state, source incarnations, local-storage bytes/write count, Backup V13 and existing authority. They create no persistent solution cache. Different explicit H ranges remain different problems, as documented in Section 12.

## 30. Friction / Suggested Fix Non-Activation

No First-Class Sleep Friction or Suggested Fix was added. Failed foundational Preview produces an explicit qualification rather than a Sleep friction point. Existing ordinary/legacy Commitment and required-composition liabilities retain their established treatment. Trial non-Sleep fixes are prevented from crossing the derived Sleep protection.

## 31. Publication / Today Non-Activation

No Sleep subject, occurrence snapshot, publication batch/context schema, seam rule or Today historical subject was added. Publication still materializes only existing supported source families. The bounded indirect change is existing readiness: stale Preview after Sleep edits and unknown planning coverage after unresolved Sleep can block publication. Today publication truth is unchanged.

## 32. Execution / Progress / History Non-Activation

No Sleep execution, skipped/unplanned Sleep, Sleep Progress, history record or learned preference was added. Existing execution/history/publication tests pass. A solved interval is disposable planning evidence, never an actual outcome.

## 33. Capacity Qualification Matrix

| Sleep Resolution  | Foundational Planning  | Capacity State                                                      | Goal Feasibility                       | Allocation                      | Proposal                                |
| ----------------- | ---------------------- | ------------------------------------------------------------------- | -------------------------------------- | ------------------------------- | --------------------------------------- |
| notConfigured     | allocatable foundation | Existing rules, no inferred Sleep                                   | Existing feasibility                   | Existing allocation             | Ordinary opportunity/no-opportunity     |
| notApplicable     | allocatable foundation | Validated no-obligation scope                                       | Existing feasibility                   | Existing allocation             | Ordinary opportunity/no-opportunity     |
| satisfied         | allocatable foundation | Solved footprint union excluded; ordinary liabilities still qualify | Post-Sleep feasible/partial/infeasible | Post-Sleep claims only          | Post-Sleep claims only                  |
| infeasible        | nonAllocatable         | unavailable coverage; typed cause, no intervals                     | unknown                                | nonAllocatable; no alternatives | workflow blocked / core incompleteInput |
| searchIncomplete  | nonAllocatable         | unavailable coverage; typed cause, no intervals                     | unknown                                | nonAllocatable; no alternatives | workflow blocked / core incompleteInput |
| contextIncomplete | nonAllocatable         | unavailable coverage; typed cause, no intervals                     | unknown                                | nonAllocatable; no alternatives | workflow blocked / core incompleteInput |
| invalid           | nonAllocatable         | unavailable coverage; typed cause, no intervals                     | unknown                                | nonAllocatable; no alternatives | workflow blocked / core incompleteInput |
| protected         | nonAllocatable         | unavailable coverage; typed cause, no intervals                     | unknown                                | nonAllocatable; no alternatives | workflow blocked / core incompleteInput |

## 34. Physical-Ownership Matrix

| Physical Source                | Owns/Protects Time?              | Capacity Exclusion?        | Blocks Movable Commitment?  | Goal Planning Effect                      | May 9.13 Move It?                       |
| ------------------------------ | -------------------------------- | -------------------------- | --------------------------- | ----------------------------------------- | --------------------------------------- |
| Work                           | Yes                              | Yes                        | Yes                         | Reduces physical openings                 | No                                      |
| Solved Sleep activity          | Derived protection               | Yes                        | Yes                         | Reduces openings                          | No                                      |
| Sleep before-buffer            | Derived protection               | Yes                        | Yes                         | Reduces openings                          | No                                      |
| Sleep after-buffer             | Derived protection               | Yes                        | Yes                         | Reduces openings                          | No                                      |
| Fixed Commitment               | Yes                              | Yes                        | Yes                         | Reduces openings / may block Sleep        | No                                      |
| Movable Commitment             | Derived when placed              | When placed                | Existing placement ordering | Reduces openings or creates liability     | Existing placement only                 |
| Manual fixed Event             | Yes                              | Yes                        | Yes                         | Reduces openings / may block Sleep        | No                                      |
| Realized Goal work             | Yes                              | Yes                        | Yes                         | Reduces openings / may block Sleep        | No                                      |
| Support Activity               | Yes when hard/realized or placed | Yes                        | Yes when hard/placed        | Exclusion or unresolved support liability | Only ordinary movable derivation        |
| Protected Buffer               | Yes                              | Yes                        | Yes                         | Protected physical time                   | Only ordinary movable derivation        |
| Goal Demand                    | No                               | No                         | No                          | Goal-specific requested effort            | No intent rewrite                       |
| Proposal                       | No                               | No                         | No                          | Derived option only                       | New derivation, no automatic acceptance |
| Accepted Allocation unrealized | No physical ownership            | Liability, not subtraction | No                          | Qualifies unresolved accepted intent      | No                                      |

## 35. Planning-Pipeline Matrix

| Stage                        | Input Foundation                                | Consumes Solved Sleep?      | May Change Sleep?  | Result if Sleep Unresolved                               |
| ---------------------------- | ----------------------------------------------- | --------------------------- | ------------------ | -------------------------------------------------------- |
| Sleep solver                 | Authored Sleep + canonical hard authority       | Produces witness            | No authored change | Typed unresolved result                                  |
| Movable Commitment placement | Qualified shared foundation                     | Yes                         | No                 | No successful ordinary schedule                          |
| Capacity                     | Same witness + placed/hard geometry             | Yes                         | No                 | nonAllocatable / unavailable                             |
| Goal feasibility             | Qualified Capacity                              | Indirectly                  | No                 | unknown                                                  |
| Competition                  | Capacity + feasibility                          | Indirectly                  | No                 | nonAllocatable / no admitted claims                      |
| Allocation                   | Same Capacity / opportunities                   | Indirectly                  | No                 | nonAllocatable / no alternatives                         |
| Proposal                     | Qualified Allocation + current foundation check | Yes via fingerprints/claims | No                 | blocked / incompleteInput                                |
| Acceptance                   | Existing current-allocation revalidation        | Indirectly                  | No                 | No new valid current option; existing authority retained |
| Realization eligibility      | Current shared foundation + accepted claims     | Yes                         | No                 | inapplicable / sleepFoundationReviewRequired             |

## 36. Authority Matrix

| Object                     | Layer                               | Persisted?                       | Owns Time?                  | Can Constrain Sleep? | Can Sleep Constrain It?    | 9.13 Mutation Allowed?                |
| -------------------------- | ----------------------------------- | -------------------------------- | --------------------------- | -------------------- | -------------------------- | ------------------------------------- |
| SleepRequirementV1         | Authored                            | Existing V3/V13                  | Requires derived protection | Defines problem      | No downstream rewrite      | Existing explicit author command only |
| ScheduledSleepOccurrenceV1 | Derived                             | No                               | Foundational protection     | Joint solver only    | Solver resolves joint set  | Recompute only                        |
| Work                       | Authored/derived occurrence         | Source only                      | Yes                         | Yes                  | No                         | No new authority mutation             |
| Fixed Commitment           | Authored/accepted                   | Existing source/decision         | Yes                         | Yes                  | No                         | No                                    |
| Movable Commitment         | Authored intent / derived placement | Source only                      | When placed                 | No                   | Yes                        | Derived placement only                |
| Goal Demand                | Authored                            | Existing                         | No                          | No                   | Feasibility only           | No effort rewrite                     |
| Capacity                   | Derived                             | No                               | No                          | No                   | Yes                        | Recompute                             |
| Allocation                 | Derived                             | No                               | No                          | No                   | Yes                        | Recompute                             |
| Proposal                   | Proposed                            | Existing explicit record command | No                          | No                   | Yes                        | Normal explicit proposal workflow     |
| Accepted Allocation        | Accepted                            | Existing                         | Unrealized: no              | Unrealized: no       | Eligibility/liability only | No silent rewrite/delete              |
| Realized Goal work         | Realized                            | Existing                         | Yes                         | Yes                  | Cannot move/delete         | Guard new realization only            |

## 37. Coverage Matrix

| Planning Surface        | Sleep Integrated in 9.13? | Exact Integration                     | Unknown-Sleep Behavior                             | Test Evidence                              |
| ----------------------- | ------------------------- | ------------------------------------- | -------------------------------------------------- | ------------------------------------------ |
| ordinary placement      | Yes                       | Shared witness occupancy              | Gate closed                                        | Domain integration / placement regressions |
| Preview                 | Yes, derived metadata     | Shared schedule, distinct foundation  | Empty qualified result, no invented Sleep Friction | Store query / Review cases                 |
| Capacity                | Yes                       | Interval union + foundation qualifier | unavailable, nonAllocatable                        | Eight-state / union / boundary tests       |
| Goal feasibility        | Yes                       | Qualified Capacity                    | unknown                                            | Domain and production store cases          |
| Competition             | Yes                       | Current opportunities only            | nonAllocatable/no claims                           | Competition fixture                        |
| Allocation              | Yes                       | Gate + foundation fingerprint         | nonAllocatable/no alternatives                     | Direct and aggregate tests                 |
| Proposal                | Yes                       | Gate + current foundation check       | blocked/incompleteInput                            | Domain/store/UI cases                      |
| Accepted Allocation     | Preservation              | Existing evidence/liability retained  | Review/ineligible on realization                   | Production accepted-authority tests        |
| Realization eligibility | Yes                       | Synchronous current physical guard    | inapplicable/review reason                         | Matching/mismatch/existing-fact tests      |
| Friction                | No new Sleep family       | Existing ordinary semantics only      | Qualification, not Sleep Friction                  | Failed-Preview test                        |
| Publication             | Readiness only            | Existing unknown/stale coverage gate  | publication blocked by existing reason             | Review and publication regression          |
| Today                   | No new subject            | Existing published truth              | No Sleep inferred                                  | Sleep query and full regression            |
| Execution               | No                        | Existing subjects only                | No Sleep outcome inferred                          | Execution suites                           |
| Summary/history         | No                        | Existing historical authority         | No rewrite                                         | Full regression / backup purity            |

## 38. Behavioral Invariants

All 70 requested invariants are covered by the following groups:

| Invariants          | Implementation/evidence                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–5, 52–60          | Unchanged requirement/identity/persistence schemas; retained legacy authored setup; backup/non-mutation and publication/execution regression tests.        |
| 6–17, 63–64, 67–68  | Shared derivation and sole protection adapter; movable searches, fixed conflict, domain-vs-footprint, union, buffers and three-boundary integration tests. |
| 18–27, 35           | Demand-neutral Capacity; feasibility/Competition/Allocation/Proposal gates; known-zero and blocked/no-demand tests.                                        |
| 28–34               | Eight-state integration table and production protected-ingress test.                                                                                       |
| 36–40               | Repeated queries and duration/window/Work/boundary/manual edits; old supplied Capacity and old Allocation freshness tests.                                 |
| 41–47               | Production acceptance/realization preservation and canonical realized-role blocking tests.                                                                 |
| 48–51               | Goal and ordinary-demand variations leave the canonical witness unchanged; no Goal input enters the solver.                                                |
| 61–62, 65–66, 69–70 | Input permutations, non-persisting store queries, transition fixtures, Preview-independent Capacity and full non-Sleep regressions.                        |

No invariant claims new corrective or historical authority. Tests are evidence for bounded supported query scopes, not a claim of feasibility outside the 9.12 context/search limits.

## 39. Capacity Test Coverage

New integration tests prove 8h opening − 2h solved Sleep = 6h, defensive overlap union, both buffers, authored domain versus witness, absence/non-applicability, all failure states, known zero and cross-owner exclusion. Existing Capacity suite remains green. Production query fixtures no longer require generated Preview.

## 40. Commitment Placement Coverage

Tests cover flexible preferred-time displacement, no-alternative unplaced behavior, fixed legacy conflict, movable legacy coexistence, cross-owner footprint protection, and attached support/buffers becoming a required composition liability instead of entering Sleep. Existing placement and Work-relative suites remain green.

## 41. Goal Feasibility Coverage

Tests prove feasible-before/still-feasible-after, feasible-before/known-infeasible-after, and unresolved-foundation/unknown outcomes. Different Goal demand does not change the stored derived witness. Production evaluation of old caller-held Capacity refreshes it.

## 42. Competition / Allocation Coverage

Two competing demands consume post-Sleep openings; total assignable effort falls from 1,200 to 600 minutes in the fixture. All resource claims avoid Sleep. Blocked per-set and aggregate Allocation differ from known-zero results. Existing priority/ranking regression tests pass.

## 43. Proposal Coverage

Proposal claims inherit post-Sleep opportunities; blocked Allocation yields explicit `incompleteInput`. Production derivation rejects a previous Allocation after a Sleep foundation change. The workflow distinguishes blocked planning from an absent requested demand. Existing Proposal/acceptance UI tests remain covered.

## 44. Accepted Allocation / Realization Coverage

Seven production store integration cases include current-foundation realization, retained acceptance after an overlapping Sleep edit, rejection with `sleepFoundationReviewRequired`, existing realization preserved under later infeasibility, non-persisting current queries, protected ingress, no-demand versus blocked planning, and Review readiness (some cases prove multiple obligations). Canonical role tests additionally cover realized support/protection. No accepted Sleep object is introduced.

## 45. Freshness Coverage

Duration, window, boundary and manual geometry edits change current Capacity/foundation fingerprints. A Work edit changes physical Sleep while preserving the occurrence references. Repeated and selected-view-independent queries remain deterministic. Legacy pre-9.13 non-activation assertions were updated only where this task intentionally activates planning or Preview freshness.

## 46. Boundary / Shift / Transition Coverage

Boundary cases: 00:00, 03:00, 12:00, including a previous-owner tail. Shift cases: Day/beforeWork, Evening/clock, Night/afterWork. Repeating-sequence transitions: Day→Evening, Evening→Night, Night→Day, Work→Off, Off→Work. Each checks current Sleep, physical placement and Capacity/Goal use. These are controlled semantic fixtures, not reproductions of historical dogfood incidents.

## 47. Failure-State Coverage

Domain fixtures force infeasible, searchIncomplete via deterministic budget zero, contextIncomplete via incomplete authority, invalid requirement, and protected authority. All propagate to non-allocatable Capacity, unknown feasibility and blocked/incomplete allocation/proposal. Production protected checkpoint and realized-conflict cases exercise real ingress/authority paths. The finite-range limit also returns contextIncomplete instead of truncating.

## 48. Legacy Regression Assessment

Earlier Phase 9 edits were preserved. The full regression suite includes Work, ordinary/legacy Commitments, accepted PlanDecisions, restore/backup, publication, Today, execution and history. Two earlier Sleep tests no longer assert planning non-activation, because 9.13 explicitly authorizes it. Two UI tests now assert fresh, Preview-independent Capacity rather than requiring stale/missing Preview. No tests were disabled or thresholds relaxed.

## 49. Performance Assessment

A standalone Node benchmark measured shared Sleep + ordinary schedule + Capacity using a daily 09:00–17:00 Work cycle, 420m before-Work Sleep, 30m buffers and a 540m domain. One warm-up and five measured runs per range; no wall-clock budget or mutable cache.

| Requested days | Sleep status      | Required occurrences incl. guards | Solver work units | Median ms | Max ms |
| -------------: | ----------------- | --------------------------------: | ----------------: | --------: | -----: |
|              7 | satisfied         |                                14 |               868 |     14.67 |  18.80 |
|             31 | satisfied         |                                38 |             2,356 |     29.20 |  46.29 |
|             90 | satisfied         |                                97 |             6,014 |     93.12 | 109.40 |
|            360 | satisfied         |                               367 |            22,754 |    650.80 | 737.99 |
|            366 | contextIncomplete |                                 — |                 — |     10.70 |  11.94 |

These are local measurements, not latency guarantees. Multi-demand store evaluation recomputes for freshness, so its cost can exceed a single derivation. The 366-label solver query limit includes planning padding; larger requested scopes fail closed. No solver policy/budget was weakened.

## 50. Bundle Assessment

Before: independently rebuilt 9.13 baseline, 166,973 initial gzip bytes. After: 167,553 bytes. Delta: +580 bytes. Unchanged hard limit: 170,000 bytes. Remaining headroom: 2,447 bytes.

The Sleep solver and shared foundation remain dynamic chunks. Bootstrap loads the module for the synchronous Preview/realization API; it does not cache solved data or place the solver into the static initial bundle. Existing advisory warnings remain: initial gzip above 161,500 and total output 1,053,542 bytes above the 825,000 architecture-review advisory (baseline total 1,044,768). Hard limits pass. No dependency, package lock or bundle policy changed.

## 51. Architecture Governance Assessment

No governance edits and no ADR. Task 9.10 already specifies this order and authority boundary; 9.11 amended the normative Capacity documentation. The implementation adds derived composition/qualification and a bounded realization guard, not a new normative Sleep policy.

## 52. Test Coverage

Two new integration suites contain 40 tests (33 domain/pipeline, seven production store). Existing canonical Sleep occupancy tests gain downstream fail-closed assertions for realized productive/support/protection and fixed composition. Prior Sleep foundation/query and constructive UI tests are updated for the newly authorized planning behavior.

Final focused coverage and full-suite totals are recorded below; no snapshots, cases or suites were skipped.

## 53. Validation Record

Validation commands were run from `code` unless stated otherwise:

| Command                              | Result                                                    |
| ------------------------------------ | --------------------------------------------------------- |
| `npm run format`                     | PASS; repository Prettier write script                    |
| `npm run lint`                       | PASS                                                      |
| `npm run build`                      | PASS; TypeScript and Vite                                 |
| `npm test`                           | PASS: 136 files, 1,300 tests; standalone final run 40.24s |
| `npm run check:bundle`               | PASS hard limits; advisories in Section 50                |
| `git diff --check` (repository root) | PASS                                                      |

Focused command (25 files, 283 tests PASS):

```sh
npx vitest run src/core/sleep src/core/planning/sleepPlanningIntegration.test.ts src/state/sleepPlanningIntegration.test.ts src/state/sleepResolutionQuery.test.ts src/state/sleepFoundation.test.ts src/core/blocks/tests/placeBlockCandidates.test.ts src/core/planning/capacity.test.ts src/core/planning/goalFeasibility.test.ts src/core/planning/allocation.test.ts src/core/planning/proposal.test.ts src/state/capacitySurface.test.ts src/state/proposalSurface.test.ts src/state/realizationSurface.test.ts src/core/engine/tests/workRelativeFootprint.test.ts src/core/time/__tests__/canonicalUserDay.test.ts src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts src/state/schedulePublication.test.ts src/core/execution/tests src/state/planningScopeQuery.test.ts
```

Additional measured commands: baseline copy `npm run build` and `npm run check:bundle`; `npx tsc --noEmit false --outDir /tmp/dayframe-913-compiled`; `node /tmp/dayframe-913-benchmark.mjs`.

Validation history: first regression run exposed four intentionally superseded assertions (old Sleep planning non-activation and Preview dependence). An intermediate full run passed 136 files/1,298 tests. After adding two more cases, the parallel validation run passed 1,299/1,300 and hit an existing UI `findByRole` timeout while authoring a Goal, before Sleep evaluation; no test timeout was weakened. Full suite was rerun alone to verify the final source. Temporary logs are `/tmp/dayframe-913-*-final.log`, `/tmp/dayframe-913-full-final-serial.log`, and `/tmp/dayframe-913-performance.log`.

## 54. Changed Files

28 task files: 27 code/test files plus this single RESULT. No governance, dependency, lockfile or policy files changed. All baseline files outside this list remain byte-identical; no file was removed. Earlier modifications inside already-dirty files remain in place.

| File                                                                                                         | Classification                         | Baseline distinction                                    | Purpose / semantic change                                                                                                     | Authority / persisted behavior impact                                                                          | Associated tests                               |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `code/src/core/blocks/placeBlockCandidates.ts`                                                               | Placement / Physical Occupancy         | Pre-existing modification; 9.13 addition described here | Adds movable-only foundational occupancy, preserving exact-placement self-collision rules                                     | Derived only; no persisted schema change                                                                       | placement, Work-relative and Sleep integration |
| `code/src/core/blocks/types.ts`                                                                              | Placement                              | Previously clean; 9.13 modification                     | Types the movable-only occupancy input                                                                                        | Derived only; no persisted schema change                                                                       | typecheck / placement                          |
| `code/src/core/engine/generatePlanningSchedule.ts`                                                           | Placement / Preview                    | New in 9.13                                             | Moves the existing engine to a reusable owner and accepts derived foundation/occupancy                                        | Derived only; no persisted schema change                                                                       | engine regressions and Sleep pipeline          |
| `code/src/core/engine/generateSchedulePreview.ts`                                                            | Preview                                | Pre-existing modification; 9.13 addition described here | Compatibility export delegates to reusable scheduling owner                                                                   | Derived only; no persisted schema change                                                                       | engine / store Preview                         |
| `code/src/core/engine/reviseSchedulePreview.ts`                                                              | Preview / Placement                    | Pre-existing modification; 9.13 addition described here | Retains foundation metadata and rejects trial geometry overlapping Sleep                                                      | Derived only; no persisted schema change                                                                       | engine regression / shared protection          |
| `code/src/core/planning/acceptedAllocationRealization.ts`                                                    | Realization                            | Previously clean; 9.13 modification                     | Adds derived sleepFoundationReviewRequired command reason; no persisted schema change                                         | Derived only; no persisted schema change                                                                       | production realization guard                   |
| `code/src/core/planning/allocation.ts`                                                                       | Allocation                             | Previously clean; 9.13 modification                     | Blocks search on nonAllocatable Capacity; carries derived foundation fingerprint                                              | Derived only; no persisted schema change                                                                       | allocation / Sleep pipeline                    |
| `code/src/core/planning/capacity.ts`                                                                         | Capacity                               | Previously clean; 9.13 modification                     | Unions solved/hard exclusions and retains typed unavailable qualification                                                     | Derived only; no persisted schema change                                                                       | Capacity / union / boundary                    |
| `code/src/core/planning/competingDemand.ts`                                                                  | Competition                            | Previously clean; 9.13 modification                     | Gates claim admission and exposes nonAllocatable qualification                                                                | Derived only; no persisted schema change                                                                       | competition / allocation                       |
| `code/src/core/planning/deriveFoundationalSchedule.ts`                                                       | Store / Query / Placement              | New in 9.13                                             | Composes current snapshots, padded Sleep problem, occupancy fences, ordinary schedule and composition                         | Derived only; no persisted schema change                                                                       | all new integration cases                      |
| `code/src/core/planning/foundationalPlanning.ts`                                                             | Planning Qualification / Sleep Adapter | New in 9.13                                             | Sole witness-to-activity/buffer adapter and explicit gate                                                                     | Derived only; no persisted schema change                                                                       | eight-state / buffer / footprint tests         |
| `code/src/core/planning/goalFeasibility.ts`                                                                  | Goal Feasibility                       | Previously clean; 9.13 modification                     | Distinguishes foundational unknown from known insufficiency                                                                   | Derived only; no persisted schema change                                                                       | Goal / Sleep pipeline                          |
| `code/src/core/planning/proposal.ts`                                                                         | Proposal                               | Previously clean; 9.13 modification                     | Maps blocked Allocation to existing incompleteInput result                                                                    | Derived only; no persisted schema change                                                                       | Proposal and Sleep integration                 |
| `code/src/core/planning/sleepPlanningIntegration.test.ts`                                                    | Test                                   | New in 9.13                                             | Adds integration proof                                                                                                        | Evidence only; no authority/persistence change                                                                 | Own test suite plus full regression            |
| `code/src/core/sleep/sleepOccupancy.test.ts`                                                                 | Test                                   | Pre-existing modification; 9.13 addition described here | Extends or updates existing assertions for authorized 9.13 integration                                                        | Evidence only; no authority/persistence change                                                                 | Own test suite plus full regression            |
| `code/src/state/capacitySurface.ts`                                                                          | Capacity / Store / Query               | Previously clean; 9.13 modification                     | Uses current shared planning provider; refreshes supplied Capacity for Goal feasibility                                       | Derived only; no persisted schema change                                                                       | store purity/freshness / UI                    |
| `code/src/state/constructivePlanningWorkflow.ts`                                                             | Proposal / Store / Query               | Pre-existing modification; 9.13 addition described here | Returns blocked foundation before ordinary no-demand handling                                                                 | Derived only; no persisted schema change                                                                       | store blocked/no-demand                        |
| `code/src/state/dayFrameStore.ts`                                                                            | Store / Query / Preview / Realization  | Pre-existing modification; 9.13 addition described here | Captures canonical authority, lazy-loads foundation, supplies current queries/guards, marks Preview stale and clones metadata | Existing Sleep authoring now invalidates Preview; new realization admission guard; authority schemas unchanged | store integration / full regressions           |
| `code/src/state/planningScopeQuery.ts`                                                                       | Store / Query                          | Pre-existing modification; 9.13 addition described here | Projects unknown coverage and foundation-sensitive review fingerprint                                                         | Derived only; no persisted schema change                                                                       | Review / publication regression                |
| `code/src/state/proposalSurface.ts`                                                                          | Proposal                               | Pre-existing modification; 9.13 addition described here | Applies injected current foundation qualifier before derivation                                                               | Derived only; no persisted schema change                                                                       | stale Allocation / Proposal regression         |
| `code/src/state/realizationSurface.ts`                                                                       | Realization / Accepted Allocation      | Previously clean; 9.13 modification                     | Synchronous eligibility guard before staging/persistence; preserves records on rejection                                      | May reject new realization before writes; accepted/existing realized authority unchanged                       | realization integration / regression           |
| `code/src/state/sleepFoundation.test.ts`                                                                     | Test                                   | Pre-existing modification; 9.13 addition described here | Extends or updates existing assertions for authorized 9.13 integration                                                        | Evidence only; no authority/persistence change                                                                 | Own test suite plus full regression            |
| `code/src/state/sleepPlanningIntegration.test.ts`                                                            | Test                                   | New in 9.13                                             | Adds integration proof                                                                                                        | Evidence only; no authority/persistence change                                                                 | Own test suite plus full regression            |
| `code/src/state/sleepResolutionQuery.test.ts`                                                                | Test                                   | Pre-existing modification; 9.13 addition described here | Extends or updates existing assertions for authorized 9.13 integration                                                        | Evidence only; no authority/persistence change                                                                 | Own test suite plus full regression            |
| `code/src/ui/GoalPlanningSection.tsx`                                                                        | Store / Query                          | Pre-existing modification; 9.13 addition described here | Minimal blocked explanation and current-planning copy; no layout redesign                                                     | Derived only; no persisted schema change                                                                       | constructive workflow UI                       |
| `code/src/ui/planningResultCopy.ts`                                                                          | Goal Feasibility / Realization         | Pre-existing modification; 9.13 addition described here | User-readable foundation unknown/review reason labels                                                                         | Derived only; no persisted schema change                                                                       | UI and typecheck                               |
| `code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx`                                                    | Test                                   | Pre-existing modification; 9.13 addition described here | Extends or updates existing assertions for authorized 9.13 integration                                                        | Evidence only; no authority/persistence change                                                                 | Own test suite plus full regression            |
| `docs/implementation/phase-9/PHASE_9_TASK_9_13_FIRST_CLASS_SLEEP_CAPACITY_PLANNING_INTEGRATION_V1_RESULT.md` | RESULT                                 | New in 9.13                                             | Required trace, matrices, evidence and accounting                                                                             | Documentation only                                                                                             | Heading/order and baseline checks              |

## 55. Deferred First-Class Sleep Work

Deferred: First-Class Sleep authoring/product UX; general Sleep Friction and Suggested Fix; explicit accepted Sleep placement or override; omission/shortening/buffer reduction; publication snapshots/seams and Today representation; Sleep execution/history/Progress; explicit legacy conversion; learning/preference feedback. Larger-than-supported planning scopes and broader optimization remain outside this bounded integration.

## 56. Completion Assessment

Architecture, qualification, physical geometry, ordinary placement, Capacity, Goal planning, accepted-authority preservation, freshness, non-activation, regression and documentation criteria are satisfied for supported scopes. Final validation evidence is recorded in Section 53. No commit or push was created.

Task 9.13 — First-Class Sleep Capacity & Planning Integration V1 is COMPLETE.
