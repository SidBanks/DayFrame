# Task 9.29 — Planner / Review Schedule Workflow Convergence V1

**Status:** READY — BOUNDED IMPLEMENTATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Planner Workflow, Existing Decision/Publication Orchestration, and Mobile Product Convergence
**System:** DayFrame
**Prerequisite:** Task 9.28 — Goal Recorded Progress & Activity Inspection V1 — accepted COMPLETE
**Implementation Authority:** Existing canonical queries, commands, presentation, and contextual navigation
**Architecture / Domain-Semantics Change Authority:** NONE
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**Capability Retirement / Legacy Implementation Removal Authority:** NONE

---

## 1. Objective

Converge the existing Review Schedule workflow within Planner.

Users must be able to understand:

- Which period they are reviewing.
- What evidence is current, incomplete, unavailable, or provisional.
- Which proposed work awaits an explicit decision.
- Which accepted work has actually been scheduled.
- Which conflicts need correction.
- What the explicit Build this Schedule action will record.
- What succeeded, failed, or remains uncertain after a command.

Compose these capabilities into one bounded contextual workflow rather than a stack of expanded legacy panels.

This task changes product presentation and orchestration of existing commands. It creates no new schedule, review, acceptance, reporting, or recovery authority.

---

## 2. Two-Primary-Destination Boundary and Task Identity

The primary destinations remain:

```text
Planner
Summary
```

Review Schedule is subordinate to Planner, alongside Calendar, Schedule Setup, and Goals.

A contextual Review page may occupy the screen without becoming a third primary destination.

Do not:

- Add Review, Preview, or Publication as another primary tab.
- Mount every Planner destination below Calendar.
- Turn Summary into a second operational Planner.
- Create a durable Reviewed/Approved flag.
- Preserve the old Review/Preview layout merely because its commands remain useful.

This task does not authorize retirement or removal of a legacy capability or module.

Confirm no conflicting executed Task 9.29 exists. Earlier projected roadmap numbering does not override actual assignments.

Preserve Task 9.27’s original blocked history, subsequent repairs, accepted continuation, and Task 9.28 RESULT unchanged.

---

## 3. Governing Inputs and Current Capability Preflight

Read actual repository copies of:

1. Task 9.28 RESULT.
2. Task 9.17 — Planner / Summary Product Convergence & Mobile UX Specification RESULT, especially §§44–52 and its capability ledger.
3. Task 9.18 — Planner / Summary Navigation Foundation RESULT.
4. Product Ontology & Vocabulary Specification V1, especially Review Schedule, Build this Schedule, Preview, and canonical navigation.
5. Task 9.4 scope/planning-review, Task 9.6 Review Schedule, and Task 9.7 explicit-publication RESULTs.
6. Task 9.9 correctness RESULT, especially shared publication blockers, commit certainty, and corrective identity/occupancy.
7. Relevant first-class Sleep correction/publication contracts and RESULTs.
8. G1/G2 evidence contracts and Tasks 9.20, 9.21, and 9.25.
9. Tasks 9.24, 9.26, 9.27.2, and 9.27 continuation safeguards.
10. Durable compatibility, cross-storage restore, End-State Compatibility & Retirement, and governing Appendix B definitions.

Inspect the current equivalents of:

- `queryPlanningReview`
- `deriveScheduleReviewReadiness`
- `publicationBlockers`
- `publishScheduleRangeV1`
- `ScheduleReviewPanel`
- `PlanningReviewPanel`
- `PreviewScreen` and its correction/detail components
- Existing Proposal decision and realization orchestration
- SuggestedFix/Try/PlanDecision commands
- Planner navigation, range controls, and publication feedback

Record a focused matrix before implementation:

| Capability | Current entry | Read source | Exact command/target | Allowed effects | Failure/retry contract | Proposed presentation |
|---|---|---|---|---|---|---|

Distinguish current executable contracts from older RESULT descriptions and target design.

In particular, verify current realization-retry support rather than assuming either that the early deferral still holds or that a retry button is now safe.

This is an implementation preflight, not another general architecture audit. Do not invent missing authority in React.

