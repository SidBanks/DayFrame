# Task 3.15C — Stabilize Phase 3 Validation and Reconcile Governance

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded validation-stability, deterministic-test, governance-reconciliation, and Phase 3 closure-preparation task.

Task 3.15 identified two remaining closure-quality gaps after the substantive Phase 3 architecture was found coherent:

* **P3-GAP-003** — a timing-sensitive ExecutionHistory IndexedDB test relied on a fixed 10 ms delay and caused the mandatory full suite to fail intermittently;
* **P3-GAP-004** — `CURRENT_STATE.md` and `ROADMAP.md` still contain superseded “future prerequisite” / “Backup V3 pending” prose beside later completion claims, making current-state interpretation unnecessarily ambiguous.

Tasks 3.15A and 3.15B have now closed the two substantive implementation gaps found by Task 3.15:

* HistoricalPlan-backed execution reporting reachability now exists;
* full clear now truthfully settles and reports all five durable authorities while preserving ExecutionHistory anti-resurrection.

Task 3.15C therefore performs **no new product feature work**.

Its purpose is:

> **Make the Phase 3 validation baseline deterministic and fully green, then reconcile current-state governance so the repository clearly describes the architecture that actually exists before the final Phase 3 closure audit.**

---

# 1. Execution Artifact Rules

Before implementation:

1. verify the supplied Task 3.15C artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies when both are available;
4. record SHA-256;
5. review:

   * Task 3.15 result;
   * Task 3.15A result;
   * Task 3.15B result;
   * the timing-sensitive ExecutionHistory test identified as P3-GAP-003;
   * current ExecutionHistory durability APIs and test seams;
   * `CURRENT_STATE.md`;
   * `ROADMAP.md`;
   * `DECISIONS.md`;
   * `CHANGELOG.md`;
6. do not modify the immutable task artifact after execution begins.

Create result:

`docs/implementation/phase-3/TASK_3.15C_STABILIZE_PHASE_3_VALIDATION_AND_RECONCILE_GOVERNANCE_RESULT.md`

---

# 2. Purpose

Task 3.15C closes the two non-semantic gaps preventing a clean Phase 3 closure boundary:

```text
P3-GAP-003
timing-sensitive validation
        ↓
replace wall-clock assumption
        ↓
deterministic completion proof

P3-GAP-004
superseded governance prose
        ↓
reconcile current-state truth
        ↓
one unambiguous Phase 3 status
```

This task must not alter Phase 3 domain semantics merely to make the tests pass.

---

# 3. Governing Validation Principle

> **A test for asynchronous durability must wait on the durability contract, not on an arbitrary amount of wall-clock time.**

A passing test because “10 ms happened to be enough” is not deterministic evidence.

---

# 4. Governing Governance Principle

> **Current-state documentation must describe the current system as current truth. Historical sequencing may be preserved, but superseded claims must not compete with active claims.**

`CURRENT_STATE.md` should not require a reader to infer that an earlier “not yet implemented” statement was later superseded.

---

# 5. Scope

Task 3.15C includes:

* audit of fixed-delay Phase 3 tests;
* replacement of P3-GAP-003's timing assumption with deterministic completion;
* targeted audit for similar fixed-delay durability assertions;
* preservation of production async semantics;
* full-suite repeatability verification;
* reconciliation of superseded Phase 3 governance prose;
* correction of current Phase 3 status;
* confirmation that 3.15A and 3.15B are reflected accurately;
* preparation for Task 3.16 closure.

It does **not** include:

* new reporting behavior;
* HistoricalPlan changes;
* ExecutionHistory semantic changes;
* Backup V3 changes;
* full-clear semantic changes;
* historical metrics;
* adherence;
* Goals;
* Progress;
* learning;
* broad documentation rewrite;
* Phase 4 implementation.

---

# 6. Required Initial Validation Audit

Before changing tests, identify the exact failing test reported in Task 3.15:

`ExecutionHistory V1 IndexedDB migration > appends ordinary reports transactionally and verifies them after switch`

The audit recorded:

```text
expected: durable
received: pending
after fixed 10 ms delay
```

while the same test file immediately passed in focused execution.

Trace:

1. what asynchronous operation the test actually needs to await;
2. what production promise/subscription/status change represents completion;
3. whether the current test seam exposes that signal;
4. whether any equivalent fixed delays exist in related Phase 3 tests.

---

# 7. Do Not Fix Production Timing to Satisfy the Test

Do not:

* force IndexedDB writes to resolve synchronously;
* add artificial production delays;
* alter durability status transitions merely to make the test predictable;
* hide `pending`.

The production contract intentionally distinguishes accepted authority from durable settlement.

The test must honor that contract.

---

# 8. Preferred Deterministic Strategy

Use the narrowest existing completion signal.

Preferred options, in order:

1. await the actual returned persistence/clear/report promise;
2. await an existing durability transition promise;
3. subscribe to the relevant durability status and resolve on terminal state;
4. inject a deterministic controlled persistence adapter;
5. add a test-only helper around existing public/internal contracts.

Do not introduce a new production API solely for one test unless the missing completion signal is itself an architectural gap.

---

# 9. Fixed-Delay Search

Search Phase 3 tests for constructs such as:

```text
setTimeout
sleep
delay(
waitForTimeout
new Promise(resolve => setTimeout(...)
```

especially around:

* ExecutionHistory;
* HistoricalPlan;
* migration;
* IndexedDB;
* restore;
* readiness;
* Backup V3;
* full clear.

Classify each use as:

* harmless scheduling yield;
* UI timer semantics;
* deterministic bounded retry mechanism;
* fragile async completion assumption.

Only the last category must be corrected.

---

# 10. Scope Discipline for Timing Cleanup

Do not opportunistically rewrite every asynchronous test.

Fix:

* P3-GAP-003;
* any directly equivalent fragility discovered in the same Phase 3 durability boundary.

Leave unrelated timer-based UI behavior alone.

---

# 11. ExecutionHistory Completion Contract

Document the actual lifecycle tested:

```text
report accepted
    ↓
runtime authority = accepted
durability = pending
    ↓
IndexedDB write / reread verification
    ↓
durability = durable
```

The deterministic test must prove both:

1. `pending` can exist legitimately;
2. terminal `durable` is observed only after actual persistence completion.

---

# 12. Failure Path Preservation

Do not weaken existing tests for:

* durability failure;
* retry;
* protection;
* migration failure;
* anti-resurrection.

Replacing fixed delay must not turn failure-path tests into success-only tests.

---

# 13. Test Isolation

Confirm the timing-sensitive behavior is not caused by:

* shared fake IndexedDB state;
* reused database names;
* leaked timers;
* test-order dependence;
* unresolved promises from previous tests.

If such a problem exists, fix the isolation issue rather than merely waiting longer.

---

# 14. Fake IndexedDB Usage

Continue using the existing development-only `fake-indexeddb` infrastructure.

Do not add another IndexedDB simulation library.

---

# 15. Repeatability Requirement

After correcting P3-GAP-003, run the previously flaky test repeatedly.

Minimum recommended:

```text
same focused file × 10
```

or an equivalent repeat facility.

The result should be consistently green.

Do not use repeated success as a substitute for deterministic design; use it as verification after removing the fixed-delay assumption.

---

# 16. Full-Suite Repeatability

Run the full test suite more than once after focused validation.

Recommended:

```text
npm test
npm test
npm test
```

if runtime is reasonable.

The goal is to demonstrate that Phase 3 closure is not dependent on scheduler luck.

Document exact runs.

---

# 17. Build Warning

The current build reports an advisory chunk-size warning around 580 kB. Task 3.15B recorded a 580.27 kB minified application chunk while the build itself passed.

Task 3.15C must classify this warning but does **not** need to solve it unless it violates an existing Phase 3 performance requirement.

Likely classification:

> non-blocking build optimization debt.

Do not introduce code splitting solely under this task unless accepted project governance already requires the warning to be eliminated before phase closure.

---

# 18. Governance Audit — CURRENT_STATE.md

Review all Phase 3 sections.

Task 3.15 identified stale passages including:

* HistoricalPlan described as a future prerequisite even though it is implemented;
* Backup V3 described as pending immediately before/near completion statements.

Reconcile these so `CURRENT_STATE.md` answers:

> What is true now?

