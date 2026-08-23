# Task 4.5 — Clarify Planner/Preview Navigation, Outcome Scope, and Operational Reporting Responsibilities V1 Result

## 1. Executive Result

Complete. Top-level controls are now the three destinations Setup, Preview, and
Summary. Preview navigation performs no generation. Setup retains an explicit
save-before-generate command; Preview exposes explicit Generate or Regenerate
according to current state. The ambiguous broad Preview aggregate was removed,
operational reporting was renamed around user purpose, Summary remained read-only,
and keyboard activation now focuses inserted Summary evidence.

## 2. Artifact Integrity

The supplied and immutable project artifacts compare byte-for-byte. SHA-256:
`7e1f8f1ef4ccd7862bf9161a90b01440bd04d037f198c168794c7ad42ff0ddb2`.

## 3. Task 4.4 Prerequisite Confirmation

Production inspection confirmed every accepted finding: mixed command/navigation,
Preview’s multi-purpose role, distinct report-centric and plan-centric aggregates,
read-only Summary, contextual reporting, and governed correction/retraction.

## 4. Initial Implementation Audit

`openPreviewScreen` already navigated without generation. The top-level button
instead called `generatePreviewFromCurrentDraft`. Preview already had an always
visible Regenerate command and rendered reporting without a Preview. Stale state
was explicit. `ExecutionSummarySection`, past-plan reporting, and Execution history
were all embedded in `PreviewScreen`. No architectural separation was required.

## 5. Files Changed

- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/SetupScreen.tsx`
- `code/src/ui/PreviewScreen.tsx`
- `code/src/ui/HistoricalPlanReportingSection.tsx`
- `code/src/ui/ExecutionHistoryPanel.tsx`
- `code/src/ui/HistoricalIntelligenceSummary.tsx`
- focused tests for the shell and affected reporting/Summary components
- Task 4.5 result and Phase 4 governance

## 6. Navigation Before/After

Before: `Setup / Generate Preview / Summary`. After: `Setup / Preview / Summary`.
All three buttons now expose the selected destination through `aria-pressed` and
none is a generation command.

## 7. Destination/Action Separation

The Preview navigation control calls `openPreviewScreen`. Generation is available
only through action buttons within Setup or Preview. No router or new navigation
state was introduced.

## 8. Setup Behavior

Setup remains ongoing authored planning. Its toolbar now contains Save Setup and a
contextual Generate Preview command. Copy states that generation saves the current
draft first.

## 9. Preview Navigation

Preview can be entered with no, current, or stale Preview and never mutates
authority merely through navigation. Its navigation detail describes schedule
review and outcome reporting.

## 10. Summary Navigation

Summary remains a destination-only button. It opens the existing governed History
query and does not invoke generation or reporting mutations.

## 11. Generate Behavior

Setup’s Generate Preview uses the existing `generatePreviewFromCurrentDraft` path:
validate/save the draft, open Preview, and generate once. Preview with no current
draft uses the existing saved-state generation path.

## 12. Regenerate Behavior

When a Preview exists, the Preview action is `Regenerate Preview` and uses the
saved Active state. It is explicit for both current and stale drafts.

## 13. Save-Before-Generate Semantics

Unchanged. Setup generation still calls `saveCurrentSetup(false)` and only
generates the returned state. Preview generation intentionally uses already saved
state, matching its operational context.

## 14. No-Preview State

The Preview destination states that no draft exists, explains what generation
will show, offers `Generate Preview`, and continues to expose past planned
occurrence reporting and Report history without pretending they need Preview.

## 15. Stale-Preview State

The stale draft remains visible with the existing Setup-changed warning. Navigation
does not refresh it; only explicit Regenerate does. Suggested fixes remain guarded.

## 16. Preview Product-Purpose Clarification

The destination detail now says Preview reviews the current schedule draft and
reports outcomes. Generation is presented as an action within that workspace.

## 17. Contextual Current Reporting

All existing `Report outcome` controls beside manual, work, scheduled, unplaced,
and accepted-decision occurrences remain. They still use the governed shared
ExecutionHistory workflow.

## 18. Past Planned Occurrence Reporting

The frozen HistoricalPlan-backed workflow remains in Preview after schedule and
friction content. It still materializes exact historical targets and writes only
ExecutionHistory.

## 19. Past Reporting Terminology

`Report from plan history` became `Report a past planned occurrence`. The date is
`Past planned date`; copy explains that the action records what happened to
something DayFrame previously had in a planned schedule.

## 20. Report History / Correction / Retraction

`Execution history` became `Report history`, with copy describing prior reports,
correction, withdrawal, and retained revisions. Correction and retraction APIs,
revision behavior, forms, conflicts, durability, and protection are unchanged.

## 21. Preview Aggregate Determination

The preferred removal path was safe. The aggregate supplied no essential write
workflow and its current-Preview coverage was informational, while its broad
ExecutionHistory counts conflicted visibly with Summary’s plan denominator.

## 22. Preview Aggregate Changes

`ExecutionSummarySection` is no longer rendered by `PreviewScreen`, including the
no-Preview case. Thus withdrawn subjects can no longer appear there under
Summary-like `Not reported` language.

## 23. Summary Aggregate Preservation

Task 4.2 eligibility, categories, coverage, cutoff, provenance, exclusions, and
states are unchanged. Task 4.3 tests continue to exercise them.

## 24. Outcome Scope Clarification

Preview now contains occurrence-level operational reporting and editable report
history, not a competing historical aggregate. Summary alone presents selected-
date HistoricalPlan-denominated Scheduled outcomes.

## 25. Not-Reported / Retraction Consistency

Summary `Not reported` still means no current report exists for an eligible
scheduled occurrence. Summary `Unknown` explains withdrawn evidence. Operational
Report history shows `Not reported` only as the current outcome of a known subject
and explicitly describes/report revisions as retracted; no competing aggregate
equates the two populations.

## 26. Reporting Coverage Scope

The removed Preview card removes ambiguous broad/current mixed coverage. Summary’s
heading now says `Reporting coverage for these dates`, and its sentence retains the
exact eligible scheduled denominator.

## 27. Summary Read-Only Boundary

No report, correct, retract, schedule, or generation action was added to Summary.
It continues consuming only the Task 4.2 query and authority subscriptions.

## 28. Section Ordering

For a generated Preview, schedule/friction content now precedes past planned
occurrence reporting, followed by Report history. No-preview Preview exposes its
explanation and then both reporting workflows.

## 29. Responsive Behavior

Existing three-column navigation still collapses to one column. Removing the
aggregate shortens the long mobile Preview. Existing report forms and Summary
cards retain responsive behavior.

## 30. Accessibility

Navigation remains a named semantic `nav` with pressed buttons and focus-visible
styles. Generation uses plainly named buttons. Renamed reporting sections preserve
heading associations, labels, fieldsets, statuses, and semantic controls.

## 31. Summary Drill-Down Focus Determination

Implemented locally. Keyboard-generated click activation focuses the newly inserted
detail container (`tabIndex=-1`); pointer activation does not jump focus. The
button remains associated through `aria-controls`/`aria-expanded`.

## 32. Empty-State Integrity

No Preview, published-empty plan day, missing publication, zero eligible Summary
history, and no reports retain distinct copy. Removing the aggregate eliminates
its ambiguous “No outcomes” state from Preview.

## 33. Error-State Integrity

Generation guardrails, stale Preview, protected past-plan storage, protected report
history, Summary unavailable/protected/quarantined states, and unexpected query
failure remain separate.

## 34. Epistemic Integrity

Current draft, frozen past plan, editable report revisions, and selected Summary
history now have distinct headings and purposes. No evidence state was recomputed
or reclassified.

## 35. Full Clear

There is no Preview aggregate to remain stale. Existing clear behavior clears
Preview and five authorities; mounted reporting and Summary subscriptions continue
to reflect cleared authority.

## 36. Restore Boundary

No UI restore participant exists. Restored Active feeds Setup, existing Preview
semantics apply, reporting reads restored authorities, and Summary re-derives.

## 37. Persistence/Backup Boundary

No storage, Backup field/version, migration, durable identifier, authority, or
domain event was added.

## 38. Dead-Code Assessment

`ExecutionSummarySection` became unreachable from production and tree-shook out of
the build, contributing to a reduction from 91 to 89 transformed modules. The UI
component, its tests, and `executionSummary.ts` were preserved as requested; no
broad execution-summary cleanup occurred.

## 39. Tests Added/Changed

Navigation expectations now target Preview as a destination. New shell coverage
proves destination controls exclude Generate Preview, Preview/Summary navigation
does not generate, no-Preview reporting remains, the aggregate is absent, explicit
Setup generation works, and Preview becomes active. Reporting tests use the new
headings/label. Summary adds pointer-versus-keyboard focus coverage.

## 40. Focused Validation

Five files, 143 tests: pass. Coverage includes shell/navigation/generation,
Preview, past planned reporting, correction/retraction, and Summary.

## 41. Full Validation

- lint: pass
- typecheck: pass
- full suite: 63 files, 789 tests, pass
- build: 89 modules, pass; 589.27 kB chunk
- existing >500 kB Vite advisory: non-blocking
- `git diff --check`: pass

## 42. Manual Product Walkthrough

The repository has no browser automation or visual-regression harness. The seven
journeys were exercised through behavioral DOM tests: Setup generation opens
Preview; Summary→Preview navigation does not generate; stale behavior/regeneration
remains covered; contextual Report outcome remains in Preview tests; past reporting
remains in focused tests; Report history correction/retraction remains covered;
Summary range/distribution/drill-down remains covered. Desktop/mobile source CSS
and rendered semantic order were manually inspected. No unsupported pixel-level
browser claim is made.

## 43. Governance Updates

Updated the Phase 4 checkpoint, Current State, Roadmap, and Changelog. No ADR was
needed; Task 4.4 already governed the read/write and Planner/Summary direction.

## 44. Deviations

Current-Preview reporting coverage was removed with the mixed aggregate rather
than retained as another card because it was nonessential and would preserve
visual competition. Setup/Preview were not merged. No separate current-schedule
coverage replacement was invented.

## 45. Discoveries

The aggregate UI was production-unreachable after removal but its core remains
well-tested and reusable. The existing saved-state Preview action and current-draft
Setup action cleanly express two intentional save contexts without duplicated
generation logic.

## 46. Deferred Work

Full Planner convergence, a possible operational reporting subsection, URL/deep
links, larger mobile navigation changes, and deletion/reuse of the preserved
execution-summary component remain deferred. No additional UX prerequisite was
discovered before Scheduling Realization design.

## 47. Navigation Matrix

| Control | Type | Before | Task 4.5 | Mutates authority? |
|---|---|---|---|---:|
| Setup | destination | navigate | navigate | no |
| Preview | destination | generation masqueraded as nav | navigate only | no |
| Summary | destination | navigate | navigate | no |
| Generate Preview | command | top nav | Setup/no-Preview action | yes: saves/generates |
| Regenerate Preview | command | Preview action | Preview action | yes: derived Preview/publication |

## 48. Surface Responsibility Matrix

| Capability | Setup | Preview | Summary | Determination |
|---|---:|---:|---:|---|
| author planning inputs | primary | absent | absent | preserved |
| generate schedule | contextual | primary | absent | clarified command |
| review schedule | absent | primary | absent | preserved |
| resolve friction | contextual | primary | absent | preserved |
| report current occurrence | absent | primary | absent | preserved |
| report past planned occurrence | absent | primary | absent | clarified |
| correct/retract report | absent | primary | absent | clarified Report history |
| broad historical aggregate | absent | absent | primary | consolidated placement |
| historical evidence drill-down | absent | absent | primary | preserved read-only |

## 49. Terminology Matrix

| Concept | Before | After | Reason |
|---|---|---|---|
| schedule workspace | Generate Preview | Preview | destination, not command |
| schedule generation | nav + Regenerate | Generate/Regenerate actions | explicit mutation |
| past occurrence reporting | Report from plan history | Report a past planned occurrence | plain purpose |
| editable execution history | Execution history | Report history | distinguish Summary History |
| Preview aggregate | Reported outcomes | removed | ambiguous population |
| Summary aggregate | Scheduled outcomes | unchanged | accurate plan scope |
| current schedule coverage | mixed Preview card | removed | nonessential ambiguity |
| historical reporting coverage | Execution reporting coverage | Reporting coverage for these dates | selected-range scope |

## 50. Outcome-Scope Matrix

| Surface | Presentation | Population | Plan denominator? | Retraction treatment | User purpose |
|---|---|---|---:|---|---|
| Preview | no aggregate; occurrence reports + Report history | contextual/current report subjects | no aggregate | explicit withdrawn/revisions | record or edit reality |
| Summary | Scheduled outcomes | effective scheduled plan occurrences for selected dates | yes | distinct Unknown | understand history |

## 51. Read/Write Matrix

| Capability | Surface | Read/write | Authority |
|---|---|---|---|
| schedule review | Preview | read | derived Preview |
| schedule generation | Setup/Preview | write | Active save + derived Preview/HistoricalPlan publication |
| current reporting | Preview | write | ExecutionHistory |
| past reporting | Preview | read HistoricalPlan/write report | HistoricalPlan/ExecutionHistory |
| correction | Preview Report history | write revision | ExecutionHistory |
| retraction | Preview Report history | write revision | ExecutionHistory |
| historical analysis | Summary | read | derived from HistoricalPlan + ExecutionHistory |
| historical drill-down | Summary | read | derived provenance |

## 52. Epistemic Integrity Matrix

| State | Treatment after 4.5 | Must not be confused with |
|---|---|---|
| no Preview | no current draft + Generate action | generation failure/history absence |
| stale Preview | visible stale draft + explicit regenerate | current draft |
| published-empty day | covered day with no occurrences | missing day |
| missing historical day | missing date/unknown plan | zero work |
| eligible not reported | Summary Not reported | withdrawn/skipped |
| withdrawn/retracted | Summary Unknown; Report history revisions | never reported |
| skipped | categorical reported outcome | missing/withdrawn |
| protected authority | recovery-safe unavailable state | empty history |
| quarantined evidence | preserved evidence excluded | not reported |

## 53. Product-Boundary Matrix

| Capability | Task 4.5 |
|---|---|
| destination/action separation | Implemented |
| explicit generation/regeneration | Implemented |
| Preview purpose clarification | Clarified |
| contextual current reporting | Preserved |
| past planned reporting | Preserved and clarified |
| correction/retraction | Preserved |
| Preview aggregate cleanup | Implemented |
| Summary read-only | Preserved |
| Summary metric changes | Prohibited by task |
| full Planner migration | Deferred |
| dedicated Reporting destination | Deferred |
| Scheduling Realization / Planned Allocation | Prohibited by task |
| Goals / Progress / Recommendations / learning | Prohibited by task |
| composite score | Prohibited by task |

## 54. Architectural Invariant Assessment

| # | Invariant | Assessment |
|---:|---|---|
| 1 | navigation represents destinations | Covered by test |
| 2 | generation explicit command | Covered by test |
| 3 | Preview navigation does not generate | Covered by test |
| 4 | Summary navigation does not mutate | Confirmed |
| 5 | Setup generation preserves save semantics | Covered by existing tests |
| 6 | Preview remains derived | Preserved |
| 7 | Setup edits mark stale | Covered by existing tests |
| 8 | stale visible until regenerate | Covered by existing tests |
| 9 | current reporting operational | Preserved |
| 10 | past reporting operational | Covered by test |
| 11 | frozen HistoricalPlan evidence | Preserved |
| 12 | correction is revision | Covered by test |
| 13 | retraction is revision | Covered by test |
| 14 | Report history distinct | Implemented |
| 15 | Summary read-only | Confirmed |
| 16 | Task 4.2 query consumed | Preserved |
| 17 | distribution semantics unchanged | Covered by test |
| 18 | coverage semantics unchanged | Covered by test |
| 19 | Summary Not reported unchanged | Covered by test |
| 20 | retraction distinct | Confirmed |
| 21 | competing aggregate removed | Covered by test |
| 22 | current coverage retained/scoped | Unsupported—not retained |
| 23 | selected-history coverage scoped | Implemented |
| 24 | Active does not reinterpret Summary | Preserved |
| 25 | clear leaves no aggregate | Confirmed |
| 26 | Backup no UI data | Confirmed |
| 27 | restore no 4.5 logic | Confirmed |
| 28 | no persistence versions | Confirmed |
| 29 | no authority | Confirmed |
| 30 | no IDs | Confirmed |
| 31 | navigation no events | Confirmed |
| 32 | Summary view no events | Confirmed |
| 33 | report actions governed | Preserved |
| 34 | no full Planner migration | Confirmed |
| 35 | Setup not renamed Planner | Confirmed |
| 36 | Preview not renamed Planner | Confirmed |
| 37 | no Reporting destination | Confirmed |
| 38 | no Scheduling Realization | Confirmed |
| 39 | no Planned Allocation | Confirmed |
| 40 | no trends | Confirmed |
| 41 | no comparisons | Confirmed |
| 42 | no Goals | Confirmed |
| 43 | no Progress | Confirmed |
| 44 | no Recommendations | Confirmed |
| 45 | no learning | Confirmed |
| 46 | no composite/adherence score | Confirmed |
| 47 | keyboard navigation | Covered by test |
| 48 | active destination exposed | Covered by test |
| 49 | keyboard generation actions | Preserved semantic buttons |
| 50 | responsive navigation | Preserved |
| 51 | mobile operational reporting | Preserved/shortened |
| 52 | Summary accessibility | Covered by test |
| 53 | epistemic distinctions | Confirmed |

## 55. Stop-Condition Assessment

No stop condition occurred. Navigation and generation were separable through
existing functions; save semantics remained intact; aggregate removal lost no
essential workflow; past reporting and Summary boundaries required no authority,
persistence, Planner migration, reporting destination, or metric change.

## 56. Architectural Alignment Assessment

Aligned. UI navigation remains ephemeral, commands use existing application/store
paths, operational writes remain ExecutionHistory/Preview behavior, and Summary
remains UI → governed query → historical authorities. Product vocabulary changed;
domain architecture did not.

## 57. Recommended Next Task

**Task 4.6 — Scheduling Realization Projection V1.** The refined surface can now
separately explain “could DayFrame place it?” from “what was reported?” Task 4.6
must independently govern scheduled/unplaced/omitted/blocked semantics and remain
separate from execution outcomes.

## 58. Final Completion Determination

Task 4.5 is complete. Destination navigation, explicit generation, stale/no-draft
behavior, operational reporting, past-plan reporting, correction/retraction,
historical analysis, outcome scope, focus behavior, responsive use, authority
boundaries, tests, and governance now satisfy the bounded refinement without a new
metric or full Planner migration.
