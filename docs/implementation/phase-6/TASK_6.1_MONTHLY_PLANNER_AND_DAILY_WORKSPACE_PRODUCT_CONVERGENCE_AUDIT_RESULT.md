# Task 6.1 Result — Monthly Planner and Daily Workspace Product-Convergence Audit

## 1. Executive Result

**Determination A — Ready for surface convergence.** The three questions are coherent, but the truthful primary labels are **Planner / Today / Summary**. “Monthly” is a Planner presentation, not an engine or authority boundary. Existing authorities are sufficient for V1; application composition and pure read models are the principal gaps.

## 2. Artifact Integrity

The supplied and immutable copies match SHA-256 `60bcb10ba381372c5b930ee7fa1ad35dcdde2d0e90f65ad364251199654414ad`.

## 3. Phase 5 Exit Confirmation

**Confirmed:** Task 5.19 passed, Phase 5 is closed, and its loading/budget ADR remains governing.

## 4. Audit Scope

Read-only audit of production planning, Preview/publication, execution, time, calendar, friction, Goal/Measurement/Observation, Summary, navigation, persistence, and loading behavior.

## 5. Files/Subsystems Reviewed

`DayFrameApp`, `SetupScreen`, `PreviewScreen`, `DayVisualizer`, Goal/Measurement/Observation/Summary components; store/types; scheduler/friction/decision engines; user-day/cycle resolution; HistoricalPlan and ExecutionHistory; tests and governance.

## 6. Evidence Method

**Confirmed** claims cite code/tests; **Inferred** marks composition conclusions; **Product recommendation** marks future direction; searches with no implementation are **Not found**.

## 7. Current Navigation

**Confirmed:** top-level Planner/Summary with Planner Plan/Schedule modes (`DayFrameApp.tsx:1634-1669,2028-2051`). Summary is conditional/lazy; the app/recovery shell remains mounted.

## 8. Current Surface Composition

**Confirmed:** Plan composes `GoalSection` and `SetupScreen`; Schedule composes generation controls and `PreviewScreen`; Summary composes the lazy Historical Intelligence surface (`DayFrameApp.tsx:2063-2171`). Backup/profiles/recovery are shell content.

## 9. Current Planning Flow

```text
Goal + setup draft
  → explicit setup save
  → saved Active authored state (Preview becomes stale)
  → explicit Generate Preview
  → deterministic Preview adopted in memory
  → automatic HistoricalPlan publication
  → optional Try suggested fix
  → explicit acceptance as PlanDecision
  → regeneration and publication
```

Confirmed by `dayFrameStore.ts:1225-1251,2153-2203`, `DayFrameApp.tsx:592-644,805-954`, and HistoricalPlan tests.

## 10. Current Schedule/Preview Semantics

**Confirmed:** Preview is a derived, ephemeral, freely regenerable schedule with scheduled, work, unplaced, omitted/blocked, and friction evidence. It is not backed up (`DayFrameApp.tsx:1598-1601`; `types.ts:71-81`). A fresh unrevised Preview triggers publication; Try revisions do not.

## 11. Current Publication Semantics

**Confirmed:** `generatePreview` adopts and synchronously exposes the Preview, materializes the complete visible range, then asynchronously publishes it (`dayFrameStore.ts:2153-2203`). Identical publication is a no-op and meaningful republication appends (`historicalPlanSurface.test.ts:58-63`).

## 12. Current Plan Authority

**Confirmed:** current effective published plan for a user-day is the latest eligible HistoricalPlan publication at an explicit cutoff (`historicalPlanProjection.ts:18-38`). Preview is current derived schedule UI, not durable plan authority.

## 13. Current Execution/Reporting Flow

```text
published occurrence / Preview occurrence
  → exact durable occurrence reference + frozen snapshot
  → ExecutionReportControl
  → append assertion (completed/partial/skipped)
  → immutable correction or retraction
  → ExecutionHistory-derived current outcome
  → Summary categorical evidence
```

Confirmed by `historicalExecutionTarget.ts:42-157` and `ExecutionReportControl.tsx:38-91`.

## 14. Current User-Day Semantics

**Confirmed:** user-days begin at a configured boundary; instants before it belong to the prior date (`userDay.ts:35-72`). Effective preferences can vary by active shift-cycle segment (`resolveEffectiveSchedulePreferences.ts:6-41`). **Derived-query gap:** there is no one application-level current-user-day resolver that resolves the shift-specific boundary and current effective HistoricalPlan together.

## 15. Current Calendar Infrastructure

**Confirmed:** arbitrary start/end Preview ranges, three-day/week/two-week/month/custom/cycle choices, compact selectable day strip, selected-day details, manual-event editor, day grouping, and timeline exist. **Not found:** a semantic month authority or mature month-grid navigation.

## 16. Current Friction Infrastructure