---

## 4. Baseline, Artifact Integrity, and Forensic Protection

Before application changes:

- Record HEAD and working-tree status.
- Inspect applicable repository instructions.
- Capture a task-relative preservation baseline.
- Measure current tests and production bundle.
- Identify governing source versions and existing lazy boundaries.

Treat the dirty working tree—not merely HEAD—as the execution baseline.

Preserve unrelated work, historical artifacts, task inputs, diagnostics, and retained evidence.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable browser profiles, origins, databases, and fixtures.

Save this input separately from its eventual RESULT and verify Sections 1–18 plus the final completion statement.

Do not overwrite an input with a RESULT or a completed RESULT with instructions.

---

## 5. Workflow Composition and Capability Preservation

Within Planner / Review Schedule, present:

1. Reviewed period and current readiness.
2. Available constructive options.
3. Accepted work and scheduling status.
4. Conflicts, provisional corrections, and accepted corrections.
5. Publication review and Build this Schedule.

Use progressive disclosure, contextual sections, and bounded lists.

Do not require the user to traverse a full date-by-date schedule tower before reaching a relevant decision.

Reuse existing components or narrowly extract presentation where useful. A focused lazy host and lightweight context helper are permitted.

Do not copy scheduling, readiness, materialization, or lineage logic into a new component.

### Capability ledger

Account for every still-valid capability in the current Review/Preview path, including:

- Generation and range controls.
- Scheduled detail and visualization.
- Proposal decisions.
- Accepted-work inspection.
- Conflict explanation.
- Try and explicit corrective acceptance.
- Accepted-correction inspection, removal, and durability retry where supported.
- Contextual Event/Commitment/Work/Sleep editing.
- Publication and its failure/protection feedback.
- Existing informational annotations and technical detail.

For each, record whether it is reused, recomposed, reached through a verified contextual handoff, or retained in a bounded existing detail path.

No still-valid capability may disappear behind an unimplemented handoff.

Reducing simultaneous presentation is authorized. Formal retirement, deleting legacy modules, or removing supported compatibility behavior is not.

Do not recreate architecturally invalid historical behavior merely for visual parity.

---

## 6. Review Period and Range Fidelity

Use the existing typed Review Scope and range adapters.

Preserve the distinction between:

- Calendar navigation.
- Review Scope.
- Planning Data Horizon.
- Proposal Horizon.
- Generated schedule/Preview coverage.
- Prospective Publication Range.

Equal dates do not make these the same authority.

### Entry behavior

Ordinary entry restores the current review context.

An explicit “Review this period” handoff may pass a period through the existing scope contract. Display any resulting scope change clearly.

Do not silently replace the review period whenever Calendar selection changes.

For first/direct entry, retain the existing deterministic scope precedence established by current code and document it. Do not invent a current-month default if the existing workflow uses configured generation bounds.

### Controls

Expose the existing supported review/generation period controls in a compact, understandable location.

Show inclusive human endpoints while using each API’s actual inclusive/exclusive contract.

Use canonical date-label helpers and existing validation limits. Do not assume G2’s range bound or Activity’s inclusive end applies to publication.

Keep invalid range drafts and associated errors without silently clamping, querying a different period, or changing unrelated authority.

A one-day visualization filter does not narrow the publication range.

Before Build, show the exact prospective publication period independently of any local list/date filter.

---

## 7. Canonical Readiness and Evidence

Reuse the planning-review read model and shared readiness/publication policies.

Presentation may group and translate returned reasons. It must not implement a second blocker policy.

Preserve distinctions among:

- Planning coverage complete, partial, missing, or unknown.
- Generated schedule missing, stale, range-mismatched, or current.
- Generated versus Try-revised materialization.
- Actionable Proposal attention.
- Accepted-but-unrealized work.
- Realization evidence unavailable.
- Actual unresolved Friction.
- Historical access available, protected, or unverified.
- Historical coverage, including healthy no-prior-publication.
- Materializer eligibility.
- First-class Sleep’s distinct foundation states.

