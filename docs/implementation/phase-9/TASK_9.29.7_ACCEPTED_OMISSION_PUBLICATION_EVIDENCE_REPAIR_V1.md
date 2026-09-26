# Task 9.29.7 — Accepted Omission Publication Evidence Repair V1

**Status:** READY — BOUNDED CANONICAL CORRECTION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Existing Omission Evidence Handoff, Historical Materialization, and End-to-End Regression Repair
**System:** DayFrame
**Parent Task:** Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — PARTIAL/BLOCKED
**Prerequisite:** Authorized Continuation 3 RESULT reviewed; stop determination accepted and partial implementation retained
**Implementation Authority:** Narrow repair of the existing generation/replay-to-publication evidence path
**Runtime Evidence Authority:** Minimum typed ephemeral plumbing needed to supply already-defined current omission context
**New Domain / Scheduling / Reporting Semantics Authority:** NONE
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**New Recovery / Historical-Correction Authority:** NONE
**Broad Workflow Redesign / Capability Retirement Authority:** NONE

---

## 1. Objective

Repair the demonstrated failure in this existing workflow:

```text
Exact Routine conflict
→ supported Skip Try
→ explicit corrective Accept
→ saved-state regeneration
→ current qualified Review
→ explicit Build this Schedule
→ durable omitted planning evidence
```

The accepted omission must continue suppressing its exact occurrence from scheduling while retaining sufficient canonical context for publication.

The repair must preserve the distinction between:

- An accepted planning omission.
- An occurrence that never existed or cannot be resolved.
- A provisional Try.
- A scheduled occurrence.
- A reported skipped outcome.

Publication of an omission must not create Actual, Progress, attendance, duration, or completion evidence.

This task repairs the existing capability. It does not complete the parent Review workflow or introduce a new omission policy.

---

## 2. Task Identity and Preserved History

Confirm no conflicting executed Task 9.29.7 exists. Do not overwrite or silently renumber a conflict.

Preserve all four blocked parent executions:

1. Original 9.29.
2. First authorized continuation.
3. Authorized Continuation 2.
4. Authorized Continuation 3.

Preserve the accepted 9.29.2, 9.29.4, and 9.29.6 repairs, their contracts/ADRs, and every earlier RESULT and diagnostic.

Continuation 3 contains useful implementation. Its Review workspace, navigation/context, bounded displays, original-result handling, and named focus/query fixes remain part of the starting application.

Do not revert that work because its overall task remains blocked.

Save this input separately:

`docs/implementation/phase-9/TASK_9.29.7_ACCEPTED_OMISSION_PUBLICATION_EVIDENCE_REPAIR_V1.md`

Verify Sections 1–18 and the final completion statement before execution.

No fourth workflow continuation is authorized by this correction task.

---

## 3. Governing Inputs and Exact Producer/Consumer Map

Read the actual repository copies of:

- Authorized Continuation 3 input and RESULT.
- Its `CORRECTION_PUBLICATION_GAP_RESULT.md`, canonical diagnostic/configuration, observation JSON, source hashes, and native reproduction notes.
- Its command/capability/regression map and validation history.
- Task 3.4 — Historical Execution Target Materialization RESULT and the governing historical-snapshot/reference contracts.
- Current PlanDecision acceptance, replay, removal, occurrence-identity, and generation contracts.
- Current HistoricalPlan materialization, validation, publication, and fingerprint contracts.
- Accepted source-qualification ADR and Task 9.29.6 RESULT/tests.
- Accepted publication and acceptance-to-realization ADRs and relevant permanent regressions.
- Relevant first-class Sleep, Goal-link provenance, G1/G2/Activity, backup, compatibility, and retirement contracts.

Trace current equivalents of:

- Canonical occurrence expansion and Preview generation.
- `replayPlanDecisions`.
- `createPlanDecisionAcceptanceCandidate` and corrective acceptance.
- `historicalExecutionTarget`.
- `materializePlanPublication`.
- The qualified-materialization adapter.
- Review V2 and public publication.
- Current historical readback and backup serializers.

Record actual paths, input/output types, and exact branch conditions.

Treat Task 3.4 as historical evidence of supported semantics—not proof that its original inputs still reach today’s implementation or authority to extend current reporting permissions.

Do not reconstruct the missing candidate from the task’s prose.

---

## 4. Baseline, Partial-Work Preservation, and Reconnection

Before application changes:

- Record HEAD, exact working-tree status, and applicable repository instructions.
- Capture task-relative hashes and relevant source copies.
- Identify retained Continuation 3 changes explicitly.
- Pin governing source versions.
- Run current validation and bundle baselines.

