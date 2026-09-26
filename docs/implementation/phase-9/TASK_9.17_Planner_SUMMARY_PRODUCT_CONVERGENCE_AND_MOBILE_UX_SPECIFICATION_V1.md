# Task 9.17 — Planner / Summary Product Convergence & Mobile UX Specification V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Product Architecture / Information Architecture / UX Specification / Mobile Interaction Contract / Pre-Migration Audit  
**Primary Inputs:**  
- Dogfood Pass 02 findings  
- Task 9.8C — Post-Dogfood Product Reachability & Workflow Audit  
- Task 9.9 — Pre-Migration Correctness & Authority Convergence V1  
- Tasks 9.10–9.16 — First-Class Sleep architecture and completed authority lifecycle  
**Prerequisites:**  
- Task 9.16 — First-Class Sleep Legacy Conversion & Product Transition V1 — COMPLETE  
**Implementation Changes:** **NOT AUTHORIZED EXCEPT SPECIFICATION / AUDIT ARTIFACTS**  
**UI Migration:** **PROHIBITED IN THIS TASK**  
**Persistence Changes:** **PROHIBITED**  
**Schema Changes:** **PROHIBITED**  
**Engine Changes:** **PROHIBITED**  
**Mobile-First Requirement:** **MANDATORY**  
**Required Durable Output:** `PHASE_9_TASK_9_17_PLANNER_SUMMARY_PRODUCT_CONVERGENCE_MOBILE_UX_SPECIFICATION_V1_RESULT.md`

---

## 1. Objective

Define the canonical DayFrame product surface architecture that will govern the upcoming UI convergence.

Task 9.17 must inspect the actual current product, preserve the useful capabilities already implemented, reconcile those capabilities with the accepted DayFrame architecture, and produce an implementation-ready specification for a two-surface product:

```text
Planner
Summary
```

with a reusable:

```text
Day Worksurface
```

inside Planner.

The task must determine:

```text
what belongs in Planner
what belongs in Summary
what belongs in the Day Worksurface
what remains contextual
what becomes drill-down
what legacy surface disappears
what legacy surface is merged
what legacy surface remains temporarily
what authority/read model each surface may consume
what actions each surface may invoke
how navigation behaves
how mobile interaction behaves
how dense schedule information is progressively disclosed
```

This is a **product convergence specification**, not a component-moving exercise.

Do not implement the migration in Task 9.17.

---

## 2. Governing Product Principle

The accepted product mental model is:

```text
Planner
    ↓
What am I doing?
When am I doing it?
What owns my time?
What needs my attention?
What can I change?

Summary
    ↓
How is my plan working?
What capacity do I have?
How are my Goals progressing?
What has actually happened?
What patterns or recommendations deserve attention?
```

The governing distinction is:

> **Planner is the operational surface. Summary is the reflective surface.**

Planner is where the user works with the schedule.

Summary is where the user understands the consequences and history of that schedule.

Do not duplicate the same primary workflow across both surfaces.

---

## 3. Mobile-First Governing Principle

DayFrame must be mobile-friendly at every level of the convergence.

This is not:

```text
desktop UI
    ↓
CSS media query
    ↓
smaller desktop UI
```

The intended model is:

```text
shared product semantics
        ↓
mobile-first interaction hierarchy
        ↓
progressive disclosure
        ↓
larger-screen enhancement
```

The specification must therefore define each canonical workflow first under constrained mobile conditions.

Desktop may expose more information simultaneously.

Desktop may not become the only practical way to use DayFrame.

---

## 4. Mobile Usability Is a Completion Requirement

Every migrated product capability must ultimately be usable on a phone without requiring:

```text
horizontal page scrolling
hover
right-click
double-click
mouse precision
desktop-width tables
permanent multi-column layouts
tiny icon-only controls with unclear meaning
dense architecture terminology
opening several browser tabs
developer tools
```

Desktop affordances may supplement but may not be the only route to a canonical action.

---

## 5. Canonical Navigation Target

The target primary navigation is:

```text
Planner
Summary
```

Task 9.17 must audit whether any currently exposed primary destination contains functionality that cannot safely converge beneath those two surfaces.

Do not assume removal merely because a surface is old.

Trace its capabilities first.

The specification must account for every current primary navigation destination.

---

## 6. Planner Product Model

Planner should become the canonical operational environment.

Conceptually:

```text
Planner
│
├── Calendar
│   ├── Month
│   ├── selected day
│   └── planning / cycle context
│
├── Day Worksurface
│   ├── planned schedule
│   ├── Work
│   ├── required Sleep
│   ├── Commitments
│   ├── Goal work
│   ├── support activity
│   ├── protected buffers
│   ├── manual events
│   ├── Found Time
│   ├── execution reporting
│   └── attention / Friction
│
├── My Schedule
│   ├── Work Pattern
│   ├── Sleep
│   └── Commitments
│
├── Goals
│
└── Review Plan
    ├── planning readiness
    ├── proposals
    ├── accepted planning
    ├── Friction
    ├── corrective actions
    └── publication
```

This is a semantic hierarchy.

Task 9.17 must determine the actual interaction structure.

Do not implement this tree literally without evidence.

---

## 7. Summary Product Model

Summary should become the canonical reflective environment.

Conceptually:

```text
Summary
│
├── Capacity
├── Goals
├── Allocations
├── Progress
├── History
└── Recommendations / Attention
```

The Summary must emphasize:

```text
summary
    ↓
drill-down
```

rather than displaying every underlying record by default.

Task 9.17 must determine which existing Summary capabilities belong here and which operational controls should move to Planner.

---

## 8. Day Worksurface

The Day Worksurface is a central requirement of the convergence.

Current product behavior contains overlapping concepts including:

```text
Selected DayFrame Day
Today
Daily Workspace
month-day detail
manual event workflow
Goal work
execution reporting
Friction / attention
```

Task 9.17 must specify one reusable Day Worksurface.

Conceptually:

```text
Day Worksurface(date)
```

The same product object should support:

```text
current canonical DayFrame day
past day
future day
selected month day
```

with capabilities varying lawfully according to authority and time.

---

## 9. Today Is Not a Separate Product Destination

The target model is:

```text
Today
=
Planner opened to current canonical DayFrame day
```

Today may remain:

```text
shortcut
navigation action
home affordance
```

but should not remain a parallel product architecture with duplicated day semantics.

Task 9.17 must audit the current Today implementation and identify everything that must survive convergence.

---

## 10. Selected Day and Today Convergence

Audit differences between:

```text
Selected DayFrame Day
Today
Daily Workspace
calendar day detail
```

For each capability determine whether it belongs in:

```text
Day Worksurface core
current-day-only extension
past-day extension
future-day extension
contextual action
```

Do not simply choose one existing component as canonical.

Specify the semantic union first.

---

## 11. Day Worksurface Temporal Modes

At minimum specify:

```text
Past Day
Current Day
Future Day
```

### Past Day

Likely emphasizes:

```text
published plan
actual execution
completion reporting
corrections
historical evidence
manual after-the-fact reporting where lawful
```

### Current Day

Likely emphasizes:

```text
published plan
actual execution
current schedule
mark complete
partial completion
didn't do it
Found Time
attention
```

### Future Day

Likely emphasizes:

```text
published / planned schedule
manual authored events
Goal planning context
Friction
adjustment / review paths
```

Determine exact lawful capabilities from existing authority.

---

## 12. Canonical Day Orientation

The Day Worksurface must clearly communicate the DayFrame day being viewed.

Especially under:

```text
night shift
non-midnight Day Boundary
cycle transition
overnight Work
cross-midnight Sleep
```

the user must not have to infer ownership from civil dates alone.

Specify a compact mobile-friendly orientation treatment.

Possible information includes:

```text
DayFrame day label
civil date
cycle / shift context
boundary context when relevant
Today indicator
transition indicator
```

Do not expose unnecessary architecture terminology.

---

## 13. Calendar Is a Navigation Surface

The calendar must remain useful even when no current generated Preview exists.

Canonical principle:

> **Calendar navigation is not computation authority.**

The user should be able to:

```text
browse dates
open Day Worksurface
inspect authored/manual information
inspect published history where available
```

without first generating a schedule merely to make the calendar function.

---

## 14. Calendar Horizon Is Not Planning Horizon

Preserve the distinction between:

```text
calendar navigation
Planning Data Horizon
Proposal Horizon
Review Scope
Preview
Publication Range
```

Do not constrain ordinary calendar navigation to the active planning range.

Do not imply that navigating to a date generates authoritative planning truth for that date.

---

## 15. Month Surface

The Month view should represent an actual calendar month.

Audit current behavior and specify:

```text
Previous Month
Next Month
Today
selected day
cycle transition markers
Work / Sleep / Commitment / Goal-work indicators
attention / Friction indicators
publication/history state where useful
```

Avoid overcrowding individual mobile calendar cells.

The month should support orientation and navigation, not become a miniature schedule renderer.

---

## 16. Month Mobile Interaction

On mobile, month cells must remain touchable and legible.

Specify a minimum interaction model such as:

```text
tap day
    ↓
select/open Day Worksurface
```

Do not require:

```text
double-click
hover
precision target
```

If desktop supports double-click as an accelerator, tap/click must still provide the complete canonical path.

---

## 17. Continuous Calendar Principle

The Planner calendar should behave as a continuous calendar/logging surface rather than a temporary visualization tied to a generated Preview.

Task 9.17 must specify what information can appear when:

```text
no Preview exists
Preview is stale
planning coverage unavailable
publication exists
historical execution exists
```

The absence of derived planning must not make the calendar unusable.

---

## 18. My Schedule

Use:

```text
My Schedule
```

as the working umbrella for recurring authored time structure unless audit evidence identifies a better established product term.

Conceptually:

```text
My Schedule
├── Work Pattern
├── Sleep
└── Commitments
```

Task 9.17 must specify how this is reached from Planner and how each subsection behaves on mobile.

---

## 19. Work Pattern

Preserve the useful Work Pattern capabilities while addressing dogfood findings.

Audit:

```text
repeating sequence
dated cycle/segment model
cycle naming
segment naming
week start
cycle start
Day Boundary
transition behavior
planning range relationship
```

The specification must clarify the canonical product representation of the two observed Work configuration generations.

Do not redesign the Work engine in Task 9.17.

If an architectural ambiguity remains, identify it as a future bounded task.

---

## 20. Day Boundary Placement

Day Boundary is conceptually related to Work Pattern and canonical-day orientation.

Task 9.17 must specify where users discover and edit it.

Avoid burying it in unrelated advanced controls.

Mobile presentation should explain the effect without requiring understanding of canonical-time terminology.

---

## 21. Planning Rhythm

Dogfood identified that different cycles may naturally imply different planning rhythm/week-start context.

Task 9.17 must audit current effective week-start semantics and specify how, if at all, this appears in the product.

Do not create new engine semantics.

A visual:

```text
cycle boundary
week boundary
planning rhythm marker
```

may be specified if supported by existing architecture.

---

## 22. Sleep

First-Class Sleep is now a complete authority lifecycle.

The convergence must treat Sleep as first-class product configuration.

Do not place it back under generic Commitments merely because legacy Sleep once lived there.

Specify:

```text
where Sleep configuration lives
how its requirement is summarized
how editing is reached
how unresolved Sleep Friction appears
how accepted placement review appears
how legacy conversion is reached when relevant
```

The deep architecture remains Tasks 9.10–9.16.

---

## 23. Commitments

Commitments remain authored recurring time obligations/activities distinct from required Sleep and Goal work.

Task 9.17 must audit and specify mobile-friendly authoring/editing for:

```text
title
duration
recurrence
placement
Work-relative behavior
buffers
priority
enabled state
advanced options
```

Do not implement redesign.

---

## 24. Commitment Advanced Options

Dogfood found that Advanced Options could open for every Commitment simultaneously.

Target behavior should be contextual to the Commitment being edited.

Specify:

```text
one Commitment
    ↓
edit surface
    ↓
advanced options for that Commitment
```

not a global expansion state across the entire collection.

---

## 25. Human Time Entry

Dogfood identified minutes-only and awkward hour controls.

The convergence specification must define a human-friendly mobile duration-entry pattern.

At minimum consider:

```text
hours
minutes
```

without requiring users to mentally convert:

```text
2 hours → 120 minutes
```

Do not change internal minute-based domain representation merely for presentation.

---

## 26. Time Input Normalization

Specify expected user-facing behavior for time controls.

For example, minute editing should not create awkward dead-end values merely because an HTML control stops at 59.

Determine whether the product should use:

```text
native time input
hour/minute segmented control
duration picker
other touch-friendly control
```

based on existing implementation constraints.

No implementation in 9.17.

---

## 27. Recurrence UX

Audit the current recurrence editor.

The specification must distinguish:

```text
Commitment recurrence
Goal Demand recurrence/applicability
Work Pattern recurrence
Sleep applicability
```

Do not force all four through one UI abstraction merely because they involve repeated dates.

---

## 28. Goals as a Planner-Level Destination

Goal creation/editing must no longer be discoverable only through Daily Workspace.

Planner must expose Goals directly.

Specify:

```text
Goal list
create Goal
Goal detail
edit Goal
Goal Structure
planning intent / Demand
planning status
scheduled Goal work
Progress context
```

without collapsing all Goal architecture into one dense form.

---

## 29. Goal Structure

Task 9.8 established Goal Structure in the architecture.

Task 9.17 must audit its current product reachability and specify how decomposition should be presented.

Potential model:

```text
Goal
├── milestone / child Goal
├── milestone / child Goal
└── planning intent
```

Use actual implemented semantics.

Do not invent a new Goal Structure model.

---

## 30. Goal Planning Intent

The product must distinguish:

```text
Goal outcome
planning intent / Demand
scheduled Goal work
Progress
```

Do not use one generic “Plan” label for all of them.

Task 9.17 must propose user-facing terminology that preserves semantic distinction without exposing unnecessary architecture vocabulary.

---

## 31. Goal Effort Input

Dogfood identified that Goal effort should support human-friendly expression.

Specify a mobile-friendly interaction capable of representing existing semantics such as:

```text
10 hours total
20 hours total
```

and evaluate whether existing architecture can also support a presentation like:

```text
5 sessions × 1 hour
```

without changing domain meaning.

If session semantics would require architecture changes, defer them explicitly.

---

## 32. Ongoing Goals

