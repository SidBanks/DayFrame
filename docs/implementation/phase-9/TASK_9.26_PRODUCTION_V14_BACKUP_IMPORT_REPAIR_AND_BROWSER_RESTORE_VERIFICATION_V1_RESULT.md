# Task 9.26 — Production V14 Backup Import Repair & Browser Restore Verification V1 RESULT

**Status: COMPLETE — bounded implementation repair and browser verification**  
**Observed: 2026-09-23**

## 1. Determination

The production V14 import failure was reproduced through the application's native file-input path and repaired. A valid complete backup now replaces a distinguishable destination through the existing restore protocol, preserving its canonical identities, revisions, optional fields, historical publications, Actual and independent Progress. Native production-browser import, re-export, reload and inspection passed at 320, 390, 768 and 1280 pixels.

Controlled failure testing also exposed a live recovery-boundary omission: the coordinator could require recovery after durable mutation while the store remained ready for ordinary authoring. The repaired shared modern-backup result branch now publishes the existing protected readiness state, and existing domain admission callbacks honor readiness. No transaction stage, format, migration, recovery command or domain semantics were added.

All 1,590 tests pass; required repository and hard bundle gates pass. The scope does not certify all historical formats in browsers or every possible recovery failure.

## 2. Task identity, baseline and protection

The saved execution input is byte-identical to the user attachment and retains Sections 1–18 and its final statement. Its existing filename spells `BROSWER`; that immutable input was not renamed or edited. Discovery found only this executed Task 9.26 and an older projected hydration roadmap entry, not a conflicting assignment.

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Starting status: **199 entries**. The task-relative baseline copied and SHA-256-hashed **1,007 tracked/relevant untracked files**. No applicable AGENTS.md was found in the repository or checked ancestors. Final comparison changes only the four baseline application files listed in Section 11, with no missing baseline files.

Fresh baseline: **157 files / 1,579 tests passed**, 74.62 seconds; build/bundle passed. Exact status and material validation are retained in [evidence/task-9.26](evidence/task-9.26/PROVENANCE-RESULT.md). Full baseline copies/builds/intermediate logs remain local-session-only in `/tmp/dayframe-926-*`.

No reset, stash, commit, push, dependency installation, unrelated cleanup, prior RESULT edit or architecture edit occurred. No preserved Dogfood Pass 02 state was opened, initialized, imported over, cleared or otherwise touched. Browser profiles, origins, databases and files used here are identified disposable fixtures.

## 3. Governing inputs and executable owners

Actual repository inputs consulted:

- Task 9.25 RESULT and `evidence/task-9.25/PROVENANCE-RESULT.md`, its retained driver/export and canonical fixture; its successful inspector proof was not mistaken for successful import.
- Task 9.24 RESULT's draft, partial-save, retry, clear/restore and profile boundaries; `GoalsFocusedEditing.test.tsx`, existing `GoalInspectionNavigation.test.tsx` and editing context.
- `docs/adr/ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`, `ADR_DURABLE_CROSS_STORAGE_RESTORE_FOUNDATION.md`, and `ADR_BACKUP_V3_COMPLETE_CROSS_SURFACE_AUTHORITY_RESTORE.md`.
- `docs/architecture/DayFrame_End_State_Compatibility_Retirement_Architecture_Specification_V1.md`, especially data round-trip, historical/protection, compatibility and failure parity.
- `code/src/state/dayFrameBackupV14.ts` and its V13→V12 validation chain; `backupTransferSurface.ts`, `dayFrameStore.ts`, `dayFrameRestoreComposition.ts`, `dayFrameRestoreTranslation.ts`, `dayFrameRuntimeAuthority.ts`, `dayFrameAuthorityTransaction.ts`, `dayFrameReadiness.ts`, `dayFrameMutationAdmission.ts`.
- `code/src/infrastructure/restore/{restoreCoordinator,restoreParticipants,restoreStaging,restoreJournal,restoreIdentity}.ts` and storage adapters; `restoreInfrastructure.test.ts`, `dayFrameRestoreComposition.test.ts`, supported V3–V12 integration fixtures, Sleep foundation/compatibility tests.
- Existing Goal, Requested Time/resource, proposal, realization, historical publication, execution, measurement/Progress and Structure owner types/commands; the canonical fixture reuses their executable validation contracts. No new authoring UI was built to populate them.

