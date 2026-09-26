# Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — Authorized Continuation 2

**Status:** READY — SECOND AUTHORIZED WORKFLOW CONTINUATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Existing Planner Workflow, Decision/Correction Orchestration, and Mobile Product Convergence
**System:** DayFrame
**Task Identity:** Original Task 9.29; second authorized continuation, not a new numbered task
**Prerequisite:** Task 9.29.4 — Acceptance-to-Realization Lifecycle & Replacement Isolation Repair V1 — accepted COMPLETE
**Implementation Authority:** Existing repaired commands, canonical queries, presentation, and contextual navigation
**Architecture / Owner / Domain-Semantics Change Authority:** NONE
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**New Recovery Authority:** NONE
**Capability Retirement / Legacy Module Removal Authority:** NONE

---

## 1. Objective and Product Boundary

Complete the original Review Schedule workflow within Planner.

Users must be able to review an explicit period, understand readiness, decide constructive offers, inspect accepted versus scheduled work, apply exact corrective Try/Accept actions, and explicitly Build this Schedule.

They must retain understandable failure/protection feedback, safe command handling, unrelated drafts, and contextual return navigation.

Planner and Summary remain the only primary destinations.

Review Schedule is subordinate to Planner. A dedicated contextual screen is permitted; a third primary home is not.

This continuation consumes repaired owners. It does not redesign them or treat their completed tests as acceptance of the still-unimplemented workflow.

---

## 2. Continuation Identity and Immutable History

Preserve this sequence:

- Original 9.29: blocked on publication replacement isolation.
- 9.29.1: publication contract resolution.
- 9.29.2: accepted publication repair.
- First 9.29 continuation: blocked on realization replacement isolation.
- 9.29.3: acceptance-to-realization contract resolution.
- 9.29.4: accepted Proposal/realization repair.
- This continuation: original workflow implementation resumes.

Do not overwrite either blocked execution, either repair, any proposal, acceptance ADR, diagnostic, or prior input.

Save this input at:

`docs/implementation/phase-9/TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_CONTINUATION_2.md`

The original assignment and first continuation intentionally exist. Check for an already-executed or conflicting second continuation before proceeding.

Do not renumber this work as 9.30 or 9.29.5.

Verify Sections 1–18 and the final completion statement. This continuation preserves all mandatory original requirements, updating only their references to accepted current contracts.

---

## 3. Governing Sources and Remaining Coverage Check

Read actual repository copies of:

- Original Task 9.29 input and blocked RESULT.
- First authorized continuation input and blocked RESULT.
- Task 9.29.4 RESULT, acceptance ADR, regression matrix, reproduction guide, and `WRITER_CONSUMER_AND_COVERAGE_LEDGER_RESULT.md`.
- Task 9.29.2 RESULT, publication acceptance ADR, and relevant queue/terminal/currentness tests.
- The accepted immutable contracts as decision provenance.
- Task 9.17 §§44–52 and capability ledger; Task 9.18 navigation.
- Product Ontology and governing Appendix B.
- Applicable scope, Review, publication, correction, and first-class Sleep contracts.
- G1/G2 and relevant 9.20/9.21/9.24–9.28 product-context safeguards.
- Durable compatibility, restore, and End-State Compatibility & Retirement specifications.

Complete the previously stopped workflow-specific governing review.

Before layout implementation, update the bounded command/capability ledger for constructive decisions, realization retry, corrective acceptance/removal/persistence retry, Sleep placement, publication, and contextual editor handoffs.

For each, identify current owner, exact target, asynchronous/write boundaries, result/currentness contract, replacement behavior, existing tests, and missing workflow evidence.

Separate demonstrated behavior, source inspection, and unverified cases.

An unverified row is not automatically a defect. Conversely, named safety mechanisms in another owner do not prove that row safe.

Use focused tests of existing contracts where needed. Do not impose publication receipts or asynchronous leases on an unrelated command merely for uniformity.

If a mandatory independent owner gap is demonstrated, record its exact ordering and stop the affected implementation under Section 16. Continue independently useful read-only ledger work rather than leaving the remaining scope unspecified.

This is not an all-application audit or authorization to repair another owner.

---

## 4. Baseline and Forensic Protection

Before application changes:

- Record HEAD, exact working-tree status, and applicable repository instructions.
- Capture task-relative preservation hashes and relevant baseline copies.
- Run current validation and production-bundle baselines.
- Pin governing source versions and identify lazy boundaries.

Use the dirty working tree, not HEAD alone, as the executable baseline.

