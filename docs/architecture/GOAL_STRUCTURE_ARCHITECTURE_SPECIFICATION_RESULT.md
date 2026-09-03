# Goal Structure Architecture Specification

## 1. Executive Specification

Goal Structure is a separate, authored, versioned relationship authority over Goals and Milestones. It preserves one Goal type while expressing containment, contribution, and dependency through independently identified relationships. Containment is a single-parent acyclic forest; contribution and dependency are directed graphs. Structure never creates time ownership, Demand, Priority, Progress, or completion by implication.

Structural Eligibility is derived before Demand Projection. Eligible Demand Projections are then normalized through explicit Demand Accounting authority before Feasibility and Allocation. Progress stays per-Goal; structural interpretation occurs only under explicit compatible contribution policies. Decisive relationship revisions are frozen in history. Proposal consumes resolved inputs and does not traverse structure to invent semantics.

## 2. Architectural Context

This specification follows the GS4 audit in `docs/audits/GOAL_STRUCTURE_DECOMPOSITION_ARCHITECTURE_AUDIT_RESULT.md` and composes with:

```text
Commitments + Constraints → Capacity
Goal Structure + Goal Demand → Structural Eligibility → Demand Projection
→ Demand Normalization → Feasibility → Competing Demand → Allocation
→ Proposal → User Decision → Accepted Allocation → Scheduled Goal Work
→ Execution → Progress → Summary
```

Flat Goals remain valid. Existing Commitment links remain service associations. Capacity stays demand-neutral; Allocation provisional; Proposal constructive; user acceptance precedes time ownership.

## 3. Epistemic Model

| Fact | Category |
|---|---|
| Goal, relationship, Milestone, Goal Priority, Demand Intent, Demand Accounting policy | Authored authority |
| eligibility, blocking, projection, normalization, Progress interpretation, Capacity, Feasibility, Allocation | Derived |
| decomposition suggestion, placement recommendation | Proposed |
| accepted relationship/proposal | Accepted decision |
| Scheduled Goal Work | Scheduled reality |
| execution/observation | Historical evidence |
| patterns inferred from history | Learned tendency |
| promoted reusable rule | Separate authored preference |

No item may cross categories without an explicit transition and provenance.

## 4. Goal Structure Definition

> **Goal Structure is the authored, versioned authority describing typed, identity-bearing relationships among desired outcomes and their explicit checkpoints, together with only the relationship semantics required to derive structural eligibility, Demand accounting, Progress interpretation, and historical explanation.**

It is not a task, Commitment, recurrence, scheduling dependency, activity sequence, checklist, work-breakdown system, Demand, Priority, Progress, Proposal, or display grouping.

## 5. Goal Structure Responsibility Boundary

Goal Structure owns relationship identity, type, endpoints, revision/lifecycle, containment requiredness, dependency condition reference, contribution policy references, applicability, canonicalization, validation, and historical resolvability. Milestone authority owns checkpoint identity/state/evaluation policy. Demand Accounting owns quantitative inclusion. Goal Priority owns priority scope. Progress policies own quantitative contribution. Presentation owns display order. Scheduling owns activity order.

## 6. Goal / Structural Identity

A Goal retains opaque identity and revision. Each relationship has an opaque never-reused ID, monotonic revision, `createdAt`, `updatedAt`, effective interval, and active/retired state. Relationship revision changes when semantics/endpoints change; material replacement supersedes rather than mutates historical meaning. History references exact relationship revision.

## 7. Goal Lifetime

Current Goal UUID identity is sufficient: archive, complete, and reactivate are states in one Goal lifetime. Similar titles never imply identity. No new Goal incarnation is required now. Permanent removal/import collisions must be rejected or mapped explicitly; references never retarget by title. Relationship lifetime supplies the missing structural provenance.

## 8. Structural Relationship Taxonomy

First-class authored relationships are:

- **contains:** broader Goal contains one subordinate Goal, with required/optional semantics.
- **contributesTo:** one Goal contributes to another without containment.
- **dependsOn:** one Goal’s structural eligibility depends on an explicit Goal or Milestone condition.
- **milestoneOf:** derived inverse of a Milestone’s owning Goal; not a separate edge record.

`parentOf`, `childOf`, `blocks`, and inverse contribution/dependency views are derived.

## 9. Parent Goal

A Parent Goal is an ordinary Goal serving as the broader endpoint of an active `contains` relationship. Parenthood is contextual, not a subtype. It implies none of Priority inheritance, Demand aggregation, Progress aggregation, completion cascade, dependency, or scheduling authority.

## 10. Subgoal

A Subgoal is an ordinary Goal serving as the subordinate endpoint of `contains`. It retains independent identity, lifecycle, target date, measurement policy, Progress, Priority, Demand, Commitment links, and relationships. Subordination adds only explicit containment semantics and requiredness; it does not make the Goal an activity or Commitment.

## 11. Goal vs Subgoal Type Model

**Model B — One Goal Type + Typed Structural Relationships** is normative. Identity, lifecycle, persistence, and querying remain uniform; structure can change without recreating the Goal; history freezes relationship revision. UI may label roles contextually. This avoids subtype migration and allows a Goal to be a parent in one relation and child in another.

## 12. Milestone

A Milestone is an independently identified, revisioned checkpoint authority owned by exactly one Goal. It has active/satisfied/retired state, timestamps, optional target/evaluation policy, and explicit manual-or-evidence satisfaction policy. It owns no Demand, Priority, Progress stream, or time. It may be a dependency condition and may affect Goal interpretation only through explicit policy.

## 13. Milestone vs Subgoal

Use a Subgoal when the item is an independently meaningful desired outcome capable of its own Demand, Priority, Progress, and lifecycle. Use a Milestone when it is a checkpoint in evaluating another Goal and should not independently compete for Capacity. Checkpoint complexity does not convert it into a Goal.

## 14. Milestone vs Measurement

Observation is evidence; measurement definition interprets evidence; Milestone is checkpoint authority. A Milestone may reference an explicit versioned evaluation policy over compatible definitions/observations. Target attainment changes Milestone state automatically only when that authored policy says so; otherwise satisfaction is explicit. A measurement threshold is not a Milestone by itself.

## 15. Goal Dependency

`dependsOn` is directed from dependent Goal to prerequisite Goal/Milestone condition. A **hard prerequisite** excludes dependent Demand while unsatisfied; an **advisory dependency** preserves eligibility but adds explanation. Satisfaction conditions are explicit: Goal completed, Milestone satisfied, compatible Progress threshold, or recorded user override. Unknown evidence yields unknown eligibility, never assumed satisfaction.

## 16. Dependency vs Scheduling Dependency

Outcome dependency governs whether outcome Demand may participate in planning. Scheduling dependency orders time-owning activities. Goal Structure owns only the former and cannot express before/after placement between Commitments or occurrences.

## 17. Derived Blocking / Structural Eligibility

Structural Eligibility is a versioned deterministic read model: `eligible`, `ineligible`, `conditionallyEligible`, or `unknown`, with decisive relationship/condition provenance. `blocked` is a presentation of `ineligible` due to a hard prerequisite, not persisted authority and not the scheduler’s blocked state. Eligibility creates no Demand, ranking, allocation, or schedule.

## 18. Containment vs Contribution

Containment says an outcome is structurally part of one broader outcome. Contribution says an outcome advances another but remains outside its containment. Contribution may target multiple Goals. Containment has at most one active parent per Goal; sharing is modeled by contributions, avoiding ambiguous ownership while retaining graph semantics.