## 4. Native reproduction and root cause

A source-mapped production build of the captured baseline was served at `127.0.0.1:4936`. A new Chromium profile `/tmp/dayframe-926-chrome-RESULT`, CDP port 9327, selected the actual retained Task 9.25 complete V14 JSON through **Settings and data → Import Setup Backup**. Native globals were unchanged.

The observed exception was:

```text
TypeError: Illegal invocation
  dayFrameRestoreComposition-DCVivhut.js:2:11395
  restoreCoordinator.ts:361 — participant.clonePayload(checked.payload)
  restoreCoordinator.ts:138 — validateTargets(targetInput)
  dayFrameStore.ts:2646 — coordinator.restore(...)
  DayFrameApp file-selection handler
```

The retained JSON includes original generated stack, source-map locations (zero-based), browser version, build entry, user-visible `Illegal invocation`, and complete localStorage/IndexedDB snapshots before and after. They are exactly equal.

The first registry participant is Active. Its `clonePayload` property held the native `structuredClone` function directly. Invoking `participant.clonePayload(...)` supplies the participant object as `this`, which the browser's native function rejects. Node/fake IndexedDB did not reproduce that receiver sensitivity, explaining the previous passing automated restore tests.

Failure occurs after `runtime.begin("restore")` has captured runtime authority and activated its transaction guard, but before target translation, recovery capture, journal/staging or durable replacement. No domain runtime target is installed. The exception escapes this preparation call and reaches the UI; the old page's coordinator/runtime guard remains in preparation. This is not a finding of persisted data loss.

### Bounded callback correction

`dayFrameRestoreComposition.ts` now registers `clonePayload: (payload) => structuredClone(payload)` at lines 148, 190, 230, 263, 289, 316, 343, 369, 407, 447 and 486.

The eleven registrations cover thirteen participants: the shared local factory supplies Active, Profiles and PlanDecision; ten further callbacks supply ExecutionHistory, HistoricalPlan, Goals, measurement definitions, Progress observations, Structure, Requested Time/planning, composition, proposals and realizations. All share the established invocation contract in `restoreCoordinator.ts` at target validation (361), recovery capture (149) and runtime translation (416).

The bounded search covered `clonePayload: structuredClone` and `.clonePayload(...)` under `code/src`. The only remaining direct registration is a Node-only synthetic coordinator test harness, not production code. Free native calls elsewhere were not globally rewritten. Cloning still uses native structured cloning, with its original value semantics and error propagation; there is no JSON replacement, polyfill, catch-and-continue or participant omission.

## 5. Existing protocol and the related live protection repair

The actual workflow has **no separate import review/confirmation dialog**. File selection is the current user action that starts import. Cancellation occurs before a file is selected; the no-file branch returns without invoking restore. No new confirmation or admission path was invented.

The existing sequence remains:

1. `DayFrameApp.tsx`, `handleBackupFileSelection`: read file text, parse JSON, select the supported parser/adapter. `dayFrameStore.ts:importBackupFile` routes V14; `importBackupV14` validates through `dayFrameBackupV14.ts` and its compatibility chain before calling `restoreModernBackup` (now line 2619).
2. `restoreModernBackup` builds storage-specific targets for **all thirteen** owners and invokes the one coordinator. It does not create replacement Goals, accept proposals, realize work, publish, report Actual or infer Progress.
3. `restoreCoordinator.ts:124`: reject busy state; begin the existing runtime authority transaction; check participant readiness; validate/clone all targets and translate prospective runtime targets; capture recovery authority and source fingerprints.
4. Write `prepared` journal; stage target/recovery in IndexedDB and localStorage; reread/verify staging; recheck source fingerprints; persist `staged`.
5. `commitTarget` (253): one combined IndexedDB replacement and verification; record `indexedDbCommitted`; write/reread local participants (existing bounded retry) and anti-resurrection marker; record `localStorageCommitted`.
6. Verify all durable targets, translate/install runtime through the existing authority transaction and commit it; record `verified` and `finalized`; perform existing cleanup; report completed.
7. `rollback` (308), `recoverAtStartup` (194), `protect` (485) retain their existing exact recovery, journal and protection decisions. Invalid/missing evidence is not inferred or repaired opportunistically.

