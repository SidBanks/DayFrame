# Task 9.8B — Constructive Planning Reachability & Pre-Migration Convergence V1 — RESULT

**Phase:** 9 — Post-Dogfood Convergence  
**Governing evidence:** [Task 9.8A audit RESULT](TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md)  
**Input:** [Task 9.8B](TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_AND_PRE_MIGRATION_CONVERGENCE_V1.md)  
**Base commit:** `c0cc9ae2ae68af626e64747539a417f10df1cf3a`  
**Implementation:** local, uncommitted; no push.  
**Status:** Complete. All required checks passed; bundle advisory warnings are recorded in §21.

## 1. Executive Summary

The ordinary finite constructive lifecycle is now exposed through the existing Planner. A user can create a fresh Goal, explicitly save planning effort, default Goal Priority and a resource choice, evaluate current canonical planning truth, receive an explainable Proposal or no-proposal outcome, explicitly accept or reject, inspect realized Goal work/support/protection, refresh Review, and explicitly publish.

The confirmed buffered overnight `afterWork` search-window defect and the broken Resolve conflicts destination are repaired. No speculative `beforeWork` change was made. Product-path testing additionally exposed and repaired a lazy-store lookup mismatch that prevented the existing Realization callback from resolving an Accepted Allocation. This is an adapter repair, not a new acceptance or realization operation.

The governing authority model, planning algorithms, persistence schemas, database version and backup formats remain unchanged. The new authoring panel is deliberately bounded: finite requests, default Priority, explicit productive-only sessions or follow-up activity with protected time. Existing richer resource specifications can be retained unchanged. Full Goal Structure authoring and the Planner/Summary migration remain deferred.

## 2. Governing Audit Findings Addressed

| Audit finding | Implemented connection or repair |
|---|---|
| Goal discovery buried in contextual Planning Settings | A visible **Goals and planning** action in Planner opens the existing Goal area. |
| Goal authoring stops before Demand | Selected Goal now has **Plan work toward this Goal**, saving canonical Demand explicitly. |
| Priority and footprint commands UI-unexposed | Default Goal Priority and explicit resource-choice controls call existing commands. |
| Projection through Allocation UI-unexposed | **Evaluate planning opportunity** invokes the existing composite evaluation query. |
| Proposal derivation/recording disconnected | Application orchestration derives and records canonical Proposals; Review consumes them. |
| No-Proposal UI-unexposed | Canonical Feasibility and NoProposal reason codes have distinct explanatory copy. |
| Realized work only partially visible | Review and Month selected-day details show Goal work, support and Buffer roles with times and Goal names. |
| Accepted-but-unrealized recovery unexposed | Review exposes the existing idempotent realization command as **Retry scheduling accepted work**. |
| Overnight post-Work search omits before-buffer | Extension includes before-buffer + productive duration + after-buffer. |
| Resolve targets missing `preview-heading` | Resolve clears local day filtering and focuses/scrolls the mounted Schedule details heading. |

The audit's seeded acceptance/realization evidence did not exercise the production lazy lookup contract. The new fresh-Goal test did. `createLazySurface` defaults to asynchronous forwarding, while Realization requires `resolveAcceptedAllocation` synchronously. Explicit synchronous forwarding fixes that additional lifecycle connection without changing domain semantics.

## 3. Constructive Workflow Implemented

The ordinary path is:

1. In Planner, choose **Goals and planning**.
2. Choose **Add Goal**, enter a title, and **Save Goal**. No Demand is inferred from its title, target date, quantity, links or measurement policy.
3. In **Plan work toward this Goal**, enter the finite planning period, effort, session requirements, Priority and an explicit session-resource choice.
4. Choose **Save planning intent**. Saving intent does not change Preview geometry, accept work, realize work or publish.
5. With a generated schedule covering the period, choose **Evaluate planning opportunity**. Missing/stale/insufficient schedule truth is explained rather than treated as zero free time.
6. Inspect the planning result. A successful derivation is durably recorded as a Proposal. A negative result explains canonical reasons and writes no Accepted Allocation or scheduled facts.
7. Choose **Review schedule and proposals**. Inspect preferred-option effort, unmet effort and resource-claim geometry, then explicitly accept or reject.
8. Acceptance revalidates, durably records ProposalDecision and Accepted Allocation, and invokes the existing separate Realization callback.
9. Review displays scheduled Goal work/support/Buffer. A failed Realization retains accepted authority and exposes retry.
10. **Refresh Schedule**, review publication blockers, then explicitly **Publish schedule**. Month → **Back to day** shows realized facts in selected-day details.

