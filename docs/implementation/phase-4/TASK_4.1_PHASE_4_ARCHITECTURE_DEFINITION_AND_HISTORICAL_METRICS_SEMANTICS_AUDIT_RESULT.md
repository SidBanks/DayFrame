# Task 4.1 — Phase 4 Architecture Definition and Historical Metrics Semantics Audit — Result

## 1. Executive Determination

**Determination A — Ready for Historical Intelligence implementation.** Phase 3
provides sufficient planned authority, observed authority, stable identity,
coverage semantics, frozen grouping context, and revision behavior. Historical
Intelligence is defined as a pure, deterministic, explicitly policy-versioned
projection. No new historical authority, persistence surface, Backup payload, or
prerequisite model is required for the bounded V1 slice.

## 2. Artifact Integrity

The supplied artifact is complete at 2,066 lines and byte-identical to the
immutable project copy. SHA-256:
`b61eeacf442220beda677a2febf52d06a1f541ffbaffc410954b593d278cd5e9`.

## 3. Phase 3 Starting Foundation

Phase 3 closed with HistoricalPlan V1 as planned-history authority,
ExecutionHistory V1 as observed-history authority, exact
`DurableOccurrenceReference` joins, frozen snapshots, source incarnations,
immutable correction/retraction, effective outcomes, complete-day publication,
missing-versus-empty coverage, Backup V3, restore, full clear, and deterministic
validation. It intentionally supplied no historical metric policy.

## 4. Audit Scope

The audit covered current historical fields and provenance; authority, durability,
coverage, window, denominator, outcome, revision, identity, grouping, duration,
explainability, statistical-language, Goals/Progress/Recommendation boundaries;
candidate projections; unsupported analytics; testing; performance; privacy; and
implementation sequencing. No production code or tests changed.

## 5. Audit Method

Current Phase 3 source types, materializers, projections, tests, ADRs, closure
checkpoint, result, and governance were traced before metric design. Each proposed
claim was tested against stored evidence and rejected or qualified where the
evidence could not support it.

## 6. Historical Evidence Inventory

| Evidence | Meaning/origin | Authority and survival | Analytical suitability |
| --- | --- | --- | --- |
| plan batch ID / `publishedAt` | publication identity/time | HistoricalPlan; restart/V3 stable | revision/as-of selection and provenance |
| batch range / complete days | requested publication coverage | HistoricalPlan authority | coverage denominator |
| `userDayDate` | frozen planning day | authoritative snapshot | primary V1 window key |
| day boundary / week start / UTC offset | effective day preferences at publication | frozen, restart/V3 stable | explanation; future grouping policy |
| durable occurrence reference | lifetime-safe occurrence identity | authoritative frozen join | exact plan/execution correlation |
| source family/title/category | frozen historical classification | plan snapshot, copied into execution | grouping/explanation |
| scheduled start/end | planned interval, not actual time | HistoricalPlan authority | planned elapsed duration/allocation |
| unplaced/omitted/blocked | operative plan state | HistoricalPlan authority | scheduling realization, not execution failure |
| execution subject / outcome | user-reported observation | ExecutionHistory authority | categorical numerator |
| actual `occurredAt` / duration | optional user evidence only | immutable assertion evidence | only explicitly present actual-time analysis |
| `recordedAt` / replacement chain | audit/revision time and lineage | immutable ExecutionHistory | correction/retraction provenance |
| effective outcome | current projection of revision head | derived | current-evidence analysis |
| quarantine/protection | invalid component / unsafe whole source | governed evidence/state | exclusion/availability explanation, never empty |

Historical friction details are not persisted as longitudinal authority and are
not suitable for Phase 4 historical analytics.

## 7. Historical Intelligence Definition

Historical Intelligence is the deterministic query/projection layer that answers
what can reasonably be said about the relationship between frozen plans and
current effective observed evidence. It produces descriptions, not truth records,
judgments, goals, recommendations, or causality.

## 8. Authority Boundary

HistoricalPlan remains the sole truth of what was planned. ExecutionHistory
remains the sole truth of what was observed. Historical Intelligence reads both
without mutation and never becomes a third historical authority.

