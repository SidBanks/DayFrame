# Post-Phase-7 Implementation Roadmap Result

## 1. Executive Roadmap

DayFrame should implement the post-Phase-7 architecture through three sequential capability phases with coordinated domain, engine, persistence/history, surface, and quality lanes:

1. **Phase 8 — Goal and Capacity Foundations:** shared revision/provenance/freshness substrate; Goal Structure; Goal Demand/Priority/Projection; Commitment Composition; Capacity and Goal-Specific Feasibility.
2. **Phase 9 — Constructive Planning and Authorization:** competing Demand, Allocation, constructive Proposal/No-Proposal, ProposalDecision, Accepted Allocation, atomic realization, horizon separation, Month/Review convergence, and publication/history extension.
3. **Phase 10 — Live Adaptation and Learning:** Released Interval, Live Capacity/Opportunity, live Proposal/direct action, learning/preference promotion, Summary/Teach evolution, profile retirement compatibility, and remaining product polish.

The critical path is Goal base → Structure → Demand/Priority/Projection + Composition → Capacity → Feasibility → competition/Allocation → Proposal/Decision/Accepted Allocation → realization into scheduled Goal work. Dogfood Pass 02 occurs after that full ordinary loop is exposed in Phase 9. Readiness is **RM-A — Ready for Implementation**.

## 2. Scope

This roadmap sequences accepted alignment work. It does not implement features, write canonical tasks, change governance, or reopen architecture. The sole task-created repository write is this result.

## 3. Governing Evidence

Primary strategy: `docs/architecture/POST_PHASE_7_IMPLEMENTATION_ALIGNMENT_STRATEGY_RESULT.md`. Normative architecture: the post-Phase-7 synthesis plus Capacity, Goal Structure, Goal Demand/Allocation, Composition, and Constructive Proposal results. Experienced evidence: the complete Dogfood reconciliation and final DF-006 result. Current baseline: `CURRENT_STATE.md`, `CHANGELOG.md`, source locations and the strategy’s 11-suite/265-test validation.

The earlier architecture-to-implementation roadmap is `docs/roadmap/Implementaion_Roadmap.md`; the exact historical spelling is preserved. `docs/roadmap/ROADMAP.md` records the delivered Phase 1–7 sequence and Phase 7 closeout. Both remain immutable historical evidence. This result supersedes them only prospectively for post-Phase-7 sequencing; it neither rewrites completed phases nor carries stale unfinished numbering forward unless an obligation is explicitly re-routed here.

Roadmap validation was documentary and read-only apart from this result: directory/file discovery, full governing-brief and strategy inspection, targeted `sed`/`rg` review of current-state, roadmap, audit, specification, and status evidence, and `git status --short`. Product suites were not rerun because application source was unchanged; the governing strategy's recorded 11 suites, 265 tests, and zero failures remain the implementation-baseline evidence.

## 4. Alignment Strategy Baseline

Preserve/extend canonical time, Work/cycles, Commitment recurrence, placement mechanisms, Preview, Friction/fixes, decisions, publication, execution, Progress, persistence, backups, and current surfaces. Introduce the new planning domains. Adapt Buffers, relative placement, priorities, Accepted Choices, ranges, Teach/Review, and persistence. Retire profiles only with compatibility. No strategy classification is reopened.

## 5. Roadmap Principles

Semantic completeness precedes exposure; working scheduling remains usable; upstream authority precedes consumers; derived truth never becomes authored; Proposal cannot schedule without acceptance; migration ships with semantic change; history compatibility is implementation; Dogfood work rides with its owner; independent polish cannot preempt architecture; every increment ends coherent.

## 6. Current Foundation Baseline

| Foundation | Stability | Extension seam |
| --- | --- | --- |
| canonical user-day/date | Preserve | Capacity/live contexts |
| Work/manual/repeating cycles | Preserve | provenance, composition, DF-006 coverage |
| Commitment identity/recurrence | Preserve | composition/priority/lineage |
| placement/opening geometry | Preserve mechanism | Capacity/feasibility consumers |
| Preview | Preserve | realized Goal/composite facts and horizons |
| Friction/Fix/PlanDecision | Preserve | composite/scoped correction |
| publication | Preserve | accepted-allocation/composition lineage |
| execution/Progress | Preserve | new subjects/attribution/live divergence |
| persistence/migrations/backup | Preserve | new versioned authorities |
| Month/Review/Today/Summary | Preserve shells | new read models/workflows |

## 7. Dependency Graph

```text
revision/provenance/freshness substrate
├─ Goal base → Goal Structure → Demand Intent + Goal Priority → Demand Projection ┐
└─ Commitment base → Composition → Composite Footprint/Liability                 ├→ Capacity
authorized schedule + availability policy ───────────────────────────────────────┘
Capacity + Demand Projection + footprint → Feasibility
Feasibility + Priority + policy → Competing Demand → Allocation
Allocation → Proposal/No-Proposal → ProposalDecision → Accepted Allocation
→ realization → Preview → publication/history
publication + execution divergence → Released Interval → Live Capacity
→ Live Opportunity → live Proposal or direct action
histories → Summary/Learning → tendency → explicit preference promotion
```

Structure/Demand and Composition can proceed in parallel after the shared substrate. Surface and quality lanes follow stable query contracts.

## 8. Critical Path

