# Task 9.23 — Goals Lifecycle & Product Convergence Readiness Audit V1

**Status:** READY — AUDIT ONLY
**Phase:** Phase 9 — Product Convergence
**Task Type:** Repository, Architecture, Evidence-Contract, and Product-Readiness Audit
**System:** DayFrame
**Implementation Authority:** NONE
**Architecture-Change Authority:** NONE
**Persistence / Schema / Dependency Change Authority:** NONE
**Retirement / Removal Authority:** NONE

---

## 1. Objective

Establish the smallest safe implementation path from DayFrame’s current Goals experience to the accepted Goal lifecycle and product direction.

The audit must distinguish:

1. Capabilities already implemented and ordinarily reachable.
2. Implemented capabilities that need product convergence or improved reachability.
3. Accepted architectural semantics that still require domain, persistence, command, or planning implementation.
4. Product requirements that lack an adequate canonical evidence contract.
5. Genuinely unresolved architectural decisions.

Do not treat all missing UI as missing architecture.
Do not treat all accepted architecture as implemented behavior.

The deliverable is an evidence-backed readiness assessment and exactly one recommended next bounded implementation slice.

This task does not implement that slice.

---

## 2. Starting Checkpoint and Authority

Recovered RESULT artifacts establish:

- Task 9.21 — Accepted-Planning Summary Convergence V1 — COMPLETE.
- Task 9.22 — My Schedule Convergence V1 — COMPLETE.
- Task 9.22 recommends Goals as the smallest next product-convergence slice.
- Task 9.22 identifies an externally added Goal Lifecycle specification as an input for that work.
- Task 9.22 does not implement or approve that specification’s semantics.
- Task 9.22 does not assign the next task number.

This task now proposes the next execution slot as 9.23. Before execution, inspect the repository task registry and latest RESULT artifacts for a conflicting assignment. Do not overwrite, silently renumber, or reinterpret an existing task.

The September 21 hydration package is an earlier snapshot through Task 9.20. Its projected roadmap does not override later RESULTs.

This task was authored from recovered documents, not a fresh repository inspection.

Use:

- Current repository code and tests to establish executable behavior.
- Accepted architecture and ADRs to establish normative meaning.
- Task RESULTs to establish previously demonstrated bounded work.
- Hydration and conversation summaries as navigation aids only.

A difference between accepted design direction and current implementation is not automatically a contradiction. Identify whether it is an expected implementation gap or an actual conflict.

---

## 3. Required Governing Inputs

Locate and read the current repository versions of:

1. **DayFrame Goal Lifecycle Architecture Specification V1**
   - Locate the actual document referenced by Task 9.22.
   - Record its exact path, title, status, version, and governing authority.
   - Read the full document.
   - Do not reconstruct it from this task, a hydration summary, or remembered conversation.

2. **DayFrame Product Ontology & Vocabulary Specification V1**
   - Read the governing Appendix B glossary entries relevant to Goals and planning.
   - Product vocabulary translates architecture; it does not create architecture.

3. **DayFrame End-State Compatibility & Retirement Architecture Specification V1**
   - Apply its distinctions between convergence, retirement, removal, and compatibility.
   - This audit does not authorize retirement or removal.

4. **Task 9.21 and Task 9.22 RESULTs.**

5. **Task 9.19 RESULT and the canonical product-evidence projection ADR.**
   - Inspect G2’s actual public contract.
   - Inspect G1 where Goal-to-day navigation requires it.

6. Relevant existing Goal, Goal Structure, Goal Demand/Priority, Progress, realization, and durable-data compatibility specifications and RESULTs.
   - Read the exact material needed to resolve the traced capability.
   - Do not substitute a broad historical summary for a consequential contract.

If the full Goal Lifecycle specification cannot be located, continue independently useful current-state inspection, but mark lifecycle-dependent readiness conclusions blocked by missing input.

Do not manufacture its missing semantics.

---

## 4. Execution Artifact Rules

This task specification is immutable execution input.

Do not modify, replace, truncate, or overwrite it during execution.

Write a separate RESULT in the repository’s established Phase 9 result location:

`PHASE_9_TASK_9_23_GOALS_LIFECYCLE_PRODUCT_CONVERGENCE_READINESS_AUDIT_V1_RESULT.md`

Every additional durable Codex-created output artifact must include `RESULT` in its filename.

Record source paths, relevant sections, command/query names, test names, and measured observations. Distinguish:

- Source inspection.
- Existing test coverage inspected.
- Tests actually executed.
- Browser behavior actually observed.
- Inference.
- Unresolved or unavailable evidence.

Before starting, verify that the saved task contains all sections and the final completion statement in Section 20.

---

## 5. Repository Baseline and Forensic Protection

Before investigation:

- Record `git rev-parse HEAD`.
- Record `git status --short`.
- Capture a task-relative baseline sufficient to distinguish pre-existing dirty work from audit output.
- Identify the latest implementation checkpoint.
- Inspect package scripts and available validation/browser tooling.
- Record current test and bundle measurements rather than copying historical counts.

Preserve all unrelated dirty work and externally supplied architecture documents.

Do not reset, stash, commit, or push.

Do not mutate, clear, migrate, normalize, repair, or launch against the preserved Dogfood Pass 02 state.

Use disposable browser storage and disposable test data. Where inspection requires a copy of retained evidence, preserve the original exactly and identify the copy.

Normal application initialization or explicit fixture commands must operate only on disposable state.

---

## 6. Current Goals Capability Inventory

Trace the actual current implementation from product entry to canonical owner.

At minimum inspect:

- Planner → Goals.
- Goal creation and focused detail.
- Goal edits and lifecycle actions.
- Optional target dates and Goals without current Requested Time.
- Goal-to-Commitment/source links.
- Goal Structure relationships, prerequisites, and Milestones.
- Requested Time authoring and revision.
- Goal Priority.
- Resource-footprint, support, and protection authoring.
- Feasibility and constructive-planning entry.
- Accepted planning and scheduled-work inspection.
- Actual activity and independent Progress access.
- Entry from Summary and Daily Planner.
- Back navigation, selection restoration, and draft handling.

For each capability, record:

| Capability | Governing source | Current owner/API | Product entry | Persistence/history effects | Evidence | Gap/disposition |
|---|---|---|---|---|---|---|

Identify duplicate-looking Goal creation or editing paths.

Determine whether they are:

- Multiple entry points into the same command path.
- Separate presentation implementations.
- Compatibility paths.
- Semantically different capabilities.
- Actual competing owners.

Do not assume visual duplication proves architectural duplication.

---

## 7. Goal Lifecycle Specification-to-Code Comparison

Compare the full lifecycle specification with executable contracts.

Trace the exact definitions and implementation status of:

- Goal types and their distinctions.
- Goal lifecycle states and transitions.
- Explicit completion and any continuation behavior.
- Editing, pausing, resuming, cancellation, and reactivation where specified.
- Recurring or ongoing Requested Time.
- Materialization horizons and triggers.
- Period identity and repeated materialization.
- Shortfall handling, carry-forward, overdue behavior, and any ceilings.
- Capacity-response policy.
- Goal Review cadence and policy ownership.
- Effects on current requests, accepted iterations, realized future work, and retained history.

Use the document’s exact terminology, permitted values, defaults, and limits.

Do not invent missing values or infer semantics from a label.

Explicitly investigate these potential false equivalences:

- An undated active Goal is not proof that the newer Ongoing Goal lifecycle is implemented.
- Repeating a finite request manually is not proof of recurring-request support.
- An archive command is not automatically Pause or Cancel.
- Editing Requested Time is not automatically authorization to replace an Accepted Schedule.
- Completing a Goal is not automatically authority to erase its future schedule or historical evidence.
- A capability’s retirement status is not a Goal lifecycle status.

Classify an accepted but unimplemented rule as an implementation gap, not a request to redesign settled architecture.

Where the specification genuinely leaves consequential behavior unresolved, identify the precise missing decision.

---

## 8. Authority, Identity, and Planning Boundaries

For lifecycle behavior that could affect planning, trace:

- Canonical owner.
- Identity and revision.
- Effective time or applicable period.
- Stale-command rejection.
- Dependency and freshness behavior.
- Runtime acceptance versus durable persistence.
- Retry and idempotency.
- Historical resolution.
- Backup, restore, restart, profile, and clear boundaries.

Determine how current and target behavior preserve:

`Goal → Requested Time → planning → suggestion → acceptance → realization → publication → Actual → Progress`

These remain distinct authority layers.

Specifically inspect:

- Whether a lifecycle change affects future planning eligibility.
- Whether previously accepted authorization remains independently represented.
- Whether lawful cancellation or replacement commands exist.
- Whether realization has an explicit supported change path.
- Whether historical records retain decision-time identity and meaning.
- Whether missing/protected evidence blocks unsafe deductions.

Do not invent cascade behavior across authorities.

Navigation, filtering, and reviewing must not silently acquire planning or lifecycle authority. Distinguish read-only navigation from any explicitly governed materialization operation.

---

## 9. Canonical Evidence-Contract Assessment

Determine what the Goals product surface can obtain from existing public queries.

### Accepted planning and scheduled work

Inspect `queryAcceptedPlanningEvidence(...)` and the Task 9.21 consumer.

Determine whether existing G2 evidence supports:

- Goal-scoped, bounded inspection.
- Distinct accepted iterations.
- Realization state.
- Productive/support/protection roles.
- Scheduled fact identity.
- Publication and Actual lineage.
- Coverage, protection, and uncertainty.
- Navigation to the correct Daily Planner context.

Do not join raw authority collections in React to fabricate a missing evidence model.

Presentation grouping is permissible only over already-established evidence.

### Goal Structure

Determine whether existing public contracts support ordinary authoring, validation feedback, current structure inspection, and exact historical resolution.

Do not infer parent Progress, inherited Priority, or aggregate Requested Time unless the governing contracts explicitly establish them.

### Progress

Inspect the independent Progress query and reporting owners.

Determine what can be reused or lawfully linked from Goal detail.

G2’s `notInferred` Progress designation must not become zero Progress or an inferred completion percentage.

### Query behavior

Assess boundedness, subscriptions, refresh after commands, Goal/range switching races, and stale-response rejection.

Identify any genuine evidence-contract gap by the specific missing datum and its required canonical owner.

---

## 10. Product Convergence Assessment

Assess the target Goal experience against current behavior:

`Outcome → Planning Intent / Requested Time → Structure → Scheduled Work → Recorded Progress`

Apply current product vocabulary without rewriting historical RESULTs or renaming domain concepts merely for consistency.

Evaluate:

- Active-first, deterministic Goal presentation.
- Search and supported status filters.
- Bounded lists for approximately 20 or more Goals.
- One focused detail/editor.
- Human-readable hours, minutes, effort, and session counts.
- Optional target dates.
- Clear separation of a Goal from its Requested Time.
- Discoverable Structure authoring.
- Bounded accepted-iteration drill-down.
- Goal-to-schedule provenance.
- Independent Actual and Progress presentation.
- Useful empty, unavailable, protected, invalid, and loading states.
- Consequential explanations and validation errors.
- Safe handoff to Review Schedule rather than duplicate planning authority.

Do not implement these improvements in this task.

Do not label an unsupported lifecycle option “working” because a visually similar existing control is available.

---

## 11. Data Fidelity and Compatibility Assessment

Inspect whether existing and proposed focused editing paths preserve valid fields the user did not change.

Include:

- Advanced planning constraints.
- Resource footprints.
- Exact source links and unavailable-link evidence.
- Goal Structure revisions.
- Measurement references.
- Lifecycle metadata.
- Historical references and accepted-iteration lineage.

Identify any lossy reconstruction of a complete record from a simplified form.

For touched or potentially superseded Goal capabilities, use the retirement specification’s disposition vocabulary where applicable:

- REPLACED.
- MOVED.
- OBSOLETE BY ARCHITECTURE.
- COMPATIBILITY-ONLY.
- DEFERRED — RETIREMENT BLOCKED.

These are audit recommendations, not authorizations.

Do not remove ordinary reachability, declare a capability formally retired, delete implementation, or retire tests.

