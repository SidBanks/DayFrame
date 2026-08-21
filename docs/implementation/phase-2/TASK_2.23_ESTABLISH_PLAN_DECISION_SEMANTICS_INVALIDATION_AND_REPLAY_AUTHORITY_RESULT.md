# Task 2.23 — PlanDecision Semantics, Invalidation, and Replay Authority — Result

## 1. Executive Determination

**Completed — architectural decision only.** Adopt `PlanDecision` as the canonical name for a user-authored, occurrence- or conflict-scoped planning choice that constrains deterministic plan derivation without changing its reusable source pattern. It is a separate Authored Named Domain Object created through Author, never a converted `SuggestedFix`.

PlanDecision records semantic outcomes, not replay commands. Adopt exact hard placement, hard occurrence omission, exact hard duration, exact soft effective priority, and a hard conflict-actionability waiver that preserves the conflict fact. Recovery substitution remains semantically underdefined and is not implementation-ready. Decisions form an unordered keyed set, compose by dimension, replace within a dimension, and are removable as minimum undo. Every in-scope decision must be applied or observably classified dormant, stale, unresolved, or obsolete/orphaned—never silently ignored, reinterpreted, or deleted.

Durable implementation requires lifetime-safe occurrence references covering template, recurrence, manual event, shift definition, cycle, and nested work-segment/sequence-entry lifetimes. The dependency-correct next task is source-incarnation and durable occurrence-reference semantics.

## 2. Artifact Integrity

**Confirmed.** The supplied artifact was complete: 65,582 bytes / 2,813 lines, SHA-256 `96c743c7682db62b3d2c8ac5b3d98d06b08243c8388901ed72cb87133dd17b11`. The saved copy contained identical text plus one trailing newline: 65,583 bytes / 2,814 lines, SHA-256 `0414490d51029a5fe812f37f3f31c0403e4925db8ddebb7301e49975c5c00b2a`. Neither immutable artifact was modified.

## 3. Evidence Reviewed

**Confirmed:** Task 2.22 result; all fix/friction types, generators and application paths; Preview revision/generation; occurrence constructors/propagation; candidate placement and friction; store freshness/revision/persistence; authored validator; profile/backup/active boundaries and tests; canonical architecture category, Author/Derive, Teach/Plan, service, engine, determinism, provenance, explainability and historical-immutability rules.

## 4. Governing Task 2.22 Decisions

Preserved: SuggestedFix stays derived/advisory; acceptance is Author of separate authority; current revision is ephemeral Try; source-wide mutation is wrong for occurrence-local choices; fixed-time remains authored-edit handoff; no session-only PlanDecision; semantics precede incarnation; incarnation precedes durability; decisions are non-historical; decision-aware generation must be deterministic.

## 5. PlanDecision Working Definition

> A PlanDecision is user-authored planning authority recording one semantic outcome for one occurrence or semantic conflict, used to constrain deterministic plan derivation without rewriting the reusable authored source pattern.

It covers placement, omission, duration, priority and conflict actionability. It can cover recovery substitution only after that action's product semantics identify what authoritative outcome exists.

## 6. Canonical Naming Assessment

Adopt `PlanDecision`. It is broad enough for occurrence and conflict decisions and future direct plan editing, yet distinct from reusable commitment/source edits and derived Plan output.

## 7. Canonical Name Matrix

| Candidate Name | Authority Clarity | Occurrence Support | Conflict Support | Architectural Fit | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| PlanDecision | high | high | high | high | adopt |
| OccurrenceDecision | high | highest | weak | medium | reject: excludes conflict relationship |
| PlanningDecision | high | high | high | medium | valid but verbose |
| OccurrenceOverride | medium | high | weak | medium | reject: implementation/override framing |
| PlanOverride | medium | medium | medium | low | reject: obscures authored choice |

## 8. Domain Object Category

**Adopted:** Authored Named Domain Object. Active, dormant, stale, unresolved and obsolete decisions remain Authored; those labels are derived applicability assessments and never category changes. SuggestedFix and Preview remain Derived.

## 9. Information Transformation

Explicit acceptance performs **Author** and produces/updates PlanDecision authority. Recommendation generation and decision-aware plan generation perform **Derive**. Origin in a SuggestedFix does not make the accepted object derived.

## 10. Pillar Ownership

Architecture assigns Author transformations to Teach; therefore Teach owns PlanDecision creation/replacement/removal. Plan consumes effective decisions during deterministic derivation. This is intentional cross-pillar authored-information flow.

## 11. Service Ownership

