# Reproduction, validation, and evidence limits — RESULT

## Baseline and commands

The task started from HEAD `c0cc9ae2ae68af626e64747539a417f10df1cf3a`, **261 status entries and 1,435 preserved baseline files**, including prior uncommitted work. `baseline-status-RESULT.txt`, `baseline-head-RESULT.txt`, `baseline-hashes-RESULT.json`, and `baseline-source-RESULT.tar.gz` establish the task-relative baseline. No reset, stash, commit, push, dependency installation, or preserved Dogfood state operation was performed. These are local repository artifacts, not remote backups.

Run repository commands from `code/`:

```sh
npm test -- --maxWorkers=1
npm run lint
npm run typecheck
npm run build
npm run check:bundle
npm exec vitest -- run src/state/acceptanceReplacementIsolation.test.ts src/state/acceptanceOwnerLifecycle.test.ts src/state/proposalWriteLifecycle.test.ts src/state/realizationConcurrency.test.ts src/state/acceptanceCoordinator.test.ts src/state/acceptanceSourceWitness.test.ts --maxWorkers=1
```

The final full run follows completion of formatting, lint, typecheck, production build, bundle checking, and disposable seed compilation. No build/static process runs alongside that final suite. `final-build-source-hashes-RESULT.json` pins every source file; the preservation audit verifies no later application/test edits. `task-relative-RESULT.patch` compares source to the baseline archive, rather than conflating earlier dirty work with this repair.

Only task-touched source files were formatted (listed in `task-source-files-RESULT.json`). Logs retain both intermediate failures and the final run; they are not all claimed as passing validation.

## Permanent fixture provenance

`acceptanceLifecycleTestFixtures.ts` derives the retained diagnostic's disposable saved Goal/Demand/Sleep setup through real owners and allocates a complete footprint with 60 productive minutes, 30 required support minutes and 15 required Buffer minutes. All race fixtures use fresh fake IndexedDB factories/local storage. Deferred gates count attempted calls separately from native transaction registration and forward both admission and observer.

`realizationConcurrency.test.ts` constructs complete domain footprints and accepts them through real Proposal owners. Distinct overlap fixtures intentionally use independent Proposal owners so realization's resolver/conflict boundary can be tested without pretending current UI can accept overlapping claims. The adjacent-day case keeps exact canonical owner days, support relationships and Buffer role. Existing domain/capacity/backup tests establish supported representation and independent evidence behavior.

Historical 9.29.3 diagnostic source, configs, observations and logs remain byte-identical. New permanent tests demonstrate changed outcomes at equivalent selected gates; no old defect-confirming observation is relabeled a repaired run.

## Native production reproduction

The retained seed build config imports current application modules and emits a disposable IIFE. From `code/`:

```sh
npm exec vite -- build --config ../docs/implementation/phase-9/evidence/task-9.29.4/seed-build-config-RESULT.mjs
npm run preview -- --host 127.0.0.1 --port 4974
npm run preview -- --host 127.0.0.1 --port 4975
```

Use a **new disposable Chromium profile** with remote debugging port 9344. The executed browser profile was `/tmp/dayframe-9294-browser-RESULT`; neither origin contains preserved user state. The driver clears only these disposable test origins. It uses browser download handling and the actual file input for import; it does not certify the OS file picker.

From repository root, run:

```sh
node docs/implementation/phase-9/evidence/task-9.29.4/browser-driver-RESULT.mjs > docs/implementation/phase-9/evidence/task-9.29.4/browser-core-RESULT.log 2>&1
```

The initial sandbox denied localhost CDP socket access (`browser-first-RESULT.log`). The same retained driver was then run with approved escalation. Fixture seeding creates saved Goal/Demand/full-footprint/Sleep and an undecided Proposal through canonical APIs. **Acceptance, explicit Retry, complete backup export/import/re-export, clear and confirmation are actual existing UI actions.** Fixture seeding does not accept or realize the Proposal.

`alreadyRealized` is a native canonical command check through the mounted store, because the successful UI removes the retry control. It compares raw rows before/after; it is not represented as a nonexistent UI interaction.

Controlled native seams:

- Abort the first real realization transaction after creation to retain acceptance for the actual Retry control.
- Hold delivery of a real native transaction completion callback separately for Proposal and realization. Both actual clear and V14 import return busy; no replacement data/epoch effects; a Goal editor draft remains present. Release the callback, settle the command, then explicitly clear.
- Suppress one successful native put request's outward acknowledgment while allowing its actual transaction completion and terminal observer to run. MessageChannel settlement reports unconfirmed/protected. Actual clear is denied; raw rows stay exact. Releasing the old request acknowledgment does not authorize ordinary replay. Existing verified reload re-establishes readable authority, followed by explicit clear.

The browser driver records transaction counts for held native completion, raw authority JSON, every exported backup, current feedback, and per-width DOM measurements. `browser-core-RESULT.log` requires both `NATIVE_CORE_PASS` and `NATIVE_LIFECYCLE_MOBILE_PASS`; `browser-checks-RESULT.json` records captured browser exceptions.

## Exact comparisons and mobile scope

All backup data is compared exactly, with only the documented unordered **top-level realization facts** sorted by ID. IDs, revisions, timestamps, optional absence, nested array order, source lineage, role membership and other collections are untouched. The native fixture's History/Actual/Progress collections remain empty and unchanged. Nonempty frozen history, independent Actual/Progress and supported older representations are covered by the retained permanent backup/product-evidence suites, not invented native data.

The driver measures 320, 390, 768 and 1280 CSS px for automatic success, retained-acceptance failure/retry, both owner busy clear/import and both unconfirmed/protected clear outcomes. It asserts no document horizontal overflow and primary control heights at least 43.5 CSS px. A 320×420 keyboard case tabs from acceptance and records active element/visible outline. Representative 320/390 screenshots retain text feedback and reflow. Native controls remain semantic buttons, headings and status text; no color-only outcome or gesture-only required operation was added.

These are desktop Chromium viewport/DOM/keyboard observations plus source/UI tests. They do not certify physical devices, native mobile browsers, OS dialogs, soft keyboards, screen readers or browser-native zoom, and do not deliver the future 9.29 layout redesign.

## Intermediate failures and corrections

Initial development logs include a local shell/type collision, the acceptance stale-transition promise being returned without awaiting leased settlement (corrected to await), and test fixtures that assumed V14 returned a generic rejected status instead of restoreBusy or used `in` on a lazy Proxy. These were corrected without weakening safety assertions.

The first full implementation run had one failure: two existing constructive UI test wrappers forwarded mutation rows but dropped admission/observer. They now forward both required protocol parameters; their behavioral expectations and timeouts remain unchanged. The displaced Structure revalidation assertion now expects the explicit contextReplaced reason while retaining zero-write safety.

Browser harness failures were a raw top-level fact-order comparison after reload, an incorrect retry label, and premature access to a lazy Goal navigation button. Each failure log is retained. The comparison now keys only the documented unordered fact collection; UI actions use the actual label and wait for the existing button. A new source fixture initially attempted store-level offer derivation for an unrelated domain-only Goal; it now uses canonical domain derivation to test only common-writer coexistence, as explicitly labeled in source.

`tests-pre-freeze-RESULT.log` passed but source review was still in progress. Only the subsequent frozen-source `tests-final-RESULT.log` is the final full gate. No failure was hidden by widening result alternatives or changing hard bundle thresholds.