## 9. Derived/Persistence Determination

Choose **A — purely derived** for V1. A future cache may be disposable and
rebuildable, but is not authorized now. Deleting an analytical cache must never
destroy historical truth.

## 10. Metric Policy Versioning

An explicit **HistoricalMetricPolicy V1** identity is required in conceptual
queries/results because denominator, outcome, and coverage rules affect results.
It is a code/policy identity, not a durable authority surface. A later semantic
change requires a new policy version rather than silently rewriting meaning.

## 11. Historical Coverage Semantics

An available complete-day publication proves the plan set for that day, including
zero occurrences. A missing day means plan authority is unavailable and supports
no zero/failure/perfection inference. Results report expected, published,
published-empty, and missing day counts/list provenance.

## 12. User-Day/Window Semantics

V1 queries use an inclusive `startUserDayDate`/`endUserDayDate` plus explicit
`evaluationAsOf`. Occurrences remain attached to frozen DayFrame user-days across
timezone changes. “Last N days” is resolved externally into an explicit range.
Initial weekly/cycle/all-history shortcuts are deferred. Historical `weekStartsOn`
is frozen per day, but mixed preference periods need a later explicit grouping
policy and are not silently regrouped under today's preference.

Scheduled UTC instants provide elapsed planned duration across DST; frozen day and
offset provide display/explanation. V1 does not reinterpret old days in a new
timezone.

## 13. Denominator Semantics

There is no universal denominator. Completion distribution and current-outcome
coverage use effective **scheduled** planned occurrences. Scheduling realization
uses all published scheduled/unplaced/omitted/blocked occurrences. Planned
allocation uses scheduled intervals. A metric must name its denominator.

## 14. Scheduled Semantics

Scheduled means an executable planned occurrence with a frozen interval and is V1
completion-distribution eligible. It does not prove execution.

## 15. Unplaced Semantics

Unplaced means intended demand was present but no placement was produced. It is
excluded from execution completion distribution and included separately in
scheduling realization. It is neither user failure nor proof of excessive demand.

## 16. Omitted Semantics

Omitted is an accepted planning omission. It is denominator-ineligible for
execution distribution but part of scheduling realization. Current evidence does
not encode a universal reason or moral meaning.

## 17. Blocked Semantics

Blocked records an accepted placement that could not be applied (currently exact
placement unavailable). It is planning-system/friction evidence, excluded from
execution distribution and reported separately in scheduling realization. It is
not noncompliance.

## 18. Numerator Semantics

For each eligible scheduled reference, join the current effective
ExecutionHistory subject exactly. Classify it as completed, partial, skipped,
unknown after retraction, or not reported. Do not combine categories or include
unplanned subjects in this plan-follow-through distribution.

## 19. Completed

Completed is positive user-reported categorical evidence for the occurrence. It
counts once in completed. Optional actual duration is separate and does not alter
categorical classification.

## 20. Partial

Partial remains a separate category. No 0.5 or inferred duration credit is
authorized. Actual minutes may be absent even when partial is reported.

## 21. Skipped

Skipped is explicit user-reported non-performance of the occurrence, but contains
no universal reason, blame, cancellation, or rescheduling meaning. It remains a
separate category.

## 22. Unknown

V1 has no assertion outcome named unknown. Effective unknown can result when a
known subject's current head is a retraction. This is distinguishable evidence of
withdrawn current knowledge, not failure or skipped.

## 23. No-Report Semantics

Not reported means no ExecutionHistory subject/evidence joins the eligible plan
reference. It is distinct from retracted unknown and must not be called missed,
skipped, incomplete, or failed.

## 24. Correction/Retraction

Current-evidence metrics project only each subject's effective head. Correction
reclassifies analysis without changing denominator or rewriting earlier evidence.
Retraction moves the subject to unknown, not skipped or not reported. Revision IDs
remain provenance for explanation.

## 25. HistoricalPlan Revision Semantics

V1 uses the latest effective day publication at the explicit `evaluationAsOf`.
Legitimate republication supersedes the denominator for present analysis while all
publications remain immutable. Original-plan and publication-comparison modes are
future explicit projections, not implicit alternatives.

