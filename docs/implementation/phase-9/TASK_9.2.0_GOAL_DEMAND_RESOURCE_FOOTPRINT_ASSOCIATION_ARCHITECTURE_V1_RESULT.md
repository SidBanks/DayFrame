# Task 9.2.0 — Goal-Demand Resource Footprint Association Architecture V1 Result

**Status:** Complete  
**Date:** 2026-09-04  
**Task type:** Architecture definition only

## 1. Executive Summary

DayFrame will add a durable reusable `DemandResourceFootprintSpecV1` and a separate demand-specific `DemandResourceFootprintAssociationV1`. The association must explicitly select one specification variant or explicitly declare `productiveOnly`; absence means `unspecified` and fails closed. A pure projection treats each hypothetical Demand session as a derived candidate parent and produces exact productive, support-activity, and Buffer-protection claims before scheduling.

## 2. Architecture-Reopen Context

Task 9.3 exposed incomplete accepted footprint. Task 9.2.1 then proved that current Goal Demand has no authorized pre-scheduling connection to Task 8.4 support/Buffer semantics. This artifact defines that missing semantic layer without implementing it.

## 3. Blocking Evidence

`DemandProjectionV1` carries Goal/Demand but no footprint association; `FeasibleOpportunityV1` carries productive geometry only; `projectCompositeOccurrence` requires a concrete scheduled template parent; generic Goal links carry no footprint role. Allocation and Proposal therefore cannot legitimately infer support or Buffer.

## 4. Scope

This specification fixes authorship, association, candidate identity, component semantics, deterministic projection, downstream contracts, persistence, migration, and provenance for pre-scheduling resource footprint.

## 5. Non-Goals

No production code, UI design, schedule realization, ScheduledBlock identity, execution target, publication origin, recurrence, Progress inference, or automatic planning is included.

## 6. Governing Architecture

The design preserves authored → derived → proposed → accepted → future scheduled transformations; demand-neutral Capacity; single-Demand Feasibility; Task 8.4 Composition authority; and immutable Proposal/Accepted Allocation history.

## 7. Current-System Gap

Composition knows how a scheduled Commitment parent acquires support and Buffer. Goal Demand knows productive effort but has no explicit authority selecting reusable pre-scheduling resource requirements. Neither contract may fill the other’s gap implicitly.

## 8. Canonical New Concept

The canonical authored object is `DemandResourceFootprintSpecV1`. A separate `DemandResourceFootprintAssociationV1` selects how one Demand uses it.

## 9. Canonical Terminology

Use “Demand Resource Footprint Specification,” “Demand Footprint Association,” “Candidate Parent,” and “Projected Resource Footprint.” Do not call the pre-scheduling projection a Commitment or Composition occurrence.

## 10. Footprint Specification Definition

A Demand Resource Footprint Specification is reusable authored authority defining exact deterministic nonproductive resource requirements around a hypothetical productive Demand session. It owns identity, revisions, variants, components, source evidence, and provenance, but no time.

## 11. Authorship Owner

The user owns specifications and associations through Goal Planning authority. The specification is reusable and user-scoped; the association is Demand-specific.

## 12. Association Model

Each current Demand has at most one active association revision. Its selection is either `{kind: "productiveOnly"}` or `{kind: "specification", specificationId, specificationRevision, variantId, selectedOptionalComponentIds}`. No association means `unspecified`.

## 13. Reusable vs Demand-Specific Semantics

Specifications are reusable standing authoring. Associations are scoped to a stable Demand authority ID, not a disposable Demand Projection or individual session. Every split session uses the selected per-session variant.

## 14. Goal Link Boundary

Existing Goal links remain ordinary source associations only. They neither select nor imply a footprint specification. Future UX may help author a specification from a linked template, but it must create explicit new authority.

## 15. Multiple Linked Commitment Semantics

No linked Commitment is selected automatically. If several are available, the user must explicitly create/select one footprint specification and variant; creation time, title, and array order have no meaning.

## 16. Multiple Footprint Specification Semantics

V1 allows many reusable specifications but exactly one active selected specification/variant per Demand. Ambiguous or competing active associations are invalid authority rather than implicit alternatives.

## 17. Candidate Parent Definition

A Candidate Parent is the derived anchor consisting of one legal productive-session candidate plus Demand Projection and selected footprint revision. It is not an occurrence and owns no time.

