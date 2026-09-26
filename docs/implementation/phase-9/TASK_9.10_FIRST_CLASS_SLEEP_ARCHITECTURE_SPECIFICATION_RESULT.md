# Task 9.10 — First-Class Sleep Architecture Specification RESULT

Date: 2026-09-17. Scope: architecture specification only. Evidence is the working tree based on `c0cc9ae2ae68af626e64747539a417f10df1cf3a`, including the pre-existing Task 9.8B/9.9 changes. No implementation is delivered here.

## 1. Executive Decision

**Proposed — canonical V1 decision:** **For First-Class Sleep V1, Sleep SHALL be represented as a dedicated authored `SleepRequirementV1`, with deterministic required Sleep occurrences resolved before discretionary Capacity and ordinary movable Commitment placement.**

**Required:** Sleep is temporally flexible but not optional. Authored exact duration and protected buffers must be satisfied whenever the bounded authored temporal problem is feasible. Work, fixed/locked Commitments, manual Events and realized productive/support/protection facts retain their authority. Their genuine incompatibility with Sleep produces explicit blocking Friction; it does not authorize silent displacement, shortening, omission or fabricated Capacity.

**Proposed:** V1 has one primary Sleep requirement per active setup, one continuous occurrence per applicable canonical owner day, exact duration, explicit clock or Work-relative valid windows, and explicit off-day fallback. It has no numeric scheduling priority, no automatic biological inference, no split Sleep and no one-off omission/shortening override. Ordinary `Omit Sleep` ceases to be legal for first-class Sleep. Users retain direct authority to edit or disable their requirement prospectively. Reporting that no Sleep actually occurred remains legal.

**Required:** This specification selects the semantics for later implementation. The later change must also record the narrowly specified architectural revision in an ADR and update the older Commitment/Capacity wording, as required by the charter. This document does not claim that the old architecture files, schemas or runtime have already changed.

## 2. Evidence Standard and Repository Scope

Current-state claims use **Confirmed**, **Inferred**, or **Not Found**. Target rules use **Required**, **Proposed**, or **Deferred**. A paragraph/table introduced with a label inherits that label unless a cell explicitly supplies another. “Proposed” identifies a selected design choice, not an unresolved implementation choice; within this V1 specification it is normative. “Required” identifies a constraint imposed by the task or existing invariants.

**Confirmed:** The repository was already dirty. A SHA-256 inventory of 868 tracked/untracked nonignored files was captured before writing this RESULT. Existing changes include geometry, decisions, publication, constructive UI, tests, earlier RESULTs and the dogfood PDF. They are not Task 9.10 changes. No applicable `AGENTS.md` was located in this workspace. Exact incident databases and original dogfood inputs were not supplied; the unresolved forensic claims in 9.8C remain unresolved, without preventing a prospective architecture decision.

**Confirmed — evidence index.** Paths below are relative to `code/src/`; named symbols are the evidence locators. Tests are corroboration, not proof of product reachability.

| Ref | Production owner and evidence | Corroborating tests / document |
|---|---|---|
| E1 | `state/createInitialDayFrameState.ts::normalizePersistedDayFramePattern`, `normalizePersistedBlockTemplates`; `core/blocks/types.ts`; `ui/CommitmentSection.tsx`, `SetupScreen.tsx` | `state/tests/dayFrameStore.test.ts`; `ui/tests/DayFrameApp.test.tsx` |
| E2 | `core/blocks/generateBlockCandidates.ts`; `placeBlockCandidates.ts`, including `getPlacementSearchWindow`, `placeDeferredSleepCandidates`, `findNearestSleepAnchor` | `core/blocks/tests/{generateBlockCandidates,placeBlockCandidates}.test.ts` |
| E3 | `core/engine/{generateSchedulePreview,reviseSchedulePreview}.ts`; `core/time/{canonicalUserDay,physicalOccupancy}.ts`; `core/cycles/resolveEffectiveSchedulePreferences.ts` | `core/engine/tests/{generateSchedulePreview,preMigrationCorrectness,workRelativeFootprint}.test.ts` |
| E4 | `core/friction/{detectScheduleFriction,generateSuggestedFixes,applySuggestedFix}.ts`; `core/decisions/{createPlanDecisionAcceptanceCandidate,replayPlanDecisions,planDecision}.ts`; `ui/acceptedDecisionPresentation.ts` | Friction tests; `core/decisions/replayPlanDecisions.test.ts`; E3 regressions |
| E5 | `core/occurrences/{occurrenceIdentity,durableOccurrenceReference}.ts`; `state/planDecisionSurface.ts` | Durable-reference and decision tests |
| E6 | `core/planning/capacity.ts::{deriveCapacity,exclusionContributors,liabilityValues}`; `state/capacitySurface.ts::queryCapacity`; `state/allocationSurface.ts` | `core/planning/capacity.test.ts`; `state/capacitySurface.test.ts` |
| E7 | `state/{proposalSurface,realizationSurface}.ts`; `core/planning/{proposal,acceptedAllocationRealization,realizedScheduleIdentity,demandResourceFootprint}.ts` | Proposal, realization, footprint and constructive workflow tests |
| E8 | `state/{planningScopeQuery,publicationEligibility,schedulePublication,historicalPlanSurface}.ts`; `core/historicalPlan/{historicalPlan,materializePlanPublication,historicalPlanValidation,historicalPlanProjection}.ts` | Materializer, publication, historical surface and readiness tests |
| E9 | `state/todayQuery.ts`; `core/today/buildTodayReadModel.ts`; `core/execution/executionRecord.ts`; `state/executionHistorySurface.ts` | Today and execution record/history tests |
| E10 | `state/{historicalIntelligenceQuery,goalProgressQuery}.ts`; `core/historicalIntelligence/`; `core/monthlyPlanner/queryMonthlyPlanner.ts` | Historical intelligence, Goal Progress and monthly planner tests |
| E11 | `state/{dayFrameStore,activeV2,dayFrameProfiles,dayFrameBackupV12,dayFrameRestoreComposition}.ts`; earlier backup translators | Store, profiles, backups V3–V12, restore tests |
| G1 | `docs/architecture/ARCHITECTURE_CHARTER.md`; `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`, domain categories / Commitment / lifecycle | Architectural authority and ADR requirement |
| G2 | `docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md` | Demand-neutral intervals, liabilities, source provenance |
| G3 | `docs/architecture/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md` | One Commitment type plus relationships; activity/protection distinction |
| G4 | `docs/architecture/CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_SPECIFICATION_RESULT.md` | Proposal/accepted/realized separation; direct actions |
| P1 | `docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md` | Prior audit, including explicit incident-evidence limitations |
| P2 | `docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AUTHORITY_CONVERGENCE_V1_RESULT.md` | Geometry/authority corrections; first-class Sleep explicitly deferred |

## 3. Current-State Sleep Architecture

**Confirmed [E1–E11]:** Sleep is a `BlockTemplate` with category `sleep`, ordinary recurrence, fixed/flexible placement, duration, priority 1–5, buffers, reschedule behavior and optional resources. A fresh normalized setup has empty templates; a universal newly seeded Sleep requirement is not present. Users author Sleep through Commitment/setup forms. Category alone does not create mandatory authority.

**Confirmed — complete production Sleep-discriminator inventory found by the repository-wide search:**

| Discriminator | Current effect / owner |
|---|---|
| ID `default_sleep`, exact title `Sleep`, category `sleep`, daily recurrence, disabled state, 480 minutes, beforeSleep/beforeWork preference, autoSameUserWeek, priority 1, no resources, after-buffer absent/60 and unchanged timestamps | `normalizePersistedBlockTemplates` re-enables a narrowly recognized legacy default. This is a normalization special case, not a general Sleep requirement. |
| Category `sleep` + `beforeWork` | Missing same-owner Work returns no initial placement; ordinary non-Sleep candidates can fall back to available time. |
| Category + daily recurrence + flexible placement + beforeWork + no Work | Deferred placement propagates an existing matching template's Sleep anchor after ordinary candidates have run. |
| Same template ID + category + flexible placement + flexibleTemplate anchor | Chooses a preceding matching Sleep anchor first; otherwise a following one. The preceding preference is not a global closest-distance optimization. |
| Category `sleep` versus Work source/anchor | `detectScheduleFriction` emits Sleep/locked-Work guidance about moving Sleep or reducing a buffer. |
| Category enum / presentation | Execution and historical validators allow `sleep`; Commitment form/projection labels it; monthly planner maps it to Sleep evidence/counts, with the same display rank as Commitments. |
| Preference named `beforeSleep` | Generic placement uses the day/window end, not a resolved Sleep occurrence. It is not a Sleep-domain relationship. Setup/projection expose the label. |
| Ordinary template type, recurrence, priority, skip/reduce decision policy | No first-class Sleep discriminator: Sleep inherits these behaviors. Suggested Fix generation recognizes fitness-like categories specially, but has no required-Sleep omission or shortening prohibition. |

**Confirmed [E2–E4]:** Placement orders hard accepted placements before other candidates, then ordinary candidate ordering. Daily off-day Sleep is deferred. This cannot guarantee all required Sleep before competing movable content. Work, manual Events and realized facts supply occupancy; 9.9 retained full cross-midnight custom-window geometry and fixed manual/realized corrective occupancy. Work-relative paths and ordinary corrections still have range/window assumptions; these are not a canonical Sleep solver.

**Not Found [E1–E11]:** A dedicated authored Sleep source, exact requiredness contract, Sleep-specific Capacity qualification, bounded Sleep override, joint required-Sleep feasibility proof, Sleep publication source family or first-class historical Sleep requirement snapshot. No separate hidden template subtype or title-only placement branch was found. This search conclusion is bounded to this source snapshot.

## 4. Current Sleep Lifecycle Map

**Confirmed — all rows [E1–E11].** “Generic” means the ordinary Commitment path is inherited by Sleep.

| Transition | Semantic owner; input → output | Authority / persistence | Sleep behavior / inherited behavior | Test evidence |
|---|---|---|---|---|
| Author → recurrence | Setup/store; BlockTemplate + BlockRecurrence → active authored setup | Authored; active V2, profile pattern, backup | Sleep category/legacy normalization; otherwise generic authoring | Store / DayFrameApp |
| Recurrence → candidate | generateBlockCandidates; template/recurrence/context → BlockCandidate | Disposable derived; no independent store | Generic daily/weekday/week slots; unsupported custom/per-segment recurrence is not a Sleep primitive | Candidate tests |
| Candidate → placement | placeBlockCandidates; candidates + Work/manual/realized occupancy → DraftScheduledBlock or unplaced candidate | Derived schedule projection | Work-relative/off-day special cases; generic priority, fixed/flexible semantics and buffers | Placement / engine tests |
| Schedule → Friction | detectScheduleFriction; schedule/unplaced → FrictionPoint | Derived Preview data | Sleep/Work message; generic overlap and unplaced rules | Detector tests |
| Friction → fix | generateSuggestedFixes; conflict/context → SuggestedFix[] | Advisory | Generic move/reduce/skip/accept rules; no mandatory Sleep guard | Suggested Fix tests |
| Fix → decision | reviseSchedulePreview / acceptance mapper → Try revision / PlanDecision | Try disposable; explicit accepted decisions durable | Generic place/omit/duration/priority; move identity checked using durable occurrence | Fix / acceptance / replay tests |
| Decision → regeneration | replayPlanDecisions; authored lifetimes + decision → replay outcomes/candidates | Accepted bounded decision; regenerated derived output | Generic stale/blocked/outsideWindow; no Sleep-specific omit guard | Replay / 9.9 tests |
| Preview → Review | planningScopeQuery/readiness; current Preview/authority → read model | Query only | Sleep visible as block/Friction; generic acceptance and blockers | Review / workflow tests |
| Review → publication | publicationEligibility + materializer + historicalPlanSurface → immutable batch | Explicit bounded published authority; IndexedDB | Sleep as template snapshot; generic scheduled/unplaced/omitted states | Publication / materializer tests |
| Published → Today | todayQuery/buildTodayReadModel → published current-day items | Read-only historical source | Generic Sleep category; no generated fallback | Today tests |
| Today/report → execution | execution commands; durable reference + user assertion → append-only execution record | User-reported historical evidence; execution store | Generic completed/partial/skipped, optional actual time/duration | Execution tests |
| Publication/execution → History/Summary | historical queries → completion/realization views | Durable inputs; disposable analysis | Generic category/occurrence analysis; Goal Progress is separate | History / Progress tests |