## 26. As-Of Semantics

V1 is **current-evidence analysis of an occurrence window**: plan authority is
selected as of the explicit evaluation cutoff; current effective execution
evidence is used. “What did DayFrame believe then?” requires historical execution
as-of semantics and is deferred as a distinct mode. Occurrence `userDayDate`, not
`recordedAt`, selects the window; correction time remains audit provenance.

## 27. Source-Incarnation Semantics

Exact joins always use the full durable reference including incarnation lineage.
Deleted/recreated logical sources never retarget history. Cross-lifetime charts may
later use an explicit analytical grouping key/policy, but grouping never becomes
identity equivalence.

## 28. Category/Grouping Semantics

Default grouping uses frozen historical category and source family, never current
Active classification. Source-incarnation grouping is safe; logical cross-lifetime
grouping requires an explicit user/policy mapping and disclosure. Titles are
explanation labels, not stable identity keys.

## 29. Duration Semantics

Scheduled `startsAt`/`endsAt` support planned elapsed minutes for scheduled
allocation. Unplaced/omitted/blocked snapshots contain no duration and cannot
support universal demand minutes. Actual duration is optional user evidence;
missing duration cannot be inferred from plan duration or categorical outcome.
Occurrence-weighted and duration-weighted results must be separate metric IDs.

## 30. Reporting Coverage

Execution-dependent results disclose eligible scheduled count, completed/partial/
skipped current-outcome count, retracted-unknown count, and not-reported count.
Current-outcome coverage is `(completed + partial + skipped) / eligible` when
eligible is nonzero; it does not count retracted unknown as a current observation.

## 31. Evidence Quality / Coverage Terminology

Use **plan coverage** for published versus missing days, **current-outcome
coverage** for eligible subjects with a classified current outcome, and
**limitations/evidence quality** for qualitative constraints. Do not call coverage
“confidence”; no statistical confidence model exists.

## 32. Small-Sample Policy

V1 always shows counts and an explicit low-evidence limitation when appropriate.
Task 4.2 need not invent a universal minimum N because it does not need trends or
strong comparative claims. Percentages/trends require later metric-specific sample
policy; sparse evidence never supports strong language.

## 33. Zero-Denominator Policy

Zero eligible scheduled occurrences yields `notApplicable` with zero counts and
coverage context. It is never rendered as 0% completion or 100% reporting.

## 34. Missing-Coverage Policy

V1 may return known-coverage counts with status `incompleteCoverage`, explicit
missing days, and a limitation that results do not describe the whole requested
window. It must not extrapolate. Window-wide percentages are withheld unless plan
coverage is complete; callers may choose a strict mode later, but no silent refusal
or silent partial calculation is allowed.

## 35. Candidate Metric Assessment

The foundational pair is plan coverage plus categorical completion distribution.
Scheduling realization and planned allocation follow as separate planning
projections. Consistency, trends, and scores need further semantics.

## 36. Completion Distribution

Implement first. It answers how eligible scheduled occurrences classify under
current effective evidence, preserving completed/partial/skipped/unknown/not
reported counts and provenance. Counts precede shares.

## 37. Reporting Coverage Metric

Implement first as inseparable context for completion distribution. It answers how
much eligible scheduled history has a current classified execution outcome, not
whether unreported occurrences were completed.

## 38. Scheduling Realization

Implement later. It answers how published intended occurrences distributed among
scheduled, unplaced, omitted, and blocked. It evaluates planning output, not user
performance.

## 39. Planned Allocation

Implement later. Scheduled elapsed minutes may be grouped by frozen category or
source family. It is planned allocation, not actual time, capacity, or productivity.

## 40. Consistency

Needs more semantics: comparable populations, windowing, minimum evidence, and the
precise repeated property must be named. No generic consistency score is accepted.

## 41. Trends

Needs more semantics: comparable windows/populations, complete disclosed coverage,
sample sufficiency, correction behavior, and neutral language. “Improving,”
“declining,” and “stable” are not authorized in V1.

## 42. Composite Scores

