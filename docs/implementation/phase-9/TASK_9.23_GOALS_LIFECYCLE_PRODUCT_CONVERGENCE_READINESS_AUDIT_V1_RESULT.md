# Task 9.23 — Goals Lifecycle & Product Convergence Readiness Audit V1 RESULT

## 1. Executive determination

**COMPLETE — audit only. Goals is not ready to claim full lifecycle or mobile product convergence.** Existing finite Goal authoring and planning have substantial canonical support. The accepted September lifecycle requires additional domain, policy, persistence, materialization, release, and evidence work. Those are mostly accepted-design implementation gaps, not reasons to redesign settled semantics.

Exactly one next slice is recommended: **Goals Focused Editing & Requested Time Fidelity V1** (§17). It makes existing authoring safe and usable without adding lifecycle semantics. This is the smallest demonstrated dependency: an ordinary Priority edit currently changes untouched session constraints, mobile detail overflows, and navigation discards drafts and selection. Broader lifecycle implementation is not a prerequisite for correcting these existing-only capabilities.

Evidence collected on 2026-09-22: 154 test files / 1,540 tests passed; two additional disposable audit probes passed; production Chromium inspection at 320, 390, 768 and 1280 CSS px; all requested static/build/hard bundle gates passed. No production source, governing document, task specification, dependency, schema, or retained user data was changed.

## 2. Task identity and immutable input

Saved input: `docs/implementation/phase-9/TASK_9.23_GOALS_LIFECYCLE_AND_PRODUCT_CONVERGENCE_READINESS_AUDIT_V1.md`.

Before investigation, verified numbered sections 1–20 and both the applicable completion alternatives and final completion criterion in §20. Its SHA-256 is `9d7a036885ba11f8b24f77be9d27ea90c049ba72a372eec6ac1415d5f038ee02`, identical to the supplied attachment `/home/sid/.codex/attachments/32bcab3c-29de-48e3-bc75-b1b26c757708/pasted-text.txt`.

Task-directory and registry/navigation discovery found this matching 9.23 assignment and no conflicting assignment. `docs/architecture/CURRENT_STATE.md` and `CHANGELOG.md` still describe the earlier 9.3 checkpoint; the only filename-based task index found is `docs/implementation/phase-2/PHASE_2_TASK_INDEX.md`. Neither overrides the later 9.21/9.22 RESULTs. Latest demonstrated implementation checkpoint is **9.22 COMPLETE**, following **9.21 COMPLETE**. No task number is assigned to the recommendation.

## 3. Repository baseline and forensic accounting

- Starting HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`.
- `git status --short` was recorded in the initial tool output: **183 pre-existing entries**, including modified production source, untracked Phase 9 implementations/results, the lifecycle/ontology/retirement documents, this task's input, and the Dogfood Pass 02 hydration PDF.
- Before investigation, SHA-256 captured **977 distinct tracked/unignored files** in `/tmp/dayframe-923-baseline-RESULT.json`. This distinguishes pre-existing uncommitted code from audit output; HEAD-only diff is not the task delta.
- No applicable AGENTS.md was found at repository/ancestor locations; `.agents` and `.codex` were empty. No agents were delegated.
- The sole new durable repository artifact is this RESULT. Temporary logs, probes, configuration and browser observations use `RESULT` filenames under `/tmp`.
- The original Dogfood Pass 02 state was never opened, copied, initialized, cleared, migrated or repaired. Browser origin `http://127.0.0.1:4925/` used only `/tmp/dayframe-923-chrome-RESULT`; tests used fresh fake IndexedDB/localStorage. No retained browser profile was accessed.
- No reset, stash, commit, push, dependency installation or source-format rewrite occurred. Build output is ordinary ignored output from the required validation.

Final task-relative integrity accounting is in §18.

## 4. Governing input inventory

Paths below are repository-relative. Historical status labels are reported literally and are not silently modernized.