Recommend conceptual **Plan Decision Authoring Service**: receives explicit user choice, fresh recommendation/plan context, current authored source and effective decision set; validates target/outcome/composition; produces/replaces/removes a PlanDecision with provenance. Module/class naming is deferred.

## 12. Engine Ownership

The existing Teach Engine concept coordinates Authoring Services; the Plan Engine consumes decisions and regenerates. The application workflow sequences suggestion → user acceptance → Teach authoring → Plan regeneration. No new engine is justified; exact implementation orchestration remains deferred.

## 13. SuggestedFix / PlanDecision Separation

Invariant: SuggestedFix never changes category or identity. Acceptance may copy semantic recommendation facts into a newly identified PlanDecision, but replay never depends on the original SuggestedFix still existing.

## 14. Minimum Semantic Content

| Candidate Fact | Classification |
| --- | --- |
| stable decision ID | required semantic fact |
| decision kind/dimension | required semantic fact |
| durable semantic occurrence target | required semantic fact |
| second/set target + conflict kind | required for conflict decision |
| selected semantic outcome | required semantic fact |
| authority strength | required by kind (fixed semantics may make field unnecessary) |
| source lifetime/lineage reference | required semantic fact |
| relevant dependency snapshot/fingerprint | required revalidation fact |
| explicit-user-authoring provenance + producer | required provenance |
| originating recommendation kind/rationale reference | optional provenance |
| SuggestedFix label/runtime ID/friction ID | not semantic authority |
| authored timestamp | implementation/audit metadata; optional semantically |
| insertion/replay order | not required under keyed semantic outcomes |

## 15. Decision Identity

A stable authored ID is required for replacement/removal, explainability and persistence. It identifies one decision lifetime, not its occurrence target. Creating a materially new choice creates a new ID and replaces the effective same-dimension record; allocator details are deferred.

## 16. Occurrence Target Semantics

Occurrence decisions require a lifetime-safe semantic occurrence reference: source kind/lifetimes, recurrence scope and canonical occurrence coordinates/slot. Runtime block/candidate IDs are prohibited durable references. OccurrenceIdentity V1 supplies session coordinates but not lifetime safety.

## 17. Conflict Target Semantics

Conflict acceptance targets an unordered set (currently pair) of durable occurrence references plus conflict kind and material conflict fingerprint. It must not target generation-local friction ID.

## 18. Conflict Identity Semantics

For two occurrences, canonicalize an unordered pair by stable semantic reference; order is presentation only. Conflict kind distinguishes overlap from other future friction. Material facts include overlap relationship/timing and relevant anchor/constraint semantics. A materially changed overlap is a new conflict requiring new acceptance.

## 19. Decision Scope

One semantic occurrence or one semantic conflict only. No automatic recurrence, range, template, or schedule-wide scope. Broader changes belong to explicit source/commitment editing or a future separately modeled bulk-authoring action.

## 20. Generation-Window Independence

Decisions follow their semantic target across same, overlapping, larger and smaller windows. Outside the current window they are dormant, not failed/deleted. Window boundaries are not decision identity.

## 21. Decision-Kind Inventory

Canonical kinds: placement, omission, duration, priority, conflict acceptance. Recovery substitution is reserved conceptually but blocked. Current fix action strings are inputs, not canonical decision-kind schema.

## 22. Decision-Kind Matrix

| Current Fix | Proposed Decision Kind | Target | Recorded Outcome | Authority Strength | Revalidation Need |
| --- | --- | --- | --- | --- | --- |
| moveBlock | placement | one occurrence | exact start/end (or start + canonical duration) | hard | feasibility/context |
| skipBlock | omission | one occurrence | omitted=true | hard | occurrence/lifetime existence |
| reduceDuration | duration | one occurrence | exact effective duration | hard | legality/source change |
| convertToRecovery | recovery substitution | one occurrence | unresolved | unresolved | product semantics first |
| changePriority | priority | one occurrence | exact effective priority | soft ranking | legality/source semantics |
| acceptConflict | conflict acceptance | semantic conflict | accepted actionability waiver | hard waiver | exact conflict equivalence |

## 23. Placement Decision Semantics

Record the exact placement the user saw/selected, not “move later” or “first gap.” Start/end semantics must remain tied to the occurrence's user-day/time-zone context. Future custom placement uses the same kind without SuggestedFix origin.

## 24. Placement Strength

Hard planning constraint. Planner may not silently move it elsewhere. “Hard” does not force impossible overlap; it requires either exact application or observable unresolved friction.

## 25. Placement Infeasibility

Retain the decision, classify unresolved, explain the conflicting constraint/anchor, and do not substitute another time or degrade to preference. User may replace/remove it.

## 26. Omission Decision Semantics

