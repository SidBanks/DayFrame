# Commitment Composition / Attached Activities Architecture Specification

## 1. Executive Specification

Commitment Composition is explicit, versioned authority connecting a parent Commitment source to real time-owning support activities and protected non-activity Buffers. One Commitment source type serves both independent and attached roles; a separate Attachment Relationship supplies parent coupling, applicability, requiredness, timing, and lifecycle. Parent occurrences deterministically derive paired component occurrences and one derived Composite Occurrence.

Required components are transactionally evaluated as a Composite Footprint. Unplaceable required work creates Composite Liability and, for already-authorized commitments, corrective Friction. Goal Demand continues to describe productive work; required support activity and Buffer overhead is classified separately while the full footprint competes for Capacity. Execution remains one record per real activity; Buffers are never executed. History freezes decisive relation and pairing provenance.

## 2. Architectural Context

This specification follows the CC3 audit at `docs/audits/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_AUDIT_RESULT.md`. It preserves:

```text
Goal Demand → work shape + Composition Footprint → Feasibility
→ Allocation → Proposal → explicit acceptance
→ scheduled parent/support components → Execution → Found Time / Summary
```

Goals remain outcomes; Goal Structure remains separate. Capacity is derived, Allocation provisional, Proposal non-authoritative, Friction corrective, and history immutable.

## 3. Epistemic Model

| Item | Category |
|---|---|
| Parent/Attached Commitment source, Attachment Relationship, Buffer/applicability policy | Authored authority |
| Parent/attached occurrences, pairing, composite, footprint, feasibility, liability/failure, Capacity effect | Derived |
| Corrective fix or attachment suggestion | Proposed |
| CompositeDecision / Accepted Allocation | Accepted authority |
| Published intervals | Scheduled reality |
| Execution and actual timing | Historical evidence |
| Found Time | Derived live availability |
| Repeated pattern | Learned tendency |
| Promoted pattern | New authored authority after acceptance |

No derived or suggested item silently becomes recurring authority.

## 4. Commitment Composition Definition

> **Commitment Composition is the authored, versioned relationship authority by which real time-owning support activities and protected non-activity time derive applicability, pairing, and timing from a parent Commitment occurrence and are evaluated with it as one operational planning unit.**

It is not Goal Structure, task hierarchy, generic workflow, recurrence, placement preference, Work heuristic, checklist, sub-step, display grouping, Goal Demand, or Proposal.

## 5. Attached Activity

An Attached Activity is a normal Commitment source participating as the child endpoint of an Attachment Relationship. It owns activity identity and duration and derives occurrences from qualifying parent occurrences. Each occurrence owns time and may be independently executed. Attachment, not subtype, supplies coupling. Detachment can preserve source identity.

## 6. Buffer

A Buffer is authored protected non-activity time around a source/component/composite boundary. It reduces Capacity but has no activity occurrence, execution, Goal service, or Progress. Source-local numeric Buffers remain valid; composition may add versioned relationship-scoped Buffer policy. Historical publication freezes the applied amount. No globally independent Buffer entity is required.

## 7. Attached Activity vs Buffer

Use Attached Activity when the user performs something whose occurrence, planned/actual duration, execution, or reporting matters. Use Buffer when time is protected without asserting performed activity. Labels do not decide; intended evidence and identity do. Commute is generally activity; decompression protection may be Buffer.

## 8. Attached Activity vs Independent Commitment

An Attached Activity’s occurrence exists only because a qualifying parent occurrence and active relation exist; recurrence, timing, omission, and current lifecycle are coupled. An independent Commitment generates occurrences from its own recurrence and survives parent absence. An attached source may later be detached/promoted explicitly.

## 9. Sub-step Boundary

Sub-step is excluded from this architecture. Internal warmup/lifting/checklist detail without its own scheduled interval is execution/presentation structure. If it must own an interval, Capacity, or execution subject, it is an Attached Activity. No task subsystem is introduced.

## 10. Parent Commitment

Parent is a contextual role of an ordinary Commitment source referenced by an active Attachment Relationship. It is not a subtype. Parenthood implies no Goal, Priority, execution, or recurrence inheritance beyond explicit relationship policy.

## 11. Type Model

**Model B — One Commitment Type + Typed Attachment Relationships.** A normal reusable Commitment source can be attached or independent. Its own recurrence is inactive while used solely as attached; occurrence applicability derives through relations. This preserves identity, incarnation, Goal links, history, execution, detachment, and uniform persistence.

## 12. Attachment Relationship

The relationship owns ID/revision/lifecycle, incarnation-safe parent/child source endpoints, role/order, applicability, requiredness, relative timing, Buffer/gap policy, pairing/movement/omission behavior, Goal-service policy, footprint classification, and provenance. It is deliberately limited to parent-linked operational time.

## 13. Relationship Identity / Lifetime

Each relationship has opaque never-reused identity, monotonic revision, created/updated timestamps, effective interval, active/retired state, and supersession. Material semantic changes create a new revision. Used revisions are immutably resolvable; changing 30m to 20m never rewrites old occurrences.

## 14. Endpoint Identity

Authored endpoints reference source ID plus incarnation and expected compatible source kind. Derived pairings reference exact durable parent and attached occurrence identities plus relationship revision. Titles and dates never retarget authority.

## 15. Source-Level vs Occurrence-Level Authority

Source-level authority states that qualifying occurrences receive attachments. Expansion evaluates each parent occurrence and emits an occurrence-level pairing record. Pairing is derived provenance, not a second authored relationship:

```text
source relation → exact parent occurrence → exact attached occurrence + pairing
```

## 16. Occurrence Pairing

Each qualifying parent occurrence and relationship revision produces at most one attached occurrence per declared component slot, with deterministic identity derived from parent durable identity, relationship ID/revision, child incarnation, and slot. Parent absence produces none. Regeneration with equivalent authority reproduces identity; incompatible change stales prior decisions. History freezes the pairing.

## 17. Multi-Occurrence Parent Days

Every qualifying parent occurrence independently derives its components. Split shifts therefore produce separate inbound/outbound commutes per occurrence unless applicability filters select otherwise. First/last Work selection is forbidden as attachment authority.

## 18. Applicability

Minimal applicability supports all parent occurrences, date bounds, weekday, cycle/segment/entry, declared parent metadata such as location/state, duration threshold, and explicit occurrence include/exclude override. Conditions are conjunctive, versioned, deterministic, and explainable. Advanced predicates remain downstream.

## 19. Recurrence Inheritance

**Model C — Parent-Derived Applicability + bounded filters/exceptions.** Required attachments own no competing recurrence while attached. Each qualifying parent occurrence creates the opportunity/obligation. Optional attachments use the same pairing basis. Independent recurrence becomes active only after explicit promotion, preventing drift.

## 20. Duration

Attached sources own planned estimated duration. Applicability may select among explicit versioned duration variants. A CompositeDecision may override one occurrence. Execution records actual timing separately. History freezes planned duration and override provenance.

## 21. Relative Timing

First-class rules are `endsAtParentStart`, `startsAtParentEnd`, `beforeParentWithGap`, `afterParentWithGap`, `offsetFromParentStart`, and `offsetFromParentEnd`. Offset rules declare whether the component’s start or end is anchored. Each rule references the paired parent occurrence and produces bounded candidate geometry.

## 22. Constraint vs Preference

Timing strictness is independent of requiredness. A **constraint** must hold for the component to count as realized; a **preference** supplies target geometry within an explicit allowed window. Required attachments may be flexibly placed if their rule allows it, but cannot vanish. Optional attachments may still have exact timing.

## 23. Gap / Buffer Semantics

A temporal gap specifies separation between activity intervals: exact, minimum, or preferred. It is not automatically protected. A Buffer explicitly marks protected non-activity within/around that gap and reduces Capacity. “Commute ends 10m early” leaves an open gap unless Buffer policy protects it.

## 24. Existing Work-Relative Placement Compatibility

`beforeWork`/`afterWork` remain valid generic preferences for independent templates and may be reused internally as search helpers. They are deprecated as attachment representation. Conversion requires explicit user acceptance creating source/relation authority; no migration may infer coupling.

## 25. Required / Optional Attachment

V1 uses `required` and `optional`, plus bounded applicability that can make a relation conditionally applicable. Required means the parent composite is not fully realizable without that component. Optional failure yields a feasible composite with omission. Priority never substitutes for requiredness.

## 26. Parent Lifecycle

Disabled/archived/retired parent authority derives no new attached occurrences. Reactivation resumes expansion under current relation authority. Deleting/replacing an incarnation cannot retarget relations; dangling current relations are invalid/retired explicitly. Historical pairings remain resolvable.

## 27. Parent Omission / Cancellation

Omitting a parent before publication suppresses all occurrence-derived attachments unless an explicit occurrence decision first promotes a component independent. A real-world/post-publication cancellation preserves planned history and records execution cancellation/skips separately; it does not erase published components.

## 28. Parent Movement

Before publication, moving a parent recomputes relation-derived component geometry as one composite and reruns feasibility. Within already accepted relative authority this is derived, but any collision produces failure rather than silent movement outside scope. An accepted occurrence move is atomic through CompositeDecision.

