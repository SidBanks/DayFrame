# Task 9.8B — Constructive Planning Reachability & Pre-Migration Convergence V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Bounded Implementation / Correctness Repair / Lifecycle Connection / Product Reachability  
**Predecessor:** Task 9.8A — Post-Dogfood Product Reachability & Workflow Audit  
**Primary Governing Evidence:** `TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md`  
**Required Durable Output:** Phase 9 result artifact with `RESULT` in the filename  

---

## 1. Objective

Implement the minimum bounded convergence work required to make DayFrame's existing constructive planning architecture meaningfully reachable through ordinary production interaction before the Planner/Summary shell migration begins.

Task 9.8A established that the Phase 8/9 constructive planning architecture substantially exists, but ordinary product reachability stops almost immediately after Goal authoring.

The current first confirmed constructive breakpoint is:

    Goal
        ↓
    Demand
        ✕ ordinary production reachability stops

Subsequent canonical capabilities already exist:

    Demand
        ↓
    Priority
        ↓
    Projection
        ↓
    Capacity
        ↓
    Feasibility
        ↓
    Competition
        ↓
    Allocation
        ↓
    Proposal / No-Proposal
        ↓
    ProposalDecision
        ↓
    Accepted Allocation
        ↓
    Realization
        ↓
    Scheduled Goal Work
        ↓
    Review
        ↓
    Publication

Task 9.8B must connect this existing architecture into one ordinary, testable constructive workflow without replacing the established domain engines or weakening their authority boundaries.

The primary completion outcome is:

> **Starting from ordinary production UI and a fresh Goal, a user can provide the planning intent required by the existing architecture, DayFrame can evaluate that Goal against current planning truth and Capacity, produce either an explainable Proposal or No-Proposal result, the user can explicitly accept or reject a Proposal, an accepted allocation can realize into scheduled Goal work, and that realized work can reach Review and explicit Publication without bypassing any established authority transition.**

Task 9.8B also repairs the two correctness defects confirmed by Task 9.8A:

1. buffered overnight `afterWork` placement can incorrectly reject a valid post-Work opening;
2. `Resolve schedule conflicts` currently targets a nonexistent UI element and silently fails to open the existing Friction workflow.

Task 9.8B is **not** the two-surface UI migration.

It is the bounded convergence task that makes the architecture worth migrating.

---

## 2. Governing Evidence

Task 9.8A is authoritative for the current reachability diagnosis.

Do not re-audit the entire application unless implementation evidence contradicts the audit.

The following findings are governing inputs.

### 2.1 Constructive architecture exists

Task 9.8A confirmed existing production implementations for:

- Goal Structure;
- Goal Demand;
- Goal Priority;
- Demand Projection;
- resource-footprint specification and association;
- Capacity;
- Goal-specific Feasibility;
- Competition;
- Allocation;
- Proposal / No-Proposal derivation;
- durable Proposal recording;
- Proposal acceptance and rejection;
- acceptance revalidation;
- Accepted Allocation;
- Realization;
- Scheduled Goal Work;
- Scheduled Support Activity;
- Realized Buffer Protection;
- Planning Review;
- explicit schedule publication.

Do not rebuild these capabilities.

---

### 2.2 First ordinary reachability breakpoint

Task 9.8A confirmed:

> Goal authoring does not create or expose Demand authoring.

Goal measurement is not Demand.

A Goal's quantity target must not be reinterpreted as planning effort.

Demand remains independent authored planning intent.

---

### 2.3 Additional constructive connection gaps

Task 9.8A confirmed that ordinary production UI also does not expose or initiate:

- Goal Structure authoring;
- Demand authoring;
- Priority authoring;
- resource-footprint authoring/association;
- Capacity evaluation/display;
- Feasibility evaluation/display;
- Competition/Allocation initiation;
- Proposal derivation;
- Proposal recording;
- typed No-Proposal presentation.

Existing Review Schedule UI can consume an already-existing Proposal and invoke canonical accept/reject commands.

Therefore the missing ordinary lifecycle is primarily upstream of existing ProposalDecision handling.

---

### 2.4 Acceptance and Realization already work

Task 9.8A confirmed that successful Proposal acceptance:

1. revalidates current inputs;
2. records ProposalDecision;
3. creates Accepted Allocation;
4. invokes the existing Realization callback;
5. preserves accepted authority if Realization subsequently fails.

Do not replace this path with a new combined scheduling command.

Acceptance and Realization must remain distinct authority transitions.

---

### 2.5 Publication already works

Task 9.8A confirmed that publication is an explicit ordinary production workflow.

The existing path is approximately:

    Planner
        ↓
    Review Schedule
        ↓
    Generate / Refresh Preview when required
        ↓
    Resolve blockers
        ↓
    Publish Schedule
        ↓
    Immutable Published Plan
        ↓
    Today / Plan History / Summary

Do not create a second publication mechanism.

Do not restore implicit publication from Preview generation.

---

### 2.6 Confirmed placement defect

Task 9.8A reproduced a buffered overnight `afterWork` defect.

When Work ends beyond the ordinary placement boundary, the post-Work search-window extension accounts for:

    duration + bufferAfter

but omits:

    bufferBefore

The resulting search window can reject an otherwise valid free post-Work footprint.

The repair must be based on the full required candidate footprint.

---

### 2.7 `beforeWork` remains unresolved

Task 9.8A did **not** reproduce the previously reported `beforeWork` overlap.

Controlled day and overnight scenarios placed correctly.

Existing tests also cover successful `beforeWork` behavior.

Therefore:

> **Do not modify `beforeWork` semantics merely because Dogfood Pass 02 reported a failure.**

Add appropriate regression coverage where useful, but do not invent a repair without a reproducible defect.

If implementation work reveals a reproducible `beforeWork` defect, document the exact case and stop before broadening Task 9.8B unless the repair is clearly within the same confirmed placement invariant.

---

### 2.8 Confirmed Resolve Friction defect

Task 9.8A confirmed that the visible `Resolve schedule conflicts` action attempts to focus:

    preview-heading

No production element has that ID.

The downstream Friction / SuggestedFix / PlanDecision workflow exists.

Repair the entry point.

Do not replace the corrective planning engine.

---

## 3. Hard Scope Boundaries

Task 9.8B must remain bounded.

### 3.1 In scope

The task may:

- repair the confirmed buffered overnight `afterWork` defect;
- repair the broken Resolve schedule conflicts entry;
- expose existing constructive planning inputs required for an ordinary Goal;
- connect existing Demand/Priority/resource-footprint commands to production UI;
- invoke existing Projection/Capacity/Feasibility/Competition/Allocation paths;
- derive existing Proposal / No-Proposal results;
- durably record canonical Proposals through existing commands;
- expose understandable constructive-planning status/results;
- reuse existing Proposal acceptance/rejection;
- reuse existing Accepted Allocation creation;
- reuse existing Realization;
- expose accepted-but-unrealized retry/recovery if necessary for the ordinary path;
- ensure realized Goal work is visible enough to verify scheduling;
- reuse existing Review Schedule;
- reuse existing publication;
- add or update tests required to prove ordinary product reachability;
- make small bounded UI changes required to exercise these capabilities.

---

### 3.2 Explicitly out of scope

Do **not** implement:

- Planner/Summary two-surface shell migration;
- removal of Today;
- shared Day Worksurface migration;
- `My Schedule` navigation hierarchy;
- continuous/rolling calendar policy;
- external calendar ingestion;
- holiday-provider redesign;
- Found Time architecture;
- execution-derived measured Goal Progress;
- recurring Goal Demand;
- automatic rolling Goal Demand;
- bulk Work-pattern authoring;
- bulk Friction resolution;
- broad Summary redesign;
- Summary pagination/grouping system;
- general terminology migration;
- complete Commitment-editor redesign;
- Sleep baseline policy redesign;
- broad Planning Range redesign;
- Preview navigator retirement;
- automatic AI/LLM planning authority.

Do not opportunistically implement deferred Dogfood Pass 02 requests merely because nearby files are being touched.

---

## 4. Architectural Invariants

All existing DayFrame authority and epistemic boundaries remain binding.

### 4.1 Constructive authority chain

Preserve:

    Authored Goal
        ↓
    Authored Demand / Priority / Footprint Intent
        ↓
    Derived Projection
        ↓
    Derived Capacity
        ↓
    Derived Feasibility
        ↓
    Derived Competition
        ↓
    Provisional Allocation
        ↓
    Non-authoritative Proposal
        ↓
    Explicit ProposalDecision
        ↓
    Accepted Allocation
        ↓
    Realization
        ↓
    Scheduled Reality

Do not collapse these into a single "schedule Goal" mutation.

---

### 4.2 Proposal authority

A Proposal:

- does not own time;
- does not alter the schedule;
- does not become Accepted Allocation without explicit user acceptance;
- must not silently become accepted because it is preferred;
- must not be treated as publication;
- must not be treated as execution.

---

### 4.3 Accepted Allocation authority

Accepted Allocation:

- is durable planning authority;
- does not itself own scheduled time;
- must remain historically valid even if Realization fails;
- must not be duplicated by retrying acceptance;
- must not be silently discarded because realization could not complete.

---

### 4.4 Realization authority

Only successful Realization creates the corresponding scheduled ownership.

Preserve role distinctions:

- Productive Goal Work;
- Support Activity;
- Buffer Protection.

Buffer remains protective nonactivity.

Do not make Buffer execution-reportable.

---

### 4.5 Capacity

Capacity remains:

- derived;
- demand-neutral;
- bounded;
- canonical-user-day aware;
- dependent on sufficient planning truth;
- distinct from Allocation;
- distinct from scheduled ownership.

Unknown/unavailable Capacity must never be represented as zero available time.

---

### 4.6 Feasibility

Feasibility remains Goal/Demand-specific.

Do not convert Feasibility into:

- ranking;
- scoring;
- automatic user preference;
- scheduling authority.

Typed unknown/stale/unavailable/structural outcomes must remain distinguishable.

---

### 4.7 Competition and Friction

Competition is not Friction.

Competition concerns multiple valid demands competing for bounded Capacity.

Friction concerns incompatibility among authorized/scheduled facts.

Do not route constructive Goal planning through SuggestedFix.

Do not route corrective scheduling through Proposal.

---

### 4.8 Publication

Publication remains:

- explicit;
- user-authorized;
- bounded;
- atomic;
- immutable;
- independent from Preview generation.

No implementation in this task may implicitly publish because a Proposal was accepted or Realization succeeded.

---

## 5. Constructive Planning Product Workflow

Implement one coherent ordinary product workflow using existing canonical capabilities.

The exact visual arrangement may remain transitional because the shell migration has not begun.

The workflow must nevertheless be understandable and reachable without test fixtures, direct store calls, browser-console manipulation, or imported authority.

At minimum the user must be able to progress through:

    Create / Select Goal
        ↓
    Configure Planning Intent
        ↓
    Evaluate Planning Opportunity
        ↓
    Proposal or Explainable No-Proposal
        ↓
    Accept / Reject Proposal
        ↓
    Realization
        ↓
    Review Scheduled Result
        ↓
    Explicit Publication

