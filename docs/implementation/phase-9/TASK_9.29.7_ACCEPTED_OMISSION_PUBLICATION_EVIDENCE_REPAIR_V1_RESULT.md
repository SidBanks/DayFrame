# Task 9.29.7 — Accepted Omission Publication Evidence Repair V1 — RESULT

**Determination: COMPLETE — bounded canonical omission evidence repair.**

The canonical Skip Try → explicit Accept → saved-state regeneration → qualified Review → explicit Build path now publishes exactly one omitted planning occurrence. The occurrence remains absent from placement candidates, scheduled blocks and unplaced candidates. It has no scheduled interval and creates no Actual or Progress. The retained Review UI uses the repaired existing canonical path without local evidence reconstruction.

This is the bounded 9.29.7 repair, not a fourth parent workflow continuation. All four blocked parent executions remain historical records. Broader Task 9.29 convergence remains pending separate authorization and acceptance.

## Baseline, authority and preservation

The supplied attachment matched the separately saved [task input](TASK_9.29.7_ACCEPTED_OMISSION_PUBLICATION_EVIDENCE_REPAIR_V1.md), including sections 1–18 and the completion statements. No conflicting executed 9.29.7 existed. HEAD was `c0cc9ae2ae68af626e64747539a417f10df1cf3a`; the executable baseline included **307 dirty status entries**, not HEAD alone. No applicable repository/ancestor AGENTS.md was found.

The [evidence directory](evidence/task-9.29.7/) retains status, HEAD, hashes and the baseline source archive. Its 1,081-file inventory excludes generated/dependency/VCS files and earlier evidence, whose hashes are captured separately. This differs intentionally from Continuation 3's earlier 1,801-file inventory. Baseline validation passed 178 files / 1,831 tests. No reset, stash, commit, push, dependency installation or preserved Dogfood browser access occurred. Retained files are local evidence, not a remote backup.

[Preservation audit](evidence/task-9.29.7/preservation-audit-RESULT.json): all 677 pre-existing governing/document hashes, 825 prior evidence files, and 93 Continuation 3 evidence files match. Only five baseline application files changed; all retained Continuation 3 UI/test files remain byte-identical. Three new permanent test/fixture files were added. The prior unavailable first Move-timeout full log remains unavailable; neither this report nor reconstructed notes substitutes for that original log.

Governing inputs used: actual Continuation 3 input/RESULT, its gap report and canonical reproduction/configuration/observation, preservation and command/regression maps; Task 3.4 historical-target RESULT; current occurrence, replay, acceptance/removal, source-qualification and materialization implementations; accepted Review source-qualification, publication-lifecycle, acceptance-to-realization ADRs and 9.29.6 RESULT/tests; HistoricalPlan and ExecutionRecord ADRs; first-class Sleep, Goal-link and Activity/progress contracts; complete-backup and durable compatibility/retirement contracts. Their pinned versions are in `governing-source-hashes-RESULT.json`. Historical Task 3.4 is evidence of the existing omission snapshot meaning, not authority to extend reporting permission.

## Reproduced defect and contract reconciliation

[CONTRACT_RECONCILIATION_RESULT.md](evidence/task-9.29.7/CONTRACT_RECONCILIATION_RESULT.md) was recorded before edits. It maps required fields to their actual producers and consumers and records two explicit implementation reconciliations: semantic OccurrenceIdentity lacks incarnation tokens, so the already-validated durable target must also travel; existing PlanDecision publication timing is `{kind: "timed"}`, while the omitted plan itself has no interval.

The separately copied baseline canonical diagnostic reproduced the defect: expansion produced the exact candidate, accepted replay suppressed it, and the historical consumer searched the post-suppression `blockCandidates`. It rejected `planDecision:insufficientHistoricalContext`; public publication returned `materializationFailure`, with **zero attempted and zero physical history mutations**. A resolving durable reference alone could not supply the lost current-generation context.

The separate positive diagnostic and observation (`repaired-repro-…`, `repaired-observation-attempt-1-RESULT.json`) now prove materialized and published results with one physical history transaction. The original negative diagnostic and all previous evidence remain unchanged in their original locations.

## Final producer/consumer path

