# Task 9.28 — Goal Recorded Progress & Activity Inspection V1

**Status:** READY — BOUNDED IMPLEMENTATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Read-Only Goal Evidence, Presentation, and Navigation Integration
**System:** DayFrame
**Prerequisite:** Task 9.27 — Goal Structure & Manual Milestone Authoring V1 — accepted COMPLETE through its authorized continuation
**Implementation Authority:** Existing canonical queries, bounded presentation reuse, and navigation
**New Reporting / Measurement / Lifecycle Authority:** NONE
**Architecture / Domain-Semantics Change Authority:** NONE
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**Capability / Code Retirement or Removal Authority:** NONE

---

## 1. Objective

Make existing recorded Progress and direct historical Goal Activity inspectable within the selected Goal experience.

Users must be able to:

- Read the recorded quantity and its measurement target where supported.
- Understand which observation and measurement definition produced that value.
- Distinguish missing, stopped, unsupported, protected, and known-zero evidence.
- Inspect historical linked-work categories and their separate coverage limitations.
- Open existing measurement/reporting controls or the relevant Daily Planner day.
- Return without accidentally losing inspection context or unrelated drafts.

Progress answers a measurement question.

Goal Activity answers a historical planned/reported-work question.

Neither is a complete Goal biography, lifecycle dashboard, or automatic judgment of accomplishment.

This task adds no domain writes to the new inspector. Explicit writes remain in existing canonical authoring/reporting workflows.

---

## 2. Checkpoint and Task Identity

The accepted checkpoint includes:

- 9.24: focused Goal/Requested Time editing and field fidelity.
- 9.25: Goal-scoped accepted-planning and scheduled-work inspection.
- 9.26: production V14 import repair and restore verification.
- 9.27.1: accepted Structure contract resolution.
- 9.27.2: canonical Structure owner repair.
- 9.27: completed Structure/manual-Milestone authoring continuation.

Preserve the original blocked 9.27 execution and all subsequent artifacts unchanged.

This task selects Recorded Progress and Activity as the next bounded product slice. It does not claim the 9.27 RESULT assigned it.

Confirm no conflicting executed Task 9.28 exists. The older hydration package’s projected Phase 9 acceptance audit is not an executed assignment.

Do not overwrite or silently renumber a conflict.

This task is grounded in reviewed documents, not a fresh repository inspection. The focused contract check below is mandatory before implementation.

---

## 3. Governing Inputs and Focused Contract Check

Read the current repository copies of:

1. Task 9.27 CONTINUATION_RESULT, not its READY continuation input.
2. Tasks 9.24–9.26 RESULTs and relevant navigation/restore tests.
3. Task 9.27.2 RESULT and its accepted owner-safety ADR.
4. Task 9.23 RESULT, especially independent Progress and Activity findings.
5. Task 5.7 — Goal Activity V1 Policy and Pure Projection RESULT.
6. Task 5.9 — Goal Activity V1 Summary Integration and Evidence Drill-Down RESULT.
7. Task 5.14 Progress implementation RESULT.
8. Task 5.17 — Progress Observation Reporting V1 UX and Goal-Scoped History Read Model RESULT.
9. Task 5.18 — Summary Progress V1 Integration and Provenance RESULT.
10. The Measurement Definition and Progress Observation identity/revision/time ADRs.
11. Applicable historical-metric, Goal-link provenance, G1/G2, and Goal identity contracts.
12. Product Ontology, relevant Appendix B entries, durable compatibility, and End-State Compatibility & Retirement specifications.

Inspect actual current query types, policies, consumers, subscriptions, protection states, and reporting destinations.

Record a concise map:

| Capability | Existing owner/query | Inputs and time semantics | Returned evidence | Protection | Product reuse |
|---|---|---|---|---|---|

Specifically verify:

