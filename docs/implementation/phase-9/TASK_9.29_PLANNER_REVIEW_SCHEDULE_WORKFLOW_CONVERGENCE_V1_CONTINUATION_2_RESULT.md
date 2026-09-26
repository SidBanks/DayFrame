# Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — Authorized Continuation 2 RESULT

**Status: PARTIAL/BLOCKED.**

**STOP CONDITION — ARCHITECTURE DECISION REQUIRED**

A new independent preflight diagnostic demonstrates that protected Proposal authority is not qualified in the canonical Review/publication chain. After actual acceptance commit followed by lost acknowledgment or failed verification, Proposal correctly returns unconfirmed and protects itself. Nevertheless, a fresh canonical Review query reports no publication blockers, shared readiness reports Ready, and the canonical publication command writes an immutable HistoricalPlan batch. This prevents the required truthful protection-aware workflow under the task's existing-owner/UI-only authority.

No application code, permanent test, owner semantics, schema, dependencies or prior artifact was changed. Independent read-only capability review and validation were completed. Workflow layout implementation stopped before changes, as §16 requires; the new workflow is not complete.

## Continuation identity, governing sources, and baseline

This remains original Task 9.29, not 9.30 or 9.29.5. Preserve the history: original 9.29 blocked on publication replacement isolation; 9.29.1 resolved its contract; 9.29.2 repaired publication; first authorized continuation blocked on realization replacement isolation; 9.29.3 resolved acceptance-to-realization contracts; accepted COMPLETE 9.29.4 repaired those owners. This continuation consumes both accepted repairs without reopening their queue, lease, receipt or replacement designs.

The supplied second-continuation input was saved exactly at [CONTINUATION_2.md](TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_CONTINUATION_2.md). Sections 1–18 and its final completion statement were verified. The existing misspelled CONVERGECE / COTINUATION input matches it and remains unchanged. No already-executed second-continuation RESULT/evidence conflict existed at baseline.

Repository copies reviewed for applicable workflow contracts: original and first continuation inputs/blocked RESULTs; 9.29.4 RESULT, accepted ADR, immutable contract, regression matrix, reproduction guide and writer/consumer ledger; 9.29.2 RESULT/acceptance ADR and queue/terminal/currentness tests; 9.17 §§44–52 and capability/disposition ledger; 9.18 navigation; Product Ontology and governing Appendix B; 9.4 scope, 9.7 publication, 9.9 corrections, 9.14/9.15 Sleep; canonical G1/G2 evidence ADR; applicable 9.20/9.21/9.24–9.28 context and protection safeguards; durable compatibility/format and cross-storage restore ADRs; End-State Compatibility & Retirement specification, including parity gates. This is a bounded contract review, not an all-application safety audit. Exact source versions and inspected implementation files are pinned in [governing hashes](evidence/task-9.29-continuation-2/governing-source-hashes-RESULT.json).

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. No applicable AGENTS.md was found in the repository or checked ancestor directories. Baseline had 275 status entries. [Baseline hashes](evidence/task-9.29-continuation-2/baseline-hashes-RESULT.json) cover 1,546 existing tracked/unignored files, excluding pre-existing root node_modules; this is not a claim to hash installed dependencies or ignored build output. Exact [status](evidence/task-9.29-continuation-2/baseline-status-RESULT.txt), [HEAD](evidence/task-9.29-continuation-2/baseline-head-RESULT.txt) and [source/package archive](evidence/task-9.29-continuation-2/baseline-source-RESULT.tar.gz) were retained before task changes. The source archive captures the dirty local baseline, not merely HEAD.

Lazy boundaries remain unchanged: Review/Preview, Goal detail/Structure, Setup, day worksurface and planning/publication/materialization modules remain lazy. No package installation, format evolution, migration, retirement, commit or remote backup was performed.

## Demonstrated mandatory gap and exact ordering

The [reproduction guide](evidence/task-9.29-continuation-2/REPRODUCTION_AND_VALIDATION_RESULT.md), [isolated diagnostic source](evidence/task-9.29-continuation-2/protection-preflight-RESULT.test.ts), [final six-case log](evidence/task-9.29-continuation-2/protection-preflight-RESULT.log) and per-case observations retain the experiment.

