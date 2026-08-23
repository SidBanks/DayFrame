# Task 4.4 — Summary Experience, Historical Reporting, and Outcome-Surface UX Audit Result

## 1. Executive Findings

**Product Architecture Determination B — Coherent with bounded refinement.**

- **Implementation fact:** Setup authors durable planning inputs; Preview generates/reviews a draft, resolves friction, reports outcomes, reports from frozen plan history, summarizes reports, and edits ExecutionHistory; Summary reads a HistoricalPlan-denominated projection.
- **Product inference:** the Planner/Summary direction remains supported, but Setup + Preview currently split Planner responsibilities and Preview carries Phase 3 reporting responsibilities beyond “preview.”
- **Product recommendation:** keep Summary read-only for now and complete one bounded responsibility/naming cleanup before another metric.
- **Open question:** whether long-term operational reporting should be a Planner subsection or a separate destination needs later usability evidence; it need not block the bounded cleanup.

Preview currently represents a generated draft-schedule workspace plus an
operational reporting hub. It should eventually become part of Planner. Execution
reporting belongs with operational occurrence/report workflows, with contextual
entry points beside schedule occurrences. Preview Outcome Summary and Summary
Completion Distribution are genuinely distinct but insufficiently distinguished.
“Report from plan history” is a truthful write workflow in an acceptable
transitional location, not historical analysis. Current navigation mixes two
destinations with one command. Summary is **ready after bounded UX refinement**,
not ready for another metric immediately.

## 2. Artifact Integrity

The supplied and immutable project copies compare byte-for-byte. Both SHA-256 to
`95cba78a400d9b4d9ad434f5f749fe8662623f8754df05d4bbf7494db204609c`.

## 3. Audit Scope

This audit covers the post-4.3 Setup, Preview, Summary, reporting, correction,
history, navigation, terminology, responsive, accessibility, and epistemic
boundaries. It changes no production UI, authority, projection, persistence, or
metric.

## 4. Sources Reviewed

Reviewed Tasks 4.1–4.3 results; both Phase 4 checkpoints; current state, roadmap,
and changelog; production shell, Setup, Preview, `ExecutionReportControl`,
`ExecutionSummarySection`, `HistoricalPlanReportingSection`,
`ExecutionHistoryPanel`, `HistoricalIntelligenceSummary`; execution-summary and
Task 4.2 projection/query code; and focused UI/core tests. Principal production
evidence: `SetupScreen.tsx:93-175`, `DayFrameApp.tsx:1402-1468,1817-1915`,
`PreviewScreen.tsx:65-223,302-462`, `ExecutionSummarySection.tsx:7-50`,
`HistoricalPlanReportingSection.tsx:13-70`, `ExecutionHistoryPanel.tsx:9-131`,
`HistoricalIntelligenceSummary.tsx:24-186`, and
`core/execution/executionSummary.ts:18-85`. Behavioral evidence includes
`ExecutionSummarySection.test.tsx:14-41`, `ExecutionHistoryPanel.test.tsx:13-41`,
`HistoricalIntelligenceSummary.test.tsx:52-122`, and
`DayFrameApp.test.tsx:4278-4288`.

## 5. Current Surface Inventory

| Surface | Label / heading | Implied purpose | Actions and information | Authority boundary |
|---|---|---|---|---|
| Setup | Setup / Setup | edit schedule inputs | preferences, shifts, cycles, templates, recurrence, range, save | reads/writes Active authored setup |
| Preview | Generate Preview / Preview + DayFrame Preview | save/generate/review draft | schedule, friction, fixes, accepted choices, reporting, report summary/history | reads Active/Preview/decisions/history; writes Preview, decisions, ExecutionHistory |
| Summary | Summary / History | inspect historical understanding | date range, plan coverage, distribution, coverage, provenance | reads derived Task 4.2 query; writes no authority |

The shell also exposes profile, Backup, clear, and manual-event controls, but they
do not alter the outcome-surface determination.

## 6. User-Intent Inventory

“Define what matters,” recurring commitments, and planning rules live in Setup.
Schedule review, friction, suggested changes, and current occurrence reporting live
in Preview. Past-plan reporting also begins in Preview. Correction/retraction
begins in Preview’s Execution history. Historical understanding and evidence
limits live in Summary. This supports the workflow but requires a user to learn
that Preview means substantially more than a temporary schedule draft.

