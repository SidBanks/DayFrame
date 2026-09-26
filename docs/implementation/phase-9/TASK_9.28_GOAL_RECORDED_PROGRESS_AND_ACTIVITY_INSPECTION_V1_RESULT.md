# Task 9.28 — Goal Recorded Progress & Activity Inspection V1 — RESULT

Status: COMPLETE — bounded read-only inspection and existing-workflow navigation.

## 1. Bounded outcome and contract map

Selected Goal detail now offers a progressively disclosed **Recorded Progress and Activity** section. It reads independent measured Progress and historical Goal Activity, explains their provenance and coverage, opens existing Measurement/Observation controls or the exact canonical Daily Planner day, and preserves inspection state and unrelated drafts on return. It has no domain command or storage authority. Summary and the separate accepted-planning/scheduled-work inspector remain supported.

The preimplementation [command/query map](evidence/task-9.28/COMMAND_MAP_RESULT.md) records the actual current interfaces. Progress is synchronous: `queryGoalProgress({goalId,evaluationAsOf})`. Activity is asynchronous: `getGoalActivity({policy,goalId,startUserDayDate,endUserDayDate,evaluationAsOf})`, with goalActivityPolicy@1 / historicalMetricPolicy@1 and **inclusive** User Day labels. These differ from G2's exclusive end. No projection, candidate selection, membership or coverage arithmetic moved into React.

## 2. Governing sources, identity and baseline

The already-present 9.28 input matched the supplied attachment exactly, including Sections 1–18 and the final statement. It remains unchanged and separate from this RESULT. No executed 9.28 RESULT or conflicting assignment existed. The older projected acceptance audit was not treated as an assignment. Task 9.27's actual COMPLETE continuation RESULT was checked; its original blocked execution and all subsequent evidence remain historical and immutable.

Read the requested 9.23–9.27 RESULTs and accepted Structure owner-safety ADR; Tasks 5.7, 5.9, 5.14, 5.17 and 5.18 RESULTs; measurement definition epoch and observation identity/revision/time ADRs; historical metric, frozen Goal-link coverage, Goal identity and G1/G2 contracts; Product Ontology and applicable Appendix B entries; durable compatibility, cross-storage restore and End-State Compatibility/Retirement specifications. [Governing versions](evidence/task-9.28/governing-versions-RESULT.json) pins the actual repository documents. Current public query, domain policy, consumer, subscription, reporting and readiness source was inspected instead of assuming older descriptions still matched.

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Actual starting status: **230 entries**; preservation baseline: **1,151 tracked/unignored files**. No applicable AGENTS.md was found in the repository or checked ancestors. No skill or sub-agent was used. Exact HEAD/status/hashes and byte copies were captured before implementation; baseline tests/build/bundle all passed. Baseline full suite: **162 files / 1,653 tests**, 103.19 seconds. Historical 9.27 counts were not substituted for measurements.

## 3. Activity population, policy and limitations

The current projection traverses the selected publication's `day.occurrences`. Unlike an assumption based on early Task 5.7 alone, the current snapshot union includes template, work, manualEvent, acceptedAllocation and sleepRequirement sources. Membership requires the snapshot's frozen Goal identity. Modern published productive Goal work, support and protection entries carrying that identity therefore already participate; the continuation test proves acceptedAllocation provenance appears. There is no UI join to G2 or source-kind policy extension. G2 remains the separate destination for acceptance lineage, distinct iterations and unrealized accepted work.

Known linked, known unlinked (`goals: []` or a different Goal), and legacy membership-unavailable (absent goals) remain different. Current rename, unlink, Structure edits or shared names never retarget historical membership. A shared occurrence can appear under two Goals without exclusive or unique-global credit. Published-empty days, missing publications, partial Goal-link coverage and protected outcomes remain different evidence. The UI preserves three separate dimensions: plan coverage, Goal-link provenance coverage and reporting coverage. It derives no combined score.

Planning shows scheduled/unplaced/omitted/blocked over linked intended occurrences. Outcomes show completed/partial/skipped/unknown after withdrawal/notReported over linked scheduled occurrences. Partial has no fractional weight; scheduled is not completed; counts confer no Progress or duration. Protection can leave lawful planning readable while outcomes are unavailable. Known zero describes only the projection's covered population, never all work performed or zero accomplishment. Day links do not create reporting permission for unplaced, omitted or protection entries.