**Confirmed:** scheduler-derived friction has severity/categories and deterministic fixes. A fix first revises Preview; acceptance persists a PlanDecision and regenerates. No friction authority exists or is needed (`PreviewScreen.tsx:217-264,406-448`; `applySuggestedFix.ts`).

## 17. Current Goal Workflow

**Confirmed:** Planner owns Goal list/detail, create/edit/lifecycle, exact commitment links, Measurement configuration, and Observation reporting (`GoalSection.tsx`; `GoalSection.test.tsx`). Goals never occupy schedule time.

## 18. Current Measurement Workflow

**Confirmed:** `GoalMeasurementSection` configures the authored revisioned policy under selected Planner Goal detail. It is distinct from observations and derived Progress.

## 19. Current Progress Reporting Workflow

**Confirmed:** Planner's `GoalProgressReportingSection` records/corrects/retracts absolute observations and shows Goal-scoped history. Summary reads derived Progress with provenance.

## 20. Current Summary Role

**Confirmed:** read-only historical coverage, planning distribution, scheduled outcomes, Goal Activity, Progress, and provenance. Preserve semantics and use cross-surface navigation only.

## 21. Current Loading Architecture

**Confirmed:** shell/default Planner/authorities/recovery eager; Summary lazy with intent preload/error fallback; React vendor chunk. Phase 6 must retain budgets and reassess any >25 kB initial growth.

## 22. Commitment-Like Source Inventory

| Source                       | Meaning/authority                             | Recurrence/editing                              | Placement                              |
| ---------------------------- | --------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| Shift definition             | authored work shape / Active                  | weekdays/time                                   | Planner, contextual advanced           |
| Shift cycle/segment/sequence | authored dated/rotating work context / Active | ranges or rotation                              | Planner, contextual advanced           |
| Block template               | authored reusable life-work shape / Active    | none alone                                      | Planner Add/Edit Commitment            |
| Block recurrence             | authored occurrence policy / Active           | daily, weekly, selected weekdays, per user-week | Planner Add/Edit Commitment            |
| Sleep template               | block-template policy                         | template recurrence                             | Planner contextual                     |
| Manual event                 | authored one-off event / Active               | single interval/all-day                         | Planner selected day; Today contextual |
| Profile                      | authored setup snapshot / Profiles            | reuse whole pattern                             | advanced Planner/Settings              |

**Confirmed:** no generic Commitment authority exists. **Product recommendation:** do not add one; compose type-specific commands behind a common workflow.

## 23. Monthly Planner Boundary Assessment

**Product recommendation:** a future-oriented Planner is correct: Goals, commitment authoring, pattern reuse, range/day selection, generation/review, unplaced work, friction resolution, manual future events, and Measurement configuration. It must not own live outcome history or Summary analytics.

## 24. Monthly Horizon Assessment

**Confirmed:** generation accepts arbitrary inclusive ranges (`types.ts:55-69`; `dayFrameStore.ts:2158-2168`), cycles cross month edges, and user-week rules need surrounding canonical weeks. **Product recommendation:** never bind authority/generation/publication to calendar-month edges. Offer month navigation/view over an arbitrary planning horizon; label the primary surface Planner.

## 25. Monthly Planner V1

Smallest coherent V1: Planner shell; range/month navigation with selected-day detail; existing Goals; contextual Add/Edit Commitment; generate/refresh; schedule review; unplaced/friction/resolution; future manual events; Measurement configuration. Drag/drop, Capacity, allocation analytics, and Progress analytics are not required.

## 26. Daily Workspace Boundary Assessment

**Product recommendation:** Today answers what is current/next/later and what evidence needs recording. It must not author broad future patterns, configure measurement policy, own historical analytics, or become a new durable authority.

## 27. Daily/User-Day Assessment

Daily Workspace should mean the **canonical current user-day only**, including overnight continuation and shift-specific boundary. Non-current inspection belongs to Planner or Summary; this makes “Today” truthful.

## 28. Daily Workspace V1

Smallest coherent V1: current user-day label/window; published scheduled timeline; current/next/later; explicit reported state; outcome reporting; contextual Goal labels and record-current-value handoff/action; clear unavailable/no-plan states. Same-day plan editing and friction resolution may remain Planner handoffs.

## 29. Summary Preservation Assessment

Preserve all current components and semantics. Outcome-entry controls currently embedded in Schedule are better primarily in Today, but Summary should retain evidence and Planner navigation.

## 30. Pattern Library Assessment

Patterns are contextual authoring infrastructure. Reuse block template/recurrence and profiles through Add/Edit Commitment or advanced tools; no primary Pattern Library destination is warranted.

## 31. Goal Placement

Primary authoring in Planner, preferably list/detail composition. Today may show linked Goal context; Summary retains read-only Goal selection and evidence.

## 32. Measurement Placement

Measurement Definition configuration remains Planner Goal detail. Today may expose record-value only after resolving an eligible active Goal/definition; Summary remains read-only.

