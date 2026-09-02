# Capacity and Proposal Implementation Alignment Audit

## 1. Executive Findings

**Capacity — C3: Partially Implemented.**

- **Confirmed:** No coherent Capacity domain model exists.
- **Confirmed:** The closest implementation is transient geometric opening calculation used while placing an already-authored `BlockCandidate`.
- **Confirmed:** Placement considers occupied Work, manual events, previously placed commitments, buffers, preferred windows, user-day boundaries, and accepted placement decisions.
- **Confirmed:** Openings are neither exposed nor persisted or aggregated, and Goals cannot consume them.
- **Conclusion:** Current availability is placement geometry, not usable planning Capacity.

**Proposal — P3 and P4: Partially Implemented; Friction-Only.**

- **Confirmed:** There is no general constructive Proposal lifecycle.
- **Confirmed:** Preview is a generated schedule projection, not a Proposal awaiting authorization. Its `scheduledBlocks` are represented as scheduled immediately after generation.
- **Confirmed:** `PlanDecision` is durable user authority over occurrence-level modifications, but its interactive creation path begins with a Friction suggested fix.
- **Confirmed:** Supported Friction changes can be tried, accepted, persisted, and replayed.
- **Not Found:** A Capacity → Goal allocation → recommendation → accept/modify/reject → schedule pathway.

**Integration.**

- **Confirmed:** Goals do not consume Capacity and are not inputs to candidate generation or placement.
- **Confirmed:** Goal links attach provenance to independently authored commitments and frozen historical occurrences.
- **Not Found:** Goal priority, effort allocation, scheduling demand, or competition between Goals.
- **Exact first break:** The intended lifecycle breaks immediately after “Commitments shape time.” The implementation computes candidate-specific openings but does not materialize them as Capacity. No Capacity therefore reaches Goal allocation or constructive Proposal generation.

## 2. Current Implemented Planning Lifecycle

```text
Authored active setup
  ├─ Shift definitions/cycles
  ├─ Block templates/recurrences
  ├─ Manual events
  └─ Scheduling preferences
             │
             ▼
Work expansion + recurring BlockCandidate generation
             │
             ▼
Persisted PlanDecision replay against candidates
             │
             ▼
Automatic placement using occupied intervals/open windows
             │
             ▼
Preview containing scheduledBlocks and unplacedCandidates
             │
             ├──────────────► Historical-plan publication
             ▼
Friction detection → corrective fixes → try fix
             │
             ▼
Explicit acceptance where fix maps to PlanDecision
             │
             ▼
Durable PlanDecision + regenerated preview/replay
             │
             ▼
Execution outcome/history and separate Goal Progress reporting
```

**Confirmed:** `generateSchedulePreview` takes authored scheduling inputs and decisions, generates work and candidates, places them, detects Friction, and returns scheduled output (`code/src/core/engine/generateSchedulePreview.ts`, `generateSchedulePreview`, lines 33–251).

**Confirmed:** Goals are absent from `GenerateSchedulePreviewInput`; generation and placement are not Goal-aware.

**Confirmed:** A fresh, unrevised preview is automatically materialized and published into historical-plan state after generation (`code/src/state/dayFrameStore.ts`, `generatePreview`, lines 2170–2220).

## 3. Capacity Audit

**Explicit representation — Not Found.** Targeted searches covered capacity, availability, free/open windows, remaining minutes, allocation, budget, load, and utilization across production code, state, UI, and tests. No Capacity entity, query, command, persisted surface, or UI model was found.

**Implicit calculation — Confirmed, but only as placement geometry.** `placeFlexibleCandidate` constructs a candidate-specific search window, combines Work, manual events, and scheduled blocks into occupied windows, expands occupancy using buffers, derives open intervals, and chooses the feasible start closest to the preference (`code/src/core/blocks/placeBlockCandidates.ts`, lines 380–664).

Properties:

- Scope: one candidate within a user-day/search window.
- Persistence: transient.
- Output: one chosen start or `null`; open windows are not returned.
- Goal-aware: no.
- User-facing: no.
- Aggregated: no.
- Used for placement only: yes.
- Free time versus usable Capacity: not distinguished beyond placement constraints.