Hard, occurrence/date-specific omission. It suppresses scheduling of that occurrence without deleting/disabling source recurrence. Derived output must retain an explainable omitted occurrence/provenance. It becomes dormant outside its window and remains retained according to later retention policy.

## 27. Duration Decision Semantics

Record exact accepted effective minutes, not “minus 30.” It is a hard occurrence override subject to domain legality. This preserves what user saw despite future algorithm changes.

## 28. Duration Invalidation

Source-duration change makes the decision stale pending semantic revalidation. If same occurrence/lifetime remains and exact duration is still legal, it may return effective; otherwise unresolved. Never reinterpret as relative subtraction or clamp silently.

## 29. Recovery-Substitution Semantics

**Unresolved/blocked.** Current code changes category/title while retaining occurrence identity, but evidence cannot establish whether authority means transform original commitment, suppress it and create replacement recovery, or merely presentation. Do not include this kind in first implementation until a product-authority task settles identity, source/default/effective values and completion meaning.

## 30. Priority Decision Semantics

Record exact occurrence-local effective priority. Treat it as a soft ordering/ranking input, not permission to violate hard anchors/decisions. Do not store relative “increment.”

## 31. Priority Invalidation

Source-priority change triggers revalidation. If exact priority remains legal and the user override is still applicable, it remains effective; otherwise unresolved. It does not combine arithmetically with source priority.

## 32. Conflict-Acceptance Semantics

Hard waiver of actionability for one exact semantic conflict: retain the plan and mark the known conflict accepted. It does not make the overlap false, alter occurrences, or authorize materially different future conflicts.

## 33. Conflict-Acceptance Revalidation

Apply only when same lifetime-safe occurrence set, conflict kind and materially equivalent overlap/facts remain. If conflict vanishes, decision is dormant (potentially later obsolete by retention policy). If relationship changes materially, old decision is stale and new conflict remains actionable.

## 34. Outcome Versus Command Determination

Adopt semantic outcomes for every ready kind: exact placement, omission, exact duration, exact priority, exact conflict waiver. Procedural SuggestedFix commands are provenance at most and are not replayed.

## 35. Hard / Soft Authority Assessment

| Kind | Strength | Meaning |
| --- | --- | --- |
| placement | hard | exact or unresolved |
| omission | hard | occurrence excluded |
| duration | hard | exact legal duration or unresolved |
| recovery substitution | unresolved | semantics absent |
| priority | soft | ranking input, cannot override hard constraints |
| conflict acceptance | hard actionability waiver | fact remains, warning becomes accepted |

## 36. Decision Application Position

Adopt multi-stage consumption. Different semantic dimensions must enter where they influence deterministic planning, not as a post-generation hidden mutation.

## 37. Decision-Aware Generation Contract

`authored setup + effective PlanDecision set + historical evidence + generation parameters → deterministic Preview + decision application report`. The planner never requires past click order or a prior revised Preview.

## 38. Planning-Stage Consumption

Omission, duration, recovery substitution (once defined), and priority modify occurrence/candidate semantics before placement. Exact placement becomes a hard placement constraint during placement. Conflict acceptance applies after factual friction detection and changes actionability/annotation, not conflict detection.

## 39. Canonical Decision Consumption Order

1. Resolve targets/lifetimes and classify applicability.
2. Revalidate semantic dependencies.
3. Apply omission precedence and pre-placement duration/category/priority outcomes.
4. Generate candidates/occurrences with provenance.
5. Apply hard exact-placement constraints; place remaining candidates deterministically.
6. Detect factual friction.
7. Match conflict-acceptance decisions and annotate accepted actionability.
8. Generate recommendations respecting effective/unresolved decisions.
9. Emit applied/dormant/stale/unresolved/obsolete classifications.

## 40. Determinism Requirement

Equivalent authored authority, effective decision set, historical evidence and generation parameters must yield equivalent plan and decision-classification output. Ordering may not depend on storage/insertion order.

## 41. Decision Ordering

Use an unordered keyed set. Semantic outcomes and canonical planner stages remove command-order dependence. Any necessary tie-break uses stable semantic keys, not authored timestamps unless time is intentionally authoritative.

## 42. Decision Dimensions

Placement, duration, priority and recovery-substitution dimensions may compose for one occurrence. Omission dominates application of all occurrence dimensions while effective. Conflict acceptance is keyed to a relationship, separate from occurrence dimensions.

## 43. One-Object Model Assessment

| Model | Composition Clarity | Replacement | Provenance | Persistence Simplicity | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| one decision per action/dimension | high | simple keyed replacement | precise | moderate | adopt |
| one record per occurrence with fields | medium | field mutation | mixed | superficially simple | reject |
| command/event list | low | ordering/history required | detailed but noisy | complex | reject |

