# Task 9.29 — Publication replacement safety reproduction RESULT

## Classification

Controlled automated concurrency evidence, **not native browser/mobile observations**. Production store, generation, Review query, materializer, publication owner, V14 export/import, full clear, durable storage adapter and restart reads are real. The only fault seam delays the HistoricalPlan `storage.mutate` call before delegating its exact arguments to the original adapter. Memory localStorage and a fresh fake IndexedDB factory isolate each case. No preserved dogfood state is opened.

Fixture provenance: the canonical Sleep/Work authoring sequence follows `code/src/state/sleepPublicationExecution.test.ts`. It authors required 120-minute Sleep with 30-minute buffers and a Work cycle through production commands. It generates September 17, 2026 and verifies **zero canonical publication blockers**, then captures the actual reviewed fingerprint. Neither a fake read model nor a fabricated publication is used.

## Reproduction

From `code/`:

```sh
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29/contract-repro-config-RESULT.mjs --maxWorkers=1
```

The config is outside `code/`; Vite's config bundler selected `/home/sid/node_modules/.vite-temp` in this environment. The first sandbox run failed to create it. The same command was then run with approved escalation. No dependency installation occurred. All diagnostic source, observations and logs are retained here, not only in `/tmp`.

Sequence for both parameterized cases:

1. Author and generate a canonical publishable schedule; query Review and assert no blockers and empty history.
2. Export a valid V14 backup containing empty history.
3. Submit exactly one `publishScheduleRange` with the reviewed source fingerprint, explicit half-open one-day range and fixed supplied publication instant.
4. Hold its physical History write. Record that the owner supplied **no** optional storage admission callback.
5. Run actual `clearLocalData` or `importBackupV14`. Assert `cleared` or `restoredV14`, cleared Preview, and empty History.
6. Release the old write. Observe `published` and one historical batch in the replaced runtime.
7. Bootstrap a new production store over the same disposable storage. Assert one retained batch and exact deep equality of the complete historical export, including IDs, timestamps, ordering, frozen Sleep records and optional fields. No normalization is used.

Both replacement epochs advance from 0 to 1. Exact outputs are in `publication-clear-observations-RESULT.json` and `publication-restore-observations-RESULT.json`. The incoming backup and pre-release history contain no publication; the old operation adds one **after replacement succeeds**. This is not a late display message alone.

These diagnostic tests assert the observed defect so that a passing diagnostic confirms reproduction. They are isolated from the ordinary permanent suite and are **not regression tests claiming safe behavior**. A repair must replace this outcome with lawful prewrite rejection/quiescence, preserve commit certainty if a write already started, and retain the diagnostic as historical evidence.

## Narrowed hypothesis / intermediate failures

The first probe began a runtime restore transaction immediately after publication dispatch. It expected a write but got `rejected/materializationFailure` and empty history: active transaction state makes captured Sleep authority incomplete. That is an existing effective guard, not a defect. The retained `initial-active-transaction-RESULT.log` records the failed hypothesis. The confirmed case moves the pause beyond the current guard to the actual asynchronous physical-write boundary.

`contract-repro-RESULT.log` retains the initial Vite cache startup error. An intermediate detail run also used the wrong working-directory-relative edit path and made no source change. The final formatted reproduction passes both diagnostic cases; see `contract-repro-retry-RESULT.log`.

## Missing contract

`schedulePublication.ts` checks a source-content fingerprint after querying and passes `isCurrent` to HistoricalPlan. `historicalPlanSurface.ts` checks that function before calling `storage.mutate`, but does not pass an admission callback into it. The adapter awaits `open()` before creating the physical transaction. HistoricalPlan has neither a replacement epoch/generation guard for this continuation nor a publication lease consulted by transaction begin. `dayFrameStore.ts` currently checks **Structure** quiescence for that boundary.

The required owner decision concerns publication admission across asynchronous work, precommit physical admission, replacement quiescence, and how a started/committed operation settles without overwriting replacement runtime. It must preserve publication's own time/order and commit-certainty contracts. This report neither adopts Structure's clock policy for publication nor proposes a schema/migration/repair authority.
