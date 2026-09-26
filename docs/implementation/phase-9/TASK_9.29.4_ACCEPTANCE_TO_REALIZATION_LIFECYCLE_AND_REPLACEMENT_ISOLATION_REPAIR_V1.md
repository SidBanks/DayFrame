# Task 9.29.4 — Acceptance-to-Realization Lifecycle & Replacement Isolation Repair V1

**Status:** READY — BOUNDED FOUNDATION IMPLEMENTATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Proposal Persistence, Acceptance Handoff, Realization Lifecycle, and Replacement-Isolation Repair
**System:** DayFrame
**Parent Task:** Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — PARTIAL/BLOCKED
**Prerequisite:** Task 9.29.3 RESULT and complete proposed contract accepted in the accompanying architectural review
**Implementation Authority:** Accepted contract, explicitly including the adjacent Proposal common-write lifecycle safeguard
**Domain Decision / Scheduling Policy Change Authority:** NONE
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**New Review Layout / Navigation Authority:** NONE
**New Recovery / Historical-Correction Authority:** NONE
**Capability Retirement / Module Removal Authority:** NONE

---

## 1. Objective

Implement the accepted Realization Lifecycle & Replacement Isolation Contract V1 across the existing acceptance-to-realization chain.

Close both demonstrated boundaries:

1. Proposal acceptance persistence can resume after clear/restore and reinstall displaced acceptance.
2. Automatic or explicitly retried realization can resume after replacement and reinstall displaced records and scheduled facts.

Preserve separate acceptance and realization transactions, exact accepted geometry and lineage, current source checks, complete-footprint atomicity, idempotence, and truthful durability/currentness outcomes.

The repair must cover the common Proposal writer, not only its Accept caller, because the same whole-image persistence mechanism serves other existing commands.

This task repairs existing foundations and directly affected current consumers. It does not deliver Task 9.29’s new Review Schedule workflow.

---

## 2. Architectural Acceptance and Task Identity

Before application changes, create:

`docs/adr/ADR_ACCEPTANCE_TO_REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_V1_RESULT.md`

The acceptance ADR must:

- Identify the exact full proposed contract path and SHA-256.
- Reference Task 9.29.3’s RESULT and both blocked 9.29 executions.
- Record acceptance of the selected nonqueued Proposal-write and realization leases.
- Explicitly authorize the adjacent Proposal common-write safeguard established by the new acceptance-persistence diagnostics.
- Preserve the separate acceptance/realization transaction boundary.
- Record the source-admission, complete-verification, result/currentness, and no-migration decisions.
- State the single registered composition/realm guarantee boundary.
- State that implementation completion requires this task’s reviewed RESULT.

The original PROPOSED document remains immutable. Do not edit its historical status or overwrite prior publication/Structure ADRs.

The accepted publication queue and Structure policies remain unchanged.

Confirm no conflicting executed Task 9.29.4 exists. Do not overwrite or silently renumber a conflict.

Save this input separately from its RESULT. Verify Sections 1–18 and the final completion statement before execution.

---

## 3. Governing Sources and Bounded Coverage Map

Read actual repository copies of:

1. `REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md`, in full.
2. Task 9.29.3 RESULT, writer/handoff inventory, Review coverage ledger, diagnostics, observations, source hashes, and reproduction guide.
3. Original Task 9.29 and its blocked authorized continuation.
4. Accepted publication ADR and Task 9.29.2 RESULT/permanent regressions.
5. Task 9.3 realization architecture/RESULT and Tasks 9.2, 9.2.1, and 9.2.2 acceptance, footprint, and identity contracts.
6. Accepted Structure owner-safety ADR and relevant 9.27.2 planning/admission tests.
7. Current foundation, Sleep, occupancy, Proposal, realization, and accepted-evidence contracts.
8. Cross-storage restore, runtime transaction, durable compatibility/versioning, and retirement specifications.
9. Relevant current Review, Utilities, Goal-context, backup, and clear tests.

