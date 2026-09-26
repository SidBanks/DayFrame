# Task 9.25 — Goal Accepted Planning & Scheduled Work Inspection V1

**Status:** READY — BOUNDED IMPLEMENTATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Read-Only Product Evidence and Navigation Integration
**System:** DayFrame
**Prerequisite:** Task 9.24 — Goals Focused Editing & Requested Time Fidelity V1 — accepted COMPLETE
**Implementation Authority:** Goal-scoped presentation, existing canonical queries, and navigation
**Domain / Scheduling / Lifecycle Change Authority:** NONE
**Persistence-Format / Schema / Dependency Change Authority:** NONE
**Retirement / Removal Authority:** NONE

---

## 1. Objective

Let a user open a Goal and inspect its accepted planning and resulting scheduled work without leaving the Goal context merely to find that evidence.

The user must be able to distinguish:

- What was accepted.
- What has actually been added to the Schedule.
- What remains accepted but not yet scheduled.
- What publication and reported-outcome evidence is available.
- What is unknown, protected, incomplete, or outside the selected period.

Provide navigation to the relevant Daily Planner day and back without losing Goal selection, editing drafts, or inspection context.

This is a bounded view of work represented by the existing accepted-planning evidence query. It is not a complete Goal biography or a complete inventory of every Commitment, Event, or historical activity linked to the Goal.

Do not implement another planning engine, evidence owner, reporting surface, or lifecycle.

---

## 2. Checkpoint and Task Identity

Accepted checkpoints:

- Task 9.21 — Accepted-Planning Summary Convergence V1 — COMPLETE.
- Task 9.22 — My Schedule Convergence V1 — COMPLETE.
- Task 9.23 — Goals Lifecycle & Product Convergence Readiness Audit V1 — COMPLETE, audit only.
- Task 9.24 — Goals Focused Editing & Requested Time Fidelity V1 — COMPLETE.

Task 9.23 established that current G2 evidence supports bounded Goal-scoped inspection of existing accepted work. This task selects that implementation slice after 9.24.

Before execution, confirm that no conflicting Task 9.25 assignment exists. An older projected roadmap entry is not an executed assignment.

Do not overwrite or silently renumber a conflicting task.

Verify that the saved immutable execution input contains Sections 1–18 and the final completion statement.

---

## 3. Governing Inputs

Read the actual repository copies of:

1. Task 9.24 RESULT and its focused-editing/navigation tests.
2. Task 9.23 RESULT, especially its G2/G1, freshness, history, and evidence-gap findings.
3. Task 9.21 RESULT and its Summary consumer, presentation helpers, context, and navigation tests.
4. Task 9.19 RESULT and `ADR_CANONICAL_PRODUCT_EVIDENCE_PROJECTIONS.md`.
5. Relevant Task 9.20 Daily Planner implementation and navigation contracts.
6. Product Ontology & Vocabulary Specification V1 and governing Appendix B entries.
7. End-State Compatibility & Retirement Architecture Specification V1.
8. Relevant durable-data compatibility and historical-protection contracts.

Consult the Goal Lifecycle specification only to preserve the boundary between current capabilities and future accepted design.

Inspect the current public query types and owners. Do not infer executable API shapes from this task’s prose.

Current code/tests establish executable behavior; accepted architecture establishes normative semantics; RESULTs establish prior bounded evidence.

Do not repeat the general Goals audit.

---

## 4. Repository Baseline and Protection

Before implementation:

- Record HEAD and exact working-tree status.
- Inspect applicable repository instructions.
- Capture a task-relative baseline that distinguishes this task from pre-existing dirty work.
- Run and record current test/build/bundle baselines.
- Record the governing files actually used.

Task 9.24 began with 185 status entries. That is historical information, not the expected current count.

Preserve unrelated work, task inputs, historical RESULTs, architecture documents, and forensic artifacts.

Do not reset, stash, commit, push, or perform unrelated cleanup.

Do not open, initialize, clear, migrate, repair, or normalize the preserved Dogfood Pass 02 state.

Use disposable browser profiles, origins, databases, and test fixtures.

Fixture setup may invoke existing canonical commands. Inspection itself must not create or modify domain authority.