## 18. Candidate Parent Identity

Identity is the semantic fingerprint of policy version, Goal ID/revision, Demand ID/revision, Demand Projection semantic ID, productive start/end and user-day, specification ID/revision, variant ID, and selected optional component IDs.

## 19. Productive Component

Demand remains the sole source of productive effort. Projection creates exactly one productive claim per Candidate Parent, retaining Goal, Demand, opportunity, Capacity interval, exact half-open geometry, and user-day.

## 20. Support Component

A support definition has a stable component ID, `supportActivity` role, fixed duration, per-session scope, required/optional status, exact relative geometry rule, actor `user`, and direct or Composition-derived source evidence.

## 21. Buffer Component

A Buffer definition has a stable component ID, `bufferProtection` role, per-session scope, required/optional status, target (`productive` or support component), side (`before` or `after`), fixed duration, and source evidence. It is protection, never activity.

## 22. Requiredness

`required` components always project and must fit. `optional` components project only when their IDs are explicitly selected by the association’s current revision.

## 23. Optionality

V1 resolves optional choice at association authoring, before Feasibility. Proposal cannot add optional components. Omitted optional IDs remain explicit in the projected footprint so they cannot reappear downstream.

## 24. Relative Geometry

Support is placed relative to productive start/end using a closed exact rule. Buffer is placed immediately before/after its declared target interval. Every resulting interval is calculable without schedule search.

## 25. Geometry Taxonomy

V1 support rules are `endsAtProductiveStart`, `startsAtProductiveEnd`, or `offsetFromProductiveStart|offsetFromProductiveEnd` with component `start|end` anchor and signed integer offset minutes. Minimum/preferred gaps and flexible windows are excluded because they require placement choice.

## 26. Deterministic Projection

Given validated association, exact spec revision/variant, Candidate Parent, canonical user-day resolver, and bounded Capacity coverage, projection produces byte-equivalent normalized claims independent of input order.

## 27. Projected Resource Footprint

The disposable result contains `productiveClaims`, `supportClaims`, `bufferClaims`, omitted optional IDs, nominal role totals, unioned resource minutes, dependencies, qualification, reasons, fingerprint, and derived provenance.

## 28. Projected Identity

The footprint fingerprint covers the Candidate Parent, every normalized claim, spec/association revisions, policy, omitted optionals, and coverage evidence. Any material geometry, source, requiredness, or selection change changes it.

## 29. Composition Reuse Boundary

Task 8.4 remains the source of compatible relative-placement and Buffer concepts. A footprint component may carry a frozen `compositionRelationship` source snapshot: relationship ID/revision, parent/child endpoints, slot, requiredness, timing, Buffer rule, goal-support role, and semantic fingerprint. Projection uses the normalized spec component, not `projectCompositeOccurrence`.

## 30. No Scheduled Parent Rule

Projection accepts a Candidate Parent value and must never require a scheduled block, template occurrence, Preview, or PlanDecision.

## 31. No Fake Commitment Rule

Implementations must not manufacture temporary BlockTemplates, recurrences, occurrences, or schedule blocks to invoke Composition.

## 32. Cross-User-Day Semantics

Different footprint components may belong to different canonical user-days. Each component’s owner is resolved from its actual start instant using the piecewise canonical boundary policy. V1 rejects an individual support or Buffer claim that itself crosses a canonical user-day boundary; it does not split or clip it.

## 33. Planning-Horizon Interaction

Demand horizon bounds productive candidates. Required footprint may extend into the immediately adjacent canonical user-day on either side, but never beyond one adjacent day in V1.

## 34. Coverage Requirements

Feasibility requires complete Capacity coverage across the union of productive and selected component intervals. Missing adjacent coverage yields `footprintCoverageIncomplete`, never a clipped or productive-only candidate.

## 35. Source Revision

Material component, variant, source snapshot, association, or selection changes append a monotonic revision. Revisions are immutable; retirement is a new revision.

## 36. Provenance

Projected claims preserve spec/component/association IDs and revisions, Goal/Demand/Projection identity, Candidate Parent, source evidence, policy, Capacity reference, exact canonical user-day evidence, and derived provenance.

## 37. Freshness