Do not call every problem “No time” or “Schedule conflict.”

Pending constructive offers are not automatically publication blockers. A healthy history store with no prior publication is not protected history.

Show Ready to build only when the current canonical publication result supports it. Do not briefly flash Ready during initialization, refresh, or source invalidation.

Keep review readiness distinct from publication readiness where the contracts distinguish them.

Readiness is not a guarantee against later source changes or storage failure.

Queries and disclosure perform no acceptance, realization, publication, or reporting writes.

---

## 8. Constructive Decisions and Accepted Work

Render actionable proposed work using the existing query and decision controls.

Show the supported Goal, Requested Time, offered effort, dates, and productive/support/protection effects without inventing missing explanations.

Preserve exact Proposal identity, revision, option, decision scope, and current action eligibility.

If the existing workflow exposes only its preferred option, this task does not invent a broader option editor.

Review Scope filters presentation. It does not authorize truncating an option’s acceptance to visible rows. Explain an action’s actual scope when it extends beyond the current view.

### Acceptance and realization

Retain existing acceptance-to-realization orchestration, including lawful automatic realization already performed by the existing handler.

Report its stages truthfully:

- Decision accepted.
- Persistence pending or failed, where applicable.
- Work added to the Schedule.
- Acceptance retained but scheduling unsuccessful or unresolved.

Do not collapse those outcomes into “Schedule built.”

Refresh canonical evidence after the operation. An accepted result followed by realization failure is not permission to submit another acceptance.

Expose realization retry only when an existing supported command and sufficient current eligibility evidence establish that action. Do not infer retryability merely from absence of scheduled facts.

When retry is not supported, retain inspection and an honest explanation. New retry eligibility, Proposal editing/ignore, acceptance replacement, and bulk acceptance are excluded.

Keep separate accepted iterations independently inspectable. Preserve the Network+ 10h/20h/unrealized-1h regression.

---

## 9. Corrective Review and Repeated Friction

Keep corrective work separate from constructive decisions:

```text
Friction
→ Suggested Fix
→ Try
→ inspect provisional result
→ explicit Accept
→ existing PlanDecision/placement authority
```

Group repeated Friction using existing canonical kind, source identity, and supported remedy information.

Show count and date span, then one selected occurrence by default. Provide supported subject/date filters and incremental reveal.

Grouping is presentation only. It must not merge occurrence identity, imply one remedy applies to every item, or provide bulk acceptance.

Preserve:

- Exact source incarnation and durable occurrence target.
- Original/revised geometry and affected owner day.
- Existing source/freshness checks.
- Physical occupancy and protected-buffer constraints.
- Realized productive/support/protection facts.
- First-class Sleep duration, continuity, required buffers, and lawful placement rules.

Do not offer Sleep omission, shortening, or protection waiver as cosmetic alternatives.

A Try result remains provisional after navigation. Back, filtering, or leaving the page must not accept it.

A changed source, stale candidate, recreated subject, or vanished Friction must not reuse a visible index or stale action target. Explain the change and require the existing fresh review/Try path.

Retain supported accepted-correction inspection, removal, and persistence retry. Removing a corrective decision must not be described as revoking a constructive acceptance or erasing history.

---

## 10. Explicit Build this Schedule

Use **Build this Schedule** as the ordinary product label for the existing explicit publication command where that mapping is truthful.

The action does not generate a new Goal, accept outstanding offers, or manufacture missing scheduled work.

Before submission, show:

- Exact publication period.
- Current source/generation status.
- Canonical blockers and relevant warnings.
- Accepted work and required Sleep coverage as supported.
- That the action records an immutable schedule for later reporting.

A deliberate Build action is sufficient; do not add a redundant generic confirmation unless an existing contract requires it.

Invoke the current publication command with its exact required range, reviewed source identity/fingerprint, and time contract.

Do not silently replace the reviewed fingerprint with a newly generated source and publish it without rereview.

Preserve the publication owner’s clock and ordering semantics. Do not transplant Structure’s clock rules into publication.

### Explicit boundaries