## 29. Parent Duration Change

Plan-relative components anchored to parent end recompute when planned duration changes; start-anchored components need not. The same relationship authority remains, while the composite fingerprint changes and consumers stale. Published history retains old absolute intervals/rule revision.

## 30. Occurrence Exceptions

Explicit decisions may omit, resize, retime within allowed relation, detach, or select a duration/applicability variant for one component occurrence. They do not alter recurring source/relation authority. Reusable change requires separate authored revision.

## 31. Detachment / Promotion

Detachment retires the relationship or records an occurrence exception. Source identity remains when its semantics remain the same. Promotion activates an explicit independent recurrence for future occurrences; it is new authored authority, never an automatic consequence of failed coupling.

## 32. Composite Commitment

Composite Commitment is a derived planning view of one parent source plus active applicable relationship authority. It is not persisted and is not a second source of truth.

## 33. Composite Occurrence

A Composite Occurrence is the derived set of one parent occurrence, paired applicable attached occurrences, Buffers, requiredness map, decisions, footprint, and feasibility. It references components rather than duplicates them.

## 34. Composite Identity

A durable derived composite ID is required for Friction, Proposal, decisions, history, and Summary. It is deterministically derived from parent durable occurrence identity and composition algorithm version; its fingerprint separately captures mutable relation/component content.

## 35. Composite Footprint

The footprint is an interval set classifying parent core, each support activity, each Buffer, and unresolved required liability. It retains overlaps/gaps and does not flatten into an envelope unless a consumer explicitly requests envelope bounds. Identity-based union prevents double counting.

## 36. Time Ownership

Parent and each Attached Activity own their own activity intervals. Buffers protect intervals without activity identity. The composite footprint is a derived union/claim, not additional time ownership; it must not be added atop its components.

## 37. Capacity Boundary

Capacity excludes parent intervals, attached activity intervals, Buffers, and unresolved required liabilities. A failed required commute does not expose its required interval as clean Capacity while the parent remains authorized. Optional unplaced components create no liability unless separately accepted.

## 38. Composite Liability

Composite Liability is a subtype of accepted unresolved Commitment liability, not a new authority domain. It records composite/component/relation identity, required resource shape, horizon, failure reason, conflicts, and provenance. It protects Capacity until resolved, parent removed/omitted, or authority changes.

## 39. Composite Feasibility

Composite Feasibility deterministically tests parent, required components, required Buffers, timing rules, and constraints as a transactional bundle against available geometry. It returns placements/alternatives or reasons; it does not allocate Goal Demand, authorize omission, or move fixed authority.

## 40. Partial Composite Realization

States are `fullyFeasible`, `feasibleWithoutOptional`, `requiredComponentFailure`, and `unknown/stale`. Optional omission is explicit in result. A required failure prevents “fully realizable” treatment; no partial published bundle may conceal it.

## 41. Composition Failure

Composition Failure is the derived condition that applicable required composition cannot be realized while preserving timing and other authority. It differs from ordinary overlap, unplaced independent work, missing heuristic anchor, Goal Demand infeasibility, and Proposal limitation.

## 42. Friction Boundary

For proposed discretionary work, composition failure is a Feasibility limitation and prevents Proposal. For an already-authorized parent/composite, unresolved failure becomes corrective Friction and Composite Liability. This preserves constructive Proposal versus corrective Friction.

## 43. Composite Friction

Friction must distinguish required component unplaced, timing violation, missing required component, ambiguous pairing, and composite conflict, with parent/component/relation IDs and liability. Exact code names are downstream. Optional omission is advisory, not necessarily Friction.

## 44. Suggested Fixes

Non-authoritative fixes may atomically move composite, move a flexible component within relation, omit optional component, modify duration/Buffer/relation, detach, or accept a permitted conflict. A required omission must explicitly change occurrence authority and reclassify the composite, not masquerade as success.

## 45. Atomic Composite Decisions

**Model B — new CompositeDecision authority.** It targets one derived composite or bounded repeated composites and carries coordinated component deltas under one acceptance record. Application is all-or-nothing. Existing PlanDecision remains for independent single occurrences and may be reused internally only under the composite transaction.

## 46. Decision Replay / Scope

Replay validates parent/component durable identities, source incarnations, relation revisions, applicability, fingerprint, and user-day policy. Any material mismatch returns stale/inapplicable with zero partial effects. Scopes are one composite occurrence or explicit bounded repetition. Source/relation changes require authored authority, never inferred from occurrence decisions.

## 47. Goal Link Boundary

**Model C — explicit policy may propagate support attribution.** Default is no inheritance. A relation may declare that child occurrences carry `supportForGoal` context derived from the parent’s explicit Goal link; it is not a direct Goal link, Demand satisfaction, or Progress. Direct activity Goal service remains separately authored.

## 48. Goal Demand Overhead

**Model C — Core + Explicit Overhead Footprint.** Goal Demand preserves productive quantity (e.g., 60m workout). Composition supplies required support activity and Buffer overhead (e.g., 30m), so Feasibility/Allocation consume a 90m resource footprint while retaining 60m productive and 30m overhead classifications.

## 49. Goal Demand Conservation

Each core minute satisfies Goal Demand at most once. Each support/Buffer interval consumes Capacity at most once. Overhead does not satisfy core Demand or Progress absent separate explicit Demand. The composite footprint is the union of classified components, never parent plus envelope. Required overhead cannot be hidden.

## 50. Goal-Specific Feasibility Boundary

An upstream composition projector supplies a normalized resource shape containing core and required/optional component intervals/constraints. Goal-Specific Feasibility evaluates that shape against Capacity without traversing arbitrary relation authority. A 60m core plus 30m required travel is infeasible in 75m.

## 51. Allocation Boundary

Allocation consumes both productive Demand quantity and full required Capacity cost with component provenance. Goals still compete for the Capacity actually required: A uses 90m, B uses 60m. Goal Priority remains unchanged; policy may compare productivity/overhead transparently but cannot call overhead Progress.

## 52. Proposal Boundary

Handoff:

```text
Goal Demand → Goal-work shape → Composition Footprint
→ Goal-Specific Feasibility → Allocation → Proposal
```

Proposal receives feasible composite placements and explanation; it cannot invent attachments, travel, prep, cleanup, or Buffer authority.

## 53. Existing Commitment vs Proposed Goal Work

Existing authored parent patterns use active relationship authority directly. Proposed one-off Goal work may reference an already authored reusable activity/attachment pattern without creating a new recurring Commitment. New/reusable attachment patterns require separate acceptance. Both yield the same footprint contract.

## 54. Accepted Allocation / Scheduled Goal Work

Accepting a Goal proposal authorizes the core placement, required support occurrences, Buffers, and exact composite placement within disclosed scope. Core becomes Scheduled Goal Work; real overhead becomes **Scheduled Support Activity**; Buffers remain protected scheduled metadata. No hidden recurring source is created.

## 55. Buffer Accounting Around Goal Work

A 60m workout plus 10m recovery Buffer consumes 70m Capacity, records 60m activity and 10m protected non-activity, and can satisfy at most 60m core Demand. A 10m shower creates its own support occurrence/execution; Buffer does not.

## 56. Historical Provenance

When decisive, history preserves parent source ID/incarnation/revision, parent occurrence, child source ID/incarnation/revision, attached occurrence, relationship ID/revision, applicability result, requiredness, timing/gap rule, planned duration, Buffer, composite ID/fingerprint, and accepted decision provenance. Exact revision references may replace full graph snapshots only when immutably resolvable.

## 57. Historical Restructuring

Remote-work removal or 30m→20m revision affects future/current derivation only. Published and executed composites retain old relation revision, planned intervals, and fingerprint. Current Summary may show new structure but must label historical basis.

## 58. Execution

Parent and each real Attached Activity have separate occurrence execution subjects. Buffer has none. Composite execution is a derived aggregate referencing component records, never a duplicate record. Planned composition and actual outcomes may diverge without rewriting plan.

## 59. Actual Duration

Execution preserves reported actual start (`occurredAt`) and duration, from which actual end is deterministically derived when both exist. For composition-aware Live behavior, both are minimum required evidence; uncertainty remains explicit. Planned intervals never mutate.

## 60. Found Time

Composition-aware Found Time distinguishes early activity completion, released Buffer, cancellation, optional omission, and required component completion. It derives candidate availability with planned/actual/component provenance and does not rewrite the schedule or automatically authorize use.

## 61. Planned-Relative vs Actual-Relative Attachments

**Hybrid explicit policy.** Default is `planRelative`: remaining component timing stays bound to planned parent boundary. `actualRelativeEligible` permits a Live recomputation from actual boundary, but does not itself move scheduled reality. This prevents unexpected collision/authority changes.

## 62. Live Rescheduling Boundary

Actual-relative recomputation produces a new Live Proposal or corrective Friction resolution, checked against remaining obligations and Capacity. User acceptance is required unless the original accepted relation explicitly grants a bounded dynamic window and the move remains conflict-free within it. Otherwise no automatic movement occurs.

