# Task 9.29.3 reproduction and validation — RESULT

Contract work only. All application/permanent-test/configuration inputs remain unchanged. Diagnostics live outside normal test discovery and the production graph; their passing assertions confirm observed behavior, not repaired safety.

## Original five cases

`realization-replacement-repro-RESULT.test.ts` and `contract-repro-config-RESULT.mjs` are byte-for-byte copies of the continuation artifacts at the same directory depth. Imports still reach the actual current store/adapter; observation URLs now resolve under this task's evidence directory. No prior file is overwritten.

From `code/`:

```sh
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29.3/contract-repro-config-RESULT.mjs --configLoader runner --maxWorkers=1
```

Vite's supported runner loader avoids the external bundled-config temporary path encountered in the earlier task. This run needed no dependency installation, existing configuration mutation or sandbox escalation. Five cases pass: healthy automatic scheduling; automatic clear/V14; explicit retry clear/V14. The actual prior failure for retry is an admission denial by the real adapter for realization puts; acceptance remains and retry uses its exact ID without another acceptance.

Every delay forwards original rows/admission/observer arguments. Original acceptance uses actual saved Goal/Demand/first-class Sleep, canonical allocation/Proposal derivation/recording and `acceptProposalOption`. No accepted record or successful persistence result is fabricated. The fake clock controls Date only, not asynchronous storage scheduling. Fact rows are compared by actual identity with exact payload equality, and independent reopen occurs after command/replacement settlement.

A separate `detailed-realization-repro-RESULT.test.ts` retains the same five cases and adds observation fields for full pre-release accepted/runtime/physical authority, phase counts, outer versus inner outcome, and independently reopened/startup authority. It writes only `detailed-*-observations-RESULT.json`:

```sh
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29.3/detailed-repro-config-RESULT.mjs --configLoader runner --maxWorkers=1
```

The original four unsafe orderings each have one attempted realization mutation, zero created realization transactions when replacement succeeds, then one created transaction after release. Outer automatic result is accepted; its inner result is realized. Retry directly returns realized. Epoch advances 0 → 1; orphan records survive and restart protects realization/store. These outcomes are distinct from the proposed busy-first repair.

## Extended bounded evidence

```sh
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29.3/extended-repro-config-RESULT.mjs --configLoader runner --maxWorkers=1
```

Four cases:

- Two earlier Proposal commit pauses, clear and V14: stop after acceptance revalidation but before the Proposal clear+put transaction. No accepted record has committed yet. Actual replacement succeeds; resuming the unguarded Proposal mutation reinstalls acceptance. Keep this finding distinct from the original already-committed handoff gap. Exact Proposal rows include record type, ID and revision in comparison; no blanket ID/time normalization.
- Same-acceptance automatic realization plus explicit retry while the first is paused: both create native transactions today. Deterministic keys leave one runtime fact but do not make the two commands one physical attempt. This is positive evidence for selecting a concurrency contract rather than assuming idempotent keys serialize callers.
- Healthy three-role control: actual resource-footprint specification/association produces required 60-minute productive, 30-minute support and 15-minute Buffer claims through canonical evaluation/acceptance. One realization plus three exact facts persists and reloads with ready ingress. It establishes valid multi-role fixture provenance, not fault-injection coverage of the complete future matrix.

The initial extension failed only the new multi-role fixture: replacing its existing productive-only association omitted the required `expectedRevision`. The new fixture was corrected to supply revision 1; assertions and production code were not weakened. `extended-fixture-failure-RESULT.log` retains the failure; final 4/4 run is in `extended-repro-RESULT.log`.

## Repository validation

Run from `code/`:

```sh
npm exec vitest -- run src/state/realizationSurface.test.ts src/state/proposalSurface.test.ts src/state/sleepPlanningIntegration.test.ts src/state/goalStructurePlanningSafety.test.ts src/state/publicationReplacementIsolation.test.ts src/state/historicalPlanLifecycle.test.ts src/state/dayFrameBackupV14Restore.test.ts src/ui/tests/ScheduleReviewPanel.test.tsx --maxWorkers=1
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run build
npm run check:bundle
npm run test -- --maxWorkers=1
```

Focused suite: 8 files / 75 tests pass. The initial complete run passed 1,717/1,718; the existing `GoalStructureAuthoring` related-navigation/V14 restore test did not observe its expected restore-success message within the current wait. No causal diagnosis is established. Its unchanged isolated suite then passed 27/27; the complete suite was repeated without source, assertion, timeout or configuration changes. Both the initial failure and isolated rerun logs are retained. The final complete suite passed **166 files / 1,718 tests in 170.82 seconds** and ran separately from build/static jobs with one worker and unchanged selection/timeouts/configuration. `git diff --check` runs at repository root. Only new report/extended diagnostic artifacts are formatted; the copied original diagnostic stays exact. One fresh build establishes both before/after sizes because all production inputs are hash-unchanged. No post-repair bundle or performance prediction is claimed.

## Limits and preservation

Disposable in-memory Web Storage and separate fake IndexedDB factories only. No preserved Dogfood state, physical device, native browser workflow, OS dialog, mobile accessibility certification or real-user incidence study. No cross-tab/multiple-active-store safety is tested. The future repair requires native actual acceptance/automatic realization, explicit retry, V14 round trip, clear/reload and affected current-surface mobile feedback; this proposal earns none of those UI acceptance gates.

`baseline-hashes-RESULT.json` records every original file. Source hashes distinguish governing versions and present executable source. All durable new artifact names contain RESULT; all are repository-local, not a commit or remote backup. No reset/stash/push/install/cleanup, migration, version change, orphan repair or architecture adoption occurred.