For any eventual migration/removal dependency, identify outstanding Production, Population, and Loader closure requirements. Do not presume them satisfied because an old screen is no longer prominent.

---

## 12. Required Evidence Scenarios

Use existing tests and disposable-state observations to examine:

1. Create and reopen a Goal without a target date or current Requested Time.
2. Edit a Goal without erasing unrelated valid data.
3. Distinguish explicit Goal completion from scheduled duration, Actual duration, and measured Progress.
4. Inspect distinct accepted iterations for one Goal.
5. Reuse the Network+ 10-hour and 20-hour regression without synthesizing one authoritative 30-hour acceptance.
6. Distinguish accepted-but-unrealized evidence from protected or unavailable realization.
7. Preserve productive work, support, and protected time as different roles.
8. Follow Goal → scheduled work → Daily Planner and return without losing the original inspection context.
9. Preserve drafts and explain stale revision or persistence failures.
10. Switch selected Goal or range while an earlier query remains pending.
11. Inspect lifecycle changes in the presence of existing accepted, realized, or historical work.
12. Exercise search, detail, and navigation with a larger Goal set.

For target lifecycle capabilities that are absent, document the absence and dependencies. Do not fabricate test controls to imply they exist.

A synthetic presentation fixture may demonstrate density only. Label it clearly and do not use it as proof of canonical authority behavior.

---

## 13. Mobile Acceptance Gate — Audit Evidence

Inspect the existing reachable Goals workflow at approximately:

- 320 px.
- 390 px.
- 768 px.
- 1280 px or representative desktop width.

Record:

- Primary workflow reachability.
- Document-level horizontal overflow.
- Practical touch targets, approximately 44 CSS px for primary actions where feasible.
- No required hover, double-click, or right-click.
- Form usability with reduced viewport height.
- Validation visibility and draft preservation.
- Back/navigation and focus restoration.
- Progressive disclosure for dense details.
- Equivalent underlying evidence across viewport sizes.

Inspect touched accessibility:

- Keyboard navigation.
- Visible focus.
- Logical tab order.
- Semantic controls and headings.
- Meaningful accessible names.
- Non-color-only status.
- Error association.
- Zoom/reflow where practical.

An observed existing failure is a valid audit finding, but it prevents a product-readiness claim for that capability.

If browser inspection cannot be performed, mark the relevant assessment unverified. Do not substitute source inspection for observed mobile acceptance.

The recommended implementation slice must carry the full Mobile Acceptance Gate as a completion requirement.

Do not claim physical-device or screen-reader certification without performing it.

---

## 14. Bundle and Validation Baseline

Run repository-equivalent, non-source-mutating validation:

```text
npx prettier --check .
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Use the existing installed toolchain. Do not install a dependency to complete this audit.

Do not run a formatting command that rewrites pre-existing source.

Record:

- Commands actually run.
- Pass/fail and test counts.
- Baseline failures, if any.
- Initial raw JavaScript.
- Initial gzip JavaScript.
- Largest lazy chunk.
- Total JavaScript.
- Hard-limit headroom.
- Advisory status.

The initial-gzip hard limit remains 170,000 bytes.

Do not raise thresholds.

Identify existing lazy boundaries and likely bundle implications of the recommended slice. Do not provide invented post-implementation measurements.

A baseline failure must be reported, not silently repaired in this audit.

---

## 15. Evidence Classification and Blockers

Use clear capability-level classifications:

- **IMPLEMENTED AND REACHABLE**
- **IMPLEMENTED — PRODUCT CONVERGENCE REQUIRED**
- **ACCEPTED DESIGN — FOUNDATION IMPLEMENTATION REQUIRED**
- **EVIDENCE CONTRACT GAP**
- **ARCHITECTURE DECISION REQUIRED**
- **INPUT MISSING / UNVERIFIED**
- **OUT OF SCOPE / DEFERRED**

Support negative findings with the concrete contracts and paths inspected. Distinguish “not found in inspected paths” from a proven absence in a closed model or API.

Use the established stop-condition labels when applicable:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

Discovering a gap is expected audit output. It does not require abandoning independent investigation.

However, do not issue a readiness conclusion whose necessary governing input or evidence is missing.

If task numbering conflicts, required inputs are inaccessible, or executable validation is blocked, preserve useful partial findings and state precisely what remains incomplete.

---

## 16. Explicit Non-Goals

Do not:

- Implement or redesign Goal lifecycle.
- Add recurring/ongoing Requested Time or materialization.
- Add new lifecycle fields, stores, schema versions, or backup formats.
- Add UI-only authority or unversioned persisted fields.
- Change scheduling, Capacity, feasibility, or allocation policy.
- Add cancellation/replacement semantics by implication.
- Automatically accept, realize, publish, complete, or replan.
- Infer Progress from time.
- Implement Found Time or the Phase 10 live loop.
- Implement protected-history recovery.
- Perform broad vocabulary replacement.
- Rewrite historical documents.
- Retire or remove capabilities, surfaces, compatibility code, or tests.
- Fix unrelated defects encountered during the audit.
- Commit or push.

Temporary probes may use existing tooling and disposable locations. They must not alter production behavior or preserved user evidence.

---

## 17. Required RESULT Contents

The RESULT must contain:

1. Executive determination.
2. Task identity and artifact-integrity check.
3. Repository baseline and task-relative file accounting.
4. Governing input inventory with exact paths/statuses.
5. Current Goals product and authority map.
6. Capability/specification-to-code matrix.
7. Goal lifecycle comparison.
8. Requested Time/materialization/shortfall findings.
9. Goal Structure findings.
10. G2, scheduled-work, Actual, and Progress contract assessment.
11. Persistence, identity, freshness, and historical effects.
12. Compatibility and eventual retirement dependencies.
13. Existing workflow/mobile/accessibility observations.
14. Tests and validation actually executed.
15. Current bundle measurements.
16. Explicit unresolved decisions and missing evidence.
17. Exactly one recommended next bounded implementation slice.
18. Final completion determination.

Keep findings traceable. Do not substitute a long file list for an explanation of what each relevant contract establishes.

---

## 18. Required Next-Slice Recommendation

Recommend exactly one smallest coherent implementation slice.

Provide enough detail to author its execution task without repeating this general audit:

- Proposed title, without automatically assigning another task number.
- User-visible or foundational outcome.
- Why it is the next dependency.
- Accepted semantics it implements.
- Exact existing owners and contracts to reuse.
- Expected production areas affected.
- Whether persistence or migration work is required.
- Any specific architecture decision needed before implementation.
- Explicit exclusions.
- Regression scenarios.
- Mobile and accessibility requirements where applicable.
- Bundle constraints.
- Completion criteria.

A foundational slice is legitimate when the lifecycle contract requires it.

A product-convergence slice is legitimate when its underlying semantics already exist.

Do not recommend another generic audit merely because implementation is substantial. Further architecture work must be justified by a specific unresolved decision, not by the existence of unimplemented accepted requirements.

Do not describe existing-only UI convergence as completion of the entire newer Goal lifecycle.

---

## 19. Completion Criteria

This audit is complete only when:

- Required governing inputs have been inspected, or missing inputs explicitly limit the determination.
- Current executable behavior is separated from accepted future design.
- Consequential findings have traceable source/test evidence.
- Product reachability is distinguished from underlying capability.
- Lifecycle effects on planning and history are assessed.
- Evidence gaps are identified without inventing replacement semantics.
- Mobile/accessibility evidence is honestly qualified.
- Current validation and bundle results are reported.
- Pre-existing work and forensic data remain unchanged.
- No implementation, retirement, or removal occurred.
- One concrete next slice is justified, or the exact blocker preventing that recommendation is documented.

Use **COMPLETE**, **PARTIAL**, or **BLOCKED** according to the evidence.

An audit may be COMPLETE while finding that Goals implementation is not ready. That is not a claim that Goals convergence is complete.

---

## 20. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.23 — Goals Lifecycle & Product Convergence Readiness Audit V1 is COMPLETE.**

or:

**Task 9.23 — Goals Lifecycle & Product Convergence Readiness Audit V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when repository evidence establishes what Goals already supports, what the accepted lifecycle requires, and the smallest safe next implementation slice—without changing product authority, weakening compatibility, or rewriting history.**