- Opening Review does not generate or publish.
- Refreshing evidence does not generate or publish.
- Generation is an explicit existing operation.
- Generation is not publication.
- Try is not publication.
- Accepting proposed work is not publication.
- Build does not silently save unrelated editor drafts.

Explain that actions operate on saved canonical state when unsaved drafts exist.

After verified success, refresh canonical evidence and provide a clear route to the relevant Daily Planner/Calendar context without discarding unrelated drafts.

Use existing identical-publication behavior. An already-recorded result is not another newly written schedule.

---

## 11. Failure, Commit Certainty, and Safe Continuations

Keep the existing publication outcomes distinct:

- Validation/source rejection before persistence.
- Known write failure before commit.
- Verified durable success.
- Identical/no-op publication.
- Write completed but verification failed.
- Commit state uncertain.
- Unexpected exception with unconfirmed outcome.
- Protected or recovery-required state.

Only claim no new schedule was saved when the returned contract proves it.

After unverified or uncertain commit, do not recommend blind Build retry, allocate a replacement publication, or dismiss protection on navigation.

Use existing lawful history-status/recheck destinations where available. Do not advertise an unimplemented repair/export action or add destructive abandonment.

For all decision/correction/publication actions:

- Prevent duplicate unresolved submissions synchronously.
- Retain the exact originating subject and accepted result.
- Distinguish runtime acceptance from durability where the owner does.
- Use the owner’s supported persistence retry rather than repeating semantic creation.
- Recheck through current command guards.
- Do not auto-replay after stale, busy, protected, or replaced-context rejection.

A late successful result must remain associated with its actual source operation. It must not update another period or trigger another write after context replacement.

If an essential safety guarantee is absent from the owner, report the exact gap rather than claiming a disabled button supplies it.

---

## 12. Context, Navigation, Freshness, and Restore

Use existing app-owned ephemeral presentation context.

Retain:

- Applied review/publication period and invalid range drafts.
- Selected Proposal/correction/occurrence identities.
- Group filters, reveal counts, and disclosures.
- Pending operation identities and actual outcomes.
- Return destination and focus.

Keep this context separate from Calendar, G2, Activity, and Summary periods.

Preserve Goal, Requested Time, Structure, Measurement, Observation, and Schedule Setup drafts across review navigation.

Contextual source editing must use the existing canonical editor and its actual save boundary. Do not turn an immediate Event save into a SetupDraft operation or silently save a Commitment draft.

Opening a day uses its canonical User Day. Day-level inspection must reuse the existing destination rather than constructing another day model.

### Freshness

Track query identity by owner, scope, source/context generation, and applicable evaluation instant.

Late responses cannot overwrite a newer scope or appear beneath the wrong period heading.

Use existing subscriptions and explicit refresh. Do not add polling, a universal event bus, or a durable review cache.

Relevant source changes invalidate old readiness and pending corrective evidence. Command-time canonical validation remains mandatory.

### Replacement boundaries

Rejected import preserves appropriate drafts/context.

A begun-but-aborted transaction may invalidate operation tokens without erasing unchanged drafts.

Successful restore/full clear invalidates displaced review results and continuations. Recovery-required readiness remains protective.

Profile loading retains its existing domain scope: it may change saved setup and stale review evidence without replacing independent Goal/Progress authority.

Do not weaken the repaired epoch, admission, quiescence, or delayed-write safeguards.

---

## 13. Permanent Automated Regressions

Add focused permanent coverage for:

1. Exactly two primary destinations, nested Review Schedule, and preserved existing contextual entries.
2. Direct entry, explicit period handoff, return context, and Calendar/review/publication range independence.
3. Inclusive/exclusive conversion, invalid range retention, and one-day display filters not narrowing Build.
4. Canonical readiness states, loading without Ready flash, healthy no-history versus protected history, Try materialization, and distinct Sleep limitations.
5. Pending offers remain nonblocking where canonical policy permits; accepted liabilities remain separately represented.
6. Exact constructive accept/reject, pending guards, later equivalent acceptance, and stale/time-only Structure changes rejected by existing revalidation.
7. Acceptance retained after realization failure, without duplicate acceptance or invented retry eligibility.
8. Distinct Network+ iterations and productive/support/protection roles.
9. Repeated Friction grouping with exact per-occurrence Try/Accept and no bulk write.
10. Discarded/stale Try, recreated source rejection, successful correction, retained realized facts, and existing correction removal/retry.
11. First-class Sleep placement correction preserving required geometry/protection.
12. Build creates only the intended publication effects; browse/refresh/generate/Try do not publish.
13. Changed reviewed source/range rejects safely; identical publication creates no duplicate.
14. Actual precommit failure, postcommit verification failure, uncertain commit, and thrown-result UI handling.
15. No blind retry or false unchanged-history claim after uncertainty.
16. Goal/Setup/reporting draft and focus preservation through review/source/day/Summary round trips.
17. Delayed query/command results across scope, owner, restore, clear, and recovery boundaries.
18. Bounded lists with more than ten proposals/attention items and a repeated-Friction density case.

Use real canonical commands or validated fixtures for semantic evidence.

Synthetic approximately 100-Friction presentation fixtures may test grouping/render bounds, but must be labeled and cannot prove persisted validity or storage performance.

Retain existing planning, correction, publication, Sleep, G1/G2, Goals, Progress, compatibility, and restore assertions.

Do not weaken old semantic tests or rewrite historical diagnostics to accommodate presentation changes.

---

## 14. Production Browser and Mobile Acceptance Gate

Use the production build and disposable state at:

```text
320px
390px
768px
1280px
```

At every width exercise:

- Enter Review from Planner and a contextual Goal/day entry.
- Inspect the explicit period and readiness.
- Inspect and decide actual proposed Goal work.
- Distinguish acceptance from scheduled realization.
- Open a conflict, Try a lawful correction, inspect, and explicitly Accept.
- Reach the publication review and Build through the ordinary UI.
- Open the resulting canonical day and return.
- Preserve unrelated unsaved Goal/Requested Time or Setup drafts.

Across retained native evidence also demonstrate:

- A required first-class Sleep correction.
- An explicit generation step that does not publish.
- A discarded Try that creates no corrective decision.
- Stale-source/range feedback.
- Known no-history versus protected-history presentation.
- Actual UI export/import/reload preserving accepted decisions and immutable publication.
- Rejected import retaining the appropriate review context.
- Supported correction removal or persistence retry, where already available.

Use canonical seeding only for supporting data. It must not replace the decisions, correction acceptance, or publication actions being certified.

Commit-uncertainty and precise concurrency cases may use controlled automated fault injection; label them separately from native browser observations.

Require:

- No unintended document horizontal overflow.
- Practical approximately 44 CSS px primary hit targets.
- Reachable actions without traversing an expanded multi-day tower.
- No required hover, double-click, right-click, or dragging.
- Usable reduced-height forms and progressive disclosure.
- Semantic headings/controls and meaningful accessible names.
- Visible keyboard focus and logical tab order.
- Associated errors and non-color-only status.
- Predictable action/Back focus and retained drafts.
- Reflow and equivalent command semantics across widths.

Do not clip content or hide overflow to pass.

Do not claim physical-device, soft-keyboard, OS-dialog, screen-reader, or browser-native-zoom certification without performing it.

Missing mandatory native/mobile acceptance prevents COMPLETE.

---

## 15. Validation and Bundle Gate

Task 9.28 reported:

| Measure | Historical value |
|---|---:|
| Test files / tests | 163 / 1,683 |
| Initial raw JavaScript | 626,896 bytes |
| Initial gzip JavaScript | 164,266 bytes |
| Largest lazy chunk | 62,657 bytes |
| Total JavaScript | 1,271,716 bytes |
| Initial-gzip headroom | 5,734 bytes |

Measure actual current before/after values.

Preserve:

- Initial gzip ≤170,000 bytes.
- Initial raw ≤685,000 bytes.
- Largest lazy chunk ≤100,000 bytes.
- All other current repository hard gates.