- `queryGoalProgress` input/result and synchronous or asynchronous behavior.
- `getGoalActivity` input, supported source kinds, policy, and range convention.
- Definition epoch and observation selection rules.
- Available provenance and canonical day references.
- Existing observation-history query versus as-of Progress semantics.
- Current Goal absence/protection behavior.
- Existing reporting permissions and navigation/focus contracts.

Older RESULTs are evidence of their bounded implementation, not proof that every current interface is unchanged.

Do not repeat a general Goals audit or assume Summary component names guarantee complete reuse.

---

## 4. Baseline, Artifact Integrity, and Protection

Before implementation:

- Record HEAD, working-tree status, and applicable repository instructions.
- Capture a task-relative preservation baseline.
- Run current test/build/bundle baselines.
- Identify actual governing file versions and lazy boundaries.

The 9.27 continuation reported 224 starting status entries and 1,098 baseline files. Those are historical measurements, not expected current values.

Preserve unrelated dirty work, architecture, task inputs, historical RESULTs, diagnostics, and retained evidence.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable fixtures, databases, browser profiles, and origins.

Save this input separately from its eventual RESULT. Verify Sections 1–18 and the final completion statement before execution.

Never overwrite an input with a RESULT or replace a completed RESULT with these instructions.

---

## 5. Product Placement and Reuse

Add a progressively disclosed “Recorded Progress and Activity” section within selected Goal detail, with clearly separate Progress and Goal Activity subsections.

Reuse current equivalents of:

- `GoalProgressSummary.tsx`
- `GoalActivitySummary.tsx`
- `GoalMeasurementSection.tsx`
- `GoalProgressReportingSection.tsx`
- Existing Goal editing/inspection context.
- Existing historical query adapters and presentation helpers.

A focused lazy host and narrow extraction of reusable renderers are permitted.

Do not mount the entire Summary merely to obtain its selected-Goal display. Do not introduce a second Goal selector inside an already-selected Goal.

Do not duplicate projection arithmetic, observation selection, historical membership, or coverage rules in React.

Keep the existing Summary experience supported, including its selection, cutoff, range, provenance, and reporting handoffs.

Keep the G2 accepted-work inspector separately reachable and semantically unchanged.

Existing Measurement and Progress Reporting controls remain the command destinations. This task may add disclosure/focus/return wiring, not a competing editor.

---

## 6. Query Scope, Activity Period, and Cutoff

### Recorded Progress

Use the existing canonical Progress query with the exact selected Goal identity and `evaluationAsOf`.

The Activity range must not:

- Filter observations used for Progress.
- Become a measurement period.
- Supply the percentage denominator.
- Turn an absolute observation into a period increment.

### Goal Activity

Use the existing public Activity query and its declared policy.

The historical Activity contract uses inclusive User Day labels. G2 uses an exclusive end. Verify the current signatures and do not copy G2 range conversion into Activity blindly.

For first ordinary opening, default Activity to the calendar month containing the current canonical User Day.

Use existing current-day resolution, not a civil-date slice.

Retain the Goal’s previous applied period. Honor a valid explicit navigation period without modifying the originating surface’s context.

Bound this new UI to 1–366 inclusive days, subject to any stricter existing Activity-policy limit. Do not change that policy to accommodate the interface.

Invalid/reversed/oversized input retains feedback and the previous applied period. It causes no query or silent clamping.

### Shared logical refresh

Capture one real cutoff for a logical inspection refresh and pass it to both queries.

Display their different scopes:

- Progress: recorded measurement known as of the cutoff.
- Activity: linked historical work in the applied period, known as of that cutoff.

A shared cutoff is not a new atomic cross-authority snapshot guarantee.

Range changes do not modify Calendar, Requested Time, planning horizons, Review Scope authority, or publication.

---

## 7. Recorded Progress Semantics

Consume the canonical result and reuse existing deterministic formatting.

For supported Manual Quantity Progress:

- Show recorded quantity and target with the exact unit.
- Show the canonical percentage and neutral comparison where supplied.
- Preserve absolute-value semantics: observations are current totals, not increments to sum.
- Preserve zero, fractional values, and values above target.
- Do not clamp above 100%.
- Do not round a below-target value into an apparent 100%.
- Preserve exact canonical values in provenance/accessibility where display formatting shortens them.

