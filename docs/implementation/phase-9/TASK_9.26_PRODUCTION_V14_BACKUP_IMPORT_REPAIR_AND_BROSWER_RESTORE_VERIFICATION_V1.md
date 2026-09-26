# Task 9.26 — Production V14 Backup Import Repair & Browser Restore Verification V1

**Status:** READY — BOUNDED CORRECTNESS REPAIR
**Phase:** Phase 9 — Product Convergence
**Task Type:** Existing Restore Implementation Repair and Production-Browser Verification
**System:** DayFrame
**Prerequisite:** Task 9.25 — Goal Accepted Planning & Scheduled Work Inspection V1 — accepted COMPLETE
**Implementation Authority:** Narrow repair of the existing complete V14 import/restore implementation and directly necessary failure presentation
**Data-Write Authority:** Existing explicitly confirmed restore commands, exercised only against disposable test state
**Architecture / Domain-Semantics Change Authority:** NONE
**Persistence-Format / Schema / Dependency Change Authority:** NONE
**Retirement / Removal Authority:** NONE

---

## 1. Objective

Repair the production V14 backup-import failure reported during Task 9.25 and prove that the actual application import path works in a production browser.

The required successful workflow is:

```text
Valid complete V14 backup
→ ordinary application import
→ existing validation/review/confirmation
→ existing restore protocol
→ canonical restored state
→ browser reload
→ preserved restored state
```

Restore must preserve the identities, revisions, historical evidence, protection rules, and included/excluded surface boundaries defined by the existing contracts.

The task must also establish truthful behavior for rejection, cancellation, persistence failure, and any existing recovery-required outcome relevant to the repaired path.

This is not a new backup system, format migration, protected-history recovery feature, or Goals lifecycle task.

---

## 2. Checkpoint and Reported Defect

Task 9.25 is accepted COMPLETE for its bounded read-only inspector.

Its RESULT reports:

- A pre-existing production V14 import failure.
- The error `Illegal invocation`.
- A suspected/identified cause involving unbound `structuredClone` during restore-participant cloning.
- Successful inspector browser testing using canonical command seeding instead.
- Separately passing automated clear/restore tests.
- No claim that production backup import passed.

Treat this as a concrete reproduction lead, not independent proof of the exact current root cause.

Do not assume that all backup versions fail, that persisted data was lost, or that every detached cloning call is defective.

Before execution, confirm no conflicting executed Task 9.26 assignment exists. The hydration package’s projected numbering does not override later assigned tasks.

Do not overwrite or silently renumber an actual conflict.

---

## 3. Governing Inputs

Read the actual repository copies of:

1. Task 9.25 RESULT, especially its production-browser limitation and exact file scope.
2. `evidence/task-9.25/PROVENANCE-RESULT.md` and the relevant retained reproduction material.
3. Task 9.24 RESULT and its clear/restore, draft, partial-save, and persistence-retry regressions.
4. `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.
5. Existing complete V14 backup validators, export/import adapters, restore coordinator, runtime participants, and persistence/recovery contracts.
6. Existing backup/restore/full-clear tests and supported-version fixtures.
7. Relevant Goal, Requested Time, Structure, realization, publication, execution, and Progress preservation contracts.
8. End-State Compatibility & Retirement Architecture Specification V1.

Inspect current public and internal contracts before selecting a correction.

Do not substitute a hydration summary or the one-line failure description for the executable restore protocol.

Record exact source paths and the branches that establish admission, mutation, durable commit, runtime installation, verification, and failure outcomes.

---

## 4. Baseline and Forensic Protection

Before changing files:

- Record HEAD and `git status --short`.
- Inspect applicable repository instructions.
- Capture a task-relative baseline for tracked and relevant untracked files.
- Record current tests and production bundle measurements.
- Identify the exact production build and browser environment used for reproduction.

Task 9.25 reported 190 starting status entries and a 984-file baseline. Those are historical measurements, not expected current values.

Preserve all unrelated dirty work, task inputs, architecture documents, historical RESULTs, and retained evidence.

Do not reset, stash, commit, push, or perform unrelated formatting/cleanup.

Never open, import over, clear, initialize, migrate, repair, or normalize the preserved Dogfood Pass 02 state.

Use explicitly identified disposable browser profiles, origins, databases, backup files, and canonical fixtures. Do not test recovery by risking the user's working data.

---

## 5. Reproduce the Actual Production Failure

Use the existing installed toolchain and a production application build.

Reproduce through the ordinary application import path, including its real file parsing, validation, confirmation, and restore invocation.

Canonical command seeding is allowed to create a disposable source dataset. It is not a substitute for importing the resulting backup into the destination.

Use the browser's native runtime behavior for the principal reproduction.

Do not:

- Replace the production clone implementation in the QA harness.
- Shim globals to make the failed path succeed.
- Call an internal restore helper while bypassing the failing UI/admission path and label that production-import success.
- Treat fake IndexedDB or a Node-only test as the complete browser proof.

Capture:

- Backup version and fixture provenance.
- Exact error and stack.
- Relevant source-mapped call sites.
- Restore phase at failure.
- Whether any runtime or durable mutation occurred.
- The user-visible outcome.

Trace the reported cloning/binding hypothesis through its actual caller, participant, and callback invocation.

If the current failure cannot be reproduced, document the tested path and dataset precisely. Do not apply a speculative global patch or declare the defect repaired merely because a different path works.

---

## 6. Narrow Repair Scope

Correct the established invocation/callback defect in the existing restore implementation.

Preserve the current cloning contract, supported value semantics, validation, and error propagation.

Inspect directly related call sites sharing the same implementation mechanism. Correct additional occurrences only where the same defect is demonstrated or established by the traced invocation contract.

Record the bounded search and each changed call site.

Do not introduce:

- A new persistence abstraction.
- A global cloning polyfill or monkey patch.
- JSON serialization as a replacement cloning strategy.
- Catch-and-continue behavior that discards a failed participant.
- Silent defaults for missing restored data.
- New schema, backup version, or migration.
- A broad restore refactor unrelated to the failure.
- A new dependency.

Small directly necessary error/focus corrections are permitted if the existing import flow otherwise misrepresents the repaired operation. Do not redesign Settings or backup navigation.

---

## 7. Existing Restore Authority Must Remain Intact

Verify and preserve the existing order and meaning of:

```text
Parse / validate
→ admission and user confirmation
→ preparation / participant staging
→ existing durable mutation protocol
→ runtime installation
→ verification / reported outcome
```

The exact implementation may use different phases. Document the actual protocol rather than forcing it into an invented transaction model.

Preserve:

- Supported-version validation.
- Required participant completeness.
- Exact source identity and revision.
- Existing inclusion/exclusion of independent surfaces.
- Restore markers and recovery gates.
- Protection against unsafe concurrent writes.
- Existing distinction between rejection, successful completion, uncertain completion, and recovery required.

Do not merge source and destination authority unless the existing restore contract explicitly does so.

Do not rebuild imported Goals, requests, acceptances, or observations by calling their ordinary creation commands. Restored identity is not newly authored identity.

No restore action may implicitly accept proposals, realize work, publish a schedule, report an outcome, infer Progress, or reinterpret archived state as newer lifecycle behavior.

---

## 8. Round-Trip and Identity Evidence

Use distinguishable disposable source A and destination B.

Generate A through existing valid fixtures or canonical commands, export it through the supported complete-backup path, and import that actual V14 payload into B.

The principal fixture must be nontrivial and exercise the repaired participant path.

Include representative evidence for:

- Authored setup and a non-midnight User Day boundary.
- Goal identity, revision, metadata, and exact links.
- Requested Time with preferred session minutes and an absent maximum.
- Priority and exact resource association.
- Multiple distinct accepted iterations for one Goal.
- Realized work and immutable publication.
- Reported Actual.
- Independent measurement/Progress evidence.

Reuse existing comprehensive V14 fixtures for additional restore participants, including Structure and Sleep where supported. Do not build unrelated authoring UI merely to populate tests.

Compare source versus restored canonical values and re-exported authority.

Preserve exact relevant IDs, references, revisions, frozen historical values, optional absence, and role distinctions.

Document any legitimate restore bookkeeping or export metadata differences. Do not use a blanket normalization that could hide changed authority.

Verify the existing treatment of destination-only records and excluded independent surfaces; do not invent a new overwrite policy.

Reload the destination browser and verify the restored state again. A success banner or pre-reload in-memory view is insufficient.

---

## 9. Failure, Cancellation, and Retry

Test the relevant existing outcomes at their actual phases.

At minimum cover:

- User cancellation before the existing mutation boundary.
- Malformed or invalid complete-backup input.
- An unsupported/incompatible input handled under the existing contract.
- A preparation/participant failure relevant to the repaired path.
- A persistence or commit failure.
- Any existing post-mutation uncertainty or recovery-required branch affected by the repair.

Before-mutation rejection must not change protected runtime or durable authority.

For failures after mutation may have begun, do not promise that nothing changed unless the protocol and evidence establish that conclusion.

Preserve existing recovery-required protection. Do not unlock normal authoring merely to display an ordinary error.

Retry must follow the existing restore/persistence contract. Do not add a new operation ledger or claim universal restore idempotency without evidence.

Keep successful, rejected, pending, uncertain, and recovery-required outcomes distinct in both tests and user feedback.

Use existing injection seams for controlled failure tests. Label injected failures separately from the native production-browser reproduction.

---

## 10. Goals and Inspector Context Boundaries

Preserve the protections established by Tasks 9.24 and 9.25.

Exercise import while the destination has:

- A selected Goal/request.
- Unsaved Goal and Requested Time drafts.
- An applied inspector period and disclosures.
- A pending or retained Goal evidence result.

Verify:

- Cancellation or rejected import preserves the appropriate existing context.
- Successful complete restore invalidates context tied to replaced authority.
- Recovery-required outcomes apply the existing protected boundary.
- Late reads cannot resurrect the pre-restore Goal/period view.
- Late authoring continuations cannot replay an old draft into restored authority.
- Fresh inspection reads the actual restored owners.
- Profile loading remains governed by its existing independent boundary.

Do not silently save drafts before import, rebase them onto restored records, or persist them as a new draft authority.

Preserve Summary and Daily Planner navigation and the existing Goal → Day → Save outcome → Back regression.

---

## 11. Permanent Automated Regressions

Add focused permanent tests that establish:

1. The precise cloning/invocation failure and its correction at the appropriate implementation boundary.
2. Valid complete V14 import through the repaired restore path.
3. Source/restored identity, revision, optional-field, resource, and historical fidelity.
4. Distinct accepted iterations and independent Actual/Progress after restore.
5. Cancellation and rejected-input nonmutation.
6. Relevant participant, persistence, and recovery-required failure behavior.
7. Safe retry under the existing contract.
8. Successful-restore context invalidation and rejected-import draft preservation.
9. Late query/command protections across the actual restore boundary.
10. Reload/reinitialization reading the restored durable state.

A deliberately receiver-sensitive test double may supplement a regression where appropriate; it does not replace native production-browser proof.

Do not weaken existing restore assertions or rewrite fixtures to avoid the failing participant.

Run existing supported-version compatibility, full-clear, protected-state, Goal editing, G2/G1, realization, publication, execution, and Progress suites.

Do not claim browser certification of every historical backup version from passing automated compatibility tests.

---

## 12. Production Browser and Mobile Acceptance Gate

Use the production build and disposable state at approximately:

```text
320px
390px
768px
1280px
```

At each width, exercise the ordinary backup/import workflow:

- Reach the supporting utility.
- Select the valid V14 file through the existing file-input path.
- Review and explicitly confirm where the current contract requires it.
- Complete the actual import.
- Inspect restored Goal and scheduled-work evidence.
- Reach and understand a rejected-input or cancellation outcome.

Perform a successful reload-and-reinspection round trip in at least one native production-browser run, alongside permanent durable-reinitialization coverage.

Require:

- No unintended document-level horizontal overflow.
- Practical approximately 44 CSS px primary hit targets.
- No required hover, double-click, or right-click.
- Reachable confirmation and error controls.
- Visible keyboard focus and meaningful focus restoration.
- Associated validation/error feedback.
- Semantic controls and non-color-only states.
- Usable reduced-height layout and reflow.
- Equivalent underlying restore semantics at every width.

Do not hide overflow or bypass confirmations to pass the gate.

Retain source/destination identity comparisons and actual outcome observations, not only screenshots of a success message.

Distinguish native browser execution, test injection, DOM measurements, source inspection, and synthetic fixtures.

Do not claim physical-device, soft-keyboard, screen-reader, or browser-native-zoom certification unless performed.

---

## 13. Validation and Bundle Gate

Task 9.25 reported this historical baseline:

| Measure | Reported value |
|---|---:|
| Test files / tests | 157 / 1,579 |
| Initial raw JavaScript | 622,594 bytes |
| Initial gzip JavaScript | 163,125 bytes |
| Largest lazy chunk | 62,652 bytes |
| Total JavaScript | 1,226,104 bytes |
| Initial-gzip hard-limit headroom | 6,875 bytes |

Measure actual current before/after values.

Preserve hard limits:

- Initial gzip: 170,000 bytes.
- Initial raw: 685,000 bytes.
- Largest lazy chunk: 100,000 bytes.
- All remaining repository hard gates.

Preserve existing lazy boundaries. Do not raise thresholds or add dependencies.

Report initial-gzip and total-JavaScript advisories honestly.

Run repository equivalents of:

```text
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Run focused tests during implementation and the full suite before completion.