## 63. Summary / Reporting

Summary distinguishes core parent time, support activity time, Buffer time, total unique footprint, planned/actual variance, direct Goal work, and overhead. Totals deduplicate by component interval/occurrence identity; composite envelope is not added to components.

## 64. Direct vs Composite Views

Direct view lists each real occurrence/execution. Composite view groups them by composite ID and derives operational cost, state, and variance. It creates no duplicate activity or execution records.

## 65. Goal Reporting

Goal reporting categories are direct Goal service, supporting activity, operational Buffer overhead, and unrelated activity. Explicit propagation policy may associate support context. Only direct/explicit Demand satisfaction counts toward Goal Demand; none becomes Progress by implication.

## 66. Buffer Reporting

Buffers may appear as protected-time totals and composite overhead, with planned/released status. They are never shown as performed or executed activity. Exact visualization is downstream.

## 67. Persistence

Persist Commitment sources, Attachment Relationships/revisions, applicability/requiredness/timing/Buffer/Goal policies, source-level authority, and accepted CompositeDecisions. Pairings, composites, footprints, feasibility, liability projections, and Summary are derived except where frozen historically.

## 68. Backup / Restore

Future formats preserve versions, source incarnations, relationship IDs/revisions, endpoint validity, applicability, no dangling required authority, decisions, and historical refs. Restore canonicalizes and atomically installs interdependent sources/relations. Legacy independent Commitments remain valid.

## 69. Import / Replacement

Import maps exact IDs/incarnations or creates new identities explicitly; never title-matches. Missing endpoints reject/quarantine current relation authority. Replacement does not rewrite historical composites, and partial composite installation is forbidden.

## 70. Deletion / Retirement

Used relations/sources retire or supersede and remain resolvable. Parent retirement stops new derivation. Attached source retirement invalidates active required relations until explicitly resolved. Hard deletion is limited to never-used, unreferenced drafts with no history/decision.

## 71. Goal-Link Propagation

An explicit relationship policy may propagate support context from selected parent Goal links to attached occurrences. It records source Goal/link provenance and is independently revocable. It does not create a child Goal link, Demand satisfaction, or Progress observation.

## 72. Suggested Attached Activities

Suggestions remain proposed bundles. Acceptance may create a source, relationship, and selected policies; partial acceptance creates only chosen records and preserves user delta. Rejection creates none. Historical repetition never silently reserves time.

## 73. Direct User Authoring

Users may directly author sources/relations. Direct and accepted-suggested authority are semantically equivalent after validation; provenance records origin.

## 74. Structural Modification

Duration, requiredness, timing, applicability, Buffer, parent, and detachment changes create new revisions/supersession and stale derived consumers. Moving to another parent retires old relation and creates a new one atomically. Past meaning remains unchanged.

## 75. Staleness

Changes to parent/child source revision/incarnation, relation, requiredness, timing, applicability, occurrence, decision, Buffer, Goal Demand, Capacity, user-day policy, or actual state used by Live reasoning stale dependent pairings, footprint, feasibility, liability, Friction, Allocation, and Proposal. Stale historical artifacts remain valid as history.

## 76. Composition Fingerprint

A fingerprint is required and includes parent source/incarnation/revision and occurrence, relation IDs/revisions, child source/incarnation/revision, applicability result, requiredness, timing/gap, duration, Buffers, decisive decisions, user-day policy, and algorithm version. Presentation metadata is excluded.

## 77. Determinism

Equivalent authority/horizon produces equivalent applicable set, pairing, occurrence IDs, timing, footprint, feasibility, liability, Friction, fingerprints, and provenance. Canonical ordering uses durable identity; runtime/UI/array order has no meaning.

## 78. Canonical User-Day Semantics

Expansion and placement use canonical variable-duration user-day windows, overnight Work semantics, and exact calendar conversion. Attachments before/after overnight occurrences may cross dates/boundaries; calendar midnight never clips or re-parents them.

## 79. Cross-User-Day Components

An attached occurrence belongs to its paired composite regardless of its own calendar/user-day label. It also retains its actual canonical user-day for reporting/execution. Composite membership follows pairing identity, not date equality.

## 80. Ordering

Structural attachment, relative temporal relation, display order, execution sequence, and scheduler processing order remain separate. Composition supports bounded relative time around one parent, not arbitrary workflow dependency.

## 81. Scope Limitation

Excluded are arbitrary task DAGs, branching processes, checklists, business automation, generic project dependencies, and conditionally generated workflow chains. Commitment Composition is only time-owning operational components tied to a parent occurrence plus protected Buffers.

## 82. Selected Composition Models

| Dimension | Selected model |
|---|---|
| Attachment source | One reusable Commitment source + relationship (Model B) |
| Applicability | Parent-derived with bounded filters/exceptions (Model C) |
| Timing | Explicit relation vocabulary + independent constraint/preference dimension |
| Requiredness | Required/optional + conditional applicability |
| Composite authority | Relationship authority; derived Composite Commitment/Occurrence |
| Decision | Separate atomic CompositeDecision (Model B) |
| Goal-Demand overhead | Core Demand + explicit overhead footprint (Model C) |
| Live relation | Plan-relative default; bounded actual-relative proposal policy |

## 83. Normative Worked Examples

### Example A — Required Commute Before Work
Work/Commute sources plus required `endsAtParentStart` relation. Each Work occurrence derives one commute, both occupy Capacity, history freezes pairing, and each activity executes separately.

### Example B — Required Commute After Work
`startsAtParentEnd` binds to exact Work occurrence end. Duration/Buffer remain classified separately.

### Example C — Work Canceled Before Publication
Omitted parent derives no commutes and no orphan schedule; accepted promotion is the only exception.

### Example D — Published Work Later Canceled
Published Work/commutes remain planned history. Execution records cancellation/skips/partial reality independently.

### Example E — Split Shift
Each qualifying shift occurrence derives its own inbound/outbound pair by parent occurrence identity.

### Example F — Overnight Shift
21:30 commute, 22:00–06:00 Work, and 06:00 commute-home remain one composite despite calendar date and possibly user-day boundaries.

### Example G — Buffer vs Commute
A 30m Buffer protects time with no execution. A 30m commute is a paired activity occurrence with actual-duration evidence.

### Example H — Required Attachment Cannot Fit
Composite state is requiredComponentFailure. Proposed parent is ineligible; authorized parent creates liability/Friction and Capacity is not advertised cleanly.

### Example I — Optional Attachment Cannot Fit
Composite is feasibleWithoutOptional; parent remains realizable and omission is disclosed.

### Example J — Parent Moves
Atomic CompositeDecision moves Work one hour and recomputes commutes; any collision aborts the whole decision.

### Example K — Parent Duration Changes
Travel-home anchored to end recomputes from 14:30. Old publication remains at old absolute relation.

### Example L — Conditional Attachment
`onsite` applicability derives commute only for parent occurrences carrying that declared metadata.

### Example M — Detachment
Post-work walk relation retires; source identity remains and an explicit independent recurrence begins prospectively.

### Example N — Goal Work + Required Travel
60m productive Demand plus 30m travel needs 90m Capacity. A 75m opportunity is infeasible; travel receives zero Demand/Progress credit.

### Example O — Goal Work + Buffer
60m workout plus 10m Buffer needs 70m Capacity; history reports 60m activity and 10m protection, not shower/execution.

### Example P — Accepted Goal Work
Acceptance covers core, required support occurrences, Buffers, and placement. It creates Scheduled Goal Work plus Scheduled Support Activity, no recurring authority.

### Example Q — Planned 30m, Actual 20m
Execution records 20m against immutable 30m plan; potential 10m Found Time is derived after protecting remaining components.

### Example R — Appointment Ends Early
Default travel-home remains plan-relative. Actual-relative policy generates a checked Live Proposal; it does not silently move.

### Example S — Suggested Travel Attachment
User accepts inbound travel only. Authority creates only that source/relation and preserves rejected outbound suggestion provenance.

### Example T — Historical Duration Change
New 20m source/relation revision applies prospectively; old 30m occurrences retain old fingerprint and execution context.

## 84. Commitment Composition Invariants