## 4. Progress, definition epochs and provenance

The reused Progress renderer shows exact recorded quantity and target/unit first, then the canonical percentage and neutral comparison. Observations are absolute current totals, not increments. Zero is available evidence; absence is not zero. Above-target percentages are not clamped. String formatting avoids binary floating-point conversion. Canonical four-place rounding can itself yield 100 while comparison remains belowTarget: the presentation explicitly says **Below 100% (canonical percentage rounds to 100%)**, including qualification in the accessible label, while retaining the supplied percentage in provenance. No alternate arithmetic or domain rounding policy was introduced.

The canonical definition resolver and observation selector own exact epoch/unit binding and knowledge/observed-time semantics. Definition changes, stop/restart and unit changes do not carry forward incompatible evidence. Stopped is distinguished from never configured using the existing ordered definition history at the cutoff, not a current-only guess. Query and history-read errors stay local to Progress.

One controlled provenance disclosure shows exact definition ID/revision/effectiveFrom, observation ID/revision, exact observedAt/recordedAt, cutoff, method, target/unit/value and supplied percentage. The Activity period is explicitly not a measurement epoch or denominator. Current Goal title/status is current context rather than historical Goal-state reconstruction. Active-at-target and completed-below-target remain lawful independent facts.

Loading/protection for Goal, definition and observations; missing Goal; no definition; stopped; insufficient compatible observation; unsupported policy; invalid evidence; and read failure receive distinct treatment. Unsupported definition preservation is verified through actual V14 import. No bar, forecast, trend, pace, score, automatic completion or Actual/Milestone-to-Progress conversion was added.

## 5. Presentation reuse and separate context

`GoalProgressSummary` retains its Summary route and deterministic formatting while accepting controlled provenance and optional identity details. `GoalActivitySummary` exports its existing Activity renderer, with optional bounded disclosure and canonical-day actions for the new host. The host mounts neither the whole Summary nor a second Goal selector.

Measurement and Progress Reporting remain the existing command components. Their draft, mode, original expected revision/record and feedback are now held in the existing ephemeral app-owned context through a narrow presentation hook. They remain mounted while Goal metadata is being edited. Returning to them never rebases a captured definition/observation revision. Existing authoring validation, permissions and commands remain unchanged; archived inspection does not reactivate a Goal.

Summary now retains its own selection, period, cutoff and disclosures through navigation in distinct context cells. Its existing subscription/refresh behavior remains its own. An optional **Inspect this Goal** handoff passes a valid inclusive Activity period to a separate navigation cell and does not change Summary or G2's period. The existing Summary Planner handoff also remains available. G2 stays independently reachable and semantically unchanged; the retained Network+ 10h/20h/unrealized-1h regression is not combined with Activity counts.

## 6. Range, freshness, independent failures and races

The first ordinary opening defaults to the month containing the **canonical current User Day**, using the existing resolver with the opening instant. A midnight/month-boundary regression distinguishes this from civil-date slicing. An earlier applied period is retained; a valid explicit navigation period is honored. This host accepts 1–366 inclusive labels; current Activity policy has no stricter bound. Invalid, reversed or oversized input keeps its feedback and previous applied range, performs no query or domain write, and does not clamp.

Opening, explicit Refresh, applied-period change, owner replacement and navigation return establish a logical refresh using one captured cutoff for both queries. Notifications requery/invalidate at the retained cutoff and explain that newer records may require Refresh. A shared cutoff is not an atomic multi-authority snapshot promise. No polling, per-render cutoff sampling, universal event bus or durable cache was added.

Activity render identity includes Goal, applied period, cutoff, store, generation and editing context. Pending results disappear from the new period heading; late successes/failures cannot cross Goal, owner or replacement boundaries. Source and ingress subscriptions invalidate cached Activity immediately. Progress remains synchronous and independently protected; Activity failure does not erase it. Protected execution retains canonical plan evidence; observation protection does not erase lawful Activity. Imported Structure-only temporal qualification does not suppress either independent view. Existing global recovery readiness still removes ordinary interaction.