1. Construct lawful saved Work, Sleep, Goal, Demand and full productive/support/buffer footprint through existing fixture/commands. Derive and record a fresh Proposal, generate a real Preview and query explicit September 17 Review scope. Canonical publication eligibility is initially healthy.
2. Accept the exact Proposal revision/preferred option using the actual durable adapter. The physical acceptance transaction commits. Inject only lost outward acknowledgment, absent outward acknowledgment after native completion, or one incomplete verification readback.
3. The repaired Proposal owner correctly returns `unconfirmed` (`commitStateUncertain` or `verificationFailedAfterCommit`), becomes protected and withholds runtime accepted adoption/automatic realization. Its original receipt is current. Complete accepted authority and all three claims physically exist.
4. Call queryPlanningReview again. The shared publicationBlockers result is empty and deriveScheduleReviewReadiness returns publicationReady=true. The fingerprint is unchanged from before acceptance. Protected Proposal state has become healthy-looking absence of accepted liabilities.
5. Call public publishScheduleRange with this **newly returned** fingerprint and exact range/time. It returns `published` with a current original receipt and creates one actual HistoricalPlan transaction. Exact exported batches survive fresh-store bootstrap; raw batch/day rows and Proposal authority remain unchanged across reopen.
6. Ordinary clear correctly rejects protection. Fresh bootstrap can validate the complete physically stored acceptance and expose one accepted allocation with exact original lineage and three claims. Explicit generation/query then returns the expected acceptedAllocationUnrealized blocker. No in-session protection unlock was attempted.

| Case                                                           | Review blockers before publish                        | Publication | Physical history transactions |
| -------------------------------------------------------------- | ----------------------------------------------------- | ----------- | ----------------------------- |
| Lost acceptance acknowledgment                                 | none                                                  | published   | 1                             |
| Missing acceptance acknowledgment after native completion      | none                                                  | published   | 1                             |
| Failed acceptance verification readback                        | none                                                  | published   | 1                             |
| Real known acceptance transaction abort (control)              | none, correctly no accepted authority                 | published   | 1                             |
| Accepted authority with denied realization admission (control) | acceptedAllocationUnrealized                          | rejected    | 0                             |
| Accepted authority with uncertain realization commit (control) | acceptedAllocationUnrealized + materializationFailure | rejected    | 0                             |

All six diagnostics pass by asserting observed current behavior, including the gap. They run the real adapter against disposable fake-indexeddb; they are not native-browser or mobile evidence. The registered HistoricalPlan adapter is shared with the counted persistence path. The early one-case exploratory counter watched a different adapter handle and incorrectly counted zero publication transactions; that instrumentation limit is retained and explicitly superseded by final six-case evidence. Initial missing-shift-cycle fixture failure is also retained, not reported as an application defect.

Current source explains the boundary: planningScopeQuery receives Proposal actionable/unrealized lists without their ingress qualification. Its accepted-liability projection cannot express this protected unknown. Shared publicationEligibility and the publication command reuse that evidence; the store's Sleep-authority materializer protection includes realization protection but not Proposal protection. Neither a current operation receipt nor a fresh fingerprint establishes that omitted evidence is healthy.

This affects §7 protected/unavailable accepted evidence and truthful readiness, §10 canonical Build admission, §11 uncertainty presentation, and regression groups 4/5/12/15. The missing qualification is also an evidence-contract limit, but the selected primary stop is **ARCHITECTURE DECISION REQUIRED** because correcting the actual canonical publication admission/protection behavior exceeds this task's authority. A UI-only extra blocker would duplicate policy forbidden by §7 and leave the canonical command behavior unchanged. No new blocker policy or proposed owner design was silently introduced.

This finding does not negate 9.29.2/9.29.4 replacement-isolation repairs, classify existing user records, prove data loss/corruption, or authorize history cleanup. The required next authority is bounded resolution of canonical Review/publication source qualification and protection admission for protected Proposal evidence. It is not authorization for a new global lock, persisted ledger, schema, migration or recovery permission.

## Independent capability review and remaining implementation