| Source | Status/version/authority and consequential sections |
| --- | --- |
| `docs/architecture/DAYFRAME_GOAL_LIFECYCLE_ARCHITECTURE_SPECIFICATION_V1.md` | **DayFrame Goal Lifecycle Architecture Specification V1**; Canonical Architecture Specification; **Accepted Design Direction — Pre-Implementation**; **1.0**, 2026-09-21. Full document, §§1–111, read. Extends existing authority chain; §95 does not redefine downstream owners; §97 authorizes no retirement. SHA-256 `b5b0b27f7a93a4871373576656e683c6f3a1c48a57865434daef4d57460cc571`. This is the externally added source referenced by 9.22 §X. |
| `docs/architecture/DayFrame_Product_Ontology_Vocabulary_Specification_V1.md` | Canonical Product Architecture Specification, Accepted Design Direction — Pre-Implementation, 1.0, 2026-09-21; governing authority is Complete Architecture Appendix B. §§1–9, 13, 16–17, 23, 27–31 establish translation without new authority. |
| `docs/architecture/DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md` | Governing Appendix B glossary: Goal, Commitment, Capacity, Plan, Generated Plan, Accepted Schedule, Planning Candidate, provenance and historical evidence. Goal is authored outcome; Plan is a pillar; Capacity is derived; acceptance is explicit. |
| `docs/architecture/DayFrame_End_State_Compatibility_Retirement_Architecture_Specification_V1.md` | Canonical Architecture Specification, Accepted Design Direction — Pre-Implementation, 1.0, 2026-09-22. §§3–6, 9–10, 16–17: capability retirement differs from physical removal; parity and explicit authority required; Production/Population/Loader closure required for removal. |
| `docs/implementation/phase-9/TASK_9.21_ACCEPTED_PLANNING_SUMMARY_CONVERGENCE_V1_RESULT.md` | COMPLETE; bounded G2 consumer, distinct iterations, app-owned Summary context, late-response rejection, retained independent History/Progress; §§C–K, S–U. |
| `docs/implementation/phase-9/TASK_9.22_MY_SCHEDULE_CONVERGENCE_V1_RESULT.md` | COMPLETE; §§C–K, X establish existing editor patterns and recommend investigating Goals; expressly does not approve or implement the newly supplied lifecycle. |
| `docs/implementation/phase-9/TASK_9.19_CANONICAL_PRODUCT_EVIDENCE_PROJECTION_V1_RESULT.md` and `docs/adr/ADR_CANONICAL_PRODUCT_EVIDENCE_PROJECTIONS.md` | RESULT complete; ADR accepted for 9.19 bounded implementation. G1/G2 are separate read-only projections; RESULT §§36–49 and §§90–94 define exact lineage, limits, uncertainty and deferred supersession. |
| `docs/adr/ADR_GOAL_AUTHORITY_IDENTITY_LIFECYCLE_AND_COMMITMENT_LINK_MODEL.md` | Header literally “Accepted architecture; not implemented,” 2026-08-23. Normative V1 identity/status/link model; executable completion established separately by Task 5.3/code. |
| `docs/implementation/phase-5/TASK_5.3_IMPLEMENT_GOAL_V1_DURABLE_AUTHORITY_COMMITMENT_LINKS_HISTORICAL_PROVENANCE_AND_BACKUP_RESTORE_CLEAR_INTEGRATION_RESULT.md` | Complete; §§6–25: strict Goal, revisions, optional dates, exact source incarnations, no hard delete, profile independence. |
| `docs/architecture/GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md` | Completed authoritative specification result, not the similarly named task input. §§5–25, 34–45, 80–84 establish typed structure, manual completion, no implicit roll-up/inheritance and historical resolution. |
| `docs/implementation/phase-8/TASK_8.2_GOAL_STRUCTURE_V1_DOMAIN_AND_PERSISTENCE_RESULT.md` | Complete bounded non-UI implementation: contains/contributesTo/dependsOn, manual Milestones, exact history, graph validation, persistence and Backup V7. |
| `docs/architecture/GOAL_DEMAND_ALLOCATION_ARCHITECTURE_SPECIFICATION_RESULT.md` and `docs/implementation/phase-8/TASK_8.3_GOAL_DEMAND_PRIORITY_AND_PROJECTION_V1_RESULT.md` | Normative Demand/Allocation specification versus complete bounded finite Demand implementation. Specification §§6–17, 37–45; implementation §§9–31. Session count is not recurrence; attribution and richer timing are deferred. |
| `docs/implementation/phase-9/TASK_9.2.0_GOAL_DEMAND_RESOURCE_FOOTPRINT_ASSOCIATION_ARCHITECTURE_V1_RESULT.md` | Complete architecture definition; §§8–12: separate reusable specification and exact Demand association; unspecified does not mean productive-only. Current code implements these primitives. |
| `docs/implementation/phase-9/TASK_9.3_ACCEPTED_ALLOCATION_REALIZATION_V1_RESULT.md` | Complete; §§7–45: fixed accepted geometry, atomic durable realization, role-specific facts, restart idempotence, retained acceptance on failure. |
| `docs/adr/ADR_GOAL_MEASUREMENT_DEFINITION_AUTHORITY_REVISION_EPOCH_AND_POLICY_MODEL.md` | Accepted architecture; header still says not implemented. Exact definition epochs and optional measurement; legacy Goal policy reference is compatibility metadata, not current measurement authority. |
| `docs/adr/ADR_PROGRESS_OBSERVATION_IDENTITY_REVISION_TIME_AND_DEFINITION_BINDING_MODEL.md` and `docs/implementation/phase-5/TASK_5.18_SUMMARY_PROGRESS_V1_INTEGRATION_AND_PROVENANCE_RESULT.md` | Accepted observation ADR; complete Summary integration. Independent observations bind exact definition revision/unit; measured and knowledge times differ; no definition/observation/protected states remain distinct from zero. |
| `docs/adr/ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md` | Accepted; independent surface versions, supported historical reading or explicit safe recovery, preservation of unsupported data, evidence-based reader retirement. |

The September 21 hydration snapshot was not used to establish executable behavior or assign work.

## 5. Current product and authority map

Source inspection traced `PlannerSurface.tsx` → `DayFrameApp.tsx` Goals mount → lazy `GoalSection.tsx`; focused Goal mounts lazy `GoalPlanningSection.tsx` keyed by Goal ID. Goal detail directly hosts `GoalMeasurementSection` and `GoalProgressReportingSection`.

`GoalSection` is the **only production UI caller of `createGoal`** found by searching `code/src/ui`. Summary and Daily Planner are navigation entry points into that same component/command owner. They are not competing Goal authorities. “New planning request” creates independent Demand through `createDemand`, not another Goal; measurement setup is another semantically distinct authority. No separate Goal creation form was found in current `SetupScreen` or `CommitmentSection`.

The authority path remains:

`Goal → Requested Time → projection / feasibility / allocation → Proposal → explicit acceptance → realization → publication → Actual → independent Progress`

The final arrow describes the product journey, **not an automatic Actual-to-Progress transformation**. Progress reads definitions and observations, never time totals.

## 6. Capability and source-to-code matrix

Abbreviated governing sources refer to exact inventory paths in §4. All source paths in this table start at `code/src/`.