Do not add a progress bar, trend, streak, pace, forecast, score, or success judgment.

Keep these states distinct:

- Available value, including recorded zero.
- No measurement configured.
- Measurement stopped.
- Current measurement with insufficient compatible evidence.
- Unsupported policy.
- Goal, definition, or observation initialization/protection.
- Query error or missing Goal.

Missing evidence receives no invented 0%.

Resolve stopped/current definition context through the existing canonical history/query path. Do not infer it from a generic no-definition result or a current-only field.

### Definition and observation fidelity

Preserve exact definition identity, revision/epoch, unit, target, observation identity/revision, observed time, and recorded time.

A target/unit revision or restart may require new compatible evidence. Do not carry an old value into a new epoch, convert units, or sum previous periods.

Current Goal title/status is current context. It is not necessarily the Goal state at the measurement cutoff.

An active Goal at 100% and a completed Goal below target are both valid independent facts.

---

## 8. Progress Provenance and Existing Reporting

Provide a bounded “How this Progress was calculated” disclosure using existing evidence.

Include supported details such as:

- Measurement method and exact target/unit.
- Selected recorded value.
- Observation time.
- Record/knowledge time.
- Evaluation cutoff.
- Measurement-period explanation.
- Exact percentage and available identity/revision details where useful.

Do not independently sort raw observations to choose a winner or reconstruct missing definition history.

The existing reporting history may describe current lineage heads rather than an as-of snapshot. Do not place that history under an earlier cutoff label without a supporting contract.

A complete observation timeline is not required here.

### Handoffs

Provide contextual navigation/disclosure-and-focus to existing:

- Measurement configuration.
- Record Current/New Value.
- Correction/retraction history and controls.

Do not create another reporting form, duplicate a submission, or change command semantics.

Current permissions remain authoritative. For example, an archived Goal’s inspection must not silently reactivate it to enable reporting.

Navigation itself performs no write.

After an explicit existing reporting command and return to inspection, capture a fresh cutoff and requery. Do not optimistically substitute the submitted value into Progress.

Preserve an open Measurement/Observation draft when entering inspection. Avoid unnecessary unmounting, or use narrowly scoped ephemeral presentation context without rebasing its captured definition/observation revision.

---

## 9. Goal Activity Semantics and Coverage

Use the current canonical Activity projection’s actual supported population.

Inspect and document source-kind coverage, including whether modern realized Goal work appears in this query or only through the existing G2 inspector.

Do not extend Activity’s policy, join in G2 rows, or claim an all-inclusive activity ledger.

Where coverage differs, explain the scope and provide navigation to accepted planning/scheduled work.

### Historical membership

Membership comes from frozen historical Goal identity, not:

- Current Commitment links.
- Current Goal title.
- Current containment/contribution.
- Shared source names.
- Current measurement configuration.

Preserve known linked, known unlinked, and legacy membership-unavailable evidence.

Do not retarget old records after rename, unlink, source recreation, or Structure editing.

### Distributions

Preserve canonical planning categories and reported-outcome categories, with their actual denominators.

Scheduled is not completed. Partial is not a fraction. Skipped is not a performance judgment.

Unknown/withdrawn and never-reported evidence remain distinguishable.

Do not calculate completion rates, infer minutes from occurrence duration, or award Progress from counts.

### Three independent coverage dimensions

Retain:

1. Plan-history coverage.
2. Goal-link provenance coverage.
3. Reporting coverage.

Do not combine them into a score or one misleading “complete” badge.

Known zero is permitted only for the projection’s declared population and proven coverage. It does not mean the user performed no work.

Missing publications, published-empty days, legacy-unavailable links, and protected execution have different meanings.

Valid frozen planning evidence may remain readable when execution is unavailable, exactly as the owner permits.

An occurrence linked to multiple Goals may appear in each Goal’s view. Do not sum those views into a unique global total or invent exclusive credit.