## 5. Current Sleep Authority Assessment

**Confirmed:** Work is immovable in ordinary corrective scheduling. Sleep template authority varies with fixed/flexible placement, accepted placement and priority. Generic fixes can reduce flexible Sleep, change its priority or omit an unplaced candidate. `omitOccurrence` presentation produces `Omit <title>`; execution `skipped` is a separate assertion. Published Sleep is immutable template history, not a new authored Sleep requirement [E1–E5,E8,E9].

**Confirmed:** Capacity subtracts scheduled template activity/buffers. Unplaced Sleep enters `ordinaryCommitment` liabilities. Accepted unrealized Goal claims are liabilities; realized productive/support/buffer facts are exclusions. `capacitySurface` currently obtains scheduling inputs from Preview [E6].

**Inferred:** Stronger defaults alone would leave multiple policy owners—priority sorting, deferred propagation, generic corrections, publication—and cannot enforce the task's governing principle reliably.

## 6. Representation Alternatives

**Proposed — evaluated choices:**

| Option | Assessment | Decision |
|---|---|---|
| A Ordinary Commitment with stronger defaults | Cheap migration, but priority is relative ordering, not requiredness; omission/shortening and ordinary liability semantics remain. | Reject. |
| B Specialized Commitment | Could work with a complete requiredness/mobility subtype, but would revise the single ordinary Commitment model and every subtype consumer; category-based dispatch would remain easy to misuse. | Reject for V1 in favor of an explicit separate source. |
| C Dedicated SleepRequirement | Explicit authoring and source lifetime; direct deterministic realization like Work; clear Capacity/Friction/history contracts; migration is real but bounded. | Select. |
| D General TemporalRequirement | No demonstrated second consumer needing the same duration/window/biological requirement rules. Creates a framework before evidence warrants it. | Defer abstraction; do not create it in V1. |
| E Existing Work, constraint, Goal Demand, composition, or accepted allocation primitive | Work owns externally fixed geometry; constraints can validate but do not supply Sleep occurrence/execution identity; Demand owns no time; composition describes relationships; accepted allocations authorize discretionary work. | Reuse their geometry/provenance conventions, not their semantic identity. |

**Required:** A separate source does not create a fifth architectural object category. The requirement is Authored; occurrence/solution is Derived; publication and execution are Historical; analysis is Derived Analytical [G1].

## 7. Canonical First-Class Sleep V1 Representation

**Proposed:** `SleepRequirementV1` is a revisioned authored constraint and time requirement. `SleepOccurrenceV1` is its deterministic day coordinate with duration/window/buffer obligations. `ScheduledSleepOccurrenceV1` is a successful full-geometry solution, not a Goal realization record. A user authors the recurring obligation directly; no constructive Proposal or per-day acceptance is required to project that authority into a schedule [G4].

**Required:** Reuse durable source incarnation, canonical user-day resolution, physical occupancy, dependency fingerprints, explicit publication and append-only execution. Never create an ordinary template shadow for a converted requirement. A projection into a shared calendar display is allowed; dual persistence/dual candidate generation is not.

**Proposed:** Dedicated identity costs new validators, persistence versions and consumers, but makes authority, Capacity and history explicit. It avoids distorting Goal Demand or composition and avoids speculative temporal-requirement infrastructure.

## 8. Sleep Authored Intent

**Proposed — field decisions:**

| Candidate field | Classification | V1 rule |
|---|---|---|
| enabled | Required V1 | Explicit user control; absent requirement means no authored Sleep guarantee, not an invented default. |
| durationMinutes | Required V1 | Exact positive elapsed minutes; see §9. |
| preferred duration | Rejected | No second competing duration meaning in V1. |
| minimum acceptable duration | Deferred | No automatic target-to-minimum relaxation. |
| valid window / relationship to Work | Required V1 | Discriminated clock/beforeWork/afterWork intent. |
| preferred start | Required V1 as optional preference | Soft clock preference for clock mode; relative modes derive immediate-before/after preference. |
| earliest start / latest end instants | Derived | Expand valid-window intent against owner context; no daily manual geometry required. |
| Work-relative search span | Required V1 | Authored maximum elapsed span; form can present 1,440 minutes as a visible editable initial value, never a hidden constraint. |
| off-day clock fallback | Required V1 for Work-relative modes | Needed even when current range contains Work every day; no inference from placed neighbors. |
| effective dates / applicable weekdays | Required V1 | Effective-from label, optional exclusive end, all days or explicit weekday set. |
| cycle-specific applicability/duration override | Deferred | V1 derives anchors from current cycle; no competing per-cycle Sleep rules. Explicit date-effective revisions can express different requirements. |
| numeric priority | Rejected | Requiredness is semantic; it is not priority 0 or priority 1. |
| protection before/after | Existing and Reused semantics | Explicit nonnegative minutes; zero is valid. Separate from Sleep duration. |
| actual wind-down/wake-up activity | Deferred attachment endpoint extension | Real activity remains a Commitment, not a buffer pretending to be performed. |
| transition behavior | Derived | One fixed owner/context rule; no transition heuristics or automatic shortening. |
| IDs/incarnation/revision/timestamps | Existing and Reused conventions | Source lifetime and revision provenance, not user-entered scheduling preferences. |

**Required:** “Eight hours before Work” authors duration and relative intent. Work geometry determines the preferred interval. The user need not type an overnight interval for each shift. Any valid-window limit that can cause infeasibility must be visible in the requirement editor.

## 9. Sleep Duration Semantics

**Proposed:** V1 duration is exact elapsed minutes, integer 1–1,440 inclusive. This is an application representation bound, not a health recommendation. Required before/after protection is additional. Different context-dependent target/minimum durations are deferred. A date-effective authored revision may change exact duration, but the engine never chooses the change.

**Required:** The solver may move a full occurrence inside its valid domain; it may not shorten, split or omit it. Insufficient room for exact duration plus protection is incompatibility when proved, not permission to place a shorter block. A proposed future minimum/target system would need explicit user authority and separate deficit semantics; V1 has neither.

**Required:** Actual duration is independently reported. Six actual hours against an eight-hour plan changes execution evidence only. Planned eight hours cannot silently become six because the user often reports six.

## 10. Sleep Window and Ownership Semantics

**Proposed — precise V1 geometry:** All intervals are half-open `[start,end)`. Durations and Work-relative spans use elapsed minutes. Civil clock expansion uses the canonical temporal context. Buffers are part of the required footprint; the entire footprint must fit the valid window and avoid hard occupancy.

1. An occurrence is owned by the applicable canonical user-day **label**, selected by the requirement's date range/weekday rule. Its owner is not recomputed from its scheduled start or end.
2. For `beforeWork`, choose the earliest Work start among Work occurrences with that owner label; ties use durable Work identity. The valid footprint window is `[workStart − spanMinutes, workStart)`. Preferred Sleep end is `workStart − afterBuffer`.
3. For `afterWork`, choose the latest Work end among those same-owner occurrences; ties use durable identity. Window is `[workEnd, workEnd + spanMinutes)`. Preferred Sleep start is `workEnd + beforeBuffer`.
4. If there is no Work owned by the label, use the explicitly authored fallback clock window. Never skip the requirement, take a neighboring placement as authority, or silently switch from beforeWork to afterWork.
5. Clock mode: resolve the start clock on the owner's civil label; when its clock is earlier than that owner's effective day-boundary clock, use the next civil date. Resolve end as the first strictly later occurrence of its end clock. Equal start/end clocks mean a full civil day. Preferred Sleep start is an optional clock expanded on that same clock-window cycle; otherwise earliest footprint-fitting start. A preference outside the legal start domain is clamped for ranking only, never expands the valid window.
6. Enumerate minute-aligned physical start instants for Sleep activity whose full footprint fits. Exact elapsed duration is preserved over offset transitions. Reuse the existing JavaScript local-Date interpretation through the canonical temporal owner: a repeated local clock selects its earlier instant and a nonexistent clock advances by the timezone gap. Materialize and fingerprint the effective timezone/offset interpretation, including this policy; enumerate physical minute instants so both repeated-hour instants remain available to the solver. A changed environment/timezone invalidates derived geometry. Unsupported or unresolvable temporal context yields `contextIncomplete`, never silently a 24-hour day.
7. Boundaries are owner/projection coordinates, not containment constraints. An occurrence may start before or end after its owner window, civil midnight, cycle boundary and display/publication range. It retains one identity.

**Proposed:** Work-relative span accepts integer 1–4,320 minutes. Before/after buffers each accept 0–1,440 minutes. Structural validation rejects a footprint longer than its authored relative span. Clock-window fit is evaluated for each actual day, including offset changes; valid intent can therefore have a dated feasibility conflict. These finite bounds permit complete finite start-domain enumeration without imposing owner-day containment.

**Required:** All physical Work intervals, not merely those sharing the Sleep owner, constrain collision detection. Split shifts choose only an anchor preference; every split shift remains a hard exclusion. No minimum waking interval or compensatory sleep-debt rule is inferred in V1.

## 11. Sleep and Capacity

**Required:** Foundational Sleep resolution precedes Capacity. The dependency graph is acyclic:

```text
Authored sources + canonical context + accepted hard decisions + realized facts
  → Work / hard occupancy + Sleep occurrence domains
  → joint Sleep solution or typed conflict/unknown
  → ordinary movable Commitment resolution
  → demand-neutral Capacity
  → Goal feasibility / competition / allocation / Proposal
```

**Proposed:** Extend the Capacity schedule-input contract with `sleepResolution` rather than disguising Sleep as `DraftScheduledBlock`. Successful activity contributes occupied exclusions with source family `sleepRequirement`; buffers contribute protection. Reuse union/complement geometry and user-day-owned Capacity interval splitting. Count overlap once in totals while preserving all contributor provenance.

**Required:** Infeasible, stale or incomplete foundational resolution makes the affected planning result `nonAllocatable`; geometric openings may be shown as diagnostic only. A required unresolved Sleep occurrence must not be a merely qualified ordinary liability from which Goal planning can borrow time. V1 conservatively blocks constructive allocation for the whole affected planning-data result until resolved; unrelated independently evaluated scopes remain usable.

**Proposed:** Capacity may consume a disposable schedule projection, including Preview's shared derivation result, but cannot rely on whether a UI happened to generate or display Sleep. The canonical orchestration query ensures foundation resolution first. Capacity never calls Goal feasibility to decide where Sleep belongs.

## 12. Sleep and Work

**Required:** Satisfy both when feasible. Work remains fixed. Search every legal Sleep position, including physical cross-owner positions. If no joint solution exists, expose `SleepFeasibilityConflictV1` with exact Sleep references, hard constraint references, valid windows, required footprint, dependency fingerprint and proof scope. Friction is the user-facing projection of this proven incompatibility.

**Proposed:** The conflict identifies Work contributors without claiming Work is wrong or movable. Corrections can edit authored Work, edit Sleep intent, or release an explicit accepted Sleep pin; automatic Work movement is forbidden. Acknowledgement may dismiss a notification but cannot set the conflict to resolved or permit publication.

