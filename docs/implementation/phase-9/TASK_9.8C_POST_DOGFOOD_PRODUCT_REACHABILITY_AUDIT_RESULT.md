# Task 9.8C — Post-Dogfood Product Reachability & Workflow Audit RESULT

Audit date: 2026-09-17. Source snapshot: working tree based on `c0cc9ae2ae68af626e64747539a417f10df1cf3a`, including the pre-existing, uncommitted Task 9.8B implementation. Read-only audit; this RESULT is the only authorized repository addition.

## 1. Executive Findings

**Confirmed — substantial constructive planning is already reachable.** Planner → Goals → planning intent → evaluation → Proposal → acceptance → Realization is wired in the current working tree. Rebuilding that architecture would duplicate working production behavior. Goal Structure authoring, accepted-iteration inspection, and historical-day reporting remain disconnected or poorly exposed. [E1–E7]

**Confirmed — multiple accepted iterations retain distinct provenance.** An isolated production-store exercise accepted and realized a 60-minute request and a subsequent 120-minute request. Two Proposal identities, two Accepted Allocation identities, and two realized facts remained distinct; their combined duration was 180 minutes. This supports visual aggregation, not semantic merging. Changing Demand dates did not delete either realized fact. The reported replacement of old realized geometry is not established by current code; a separate Preview revision defect can hide realized facts without deleting authority. [E5–E7, E11; P2]

**Confirmed — publication readiness and historical availability are inconsistent.** Readiness can say “Ready to publish” while publication coverage is unknown, including when HistoricalPlan is protected. It does not consume historical protection status. Publication subsequently rejects or fails, and the UI collapses distinct causes into a generic failure. A post-commit verification-read failure can also report failure after a complete batch has been committed. Thus “without changing schedule history” is not a reliable description of every failure. Atomic writes do not imply that every unsuccessful response means no commit occurred. [E12–E14; P1]

**Confirmed — historical protection has a sound safety purpose and an incomplete product recovery path.** Invalid or inconsistent published evidence must not be overwritten or replaced by generated Preview. Today and Summary correctly refuse that substitution. Historical source export/recheck and destructive abandonment exist as store commands, but no ordinary-user HistoricalPlan recovery workflow was found. Abandonment is deletion, not reconstruction, and was not exercised. The original dogfood database was not available for forensic inspection; its precise failure cause and preservation state remain unresolved. [E14–E16]

**Confirmed — Sleep has special placement behavior but lacks the requested first-class guarantee.** It has category identity, priority, and off-day anchor propagation; it is not simply a default template. There is no invariant reserving required Sleep before all lower-authority flexible activity. Cross-boundary Sleep is possible in the beforeWork path, but a custom 22:00–08:00 window is clipped at a midnight day boundary: five otherwise fitting occurrences became unplaced in an isolated production-engine fixture. [E8–E10; P1]

**Confirmed — corrective placement contains independent defects.** A gap-search cursor can return an interval overlapping locked Work. A move of an unplaced candidate then fails acceptance mapping because the newly scheduled ID differs from the candidate ID. Successful Preview revision also omits realized Goal facts and does not supply those facts to corrective occupancy checks. These are implementation defects to address before moving the same commands into a new shell. They do not, without original inputs, prove the reported October 2 incident's cause. [E11; P3]

**Inferred — a two-surface migration can consolidate existing queries and commands.** Month, Selected Day, Planning Review, and Today contain complementary pieces of a Day Worksurface. Their data authority differs; merging presentation must preserve those distinctions. The legacy date tower still owns useful corrective interactions and cannot simply be removed first. [E17–E19]

**Not Found — a complete Found Time workflow or recurring Goal Demand lifecycle.** Manual Events, Goal association, execution, and measured Progress exist independently. A Found Time provenance discriminator is not a Found Time capture/association/reporting system. Execution duration does not automatically become measured Goal Progress. [E16, E20]

**Completion limitation:** the source audit, matrices, validation, and isolated reproductions are supplied below. The exact dogfood beforeWork overlap, approximately 18 afterWork Night Shift failures, 11 Sleep boundary failures, October 2/16 transition failures, apparent realized-geometry replacement, and protected-history incident cannot all be causally established without the incident inputs and state. This RESULT therefore does not claim COMPLETE.

## 2. Audit Method and Evidence Standard

Every factual matrix row below is **Confirmed** unless explicitly marked **Inferred** or **Not Found**. “Reported” identifies user-supplied observations, not independent reproduction. Recommendations and likely migration dispositions are **Inferred** judgments. A capability classified **E** means **Not Found after the searches described**, not proof that no imaginable implementation exists.

Production entry points were traced through React mounts, store interfaces, lazy surfaces, canonical domain functions, persistence, and downstream consumers. Tests corroborate those traces; a callable store or tested unmounted component does not establish ordinary-user reachability. No browser/profile containing the original dogfood state was opened. No original history was read, repaired, cleared, migrated, or bypassed. Temporary probes used compiled production functions and fresh in-memory `fake-indexeddb` factories, not the user's database. They establish mechanisms, not the original incident's root cause.

The corrected Task 9.8C attachment is authoritative. The older `DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf` and existing 9.8A RESULT describe an earlier snapshot; some assertions are superseded by current 9.8B wiring. In particular, “no constructive planning path” and the formerly missing conflict-navigation target are no longer current findings. The corrected task reports beforeWork failures across shifts; the older PDF's narrower account does not override it. The approximately 18 failures concern **afterWork on Night Shift**, not beforeWork.

Evidence index: paths below are relative to `code/src/`. Lines are source-snapshot locators; symbols are the stable reference. Each reference includes a production caller/consumer and test corroboration where available.

| Ref | Production evidence and flow | Test corroboration |
|---|---|---|
| E1 | `ui/DayFrameApp.tsx:2344`, Goals context mounts `GoalSection` and lazy `GoalPlanningSection`; `ui/GoalSection.tsx`, Goal creation/edit/link/reporting → `state/goalSurface.ts::createGoalSurface` → `goals` store. | `ui/tests/GoalSection.test.tsx`, `ConstructivePlanningWorkflow.test.tsx`, `state/goalSurface.test.ts` |
| E2 | `state/goalStructureSurface.ts::createRelationship` (~120), `getStructuralEligibility` (~404) → `core/planning/goalStructure.ts`; planning consumes eligibility. No production UI authoring caller located. | `goalStructureSurface.test.ts`, `goalStructureSchedulingBoundary.test.ts`, `core/planning/goalStructure.test.ts` |
| E3 | `ui/GoalPlanningSection.tsx` form and evaluate handler → `state/goalPlanningSurface.ts` revisioned Demand/Priority/footprint → `core/planning/goalDemand.ts:20`, `demandResourceFootprint.ts`; `DurationInput:590`. | `goalPlanningSurface.test.ts`, `goalPlanningSchedulingBoundary.test.ts`, `goalDemand.test.ts`, `demandResourceFootprint.test.ts`, constructive UI tests |
| E4 | `state/constructivePlanningWorkflow.ts::evaluatePlanningRequest` → `allocationSurface.ts:46` → Capacity, Demand projection, Feasibility, competing sets, Allocation; `capacitySurface.ts`, `goalDemandProjectionQuery.ts`; `core/planning/goalFeasibility.ts::enumerateSets:202`. | `capacitySurface.test.ts`, `core/planning/{capacity,goalFeasibility,allocation}.test.ts`, constructive UI tests |
| E5 | `state/proposalSurface.ts::recordProposal:103`, `supersedeProposal:119`, acceptance/freshness/claims/decisive snapshot (~180–300); `core/planning/proposal.ts`; `lazyProposalSurface.ts` resolves accepted authority for realization. Goal planning evaluation routes to Schedule Review, whose Proposal actions invoke acceptance/rejection and realization/retry. | `state/proposalSurface.test.ts`, `core/planning/proposal.test.ts`, constructive UI tests |
| E6 | `state/realizationSurface.ts::realizeAcceptedAllocation:62` → `core/planning/acceptedAllocationRealization.ts` → atomic realization/facts write; `realizedScheduleIdentity.ts:25` origin and lineage; generation and publication consume facts. | `realizationSurface.test.ts`, `realizedScheduleIdentity.test.ts`, constructive UI tests |
| E7 | `ui/ScheduledGoalFacts.tsx` named Goal/role/time list mounted by Month and Schedule Review; `ui/plannerReviewPresentation.ts:65` groups realized facts with generic labels; `PlanningReviewPanel.tsx` consumes planning review. | `plannerReviewPresentation.test.ts`, `PlanningReviewPanel.test.tsx`, constructive UI tests |
| E8 | `core/engine/generateSchedulePreview.ts:90` work/candidate expansion, replay (~128), placement (~137), realized occupancy (~157), friction (~168); `core/blocks/generateBlockCandidates.ts:35`; `placeBlockCandidates.ts` actual Work lookup (~300), windows (448–555), opening search (563–620), occupied Work (743–764). Store generation → Preview/Month. | `generateSchedulePreview.test.ts`, `workRelativeFootprint.test.ts`, candidate/placement tests |
| E9 | `placeBlockCandidates.ts` ordering (~18, 785), Sleep deferral/propagation (~224, 821–859); `state/createInitialDayFrameState.ts` empty initial templates/legacy Sleep normalization; `detectScheduleFriction.ts:183` Sleep guidance. | Sleep cases in `generateSchedulePreview.test.ts:1219,1276,1359,1436,1549,1626,1729` |
| E10 | `core/time/canonicalUserDay.ts:56` windows, `:82` ownership; `cycles/resolveEffectiveSchedulePreferences.ts:6`; `getActiveShiftSegment.ts:19`; `generateCycleWorkBlocks.ts` both modes and user-day assignment; `calendar/types.ts::ManualCalendarEvent`, `state/manualCalendarEvents.ts`. | canonical user-day, user-week, cycle, Work and manual-event tests |
| E11 | `ui/PreviewScreen.tsx` Try/Accept → store revision/acceptance → `core/friction/applySuggestedFix.ts::findFirstAvailableGapStart:461`; `core/decisions/createPlanDecisionAcceptanceCandidate.ts:59`; `replayPlanDecisions.ts:39,124,161`; `core/engine/reviseSchedulePreview.ts:29,77`; `state/planDecisionSurface.ts`. | fix/revise/replay/acceptance tests, `planDecisionSurface.test.ts`, `PreviewScreen.test.tsx` |
| E12 | `ui/ScheduleReviewPanel.tsx` query/readiness/publish and `publicationFailureMessage` (~372); `scheduleReviewReadiness.ts:49`; `state/planningScopeQuery.ts:172` unavailable → unknown publication coverage; `plannerReviewPresentation.ts:175`. | readiness, Schedule Review, planning scope and presentation tests |
| E13 | `state/schedulePublication.ts::publishScheduleRangeV1:37` → `core/historicalPlan/materializePlanPublication.ts:36` → batch validation → historical surface; snapshots realized roles (~155) and Goal-linked sources (~222). | `schedulePublication.test.ts`, `materializePlanPublication.test.ts`, `historicalPlan.test.ts` |
| E14 | `state/historicalPlanSurface.ts` initialize (~146), publish (~184), `persistBatch:266`, day/range reads (~316), candidate reads (~370), `readPhysicalBatch:431`, export/recheck/abandon (~489–549), protect (~587); store exports at `dayFrameStore.ts:3270`. | `historicalPlanSurface.test.ts:189,217,237,272,296,364,374,389,402` |
| E15 | `state/todayQuery.ts:51` canonical current day → historical day → `core/today/buildTodayReadModel.ts`; `ui/TodaySurface.tsx:84` protected state and reporting (~340); `core/execution/historicalPlanExecutionTarget.ts:22` rejects buffer activity targets. | Today query/read-model/UI tests, execution target/reporting tests |
| E16 | `state/executionHistorySurface.ts` record/correct/retract → durable records; `goalProgressQuery.ts:17` Goal + measurement + observation only; `progressObservationSurface.ts`; `ui/GoalSection.tsx:437` reporting; `GoalActivitySummary.tsx:189` Progress. `HistoricalPlanReportingSection.tsx` and `ExecutionSummarySection.tsx` lack production mounts. | execution history/IndexedDB/reporting tests, Progress query/observation/UI tests, unmounted component tests |
| E17 | `ui/PlannerSurface.tsx`, `MonthlyPlannerSurface.tsx` → `state/monthlyPlannerQuery.ts` → canonical Month model; selected-day contextual actions; `PlanningReviewPanel` mount (~335), `ScheduledGoalFacts` (~648); `DayFrameApp` top-level destinations and conflict jump (~2723). | Monthly Planner, ProductSurfaces, DayFrameApp, planning review tests |
| E18 | `ui/SetupScreen.tsx` Work modes (~847), range and advanced Commitment fields; `CommitmentSection.tsx` bounded editor; `DayFrameApp` setup/context mounts; `core/cycles/types.ts` modes and segment preferences. | SetupLifecycle, CommitmentSection, cycle generation tests |
| E19 | `ui/HistoricalIntelligenceSummary.tsx`, `GoalActivitySummary.tsx`, `ExecutionHistoryPanel.tsx` → `state/historicalIntelligenceQuery.ts` → completion/realization/Goal activity projections; Summary Planner link lacks historical-day selection payload. | historical intelligence, Goal activity, execution history UI tests |
| E20 | `core/goals/goal.ts:8` manual-event link; `ui/GoalSection.tsx:516` event options; `planningFoundation.ts:35,291` Found Time provenance discriminator; no corresponding production creator/query/UI found. Static holiday helper exists under `core/calendar/getStaticHolidays.ts`; Preview consumes holiday facts. | Goal, manual-event and static-holiday tests; no complete Found Time workflow tests found |
| E21 | `infrastructure/storage/dayFrameDurableDb.ts:8` separate authority stores; `indexedDbCollectionStorage.ts::mutate` transaction; `dayFrameStore.ts:258` active/profile keys and active-v2 persistence; `planDecisionSurface.ts:26` separate decision key; restore/runtime authority composition. | authority transaction, readiness, durability, restore, backup V3–V12, active-v2, profile, source-incarnation tests |