---

## 5. Implementation Scope and Reuse

Add a focused, progressively disclosed accepted-planning/scheduled-work section within the selected Goal detail.

Start with the current equivalents of:

- `GoalSection.tsx`
- `DayFrameApp.tsx`
- `goalEditingContext.ts`
- `useGoalEditingState.ts`
- `AcceptedPlanningSummary.tsx`
- `acceptedPlanningSummaryPresentation.ts`
- `acceptedPlanningSummaryContext.ts`
- `plannerNavigation.ts`
- `dayFrameUi.css`
- Relevant Goal, Summary, and navigation tests.

Reuse the existing public G2 query adapter.

Reuse or narrowly extract presentation components/helpers where appropriate. A small Goal-scoped wrapper is permitted.

Do not duplicate lineage reconstruction, create an alternative query owner, or undertake a broad shared-component rewrite.

Keep the Summary inspector and its existing capabilities intact.

Keep heavy editors, query adapters, and evidence readers behind appropriate lazy boundaries. App-owned presentation context must not eagerly import planning/history engines.

---

## 6. Canonical Query and Range Contract

Use `queryAcceptedPlanningEvidence(...)` with:

- The selected canonical Goal identity through the actual existing Goal selector type.
- `startUserDayDate`.
- `endUserDayDateExclusive`.
- A real evaluation instant, `asOf`.

The supported range is 1–366 days under the existing half-open owner-label contract.

### Presentation range

For an ordinary first opening, use the calendar month containing the current canonical User Day, resolved through the existing application path.

This is a read-only display default, not a planning horizon or materialization instruction.

Restore a previously selected range for that Goal. Honor an explicitly supplied valid navigation range without overwriting the originating surface’s context.

Display the inspected period clearly. Permit explicit bounded period changes.

If controls display an inclusive end date, convert it through existing date-label utilities to the required exclusive end.

Do not silently clamp invalid ranges or reinterpret them as another period.

Do not use civil-date slicing as a substitute for canonical current-day resolution.

### Query boundaries

Inspect only the selected Goal when its section is opened; do not issue one query for every Goal list row.

Filters, disclosure, and incremental reveal should operate on returned evidence rather than triggering redundant queries.

Never change Requested Time, Calendar selection, Proposal Horizon, Planning Data Horizon, Review Scope authority, or Publication Range merely because this inspection range changes.

The range bounds evidence selection. Do not claim that it bounds every underlying storage scan.

---

## 7. Evidence and Historical Semantics

Consume the public projection rather than joining raw Goal, Proposal, acceptance, realization, publication, or execution collections in React.

Preserve exact available lineage:

```text
Goal
→ Requested Time
→ Proposal / decision
→ accepted iteration
→ realization
→ scheduled fact
→ publication
→ reported outcome
```

Keep accepted iterations independently inspectable using their canonical identities and revisions.

Do not infer revocation or supersession from:

- A later request.
- A later acceptance.
- Proposal lifecycle.
- Goal completion/archive.
- Shared Goal identity.

Preserve:

- Current Goal context as current context.
- Frozen publication context as historical evidence.
- Exact available Demand and decision references.
- Unresolved or legacy lineage.
- Source coverage and completeness.
- Current scheduled facts versus retained publication.
- Effective reported outcomes, corrections, and withdrawals as supplied.

Do not display a current Goal name or configuration as though it were necessarily the historical decision-time value.

Do not reconstruct a missing current Goal from historical records or discard readable historical evidence merely because current context is unavailable.

If a desired detail is not supplied, disclose that limit or navigate to its lawful existing destination. Do not invent it.

---

## 8. Product Presentation and Bounded Detail

Use current product vocabulary while preserving architectural distinctions.

A section heading such as “Accepted planning and scheduled work” is appropriate. Explain that it shows work from accepted planning for the selected period.

Do not automatically rename every implementation Accepted Allocation as a complete Accepted Schedule without the governing semantic mapping.

Separate these states:

- Added to the Schedule.
- Accepted but not yet added to the Schedule.
- Scheduling evidence unavailable or unknown.

