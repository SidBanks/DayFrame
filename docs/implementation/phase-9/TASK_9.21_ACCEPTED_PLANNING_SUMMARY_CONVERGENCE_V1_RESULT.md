# Task 9.21 — Accepted-Planning Summary Convergence V1 RESULT

## A. Executive Summary

Implemented a lazy Accepted planning section on Summary, ahead of the existing History surface. It consumes the canonical public G2 projection, preserves individual accepted decisions, and progressively discloses Goal → iteration → scheduled work → publication/outcome context. Summary range, filter and open lineage survive existing Planner drill-down and Back.

No domain, persistence, schema, dependency, evidence-owner or recovery changes. Existing History, Goal activity, independent Progress and Sleep history remain reachable. No compatibility surface was retired.

## B. Repository Baseline

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. The workspace already contained extensive uncommitted Tasks 9.9–9.20 work, task documents and dogfood evidence. Before implementation, 956 files, their hashes, HEAD and exact dirty status were captured under `/tmp/dayframe-921-baseline/`.

Fresh pre-task validation: 150 test files / 1,508 tests passed in 65.08s; production build and bundle policy passed. Initial JS: 617,972 raw / 161,795 gzip bytes; largest lazy chunk 59,671; total JS 1,156,914. Hard initial gzip limit remains 170,000.

Task-relative hash comparison changes only two pre-existing files: `code/src/ui/DayFrameApp.tsx` and `code/src/ui/dayFrameUi.css`. Six new UI/test files and this RESULT are added. No baseline files were deleted or other prior contents changed. Temporary fixture entry/config files were removed; no commit or push.

## C. Discovery Findings

Recorded before implementation: Summary mounted lazy HistoricalIntelligenceSummary, with a seven-civil-day inclusive default through today; its range was local view state. History queried completion/scheduling evidence and contained GoalActivitySummary, independent Goal Progress, and SleepHistorySection, including its existing reporting behavior. It did not provide an accepted-iteration overview.

The existing public G2 query takes a 1–366-day half-open owner-label range, real asOf, and optional exact Goal/acceptance/fact selector. Its lazy adapter owns reads of canonical proposal/realization authorities, indexed publications, actuals and bounded current Goal/exact Demand context. Its pure builder retains accepted ID/revision, realization state, role-specific facts, exact publication/execution links, legacy uncertainty and notInferred Progress. Proposal lifecycle does not revoke acceptance.

G2 already provided everything needed. Display grouping and scoped claim sums require no new lineage reconstruction or evidence owner. G1 remains confined to the existing Day destination.

## D. Implementation

- `AcceptedPlanningSummary.tsx`: bounded query lifecycle, loading/error/coverage states, disclosure, publication pagination and lawful navigation callbacks.
- `acceptedPlanningSummaryPresentation.ts`: grouping existing G2 rows, exact acceptance/revision matching within the projection, in-range productive sums and explicit state/role labels.
- `acceptedPlanningSummaryContext.ts`: ephemeral range/filter/disclosure/reveal state, initialized to the existing seven-civil-day convention.
- `DayFrameApp.tsx`: lazy mount, app-owned context, existing Goal/Day/review destinations.
- `dayFrameUi.css`: wrapping, responsive controls, role styling and visible focus.
- `AcceptedPlanningSummary.test.tsx`, `AcceptedPlanningNavigation.test.tsx`, `acceptedSummaryFixtures.ts`: canonical lineage fixtures, interaction/authority tests and a clearly marked synthetic presentation stress fixture.

Only app context initialization and lazy wiring enter initial JS. The new Summary chunk is 16,498 raw bytes.

## E. Product Structure

Summary opens with a bounded period and scheduling-state filter. Goal rows summarize distinct readable accepted decisions. Opening a Goal exposes its iterations; opening one iteration exposes only its scheduled work; opening one work item exposes retained publication snapshots, report context and references.

Initial limits are 10 Goals, 10 iterations, 10 work items and 10 publication entries. Explicit Show more controls reveal additional rows. Only one Goal, iteration and work item is inspected at a time. Technical references sit behind native disclosures. No virtualization or dependency was introduced.