Task 9.29.4 reported 261 starting status entries and 1,435 baseline files. Capture current values.

Preserve unrelated work, all historical artifacts, and retained evidence.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable fixtures, databases, browser profiles, and origins.

---

## 5. Workflow Composition and Capability Preservation

Compose a bounded contextual workflow:

1. Reviewed period and readiness.
2. Constructive offers awaiting decisions.
3. Accepted work and scheduling status.
4. Conflicts, provisional corrections, and retained accepted corrections.
5. Publication review and Build this Schedule.

Use progressive disclosure and focused selections rather than an expanded multi-day tower.

Reuse existing components or narrowly extract presentation into lazy components. Keep navigation/context lightweight.

Preserve verified access to generation/range controls, schedule detail/visualization, decisions, realization retry, corrections and their removal/retry, contextual source editing, publication feedback, annotations/holidays, and technical detail.

Record before/after reachability for every still-valid capability.

A contextual handoff counts only when its destination and return path work. Do not hide a capability behind a future implementation.

Recomposition does not require reproducing the old screen arrangement. It does not authorize formal retirement, removal of legacy modules, or deletion of supported compatibility behavior.

Keep Calendar, Daily Planner, Schedule Setup, Goals, and Summary independently reachable.

---

## 6. Period, Scope, and Range Fidelity

Use existing typed Review Scope and publication-range adapters.

Reconfirm the reported current precedence:

`Current Preview bounds → otherwise saved configured Preview bounds`

Preserve that deterministic meaning for first/direct entry. Do not invent a current-month default.

Ordinary entry restores context. Explicit Review this period navigation may apply a valid supplied period through the existing contract.

Calendar browsing must not continuously reset Review.

Keep distinct Calendar navigation, Review Scope, Planning Data Horizon, Proposal Horizon, generation coverage, Publication Range, and local visualization/list filters.

Display human-readable inclusive endpoints while honoring each API’s actual range convention and limits.

Invalid range drafts retain errors and the previous valid applied period. Do not silently clamp, query a substitute period, or alter unrelated settings.

Use the existing explicit save/command boundary for generation configuration.

A one-day filter cannot narrow Build. Visible Proposal rows cannot silently truncate an option’s acceptance scope.

Show the exact prospective publication period before the explicit Build action.

---

## 7. Canonical Readiness

Reuse `queryPlanningReview`, `deriveScheduleReviewReadiness`, `publicationBlockers`, or their current equivalents.

Translate and group their results; do not introduce another blocker policy.

Preserve distinctions among:

- Planning coverage complete, partial, absent, or unknown.
- Materialization missing, stale, range-mismatched, current, or Try-revised.
- Pending offers versus accepted liabilities.
- Accepted-but-unrealized versus unavailable/protected realization.
- Actual unresolved Friction.
- Historical access/protection versus historical coverage.
- Healthy no-prior-publication.
- First-class Sleep foundation states.
- Current command busy/protected outcomes where supported.

Pending offers are not automatic publication blockers.

Loading, invalidation, and source changes must not flash or retain unsupported Ready feedback.

Review readiness and publication readiness retain their current distinction.

Successful realization with reviewRequired means saved work needs fresh review, not that the period remains ready to publish.

Queries, filters, disclosure, and Refresh perform no semantic writes or implicit generation.

---

## 8. Constructive Decisions and Realization

Present existing actionable offers with exact Proposal revision, option identity, Goal/Requested Time context, scope, and productive/support/protection effects.

Do not invent absent explanations or add option editing beyond existing controls.

Explain when acceptance affects more than the visible period.

Use current typed Proposal results. Acceptance is reported as accepted only under the repaired verified-commit contract.

Preserve the existing automatic realization attempt without adding another callback.

Keep separate:

- Verified acceptance.
- Successful scheduling.
- Current acceptance with known realization failure/conflict.
- Busy or displaced realization.
- Unconfirmed acceptance or realization.
- Saved realization requiring review.

Do not label unconfirmed Proposal persistence “decision not recorded” or “saved locally.”

Retain the outer acceptance receipt and original nested realization result/receipt. A historical accepted outcome with noncurrent receipt is not current retained acceptance.

### Existing explicit retry

Preserve the existing realization-retry path.

Eligibility comes from current supported evidence and owner guards, not the mere absence of facts.

A fresh explicit retry never accepts again. Already-realized success preserves original identities/time and creates no duplicate facts or Capacity effect.

