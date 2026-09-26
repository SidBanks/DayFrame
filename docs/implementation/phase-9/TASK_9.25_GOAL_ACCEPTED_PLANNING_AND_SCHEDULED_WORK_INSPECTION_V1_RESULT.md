# Task 9.25 — Goal Accepted Planning & Scheduled Work Inspection V1 RESULT

**Status: COMPLETE — bounded read-only product integration**  
**Validation date: 2026-09-23**

## 1. Outcome

Selected Goals now expose a progressively disclosed “Accepted planning and scheduled work” inspector. It reads canonical G2 evidence, distinguishes individual accepted iterations and scheduling states, exposes available publication/outcome provenance, and opens the existing Daily Planner on the fact's canonical User Day. Back restores the inspection and unsaved authoring context and queries fresh evidence. It introduces no planning, reporting, lifecycle, persistence or schema authority.

This is accepted-planning evidence for a selected period, not a complete Goal biography, general activity inventory, or full Goals convergence. Reporting stays in the existing Daily Planner. Progress remains not inferred.

## 2. Identity, governing inputs and protected baseline

The immutable execution input matches the supplied attachment, contains Sections 1–18 and the final completion statement, and was not edited. Discovery found no conflicting executed Task 9.25 assignment; the older hydration roadmap entry is not an executed assignment.

Starting HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Starting status had **190 entries**. A task-relative copy and SHA-256 inventory captured **984 files** before implementation. The final comparison changes only four baseline files, listed below, and finds no missing baseline files. Exact starting status and the material comparison are retained in [the evidence directory](evidence/task-9.25/PROVENANCE-RESULT.md). Baseline copies remain disposable local-session artifacts. No applicable AGENTS.md was found in the repository/ancestor search.

Actual governing repository inputs used:

- Task 9.24 RESULT (`TASK_9.24_GOALS_FOCUSED_EDITING_REQUESTED_TIME_FIDELITY_V1_RESULT.md`), `GoalsFocusedEditing.test.tsx`, Goal editing context/hooks and current Requested Time UI, including F1/retry/optional-field protection.
- Task 9.23 RESULT's G2/G1, historical completeness, freshness and evidence-gap findings.
- Task 9.21 RESULT, `AcceptedPlanningSummary.tsx`, its presentation/context helpers and navigation tests.
- Task 9.19 RESULT and `ADR_CANONICAL_PRODUCT_EVIDENCE_PROJECTIONS.md`; actual `acceptedPlanningEvidence.ts`, query adapter, evidence types/owners and fixture validators.
- Task 9.20 RESULT and existing `DayWorksurface`, `DayOutcomeControl`, `plannerNavigation` and application return contracts.
- Product Ontology & Vocabulary Specification V1 and Appendix B distinctions for Goal, accepted planning, scheduled productive/support/protected time, Actual and Progress.
- End-State Compatibility & Retirement Architecture Specification V1 and durable-data compatibility/historical-protection ADR contracts.
- Goal Lifecycle specification only to preserve the boundary with future lifecycle/time-accounting design.

No previous RESULT, architecture document, execution input, package/dependency file, or forensic artifact was modified. No reset, stash, commit or push occurred. Preserved Dogfood Pass 02 state was never opened, initialized or modified.

## 3. Query contract, scope and reuse

The lazy Goal component calls the existing public `queryAcceptedPlanningEvidence` with:

```ts
{
  select: { kind: "goal", id: selectedGoalId },
  startUserDayDate: appliedInclusiveStart,
  endUserDayDateExclusive: addUserDayLabels(appliedInclusiveEnd, 1),
  asOf: now().toISOString()
}
```

There is one real evaluation instant per request. First ordinary opening uses the calendar month of the canonical User Day returned through `currentPlannerView`, not the civil date. A permanent test crosses a 06:00 User Day boundary at the start of a civil month. Each Goal retains its own period and disclosure state. A valid explicit Summary navigation period is honored without replacing Summary's context.