The dirty working tree—not HEAD alone—is the executable baseline.

Continuation 3 reported a 1,801-file baseline, twenty modified baseline source/test files, and six new source/test files, all under `code/src/ui/`. Those are historical measurements; capture the current tree.

Preserve unrelated work and all previous inputs, RESULTs, contracts, observations, and evidence.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable fixtures, databases, profiles, and origins.

If execution is interrupted, compare against the original task baseline and recorded changes before resuming. Do not assume an interrupted test finished or replace the baseline with the partially edited tree.

---

## 5. Focused Contract Reconciliation Before Editing

Write a bounded pre-edit record:

`evidence/task-9.29.7/CONTRACT_RECONCILIATION_RESULT.md`

Identify every field the current omitted-target materializer actually requires:

| Required datum | Canonical producer | Available before replay | Available after replay | Current consumer | Proposed handoff |
|---|---|---|---|---|---|

Include exact occurrence identity/lifetime, applied decision identity, canonical owner day, display/context fields, and any other fields required by current validators.

Do not assume that the entire original candidate must be retained if a smaller existing representation supplies complete evidence.

Resolve whether the defect is:

- Existing evidence not passed to its consumer.
- Current-generation evidence discarded during replay.
- An incorrect consumer lookup.
- A genuinely unavailable semantic fact.

### Authority granted

When existing semantics and current canonical inputs are sufficient, implement the smallest repair in this task.

Minimum internal typed evidence changes are authorized when they preserve already-defined omission meaning and remain derived, nonpersistent, and subject to current freshness/lifetime rules.

Changing an internal interface to carry existing facts is not automatically a new architecture decision.

### Authority not granted

If success requires a new historical claim, reporting rule, durable field, identity policy, or unsupported reconstruction, stop before that change.

Identify the exact missing datum and minimum proposed decision. Do not invent it or self-approve a new contract.

A pure existing-contract repair does not require another proposal-only task or an ADR pretending new semantics were adopted.

---

## 6. Reproduce the Existing Failure Before Repair

Reuse the retained canonical reproduction without overwriting its source or observations.

Establish:

1. Otherwise eligible initial publication.
2. A real conflict involving the exact Routine occurrence.
3. Canonical Try and correction-candidate mapping.
4. Explicit acceptance through the existing PlanDecision command.
5. Fresh regeneration using saved state.
6. The applied exact omission and absence of its scheduled occurrence.
7. Current Review V2 with qualified sources, allocatable Sleep, and no unresolved Friction.
8. Materializer refusal and public `materializationFailure`.
9. Zero historical mutation attempts and created transactions.

Record the actual candidate/replay/materializer inputs at the missing handoff.

Keep canonical reproduction independent of React. Do not mock successful materialization or bypass readiness.

Also retain a healthy no-omission control.

The reported errors are reproduction targets, not labels to preserve after successful repair:

```text
inconsistentPlanContext
planDecision:insufficientHistoricalContext
```

Count adapter calls and physical transactions separately.

Use fresh attempt-scoped logs. Old defect-confirming observations remain historical evidence.

---

## 7. Canonical Evidence Repair

Restore the omitted occurrence’s defensible context at the existing canonical boundary.

Prefer passing or preserving evidence already produced by the same fresh generation/replay operation.

The implementation may retain a read-only pre-suppression occurrence context or reuse an existing equivalent representation, provided the contract reconciliation establishes every required field and its provenance.

Do not:

- Put omitted occurrences back into schedulable or occupancy collections merely to satisfy lookup.
- Recreate their identity from a title, row index, fix ID, or geometry.
- Borrow a candidate from an earlier Try or unrelated Preview.
- Resolve a different occurrence because it looks similar.
- Fabricate a scheduled interval.
- Persist Preview or introduce an omission-history store.
- Rebuild the candidate in React.

Obtaining current occurrence evidence through existing canonical generation from captured saved state is permitted.

Pretending that today’s regeneration recovers a past title, placement, or decision-time snapshot is not.

Bind retained evidence to the same source lifetime, occurrence coordinate, generation context, and applicable replay decision.

Do not mutate shared original candidates while replaying later decisions.

The evidence path must work after a fresh reload and explicit regeneration, not only while a pre-Try object remains in memory.

---

## 8. Omission Meaning, Identity, and Snapshot Fidelity

An omission represents an applicable accepted instruction suppressing an occurrence from the current plan.

It must not imply that the user actually skipped, completed, missed, or spent zero minutes on that activity.