| Capability | Governing source | Current owner/API | Product entry | Persistence/history effects | Evidence | Gap/disposition |
| --- | --- | --- | --- | --- | --- | --- |
| Create qualitative/undated Goal | Goal ADR; Lifecycle §§5, 8, 17 | `state/goalSurface.ts`: `createGoal`, `listGoals`, `getGoal` | Planner → Goals → Add Goal | UUID/revision in Goals IndexedDB; no Demand created | `ui/tests/GoalSection.test.tsx`; browser create/reload | **IMPLEMENTED AND REACHABLE** |
| Focused Goal edit | Goal ADR; retirement data parity | `updateGoal(id, expectedRevision, patch)` | selected detail → Edit Goal | spreads existing record; only changed fields patched | disposable exact-link/metadata probe; UI source | **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED** for draft/navigation/mobile behavior |
| Complete/archive/reactivate | Goal ADR; Lifecycle §§40–66 | `completeGoal`, `archiveGoal`, `reactivateGoal` | selected detail | updates current Goal revision/status/timestamps; no accepted/scheduled cascade | `goalSurface.test.ts`, `GoalSection.test.tsx`; browser complete/reactivate | Existing V1 **IMPLEMENTED AND REACHABLE**; newer Complete/Cancel/Pause behavior is not equivalent |
| Exact source links | Goal ADR; Task 5.3 | `linkCommitment`, `unlinkCommitment`, `getGoalLinkAvailability` | detail Supporting commitments | source kind + ID + incarnation; unavailable links retained | Goal surface/UI tests; disposable patch probe | **IMPLEMENTED AND REACHABLE**; service association, not Demand satisfaction |
| Requested Time create/revise | Demand spec; Task 8.3 | `state/goalPlanningSurface.ts`: `createDemand`, `reviseDemand` | detail → Plan work toward this Goal | separate complete append-only Demand revisions | constructive workflow tests; fidelity probe | **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED**; confirmed lossy form reconstruction |
| Finite horizon/session/satisfaction | Task 8.3 | `core/planning/goalDemand.ts` | date range, hours/minutes, split/min/max, total/session count | half-open user-day horizon; exact finite minutes | Demand domain/surface tests | **IMPLEMENTED AND REACHABLE**, except preferred/unspecified-max preservation defect; no recurrence implied |
| Goal Priority | Task 8.3 | `createPriority`, `revisePriority`, `getApplicableGoalPriority` | default Priority in planning form | own revisioned authority; bounded overrides independent | planning tests; Priority-only fidelity probe | Default UI reachable; bounded override authoring **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED** |
| Resource/support/protection | Task 9.2.0 | footprint spec/association commands and resolver | explicit productive-only or support/protected time; preserve saved choice | exact spec revision, variant and selected optional components | constructive test “requires an explicit footprint and preserves saved resources during a priority edit” | Simple authoring reachable; advanced variants/geometry **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED** |
| Structure, prerequisites, Milestones | Structure spec; Task 8.2 | `state/goalStructureSurface.ts`: create/revise/retire relationship, create/revise Milestone, list/current/exact queries | no ordinary authoring controls found in production UI | own append-only records; graph validation; manual checkpoint state | structure surface/domain tests; constructive hard prerequisite test | **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED**, not missing architecture |
| Feasibility/constructive entry | Demand spec; constructive workflow | `evaluatePlanningRequest`, `evaluateCompetingAllocation`, `deriveProposal`, `recordProposal` | Evaluate planning opportunity → Review schedule and proposals | evaluation is derived; explicit evaluation can record a Proposal, never accepts/publishes | `ui/tests/ConstructivePlanningWorkflow.test.tsx` | **IMPLEMENTED AND REACHABLE**; wording still mixes planning intent/effort and Requested Time |
| Accepted iterations/scheduled work | G2 ADR; Task 9.21 | `queryAcceptedPlanningEvidence` | Summary → Accepted planning; Review Plan | read-only projection; retains distinct acceptances/facts | Network+ tests and navigation tests | Underlying capability reachable elsewhere; Goal detail **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED** |
| Goal → scheduled work → day | G2/G1 ADR | fact `userDayDate`, existing `openDay`, `querySelectedDayEvidence` | Summary fact → Daily Planner; Day → Goal | read-only navigation; canonical owner label, real as-of | `AcceptedPlanningNavigation.test.tsx`; App source | No direct Goal-detail scheduled-work drill-down; no new contract needed for existing facts |
| Actual and independent Progress | Progress ADRs; Task 5.18 | `getGoalActivity`, `queryGoalProgress`, observation history/commands | Summary History → selected Goal; Goal detail Measurement/Progress Reporting | observations/definition epochs independent of Goal and schedule | Progress query/UI tests | **IMPLEMENTED AND REACHABLE**; Goal-centered presentation/linking needs convergence |
| Back/drafts/selection | Task 9.18 navigation and 9.21 consumer | `ui/plannerNavigation.ts`, local Goal component state | Back from Review/Day/Summary | presentation only; no persisted draft authority | browser plus navigation tests | **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED**: Goal local state lost on unmount |
| Search/status/bounded density | retirement/product direction | `GoalList`, `listGoals` | active and completed/archived groups | none | 24 real Goals created through production UI | **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED**: no search/status filter/reveal bound; all 24 rows render |

## 7. Lifecycle specification-to-code comparison

The strict allowed fields in `core/goals/goal.ts` and finite `GoalDemandIntentV1` in `core/planning/goalDemand.ts` prove the absence of the newer fields **within these closed models**. Searches of exposed Goal/GoalPlanning/Realization APIs establish the command boundaries. They do not assert that similarly named words are absent everywhere.

| Accepted rule, exact terminology | Executable comparison | Classification |
| --- | --- | --- |
| §§4–7: **One-Time**, **Recurring**, **Ongoing** | GoalV1 has no type field/policy. Undated active Goals are supported; finite manually repeated requests are supported. Neither implements Recurring or capacity-seeking Ongoing. | **ACCEPTED DESIGN — FOUNDATION IMPLEMENTATION REQUIRED** |
| §§65–66: **Active**, **Paused**, **Awaiting User Review**, **Completed**, **Cancelled** | Closed GoalStatus is `active | completed | archived`. No temporal review condition or Pause/Cancel owner exists here. | Same |
| §§3, 40, 88–89: user-only Complete | Explicit current completion exists and is independent of durations/Progress. Future generation stop, policy-driven release and atomic lifecycle evidence do not exist. Current Goal timestamp is not a complete lifecycle event ledger. | Existing invariant implemented; remaining foundation gap |
| §§36–39, 63: finite Continue vs periodic Continue | Finite Continue repeats policy into a new Demand lifecycle with lawful future dates and same Goal ID; periodic Continue retains policy without duplicating Demand. Neither command exists. `reactivateGoal` only changes V1 status; it is not Continue. | Foundation gap |
| §§35, 68, 71, 84, 91: prospective amendments | Demand revisions retain old values; revision commands use save-time `updatedAt`, and preserve original `effectiveFrom`. No user-selected “This period / Next period / Choose a date” policy amendment or policy provenance ledger. | Foundation gap beyond existing revision editing |
| §§42–44: Pause and **Suspended Demand** | Demand-level `suspendDemand` exists. It is not an atomic Goal Pause, does not stop policy generation, and does not decide future time release. Archive is not Pause. | Foundation gap |
| §§45–49: Resume policies | **Resume outstanding + normal Demand**, **Discard outstanding + resume normally**, **Finish outstanding first**; initial **Ask me**. Current Demand/Goal reactivation is not these policies. | Foundation gap |
| §§41, 44: completion/pause release | Completion choices **Ask me / Release future Goal time / Keep future Goal time**, initial **Ask me**; Pause choices **Release scheduled time / Keep scheduled time / Ask me**. No release command or Released Interval record. | Foundation gap |
| §§50–54, 59, 103: Cancel/Delete | Must end future Demand and release future unexecuted Goal-owned scheduled time, retain history; no keep-future policy. V1 has no Goal delete/cancel command. Archive cannot be relabeled Cancel. | Foundation gap |
| §§60–64: Goal Review Cadence | Default **Monthly**; conceptual options **Monthly, Every 2 months, Every 3 months, Every 6 months, Yearly, Never, Custom**. Non-blocking periodic review, primarily on Summary. No cadence/review owner in current model. Options are conceptual, not a finalized closed enum. | Foundation gap |
| §§56–58, 71, 98: policy ownership | Explicit occurrence decision → Goal-specific → Goal-type Global → General Global → default/Ask me. Durable choices/provenance; Settings → Planning Policies is supporting UI, not schedule authority. No current equivalent policy collection. | Foundation gap |
| §§18–21, 93–94 | Activity Tags, Found Time attribution and Released Interval/live-opportunity bridge are accepted future concepts, not present Goal controls. Manual Events cannot be relabeled Found Time. | **OUT OF SCOPE / DEFERRED** in next slice |
| §§69–70: duplicate detection/replacement | Similarity is advisory; explicit future supersession authority must be defined before replacement. Current acceptance explicitly reports supersession not represented. | **ARCHITECTURE DECISION REQUIRED** only if implementing acceptance replacement |

