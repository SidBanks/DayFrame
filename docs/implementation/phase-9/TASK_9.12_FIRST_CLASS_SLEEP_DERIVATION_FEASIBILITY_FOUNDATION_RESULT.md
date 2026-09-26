# Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation RESULT

## 1. Executive Summary

Implemented disposable First-Class Sleep occurrence derivation, full physical windows, authoritative blocking-context construction, a complete bounded minute-domain joint solver, typed resolution/conflict/incomplete results, and a lazy read-only store query. No Sleep authority model or persistence version changed.

The solver distinguishes a witnessed valid assignment, proved bounded infeasibility and deterministic search-budget exhaustion. It includes directly intersecting guard occurrences outside the requested owner horizon. Preview, Capacity, Goal planning, Friction, publication, Today and execution do not consume these results.

## 2. Scope and Governing Architecture

This implements the Authored → Derived portion of [Task 9.10](TASK_9.10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION_RESULT.md) using the completed Task 9.11 foundation. It does not create Accepted, Published, Execution or Historical Sleep authority. Task 9.10 sections 10 and 27 supply the exact clock, Work-anchor, minute precision, timezone and finite horizon-plus-guards contracts used here.

The result is a feasibility assessment of a stated finite problem. It is neither an infinite-recurrence proof nor a new accepted schedule. No automatic conversion, shortening, omission or override exists.

## 3. Pre-Implementation Repository State

