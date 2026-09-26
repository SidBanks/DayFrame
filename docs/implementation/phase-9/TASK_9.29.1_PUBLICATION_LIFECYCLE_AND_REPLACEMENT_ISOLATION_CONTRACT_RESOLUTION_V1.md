# Task 9.29.1 — Publication Lifecycle & Replacement Isolation Contract Resolution V1

**Status:** READY — CONTRACT RESOLUTION ONLY
**Phase:** Phase 9 — Product Convergence
**Task Type:** Bounded Publication Admission, Replacement Isolation, and Settlement Contract
**System:** DayFrame
**Parent Task:** Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — PARTIAL/BLOCKED
**Architecture Work Authority:** Produce one concrete proposed contract for review
**Architecture Adoption Authority:** NONE
**Application / Existing Test Implementation Authority:** NONE
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**Capability Retirement / Removal Authority:** NONE

---

## 1. Objective

Resolve the publication lifecycle gap demonstrated by Task 9.29.

Define a publication-specific contract ensuring that an operation originating before a successful full clear or restore cannot later write or install displaced HistoricalPlan data into the replacement authority.

The contract must cover:

- Admission before asynchronous work.
- Source freshness versus replacement identity.
- Admission at the physical storage boundary.
- Replacement quiescence.
- Already-started transactions and their settlement.
- Verification, metadata adoption, pending work, and retry.
- Clear, restore, rollback, and recovery boundaries.

Deliver one decision-ready recommendation and one bounded implementation handoff.

Do not implement the repair or resume the Review Schedule interface during this task.

---

## 2. Checkpoint, Task Identity, and Historical Integrity

Task 9.29 remains PARTIAL/BLOCKED.

Its report establishes two controlled production-command reproductions:

- Delayed publication survives successful full clear.
- Delayed publication survives successful V14 restore.

In both, the old command subsequently returns published and its batch survives restart.

Task 9.27.2 remains accepted COMPLETE for its explicitly bounded Structure repair. Its owner-local guarantees must not be reinterpreted as universal publication protection.

Task 9.28 remains accepted COMPLETE for its bounded read-only inspection.

Preserve all prior inputs, RESULTs, diagnostics, and observations unchanged.

Confirm no conflicting executed Task 9.29.1 exists. Do not overwrite or silently renumber a conflict.

Verify this immutable input contains Sections 1–18 and the final completion statement.

Proposal completion, architectural acceptance, owner-repair completion, and resumed 9.29 completion are separate checkpoints.

---

## 3. Governing Inputs

Read actual repository copies of:

1. Task 9.29 input and PARTIAL/BLOCKED RESULT.
2. Its retained command map, reproduction guide, diagnostic source/configuration, clear/restore observations, and governing-version manifest.
3. The accepted Structure owner-safety ADR and Task 9.27.2 RESULT.
4. The applicable cross-storage restore ADR, amendments, runtime transaction contracts, and coordinator contracts.
5. Task 9.7 explicit-publication RESULT and governing publication architecture.
6. Task 9.9 publication-readiness and commit-certainty repairs.
7. Relevant HistoricalPlan domain, surface, storage, identity, ordering, deduplication, and retry contracts.
8. First-class Sleep publication contracts where they enter the same materialization/write path.
9. Task 9.26 restore/recovery-readiness RESULT.
10. Durable compatibility/versioning and End-State Compatibility & Retirement specifications.

Inspect current executable sources, including the actual equivalents of:

- `schedulePublication.ts`
- `historicalPlanSurface.ts`
- `indexedDbCollectionStorage.ts`
- Runtime authority transaction/controller
- Restore composition and participants
- Public store publication, full-clear, and import wiring
- Publication result types and current UI feedback

The current dirty working tree establishes executable behavior.

Older RESULTs establish bounded historical findings, not complete current API guarantees.

Do not substitute a broad hydration summary for the actual publication or restore contract.

---

## 4. Baseline and Protected State

Before writing output:

- Record HEAD and exact working-tree status.
- Inspect applicable repository instructions.
- Capture a task-relative preservation baseline.
- Identify the current publication/restore source versions.
- Record the installed validation and diagnostic tooling.

Task 9.29 reported 240 status entries and 1,201 baseline hashes. Capture current measurements rather than assuming those counts remain exact.

No existing application, test, configuration, architecture, input, or historical evidence file may be modified.

Only new proposed-contract, RESULT, and isolated diagnostic/evidence artifacts are authorized.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable fixtures, storage factories, databases, browser profiles, and origins.

---

## 5. Reproduce the Exact Reported Ordering

Reuse the retained 9.29 diagnostic without overwriting it or its observations.

Copy any rerun or extension into this task’s evidence directory with distinct RESULT filenames.

Establish the complete ordering for both full clear and V14 restore:

1. Review is canonically eligible.
2. Publication passes the relevant current checks.
3. Execution pauses before the physical write.
4. Replacement succeeds under the current implementation.
5. Replacement state is inspected before release.
6. The delayed operation resumes.
7. Its command result, runtime state, and durable batch are inspected.
8. Reinitialization confirms retained state.

Preserve exact IDs, timestamps, revisions, ranges, ordering contracts, and frozen source evidence in comparisons.

The delay must continue delegating to the real adapter. Do not mock successful publication or bypass eligibility to manufacture the defect.

Retain the distinction between the confirmed later race and the rejected early-dispatch hypothesis that failed materialization because Sleep became incomplete.

Diagnostic tests that confirm the defect are not repaired-behavior acceptance tests.

Do not infer real-user incidence or native-browser reproduction from controlled fake-IndexedDB evidence.

---

## 6. Publication Operation and Writer Inventory

Trace the entire current publication operation, not only its button handler.

Identify:

- Public command dispatch and any lazy loading.
- Review query and source capture.
- Materialization and batch allocation.
- Existing serialization or queues.
- Currentness checks.
- Storage opening.
- Physical transaction creation and request enqueueing.
- Transaction settlement.
- Verification reads.
- Runtime metadata/pending-state adoption.
- Notifications and final command result.

Inventory every reachable HistoricalPlan path that can write or install state:

- Explicit atomic publication.
- Any retained legacy publication entry.
- Exact persistence retry.
- Pending-queue flush, where present.
- Initialization or metadata reload.
- Public clear/replacement operations.
- Coordinator-owned restore, full clear, rollback, and startup recovery.
- Protection/recheck operations that can change runtime admission or metadata.

Classify ordinary publication, read/install work, and privileged coordinator operations separately.

Do not assume the early queued publication design is still identical to the current atomic entry point. Verify which paths remain reachable and supported.

This inventory is bounded to HistoricalPlan and its replacement coordination, not a new all-owner audit.

---

## 7. Required Isolation Invariants

The proposed contract must satisfy:

1. Successful replacement establishes the intended HistoricalPlan state under the existing clear/restore contract.

2. Work admitted under displaced authority cannot subsequently append batches, install pending overlays, adopt metadata, reopen readiness, or flush old retry state into that replacement.

3. A publication may validly settle before replacement begins. The later clear/restore then applies its ordinary replacement semantics to that settled state.

4. Already-started storage transactions are not cancelled merely by ignoring their promises or invalidating a UI result.

5. Source-content equality does not establish operation-lifetime equality. Restoring identical content must not silently validate an older continuation.

6. A failed or aborted replacement does not automatically authorize replay of old commands. Draft preservation and operation-token validity are different concerns.

7. A late result may describe an earlier settled operation only with correct operation/context identity. It must not masquerade as publication of the replacement schedule.

8. Publication uncertainty remains uncertainty. Protection must not be weakened to let replacement or another publication proceed blindly.

State the exact runtime/process boundary of these guarantees. Do not claim cross-tab, cross-device, or universal concurrency safety.

---

## 8. Select the Admission and Replacement Ordering

Recommend one concrete mechanism using the existing epoch, admission, storage callback, and before-snapshot quiescence infrastructure where suitable.

Identify:

- The first point at which publication captures replacement identity.
- Which asynchronous boundaries must revalidate it.
- The point where publication reserves the right to finish before replacement.
- The point where replacement closes ordinary publication admission.
- The exact point at which that reservation can safely be released.
- The result returned when either operation cannot proceed.

A publication-specific lease, counter, or equivalent may be proposed, but its semantics must be explicit.

Do not blindly copy Structure’s single-operation behavior if publication has a supported queue or different acceptance boundary.

For queued work, define whether it reserves replacement exclusion or remains rejectable at dequeue. Captured old intent must not acquire a new epoch merely because it reached the queue head later.

Choose a concrete policy for each phase rather than leaving implementation to decide between cancellation, blocking, or replay.

Prefer extending the current bounded coordination mechanism over inventing another lock, journal, or recovery owner.

No implementation or adoption occurs in this task.

---

## 9. Physical Write Admission and Settlement

Specify use of the existing synchronous admission callback after database opening and immediately before physical readwrite transaction creation/request enqueueing.

Define what it checks:

- Captured replacement epoch.
- HistoricalPlan owner generation or equivalent lifetime.
- Current admission/protection.
- Correct publication operation identity.
- Source freshness where the existing publication contract requires it.

There must be no intervening asynchronous gap that invalidates the claimed check.

Distinguish the following phases:

| Phase | Required decision |
|---|---|
| Before write admission | Can reject without creating a transaction |
| Transaction created, terminal result pending | Must coordinate settlement; not pretend cancellation |
| Known atomic abort | No new durable batch from that attempt |
| Commit acknowledged, verification pending | Data may already be authoritative; replacement ordering remains explicit |
| Commit/verification result uncertain | Preserve uncertainty and recovery protection |
| Verification and owner adoption complete | Operation can settle under its exact identity |

A post-commit generation check cannot undo a write.

Protection alone is not proof that a still-running physical write cannot cross a later replacement boundary. Explain how terminal state is established or replacement remains excluded.

Conversely, distinguish a settled failed operation from an unresolved live write so a released lease does not become an unexplained permanent busy state.

Do not silently add a timeout that declares an unknown transaction cancelled.

---

## 10. Quiescence and Coordinator Composition

Define how publication quiescence combines with existing Structure quiescence at every relevant transaction-begin route.

The check must occur before snapshot capture or replacement staging can rely on old authority.

Avoid this deadlock:

```text
Coordinator begins and closes ordinary admission
→ coordinator waits for publication
→ publication waits for ordinary admission to reopen
```

Specify the chosen non-deadlocking ordering and the caller-visible busy/retry behavior.

Trace:

- Modern complete restore, including V14.
- Full clear.
- Internal runtime replacement.
- Exposed controller begin routes.
- Rollback installation.
- Startup recovery.
- Direct HistoricalPlan replacement/clear paths if publicly supported.

Coordinator operations retain their private capability and matching epoch.

Do not require ordinary inactive-transaction admission for a legitimate coordinator-owned write while its transaction is active.

Preserve the existing journal, staging, source rechecks, exact recovery payloads, and finalization protocol.

Do not create an alternative restore engine.

---

## 11. Source Freshness, Identity, Queues, and Retry

Separate three questions:

- Is the reviewed schedule content still valid?
- Does this operation still belong to the current authority lifetime?
- Has this exact publication already been durably established?

No single fingerprint answers all three.

Preserve the reviewed range, exact source identity, materializer rules, and existing command-time revalidation.

Do not automatically refresh a stale source and publish the new result without user review.

For pending or queued work, specify:

- Origin identity captured before waiting.
- Admission at execution.
- Exact accepted batch identity, where one exists.
- Lifetime of pending overlays and metadata.
- Disposal or preservation behavior at successful replacement.
- Explicit retry after known failure.
- No replay after replacement without new lawful intent.
- Existing identical/no-op publication semantics.

Do not turn an already-committed publication into a new batch merely because its acknowledgment was delayed.

Do not report an uncommitted rejected operation as published because equivalent content happens to exist in the replacement.

