# Task 9.9 — Pre-Migration Correctness & Authority Convergence V1 RESULT

Date: 2026-09-17. Scope: confirmed correctness and authority-boundary defects in the existing working tree. No product-shell migration, persisted schema change, history repair, commit, or push.

## 1. Executive Summary

Corrected the seven confirmed Task 9.8C defect areas:

- Corrective movement now uses the generator's physical occupancy and free-window calculation, including buffers, neighboring-owner spill, manual/fixed blocks, and all realized roles.
- Unplaced Move acceptance follows durable semantic occurrence identity instead of requiring candidate and scheduled-block IDs to match.
- Successful Preview revision preserves realized work, support, and protected-buffer facts without changing realization authority.
- Explicit overnight custom windows can cross their canonical owner's boundary while retaining that owner.
- Review and publication share deterministic publication blockers. Historical access/protection and canonical materializer eligibility survive into the read model.
- Publication distinguishes known pre-commit failure, complete-but-unverified commit, and uncertain commit. Unverified/uncertain writes protect history and block blind retry.
- Product copy no longer claims history was unchanged when publication may have committed.

An additional effective-boundary replay mismatch was independently reproduced and corrected: an accepted 06:00 placement under a midnight segment override was interpreted using the global noon boundary. The focused regression failed against the pre-task replay implementation and passes with the correction. This is not a causal diagnosis of the original October incidents.

Validation: **128 test files / 1,162 tests pass**, an increase of 52 tests over the 9.8C baseline. Typecheck, lint, repository formatting check, production build, bundle hard-limit checks, and whitespace checks pass. Existing advisory bundle-size warnings remain, as quantified in §17. No browser profile or original dogfood history was opened or modified.

## 2. Baseline Repository State

The task began on the existing working tree based on `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. No `AGENTS.md` was found in the repository or inspected ancestor locations. `code/package.json` supplied the validation commands; project documentation and the current 9.8C RESULT supplied context.

Pre-existing tracked modifications were:

- `code/src/core/blocks/placeBlockCandidates.ts`
- `code/src/state/lazyProposalSurface.ts`
- `code/src/state/proposalSurface.ts`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/GoalSection.tsx`
- `code/src/ui/MonthlyPlannerSurface.tsx`
- `code/src/ui/PlannerSurface.tsx`
- `code/src/ui/PreviewScreen.tsx`
- `code/src/ui/ScheduleReviewPanel.tsx`

Pre-existing untracked implementation/tests were `workRelativeFootprint.test.ts`, `constructivePlanningWorkflow.ts`, `GoalPlanningSection.tsx`, `ScheduledGoalFacts.tsx`, `planningResultCopy.ts`, and `ConstructivePlanningWorkflow.test.tsx`. The dogfood PDF and Task 9.8A/B/C and 9.9 request/result documents were also already present and were preserved.

A per-file SHA-256 inventory, Git status, and copies of baseline code were saved under `/tmp/dayframe-99-baseline-hashes.json`, `/tmp/dayframe-99-baseline-status.txt`, and `/tmp/dayframe-99-baseline/`. Task-only comparison uses that baseline, not just `git diff`, because several affected files already contained 9.8B work. In particular, the pre-existing buffered afterWork fix remains intact.

Task 9.9 builds on the existing changes in `placeBlockCandidates.ts`, `ScheduleReviewPanel.tsx`, and the untracked constructive-workflow test file. Other pre-existing 9.8B implementation files remain byte-identical to the captured baseline. No reset, checkout, clean, or deletion of user artifacts occurred.

## 3. Confirmed Defects Reproduced

The initial added regressions ran before the implementation changes. The three-suite run had **10 expected failures and 18 passes**. Failures covered the Work-overlapping corrective result, each realized occupancy role, successful-revision fact loss, unplaced acceptance, midnight custom Sleep, protected/Try readiness, and post-commit verification classification. The noon custom-window control passed.

The corrective fixture starts with an actual generated unplaced occurrence, not an invented scheduled-block ID. Work is 07:00–15:00, day boundary 03:00, and the activity is eight hours with 30-minute buffers. Before correction, Try returned 03:30–11:30, overlapping Work. After correction it returns 15:30–23:30 when that opening is free, or leaves the occurrence unplaced when later occupancy prevents a fit.