## 19. Tree vs Graph Model

**Model C — Hybrid** is normative. Containment forms a single-parent acyclic forest. Contribution and dependency are graph-capable. This is the smallest topology that provides stable decomposition navigation while supporting shared outcomes and cross-branch prerequisites.

## 20. Cycle Semantics

Containment and hard/advisory dependency cycles are invalid. Self-edges are invalid. Contribution cycles are permitted only as non-aggregating associations; any contribution policy used for Demand, completion, or numeric Progress must form an acyclic evaluated subgraph. Validation and traversal must report deterministic cycle paths.

## 21. Required / Optional Children

Every `contains` relationship explicitly declares `required` or `optional`. Requiredness can inform completion eligibility under policy; optional children cannot block it. Neither mode automatically affects Demand, Progress, or lifecycle.

## 22. Goal Completion

Default and V1 normative semantics are **Derived Completion Eligibility**: configured required children/Milestones may make a parent `completionEligible`, but Goal completion remains explicit authored lifecycle authority. No automatic completion policy is admitted in this version.

## 23. Child Completion

Completing a Subgoal updates only that Goal. It may satisfy dependency conditions and recompute parent completion eligibility, Demand eligibility, and derived interpretation. It does not mutate parent Progress/Demand/lifecycle, siblings, or Milestones absent separate explicit policies.

## 24. Parent Completion

Completing a parent does not complete, archive, or delete children. Parent-owned Demand becomes structurally ineligible by lifecycle; child Demand remains governed by each child and its dependencies. Relationship history persists. UI may surface active children for explicit review.

## 25. Archival / Reactivation

Archiving a Goal makes its own Demand ineligible; it does not cascade lifecycle. A contained child of an archived parent remains independently active, while parent-context aggregate views are inactive. An archived prerequisite produces `unknown`/policy-declared ineligibility, never satisfaction by disappearance. Retired Milestones cannot newly satisfy dependencies. Reactivation recomputes current derivations without changing history.

## 26. Goal Demand Structural Boundary

Each Goal Demand still belongs to exactly one Goal. Structure may qualify eligibility and supply explicit accounting relationships, but parent existence creates no Demand and aggregate parent summaries are not Demand. Demand identity/lifecycle stays in the Goal Demand domain.

## 27. Parent / Child Demand Model

**Model D — Explicit Demand Relationship Semantics** is normative. Demands are additive by default. Explicit Demand Accounting authority may mark a child projection `includedIn` a parent total, declare a parent projection `derivedFrom` children, or preserve `independent`. Mixed models combine bounded explicit relationships. Structure alone never chooses a mode.

## 28. Demand Contribution / Attribution

Demand Accounting is separate authored authority referencing exact Demand identities/revisions and a structural context. Each record has opaque ID/revision/lifecycle, direction, mode (`includedIn` or `derivedFrom`), bounded quantity/share rule, horizon applicability, policy version, and provenance. It prevents double counting after Projection; it is not a Goal relationship and not Commitment satisfaction attribution.

## 29. Existing Commitment Satisfaction Composition

First normalize structural Demand, then apply explicit Commitment satisfaction exactly once to the normalized ownership ledger. Satisfaction credited to an included child reduces the child’s included portion and therefore the parent remaining total; it is not separately subtracted again from the parent. A Goal link alone grants no credit.

## 30. Demand Normalization

Boundary:

```text
Structure → Eligibility
Eligible Demand Intent → Demand Projection
Projections + Demand Accounting + Commitment satisfaction
→ normalized, non-duplicative Demand
→ Feasibility / Competing Demand / Allocation
```

Normalization occurs **after Projection and before Feasibility/Competing Demand**, because quantitative accounting is horizon-specific. Original Demand and Projection identities remain intact.

## 31. Demand Normalization Output

Each output preserves source Demand ID/revision, Projection ID, Goal ID, horizon, requested amount, additive amount, included/derived amount, credited work, remaining competing amount, eligibility/exclusion reason, decisive relationship and accounting revisions, normalization-policy version, dependency fingerprint, structural fingerprint, and explanation. Zero competing amount is retained as provenance, not silently discarded.

## 32. Demand Conservation

For a horizon, normalized additive Demand equals explicitly independent projected amounts plus uncovered parent totals, minus each authorized satisfaction credit once. Included children do not add to their parent ceiling; independent children do. Derived parents are summaries, not additional claims. Accounting cannot yield negative remaining Demand or exceed source authority.

## 33. Shared Subgoal Demand

A shared/contributing Goal’s Demand exists once by Demand identity. It may provide explanatory credit to multiple parent views, but graph reachability never duplicates it. Partition or duplication requires separate explicit Demand authority/accounting records. Summary and Allocation deduplicate by normalized Demand identity.

## 34. Goal Priority Structural Boundary

Goal Priority remains authored authority separate from structure, Commitment priority, urgency, and policy. Structure may define the scope to which an explicit Priority rule applies, but cannot manufacture priority through ancestry.

## 35. Priority Model

**Model C + D bounded combination:** every Goal may own explicit Priority; a parent Priority affects descendants only through separately authored scoped-propagation authority. Without it, parent Priority is contextual/advisory only. Explicit child Priority takes precedence within its scope. Derived urgency and learned preference remain non-authoritative signals.

## 36. Priority Conflict

A shared child’s own explicit Priority governs its Demand. Conflicting propagated parent scopes must be rejected as ambiguous or resolved by explicit authored precedence; never average, sum, or maximize. With no child/valid propagated Priority, Allocation applies its declared unprioritized policy and explains parent context without converting it into authority.

## 37. Progress Structural Boundary

Underlying Progress remains per-Goal and observation-bound. Structure may derive parent interpretation without mutating observations, definitions, child Progress, or Goal lifecycle. Scheduled/executed effort remains activity evidence, not Progress.

## 38. Progress Roll-Up / Contribution

**Model E — Mixed under explicit policies** is normative: default no roll-up; required-child completion may inform completion eligibility; numeric contribution requires an explicit versioned contribution policy; qualitative contribution may be displayed separately. Universal averaging is forbidden.

## 39. Measurement Compatibility

Numeric contribution requires an explicit parent measurement/contribution policy defining compatible units, transformation, weights, missing/unknown treatment, and cutoff. Incompatible units produce `notApplicable`/`unknown`, not coercion. Dollars, count, weight, time, binary state, and percentages never aggregate merely because values are numeric.

## 40. Milestone Contribution

Milestone satisfaction may gate dependency or completion eligibility and may appear in Summary. It changes numeric parent Progress only through explicit contribution policy. It never equals Goal completion, creates Demand, or converts execution into Progress.

## 41. Structural Progress Provenance

Derived structural Progress records contributing Goal/Milestone IDs and revisions, relationship IDs/revisions, definitions, observations, cutoff, transformations, and policy version. Historical evaluation binds those inputs or an immutable fingerprint/resolvable revision set; current structure cannot reinterpret old results.

## 42. Ordering Semantics

Containment, display order, Priority order, dependency order, and scheduling order are distinct. Goal Structure may own optional authored sibling display rank as presentation metadata excluded from semantic fingerprints. UUID, storage/insertion order, dependency traversal, and Commitment priority never imply display order.

## 43. Suggested Decomposition

Engine output is a proposed structure bundle with provenance, never authority. Acceptance explicitly creates selected new Goals, Milestones, and relationships as authored records; rejection creates none; modification records accepted deltas. The suggestion algorithm is outside scope.

## 44. Direct User Authoring