## 13. Sleep and Ordinary Commitments

**Required:** Ordinary movable Commitments cannot displace required Sleep. Place them after Sleep and retain unresolved ordinary liabilities if they do not fit. Their priority does not cross the Sleep requiredness boundary. Suggested Fix may move the movable Commitment and should prefer doing so to changing Sleep's valid placement.

**Required:** Fixed/locked Commitments, manual Events, and exact accepted occurrence placements are hard temporal constraints. Try alternate valid Sleep geometry around them. If no solution exists, retain both authorities and surface blocking Friction. A fixed Commitment is not made movable by labeling Sleep biological.

**Proposed:** An ordinary flexible Commitment's preferred clock is soft; a fixed placement or accepted exact placement is hard. Existing accepted duration/priority changes do not themselves lock geometry. Composition movement restrictions remain intact; a component cannot be peeled from a locked composite merely to make Sleep fit.

## 14. Sleep and Goal Planning

**Required:** Goal Demand owns no time. Feasibility sees Capacity after Sleep; competition is competition for remaining Capacity, not Friction with a requirement. Proposal geometry overlapping reserved Sleep is invalid/stale derived output and must be rejected at acceptance.

**Proposed — change handling:**

| Stage when Sleep/Work truth changes | Result |
|---|---|
| Before Proposal | Regenerate Sleep, Capacity, feasibility and allocation. |
| Proposal not accepted | Mark old dependencies stale; regenerate or supersede Proposal; no authority lost. |
| Accepted but unrealized | Preserve Accepted Allocation and its full claims. Mark realization eligibility `reviewRequired` on relevant fingerprint mismatch. Claims remain accepted liabilities; do not turn them into physical Sleep blockers or silently cancel them. |
| Revalidation after acceptance | Recompute foundation and compare every accepted productive/support/buffer claim against it. If compatible, explicit realization can proceed using fresh validation and immutable original acceptance provenance. If incompatible, realization/publication remains blocked. |
| Already realized | Preserve all facts as hard occupancy; use §15. |

**Proposed:** Add an explicit withdrawal operation for an entire **unrealized** Accepted Allocation, with expected revision/fingerprint and durable decision provenance, if the existing proposal owner does not already supply it. Withdrawal is a user decision, never automatic stale cleanup. Partial withdrawal is deferred. Replanning creates a new Proposal/acceptance identity. New authored Sleep does not rewrite the old acceptance; old acceptance does not authorize realization through current required Sleep.

## 15. Sleep and Realized Goal Work

**Required:** Existing realized work, support and protection are hard inputs. Their immutable origin and exact geometry survive a Sleep edit. The solver first searches other valid Sleep positions. If none fit, create explicit post-realization Friction and block publication for the affected new plan.

**Proposed:** V1 Suggested Fix cannot move or delete realized Goal facts. The existing realization architecture's autonomous-movement prohibition remains. Resolution in Sleep V1 is an explicit change to Sleep/Work/fixed authored constraints that restores compatibility, or an independently authorized future schedule-revision workflow. This specification does not invent automatic re-realization. Retirement/movement of realized facts is deferred; until such a command exists, the conflicting plan correctly remains blocked. Existing acceptance and historical publications survive throughout.

## 16. Sleep and Support Activities / Buffers

**Required:** Realized support activity owns activity time and may be executed. Realized buffer protection excludes time but cannot receive activity execution or Goal Progress. Both constrain Sleep with the entire accepted footprint. No component may disappear to fit Sleep.

**Proposed:** Sleep's own before/after numeric protection reuses current buffer semantics and receives deterministic component IDs derived from the Sleep reference and side. It is not extra Sleep duration. Real wind-down or wake-up activity must remain real Commitment activity; first-class Sleep as a composition attachment endpoint is deferred. Independent fixed support activity is already a hard exclusion; ordinary movable support respects its existing composite mobility rules after Sleep resolution.

## 17. Sleep and Friction

**Required:** Distinguish proven incompatibility, incomplete context, stale evidence and a failed heuristic. Only a complete negative feasibility result establishes required-Sleep Friction. Invalid authored fields are validation errors. A resource-limited solver result is `searchIncomplete`, not `infeasible`.

**Proposed:** Friction severity for proved required-Sleep incompatibility is blocking; `canIgnore=false` for publication purposes. Store no independent authoritative Friction record: derive the conflict from current dependencies and preserve its snapshot only within accepted correction/publication provenance where applicable. Flexible competing content is repositioned first; mere coexistence with a preferred Sleep location is not Friction. A boundary crossing has no conflict severity.

## 18. Sleep and Suggested Fix

**Required:** Suggested Fix remains corrective. It cannot create Goal work, a new Sleep requirement, or an accepted override implicitly. Try is disposable; only explicit acceptance can create a bounded correction decision.

**Proposed:** Allowed Sleep correction is a full-duration move within the valid domain that leaves the entire joint Sleep/hard-constraint problem feasible. Prefer moving conflicting lower-authority content. Accept a Sleep move through a new typed PlanDecision payload with durable Sleep reference, requirement revision, current foundation fingerprint and exact proposed start. Revalidate the complete affected solution at acceptance and replay; never reuse the current template-only acceptance mapper unmodified.

**Required:** Shorten, omit, reduce protection, change requiredness and change priority are not first-class Sleep Suggested Fix actions. Editing the requirement or Work is direct authoring, clearly labeled and reviewed as such. Acknowledgement is informational, not acceptance of invalid geometry.

## 19. Sleep Override Semantics

**Proposed — decisive V1 choice:** No one-off Sleep omission, shortening or protection-waiver override exists in V1. `SleepOverride` persistence, replay and expiry are therefore **Deferred**. Ordinary `Omit Sleep` is forbidden for a first-class source at suggestion generation, acceptance, replay, Capacity and publication boundaries; hiding its button alone is insufficient.

**Required:** Explicit prospective requirement editing/disabling remains lawful authored intent and creates a revision. It cannot be invoked by `acceptConflict`, generic omit, learning, or migration. It does not rewrite earlier required occurrences or publications. There is no “Allowed with accepted override” publication path in V1; incoming unknown override-shaped data is unsupported/protected, not permission.

**Proposed:** Accepted exact Sleep placement is a bounded correction, not an override: it preserves duration, valid window and protection. Its scope is one reference/owner day. Revoke or replace it explicitly using the existing decision-owner pattern. A stale pin is retained as evidence, not applied; pending review blocks publication of that occurrence until explicitly revoked or replaced.

## 20. Sleep and Publication

**Required:** Publication is explicit and freezes the requirement revision, full solved occurrence, buffers, context, applied decision provenance and dependency fingerprint. It does not persist Preview as authored truth. All relevant required occurrences must be satisfied; unresolved, stale, incomplete or unreviewed accepted authority blocks publication.

**Proposed:** Add a typed Sleep snapshot and a versioned boundary-context manifest to publication. The owner-day record contains the canonical occurrence; intersected-day views reference it rather than create another occurrence. For Sleep owned outside the publication range but physically overlapping it, freeze a read-only boundary-context snapshot with its actual owner and provenance. This does not claim that the outside owner's entire day was published.

**Required:** A publication whose owner is inside the range preserves the full ending outside the range. It must never truncate or duplicate the occurrence. A subsequent publication is a new immutable batch; it does not mutate old plan truth or execution links. Adjacent effective publications must agree on shared Sleep occurrence geometry. If new geometry differs, publication requires an explicitly widened atomic publication scope covering the affected owner and previously published intersected days; the command reports that required scope rather than silently broadening it.

## 21. Sleep and Today

**Required:** Today consumes effective published Sleep and boundary-context references, not regenerated fallback. Supply title, planned interval/duration, owner label, physical overlap with the viewed day, protection, publication ID/time, execution status, and plan provenance. A current authored conflict may be shown as a separate “new plan needs review” fact; it does not taint or replace the earlier publication.

**Proposed:** V1 override status is always `notSupported`, never a misleading “overridden” badge. Generated Sleep may appear in Planner/Review with generated provenance, but cannot masquerade as Today plan truth. Display a cross-day occurrence where physically useful while deduplicating execution and totals by durable identity/publication evidence.

## 22. Sleep and Execution

**Required:** Planned and actual Sleep are different facts. Reuse append-only assertion/correction/retraction and completed/partial/skipped outcomes. Sleep execution references the immutable publication snapshot plus durable Sleep occurrence reference; a transient generated ID is insufficient. A publication-context copy is retained in the assertion so later source removal does not erase meaning.

**Proposed:** For V1, extend the existing execution subject/snapshot union with first-class Sleep and an explicit publication occurrence locator. Optional actual start and elapsed duration use existing manual evidence semantics. The UI can accept an end and normalize to elapsed duration; conflicting entered duration/end is rejected. Neither value is filled from the plan without the user expressly asserting it. Unknown is absence of an effective assertion, not zero duration.

**Required:** Unplanned Sleep uses the existing unplanned execution subject, category `sleep`, and user-reported actual evidence; it does not require authoring a requirement or fabricating a publication. Do not attach an unplanned nap automatically to the nearest planned occurrence.

## 23. Sleep and Progress

**Required:** Sleep execution does not automatically become Goal Progress. No demand, Goal, measurement definition or observation is created by authoring, publishing or executing Sleep. If the user explicitly creates a Sleep-related Goal, its independently authored measurement/observation policy determines Progress. V1 provides no automatic execution-to-measurement conversion.

## 24. Sleep and History

**Required:** Preserve five distinguishable evidence classes: current/revisioned authored requirement; immutable published requirement-and-plan snapshot; accepted move/revocation provenance; actual execution assertion chain; and original legacy template history. One-off override evidence is not a V1 class because overrides are not supported.

**Proposed:** Summary queries aggregate planned required minutes and reported actual minutes separately; unknown actual minutes remain unknown. Deduplicate boundary-context copies. Group published planned occurrence counts by frozen owner; unplanned execution by captured actual-start user day where supplied, otherwise explicit reported owner. Any physical-day duration distribution is a separate labeled clipped aggregation, not a second occurrence count. No medical score or inferred recovery/debt metric belongs in V1.

## 25. Sleep and Learning

**Required:** Observations and derived tendencies never weaken an explicit requirement. Future learned recommendations may suggest editing preferences, with evidence and explicit acceptance that invokes the authoring command. Learning cannot silently change duration, window, applicability, enabled state or buffers. Historical non-execution is neither an override nor proof of reduced biological need.

**Deferred:** Sleep pattern learning, wearable input, sleep-stage analysis and health advice. No V1 learning store/API is necessary beyond preserving truthful inputs.

## 26. Cycle / Shift Transition Semantics

**Proposed — deterministic transition rules:**

| Transition | Rule |
|---|---|
| Day → Evening; Evening → Night; Night → Day | Derive each owner day's relevant Work anchor, then solve all affected Sleep domains jointly against all physical Work. Never carry the previous shift's placed Sleep offset as authority. |
| Work → off | Use the off-day owner's authored fallback clock window. |
| Off → Work | Use that Work owner's before/after anchor; previous Sleep may cross into it and participates in joint feasibility. |
| Cycle A → B / manual segment → segment | Context is the existing effective context for the owner label. An occurrence crossing the transition does not change source, split, or inherit a second requirement. |
| Repeating sequence | Resolve Work using that cycle mode's canonical generation; do not synthesize manual-segment preference overrides. |
| Day Boundary change | Recompute owner-window context and clock expansion; keep requirement/day identity; stale pins require review. Preserve full physical geometry when valid. |
| Week-start change | Does not change daily/weekday Sleep identity; only relevant downstream weekly context/fingerprints change. |