The second label requires positive `acceptedButUnrealized` evidence. Unknown/protected realization must not receive it.

Provide bounded disclosure:

1. Period and evidence coverage.
2. Individual accepted iterations.
3. Scheduled facts and role-specific detail.
4. Publication and reported-outcome context.

Show no more than 10 iteration rows initially, with explicit incremental reveal. Bound expanded fact and publication lists as well; reuse existing Summary limits/pagination where suitable.

Use stable identity-based keys and deterministic ordering. Prefer chronological scheduled-work ordering with stable tie-breaking; do not substitute ordering for authoritative identity.

### Durations and roles

Keep distinct:

- Accepted productive quantity.
- Scheduled productive time.
- Support activity.
- Protected time.
- Reported Actual.
- Measured Progress.

Label totals with their scope and coverage. Partial evidence means readable records, not a complete total.

Do not combine whole-acceptance quantities and in-range scheduled quantities into a misleading ratio.

Support retains its name and role. Protected time is not an activity and has no activity-completion control.

Cross-midnight work must retain its canonical User Day and unambiguous endpoint dates/times.

---

## 9. Empty, Protected, and Failure States

Reuse the established G2 distinctions rather than reducing them to an empty list.

Required behavior:

- Complete evidence with `notFoundInRange`: explain that no accepted planning was found in this period.
- Incomplete evidence: show readable records with qualified coverage.
- Protected/unavailable accepted authority: preserve readable scheduled references without reconstructing unavailable acceptances.
- Unknown realization: explain uncertainty rather than claiming scheduling has not happened.
- Legacy lineage unavailable: preserve the limitation.
- Missing outcome: “Outcome not recorded,” not skipped or failed.
- Invalid query: retain understandable range feedback.
- Query failure: show an actionable error/Refresh path, not a complete-empty state.

No-records-in-range does not mean the Goal has never received time, has no work elsewhere, or is complete.

Do not add recovery, abandonment, reset, or destructive data actions to make evidence appear available.

---

## 10. Freshness, Async Safety, and Refresh

Capture one real `asOf` per query.

Track request identity using the selected Goal, applied range, query generation, and relevant existing context/authority boundary.

A late success or failure for Goal A must never replace Goal B’s view. Apply equivalent protection to range changes, query-owner replacement, unmount, clear, and restore.

Do not show an old result under a new Goal/range heading.

Refresh on:

- First opening.
- An applied Goal/range change.
- Explicit Refresh.
- Relevant query-owner replacement.
- Returning/remounting after downstream navigation.

Inspect existing subscriptions or invalidation signals. Use them where supported to refresh or mark evidence stale.

There is no assumption of a universal live G2 subscription. Where complete automatic invalidation is unavailable, present an explicitly as-of snapshot and Refresh action rather than promising live synchronization.

Do not add timers, polling, a new event bus, or a new durable cache.

Refresh must not rebase or erase editing drafts, accept proposals, schedule work, publish, or infer completion.

---

## 11. Navigation and Task 9.24 Preservation

A scheduled fact opens the existing Daily Planner using its canonical `userDayDate`, not a date derived from its start timestamp.

Use existing navigation/action-target contracts. If fact-specific focus is supported, preserve its exact identity; otherwise open the correct day without fabricating a reporting target.

Outcome entry remains on the existing destination with its existing authority gates.

Provide navigation-only access to Review Schedule when appropriate. Do not add inline Accept, Realize, Publish, Move, Cancel, or outcome-reporting commands.

On return, restore:

- Selected Goal/request.
- Goal list search, filter, and reveal state.
- Unsaved Goal/Requested Time drafts and original base revisions.
- Inspection range and open iteration/fact identities.
- Sensible focus at the initiating control or section.

Refresh evidence on return without silently saving or rebasing drafts.

Keep Summary’s range/filter/disclosure context independent.

Preserve existing Summary → Goal/Day → Back behavior and define predictable return behavior when Goal inspection is an intermediate destination.

An inspection uses saved canonical authority, not speculative values from an unsaved editing form.

Respect Task 9.24’s clear/restore/protection boundaries and profile independence.

No restart-surviving context is required.

---

