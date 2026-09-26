# Task 9.25 retained evidence and reproduction

Observed 2026-09-23 in desktop headless Chromium, Node 22, disposable profile `/tmp/dayframe-925-chrome-RESULT`, app origin `http://127.0.0.1:4926`, defensive QA origin `http://127.0.0.1:4927`. No Dogfood Pass 02 state was opened. Viewport emulation is not physical-device, soft-keyboard, screen-reader, or native-browser-zoom certification.

## Evidence provenance

- `canonical-seed-RESULT.ts` bundles the permanent `goalInspectionCanonicalFixture.ts` test builder. It invokes existing setup, Goal, specification, Requested Time, allocation/proposal acceptance, realization, Preview, publication, and rename commands. Three independently accepted **1-hour** iterations have distinct identities: first two realized and published, third positively unrealized. Support and protected components remain separate. Publication captures “Network+ original”; current Goal is “Network+ renamed”. This fixture is real owner-command data, not the distinct 10h/20h/1h semantic regression fixture.
- `canonical-fixture-RESULT.json` is the V14 export of that generated browser fixture, retained for inspection. It contains disposable generated records only. UUIDs and timestamps change when reproduced.
- The permanent Network+ semantic regression uses the existing validated canonical planning/publication builders in `acceptedSummaryFixtures.ts`: A=600, B=1200, C=60 minutes. The density fixture and all `defensive-harness-RESULT.*` responses are explicitly **simulated projections**, not valid persisted planning authorities or storage benchmarks. The defensive harness bundles the actual inspector, shared styles and projection helpers in production mode.
- `browser-driver-RESULT.mjs` prepares canonical data through commands in the disposable browser, reloads the unchanged production app, and exercises its real UI. It records equivalent lineage/owner IDs at all widths and hashes all 13 non-restore IndexedDB stores before/after the inspection workflow. This comparison does not claim to audit every localStorage key. Permanent command spies additionally cover absence of domain writes.
- `browser-measurements-RESULT.json` retains 46 viewport/control/focus measurements, four identity records, four Day destinations, and the read-only hash comparison. Primary inspector controls measured at least 44 CSS px high. CSS zoom 2 at a 640px viewport is a reflow approximation, not browser-native zoom. Headless page-focus emulation is enabled; keyboard Tab events verify movement through date-field segments to the end-date field. Return focuses the section heading with a 3px solid outline.
- Five PNGs retain 320px canonical inspection/return, simulated protected/error states, and 390×420 keyboard focus. Screenshots are viewport captures, not entire-page images.
- `validation-RESULT.json` retains baseline/final test and build logs, bundle measurements/policy, format/lint/types logs, HEAD and changed-baseline-file hashes. `baseline-status-RESULT.txt` is the exact captured starting status. Full 984-file baseline copies and intermediate failure/debug logs remain local-session-only under `/tmp/dayframe-925-*`; no previous Task 9.24 evidence was recreated.

## Reproduction

Use an isolated disposable browser profile and these dedicated ports. Never point the driver at a preserved user profile: it clears the **4926 origin** in its connected browser before seeding.

From `code/`:

```sh
npm test -- src/ui/tests/GoalAcceptedPlanning.test.tsx src/ui/tests/GoalInspectionNavigation.test.tsx
npm run build
npm run check:bundle
DAYFRAME_925_QA=seed npm exec vite build -- --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.25/qa-build-config-RESULT.mjs
npm exec vite build -- --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.25/qa-build-config-RESULT.mjs
npm run preview -- --host 127.0.0.1 --port 4926
```

In another shell from `code/`:

```sh
npm run preview -- --host 127.0.0.1 --port 4927 --outDir /tmp/dayframe-925-defensive-build-RESULT
```

Start a fresh disposable Chromium, then run from the repository root:

```sh
chromium --headless=new --no-sandbox --disable-gpu --remote-debugging-port=9326 --user-data-dir=/tmp/dayframe-925-chrome-RESULT about:blank
node docs/implementation/phase-9/evidence/task-9.25/browser-driver-RESULT.mjs
```

The driver writes a fresh fixture export, screenshots, and measurements into this evidence directory. Its temporary seed-bundle path is intentionally fixed by the retained build config. The scenario dates are September 2026; when reproducing in another month, first set the canonical application date appropriately or adapt the driver's initial range before its first iteration assertion. Tests of canonical current-day resolution explicitly cover the month boundary independently.

## Resolved execution issues and unrelated limitation

Development failures were resolved: publication fixture Review Scope/Publication Range originally included the unrealized acceptance; corrected canonical setup publishes only the two realized days. Disclosure toggles now update context synchronously before navigation. Test selectors were scoped where Goal status and report text both say “Completed”; restore and return-query waits use a 10-second async completion allowance under full-suite load. Navigation tests freeze Date while leaving IndexedDB timers real, so the September fixture remains deterministic in later months. Browser driver waits handle the transient absent document body, and page-focus emulation distinguishes actual focus styling from an inactive headless tab. Vite's native config loader avoids attempting its temporary bundled config outside the workspace.

An initial attempt to import the exported V14 fixture in the production browser failed with `TypeError: Illegal invocation`. Debugger tracing locates the existing `restoreCoordinator` call to participant `clonePayload`, assigned the unbound browser `structuredClone` in `dayFrameRestoreComposition.ts`. Those files are unchanged against the task baseline. Canonical command seeding bypasses that unrelated setup defect; no restore implementation was changed or patched in the browser. Clear/restore invalidation is separately covered through the actual application boundary with fake IndexedDB tests. Production V14 import is **not** claimed as passed or fixed by Task 9.25.
