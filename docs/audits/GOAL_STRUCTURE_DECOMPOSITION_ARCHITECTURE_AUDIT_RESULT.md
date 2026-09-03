# Goal Structure / Decomposition Architecture Audit Result

## 1. Executive Findings

DayFrame currently implements a **GS4 — Flat Goal Domain with Indirect Analogues**. `GoalV1` is an independently identified, revisioned outcome with lifecycle, optional target date and measurement-policy reference, plus incarnation-safe links to Commitment-like sources. It has no Goal-to-Goal edge, parent, child, milestone, dependency, contribution, ordering, structural priority, or roll-up field. Exact-field validation rejects such additions (`code/src/core/goals/goal.ts:22-36,62-137`).

The analogues are useful but semantically narrow: Goal-linked Commitments provide service/activity association; measurements provide per-Goal outcome evaluation; historical plan snapshots freeze Goal context on linked occurrences. None represents decomposition.

The central answer is **no**: the current domain cannot safely support structured Goals as required for parent/child Demand accounting. The accepted Goal Demand specification does not say whether parent and child Demand are independent, nested, derived, or mixed. A first-class normative Goal Structure specification is therefore required before constructive Proposal is specified. Proposal may ultimately consume normalized Demand and remain mostly structure-agnostic (**Case C, with a limited Case B implementation boundary**), but normalization cannot be correct until structure, Demand attribution, priority, dependency, and provenance semantics are resolved.

Primary gate: **Path A — Goal Structure Architecture Specification**.

## 2. Audit Scope and Method

This was a read-only investigation of production code, deterministic tests, accepted Goal Demand/Allocation architecture, persistence/restore, historical publication, Progress, Summary/Goal Activity, execution, and decision acceptance. Claims use:

- **Confirmed** — established by executed production paths or deterministic tests.
- **Inferred** — strongly suggested but not directly exercised.
- **Not Found** — absent after repository-wide semantic and terminology searches.

No schema, source, test, configuration, or existing document was changed. The present result is the sole audit write.

## 3. Current Goal Domain

**Confirmed.** `GoalV1` contains version, UUID identity, revision, title, optional description, status, timestamps, optional target date, optional measurement-policy reference, and Commitment links (`code/src/core/goals/goal.ts:4-37`). `GoalAuthorityV1` is a flat array. Canonicalization trims title and sorts links; authority canonicalization sorts Goals by ID (`goal.ts:139-177`). No structural field exists.

The UI exposes create/edit, complete/archive/reactivate, and link/unlink Commitment operations (`code/src/ui/GoalSection.tsx:15-21,125-181`). It does not expose decomposition.

## 4. Goal Identity and Lifecycle

**Confirmed.** Goal IDs are cryptographic UUID-v4 values; revision begins at 1 and increments on every edit, status transition, link, or unlink (`goal.ts:42-60`; `code/src/state/goalSurface.ts:112-219`). Status is exactly `active | completed | archived`; coherent `completedAt`/`archivedAt` timestamps are validated (`goal.ts:91-107`). Reactivation clears terminal timestamps. Identity is stable across revisions, but there is no separate Goal incarnation ID and no retained Goal revision ledger in active Goal authority.

There is no delete-one command. `clearGoals` removes the collection (`goalSurface.ts:261-270`); backup/restore can replace authority transactionally. Similar title does not imply identity reuse, but future relationships would need explicit lifetime policy because relationship targets currently have only Goal ID/revision semantics.

## 5. Goal Mutation Paths

**Confirmed.** `createGoal`, `updateGoal`, status commands, `linkCommitment`, and `unlinkCommitment` all construct one candidate and replace only that Goal after stale-revision and validation checks (`goalSurface.ts:112-252,272-305`). No mutation reads or changes another Goal. No completion/archive cascade exists. Failed durability leaves explicit pending/storage-failure state rather than silently reverting (`goalSurface.ts:221-259`).

Backup restore validates and installs whole Goal authority through restore participants (`code/src/state/dayFrameRestoreComposition.ts:236-258,322`). Because relationships are absent, none can survive import, replacement, profile operations, or clearing.

## 6. Goal Linking

`GoalCommitmentLinkV1` is a directed association stored on a Goal. It targets exactly seven Commitment-like source kinds and requires source ID plus `SourceIncarnationId` (`goal.ts:8-20,45-53,181-190`). Duplicate exact links are rejected. A source may be linked from multiple Goals because `getGoalsForCommitment` filters all Goals and no uniqueness constraint exists (`goalSurface.ts:100-111`).

| Link Mechanism | Source | Target | Semantic Meaning | Time Ownership? | Progress Meaning? | Structural Goal Relationship? |
|---|---|---|---|---:|---:|---:|
| `GoalCommitmentLinkV1` | Goal | block template | Association/service provenance | Target may own/generate time | None | No |
| Same | Goal | block recurrence | Association/service provenance | Target may own/generate time | None | No |
| Same | Goal | manual event | Association/service provenance | Target owns time | None | No |
| Same | Goal | shift definition/cycle/segment/entry | Association/service provenance | Target generates work time | None | No |
| Historical `goals[]` | planned occurrence snapshot | frozen Goal snapshot | Decision-time attribution | Snapshot records planned state | Activity only, not outcome Progress | No |