## 12. Progress, Compatibility, and Non-Goals

G2’s `progress: notInferred` remains exactly that.

Retain existing Measurement, Progress reporting, Goal Activity, and Summary access. Do not derive a new completion percentage, pace, adherence metric, or Goal status from this inspector.

This task does not implement:

- Goal Structure authoring.
- New Goal types/statuses or lifecycle actions.
- Recurrence, materialization, shortfall, carry-forward, overdue, suppression, or review policies.
- Acceptance replacement or future-time release.
- Found Time, Activity Tags, or the live loop.
- New reporting commands or attribution.
- New query semantics, evidence ownership, schema, storage, backup, or dependencies.
- Broad Summary/Review redesign.
- Protected-history recovery.
- Compatibility retirement/removal.

Task 9.24’s F1, optional-field, retry, draft, and mobile protections remain mandatory regressions.

No supported route, reader, historical record, or architectural invariant may be removed.

---

## 13. Required Automated Evidence

Add permanent focused coverage for:

1. Exact Goal-scoped G2 input, valid range conversion, fresh `asOf`, and no per-row query fan-out.
2. Invalid/oversized ranges without silent reinterpretation.
3. The Network+ accepted-iteration regression:
   - A: 600 minutes / 10 hours, realized.
   - B: 1,200 minutes / 20 hours, realized.
   - C: 60 minutes / 1 hour, accepted but unrealized.
   - No synthetic combined acceptance or calendar reservation for C.
4. Role separation and correctly qualified duration totals.
5. Current renamed Goal versus retained publication title.
6. Reported, missing, corrected, withdrawn, protected, and unavailable outcome evidence without Progress inference.
7. Complete-empty versus partial/protected/unknown evidence.
8. Out-of-order Goal/range successes and failures; clear/restore/query-owner invalidation.
9. Goal → scheduled fact → correct Daily Planner User Day → Back, including cross-midnight ownership.
10. Return refresh after an explicit existing destination command, while preserving unrelated unsaved Goal/request drafts.
11. Independent Summary and Goal inspection context.
12. Bounded iteration/fact/publication rendering and retained disclosures.
13. No domain/planning/publication/reporting writes caused by browsing, range changes, reveal, Refresh, or navigation.

Use validated canonical fixtures/builders for semantic proof.

A larger synthetic projection fixture may test presentation density, including approximately 60 iterations and 360 facts. Identify it as synthetic; it is not proof of valid persisted planning authority or storage performance.

Retain the complete Task 9.24 suite and existing Summary, constructive-planning, realization, provenance, Progress, and navigation assertions.

---

## 14. Mobile Acceptance Gate

Validate the production build with disposable state at approximately:

```text
320px
390px
768px
1280px
```

Exercise:

- Finding/selecting a Goal.
- Opening accepted-planning inspection.
- Changing the period.
- Inspecting distinct iterations, roles, and publication/outcome detail.
- Revealing additional rows.
- Opening the correct Daily Planner day and returning.
- Preserving an unsaved authoring draft through the round trip.
- Empty, invalid, partial/protected, and failed-query presentation.

Require:

- No unintended document-level horizontal overflow.
- Practical approximately 44 CSS px primary action/hit targets.
- No required hover, double-click, or right-click.
- Usable reduced-height forms and controls.
- Progressive disclosure for dense evidence.
- Visible keyboard focus and logical tab order.
- Semantic controls/headings and meaningful names.
- Associated validation/error text.
- Non-color-only states.
- Predictable navigation/focus restoration.
- Reflow/zoom checks.
- Equivalent underlying evidence and navigation identity across widths.

Do not pass overflow by clipping or globally hiding content.

Use canonical disposable data for the principal workflow. Clearly label any simulated query responses used for defensive presentation cases.

Distinguish browser observation, source inspection, automated tests, and synthetic fixtures.

Do not claim physical-device, soft-keyboard, screen-reader, or browser-native-zoom certification unless actually performed.

An unavailable required browser check or failed mandatory workflow means PARTIAL/BLOCKED, not COMPLETE.

---

## 15. Validation and Bundle Gate

Task 9.24 reported:

| Measure | Historical value |
|---|---:|
| Test files / tests | 155 / 1,560 |
| Initial raw JavaScript | 621,885 bytes |
| Initial gzip JavaScript | 162,932 bytes |
| Largest lazy chunk | 62,652 bytes |
| Total JavaScript | 1,209,743 bytes |
| Initial-gzip hard-limit headroom | 7,068 bytes |

Measure actual current before/after values.

Preserve hard limits:

- Initial gzip: 170,000 bytes.
- Initial raw: 685,000 bytes.
- Largest lazy chunk: 100,000 bytes.
- All remaining current repository hard gates.

Do not raise thresholds or add dependencies.

Report existing advisories and task deltas honestly. Preserve lazy boundaries; do not eagerly import G2 readers/history engines into navigation or context initialization.

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

Run focused suites during development and the full suite before completion.

Format task-touched files only as necessary. Record commands, working directories, counts, failures, resolutions, metrics, and remaining headroom.

---

## 16. RESULT and Retained Evidence

Write a separate RESULT:

`docs/implementation/phase-9/TASK_9.25_GOAL_ACCEPTED_PLANNING_AND_SCHEDULED_WORK_INSPECTION_V1_RESULT.md`

Do not modify the execution input or previous RESULTs.

Every additional output report, measurement file, screenshot, or evidence artifact must include `RESULT` in its filename. Application/test source files retain normal repository naming.

The RESULT must include:

1. Bounded executive outcome.
2. Governing inputs and task-relative baseline.
3. Exact query contract and reuse decisions.
4. Range, totals, role, and coverage semantics.
5. Network+ and historical-provenance evidence.
6. Navigation, draft preservation, freshness, and async results.
7. Protected/empty/failure behavior.
8. Tests and production-browser observations.
9. Before/after bundle metrics and advisories.
10. Every task-created/modified file and reason.
11. Schema, persistence, dependency, compatibility, and forensic-state effects.
12. Remaining limitations and final determination.

### Retained evidence

Retain a compact evidence set beside the Phase 9 results, using the repository’s established evidence location or a clearly named task-specific subdirectory.

Include:

- Machine-readable viewport/overflow/focus measurements.
- At least a narrow-phone inspection screenshot and a navigation/return screenshot.
- Fixture provenance and reproduction commands.
- The material validation and bundle measurements.

Large temporary logs and baseline copies may remain disposable. Do not rely exclusively on `/tmp` links for the supporting evidence designated as retained.

Record exactly what exists durably and what remains local-session-only. Do not fabricate or recreate unavailable Task 9.24 artifacts as original evidence.

---

## 17. Stop Conditions and Completion Criteria

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a mandatory bounded view requires evidence the public contracts do not supply.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when implementation would require new authority, query semantics, persistence/schema changes, unsafe identity assumptions, weakened protection, or a consequential dependency.

Identify the precise missing contract and affected requirement. Do not reopen settled future lifecycle design merely because it remains unimplemented.

This task is COMPLETE only when:

- Selected Goals have a reachable, bounded canonical G2 inspector.
- Accepted iterations, scheduled facts, publication, and outcomes remain distinct.
- Scope, role, completeness, and unknown/protected states are truthful.
- Canonical User Day navigation and return work.
- Task 9.24 editing/draft/retry protections remain intact.
- Refresh and async behavior cannot show one Goal/range’s evidence under another.
- Inspection introduces no domain writes or Progress inference.
- Summary and compatibility capabilities remain supported.
- Permanent regressions and the Mobile Acceptance Gate pass.
- Repository and bundle hard gates pass.
- Task-relative changes and retained evidence are documented.
- No mandatory requirement remains blocked.

Passing tests alone does not establish mobile acceptance.

Completion is not full Goals convergence or implementation of the newer Goal Lifecycle.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.25 — Goal Accepted Planning & Scheduled Work Inspection V1 is COMPLETE.**

or:

**Task 9.25 — Goal Accepted Planning & Scheduled Work Inspection V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when users can inspect a Goal’s accepted planning, resulting scheduled work, and available reported outcomes—and open the relevant day and return—without losing editing context, inventing evidence, or changing canonical authority.**