**Required:** A short canonical day does not shorten Sleep. Two adjacent required occurrences that cannot both fit despite joint search produce a genuine dated incompatibility; the engine must not arbitrarily sacrifice one. Cross-shift preference differences alone are not proof of infeasibility.

## 27. Planning-Horizon Edge Semantics

**Required:** Planning Data Horizon, Proposal Horizon, Review Scope, Preview Range, Publication Range and Calendar Navigation remain distinct. A smaller view is a projection of a common planning-data solution; it is not a new Sleep optimization problem. Calendar navigation cannot change Sleep ownership or authorize new work.

**Proposed — finite V1 planning contract:** The planning-data request specifies a finite owner-label horizon H and authoritative context coverage. Expand all required occurrences owned in H to their **full** valid domains. Also include as guard occurrences applicable owner labels outside H whose valid domains can physically intersect H's canonical instant envelope. Compute this finite guard set from authored maximum spans and canonical clock expansion, not a hard-coded one-day pad. Resolve every selected guard occurrence with its full domain, too. Load all hard occupancy overlapping the union of selected full domains, including crossing Work, fixed events, accepted pins and realized footprints. Missing source/context coverage yields `contextIncomplete`; no geometry is clipped to H.

**Proposed:** Solve this finite H-plus-guards problem jointly. Its proof is expressly scoped to those occurrences and complete hard inputs; it makes no claim about feasibility of an infinite recurrence. Do not recursively demand the entire infinite connected graph of daily flexible windows. Already published Sleep owned outside H pins the corresponding guard occurrence to its frozen geometry when it overlaps H; if that reference is not in the selected guard set, its overlapping footprint is an external hard exclusion. Never count the same published Sleep both as a variable and as an exclusion against itself. Published Sleep owned inside H may be re-derived for a new explicit publication; its old snapshot remains immutable and is compared at the publication seam check. Other accepted exact geometry remains a hard constraint when it overlaps. Unpublished further-future choices acquire no authority from this calculation. Extending H creates a new derived problem/fingerprint and may reposition **unpublished, unpinned** Sleep; it is not a retroactive change to accepted/publication truth. Publication seam checks in §20 prevent incompatible independently solved ranges from acquiring authority.

**Required:** A view edge never makes a selected occurrence unplaceable. Guard-only incompatibility is reported with its outside owner and exact proof scope, not falsely attributed to a visible day's requirement. A complete unsatisfiable augmented problem is still a real bounded conflict, not “no slot before the screen ends.” H-extension instability is visible as changed derived context, not silently concealed as stable accepted geometry. No guarantee of global feasibility for unknown future Work is asserted.

## 28. Sleep Identity

**Proposed:** Extend the canonical durable-occurrence union with `{ sourceKind: 'sleepRequirement', requirement: { id, incarnationId }, coordinate: { scopeKind: 'userDay', userDayDate, slot: 0 } }`. New variant versioning must not reinterpret old template references.

**Required:** Identity excludes physical start/end, title, priority, view range and week start. Requirement revision and effective cycle/segment/Work anchor are provenance/dependency fields, not another occurrence identity. Deletion/recreation or profile activation creates a new incarnation; stale references never retarget. A date-effective edit preserves the same logical day reference where applicable but changes required revision/fingerprint. The published snapshot locator distinguishes successive immutable plans for that same occurrence.

## 29. Persistence Model

**Proposed:** Persist requirement revision records in the active authored aggregate, with one head/source lifetime and nondecreasing effective-from labels. An update at the same future effective date appends a new revision that supersedes the previous revision for derivation, retaining every previous revision; for equal effective dates the highest revision is effective. It does not create two effective requirements. A revision's effective interval ends at the next revision or explicit end. Store accepted Sleep move/revocation decisions in the canonical PlanDecision authority, not the requirement. Store publication snapshots and execution in their existing authority owners.

**Required:** Derived domains, solutions, conflicts, Capacity and Preview are disposable. A cache may persist only with exact dependency/policy keys and cannot be used as authority after failed validation. Profiles contain reusable Sleep pattern values without live incarnations, acceptance, publication or execution. Profile activation allocates fresh lifetimes and makes old decisions inapplicable. Full backup preserves authority and lineage; portable profile application is not restore.

**Proposed:** Extend active/profiles/backup versions and staged restore/clear settlement together. Do not add an independently written localStorage Sleep key that can diverge from active authored state. Validate references before promotion; malformed/unsupported data is protected with exportable raw evidence, not reset to no Sleep.

**Proposed — persistence classification:**

| Object | Classification |
|---|---|
| Sleep requirement and revisions | Authored + Persisted |
| Sleep occurrence and derived placement | Derived + Disposable |
| Sleep Friction and Suggested Fix | Derived + Disposable |
| Accepted valid Sleep move / revocation | Accepted + Persisted |
| Sleep omission/shortening override | Deferred; no V1 record |
| Published Sleep and requirement snapshot | Published + Immutable |
| Actual Sleep assertion/correction/retraction | Execution + Historical |

## 30. Existing-Data Migration

**Proposed — conservative migration:** Structural envelope migration adds an empty first-class requirement collection and preserves every legacy template, recurrence, decision, publication and execution record unchanged. It does **not** infer biological requiredness, even for `default_sleep`. The legacy normalizer's conjunction is evidence of old defaults, not user consent to new mandatory semantics.

**Required:** Category `sleep` is a migration candidate; title alone is never sufficient. Show an explicit conversion review with duration, buffers, recurrence, window, off-day behavior, resources, fixed/accepted geometry and historical/Goal/composition links. Users choose conversion or retaining an ordinary legacy Commitment. Retained legacy Sleep is labeled as ordinary planning content, outside the first-class guarantee; do not falsely advertise conversion as complete.

**Proposed:** Conversion atomically creates a new Sleep requirement/incarnation and retires selected future template recurrence generation at an explicit effective owner date. Preserve original sources/history and a migration mapping `{legacy lifetimes, new lifetime, effectiveFrom, commandId}`. Existing ordinary records before that date remain readable. Reject conversion until ambiguous multiple templates/weekly recurrence/fixed-time intent, unsupported resources/attachments or missing off-day fallback are explicitly resolved. Exact fixed geometry can be expressed by a valid footprint window of precisely the authored duration plus buffers; do not silently widen it.

**Required:** Legacy omit/reduce/priority decisions do not become Sleep authority. Preserve them against old references; converted future decisions require explicit review. Valid old exact placements may be proposed as new Sleep pins only after current validation and explicit acceptance. Never count both template and requirement occupancy after the conversion cutover. Profile conversion is a separate explicit edit to its pattern, not a side effect of active conversion.

## 31. Commitment Architecture Compatibility

**Confirmed [G1–G3]:** The older domain wording says Commitments have the highest scheduling authority. The Capacity specification lists a “Sleep Commitment”; composition chooses one Commitment type plus typed attachment relationships.

**Proposed — exact governance revision required before implementation release:** Retain Commitment as an authored time-owning obligation. Replace its unconditional relative scheduling claim with: “Fixed, locked and explicitly accepted Commitment geometry constrains planning; ordinary movable Commitment geometry is resolved around foundational Work and required Sleep before Goal allocation.” Replace Capacity's Sleep-Commitment input row with dedicated Sleep requirement/resolution, including blocking unresolved requiredness. Add SleepRequirement as an authored domain object and Sleep occurrences as derived objects. Do not change Goal authority, historical immutability or the one-type composition model.

**Required:** Record that revision through the charter's ADR/specification-version process in the implementation task. Task 9.10 expressly prohibits creating that second artifact now. The semantic choice is resolved here; governance publication is a sequenced deliverable, not a choice left to coding.

**Proposed — explicit primitive disposition:**

| Disposition | Primitives / rule |
|---|---|
| Reuse | Canonical dates/weekday selection, physical occupancy, half-open interval geometry, buffers, source incarnation, durable-reference equality, execution assertion machinery and explicit publication transaction ownership. |
| Specialize | A daily/weekday Sleep occurrence expansion and reference variant; typed Sleep publication/execution snapshots and accepted valid-placement payload. |
| Replace | First-class Sleep's generic template candidate placement and off-day anchor propagation with full-domain joint feasibility and deterministic placement. |
| Do Not Inherit | Optional placement, numeric priority competition with ordinary activities, skip rescheduling, generic omit/reduce/priority fixes, ordinary unplaced liability semantics, or the generic beforeSleep label as a real anchor relationship. |

## 32. Capacity Architecture Compatibility

**Required:** Preserve interval topology, canonical user-day ownership of Capacity intervals, demand neutrality, source provenance and orthogonal qualification. Sleep occurrences may cross boundaries while the resulting Capacity intervals remain partitioned by canonical day. The physical exclusion is applied to every intersected interval once.

**Proposed:** Add Sleep source contributors, requirement-resolution fingerprint and qualification reasons `requiredSleepInfeasible`, `sleepContextIncomplete`, `sleepSearchIncomplete`, `sleepDecisionReviewRequired`. Existing `staleDependency` and protected-authority handling are reused. Unknown or infeasible Sleep is not an ordinary duration liability. Existing unresolved Commitment and accepted-allocation liabilities remain distinct and are not erased by a successful Sleep result.

## 33. Deterministic Planning Order

**Required — implementation order for each derivation:**

1. Validate ingress, active lifetimes/revisions and explicit planning-data scope; resolve canonical temporal context.
2. Expand Work, manual/fixed/locked Commitments, composition hard footprints, accepted exact decisions, realized facts and immutable publication seams over needed physical coverage.
3. Expand applicable Sleep references and valid domains, including guards; validate accepted Sleep pins and surface stale pin review.
4. Solve required Sleep jointly against hard occupancy. No Goal Demand, Proposal ranking or ordinary movable priority participates.
5. On a complete solution, place ordinary movable Commitments/composites around the full Sleep footprint; retain their unresolved liabilities honestly.
6. Derive demand-neutral Capacity with all current exclusions, protection and accepted unrealized liabilities.
7. Evaluate Goal feasibility, competition, allocation and Proposal; revalidate explicitly at acceptance/realization.
8. Materialize Preview/Review from the same derivation; publish only through fresh shared eligibility checks.

**Proposed — deterministic solver:** Enumerate every legal minute start for each selected occurrence, prune hard collisions, and use complete backtracking/constraint propagation for pairwise footprint disjointness. Variable order: fewest legal starts, then durable-reference lexical order. Rank complete solutions by total absolute deviation from preferred starts, then lexicographic start-instant vector in durable-reference order. First optimize feasibility; never stop with an unplaced occurrence because a greedy early choice was convenient. This finite exhaustive reference algorithm defines correctness; faster equivalent algorithms may replace it only with equivalence evidence and policy versioning.

**Required:** A configured operation budget may return `searchIncomplete`, with no allocatable Capacity or publication. It may not return a negative feasibility proof. Resume deterministically or run to completion; a release that routinely cannot solve supported V1 ranges has not satisfied the governing requirement. Input collection ordering, generatedAt and navigation order cannot affect semantic output.

## 34. Feasibility Versus Placement

**Required:** Feasibility asks whether all selected required footprints can coexist with immutable constraints in their full valid domains. Placement chooses one such complete arrangement. Preferred-start failure is not feasibility failure. A greedy miss is an algorithm limitation, not Friction proof.

**Proposed:** Result variants are `satisfied`, `infeasible`, `contextIncomplete`, `searchIncomplete`, `stale` and `decisionReviewRequired`. Only `satisfied` contains an authoritative-input-derived schedulable solution. `infeasible` includes the complete bounded constraint set or a verified unsatisfiable subset; a minimal explanation is desirable but not required. Never claim a minimal conflict without minimizing it. Stable sorted constraint references identify the report. Diagnostic partial geometry is explicitly non-publishable.