The custom Sleep fixture uses 22:00–08:00, eight hours and 30-minute buffers. On the exact implementation baseline, the midnight branch first rejected the end time because it had not been advanced to the following civil day. The same branch also clipped its end to the owner window. Both normalization and containment had to be corrected; this is a refinement of the audit's branch-level clipping diagnosis, not a claim about the exact 11-item incident.

A separate red run restored only this task's temporary replay edit to its saved baseline while running the new effective-boundary regression. It produced **one expected failure / eight passes**. The task's fixed replay file was then restored. No pre-existing work was overwritten.

## 4. Corrective Gap Search Changes

`core/time/physicalOccupancy.ts` now owns the existing generator calculations `getOccupiedWindowsForRange` and `getOpenWindowsWithinSearchWindow`. They were extracted from `placeBlockCandidates.ts`; corrective movement consumes them rather than retaining a second cursor algorithm.

The calculation clips physical occupancy to the requested search window, orders it temporally, advances beyond blocked intervals even when the preceding gap is too short, and returns free windows. Corrective movement selects the first window large enough for before-buffer + activity + after-buffer. A window after the search end cannot be accepted. If no full footprint fits, the original unresolved/unplaced result remains and the existing no-safe-change feedback is used.

Regression coverage includes a short footprint fitting before Work, the eight-hour footprint fitting after Work, no fit after adding later ownership, scheduled buffers, skipped-block exclusion, and a Work interval whose owner is the preceding user-day. Filtering occupancy by matching owner labels was removed from correction; physical overlap determines relevance.

## 5. Corrective Occupancy Changes

`ApplySuggestedFixInput` accepts read-only realized schedule facts. `reviseSchedulePreview` supplies them. `realizedFactOccupancy` is shared by initial generation, corrective movement, and movement acceptance validation; all three realized roles project to physical protected intervals.

Correction checks:

| Occupancy | Handling / evidence |
|---|---|
| Work | Always blocks physically overlapping corrective footprints; future Work and cross-owner spill regressions |
| Scheduled Commitment | Active scheduled interval plus its before/after buffers blocks correction |
| Manual/fixed scheduled block | Included with the same physical-window calculation; fixed Event/buffer regression |
| Productive realized Goal work | Included; dedicated no-fit regression |
| Realized support activity | Included; dedicated no-fit regression |
| Realized protected buffer | Included as protection; dedicated no-fit regression, no execution behavior added |
| Skipped block | Excluded from occupied time; dedicated regression |

Initial flexible generation also now includes its already-supplied `additionalOccupiedBlocks` in the common occupancy list. Previously manual Events were supplied to the placer but only consulted for hard placement. This matters when an overnight custom window crosses into a manual interval.

One existing test explicitly expected flexible Sleep to overlap an immovable late-call Event and produce Friction. It was narrowly updated to assert the corrected behavior: the Event retains its exact times, eight hours of Sleep still fit, and Sleep does not overlap it. This was not removal of a failing assertion without replacement. Fixed/explicit conflicts and their existing detector tests remain covered by the full suite. No required-Sleep priority policy was introduced.

## 6. Unplaced Move Acceptance Identity Changes

`createPlanDecisionAcceptanceCandidate` resolves the original durable occurrence reference, verifies that it still resolves, and finds the revised occurrence through `durableOccurrenceReferencesEqual`. The generated block ID may differ. Multiple matching revised occurrences are rejected as ambiguous; no matching occurrence is rejected as not applied.

Move acceptance additionally verifies an eligible flexible source, unchanged owner, canonical correction-window bounds, finite positive geometry, exact activity duration, unchanged buffers, minute-representable start time, and non-overlap with Work, other active scheduled blocks and realized facts. It retains unsupported-family and unchanged-Try rejection. Source-incarnation data remains part of the durable reference; its persistence format is unchanged.

The real production-store integration covers:

1. Create a Goal, author resources, evaluate, accept and realize productive/support/buffer facts.
2. Author a flexible occurrence that cannot fit its preferred window and generate it unplaced.
3. Try Move, then discard it by regeneration: no decision is saved and realization authority is unchanged.
4. Try again, explicitly accept, and assert durable PlanDecision persistence.
5. Regenerate and assert the decision applies to the same semantic occurrence.
6. Restart the store, regenerate, and assert the decision still applies and all realized records are unchanged (comparison accounts for IndexedDB record ordering).
7. Remove/recreate the authored source and reject the old target with `targetLifetimeMismatch`.