## 44. Decision Composition

Separate dimension records compose through canonical stages. Omission leaves subordinate records dormant, not deleted, so removal of omission can restore them after revalidation. Conflict waiver composes only with the exact conflict.

## 45. Decision Conflict Policy

At most one effective decision per target + dimension. A new same-dimension choice explicitly replaces the prior effective object. Invalid cross-dimension combinations are rejected by authoring validation or classified unresolved; no implicit latest-wins list replay.

## 46. Decision Replacement

Author a new decision with a new decision ID and atomically replace/remove the previous effective same-key decision. Without audit history, the old object need not remain in current authority. Mutating an existing record is allowable conceptually but new identity better represents a new explicit choice; final persistence operation is deferred.

## 47. Decision Removal / Minimum Undo

Delete/remove the effective authored decision and regenerate. This is sufficient minimum undo. Reversal decisions and an undo stack are unnecessary until audit/history requirements exist.

## 48. Lifecycle States

The authored object remains unchanged in category; decision-aware derivation emits applicability status:

- effective/applied;
- dormant;
- stale;
- unresolved;
- obsolete/orphaned.

“Superseded” need not exist in active authority without history.

## 49. Dormant Semantics

Valid target is outside current generation window or exact accepted conflict is presently absent but may recur for the same dated target/context. Not a failure; retain and report when relevant.

## 50. Stale / Unresolved Semantics

Stale: target lifetime exists but relevant authored dependencies changed and require revalidation. Unresolved: target/decision is understood and in scope but its hard outcome is illegal/infeasible or conflict cannot be safely matched. Neither is silently applied.

## 51. Obsolete / Orphan Semantics

Obsolete: lifetime-safe source/occurrence is conclusively gone and cannot recur. Orphaned: reference cannot be resolved/validated (including unsupported historical identity). Preserve as observable inactive user authority pending cleanup/recovery; do not delete automatically.

## 52. Missing Occurrence Semantics

Outside window → dormant. Temporarily filtered by generation conditions → dormant with reason. Same source lifetime changed so occurrence no longer exists → stale then obsolete after conclusive validation. Unresolvable reference → orphaned.

## 53. Source Deletion / Recreation

Deletion makes decisions obsolete/orphaned, not transferable. Recreation with same human/source ID is a distinct lifetime and must never inherit them. This is a hard source-incarnation requirement.

## 54. Source-Edit Revalidation

Revalidate only dependencies relevant to the decision kind; not every authored edit stales every decision. Same lifetime and unaffected semantic occurrence may remain effective.

## 55. Invalidation Matrix

| Decision Kind | Source Deleted | Recurrence Changed | Duration Changed | Day Boundary Changed | Window Changed | Conflict Counterpart Changed |
| --- | --- | --- | --- | --- | --- | --- |
| placement | obsolete/orphan | revalidate | revalidate feasibility | revalidate time context | dormant if out of window | revalidate feasibility |
| omission | obsolete/orphan | revalidate occurrence existence | remains valid | revalidate occurrence coordinate | dormant | usually remains valid |
| duration | obsolete/orphan | revalidate existence | stale/revalidate exact value | usually remains | dormant | usually remains |
| recovery substitution | obsolete/orphan | revalidate | unresolved semantics | unresolved semantics | dormant | unresolved semantics |
| priority | obsolete/orphan | revalidate existence | remains unless legality linked | usually remains | dormant | revalidate planning relevance |
| conflict acceptance | obsolete/orphan | revalidate both targets | stale if overlap changes | stale if overlap changes | dormant | stale/new conflict |

## 56. Authored Revision Assessment

Reject a global revision as sole applicability key; it over-invalidates unrelated decisions and still cannot prove semantic sameness. A revision may optimize change detection later but cannot replace lifetime identity and dependency revalidation.

## 57. Semantic Fingerprint Assessment

Required conceptually: retain/canonicalize the relevant accepted-time source/occurrence/conflict facts for comparison. It need not be a cryptographic hash. Kind-specific dependencies are preferable to an opaque global snapshot.

## 58. Revalidation Authority

A domain/planning decision-resolution service owns target resolution, dependency comparison and applicability classification; Plan Engine coordinates it. UI only presents results and requests replace/remove.

## 59. Silent Misapplication / Deletion Rules

Never apply to a semantically different lifetime because visible IDs match. Never silently delete or ignore unresolved/obsolete authored decisions. Automatic cleanup requires separately governed retention/user authority.

## 60. Infeasible Decision Handling