Probe references (temporary, not durable repository artifacts): **P1** `/tmp/dayframe-98c-probe.mjs` and `.log`; **P2** `/tmp/dayframe-98c-provenance.mjs` and `.log`; **P3** `/tmp/dayframe-98c-sleep-fix.mjs` and `.log`. Reproduction inputs and results are recorded in this RESULT so conclusions do not depend on retaining `/tmp`.

Classification key: **A** Implemented + Reachable; **B** Implemented + Disconnected; **C** Implemented + UX-Inaccessible; **D** Partially Implemented; **E** Not Implemented / Not Found; **F** Exposed but Incorrect; **G** Legacy / Transitional. A reachable happy path is not a claim that every error path works.

## 3. End-to-End Lifecycle Reachability

**Confirmed.** Planner's Goals entry opens the existing Goal and planning surfaces. A Goal is authored independently of scheduling. Goal Structure can affect structural eligibility but cannot be authored through the ordinary production interface. A finite Demand revision supplies effort, horizon, session/satisfaction constraints, and a footprint; Priority supplies explicit ranking preferences. Evaluation consumes current authority and derived Capacity, projects Demand, evaluates Feasibility, constructs competing sets and provisional Allocations, and records eligible Proposals. [E1–E5]

**Confirmed.** Goal planning results direct the user to Review schedule and proposals; ScheduleReviewPanel shows multiple Proposals and provides acceptance/rejection and realization retry controls. Acceptance revalidates freshness and conflicting claims, records a Proposal Decision and distinct Accepted Allocation, and can proceed to Realization. Realization validates against current scheduled ownership and writes stable facts. Productive Goal work, support activity, and buffer protection retain different roles. Preview and review queries consume those facts; they do not become authoritative by being displayed. [E5–E7]

**Confirmed.** Authored Work, Commitments and manual Events form a parallel direct-input route. Generation expands occurrences, replays accepted corrective decisions, places candidates against Work and realized authority, detects incompatibility, and produces Suggested Fixes. The old Preview provides Try/Accept interactions; not every fix has a durable mapping. Review then checks a bounded scope and exposes explicit publication. [E8–E13]

**Confirmed.** Successful publication creates immutable bounded day snapshots. Today selects the published current canonical day, then reports execution against published targets. Execution history and measured Progress are distinct durable evidence. Summary aggregates historical plan/execution evidence and Goal Progress separately. There is no automatic execution → measured Progress conversion. [E13–E16, E19]

**Confirmed / Not Found.** The complete ordinary-user chain stops at protected history in the reported session. Independent happy paths are wired and tested, but a usable HistoricalPlan recovery connection was not found. Historical target selection/reporting is implemented below the shell, while a complete Found Time workflow was not found. Learned/preference terminology does not establish an automatic feedback loop; no automatic promotion of these observations into authored preferences is claimed. [E14–E16, E20]

## 4. Lifecycle Reachability Matrix

Tests reference the evidence index, which names their files. Derived stages are user-reachable through evaluation even when they have no standalone editor.

| Stage / Capability | Domain Implementation | Production Command / Query | Persistence / Authority | Production UI Entry | Ordinary-User Reachable? | Tests | Classification | Evidence | Gap |
|---|---|---|---|---|---|---|---|---|---|
| Goal | GoalV1 | create/update Goal | `goals`; authored | Planner → Goals | Yes | E1 | A | Confirmed E1 | Discoverability still fragmented |
| Goal Structure | Relationships, containment/dependencies, eligibility | createRelationship; getStructuralEligibility | `goalStructure`; authored revisions | None found | No authoring path | E2 | B | Confirmed E2 | Mount relationship authoring/inspection |
| Demand | Finite effort/horizon/session intent | create/revise Demand | `goalPlanning`; authored revisions | Goals → planning intent | Yes | E3 | A | Confirmed E3 | Recurring lifecycle absent |
| Priority | Default/scoped Goal priority | priority authoring; applicablePriorityForGoal | `goalPlanning`; authored | Planning intent priority | Yes; default exposed | E3 | A | Confirmed E3 | Scoped model not fully exposed |
| Capacity | Demand-neutral bounded capacity | queryCapacity via competing evaluation | Derived/disposable | Planning result usable/qualified-time summary | Yes, bounded summary | E4 | A | Confirmed E3–E4 | Detailed standalone inspection absent |
| Feasibility | Session/footprint possibilities | evaluateCompetingAllocation | Derived/disposable | Evaluate planning request | Yes indirectly | E4 | A | Confirmed E4 | Bounded search policies need intelligible explanation |
| Competition | Competing demand sets | evaluation canonical competition stage | Derived; no time ownership | Same evaluation | Yes indirectly | E4 | A | Confirmed E4 | No dedicated competing-choice inspection |
| Allocation | Provisional option selection | canonical allocate stage | Derived; no schedule ownership | Proposal result | Yes indirectly | E4–E5 | A | Confirmed E4 | Preserve provisional language |
| Proposal | Ordinary constructive Proposal | deriveProposal; recordProposal | `proposalAuthority`; non-scheduled suggestion | Goal planning results → Schedule Review | Yes | E5 | A | Confirmed E5 | Long output; iteration investigation weak |
| Proposal Decision | Explicit decision + provenance | accept/reject; additional domain lifecycle commands | `proposalAuthority`; decision evidence | Proposal actions | Yes | E5 | A | Confirmed E5 | Failure reasons can be terse |
| Accepted Allocation | Bounded accepted claims | acceptProposal; resolve accepted | `proposalAuthority`; accepted authority | Acceptance result | Yes | E5–E6 | A | Confirmed E5 | Cancellation/replacement connection not found |
| Realization | Accepted claims to owned schedule | realizeAcceptedAllocation | `realizationAuthority`; durable facts | Schedule Review acceptance/realization retry | Yes | E6 | A | Confirmed E6; P2 | No ordinary retirement command found |
| Scheduled Goal Work | Productive realized fact | listScheduledGoalWork; planning query | `realizationAuthority`; fixed ownership | Month/Review Goal facts | Yes | E6–E7 | A | Confirmed E6–E7 | Generic cards hide title/iteration; revision loss secondary F |
| Support Activity | Footprint component/realized role | footprint authoring; realization | Goal-planning spec then realized fact | Planning support controls; schedule facts | Yes, bounded forms | E3,E6 | A | Confirmed E3,E6 | Not every canonical footprint authored by current form |
| Protected Buffer | Non-activity resource protection | footprint authoring; realization | Separate realized role | Planning buffer controls/facts | Yes | E3,E6,E15 | A | Confirmed E3,E6 | Must not gain completion control |
| Review | Scope coverage/classes/readiness | queryPlanningReview; queryPlanningScope | Derived read models | Planner Review + selected day | Yes | E12,E17 | G | Confirmed E12,E17 | Overlap; readiness defect secondary F |
| Friction | Actual geometry incompatibility | detectScheduleFriction | Derived Preview | Review/Preview | Yes | E8,E11 | A | Confirmed E8,E11 | Range-wide resolution laborious |
| Suggested Fix | Corrective alternatives | applySuggestedFixToPreview | Disposable Try | Legacy date tower | Yes, limited actions | E11 | F | Confirmed E11; P3 | Gap search and missing realized occupancy |
| Accepted Friction Decision | Place/omit/duration/priority decision | acceptance mapping; acceptPlanDecision; replay | Separate durable decision log | Try → Accept | Some; unplaced move fails | E11 | D | Confirmed E11; P3 | ID mapping; unsupported action families; Summary disconnect |
| Publication | Explicit validated bounded snapshot | publishScheduleRangeV1 | Atomic historical batch/day transaction | Review → Publish | Happy path yes; protected path blocked | E12–E14 | F | Confirmed E12–E14; P1 | Readiness omits protection; uncertain-commit failure copy |
| Published Plan | Immutable versioned snapshots | getHistoricalPlanDay/Range | Historical batch/day stores | Today/Summary consumers | Yes when readable | E13–E15 | A | Confirmed E13–E15 | Recovery secondary B/D |
| Today | Published canonical current day | queryToday | Derived from immutable truth | Top-level Today | Yes unless missing/protected | E15 | A | Confirmed E15 | No historical selection; protected recovery dead end |
| Execution | Report/correct/retract | execution history commands | Append-only execution records | Today outcome controls | Current published day yes | E16 | A | Confirmed E15–E16 | Historical/general reporting disconnected |
| Progress | Manual quantity observations/projection | record progress; queryGoalProgress | Measurement + observation authority | Goal progress reporting/Summary | Yes independently | E16 | A | Confirmed E16 | Execution bridge absent; must define policy |
| Found Time | Provenance discriminator only | Complete workflow not found | No complete authority found | None found | No | None found | E | Not Found E20 | Define missing capture/association semantics |
| Summary | Completion, realization, Goal activity/Progress | historical intelligence queries | Derived from history/observations | Summary | Yes when history readable | E19 | A | Confirmed E19 | Evidence lists and no selected-day handoff |
| History | Published plans, execution, observations, decisions | Separate history queries | Multiple distinct semantic stores | Summary/Today/accepted-change list | Partly | E11,E14,E16,E19 | D | Confirmed cited refs | Unified inspection/recovery/reporting connections |

