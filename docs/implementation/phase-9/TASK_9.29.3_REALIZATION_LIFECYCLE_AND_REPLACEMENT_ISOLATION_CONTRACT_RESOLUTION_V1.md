# Task 9.29.3 — Realization Lifecycle & Replacement Isolation Contract Resolution V1

**Status:** READY — CONTRACT RESOLUTION ONLY
**Phase:** Phase 9 — Product Convergence
**Task Type:** Bounded Realization Lifecycle, Acceptance Handoff, Physical-Write Safety, and Replacement Coordination Contract
**System:** DayFrame
**Parent Task:** Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — PARTIAL/BLOCKED
**Architecture Work Authority:** Produce one concrete proposed contract for review
**Architecture Adoption Authority:** NONE
**Application / Existing Test Implementation Authority:** NONE
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**New Recovery / Historical-Correction Authority:** NONE
**Capability Retirement / Module Removal Authority:** NONE

---

## 1. Objective

Resolve the realization-owner replacement gap demonstrated during the authorized Task 9.29 continuation.

Define how both:

- Automatic realization following an accepted Proposal.
- A fresh explicit retry of a retained Accepted Allocation.

remain safe across whole-authority clear, restore, abort, rollback, and recovery boundaries.

The contract must prevent displaced realization work from writing scheduled facts, installing stale runtime authority, or reporting current success after replacement.

Preserve the existing separation between acceptance and realization, exact accepted geometry and lineage, current foundation/occupancy checks, idempotence, and supported durable data.

Deliver one decision-ready proposal and one bounded repair handoff.

Do not implement the repair or resume Review workflow development during this task.

---

## 2. Checkpoint, Identity, and Historical Integrity

The original 9.29 execution stopped on publication isolation.

Task 9.29.1 resolved that contract, and Task 9.29.2 implemented the accepted bounded publication repair.

The authorized 9.29 continuation now reports a separate realization gap before workflow implementation.

Preserve all of those inputs, RESULTs, proposals, acceptance records, diagnostics, and observations unchanged.

The accepted publication repair is not reopened. Its infrastructure may be reused where applicable, but its guarantee does not extend to realization by implication.

Task 9.29 remains PARTIAL/BLOCKED. This task's completion will not mean its interface is ready.

Confirm no conflicting executed Task 9.29.3 exists. Do not overwrite or silently renumber a conflict.

Verify this immutable input contains Sections 1–18 and the final completion statement.

---

## 3. Governing Inputs

Read actual repository copies of:

1. The blocked 9.29 authorized-continuation RESULT and its exact continuation input.
2. Its realization diagnostic, five-case log, four observations, source hashes, command map, and requirement matrix.
3. Original 9.29 input and publication-blocked RESULT.
4. Publication acceptance ADR, immutable proposed contract, and accepted 9.29.2 RESULT.
5. Task 9.3 — Accepted Allocation Realization V1 RESULT and governing realization architecture.
6. Tasks 9.2, 9.2.1, and 9.2.2 acceptance, complete-footprint, and scheduled-identity contracts.
7. Current Proposal/Accepted Allocation persistence, automatic-realization callback, and explicit retry contracts.
8. Relevant first-class Sleep foundation/occupancy and current realization integration.
9. Accepted Structure owner-safety ADR and 9.27.2 RESULT.
10. Cross-storage restore, runtime transaction, durable compatibility/versioning, and End-State Compatibility & Retirement specifications.

Inspect current realization, Proposal orchestration, storage, controller, restore participants, bootstrap, and result consumers.

Current working-tree code establishes executable behavior. Accepted architecture establishes normative meaning. Older RESULTs establish bounded historical evidence, not universal concurrency guarantees.

Do not substitute the old realization RESULT for inspection of current code.

---

## 4. Baseline and Protected Evidence

Record HEAD, working-tree status, applicable repository instructions, source versions, and a task-relative preservation baseline.

The continuation reported 255 status entries and 1,359 baseline files. Measure the current values rather than copying those counts.

No existing production, permanent-test, configuration, architecture, task, or historical-evidence file may be modified.

Only new proposal, RESULT, and isolated diagnostic/evidence artifacts are authorized.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable fixtures, database factories, storage, origins, and profiles.