HEAD was `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. The working tree already contained Task 9.8B/9.9/9.11 implementation and Task 9.10/9.11 architecture/result artifacts. The user had renamed the prior result to `TASK_9.11_FIRST_CLASS_SLEEP_DOMAIN_PERSISTENCE_FOUNDATION_RESULT.md`; that file was preserved.

Before changes, 882 repository files were copied to `/tmp/dayframe-912-baseline/`, with file inventory and status in `/tmp/dayframe-912-files.json` and `/tmp/dayframe-912-status.txt`. Task-specific accounting compares against that captured working tree, not just HEAD. Three existing dirty files receive additions: `physicalOccupancy.ts`, `dayFrameStore.ts` and `types.ts`. Earlier implementations and artifacts remain intact. No commit or push occurred.

## 4. Current Temporal / Work Ownership Trace

| Production owner                                                               | Contract consumed or inspected                                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `time/canonicalUserDay.ts`                                                     | Label arithmetic, effective boundary starts, adjacent-label windows, instant ownership and week-start resolution. Windows can change duration across boundary overrides. |
| `time/userDay.ts`                                                              | Canonical clock parsing and local-date formatting; local JavaScript Date interpretation.                                                                                 |
| `cycles/resolveEffectiveSchedulePreferences.ts` and `getActiveShiftSegment.ts` | Per-label segment/cycle boundary and week-start overrides; no independent Sleep override resolver.                                                                       |
| `cycles/generateCycleWorkBlocks.ts`                                            | Manual-segment and repeating-sequence generation, canonical Work owner labels and runtime Work identity.                                                                 |
| `shifts/generateWorkBlocks.ts`                                                 | Actual local start/end geometry, overnight continuation and elapsed physical intervals.                                                                                  |
| `occurrences/durableOccurrenceReference.ts`                                    | Work/template source lifetimes and exact accepted-decision targets.                                                                                                      |
| `blocks/generateBlockCandidates.ts`                                            | Existing recurrence owner coordinates for authored fixed sources; not used to generate Sleep.                                                                            |
| `decisions/replayPlanDecisions.ts`                                             | Applicability, retained exact accepted placement, duration/priority/omission replay. Pins can target occurrences whose original owner is outside the query.              |
| `time/physicalOccupancy.ts`                                                    | Shared sorted occupied-window/complement primitives, extended with explicit foundational authority classification.                                                       |
| `planning/commitmentComposition.ts`                                            | Fixed-parent support and protection projection and relationship validation.                                                                                              |
| `planning/realizedScheduleIdentity.ts`                                         | Validated immutable productive/support/protection facts and origin lineage.                                                                                              |
| `engine/generateSchedulePreview.ts`                                            | Inspected manual-event civil/all-day convention, candidate placement, Friction and range expansion; not called to derive Sleep.                                          |
| `state/dayFrameStore.ts`                                                       | Complete active, decision, composition and realization snapshots; protected/loading/transaction admission.                                                               |

Existing tests located and exercised include canonical user-day/boundary, cycle generation, Work-relative footprint, pre-migration physical occupancy, candidate generation, realized identities, composition, Capacity, occurrence references and publication/execution regression suites. Generic greedy placement and corrective movement were inspected but not reused as feasibility proof.

## 5. Task 9.11 Foundation Consumed

Reuses `SleepRequirementV1`, its strict revision collection validator and `queryEffectiveSleepRequirement`, `SleepWindowIntentV1`, `SleepOccurrenceReferenceV1`, the canonical source-incarnation graph and Active V3 validation. A source remains one lifetime with revisioned intent. No `SleepRequirementV2`, shadow BlockTemplate, new persistence key, or profile/backup schema successor was introduced. Active V3, Profiles V3 and Backup V13 remain current.

## 6. Required Sleep Occurrence Model

`SleepOccurrenceV1` contains version, durable reference, effective revision, owner label, requested/guard membership, exact duration, both protection buffers, copied authored window intent and explicit derivation context. It represents a required obligation, not a selected interval. It is newly derived for each query and is never written into active state.

## 7. Occurrence Identity Preservation

Identity remains requirement ID/incarnation + canonical owner label + slot zero. Duration, revision, Day Boundary, Work/cycle/segment anchor, window and selected geometry are provenance/dependencies. Tests change revision, duration, boundary and Work-relative mode without changing the same-owner reference. The domain solver rejects duplicate references rather than crediting the same identity twice.

## 8. Owner-Day Derivation

For each candidate owner label, `queryEffectiveSleepRequirement` remains the applicability owner. Effective intent derives exactly one occurrence; disabled, not-applicable and unconfigured labels derive none. Invalid intent is not absence. The occurrence's owner is never recomputed from its physical start or end.

A bounded resolution with no selected occurrences reports `notConfigured` when no requirement exists, otherwise `notApplicable`. Guard requirements can make the bounded problem nonempty even when no requested label itself is applicable; membership is explicit in every occurrence and conflict.

## 9. Sleep Derivation Context

`SleepDerivationContextV1` records the canonical owner window, current/next boundary clocks, week start, same-owner Work references and exact intervals, selected Work anchor if applicable, off-day status, window provenance, full physical window and preferred Sleep start. Work references carry cycle, entry/segment and shift-definition lifetimes.

It also records the effective timezone name, endpoint UTC offsets and `localDate-compatible-earlier-fold-forward-gap` policy. Exact ISO physical windows plus these context fields enter the dependency fingerprint. No context field becomes authored authority or occurrence identity.

## 10. Clock-Window Derivation

The start clock expands on the owner's civil label; a clock earlier than that owner's effective boundary expands on the next civil date. The end is the first strictly later occurrence of the end clock. Equal clocks therefore span a full civil day, not zero minutes. Overnight geometry remains continuous.

Optional preferred start expands on the same clock-window cycle and is clamped to the legal activity-start domain for ranking only. Without a preference, ranking starts at the earliest footprint-fitting activity time. The entire activity plus buffers must fit the physical window. A dated 23-hour civil window can legitimately fail a 24-hour exact-duration requirement.

## 11. Work-Relative Derivation

`beforeWork` produces `[anchorStart − span, anchorStart)`, preferring activity end at anchor start minus after-buffer. `afterWork` produces `[anchorEnd, anchorEnd + span)`, preferring activity start at anchor end plus before-buffer. Spans and durations are elapsed minutes.

No same-owner Work means the explicit `offDay` clock fallback. No neighboring Sleep placement, shift title, nominal calendar rendering or preceding offset is used as authority. Every Work interval remains a blocker, including Work with another owner label.

## 12. Work Anchor Selection

The rule is exactly Task 9.10 section 10: earliest actual start among same-owner Work for `beforeWork`; latest actual end among same-owner Work for `afterWork`. Ties use canonical durable Work reference ordering. Work insertion order cannot affect either context ordering or anchor selection.

Tests include two Work occurrences sharing a user-day: a 23:00–07:00 occurrence and next-civil-date 02:00–04:00 Work. BeforeWork selects 23:00; AfterWork selects 07:00, not merely the end of whichever Work started last. Reversing Work input preserves the result.

## 13. Cycle / Segment Transition Semantics

Each owner label independently resolves its effective boundary/week preferences and Work context, followed by a joint solve against all generated Work. Tests cover Day→Evening, Evening→Night and Night→Day manual-segment transitions, boundary/week-start overrides, and Work→Off→Work repeating sequences. Off days use fallback; no transition-specific shortening or propagation rule exists.

A transition can be feasible or genuinely incompatible according to full physical domains. Tests distinguish those outcomes from invalid/missing context. Passing these synthetic cases does not explain or claim reproduction of the historical dogfood October incidents.

## 14. Physical Search Domain

Each selected occurrence has one complete finite footprint window: the expanded civil clock window or an elapsed Work-relative span of at most 4,320 minutes. Activity start instants are constrained only by footprint fit and authoritative occupancy, not containment in the owner's user-day.

Supported requests contain 1–366 owner labels. Larger requests return `contextIncomplete` with the stated query limit rather than silently clipping or proving infeasibility. Let `S` be the maximum Work-relative span across the validated source's revisions, and `P = ceil(S / 1440) + 6` civil labels. Candidate guard owners are enumerated in `[H.start − P, H.end + P)`. The six-label allowance conservatively covers owner-to-next-civil-date carry, overnight Work/clock end carry and timezone-offset differences under the checked ±24-hour offset bound; it is not a one-day view pad.

Work is generated over that label search interval expanded by another P on each side. Full selected windows must be contained in this coverage or the query returns `contextIncomplete`. Offsets outside the supported bound and unresolvable canonical temporal contexts are not guessed. The guard predicate itself uses exact physical intersection, so excess conservative label enumeration does not add unrelated variables.

## 15. Sleep Footprint Semantics

The activity has exactly the authored elapsed duration. Footprint is `[sleepStart − beforeBuffer, sleepEnd + afterBuffer)`. Both sides must fit the valid window and avoid hard occupancy. Buffers are protection, not Sleep activity/execution. Two Sleep footprints cannot overlap; there is no implicit coalescing, shared credit or inferred minimum waking interval. Exact adjacency is legal, including an after-buffer ending exactly at Work start.

## 16. Foundational Blocking Geometry

The context adapter derives Work from authored cycles, manual Events from their canonical existing time convention, fixed Commitments from recurrence coordinates, and accepted exact geometry through canonical decision replay. It reads validated realized productive/support/protection facts and projects locked-parent composition through the existing composition owner. No Preview scheduled-block list supplies authority.

Timed manual Events retain their existing civil-date clock convention; all-day Events use the canonical user-day window. Fixed Commitment clocks retain their existing boundary-relative expansion. These pre-existing distinctions are preserved rather than standardized inside Sleep.

Hard Commitments are enumerated with additional context reach covering twice the maximum template footprint, all authored attachment offsets/gaps/buffers and accepted composition offset deltas, plus civil boundary context. Accepted placement targets are also enumerated at their original occurrence coordinates so a far-away target moved into the query cannot be lost. Geometry is included by actual physical intersection, never clipped to the query.

## 17. Blocking-Authority Classification

The shared `physicalOccupancy.ts` owner now exports `PhysicalAuthorityV1`, `FoundationalOccupancyV1` and `constrainsFoundationalFeasibility`. Existing occupancy/complement functions retain their behavior.

| Existing Geometry                       | Constrains Sleep Feasibility in 9.12?   | Why                                         | Canonical Owner                             |
| --------------------------------------- | --------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| Work                                    | Yes                                     | Foundational exact activity                 | Cycle/Work generator + durable reference    |
| Locked Commitment                       | Yes                                     | Fixed authored or exact accepted geometry   | Candidates / decision replay                |
| Flexible Commitment                     | No                                      | Ordinary movable projection                 | Existing placement, unchanged               |
| Manual fixed Event                      | Yes                                     | Authored exact interval                     | Active manual-event semantics               |
| Goal Proposal                           | No                                      | No physical authority                       | Proposal owner                              |
| Accepted Allocation without realization | No                                      | Accepted liability, not physical occupancy  | Proposal/acceptance owner                   |
| Realized Goal work                      | Yes                                     | Immutable fixed accepted geometry           | Realized schedule fact owner                |
| Support Activity                        | Yes when realized or fixed-parent bound | Activity belongs to existing hard footprint | Realization / composition                   |
| Protected Buffer                        | Yes when part of hard footprint         | Protection excludes time without execution  | Numeric buffers / realization / composition |
| Preview-only placement                  | No                                      | Disposable ordinary placement               | Preview owner, not an input                 |

There is no separate free-standing “locked” boolean in the current template model. Fixed authored placement, accepted exact placement, manual Events and locked-parent composite geometry are the concrete existing hard authorities. Duration/priority acceptance alone does not turn flexible placement into hard geometry.

## 18. Joint Sleep Solver

`solveRequiredSleep` enumerates every minute-aligned legal start in the shared occupancy complement, then searches joint assignments with iterative depth-first backtracking. Occurrences are ordered by owner label/reference. Every attempted placement is checked against all currently assigned Sleep footprints. It can revisit a broad earlier choice after a later narrow requirement fails.

The search retains no accepted or published placement. Selected intervals are only a witness for this finite derived problem. Unsolved results never expose partial assignments as satisfaction.

## 19. Candidate Generation and Ordering

For each open physical interval, the first candidate is the first minute-aligned activity start whose before-buffer fits; the last is the final activity start whose duration and after-buffer fit. Every physical minute in that closed start domain is enumerated. Overlapping blockers are handled by the shared sorted occupied-window complement.

Candidates rank by absolute distance from the derived preferred activity start, then earlier physical start. Occurrence order uses owner label, then canonical reference. The first complete assignment is the deterministic lexicographically preferred feasible assignment under that ordering; this is not a global sum-of-preference-distance optimizer.

## 20. Search Granularity

The grid is explicit: one physical elapsed minute, using `MINUTE = 60_000`. Authored integer duration and buffers are never rounded or shortened. Local clock expansion follows the repository's JavaScript Date convention: earlier repeated clock instance, nonexistent clock advanced by the gap. Physical start enumeration can traverse both repeated-hour instances. Windows and chosen intervals are ISO instants; timezone interpretation is in context.

## 21. Solver Completeness Contract

For the supported finite H-plus-guards problem, completeness means all applicable selected occurrences, their full minute start domains, all authoritative hard geometry and all mutual Sleep footprint conflicts are represented. A returned assignment is an explicit full witness. A domain proved empty is a valid immediate unsatisfiability proof. Otherwise `jointExhaustion` is returned only when every candidate combination has been eliminated.

Backtracking is exhaustive over the representable finite domains; it does not prune based on greedy failure. No proof is claimed if enumeration or search stops at the work budget. The proof concerns this finite owner/guard set and complete input snapshots only. It does not recursively expand an infinite chain of adjacent requirements or authorize future publication across independently solved horizons.

## 22. Deterministic Search Budget

Default limit: **1,000,000 work units**. A unit is one legal physical start admitted during domain enumeration or one candidate assignment attempted during joint search. Caller override is an integer 0–10,000,000. Invalid budgets return `invalid`.

Exhaustion is checked before the next unit. Diagnostics include limit, consumed units, candidate starts examined/admitted, candidate count, search nodes, required occurrence count and phase (`candidates`, `jointSearch`, `complete`). Empty-domain proofs can require no assignment search. Context construction/validation is outside this search-unit accounting; wall-clock time never changes result classification.

## 23. Sleep Resolution Model

`SleepResolutionV1` explicitly distinguishes `notConfigured`, `notApplicable`, `satisfied`, `infeasible`, `searchIncomplete`, `invalid`, `protected` and `contextIncomplete`. Proof-bearing/search-bearing results include owner range, selected required occurrences with requested/guard membership, full physical context envelope, dependency fingerprint and search diagnostics.

Invalid authored/derived input, duplicate references, malformed geometry and invalid budgets do not become physical infeasibility. Protected/loading/transaction state does not become neutral absence. No result includes “remaining allocatable Capacity.”

## 24. Scheduled Sleep Occurrence Model

`ScheduledSleepOccurrenceV1` combines the required occurrence with `sleepStart`, `sleepEnd`, `footprintStart`, `footprintEnd` and placement provenance containing the solver policy and dependency fingerprint. Activity duration and buffer quantities remain explicit. “Scheduled” here names solved derived geometry, not accepted realization, publication, execution eligibility or a durable record.

## 25. Sleep Feasibility Conflict Model

`SleepFeasibilityConflictV1` contains `emptyPhysicalDomain`, `blockedPhysicalDomain` or `jointExhaustion`; affected references, owner labels, revisions, requested/guard membership, full windows and required footprint minutes; hard blockers with source references and activity/protection semantics; proof owner range; and dependency fingerprint.

Joint conflicts conservatively include the searched occurrence set and relevant context blockers, not a claimed minimal unsatisfiable core. They contain semantic evidence rather than UI copy or corrective authorization. No general Friction record is created.

## 26. Search-Incomplete Model

`searchIncomplete` has reason `deterministicBudgetExhausted`, the owner/physical scope, complete selected obligation metadata, dependency fingerprint and counters showing the deterministic stopping phase. It has no solved `occurrences` payload. Tests exhaust during both enumeration and joint search and verify that permutation and repeated calls reproduce the same incomplete result. It never becomes `satisfied` or `infeasible` merely to end computation.

## 27. Planning-Horizon Edge Semantics

H is an owner-label range. Its canonical instant envelope determines the guard predicate, not a clipping wall. Applicable outside labels whose full valid windows intersect that envelope become guard variables; requested labels remain variables even when their legal geometry lies outside the envelope. All selected variables retain full domains, and hard occupancy covers their union's envelope.

The guard set is finite and nonrecursive as specified by Task 9.10. Guard-only incompatibility names the outside owner. Extending H defines a different problem/fingerprint and may reposition unpublished choices. A view of an existing solution should be projected from that result rather than treated as a new optimization. Published-Sleep guard pinning remains deferred because no first-class published Sleep schema exists.

## 28. Determinism and Idempotence

Queries allocate no source IDs, append no revisions, invoke no current-time preference, and mutate neither source arrays nor accepted facts. Canonical sort order is applied to occurrences, Work context, blockers, composition relationships/decisions and sources. Existing identity and effective revision selection are reused.

Tests permute Work, occurrence and blocker arrays, repeat calls, compare authored snapshots and stored backup payloads, and verify no local-storage writes. Fingerprints include semantic context and timezone interpretation. UUID generation occurs only in fixture/source authoring, never in derivation or search.

## 29. Store / Query Integration

Pure entry point: `resolveRequiredSleep({ authoredState, ownerRange, authority, budget? })`. `authority` explicitly declares complete/protected/incomplete coverage and supplies canonical accepted-decision, realization and composition snapshots. It is not a bag of arbitrary Preview blocks. Helpers separate occurrence context, hard occupancy and joint solving.

`DayFrameStore.resolveRequiredSleep({ ownerRange, budget? })` lazily imports the query, checks startup/runtime transaction and protected active/decision/composition/realization state, and captures current canonical snapshots after loading. Loading or quarantined accepted-decision authority cannot silently supply an empty complete context. No new surface writer, cache, persistence key or schema version exists.

## 30. Scheduling Non-Activation Verification

The integrated store fixture generates Preview before authoring Sleep, resolves Sleep successfully, regenerates Preview with identical inputs and compares the complete Preview result. It remains equal. No First-Class Sleep block enters candidate generation or placement. No existing operational scheduler file was changed by Task 9.12. Full legacy regression suites remain intact.

## 31. Capacity / Goal Non-Activation Verification

The integrated fixture includes an authored Goal demand with explicit productive-only footprint and priority. Before/after comparisons cover Capacity, Goal-specific feasibility, competing allocation and nonempty Proposal derivation. These results are unchanged after Sleep authoring and resolution. Backup equality around the query proves no accepted allocation or realization authority was written; their existing suites remain passing coverage. The new query reads realized facts but never mutates or generates them.

## 32. Friction / Suggested Fix Non-Activation Verification

Complete Preview equality includes current Friction points and Suggested Fix payloads. Neither implementation owner imports the new query. `SleepFeasibilityConflictV1` is confined to the derived Sleep result; no correction proposal, omit/shorten action or accepted Sleep decision is constructed. Existing Friction and Suggested Fix regression tests continue to run in the full suite.

## 33. Publication / Execution Non-Activation Verification

Successful publication materialization is compared before/after the new query; equality is not merely two failure statuses. Today query results remain equal. Full backup snapshots before/after the query preserve decisions, accepted/realized data, publication batches, execution and other historical authorities. Existing publication/execution/Today/Summary suites provide downstream regression coverage. No such consumer, schema or version was changed.

## 34. Legacy Sleep Coexistence

Only explicit validated SleepRequirement revisions derive obligations. A legacy `default_sleep` template alone yields `notConfigured`. With both families present, a movable legacy template does not block required Sleep; fixed legacy geometry can block because it is fixed, not because its title/category says Sleep. Legacy sources are not retired, promoted, hidden or rewritten. Existing legacy scheduling remains active and unchanged; the new result remains disconnected from it.

## 35. Derived-State Matrix

| Object                     | Authority Layer    | Persisted?                                      | Stable Identity?                                | Geometry?                         | Consumer in 9.12           |
| -------------------------- | ------------------ | ----------------------------------------------- | ----------------------------------------------- | --------------------------------- | -------------------------- |
| SleepRequirementV1         | Authored           | Existing Active V3 / profile / backup contracts | Source lifetime and revision                    | Intent, not selected interval     | Applicability/derivation   |
| SleepOccurrenceReferenceV1 | Identity primitive | No new operational record store                 | Lifetime + owner day + slot                     | No                                | Derivation/solver evidence |
| SleepOccurrenceV1          | Derived            | No                                              | Canonical reference                             | Required domain/context           | Joint solver               |
| SleepDerivationContextV1   | Derived provenance | No                                              | Dependency fingerprint, not occurrence identity | Full window and Work context      | Solver/explanation         |
| Sleep physical candidate   | Derived            | No                                              | No new durable identity                         | Exact possible activity/footprint | Joint search               |
| ScheduledSleepOccurrenceV1 | Derived witness    | No                                              | Retains canonical reference                     | Selected exact activity/footprint | Read-only query caller     |
| SleepFeasibilityConflictV1 | Derived evidence   | No                                              | Fingerprint/proof scope                         | Domains and blockers              | Read-only query caller     |
| SleepResolutionV1          | Derived result     | No                                              | Problem fingerprint                             | Witness/evidence as appropriate   | Read-only query caller     |

## 36. Derivation Matrix

| Window Intent | Work Present?                      | Anchor                                                  | Off-Day Fallback? | May Cross Midnight? | May Cross Day Boundary? | Deterministic Owner |
| ------------- | ---------------------------------- | ------------------------------------------------------- | ----------------- | ------------------- | ----------------------- | ------------------- |
| clock         | Irrelevant to window; still blocks | Owner civil clock cycle                                 | No                | Yes                 | Yes                     | Applicable label    |
| beforeWork    | Same-owner Work or none            | Earliest actual same-owner start; durable-reference tie | Yes if none       | Yes                 | Yes                     | Applicable label    |
| afterWork     | Same-owner Work or none            | Latest actual same-owner end; durable-reference tie     | Yes if none       | Yes                 | Yes                     | Applicable label    |

## 37. Feasibility Matrix

| Scenario                                     | Required Occurrence Exists? | Valid Physical Domain?                      | Solver Outcome                          | Why                             |
| -------------------------------------------- | --------------------------- | ------------------------------------------- | --------------------------------------- | ------------------------------- |
| No requirement                               | No                          | None                                        | notConfigured                           | No inferred biological default  |
| Disabled requirement                         | No for disabled labels      | None for those labels                       | notApplicable if selected set empty     | Applicability is authored       |
| Non-applicable weekday                       | No for excluded label       | None for that label                         | notApplicable if selected set empty     | No fallback to another revision |
| Valid clock window                           | Yes                         | Expanded civil window                       | satisfied when full joint witness found | Full footprint fits             |
| Valid beforeWork                             | Yes                         | Exact anchored span                         | satisfied when full joint witness found | Actual Work start used          |
| Work-relative off day                        | Yes                         | Explicit fallback                           | satisfied when full joint witness found | No anchor invention             |
| Preferred start blocked but alternate exists | Yes                         | Contains alternate                          | satisfied                               | Preference is soft              |
| All legal placements blocked                 | Yes                         | Authored window, empty admissible start set | infeasible                              | Complete domain eliminated      |
| Joint greedy trap with valid assignment      | Yes                         | Interacting domains                         | satisfied                               | Backtracks earlier choice       |
| Search budget exhausted                      | Yes                         | Partially enumerated/explored               | searchIncomplete                        | No complete proof               |

## 38. Blocking Matrix

| Geometry Source     | Owns/Protects Time?      | Blocks Sleep Solver?            | May Solver Move It? | Why                                                |
| ------------------- | ------------------------ | ------------------------------- | ------------------- | -------------------------------------------------- |
| Work                | Owns                     | Yes                             | No                  | Foundational actual geometry                       |
| Locked Commitment   | Owns                     | Yes                             | No                  | Fixed/accepted exact authority                     |
| Flexible Commitment | Movable derived activity | No                              | No                  | Later ordering task owns movement                  |
| Manual fixed Event  | Owns                     | Yes                             | No                  | Authored exact geometry                            |
| Goal Demand         | No                       | No                              | No                  | Desired work, not occupancy                        |
| Proposal            | No                       | No                              | No                  | Proposed geometry is not accepted reality          |
| Accepted Allocation | Liability until realized | No while unrealized             | No                  | Preserve acceptance without promoting to occupancy |
| Realized Goal work  | Owns                     | Yes                             | No                  | Immutable realized physical fact                   |
| Support Activity    | Owns when hard/realized  | Yes when hard/realized          | No                  | Bound to existing authoritative footprint          |
| Protected Buffer    | Protects                 | Yes when part of hard footprint | No                  | Non-executable exclusion                           |
| Preview-only block  | Derived movable geometry | No                              | No                  | Preview does not own foundation truth              |

## 39. Result-State Matrix

| State             | Meaning                                  | Proof Level                            | May Downstream Treat Sleep as Satisfied?                     | May Future Capacity Be Computed?                         |
| ----------------- | ---------------------------------------- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| notConfigured     | No authored requirement                  | Validated absence                      | No claim of biological satisfaction                          | Future policy may compute without inferred Sleep         |
| notApplicable     | No selected applicable obligation        | Applicability result                   | No obligation asserted for this scope                        | Future policy may compute for validated empty scope      |
| satisfied         | Complete joint assignment                | Explicit witness                       | Future integration only, with matching dependencies/coverage | Future rule: yes with solved exclusions; unchanged today |
| infeasible        | No assignment in complete bounded domain | Empty-domain or exhaustive joint proof | No                                                           | Future rule: affected result nonallocatable              |
| searchIncomplete  | Work budget stopped proof                | Unknown, counters retained             | No                                                           | Future rule: no allocatable result inferred              |
| invalid/protected | Input cannot be trusted                  | No feasibility proof                   | No                                                           | Future rule: no trusted computation                      |
| contextIncomplete | Required context unavailable/unsupported | No feasibility proof                   | No                                                           | Future rule: no allocatable result inferred              |

No row changes current Capacity in Task 9.12.

## 40. Behavioral Invariants

| Task invariant numbers                                                                                                       | Implementation/evidence                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1–8: explicit source, no promotion, unique owner identity, stable revision/geometry identity, disposable/nonpersisted result | Domain/context model, legacy coexistence and identity tests; no new writer                           |
| 9–16: midnight/boundary/full-day, actual Work/fallback and complete edges                                                    | Clock/boundary, offset, anchor, guard and narrow-query tests                                         |
| 17–25: complete footprint and correct hard-authority classification                                                          | Shared complement/authority classifier, exact adjacency, fixed/manual/pin/realized/composition tests |
| 26–33: joint search, no greedy/preference proof shortcut, deterministic budget and distinct incomplete                       | Adversarial traps, independent oracle, true exhaustion and budget tests                              |
| 34–38: determinism, permutation, no mutation/IDs/writes                                                                      | Repeated domain/store calls, array permutations, snapshots and write spy                             |
| 39–43: no Capacity/Goal/Friction/publication/execution activation                                                            | Integrated downstream comparisons, backup equality and existing full suites                          |
| 44–49: no omit/shorten/override/conversion/second persistence owner; legacy unchanged                                        | No such payload/workflow added; baseline-relative source review and legacy suites                    |
| 50: satisfied/infeasible/searchIncomplete distinct                                                                           | Discriminated result union and direct assertions                                                     |

## 41. Adversarial Solver Coverage

Explicit broad-earlier/narrow-later and preferred-start traps require revisiting the earlier candidate. Both return a full witness after more than one attempt per variable. A genuine overlapping-domain impossibility returns `jointExhaustion`. An independent brute-force oracle enumerates all assignments for 100 small two-job domain/duration combinations and agrees with solver satisfiable/infeasible classification. Duplicate identity cannot produce double credit.

## 42. Boundary / Midnight Coverage

Tests cover boundaries 00:00, 03:00 and 12:00; windows 22:00–06:00, 23:00–07:00 and 00:00–08:00; equal endpoints; and exact footprint adjacency. America/Chicago spring/fall tests explicitly verify timezone interpretation: 23-hour full civil day rejects 1,440 elapsed minutes; the 25-hour case has 61 legal starts for that exact duration. A Pacific/Apia skipped-civil-label case reports `contextIncomplete` rather than invalid intent or infeasibility. The tests restore the prior timezone environment after execution.

## 43. Work-Relative Coverage

Day 09:00–17:00, Evening 15:00–23:00 and Night 23:00–07:00 cases exercise before/after anchors and both buffers. Next-civil-date 02:00 Work under a noon boundary remains visible to the preceding owner query. Off-day fallback is explicit. Multiple same-owner Work and reversed Work arrays test earliest-start/latest-end semantics separately from nominal shift labels.

## 44. Transition Coverage

Manual Day→Evening, Evening→Night and Night→Day cases assert valid solved/proved outcomes and effective next-segment boundary/week-start provenance. Repeating sequences assert Work→Off→Work window provenance. Work is regenerated for the physical context, so no previously placed Sleep offset is carried across a transition. Existing cycle/canonical-day transition suites provide additional regression coverage.

## 45. Blocking-Authority Coverage

Tests prove flexible legacy Sleep does not block while fixed legacy Sleep does; manual timed/all-day Events block; a blocked preference with a valid alternative succeeds; and an exact accepted pin can constrain Sleep even when its original target owner lies far outside H. Canonically validated realized productive, support and protection facts preserve their lineage in conflict evidence. A fixed-parent composite supplies real support and a protected buffer via the existing projector. Low-authority proposal, demand, unrealized allocation and Preview categories are excluded by the shared classifier.

## 46. Range-Edge Coverage

A previous-owner overnight guard is retained at the first edge; final selected Sleep extends beyond the requested end's civil midnight. A next-civil-date Work anchor is found outside a narrow owner-label range. Guard-only infeasibility names the outside owner and retains its full window. Physical coverage checks prevent a successful claim with truncated Work context. The query does not recursively solve an infinite connected component.

## 47. Search-Budget Coverage

Budgets 0, 1, 7 and 8 exercise enumeration and joint-search stopping points in an adversarial problem. Consumed budget equals the specified limit on exhaustion, repeated/permuted calls match, and incomplete output has no solved occurrences. Invalid negative budgets are rejected. The default budget is exercised on 7-, 31- and 90-day scenarios, with a separate 366-day maximum-range measurement.

## 48. Legacy Regression Assessment

No Task 9.12 edits modify current placement, Work generation, accepted-decision semantics, Capacity, Goal planning, Friction, Suggested Fix, publication, Today or execution implementations. Earlier dirty changes in those files remain baseline-identical. Existing Task 9.11 persistence and identity tests and legacy Sleep/Work-relative/physical occupancy tests pass alongside new tests.

Initial new-test failures were invalid test fixtures (fixed templates carrying flexible-only window fields, all-day Events retaining timed fields, composition timestamps lacking canonical milliseconds) and a constructive fixture missing explicit productive-only footprint selection. Those fixtures were corrected through existing contracts; production validators and downstream behavior were not weakened.

## 49. Performance Assessment

Performance is observational only. A temporary emitted build was measured with `node /tmp/dayframe-912-benchmark.mjs`, one warm-up and five samples per range, complete daily 09:00–17:00 Work, seven-hour Sleep, 30-minute buffers and a nine-hour beforeWork span. The finite guard rule adds one occurrence in these fixtures.

| Requested days | Selected occurrences | Candidate count | Joint attempts | Work units | Outcome   | Final median ms |
| -------------- | -------------------: | --------------: | -------------: | ---------: | --------- | --------------: |
| 7              |                    8 |             488 |              8 |        496 | satisfied |            4.05 |
| 31             |                   32 |           1,952 |             32 |      1,984 | satisfied |            9.51 |
| 90             |                   91 |           5,551 |             91 |      5,642 | satisfied |           26.50 |
| 366            |                  367 |          22,387 |            367 |     22,754 | satisfied |          156.56 |

Final five-sample maxima were 9.61, 15.82, 30.86 and 159.62 ms respectively. Measurements include the final validation guards. Candidate enumeration grows with total legal start-domain size; mutually competing windows can require exponential assignment search. The explicit budget returns unknown rather than weakening domain completeness. No wall-clock limit or performance assertion changes semantic results. The query is lazy-loaded to avoid placing solver code in initial product startup.

## 50. Architecture Governance Assessment

No new ADR or architecture version is needed. Task 9.10 already specifies the representation, Work-anchor selection, clock interpretation, full-footprint semantics, complete bounded joint solve and finite guard rule. This RESULT records concrete implementation details: minute-start ordering, supported 366-label request bound, conservative context expansion and deterministic work-unit limit. Task 9.11 governance remains unchanged; no representation decision was reopened.

## 51. Test Coverage

Four new test files add 48 cases covering domain/solver/authority/offset/query behavior: `sleepDerivation.test.ts`, `sleepOccupancy.test.ts`, `sleepOffset.test.ts` and `sleepResolutionQuery.test.ts`. They supplement the unchanged requirement/identity and persistence lifecycle suites. Focused tests also run Work/cycle/time, ordinary Work-relative physical occupancy, candidate generation, realization, composition and Capacity owners.

The store integration uses real canonical store initialization and fake IndexedDB, creates demand/footprint/priority through production commands, successfully resolves Sleep, and compares nonempty constructive proposal derivation as well as successful publication materialization. Existing full backup equality verifies no other authority is changed by the query.

## 52. Validation Record

Commands run from `code/`, except root Git checks:

- `npm run format`: passed using the repository script; baseline comparison checks unrelated files.
- `npm run lint`: passed.
- `npm run build`: passed, including `tsc --noEmit` and Vite production build.
- `npm run check:bundle`: passed without threshold changes; initial gzip 166,973 bytes against hard limit 170,000. Advisory headroom (161,500) and total-output (825,000) warnings remain; total output 1,044,768 bytes.
- `npm test -- src/core/sleep src/state/sleepResolutionQuery.test.ts src/core/time src/core/cycles src/core/engine/tests/workRelativeFootprint.test.ts src/core/engine/tests/preMigrationCorrectness.test.ts src/core/blocks/tests/generateBlockCandidates.test.ts src/core/planning/realizedScheduleIdentity.test.ts src/core/planning/commitmentComposition.test.ts src/state/capacitySurface.test.ts src/state/realizationSurface.test.ts src/state/sleepFoundation.test.ts src/core/occurrences`: 20 files, 214 tests passed.
- `npm test`: **134 files, 1,260 tests passed**, final run 45.49 seconds.
- `npx tsc --noEmit false --rewriteRelativeImportExtensions --outDir /tmp/dayframe-912-compiled`, then `node /tmp/dayframe-912-benchmark.mjs`: emitted temporary code for performance measurement; no repository build artifact added.
- Root `git diff --check`, final status/stat inspection and baseline-relative file review: passed. All 13 Task 9.12 files are accounted for; unrelated baseline files remain unchanged.
- Prettier check on the 12 Task 9.12 code files and the new RESULT: passed.

Temporary logs are `/tmp/dayframe-912-*.log`; they are execution evidence, not extra repository task reports. Counts and measurements above are from completed commands.

## 53. Changed Files

Paths are repository-relative. All rows have **no persisted behavior/schema change**. D = new derivation/solver tests, O = occupancy tests, T = offset tests, Q = store query tests; existing suites are additionally covered by full validation.

| File                                                                                                          | Classification                                   | Purpose / semantic change                                                                           | Authority impact                        | Persisted behavior changed? | Tests                            |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------- | -------------------------------- |
| `code/src/core/sleep/sleepResolution.ts`                                                                      | Domain                                           | Required/solved/context/conflict/result contracts                                                   | Derived only                            | No                          | D/O/T/Q                          |
| `code/src/core/sleep/deriveSleepOccurrences.ts`                                                               | Derivation / Temporal Context / Work Integration | Applicability, clocks, anchors and full physical domains                                            | Reads canonical authored/Work authority | No                          | D/T                              |
| `code/src/core/sleep/sleepFoundationalOccupancy.ts`                                                           | Occupancy / Work Integration                     | Authoritative source adapter, fixed/accepted/manual/realized/composite geometry                     | Read-only classification/projection     | No                          | D/O/Q                            |
| `code/src/core/sleep/solveRequiredSleep.ts`                                                                   | Solver                                           | Exhaustive finite minute domains and budgeted joint search                                          | Derived witness/proof/unknown           | No                          | D/O/T                            |
| `code/src/core/sleep/resolveRequiredSleep.ts`                                                                 | Query / Derivation                               | Complete snapshot validation, H-plus-guards and physical coverage                                   | Read-only derived query                 | No                          | D/O/T/Q                          |
| `code/src/core/time/physicalOccupancy.ts`                                                                     | Occupancy                                        | Reusable foundational authority classification added to existing geometric owner                    | Existing geometric functions unchanged  | No                          | D/O and legacy physical tests    |
| `code/src/state/dayFrameStore.ts`                                                                             | Store / Query                                    | Lazy read-only Sleep query and protection/admission                                                 | Reads existing surfaces only            | No                          | Q / full store suites            |
| `code/src/state/types.ts`                                                                                     | Store / Query                                    | Typed async query API                                                                               | No authored type replacement            | No                          | Typecheck/Q                      |
| `code/src/core/sleep/sleepDerivation.test.ts`                                                                 | Test                                             | Applicability, clocks, anchors, transitions, guards, adversarial/oracle/budget/permutation coverage | None                                    | No                          | D                                |
| `code/src/core/sleep/sleepOccupancy.test.ts`                                                                  | Test                                             | Realized productive/support/protection and fixed composition fixtures                               | None                                    | No                          | O                                |
| `code/src/core/sleep/sleepOffset.test.ts`                                                                     | Test                                             | Local offset-transition and elapsed-duration coverage                                               | None                                    | No                          | T                                |
| `code/src/state/sleepResolutionQuery.test.ts`                                                                 | Test                                             | Read-only/protected query and downstream non-activation                                             | None                                    | No                          | Q                                |
| `docs/implementation/phase-9/PHASE_9_TASK_9_12_FIRST_CLASS_SLEEP_DERIVATION_FEASIBILITY_FOUNDATION_RESULT.md` | RESULT                                           | Required trace, contracts, matrices and evidence                                                    | None                                    | No                          | Structure/file-accounting checks |

Pre-existing modification + Task 9.12 additional modification: `physicalOccupancy.ts` already held Task 9.9's shared geometry; only the new classification/type helper is added. `dayFrameStore.ts` already held Task 9.11 persistence and earlier planning work; only the read-only query is added. `types.ts` already held those APIs/types; only the derived query signature is added. All other Task 9.12 files are new. Unrelated dirty files are not part of this task's change list.

## 54. Deferred First-Class Sleep Work

Deferred: ordinary Commitment reordering around solved Sleep; Capacity subtraction and allocability integration; Goal feasibility/competition/allocation/Proposal consumption; Friction and Suggested Fix mapping; accepted Sleep placement and review; omission/shortening/override semantics; Sleep publication snapshots and seam validation; Today/execution/history/Progress/Summary integration; Planner authoring UX; explicit legacy conversion/provenance. No new persistence versions or placeholder accepted/historical objects reserve those future features.

## 55. Completion Assessment

The implementation reuses canonical Sleep authority and identity, derives full physical domains and Work context, classifies authoritative blockers, jointly solves finite minute domains with an honest deterministic exhaustion state, and exposes only a read-only derived query. Required matrices, completeness/budget/anchor contracts, performance assessment and file accounting are present. The full 1,260-test suite, focused 214-test run, lint, typecheck/build, formatting, hard bundle policy and diff hygiene pass. Earlier Phase 9 work remains preserved; no commit or push occurred. Downstream scheduling/Capacity/Goal/publication/execution activation remains explicitly deferred.

Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation is COMPLETE.
