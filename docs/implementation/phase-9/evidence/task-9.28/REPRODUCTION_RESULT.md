# Task 9.28 reproduction and evidence provenance RESULT

## Validation commands

From `code/`, using the existing installed dependencies:

```sh
npm exec --no -- prettier --check .
npm run lint
npm run typecheck
npm test -- --maxWorkers=2
npm run build
npm run check:bundle
```

From the repository root: `git diff --check`.

Baseline full suite: 162 files / 1,653 tests, 103.19 seconds. Final full suite: 163 files / 1,683 tests, 80.30 seconds; all 30 new inspection cases included. The final focused log is the earlier 27-case pass (17.21 seconds); the full log certifies the later additions. `existing-tests-RESULT.log` retains the initial five-suite / 45-test regression check. `intermediate-full-tests-RESULT.log` is the passing 1,682-test run before the last recovery case and related-navigation extension. No existing assertion, timeout, policy or configuration was weakened. The two-worker bound selects the entire suite, not a subset.

The final production build precedes only test/document changes; the final native run uses that build. Formatting is checked for all of `code/`; only task-created/touched files were formatted. No installation or dependency update occurred. Logs with corresponding RESULT names are retained here. Existing initial-gzip and total-JavaScript advisories remain warnings, with all hard gates passed.

## Native production reproduction

Compile the disposable supporting fixture, from `code/`:

```sh
npm exec --no -- vite build --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.28/seed-build-config-RESULT.mjs
```

Run production previews in separate terminals, also from `code/`:

```sh
npm run preview -- --host 127.0.0.1 --port 4961 --strictPort
npm run preview -- --host 127.0.0.1 --port 4962 --strictPort
```

Launch a new disposable browser profile, then run the retained driver from repository root:

```sh
chromium --headless=new --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9340 --user-data-dir=/tmp/dayframe-928-chrome-RESULT about:blank
node docs/implementation/phase-9/evidence/task-9.28/browser-driver-RESULT.mjs
```

The driver clears only these disposable origins. It was executed from an identical `/tmp/dayframe-928-browser-RESULT.mjs` copy, with output redirected to `/tmp/dayframe-928-browser-RESULT.log`. A sandbox localhost EPERM required approved escalation for CDP access. No Dogfood Pass 02 profile or user data was accessed. Production Chromium 153 uses native browser storage, downloads and `DOM.setFileInputFiles` for the actual file-input workflow. The fixture is independently built into `/tmp/dayframe-928-seed-build-RESULT`; it is not shipped in product bundles.

`canonical-seed-RESULT.ts` uses the new permanent `goalRecordedCanonicalFixture.ts`, which composes existing canonical Goal/planning/measurement/observation commands with the accepted V14 fixture. It adds a **validated** publication of 13 scheduled linked manual-event rows, three other linked planning states, known-unlinked coverage rows, one legacy unknown-membership row and a covered empty day. Canonical immutable day is 2026-09-10 while the scheduled instants are after midnight on 2026-09-11. Frozen membership includes two Goals. The V14 importer validates the whole fixture before it is used. Supporting zero/no-value Goals are created through canonical commands. This is validated fixture history, not a claim that UI authoring generated that history or a storage-performance benchmark.

The UI actions under certification are not replaced by seed calls: ordinary controls record and correct observations, Daily Planner reports an outcome, native export downloads V14, file input imports into a separate origin, and reload/fresh inspection reads restored authorities. Query-only helper readback verifies values, identities, revisions, Activity distributions and independent authorities. Production code receives no fixture or restore capability.

At each width (320, 390, 768, 1280), native reporting checks 17→25 observation, separate completed outcome, then correction 25→30 at revision 2. All other authority surfaces are compared exactly around each explicit write. Inspection/reveal/navigation/Goal/Measurement/Structure/Requested Time drafts are not saved. Each width also preserves drafts on malformed import, reloads the source, imports into a different origin, reloads the destination and freshly inspects the restored Goal.