Foundation → Goal Structure → Demand/Priority/Projection and Composition → Capacity/Feasibility → competing Demand/Allocation → atomic Proposal/Decision/Accepted Allocation → realization/minimum Planner exposure → publication lineage. This is the shortest coherent path to “Commitments own time; Goals compete for Capacity; DayFrame proposes; user authorizes.”

## 9. Parallel Work Lanes

- **Domain/Authority:** authored and accepted types/lifecycles.
- **Engine/Derived Truth:** projection, Capacity, feasibility, allocation, proposals.
- **Persistence/History:** migrations, revisions, backup, immutable resolution.
- **Surface/Workflow:** Teach, Month, Review, Today, Summary after query contracts.
- **Dogfood/Quality:** continuous regressions plus safe independent fixes.

Parallel work must share schemas deliberately and may not expose incomplete transitions.

## 10. Roadmap Unit

An increment is a coherent semantic capability plus persistence/migration, deterministic behavior, provenance/freshness, query model, minimum safe exposure where appropriate, tests, and checkpoint documentation. Models, migrations, UI pages, utilities, and test batches are tasks within increments—not standalone roadmap value.

## 11. Entry / Exit Criteria

Entry requires upstream capability, accepted architecture, migration/test prerequisites, preservation contract, and routed Dogfood obligations. Exit requires complete authority boundary, migration/recovery, deterministic engine/query, provenance/freshness/explainability, usable or intentionally hidden exposure, regression proof, and checkpoint with no known architecture violation.

## 12. Cross-Cutting Foundation

First increment: **Revisioned Planning Provenance and Freshness Foundation**. Add shared opaque/revision identity conventions, typed origin union, dependency fingerprints, typed freshness/coverage/qualification, reason-code envelope, persistence registration/migration helpers, history resolution, and test builders only where immediately required by Structure, Demand, Composition, Capacity, and Proposal. No user-facing empty framework; completion is proven through one thin Goal-relationship and dependency-fingerprint vertical slice while current scheduling remains unchanged.

## 13. Goal Structure

Implement typed revisioned relationships and Milestones, validation/cycle rules, structural eligibility, queries, history snapshots, and additive persistence. Existing Goal IDs/lifecycles remain. Goal links are migrated only to explicit legacy service association, never inferred as structure. Minimal Teach/Goal detail exposure follows complete authority.

## 14. Goal Demand / Priority

Add authored Demand Intent, independent Goal Priority, revision/lifecycle, constraints, effort/session/cadence/horizon and minimum/target/optional semantics; derive normalized Demand Projection with Progress as advisory evidence. Persist intent/priority, derive projection, and expose authoring only after validation/history exist.

## 15. Commitment Composition

Add Attachment Relationship, pairing, required/optional/timing policy, attached activity, Buffer distinction, Composite Footprint/Liability/Decision, execution subjects, Goal-service attribution, history, and migration coexistence for existing Buffers/relative windows. This precedes Capacity because otherwise availability ignores required overhead.

## 16. Capacity

Add canonical interval identity, policy qualification, occupied/protected facts, unresolved liabilities, composition subtraction/deduplication, coverage/freshness, provenance/reasons, query/read model, and deterministic tests. Reuse opening geometry without elevating openings into Capacity.

## 17. Goal-Specific Feasibility

Ship immediately with Capacity as the latter’s consumer-facing proof, or as the next non-exposed internal increment. It binds exact Demand Projection, Capacity revision, session/composite requirements, constraints/preferences, compatible slices, unsatisfied reasons, and explanations. It never ranks Goals.

## 18. Competing Demand / Allocation

Normalize eligible overlapping Demand, apply Goal Priority and explicit Allocation Policy, produce deterministic partial/full provisional claims, separate productive/support effort, and record reasons/input provenance. It owns no time and remains internal until Proposal is complete.

## 19. Constructive Proposal / Decision / Accepted Allocation

One atomic user-authority increment: Proposal/option/No-Proposal identity and lifecycle, ordinary context, bounded Proposal Horizon, deterministic ranking, freshness/revalidation, accept/modify/reject/ignore/expiry, ProposalDecision, immutable Accepted Allocation, and history. Acceptance is not exposed until exact claim authority exists.

## 20. Realization

Atomically realize Accepted Allocation into distinct scheduled Goal Work, support activity, and Buffer protection within accepted bounds. Extend Preview and publication provenance; fail closed without substitution/hidden partial footprints. This completes the critical path.

## 21. Planning-Data Horizon / Proposal Horizon / Review Scope

Introduce Planning-Data Horizon before Capacity performance work, Proposal Horizon with Proposal, and Review Scope before Phase 9 surface exposure. Broad data can inform narrow proposals; review changes never regenerate semantic truth. Migrate existing Preview-range intent conservatively while preserving current generation behavior.

## 22. Month / Planner Evolution

In Phase 9, extend Month queries with Capacity, Goal work, Proposal attention, composition, source provenance, and stronger freshness. Keep Month a read/action surface, not domain owner. Land DF-006 REG-01–17 with Work source inspection and saved/draft/current evidence.

## 23. Review Schedule Evolution

After ordinary Proposal exists, retain authorized Preview/Friction/publication review; add bounded Review Scope, grouped/scoped correction, scalable choices, provenance, and clearly separate constructive Proposal decisions. Never convert Suggested Fix into Proposal.

## 24. Publication / History