Proposal and realization owners reject overlapping commands as busy without queueing. Do not add timers, promise joins, or automatic replay.

Publication’s separately accepted queue remains unchanged.

Keep Network+ accepted 10-hour, 20-hour, and unrealized 1-hour iterations distinct and independently inspectable.

---

## 9. Corrective Review and First-Class Sleep

Preserve the separate correction sequence:

`Friction → Suggested Fix → Try → provisional inspection → explicit Accept`

Group repeated Friction using existing canonical kind, source identity, and supported remedy information.

Show count/date span and a focused occurrence. Normally show at most ten groups/rows initially, with explicit reveal.

Ambiguous items remain individually inspectable rather than receiving invented grouping identity.

Grouping never authorizes bulk acceptance or merges durable occurrence targets.

Preserve source incarnation, exact owner day, original/revised geometry, current evidence, and the owner’s command eligibility.

Try remains provisional through navigation, filtering, and Back. Leaving does not accept it.

Changed/recreated sources, stale candidates, or vanished Friction require the existing fresh review/Try path. Never retarget by title, index, or similar geometry.

Retain supported accepted-correction inspection, removal/revocation, and persistence retry.

First-class Sleep keeps its distinct proof, accepted-placement, duration, continuity, window, and required-buffer rules.

Do not add omission, shortening, splitting, protection waiver, or silent multi-occurrence propagation.

Use each corrective owner’s actual admission/currentness contract. UI guards must not be presented as proof against an unguarded physical write.

---

## 10. Explicit Build this Schedule

Use Build this Schedule as the ordinary label for the existing explicit publication command where that mapping is truthful.

Before submission, show exact period, saved source/materialization state, canonical blockers/warnings, relevant scheduled-work/Sleep evidence, and the historical-recording consequence.

Do not add a redundant confirmation unless an existing contract requires one.

Submit the reviewed range, source fingerprint/witness, and existing publication-time input.

Do not regenerate, replace the reviewed source silently, and publish unseen content.

Preserve:

- Opening/Refresh do not generate or publish.
- Generation is explicit and does not publish.
- Try does not publish.
- Constructive acceptance/realization does not publish.
- Build does not accept pending offers or save unrelated drafts.

Commands use saved canonical state. Explain that boundary where unsaved drafts make it consequential.

After verified success, requery and provide canonical day/Calendar navigation with safe return.

Durable alreadyPublished is not another new publication. Pending-only equivalence is not durable success.

Do not alter publication queueing, clocks, lease, terminal receipt, certainty, or recovery behavior.

---

## 11. Result Identity, Certainty, and Failure Presentation

Preserve original receipt-bearing Proposal, realization, and publication objects.

Do not spread, JSON-clone, serialize, or reconstruct away their non-enumerable currentness receipts. Keep outer and nested receipts separate.

Before current feedback or success refresh, check the recognized receipt and initiating UI identity.

Currentness is not proof of unchanged source content. Continue using canonical freshness and command validation.

Handle all supported results exhaustively, including sourceChanged, contextReplaced, owner/replacement busy, unavailable/protected, pendingPublication, verified success/no-op, known no-write failure, failed verification, uncertainty, and reviewRequired.

Only claim no new data was saved when the returned contract proves it.

Physical termination does not mean verified success. Settled uncertainty remains protected; unresolved physical work remains fenced.

No blind retry, silent resubmission, automatic destructive retry, or protection dismissal on navigation.

Set synchronous duplicate-submit guards before dispatch, including before React repaint.

A late result may describe its old operation but cannot update a different period, refresh replacement as success, or trigger a secondary write.

For other command families, use their documented evidence rather than fabricating these receipts.

---

## 12. Drafts, Navigation, Queries, and Replacement

Retain ephemeral app-owned Review context: applied/invalid period, selected identities, filters, reveal/disclosures, pending operations, outcomes, return destination, and focus.

Keep Review periods independent of Calendar, Summary, G2, and Activity.

Preserve Goal, Requested Time, Structure, Measurement, Observation, and Setup drafts across supported round trips.

Contextual editing uses the existing editor and save boundary. Do not silently save a Commitment draft or convert immediate Event editing into a different transaction model.

Open days using canonical User Day references and the existing Daily Planner.

Associate queries with owner, scope, request generation, source identity, and replacement context. Late responses cannot appear under a newer heading.

Use existing subscriptions, explicit Refresh, and appropriate return refresh; no polling, per-render clock sampling, durable cache, or automatic draft rebase.