Reject/defer. A DayFrame, success, productivity, discipline, or adherence score
would hide coverage and mix planning feasibility with reported execution. No
exceptional justification exists.

## 43. Capacity Intelligence

Current evidence supports counts of published demand, placed demand, and
blocked/unplaced demand, plus scheduled minutes. It does not reveal true human
capacity. Use “scheduling realization” or “unplaced/blocked demand,” not capacity
claims, until a capacity policy is defined.

## 44. Planning Realism

Repeated blocked/unplaced counts may descriptively show that the planner did not
place published demand. They do not prove user overcommitment or identify cause.
This belongs after scheduling-realization V1.

## 45. Causality Boundary

Historical Intelligence may report associations under named comparable windows
(for example, lower completed share co-occurred with more scheduled work). It must
not say one factor caused another without a separately justified causal design.

## 46. Recommendation Boundary

Recommendations are a separate policy consuming metrics, current planning context,
coverage, and limitations. Historical Intelligence V1 emits descriptions only and
never edits priorities, durations, windows, templates, weights, or schedules.

## 47. Goals Boundary

A metric describes evidence; a Goal describes a desired future state. A future
Goal may reference a stable metric identity and policy but does not change metric
authority or meaning.

## 48. Progress Boundary

Progress requires a Goal, its evaluation policy/window, and historical metric
evidence. Historical metrics alone do not create Progress. Goal identity,
lifetime, revision, and target semantics remain undefined.

## 49. Summary Relationship

Historical Intelligence can later feed Capacity with qualified planning evidence
and Allocations with HistoricalPlan projections. Progress requires future Goals;
Recommendations require future policy. Task 4.1 does not redesign Summary UI.

## 50. Planner Relationship

Historical Intelligence cannot mutate Planner. A future recommendation may offer
an explicit, explainable user-visible proposal. Users continue to define
priorities; DayFrame builds schedules.

## 51. API/Projection Boundary

Prefer explicit conceptual projections:

- `getHistoricalCoverage(query)`;
- `getCompletionDistribution(query)`;
- later `getSchedulingRealization(query)`;
- later `getPlannedAllocation(query)`.

Each query resolves policy, range, cutoff, filters, and grouping explicitly. The
result includes metric identity/version, value/distribution, eligibility,
coverage, exclusions, provenance, and limitations.

## 52. Generic Engine vs Explicit Projections

Choose explicit projections. A generic engine would enable arbitrary denominator,
weight, and grouping combinations that look valid but lack governed meaning.
Shared pure helpers are acceptable beneath explicit semantic contracts.

## 53. Domain Placement

Metric semantics and pure transformations belong in the core projection/domain
layer. Authority-range retrieval/composition belongs in an application query
layer. IndexedDB remains infrastructure and must not own analytical meaning. UI
only presents named results and explanations.

## 54. Persistence/Backup/Restore Boundary

V1 adds no metric persistence. Backup V3 excludes derived output. Restored
HistoricalPlan + ExecutionHistory + the same policy/query reproduce metrics. Full
clear naturally yields missing/empty/not-applicable projections; there is no
metric clear participant or restore payload.

## 55. Determinism

Identical HistoricalPlan, ExecutionHistory, policy version, and resolved query
must produce identical clone-isolated output. No projection reads the wall clock;
relative windows are resolved before invocation. Ordering and rounding rules must
be canonical if shares are later added.

## 56. Explainability/Provenance

Every result exposes metric identity/definition, policy version, resolved window
and cutoff, eligible/observed/excluded counts, plan/outcome coverage, categorical
breakdown, limitations, and contributing/excluded durable references with reason
codes sufficient for future drill-down. Explanations use frozen snapshots.

## 57. Testing Strategy

Task 4.2 tests should cover complete/missing/empty/mixed coverage; zero denominator;
all plan and outcome states; no report versus retracted unknown; correction;
republication; incarnation mismatch; ordering determinism; frozen user-day/timezone
and DST-adjacent intervals; restart/V3 equivalence; and full-clear output. Pure
tests lead, followed by query-composition integration; no timeout-based correctness.

## 58. Golden Semantic Fixtures