Extend with each authority-bearing increment, then checkpoint after realization: typed origins, exact Goal/Demand/Capacity/Allocation/Proposal lineage, support/Buffer/composite snapshots, `legacyUnknown`, and old-version readers. Publication changes cannot lag behind user-visible acceptance.

## 25. Live Opportunity / Found Time

Phase 10, after ordinary Proposal: record cancellation/skip/early completion divergence; derive Released Interval, remaining liability, Live Capacity, expiring Live Opportunity, live Proposal/one-off acceptance, and direct spontaneous Goal execution. Timer/input adapters are optional.

## 26. Learning / Preference Promotion

After sufficient immutable proposal/decision/execution history, add resolution-aware learned tendencies, low-authority guidance, conflicts, and explicit promotion into separate reusable preference authority. Never infer authority from repetition.

## 27. Summary / Learn

Incrementally preserve current basics; after Phase 9 add Capacity/Demand/allocation/proposal/composition history, then after learning add tendencies and operational/analytic/archive resolution. Improve cross-surface navigation without flattening provenance.

## 28. Teach

Evolve, do not rewrite. Phase 8 adds Goal Structure/Demand/Priority and composition authoring; independently clarify Work authority and off-day policy when contracts are ready. Phase 10 completes preference promotion and profile-compatibility messaging.

## 29. Profiles / Backups

Backups version alongside every new persisted authority. Profiles remain readable/exportable through Phases 8–9. Retire their primary UI in Phase 10 only after data escape and restore compatibility; do not silently convert them into templates/scenarios.

## 30. Independent UX / Polish Lane

| Item | Timing | Reason |
| --- | --- | --- |
| weekday visual/accessibility control | Safe Now | stable authority |
| invalid date recovery | Safe Now | stable validation |
| Advanced Work effective-authority/DF-006 provenance | Safe Now | stable Work semantics |
| focus/mobile/wording fixes | Safe Now | no domain ownership |
| Buffer discoverability | Ride With Composition | semantics change |
| Goal-work discoverability | Ride With Demand/Planner | provenance changes |
| Accepted Choice grouping | Ride With Review/Learning | resolution semantics |
| Friction grouping/bulk scope | Ride With Review | scope policy |
| generalized templates/scenarios | Defer | not specified |

## 31. Regression Preservation Lane

Every increment keeps canonical user-day, overnight/manual/repeating Work, recurrence, relative Sleep, Preview freshness, Friction/Fix/PlanDecision, publication, execution correction/retraction, Progress, backups/restores, and Month evidence green. DF-006 REG-01–17 becomes a named continuous suite; failure blocks checkpoint publication.

## 32. Migration Strategy

Add schemas/readers before writers; migrate with the semantic increment; retain legacy readers and `legacyUnknown`; version backups before activation; quarantine invalid inputs; keep migrations idempotent where practical; preserve old publications/decisions verbatim; delay destructive retirement until export/rollback succeeds. Derived models normally recompute, while decisive snapshots persist in accepted/history records.

## 33. Documentation / Checkpoint Strategy

Each major increment ends with targeted/full validation proportional to risk, architecture-alignment check, updates to `CURRENT_STATE.md`/`CHANGELOG.md`, `DECISIONS.md` only for genuine implementation choices, checkpoint commit/push, and optional hydration artifact at major semantic seams. None are modified by this roadmap.

## 34. Publication Checkpoints

Checkpoint/dogfood after: (1) Goal Structure + Demand/Priority authoring; (2) Composition + Capacity/Feasibility; (3) ordinary Proposal through realization/publication; (4) Planner/Review convergence; (5) Live Opportunity; (6) learning/promotion. Internal tasks between checkpoints remain reviewable/buildable.

## 35. Dogfood Pass 02 Gate

Run structured Dogfood Pass 02 after Phase 9 delivers the complete ordinary loop: author Goal/Structure/Demand/Priority, derive composition-aware Capacity and feasibility, receive a Proposal, explicitly accept/modify/reject it, realize accepted Goal work, inspect it in Month/Review, publish it, and execute/report it. Do not wait for Live Opportunity, learning, profile retirement, or a native timer.

## 36. Implementation Task Granularity

Canonical tasks have one primary semantic responsibility, reviewable diff, tests, and inseparable migration. Internal tasks may prepare hidden types/engines, but a public authority transition cannot be split into reachable half-states. Tasks normally fit one focused session; large atomic increments use multiple hidden tasks followed by one activation task.

## 37. Roadmap Numbering

Continue historical convention: `Task <phase>.<sequence>` with bounded suffixes (`A`, `B`) only for discovered prerequisites/remediation. Do not renumber history. Roadmap increments group tasks but do not replace task numbers.

## 38. Phase Naming

Next program: **Phase 8 — Goal and Capacity Foundations**. The name expresses the user/product truth established: users define structured outcome demand and DayFrame derives trustworthy allocatable Capacity. It does not claim Proposal before authorization exists.

## 39. Phase Boundary Strategy

Use three phases, not one oversized phase. Phase 8 establishes planning inputs/truth; Phase 9 crosses the constructive recommendation/acceptance boundary; Phase 10 brings that loop into Live and Learn and completes compatibility. Each ends in a meaningful user capability and Dogfood checkpoint.

## 40. Critical Path vs Full Program

**Critical path:** foundation → Structure → Demand/Priority/Projection + Composition → Capacity/Feasibility → competition/Allocation → Proposal/Decision/Accepted Allocation → realization/Planner/publication.