Audit whether current Goal date semantics can represent ongoing Goals lawfully.

Do not invent architecture.

If ongoing Goals remain unsupported, Task 9.17 must identify:

```text
what product limitation remains
what future bounded architecture work is required
```

rather than hiding the limitation behind UI.

---

## 33. Recurring Goal Demand

Likewise audit recurring Goal Demand.

Preserve:

> **Goal Demand recurrence is not Commitment recurrence.**

If recurring Demand is not yet architecturally complete, identify it as deferred rather than approximating it in convergence.

---

## 34. Goal Provenance

Dogfood showed that multiple accepted Goal-planning iterations can accumulate and scheduled work may not make provenance understandable.

Task 9.17 must specify how users can answer:

```text
Why is this Goal work on my schedule?
Which Goal is it part of?
Which accepted planning decision produced it?
Is this current or superseded planning?
```

without forcing ordinary users to inspect allocation IDs.

---

## 35. Scheduled Goal Work Card

Use the dogfood target as a product-design input.

Conceptually:

```text
Network+ Study
3:15–4:15 PM

Part of Network+.

DayFrame scheduled this when you accepted your plan.

[View Goal] [Adjust Plan]

Afterward:
[Mark complete]
[Partially completed]
[Didn't do it]
```

Task 9.17 must determine the canonical information/action hierarchy.

Do not treat this exact copy/layout as mandatory if audit reveals better existing terminology.

---

## 36. Found Time

Task 9.17 must explicitly resolve the product location and interaction model for Found Time.

Found Time is not:

```text
scheduled Goal work
Proposal
manual generic Event
```

even if it may share Progress consequences with some of them.

Specify the ordinary-user path for recording:

```text
I unexpectedly had time and worked on Goal X.
```

Audit current Manual Event and Goal association capabilities.

Do not invent automatic Progress semantics that the architecture does not support.

---

## 37. Manual Events

Manual Events should remain directly reachable from the Day Worksurface.

Specify:

```text
create
edit
delete with confirmation
Goal association if currently supported/lawful
historical-day behavior
future-day behavior
```

Distinguish Manual Event from Found Time where their semantics differ.

---

## 38. Execution Reporting

The Day Worksurface must make execution reporting an obvious part of using DayFrame rather than a hidden historical workflow.

Audit all existing execution subjects and product paths.

For applicable planned items, consider a common interaction family:

```text
Complete
Partial
Didn't do it
```

while preserving subject-specific semantics.

Do not force unsupported subjects into a generic execution model.

---

## 39. After-the-Fact Reporting

Dogfood found that historical-day reporting was difficult to reach.

Task 9.17 must specify the lawful past-day path:

```text
Calendar
    ↓
Past Day
    ↓
Day Worksurface
    ↓
eligible planned item
    ↓
record / correct outcome
```

subject to existing immutable publication/execution authority.

---

## 40. Friction as Attention

Ordinary users should not need to understand the architecture term:

```text
Friction
```

before they can fix a schedule problem.

Task 9.17 must specify the product distinction between:

```text
technical/domain term: Friction
user-facing concept: schedule conflict / needs attention
```

where appropriate.

Do not rename internal architecture merely for UI.

---

## 41. Review Plan

Review Plan should become the contextual Planner workflow for:

```text
planning readiness
constructive proposals
accepted planning
unresolved conflicts
corrective actions
publication
```

Task 9.17 must audit all existing Review Schedule / planning review surfaces and specify their convergence.

---

## 42. Constructive and Corrective Planning Must Remain Distinct

Preserve:

```text
Proposal
=
constructive planning

SuggestedFix
=
corrective response to Friction
```

The product may present both under Review Plan.

It must not merge their authority semantics.

---

## 43. Planning Readiness

Architecture-heavy readiness text currently leaks implementation language.

Specify a user-facing readiness hierarchy.

Potential model:

```text
Ready to publish

Needs attention
- 2 schedule conflicts
- Sleep placement needs review

Planning incomplete
- schedule coverage unavailable
```

The exact taxonomy must derive from current read models.

Do not invent false certainty.

---

## 44. Publication

Publication remains explicit.

The convergence must not turn:

```text
Generate
Review
Publish
```

into an implicit save chain.

Specify where Publish lives and what the user sees immediately before invoking it.

---

## 45. Preview Retirement

Dogfood strongly suggests the old Preview navigator should be retired as a primary product concept rather than polished.

Task 9.17 must audit every capability currently available only through Preview.

Classify each as:

```text
move to Planner calendar
move to Day Worksurface
move to Review Plan
developer/internal only
obsolete
must remain temporarily
```

Do not remove anything without accounting for its capability.

---

## 46. Planning Range

Planning Range should be contextual to planning/Work configuration rather than hidden far from the model it affects.

Audit current control ownership.

Specify:

```text
where planning range belongs
how much ordinary users need to see
what advanced detail can be hidden
```

Preserve architecture distinctions among planning horizons.

---

## 47. Resolve Schedule Conflicts

Audit the current legacy corrective surface, including the date tower and any inert-looking controls.

Determine which interactions remain useful.

The new product path should conceptually be:

```text
Planner
    ↓
Needs Attention
    ↓
Conflict
    ↓
Suggested correction
    ↓
Try
    ↓
Accept
```

where existing authority permits.

---

## 48. Repeated Friction

Specify mobile handling for many similar conflicts.

Do not display an enormous unstructured list by default.

Consider:

```text
grouping
summary counts
expand-on-demand
batch review
```

but preserve the rule:

> Bulk correction must still flow through existing Friction → SuggestedFix → decision authority.

No silent bulk replanning.

---

## 49. Summary — Capacity

Capacity belongs primarily in Summary as an explanatory/read-model surface.

Specify:

```text
available capacity
protected/unavailable time
unknown/incomplete capacity
drill-down
```

without presenting unknown as zero.

Operational actions discovered from Capacity should deep-link back into Planner where appropriate.

---

## 50. Summary — Goals

Summary Goal presentation should answer:

```text
How are my Goals going?
What progress has been recorded?
What is scheduled?
What is at risk or incomplete?
```

without becoming the primary Goal authoring surface.

Goal editing belongs in Planner.

---

## 51. Summary — Allocations

Accepted allocation/planning information should be summarized rather than rendered as enormous realization lists.

Specify:

```text
current accepted planning
superseded/historical planning
scheduled realization
unrealized accepted intent
drill-down
```

Preserve provenance.

---

## 52. Summary — Progress

Progress remains independent from schedule geometry.

Task 9.17 must audit existing Progress and measurement surfaces.

Specify a hierarchy that distinguishes:

```text
Goal Progress
execution outcomes
measured values
historical activity
```

where the architecture does.

---

## 53. Summary — History

History should provide bounded reflection and drill-down.

Do not make the user choose an enormous arbitrary range before anything useful appears.

Audit current defaults and specify a sensible initial Summary scope using existing query capabilities.

Do not change historical authority.

---

## 54. Summary — Recommendations / Attention

Audit what recommendation/intelligence surfaces actually exist.

Do not fabricate AI recommendations merely to fill the section.

If no meaningful recommendation exists:

```text
omit/collapse the section
```

rather than showing empty noise.

---

## 55. Empty-State Discipline

Dogfood found empty attention surfaces noisy.

Canonical principle:

> **Absence of a problem should usually reduce UI, not create another box saying there is no problem.**

Specify which empty states deserve:

```text
nothing
small confirmation
onboarding guidance
explicit unavailable/protected state
```

Do not hide meaningful unknown/protected conditions.

---

## 56. Progressive Disclosure

Mobile DayFrame must not present all architectural detail simultaneously.

Use progressive disclosure.

Conceptually:

```text
Summary
    ↓
important items
    ↓
expand
    ↓
detail
    ↓
technical provenance only when needed
```

Task 9.17 must identify where current screens violate this principle.

---

## 57. Mobile Information Density

Audit surfaces with:

```text
long realization lists
date towers
Proposal lists
Friction lists
historical lists
Commitment collections
Goal collections
```

For each specify a mobile strategy:

```text
card
group
accordion
summary count
filter
detail route
bottom sheet
modal
progressive expansion
```

Do not prescribe a control merely because it is fashionable.

Choose based on workflow semantics.

---

## 58. Touch Targets

The implementation specification must require practical touch targets for primary controls.

Do not encode critical actions as tiny adjacent text links.

Where destructive/authoritative actions are adjacent:

```text
Accept
Reject
Delete
Publish
Revoke
```

the design must reduce accidental activation.

Use platform-appropriate touch sizing during implementation.

Task 9.17 should specify the principle, not arbitrary CSS unless repository design tokens already establish it.

---

## 59. One-Handed Use

For common mobile workflows, prioritize reachable primary actions.

Examples:

```text
open today
select day
mark complete
add event
record Found Time
review conflict
```

Task 9.17 should identify which actions are common enough to deserve prominent placement.

Do not optimize rare destructive administration at the expense of everyday use.

---

## 60. Sticky / Persistent Actions

Audit whether mobile workflows benefit from a bounded persistent action region.

Potential examples:

```text
Add
Today
Review
Publish
Save
```

Do not allow sticky controls to obscure schedule content or duplicate every action.

Specify where persistent actions are justified.

---

## 61. Forms on Mobile

Long authoring forms should not expose every advanced field at once.

Specify form hierarchy such as:

```text
Essential
Advanced
```

where architecture allows.

Critical semantic choices must not be hidden merely because they are complex.

---

## 62. Mobile Keyboards

Audit inputs likely to trigger awkward keyboard behavior.

Specify appropriate input modes for:

```text
time
duration
numeric quantity
Goal effort
dates
text
```

Ensure save/confirmation actions remain reachable while the virtual keyboard is present.

---

## 63. Dialogs and Overlays

Avoid desktop-sized modal dialogs on narrow screens.

Specify when an interaction should become:

```text
full-screen mobile sheet/page
bottom sheet
inline expansion
dialog
```

based on complexity and authority.

Authoritative multi-step operations such as publication or legacy Sleep conversion may deserve more space than a tiny modal.

---

## 64. Back Navigation

Mobile navigation must have predictable back behavior.

Task 9.17 must specify navigation expectations for:

```text
Planner → Day Worksurface
Planner → Goal
Planner → My Schedule
Planner → Review Plan
Summary → drill-down
```

Back should return to the previous meaningful context rather than reset Planner state unexpectedly.

---

## 65. Planner Context Preservation

When the user:

```text
selects a date
opens Goal detail
reviews a conflict
returns
```

Planner should preserve useful session context where possible:

```text
selected date
calendar month
expanded item
review scope
```

without persisting ephemeral navigation as authoritative state.

---

## 66. Desktop Enhancement

Desktop may enhance the mobile model through:

```text
side-by-side calendar + day detail
persistent contextual panel
wider Summary charts
additional visible metadata
keyboard accelerators
```

but those are enhancements.

Do not create desktop-only semantics.

---

## 67. Responsive Equivalence

For every canonical workflow, the specification must answer:

```text
How does this work on a narrow phone?
How does this work on a wider phone?
How does this work on tablet?
How may desktop enhance it?
```

The underlying action/authority must remain equivalent.

---

## 68. Required Mobile Reference Widths

For specification and future validation, define representative viewport classes.

At minimum evaluate:

```text
narrow phone ≈ 320–360 CSS px
typical phone ≈ 390–430 CSS px
tablet ≈ 768 CSS px
desktop ≥ 1024 CSS px
```

Do not optimize solely for a single modern large phone.

Exact future test widths may use repository conventions.

---

## 69. Accessibility

The convergence specification must account for:

```text
semantic headings
keyboard navigation
visible focus
screen-reader labels
form labels
error association
non-color-only status
reduced-motion compatibility where applicable
touch target usability
```

Do not make mobile friendliness synonymous with accessibility; both are required.

---

## 70. Error Presentation

Dogfood found setup errors insufficiently explanatory.

Specify error behavior that:

```text
identifies the affected object
identifies the field/condition where possible
places explanation near the action/input
provides recovery guidance
```

Avoid generic:

```text
“Could not generate plan.”
```

when typed/domain information exists.

Do not expose stack traces or architecture internals to ordinary users.

---

## 71. Architecture-Language Audit

Audit user-facing occurrences of terms such as:

```text
canonical
truth
realization
allocation
proposal
friction
generated
template
planning range
unplaced
HistoricalPlan
stored historical authority
derived publication-readiness policy
publication coverage
published plan evidence
```

Classify each occurrence:

```text
appropriate product terminology
acceptable advanced terminology
developer language leaking into product
```

Do not mechanically rename architecture terms where the product meaning genuinely benefits from them.

---

## 72. User-Facing Vocabulary

Produce a proposed product vocabulary table.

At minimum evaluate:

```text
Commitment
Goal
Sleep
Work Pattern
My Schedule
Plan
Review Plan
Proposal
Allocation
Realization
Friction
Found Time
Progress
Capacity
Published Plan
DayFrame Day
```

For each specify:

```text
internal term
user-facing term
where visible
whether explanation is required
```

---

## 73. Plan Terminology

“Plan” is currently overloaded.

Task 9.17 must explicitly define product usage for terms such as:

```text
planning
plan
proposal
accepted plan
published schedule
```

Do not erase architectural distinctions.

Create a vocabulary that lets ordinary users understand the workflow without knowing internal authority types.

---

## 74. Protected / Unknown States

Historical protection and unknown authority must remain visible enough to prevent false confidence.

Do not translate:

```text
protected
unknown
incomplete
```

into:

```text
empty
zero
nothing scheduled
```

Specify user-facing recovery-oriented presentation.

---

## 75. HistoricalPlan Recovery Boundary

Dogfood Pass 02 exposed a blocked HistoricalPlan state with no ordinary-user recovery.

Task 9.17 must identify where recovery would live in the target product.

Do **not** implement general HistoricalPlan recovery in this task.

Determine whether recovery must occur:

```text
before shell migration
during migration
immediately after migration
```

and justify the dependency.

---

## 76. Existing Recovery Commands

Audit any existing:

```text
export
recheck
abandon/destructive recovery
```

commands related to protected historical authority.

Document whether they are currently product-reachable.

Do not expose a destructive command merely to satisfy reachability.

---

## 77. Product Surface Inventory

Create a complete inventory of current major user-facing surfaces/components.

For each record:

```text
current route/location
purpose
authority/read models consumed
actions invoked
mobile behavior
dogfood findings
target destination
migration disposition
```