Specification and association revisions become declared dependencies. Changes stale Feasibility, Competition, Allocation, and Proposal without mutating any historical object.

## 38. Demand Projection Integration

Keep Demand Projection focused on productive Demand. Pair it with a normalized `ResolvedDemandFootprintAssociationV1`; add the association dependency fingerprint to the combined Feasibility input rather than embedding component definitions into Demand Projection.

## 39. Demand Authority Boundary

Demand answers how much productive effort is requested. Footprint authority answers what additional user resource each productive session requires. They are siblings under Goal Planning authority.

## 40. Feasibility Contract

Future input is `{demandProjection, resolvedFootprintAssociation, capacity}`. It remains one-Demand, Priority-free, competition-free, derived, and non-reserving.

## 41. Feasibility Output

Each opportunity contains one exact productive claim and its complete selected support/Buffer claims. Opportunity sets group complete footprints and report productive satisfaction separately from nominal and unioned resource cost.

## 42. Feasibility Failure Modes

Closed reasons include `footprintUnspecified`, `footprintAssociationAmbiguous`, `footprintRevisionMissing`, `unsupportedFootprintRule`, `footprintCoverageIncomplete`, `requiredSupportUnavailable`, `requiredBufferUnavailable`, `componentCrossesUserDay`, and existing productive-fit reasons.

## 43. Competition Contract

Two candidate Demands compete when any exclusive activity claim overlaps another activity/protection claim. Buffer-to-Buffer overlap is union-compatible but retains both provenance claims; it alone does not create two activities.

## 44. Allocation Contract

Allocation consumes already-legal complete opportunity footprints, conserves exclusive claims, unions compatible Buffer overlap for cost, and never invokes footprint or Composition projection.

## 45. Proposal Contract

Proposal snapshots the exact complete Allocation footprint, role totals, union cost, selection, omitted optionals, lineage, and qualification. It neither adds components nor recomputes geometry.

## 46. Accepted Allocation Contract

New acceptance freezes the complete option footprint and exact decision linkage. Productive, support, and Buffer claims remain separately addressable with requiredness and component provenance.

## 47. Required Acceptance Semantics

Accepting productive work authorizes every required component already visible in the offered atomic footprint. Required components cannot be independently removed.

## 48. Optional Acceptance Semantics

Only optional components explicitly selected in the authored association are offered in V1. Changing selection requires a new association revision, regenerated reasoning, and explicit new acceptance.

## 49. Atomic Footprint Semantics

One opportunity/option is one complete resource package. Acceptance and future realization operate all-or-none across its productive and required/selected components.

## 50. Multiple Variant Semantics

A specification may define several named variants, but the Demand association selects exactly one. Exposing variant choice inside Proposal is deferred; no engine silently ranks semantically different variants.

## 51. User Choice Boundary

Any change to component set, requiredness, source, or geometry is material and requires authored association/spec revision before it can enter a Proposal. Mechanical projection of those authored rules requires no additional preference inference.

## 52. Footprint Scope

V1 associations are Demand-specific and components are `perSession`. Goal-wide inheritance, category defaults, one-off overrides, and per-period components are deferred.

## 53. Productive-Only State

`selection.kind = "productiveOnly"` is explicit authored authority. It produces a fully qualified footprint with no support or Buffer claims and participates in dependency fingerprints.

## 54. Unspecified State

No current association—or an unresolved referenced revision—means `unspecified`. Feasibility is unknown/incomplete; it must not assume zero overhead.

## 55. Migration Semantics

Existing Goal Planning V1 data migrates to V2 with empty specifications and associations. Every existing Demand is therefore unspecified until explicitly authored. No support, Buffer, or productive-only authority is inferred.

## 56. Legacy Compatibility

Existing authored schedules, Capacity, and histories remain unchanged. Legacy constructive planning may return incomplete/No-Proposal until a footprint association is resolved. Existing Proposals and Accepted Allocations remain exact productive-only historical records and are not rewritten.

## 57. Template Reuse

An authoring adapter may create a spec from an explicit Task 8.4 relationship revision, copying only duration, exact relative geometry, Buffer, requiredness, endpoints, and provenance. Recurrence, flexible windows, priority, and unrelated template policy do not cross.

## 58. Recurrence Boundary

Reusable per-session footprint does not create Commitment or Goal recurrence. Session repetition comes only from Demand cadence and remains hypothetical until acceptance/realization.