**Not Found:** Goal-to-Goal links, semantic edge kinds, weights, relationship lifecycle, prerequisites, contribution, or structure ordering.

## 7. Current Progress Model

**Confirmed.** Progress is queried for one `goalId` and evaluation cutoff. The query resolves that Goal, its effective measurement-definition revision, and its latest qualifying observation for the same Goal/definition/revision (`code/src/state/goalProgressQuery.ts:17-74`). Manual quantity projection compares one observed decimal with one target, producing ratio, percentage, and provenance (`code/src/core/progress/manualQuantityProgress.ts:11-96,131-255`).

Definitions and observations have independent revision histories and exact Goal bindings. Progress does not inspect Goal links, other Goals, execution, Commitments, children, or ancestors. Therefore child aggregation, weighting, milestone evaluation, prerequisite evaluation, multi-Goal contribution, Commitment contribution, and execution-derived Progress are **Not Found**.

## 8. Goal Completion

**Confirmed.** Completion is an explicit status mutation that writes `status: completed` and `completedAt` (`goalSurface.ts:169-187,303-305`). Measurement comparison can report `atTarget` or `aboveTarget`, but does not mutate lifecycle (`manualQuantityProgress.ts:222-255`). Summary may display lifecycle and Progress together but does not equate them.

DayFrame can distinguish explicit completion from measurement state, but cannot represent “complete because all required subordinate outcomes were achieved.” Subordinate completion semantics are **Not Found**.

## 9. Goal Hierarchy Search

Repository-wide production searches for parent/child, hierarchy/tree, subgoal, milestone, prerequisite, Goal dependency, `dependsOn`, `blockedBy`, `contributesTo`, `partOf`, `parentId`, `relatedGoals`, and semantically plausible Goal relations found no structural Goal implementation. `goalId` occurrences bind measurements, observations, activity queries, and historical snapshots to one Goal. Generic `blocked` plan states and source-parent concepts elsewhere are scheduling/storage false positives, not Goal structure.

Classification: parent Goal **Not Found**; children **Not Found**; implicit hierarchy **Not Found**.

## 10. Milestone Support

| Candidate | Classification | Reason |
|---|---|---|
| Goal lifecycle completion | Partial Analogue | Checkpoint-like terminal state, but of the whole Goal |
| Target value / comparison | Partial Analogue | Can express one measurable threshold, not named checkpoint identity/lifecycle |
| Progress observation | Wrong Abstraction | Evidence at a time, not a durable checkpoint |
| Linked Commitment | Wrong Abstraction | Authorized activity, not outcome state |
| Historical event | Wrong Abstraction | Activity provenance, not milestone authority |
| Independent milestone concept | Not Found | No model, mutation, persistence, query, or test |

Milestones independently classify **GS5-equivalent — Not represented**.

## 11. Subgoal Support

Independent Goals can be manually titled as if subordinate, but the system cannot know they are related. No edge can carry required/optional, contribution, ordering, completion dependency, Demand accounting, or Progress aggregation. Goal primitives could provide each Subgoal’s own identity, lifecycle, Progress, target, and future Demand, but not “subordinate to.” This is **GS4 simulation**, not Subgoal support.

## 12. Dependency / Prerequisite Support

**Not Found.** Goals cannot depend on or block Goals. Commitment placement constraints and plan `blocked` states concern occurrence scheduling, not outcome eligibility. Structural containment, Goal dependency, and scheduling dependency remain distinct; the implementation represents only the last through scheduling primitives. Goal Dependencies classify **GS5-equivalent**.

## 13. Goal vs Activity

The type boundary is structurally clear: Goal is outcome metadata and never owns time; activities arise as Commitment/work/manual-event occurrences and execution records. The authoring UX permits arbitrary Goal titles, so a user can name a Goal “Study for 45 minutes,” but no type-level classifier prevents task-like wording. This is a UX blur, not a time-authority leak: creating the Goal schedules nothing.

## 14. Goal vs Commitment

Users can model “Earn Network+” with linked Study and Practice Exam Commitments. This achieves many-to-many association, source-incarnation safety, occurrence-level frozen Goal attribution, Goal Activity counts, and execution distribution. It does **not** provide subordinate outcome identity, independent outcome Progress/completion, priority inheritance, Goal dependency, Demand satisfaction, or historical structure. Treating links as children would turn activity into outcome and violate authority boundaries.

## 15. Goal vs Goal Demand

The accepted architecture defines Goal Demand as independently identified resource-seeking intent for exactly one Goal, separate from time ownership and Progress (`docs/architecture/GOAL_DEMAND_ALLOCATION_ARCHITECTURE_SPECIFICATION_RESULT.md:70-103,407-416`). It intentionally does not define Goal structure.

For parent/child Goals, current implementation and specification cannot distinguish:

- independent parent plus child Demand;
- child Demand nested inside a parent total;
- parent Demand derived solely from children;
- mixed independent and attributed Demand.

The missing boundary is an explicit, provenance-bearing **Demand contribution/accounting relationship across Goal structure**, including inclusion/exclusion and aggregation authority. Existing Goal links do not supply it.

## 16. Double-Demand Risk