The existing initial schedule guardrails remain: Work setup and an enabled Commitment with recurrence are required to generate Preview. The integration fixture supplies that unrelated authored setup, then creates the Goal, Demand and Proposal through production UI. It does not inject a prebuilt Proposal, Allocation or accepted schedule.

## 4. Goal Planning Intent Authoring

`GoalPlanningSection.tsx` uses `createDemand`/`reviseDemand`, `createPriority`/`revisePriority`, `createDemandResourceFootprintSpec`, and `setDemandResourceFootprintAssociation`. The form is transient editing state; canonical store authority remains authoritative.

The form exposes inclusive “Plan from”/“Plan through” dates, converted to the existing exclusive-end user-day horizon; hours/minutes for requested effort and session bounds; uninterrupted or splittable sessions; minimum/target/optional satisfaction; explicit partial-effort permission and minimum acceptable effort; and total-effort or session-count cadence. Canonical command validation remains decisive. Session-count cadence is a finite requirement, not recurring Demand.

Priority is the existing default Goal Priority, with low/normal/high/critical choices. Existing period-scoped priorities retain their canonical precedence. The UI explains this scope.

Resource choice begins unspecified and must be explicit. The supported authored choices are productive-only, or a required per-session follow-up activity at productive end plus optional protected time after work/follow-up. These create canonical specifications/associations. Buffer targets the follow-up component when present and productive work otherwise. Zero components under the resource option are rejected with an explanation.

Existing resolved associations default to **Keep saved resource choice unchanged**, preserving richer geometry, optional-component selections, composition lineage and exact specification revision. The current support/protection durations are summarized. Changing Priority alone does not replace the saved specification or association.

Accepted-but-not-durable planning writes are not announced as saved. The existing persistence retry is used; continued storage failure leaves a clear in-memory warning, retains the current Demand identity, and disables evaluation until Save succeeds. Sequential partial saves are disclosed and retried as updates. No multi-authority transaction or new schema was invented.

## 5. Capacity and Feasibility Connection

`evaluatePlanningRequest` delegates to `evaluateCompetingAllocation`; the existing store obtains Capacity, projects current Demand, resolves current footprint/Goal eligibility, and evaluates Feasibility.

Known usable time and qualified time are shown only with complete, current, valid Capacity qualification. Missing Preview, stale information, incomplete coverage, protected authority, unresolved liability, infeasible effort, conditional eligibility and hard structural ineligibility remain distinguishable. Feasibility presentation maps every current typed classification and reason code without replacing domain classification logic.

Results are transient snapshots. Schedule/Goal revision changes and Goal planning/structure subscriptions invalidate displayed results. An evaluation that finishes after such a change is not installed as a current result. Acceptance still independently revalidates.

The product tests verify known infeasibility versus unavailable Capacity, stale Capacity and insufficient coverage, permitted partial effort, and a preexisting hard prerequisite. Structure setup in that last test uses the canonical store because a Structure editor is intentionally outside this task; evaluation and its visible result use the ordinary UI.

## 6. Competition and Allocation Connection

The existing composite query selects active Demands with the exact evaluated finite horizon, obtains canonical priorities/eligibility, computes Competition and invokes Allocation. The application helper selects allocation results for competing sets containing the requested Demand projection. It does not rank demands, calculate free intervals, invent fit geometry or mutate allocation authority.

The panel explains that evaluation considers other active requests with the same period. Proposals may contain competing Goals; Review shows Goal names, productive effort, unmet effort and claims. Assigned effort and unallocated effort remain distinct. The partial-effort integration test verifies that a provisional option can leave unmet minutes only when explicitly permitted by canonical satisfaction rules.

Existing finite candidate-policy limitations remain. The implementation does not add cross-horizon arbitration or a continuous planning horizon.

## 7. Proposal / No-Proposal Connection

For each applicable canonical allocation, the helper calls existing `deriveProposal`, then `recordProposal` only for a `proposed` result. The store wrapper now exposes the canonical derivation input type, including `evaluationCutoff`, so derivation and acceptance replay use the same cutoff. No parallel UI candidate or Proposal representation was introduced.

