# Task 9.24 — Goals Focused Editing & Requested Time Fidelity V1

**Status:** READY — BOUNDED IMPLEMENTATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Data-Fidelity Repair, Focused Editing, Navigation, and Mobile Product Convergence
**System:** DayFrame
**Prerequisite:** Task 9.23 — Goals Lifecycle & Product Convergence Readiness Audit V1 — accepted COMPLETE
**Implementation Authority:** Existing Goal / Requested Time product workflows and presentation orchestration only
**Architecture / Domain-Semantics Change Authority:** NONE
**Persistence-Format / Schema / Dependency Change Authority:** NONE
**Retirement / Removal Authority:** NONE

---

## 1. Objective

Make existing Goal and finite Requested Time authoring safe, focused, and usable on mobile and desktop.

The user must be able to:

- Find a Goal in a larger collection.
- Open one focused Goal and Requested Time editor.
- Change intended fields without silently changing other valid data.
- Navigate away and return without accidentally losing selection or drafts.
- Understand validation, stale revisions, partial saves, and persistence outcomes.
- Continue through existing planning/review workflows without changing their authority.

The primary correctness repair is Task 9.23 finding F1: a Priority-only save silently reconstructs and changes untouched session constraints.

This task implements existing capabilities correctly. It does not implement the September Goal Lifecycle specification as a whole.

---

## 2. Starting Checkpoint and Task Authority

The accepted checkpoint is:

- Task 9.21 — Accepted-Planning Summary Convergence V1 — COMPLETE.
- Task 9.22 — My Schedule Convergence V1 — COMPLETE.
- Task 9.23 — Goals Lifecycle & Product Convergence Readiness Audit V1 — COMPLETE, audit only.

Task 9.23 recommended exactly this bounded implementation slice.

Its reported findings include:

- Lossy Requested Time reconstruction during a Priority edit.
- Selected-detail horizontal overflow at 320/390px.
- Lost Goal selection and drafts after navigation.
- Unbounded rendering of 24 Goals without search/status filters.
- Incomplete touch-target, focus, and error-association behavior.

Before execution, confirm no conflicting Task 9.24 assignment exists. The older hydration package’s projected “9.24 — Review Plan” is not an executed assignment.

Do not overwrite or silently renumber an actual conflicting task.

This task was authored from the audit RESULT. Reconfirm the touched implementation and current baseline; do not repeat the general readiness audit.

---

## 3. Required Governing Inputs

Read the actual repository copies of:

1. Task 9.23 RESULT, especially §§5–6 and §§10–18.
2. Task 9.21 RESULT for app-owned presentation context and async navigation patterns.
3. Task 9.22 RESULT for focused editing and data-preservation patterns.
4. `docs/architecture/DayFrame_Product_Ontology_Vocabulary_Specification_V1.md`.
5. Relevant Appendix B entries in the Complete Architecture specification.
6. `docs/architecture/DayFrame_End_State_Compatibility_Retirement_Architecture_Specification_V1.md`.
7. Relevant existing Goal, Goal Demand/Priority, resource-footprint, and durable-data compatibility contracts.

Consult `docs/architecture/DAYFRAME_GOAL_LIFECYCLE_ARCHITECTURE_SPECIFICATION_V1.md` for the boundary between current behavior and accepted future lifecycle behavior.

Do not implement its unimplemented semantics under this task.

Resolve source paths from the repository, not attachment display names. Preserve historical document terminology and contents.

Current code/tests establish executable behavior. Accepted architecture establishes normative meaning. The audit supplies findings and navigation, not a substitute command contract.

---

## 4. Baseline and Repository Protection

Before changing files:

- Record `git rev-parse HEAD` and `git status --short`.
- Inspect applicable repository instructions.
- Capture task-relative baseline evidence for tracked and untracked work.
- Measure current tests and bundle output.
- Record the exact Task 9.23 RESULT and governing documents used.

The audit reported 183 pre-existing status entries. Do not treat the entire difference from HEAD as this task’s work.

Preserve unrelated edits, untracked implementation, architecture documents, task inputs, historical RESULTs, and forensic artifacts.

Do not reset, stash, commit, or push.