Record the current write/install/consumer map before implementation.

Identify every common Proposal writer alias, exact desired-state retry, acceptance callback, direct realization retry, lazy façade, initialization/protection continuation, replacement route, and affected result consumer.

Reconcile the existing bounded Review coverage ledger without turning it into an all-application audit.

Keep demonstrated behavior, named retained regression evidence, source inspection, and unverified boundaries separate.

An unverified ledger row is neither proof of safety nor proof of another defect.

---

## 4. Baseline and Forensic Protection

Before application changes:

- Record HEAD and exact working-tree status.
- Inspect applicable repository instructions.
- Capture task-relative preservation hashes and relevant baseline copies.
- Measure current tests and production bundle.
- Pin governing source versions.

Task 9.29.3 reported 258 status entries and 1,390 baseline files. Capture actual current values.

The dirty working tree, not HEAD alone, is the implementation baseline.

Preserve unrelated work, earlier inputs, RESULTs, ADRs, proposed contracts, diagnostics, and retained observations.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable fixtures, database factories, browser profiles, and origins.

Keep historical defect-confirming diagnostics unchanged. Create separate permanent repaired-behavior tests and new evidence.

---

## 5. Origin Capture and Lifetime Identity

Implement the accepted runtime identities through lightweight owner-stable shells.

Capture and freeze public input before the first await, including lazy import:

- Exact registered Proposal/realization owner identities.
- Unique operation identity.
- Shared authority epoch.
- Relevant Proposal and realization generations.
- Exact Proposal input or Accepted Allocation target.

Owners must recognize their own issued identities. Structurally similar caller-created objects are not valid capabilities.

Factory-level commands capture at their own synchronous entry unless given a valid private upstream origin.

Automatic realization inherits the original acceptance lifetime and the exact accepted ID/revision/payload established by its verified commit.

It may allocate a new attempt identity, but must not sample new epochs/generations to rescue a delayed callback.

A fresh explicit retry is a new command against current accepted authority. It may lawfully inspect restored identical data; an old callback may not.

Advance generations on installation, clear/replacement, and abort restoration as specified. Begun replacement advances epoch before snapshot callbacks, including when capture subsequently fails.

Do not roll coordination identity backward with restored data.

Ordinary successful append does not invalidate every previous result receipt. Content/source freshness is a separate check.

No token, receipt, lease, counter, or witness enters durable records, backups, staging, journals, or runtime data snapshots.

---

## 6. Proposal Common-Write Lifecycle

Implement one nonqueued Proposal-write lease around all ordinary routes sharing the whole-image writer.

Cover current record, lifecycle, reject, stale-transition, acceptance, candidate, and exact desired-persistence retry aliases.

Direct destructive clear/replacement uses the shared replacement boundary, not this ordinary writer.

Asynchronous revalidation is preparatory and replaceable. Retain its original origin throughout.

Before constructing the final candidate from current authority:

- Acquire the Proposal lease synchronously.
- Reject another unresolved Proposal write as proposalBusy.
- Recheck current Proposal/option/candidate identity and semantic witness.
- Preserve immutable lineage and accepted-claim conflict checks.
- Preserve actual-acceptance-time Structure revalidation and its single captured time.
- Record the exact leased base and desired version.

Do not queue, automatically replay, or overwrite a candidate constructed from an earlier unleased base.

Hold the lease through physical admission, native terminal state, full-image verification, owner installation, result recording, and matching synchronous notifications.

### Verification and retry

Verify the complete intended Proposal image by its canonical composite record keys, counts, revisions, and nested values.

Known atomic failure retains the existing exact desired-image retry contract without pretending the decision committed.

Retry writes that exact current desired version. It does not rerun semantic acceptance, allocate IDs, or dispatch automatic realization.

A later semantic command that supersedes desired state invalidates older retry closures even within the same replacement generation.

Successful replacement discards displaced desired state. Abort-restored known-failed desired state requires fresh explicit retry under current validation.