Users may directly create Goals, Milestones, and relationships. Directly authored and accepted-proposed records have equal authority after validation; provenance distinguishes origin. Neither path requires the other.

## 45. Structural Modification / Removal

Material edits create a new relationship revision or retire/supersede the old relationship. Moving a child is atomic retirement plus new containment, validated as one authority transition. Removing a historically relevant edge retires it; hard deletion is allowed only before any durable dependency/history and must be provably irrelevant. Changes stale dependent derivations, never past records.

## 46. Historical Goal Structure

History freezes only decisive relationships and policies that materially influenced eligibility, normalization, Priority interpretation, Progress, Allocation, Proposal, acceptance, or occurrence attribution. It preserves IDs/revisions, endpoint Goal revisions where relevant, type/requiredness, accounting/contribution policy refs, and structural fingerprint. Entire graph snapshots are unnecessary.

## 47. Historical Restructuring

If `A contains B` later becomes `C contains B`, current views use the latter; decisions made under the former resolve its retired revision. Historical and current-structure views must label their basis. Restructuring cannot recalculate old authority as though C had always contained B.

## 48. Execution / Logging

One execution record remains bound to one durable occurrence. Publication preserves immediate Goal served plus decisive structure/accounting fingerprint or references used at acceptance. Ancestor contribution is derived/deduplicated; no execution clone is created per ancestor. Progress effects use separate policies/evidence.

## 49. Summary

Summary distinguishes direct facts, contributed facts, aggregate parent views, and unique system totals. Aggregate views deduplicate Demand, Capacity, accepted allocations, occurrences, execution records, and Progress evidence by authoritative identity. Current-structure and historical-structure interpretations are labeled.

## 50. Goal Activity

Existing Goal Activity remains direct/immediate by default. A future aggregate scope must be explicit (`direct`, `contained`, `contributed`, or declared combination), traverse a stated structure basis/cutoff, deduplicate durable occurrence/execution identity, and expose relationship provenance. Default semantics do not silently change.

## 51. Allocation Boundary

Allocation consumes normalized Demand IDs/amounts, Goal IDs, effective Goal Priority, eligibility confirmation, and explanation provenance. It does not traverse Goal Structure. Structural fingerprints remain visible for determinism, staleness, and explanation.

## 52. Proposal Boundary

Proposal consumes Allocation plus structural provenance sufficient to explain eligibility/accounting. It cannot create structure, infer nested Demand, inherit Priority, bypass dependencies, or duplicate shared Demand. Any decomposition recommendation is a separate proposed-structure artifact.

## 53. Found Time / Live Opportunity Boundary

Found-Time planning asks which normalized eligible unmet Demand can use new Capacity. It uses the same eligibility, normalization, Priority, and Proposal contracts; it cannot select by parent existence, infer inheritance, bypass prerequisites, duplicate paths, or create structure.

## 54. Commitment Composition Boundary

Goal Structure models outcomes; Commitment Composition models attached time-owning activities such as commute/workout/shower. `contains` cannot target Commitments. Goal Commitment links remain service associations. The two domains may share provenance patterns but not semantics.

## 55. Goal vs Activity Decision Rule

An entity may be Goal/Subgoal when it describes a state of the user/world independently evaluable beyond any particular occurrence. Work performed at a time is Commitment, Scheduled Goal Work, or Execution. Recurrence, duration, or an action verb does not make an activity an outcome.

## 56. Milestone vs Activity Decision Rule

A Milestone denotes the durable state “checkpoint achieved”; an activity denotes the attempt/work producing evidence. “Take practice exam” is activity; “first practice exam completed under declared evidence” is Milestone. Classification follows authority and evaluation semantics, not wording.

## 57. Determinism

Equivalent Goals, relationships, Milestones, policies, Demand/Progress evidence, horizon, and cutoff must yield equivalent canonical graph, validation, traversal, eligibility, normalization, fingerprints, Progress interpretation, and aggregates. Runtime insertion, UI order, enumeration, and random traversal have no semantic effect.

## 58. Structural Fingerprint

A structural fingerprint is required for derived state. It includes relevant Goal IDs/revisions/lifecycle, active relationship IDs/revisions/types/requiredness, Milestone conditions/state revisions, accounting/contribution/priority-scope policy refs, evaluation cutoff/horizon when material, and algorithm version. Presentation metadata is excluded.

## 59. Staleness

Goal lifecycle/revision, relationship revision, dependency/Milestone satisfaction, Demand Accounting, Priority scope, Progress policy/evidence, target/measurement state, or structural-policy version stales every dependent layer. Eligibility changes stale normalization; normalization changes stale Feasibility/Allocation/Proposal. Stale means no longer current, not necessarily invalid; retained historical artifacts remain interpretable.

## 60. Persistence

Persist Goals, relationships, Milestones, dependency conditions, Demand Accounting authority, priority-scope authority, and Progress-contribution authority. Traversal, blocking, eligibility, normalization, aggregate Progress, and summaries are reproducible derived state unless frozen as decisive historical provenance.

## 61. Backup / Restore

Formats are versioned; restore validates IDs, exact revisions, endpoints, ownership, cycles, policy references, and no dangling current authority. Interdependent Goal/structure/Milestone/policy state installs atomically and canonicalizes deterministically. Migrations preserve legacy flat Goals and immutable history.

## 62. Import / Replacement

Import validates or explicitly maps Goal/relationship identities; endpoint absence rejects current authority rather than dangling it. Milestone ownership, dependencies, Demand refs, and policy refs install atomically. Current replacement does not alter historical snapshots. Conflicts require explicit resolution, not title matching.

## 63. Relationship Validation

Reject missing/self endpoints, duplicate semantic edges, containment multi-parent violations/cycles, dependency cycles, illegal endpoint types, retired targets for new authority, inconsistent effective intervals, invalid accounting links, ambiguous Priority propagation, and incompatible Progress contribution. Errors identify deterministic paths and records.

## 64. Relationship Identity / Canonicalization

Relationship identity is opaque and never derived from endpoints. Semantic equality compares type, endpoints, revision-effective semantics, and policy refs, not storage order. Sets canonicalize by relationship ID then revision; duplicate equivalent active edges are invalid. Display rank is separate metadata.

## 65. Graph Traversal

The structure service provides scoped ancestor, descendant, contributor, and dependency-closure traversal with cycle safety, identity deduplication, and deterministic ordering. Traversal returns paths/provenance but does not aggregate Demand/Progress or create authority without an explicit consumer policy.

## 66. Multi-Path Deduplication

Reaching the same Goal, Demand, occurrence, execution record, observation, or accepted allocation through multiple paths yields one fact keyed by authoritative identity. Paths remain as explanation metadata. Policy-authorized partitions are distinct only when they possess distinct identity and conservation accounting.

## 67. Explainability

Derived outputs expose decisive reasons: unmet prerequisite; included child quantity within parent total; shared Demand counted once; Priority source and non-inheritance; Milestone effect; excluded/unknown conditions; current versus historical structure. Explanation states authority IDs/revisions and policy versions without prescribing UI wording.

## 68. Structural Suggestions / Learning

Historical patterns may generate analytical suggestions for Goals, Subgoals, Milestones, dependencies, or grouping. They never create or modify Goal, relationship, Demand, Priority, or reusable rules. Only explicit user acceptance promotes selected content, preserving proposal and delta provenance.

## 69. Normative Worked Examples

### Example A — Simple Parent / Child