Preserve exact canonical occurrence identity, source incarnation, owner day, decision applicability, and existing snapshot provenance.

An omitted planning snapshot has no scheduled interval. Do not use a former Try position, window boundary, midnight, or zero-length interval as replacement geometry.

Use existing canonical helpers for day-boundary and offset context. Do not introduce browser-local date slicing or a new timezone policy.

Select replay evidence through exact supported identity, not array order.

Current publication freezes defensible current planning context. It does not certify what mutable source fields were at an earlier acceptance time.

Inspect and preserve current precedence when omission interacts with other supported decisions. Do not change replacement, supersession, duration, priority, or placement semantics to make the case pass.

Do not extend omission to Work, fixed Events, first-class Sleep, realized Goal work, Support, or Buffer unless already supported by their existing contracts. This task grants no new family eligibility.

Historical materialization support alone does not authorize new reporting controls.

---

## 9. Review, Materialization, and Source Freshness

Use one canonical omission-evidence path for qualified dry and actual materialization.

Do not repair the Review dry run while leaving Build on a different input path, or vice versa.

Preserve Review V2 source qualification, record-family coverage, coherent historical reads, private witnesses, and tagged runtime fingerprint behavior.

Any added derived evidence must be captured and invalidated with its actual canonical sources.

Trace whether the existing semantic fingerprint and observation mechanism already cover those inputs. Add only the directly necessary propagation; do not invent a new freshness policy.

Source changes, removal of the decision, regeneration, profile loading, or replacement must not leave an old omission witness eligible.

The public command retains its existing asynchronous and final physical-admission checks.

Do not change publication queueing, leases, terminal receipts, commit certainty, or stored fingerprint algorithms.

A materialized candidate is not published authority. Only the existing explicit publication operation may persist it.

Do not call the legacy frozen-batch API from Build to bypass the corrected path.

---

## 10. Scope and Coexistence

A single accepted omission affects its exact occurrence, not every recurrence of the same source.

Verify behavior across repeated occurrences, overlapping generation windows, and a non-midnight User Day.

Publication range and local display filters retain their existing distinction. An omitted target belongs to the appropriate published owner day under current policy.

Evidence retained for omitted occurrences must not:

- Reintroduce their occupancy.
- Duplicate another scheduled or unplaced occurrence.
- Change unaffected Friction.
- Change accepted Allocation claims or realized roles.
- Consume Capacity as newly scheduled work.
- Remove required Sleep or its protection.

Use a fixture containing accepted and realized productive, support, and protected facts alongside the omitted Routine.

Preserve exact first-class Sleep geometry and publication evidence. This task does not repair unrelated Sleep correction workflows or permit Sleep omission.

Exercise existing neighboring materialization branches—scheduled, unplaced, blocked, and other supported correction results—as regression controls.

A newly discovered independent defect is reported separately, not silently absorbed.

---

## 11. Historical Readback, Removal, Reload, and Backup

A successful fresh publication must contain the exact omitted planning entry under the existing supported snapshot representation.

Verify complete batch/day readback through the actual HistoricalPlan owner and durable storage.

Do not claim success from a button message or candidate object alone.

Retain existing duplicate/no-op behavior for an identical reviewed schedule.

Explicit removal or lawful replacement of the accepted omission affects future regeneration only. Verify the next generated result under existing rules; do not assume it must be conflict-free or placed.

A later publication must not rewrite an earlier omitted or scheduled snapshot.

Preserve existing Actual and Progress attached to prior historical evidence.

For backup/reload:

- Export accepted decisions and published omission through actual V14.
- Import into a distinguishable disposable destination.
- Re-export and reload.
- Compare exact included authority.
- Explicitly regenerate from restored saved state and retained decisions.
- Verify the omission still materializes without an old in-memory Preview.

Preview remains disposable. Its absence after reload is not permission to invent history or generate implicitly during a read.

Preserve supported older readers, serializers, identity rules, optional absence, and historical interpretation.

No schema, snapshot version, migration, or durable evidence field is authorized.

---

## 12. Safe Failure and Narrow Consumer Integration

Keep fail-closed behavior for genuinely missing, stale, mismatched, unsupported, protected, or unqualified evidence.

A durable reference resolving by itself is insufficient.

Test rejection when the decision and candidate come from different lifetimes or generation contexts, when source/occurrence identity no longer resolves, and when necessary context is absent.

These cases must not be converted into omitted snapshots simply because an omission-like record exists.

Preserve Try-only and stale-generation restrictions.