1. **CC-INV-01:** Time-owning attachments reduce Capacity as activities.
2. **CC-INV-02:** Buffers remain non-activity protected time.
3. **CC-INV-03:** Placement preference is not Attachment authority.
4. **CC-INV-04:** Required attachment never silently becomes independent.
5. **CC-INV-05:** Failed required attachment is not clean Capacity.
6. **CC-INV-06:** Parent movement preserves relation or fails/stales.
7. **CC-INV-07:** Parent omission leaves no orphan required component.
8. **CC-INV-08:** Pairing is deterministic.
9. **CC-INV-09:** First/last heuristics never establish pairing.
10. **CC-INV-10:** Applicability cannot drift from parent recurrence.
11. **CC-INV-11:** Relationship identity/history is stable.
12. **CC-INV-12:** Source recreation never retargets attachment.
13. **CC-INV-13:** Requiredness is explicit.
14. **CC-INV-14:** Buffer and activity semantics remain distinct.
15. **CC-INV-15:** Footprint never double counts envelope/components.
16. **CC-INV-16:** Feasibility includes all required components.
17. **CC-INV-17:** Optional failure does not invalidate parent.
18. **CC-INV-18:** Composition Failure differs from ordinary Friction.
19. **CC-INV-19:** Authorized failure becomes corrective Friction/liability.
20. **CC-INV-20:** Composite decisions apply atomically.
21. **CC-INV-21:** Occurrence choices never silently change recurring authority.
22. **CC-INV-22:** Goal association propagates only by explicit policy.
23. **CC-INV-23:** Goal Demand feasibility includes required overhead.
24. **CC-INV-24:** Overhead never becomes Progress by implication.
25. **CC-INV-25:** Feasibility uses full required Capacity footprint.
26. **CC-INV-26:** Proposal never invents attachments.
27. **CC-INV-27:** Proposal never recommends infeasible composite work.
28. **CC-INV-28:** Suggested attachment requires acceptance.
29. **CC-INV-29:** Historical relation survives restructuring.
30. **CC-INV-30:** Each real activity execution is recorded once.
31. **CC-INV-31:** Composite reporting derives without duplication.
32. **CC-INV-32:** Buffer is never reported as executed.
33. **CC-INV-33:** Planned and actual duration remain distinct.
34. **CC-INV-34:** Found Time preserves plan/actual provenance.
35. **CC-INV-35:** Found Time protects remaining components.
36. **CC-INV-36:** Canonical user-day semantics apply.
37. **CC-INV-37:** Goal Structure remains separate.
38. **CC-INV-38:** Composition is not workflow management.
39. **CC-INV-39:** Equivalent authority yields equivalent composite outputs.
40. **CC-INV-40:** Stale composites cannot drive current Proposal.
41. **CC-INV-41:** Composite view never creates extra time ownership.
42. **CC-INV-42:** Required support receives Capacity cost but no automatic Demand credit.

## 85. Architecture Decisions

### CC-SPEC-01 — Definition
- **Decision:** Explicit operational relationship authority.
- **Normative Rule:** Composition couples parent-linked activities/Buffers only.
- **Reasoning:** Heuristics do not encode lifecycle.
- **Consequences:** Independent Commitments remain valid.
- **Implementation Constraint:** No generic workflow graph.
- **Remaining Downstream Question:** Storage host.

### CC-SPEC-02 — Attached Activity
- **Decision:** Normal Commitment source in attached role.
- **Normative Rule:** Real attachments own occurrence time/execution.
- **Reasoning:** Preserve identity and promotion.
- **Consequences:** No special activity subtype.
- **Implementation Constraint:** Role comes from relation.
- **Remaining Downstream Question:** UI terminology.

### CC-SPEC-03 — Buffer
- **Decision:** Versioned source/relation policy, no activity entity.
- **Normative Rule:** Buffer reduces Capacity and has no execution.
- **Reasoning:** Protection is not performance.
- **Consequences:** Numeric legacy buffers remain compatible.
- **Implementation Constraint:** Freeze applied amount historically.
- **Remaining Downstream Question:** Authoring presentation.

### CC-SPEC-04 — Activity / Buffer Boundary
- **Decision:** Classify by evidence/identity intent.
- **Normative Rule:** Labels MUST NOT determine semantic type.
- **Reasoning:** Equal geometry can mean different facts.
- **Consequences:** Commute supports actual variance; buffer does not.
- **Implementation Constraint:** No implicit conversion.
- **Remaining Downstream Question:** Authoring guidance.

### CC-SPEC-05 — Type Model
- **Decision:** One Commitment type plus relationships.
- **Normative Rule:** Attached role MUST NOT fork source identity.
- **Reasoning:** Detachment/history stay coherent.
- **Consequences:** Uniform persistence/execution.
- **Implementation Constraint:** Suppress independent recurrence while solely attached.
- **Remaining Downstream Question:** Source schema host.

### CC-SPEC-06 — Attachment Relationship
- **Decision:** First-class bounded authority.
- **Normative Rule:** Relation owns coupling semantics, not arbitrary dependencies.
- **Reasoning:** Parent/child source alone is insufficient.
- **Consequences:** Explainable derivation.
- **Implementation Constraint:** Typed endpoints/policies.
- **Remaining Downstream Question:** None.

### CC-SPEC-07 — Relationship Lifecycle
- **Decision:** Opaque revisioned effective identity.
- **Normative Rule:** Used revisions retire/supersede, never rewrite.
- **Reasoning:** Preserve historical meaning.
- **Consequences:** Duration/rule changes are prospective.
- **Implementation Constraint:** Immutable resolution.
- **Remaining Downstream Question:** Ledger representation.

### CC-SPEC-08 — Authority Levels
- **Decision:** Source relation authored; occurrence pairing derived.
- **Normative Rule:** Pairings MUST reference exact parent occurrence.
- **Reasoning:** Source relation alone is historically ambiguous.
- **Consequences:** Split shifts pair correctly.
- **Implementation Constraint:** Freeze pairing.
- **Remaining Downstream Question:** None.

### CC-SPEC-09 — Occurrence Pairing
- **Decision:** Deterministic per-parent derivation.
- **Normative Rule:** At most one child per relation slot/parent.
- **Reasoning:** Prevent duplication/ambiguity.
- **Consequences:** Stable attached occurrence identity.
- **Implementation Constraint:** No first/last heuristic.
- **Remaining Downstream Question:** ID encoding.

### CC-SPEC-10 — Multi-Occurrence Parent
- **Decision:** Expand for each qualifying occurrence.
- **Normative Rule:** Same-day multiplicity MUST NOT collapse.
- **Reasoning:** Split shifts are distinct obligations.
- **Consequences:** Each has its own composite.
- **Implementation Constraint:** Applicability may filter explicit occurrences.
- **Remaining Downstream Question:** UI grouping.

### CC-SPEC-11 — Applicability
- **Decision:** Bounded parent-derived conditions.
- **Normative Rule:** Applicability is deterministic/versioned.
- **Reasoning:** Avoid duplicate recurrence language.
- **Consequences:** Onsite/date/cycle filtering supported.
- **Implementation Constraint:** Explain condition result.
- **Remaining Downstream Question:** Advanced predicate catalog.

### CC-SPEC-12 — Recurrence
- **Decision:** Parent-derived applicability.
- **Normative Rule:** Required attachment MUST NOT independently recur while attached.
- **Reasoning:** Prevent drift.
- **Consequences:** Promotion needs explicit recurrence.
- **Implementation Constraint:** Legacy recurrence not silently reused.
- **Remaining Downstream Question:** Migration UX.

### CC-SPEC-13 — Duration
- **Decision:** Source estimate + bounded variant/override + actual evidence.
- **Normative Rule:** Planned and actual duration remain distinct.
- **Reasoning:** History and Found Time need both.
- **Consequences:** Per-occurrence variance is explainable.
- **Implementation Constraint:** Freeze selected variant.
- **Remaining Downstream Question:** Estimation UX.

### CC-SPEC-14 — Relative Timing
- **Decision:** Six bounded parent-relative forms.
- **Normative Rule:** Timing references paired occurrence boundaries.
- **Reasoning:** Preferences cannot preserve relation.
- **Consequences:** Before/after/offset supported.
- **Implementation Constraint:** No arbitrary workflow edges.
- **Remaining Downstream Question:** Initial UI subset.

### CC-SPEC-15 — Constraint / Preference
- **Decision:** Independent timing strictness dimension.
- **Normative Rule:** Requiredness MUST NOT imply exactness.
- **Reasoning:** Required work may have flexible allowed windows.
- **Consequences:** Feasibility respects declared strictness.
- **Implementation Constraint:** Explicit allowed window for preferences.
- **Remaining Downstream Question:** Defaults.

### CC-SPEC-16 — Gap / Buffer
- **Decision:** Separation and protected time are distinct.
- **Normative Rule:** Gap reduces Capacity only when Buffer-authorized.
- **Reasoning:** Empty time is not necessarily reserved.
- **Consequences:** Exact/minimum/preferred gaps possible.
- **Implementation Constraint:** Classify footprint intervals.
- **Remaining Downstream Question:** None.

### CC-SPEC-17 — Work Preferences
- **Decision:** Retain as independent heuristics only.
- **Normative Rule:** Conversion to attachment requires acceptance.
- **Reasoning:** Existing records lack coupling intent.
- **Consequences:** Backward compatibility.
- **Implementation Constraint:** Never infer relation.
- **Remaining Downstream Question:** Deprecation messaging.

### CC-SPEC-18 — Requiredness
- **Decision:** Required/optional with conditional applicability.
- **Normative Rule:** Priority MUST NOT substitute.
- **Reasoning:** Feasibility needs explicit necessity.
- **Consequences:** Optional failure can preserve parent.
- **Implementation Constraint:** No implicit default in stored authority.
- **Remaining Downstream Question:** Authoring default.