The Goal Demand specification prevents the same Capacity portion from being allocated twice within a competing evaluation and requires explicit satisfaction attribution for linked Commitments (`...SPECIFICATION_RESULT.md:176-189,525-552`). It does not know parent/child relationships. Consequently two independent Demands for five and two hours are legitimately seven hours to that architecture, even if the user intended five total.

Thus the specification does **not** solve parent/child Demand accounting. Allocation can prevent overlapping Capacity assignment but cannot correct over-stated input Demand. The required missing semantic is relationship-scoped Demand attribution/containment, resolved before competing Demand construction.

## 17. Goal Priority and Structure

Accepted Goal Priority is separate authored planning authority used to rank discretionary Demand (`...SPECIFICATION_RESULT.md:202-220`). No executable Goal Priority implementation was found, and the architecture contains no inheritance rule. Parent inheritance, child override, independent child priority, and sibling ranking are unresolved. Silent inheritance could amplify shared-child importance, erase explicit child intent, or manufacture priority from containment; it is unsafe.

Priority Inheritance classifies **GS5-equivalent — Not represented and not specified**.

## 18. Lifecycle Propagation

Because no relationship exists, every scenario is independent: completing or archiving a putative parent changes only that Goal; completing/archiving children changes only each child; all children completed does not complete a parent; parent target-date change does not affect children; differing target dates coexist unknowingly. Clearing/replacement can remove any/all Goals but is not cascade semantics. Child Demand orphan/staleness behavior under structural lifecycle requires future specification.

## 19. Progress Roll-Up

Current evidence supports only **No Roll-Up**: each Goal owns independent Progress. Completion roll-up, weighted averaging, measurement roll-up, and explicit mixed contribution are absent. Automatic averaging would assume equal weights, compatible units, complete child sets, and containment; all are unsupported. Progress Roll-Up classifies **GS5-equivalent**.

## 20. Historical Goal Structure

Historical planned occurrences freeze linked Goal ID, revision, title, status, and optional measurement policy (`code/src/core/historicalPlan/historicalPlan.ts:22-67`; `materializePlanPublication.ts:139-180`). They do not freeze description, target date, Goal links, measurement-definition content, parent/child edges, dependency, or ancestry.

Future structural relationships that affect decisions require decision-time identity/revision and effective edge provenance; otherwise later reorganization rewrites interpretation or makes it unknowable. Current history can preserve immediate Goal attribution only. Historical Structure Provenance classifies **GS3-equivalent — reusable snapshot mechanism without structure**.

## 21. Summary / Goal Activity

Goal Activity queries one Goal ID and finds occurrences whose frozen `goals[]` contains that ID (`code/src/core/historicalIntelligence/goalActivity.ts:33-51,156-208`). Planning and execution distributions are per immediate linked Goal; no ancestor traversal occurs. Current behavior assumes a flat set.

If parent and child are both linked to one occurrence, each independent Goal view includes it. A future cross-Goal Summary could double count activity unless it deduplicates occurrence identity and labels attribution semantics. Progress remains independently derived, so Summary implies no hidden hierarchy today.

## 22. Execution and Logging

Execution records target durable occurrences, not Goals directly. Goal Activity joins execution history to historical scheduled occurrences, then uses frozen Goal provenance (`goalActivity.ts:209-280`). Progress observations are separate direct Goal evidence.

Current provenance preserves activity, occurrence identity, immediate linked Goals, and execution result. It cannot preserve ancestor context or structural contribution. A structured chain therefore needs additional decision-time relationship provenance where ancestor interpretation matters; ancestor logging must not duplicate the execution record.

## 23. Found Time Interaction

No Found-Time implementation was in scope or found as a Goal-structure consumer. A correct future recommendation over decomposed Goals may need normalized active Demand, dependency eligibility, priority scope, milestone state, and whether parent/child Demand overlaps. Proposal need not necessarily traverse the graph itself, but these facts must be resolved upstream and explained. Selecting a child merely because its parent is important would invent authority.

## 24. Proposal Dependency

Best classification: **Case C — Goal Structure Affects Demand / Allocation Inputs**, combined with a constrained **Case B** downstream boundary. Structure determines which Demand exists, whether it is nested or independent, what competes, and how priority/dependency applies; therefore a constructive Proposal contract cannot yet assume its inputs are correct. Once a normative structure service produces normalized, non-duplicative Demand and eligibility, Proposal can remain structure-agnostic except for explanation/provenance context. Case D is not yet required by evidence.

## 25. Minimum Semantic Vocabulary

| Concept | Classification | Current boundary |
|---|---|---|
| Goal | Already First-Class | Desired outcome; no time ownership |
| Parent Goal | Missing | Broader outcome relation absent |
| Subgoal | Partially Represented | Independent Goal primitives reusable; subordination absent |
| Milestone | Missing | Measurements are only analogues |
| Dependency | Missing | Goal eligibility/order absent |
| Commitment | Already First-Class | Authored time-owning source |
| Activity | Partially Represented | Occurrence/execution expresses performed work; no universal Activity entity |
| Goal Demand | Specified, not executable | Resource request distinct from Goal/time |
| Scheduled Goal Work | Specified, not executable | Time-owning accepted realization |
| Progress | Already First-Class | Per-Goal outcome measurement |
| Execution | Already First-Class | Historical occurrence outcome evidence |

## 26. Structural Relationship Taxonomy