`Earn Network+ contains(required) Complete Course`. Both are ordinary Goals with independent lifecycle, Progress, Priority, and optional Demand. The edge alone aggregates none. History freezes the edge when decisive.

### Example B — Multiple Required Children

Three required containment edges make the parent completion-eligible when all three children complete under policy. Parent completion remains explicit. Children’s Demand/Progress stay independent absent policies.

### Example C — Optional Child

An optional supporting outcome may remain incomplete without blocking parent completion eligibility. It creates no Demand through containment.

### Example D — Milestone

“80% on three exams” is a Milestone owned by `Earn Network+`, with an explicit evaluation policy over three compatible observations. It is not a Goal or observation and owns no Demand.

### Example E — Dependency

`Complete Practice Exams dependsOn(hard, GoalCompleted) Complete Course`. Until completion, practice-exam Demand is ineligible. This does not order individual sessions.

### Example F — Independent Parent and Child Demand

Parent 5h and child 2h default independent: normalized competing Demand is 7h.

### Example G — Nested Demand

An `includedIn` accounting record declares child 2h inside parent 5h: normalized total is 5h, with 2h explained as child-directed.

### Example H — Nested Demand + Existing Commitment

Parent 5h includes child 2h; one explicitly attributed Commitment hour credits the child portion once. Child remaining is 1h and parent total remaining is 4h, not 3h; the credit is not applied twice.

### Example I — Shared Subgoal

`Build Portfolio` contributes to two broader Goals. Its 2h Demand exists once. Both parent summaries may show contribution; system totals, Allocation, execution, and observations deduplicate by identity.

### Example J — Priority

`Improve Career: High` contains `Earn Network+: Medium`. Medium governs the child. Parent High is contextual unless a separately authored applicable propagation scope exists.

### Example K — Different Parent Priorities

A shared child with no own Priority receives no manufactured blend/max. Conflicting propagated scopes are invalid until explicit precedence is authored.

### Example L — Child Completed

Completion may satisfy dependencies and parent eligibility. It does not complete parent, mutate parent Progress, or erase remaining independent Demand; lifecycle-driven child Demand becomes ineligible.

### Example M — Parent Archived

Parent Demand becomes ineligible. Child remains active and its independent Demand remains eligible unless an explicit dependency/policy says otherwise. History retains containment.

### Example N — Historical Restructure

Retire `A contains B`, create `C contains B`. Current traversal uses C; old decisions retain the A-edge revision and structural fingerprint.

### Example O — Suggested Decomposition

Before acceptance, three proposed Subgoals are proposal data only. Acceptance creates selected Goals/edges; modification records user deltas; rejection creates no structure.

### Example P — Found Time

New 45-minute Capacity is matched only against structurally eligible normalized Demand. Allocation/Proposal receives identities, amounts, Priority, and reasons; it does not infer ancestry.

## 70. Goal Structure Invariants

1. **GS-INV-01:** Structure MUST NOT create time ownership.
2. **GS-INV-02:** Subgoal remains an outcome, not Commitment.
3. **GS-INV-03:** Milestone remains checkpoint/state, not activity.
4. **GS-INV-04:** Containment MUST NOT imply dependency.
5. **GS-INV-05:** Containment MUST NOT imply Priority inheritance.
6. **GS-INV-06:** Containment MUST NOT imply Demand aggregation.
7. **GS-INV-07:** Containment MUST NOT imply Progress aggregation.
8. **GS-INV-08:** Containment MUST NOT imply completion cascade.
9. **GS-INV-09:** Parent/child Demand MUST NOT silently double count.
10. **GS-INV-10:** Shared Demand MUST NOT duplicate by path.
11. **GS-INV-11:** Shared Progress evidence MUST NOT duplicate by path.
12. **GS-INV-12:** Shared execution MUST NOT duplicate by path.
13. **GS-INV-13:** Commitment link is not a Subgoal relation.
14. **GS-INV-14:** Observation is not a Milestone.
15. **GS-INV-15:** Suggestions are not authored authority.
16. **GS-INV-16:** Structural edits MUST NOT rewrite historical decisions.
17. **GS-INV-17:** Traversal MUST NOT create authority.
18. **GS-INV-18:** Dependency eligibility MUST NOT schedule work.
19. **GS-INV-19:** Priority remains separate absent explicit scope authority.
20. **GS-INV-20:** Demand remains distinct from Structure.
21. **GS-INV-21:** Progress remains distinct from effort.
22. **GS-INV-22:** Proposal consumes resolved semantics rather than inventing them.
23. **GS-INV-23:** Found Time uses the same resolved authority.
24. **GS-INV-24:** Structure MUST NOT absorb Commitment Composition.
25. **GS-INV-25:** Multi-path facts deduplicate by authoritative identity.
26. **GS-INV-26:** Equivalent authority yields equivalent interpretation.
27. **GS-INV-27:** Stale derivations MUST NOT drive current Proposal.
28. **GS-INV-28:** Historical structure remains interpretable after restructuring.
29. **GS-INV-29:** Flat Goals remain valid.
30. **GS-INV-30:** Demand normalization MUST conserve authorized quantity.
31. **GS-INV-31:** Explicit Goal completion remains user authority.
32. **GS-INV-32:** Storage/display order MUST NOT create semantics.

## 71. Architecture Decisions

### GS-SPEC-01 — Goal Structure Definition
- **Decision:** Separate versioned relationship authority.
- **Normative Rule:** Structure represents typed outcome/checkpoint relations only.
- **Reasoning:** Goals and planning resources have distinct authority.
- **Consequences:** Flat Goals remain valid.
- **Implementation Constraint:** No generic object hierarchy.
- **Remaining Downstream Question:** Storage host.

### GS-SPEC-02 — Goal / Subgoal Model
- **Decision:** One Goal type plus roles.
- **Normative Rule:** Subgoal is a Goal in containment.
- **Reasoning:** Structure may change without identity change.
- **Consequences:** Uniform lifecycle and querying.
- **Implementation Constraint:** No Subgoal subtype.
- **Remaining Downstream Question:** UI labels.

### GS-SPEC-03 — Relationship Identity / Lifecycle
- **Decision:** Opaque revisioned effective records.
- **Normative Rule:** Material edits supersede/retire history-preserving revisions.
- **Reasoning:** Restructuring must not rewrite decisions.
- **Consequences:** Edges are addressable authority.
- **Implementation Constraint:** Never key identity from endpoints.
- **Remaining Downstream Question:** Physical ledger layout.

### GS-SPEC-04 — Containment
- **Decision:** Single-parent required/optional relationship.
- **Normative Rule:** Containment alone changes no adjacent authority.
- **Reasoning:** Decomposition is not aggregation.
- **Consequences:** Stable forest navigation.
- **Implementation Constraint:** Reject second active parent.
- **Remaining Downstream Question:** Authoring UX.

### GS-SPEC-05 — Contribution
- **Decision:** Multi-target graph relationship.
- **Normative Rule:** Contribution is non-aggregating absent policy.
- **Reasoning:** Shared outcomes are legitimate.
- **Consequences:** Parent views may share one fact.
- **Implementation Constraint:** Deduplicate by identity.
- **Remaining Downstream Question:** Presentation labels.

### GS-SPEC-06 — Dependency
- **Decision:** Hard and advisory outcome dependencies.
- **Normative Rule:** Only explicit conditions affect eligibility.
- **Reasoning:** Containment and order differ.
- **Consequences:** Derived blocking is explainable.
- **Implementation Constraint:** No scheduling placement semantics.
- **Remaining Downstream Question:** Initial condition catalog.