Choose concrete outcome mapping rather than relying on UI heuristics.

---

## 12. Commit Certainty and Publication Time

Preserve the current distinctions among:

- Validation/source rejection.
- Known failure before commit.
- Verified durable success.
- Identical/no-op publication.
- Verification failure after commit.
- Commit state uncertain.
- Unexpected exception with unconfirmed outcome.
- Protected or recovery-required state.

Identify the exact current result unions and consumer consequences.

A new runtime-only rejection detail may be proposed when necessary, but it must not silently change a persisted format or falsely reuse a commit-success result.

Preserve the existing publication timestamp, ordering, batch identity, complete-day atomicity, and semantic deduplication contracts.

Do not copy Structure’s clock high-water rule, alter publication time to escape a race, or reconstruct history from current setup.

Do not change the meaning of publication, acceptance, realization, Actual, or Progress.

---

## 13. Compatibility and Historical Treatment

The target is an operational lifecycle repair using existing durable representations.

Determine and justify the effect on:

- Current HistoricalPlan rows and metadata.
- Supported publication snapshot versions.
- Database schema.
- Current V14 complete backup and supported readers.
- Restore staging/journal representations.
- Exact retry and no-op behavior.
- Reload and historical inspection.

Do not assume a schema/version change is required merely because runtime admission changes.

Also do not claim unchanged compatibility solely because field names remain the same.

If the recommended design can preserve every supported serialized representation, explicitly recommend no migration or durable version increment and explain why.

If it cannot, identify the exact incompatible requirement before implementation is authorized.

No retrospective deletion or correction of possibly affected publications is authorized.

The demonstrated race does not supply a reliable classifier for finding every historical occurrence. Do not infer one from timestamps, absent current Goals, or unfamiliar batch contents.

Preserve immutable evidence and supported recovery. No reader, capability, or legacy module is retired.

---

## 14. Decision and Future Regression Matrix

For each case, specify the selected ordering, observable outcome, permitted writes, retained state, and future test layer:

1. Ordinary publication and verified settlement.
2. Exact already-published no-op.
3. Replacement before lazy dispatch finishes.
4. Replacement during the asynchronous Review query.
5. Replacement after source checks but before storage opens.
6. Replacement while physical transaction settlement is pending.
7. Commit acknowledged but verification/adoption still pending.
8. Publication queued behind another publication.
9. Two simultaneous publication submissions.
10. Known atomic abort and explicit retry.
11. Verification failure or uncertain commit.
12. Full clear and V14 restore from the original reproductions.
13. Restore with identical schedule content or reused exact identities.
14. Begun-but-aborted replacement.
15. Rollback and recovery-required readiness.
16. Delayed initialization, verification, or metadata notification.
17. Old pending retry after successful replacement.
18. New explicitly initiated publication after replacement.
19. Structure and publication outstanding at the same coordinator boundary.
20. Restart preserving the intended replacement without displaced batches.

Use deterministic deferred operations and actual store/adapter integration for ordering proof.

Future tests must assert the selected contract, not merely accept whichever of busy, rejection, or success happens to occur.

Distinguish controlled storage tests from native-browser evidence.

These are proposed acceptance requirements, not implemented results.

---

## 15. Deliverable and Bounded Repair Handoff

Deliver one recommended contract, marked:

**PROPOSED — AWAITING ARCHITECTURAL ACCEPTANCE — NOT IMPLEMENTED**

Include:

- Exact operation phases and state transitions.
- Admission/quiescence APIs or signature sketches.
- Token/generation and queue semantics.
- Physical write and settlement boundaries.
- Current result mapping and required runtime additions.
- Coordinator integration.
- Compatibility rationale.
- Failure/recovery behavior.
- Regression matrix and evidence limits.

Briefly discuss rejected alternatives only where necessary to explain the chosen design.

Do not return an options-only audit or leave consequential behavior as an unspecified implementation detail.

Recommend exactly one bounded canonical-owner repair task, without assigning its next number.

Its handoff must identify affected owners/consumers, required tests, current-surface feedback, native-browser verification, unchanged bundle gates, and exclusions.

