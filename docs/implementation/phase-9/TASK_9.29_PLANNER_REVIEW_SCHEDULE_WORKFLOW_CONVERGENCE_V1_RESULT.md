# Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — RESULT

**Status: PARTIAL/BLOCKED — mandatory publication-owner safety contract gap confirmed during preflight.**

## 1. Bounded outcome and stop determination

**STOP CONDITION — ARCHITECTURE DECISION REQUIRED**

A publication whose physical write is delayed can resume **after a successful full clear or V14 restore**, write the displaced schedule into the new authority, return `published`, and remain present after restart. Both cases were reproduced using the production commands and disposable storage. Before release of the delayed operation, replacement had succeeded, Preview was null, and historical batches were empty. After release, one old publication was durable.

Task §§11–12 require delayed command safety across replacement, protection against writes after context replacement, and owner-level guarantees rather than disabled-button claims. Task §16 explicitly stops work when mandatory publication safety requires new transaction behavior. The task grants no architecture/domain-semantics authority. This missing publication lifecycle contract cannot be supplied by React context or hidden by discarding a late result.

**No application implementation was made.** The existing two primary destinations, Planner and Summary, remain unchanged. Review remains subordinate to Planner at its current Review Plan entry. The requested bounded Review Schedule convergence and Build this Schedule presentation were not delivered or certified. No legacy capability/module was removed or retired.

## 2. Governing inputs, identity and execution baseline

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. The execution baseline is the dirty working tree: **240 status entries** in the captured status, with **1,201 file hashes** covering application source, documentation/evidence, top-level code configuration and PDFs. The status was captured after creating the task evidence directory; its parent evidence path was already untracked. No applicable repository/ancestor AGENTS.md was found. No skill or sub-agent was used.

The existing [Task 9.29 input](TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1.md) was byte-identical to the user attachment. All Sections 1–18 and the final completion statement were verified. No executed 9.29 RESULT existed; earlier projected numbering was not substituted for this assignment. The input remains separate and immutable.

Relevant repository sections inspected include Task 9.28 RESULT; 9.17 §§44–52 and capability ledger; 9.18 navigation; Product Ontology's Review Schedule/Build/Preview/navigation definitions; 9.4, 9.6, 9.7 and 9.9 contracts; 9.14/9.15 Sleep correction/publication contracts; G1/G2 ADR and 9.20/9.21/9.25 results; 9.24, 9.26, 9.27.2 and 9.27 continuation safeguards; durable compatibility and cross-storage restore ADRs; End-State Compatibility/Retirement and governing Appendix B definitions. [Governing versions](evidence/task-9.29/governing-versions-RESULT.json) pins repository document hashes; the broader [baseline hashes](evidence/task-9.29/baseline-hashes-RESULT.json) pins executable sources.

Task 9.27's original blocked history, repairs, accepted continuation, Task 9.28 RESULT, all earlier artifacts, diagnostics and preserved PDFs remain byte-for-byte unchanged. No preserved Dogfood Pass 02 database/profile was opened or initialized.

## 3. Current capability and command map

The focused [capability matrix](evidence/task-9.29/COMMAND_MAP_RESULT.md) records current entry, read source, exact command/target, allowed effects, failure/retry contract and proposed presentation for generation/ranges, Review readiness, constructive decisions, accepted work, correction, source editing, publication, history and restore.

Current code was inspected rather than treating historical results as executable guarantees. In particular:

- `queryPlanningReview`, `deriveScheduleReviewReadiness` and `publicationBlockers` remain the canonical Review/publication policy path.
- `acceptProposalOption` retains its existing acceptance-to-realization callback; acceptance and scheduling are separate outcomes.
- **Realization retry exists today**: the Review mount passes `realizeAcceptedAllocation`, despite Task 9.6's earlier deferral. The owner checks ingress, resolved V2 acceptance, existing realization, current foundation and staged occupancy. This preflight does not claim that absence of facts alone establishes retry eligibility or certify every existing retry button.
- `publishScheduleRangeV1` delegates to `HistoricalPlan.publishAtomically` with source-content checks and typed commit outcomes, but lacks the demonstrated replacement lifecycle guarantee at the delayed physical write boundary.

## 4. Before/after capability and reachability ledger

Every current entry in the capability matrix is retained unchanged. The lazy `ScheduleReviewPanel`, `PreviewScreen`, Goal detail, canonical day and evidence adapters remain intact. Schedule detail/visualization, Proposal decisions, accepted-work inspection, grouped/per-day Friction, Try/Accept, accepted correction removal/durability retry, contextual Event/Commitment/Work and Sleep setup, publication feedback, holidays and technical metadata retain their existing responsibilities.

The matrix's proposed presentation column is **unimplemented continuation work**, not evidence of completed handoffs. No capability was moved to an unimplemented destination. Formal retirement and module removal remain unauthorized.

## 5. Period, readiness and evidence semantics