| Source | Origin | Owns time in engine? | Affects placement? | Capacity-like effect |
|---|---|---:|---:|---|
| Generated Work | Derived from authored shifts | Yes | Yes | Occupied interval |
| Manual event | User-authored | Yes | Yes | Additional occupied interval |
| Fixed recurring block | Authored template, derived occurrence | Yes once placed | Yes | Fixed occupied interval |
| Flexible recurring block | Authored template, derived occurrence | Yes once placed | Yes | Consumes later openings |
| Sleep template | Authored template | Yes | Yes | Specialized/deferred placement |
| Buffers | Authored on template | Indirectly | Yes | Expands effective occupancy |
| Accepted placement decision | User-accepted override | Indirectly | Yes | Makes exact placement hard |
| Goal | User-authored | No | No | None |

Confirmed placement constraints include duration, priority ordering, fixed/flexible status, preferred/custom windows, work-relative positioning, user-day boundaries, buffers, recurrence coordinates, work-anchor requirements, visible-range clipping, and accepted decisions. They shape candidate feasibility rather than an aggregate planning resource.

**Aggregation — Not Found.** No availability totals were found by occurrence, user-day, week, range, category, Goal, priority, or cycle segment.

**Summary — Confirmed:** Summary/history calculates retrospective scheduling realization and reporting coverage. **Not Found:** remaining opportunity, free-time totals, usable Capacity, Goal capacity share, or allocation metrics. Negative UI assertions protect this boundary (`code/src/ui/tests/HistoricalIntelligenceSummary.test.tsx`, lines 175–190).

**Capacity classification: C3 — Partially Implemented.** Necessary low-level interval geometry exists, but coherent Capacity semantics do not.

## 4. Goal and Allocation Audit

**Confirmed:** `GoalV1` contains identity, revision, descriptive fields, lifecycle state, timestamps, optional target date, optional measurement-policy reference, and exact source-incarnation-aware commitment links. It contains no priority, requested effort, session target, time allocation, or scheduling preference (`code/src/core/goals/goal.ts`, lines 6–35).

Goals are independently persisted and mutated through `goalSurface`; creation, lifecycle changes, updates, and link/unlink operations are revisioned (`code/src/state/goalSurface.ts`, lines 100–235).

Current Goal-to-schedule provenance is metadata linkage:

```text
Goal
  └─ GoalCommitmentLinkV1
       └─ authored source ID + incarnation ID
            └─ independently generated occurrence
                 └─ frozen Goal provenance at historical publication
```

`materializePlanPublication` matches Goal links against durable occurrence references and freezes Goal ID, revision, title, status, and measurement policy into history (`code/src/core/historicalPlan/materializePlanPublication.ts`, lines 139–181).

**Goals influencing generation — Not Found.** Goals do not determine candidate creation, count, duration, recurrence, priority, preferred placement, eligibility, or placement ordering. These values come from `BlockTemplate` and `BlockRecurrence`.

**Allocation — Not Found.** No model exists between Goal and occurrence for effort, target sessions, Capacity share, weighting, Goal priority, or generated scheduling demand. “Allocation failure” references concern technical identifier allocation.

**Confirmed:** Goal Progress is calculated from measurement definitions and explicit progress observations (`code/src/state/goalProgressQuery.ts`, lines 17–75). It is not automatically derived from scheduled or executed Goal-linked occurrences.

## 5. Proposal Audit

**Explicit Proposal — Not Found.** No Proposal entity, collection, persistence surface, generator, authority state, or general accept/modify/reject workflow was found.

**Preview — Confirmed: generated schedule projection, not Proposal.** Preview contains scheduled blocks, is transient, does not mutate authored setup, cannot be rejected as a whole, provides no ordinary placement acceptance, is invalidated when setup changes, and can publish a fresh generated schedule to history (`code/src/state/types.ts`, lines 71–81; `code/src/state/dayFrameStore.ts`, lines 2170–2220).

**PlanDecision — Confirmed: accepted occurrence override, not constructive Proposal.** `PlanDecisionV1` supports place, omit, set duration, and set priority. It retains durable occurrence identity, acceptance time, and `user` or `suggestedFix` provenance (`code/src/core/decisions/planDecision.ts`, lines 27–48).

Decisions are occurrence-scoped, replace prior decisions for the same target, persist independently, survive regeneration, and report missing sources, lifetime mismatches, missing occurrences, unsupported targets, immovable templates, outside-window targets, and blocked placements (`code/src/core/decisions/replayPlanDecisions.ts`, lines 17–187).

**Accepted Choices — Confirmed:** UI presentation of persisted PlanDecisions. The UI tries a Friction fix, maps a successful supported change to a candidate, requests acceptance, persists it, regenerates, and verifies replay (`code/src/ui/DayFrameApp.tsx`, lines 1070–1165).

