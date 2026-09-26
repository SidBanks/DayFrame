# Task 9.27 — Goal Structure & Manual Milestone Authoring V1 — Authorized Continuation

**Status:** READY — EXPLICIT AUTHORING CONTINUATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Existing Goal Structure Product Authoring and Evidence Integration
**System:** DayFrame
**Task Identity:** Continuation of original Task 9.27, not a new numbered task
**Prerequisite:** Task 9.27.2 — Goal Structure Canonical Owner Repair V1 — accepted COMPLETE
**Implementation Authority:** Existing repaired commands/queries, presentation, and navigation
**Structure-Record Authority:** Explicit existing relationship/Milestone commands only
**Architecture / Domain-Semantics Change Authority:** NONE
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**Capability / Code Retirement or Removal Authority:** NONE

---

## 1. Objective

Complete the original Task 9.27 authoring workflow over the repaired canonical owners.

From a selected Goal, users must be able to:

- Link existing Goals through containment, contribution, and prerequisites.
- Create and manage manual Goal-owned Milestones.
- Inspect current relationship status, applicability, and prerequisite evidence.
- Edit supported fields without losing untouched facts or history.
- Navigate among Goals without accidental draft loss.
- Understand validation, stale revisions, persistence, busy, and protected outcomes.

The foundation repairs are prerequisites, not substitutes for these product outcomes.

Flat Goals remain valid. Structure is optional.

Do not implement the full Goal Structure specification, newer Goal Lifecycle, or a general graph editor.

---

## 2. Continuation Authority and Historical Integrity

The sequence is:

```text
Original 9.27:
PARTIAL/BLOCKED before application implementation

9.27.1:
Resolution proposal completed and subsequently accepted

9.27.2:
Canonical owner repair accepted COMPLETE

This continuation:
Original authoring scope authorized to resume
```

Preserve the original 9.27 execution input, blocked RESULT, diagnostics, observations, and all intervening artifacts unchanged.

Save this continuation separately:

`TASK_9.27_GOAL_STRUCTURE_AND_MANUAL_MILESTONE_AUTHORING_V1_CONTINUATION.md`

The original Task 9.27 assignment intentionally exists. Check for an already-executed or conflicting continuation/newer RESULT before proceeding; do not treat the original assignment as a collision.

This continuation incorporates the original scope and acceptance requirements. Its owner-contract references use the accepted ADR and repaired implementation where the original task assumed capabilities subsequently found defective.

It does not waive a requirement merely because the foundation was repaired.

Verify the saved continuation contains Sections 1–18 and the final completion statement.

---

## 3. Governing Inputs and Focused Contract Check

Read the actual repository copies of:

1. Original Task 9.27 input and PARTIAL/BLOCKED RESULT.
2. `ADR_GOAL_STRUCTURE_TEMPORAL_QUALIFICATION_AND_OWNER_SAFETY_V1_RESULT.md`.
3. Task 9.27.2 RESULT and relevant permanent owner/planning safety tests.
4. Task 9.27.1 proposal and RESULT as the accepted decision’s provenance.
5. Goal Structure Architecture Specification and Task 8.2 RESULT.
6. Tasks 9.24–9.26 RESULTs and relevant UI/navigation/restore regressions.
7. Product Ontology and governing Appendix B entries.
8. Durable-data compatibility and cross-storage restore ADRs.
9. End-State Compatibility & Retirement specification.

Inspect the repaired public store, Structure surface/lazy adapter, explicit query, current/exact reads, command returns, subscription, admission, and durability contracts.

Record a concise current command/query map before implementation.

Do not reconstruct signatures from the pre-repair blocked RESULT or the proposal’s illustrative types.

Do not repeat the general Goals audit. Preserve original defect-confirming diagnostics as historical evidence; they are not repaired-behavior acceptance tests.

---

## 4. Baseline and Forensic Protection

Before implementation:

- Record HEAD and exact working-tree status.
- Inspect applicable repository instructions.
- Capture task-relative tracked/untracked preservation evidence.
- Measure current tests and production bundle.
- Identify the actual governing source versions and lazy boundaries.

Task 9.27.2 began with 209 status entries and 1,052 baseline files. Those are historical measurements, not expected current counts.

Preserve unrelated dirty work, historical artifacts, prior evidence, and task inputs.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable browser profiles, origins, databases, and fixtures only.

---

## 5. Product Entry and Implementation Boundaries

Add a progressively disclosed Structure section within selected Goal detail.

Reuse existing Goal selection, app-owned editing context, navigation, readiness, and persistence-feedback patterns.