Display totals are qualified as readable, Goal-specific, productive time within the selected period. They describe all readable iterations in the Goal, even when the scheduling filter narrows the displayed rows. They are not saved, merged decisions or completion totals.

## F. Authority Analysis

Summary owns no authority. Its props provide one read query and navigation callbacks; no domain writer or raw authority accessor is available to the component.

| Distinction                                | Preserved behavior                                                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Accepted ≠ realized                        | G2 realizationState controls Scheduled / Awaiting scheduling / unavailable; an accepted record alone cannot imply scheduling. |
| Realized ≠ published                       | Every work item independently shows retained publication coverage.                                                            |
| Published ≠ actual                         | Frozen snapshots and recorded outcomes appear separately. Missing reports remain unknown.                                     |
| Actual ≠ Progress                          | Actual durations never produce Progress, attainment or completion percentages. Existing Progress remains independent.         |
| Current ≠ frozen                           | Current Goal names are labeled; publication titles/names come directly from retained snapshots.                               |
| Proposal lifecycle ≠ acceptance revocation | Superseded proposal status does not remove or replace an accepted decision.                                                   |

React filters already-projected records by their retained Goal and accepted ID/revision. It never reads/join raw proposal, realization, publication or execution stores. Multi-Goal decisions retain the same object/identity in each applicable display group; only that Goal's in-range productive claims contribute to its display sum.

## G. Network+ Provenance Evidence

Canonical fixture evidence, including the intentionally unrealized decision:

| Accepted identity | Productive time  | G2 scheduling state   | Summary                                                                     |
| ----------------- | ---------------- | --------------------- | --------------------------------------------------------------------------- |
| accepted-A        | 600 min / 10 h   | realized              | Planning iteration 1, separate work/publication/outcome links               |
| accepted-B        | 1,200 min / 20 h | realized              | Planning iteration 2, its own links                                         |
| accepted-C        | 60 min / 1 h     | acceptedButUnrealized | Planning iteration 3, awaiting scheduling; no calendar reservation inferred |

All three remain separate. The display sum is 31h; 30h belongs to the two scheduled acceptances. No 30h combined accepted decision is created.

A's reported 40 actual minutes remain separate from accepted/scheduled effort. B's missing outcomes remain unrecorded. Canonical correction and withdrawal constructors produce explicit corrected/withdrawn labels without changing Progress. The current Goal name is “Network+ renamed”; the retained publication title remains “Network+ Study.”

The Network+ assertions use the existing validated lineage fixture and canonical execution/G2 builders. The 20-Goal stress fixture expands projection-shaped identities for rendering only; it is not persisted and is not claimed as newly validated planning authority.

## H. Unknown / Protected Evidence

- Complete + zero + notFoundInRange yields “No accepted planning in this period.”
- Protected/unavailable family coverage yields explicit notices, never the complete-empty message.
- Unknown realization is not classified as awaiting scheduling.
- Partial coverage qualifies totals as readable records only.
- Protected accepted authority leaves retained scheduled references readable without reconstructing acceptances.
- Legal older publication with no planning lineage remains partial/unknown and visibly unassigned.
- Missing execution says Outcome not recorded; protection remains nonactivity.
- Query rejection/invalid query offers refresh and preserves a non-empty error state.

Actions here only navigate. Destination surfaces retain their existing authority gates. No recovery, abandonment or mutation command was added.

## I. Role Preservation

Productive work, support and protection retain their original G2 roles. They appear as Goal work, Preparation and Protected time — not an activity, with distinct styling and labels. Accepted productive sums exclude support/protection. Buffers do not receive activity outcomes. Publication/outcome evidence for support remains separate from productive work.

## J. Range Semantics

Default: seven local civil labels through today, matching the existing History default. The Summary form displays inclusive start/end; G2 receives start and end+1 exclusive, with a fresh ISO asOf. The accepted-planning range is separate from existing History controls and from Calendar/Preview/proposal horizons.

UI validation caps the range at 366 days; G2 remains the final query validator. A range change clears disclosure context and sends one bounded request. Filters and disclosure use the already-returned projection without per-Goal requests. State equality tests and production checks demonstrate that viewing/range/navigation do not mutate the planning state. Existing Planner Calendar context is retained by its navigation owner.