Diagnostic extensions belong outside normal test discovery and the production graph. They do not become permanent repaired-behavior tests in this task.

---

## 5. Reproduce the Four Exact Unsafe Orderings

Reuse the continuation's retained diagnostic without overwriting its source or observations.

Preserve these independent paths:

```text
Accepted Proposal → automatic realization → full clear
Accepted Proposal → automatic realization → V14 restore
Explicit realization retry → full clear
Explicit realization retry → V14 restore
```

Retain the healthy control.

For each case, capture:

- Exact accepted authority and realization target.
- Phase at which the write is paused.
- Replacement result and epoch.
- Accepted allocations, runtime facts, and physical rows before release.
- Mutation attempts versus physical transactions actually created.
- Late outer and inner command outcomes.
- Exact runtime and durable rows after settlement.
- Independently reopened authority and startup protection.

Forward original rows and adapter arguments through the delay. Do not fabricate acceptance, bypass eligibility, or mock storage success.

The retry fixture must establish retained acceptance through its actual earlier failure, not create another acceptance.

Distinguish outer `accepted` from inner realization success. An acceptance committed before replacement is a historical operation outcome; it is not proof that scheduling succeeded or remains current.

The diagnostic demonstrates the reported ordering, not native incidence or affected-user prevalence.

---

## 6. Operation Inventory and Bounded Review Coverage Ledger

Trace realization from actual entry to final result:

- Public/direct retry and lazy dispatch.
- Acceptance orchestration and automatic callback.
- Initialization.
- Accepted Allocation resolution.
- Existing realization lookup.
- Foundation and occupancy evidence.
- Candidate/fact staging.
- Storage opening, admission, transaction, and settlement.
- Runtime adoption, freshness invalidation, notification, and returned result.

Inventory all realization writes/installations, including public clear/replacement, restore, rollback, startup recovery, and asynchronous reads with protection effects.

### Review replacement-coverage ledger

Add a read-only ledger for the write entry points already within Task 9.29:

- Proposal decision persistence and post-acceptance handoff.
- Realization and explicit retry.
- Existing corrective acceptance/removal/retry, including Sleep.
- Repaired publication.
- Contextual editor handoffs at the point Review delegates to them.

For each identify the exact owner, asynchronous/write boundary, replacement participation, existing regression evidence, and evidence limits.

Use classifications such as:

- Demonstrated under a named ordering.
- Source-inspected only.
- Not yet verified.
- Demonstrated independent gap.

Do not label another owner defective merely because it uses a different mechanism or lacks a similarly named callback.

This ledger is a sequencing safeguard, not an all-application audit or implementation authorization. Continue independent read-only coverage after a finding instead of hiding the remaining scope.

---

## 7. Preserve the Acceptance–Realization Boundary

Keep two distinct durable operations:

```text
ProposalDecision / Accepted Allocation commits
→ separate realization attempt
→ complete Realization and fact set commits
```

A failed or conflicted realization does not erase valid acceptance.

A later explicit whole-authority clear or restore may remove that acceptance under its existing contract. Realization cannot recreate it afterward.

Define exactly how automatic realization inherits the originating operation lifetime across:

- Acceptance revalidation.
- Acceptance persistence and runtime adoption.
- Any awaited callback dispatch.
- Entry into the realization owner.

Do not capture a fresh lifetime only when an old automatic callback finally runs after replacement.

Separately define fresh explicit retry of an acceptance that is currently present.

Restoring identical acceptance IDs and bytes does not renew a displaced automatic continuation. A genuinely new explicit command may inspect and act on current restored authority under normal eligibility.

Do not make acceptance and realization one transaction, add compensating rejection, or auto-reaccept missing lineage.

Inspect the acceptance persistence boundary sufficiently to distinguish an already-committed handoff from an earlier operation still writing. Do not assume all Proposal phases are safe or defective from the current reproduction alone.

---

## 8. Select One Realization-Specific Ordering

Choose one concrete phase model for:

- Entry and lifetime capture.
- Preparatory reads or lazy loading.
- Execution admission.
- Current acceptance/foundation/occupancy checks.
- Staging.
- Physical transaction.
- Settlement and runtime adoption.
- Result delivery.