Historical task chronology may be retained elsewhere or explicitly marked as historical.

---

# 19. CURRENT_STATE Current Truth

At minimum current-state governance should accurately state:

* ExecutionHistory V1 exists;
* correction/retraction exists;
* Outcome Summary remains categorical, not adherence;
* HistoricalPlan V1 exists and is durable;
* HistoricalPlan-backed reporting exists;
* ExecutionHistory IndexedDB authority/anti-resurrection exists;
* async readiness/shared authority transaction exist;
* cross-storage restore exists;
* Backup V3 exists;
* five-authority full clear exists;
* Phase 3 is awaiting final closure audit rather than substantive prerequisite work.

---

# 20. Governance Audit — ROADMAP.md

Review Phase 3 roadmap wording.

Earlier roadmap statements that historical metrics were blocked by the absence of planned-occurrence history may remain useful as chronology, but they must no longer read as current blockers now that HistoricalPlan exists.

Update current roadmap status to distinguish:

```text
previous prerequisite
    ✓ completed

current next step
    → Phase 3 closure audit
```

Do not move historical metrics or Goals into Phase 3 merely because the architecture can now support their design.

---

# 21. Governance Audit — DECISIONS.md

Review the accepted Phase 3 decisions and ensure later ADRs clearly supersede earlier provisional state where needed.

Do not rewrite valid historical ADR decisions.

Only clarify supersession/current applicability if ambiguity exists.

---

# 22. Governance Audit — CHANGELOG.md

Ensure recent Phase 3 work is represented accurately, including:

* 3.15A HistoricalPlan-backed reporting;
* 3.15B five-authority terminal full clear.

Do not convert CHANGELOG into architecture documentation.

---

# 23. Governance Chronology vs Current State

Use this distinction consistently:

### Historical record

Allowed to say:

> At Task 3.7, HistoricalPlan did not yet exist.

### Current-state claim

Must say:

> HistoricalPlan V1 is implemented.

Do not delete useful chronology just because it is old.

Mark or relocate it so it cannot be mistaken for current truth.

---

# 24. Phase 3 Status Line

Update the top-level Phase 3 status where appropriate.

Task 3.15 found that current wording under-described the implemented system.

The new status should accurately reflect that Phase 3 now has:

* durable planned history;
* durable execution history;
* historical reporting;
* correction;
* summary projection;
* migration;
* restore;
* Backup V3;
* truthful full clear;

while still being **pending final closure audit**.

Do not mark Phase 3 complete under Task 3.15C.

---

# 25. P3-GAP-001 Governance

Confirm governance now reflects Task 3.15A:

> HistoricalPlan-backed execution reporting exists.

Do not leave P3-GAP-001 described as current.

---

# 26. P3-GAP-002 Governance

Confirm governance now reflects Task 3.15B:

> full clear settles all five durable authority surfaces and preserves anti-resurrection.

Do not leave four-surface result semantics described as current.

---

# 27. P3-GAP-003 Closure

P3-GAP-003 is closed only when:

* the fixed-delay assertion is removed or proven not to be a completion assumption;
* deterministic completion is used;
* repeated focused execution passes;
* repeated full-suite execution passes.

One green run alone is insufficient.

---

# 28. P3-GAP-004 Closure

P3-GAP-004 is closed only when:

* current-state documents no longer contain contradictory active claims;
* ROADMAP clearly separates completed prerequisites from future work;
* Phase 3 current status is unambiguous;
* historical chronology remains readable without masquerading as present state.

---

# 29. No Semantic Governance Drift

While reconciling docs, do not silently change architecture.

Governance must describe implemented behavior, not desired future behavior.

If a document claim cannot be supported by current source/tests, remove or qualify it rather than “promoting” the implementation by prose.

---

# 30. No Historical Metrics Claim

Governance may state:

> architecture is structurally ready for future coverage-aware historical metrics design.

It must not state:

> adherence is implemented.

Task 3.15 explicitly found metrics structurally possible but semantics not yet defined.

---

# 31. No Goals/Progress Claim

Likewise:

* Goals/Progress design may now be architecturally supportable;
* no Goal authority exists today.

Do not imply otherwise.

---

# 32. Validation Baseline Record

At the end of Task 3.15C, record one authoritative closure-prep baseline containing:

* lint result;
* typecheck result;
* test-file count;
* test count;
* repeated test results;
* build module count;
* build warnings;
* `git diff --check`.

This becomes the baseline Task 3.16 should independently verify.

---

# 33. Production Change Policy

Task 3.15C should ideally produce **no production behavior changes**.

Permitted executable changes:

* test changes;
* test helpers;
* test-only dependency/wiring adjustments;
* narrowly necessary completion-observation seam only if existing production API genuinely lacks any deterministic way to observe an already-defined durability contract.

If production code changes, justify them explicitly.

---

# 34. No Broad Refactor

Do not use the governance cleanup as an opportunity to:

* reorganize all docs;
* rename every Phase 3 artifact;
* rewrite ADR structure;
* clean all legacy comments;
* change directory conventions.

Bound the work to Phase 3 closure truthfulness.

---

# 35. Timing-Test Matrix

The result must include:

| Test / location | Old completion mechanism | Classification | New mechanism |
| --------------- | ------------------------ | -------------- | ------------- |

Include P3-GAP-003 and any equivalent fragile test corrected during the task.

---

# 36. Governance Reconciliation Matrix

Include:

| Document         | Superseded/current ambiguity | Resolution |
| ---------------- | ---------------------------- | ---------- |
| CURRENT_STATE.md |                              |            |
| ROADMAP.md       |                              |            |
| DECISIONS.md     |                              |            |
| CHANGELOG.md     |                              |            |

---

# 37. Phase 3 Current-State Matrix

The result must include:

| Capability                   | Current status after 3.15C |
| ---------------------------- | -------------------------- |
| Preview / operative planning |                            |
| HistoricalPlan               |                            |
| Historical reporting         |                            |
| ExecutionHistory             |                            |
| correction/retraction        |                            |
| Outcome Summary              |                            |
| historical metrics           |                            |
| async readiness              |                            |
| cross-storage restore        |                            |
| Backup V3                    |                            |
| five-authority full clear    |                            |
| Goals/Progress               |                            |
| Phase 3 closure              |                            |

---

# 38. Test — Pending Is Legitimate

The corrected ExecutionHistory test should explicitly permit observing `pending` before durable settlement if the test controls the persistence gate.

This is stronger than merely waiting directly for `durable`.

It proves the architectural distinction remains intact.

---

# 39. Test — Durable Terminal State

After the deterministic completion gate resolves:

```text
durability = durable
```

and persisted evidence rereads correctly.

---

# 40. Test — No Test-Order Dependence

Run the target test:

* alone;
* with its file;
* in the full suite.

All must pass.

---

# 41. Test — Failure Determinism

If the same fixture supports injected persistence failure, ensure terminal failure tests do not depend on arbitrary sleeps either.

---

# 42. Test — Retry Determinism

Where directly adjacent to P3-GAP-003, verify retry tests await actual completion.

Do not broaden into unrelated test cleanup.

---

# 43. HistoricalPlan Timing Audit

Task 3.15B already introduced deterministic clear settlement and explicitly avoided arbitrary sleeps.

Confirm HistoricalPlan Phase 3 durability tests are not hiding equivalent fixed-delay assumptions.

If none exist, document that.

---

# 44. Restore Timing Audit

Restore/journal tests should use explicit staged failure/control rather than sleeps.

Confirm.

Do not rewrite already deterministic infrastructure tests.

---

# 45. Readiness Timing Audit

Confirm readiness tests use `whenReady()` or controlled participants, not arbitrary delays.

---

# 46. Backup V3 Timing Audit

Confirm restart/restore tests await the restore/bootstrap contract.

No arbitrary timeout-based correctness.

---

# 47. Full-Clear Timing Audit

Task 3.15B now awaits explicit clear promises and controlled gates.

Confirm no regression.

---

# 48. Documentation Evidence Standard

When updating governance, cite/reference existing task/checkpoint/ADR identifiers according to repository convention.

Avoid unsupported summary claims.

---

# 49. Preserve Architecture History

Do not remove evidence of why:

* HistoricalPlan was introduced;
* restore prerequisites became deep;
* Backup V3 required cross-storage transactions.

The goal is clarity, not erasure of project history.

