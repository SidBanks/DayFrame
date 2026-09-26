# Realization / replacement diagnostic — RESULT

This is a defect-confirming diagnostic, not a permanent repaired-behavior regression or native-browser acceptance. Application/test sources and prior evidence are unchanged.

## Execution

Run from `code/` with the installed toolchain:

```sh
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29-continuation/contract-repro-config-RESULT.mjs --maxWorkers=1
```

The first sandbox run failed before tests because Vite attempted to write its config cache under `/home/sid/node_modules/.vite-temp` (EROFS). The explicitly approved retry passed. `contract-repro-sandbox-RESULT.log` retains that startup failure; `contract-repro-RESULT.log` is the final five-case execution. No dependency installation or repository configuration change was used. The diagnostic imports installed Vitest/fake-indexeddb through explicit relative paths because it lives outside `code/`.

## Fixture and exact interleaving

Supporting authoring derives from the existing `state/sleepPlanningIntegration.test.ts` fixture. Every test gets fresh in-memory Web Storage and an independent fake IndexedDB factory. Only Date is fixed at `2026-09-16T12:00:00.000Z`; promise/storage scheduling runs normally. The actual store authors a first-class two-hour Sleep requirement and a Goal with a one-hour Demand, then uses canonical allocation evaluation, Proposal derivation and Proposal recording. No fabricated accepted allocation, realization, successful storage response or publication is injected.

1. The control invokes actual `acceptProposalOption`. Its existing automatic realization succeeds and produces exactly one accepted allocation and one scheduled fact without replacement.
2. Race cases export an actual V14 backup **before acceptance**. Its accepted allocations and realization records are empty; restoring it is a valid way to replace the subsequently accepted work.
3. Automatic cases invoke actual `acceptProposalOption` and pause only when its automatic realization reaches the real adapter's `mutate` call for realization puts. The Proposal acceptance has already committed.
4. Explicit-retry cases first cause a known no-write realization failure: the wrapper delegates to the **real** adapter with admission `() => false` only for realization puts. The existing acceptance remains. That temporary wrapper is removed, then actual `realizeAcceptedAllocation(exactAcceptedId)` is invoked and paused at the same pre-delegation gate.
5. At the gate there is one attempted realization mutation and zero created realization transactions. The wrapper retains the original rows and the caller's original optional admission/observer arguments.
6. Actual `clearLocalData` or actual `importBackupV14` succeeds, advances epoch 0 → 1, and leaves accepted allocations, runtime realization facts and physical realization rows empty.
7. Release delegates the unchanged original mutation to the real adapter. It creates exactly one realization transaction, writes the original realization and fact, and the old owner adopts them. No realization admission callback was supplied. The outer acceptance returns `accepted`, or explicit retry returns `realized`.
8. Check the stored records against the exact attempted values by their actual record IDs, and check runtime realization/fact values directly. IDs, timestamps, revisions, lineage, ordered nested data and optional fields are not normalized. Keyed record lookup accommodates IndexedDB key ordering; the set size is exact.
9. Only after both replacement and the old operation settle, independently reopen the same database and compare exact physical readback. Then create a fresh store. It protects realization ingress and overall readiness (`authorityInitializationFailed`) because the written realization refers to an acceptance removed by replacement. Initialization does not erase the orphan rows.

The four `*-observations-RESULT.json` files retain the exact accepted authority, mutation rows, replacement result, immediately-empty physical readback, late result, adopted runtime, surviving physical records, epochs, counts and restarted protection. Counts refer specifically to realization-put transactions, not the independent transactions used by clear/restore.

## Scope and limitations

One live command-producing store is used. The independent reader/restarted store is constructed after settlement, so this is not a multiple-active-store or cross-tab experiment. The deterministic delay represents asynchronous time before physical transaction creation; it is not a native browser fault or a timeout assumed to cancel storage. The retry's initial admission denial is an explicitly controlled known no-write seam.

The diagnostic proves the realization path's replacement gap. It does not diagnose Proposal persistence before the acceptance commit, every other owner, cross-tab behavior, native incidence or user data affected in the wild. The separate publication repair remains covered by its unchanged permanent suite and is not bypassed or modified here. No preserved Dogfood state was accessed.

## Validation commands

From `code/`:

```sh
npm run test -- --maxWorkers=1
npm run build
npm run check:bundle
npm exec prettier -- --check .
npm run lint
npm run typecheck
```

From repository root: `git diff --check`. Final complete-suite execution runs without concurrent build/static jobs. Only task-created diagnostic/report files are formatted. The immutable continuation is copied byte-for-byte, including its original formatting. Baseline hashes pin all 1,359 original tracked/unignored files; preservation verification checks every one.