Negative unit cases cover no applied Try, another occurrence, ambiguous matches and overlapping geometry. Existing source-lifetime, stale-preview UI and replay tests remain passing. The existing production UI still clears/refuses pending acceptance when its Preview becomes stale; no freshness protection was relaxed.

Replay now resolves the effective boundary/week preferences for the accepted target day. The independently reproduced global-noon/segment-midnight case no longer interprets 06:00 as the following civil day. Owner identity and persistence formats remain unchanged.

## 7. Preview Realization Preservation Changes

The successful `reviseSchedulePreview` return now includes a structured clone of the incoming `realizedScheduleFacts`, matching the no-revision clone path. Try operates on derived data; it does not write any realization record.

Unit tests preserve each role during no-fit and successful unrelated revisions. The production-store test verifies actual realized authority before/after Try, discarded Try, accepted decision, regeneration and restart. It also confirms that fresh generation continues sourcing facts from realization authority. Only the supported PlanDecision is newly persisted by acceptance.

Buffers remain protection rather than executable activities. Proposal and Accepted Allocation ownership semantics are unchanged.

## 8. Sleep Cross-Boundary Placement Changes

The custom-window branch recognizes an explicitly overnight clock window when end time is earlier than start time. If its resolved end is not yet physically after its start, it advances to the next local civil date. Such an explicit overnight end is not clamped to the canonical owner's end. Non-overnight custom behavior retains its existing bounds.

Ownership is not recalculated from the resulting start/end. Candidate recurrence and identity remain canonical-user-day based; the continuous physical interval can cross midnight or the owner boundary. Occupancy and complete buffers still constrain the opening.

| Regression | Result |
|---|---|
| Midnight boundary, custom 22:00–08:00, 8h + 30m/30m | 22:30–06:30 continuous placement; stable owner |
| Noon boundary, same custom window | Existing valid 22:30–06:30 placement preserved |
| BeforeWork Sleep, midnight/noon | Existing continuous eight-hour, non-overlapping behavior preserved |
| Custom overnight Sleep blocked by overnight Work | Remains unplaced; no Work overlap |
| Manual-segment noon→midnight boundary change | One occurrence per expected owner, correct physical overnight interval |
| Neighboring days / display grouping identity | Unique occurrence identities and stable owner labels; no duplicate recurrence |

The change does not alter Goal resource-footprint same-user-day V1 constraints, Work generation semantics, or Sleep requiredness/priority authority. Full first-class Sleep remains deferred.

## 9. Publication Readiness Changes

`state/publicationEligibility.ts::publicationBlockers` is now the shared deterministic owner consumed by `deriveScheduleReviewReadiness` and `publishScheduleRangeV1`. It covers planning coverage, Preview existence/freshness/range/revision, Friction, unrealized accepted claims, historical availability/protection and materializer eligibility. The command still validates its explicit publication range and expected source fingerprint at invocation.

`PlanningReviewReadModelV1` carries separate runtime fields for:

- Preview revision: generated or Try;
- historical availability: available, protected with reason, or unavailable with reason;
- publication materialization: eligible or blocked with the canonical materializer status;
- historical coverage: complete, partial, none or unknown, retained independently.

The query dry-runs the existing canonical materializer using deterministic timestamp/ID providers and no persistence. It does not duplicate materializer rules or allocate durable authority. The actual publication command still materializes and validates at execution time.

Protected history blocks publication readiness and disables the button. Unavailable/unverified history also blocks it. A healthy store with no prior publication remains eligible: `coverage: none` is not treated as protection or unknown access. A Try-revised Preview cannot display publication readiness when the canonical materializer prohibits it. Pending constructive Proposals remain non-blocking; unresolved accepted liabilities remain blocking.

Readiness is not a guarantee against a later storage failure or source change. It now reflects known deterministic blockers before the command attempts persistence.

## 10. Publication Failure / Commit-Certainty Changes

`historicalPlanSurface::persistBatch` tracks write knowledge around the existing atomic mutation. It does not change the batch/day transaction or record format.