The older “one Goal type plus typed structure” contract distinguishes parent/subgoal roles. It does not prohibit the newer orthogonal lifecycle types. No conflict should be manufactured from those two uses of “type.” Likewise, capability retirement states in the retirement specification are not GoalStatus values.

The newer architecture does not specify a completed/cancelled Goal reactivation transition equivalent to the old V1 button. Preserve existing support; do not silently map it to Resume or Continue. A future migration that promises this mapping must explicitly resolve it.

## 8. Requested Time, materialization and shortfall

Lifecycle §§11–12, 22–34, 72–74 and 106–110 establish:

- Durable Demand identity incorporates Goal, Demand policy identity/revision, and recurrence period (or an equivalent deterministic representation). Repeated processing is idempotent.
- For indefinite Goals, the **Monthly Planner horizon** bounds materialization. Natural recurrence remains daily/weekly/etc.; a week crossing a month boundary remains one instance. Advancing the calendar does not erase past instances.
- **Demand Cycle Boundary** and **Goal Lifecycle Boundary** differ. Target exhaustion, scheduled duration, Actual, or measurement target do not silently complete a Goal.
- Recurring shortfall choices are **Expire**, **Carry Forward**, **Overdue**. Without applicable policy, ask and keep unresolved until the user decides; optionally save the chosen default.
- Carry Forward adds attributable quantity in the next period. Overdue retains original instance and period. Neither rewrites native current-period quantity.
- Default accumulation ceiling is **3 recurrence periods**, maximum user-selectable **10**, measured in **period-equivalents**. Excess remains historical evidence, not unlimited actionable liability.
- Ongoing **Capacity Response Policy** values are **Flexible**, **Normal**, **Preserve Target**, independent of Priority. Flexible is an early suppression candidate; Normal follows ordinary competition; Preserve Target tries lawful move/split before shrink/full suppression. No Capacity or higher-authority invasion. Suppression is not failure, Friction or overdue liability by default. The spec does not designate a universal initial Capacity Response value; do not invent one.
- Missing Actual remains unknown. Demand satisfaction requires compatible Actual under applicable policy, not scheduled duration. The Found Time example distinguishes **Reduce Requested Time** and **Keep Requested Time**; compatible reduction defaults to oldest compatible Overdue first. This does not authorize treating every existing Goal-linked Commitment as a satisfaction credit.

Current `DemandCadenceV1` is exactly total or sessionCount; horizon is a finite `userDayInterval`; lifecycle is active/suspended/expired/completed/retired. No recurrence policy/period identity/materializer, boundary shortfall ledger, ceiling, suppression evidence, or Actual attribution owner exists in these contracts. Existing suspension/expiry primitives are reusable, not proof of end-to-end policies.

The specification fixes horizon and idempotency requirements, but does not provide a complete operational command/admission protocol for triggering materialization from calendar interaction. A future foundation task must make the governed materialization operation explicit; present navigation remains read-only. This is an implementation-contract detail to resolve, not permission for React to create Demand during render.

## 9. Goal Structure readiness

`core/planning/goalStructure.ts` and `state/goalStructureSurface.ts` implement typed `contains`, non-aggregating `contributesTo`, and hard/advisory `dependsOn`, with Goal-completion or manual-Milestone conditions. Containment is single-parent acyclic; dependency cycles and invalid endpoints fail; contribution is not interpreted as quantitative aggregation.

Public `listGoalStructureRelationships`, `listGoalStructureMilestones`, `getStructuralEligibility`, `getGoalStructureRelationshipRevision`, and `getGoalStructureMilestoneRevision` suffice for current inspection and exact historical record resolution. Create/revise/retire commands return rejection reasons such as staleRevision, missingEndpoint, invalidInput and invalidGraph; ordinary forms can expose actionable feedback. Rich cycle-path explanations would require checking/extending the owner response, not fabricating graph validity in React.

`goalStructureSurface.test.ts` covers atomic histories, invalid graph/no partial mutation, and protected persistence. `goalStructureSchedulingBoundary.test.ts` preserves scheduling separation. The constructive UI test “respects an existing hard Goal prerequisite during ordinary evaluation” proves planning consumes eligibility despite absent authoring UI.

There are no ordinary structure authoring callers in inspected production UI. This is a reachability gap. Do not infer inherited Priority, parent Progress, automatic parent completion, or aggregate Requested Time. Broader explicit Demand Accounting/Progress contribution policies in the specification are not supplied by basic relationship UI. An exact edge revision lookup is also not proof of a complete historical Goal-state timeline.

## 10. G2, G1, scheduled work, Actual and Progress contracts

`state/acceptedPlanningEvidenceQuery.ts` delegates to `core/productEvidence/acceptedPlanningEvidence.ts`. Public input is `{startUserDayDate, endUserDayDateExclusive, asOf, select?}`; required half-open range **1–366 days**; selector kind **goal / acceptedAllocation / scheduledFact** with exact ID.