### CC-SPEC-19 — Parent Lifecycle
- **Decision:** New child derivation follows current parent lifecycle.
- **Normative Rule:** Lifecycle changes MUST NOT erase history.
- **Reasoning:** Current and past truth differ.
- **Consequences:** Reactivation recomputes current state.
- **Implementation Constraint:** Incarnation-safe endpoints.
- **Remaining Downstream Question:** Archived relation display.

### CC-SPEC-20 — Omission / Cancellation
- **Decision:** Pre-publication omission suppresses children; post-publication records reality.
- **Normative Rule:** Required children MUST NOT remain orphaned.
- **Reasoning:** Pairing depends on parent occurrence.
- **Consequences:** History remains immutable.
- **Implementation Constraint:** Promotion must be explicit.
- **Remaining Downstream Question:** Cancellation UI.

### CC-SPEC-21 — Movement
- **Decision:** Recompute and validate composite atomically.
- **Normative Rule:** Partial moves MUST NOT apply.
- **Reasoning:** Relation semantics must survive.
- **Consequences:** Collisions become failure.
- **Implementation Constraint:** Composite transaction.
- **Remaining Downstream Question:** Drag/drop interaction.

### CC-SPEC-22 — Parent Duration Change
- **Decision:** Boundary-anchored children recompute prospectively.
- **Normative Rule:** Published plan MUST NOT mutate.
- **Reasoning:** Relation is durable, geometry derived.
- **Consequences:** Fingerprint/staleness changes.
- **Implementation Constraint:** Anchor semantics explicit.
- **Remaining Downstream Question:** None.

### CC-SPEC-23 — Occurrence Exceptions
- **Decision:** Bounded accepted overrides.
- **Normative Rule:** Occurrence choice MUST NOT alter recurring authority.
- **Reasoning:** One-off and reusable intent differ.
- **Consequences:** Omit/resize/retime/detach supported.
- **Implementation Constraint:** Preserve decision provenance.
- **Remaining Downstream Question:** Repeat-scope UX.

### CC-SPEC-24 — Detachment / Promotion
- **Decision:** Retire relation, preserve source identity, explicitly activate recurrence.
- **Normative Rule:** Failed coupling MUST NOT auto-promote.
- **Reasoning:** Independence is new authority.
- **Consequences:** History remains linked to old role.
- **Implementation Constraint:** Atomic transition.
- **Remaining Downstream Question:** None.

### CC-SPEC-25 — Composite Commitment
- **Decision:** Derived source-level view.
- **Normative Rule:** MUST NOT persist as second authority.
- **Reasoning:** Relation/source authority is sufficient.
- **Consequences:** Reproducible view.
- **Implementation Constraint:** Fingerprint inputs.
- **Remaining Downstream Question:** Cache.

### CC-SPEC-26 — Composite Occurrence
- **Decision:** Derived references-only bundle.
- **Normative Rule:** MUST NOT duplicate component occurrences.
- **Reasoning:** One activity, one fact.
- **Consequences:** Feasibility/reporting share scope.
- **Implementation Constraint:** Requiredness map and state.
- **Remaining Downstream Question:** None.

### CC-SPEC-27 — Composite Identity
- **Decision:** Deterministic ID plus material fingerprint.
- **Normative Rule:** Parent occurrence anchors composite identity.
- **Reasoning:** Decisions/history need durable target.
- **Consequences:** Content changes stale without identity confusion.
- **Implementation Constraint:** Version derivation algorithm.
- **Remaining Downstream Question:** Encoding.

### CC-SPEC-28 — Footprint
- **Decision:** Classified interval set and liabilities.
- **Normative Rule:** Envelope MUST NOT double count components.
- **Reasoning:** Capacity and reporting need meaning.
- **Consequences:** Core/support/Buffer remain visible.
- **Implementation Constraint:** Identity-based union.
- **Remaining Downstream Question:** None.

### CC-SPEC-29 — Time Ownership
- **Decision:** Each activity owns its interval; Buffer protects; composite derives.
- **Normative Rule:** Composite MUST NOT add ownership.
- **Reasoning:** Avoid duplicate claims.
- **Consequences:** Execution maps to activities only.
- **Implementation Constraint:** Distinct interval classes.
- **Remaining Downstream Question:** None.

### CC-SPEC-30 — Capacity / Liability
- **Decision:** Required failure creates accepted Commitment liability.
- **Normative Rule:** Unplaced required time MUST NOT appear clean.
- **Reasoning:** Capacity must stay honest.
- **Consequences:** Liability ends only with resolution/authority change.
- **Implementation Constraint:** Exact resource-shape provenance.
- **Remaining Downstream Question:** Capacity display.

### CC-SPEC-31 — Composite Feasibility
- **Decision:** Transactional pre-placement evaluation.
- **Normative Rule:** All required components/Buffer constraints MUST fit.
- **Reasoning:** Partial placement hides failure.
- **Consequences:** Proposed infeasible composites stop upstream.
- **Implementation Constraint:** No authorization side effects.
- **Remaining Downstream Question:** Search algorithm.

### CC-SPEC-32 — Partial Realization
- **Decision:** Distinguish full, without optional, required failure, unknown/stale.
- **Normative Rule:** Optional failure MUST be disclosed.
- **Reasoning:** Requiredness changes consequence.
- **Consequences:** Parent can proceed without optional.
- **Implementation Constraint:** Never call required failure feasible.
- **Remaining Downstream Question:** Labels.

### CC-SPEC-33 — Composition Failure
- **Decision:** First-class derived condition.
- **Normative Rule:** Failure identifies decisive required relation/constraint.
- **Reasoning:** Ordinary unplaced state lacks bundle meaning.
- **Consequences:** Feasibility or Friction consumes it.
- **Implementation Constraint:** Stable explanation.
- **Remaining Downstream Question:** Exact codes.

### CC-SPEC-34 — Friction Boundary
- **Decision:** Proposed failure limits; authorized failure corrects.
- **Normative Rule:** Friction MUST remain corrective.
- **Reasoning:** Proposal and authority stages differ.
- **Consequences:** Same geometry can have different state.
- **Implementation Constraint:** Track authority status.
- **Remaining Downstream Question:** None.

### CC-SPEC-35 — Corrective Fixes
- **Decision:** Composite-aware non-authoritative suggestions.
- **Normative Rule:** Fixes MUST declare affected relations/components.
- **Reasoning:** Hidden partial fixes corrupt composition.
- **Consequences:** Atomic alternatives possible.
- **Implementation Constraint:** Revalidate before acceptance.
- **Remaining Downstream Question:** Copy/presentation.

### CC-SPEC-36 — Composite Decision
- **Decision:** Separate atomic authority.
- **Normative Rule:** Coordinated deltas apply all-or-nothing.
- **Reasoning:** Single-occurrence PlanDecision is insufficient.
- **Consequences:** PlanDecision remains bounded.
- **Implementation Constraint:** Transactional replay.
- **Remaining Downstream Question:** Persistence host.

### CC-SPEC-37 — Replay / Staleness
- **Decision:** Exact identity/revision/fingerprint validation.
- **Normative Rule:** Stale replay MUST have zero partial effect.
- **Reasoning:** Composite meaning depends on all components.
- **Consequences:** Explicit re-decision may be required.
- **Implementation Constraint:** Deterministic status/reasons.
- **Remaining Downstream Question:** Recovery UX.

### CC-SPEC-38 — Goal Attribution
- **Decision:** Default none; explicit support propagation policy.
- **Normative Rule:** Support attribution is not Progress/Demand satisfaction.
- **Reasoning:** Overhead may serve context without advancing outcome.
- **Consequences:** Goal reporting can classify overhead.
- **Implementation Constraint:** Preserve source link provenance.
- **Remaining Downstream Question:** Initial reporting UI.

### CC-SPEC-39 — Goal-Demand Overhead
- **Decision:** Core Demand plus explicit overhead footprint.
- **Normative Rule:** Full required footprint competes for Capacity.
- **Reasoning:** Preserve productive versus operational cost.
- **Consequences:** 60+30 requires 90 while satisfying 60.
- **Implementation Constraint:** Carry classifications downstream.
- **Remaining Downstream Question:** Policy comparison display.

### CC-SPEC-40 — Conservation
- **Decision:** Once-only core, support, and Buffer accounting.
- **Normative Rule:** Overhead MUST NOT receive automatic Demand/Progress credit.
- **Reasoning:** Prevent hidden double counting.
- **Consequences:** Footprint union is auditable.
- **Implementation Constraint:** Identity-based ledger.
- **Remaining Downstream Question:** None.

### CC-SPEC-41 — Goal-Specific Feasibility
- **Decision:** Consume normalized composition resource shape.
- **Normative Rule:** Feasibility MUST account for all required intervals.
- **Reasoning:** Core-only fit is insufficient.
- **Consequences:** Composition service owns traversal.
- **Implementation Constraint:** Preserve component provenance.
- **Remaining Downstream Question:** Interface shape.

### CC-SPEC-42 — Allocation
- **Decision:** Consume productive quantity and full Capacity cost.
- **Normative Rule:** Priority semantics remain unchanged.
- **Reasoning:** Fair planning needs actual resource claim.
- **Consequences:** Overhead is visible but not Progress.
- **Implementation Constraint:** No relation traversal.
- **Remaining Downstream Question:** Allocation explanations.

