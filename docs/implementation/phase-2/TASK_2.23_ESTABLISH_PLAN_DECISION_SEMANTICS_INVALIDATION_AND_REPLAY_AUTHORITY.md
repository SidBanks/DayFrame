# Task 2.23 — Establish PlanDecision Semantics, Invalidation, and Replay Authority

**Project:** DayFrame  
**Phase:** Phase 2 — Authority and State Alignment  
**Task ID:** 2.23  
**Execution Type:** Investigation / Architectural Authority Decision  
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing the investigation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.23_ESTABLISH_PLAN_DECISION_SEMANTICS_INVALIDATION_AND_REPLAY_AUTHORITY_RESULT.md`

This task is investigation and architectural decision only.

Do not modify:

- production code;
- tests;
- `SuggestedFix`;
- Preview revision behavior;
- authored state;
- persistence;
- durable schemas;
- profile formats;
- backup formats;
- source IDs;
- source-incarnation behavior;
- `OccurrenceIdentity`;
- occurrence-identity version;
- engine behavior;
- UI;
- history/execution state;
- architectural governance documents;
- checkpoints.

No PlanDecision implementation is authorized by this task.

If evidence is insufficient to settle one aspect of PlanDecision semantics, classify it as unresolved and identify the prerequisite rather than inventing behavior.

---

# 2. Purpose

Task 2.22 established that `SuggestedFix` is advisory derived information.

It also established that six current occurrence/conflict-specific actions satisfy the PlanDecision necessity test if user acceptance is intended to survive Preview regeneration:

- `moveBlock`;
- `skipBlock`;
- `reduceDuration`;
- `convertToRecovery`;
- `changePriority`;
- `acceptConflict`.

These actions:

- target one generated occurrence or conflict;
- do not correctly map to source-wide template/recurrence mutation;
- currently mutate derived Preview only;
- disappear on regeneration and reload.

`changeFixedTime` does not require PlanDecision because it correctly routes the user to explicit source-level authored editing.

`addResource` remains unsupported and semantically unresolved. :contentReference[oaicite:1]{index=1}

Task 2.23 must now establish:

> What exactly is a PlanDecision, what authority does it carry, how is it applied deterministically, when does it become invalid or unresolved, and how do multiple decisions interact?

The task must produce enough semantic precision that a subsequent source-incarnation task can design lifetime-safe references against actual PlanDecision needs.

---

# 3. Core Architectural Question

Task 2.23 must answer:

> What authoritative information is created when a user accepts an occurrence- or conflict-specific planning recommendation, and what rules determine whether that information remains applicable during later deterministic regeneration?

The answer must distinguish:

    recommendation
        ≠
    decision
        ≠
    authored source pattern
        ≠
    derived schedule
        ≠
    historical execution

---

# 4. Governing Task 2.22 Decisions

Task 2.22 established:

1. `SuggestedFix` remains a derived Recommendation Proposal.
2. Acceptance does not mutate the SuggestedFix into authority.
3. Enduring acceptance is an `Author` transformation.
4. A durable/replayable accepted choice requires a separate Authored Named Domain Object.
5. The working concept is `PlanDecision`, though canonical naming remains open.
6. Direct source-wide authored mutation is incorrect for occurrence-local fixes.
7. `changeFixedTime` remains an authored-edit handoff.
8. Current Preview revisions remain legitimate ephemeral "Try" behavior.
9. A future authoritative "Accept" path must be distinct.
10. A temporary session-only PlanDecision model is rejected.
11. PlanDecision semantics must be established before source incarnation.
12. Source incarnation must be solved before durable PlanDecision persistence.
13. Equivalent authored inputs plus an effective decision set must produce an equivalent derived plan.
14. Decision replay must preserve provenance.
15. Planning decisions remain distinct from execution/history. :contentReference[oaicite:2]{index=2}

Task 2.23 must preserve these decisions.

---

# 5. Objective

Determine:

1. the canonical conceptual meaning of PlanDecision;
2. whether `PlanDecision` should become the canonical object name;
3. domain object category;
4. information transformation;
5. pillar ownership;
6. producer/service responsibility;
7. the minimum semantic fields a PlanDecision requires;
8. decision target semantics;
9. occurrence versus conflict decisions;
10. decision action/outcome semantics;
11. hard versus soft authority;
12. exact placement versus preference;
13. omission/skip semantics;
14. duration adjustment semantics;
15. category/substitution semantics;
16. priority semantics;
17. conflict-acceptance semantics;
18. decision applicability across Preview windows;
19. deterministic replay position in planning;
20. invalidation conditions;
21. stale/unresolved/obsolete decision states;
22. missing-occurrence behavior;
23. infeasible replay behavior;
24. interaction between multiple decisions;
25. replacement and removal semantics;
26. deterministic ordering requirements;
27. provenance requirements;
28. whether original SuggestedFix must be retained;
29. authored-lineage dependency requirements;
30. occurrence-identity requirements;
31. source-incarnation requirements;
32. decision persistence lifecycle requirements;
33. active/local profile/backup boundary implications;
34. minimum undo/removal semantics;
35. whether execution/history is required;
36. the next dependency-correct task.

---

# 6. Working Definition

Investigate and refine the following working definition:

> A PlanDecision is user-authored planning authority that records an occurrence- or conflict-specific choice about how DayFrame should derive a plan, without changing the underlying reusable authored source pattern.

Assess whether this definition correctly covers:

- move;
- skip;
- reduced duration;
- recovery substitution;
- changed priority;
- accepted conflict.

Do not force all actions into the object if one has materially different semantics.

---

# 7. Canonical Naming

Assess whether `PlanDecision` is the correct canonical architectural name.

Compare at least:

- `PlanDecision`;
- `OccurrenceDecision`;
- `PlanningDecision`;
- `OccurrenceOverride`;
- `PlanOverride`.

Criteria:

- authority clarity;
- occurrence specificity;
- conflict-decision support;
- compatibility with architectural terminology;
- distinction from source patterns;
- distinction from derived plan output.

Produce:

| Candidate Name | Authority Clarity | Occurrence Support | Conflict Support | Architectural Fit | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |

Do not rename anything in code.

---

# 8. Domain Object Category

Task 2.22 recommended that enduring accepted choices become a new **Authored Named Domain Object**.

Confirm against the canonical architecture.

Determine:

- exact Domain Object Category;
- whether one PlanDecision remains in that category throughout its lifetime;
- whether invalid/stale decisions remain authored objects rather than becoming derived objects.

Preserve category immutability.

---

# 9. Information Transformation

Task 2.22 classified acceptance as `Author`.

Confirm:

    user accepts planning recommendation
        ↓
    Author transformation
        ↓
    PlanDecision

The recommendation itself remains Derive output.

Do not classify the accepted decision as Derive merely because it originated from a SuggestedFix.

---

# 10. Pillar Ownership

Task 2.22 found architecture evidence suggesting Author transformations belong to Teach while Plan owns deterministic derivation.

Verify from the architecture specification.

Determine:

- which pillar owns creation of PlanDecision;
- which pillar consumes PlanDecision;
- whether this is an intentional cross-pillar information flow.

Do not assign ownership from naming alone.

---

# 11. Service Ownership

If PlanDecision is a Named Domain Object, an Architectural Service must produce it.

Determine the conceptual service responsibility.

Possible working concept:

`Plan Decision Authoring Service`

or equivalent.

Do not finalize implementation class/module names.

Determine only:

- producer responsibility;
- inputs;
- output;
- provenance obligation.

---

# 12. Engine Ownership

Determine which Architectural Engine should coordinate:

    recommendation
        ↓
    user acceptance
        ↓
    decision creation
        ↓
    plan regeneration

Do not implement or invent new engines without evidence.

If existing architecture does not name an appropriate engine, mark canonical engine ownership unresolved.

---

# 13. SuggestedFix Remains Advisory

Adopt as invariant:

> A SuggestedFix never changes category and never becomes a PlanDecision in place.

Acceptance may use SuggestedFix facts as input to authoring a new decision.

The PlanDecision must have its own identity and provenance.

---

# 14. Minimum PlanDecision Semantic Content

Determine the minimum semantic information required.

Candidate facts include:

- decision ID;
- decision kind;
- target occurrence reference;
- optional second/multiple occurrence reference for conflict decisions;
- source lineage/reference;
- selected outcome;
- decision strength;
- provenance;
- authored timestamp if semantically needed;
- originating SuggestedFix/recommendation facts;
- applicability/revalidation dependencies.

Do not turn this into a storage schema yet.

Classify each candidate as:

- required semantic fact;
- implementation metadata;
- optional provenance;
- not required.

---

# 15. Decision Identity

Determine whether PlanDecision itself needs a stable authored ID.

Likely yes if it can be:

- replaced;
- removed;
- persisted;
- referenced in explainability.

Assess ID scope and lifecycle conceptually.

Do not design allocator yet.

---

# 16. Target Reference

A PlanDecision must target authoritative semantic planning context.

Determine whether occurrence decisions require:

- `OccurrenceIdentity`;
- source reference plus recurrence scope;
- another richer reference.

Task 2.22 established V1 occurrence identity is session-adequate but not durable.

Document exact target-reference requirements without changing V1.

---

# 17. Conflict Target Reference

`acceptConflict` may reference a relationship rather than one occurrence.

Determine whether conflict decisions require:

- two occurrence identities;
- ordered pair;
- unordered set;
- conflict kind;
- friction identity;
- another semantic conflict reference.

Current friction IDs may be generation-local.

Do not assume they are durable enough.

---

# 18. Conflict Identity Semantics

Investigate whether:

    occurrence A
        conflicts with
    occurrence B

plus conflict kind is enough to define the accepted conflict semantically.

Determine whether order matters.

Examples:

- work versus flexible block;
- manual event versus flexible block;
- two flexible blocks.

Produce a recommended conceptual conflict-reference rule.

---

# 19. Decision Scope

Adopt or revise:

> A PlanDecision applies to one semantic occurrence or one semantic conflict, not automatically to every occurrence produced by the source.

This is central to avoiding accidental pattern mutation.

---

# 20. Generation-Window Independence

Task 2.22 recommended that a decision follow its semantic occurrence across:

- same Preview window;
- overlapping window;
- larger window;
- smaller window.

If occurrence is outside the current window:

- decision is dormant;
- not deleted;
- not considered failed merely because it is out of view.

Confirm.

---

# 21. Planning Horizon Semantics

Determine whether PlanDecision lifetime is:

- occurrence-based regardless of current Preview range;
- tied to some planning horizon;
- tied to date/range validity.

For dated occurrences, the occurrence itself may define the natural horizon.

Do not impose UI-window lifetime.

---

# 22. Decision Kind Inventory

Establish conceptual decision kinds corresponding to the six current automatic accepted actions.

Potential:

- placement;
- omission;
- duration adjustment;
- recovery substitution;
- priority adjustment;
- conflict acceptance.

Do not reuse current `SuggestedFixAction` blindly if authority semantics need richer names.

---

# 23. Placement Decision

For `moveBlock`, determine whether an enduring decision means:

## A. Exact placement

> Place this occurrence at this exact start/end.

## B. Preferred placement

> Prefer this occurrence near this selected time.

## C. Relative move instruction

> Move it later.

## D. Constraint

> Place after/before another occurrence.

Current derived action selects the first feasible gap.

Task 2.23 must decide what user acceptance should record.

This is one of the most important semantic questions.

---

# 24. Placement Strength

If exact placement is selected, determine whether it is:

- hard unless impossible;
- hard and capable of producing friction;
- soft and may be overridden by engine;
- another model.

A decision that silently moves elsewhere after regeneration may violate user intent.

Establish preferred rule.

---

# 25. Placement Infeasibility

If accepted exact placement is no longer feasible after authored changes:

possible outcomes include:

- retain decision as unresolved and surface friction;
- automatically choose another placement;
- discard decision;
- degrade to preference.

Assess.

Preferred bias should preserve explicit user authority rather than silently reinterpret it.

---

# 26. Skip / Omission Decision

For `skipBlock`, Task 2.22 established:

> enduring meaning is "omit this occurrence from this plan," not "delete the recurring commitment."

Determine whether omission is:

- hard;
- date/occurrence specific;
- dormant after occurrence falls in past;
- still retained for provenance.

Do not mutate recurrence.

---

# 27. Reduce-Duration Decision

Current Preview action subtracts 30 minutes with a 15-minute minimum.

That implementation detail may not represent durable user authority.

Determine whether an accepted decision should record:

- exact resulting duration;
- reduction amount;
- minimum duration preference;
- another semantic outcome.

Preferred consideration:

> record what the user accepted, not merely the algorithmic command used to reach it.

Assess.

---

# 28. Duration Invalidation

If source template duration later changes:

Example:

    original template 60m
    decision accepted 30m
    template later becomes 45m

Should the decision remain:

- exact 30m;
- "reduce by 30m" → 15m;
- stale/unresolved;
- invalidated?

Task 2.23 must decide or identify prerequisite semantics.

---

# 29. Convert-To-Recovery Decision

Current action changes one occurrence/candidate:

- title;
- category.

Determine what authoritative meaning is actually intended.

Potential:

- substitute this occurrence's activity/category with recovery;
- mark this occurrence as recovery time;
- suppress source activity and create alternate recovery occurrence.

Current implementation may be too shallow to define durable semantics.

Investigate carefully.

If evidence is insufficient, classify this decision kind as semantically underdefined and identify follow-up.

---

# 30. Recovery Substitution Source Provenance

If conversion keeps the same occurrence identity but changes category/title, does the resulting planned block still represent:

- the original commitment transformed;
- a replacement commitment;
- an exception decision.

Determine explainability implications.

Do not infer historical/execution meaning.

---

# 31. Change-Priority Decision

Current Preview action increments priority, capped at 5.

Determine whether durable decision should record:

- exact effective priority;
- relative increment;
- "prioritize this occurrence over conflicts";
- another planning strength.

A relative increment may become nonsensical after source priority changes.

Assess exact-outcome versus relative-command semantics.

---

# 32. Priority Interaction With Source Priority

If source template priority later changes:

- does occurrence decision still override it?
- become stale?
- combine?

Define preferred semantics.

---

# 33. Accept-Conflict Decision

This is the clearest explicit acceptance action.

Determine exact meaning.

Candidate:

> For this specific conflict between these semantic occurrences, retain the plan despite the conflict and treat this friction as knowingly accepted.

Assess whether it:

- suppresses only presentation;
- allows otherwise invalid plan state;
- records conscious conflict tolerance;
- expires if conflict facts materially change.

---

# 34. Conflict-Acceptance Strength

Determine whether accepted conflict means:

- ignore this exact current conflict forever;
- accept conflict while both occurrences retain equivalent timing/meaning;
- accept conflict for this occurrence pair regardless of changed overlap severity;
- another model.

Likely requires semantic fingerprint/revalidation.

---

# 35. Conflict Changed After Authored Edit

If one occurrence moves or duration changes and a different overlap remains:

Is it:

- same accepted conflict;
- new conflict requiring new decision;
- decision stale/unresolved?

Establish rule or identify dependency.

---

# 36. Decision Outcome Versus Action Command

Adopt or reject:

> PlanDecision should record the accepted semantic outcome, not merely the procedural SuggestedFix command that produced it.

Examples:

- exact placement instead of "moveBlock";
- exact duration instead of "reduceDuration";
- exact effective priority instead of "changePriority".

This may improve deterministic replay and future compatibility.

Assess per decision kind.

---

# 37. Required Decision-Kind Matrix

Produce:

| Current Fix | Proposed Decision Kind | Target | Recorded Outcome | Authority Strength | Revalidation Need |
| --- | --- | --- | --- | --- | --- |
| moveBlock | | | | | |
| skipBlock | | | | | |
| reduceDuration | | | | | |
| convertToRecovery | | | | | |
| changePriority | | | | | |
| acceptConflict | | | | | |

---

# 38. Hard Versus Soft Authority

Task 2.22 left strength unresolved.

Task 2.23 must establish whether decisions are:

- hard user choices;
- soft preferences;
- mixed by kind.

A single generic strength may be insufficient.

For each decision kind decide:

- hard;
- soft;
- unresolved.

---

# 39. Decision Application Position

Determine where PlanDecision logically enters deterministic planning.

Potential phases:

## A. Before candidate placement

Useful for omission, priority, duration/category changes.

## B. During placement

Useful for exact placement.

## C. After placement

Similar to current Preview revision but risks non-reproducibility.

## D. Multi-stage consumption by decision kind.

Assess.

Do not redesign engine implementation, but establish semantic ordering.

---

# 40. Decision-Aware Generation Contract

Target conceptual architecture should support:

    authored source setup
        +
    effective PlanDecision set
        ↓
    deterministic generation
        ↓
    derived plan

rather than:

    generate plan
        ↓
    mutate result imperatively from hidden past clicks

Confirm.

---

# 41. Pre-Placement Decisions

Determine which kinds logically affect candidate construction/placement inputs:

- skip;
- duration;
- category/recovery;
- priority.

If they should alter candidate semantics before placement, say so.

---

# 42. Placement Decisions

Determine how exact placement should enter the planner.

Possible:

- anchored placement requirement;
- prioritized candidate;
- constrained candidate.

Establish semantic requirement rather than function call.

---

# 43. Conflict Acceptance Application

`acceptConflict` may logically apply after plan derivation/friction detection.

Determine whether PlanDecision set may be consumed at more than one planning stage.

If yes, deterministic ordering must be explicit.

---

# 44. Decision Consumption Order

If different decision kinds affect different planning stages, establish a canonical conceptual order.

Potential:

    resolve applicable decisions
        ↓
    apply occurrence semantic overrides
        ↓
    candidate generation
        ↓
    placement constraints / exact placements
        ↓
    friction detection
        ↓
    apply conflict-acceptance decisions
        ↓
    final friction / recommendations

Do not adopt this exact order unless supported.

Produce a recommended ordering.

---

# 45. Determinism Requirement

Adopt:

> Equivalent authored authority, equivalent effective PlanDecision set, equivalent historical evidence, and equivalent generation parameters must produce equivalent derived planning output.

Decision replay must not depend on insertion order unless ordering is itself explicit authoritative data.

---

# 46. Decision Ordering

Determine whether the effective decision set needs an order at all.

Possibilities:

## Unordered keyed set

Each semantic target has at most one effective decision per decision dimension.

## Ordered list

Replay order matters.

Preferred architecture may avoid order-dependent commands by storing semantic outcomes.

Assess.

---

# 47. Decision Dimensions

A single occurrence could potentially have:

- placement decision;
- omission decision;
- duration decision;
- priority decision;
- category decision.

Determine whether these:

- compose as separate decisions;
- are represented by one consolidated decision record;
- conflict mutually.

This is central to replacement/composition semantics.

---

# 48. One Object Per Choice Versus One Object Per Occurrence

Compare:

## Model A — One PlanDecision per action/dimension

Example:
- duration decision;
- placement decision.

## Model B — One PlanDecision per occurrence containing multiple chosen fields

## Model C — Another model.

Produce:

| Model | Composition Clarity | Replacement | Provenance | Persistence Simplicity | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |

---

# 49. Omission Precedence

If an occurrence has:

- omission decision;
- placement decision;
- duration decision.

Determine whether omission dominates.

Likely:

> omitted occurrence does not consume placement/duration decisions while omission remains effective.

Do dormant subordinate decisions remain or become invalid?

Assess.

---

# 50. Decision Conflict Policy

Define at least conceptual conflicts:

- two different placement decisions for same occurrence;
- two different duration decisions;
- omission plus conversion;
- conflicting conflict-acceptance states.

Determine whether authoring a new decision:

- replaces previous same-dimension decision;
- creates explicit conflict;
- is rejected.

Preferred simplicity may be replacement within semantic dimension.

Assess.

---

# 51. Decision Replacement

If user later accepts a different placement for the same occurrence:

Is that:

- new decision replacing prior;
- mutation of existing decision;
- second decision with latest effective value?

Architecture favors immutable category but does not necessarily require immutable authored objects.

Determine conceptual operation.

---

# 52. Decision Removal

Minimum undo semantics from Task 2.22:

> remove the effective decision and regenerate without it.

Determine whether removal means:

- delete authoritative PlanDecision;
- mark inactive;
- create reversal decision.

Prefer simplest current-authority model unless history requirements demand otherwise.

---

# 53. Undo History

Confirm that a full undo/history log is not required.

If decision removal is enough for present planning authority, state so.

Historical audit may be separate later.

---

# 54. Decision Lifecycle States

Determine whether PlanDecision itself needs explicit runtime semantic states such as:

- active/effective;
- dormant;
- stale;
- unresolved;
- invalid;
- superseded.

Avoid unnecessary states.

At minimum, later regeneration must distinguish applicable from non-applicable authority.

---

# 55. Dormant Decision

Candidate meaning:

> Target occurrence is outside current generation window but may exist in another window.

Decision remains valid but not consumed.

Assess/adopt.

---

# 56. Stale Decision

Candidate meaning:

> Target/source still exists, but authored dependencies changed enough that previous accepted outcome must be revalidated before application.

Determine whether "stale" is the right concept.

---

# 57. Unresolved Decision

Candidate meaning:

> Decision remains authored authority, but planner cannot currently satisfy or interpret it safely.

Examples:

- exact placement no longer feasible;
- conflict structure materially changed.

Assess.

---

# 58. Invalid / Obsolete Decision

Candidate cases:

- source incarnation no longer matches;
- occurrence can no longer exist;
- target was explicitly deleted/replaced.

Should decision:

- remain preserved but inactive;
- be automatically removed;
- require user cleanup?

Task 2.22 preferred observable non-silent handling.

Determine.

---

# 59. Missing Occurrence

If target occurrence does not generate in a given window:

## Outside window

Dormant.

## Removed due to authored source change

Potentially stale/obsolete.

## Temporarily not generated due to current range/conditions

May be dormant.

Establish distinction.

---

# 60. Source Deleted

If source is deleted:

- decision must not attach to future reused ID;
- this is a source-incarnation requirement;
- until lifetime-safe identity exists, durable replay is unsafe.

Conceptually determine whether decision becomes orphaned/obsolete rather than automatically deleted.

---

# 61. Source Recreated

A new source using the same visible/source ID must not inherit old decision.

This becomes a hard requirement for Task 2.24 source-incarnation design.

Record exactly which PlanDecision references require incarnation.

---

# 62. Source Edited

Not every source edit should invalidate every decision.

Determine dependency categories.

Examples:

## Placement decision dependencies

- occurrence date;
- duration;
- day boundary;
- conflicting anchors;
- eligible windows.

## Duration decision dependencies

- source duration;
- occurrence existence.

## Priority decision dependencies

- source priority semantics.

Develop a dependency matrix.

---

# 63. Required Invalidation Matrix

Produce at least:

| Decision Kind | Source Deleted | Recurrence Changed | Duration Changed | Day Boundary Changed | Window Changed | Conflict Counterpart Changed |
| --- | --- | --- | --- | --- | --- | --- |
| placement | | | | | | |
| omission | | | | | | |
| duration | | | | | | |
| recovery substitution | | | | | | |
| priority | | | | | | |
| conflict acceptance | | | | | | |

Use classifications such as:

- remains valid;
- revalidate;
- dormant;
- obsolete;
- unresolved.

---

# 64. Authored Revision Dependency

Determine whether a global authored-state revision number is required.

Alternative:

- semantic dependencies can be revalidated directly from current source/occurrence facts.

Compare.

A global revision may mark too many decisions stale unnecessarily.

Do not introduce it without evidence.

---

# 65. Semantic Fingerprint

Assess whether future PlanDecision requires a fingerprint of relevant source/occurrence facts when authored.

Possible facts:

- source incarnation;
- recurrence scope;
- occurrence date;
- duration;
- placement context.

Do not design hash format.

Determine whether semantic comparison is required.

---

# 66. Decision Revalidation Authority

Which layer determines whether existing PlanDecision remains applicable?

Likely planning/domain service.

UI must not decide.

Determine conceptual owner.

---

# 67. Silent Misapplication Prohibition

Adopt:

> A PlanDecision must never silently apply to a semantically different occurrence merely because identifiers happen to match.

This drives source incarnation and revalidation.

---

# 68. Silent Deletion Prohibition

Assess:

> A PlanDecision that becomes unresolved should not be silently deleted merely because current derivation cannot apply it.

This supports user authority and explainability.

Adopt/revise.

---

# 69. Infeasible Exact Placement

If exact placement is hard authority but cannot be satisfied:

Preferred behavior may be:

- keep decision;
- produce friction/unresolved state;
- do not silently place elsewhere.

Determine.

This is important to deterministic planning and user trust.

---

# 70. Infeasible Duration / Priority

If a chosen duration/priority becomes outside future legal constraints:

- decision unresolved;
- clamp silently;
- invalidate.

Do not silently reinterpret unless semantics explicitly allow it.

---

# 71. Conflict Acceptance Revalidation

A conflict acceptance should likely apply only if the same semantic conflict still exists.

Determine required equality:

- same occurrence identities;
- same conflict kind;
- perhaps same overlap relationship.

If materially different, require new acceptance.

---

# 72. Decision Provenance

Determine minimum provenance needed to explain:

> Why is this occurrence placed/skipped/changed this way?

Candidate chain:

    authored source
        ↓
    generated semantic occurrence
        ↓
    friction/recommendation
        ↓
    user-authored PlanDecision
        ↓
    derived plan outcome

Determine required retained facts.

---

# 73. SuggestedFix Provenance Retention

Does PlanDecision need:

- original SuggestedFix ID;
- action kind;
- label;
- friction ID;
- rationale;
- generator/service information?

Task 2.22 found SuggestedFix itself lacks durable provenance.

Determine whether decision should retain:

## Full recommendation reference

or:

## Minimal recommendation-derived provenance facts.

Do not persist presentation labels as semantic authority unless justified.

---

# 74. Recommendation May Not Exist Later

A PlanDecision should not require the original SuggestedFix object to still exist during replay.

Confirm.

Otherwise regeneration could not replay decisions independently.

---

# 75. User-Authored Provenance

At minimum, decision provenance should establish that the outcome was:

- explicitly user accepted;
- not automatically generated authority.

Determine whether timestamp is semantically required or only audit metadata.

---

# 76. Producer Provenance

Architecture requires sufficient provenance to reconstruct producing service/engine transformations.

Determine what PlanDecision creation must record conceptually.

No schema yet.

---

# 77. Explainability Contract

A future derived block should be explainable as:

> Generated from template X / recurrence Y for occurrence Z; this occurrence's placement/duration/etc. was constrained by user PlanDecision D.

For conflict acceptance:

> Conflict remains visible/accepted because user PlanDecision D accepted this semantic conflict.

Adopt or refine.

---

# 78. Current Suggested-Fix Action IDs

Current fixes target runtime/block IDs indirectly.

Determine explicitly that PlanDecision cannot rely on those presentation/runtime IDs durably.

This is already implied by Task 2.10/2.22.

Record as hard requirement.

---

# 79. OccurrenceIdentity Requirements

For each decision kind identify occurrence references required:

| Decision Kind | Primary Occurrence | Secondary Occurrence | Conflict Kind | Source Incarnation Needed |
| --- | ---: | ---: | ---: | ---: |
| placement | | | | |
| omission | | | | |
| duration | | | | |
| recovery substitution | | | | |
| priority | | | | |
| conflict acceptance | | | | |

---

# 80. Source Incarnation Requirements

Task 2.23 must produce concrete requirements for Task 2.24.

At minimum determine whether incarnation is needed for:

- template ID;
- recurrence ID;
- manual-event ID;
- shift/cycle/work source identity;
- nested segment/sequence identity;
- conflict counterpart references.

Do not implement tokens.

---

# 81. Work/Manual Counterpart Identity

Even though current automatic decisions target flexible template occurrences, `acceptConflict` can involve:

- work;
- manual event.

Therefore durable conflict decisions may require lifetime-safe identities for those counterpart sources too.

This must influence source-incarnation scope.

---

# 82. Work Occurrence Incarnation

Task 2.10 work identity uses:

- cycle ID;
- segment/sequence entry ID;
- shift definition ID;
- local start date.

Determine which source lifetimes must be protected from reuse for durable conflict decisions.

---

# 83. Manual Event Incarnation

Manual event V1 identity uses authored manual-event ID.

If manual event is deleted/recreated with same ID, old conflict decision must not attach.

Therefore incarnation likely applies.

Confirm.

---

# 84. Template/Recurrence Incarnation

Template occurrence identity includes template and recurrence IDs.

Determine whether both require lifetime incarnation or whether one owning source incarnation can sufficiently identify occurrence lineage.

This is a key requirement for Task 2.24.

---

# 85. Nested Shift Incarnation

For work occurrence, assess whether cycle incarnation alone is enough, or nested segment/sequence/shift-definition lifetimes also matter.

Example:

- same cycle retained;
- segment deleted/recreated under same nested ID.

Would an old work occurrence identity collide?

Task 2.23 should state the semantic requirement even if implementation design is deferred.

---

# 86. Decision Persistence Goal

Task 2.22 recommended eventual durable PlanDecision after source incarnation.

Confirm intended lifecycle:

- survives regeneration;
- survives restart;
- remains active planning authority until removed/invalidated.

This does not mean persistence must be implemented immediately after semantics.

---

# 87. Profiles

Task 2.22 recommended not silently adding PlanDecision to current reusable setup profiles.

Task 2.23 must refine:

> Are PlanDecisions active-plan state rather than reusable setup-pattern state?

If yes:

- existing profiles remain setup only;
- future plan snapshot is separate product concept if needed.

Adopt/revise.

---

# 88. Backup

Current backup format contains authored setup only.

Determine whether future PlanDecision durability should eventually be included in:

- normal DayFrame backup;
- separate active-plan export;
- another format.

Do not decide format version yet unless semantics make one clearly necessary.

At minimum state that V1 backup cannot silently grow new decision semantics.

---

# 89. Active Durable Surface

Assess whether PlanDecision logically belongs:

## A. inside active authored local payload;

## B. separate active plan-decision durable surface;

## C. another future plan artifact.

Compare conceptually:

| Surface Model | Authority Clarity | Independent Versioning | Recovery Complexity | Profile Separation | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |

Do not implement.

---

# 90. Durability Semantics

If PlanDecision becomes durable user data, Phase 1 durability principles apply.

Determine whether decisions require:

- session-first authority after valid Author action;
- observable durability status;
- retry;
- recovery.

Do not design APIs yet.

Record obligation.

---

# 91. Decision Creation Persistence Failure

Future conceptual behavior likely mirrors valid authored-state mutations:

    valid PlanDecision authored
        ↓
    becomes session authority
        ↓
    persistence may succeed/fail separately

Assess whether this is consistent.

If decisions live on separate surface, durability ownership may be separate.

---

# 92. Decision Deletion Persistence Failure

Similarly removing a decision is authoritative session intent whose durable removal may fail.

Record future requirement.

---

# 93. Historical Ingress

Future persisted PlanDecisions introduce historical-ingress requirements analogous to authored setup:

- structural validation;
- semantic validation;
- source-incarnation compatibility;
- recovery.

Identify without designing now.

---

# 94. Decision Versioning

Determine whether PlanDecision itself likely requires a versioned durable schema independent of OccurrenceIdentity version.

Do not assign version numbers.

Record architectural need.

---

# 95. OccurrenceIdentity Evolution

Task 2.24 may need to evolve occurrence reference semantics.

Determine whether:

- `OccurrenceIdentity` V2;
- separate durable occurrence reference;
- source-incarnation-enriched identity

should be considered.

Do not choose implementation prematurely unless semantics clearly prefer one.

---

# 96. Session Preview "Try" Model

Preserve current Preview revision as ephemeral Try.

Determine relationship:

    SuggestedFix
        ↓
    Try
        → reviseSchedulePreview
        → disposable derived state

    Accept
        → Author PlanDecision
        → regenerate decision-aware plan

This is the target conceptual split unless Task 2.23 evidence contradicts it.

---

# 97. Accept From Tried Preview

If user first tries a suggestion and then accepts it:

Should decision record:

- the original recommendation outcome;
- current revised Preview outcome;
- explicit user-selected adjusted outcome?

Not yet implemented, but semantics may matter.

If current Try is deterministic from SuggestedFix, original accepted outcome may suffice.

Assess.

---

# 98. Accept Without Try

Future UX may allow direct Accept from suggestion.

PlanDecision semantics should not depend on a Preview mutation having occurred first.

Confirm.

---

# 99. Accepting Custom User Placement

Long-term user may move an occurrence manually rather than accept generated suggestion.

Determine whether PlanDecision should be general enough to represent user-authored occurrence choice independent of SuggestedFix provenance.

This is an important scope question.

If yes, PlanDecision is broader than "accepted SuggestedFix."

Assess.

---

# 100. Recommendation-Origin Optionality

If PlanDecision can be created directly by user editing of a generated occurrence:

- recommendation provenance becomes optional;
- user-authoring provenance remains required.

Determine whether architecture should design PlanDecision generically now.

---

# 101. PlanDecision Generality

Compare:

## Model A — SuggestedFixAcceptanceDecision

Only created from recommendations.

## Model B — General PlanDecision

Represents any explicit occurrence/conflict-level planning choice.

Task 2.22 terminology favors general PlanDecision.

Produce a recommendation.

---

# 102. Manual Plan Editing Future

The preferred DayFrame UX mental model includes Planner → Review Schedule / Edit Commitment / Resolve Friction.

A general PlanDecision could eventually support direct plan adjustments.

Assess whether keeping the object general avoids future duplicate authority models.

Do not implement UI.

---

# 103. PlanDecision Versus Commitment Edit

Maintain distinction:

## Edit Commitment

Changes reusable/source authored intent.

## PlanDecision

Changes one plan occurrence/conflict without rewriting the source pattern.

This should become a core authority boundary if adopted.

---

# 104. Decision Expiration

Dated occurrence decisions naturally become historical after the occurrence date passes, but they are not execution records.

Determine whether they:

- remain as past planning records;
- are pruned;
- move to history;
- become inactive.

Task 2.23 may defer retention policy, but should separate applicability from retention.

---

# 105. Historical Planning Versus Execution History

A past PlanDecision records what was planned, not what actually happened.

Execution/history must remain separate.

Confirm.

---

# 106. Learn/History Boundary

Future Learn analysis may compare:

- planned decision;
- actual execution.

Do not make PlanDecision historical observation.

Record conceptual separation.

---

# 107. Decision Retention Policy

Is retention duration required before initial implementation?

Probably not if active planner only needs current/future decisions.

Assess whether pruning could break explainability/backups.

Classify as:

- prerequisite;
- later governance.

---

# 108. Decision Removal After Occurrence Passes

Do not automatically delete merely because occurrence date passed unless retention semantics explicitly permit.

Historical planning provenance may matter later.

Mark deferred if needed.

---

# 109. Decision Replay Failure Surface

A decision-aware generator needs a result for decisions that cannot be honored.

Determine whether output should include:

- `appliedDecisions`;
- `unresolvedDecisions`;
- `dormantDecisions`;
- `obsoleteDecisions`.

Do not define final API, but establish information that must remain observable.

---

# 110. Explainable Replay Result

The planner should not silently ignore an authoritative decision.

Adopt:

> Every in-scope effective PlanDecision must be either applied or explicitly classified as not applied with a reason.

This is a strong epistemic invariant.

Assess.

---

# 111. Decision Application Provenance In Preview

Future Preview should make it possible to know whether a block property came from:

- source;
- automatic placement;
- PlanDecision.

Determine whether Preview result requires decision provenance references.

No implementation.

---

# 112. Conflict Acceptance Visibility

Even if conflict is accepted, should friction disappear completely?

Current Preview marks it ignored/resolved.

Future explainability may require:

- conflict remains visible as accepted;
- excluded from actionable friction count;
- another representation.

Task 2.23 should determine conceptual requirement.

---

# 113. Accepted Conflict Is Still Reality

Potential invariant:

> Accepting a conflict changes its actionability, not the underlying fact that the two occurrences conflict.

This aligns with epistemic integrity.

Assess/adopt.

If adopted, future derived model should preserve conflict fact + accepted decision rather than deleting friction evidence.

---

# 114. Skip And Candidate Provenance

A skipped occurrence may not appear as scheduled.

Future derived plan must still be explainable:

> occurrence was generated but intentionally omitted by decision.

Determine whether omission should remain represented in derived outputs.

---

# 115. Duration/Category/Priority Provenance

Future scheduled block should preserve both:

- source/default value;
- effective value;
- decision provenance,

or enough information to explain the transformation.

Determine minimum semantic requirement.

---

# 116. Decision-Aware Friction

PlanDecisions may themselves create friction.

Example:

- exact user placement conflicts with work.

Planner must not silently override the decision.

Likely friction should explain:

- user decision cannot be satisfied;
- conflict with anchor.

Record.

---

# 117. Decision Versus Recommendation Generation

Suggested-fix generator should account for effective decisions so it does not repeatedly recommend undoing accepted authority unless the decision is unresolved.

Determine conceptual requirement.

---

# 118. Accepted Decision Recommendation Suppression

If user has an active omission decision, generator should not repeatedly suggest moving the omitted occurrence.

Likewise accepted conflict should not repeatedly surface identical unresolved action.

Record as future behavior.

---

# 119. Decision Revision

If user changes their mind:

- author replacement decision;
- remove old decision;
- another command.

Determine minimal authoritative operation.

Likely replace/remove effective decision.

---

# 120. Decision Authoring Validation

Future creation must validate:

- target occurrence exists in current fresh plan;
- reference is unambiguous;
- selected outcome is legal;
- decision set remains structurally coherent.

Store/service enforcement analogous to authored snapshot validation may be needed.

Identify requirement.

---

# 121. Fresh Preview Requirement

Task 2.5 freshness remains required for accepting a recommendation into a decision.

Adopt:

> A SuggestedFix can produce a PlanDecision only when derived from a fresh Preview corresponding to current authored authority and effective decision set.

Future stale decision acceptance must be rejected.

---

# 122. Decision-Aware Freshness

Once PlanDecisions themselves affect Preview, changing decision authority must also stale/regenerate Preview.

Determine future invalidation ownership.

Likely store/plan authority.

No implementation.

---

# 123. Decision Set Authority

Determine whether PlanDecision collection becomes a new authoritative state class distinct from `DayFrameAuthoredSetup`.

Task 2.22 suggests yes.

Conceptual state classes may become:

    reusable authored setup
    active PlanDecision authority
    saved profiles
    derived Preview

Assess.

---

# 124. DayFrameState Implications

If PlanDecisions become current active authority, should they eventually live inside the mixed `DayFrameState` aggregate?

Task 2.1 deferred explicit state decomposition.

Task 2.23 should identify implications but not restructure types.

---

# 125. Authoritative Input To Preview

Future regeneration truth may become:

    DayFrameAuthoredSetup
        +
    PlanDecisionSet
        +
    generation request
        ↓
    Preview

Record this as likely target if PlanDecision is adopted.

---

# 126. Profiles Remain Reusable Setup

If PlanDecisions are separate active-plan authority, reaffirm:

- profiles remain reusable setup snapshots;
- loading profile may invalidate/revalidate active PlanDecisions;
- they are not silently replaced or bundled.

This future replacement semantic must be addressed later.

---

# 127. Profile Load And Existing Decisions

When active setup is replaced by profile:

What happens to current PlanDecision set?

Possible:

- revalidate against new source incarnations;
- keep unresolved/orphaned;
- clear explicitly.

Do not decide casually.

At minimum identify this as a required future replacement-semantics task.

---

# 128. Backup Import And Decisions

Equivalent.

Future backup semantics must determine whether:

- setup-only import leaves decisions;
- invalidates them;
- import envelope includes decisions.

Task 2.23 may defer exact behavior but must flag it.

---

# 129. Clear And Decisions

Future `clearLocalData()` would need explicit PlanDecision handling.

Likely clear active decision surface too.

Do not implement.

---

# 130. Recovery And Decisions

Active-local recovery replacement/abandonment may affect decision authority.

Once decisions exist durably:

- replacement from current session may need to persist decisions too;
- abandonment may need to remove them;
- protected historical ingress gets more complex.

Record future recovery implications.

---

# 131. Durable Governance Implication

Because durable decisions will be user data, Phase 1 durable-data compatibility policy applies.

Before persistence is enabled:

- surface/version must be governed;
- migration/recovery behavior defined;
- unsupported format behavior explicit.

Do not implement.

---

# 132. PlanDecision Necessity Confirmation

Apply Task 2.22 necessity test again after semantics analysis.

For each current fix determine whether it still justifies PlanDecision.

If any should instead remain permanently ephemeral, revise classification with evidence.

---

# 133. `convertToRecovery` Challenge

This action may reveal that not every current Preview action has sufficiently defined product meaning to become a durable decision.

If so, do not weaken the whole PlanDecision model.

Instead classify:

- PlanDecision-ready;
- requires action-semantic definition first;
- permanently ephemeral.

This is allowed.

---

# 134. `changePriority` Challenge

Same concern.

If current "increment priority" is algorithmic convenience rather than meaningful user intent, durable PlanDecision should not simply freeze that implementation detail.

Investigate.

---

# 135. Required Readiness Matrix

Produce:

| Fix Type | PlanDecision Needed? | Semantics Sufficiently Defined? | Additional Product Decision Needed? | Durable Identity Required? |
| --- | ---: | ---: | ---: | ---: |
| moveBlock | | | | |
| skipBlock | | | | |
| reduceDuration | | | | |
| convertToRecovery | | | | |
| changePriority | | | | |
| acceptConflict | | | | |

---

# 136. `addResource`

Keep unresolved unless executable/product semantics exist.

Do not include it in PlanDecision schema just because the union contains it.

---

# 137. Current UI Interim State

Current automatic fix buttons remain ephemeral Preview Try actions even if wording has not yet been clarified.

Task 2.23 should determine whether interim communication should happen before PlanDecision implementation.

Likely yes.

If so, recommend a bounded communication task if it is dependency-independent.

---

# 138. Interim Communication Sequencing

Compare:

## A. Immediately clarify Preview-only/Try language.

## B. Wait until final Try/Accept workflow exists.

Because current language is misleading but behavior safe, either may be reasonable.

Recommend.

---

# 139. Source Incarnation Next

Task 2.22 recommended semantics before incarnation.

Task 2.23 must produce concrete source-incarnation requirements sufficient to draft Task 2.24.

Do not merely say "incarnation needed."

Specify which identities/lifetimes PlanDecision targets require.

---

# 140. Candidate Task 2.24

Likely:

> **Task 2.24 — Establish Source-Incarnation and Lifetime-Safe Occurrence Reference Semantics**

This should remain investigation-first unless Task 2.23 yields implementation-ready requirements.

Determine exact next seam.

---

# 141. Potential PlanDecision Follow-Up Before Incarnation

If substantial PlanDecision questions remain unresolved after 2.23, do not proceed to incarnation prematurely.

Possible focused tasks:

- conflict identity semantics;
- recovery-substitution semantics;
- decision strength semantics.

Task 2.23 decides.

---

# 142. Required Authority Model

Produce one concise target model such as:

    reusable authored sources
        +
    active user-authored PlanDecision set
        ↓
    deterministic decision-aware planning
        ↓
    derived Preview
        ↓
    SuggestedFix recommendations
        ↓
    Try
        → derived experiment

    Accept
        → Author/replace PlanDecision
        → regenerate

Refine from evidence.

---

# 143. Behavioral Invariants

Evaluate and adopt evidence-supported invariants.

Candidate invariants:

1. `SuggestedFix` is always derived recommendation information.
2. PlanDecision is separate authored planning authority.
3. PlanDecision applies to occurrence/conflict scope, not source pattern unless explicitly modeled otherwise.
4. PlanDecision records semantic accepted outcome rather than transient command mechanics.
5. Equivalent authored setup + effective PlanDecision set + equivalent generation inputs produce equivalent Preview.
6. An applicable PlanDecision is never silently ignored.
7. A PlanDecision that cannot be honored becomes observable as dormant/stale/unresolved/obsolete according to explicit rules.
8. One-occurrence decisions never silently broaden to recurrence-wide mutation.
9. Durable PlanDecision references require source-incarnation safety.
10. Runtime/block IDs are not durable PlanDecision references.
11. Decision provenance remains distinguishable from generated recommendation provenance.
12. Planning decisions remain distinct from historical execution.
13. Removing/replacing effective decision is sufficient minimum undo.
14. Profile snapshots do not silently capture active PlanDecisions.
15. V1 backups do not silently gain PlanDecision data.
16. Fresh Preview is required when authoring a decision from SuggestedFix.
17. Current Preview revision remains ephemeral Try behavior.
18. Conflict acceptance changes actionability, not underlying conflict truth, if supported by evidence.
19. Durable persistence is not authorized until incarnation and durable compatibility are established.

---

# 144. Required Matrices

The result must include all of the following:

1. canonical-name matrix;
2. decision-kind matrix;
3. hard/soft authority matrix;
4. one-object-per-choice versus one-object-per-occurrence matrix;
5. invalidation matrix;
6. occurrence-reference matrix;
7. source-incarnation requirement matrix;
8. persistence-surface matrix;
9. PlanDecision readiness matrix;
10. Try versus Accept authority matrix.

---

# 145. Required Future Test Contract

Do not add tests.

Specify future tests for at least:

## Decision semantics

- placement exactness/strength;
- omission occurrence-only scope;
- exact duration outcome;
- category/recovery substitution;
- exact priority outcome;
- conflict acceptance semantics.

## Replay

- same authored inputs + decisions reproduce plan;
- overlapping Preview windows;
- decision dormant outside window;
- decision reappears when occurrence returns.

## Invalidation

- source deletion;
- source recreation;
- recurrence change;
- duration change;
- day-boundary change;
- infeasible placement;
- changed conflict counterpart.

## Composition

- replacement of same-dimension decision;
- multiple dimensions on one occurrence;
- omission precedence;
- deterministic ordering.

## Provenance

- source → occurrence → decision → derived block explanation;
- accepted conflict remains explainable.

## Authority

- SuggestedFix never becomes decision in place;
- Try does not create decision;
- Accept creates decision;
- stale Preview cannot create decision.

## Persistence boundary

- no persistence until incarnation/durable task explicitly authorizes it.

---

# 146. Architectural Alignment Assessment

Assess target model against:

- Domain Object category stability;
- Author / Derive separation;
- Service exclusivity for Named Domain Object production;
- Engine workflow coordination;
- Deterministic planning;
- Information provenance;
- Explainability;
- Historical immutability;
- explicit authority;
- epistemic integrity;
- durable-data governance.

Use:

- Aligned;
- Partially aligned;
- Misaligned;
- Unresolved.

---

# 147. Compatibility Assessment

Confirm:

- no existing durable Preview revisions require migration;
- existing profiles/backups contain no PlanDecision;
- current V1 occurrence identity remains runtime-only;
- adding PlanDecision later will require explicit durable governance;
- current readers need not change during this investigation.

---

# 148. Test Coverage Assessment

Audit current tests for evidence relevant to PlanDecision semantics:

- fix targeting;
- identity preservation;
- stale enforcement;
- regeneration;
- conflict generation;
- placement determinism;
- profile/backup exclusion.

Identify what current behavior is proven and what future decision semantics currently lack coverage.

---

# 149. Evidence Classification

Material findings must use:

- **Confirmed**
- **Inferred**
- **Not found**
- **Unresolved**
- **Recommended**
- **Deferred**

Do not present proposed PlanDecision behavior as current executable fact.

---

# 150. Explicit Non-Goals

Task 2.23 shall not:

- add `PlanDecision` type;
- add decision state;
- add decision IDs;
- add decision persistence;
- change `DayFrameState`;
- change `DayFrameAuthoredSetup`;
- change `SuggestedFix`;
- change current Preview revision;
- change engine generation;
- change friction;
- change placement;
- add Try/Accept UI;
- change product copy;
- add source incarnation;
- alter authored IDs;
- alter `OccurrenceIdentity`;
- add occurrence V2;
- modify profiles;
- modify backups;
- add migration;
- add history;
- add execution tracking;
- update ADRs;
- update `CURRENT_STATE.md`;
- update `CHANGELOG.md`;
- create a checkpoint;
- perform unrelated cleanup.

Discovery does not authorize implementation.

---

# 151. Required Code And Architecture Inspection

At minimum inspect:

- Task 2.22 result;
- `SuggestedFix` and friction types;
- `generateSuggestedFixes`;
- `applySuggestedFix`;
- `reviseSchedulePreview`;
- occurrence identity definitions;
- occurrence-identity constructors;
- candidate/work/manual projection identity;
- placement engine;
- friction detector;
- store Preview revision path;
- authored validator;
- relevant profile/backup/active-state boundaries;
- current architecture specification sections covering:
  - Named Domain Objects;
  - Author;
  - Derive;
  - Teach;
  - Plan;
  - Services;
  - Engines;
  - Provenance;
  - Determinism;
  - Historical Immutability.

Use executable behavior as primary evidence for current semantics.

Use architecture as authority for future structural classification.

---

# 152. Required Result Artifact Structure

The Task 2.23 result must contain at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Governing Task 2.22 Decisions
5. PlanDecision Working Definition
6. Canonical Naming Assessment
7. Canonical Name Matrix
8. Domain Object Category
9. Information Transformation
10. Pillar Ownership
11. Service Ownership
12. Engine Ownership
13. SuggestedFix / PlanDecision Separation
14. Minimum Semantic Content
15. Decision Identity
16. Occurrence Target Semantics
17. Conflict Target Semantics
18. Conflict Identity Semantics
19. Decision Scope
20. Generation-Window Independence
21. Decision-Kind Inventory
22. Decision-Kind Matrix
23. Placement Decision Semantics
24. Placement Strength
25. Placement Infeasibility
26. Omission Decision Semantics
27. Duration Decision Semantics
28. Duration Invalidation
29. Recovery-Substitution Semantics
30. Priority Decision Semantics
31. Priority Invalidation
32. Conflict-Acceptance Semantics
33. Conflict-Acceptance Revalidation
34. Outcome Versus Command Determination
35. Hard / Soft Authority Assessment
36. Decision Application Position
37. Decision-Aware Generation Contract
38. Planning-Stage Consumption
39. Canonical Decision Consumption Order
40. Determinism Requirement
41. Decision Ordering
42. Decision Dimensions
43. One-Object Model Assessment
44. Decision Composition
45. Decision Conflict Policy
46. Decision Replacement
47. Decision Removal / Minimum Undo
48. Lifecycle States
49. Dormant Semantics
50. Stale / Unresolved Semantics
51. Obsolete / Orphan Semantics
52. Missing Occurrence Semantics
53. Source Deletion / Recreation
54. Source-Edit Revalidation
55. Invalidation Matrix
56. Authored Revision Assessment
57. Semantic Fingerprint Assessment
58. Revalidation Authority
59. Silent Misapplication / Deletion Rules
60. Infeasible Decision Handling
61. Decision Provenance
62. SuggestedFix Provenance Retention
63. Explainability Contract
64. Occurrence Reference Matrix
65. Source-Incarnation Requirements
66. Template / Recurrence Incarnation
67. Manual-Event Incarnation
68. Work / Cycle / Nested Incarnation
69. Decision Persistence Goal
70. Profile Semantics
71. Backup Semantics
72. Active Durable Surface Assessment
73. Persistence Surface Matrix
74. Durability Obligations
75. Historical-Ingress Implications
76. Versioning Implications
77. OccurrenceIdentity Evolution Requirements
78. Try / Accept Target Model
79. Accept-Without-Try Semantics
80. General PlanDecision Versus Suggestion-Specific Object
81. Manual Plan Editing Future
82. Commitment Edit Boundary
83. Past Decision / History Boundary
84. Decision Retention Assessment
85. Replay Failure Observability
86. Decision Application Provenance
87. Conflict Visibility After Acceptance
88. Omission Provenance
89. Decision-Aware Friction
90. Recommendation Generation Interaction
91. Decision Revision
92. Decision Authoring Validation
93. Fresh Preview Requirement
94. Decision Set Authority
95. DayFrameState Implications
96. Profile / Backup Replacement Implications
97. Recovery Implications
98. PlanDecision Necessity Confirmation
99. Readiness Matrix
100. `addResource` Determination
101. Interim Preview Communication Recommendation
102. Source-Incarnation Next-Step Requirements
103. Target Authority Model
104. Behavioral Invariants
105. Required Future Test Contract
106. Architectural Alignment Assessment
107. Compatibility Assessment
108. Test Coverage Assessment
109. Open Questions
110. Recommended Implementation / Investigation Sequence
111. Recommended Next Task
112. Deviations
113. Discoveries and Deferred Work
114. Validation
115. Final Completion Determination

Additional sections may be added where evidence requires them.

---

# 153. Validation Requirements

This task is investigation only.

No executable or test files should change.

Run:

    npm run lint
    npm run typecheck
    npm test
    npm run build

Run:

    git diff --check

Record:

- task artifact SHA-256;
- immutable artifact integrity;
- full test-file count;
- full test count;
- build result;
- diff-check result;
- whether executable/test files changed;
- whether governance files changed.

Reference searches must cover:

- all six PlanDecision candidate fix types;
- conflict relationships;
- occurrence identity components;
- relevant planning/placement/friction behavior;
- architecture category/transformation/service requirements.

If the worktree contains prior Phase 2 implementation changes, distinguish them from Task 2.23 work.

---

# 154. Completion Criteria

Task 2.23 is complete only when:

- PlanDecision has a precise conceptual definition;
- canonical naming is adopted or explicitly deferred;
- domain category is established;
- Author transformation is confirmed or revised;
- pillar/service/engine implications are established;
- minimum semantic information is identified;
- target occurrence/conflict semantics are defined;
- all six candidate decision kinds are classified;
- each decision kind has an accepted outcome model or is explicitly blocked on further product semantics;
- hard/soft authority is decided per kind where possible;
- exact placement semantics are decided;
- omission semantics are decided;
- duration semantics are decided;
- recovery-substitution semantics are decided or explicitly deferred;
- priority semantics are decided or explicitly deferred;
- conflict acceptance semantics are decided;
- decision application position and planning-stage ordering are established;
- deterministic replay requirements are explicit;
- decision composition/replacement/removal semantics are established;
- minimum undo requirement is established;
- lifecycle/invalidation classifications are defined;
- source deletion/recreation behavior is defined conceptually;
- semantic revalidation requirements are established;
- unresolved/infeasible decisions are observable rather than silently ignored;
- provenance/explainability requirements are established;
- occurrence-reference requirements are explicit;
- concrete source-incarnation requirements are produced;
- durable identity limitation remains explicit;
- profile/backup/active persistence implications are classified;
- no durable storage design is implemented;
- Try versus Accept target architecture is established;
- general PlanDecision versus suggestion-specific authority is decided;
- decision/history separation is preserved;
- future tests are specified;
- a dependency-correct next task is identified;
- no unauthorized implementation occurs;
- repository-standard validation passes;
- immutable task artifact remains unchanged.

---

# 155. Task Determination

Task 2.23 is a planning-authority semantics investigation.

Task 2.22 established that DayFrame has real user choices that cannot truthfully remain either:

- hidden Preview mutations; or
- source-wide authored edits

if those choices are intended to endure.

The architectural gap is therefore no longer whether a PlanDecision-like object is justified.

The gap is defining exactly what that authority means.

A correct PlanDecision model must let DayFrame answer:

> What did the user decide?

> What occurrence or conflict did that decision refer to?

> Is that still the same semantic target?

> Is the decision still applicable?

> If applicable, how does it constrain planning?

> If it cannot be honored, why not?

> What derived result came from it?

> What must survive regeneration and eventually restart?

Those answers must exist before source-incarnation or persistence design can be correct.

The target architecture under investigation is:

    reusable authored setup
        +
    explicit user-authored PlanDecision set
        ↓
    deterministic planning
        ↓
    derived Preview
        ↓
    SuggestedFix recommendations

with:

    Try
        → ephemeral derived Preview revision

and:

    Accept
        → Author PlanDecision
        → regenerate from authority

**Task 2.23 is complete when DayFrame has an evidence-backed semantic contract for PlanDecision identity, scope, decision kinds, strength, composition, invalidation, replay, provenance, and planning authority; has produced concrete lifetime-safe reference requirements for subsequent source-incarnation work; and has made no unauthorized implementation change.**
