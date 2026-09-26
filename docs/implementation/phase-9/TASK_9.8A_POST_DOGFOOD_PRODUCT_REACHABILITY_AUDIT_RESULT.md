# Task 9.8A — Post-Dogfood Product Reachability & Workflow Audit RESULT

Audit date: 2026-09-16. Repository: DayFrame. Audited commit: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`.

## 1. Executive Findings

**Confirmed:** Phase 8/9 contains substantial working domain and application capability beneath a shell that exposes only parts of it. Ordinary Goal authoring stops before Demand authoring. Structure, Demand, Priority, resource-footprint authoring, Capacity, Feasibility, Competition and Allocation have callable implementations but no production authoring/evaluation UI. Proposal derivation and recording also have no production UI invocation. The absence of encountered Proposals is therefore not evidence that Allocation or Proposal semantics need rebuilding. [E1–E7]

**Confirmed:** Review Schedule already renders existing Proposals and invokes canonical accept/reject commands. Acceptance revalidates current inputs, atomically records decision and Accepted Allocation, and then attempts Realization through the production store callback. This downstream connection must be preserved. It does not make the ordinary Goal-to-Proposal path reachable. [E6–E8]

**Confirmed:** Publication is an explicit, ordinary production workflow: Planner → Review Schedule → Generate/Refresh Preview if needed → resolve blockers → Publish schedule. Today consumes published history, not live Preview. No encountered publication during dogfooding is a discoverability/workflow observation, not a missing publication implementation. [E9–E10]

**Confirmed:** A manual Event can be associated with a Goal from Goal detail's supporting-commitment selector. Event authoring has no Goal selector, and this association does not create Found Time. Only a Found Time provenance discriminator was found; a complete Found Time command/model/lifecycle was not found. Goal Progress is explicitly based on cumulative manual quantity observations, not execution duration. [E1, E11–E13]

**Confirmed correctness defects:** (1) buffered overnight `afterWork` can reject a free opening because its extension omits the candidate's before-buffer; a direct production-generator experiment reproduced this. (2) Resolve schedule conflicts only attempts to focus nonexistent `preview-heading`, providing no actual navigation or resolution. **Not Found:** a reproducible `beforeWork` overlap from the supplied scenario parameters. Day and night `beforeWork` both placed correctly in the audit experiment. The PDF says daytime beforeWork appeared correct; the task brief says it failed on all shifts. Neither observation is silently discarded. [E14–E16; §14]

**Confirmed:** Historical execution commands and standalone historical-reporting UI exist, but those components are not mounted by the current production shell. Month can navigate without Preview and independently display authored Events; generated coverage still gates planning knowledge, Capacity and publication. [E10–E13, E17]

**Inferred:** A Planner/Summary shell with a shared Day Worksurface and a My Schedule hierarchy is architecturally supportable without replacing the core authority model. This does not mean a complete constructive workflow, execution-derived Progress, Found Time, or unrestricted logging can be obtained by moving components alone. [E1–E19]

## 2. Audit Method and Evidence Standard

**Confirmed repository baseline:** `git status --short` initially reported only:

```text
?? DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf
```

No tracked modifications existed. No applicable `AGENTS.md` was found in this repository; the parent-tree search found only an unrelated sibling-project file. The supplied task was read from the attachment. The complete ten-page Dogfood Pass 02 PDF was extracted read-only and all 78 findings were dispositioned below. Prior architecture/task documents provided orientation only; classifications below rest on current production code and tests.

Method: enumerate `code/src`; follow domain symbols through state surfaces, lazy adapters, `dayFrameStore`, production component imports, callbacks and actual controls; reverse-search callers excluding tests; inspect fixtures separately from ordinary app paths. A component-only test is not treated as proof that the shell mounts it. “Conditional” means a consumer exists for preexisting authority, but the ordinary UI cannot produce that authority from a fresh authored Goal. No browser session or exact saved dogfood backup was supplied/replayed.

Evidence labels: **Confirmed** = directly established by inspected code, executed existing tests, or the explicitly described production-function experiment. **Inferred** = supported architectural/product interpretation, not directly demonstrated implementation. **Not Found** = bounded negative search result, not an assertion about every conceivable implementation. In matrices, C/I/N abbreviate these labels. Classification names retain the task's exact vocabulary. Recommendations are **Inferred** unless stated otherwise.

Existing full suite executed without editing tests: **125 files, 1,091 tests passed, zero failures**. An inline Node invocation additionally exercised the existing generator for six placement scenarios; it did not create a test file, change code or write persisted application state. This experiment is distinguished from the existing test suite.

### Evidence register

Paths are repository-relative. Each ID supplies file, symbol, practical line anchors and, where relevant, the exact supporting test. Negative UI-call findings use the entire production `code/src/ui` tree plus `main.tsx`/`DayFrameApp.tsx`, with tests excluded.

| ID | Production path / symbols | Supporting behavioral evidence |
|---|---|---|
| E1 | `code/src/core/goals/goal.ts:6–37` (`GoalV1`, optional target date, source links); `code/src/state/goalSurface.ts:51–81,112–205,244–250` (`createGoalSurface`, `createGoal`, `updateGoal`, `linkCommitment`, `GOAL_AUTHORITY_STORE`); `code/src/ui/GoalSection.tsx:111–156,248–284,433–480,492–524` (save, optional date, measurement, linking); `code/src/ui/DayFrameApp.tsx:919–925,2343–2348`; `code/src/ui/MonthlyPlannerSurface.tsx:636–638` | `code/src/ui/tests/GoalSection.test.tsx:109` — “creates and edits a Goal independently of the scheduling plan and Preview”; `:132` — “links, unlinks, completes, and reactivates without mutating commitments”; `code/src/ui/tests/DayFrameApp.test.tsx:2158` — “reuses canonical Goals, Preferences, Range, and Save Setup in Month Planning Settings”. |
| E2 | `code/src/core/planning/goalStructure.ts:18–99` (contains/contributesTo/dependsOn, milestone, eligibility); `code/src/state/goalStructureSurface.ts:120,228,396–399` (`createRelationship`, `createMilestone`); `code/src/state/lazyGoalStructureSurface.ts` forwards commands; no production component calls them | `code/src/state/goalStructureSurface.test.ts:30` — “persists atomic relationship and Milestone revision histories”; `:95` — “rejects invalid graph without partially mutating authority and protects malformed persistence”. |
| E3 | `code/src/core/planning/goalDemand.ts:18–76` (bounded horizon, minutes, session, satisfaction, total/sessionCount cadence, Priority); `code/src/state/goalPlanningSurface.ts:145–174,233,297,483–525` (`createDemand`, `createPriority`, footprint spec/association, `projectGoalDemand`); `code/src/state/goalDemandProjectionQuery.ts` (`queryGoalDemandProjection`); no UI caller | `code/src/state/goalPlanningSurface.test.ts:73` — “persists Demand/Priority revisions, no-ops, lifecycle, projections, and exact history”; `:172` — “rejects invalid input atomically and protects malformed persisted state”. |
| E4 | `code/src/state/capacitySurface.ts:8–108` (`queryCapacity`, `queryCapacityForUserDay`, `evaluateGoalDemandFeasibility`); `code/src/state/dayFrameStore.ts:685–698` wires lazy Capacity/Allocation; `code/src/core/planning/capacity.ts:14–105` qualification, exclusions/liabilities; no Capacity UI query/render | `code/src/state/capacitySurface.test.ts:5` — “distinguishes unavailable Preview and protected authority from zero Capacity”; `code/src/core/planning/capacity.test.ts:57` — “represents accepted authority once: liability before realization, exclusion after”; `:158` — “is deterministic, demand-neutral, and does not mutate schedule input”; `:182` — “marks stale and clipped Preview truth non-allocatable or qualified rather than zero”. |
| E5 | `code/src/core/planning/goalFeasibility.ts:17–151` (`evaluateGoalFeasibility`, typed reasons); `code/src/state/allocationSurface.ts:22–105` (`deriveCompetingDemandContext`, `allocateCompetingSet`, `allocateAllCompetition`, `evaluateCompetingAllocation`); `code/src/core/planning/competingDemand.ts`, `allocation.ts` derive competition/allocation | `code/src/core/planning/allocation.test.ts:121` — “derives exact overlap edges, connected components, and deterministic identities”; `:141` — “uses exact scoped Goal Priority only when claims compete”; `:177` — “conserves Capacity and reports exact unallocated portions without mutation”. |
| E6 | `code/src/core/planning/proposal.ts:17–95` and `deriveOrdinaryProposal` (Proposal/NoProposal); `code/src/state/proposalSurface.ts:102–123,181–206,219–314,323–372` (derive/record/accept/reject); `code/src/state/dayFrameStore.ts:700–735` revalidation callback; no production UI derivation/recording call | `code/src/core/planning/proposal.test.ts:40` — “separates invalid horizon from typed No-Proposal”; `:197` — “abstains on unknown decisive input and structurally inapplicable input”; `code/src/state/proposalSurface.test.ts:17` — “atomically records, accepts, freezes authority, and prevents double claims”; `:66` — “persists rejection without Accepted Allocation and rejects later acceptance”; `:92` — “durably stales changed input without partially accepting”. |
| E7 | `code/src/ui/ScheduleReviewPanel.tsx:235–294` renders existing Proposal options/accept preferred/reject; `code/src/ui/DayFrameApp.tsx:2682–2689` passes real store commands; `code/src/state/planningScopeQuery.ts:145–169` reads, does not generate, actionable Proposals | `code/src/ui/tests/ScheduleReviewPanel.test.tsx:85` — “shows readiness, keeps Proposal non-authoritative, and routes decisions through existing commands”. This fixture supplies a Proposal; it does not establish ordinary creation. |
| E8 | `code/src/state/dayFrameStore.ts:738–767,2992–3047` realization callback and Preview feed; `code/src/state/realizationSurface.ts:62–107` (`realizeAcceptedAllocation`); `code/src/core/planning/acceptedAllocationRealization.ts` (`stageAcceptedAllocationRealization`); `code/src/core/planning/realizedScheduleIdentity.ts:22–99` roles, origins, execution eligibility; `code/src/state/planningScopeQuery.ts:97–153`; `code/src/ui/plannerReviewPresentation.ts:65–109` | `code/src/state/realizationSurface.test.ts:37` — “atomically persists one deterministic realization and is restart-idempotent”; `:63` — “fails closed on a current schedule conflict and writes no partial footprint”; `:91` — “keeps runtime and durable authority empty when the atomic write aborts”; `code/src/core/planning/realizedScheduleIdentity.test.ts:176` — “makes Goal work and support valid stable execution references while prohibiting Buffer”. |
| E9 | `code/src/state/schedulePublication.ts:22–95` (`publishScheduleRangeV1`); `code/src/state/dayFrameStore.ts:3055–3070`; `code/src/ui/ScheduleReviewPanel.tsx:104–135,200–225`; `code/src/core/historicalPlan/materializePlanPublication.ts:118–199,222–237`; `code/src/state/historicalPlanSurface.ts` (`publishAtomically`) | `code/src/state/historicalPlanSurface.test.ts:94` — “publishes only after explicit authorization of a fresh reviewed Preview”; `:189` — “atomically persists, verifies, queries, exports, and restarts”; `:217` — “keeps explicit atomic publication out of runtime and history when persistence fails”; `:272` — “deduplicates identical authority and appends meaningful removal”; `code/src/ui/tests/ScheduleReviewPanel.test.tsx:41` — “publishes the exact reviewed range explicitly and announces durable success”. |
| E10 | `code/src/state/todayQuery.ts` (`createTodayQuery`); `code/src/core/today/buildTodayReadModel.ts`; `code/src/ui/TodaySurface.tsx:13–25,35–75,91–99` and outcome controls; `code/src/ui/DayFrameApp.tsx:2734` mounts Today; `code/src/core/execution/historicalPlanExecutionTarget.ts:22–39` rejects Buffer targets | `code/src/ui/tests/TodaySurface.test.tsx:198` — “records an exact occurrence once, advances the cutoff, and restores local focus”; `:298` — “uses append-only correction and confirmed retraction, with conflict retry copy”; `:360` — “distinguishes known-empty, missing, plan-protected, and execution-protected states”. |
| E11 | `code/src/core/calendar/types.ts:12–23` (`ManualCalendarEvent`, no Goal field); `code/src/state/manualCalendarEvents.ts`; `code/src/ui/DayFrameApp.tsx:2260–2326` Event edit draft, plus singular Event form; `code/src/core/planning/planningFoundation.ts:35,291` only `foundTimeProposalAcceptance` discriminator occurrences; source-wide case-insensitive Found Time search found no creator | `code/src/ui/tests/DayFrameApp.test.tsx:2044` — “creates, edits, and deletes a manual event from the compact preview day details”; `:1338` — “allocates distinct manual-event IDs for an identical creation timestamp and preserves edits”. |
| E12 | `code/src/core/execution/executionRecord.ts:69–119` (`ExecutionSubject`, actual-time evidence, outcomes); `code/src/state/executionHistorySurface.ts:490–527` report/correct/retract; `code/src/state/executionHistoryIndexedDb.ts`; `code/src/ui/HistoricalPlanReportingSection.tsx:13–107` past-date query/control; `code/src/ui/ExecutionHistoryPanel.tsx:19` existing history UI. Neither historical component has a production import/mount in the current shell | `code/src/state/executionHistorySurface.test.ts:127` — “rehydrates exact records and outcomes without source resolution or allocation”; `:319` — “appends planned/unplanned reports, prevents duplicate planned subjects and rejects unplanned skip”; `:427` — “exposes history outside DayFrameState without notifying state subscribers or changing Preview”; `code/src/ui/tests/HistoricalPlanReportingSection.test.tsx:78` — “submits a frozen historical target through the existing report control”. |
| E13 | `code/src/state/goalProgressQuery.ts:18–88` (`createGoalProgressQuery`, Goal+Definition+Observation only); `code/src/core/progress/manualQuantityProgress.ts`; `code/src/ui/GoalMeasurementSection.tsx:26–34,215–256`; `code/src/ui/GoalProgressReportingSection.tsx:300–370`; `code/src/core/historicalIntelligence/goalActivity.ts:156–267` separate frozen-link activity aggregation | `code/src/state/goalProgressQuery.test.ts:46` — “reads only Goal, Definition, and Observation surfaces”; `:60` — “honors correction, retraction, and late-entry knowledge cutoffs”; `code/src/ui/tests/GoalSection.test.tsx:10` — “records, corrects, and removes absolute measured values without changing Goal or Measurement”. |
| E14 | `code/src/core/blocks/generateBlockCandidates.ts:24–55,275–358` recurrence and candidate fields; `code/src/core/blocks/placeBlockCandidates.ts:71–139,300–320,380–615,677–763` work selection, bounds, openings; `code/src/core/engine/generateSchedulePreview.ts:75–174` expanded context, canonical windows, Work occupancy and detection; `code/src/core/cycles/generateCycleWorkBlocks.ts:20–64,113–130,151–189` actual Work instants and canonical owner | `code/src/core/blocks/tests/placeBlockCandidates.test.ts:119` — “places beforeWork candidates immediately before the first work block”; `:207` — “places afterWork candidates immediately after the last work block”; `:294` — “allows afterWork candidates for overnight shifts to extend into the next user-day window” (no buffers); `code/src/core/engine/tests/generateSchedulePreview.test.ts:1359` — “places 8-hour sleep before a night shift using the full duration”; `:1436` — “keeps before-work buffered sleep on the first, middle, and last visible preview days”. |
| E15 | `code/src/core/engine/generateSchedulePreview.ts:173–196` Friction/SuggestedFix derivation; `code/src/ui/PreviewScreen.tsx:252–291,707–751,763–775` grouped patterns, individual callbacks; `code/src/ui/DayFrameApp.tsx:1080–1185` apply Preview then explicit accept; `code/src/state/planDecisionSurface.ts`; `code/src/state/compositionSurface.ts:189–219` separate CompositeDecision command, no UI caller | `code/src/ui/tests/DayFrameApp.test.tsx:2814` — “lets the user apply a suggested fix after generating a preview”; `code/src/ui/tests/PreviewScreen.test.tsx:628` — “groups repeated equivalent friction patterns while keeping individual fixes available”; `:685` — “disables grouped and individual suggested fixes when the preview is stale”. |
| E16 | `code/src/ui/ScheduleReviewPanel.tsx:208–213` Resolve schedule conflicts invokes `onOpenFriction`; `code/src/ui/DayFrameApp.tsx:2684–2686` calls `document.getElementById("preview-heading")?.focus()`; exhaustive production search finds no element with that ID (only `compact-preview-heading` at 1985) | Direct callback/DOM-ID trace establishes the missing target. Panel test `code/src/ui/tests/ScheduleReviewPanel.test.tsx:122` — “explains blockers and exposes governed existing actions” tests the supplied callback, not this absent app target. |
| E17 | `code/src/state/monthlyPlannerQuery.ts:16–45`; `code/src/core/monthlyPlanner/queryMonthlyPlanner.ts:181–235,474–540`; `code/src/ui/MonthlyPlannerSurface.tsx:149–175,245–261,311–337,551,636` navigation, authored Events, Selected Day and planning review; `code/src/state/createInitialDayFrameState.ts:66–72` fixed three-day default | `code/src/core/monthlyPlanner/queryMonthlyPlanner.test.ts:254` — “projects all-day and timed Events from current authored authority exactly once”; `:598` — “keeps displayed month independent from planning range and Preview coverage”; `:203` — “resolves variable-duration selected windows and transition metadata”. |
| E18 | `code/src/ui/PlannerSurface.tsx:3–80`; `code/src/ui/DayFrameApp.tsx:885–925,1885–1975,2340–2465` shared contextual/editor routing; `code/src/ui/SetupScreen.tsx:847,966–1002,1564–1707,1930–1999,2113–2145,2967–2976` cycle modes, sequence authoring, duration, preferred-window labels); `code/src/ui/CommitmentSection.tsx:98–121,360–383,417–452,483–508` (exact editor, minutes-only bounded duration, weekday boxes, raw preferred-window values); `code/src/ui/SetupScreen.tsx:1724–1756` (advanced fields enumerate all templates) | `code/src/ui/tests/DayFrameApp.test.tsx:2199` — “extracts canonical structural Work into the shared Work Pattern workspace”; `:2266` — “extracts the complete authored inventory into the shared Commitment Library”; `:2388` — “navigates from an exact scheduled occurrence to the reused lazy Commitment editor”; `:4860` — “preserves one dirty draft across Planner modes and Summary without implicit writes”. |
| E19 | `code/src/core/planning/planningScope.ts:11–75,200–267`; `code/src/state/dayFrameStore.ts:2992–3052`; `code/src/state/planningScopeQuery.ts:77–230`; `code/src/ui/PlanningReviewPanel.tsx:25–35,59–119`; `code/src/ui/HistoricalIntelligenceSummary.tsx:74–119,314–360,498–543,576–625` | `code/src/state/monthlyPlannerQuery.test.ts:20` — “adapts current Active/Preview inputs and explicit readiness without writes”; `code/src/ui/tests/DayFrameApp.test.tsx:4897` — “reviews one selected canonical user-day without execution outcome controls”. |
| E20 | `code/src/state/createInitialDayFrameState.ts:44–63,136–173` empty new setup, legacy untouched-Sleep normalization; `code/src/core/blocks/placeBlockCandidates.ts:141–181,802–860` deferred Sleep anchor propagation and priority ordering; `code/src/core/calendar/getStaticHolidays.ts:5,239`; `code/src/ui/PreviewScreen.tsx:585` static holiday lookup | `code/src/ui/tests/DayFrameApp.test.tsx:3540` — “re-enables persisted untouched default sleep and generates preview”; `:3624` — “allows preview generation when sleep is intentionally disabled but another template is enabled”; `code/src/ui/tests/PreviewScreen.test.tsx:583` — “annotates preview days with local static holidays inside the visible range”. |

## 3. End-to-End Product Reachability Map

**Confirmed topology:** This is a dependency map, not a claim that Structure must be authored for every Goal or that publication is necessary to author a Goal.

```text
Goal [IMPLEMENTED_DISCOVERABILITY_DEFECT]
  → Structure [IMPLEMENTED_UI_UNEXPOSED; optional relationships/milestones]
  → Demand [IMPLEMENTED_UI_UNEXPOSED; FIRST ORDINARY CONSTRUCTIVE BREAK]
  → Priority [IMPLEMENTED_UI_UNEXPOSED]
  → Projection [IMPLEMENTED_UI_UNEXPOSED; on-demand query]
  → Capacity [IMPLEMENTED_UI_UNEXPOSED; requires schedule coverage in state adapter]
  → Feasibility [IMPLEMENTED_UI_UNEXPOSED; footprint/coverage qualification]
  → Competition [IMPLEMENTED_UI_UNEXPOSED]
  → Allocation [IMPLEMENTED_UI_UNEXPOSED]
  → Proposal [IMPLEMENTED_DISCONNECTED; derivation + durable recording not initiated by UI]
  → ProposalDecision [IMPLEMENTED_DISCONNECTED; existing UI consumes preexisting Proposals]
  → Accepted Allocation [IMPLEMENTED_DISCONNECTED; same upstream break]
  → Realization [IMPLEMENTED_DISCONNECTED; automatic attempt after successful acceptance]
  → Scheduled Goal Work [IMPLEMENTED_DISCONNECTED; consumers exist, upstream supply absent]
  → Review [IMPLEMENTED_REACHABLE for ordinary Work/Commitment/Event schedule]
  → Publication [IMPLEMENTED_DISCOVERABILITY_DEFECT; explicit real control]
  → Execution [IMPLEMENTED_REACHABLE for published current-day eligible occurrences]
  → Progress [PARTIAL_IMPLEMENTATION; activity aggregation ≠ measured quantity Progress]
  → History / Summary [IMPLEMENTED_REACHABLE for existing durable evidence]