Adopt canonical fixtures: fully reported week, partially reported week, missing
coverage, published-empty week, mixed scheduling-realization week, corrected and
retracted week, source recreation mid-window, and plan republication. Expected
results should be policy-versioned and human-reviewable.

## 59. Property Invariants

Future properties include: adding a classified report cannot reduce outcome
coverage; correction cannot change plan eligibility; retraction changes classified
coverage to unknown; current Active deletion cannot change history; V3 roundtrip
preserves results; published-empty increases plan coverage without demand; missing
never becomes zero demand; permutation does not change output; and full clear
leaves no derived historical result.

## 60. Performance/Data Volume

Start with pure derivation over bounded IndexedDB range queries. Multi-year local
history is plausible, but no measured requirement justifies caches or incremental
aggregates. Measure after V1; introduce only disposable policy-keyed caches if
needed. Existing day/reference indexes and bounded queries are the initial basis.

## 61. Privacy

Historical Intelligence operates locally over existing local authority. No
telemetry, cloud analytics, external inference, sharing, or new sensitive
persistence is introduced.

## 62. Export

Analytical report export is a later UX feature, not needed for foundational
projections. Backup V3 must remain domain authority and must not include derived
metrics. A future report export must disclose policy, window, coverage, and
limitations.

## 63. Unsupported Historical Analytics

Not currently supported: friction-history trends, causal explanations, true human
capacity, duration-weighted partial completion without actual duration, historical
execution belief-as-of, cross-lifetime identity merging, motivations/reasons for
skip/omit/block, broad weekly comparison under preference drift, composite
productivity/adherence scores, Goal Progress, recommendations, and automatic
learning.

## 64. Semantic Decision Matrix

| Question | Decision | Evidence | Consequence |
| --- | --- | --- | --- |
| metric authority | pure derived projection | Phase 3 authority split | no third truth/persistence |
| policy versioning | explicit HistoricalMetricPolicy V1 | rules alter results | result/query identity includes version |
| denominator eligibility | metric-specific | plan states answer different questions | no universal denominator |
| scheduled | execution-distribution eligible | frozen executable interval | completion/reporting denominator |
| unplaced | planning realization only | intended but no placement | never automatic user failure |
| omitted | planning realization only | accepted omission | execution-ineligible |
| blocked | planning realization only | placement unavailable | planning evidence, not noncompliance |
| completed | separate classified outcome | user assertion | positive categorical count |
| partial | separate classified outcome | user assertion lacks universal fraction | no numeric weight |
| skipped | separate classified outcome | explicit user report | known non-performance, no moral reason |
| unknown | retracted effective subject | immutable chain projection | separate from skip/no report |
| no report | no joined subject | absence of evidence | not missed/failure |
| missing coverage | unknown plan authority | no day publication | incomplete result/no extrapolation |
| published empty | known zero plan set | complete empty day | covered day, zero demand |
| correction | recompute effective category | replacement chain | denominator unchanged |
| retraction | effective unknown | retraction head | never skipped |
| plan revision | latest effective at cutoff | append-only as-of projection | explicit evaluation cutoff |
| analytical window | inclusive user-day range | frozen userDayDate | deterministic overnight-safe scope |
| source incarnation | exact identity join | durable reference | no accidental retargeting |
| category grouping | frozen historical category | plan/execution snapshot | current Active cannot reinterpret |
| explainability | mandatory provenance/coverage | epistemic principle | drill-down-capable results |

## 65. Metric Candidate Matrix

| Candidate | Question answered | Inputs | Coverage requirement | V1 recommendation |
| --- | --- | --- | --- | --- |
| completion distribution | current evidence state of scheduled plans | effective plan + outcomes | plan and current-outcome coverage | Implement first |
| reporting coverage | how much scheduled history has classified evidence | scheduled references + outcomes | complete disclosure; ratio only nonzero denom | Implement first |
| scheduling realization | distribution of planner states | HistoricalPlan | plan coverage | Implement later |
| planned allocation | scheduled elapsed time by frozen group | scheduled intervals | plan coverage | Implement later |
| consistency | repeated named property | future comparable windows | sample/coverage policy | Needs more semantics |
| trend | qualified change across comparable windows | multiple policy-stable results | complete comparable coverage | Needs more semantics |
| composite score | undefined judgment | heterogeneous metrics | cannot cure semantic collapse | Reject/defer |