| Stage / condition | Result / knowledge | Product behavior |
|---|---|---|
| Invalid range, stale/missing Preview, unresolved conflict/claim, changed source | Typed rejection before persistence | Existing blocker explanation; no persistence call |
| Known protected history | `historicalPlanProtected` / surface `publicationBlockedProtected` | Blocks publication; no overwrite |
| Materializer rejects current Preview | `materializationFailure` or explicit Try blocker | No write; refresh/review explanation |
| Storage reports atomic transaction failure | `writeFailedBeforeCommit` | May truthfully say no new plan was saved |
| Mutation reports success; metadata/indexed verification fails or metadata is absent | `verificationFailedAfterCommit` | Says written but unverified; history protected |
| Mutation throws without a terminal success/abort result | `commitStateUncertain` | Says history may have been saved; history protected |
| Complete commit and successful validation | Existing durable success | Published truth readable |
| Exact already-recorded publication | Existing `identicalNoOp` / `alreadyPublished` | No duplicate write |
| Unexpected UI command exception | Conservative unconfirmed-result copy | Never promises unchanged history or urges blind retry |

Known transaction failure relies on the existing storage adapter's terminal failure/abort contract. An exception while awaiting that transaction is deliberately not treated as proven abort. No blanket “history unchanged” claim remains in the Review failure path.

Fault-injection tests use a fresh fake IndexedDB store and inject indexed-read failure, metadata-read failure, missing verification metadata, and a thrown response after an actual complete commit. They assert protection, retained committed records readable through an independent healthy reader, one write only, blocked subsequent publication, and no automatic pending retry.

## 11. Historical Protection Preservation

Post-commit/uncertain failures enter the existing `protect()` path, which captures physical evidence for the existing read-only export/recheck commands. Evidence-capture failure is contained; it does not clear protection or produce an unhandled rejection. A failed retry cannot replace a newly protected state with ordinary failed/pending state.

No automatic abandonment, fallback to an older historical batch, clear, migration, reconstruction or restore was added. The original browser/profile state was never opened. Tests use only isolated fake IndexedDB and test localStorage.

Today and Summary consumers were not changed. Their existing protection behavior and refusal to substitute generated Preview remain covered by the full suite. The independent healthy reader in the fault-injection test demonstrates complete committed evidence; it is not a user recovery workflow and is not advice to bypass protection.

## 12. BeforeWork / AfterWork Regression Coverage

`preMigrationCorrectness.test.ts` adds a matrix of Day (09:00–17:00), Evening (14:00–22:00), and Night (21:45–06:15) Work at midnight and noon boundaries, for both beforeWork and afterWork.

Each case asserts the actual relevant Work anchor, full 30m-before + 60m-activity + 30m-after footprint, no overlap with any visible Work, and stable canonical owner. Each also introduces accepted protected occupancy that removes all valid openings and checks unplaced rather than invalid geometry. The pre-existing seven `workRelativeFootprint` tests retain buffered overnight and visible-range-clipping coverage.

**Current invariant is covered.** The original beforeWork overlap and approximately 18 Night Shift afterWork incidents are not declared explained or fixed. Their exact authored configurations/builds remain unavailable.

## 13. Correctness Matrix

| Defect | Reproduced Before Change? | Root Cause | Semantic Owner Changed | Regression Added | Result |
|---|---|---|---|---|---|
| Corrective gap crossing Work | Yes, red 03:30–11:30 result | Cursor skipped future blocking interval after too-small gap | Shared physical occupancy/free windows + corrective consumer | Before/after/no-gap and spill cases | Pass |
| Corrective occupancy ignoring realized facts | Yes, all three role cases red | Facts absent from corrective input/occupancy | Shared realized projection + revision/executor wiring | Productive/support/buffer no-fit cases | Pass |
| Unplaced move acceptance identity | Yes | Candidate ID incorrectly used to look up scheduled result | Durable occurrence acceptance mapping | Semantic-ID acceptance and real-store restart/replay | Pass |
| Successful revision losing realized facts | Yes | Successful return omitted facts | `reviseSchedulePreview` | Successful unrelated Try retains all roles | Pass |
| Custom Sleep window clipping at boundary | Yes, midnight failed; noon control passed | Overnight end not advanced at midnight; owner-end containment | Custom physical window in `placeBlockCandidates` | Midnight/noon/transition/blocked/unique-owner cases | Pass |
| Readiness ignoring historical protection | Yes | Coverage erased protected reason; independent readiness checks | Planning read model + shared publication eligibility | Protected UI disables command; query/command regressions | Pass |
| Publication post-commit uncertainty messaging/result | Yes | Verification failure collapsed into no-change failure | Existing historical persistence result + command/UI projection | Four fault modes, preserved records, blocked retry, truthful copy | Pass |
| Effective-boundary decision replay | Yes, separate red run | Replay used global boundary instead of segment preference | Existing replay preference lookup | Global noon / segment midnight 06:00 case | Pass; original October cause unresolved |