### GS-SPEC-07 — Milestone
- **Decision:** First-class Goal-owned checkpoint authority.
- **Normative Rule:** Milestones own no Demand, Priority, Progress, or time.
- **Reasoning:** Checkpoints are neither Goals nor evidence.
- **Consequences:** May gate eligibility/completion interpretation.
- **Implementation Constraint:** Exactly one owning Goal.
- **Remaining Downstream Question:** Initial UX.

### GS-SPEC-08 — Milestone / Measurement
- **Decision:** Evidence policy may satisfy checkpoint.
- **Normative Rule:** Observation/target never becomes Milestone implicitly.
- **Reasoning:** Evidence and authority differ.
- **Consequences:** Automatic state requires authored policy.
- **Implementation Constraint:** Bind definition revisions/cutoff.
- **Remaining Downstream Question:** Policy vocabulary.

### GS-SPEC-09 — Topology
- **Decision:** Hybrid forest plus graphs.
- **Normative Rule:** Containment single-parent; contribution/dependency graph-capable.
- **Reasoning:** Smallest model supporting shared outcomes.
- **Consequences:** Distinct traversals.
- **Implementation Constraint:** No universal tree assumption.
- **Remaining Downstream Question:** Graph visualization.

### GS-SPEC-10 — Cycle Policy
- **Decision:** Reject containment/dependency cycles.
- **Normative Rule:** Aggregating contribution subgraphs are acyclic.
- **Reasoning:** Eligibility/accounting must terminate.
- **Consequences:** Non-aggregating contribution cycles may exist.
- **Implementation Constraint:** Deterministic cycle paths.
- **Remaining Downstream Question:** Error presentation.

### GS-SPEC-11 — Required / Optional
- **Decision:** Explicit on containment.
- **Normative Rule:** Presence never implies requiredness.
- **Reasoning:** Completion semantics require intent.
- **Consequences:** Optional children do not block eligibility.
- **Implementation Constraint:** No nullable/default ambiguity.
- **Remaining Downstream Question:** Default authoring choice.

### GS-SPEC-12 — Completion
- **Decision:** Derived eligibility, explicit completion.
- **Normative Rule:** Structure MUST NOT auto-complete Goals.
- **Reasoning:** Preserve user lifecycle authority.
- **Consequences:** All children complete can prompt, not mutate.
- **Implementation Constraint:** No cascade side effect.
- **Remaining Downstream Question:** Completion prompt UX.

### GS-SPEC-13 — Archival / Reactivation
- **Decision:** Lifecycle remains local.
- **Normative Rule:** Archive/reactivate recomputes but does not cascade.
- **Reasoning:** Children are independent outcomes.
- **Consequences:** Active-child review may be needed.
- **Implementation Constraint:** Retain relationship history.
- **Remaining Downstream Question:** Archived-parent presentation.

### GS-SPEC-14 — Structural Eligibility
- **Decision:** Explicit derived read model.
- **Normative Rule:** Eligibility precedes Demand planning and owns no authority.
- **Reasoning:** Dependencies must be resolved once.
- **Consequences:** Downstream consumers receive reasons.
- **Implementation Constraint:** Four-state result with provenance.
- **Remaining Downstream Question:** Cache strategy.

### GS-SPEC-15 — Demand Boundary
- **Decision:** Demand remains owned by exactly one Goal.
- **Normative Rule:** Structure MUST NOT create Demand.
- **Reasoning:** Outcome relation differs from resource intent.
- **Consequences:** Parent summaries are not claims.
- **Implementation Constraint:** Preserve Demand identity.
- **Remaining Downstream Question:** None.

### GS-SPEC-16 — Parent / Child Demand
- **Decision:** Additive default with explicit modes.
- **Normative Rule:** Independent, included, and derived semantics require authority.
- **Reasoning:** Five-plus-two is otherwise ambiguous.
- **Consequences:** Mixed models are expressible.
- **Implementation Constraint:** Never infer from containment.
- **Remaining Downstream Question:** Authoring affordance.

### GS-SPEC-17 — Demand Accounting
- **Decision:** Separate revisioned authority.
- **Normative Rule:** Quantitative inclusion references exact Demand lifetimes.
- **Reasoning:** Structure edges should not carry horizon quantities.
- **Consequences:** Auditable conservation.
- **Implementation Constraint:** Validate amounts/horizons.
- **Remaining Downstream Question:** Initial partition modes.

### GS-SPEC-18 — Demand Normalization
- **Decision:** Normalize after Projection before Feasibility.
- **Normative Rule:** Emit non-duplicative competing amounts with provenance.
- **Reasoning:** Accounting is horizon-specific.
- **Consequences:** Allocation stays structure-agnostic.
- **Implementation Constraint:** Retain zero/excluded explanations.
- **Remaining Downstream Question:** Read-model host.

### GS-SPEC-19 — Shared Demand
- **Decision:** One Demand remains one claim.
- **Normative Rule:** Multiple paths MUST NOT multiply quantity.
- **Reasoning:** Contribution is explanatory.
- **Consequences:** Separate authority required for duplication.
- **Implementation Constraint:** Deduplicate normalized Demand ID.
- **Remaining Downstream Question:** Partition UX.

### GS-SPEC-20 — Commitment Satisfaction
- **Decision:** Apply once to normalized ownership ledger.
- **Normative Rule:** Link alone grants no credit; nested credit is not re-subtracted.
- **Reasoning:** Prevent child/parent double credit.
- **Consequences:** Explicit attribution composes cleanly.
- **Implementation Constraint:** Preserve attribution identity.
- **Remaining Downstream Question:** Allocation of excess credit.

### GS-SPEC-21 — Priority Structure
- **Decision:** No implicit inheritance; explicit scoped propagation allowed.
- **Normative Rule:** Child authority or explicit scope supplies effective Priority.
- **Reasoning:** Ancestry cannot manufacture importance.
- **Consequences:** Parent context may remain advisory.
- **Implementation Constraint:** Scope is separate authored authority.
- **Remaining Downstream Question:** Initial scope forms.

### GS-SPEC-22 — Multi-Parent Priority
- **Decision:** Child explicit Priority wins; ambiguous propagation rejected.
- **Normative Rule:** Never average/sum/max parent priorities.
- **Reasoning:** Conflict requires user authority.
- **Consequences:** Unprioritized policy may apply.
- **Implementation Constraint:** Deterministic ambiguity detection.
- **Remaining Downstream Question:** Conflict-resolution UX.

### GS-SPEC-23 — Progress Boundary
- **Decision:** Preserve per-Goal Progress.
- **Normative Rule:** Structure does not mutate observations/definitions.
- **Reasoning:** Outcome evidence must remain attributable.
- **Consequences:** Parent interpretation is derived.
- **Implementation Constraint:** Effort never auto-progresses.
- **Remaining Downstream Question:** None.

### GS-SPEC-24 — Progress Contribution
- **Decision:** Default none; explicit compatible policy only.
- **Normative Rule:** Universal averaging is forbidden.
- **Reasoning:** Units and meaning differ.
- **Consequences:** Completion eligibility and numeric Progress separate.
- **Implementation Constraint:** Version transformations/weights.
- **Remaining Downstream Question:** Advanced policies.

### GS-SPEC-25 — Milestone Contribution
- **Decision:** Explicit gate/display/contribution modes.
- **Normative Rule:** Satisfaction never equals Goal completion by implication.
- **Reasoning:** Checkpoint has bounded meaning.
- **Consequences:** Policies explain effect.
- **Implementation Constraint:** Bind Milestone revision.
- **Remaining Downstream Question:** Initial modes.