The inclusive control range must represent 1–366 days. Invalid/reversed/oversized inputs retain associated feedback and the previous applied period; they cause no query or silent clamp. Period controls change no Requested Time, Calendar, horizon, Review Scope or Publication Range authority. The range bounds evidence selection, not a promise about underlying storage scans.

No query runs per Goal list row. Opening, Goal/range change, query-owner replacement, return/remount and Refresh query the selected Goal. Disclosure and incremental reveal operate on the returned projection. React does not join raw authority collections. Existing exact-lineage, effort, publication and outcome helpers are reused; coverage copy was narrowly extracted into `AcceptedPlanningCoverage` for both consumers. Summary remains supported. The app/context additions do not eagerly import G2/history engines.

## 4. Semantics and bounded presentation

Iterations retain accepted identity/revision, decision, proposal, Requested Time and realization references. Chronological ordering has identity/revision tie-breaks and does not establish supersession. Later requests, acceptance, proposal lifecycle and Goal status do not revoke earlier iterations.

Only positive `acceptedButUnrealized` evidence receives “Accepted but not yet added to the Schedule.” Unknown/protected realization is explicitly uncertain. Realized iterations say “Added to the Schedule.” Readable facts remain available when accepted authority is protected; no unavailable acceptance or absent current Goal is reconstructed.

Accepted productive quantities are scoped to this Goal's in-period claims. Readable scheduled productive, Support and protected quantities are separate and coverage-qualified; they may include retained publication facts. They are not presented as a ratio against whole-acceptance quantities, Actual totals or Progress. Protected time is not an activity. Support's role remains explicit and supplied frozen names remain publication evidence; a missing activity title is not invented from a current Goal. Exact component references remain inspectable.

Current Goal names are labeled current context; frozen title, Goal name, publication identity and frozen User Day boundary/offset remain historical context. Facts show canonical User Day and full UTC endpoint dates, including cross-midnight cases. Effective completed/partial/skipped, corrected and withdrawn outcomes use existing helpers; absent outcome is “Outcome not recorded.” Reported Actual is separately labeled, with retained revision count. No completion percentage, new status or Progress inference is introduced.

Iteration lists start at 10 and reveal in increments of 10. Expanded facts and publications are similarly bounded. Stable accepted/fact/publication identities retain disclosures. Synthetic 60-iteration/360-fact tests prove presentation bounds, not persisted authority validity or storage performance.

## 5. Freshness, navigation and editing preservation

Request generations and render identity include selected Goal, applied period, query owner, store and editing-context boundary. Late success/failure cannot display old evidence under a new Goal/range, replace a new query owner's result, or resurrect cleared/restored context. Subscriptions supported by existing Goals, Requested Time, proposals, execution ingress/history and publication history mark snapshots stale, including notifications while a request is pending. There is no universal realization/G2 subscription; the UI states an as-of snapshot and provides Refresh without polling or promising live synchronization.

Fact navigation passes `fact.userDayDate` directly to the existing `openDay` contract. This contract opens the day, not a fabricated fact-specific reporting target. Review Schedule is navigation-only. Back refreshes G2 while restoring selected Goal/request, search/filter/reveal, original draft base revisions, applied/invalid draft range and open identities through the existing app-owned ephemeral editing context. Focus returns to the inspector heading, with a visible outline. Existing Goal protection handling can still expose readable historical inspection without constructing a missing Goal.

Permanent integration tests perform a real canonical Goal → Day → existing **Save outcome** command → Back round trip and assert the newly completed outcome appears. Unrelated Requested Time (7-hour draft) and Goal title drafts remain unsaved and unchanged; planning authority is unchanged. Summary → Goal → Day → Back → Summary retains independent periods/disclosure and predictable navigation. Actual application clear/V14 restore boundaries invalidate pending Goal results in fake IndexedDB tests. Existing profile and Task 9.24 behaviors remain covered by the unchanged full suite.

## 6. Empty, protected and error behavior

