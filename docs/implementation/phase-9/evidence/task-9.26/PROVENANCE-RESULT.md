# Task 9.26 evidence provenance and reproduction

Observed 2026-09-23. Retained files are local repository artifacts, not a claim of a commit or remote backup. All datasets are disposable fixtures. No Dogfood Pass 02 state was opened.

## Native reproduction and successful round trip

The pre-fix run used the unchanged baseline in a source-mapped production Vite build at `http://127.0.0.1:4936`, Chromium debugging port 9327, and a fresh profile `/tmp/dayframe-926-chrome-RESULT`. `pre-fix-driver-RESULT.mjs` selects the retained Task 9.25 canonical V14 JSON through the actual application file input. It does not replace cloning or call internal restore APIs. `pre-fix-failure-RESULT.json` contains the native exception, generated locations, original source-map locations (zero-based), application text, browser version/build entry, and exact before/after localStorage and IndexedDB values. They are equal. The stack maps to `restoreCoordinator.ts:361` (one-based) in target validation, after the runtime transaction begins but before staging or durable replacement. No domain runtime target has yet been installed; the escaping exception leaves the coordinator/runtime preparation guard active in that page. This is not evidence of persisted data loss.

Successful production runs use source A at port 4937 and destination B at port 4938 in the same disposable profile, with separate origin storage. `canonical-seed-RESULT.ts` bundles the permanent `v14RestoreFixture.ts`, which extends the existing canonical Task 9.25 fixture using supported commands. It creates separate identities on each origin. After seeding, the app reloads and **Export Complete Backup** downloads the actual V14 file. A's downloaded file is selected in B using the ordinary input and imported by the real application. Destination re-exports also use the actual download action. No globals or restore participants are shimmed in these native runs.

The current application has no additional import confirmation/review dialog. Clicking Import opens the file picker; selecting a file starts parsing/validation and the existing protocol. We did not invent or bypass a confirmation. Empty-file selection exercises cancellation/no selection; the automated test also sends that event and asserts no import call. This is not physical operating-system file-dialog certification. Invalid JSON and unsupported-version files exercise native rejected paths at every width.

## Canonical fixture and comparisons

The source includes a 03:00 User Day boundary, authored Work/Commitment setup and source incarnations, Goal metadata/link/revisions, three independent accepted 1-hour iterations, two realizations with productive/Support/protected roles, immutable publication under “Network+ original”, and a current “Source A restored Goal”. The latest Requested Time revision uses splittable sessions, minimum 15 and preferred 45 minutes, with **no maximum field**. Earlier acceptance still references its original request revision and exact resource specification/variant. The fixture also includes priority, a linked child/Structure relationship and milestone, First-Class Sleep, a saved profile, completed Actual of 47 minutes, and independent measured Progress of 17 words against a 100-word target.

`source-A-native-export-RESULT.json`, `320-B-before-RESULT.json`, and `320-reloaded-native-export-RESULT.json` retain representative actual downloads. All later-width exports are compared in the driver and represented by hashes in `browser-measurements-RESULT.json`; transient download files stay under `/tmp/dayframe-926-downloads-RESULT`.

Comparison never deletes authority fields. Envelope `exportedAt` is compared separately from `.data` because it is export metadata. Object property order is immaterial. The comparator additionally permits only six explicitly named collection-order differences: `proposals.{proposals,candidates,decisions,acceptedAllocations}` and `realizations.{realizations,facts}`, sorted by identity/revision without altering records or nested arrays. The in-memory automated fixture exposes that IndexedDB key-order difference on restart. **All twelve final native comparisons also passed with exact array order**, without needing those allowances. Destination-only Goal absence is explicitly checked. The unrelated localStorage sentinel is retained; it is not a fabricated domain participant. Complete V14 includes all thirteen registered authorities; Preview, presentation drafts, derived summaries, durability state and restore infrastructure are excluded by the existing domain-backup contract.