Unconfirmed persistence protects the Proposal owner and cannot enter ordinary desired replay.

Implement the accepted runtime outcome changes across all affected common-writer consumers, not just acceptance.

---

## 7. Verified Acceptance and Automatic Handoff

Keep the two durable operations separate.

On verified acceptance:

1. Record the exact outer accepted evidence and its receipt while the Proposal lease is current.
2. Complete Proposal settlement.
3. Release the Proposal lease.
4. Dispatch one automatic realization attempt with the original acceptance lifetime.

Never await realization while holding the Proposal lease.

Replacement may win between steps 3 and 4. In that case:

- The outer accepted result remains an outcome of the earlier committed operation.
- Its receipt is no longer current.
- The inner automatic attempt rejects contextReplaced without writing or resolving replacement data to renew the old intent.

Do not reaccept, compensate with rejection, create missing lineage, or schedule a later automatic retry.

Known-failed or unconfirmed acceptance persistence must not dispatch realization.

If another realization is executing, the automatic attempt returns realizationBusy. The current verified acceptance remains available for later explicit retry.

The Proposal and realization leases must not be nested while waiting on each other.

Permit the contract’s lawful coexistence of ordinary Proposal append and realization of a different existing acceptance.

Realization compares its exact immutable accepted target, not unrelated new Proposal-history bytes.

---

## 8. Realization Admission, Concurrency, and Current Sources

Implement one nonqueued realization execution lease.

Acquire it before authoritative asynchronous owner reads, durable idempotence verification, or database opening.

Preparatory lazy work holds no lease, retains original lifetime, and cannot install owner state or protection.

While the lease is active, another same- or distinct-target attempt returns realizationBusy. It does not join, queue, wait, or claim alreadyRealized from tentative state.

After settlement, a fresh command may verify an existing realization or attempt another exact complete footprint.

### New realization

Resolve the current immutable complete Accepted Allocation V2 and retain:

- Exact policy and deterministic identities.
- All productive, support, and protection claims.
- Accepted geometry, canonical User Days, and lineage.
- Current settled realization base.
- One realizedAt for this attempt.

Obtain current canonical foundation/occupancy evidence using existing derivation and source adapters.

Preview blocks alone are not sufficient when saved state changed or Preview is absent/stale.

Reuse current Work, manual/fixed, Sleep requirement/accepted placement, PlanDecision, Composition, and realized-fact evidence as required by the accepted contract.

Deduplicate only by the proper canonical subject identity.

Do not use disposable Capacity as schedule authority, invoke UI generation, move accepted claims, or add a scheduling policy.

Capture a synchronous source witness and compare it after database opening immediately before transaction creation.

Unavailable complete evidence returns sourceUnavailable; a changed witness returns sourceChanged without a write or automatic restaging.

### Already-realized branch

After lifetime and exact acceptance checks, verify the existing durable complete set using its original timestamp.

Do not allocate another timestamp or apply today’s foundation as a retroactive veto of established realized facts.

Current conflicts may require Review; they do not authorize erasure or duplication.

### Later source changes

Physical admission is the validity point for a new write.

Later lawful ordinary source changes do not cancel that admitted transaction. Return reviewRequired when specified and requery current evidence.

Whole-authority replacement remains excluded through full settlement.

---

## 9. Physical Terminal Evidence and Complete-Set Verification

Reuse the existing optional storage admission and native-terminal observer.

Preserve both arguments through every wrapper and delayed database opening.

The final synchronous admission check must cover:

- Registered owner and original lifetime.
- Matching active lease and open attempt.
- Current admission/protection.
- Exact accepted target and settled base.
- Required source witness.

No await, timer, command, planning-clock sample, or user callback may intervene between successful admission and transaction creation/enqueueing.

### Terminal handling

Register the internal nonthrowing observer after native terminal handlers exist and before requests are enqueued.

Request errors and transaction error notifications alone are not terminal.