Then provide a resumption checklist for the original Task 9.29. Preserve its blocked RESULT and require a separate authorized continuation after the owner repair is reviewed.

---

## 16. Native/Mobile Boundary and Validation

This task does not implement UI or certify new Review workflows.

Do not manufacture browser measurements or reuse earlier successful import runs as proof of concurrent publication safety.

The proposed repair handoff must require:

- Actual production UI publication and verified historical readback.
- Actual UI V14 export/import/reload and full-clear verification.
- Readiness/busy/protection feedback through existing affected controls.
- Deterministic tests for the precise delayed-write interleavings.
- Relevant 320/390/768/1280px current-surface checks.
- Honest separation of native actions, injected failures, and source inspection.

The later 9.29 continuation still requires its full authoring/decision/correction/Build/mobile gates.

### Current task validation

Run the retained diagnostic and relevant existing suites using the installed toolchain.

Record current full-suite, formatting, lint, typecheck, build, bundle, and whitespace checks.

Run the final full suite without concurrent build/static jobs to avoid unnecessary contention. This does not claim that concurrency caused the prior timeout.

Do not change tests, timeouts, configuration, dependencies, or production source.

Historical baseline from 9.29:

| Measure | Reported value |
|---|---:|
| Test files / tests | 163 / 1,683 |
| Initial raw JavaScript | 626,896 bytes |
| Initial gzip JavaScript | 164,266 bytes |
| Largest lazy chunk | 62,657 bytes |
| Total JavaScript | 1,271,716 bytes |
| Initial-gzip headroom | 5,734 bytes |

Measure rather than copying these as current.

One verified build can represent before/after application size when all production inputs remain unchanged. Explain that basis.

Preserve 170,000 gzip, 685,000 raw, 100,000 largest-lazy and all other repository hard gates. Report existing advisories honestly.

---

## 17. Artifacts, Exclusions, and Completion Criteria

Write a separate execution RESULT:

`docs/implementation/phase-9/TASK_9.29.1_PUBLICATION_LIFECYCLE_REPLACEMENT_ISOLATION_CONTRACT_RESOLUTION_V1_RESULT.md`

Write the proposed contract separately:

`docs/architecture/PUBLICATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md`

Retain diagnostics and measurements under:

`docs/implementation/phase-9/evidence/task-9.29.1/`

Every new durable output filename must contain RESULT.

The execution RESULT must identify governing source versions, observed versus inferred findings, the chosen contract, validation actually run, every created artifact, preservation checks, and the implementation/resumption handoff.

Do not adopt the proposal, edit existing ADRs, implement the repair, add Review UI, or revise earlier completion claims in place.

Exclude:

- A new publication or recovery owner.
- Global/cross-tab locking.
- Historical batch repair or removal.
- Structure temporal-policy changes.
- New realization-retry eligibility.
- Bulk corrective or constructive actions.
- Goal lifecycle, recurrence, release/replacement, or Found Time.
- Schema/migration/dependency execution.
- Capability retirement or module removal.

If a material decision remains unresolved or a necessary source is unavailable, identify it precisely and report PARTIAL/BLOCKED. Do not conceal it beneath “implementation detail.”

COMPLETE means one coherent, decision-ready proposal and a concrete bounded repair handoff have been delivered—not that publication is safe yet.

Read back the actual output files and verify their headings, status, paths, and final statements. Return the RESULT rather than the READY input.

---

## 18. Final Completion Statement

End the execution RESULT with the applicable determination:

**Task 9.29.1 — Publication Lifecycle & Replacement Isolation Contract Resolution V1 is COMPLETE as a bounded architecture-resolution proposal. Architectural acceptance and implementation remain pending.**

or:

**Task 9.29.1 — Publication Lifecycle & Replacement Isolation Contract Resolution V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when one concrete proposed contract establishes how publication admission, physical writes, verification, pending work, and replacement are ordered so displaced operations cannot repopulate cleared or restored history—while preserving publication identity, commit certainty, compatibility, and the existing recovery protocol.**