## 5. Goal / Constructive Planning Findings

**Confirmed — orchestration uses canonical engines.** `evaluatePlanningRequest` supplies a single evaluation cutoff and selected finite horizon, invokes competing allocation, selects relevant competing sets, derives Proposals, and records only proposed outcomes. It does not invent an Allocation when no eligible set exists. An empty outcome list retains the canonical evaluation/feasibility result; it is not itself a persisted `NoProposalV1`. Competition considers eligible active demands for the requested matching horizon. This is not proof of arbitrary cross-horizon optimization. [E3–E5]

**Confirmed — identity survives all three authority transitions.** `recordProposal` deduplicates matching Proposal identity/revision, not all work for one Goal. Acceptance stores a decisive snapshot and origin references, checks freshness/claims, and creates a distinct accepted identity. Realized facts retain accepted allocation, Proposal/decision lineage and component roles. Multiple compatible accepted iterations can coexist intentionally. Conflicting claims are rejected; accepting one result can stale other overlapping offers. A Goal-level duration total can therefore legitimately be 10h + 20h = 30h without erasing origins. The exact Network+ records were not inspected. [E5–E7; P2]

**Confirmed — authored dates do not silently revoke realized authority.** P2 created a 60-minute Demand, evaluated/accepted/realized it, revised to 120 minutes and repeated the chain, then revised its horizon from May 6 to May 8–9, 2030. Both prior realized facts were byte-equivalent after the edit and both remained in regenerated old-range Preview. No ordinary cancellation/retirement/reschedule command was found in the realization surface. Automatically deleting accepted ownership on a Demand edit would require explicit authority semantics; it is not an established current capability. **Inferred:** the reported disappearance may involve changed visible range, a different build, or the successful-revision omission in E11. Those alternatives are not diagnoses of the incident.

| Authoring capability | Current finding | Classification / evidence |
|---|---|---|
| Total effort | Minutes in domain; hours/minutes UI | A, Confirmed E3 |
| Session duration | Indivisible exact duration or splittable shape | A, Confirmed E3 |
| Minimum / preferred / maximum duration | Represented; split-session controls expose minimum/maximum | A with partial exposure, Confirmed E3 |
| Required minimum versus target | Satisfaction policy represents minimum and target | A, Confirmed E3 |
| Allow less than requested | Partial satisfaction authored explicitly | A, Confirmed E3 |
| Session-count requirements | `sessionCount` cadence and count control exist | A, Confirmed E3 |
| “N sessions of X” convenient authoring | Count plus fixed/min=max duration can express bounded intent; no single convenience interaction found | C convenience gap, Confirmed model / Not Found combined form |
| Planning Priority | Default and scoped domain priority; default form exposed | A, scoped exposure limited, E3 |
| Support activity / protected time | Separate footprint components; bounded support/buffer form | A, E3,E6 |
| Resource footprint | Canonical specification, resource assignments, capacity checks | A underlying / D full authoring exposure, E3–E6 |
| Ongoing Goal | Goal can have no target date | A, E1; not recurring Demand |
| Recurring Goal Demand | Finite total/session-count horizon; no rolling recurrence lifecycle found | E, Not Found E3; design new behavior |

**Confirmed — Capacity already has a product summary.** `GoalPlanningSection::PlanningResult` (~632–660) displays known usable time, qualified time, freshness/integrity/coverage warnings and unresolved-liability context. A detailed capacity explorer is absent; it is inaccurate to call current Capacity wholly invisible. [E3–E4]

**Confirmed — several complaints are presentation problems.** `ScheduledGoalFacts` resolves Goal names, but `plannerReviewPresentation` uses generic “Scheduled Goal work” in some cards. Domain IDs survive but an ordinary accepted-iteration inspector does not exist. Lists expand/map many facts without a compact iteration history. `DurationInput` immediately coerces field text through `Number`, including an empty string to zero; this creates the familiar controlled-input editing problem. The specific leading-zero rendering was not browser-reproduced here. The hours field permits very large requests (up to 10,000); domain validation and bounded feasibility, not the input's apparent generosity, determine whether a request is valid/possible. Large requests and long output are not evidence of silent authority corruption. [E3,E7]

**Confirmed — unresolved Proposals are warnings, not publication blockers.** Readiness treats pending Proposals as non-blocking; unresolved accepted-allocation liabilities are blocking. This preserves the distinction between suggestions and accepted obligations. [E12]

## 6. Commitment Placement Findings

**Confirmed trace:** authored template + recurrence → `generateBlockCandidates` canonical user-day occurrence → generated cycle Work associated with canonical user-day → `placeBlockCandidates` Work lookup → placement window → full-footprint opening search → scheduled/unplaced → Friction. In the production generator, Work and realized facts are occupancy constraints. Low-level tests omitting the visible-window argument do not exactly exercise the production Work-occupancy branch and cannot establish product behavior on their own. [E8]

**Confirmed — beforeWork currently references actual Work start.** It finds the first Work block for the candidate's canonical user-day, searches backward within its work-relative window, and includes buffers in the desired placement. P1 used October 1–6, 2026, a 60-minute daily Workout with 30-minute before/after buffers, Monday–Friday Work, and each of 09:00–17:00, 14:00–22:00, 21:45–06:15 at boundaries 00:00 and 12:00. All six combinations placed five visible occurrences with zero Friction and no Work body overlap. On no-Work days, non-Sleep beforeWork falls back to available placement; it has no Work anchor to precede. Noon ownership can also associate a morning Work interval with the prior DayFrame day. These semantics can confuse labels, but do not reproduce inside-Work placement. **Not Found:** the exact erroneous temporal reference in the reported beforeWork incident. [E8,E10; P1]

**Confirmed — afterWork has a separate overnight path and a pre-existing correction.** The current window uses the relevant last Work end and extends for before-buffer + duration + after-buffer, bounded by visible planning coverage. The pre-existing 9.8B working-tree change includes the before-buffer in this calculation; the older 9.8A finding concerned its omission. Current `workRelativeFootprint.test.ts` covers buffered Night Shift afterWork and clipped-range refusal. This audit did not make that change. A clipped end or other occupancy can still produce legitimate unplaced results. **Inferred:** an older build could explain the reported approximately 18 Night Shift failures; build identity and exact inputs are needed. [E8]

**Confirmed — Any Available is bounded evidence.** It searches openings against occupied geometry; the dogfood success and current tests establish fitting cases, not universal feasibility or global optimality. Work is classified locked, flexible Workout remains flexible, and Friction detects actual incompatibility. Correct detection does not excuse an incorrect corrective move. [E8,E11]

## 7. Sleep First-Class Scheduling Findings

**Confirmed — current identity and priority.** Sleep is a Commitment template category with durable occurrence identity, configurable duration/buffers and numeric priority. Fresh initial setup contains no seeded templates; legacy `default_sleep` normalization is not evidence that every new user receives Sleep. Placement has explicit daily-beforeWork Sleep behavior: defer off-day Sleep, then propagate a nearby previous/future work-anchored Sleep offset. It also has Sleep-specific Friction wording. Thus Sleep has special semantics, but no separate required-Sleep authority or guaranteed reservation policy. [E9]

**Confirmed — interaction with other ownership.** Work and realized Goal work/support/buffer facts constrain ordinary Sleep placement. Explicit accepted placement decisions run first. Other candidates are ordered by user-day before priority; deferred off-day Sleep is processed after ordinary candidates. Numeric priority alone cannot guarantee that lower-priority activity on an adjacent owner day or earlier placement cannot consume required Sleep's physical interval. Realized facts have accepted authority and prohibited autonomous movement; the new Sleep requirement must distinguish those explicit decisions from disposable flexible candidates. [E6,E8–E9]

**Confirmed — exact boundary failure in one placement branch.** P1's custom Sleep fixture used 8h Sleep, 30m buffers on each side, a custom 22:00–08:00 window, Work 09:00–17:00 and October 1–6, 2026. Boundary 12:00 produced five 22:30–06:30 occurrences and no Friction. Boundary 00:00 produced zero placed, five unplaced, five Friction points. `placeBlockCandidates` custom-window branch (~523–555) extends an overnight custom end, then clips that end to the owner's placement boundary. Only 22:00–24:00 remains at midnight, so the nine-hour footprint cannot fit. This is placement-window clipping, not recurrence expansion. **Inferred:** it can explain the reported noon-to-midnight symptom if that configuration used this branch; the original 11 occurrences/settings are unavailable.

**Confirmed — no universal midnight prohibition.** With beforeWork Sleep, Work 07:00–15:00, 8h Sleep and the same buffers at a 00:00 boundary, production generation placed September 30 22:30 → October 1 06:30 continuously, owned by October 1. BeforeWork can cross both midnight and the owner's start boundary. Work 09:00 and a simple Day→Evening October 2 transition also generated without Friction in reconstructed cases. Six visible occurrences in a boundary-spanning case can include neighboring-owner spill; counting visible intervals alone does not prove duplicate recurrence. [E8–E10; P1]

**Confirmed — architectural work required for the newly stated requirement.** A first-class required-Sleep policy needs explicit requiredness/minimum/exception semantics, physical cross-owner occupancy, placement ordering/reservation relative to lower-authority candidates, and explicit handling when immovable Work or accepted user choices make Sleep impossible. Existing category, occurrence identity, duration, buffers, replay, occupancy and Friction machinery are reusable. It is not enough to change a seed priority or rename a template. **Inferred recommendation:** settle those semantics before migrating their controls; this audit neither designs nor implements a new Sleep subsystem.

**Unresolved incident trace.** Cycle segment → effective preferences → canonical boundary → Work ownership → Sleep candidate → window/occupancy → Friction → Try → acceptance mapping → durable decision → replay is traced in E8–E11. The exact October 2 and October 16, 2026 transition failure cannot be localized to one stage without segment settings, Sleep specification, action identity and decision/replay evidence. P3 establishes a plausible acceptance failure for an unplaced move, not proof of the reported accepted decision disappearing.

## 8. Day Boundary / User-Day Findings

**Confirmed — canonical identity is independent of midnight.** `canonicalUserDay` resolves the containing user-day and constructs its window from that day's effective boundary to the next day's effective boundary; changing segment preferences can yield a window other than 24h. Effective week start comes from the active manual segment override or global preferences. Noon correctly assigns early civil-date time to the prior DayFrame day. Display grouping must preserve owner identity while rendering overlapping physical intervals. [E10]