Current deterministic Review precedence is current Preview bounds, otherwise saved configured Preview bounds. The legacy inclusive end is converted with `addUserDayLabels(end, 1)` to typed Review Scope; publication uses `publicationRangeFromReviewScope`. Calendar navigation and the one-day visualization filter do not narrow the publication range. No current-month default, range clamp or G2/Activity limit was transplanted into publication.

Canonical policy distinguishes current/missing/stale/mismatched/Try materialization, accepted liabilities, Friction, historical protection/access and materialization eligibility. Pending offers are not automatic blockers. Healthy empty history is distinct from protected history. Sleep foundation qualification remains separate. The reproduction first asserts an actually eligible Review with no prior publication; it does not force a fake Ready state.

New invalid-draft retention, contextual period handoff, bounded evidence presentation and render-identity/loading protections are not implemented or certified by this blocked execution.

## 6. Constructive decisions versus realization

The current Proposal owner persists acceptance before invoking existing realization orchestration. The command carries exact Proposal ID/revision and option ID, and current revalidation includes the repaired Structure temporal evidence. Review membership is presentation scope, not permission to truncate acceptance claims. The current realization owner returns `alreadyRealized` for retained realized acceptance and does not require another acceptance to retry scheduling.

No constructive authority or retry eligibility was changed. Distinct Network+ iterations, productive work, support and protection remain governed by existing G2 contracts and tests. New Task 9.29 constructive workflow and mobile checks remain outstanding; this report does not re-certify them from source inspection alone.

## 7. Corrective identity, grouping and Sleep

Current Try uses selected Friction/SuggestedFix IDs; candidate construction maps original/revised materialization to the durable occurrence target. Existing correction acceptance, replay, removal and persistence retry remain untouched. First-class Sleep has its own fresh proof/fingerprint validation, duration/continuity/buffer geometry, exact owner and accepted-placement lifecycle. Those guarantees were not generalized to other correction families by inference.

The desired source/remedy groups, selected occurrence, filters and bounded reveal were not built. No synthetic density fixture or native correction acceptance is claimed. No omission/shortening/waiver alternative was added for Sleep. Existing corrective regression assertions were not weakened.

## 8. Publication safety finding and commit certainty

The retained [reproduction guide](evidence/task-9.29/REPRODUCTION_RESULT.md), [diagnostic source](evidence/task-9.29/contract-repro-RESULT.test.ts), [clear observations](evidence/task-9.29/publication-clear-observations-RESULT.json) and [restore observations](evidence/task-9.29/publication-restore-observations-RESULT.json) provide executable evidence.

| Observation                                         | Full clear       | V14 restore      |
| --------------------------------------------------- | ---------------- | ---------------- |
| Initial Review blockers                             | None             | None             |
| Initial/incoming historical batches                 | 0                | 0                |
| Replacement result                                  | `cleared`        | `restoredV14`    |
| Runtime transaction epoch                           | 0 → 1            | 0 → 1            |
| Preview and history before delayed write release    | null / 0 batches | null / 0 batches |
| Physical admission callback supplied by publication | No               | No               |
| Old command after release                           | `published`      | `published`      |
| Retained historical batches after restart           | 1                | 1                |

The source path explains the outcome:

1. `schedulePublication.ts` captures source content and rechecks after the asynchronous Review query.
2. `historicalPlanSurface.ts` checks `isCurrent` before calling `storage.mutate`.
3. It does **not** supply the storage adapter's optional admission callback. The adapter awaits database opening before creating the physical readwrite transaction.
4. The replacement transaction's `canBegin` checks Structure quiescence, not in-flight publication. HistoricalPlan has no corresponding replacement epoch/generation/lease guard for this continuation.
5. The old write can complete and adopt metadata into replaced runtime; restart confirms the physical batch.

The injected delay delegates unchanged arguments to the real storage method; it does not mock successful publication, bypass canonical blockers or fabricate records. Comparisons preserve exact IDs, timestamps, revisions, optional fields, record order and frozen Sleep evidence.

An earlier hypothesis was rejected: beginning a transaction immediately after dispatch produces `materializationFailure` and empty history, because Sleep authority becomes incomplete. That effective guard is retained in the intermediate log. The confirmed defect occurs later, after it has passed.

Existing validation rejection, known precommit failure, durable success, identical no-op, postcommit verification failure and uncertain commit remain separate supported outcomes. The diagnostic concerns replacement isolation, not an assertion that those distinctions are absent. No blind retry, replacement publication allocation or destructive recovery was added.

## 9. Context, freshness, restore and repair boundary

Discarding a late UI result would leave the durable defect intact. Disabling Build synchronously can prevent duplicate UI submissions but cannot cancel an already admitted storage write or preserve replacement authority. A proper fix must be owned by the publication/transaction boundaries.

Required follow-up authority is bounded: define publication admission through lazy/asynchronous work, physical precommit admission, replacement quiescence and continuation identity, and settlement of already-started/committed operations. Preserve the existing publication clock/order, immutable history, uncertainty protection and exact retry/no-op rules. Do not copy Structure's clock rules or introduce a new durable review flag, schema, migration or recovery owner.