## 33. Progress Reporting Placement

Observation reporting is primary in Planner Goal detail today and should become contextual in Today, not mandatory daily work. Corrections/history can remain expanded Planner workflow initially.

## 34. Outcome Reporting Placement

Primary in Today for scheduled occurrences; Planner Schedule may temporarily retain the same canonical control during migration. Summary remains evidence-only.

## 35. Manual Event Placement

Future/selected-day creation belongs in Planner. Today may add an immediate event through the same canonical `mutateManualEvent` path; no duplicate draft/command model.

## 36. Friction Placement

Planning friction resolution is primary in Planner. Today may show only friction affecting the current user-day and hand off to Planner until same-day planning UX is governed.

## 37. Capacity Placement

Later: prospective capacity belongs first in Planner; historical capacity would require separately defined Summary semantics. Not a V1 prerequisite.

## 38. Planned Allocation Placement

Later: prospective allocation in Planner differs from frozen historical allocation in Summary. Each needs explicit denominator/policy semantics.

## 39. Recommendation Placement

Later and policy-dependent. Deterministic suggested fixes remain Planner remediation; they are not Recommendations.

## 40. Add Commitment Workflow

Current users choose low-level shift/template/recurrence/manual-event forms. Mature flow begins with intent and timing, chooses internal type as needed, optionally reuses a pattern, then commits through existing type-specific commands.

## 41. Edit Commitment Workflow

One entry experience is feasible, but shift/cycle, recurring template, and one-off event retain irreducible fields and lifecycle/incarnation semantics. UI convergence must not merge their authority model.

## 42. Review Schedule Workflow

Preview's grouping/timeline/unplaced/friction logic is reusable. Recompose language and hierarchy around “Review schedule”; generation currently also publishes, so UX must disclose that boundary before implying a separate acceptance step.

## 43. Resolve Friction Workflow

Detection → explanation/options already exists; Try → explicit Accept → durable PlanDecision → regenerate already matches the desired bounded flow. Improve composition/language, not engine semantics.

## 44. Live-the-Day Workflow

HistoricalPlan current-day read → derived now/next/later → exact occurrence → existing outcome control → refreshed status. Feasible with new pure/application read composition; clock time never supplies completion.

## 45. SetupScreen Future Assessment

Reuse temporarily as implementation container. Split preferences, shifts/cycles, templates/recurrences, range, and profiles into contextual workflows over time; retire “Setup” as a primary product concept only after all canonical write paths migrate.

## 46. Preview/Schedule Future Assessment

Reuse logic substantially; split presentation between Planner review and Today timeline. Preview remains an engine/runtime concept but should eventually cease being a primary user-facing noun.

## 47. GoalSection Future Assessment

Split list/detail and preserve commands. Substantially belongs in Planner; provide contextual read-only Goal chips in Today.

## 48. Measurement UI Future Assessment

Preserve configuration logic in Planner. Split a compact eligible observation action for Today while retaining one canonical command/history model.

## 49. Summary Future Assessment

Preserve Historical Intelligence, Goal Activity, Progress, cutoff/range, async guards, provenance, and lazy boundary untouched through initial convergence.

## 50. App-Shell Assessment

**Confirmed/Inferred:** `DayFrameApp` owns drafts, navigation, recovery, profiles, manual events, friction acceptance, and all surfaces. Task 6.2 should establish `PlannerSurface`, `TodaySurface`, and the existing lazy Summary boundary while keeping app-owned draft/store authority singular.

## 51. Navigation Model Assessment

Recommend Model A: **Planner / Today / Summary**. It states user questions, avoids a false literal month constraint, and preserves settled Summary naming.

## 52. Terminology Assessment

Keep Goal, Commitment, Schedule, Progress, Summary. Contextualize Pattern. Replace user-facing Setup, Preview, Block Template, Recurrence, Friction Point, and Segment gradually with intent-focused labels while retaining internal model terms.

## 53. Desktop Assessment

Planner can recompose range/calendar + selected-day/timeline + planning/detail/friction panes. Today can use timeline plus current-item/detail rail. Existing DayVisualizer/day groups provide logic, not final information architecture.

## 54. Mobile Assessment

Do not make a dense month grid primary. Use compact month/range selector, week/day strip, and selected-day agenda stack. Today is naturally mobile-first with current/next/report actions.

## 55. Accessibility Assessment

Future calendar needs roving/explicit keyboard navigation, announced selection and plan refresh, stable focus, and non-pointer movement alternatives. Today must not over-announce clock changes. Existing status/error/inserted-detail patterns are reusable.

## 56. Bundle/Loading Implications

Keep Planner initial for early migration. A substantial Today surface is a future lazy-boundary candidate, likely intent-preloaded; Summary remains lazy. Any implementation must run existing four budgets and >25 kB review.

## 57. Persistence Implications