**Required:** Completeness is with respect to the declared minute grid, finite owner/guard set and provided authored valid windows—not arbitrary continuous time or unknown future intent. Those limits are part of the public contract, not hidden failure excuses.

## 35. Sleep State Machine

**Proposed — orthogonal state transitions:**

```text
Absent / Disabled (authored)
  -- explicit create/enable --> Active requirement revision
Active revision / notYetDerived
  -- derive --> contextIncomplete | searchIncomplete | infeasible | satisfied
Any derived result
  -- relevant dependency change --> stale -- regenerate --> fresh result
Satisfied
  -- Try move --> disposable alternative
  -- accept valid move --> bounded PlanDecision -- replay --> satisfied
Accepted pin
  -- incompatible dependency change --> decisionReviewRequired
  -- explicit revoke/replace --> regenerate
Satisfied + all publication checks
  -- explicit Publish --> immutable published Sleep snapshot
Published snapshot
  -- manual report --> completed | partial | skipped
  -- no report --> unknown
Report
  -- correction/retraction --> append-only new evidence
```

**Required:** `overridden` is an unsupported V1 state, not an alias for disabled, conflicted, notYetDerived or execution skipped. Publication/execution are separate objects, not destructive states of the requirement. Editing current intent never transitions old historical truth to stale. Disabling prospective Sleep is an authored revision, not completion, omission, or execution.

## 36. Sleep Authority Matrix

**Required — target authority:**

| Competing Object | Can Move Sleep? | Can Sleep Move It? | Can Conflict Remain? | Resolution Authority | Notes |
|---|---|---|---|---|---|
| Work | Solver may choose a valid alternate Sleep position | No | Yes, blocks new publication | Explicit Work/Sleep authoring or valid Sleep pin revocation | Work geometry fixed |
| Locked Commitment | Solver may choose a valid alternate | No | Yes, blocks new publication | Explicit source/decision editing | No numeric priority override |
| Flexible Commitment | No displacement to serve ordinary preference | Yes, within ordinary mobility | Residual ordinary conflict can remain and block | Ordinary placement / accepted correction | Sleep resolved first |
| Manual Event | Solver may choose a valid alternate | No | Yes, blocks new publication | Explicit Event/Sleep authoring | Reuse canonical timed/all-day occupancy |
| Goal Demand | No | N/A; owns no time | No temporal ownership conflict | Goal feasibility | Uses remaining Capacity |
| Proposal | No | Reject/rederive proposal, not authority | No accepted-authority conflict | Proposal owner | Invalid overlapping option cannot be accepted |
| Accepted Allocation | No direct displacement before realization | No silent withdrawal | Yes, accepted liability blocks | Explicit unrealized revalidation/withdrawal | Preserve original acceptance |
| Realized Goal Work | Solver may choose a valid alternate | No | Yes, blocks new publication | Explicit authored constraint change; future fact-revision owner | All realized geometry preserved |
| Support Activity | Only if fixed/locked/realized | Only ordinary permitted movement if movable | Yes for genuine incompatibility | Composition/source/realization owner | Real activity with its own execution |
| Protected Buffer | Only if its owning footprint is hard | No silent removal; moves only with permitted parent | Yes, blocks when required footprints conflict | Owning source or accepted-footprint authority | Protection is not activity |
| Published Plan | Preserved seam may constrain alternate solution | No historical rewrite | Yes; new publication blocked until seam-compatible | Explicit new publication/scope review | Immutable old batches |
| Actual execution | No retroactive plan movement | Never | Divergence may remain as evidence | Execution assertion owner | No retroactive publication blocker |
| Learned tendency | No | N/A | Advisory difference may remain | Explicit preference authoring only | Cannot weaken Sleep |

## 37. Capacity Matrix

**Required — target model:**

| Temporal Object | Owns Time? | Protects Time? | Subtracts From Capacity? | May Be Moved? | Authority Source |
|---|---|---|---|---|---|
| Work | Yes | Own footprint if defined | Yes | Explicit authoring only | Work pattern |
| Required Sleep | Required duration; solved occurrence owns interval | Before/after buffers | Yes; unresolved blocks allocability | Within valid domain, preserving pins | Sleep requirement |
| Ordinary Commitment | Yes as obligation | If authored buffers | Resolved interval or unresolved liability | According to mobility | Template/recurrence/decision |
| Manual Event | Yes | Per existing semantics | Yes | Explicit Event authoring | Manual Event |
| Goal Demand | No | No | No | N/A | Demand intent |
| Proposal | No | No | No | Disposable derivation | No accepted authority |
| Accepted Allocation | Bounded accepted claims, not yet schedule facts | Claims may include protection | Liability until realized; cannot double allocate | Explicit review/withdrawal before realization | Accepted decision |
| Realized Goal Work | Yes | Associated footprint separate | Yes | No autonomous movement | Realization |
| Support Activity | Yes | Separate buffers possible | Yes / liability before realization | Per source mobility | Commitment or realization |
| Protected Buffer | No activity ownership | Yes | Yes | Only with authorized owning footprint change | Authored/accepted protection |

## 38. Lifecycle Matrix

**Proposed — target lifecycle:**

| Lifecycle Stage | Sleep Representation | Authority | Persisted? | Derived From | Consumed By | Invalidated By |
|---|---|---|---|---|---|---|
| Authored | Requirement revisions | Explicit intent | Yes | User command | Expansion/solver | New revision supersedes prospectively |
| Derived | Occurrence domains / feasibility | Disposable | Cache only | Intent/context/hard facts | Scheduling / Friction | Relevant dependency/policy change |
| Scheduled | Full solved Sleep + protection | Projection of authored authority | Cache only before publication | Complete foundation solution | Ordinary placement / Capacity | Dependency/pin changes |
| Review | Query with statuses and provenance | None added | No | Same solution + authority | User review/publication | Dependency/history change |
| Published | Frozen Sleep snapshot / boundary manifest | Bounded immutable plan truth | Yes | Explicit current publication | Today / execution / history | Never; later batch supersedes effective view |
| Execution | Assertion / correction / retraction | User-reported actual evidence | Yes | Explicit report | History / analysis | Never rewritten; append new assertion |
| History | Publication + decision + execution evidence | Durable original meaning | Yes | Recording events | Summary / learning | Never invalidated by intent edits |
| Learned | Derived tendency | Advisory | Optional disposable cache | Historical evidence | Explicit preference proposal | Evidence/analysis policy change |

## 39. Friction Matrix

**Required — first-class Sleep V1:**

| Scenario | Valid Geometry? | Feasibility Problem? | Friction? | Suggested Fix Allowed? | Publication Blocker? |
|---|---|---|---|---|---|
| Sleep crosses midnight | Yes | No from crossing | No | Not needed | No |
| Sleep crosses Day Boundary | Yes | No from crossing | No | Not needed | No |
| Sleep crosses cycle transition | Yes | Only actual constraints | No from crossing | Not needed for crossing | No from crossing |
| Flexible Commitment occupies preferred Sleep window | Reposition ordinary content | Not for Sleep unless other hard conflict | Only residual ordinary incompatibility | Move flexible Commitment | Only unresolved actual conflict |
| Locked Commitment conflicts with all valid Sleep placements | Individually valid | Yes, proven joint failure | Blocking | Explicit source edit / valid alternative | Yes |
| Work makes Sleep requirement impossible | Individually valid | Yes | Blocking | Authoring review; no automatic shortening | Yes |
| Goal Proposal would consume Sleep capacity | Invalid proposed allocation | Goal feasibility/staleness | Not accepted-authority Friction | Regenerate Proposal | Proposal itself does not block; acceptance forbidden |
| Realized Goal work conflicts after Sleep edit | Facts valid individually | Yes if no alternative Sleep fit | Blocking | Edit authored constraints; no fact movement | Yes |
| User explicitly overrides Sleep | Unsupported V1 input | No override semantics | Validation/protection, not a resolution | No | Yes if used to justify missing Sleep |
| User later reports no actual Sleep | Valid execution evidence | No retroactive planning failure | No planning Friction | No planning correction implied | No retroactive blocker |
| Solver/context incomplete | Not established | Unknown | Not proved | Obtain context/continue computation | Yes |

## 40. Suggested Fix Matrix

**Proposed — V1 policy:**

| Suggested Action | Ordinary Sleep Friction | Work/Sleep Infeasibility | Post-Realization Conflict | Allowed V1? | Authority Required |
|---|---|---|---|---|---|
| Move Sleep within valid window | Yes if complete solution preserved | Cannot solve a proved no-solution without another change | Yes if a feasible alternative exists | Yes | Explicit accepted pin for corrective move |
| Move flexible Commitment | Preferred | Cannot remove Work conflict | Only movable non-realized content | Yes | Ordinary permitted derivation / accepted fix |
| Move realized Goal work | No | No | No | No | Future explicit realized-schedule revision |
| Remove Goal work | No | No | No | No for realized facts | Future explicit retirement; unrealized withdrawal is separate |
| Shorten Sleep | No | No | No | No | Explicit requirement authoring, not Suggested Fix |
| Omit Sleep | No | No | No | No | No V1 override |
| Acknowledge unresolved conflict | Informational | Informational | Informational | Yes as notification only | No resolution/publication authority |
| Edit authored Sleep requirement | Route to editor | Route to editor | Route to editor | Yes direct action | Explicit versioned authoring |
| Edit Work Pattern | Route to editor | Route to editor | Route to editor | Yes direct action | Explicit Work authoring |

## 41. Current-vs-Target Gap Matrix

**Confirmed current [E1–E11]; Proposed target:**

| Concern | Current Architecture | Target First-Class Sleep V1 | Gap Type | Implementation Consequence |
|---|---|---|---|---|
| Domain identity | Template/category | Dedicated source + durable variant | New Domain Primitive | Extend validators/reference unions |
| Authored state | Template fields | Revisioned required intent | Semantic Change | Dedicated authoring owner |
| Placement | Generic greedy + propagation | Complete bounded joint foundation solver | Semantic Change | Remove converted-source special cases |
| Capacity | Template exclusion/liability | Sleep solution prerequisite | Extension | New inputs/reasons/fingerprint |
| Work interaction | Window heuristics, overlap detector | Fixed Work + required Sleep feasibility | Semantic Change | Full physical context and proof |
| Commitment interaction | Relative ordering | Movable content after Sleep | Semantic Change | Preserve fixed/accepted constraints |
| Goal planning | Capacity after generic Preview | Mandatory Sleep freshness through realization | Extension | Revalidation and accepted-review path |
| Friction | Generic overlap/unplaced | Typed requirement incompatibility vs unknown | Extension | Blocking proof-based reason |
| Suggested Fix | Generic skip/reduce/priority | Only valid full-duration correction | Semantic Change | Guard every authority boundary |
| Publication | Template snapshot | Requirement + solution + seam manifest | Migration | Versioned materialization/readiness |
| Execution | Generic template subject | Published Sleep reference + unplanned evidence | Extension | Versioned subject/snapshot |
| History | Template semantics | New typed evidence; legacy retained | Compatibility Adapter Required | Mixed-version projection |
| Persistence | Active/profile V2; backup V12 | Coordinated versioned Sleep support | Migration | Restore/clear/rollback integrity |
| Migration | No first-class conversion | Explicit reviewed conversion | Migration / UI Exposure | No category/title auto-promotion |

## 42. Canonical First-Class Sleep V1 Invariants

**Required:**