| Object/path | Ownership versus physical crossing | Assessment |
|---|---|---|
| Work | Physical shift can cross midnight/boundary; cycle generation assigns canonical owner | Confirmed preserved, E10 |
| Commitment recurrence | Expands candidates by user-day; duration is not clipped during candidate generation | Confirmed, E8 |
| Fixed / beforeWork intervals | Can extend outside owner-day window, subject to branch/authority validation | Confirmed; do not impose blanket boundary prohibition, E8 |
| Custom-window Sleep | End clipped to owner placement window | Confirmed defect against new crossing requirement, P1 |
| Corrective gap search | Restricts full footprint to one user-day; occupied list filters same owner | Confirmed limitation; cross-owner overlap risk inferred, E11 |
| Manual Event | Authored start/end interval and explicit overnight representation; normalized independently of Preview | Confirmed physical interval distinct from grouping, E10,E20 |
| Realized Goal work | Accepted fixed intervals; footprint authoring/evaluation constrains components to a user-day | Confirmed V1 policy, E3,E6 |
| Support / buffer footprint | `componentCrossesUserDay` validation rejects component end beyond start-owner end (`demandResourceFootprint.ts:347`) | Confirmed explicit policy, not accidental Sleep recurrence behavior |
| Review / publication | Bounded user-day scope and stored day preferences; visible overlap is not new ownership | Confirmed, E12–E15 |

**Confirmed / Inferred.** The system does not globally conflate ownership and containment, but individual placement/footprint policies do. The new broad crossing requirement conflicts with custom Sleep clipping and requires a product decision about finite Goal footprint restrictions. Do not remove canonical ownership or silently broaden accepted footprint authority to repair Sleep.

## 9. Friction / Resolution Findings

**Confirmed — navigation now reaches the legacy workflow.** `DayFrameApp`'s Resolve action selects Review and targets `schedule-friction-heading`, which currently exists in `PreviewScreen`. The earlier 9.8A absent-target defect has been corrected by pre-existing work. It remains a jump into the date tower, not a centralized range-wide resolution workspace. [E11,E17]

| Suggested action | Try behavior | Durable acceptance / regeneration |
|---|---|---|
| Move | Attempts new opening | Maps to `placeOccurrence` for supported scheduled targets; unplaced candidate mapping defect below |
| Skip | Removes/skips occurrence | Maps to `omitOccurrence`, including supported unplaced template targets |
| Reduce duration | Revises duration | Maps to `setOccurrenceDuration` for eligible scheduled template |
| Change priority | Revises priority | Maps to `setOccurrencePriority` when changed |
| Change fixed time | Routes to authored setup context | Authored edit rather than generic accepted-fix mapping |
| Accept conflict | Marks Preview Friction ignored | No supported durable PlanDecision mapping found |
| Convert to recovery | Preview transformation | No supported durable PlanDecision mapping found |
| Add resource | Suggested action is not implemented by executor; executor throws | Not a complete executable resolution |

All rows **Confirmed**, E11. Unsupported actions must not be represented as equivalent to durable acceptance.

**Confirmed defect F1 — gap cursor can cross Work.** `findFirstAvailableGapStart` sees an occupied interval after the cursor, finds the gap too small, but advances the cursor only when occupied start is already at/before the cursor. It can consequently return the initial cursor after the loop, overlooking the intervening interval. P3: May 6, 2030; boundary 03:00; Work 07:00–15:00; unplaced 8h Sleep with 30m buffers; Try Move produces 03:30–11:30 Sleep overlapping Work. Detection can flag the overlap afterward; the suggested correction itself is invalid. The search also excludes other-owner occupied intervals and has no realized-fact input. [E11; P3]

**Confirmed defect F2 — unplaced move cannot be accepted.** The fix targets a candidate ID; scheduling creates a scheduled-block ID. `createPlanDecisionAcceptanceCandidate` searches the revised scheduled list using the original target ID and returns `{status:'unavailable', reason:'tryNotApplied'}`. P3 reproduced this through the actual store revision and canonical acceptance mapper. No durable decision was created, so regeneration cannot retain that Try. This explains one class of “fix will not persist” without alleging loss of a successfully persisted decision. [E11; P3]

**Confirmed defect F3 — successful revision drops realized facts from Preview.** `reviseSchedulePreview`'s `didRevise:true` object (~77–108) omits `realizedScheduleFacts`; its no-change clone preserves them (~146). The corrective executor also receives only Work, scheduled template blocks and unplaced candidates. Realization authority itself is not deleted. Fresh generation repopulates those facts, and publication rejects a Try-revised Preview. This is a presentation/occupancy coherence defect, not evidence of historical mutation. [E8,E11,E13]

**Confirmed — accepted decisions otherwise have durable identity.** Supported acceptance creates a source-incarnation/occurrence-bound record in `dayframe-plan-decisions-v1`; regeneration replays it, diagnoses stale/missing sources, and finalizes blocked placements rather than silently claiming success. Acceptance means a saved instruction, not a guarantee that every later authored configuration can honor it. The place replay uses global boundary to construct its local-time instant while the generator can resolve segment-specific windows; this is a context mismatch to cover with transition tests. **Inferred:** it may affect a segment-boundary fix; the original incident remains unproven. [E10–E11]

**Confirmed / Not Found.** Accepted changes have their own list. Their effects and omissions enter published plan snapshots, but Summary does not consume a complete decision-history query. A bulk explicit command/transaction was not found. Existing per-occurrence commands can supply semantics for a later bulk interaction only if selection, consent, per-result failures and source freshness remain explicit; looping them would not itself provide atomic bulk behavior.

## 10. Publication / Historical Authority Findings

**Confirmed exact logical reconciliation:**

1. `queryPlanningScope` reads historical coverage. Any non-available history result is represented as `publicationCoverage: unknown`; protection reasons are not carried into that coverage label.
2. `deriveScheduleReviewReadiness` checks range validity, complete planning coverage, fresh/covering Preview, Friction, accepted liabilities and source state. It does not check historical ingress/protection or make unknown publication coverage a blocker. Pending Proposals are warnings.
3. The display can therefore simultaneously say “Ready to publish” and “Publication coverage is unavailable.” P1 reproduced those booleans with no blockers.
4. `publishScheduleRangeV1` rechecks planning preconditions and materializes. A Try-revised Preview is rejected by the materializer, another condition readiness does not explicitly model.
5. `publishAtomically` refuses protected historical authority or encounters persistence/verification failure. The application maps non-success to `persistenceFailure`; the panel's generic fallback erases the specific distinction.
6. Today and Summary consume historical authority, not current generated schedule, so protection blocks both while Planner generation can remain usable. [E12–E15,E19]

**Confirmed historical validation boundaries.** Initialization validates stored metadata and schema accessibility. Day/range reads reconstruct batches, validate supported versions, day payloads, relationships and physical fingerprints, and detect orphan records. A corrupt latest record does not fall back to older truth. Protection can represent malformed/incompatible/inconsistent records, but also a failed read during validation. `physicalMismatch` is therefore not conclusive proof of corrupt persisted data. “Stale current Preview” is a separate condition and does not by itself mean historical records are corrupt. [E14]

**Confirmed isolated uncertain-commit mechanism (P1).** A fresh in-memory DB received one valid publication batch containing one empty but valid day. A wrapper allowed `mutate` to commit, then failed indexed reads during verification. `publishAtomically` returned `materializationUnavailable`; surface status became `protected/physicalMismatch`; physical counts were one batch and one day; protected day read returned `unavailableProtected`. A new independent surface reading the same underlying DB without the injected read fault returned the complete valid durable day. No partial batch was observed. This is a reproducible post-commit uncertainty/protection defect and demonstrates why “failed without changing history” is unsafe copy. It does not prove that the user's incident took this path.

| Required historical question | Finding |
|---|---|
| What preconditions were satisfied? | Confirmed: current readiness's planning/Preview checks can pass independently of history availability. Original individual inputs unavailable. |
| Why Ready then fail? | Confirmed: readiness/command use different preconditions, historical status is omitted, and failure causes collapse. |
| What does unavailable coverage mean? | Confirmed: unknown, not empty/not-yet-published; non-available read reasons lose specificity. |
| Which actual authority failed? | Not established: no original batch/day/metadata/export or error reason available. |
| Malformed, stale, incompatible, incomplete or unreachable? | All relevant validators traced; P1 proves unreachable verification can resemble mismatch. Incident classification unresolved. |
| Is recovery implemented/callable? | Partially: retry pending, raw protected-source export, source recheck and destructive abandonment commands exist. No safe reconstruction/revalidation workflow found. |
| Is recovery product-reachable/intentionally manual? | No production HistoricalPlan recovery controls found. Explicit destructive command is deliberate; absence of UI is not evidence of an intentionally sufficient manual process. |
| Can the app explain the condition? | It has typed internal states but currently loses or exposes them poorly. Copy lacks an actionable safe route. |
| Does protection prevent overwrite? | Confirmed protected publish guard and no corrupt-latest fallback. |
| Safe route back to Today? | Not found for the protected incident. A new healthy reader succeeds in P1, but that is not an exposed verified recovery command or a recommendation to manipulate the original profile. |
| Atomic on failure? | Confirmed transactional batch/day mutation; failure after complete commit remains possible. No blanket no-change guarantee. |
| Was existing incident history preserved? | Not established from incident evidence. Code is protective; no original state was altered by this audit. |
| Is generated schedule independent? | Confirmed; Today will not silently treat generation as published truth. |

**Confirmed additional recovery inconsistency.** Some direct `setStatus(protected)` paths, including post-commit mismatch, do not capture `protectedEvidence` through the `protect()` helper. `recheckProtectedSource` can consequently return `noProtectedSource`; abandonment then returns `sourceChanged`. This is not a safe repair path for that state. No abandonment, clear, restore or recheck against original state was attempted. [E14]

## 11. Today / Execution / Progress Findings

**Confirmed — Today is a published-truth consumer.** It resolves the current canonical day, reads the historical day at its cutoff, then combines published targets with execution. Missing publication yields an explicit unavailable state; protected publication yields `historicalPlanProtected`. It does not fall back to Preview. Goal work and real support activities can be published/reportable subjects; protected buffers are excluded from execution targets. Commitment and Work outcomes use the same evidence discipline. [E13,E15–E16]

**Confirmed — execution exists below the blocked session.** Normal Today exposes report/change/remove controls. Recording, correction and retraction append durable execution evidence rather than editing published planned intervals. Rehydration and corrected/retracted effective outcomes are tested. The reported protection prevented access to that ordinary interaction, not proof that execution persistence is absent. [E16]

**Confirmed — Progress is independent.** Goal Progress queries use Goal, measurement definition and progress observations; they do not consume execution duration. Current manual quantity reporting treats the reported value as a cumulative measured value, not automatic session increments. A known one-hour execution can inform a human report, but there is no production policy converting it into one hour of Goal Progress. Adding such a bridge would require explicit unit/measurement and correction semantics, not merely mounting an existing auto-credit command. [E16]

**Confirmed — associations and historical reporting are asymmetric.** A manual Event can be associated from Goal detail; the Event editor lacks equivalent Goal selection. Publication can snapshot that Goal provenance and Today can report a published Event. Association alone neither publishes it nor credits Progress. `HistoricalPlanReportingSection` and its execution controls exist and are tested, but have no production shell mount. Editing an actual-time field is not a historical planned-target picker. Historical-day reporting's smallest missing connection is a selected published day/target → existing reporting component/commands. [E16,E20]

## 12. Found Time Findings

**Not Found — end-to-end Found Time → Goal → Progress.** Searches across production domain/state/UI for Found Time and its provenance variants found a planning-foundation provenance discriminator, but no complete creator, durable capture authority, application orchestration, query or mounted workflow. Existing manual Event authoring and Goal links are useful adjacent capabilities, not evidence of completed unscheduled-work reporting. [E20]

**Confirmed — original planned and manual identities are already distinct.** Accepted realized work retains accepted lineage; manual Events retain authored event identity; published targets and execution refer to their appropriate origins. This should be preserved when Found Time is defined. **Inferred recommendation:** reuse existing Goal, execution and observation mechanisms where semantically valid, but first decide whether Found Time is an actual occurrence/report, an opportunity to schedule, or both with different authorities. The audit cannot label a nonexistent auto-progress bridge as merely disconnected UI.