Retain lazy review/correction/detail boundaries. Lightweight navigation/context must not eagerly import history, planning, storage, or materialization engines.

Do not raise thresholds, add dependencies, or launch unrelated bundle restructuring.

Report existing advisories and task deltas honestly.

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

A documented worker bound for the complete suite is permitted.

Record actual commands, selected suite, intermediate failures, and resolutions. Do not weaken assertions, existing timeouts, or configuration.

Format task-touched files only as necessary.

---

## 16. Non-Goals and Stop Conditions

Do not implement:

- A third primary destination.
- A new review/readiness/authority owner or durable reviewed flag.
- New scheduling, Friction, materialization, or publication policy.
- New Proposal options/editing/ignore or realization-retry eligibility.
- Bulk acceptance/correction or automatic replanning.
- Acceptance replacement, future-time release, or Goal lifecycle changes.
- Found Time, recurrence, quantitative accounting, or Progress inference.
- A duplicate Daily Planner or complete historical timeline.
- Protected-history repair, destructive abandonment, or new recovery authority.
- Schema, serialization, migration, dependency, or routing-framework changes.
- Formal capability retirement or physical legacy-module removal.

Preserving existing lawful acceptance-to-realization behavior is not permission to add automatic publication.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a mandatory bounded view/action requires evidence existing canonical contracts do not supply.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when proceeding requires new semantics, ownership, transaction behavior, incompatible data interpretation, unsafe identity assumptions, or weakened protection.

Identify the precise missing contract and affected requirement.

A documented pre-existing absence of an excluded action, such as unsupported realization retry, is not itself a blocker for this scope. A missing mandatory publication/correction safety contract is.

Do not replace current-source inspection with either old readiness claims or broad architectural pessimism.

---

## 17. RESULT, Retained Evidence, and Completion Criteria

Write a separate execution RESULT:

`docs/implementation/phase-9/TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_RESULT.md`

Keep this input and earlier artifacts immutable.

Retain evidence under:

`docs/implementation/phase-9/evidence/task-9.29/`

or the established equivalent.

Additional reports, screenshots, measurements, fixture exports, and QA artifacts must include `RESULT` in filenames. Application/test source retains normal repository naming.

The RESULT must include:

1. Bounded outcome and two-primary-destination confirmation.
2. Governing sources and task-relative baseline.
3. Current capability/command map.
4. Before/after capability and reachability ledger.
5. Period, readiness, and evidence semantics.
6. Constructive decision versus realization outcomes.
7. Corrective grouping, exact identity, and Try/Accept evidence.
8. Explicit publication and commit-certainty behavior.
9. Draft/navigation, freshness, races, and restore handling.
10. Permanent tests and production/mobile observations.
11. Before/after bundle metrics and advisories.
12. Every created/modified file and reason.
13. Compatibility, history, schema, dependency, and forensic effects.
14. Remaining exclusions, retained legacy responsibilities, and final determination.

Retain reproduction commands, fixture provenance, exact authority comparisons, viewport/focus measurements, narrow-screen review/correction/publication screenshots, actual import/reload observations, and material validation logs.

Compare authority by its actual identity/order contract. Do not blanket-normalize IDs, timestamps, revisions, optional fields, or frozen records.

Distinguish local retention from commits or remote backups. Do not rely exclusively on `/tmp`.

After writing, read back the actual RESULT and verify its path, heading, outcome, and evidence. Return that report, not the READY input.

COMPLETE requires all mandatory workflow, capability-preservation, identity, failure, navigation, automated, native/mobile, and hard-bundle gates.

A renamed tab or passing build alone is insufficient.

This completion does not retire legacy Review/Preview, complete protected-history recovery, or close Phase 9.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.29 — Planner / Review Schedule Workflow Convergence V1 is COMPLETE.**

or:

**Task 9.29 — Planner / Review Schedule Workflow Convergence V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when users can review an explicit period, make existing constructive and corrective decisions, understand accepted versus scheduled work, and explicitly build the reviewed schedule within Planner—while preserving canonical authority, commit certainty, drafts, history, compatibility, and the two-primary-destination layout.**