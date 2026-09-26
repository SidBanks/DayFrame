# Task 9.27 — Goal Structure & Manual Milestone Authoring V1

**Status:** READY — BOUNDED IMPLEMENTATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Existing Goal Structure Product Authoring and Evidence Integration
**System:** DayFrame
**Prerequisite:** Task 9.26 — Production V14 Backup Import Repair & Browser Restore Verification V1 — accepted COMPLETE
**Implementation Authority:** Existing Structure commands, canonical reads, presentation, and navigation
**Structure-Record Authority:** Explicit existing relationship/Milestone authoring and lifecycle commands only
**Architecture / Domain-Semantics Change Authority:** NONE
**Persistence-Format / Schema / Dependency Change Authority:** NONE
**Capability / Code Retirement or Removal Authority:** NONE

---

## 1. Objective

Make existing Goal Structure capabilities ordinarily reachable from a selected Goal.

The user must be able to:

- Relate existing Goals through containment, contribution, and prerequisites.
- Create and manage manual Milestones owned by a Goal.
- Understand relationship direction, requiredness, prerequisite conditions, and current structural eligibility.
- Edit supported values without losing unrelated data or history.
- Navigate among related Goals without silently discarding drafts.
- Understand rejection, stale revisions, persistence outcomes, and protected state.

This task exposes existing authority. It does not implement the entire Goal Structure specification or the newer Goal Lifecycle specification.

Flat Goals remain valid. Structure is optional and creates no Requested Time merely by existing.

---

## 2. Checkpoint and Task Identity

Accepted checkpoints:

- 9.23 — Goals readiness audit.
- 9.24 — Focused editing and Requested Time fidelity.
- 9.25 — Goal accepted-planning and scheduled-work inspection.
- 9.26 — Production V14 import repair and restore verification.

Task 9.23 identified existing Structure commands and queries as sufficient for bounded basic authoring.

This task selects that slice. It is not a recommendation contained in the 9.26 RESULT.

Confirm no conflicting executed Task 9.27 assignment exists. The hydration package’s projected Compatibility Retirement Audit is not an executed assignment.

Do not overwrite or silently renumber an actual conflict.

Verify the saved immutable execution input contains Sections 1–18 and the final completion statement.

---

## 3. Governing Inputs and Current Contract Check

Read the actual repository copies of:

1. `docs/architecture/GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md`.
2. Task 8.2 — Goal Structure V1 Domain and Persistence RESULT.
3. Task 9.23 RESULT, especially Structure readiness, lifecycle boundaries, and persistence findings.
4. Tasks 9.24–9.26 RESULTs and their relevant permanent regressions.
5. Product Ontology & Vocabulary Specification V1 and governing Appendix B entries.
6. End-State Compatibility & Retirement Architecture Specification V1.
7. Relevant Goal identity, planning provenance/freshness, durable-data compatibility, and cross-storage restore ADRs.

Inspect current equivalents of:

- `core/planning/goalStructure.ts`
- `state/goalStructureSurface.ts`
- Their tests and current public store adapter.
- `goalStructureSchedulingBoundary.test.ts`
- Structure consumption in Requested Time evaluation and proposal freshness.

Before implementation, record a concise capability-to-command/query map covering exact input, revision, provenance, return, durability, and protection contracts.

The earlier specification describes capabilities beyond the bounded implementation. Do not implement unimplemented accounting, automatic evidence policies, traversal, or lifecycle behavior merely because the specification mentions them.

Current code establishes executable behavior; accepted architecture establishes normative meaning. Investigate consequential conflicts rather than treating either as permission to silently change the other.

Do not repeat the general Goals audit.

---

## 4. Baseline and Repository Protection

Before changing files:

- Record HEAD and exact working-tree status.
- Inspect applicable repository instructions.
- Capture a task-relative baseline for tracked and relevant untracked work.
- Measure current tests and production bundle output.
- Identify the source versions and existing lazy boundaries used.

Task 9.26 began with 199 status entries and captured 1,007 files. These are historical measurements, not expected current counts.

Preserve unrelated dirty work, task inputs, historical RESULTs, architecture documents, and retained evidence.

Do not reset, stash, commit, push, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable browser profiles, origins, databases, and fixtures.

---

## 5. Implementation Scope and Product Entry

Add a progressively disclosed Structure section within selected Goal detail.