## K. Async Correctness

A request sequence and effect cleanup prevent late success or failure from replacing a newer result. Loading clears the previous result; a result key excludes a previous range from a newly selected range. Controlled A/B promise tests resolve B before A and verify B stays visible.

Clock callbacks are read through a ref, avoiding a new request merely because an app render creates a new callback. Range, explicit Refresh, query-owner changes or remount trigger a query. Back remounts and refreshes evidence while restoring range/filter/open identities.

## L. Mobile Acceptance Gate

Production Vite output was served through preview using a disposable Chromium profile. The fixture entry rendered the actual DayFrameApp and lazy Summary components, with canonical Network+ projection output and a separate 20-Goal/60-iteration/360-fact presentation stress mode. The standard production entry was checked independently with its real public store/G2 query.

| Width | Reachability and disclosure                                                   | Overflow / touch                                        | Back and semantics                               |
| ----- | ----------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| 320   | Summary → Goal → iteration → productive work → publication; large data reveal | Document width 320; visible controls at least 44 CSS px | Day and Goal Back restore lineage; parity passed |
| 390   | Same paths and 20-Goal long-name fixture                                      | Document width 390; controls ≥44px                      | Same evidence and distinctions                   |
| 768   | Same paths and fixture                                                        | Document width 768; controls ≥44px                      | Same evidence and distinctions                   |
| 1280  | Same paths and fixture                                                        | Document width 1280; controls ≥44px                     | Same evidence and distinctions                   |

Twenty-three rendered captures cover overview, expanded lineage, Back, large overview/expansion, protected evidence, reduced viewport height and 200% zoom. Measurements allow only floating-point rounding below 44px (observed 43.9999847). No horizontal overflow occurred. Touch events, not hover, opened the workflow. Publication content and actual duration were visually inspected at 320px.

Back restored open identities; explicit Return to scheduled work restored focus to its trigger. At 320×360, date inputs and keyboard focus remained usable. A 640px viewport at CSS zoom 2 provided a 320px-equivalent reflow check. Expanded Summary text was identical across the four primary widths.

Evidence: `/tmp/dayframe-921-browser.json`, `/tmp/dayframe-921-<width>-<case>.png`, browser driver `/tmp/dayframe-921-qa.mjs`. These are disposable local artifacts; the durable findings are recorded here.

## M. Accessibility

Controls have accessible labels, native keyboard semantics, visible focus and 44px targets. Disclosure buttons expose aria-expanded; nested publication/reference disclosures use native details/summary. Loading/errors/coverage use status or alert semantics. Labels, headings and text preserve distinctions without relying on color. Return controls restore trigger focus.

Checked touch reachability, keyboard focus, wrapping, reduced-height operation and 200% reflow in headless Chromium. This is not a screen-reader certification, a full WCAG audit, a hardware soft-keyboard test or cross-browser certification.

## N. Performance

One bounded G2 call serves the entire accepted-planning range. Opening Goals, iterations and facts, filtering and Show more do not fan out queries. The 20-Goal fixture contains 60 iterations and 360 facts; the initial rendered tree contains 10 Goal rows, zero iteration rows and zero fact rows. Showing all Goals yields 20 rows; opening one iteration renders its nine work items, not the whole dataset.

Five production stress observations at 390px: fixture/G2 assembly took 27.5–56.2ms; request start through two animation frames with the 10-row overview present took 33.3–74.0ms. Each observation made exactly one query. These are local diagnostic observations under concurrent validation load, not an SLO or a large IndexedDB benchmark. Synthetic expansion cost is included; it must not be interpreted as production adapter I/O latency.

The standard production entry at 320px loaded neither Summary nor the G2 query chunk before navigation. Summary navigation to complete-empty evidence took approximately 458ms including lazy downloads, other Summary work and polling. The new lazy Summary and G2 query resource durations were about 7.5ms and 17.3ms. No overflow occurred. Evidence: `/tmp/dayframe-921-performance.json` and `/tmp/dayframe-921-production.json`.

## O. Bundle

Fresh pre/post production measurements:

| Measure                    |    Before |     After |   Delta |
| -------------------------- | --------: | --------: | ------: |
| Initial raw JS             |   617,972 |   618,770 |    +798 |
| Initial gzip JS            |   161,795 |   161,960 |    +165 |
| Largest lazy chunk         |    59,671 |    59,671 |       0 |
| Total JS                   | 1,156,914 | 1,174,210 | +17,296 |
| Initial gzip hard headroom |     8,205 |     8,040 |    −165 |

Hard policy passes; 170,000 gzip gate unchanged. Existing advisory thresholds remain exceeded: initial gzip >161,500 and total JS >825,000 (architecture-review advisory). No budget threshold or policy was relaxed. The accepted-planning UI remains lazy.

## P. Tests

Fresh baseline: 150 files / 1,508 tests pass.

Focused final G2 + public adapter + Summary + navigation: 4 files / 33 tests pass. New Summary/navigation regressions cover distinct 10h/20h/1h decisions, exact associations, current/frozen naming, roles, missing/corrected/withdrawn outcomes, protected/unavailable realization, retained references, legal legacy lineage gaps, true empty, async races, errors, range bounds, multi-Goal range-scoped sums, no query fanout, callback stability and Back.

Final whole suite: **152 files / 1,527 tests passed in 68.52s** (+2 files / +19 tests over baseline). Formatting, lint, typecheck, build, bundle policy and diff checks pass.

## Q. Validation Commands

Executed in `code/` unless stated otherwise:

- `npm test -- --maxWorkers=2` — fresh baseline, intermediate implementation, and final full suite.
- `npm run format`; `npx prettier --check .`.
- `npm run lint`; `npm run typecheck`.
- `npx vitest run src/ui/tests/AcceptedPlanningSummary.test.tsx src/ui/tests/AcceptedPlanningNavigation.test.tsx src/core/productEvidence/acceptedPlanningEvidence.test.ts src/state/productEvidence.test.ts --maxWorkers=2`.
- `npm run build`; `npm run check:bundle`.
- Temporary fixture: `npx vite build --config qa921.config.ts`; `npm run preview -- --outDir /tmp/dayframe-921-qa-dist --port 4921 --host 127.0.0.1`.
- Standard production: `npm run preview -- --port 4922 --host 127.0.0.1`.
- Disposable Chromium/CDP driver: `node /tmp/dayframe-921-qa.mjs`, plus `--perf` and `--production`.
- Repository root: `git diff --check` and pre-task SHA-256 comparison.

Logs: `/tmp/dayframe-921-{baseline-tests,baseline-build,baseline-bundle,focused,types,lint,prettier,build,bundle,tests-final}.log`. The first browser driver access was blocked by the sandbox and retried with approved local CDP access. One strict touch measurement initially rejected floating-point rounding; the rerun used a 0.01px tolerance. Early test harness issues were corrected, including unstable query callbacks and uninitialized test Goal ingress. Wrong-directory command attempts made no product changes; their temporary root test cache was removed.

## R. Persistence / Dependencies

No changes to durable stores, IndexedDB versions, localStorage keys, entity schemas, backups, authority contracts, package manifests or lockfiles. App-owned Summary context is ephemeral only. No planning writes, historical reconstruction, recovery, migrations, destructive abandonment or Progress inference. Dogfood evidence remains unchanged. No dependency additions.

## S. Compatibility Disposition

History remains mounted below Accepted planning, with its existing queries and controls. Goal activity, Progress and Sleep history/reporting remain reachable. Planner Calendar, Today/Day, Goal source navigation and Review Plan remain existing destinations. No legacy lane or Summary surface was removed, hidden or declared redundant.

## T. Remaining Gaps

No blocker identified within this bounded task. Protected History recovery remains a separate task. Large real persisted datasets and physical mobile devices have not been performance-certified. Historical records without canonical retained lineage stay unknown. There is no acceptance-replacement inference, new Progress model, new scheduling authority, cross-browser certification or broad Summary redesign.

## U. Next-Task Assessment

This establishes the accepted-planning Summary slice using existing canonical evidence. A next task can independently address Protected History access or another bounded Summary slice after its own contract review. Compatibility retirement requires demonstrated replacement parity; this task does not authorize it.

Task 9.21 — Accepted-Planning Summary Convergence V1 is COMPLETE.