---

## 10. Bounded Evidence and Daily Planner Navigation

Start linked-row and coverage-detail lists at no more than 10 visible entries, with explicit incremental reveal.

Keep one active Activity category detail and one Progress provenance disclosure rather than an unbounded stack.

Retain canonical identity, ordering, policy/cutoff, publication context, and frozen names.

Presentation bounds are not storage-I/O or latency guarantees.

For an Activity row with a canonical User Day, open that exact day in the existing Daily Planner.

Do not derive the destination from browser-local timestamp slicing.

Use an existing exact action target only when supplied and supported. Otherwise open the day without fabricating occurrence focus or a reporting target.

Unplaced/omitted evidence must not acquire an outcome-reporting action merely because it has a date.

Explain that the destination is the current day inspection. A later publication or correction may differ from the retained Activity snapshot; do not force historical evidence into a current reporting command.

Back restores the originating Goal, applied period, category, disclosures, reveal count, drafts, and sensible focus, then obtains fresh inspection evidence.

Do not require historical evidence to contain fields its policy never supplied.

---

## 11. Freshness, Async Isolation, and Independent Failures

Opening, explicit Refresh, applied-period change, owner replacement, and return from an explicit reporting workflow establish a new logical refresh.

Use existing subscriptions to invalidate or requery at the retained cutoff.

A notification alone does not silently advance the knowledge cutoff. Evidence recorded afterward may require Refresh; explain this rather than displaying it under the old cutoff.

Do not add polling, per-render clock sampling, a universal event bus, or a durable cache.

If Progress remains synchronous, do not invent asynchronous Progress requirements. The host must still isolate owner/Goal/context replacement and asynchronous Activity results.

Request/render identity must include:

- Selected Goal.
- Activity period.
- Evaluation cutoff.
- Query owner/store.
- Request generation.
- Existing context/replacement boundary.

Late A successes or failures must not appear under B.

Do not display a previous period’s Activity beneath a new period heading.

Protection takes effect immediately even when an older available result exists. Never treat protected current authority as permission to keep showing cached evidence as current.

Keep failures independent:

- Activity failure does not erase valid Progress.
- Observation protection does not erase lawful Activity.
- Structure temporal qualification alone does not suppress independent Progress/Activity.
- Global recovery readiness and each query’s own protections still apply.

No new composite availability rule or historical reconstruction is authorized.

---

## 12. Context, Restore, and Compatibility Preservation

Reuse app-owned ephemeral context for inspection state.

Preserve unrelated:

- Goal metadata drafts.
- Requested Time drafts and accepted partial-save identities.
- Structure/Milestone drafts.
- Measurement/Observation drafts and captured revisions.
- G2 inspection period/disclosures.
- Summary selection, period, cutoff, and return context.

Do not force all sections to share a date range or disclosure state merely because they share a Goal.

Refresh and navigation never save or rebase drafts.

Apply existing restore/clear behavior:

- Rejected import preserves appropriate context.
- Begun-but-aborted transactions may invalidate operation tokens without discarding valid drafts.
- Successful whole-authority replacement invalidates displaced results and continuations.
- Recovery-required readiness remains protective.
- Full clear cannot be followed by resurrected query results.
- Setup profile loading retains its independent scope.

Requery after restored authorities are ready; do not cache previous measurement interpretation across replacement.

Preserve exact supported definitions, observations, execution records, publications, accepted iterations, and history.

No schema, format, reader, reporting capability, or existing Summary route is retired.

---

## 13. Permanent Automated Regressions

Add focused permanent coverage for:

1. Exact selected-Goal query inputs, one shared cutoff, correct inclusive Activity range, and no per-Goal-list-row query fan-out.
2. Invalid range retention without hidden query, clamp, or domain write.
3. Changing only Activity period leaves Progress unchanged at the same cutoff.
4. Recorded zero versus no observation; below/at/above target; exact decimal formatting without false 100%.
5. Absolute successive observations are not summed.
6. Definition revision, stop/restart, unit change, incompatible prior evidence, and exact provenance.
7. Backdated observation, correction, and retraction respect observedAt versus recordedAt at old and refreshed cutoffs.
8. Actual reporting and Milestone satisfaction do not create Progress; observation reporting does not change Activity/Goal lifecycle.
9. Activity planning/outcome categories and all three coverage dimensions.
10. Known zero, published-empty, missing plan, legacy membership, and protected execution distinctions.
11. Current rename/unlink/Structure change does not rewrite frozen membership; multi-Goal occurrence behavior remains scoped.
12. Canonical User Day navigation across midnight and return after a real existing outcome command.
13. Existing observation record/correct/retract workflow followed by fresh inspector evidence without duplicate commands.
14. Goal/range/owner changes with delayed Activity success/failure; synchronous Progress stays attached to the correct context.
15. Independent section failures and immediate protection.
16. Draft/selection/focus preservation through reporting, related navigation, Summary, and Daily Planner.
17. Actual rejected/successful V14 import, clear, profile independence, and displaced-query/continuation protection.
18. More than 10 valid linked rows proving bounded reveal; retained G2/Structure and 9.24–9.27.2 regressions.

Use canonical commands or validated fixtures for semantic proof.

Retain the distinct Network+ 10h/20h/unrealized-1h regression separately from Activity distributions.

Label synthetic presentation fixtures. They do not prove authority validity or storage performance.

Do not rewrite old RESULTs, diagnostic evidence, or semantic assertions to make the new UI pass.

---

## 14. Production Browser and Mobile Acceptance Gate

Use the production build and disposable state at:

```text
320px
390px
768px
1280px
```

At each width exercise:

- Select a Goal and open the new inspection.
- Read recorded quantity/target and provenance.
- Change the Activity period and inspect categories/coverage.
- Reveal bounded evidence.
- Open the existing reporting controls.
- Perform an explicit observation write and return/refresh.
- Open an Activity row’s canonical Daily Planner day and return.
- Preserve unrelated Goal/Requested Time and Structure drafts.

Across retained native evidence also demonstrate:

- A real existing outcome report changes Activity after refresh without changing measured Progress.
- A real observation correction or retraction changes Progress after refresh without changing Activity.
- Known-zero and no-value presentation.
- At least one protected/partial evidence case.
- Actual UI V14 export/import/reload preserves underlying authority and fresh inspection.
- Rejected import retains the appropriate drafts.

Supporting canonical seeding is allowed. It must not substitute for reporting/navigation/import actions being certified.

Precise cutoff and injected-failure proofs may remain automated; identify that boundary.

Require no unintended document overflow, practical approximately 44px primary targets, semantic controls, visible keyboard focus, logical tab order, associated errors, non-color-only states, reduced-height usability, progressive disclosure, predictable return focus, and reflow.

No required hover, double-click, right-click, or dragging.

Do not hide overflow to pass.

Report native-browser observations, simulation, source inspection, and DOM measurements separately. Do not claim physical-device, soft-keyboard, OS-dialog, screen-reader, or browser-native-zoom certification without performing it.

A missing mandatory browser/mobile workflow prevents COMPLETE.

---

## 15. Validation and Bundle Gate

Task 9.27 continuation reported:

| Measure | Historical value |
|---|---:|
| Test files / tests | 162 / 1,653 |
| Initial raw JavaScript | 626,034 bytes |
| Initial gzip JavaScript | 163,993 bytes |
| Largest lazy chunk | 62,657 bytes |
| Total JavaScript | 1,258,699 bytes |
| Initial-gzip headroom | 6,007 bytes |

Measure actual current before/after values.

Preserve hard limits:

- Initial gzip ≤170,000 bytes.
- Initial raw ≤685,000 bytes.
- Largest lazy chunk ≤100,000 bytes.
- All remaining repository hard gates.

Keep Progress/Activity readers and heavy detail lazy. Do not eagerly import historical engines through context or navigation.