Reuse the existing Goal editing context, selection/navigation patterns, readiness gates, and Structure owner.

Likely areas include:

- `GoalSection.tsx`
- `DayFrameApp.tsx`
- Existing Goal context/subscription helpers.
- A focused lazy `GoalStructureSection.tsx` or equivalent.
- Scoped presentation helpers and CSS.
- Focused UI/integration tests.

Keep ordinary Goal creation in its existing canonical workflow.

This slice links existing Goals. It does not require a combined “create Goal and relationship” transaction or a second Goal-creation implementation.

Provide focused access to:

- Parent/Subgoals.
- Contributions.
- Prerequisites.
- Manual Milestones.
- Current prerequisite/eligibility explanations.

Do not require a graph canvas, drag-and-drop, hover, or desktop-only interaction.

Keep Measurement, Progress, Requested Time, accepted-work inspection, and existing lifecycle actions reachable.

---

## 6. Relationship Authoring

Expose the implemented relationship kinds through their existing commands.

### Containment

Support linking existing Goals as parent and Subgoal with explicit required/optional semantics.

Make direction unambiguous: the broader Goal contains the subordinate Goal.

Requiredness must be an intentional choice, not inferred from presence or an unexplained default.

A Subgoal remains an ordinary Goal with independent identity, lifecycle, Requested Time, Priority, Progress, and links.

Containment does not itself create a prerequisite, combine requested minutes, inherit Priority, or complete another Goal.

### Contribution

Support directional, non-aggregating `contributesTo` relationships.

Explain that contribution is not parenthood and does not automatically transfer measured Progress or Requested Time.

Preserve lawful multiple-target contributions and non-aggregating contribution cycles.

### Prerequisites

Support the implemented hard/advisory dependency modes and existing conditions:

- A specified Goal is completed.
- A specified manual Milestone is satisfied.

Use the actual current condition union and endpoint representation. Do not add Progress-threshold conditions, overrides, or new policy types.

Direction is dependent Goal → prerequisite.

A hard prerequisite can prevent the dependent request from participating in planning. An advisory dependency supplies the existing qualified eligibility/explanation rather than becoming a hard block.

Neither orders individual scheduled activities.

### Commands

Use existing create/revise/retire operations with canonical identity and expected revisions.

Expose supported semantic edits such as requiredness, dependency strength, and condition through the owner’s actual contract.

Do not silently convert relationship kinds, retarget by title, repair invalid graphs, or replace another relationship to make Save succeed.

---

## 7. Manual Milestones

A Milestone belongs to exactly one Goal.

Support:

- Creation with title and optional target date.
- Editing supported current fields.
- Explicit manual satisfaction.
- Other active/satisfied/retired transitions only as supported by the existing command contract.
- Inspection of current state and exact identity/revision.

Do not invent a transition because its destination appears in the status enum.

Milestones have no duration, Requested Time, Priority, independent Progress stream, or schedule ownership.

Use wording that distinguishes “mark this checkpoint reached” from:

- Completing the Goal.
- Reporting an activity outcome.
- Recording measured Progress.

Retirement must explain retained history and current prerequisite implications. It must not erase the Milestone or its dependent relationship history.

Do not automatically satisfy Milestones from recorded minutes, observations, target dates, or Goal status.

Ownership is not silently reassigned during editing.

---

## 8. Graph Validation, Record Retirement, and Reparenting Boundary

Canonical validation remains authoritative.

Preserve the distinct rules:

- Containment is single-parent and acyclic.
- Goal dependency cycles are invalid.
- Self-edges and duplicate active semantic relationships are invalid.
- Endpoint types, Goal identity, Milestone ownership, conditions, and effective intervals are validated.
- Non-aggregating contribution cycles are not rejected by a universal cycle rule.

The UI may validate required form fields and translate returned reasons. It must not implement a competing graph validator.

Show the actual supported rejection reason. Do not fabricate an exact cycle path or blocking record that the owner did not return.

### Record retirement

Explicit retirement of a relationship or Milestone through an existing domain command is within scope.

That is not capability retirement and does not authorize deleting code, routes, readers, tests, or historical records.

### Reparenting

Atomic reparenting is excluded.

The specification requires a lawful atomic structural transition for a move. Do not present sequential retire/create operations or an endpoint rewrite as an atomic “Move Subgoal” workflow.