**Pre-scheduling authorization of new discretionary recommendations — Not Found.** The engine creates no Goal work or other new discretionary demand; it expands and places already-authored commitments.

**Proposal classification: P3 + P4.** Recommendation/acceptance infrastructure is partial, and the wired recommendation loop is Friction-only. The general constructive lifecycle is P5—not implemented.

## 6. Friction Boundary Audit

```text
Attempted generated schedule
  → detectScheduleFriction
  → generateSuggestedFixes
  → classifySuggestedFixes
  → PreviewScreen controls
  → applySuggestedFixToPreview
  → createPlanDecisionAcceptanceCandidate
  → acceptPlanDecision
  → persisted decision
  → regenerate preview
  → replayPlanDecisions
  → applied/blocked/stale result
```

**Confirmed:** Friction requires a conflict, unplaced candidate, or work-required skip (`code/src/core/friction/types.ts`, lines 39–62).

Suggested actions include move, skip, recovery conversion, duration reduction, priority change, fixed-time review, resource addition, and accept conflict. Only move, skip, duration reduction, and priority change map to durable PlanDecisions (`code/src/core/decisions/createPlanDecisionAcceptanceCandidate.ts`, lines 16–105).

Potentially reusable infrastructure includes durable identities, decision IDs, explicit acceptance, provenance, persistence, stale/applicability checks, replay, blocked-state reporting, and accepted-choice presentation.

Friction is not Proposal because it starts from conflict or failed placement, operates on an existing occurrence, recommends corrective mutations, uses fix-specific context, and cannot create a new Goal-driven discretionary allocation.

## 7. Authority and State Transition Audit

| Transition | Authority classification |
|---|---|
| User creates template, recurrence, shift, event, or Goal | Authored |
| Engine expands recurrence/work | Derived |
| Engine creates `BlockCandidate` | Derived intent occurrence |
| Engine places candidate | Generated |
| Result enters preview as `scheduledBlock` | Generated schedule projection |
| Engine detects Friction | Derived diagnosis |
| Engine creates `SuggestedFix` | Corrective recommendation |
| User tries fix | Transient revised preview |
| User accepts supported fix | Accepted authority |
| `PlanDecision` persists | Durable accepted authority |
| Regeneration replays decision | Derived from accepted authority |
| Fresh preview publication | Historical |
| User reports execution/progress | Authored observation/history |

“Scheduled” means direct authored time for manual events, deterministic expansion of authored Work or recurring intent for generated blocks, and explicit occurrence authority only where a PlanDecision applies. It does not mean that every generated placement received fresh acceptance.

This is not silently invented discretionary work: the engine schedules pre-authored demand. It does conflate derived placement with `scheduledBlocks` before any preview-level acceptance.

## 8. Persistence and Lifecycle Audit

| Concept | Persisted? | Authority | Versioned/rehydrated? | Stale or historical behavior |
|---|---:|---|---:|---|
| Capacity | No | None | No | None |
| Allocation | No | None | No | None |
| Proposal | No | None | No | None |
| Active commitments/preferences | Yes | Active V2 | Yes | Source incarnations |
| Preview | No | Runtime | No | Marked stale/regenerated |
| Scheduled preview blocks | No directly | Preview | No | Fresh preview can publish history |
| PlanDecision | Yes | Decision surface | V1 | Applicable/stale/blocked statuses |
| Accepted Choice | Yes | PlanDecision presentation | Yes | Removable/protected |
| FrictionPoint/SuggestedFix | No | Preview result | No | Recomputed |
| Goal and links | Yes | Goal authority | V1/revisioned | Lifecycle and incarnation identity |
| Progress observation | Yes | Observation authority | V1/revisioned | Correction/retraction history |
| Historical plan | Yes | Historical-plan surface | Yes | Frozen provenance |
| Execution record | Yes | Execution-history surface | Yes | Historical |

Active V2 persists authored setup rather than preview output (`code/src/state/activeV2.ts`, lines 11–16). PlanDecision storage uses serialized, write-then-reread-verified persistence with explicit failure states (`code/src/state/planDecisionSurface.ts`, lines 177–260).

## 9. UI Exposure Audit