Hard placement/duration: retain unresolved and emit decision-aware friction; never move/clamp. Illegal priority: unresolved, never clamp. Conflict mismatch: old decision stale/dormant and new conflict actionable. Omission remains hard if target is valid.

## 61. Decision Provenance

Required chain: reusable authored sources → semantic occurrence(s) → optional friction/recommendation facts → explicit user Author action → PlanDecision ID/outcome → derived block/friction/application classification. Producer/service and source lineage must be reconstructible.

## 62. SuggestedFix Provenance Retention

Do not retain the full derived object as authority. Optionally retain recommendation kind, generator/producer, rationale code and accepted outcome snapshot. Runtime fix/friction IDs and labels are not durable semantics. Direct user-authored decisions omit recommendation origin.

## 63. Explainability Contract

Derived blocks expose enough provenance to answer which source generated them and which PlanDecision changed placement/duration/priority/category. Omitted occurrences remain explainable. Accepted conflicts show factual conflict plus decision ID and accepted status.

## 64. Occurrence Reference Matrix

| Decision Kind | Primary Occurrence | Secondary Occurrence | Conflict Kind | Source Incarnation Needed |
| --- | ---: | ---: | ---: | ---: |
| placement | yes | no | no | yes |
| omission | yes | no | no | yes |
| duration | yes | no | no | yes |
| recovery substitution | yes | maybe replacement lineage later | no | yes |
| priority | yes | no | no | yes |
| conflict acceptance | yes | yes/set | yes | yes for every member |

## 65. Source-Incarnation Requirements

| Source Lineage | Why Required | Minimum Semantic Requirement |
| --- | --- | --- |
| block template | primary template occurrence lifetime | distinguish delete/recreate |
| block recurrence | occurrence rule/slot lifetime | distinguish recurrence replacement/reuse |
| manual event | conflict counterpart lifetime | distinguish event delete/recreate |
| shift definition | work occurrence meaning | distinguish shift replacement |
| shift cycle | work schedule lineage | distinguish cycle replacement |
| segment/sequence entry | exact work-producing nested lifetime | distinguish nested delete/recreate/reorder/reuse |

Every occurrence reference in a conflict must independently carry lifetime safety.

## 66. Template / Recurrence Incarnation

Both semantic lifetimes matter: the template defines activity; recurrence defines occurrence-production rule/scope. A single composite occurrence-lineage token may encode both, but template ID alone or recurrence ID alone is insufficient. Task 2.24 may choose token structure.

## 67. Manual-Event Incarnation

Required for manual-event occurrence and conflict counterpart. Recreated same-ID event cannot inherit old acceptance. V1 manual ID alone is insufficient durably.

## 68. Work / Cycle / Nested Incarnation

Work references must protect shift-definition, shift-cycle and exact nested segment/sequence-entry lifetimes. Cycle incarnation alone is insufficient when a segment is deleted/recreated or its shift definition changes under reused IDs. Local start date/slot completes occurrence coordinate but not source lifetime.

## 69. Decision Persistence Goal

Eventually survive regeneration and restart and remain active until explicit removal or observable invalidation/retention policy. Persistence is not authorized until incarnation, durable reference, schema/versioning, validation and recovery are established.

## 70. Profile Semantics

PlanDecisions are active-plan authority, not reusable setup-pattern snapshots. Existing profiles remain `DayFrameAuthoredSetup` only. A future plan snapshot is a separate concept. Profile load must later revalidate existing decisions; it must not silently bundle/replace them.

## 71. Backup Semantics

V1 backup remains setup-only. Eventual decision export requires explicit versioned normal-backup extension or separate active-plan export; exact product choice is deferred. Never silently grow V1 semantics.

## 72. Active Durable Surface Assessment

Recommend a **separate active PlanDecision durable surface**, conceptually distinct from active setup. It permits independent schema/version, ingress/recovery, durability and profile separation. Atomic cross-surface setup/decision workflows will need explicit transaction semantics.

## 73. Persistence Surface Matrix

| Surface Model | Authority Clarity | Independent Versioning | Recovery Complexity | Profile Separation | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| inside active authored payload | medium | low | coupled | easy to accidentally bundle | reject |
| separate active decision surface | high | high | new but bounded | high | adopt conceptually |
| future monolithic plan artifact | high | high | highest/new product | high | defer |

## 74. Durability Obligations

Valid Author action is session authority first; persistence outcome is separate and observable. Decision surface needs retained durability, desired snapshot/absence, retry, recovery/protected ingress, mutation results and deletion-failure truth under Phase 1 principles.

## 75. Historical-Ingress Implications