```

References: E1–E13, E17–E19. **Confirmed:** Creating a Goal, configuring a minutes measurement target, generating Preview, and opening Review do not invoke `createDemand`, `evaluateCompetingAllocation`, `deriveProposal` or `recordProposal`. Production acceptance revalidation does invoke Allocation, but only after a Proposal already exists. [E1, E3–E7]

## 4. Reachability Matrix

D = domain, A = application/query path, S = store/command; Y/N/P = yes/not found/partial. UI “conditional” means actually wired but dependent on authority the ordinary UI cannot currently originate. Tests refer to the register's exact tests; “none exact” explicitly limits coverage. Evidence cells label findings.

| Capability / Stage | D | A | S | Production UI invokes | Ordinary user reachable | Tests | Classification | Evidence |
|---|---:|---:|---:|---|---|---|---|---|
| Goal creation | Y | Y | Y | Y | Yes, buried | E1 | IMPLEMENTED_DISCOVERABILITY_DEFECT | C E1 |
| Goal editing | Y | Y | Y | Y | Yes, same entry | E1 | IMPLEMENTED_DISCOVERABILITY_DEFECT | C E1 |
| Goal Structure | Y | Y | Y | N | No | E2 | IMPLEMENTED_UI_UNEXPOSED | C lower path; N UI E2 |
| Milestones | Y | Y | Y | N | No | E2 | IMPLEMENTED_UI_UNEXPOSED | C/N E2 |
| Containment/contribution/dependency | Y | Y | Y | N | No | E2 | IMPLEMENTED_UI_UNEXPOSED | C/N E2 |
| Demand authoring | Y | Y | Y | N | No | E3 | IMPLEMENTED_UI_UNEXPOSED | C/N E3 |
| Priority authoring | Y | Y | Y | N | No | E3 | IMPLEMENTED_UI_UNEXPOSED | C/N E3 |
| Demand footprint spec/association | Y | Y | Y | N | No | E3, E6 | IMPLEMENTED_UI_UNEXPOSED | C/N E3–E5 |
| Projection | Y | Y | Y | N direct | No | E3 | IMPLEMENTED_UI_UNEXPOSED | C/N E3 |
| Capacity | Y | Y | Y | N direct/render | No | E4 | IMPLEMENTED_UI_UNEXPOSED | C/N E4 |
| Feasibility | Y | Y | Y | N direct/render | No | E5 | IMPLEMENTED_UI_UNEXPOSED | C/N E5 |
| Competition | Y | Y | Y | Conditional revalidation only | No normal initiation | E5 | IMPLEMENTED_UI_UNEXPOSED | C E5–E6 |
| Allocation | Y | Y | Y | Conditional revalidation only | No normal initiation | E5 | IMPLEMENTED_UI_UNEXPOSED | C E5–E6 |
| Proposal generation | Y | Y | Y | N | No | E6 | IMPLEMENTED_DISCONNECTED | C/N E6–E7 |
| No-Proposal | Y | Y | Y derive only | N | No | E6 | IMPLEMENTED_UI_UNEXPOSED | C E6; not durably recorded |
| Proposal acceptance | Y | Y | Y | Conditional Y | Not from fresh Goal | E6–E7 | IMPLEMENTED_DISCONNECTED | C E6–E7 |
| Proposal rejection | Y | Y | Y | Conditional Y | Not from fresh Goal | E6–E7 | IMPLEMENTED_DISCONNECTED | C E6–E7 |
| Accepted Allocation | Y | Y | Y | Conditional via acceptance | Not from fresh Goal | E6 | IMPLEMENTED_DISCONNECTED | C E6–E8 |
| Realization | Y | Y | Y | Conditional automatic callback | Not from fresh Goal | E8 | IMPLEMENTED_DISCONNECTED | C E8 |
| Scheduled Goal Work | Y | Y | Y | Conditional read/publication | Not from fresh Goal | E8–E10 | IMPLEMENTED_DISCONNECTED | C E8; partial Month integration |
| Support activity / Buffer | Y | Y | Y | Conditional read/publication | Same upstream break | E8 | IMPLEMENTED_DISCONNECTED | C E8; Buffer not reportable |
| Found Time | P provenance only | N | N | N | No | None complete | PARTIAL_IMPLEMENTATION | N creator/lifecycle E11 |
| Goal-linked manual event | Y via Goal link | Y | Y | Y from Goal detail | Yes, obscure | E1 | IMPLEMENTED_DISCOVERABILITY_DEFECT | C E1/E11; not Found Time |
| Execution reporting | Y | Y | Y | Y Today | Published current day | E10/E12 | IMPLEMENTED_REACHABLE | C E10–E12 |
| Retrospective reporting | Y | Y | Y | N arbitrary-date mount | No arbitrary-date path | E12 | IMPLEMENTED_DISCONNECTED | C component; N shell E12 |
| Goal Progress from execution | P activity history | P separate activity query | N quantity bridge | N | No quantity progress | E13 | PARTIAL_IMPLEMENTATION | C E13 |
| Manual cumulative Goal measurement | Y | Y | Y | Y | Yes | E13 | IMPLEMENTED_REACHABLE | C E13 |
| Friction detection | Y | Y | Y | Y generation | Yes | E14/E15 | IMPLEMENTED_REACHABLE | C E15 |
| SuggestedFix generation | Y | Y | Y | Y generation | Yes | E15 | IMPLEMENTED_REACHABLE | C E15 |
| SuggestedFix application | Y | Y | Y | Y per occurrence | Yes | E15 | IMPLEMENTED_REACHABLE | C E15 |
| Resolve Schedule Conflicts | Y downstream | Y downstream | Y downstream | Broken focus handler | Button yes, action no | No exact app regression | EXPOSED_INCORRECT | C E16 |
| Group repeated Friction | Y presentation | Y | N mutation needed | Y | Yes | E15 | IMPLEMENTED_REACHABLE | C E15 |
| Atomic bulk similar-Friction resolution | N | N | N | N | No | None found | NOT_FOUND | N E15; grouping ≠ bulk |
| CompositeDecision | Y | Y | Y | N | No | `code/src/state/compositionSurface.test.ts:41` — “persists semantic revisions, preserves exact history, and does not revise no-ops” | IMPLEMENTED_UI_UNEXPOSED | C/N E15 |
| Planning Review | Y | Y | Y query | Y | Yes | E7/E19 | IMPLEMENTED_REACHABLE | C E19 |
| Publication | Y | Y | Y | Y | Yes, buried in review | E9 | IMPLEMENTED_DISCOVERABILITY_DEFECT | C E9 |
| Published Plan consumption | Y | Y | Y query | Y Today/Summary | Yes if published | E9/E10 | IMPLEMENTED_REACHABLE | C E9–E10 |
| Plan History | Y | Y | Y | Y Summary | Yes if published | E9/E19 | IMPLEMENTED_REACHABLE | C E9/E19 |
| Summary execution history | Y | Y | Y | Y | Yes | E12/E19 | IMPLEMENTED_REACHABLE | C E12/E19 |
| Arbitrary Month navigation | Y | Y | Y query/local view | Y | Yes | E17 | WORKING_AS_INTENDED | C E17 |
| Manual Event outside planning coverage | Y | Y | Y | Y | Yes | E11/E17 | IMPLEMENTED_REACHABLE | C E11/E17 |
| Open-ended Goal identity | Y optional date | Y | Y | Y | Yes | E1 | WORKING_AS_INTENDED | C E1 |
| Recurring rolling Goal Demand | N beyond bounded total/session count | N | N | N | No | None found | NOT_FOUND | N E3; future semantics |
| Static holidays in Preview | Y | Y helper | No authored store | Y Preview | Yes within static data/range | E20 | IMPLEMENTED_REACHABLE | C E20; not external ingestion |

## 5. Workflow Breakpoint Analysis

| Lifecycle | Last confirmed ordinary stage | First break | Reason and layer | Classification / evidence |
|---|---|---|---|---|
| Constructive Goal planning | Authored Goal (optional measurement/links) | Goal → Demand | Separate canonical `createDemand` has no UI; Goal save never calls it. Structure optional, also hidden. Later independent gap: no evaluation → derive → record orchestration from UI | C IMPLEMENTED_UI_UNEXPOSED at first edge; IMPLEMENTED_DISCONNECTED later. E1–E7 |
| Found Time | Manual Event, optionally linked from Goal detail | Goal-oriented action → Found Time | Existing link is source association; no Found Time creator/complete model found. This is not merely a hidden completed feature | N creator; PARTIAL_IMPLEMENTATION (provenance stub). E1/E11 |
| Publication | Current schedule → Review → Publish → published history → Today/Summary | No universal break in this chain | Works if current covered Preview, no unresolved Friction, no unrealized accepted liability, matching source and durable write. Visibility defect; Goal-produced input blocked upstream | C IMPLEMENTED_DISCOVERABILITY_DEFECT. E9–E10 |
| Corrective planning | Friction → individual SuggestedFix → Preview revision → explicit accepted PlanDecision/replay | Aggregate Resolve control → actual destination | Null focus target; separate individual path works. CompositeDecision UI and atomic apply-to-similar workflow not found | C EXPOSED_INCORRECT button; N bulk UI. E15–E16 |
| Execution | Published current eligible occurrence → report → durable history → Summary | Arbitrary historical date selection → report; execution → measured Goal Progress | Historical component unmounted; Progress query has no execution input. Reporting itself is general, not today-limited | C IMPLEMENTED_DISCONNECTED historical UI; PARTIAL_IMPLEMENTATION desired Progress lifecycle. E10–E13 |

**Confirmed:** Failure to find a Proposal is upstream of its existing review/acceptance controls. Failure to see Plan History can simply mean no successful explicit publication; it does not prove a broken historical ledger. Failure to see an Event in Today can follow directly from Today's publication prerequisite even when Month correctly displays that Event. [E6–E13]

## 6. Goal and Goal-Structure Findings

**Confirmed:** Goals live in the independent IndexedDB Goal authority collection, not in `DayFrameState.preview`. `createGoal`/`updateGoal` enforce revisions and persist Goal authority; the mounted `GoalSection` invokes those actions. The actual shell path is Planner → Month → selected-day **Planning settings** → Goals. Editing and lifecycle controls share that detail surface. The chosen day is UI context, not Goal ownership. No separate persistent global Goals destination was found. Thus “only Daily Worksurface” is imprecise naming, but the discoverability concern is supported. [E1]

**Confirmed:** Containment, nonaggregating contribution, hard/advisory dependency and manually satisfied milestones are concrete revisioned structures with graph validation and eligibility projection. Store commands are present, but no ordinary UI authors any of them. Goal source links to Commitments/Events/Work are not Goal decomposition. [E2]

**Confirmed:** A Goal can omit target date both in the model and in the form, which explicitly says optional. It can remain active without an end date or measurement definition. The claim that every Goal requires a target/end date is contradicted by current code. **Not Found:** a recurring Goal lifecycle that automatically renews bounded Demand. `DemandCadenceV1` is total effort or session count inside an explicit horizon, not Commitment recurrence. **Inferred:** explicit ongoing-product semantics still warrant design beyond merely allowing an undated Goal. [E1/E3]

**Confirmed:** Minutes entered in the quantity measurement editor are not planning effort. The complete independent Demand shape includes requested effort, horizon, session shape, satisfaction and cadence; Goal creation does not create it. Priority is also distinct from a Commitment's numeric scheduling priority. [E3/E13]

## 7. Demand / Capacity / Feasibility Findings

**Confirmed:** Demand and scoped/default Goal Priority are independently authored and revisioned through `createDemand` and `createPriority`. None of their required fields is exposed as Demand by GoalSection. Resource-footprint specification and explicit association commands also exist without UI. A future connection must expose or deliberately author their semantics; it must not reinterpret a measurement target as Demand. [E3]

**Confirmed:** Projection is derived on `projectGoalDemand`, using Goal/structure/horizon inputs; it is not automatically stored at Goal creation. Allocation evaluation calls Projection and Feasibility on current active Demands whose horizons exactly equal the evaluation horizon. This exact-match filter is a real current limitation, not a general overlapping-horizons planner. [E3/E5]

**Confirmed answer to the Capacity question:** Yes, production code can calculate Capacity for an ordinary generated schedule even when the user cannot see it. The path is `store.queryCapacity` (lazy surface) → `createCapacitySurface.queryCapacity` → `deriveCapacity`. Capacity is demand-neutral; Goal-specific evaluation is the separate `evaluateGoalDemandFeasibility` → Projection → `evaluateGoalFeasibility` path. A bare Goal without Demand is insufficient for that second query. [E3–E5]

**Confirmed inputs:** canonical user-day resolver; Preview Work and scheduled blocks (including generated manual-event blocks), unplaced liabilities, composition results, realized facts, accepted-unrealized claims, planning-window bounds, freshness and protected-authority state. Occupied/protected exclusions are unioned; accepted authority is liability before Realization and exclusion after it. Capacity itself never owns time. [E4]

**Confirmed boundaries:** The application adapter returns `noPreview`, `outsidePreview` or protected-authority unavailability rather than fabricating zero Capacity. Overlapping but incomplete coverage and stale dependencies remain qualified/nonallocatable in the core. The core can derive from supplied canonical schedule inputs without an object named Preview; today's store adapter cannot provide arbitrary uncovered Capacity automatically. Generating Preview does not itself query/render Capacity. [E4]

**Confirmed:** Feasibility distinguishes feasible, partially feasible, infeasible, structurally ineligible, conditional, unknown, stale and unavailable coverage. It explains insufficient total/contiguous duration, session constraints and support/buffer/resource failures. The production store passes the footprint resolver; an unspecified association yields unknown (`footprintUnspecified`). Therefore simply connecting Demand and Capacity is not sufficient if footprint intent remains unspecified. [E3–E5]

**Not Found:** any production Capacity display, direct Feasibility invocation/display, or Goal-specific diagnostic for either sufficient or insufficient room. The first outward boundary is the absence of UI callers/renderers for these store queries; only conditional acceptance revalidation reaches them indirectly. [E4–E7]

## 8. Competition / Allocation / Proposal Findings

**Confirmed:** `evaluateCompetingAllocation` is the application orchestration entry point for Capacity → current matching Demands → Projection → Feasibility → competing sets → all allocations. Lower-level commands also permit explicit sets. It is callable production code, not test-only code. Its actual store caller is Proposal acceptance revalidation; no normal planning button or automatic Goal-save/Preview-generation operation initiates it. [E5/E6]

**Confirmed:** `deriveProposal`/`deriveOrdinaryProposal` produce typed proposed/noProposal/invalid results; `recordProposal` persists only proposed results and rejects other statuses. Durable Proposal authority is separate from generation. Typed No-Proposal is a result, not a persisted proposal-history row, and no user-facing No-Proposal explanation was found. [E6]

**Confirmed:** Review only reads actionable Proposals. It renders a preferred/first option's acceptance control and whole-Proposal rejection, not full option modification UI. Acceptance revalidates current Allocation/Capacity and rejects stale/conflicting claims, then atomically records decision, terminal Proposal and Accepted Allocation. Rejection persists a decision without allocation authority. These are real production callbacks, but tests seed the Proposal prerequisite. [E6/E7]

**Not Found:** a separate mounted legacy “Planning Candidate” generation workflow. The existing canonical modification candidate is `createModificationCandidate` → explicit `modifyAndAcceptCandidate` inside `proposalSurface.ts:168–206`; it is distinct from initial Proposal generation and unexposed. Recurrence `BlockCandidate` in `generateBlockCandidates` is a Commitment scheduling input, not a constructive Goal Proposal. No UI-facing “Planning Candidate” should be assumed to name either object. [E6/E14]

**Confirmed reason for dogfood absence:** first no Demand authoring from Goal; subsequently no exposed footprint/Priority authoring or evaluation command; finally no UI orchestration to derive and durably record a Proposal. Opening a read-only review cannot fill these gaps. [E1–E7]

## 9. Accepted Allocation / Realization Findings

**Confirmed:** Successful acceptance commits allocation authority and then calls Realization through `onAcceptedAllocation` wired by `dayFrameStore`. Realization is an automatic attempt, not part of the same atomic transaction as acceptance. A failed attempt leaves accepted authority intact and unrealized; repeating `realizeAcceptedAllocation(id)` is deterministic/idempotent. Conflict, incomplete legacy allocation, invalid state and durable-write failure have explicit result paths. No production retry button was found. [E6/E8]

**Confirmed:** Realization atomically writes the realization record and all facts before exposing them in runtime. Goal work and real support activities have activity time semantics and eligible execution references; Buffer is protective nonactivity with prohibited execution. Facts retain allocation, claim, decision, Proposal/revision/option, Goal, Demand and footprint lineage. Neither allocation nor a displayed Proposal is scheduled ownership. [E8]

**Confirmed:** Preview generation consumes realized facts as fixed occupied authority, and publication includes their immutable provenance. Planning Review reads realized facts independently and renders Goal work/support/Buffer as distinct groups. Month mounts that panel, filtered to selected day. **Partial integration:** the ordinary Month cell/Selected Day evidence query indexes Work, Commitments, Events, Friction and unplaced candidates; it does not index `realizedScheduleFacts`. Thus Goal work can appear in the auxiliary canonical planning-review panel without appearing in the primary cell/agenda inventory. [E8/E9/E17/E19]

**Confirmed:** Published Goal work/support can become execution-reportable through Today; Buffer cannot. Accepted-unrealized liabilities are visible in Planning Review and Review readiness, but there is no ordinary creation path from a fresh Goal and no actionable recovery UI. Tests establish the lower-level realization/publication boundary, not a fresh-Goal UI traversal. [E7–E10]

## 10. Found Time Findings

**Not Found:** a complete canonical Found Time scheduled identity, creator, state command, production control, or conversion command. Source-wide searches for `Found Time`, `FoundTime`, `foundTime` found only `foundTimeProposalAcceptance` in `PlanningProvenanceV1` and its validator. That accepted-authority provenance option is insufficient evidence of an implemented manual-opportunity workflow. Primary classification: `PARTIAL_IMPLEMENTATION` for the named concept; creator/lifecycle: `NOT_FOUND`. [E11]

**Confirmed:** Manual Event identity has title, day, all-day/times, notes and timestamps; active setup adds incarnation identity. It contains no Goal ID and is authored through the singular Event form. However `GoalCommitmentSourceKind` includes `manualEvent`, and `GoalSection.commitmentOptions` enumerates every authored Event. Existing Event association is reachable from the Goal side; it changes Goal link authority without converting the Event's identity. [E1/E11]

**Confirmed Network+ trace:**

1. Add “Network+ Study Session”, 60 minutes → ordinary manual Event authority and Month display.
2. Title similarity to “Network+” creates no semantic link. Event form has no Goal selector.
3. Optional existing route: Planning settings → Network+ Goal → supporting commitment → Calendar event → select the study Event.
4. Generate/review/publish the relevant schedule → frozen historical Event occurrence, with Goal provenance if linked at publication.
5. Today can report eligible published current-day Event execution. An unpublished Event is not in Today's published-plan query.
6. Goal Activity history may aggregate the frozen linked occurrence/outcome. Measured Goal Progress remains unchanged because it reads manual observations, not Event duration or execution evidence.

Evidence: E1, E9–E13. **Inferred:** lack of publication and lack of association each explain the observed absence, but the exact dogfood persisted state was not available to prove which prerequisites failed for that Event.

**Confirmed:** Proposed work has explicit accepted-allocation provenance; ordinary manual Events retain manual-event provenance. **Not Found:** Found Time provenance attached to a scheduled/reportable manual identity, completion-to-Progress mapping, or Event-to-Found-Time conversion. Do not describe the existing Goal link as that conversion. [E8/E11/E13]

## 11. Execution / Progress Findings

| Scheduled identity / nonactivity | Canonical execution support | Production exposure / limitation |
|---|---|---|
| Work | C eligible durable planned occurrence | Today after publication. E9/E10/E12 |
| Commitment occurrence | C eligible | Same; completed/partial/skipped, correction/retraction. E10/E12 |
| Manual Event | C eligible | Same publication/current-day gate; no implicit report from calendar creation. E9–E12 |
| Realized Goal work | C eligible | Consumer exists; ordinary origin blocked upstream. E8–E10 |
| Realized support activity | C eligible | Same; not automatically Goal productive minutes. E8/E13 |
| Realized Buffer | C prohibited | Publication/read history may show protection; target materializer refuses execution. E8/E10 |
| Capacity/Demand/Allocation/Proposal | C not executable scheduled subjects | No execution identity from mere planning information/acceptance. E4–E8/E12 |
| Found Time | N complete identity/path | Cannot establish reportability of a missing identity from generic unplanned reporting. E11/E12 |
| Unplanned asserted activity | C execution domain supports it | No mounted generic logging UI found. E12 |

**Confirmed:** `recordExecution`, correction and retraction are general evidence operations, not current-date-only commands. Historical snapshots/references survive source changes and Preview regeneration. IndexedDB-backed history is separate from disposable Preview; tests verify restart and authority isolation. Execution actual duration is user-asserted, not auto-filled from scheduled duration as historical fact. [E12]

**Confirmed:** Today is mounted with only an evaluation instant, derives the current canonical day, reads its publication, and exposes outcomes there. It limits product navigation, not the underlying report command. `HistoricalPlanReportingSection` has an arbitrary past-date input and materializes frozen targets, but no production module imports/mounts it. `ExecutionHistoryPanel` is likewise not mounted. Consequently retrospective reporting for arbitrary past dates is `IMPLEMENTED_DISCONNECTED`, despite passing component tests. [E10/E12]

**Confirmed distinctions:** schedule truth describes authorized/planned time; execution records describe user-reported outcomes and optional actual time; Progress observations describe externally asserted absolute measurement values bound to measurement-definition epochs; cumulative Goal measurement is the projection of the latest applicable observation against its target. Goal Activity's outcome counts/linked-history coverage are a separate historical read model. None rewrites the others. [E8–E13]

**Confirmed:** `Record New Value` means a new absolute/cumulative observation, not “add this session's minutes.” Current quantity Progress requires those manual measurements. **Not Found:** an execution-duration-to-Progress evidence policy or integration. Implementing one requires explicit treatment of corrections, retractions, units, Goal attribution, support versus productive time and double counting; it is not safe to wire schedule duration directly into observations. [E13]

## 12. Review / Publication Findings

**Confirmed production path:** Planner mode Review Schedule → `ScheduleReviewPanel` → `onPublish={activeStore.publishScheduleRange}` → `publishScheduleRangeV1` → `materializePlanPublication` → `historicalPlan.publishAtomically` → immutable historical days → Today and Summary. Review range currently comes from the generated/saved Preview range; the nearby “Review one user-day” date input filters PreviewScreen, not ScheduleReviewPanel's publication range. The publish label explicitly displays the actual whole range with exclusive end. This mismatch of contexts is a discoverability/presentation issue, not proof of an unauthorized publication. [E7/E9; `DayFrameApp.tsx:2649–2702`]

**Confirmed prerequisites:** valid bounded publication range, complete planning-data coverage, available/current/covering Preview, no unresolved Friction, no accepted-unrealized liabilities, matching reviewed-source fingerprint and durable atomic persistence. Actionable Proposals are not themselves blockers (`code/src/state/schedulePublication.test.ts:102` — “does not treat an actionable Proposal as a blocker”). Review can generate/refresh Preview; individual fixes and authored changes address Friction. Unrealized accepted recovery lacks a UI command. [E8/E9/E15]

**Confirmed:** Duplicate unchanged publication no-ops; changed truth appends immutable history; failed atomic publication does not appear as published; restart restores the ledger. Preview generation itself does not publish. This distinction is also covered by `historicalPlanSurface.test.ts:94`. [E9]

**Confirmed:** “No published plan is available for this user-day” is an accurate Today query result when no publication exists for the resolved day/cutoff. Opening Planner from this empty state does not directly route to Publish; it opens Month. **Inferred:** that indirect entry and the Review blockers explain poor discovery, but absence of a publication in the dogfood session is not independently verifiable without its storage snapshot. Publication is reachable without a Goal or Proposal. [E9/E10]

## 13. Friction / SuggestedFix Findings

**Confirmed:** Generation runs Friction detection and SuggestedFix derivation. PreviewScreen exposes per-occurrence fixes; applying a supported choice revises disposable Preview first, then a separate explicit acceptance records PlanDecision and regeneration replays it. Fixed-time changes route to authored setup editing. This is corrective authority, separate from ProposalDecision. [E14/E15]

**Confirmed defect:** Resolve schedule conflicts does not invoke a resolution command or select a Friction record. Its sole handler attempts focus on `preview-heading`; no production node has that ID. Optional chaining makes the missing target a silent no-op. A callback-only panel test does not catch the shell integration error. Primary `EXPOSED_INCORRECT`, not evidence that the downstream corrective engine is absent. [E16]

**Confirmed:** Repeated patterns are grouped by severity/title/message/suggested actions; each expanded occurrence still has an individual fix. **Not Found:** a canonical atomic apply-to-similar batch command/UI. `acceptCompositeDecision` exists for commitment composition, but no production UI invokes it; it is not synonymous with arbitrary bulk Friction resolution. [E15]

**Confirmed:** The inspected controls do not silently create accepted Goal allocation authority. Preview revisions are user-initiated and durable corrective acceptance is explicit. Fix support is limited to implemented actions; a grouped list does not prove every desired conflict has a suggested resolution. [E15]

## 14. Work-Relative Placement Correctness Findings

**Confirmed trace:** authored preferred window → recurrence candidate carries window/duration/buffers/user-day → generator expands boundary context and generates actual dated Work intervals → candidate resolves canonical user-day window → first/last Work is selected by matching `userDayDate` and actual start/end sort → `getPlacementSearchWindow` → occupied-window subtraction → buffered opening search → scheduled/unplaced result → Friction. Production generator supplies both visible-window fields, which makes Work part of occupied windows. The low-level placer without those fields has different occupancy behavior and must not be substituted for the production path. [E14]

**Confirmed date semantics:** overnight Work holds actual next-date end instants, not a same-day end clock. Work ownership is resolved from start instant into canonical user-day. BeforeWork uses first matching Work's actual start, clipped upward to the candidate placement boundary; its search extends 24 hours backward. AfterWork uses last matching Work's actual end and may extend past the canonical day, clipped at visible planning end. These are actual Date computations; no confirmed date-string conversion error was found for the supplied shift. [E14]

**Confirmed defect boundary:** in `placeBlockCandidates.ts:502–512`, when Work ends beyond `placementBounds.end`, the constructed `unclippedWindowEnd` is `workEnd + duration + bufferAfter`. `findBestAvailableStart:587–596` requires `windowStart + bufferBefore` through `windowEnd - duration - bufferAfter`. With positive before-buffer, latest feasible start becomes workEnd while earliest becomes workEnd+bufferBefore. A free post-shift opening is therefore rejected. The extension must account for the full required footprint; this audit makes no repair. Final visible-range clipping and real collisions remain independent valid reasons to reject placement.

### Required scenario matrix

| Work shape | Preferred window | Expected | Dogfood observation | Existing test? | Audit classification |
|---|---|---|---|---|---|
| Day 09:00–17:00 | beforeWork | Before Work or unplaced | Task says inside Work; PDF #1 says day appeared correct | Placer test :119; buffered Sleep test :162; not exact full dogfood scenario | C experiment 07:30–08:30, no Friction; WORKING_AS_INTENDED in audited case. N explanation of reported overlap; UNRESOLVED report |
| Night 21:45–06:15 | beforeWork | Before Work or unplaced | Overlap/unplaced | Engine night Sleep :1359 and edge buffered Sleep :1436; not exact Workout fixture | C experiment 20:15–21:15, no Friction; WORKING_AS_INTENDED in audited case. Report remains unresolved |
| Day 09:00–17:00 | afterWork | After Work or unplaced | Functional | Placer :207 and buffered errands :248 | C experiment 17:30–18:30; WORKING_AS_INTENDED |
| Night 21:45–06:15 | afterWork | 06:45–07:45 if free, full buffers | Task says all tested nights unplaced; PDF #3 asks regression coverage | Overnight placer :294 has no buffers; not exact failing case | C all three Workout candidates unplaced; EXPOSED_INCORRECT; missing before-buffer extension |
| Night 21:45–06:15 | anyAvailable | Any valid free opening | Works | Existing general flexible placement coverage; no exact complete dogfood fixture located | C experiment succeeds all three days; WORKING_AS_INTENDED control |

Existing test paths/names are in E14. **Confirmed coverage limitation:** passing night afterWork test uses zero before-buffer, so it does not refute the confirmed buffered failure. Existing beforeWork/Sleep tests do refute a blanket claim that all beforeWork placement fails, but do not reproduce the full user's saved setup.

### Reproducible audit experiment record

**Confirmed:** Inline Node 22.23.2 imported the current `generateSchedulePreview` source using a resolve hook from `.js` imports to corresponding `.ts`; no source/test files were generated or edited. Local dates used America/Chicago (output CDT, UTC−05). Input:

- Fixed-segment cycle May 1–31, 2026, one shift definition, Work Monday–Friday.
- Compare day 09:00–17:00 to night 21:45–06:15 with `crossesMidnight=true` for night.
- One enabled flexible fitness Workout, 60 minutes, bufferBefore=30, bufferAfter=30, priority=3, `autoSameUserWeek`, no resources; M/W/F recurrence.
- Preview May 4 03:00 to May 9 03:00; day boundary 03:00, week start Monday; generatedAt May 1 00:00Z.
- Only preferred window and Work shape varied. No Sleep, manual Events or accepted decisions in this minimal isolating input.

Results: day before 07:30, day after 17:30, day any 03:30 on May 4/6/8; night before 20:15 on those dates; night after zero placements/three unplaced; night any May 4 03:30 and May 6/8 06:45. Each placed activity lasted 60 minutes; successful cases returned zero Friction. This is a bounded production-function experiment, not a new regression test or an exact dogfood replay.

**Inferred:** Any available succeeds because it uses the full canonical-day bounds and subtracts actual Work occupancy, avoiding the truncated post-Work extension. **Not Found:** exact saved Work-cycle overrides, template placement type, accepted corrections or Sleep interactions that caused the beforeWork report. Follow-up needs the authored snapshot and precise displayed instants, with transition/custom-boundary and no-opening cases. Do not repair beforeWork on the assumption it shares afterWork's proven defect. [E14]

## 15. Planning Range / Continuous Calendar Dependency Findings

| Owner/input | Confirmed current dependency | Classification / implication |
|---|---|---|
| Planning Data Horizon | Canonical bounded operation context, boundary expansion and required realized context; stored in Preview scope metadata | C core scope support, E19. Not calendar navigation authority |
| Preview Range | Saved inclusive dates translated to canonical half-open range; generated schedule is disposable | C E17/E19. Fixed initial May 4–6, 2026 is legacy UI/setup default |
| Review Scope | Independent day/week/month/custom canonical range, navigation-created | C E19. Reading does not accept or publish |
| Publication Range | Explicit bounded range verified against complete fresh schedule/authority | C E9/E19. Must remain explicit even with rolling computation |
| Proposal Horizon | Bounded constructive offer/acceptance scope, distinct from footprint context | C E6/E19. Not Publication Range |
| Month | Local displayed month/selected date + canonical day resolver; nullable Preview | C E17. Arbitrary navigation already works |
| Manual Events | Authored setup collection; Month reads it independently | C E11/E17. Can be created/displayed outside generated coverage |
| Generated Work/Commitments | Bounded generator and authored cycles/templates/recurrences | C E14/E19. Coverage is necessary for asserting generated truth |
| Goal planning | Bounded Demand/Capacity/footprint horizons; current store adapter depends on Preview | C E3–E6. Navigation alone cannot assert feasibility |
| Execution history | Independent durable records and historical targets | C E12. Queries do not require current Preview |
| Summary | Historical publication/execution queries + independent Goal progress queries | C E12/E13/E19. Can inspect evidence outside current planning coverage |

**Confirmed:** “Not generated” is meaningful for unknown generated Work/Commitment coverage; it must not be interpreted as an empty schedule, zero available Capacity, or a ban on calendar navigation/manual Events. The current Month already implements this separation in part. The production generation command still requires shift cycles (`dayFrameStore.ts:2992–2995`); ordinary publication still requires generated Preview, so logging-only execution for a fresh uncovered manual Event is not a completed product path. [E9/E12/E17/E19]

**Inferred:** A rolling internal planning horizon can coexist with arbitrary navigation without changing canonical user-day, immutable publication or explicit acceptance semantics. It requires application policy and query integration; it is not already implemented by Month's navigation controls. [E4/E9/E17/E19]

**Confirmed:** The compact Preview navigator owns selection/range filtering, friction markers and restoration of full Preview range (`DayFrameApp.tsx:1981` onward; tests :1650, :1737). Month owns date navigation but is not a drop-in replacement for every existing multi-day filter interaction. **Inferred:** retire the giant button list after deliberately preserving those interactions where needed; it owns no distinct domain authority. [E17–E19]

**Confirmed:** A static holiday provider and Preview annotations already exist. **Not Found:** external calendar ingestion and a continuous Month holiday feed. Future work must distinguish extending this existing local fact source from building external import architecture. [E20]

## 16. Current UI Generation / Legacy Surface Inventory

These classifications describe implementation responsibilities, not an inference from component age. Treatment recommendations appear in §21.

| Surface | Current generation classification | Evidence and ownership |
|---|---|---|
| Planner shell | C current product surface | Three app peers plus four Planner modes; app owns shared draft/state. E18 |
| Month | C current surface backed by newer canonical-day query | Independent month selection, authored Event and Preview evidence. E17 |
| Selected DayFrame Day | C current surface, partial duplicate of Today/review | Calendar/contextual authoring; no execution controls. E17/E19 |
| Canonical Planning Review | C transitional adapter / development-oriented presentation | Typed authority classes rendered as “truth”, coverage, accepted liabilities and Proposals; real unique consumers. E8/E19 |
| Commitment Library | C current surface over canonical authored inventory | Shared SetupScreen authoring rather than copied domain store. E18 |
| Work Pattern | C current surface over canonical Work inputs | Shared shift definitions/cycles/preferences; both cycle modes valid. E18 |
| Review Schedule | C current newer publication/decision controls plus legacy Preview workflow | ScheduleReviewPanel and PreviewScreen composed together. E7/E9/E15 |
| Today | C current surface backed by published-history/execution model | Current canonical-day outcomes; no unique authority store. E10/E12 |
| Summary | C current historical read surface | Durable plan/execution and Goal measurements, interactive detail lists. E13/E19 |
| Goal editor | C canonical editor behind transitional navigation | Only mounted inside Month planningSettings context. E1 |
| Event editor | C shared canonical authoring workflow | Used by Month and Review; no Goal-side selection in this form. E11/E18 |
| Planning Settings / Range | C transitional combined setup UI | Goals, preferences/range and Save Setup combined; bounded computation exposed. E1/E19 |
| Compact Preview navigator | C legacy/duplicated temporal presentation | Every generated date rendered; app-owned selection/range filters. E17–E19 |
| Friction individual controls | C working canonical corrective adapter | Existing fix/application/acceptance chain. E15 |
| Resolve aggregate button | C exposed incorrect integration | No matching focus target. E16 |
| Historical reporting components | C disconnected components, not a production surface | Test render is not shell mount. E12 |

**Confirmed authoring detail:** contextual Commitment routing resolves exact template/recurrence incarnation into one bounded `CommitmentSection` editor. That editor exposes duration in minutes and raw preferred-window strings, with weekday checkboxes. Placement type, buffers, priority, custom-window and other advanced fields remain in `SetupScreen`'s Advanced Commitment Fields section, which maps every template rather than the selected source. Thus the dogfood request for one complete contextual editor is supported even though exact-identity navigation works. The advanced duration editor already splits hours/minutes, but clamps minutes at 0–59 rather than carrying/borrowing. Both presentations edit canonical `durationMinutes`; do not build a second duration model. [E18]

**Confirmed Sleep semantics:** beforeSleep targets the canonical day-end, not an independently authored Sleep occurrence; afterWaking uses the placement start, not an inferred waking event. beforeWork targets Work and has a special deferred Sleep off-day propagation path from neighboring Work-day anchors. The bounded editor shows raw beforeSleep while advanced fields label it Before day boundary. New setup does not auto-add Sleep, and legacy Sleep priority 1 sorts ahead of higher numeric values. Baseline Sleep policy is separate product design; no evidence here justifies treating it as optional simply from its numeric priority. [E14/E18/E20]

## 17. Architectural Language Leakage Inventory

All quoted terms below are **Confirmed** current strings or raw labels; treatment is **Inferred**, with authority meaning preserved.

| Term | Origin / evidence | Semantics and translation/removal candidate |
|---|---|---|
| Selected-day planning truth | `PlanningReviewPanel.tsx:63` | Internal epistemic language; future day-plan heading can retain distinction between known and unknown without “truth”. |
| Canonical planning review | `PlanningReviewPanel.tsx:61` | Canonicality is developer terminology; consolidate panel while retaining its unique realized/accepted/proposed data. |
| template | `HistoricalIntelligenceSummary.tsx:524,543,619`; `GoalSection.tsx:529` | Raw source family visible in history/selector. Preserve provenance internally; ordinary completion label need not use type name. |
| generated | `MonthlyPlannerSurface.tsx:620`; `DayFrameApp.tsx:1913–1918` | Sometimes useful to distinguish current computed coverage from authored Events; engine-origin grouping should not obscure activity identity. |
| Scheduling realization | `HistoricalIntelligenceSummary.tsx:314–315` | Here means historical scheduled/unplaced/omitted/blocked distribution, not only accepted-allocation Realization. Keep meaning, clarify terminology. |
| Planning range / Preview | `DayFrameApp.tsx:2640–2644`; `ScheduleReviewPanel.tsx:204–206` | Bounded computation/freshness matters, but raw implementation names and repeated coverage warnings can move behind context. |
| Accepted awaiting realization | `ScheduleReviewPanel.tsx:167`; `plannerReviewPresentation.ts:98–105` | Critical distinction: accepted resource intent is not scheduled. Translate, do not remove the blocked state. |
| Proposal does not own schedule time | `ScheduleReviewPanel.tsx:253–256` | Correct authority explanation, too architectural for primary activity presentation. Keep explicit accept/reject and optional explanation. |
| exclusive end date | `ScheduleReviewPanel.tsx:140–145,223`; `PlanningReviewPanel.tsx:66` | Range policy leaks into normal copy. Any future inclusive display must preserve actual half-open boundary semantics. |
| beforeSleep / afterWaking / anyAvailable | `CommitmentSection.tsx:483–508`; `SetupScreen.tsx:2967–2976` | Raw enum labels in the bounded editor contrast with human labels in advanced fields. Translate consistently with actual boundary/anchor semantics. |
| Friction / Unplaced / Proposal | `PreviewScreen.tsx`, `ScheduleReviewPanel.tsx` | Potentially intentional product vocabulary. “Unplaced” conveys an actionable state; no automatic recommendation to remove these terms. |
| Structural Work / authored intent / source family | `DayFrameApp.tsx:1915`, `GoalSection.tsx:198`, history labels | May aid advanced explanation but should not be required navigation vocabulary. |

## 18. Navigation / Day Worksurface Findings

**Confirmed:** Month/Selected Day use `queryMonthlyPlannerFromState` → `queryMonthlyPlanner`, combining authored Events and current Preview with canonical day windows. The adjacent PlanningReviewPanel separately uses `queryPlanningReview`, including realized facts, accepted liabilities, Proposals and historical publication coverage. Today uses `queryToday` and `buildTodayReadModel`, obtaining immutable publication and execution at an explicit knowledge cutoff for the canonical current day. Summary uses date-bounded historical projections, not the Month query. [E8–E10/E17/E19]

**Confirmed:** They share canonical day identity but do not read interchangeable truth. Today adds report/change/remove outcome controls, publication semantics, cutoff advancement, recovery/loading states and subscriptions. Selected Day adds contextual Event/Commitment/Work authoring and live/unknown schedule coverage. Canonical Planning Review has constructive authority classes absent from the ordinary Selected Day inventory. [E10/E17/E19]

**Inferred:** A reusable Day Worksurface can unify navigation and presentation without merging published historical truth with current schedule truth. It must preserve exact occurrence identities, optional actual-time assertions, source-incarnation navigation, protected storage handling, frozen provenance, explicit publication/acceptance, and dirty draft behavior. Today can become a shortcut, but its current-only query cannot simply be relabeled as a general historical day query. [E1/E8–E12/E18]

**Confirmed:** Month supports click/keyboard selection and previous/next month actions; accessible labels already say “Previous month”/“Next month” although visible text is shorter. A new open-day/double-click workflow is product evolution, not a missing date-navigation domain command. Summary category buttons already drill into inline evidence; richer drill-down is presentation work. [E17/E19]

## 19. My Schedule Hierarchy Feasibility

**Confirmed:** Work Pattern authors shift definitions, dated cycles/segments or repeating sequence entries, and schedule preferences through the shared app-owned setup draft/commit path. Commitment Library authors templates and recurrences through that same setup authority. Neither owns canonical month navigation, execution history, Goal identity or Proposal authority. Both feed schedule generation, so shared draft validity/save and Preview staleness must remain visible. [E14/E18]

**Confirmed:** Both already have contextual entry points from Month and shared dedicated Planner destinations. Their extraction tests demonstrate reuse of canonical editors without duplicating stores. Neither requires Preview to author its own setup, although generated occurrences provide contextual exact-identity entry points. [E18]

**Inferred:** My Schedule can group these peers without domain redesign. Both existing cycle authoring modes have production generator branches; do not delete one merely because two are visible. Goal authoring can remain an independent authority/editor with a global Planner entry. Creating that hierarchy is migration/product design, not a prerequisite for calculating Capacity. [E1/E14/E18]

## 20. Dogfood Finding Disposition Matrix

Every numbered PDF finding is included. C/I/N follow §2; a deferred disposition can include a confirmed current fact. Observations are preserved where they conflict with current code. References point to the evidence register and detailed sections.

| PDF # / finding | Disposition | Evidence / qualification |
|---|---|---|
| 1 Overnight beforeWork incorrect | UNRESOLVED | C minimal production case succeeds; N exact dogfood overlap reproduction. PDF says day correct, brief says day incorrect. E14/§14 |
| 2 Any available control | WORKING_AS_INTENDED | C audit control succeeds with same buffers/recurrence. E14/§14 |
| 3 afterWork overnight coverage | CONFIRMED_CORRECTNESS_DEFECT | C positive-before-buffer extension defect reproduced; existing overnight test lacks buffer. E14/§14 |
| 4 Friction downstream works | WORKING_AS_INTENDED | C detector and visible suggested fixes operational. E14/E15 |
| 5 Long rotations impractical | DEFERRED_PRODUCT_EVOLUTION | C sequence add/remove days exists; I bulk block construction improvement. E18 |
| 6 Two Work generations | CONFIRMED_PRESENTATION_DEFECT | C two authoring modes; both canonical generator branches, not proven duplicate authorities. E14/E18 |
| 7 Day boundary near Work | DEFERRED_PRODUCT_EVOLUTION | C preference/overrides exist; I contextual organization. E14/E18 |
| 8 Week start per cycle | DEFERRED_PRODUCT_EVOLUTION | C effective preference semantics exist; I clearer exposure. E17/E18 |
| 9 Cycle-transition visualization | DEFERRED_PRODUCT_EVOLUTION | C fixed month columns and transition metadata already exist; richer marker design deferred. E17 |
| 10 Sleep baseline | DEFERRED_PRODUCT_EVOLUTION | C new setup starts empty; legacy default normalization exists. E20 |
| 11 Sleep placement labels | CONFIRMED_PRESENTATION_DEFECT | C beforeSleep means day-end; advanced label says Before day boundary while bounded editor shows raw beforeSleep. beforeWork is separate. E14/E18/E20 |
| 12 Sleep priority | DEFERRED_PRODUCT_EVOLUTION | C numeric lower-priority ordering, default legacy Sleep 1; no confirmed authority defect from label alone. E14/E20 |
| 13 Human duration authoring | CONFIRMED_PRESENTATION_DEFECT | C bounded Commitment editor is minutes-only; advanced fields have hours + minutes. Different UI generations explain the observation; no duration-domain gap. E18 |
| 14 Duration carry/borrow | DEFERRED_PRODUCT_EVOLUTION | C minutes clamp 0–59 instead of carry/borrow; I interaction improvement. E18 |
| 15 Recurrence controls | DEFERRED_PRODUCT_EVOLUTION | C recurrence fields/weekday selection generate candidates; redesign is UX. E14/E18 |
| 16 Contextual Commitment editor | CONFIRMED_PRESENTATION_DEFECT | C exact bounded editor exists, but complete advanced fields enumerate every template. Correct identity routing does not supply a complete isolated editor. E18 |
| 17 Buried Goals | CONFIRMED_PRESENTATION_DEFECT | C one mount under Month Planning settings; no global destination. E1 |
| 18 Decomposition | CONFIRMED_REACHABILITY_GAP | C Structure/milestone commands unexposed. E2 |
| 19 Goal effort minutes-only | CONFIRMED_REACHABILITY_GAP | C actual Demand not exposed; visible minutes target is measurement, not effort. E3/E13 |
| 20 Ongoing Goals | WORKING_AS_INTENDED | C optional target date allows active undated Goal; explicit recurring-demand semantics still deferred. E1/E3 |
| 21 Recurring Goals | DEFERRED_PRODUCT_EVOLUTION | N rolling recurring Demand lifecycle; bounded total/sessionCount is not recurrence. E3 |
| 22 Manual Commitment attachment | CONFIRMED_INTEGRATION_GAP | C links reachable; constructive chain not initiated. E1/E3–E7 |
| 23 No Candidate/Proposal | CONFIRMED_INTEGRATION_GAP | C first Demand gap plus no generation/record orchestration. E3–E7 |
| 24 Capacity invisible | CONFIRMED_REACHABILITY_GAP | C canonical query exists without UI/render. E4 |
| 25 Goal constructive lifecycle unproven | CONFIRMED_INTEGRATION_GAP | C upstream gaps; downstream acceptance/realization present. E3–E8 |
| 26 Plan vocabulary overloaded | CONFIRMED_PRESENTATION_DEFECT | C multiple authority classes surfaced with internal language. E9/E19/§17 |
| 27 Resolve conflicts nonfunctional | CONFIRMED_CORRECTNESS_DEFECT | C handler targets absent DOM ID. E16 |
| 28 Repeated Friction bulk resolution | DEFERRED_PRODUCT_EVOLUTION | C grouping and individual fixes work; N atomic bulk command/UI. E15 |
| 29 Manual Goal activity as Found Time | DEFERRED_PRODUCT_EVOLUTION | N completed Found Time creator; provenance discriminator alone insufficient. E11/§10 |
| 30 Proposed work versus Found Time origins | WORKING_AS_INTENDED | C accepted-allocation/manual identities distinct; N full Found Time identity. E8/E11 |
| 31 Event Goal association | CONFIRMED_PRESENTATION_DEFECT | C association reachable from Goal detail, absent in Event form. E1/E11 |
| 32 Event absent from Today/Progress | CONFIRMED_INTEGRATION_GAP | C Today requires publication; measured Progress has no execution bridge. Exact session prerequisite failure I. E9–E13 |
| 33 Cumulative manual value | DEFERRED_PRODUCT_EVOLUTION | C current manual absolute-value semantics intentional; execution-derived Progress requires defined policy. E13 |
| 34 Outcomes persist restart | WORKING_AS_INTENDED | C independent durable execution history. E12 |
| 35 Deterministic regeneration | WORKING_AS_INTENDED | C authored authority feeds generator, Preview disposable. E14/E19 |
| 36 Change/remove outcome | WORKING_AS_INTENDED | C Today append-only corrections/retractions. E10/E12 |
| 37 After-the-fact reporting | CONFIRMED_REACHABILITY_GAP | C historical component/commands exist, no shell mount. E12 |
| 38 Summary aggregation | WORKING_AS_INTENDED | C historical projections and detail UI. E12/E19 |
| 39 Realization boxes look static | CONFIRMED_PRESENTATION_DEFECT | C actual button controls with expand state; I styling/discovery issue corroborated by dogfood. E19 |
| 40 Expanded lists do not scale | DEFERRED_PRODUCT_EVOLUTION | C inline evidence.map list; I progressive disclosure. E19 |
| 41 Summary default range | DEFERRED_PRODUCT_EVOLUTION | C civil today minus six days, not canonical user-week. E19 |
| 42 Empty attention noise | DEFERRED_PRODUCT_EVOLUTION | C Today hides absent attention; other empty-state copy exists. N blanket correctness failure. E10/E19 |
| 43 Plan History absence | WORKING_AS_INTENDED | C missing publication represented explicitly; I explains observed empty history. E9/E10/E19 |
| 44 Today publication distinction | WORKING_AS_INTENDED | C consumes historical plan; weak guidance is secondary presentation defect. E9/E10 |
| 45 Canonical-day orientation | DEFERRED_PRODUCT_EVOLUTION | C query uses canonical resolver; I clearer displayed orientation. E10/E17 |
| 46 Today in Planner | DEFERRED_PRODUCT_EVOLUTION | I feasible consolidation with query/authority distinctions preserved. §18 |
| 47 Direct Month-to-Day interaction | DEFERRED_PRODUCT_EVOLUTION | C selection + keyboard exists; new Day opening interaction not implemented. E17 |
| 48 Previous/Next labels | CONFIRMED_PRESENTATION_DEFECT | C visible short labels; accessible month-qualified labels already present. E17 |
| 49 Month without generation | WORKING_AS_INTENDED | C arbitrary month and manual Event view already work; generated knowledge still unknown. E17 |
| 50 Rolling/live calendar | DEFERRED_PRODUCT_EVOLUTION | I compatible with bounded computation; no rolling orchestration. §15 |
| 51 Logging-only use | CONFIRMED_INTEGRATION_GAP | C manual Events/calendar independent; general reporting unmounted and Today publication-gated. E11/E12/E17 |
| 52 Holidays/external facts | DEFERRED_PRODUCT_EVOLUTION | C static holiday provider/Preview exists; N external ingestion/Month feed. E20 |
| 53 Range near Work | DEFERRED_PRODUCT_EVOLUTION | C distinct shared setup concerns; I rearrangement. E18/E19 |
| 54 Three-day default | CONFIRMED_LEGACY_UI | C fixed May 4–6, 2026 default. E17 |
| 55 Huge Preview navigator | CONFIRMED_LEGACY_UI | C generated-date list duplicates temporal navigation; preserve filters during migration. §15/E18 |
| 56 Range warnings | CONFIRMED_PRESENTATION_DEFECT | C app warnings and review coverage coexist; I clearer/actionable consolidation. E19 |
| 57 Selected-day truth | CONFIRMED_PRESENTATION_DEFECT | C literal string. §17 |
| 58 Canonical Planning Review | CONFIRMED_LEGACY_UI | C transitional class/coverage panel; preserve unique consumers on migration. E19 |
| 59 template in history | CONFIRMED_PRESENTATION_DEFECT | C raw source family label. E19/§17 |
| 60 generated grouping | CONFIRMED_PRESENTATION_DEFECT | C engine/provenance copy; preserve actual coverage semantics. §17 |
| 61 Vocabulary audit | DEFERRED_PRODUCT_EVOLUTION | C inventory supplied; I future copy design, Friction need not be removed. §17 |
| 62 Two primary surfaces | DEFERRED_PRODUCT_EVOLUTION | I architecture supports shell consolidation. §18 |
| 63 Too many peer destinations | CONFIRMED_LEGACY_UI | C shell/mode/context entry overlap; no duplicate domain authority implied. E18 |
| 64 Work/Commitment peers | DEFERRED_PRODUCT_EVOLUTION | C separate authored inputs/shared generation; I hierarchy. §19 |
| 65 My Schedule | DEFERRED_PRODUCT_EVOLUTION | I supported organizational option; not implemented. §19 |
| 66 Global Goals | CONFIRMED_REACHABILITY_GAP | C no global entry despite canonical independent editor. E1 |
| 67 Tasks vocabulary | DEFERRED_PRODUCT_EVOLUTION | I naming option, not domain merger. E1/E3/E14 |
| 68 Selected Day/Today duplicate | CONFIRMED_LEGACY_UI | C overlapping day presentation with distinct live/published inputs. E10/E17 |
| 69 Planning Review into day | DEFERRED_PRODUCT_EVOLUTION | I feasible; preserve realized/accepted/proposed classes. E8/E19 |
| 70 Empty panels hide | DEFERRED_PRODUCT_EVOLUTION | C some already conditional; I density policy. E10/E19 |
| 71 Progressive disclosure | DEFERRED_PRODUCT_EVOLUTION | C lists expand inline; I redesign. E19 |
| 72 Authored setup persists | WORKING_AS_INTENDED | C active setup/store persistence, UI durability tests. E18/E20 |
| 73 Deterministic Commitments | WORKING_AS_INTENDED | C pure generation/replay, existing suite. E14/E15 |
| 74 Execution persists | WORKING_AS_INTENDED | C independent records/restart tests. E12 |
| 75 Historical aggregation | WORKING_AS_INTENDED | C Summary queries history; coverage gaps explicit. E12/E19 |
| 76 Friction incompatibility | WORKING_AS_INTENDED | C detection operational; must not substitute for placement repair. E14/E15 |
| 77 Independent manual Events | WORKING_AS_INTENDED | C current authored input independent from Preview. E11/E17 |
| 78 Month product center | DEFERRED_PRODUCT_EVOLUTION | I dogfood preference supported by existing navigation/contextual architecture. E17/E18 |

## 21. Legacy-vs-Canonical UI Matrix

Current responsibilities/evidence are **Confirmed**; all treatment selections are **Inferred** audit recommendations.

| UI surface / component | Current responsibility | Underlying architecture | Product-reachable capability | Duplicate of | Legacy/transitional evidence | Recommended treatment category |
|---|---|---|---|---|---|---|
| Month | Navigate/select dates, contextual edits | Canonical-day Month query + authored/Preview inputs | Arbitrary dates, Event/Commitment/Work entry | Compact temporal navigator | Independent query already exists; E17 | Preserve |
| Selected DayFrame Day | Show/edit selected-day schedule inputs | Month evidence model | Add/Edit Event/Commitment, Work entry | Part of Today/day review | No execution; auxiliary panel holds new fact classes; E17/E19 | Consolidate |
| Canonical Planning Review | Expose realized/proposed/accepted/coverage classes | PlanningScopeQuery | Read newer authority when present | Partial selected-day schedule | Raw epistemic classes/language; E8/E19 | Migrate |
| Today | Published current day + outcomes | Today/history/execution | Report/change/remove | Partial Selected Day | Separate route for same day concept, different truth; E10 | Consolidate |
| Commitment Library | Complete authored template/recurrence inventory | Shared Setup draft | Create/edit Commitments | Contextual same editor | Reuse demonstrated, not replacement authority; E18 | Preserve |
| Work Pattern | Shift definitions/cycles/preferences | Shared Setup draft | Work authoring | Contextual same editor | Both modes have real generator branches; E14/E18 | Preserve |
| Review Schedule | Preview, corrective decisions, Proposal decisions, Publish | Canonical commands + PreviewScreen | Real review/publication | Some planning-review information | Combined legacy Preview/new controls; E7/E9/E15 | Migrate |
| Goal editor | Goal identity/lifecycle/links/measurement | Independent Goal surfaces | Goal authoring | None | Single buried mount; no Demand/Structure controls; E1 | Expose |
| Event editor | Authored Event CRUD | Active manual-event authority | Event inside/outside coverage | Shared Month/Review entry | No Goal selector but reverse link exists; E11 | Preserve |
| Planning Range controls | Select bounded generation range | Saved range, scope adapters | Explicit range/save | Review scope concepts in presentation only | Fixed default + repeated warnings; E17/E19 | Migrate |
| Preview day navigator | Generated-day/range filtering | Local app view state | Select range, restore full view | Month temporal navigation | Linear date-button expansion; E18 | Retire |
| Summary | Historical distributions, Goal activity/progress | Durable queries | Counts and evidence detail | None at domain level | Internal source labels, long inline lists; E13/E19 | Preserve |
| Resolve Schedule Conflicts | Intended Friction entry | Broken app focus callback | No useful action | Individual fixes already work | Nonexistent target; E16 | Repair Before Migration |
| Historical reporting components | Arbitrary historical targets/outcomes | Existing execution/history commands | Not mounted | Generalization of Today controls | Component tests only; E12 | Connect |
| My Schedule | Proposed grouping | Existing independent setup inputs | Not implemented | Current Planner peer links | Organizational decision only; E18 | Requires Design Decision |

## 22. Architectural Invariants Assessment

**Confirmed violations reported prominently:** the buffered `afterWork` defect violates placement completeness when a valid free full footprint exists. The Resolve control violates its promised interaction. **Not Found:** a confirmed authority/time-ownership invariant violation in the audited ordinary production paths. A no-op or unplaced candidate is not itself proof of unauthorized time ownership. The unresolved beforeWork dogfood report would warrant reassessment if an actual overlapping current-generation case is supplied. [E14/E16]

| Invariant | Assessment |
|---|---|
| Authored authority outranks derived state | C preserved in save/generate/replay separation and stale Preview handling. E14/E15/E18/E19. Legacy untouched-Sleep normalization is an explicit compatibility exception, below. |
| Proposal creates no planning authority | C Proposal derivation/recording separate from acceptance. E6 |
| Only explicit ProposalDecision acceptance creates Accepted Allocation | C acceptance transaction; rejection does not allocate. E6/E7 |
| Accepted Allocation does not own schedule time; Realization does | C accepted liabilities versus realized facts explicitly separated. E4/E8 |
| Published Plan explicit and immutable | C explicit Publish command + atomic append/no-op history. E9 |
| Execution does not rewrite schedule truth | C independent append-only history; Preview unchanged. E10/E12 |
| Progress does not rewrite execution truth | C measurement query/writes have no execution dependency. E13 |
| Learned/derived data does not silently become authored authority | C inspected derived queries do not perform authoring; no learned-authority promotion found. E3–E7/E19 |
| Work owns time | C generated dated Work excludes placement/Capacity. E4/E14 |
| Scheduled Commitments own time | C scheduled blocks and composition inputs exclude Capacity; unplaced intent is liability, not occupied time. E4/E14 |
| Real support/attached activities own time when realized | C realized activity roles/composition inputs, not mere demand. E4/E8 |
| Realized Goal work owns time | C fixed accepted geometry and occupied-authority feed. E8/E14 |
| Buffers protect but are not activities | C distinct protection role, non-reportable target. E8/E10 |
| Capacity/Demand/Allocation/Proposal do not own time | C derived intervals/intent/recommendations remain separate from realized facts. E3–E8 |
| Competition is not Friction | C distinct feasible-demand overlap and authorized-schedule incompatibility paths. E5/E15 |
| Proposal is not SuggestedFix | C constructive offer versus corrective change. E6/E15 |
| ProposalDecision is not PlanDecision | C independent command/storage paths. E6/E15 |
| Constructive does not use corrective authority silently | C acceptance/Realization callback does not call corrective acceptance. E6/E8 |
| Corrective does not create Goal allocation authority | C fix/PlanDecision path separate from ProposalSurface. E15 |
| Authored/accepted authority persists | C independent storage/revision models, durability protection; some surfaces support explicit session-only degraded saves. E1–E3/E6/E8/E12 |
| Preview disposable | C initial state preview=null; regeneration from persisted authored/accepted inputs. E14/E19/E20 |
| Execution evidence durable | C separate history/IndexedDB and restart tests; storage failures surfaced rather than silently certified durable. E12 |
| Progress/history distinct from regeneration | C independent observation/ledger queries. E9/E12/E13 |
| Canonical user-day authoritative | C generation, Month, Today and range resolvers use canonical windows, including variable days. E10/E14/E17/E19 |
| Planning Data Horizon distinct from Review Scope | C types/query intersections/metadata preserve separation despite legacy UI coupling. E19 |
| Proposal Horizon distinct from Publication Range | C distinct scope objects and explicit Publish transition. E6/E9/E19 |
| Calendar navigation creates no authority | C local month/selection controls, read-only queries. E17/E19 |

**Confirmed compatibility caveat:** `normalizePersistedBlockTemplates` re-enables a narrowly identified disabled untouched `default_sleep` (matching legacy metadata and timestamps). Existing tests intentionally cover this repair and preserve intentionally modified/disabled Sleep. It is not evidence that all disabled authored Sleep is ignored. **Inferred:** preserve or explicitly govern that migration behavior during convergence rather than treating it as a new baseline policy. No broader invariant violation is established by this branch alone. [E20]

**Scope limit:** “Confirmed preserved” describes inspected boundaries and supporting tests, not a formal proof over every concurrent operation. Imported/injected authority can exercise downstream paths unavailable from ordinary UI. UI reachability and authority validity remain separate.

## 23. Confirmed Working Paths to Preserve

**Confirmed:** preserve authored setup persistence and source incarnations; shared dirty draft/explicit Save; deterministic Work/Commitment regeneration; canonical variable user-days; real Friction detection and per-occurrence fixes; explicit persistent corrective acceptance/replay; manual Event persistence independent of generated coverage; Goal reverse links and optional dates; manual measurement revision epochs; execution reporting/correction/retraction and restart durability; historical Summary coverage and counts; explicit atomic immutable publication; Proposal revalidation/acceptance and realization transaction boundaries. [E1–E20]

**Confirmed:** unknown coverage is not empty coverage, unreported is not skipped/completed, scheduled is not executed, accepted is not realized, and a protection Buffer is not an activity. Existing discriminated results and tests enforce these distinctions; migration must preserve them in product behavior even if copy changes. [E4/E8–E13/E17/E19]

## 24. Confirmed Repair-Before-Migration Candidates

1. **Confirmed / EXPOSED_INCORRECT:** buffered overnight afterWork search-window extension. Repair the omitted before-buffer allowance with production-path regression coverage for the precise free-opening case and range-edge constraints. E14/§14.
2. **Confirmed / EXPOSED_INCORRECT:** Resolve schedule conflicts targets a nonexistent element. Connect it to the existing exact/visible Friction workflow and validate the actual app destination. Do not replace the canonical fix engine. E15/E16.

**Not included as confirmed repairs:** beforeWork overlap until reproducible, aesthetic copy, long lists, new bulk authoring, and replacing all Work modes. Realized-fact Month integration and retrospective reporting are connection work, covered below, not evidence of missing domain semantics.

## 25. Migration/Retirement Candidates

**Inferred:** consolidate Today and Selected Day presentation; migrate Canonical Planning Review's unique classes into the day experience; retire compact Preview date buttons once necessary range filters/attention navigation are represented; consolidate duplicated Planner destinations and repeated range warnings; translate raw type/epistemic labels; keep canonical Work, Commitment, Goal and Event editors while changing entry points. Review Schedule's publication/decision controls must survive any shell retirement. [E7/E9/E17–E19]

**Inferred:** do not treat Summary's historical “Scheduling realization” distribution as a duplicate of the accepted-allocation realization command. They describe different responsibilities despite sharing a word. [E8/E19]

## 26. Product-Reachability Gaps Requiring Connection

**Confirmed existing capabilities with missing outward edges:**

- Goal Structure relationships/milestones → authoring UI. E2.
- Demand, Priority, resource-footprint spec/association → explicit Goal planning workflow. E3.
- Capacity/Projection/Feasibility → bounded query triggers and understandable diagnostics. E3–E5.
- Competition/Allocation → derive Proposal → record Proposal/typed No-Proposal presentation. E5–E7.
- Existing Proposal acceptance/rejection controls → ordinary upstream Proposal supply. E6/E7.
- Accepted-unrealized state → explicit inspect/retry/recovery action using existing command; preserve already committed acceptance. E8.
- Realized Goal/support/protection facts → primary Month/Selected Day inventory, preserving activity/protection distinction. E8/E17.
- General historical execution commands and existing reporting component → mounted date-based workflow. E12.
- Global Goal navigation and Event-side discoverability → existing Goal editor/source-link command. E1/E11.
- Publication guidance from empty Today/coverage states → existing explicit Review/Publish workflow. E9/E10.

**Confirmed:** the complete Found Time lifecycle and execution-to-measured-Progress policy do not belong in a list of “just expose the existing complete command.” Their partial foundations and missing behavior need explicit design/implementation scope. [E11/E13]

## 27. Genuine Missing Capabilities

This section is limited to absences confirmed within exhaustively inspected concrete model/query surfaces, not speculative source-wide impossibility.

**Confirmed absent in the current measured-Progress implementation:** execution duration as an input or evidence source for Goal quantity Progress. `createGoalProgressQuery` accepts only Goal, Definition and Observation providers; its exact-input test confirms this. This is a missing behavior relative to the requested execution-derived lifecycle, not a bug in the implemented manual-quantity contract. [E13]

**Confirmed absent in the current Event authoring form/model:** an Event-side Goal-association field/control. A Goal-side source-link path exists, so Goal/Event association itself is not missing. [E1/E11]

**Confirmed absent in the current Demand model:** rolling recurrence/carry-forward cadence; the closed `DemandCadenceV1` union is total or sessionCount and requires a bounded horizon. Undated Goals already exist. [E3]

**Excluded from stronger claims here:** complete Found Time implementation, atomic bulk Friction command, external calendar ingestion and a separate Planning Candidate lifecycle were **Not Found** in the searched tree. These remain explicitly scoped negative findings in §§8,10,13,15, not “confirmed absent everywhere.”

## 28. Deferred Product-Evolution Findings

**Inferred deferred design work:** rolling/live calendar policy; external holiday/calendar ingestion beyond the existing static Preview provider; explicit recurring/ongoing Goal Demand semantics beyond optional Goal target dates; My Schedule information hierarchy; Tasks as optional vocabulary without merging Goals and Commitments; Summary grouping/paging/drill-down; bulk Work rotation construction and recurrence shortcuts; duration carry/borrow behavior; baseline Sleep policy; day-opening desktop/mobile interaction; Planner/Summary navigation and a shared Day Worksurface. [E1/E3/E17–E20; dispositions §20]

**Inferred:** Found Time and automatic measured Progress require decisions about identity/evidence and attribution before being bundled into “convergence wiring.” Product value does not itself supply a canonical implementation contract. [E11–E13]

## 29. Open Questions

- **Not Found:** the exact authored dogfood snapshot needed to reproduce beforeWork overlap, including cycle-specific day boundaries, template placement type, other occupied activities and accepted decisions. How do the brief's day-shift report and PDF #1's contrary observation relate?
- **Inferred design question:** which bounded Demand/footprint/horizon authoring should ordinary users supply, and what explicit defaults are legitimate authored intent? Current unspecified footprint and exact horizon matching must not be silently bypassed. E3–E5.
- **Inferred design question:** should Found Time be a new scheduled identity, a new execution identity, or an explicit association workflow? Current provenance token does not settle it. E11.
- **Inferred design question:** what duration evidence and Goal attribution policy may derive measured Progress, with correction/retraction/epoch/double-counting handling? E12/E13.
- **Confirmed integration question:** how should users retry realization after acceptance has succeeded but realization failed, without accepting a second time? E6/E8.
- **Inferred design question:** how should live day schedule, last published plan and actual execution coexist visibly in a shared Day Worksurface? E9/E10/E17.
- **Confirmed current asymmetry:** should one-day review selection also change publication scope, or should the whole-range publish workflow remain visibly separate? E9/§12.
- **Not Found:** production subscriptions that independently refresh Month's PlanningReviewPanel on Proposal-only changes; it currently receives `refreshKey={state}`. Existing decision flow remounts/refreshes review, but new generation wiring should verify cross-surface freshness. `MonthlyPlannerSurface.tsx:326–333`, E7/E19. This is a follow-up risk, not a confirmed visible defect in the present ordinary path.

## 30. Recommended Task 9.8 Scope Boundary

**Inferred recommendation, not a drafted task:** distinguish five work categories explicitly.

| Category | Evidence-supported inclusion | Boundary |
|---|---|---|
| Correctness repair | Buffered overnight afterWork and broken Resolve entry; investigate beforeWork with exact data | Do not label unreplicated beforeWork behavior fixed by an unrelated patch |
| Lifecycle connection | Demand/footprint/priority authoring through existing surfaces; bounded evaluation → Proposal derivation/recording → existing decision/realization; retry and No-Proposal diagnostics | Do not recreate domain engines or bypass freshness, coverage, explicit acceptance or realization ownership |
| Product reachability | Global Goals, reverse Event association discovery, historical reporting, Capacity visibility, publication guidance, realized facts in primary day inventory | A moved button alone does not complete a missing input/evidence policy |
| Migration preparation | Inventory preserved query/identity/authority dependencies; make working actions composable; remove duplicate navigation only with retained capabilities | Do not begin the two-surface migration solely under the audit's authorization |
| Deferred evolution | Found Time contract, execution-derived measured Progress, rolling planning policy, recurring Demand, external calendars, bulk authoring/resolution and broad Summary redesign | Explicitly authorize/specify these separately rather than smuggling them in as simple wiring |

**Inferred:** the next implementation should demonstrate one ordinary end-to-end constructive path from fresh Goal through durable publication/execution using existing authority transitions, while clearly marking any deliberately deferred Progress policy. Preserve the independent Commitment workflow. This artifact does not authorize that implementation. [E1–E20]

## 31. Validation and Repository Integrity

**Confirmed initial status:** only the preexisting untracked Dogfood Pass 02 PDF; no tracked modifications. Commit recorded in the header.

**Confirmed existing test execution:** from `code`, `npm test -- --reporter=dot`; **125 test files passed, 1,091 tests passed, 0 failures**, reported duration **38.52 s**. This was the full configured suite, not only targeted suites. Its passing result does not cover the missing ordinary UI edges; seeded/component tests were explicitly distinguished above. Test output was written outside the repository at `/tmp/dayframe-98a-tests.log`.

**Confirmed additional validation:** six inline production-generator placement scenarios described in §14. No test was added or altered. No application persistence, schemas, configuration, source, existing documentation or UI was modified.

**Confirmed final integrity verification:** `git diff --exit-code` and `git diff --cached --exit-code` both succeeded with no output. Final `git status --short`:

```text
?? DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
```

The only new repository artifact relative to the initial status is this RESULT file. The user-provided PDF remains untouched and untracked. No tracked production/test/configuration/schema/persistence/UI/existing-documentation file changed. The result was also checked for all 32 required ordered sections, all 78 numbered dogfood dispositions, and existing cited source paths.

## 32. Final Completion Statement

**Task 9.8A — Post-Dogfood Product Reachability & Workflow Audit is complete. No implementation changes were made. The current DayFrame product-reachability boundaries, lifecycle breakpoints, legacy UI exposure gaps, confirmed correctness defects, and pre-migration convergence requirements have been documented in the Phase 9 RESULT artifact.**