### CC-SPEC-43 — Proposal
- **Decision:** Only feasible pre-expanded composites may be proposed.
- **Normative Rule:** Proposal MUST NOT invent composition.
- **Reasoning:** Suggestions cannot create hidden time authority.
- **Consequences:** Impossible composites are excluded/explained.
- **Implementation Constraint:** Reject stale footprint.
- **Remaining Downstream Question:** Presentation.

### CC-SPEC-44 — Accepted Goal Work
- **Decision:** Acceptance covers exact core/support/Buffer composite scope.
- **Normative Rule:** Support activities become scheduled authority, not recurring patterns.
- **Reasoning:** All time ownership needs disclosed acceptance.
- **Consequences:** Separate Scheduled Support Activity classification.
- **Implementation Constraint:** Freeze placement/fingerprint.
- **Remaining Downstream Question:** Historical enum naming.

### CC-SPEC-45 — Historical Provenance
- **Decision:** Freeze decisive relation/pairing/footprint facts.
- **Normative Rule:** Current restructuring MUST NOT reinterpret history.
- **Reasoning:** Planned authority must remain explainable.
- **Consequences:** Exact revision refs or snapshots required.
- **Implementation Constraint:** Preserve composite fingerprint.
- **Remaining Downstream Question:** Embedding threshold.

### CC-SPEC-46 — Execution
- **Decision:** One record per real component; composite aggregate derived.
- **Normative Rule:** Buffer has no execution.
- **Reasoning:** Facts must not duplicate.
- **Consequences:** Parent/component outcomes may diverge.
- **Implementation Constraint:** Durable occurrence subject.
- **Remaining Downstream Question:** Aggregate UI.

### CC-SPEC-47 — Actual Duration
- **Decision:** Preserve actual start/duration separate from plan.
- **Normative Rule:** Execution MUST NOT mutate historical interval.
- **Reasoning:** Variance and Found Time require both truths.
- **Consequences:** Actual end can derive when evidence complete.
- **Implementation Constraint:** Represent uncertainty.
- **Remaining Downstream Question:** Native timer.

### CC-SPEC-48 — Found Time
- **Decision:** Derive net candidate after remaining obligations.
- **Normative Rule:** Found Time MUST NOT rewrite plan or double count liability.
- **Reasoning:** Early completion may not make all time free.
- **Consequences:** Component provenance required.
- **Implementation Constraint:** Same Capacity authority checks.
- **Remaining Downstream Question:** Live UI.

### CC-SPEC-49 — Plan / Actual Relative
- **Decision:** Plan-relative default; bounded actual-relative eligible policy.
- **Normative Rule:** Actual-relative change requires validation and authority.
- **Reasoning:** Automatic movement can conflict.
- **Consequences:** Live Proposal/corrective path.
- **Implementation Constraint:** Explicit dynamic window.
- **Remaining Downstream Question:** Initial policy availability.

### CC-SPEC-50 — Summary
- **Decision:** Direct and composite derived views.
- **Normative Rule:** Totals MUST deduplicate component identity.
- **Reasoning:** Envelope/components represent same time.
- **Consequences:** Core/support/Buffer/variance categories.
- **Implementation Constraint:** No aggregate execution records.
- **Remaining Downstream Question:** Visualization.

### CC-SPEC-51 — Persistence / Restore
- **Decision:** Versioned atomic relation authority and immutable history.
- **Normative Rule:** Restore MUST validate endpoints/incarnations before install.
- **Reasoning:** Partial composition corrupts time truth.
- **Consequences:** Legacy independent data stays valid.
- **Implementation Constraint:** Canonical fingerprints/migration.
- **Remaining Downstream Question:** Version sequence.

### CC-SPEC-52 — Deletion / Retirement
- **Decision:** Historically used authority retires.
- **Normative Rule:** Hard delete only provably unused drafts.
- **Reasoning:** Old composites need resolution.
- **Consequences:** Source retirement may create current failure.
- **Implementation Constraint:** Referential checks.
- **Remaining Downstream Question:** Retention UI.

### CC-SPEC-53 — Suggestions / User Authority
- **Decision:** Proposal then selective acceptance; direct authoring equivalent.
- **Normative Rule:** Learned patterns MUST NOT reserve recurring time.
- **Reasoning:** Suggestions are not authority.
- **Consequences:** Partial acceptance preserves delta.
- **Implementation Constraint:** Origin provenance.
- **Remaining Downstream Question:** Suggestion algorithm.

### CC-SPEC-54 — Determinism / User Day
- **Decision:** Canonical identity-ordered, user-day-aware derivation.
- **Normative Rule:** Midnight/UI/storage order MUST NOT change pairing.
- **Reasoning:** Overnight composites must replay.
- **Consequences:** Cross-day membership follows pairing.
- **Implementation Constraint:** Version algorithms/policies.
- **Remaining Downstream Question:** Performance caching.

### CC-SPEC-55 — Scope
- **Decision:** Bounded operational composition only.
- **Normative Rule:** MUST NOT implement arbitrary workflows/tasks.
- **Reasoning:** DayFrame plans time, not business processes.
- **Consequences:** Small relation/timing vocabulary.
- **Implementation Constraint:** Reject unsupported graph semantics.
- **Remaining Downstream Question:** None.

## 86. Relationship Matrix

| Relationship / Rule | Source | Target | Authored or Derived? | Own Identity? | Owns Time? | Affects Capacity? | Affects Feasibility? | Affects Lifecycle? | Historical Provenance Required? |
|---|---|---|---|---:|---:|---:|---:|---:|---:|
| Attachment Relationship | Parent source | Child source | Authored | Yes | No | Via derived component | Yes | Yes | Yes |
| Parent-occurrence pairing | Parent occurrence | Attached occurrence | Derived | Deterministic | No | Via members | Yes | Coupled occurrence | Yes |
| Relative timing | Pairing boundaries | Child geometry | Authored rule/derived result | In relation | No | Yes | Yes | Movement coupling | Yes |
| Buffer policy | Source/relation boundary | Protected interval | Authored/derived interval | Policy revision | No | Yes | Yes | Follows authority | Yes amount |
| Applicability | Parent/context | Relation | Authored condition/derived result | In relation | No | Yes | Yes | Controls occurrence | Yes when decisive |
| Requiredness | Relation | Composite | Authored | In relation | No | Liability | Yes | Omission coupling | Yes |
| Goal support attribution | Parent Goal context | Child occurrence | Authored policy/derived context | Policy revision | No | No extra | No | No | Yes |
| Composite membership | Composite ID | Occurrences/Buffers | Derived | Composite ID | No | Union | Yes | Reflects members | Yes |

## 87. Boundary Matrix

| Concept | Own Identity? | Authored? | Own Lifecycle? | Owns Time? | Executable? | Parent-Coupled? | Reduces Capacity? | May Affect Goal Demand Feasibility? | Historical Provenance? |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Parent Commitment | Yes | Yes | Yes | Yes via occurrence | Yes | Role only | Yes | Yes | Yes |
| Attached Activity | Yes | Yes | Yes | Yes via occurrence | Yes | Yes | Yes | Yes | Yes |
| Buffer | Policy identity/revision | Yes | With host | No activity | No | May be | Yes | Yes | Applied snapshot |
| Sub-step | Outside scope | N/A | N/A | No separate | Internal only | No | No | No | Outside scope |
| Attachment Relationship | Yes | Yes | Yes | No | No | It defines coupling | Indirectly | Yes | Yes |
| Parent occurrence | Yes | Derived/authored placement | Occurrence | Yes | Yes | Composite anchor | Yes | Yes | Yes |
| Attached occurrence | Yes | Derived/accepted override | Occurrence | Yes | Yes | Yes | Yes | Yes | Yes |
| Composite Occurrence | Deterministic | Derived | Derived state | No extra | Aggregate only | Yes | Union only | Yes | Yes |
| Composite Liability | Yes/read-model key | Derived from authority | Until resolved | No activity | No | Yes | Protects Capacity | Yes | Yes |
| Scheduled Goal Work | Yes | Accepted | Yes | Yes | Yes | May be parent | Yes | It is realization | Yes |
| Execution | Yes | User evidence | Immutable revision chain | Actual evidence | It is record | References occurrence | No direct | Found-Time input | Yes |

## 88. Applicability Matrix

| Scenario | Parent Occurs? | Applicability Condition | Attached Generated? | Required? | Composite Effect |
|---|---:|---|---:|---:|---|
| Normal recurrence | Yes | all | Yes per parent | Declared | Included |
| Parent absent | No | irrelevant | No | N/A | No composite |
| Onsite only | Yes | onsite true | Yes | Declared | Included |
| Remote Work | Yes | onsite false | No | N/A | Valid without commute |
| Weekday subset | Yes | weekday matches | Yes | Declared | Included |
| Split shift | Twice | each qualifies | Two child occurrences | Declared | Two composites |
| Occurrence exception | Yes | explicit exclude | No | Waived for occurrence | Explained |
| Parent archived | No new | lifecycle false | No | N/A | Current inactive |
| Relation retired | Yes | relation inactive | No | N/A | Parent independent |