| Relationship | Current state | Audit assessment |
|---|---|---|
| Parent / Child | Absent | Necessary candidate; semantics beyond display containment required |
| Contributes To | Absent | Likely necessary for shared/multi-parent outcomes; may subsume loose containment |
| Depends On | Absent | Necessary if Goal eligibility/order affects Demand |
| Blocks | Absent | Potential derived view of unmet dependency; avoid redundant authored inverse |
| Milestone Of | Absent | Needed only if Milestone becomes first-class |
| Served By | Goal-to-Commitment link analogue | Reusable with clearer semantic name/accounting boundary |
| Demand For | Normatively specified Goal Demand→Goal | Required and separate from structure |

Not every candidate needs its own persisted inverse. The future specification should minimize authored edge kinds while preserving distinct semantics.

## 27. Tree vs Graph Assessment

A simple tree is insufficient as a default assumption. One outcome can contribute to multiple broader Goals, while dependency edges cross containment. Current many-to-many Goal/Commitment attribution and array-based historical `goals[]` demonstrate graph-capable provenance patterns, though not Goal graph support. Future architecture must address stable edge identity, multi-parent contribution semantics, deduplication, containment and dependency cycles, deterministic traversal, and whether strict containment is single-parent while contribution remains a graph. No final topology is selected here.

## 28. Ordering Semantics

Containment does not imply sequence. Display order, priority order, prerequisite order, and scheduling order are four different relations. Current Goals have no ordering field; authority is canonically sorted by ID, which is storage determinism only (`goal.ts:164,192-193`). Commitment priorities and scheduler placement must not be repurposed as Goal dependency or display order.

## 29. User Authority

Current Goals are user-authored through explicit commands; no engine automatically creates Goals. `PlanDecisionV1` provides a useful acceptance pattern: user or suggested-fix provenance, accepted timestamp, durable target, and explicit payload (`code/src/core/decisions/planDecision.ts:27-60`). It is reusable with adaptation, not sufficient for structural acceptance because it targets occurrences and supports only placement/omission/duration/priority actions. Suggested decomposition must remain a Proposal until explicit acceptance creates authored relationship authority.

## 30. Determinism Requirements

Accepted architecture necessarily exposes future requirements for stable Goal and relationship identity, exact revisions/effective times, deterministic cycle rejection, deterministic ancestor/contributor traversal, explicit dependency evaluation, unit/policy-safe Progress aggregation, non-duplicative Demand accounting, deterministic priority resolution, and canonical provenance/fingerprints. Algorithms and schemas remain for specification.

## 31. Persistence / Backup Compatibility

Goals persist in an IndexedDB collection and whole-authority replacement is deterministic (`goalSurface.ts:80-98,243-252`). Backup V4 introduced Goal authority; V6 validates Goals, measurement definitions, and observations with referential integrity (`code/src/state/dayFrameBackupV4.ts:54-104`; `dayFrameBackupV6.ts:26-70`). Restore translators reject invalid Goal authority (`code/src/state/dayFrameRestoreTranslation.ts:222-235`).

The versioned/exact-validation architecture can evolve, but current formats cannot preserve structural IDs, edge revisions, effective relationships, or historical structure. Adding them requires explicit format migration, backup/restore participation, referential validation, and fingerprints—not an unversioned field append.

## 32. Source-Lifetime Safety

Commitment links are incarnation-safe because they bind source kind, ID, and incarnation. Goal structural targets would bind Goal identity, for which UUID allocation and revision exist but a distinct incarnation/lifetime model does not. Retiring and later recreating a similarly titled Goal cannot retarget by title; however reuse/import collision, removed relationship targets, and historical revision resolution require specification. Copying `GoalId` alone into `parentGoalId` would not preserve relationship identity or decision-time edge semantics.

## 33. Current-System Flow

```text
GoalSection explicit command
  → GoalSurface validation/revision
  → IndexedDB Goal authority
  → Goal↔Commitment-source incarnation links
  → schedule preview occurrence
  → published occurrence with frozen immediate Goal snapshots
  → execution record targets occurrence
  → Goal Activity joins execution to frozen Goal ID

Goal
  → effective measurement-definition revision
  → effective Progress observation
  → per-Goal Progress projection
  → Summary display
```

There is no Goal-to-Goal structure entry point anywhere in this current flow.

## 34. Intended Structured-Goal Boundary Flow

The following is conceptual and **not implemented**:

```text
Authored Goal Structure + lifecycle/dependency state
  → normalized active Goal/Subgoal context
  → Demand authority and structural accounting
  → Demand Projection
  → Capacity / Goal-Specific Feasibility / Competing Demand / Allocation
  → constructive Proposal
  → explicit user acceptance
  → Scheduled Goal Work
  → Execution + Progress
  → frozen decision-time Goal/relationship provenance
  → Summary
```

The seam before Demand Projection must resolve overlap and eligibility; the history seam must freeze structure that influenced the decision.

## 35. Current Support Classification

Primary result: **GS4 — Flat Goal Domain with Indirect Analogues**.

| Area | Classification | Basis |
|---|---|---|
| Milestones | GS5-equivalent | No independent milestone semantics |
| Goal Dependencies | GS5-equivalent | No Goal relationship/eligibility semantics |
| Progress Roll-Up | GS5-equivalent | Strictly one-Goal query/projection |
| Demand Roll-Up / Attribution | GS5-equivalent | No executable model; accepted spec omits structure |
| Priority Inheritance | GS5-equivalent | Neither executable nor normatively defined |
| Historical Structure Provenance | GS3-equivalent | Frozen Goal snapshots reusable, no edges |