---

## 6. Goal Planning Intent Authoring

### 6.1 Demand authoring

Expose the existing canonical Demand model sufficiently for an ordinary user to create valid Demand for an existing Goal.

Do not create a parallel UI-only Demand object.

Use the existing Demand authority and revision commands.

The workflow must support the currently required semantics of the canonical Demand model, including as applicable:

- requested effort;
- bounded horizon;
- session shape;
- satisfaction requirements;
- cadence.

Do not silently derive Demand from Goal measurement.

---

### 6.2 Human-facing duration input

Where Demand effort/session duration is time-based, use human-facing duration controls rather than requiring users to calculate raw minutes unnecessarily.

Internally retain the existing canonical minute representation.

A user should be able to understand values such as:

    1 hour
    1 hour 30 minutes
    45 minutes

without requiring a new duration domain model.

This is a bounded authoring affordance, not authorization for a global duration-control redesign.

---

### 6.3 Priority authoring

Expose existing Goal Priority authoring sufficiently for constructive planning.

Use the canonical Priority model.

Do not substitute:

- Commitment scheduling priority;
- Goal measurement importance;
- UI ordering;
- inferred user preference.

Priority must remain explicit authored planning intent.

---

## 7. Resource Footprint Authoring

Task 9.8A confirmed that Feasibility can return unknown when the Demand's required resource footprint is unspecified.

Therefore the ordinary constructive path must provide enough footprint intent to permit legitimate evaluation.

Use the existing:

- Resource Footprint Specification;
- footprint association;
- productive/support/buffer role architecture.

Do not silently assume that all Demand consists only of productive minutes unless the existing architecture explicitly supports an authored/default representation that means exactly that.

If a simple productive-only footprint is valid under current architecture, the UI may make that ordinary case easy to author.

The resulting authority must still be explicit and canonical.

Preserve:

    Productive
    Support
    Buffer

as semantically distinct roles.

---

## 8. Goal Structure Boundary

Goal Structure exists but is not required to prove the minimum ordinary constructive path for a simple standalone Goal.

Task 9.8B does **not** require a complete Goal Structure editor unless current production semantics make Structure mandatory for the chosen ordinary Goal workflow.

Do not build a large decomposition UI merely because the commands exist.

However:

- existing Goal Structure semantics must continue to affect eligibility where applicable;
- constructive evaluation must not bypass structural eligibility;
- any structurally ineligible Goal must produce the existing typed result rather than being scheduled anyway.

Goal Structure authoring may remain a documented reachability gap for later work if it is not necessary for this bounded path.

---

## 9. Constructive Evaluation Command Path

Connect the existing evaluation architecture rather than recreating it.

The ordinary production workflow must invoke the canonical path for:

    Demand
        ↓
    Projection
        ↓
    Capacity
        ↓
    Feasibility
        ↓
    Competition
        ↓
    Allocation

Reuse existing production application/state surfaces.

Do not duplicate the algorithms in UI code.

Do not construct a fake Proposal directly from open calendar space.

---

## 10. Capacity Presentation

Capacity must become visible enough to support the constructive workflow.

This does **not** require a complete future Summary Capacity experience.

The user must at minimum be able to distinguish:

- sufficient known Capacity;
- insufficient known Capacity;
- partial/qualified Capacity;
- unavailable Capacity;
- unknown Capacity;
- stale planning truth;
- insufficient planning coverage.

Do not present unknown/unavailable as:

    0 hours available

unless the canonical result actually represents known zero Capacity.

The product should answer, at the appropriate level:

> **Does DayFrame currently know enough about this planning horizon to evaluate this Goal?**

and, where it does:

> **Is there sufficient usable Capacity for this Demand?**

Use existing typed results rather than flattening them into generic success/failure.

---

## 11. Feasibility Presentation

Expose enough of existing Feasibility results for a user to understand why constructive planning can or cannot continue.

At minimum preserve meaningful distinctions such as:

- feasible;
- partially feasible;
- infeasible;
- structurally ineligible;
- conditional;
- unknown;
- stale;
- unavailable coverage;
- insufficient total duration;
- insufficient contiguous duration;
- session constraints;
- footprint/resource constraints.

Do not expose raw type names merely because they are convenient.

Translate into concise user-facing language while preserving the underlying semantic distinctions.

Do not redesign the full DayFrame language system in this task.

---

## 12. Competition and Allocation

Use the existing Competition and Allocation implementation.

The workflow must correctly handle:

- a single eligible Demand;
- multiple competing Demands where existing architecture supports them;
- current Goal Priority;
- bounded Capacity conservation;
- partially allocated Demand;
- unallocated portions;
- unknown/unallocatable input.

Do not make Allocation authoritative.

Do not write Allocation directly into the schedule.

Do not automatically accept the highest-priority result.

---

## 13. Proposal Derivation and Recording

Connect canonical Allocation output to the existing Proposal derivation path.

The ordinary workflow must support:

    Allocation
        ↓
    derive Proposal / No-Proposal
        ↓
    durable Proposal recording when appropriate
        ↓
    existing Review / ProposalDecision controls

Use existing Proposal identities and persistence.

Do not create a second UI-only "Planning Candidate" model.

Do not reinterpret Commitment `BlockCandidate` as a Goal Proposal.

---

## 14. No-Proposal Handling

Typed No-Proposal is a legitimate constructive result.

Expose it as an understandable planning outcome.

The user must be able to distinguish, as supported by existing typed results:

- no valid proposal because the Goal cannot currently fit;
- insufficient or unavailable planning truth;
- structurally inapplicable Goal;
- invalid horizon/input;
- other existing typed abstention reasons.

Do not create a fake Proposal merely to avoid an empty result.

Do not persist No-Proposal as Proposal authority unless the existing architecture explicitly defines such persistence.

The UI must make clear that:

> DayFrame evaluated the request but does not currently have a valid proposal.

where that is the actual canonical result.

---

## 15. Proposal Decision Reuse

Reuse the existing Review Schedule Proposal controls and canonical ProposalDecision commands where practical.

Preserve:

- explicit acceptance;
- explicit rejection;
- acceptance revalidation;
- stale/conflicting-input rejection;
- immutable Accepted Allocation creation;
- rejection without Accepted Allocation.

Do not add an automatic acceptance path.

If a transitional constructive workflow presents Proposal results before Review Schedule, it must either:

1. route the user into the canonical Review Schedule decision controls; or
2. reuse the exact same canonical ProposalDecision commands and semantics.

Do not create a separate decision authority.

---

## 16. Accepted Allocation and Realization

Preserve the existing acceptance → realization callback.

The expected successful path remains:

    Accept Proposal
        ↓
    Revalidate
        ↓
    ProposalDecision
        ↓
    Accepted Allocation
        ↓
    Realization Attempt
        ↓
    Realized Schedule Facts

Do not make acceptance and realization one atomic authority transition.

---

### 16.1 Realization failure

Task 9.8A confirmed a current reachability gap after successful acceptance if Realization fails.

Provide the minimum product-reachable recovery necessary to avoid a dead-end Accepted Allocation.

The user must be able to understand:

- Proposal was accepted;
- Accepted Allocation still exists;
- scheduled realization has not completed;
- why Realization failed where a typed reason exists;
- that retrying Realization does not require accepting again.

Reuse the existing idempotent Realization command.

Do not create duplicate Accepted Allocations.

Do not silently discard the accepted authority.

---

## 17. Scheduled Goal Work Visibility

After successful Realization, the user must be able to verify that scheduled Goal work exists.

Task 9.8A confirmed that realized facts can appear in Canonical Planning Review but are not fully integrated into the primary Month/Selected Day inventory.

Implement the minimum connection required so that ordinary users can identify realized:

- Goal Work;
- Support Activity;
- Buffer Protection

in the relevant planning/day context.

Preserve the distinction between activity and protection.

Do not present Buffer as a task to perform.

Do not undertake the full Day Worksurface migration.

This is a reachability/verification connection only.

---

## 18. Review and Publication

The constructive path must terminate in the existing canonical Review Schedule and publication workflow.

A successfully realized Goal allocation must be reviewable alongside existing schedule facts.

The user must be able to reach:

    Realized Goal Work
        ↓
    Review Schedule
        ↓
    Publish Schedule
        ↓
    Published Plan

without:

- regenerating authority incorrectly;
- creating a second publication path;
- bypassing Friction;
- bypassing accepted-unrealized blockers;
- implicitly publishing.

Preserve existing publication readiness rules.

---

## 19. Correctness Repair A — Buffered Overnight `afterWork`

Repair the confirmed `afterWork` placement defect identified by Task 9.8A.

### 19.1 Required invariant

For an `afterWork` candidate, the placement search window must be large enough to represent the complete candidate footprint:

    bufferBefore
    + duration
    + bufferAfter

when extending beyond the ordinary placement boundary after an overnight Work interval.

A valid free post-Work placement must not be rejected merely because the search-window extension omitted `bufferBefore`.

---

### 19.2 Required regression scenario

At minimum add production-path regression coverage equivalent to:

- Night Work: 21:45–06:15;
- crosses midnight;
- candidate duration: 60 minutes;
- buffer before: 30 minutes;
- buffer after: 30 minutes;
- preferred window: `afterWork`;
- free post-Work space exists;
- expected activity start: 06:45 where canonical bounds permit;
- no overlap with Work;
- full before/activity/after footprint fits;
- no false unplaced result.

Also preserve:

- ordinary day `afterWork`;
- zero-buffer overnight `afterWork`;
- canonical visible-range clipping;
- genuine no-opening behavior.

Do not broaden placement windows beyond what the canonical full footprint requires.

---

## 20. `beforeWork` Regression Boundary

Do not implement an unproven `beforeWork` repair.

Add or preserve regression coverage sufficient to protect currently confirmed behavior for:

- day Work + `beforeWork`;
- overnight Work + `beforeWork`;
- buffers;
- canonical user-day boundary;
- no overlap with Work.

If the exact Dogfood Pass 02 failure becomes reproducible during this task:

1. document the precise authored setup;
2. identify the specific violated invariant;
3. determine whether the defect shares the same bounded footprint calculation;
4. only repair it if the change is clearly within this task's placement-correctness scope;
5. otherwise record it in the RESULT as a follow-up.

Do not alter correct behavior merely to force the historical observation to disappear.

---

## 21. Correctness Repair B — Resolve Schedule Conflicts

Repair the existing `Resolve schedule conflicts` entry point.

The action must lead the user to the existing Friction-resolution workflow.

Do not:

- create a second Friction engine;
- automatically apply fixes;
- silently mutate schedule authority;
- implement bulk resolution;
- treat Proposal decisions as conflict resolution.

The repaired control must:

- target a real mounted destination;
- work through keyboard and pointer interaction;
- place focus meaningfully where appropriate;
- expose the existing individual Friction/SuggestedFix workflow;
- continue respecting stale Preview behavior;
- continue requiring explicit user action for corrective changes.