## 14. Invariant Matrix

| Invariant | Before Task | After Task | Evidence |
|---|---|---|---|
| Corrective move never overlaps locked Work | Violated | Preserved for corrected path | Physical gap/Work/spill/no-fit regressions |
| Corrective move respects realized Goal work | Incomplete | Preserved | Productive fact no-fit case |
| Corrective move respects support activity | Incomplete | Preserved | Support fact no-fit case |
| Corrective move respects protected buffer | Incomplete | Preserved; buffer still non-executable | Buffer no-fit and actual realized-role workflow |
| Supported unplaced Try can be durably accepted | Violated | Preserved | Semantic mapper and store restart/replay |
| Preview revision preserves realized facts | Violated | Preserved | Successful/no-change revision + authority equality |
| Overnight custom Sleep may cross owner boundary | Violated | Preserved for explicit overnight windows | Midnight/noon/variable-boundary cases |
| Canonical owner remains deterministic | Preserved | Preserved | Owner/unique-identity assertions, canonical suites |
| Protected history blocks readiness | Violated | Preserved | Query, shared blockers, disabled UI button |
| Failed publication does not overstate write certainty | Violated | Preserved | Typed transaction/verification outcomes and UI tests |
| Atomic historical writes remain intact | Preserved | Preserved | Existing no-partial-write tests; complete-commit fault injections |
| Preview never substitutes for Published Plan | Preserved | Preserved | Unchanged Today/Summary queries; full existing suites |
| Source incarnation / stale derived acceptance protection | Preserved | Preserved | Lifetime-mismatch rejection, mapper negatives, replay/UI guards |
| Proposal owns no time; Accepted Allocation requires Realization | Preserved | Preserved | Unchanged authority modules and constructive suites |
| Try/Accept cannot mutate realization storage | Preserved authority, broken derived presentation | Preserved authority and presentation | Actual three-role authority equality before/after/discard/restart |
| Goal footprint V1 crossing restrictions | Preserved | Preserved | Unchanged footprint module and full footprint suite |

## 15. Scope-Protection Matrix

| Area | Expected | Actual |
|---|---|---|
| Planner information architecture | Unchanged | Unchanged |
| Summary information architecture | Unchanged | Unchanged |
| Today destination structure | Unchanged | Unchanged |
| Goal constructive planning architecture | Unchanged | Unchanged; existing real-store workflow reused in tests |
| Goal Structure authoring | Unchanged | Unchanged |
| Demand / Capacity / Proposal semantics | Unchanged | Unchanged |
| Accepted Allocation semantics | Unchanged | Unchanged |
| Realization authority | Unchanged | No production realization-store/module edit; derived facts preserved |
| Found Time | Unchanged | Not implemented |
| Recurring Goal Demand | Unchanged | Not implemented |
| Full first-class Sleep authority | Deferred | Deferred; overnight geometry only |
| HistoricalPlan recovery UX | Deferred | Deferred; typed diagnostics and protection only |
| Persistence schemas | Unchanged | No persisted version/store/index/format changes |
| Backup schemas | Unchanged | No changes |
| Review presentation | Minimal truth correction permitted | Blocker/status/failure copy only; no layout/navigation redesign |
| Manual Event occupancy | Applicable fixed ownership respected | Existing supplied occupancy now participates in flexible generation; exact Event times preserved |
| Effective-boundary replay | Preserve accepted-time semantics | Independently reproduced mismatch corrected; no new decision format |

The new read-model and command-result variants are runtime contracts, not persisted schema migrations.

## 16. Tests Added / Updated