A focused lazy Structure component and lightweight presentation/context helpers are permitted.

Likely touched areas include:

- `GoalSection.tsx`
- `DayFrameApp.tsx`
- Existing Goal editing context/hooks.
- A focused `GoalStructureSection.tsx` or equivalent.
- Scoped styles and UI/integration tests.

Keep heavy Structure/query logic lazy. Presentation context must not eagerly import graph, planning, history, or backup engines.

Use existing Goal creation elsewhere. This task links existing Goals; it does not require a combined Goal-plus-relationship transaction or duplicate Goal creator.

Keep Requested Time, Measurement, Progress, accepted-work inspection, supporting Commitment links, and current Goal lifecycle actions reachable.

No new owner, graph validator, recovery command, or persistence authority belongs in React.

---

## 6. Relationship Authoring

Expose the existing relationship kinds through their canonical commands.

### Containment

Allow explicit parent/Subgoal linkage with required or optional semantics.

Make direction clear: the broader Goal contains the subordinate Goal.

Requiredness must be an intentional, understandable choice.

A Subgoal remains an ordinary Goal with independent identity, lifecycle, Requested Time, Priority, Progress, and links.

Containment alone does not create a prerequisite, combine time requests, inherit Priority, or complete another Goal.

### Contribution

Support directional non-aggregating contribution.

Explain that contribution is not parenthood and does not automatically transfer measured Progress or Requested Time.

Preserve lawful multiple-target contributions and non-aggregating contribution cycles.

### Prerequisites

Support existing hard/advisory modes and the implemented conditions:

- A specified Goal is completed.
- A specified manual Milestone is satisfied.

Direction is dependent Goal → prerequisite.

Do not add Progress thresholds, overrides, policy types, or activity-ordering semantics.

### Editing and retirement

Expose supported semantic changes, including containment requiredness and prerequisite strength/condition, through revision-checked owner commands.

Preserve fields not intentionally edited.

Explicit relationship retirement is permitted through the existing command. It retains history and does not delete the endpoint Goals.

No atomic reparenting, disguised endpoint move, automatic replacement of an existing parent, batch restructuring, or silent relationship-kind conversion is authorized.

---

## 7. Manual Milestone Authoring and Fidelity

Support the existing Goal-owned manual Milestone model:

- Create with title and optional target date.
- Edit supported metadata.
- Explicitly mark satisfaction.
- Offer other existing active/satisfied/retired transitions only through their lawful commands and validation.
- Inspect current state and exact identity/revision.

Do not invent a transition merely from an enum label.

A Milestone has no duration, Requested Time, Priority, independent Progress stream, or schedule ownership.

Distinguish checkpoint satisfaction from Goal completion, activity reporting, and measured Progress.

### Required fidelity

A metadata-only or same-state edit preserves the current lifecycle timestamp exactly.

Omitted targetDate preserves it; explicit clearing uses the existing null contract.

Owner, policy, identity, creation time, provenance, and prior revisions remain intact.

A combined metadata/state change follows the existing single-revision command behavior.

Do not offer authoring of satisfiedAt, retiredAt, relationship effective intervals, or command time. These are not new form fields.

### Referenced retirement

Retiring a Milestone referenced by an active dependency may reject.

Explain the actual returned result without auto-retiring dependent relationships, inventing a batch operation, or claiming a specific blocking record the owner did not identify.

No automatic historical timestamp correction is authorized.

---

## 8. Canonical Applicability and Evidence Presentation

New Structure UI uses the repaired explicit current-authority query.

Capture one real evaluation instant per logical refresh and pass it to that query.

Use canonical current/exact record APIs for supported detail and labels. Do not assume the eligibility result includes every record field or inverse relationship.

In particular, do not promise a complete “Goals depending on this Milestone” inventory unless an existing public query supplies it.

Display separately:

- Active/retired record status.
- Effective interval information.
- Canonical applicability.
- Current prerequisite/eligibility result.
- Evaluation time and current-authority basis.
- Protection or unavailable evidence.

Preserve eligible, ineligible, conditionallyEligible, and unknown.

Eligibility is not complete Feasibility, free Capacity, scheduling readiness, or parent completion eligibility.

Do not infer “ready to complete” from counting required children.

A future-effective active record may be visible but not applicable. A retired latest record is not revived by displaying an earlier date.

Do not add a historical-time scrubber or claim historical Goal-state reconstruction.

### Qualification

A legacy temporal anomaly anywhere in retained Structure may qualify the entire authority as unsafe.

Keep readable records available where the canonical contract permits, explain the limitation, and block ordinary Structure mutations/retry as required.

