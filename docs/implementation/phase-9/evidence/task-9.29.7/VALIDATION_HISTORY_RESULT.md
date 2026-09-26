# Task 9.29.7 validation history — RESULT

All commands ran from the repository root unless stated `code/`. Logs are retained separately and were not reused. Native artifacts are under `browser-attempt-2-RESULT/`; attempt 1 was denied before connection. The pre-existing diagnostic was copied, not rewritten in its original folder.

## Baseline and positive reproduction

From `code/`: `npm exec prettier -- --check .`, `npm run lint`, `npm run build`, `npm run check:bundle`, then isolated `npm run test -- --maxWorkers=1`. Baseline logs use `baseline-…-RESULT.log`. All passed, including 178 files / 1,831 tests in 181.85 s.

From `code/`: `npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29.7/correction-repro-config-RESULT.mjs --maxWorkers=1` passed its one **expected-failure reproduction** (`baseline-reproduction-attempt-1-RESULT.log`). The copied observation records `planDecision:insufficientHistoricalContext`, public `materializationFailure`, zero mutation attempts and zero physical history transactions.

The positive counterpart uses `repaired-repro-config-RESULT.mjs`, with separate test and observation files. It passed one test (`repaired-repro-attempt-1-RESULT.log`) proving real materialization/publication. Early and typed-evidence builds passed. Early bundle passed all hard gates.

## Test construction and intermediate failures

No old diagnostic or valid refusal test was changed. No timeout, suite selection configuration, or production owner policy was relaxed. Every intermediate failure below was in new test construction.

| Log stem (`-RESULT.log`) | Command from `code/` / observation | Resolution |
|---|---|---|
| core-integration-attempt-1 | `npm exec vitest -- run src/state/omissionPublication.test.ts src/core/decisions/replayPlanDecisions.test.ts src/core/execution/tests/historicalExecutionTarget.test.ts src/core/historicalPlan/materializePlanPublication.test.ts --maxWorkers=1`; 39/42 pass | New test used wrong timing name (`unavailable` vs existing `timed`), assumed a stale replay row survives a nonallocatable foundational generation, and assumed removal yields placement. Corrected to exact existing representations/observable behavior. |
| workflow-integration-attempt-2 | Omission store + `src/ui/tests/OmissionPublicationWorkflow.test.tsx`; 16/18 pass | UI passed. Removal placement assumption persisted; V14 reload exposed top-level Proposal collection ordering. Adopted existing V14 restore comparator only for identity-keyed Proposal/realization arrays. |
| workflow-integration-attempt-3 | Same two files; 17/18 pass | Removal publication explicitly reported `frictionUnresolved`; changed Review cutoff to match later command time for correct source fingerprint, without bypass. |
| removal-diagnostic-attempt-4 | Store test filtered `-t 'removal invalidates'`; 1 failed, 16 intentionally unselected | Recorded actual restored unplaced Routine. Removing the appointment does not remove accepted productive work occupying its window. |
| workflow-integration-attempt-5 | Store omission file; 17/17 pass | Assert future unplaced state after removal. For a separate later publication, explicitly author a wider 16:00–19:00 window, regenerate and review. Earlier omitted history remains exact. |
| admission-integration-attempt-6 | Store omission file; 19/21 pass | Qualification seam awaited a Proposal mutation which never occurred; the fixture attempted a lifecycle operation on already accepted authority. Replacement fixture omitted required user provenance. Added provenance; no production changes. |
| admission-integration-attempt-7 | Store omission file; 20/21 pass | Added a generated Proposal fixture, but still no mutation. Held-seam timeout remained 5 s; not increased. |
| admission-history-attempt-8 | Store omission file; 21/22 pass | Replaced blind waits with races that expose early command returns. Actual return was `rejected/invalidInput`, before mutation, rather than an admission failure. New earlier-history/Actual/Progress test passed. |
| integration-attempt-9 | Omission store + UI; 22/23 pass | Moving the fake clock did not make the attempted Proposal lifecycle transition valid. No unsupported cause claimed. |
| qualification-attempt-10 | `-t 'qualification physical'`; 1 failed, 21 intentionally unselected | A distinct proposal generated through the canonical predecessor input still did not make the chosen transition reach mutation. |
| integration-attempt-11 | Entire omission store file; 22/22 pass | Final fixture holds the actual **recordProposal** mutation of a distinct canonically generated Proposal, rather than trying to mark it shown. The real adapter rejects omission publication with exact `proposal/writeInProgress`, one attempted history mutation and zero physical history transactions. Authored/decision changes similarly reject `sourceChanged`. |