Complete `notFoundInRange` explains that this period contains no accepted planning and makes no lifetime/completion claim. Partial/protected sources retain readable evidence and established coverage details. Unknown realization does not imply no scheduling. Legacy lineage remains unavailable rather than inferred. Query failure offers Refresh and never impersonates complete-empty evidence. Invalid-query and local range errors remain actionable. No recovery, reset, abandonment or destructive action was added.

## 7. Automated and production-browser evidence

Baseline: **155 files / 1,560 tests passed**, 64.31 seconds. Final: **157 files / 1,579 tests passed**. The two new permanent suites provide 19 focused cases, including parameterized invalid ranges and corrected/withdrawn evidence. Existing Goal editing, Summary, constructive planning, realization, provenance, Progress and navigation assertions were retained.

The validated Network+ semantic regression proves independent A=600 minutes (10h) realized, B=1,200 minutes (20h) realized and C=60 minutes (1h) unrealized. It asserts no synthetic combined acceptance and no scheduled facts for C, role separation, renamed/current versus frozen publication context, outcome states, unknown/protected coverage and no inferred Progress.

Production Chromium checks used a new disposable profile and canonical command-created data for the principal workflow. The browser fixture has three separate **1-hour** iterations, two realized/published and one unrealized; it is distinct from the 10h/20h/1h unit regression. All four widths exercised Goal search/selection, simultaneous unsaved Requested Time and Goal drafts, period changes, iteration/fact/publication detail, correct Day navigation, Back, retained drafts/disclosure and section focus. Canonical fact/acceptance/realization/Requested Time IDs and owner day match across widths. Hashes of 13 non-restore IndexedDB stores match before/after browsing.

| Observation                      | Result                                                                                              |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| Viewports                        | 320, 390, 768, 1280 × 800 CSS px                                                                    |
| Document client / scroll widths  | 305/305, 375/375, 753/753, 1265/1265; scrollbar accounts for 15px                                   |
| Measured inspector target height | Minimum 44 CSS px                                                                                   |
| Retained measurement snapshots   | 46; no document horizontal overflow                                                                 |
| Canonical Day destination        | Same exact fact and `2026-09-04` User Day at all widths                                             |
| Return                           | Drafts/range/publication retained; heading focus, 3px solid outline                                 |
| Dense simulated presentation     | 60 iterations / 360 facts; first 10, explicit reveal to 20                                          |
| Defensive simulated states       | Complete empty, protected/partial, unknown realization, failed query, invalid period at every width |
| Reduced height                   | 390 × 420; keyboard date-field navigation and visible focus                                         |
| Reflow approximation             | CSS zoom 2 at 640 × 800; no document overflow                                                       |

Five screenshots, machine-readable measurements, fixture export/source, production QA harness/config, driver, reproduction instructions and material validation logs are retained in [evidence/task-9.25](evidence/task-9.25/PROVENANCE-RESULT.md). Narrow inspection/return screenshots were visually reviewed. Source inspection confirms semantic headings/controls, associated errors, non-color states and no hover-only controls or overflow hiding. No physical-device, soft-keyboard, screen-reader or browser-native-zoom certification is claimed.

Development failures and resolutions are recorded in the evidence provenance, including a restore-test wait under full-suite load and selector scoping. An unrelated **pre-existing production V14 import defect** (`Illegal invocation` from unbound `structuredClone` participant cloning) was found during initial fixture setup. It remains unchanged. Canonical command seeding completed the mandatory browser workflows; production backup import is not claimed as passed. Automated clear/restore invalidation is separately covered. This finding does not require new inspector authority or leave a mandatory inspector workflow blocked.

## 8. Repository and bundle gates

Commands ran from `code/`: `npm exec prettier -- --check .`, `npm run lint`, `npm run typecheck`, focused `npm test -- …`, `npm test`, `npm run build`, `npm run check:bundle`. All passed. `git diff --check` ran from the repository root and passed. Formatting was applied only to task-created/touched files. Material output is retained in `validation-RESULT.json`.

