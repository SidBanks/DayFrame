# Reproduction, provenance and validation RESULT

Run commands from `code/` unless indicated. Installed dependencies were reused, with no install/update or configuration changes.

```sh
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm test -- --maxWorkers=2
npm test -- --maxWorkers=2 src/ui/tests/GoalStructureAuthoring.test.tsx
npm run build
npm run check:bundle
git diff --check
```

The final full suite contains 162 files / 1,653 tests, including all 27 new authoring regressions; 103.38 seconds. The retained focused log is the preceding 26-case pass before adding the successful full-clear case; the final full log certifies all 27. Baseline 161 / 1,626; 84.08 seconds. Final formatting, ESLint, tsc, Vite build, bundle policy and diff checks passed. Commands were redirected to matching RESULT logs. The worker bound limits concurrent test files without filtering the suite. No timeout, assertion or test configuration was weakened. Final application source was built and exercised natively before the last test-only additions.

## Production browser reproduction

Build the supporting seed (not shipped with the product):

```sh
npm exec --no -- vite build --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.27-continuation/seed-build-config-RESULT.mjs
```

Run two production previews in separate terminals:

```sh
npm run preview -- --host 127.0.0.1 --port 4951 --strictPort
npm run preview -- --host 127.0.0.1 --port 4952 --strictPort
```

Launch an isolated Chromium profile and debugging endpoint; from repository root run the retained browser driver. Use only these disposable origins/profile; the driver clears their state.

```sh
chromium --headless=new --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9330 --user-data-dir=/tmp/dayframe-927-continuation-chrome-RESULT about:blank
node docs/implementation/phase-9/evidence/task-9.27-continuation/browser-driver-RESULT.mjs
```

The executed copy was `/tmp/dayframe-927-continuation-browser-RESULT.mjs`, identical to the retained driver, with output redirected to `/tmp/dayframe-927-continuation-browser-RESULT.log`. Localhost/CDP execution used the existing approved escalation after sandbox EPERM; no external service or production profile was accessed. Chromium 153 native headless, final production build, 320/390/768/1280 CSS px; seed/query harness compiled independently into /tmp. Native log reports PASS 47 observations. Build output is reproducible and ignored; all material logs, fixture exports, measurements and representative screenshots are retained in this directory.

## Fixture provenance and comparison rules

`canonical-seed-RESULT.ts` composes the existing `v14RestoreFixture` with canonical Goal/Requested Time commands to provide a planning-proof Goal, 22 supporting Goals (including duplicate titles), existing independent accepted history, and read-only canonical inspection. The seed creates 25 Goals total. The production UI creates each relationship/Milestone under certification. Browser driver checks unchanged independent authorities before explicit planning; satisfaction alone does not plan. Canonical query snapshots and exact satisfaction/rename/retirement revisions are retained in browser measurements.

At every width, actual UI exports and file-input imports exercise the existing V14 coordinator and real browser storage. Fresh destination origin differs from source. Browser reload/export checks durability. Anomaly fixtures adapt the original immutable 9.27 preservation diagnostics to current disposable endpoint IDs, retaining anomalous temporal facts intentionally. Permanent tests additionally place the anomaly in a nonlatest revision beneath a coherent latest record. Controlled failure/interleaving tests use fake-indexeddb and injected gates/rejections; they are not claimed as native clock rollback/storage failures.

`browser-driver-RESULT.mjs` lists exactly six unordered Proposal/Realization collections sorted by stable identity/revision for equality. No Structure array or nested record is normalized. Backup envelope timestamps are excluded; all authority data remains compared, with raw-order equality recorded separately. Sixteen comparisons pass; ten raw-order matches. Native exports are synthetic disposable fixtures, not user backups. They certify these fixtures and workflows, not storage-size or I/O performance limits. Density tests use 24 canonically created Goals and 13 valid rows per exercised contribution/Milestone group.

## Intermediate failures and resolutions

- Initial type checking exposed the public app store Pick missing the Structure methods, and owner return unions whose accepted value did not universally declare `status`. Added only public UI typing and compatible optional outcome-status discrimination; no owner contract changed.
- Early assertions expected short reason text while canonical UI also displayed exact record references. Assertions were corrected to the actual text without dropping semantic checks.
- Seed IIFE name originally contained illegal hyphens; changed only the harness global to `DayFrame927ContinuationSeed`.
- First native containment attempt used an already-parented fixture Goal and correctly rejected multiple parents. The supporting endpoint changed to an unparented duplicate-title Goal; validation was not bypassed.
- ESLint found a test variable that could be const; corrected that declaration.
- Intermediate full suite had one new import test read the screen while real restore was still running (retained `intermediate-tests-RESULT.log`). The test now awaits its spied original coordinator promise, with no increased timeout. Corrected full runs passed, including the final 1,653-test run.
- Added planner-return regression initially used a misspelled spy method and then an inconsistent clock: fixture authority was created on September 24 but inspected as of September 23. Used the actual `createMilestone` API and set the canonical fixture clock before creation, as its existing navigation suite does. It then passed with specific returned-heading focus and unchanged planning authority assertions.
- A transient file-edit command used a doubled `code/` path and changed nothing; corrected the path. It had no repository effect.

## Forensic evidence

Baseline HEAD/status/hash inventory were captured before implementation. `preservation-inventory-RESULT.json` compares all 1,098 baseline files: three intended UI sources changed, 1,095 preserved, zero missing. Every prior evidence/input/result file remains byte-identical, including the existing misspelled continuation input. The correctly named new input matches the user attachment. `task-relative-RESULT.patch` isolates application/test edits against those baseline bytes, rather than incorrectly attributing pre-existing dirty work to this task.

`FILE_MANIFEST_RESULT.md` enumerates all created/modified files and purposes. The inventory hashes task files except itself to avoid a self-referential hash; baseline and source hashes remain exact. No commit, remote backup, dependency install, stash/reset, owner/schema/migration change or Dogfood Pass 02 state access occurred. Final full-clear and import tests operate solely on disposable databases. Native accessibility evidence covers semantics, computed targets, keyboard focus and CSS reflow, not physical devices, screen readers, OS dialogs or native browser zoom.
