# Reproduction and validation guide — RESULT

Use the captured existing working tree and installed toolchain. No dependency install, preserved Dogfood state, or native browser is required for this isolated diagnostic. Commands below run from `code/`; redirect only into the new task directory. Do not overwrite 9.29 evidence.

## Diagnostic

`contract-repro-RESULT.test.ts` and `contract-repro-config-RESULT.mjs` are exact byte copies of the files with the same names under `../docs/implementation/phase-9/evidence/task-9.29/`. Relative source imports retain the same depth. The config targets only this copied diagnostic; its output path resolves beside the new copy.

```sh
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29.1/contract-repro-config-RESULT.mjs --configLoader runner --maxWorkers=1
```

`--configLoader runner` avoids the bundled config loader's external temporary-directory write. It does not change application/tests/configuration/dependencies or diagnostic assertions. The copied config remains unchanged.

The fixture authors actual canonical Work/Sleep state and generates a fresh one-day Preview. It queries eligible Review, starts actual `publishScheduleRange`, and intercepts HistoricalPlan storage mutation only to wait before forwarding to the real adapter. During that wait it performs actual store full clear or actual V14 import. It inspects empty history before releasing, then awaits publication and compares exact post-release batches with those read by a newly initialized store. It preserves actual IDs, publication time, range, source incarnation/revision and complete frozen Sleep evidence. The diagnostic asserts the current unsafe behavior. Passing it is not repair acceptance.

The new observation JSON contains full replacement outcome, whether a physical callback was supplied, exact epochs, publication result, empty pre-release state, post-write history and restart history. `diagnostic-summary-RESULT.json` records exact equality checks and hashes of those outputs. The retained original earlier-dispatch failure is left in task 9.29; its Sleep-materialization rejection is not the later physical-write race.

## Executed application checks

```sh
npm exec vitest -- run src/state/schedulePublication.test.ts src/state/historicalPlanSurface.test.ts src/state/dayFrameAuthorityTransaction.test.ts src/state/dayFrameRestoreComposition.test.ts src/ui/tests/ScheduleReviewPanel.test.tsx
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run build
npm run check:bundle
npm test
npm test -- --maxWorkers=1
```

The initial focused command accidentally named four suites under `src/app/`; only its correctly named UI suite matched (1 file / 8 tests). It is retained in `relevant-tests-RESULT.log`, not claimed as owner coverage. The corrected `src/state/` command ran all five intended suites (49 tests), retained in `relevant-owner-tests-RESULT.log`.

The first full suite ran after all static/build jobs finished and had four failures in two existing UI suites: GoalRecordedInspection could not find `Scheduled: 13`; GoalStructureAuthoring had two 5-second timeouts and a missing complete-backup-restored message. Its log is retained without alteration. A single-worker full rerun was selected to obtain an additional controlled validation run; no test, timeout or config changed. Outcomes are reported in the execution RESULT. Passing a later run does not establish the cause of the earlier failures.

Documentation formatting is limited to the new authored Markdown outputs, preserving the exact copied diagnostic bytes. Production formatting checks run against `code/`. Whitespace uses `git diff --check`; new authored Markdown also receives Prettier check. Preservation verifies every baseline tracked/unignored file's SHA-256 and lists all new tracked/unignored paths. Build output is normal ignored `code/dist` tooling output, not an authored durable deliverable. A single unchanged-input build supports before/after size comparison, not a repaired bundle claim.