A recorded Proposal is reported saved only after a durable accepted recording outcome. Failed recording is explained and offers re-evaluation. Derivation does not accept, reserve, realize or publish work.

There are two honest negative paths: canonical `NoProposalV1` returned by derivation, with its typed reasons; and no eligible competing set, where canonical Feasibility/Competition already abstains before allocation. The latter displays the retained Feasibility classification/reasons and explains that no eligible opportunity exists. It does not fabricate an Allocation or claim that a `NoProposalV1` record was produced. Neither path writes a durable no-proposal authority object.

## 8. ProposalDecision and Revalidation

Existing Review controls call `acceptProposalOption` and `rejectProposal`. The canonical acceptance path re-evaluates current decisive inputs, re-derives with the Proposal's original cutoff, and rejects stale/conflicting claims before Accepted Allocation creation.

The app integration test derives through UI, changes a decisive scheduling preference, then attempts acceptance in Review. Canonical revalidation rejects it and no accepted or realized authority appears. Rejection is separately tested through the visible **Reject Proposal** control, recording a decision without scheduling anything.

The UI inspects command outcomes rather than equating a resolved Promise with successful acceptance. Stale acceptance has actionable re-evaluation copy; unexpected command failure prompts review of refreshed authority instead of falsely asserting rollback.

## 9. Accepted Allocation and Realization

Acceptance still durably writes ProposalDecision/Accepted Allocation before the distinct existing Realization callback. The only additional store adapter change is synchronous `resolveAcceptedAllocation` forwarding from the loaded lazy Proposal surface. Its previous Promise result could not satisfy Realization's synchronous lookup contract.

Successful realization writes one canonical Realization and all productive/support/protection facts atomically. Realization stales Preview; no duplicate time-owning UI records are created.

On failure, Review explains the canonical reason and retains Accepted Allocation. **Retry scheduling accepted work** calls `realizeAcceptedAllocation` for the existing allocation ID, never accepts the Proposal again. Canonical idempotency remains responsible for preventing duplication.

The recovery test injects an IndexedDB transaction failure at Realization writes after successful acceptance. It checks durable Accepted Allocation in storage, zero partial facts/realizations, the visible persistence-failure explanation, one UI retry, exactly one Accepted Allocation and one successful Realization containing three facts, and `alreadyRealized` on a subsequent canonical retry.

## 10. Scheduled Goal Work Visibility

`ScheduledGoalFacts.tsx` is a read-only projection used in canonical Schedule Review and Month selected-day details. It displays Goal title, canonical user-day label, human time range and schedule role:

- **Goal work** — productive activity;
- **Support activity** — supporting activity;
- **Protected Buffer — not an activity** — protection, with canonical execution eligibility prohibited.

Review reads facts from `queryPlanningReview`; Month receives canonical `listRealizedScheduleFacts` and filters by selected user-day. Neither display manufactures new facts or execution controls. The success test checks all three roles and Buffer nonactivity semantics in Review and selected-day details.

This is sufficient verification visibility for the bounded lifecycle. It is not a Day Worksurface redesign, drag/reschedule interface or new unified calendar grid.

## 11. Review and Publication

The existing `ScheduleReviewPanel` remains the publication surface. Its query now refreshes when the app's schedule snapshot changes, fixing stale readiness after the user refreshes Preview. Accepted-but-unrealized liabilities continue to block publication.

The success test asserts no historical publication after evaluation and after realization, then explicitly refreshes Preview and clicks Publish. Canonical history contains all three accepted-allocation resource occurrences afterward. Publication uses the existing fingerprint validation, materialization and immutable persistence path. A Preview refresh alone does not publish.

Existing later Today/execution/history/Summary lifecycle consumers are unchanged. This task adds no execution-derived measured Progress and does not claim that viewing or publishing productive work completes a Goal.

## 12. Buffered Overnight afterWork Repair

The production placer extends search beyond the ordinary placement boundary when Work ends late. Previously its post-Work extension was `durationMinutes + bufferAfterMinutes`; placement still required `bufferBeforeMinutes`, so the complete footprint could be falsely rejected.

`getPlacementSearchWindow` now extends through `bufferBefore + duration + bufferAfter`. Existing occupied-time checks, user-day ownership and visible-range clipping remain authoritative. Only the `afterWork` extension changed.