Planner/Today V1 uses Active, PlanDecision, HistoricalPlan, ExecutionHistory, Goal, Measurement Definition, and Observation authorities. New surfaces themselves need no persistence.

## 58. HistoricalPlan Implications

Sufficient for effective current-day schedule, republication, frozen provenance, and exact planned state. It is publication history, not mutable live-workspace state.

## 59. ExecutionHistory Implications

Sufficient for live reporting, correction, retraction, and derived current outcome against exact durable occurrence references. No “in progress” state exists; V1 need not invent one.

## 60. Goal/Measurement/Observation Implications

Existing commands/queries compose without authority change. Today needs selection/eligibility composition, not new storage.

## 61. Preview Implications

Enduring derived engine/runtime concept; temporary UI concept. HistoricalPlan, not Preview, should supply Today so restart and publication truth are preserved.

## 62. Profile Implications

Profiles are advanced whole-setup/pattern infrastructure. Keep canonical behavior, later move placement toward advanced Planner/Settings; eventual scope merits separate audit.

## 63. Backup/Settings Implications

Keep eager and reachable during convergence. Product placement can become a Settings/recovery disclosure later, but loading/recovery access must not regress.

## 64. Plan-vs-Preview Assessment

Authored setup is intent; Preview is derived and ephemeral; HistoricalPlan is the automatically published durable plan ledger. There is no separately durable accepted schedule object.

## 65. Acceptance/Publication Assessment

No new acceptance authority is required for V1. Generation currently constitutes publication; accepted fixes are durable PlanDecisions. Product copy must make generation/publication consequences clear. A future explicit “Publish” UX could call the same architecture but is not prerequisite.

## 66. Direct Manipulation Assessment

Existing engine supports deterministic same-user-day moves only through suggested fixes/PlanDecision replay. Arbitrary drag, resize, pin, or reassignment is **Not found** and would require engine/decision-semantics audits plus keyboard equivalents.

## 67. Now/Next Assessment

Can be derived from effective HistoricalPlan intervals and ExecutionHistory outcomes. “Current” means scheduled interval containing now, not underway; “next” is next scheduled occurrence; elapsed items remain unreported unless evidence says otherwise.

## 68. Same-Day Change Assessment

Manual event/source edits stale Preview; regeneration republishes meaningfully. Accepted deterministic fixes regenerate. HistoricalPlan cutoff preserves prior versions. Arbitrary ad hoc item movement and in-progress state are unsupported.

## 69. Engine Gap Assessment

Non-blocking/later: arbitrary direct placement/resize/pin, generalized cross-day move, and richer same-day replanning. No engine gap blocks Planner review or Today read/report V1.

## 70. Application Gap Assessment

Primary gap: bounded surface components/navigation and orchestration of existing commands without duplicating app drafts or write paths.

## 71. Derived-Query Gap Assessment

Needed: canonical current-user-day resolution with effective preferences; effective current plan at now; now/next/later plus Execution outcome overlay; optional linked Goal/measurement eligibility context.

## 72. Authority Gap Assessment

**Not found for V1.** Do not add generic Commitment, Daily Workspace, current-plan, or acceptance authority. Reassess only if later offline drafts/in-progress/pins require durable user intent not representable today.

## 73. Reuse Assessment

Reuse store commands, scheduler, HistoricalPlan/Execution queries, report controls, Goal/Measurement/Observation components, friction logic, day grouping/timeline logic, and Summary. Recompose large presentational containers.

## 74. Retirement Assessment

Eventually retire Setup as primary information architecture, Preview as primary noun, broad reporting/history inside Schedule, and the monolithic app composition. Do not retire underlying models or controls prematurely.

## 75. Incremental Migration Assessment

Feasible and preferred: add surface boundaries → introduce Today read model → recompose existing workflows → migrate one canonical write path at a time → remove legacy containers only after parity.

## 76. Duplicate-Write Risk Assessment

Highest for Setup versus new commitment forms, Schedule versus Today outcome controls, and Planner versus Today Goal-value entry. Shared drafts/commands and staged removal are mandatory.

## 77. Phase 6 Scope Recommendation

Essential: surface/application foundation, Planner review convergence, contextual commitment workflows, Today query/surface/reporting, navigation/context, accessibility/performance/legacy audit. Optional: richer month UI and same-day handoffs. Later: direct manipulation, Capacity/allocation, Recommendations/adaptation. Out: sync/network/collaboration.

## 78. Phase 6 Sequence Recommendation

6.2 application surface boundaries; 6.3 current-user-day/current-plan query; 6.4 Today read-only surface; 6.5 Today outcome reporting; 6.6 Planner schedule-review shell; 6.7 commitment authoring convergence; 6.8 friction/manual-event cross-surface convergence; 6.9 Goal-measurement context; 6.10 legacy retirement audit; 6.11 UX/accessibility/bundle exit.

## 79. Current-to-Future Surface Matrix