**Full program:** critical path plus horizon/review convergence, Friction/choice scalability, Live Opportunity, learning/promotion, Summary/Teach completion, profile retirement, independent UX/accessibility/performance work, and optional deferred enhancements.

## 41. Recommended Sequence Matrix

| Order | Increment | User Capability Added | Domains | Depends On | Dogfood | Migration | Dogfood Gate? |
| ---: | --- | --- | --- | --- | --- | --- | ---: |
| 1 | revision/provenance/freshness foundation | trustworthy versioned planning inputs | shared substrate | current persistence | 006/007/028/055 | additive | No |
| 2 | Goal Structure | organize outcome relationships/milestones | Structure | 1, Goal base | 042–044 | additive | checkpoint |
| 3 | Demand/Priority/Projection | state resource intent | Demand/Priority | 1–2 | 031/045 | additive | checkpoint with 2 |
| 4 | Commitment Composition | model support/Buffer footprint | Composition | 1, Commitment base | 011–023 | semantic/additive | checkpoint |
| 5 | Capacity + Feasibility | see trustworthy opportunities | Capacity/Feasibility | 3–4 | 041/PM-02/03 | derived + policy | checkpoint |
| 6 | Competition + Allocation | deterministic provisional distribution | competition/Allocation | 5 | 045 | derived | No |
| 7 | Proposal authority transition | receive/decide bounded recommendations | Proposal/Decision/Accepted Allocation | 6 | 046/PM-01–05 | new lifecycle | checkpoint |
| 8 | Realization + publication/history | accepted Goal work becomes schedule truth | realization/publication | 7 | 044–048 | additive versions | checkpoint |
| 9 | Horizons + Month/Review convergence | bounded understandable planning loop | three scopes/surfaces | 5–8 | 006/024–040/052 | preference/query | Dogfood Pass 02 |
| 10 | Live Opportunity | act on released time | Released/Live/Proposal | 8–9 | 047–050 | additive | checkpoint |
| 11 | Learning + Summary/Teach | inspect patterns and promote preferences | learning/surfaces | 8–10 history | 029–033/051–053/PM-06–08 | additive | checkpoint |
| 12 | profile retirement/compatibility closeout | simpler continuity model | compatibility | migrations stable | 054/055 | retire-compatible | final |
| continuous | UX/regression/performance | trustworthy usable system | quality | owning semantics | all | none/as needed | every checkpoint |

## 42. Parallelization Matrix

| Increment | Can Run Parallel With | Must Not Precede | Shared Files / Risk | Coordination |
| --- | --- | --- | --- | --- |
| Structure | Composition | foundation | Goal/state/history | shared identity conventions |
| Demand/Priority | Composition | Structure contracts | Goal surfaces/persistence | freeze query interfaces |
| Composition | Demand | foundation | blocks/placement/history | footprint contract before Capacity |
| Capacity | horizon data model | Composition + Demand projection | time/engine/query | immutable input contracts |
| Feasibility | Capacity internals | Capacity types | placement/Capacity | no ranking |
| Allocation | surface design exploration | feasibility | engines/reasons | keep hidden |
| Proposal | publication schema prep | Allocation | decision/store/history | atomic activation |
| Month/Review | UX safe-now lane | query contracts | DayFrameApp/bundle | preserve lazy boundaries |
| Live | Summary history prep | ordinary realization | execution/Today | reuse Proposal lifecycle |
| Learning | profile compatibility | sufficient history | Summary/preferences | explicit promotion |

## 43. Critical Path Matrix

| Step | Required Capability | Why Critical | Blocking Dependencies | Exit Condition |
| ---: | --- | --- | --- | --- |
| 1 | version/provenance/freshness | every new fact auditable | current persistence | shared contracts proven |
| 2 | Structure | correct eligibility/accounting | Goal base | revisioned queries/history |
| 3 | Demand/Priority/Projection | Goals request resources | Structure | normalized derived demand |
| 4 | Composition | complete obligation footprint | Commitment base | footprint/liability available |
| 5 | Capacity | allocatable time truth | schedule/composition/policy | qualified intervals/read model |
| 6 | Feasibility | match demand to capacity | 3–5 | explained compatible slices |
| 7 | Competition/Allocation | resolve competing outcomes | Priority/feasibility | provisional exact claims |
| 8 | Proposal/Decision/Accepted Allocation | user authority boundary | Allocation | current accepted bounds |
| 9 | Realization | schedule accepted Goal work | Accepted Allocation | atomic scheduled reality |

## 44. Surface Evolution Matrix

| Increment | Teach | Month | Review Schedule | Today / Live | Summary |
| --- | --- | --- | --- | --- | --- |
| foundation | unchanged | unchanged | unchanged | unchanged | unchanged |
| Structure/Demand | minimally exposed | unchanged | unchanged | unchanged | minimally exposed |
| Composition | extended | unchanged | minimally exposed | unchanged | unchanged |
| Capacity/Feasibility | minimally exposed | minimally exposed | unchanged | unchanged | unchanged |
| Proposal/realization | extended | extended | extended | unchanged | minimally exposed |
| horizon/convergence | extended | converged | converged | unchanged | extended |
| Live Opportunity | unchanged | extended | unchanged | converged | extended |
| learning/preferences | converged | extended | extended | extended | converged |
| profile closeout | converged | unchanged | unchanged | unchanged | unchanged |