## 59. Commitment Authority Boundary

Referencing or snapshotting a template does not instantiate, schedule, publish, or otherwise exercise Commitment authority.

## 60. Composition Authority Boundary

Concrete Composition still applies to scheduled Commitment occurrences. Footprint projection shares normalized exact geometry vocabulary and provenance, not concrete occurrence authority.

## 61. Buffer Authority Boundary

Projected Buffer is a non-authoritative resource requirement. Only future realization creates protected schedule truth.

## 62. Support Authority Boundary

Projected support is non-authoritative resource cost. Only future realization creates an execution-capable support activity.

## 63. Identity Across Stages

Each stage creates its own semantic identity while retaining prior IDs: component definition → projected claim → feasible claim → allocated claim → proposed claim → accepted claim → future realized fact.

## 64. Component Lineage

Required lineage is spec ID/revision, variant ID, association ID/revision, component ID, source kind/fingerprint, Candidate Parent ID, Goal, Demand, Projection, Capacity interval, and exact interval.

## 65. Shared Component Semantics

V1 prohibits shared support components. Every component is owned by exactly one Candidate Parent. Per-demand reusable setup is deferred because it requires multi-session/global optimization.

## 66. Overlapping Buffer Semantics

Overlapping Buffer claims remain distinct provenance records but their protected time is unioned once for summary/capacity cost. Buffer overlapping any productive/support activity is incompatible unless it protects that same target at a touching boundary rather than positive overlap.

## 67. Overlapping Support Semantics

Support activities use the same single exclusive user-time resource as productive activity. Positive activity/activity or activity/protection overlap is invalid; touching half-open endpoints are legal.

## 68. Resource Dimension

V1 models one exclusive user-time resource only. Equipment, location, other actors, and multi-capacity dimensions are deferred.

## 69. Actor Assumptions

Every V1 support component is performed by the DayFrame user and consumes their Capacity. External-actor support requires a future typed resource dimension and cannot be encoded as V1 support.

## 70. Duration Rules

V1 supports fixed positive integer minutes, maximum 1,440 per component. Proportional formulas, scripts, ranges, and inferred duration are deferred.

## 71. Geometry Rules

Only the closed exact rules in §25 and immediate Buffer-before/after targeting are valid. Unknown enum values fail validation and migration.

## 72. Candidate Move Behavior

Moving productive geometry creates a new Candidate Parent and reprojects every support/Buffer interval. No component geometry is carried forward by offset mutation.

## 73. Candidate Duration Behavior

Fixed component durations remain fixed, but their intervals reproject from the new productive boundary and all identities/fingerprints are recomputed.

## 74. Minimum Session Behavior

Demand minimum/exact session rules validate productive duration before footprint projection. Support and Buffer never contribute toward that minimum.

## 75. Split Demand Behavior

Every productive session in a split opportunity set receives an independent per-session footprint. The set is legal only if all complete footprints fit and conserve resource.

## 76. Component Scope

`perSession` is the only V1 component scope. Validators reject unknown scopes. Per-user-day, per-Demand-period, and shared setup scopes are deferred.

## 77. Reusable Setup Cost

One setup serving several sessions is not supported in V1. Authors must model per-session cost or wait for an explicit shared-component policy; engines must not duplicate a purported shared component.

## 78. User-Day Attribution

Each claim stores its independently resolved canonical user-day label and boundary-policy evidence. It never blindly inherits the productive label.

## 79. Period-Boundary Behavior

Productive claims remain inside Demand coverage. Required components may occupy one adjacent user-day only when exact Capacity coverage exists; otherwise the candidate is incomplete. No hidden week/period expansion occurs.

## 80. Unknown Footprint Handling

Unspecified, missing, retired, ambiguous, or unsupported association evidence produces unknown/incomplete Feasibility, never productive-only fallback.

## 81. No-Proposal Interaction

Downstream Proposal generation maps unresolved decisive footprint evidence to typed `incompleteInput`/No-Proposal rather than presenting an acceptance-safe option.

## 82. Explanation Requirements

Future explanations expose productive minutes, support minutes, Buffer minutes, nominal sum, unioned resource minutes, selected specification/variant, required/selected/omitted components, and source evidence.

## 83. Persistence Ownership