## 7. Setup Assessment

**Confirmed:** Setup is an ongoing authoring destination, not one-time onboarding.
It owns preferences, shifts, cycles, templates, recurrence, and preview range and
explicitly saves authored state (`SetupScreen.tsx:93-112,164-222`).

**Inferred:** its behavior already constitutes the authoring half of Planner.
“Setup” understates ongoing commitment maintenance, but its meaning is internally
consistent. Do not rename it in isolation.

## 8. Preview Assessment

**Confirmed:** Preview is simultaneously generation, draft schedule review,
friction resolution, accepted-decision management, contextual outcome reporting,
date-filtered report summary, past-plan reporting, and report correction/retraction
(`PreviewScreen.tsx:129-223,302-462`).

**Inferred:** schedule review/fixes are its core purpose; aggregate/history panels
are accumulated operational responsibilities. The surface is not redundant, but
the word Preview no longer describes everything reachable there.

## 9. Preview Lifecycle

Generate Preview saves the current Setup draft, generates, and opens Preview
(`DayFrameApp.tsx:1437-1451`). Preview is derived and excluded from Backup. Setup
changes mark it stale and disable current suggestions; copy requires regeneration
(`PreviewScreen.tsx:132-165`). Accepted fixes require explicit acceptance. Thus it
is an operative draft, not durable historical authority and not an external
calendar commitment.

## 10. Planner Mental-Model Assessment

**Product inference:** option A is best supported: Setup and Preview should
eventually converge under Planner, with authoring and schedule-review subordinate
views. Setup supplies Add/Edit Commitment behavior; Preview supplies Review
Schedule/Resolve Friction. Immediate convergence is not required for Task 4.5.

## 11. Summary Assessment

**Confirmed:** Summary promises a broad destination but honestly contains only a
History section and explicitly describes plan coverage, scheduled outcomes, and
evidence (`DayFrameApp.tsx:1405-1416,1453-1468`;
`HistoricalIntelligenceSummary.tsx:64-89`). It is read-only.

**Assessment:** sparse but truthful. “Summary” is acceptable as a bounded
foundation; “History” should remain its visible subsection. Adding placeholders
would weaken it.

## 12. Summary Growth Assessment

The component boundary, independent query state, evidence cards, one-column mobile
collapse, and top-level destination can accept later sibling sections. Growth
will require a Summary-level subsection structure, but no current rework is needed.
Future sections must remain absent until governed projections exist.

## 13. Outcome Summary Semantics

**Confirmed:** Preview’s visible heading is `Reported outcomes`, not “Outcome
Summary” (`ExecutionSummarySection.tsx:19-40`). It derives one current item per
ExecutionHistory subject, optionally filtered only by Preview start/end dates; it
does not require membership in the current Preview (`executionSummary.ts:18-33`).
It counts completed, partial, skipped, and retracted/unknown subjects under
`knownNotReportedSubjects` (`executionSummary.ts:79-85`). It has no planned
denominator or missing-plan semantics. A separate calculation underneath uses the
fresh current Preview as a reportable-occurrence denominator
(`executionSummary.ts:36-67`).

Therefore “In this Preview range” is date-scope copy, not a claim that all counted
subjects belong to that Preview. “Not reported” here means withdrawn known subject,
not Task 4.2’s eligible occurrence with no subject.

## 14. Completion Distribution Semantics

**Confirmed:** Summary resolves an explicit inclusive date range and cutoff through
the governed query, requires HistoricalPlan coverage, admits scheduled occurrences
only, and classifies completed, partial, skipped, unknown/retracted, and genuinely
not reported separately. It exposes the planned denominator, current-outcome
coverage, missing dates, exclusions, and frozen provenance
(`HistoricalIntelligenceSummary.tsx:45-60,93-145,173-183`).

## 15. Outcome Summary vs Completion Distribution

They are genuinely separate concepts with partial visual and vocabulary overlap.
The former is report-centric and has no complete plan denominator; the latter is
plan-centric historical analysis. They are not candidates for semantic
consolidation. Preview’s aggregate is a candidate for removal or relabeling because
Summary is now the better home for historical aggregate understanding.

## 16. Historical Reporting Semantics

Three concepts currently coexist:

- `Execution history`: reporting history—current reports and immutable revisions.
- `Report from plan history`: reporting **on** a frozen historical plan occurrence.
- Summary `History`: read-only historical analysis of plan plus observed evidence.