## 89. Timing Matrix

| Timing Rule | Parent Reference | Constraint or Preference? | Gap Allowed? | Recomputes on Move? | Historical Rule Preserved? |
|---|---|---|---:|---:|---:|
| endsAtParentStart | exact start | Either | yes, before gap form | Yes | Yes |
| startsAtParentEnd | exact end | Either | yes, after gap form | Yes | Yes |
| beforeParentWithGap | start | Either | exact/min/preferred | Yes | Yes |
| afterParentWithGap | end | Either | exact/min/preferred | Yes | Yes |
| offsetFromParentStart | start | Either | offset embodies separation | Yes | Yes |
| offsetFromParentEnd | end | Either | offset embodies separation | Yes | Yes |

## 90. Lifecycle Matrix

| Event | Parent Source | Parent Occurrence | Relationship | Attached Occurrence | Required Composite Result | Historical Result |
|---|---|---|---|---|---|---|
| Parent archived | inactive | no new | retained current/history | no new | inactive | old preserved |
| Parent recreated | new incarnation | new identity | old cannot retarget | none until new relation | invalid/unrelated | old preserved |
| Parent omitted | unchanged | omitted | active | suppressed/omitted atomically | no orphan | decision frozen |
| Parent moved | unchanged | moved | active | recomputed | revalidated atomically | old publication unchanged |
| Duration changed | revised | changed | active | end-anchors recomputed | revalidated | old preserved |
| Relation retired | active | exists | retired | no future child | parent independent | old preserved |
| Child detached | active | exists | retired/exception | independent only if authorized | recompute | old preserved |
| Required child omitted | active | exists | active + exception | omitted | failure/explicit waiver | freeze waiver |
| Optional child omitted | active | exists | active | omitted | feasibleWithoutOptional | freeze omission |
| Published parent canceled | unchanged | historical scheduled | preserved | historical scheduled | execution divergence | plan unchanged |

## 91. Capacity / Footprint Matrix

| Scenario | Parent Activity | Attached Activity | Buffer | Composite Footprint | Capacity Effect | Liability if Unplaced |
|---|---:|---:|---:|---:|---|---|
| Work + two commutes | 480m | 60m | 0 | 540m union | exclude all | required commute liability |
| Work + Buffers | 480m | 0 | 60m | 540m protected | exclude all | Buffer constraint failure |
| Workout + travel | 60m | 30m | 0 | 90m | exclude 90m | required travel liability after authority |
| Workout + recovery Buffer | 60m | 0 | 10m | 70m | exclude 70m | Buffer viability liability |
| Optional attachment | 60m | optional 15m | 0 | 60–75m | core required; optional if placed | none for optional |
| Required failed attachment | 60m | required 15m unplaced | 0 | 60m + unresolved 15m shape | protect liability | yes |

## 92. Goal-Demand Overhead Matrix

| Scenario | Core Goal Demand | Required Activity Overhead | Buffer Overhead | Feasibility Footprint | Demand Satisfaction Credit | Progress Credit |
|---|---:|---:|---:|---:|---:|---:|
| Workout + travel | 60m | 30m | 0 | 90m | 60m core | None implied |
| Study + setup activity | 45m | 5m | 0 | 50m | 45m | None implied |
| Study + setup Buffer | 45m | 0 | 5m | 50m | 45m | None implied |
| Goal work + optional | 45m | 0 required; 10m optional | 0 | 45m required /55 preferred | 45m | None implied |
| Found Time insufficient | 60m | 30m | 0 | 90m vs 75m | 0 until scheduled/executed policy | None |
| Reusable attachment pattern | 60m | declared pattern 30m | declared | full derived footprint | core only | None implied |

## 93. Feasibility Matrix

| Scenario | Core Fits? | Required Attachments Fit? | Optional Fit? | Composite State | Proposal Eligible? | Friction? |
|---|---:|---:|---:|---|---:|---:|
| All fit | Yes | Yes | Yes | fullyFeasible | Yes | No |
| Required fails | Yes | No | any | requiredComponentFailure | No proposed | Yes if authorized |
| Optional fails | Yes | Yes | No | feasibleWithoutOptional | Yes, disclosed | Usually no |
| Parent fixed | Yes/fixed | Evaluate around it | Evaluate | according to result | If required fit | If authorized failure |
| Proposed parent | Yes | Evaluate | Evaluate | according to result | Only feasible states | No corrective Friction |
| Overnight composite | Yes | canonical evaluation | Evaluate | according to result | If fit | If authorized failure |
| Stale relation | Unknown | Unknown | Unknown | stale | No | Existing authority may require review |

## 94. Decision Matrix

| User Decision | Target | Atomic? | Changes Occurrence? | Changes Recurring Authority? | Revalidation? | Historical Provenance |
|---|---|---:|---:|---:|---:|---|
| Move composite | Composite occurrence | Yes | Yes all affected | No | Yes | CompositeDecision |
| Omit parent | Composite occurrence | Yes | Yes parent/derived children | No | Yes | Decision + pairings |
| Omit required | Component exception | Yes | Yes | No | Yes; failure/waiver | Explicit required override |
| Omit optional | Component | Yes | Yes | No | Yes | Optional omission |
| Resize attachment | Component occurrence | Yes within composite | Yes | No | Yes | Duration override |
| Detach | Relation/occurrence scope | Yes | Yes | Only source-scope command | Yes | Retirement/exception |
| Change Buffer | Occurrence or relation | Yes | Yes | Only relation revision | Yes | Old/new amount |
| Modify recurring relation | Relationship | Yes | Future | Yes | Yes | Superseding revision |
| Accept suggestion | Proposed bundle | Yes selected set | Future/current per scope | Yes | Yes | Proposal + delta |

## 95. Execution Matrix

| Planned State | Actual Parent | Actual Attachment | Buffer | Historical Plan Changed? | Execution Records | Found-Time Candidate? |
|---|---|---|---|---:|---|---:|
| All as planned | completed planned duration | completed planned | protected | No | One per activity | No variance |
| Attachment early | as planned | shorter | unchanged plan | No | Separate records | Net difference if obligations permit |
| Attachment late | as planned | longer | unchanged | No | Separate records | No; may create Friction/delay |
| Parent early | shorter | pending | unchanged | No | Parent then child evidence | Only after remaining footprint |
| Parent canceled | canceled/skipped | may skip/partial | plan retained | No | Each actual fact | Derived only if truly free |
| Optional skipped | completed | skipped | retained/released by policy | No | Separate skip | Possible |
| Required skipped | completed/divergent | skipped | retained | No | Separate skip | Failure evidence, not automatically free |
| Buffer unused | as planned | as planned | released | No | No Buffer record | Potential derived release |

## 96. Authority Matrix

| Concept | Authority Source | Category | Persist Current? | Creates Time Ownership? | Moves Time? | Changes Capacity? | Acceptance Required? |
|---|---|---|---:|---:|---:|---:|---:|
| Parent/child source | User | Authored | Yes | Through occurrences | By authored/accepted change | Yes | Yes |
| Attachment Relationship | User | Authored | Yes | Derives child occurrences | Defines relation | Yes indirectly | Yes |
| Buffer policy | User | Authored | Yes | No activity | Changes protection | Yes | Yes |
| Pairing/composite | Engine | Derived | Cache/history | No extra | No authority | Represents effect | No |
| Footprint/feasibility | Engine | Derived | Cache/history | No | No | Describes | No |
| Composite Liability | Engine from accepted authority | Derived liability | Yes/current | No activity | No | Protects | Underlying authority yes |
| Fix/suggestion | Engine | Proposed | Until decision | No | No | No | For effect yes |
| CompositeDecision | User | Accepted | Yes | Can change exact scheduled scope | Yes atomically | Yes | Yes |
| Accepted Allocation | User | Accepted | Yes | Authorizes realization | Exact scope | Yes | Yes |
| Execution | User/evidence | Historical | Yes | Records actual, not plan | No | Found-Time input | Explicit report/evidence |
| Found Time | Engine | Derived | Live/history if used | No | No | Adds candidate availability | Use requires Proposal/decision |

## 97. Transition Matrix

| Transition | Input | Output | Automatic? | User Authority? | Changes Time Ownership? | Historical Freeze? |
|---|---|---|---:|---:|---:|---:|
| Parent + attachment authority → pairs | Sources/relation/occurrences | attached occurrences | Yes | Prior authored | Derived scheduled intent | At publication |
| Relation → relative placement | Pair + rule | geometry | Yes | Prior authored | No extra | Yes when published |
| Components → footprint | intervals/Buffers | classified union | Yes | No | No extra | When decisive |
| Footprint → feasibility | footprint + Capacity | result | Yes | No | No | Proposal provenance |
| Required failure → liability | accepted composite + failure | liability | Yes | Underlying yes | Protects Capacity | Yes |
| Authorized failure → Friction | liability/conflict | corrective Friction | Yes | No | No | Resolution history |
| Fix → CompositeDecision | suggestion + acceptance | accepted delta | No | Yes | Possibly | Yes |
| Accepted Goal proposal → scheduled composite | allocation/proposal/acceptance | core/support/Buffers | No | Yes | Yes | Yes |
| Scheduled occurrence → execution | occurrence + evidence | record | No/evidence | User/evidence | Records actual | Yes |
| Variance → Found Time candidate | plan/actual/remaining | derived availability | Yes | No | No | If proposed/used |
| Suggestion → authored attachment | proposal + selection | source/relation | No | Yes | Future occurrences | Yes |