Do not open, initialize, mutate, clear, migrate, repair, or normalize the preserved Dogfood Pass 02 browser state.

Use disposable browser storage and test data only.

---

## 5. Implementation Scope and Existing Owners

Start with the current equivalents of:

- `code/src/ui/GoalSection.tsx`
- `code/src/ui/GoalPlanningSection.tsx`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/plannerNavigation.ts`
- `dayFrameUi.css`
- Focused Goal, planning, and navigation tests.

A small presentation/context helper is permitted where it reduces duplication and preserves lazy boundaries.

Reuse:

- `goalSurface` revision-checked commands.
- `goalPlanningSurface` Demand, Priority, and footprint commands.
- Existing exact footprint resolution.
- Goal/Planning subscriptions and persistence outcomes.
- Existing Planner navigation.
- Existing duration controls where their semantics fit.

Do not add a competing store, UI-local domain authority, direct IndexedDB writes, or a replacement planning engine.

Canonical command, validation, identity, and persistence semantics remain unchanged.

---

## 6. Mandatory F1 Repair — Lossless Requested Time Editing

First add a permanent regression that reproduces the defect using valid canonical state.

### Required baseline fixture

A 240-minute splittable request contains:

```ts
{
  minimumMinutes: 30,
  preferredMinutes: 60
  // maximumMinutes is absent
}
```

Change only Goal Priority through the ordinary UI and save.

### Required outcome

The request still has:

- Minimum session: 30 minutes.
- Preferred session: 60 minutes.
- No authored maximum session value.

It must not become:

```ts
{
  minimumMinutes: 30,
  maximumMinutes: 240
}
```

Fix the form’s interpretation and command construction, not the domain validator.

Maintain a distinction between:

- An absent optional value.
- An explicitly authored value.
- A presentation placeholder/default.
- A field the user deliberately changed or cleared.

Use intended-field patches where supported, or preserve the complete canonical semantic value when a command requires replacement.

For a pure Priority edit, do not revise Demand or re-author its footprint unless an existing canonical contract demonstrably requires it. Document and test any such requirement.

Do not change domain revision policy to suppress UI-generated churn.

Preserve untouched:

- Session minimum, preferred, and maximum values.
- Splitting and satisfaction/session-count configuration.
- Horizon and other valid planning constraints.
- Bounded Priority overrides.
- Exact footprint specification/revision, variant, and optional-component selection.
- Advanced support/protection geometry.
- Source-link identity and unavailable-link evidence.
- Goal metadata and measurement references.

When an intentional edit conflicts with preserved constraints, explain the validation failure. Do not silently clamp, normalize, or erase the conflicting data.

Closing advanced controls is never authorization to reset their values.

Preserve prior historical revisions exactly.

---

## 7. Focused Goal and Requested Time Experience

Keep Goal outcome separate from Requested Time.

A Goal may exist without a target date, measurement definition, or current request. Creating a Goal must not automatically create Demand.

Provide one focused Goal editor and one selected request editor at a time, with progressive disclosure for dense planning controls.

Use current product language such as:

- Goal.
- Requested Time.
- Hours and minutes.
- Sessions.
- Review Schedule.

Do not rename domain records or historical artifacts for presentation consistency.

Preserve ordinary access to existing:

- Goal creation and editing.
- Supporting Commitment links.
- Measurement setup and Progress reporting.
- Requested Time authoring.
- Priority and supported footprint controls.
- Explicit planning evaluation and the existing review destination.
- Current completion/archive/reactivation commands.

Current Goal statuses remain active/completed/archived.

Do not label Archive as Pause or Cancel, Reactivate as Resume or Continue, or an undated Goal as implemented Ongoing lifecycle support.

Do not imply that current Goal completion cancels accepted work, releases scheduled time, or changes recorded Progress.

---

## 8. Bounded Goal List

Implement:

- Active-first presentation.
- Title search.
- Filters for supported current statuses.
- A documented deterministic ordering with stable tie-breaking.
- A small initial visible-row limit, with explicit reveal/load-more behavior.
- Meaningful counts and distinct empty/no-match states.

The 24-Goal fixture must not render every Goal as an expanded editing surface.

Use one focused detail rather than a stack of open editors.

Filtering, sorting, and revealing rows are presentation operations only. They must not invoke Goal, Demand, Priority, Proposal, acceptance, or lifecycle writes.

A search/filter change must not silently replace or discard a dirty editor.

A Goal opened from Summary or Daily Planner must remain reachable even when remembered filters exclude it. Handle this explicitly without losing the originating surface’s return context.

Do not claim bounded storage I/O merely because rendered rows are bounded.

---

## 9. Draft Identity and Navigation

Move necessary presentation context above route-driven unmounts or use the existing equivalent pattern.

Retain, as applicable:

- Selected Goal and request identities.
- Search, filter, and reveal state.
- Expanded sections.
- Draft fields, dirty state, and base revisions.
- In-flight save identity and known outcomes.
- Return destination and focus context.

Drafts remain ephemeral presentation state.

Do not persist them into Goal/Demand authority, backups, profiles, browser storage, or a new durable draft store. Restart-surviving drafts are not part of this task.

For ordinary Goals → Review Schedule → Back:

- Restore selection and inspection context.
- Preserve unsaved edits unless the user explicitly discarded them.
- Restore sensible focus.

For Goal/request switching, either preserve drafts by identity or require explicit discard/stay behavior before losing them. Do not use implicit unmount as discard.

Preserve existing Summary → Goal/Day → Back behavior.

Do not display one Goal’s draft under another Goal or one request’s fields under another request.

Respect existing clear/restore/protection boundaries. A retained draft must not silently replay into replaced, unavailable, or protected authority.

Profile changes must not be treated as replacement of independent Goal authority merely for convenience.

---

## 10. Save, Failure, Retry, and Async Behavior

Retain expected-revision checks and canonical validation.

### Successful commands

After acceptance, read canonical state again and render its actual outcome.

Do not treat local draft values as proof of durable success.

Refresh successful portions without overwriting unresolved user edits.

### Stale revisions

Keep the draft and provide an actionable explanation.

Do not silently advance the draft’s expected revision, overwrite concurrent changes, or retry against newer authority as though the user had reviewed it.

Offer a deliberate review/reload/discard path consistent with existing contracts.

### Partial saves

The existing Demand → Priority → footprint sequence is not one atomic transaction.

Do not claim all-or-nothing behavior.

Identify what succeeded, what failed, and what remains pending. Retain returned identities and confirmed outcomes needed for a safe continuation.

Retry must not create duplicate Goals, requests, footprint specifications, or associations merely because a later step failed.

Use existing persistence-retry behavior when the semantic command already succeeded. Do not resubmit creation as a substitute for saving an existing accepted record.

Prevent accidental duplicate submissions while a command is unresolved.

### Persistence

Distinguish rejection, runtime acceptance, persistence pending/failure, and durable completion using the actual owner contract.

Cancel/discard of an unsaved draft is not rollback of previously accepted changes.

### Async selection

A late read/evaluation for A must not overwrite the current B view.

A late successful command for A must still be accounted for against A; do not discard its authoritative outcome merely because navigation occurred.

Preserve current evaluation invalidation and stale-response protections.

Navigation and filtering must not evaluate, propose, accept, realize, or publish automatically.

---

## 11. Authority, Compatibility, and Historical Preservation

Preserve these distinctions:

```text
Goal ≠ Requested Time
Requested Time ≠ Capacity ownership
Proposal ≠ accepted authorization
Accepted authorization ≠ realized schedule
Scheduled duration ≠ Actual
Actual ≠ measured Progress
```

Ordinary editing must not modify existing acceptance, realization, publication, execution, or Progress records.

Preserve the Network+ regression:

```text
Accepted A: 10 hours
Accepted B: 20 hours
```

These remain distinct accepted iterations. An orientation total is not a new combined acceptance.

Retain productive/support/protection roles and unknown/protected evidence semantics.

No capability, compatibility reader, route, or invariant is authorized for retirement or removal.

Updating touched UI tests to follow the improved lawful workflow is permitted. Removing a test’s supported semantic assertion is not.

Preserve legacy measurement metadata, exact links, advanced planning data, immutable history, and supported backup behavior.

---

## 12. Explicit Non-Goals and Stop Conditions

Do not implement:

- New Goal lifecycle types or statuses.
- Pause, Resume, Cancel, Delete, or Continue semantics.
- Recurring/ongoing materialization.
- Policy settings, review cadence, shortfall, carry-forward, overdue, or suppression.
- Actual attribution or automatic Progress credit.
- Future-time release, schedule movement, or acceptance replacement.
- Found Time, Activity Tags, or the live loop.
- New Goal Structure authoring.
- A new Goal-scoped G2 scheduled-work inspector.
- Broad Summary, Review Schedule, or navigation redesign.
- Protected-history recovery.
- Persistence-format, schema, dependency, or bundle-threshold changes.
- Historical terminology replacement or compatibility cleanup.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a required bounded behavior lacks necessary canonical evidence.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when proceeding requires new authority, schema, persistence semantics, unsafe identity assumptions, or a consequential dependency.

Identify the precise missing contract and affected requirement. Preserve useful independent work, but do not declare the task complete with a mandatory requirement blocked.

Known future lifecycle gaps do not block this existing-only slice.

---

## 13. Required Automated Regressions

Add permanent tests for:

1. F1: Priority-only editing preserves preferred session minutes and absent maximum.
2. Optional-field variants: present/absent preferred and maximum remain distinct; intentional edits remain valid and explicit.
3. Goal title editing preserves description, measurement metadata, and exact unavailable links.
4. Advanced footprint selections and bounded Priority overrides survive unrelated edits.
5. Stale Goal and Demand writes preserve drafts and do not change accepted authority.
6. Partial multistep failure, persistence failure, and retry do not duplicate accepted work or authoring records.
7. Repeated Save while pending does not duplicate creation.
8. Goal/request switching rejects stale evaluation/read results and attributes late command outcomes correctly.
9. Navigation preserves draft, selection, search/filter/reveal, and return context.
10. Filtering out the selected Goal does not silently discard its draft.
11. A collection of at least 24 Goals supports bounded rendering, search, status filters, and deterministic ordering.
12. Undated/no-request Goal creation remains valid.
13. Existing explicit completion remains independent of measured Progress and does not acquire schedule-release behavior.
14. Browsing/filtering/navigation causes no domain or planning writes.
15. Relevant clear/restore/protected-state transitions cannot replay a draft into invalid authority.

Retain and run existing constructive-planning, Network+, role/provenance, Progress, realization, and Summary-return regressions.

Use the existing test toolchain. Add no dependency.

A regression must assert corrected behavior, not merely reproduce the audit’s proof that the defect exists.

---

## 14. Mobile Acceptance Gate

This is a first-class completion gate.

Use a production browser build with disposable storage at approximately:

```text
320px
390px
768px
1280px
```

Exercise the primary workflow, including:

- Create an undated Goal without Requested Time.
- Search/filter a 24-Goal collection.
- Open and edit a Goal.
- Edit Requested Time and Priority.
- Access advanced planning, links, Measurement, and Progress controls.
- Display validation and save-state explanations.
- Leave for Review Schedule and return.
- Switch Goal/request without unintended draft loss.

Require:

- No unintended document-level horizontal overflow.
- Practical approximately 44 CSS px primary action/hit targets.
- No required hover, double-click, or right-click.
- Usable reduced-height forms and keyboard-visible layout.
- Progressive disclosure without inaccessible hidden capabilities.
- Visible keyboard focus and logical tab order.
- Semantic controls, headings, and accessible names.
- Errors associated with relevant fields.
- Non-color-only state communication.
- Predictable Save/Cancel/Back focus.
- Zoom/reflow usability.
- Equivalent canonical values and command semantics across widths.

Inspect effective labeled hit regions for small native controls, not just their visual glyph.

Do not pass the overflow gate by clipping content or globally hiding horizontal overflow.

Record viewport/client/scroll-width measurements, relevant control measurements, keyboard observations, and representative screenshots.

Distinguish source inspection, browser observation, and automated evidence. CSS-zoom approximation is not browser-native or physical-device certification.

Physical-device and screen-reader certification are not required claims; do not make them unless performed.

If required browser inspection is unavailable or a mandatory mobile workflow fails, report PARTIAL/BLOCKED rather than COMPLETE.

---

## 15. Validation and Bundle Gate

Task 9.23 reported the following historical baseline:

| Measure | Reported value |
|---|---:|
| Test files / tests | 154 / 1,540 |
| Initial raw JavaScript | 621,318 bytes |
| Initial gzip JavaScript | 162,642 bytes |
| Largest lazy chunk | 62,652 bytes |
| Total JavaScript | 1,199,106 bytes |
| Initial-gzip hard-limit headroom | 7,358 bytes |

Measure the actual current before/after values.

Preserve existing lazy boundaries. App-owned presentation context must not eagerly import planning/history engines or heavy editors.

Do not raise hard limits:

- Initial gzip: 170,000 bytes.
- Initial raw: 685,000 bytes.
- Largest lazy chunk: 100,000 bytes.

Also satisfy the actual repository’s remaining hard gates.

Report existing headroom and total-JavaScript advisories honestly, including task-relative deltas. Do not call advisory output clean or silently launch unrelated bundle restructuring.

Run repository equivalents of:

```text
npx prettier --check .
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Run focused tests during implementation and the full suite before completion.