State exactly when replacement can win and invalidate old intent, and when it must return busy before snapshots or staging.

Inspect existing same-owner concurrency behavior before selecting serialization, joining, rejection, or queueing rules.

Do not copy publication's queue simply because it exists.

Resolve:

- Two attempts for the same Accepted Allocation.
- Automatic attempt plus simultaneous explicit retry.
- Two distinct accepted allocations.
- An operation waiting while another settles.
- Replacement between operations.
- A newly invalid foundation or occupancy witness during preparation.

Deterministic IDs are necessary identity evidence, not proof against duplicate transactions or stale whole-authority installation.

Select outcomes explicitly. Do not leave cancellation, blocking, replay, or queue policy to the repair task.

The scope remains one registered store/owner composition in one live realm unless separately authorized.

---

## 9. Physical Admission, Terminal State, and Runtime Adoption

Use the existing post-open storage-admission and native-terminal infrastructure where compatible with realization.

Specify exact checks immediately before physical transaction creation, with no intervening asynchronous gap:

- Operation lifetime and owner instance.
- Current epoch/generation.
- Active operation/exclusion identity.
- Ordinary admission and protection.
- Exact currently resolved acceptance.
- Required source/foundation/occupancy witness.

Keep current-schedule validity distinct from replacement identity.

Define what happens if saved Work, Sleep placement, fixed/manual facts, or another realization changes the relevant occupancy while preparation awaits. Preserve exact accepted geometry; do not repair by moving or replanning.

A created transaction must reach its actual terminal state before its replacement exclusion can end.

A thrown/lost acknowledgment is not cancellation. A terminal receipt is not automatically verification of the complete realization set.

Specify the required complete-set verification or existing evidence needed before runtime adoption.

Prevent a delayed precomputed authority array from overwriting other current realizations or installing over replacement state.

No post-commit check can undo a durable write. No timeout, ignored promise, or UI cancellation establishes physical safety.

---

## 10. Coordinator Integration and Cross-Owner Ordering

Specify integration with the existing before-snapshot controller boundary alongside Structure and HistoricalPlan.

No owner may start an ordinary write through a snapshot callback after replacement has closed admission.

No coordinator may begin replacement and then wait on work that itself needs ordinary admission reopened.

Define busy, protected, admitted, aborted, rollback, and recovery-required outcomes for:

- Full clear.
- Modern complete restore, including V14.
- Exposed/internal controller begin.
- Direct realization clear/replacement where supported.
- Runtime installation.
- Rollback.
- Startup recovery.

Retain private coordinator capabilities and matching epochs. Legitimate restore writes must not require ordinary inactive-transaction admission.

Successful, failed, and partial full-clear outcomes keep their existing meaning; this task does not propose making full clear journaled or atomic.

Define combined behavior when realization and publication or Structure are simultaneously outstanding.

Do not broaden publication's queue, clocks, terminal-settlement semantics, or protected recovery permissions.

An owner being a snapshot participant is not evidence that its outstanding operations are quiescent.

---

## 11. Outcomes, Idempotence, and Safe Retry

Inspect actual current result unions and propose exact mappings for:

- Realized with complete current evidence.
- Already realized in the current lifetime.
- Conflict or incomplete/inapplicable accepted footprint.
- Invalid acceptance or lineage.
- Known pre-write denial.
- Busy or displaced operation.
- Known atomic abort.
- Commit/verification uncertainty.
- Protected or unavailable authority.

Do not import publication's legacy pending-overlay behavior into realization. Establish realization's own current contract.

Preserve the atomic unit: one Realization plus every required productive/support/protection fact.

No partial realization, per-role success, or additional acceptance is authorized.

Explicit retry must preserve exact accepted identity and deterministic realized identities. It rechecks current lawful foundation/occupancy, not substitute geometry.

Specify how a possibly committed attempt is distinguished from safely retryable failure. Do not automatically report zero durable effects after an exception.

For the automatic path, keep acceptance outcome separate from realization outcome and currentness. A later scheduling failure does not retroactively make the earlier acceptance nonexistent.

Define safe late-result delivery and notification without assuming publication receipts already apply to Proposal or realization results.