Add integration coverage at the application-shell level so a supplied callback test cannot pass while the real destination is absent.

---

## 22. Product Reachability and Navigation

Task 9.8B may add minimal entry points required for the constructive workflow.

At minimum ensure that a user can discover:

- Goals;
- Goal planning intent;
- evaluation/proposal action;
- current planning result;
- Review Schedule.

Do not redesign the entire Planner navigation hierarchy.

A temporary/transitional entry is acceptable if:

- it uses canonical commands;
- it is clearly understandable;
- it can later migrate into the two-surface shell without creating new authority;
- it does not duplicate domain state.

Avoid building large old-shell-only UI that will immediately be discarded.

---

## 23. Global Goal Reachability

Task 9.8A confirmed that Goal authoring is canonically independent but buried under Month Planning Settings.

Provide a minimally discoverable Planner-level route to the existing Goal workflow if necessary to support the constructive path.

Reuse the existing Goal editor.

Do not create a second Goal store or duplicate Goal form.

This is a reachability improvement, not the final Planner navigation design.

---

## 24. Historical Reporting Boundary

Task 9.8A confirmed that general historical execution commands and an arbitrary-date reporting component already exist but are not mounted.

This is a real reachability gap, but it is not required to prove the fresh Goal → Proposal → Realization → Publication constructive lifecycle.

Therefore historical reporting is **optional in Task 9.8B**.

It may be connected only if:

- the change is small and isolated;
- it reuses the existing reporting component and commands;
- it does not trigger Day Worksurface migration;
- it does not expand the task materially.

Otherwise document it for the migration task.

Do not redesign execution history here.

---

## 25. Found Time Boundary

Found Time is explicitly out of scope.

Task 9.8A found only a provenance discriminator, not a complete canonical Found Time lifecycle.

Do not create an ad hoc Found Time model as part of Goal planning convergence.

Do not reinterpret:

- manual Event;
- Goal source link;
- unplanned execution record;
- Proposal acceptance

as Found Time merely to make the dogfood scenario appear connected.

Preserve existing identities.

The RESULT must explicitly state that Found Time remains deferred if no separately authorized architecture exists.

---

## 26. Progress Boundary

Execution-derived measured Goal Progress is explicitly out of scope.

Current Goal Progress is based on manual quantity observations.

Do not automatically convert:

- scheduled duration;
- realized duration;
- reported execution duration;
- Event duration

into Goal Progress observations.

Do not make `Record New Value` additive unless separately specified.

Constructive planning completion for this task ends at scheduled/published reachability, not automatic Goal Progress.

Existing Goal Activity/history may continue to report execution evidence independently.

---

## 27. Persistence and Schema Governance

Prefer no persistence/schema migration unless the existing canonical surfaces require one for ordinary reachability.

Task 9.8B should primarily connect already-existing persisted authority.

If a schema change appears necessary:

1. establish why existing canonical authority cannot represent the required state;
2. document the evidence;
3. preserve backward compatibility;
4. add migration/backup coverage;
5. do not create duplicate representations merely for UI convenience.

Do not persist derived Capacity, Feasibility, Competition, or Allocation merely to make the UI easier to render.

Preserve existing persistence distinctions.

---

## 28. Required End-to-End Product Test

Add at least one integration-level test proving the ordinary constructive path without seeding a preexisting Proposal.

The test must begin from production-reachable authored state and use ordinary production commands/UI interactions.

At minimum prove:

    Fresh Goal
        ↓
    Planning Intent Authored
        ↓
    Demand Exists
        ↓
    Priority / Required Footprint Intent Exists
        ↓
    Current Schedule / Capacity Evaluated
        ↓
    Feasibility / Allocation Evaluated
        ↓
    Proposal Derived
        ↓
    Proposal Recorded
        ↓
    Proposal Visible
        ↓
    User Explicitly Accepts
        ↓
    Accepted Allocation Exists
        ↓
    Realization Exists
        ↓
    Scheduled Goal Work Exists
        ↓
    Review Sees Scheduled Goal Work
        ↓
    Explicit Publication Succeeds

Do not construct the Proposal directly in the test fixture.

Do not call internal domain constructors in place of the product workflow being proven.

Lower-level setup helpers may establish unrelated baseline Work/Commitment schedule facts where necessary, but the Goal constructive lifecycle itself must be traversed through the production path under test.

---

## 29. Required No-Proposal Test

Add at least one ordinary production-path test where constructive evaluation legitimately produces no Proposal.

The test must verify:

- no Accepted Allocation is created;
- no Realization is created;
- no schedule time is silently claimed;
- no publication occurs;
- the user receives an understandable result;
- typed canonical reason distinctions are preserved.

Where appropriate also cover unknown/unavailable Capacity separately from known infeasibility.

Known zero and unknown must not collapse into the same UI state.

---

## 30. Required Revalidation Test

Preserve or extend coverage proving that a Proposal cannot be accepted against stale or materially changed planning inputs.

At minimum demonstrate:

    Proposal derived
        ↓
    decisive input changes
        ↓
    user attempts acceptance
        ↓
    canonical revalidation prevents stale acceptance
        ↓
    no invalid Accepted Allocation is created

Do not bypass revalidation merely because Proposal creation and acceptance now occur closer together in the UI.

---

## 31. Required Realization Recovery Test

If Task 9.8B exposes Realization retry/recovery, add coverage proving:

1. Proposal acceptance succeeds;
2. Accepted Allocation is durable;
3. initial Realization fails with a canonical reason;
4. no partial realized footprint is written;
5. user can retry through the exposed recovery path;
6. retry does not create a second Accepted Allocation;
7. successful retry produces exactly one canonical Realization.