## 45. Migration Timeline Matrix

| Increment | Persisted Models Added/Changed | Migration | Compatibility Maintained | Retirement Enabled |
| --- | --- | --- | --- | --- |
| foundation | origins/revisions/fingerprints | additive version | all current V6 data | none |
| Structure | relationships/milestones | new store | Goals/links | none |
| Demand | intent/priority | new store | Goals/recurrences | none |
| Composition | attachment relations/policy | additive/semantic Buffer map | old templates/windows | none |
| Proposal | proposal/decision/accepted | new lifecycle | PlanDecision distinct | none |
| realization | publication/execution lineage | additive historical versions | old plans readable | none |
| Live | opportunity/direct action refs | additive | current Today/execution | none |
| learning | tendencies/preferences | additive | Accepted Choices unchanged | none |
| compatibility closeout | profile status/export | retire-with-read | backup/profile escape | profile UI |

## 46. Dogfood Delivery Matrix

| Finding ID | Roadmap Increment / Lane | Delivery Type | Validation |
| --- | --- | --- | --- |
| DF-001 | regression lane | Preserve | multi-shift tests |
| DF-002 | Phase 8 Teach/UX | UX | rotation journey |
| DF-003 | Phase 8 Teach/UX | Workflow | accessibility/manual-cycle task |
| DF-004 | safe-now UX | Correction | invalid-range recovery |
| DF-005 | regression lane | Preserve | transition determinism |
| DF-006 | foundation + Month + regression | Regression/observability | REG-01–17 |
| DF-007 | foundation/Month | Provenance UX | source trace |
| DF-008 | regression lane | Preserve | recurrence suites |
| DF-009 | safe-now UX | Polish | keyboard/non-color/mobile |
| DF-010 | Teach evolution | Workflow | advanced discovery |
| DF-011 | Composition/regression | Preserve/adapt | relative Work tests |
| DF-012 | Composition/regression | Preserve | shift transition tests |
| DF-013 | Phase 8 Teach/policy | Product/UX | off-day explanations |
| DF-014 | Demand/Capacity policy | Implementation | explicit policy tests |
| DF-015 | policy increment | Implementation | preserve-routine case |
| DF-016 | policy increment | Implementation | adapt-off-days case |
| DF-017 | regression lane | Preservation | fail-closed schema |
| DF-018 | regression lane | Preservation | fresh/stale invalid-input case |
| DF-019 | Composition | Preserve/UX | Buffer compatibility |
| DF-020 | Composition surface | UX | discoverability |
| DF-021 | Composition/Feasibility | Explainability | liability/unplaceable |
| DF-022 | Composition | Semantic migration | commute vs Buffer |
| DF-023 | Composition | New capability | attachment pairing |
| DF-024 | regression/Review | Preserve | Friction suites |
| DF-025 | regression/Review | Preserve | bounded-fix suites |
| DF-026 | regression/Review | Preserve | explicit acceptance |
| DF-027 | persistence/history | Preserve | decision durability |
| DF-028 | foundation | Extend | applicability/freshness |
| DF-029 | Review/Learning | UX scale | grouped history |
| DF-030 | Learning | Implementation | guidance ≠ preference |
| DF-031 | Demand/Priority/Learning | Authority | precedence tests |
| DF-032 | Learning/Review | Explainability | conflict reasons |
| DF-033 | Learning | Authority | explicit promotion |
| DF-034 | regression lane | Preserve | occurrence recovery |
| DF-035 | Review convergence | Product/UX | scoped bulk correction |
| DF-036 | Review/Learning | Product | occurrence/pattern split |
| DF-037 | horizon/regression | Preserve/performance | annual data |
| DF-038 | horizon increment | Implementation | three-scope independence |
| DF-039 | Month/Review | UX/performance | bounded review |
| DF-040 | horizon increment | Implementation | data ≠ attention |
| DF-041 | Capacity | New capability | read model |
| DF-042 | Goal regression | Preserve | Goal lifecycle |
| DF-043 | Summary/history | Extend | historical Goal context |
| DF-044 | Demand/Planner/Teach | Preserve/UX | direct provenance |
| DF-045 | Allocation/Proposal | New capability | end-to-end critical path |
| DF-046 | Proposal | New capability | options/No-Proposal |
| DF-047 | Live/regression | Preserve/extend | execution/Progress separation |
| DF-048 | Live/regression | Preserve | manual duration |
| DF-049 | Deferred | Deferred enhancement | none critical |
| DF-050 | Deferred/Live adapters | Deferred | provenance if added |
| DF-051 | Summary | Preserve/extend | current basics |
| DF-052 | surface convergence | UX | cross-surface navigation |
| DF-053 | Summary/Learning | Product/UX | resolution/scale |
| DF-054 | compatibility closeout | Retire | export/restore proof |
| DF-055 | every migration | Preserve/extend | backup round trip |
| PM-01 | Proposal/Review | Semantic separation | proposal vs Friction |
| PM-02 | Composition/Capacity | Implementation | subtraction/liability |
| PM-03 | Demand/Allocation | Implementation | competition |
| PM-04 | Proposal | Authority boundary | explicit acceptance |
| PM-05 | Demand/realization | Semantic separation | Goal ≠ schedule |
| PM-06 | Learning/Summary | History resolution | aged evidence |
| PM-07 | publication/history | Persistence | operational/analytic/archive |
| PM-08 | surfaces/provenance | UX/architecture | prominence independent |