---

# 50. Current State Should Be Concise

If `CURRENT_STATE.md` has accumulated large obsolete blocks, prefer:

* marking older sections superseded;
* consolidating current summary;
* linking to historical task artifacts;

rather than retaining contradictory active-status paragraphs.

Follow current project style.

---

# 51. ROADMAP Should Be Forward-Looking

Keep completed tasks for record if that is current convention, but the active next step should be unmistakable:

```text
3.15A ✓
3.15B ✓
3.15C → current / complete after this task
3.16 → Phase 3 closure audit
```

No metrics implementation before 3.16.

---

# 52. DECISIONS Should Preserve Decision History

Do not delete earlier ADRs because later work built on them.

If later ADR supersedes an earlier operational assumption, annotate current applicability.

---

# 53. CHANGELOG Should Stay Chronological

Do not rewrite old entries to make them sound current.

Add accurate 3.15C entry instead.

---

# 54. Build Chunk Warning Determination

Result must state one of:

* blocking by existing requirement;
* non-blocking optimization debt;
* resolved incidentally.

Do not ignore it entirely because it appears in the validation baseline.

---

# 55. No New Performance Work

Unless an explicit existing acceptance threshold says otherwise, do not create code-splitting changes.

Phase 3 closure is about semantic correctness and deterministic validation.

---

# 56. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.15C_STABILIZE_PHASE_3_VALIDATION_AND_RECONCILE_GOVERNANCE_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing P3-GAP-003
4. Governing P3-GAP-004
5. Initial Validation Audit
6. Initial Governance Audit
7. Files Changed
8. ExecutionHistory Flaky Test Root Cause
9. Old Timing Mechanism
10. Deterministic Completion Mechanism
11. Production Semantics Preservation
12. Fixed-Delay Search
13. Equivalent Fragile Tests Found
14. Test Isolation Audit
15. Focused Repeatability
16. Full-Suite Repeatability
17. HistoricalPlan Timing Audit
18. Restore Timing Audit
19. Readiness Timing Audit
20. Backup V3 Timing Audit
21. Full-Clear Timing Audit
22. CURRENT_STATE Reconciliation
23. ROADMAP Reconciliation
24. DECISIONS Reconciliation
25. CHANGELOG Reconciliation
26. Historical vs Current-State Distinction
27. Phase 3 Status Update
28. P3-GAP-001 Governance Confirmation
29. P3-GAP-002 Governance Confirmation
30. P3-GAP-003 Closure Determination
31. P3-GAP-004 Closure Determination
32. Historical Metrics Wording
33. Goals/Progress Wording
34. Build Warning Determination
35. Production Change Audit
36. Timing-Test Matrix
37. Governance Reconciliation Matrix
38. Phase 3 Current-State Matrix
39. Tests Changed
40. Documentation Changed
41. Architectural Alignment Assessment
42. Deviations
43. Discoveries and Deferred Work
44. Task 3.16 Readiness Determination
45. Focused Validation
46. Repeated Full Validation
47. Final Completion Determination

---

# 57. Required Architectural Invariants

At completion prove:

1. P3-GAP-003 no longer relies on a fixed wall-clock delay.
2. ExecutionHistory accepted authority can still legitimately be `pending`.
3. Deterministic persistence completion produces `durable`.
4. Test correctness does not depend on scheduler speed.
5. The corrected test passes alone and in the full suite.
6. Equivalent Phase 3 durability tests do not rely on the same fragile pattern, or any found equivalents are corrected.
7. No production durability semantic was changed merely for testing.
8. `CURRENT_STATE.md` has one unambiguous current Phase 3 truth.
9. HistoricalPlan is no longer described as an unmet current prerequisite.
10. Backup V3 is no longer described as currently pending.
11. 3.15A HistoricalPlan-backed reporting is reflected as current behavior.
12. 3.15B five-authority full clear is reflected as current behavior.
13. ROADMAP distinguishes completed prerequisites from future work.
14. Historical metrics remain not implemented.
15. Goals/Progress remain not implemented.
16. Phase 3 remains pending Task 3.16 closure, not falsely marked complete.
17. Build warning is explicitly classified.
18. Full repository validation is repeatedly green.
19. No new product/domain semantics are introduced.