Busy/rejected replacement preserves appropriate context. A begun-but-aborted transaction may invalidate operation tokens without erasing valid drafts.

Successful replacement invalidates displaced results and continuations. Recovery-required readiness remains protective.

Profile loading keeps its independent authored-setup scope and freshness effects.

Do not generalize four-owner quiescence into an all-owner guarantee.

---

## 13. Permanent Workflow Regressions

Map all eighteen original regression groups to retained or new permanent tests:

1. Exactly two primary destinations and contextual Review entry without writes.
2. Direct/explicit-period entry, Back, and independent Calendar/Review/publication scope.
3. Date conversion, invalid-draft retention, and filters not narrowing command scope.
4. Readiness matrix, no Ready flash, healthy-empty/protected history, Try and Sleep states.
5. Pending offers versus separate accepted liabilities.
6. Exact accept/reject, verified/unconfirmed Proposal outcomes, and actual-time Structure revalidation.
7. Original-lifetime automatic handoff; retained acceptance after known scheduling failure; fresh explicit retry without reacceptance.
8. Distinct accepted iterations, exact lineage, and all realized roles.
9. Bounded repeated Friction with exact per-occurrence Try/Accept and no bulk write.
10. Discarded/stale Try, recreated sources, retained realized facts, correction removal/retry.
11. First-class Sleep proof and geometry/protection preservation.
12. Explicit Build’s effects; browse/Refresh/generate/Try do not publish.
13. Stale reviewed source/range; durable no-op versus pending duplicate.
14. Original outer/nested receipts, displaced results, busy owners, and reviewRequired.
15. Precommit, postcommit-verification, uncertain and thrown outcomes without false reassurance or blind retry.
16. Draft/selection/focus preservation across source/day/Goal/Summary navigation.
17. Delayed reads/commands across scope, busy/aborted/successful replacement, clear, recovery, and profile boundaries.
18. More than ten valid offers/attention items and repeated-Friction density.

Retain the complete accepted owner-safety suites. Add consumer/integration coverage for the new workflow rather than replacing them with mocks.

Use canonical commands or validated fixtures for semantic proof.

Synthetic approximately 100-item Friction fixtures may test presentation only; label them and make no persistence, feasibility, or performance claim.

Document necessary UI expectation changes while preserving semantic, zero-write, identity, protection, and historical assertions.

No rewritten historical diagnostics or weakened existing tests.

---

## 14. Production Browser and Mobile Acceptance Gate

Use the production build and disposable state at:

`320px, 390px, 768px, 1280px`

At every width exercise:

- Planner and contextual Goal/day entry.
- Period and readiness inspection.
- Actual constructive decision and scheduling outcome.
- Conflict selection, lawful Try, inspection, and explicit Accept.
- Publication review and ordinary Build.
- Canonical day navigation and return.
- Retention of unrelated Goal/Requested Time or Setup drafts.

Across retained native evidence also exercise required Sleep correction, explicit generation without publication, discarded Try, stale-source feedback, healthy-empty versus protected history, supported correction removal/retry, and actual V14 export/import/re-export/reload.

Include a disposable round-trip dataset with nonempty immutable publication, Actual, and independent Progress. Preserve those authorities exactly except for the explicitly intended command effects.

The 9.29.4 native fixture had those three authorities empty; do not cite it as this nonempty native proof.

Use supporting canonical seeding/validated fixtures, but do not substitute them for the workflow actions being certified.

Exercise new controls against the retained controlled publication/Proposal/realization busy or delayed-delivery seams. Label fault/delivery injection separately from ordinary native operation.

Require practical approximately 44px primary targets, no document overflow, visible keyboard focus, semantic controls/headings, associated errors, non-color-only feedback, reduced-height/reflow usability, predictable return focus, and no required hover/drag/double-click/right-click.

Relevant actions must be reachable without traversing an expanded date tower.

Record actual minima, not merely a tolerance-based pass. Do not clip content to pass overflow.

No physical-device, OS-dialog, soft-keyboard, screen-reader, or browser-native-zoom certification without performing it.

Missing mandatory native/mobile evidence prevents COMPLETE.

---

## 15. Validation and Bundle Gate

Task 9.29.4 reported:

| Measure | Historical value |
|---|---:|
| Test files / tests | 172 / 1,767 |
| Initial raw JavaScript | 638,327 bytes |
| Initial gzip JavaScript | 167,653 bytes |
| Largest lazy chunk | 62,652 bytes |
| Total JavaScript | 1,294,546 bytes |
| Initial-gzip headroom | 2,347 bytes |