Failure injection established that a failed runtime installation after durable verification returns `recoveryRequired` while aborting the runtime snapshot. Before this repair, the store's readiness stayed `ready`, and its domain callbacks checked only whether the runtime transaction was inactive. That combination permitted ordinary authoring against runtime authority that could differ from committed durable authority.

The `restoreModernBackup` recovery/rollback-failed branch now sets the **existing** `{status: "protected", reason: "authorityRecoveryRequired"}` classification and notifies readiness subscribers. Seven existing Goal/measurement/observation/Structure/planning/composition/proposal admission callbacks require ready state as well as inactive transaction. Setup and execution already use the central readiness admission gate. The UI therefore uses its existing protected boundary rather than offering normal authoring. The existing rejection categories, startup recovery owner and journal protocol are unchanged. This applies to modern backup versions sharing that branch, without claiming native-browser certification of each version.

## 6. Source A, destination B and fidelity

`v14RestoreFixture.ts` extends the existing canonical planning fixture through supported commands. It includes:

- Authored setup with a 03:00 User Day boundary and source incarnations; Goal metadata, revisions and exact Commitment link.
- Requested Time history whose latest session is splittable, minimum 15/preferred 45 minutes and **absent maximum**; exact priority, resource specification/revision/variant association. Earlier acceptance keeps its original request revision.
- Three distinct accepted 1-hour iterations for one Goal; two realized, one accepted/unrealized. Productive, Support and protected time remain separate.
- Immutable publication with “Network+ original”, separately renamed current Goal, completed reported Actual of 47 minutes with a note, and independent measured Progress of 17 words toward a 100-word target.
- Structure relationship, child Goal and milestone, First-Class Sleep, and a saved setup profile.

Source A and B were generated independently on origins 4937 and 4938, giving distinct canonical identities. Source A's **ordinary UI export** produced the actual V14 file imported into B. Canonical seeding populated fixtures only; it did not substitute for import. Actual UI re-exports establish the result before and after browser reload.

All thirteen `.data` authorities compare equal. Export metadata `exportedAt` legitimately differs. Automated in-memory-versus-reinitialized fixtures require identity-based ordering for only six named top-level proposal/realization collections; every record and nested value is still compared. The browser's source itself was reloaded before export, and **all twelve native comparisons passed even with exact array order**. The driver does not blanket-normalize missing fields, IDs, timestamps, revisions or nested historical values.

B-only Goal records are absent after exact replacement. An unrelated storage sentinel remains. There is no invented merge policy: complete V14 replaces all included participants. Preview, presentation drafts, derived summaries, physical wrappers, durability state and restore infrastructure are excluded from the portable domain backup; setup-profile loading remains independently scoped under its existing tests. Every required width also completed reload and fresh Goal inspection, beyond the task's minimum one reload run.

## 7. Rejection, failure and retry evidence

| Case and evidence source                               | Observed outcome and authority claim                                                                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No file / cancellation, UI test and native CDP input   | No import call in automated test; selected Goal draft/disclosure retained. No separate confirmation is present.                                                          |
| Malformed JSON, native each width + UI test            | Associated error; no restore; B's canonical export unchanged.                                                                                                            |
| Invalid V14/dangling authority, permanent tests        | `invalidBackup` before restore; existing authority/context preserved.                                                                                                    |
| Unsupported version, native each width + tests         | Explicit unsupported-version rejection; no conversion/defaulting.                                                                                                        |
| Protected participant, injected existing seam          | `protectedCurrentState` names Goals; B unchanged; coordinator idle.                                                                                                      |
| Recovery capture failure, injected participant         | `persistenceFailure` from `stagingFailed`; runtime aborted; B unchanged; explicit retry succeeds.                                                                        |
| Atomic IndexedDB commit failure, injected storage seam | `persistenceFailure`; no claimed restore; B unchanged; later explicit import succeeds.                                                                                   |
| Local forward write failure, injected participant      | Existing bounded forward retry then exact rollback; `rollbackCompleted`, not success; B restored.                                                                        |
| Runtime installation failure after durable commit      | `recoveryRequired`; live authoring protected, ordinary import busy. No assertion that durable data stayed B. Existing startup journal resumes A and re-export matches A. |
| Forward and rollback failure                           | Persisted `recoveryRequired`; normal authoring remains blocked before/after restart. No automatic abandonment or universal retry promise.                                |