The generic phrase “historical reporting” is ambiguous and should not be a primary
product label.

## 17. Report-from-Plan-History Workflow

The Preview-embedded section selects a published plan date, reads the effective
HistoricalPlan day as of now, shows all scheduled/unplaced/omitted/blocked
occurrences, materializes their frozen target, and writes ExecutionHistory through
the shared report control (`HistoricalPlanReportingSection.tsx:13-62`). It remains
available even when no Preview exists (`PreviewScreen.tsx:84-110`).

**Assessment:** truthful and useful, but its location is transitional. It belongs
conceptually in operational reporting under eventual Planner, not in read-only
Summary.

## 18. Read/Write Boundary

The V1 principle is coherent:

```text
Planner / operational workflows → author intent or report reality
Summary → inspect derived understanding
```

Keep Summary read-only for now. Future recommendation acceptance might legitimately
write from Summary, but that requires separate semantics and does not invalidate
the present boundary.

## 19. Execution Reporting Placement

The capability belongs to an operational reporting workflow. Convenient entry
points should remain next to current schedule occurrences. Past reporting and
correction/retraction need one clearly labeled operational history area, ultimately
under Planner or a deliberate reporting destination—not analytical drill-down.

## 20. Historical Analysis Placement

Historical aggregate interpretation belongs in Summary. Preview may retain
current-schedule coverage as operational context, but should not remain the primary
home for broad report counts after Summary matures.

## 21. Current Schedule vs Historical Schedule

Current copy distinguishes “draft schedule” from “previously recorded as planned,”
but co-location weakens the distinction. Product vocabulary should call the former
current schedule draft and the latter past planned schedule; users need not see
`HistoricalPlan` or “authority.”

## 22. Planning User Journey

Setup → author preferences/shifts/cycles/templates/range → Generate Preview (also
saves) → Preview → review days/friction → try and accept fixes or return to Setup →
regenerate. Organizational friction: generation is encoded as a peer navigation
button and Setup/Preview split one Planner intent.

## 23. Reporting User Journey

Open Generate Preview → find occurrence and Report outcome, or scroll to Report
from plan history → choose date → find frozen occurrence → report completed,
partial, or skipped. Three outcome types share one form. Preview is required as the
navigation destination even when reporting needs no Preview, an avoidable context
switch.

## 24. Reflection User Journey

Open Summary → accept or change visible seven-day range → read plan coverage → read
five counts/reporting coverage → open count or missing/excluded details. No return
to Preview is required. This journey is coherent.

## 25. Correction User Journey

Open Generate Preview → scroll to Execution history → select subject → Correct
report or Retract report → inspect revisions (`ExecutionHistoryPanel.tsx:62-100`).
The behavior is sound; discoverability is weak because correction is nested beneath
a draft-schedule destination.

## 26. Missing-History User Journey

Summary states “available for N of M days,” limits counts to known plan history,
and lists missing dates. It preserves uncertainty. It does not explain likely
reasons or remediation—which is acceptable because the system cannot safely infer
cause. A small copy addition could say “DayFrame cannot determine planned work for
missing dates.”

## 27. Current Cognitive Model

The actual model taught is:

```text
Configure → Generate/review → Report/correct → Review historical Summary
```

The visible labels instead suggest `Setup → Generate Preview → Summary`, obscuring
the operational reporting step.

## 28. Navigation Assessment

Setup and Summary are destinations. Generate Preview is a command that also opens
a destination and mutates/saves/generates. The choices are therefore not semantic
peers. The shell works mechanically and responsively but is only transitionally
coherent.

## 29. Destination-vs-Action Assessment

**Confirmed:** pressing Generate Preview runs generation, while pressing Setup or
Summary only navigates (`DayFrameApp.tsx:1420-1468`).

**Recommendation:** make navigation destination-only; place Save/Generate or
Regenerate as explicit actions inside the operational surface. This is a Task 4.5
change, not an audit mutation.

## 30. Planner/Summary Two-Surface Hypothesis

Supporting evidence: Setup + Preview together cover every implemented Planner
responsibility; Summary is purely derived/read-only. Contradiction: reporting
history is nested under Preview and the shell still has three top-level choices.
Unresolved: whether reporting becomes a Planner subsection or later contextual
overlay. Determination: hypothesis supported directionally, not yet implemented.