Format only task-created/touched files as necessary. Record command directories, counts, intermediate failures, resolutions, and fresh bundle measurements.

---

## 14. Explicit Non-Goals

Do not implement:

- Goal Structure UI or Milestone authoring.
- New Goal lifecycle types, policies, or transitions.
- Recurring Requested Time, release, replacement, or Found Time.
- A new backup format, schema, migration, or recovery owner.
- Protected-history repair or destructive abandonment.
- Automatic normalization of unsupported records.
- Data export/import semantics beyond the existing contract.
- General application cleanup or cloning refactoring.
- New remote backup, cloud sync, or repository automation.
- Retirement/removal of compatibility readers or tests.

This task repairs one demonstrated production path and verifies its relevant existing guarantees. It does not certify every possible browser, historical dataset, or recovery scenario.

---

## 15. Stop Conditions

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when the required validation cannot distinguish a consequential restore outcome using the existing owner evidence.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when proceeding requires new authority, transaction semantics, schema/version changes, unsupported-data conversion, weakened protection, or a consequential dependency.

Document the exact missing contract and affected requirement.

If production reproduction or required browser verification is unavailable, preserve useful findings but do not claim the browser defect fixed based solely on unit tests.

If the defect has already been corrected by intervening work, identify that change and its evidence explicitly. Do not overwrite it or manufacture a new implementation claim.