1. Sleep has an explicit source kind, lifetime and durable occurrence identity.
2. Authored requirement and derived scheduled occurrence are different objects.
3. A valid active requirement is mandatory within its applicable owner scope.
4. Temporal flexibility never implies optionality.
5. Exact elapsed duration is preserved; only explicit authoring changes intent.
6. The engine never silently shortens, splits, omits or weakens protection.
7. Civil midnight crossing is valid.
8. Canonical Day Boundary crossing is valid.
9. Cycle or view boundary crossing alone is not Friction.
10. Ownership is one canonical label/slot, independent of moved geometry.
11. All physically overlapping hard occupancy constrains placement regardless of owner.
12. Joint feasible Sleep requirements are solved before ordinary movable content.
13. Required Sleep participates before discretionary Capacity.
14. Demand owns no time and cannot consume reserved Sleep.
15. Proposal cannot displace required Sleep.
16. Accepted allocations remain evidence; stale eligibility never silently cancels acceptance.
17. Realized productive/support/protection facts are not silently moved or deleted.
18. Support activity is activity; buffers are non-executable protection.
19. Proven Work/Sleep incompatibility is explicit blocking Friction.
20. A greedy miss or interrupted search is not proof of infeasibility.
21. Ordinary Omit Sleep and shortening fixes are illegal for first-class Sleep.
22. V1 has no bounded omission/shortening override; prospective source edits are explicit.
23. Accepted placement corrections are occurrence-bound, validated and incarnation-safe.
24. Stale derivation or correction cannot acquire publication authority.
25. Unresolved required Sleep cannot become allocatable Capacity or a valid publication.
26. Publication is explicit, bounded and immutable, retaining full cross-boundary geometry.
27. Adjacent publications cannot silently publish contradictory geometry for one occurrence.
28. Planned and actual Sleep remain independent.
29. Non-execution, partial execution and unplanned Sleep are valid evidence.
30. Execution never retroactively invalidates the Published Plan.
31. Missing execution is unknown, not zero or completion.
32. Sleep duration never automatically credits Goal Progress.
33. Learning cannot silently weaken authored requirements.
34. Legacy historical plans keep original semantics and source references.
35. Conversion never creates duplicate future template and Sleep ownership.
36. Reuse canonical temporal/physical occupancy owners; UI is not a geometry or authority owner.
37. Equivalent dependencies/policy/scope produce identical semantic results.
38. No infinite-future feasibility claim is inferred from a finite planning-data solution.

## 43. Domain Model Specification

**Proposed — conceptual types, not production code.** `Lifetime`, date/instant, policy and fingerprint aliases reuse existing validated conventions. All listed fields are required unless marked `?`. Requirement/decision fields persist; derivation fields do not persist as authority; publication/execution fields freeze permanently.

```ts
type SleepWindowIntentV1 =
  | { kind: 'clock'; startClock: TimeString; endClock: TimeString;
      preferredStartClock?: TimeString }
  | { kind: 'beforeWork' | 'afterWork'; spanMinutes: number;
      offDay: { startClock: TimeString; endClock: TimeString;
        preferredStartClock?: TimeString } };

type SleepRequirementV1 = {
  version: 1;
  id: string;
  incarnationId: SourceIncarnationId;
  revision: number;
  enabled: boolean;
  effectiveFrom: LocalDateString;
  effectiveUntilExclusive?: LocalDateString;
  weekdays: 'all' | Weekday[];
  durationMinutes: number;
  window: SleepWindowIntentV1;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  createdAt: string;
  updatedAt: string;
};

type SleepOccurrenceReferenceV1 = {
  version: 1;
  sourceKind: 'sleepRequirement';
  requirement: Lifetime;
  coordinate: { scopeKind: 'userDay'; userDayDate: LocalDateString; slot: 0 };
};

type SleepOccurrenceV1 = {
  reference: SleepOccurrenceReferenceV1;
  requirementRevision: number;
  requiredMinutes: number;
  protection: { beforeMinutes: number; afterMinutes: number };
  validWindow: { startsAt: string; endsAt: string };
  preferredStartsAt: string;
  context: { ownerWindow: CanonicalUserDayWindowSnapshot;
    workAnchor?: DurableWorkOccurrenceReference; temporalFingerprint: string };
};

type ScheduledSleepOccurrenceV1 = SleepOccurrenceV1 & {
  startsAt: string;
  endsAt: string;
  footprintStartsAt: string;
  footprintEndsAt: string;
  appliedDecisionIds: string[];
};

type SleepResolutionV1 = {
  version: 1;
  policy: { id: 'required-sleep'; version: 1 };
  ownerHorizon: UserDayRange;
  guardReferences: SleepOccurrenceReferenceV1[];
  physicalCoverage: { startsAt: string; endsAt: string };
  dependencyFingerprint: DependencyFingerprintV1;
  occurrences: SleepOccurrenceV1[];
  result:
    | { status: 'satisfied'; scheduled: ScheduledSleepOccurrenceV1[] }
    | { status: 'infeasible'; conflict: SleepFeasibilityConflictV1 }
    | { status: 'contextIncomplete' | 'searchIncomplete' | 'stale'
        | 'decisionReviewRequired'; reasonCodes: string[]; referenceIds: string[] };
};

type SleepFeasibilityConflictV1 = {
  id: string; // hash of sorted proof inputs, scope and policy
  sleepReferences: SleepOccurrenceReferenceV1[];
  constraints: TemporalConstraintEvidence[];
  proof: { kind: 'completeFiniteSearch'; policyVersion: 1;
    ownerHorizon: UserDayRange; guardReferences: SleepOccurrenceReferenceV1[];
    inputFingerprint: string };
};

type AcceptedSleepPlacementPayloadV1 = {
  target: SleepOccurrenceReferenceV1;
  expectedRequirementRevision: number;
  expectedFoundationFingerprint: string;
  startsAt: string;
}; // envelope reuses decision ID, time, acceptance and revocation provenance

type PublishedSleepSnapshotV1 = {
  sourceFamily: 'sleepRequirement';
  reference: SleepOccurrenceReferenceV1;
  requirementSnapshot: SleepRequirementV1;
  scheduled: ScheduledSleepOccurrenceV1;
  resolutionFingerprint: string;
  policy: { id: 'required-sleep'; version: 1 };
}; // introduced as a new tagged historical occurrence version

type SleepPublicationContextV1 = {
  boundaryOccurrences: PublishedSleepSnapshotV1[];
  // only outside-owner occurrences physically intersecting publication scope
  canonicalOccurrenceLocators: PublishedOccurrenceLocator[];
};

type PublishedSleepExecutionSubjectV1 = {
  kind: 'planned';
  reference: SleepOccurrenceReferenceV1;
  publication: PublishedOccurrenceLocator;
}; // existing execution outcome, actualTime, correction/retraction are reused

type LegacySleepConversionV1 = {
  commandId: string;
  legacyTemplate: Lifetime;
  legacyRecurrences: Lifetime[];
  requirement: Lifetime;
  effectiveFrom: LocalDateString;
};
```

**Proposed — field contract (applies to every field above):**

| Field group | Meaning / authority / validation | Invalidation and persistence |
|---|---|---|
| version, sourceFamily, policy | Required exact supported discriminators; algorithm versions enter fingerprints | Persist for authoritative snapshots; unsupported versions protect ingress |
| id/incarnation/reference/coordinate | Unique source lifetime; slot exactly 0; valid date; no ID reuse | Persist source and historical references; lifetime mismatch blocks decisions, never retargets |
| revision/effective dates | Positive monotonic revision; valid nonempty intervals; one effective revision per date | Persist revisions; invalidate affected date domains and downstream artifacts |
| enabled/weekdays | Explicit boolean; all or nonempty unique weekday set | Persist; applicability changes stale affected occurrence results |
| duration/protection/span | Integer bounds from §§9–10; full footprint fit required | Persist intent; any change stales derived dependencies/pins |
| clock/preferred fields | Valid clock strings; preferred optional and soft; fallback required in relative mode | Persist intent; canonical expansion supplies actual instants |
| timestamps | Valid UTC creation/update recording instants; never solver ranking inputs | Persist audit metadata; metadata-only change does not alter geometric fingerprint |
| validWindow/preferredStartsAt/context | Derived full interval, effective owner window, optional Work anchor, temporal interpretation | Disposable; any semantic dependency change stales |
| startsAt/endsAt/footprint* | Minute-aligned instants; exact required duration; exact buffer offsets; legal domain and no collision | Disposable scheduled output; frozen in publication |
| appliedDecisionIds | Unique current accepted pins actually used, never a Try ID | Derived list; historical copy persists provenance |
| horizon/guardReferences/coverage/fingerprint | Complete finite proof scope and semantic input identity | Disposable; scope/coverage changes stale result; snapshots freeze provenance |
| result/status/reasons/referenceIds | Discriminated result; no success geometry on a non-success branch | Derived; reason codes must identify missing coverage, budget stop or exact stale reference |
| constraints/proof | Constraint evidence contains durable source reference, role, full interval or occurrence domain, source revision and fingerprint | Derived proof; no claim of minimality; stale on changed input |
| expected* / target / startsAt payload | Explicit accepted move, one source/day; current revision/fingerprint and jointly feasible geometry | Persist through PlanDecision; mismatch produces review, not implicit rebinding |
| requirementSnapshot/scheduled/resolutionFingerprint | Exact effective intent and complete planned solution at publication | Immutable historical fields; validate internal agreement |
| boundaryOccurrences/locators | Deduplicated outside-owner context and canonical snapshot locators `(batchId, ownerDay, reference, snapshotFingerprint)` | Immutable batch manifest; seam validation required |
| execution publication locator | Exact plan used for the report; copied plan context retained | Immutable assertion; correction reuses subject identity and appends evidence |
| migration mapping | Explicit conversion lineage and cutover, unique command ID | Persist in authored migration provenance; never rewrite legacy history |

**Proposed:** Reserve active V3, profiles V3, backup V13, PlanDecision V2 and execution-record V2 envelopes for the described changes. Publication introduces batch V2/day-context V2 and occurrence snapshot V4 for Sleep while retaining snapshot V1–V3 readers. New Sleep references use their own source-kind tag with variant version 1; unknown source kinds remain protected by old readers. These are schema specifications only, not migrations performed by this task.

**Required:** Validators enforce at most one active primary source per setup and at most one effective requirement per owner. No optional field supplies biological defaults. A no-requirement result is explicit `notConfigured`, distinct from `satisfied` for an enabled requirement. Disabled/nonapplicable days produce no required occurrence, with applicability explanation available to Review.

## 44. Command / Query Specification

**Proposed — operations owned by domain/state surfaces, not UI:**

| Operation | Input → output | Authority / side effects / persistence | Idempotence |
|---|---|---|---|
| Author/update/disable Sleep | Command ID, expected head revision, effective date, intent → revision or typed validation/stale/storage result | Direct authored write to active aggregate; invalidates derived state only | Same command ID/content returns original result; mismatch rejects |
| Query effective requirement | Source/day/as-of authored head → effective revision or disabled/notConfigured/notApplicable | Read-only | Pure for same authority |
| Derive Sleep occurrences/resolution | Scope + complete dependency snapshot + policy → SleepResolution | Pure deterministic derivation; no durable authority | Same semantic input yields same result |
| Query Sleep feasibility/scheduled Sleep | Current scope/fingerprint → typed resolution/projection | Reuses derivation; no independent solver/authority | Pure/cache keyed by fingerprint |
| Try corrective move | Current conflict/reference/start → disposable complete candidate or rejection | Reuse Preview revision boundary; no persistence | Pure for same input |
| Accept/revoke Sleep placement | Command ID, expected revision/fingerprint, exact payload/decision ID → accepted decision or rejection | Extend PlanDecision owner; explicit durable bounded decision | Existing command-ID discipline; no duplicate pin |
| Resolve Sleep Friction | No new generic mutation | Invoke authoring, accepted move/revocation, or ordinary correction and rederive | No `resolved=true` authority switch |
| Withdraw unrealized Accepted Allocation | Command ID, accepted ID/expected state, explicit reason → withdrawal decision or realized/stale rejection | Proposal authority owner; whole allocation only; preserve evidence, release active liability | Repeat command returns same withdrawal; realized facts reject |
| Convert legacy Sleep | Command ID, exact legacy lifetimes, cutover, reviewed intent → new requirement + mapping or rejection | Atomic staged authored conversion; no history rewrite | Mapping/command ID prevents double conversion |
| Publish schedule range | Existing range/fingerprint + Sleep solution/seam context → immutable batch or blockers | Extend existing publication owner; explicit transaction | Same complete semantic publication remains no-op |
| Record/correct/retract Sleep execution | Existing report command + published Sleep locator or unplanned subject + actual evidence → assertion result | Existing execution authority, append only | Existing subject/replacement/command discipline; no duplicate effective head |
| Query historical Sleep | Range/as-of/evidence coverage → planned/actual/unknown with original provenance | Extend history query; no writes | Deterministic for same immutable inputs |