Format only task-touched files as necessary. Do not rewrite unrelated dirty source with a repository-wide formatting pass.

Record commands, working directories, test counts, failures, resolutions, fresh bundle measurements, and remaining headroom.

---

## 16. Required RESULT and Artifact Rules

The saved task is immutable execution input. Verify that it contains Sections 1–18 and the final statement before beginning.

Write a separate RESULT:

`docs/implementation/phase-9/PHASE_9_TASK_9_24_GOALS_FOCUSED_EDITING_REQUESTED_TIME_FIDELITY_V1_RESULT.md`

All additional output reports, logs, screenshots, and evidence artifacts must include `RESULT` in their filenames.

Normal application and test source filenames retain repository conventions.

The RESULT must include:

1. Executive outcome and exact bounded completion claim.
2. Governing inputs and task-relative baseline.
3. F1 root cause, correction, and permanent regression evidence.
4. Field-preservation matrix, including absent optional values.
5. Goal list/focused-editor behavior.
6. Draft identity, navigation, and focus behavior.
7. Stale, partial-save, persistence, and retry outcomes.
8. Async race and no-implicit-write evidence.
9. Capability/compatibility preservation statement.
10. Mobile/accessibility observations and limitations.
11. Commands and tests actually executed.
12. Before/after bundle metrics and advisories.
13. Every task-created/modified file and why it changed.
14. Confirmation of schema/dependency/history/dogfood effects.
15. Remaining gaps and final completion determination.