Enqueue failure must abort and observe actual terminal settlement.

Close attempt admission on failed/thrown acknowledgment.

Under the required observer contract:

- No registered transaction plus closed admission prevents delayed delegation from subsequently starting.
- A registered transaction retains exclusion until native terminal state.
- Native abort can establish no-write failure.
- Registered commit with lost/thrown acknowledgment remains unconfirmed.
- A forever-pending call without sufficient physical evidence remains fenced.

Reuse the accepted native-terminal/MessageChannel mechanism without changing publication’s behavior.

No timeout, ignored promise, or database-close request proves cancellation.

### Realization verification

Before new or already-realized success:

- Verify the exact Realization record.
- Verify every owned fact and all three role-ID lists.
- Reject missing, duplicate, extra, or mismatched members.
- Verify accepted claims, complete lineage, exact geometry, days, and timestamp.
- Reconstruct expected facts through existing pure validators without treating the saved set as a conflict against itself.
- Verify the settled base remains intact.

Install only the verified union of the settled base and complete new set.

Do not install a stale precomputed authority array, unverified candidate, partial role set, or pending realization overlay.

### Release

Release only after physical termination/no future delegation, verification or failure classification, evidence/protection disposition, result recording, and synchronous notifications have settled.

Quiescent uncertainty remains protected. Live unresolved work remains nonquiescent.

Notification exceptions must not trigger another write, false success, or automatic retry.

---

## 10. Coordinator, Initialization, and Replacement

Extend the existing before-snapshot predicate to require:

```text
Structure
AND HistoricalPlan
AND Proposal-write
AND realization quiescence
```

Live work returns busy before epoch advance, snapshot capture, staging, or destructive effects.

When all are quiescent, protected Proposal/realization authority returns structured protected denial.

Physical nonquiescence takes precedence over settled protection until the active work finishes.

On admitted begin, close ordinary admission and advance epoch before any participant callback can reenter.

Do not begin replacement and then drain old work behind closed admission.

Cover full clear, modern restore/V14, exposed/internal begin, attached direct owner clear/replacement, standalone factory limitations, abort, rollback, and startup recovery.

Privileged persistence/install uses existing private capabilities and matching epochs—not ordinary inactive-transaction admission or public allow-protected flags.

Preserve full clear’s cleared/partial/failed semantics and the existing restore journal/staging/source-check/rollback protocol.

### Initialization and reads

Generation-scope initialization promises, lazy-shell construction, metadata/authority installation, reads with protection effects, evidence capture, and deferred notifications.

Check lifetime after awaits and before installation. Bind protection continuation to the exact protection instance.

A late surface construction cannot replace a shell already installed by restore.

Bootstrap remains Proposal before realization. Do not introduce initialization-triggered realization.

Stale reads return unavailable/contextReplaced, not valid empty evidence.

Abort may restore exact data under new generations, but does not revive old callback or retry closures.

---

## 11. Runtime Outcomes, Receipts, and Current Consumers

Preserve domain outcomes while implementing the accepted runtime distinctions.

Realization must distinguish:

- Verified realized.
- Verified alreadyRealized.
- Exact conflict.
- Incomplete/legacy accepted footprint.
- Sleep foundation review required.
- Other source unavailable.
- Invalid acceptance/lineage.
- sourceChanged.
- realizationBusy, replacementBusy, and contextReplaced.
- authorityUnavailable and authorityProtected.
- Proven atomicPersistenceFailure.
- commitStateUncertain and verificationFailedAfterCommit.

Failure fields must not advertise partial newly scheduled success.

Proposal acceptance uses accepted only after verified commit. Unconfirmed acceptance is not “decision not recorded” and cannot trigger realization.

Preserve recognized non-enumerable receipts on all applicable command results.

Construct the outer acceptance envelope explicitly and retain the original nested realization result and its separate receipt.

Do not spread or JSON-clone away currentness evidence, fabricate receipts, or treat deserialized reporting data as a live command result.