## Browser observations

`browser-measurements-RESULT.json` records 44 observations, including 22 viewport/control/focus snapshots, 12 full-authority comparisons, explicit no-file context checks, source/destination identities and zero uncaught browser exceptions. Widths: 320/390/768/1280 × 800; additional 390 × 420 and CSS zoom 2 at 640 × 800. Every measured import/utility and inspector control is at least 44px high before zoom. All document scroll widths equal client widths. Error/success roles and the import button's `aria-describedby` association are retained. Keyboard Tab moves from Export to Import with a visible 2px outline. Rejected imports restore focus to the re-enabled Import control; successful restore focuses the Calendar month heading. The driver explicitly checks unsaved Goal and Requested Time drafts after rejection, then verifies that successful restore replaces their context.

Four PNGs retain the 320px error, successful result, restored inspection and 390px reduced-height keyboard focus. There is no confirmation screenshot because no separate confirmation exists. These are desktop headless Chromium viewport observations, not physical-device, soft-keyboard, screen-reader or native-browser-zoom certification. CSS zoom is only a reflow approximation.

## Reproduction commands

Use only fresh disposable profiles/origins. The drivers clear their dedicated origins; do not attach them to a user profile. Current scenario dates are September 2026. For later reproduction, apply the September period before the driver's first iteration assertion or run with an appropriate controlled app date; permanent integration tests freeze Date independently of real IndexedDB timers.

From `code/`:

```sh
npm test -- src/state/dayFrameBackupV14Restore.test.ts src/ui/tests/V14ImportContext.test.tsx
npm run build
npm run check:bundle
npm exec vite build -- --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.26/seed-build-config-RESULT.mjs
npm run preview -- --host 127.0.0.1 --port 4937
```

In a second shell from `code/`:

```sh
npm run preview -- --host 127.0.0.1 --port 4938
```

In separate shells, start Chromium and run the driver from the repository root:

```sh
chromium --headless=new --no-sandbox --disable-gpu --remote-debugging-port=9327 --user-data-dir=/tmp/dayframe-926-chrome-RESULT about:blank
node docs/implementation/phase-9/evidence/task-9.26/browser-driver-RESULT.mjs
```

Reproducing the historical pre-fix failure requires the baseline source in an isolated checkout/copy, not reverting this workspace. From its `code/`, build with `npm exec vite build -- --sourcemap --outDir /tmp/dayframe-926-prefix-build-RESULT`, preview that directory on 4936, and run `pre-fix-driver-RESULT.mjs`. That driver uses the existing Task 9.25 retained V14 fixture and maps its generated stack through the temporary build's `.map` files. The captured pre-fix evidence remains durable even when that temporary build is gone.

## Automated injection versus native proof

Permanent tests use fake IndexedDB and existing participant/storage/runtime injection seams for capture failure, atomic commit failure, local-write rollback, runtime-install uncertainty, failed rollback, protected admission and retry. A receiver-sensitive cloning double establishes all thirteen callback contracts and preserves structured-clone value semantics; native pre/post browser runs establish the real browser defect and correction. No injected fault is described as a native storage failure.

The first full runs encountered an unchanged Setup test's 5-second timeout under default worker contention; the new recovery UI test also needed a 10-second asynchronous restore wait. Final full validation uses `npm test -- --maxWorkers=2`, retaining every assertion and existing test timeout. Earlier fixture errors (unsupported measurement unit and wrong Goal link command), browser selector/download-name detection, and the observed 40px utility buttons were corrected. No compatibility test was removed or weakened.

`validation-RESULT.json` retains material baseline/final commands, outputs, bundle policy/metrics, task-relative file hashes and outcome observations. Full 1,007-file baseline copies, maps/builds, intermediate logs, and browser/download directories remain local-session-only under `/tmp/dayframe-926-*`. No Task 9.25 artifact was overwritten or recreated as original evidence.