### GS-SPEC-26 — Historical Provenance
- **Decision:** Freeze decisive revisions, not whole graph.
- **Normative Rule:** Later structure MUST NOT reinterpret old decisions.
- **Reasoning:** History is immutable.
- **Consequences:** Compact explainable provenance.
- **Implementation Constraint:** Store structural fingerprint and refs.
- **Remaining Downstream Question:** Snapshot embedding threshold.

### GS-SPEC-27 — Execution / Logging
- **Decision:** Keep one occurrence execution record.
- **Normative Rule:** Ancestor reachability MUST NOT clone execution.
- **Reasoning:** Activity happened once.
- **Consequences:** Aggregates derive contribution.
- **Implementation Constraint:** Durable identity deduplication.
- **Remaining Downstream Question:** History display.

### GS-SPEC-28 — Summary / Goal Activity
- **Decision:** Direct default; explicit aggregate scopes.
- **Normative Rule:** Aggregates deduplicate and expose structure basis.
- **Reasoning:** Shared graphs otherwise inflate totals.
- **Consequences:** Existing semantics remain stable.
- **Implementation Constraint:** Separate current/historical bases.
- **Remaining Downstream Question:** UI scope controls.

### GS-SPEC-29 — Allocation Boundary
- **Decision:** Allocation consumes normalized inputs.
- **Normative Rule:** Allocation MUST NOT traverse Structure.
- **Reasoning:** One upstream semantic resolution.
- **Consequences:** Existing allocation model remains bounded.
- **Implementation Constraint:** Carry fingerprints/reasons.
- **Remaining Downstream Question:** None.

### GS-SPEC-30 — Proposal Boundary
- **Decision:** Proposal consumes resolved allocation/provenance.
- **Normative Rule:** Proposal MUST NOT invent structure/accounting/priority.
- **Reasoning:** Recommendation is not authority resolution.
- **Consequences:** Explanation remains possible.
- **Implementation Constraint:** Reject stale structural inputs.
- **Remaining Downstream Question:** Explanation depth.

### GS-SPEC-31 — Found Time
- **Decision:** Reuse normalized Demand pipeline.
- **Normative Rule:** Found Time gets no structural bypass.
- **Reasoning:** New Capacity does not change authority.
- **Consequences:** Consistent recommendations.
- **Implementation Constraint:** Same eligibility/fingerprint checks.
- **Remaining Downstream Question:** Presentation.

### GS-SPEC-32 — Commitment Composition
- **Decision:** Separate domains.
- **Normative Rule:** Goal Structure endpoints MUST NOT model attached activities.
- **Reasoning:** Outcomes and time-owning work differ.
- **Consequences:** Composition requires its own audit.
- **Implementation Constraint:** No polymorphic contains edge.
- **Remaining Downstream Question:** Composition architecture.

### GS-SPEC-33 — Suggested Decomposition
- **Decision:** Proposal then explicit acceptance.
- **Normative Rule:** Suggestions MUST NOT become authority silently.
- **Reasoning:** Preserve epistemic/user boundary.
- **Consequences:** Acceptance creates selected records only.
- **Implementation Constraint:** Preserve proposal/delta provenance.
- **Remaining Downstream Question:** Suggestion algorithm.

### GS-SPEC-34 — Modification / Removal
- **Decision:** Revise, supersede, or retire.
- **Normative Rule:** Historically relevant edges MUST NOT be destructively erased.
- **Reasoning:** Decisions require old meaning.
- **Consequences:** Moves are atomic transitions.
- **Implementation Constraint:** Stale dependents transactionally.
- **Remaining Downstream Question:** Retention UI.

### GS-SPEC-35 — Determinism
- **Decision:** Canonical identity-ordered semantics.
- **Normative Rule:** Equivalent authority MUST yield equivalent outputs.
- **Reasoning:** Planning and history must replay.
- **Consequences:** UI/storage order irrelevant.
- **Implementation Constraint:** Version traversal/validation algorithms.
- **Remaining Downstream Question:** None.

### GS-SPEC-36 — Fingerprint / Staleness
- **Decision:** Material structural fingerprint required.
- **Normative Rule:** Changed dependencies/policies/relationships stale consumers.
- **Reasoning:** Derived outputs must match authority.
- **Consequences:** Historical stale outputs remain readable.
- **Implementation Constraint:** Exclude presentation state.
- **Remaining Downstream Question:** Cache invalidation implementation.

### GS-SPEC-37 — Persistence / Restore
- **Decision:** Versioned atomic structural authority.
- **Normative Rule:** Restore validates all references/cycles before install.
- **Reasoning:** Partial graphs corrupt semantics.
- **Consequences:** Legacy flat data migrates validly.
- **Implementation Constraint:** Preserve IDs/revisions/history.
- **Remaining Downstream Question:** Schema version sequence.

### GS-SPEC-38 — Traversal / Deduplication
- **Decision:** Central deterministic structure service.
- **Normative Rule:** Traversal returns unique facts plus paths, not aggregation.
- **Reasoning:** Shared graphs require one identity rule.
- **Consequences:** Consumers apply explicit policies.
- **Implementation Constraint:** Cycle-safe scoped traversal.
- **Remaining Downstream Question:** Performance limits.

## 72. Relationship Matrix

| Relationship | Source | Target | Authored or Derived? | Own Identity? | May Affect Demand? | May Affect Progress? | May Affect Eligibility? | May Affect Priority? | Historical Provenance Required? |
|---|---|---|---|---:|---:|---:|---:|---:|---:|
| contains | Parent Goal | Subgoal | Authored | Yes | Only via separate accounting | Only via policy | Completion interpretation only | Only explicit scope | Yes |
| contributesTo | Goal | Broader Goal | Authored | Yes | Only accounting policy | Only contribution policy | No by default | No by default | Yes when decisive |
| dependsOn hard | Goal | Goal/Milestone condition | Authored | Yes | Through eligibility | No | Yes | No | Yes |
| dependsOn advisory | Goal | Goal/Milestone condition | Authored | Yes | Explanation only | No | Conditional/advisory | No | When used |
| milestoneOf | Milestone | Owning Goal | Authored ownership, derived inverse | Milestone ID | No | Only policy | May gate | No | Yes when decisive |
| parent/child/blocks inverse | Derived endpoints | Derived endpoints | Derived | No | No | No | Reflects authority | No | Resolve source edge |

## 73. Boundary Matrix

| Concept | Outcome Identity? | Own Lifecycle? | Own Progress? | May Own Demand? | Owns Time? | Structural Authority? | May Gate Eligibility? | Historical Provenance? |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Goal | Yes | Yes | Yes | Via separate Demand | No | Endpoint | Via lifecycle/dependency | Yes |
| Subgoal | Yes | Yes | Yes | Via separate Demand | No | Endpoint role | Yes | Yes |
| Parent Goal | Yes | Yes | Yes | Via separate Demand | No | Endpoint role | No by parenthood | Yes |
| Milestone | No; checkpoint ID | Yes | No | No | No | Checkpoint authority | Yes by policy | Yes |
| Structural relationship | No | Yes | No | No | No | Yes | Depends on type | Yes |
| Goal Priority | No | Yes | No | No | No | Separate scope authority | No | Yes |
| Goal Demand | No | Yes | No | It is Demand | No | No | Consumes eligibility | Yes |
| Commitment | No | Yes | No | No | Yes | No | Scheduling only | Yes |
| Scheduled Goal Work | No | Yes | No | Realization | Yes | No | No | Yes |
| Execution | No | Immutable/revision history | No | No | Historical fact | No | May satisfy evidence policy only | Yes |
| Progress Observation | No | Revision lineage | Evidence | No | No | No | May satisfy explicit condition | Yes |
| Proposal | No | Proposal lifecycle | No | No | No | No | Consumes eligibility | Yes |
| Accepted Allocation | No | Yes | No | Authorizes allocation | No until realization | No | Must be eligible/current | Yes |