| Current capability | Current surface    | Authority              | Proposed destination               | Reuse strategy      |
| ------------------ | ------------------ | ---------------------- | ---------------------------------- | ------------------- |
| Goals              | Planner Plan       | Goal                   | Planner                            | Split list/detail   |
| Measurement config | Goal detail        | Measurement Definition | Planner detail                     | Preserve/recompose  |
| Progress reporting | Goal detail        | Observation            | Today contextual + Planner history | Share commands      |
| Setup              | Planner Plan       | Active                 | Planner workflows/Settings         | Split, retire shell |
| Schedule Preview   | Planner Schedule   | derived Preview        | Planner review                     | Reuse logic         |
| Manual events      | compact day detail | Active                 | Planner; Today contextual          | Share draft/command |
| Friction           | Schedule           | derived                | Planner                            | Recompose           |
| Suggested fixes    | Schedule           | derived + PlanDecision | Planner Resolve                    | Preserve Try/Accept |
| Outcome reporting  | Schedule/history   | ExecutionHistory       | Today primary                      | Reuse control       |
| Summary Progress   | Summary            | derived                | Summary                            | Preserve            |
| Goal Activity      | Summary            | derived                | Summary                            | Preserve            |
| Backup/settings    | shell              | all/Active/Profile     | Settings/recovery                  | Keep eager          |

## 80. Monthly Planner Matrix

| Capability           | V1 classification | Existing support               | Gap type   | Notes                  |
| -------------------- | ----------------- | ------------------------------ | ---------- | ---------------------- |
| Goals                | Required V1       | Full                           | Product/UI | list/detail recompose  |
| Commitments          | Required V1       | Type-specific                  | Product/UI | common workflow        |
| Patterns             | Useful V1         | templates/recurrences/profiles | Product/UI | contextual             |
| month/calendar       | Useful V1         | ranges/day strip               | Product/UI | not authority boundary |
| selected-day detail  | Required V1       | compact detail/day groups      | Product/UI | reuse logic            |
| schedule review      | Required V1       | Preview                        | Product/UI | recompose              |
| unplaced work        | Required V1       | Full                           | none       | preserve truth         |
| friction             | Required V1       | Full                           | Product/UI | workflow hierarchy     |
| suggested resolution | Required V1       | Full                           | none       | Try/Accept             |
| manual events        | Required V1       | Full                           | Product/UI | future/selected day    |
| measurement config   | Useful V1         | Full                           | none       | Goal detail            |
| Progress context     | Later             | query exists                   | Product/UI | Summary primary        |
| capacity             | Later             | None                           | Unknown    | policy first           |

## 81. Daily Workspace Matrix

| Capability            | V1 classification | Existing support            | Gap type       | Notes                       |
| --------------------- | ----------------- | --------------------------- | -------------- | --------------------------- |
| current user-day      | Required V1       | primitives                  | Derived query  | shift-aware resolver        |
| timeline              | Required V1       | HistoricalPlan + visualizer | Application    | published truth             |
| now                   | Required V1       | intervals                   | Derived query  | not execution state         |
| next                  | Required V1       | intervals                   | Derived query  | deterministic               |
| later                 | Required V1       | intervals                   | Derived query  | ordered remainder           |
| outcome reporting     | Required V1       | Full                        | Application    | reuse control               |
| Goal context          | Useful V1         | frozen/current links        | Derived query  | contextual                  |
| measurement reporting | Useful V1         | Full commands               | Application    | eligible action             |
| same-day change       | Later             | regenerate/republish subset | Engine/Product | Planner handoff V1          |
| friction              | Useful V1         | derived Preview             | Derived query  | current-day display/handoff |
| reschedule            | Later             | bounded fixes               | Engine         | no arbitrary move           |
| tomorrow preview      | Later             | ranges                      | Product/UI     | Planner handoff             |

## 82. Surface Ownership Matrix

| Capability            | Monthly Planner | Daily Workspace | Summary   | Contextual/other    |
| --------------------- | --------------- | --------------- | --------- | ------------------- |
| Goal authoring        | Primary         | No              | No        | —                   |
| Measurement config    | Primary         | No              | Read-only | —                   |
| Record Goal value     | Contextual      | Contextual      | No        | Planner history     |
| Progress analysis     | Read-only       | Read-only       | Primary   | —                   |
| commitment authoring  | Primary         | Contextual      | No        | —                   |
| recurring pattern     | Contextual      | No              | No        | advanced Planner    |
| schedule review       | Primary         | Read-only       | No        | —                   |
| current-day execution | No              | Primary         | Read-only | —                   |
| outcome reporting     | Contextual      | Primary         | No        | —                   |
| friction resolution   | Primary         | Contextual      | No        | —                   |
| historical outcomes   | No              | Contextual      | Primary   | —                   |
| Goal Activity         | No              | No              | Primary   | —                   |
| Backup/settings       | No              | No              | No        | Primary/eager shell |

## 83. Authority Matrix