Disposition must be one of:

```text
KEEP
MOVE
MERGE
SPLIT
RETIRE
TEMPORARILY RETAIN
DEFER PENDING ARCHITECTURE
```

---

## 78. Capability Preservation Ledger

Create a capability-level ledger independent of components.

Examples:

```text
select calendar day
edit Work Pattern
edit Commitment
create Goal
evaluate planning opportunity
accept Proposal
inspect accepted planning
resolve Friction
publish
record execution
correct execution
record Found Time
inspect Capacity
inspect Goal Progress
inspect history
recover protected history
```

For each:

```text
current reachability
target reachability
mobile path
authority owner
migration task
```

This ledger is mandatory.

No capability may disappear accidentally because its old component is retired.

---

## 79. Authority Consumption Map

For every target surface, identify authoritative and derived inputs.

At minimum cover:

```text
authored setup
Work
SleepRequirement
Commitments
Goals
Goal Structure
Demand
Capacity
Allocation
Proposal
Accepted Allocation
realized Goal facts
Manual Events
Friction
SuggestedFix
PlanDecision
Preview
HistoricalPlan
ExecutionHistory
Progress / measurements
```

The specification must prevent UI migration from creating a second semantic owner.

---

## 80. Action Authority Map

For each major user action identify:

```text
surface
command invoked
authority mutated
required freshness/revalidation
confirmation requirements
failure state
```

Examples:

```text
edit Commitment
edit Sleep
accept Proposal
accept SuggestedFix
publish
mark complete
record Found Time
correct execution
delete Manual Event
```

---

## 81. Read Model Reuse

Prefer existing canonical read models.

Task 9.17 must identify where the target product can consume:

```text
queryPlanningReview
Today read model
Sleep history
historical intelligence
Capacity surface
Goal planning workflow
publication readiness
```

or repository equivalents.

Do not propose reconstructing authority directly inside React components.

---

## 82. Read Model Gaps

Where no existing read model cleanly supports the target UX, document a bounded future read-model task.

For each gap specify:

```text
desired user question
existing data sources
why current read models are insufficient
required derived output
authority restrictions
```

Do not implement it in 9.17.

---

## 83. Component Architecture Direction

After semantic/product analysis, propose an implementation-oriented component hierarchy.

Example only:

```text
PlannerSurface
├── PlannerHeader
├── CalendarSurface
├── DayWorksurface
├── PlannerSectionRouter
│   ├── MyScheduleSurface
│   ├── GoalsSurface
│   └── ReviewPlanSurface
└── PlannerAttentionSurface
```

and:

```text
SummarySurface
├── SummaryOverview
├── CapacitySummary
├── GoalSummary
├── AllocationSummary
├── ProgressSummary
└── HistorySummary
```

Do not treat these names as predetermined.

Derive them from the audit.

---

## 84. Mobile Component Composition

For each proposed major component specify:

```text
mobile default presentation
expanded/detail presentation
desktop enhancement
scroll ownership
sticky behavior
navigation behavior
```

Avoid nested independently scrolling panels on phone unless absolutely necessary.

---

## 85. Route / State Architecture

Audit current navigation state.

Specify what should be:

```text
URL/route state
session navigation state
component-local state
authored persistent state
derived state
```

Examples:

```text
selected Planner date
selected Goal
open Commitment editor
calendar month
Summary drill-down
expanded card
```

Do not persist navigation convenience as domain authority.

---

## 86. Deep Linking

Determine whether target architecture should permit internal deep links such as:

```text
Planner → Goal X
Planner → Day Y
Planner → conflict Z
Summary → Goal X history
```

Use current routing capability as constraint.

Do not introduce a new routing framework in Task 9.17.

---

## 87. Mobile Performance

The convergence must avoid making the mobile Planner load the entire application graph eagerly.

Task 9.16 ended at:

```text
Initial gzip:       168,185 bytes
Hard limit:         170,000 bytes
Hard headroom:        1,815 bytes
Initial raw:        645,745 bytes
Largest lazy chunk:  59,671 bytes
Total emitted:    1,127,513 bytes
```

This is a hard architectural constraint.

The specification must identify likely lazy boundaries for:

```text
My Schedule editors
Goal detail/editor
Review Plan
historical drill-down
conversion/recovery workflows
advanced Summary
```

Do not propose one enormous eagerly imported Planner component.

---

## 88. Bundle Constraint

The hard:

```text
170,000-byte initial gzip
```

limit remains unchanged.

Future convergence tasks must solve bundle pressure architecturally.

Task 9.17 must explicitly recommend import boundaries.

Do not recommend raising the threshold.

---

## 89. Mobile Rendering Cost

Audit obvious current surfaces that render very large collections eagerly.

Examples may include:

```text
realization lists
Proposal lists
Friction dates
history
calendar schedule blocks
```

Specify virtualization/pagination/grouping/lazy expansion only where justified.

Do not introduce implementation dependencies in this specification.

---

## 90. Large Dataset Behavior

Specify expected product behavior for:

```text
1 Goal
20 Goals
1 Commitment
50 Commitments
1 conflict
100 conflicts
small history
multi-year history
```

The UI must degrade through summarization/drill-down rather than simply becoming longer.

---

## 91. Offline / Local-First Assumption

Preserve DayFrame's current local-first behavior unless repository evidence says otherwise.

The convergence must not make core Planner functionality dependent on:

```text
network availability
cloud account
remote API
LLM response
```

No external service architecture is authorized.

---

## 92. LLM Authority Boundary

The UI convergence must preserve:

> **LLM has no scheduling authority.**

Do not design an assistant/chat surface that can silently mutate authoritative planning state.

Any future assistant interaction must flow through explicit existing authority commands.

No assistant UI is required in Task 9.17.

---

## 93. Required Mobile Workflow Specifications

Produce step-by-step target mobile flows for at least:

### Flow A — Start the day

```text
open DayFrame
→ Planner / current DayFrame day
→ inspect today's published schedule
→ report outcome on an item
```

### Flow B — Browse another day

```text
Planner
→ calendar
→ select date
→ Day Worksurface
```

### Flow C — Add a Commitment

```text
Planner
→ My Schedule
→ Commitments
→ Add
→ essential fields
→ optional advanced fields
→ save
```

### Flow D — Edit Sleep

```text
Planner
→ My Schedule
→ Sleep
→ edit requirement
→ save
→ planning becomes stale/review required as appropriate
```

### Flow E — Create a Goal

```text
Planner
→ Goals
→ Add Goal
→ define outcome
→ define planning intent
→ save
```

### Flow F — Accept constructive planning

```text
Planner
→ Review Plan
→ planning opportunity
→ Proposal
→ inspect
→ Accept
→ realization
```

### Flow G — Resolve a conflict

```text
Planner
→ Needs Attention
→ conflict
→ suggested correction
→ Try
→ Accept
```

### Flow H — Publish

```text
Planner
→ Review Plan
→ readiness
→ inspect blockers/warnings
→ Publish
```

### Flow I — Record Found Time

```text
Planner
→ Day Worksurface
→ Add / Found Time
→ choose Goal
→ record activity
```

subject to existing semantics.

### Flow J — Historical reporting

```text
Planner
→ past day
→ planned item
→ record/correct outcome
```

### Flow K — Review progress