| Surface | Observable behavior | User authority | Discoverability |
|---|---|---|---|
| Monthly Planner | Coverage and selected-day schedule | Navigate/add/edit/generate | Primary |
| Review Schedule | Scheduled/unplaced commitments and Friction | Try fixes/edit commitment | Advanced |
| Accepted Choices | Persisted occurrence decisions | Review/remove | Nested in review |
| Goals | CRUD, links, measurement setup | Authored Goal authority | Dedicated workspace |
| Today | Read model and outcome reporting | Execution reporting | Primary |
| Summary | Historical realization/outcomes/Progress | Filters and reporting navigation | Primary |
| Capacity | Nothing | None | Absent |
| Allocation | Nothing | None | Absent |
| Constructive Proposal | Nothing | None | Absent |

**Confirmed:** Preview labels unplaced items “Plan attention — Unplaced” and provides Friction fix buttons (`code/src/ui/PreviewScreen.tsx`, lines 444–515).

**Confirmed:** Monthly Planner tests prohibit implying free or available Capacity where no such model exists (`code/src/ui/tests/MonthlyPlannerSurface.test.tsx`, lines 112–129).

## 10. End-to-End Traces

**Trace 1 — Commitment to occupied schedule**

```text
BlockTemplate + BlockRecurrence → Active V2 persistence
→ generateBlockCandidates → BlockCandidate with occurrence identity
→ placeBlockCandidates → planned DraftScheduledBlock
→ preview → historical publication → execution target/outcome
```

This is deterministic expansion of previously authorized intent.

**Trace 2 — Goal to Progress**

```text
Goal → manual commitment link → schedule generation ignores Goal
→ historical publication freezes matching Goal provenance
→ execution outcome recorded separately
→ manual measurement configuration and observation
→ Goal Progress query → Summary
```

Commitment linking, measurement configuration, and Progress reporting are manual bridges. Execution does not automatically advance Goal Progress.

**Trace 3 — Available opening**

```text
User-day bounds + Work + manual events + prior blocks + buffers
→ occupied windows → complementary open windows
→ duration/buffer feasibility → preferred-start clamping
→ chosen start or unplaced candidate
```

This is geometric availability, not a reusable resource model.

**Trace 4 — Friction decision**

```text
Conflict/unplaced candidate → FrictionPoint → SuggestedFix → try fix
→ transient revision → decision candidate → explicit acceptance
→ durable PlanDecision → regeneration → applicability/replay result
```

**Trace 5 — Candidate Proposal path**

```text
Commitments → candidate-specific open-window geometry
            ✕ Capacity model — Not Found
```

The trace stops at the missing Capacity boundary. Goal consumption, allocation, constructive recommendation, authorization, and accepted allocation do not exist.

## 11. Required Matrices

### Matrix A — Capacity Candidate Mechanisms

| Mechanism | Computes Free Time? | Accounts for Constraints? | Goal-Aware? | User-Facing? | Capacity Equivalent? | Evidence |
|---|---:|---:|---:|---:|---|---|
| Open-window complement | Locally | Occupancy/window bounds | No | No | No; geometry | `placeBlockCandidates.ts:621–664` |
| Candidate feasibility | Indirectly | Duration/buffers | No | Result only | No | `placeBlockCandidates.ts:561–619` |
| Preferred-start selection | No | Preferred/work-relative window | No | No | No | `placeBlockCandidates.ts:418–559` |
| Unplaced candidates | No | Constraint outcome | No | Yes | No; failed demand | `generateSchedulePreview.ts:216–250` |
| Realization Summary | No | Historical plan state | Provenance-filterable | Yes | No; retrospective | Summary tests |
| User-day window | Defines envelope | Boundary configuration | No | Indirectly | No | `generateSchedulePreview.ts:64–78` |

### Matrix B — Planning Authority

| Concept | Authored by User | Derived by Engine | Proposed by Engine | Requires Acceptance | Persists | Historical |
|---|---:|---:|---:|---:|---:|---:|
| Commitment pattern | Yes | No | No | At authoring | Yes | Via occurrences |
| Goal | Yes | No | No | At authoring | Yes | Frozen provenance |
| Candidate | Indirectly | Yes | No | No new acceptance | No | If published |
| Scheduled block | Indirectly/manual | Yes | No | No new acceptance | Preview only | Yes when published |
| Manual event | Yes | Converted | No | At authoring | Yes | Yes |
| Work | Setup authored | Yes | No | At setup | Yes | Yes |
| Preview | No | Yes | No | No | No | Can publish |
| PlanDecision | User accepts | Engine constructs/replays | Fix-derived | Yes | Yes | Reflected in plan |
| FrictionPoint | No | Yes | Corrective diagnosis | No | No | No |
| SuggestedFix | No | Yes | Corrective | Supported result only | No | Decision provenance |
| AcceptedChoice | Yes | Presented from decision | Sometimes fix-derived | Yes | Yes | Indirectly |
| Execution record | Yes | Validated/projected | No | User report | Yes | Yes |
| Historical plan | No | Yes | No | No publication acceptance | Yes | Yes |