## 47. Regression Matrix

| Existing Capability | Must Remain Green Through | Key Suites / Invariants | Special Risk |
| --- | --- | --- | --- |
| canonical user-day | full program | canonical/variable-duration | new interval domains |
| Work/cycles | full program | manual/repeating/overnight | composition/Capacity |
| recurrence/relative Sleep | full program | candidate/placement | composition migration |
| Preview freshness | full program | stale/current/draft | new fingerprints |
| Friction/Fix/PlanDecision | full program | detection/apply/replay | Proposal confusion |
| publication | full program | immutable materialization | new provenance |
| execution corrections | full program | correction/retraction | live divergence |
| Progress | full program | explicit observations | false attribution |
| backup/restore | every migration | version round trips/quarantine | partial authority |
| Month evidence | full program | exact cell/source/freshness | query growth |
| DF-006 | full program | REG-01–17 | hidden Work authority |

## 48. Risk-Ordered Review

| Increment | Semantic | Migration | History | UI | Performance | Regression |
| --- | --- | --- | --- | --- | --- | --- |
| foundation | High | High | High | Low | Moderate | High |
| Structure/Demand | High | Moderate | High | Moderate | Moderate | Moderate |
| Composition | Critical | High | High | High | Moderate | High |
| Capacity/Feasibility | Critical | Low | High | Moderate | High | High |
| Allocation | Critical | Low | High | Low | High | Moderate |
| Proposal/realization | Critical | High | Critical | High | High | Critical |
| horizons/surfaces | Moderate | Moderate | Moderate | High | High | High |
| Live | Critical | Moderate | High | High | Moderate | High |
| learning | High | Moderate | High | High | High | Moderate |
| profile retirement | Moderate | Critical | High | Moderate | Low | High |

Risk does not override dependency order.

## 49. Performance Considerations

Establish semantic correctness first, then measure: incremental/cached Capacity across broad horizons; bounded feasibility enumeration; normalized many-Goal competition; deterministic top-K Proposal ranking; Month query pagination/memoization; grouped Friction; indexed history resolution; Summary operational/analytic/archive queries. Maintain bundle governance and lazy surface boundaries.

## 50. Accessibility Considerations

Every exposed increment requires keyboard/focus behavior, semantic names, live status announcements, non-color freshness/qualification, mobile readable matrices/lists, and scalable grouping. Work weekday controls and Advanced authority can improve now; Proposal decisions, composition, scoped correction, and preference promotion require accessible transactional confirmation.

## 51. Observability / Diagnostics

Every new read model answers “why here?” and “which authority?” using source/revision and structured reasons. Required traces span Work/Commitment/composite → Capacity exclusion; Goal/Structure → Demand; feasibility → allocation → Proposal → Accepted Allocation → scheduled/publication → execution/Progress. DF-006 requires exact saved/draft/freshness and Month-source evidence.

## 52. Rollback / Recovery

Before high-risk migration: versioned backup, dry validation, additive write, idempotent retry where practical, quarantine/protected mode on failure, old reader retained, historical records untouched, and explicit rollback/data escape. No destructive rewrite or profile UI removal until restored new authority is verified.

## 53. Release / Dogfood Strategy

Pure internal models may remain hidden; authority-writing increments activate only at checkpoint. Feature flags are appropriate only for atomic Proposal activation, high-risk migration, or Live/learning exposure—not by default. Surface-only safe fixes may ship immediately. Dogfood at meaningful loop checkpoints, not every task.

## 54. Critical-Path Inclusions

Include provenance/freshness/migration; Goal Structure; Demand/Priority/Projection; Composition footprint/liability; Capacity; Feasibility; competition/Allocation; Proposal/Decision/Accepted Allocation; realization; publication lineage; minimum Month/Review exposure; and regression coverage. Composition is included because Capacity without required support footprint is materially wrong.

## 55. Critical-Path Exclusions

Exclude native timer, future measured-input adapters, generalized templates/scenarios, advanced learning automation, full Summary redesign, profile retirement, Live Opportunity, and unrelated visual polish. Preserve destinations without delaying the ordinary planning loop.

## 56. Roadmap Decisions