```text
Summary
→ Goals / Progress
→ Goal
→ drill-down
```

### Flow L — Protected historical authority

Specify the intended user journey even if implementation is deferred.

---

## 94. Required Desktop Enhancement Specifications

For each Flow A–L specify how desktop may improve efficiency without changing semantics.

Examples:

```text
calendar + Day Worksurface side-by-side
keyboard shortcuts
persistent detail panel
wider Summary visualization
```

Mobile remains canonical for reachability.

---

## 95. Required Responsive Matrix

Create a matrix:

| Capability | Narrow Phone | Typical Phone | Tablet | Desktop | Same Authority? |
|---|---|---|---|---|---:|

Include at minimum:

```text
calendar
Day Worksurface
Work Pattern
Sleep
Commitments
Goals
Review Plan
Friction correction
publication
execution reporting
Found Time
Capacity Summary
Goal Summary
History
```

---

## 96. Current-Surface Disposition Matrix

Create:

| Current Surface | Current Purpose | Useful Capabilities | Problems | Target Destination | Disposition | Mobile Notes |
|---|---|---|---|---|---|---|

Account for all major current user-facing surfaces.

---

## 97. Target-Surface Responsibility Matrix

Create:

| Target Surface | User Question | Inputs | Actions | Must Not Own | Mobile Default |
|---|---|---|---|---|---|
| Planner | | | | | |
| Calendar | | | | | |
| Day Worksurface | | | | | |
| My Schedule | | | | | |
| Goals | | | | | |
| Review Plan | | | | | |
| Summary | | | | | |

Add sub-surfaces as required.

---

## 98. Vocabulary Matrix

Create:

| Internal Term | Proposed User Term | Visible Where | Explanation Needed? | Keep Internal Name? |
|---|---|---|---:|---:|

Include all terms from Sections 71–73.

---

## 99. Mobile Interaction Matrix

Create:

| Interaction | Current Behavior | Mobile Risk | Target Behavior | Desktop Enhancement |
|---|---|---|---|---|

Include:

```text
day selection
add event
edit Commitment
duration entry
time entry
recurrence
Goal effort
Proposal review
conflict review
publication
execution reporting
large-list navigation
back navigation
```

---

## 100. Authority / Read Model Matrix

Create:

| Surface | Authored Inputs | Derived Inputs | Immutable Inputs | Commands | Forbidden Direct Reads/Writes |
|---|---|---|---|---|---|

This matrix must be detailed enough to guide implementation tasks.

---

## 101. Migration Dependency Graph

Produce a proposed migration dependency graph.

Do not assume one giant implementation task.

Potential shape:

```text
9.17 Specification
      ↓
read-model gaps / recovery prerequisite
      ↓
Planner shell
      ↓
Day Worksurface
      ↓
My Schedule
      ↓
Goals
      ↓
Review Plan
      ↓
Summary
      ↓
legacy-surface retirement
      ↓
convergence audit
```

Derive the actual graph from findings.

---

## 102. Migration Slicing Principle

Future tasks should be independently testable and leave DayFrame usable after each slice.

Avoid:

```text
remove old shell
→ spend five tasks rebuilding features
```

Prefer:

```text
introduce canonical replacement
→ prove capability parity
→ redirect navigation
→ retire old surface
```

This is mandatory for the proposed migration sequence.

---

## 103. Dual-Path Duration

Where old and new surfaces temporarily coexist, specify:

```text
which one is authoritative
which one is compatibility UI
how long coexistence is allowed
what proves safe retirement
```

Do not allow indefinite duplicate product paths.

---

## 104. Migration Acceptance Gates

For each proposed future migration task, define the evidence required before moving onward.

At minimum consider:

```text
capability parity
authority correctness
mobile workflow reachability
responsive validation
accessibility
full regression
bundle gate
no duplicate semantic owner
```

---

## 105. Mobile Validation Strategy

Specify how future implementation tasks should validate mobile UX.

At minimum require representative viewport testing at:

```text
320–360 px
390–430 px
768 px
desktop
```

Validation should inspect:

```text
horizontal overflow
touch reachability
text truncation
form usability
virtual keyboard behavior where testable
modal/sheet sizing
sticky control obstruction
large-list behavior
orientation/context clarity
```

Use existing test/browser capabilities where available.

Do not require a new dependency merely for Task 9.17.

---

## 106. Accessibility Validation Strategy

Specify future validation for:

```text
keyboard-only navigation
focus order
visible focus
semantic labels
screen-reader names
form errors
status not dependent solely on color
dialog focus behavior
```

Again, specification only.

---

## 107. Error-State Matrix

Create:

| Condition | Current Presentation | Target User Message/State | Recovery Action | Surface |
|---|---|---|---|---|

Include at minimum:

```text
stale Preview
planning coverage incomplete
Sleep infeasible
Sleep search incomplete
accepted placement review required
schedule conflict
Proposal unavailable
publication blocked
publication uncertain
historical authority protected
Goal plan cannot be generated
invalid setup input
```

Do not erase distinctions among typed failures.

---

## 108. Empty-State Matrix

Create:

| Surface | Truly Empty | Unknown/Incomplete | Protected | Suggested Product Behavior |
|---|---|---|---|---|

Cover:

```text
Planner day
Goals
Review Plan
Capacity
Progress
History
Recommendations
```

---

## 109. Product Reachability Audit

For every major capability determine:

```text
reachable now?
how many conceptual navigation levels?
requires architecture knowledge?
requires desktop affordance?
requires generated Preview?
requires hidden advanced section?
target mobile path?
```

Identify the highest-friction workflows.

---

## 110. Mobile Friction Audit

Explicitly inspect current UI for:

```text
horizontal overflow
wide tables
multi-column assumptions
small buttons
adjacent destructive actions
long ungrouped lists
deep scroll
global accordions
unlabeled icons
double-click dependency
desktop-only hover
awkward time inputs
keyboard-covered controls
modal overflow
architecture-heavy copy
```

Record concrete findings.

---

## 111. Screenshot / Visual Inspection

Where repository tooling allows the app to run safely against disposable/test state, inspect representative current surfaces visually at mobile and desktop widths.

Do not mutate preserved forensic dogfood state.

If visual inspection cannot be performed safely, document that limitation.

Do not claim screenshots that were not inspected.

---

## 112. Preserved Dogfood Evidence

The original dogfood state that exposed HistoricalPlan protection must remain forensic evidence.

Do not:

```text
repair
migrate
normalize
clear
abandon
```

that preserved state during this specification audit.

If execution requires app state, use disposable fixtures or a copy.

---

## 113. HistoricalPlan Recovery Decision

Task 9.17 must answer one specific sequencing question:

> **Must ordinary-user HistoricalPlan recovery be implemented before Planner/Summary shell convergence begins?**

Allowed conclusions:

```text
YES — prerequisite
NO — can occur during bounded convergence task X
NO — safely deferred until after shell convergence
```

Support the conclusion with authority and product-reachability reasoning.

Do not implement recovery.

---

## 114. Read-Model Gap Decision

Likewise answer:

> **Are additional canonical read models required before the shell migration can safely begin?**

List each required pre-migration read model separately.

Do not bundle speculative convenience selectors into this list.

Only identify gaps that would otherwise cause React/UI code to reconstruct semantics.

---

## 115. Mobile Architecture Decision