## 31. Terminology Audit

- Summary: broad but acceptable foundation.
- History: understandable subsection.
- Plan history: accurate but mildly architectural; pair with plain explanation.
- Scheduled outcomes: clearest current historical distribution label.
- Completed/Partial/Skipped: consistent.
- Unknown: accurate only with retraction explanation, which exists.
- Not reported: accurate in Summary; conflicting in Preview aggregate.
- Execution reporting coverage: accurate but technical; “Reported outcomes” may be clearer with denominator copy.
- Details: accessible and contextual.
- Report from plan history: accurate but awkward; “Report a past planned occurrence” is clearer.

## 32. Product Vocabulary Proposal

| Concept | Recommended product term |
|---|---|
| current derived plan | schedule draft |
| frozen historical plan | past planned schedule / plan history |
| assertion of reality | reported outcome |
| immutable report revisions | report history |
| derived historical analysis | History in Summary |
| classified / eligible count | reporting coverage |
| no subject/report | not reported |
| withdrawn current evidence | unknown (report withdrawn) |

Avoid `HistoricalPlan`, `ExecutionHistory`, “denominator,” and “projection” in
product copy.

## 33. Information Duplication

Outcome counts are partially overlapping and currently harmful because identical
labels have different populations. Plan context repeats usefully beside report
controls and Summary evidence. Execution records repeat usefully as aggregate and
editable detail, but Preview’s aggregate is now transitional. Reporting coverage
repeats with different denominators and needs explicit “current schedule” versus
“selected history” scope.

## 34. Action Duplication

Report outcome appears beside current Preview occurrences and past-plan rows; this
is useful contextual duplication backed by one workflow. Undo is contextual;
correct/retract live in report history. Summary drill-down has no write action and
should remain so. No harmful duplicate mutation implementation was found.

## 35. Empty-State Consistency

Summary carefully distinguishes missing plan, published empty, zero eligible, and
not reported. Preview distinguishes no Preview and no outcomes, but `No outcomes
reported in this period` does not distinguish no subjects from withdrawn-only
subjects clearly, and its aggregate’s retraction-as-not-reported vocabulary differs
from Summary. This is a bounded copy/responsibility issue.

## 36. Error-State Consistency

Generation guardrails describe missing Setup; stale Preview describes invalidated
derived state; protected history describes recovery; quarantine describes excluded
preserved evidence; unexpected Summary rejection is an error alert. These are
mostly distinct. Protected/unavailable messages use danger styling even when the
condition is epistemic/recovery state, which is acceptable but merits later visual
tone review.

## 37. Product Epistemic Integrity

Task 4.3 preserves known fact, known absence, missing evidence, withdrawn evidence,
and protected authority. The only material weakness is Preview’s presentation of
withdrawn evidence as `Not reported`, while Summary uses `Unknown`; production
semantics are safe, but product terminology is inconsistent.

## 38. Accessibility Findings

Navigation uses a named `nav`, buttons, `aria-pressed`, focus-visible styles, and
mobile stacking. Summary has labeled dates, semantic headings, native disclosures,
named count buttons, expanded state, live loading, and alerts. Reporting controls
use labels/fieldsets/statuses; history rows have contextual accessible names.
Obvious issues: selecting a Summary category inserts details without programmatic
focus, and long Preview content makes operational history expensive to reach by
keyboard. These are UX refinements, not evidence of inaccessible semantics.

## 39. Responsive UX Findings

At ≤720px navigation, ranges, and distribution cards become single-column. The
individual controls remain usable, but the very long Preview linearizes schedule,
report summary, past-plan reporting, friction, and execution history, increasing
context switching and scroll cost. Responsibility cleanup matters more on mobile.

## 40. Surface Responsibility Matrix

| Capability | Setup | Preview | Summary | Recommended long-term owner |
|---|---:|---:|---:|---|
| author commitments | primary | contextual fixes | absent | Planner |
| generate schedule | transitional | primary | absent | Planner |
| review schedule | absent | primary | absent | Planner |
| resolve friction | contextual edit | primary | absent | Planner |
| report execution | absent | primary/contextual | absent | Planner operational reporting |
| correct/retract | absent | transitional | absent | Planner operational reporting |
| inspect historical plan | absent | transitional | contextual evidence | Planner for reporting; Summary for analysis |
| inspect outcome distribution | absent | transitional | primary | Summary |
| inspect reporting coverage | absent | current-Preview contextual | primary historical | scope-specific owners |
| inspect historical provenance | absent | report-history contextual | primary | Summary |