---

# 58. Focused Validation

Run focused validation for the corrected test and its nearest related suites.

At minimum:

```text
npx vitest run <target ExecutionHistory IndexedDB test file>
```

Repeat deterministically multiple times.

Also run the relevant:

* ExecutionHistory surface tests;
* migration tests;
* durability tests;

if separate.

Record exact counts.

---

# 59. Repeated Full Validation

Run:

```text
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Then rerun `npm test` at least two additional times if practical.

Desired outcome:

```text
full test run 1 → pass
full test run 2 → pass
full test run 3 → pass
```

Record exact:

* file count;
* test count;
* failures;
* build module count;
* warnings.

---

# 60. Stop Conditions

Stop and report if:

* the flaky test exposes a real nondeterministic production durability race rather than a test wait defect;
* no deterministic completion signal exists without redesigning ExecutionHistory persistence;
* repeated full-suite runs expose multiple independent nondeterministic failures;
* governance cannot be reconciled without making unsupported claims;
* current implementation materially contradicts the accepted 3.15A or 3.15B results;
* fixing P3-GAP-003 requires altering domain semantics;
* full baseline cannot be made consistently green without broader architecture work.

Do not increase the timeout or sleep duration and declare success.

---

# 61. Follow-On Boundary

If Task 3.15C completes successfully:

> **Proceed to Task 3.16 — Phase 3 Closure Audit and Publication Checkpoint.**

Task 3.16 should be read-only except for its closure/checkpoint/governance artifacts.

It should:

* independently rerun repository validation;
* recheck the Task 3.15 integration invariants;
* confirm P3-GAP-001 through P3-GAP-004 are closed;
* classify any residual debt;
* declare Phase 3 complete or identify the narrowest remaining blocker;
* create the final Phase 3 publication checkpoint.

Do not begin historical metrics, Goals, or Progress before that closure determination.

---

# 62. Task Determination

**Authorized:** deterministic replacement of the P3-GAP-003 fixed-delay validation assumption, narrow audit/correction of equivalent Phase 3 timing fragility, reconciliation of superseded current-state and roadmap prose, accurate Phase 3 status updates, repeated validation, and closure preparation.

**Not authorized:** new product behavior, new domain semantics, HistoricalPlan redesign, ExecutionHistory redesign, Backup V3 changes, restore changes, metrics, adherence, Goals, Progress, learning, performance refactor, or Phase 4 work.

The governing closure-preparation principle is:

> **Before Phase 3 can be closed, its architecture must not only be correct—it must be reproducibly provable and accurately described. A scheduler-dependent green test is not reliable evidence, and a current-state document that simultaneously says a feature is pending and complete is not a trustworthy project record.**

---

# 63. Final Completion Statement

**Task 3.15C is complete when the timing-sensitive ExecutionHistory IndexedDB validation identified by P3-GAP-003 no longer relies on a fixed wall-clock delay and instead waits deterministically on the actual persistence/durability contract; when the test explicitly preserves the legitimate accepted-then-pending-then-durable lifecycle rather than changing production semantics to make timing easier; when the target test passes repeatedly in isolation, in its containing suite, and across repeated full repository runs; when a bounded audit confirms no equivalent Phase 3 persistence/readiness/restore/full-clear correctness test still relies on the same fragile timing pattern or corrects any directly equivalent instances found; when `CURRENT_STATE.md`, `ROADMAP.md`, `DECISIONS.md`, and `CHANGELOG.md` clearly distinguish historical chronology from present truth, no longer present HistoricalPlan or Backup V3 as unmet current prerequisites, accurately reflect HistoricalPlan-backed reporting and five-authority terminal full clear, and describe Phase 3 as awaiting only its final closure audit; when governance continues to state that historical metrics, adherence, Goals, and Progress are not yet implemented; when the build chunk warning is explicitly classified without unnecessary performance refactoring; when the full validation baseline is repeatedly green and recorded; when P3-GAP-003 and P3-GAP-004 are both demonstrably closed; and when no new product behavior, persistence/domain semantics, metric, Goal, Progress model, learning system, performance architecture, or unrelated feature is introduced, leaving Task 3.16 as the sole remaining Phase 3 closure boundary.**