A second active parent must reject safely, not silently remove the first.

Do not add a move coordinator, batch command, or new transaction protocol in this task.

---

## 9. Canonical Inspection, Eligibility, and History

Reuse current public Structure reads, including the existing equivalents of:

- `listGoalStructureRelationships`
- `listGoalStructureMilestones`
- `getStructuralEligibility`
- Exact relationship/Milestone revision lookup.

Present relevant records with explicit direction, endpoint, ownership, current status, and applicability.

Keep active record status distinct from whether its effective interval applies at the query’s evaluation time.

Inverse labels may derive from returned canonical relationships. Do not persist inverse edges or reconstruct authority from raw IndexedDB arrays.

### Eligibility

Preserve the canonical distinction among:

- `eligible`
- `ineligible`
- `conditionallyEligible`
- `unknown`

Translate reasons into understandable prerequisite explanations without overstating them.

Eligibility is not complete Feasibility, available Capacity, scheduling readiness, or Goal completion eligibility.

Do not manufacture “parent ready to complete” from counting required children.

Use the existing query’s clock/cutoff/dependency contract. Opening Structure must not evaluate or record a planning Proposal.

### History

Preserve exact relationship/Milestone IDs, revisions, effective intervals, and provenance.

An old revision must never resolve to the latest record merely because its ID matches.

Current Goal names are current labels, not guaranteed historical decision-time names.

Bounded current/inactive inspection is sufficient. A complete structural timeline, ancestor history, or new historical projection is not required.

Unknown or protected evidence must not appear as an empty, satisfied, or unconstrained structure.

---

## 10. Focused Forms, Endpoint Selection, and Navigation

Use one focused relationship or Milestone editor at a time.

For larger Goal collections, provide searchable bounded endpoint selection with stable identity-based choices. Duplicate titles must remain distinguishable without matching by title.

Milestone choices must show their owning Goal.

Start relationship/Milestone lists with at most 10 visible rows per group and explicit incremental reveal. Preserve deterministic ordering and identity-based disclosure state.

These are rendering bounds, not storage-performance guarantees.

Retain in ephemeral app-owned presentation context:

- Selected Goal and structure record.
- Original base record and expected revision.
- Draft values and intended changes.
- Search/filter/reveal/disclosure state.
- In-flight operation identity and accepted outcomes.
- Return/focus context.

Navigation to a related Goal must use the existing selection/dirty-draft protections.

Preserve unsaved Goal and Requested Time drafts during Structure work. Do not save them as a side effect of saving a relationship.

On return from related Goal, Review Schedule, or Daily Planner, restore appropriate inspection context and focus.

Drafts do not become persisted domain records or restart-surviving storage.

---

## 11. Fidelity, Failure, Persistence, and Async Safety

Preserve valid fields the user did not change, including optional absence, effective intervals, endpoint identity, condition references, provenance, and manual satisfaction policy.

Do not rebuild an advanced record from only the visible fields.

New records use the existing direct-authoring, clock, identity, and provenance path—not invented metadata or a new origin.

### Save outcomes

Re-read canonical state after accepted commands.

Distinguish:

- Validation rejection.
- Stale revision.
- Runtime acceptance.
- Persistence pending/failure.
- Durable completion.
- Protected or recovery-required state.

Use the current owner’s actual contract; do not assume every command shares the same durability model.

Prevent duplicate unresolved submissions.

If runtime authority was accepted, use existing persistence retry rather than repeating creation. Retain accepted identity through navigation and retry.

Cancel discards an unsaved draft; it does not roll back accepted authority.

### Concurrency

Preserve base revisions on stale rejection. Do not silently rebase.

Late reads for A must not overwrite B. Late accepted command outcomes must remain associated with their actual source identity.

Respect Tasks 9.24–9.26 clear/restore boundaries:

- Rejected import preserves appropriate drafts.
- Successful replacement invalidates displaced context.
- Recovery-required readiness blocks ordinary authoring.
- Late continuations cannot replay edits into restored authority.
- Setup profile loading retains its independent scope.

No new cache, persistence owner, polling system, or recovery command is authorized.

---

## 12. Planning and Downstream Boundaries

Structure edits may change canonical structural eligibility and stale dependent planning evidence. Preserve those existing effects.

They must not automatically:

- Create or revise Requested Time/Priority.
- Evaluate or record a Proposal.
- Accept, realize, publish, move, or release work.
- Report Actual.
- Record or aggregate Progress.
- Complete/archive/reactivate another Goal.

Preserve existing subscriptions, dependency fingerprints, and stale acceptance checks.

Demonstrate an ordinary workflow:

```text
Explicitly create a hard prerequisite
→ existing evaluation observes the unmet prerequisite
→ explicitly satisfy its existing Goal/Milestone condition
→ next explicit evaluation consumes the updated eligibility
```

The act of satisfying the condition is not itself planning authorization.

Existing accepted iterations and realized/published work remain independent. Later Structure edits do not revoke or rewrite them.

Keep the Network+ 10-hour, 20-hour, and unrealized 1-hour iterations distinct. Do not introduce ancestor roll-ups into the Goal inspector.

Preserve the distinction between qualitative contribution and quantitative Demand/Progress accounting. The latter remains separate work.

---

## 13. Permanent Automated Regressions

Add permanent coverage for:

1. Required/optional containment through ordinary UI.
2. Correct contribution and dependency direction, including duplicate endpoint titles.
3. Goal-completed and manual-Milestone prerequisite conditions.
4. Manual Milestone creation, optional-date fidelity, supported transitions, and history.
5. Multi-parent, self-edge, duplicate, invalid endpoint/condition, containment-cycle, and dependency-cycle rejection.
6. A valid non-aggregating contribution cycle.
7. Canonical four-state eligibility and protected/unavailable evidence.
8. Explicit prerequisite change → next explicit planning evaluation, with no automatic Proposal or scheduling writes.
9. Semantic no-op/revision behavior and preservation of untouched fields.
10. Stale writes, persistence failure/retry, and duplicate-submission prevention.
11. Goal/record switching and late reads/commands associated with the correct identity.
12. Navigation preserving Structure, Goal, and Requested Time drafts.
13. Actual rejected/successful V14 import and recovery-readiness context boundaries relevant to the new editor.
14. Record retirement retaining exact earlier revisions across reload and backup/restore.
15. No implicit parent completion, Priority inheritance, Requested Time aggregation, Progress credit, or accepted-work rewrite.
16. At least 24 Goals plus a sufficiently populated Structure list proving bounded selection/reveal.

Use canonical commands or validated fixture builders for semantic proof.

Label synthetic presentation-density fixtures explicitly. They do not establish persisted graph validity or storage performance.

Retain Tasks 9.24–9.26 and existing Structure, planning, realization, publication, execution, Progress, compatibility, and scheduling-boundary assertions.

Do not weaken tests to accommodate new presentation.

---

## 14. Production Browser and Mobile Acceptance Gate

Use the production build and disposable state at approximately:

```text
320px
390px
768px
1280px
```

At every width exercise:

- Select a Goal and open Structure.
- Link an existing Subgoal with explicit requiredness.
- Create a contribution and prerequisite.
- Create/edit/manually satisfy a Milestone.
- Inspect canonical prerequisite explanations.
- Encounter an invalid graph/endpoint operation without losing the draft.
- Navigate to a related Goal and return.
- Retire a record with truthful historical-retention messaging.
- Preserve unrelated unsaved Goal/Requested Time drafts.

Across the retained native-browser evidence, also prove:

- The explicit prerequisite-to-planning workflow.
- Reload preservation of UI-authored records.
- Actual UI V14 export/import/reload of those records with identity/history comparison.

Canonical seeding may populate supporting Goals or scheduling prerequisites. It must not replace the Structure UI commands being certified.

Require:

- No unintended document horizontal overflow.
- Practical approximately 44 CSS px primary hit targets.
- No required hover, double-click, right-click, or dragging.
- Usable reduced-height forms and progressive disclosure.
- Visible keyboard focus and logical tab order.
- Semantic controls, headings, and accessible names.
- Associated validation/errors and non-color-only states.
- Predictable Save/Cancel/Back focus.
- Reflow checks.
- Equivalent canonical values and commands across widths.

Do not pass overflow by clipping content.

Distinguish native execution, controlled failures, synthetic fixtures, DOM measurement, and source inspection.

Do not claim physical-device, soft-keyboard, OS-dialog, screen-reader, or browser-native-zoom certification unless performed.

A mandatory unverified or failing mobile workflow means PARTIAL/BLOCKED.

---

## 15. Validation and Bundle Gate