Do not hide a failed omission by dropping its occurrence from publication while reporting overall success.

Current Review feedback must continue consuming canonical results. No UI-only exception to a materialization blocker is authorized.

Minimal consumer/type/test changes directly required by the repaired evidence handoff are permitted. Broad layout changes, additional editors, and unfinished parent-task features are not.

Preserve current original-result receipts, sourceIssues, duplicate-submit guards, unrelated drafts, and return focus.

Materialization, publication, and corrective acceptance retain their separate effects.

---

## 13. Permanent Regression Matrix

Add permanent repaired-behavior evidence for:

1. The original canonical conflict → Skip Try → Accept → regenerate → publish reproduction.
2. Healthy no-omission publication.
3. Fresh accepted omission producing exactly one omitted historical occurrence and no scheduled interval.
4. Target occurrence absent from scheduling/occupancy while unaffected occurrences remain unchanged.
5. Try without acceptance and discarded Try creating no durable omission.
6. Missing, stale, Try-only, mismatched, and unsupported context retaining appropriate refusal and zero history writes.
7. Source deletion/recreation and exact lifetime mismatch without retargeting.
8. Multiple occurrences of one source: only the exact accepted target omitted.
9. Canonical User Day and range identity under non-midnight boundaries and overlapping generation windows.
10. Supported decision precedence/removal followed by fresh regeneration, without replaying stale omission evidence.
11. Existing scheduled/unplaced/blocked and non-omission correction branches retaining their semantics.
12. Required Sleep and accepted/realized productive/support/protection facts unchanged.
13. Read-only materialization leaving authored state, decisions, execution, Progress, and persistence untouched.
14. Public publication’s exact durable readback, existing no-op behavior, and immutable prior history.
15. Source/qualification change after Review but before physical admission rejecting through existing guards.
16. Reload and V14 round trip retaining exact omission/decision/history while requiring fresh generation where appropriate.
17. Existing historical/Activity consumers distinguishing omitted planning from reported skipped outcomes without new reporting permission.
18. The retained Review workspace exercising the repaired ordinary path without reconstructing evidence locally.

Use canonical commands or validated builders for semantic proof. Include at least one permanent test through the actual store, generation, materializer, and storage path.

Do not rely exclusively on manually assembled materializer fixtures that already contain the missing candidate.

Count writes separately by owner and preserve exact side-effect assertions.

Retain all accepted lifecycle, source-qualification, Sleep, Goal, G1/G2, Progress, restore, and compatibility suites.

Do not rewrite historical diagnostics or weaken valid refusal assertions merely because the new positive case now succeeds.

---

## 14. Production Browser and Mobile Acceptance Gate

Use the production build, disposable state, and the retained Review workspace.

At each width:

`320px, 390px, 768px, 1280px`

Exercise the narrow repaired workflow:

- Open an actual Routine conflict.
- Select its exact supported Skip fix.
- Try and inspect it.
- Explicitly accept.
- Reach fresh saved-state regeneration through the existing lawful handler or explicit Generate control.
- Inspect current qualified Review.
- Build through the ordinary interface.
- Read back the exact omitted historical entry.
- Navigate away and return while preserving an unrelated draft.

Do not require an extra generation click if the existing acceptance handler already performs lawful regeneration. Prove the resulting state, not an invented interaction.

Across retained native evidence also demonstrate Try/discard, subsequent explicit correction removal, and actual V14 export/import/re-export/reload.

Use a nonempty fixture containing HistoricalPlan, Actual, independent Progress, and realized productive/support/protection evidence. Compare unaffected authorities exactly.

Supporting canonical seeding may establish the conflict and independent data. It must not substitute for the omission acceptance or publication actions being certified.

Require measured approximately 44px primary targets, no unintended document overflow, visible keyboard focus, semantic/non-color-only feedback, usable reduced-height/reflow behavior, and predictable return focus.

No required hover, dragging, double-click, or right-click. Do not clip content to pass.

Separate browser actions, direct readback, controlled fault seams, DOM measurements, and source inspection.

This certifies the corrected omission path—not the parent task’s entire unfinished workflow matrix.

---

## 15. Validation and Bundle Gate

Authorized Continuation 3 reported:

| Measure | Historical value |
|---|---:|
| Test files / tests | 178 / 1,831 |
| Initial raw JavaScript | 641,793 bytes |
| Initial gzip JavaScript | 169,064 bytes |
| Largest lazy chunk | 62,700 bytes |
| Total JavaScript | 1,330,178 bytes |
| Initial-gzip headroom | 936 bytes |