Injected failures are not represented as native storage failures. Native runs establish the original receiver defect and ordinary successful/rejected import paths. Existing source-recheck, staging, anti-resurrection, journal, interruption and supported-version tests remain in the full suite. No new operation ledger or universal idempotency guarantee was introduced.

## 8. Goal, draft and inspector boundaries

The new actual-application tests preserve unsaved Goal/Requested Time drafts, applied period and iteration disclosure after no-file, invalid and unsupported imports. A real successful V14 import invalidates replaced context; a delayed old G2 response cannot resurrect it. Fresh inspection reads restored owners and the ordinary default period.

A separate regression delays the continuation of an already accepted Requested Time change across actual import. Context invalidation prevents the old continuation from appending Priority or replaying the draft into restored authority. Recovery-required results use the existing protected application boundary and remove the old editing UI. The unchanged Task 9.24 retry/partial-save/F1/profile regressions and Task 9.25 Summary/Goal/Day/report/Back regressions remain passing. Drafts were neither silently saved nor rebased during import.

## 9. Browser, mobile and accessibility gate

Native headless Chromium used a production build and fresh disposable origins. At every width the driver reached Settings, selected the actual A file, completed ordinary import, inspected restored iteration/publication/Actual evidence, exercised rejected inputs and reloaded/reinspected. There are no clone/global shims or internal import helper calls in the browser driver.

| Measurement                         | Result                                                             |
| ----------------------------------- | ------------------------------------------------------------------ |
| Viewports                           | 320, 390, 768, 1280 × 800 CSS px                                   |
| Document client/scroll widths       | 305/305, 375/375, 753/753, 1265/1265; 15px scrollbar               |
| Retained viewport/control snapshots | 22; zero horizontal overflow                                       |
| Utility/inspector action height     | Minimum 44px                                                       |
| Authority comparisons               | 12 passed; native array order also exact                           |
| Browser exceptions                  | Zero uncaught in final successful run                              |
| Error/success association           | `role="alert"` / `role="status"`, import button `aria-describedby` |
| Reduced height and keyboard         | 390 × 420; Export→Import Tab, visible 2px outline                  |
| Reflow                              | CSS zoom 2 at 640 × 800; no document overflow                      |

The initial mobile run measured existing backup buttons at 40px. A scoped utility-panel rule increases them to 44px; no overflow is hidden. Import feedback now has semantic roles and a direct association with the trigger. Rejected imports explicitly restore focus to the re-enabled Import button; successful restore focuses the Calendar month heading. The browser driver checks focus with headless page-focus emulation enabled. Semantic controls and non-color error text require no hover, double-click or right-click.

Four representative PNGs and machine-readable measurements are retained and visually inspected. There is no confirmation screenshot because the current import contract contains no separate confirmation. These observations do not certify physical devices, operating-system file dialogs, soft keyboards, screen readers or browser-native zoom.

## 10. Validation and bundle

From `code/`: formatting, lint, typecheck, focused tests, full tests, production build and bundle policy all pass. `git diff --check` passes from the repository root. The eleven added cases bring the suite to **159 files / 1,590 tests**; the final full run took **90.91 seconds** using `npm test -- --maxWorkers=2`.

Default-worker full runs hit an unchanged Setup test's existing 5-second timeout; one new async restore wait initially also expired under contention. The new wait was made appropriately asynchronous (10 seconds). The final worker limit reduces contention without changing assertions, existing test timeouts, repository configuration or dependencies. These intermediate failures and resolutions are retained; no compatibility test was weakened.