Update affected current Review handlers, planningResultCopy, Utilities, and protection-aware accepted-evidence consumers exhaustively.

Current feedback requires both the original receipt and the initiating UI request identity.

A displaced result cannot install current success feedback, refresh the replacement as successful scheduling, or initiate another write.

Explain accepted-but-unscheduled, busy, known no-write, written-but-unverified, uncertain, and reviewRequired separately.

Synchronous UI submit guards are required for duplicate clicks but are not the owner safety mechanism.

Preserve appropriate drafts/focus after busy or rejected replacement. No automatic destructive retry or new recovery UI.

---

## 12. Domain, Compatibility, and Historical Preservation

Preserve:

- Separate immutable acceptance and realization.
- Complete V2 versus legacy/incomplete distinctions.
- Exact productive/support/protection roles and geometry.
- One accepted liability-to-realized Capacity transition.
- No duplicate Demand credit or executable Buffer.
- Explicit publication and independent Actual/Progress.
- Current publication FIFO, clocks, certainty, and terminal handling.
- Accepted Structure temporal and single-clock rules.

Keep Realization V1, Proposal/Accepted records, database schema 11, V14, supported historical readers, and staging/journal representations unchanged.

Profiles remain authored setup, independent of accepted/realized authority. Their source-freshness effects follow the accepted before/after-admission distinction.

No migration, stored operation token, new database field, validator relaxation, or durable version increment is authorized.

Startup must continue preserving/protecting orphan, incomplete, or unresolvable evidence.

Do not create missing acceptance, delete orphan rows, silently normalize history, or classify historical records as caused by this race.

Existing verified startup may establish readable complete authority. That is not an in-session bypass around uncertain persistence.

If a previously valid representation genuinely requires incompatible reinterpretation, stop for compatibility review.

---

## 13. Permanent Phase-Selected Regressions

Implement all 22 numbered cases in accepted contract §12, with the selected outcome for each controlled ordering.

Map each case to permanent evidence; do not replace exact expectations with “busy or success is acceptable.”

At minimum prove:

- Healthy automatic and explicit realization with full-role readback.
- Verified alreadyRealized with no mutation or duplicate Capacity effect.
- Replacement winning before the automatic handoff or realization lease.
- Replacement returning busy during owner checks, database opening, native transaction, verification, adoption, and notifications.
- All four original automatic/retry × clear/V14 cases repaired as busy-first, settlement, explicit replacement retry, and exact restart target.
- Identical restored IDs/bytes not renewing old intent.
- Fresh commands acting lawfully on restored unrealized or realized authority.
- Same-target automatic/explicit permutations returning busy while active, followed by a fresh verified no-op.
- Distinct-target concurrency, retained prior facts, activity/protection conflicts, and compatible Buffer overlap.
- Saved-source changes before admission rejecting without a transaction.
- Saved-source changes after admission preserving verified facts with reviewRequired.
- Known abort, pre-delegation throw, live receipt, missing acknowledgment, failed verification, and never-terminal fencing.
- Snapshot failure, abort, rollback, recovery-required readiness, and exact lifetime invalidation.
- Stale initialization, shell installation, protection, reads, notifications, and desired retries.
- Combined quiescence across all four participants.

### Adjacent Proposal regressions

Separately prove:

- Both new acceptance-persistence × clear/V14 reproductions now return busy at the leased gate, followed by verified commit and explicit replacement retry.
- Replacement winning before Proposal lease yields no decision/allocation write.
- Competing common-writer commands cannot overwrite an earlier settled full image.
- Every reachable writer alias uses the lifecycle boundary.
- Exact desired retry versus superseded desired version and unconfirmed/no-replay.
- Full-image verification and source/base checks.
- No automatic realization after failed or unconfirmed acceptance.
- Proposal lease released before realization, with replacement at that exact handoff.
- Harmless unrelated Proposal append does not invalidate realization’s immutable target.
- Public/direct replacement cannot impersonate private coordinator capability.