## 74. Demand Accounting Matrix

| Scenario | Raw Demand | Structural Relationship | Attributed Existing Work | Normalized Competing Demand | Why |
|---|---:|---|---:|---:|---|
| Independent parent + child | 5h + 2h | contains only | 0 | 7h | Additive default |
| Nested child | 5h + 2h | child included in parent | 0 | 5h | Child is within ceiling |
| Derived parent | children 2h + 3h, parent derived 5h | derivedFrom | 0 | 5h | Parent is summary |
| Mixed | parent 5h includes child 2h; other child 1h independent | explicit modes | 0 | 6h | One included, one additive |
| Shared Subgoal | child 2h, two contributions | contribution paths | 0 | 2h | Demand identity once |
| Nested child + Commitment | parent 5h includes child 2h | includedIn | 1h | 4h | Credit once in ownership ledger |
| Inactive dependency | child 2h | hard unmet | 0 | 0 eligible; 2h excluded | Eligibility precedes competition |
| Archived parent | parent 5h, child 2h independent | contains | 0 | 2h | Parent lifecycle excludes only parent |
| Optional child | parent 5h, optional child no Demand | contains optional | 0 | 5h | Structure creates none |

## 75. Priority Matrix

| Scenario | Parent Priority | Child Priority | Structural Rule | Effective Allocation Input | Authority Source |
|---|---|---|---|---|---|
| No child priority | High | none | No propagation | unprioritized + context | Allocation policy/context |
| Explicit child | High | Medium | Child explicit wins | Medium | Child Priority |
| Explicit propagated scope | High | none | Valid authored descendant scope | High | Scope authority + parent Priority |
| Shared conflicting parents | High / Low | none | Ambiguous scopes rejected | unprioritized until resolved | No manufactured value |
| Derived urgency | any | any | Advisory only | explicit Priority unchanged | Derived signal |
| Learned preference | any | none | Non-authoritative | unchanged | Historical analysis |

## 76. Progress Matrix

| Scenario | Child Evidence | Parent Measurement | Relationship Policy | Parent Progress Effect | Historical Provenance |
|---|---|---|---|---|---|
| No roll-up | any | any | none | none | Child only |
| Required child complete | lifecycle completion | any | completion eligibility | eligibility only | Goal/edge revisions |
| Explicit compatible contribution | count observation | count policy | versioned transform/weight | derived contribution | Full inputs/policy |
| Incompatible units | dollars vs count | count | invalid/not applicable | none/unknown | incompatibility reason |
| Shared child | one observation | two parents | explicit policies | once per parent view; once system fact | Identity + paths |
| Milestone complete | satisfaction evidence | any | gate/display policy | no numeric effect unless explicit | Milestone/policy refs |
| Execution without observation | execution record | any | none | none | Execution remains activity evidence |

## 77. Lifecycle Matrix

| Event | Relationship State | Child State | Parent State | Demand Effect | Historical Effect |
|---|---|---|---|---|---|
| Child completed | active | completed | unchanged | Child lifecycle excludes own active Demand | Freeze event/current edge when decisive |
| Parent completed | active | unchanged | completed | Parent Demand excluded; child independent | No cascade; preserve edge |
| Child archived | active/history | archived | unchanged | Child Demand excluded | Preserve edge revision |
| Parent archived | active/history | unchanged | archived | Parent excluded; child independent | Preserve edge revision |
| Relationship retired | retired | unchanged | unchanged | Recompute/stale accounting | Old revision resolvable |
| Goal reactivated | existing effective structure | active | as applicable | Recompute eligibility | Past unchanged |
| Dependency satisfied | active | unchanged | dependent unchanged | Dependent may become eligible | Freeze satisfaction basis when used |
| Dependency target archived | active but unresolved | as applicable | as applicable | unknown/policy result, not satisfied | Preserve prior results |

## 78. Authority Matrix

| Concept | Authority Source | Epistemic Category | Persist Current? | Can Change Demand? | Can Change Eligibility? | Can Change Schedule Directly? | User Acceptance Required? |
|---|---|---|---:|---:|---:|---:|---:|
| Goal | User/accepted proposal | Authored | Yes | No by existence | Lifecycle can | No | Yes |
| Relationship | User/accepted proposal | Authored | Yes | Only through referenced policy | Yes by dependency | No | Yes |
| Milestone | User/accepted proposal/evidence policy | Authored state | Yes | No | Yes by condition | No | Yes for creation/policy |
| Structural Eligibility | Deterministic engine | Derived | Cache only | Qualifies | It is result | No | No |
| Demand Accounting | User | Authored | Yes | Normalizes quantity | No | No | Yes |
| Normalized Demand | Engine | Derived | Cache/history | It is competing interpretation | Consumes eligibility | No | No |
| Priority scope | User | Authored | Yes | Ranking only | No | No | Yes |
| Progress contribution | User policy | Authored policy/derived result | Policy yes | No | May inform condition | No | Yes for policy |
| Allocation | Engine | Derived | History/cache | Assigns, not changes | Consumes | No | No |
| Proposal | Engine | Proposed | Yes when decided | No | Consumes | No | Acceptance later |
| Accepted Allocation | User | Accepted | Yes | No | Must be valid | Authorizes realization | Yes |
| Scheduled Goal Work | Accepted authority | Scheduled reality | Yes | No | No | Yes | Prior acceptance |

## 79. Transition Matrix

| Transition | Input | Output | Automatic? | User Authority Required? | Creates Time Ownership? | Historical Freeze? |
|---|---|---|---:|---:|---:|---:|
| Goal → relationship | Goals + authored command | relationship | No | Yes | No | Revision history |
| Suggested → accepted structure | proposal + selection/delta | Goals/edges/Milestones | No | Yes | No | Proposal + acceptance |
| Structure → Eligibility | graph + conditions/cutoff | eligibility | Yes | No | No | When decisive |
| Structure + Demand → normalized | projections + accounting + eligibility | normalized Demand | Yes | Accounting authority yes | No | When proposed/decided |
| Child completion → parent interpretation | lifecycle + policy | completion eligibility | Yes | Completion was explicit | No | If used |
| Dependency satisfaction → eligibility | evidence + condition | recomputed eligibility | Yes | Policy authored | No | If used |
| Relationship modification | current revision + command | superseding revision | No | Yes | No | Yes |
| Relationship retirement | active edge + command | retired edge | No | Yes | No | Yes |
| Normalized Demand → Projection downstream | normalized result | feasibility input | Yes | No | No | Fingerprint |
| Allocation → Proposal | allocation | proposal | Yes | No | No | Proposal provenance |
| Proposal → Accepted Allocation | current proposal + decision | accepted authority | No | Yes | No | Yes |
| Accepted Allocation → Scheduled Goal Work | accepted scope | occurrence | Yes within scope | Already supplied | Yes | Yes |

## 80. Primitive Compatibility Matrix