Specifications and associations live in Goal Planning authority because they qualify how Demand consumes planning resources. They use the existing `goalPlanning` object store with tagged `[recordType,id,revision]` records.

## 84. Durability

Authored specification/association revisions are durable and fully retained. Candidate Parents and projected footprints are disposable read models.

## 85. Versioning

Implementation introduces `GoalPlanningAuthorityV2`, `DemandResourceFootprintSpecV1`, and `DemandResourceFootprintAssociationV1`. Material edits append revisions; active histories must be monotonic and uniquely keyed.

## 86. Backup Implications

Task 9.2.1 should introduce Backup V11 because V10 cannot preserve the new authored authority. Schema remains 10 because no IndexedDB store/index/key change is required.

## 87. Restore Implications

V11 restore validates complete histories, one active association per Demand, exact selected spec revision/variant, optional IDs, closed component rules, source snapshots, and referential integrity before atomic installation.

## 88. Deletion Semantics

Specifications are retired by revision, not physically removed while referenced. New resolution becomes unavailable; frozen Proposal/Accepted snapshots remain interpretable.

## 89. Relationship Deletion

Retiring an association affects future projections only. It stales downstream derived results and never rewrites Proposal or acceptance history.

## 90. Proposal Staleness

Any material specification/association revision changes the combined footprint dependency fingerprint and causes full Task 9.2 Proposal revalidation to fail currentness.

## 91. Post-Acceptance Change

New authoring does not alter an Accepted Allocation. Task 9.2.1 must freeze decisive component evidence so later source deletion cannot make history uninterpretable.

## 92. No Retroactive Expansion

Legacy or earlier productive-only acceptance never acquires newly authored support/Buffer. A complete successor requires regenerated Proposal and explicit acceptance.

## 93. Naming Decision

Canonical types are `DemandResourceFootprintSpecV1`, `DemandResourceFootprintAssociationV1`, `DemandSessionCandidateParentV1`, `ProjectedResourceClaimV1`, and `ProjectedResourceFootprintV1`.

## 94. Glossary

- **Resource Footprint Specification:** reusable authored nonproductive resource rules.
- **Footprint Component:** one support activity or Buffer definition.
- **Productive Candidate:** hypothetical Demand-serving interval.
- **Candidate Parent:** deterministic derived anchor for that interval and footprint selection.
- **Projected Resource Footprint:** complete disposable claim package.
- **Productive Claim:** Demand-serving exclusive user-time claim.
- **Support Claim:** non-Demand-serving exclusive activity claim.
- **Buffer Claim:** non-activity protection claim.
- **Required Component:** always included component whose failure invalidates the candidate.
- **Optional Component:** component included only through explicit association selection.
- **Footprint Association:** Demand-specific selection authority.
- **Footprint Variant:** named authored component set inside one reusable specification.

## 95. Architecture Decision Matrix

| Question              | Option A                     | Option B            | Option C                 | Chosen V1                                   | Rationale                                 |
| --------------------- | ---------------------------- | ------------------- | ------------------------ | ------------------------------------------- | ----------------------------------------- |
| authority owner       | Goal                         | Demand              | separate spec            | Separate reusable spec + Demand association | Reuse without implicit inheritance        |
| association scope     | Goal-wide                    | Demand-specific     | explicit reusable ref    | Demand-specific reusable ref                | Smallest unambiguous scope                |
| source reuse          | existing Composition runtime | adapter             | unrelated sibling        | Authored normalization adapter              | Reuses semantics without scheduled parent |
| missing footprint     | productive-only              | unknown             | policy default           | Unknown                                     | No silent zero assumption                 |
| multiple specs        | invalid                      | selectable variants | priority order           | One explicitly selected variant             | No hidden ranking                         |
| split-session support | per-session                  | per-demand          | explicit component scope | Per-session only                            | Avoids global optimization                |
| shared support        | prohibited                   | explicit only       | automatic union          | Prohibited                                  | Single-owner deterministic V1             |
| persistence host      | Goal store                   | Demand store        | sibling store            | Goal Planning existing store                | Semantic ownership; no new DB structure   |

## 96. Data-Flow Diagram