Unavailable ingress must not become an empty list. Temporal qualification must not be mislabeled malformed input.

Do not disable unrelated independent Goal capabilities solely because Structure is temporally unqualified, unless the existing global readiness contract requires it.

Never promise an unimplemented repair action.

---

## 9. Refresh, Freshness, and Read Races

Refresh canonical Structure evidence on:

- Opening the section.
- Selected Goal/query-owner change.
- Explicit Refresh.
- Relevant existing subscriptions.
- Return/remount after navigation.
- Completion or rejection of an explicit operation where current evidence must be shown.

Use one captured instant per refresh. Do not call the legacy clock-sampling wrapper after already obtaining explicit evaluated evidence.

A stationary view states when it was evaluated. It must not claim continuously live eligibility.

Use existing freshness signals and canonical recomputation before consequential actions. Do not implement temporal membership or clock-watermark rules in the UI.

No polling, per-render sampling, durable query cache, or new event bus.

Associate results with Goal, owner, request generation, and editing-context boundary.

Late successes or failures for A must not overwrite B, revive replaced context, or appear under the wrong heading.

Refresh never saves a draft, rebases its expected revision, or initiates planning.

---

## 10. Bounded Lists, Endpoint Selection, and Drafts

Provide searchable, bounded selection of existing Goals.

Use stable canonical identity. Duplicate titles must remain distinguishable without title-based matching.

Milestone choices show the owning Goal.

Start each relationship/Milestone group with at most 10 visible rows and explicit incremental reveal. Keep deterministic ordering and identity-based disclosure.

These are rendering bounds, not bounded-storage claims.

Use one focused relationship or Milestone editor at a time.

Retain ephemeral app-owned context for:

- Selected Goal and record.
- Base snapshot and expected revision.
- Draft and intended fields.
- Search/filter/reveal/disclosure.
- In-flight operation and accepted identity/outcome.
- Return destination and focus.

Preserve unsaved Goal and Requested Time drafts while editing Structure.

Related-Goal navigation must either retain the affected draft or require an explicit discard/stay decision. Unmount is not permission to discard.

On return from a related Goal, Review Schedule, or Daily Planner, restore appropriate context and focus.

No persistent draft store or restart-surviving draft promise is authorized.

---

## 11. Commands, Admission, Persistence, and Retry

Use repaired canonical commands as the sole write authority.

Before dispatch, preserve the user’s intended fields and original expected revision. After acceptance, read canonical state and report its actual outcome.

Distinguish:

- Validation or graph rejection.
- Stale revision.
- Missing/unavailable endpoint.
- Clock-before-recorded-authority rejection.
- Temporal protection.
- Owner busy or active transaction.
- Runtime acceptance.
- Persistence pending/failure.
- Durable completion.
- Replaced context or recovery-required state.

Translate actual returned reasons. Do not fabricate graph paths, blocking IDs, or exact diagnosis absent from the response.

Prevent repeated unresolved submissions even before a React repaint.

An accepted runtime record with failed persistence retains its identity. Retry uses the existing persistence retry command; it does not repeat creation or create a new semantic revision.

An operation rejected as busy/protected is not “saved locally.”

Cancel discards only unsaved intent. It does not roll back accepted authority.

Preserve drafts on stale or clock rejection. Do not silently rebase, clamp dates, resample until success, queue intent, or automatically retry.

Late accepted outcomes remain attributed to their original record. They must not overwrite another editor or trigger follow-up writes across a replaced context.

Do not weaken, bypass, or recreate the owner lease, epoch, generation, storage-admission, or coordinator protections.

---

## 12. Planning and Restore Integration

Demonstrate the original explicit prerequisite workflow:

```text
Author a hard prerequisite through Structure UI
→ explicitly evaluate Requested Time
→ observe the unmet prerequisite

Explicitly satisfy the existing Goal/Milestone condition
→ explicitly evaluate again
→ consume updated canonical eligibility
```

Creating or satisfying Structure does not itself evaluate, record a Proposal, accept, realize, publish, report Actual, or record Progress.

Existing Structure subscriptions may invalidate derived planning evidence. Preserve the repaired actual-time acceptance revalidation.

Do not revise Requested Time/Priority or rewrite existing accepted work merely because Structure changed.

Keep Network+ accepted iterations distinct and Goal inspection direct—not an ancestor roll-up.

### Restore boundaries

Verify the new editor participates in existing context invalidation:

- Rejected import preserves appropriate drafts.
- A transaction that began and aborted may invalidate operation tokens without erasing unchanged drafts/accepted identities.
- Successful complete restore or clear invalidates displaced context.
- Late operations cannot replay into replacement authority.
- Recovery-required readiness blocks ordinary authoring.
- Profile loading preserves its independent scope.

An anomalous preservation import must expose truthful read-only Structure evidence and reject authoring without losing stored rows.

Use existing coordinator-owned import/export workflows. The editor receives no privileged restore/clear capability.

---

## 13. Permanent Automated Regressions

Add UI/integration tests for the original requirements over the repaired owners.

Required coverage:

1. Required/optional containment, directional contribution, and hard/advisory prerequisites through ordinary controls.
2. Goal-completed and Milestone-satisfied conditions, including duplicate endpoint titles.
3. Milestone create/edit/satisfaction and supported transitions; optional date and lifecycle timestamp fidelity.
4. Rejection of multi-parent containment, self/duplicate edges, invalid endpoints/conditions, and containment/dependency cycles.
5. A lawful non-aggregating contribution cycle.
6. Four-state eligibility, future/retired applicability, qualified-empty versus unavailable evidence, and nonlatest temporal anomaly protection.
7. Explicit prerequisite-to-planning workflow with no automatic downstream writes.
8. Narrow field patches, semantic no-ops, expected revisions, and exact history.
9. Clock/stale/busy/protected rejections retaining drafts.
10. Pending persistence, storage failure, retry, and duplicate-submission prevention without duplicate records.
11. Goal/record switching, read races, and late command attribution.
12. Navigation preserving Structure plus unrelated Goal/Requested Time drafts.
13. Actual rejected/successful V14 import, displaced continuations, and recovery-readiness handling.
14. UI-authored record retirement preserving earlier exact revisions through reload and backup/restore.
15. No parent completion, Priority inheritance, time aggregation, Progress credit, or accepted-history rewrite.
16. At least 24 Goals and more than 10 valid records in relevant groups proving bounded selection/reveal.

Use canonical commands or validated builders for semantic evidence.

Synthetic density fixtures must be labeled and cannot certify graph validity, persistence, or I/O performance.

Retain and run existing owner-safety/planning-safety suites and Tasks 9.24–9.26 regressions. Do not duplicate every lower-level interleaving test in React; add the presentation-boundary coverage needed here.

Do not weaken existing semantic assertions or rewrite historical diagnostic artifacts.

---

## 14. Production Browser and Mobile Acceptance Gate

Use a production build and disposable state at approximately:

```text
320px
390px
768px
1280px
```

At every width exercise:

- Find/select a Goal and open Structure.
- Link an existing Subgoal with explicit requiredness.
- Create a contribution and prerequisite.
- Create/edit/manually satisfy a Milestone.
- Inspect current canonical prerequisite/applicability explanations.
- Encounter an invalid relationship operation without losing input.
- Navigate to a related Goal and return.
- Retire a record with truthful history messaging.
- Preserve unrelated unsaved Goal/Requested Time drafts.

Across retained native evidence also demonstrate:

- The explicit prerequisite-to-planning workflow.
- Rename after satisfaction preserving the original satisfaction timestamp.
- Reload persistence of UI-authored records.
- Actual UI V14 export/import/reload preserving their identities and history.
- Anomalous preserved Structure presented without enabled ordinary Structure writes or falsely empty evidence.

Supporting fixture seeding is allowed. It must not replace the Structure UI commands being certified.

Precise clock rollback and interleaving proofs remain deterministic automated tests unless actually exercised in the native run.

Require:

- No unintended document horizontal overflow.
- Practical approximately 44 CSS px primary hit targets.
- No required hover, double-click, right-click, or dragging.
- Usable reduced-height forms and progressive disclosure.
- Visible keyboard focus and logical tab order.
- Semantic controls/headings and accessible names.
- Associated validation/errors and non-color-only states.
- Predictable Save/Cancel/Back focus.
- Reflow checks.
- Equivalent canonical commands and values across widths.

Do not hide overflow to pass the gate.

Distinguish native execution, controlled failures, synthetic fixtures, DOM measurements, and source inspection.

Do not claim physical-device, OS-dialog, soft-keyboard, screen-reader, or browser-native-zoom certification without performing it.

A missing or failing mandatory authoring/mobile workflow prevents COMPLETE.

---

## 15. Validation and Bundle Gate

Task 9.27.2 reported:

| Measure | Historical value |
|---|---:|
| Test files / tests | 161 / 1,626 |
| Initial raw JavaScript | 625,674 bytes |
| Initial gzip JavaScript | 163,927 bytes |
| Largest lazy chunk | 62,657 bytes |
| Total JavaScript | 1,237,649 bytes |
| Initial-gzip hard-limit headroom | 6,073 bytes |