| JavaScript metric  | Fresh baseline |     Final | Delta | Hard limit / remaining |
| ------------------ | -------------: | --------: | ----: | ---------------------: |
| Initial raw        |        622,594 |   623,114 |  +520 |       685,000 / 61,886 |
| Initial gzip       |        163,125 |   163,250 |  +125 |        170,000 / 6,750 |
| Largest lazy chunk |         62,652 |    62,652 |     0 |       100,000 / 37,348 |
| Total              |      1,226,104 | 1,226,690 |  +586 |               Advisory |

Existing initial-gzip advisory (161,500) and total-JavaScript architecture-review advisory (825,000; warning 800,000) remain. No threshold was raised. Restore composition and backup readers retain their lazy boundaries. The source-mapped pre-fix reproduction build is separate from the ordinary build used for these bundle measurements.

## 11. Exact file scope and retained evidence

Modified baseline application files:

- `code/src/state/dayFrameRestoreComposition.ts`: eleven receiver-safe native clone callbacks for thirteen participants.
- `code/src/state/dayFrameStore.ts`: existing protected readiness on modern restore uncertainty, with readiness-aware domain admission callbacks.
- `code/src/ui/DayFrameApp.tsx`: associated semantic import result/error feedback and rejection focus restoration.
- `code/src/ui/dayFrameUi.css`: scoped 44px backup utility controls.

New permanent test/source helpers:

- `code/src/state/dayFrameBackupV14Restore.test.ts`: eight callback/fidelity/compatibility/failure/retry/reinitialization cases.
- `code/src/ui/tests/V14ImportContext.test.tsx`: three actual import-context and delayed continuation cases.
- `code/src/ui/tests/v14RestoreFixture.ts`: canonical nontrivial source builder, shared with browser QA.

New report: this RESULT. New files under `evidence/task-9.26/`:

- `PROVENANCE-RESULT.md`: reproduction commands, fixture provenance, evidence classification and limits.
- `baseline-status-RESULT.txt`, `validation-RESULT.json`: exact baseline status, hashes and material command/bundle output.
- `pre-fix-driver-RESULT.mjs`, `pre-fix-failure-RESULT.json`: native baseline reproduction and source-mapped failure evidence.
- `canonical-seed-RESULT.ts`, `seed-build-config-RESULT.mjs`: QA-only canonical fixture bundle, outside the production entry graph.
- `browser-driver-RESULT.mjs`, `browser-measurements-RESULT.json`: actual import/export/reload driver, identity and viewport comparisons.
- `source-A-native-export-RESULT.json`, `320-B-before-RESULT.json`, `320-reloaded-native-export-RESULT.json`: representative actual exported files.
- `malformed-input-RESULT.json`, `unsupported-input-RESULT.json`: deliberately rejected input artifacts.
- `320-native-import-error-RESULT.png`, `320-native-import-result-RESULT.png`, `320-restored-inspection-RESULT.png`, `390-reduced-height-keyboard-RESULT.png`: browser screenshots.

All additional output filenames contain RESULT. Evidence is retained locally in the repository, not claimed committed/remotely backed up. Temporary builds/maps, browser profile, downloads and full baseline copies are explicitly local-session-only. Previous Task 9.25 evidence remains untouched.

## 12. Effects, limits and completion

No schema, storage version, backup format, migration, dependency, compatibility reader, historical record, domain command semantics, lifecycle policy, retirement or forensic-state change occurred. The native callback correction preserves structured-clone semantics. The additional readiness wiring enforces the already-defined recovery boundary; it does not choose a new roll-forward/rollback policy.

The principal native proof covers valid V14 import and its observed rejection paths in this Chromium build. Controlled tests cover the stated failure branches and supported-version compatibility; they do not certify every historical browser dataset or recovery scenario. No missing evidence contract, new architecture authority or unresolved mandatory gate remains.

**Task 9.26 — Production V14 Backup Import Repair & Browser Restore Verification V1 is COMPLETE.**
