# Task 9.29.4 — Acceptance-to-Realization Lifecycle & Replacement Isolation Repair V1 — RESULT

**Status: COMPLETE — bounded accepted owner repair; original Task 9.29 remains pending separate continuation.**

## 1. Bounded outcome and accepted architecture

Implemented the two demonstrated owner repairs: Proposal common persistence and realization now hold separate nonqueued leases through physical terminal, complete verification and settlement. Automatic realization is constrained by the original acceptance lifetime. Shared replacement checks all four participating owners before advancing epoch or capturing snapshots. A displaced operation cannot revive acceptance or scheduled facts after clear/restore; settled uncertainty remains protected.

The [acceptance ADR](../../adr/ADR_ACCEPTANCE_TO_REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_V1_RESULT.md) was written before application edits. It accepts the complete immutable [9.29.3 proposed contract](../../architecture/REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md), SHA-256 `611eb5c0b800c8e3d9d7a0254d4b807e0fe456e59ac1a5309cd07a53baa498c7`. The historical proposal retains its PROPOSED status. This repair does not implement the original Task 9.29 convergence redesign.

## 2. Governing sources and actual baseline

The task used its [authorized input](TASK_9.29.4_ACCEPTANCE_TO_REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_REPAIR_V1.md), accepted contract, 9.29.3 RESULT/diagnostics/observations/ledger, both blocked 9.29 executions, publication acceptance and 9.29.2 evidence, Task 9.3 realization and 9.2/9.2.1/9.2.2 acceptance/footprint/identity contracts, Structure acceptance and planning tests, current foundation/Sleep/occupancy/accepted evidence code, cross-storage/runtime restore, durable compatibility and retirement rules. Pinned governing sources and baseline hashes are retained in the [evidence directory](evidence/task-9.29.4/).

Actual starting HEAD was `c0cc9ae2ae68af626e64747539a417f10df1cf3a`, with **261 status entries and 1,435 baseline files**. The dirty working tree was the baseline. Baseline suite: **166 files / 1,718 tests passed**. Source archive, exact status, HEAD and hashes precede application changes. No reset, stash, commit, push, dependency installation, unrelated cleanup or operation on preserved Dogfood Pass 02 state occurred.

The [pre-implementation map](evidence/task-9.29.4/PRE_IMPLEMENTATION_MAP_RESULT.md) recorded the common writer and consumers. The [final inventory and bounded ledger](evidence/task-9.29.4/WRITER_CONSUMER_AND_COVERAGE_LEDGER_RESULT.md) separates newly demonstrated behavior, retained named tests, source inspection and still-unverified product boundaries.

## 3. Original lifetime and Proposal common writer

A lightweight owner shell captures an issued identity before lazy import/revalidation and clones command input. Private generation, peer generation and replacement epoch constrain currentness; ordinary append does not invalidate every historical receipt. Desired-version identity is separate. Runtime install, successful owner replacement and abort restoration advance lifetime without rolling it back with data.

The Proposal lease covers record/shown/supersede/stale, candidate, accept/modify-and-accept, reject option/Proposal and exact desired retry. Overlap returns proposalBusy without a queued candidate. Acceptance revalidation remains preparatory; after its await, the original lifetime/current source is checked and the lease is acquired before final candidate construction. Existing decision rules, accepted-claim conflict checks, immutable lineage and actual-time Structure qualification remain.

The common whole-image writer supplies admission and native observer, verifies every intended record/count/nested payload, and adopts authority/desired/durability only after exact readback. Known atomic failure retains the existing desired-image retry contract. Superseded or source-stale retries reject without writing. Unconfirmed persistence protects the owner, retains attempted/raw evidence privately and does not trigger realization or ordinary desired replay.

## 4. Verified handoff and realization

Verified acceptance remains a separate durable transaction. Its original result is retained with a recognized non-enumerable receipt. Proposal releases its lease before exactly one automatic callback. The realization attempt is constrained by that original acceptance origin, so even identical restored IDs/bytes cannot renew the old command. Replacement at the exact handoff produces historical outer accepted evidence with a noncurrent receipt and inner contextReplaced, with zero realization writes.

Fresh explicit retry captures a new lifetime and resolves current accepted authority. Realization acquires its independent lease before asynchronous authoritative checks, idempotence verification or storage opening. Concurrent same or distinct targets reject realizationBusy; no joining, FIFO or replay was added. A fresh already-realized call verifies the full current set and lineage, preserves original identities/time and performs no mutation or duplicate Capacity transition.

New realization derives current canonical saved Work/manual/fixed/Sleep/PlanDecision/Composition and realized occupancy behind the existing foundation lazy boundary. It does not use Preview as authority or invoke UI Generate. The synchronous source witness, exact immutable target and leased base are compared immediately before physical transaction creation. Pre-admission change returns sourceChanged with zero created transactions. A later lawful source edit preserves the admitted verified set and reports reviewRequired.