## 13. Planner / Day Worksurface Findings

**Confirmed — current responsibilities are distributed.** Month supports arbitrary date navigation, selected-day context, authored manual Events and contextual Work/Commitment actions. Generated coverage remains bounded and explicit; browsing a month does not assert every day has a computed schedule. Selected Day displays schedule evidence, Planning Review adds accepted/proposed/realized classes, and Today adds published truth and outcome reporting. Goals now have a Planner entry into the existing context, though they remain hosted alongside planning settings. [E1,E17]

**Inferred — consolidate presentation around one selected canonical day.** Preserve query-specific authority and coverage rather than forcing Today to consume Month's generated result. The reusable Day Worksurface is not currently a complete shared product component; its constituent capabilities exist. A route from historical Summary evidence must carry a day and evidence context, not just open Planner. No migration was performed.

## 14. Legacy Preview / Date-Tower Findings

**Confirmed — G, with canonical commands embedded.** `PreviewScreen` is a generated-range, long-form date review, overlapping Month/day navigation. It retains Friction details, Try/Accept, accepted-decision presentation, filters and contextual actions. It is not itself schedule authority; accepted decisions and publication are separate commands. [E11,E17]

**Inferred recommendation:** migrate those interactions into day/range review responsibilities before retiring the tower. Do not invest in a second independent calendar shell, and do not delete the tower while it remains the only complete entry for some corrective decisions. Its oversized layout is a migration issue; its gap-search and acceptance defects are correctness issues that survive relocation.

## 15. Summary / History Findings

**Confirmed — real aggregation exists.** Historical completion distribution, planned-versus-executed realization and Goal activity queries feed Summary; Goal Progress has its own measurement projection. Expansion controls expose underlying evidence, so apparently static boxes are partly a discoverability problem, not absent commands. Coverage gaps and protected history have distinct states. [E16,E19]

**Confirmed — connectivity is incomplete.** Inline evidence lists can be long. Planner navigation does not carry a selected historical day/target. Accepted corrective decisions are not integrated as a complete Summary history, although published snapshots retain the resulting plan effects and omission evidence. The separate tested `ExecutionSummarySection` is not proof of a production mount. A missing publication is not evidence that a history engine is missing; protected evidence is also not an empty history. [E11,E13,E16,E19]

**Inferred recommendations:** preserve canonical retrospective queries, add selected-day evidence navigation, consolidate duplicate lists, and expose recovery state without flattening unknown into zero. Broader recommendation/learning behavior is not established by the existence of summary projections.

## 16. Work Pattern Findings

**Confirmed — both models remain production-active.** `ShiftCycle` has `manualSegments` and `repeatingSequence` modes. `generateCycleWorkBlocks` dispatches both. The shared `type: fixedSegments` name does not make sequence data obsolete. Neither mode was found to be merely a UI adapter that fully replaces the other. Retiring sequence data because it looks older would remove supported semantics. [E10,E18]

**Confirmed — overrides are asymmetric.** Active manual segments can override day boundary and week start. Effective resolution falls back to global preferences. Different manual segments/cycles can consequently yield different effective week starts. `getActiveShiftSegment` returns null outside manual-segment mode; repeating sequence entries do not carry the same segment-specific preference overrides. Cycle transitions are dated authored context, not new history authority. [E10]

**Confirmed / Inferred.** Sequence entries encode day offsets and shift/rest selection; the current UI authors long patterns entry by entry. Manual segments already represent date ranges more efficiently for appropriate schedules, but are not a universal substitute for a repeating rotation. Bulk/rotation helpers and clearer contextual boundary/week controls are interaction evolution, not evidence that Work generation is missing. Preserve effective-preference transitions in future day/month views. [E18]

## 17. Product Language / Architecture Leakage Findings

All located usages/classifications below are **Confirmed** source observations with **Inferred** wording recommendations. Terms are not rejected merely for appearing in architecture.

| Term / current usage | Classification | Product requirement |
|---|---|---|
| Canonical Planning Review | Legacy / architecture leakage | Explain the selected day's plan and choices; retain internal query name only internally |
| Selected-day truth | Architecture leakage | Name the actual evidence class and its freshness plainly |
| HistoricalPlan recovery | Debug/recovery terminology | Say saved plan history could not be read safely and provide an actual recovery/evidence action |
| Published plan evidence | Understandable with context | Explain “saved/published plan for this day” and why current draft differs |
| Stored historical authority | Architecture leakage | Explain what history is protected without requiring authority-model knowledge |
| Realization | Architecture leakage in action/status copy | Explain whether accepted work has been added to the schedule; keep technical diagnostics inspectable |
| Generated | Understandable with context | Clarify draft schedule and last refresh, not immutable historical truth |
| Template | Legacy/internal source-family language | Show Commitment name and useful origin; avoid raw discriminator as title |
| Planning range | Valid with scope explanation | Distinguish dates being computed/reviewed from calendar navigation and publication scope |
| Allocation | Architecture leakage for most ordinary actions | Explain accepted amount/placement and whether it is scheduled |
| Proposal | Valid product language | Distinguish constructive plan suggestion from corrective Suggested Fix |
| Unplaced | Understandable with minor context | Explain which activity did not fit and the available next action |
| Friction | Valid if defined in context | Name actual conflicts/constraints; do not use for ordinary demand competition |
| Publication coverage | Architecture leakage | Explain which days have saved plans; unknown must not mean none |
| Ready to publish | Valid wording, currently overclaims | Must reflect historical availability and materializer preconditions |
| Failed without changing schedule history | Incorrect in some failure paths | Distinguish no-write failure from uncertain post-commit verification |

Evidence: E7,E11–E15,E17–E19. A protected-history error must state what happened, what is protected, and a real safe next step. Rewording alone cannot supply the missing workflow. The audit does not invent an instruction to reset history as that next step.

## 18. UI Surface Ownership Matrix

Current facts **Confirmed**; destination recommendations **Inferred**.

| Surface / Component | Current Purpose | Data / Query Source | Commands Exposed | Canonical / Transitional / Legacy / Debug | Reachability Problems | Likely Planner / Summary Disposition | Evidence |
|---|---|---|---|---|---|---|---|
| Planner | Planning shell/modes | Store + Month/review | Navigate/setup/generate/Goals | Transitional shell, canonical commands | Multiple contexts | Primary future/current shell | E1,E17 |
| Month | Temporal navigation/overview | monthlyPlannerQuery | Select date; contextual Event/Commitment/Work | Canonical calendar capability | Generated knowledge bounded | Preserve in Planner | E17 |
| Selected DayFrame Day | Selected-day inputs/evidence | Month selected-day model | Contextual edit/add | Transitional presentation | No full execution/recovery | Feed shared day surface | E17 |
| Daily Workspace | Intended combined day responsibility | Currently several queries | Currently distributed | Complete shared surface not found | Split across day/Today/review | Consolidate existing responsibilities | E15,E17 |
| Goals and Planning | Goal/intent/evaluation/actions | Goal + planning + Proposal surfaces | Author/evaluate/decide/realize/report Progress | Canonical commands, transitional host | Structure/iteration inspection absent | Planner Goals | E1–E7 |
| Review Schedule | Scope and publication readiness | planningScopeQuery | Refresh/review/resolve/publish | Canonical orchestration, flawed readiness | Protected history omitted | Planner bounded review | E12–E14 |
| Canonical Planning Review | Authority-class evidence | queryPlanningReview/presentation | Inspection of classes | Transitional | Generic labels/duplicate day facts | Integrate day review | E7,E17 |
| Legacy date-tower Preview | Generated day lists/fixes | Preview + decisions | Try/Accept/context edits | Legacy | Long navigation; unique corrective entry | Migrate interactions then retire | E11,E17 |
| Today | Current published day/outcomes | queryToday + execution | Report/correct/retract | Canonical consumer, transitional top-level route | Missing/protected history blocks; no historical selector | Temporal destination in Planner | E15–E16 |
| Summary | Retrospective aggregates | Historical intelligence + Goal Progress | Range/expand/Planner link | Canonical queries | Weak evidence-day handoff | Preserve and consolidate | E19 |
| History | Published/execution/observation/decision evidence | Separate history surfaces | Inspect/revise execution in limited contexts | Canonical evidence, fragmented presentation | Recovery/historical report disconnected | Summary with day drill-down | E11,E14,E16,E19 |
| Planning Range controls | Bounded generated coverage | Authored setup + current Preview | Set range/generate | Canonical input, transitional placement | Multiple scopes insufficiently distinguished | Planner computation controls | E12,E18 |
| Work Pattern setup | Shifts/cycles/preferences | Authored setup | Both Work mode editors | Canonical models | Long sequence editing, asymmetric overrides | Planner → My Schedule | E10,E18 |
| Commitment setup | Templates/recurrences | Authored setup | Bounded and advanced edits | Canonical input, duplicate form generations | Context editor omits advanced fields | Planner → My Schedule/context edit | E8,E18 |

## 19. Correctness Trace Matrix

“Not Found” in root-cause status means the incident's exact root was not located, even where a related current defect is confirmed.

| Scenario | Expected | Observed Dogfood Behavior | Production Path | Root Cause Status | Evidence |
|---|---|---|---|---|---|
| Workout beforeWork — Day Shift | Before actual relevant Work; otherwise unplaced | Reported inside Work | Recurrence → canonical owner → first Work start → full-footprint search | Not Found for incident; current midnight/noon fixtures do not overlap | E8,E10; P1 |
| Workout beforeWork — Evening Shift | Before Work | Reported inside Work | Same, actual 14:00 anchor in probe | Not Found for incident; current fixture succeeds | E8; P1 |
| Workout beforeWork — Night Shift | Before overnight Work start | Reported inside Work | Same, actual 21:45 start, physical overnight occupancy | Not Found for incident; current fixture succeeds | E8; P1 |
| Workout afterWork — non-Night | After Work plus before-buffer | Reported worked | Last relevant Work end → afterWork window → search | Confirmed current implementation/tested cases; no general fit guarantee | E8 |
| Workout afterWork — Night Shift | After next-civil-date Work end if full footprint fits | Reported approximately 18 unplaced failures | Overnight Work end → visible-window extension including both buffers | Confirmed earlier missing-before-buffer correction exists in current 9.8B tree; incident build equivalence Inferred | E8; workRelativeFootprint tests |
| Workout Any Available | Available non-overlapping footprint | Reported no Friction | Occupied intervals → opening search | Confirmed fitting cases only | E8 |
| Sleep crossing midnight | Continuous Sleep when physically feasible | Reported Friction after boundary change | beforeWork or custom branch must be distinguished | Confirmed beforeWork can cross; custom-window midnight clipping reproduced | E8–E10; P1 |
| Sleep crossing Day Boundary | Ownership does not itself prohibit crossing | Reported 11 Friction items at midnight | Custom end → min(owner end), or work-relative window | Confirmed custom branch defect; incident's 11-case branch Inferred | E8; P1 |
| Sleep at cycle transition | Correct effective context and continuous feasible Sleep | Reported October 2 and 16 failures | Segment → effective preference → Work owner → Sleep propagation/placement | Not Found exact incident root; simple reconstructed October 2 transition succeeds | E8–E10; P1 |
| Accepted Sleep fix regeneration | Saved supported decision replayed or explicitly blocked/stale | Reported October 2 fix did not persist; skip cleared it | Try → candidate mapping → accept → local decision log → replay | Confirmed unplaced-move acceptance failure; original successful acceptance/persistence loss unproven | E11; P3 |
| Corrective Sleep move versus Work | Never offer overlapping “opening” | Additional audit finding | Gap cursor fails to advance past future occupancy | Confirmed defect, 03:30–11:30 overlaps 07:00–15:00 | E11; P3 |
| Realized facts after corrective Try | Preserve fixed facts and occupancy | Possible relation to apparent disappearance; not established | reviseSchedulePreview successful return | Confirmed facts omitted from disposable Preview; canonical facts untouched | E6,E11 |

