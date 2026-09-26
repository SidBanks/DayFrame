# Validation history and limits — RESULT

All logs are local artifacts. Passing diagnostics that assert a failure are not application acceptance. The final determination remains partial/blocked regardless of the final suite outcome.

- Baseline: 176 files / 1,821 tests, 1,820 passing; one G2 return-focus failure and one unhandled HistoricalIntelligenceSummary late update (`window is not defined`). No concurrency attribution is claimed.
- `focus-diagnostic-RESULT.log`: deterministic outgoing-surface consumption of the G2 return-focus flag. Bounded consumer fix and 20 tests pass in `focus-repair-RESULT.log`.
- `navigation-full-tests-RESULT.log`: intermediate isolated full suite passes 176 files / 1,822 tests after navigation callback invalidation. This does not prove a general fix for all previously reported focus/restore/window/heap incidents.
- Baseline build/lint and early lazy-host builds/bundle gates passed. Later compile diagnostics for the Sleep target union and inclusive Proposal horizon conversion were retained and corrected with explicit narrowing/validated date typing.
- `workflow-ui-tests-RESULT.log`: initial broader workflow run failed 30 tests. UI composition introduced inaccessible collapsed-detail expectations and changed labels. Existing semantic assertions were retained; explicit detail access, bounded-page traversal and scoped navigation queries were introduced.
- `workflow-ui-compatibility-RESULT.log`: 60 failures, starting with a helper using an asynchronous `findBy` under a frozen clock. The helper now reads the synchronously mounted detail disclosure; cleanup restores real timers. No timeout increased.
- `workflow-app-retry-RESULT.log`: three remaining failures for selected-day context, exact attention controls, and date bounds. The helper now distinguishes explicit generated-detail selection from returning to the retained selection. Actual attention focus needed stable detail mounting through readiness queries.
- `refined-ui-tests-RESULT.log`: 146 pass / one exact-attention failure; fixed by keeping corrections under a stable keyed element across readiness loading/current/error states.
- `stable-detail-tests-RESULT.log`: all 124 App tests pass; canonical many-offer fixture initially produced too few offers. No fake Proposal IDs, witness or V1 read model was substituted.
- `valid-offers-*`: retained fixture diagnostics. Canonical allocation requires query horizon equal to each demand horizon; distinct daily evaluations now derive and record real proposals. A disclosure-persistence regression then required synchronous summary state capture instead of waiting for native toggle delivery.
- `final-focused-tests-RESULT.log`: three files / 24 tests pass, including >10 real offers, retained disclosure, exact synthetic Friction controls, real two-day Build and original receipt identity across unmount.
- `final-lint-RESULT.log`: one constant-loop lint failure in a bounded-page test; fixed with an explicit bound based on expected page count. Retry passed.

## Native evidence and material failure retention

Production servers used only `127.0.0.1:4978` and `:4979`; Chromium used `/tmp/dayframe-929c3-chromium-RESULT`. No preserved Dogfood profile/database was opened or changed. Sandbox EPERM on browser-control access is retained in `browser-first-RESULT.log`; approved rerun used the same disposable endpoints.

The first native corrective attempt selected Move where no usable revised placement was produced. It timed out waiting for Apply. A subsequent run selected the existing exact Skip remedy, demonstrated Try/Discard/Try/Accept, then exposed canonical publication refusal. Refreshing explicitly did not resolve it. The current diagnostic reports current Preview, allocatable foundation, qualified sources and `inconsistentPlanContext` after applied omission.

**Evidence-retention limitation:** the first native Move timeout's complete log was accidentally overwritten by the next run before being copied. Its observed timeout and source line were retained in the session, and are described here; they are not represented as an intact retained log. Subsequent material failures are preserved in `browser-try-refresh-diagnostic-RESULT.log`, `browser-materialization-diagnostic-RESULT.log`, `browser-native-RESULT.log`, and `native-timeout-diagnostic-RESULT.json`. Intermediate screenshot/measurement filenames were also reused; only their latest retained capture is claimed. No prior-task or baseline evidence was overwritten.

Current retained native measurement: 320×568, document/client width 305px, no horizontal overflow; primary measured controls 44/44/58px, focused Schedule details heading with visible outline. The one screenshot was visually inspected. This is **not** four-width acceptance, reduced-height acceptance, physical-device or screen-reader certification.

The driver contains later 390/768/1280, Sleep, nonempty V14 roundtrip, busy/protected/uncertain and import scenarios, but execution never reached them. Presence of code is not evidence of execution. Both preview servers and disposable Chromium were stopped before the final complete suite.

The owner-only reproduction passes while asserting the existing failure (`correction-repro-RESULT.log`). It never uses the new UI. Its exact JSON proves zero publication attempts/transactions and the materializer reason `planDecision:insufficientHistoricalContext`.

Final static/build/bundle and full-suite results are recorded in the main RESULT and machine-readable validation index. Historical earlier restore/focus/window/worker-heap incidents remain disclosed without a claimed general repair.

## Final isolated validation sequence

`final-isolated-tests-RESULT.log` completed 178 files / 1,831 tests: 1,830 passed and the existing constructive workflow Resolve-conflicts focus assertion failed. The callback targeted the new conflict-group heading instead of the established Schedule details heading. It now restores the established target; the assertion was not changed. `focus-handoff-tests-RESULT.log` passes two files / 18 tests. Post-focus lint and TypeScript/build pass. A one-line formatting failure after the longer focus-target name is retained in `post-focus-format-RESULT.log`; the touched host alone was formatted and `verified-format-RESULT.log` passes. The final build and bundle completed before the next isolated full suite; `verified-source-build-freeze-RESULT.json` pins its source/build and order.

`verified-isolated-tests-RESULT.log`: exit 0, 178 files / 1,831 tests passed in 170.26 seconds; no unhandled errors reported. Source/build freeze verification found no changes during the run. All applicable static/build hard gates passed. The canonical omission/publication gap and unexecuted native acceptance gates still prevent COMPLETE.