| Stage / actual file | Required branch and resulting evidence |
|---|---|
| `code/src/core/blocks/generateBlockCandidates.ts` | Existing canonical expansion produces exact semantic identity, canonical owner day, title and category. Unchanged. |
| `code/src/core/decisions/createPlanDecisionAcceptanceCandidate.ts` and `code/src/state/planDecisionSurface.ts` | Existing supported Skip mapper and explicit acceptance validate/persist the decision with exact durable target. Removal/replacement rules unchanged. |
| `code/src/core/decisions/replayPlanDecisions.ts` | After applicability resolves and the exact target candidate exists, `omitOccurrence` copies `decisionId`, durable `target`, `occurrenceIdentity`, `userDayDate`, `title`, `category` into readonly ephemeral `OmittedOccurrenceContext`. Existing suppression and applied replay result remain unchanged. |
| `code/src/core/engine/generatePlanningSchedule.ts` | Optional readonly `omissionEvidence` carries contexts and this generation's `generatedAt`/planning-window instants. Healthy no-omission output omits the property. No candidate or interval is reintroduced. |
| `code/src/state/dayFrameStore.ts::clonePreviewResult` | Explicitly clones the optional envelope into detached state/Review snapshots. No saved Preview or serializer changes. |
| `code/src/core/execution/historicalExecutionTarget.ts::fromDecision` | Only applied omission uses the new context. Existing fresh/non-Try checks run first. Validate template family, current lifetime resolution, exact generation/window association, exactly one decision match, retained-target equality, daily owner-day or canonical weekly owner identity, and a current constructed durable reference equal to replay target. Reuse existing snapshot validation and omission state. |
| `code/src/core/historicalPlan/materializePlanPublication.ts` | Same target consumer for both Review dry materialization and actual Build. Resolve omissions before owner-day range filtering; missing evidence fails before exclusion. A valid neighbor omission outside the publication range is excluded under existing scope semantics. |
| `code/src/core/planning/deriveFoundationalSchedule.ts`, `code/src/state/reviewSourceQualification.ts`, `planningScopeQuery.ts`, `schedulePublication.ts` | Existing Sleep-aware canonical generation, captured source qualification, dry eligibility, tagged runtime fingerprints and final physical-admission checks consume the repaired generation. These files/policies are unchanged. |

The context is a nonpersistent current-generation value, not a new owner or historical representation. The consumer retains the pre-existing original-candidate branch for supported old current-context callers. A missing context in actual suppressed generation still refuses. No title is reconstructed from a bare reference; no guessed geometry, zero-length interval, completion, attendance or outcome is introduced.

Replay order and exact-target decision precedence are unchanged. Context clones retain source and recurrence lifetimes; removing/recreating a same-ID source cannot retarget the decision. Saved decisions and authored state still control freshness through existing observations. No custom UI fingerprint, weakened validator, legacy publication bypass, new snapshot version/schema, migration, dependency, global lock, recovery permission, or compatibility retirement was introduced.

## Permanent regression matrix

`code/src/state/omissionPublication.test.ts` adds 22 tests through actual store/generation/materialization/durable owners. `omissionPublicationTestFixtures.ts` derives and accepts a canonical three-role Proposal, authors the Routine and supporting conflict, and uses the real Skip mapper. `code/src/ui/tests/OmissionPublicationWorkflow.test.tsx` adds the actual retained Review UI flow. The full existing suite is retained.