Answer:

> **Can the target two-surface architecture be implemented mobile-first using the current routing/component architecture, or is a bounded navigation/layout foundation required first?**

Support with repository evidence.

Do not introduce a new framework.

---

## 116. Bundle Architecture Decision

Answer:

> **What must remain lazy for the convergence to respect the 170,000-byte initial-gzip hard limit?**

Identify specific current/proposed feature boundaries.

This is a required migration constraint.

---

## 117. Required RESULT Artifact

Create exactly one durable result artifact:

```text
PHASE_9_TASK_9_17_PLANNER_SUMMARY_PRODUCT_CONVERGENCE_MOBILE_UX_SPECIFICATION_V1_RESULT.md
```

Place it in the existing Phase 9 durable RESULT folder.

The filename must contain:

```text
RESULT
```

No implementation artifact is authorized.

---

## 118. Required RESULT Structure

The RESULT must contain these sections in this exact order:

```text
# Task 9.17 — Planner / Summary Product Convergence & Mobile UX Specification V1 RESULT

## 1. Executive Summary
## 2. Scope and Governing Architecture
## 3. Pre-Audit Repository State
## 4. Current Primary Navigation Audit
## 5. Current Product Surface Inventory
## 6. Current Capability Inventory
## 7. Current Authority / Read Model Consumption
## 8. Current Action / Command Reachability
## 9. Current Mobile UX Audit
## 10. Current Accessibility Audit
## 11. Current Architecture-Language Audit
## 12. Dogfood Finding Reconciliation
## 13. Target Product Mental Model
## 14. Planner Responsibility
## 15. Summary Responsibility
## 16. Day Worksurface Specification
## 17. Past-Day Mode
## 18. Current-Day Mode
## 19. Future-Day Mode
## 20. Today Convergence
## 21. Calendar Specification
## 22. Month Specification
## 23. Canonical Day Orientation
## 24. Cycle / Transition Presentation
## 25. My Schedule Specification
## 26. Work Pattern Product Specification
## 27. Day Boundary Product Placement
## 28. Sleep Product Specification
## 29. Commitment Product Specification
## 30. Commitment Authoring / Editing UX
## 31. Human Time / Duration Input Specification
## 32. Recurrence UX Specification
## 33. Goals Product Specification
## 34. Goal Structure Product Specification
## 35. Goal Planning Intent Vocabulary
## 36. Goal Effort UX
## 37. Ongoing / Recurring Goal Limitations
## 38. Scheduled Goal Work Presentation
## 39. Goal Planning Provenance Presentation
## 40. Found Time Specification
## 41. Manual Event Specification
## 42. Execution Reporting Specification
## 43. After-the-Fact Reporting
## 44. Review Plan Specification
## 45. Constructive Planning Presentation
## 46. Corrective Planning Presentation
## 47. Planning Readiness Presentation
## 48. Publication UX
## 49. Preview Retirement Plan
## 50. Planning Range Product Placement
## 51. Friction / Needs-Attention Presentation
## 52. Repeated-Friction Mobile Strategy
## 53. Summary Capacity Specification
## 54. Summary Goals Specification
## 55. Summary Allocations Specification
## 56. Summary Progress Specification
## 57. Summary History Specification
## 58. Summary Recommendations / Attention Specification
## 59. Empty-State Discipline
## 60. Progressive Disclosure Strategy
## 61. Mobile Information Density Strategy
## 62. Touch Interaction Strategy
## 63. One-Handed Workflow Strategy
## 64. Mobile Form Strategy
## 65. Mobile Overlay / Dialog Strategy
## 66. Navigation / Back Behavior
## 67. Planner Context Preservation
## 68. Desktop Enhancement Strategy
## 69. Responsive Equivalence
## 70. Accessibility Requirements
## 71. Error Presentation Strategy
## 72. User-Facing Vocabulary
## 73. Plan Terminology Decision
## 74. Protected / Unknown State Presentation
## 75. HistoricalPlan Recovery Placement
## 76. Product Surface Disposition Matrix
## 77. Capability Preservation Ledger
## 78. Target-Surface Responsibility Matrix
## 79. Authority / Read Model Matrix
## 80. Action Authority Matrix
## 81. Read Model Reuse
## 82. Read Model Gaps
## 83. Proposed Component Architecture
## 84. Mobile Component Composition
## 85. Route / State Architecture
## 86. Deep-Linking Assessment
## 87. Required Mobile Workflow Specifications
## 88. Desktop Workflow Enhancements
## 89. Responsive Capability Matrix
## 90. Vocabulary Matrix
## 91. Mobile Interaction Matrix
## 92. Error-State Matrix
## 93. Empty-State Matrix
## 94. Product Reachability Audit
## 95. Mobile Friction Audit
## 96. Visual Inspection Record
## 97. HistoricalPlan Recovery Sequencing Decision
## 98. Pre-Migration Read Model Decision
## 99. Mobile Navigation / Layout Foundation Decision
## 100. Bundle Architecture Decision
## 101. Large-Dataset Strategy
## 102. Proposed Migration Dependency Graph
## 103. Proposed Migration Task Sequence
## 104. Dual-Path / Compatibility Strategy
## 105. Migration Acceptance Gates
## 106. Mobile Validation Strategy
## 107. Accessibility Validation Strategy
## 108. Bundle Constraint Assessment
## 109. Preserved Dogfood Evidence
## 110. Architecture Governance Assessment
## 111. Changed Files
## 112. Deferred Work
## 113. Completion Assessment
```

---

## 119. Required Product Surface Disposition

Every major current product surface must receive exactly one disposition:

```text
KEEP
MOVE
MERGE
SPLIT
RETIRE
TEMPORARILY RETAIN
DEFER PENDING ARCHITECTURE
```

No:

```text
probably obsolete
maybe keep
TBD
```

unless the reason is a specifically identified unresolved architecture decision.

---

## 120. Required Migration Task Sequence

The RESULT must propose the next bounded implementation tasks.

Do not assume numbering beyond 9.17 until the audit establishes dependencies.

For each proposed task provide:

```text
working title
objective
prerequisites
surfaces affected
authority/read models consumed
mobile acceptance gate
bundle risk
retirement opportunity
```

The sequence must make DayFrame usable after every completed task.

---

## 121. Required Mobile Acceptance Gate for Future Tasks

Every future convergence implementation task must include:

```text
Mobile Acceptance Gate
```

covering at minimum:

```text
narrow-phone reachability
no unintended horizontal overflow
touch-accessible primary actions
no desktop-only required interaction
usable form flow
correct back/navigation behavior
progressive disclosure for dense data
authority semantics unchanged
bundle gate unchanged
```

Task 9.17 must establish this as a Phase 9 convergence convention.

---

## 122. Required Architecture Acceptance Gate

Every future convergence task must also prove:

```text
no new semantic owner
no direct UI reconstruction of authority
no Preview promoted to authority
no History rewritten
no Goal Progress inferred from schedule geometry
no Friction/Proposal conflation
no unpublished planning presented as Published Plan
no unknown state presented as zero/empty
```

---

## 123. Required Capability-Parity Gate

Before retiring an old surface:

```text
all useful capabilities
```

must appear in the capability preservation ledger with:

```text
replacement path
mobile path
authority owner
tests
```