## 7. Reporting, bounded evidence and navigation

The inspector performs navigation only. **Open Measurement controls** and **Open value reporting and correction history** focus existing headings. Current-lineage reporting history is explicitly separate from the inspector cutoff. **Return to recorded inspection** captures a fresh cutoff and requeries; it never substitutes a submitted value optimistically. Tests and native runs issue real existing observation record/correct commands; tests also retract through the existing controls. Exact independent authorities are compared around native reporting.

Linked rows and coverage rows start at ten, with explicit increments. Missing-day details are also bounded. One Activity category and one Progress provenance disclosure are active; IDs, canonical order, frozen titles, policy/cutoff and publication context are retained. Twenty-four canonical Goals prove no query fan-out across the list; validated history supplies thirteen scheduled linked rows and more than ten coverage rows. These are presentation bounds, not storage/I/O performance claims.

An Activity row opens its supplied User Day directly, even when its timestamp falls after civil midnight. No timestamp-derived day, fabricated occurrence focus or historical reporting target is constructed. The destination is the current Daily Planner, which can differ after later publication/correction. Back restores the Goal, period, category, reveal/disclosure, unrelated drafts and inspector-heading focus, then refreshes. Existing real outcome reporting changes Activity while measured Progress remains unchanged; observation correction/retraction changes Progress without changing Activity.

Permanent integration tests preserve Goal, Requested Time, Structure, Measurement and Observation drafts across reporting/related-Goal/day workflows. Summary selection/range/cutoff/provenance returns independently. Draft navigation and refresh perform no command and never save or silently rebase intent.

## 8. Restore, clear, profiles and protection

Actual rejected JSON import retains drafts and inspection context. Actual supported V14 replacement invalidates displaced context, restores original authorities and requires fresh inspection. Full clear removes the inspector and reporting drafts. Setup profile loading preserves independent measurement/observation and inspection scope. A begun-but-aborted coordinator transaction retains valid drafts; a controlled runtime-install failure during actual import reaches existing recovery-required readiness and removes the open inspector. A delayed old owner/context result cannot reappear after replacement.

The inspector has no restore/clear/recovery capability. Definitions, observations, publications, execution, accepted iterations and exact histories remain the existing owners' data. Browser export/import/reload comparisons exclude only backup envelope metadata and explicitly listed nonsemantic collection ordering; fresh derived cutoffs are not represented as durable byte equality.

## 9. Permanent regression matrix

New permanent suite: `code/src/ui/tests/GoalRecordedInspection.test.tsx`, supported by `goalRecordedCanonicalFixture.ts`. Canonical owners or validated V14/publication builders establish semantic evidence; explicit mocks are labeled controlled query/protection/race seams.

| Requested coverage                                               | Evidence                                                                                                                                                                            |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exact identity/shared cutoff/inclusive period/no catalog fan-out | Selected-Goal query spy, one opening clock sample, 24-Goal catalog                                                                                                                  |
| Invalid ranges; Activity-only range independence                 | No new query on invalid/reversed/oversized intent; unchanged measured value at the same cutoff                                                                                      |
| Zero, no observation, below/at/above and decimal boundary        | Parameterized exact canonical values, including 99.999999 toward 100                                                                                                                |
| Absolute observations and epoch fidelity                         | Successive 17→20 not summed; correction/retraction cutoffs; target/unit revision, stop/restart require compatible evidence                                                          |
| Provenance and protected/unsupported states                      | Exact IDs/revisions/times; initializing and protected Goal/definition/observation; actual unsupported-policy V14 import; local read failure                                         |
| No inferred Progress/lifecycle                                   | Real Actual report leaves observations exact; observation writes leave Activity/planning unchanged; Milestone satisfaction leaves observations exact; completed Goal remains at 40% |
| Categories and coverage                                          | Canonical positive completed/partial/skipped/withdrawn/never-reported counts; empty publication, missing plan, legacy membership; protected execution keeps planning                |
| Frozen identity and multi-Goal scope                             | Rename/unlink/Structure change preserves provenance; shared frozen rows appear under each Goal without total aggregation                                                            |
| Canonical midnight navigation/report return                      | Exact day 2026-09-10 from post-midnight scheduled evidence; real existing outcome command and fresh return                                                                          |
| Existing observation workflow                                    | Record, correction, retraction, single record dispatch, fresh canonical result                                                                                                      |
| Async isolation                                                  | Delayed range failure, Goal success, replaced owner/context completion, independent Activity failure                                                                                |
| Drafts and Summary                                               | Goal/Requested Time/Structure/Measurement/Observation retention; related Goal/day/report returns; independent Summary cutoff/period/provenance                                      |
| Restore boundaries                                               | Actual malformed/successful V14 import, full clear, profile independence, aborted transaction, controlled recovery failure and displaced results                                    |
| Bounded rendering / prior invariants                             | Thirteen valid linked scheduled rows and coverage rows; unchanged G2, Structure, owner safety, restore and prior Goal tests in full suite                                           |