Production-generator regressions use Monday/Wednesday/Friday 60-minute work with 30-minute buffers, day Work 09:00–17:00 and overnight Work 21:45–06:15. Buffered night `afterWork` starts productive work at 06:45, following its 06:15–06:45 before-buffer. Every full footprint is checked against generated Work; the clipped visible-window case remains unplaced.

## 13. beforeWork Investigation / Non-Regression

The historical reported `beforeWork` defect was not reproduced by the governing audit or these controlled regression scenarios. No `beforeWork` implementation was changed.

Production day and overnight buffered `beforeWork` tests assert productive starts of 07:30 and 20:15 respectively, all three expected placements, no unplaced candidates/friction, and no full-footprint overlap with Work. This is non-regression evidence, not a claim to have repaired the historical report.

## 14. Resolve Schedule Conflicts Repair

The old callback focused nonexistent `preview-heading`. The existing Schedule details heading now has `id="schedule-friction-heading"` and `tabIndex={-1}`. Resolve clears the local selected-day range filter, then focuses and scrolls that real mounted heading on the next frame, making the existing detailed Friction/SuggestedFix workflow reachable.

The application integration test generates an actual fixed Commitment/Work conflict, opens Review, activates Resolve, requires the real heading to receive focus, requires existing individual fix controls to be mounted, and verifies unchanged Preview and PlanDecision authority. No fix is automatically selected or accepted.

## 15. No-Proposal Behavior

Known insufficient total/contiguous time, unmet session-count requirements, partial effort below minimum, structural prerequisites, missing/ambiguous footprint association, required support/protection conflicts and unavailable/stale/incomplete Capacity retain their typed explanatory distinctions.

Canonical derivation reasons (`noCapacity`, `noUnmetDemand`, `allSatisfied`, `noMinimumFit`, `compositionInfeasible`, `structurallyBlocked`, `policyAbstained`, `incompleteInput`) each have dedicated user copy. Exhaustive TypeScript mappings prevent silently omitting an existing code.

The fresh-Goal infeasibility test requests 24 hours in a day with unrelated Work/Commitment occupancy, verifies the known-capacity and no-opportunity explanations, and asserts no actionable Proposal, Accepted Allocation, Realization, scheduled facts, Preview mutation or publication. Unknown Capacity has a separate product test and does not render a known-zero summary.

No-proposal is not an error to bypass. The UI directs users to review dates, effort/session/resource requirements, prerequisites or schedule freshness as appropriate.

## 16. Reachability Matrix — Before vs After

| Capability | Before 9.8B | After 9.8B | Evidence |
|---|---|---|---|
| Goal creation | Discoverability defect | Planner Goals and planning → Add Goal | Fresh-Goal app test; PlannerSurface |
| Demand authoring | UI unexposed | Explicit finite effort/session form | GoalPlanningSection; app authoring assertions |
| Priority authoring | UI unexposed | Default Priority, canonical scoped precedence preserved | Form/store authority assertions |
| Resource footprint intent | UI unexposed | Productive-only or follow-up/protection; preserve existing choice | Resource-authoring and preservation tests |
| Capacity evaluation | UI unexposed | Evaluate planning opportunity | Known/stale/coverage/unavailable tests |
| Feasibility result | UI unexposed | Typed classifications/reasons | Infeasible, partial, prerequisite, success tests |
| Competition / Allocation initiation | UI unexposed | Existing composite query from Evaluate | Real store through fresh-Goal product path |
| Proposal derivation | Disconnected | Canonical derivation + durable recording | App-created actionable Proposal |
| No-Proposal presentation | UI unexposed | Canonical negative/abstention explanation | Known infeasibility product test |
| Proposal acceptance | Conditional / disconnected upstream | Review accepts UI-derived Proposal | Success and stale-acceptance tests |
| Accepted Allocation | Conditional / disconnected upstream | Existing durable acceptance transition | Success/recovery storage assertions |
| Realization | Conditional / disconnected upstream | Existing callback with corrected lookup; idempotent UI retry | Success + injected atomic-failure recovery |
| Scheduled Goal Work visibility | Partial | Review and selected-day facts with roles/times/names | Success test |
| Review | Reachable | Existing surface, refreshed readiness and recovery details | Success, rejection, conflict tests |
| Publication | Reachable / discoverability defect | Constructive panel links to Review and existing Publish | Explicit UI publication and history assertions |
| Resolve schedule conflicts | Exposed incorrect | Focused mounted detailed workflow | Actual app conflict/fix test |
| Buffered overnight afterWork | Exposed incorrect | Full-footprint search extension | Seven production-generator scenarios |