Persisted decisions require structural validation, semantic kind/outcome validation, reference/incarnation compatibility, dependency revalidation, safe fallback/protection and explicit recovery. Invalid decisions must not silently constrain plans.

## 76. Versioning Implications

PlanDecision durable schema needs its own explicit version independent of occurrence-reference version. Format evolution, unsupported-version behavior and migration evidence are prerequisites.

## 77. OccurrenceIdentity Evolution Requirements

Task 2.24 should compare OccurrenceIdentity V2, a separate DurableOccurrenceReference, or V1 plus incarnation-enriched source reference. Semantics require lifetime safety and stable window-invariant coordinates; this task does not choose representation.

## 78. Try / Accept Target Model

SuggestedFix → Try → current `reviseSchedulePreview` disposable experiment. SuggestedFix or direct user choice → Accept → Author/replace PlanDecision → regenerate decision-aware plan. These are distinct controls/results and authority paths.

## 79. Accept-Without-Try Semantics

Allowed. PlanDecision authoring validates current fresh recommendation/outcome directly; Try is optional visualization, never a prerequisite or source of authority.

## 80. General PlanDecision Versus Suggestion-Specific Object

Adopt general PlanDecision. Recommendation origin is optional provenance. This avoids duplicate authority for future direct occurrence placement/omission/editing and preserves the same validation/replay model.

## 81. Manual Plan Editing Future

Direct manipulation of a generated occurrence can Author the corresponding semantic PlanDecision after confirmation/validation. It must not silently edit source commitment. Manual-event source edits remain commitment edits unless explicitly occurrence-decision behavior is introduced.

## 82. Commitment Edit Boundary

Edit Commitment/source changes reusable authored patterns and future occurrences. PlanDecision changes one semantic occurrence/conflict. UI must name the scope and route to the appropriate Authoring Service.

## 83. Past Decision / History Boundary

A past PlanDecision records planning authority, not actual execution. Historical execution remains separate Record output. Learn may later compare planned decision with observed outcome without category conversion.

## 84. Decision Retention Assessment

Retention/pruning after occurrence passes is later governance, not initial replay prerequisite. Do not auto-delete; explainability/export may require retained past planning provenance. Applicability and retention are separate.

## 85. Replay Failure Observability

Planner output must identify applied, dormant, stale, unresolved and obsolete/orphaned decisions with reason and target reference. Every in-scope effective decision is accounted for.

## 86. Decision Application Provenance

Preview blocks/friction need references to applied decision IDs and distinguish source/default versus effective value enough for explanation. Final shape is deferred.

## 87. Conflict Visibility After Acceptance

Adopt: conflict remains a factual derived condition, visibly marked accepted/non-actionable and excluded from unresolved-action counts. Acceptance changes actionability, not reality.

## 88. Omission Provenance

Derived plan/replay report must represent generated-but-intentionally-omitted occurrence with source, occurrence and decision ID even if absent from scheduled blocks.

## 89. Decision-Aware Friction

Unhonorable hard decisions generate explicit friction describing the user decision and incompatible constraint. Planner never silently overrides hard authority.

## 90. Recommendation Generation Interaction

Generator consumes effective decision outcomes/application results: do not repeatedly suggest moving an omitted occurrence or re-accepting identical conflict. Unresolved decisions may receive targeted recommendations but suggestions must not implicitly undo authority.

## 91. Decision Revision

Minimum operations: author new same-dimension replacement or remove existing decision. Both validate current target/set and regenerate. Direct mutation of derived Preview remains Try only.

## 92. Decision Authoring Validation

Validate fresh target existence/unambiguity, lifetime-safe reference (once available), legal kind/outcome, semantic dependency snapshot, no same-key ambiguity, cross-dimension coherence and explicit user authority. Shared domain service/store enforces; UI cannot self-author.

## 93. Fresh Preview Requirement

A SuggestedFix-origin decision requires a fresh Preview corresponding to current authored setup **and effective decision set**. Stale acceptance is rejected without decision mutation. Direct plan editing likewise needs current plan revision evidence.

## 94. Decision Set Authority

Adopt a new active authoritative state class distinct from reusable setup, saved profiles and derived Preview: `PlanDecisionSet`, keyed by semantic target/dimension and containing authored PlanDecision objects.

## 95. DayFrameState Implications

Future runtime aggregate may expose decision authority for subscription/convenience, but it must remain conceptually separate from `DayFrameAuthoredSetup` and Preview. Task 2.1 state decomposition remains unresolved; no type placement is authorized here.

## 96. Profile / Backup Replacement Implications