## 20. Missing / Disconnected Capability Matrix

| Capability | Exists? | Connected? | UI Reachable? | Correct? | Classification | Minimum Missing Link | Evidence |
|---|---|---|---|---|---|---|---|
| Finite Goal constructive workflow | Yes | Yes | Yes | Happy path verified | A | Improve discovery/output; do not rebuild engines | Confirmed E1–E7; P2 |
| Goal Structure authoring | Yes | Eligibility consumer yes; authoring no | No | Domain tested | B | Goal UI → existing relationship commands/query | Confirmed E2 |
| Accepted-iteration investigation | Identities yes | Display incomplete | Not meaningfully | Data intact | C | Show origin/accepted iteration from existing facts | Confirmed E5–E7 |
| Automatic replacement after Demand edit | No complete retirement path found | No | No | Cannot claim replacement | D | Explicit accepted-work lifecycle semantics/command | Confirmed retention; Not Found retirement, E6; P2 |
| Capacity inspection | Yes | Evaluation yes | Usable/qualified-time summary | Deterministic | A, secondary C for detailed inspection | Richer scope explanation using canonical result | Confirmed E3–E4 |
| Sleep requiredness guarantee | Special category yes, guarantee no | Partial | Template controls only | Not enforced | D | Required-Sleep authority/ordering policy | Confirmed E8–E9 |
| Cross-boundary custom Sleep | Yes | Yes | Yes | Clipping defect | F | Correct physical window/ownership separation | Confirmed E8; P1 |
| Corrective valid opening | Yes | Yes | Yes | Cursor/occupancy defects | F | Canonical physical occupancy in corrective path | Confirmed E11; P3 |
| Unplaced move acceptance | Mapper exists | Broken ID join | Try yes; Accept cannot complete | Incorrect | F | Occurrence-preserving target mapping | Confirmed E11; P3 |
| Revised Preview retains realized facts | Facts exist | Omitted on successful revision | Misleading result | Incorrect | F | Carry facts through revision and occupancy | Confirmed E6,E11 |
| Protected-history readiness | Status exists | Not consumed by readiness | Publish exposed | Incorrect | F | Readiness/command typed history preconditions | Confirmed E12–E14; P1 |
| Historical recovery | Export/recheck/abandon exist | Partial | No dedicated route | Safe reconstruction absent | D | Read-only evidence + verified recovery workflow; not reset | Confirmed/Not Found E14 |
| Historical-day outcome reporting | Component/commands yes | No mount/target selection | No complete path | Lower layers tested | B | Selected published day → existing report controls | Confirmed E16 |
| Manual Event Goal association | Yes | Goal-side yes | Asymmetric | Works | A, secondary C | Event-side contextual link control | Confirmed E1,E20 |
| Execution → measured Progress | Separate records yes; conversion no | No | Manual report only | Separation correct | D | Defined measurement conversion policy, then explicit connection | Confirmed E16 |
| Found Time → Goal → Progress | Full path not found | No | No | Unassessable | E | Missing workflow semantics/command; reuse adjacent capabilities | Not Found E20 |
| Summary → selected historical day | Evidence exists | Generic Planner link only | No precise handoff | Incomplete | B | Day/evidence context on navigation | Confirmed E19 |
| Bulk Friction decisions | Single decisions yes | Bulk no | No | No silent bulk authority warranted | D | Explicit batch interaction/outcome policy | Confirmed/Not Found E11 |
| Recurring Goal Demand | Not found | No | No | Unassessable | E | New finite-to-recurring lifecycle design | Not Found E3 |

## 21. Authority and Persistence Assessment

**Confirmed** unless noted. IDB denotes the existing durable IndexedDB stores in E21, not new schemas. “Immutable” refers to semantic evidence under ordinary commands; guarded restore/clear APIs are separate administrative operations and were not invoked. Revisioned authored objects are not disposable projections merely because older revisions remain inspectable.

| Object / semantic owner | Source of truth / persistence | Mutable, derived, disposable, immutable | Freshness / invalidation | Downstream authority |
|---|---|---|---|---|
| Goal / user | `goals` IDB | Authored, editable lifecycle; not derived/disposable | Goal revision/status | Structure, Demand references, Progress, provenance |
| Goal Structure / user | `goalStructure` IDB | Authored relationships/milestones; revisioned | Referents/revisions/eligibility | Planning eligibility, not time ownership |
| Demand / user | `goalPlanning` IDB | Authored revisioned finite intent | Revision, lifecycle, horizon | Projection/evaluation; does not revoke existing realization |
| Priority / user | `goalPlanning` IDB | Authored default/scoped preference | Revision/applicability | Allocation ranking, not geometry authority |
| Projection / evaluator | Canonical projection query memory | Derived/disposable | Current Demand/Structure/Goal/horizon | Feasibility input |
| Capacity / evaluator | Capacity query memory | Derived/demand-neutral/disposable | Source occupancy and scope | Feasibility/competition; owns no time |
| Feasibility / evaluator | Evaluation memory | Derived/disposable | Demand projection, capacity, footprint | Eligible possibilities, not acceptance |
| Allocation / evaluator | Evaluation result, later Proposal snapshot | Derived/provisional/disposable before acceptance | Inputs/fingerprints/cutoff | Proposal alternatives |
| Proposal / planning surface | `proposalAuthority` IDB | Persisted suggestion with explicit lifecycle; not scheduled authority | Freshness replay, revisions, source fingerprints | Decision candidate only |
| Proposal Decision / user | `proposalAuthority` IDB | Durable decision evidence | Decision/revision/Proposal identity | Accepted authority where applicable |
| Accepted Allocation / user decision | `proposalAuthority` IDB | Bounded accepted snapshot; not disposable | Claim conflict checks; identity retained | Input to Realization; no ownership before realization |
| Realization / realization command | `realizationAuthority` IDB | Durable realization record; idempotent accepted-ID relationship | Existing-realization lookup, schedule conflict validation | Creates schedule ownership |
| Scheduled Goal work / realized fact | `realizationAuthority` IDB | Fixed accepted intervals; no autonomous move | Stable origin/lineage; no Demand-edit deletion | Generation occupancy, publication, reporting targets |
| Support activity / realized fact | Same, separate role | Executable real activity where published; fixed accepted interval | Component lineage | Occupancy, publication/execution |
| Protected buffer / realized fact | Same, separate role | Protected interval, not activity | Component lineage | Occupancy, not execution target |
| Commitment / user | Authored active-v2 localStorage envelope | Editable template + recurrence; not derived | Source incarnation/settings changes stale Preview/decisions | Occurrence generation |
| Sleep / user | Commitment category in active setup | Same authority as template plus special placement; no independent requiredness store | Template/recurrence/preferences | Sleep candidates; no guaranteed reservation |
| Work / user and generator | Authored shifts/cycles in active setup; derived Work intervals | Definitions editable; instances derived/disposable until publication | Cycle/preferences/range | Locked occupancy, published Work snapshots |
| Manual Event / user | Active setup manual Events | Authored physical intervals/identity; editable | Source incarnation/event edits | Calendar/occupancy/publication/Goal association |
| Friction / detector | Preview memory | Derived/disposable | Geometry recomputation | Corrective suggestions, no authority by itself |
| Suggested Fix / generator | Preview Friction data | Derived/disposable | Current target/context | Try; explicit acceptance needed for durable instruction |
| Accepted revision / user | `dayframe-plan-decisions-v1` localStorage | Durable occurrence-bound decisions | Source lineage, current applicability, replay result | Regenerated placement/omission; effects snapshotted on publication |
| Preview / engine | Runtime generated/revised state | Derived/disposable; not historical authority | Authored/source fingerprint, stale flags, revisedAt | Review and validated materialization only |
| Published Plan / publish command | `historicalPlanBatches` + `historicalPlanDays` IDB | Immutable bounded snapshots; append/new batch rather than editing old truth | Validation/version/fingerprint; as-of selection | Today, execution targets, Summary |
| Execution / user report | `executionHistoryRecords` plus metadata/quarantine IDB | Durable append-only report/correction/retraction | Subject/plan reference and effective-record reduction | Execution summaries/history; not measured Progress automatically |
| Progress / user measurement | `measurementDefinitions` + `progressObservations` IDB | Definitions and durable observations; projection derived | Unit/definition/Goal/observation validity | Goal Progress and history |
| History / multiple semantic owners | Published, execution, observation, decision stores | Evidence durable; aggregate views derived/disposable | Coverage, cutoff, ingress protection | Summary; no implicit preference promotion |
| Found Time / undefined full workflow | Provenance discriminator only located | Complete persistent authority not found | Not established | No complete downstream path found |

**Confirmed assessment.** No duplicate semantic owner was established merely because current authored state, realized facts and historical snapshots coexist; they own different truth. Persisted Proposals remain non-scheduled suggestions. Accepted lineage survives realization/publication. Protected historical data is not overwritten by Preview. Current settings and immutable history can legitimately differ. [E5–E6,E13–E16,E21]

**Confirmed risks.** Readiness UI state overstates authority availability; Try Preview can omit authoritative facts; corrective occupancy ignores those facts; post-commit failures lose certainty; some protection paths omit recovery evidence capture. These are specific authority/presentation boundary failures. No original-history accidental mutation, accepted-provenance destruction, or stale-Proposal acceptance bypass was demonstrated. [E11–E14]

## 22. Behavioral / Architectural Invariants