Measure actual current before/after values and check bundle effects early.

Preserve initial gzip ≤170,000 bytes, initial raw ≤685,000 bytes, largest lazy chunk ≤100,000 bytes, and every other repository hard gate.

Keep heavy Review/detail/engine code lazy and context lightweight.

Do not weaken safety, raise thresholds, install dependencies, or undertake unrelated restructuring to fit the bundle.

Run repository equivalents of:

```text
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run test -- --maxWorkers=1
npm run build
npm run check:bundle
git diff --check
```

Run the complete final suite without concurrent build/static jobs.

Explicitly report each command’s final pass/fail, working directory, evidence path, intermediate failures, and resolutions. Do not infer formatting or whitespace success from another gate’s result.

Retain existing advisories and exact task deltas. Do not weaken assertions, timeouts, configuration, or test selection.

Format only task-created/touched files.

---

## 16. Exclusions and Stop Conditions

No new primary destination, review authority, durable reviewed flag, owner concurrency mechanism, scheduling policy, publication policy, recovery permission, or command semantics.

No new Proposal options/edit/ignore, realization eligibility, bulk decisions/corrections, automatic retries, acceptance replacement, time release, recurrence, Goal lifecycle, Found Time, Progress inference, duplicate Daily Planner, or historical reconstruction.

No persistent drafts, schema/format/migration/dependency/router-framework changes, formal retirement, or legacy-module deletion.

Consume the accepted runtime outcomes; do not reopen their architecture merely because older reports lacked them.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

for a mandatory view/action whose required evidence is unavailable.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

for a demonstrated need to change owner semantics, transaction behavior, compatibility, or protection.

Identify the exact affected requirement, command ordering, evidence, and missing authority. Preserve useful independent findings.

Do not invent a defect from an unverified ledger row, silently absorb another owner repair, or waive a genuine blocker to finish this continuation.

---

## 17. New RESULT, Evidence, and Completion Criteria

Write:

`docs/implementation/phase-9/TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_CONTINUATION_2_RESULT.md`

Retain evidence under:

`docs/implementation/phase-9/evidence/task-9.29-continuation-2/`

Do not overwrite either earlier blocked RESULT or evidence directory.

All additional reports, logs, screenshots, measurements, exports, and QA outputs must contain RESULT in their filenames. Application/test source retains repository conventions.

Include:

- Continuation history, governing versions, and actual baseline.
- Reconciled command/replacement-coverage ledger.
- Original requirement-to-evidence matrix.
- Before/after capability and reachability ledger.
- Period/readiness and constructive-versus-corrective semantics.
- Repaired result/receipt/uncertainty handling.
- Draft/navigation/query/replacement outcomes.
- Permanent regressions and native/mobile observations.
- Exact nonempty authority round-trip comparisons.
- Every validation result and before/after bundle metric.
- Every created/modified file and its purpose.
- Compatibility, schema, dependency, historical, and forensic effects.
- Remaining evidence limits and retained legacy responsibilities.

Preserve IDs, revisions, timestamps, optional absence, lineage, nested order, and frozen records. Only specifically identified contractually unordered collections may be compared by canonical key.

Retain fixture provenance, reproduction commands, screenshots, measurements, comparisons, material logs, and task-relative preservation evidence.

Distinguish local retention from commits or remote backups. Do not rely exclusively on `/tmp`.

Read back the actual RESULT and verify path, heading, determination, and final statement. Return it—not this READY input or a repair RESULT.

COMPLETE requires all original mandatory workflow, capability, identity, certainty, navigation, automated, native/mobile, compatibility, and hard-bundle gates.

Neither a renamed screen nor accepted owner repairs establish workflow completion.

Completion does not retire Review/Preview, certify every writer, complete protected-history recovery, implement the full Goal lifecycle, or close Phase 9.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.29 — Planner / Review Schedule Workflow Convergence V1 is COMPLETE through Authorized Continuation 2. Both earlier blocked executions and their RESULTs remain unchanged.**

or:

**Task 9.29 — Planner / Review Schedule Workflow Convergence V1 remains PARTIAL/BLOCKED for the reasons documented in the Authorized Continuation 2 RESULT.**

**The task is complete when users can review an explicit period, make existing constructive and corrective decisions, understand accepted versus scheduled work, and explicitly build the reviewed schedule within Planner—while preserving repaired acceptance/realization/publication boundaries, truthful outcomes, drafts, history, compatibility, mobile usability, and the two-primary-destination layout.**