```text
[Authored] Goal ───────────────┐
[Authored] Demand Authority ───┼→ Demand Footprint Association
[Authored] Footprint Spec ─────┘              │
                                              ↓
[Derived] Demand Projection → Productive Candidate / Candidate Parent
                                              │
                                              ↓
                              Projected Resource Footprint
                              ├─ productive claim
                              ├─ support claim(s)
                              └─ Buffer claim(s)
                                              ↓
[Derived] Feasibility → Competition → Allocation
                                              ↓
[Proposed] Proposal                            ↓
[Accepted] Accepted Allocation                ↓
[Future scheduled] Realization
```

## 97. Epistemic Matrix

| Concept                      | Epistemic Class          | Durable? |      Owns Time? |                 User Authority? |
| ---------------------------- | ------------------------ | -------: | --------------: | ------------------------------: |
| Goal                         | Authored                 |      Yes |              No |                             Yes |
| Demand Authority             | Authored                 |      Yes |              No |                             Yes |
| Footprint Association        | Authored                 |      Yes |              No |                             Yes |
| Footprint Specification      | Authored                 |      Yes |              No |                             Yes |
| Demand Projection            | Derived                  |       No |              No |                              No |
| Productive Candidate         | Derived                  |       No |              No |                              No |
| Projected Resource Footprint | Derived                  |       No |              No |                              No |
| Feasibility                  | Derived                  |       No |              No |                              No |
| Allocation                   | Derived                  |       No |              No |                              No |
| Proposal                     | Proposed                 |  History |              No |                              No |
| Accepted Allocation          | Accepted authority       |      Yes | Claims resource |                             Yes |
| Realized schedule            | Future scheduled reality |      Yes |             Yes | Derived from accepted authority |

## 98. Association Matrix

| Situation                        | Required Outcome                                                              |
| -------------------------------- | ----------------------------------------------------------------------------- |
| no footprint spec                | `unspecified`; Feasibility incomplete                                         |
| explicit productive-only         | fully qualified productive claim only                                         |
| one valid footprint spec         | project selected revision/variant exactly                                     |
| multiple specs                   | use sole explicit association selection; multiple active associations invalid |
| missing source revision          | unresolved/unknown; no fallback                                               |
| deleted source                   | retired source blocks new projection; frozen history remains                  |
| unsupported component rule       | invalid authority or incomplete migration                                     |
| support crosses user-day         | candidate invalid; do not split                                               |
| Buffer exceeds Capacity coverage | `footprintCoverageIncomplete`                                                 |
| optional component omitted       | record omission; never project it                                             |
| required component infeasible    | reject candidate with typed reason                                            |
| split Demand                     | project one complete per-session footprint for every session                  |

## 99. Invariant Verification

1. Goal links do not imply footprint association: explicit separate record required.
2. Footprint association is explicit: productive-only or exact spec selection.
3. Missing authority is unknown, never zero.
4. Productive Demand and overhead are separate sibling concepts.
5. Specification is authored durable authority.
6. Projected footprint is derived and disposable.
7. Projected claims own no time.
8. Candidate Parent replaces any scheduled-parent requirement.
9. No fake Commitment occurrence is permitted.
10. Closed exact support geometry is deterministic.
11. Targeted exact Buffer geometry is deterministic.
12. Required components always project or invalidate the candidate.
13. Optional selection is explicit association authority.
14. User-day resolution and cross-boundary rejection are deterministic.
15. Complete selected footprint must fit.
16. Feasibility remains one-Demand reasoning.
17. Capacity remains demand-neutral.
18. Allocation consumes rather than derives footprints.
19. Proposal snapshots rather than derives footprints.
20. New Accepted Allocation freezes the complete footprint.
21. Revision dependencies stale downstream reasoning.
22. Accepted history is never widened retroactively.
23. Reusable footprint does not imply recurrence.
24. Template reference does not imply Commitment scheduling.
25. Projected support is not execution-capable.
26. Projected Buffer is not execution-capable.
27. Exact component/source provenance survives every downstream snapshot.
28. Normalized semantic identity excludes ordering.
29. V1 migration produces unspecified authority, not inferred meaning.
30. Task 9.2.0 changes documentation only.

## 100. Implementation Impact Map