GS5 is not the primary result because identity, lifecycle, incarnation-safe service links, measurements, and frozen immediate provenance are meaningful decomposition-adjacent primitives.

## 36. Current-vs-Needed Matrix

| Concern | Current Behavior | Evidence | Classification | Needed Before Proposal? | Risk if Deferred |
|---|---|---|---|---|---|
| Parent/Child Goals | Independent flat Goals | `goal.ts:22-36` | Not Found | Yes, for accounting | Ambiguous inputs |
| Milestones | Target/observation analogues | `manualQuantityProgress.ts:20-45` | Partial analogue | Only if eligibility/Demand-affecting | Goal inflation |
| Dependencies | None | exact Goal fields | Not Found | Yes if actionable gating | Invalid proposals |
| Progress Roll-Up | Per Goal only | `goalProgressQuery.ts:54-74` | Not Found | Boundary required; algorithm can follow | False completion |
| Demand Accounting | One Demand→one Goal spec | GDA spec §§5,15 | Missing structural rule | Yes | Double demand |
| Goal Priority | Separate authority specified | GDA spec §§18-19 | No inheritance | Yes | Manufactured priority |
| Lifecycle Propagation | One Goal only | `goalSurface.ts:169-187` | Not Found | Rule required | Orphan/stale Demand |
| Historical Provenance | Immediate Goal frozen | `historicalPlan.ts:53-60` | Partial | Yes for decision inputs | Rewritten history |
| Summary | Flat per-Goal activity | `goalActivity.ts:156-208` | Flat | Consumer rules can follow | Duplicate totals |
| Execution/Logging | Occurrence then frozen Goals | `goalActivity.ts:209-280` | Partial | Provenance boundary required | Lost ancestry |
| Found-Time Goal Selection | Not implemented | repository search | Not Found | Normalized inputs required | Authority bypass |

## 37. Primitive-Reuse Matrix

| Future Concern | Existing Primitive | Evidence | Reuse Classification | Required Adaptation | Risk |
|---|---|---|---|---|---|
| Goal identity | UUID `GoalId` | `goal.ts:42-60` | Directly Reusable | Relationship references | ID alone lacks edge lifetime |
| Goal revision | integer revision | `goalSurface.ts:158-167` | Reusable with Adaptation | Preserve revision history/effective edge binding | Active state overwrites revision |
| Goal lifecycle | status/timestamps | `goal.ts:7,29-32` | Reusable with Adaptation | Structural propagation policy | Silent cascade |
| Goal links | Commitment link array | `goal.ts:16-20,35` | Conceptually Related but Wrong Abstraction | New typed structural authority | Activity ≠ outcome |
| Commitment links | incarnation-safe source refs | `goal.ts:16-20` | Reusable with Adaptation | Explicit service/Demand attribution | Overclaims satisfaction |
| Source incarnation | `SourceIncarnationId` | `goal.ts:2,19` | Reusable with Adaptation | Goal/edge lifetime policy | Retargeting |
| Measurements | revisioned per-Goal definitions | `measurementDefinition.ts:14,172-180` | Reusable with Adaptation | Explicit aggregation policy | Unit mismatch |
| Progress | per-Goal deterministic projection | `manualQuantityProgress.ts:131-255` | Reusable with Adaptation | Structure-aware input/policy layer | Double count |
| Target date | optional Goal field | `goal.ts:33` | Directly Reusable | No implicit inheritance | Deadline leakage |
| Goal Priority architecture | separate authored authority | GDA spec §§18-19 | Reusable with Adaptation | Structural scope/inheritance decision | Amplification |
| Goal Demand architecture | independent Demand/projection | GDA spec §§5-17 | Reusable with Adaptation | Cross-Goal accounting | Capacity overclaim |
| PlanDecision | explicit accepted provenance | `planDecision.ts:27-60` | Reusable with Adaptation | Structural proposal/acceptance types | Occurrence semantics too narrow |
| Historical Goal provenance | frozen snapshots | `historicalPlan.ts:53-67` | Reusable with Adaptation | Freeze edges/ancestry that mattered | History rewritten |
| Execution history | durable occurrence outcome | `goalActivity.ts:209-280` | Directly Reusable | Attach/deduplicate structural context via publication | Duplicate records |
| Summary | per-Goal Goal Activity | `goalActivity.ts:156-208` | Reusable with Adaptation | Graph-aware attribution/deduplication | Double totals |

## 38. Double-Counting Matrix

| Scenario | Could Current System Double Count? | Why | Existing Protection | Missing Protection |
|---|---:|---|---|---|
| Parent + Child Demand | Yes, future inputs | Relationship/containment unknown | Allocation cannot reuse one Capacity portion | Demand inclusion/attribution |
| Child + Linked Commitment | Yes, future satisfaction | Link is association only | GDA spec requires explicit attribution | Executable versioned attribution |
| Parent + Child Progress | No current roll-up; yes if naively added | Same evidence could feed two projections | Per-Goal binding today | Contribution/deduplication policy |
| Parent + Child Scheduled Effort | Yes in aggregate presentation | Both may attribute same occurrence | Durable occurrence identity | Structural attribution semantics |
| Parent + Child Execution | Yes in Summary, not record storage | One record can appear in two Goal views | One durable execution target | Cross-Goal deduplication |
| Multi-Parent Child Goal | Yes across Demand/Progress/activity | Shared child reached by multiple ancestors | Stable immediate Goal/occurrence IDs | Graph traversal and once-only accounting |