## 41. Responsibility Matrix

| User intent | Current surface | Current mechanism | Long-term natural home | Assessment |
|---|---|---|---|---|
| define priorities/setup | Setup | authored forms/save | Planner authoring | correctly placed, label transitional |
| review generated schedule | Preview | day cards/visualizer | Planner schedule | correctly placed |
| resolve friction | Preview + Setup | fixes/field focus | Planner | correctly placed |
| report execution | Preview | occurrence/report control | Planner operational | acceptable contextual placement |
| correct/retract | Preview | Execution history | Planner operational | misplaced discoverability |
| inspect historical plan | Preview/Summary | past reporting / evidence | split by write/read purpose | ambiguous but semantically valid |
| understand historical outcomes | Preview/Summary | report counts / distribution | Summary | duplicated/ambiguous |
| inspect missing evidence | Summary | coverage/details | Summary | correctly placed |

## 42. Outcome Comparison Matrix

| Concern | Preview Reported outcomes | Summary Scheduled outcomes |
|---|---|---|
| primary purpose | summarize current report subjects | analyze scheduled plan outcomes |
| time scope | all history or Preview date bounds | explicit selected historical dates + cutoff |
| planned denominator | none | effective scheduled HistoricalPlan occurrences |
| execution authority | ExecutionHistory | ExecutionHistory joined to HistoricalPlan |
| missing-plan handling | none | complete/incomplete/unavailable |
| not-reported handling | retracted known subject labeled not reported | eligible scheduled occurrence with no subject |
| unknown/retraction | collapsed into not reported | distinct Unknown |
| correction | current chain head | current chain head classification |
| provenance | source-family counts; editable history elsewhere | per-occurrence frozen evidence |
| user action | report/correct/retract nearby | read-only drill-down |
| mental model | report-centric operational state | plan-centric historical reflection |

## 43. Terminology Consistency Matrix

| Concept | Current term(s) | Surface(s) | Semantic issue | Recommended direction |
|---|---|---|---|---|
| authored planning | Setup | Setup | sounds initial-only | Planner authoring eventually |
| generated schedule | Generate Preview, Preview, draft | shell/Preview | action/destination collision | Preview destination + explicit Generate |
| execution reporting | Report outcome | Preview | clear contextually | retain contextual entry |
| historical plan | Plan history, published plan | Preview/Summary | architecture-adjacent | past planned schedule + explanation |
| current outcomes | Reported outcomes | Preview | scope includes all date-matched subjects | remove or explicitly say report history |
| historical outcomes | Scheduled outcomes | Summary | clear with History context | retain |
| reporting coverage | Current Preview / Execution reporting | both | scope differs | qualify current schedule vs selected history |
| missing history | missing plan dates/no publication | both | mostly consistent | say DayFrame cannot determine planned work |

## 44. Duplication Matrix

| Function/information | Surface A | Surface B | Same semantics? | Assessment | Recommendation |
|---|---|---:|---:|---|---|
| completed/partial/skipped counts | Preview | Summary | no | harmful naming overlap | make Summary sole historical aggregate |
| reporting coverage | Preview | Summary | no | useful contextual repetition | qualify scope visibly |
| plan-history rows | Preview | Summary | no | useful write/read split | rename write workflow |
| frozen occurrence context | report controls | Summary drill-down | yes evidence, different purpose | useful repetition | retain |
| report history | Execution history | Summary categories | partial | contextual | keep editable history operational |
| occurrence reporting | current Preview rows | past-plan rows | same action, distinct contexts | useful duplication | retain entry points |

## 45. Read/Write Matrix

| Capability | Reads authority | Writes authority | Current surface | Recommended product class |
|---|---|---|---|---|
| schedule review | Active + Preview + decisions | none unless fix chosen | Preview | Planner operational |
| execution report | Preview/HistoricalPlan + ExecutionHistory | ExecutionHistory | Preview | Planner operational |
| correction | ExecutionHistory | ExecutionHistory revision | Preview | Planner operational history |
| retraction | ExecutionHistory | ExecutionHistory revision | Preview | Planner operational history |
| historical distribution | HistoricalPlan + ExecutionHistory | none | Summary | Summary analytical |
| historical drill-down | derived provenance | none | Summary | Summary analytical |