## 66. Evidence-State Matrix

| Planned state | Execution evidence | What may be concluded? | What must not be concluded? |
| --- | --- | --- | --- |
| scheduled | completed | scheduled occurrence was reported completed | timing/quality/causality without evidence |
| scheduled | partial | reported partial | fractional completion or failure |
| scheduled | skipped | reported skipped | reason, blame, or permanent cancellation |
| scheduled | unknown | current observation was withdrawn | missed/skipped/failure |
| scheduled | none | no current report exists | not completed/missed |
| unplaced | any | plan lacked placement; report category may be described separately | user failure or scheduled follow-through |
| omitted | any | plan intentionally omitted; report may exist | noncompliance or executable denominator |
| blocked | any | accepted placement was unavailable; report may exist | user failure or cause beyond evidence |
| missing plan coverage | any | execution evidence may stand alone but plan relationship is unknown | zero demand or plan follow-through |
| published empty | none | known zero published occurrences | missing data or perfect completion |

## 67. Coverage Matrix

| HistoricalPlan coverage | Planned occurrences | Reporting coverage | Analytical interpretation |
| --- | ---: | ---: | --- |
| complete | >0 | complete | categorical distribution describes full eligible window |
| complete | >0 | partial | plan known; execution distribution includes explicit unknown/not reported |
| complete | 0 | n/a | known zero demand; metric not applicable |
| partial/missing | >0 | complete for known | known-day counts only; window incomplete, no extrapolation |
| partial/missing | >0 | partial | both plan and execution limitations disclosed |
| none | unknown | unknown | unavailable for plan-relative analysis |

Mixed example: 14 expected days, 10 published including 2 empty, and 4 missing
means plan coverage is 10/14 with 2 known-zero days; metrics describe only known
days and list the 4 missing days.

## 68. Architecture Matrix

| Layer | Input | Output | Durable? | Authority? |
| --- | --- | --- | ---: | ---: |
| HistoricalPlan | fresh authoritative Preview publication | planned day revisions | yes | yes, planned history |
| ExecutionHistory | user-reported assertions/retractions | immutable observed revisions | yes | yes, observed history |
| Historical Intelligence | both authorities + policy + query | descriptive projections | no | no |
| future Goals | user-defined desired states | governed Goal objects | undecided | future authored authority |
| future Progress | Goals + metrics + evaluation policy | derived progress | likely no | no by default |
| future Recommendations | metrics + current context + policy | explainable proposals | undecided | advisory, not automatic authority |

## 69. Required Invariant Assessment

| # | Invariant | Classification |
| ---: | --- | --- |
| 1 | HistoricalPlan sole planned-history authority | Confirmed |
| 2 | ExecutionHistory sole observed-history authority | Confirmed |
| 3 | Historical Intelligence is derived | Proposed/accepted |
| 4 | metrics do not mutate authority | Proposed/accepted |
| 5 | deterministic from authority + policy + query | Proposed/accepted |
| 6 | missing plan coverage is not zero work | Confirmed |
| 7 | published-empty is known zero work | Confirmed |
| 8 | no report is not failure | Confirmed |
| 9 | unknown is not failure | Confirmed |
| 10 | partial has no arbitrary weight | Confirmed |
| 11 | unplaced is not user failure | Proposed/accepted |
| 12 | blocked is not user failure | Proposed/accepted |
| 13 | omitted is not user failure | Proposed/accepted |
| 14 | corrections change analysis without rewriting evidence | Confirmed |
| 15 | retractions do not become skipped | Confirmed |
| 16 | recreation cannot retarget joins | Confirmed |
| 17 | grouping does not weaken identity | Proposed/accepted |
| 18 | current Active does not reinterpret frozen facts | Confirmed |
| 19 | occurrence/duration weighting remain distinct | Proposed/accepted |
| 20 | execution claims carry reporting coverage | Proposed/accepted |
| 21 | zero denominator is not 0% | Proposed/accepted |
| 22 | sparse evidence limits claims | Proposed/accepted |
| 23 | correlation is not causation | Proposed/accepted |
| 24 | metrics differ from Goals | Confirmed architectural boundary |
| 25 | Progress requires undefined Goal semantics | Confirmed |
| 26 | Recommendations differ from metrics | Proposed/accepted |
| 27 | no automatic learning | Deferred |
| 28 | Backup V3 excludes derived metrics | Confirmed |
| 29 | full clear naturally clears derived output | Confirmed by derivation |
| 30 | restored authority reproduces output | Proposed deterministic invariant |
| 31 | results explain contributing evidence | Proposed/accepted |
| 32 | composite judgment scores deferred | Deferred |

