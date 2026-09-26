# Task 9.27.2 retained evidence and reproduction

Use the existing installed tools and disposable state only. Do not use a preserved Dogfood browser profile or origin. The task input and accepted proposal are immutable. This directory’s outputs are locally retained, not committed or remotely backed up.

From `code/`:

```sh
npm exec --no -- prettier --check .
npm run lint
npm run typecheck
npm test -- --maxWorkers=2
npm run build
npm run check:bundle
npm exec --no -- vite build --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.27.2/seed-build-config-RESULT.mjs
```

From the repository root, `git diff --check`. Baseline equivalents ran before implementation; retained baseline logs record 159 files / 1,590 tests and exact bundle values. Final tests record 161 files / 1,626 tests. The worker bound selects the complete suite.

Run production previews in `code/` on dedicated localhost ports 4947 and 4948 (`npm run preview -- --host 127.0.0.1 --port 4947`, and the equivalent for 4948). Check that each bound its requested port; do not silently use an unrelated existing server. Launch installed Chromium with a new disposable profile:

```sh
chromium --headless=new --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9328 --user-data-dir=/tmp/dayframe-9272-chrome-RESULT about:blank
```

From the repository root:

```sh
node docs/implementation/phase-9/evidence/task-9.27.2/browser-driver-RESULT.mjs
```

The original run used an identical `/tmp/dayframe-9272-browser-RESULT.mjs` copy because of the local command approval rule. Localhost CDP access required sandbox escalation; no remote data access was used. The driver clears only the two named disposable origins. It writes evidence in this directory, so use a copied output directory for independent reruns if retaining the original observation is required.

The driver loads the compiled canonical fixture to seed supporting state, then reloads the real production app before UI operations. Real file input events, native JSON downloads, product evaluation and acceptance are exercised. Canonical readback afterward is read-only; it does not substitute for those actions. Native browser version, actual query instants, accepted allocation records, measurement geometry and SHA-256 comparisons are retained in `browser-measurements-RESULT.json`.

Fixture provenance: coherent source uses the unchanged `v14RestoreFixture` and `goalInspectionCanonicalFixture`, plus an explicitly authored 60-minute Requested Time for a new Planning proof Goal on September 24. Its preview period is set to that same day for Review Schedule. The legacy anomaly is built from Task 9.27’s retained `futureInterval.relationship` and `reversedInterval.retirement.value` rows. Only supporting Goal endpoint IDs are remapped, and fixture row order is made canonical before import. Dates, relationship identity, revision, statuses and pre-repair interval evidence are preserved.

Comparisons ignore export metadata and sort only the six explicitly enumerated unordered Proposal/Realization collection arrays. Each record and all other arrays, including Structure, retain exact comparisons. Raw array-order equality is separately recorded. The retained 320px exports provide concrete source, rejection, coherent, accepted and anomalous round trips; all four widths have hashes and outcomes.

Intermediate issues: first native attempts used an outdated seed bundle because Vite’s default config bundling tried to create a temporary folder outside the workspace. `--configLoader native` uses the existing configuration without that temporary directory. A stale September 4 Review Schedule period was corrected in the seed. The driver’s expected no-proposal copy was aligned to the actual existing product text. No product assertion, timeout, reader predicate or style clipping was weakened. The final screenshots scroll to the feedback being certified.

Precise clock boundaries and races are in the two permanent canonical test files, not native clock manipulation. The baseline and final logs, inventory, screenshots and measurements distinguish controlled tests from desktop Chromium viewport emulation. CSS zoom approximates reflow and is not browser-native zoom certification. Physical mobile devices, OS file dialogs, soft keyboards and screen readers were not exercised.