Output distinguishes projected/invalidQuery/error; iterations, role-specific facts, unresolved historical lineage, completeness/source coverage, found/notFoundInRange/unknown, and `progress: notInferred`. Each iteration retains accepted identity/revision, Proposal revision/decision/option, Demand references, and realization state. Facts retain scheduled identity, origin, Goal/Demand lineage, owner day, publication snapshots and execution references. Realization is **realized / acceptedButUnrealized / unknown**; protected realization cannot mean unrealized. Old legal snapshots without lineage remain `legacyLineageUnavailable`; current Goal context is explicitly not frozen historical reconstruction.

**No evidence-contract gap blocks bounded Goal-scoped inspection of existing accepted work.** Task 9.21 already demonstrates progressive disclosure over this projection. React may group these projected records; it must not join raw Proposal/Realization/History collections. G2 is not an all-time complete Goal biography; empty means in-range only. Its range bounds do not bound every underlying scan: current Proposal/Realization exports and retained execution processing remain in-memory work, with indexed publication reads. Do not claim a large-data latency SLO.

For Daily Planner navigation, use the selected fact's canonical `userDayDate`, not browser-local date slicing of `startsAt`. `querySelectedDayEvidence({ownerDay, asOf})` preserves selected-day versus current evaluation time, current schedule versus immutable publication, and Actual uncertainty. Reporting targets remain subject-specific and command-revalidated; protection is not executable activity.

The full-suite Network+ regressions retained accepted-A **600 min / 10h**, accepted-B **1,200 min / 20h**, and accepted-C **60 min / 1h unrealized**, with distinct role/provenance. Display totals across decisions are orientation only; no authoritative 30h or 31h acceptance is synthesized. This audit reused those tests; it did not manufacture a new browser acceptance fixture.

Independent Progress is available from `state/goalProgressQuery.ts`, reading only Goals, MeasurementDefinition and ProgressObservation; exact definition epoch and evaluationAsOf govern interpretation. `GoalProgressSummary.tsx` can be reused or lawfully linked; `GoalProgressReportingSection.tsx` already permits record/correct/retract in Goal detail. `GoalActivitySummary.tsx` exposes separate historical activity. G2's notInferred never means zero or completion percentage.

**STOP CONDITION — EVIDENCE CONTRACT GAP**, scoped to target lifecycle dashboards: current public queries cannot report policy revision governing a lifecycle action, Demand period identity, unresolved shortfall/carry-forward/overdue quantities, suppression, suspension resolution, future release provenance, or next review. Required owners are future Goal lifecycle/policy/Demand and prospective schedule-release authority, with read projections layered over their records. This does not block the existing-only next slice.

### Query and refresh behavior

- GoalSection subscribes to Goals; selection is local and initialized from optional initialGoalId. App mounts GoalPlanning keyed by Goal ID, preventing one Goal's form from becoming another's.
- GoalPlanning subscribes to GoalPlanning and Structure; revision/state changes invalidate evaluation version. Late successful evaluations cannot replace newer state. Subscription invalidation does **not** reload the local captured Demand/form; stale revision is rejected at command time. Planning errors are comparatively generic.
- GoalPlanning's multistep Save is Demand → Priority → footprint specification/association. It is **not atomic across all steps**. Errors explain that earlier intent is retained; accepted/pending persistence differs from durable. Draft dirty state and retry avoid claiming durable success prematurely.
- AcceptedPlanningSummary request sequence, cleanup and range/result keys reject late results; its context lives in App. It refreshes on range, explicit Refresh, query-owner change or remount, not every unrelated render. It has no universal live G2 subscription. A future in-place Goal consumer must wire relevant refresh invalidation explicitly.
- GoalActivity has request sequencing for Goal/range changes; existing test covers a selected Goal disappearing during a pending query. Progress/history subscriptions remain in their independent owners.
- Existing Summary → Day/Goal → Back restoration is tested. That does not establish Goal-detail draft restoration, which fails in browser.

## 11. Persistence, identity, freshness and historical effects

`GoalV1` has an opaque never-reused UUID and current revision. `updateGoal` patches the current record; lifecycle writes replace it and reset coherent completedAt/archivedAt timestamps. Unlike Demand/Structure, Goals do **not** expose an append-only exact Goal-revision query. Frozen publications retain their own Goal context; a complete history of all lifecycle decisions still needs new authority.

Demand/Priority/Structure retain complete revisions and exact lookup, reject stale expected revisions, validate canonical inputs, and keep retired history. Planning dependency fingerprints include relevant Goal/Demand/Structure/footprint revisions; acceptance revalidates current evidence. A new Requested Time revision is not authorization to replace an earlier acceptance.

Goal completion changes future projection applicability: `goalDemandProjection.ts` makes completed Goal Demand inapplicable; archived state produces unknown applicability with explicit lifecycle reason. The stored Demand is not automatically rewritten to suspended, despite the older Demand specification's default suspension direction. This is an implementation gap between physical Demand lifecycle and projection eligibility, not proof of Cancel/Pause implementation.

`proposalSurface` owns retained acceptance independently. `realizationSurface.ts` realizes exact complete accepted scope once, persists every role atomically before runtime install, and returns alreadyRealized on retry/restart. Its ordinary public behavior provides **no move, release, cancel or acceptance-replacement command**. Restore replacement/full clear are administrative whole-authority operations and cannot substitute for lifecycle commands. Proposal supersession and PlanDecision revocation are not accepted-allocation revocation.

Current completion/archive/Requested Time edits do not remove accepted authority, realized facts or publications. An already accepted unrealized allocation remains a separate authorization; current realization checks acceptance, foundations and conflicts, not a new Goal-completion cancellation policy. Therefore current completion must not be advertised as cancelling future accepted work.

Goal/Planning/Structure can accept runtime truth with persistence pending/failure; retry persists desired authority without a new semantic intent. By contrast realization persistence failure leaves no partial runtime or durable footprint and acceptance survives. Goal creation itself is not a retry-keyed lifecycle command: calling createGoal again allocates another identity. Future lifecycle operations require durable deduplication and atomic cross-authority effects specified in lifecycle §74.