Profile load/setup-only backup import changes source authority and must revalidate decision set against new incarnations. Exact policy—preserve as orphaned, require explicit clear, or transactional replacement—is a future authority task. Never silently carry matching IDs as same lifetime or clear user decisions.

## 97. Recovery Implications

Separate durable decisions add an independently protected surface. Active setup recovery replacement/abandonment cannot implicitly resolve/erase decisions; future recovery must coordinate source/decision consistency, desired conditions and user authority explicitly.

## 98. PlanDecision Necessity Confirmation

Placement, omission, exact duration, exact priority and conflict acceptance continue to pass: should endure, are occurrence/conflict-local, and are not correct source edits. Recovery substitution may eventually pass but is blocked until meaning is defined.

## 99. Readiness Matrix

| Fix Type | PlanDecision Needed? | Semantics Sufficiently Defined? | Additional Product Decision Needed? | Durable Identity Required? |
| --- | ---: | ---: | ---: | ---: |
| moveBlock | yes | yes: exact hard placement | no before semantics implementation | yes |
| skipBlock | yes | yes: hard omission | no | yes |
| reduceDuration | yes | yes: exact hard duration | no | yes |
| convertToRecovery | likely | no | yes: transformation/replacement meaning | yes |
| changePriority | yes | yes: exact soft priority | no | yes |
| acceptConflict | yes | yes: exact actionability waiver | conflict fingerprint implementation detail | yes for all targets |

## 100. `addResource` Determination

Unsupported, not generated, and excluded from PlanDecision readiness/schema. Its source/occurrence/resource authority requires a separate product task if activated.

## 101. Interim Preview Communication Recommendation

Do not wait for full PlanDecision. A dependency-independent bounded UI task should promptly relabel/describe current automatic actions as Preview-only Try behavior and warn that regeneration/reload resets them. Keep `Review fixed time` as authored handoff.

## 102. Source-Incarnation Next-Step Requirements

Task 2.24 must establish lifetime tokens/reference composition for:

- template + recurrence occurrence lineage;
- manual-event lifetime;
- shift-definition + cycle + nested segment/sequence-entry work lineage;
- every member of conflict target sets;
- delete/recreate and profile/backup restore semantics;
- window-invariant occurrence coordinate/slot;
- comparison/revalidation and unsupported historical reference behavior;
- whether V2 identity or separate durable reference is canonical.

It must not implement PlanDecision persistence until format governance follows.

## 103. Target Authority Model

```text
Reusable authored setup + active authored PlanDecisionSet
                ↓
resolve lifetimes and applicability
                ↓
pre-placement occurrence outcomes
                ↓
deterministic placement (hard decision constraints included)
                ↓
factual friction + conflict-acceptance annotation
                ↓
Preview + decision application report + SuggestedFixes

Try    → disposable Preview revision
Accept → Author/replace PlanDecision → regenerate
```

## 104. Behavioral Invariants

1. SuggestedFix is always derived recommendation information.
2. PlanDecision is separate authored authority and never changes category.
3. Scope is occurrence/conflict, never silently source-wide.
4. Semantic accepted outcome is stored, not transient command mechanics.
5. Equivalent authority/evidence/inputs produce equivalent Preview and replay report.
6. Every applicable decision is applied or observably not applied with reason.
7. Decisions are never silently misapplied, reinterpreted, ignored or deleted.
8. Durable references require source-incarnation safety; runtime IDs/V1 alone are prohibited.
9. Provenance distinguishes source, recommendation, user decision and derived outcome.
10. Decisions remain distinct from execution/history.
11. Replace/remove is sufficient minimum undo.
12. Profiles and V1 backups do not silently capture decisions.
13. Fresh Preview/decision-set revision is required for recommendation acceptance.
14. Current revision remains ephemeral Try.
15. Conflict acceptance changes actionability, not conflict fact.
16. Durable persistence waits for incarnation, validation, versioning and recovery governance.

## 105. Required Future Test Contract

Future direct tests must cover:

- exact hard placement and infeasible unresolved friction;
- occurrence-only omission and omitted provenance;
- exact duration and source-duration revalidation;
- exact soft priority and source-priority revalidation;
- recovery substitution only after semantics are approved;
- exact conflict pair/kind/fingerprint, accepted visibility and changed-conflict staleness;
- deterministic same-input/set replay; overlapping/larger/smaller windows; dormant disappearance/reappearance;
- source deletion/recreation and every required incarnation component;
- same-dimension replacement, multi-dimension composition, omission precedence and order independence;
- applied/stale/unresolved/dormant/obsolete reporting and provenance explanations;
- SuggestedFix category separation; Try creates no decision; Accept authors one; stale acceptance rejected;
- no decision persistence before explicit durable authorization.