### Matrix C — Goal Provenance

| Stage | Current Mechanism | User or Engine | Automatic or Manual | Evidence |
|---|---|---|---|---|
| Goal creation | `GoalV1` authority | User | Manual | `goalSurface.ts` |
| Association | Source ID/incarnation link | User | Manual | `goalSurface.ts:189–219` |
| Candidate generation | Template/recurrence | Engine | Automatic; Goal ignored | `generateSchedulePreview.ts:91–101` |
| Placement | Candidate constraints | Engine | Automatic | `placeBlockCandidates.ts` |
| Publication | Match reference to Goal links | Engine | Automatic | `materializePlanPublication.ts:139–181` |
| Execution | Outcome against frozen occurrence | User + validation | Manual report | Execution surface |
| Progress | Definition + observation | User | Manual | `goalProgressQuery.ts` |
| Summary | Historical/progress query | Engine | Automatic projection | Summary surfaces |

### Matrix D — Proposal vs Friction

| Property | Proposal | Friction | Current Implementation Evidence |
|---|---|---|---|
| Purpose | Constructive | Corrective | Only corrective recommendations exist |
| Trigger | Capacity/planning demand | Conflict | Friction trigger implemented |
| Requires existing conflict | No | Yes | Recommendation UI requires Friction |
| Engine recommends | Planned use of Capacity | Recovery action | Recovery action only |
| User authority | Accept/modify/reject | Accept/modify/reject recovery | Try + accept supported fix |
| Result | Authorized allocation | Revised plan | PlanDecision + replay |
| Current status | Not implemented | Implemented | P3/P4 |

### Scheduled Source Authority

| Scheduled Source | User Authored? | Engine Derived? | Requires New Acceptance? | Why? | Evidence |
|---|---:|---:|---:|---|---|
| Manual event | Yes | Scheduled representation only | No | Direct authored time | `generateSchedulePreview.ts:103–121` |
| Work | Shift pattern | Yes | No | Deterministic expansion | `generateSchedulePreview.ts:80–89` |
| Template occurrence | Pattern intent | Yes | No | Deterministic recurrence and placement | `generateSchedulePreview.ts:91–151` |
| Decision-adjusted occurrence | Initial pattern plus decision | Yes | Yes for override | Accepted occurrence authority | `replayPlanDecisions.ts` |

## 12. Test Coverage Assessment

A focused verification run passed **8 test files and 63 tests**, covering placement, decision construction/replay/persistence, Goal authority, Goal Progress/history, Preview UI, and Monthly Planner truthfulness.

**Well covered:** recurring candidate generation, placement constraints, open-window behavior, Friction fixes, transient revision, supported fix mapping, PlanDecision persistence/replay, stale and blocked outcomes, Goal links, measurement-based Progress, historical provenance, preview staleness, and truthful UI language.

**Weakly covered:** the availability/Capacity distinction is protected mainly through negative UI assertions; Goal non-influence follows from API boundaries but lacks a named architectural contract test; historical publication is tested without a Proposal authorization boundary because none exists.

**Untested because unimplemented:** Capacity aggregation, Goal allocation, competing demand, constructive Proposal generation, pre-scheduling acceptance, Proposal persistence/history, and Capacity metrics.

No implementation/test disagreement was identified.

## 13. Confirmed Architectural Strengths

- Durable source-incarnation identity prevents decisions and Goal links from silently attaching to replacement sources.
- Recurrence expansion distinguishes authored pattern intent from derived occurrences.
- PlanDecision retains user versus suggested-fix provenance.
- Replay exposes stale, unsupported, outside-window, blocked, and applied states.
- Goal, measurement, observation, execution-history, and historical-plan authorities are separated.
- Historical publication freezes Goal provenance rather than rewriting history from current links.
- UI tests prevent unsupported Capacity, adherence, and recommendation claims.
- Friction is corrective diagnosis rather than silent authored-state mutation.

## 14. Partial or Disconnected Paths

- Open-window geometry is a Capacity prerequisite but remains private to placement.
- PlanDecision supplies acceptance/replay infrastructure without a constructive recommendation source.
- Accepted Choices expose durable occurrence authority but only for overrides.
- Goal links connect schedule/history provenance but not scheduling demand.
- Progress measures Goal outcomes but is not driven by linked execution.
- Summary provides retrospective realization rather than forward-looking resources.
- Preview exposes generated schedule state without a publication/authorization lifecycle suitable for future discretionary Proposals.