| JavaScript measure | Fresh baseline |     Final |   Delta |       Hard limit / final headroom |
| ------------------ | -------------: | --------: | ------: | --------------------------------: |
| Initial raw        |        621,885 |   622,594 |    +709 |                  685,000 / 62,406 |
| Initial gzip       |        162,932 |   163,125 |    +193 |                   170,000 / 6,875 |
| Largest lazy chunk |         62,652 |    62,652 |       0 |                  100,000 / 37,348 |
| Total              |      1,209,743 | 1,226,104 | +16,361 | Advisory, not a raised hard limit |

Existing advisories remain: initial gzip exceeds the 161,500-byte warning threshold; total JavaScript exceeds the 825,000-byte architecture-review threshold (and 800,000 warning threshold). No threshold/dependency changes were made. The inspector and G2 reader remain lazy; the largest lazy chunk remains the existing SetupScreen.

## 9. Exact task file scope

Modified baseline files:

- `code/src/ui/DayFrameApp.tsx`: lazy inspector wiring, canonical current-day input, Summary explicit-range navigation and existing return integration.
- `code/src/ui/GoalSection.tsx`: selected-Goal inspection slot reachable during editing and protected/missing-current-context handling.
- `code/src/ui/AcceptedPlanningSummary.tsx`: reuse the narrowly extracted coverage component; preserve Summary semantics.
- `code/src/ui/dayFrameUi.css`: scoped reflow, wrapping, 44px controls and visible focus; no clipping.

New application/test files:

- `code/src/ui/GoalAcceptedPlanningSection.tsx`: bounded read-only G2 inspector and freshness guards.
- `code/src/ui/goalAcceptedPlanningContext.ts`: lightweight ephemeral explicit-range handoff.
- `code/src/ui/AcceptedPlanningCoverage.tsx`: shared existing coverage presentation.
- `code/src/ui/tests/GoalAcceptedPlanning.test.tsx`: focused semantics, bounds, async, source-staleness and canonical-day regressions.
- `code/src/ui/tests/GoalInspectionNavigation.test.tsx`: canonical reporting/return, draft preservation, Summary independence and clear/restore tests.
- `code/src/ui/tests/goalInspectionCanonicalFixture.ts`: disposable canonical owner-command fixture.

New documentation/evidence: this RESULT and, under `evidence/task-9.25/`, `PROVENANCE-RESULT.md`, `baseline-status-RESULT.txt`, `validation-RESULT.json`, `browser-measurements-RESULT.json`, `browser-driver-RESULT.mjs`, `canonical-fixture-RESULT.json`, `canonical-seed-RESULT.ts`, `qa-build-config-RESULT.mjs`, `defensive-harness-RESULT.tsx`, `defensive-harness-RESULT.html`, and five screenshots: `320-canonical-inspection-RESULT.png`, `320-canonical-return-RESULT.png`, `320-SIMULATED-partial-RESULT.png`, `320-SIMULATED-failure-RESULT.png`, `390-reduced-height-focus-RESULT.png`.

All additional evidence/report filenames contain RESULT. QA seed/harness entry points live outside production application source and are not shipped by the application build. No existing test was removed or weakened. No schema, persistence format, backup format, dependency, compatibility reader, lifecycle, domain command, forensic-state or retirement change occurred.

## 10. Limits and final determination

The inspector is a bounded as-of view supplied by current G2, not a complete lifetime history or live universal subscription. Current names are not historical decision-time names. A missing title, protected lineage or outcome is not invented. Navigation opens the canonical day because the existing destination has no fact-focus contract. Synthetic density does not benchmark storage, and browser emulation does not certify physical devices. The unrelated existing browser backup-import defect remains documented for separate work.

All mandatory Task 9.25 inspection, navigation, automated, production-browser and hard bundle gates pass. No evidence-contract or architecture-decision stop condition was required.

**Task 9.25 — Goal Accepted Planning & Scheduled Work Inspection V1 is COMPLETE.**