| Surface capability    | Current authority/query                  | New authority? |        New derived query? |
| --------------------- | ---------------------------------------- | -------------: | ------------------------: |
| Monthly schedule      | Active → Preview/HistoricalPlan          |             No |      Optional composition |
| current user-day      | preferences/cycles + clock               |             No |                       Yes |
| now/next              | HistoricalPlan + ExecutionHistory        |             No |                       Yes |
| outcome reporting     | ExecutionHistory                         |             No |                        No |
| Goal context          | Goal + frozen occurrence goals           |             No |                       Yes |
| Goal Progress context | Progress query                           |             No |          Optional wrapper |
| friction              | Preview-derived                          |             No |     Today subset if shown |
| same-day changes      | Active/PlanDecision → regenerate/publish |      No for V1 | Application orchestration |

## 84. Component Reuse Matrix

| Component/module              | Current role             | Future assessment           | Expected action                              |
| ----------------------------- | ------------------------ | --------------------------- | -------------------------------------------- |
| DayFrameApp                   | shell/all orchestration  | Split                       | surface boundaries, retain store/draft owner |
| SetupScreen                   | monolithic setup         | Recompose/retire eventually | extract contextual workflows                 |
| Preview/Schedule              | derived review/reporting | Split                       | Planner review + Today logic                 |
| GoalSection                   | Goal composite           | Split                       | Planner list/detail                          |
| GoalMeasurementSection        | config                   | Reuse                       | Planner detail                               |
| GoalProgressReportingSection  | observations/history     | Split                       | Today action + Planner history               |
| HistoricalIntelligenceSummary | analytics                | Preserve                    | untouched/lazy                               |
| friction UI                   | resolution               | Recompose                   | Planner Resolve                              |
| manual-event UI               | selected-day editor      | Reuse logic                 | shared canonical workflow                    |

## 85. Terminology Matrix

| Current term   | Current meaning                                      | Quality                | Proposed treatment                  |
| -------------- | ---------------------------------------------------- | ---------------------- | ----------------------------------- |
| Setup          | authored planning inputs                             | machinery-led          | retire from primary IA              |
| Preview        | ephemeral generated result that triggers publication | misleading             | “schedule review”; internal Preview |
| Schedule       | generated temporal placement                         | good                   | retain                              |
| Commitment     | schedulable intent family                            | good                   | retain product umbrella             |
| Pattern        | reusable authoring                                   | good contextually      | contextual action                   |
| Block Template | reusable block source                                | implementation-led     | hide behind commitment/pattern      |
| Recurrence     | occurrence rule                                      | technical but familiar | advanced field                      |
| Friction       | deterministic plan conflict                          | acceptable             | “Needs attention/Resolve” entry     |
| Segment        | dated shift-cycle part                               | technical              | advanced only                       |
| Goal           | authored outcome intent                              | good                   | retain                              |
| Progress       | measured derived interpretation                      | good                   | retain                              |

## 86. Time-Horizon Matrix

| Concern      | Monthly Planner                 | Daily Workspace             | Summary                    |
| ------------ | ------------------------------- | --------------------------- | -------------------------- |
| orientation  | future                          | current                     | historical                 |
| date concept | selected user-day/range         | current user-day            | queried user-day range     |
| range        | arbitrary; month presentation   | one current user-day        | explicit historical range  |
| boundary     | effective per day               | canonical current effective | frozen publication         |
| cutoff       | generation time                 | now                         | explicit evaluation cutoff |
| publication  | creates/replaces effective plan | reads latest as-of          | evaluates ledger           |

## 87. Publication Matrix

| State                  | Current semantics                      | Future UX question           |
| ---------------------- | -------------------------------------- | ---------------------------- |
| authored setup changed | saved Active; Preview stale            | show refresh consequence     |
| Preview generated      | adopted and auto-published if valid    | call it build/update plan?   |
| Preview stale          | old result visible, fixes disabled     | prominent update action      |
| plan published         | async after generation                 | disclose durability/status   |
| plan republished       | meaningful batch appended              | explain changed current plan |
| same-day plan changed  | regenerate creates later effective day | show “updated at”            |
| historical evaluation  | latest publication <= cutoff           | preserve cutoff/provenance   |

## 88. Workflow Matrix

| Workflow          | Current path                | Desired mature path                   | Gap                  |
| ----------------- | --------------------------- | ------------------------------------- | -------------------- |
| Add Commitment    | choose setup type/forms     | Add Commitment → type/details/pattern | Product/UI           |
| Edit Commitment   | edit low-level section      | open commitment → scoped editor       | Product/UI           |
| Review Schedule   | Schedule/Preview            | Planner Review                        | composition/language |
| Resolve Friction  | fix → Try → Accept          | same, grouped under Resolve           | composition          |
| Record Outcome    | Preview/history control     | Today item → Record outcome           | composition          |
| Record Goal Value | Planner Goal detail         | Today contextual or Planner           | composition          |
| Review Progress   | Summary                     | Summary                               | none                 |
| Live the Day      | fragmented Schedule/history | Today now/next/later/report           | derived query + UI   |