Demand overstatement, Capacity double claiming, Progress duplication, Summary duplication, and historical attribution duplication are separate failure modes. Existing Allocation protects only Capacity assignment within its evaluated set.

## 39. Boundary Matrix

| Concept | Outcome Identity? | Own Lifecycle? | Own Progress? | May Own Demand? | Owns Time? | May Depend on Goal? | May Contribute to Goal? |
|---|---:|---:|---:|---:|---:|---:|---:|
| Goal | Yes | Yes | Yes | Via separate Demand | No | Requires Specification | Requires Specification |
| Subgoal | Yes | Yes | Yes | Requires Specification | No | Requires Specification | Yes, semantics required |
| Milestone | Checkpoint, not necessarily outcome | Requires Specification | Requires Specification | Not automatically | No | Requires Specification | Yes |
| Commitment | No | Yes | No | No; may satisfy with attribution | Yes | No Goal dependency currently | Yes via link |
| Activity | No | Historical occurrence/execution lifecycle | No | No | Represents performed/placed time | Scheduling only | Yes |
| Goal Demand | No | Yes, specified | No | It is Demand | No | Eligibility may depend on structure | Serves exactly one Goal currently |
| Scheduled Goal Work | No | Yes, specified | No | Realizes accepted allocation | Yes | Requires Specification | Yes |
| Progress Observation | No | Revision lineage | It is evidence | No | No | No | Binds one Goal |

## 40. Worked Scenarios

### Scenario A — Simple Parent / Child

“Earn Network+ → Complete Course” can be stored only as two unrelated Goals or one Goal plus a Commitment. Relationship support is **Not Found**.

### Scenario B — Multiple Children

Three independent Goals can exist, but requiredness and aggregate completion are unknown. Parent completes only by explicit command; child completion has no effect.

### Scenario C — Milestone

“80% on three practice exams” may be approximated as a manual measurement target only if reduced to the supported quantity policy. It has no named checkpoint identity or “three observations satisfy milestone” semantics. Making it a Goal changes priority/Demand meaning.

### Scenario D — Dependency

Course-before-practice-exams cannot be represented between Goals. Placement order of Commitments is the wrong abstraction.

### Scenario E — Parent and Child Demand

DayFrame cannot know whether five plus two means five total or seven. Structural Demand accounting must precede Allocation.

### Scenario F — Child with Existing Commitment

The link can identify that the Commitment serves the Goal. Correct one-hour satisfaction requires explicit Demand-specific, versioned attribution under the GDA specification; the current link alone cannot account it.

### Scenario G — Priority

The parent’s High priority implies nothing for children today. Inheritance and override are unresolved and must not be inferred.

### Scenario H — Child Completed

Only the child’s status/timestamp/revision changes. Parent lifecycle, Progress, Demand, and priority are unaffected.

### Scenario I — All Children Completed

No automatic parent completion occurs; the system does not know a child set exists.

### Scenario J — Multi-Parent Outcome

Independent flat Goals cannot express either contribution. The case demonstrates why a pure single-parent tree may be insufficient and why shared evidence/Demand needs once-only accounting.

### Scenario K — Historical Restructure

Current history retains immediate Goal snapshots on occurrences, not old parentage. Moving a future child without versioned structural provenance would lose or rewrite old interpretation.

### Scenario L — Found Time

A future 45-minute proposal needs normalized eligible Demand after overlap, dependency, and priority resolution. Proposal can consume that result; it must not guess parent/child meaning.

## 41. Candidate Invariant Assessment

| Invariant | Existing Architecture | Current Implementation | Future Status |
|---|---|---|---|
| GS-CAND-INV-01 hierarchy does not make Goal own time | Required | Supported vacuously; Goals never own time | Required |
| GS-CAND-INV-02 Subgoal is not Commitment | Required | Not Applicable Yet; types separate | Requires Specification |
| GS-CAND-INV-03 Milestone does not create Demand | Required | Not Applicable Yet | Requires Specification |
| GS-CAND-INV-04 parent/child Demand does not double claim | Required | Not Applicable Yet; structural input absent | Requires Specification |
| GS-CAND-INV-05 parent/child Progress does not double count | Required | Supported only by no roll-up | Requires Specification |
| GS-CAND-INV-06 no silent priority propagation | Required | Supported vacuously | Requires Specification |
| GS-CAND-INV-07 no silent completion cascade | Required | Supported; mutations affect one Goal | Requires Specification |
| GS-CAND-INV-08 containment does not imply prerequisite | Required | Not Applicable Yet | Requires Specification |
| GS-CAND-INV-09 display order does not imply priority/dependency | Required | Supported; canonical ID order has no semantics | Requires Specification |
| GS-CAND-INV-10 relationship stable identity/provenance | Required by history/determinism | Not Applicable Yet | Requires Specification |
| GS-CAND-INV-11 suggested decomposition not silent authority | Required | No generation exists | Requires Specification |
| GS-CAND-INV-12 structure cannot bypass Demand/Capacity | Required | Not Applicable Yet | Requires Specification |
| GS-CAND-INV-13 later edits do not rewrite relevant history | Required | Unsupported for absent structural provenance | Requires Specification |
| GS-CAND-INV-14 shared Subgoal not duplicated | Required | Not Applicable Yet | Requires Specification |