Twelve backup comparisons pass. Only backup envelope metadata is omitted and the six explicitly enumerated unordered Proposal/Realization collections are sorted by identity/revision for canonical comparison. All twelve also pass raw authority collection-order equality. Nested record order, exact values, IDs, optional absence, revisions, times, definitions, observations, execution records, publications and Structure arrays are compared. Fresh derived cutoffs are allowed to differ and are not serialized as authority.

The final driver reports 51 observations: 34 DOM measurement frames, 4 canonical reporting groups, 12 authority comparisons and 1 uncaught-error observation. Across the frames: 1,120 sampled controls, minimum height 44 CSS px, minimum width 79.8125px, equal document scroll/client widths, zero uncaught application exceptions. At all four widths, Day return focuses the inspector heading with a 3px outline. Reduced-height 390×420 checks Tab from value to observed date/time; 640px at CSS zoom 2 checks reflow. Screenshots retain provenance, partial coverage, reporting form, return, invalid import, reduced height and reflow.

These are native headless DOM/CDP workflows and computed measurements, not physical-device, OS-dialog, soft-keyboard, screen-reader, pointer-ergonomics or browser-native-zoom certification. Precise cutoff and protection/interleaving failures are deterministic automated tests. The native partial case is real preserved legacy Goal-link coverage, not a simulated protected owner.

## Material intermediate failures and corrections

- An initial contract-map assumption based on older Activity documentation was corrected **before application implementation** by reading current snapshot/materialization types: modern acceptedAllocation and sleepRequirement snapshots are in the same `occurrences` population. The UI follows current canonical policy; no population extension was needed.
- The validated fixture needed the existing branded source-incarnation type; values are validated by the publication builder and V14 importer rather than bypassing validation.
- Initial stop/restart test steps used the same instant as the prior definition revision and correctly hit nonMonotonicTime. Test clocks now advance for explicit new revisions; owner semantics were not changed.
- The first real outcome test selected the first day detail, which was **unplaced** row 13 rather than scheduled row 00. Its explicit existing Day report correctly did not increment the scheduled-outcome denominator. The test now chooses exact scheduled row 00. `report-debug-RESULT.log` retains the diagnostic actual record/reference and cutoff. No reporting policy was changed.
- A subsequent assertion read asynchronous Activity immediately after synchronous Progress updated. It now awaits the specific Activity result rather than increasing a timeout.
- The first native bounds assertion counted the reveal button and hidden coverage button alongside row-navigation buttons. The driver now counts exact Activity day actions. Rendering remained bounded to ten linked rows throughout.
- Protection seam typing required an unsubscribe function returning the owner's actual boolean, and canonical User Day test setup required the full existing setup input; fixtures were corrected without owner changes.
- Two npm commands were initially issued from repository root, where there is no package.json. They performed no application work; reran from `code/`.
- Final formatting/lint/typecheck, complete tests, production build/bundle and native run passed. No existing semantic assertion, timeout or configuration was removed or weakened.

## Artifact and state integrity

`governing-versions-RESULT.json` pins the actual governing repository copies. `baseline-head/status/hashes-RESULT` record the dirty working-tree starting point; local byte copies supported source-relative patch generation. `preservation-inventory-RESULT.json` compares all 1,151 baseline files (nine intended UI changes; 1,142 unchanged; zero missing), and hashes all task files except itself. `task-relative-RESULT.patch` isolates nine modified UI files and four new source/test files. The input was already present, exact and immutable; the separate RESULT has its own heading/outcome and is read back before delivery.

The full original 9.27 blocked execution, accepted 9.27 continuation RESULT, all prior inputs/evidence, ADRs and diagnostics remain byte-identical. No schema/format/migration/dependency/owner change, capability retirement, commit, push, stash/reset, unrelated cleanup or Dogfood state access occurred. This directory is retained local evidence, not a remote backup or commit.