| File (under `code/src/`) | Change |
|---|---|
| `core/engine/tests/preMigrationCorrectness.test.ts` | New 31-case corrective/identity/realization/Sleep/Work-relative matrix |
| `core/decisions/replayPlanDecisions.test.ts` | One effective-segment-boundary replay regression |
| `core/engine/tests/generateSchedulePreview.test.ts` | One existing manual Event/flexible Sleep expectation strengthened to exact fixed times and non-overlap |
| `state/historicalPlanSurface.test.ts` | Four post-commit/uncertain fault modes, evidence export/recheck and blocked retry; existing transaction-failure expectation updated to precise result |
| `state/planningScopeQuery.test.ts` | Four historical access/materializer cases; existing expected Preview projection includes revision |
| `state/schedulePublication.test.ts` | Four known-blocker/no-persistence cases; healthy fixture states made explicit |
| `ui/tests/scheduleReviewReadiness.test.ts` | Two protected/Try readiness regressions; healthy fixture states made explicit |
| `ui/tests/ScheduleReviewPanel.test.tsx` | Protected disabled-button case and four commit-certainty/exception copy cases |
| `ui/tests/ConstructivePlanningWorkflow.test.tsx` | One real-store three-role Try/discard/accept/restart/stale-lifetime integration test |

Net increase: **52 tests and one test file**. Existing candidate, placement, Friction, replay, materializer, historical authority, Today, execution, Progress, footprint, durability, restore and backup suites all remain passing.

## 17. Validation Performed

Commands ran in `code/` unless noted. Red runs intentionally failed before correction; they are regression evidence, not baseline application failures. Logs were retained in `/tmp/dayframe-99-*.log` during this task.

| Command | Exit / result |
|---|---|
| Root `git status --short`, `git rev-parse HEAD`, baseline SHA-256/copy inventory | Captured existing dirty state without Git mutations |
| `npm test -- src/core/engine/tests/preMigrationCorrectness.test.ts src/ui/tests/scheduleReviewReadiness.test.ts src/state/historicalPlanSurface.test.ts` before fixes | Exit 1 expected: 3 files, 10 failing / 18 passing tests |
| `npm test -- src/core/decisions/replayPlanDecisions.test.ts` against saved baseline replay | Exit 1 expected: 1 failing / 8 passing tests |
| Focused geometry/acceptance test run | Exit 0 after correction |
| Nine-suite targeted run (geometry, fixes, revision, mapper, planning scope, publication, history, readiness, UI) | Exit 0: 9 files / 66 tests |
| Expanded targeted run: `npm test -- src/core/engine/tests/preMigrationCorrectness.test.ts src/core/decisions src/state/schedulePublication.test.ts src/state/historicalPlanSurface.test.ts src/state/planningScopeQuery.test.ts src/ui/tests/ScheduleReviewPanel.test.tsx src/ui/tests/ConstructivePlanningWorkflow.test.tsx` | Exit 0: 10 files / 116 tests at that stage |
| `npm run typecheck` | Final exit 0 |
| `npm run lint` | Final exit 0 |
| `./node_modules/.bin/prettier --write <Task-9.9-changed-code-files>` | Exit 0; only changed code files formatted, no repository-wide write |
| `./node_modules/.bin/prettier --check .` | Final exit 0: all matched files use repository style |
| `npm test` | Final exit 0: **128 files / 1,162 tests**, **40.66s** |
| `npm run build` | Exit 0: TypeScript + Vite production build; Vite reported 215ms |
| `npm run check:bundle` | Exit 0; advisory headroom/total-size warnings, detailed below |
| Isolated saved-baseline `./node_modules/.bin/vite build` and `node scripts/check-bundle.mjs` in `/tmp/dayframe-99-baseline/code` | Both exit 0; establishes the same advisory warnings existed before Task 9.9 |
| Root `git diff --check` | Exit 0 |
| Task-only diff / baseline hash comparison | Reviewed changed paths separately from pre-existing 9.8B changes |

Intermediate failures were resolved without weakening broad assertions: initial new test fixtures retained custom-window fields after switching to beforeWork/afterWork, and a restart assertion initially compared unordered IndexedDB facts as an ordered array. Those fixtures were corrected. The first full-suite run exposed the old manual-Event-overlap expectation described in §5. A later full-suite run executed concurrently with lint/typecheck/format checking hit two existing constructive UI timing limits; the canonical full suite passed when rerun alone, without increasing timeouts or relaxing UI assertions. Formatting initially reported the task's edited files; the final full check passes.