Current DB schema constant is **11**; current complete backup is **V14**, with older compatible layers; independent format numbers are intentional. Goal, Structure, Planning, Proposal, Realization, Measurement, observations and history join restore/full-clear ownership through `dayFrameStore.ts`, backup validators and runtime participants. Profiles remain authored setup, not Goal/Progress/realization snapshots. Restart validates retained authority; protected ingress blocks unsafe mutation. Future lifecycle authority must join backup/restore/restart/clear and preserve profile boundaries before UI claims durability. No migration is needed for the proposed presentation/fidelity slice.

## 12. Data fidelity and compatibility findings

**Confirmed defect F1 — untouched Requested Time fields change during Priority-only save.** Disposable real-store/UI probe created a valid 240-minute splittable request with `{minimumMinutes:30, preferredMinutes:60}` and **no maximum**. Changing only Goal planning priority to high and clicking Save planning intent produced `{minimumMinutes:30, maximumMinutes:240}`: preferredMinutes disappeared and a maximum was introduced. The prior Demand revision remained exact. `GoalPlanningSection.initialForm` omits preferredMinutes and substitutes requested effort for absent maximum; `save` reconstructs the whole session object; `reviseDemand` correctly treats that supplied object as replacement authority. This is a presentation fidelity defect, not a domain-command defect.

**Verified preservation:** Goal title-only patch retains description, legacy measurement-policy reference, and exact unavailable source link. Stale Goal revision rejects and current record stays unchanged. GoalPlanning preserve-resource mode retains the exact association selection; existing regression verifies resources on Priority edit. Selecting a newly authored simple resource footprint intentionally creates a new specification; it must not be mistaken for lossless editing of arbitrary advanced geometry.

Hidden bounded Priority overrides, full footprint components/variants/source snapshots, independent Structure revisions, measurement epochs, and accepted-iteration lineage must remain intact. None may be rebuilt from simplified form fields. Unsupported future lifecycle metadata cannot be added as unversioned UI fields; strict Goal validation rejects unknown fields.

| Potentially superseded capability | Audit disposition, not authorization |
| --- | --- |
| Existing Goal and Requested Time editors | **DEFERRED — RETIREMENT BLOCKED** until lossless focused/mobile replacement parity is demonstrated. |
| Summary accepted-work inspector reused in Goal context | **MOVED** is a possible presentation reuse disposition only if equivalent reachability remains; current Summary capability still serves its own purpose and is not retired. |
| Advanced footprint/Priority/Structure capabilities | **DEFERRED — RETIREMENT BLOCKED**; absence of ordinary controls is not obsolescence. |
| Legacy Goal measurement-policy metadata and supported old backup readers | **COMPATIBILITY-ONLY** where already deprecated by measurement architecture; retain interpretation/preservation. |
| Archive/reactivate under newer lifecycle | **DEFERRED — RETIREMENT BLOCKED**; no approved migration or behavioral replacement demonstrated. |

No capability is newly declared REPLACED or OBSOLETE BY ARCHITECTURE. No reachability, reader or test is removed. Eventual removal lacks all necessary closure evidence: Production (old authors cannot create the retired representation), Population (all supported stored instances migrated or safely preserved), Loader (supported loading cannot still encounter it). Prominence of a new screen proves none of these.

## 13. Existing workflow, mobile and accessibility observations

Production build served by `npm run preview -- --host 127.0.0.1 --port 4925`. Chromium was launched with `--headless=new --no-sandbox --disable-gpu --user-data-dir=/tmp/dayframe-923-chrome-RESULT --remote-debugging-port=9325`. CDP used installed Node's WebSocket, no browser library installation. Initial localhost probe was sandbox-denied (EPERM); approved escalation enabled access. Only disposable state was used.

At each width, ordinary UI created and edited an undated Goal with no Requested Time, preserved description, exposed planning/measurement controls, showed invalid-title feedback, and navigated Review Plan → Back. Twenty more Goals were then created through the same real UI: **24 total**, persisted across reload, not a synthetic projection fixture.

| Width | Selected detail: client width / document scroll width | Reachability, reduced height and context |
| --- | --- | --- |
| 320 | **305 / 509 px — FAIL** (15px browser scrollbar; viewport 320) | Create/edit reachable; native planning select expands layout. At 320×360 invalid-title form remains present and description retained. Back loses selection/draft. |
| 390 | **375 / 509 px — FAIL** | Same capabilities and overflow; same Back loss. |
| 768 | **753 / 753 px — no document overflow** | Same create/edit/error workflow; small control targets and Back loss remain. |
| 1280 | **1265 / 1265 px — no document overflow** | Same capabilities; desktop does not cure draft loss or small controls. |

The 24-Goal detail follow-up reproduced those widths. Create-only forms did not horizontally overflow. At 640px viewport with CSS zoom 2 (a reflow approximation), client width was 625 and document scroll width **1,018 px**: FAIL. This is not physical device or browser-native zoom certification.

Measured visible Goal actions Add Goal/Edit Goal/Mark Complete/Archive Goal/Save Goal/Cancel are **40px** high. Planning inputs measured **24px**, selects **21px**, and the raw checkbox **13px** (the checkbox hit region must be assessed with its label; no 44px claim). Follow-up measurements excluded hidden controls; initial whole-document discovery also included Settings descendants and was not used to claim their reachability.

Source and DOM inspection show labeled native inputs/selects/buttons, semantic headings and text lifecycle labels; no required hover/double-click/right-click was found. Browser driver used programmatic single-click events and keyboard Tab, not physical touch gestures. Tab reached a Goal list button with solid outline. Edit focuses title; its computed outline was none (other focus styling not fully certified). Cancel and save left focus on BODY; Back focused the Planner/Goals location heading but did not restore the original selection. Invalid-title alert is visible in DOM and focuses title, but fields have no `aria-describedby` error association. Full keyboard traversal and screen-reader behavior remain unverified.

All 24 Goal rows render without search, status selector or pagination. One focused Goal is shown, but planning details are immediately dense; there is no progressive disclosure for the full editor. Active and completed/archived groups exist; within-group order is canonical UUID order, deterministic but not meaningful Priority. Explicit Mark Complete changed status without measurement; Reactivate returned it. No target lifecycle controls were fabricated.