| # | Invariant | Current assessment |
|---|---|---|
| 1 | Authored state outranks derived state | Preserved in traced generation/revision invalidation; Confirmed E3,E8,E21 |
| 2 | Derived state may be regenerated | Preserved; Confirmed E8,E21 |
| 3 | Proposal owns no schedule time | Preserved; Confirmed E5 |
| 4 | Accepted Allocation owns no time until Realization | Preserved; Confirmed E5–E6 |
| 5 | Realization creates ownership | Preserved; atomic facts and generation occupancy, Confirmed E6,E8 |
| 6 | Ordinary flexible planning does not displace Work | Initial flexible placement respects Work in traced cases; corrective gap search violates non-overlap. Work record itself is not moved. Confirmed F1, E8,E11 |
| 7 | Required Sleep cannot be defeated by lower-authority flexible planning | Newly explicit dogfood requirement; not guaranteed. Deferral/user-day ordering and lack of requiredness policy fail to enforce it. Confirmed E9 |
| 8 | Buffers protect time, not executable activities | Preserved in realized roles/target validation; Confirmed E6,E15 |
| 9 | Support activity differs from buffer | Preserved in specs, facts and publication; Confirmed E3,E6,E13 |
| 10 | Friction is incompatibility, not competition | Preserved distinct engine stages; Confirmed E4,E8,E11 |
| 11 | Suggested Fix needs explicit user decision for authority | Preserved authority distinction; several Try actions lack durable mapping. Confirmed E11 |
| 12 | Publication is explicit | Preserved UI command boundary; Confirmed E12–E13 |
| 13 | Failed publication does not partially mutate history | Batch/day transaction atomic in traced storage/tests. A complete commit can precede a failure response; stronger no-change claim violated. Incident records unknown. Confirmed E14,E21; P1 |
| 14 | Published history is immutable bounded truth | Preserved ordinary append/read behavior and protected-latest policy; Confirmed E13–E14 |
| 15 | Execution differs from Progress | Preserved, with absent automatic conversion; Confirmed E16 |
| 16 | Found Time distinguishable from scheduled Goal work | Full path not implemented/found; cannot certify end-to-end invariant. Existing manual and accepted origins distinct. Not Found/Confirmed E20,E6 |
| 17 | User-day identity independent of midnight | Preserved canonical resolver; Confirmed E10 |
| 18 | Boundary crossing does not inherently invalidate activity | Newly broadened requirement; supported in Work/beforeWork Sleep, violated by custom Sleep clipping; Goal footprint same-day constraint is explicit V1 policy. Confirmed E3,E8–E10 |
| 19 | Preview disposable | Preserved; historical consumers refuse substitution. Confirmed E8,E13–E15 |
| 20 | Stale derived state cannot become authority | Freshness replay/publication checks preserve traced boundary; readiness misreports some conditions but materializer rejects Try Preview. No stale bypass established. Confirmed E5,E12–E13 |
| 21 | Direct actions need no constructive Proposal | Preserved Goal/Work/Commitment/Event/progress authoring and corrective decisions. Confirmed E1,E8,E11,E16,E18 |
| 22 | Multiple accepted allocations explain realized origins | Preserved facts; UI inspection incomplete. Confirmed E5–E7; P2 |

## 23. Partial and Disconnected Paths

All implementation/disconnection statements **Confirmed** unless noted; “smallest connection” is an **Inferred** recommendation.

| Path that terminates early | Smallest missing connection |
|---|---|
| Goal Structure → ordinary authoring | Existing relationship/milestone commands and eligibility query → Goal editor |
| Accepted iteration → “why does this work exist?” | Existing fact origin → inspectable Proposal/Decision/Accepted Allocation details |
| Changed Demand dates → retirement of old scheduled work | Explicit accepted/realized lifecycle policy and command; not implicit deletion |
| Capacity summary → detailed inspection | Existing usable/qualified-time summary → richer canonical scope evidence |
| Resolve conflicts → efficient resolution | Existing jump works; relocate existing individual controls into day/range review |
| Unplaced Try Move → Accept | Correct target identity join in acceptance mapping |
| Successful Try → complete schedule evidence | Preserve realized facts and include their occupancy |
| Accepted Fix → Summary | Existing durable decision evidence → retrospective inspection/navigation |
| Protected plan → usable Today | Typed protection/evidence export → verified safe recovery path; none complete found |
| Historical day → outcome report | Selected published day/subject → existing reporting commands/component |
| Goal-linked manual Event → Today | Publication of the relevant day/target, then existing Today consumption |
| Goal-linked execution → Progress | Explicit measurement policy; no existing auto-conversion command found |
| Found Time → Goal/Progress | Missing complete workflow, not merely a missing button |
| Summary evidence → historical Planner day | Carry canonical day and evidence context in existing navigation |
| Selected Day → complete Day Worksurface | Compose existing Month/review/Today capabilities with their own authority queries |

## 24. Dogfood Finding Disposition

This table accounts for all 78 numbered older-PDF findings in groups, plus corrected-task additions. Earlier findings are re-evaluated against the current tree; prior audit classifications are not copied as current proof. Categories: **1 correctness**, **2 reachability**, **3 authoring/interaction**, **4 old shell/migration**, **5 product evolution**.

| Dogfood finding(s) | Category | Current disposition / evidence |
|---|---|---|
| PDF 1 beforeWork overlap | 1 | Report retained; exact current root Not Found. Six reconstructions succeed; do not relabel report as fixed. E8; P1 |
| 2 Any Available | 1 | Confirmed tested fitting behavior; not universal proof. E8 |
| 3 Night afterWork | 1 | Confirmed pre-existing buffer correction; approximately 18 reported failures require incident-build comparison. E8 |
| 4,76 Friction ownership/detection | 1 | Confirmed incompatibility detection and Work lock; preserve while correcting placement. E8,E11 |
| 5 long rotations | 3,5 | Confirmed entry-by-entry sequence UI; Inferred bulk interaction evolution. E18 |
| 6 two Work generations | 3,4 | Confirmed both canonical active modes; do not retire either domain solely from appearance. E10,E18 |
| 7,8,9 boundary/week/transition context | 3,5 | Confirmed manual-segment overrides and transition semantics; improve contextual exposure, sequence override asymmetry remains. E10,E18 |
| 10 Sleep baseline; 12 priority | 1,5 | Confirmed special category/legacy normalization, no fresh universal seed or requiredness guarantee. New Sleep requirement needs semantic convergence. E9 |
| 11 Sleep placement labels | 3,4 | Confirmed beforeSleep is boundary-relative, not an actual Sleep lookup; reconcile labels. E8,E18 |
| 13,14 duration entry/carry-borrow | 3 | Confirmed minutes-only bounded form versus advanced hours/minutes; carry/borrow is interaction design, not missing duration model. E18 |
| 15 recurrence controls | 3 | Confirmed bounded recurrence authoring/expansion; unsupported recurrence forms are not silently implemented. E8,E18 |
| 16 contextual Commitment editor | 3 | Confirmed contextual entry with limited fields; advanced setup broader. Expose existing controls coherently. E18 |
| 17,66 Goals access | 2,4 | Earlier “no Planner entry” superseded: current Planner Goals action exists. Host/discovery still transitional. E1,E17 |
| 18 decomposition | 2 | Confirmed implemented Structure, no production authoring mount. Connect E2 |
| 19 effort authoring | 3 | Earlier absence superseded by Demand form; total/session constraints now exposed, convenience and numeric editing remain. E3 |
| 20 ongoing Goals | 5 | Confirmed optional target date; ongoing Goal is distinct from recurring Demand. E1,E3 |
| 21 recurring Goals/Demand | 5 | Complete recurring Demand Not Found; design new behavior. E3 |
| 22 manual Commitment link | 2,3 | Confirmed Goal association independent of constructive planning; linking need not generate Proposal. E1 |
| 23,25 Proposal/constructive path absent or unproven | 2 | Superseded by current production mounts and real-store UI tests; Confirmed reachable. E1–E7 |
| 24 Capacity invisible | 2 | Confirmed evaluation displays known usable/qualified time and unavailable/stale states; detailed standalone inspection remains limited. Expose existing query detail. E4 |
| 26 overloaded plan vocabulary; 61 vocabulary review | 4 | Confirmed mixed authority terms; contextual copy convergence, not domain collapse. §17 |
| 27 Resolve conflicts dead control | 2,4 | Earlier absent target corrected in current tree; Confirmed legacy jump, not centralized workflow. E11,E17 |
| 28 repeated Friction/bulk | 3,5 | Confirmed single decisions; bulk workflow Not Found. Preserve explicit semantics. E11 |
| 29,30 Found Time/origins | 2,5 | Complete Found Time path Not Found; manual/accepted origins remain distinct. E6,E20 |
| 31 Event Goal association | 3 | Confirmed Goal-side association; Event-side control absent. E1,E20 |
| 32 Event absent Today/Progress | 2 | Confirmed publication prerequisite and separate measured Progress; incident prerequisite state unknown. E13,E15–E16 |
| 33 cumulative Progress value | 3,5 | Confirmed current cumulative observation semantics; incremental/automatic credit requires explicit policy. E16 |
| 34,36,74 outcomes persist/change/remove | 2 | Confirmed record/correct/retract and rehydration; protected Today blocks entry rather than deleting capability. E16 |
| 35,72,73 setup persistence/deterministic regeneration | 1 | Confirmed source/decision-based generation and durable authored setup; do not interpret disposable Preview as authority. E8,E11,E21 |
| 37 after-the-fact reporting | 2,3 | Confirmed implementation/tested component without production historical selector/mount. E16 |
| 38,75 Summary aggregation | 2 | Confirmed real historical queries; protected/unavailable differs from zero. E19 |
| 39 static-looking boxes | 3 | Confirmed expansion controls; Inferred visual discoverability problem. E19 |
| 40,71 large lists/disclosure | 3,4 | Confirmed inline expanding evidence lists; migrate presentation, retain query provenance. E19 |
| 41 Summary range | 3,5 | Confirmed civil recent-range default; canonical-week-aligned default is product policy, not evidence corruption. E19 |
| 42,70 empty attention/panels | 3,5 | Some current sections conditional; blanket defect Not Found. Inferred density policy. E15,E19 |
| 43,44 plan history/Today distinction | 2 | Confirmed missing versus protected published plan states; no Preview fallback. Recovery gap is separate. E14–E15 |
| 45 user-day orientation | 3 | Confirmed canonical query; clearer displayed orientation Inferred. E10,E15 |
| 46,68 Today/selected-day duplication | 4 | Confirmed complementary capabilities with different truth; migrate into day destination. E15,E17 |
| 47 direct Month-to-Day; 78 Month center | 4,5 | Confirmed date selection/context exists; complete shared Day Worksurface Not Found. §13 |
| 48 Previous/Next labels | 3 | Confirmed compact visible labels with more specific accessible labels; copy improvement. E17 |
| 49 Month without generation; 77 independent Events | 2 | Confirmed calendar/manual facts independent; computed coverage remains bounded. E17,E20 |
| 50 rolling/live calendar | 5 | Rolling orchestration Not Found; new evolution, not a missing finite generator. E17 |
| 51 logging-only use | 2,5 | Confirmed manual Events independent; general historical reporting unmounted and Today publication-gated. E15–E16,E20 |
| 52 holiday/calendar facts | 5 | Confirmed static holiday helper/Preview; external ingestion and Month integration not established. E20 |
| 53 range near Work; 54 short default | 3,4 | Confirmed range controls and historical fixed initial range; improve organization/default policy, preserve bounded computation. E18 |
| 55 giant Preview; 58 Canonical Planning Review | 4 | Confirmed transitional surfaces with useful commands/queries; migrate then retire. E11,E17 |
| 56 range warnings; 57 selected-day truth; 59 template; 60 generated | 3,4 | Confirmed overlapping warnings/raw labels; converge copy while preserving unknown/stale/published distinctions. E7,E12,E17,E19 |
| 62,63 two surfaces/too many peers | 4,5 | Confirmed current Planner/Today/Summary destinations; Inferred intended convergence. E17 |
| 64,65 My Schedule hierarchy | 5 | Organizational proposal; Work/Commitment authorities already exist. E18 |
| 67 Tasks vocabulary | 5 | Naming decision; no basis to merge Goal Demand and Commitment recurrence. E1,E3,E8 |
| 69 Planning Review into day | 4 | Inferred consolidation of existing query consumers; preserve accepted/proposed/realized distinctions. E7,E17 |
| Corrected task: 10h + 20h accepted iterations | 2,3 | Confirmed distinct identity mechanism/P2 60+120 analogue; exact Network+ records unavailable. E5–E7 |
| Corrected task: dates replaced realized geometry | 1,2 | Current P2 retains facts; reported replacement root Not Found. Successful Try omission is separate confirmed defect. E6,E11 |
| Corrected task: 11 Sleep Friction after midnight boundary | 1 | Custom-window clipping Confirmed; exact incident branch/count unverified. E8; P1 |
| Corrected task: October 2/16 transition and non-persistent fix | 1 | Full trace supplied; exact cause unresolved. Unplaced-move mapper and gap-search defects Confirmed independently. E10–E11; P3 |
| Corrected task: Ready + coverage unavailable + publish failure | 1,2 | Confirmed readiness/command mismatch and uncertain-commit mechanism; original record failure unresolved. E12–E14; P1 |
| Corrected task: Today/Summary protection/recovery dead end | 2 | Confirmed guards and missing product recovery path; original corruption versus unreachable evidence unresolved. E14–E16,E19 |