If no recovery UI is required by the implemented ordinary success path, document why and retain the audit finding as a known reachability gap.

However, do not leave an exposed accepted-but-unrealized state with no understandable product action if the new workflow can ordinarily produce it.

---

## 32. Required Placement Tests

Add or update tests covering at minimum:

| Work Shape | Preferred Window | Buffers | Required Result |
|---|---|---|---|
| Day Work | `afterWork` | 30m before / 30m after | Valid post-Work placement |
| Night Work | `afterWork` | 30m before / 30m after | Valid post-Work placement when full footprint fits |
| Night Work | `afterWork` | none | Existing behavior preserved |
| Day Work | `beforeWork` | 30m before / 30m after | No Work overlap |
| Night Work | `beforeWork` | 30m before / 30m after | No Work overlap |
| Night Work | `anyAvailable` | 30m before / 30m after | Existing valid free placement preserved |
| Night Work | `afterWork` | full footprint cannot fit | Correctly remains unplaced |

Use production generator coverage where the defect depends on production boundary/context setup.

Do not rely solely on isolated low-level placer tests.

---

## 33. Required Resolve Friction Integration Test

Add an application-level test proving:

    Friction exists
        ↓
    Review exposes Resolve schedule conflicts
        ↓
    User activates control
        ↓
    Real mounted Friction workflow becomes reachable/focused
        ↓
    Existing SuggestedFix controls remain available
        ↓
    No fix is automatically accepted

The test must fail if the destination element is absent.

Do not test only a mocked callback.

---

## 34. Required Reachability Matrix After Implementation

The RESULT artifact must include an updated matrix for at least:

| Capability | Before 9.8B | After 9.8B | Evidence |
|---|---|---|---|
| Goal creation | Discoverability defect | | |
| Demand authoring | UI unexposed | | |
| Priority authoring | UI unexposed | | |
| Resource footprint intent | UI unexposed | | |
| Capacity evaluation | UI unexposed | | |
| Feasibility result | UI unexposed | | |
| Competition / Allocation initiation | UI unexposed | | |
| Proposal derivation | Disconnected | | |
| No-Proposal presentation | UI unexposed | | |
| Proposal acceptance | Conditional / disconnected upstream | | |
| Accepted Allocation | Conditional / disconnected upstream | | |
| Realization | Conditional / disconnected upstream | | |
| Scheduled Goal Work visibility | Partial | | |
| Review | Reachable | | |
| Publication | Reachable / discoverability defect | | |
| Resolve schedule conflicts | Exposed incorrect | | |
| Buffered overnight afterWork | Exposed incorrect | | |

Do not mark a capability reachable merely because a test directly calls its store command.

---

## 35. Required Authority Transition Verification

For the completed constructive workflow, explicitly verify:

| Transition | Must Be |
|---|---|
| Goal → Demand | Explicit authored intent |
| Demand → Projection | Derived |
| Schedule → Capacity | Derived |
| Demand + Capacity → Feasibility | Derived |
| Feasible competing Demands → Allocation | Derived / provisional |
| Allocation → Proposal | Non-authoritative proposed action |
| Proposal → ProposalDecision | Explicit user decision |
| Accepted Proposal → Accepted Allocation | Durable accepted authority |
| Accepted Allocation → Realization | Explicit canonical realization operation / existing callback |
| Realization → scheduled facts | Time-owning/protective schedule truth |
| Schedule → Publication | Explicit user-authorized immutable publication |
| Publication → Execution | Separate later evidence lifecycle |

Any implementation that collapses one of these authority transitions must be rejected.

---

## 36. Required UI State Handling

The constructive workflow must handle at least:

- no Goal selected;
- Goal without Demand;
- incomplete Demand;
- incomplete/unspecified required footprint;
- planning truth unavailable;
- planning truth stale;
- planning coverage insufficient;
- known insufficient Capacity;
- structurally ineligible Goal;
- feasible Goal;
- partial allocation where canonical architecture permits;
- Proposal available;
- No-Proposal;
- Proposal stale before acceptance;
- Proposal accepted;
- Proposal rejected;
- Accepted Allocation awaiting Realization;
- Realization failed;
- Realization successful;
- schedule changed after realization;
- publication blocked;
- publication successful.

Not every state requires a large dedicated panel.

Every state must preserve the canonical semantic distinction.

---

## 37. Existing Behavior That Must Not Regress

Preserve all confirmed working paths from Task 9.8A, including:

- authored setup persistence;
- explicit Save Setup behavior;
- deterministic Work generation;
- deterministic Commitment generation;
- manual Event persistence;
- arbitrary Month navigation;
- canonical user-day semantics;
- Preview freshness/staleness semantics;
- Friction detection;
- individual SuggestedFix behavior;
- explicit corrective acceptance;
- Proposal revalidation;
- immutable Accepted Allocation;
- atomic Realization writes;
- Buffer nonactivity semantics;
- explicit publication;
- immutable Plan History;
- execution reporting;
- execution correction/retraction;
- execution persistence across restart;
- manual Goal measurement semantics;
- historical Summary aggregation;
- unknown coverage remaining distinct from empty coverage.

---

## 38. Validation

Run the full existing validation suite required by the repository.

At minimum:

    npm run format
    npm run test
    npm run build

If the repository defines additional standard lint/typecheck commands, run them as appropriate.

Report exact results.

The RESULT artifact must include:

- test files passed;
- test count;
- failures;
- build result;
- formatting result;
- any lint/typecheck result;
- repository status after implementation.