Measure actual current before/after values.

Preserve:

- Initial gzip ≤170,000 bytes.
- Initial raw ≤685,000 bytes.
- Largest lazy chunk ≤100,000 bytes.
- All other current repository hard gates.

Keep Structure/editor/query logic lazy and context lightweight.

Do not raise thresholds, add dependencies, or launch unrelated bundle restructuring.

Report existing advisories and task-relative changes honestly.

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

A documented worker bound for the complete suite is permitted. Record exact commands, selected suite, intermediate failures, and resolutions.

Do not weaken assertions, existing timeouts, or configuration to obtain a pass.

Format only task-created/touched files as necessary.

---

## 16. Explicit Non-Goals and Stop Conditions

Do not implement:

- Further temporal/owner redesign.
- Effective-interval or command-timestamp authoring.
- Historical reconstruction or automatic historical correction.
- Atomic reparenting or batch restructuring.
- Suggested decomposition or a graph canvas.
- Quantitative Demand Accounting or Progress contribution.
- Priority propagation or automatic completion.
- Evidence-driven Milestones.
- New Goal lifecycle, recurrence, release, replacement, or Found Time.
- Scheduling dependencies between activities.
- New recovery/export authority or persistent drafts.
- Schema, format, migration, or dependency changes.
- Capability/code retirement or removal.

Domain record retirement remains permitted through existing commands; capability retirement does not.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a mandatory bounded view/action requires evidence the repaired public contracts do not supply.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when implementation needs new semantics, authority, transaction behavior, incompatible serialization, unsafe identity assumptions, or weakened protection.

Identify the precise requirement and missing contract.

Do not use known excluded capabilities as reasons to stop this slice. Do not silently waive a genuine mandatory gap or patch it through UI-local authority.

---

## 17. Continuation RESULT, Evidence, and Completion Criteria

Write a NEW result:

`docs/implementation/phase-9/TASK_9.27_GOAL_STRUCTURE_AND_MANUAL_MILESTONE_AUTHORING_V1_CONTINUATION_RESULT.md`

Do not overwrite the original blocked RESULT.

Retain evidence under:

`docs/implementation/phase-9/evidence/task-9.27-continuation/`

or the established equivalent.

All additional reports, screenshots, measurements, fixture exports, and QA outputs must include `RESULT` in their filenames. Application/test source retains normal repository conventions.

The continuation RESULT must include:

1. Bounded outcome and historical continuation chain.
2. Governing inputs and task-relative baseline.
3. Current command/query map.
4. Original 9.27 requirement-to-evidence matrix.
5. Relationship direction, graph rules, and Milestone behavior.
6. Canonical applicability/qualification and explicit planning interaction.
7. Field/history fidelity and record retirement.
8. Draft/navigation, stale/busy/protected, persistence/retry, and restore outcomes.
9. Permanent regressions and native/mobile observations.
10. Before/after bundle metrics and advisories.
11. Every created/modified file and purpose.
12. Schema, dependency, compatibility, history, and forensic-state effects.
13. Remaining exclusions and final determination.

Retain reproduction commands, fixture provenance, canonical record comparisons, viewport/focus measurements, representative narrow-screen authoring/error/return screenshots, actual export/import/reload evidence, and material validation logs.

Distinguish retained local artifacts from commits or remote backups. Do not rely exclusively on `/tmp`.

COMPLETE requires all original mandatory authoring, fidelity, historical, navigation, protection, persistence, automated, native-browser, mobile, and bundle requirements to pass under the repaired contract.

Do not substitute Task 9.27.2’s foundation tests or current-surface browser evidence for this continuation’s new authoring acceptance.

Completion remains bounded: it is not full Goals convergence or implementation of the newer Goal Lifecycle.

---

## 18. Final Completion Statement

End the continuation RESULT with the applicable determination:

**Task 9.27 — Goal Structure & Manual Milestone Authoring V1 is COMPLETE through this authorized continuation. The original blocked execution and its RESULT remain unchanged.**

or:

**Task 9.27 — Goal Structure & Manual Milestone Authoring V1 remains PARTIAL/BLOCKED for the reasons documented in this continuation RESULT.**

**The task is complete when users can author and inspect existing Goal relationships and manual Milestones through ordinary mobile-safe workflows, understand canonical prerequisite and applicability evidence, and preserve drafts, identity, history, and recovery protection—without creating implied scheduling, accounting, Progress, or lifecycle authority.**