## 15. Not Found

Targeted tracing found no:

- Capacity type, authority, query, command, persistence, or UI;
- reusable daily or weekly Capacity total;
- free-time versus usable-Capacity distinction;
- fatigue, recovery, or minimum-useful-opportunity model;
- Goal scheduling priority or effort allocation;
- Goal-generated candidate or competition among Goals;
- constructive Proposal entity or set;
- general Proposal accept/modify/reject lifecycle;
- pre-scheduling acceptance of discretionary work;
- whole-preview acceptance or rejection;
- Proposal persistence, history, or Summary representation.

## 16. Implementation-Architecture Conflicts

| Invariant | Evaluation |
|---|---|
| INV-01 Commitments own time | **Partially preserved.** Sources shape time, but no unified Commitment domain exists. |
| INV-02 Goals do not inherently own time | **Preserved.** Goal creation creates no demand. |
| INV-03 Capacity is derived | **Not implemented.** Only transient openings are derived. |
| INV-04 Capacity reasoning must not silently become intent | **Not yet applicable.** Capacity reasoning is absent; placement realizes authored intent. |
| INV-05 Constructive Proposal requires authority | **Not implemented.** No constructive Proposal exists. |
| INV-06 Friction remains corrective | **Preserved.** Machinery is conflict/unplaced-driven. |
| INV-07 Recurrence does not require repeated acceptance | **Preserved.** Expansion is deterministic. |
| INV-08 Recommendation and decision provenance differ | **Partially preserved.** Friction suggestions and decisions differ; Proposal provenance is absent. |

The central conflict is not unauthorized Goal work. It is the absence of Capacity and Proposal layers between authored commitments and generated schedule placement.

Automatic historical publication of a fresh preview is coherent for deterministic commitment expansion today, but would be inappropriate unchanged if future previews contain unaccepted discretionary Proposals.

## 17. Open Questions

1. Which source families formally count as time-owning Commitments?
2. Should Capacity be an on-demand read model, a persisted snapshot, or both?
3. Which constraints make geometric openings unusable Capacity?
4. What Goal demand model requests Capacity without making Goals own time?
5. What are allocation identity and temporal scope?
6. Is Proposal acceptance item-, day-, range-, or transaction-scoped?
7. Can modification reuse occurrence decisions, or does it require Proposal authority?
8. When does an accepted allocation become historical plan truth?
9. How are Proposal rejection and expiration retained?
10. Should execution of Goal-linked commitments advance any measurement policies automatically?

## 18. Audit Conclusions

The product has a strong deterministic commitment scheduler and mature corrective-decision pathway, but does not implement the lifecycle “Commitments own time. Goals compete for Capacity. DayFrame proposes. The user decides.”

Implemented truth is:

> Authored commitments create candidates. DayFrame places them automatically. Friction may lead to a user-accepted occurrence override. Goals supply provenance and separately reported Progress.

Final classifications:

- **Capacity: C3 — Partially Implemented**
- **Proposal: P3 — Partially Implemented**
- **Proposal interaction scope: P4 — Friction-Only**
- **General constructive Proposal lifecycle: P5 — Not Implemented**

The first missing transition is:

```text
Commitments shape time
  → [missing coherent Capacity read model]
```

Goal allocation, constructive Proposal, and pre-scheduling authorization are consequently absent.

## 19. Recommended Follow-Up Audits

**Recommended gate: Path D — Split Follow-Up.**

Capacity and Proposal have different foundations: Capacity has credible interval machinery without a coherent read model, while Proposal has mature decision infrastructure semantically tied to corrective Friction and no constructive recommendation source.

Recommended sequence:

1. Capacity semantic/read-model audit.
2. Goal demand and allocation-authority audit.
3. Constructive Proposal lifecycle audit.
4. PlanDecision infrastructure compatibility audit.
5. Historical publication authority-boundary audit.

> **Capacity and Proposal Implementation Alignment Audit complete.**
>
> The report establishes implemented truth for DayFrame's current Capacity, Goal-allocation, Proposal, decision-authority, and Friction pathways without modifying the repository. Capacity and Proposal have been classified according to evidence, the first break in the intended planning lifecycle has been identified, and the project now has sufficient evidence to decide whether the next step is reconnection, completion, new architecture, or a split follow-up.