**Required:** Mutation preconditions include healthy relevant ingress and fresh expected state. A failed post-commit verification does not promise “nothing changed”; preserve 9.9 commit-certainty/protection outcomes. No global “fix Sleep” command may choose an authority-lowering action on the user's behalf.

## 45. Invalidation Rules

**Required:** Invalidation is dependency-based and prospective. Never invalidate or rewrite historical publication/execution. The table specifies the conservative affected planning-data result; narrower safe invalidation is an optimization, not a semantic change.

| Change | Sleep derivation | Capacity / Goal feasibility / Proposal | Preview / Review / publication readiness |
|---|---|---|---|
| Sleep duration/window/buffer/applicability/enabled/revision | Stale for affected domains/guards; pins need review on mismatch | Stale; accepted unrealized claims retained/revalidated | Stale; blocked until fresh complete solution |
| Work Pattern / cycle / segment / shift definition | Stale where anchor or physical exclusions/context changed | Stale | Stale; no history mutation |
| Day Boundary / timezone interpretation | Stale domains/context and relevant pins | Stale intervals and fingerprints | Stale; full geometry must be rechecked |
| Week start | No identity change; stale only if consumed effective context changed | Stale weekly consumers as applicable | Conservative review refresh; no automatic Sleep move |
| Fixed/locked Commitment / manual Event | Stale where physical footprint intersects domains | Stale | Stale; recheck conflicts |
| Ordinary movable preference/priority | Foundation unchanged unless hard authority changes | Recompute ordinary occupancy/liabilities then Capacity | Regenerate ordinary Preview/review |
| Accepted Goal allocation before realization | Sleep geometry unchanged; claim-review qualification refreshed | Liabilities/feasibility/Proposal stale | Accepted liability blocks publication until realized/withdrawn |
| Realized Goal productive/support/buffer fact | Stale where physical occupancy intersects domains | Stale | Stale; never delete facts |
| Accepted Sleep move/revocation | Stale joint solution and pins | Stale | Stale until replay validated |
| New adjacent publication | Recheck seam constraints | Stale if physical seam affects scope | Recheck atomic publication scope |
| Execution / Progress report | No ordinary plan geometry change | No automatic released Capacity | Refresh reporting only |
| Solver policy version | Stale caches | Stale downstream semantic results | Fresh validation required |

## 46. Publication Rules

**Required — deterministic eligibility in addition to existing shared blockers:**

| Sleep state / geometry | V1 publication result |
|---|---|
| All relevant requirements satisfied, current, seam-compatible | **Allowed**, if other ordinary publication checks pass. |
| Required Sleep conflicted/infeasible | **Blocked**. |
| Required Sleep “explicitly overridden” | **Blocked** as unsupported V1 authority; no accepted-override path. |
| Sleep derivation stale | **Blocked**. |
| Context/search incomplete or stale pin awaiting review | **Blocked**. |
| Outside owner, physically overlapping publication | **Allowed** only with full validated boundary-context snapshot and compatible existing seams; otherwise **Blocked**. |
| Owner inside, ending outside publication | **Allowed** with full snapshot and seam check; no clipping. |
| Owner/footprint entirely outside scope and no guard dependency | **Not Applicable**. |
| No configured/enabled/applicable requirement | **Not Applicable** to Sleep eligibility; explicitly report absence, not satisfaction. |
| Legacy ordinary Sleep retained | Ordinary Commitment eligibility applies; no first-class guarantee claimed. |
| User acknowledges incompatibility | **Blocked**, unchanged. |

**Required:** The same pure eligibility evaluator serves Review, command preflight and materializer. The command rechecks source fingerprint and history integrity immediately before commit. Pending Proposal is not itself a blocker; unresolved accepted claims remain blockers. All protection, Try-revision rejection and uncertain-commit behavior established in Task 9.9 remain intact.

## 47. Execution / History Rules

**Proposed — truthful manual evidence:**

| User report | Assertion / interpretation |
|---|---|
| Completed as planned | `completed`; user may expressly confirm actual start/duration equal planned. Outcome alone does not synthesize measured duration. |
| Completed with different duration | `completed` with asserted actual minutes, retaining original planned minutes. Outcome is a user report, not the engine's biological judgment. |
| Completed at different time | Assert actual start (and duration if known); do not move the published interval. |
| Partially completed | `partial`, optional positive actual minutes/start; no invented remainder. |
| Not completed | `skipped`; actual duration may be explicitly zero. Never require a plan omission first. |
| Unplanned Sleep | Independent unplanned subject/category; optional actual evidence; no requirement/publication fabricated. |
| Unknown / not reported | No effective assertion; unknown is retained in aggregates. |

**Required:** Corrections/retractions use one stable execution subject and preserve prior assertions. A republished occurrence does not automatically duplicate execution or rebind an old assertion: the stored publication locator records the plan reported against. Queries can associate the same durable occurrence across publications while retaining that locator. Re-reporting against another publication requires explicit correction, not a second invisible head.

**Proposed:** Manual actual duration accepts integer 0–1,440 minutes, with zero meaningful for explicit non-execution and positive duration for performed Sleep. Invalid combinations such as `skipped` with positive duration are rejected; `completed`/`partial` without quantitative evidence remain valid. Broader multi-day execution is deferred, rather than silently truncating evidence.

## 48. Migration Assessment

**Proposed — classifications and required implementation action:**

| Schema family | Classification | Action |
|---|---|---|
| Active authored state | Versioned Migration Required | Successor to active V2 with Sleep revisions/conversion provenance; preserve legacy arrays. |
| Backup | Versioned Migration Required | Successor to V12 covering all new authority and reference variants; legacy import translator preserves absence. Reject lossy downgrade when new Sleep authority/history exists. |
| Profile | Versioned Migration Required | Successor to profiles V2 with portable Sleep pattern; strip/allocate lifetimes correctly. |
| Preview result | Additive Change | Typed Sleep resolution/solution, fingerprint and blockers; no persistence authority migration. |
| Durable occurrence reference | Additive Change + Compatibility Adapter Required | New source-kind/version support throughout equality, resolution and validation; old refs unchanged. |
| PlanDecision | Versioned Migration Required | Sleep placement/revocation payload with validation; old template omission/duration records remain legacy. |
| Proposal / Accepted Allocation | Additive Change + Compatibility Adapter Required | Sleep dependencies in decisive input fingerprint; durable unrealized withdrawal decision/review status; old acceptance retained, revalidated. |
| Realized Goal facts | No Change | Existing role/geometry authority remains; shared occupancy consumption changes. |
| Publication | Versioned Migration Required | Typed Sleep occurrence snapshot plus boundary context and seam-safe batch validation. Mixed old versions readable. |
| Execution | Versioned Migration Required | New published Sleep subject/snapshot locator; old V1 assertions remain untouched and readable. |
| History store/read indexes | Versioned Migration Required + Compatibility Adapter Required | Mixed-version validation/indexing for new publication manifests and execution records; no historical semantic conversion. |
| Capacity | Additive Change / policy version change | Disposable result contract/reasons/fingerprint; no durable Capacity authority. |
| Goal Progress / measurement | No Change | No automatic Sleep credit. |
| Learning / overrides | Deferred | No new persistent authority in V1. |

**Required:** Migration is staged, validated, restart-safe and idempotent, retaining raw legacy/protected evidence. Active conversion, profile conversion and full restore have distinct lineage semantics. Full clear must settle new authority through existing anti-resurrection coordination. No old backup/profile may silently erase live Sleep under a “merge”; replacement must be explicit using existing restore semantics.

## 49. Existing-Test Impact Assessment

**Confirmed current families located; Proposed impact:**

| Existing test family | Classification | Required later coverage / changed assumption |
|---|---|---|
| `state/tests/dayFrameStore.test.ts`, `ui/tests/DayFrameApp.test.tsx`: default_sleep, re-enable normalization, disabled Sleep | Migration Coverage Needed | Preserve old-reader behavior; new requirement never silently re-enabled; explicit conversion and empty first-run state. |
| `core/blocks/tests/generateBlockCandidates.test.ts`: Sleep template recurrence | Still Valid for legacy; Must Be Extended | New Sleep expansion independent of generic template candidate count. |
| `core/blocks/tests/placeBlockCandidates.test.ts`: priority, unplaced, beforeWork/off-day propagation | Semantics Will Change | Retain generic/legacy tests; first-class Sleep uses joint feasibility and explicit fallback. |
| `core/friction/tests/generateSuggestedFixes.test.ts`: Sleep/Medication and Work/Sleep duration reduction/priority/acceptance | Semantics Will Change | Such options absent for new Sleep; enforcement also tested at direct acceptance/replay entry. |
| `core/friction/tests/applySuggestedFix.test.ts`, decision replay/acceptance families: skip/omit | Must Be Extended | Ordinary omission remains; first-class omission rejected; no title-based prohibition on unrelated ordinary objects. |
| `core/friction/tests/detectScheduleFriction.test.ts`: Sleep guidance/unplaced | Semantics Will Change | Proof-based conflict versus unknown; no boundary-only Friction. |
| `core/engine/tests/generateSchedulePreview.test.ts`: beforeWork, off days, edge spill, buffers | Must Be Extended | Keep geometry regressions; change neighbor-propagation expectations for new model only. |
| `core/engine/tests/preMigrationCorrectness.test.ts`, `workRelativeFootprint.test.ts` | Still Valid / Must Be Extended | Preserve 9.9 midnight/noon/cross-boundary physical behavior and all-role occupancy; new source family and joint transition cases. |
| Canonical user-day/cycle tests | Still Valid / Must Be Extended | Variable boundaries, timezone transitions, cycle A/B, Day/Evening/Night pairs, split shifts, week-start identity. |
| `core/planning/capacity.test.ts`, `state/capacitySurface.test.ts` | Must Be Extended | Full Sleep exclusions, unresolved nonAllocatable, no Demand input, union deduplication, guard coverage. |
| Proposal/realization/constructive workflow tests | Must Be Extended | Stale after Sleep edit, full accepted footprint review, explicit unrealized withdrawal, immutable realized conflicts. |
| `core/historicalPlan/materializePlanPublication.test.ts`, historical surface / schedulePublication / readiness tests | Must Be Extended + Migration Coverage Needed | Same blockers through all layers; full snapshot and seam manifest; widening preflight; atomic/uncertain-commit protections. |
| Today / executionRecord / executionHistory tests | Must Be Extended + Migration Coverage Needed | Outside-owner published overlap, stable execution locator, actual zero/partial/unplanned/unknown, no duplicate subjects. |
| Historical intelligence / Goal Progress tests | Still Valid / Must Be Extended | Planned versus actual totals, legacy coverage, no implicit Progress. |
| `dayFrameProfiles.test.ts`, backups V3–V12 / restore tests | Migration Coverage Needed | New envelope roundtrip, old absence, unsupported variants protected, fresh profile incarnations, full clear/restart. |
| UI Sleep category/projection/DayVisualizer tests | Still Valid for presentation; Semantics Will Change for authoring | Full interval rendering survives; first-class editing leaves ordinary Commitment form. |
| Future converted-source tests that require automatic omission, priority-based displacement or neighbor propagation | Should Be Retired as first-class expectations | Preserve legacy adapter assertions where needed; replace with explicit new authority invariants, never merely delete failed guards. |