The complete suite is unfiltered apart from the permitted two-worker bound. Existing assertions, timeouts, configuration and semantic diagnostic artifacts were not weakened. The new longer end-to-end tests declare their own bounded 20-second limits; old timeouts remain unchanged.

## 10. Production browser and mobile evidence

Production Chromium with a fresh disposable profile, origins 4961/4962 and debug port 9340 passed all mandatory workflows at **320, 390, 768 and 1280 CSS px**. Final native run: **51 observations**, **34 DOM measurements**, **1,120 sampled controls**, **12 full-authority comparisons**, zero document overflow and zero uncaught application exceptions. All sampled controls were at least 44px high; minimum measured width was 79.8125px. Every authority comparison also matched raw collection order.

Every width selects zero/no-value and measured Goals, opens provenance, applies an Activity period, reveals ten→thirteen linked rows and coverage details, opens existing reporting controls, records an observation, returns/refreshed-inspects, reports a scheduled outcome through the exact day, returns with retained drafts, corrects the observation, rejects invalid import without losing drafts, exports through the actual UI, reloads, imports into a separate origin, reloads again and freshly inspects restored evidence. The final driver compares all independent authorities exactly around observation, Actual and correction, excluding only the authority explicitly written.

Partial legacy-link coverage is exercised and readable alongside thirteen known linked scheduled rows. Known zero and no current value are separately measured. Day return focus is the inspector heading with a 3px outline at each width. Additional 390×420 keyboard traversal focuses Observed date/time in the existing reporting form; 640px viewport with CSS zoom 2 tests roughly 320px reflow. No overflow hiding was used. Semantic labels/headings, associated invalid-period/import feedback and text states require no hover, drag, double-click or context menu.

Retained narrow screenshots cover Progress provenance, partial Activity coverage, existing observation form, day return, rejected import, reduced-height keyboard focus and CSS reflow. The driver, compiled-seed source/configuration, native downloads renamed as RESULT artifacts, query snapshots, identity/revision comparisons and measurements are retained under [task-9.28 evidence](evidence/task-9.28/REPRODUCTION_RESULT.md).

This is native headless Chromium/CDP execution using actual browser storage, download and file-input import, plus computed DOM measurements and visual inspection. It does not certify a physical device, OS picker interaction, soft keyboard, screen reader, pointer ergonomics or browser-native zoom. Precise cutoff rollback/interleaving/protection injection remains deterministic automated evidence. Supporting historical rows are validated fixture publications, not a claim that the inspector authored them or a storage performance benchmark.

## 11. Validation, bundle and files

Final complete suite: **163 files / 1,683 tests PASS**, including **30 new inspection cases**, in 80.30 seconds. Formatting, ESLint, TypeScript, production build, bundle policy and diff checks use unchanged repository gates. [Reproduction notes](evidence/task-9.28/REPRODUCTION_RESULT.md) retain commands and material intermediate failures/resolutions.

| Measure                          | Actual baseline |       Final | Delta / hard limit             |
| -------------------------------- | --------------: | ----------: | ------------------------------ |
| Test files / tests               |     162 / 1,653 | 163 / 1,683 | New permanent inspection suite |
| Initial raw JavaScript           |         626,034 |     626,896 | +862 / 685,000                 |
| Initial gzip JavaScript          |         163,993 |     164,266 | +273 / 170,000                 |
| Largest lazy chunk               |          62,657 |      62,657 | 0 / 100,000                    |
| Total JavaScript                 |       1,258,699 |   1,271,716 | +13,017                        |
| Initial gzip hard-limit headroom |           6,007 |       5,734 | −273                           |