## 89. Navigation Matrix

| Model                      | Advantages                       | Risks                     | Fit    | Recommendation       |
| -------------------------- | -------------------------------- | ------------------------- | ------ | -------------------- |
| Planner / Today / Summary  | clear questions; horizon-neutral | migration work            | High   | **Select**           |
| Month / Today / Summary    | concrete                         | false range constraint    | Medium | reject primary label |
| Plan / Today / Review      | verbs                            | “Review” obscures history | Medium | reject               |
| Current + contextual Daily | lowest cost                      | Daily remains hidden      | Medium | temporary only       |

## 90. Mobile Matrix

| Capability       | Desktop expectation   | Mobile constraint  | Reusable pattern               |
| ---------------- | --------------------- | ------------------ | ------------------------------ |
| month navigation | calendar/range + pane | grid density       | compact day strip/range inputs |
| selected day     | side detail           | stacked context    | compact day detail             |
| schedule review  | multi-day/timeline    | horizontal density | day cards/DayVisualizer logic  |
| friction         | side/group panel      | action overload    | disclosure/list                |
| current/next     | timeline/detail       | ideal narrow focus | day grouping/time formatting   |
| reporting        | inline/detail         | form space/focus   | ExecutionReportControl         |

## 91. Gap Matrix

| Gap                                  | Classification | Blocks Planner? | Blocks Today? | Priority     |
| ------------------------------------ | -------------- | --------------: | ------------: | ------------ |
| bounded surface components           | Application    |             Yes |           Yes | Highest      |
| canonical current-user-day read      | Derived query  |              No |           Yes | Highest      |
| effective now/next/outcome model     | Derived query  |              No |           Yes | Highest      |
| Planner information architecture     | Product/UI     |             Yes |            No | High         |
| common commitment workflow           | Product/UI     |         Partial |            No | High         |
| current-day Goal context             | Derived query  |              No |            No | Medium       |
| arbitrary schedule manipulation      | Engine         |              No |            No | Later        |
| explicit publication language/status | Product/UI     |         Partial |       Partial | High         |
| dense month grid                     | Product/UI     |              No |            No | Optional     |
| new durable authority                | Authority      |              No |            No | Not required |

## 92. Migration Matrix

| Current structure | Intermediate                        | Mature                   | Duplicate-write risk |
| ----------------- | ----------------------------------- | ------------------------ | -------------------- |
| Setup             | embedded canonical workflows        | contextual Planner tools | High—one draft owner |
| Preview           | Planner review + Today reads ledger | internal engine concept  | Medium               |
| Goal workflows    | existing section in Planner shell   | list/detail/context      | Medium               |
| reporting         | same control in Schedule/Today      | Today primary            | High—shared command  |
| navigation        | Planner/Summary + Today             | Planner/Today/Summary    | Low                  |

## 93. Phase 6 Sequence Matrix

| Proposed task | Purpose                                 | Prerequisites | User-visible? | Risk                |
| ------------- | --------------------------------------- | ------------- | ------------: | ------------------- |
| 6.2           | surface/application boundary foundation | 6.1           |       Minimal | state/focus         |
| 6.3           | canonical Today read model              | 6.2           |            No | time/cutoff         |
| 6.4           | read-only Today V1                      | 6.3           |           Yes | epistemic copy      |
| 6.5           | Today outcome reporting                 | 6.4           |           Yes | one-write-path      |
| 6.6           | Planner review convergence              | 6.2           |           Yes | publication clarity |
| 6.7           | commitment workflow convergence         | 6.6           |           Yes | draft/incarnation   |
| 6.8           | friction/manual-event convergence       | 6.6-6.7       |           Yes | republication       |
| 6.9           | Goal/measurement context                | 6.4-6.5       |           Yes | eligibility         |
| 6.10          | legacy retirement audit                 | prior         |            No | parity              |
| 6.11          | UX/a11y/bundle exit                     | prior         |           Yes | cross-surface       |

## 94. Product-Boundary Matrix

| Capability             | Phase 6 assessment                    |
| ---------------------- | ------------------------------------- |
| Monthly Planner        | Essential as horizon-flexible Planner |
| Daily Workspace        | Essential as Today                    |
| Summary                | Preserve                              |
| Goal authoring         | Essential                             |
| commitment convergence | Essential                             |
| Pattern Library        | Contextual                            |
| friction convergence   | Essential                             |
| execution reporting    | Essential                             |
| Progress reporting     | Useful/contextual                     |
| Capacity               | Later                                 |
| Planned Allocation     | Later                                 |
| Recommendations        | Later                                 |
| adaptation             | Later                                 |
| historical Progress    | Out of scope                          |
| network/sync           | Out of scope                          |