Any required additions must be concrete runtime contracts with exhaustive consumer consequences.

---

## 12. Initialization, Orphans, and Compatibility

Generation-scope initialization, cache installation, asynchronous reads, notifications, and protection effects as required by the selected lifetime model.

Startup must still validate complete realization membership and exact accepted lineage.

Do not “fix” the demonstrated restart protection by relaxing validation, inventing an acceptance, dropping orphan rows, or treating protected realization as empty.

Existing orphan evidence is not automatically removable, even when the new diagnostic explains one way it could have arisen.

The repair proposal is prospective prevention and safe operation handling—not retrospective data repair.

Evaluate and justify compatibility for:

- Realization V1 records and all fact roles.
- Accepted Allocation versions/completeness rules.
- Database schema 11.
- V14 and supported historical backup readers.
- Restore staging/journal payloads.
- Profile independence.
- Reload, exact export, and recovery protection.

Prefer reuse of runtime mechanisms with unchanged durable representations where sufficient.

Do not assume unchanged keys alone prove compatibility. If a durable change is genuinely necessary, identify its exact scope and preservation requirements before implementation.

No migration, version increment, validator relaxation, or historical correction is authorized by this task.

---

## 13. Required Decision and Future Regression Matrix

Provide one selected observable outcome, allowed writes, preserved evidence, and proposed test layer for each case:

1. Healthy automatic realization after committed acceptance.
2. Healthy explicit realization of retained acceptance.
3. Current alreadyRealized without duplicate facts or Capacity consumption.
4. Replacement before automatic callback dispatch.
5. Replacement during lazy/preparatory realization reads.
6. Replacement after candidate checks but before database opening.
7. Replacement while a physical transaction remains live.
8. Commit acknowledged but verification/runtime adoption delayed.
9. Both original automatic-clear and automatic-V14 orderings.
10. Both original retry-clear and retry-V14 orderings.
11. Restored identical acceptance/realization identities do not renew old intent.
12. New explicit retry after valid replacement.
13. Same-acceptance concurrent attempts.
14. Distinct accepted allocations with overlapping or nonoverlapping claims.
15. Foundation/occupancy changes during an await.
16. Known atomic failure retaining valid acceptance.
17. Lost/thrown acknowledgment before transaction creation and after creation.
18. Verification failure or uncertain commit, including safe exclusion release.
19. Snapshot failure, aborted restore, exact rollback, and recovery-required readiness.
20. Stale initialization/read/protection/notification after replacement.
21. Combined realization/publication/Structure quiescence.
22. Full restart with intended target only and no orphan resurrection.

Include a multi-role fixture. The original one-fact reproduction does not certify whole-footprint preservation.

Count attempted adapter calls and created physical transactions separately.

Future tests must assert the chosen ordering, not accept several mutually different outcomes indiscriminately.

These are proposal requirements, not new permanent tests or repaired results.

---

## 14. One Concrete Proposal and One Repair Handoff

Deliver one internally consistent recommendation, marked:

**PROPOSED — AWAITING ARCHITECTURAL ACCEPTANCE — NOT IMPLEMENTED**

Include:

- Phase/state-transition table.
- Origin and cross-owner handoff contract.
- Chosen same/distinct-operation concurrency behavior.
- Exact exclusion acquisition/release conditions.
- Physical admission and terminal/verification evidence.
- Coordinator composition.
- Result/currentness mapping.
- Retry/init/protection handling.
- Compatibility decision.
- Full regression matrix.

Briefly explain rejected alternatives only where material.

Do not return an options-only audit, silently adopt the proposal, or start implementation.

Recommend exactly one next bounded owner-repair slice, without assigning its task number.

Identify precise owners/consumers, accepted prerequisites, permanent tests, affected current-surface feedback, native evidence, and exclusions.

List any independently demonstrated mandatory Review blocker from the coverage ledger separately. Do not silently absorb unrelated repairs or claim realization was the final possible blocker.

---

## 15. Resumption and Product-Evidence Boundary

Task 9.29 remains blocked until the relevant contract is accepted and the separately authorized repair is reviewed.

The later continuation must use a new, distinct continuation input/RESULT path. Do not overwrite either existing blocked execution.