One transaction writes the deterministic realization record and every required productive/support/protection fact. Verification compares the complete union with prior authority, exact cardinality/payload and accepted lineage before adoption. Buffer remains non-executable protection; accepted geometry, canonical owner days, support relationships and original claims are not moved, clipped or regenerated.

## 5. Physical certainty, replacement and stale continuations

The shared persistence helper observes native complete/abort separately from the outward adapter promise. Known abort is atomicPersistenceFailure. A throw before delegation closes the old admission callback. A registered live transaction retains its lease despite an outward throw. A MessageChannel checkpoint detects a lost outward acknowledgment only after terminal evidence; committed uncertainty is protected, never silently retried or called success. A never-terminal operation remains fenced.

Verification failure or synchronous notification exception cannot announce successful adoption. Private attempted/raw observations are retained where readable; failed evidence reads remain explicitly unavailable. Full-image/full-set checks and notification settlement remain inside owner exclusion. Deferred Proposal delivery checks original lifetime and exact authority/ingress.

The shared before-snapshot controller now checks **Structure, HistoricalPlan, Proposal and realization**. Busy denial does not advance epoch or start staging. Attached direct clear/replacement uses that same controller; private full-clear/install routes require coordinator authority and current epoch. Existing rollback, journal and startup recovery are unchanged. A begun replacement or failed snapshot invalidates old intent even if exact data is later restored.

Initialization is scoped to original lifetime, base, ingress and quiescence. A protected owner cannot use in-session reinitialization to unlock uncertainty. Unloaded lazy shells retain authorized installs; synchronous exported authority/readiness and realized/accepted lists reflect installed data before module completion. Accepted-evidence queries discard results if their original lifetime or readiness changed across async work. Fresh verified startup can establish readable complete evidence under existing rules; it is not a protection bypass.

## 6. Permanent phase evidence and original repaired orderings

The [regression matrix](evidence/task-9.29.4/REGRESSION_MATRIX_RESULT.md) maps all **22 contract cases**, the adjacent Proposal boundary, complete footprint roles, adjacent owner days and compatible Buffer overlap to permanent tests and native observations.

For automatic realization, explicit retry and earlier Proposal acceptance persistence, each clear/V14 ordering asserts **one attempted selected mutation and zero created transactions at the held gate**. The first replacement is busy with unchanged epoch. Releasing the original operation permits exactly one selected physical transaction and complete verified settlement. A new explicit replacement succeeds; independent reopen matches the exact intended target. This repairs all four original realization orderings and both newly demonstrated earlier Proposal-persistence orderings without overwriting the old diagnostics.

Additional permanent cases cover exact handoff replacement, lazy displacement, full-image aliases/desired retry, same/distinct targets, missing/extra/mismatched members, three-role abort and lost acknowledgments, source changes before/after admission, stale initialization/read delivery, snapshot failure/abort, private capability misuse and all-four-owner quiescence. Existing V14 rollback/recovery, supported backups, publication FIFO/terminal, Structure clocks, Sleep, Goal/G1/G2, Progress and Capacity suites remain in the full run.

Changed existing expectations are documented: displaced Structure acceptance now reports contextReplaced while retaining the zero-write assertion; two constructive UI storage wrappers now forward admission and observer. No timeout, conflict assertion, historical diagnostic or hard gate was weakened.

## 7. Typed current UI outcomes and drafts

Review consumes typed Proposal and realization unions. Immediate request guards prevent duplicate clicks; scope/query identity, unmount checks and the original recognized receipt prevent obsolete completion from updating feedback or triggering refresh. The receipt is not serialized or recreated by spreading the outcome. Goal offer recording also checks the original receipt.

Copy distinguishes accepted-and-scheduled, retained acceptance with known scheduling failure/conflict, busy/displaced execution, unconfirmed persistence, protection and post-admission review requirements. It does not claim uncertain writes were canceled. Status text is semantic and non-color-only. Existing Utilities clear/import busy/protected handling remains intact and preserves unrelated Goal edit drafts in both native held-owner cases. No publication handler or queue redesign was introduced.

## 8. Native production and affected mobile checks

The final production driver records `NATIVE_CORE_PASS` and `NATIVE_LIFECYCLE_MOBILE_PASS`, using disposable origins/profile and actual Chromium IndexedDB. Actual UI actions cover Proposal acceptance/automatic scheduling, native atomic failure followed by explicit Retry without reacceptance, V14 export/import/re-export/reload, clear/confirmation/reload and fresh lawful operation after replacement. Three-role rows are read directly from IndexedDB. The alreadyRealized check uses the mounted canonical command because a successful UI no longer offers Retry; it is labeled accordingly.

Controlled delivery cases hold actual transaction completion separately for each owner, then exercise actual clear and import busy feedback and retained Goal draft. Other cases suppress one request acknowledgment while allowing native commit/terminal observation, producing truthful unconfirmed/protected feedback and preserving raw evidence on denied clear. These are precise fault seams, not claims about natural failure prevalence.