Full Structure editing, richer footprint editing and broad navigation redesign are not marked reachable by these claims.

## 17. Authority Transition Verification

| Transition | Required authority | Implementation/evidence |
|---|---|---|
| Goal → Demand | Explicit authored intent | Save planning intent calls Demand commands; Goal creation alone creates none. |
| Demand → Projection | Derived | Existing composite query projects current authored authority. |
| Schedule → Capacity | Derived | Existing capacity query reads current scheduling truth/qualification. |
| Demand + Capacity → Feasibility | Derived | Existing typed feasibility engine, including footprints and eligibility. |
| Feasible competing Demands → Allocation | Derived / provisional | Existing Competition/Allocation engines; no writes from allocation query. |
| Allocation → Proposal | Non-authoritative proposed action | Existing derivation and durable Proposal recording; no schedule ownership. |
| Proposal → ProposalDecision | Explicit user decision | Existing Review accept/reject controls. |
| Accepted Proposal → Accepted Allocation | Durable accepted authority | Existing revalidated atomic acceptance command. |
| Accepted Allocation → Realization | Separate canonical operation / existing callback | Existing realization callback and ID-based retry; adapter repaired. |
| Realization → scheduled facts | Time-owning/protective schedule truth | Existing atomic Realization/facts writes; role semantics retained. |
| Schedule → Publication | Explicit immutable publication | Existing Review Publish command after Preview refresh/readiness. |
| Publication → Execution | Separate later evidence lifecycle | Existing lifecycle untouched; no automatic execution or Progress writes. |

The product tests assert the absence of downstream authority at evaluation and rejection, failed stale acceptance, retained acceptance without partial reality on storage failure, and no publication before the explicit user action.

## 18. Persistence / Schema Assessment

**No persistence/schema version changes. No IndexedDB version, object-store, backup-format, restore-envelope or migration changes.**

New ordinary UI writes use existing Goal, Goal planning, Proposal, Accepted Allocation, Realization and publication storage commands. No new persistent collections or localStorage keys were introduced. Goal planning save remains multiple existing commands; partial saves and durability failure are disclosed. Successful commands preserve existing revision and identity rules.

`resolveAcceptedAllocation` now respects the synchronous contract already declared by its surface and consumed during Realization/bootstrap validation. No authority payload changed.

## 19. Existing Behavior Preserved

The complete existing suite is required, including authored setup and explicit Save, Work/Commitment generation, Events, arbitrary Month navigation, canonical user-day boundaries, Preview freshness, Friction and individual SuggestedFix decisions, Proposal freshness, immutable accepted authority, atomic realized footprints, Buffer nonactivity, explicit publication/history, execution correction/retraction/restart persistence, manual Goal measurement and historical Summary coverage semantics.

The implementation makes no changes to execution, Goal measurement, progress aggregation, historical-plan persistence, calendar ingestion, corrective planning algorithms or restore schemas. Existing `Schedule details` text and existing generic decision-success text were retained for compatibility.

The baseline had 125 files / 1,091 tests. This task adds two files with 19 tests; no existing test assertions were removed or weakened. The multi-step full-app success test has a 15-second per-test limit because it timed out at the default five seconds when the full suite ran alongside build/lint; its behavioral assertions remain intact.

## 20. Tests Added / Updated

`code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx` adds 12 tests with real `DayFrameApp`, real production store/bootstrap and fake IndexedDB:

1. Fresh Goal → explicit intent/resources → canonical evaluation/recording → explicit acceptance → all three realized roles → explicit publication → Month visibility.
2. Known infeasibility/no-proposal without downstream authority or geometry/history mutation.
3. Explicit Proposal rejection without accepted/scheduled authority.
4. Stale and insufficient-coverage distinctions.
5. Explicitly allowed partial allocation with unmet effort.
6. Explicit footprint requirement and saved-specification/association preservation during Priority editing.
7. Existing hard prerequisite respected by ordinary evaluation.
8. Storage failure is not presented as durable intent; retry preserves Demand identity.
9. Unavailable Capacity is not known zero.
10. Changed decisive input prevents stale UI-derived Proposal acceptance.
11. Atomic realization failure preserves durable acceptance; UI retry creates exactly one complete realization.
12. Resolve reaches the real focused Friction destination and leaves decisions unchanged.