No old surface may be retired based solely on aesthetic preference.

---

## 124. Required Bundle Gate

Future tasks retain:

```text
170,000-byte initial gzip hard limit
```

Task 9.17 must recommend lazy-loading boundaries sufficient to make convergence plausible with only:

```text
1,815 bytes
```

of current hard headroom.

No threshold increase is an acceptable migration strategy.

---

## 125. Required Evidence Standard

For every major conclusion classify evidence as:

```text
REPOSITORY EVIDENCE
DOGFOOD EVIDENCE
ACCEPTED ARCHITECTURE
PRODUCT DESIGN DECISION
DEFERRED / UNKNOWN
```

Do not present a design preference as though it were current repository behavior.

---

## 126. Prohibited Changes

Do **not**:

- implement the Planner/Summary migration;
- remove current navigation;
- retire current surfaces;
- change routing;
- change persistence;
- bump schemas;
- modify scheduling semantics;
- modify Capacity semantics;
- modify Goal semantics;
- modify Sleep semantics;
- modify publication semantics;
- modify execution semantics;
- modify historical authority;
- repair the preserved dogfood state;
- implement HistoricalPlan recovery;
- create recurring Goal Demand architecture;
- create ongoing Goal architecture;
- create Found Time Progress semantics not already supported;
- create a new routing framework;
- add UI dependencies;
- add responsive-framework dependencies;
- raise bundle limits;
- weaken tests;
- commit;
- push.

---

## 127. Validation

Because this is a specification/audit task, validation focuses on repository integrity and evidence.

At minimum run:

```text
git status --short
git diff --check
```

If repository files other than the RESULT/specification are unintentionally changed, restore only Task 9.17's accidental edits without disturbing pre-existing Phase 9 work.

Where application execution is used for audit:

```text
npm run build
```

and relevant existing tests should pass.

Do not mutate preserved dogfood evidence.

Record exact commands actually run.

---

## 128. Repository Hygiene

Before audit:

1. record HEAD;
2. record `git status --short`;
3. identify pre-existing dirty files;
4. preserve Tasks 9.9–9.16;
5. preserve dogfood forensic state;
6. record current bundle baseline from Task 9.16.

After audit:

1. inspect `git status --short`;
2. inspect task-specific diff;
3. run `git diff --check`;
4. account for every Task 9.17 change;
5. confirm no implementation changes;
6. do not commit;
7. do not push.

---

## 129. Changed-Files Accounting

Task 9.17 should ordinarily create only:

```text
the required RESULT artifact
```

and, if the task specification itself is being stored in-repository, the task specification artifact.

Any source-code change is presumptively out of scope and must be justified as necessary for safe audit execution; otherwise revert only that Task 9.17 change.

---

## 130. Deferred Work

The RESULT must explicitly identify, where applicable:

```text
HistoricalPlan recovery implementation
Planner shell implementation
Day Worksurface implementation
My Schedule migration
Goals migration
Review Plan migration
Summary migration
legacy surface retirement
ongoing Goal architecture
recurring Goal Demand architecture
Found Time semantic gaps
external calendar / holiday integration
mobile polish beyond convergence requirements
advanced desktop enhancements
```

Do not silently solve them in the specification.

---

## 131. Completion Criteria

Task 9.17 is complete only if:

### Audit

- [ ] current navigation audited.
- [ ] current surfaces inventoried.
- [ ] current capabilities inventoried.
- [ ] current read models traced.
- [ ] current commands traced.
- [ ] mobile problems audited.
- [ ] accessibility problems audited.
- [ ] architecture-language leakage audited.
- [ ] dogfood findings reconciled.

### Target Architecture

- [ ] Planner responsibility defined.
- [ ] Summary responsibility defined.
- [ ] Day Worksurface defined.
- [ ] Today convergence defined.
- [ ] Calendar role defined.
- [ ] My Schedule defined.
- [ ] Work Pattern placement defined.
- [ ] Sleep placement defined.
- [ ] Commitments placement defined.
- [ ] Goals placement defined.
- [ ] Review Plan defined.
- [ ] Summary subsections defined.

### Mobile

- [ ] mobile-first principle explicit.
- [ ] narrow-phone behavior specified.
- [ ] typical-phone behavior specified.
- [ ] tablet behavior specified.
- [ ] desktop enhancement specified.
- [ ] canonical workflows reachable without desktop-only gestures.
- [ ] touch strategy specified.
- [ ] forms strategy specified.
- [ ] overlay/dialog strategy specified.
- [ ] back-navigation behavior specified.
- [ ] context preservation specified.
- [ ] dense-list strategy specified.
- [ ] large-dataset behavior specified.
- [ ] accessibility requirements specified.

### Semantics

- [ ] authority consumption map complete.
- [ ] action authority map complete.
- [ ] no second semantic owner proposed.
- [ ] Preview remains disposable.
- [ ] publication remains explicit.
- [ ] execution remains distinct from plan.
- [ ] Progress remains distinct from schedule geometry.
- [ ] Proposal/SuggestedFix distinction preserved.
- [ ] unknown/protected states remain distinct from empty/zero.

### Migration

- [ ] every current surface has a disposition.
- [ ] capability preservation ledger complete.
- [ ] read-model gaps identified.
- [ ] HistoricalPlan recovery sequencing decided.
- [ ] mobile layout/navigation prerequisite decided.
- [ ] bundle lazy boundaries identified.
- [ ] migration dependency graph produced.
- [ ] bounded migration task sequence produced.
- [ ] dual-path strategy defined.
- [ ] retirement gates defined.
- [ ] mobile acceptance gate defined for future tasks.
- [ ] architecture acceptance gate defined.
- [ ] capability-parity gate defined.
- [ ] bundle gate preserved.

### Evidence

- [ ] responsive matrix complete.
- [ ] vocabulary matrix complete.
- [ ] mobile interaction matrix complete.
- [ ] error-state matrix complete.
- [ ] empty-state matrix complete.
- [ ] visual inspection documented or limitation stated.
- [ ] conclusions classified by evidence type.
- [ ] changed files accounted for.
- [ ] no unauthorized implementation.
- [ ] no commit.
- [ ] no push.
- [ ] required RESULT exists.

---

## 132. Final Completion Statement

If and only if all required criteria are satisfied, end the RESULT with exactly:

```text
Task 9.17 — Planner / Summary Product Convergence & Mobile UX Specification V1 is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.17 — Planner / Summary Product Convergence & Mobile UX Specification V1 is INCOMPLETE.
```

Then identify the exact blockers.

---

## 133. Governing Convergence Principle

The convergence is not successful merely because DayFrame has fewer screens.

It is successful when the product model becomes understandable without weakening the authority model beneath it.

Therefore:

```text
Planner is where I operate my schedule.

Summary is where I understand how it is working.

The Day Worksurface is where a DayFrame day becomes actionable.

My Schedule is where recurring time structure is authored.

Goals are outcomes with planning intent, not disguised Commitments.

Review Plan is where constructive and corrective planning become understandable and explicit.

Published Plan remains distinct from generated planning.

Actual execution remains distinct from planned intent.

History remains immutable evidence.

Mobile is a first-class product environment, not a reduced desktop experience.
```

The final UX constraint is:

> **If a canonical DayFrame workflow is awkward or unreachable on a phone, the convergence is not complete.**