At **320/390/768/1280 CSS px**, the driver checks no document overflow and primary control heights at least 43.5 px, retaining feedback measurements and representative 320/390 screenshots. A 320×420 keyboard case records visible focus on the next semantic control. Narrow uncertainty and reduced-height screenshots were visually inspected. Exact V14 data is compared with only the contractually unordered top-level fact collection keyed by ID; nested order, timestamps, revisions, optional absence and other collections remain exact.

Native History/Actual/Progress are empty and unchanged in this disposable fixture. Nonempty frozen historical and independent evidence preservation is demonstrated by retained permanent V14/product-evidence suites. No physical-device, mobile OS, file-picker, soft-keyboard, screen-reader or native-zoom certification is claimed. This gate covers affected existing surfaces, not the unimplemented Review redesign. See the [reproduction guide](evidence/task-9.29.4/REPRODUCTION_AND_VALIDATION_RESULT.md) for exact commands, fixture provenance, seams and intermediate corrections.

## 9. Validation and bundle

Final frozen-source validation: **172 test files / 1,767 tests passed** in 177.65 seconds with one worker. **Lint, typecheck, production build, bundle policy and native production driver passed.** Baseline was 166 files / 1,718 tests; this task adds 6 test files and 49 tests. Final browser evidence contains 45 viewport measurements, zero horizontal-overflow cases, a minimum measured primary height of 44 px, visible keyboard focus and zero captured browser exceptions.

| Metric | Baseline | Final | Delta / hard limit |
| --- | ---: | ---: | ---: |
| Initial raw bytes | 633,786 | 638,327 | +4,541 / 685,000 |
| Initial gzip bytes | 166,306 | 167,653 | +1,347 / 170,000 |
| Largest lazy chunk | 62,657 | 62,652 | −5 / 100,000 |
| Total JS bytes | 1,279,887 | 1,294,546 | +14,659; advisory |

All hard bundle gates pass, leaving **2,347 gzip bytes** of initial headroom. Existing initial-gzip headroom and aggregate architecture-review advisories remain; no threshold was increased. Lifecycle shells remain small, while verification, Proposal, realization and foundation engines stay lazy. Final lint/typecheck/build/bundle logs and source hashes are retained. The final full suite runs separately from build/static work. Intermediate failures and their corrections remain visible in the evidence guide.

## 10. Files, compatibility and forensic effects

The [file manifest](evidence/task-9.29.4/FILE_MANIFEST_RESULT.md) lists every task-created or task-modified path and purpose. The task-relative patch and [preservation audit](evidence/task-9.29.4/preservation-RESULT.json) distinguish this task from earlier dirty work. Fourteen pre-existing application/test files changed; nine new application/test files implement helpers and permanent regression evidence. Reports, logs, exports, measurements and screenshots all use RESULT filenames.

No database schema 11, Proposal/Accepted/Realization durable version, V14 or older backup reader, serializer, staging/journal representation, dependency/lockfile, publication physical protocol, Structure temporal policy or retirement state changed. Legacy/incomplete accepted evidence remains inspectable/inapplicable; unresolvable/orphan evidence remains preserved/protected. No orphan cleanup, historical normalization, inferred race-causation classification, Progress credit or implicit publication was added. Profile semantics remain authored setup independent of acceptance/realization.

All prior inputs, RESULTs, ADRs, proposed contracts, diagnostic sources and observations are preserved. Evidence is local; no commit or remote backup is asserted.

## 11. Bounded ledger and resumption

The final ledger marks the demonstrated Proposal and realization boundaries repaired under one registered live store/owner composition. Publication and Structure remain covered by their named accepted contracts and retained tests. Corrective PlanDecision/Sleep and contextual editor/Goal handoffs retain their qualified prior classifications; an unverified row is neither a defect nor universal safety proof. No cross-tab, arbitrary raw writer, multi-store or global-lock guarantee is added.

Original Task 9.29 remains pending repair review and a separately authorized continuation with distinct input and RESULT paths. Preserve both blocked executions, reconcile the ledger and finish the previously stopped capability/governing review before claiming complete Review workflow readiness. No third destination, broad layout change, retirement, recurrence, release/replacement or Found Time work is delivered here.

## 12. Readback and determination

Final RESULT and acceptance ADR readback, path/heading/status/scope checks and immutable contract verification are recorded in `evidence/task-9.29.4/readback-RESULT.json` after validation.

**The task is complete when Proposal persistence, original-lifetime automatic handoff, explicit realization, physical writes, complete verification, and replacement follow the accepted ordering so displaced operations cannot reinstall acceptance or orphan scheduled facts—while preserving separate authorities, exact geometry and lineage, current-source checks, compatibility, and truthful outcomes.**

**Task 9.29.4 — Acceptance-to-Realization Lifecycle & Replacement Isolation Repair V1 is COMPLETE. Task 9.29 workflow convergence remains pending separate continuation and acceptance.**
