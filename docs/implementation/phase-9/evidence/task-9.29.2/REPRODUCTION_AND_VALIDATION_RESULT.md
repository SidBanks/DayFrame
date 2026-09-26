# Task 9.29.2 reproduction and validation — RESULT

Use the installed toolchain and current dirty working tree. No dependency installation, preserved Dogfood state or historical evidence mutation is part of this procedure. Commands below use `code/` as the working directory unless a root-relative command is shown.

## Permanent deterministic proof

```sh
npm exec vitest -- run src/state/historicalPlanLifecycle.test.ts src/state/publicationReplacementIsolation.test.ts src/state/historicalPlanSurface.test.ts src/state/schedulePublication.test.ts src/state/dayFrameAuthorityTransaction.test.ts src/state/goalStructureOwnerSafety.test.ts src/state/dayFrameBackupV14Restore.test.ts src/state/dayFrameRestoreComposition.test.ts src/infrastructure/storage/indexedDbCollectionStorage.test.ts src/ui/tests/ScheduleReviewPanel.test.tsx --maxWorkers=1
npm exec vitest -- run src/ui/tests/PublicationReplacementFeedback.test.tsx src/state/publicationReplacementIsolation.test.ts src/state/historicalPlanLifecycle.test.ts --maxWorkers=1
npm run test -- --maxWorkers=1
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run build
npm run check:bundle
```

Final full suite runs without concurrent build/static jobs. A worker bound is used without reducing selection or changing timeouts/configuration. Original Task 9.29/9.29.1 diagnostics remain unchanged: their defect-confirming assertions are not renamed repaired-behavior tests. New permanent store tests derive the canonical Work/Sleep fixture and assert busy-first, explicit-replacement-retry-later, and exact restart state. Owner/adapter tests separately count attempted mutations and native receipt registrations. See `REGRESSION_MATRIX_RESULT.md` for all twenty cases and additional assertions.

The first focused run found the legacy protected-publication status had been projected as a generic rejection; the implementation was corrected to preserve `publicationBlockedProtected`. A focused command launched from repository root with `--root code` failed an existing relative-file fixture read; running from `code/` passed all ten selected files/125 tests. New fixture errors (explicit undefined optional property, wrong Structure relationship shape, hidden Requested Time control during Goal editing) were corrected; assertions were not relaxed. The draft test first asserts preserved Goal/Structure drafts, explicitly cancels only Goal editing, then verifies retained Requested Time. A temporary positional-callback syntax error and an unused new-fixture import were fixed before final checks. Intermediate logs remain retained.

The first final full run passed 1,717/1,718 tests. The existing Sleep stale-source test expected `writeFailedBeforeCommit` after its metadata-read seam invalidated the source. The repaired owner detects that source change before entering storage and returns the accepted `rejected/sourceChanged` classification. Its assertion now requires that exact status and reason; the original zero-write and ready-state assertions remain unchanged. The focused Sleep suite passed before repeating the complete suite. The initial failure is retained in `full-suite-initial-failure-RESULT.log`; no production code, timeout or configuration changed for this correction. The final format check also identified spacing in the new lifecycle test; scoped Prettier formatting corrected it without semantic changes, then the complete formatting check was repeated.

## Native production procedure

Source origin: `http://127.0.0.1:4970`; distinct destination: `http://127.0.0.1:4971`. Disposable Chromium profile: `/tmp/dayframe-9292-chrome-RESULT`; CDP 9342. Downloads and helper bundle use separate `/tmp/dayframe-9292-*-RESULT` paths. No preserved Dogfood profile/origin was accessed.

From repository root, build the supporting canonical seeder:

```sh
npm exec --prefix code vite -- build --config docs/implementation/phase-9/evidence/task-9.29.2/seed-build-config-RESULT.mjs --configLoader runner
```

Serve the actual production `code/dist` on both ports with `npm run preview -- --host 127.0.0.1 --port PORT` from `code/`. Launch Chromium with:

```sh
chromium --headless=new --no-sandbox --disable-gpu --remote-debugging-port=9342 --user-data-dir=/tmp/dayframe-9292-chrome-RESULT about:blank
```

Then from repository root:

```sh
node docs/implementation/phase-9/evidence/task-9.29.2/browser-driver-RESULT.mjs
```

The driver connects only to local CDP and its disposable origins. Sandbox network access initially returned EPERM; the permitted escalated run connected successfully. Actual publish, export/download, file input import, clear and confirmation controls are used. Canonical seeding authors saved Work, first-class Sleep, one routine commitment and a linked Goal; it does not substitute for the certified UI publication/import/export/clear actions. Initial seeding omitted the UI-required block template and was correctly blocked; that fixture was completed. The first mobile run exposed the existing 40px Refresh target; a scoped current-surface rule establishes 44px. Busy import feedback was hidden behind the still-open rejected clear confirmation; the current control now closes that rejected confirmation and restores Clear focus. Material intermediate browser failures are retained separately.

Core comparison is exact JSON equality of complete backup `data` across source export, distinct-destination import/re-export and reload/re-export. Only export metadata outside `data` is excluded. No collection reordering or optional-field normalization is applied. Direct native IndexedDB readback compares complete batch/day rows, including exact IDs/timestamps, frozen Work/Sleep/Goal evidence. A newly reviewed changed Work title is published through the actual UI after restore. Actual full clear/reload leaves both historical stores empty.

## Controlled seams and native limits

The native busy seam lets the real readwrite transaction commit but holds delivery of its native completion callback/terminal receipt. The actual repaired owner stays leased; actual UI clear and V14 import return busy without replacing authority. One created publication transaction is counted. Goal title draft and current authority are checked unchanged. Explicit release allows owner verification/recording to finish; a new explicit clear confirmation is required, followed by empty durable readback/reload. This is controlled completion-event delivery, not a spontaneous native storage failure.

Pending/protected/uncertain/context-result presentation uses an explicitly labelled consumer-result seam on the current app store function and remounts current Review. These runs certify copy/reflow, not owner durability or protection transitions; those transitions are covered by permanent actual-adapter tests. Their success does not imply another tab or concurrent owner is coordinated.

Twenty-six measurements cover 320/390/768/1280 CSS px and a 320×420 reduced-height keyboard/reflow check. Checked primary targets are at least 44 CSS px; document scroll width never exceeds client width. Retained 320/390 screenshots show reachable textual feedback, wrapping and visible focus. The final keyboard observation has a visible 2px solid outline. Native exceptions list is empty. No physical-device, OS-file-dialog, soft-keyboard, screen-reader or native-zoom certification is claimed. The current Review surface remains; Task 9.29's new layout is not delivered.

## Preservation

`baseline-hashes-RESULT.json` pins 1,264 existing files at HEAD/status capture. `governing-source-hashes-RESULT.json` pins the actual consulted sources and acceptance ADR. The final manifest enumerates all task-created/touched repository files. Hash comparison protects every unchanged earlier input, RESULT, ADR, diagnostic and observation. Normal ignored production/cache outputs and ephemeral helper build/profile/download paths are tooling products, not a commit or remote backup. All durable QA/report/export/screenshot filenames contain RESULT; application and test files use repository naming conventions.