Do not claim validation success without command evidence.

---

## 39. Required Focused Validation

In addition to the full suite, verify the new behavior at the appropriate layers.

At minimum include focused validation for:

1. Demand/Priority/footprint authoring;
2. Capacity/Feasibility evaluation;
3. Allocation/Proposal derivation;
4. Proposal recording;
5. Proposal acceptance/revalidation;
6. Accepted Allocation;
7. Realization;
8. scheduled Goal work visibility;
9. publication;
10. No-Proposal;
11. buffered overnight `afterWork`;
12. `beforeWork` non-regression;
13. Resolve schedule conflicts integration.

Prefer deterministic tests over manual-only verification.

---

## 40. Repository and Persistence Integrity

Before implementation:

- record `git status`;
- identify the current commit;
- confirm the expected predecessor state.

After implementation:

- record `git status`;
- enumerate changed files;
- identify any new files;
- identify any persistence/schema version change;
- identify any backup-format change.

Do not commit or push unless explicitly instructed by the user.

---

## 41. Required RESULT Artifact

Create one durable Markdown result artifact in the dedicated Phase 9 results folder.

The filename must contain `RESULT`.

Preferred filename:

    TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_PRE_MIGRATION_CONVERGENCE_RESULT.md

The RESULT must be self-contained enough for future DayFrame hydration.

Do not overwrite the task/input artifact.

---

## 42. Required RESULT Structure

The RESULT artifact must contain the following sections in this order:

### 1. Executive Summary

State:

- whether the ordinary constructive lifecycle is now product-reachable;
- whether the confirmed placement defect was repaired;
- whether Resolve schedule conflicts was repaired;
- whether any governing architecture changed;
- whether any persistence/schema migration occurred;
- overall validation result.

### 2. Governing Audit Findings Addressed

Map implementation work back to Task 9.8A findings.

### 3. Constructive Workflow Implemented

Document the exact ordinary production path from fresh Goal through Proposal/No-Proposal.

### 4. Goal Planning Intent Authoring

Document Demand, Priority and footprint authoring.

### 5. Capacity and Feasibility Connection

Document canonical queries and user-visible states.

### 6. Competition and Allocation Connection

Document how existing architecture is invoked.

### 7. Proposal / No-Proposal Connection

Document derivation, recording and presentation.

### 8. ProposalDecision and Revalidation

Document reuse of existing authority path.

### 9. Accepted Allocation and Realization

Document successful and failed realization behavior.

### 10. Scheduled Goal Work Visibility

Document where realized Goal work/support/protection can now be seen.

### 11. Review and Publication

Document the complete realized-work → Review → Publish path.

### 12. Buffered Overnight afterWork Repair

Document root cause, repair and regression coverage.

### 13. beforeWork Investigation / Non-Regression

State whether the historical defect was reproduced.

Do not imply it was fixed if it was not reproduced.

### 14. Resolve Schedule Conflicts Repair

Document real destination and integration coverage.

### 15. No-Proposal Behavior

Document typed negative/abstention states.

### 16. Reachability Matrix — Before vs After

Include the matrix required by Section 34.

### 17. Authority Transition Verification

Include the matrix required by Section 35.

### 18. Persistence / Schema Assessment

State exact persistence impact.

### 19. Existing Behavior Preserved

Identify important non-regressions.

### 20. Tests Added / Updated

List tests and what each proves.

### 21. Full Validation Results

Report exact command outcomes and counts.

### 22. Repository Integrity

Report commit/status/changed files.

### 23. Deferred Findings

Explicitly list what remains outside Task 9.8B.

At minimum:

- Found Time;
- execution-derived measured Progress;
- recurring Goal Demand;
- continuous/rolling calendar policy;
- external calendar ingestion;
- full Goal Structure authoring if not required;
- historical reporting if not connected;
- bulk Friction resolution;
- bulk Work authoring;
- Summary redesign;
- Planner/Summary shell migration;
- Day Worksurface convergence;
- My Schedule hierarchy.

### 24. Remaining Product-Reachability Gaps

List only gaps still relevant after this implementation.

### 25. Migration Readiness Assessment

Answer with evidence:

> **Is the constructive planning lifecycle sufficiently product-reachable and behaviorally verified to begin the Planner/Summary shell migration without hiding unresolved foundational lifecycle failures?**

Do not treat cosmetic polish as a blocker unless it prevents ordinary use.

### 26. Recommended Next Step

Recommend either:

- targeted follow-up repair;
- bounded verification dogfood;
- publication checkpoint;
- two-surface migration preparation.

Do not begin the next task.

### 27. Final Completion Statement

End with the exact statement:

> **Task 9.8B — Constructive Planning Reachability & Pre-Migration Convergence V1 is complete. The ordinary constructive planning lifecycle has been connected through the existing DayFrame authority model, confirmed pre-migration correctness defects have been addressed within scope, and the resulting product path has been validated without collapsing Proposal, Accepted Allocation, Realization, Publication, Execution, or Progress semantics.**

If the ordinary constructive lifecycle cannot be completed, do **not** use that completion statement.

Instead state precisely which lifecycle edge remains incomplete and why.

---

## 43. Completion Criteria

Task 9.8B is complete only when all applicable criteria are satisfied.

### Correctness

- [ ] Buffered overnight `afterWork` full-footprint placement defect is repaired.
- [ ] Production-path regression coverage exists for buffered overnight `afterWork`.
- [ ] Day `afterWork` remains correct.
- [ ] Zero-buffer overnight `afterWork` remains correct.
- [ ] `beforeWork` behavior has regression coverage.
- [ ] No speculative `beforeWork` repair was introduced without reproduction.
- [ ] `Any available` control behavior remains correct.
- [ ] Resolve schedule conflicts reaches a real mounted Friction workflow.
- [ ] Resolve integration has application-level regression coverage.