## 46. Historical Authority Visibility

Users should understand three truths without architecture terms: what DayFrame had
planned; what the user currently reported; and what DayFrame can summarize from
both. “Past planned schedule,” “reported outcome/report history,” and “History
summary” preserve that boundary. Missing plan days must remain visibly different
from unreported scheduled occurrences.

## 47. Next-Metric Readiness

**Ready after bounded UX refinement.** The derived architecture and Summary
component can support another projection, but current outcome naming and Preview’s
overloaded responsibilities would make a second distribution harder to explain.
Clean the surface boundary first.

## 48. Scheduling Realization Candidate Assessment

Scheduling Realization naturally belongs beside Scheduled outcomes because it
answers “could DayFrame place it?” rather than “what was reported?” Its explicit
scheduled/unplaced/omitted/blocked counts could clarify the excluded-occurrence
disclosure. Today, however, “outcomes” already spans scheduling and execution
language; adding it before refinement would worsen ambiguity. Deferred behind Task
4.5, likely the stronger next metric afterward.

## 49. Planned Allocation Candidate Assessment

Historical category/source allocation could establish future Allocations, but its
product question and denominator need separate governance and it risks being read
as actual time spent. The current Summary layout can host it later. It is less
urgent than explaining plan placement and remains deferred.

## 50. UX Refinement Candidate Assessment

The smallest valuable refinement is to:

1. separate top-level destination navigation from Generate/Regenerate commands;
2. make Preview’s schedule-review purpose explicit as the operational Planner path;
3. remove or relocate its ambiguous aggregate `Reported outcomes`, retaining only
   clearly scoped current-schedule reporting coverage where useful;
4. rename `Report from plan history` and `Execution history` around user purposes;
5. keep contextual report buttons and Summary read-only;
6. add scope copy distinguishing current schedule, past planned schedule, report
   history, and selected Summary history.

This does not require a scheduling rewrite or full Planner merger.

## 51. Product Architecture Determination

**Determination B — Coherent with bounded refinement.** Authority and analytical
boundaries are sound. The problem is surface responsibility and vocabulary, not
domain architecture. A small cleanup should precede metric expansion.

## 52. Governance Assessment

Current governance accurately states that Summary exists with History only,
Completion Distribution is derived, Preview retains operational/reporting
functions, and Planner/Summary is directional. It did not yet record the concrete
Preview aggregate naming conflict or the Task 4.5 decision. The Phase 4 checkpoint,
Current State, Roadmap, and Changelog are minimally updated by this audit.

## 53. Deviations

No UI mutation, rename, movement, new test, or new metric was made, per the audit
scope. Line references identify component/symbol boundaries rather than unstable
multi-line exact ranges where formatting may change.

## 54. Open Questions

- Should operational report history become a Planner subsection or later dedicated destination?
- After aggregate cleanup, is current-schedule reporting coverage useful enough to retain in schedule review?
- Do users understand “plan history,” or is “past planned schedule” consistently clearer?
- Should Summary category selection move focus to inserted details?
- How should large historical ranges paginate or group evidence if usage requires it?

These questions do not invalidate Determination B.

## 55. Recommended Task 4.5

**Task 4.5 — Clarify Planner/Preview Navigation, Outcome Scope, and Operational Reporting Responsibilities V1**

Bound it to destination/action separation, Preview/Summary scope copy, removal or
relocation of the ambiguous Preview aggregate, clearer names for past-plan
reporting and editable report history, preserved contextual reporting controls,
and accessibility/mobile regression coverage. Do not merge Setup and Preview fully,
add a metric, or change domain semantics.

## 56. Deferred Candidates

After Task 4.5, reconsider Scheduling Realization V1 first. Planned Allocation,
full Planner convergence, comparisons, trends, Goals, Progress, Recommendations,
learning, and any composite score remain separately deferred and unauthorized.

## 57. Final Audit Determination

Task 4.4 is complete. The current experience preserves trustworthy authority
semantics and supports the Planner/Summary direction, but the shell mixes command
and destination semantics and Preview combines schedule review with operational
and aggregate history. The two outcome calculations are distinct; their visible
vocabulary is not distinct enough. Summary should remain read-only, and the single
next task is the bounded Task 4.5 UX/responsibility refinement above—not another
historical metric.