| ID | Decision | Architectural Basis | Alignment Basis | Dependency Reasoning | Dogfood Impact | Migration Impact | User Capability | Roadmap Consequence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P7-ROAD-DEC-01 | adopt stated critical path | synthesis chain | missing middle domains | upstream before authority | 041/045/046 | attached migrations | Goal allocation | governs Phase 8–9 |
| P7-ROAD-DEC-02 | begin shared foundation | cross-domain identity | reusable persistence | required by 5+ domains | 006/007/028 | additive | trustworthy facts | Task 8.1 |
| P7-ROAD-DEC-03 | Structure before Demand projection | structure eligibility | Goals extend | normalization needs graph | 042–045 | new store | structured outcomes | Phase 8 |
| P7-ROAD-DEC-04 | Demand after/with Structure | demand spec | absent | consumes eligibility | 045 | new authority | state resource need | Phase 8 |
| P7-ROAD-DEC-05 | independent Goal Priority | authority hierarchy | no current field | allocation input | 031 | additive | choose importance | Phase 8 |
| P7-ROAD-DEC-06 | Composition before Capacity | footprint/liability | buffers incomplete | Capacity must subtract all | 019–023 | semantic/additive | truthful obligations | critical path |
| P7-ROAD-DEC-07 | Capacity after inputs | Capacity spec | openings only | needs schedule/composition/policy | 041 | derived | see allocatable time | Phase 8 exit |
| P7-ROAD-DEC-08 | Feasibility with Capacity seam | feasibility boundary | placement helper | proves Capacity usable | 045 | derived | see fit reasons | Phase 8 |
| P7-ROAD-DEC-09 | competition after feasibility | demand normalization | absent | eligible slices first | PM-03 | derived | compare Goals | Phase 9 |
| P7-ROAD-DEC-10 | Allocation remains provisional | allocation spec | heuristic ordering | competition/Priority inputs | 045 | history refs | balanced options | Phase 9 |
| P7-ROAD-DEC-11 | Proposal is atomic activation | proposal spec | absent | prevent implicit authority | 046/PM-01–05 | lifecycle | recommendations | one increment |
| P7-ROAD-DEC-12 | decision + accepted authority co-ship | user authority | PlanDecision distinct | no half transition | 026/045 | new stores | explicit choice | Phase 9 |
| P7-ROAD-DEC-13 | realization follows acceptance atomically | time ownership | scheduler reusable | schedule only after claim | 044–048 | publication versions | scheduled Goal work | critical-path exit |
| P7-ROAD-DEC-14 | split three horizons | synthesis | Preview range overloaded | before Proposal review | 037–040 | preferences | bounded attention | Phase 9 |
| P7-ROAD-DEC-15 | evolve Month after query domains | Month role | strong shell | UI follows contracts | 006/041/046 | query only | primary planning | Phase 9 |
| P7-ROAD-DEC-16 | evolve Review after Proposal | corrective split | Friction strong | preserve semantic separation | 024–036/039 | minimal | scalable review | Phase 9 |
| P7-ROAD-DEC-17 | version publication with realization | immutable history | base strong | cannot lag authority | PM-07/08 | additive | auditable schedule | Phase 9 |
| P7-ROAD-DEC-18 | Live after ordinary loop | Live spec | Today base | reuse mature Proposal | 047–050 | additive | act on found time | Phase 10 |
| P7-ROAD-DEC-19 | learning after history | learning boundary | choices/history exist | evidence first | 029–033 | additive | promote preferences | Phase 10 |
| P7-ROAD-DEC-20 | Summary evolves twice | Learn model | basics exist | consumes new histories | 043/051–053 | queries | understand outcomes | Phase 9–10 |
| P7-ROAD-DEC-21 | Teach evolves with owners | Teach model | workspaces exist | avoid rewrite | 002/003/010/013–023 | additive UI | author new intent | Phase 8/10 |
| P7-ROAD-DEC-22 | retire profiles last | compatibility | legacy concern | not critical path | 054 | high | simpler continuity | Phase 10 |
| P7-ROAD-DEC-23 | backups version continuously | recovery principle | V6 strong | migrations inseparable | 055 | every increment | recoverability | continuous |
| P7-ROAD-DEC-24 | maintain independent UX lane | smallest owner | bounded fixes | may run safely | visual/workflow | low | usability | continuous |
| P7-ROAD-DEC-25 | DF-006 is regression/diagnostic | final RC7/BR5/S2 | no fix | Work/Month seams | 006 | none | trust/audit | continuous + Phase 9 |
| P7-ROAD-DEC-26 | regression is continuous | RP-02 | strong suites | no final test phase | all | every migration | stability | blocks checkpoints |
| P7-ROAD-DEC-27 | Dogfood Pass 02 after ordinary loop | product differentiator | current loop absent | needs end-to-end value | core findings | post-migration | validate planning | Phase 9 gate |
| P7-ROAD-DEC-28 | checkpoint semantic seams | historical practice | governance exists | avoids tiny checkpoints | all | validated state | controlled release | six checkpoints |
| P7-ROAD-DEC-29 | tasks small, activation atomic | coherent increments | prior task convention | safe reviewability | all | colocated | steady progress | task rule |
| P7-ROAD-DEC-30 | retain phase.task numbering | continuity | Tasks 1–7 | no historical renumber | none | none | clear trace | 8.1 onward |
| P7-ROAD-DEC-31 | name Phase 8 Goal and Capacity Foundations | product capability | readiness | truth before recommendation | 041/045 | foundational | structured demand/capacity | next phase |
| P7-ROAD-DEC-32 | use three phases | meaningful capabilities | program breadth | prevents oversized phase | all | bounded | Plan→Live→Learn | phase structure |
| P7-ROAD-DEC-33 | separate critical/full program | differentiator | secondary obligations | focus | all routed | none | earlier value | prioritization constraint |
| P7-ROAD-DEC-34 | no architecture reopen | coherent specs | strategy Path A | sequencing consistent | none | none | proceed | roadmap valid |
| P7-ROAD-DEC-35 | classify RM-A | complete matrices | gaps bounded | first task known | all routed | bounded | implementation ready | next canonical task |

## 57. Proposed Implementation Phase(s)

### Phase 8 — Goal and Capacity Foundations

- **Objective:** author structured Goal demand and derive trustworthy composition-aware Capacity/feasibility.
- **Scope:** foundation, Structure, Demand/Priority/Projection, Composition, Capacity/Feasibility, initial Teach/queries.
- **First capability:** revisioned planning facts with exact provenance/freshness.
- **Final capability:** user can inspect whether structured Goal demand fits actual Capacity.
- **Dogfood checkpoint:** Goal/Demand then Composition/Capacity.
- **Excludes:** allocation/proposal acceptance, Live, learning, profile retirement.