### Constructive authoring

- [ ] Fresh Goal can reach planning-intent authoring through ordinary UI.
- [ ] Canonical Demand can be authored.
- [ ] Canonical Goal Priority can be authored.
- [ ] Required canonical resource-footprint intent can be authored.
- [ ] Goal measurement is not repurposed as Demand.
- [ ] No duplicate UI-only planning authority was introduced.

### Evaluation

- [ ] Existing Projection path is used.
- [ ] Existing Capacity path is used.
- [ ] Existing Feasibility path is used.
- [ ] Existing Competition path is used.
- [ ] Existing Allocation path is used.
- [ ] Unknown/unavailable Capacity is not presented as known zero.
- [ ] Existing typed Feasibility distinctions remain intact.

### Proposal

- [ ] Existing Proposal derivation is invoked.
- [ ] Existing Proposal recording is invoked.
- [ ] No UI-only Planning Candidate authority was introduced.
- [ ] Typed No-Proposal has a user-visible outcome.
- [ ] Proposal remains non-authoritative.
- [ ] Proposal is visible through ordinary production interaction.

### Decision and realization

- [ ] Proposal acceptance remains explicit.
- [ ] Proposal rejection remains explicit.
- [ ] Acceptance revalidation remains active.
- [ ] Accepted Allocation is created only through canonical acceptance.
- [ ] Realization uses existing canonical implementation.
- [ ] Realization creates scheduled Goal work/support/protection correctly.
- [ ] Buffer remains nonactivity.
- [ ] Failed Realization does not create partial footprint.
- [ ] Accepted authority is not duplicated during recovery.

### Schedule and publication

- [ ] Realized Goal work is visible enough for ordinary verification.
- [ ] Realized Goal work reaches canonical Review Schedule.
- [ ] Existing publication path is reused.
- [ ] Publication remains explicit.
- [ ] Preview generation does not publish.
- [ ] Published history remains immutable.

### Testing

- [ ] End-to-end fresh Goal constructive product test passes.
- [ ] No-Proposal product test passes.
- [ ] Revalidation test passes.
- [ ] Realization behavior is covered.
- [ ] Placement regression tests pass.
- [ ] Resolve Friction integration test passes.
- [ ] Full existing suite passes.
- [ ] Build passes.
- [ ] Formatting passes.
- [ ] No unauthorized persistence/schema changes occurred.

### Scope governance

- [ ] Found Time was not improvised.
- [ ] Execution-derived measured Progress was not improvised.
- [ ] Recurring Goal Demand was not added opportunistically.
- [ ] Continuous-calendar architecture was not added opportunistically.
- [ ] Two-surface migration was not begun.
- [ ] Today was not removed.
- [ ] My Schedule hierarchy was not implemented.
- [ ] Broad Summary redesign was not undertaken.
- [ ] No domain engine was duplicated merely for UI reachability.

### Documentation

- [ ] Phase 9 RESULT artifact was created.
- [ ] RESULT filename contains `RESULT`.
- [ ] Before/after reachability matrix is included.
- [ ] Authority-transition verification is included.
- [ ] Deferred findings are explicit.
- [ ] Migration readiness is assessed.
- [ ] Repository integrity is reported.

---

## 44. Governance

This task is a convergence task, not a redesign authorization.

Prefer:

    expose existing authority
        over
    create replacement authority

Prefer:

    connect existing query/command
        over
    duplicate algorithm in UI

Prefer:

    typed canonical result
        over
    generic success/failure state

Prefer:

    explicit user decision
        over
    automatic authority promotion

Prefer:

    minimum transitional UI
        over
    polishing the old shell

Prefer:

    regression evidence
        over
    speculative repair

If the existing architecture cannot support the required ordinary constructive path without changing a governing Phase 8/9 invariant, stop and document the conflict rather than weakening the invariant.

If a seemingly simple UI connection would require inventing new authority semantics, stop and classify it as follow-up architecture work.

If the full constructive path requires Found Time, execution-derived Progress, recurring Demand, or another explicitly deferred capability, do not expand scope. Demonstrate the constructive path using the existing supported finite Goal/Demand semantics.

Do not commit or push unless explicitly instructed by the user.

---

## 45. Final Instruction

Task 9.8A established that DayFrame already contains most of the machinery required for constructive planning.

The purpose of Task 9.8B is not to build another planning system.

It is to make the existing one usable.

The implementation must prove, through ordinary production interaction:

    I have a Goal.
        ↓
    I tell DayFrame what planning effort that Goal requires.
        ↓
    DayFrame evaluates what my real schedule can support.
        ↓
    DayFrame either explains why it cannot currently propose work
        or
    DayFrame offers a non-authoritative Proposal.
        ↓
    I decide.
        ↓
    My acceptance becomes Accepted Allocation.
        ↓
    DayFrame realizes that accepted allocation into actual scheduled Goal work.
        ↓
    I can review that scheduled reality.
        ↓
    I explicitly publish it.

At every step, preserve the distinction between:

    intent
    ≠
    derived planning truth
    ≠
    proposal
    ≠
    accepted authority
    ≠
    scheduled reality
    ≠
    publication
    ≠
    execution
    ≠
    progress

When Task 9.8B is complete, DayFrame should no longer merely contain a constructive planning architecture.

An ordinary user should be able to reach it.