The temporary Proposal transition fixture's `invalidInput` result is not evidence of a new product defect or a relaxation of its rules. It was unsuitable for the intended physical-write seam. The final test asserts it reaches the real seam, checks the exact qualification issue, and releases/awaits the independent write. No fixture injection claims to be a user browser action.

Formatting of the touched files and the three test sources was applied with `npm exec prettier -- --write` on explicit paths only (`format-changed-RESULT.log`, `format-tests-attempt-2-RESULT.log`). Intermediate lint/typecheck passed.

## Native jobs and environment failures

The first shell attempt to append the new browser loop used the `code/` working directory with a root-relative artifact path and failed `No such file or directory`; it did not modify the driver. The subsequent correct-root append succeeded. The shell error was tool output, not an unavailable browser test result.

The initial preview command logged `listen EPERM` in `preview-source-RESULT.log`. It was rerun with the required sandbox approval, creating `preview-source-attempt-2-RESULT.log`. Preview source/destination ports were 4980/4981. The native driver first logged `connect EPERM` to localhost:9348 (`browser-attempt-1-RESULT.log`), then reran with approved localhost access and a fresh attempt directory. There was no test assertion failure in the native run.

Commands:

- `code/`: `npm exec vite -- build --config ../docs/implementation/phase-9/evidence/task-9.29.7/seed-build-config-RESULT.mjs` (`seed-build-attempt-1-RESULT.log`).
- `code/`: `npm run preview -- --host 127.0.0.1 --port 4980 --strictPort` and corresponding port 4981, each logged separately.
- Root: `chromium --headless=new --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9348 --user-data-dir=/tmp/dayframe-9297-chromium-RESULT about:blank` (disposable browser profile; copied browser process log).
- Root: `node docs/implementation/phase-9/evidence/task-9.29.7/browser-driver-RESULT.mjs 2` → `browser-attempt-2-RESULT.log`: `NATIVE_9297_PASS`.

The driver requires an explicit attempt number and refuses an existing attempt directory. Production UI actions use visible controls through CDP/DOM, native keyboard Tab, real download/upload, native IndexedDB and separate origins. Direct React-store access is supporting canonical seeding, authored conflict premise, readback and counters—not corrective Accept or Build substitution. All four widths exercised those actual controls. No controlled fault seam was used in this browser run.

## Final checks

All from `code/`, except `git diff --check` at root:

- `npm exec prettier -- --check .` → `final-format-RESULT.log`: passed.
- `npm run lint` → `final-lint-RESULT.log`: passed.
- `npm run typecheck` → `final-typecheck-RESULT.log`: passed.
- `npm run build` → `final-build-RESULT.log`: passed.
- `npm run check:bundle` → `final-bundle-RESULT.log`: hard gates passed; existing advisory gzip/total-size warnings retained.
- `git diff --check` → `final-diff-check-RESULT.log`: passed, empty output.
- `npm run test -- --maxWorkers=1` → `final-tests-attempt-1-RESULT.log`: passed **180 files / 1,854 tests in 187.00 s**, no reported unhandled errors.

The final test suite started after static/build/bundle/native work finished and after both preview servers and disposable Chromium were stopped. Documentation and file-hash/readback audits during the suite do not run another build or test worker. `final-build-hashes-RESULT.json` proves all production files equal the browser-tested build, byte-for-byte. No source changes followed those final checks.