Before resumption:

- Review the repaired acceptance-to-realization chain end to end.
- Reconcile the bounded Review replacement-coverage ledger.
- Resolve or explicitly disposition any demonstrated mandatory independent gap.
- Finish the governing/capability review that this stopped execution did not complete.
- Preserve original corrective, Build, navigation, draft, and mobile requirements.

Unverified ledger entries are not automatic defect findings, but they must not be represented as proven safety.

This proposal task implements no UI and earns no native/mobile authoring acceptance.

The repair handoff must require actual existing UI acceptance with automatic realization, explicit retry, V14 export/import/reload, full clear, and truthful busy/protected/result feedback.

Precise races may use controlled real-adapter tests and clearly labeled native delivery seams. Ordinary successful import alone does not prove concurrency isolation.

---

## 16. Validation and Bundle Evidence

Run the retained five-case diagnostic and relevant existing suites using the installed toolchain.

Keep original observations unchanged; write new run evidence separately.

Record fresh formatting, lint, typecheck, complete tests, production build, bundle, and whitespace checks.

Run the final full suite separately from build/static jobs with the established one-worker limit:

```text
npm run test -- --maxWorkers=1
```

Do not change source, existing assertions/timeouts, configuration, dependencies, or default test selection.

Historical continuation baseline:

| Measure | Reported value |
|---|---:|
| Test files / tests | 166 / 1,718 |
| Initial raw JavaScript | 633,786 bytes |
| Initial gzip JavaScript | 166,306 bytes |
| Largest lazy chunk | 62,657 bytes |
| Total JavaScript | 1,279,887 bytes |
| Initial-gzip headroom | 3,694 bytes |

Measure rather than copying.

One fresh build can establish before/after size when all production inputs are unchanged. Explain that basis.

Preserve 170,000 initial-gzip, 685,000 initial-raw, 100,000 largest-lazy, and all other repository hard gates. Report existing advisories.

Identify likely repair touch points and lazy-boundary risks, but do not invent post-implementation measurements or increase thresholds.

---

## 17. Output, Preservation, and Completion Criteria

Write:

`docs/implementation/phase-9/TASK_9.29.3_REALIZATION_LIFECYCLE_REPLACEMENT_ISOLATION_CONTRACT_RESOLUTION_V1_RESULT.md`

Write the separate full proposal:

`docs/architecture/REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md`

Retain evidence under:

`docs/implementation/phase-9/evidence/task-9.29.3/`

Every new durable output filename must contain RESULT.

The execution RESULT must include:

- Governing versions and baseline.
- Reproduced versus source-inspected findings.
- Writer/handoff inventory and bounded Review coverage ledger.
- Selected contract and exact compatibility rationale.
- Future regression matrix.
- Validation actually performed.
- Every created artifact and baseline preservation.
- One repair handoff and resumption checklist.
- Explicit unresolved decisions and evidence limits.

Exclude application/UI implementation, architecture adoption, new recovery authority, historical repair, global/cross-tab locking, Goal lifecycle, recurrence, release/replacement of scheduled work, Found Time, dependency changes, and retirement.

COMPLETE requires a coherent decision-ready contract covering the demonstrated automatic and explicit-retry paths through physical settlement and runtime adoption.

A material unresolved choice must produce PARTIAL/BLOCKED, not be hidden as an implementation detail.

Read back BOTH final documents. Return the execution RESULT and the complete separate proposal as clearly identified outputs, not only a relative link to the proposal.

Distinguish repository-local retention from commits or remote backups.

---

## 18. Final Completion Statement

End the execution RESULT with the applicable determination:

**Task 9.29.3 — Realization Lifecycle & Replacement Isolation Contract Resolution V1 is COMPLETE as a bounded architecture-resolution proposal. Architectural acceptance and implementation remain pending.**

or:

**Task 9.29.3 — Realization Lifecycle & Replacement Isolation Contract Resolution V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when one concrete proposed contract defines how acceptance handoff, automatic and explicit realization, physical writes, runtime adoption, and replacement are ordered so displaced operations cannot reinstall orphan scheduled facts—while preserving valid acceptance, exact realization identity, current scheduling checks, compatibility, and existing recovery protection.**