## 95. Epistemic Matrix

| Evidence/state         | May present                     | Must not infer           |
| ---------------------- | ------------------------------- | ------------------------ |
| scheduled now          | interval overlaps now           | underway/completed       |
| scheduled item ended   | interval elapsed                | done/skipped             |
| no execution report    | not reported/unknown            | skipped                  |
| completed report       | reported complete               | Goal success             |
| skipped report         | reported skipped                | blame/failure cause      |
| unplaced item          | intended, not placed            | skipped                  |
| blocked item           | governed placement blocked      | user failure             |
| stale Preview          | authored inputs changed         | historical plan changed  |
| Goal at 100%           | measured ratio                  | lifecycle completion     |
| high Goal Activity     | many linked occurrences         | causation/progress       |
| missing history        | unavailable/incomplete coverage | zero activity            |
| same-day republication | later effective plan exists     | prior plan never existed |

## 96. Architectural Questions — Answers

1. Yes, as horizon-flexible Planner / current-user-day Today / Summary.
2. No; month is a view, not a literal planning boundary.
3. Yes, canonical current user-day only.
4. Yes; preserve Summary.
5. Yes, Preview logic can underpin Planner review.
6. Partly; reuse visualization logic, but Today must read HistoricalPlan rather than ephemeral Preview.
7. Split/recompose; retire the primary “Setup” shell after parity.
8. Split list/detail in Planner; contextual Goal read in Today.
9. Planner Goal detail.
10. Today context plus Planner history; Summary remains interpretation.
11. Today primarily.
12. Planner selected/future day; Today contextual via same command.
13. Planner primarily; Today handoff/subset.
14. Yes, contextual.
15. No generic Commitment authority for V1.
16. No Daily Workspace authority.
17. No; HistoricalPlan supplies effective current plan.
18. No new workflow required for V1, but generation/publication language must become clear.
19. Yes, via a new pure/application read model.
20. Yes for source edits/accepted fixes followed by regeneration/republication; not arbitrary manipulation.
21. Later arbitrary manipulation/replanning only.
22. Surface composition, terminology, read models, and workflow placement.
23. Engines, authorities, report controls, day visualization/grouping, Goals, Summary.
24. Setup/Preview primary IA and broad reporting inside Schedule.
25. Goals + commitments + range/day + generate/review + unplaced/friction + manual events.
26. current user-day + timeline + now/next/later + explicit reporting.
27. Capacity, allocation, Recommendations/adaptation, direct manipulation, sync, historical Progress expansion.
28. Surface/Application Boundary Foundation.

## 97. Architectural Invariant Assessment

All 72 invariants are **Preserved/Confirmed** where applicable: no production behavior, authority, query, persistence, Backup, router, component, metric, recommendation, adaptation, network, or bundle-budget change occurred. Proposed surfaces remain recommendations; all authority/evidence distinctions, user-day/overnight semantics, one-write-path migration, accessibility, publication, now/next, and Phase 5 loading constraints are explicit.

## 98. Stop-Condition Assessment

No stop condition triggered. Publication, plan authority, effective cutoff/republication, Setup/Preview writes, user-day primitives, and exact execution linkage are determinable. The three-surface direction is coherent and requires no silent authority merge.

## 99. Validation

Repository-standard baseline validation passed: lint, typecheck, 83 test files / 880 tests, production build with 110 modules, bundle guard (676,308 initial raw; 168,198 gzip; 30,091 largest lazy; 706,399 total), and documentation diff check. Recommendations have no behavioral validation claim.

## 100. Governance Updates

Added immutable task, this audit result, Phase 6 entry checkpoint, and updated Roadmap, Current State, and Changelog.

## 101. Deviations

None. No production code or tests changed; no UI design, rename, query, authority, schema, build, or budget work was implemented.

## 102. Discoveries

Generation already publishes; Preview is not the durable current plan. Today can be built over HistoricalPlan + ExecutionHistory without new authority. “Monthly” is less truthful than Planner because ranges are arbitrary and user-week/cycle semantics cross calendar edges.

## 103. Deferred Work

Final month/mobile interaction design, arbitrary direct manipulation, same-day replanning beyond regeneration, Capacity, Planned Allocation, Recommendations/adaptation, Profile disposition, network/sync, and legacy retirement implementation.

## 104. Recommended Task 6.2

**Task 6.2 — Planner / Today / Summary Surface and Application Boundary Foundation.** Extract bounded surface composition and navigation contracts while preserving the canonical store, app-owned Setup draft, eager Planner/authority/recovery path, lazy Summary, all existing write paths, and production behavior. Do not add Today semantics until the subsequent read-model task.

## 105. Final Audit Determination

**A — Ready for surface convergence.** Proceed incrementally with Task 6.2. The operating model is Planner / Today / Summary; month is a Planner view, Today is the canonical current user-day, and no new durable authority is required for either V1 surface.