No mandatory unresolved requirement may be hidden beneath a COMPLETE label.

---

## 16. RESULT and Retained Evidence

Write a separate RESULT:

`docs/implementation/phase-9/TASK_9.26_PRODUCTION_V14_BACKUP_IMPORT_REPAIR_AND_BROWSER_RESTORE_VERIFICATION_V1_RESULT.md`

The execution input and previous RESULTs remain immutable.

Every additional report, screenshot, measurement, fixture export, or QA artifact must include `RESULT` in its filename. Application/test source files retain normal repository naming.

The RESULT must contain:

1. Bounded executive determination.
2. Governing inputs and task-relative baseline.
3. Exact reproduction, root cause, and affected restore phase.
4. Narrow implementation correction and related call-site accounting.
5. Existing restore protocol and unchanged authority boundaries.
6. Source/destination fidelity and reload comparisons.
7. Cancellation, rejection, persistence, uncertainty, and retry findings.
8. Goal/draft/inspector context behavior.
9. Permanent tests and native browser evidence.
10. Mobile/accessibility observations and limitations.
11. Validation and before/after bundle measurements.
12. Every task-created/modified file and its purpose.
13. Explicit schema, format, dependency, history, and forensic-state effects.
14. Remaining limitations and final completion statement.

Retain a compact evidence set under the established Phase 9 evidence location, preferably `evidence/task-9.26/`.

Include:

- Pre-fix failure/stack evidence.
- Reproduction commands and fixture provenance.
- Successful native production-import and reload observations.
- Machine-readable authoritative comparisons and viewport measurements.
- Representative narrow-phone confirmation/result/error screenshots.
- Material validation and bundle logs.

Do not rely exclusively on `/tmp` links for evidence designated as retained. Distinguish retained local repository files from committed or remotely backed-up artifacts.

---

## 17. Completion Criteria

This task is COMPLETE only when:

- The reported production failure is reproduced or its intervening correction is conclusively accounted for.
- The actual causative implementation defect is corrected without new semantics.
- A valid complete V14 file imports through the real production application path.
- Restored identity, revisions, optional fields, resources, and historical evidence match the source contract.
- Reload preserves the restored durable state.
- Rejection, cancellation, persistence, and recovery outcomes remain truthful and safe.
- Goal/draft/inspector boundary protections remain intact.
- Permanent regressions and existing compatibility assertions pass.
- The required production-browser and Mobile Acceptance Gate pass.
- Repository and bundle hard gates pass.
- Task-relative changes and retained evidence are documented.
- User data, forensic state, historical artifacts, and unrelated work remain protected.
- No mandatory requirement remains blocked.

A passing fake-IndexedDB restore test alone is not production-browser import acceptance.

A successful import alone is not proof that every recovery or historical-format path works.

Completion does not reopen or redefine Task 9.25.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.26 — Production V14 Backup Import Repair & Browser Restore Verification V1 is COMPLETE.**

or:

**Task 9.26 — Production V14 Backup Import Repair & Browser Restore Verification V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when the existing production V14 import path restores valid supported data through its real application workflow, preserves canonical identity and history across reload, and reports failures truthfully—without changing restore authority, weakening compatibility, or risking retained user evidence.**