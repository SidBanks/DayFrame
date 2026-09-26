# Task 9.27.1 — Goal Structure Contract Resolution V1

**Status:** READY — ARCHITECTURE RESOLUTION ONLY
**Phase:** Phase 9 — Product Convergence
**Task Type:** Bounded Temporal, Compatibility, Field-Fidelity, and Mutation-Admission Contract Resolution
**System:** DayFrame
**Parent Task:** Task 9.27 — Goal Structure & Manual Milestone Authoring V1 — PARTIAL/BLOCKED
**Implementation Authority:** NONE
**Architecture Work Authority:** Produce one concrete proposed contract for review
**Architecture Adoption Authority:** NONE — do not mark the proposal accepted
**Persistence / Schema / Migration Execution Authority:** NONE
**Capability / Code Retirement or Removal Authority:** NONE

---

## 1. Objective

Resolve the exact canonical-contract gaps documented by Task 9.27 so that a subsequent bounded owner-repair task can be authorized before Goal Structure authoring resumes.

Produce one decision-ready contract covering:

1. Relationship effective intervals and their applicability.
2. Compatibility treatment of previously accepted durable records.
3. Milestone metadata-versus-lifecycle timestamp fidelity.
4. Complete ordinary Structure mutation admission, including persistence retry.

This is not another general Goals or Structure audit.

The required output is a concrete recommended design, with explicit semantics, compatibility disposition, command/query contracts, failure behavior, and implementation acceptance tests.

Do not implement the recommendation during this task.

---

## 2. Checkpoint, Identity, and Status

Task 9.26 remains accepted COMPLETE for its documented bounded restore repair and verification.

Task 9.27 remains PARTIAL/BLOCKED. Its implementation and Mobile Acceptance Gates have not passed.

Its reported findings qualify earlier readiness assessments:

- Basic current Structure commands exist.
- Their existence does not establish interval validity, time-qualified applicability, untouched timestamp fidelity, or complete mutation admission.
- Task 9.26 supplied stronger readiness callbacks, but the reported Structure revision/retry paths do not all consult them.

Preserve both historical RESULTs unchanged.

Confirm that no conflicting executed Task 9.27.1 exists. Do not overwrite or silently renumber a conflict.

Verify that this immutable execution input contains Sections 1–18 and the final completion statement.

Completion of this task means a resolution proposal has been delivered. It does not mean the proposal is accepted, owner repairs are implemented, or Task 9.27 is unblocked.

---

## 3. Governing Inputs

Read the actual repository copies of:

1. Task 9.27 execution input and PARTIAL/BLOCKED RESULT.
2. Its retained diagnostic, observations, configuration, and provenance under `evidence/task-9.27/`.
3. `docs/architecture/GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md`.
4. Task 8.2 — Goal Structure V1 Domain and Persistence RESULT.
5. `docs/adr/ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.
6. `docs/adr/ADR_DURABLE_CROSS_STORAGE_RESTORE_FOUNDATION.md`.
7. Relevant Goal identity/lifecycle and planning provenance/freshness contracts.
8. Tasks 9.24–9.26 RESULTs and relevant permanent regressions.
9. End-State Compatibility & Retirement Architecture Specification V1.
10. Product Ontology and relevant Appendix B definitions.

Inspect the current Structure domain, surface, lazy adapter, public store wiring, validators, persistence readers/writers, backup chain, restore participation, Demand projection consumers, and proposal revalidation.

Separate normative requirements, implemented behavior, and proposed clarification.

Do not treat the earlier Structure specification’s broader future capabilities as implemented contracts.

---

## 4. Baseline and Preservation

Record HEAD, working-tree status, applicable repository instructions, and a task-relative preservation baseline before writing output.

Task 9.27 reported 204 starting status entries and 1,030 preserved baseline files. These are historical measurements; capture the actual current state.

Preserve all existing production/test source, task inputs, ADRs, specifications, RESULTs, and diagnostic evidence.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, normalize, or repair preserved Dogfood Pass 02 state.

Use isolated disposable fixtures and databases for diagnostic execution.

Only new proposal, RESULT, and diagnostic/evidence artifacts may be written. No application, validator, schema, migration, UI, or existing test implementation changes are authorized.

---

## 5. Reuse the Exact Reproductions

Re-run or trace the retained diagnostic against the current baseline.

Preserve these distinct observations:

### Temporal reproduction

- Create a hard Goal-completed prerequisite at `2026-10-01T00:00:00.000Z`.
- Move the injected owner clock backward to `2026-09-23T12:00:00.000Z`.
- Observe current eligibility.
- Retire the relationship.
- Observe durable acceptance of an end before the start.
- Reinitialize the surface and compare exact authority.

### Milestone fidelity reproduction

- Satisfy a manual Milestone on September 24.
- Submit only a title change on September 25.
- Compare current and exact prior revisions, especially `satisfiedAt`.

### Admission reproduction

- Deny mutation through the existing callback.
- Compare creation and revision behavior.
- Extend isolated diagnostics to the source-inspected relationship revision, retirement, and persistence-retry paths as needed.

Distinguish directly reproduced behavior from source inspection.

These diagnostics document existing defects; their passing assertions are not repaired-behavior acceptance tests.

Do not claim that any retained user database contains the temporal anomaly or that a native restore race has been observed without that evidence.

---

## 6. Temporal Meaning and Query Scope

Specify the bounded meanings of:

- Logical record identity.
- Revision order.
- Active/retired status.
- Effective interval.
- Command timestamp.
- Evaluation instant.
- Evidence freshness.
- Historical knowledge.

Choose explicit interval boundary semantics, including:

- Whether the end is exclusive.
- Whether equal start/end is valid.
- Meaning of an absent end.
- Future-effective records.
- Retired records.
- Clock rollback during create, revise, and retire.
- Invalid or ambiguous legacy intervals.

Do not silently clamp timestamps, swap endpoints, fabricate a later clock reading, or reinterpret an invalid interval as ordinary absence.

### Current evaluation versus historical reconstruction

Prefer the smallest contract that supports current-authority evaluation with explicit temporal applicability.

Do not imply that adding `asOf` reconstructs the entire Goal state known at a past instant.

The existing exact relationship revision API does not, by itself, supply exact historical Goal lifecycle state.

Specify what the query can answer, what inputs it uses, and what it must report as unavailable or outside scope.

A later revision retaining an earlier `effectiveFrom` must not become proof that its newer semantics were known throughout that earlier period.

No general bitemporal database or historical traversal implementation is authorized.

---

## 7. Canonical Applicability and Planning Consumers

Provide a concrete proposed query contract, including input/output sketches and compatibility treatment of the current `getStructuralEligibility(goalId)` entry point.

The contract must distinguish:

- Record status.
- Applicability at the defined evaluation instant.
- Structural eligibility.
- Unavailable or protected evidence.

Preserve the four existing eligibility categories unless a separately justified explicit proposal is necessary.

Do not turn unknown applicability into satisfied, absent, eligible, or zero.

Identify the precise canonical owner of applicability. React may present the result but must not independently decide which relationships apply.

Trace required changes through:

- Public store and lazy adapter.
- Requested Time projection/evaluation.
- Proposal derivation and acceptance revalidation.
- Structure subscriptions and evidence freshness.
- Future Structure UI consumption.

Define the relationship between the evaluation instant and the requested planning horizon. They are not interchangeable.

Address applicability changing solely because time crosses a boundary without a record revision. Specify how dependent evidence remains truthful in that case.

Do not prescribe a per-render clock sample, polling loop, or new event bus as an architectural shortcut.

Previously accepted, realized, or published work must not be revoked or rewritten by this query clarification.

---

## 8. Compatibility and Version Decision

Identify each affected durable representation and actual reader/writer:

- Current Structure authority.
- All retained relationship/Milestone revision rows.
- Local persistence ingress.
- Current complete backup export/import.
- Supported historical backups containing Structure.
- Restore/recovery staging where relevant.
- Exact historical lookup.
- Profile boundaries, including where Structure is not profile-owned.

Do not assume only the latest record matters. A stricter whole-authority validator may encounter an anomalous retired or superseded revision.

### Required compatibility matrix

For each relevant record class, specify:

| Record class | Existing acceptance | Proposed new-write rule | Read/activation behavior | Export/restore behavior | Preservation/recovery | Version impact |
|---|---|---|---|---|---|---|

Include ordinary valid data, clock-rollback intervals, future-effective records, equal endpoints, retired historical anomalies, and unsupported data.

### Decision requirements

Distinguish:

1. Correcting future command production.
2. Tightening shared durable-reader validation.
3. Changing field interpretation.
4. Migrating existing data.
5. Preserving ambiguous evidence without activating invented semantics.

Select one recommended path with a concrete rationale.

A no-version-change recommendation must demonstrate that the promised durable compatibility contract remains safe. It cannot merely say that serialized keys are unchanged.

Where a new version or migration epoch is required, identify its scope, discriminator, reader/writer behavior, and conversion or preservation rules. Do not automatically increment database, record, and backup versions together.

Do not assume a future backup number without inspecting the actual version chain.

No migration may invent which date the user intended. If lossless interpretation is impossible, specify a non-destructive, explicitly qualified outcome.

Do not silently drop invalid rows, return empty Structure, rewrite immutable history, or declare pre-public-release data disposable.

No reader retirement is authorized.

---

## 9. Milestone Field-Fidelity Contract

Specify the prospective behavior of the existing Milestone patch command.

At minimum:

- Metadata-only edits preserve existing lifecycle facts and timestamps.
- A title-only edit of a satisfied Milestone does not change when it was satisfied.
- A same-state patch is not automatically a new state transition.
- Semantic no-ops follow the existing revision contract.
- Intentional state transitions use the existing supported lifecycle rules.
- Optional target-date absence and explicit clearing remain distinct.
- Ownership, policy, identity, and earlier revisions remain intact.

For the reproduced rename case, the recommended correction must preserve the earlier `satisfiedAt` while permitting the normal metadata revision/`updatedAt` behavior.

Provide a transition/patch matrix using only fields and states that actually exist.

Separately address records already affected by the bug. Do not silently “repair” current timestamps from historical revisions merely because a plausible earlier value is available.

Any historical correction proposal needs its own explicit meaning and authority; it is not implied by fixing future patches.

Identify whether this prospective correction changes durable compatibility or only corrects command behavior. Justify that classification independently from the interval decision.

---

## 10. Mutation Admission and Restore Safety

Inventory every Structure write path:

- Creation.
- Revision.
- Retirement.
- Persistence retry.
- Any public authority replacement.
- Initialization/ingress.
- Coordinator-owned restore and clear participation.

Classify ordinary user-command writes separately from authorized coordinator operations.

Define where the existing readiness/transaction guard must be consulted, what rejection is returned, and what runtime/durable effects are prohibited when admission is denied.

A disabled UI control is not an owner-level guarantee.

Trace asynchronous boundaries:

- Pending persistence.
- Queued retry.
- Lazy initialization.
- An intervening restore or clear.
- A late continuation holding old desired authority.

Specify the required recheck or existing generation/transaction mechanism at the actual mutation boundary.

Do not claim that one entry-time boolean check proves every delayed write safe.

Also do not impose ordinary-authoring guards in a way that prevents legitimate coordinator-owned restoration.

Preserve the distinction between an operation already accepted before the boundary and a new or stale write attempting to cross it.

Use existing readiness, transaction, durability, and rejection concepts where sufficient. Do not introduce a new global locking or recovery architecture without showing a specific necessity.

---

## 11. Closed Scope and Preserved Semantics

Preserve:

- Single-parent acyclic containment.
- Explicit required/optional semantics.
- Directional non-aggregating contribution.
- Hard/advisory prerequisites.
- Existing Goal-completed and Milestone-satisfied conditions.
- Manual Milestone authority.
- Exact history and provenance.
- Independent Requested Time, Priority, Actual, and Progress.
- Distinct accepted iterations.
- Existing protected-state and restore boundaries.

Retiring a referenced Milestone may reject under current graph validation. Do not introduce automatic dependent-edge retirement.

Exclude atomic reparenting, batch restructuring, Demand Accounting, Progress roll-up, automatic Milestones, new Goal lifecycle behavior, scheduling dependencies, recurrence, release, replacement, and Found Time.

These excluded capabilities are not the reasons for this resolution task.

---

## 12. Required Decision and Regression Tables

The proposed contract must give a concrete expected outcome for:

1. Ordinary valid create/revise/retire.
2. Clock rollback at each relevant command.
3. Evaluation before start, at start, at end, and after end.
4. Equal start/end and absent end.
5. Previously accepted inverted intervals, including nonlatest history.
6. Time-only applicability changes without revision changes.
7. Metadata edit of a satisfied or retired Milestone.
8. Same-state and genuine state-transition patches.
9. Denied creation/revision/retirement/retry.
10. Admission changing during pending work.
11. Rejected versus successful import and recovery-required readiness.
12. Reload and backup round-trip preservation.
13. Current evaluation versus unavailable historical reconstruction.
14. Existing planning evidence becoming stale without rewriting accepted history.

For each case, identify the authoritative owner, expected observable result, allowed writes, preserved evidence, and proposed permanent test layer.

Do not report these future expected results as already implemented.

Where existing contracts settle a rule, cite them rather than reopening it.

---

## 13. Deliver One Resolution, Not Another Options-Only Audit

The primary deliverable is one internally consistent recommended contract.

Briefly document rejected alternatives where they explain a consequential choice, but do not end with multiple unselected implementation paths.

Provide:

- Exact recommended temporal and applicability semantics.
- Command/query signatures or type sketches.
- Error and protection behavior.
- Compatibility/version disposition.
- Required preservation or migration behavior.
- Consumer/freshness changes.
- Milestone patch rules.
- Admission and asynchronous-boundary rules.
- Concrete acceptance scenarios.

The proposal must be marked:

**PROPOSED — AWAITING ARCHITECTURAL ACCEPTANCE — NOT IMPLEMENTED**

Task completion is not permission to self-approve it, change canonical architecture status, or begin implementation.

If a material rule cannot be selected from the inspected evidence and bounded design work, identify the exact remaining decision and its consequences. Do not hide it behind “implementation detail.”

---

## 14. Implementation Handoff and Return to 9.27

Recommend exactly one next bounded canonical-owner repair slice, without automatically assigning its task number.

It must identify:

- Required accepted proposal.
- Exact production owners and consumers affected.
- Prospective write fixes.
- Read/compatibility changes, if required.
- Persistence/version/migration scope, if required.
- Regression and native-browser evidence.
- Rollback/protection requirements.
- Explicit exclusions and completion criteria.

The handoff must distinguish foundation repair from the still-unimplemented Structure UI.

Then provide a precise resumption checklist for Task 9.27.

Preserve its original input and blocked RESULT. A later continuation must explicitly reference the accepted contract and completed repair; it must not rewrite the blocked execution as though implementation had proceeded.

Do not waive its fidelity, history, persistence, Mobile Acceptance, or bundle gates.

---

## 15. Mobile and Browser Evidence Boundary

No new Structure authoring UI is implemented in this task.

Therefore:

- Do not claim its mobile acceptance.
- Do not manufacture screenshots or viewport measurements.
- Do not reuse 9.26 browser success as proof of unimplemented Structure authoring.

The proposed owner contract must support truthful, actionable mobile presentation without requiring UI-local temporal or safety authority.

The subsequent repair task must verify affected current production-browser planning/restore behavior.

The resumed 9.27 must still pass its complete 320/390/768/1280px authoring, navigation, validation, accessibility, draft, reload, and backup/restore gates.

Retain the distinction between native-browser observations, controlled diagnostic failures, and future acceptance requirements.

---

## 16. Validation and Evidence Preservation

Run the retained diagnostic and relevant existing suites using the installed toolchain.

Record a fresh baseline through repository-equivalent formatting, lint, typecheck, full tests, build, bundle policy, and whitespace checks.

A documented full-suite worker bound is permitted. Do not change assertions, existing timeouts, configuration, or dependencies to obtain a pass.

Task 9.27 reported:

| Measure | Historical value |
|---|---:|
| Test files / tests | 159 / 1,590 |
| Initial raw JavaScript | 623,114 bytes |
| Initial gzip JavaScript | 163,250 bytes |
| Largest lazy chunk | 62,652 bytes |
| Total JavaScript | 1,226,690 bytes |
| Initial-gzip headroom | 6,750 bytes |

Measure rather than copying these as current results.

Because production inputs must remain unchanged, one verified build can serve as both baseline and final application measurement. Explain that basis.

Preserve the 170,000-byte initial-gzip, 685,000-byte initial-raw, 100,000-byte largest-lazy, and remaining repository hard gates.

Report existing advisories and unrelated baseline failures honestly. No speculative post-repair bundle measurement is possible here.

---

## 17. Output Artifacts and Completion Criteria

Write a separate execution RESULT:

`docs/implementation/phase-9/TASK_9.27.1_GOAL_STRUCTURE_CONTRACT_RESOLUTION_V1_RESULT.md`

Write the proposed contract separately:

`docs/architecture/GOAL_STRUCTURE_TEMPORAL_COMPATIBILITY_AND_OWNER_SAFETY_CONTRACT_V1_PROPOSED_RESULT.md`

Use `evidence/task-9.27.1/` or the established equivalent for retained diagnostics and measurements.

Every new durable output filename must include `RESULT`.

Preserve all previous evidence unchanged. Distinguish repository-local retention from commits or remote backups.

The execution RESULT must include:

- Bounded outcome and unresolved items.
- Governing sources and exact baseline.
- Reproduced versus source-inspected findings.
- Chosen contract and compatibility rationale.
- Implementation impact and regression matrix.
- Validation actually performed.
- Every created artifact.
- Confirmation that existing application and historical files were not changed.
- One owner-repair handoff and the 9.27 resumption checklist.

This task is COMPLETE only when one coherent, decision-ready proposal covers all four documented gaps with concrete implementation consequences.

Architectural acceptance remains a separate review step.

If necessary governing evidence or a material decision remains unresolved, report PARTIAL/BLOCKED and identify it precisely.

---

## 18. Final Completion Statement

End the execution RESULT with the applicable determination:

**Task 9.27.1 — Goal Structure Contract Resolution V1 is COMPLETE as a bounded architecture-resolution proposal. Architectural acceptance and implementation remain pending.**

or:

**Task 9.27.1 — Goal Structure Contract Resolution V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when a concrete proposed contract explains relationship time applicability, preserves supported durable evidence, defines lossless Milestone patches, and closes ordinary Structure mutation-admission requirements sufficiently to authorize a bounded owner repair—without changing application behavior or pretending Task 9.27 has been completed.**