Evidence files: `/tmp/dayframe-923-browser-observations-RESULT.json`, `/tmp/dayframe-923-browser-followup-RESULT.json`, screenshots `/tmp/dayframe-923-<width>-<case>-RESULT.png`; 320px selected-detail screenshot visually inspected. These are disposable evidence, with material measurements retained here. Cross-width evidence parity was observed for basic Goal fields/control families; accepted-history/protected-state parity in Goals was **not** browser-certified.

### Required scenario accounting

| Scenario | Evidence actually obtained |
| --- | --- |
| 1. Undated/no-request create and reopen | Production UI at all widths; 24 Goals survive reload; existing GoalSection test executed. |
| 2. Edit preserves unrelated fields | Real-store disposable patch probe passes for Goal metadata/links; UI probe demonstrates F1 for Requested Time; no general lossless-edit claim. |
| 3. Explicit completion versus time/Progress | Browser complete/reactivate with no measurement; Goal/Progress tests and closed owner contracts show separation. |
| 4–5. Distinct iterations; Network+ 10h/20h | Existing canonical G2 and AcceptedPlanningSummary tests executed; separate unrealized C retained. No new browser lineage fixture. |
| 6. Unrealized versus protected/unavailable | Existing G2/Summary tests executed; contract inspected. |
| 7. Productive/support/protection | Constructive workflow and G2 tests executed; role-specific realization and reporting inspected. |
| 8. Goal → work → day and return | Existing Summary-to-Day/Goal Back test executed. Direct Goal-detail work path absent; browser Goal→Review→Back loses local context. |
| 9. Drafts/stale/persistence | Browser validation retains form but navigation loses it; disposable stale command probe rejects; constructive persistence-failure retry test executed. Stale Goal UI error source inspected, not separately browser-injected. |
| 10. Switch Goal/range during pending read | Executed Summary “late A cannot overwrite B” and GoalActivity selected-Goal-disappears tests; source guards inspected. New Goal-scoped G2 consumer does not yet exist. |
| 11. Lifecycle with accepted/realized/history | Source trace proves status commands have no cascade; existing realization/restart/provenance tests executed. No new end-to-end lifecycle-plus-accepted-history browser run; target Pause/Cancel/Continue absent. |
| 12. Larger set/search/detail/navigation | 24 canonical Goals created via UI/reloaded; all rows render; search absent; detail and Back observed. Existing 20-Goal/60-iteration/360-fact Summary test is **synthetic presentation density only**, not persisted authority proof. |

## 14. Tests and validation actually executed

All repository validations ran in `code/`, except root git checks. Existing installed toolchain only.