Existing initial-gzip advisory 161,500 and total-JavaScript architecture-review advisory 825,000 remain exceeded and reported. All hard limits pass. No thresholds/dependencies changed. The focused inspector, renderer and readers stay lazy; navigation/context helpers contain no historical engine, storage or authority logic.

| Application/test file                   | Purpose                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `GoalRecordedInspection.tsx` (new)      | Lazy selected-Goal host, range/cutoff/refresh, independent reads, bounds and navigation        |
| `useGoalPresentationState.ts` (new)     | Lightweight owner-scoped ephemeral state, retaining captured draft revisions                   |
| `GoalRecordedInspection.test.tsx` (new) | Permanent semantic, race, reporting, navigation, protection and restore regressions            |
| `goalRecordedCanonicalFixture.ts` (new) | Canonical base plus validated linked/empty/legacy historical fixture                           |
| `DayFrameApp.tsx`                       | Lazy composition, public read surface, canonical-day callback, independent Summary handoff     |
| `GoalSection.tsx`                       | Inspector slot and stable existing Measurement/Observation command mounts                      |
| `GoalMeasurementSection.tsx`            | Existing editor state retained in ephemeral context                                            |
| `GoalProgressReportingSection.tsx`      | Existing observation draft/base/feedback retained without revision rebase                      |
| `GoalProgressSummary.tsx`               | Reused formatting, controlled provenance/identities, local reads and qualified rounded display |
| `GoalActivitySummary.tsx`               | Reused renderer with optional bounds/day links; retained Summary selection/disclosure          |
| `HistoricalIntelligenceSummary.tsx`     | Preserve independent Summary context and optional Goal handoff                                 |
| `goalAcceptedPlanningContext.ts`        | Separate inclusive Activity navigation cell; unchanged G2 cell                                 |
| `dayFrameUi.css`                        | Scoped reflow, practical targets, focus and errors                                             |

UI files are under `code/src/ui/`; test/fixture files under its `tests/` directory. [File manifest](evidence/task-9.28/FILE_MANIFEST_RESULT.md) enumerates every created/modified path, including this RESULT and all evidence. The input already existed and was preserved rather than rewritten. [Task-relative patch](evidence/task-9.28/task-relative-RESULT.patch) isolates the thirteen source/test files from the pre-existing dirty tree.

## 12. Persistence, compatibility and forensic preservation

No domain owner, query policy, schema, migration, serialization format, backup version, dependency, reporting authority or capability retirement changed. No historical record was normalized, retargeted or corrected automatically. Existing Summary and G2 readers/routes remain supported. Measurement/Observation writes still occur only through their existing explicit controls and canonical commands; the inspector cannot report, accept, realize, publish or complete anything.

Preservation inventory compares all 1,151 baseline files: **nine intended UI files modified, 1,142 unchanged, zero missing**. All earlier inputs, RESULTs, diagnostics, evidence and architecture documents remain byte-identical, including original blocked 9.27 and its accepted continuation. No reset, stash, commit, push, dependency installation or unrelated cleanup occurred. Preserved Dogfood Pass 02 state was never opened or modified. Tests/browsers used disposable fixtures, databases and origins. Artifacts are retained local working-tree evidence, not commits or remote backups.

## 13. Exclusions and final determination

This completes only the requested recorded-evidence inspection slice. It adds no measurement policy/unit conversion, observation semantics, Activity source-kind/coverage policy, combined G2/Activity/Progress ledger or total, historical Progress controls, historical Goal reconstruction, Progress bar/trend/streak/pace/forecast/score/recommendation, automatic completion/Milestone/Actual credit, Structure roll-up, new Goal lifecycle/recurrence/release/replacement/Found Time, recovery/abandonment authority or persistent drafts. It is not full Goals convergence.

No evidence-contract or architecture-decision stop condition was required. Existing contracts supply this bounded view, with their actual population and limitations explained rather than extended.

**Task 9.28 — Goal Recorded Progress & Activity Inspection V1 is COMPLETE.**