No invariant remains “Requires decision” for Task 4.2.

## 70. Architectural Risks

- A generic engine could allow ungoverned denominator/weight combinations.
- Incomplete plan coverage could be hidden behind plausible percentages.
- Retraction and not-reported could be collapsed into the same apparent zero.
- Current source/category data could accidentally rewrite frozen groupings.
- Future comparison/trend language could overstate sparse or noncomparable data.
- Duration weighting could imply actual effort when only planned time exists.

The accepted explicit-projection, coverage, policy-version, and provenance rules
bound these risks.

## 71. Stop-Condition Assessment

No stop condition was met. HistoricalPlan supplies complete-day denominators and
revision selection; ExecutionHistory supplies current categorical outcomes;
durable references join safely; missing/empty is explicit; frozen day/category/
source context supports V1 grouping; user-day windows are reliable. Limitations in
week drift, actual duration, friction history, and execution as-of do not block the
bounded categorical V1 projection.

## 72. Phase 4 Architecture Determination

**A. Ready for Historical Intelligence implementation.** The approved semantics
are sufficient for a narrow pure projection without new authority or prerequisite
work.

## 73. Recommended First Implementation Slice

**Task 4.2 — Implement Historical Coverage and Completion Distribution Projection
V1.** Scope: explicit inclusive user-day range/evaluation cutoff; latest effective
plan; plan coverage; scheduled eligibility; completed/partial/skipped/unknown/not
reported counts; current-outcome coverage; zero denominator; incomplete-coverage
limitations; deterministic reference provenance; pure API and semantic fixtures.

Exclude UI expansion, persistence, percentages beyond explicitly defensible
coverage, scheduling realization, allocation, comparisons, trends, Goals,
Progress, recommendations, and learning.

## 74. Recommended Phase 4 Sequence

1. 4.1 architecture and semantics — complete.
2. 4.2 historical coverage + completion distribution pure projection.
3. Explanation/drill-down and bounded Historical Intelligence UI.
4. Scheduling realization and planned allocation projections.
5. Comparative/trend semantics audit, then bounded implementation if justified.
6. Goals architecture, followed separately by Progress.
7. Recommendation policy and learning only after sparse-evidence safeguards.

## 75. Governance Recommendations

Accepted and published:

- `ADR_HISTORICAL_INTELLIGENCE_DERIVED_PROJECTION_AND_METRIC_POLICY_SEMANTICS.md`;
- `CHECKPOINT_Phase_4_Historical_Intelligence_Architecture.md`;
- CURRENT_STATE Phase 4 architecture summary;
- ROADMAP design-first sequence and Task 4.2 boundary;
- concise CHANGELOG entry.

Future Task 4.2 must not claim Phase 4 completion or broaden the accepted metric
family without another semantic decision.

## 76. Final Audit Statement

DayFrame possesses enough truthful planned and observed history to begin
Historical Intelligence without inventing new truth. The accepted architecture
derives transparent, deterministic, policy-versioned, provenance-bearing
descriptions; preserves missing, empty, partial, skipped, unknown, and not-reported
distinctions; keeps planner feasibility separate from execution evidence; and
defers judgment scores, causality, Goals, Progress, Recommendations, and learning.
Task 4.2 is authorized as the narrow first proof of this architecture. No
production TypeScript, UI, storage schema, Backup format, domain version, or test
was modified by Task 4.1.