| Command | Result |
| --- | --- |
| `npx prettier --check .` | PASS; no formatting rewrite. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm run test -- --maxWorkers=2` | PASS: **154 files, 1,540 tests**, **91.62s**. Worker bound changes execution concurrency, not selected tests. |
| `npm run build` | PASS, TypeScript plus production Vite build. |
| `npm run check:bundle` | PASS hard limits; advisories in §15. |
| `git diff --check` | PASS. |
| `./node_modules/.bin/vitest run --config /tmp/dayframe-923-vitest-RESULT.mjs` | Final PASS: **1 external file / 2 audit probes**, **1.73s**. Assertions intentionally verify F1 exists and prior revision survives; also verify exact Goal patch preservation/stale rejection. These are not permanent regression additions or fixes. |

Logs: `/tmp/dayframe-923-{tests,prettier,lint,types,build,bundle,diff,fidelity}-RESULT.log`. Temporary probe source `/tmp/dayframe-923-fidelity-RESULT.test.tsx`. The first probe invocation used the wrong working directory; next failed to resolve the external file's React JSX runtime; temporary configuration was corrected with the installed React alias. Final measurements use the successful run. Neither was a repository baseline failure. No baseline validation failure was repaired or hidden.

Consequential inspected-and-executed suites include `state/goalSurface.test.ts`, `goalPlanningSurface.test.ts`, `goalStructureSurface.test.ts`, `goalPlanningSchedulingBoundary.test.ts`, `realizationSurface.test.ts`, `productEvidence.test.ts`, `goalProgressQuery.test.ts`; `core/productEvidence/acceptedPlanningEvidence.test.ts`; and UI `GoalSection`, `GoalActivitySummary`, `GoalProgressSummary`, `ConstructivePlanningWorkflow`, `AcceptedPlanningSummary`, `AcceptedPlanningNavigation` tests. Their exact case names are given beside findings above where material.

## 15. Current bundle measurements

Fresh production build, not copied historical counts:

| Measure | Bytes | Hard limit / headroom |
| --- | ---: | --- |
| Initial raw JavaScript | **621,318** | 685,000 / **63,682** |
| Initial gzip JavaScript | **162,642** | **170,000** / **7,358** |
| Largest lazy chunk, SetupScreen | **62,652** | 100,000 / **37,348** |
| Total emitted JavaScript | **1,199,106** | Advisory-governed; no invented hard limit |

Initial gzip exceeds the 161,500 headroom advisory. Total exceeds 800,000 warning and 825,000 architecture-review threshold; tool reports architecture-review advisory. Initial raw is below 650,000 advisory and largest lazy below 80,000 advisory. No thresholds changed.

GoalSection, GoalPlanningSection, AcceptedPlanningSummary, GoalPlanning/Structure state adapters and G1/G2 query adapters are existing lazy boundaries. Next-slice list/context wiring may add some initial App code; retain lazy editors and avoid importing planning/history engines into navigation. Future byte deltas are unknown; no post-implementation measurements are claimed.

## 16. Unresolved decisions, evidence limits and scoped stop conditions

**STOP CONDITION — ARCHITECTURE DECISION REQUIRED:** acceptance replacement/supersession. Lifecycle §70 expressly requires explicit authority before “Replace future plan.” Current G2 reports `supersession: notRepresented`; neither Goal edit nor Proposal successor metadata can authorize replacement. A future replacement task must specify identity, scope, retained authorization, effective time, downstream release and retry/atomicity. This does not reopen settled Pause/Complete/Cancel release requirements.

Lifecycle foundations also need concrete command schemas, policy applicability/effective-period rules, durable deduplication, materialization admission, and a compatible treatment of old archive/reactivate state. These are not all new architecture decisions: most implement settled requirements. Where a task chooses behavior the spec does not fix (for example mapping old reactivation into the new transitions), obtain an explicit bounded decision rather than an inferred mapping. The spec's conceptual Custom cadence is not a fully defined configuration schema.

The lifecycle evidence gap in §10 blocks truthful new lifecycle summary fields until canonical owners exist. Existing G2 suffices for existing accepted iterations. Structure current/exact public contracts suffice for bounded basic authoring. Independent measured Progress can be reused without a new metric owner.

Missing/unverified evidence: no physical-device, screen-reader or cross-browser certification; no complete keyboard traversal; no fresh browser accepted-history/lifecycle combined run; no large real history I/O performance SLO; no protected-history recovery execution. These limits do not prevent an audit determination, but prohibit claiming those acceptance gates passed. Necessary governing lifecycle input was found and inspected; no lifecycle conclusion is blocked by missing document.

## 17. Exactly one recommended next bounded implementation slice

**Proposed title: Goals Focused Editing & Requested Time Fidelity V1.** No task number assigned.

**Outcome:** safely find, open and edit an existing finite Goal/Requested Time request on mobile or desktop, preserve all untouched valid data, and leave/return without losing inspection context or draft. Show existing active/completed/archived semantics honestly. This repairs demonstrated prerequisites for further Goal convergence; it does not complete the September lifecycle.

**Accepted semantics implemented:** retirement data-round-trip/mobile/failure parity; Goal-versus-Requested-Time separation; explicit authoring through current revision-checked commands; unchanged independent measurement, links, Structure, acceptance and history; no implicit schedule change. Use Requested Time/hours/minutes/session language without renaming domain records.

**Reuse:** `GoalSection`, `GoalPlanningSection`, `goalSurface.updateGoal`, `goalPlanningSurface.reviseDemand/createDemand`, existing Priority and footprint commands, exact resource resolver, Goal/Planning subscriptions, existing durability/retry outcomes, `usePlannerNavigation`, App-owned presentation context pattern from AcceptedPlanningSummary, `DurationFields` where semantically suitable. Continue linking Review Schedule through the existing destination/acceptance owner. Preserve current Measurement/Progress reporting controls and unavailable source-link evidence.

**Expected areas:** `code/src/ui/GoalSection.tsx`, `GoalPlanningSection.tsx`, `DayFrameApp.tsx`, bounded Goal presentation/context helper if needed, `dayFrameUi.css`, and focused UI/navigation tests. Canonical contracts should require no semantic change. Correct F1 by patching only intended fields or maintaining the complete saved semantic value; absence of preferred/maximum must remain distinct from a form default. Do not merely round-trip whatever the simplified form can express.

**Bound:** active-first deterministic list; title search and supported status filters; initially bounded rows with explicit reveal for ≥24 Goals; one focused editor; safe request switching and navigation; preservation of preferred session minutes, unspecified maximum, satisfaction/count, bounded Priority overrides, exact footprint selections, links and measurement metadata. Explain stale revision and accepted-but-not-durable outcomes; successful save must refresh from canonical authority. Preserve drafts on rejected commands; prevent accidental discard during navigation or make discard explicit. Restore selection/search/reveal and sensible focus on Back. Address mobile overflow and practical target sizes.

**Persistence/migration:** none. Draft/context stays ephemeral presentation state and must never become a new persisted authority. **Architecture decision prerequisite:** none for this slice; replacement/Pause/Cancel/recurrence are excluded. If implementation encounters a missing contract needed for its actual bounded scope, report the specific datum/owner instead of widening scope silently.

**Explicit exclusions:** newer lifecycle types/statuses; Goal Pause/Resume/Cancel/Delete/Continue; policy settings/review cadence; recurring materialization, attribution, shortfall, carry-forward/overdue, suppression; acceptance replacement, release/movement, Found Time/tags/live loop; new Structure authoring or Goal-scoped G2 work inspector; broad Summary/Review redesign; recovery; schema/dependencies; capability retirement/removal. Existing routes and canonical APIs remain supported.

**Required regressions:** reproduce and then prevent F1 for both present preferred and absent maximum; title edit preserves unavailable links and measurement metadata; preserve advanced footprint/period Priority data; stale Goal/Demand writes leave draft and accepted authority intact; partial multistep/persistence failure and retry create no duplicate request; switch Goal/request while evaluation is pending; search/filter/Back with ≥24 Goals; undated/no-request creation; existing explicit completion versus Progress separation; retain existing Network+ 10h/20h, realization role, history and Summary Back regressions unchanged. Assert navigation/filtering causes no planning/lifecycle writes.

**Full Mobile Acceptance Gate:** production browser 320/390/768/1280px, reduced height, practical ~44px primary controls, no document overflow, no hover/double/right-click dependency, progressive disclosure, validation visibility/error association, keyboard tab order and visible focus, semantic names/headings and non-color-only states, save/cancel/Back focus and draft restoration, zoom/reflow, equivalent underlying records across widths. Use disposable storage. Report limits honestly; no physical-device/screen-reader certification without performing it.

**Bundle/completion:** all repository gates pass without source-wide cleanup or threshold change; initial gzip ≤170,000 bytes and all other hard limits; record advisories and fresh before/after metrics. Complete only when F1 is regression-protected, untouched valid records round-trip, failures/drafts/Back are safe, bounded list works, full mobile gate passes, existing authorities/history/compatibility remain unchanged, and a separate RESULT proves these outcomes. Do not title its result as full Goal Lifecycle completion.

## 18. Final completion determination and integrity

The audit distinguishes executable behavior, product reachability, accepted but unimplemented lifecycle semantics, absent evidence fields and genuinely unresolved supersession authority. Browser failures are findings, not failed audit execution. No implementation or retirement occurred.

Final hash comparison: all **977** baseline files remain present and byte-identical; this RESULT is the only new unignored repository file. Starting task and externally supplied lifecycle architecture hashes remain unchanged. Final HEAD remains `c0cc9ae2ae68af626e64747539a417f10df1cf3a`; final git diff whitespace check passes. Pre-existing dirty work and forensic repository artifacts are preserved.

**Task 9.23 — Goals Lifecycle & Product Convergence Readiness Audit V1 is COMPLETE.**

**The task is complete when repository evidence establishes what Goals already supports, what the accepted lifecycle requires, and the smallest safe next implementation slice—without changing product authority, weakening compatibility, or rewriting history.**