Do not rewrite Task 9.23 to imply the defects never existed.

---

## 17. Completion Criteria

This task is COMPLETE only when:

- F1 is corrected and permanently regression-protected.
- Untouched valid Goal/Requested Time data survives ordinary editing.
- Optional absence is not silently converted into an authored default.
- Search/status filters and bounded list behavior work with at least 24 Goals.
- One focused editing workflow remains ordinarily reachable.
- Navigation and switching do not accidentally discard drafts.
- Stale, partial-save, persistence, and retry paths are truthful and safe.
- Async outcomes remain associated with the correct Goal/request.
- Existing lifecycle, planning, Progress, and historical semantics remain unchanged.
- The full Mobile Acceptance Gate passes.
- Existing relevant regressions and repository hard gates pass.
- Fresh bundle measurements and advisories are recorded.
- Pre-existing work and forensic data remain protected.
- No schema/dependency change, retirement, or removal occurred.
- A separate RESULT supplies traceable evidence.

Passing tests alone does not establish mobile acceptance.

This task’s completion is not full Goal Lifecycle or full Goals product convergence.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.24 — Goals Focused Editing & Requested Time Fidelity V1 is COMPLETE.**

or:

**Task 9.24 — Goals Focused Editing & Requested Time Fidelity V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when users can find and edit existing Goals and Requested Time without unintended data changes, lost navigation context, misleading save outcomes, or mobile workflow failures—while preserving canonical authority, compatibility, and history.**