| Layer               | Expected Change                                                    |
| ------------------- | ------------------------------------------------------------------ |
| Goal authoring      | Future selector/editor concept; no Goal-link reinterpretation      |
| Demand authority    | Add sibling association records, not fields on Demand V1           |
| Demand Projection   | Pair with resolved association/dependency input                    |
| Composition         | Extract/share exact geometry vocabulary and authoring adapter only |
| Capacity            | No derivation change; provide bounded complete coverage            |
| Goal Feasibility    | Project and validate complete per-session footprints               |
| Competition         | Use complete exclusive footprint overlap                           |
| Allocation          | Carry/conserve complete claims and union cost                      |
| Proposal            | Snapshot/explain complete footprint                                |
| ProposalDecision    | Exact option/footprint linkage                                     |
| Accepted Allocation | Freeze versioned complete footprint                                |
| Persistence         | Goal Planning V2 records in existing store                         |
| Backup              | V11 plus V10 migration and downgrade refusal                       |
| UI authoring        | Later explicit productive-only/spec/variant selection              |
| Scheduled blocks    | Deferred to 9.2.2                                                  |
| Execution           | Deferred to 9.2.2                                                  |
| HistoricalPlan      | Deferred to 9.2.2                                                  |
| Realization         | Deferred to 9.3                                                    |

## 101. Migration Strategy

Translate Goal Planning V1 to V2 by preserving Demand/Priority bytes and adding empty `footprintSpecifications` and `footprintAssociations`. Absence resolves to `unspecified`. V10 Proposal authority stays unchanged; old Accepted Allocations are classified `legacyProductiveOnly/footprintIncomplete` during Task 9.2.1 translation and receive no new claims. Backup V11 becomes canonical; V10 export is refused when V2 footprint authority or complete Accepted Allocation exists.

## 102. Task 9.2.1 Implementation Contract

Task 9.2.1 shall implement these exact contracts:

```ts
type DemandResourceFootprintSpecV1 = {
  recordType: "demandResourceFootprintSpec";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  status: "active" | "retired";
  name: string;
  variants: Array<{
    id: string;
    name: string;
    components: Array<SupportComponentV1 | BufferComponentV1>;
  }>;
  createdAt: string;
  updatedAt: string;
  provenance: PlanningProvenanceV1;
};

type SupportComponentV1 = {
  id: string;
  role: "supportActivity";
  scope: "perSession";
  requiredness: "required" | "optional";
  durationMinutes: number; // integer 1..1440
  geometry:
    | { kind: "endsAtProductiveStart" | "startsAtProductiveEnd" }
    | {
        kind: "offsetFromProductiveStart" | "offsetFromProductiveEnd";
        anchor: "componentStart" | "componentEnd";
        offsetMinutes: number;
      };
  actor: "user";
  source: DirectSourceV1 | CompositionRelationshipSnapshotV1;
};

type BufferComponentV1 = {
  id: string;
  role: "bufferProtection";
  scope: "perSession";
  requiredness: "required" | "optional";
  target:
    | { kind: "productive" }
    | { kind: "supportComponent"; componentId: string };
  side: "before" | "after";
  durationMinutes: number; // integer 1..1440
  source: DirectSourceV1 | CompositionRelationshipSnapshotV1;
};

type DemandResourceFootprintAssociationV1 = {
  recordType: "demandResourceFootprintAssociation";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  demandId: PlanningFactId;
  status: "active" | "retired";
  selection:
    | { kind: "productiveOnly" }
    | {
        kind: "specification";
        specificationId: PlanningFactId;
        specificationRevision: PlanningRevision;
        variantId: string;
        selectedOptionalComponentIds: string[];
      };
  createdAt: string;
  updatedAt: string;
  provenance: PlanningProvenanceV1;
};
```

`projectDemandResourceFootprint({demandProjection, associationResolution, productiveCandidate, capacity, canonicalUserDayResolver})` returns `projected | incomplete | invalid`. `projected` contains deterministic Candidate Parent identity; one productive claim; normalized selected support and Buffer claims; omitted optional IDs; nominal productive/support/Buffer totals; unioned resource minutes; dependencies/fingerprint/provenance. Claims include role, stable ID, exact `[start,end)`, duration, independently resolved user-day, Capacity reference, requiredness, component/spec/association lineage, Candidate Parent, Goal, Demand, and Projection where applicable.