Task 9.26 reported this historical baseline:

| Measure | Reported value |
|---|---:|
| Test files / tests | 159 / 1,590 |
| Initial raw JavaScript | 623,114 bytes |
| Initial gzip JavaScript | 163,250 bytes |
| Largest lazy chunk | 62,652 bytes |
| Total JavaScript | 1,226,690 bytes |
| Initial-gzip hard-limit headroom | 6,750 bytes |

Measure actual current before/after values.

Preserve hard limits:

- Initial gzip: 170,000 bytes.
- Initial raw: 685,000 bytes.
- Largest lazy chunk: 100,000 bytes.
- All remaining current repository hard gates.

Retain lazy Structure/editor boundaries. Lightweight context must not eagerly import planning, graph, backup, or history engines.

Do not raise thresholds or add dependencies. Report existing advisories and task-relative deltas honestly.

Run repository equivalents of:

```text
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

A documented full-suite worker bound is permitted to control resource contention. Record the exact command, all selected tests, intermediate failures, and resolutions.

Do not weaken assertions or existing timeouts merely to obtain a pass.

Format task-touched files only as necessary.

---

## 16. Explicit Non-Goals and Stop Conditions

Do not implement:

- New Goal lifecycle types, policies, or transitions.
- Recurrence, materialization, shortfall, release, replacement, or Found Time.
- Atomic reparenting, batch restructuring, or suggested decomposition.
- Quantitative Demand Accounting or Progress contribution.
- Priority propagation, automatic completion, or evidence-driven Milestones.
- Scheduling dependencies between activities.
- A graph canvas, full historical timeline, or new traversal/evidence owner.
- New Goal creation authority.
- Schema, format, migration, dependency, or recovery changes.
- Capability/code retirement or removal.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a mandatory bounded behavior requires unavailable canonical evidence.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when proceeding requires new semantics, authority, transaction behavior, persistence changes, unsafe identity assumptions, or weakened protection.

Identify the precise requirement and missing contract. Do not invent behavior in React or expand the task into a general redesign.

Known excluded future capabilities do not block this slice.

---

## 17. RESULT, Retained Evidence, and Completion Criteria

Write a separate RESULT:

`docs/implementation/phase-9/TASK_9.27_GOAL_STRUCTURE_AND_MANUAL_MILESTONE_AUTHORING_V1_RESULT.md`

Keep execution input and previous RESULTs immutable.

Additional output reports, screenshots, measurements, fixture exports, and QA artifacts must include `RESULT` in their filenames. Production/test source retains repository naming conventions.

The RESULT must include:

1. Bounded outcome and actual command/query map.
2. Governing inputs and task-relative baseline.
3. Relationship direction, graph rules, and Milestone semantics.
4. Eligibility and explicit planning interaction.
5. Field/history fidelity and record-retirement behavior.
6. Stale, persistence, retry, navigation, and restore-boundary evidence.
7. Permanent tests and production/mobile observations.
8. Before/after bundle metrics and advisories.
9. Every task-created/modified file and reason.
10. Schema, dependency, compatibility, history, and forensic-state effects.
11. Explicit remaining exclusions and completion determination.

Retain a compact evidence set under `evidence/task-9.27/` or the established equivalent:

- Reproduction commands and fixture provenance.
- Machine-readable viewport, focus, and canonical-record comparisons.
- Narrow-phone authoring, validation, and return screenshots.
- Actual export/import/reload observations.
- Material test/build/bundle output.

Distinguish retained local evidence from committed or remotely backed-up artifacts. Do not rely exclusively on `/tmp`.

COMPLETE requires all mandatory authoring, fidelity, validation, navigation, persistence/protection, automated, native-browser, mobile, and bundle gates to pass.

No mandatory unresolved requirement may be hidden beneath COMPLETE.

Completion is not full Goal Structure specification implementation, full Goals convergence, or implementation of the newer Goal Lifecycle.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.27 — Goal Structure & Manual Milestone Authoring V1 is COMPLETE.**

or:

**Task 9.27 — Goal Structure & Manual Milestone Authoring V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when users can explicitly author and inspect existing Goal relationships and manual Milestones through ordinary mobile-safe workflows, understand their actual prerequisite effects, and preserve drafts, identity, history, and recovery protection—without creating implied scheduling, accounting, Progress, or lifecycle authority.**