Measure actual current before/after values.

The continuation’s own baseline gzip was 169,047 bytes; the earlier 9.29.6 delivery reported 169,082. Do not infer a cause or cross-execution improvement from those differing measurements.

Preserve initial gzip ≤170,000 bytes, initial raw ≤685,000 bytes, largest lazy chunk ≤100,000 bytes, and all other repository hard gates.

Measure early. Keep historical/materialization logic behind existing lazy boundaries. Do not weaken evidence or introduce broad restructuring to fit the budget.

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

Confirm build/static/native jobs have finished before the final complete suite.

Report exact commands, working directories, final outcomes, source/build hashes, and all material intermediate failures.

Fix demonstrated task-introduced defects without weakening assertions, timeouts, configuration, or selection.

Do not repeatedly rerun solely to find a pass or assign unsupported causes to failures.

A final failed suite, unhandled error, incomplete mandatory browser gate, or exceeded hard budget prevents COMPLETE.

---

## 16. Exclusions and Stop Conditions

Do not introduce new omission eligibility, recurrence rules, scheduling policy, reportability, historical reconstruction, or snapshot semantics.

No automatic acceptance/publication, bulk correction, silent decision retirement, scheduled-time release, Goal lifecycle, recurrence expansion, Found Time, or Progress inference.

No new durable store, saved Preview, schema/version/migration, dependency, recovery permission, global locking, or capability retirement.

No publication bypass, validator relaxation, fake geometry, current-title fallback for unknowable past context, or UI-local candidate reconstruction.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when the exact required fact cannot be established from existing lawful current-generation evidence.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when repair requires a new semantic claim, durable representation, identity rule, or changed authority boundary.

Name the missing field, its intended meaning, current producer/consumer, why available evidence is insufficient, and the smallest proposed decision.

Do not self-adopt that proposal or mark an unimplemented design as repair completion.

Conversely, do not stop merely because a narrow internal producer/consumer interface needs to carry already-defined facts; that repair is expressly authorized.

---

## 17. RESULT, Retained Evidence, and Parent Resumption

Write:

`docs/implementation/phase-9/TASK_9.29.7_ACCEPTED_OMISSION_PUBLICATION_EVIDENCE_REPAIR_V1_RESULT.md`

Retain evidence under:

`docs/implementation/phase-9/evidence/task-9.29.7/`

Additional reports, logs, screenshots, exports, measurements, and QA artifacts must contain RESULT in their filenames. Application/test source retains repository conventions.

Include:

- Governing sources and task-relative baseline.
- Pre-edit contract reconciliation and exact missing-data map.
- Reproduced failure and selected narrow correction.
- Final producer/consumer path and current-generation provenance.
- Identity, omission-state, freshness, and scheduling-exclusion evidence.
- Permanent regression matrix.
- Actual native workflow and durable omitted-record readback.
- Nonempty V14/reload comparisons.
- Full validation and before/after bundle metrics.
- Every created/modified file and purpose.
- Preservation of partial UI, history, compatibility, and forensic state.
- Any remaining limitation and precise parent-task resumption checklist.

Give every material execution attempt a distinct log filename. Copy and hash logs before another run can replace them.

Continuation 3’s first Move-timeout full log is unavailable. Preserve that disclosed limitation; reconstructed notes are not the original log.

Compare exact IDs, revisions, times, optional absence, lineage, nested order, and frozen records. Only documented contractually unordered collections may be compared by canonical key.

Distinguish local evidence from commits or remote backups. Do not rely exclusively on `/tmp`.

Read back the actual RESULT and verify path, heading, determination, and final statement.

After this repair is reviewed, original Task 9.29 requires a separately authorized Continuation 4 with distinct input/RESULT paths.

Preserve all four blocked executions and the retained UI. The unfinished broader certainty/lifecycle matrix, exhaustive result-presentation audit, contextual return, Sleep correction, and complete workflow/mobile gates still require acceptance.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.29.7 — Accepted Omission Publication Evidence Repair V1 is COMPLETE. The existing canonical omission-to-publication path is repaired; Task 9.29 workflow convergence remains pending separate continuation and acceptance.**

or:

**Task 9.29.7 — Accepted Omission Publication Evidence Repair V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when an exact supported omission accepted through the ordinary corrective workflow survives fresh regeneration and can be explicitly published with defensible canonical context and exact durable identity—without rescheduling the omitted occurrence, inventing geometry or outcomes, weakening missing-evidence refusal, rewriting history, or discarding the retained Review implementation.**