Action boundaries: **fix existing behavior** (confirmed defects), **connect existing behavior** (Structure/history reporting/navigation), **expose existing behavior** (Capacity/provenance), **retire legacy presentation after migration** (tower/duplicate day panels), and **design new behavior** (required-Sleep policy, recurring Demand, full Found Time, broader calendar integration). Category 5 is not automatically a bug backlog.

## 25. Test Coverage Assessment

**Confirmed:** canonical full suite passed, **127 test files / 1,110 tests**, including current uncommitted 9.8B tests. Tests establish many authority boundaries but do not replay the original dogfood profile or guarantee discoverability.

| Area | Coverage classification | Evidence / practical limit |
|---|---|---|
| Goal/finite Demand/Priority | Production traced + tested | Goal/planning surfaces and real-store constructive UI tests; numeric editing/discovery less covered |
| Goal Structure | Tested but production authoring reachability unproven | Domain/surface/boundary tests; no authoring UI mount |
| Capacity/Feasibility/competition/Allocation | Production traced + tested | Canonical evaluation suites; no proof of global optimality or arbitrary cross-horizon competition |
| Proposal/decisions/accepted authority | Production traced + tested | Freshness/conflict/decision tests and constructive UI path; exact Network+ iteration history not replayed |
| Realization/resource footprint | Production traced + tested | Stable facts/roles and UI realization; retirement workflow not found |
| Planner/Review Scope | Production traced + tested | Month/scope/readiness/UI tests; protected-history Ready contradiction weakly covered |
| Publication/history | Production traced + tested, important gap | Atomic failure/restart/idempotency/corrupt latest/orphan/abandon source checks exist; post-commit indexed-read failure and misleading copy not covered by suite |
| Today/Execution | Production traced + tested | Published-only/protection/report/correct/retract/rehydration; original blocked profile not inspected |
| Historical reporting component | Tested but production reachability unproven | Component exists; no shell mount |
| Progress | Production traced + tested | Observation/measurement query/UI; no auto execution-credit workflow found |
| Work-relative placement | Production traced + tested | Seven `workRelativeFootprint` cases plus generator coverage; incident beforeWork settings unavailable |
| Sleep/Day Boundary | Production traced but important cases weakly tested | Existing off-day/overnight/buffer/spill tests; custom window noon→midnight reproduced outside suite; no exact October transition fixture |
| Suggested Fix/replay | Production traced + tested, important gaps | Existing mapper/replay/revision tests miss unplaced move ID join, gap cursor case, successful revision retaining realized facts |
| Persistence/rehydration/restore | Production traced + tested | Transaction/runtime/active-v2/backup/durability/source-incarnation suites; original DB preservation cannot be certified from synthetic tests |
| Found Time/recurring Demand | Not Found complete implementation/meaningful end-to-end tests | Provenance discriminator and finite cadence do not establish workflows |

No tests were added or changed. Temporary reproductions identify future coverage needs without modifying the suite or pretending those cases already pass.

## 26. Recommended Post-Audit Convergence Scope

Recommendations are **Inferred**, bounded by confirmed findings; no implementation is authorized or performed here.

**A. Must Correct Before UI Migration.** Correct custom Sleep boundary clipping, corrective gap search/physical occupancy, unplaced-move acceptance identity, and successful revision's lost realized facts. Reconcile publication readiness with materializer/history preconditions, preserve typed failure/commit certainty, and make safe protected-history diagnosis/recovery concrete. Establish the required-Sleep policy explicitly. Resolve original beforeWork/transition/history incident evidence before declaring those defects fixed; do not substitute synthetic success for closure.

**B. Must Connect Before or During Migration.** Expose existing Goal Structure authoring and accepted-iteration provenance; improve Goal planning entry and Capacity explanation; connect selected published days to existing execution reporting; carry Summary day/evidence context into Planner; connect accepted corrective-decision inspection. Found Time and execution-derived Progress require missing semantics as well as UI, so they must not be described as simple wiring tasks.

**C. Migrate Rather Than Repair Presentation in Place.** Move the date tower's correction commands, Planning Review's authority classes, Selected Day's contextual edits and Today's published reporting into coherent Planner day/range responsibilities. Preserve canonical queries and authority classes. Retire old surfaces only after their unique commands are reachable.

**D. Product-Language Convergence.** Translate internal protection, realization, coverage and source-family terms into concrete status and action language. Keep useful concepts such as Goal, Proposal and Friction when contextualized. Error copy must reflect actual write certainty and offer a real safe next step.

**E. Deferred Product Evolution.** Recurring Goal Demand, richer “N sessions × duration” interaction, rotation bulk authoring, rolling external calendar/holiday facts, broad calendar integration and broader learning/recommendation behavior. A full Found Time workflow needs a separate bounded semantic decision. Do not bundle these into a shell migration as incidental fixes.

## 27. Open Questions

1. **Incident source identity:** which exact browser/profile, origin and build produced the final protected state? A consistent isolated forensic copy or existing raw export is needed; the original must remain untouched.
2. **Historical failure:** what exact protection reason, batch/day records, versions/fingerprints and storage error occurred? Did a complete commit precede failed verification, was pre-existing latest authority invalid, or was storage unavailable? No conclusion between these is currently justified.
3. **Placement reproduction:** exact shifts, cycles/modes/segments, effective boundary/week settings, template windows/buffers/recurrences, visible range and timezone for the beforeWork, approximately 18 afterWork Night Shift, 11 Sleep and October 2/16 cases are missing.
4. **Resolution evidence:** which fix action/target was tried; did acceptance actually return success; what decision/source incarnation and replay status existed after regeneration? Try-only loss, mapping rejection, stale instruction and failed persistence are different diagnoses.
5. **Realization replacement:** which accepted allocation/fact IDs existed before/after the date change, and which surface/range showed disappearance? P2 contradicts automatic current-code deletion; F3 offers a distinct Preview-only disappearance mechanism.
6. **Product policy:** how should required Sleep interact with explicit accepted Goal work and Work-impossible days? What scope of cross-boundary Goal footprints is intended? What measured units, corrections and consent would govern execution-derived Progress and Found Time?

Questions 1–5 are evidence blockers for incident closure; question 6 bounds future design rather than preventing the confirmed source findings above. A request for the isolated incident evidence was made during the audit; no such input was available when this RESULT was written.

## 28. Validation Performed

Commands ran from the repository root unless a directory is stated. Source reads/searches used `rg`, `rg --files`, `sed`, `nl`, `cat`, and read-only Git inspection. Some exploratory searches for guessed filenames returned “No such file”; the actual files were located and traced. These were search misses, not test failures.

| Command / operation | Result |
|---|---|
| `git rev-parse HEAD`; `git status --short` | Recorded base and existing dirty tree; no checkout/reset/commit/push |
| Python SHA-256 inventory of existing tracked/untracked nonignored files | Captured 860 file hashes in `/tmp/dayframe-98c-initial-hashes.json`; initial status in `/tmp/dayframe-98c-initial-status.txt` |
| `pdftotext -layout DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf /tmp/dayframe-98c-dogfood.txt` | Exit 0; read older findings without changing PDF |
| `npm test > /tmp/dayframe-98c-tests.log 2>&1` in `code/` | Exit 0; 127 files, 1,110 tests passed, 37.49s |
| `./node_modules/.bin/tsc --noEmit false --outDir /tmp/dayframe-98c-build > /tmp/dayframe-98c-compile.log 2>&1` in `code/` | Exit 0; typechecked and emitted only to `/tmp` for isolated production-function probes |
| Temporary `/tmp/dayframe-98c-build/package.json` with `type: module` | Enables emitted ESM imports; no repository/package changes |
| `TZ=America/Chicago node /tmp/dayframe-98c-probe.mjs` | Exit 0; readiness/uncertain-commit and placement/Sleep cases P1 recorded above |
| `TZ=America/Chicago node /tmp/dayframe-98c-provenance.mjs` | Final exit 0; P2 separate identities and retained facts after date revision. Preliminary run lacked global IndexedDB and failed bootstrap; corrected only temporary harness to use fresh fake factory |
| `TZ=America/Chicago node /tmp/dayframe-98c-sleep-fix.mjs > /tmp/dayframe-98c-sleep-fix.log 2>&1` | Exit 0; P3 overlapping corrective move and `tryNotApplied` acceptance rejection |
| Required RESULT creation | Only intended durable repository addition; no production/test/schema/UI edits |
| `git diff --check` | Exit 0; no whitespace errors in existing tracked diff |
| Python RESULT structure/table and baseline SHA-256 checks | Passed: 29 ordered required sections, consistent Markdown table columns, all baseline production/test files unchanged; concurrent request-document changes detailed below |

The fixtures used fresh fake IndexedDB objects and isolated names; bootstrap writes and acceptance/publication writes occurred only in process-memory fixtures. No original browser localStorage, IndexedDB, profile, backup or persisted history was accessed. Existing full tests likewise used their test infrastructure. No new dependencies, formatter, history repair or migration was run. Full production browser reproduction was not performed; original incident evidence was unavailable.

**Final integrity check:** SHA-256 comparison found all pre-existing production and test files unchanged. Of 860 baseline files, 859 remained byte-identical; the existing Task 9.8C request Markdown changed concurrently outside this audit's edits and now exactly matches the authoritative attachment (SHA-256 `f8a9afd50d4f7613992602466352314ddfc55e4a2925d32fad0638c88dc0526f`). A Task 9.8A request Markdown also appeared concurrently. Both user/task-document changes were preserved. The only file written by this audit in the repository is this RESULT. No claim is made that the entire working tree was otherwise static.

## 29. Completion Assessment

**Delivered:** all 29 requested sections; lifecycle, UI ownership, correctness and missing-link matrices; Goal constructive/provenance trace; Commitment/Sleep/user-day/cycle/fix trace; publication/protection/recovery analysis; downstream execution/Progress/history/Found Time assessment; authority and all 22 invariants; all major dogfood dispositions; test assessment; bounded convergence recommendations. The full canonical suite and TypeScript compilation pass.

**Not established:** the original protected database's precise failure/preservation state; the exact beforeWork temporal error; incident-build equivalence for Night afterWork; the original 11-Sleep and October 2/16 transition/fix causes; and the reported replacement of realized geometry. The task requires these conclusions and explicitly prohibits claiming completion without them. Synthetic mechanisms and source traces are useful evidence but cannot substitute for the missing incident facts.

Task 9.8C — Post-Dogfood Product Reachability & Workflow Audit is INCOMPLETE.

Unresolved evidence blockers: a consistent isolated copy/export of the dogfood authority and protection diagnostics; the exact incident build and authored placement/cycle/boundary settings; and before/after decision, allocation, realization and visible-range evidence for the reported fix/geometry changes. The original persisted state must remain preserved; no repair or bypass was performed.