**Required:** Add adversarial finite-search fixtures where greedy placement fails but a complete solution exists; identical-input/order tests; adjacent-horizon seam tests; scope expansion tests; incomplete-budget tests that cannot publish; all-day/timed hard-event overlap; no double ownership after conversion. Test exact duration and full protection, not only occurrence count or label.

## 50. Implementation Sequencing

**Proposed — minimum dependency-driven sequence:**

1. Record the precise ADR/architecture wording change from §31. Introduce domain/reference validators and pure effective-revision rules. No UI-authored semantic shortcuts.
2. Implement versioned active/profile/backup/restore/clear support and explicit conversion staging. Keep first-class creation gated until all downstream consumers recognize the new source; never ship new authority that old validators can drop.
3. Implement domain expansion, full physical context, deterministic complete solver, typed proof/unknown results, source fingerprints and accepted move replay/revocation. Verify cross-boundary/transition/greedy counterexample fixtures.
4. Integrate ordinary placement and Capacity ordering, then constructive acceptance/realization revalidation and explicit unrealized withdrawal. Preserve all realized roles as hard facts.
5. Integrate Friction and Suggested Fix policy at generation, Try, acceptance and replay—not just labels. Add requirement authoring and conversion review to existing product surfaces.
6. Implement versioned publication snapshots, boundary context, seam-safe scope validation and shared readiness/materializer checks. Preserve all Task 9.9 protection/commit-certainty semantics.
7. Extend Today, manual execution and historical queries/backup for new published Sleep and unplanned evidence; preserve unknowns and separate Progress. Validate mixed legacy/new roundtrips.
8. Hold a **pre-shell publication checkpoint**: author → derive → Capacity → accept/realize Goal → edit Sleep → conflict/review → regenerate → publish → restart → Today/report → Summary, including crossing edges, protected history and failed verification. This checkpoint must pass before Planner/Summary shell migration begins.
9. Enable the complete first-class path and reviewed conversion. Then migrate presentation surfaces using the same commands/queries; retire converted-source placement hacks only after no active first-class source depends on them. Retain bounded legacy compatibility.

**Required:** A partial release must not claim first-class Sleep satisfaction while publication, restore or Goal realization bypasses these rules. Performance validation must demonstrate completion for documented supported planning ranges; merely returning `searchIncomplete` everywhere is not implementation completion.

## 51. Planner / Summary Migration Boundary

**Required — A. Must Exist Before Shell Migration:** canonical source/reference/authoring; safe persistence and legacy conversion; complete Sleep derivation and physical occupancy; Capacity qualification; Goal acceptance/realization freshness; fixed/realized conflict policy; forbidden omit/shorten enforcement; accepted pin review/revocation; shared publication eligibility plus full snapshots/seams; basic published Sleep execution/history queries; protection and mixed-version restore. The §50 publication checkpoint establishes these semantics end to end.

**Proposed — B. Can Be Implemented During Shell Migration:** consolidate Sleep authoring entry points, improve valid/preferred-window explanations, show owner versus physical day, expose reason/provenance links, connect historical selected-day reporting, and render planned/actual/unknown Summary comparisons. These consume existing semantic commands and queries.

**Deferred — C. Can Be Implemented After Shell Migration:** one-off overrides, split Sleep/naps as authored requirements, per-cycle duration rules, true wind-down/wake-up attachments, learned suggestions, medical/device integrations and optimized solvers beyond the verified supported V1 envelope. Unplanned manual Sleep reporting itself is not deferred.

## 52. Open Questions / Deferred V2 Concerns

**Proposed:** No required V1 authority choice is left as “B or C,” “depends on priority,” or UI policy. V1 deliberately excludes one-off overrides, target/minimum shortening, multiple simultaneous primary requirements, automatic shift recovery and realized-fact movement. These are product limitations, not implicit permissions.

**Deferred:** If overrides are added later, they require exact occurrence/revision scope, expiry, accepted provenance, replay freshness and an explicit published exception—not reuse of generic omission. If variable/minimum duration is added, the user must author relaxation authority. If a general temporal requirement is introduced, justify it with another real domain. If travel/timezone policy expands, extend the canonical temporal owner rather than Sleep-local date math. Global infinite-recurrence optimization is not a V1 claim.

**Required:** Governance publication of the selected revision is a later implementation deliverable under G1. Original dogfood incident reconstruction remains an independent evidence limitation from P1; no original incident is newly declared fixed by this specification.

## 53. Validation Record

**Confirmed:** Read-only evidence review and focused current-behavior tests were performed; no production/test/schema/persistence edits, migrations, dependencies, commit or push were made for Task 9.10. No live browser storage was accessed.

Evidence commands executed from the repository root unless noted (long reads were sometimes output-truncated; narrower symbol/section reads supplied the relevant evidence):

```sh
pwd
find .. -name AGENTS.md -print
rg --files -g 'AGENTS.md' -g '*9.10*' -g '*GOVERN*' -g '*ARCHITECT*' -g '*AUTHORITY*'
git status --short
cat /home/sid/.codex/attachments/0d9df2da-bca8-4544-81ea-df44eb6702a2/pasted-text.txt
sed -n '390,710p' /home/sid/.codex/attachments/0d9df2da-bca8-4544-81ea-df44eb6702a2/pasted-text.txt
sed -n '710,1015p' /home/sid/.codex/attachments/0d9df2da-bca8-4544-81ea-df44eb6702a2/pasted-text.txt
sed -n '980,1080p' /home/sid/.codex/attachments/0d9df2da-bca8-4544-81ea-df44eb6702a2/pasted-text.txt
cat docs/architecture/ARCHITECTURE_CHARTER.md
sed -n '304,475p' docs/architecture/DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md
sed -n '1,190p' docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md
sed -n '1,110p' docs/architecture/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md
sed -n '1,120p' docs/architecture/CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_SPECIFICATION_RESULT.md
sed -n '1,105p' docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
sed -n '1,43p' docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AUTHORITY_CONVERGENCE_V1_RESULT.md
rg -n '^##|Sleep|sleep|publication|execution' docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AUTHORITY_CONVERGENCE_V1_RESULT.md
rg -n 'sleep|Sleep|default_sleep' code/src/core code/src/state --glob '!*.test.*' --glob '!**/tests/**'
rg -n 'sleep|Sleep' code/src --glob '!*.test.*' --glob '!**/tests/**'
rg -l 'sleep|Sleep|default_sleep' code/src --glob '*test*'
cat code/src/core/planning/capacity.ts
cat code/src/core/friction/generateSuggestedFixes.ts
cat code/src/core/blocks/types.ts
cat code/src/state/dayFrameBackupV12.ts
sed -n '1,115p' code/src/state/dayFrameProfiles.ts
sed -n '1,190p' code/src/state/createInitialDayFrameState.ts
sed -n '1,165p' code/src/core/execution/executionRecord.ts
sed -n '1,160p' code/src/core/occurrences/durableOccurrenceReference.ts
sed -n '1,130p' code/src/state/capacitySurface.ts
sed -n '1,155p' code/src/core/historicalPlan/historicalPlan.ts
sed -n '1,105p' code/src/core/blocks/placeBlockCandidates.ts
sed -n '415,540p' code/src/core/blocks/placeBlockCandidates.ts
sed -n '748,815p' code/src/core/blocks/placeBlockCandidates.ts
sed -n '1,145p' code/src/core/engine/generateSchedulePreview.ts
cat code/src/state/publicationEligibility.ts
sed -n '1,95p' code/src/core/time/canonicalUserDay.ts
sed -n '1,105p' code/src/state/todayQuery.ts
sed -n '1,90p' code/src/core/today/buildTodayReadModel.ts
sed -n '1,70p' code/src/state/historicalIntelligenceQuery.ts
sed -n '1,70p' code/src/state/goalProgressQuery.ts
sed -n '85,112p' code/src/ui/acceptedDecisionPresentation.ts
sed -n '250,310p' code/src/core/friction/tests/generateSuggestedFixes.test.ts
```

**Confirmed:** Initial guessed paths `code/src/persistence`, `core/execution/types.ts`, `state/dayFramePersistence.ts`, `state/todaySurface.ts`, `state/historicalIntelligenceSurface.ts`, `core/today/queryToday.ts`, `state/dayFrameStorage.ts` and `state/activeAuthored*` did not exist. `rg --files code/src` and symbol searches located the actual owners listed in E1–E11. These failed path probes are not evidence of missing features.

Focused current-behavior verification, working directory `code/`:

```sh
npm test -- src/core/engine/tests/preMigrationCorrectness.test.ts src/core/engine/tests/generateSchedulePreview.test.ts src/core/friction/tests/generateSuggestedFixes.test.ts src/core/planning/capacity.test.ts src/core/historicalPlan/materializePlanPublication.test.ts src/core/execution/tests/executionRecord.test.ts > /tmp/dayframe-910-tests.log 2>&1
```

**Confirmed:** Exit 0; **6 files, 104 tests passed**, duration 648 ms. This validates existing behavior only, not the unimplemented target. No full-suite/build rerun was necessary for a documentation-only addition. Earlier Task 9.9 validation is prior evidence, not claimed as rerun here.

**Confirmed:** Baseline inventory command used `git ls-files -co --exclude-standard -z`, SHA-256 of each existing file, and `/tmp/dayframe-910-baseline.json`. Final comparison checks every baseline hash, removals and newly visible nonignored files. Final verification used the following exact command forms:

```sh
git diff --check
git diff --stat
git diff --no-index --stat /dev/null docs/implementation/phase-9/PHASE_9_TASK_9_10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION_RESULT.md
git diff --no-index --check /dev/null docs/implementation/phase-9/PHASE_9_TASK_9_10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION_RESULT.md
```

The no-index diff returns 1 because the new file differs from `/dev/null`; it emitted no whitespace diagnostics. Ordinary `git diff --check` exited 0. The tracked diff is entirely pre-existing, confirmed by baseline hashes, not merely assumed from filenames. The untracked RESULT was reviewed separately. A Python section check confirmed all 54 required headings in exact order and the exact completion line. The final inventory comparison found **zero changed/deleted baseline files and exactly one added repository file: this RESULT**. Temporary inventory/test logs were confined to `/tmp`.

## 54. Completion Assessment

**Required scope delivered:** current architecture and discriminator inventory; complete lifecycle and authority maps; evaluated alternatives and one selected representation; exact duration/window/owner semantics; demand-neutral foundational Capacity; preserved fixed/accepted/realized authority; finite deterministic feasibility versus placement; forbidden omission/shortening and explicit override deferral; publication/Today/execution/Progress/history/learning contracts; persistence/conservative migration; concrete types, commands, invalidation, matrices, invariants and test impacts; dependency-driven implementation and pre-shell publication checkpoint.

**Confirmed:** This is a specification, not evidence that First-Class Sleep V1 is implemented. The implementation team has concrete semantics and explicit unsupported features; no required authority decision is delegated to the future UI. Governance publication and implementation validation remain future work, as required by this task's no-implementation boundary.

Task 9.10 — First-Class Sleep Architecture Specification is COMPLETE.