`code/src/core/engine/tests/workRelativeFootprint.test.ts` adds seven production-generator cases: buffered day/night `afterWork`, unbuffered night `afterWork`, buffered day/night `beforeWork`, buffered night `anyAvailable`, and clipped night `afterWork` remaining unplaced.

The integration tests seed only unrelated schedule setup and, in the dedicated eligibility test, a prerequisite relationship. They never inject a Proposal into the success/no-proposal workflow. Storage failure injection targets the real persistence boundary.

## 21. Full Validation Results

Final validation commands ran from `code/`:

| Command | Final result |
|---|---|
| `npm run format` | Exit 0; full repository-code Prettier write completed. |
| `npm test` | Exit 0; **127 test files passed, 1,110 tests passed, 0 failures**; 30.03 s. |
| `npm run build` | Exit 0; TypeScript check and Vite production build passed. |
| `npm run lint` | Exit 0; ESLint passed with no diagnostics. |
| `npm run typecheck` | Exit 0; explicit `tsc --noEmit` passed with no diagnostics. |
| `npm run check:bundle` | Exit 0; all hard limits passed; advisory warnings below. |
| `git diff --check` | Exit 0; no diff whitespace errors. |
| `git diff --cached --exit-code` | Exit 0; nothing staged. |
| RESULT structure/integrity check | All 27 required ordered sections, exact final completion statement, and listed source/test files verified. |

The final full suite includes the 12 production-app tests and seven production-generator tests added here. Relative to the 9.8A baseline, this is +2 files / +19 tests with all existing tests retained.

Bundle metrics: initial JavaScript **659,773 bytes** (hard limit 685,000), initial gzip **168,324 bytes** (hard limit 170,000), largest lazy chunk **53,194 bytes** (hard limit 100,000), total JavaScript **999,740 bytes**. Advisory thresholds were exceeded for initial bytes, initial gzip and total architecture-review size. These are recorded warnings, not failed hard gates. The new authoring surface remains lazy-loaded; bundle policy was not loosened.

Logs: `/tmp/dayframe-98b-format.log`, `-test.log`, `-build.log`, `-lint.log`, `-typecheck.log`, and `-bundle.log`. No browser-manual dogfood is claimed by these deterministic tests.

The first full run passed 126 files and 1,109 tests, with one new multi-step test timing out at 5,000 ms. That timeout was investigated, its local successful behavior confirmed, and its explicit limit increased to 15,000 ms. A second full run exposed a detached-message-element race in the new recovery test while Review refreshed; its assertion now waits for the current visible message. Final results supersede both preliminary runs without concealing them.

## 22. Repository Integrity

Base/current implementation commit: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. No commit, staging or push was requested or performed.

Initial Task 9.8B status contained only these preexisting untracked inputs/artifacts:

```text
?? DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AND_WORKFLOW_AUDIT.md
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_AND_PRE_MIGRATION_CONVERGENCE_V1.md
```

Modified tracked files:

```text
code/src/core/blocks/placeBlockCandidates.ts
code/src/state/lazyProposalSurface.ts
code/src/state/proposalSurface.ts
code/src/ui/DayFrameApp.tsx
code/src/ui/GoalSection.tsx
code/src/ui/MonthlyPlannerSurface.tsx
code/src/ui/PlannerSurface.tsx
code/src/ui/PreviewScreen.tsx
code/src/ui/ScheduleReviewPanel.tsx
```

New Task 9.8B files:

```text
code/src/core/engine/tests/workRelativeFootprint.test.ts
code/src/state/constructivePlanningWorkflow.ts
code/src/ui/GoalPlanningSection.tsx
code/src/ui/ScheduledGoalFacts.tsx
code/src/ui/planningResultCopy.ts
code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx
docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_PRE_MIGRATION_CONVERGENCE_RESULT.md
```

The existing task inputs, audit result and Dogfood PDF are preserved. Build artifacts are ignored. Validation logs are outside the repository under `/tmp/dayframe-98b-*`. Final status/diff checks are recorded in §21. Final `git status --short`:

```text
 M code/src/core/blocks/placeBlockCandidates.ts
 M code/src/state/lazyProposalSurface.ts
 M code/src/state/proposalSurface.ts
 M code/src/ui/DayFrameApp.tsx
 M code/src/ui/GoalSection.tsx
 M code/src/ui/MonthlyPlannerSurface.tsx
 M code/src/ui/PlannerSurface.tsx
 M code/src/ui/PreviewScreen.tsx
 M code/src/ui/ScheduleReviewPanel.tsx
?? DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf
?? code/src/core/engine/tests/workRelativeFootprint.test.ts
?? code/src/state/constructivePlanningWorkflow.ts
?? code/src/ui/GoalPlanningSection.tsx
?? code/src/ui/ScheduledGoalFacts.tsx
?? code/src/ui/planningResultCopy.ts
?? code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AND_WORKFLOW_AUDIT.md
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_AND_PRE_MIGRATION_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_PRE_MIGRATION_CONVERGENCE_RESULT.md
```

## 23. Deferred Findings

The following remain explicitly outside Task 9.8B:

- Found Time and opportunistic reclamation;
- execution-derived measured Progress;
- recurring Goal Demand;
- continuous/rolling calendar policy and automatic horizon maintenance;
- external calendar ingestion;
- full Goal Structure authoring;
- new historical Goal reporting beyond existing publication/history consumers;
- bulk Friction resolution and bulk Work authoring;
- Summary redesign;
- Planner/Summary shell migration;
- Day Worksurface convergence;
- My Schedule hierarchy.

No Today removal or new publication mechanism was introduced. The historical `beforeWork` report remains unreproduced; this task supplies regression evidence, not an invented repair.

## 24. Remaining Product-Reachability Gaps

The bounded form does not expose the full Structure, scoped Priority, footprint-variant, optional-resource or composition-authoring domains. It preserves their existing authority and eligibility rather than replacing them.

Existing feasibility enumeration begins a productive candidate at a capacity interval's start. A required preparation component before that start can therefore fail even when a later productive start might fit the overall free interval. Implementation testing observed this canonical policy limitation. This task exposes follow-up activity after productive work instead; it does not silently shift candidates or change the enumeration algorithm. Richer preparation-before-work authoring needs a bounded policy/geometry follow-up if required by future product scope.

Evaluation uses same-horizon finite requests and existing bounded candidate enumeration. It does not promise global optimal packing, arbitrary cross-horizon competition or repeated sessions within every long free interval. Canonical no-proposal/partial results remain explainable.

Realized work is inspectable in Review and selected-day details; unified day-grid editing, rescheduling/cancellation of accepted authority and richer resource labels remain future product work. Existing advanced authoring remains unavailable through ordinary UI unless explicitly listed in the reachability matrix. Bundle advisory headroom remains a migration consideration, not a new hard-limit failure.

## 25. Migration Readiness Assessment

The ordinary finite constructive lifecycle is product-reachable with explicit authority transitions and deterministic production-app evidence, with all required validation passing in §21. It no longer depends on a store-seeded Proposal to demonstrate acceptance, realization and publication.

The two confirmed correctness defects are repaired. The additional lazy Accepted Allocation lookup defect is repaired and guarded by the full-app success/recovery tests. The pre-activity support limitation is disclosed rather than hidden behind the new UI; the exposed follow-up/protection path exercises all required realized roles using existing supported geometry.

With final validation passing, the supported lifecycle is sufficiently connected to prepare the Planner/Summary migration without concealing a foundational failure in that path. This is not a claim that every advanced planning capability is now editable or that unresolved placement reports have been proved impossible.

## 26. Recommended Next Step

Run a bounded verification dogfood of the now-exposed finite Goal workflow before shell migration preparation. Include a fresh Goal with productive-only intent, one with follow-up/protection, an infeasible/partial request, explicit rejection, realization recovery feedback, and explicit publication. Retain the new deterministic product tests as migration acceptance gates.

Do not expand that verification into Found Time, recurring Demand, measured Progress automation or a candidate-enumeration redesign. No next task has been started.

## 27. Final Completion Statement

**Task 9.8B — Constructive Planning Reachability & Pre-Migration Convergence V1 is complete. The ordinary constructive planning lifecycle has been connected through the existing DayFrame authority model, confirmed pre-migration correctness defects have been addressed within scope, and the resulting product path has been validated without collapsing Proposal, Accepted Allocation, Realization, Publication, Execution, or Progress semantics.**