The Vite build itself had no reported warnings. Its main application asset was approximately 462.13 kB (106.66 kB gzip). The separate bundle-policy command passed hard limits but emitted advisory warnings. A build of the saved baseline in `/tmp` confirmed all three warning categories already existed:

| Bundle metric (bytes) | Saved baseline | Task 9.9 | Change / policy |
|---|---|---|---|
| Initial resources | 659,773 | 661,880 | +2,107; warning 650,000, hard limit 685,000 |
| Initial gzip | 168,324 | 168,935 | +611; warning 161,500, hard limit 170,000 |
| Largest lazy chunk | 53,194 | 53,194 | Unchanged; below 100,000 hard limit |
| Total resources | 999,740 | 1,004,876 | +5,136; existing advisory architecture-review threshold 825,000 |

Initial gzip has 1,065 bytes of hard-limit headroom. This is a material follow-up constraint for future shell work, not an unreported clean bill of bundle size. No unrelated bundle restructuring was attempted. The temporary baseline used the installed dependencies through a `/tmp` symlink; it did not alter repository source. Final production build output remains under the existing ignored `code/dist` location. No dependency installation, network access, original-profile operation, commit, or push occurred.

## 18. Files Changed

Task-only changes, relative to the captured working-tree baseline:

| Area | Files |
|---|---|
| Physical occupancy / placement | `core/time/physicalOccupancy.ts` (new), `core/blocks/placeBlockCandidates.ts`, `core/friction/applySuggestedFix.ts`, `core/friction/types.ts` |
| Preview / identity / replay | `core/engine/generateSchedulePreview.ts`, `core/engine/reviseSchedulePreview.ts`, `core/decisions/createPlanDecisionAcceptanceCandidate.ts`, `core/decisions/replayPlanDecisions.ts` |
| Publication / historical state | `state/publicationEligibility.ts` (new), `state/planningScopeQuery.ts`, `state/schedulePublication.ts`, `state/historicalPlanSurface.ts`, `state/types.ts` |
| Minimal Review projection/copy | `ui/scheduleReviewReadiness.ts`, `ui/plannerReviewPresentation.ts`, `ui/ScheduleReviewPanel.tsx` |
| Tests | The nine files listed in §16, including one new test file |
| Durable result | This document in `docs/implementation/phase-9/` |

All code paths in this section are beneath `code/src/`. Final SHA-256 comparison against 863 baseline files found no unexpected changed paths or deleted files. Total: 25 code/test files plus this RESULT. No package/lockfile, storage schema, backup schema, Goal/Proposal/realization authority implementation, navigation, or original task/audit document changed as part of Task 9.9.

## 19. Deferred / Unresolved Findings

The following remain unresolved or explicitly deferred; this task does not claim to close them by inference:

- Original beforeWork dogfood incident root cause.
- Original approximately 18 afterWork Night Shift incident cause.
- Original 11-Sleep incident's exact configuration and cause.
- October 2 / October 16 transition incident's exact cause.
- Reported realized-geometry replacement/disappearance incident. The confirmed derived Preview omission is fixed; this does not prove it caused that report.
- Complete first-class Sleep authority design.
- Complete HistoricalPlan recovery UX and the original protected database's forensic diagnosis.
- Found Time workflow.
- Recurring Goal Demand.
- Planner / Summary migration.
- Day Worksurface convergence.

Safe verified recovery remains a later task. Protected evidence is not deleted or automatically reconstructed. The independent segment-boundary replay reproduction is recorded separately from the unavailable original transition evidence.

## 20. Completion Assessment

All required Task 9.9 corrective placement, identity, Preview preservation, overnight custom-window, publication-readiness and commit-certainty criteria are implemented and covered. Work-relative guards cover Day, Evening and Night shifts with complete buffers and no-fit behavior. Existing authority and persisted schema boundaries remain intact. Targeted tests, full suite, typecheck, lint, formatting, production build, bundle checks and whitespace validation pass. Pre-existing work is preserved; the required durable RESULT is present.

The unresolved original dogfood incidents and deferred product designs are explicitly outside Task 9.9's completion scope. No claim is made that those incidents were explained merely because current invariants pass.

Task 9.9 — Pre-Migration Correctness & Authority Convergence V1 is COMPLETE.