No candidate is presently violated by an implemented Goal-structure feature because none exists. GS-CAND-INV-13 exposes a current capability gap, not corruption of existing structural history.

## 42. Architectural Risks

1. **Generic tree:** excludes shared contribution and cross-tree dependency.
2. **Every child gets Demand:** manufactures seven hours from an intended five.
3. **Parent equals sum(children):** invents aggregation authority and loses independent parent work.
4. **Automatic Progress roll-up:** mixes units, weights, evidence, and requiredness.
5. **Milestone as Goal:** makes a checkpoint independently prioritized/resource-seeking.
6. **Goal as task:** blurs outcome with time-owning activity.
7. **Linked Commitment as Subgoal:** turns service association into outcome containment.
8. **Hierarchy as order:** conflates containment with prerequisite/scheduling.
9. **Priority inheritance:** silently manufactures child or multi-parent priority.
10. **Completion cascade:** closes outcomes without explicit required-edge semantics.
11. **Lost historical structure:** later edits rewrite decision interpretation.
12. **Shared-child duplication:** repeats Demand, Progress, execution, and Summary attribution.
13. **Commitment plus child Demand:** counts the same intended effort twice without satisfaction attribution.
14. **Proposal chooses child blindly:** acts on structurally ambiguous Demand.
15. **Found Time bypass:** turns ancestor importance or milestone state into unauthorized work.
16. **Overengineering:** importing project-management trees, task systems, and dependency scheduling before necessary semantics are decided.

Mitigation is a narrow outcome-structure architecture focused on authority, typed relationships, accounting, lifecycle, and provenance—not a general project-management subsystem.

## 43. Test Coverage Assessment

Command executed from `code/`:

```text
npm test -- --run [15 focused existing test files]
```

Result: **15 test files passed; 87 tests passed; 0 failed**.

| Test files | Claims substantiated |
|---|---|
| `src/core/goals/goal.test.ts`, `src/state/goalSurface.test.ts` | Exact flat Goal schema, validation, identity, revision, lifecycle, links, durability |
| `src/core/measurement/measurementDefinition.test.ts`, `src/state/measurementDefinitionSurface.test.ts` | Per-Goal definition lineage and referential validation |
| `src/core/progress/manualQuantityProgress.test.ts`, `src/state/goalProgressQuery.test.ts` | Deterministic one-Goal Progress and evaluation cutoff |
| `src/core/progressObservation/progressObservation.test.ts`, `src/state/progressObservationSurface.test.ts`, `src/state/goalProgressObservationHistoryQuery.test.ts` | Observation identity/revision/binding/history |
| `src/core/historicalPlan/materializePlanPublication.test.ts` | Frozen immediate Goal provenance through Commitment links |
| `src/core/historicalIntelligence/goalActivity.test.ts` | Flat per-Goal planning/execution attribution and coverage |
| `src/state/executionHistorySurface.test.ts` | Durable execution history boundary |
| `src/state/dayFrameBackupV6.test.ts`, `src/state/dayFrameRestoreComposition.test.ts` | Backup validation and atomic restore composition |
| `src/core/decisions/planDecision.test.ts` | Explicit accepted occurrence-decision provenance |

No test covers Goal-to-Goal relationships, parent/child, Subgoals, Milestones, Goal dependencies, Progress roll-up, Demand roll-up, priority inheritance, lifecycle propagation, or historical structural provenance. Absence of tests is supporting absence evidence only alongside production-code tracing; it is not treated alone as proof.

## 44. Current Executable Truth

DayFrame supports flat, independent, user-authored Goals with UUID identity, optimistic revision, explicit lifecycle, optional target date, per-Goal measurement/observation Progress, and incarnation-safe many-to-many associations with Commitment-like sources. Published occurrences freeze immediate linked Goal snapshots; execution remains occurrence-based; Goal Activity projects each Goal independently. Goal creation owns no time, measurement attainment does not complete a Goal, and no Goal mutation affects another Goal.

## 45. Missing Structured-Goal Semantics

Missing are typed Goal-to-Goal edges, edge identity/lifecycle/revision, parent/child requiredness, contribution, milestones, Goal dependencies, display/semantic ordering, cycle policy, lifecycle propagation, Progress aggregation, Demand inclusion/attribution, priority inheritance/override, shared-child deduplication, structural acceptance, and decision-time structural provenance.

Reusable primitives are Goal identity/lifecycle, exact validation/versioning, source incarnation, per-Goal measurements, deterministic Progress, occurrence identity, frozen Goal snapshots, backup/restore participants, and accepted-decision provenance. Wrong abstractions are Commitment links as Subgoals, observations as Milestones, scheduler constraints as Goal dependencies, and PlanDecision occurrence priority as Goal Priority.

## 46. Goal Demand / Allocation Impact