## 98. Primitive Compatibility Matrix

| Requirement | Existing Primitive | Reuse Classification | Required Adaptation | Risk |
|---|---|---|---|---|
| Source IDs/incarnation | durable source identities | Directly Reusable | Both endpoints | Retargeting if omitted |
| BlockTemplate | Commitment source | Reusable with Adaptation | Attached role/disable recurrence | Drift |
| BlockRecurrence | cadence | Conceptually Related but Wrong Abstraction | Independent only after promotion | Duplicate occurrences |
| ManualEvent | fixed Commitment | Reusable with Adaptation | Relation endpoint/pairing | Manual drift |
| Shift Work | deterministic Work occurrence | Directly Reusable | Parent endpoint/pair | Split ambiguity if heuristic |
| BlockCandidate | derived intended occurrence | Reusable with Adaptation | Attachment provenance | Orphan candidate |
| ScheduledBlock | activity interval | Reusable with Adaptation | Composite membership/support class | Relation loss |
| before/after Work | geometric heuristic | Conceptually Related but Wrong Abstraction | Search helper only | False attachment |
| numeric Buffers | occupied padding | Reusable with Adaptation | Versioned policy/history | Activity confusion |
| User-day logic | canonical windows | Directly Reusable | Composite expansion | Midnight bugs |
| Placement engine | interval search | Reusable with Adaptation | Transactional bundle search | Partial placement |
| Unplaced candidates | liability analogue | Reusable with Adaptation | Required/optional/composite state | Hidden requirement |
| Friction | corrective overlap/unplaced | Reusable with Adaptation | Composite kinds/liability | Symptom only |
| SuggestedFix | non-authoritative alternatives | Reusable with Adaptation | Multi-component target | Partial fix |
| PlanDecision | accepted single occurrence | Reusable with Adaptation | Inside/new CompositeDecision | Atomicity failure |
| Durable occurrence refs | exact target | Directly Reusable | Pair/composite refs | None |
| Historical occurrence | frozen plan snapshot | Reusable with Adaptation | Relation/Buffer/fingerprint | History rewrite |
| Goal links | incarnation association | Reusable with Adaptation | Support propagation policy | False Progress |
| Execution records | actual duration/evidence | Directly Reusable | Attached occurrence family/context | Duplication |
| Backup/restore | versioned atomic framework | Reusable with Adaptation | Relation referential validation | Partial install |

## 99. Specification Consistency Checks

1. Parent no attachments remains unchanged.
2. One required-before derives/pairs and must fit.
3. One required-after anchors to parent end.
4. Required before+after evaluate transactionally.
5. Optional failure preserves parent and is disclosed.
6. Parent absent derives none.
7. Parent omitted suppresses paired children atomically.
8. Archived parent creates no new pair.
9. Parent move recomputes/revalidates whole composite.
10. Duration change moves end-anchored components and stales consumers.
11. Recreated parent cannot receive old relation.
12. Split shifts pair independently.
13. Overnight pairing uses canonical windows.
14. Cross-midnight child retains composite membership and own user-day.
15. Retired relation stops future derivation, preserves history.
16. Detached source remains same identity where semantically valid.
17. Promotion requires explicit independent recurrence.
18. Buffer-only parent has protected, non-executable overhead.
19. Buffer plus activity remain separately classified.
20. Required failure creates limitation/liability.
21. Optional failure does not invalidate parent.
22. Authorized infeasibility becomes Friction/liability.
23. Proposed infeasibility blocks Proposal, not corrective Friction.
24. Core fit/overhead failure is infeasible.
25. Zero-overhead Goal work uses core footprint.
26. Buffer overhead consumes Capacity without Demand/Progress credit.
27. Shared Goal context does not propagate by default.
28. Explicit support policy labels overhead only.
29. Composite move acceptance applies atomically.
30. Partially stale move applies nothing.
31. Post-publication omission/cancellation preserves plan and records reality.
32. Shorter attachment creates provenance-bearing variance.
33. Longer attachment creates no Found Time and may create Friction.
34. Early parent does not free time still needed downstream.
35. Optional skip may yield Found Time without parent failure.
36. Required skip records execution failure, not automatic availability.
37. Found Time derives net remaining footprint.
38. Later required component is protected from double-counted Found Time.
39. Rejected suggestion creates no authority.
40. Modified acceptance creates selected authority/delta only.
41. Backup/restore atomically validates composition.
42. Historical composite resolves retired revisions.
43. Flat independent Commitments remain valid.
44. beforeWork remains preference, never attachment.
45. Goal Structure has no Commitment endpoints/semantics.
46. Proposal consumes feasibility and never invents composition.

No contradiction remains.

## 100. Implementation Constraints

A conforming implementation must: 1 preserve independent Commitments; 2 keep composition optional; 3 separate Goal Structure; 4 use explicit relationship authority; 5 preserve relation revisions; 6 use incarnation-safe endpoints; 7 pair deterministically; 8 reject first/last heuristic as authority; 9 separate activity/Buffer; 10 exclude Sub-step; 11 separate requiredness/Priority; 12 derive applicability from parent; 13 support bounded exceptions; 14 preserve relative timing; 15 keep Buffers non-executable; 16 give real activities unique occurrences; 17 union footprint once; 18 preserve required liability; 19 evaluate composition transactionally; 20 distinguish optional failure; 21 distinguish Composition Failure/Friction; 22 create corrective Friction for authorized failure; 23 apply composite decisions atomically; 24 prevent partial stale replay; 25 separate occurrence/reusable authority; 26 preserve Goal attribution; 27 preserve core/overhead; 28 evaluate full footprint; 29 block impossible Proposals; 30 require acceptance for recurring attachments; 31 freeze historical relations; 32 keep executions unique; 33 preserve plan/actual; 34 derive Found Time without rewrite; 35 protect remaining components; 36 use canonical user-days; 37 version persistence; 38 reject source retargeting; 39 canonicalize/fingerprint; 40 reject generic workflows.

## 101. Downstream Open Questions

Genuinely downstream: authoring/planner UI, drag/drop, terminology/defaults, detailed Friction copy/codes, physical storage and migration order, performance/cache, native timers, Live controls, route-aware duration estimation/providers, advanced applicability predicates, Summary visualization, and Proposal explanation presentation. Identity, ownership, requiredness, pairing, applicability, timing, Capacity, overhead, feasibility, Friction, history, and authority are resolved here.

## 102. Specification Conclusions

Commitment Composition uses normal Commitment sources connected by first-class revisioned relations. Parent occurrences derive deterministic component pairings through bounded applicability; required/optional and timing strictness are independent. Composite views, IDs, footprints, feasibility, failure, and liability are derived without duplicating time. Required core/support/Buffer footprint is visible to Capacity and Proposal; productive Goal Demand remains separate from overhead. Atomic CompositeDecisions preserve relation semantics. History freezes decisive relations and execution records each real activity once. Found Time derives from actual divergence only after remaining components are protected. Existing Work-relative heuristics remain preferences. Scope remains operational composition, not workflow management.

## 103. Recommended Next Step

**Path A — Constructive Proposal Architecture Audit.**

Composition fundamentals now resolve the last identified upstream seam: complete Capacity footprint, Goal-Demand overhead, transactional feasibility, liability/Friction, accepted authority, history, and execution/Found-Time handoffs. Proposal can now be audited against normalized Goal Structure, Demand, Capacity, and composition inputs without inventing any of them. This recommendation begins no audit and establishes no implementation phase.

## 104. Completion Statement

> **Commitment Composition / Attached Activities Architecture Specification complete.**
>
> The specification establishes Commitment Composition as an explicit authority over parent-linked time-owning activities and protected non-activity time; defines Attached Activities, Buffers, Attachment Relationships, source and occurrence pairing, applicability, relative timing, requiredness, lifecycle coupling, composite occurrences, footprint, liability, feasibility, Composition Failure, Friction, composite decisions, Goal Demand overhead, historical provenance, execution variance, Found-Time boundaries, deterministic user-day behavior, persistence, and user-authority semantics; preserves the separation among Goals, Goal Structure, Commitments, Capacity, Goal Demand, Progress, Allocation, Proposal, Friction, scheduled reality, execution, and history; prevents relative placement heuristics, Buffers, or independent recurrence from masquerading as lifecycle-coupled composition; ensures required activity overhead is visible to Capacity and Proposal feasibility without becoming Goal Progress; and identifies the appropriate next architectural step without modifying implementation or assigning the work to a future implementation phase.