Validation rules are: one active association per Demand; exact active or historical selected spec revision; one valid variant; unique component IDs; selected optional IDs must name optional components in that variant; required components cannot be omitted; Buffer targets must resolve; all durations positive integers; only closed geometry enums; normalized arrays sorted semantically. Support/activity overlap with any activity/protection invalidates an opportunity; Buffer/Buffer overlaps preserve claims but union cost once. Every component is per-session and single-owner. Each claim must fit wholly within one canonical user-day and complete Capacity coverage extending at most one adjacent user-day.

Feasibility consumes the resolved association and emits complete-footprint opportunities with typed failure reasons. Competition uses all exclusive claims. Allocation never projects; it carries complete footprints, productive satisfaction, role totals, and union cost. Proposal snapshots those bytes and qualifies unresolved footprint as incomplete. New acceptance conflict-checks every claim and freezes the complete footprint. Modification must regenerate through Feasibility; claim-only trimming cannot remove required components. Footprint spec/association dependencies participate in every downstream fingerprint.

Persistence uses `GoalPlanningAuthorityV2` in the existing `goalPlanning` store; IndexedDB schema stays 10. Backup advances to V11. V10 migration creates empty specs/associations and unspecified resolution. Complete authority cannot downgrade to V10. Legacy Accepted Allocation remains immutable and is explicitly translated/classified as incomplete productive-only with no inferred support or Buffer; any complete successor requires regenerated Proposal and explicit acceptance.

## 103. Task 9.2.2 Impact

Task 9.2.2 must define scheduled productive/support/protection roles, stable realized subject identity, executable activity references, non-executable Buffer references, and HistoricalPlan/publication origin capable of retaining the claim lineage defined here. It must not change this authorship or projection policy.

## 104. Task 9.3 Impact

Task 9.3 will consume only a complete Accepted Allocation footprint, materialize its exact claims atomically/idempotently, and refuse legacy incomplete acceptance. It must not re-resolve the current footprint specification or recompute candidate geometry.

## 105. Architecture Reopen Resolution

All twenty resolution questions are answered: object, owner, association, productive-only/unknown, Candidate Parent, geometry, requiredness, split/cross-day behavior, multiple definitions, Composition reuse, Feasibility/Competition/Allocation/Proposal/acceptance flow, dependencies, and migration. The semantic Task 9.2 reopen is resolved. Implementation remains intentionally sequenced.

## 106. Recommended Next Task

Proceed with Task 9.2.1 — Accepted Resource Footprint Propagation V1 using §102 as the normative implementation contract. After it passes, complete Task 9.2.2 before resuming Task 9.3.

## 107. Completion Statement

**Task 9.2.0 — Goal-Demand Resource Footprint Association Architecture V1 complete.**

DayFrame now has a fully specified pre-scheduling architecture for associating Goal Demand with explicit resource-footprint authority before any concrete scheduled parent exists: productive Goal Demand remains distinct from its nonproductive resource cost, while a durable authored Demand Resource Footprint Specification explicitly defines the support activities and Buffer protection that accompany hypothetical Demand-serving sessions; Goal links remain ordinary Goal associations and do not silently acquire footprint semantics, missing footprint authority remains distinguishable from an explicitly productive-only definition, and multiple possible sources or variants follow explicit deterministic selection rather than creation order or inference; hypothetical productive sessions act as derived Candidate Parents without becoming scheduled Commitments, and pure footprint projection deterministically produces exact productive, support, and Buffer claims with requiredness, component identity, canonical user-day behavior, source revision, and provenance across bounded candidate geometry; required support and protection are part of complete candidate Feasibility, projected claims own no time and reserve no Capacity, Goal-Specific Feasibility remains single-Demand reasoning over demand-neutral Capacity, and future Competition/Allocation will operate on complete already-derived resource footprints rather than re-running Composition or inventing hidden resource cost; the architecture defines revision, freshness, persistence, migration, productive-only versus unspecified states, multiple-footprint behavior, split-session/component scope, Composition reuse, and lineage across Projection → Feasibility → Allocation → Proposal → Accepted Allocation; historical accepted authority is never retroactively widened and no schedule, execution, publication, recurrence, or Progress authority is introduced; the Task 9.2 architecture reopen is resolved at the semantic layer, Task 9.2.1 is authorized to implement complete resource-footprint propagation, and Tasks 9.2.2 and 9.3 remain intentionally blocked in sequence until that implementation succeeds.