Goal Structure changes whether a Demand is independent, nested, derived, or mixed; which Demand is eligible; and which claims compete. Existing Commitment satisfaction attribution addresses Commitment-versus-Demand overlap only when explicit—it does not relate parent and child Demand. Allocation’s exact Capacity accounting remains reusable, but it cannot repair structurally duplicated or incorrectly prioritized Demand inputs. Goal Priority needs explicit structural scope without automatic inheritance.

## 47. Progress / History Impact

Progress remains valid as independent Goal evidence. Structure requires a separate explicit aggregation/contribution policy if any roll-up is desired; it must not mutate observations or average children automatically. History must preserve stable relationship identity and the effective structure/attribution that influenced Demand, Proposal, acceptance, Progress interpretation, or Summary. Current frozen Goal provenance is a strong host pattern but lacks edges and ancestry.

## 48. Proposal / Found-Time Impact

Constructive Proposal should preferably consume normalized, eligible, non-duplicative Demand and therefore can remain mostly structure-agnostic. It still needs explainable provenance identifying the immediate Goal and any structural facts that caused eligibility, exclusion, or priority. Found-Time uses the same boundary. Neither may infer child work from parent existence or bypass Demand/user authority.

## 49. Open Questions

- Which typed relationship kinds are minimal: containment, contribution, dependency, milestone membership?
- Is containment single-parent while contribution is graph-shaped, or is containment itself multi-parent?
- What relationship authority, identity, revision, effective time, and retirement model applies?
- How are required/optional children and completion semantics expressed?
- Which relationships affect Demand eligibility versus merely presentation?
- How are independent, nested, derived, and mixed Demand declared and normalized?
- How do explicit existing-Commitment satisfaction attributions compose with child Demand?
- What are priority scope, override, and multi-parent conflict semantics?
- What Progress contribution models are allowed across units/policies?
- What exact decision-time relationship snapshot must historical records preserve?
- Which structural suggestions require what acceptance record?
- Which structural concerns can remain UI-only without entering planning semantics?

## 50. Audit Conclusions

1. **Is the current Goal domain flat?** Yes—**Confirmed**.
2. **Meaningful decomposition support?** No; only indirect analogues—**GS4**.
3. **Existing mechanism sufficient for Subgoals?** No. Independent Goals lack a typed relation.
4. **Sufficient for Milestones?** No. Measurements are partial analogues, not checkpoints.
5. **Sufficient for Goal dependencies?** No—**Not Found**.
6. **Can structured Goals be simulated?** Visually/manually with titles, separate Goals, or linked Commitments only.
7. **What is lost?** Relationship identity, requiredness, contribution, dependency, propagation, accounting, roll-up, inheritance, and historical structure.
8. **Does GDA solve parent/child Demand accounting?** No; it correctly treats supplied Demands independently and lacks structural attribution.
9. **Does Goal Priority solve inheritance?** No; it deliberately separates authority but defines no structural inheritance.
10. **Does Progress solve roll-up?** No; it projects one Goal only.
11. **Does history preserve structure?** No; it preserves immediate linked Goal snapshots only.
12. **Would `parentGoalId` suffice?** No; it lacks edge semantics, identity, revision, graph contribution, Demand/Progress rules, and provenance.
13. **Is a tree sufficient?** Not generally; shared outcomes and dependencies require graph-aware treatment.
14. **Does Goal Structure need graph semantics?** At least contribution/dependency must be graph-capable; exact containment topology requires specification.
15. **Must it be specified before constructive Proposal?** Yes, because it changes Demand/Allocation inputs (**Case C**); Proposal may later consume normalized inputs (**limited Case B**).
16. **Smallest required surface?** Authored typed relationship authority plus lifecycle, dependency eligibility, Demand accounting, priority scope, Progress boundary, cycle/deduplication rules, and historical provenance.
17. **What may remain downstream?** Final UI/tree controls, suggestion UX, visualization, optional advanced roll-up algorithms, and Proposal presentation details.
18. **Next task?** Path A — Goal Structure Architecture Specification.

## 51. Recommended Next Step

**Path A — Goal Structure Architecture Specification.**

The audit establishes semantic uncertainty, not merely missing UI. Structure determines whether Demand is independent or nested, whether dependency gates eligibility, how priority applies, how Progress may contribute, and which relationship context history must freeze. Those choices affect the correctness of inputs to Allocation and Proposal. A focused specification should establish only the minimum relationship, authority, accounting, lifecycle, determinism, and provenance boundaries. It should not implement the model, begin constructive Proposal, or establish a future implementation phase.

## 52. Completion Statement

> **Goal Structure / Decomposition Architecture Audit complete.**
>
> The audit establishes the current executable truth of DayFrame's Goal domain; determines whether parent/child Goals, Subgoals, Milestones, dependencies, Progress roll-up, Demand accounting, Goal Priority inheritance, lifecycle propagation, historical structural provenance, and structured Goal execution/logging are represented or absent; evaluates the risks of double counting, hierarchy assumptions, and semantic leakage across Goal, Commitment, Goal Demand, Progress, Allocation, Proposal, and Found Time; identifies reusable primitives and wrong abstractions; determines whether structured Goals must be architecturally specified before constructive Proposal work can proceed; and recommends the next architectural step without modifying implementation or assigning the work to a future implementation phase.