| Required group | Permanent evidence |
|---:|---|
| 1 | Actual conflict → Skip Try → Accept → regenerate → public publish; matching real UI workflow test. |
| 2 | Healthy no-omission generation and eligible materialization; separate conflict-free wider-window public publication before historical Actual fixture. |
| 3 | Exact single durable target with `plan: {state: "omitted"}`, timed family, no interval; one publication transaction. |
| 4 | Target absent from all scheduling candidate/output collections; multiple unaffected daily occurrences still scheduled; accepted realization/proposal authority exact. |
| 5 | Try has no accepted decision/history; Try publication rejects; discard regenerates unresolved original conflict with no omission evidence. |
| 6 | Eleven refusal variants: missing, stale, Try, generation, window, decision, lifetime-bearing target, owner day, semantic identity, unsupported family and duplicate context. Zero history writes. |
| 7 | Removed recurrence/source and same-ID recreation refuse `sourceMissing`/`lifetimeMismatch`; fresh generation never applies a stale omission. |
| 8 | Only September 17 omitted; other daily occurrences remain scheduled. |
| 9 | 03:00 boundary and overlapping September 16–18 / 17–19 generations yield identical exact omission target. A September 18 subrange excludes the resolved September 17 neighbor. |
| 10 | Removal invalidates old Review/command, returns the actual unresolved Routine, and preserves earlier history. Existing exact-target duration replacement removes omission evidence, keeps one current decision and changes future generation to 30 minutes. |
| 11 | Existing `replayPlanDecisions`, `historicalExecutionTarget`, `materializePlanPublication` tests retain scheduled/unplaced/blocked and other correction semantics; new replacement/removal controls cover the real repaired path. |
| 12 | Three durable realized roles and first-class Sleep coexist with omission. Exact original realization/Proposal authority retained; native readback audit additionally compares complete facts/lineage and Sleep requirement/geometry. Existing Sleep publication/storage/execution and qualification suites remain. |
| 13 | Read-only canonical materialization preserves complete backup data, invokes no local-storage writes or durable mutation, and creates no history, execution or Progress. State clones are detached. |
| 14 | Public durable owner readback, physical store assertions, exact duplicate no-op, removal preserving earlier omitted snapshot, later publication preserving an earlier scheduled snapshot and its reported Actual/independent Progress. |
| 15 | Held real durable adapter: authored or decision changes reject `sourceChanged`; actual Proposal recording in progress rejects `publicationSourceUnqualified` with `proposal/writeInProgress`. One attempted history mutation, zero physical history transactions. Existing receipt/FIFO/settled-abort/lost-ack suites retained. |
| 16 | Actual V14 import into distinct Goal state, re-export, fresh store reload, absent disposable Preview, explicit restored regeneration, eligible omission and identical-publication no-op. |
| 17 | Existing historical completion consumer excludes actual published omission as `excludedOmitted`, with zero inferred skipped outcomes; earlier user-reported Actual remains exact. Existing Activity/G1/G2, Goal owner/scheduling boundary and Progress suites retained. |
| 18 | Real DayFrameApp test clicks Try and Apply, observes handler regeneration, eligible Review and explicit Build; asserts one acceptance/publication and actual stored omission. No local candidate construction. |

No valid historical refusal assertion, timeout or test selection policy was weakened. New test-construction failures and their exact corrections are disclosed in [VALIDATION_HISTORY_RESULT.md](evidence/task-9.29.7/VALIDATION_HISTORY_RESULT.md).

## Production browser acceptance and direct durable readback

`browser-attempt-2-RESULT.log` ends `NATIVE_9297_PASS`; [checks](evidence/task-9.29.7/browser-attempt-2-RESULT/browser-checks-RESULT.json), [measurements](evidence/task-9.29.7/browser-attempt-2-RESULT/browser-measurements-RESULT.json), screenshots, per-width accepted-generation/qualified-Review/physical-row observations and actual downloaded V14 files are retained. The run used production preview on disposable origins 4980/4981 and a new Chromium profile. No preserved Dogfood origin was opened.

At **320, 390, 768 and 1280 px**, each run opened an actual Routine conflict, tried its exact Skip, discarded, tried again, explicitly accepted, reached fresh non-Try/nonstale saved-state generation through the existing acceptance handler, inspected eligible qualified Review, and clicked ordinary Build. There was no invented extra generation click after corrective acceptance. Direct native IndexedDB and V14 readback establish one exact omission and one history transaction. Navigating to the built day and Back returned focus to the Review Schedule heading. An unsaved unrelated Goal title survived navigation away and return at every width.

Each exported batch has seven entries: Routine omission, work, appointment, first-class Sleep and three accepted/realized roles. Each fixture has one independent Actual and one independent Progress observation. Proposal, realized, Actual and Progress rows are compared exactly before/after correction/publication. [Geometry audit](evidence/task-9.29.7/native-geometry-readback-audit-RESULT.json) confirms complete frozen realized facts and lineage equal their original authority, all three roles remain, the Sleep requirement equals saved authority, and sleep/footprint geometry remains exactly 120 minutes with this fixture's zero-minute buffers. Required nonzero Sleep protection cases remain covered by the unchanged permanent Sleep suites; this task does not certify the parent's unrelated Sleep correction flow.

Visible measured primary controls were **at least 44 px**. Document scroll/client widths matched at 305, 375, 753 and 1265 px (native scrollbar accounts for viewport difference). The 320×420 capture shows reflow, scrolling and a visible two-pixel keyboard focus outline. Feedback is textual, not color-only. No hover, drag, double-click or right-click is required. No clipping workaround or UI layout change was made.