### Phase 9 — Constructive Planning and Authorization

- **Objective:** turn competing Goal demand into explainable proposals and user-authorized scheduled reality.
- **Scope:** competition, Allocation, Proposal/Decision/Accepted Allocation, realization, horizons, Month/Review, publication/history.
- **First capability:** deterministic provisional allocation.
- **Final capability:** accepted Goal work is scheduled, visible, publishable, and executable.
- **Dogfood checkpoint:** Dogfood Pass 02 after converged ordinary loop.
- **Excludes:** Live Opportunity, learned promotion, profile retirement.

### Phase 10 — Live Adaptation and Learning

- **Objective:** respond to real-time divergence and turn history into user-controlled guidance.
- **Scope:** Released Interval/Live Capacity/Opportunity, live Proposal/direct action, learning/promotion, Summary/Teach closeout, profile compatibility retirement.
- **First capability:** detect and qualify released time.
- **Final capability:** user can act on live opportunity and explicitly promote learned guidance; legacy profile UI can retire safely.
- **Dogfood checkpoint:** Live/learning and final compatibility closeout.
- **Excludes:** native timer, unspecified generalized scenarios/templates.

## 58. First Implementation Increment

**Revisioned Planning Provenance and Freshness Foundation.** Establish the smallest shared identity/revision, typed origin, dependency-fingerprint/freshness, reason-code, persistence registration, migration, and history-resolution contracts required immediately by Goal Structure, Demand, Composition, and Capacity. Prove them through one non-user-visible vertical slice and targeted tests. Preserve every current scheduling/store schema and surface behavior. Exit when new contracts are versioned, recoverable, deterministic, documented, and usable by Task 8.2 without an empty framework or public half-domain.

## 59. First Canonical Task Recommendation

**Task 8.1 — Revisioned Planning Provenance and Freshness Foundation.** Define and implement the bounded cross-domain identity, revision, typed-origin, dependency-fingerprint, freshness/qualification, reason-code, persistence-registration, migration, and history-resolution primitives needed by the first Goal Structure, Demand, Composition, and Capacity increments; validate them through a thin internal vertical slice while leaving current scheduling behavior and all user-facing surfaces unchanged.

## 60. Remaining Unknowns

Task-level designs must choose module/API names, persisted envelope versions, cache strategy, thresholds, exact activation flags, UI composition, and compatibility duration. Product decisions remain for off-day policy variants, bulk correction scope, Summary defaults, and any future profile replacement. None blocks Task 8.1 or phase assignment.

## 61. Architecture Reopen Check

**No.** Sequencing exposes no contradiction in authority, time ownership, lifecycle, history, or ordinary/Live relationships. Remaining choices are implementation and product policy within accepted boundaries.

## 62. Roadmap Readiness Gate

**RM-A — Ready for Implementation.** Dependencies, three phase boundaries, first increment/task, migrations, checkpoints, regressions, Dogfood destinations, and activation rules are sufficiently bounded.

## 63. Conclusions

The core differentiator is reachable without replacing DayFrame’s working scheduler. Phase 8 establishes trustworthy planning inputs and derived truth; Phase 9 crosses the explicit user-authority boundary into schedule reality; Phase 10 extends it into Live and Learn. Continuous migration, provenance, accessibility, performance, and regression lanes keep every checkpoint coherent. Every Dogfood item has a delivery destination; DF-006 remains historical regression/observability evidence, never a guessed repair.

## 64. Recommended Next Step

Begin the first implementation increment through a separate DayFrame Canonical Task Block: **Task 8.1 — Revisioned Planning Provenance and Freshness Foundation**. Do not implement it from this roadmap task.

## 65. Completion Statement

**Post-Phase-7 Implementation Roadmap complete.**

The roadmap converts DayFrame's accepted post-Phase-7 architecture, completed Implementation Alignment Strategy, reconciled Dogfood Pass 01 evidence, and current executable foundations into a dependency-ordered implementation program; preserves the deterministic scheduling, user-day, recurrence, Preview, Friction, decision, publication, execution, Progress, persistence, backup, and surface foundations that remain architecturally sound; sequences Goal Structure, Goal Demand and Priority, Commitment Composition, Capacity, Goal-Specific Feasibility, competing Demand, Allocation, Constructive Proposal, ProposalDecision, Accepted Allocation, realization, planning-horizon separation, Planner/Review convergence, publication/history extension, Live Opportunity, learning/promotion, Summary, Teach, and compatibility work according to their semantic dependencies; keeps migrations, provenance, freshness, explainability, regression protection, accessibility, diagnostics, and historical compatibility attached to the increments that require them; routes every remaining Dogfood obligation—including bounded historical DF-006—into implementation, regression, UX, polish, preservation, or explicit deferral; distinguishes the critical path to DayFrame's core Commitments-to-Capacity-to-Goals-to-Proposal-to-user-authority loop from the complete longer-term alignment program; establishes meaningful implementation and Dogfood checkpoints; determines the next implementation phase name and boundaries only after sequencing the work; identifies the first coherent implementation increment and future canonical task starting point; and establishes whether DayFrame is ready to resume implementation without another architecture or audit cycle.