Do not raise thresholds, add dependencies, or launch unrelated bundle restructuring.

Report existing initial-gzip and total-JavaScript advisories and task deltas honestly.

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

A documented worker bound for the complete suite is permitted. Record commands, selected suite, intermediate failures, and resolutions.

Do not weaken assertions, existing timeouts, or configuration. Format task-touched files only as necessary.

---

## 16. Non-Goals and Stop Conditions

Do not implement:

- New measurement policy, unit conversion, observation semantics, or reporting authority.
- New Activity source kinds, coverage policy, attribution, or aggregate evidence owner.
- A unified G2/Activity/Progress timeline or combined total.
- Historical Progress controls or reconstructed historical Goal state.
- Progress bars, trends, pace, forecasts, streaks, scores, or recommendations.
- Automatic completion, Milestone satisfaction, or Actual-to-Progress credit.
- Parent/child or contribution roll-ups.
- New Goal lifecycle, recurrence, release, replacement, or Found Time.
- Protected-history recovery, destructive abandonment, or data correction.
- Persistent drafts, schema/format/migration/dependency changes.
- Capability/code retirement or removal.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a mandatory bounded view needs evidence unavailable through existing canonical contracts.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when proceeding requires new semantics, ownership, incompatible data interpretation, unsafe command behavior, or weakened protection.

Identify the precise missing datum/contract and affected requirement.

Do not demand all-source Activity coverage as an implicit requirement: the declared existing population plus the separate G2 destination is intentional.

Do not conceal a genuine mandatory gap or recreate its missing authority in presentation code.

---

## 17. RESULT, Retained Evidence, and Completion Criteria

Write a separate execution RESULT:

`docs/implementation/phase-9/TASK_9.28_GOAL_RECORDED_PROGRESS_AND_ACTIVITY_INSPECTION_V1_RESULT.md`

Keep this input and all earlier artifacts immutable.

Retain evidence under:

`docs/implementation/phase-9/evidence/task-9.28/`

or the established equivalent.

Additional reports, screenshots, measurements, exports, and QA artifacts must include `RESULT` in filenames. Application/test source retains repository naming conventions.

The RESULT must contain:

1. Bounded outcome and current command/query map.
2. Governing sources and task-relative baseline.
3. Actual Activity population, policy, range, and limitations.
4. Progress definition/observation/cutoff semantics.
5. Presentation reuse and preserved Summary/G2 behavior.
6. Coverage, protection, provenance, and no-inference evidence.
7. Reporting/navigation, draft, refresh, and race results.
8. Restore/clear/profile behavior.
9. Permanent tests and native/mobile observations.
10. Before/after bundle metrics and advisories.
11. Every created/modified file and purpose.
12. Persistence/schema/dependency/history/compatibility effects.
13. Remaining exclusions and final determination.

Retain reproduction commands, fixture provenance, canonical comparisons, viewport/focus measurements, representative narrow-screen evidence, reporting round trips, import/reload observations, and material validation logs.

Compare underlying authorities exactly except explicitly documented nonsemantic ordering/export metadata. Fresh cutoffs legitimately differ; do not disguise derived results as byte-identical durable authority.

Distinguish local retention from commits or remote backups. Do not rely exclusively on `/tmp`.

After writing, read back the actual RESULT and verify its heading, outcome, and path. Return that report—not the READY task input or baseline report.

COMPLETE requires the bounded inspector, all mandatory semantic/navigation/protection tests, native/mobile workflows, unchanged hard gates, and retained evidence.

Completion is not full Goals convergence or implementation of the newer Goal Lifecycle.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.28 — Goal Recorded Progress & Activity Inspection V1 is COMPLETE.**

or:

**Task 9.28 — Goal Recorded Progress & Activity Inspection V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when users can inspect independently recorded Goal Progress and scoped historical Goal Activity, understand their evidence and limitations, and visit existing reporting workflows and return without lost context, invented calculations, or changes to canonical authority.**