The [command/capability ledger](evidence/task-9.29-continuation-2/COMMAND_AND_CAPABILITY_LEDGER_RESULT.md) completes independent read-only review of constructive evaluation/accept/reject/persistence, automatic and explicit realization, generic Try/accept/remove/retry, first-class Sleep placement/revocation, publication, Event/Commitment/Work/Sleep/Goal editor handoffs, day/Summary return and replacement/profile boundaries. It records owner, exact target, asynchronous/write boundaries, result/currentness, replacement, existing tests and missing workflow evidence. Demonstrated, retained-test, source-inspected and unverified cases are separate. An unverified row is not an additional defect.

Before/after reachability is unchanged. Planner and Summary remain the two primary destinations. Existing Review panel, Preview and accepted-correction controls remain mounted with their responsibilities. No obsolete capability or module was retired. Advanced fields, static holidays, current setup, legacy Sleep conversion/readers, history/reporting and backup/recovery responsibilities remain retained.

Remaining workflow work is explicit, not inferred complete from owner repairs:

- Compact applied/invalid period context, deterministic initial scope and independent Calendar/G2/Activity/publication scopes; inclusive/exclusive helpers and one-day visual filter that cannot narrow Build.
- Shared truthful readiness, bounded offers separate from accepted liabilities, exact full-option decisions, original acceptance/realization receipts and supported fresh explicit retry without reacceptance.
- Bounded canonical repeated-Friction groups, selected exact occurrence, provisional Try/discard/explicit Accept, accepted-correction remove/retry, Sleep proof/geometry and existing source editors.
- Explicit reviewed Build with canonical eligibility, actual range/fingerprint, original receipt, synchronous duplicate-submit guard and truthful certainty outcomes.
- App-owned ephemeral Review drafts/selection/disclosures/focus/return context; late query/result association with owner/scope/source/replacement, separate Goal/Requested Time/Structure/Measurement/Observation/Setup drafts and existing save boundaries.

The [18-group requirement matrix](evidence/task-9.29-continuation-2/REQUIREMENT_EVIDENCE_MATRIX_RESULT.md) names retained permanent tests and every outstanding consumer/integration obligation. No permanent regressions were added because implementation stopped at the mandatory preflight gap. Existing owner suites were preserved and included in both full runs.

## Native/mobile, compatibility and evidence limits

The new workflow's production-browser gate at 320/390/768/1280 was **not run**. No new native action, minimum target measurement, overflow/focus/reduced-height certification or screenshot is claimed. Prior accepted repair evidence cannot certify the unimplemented workflow. Physical-device, OS-dialog, soft-keyboard, screen-reader and native-zoom behavior are unverified.

The mandatory disposable V14 export/import/re-export/reload dataset with **nonempty HistoricalPlan, Actual and independent Progress** was not delivered. The diagnostic verifies exact nonempty publication and accepted authority across bootstrap only; it has no such Actual/Progress round trip. The empty three-authority 9.29.4 native fixture is not substituted. These mandatory evidence gaps independently prevent COMPLETE and are consequences/limits of stopping implementation, not newly invented defects.

Application and package bytes are unchanged. No historical IDs/revisions/timestamps/optional fields/lineage/nested order or frozen records were edited. Final diagnostics compare exact original accepted records, exported history and raw rows across reopen, without broad sorting/normalization. Only a role-name set assertion sorts its derived list. No Dogfood state or protected user history was opened, cleared or rewritten.

## Actual validation and bundle results

Commands below ran from `code` except git diff --check from repository root. Baseline/final full suites ran with one worker; the final full suite ran without concurrent build/static jobs. No assertions, timeouts, selection, configuration or hard budgets were weakened. Formatting checks on unchanged code remain applicable because the full baseline inventory is preserved.