At 390 px, actual Export Complete Backup download → import into a separately seeded distinguishable destination → re-export → page reload → export preserved all included authority. Preview was absent after restore/reload. Explicit Generate rebuilt omission evidence from saved decisions; Build was the existing no-op with zero history transactions. The actual accepted-choice Remove control regenerated without omission evidence while prior history, Actual, Progress and realizations remained exact.

Comparison normalizes only contractually identity-keyed top-level Proposal arrays (`proposals`, `candidates`, `decisions`, `acceptedAllocations`) and realization arrays (`realizations`, `facts`), following the existing V14 restore tests. Every record field, revision, timestamp, optional absence, nested order, reference, lineage and historical snapshot remains exact. No payload fields are stripped to obtain equality.

Browser UI actions, direct readback, supporting canonical seeding and DOM measurements are explicitly separated in the retained driver/history. Keyboard focus was inspected in the screenshot. This is desktop Chromium with emulated viewport sizes, not physical-device, native OS dialog, soft-keyboard, screen-reader or native-zoom certification. Native exceptions recorded: zero.

## Validation and bundle

Final format, lint, typecheck, production build, bundle hard gates and `git diff --check` pass. Every log and material intermediate failure is indexed in the validation history. The final isolated complete suite passed **180 files / 1,854 tests** in **187.00 seconds**, with no reported unhandled errors (`final-tests-attempt-1-RESULT.log`). Build/static/native jobs finished and preview/browser processes stopped before that run.

| Measure | Task baseline | Final | Change |
|---|---:|---:|---:|
| Initial raw JavaScript | 641,793 | 642,319 | +526 |
| Initial gzip JavaScript | 169,064 | 169,162 | +98 |
| Largest lazy chunk | 62,700 | 62,700 | 0 |
| Total JavaScript | 1,330,178 | 1,331,809 | +1,631 |
| Gzip hard-limit headroom | 936 | 838 | −98 |

Hard limits remain 685,000 raw / 170,000 gzip / 100,000 largest lazy bytes. Existing advisory gzip headroom and total-JavaScript architecture-review warnings remain disclosed, not suppressed. Historical/materialization logic stays behind existing lazy boundaries. The task's small increase has no broad restructuring or weakened evidence. No cause is inferred for unrelated earlier executions' differing baseline gzip measurements.

`native-build-hashes-RESULT.json` and `final-build-hashes-RESULT.json` prove the production browser-tested and final builds are byte-identical. The task-relative source patch and final source inventory/archive identify the tested change independently of the dirty Git baseline.

## Changed and created files

Five modified baseline files and purposes are fully listed in the producer/consumer table: replay context capture; generated envelope; detached store cloning; historical target validation/use; resolve-before-range-filter materialization. No UI production file changed. New permanent sources:

- `code/src/state/omissionPublicationTestFixtures.ts`: canonical supporting fixture and optional pending Proposal for admission testing.
- `code/src/state/omissionPublication.test.ts`: 22 store/consumer/history/restore/admission regressions.
- `code/src/ui/tests/OmissionPublicationWorkflow.test.tsx`: real retained Review flow.

New documentation is this RESULT and the pre-edit reconciliation/validation history. All new logs, diagnostics, copied seed/build configuration, browser driver, screenshots, exports, readbacks, inventories, hashes and source archives live under `evidence/task-9.29.7/` and contain `RESULT` in their filenames. `final-file-inventory-RESULT.json` enumerates every created evidence file with purpose category, size and SHA-256; it excludes its own self-hash. Baseline input and all earlier task files remain unchanged.

## Parent resumption and limits

The demonstrated omission-to-publication blocker is repaired within the authorized existing semantics. After review, the parent requires a separately authorized **Continuation 4**, with distinct input/RESULT paths. Preserve all four blocked executions and the retained partial UI. Its broader certainty/lifecycle matrix, exhaustive result-presentation audit, complete contextual return, unrelated Sleep correction, and full workflow/mobile acceptance remain unfinished. The narrow native coverage here does not retroactively mark any earlier execution complete or certify that broader matrix.

**Task 9.29.7 — Accepted Omission Publication Evidence Repair V1 is COMPLETE. The existing canonical omission-to-publication path is repaired; Task 9.29 workflow convergence remains pending separate continuation and acceptance.**