| Specification Requirement | Existing Primitive | Reuse Classification | Required Adaptation | Architectural Risk |
|---|---|---|---|---|
| Goal identity | UUID GoalId | Directly Reusable | Structural refs | None if never retargeted |
| Goal revision | monotonic revision | Reusable with Adaptation | Historical revision resolution | Active overwrite |
| Goal lifecycle | active/completed/archived | Directly Reusable | Eligibility integration | Cascade temptation |
| Goal Commitment links | incarnation links | Conceptually Related but Wrong Abstraction | Keep service-only | Activity as outcome |
| Source incarnation | SourceIncarnationId | Reusable with Adaptation | Relationship lifetime pattern | ID reuse |
| Measurement definitions | per-Goal revisions | Reusable with Adaptation | Contribution policies | Unit coercion |
| Progress observations | revisioned Goal evidence | Directly Reusable | Structural provenance | Double use |
| Progress query | per-Goal projection | Reusable with Adaptation | Separate aggregate layer | Silent roll-up |
| Target date | Goal field | Directly Reusable | No inheritance | Deadline leakage |
| Goal Priority spec | separate authority | Reusable with Adaptation | Scope authority | Silent inheritance |
| Goal Demand spec | independent lifetimes | Reusable with Adaptation | Normalization inputs | Double Demand |
| Satisfaction attribution | explicit versioned concept | Reusable with Adaptation | Ownership ledger composition | Double credit |
| Historical Goal snapshots | frozen immediate context | Reusable with Adaptation | Decisive edge refs/fingerprint | Graph snapshots bloating |
| Execution history | durable occurrence record | Directly Reusable | Ancestor derivation | Cloning |
| Goal Activity | direct per-Goal query | Reusable with Adaptation | Explicit aggregate scopes | Inflated totals |
| Summary | derived surfaces | Reusable with Adaptation | Identity deduplication | Current/history confusion |
| PlanDecision | accepted provenance | Reusable with Adaptation | Structural decision types | Occurrence-only semantics |
| Persistence/backup/restore | versioned atomic participants | Reusable with Adaptation | Referential/cycle validation | Partial install |

## 81. Specification Consistency Checks

1. **Goal with no structure:** valid; behavior unchanged.
2. **One child:** explicit containment only; no inferred aggregation.
3. **Multiple children:** each edge has requiredness; identity preserved.
4. **Optional child:** cannot block completion eligibility.
5. **Multiple broader Goals:** use one containment at most plus contribution edges.
6. **Dependency:** explicit condition derives eligibility.
7. **Dependency cycle:** rejected deterministically.
8. **Containment cycle:** rejected deterministically.
9. **Milestone, no child:** valid Goal-owned checkpoint.
10. **Child, no Demand:** valid; structure creates none.
11. **Parent Demand only:** competes once if eligible.
12. **Child Demand only:** competes once if eligible.
13. **Independent parent + child:** additive by default.
14. **Nested parent + child:** explicit accounting yields parent ceiling.
15. **Shared-child Demand:** identity counted once.
16. **Commitment satisfies child:** explicit credit applied once after normalization.
17. **Different Priorities:** child’s explicit authority governs child.
18. **Conflicting parent Priorities:** no manufactured value; ambiguity rejected.
19. **Incompatible Progress units:** no aggregation.
20. **All required children complete:** parent eligible, not auto-completed.
21. **Parent complete, child active:** child remains active.
22. **Parent archived:** only parent Demand automatically excluded.
23. **Child archived:** child Demand excluded; parent unchanged except derivation.
24. **Historical restructure:** retired revision resolves old decisions.
25. **Suggestion rejected:** no authored records.
26. **Suggestion modified:** accepted records reflect delta and preserve proposal.
27. **Found Time:** evaluates normalized eligible Demand only.
28. **Proposal without traversal:** receives resolved inputs and provenance.
29. **Aggregate Summary:** execution deduplicates by durable identity.
30. **Commitment Composition coexistence:** structural edges remain Goal/Milestone-only.

No contradiction remains among these cases.

## 82. Implementation Constraints

A conforming implementation must:

1. preserve flat Goals; 2. make structure optional; 3. preserve Goal identity across edits; 4. use explicit relationship authority; 5. preserve edge identity/history; 6. enforce cycle rules; 7. distinguish containment/contribution/dependency; 8. keep Subgoal distinct from Commitment; 9. keep Milestone distinct from evidence/activity; 10. prohibit silent Demand aggregation; 11. prevent structural double counting; 12. deduplicate shared children; 13. preserve explicit Priority; 14. prohibit implicit inheritance; 15. preserve per-Goal Progress; 16. require explicit contribution policy; 17. freeze decisive structure; 18. keep execution unique; 19. deduplicate aggregate Summary; 20. resolve eligibility upstream; 21. normalize projected Demand before Feasibility/Allocation; 22. keep Allocation structure-agnostic; 23. keep Proposal non-inventive; 24. apply the same rules to Found Time; 25. separate Commitment Composition; 26. ensure deterministic explanations; 27. stale material dependents; 28. atomically validate backup/restore; 29. separate current and historical bases; 30. require acceptance for suggested authority.

No constraint is implemented by this document.

## 83. Downstream Open Questions

Genuinely downstream questions are authoring/visualization UI, tree/graph navigation and drag/drop, suggestion algorithms, initial labels, advanced compatible Progress policies, optional display ordering, Proposal explanation depth, Found-Time presentation, storage host, migration sequencing, cache strategy, and performance limits. Demand accounting, authority, topology, lifecycle, dependency, and provenance fundamentals are resolved here.

## 84. Specification Conclusions

Goal Structure is a separate authored authority using one Goal type. The hybrid topology provides single-parent containment and graph-capable contribution/dependency. Relationships have durable revisioned identity; Milestones are Goal-owned checkpoint authority. Structural Eligibility is derived; completion stays explicit. Demand is additive by default and only explicit Demand Accounting creates included/derived semantics; horizon projections normalize before Feasibility and Allocation with conservation and once-only Commitment credit. Priority never inherits silently. Progress stays per-Goal and contributes only through compatible explicit policy. History freezes decisive revisions/fingerprints; execution and aggregate views deduplicate by identity. Allocation, Proposal, and Found Time consume resolved structure rather than infer it. Commitment Composition remains separate.

## 85. Recommended Next Step

**Path A — Commitment Composition / Attached Activities Architecture Audit.**

Goal Structure fundamentals are complete, including Demand accounting, eligibility, priority, Progress, lifecycle, topology, and provenance. The remaining upstream semantic seam before constructive Proposal is whether time-owning Commitments and attached activities such as travel/preparation/recovery compose without hidden Capacity or authority errors. This recommendation begins no audit and establishes no implementation phase.

## 86. Completion Statement

> **Goal Structure Architecture Specification complete.**
>
> The specification establishes Goal Structure as an explicit, versioned authority over relationships among desired outcomes; defines Goal, Parent Goal, Subgoal, Milestone, containment, contribution, dependency, structural eligibility, lifecycle, topology, cycle rules, Demand accounting and normalization, Goal Priority scope, Progress contribution, historical provenance, execution and Summary deduplication, deterministic traversal, staleness, persistence, and user-authority boundaries; preserves the separation among outcomes, activities, Commitments, Goal Demand, Capacity, Allocation, Proposal, Accepted Allocation, Scheduled Goal Work, Execution, and Progress; prevents structural relationships from silently creating time ownership, Demand, priority, Progress, completion, or reusable authority; and identifies the appropriate next architectural step without modifying implementation or assigning the work to a future implementation phase.