Existing Goal/Requested Time/Setup/Measurement/Observation contexts and restore invalidation are unchanged. New review-specific context, focus restoration and race regressions remain unimplemented. No claim is made that this single defect exhausts all Task 9.29 preflight risks.

## 10. Automated and production/mobile validation

The isolated diagnostic passes **2 cases**, proving the unsafe behavior in actual canonical commands with controlled delayed storage and fresh fake IndexedDB/localStorage. It is deliberately outside the ordinary test suite and is labeled a defect reproduction, not a permanent regression claiming safety. No old test, timeout, assertion or configuration was changed.

Baseline full suite: **163 files / 1,683 tests; 1 failed, 1,682 passed**. The failing existing `GoalStructureAuthoring` related-navigation/V14-restore test could not find its restore success message within the current wait. A standalone unchanged rerun passed **27/27**. Baseline build ran concurrently with that first suite; this is a possible timing factor, not a proven cause. The complete unchanged suite then passed **163/163 files and 1,683/1,683 tests in 99.99 seconds**, without concurrent build/static validation.

**Mandatory production/mobile acceptance was not performed.** No 320/390/768/1280 workflow, browser export/import/reload, focus/overflow/hit-target, physical-device, soft-keyboard, screen-reader or native-zoom certification is claimed. The command-level V14 restore/restart reproduction is not a substitute for native UI import/reload. This alone prevents COMPLETE, in addition to the owner stop condition.

## 11. Validation commands and bundle gate

Commands run from `code/`, except Git/preservation checks at repository root:

```sh
npm run test -- --maxWorkers=2
npm test -- --maxWorkers=2 src/ui/tests/GoalStructureAuthoring.test.tsx
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29/contract-repro-config-RESULT.mjs --maxWorkers=1
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run build
npm run check:bundle
git diff --check
```

Formatting, lint, typecheck, baseline production build, bundle hard gates and whitespace checks passed. Task-created documentation/diagnostic files alone were formatted. Validation logs, including intermediate failures, are retained under [task-9.29 evidence](evidence/task-9.29/REPRODUCTION_RESULT.md). The first diagnostic run hit Vite's external temporary-cache path and was retried with approved escalation; no dependencies were installed.

| Bytes                            |    Before |     After | Delta |
| -------------------------------- | --------: | --------: | ----: |
| Initial raw JavaScript           |   626,896 |   626,896 |     0 |
| Initial gzip JavaScript          |   164,266 |   164,266 |     0 |
| Largest lazy chunk               |    62,657 |    62,657 |     0 |
| Total JavaScript                 | 1,271,716 | 1,271,716 |     0 |
| Initial gzip hard-limit headroom |     5,734 |     5,734 |     0 |

The unchanged hard limits remain 685,000 raw / 170,000 gzip / 100,000 largest lazy. Existing initial-gzip advisory (>161,500) and total architecture-review advisory (>825,000) remain. No lazy boundary, eager graph, dependency, threshold or measurement script changed. Final measurements are retained separately from the historical Task 9.28 values.

## 12. Files and preservation

All execution-created files are the separate RESULT and artifacts under `docs/implementation/phase-9/evidence/task-9.29/`. [File manifest](evidence/task-9.29/FILE_MANIFEST_RESULT.md) lists each with its reason. The [preservation inventory](evidence/task-9.29/preservation-inventory-RESULT.json) compares the execution baseline by exact bytes.

No pre-existing application, test, task input, historical RESULT, diagnostic, architecture, schema, package/lockfile or PDF was edited. Generated ignored production output was rebuilt using the existing command. No reset, stash, commit, push, dependency installation or unrelated cleanup occurred. Artifacts are retained locally; this is not a claim of a commit or remote backup.

## 13. Compatibility, history and forensic effects

No production persistence format, schema, migration, durable reader, legacy interpretation, publication policy or recovery command changed. Existing immutable history and compatibility responsibilities remain intact in the application. Only disposable test data was authored, cleared, restored and published to demonstrate the defect. Preserved Dogfood Pass 02 state and earlier forensic evidence were untouched.

## 14. Remaining work and final determination

The bounded UI implementation, all eighteen requested permanent regression groups and mandatory native/mobile acceptance remain outstanding. They must resume after an explicitly authorized publication-owner safety repair is implemented and verified. This execution supplies a precise reproducible prerequisite, not a general architecture audit, speculative blocker or proposed retirement.

Final full-suite validation: **163 files / 1,683 tests pass**. See `tests-RESULT.log`, `build-RESULT.log`, `bundle-RESULT.log` and `preservation-inventory-RESULT.json` for the measured checks. Passing existing tests or bundle gates does not resolve the reproduced safety gap.

**Task 9.29 — Planner / Review Schedule Workflow Convergence V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when users can review an explicit period, make existing constructive and corrective decisions, understand accepted versus scheduled work, and explicitly build the reviewed schedule within Planner—while preserving canonical authority, commit certainty, drafts, history, compatibility, and the two-primary-destination layout.**