## 106. Architectural Alignment Assessment

| Principle | Assessment | Basis |
| --- | --- | --- |
| category stability | Aligned | recommendation derived, decision authored |
| Author/Derive separation | Aligned | creation versus consumption explicit |
| service exclusivity | Aligned target | dedicated Authoring Service required |
| engine coordination | Aligned target | Teach authors, Plan derives |
| determinism | Aligned target | semantic unordered set/canonical stages |
| provenance/explainability | Aligned target | mandatory chain/application report |
| historical immutability | Aligned | decision is planning, not execution |
| explicit user authority | Aligned | hard/soft outcomes explicit |
| epistemic integrity | Aligned | conflict fact retained; failure observable |
| durable governance | Partially aligned/deferred | no persistence before prerequisites |

## 107. Compatibility Assessment

No durable Preview decisions exist, so no migration is required. Profiles/backups contain no PlanDecision. V1 occurrence identity stays runtime-only. Future decision surface/reference/schema requires explicit versioning, ingress, recovery and compatibility governance; current readers remain unchanged in this investigation.

## 108. Test Coverage Assessment

**Confirmed current evidence:** fix targeting and application, deterministic gap placement, occurrence identity propagation/clone isolation, friction recomputation, stale enforcement, authored/persistence/profile/backup exclusion, fixed-time handoff, manual/work anchor behavior.

**Not found/future gaps:** any PlanDecision type/service/set, Author validation, semantic outcome replay, window replay, applicability statuses, incarnation collision protection, composition/replacement/removal, decision provenance, decision-aware friction/recommendations, persistence/ingress/recovery.

## 109. Open Questions

- Recovery substitution authoritative meaning and source/effective identity.
- Exact dependency-fingerprint representation and legal ranges.
- Canonical conflict-kind taxonomy and material equivalence details.
- Decision ID allocator and replacement mutation/new-ID mechanics.
- V2 identity versus separate DurableOccurrenceReference.
- Active decision surface key/envelope, atomic setup interactions and backup/export model.
- Retention/pruning/audit policy for past, obsolete and replaced decisions.
- Profile/backup/recovery replacement policy for existing decision authority.

## 110. Recommended Implementation / Investigation Sequence

1. Task 2.24: establish source incarnation and lifetime-safe occurrence/conflict reference semantics from Section 102.
2. Define/version durable PlanDecision surface, ingress/validation/recovery and compatibility policy—still before feature behavior.
3. Implement general PlanDecision domain model, Authoring Service, set validation/composition and application-report types without UI.
4. Implement decision-aware deterministic generation for ready kinds; keep recovery substitution excluded.
5. Add durability/store commands and explicit Try/Accept UI.
6. Separately define recovery substitution, profile/backup/recovery coordination and retention.

An interim Preview-only communication task may safely run before or alongside Step 1.

## 111. Recommended Next Task

**Task 2.24 — Establish Source-Incarnation and Lifetime-Safe Occurrence Reference Semantics.** It should be investigation-first and produce canonical durable reference requirements without implementing PlanDecision or persistence.

## 112. Deviations

The saved artifact differed only by a trailing newline; both hashes are recorded. No implementation or scope deviation.

## 113. Discoveries and Deferred Work

Current conflict acceptance needs multiple lifetime-safe references even though other decisions target template occurrences; this expands incarnation beyond template/recurrence to manual/work source graphs. Semantic outcome modeling eliminates replay ordering. Recovery substitution is the only current candidate not ready. Separate decision durability introduces cross-surface recovery/atomicity work. All implementation, UI copy, incarnation, V2 references, persistence, migration, history and governance remain deferred.

## 114. Validation

- Artifact hashes/immutability: confirmed above.
- Reference audit: covered all six candidate actions, conflicts, occurrence components, placement/friction behavior, active/profile/backup boundaries and required architecture.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Full suite: 26 files, 469 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed.
- Task-specific executable/test changes: none.
- Governance/checkpoint changes: none.
- Earlier cumulative Phase 2 changes were present before Task 2.23 and preserved.

## 115. Final Completion Determination

Task 2.23 is complete. PlanDecision now has an evidence-backed semantic contract for identity, scope, ready decision kinds, strength, composition, invalidation, replay, provenance, observability, persistence boundaries and concrete lifetime-reference prerequisites, with no unauthorized implementation.

**Task 2.23 is complete when DayFrame has an evidence-backed semantic contract for PlanDecision identity, scope, decision kinds, strength, composition, invalidation, replay, provenance, and planning authority; has produced concrete lifetime-safe reference requirements for subsequent source-incarnation work; and has made no unauthorized implementation change.**