Use deterministic deferred operations and actual owner/store/adapter composition.

Count mutation attempts separately from created physical transactions.

Include required support, required Buffer, adjacent owner-day cases, and compatible Buffer overlap where supported.

Test missing/extra/mismatched members and zero partial effects on abort; a healthy three-role control is insufficient.

Retain publication, Structure, Sleep, Goal, G1/G2, Progress, restore, clear, and supported-backup suites.

Document any changed result expectation while preserving the underlying safety assertion. Do not weaken tests or rewrite historical diagnostics.

---

## 14. Native Production and Mobile Acceptance Gate

Use the production build and disposable state.

Required existing-interface workflows:

1. Actual Proposal acceptance followed by automatic realization.
2. Explicit realization retry of retained acceptance, without accepting again.
3. Complete productive/support/protection durable readback.
4. Current verified alreadyRealized without duplicate facts.
5. V14 UI export/import/re-export/reload with exact authority comparison.
6. Explicit full clear and reload with intended state only.
7. Fresh lawful operation after replacement.
8. Busy/rejected replacement retaining appropriate unrelated drafts.

Use controlled native delivery or adapter seams to exercise affected busy/protected/unconfirmed/currentness feedback where needed. Label them precisely.

A successful ordinary import is not concurrent-isolation proof. Canonical fixture seeding must not substitute for UI acceptance, retry, import/export, or clear actions being certified.

Validate affected current surfaces at:

```text
320px
390px
768px
1280px
```

Require:

- No unintended document horizontal overflow.
- Practical approximately 44 CSS px primary hit targets.
- Reachable and distinguishable outcome feedback.
- Visible keyboard focus and predictable restoration.
- Semantic controls/headings and associated errors.
- Non-color-only state communication.
- Usable reduced-height forms and reflow.
- No required hover, double-click, right-click, or dragging.
- Equivalent canonical effects across widths.

Compare exact IDs, revisions, timestamps, optional absence, accepted lineage, all role lists, frozen publication evidence, and independent Actual/Progress.

Only documented contractually unordered top-level collections may be compared by canonical key. No blanket normalization.

Separate native actions, controlled delivery/faults, synthetic presentation, DOM measurements, and source inspection.

No physical-device, OS-dialog, soft-keyboard, screen-reader, or browser-native-zoom certification without actual evidence.

These checks certify affected existing surfaces, not the unimplemented 9.29 redesign.

---

## 15. Validation and Bundle Gate

Task 9.29.3 reported this unchanged application baseline:

| Measure | Historical value |
|---|---:|
| Test files / tests | 166 / 1,718 |
| Initial raw JavaScript | 633,786 bytes |
| Initial gzip JavaScript | 166,306 bytes |
| Largest lazy chunk | 62,657 bytes |
| Total JavaScript | 1,279,887 bytes |
| Initial-gzip headroom | 3,694 bytes |

Measure actual current before/after values.

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

Run the final complete suite without concurrent build/static jobs. The worker bound is not reduced test selection.

Record intermediate failures and resolutions without assigning an unsupported cause.

Do not weaken existing assertions, timeouts, configuration, or selection to obtain a pass.

Preserve hard limits:

- Initial gzip ≤170,000 bytes.
- Initial raw ≤685,000 bytes.
- Largest lazy chunk ≤100,000 bytes.
- All other repository hard gates.

Measure early. Keep origin shells lightweight and verification, Proposal, realization, and foundation engines behind appropriate lazy boundaries.

Do not weaken correctness to fit the bundle, raise thresholds, install dependencies, or launch unrelated restructuring.

Report existing advisories and task deltas honestly.

Format task-created/touched files only as necessary.

---

## 16. Non-Goals and Stop Conditions

Do not implement:

- New Review navigation/layout or a third primary destination.
- New Proposal options, ranking, decision policy, or acceptance-conflict rules.
- A combined acceptance/realization transaction.
- Reacceptance, compensating rejection, automatic retries, bulk realization, or deferred scheduling queues.
- Movement, clipping, substitution, or regeneration of accepted claims.
- Publication queue/clock/certainty redesign.
- Structure temporal-policy changes.
- New recovery/abandonment UI or permissive protection bypass.
- Historical orphan cleanup or affected-data classification.
- Cross-tab, multiple-writer, or global locking guarantees.
- Goal lifecycle, recurrence, time release/replacement, or Found Time.
- Schema, serialization, migration, dependency, or retirement changes.

The accepted Proposal common-writer lifecycle extension is explicitly authorized; it is not an invitation to redesign Proposal semantics.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a mandatory outcome cannot be established through the accepted evidence contract.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when implementation needs different concurrency, source validity, transaction boundaries, incompatible representation, expanded recovery, or weakened protection.

Do not simplify the repair to UI cancellation, an entry check, deterministic IDs alone, or unconditional finally-release.

Record independently demonstrated additional blockers separately. Do not silently absorb unrelated owner repairs or promote unverified ledger rows to confirmed defects.

---

## 17. RESULT, Retained Evidence, and Completion Criteria

Write:

`docs/implementation/phase-9/TASK_9.29.4_ACCEPTANCE_TO_REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_REPAIR_V1_RESULT.md`

Retain evidence under:

`docs/implementation/phase-9/evidence/task-9.29.4/`

All additional output reports, screenshots, measurements, exports, and QA artifacts must contain RESULT in their filenames. Application/test source retains repository conventions.

The RESULT must include:

1. Bounded outcome and acceptance-ADR reference.
2. Governing sources and actual task-relative baseline.
3. Final common-writer, handoff, installer, and consumer inventory.
4. Original-lifetime capture and nonqueued lease behavior.
5. Proposal full-image persistence, desired retry, and verified handoff.
6. Realization source witness, complete-set verification, and base preservation.
7. Physical terminal/acknowledgment/uncertainty and release evidence.
8. Coordinator, initialization, protection, and generation behavior.
9. All 22 contract cases plus adjacent Proposal and multi-role cases mapped to evidence.
10. Exact repaired original and newly discovered clear/V14 orderings.
11. Typed results, receipts, currentness, drafts, and current UI feedback.
12. Native/mobile observations and explicit limits.
13. Full validation and before/after bundle metrics.
14. Every created/modified file and purpose.
15. Schema, dependency, compatibility, history, and forensic effects.
16. Updated bounded Review coverage ledger and resumption prerequisites.

Retain commands, fixture provenance, transaction/phase counts, exact authoritative comparisons, representative narrow-screen feedback, measurements, and material validation logs.

Distinguish local repository evidence from commits or remote backups. Do not rely exclusively on `/tmp`.

Read back the actual RESULT and acceptance ADR. Verify paths, headings, status, scope, and final statement. Return the completed RESULT, not the READY input or a defect-confirming diagnostic.

COMPLETE requires both demonstrated owners repaired, safe original-lifetime handoff, exact supported data preserved, phase-selected permanent evidence, mandatory native/mobile checks, and unchanged hard gates.

Original Task 9.29 remains pending review of this repair and a newly authorized continuation using distinct input and RESULT paths. Preserve both earlier blocked executions.

Reconcile the coverage ledger and finish the previously stopped capability review before claiming the complete Review workflow is ready.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.29.4 — Acceptance-to-Realization Lifecycle & Replacement Isolation Repair V1 is COMPLETE. Task 9.29 workflow convergence remains pending separate continuation and acceptance.**

or:

**Task 9.29.4 — Acceptance-to-Realization Lifecycle & Replacement Isolation Repair V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when Proposal persistence, original-lifetime automatic handoff, explicit realization, physical writes, complete verification, and replacement follow the accepted ordering so displaced operations cannot reinstall acceptance or orphan scheduled facts—while preserving separate authorities, exact geometry and lineage, current-source checks, compatibility, and truthful outcomes.**