| Command                                                                                                    | Outcome                                                  | Retained evidence under evidence/task-9.29-continuation-2/ |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| Baseline npm run test -- --maxWorkers=1                                                                    | FAIL: 171/172 files, 1766/1767 tests; 188.11s            | baseline-tests-RESULT.log                                  |
| Baseline affected file: npm exec vitest -- run src/ui/tests/GoalRecordedInspection.test.tsx --maxWorkers=1 | PASS: 30/30                                              | baseline-affected-rerun-RESULT.log                         |
| npm exec prettier -- --check .                                                                             | PASS                                                     | format-check-RESULT.log                                    |
| npm run lint                                                                                               | PASS                                                     | lint-RESULT.log                                            |
| npm run typecheck                                                                                          | PASS                                                     | typecheck-RESULT.log                                       |
| Baseline npm run build                                                                                     | PASS                                                     | baseline-build-RESULT.log                                  |
| Baseline npm run check:bundle                                                                              | PASS hard gates, retained advisories                     | baseline-bundle-RESULT.log                                 |
| Final npm run build                                                                                        | PASS                                                     | build-RESULT.log                                           |
| Final npm run check:bundle                                                                                 | PASS hard gates, same advisories                         | bundle-RESULT.log                                          |
| Final npm run test -- --maxWorkers=1                                                                       | FAIL: 171/172 files, 1766/1767 tests; 179.70s            | tests-RESULT.log                                           |
| Final affected file: npm run test -- src/ui/tests/GoalInspectionNavigation.test.tsx --maxWorkers=1         | PASS: 4/4                                                | final-affected-rerun-RESULT.log                            |
| Isolated protection diagnostic via retained config                                                         | PASS: 6/6, reproduces gap                                | protection-preflight-RESULT.log                            |
| Task-created report/diagnostic formatting and check                                                        | PASS; exact files in log, saved immutable input excluded | task-format-RESULT.log, task-format-check-RESULT.log       |
| git diff --check                                                                                           | PASS                                                     | diff-check-RESULT.log                                      |

Baseline GoalRecordedInspection could not find its expected label in the real reporting/Daily Planner return case. Final GoalInspectionNavigation failed expected focus after G2 → Daily Planner → report → Back: focus was on the selected Goal heading rather than accepted-planning heading. Both affected files passed unchanged in isolation. These reruns do **not** convert either full-suite result to PASS or establish root cause. The two full runs remain non-green validation limits. No new owner gap is inferred from these unrelated UI failures, and no assertion was weakened to hide them.

| Metric                  | Actual baseline | Actual final | Delta |             Hard maximum |
| ----------------------- | --------------: | -----------: | ----: | -----------------------: |
| Initial raw JavaScript  |         638,327 |      638,327 |     0 |                  685,000 |
| Initial gzip JavaScript |         167,653 |      167,653 |     0 |                  170,000 |
| Largest lazy chunk      |          62,652 |       62,652 |     0 |                  100,000 |
| Total JavaScript        |       1,294,546 |    1,294,546 |     0 | Existing advisory policy |
| Initial gzip headroom   |           2,347 |        2,347 |     0 |                        — |

Existing initial-gzip advisory above 161,500 and total-JavaScript architecture-review advisory above 825,000 remain. Thresholds were not raised and dependencies were not installed.

## Artifact inventory, preservation and readback

[File manifest](evidence/task-9.29-continuation-2/FILE_MANIFEST_RESULT.md) identifies every task-created file and purpose. [Preservation comparison](evidence/task-9.29-continuation-2/preservation-RESULT.json) verifies all 1,546 baseline files unchanged, no missing files and unchanged HEAD; this includes prior blocked executions, accepted contracts/ADRs/repairs, evidence, application/permanent tests and package files. New files are confined to the exact input/RESULT and this task's evidence directory. Accepted immutable contracts remain hash-pinned. Existing root node_modules remains outside the baseline hash inventory; it was not installed or changed by this work.

Artifacts are retained locally in the repository workspace, not exclusively in /tmp. No commit or remote backup is claimed. [Readback](evidence/task-9.29-continuation-2/readback-RESULT.json) verifies this actual RESULT path, heading, determination, final completion statement, referenced artifact existence and exact saved input identity. No prior RESULT was edited into a different conclusion.

**Task 9.29 — Planner / Review Schedule Workflow Convergence V1 remains PARTIAL/BLOCKED for the reasons documented in the Authorized Continuation 2 RESULT.**

**The task is complete when users can review an explicit period, make existing constructive and corrective decisions, understand accepted versus scheduled work, and explicitly build the reviewed schedule within Planner—while preserving repaired acceptance/realization/publication boundaries, truthful outcomes, drafts, history, compatibility, mobile usability, and the two-primary-destination layout.**
