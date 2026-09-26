# Task 9.18 — Planner / Summary Navigation Foundation V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Product Convergence  
**Task Type:** Bounded Implementation / Navigation Architecture / Product Shell Migration  
**Prerequisites:** Task 9.17 — Planner / Summary Product Convergence & Mobile UX Specification V1 — COMPLETE  
**Primary Specification Authority:** Task 9.17 RESULT  
**Implementation Changes:** AUTHORIZED ONLY WITHIN THIS TASK'S BOUNDED SCOPE  
**Persistence Changes:** PROHIBITED  
**Schema Changes:** PROHIBITED  
**Scheduling / Planning Semantic Changes:** PROHIBITED  
**Historical Authority Changes:** PROHIBITED  
**Mobile Acceptance Gate:** MANDATORY  
**Bundle Hard Gate:** 170,000-byte initial gzip — MUST NOT BE RAISED  
**Required Durable Output:** `PHASE_9_TASK_9_18_PLANNER_SUMMARY_NAVIGATION_FOUNDATION_V1_RESULT.md`

---

## 1. Objective

Implement the first bounded product-convergence slice defined by Task 9.17:

> Establish **Planner** and **Summary** as DayFrame's two primary product destinations while preserving the existing authoritative workflows behind them.

Task 9.18 establishes the navigation foundation and product-shell contract upon which later convergence tasks will operate.

The task SHALL:

1. establish the canonical two-destination primary navigation:
   - **Planner**
   - **Summary**;
2. make Planner the default ordinary working destination;
3. establish the Planner navigation hierarchy required by Task 9.17;
4. preserve access to currently required user-facing workflows during migration;
5. establish explicit navigation/view identity suitable for later Day Worksurface, My Schedule, Goals, Review Plan, and Summary convergence;
6. eliminate unnecessary primary-navigation competition without prematurely deleting legacy capability;
7. make the navigation foundation mobile-first;
8. preserve all existing authority, persistence, scheduling, publication, execution, history, Sleep, Goal, Friction, and planning semantics;
9. create the smallest stable shell upon which subsequent convergence tasks can operate.

Task 9.18 SHALL NOT implement the final Day Worksurface.

Task 9.18 SHALL NOT perform the G1/G2 evidence-projection work identified by Task 9.17.

Task 9.18 SHALL NOT implement general HistoricalPlan recovery.

Task 9.18 SHALL NOT retire legacy implementation merely because a new navigation path exists.

---

## 2. Governing Product Principle

The governing product model is:

```text
DayFrame
├── Planner
└── Summary
```

with:

```text
Planner
├── Calendar
├── My Schedule
│   ├── Work Pattern
│   └── Commitments
├── Goals
└── Review Plan
```

The governing rule is:

> **Navigation may change where capability is presented. It may not change who owns the underlying truth.**

Planner and Summary are organizational/product surfaces.

They are not new semantic owners.

Task 9.18 MUST NOT create:

```text
a second schedule
a second Goal model
a second Capacity model
a second Proposal model
a second Allocation model
a second publication model
a second execution model
a second history model
a second Sleep model
parallel persistence
```

merely to support the new shell.

Existing canonical owners and read models remain authoritative.

---

## 3. Scope

Task 9.18 is limited to:

```text
primary navigation
Planner secondary navigation
Summary entry
navigation/view state
selected-day navigation coordination where necessary
mobile navigation behavior
compatibility routing to existing surfaces
bounded shell/component organization
tests for the new navigation contract
bundle-safe lazy boundaries where necessary
```

Task 9.18 may move or wrap existing UI components only where necessary to establish the new navigation hierarchy.

It MUST prefer reuse over duplication.

---

## 4. Required Discovery Before Implementation

Before changing code, inspect the current repository and the Task 9.17 RESULT.

Record:

```text
current HEAD
git status --short
current top-level shell
current primary navigation implementation
current view/route selection mechanism
current selected-day ownership
current Today entry path
current Month / Monthly Planner entry path
current Summary entry path
current Work Pattern entry path
current Commitment entry path
current Goal entry path
current Review Schedule entry path
current Daily Workspace entry path
current Friction / corrective entry path
current publication entry path
current First-Class Sleep product paths
current setup/profile/backup paths
current lazy-loading boundaries
current initial bundle measurement
```

Identify pre-existing dirty files before implementation.

Do not attribute pre-existing changes to Task 9.18.

If Task 9.17 terminology differs from repository names, document the mapping.

---

## 5. Primary Navigation Contract

After Task 9.18, ordinary top-level product navigation SHALL expose exactly:

```text
Planner
Summary
```

Legacy product destinations MUST NOT continue competing as equivalent primary destinations merely because their underlying components remain in the repository.

Examples that SHALL NOT remain peer top-level product destinations include, where currently present:

```text
Today
Month / Monthly Planner
Work Pattern
Commitments
Goals
Review Schedule
Daily Workspace
Pattern Library
setup-oriented implementation surfaces
```

Those capabilities MAY remain reachable through the Planner hierarchy or contextual product paths while convergence remains incomplete.

Do not delete their implementation merely to remove them from primary navigation.

---

## 6. Planner as Default Destination

Planner SHALL become the default ordinary product destination.

On ordinary application entry:

```text
Open DayFrame
    ↓
Planner
```

Planner SHALL orient to the current canonical DayFrame day.

This MUST use existing DayFrame canonical user-day semantics.

Do not substitute civil-calendar shortcuts that bypass:

```text
Day Boundary
effective boundary
timezone
cycle / segment context where relevant
```

Task 9.18 SHALL NOT invent a new temporal owner.

---

## 7. Planner Secondary Navigation

Planner SHALL expose coherent access to:

```text
Calendar
My Schedule
Goals
Review Plan
```

These are secondary Planner destinations.

They SHALL NOT become four new primary application destinations.

The implementation may use:

```text
tabs
segmented navigation
secondary navigation
nested route/view state
mobile menu/sheet
another repository-compatible navigation pattern
```

provided the result satisfies the Mobile Acceptance Gate and maintains one canonical navigation model.

Do not introduce a new routing framework.

---

## 8. Calendar

Calendar SHALL become the Planner path for calendar navigation.

Task 9.18 MUST preserve useful existing calendar/month capability, including where currently supported:

```text
month navigation
day selection
selected-day inspection
manual event access
day detail access
calendar orientation
```

Task 9.18 SHALL NOT yet implement the final Day Worksurface.

Calendar navigation MUST remain distinct from:

```text
Planning Data Horizon
Proposal Horizon
Review Scope
Preview
Publication Range
```

Navigating to a date MUST NOT itself create planning authority.

The calendar SHOULD remain navigable even when no fresh Preview exists.

---

## 9. My Schedule

Planner SHALL expose:

```text
My Schedule
```

as the product umbrella for recurring authored schedule structure.

For Task 9.18:

```text
My Schedule
├── Work Pattern
└── Commitments
```

must be reachable.

Reuse the existing authoritative editors/workflows.

Do not clone Work Pattern or Commitment state.

Task 9.18 SHALL NOT perform the later UX convergence of:

```text
Work Pattern generations
cycle/segment editing
Day Boundary editing
Commitment recurrence redesign
Commitment time-entry redesign
Commitment advanced-options redesign
Sleep integration into My Schedule
```

except for navigation necessary to keep existing capability reachable.

First-Class Sleep placement within the final My Schedule UX remains later convergence work unless Task 9.17 explicitly requires a currently existing Sleep path to remain reachable through a compatibility entry.

---

## 10. Goals

Planner SHALL expose:

```text
Goals
```

as a first-class secondary destination.

The new navigation path MUST reach the currently authoritative Goal capability.

Task 9.18 SHALL NOT solve:

```text
old-vs-rich Goal editor convergence
Goal Structure UX
ongoing Goals
recurring Goal Demand
Goal effort redesign
scheduled Goal provenance presentation
accepted planning iteration presentation
Found Time
Goal Progress redesign
```

Do not hide known limitations by inventing shell-level semantics.

---

## 11. Review Plan

Planner SHALL expose:

```text
Review Plan
```

as the ordinary product path into current planning review, corrective review, readiness, and publication capability.

"Review Plan" is product navigation terminology.

It MUST NOT create a new semantic object called Plan.

Preserve distinctions among:

```text
generated schedule
Preview
Proposal
Accepted Allocation
realized Goal work
Friction
SuggestedFix
PlanDecision
publication readiness
Published Plan
HistoricalPlan
```

The shell MAY group access to these concepts.

It MUST NOT merge their authority semantics.

---

## 12. Summary

Summary SHALL remain the second primary destination.

Task 9.18 SHALL preserve the currently implemented Summary capability behind the new shell.

Do not yet redesign or semantically merge:

```text
Capacity
Goals
Allocations
Progress
execution history
Sleep history
historical summaries
recommendations
attention
realization lists
```

Those belong to later Summary convergence.

Summary may receive minimal framing required by the new shell.

It MUST NOT acquire operational authority simply because it is now a primary destination.

---

## 13. Today Transition

The accepted target model is:

```text
Today
=
Planner opened to the current canonical DayFrame day
```

Task 9.18 SHALL establish this navigation direction.

Today SHALL cease to be an independent peer primary destination.

If a Today shortcut remains, it MUST:

1. enter Planner;
2. resolve the current canonical DayFrame day;
3. use existing Today/published-plan authority where applicable;
4. not create a parallel Today navigation architecture.

The existing Today component MAY remain internally during migration.

If retained, classify it explicitly as a compatibility implementation.

Do not rewrite Today semantics in this task.

---

## 14. Selected-Day Navigation State

Task 9.18 MUST establish or confirm one navigation-level concept for:

```text
selected DayFrame day
```

Do not create independent competing selected-day navigation state in:

```text
Planner shell
Calendar
Today
Daily Workspace
Review Plan
Summary
```

if one shared navigation state can lawfully serve them.

If existing architecture already has an appropriate owner, reuse it.

If bounded shell-level coordination is required, it MUST remain:

```text
session/presentation state
```

and MUST NOT become:

```text
authored state
planning authority
publication authority
history
persistent domain truth
```

Changing selected day MUST NOT silently alter:

```text
Planning Data Horizon
Proposal Horizon
Review Scope
Preview coverage
Publication Range
```

Document the selected-day owner and lifetime in the RESULT.

---

## 15. Canonical Day Regression Requirement

Add regression coverage proving that Planner's default/current-day navigation respects a non-midnight DayFrame boundary.

At minimum test:

```text
time before effective boundary
time after effective boundary
```

and prove the selected DayFrame day changes according to existing canonical semantics rather than host civil date alone.

Use existing canonical time helpers.

Do not duplicate boundary calculation inside UI code.

---

## 16. Compatibility Mapping

Task 9.18 is allowed to introduce explicit temporary mappings:

```text
new product destination
        ↓
existing authoritative surface
```

Examples conceptually include:

```text
Planner → Calendar → existing month surface
Planner → My Schedule → existing Work/Commitment surfaces
Planner → Goals → existing Goal surface
Planner → Review Plan → existing review surface
Summary → existing Summary surface
```

Use actual repository names.

For every mapping classify it as:

```text
RETAIN
TRANSITIONAL
BLOCKED BY NAMED GAP
```

No compatibility path may silently become a second semantic implementation.

---

## 17. Capability Preservation Ledger

Before implementation, derive the relevant capability ledger from Task 9.17 and repository evidence.

After implementation, verify that currently valid capability remains reachable.

At minimum inspect reachability for capabilities actually present in the repository involving:

```text
calendar/month navigation
selected-day inspection
manual event creation/editing/deletion
Work Pattern configuration
Commitment creation/editing
Goal creation/editing
planning opportunity evaluation
Proposal inspection
Proposal acceptance/rejection
accepted allocation realization
schedule review
Friction inspection
SuggestedFix Try/Accept
Sleep corrective placement/revocation
publication readiness
explicit publication
Today/current-day published evidence
execution reporting
historical execution correction/retraction
Summary
First-Class Sleep authoring
First-Class Sleep legacy conversion
Sleep history
profiles
backup/restore
setup
```

Not every capability must become a visible menu item.

It must remain reachable through a coherent path.

Produce a before/after reachability matrix in the RESULT.

---

## 18. No Authority Migration

Task 9.18 MUST preserve the established authority chain:

```text
authored
→ derived
→ proposed
→ accepted
→ scheduled / publication
→ execution / progress
→ history
→ learned
→ explicit preference
```

Navigation MUST NOT implicitly:

```text
accept Proposal
accept SuggestedFix
realize allocation
publish schedule
record execution
record Progress
repair history
convert legacy Sleep
revoke Sleep placement
change authored setup
```

unless the user explicitly invokes the existing authoritative command through its existing workflow.

Simply visiting a new destination MUST be observational.

---

## 19. Preview Remains Disposable

The new Planner shell MUST NOT elevate Preview into canonical schedule authority.

Planner may expose existing Preview-derived information where currently lawful.

It MUST preserve distinctions between:

```text
Preview
current generated planning
accepted planning
Published Plan
historical publication
```

Do not use Preview merely because it is convenient for rendering the new shell.

---

## 20. Publication Remains Explicit

Task 9.18 MUST preserve:

> Publication is an explicit authoritative action.

Navigation into:

```text
Planner
Review Plan
Calendar
Today shortcut
Summary
```

MUST NOT trigger publication.

Changing selected day MUST NOT trigger publication.

Opening Review Plan MUST NOT trigger publication.

Existing publication blockers and commit-certainty semantics remain unchanged.

---

## 21. Execution Remains Distinct From Plan

Do not infer execution merely because:

```text
time elapsed
user opened Today
user opened Planner
user navigated past a date
a schedule block exists
```

Existing execution commands and immutable execution history remain authoritative.

The shell MUST NOT synthesize completion state.

---

## 22. Historical Authority

Task 9.18 SHALL NOT implement general HistoricalPlan recovery.

Historical protection MUST remain fail-closed.

If an existing compatibility surface reports:

```text
protected
unknown
unavailable
```

the new shell MUST NOT translate that to:

```text
empty
nothing scheduled
zero
```

Task 9.17's sequencing decision regarding HistoricalPlan recovery remains authoritative for later work.

---

## 23. First-Class Sleep

Tasks 9.10–9.16 established the completed First-Class Sleep foundation.

Task 9.18 MUST preserve all existing Sleep authority distinctions:

```text
SleepRequirement
derived Sleep occurrence
Sleep feasibility
Sleep Friction
Suggested Fix
Accepted Sleep Placement / PlanDecision
published Sleep
actual Sleep execution
Sleep history
legacy Sleep conversion
```

Navigation changes MUST NOT collapse these concepts.

Task 9.18 SHALL NOT redesign Sleep architecture.

---

## 24. Product Language

The shell SHALL use user-facing product terminology from Task 9.17.

At minimum:

```text
Planner
Summary
Calendar
My Schedule
Work Pattern
Commitments
Goals
Review Plan
```

Avoid exposing architectural terminology in navigation labels merely because internal components use it.

Do not perform a repository-wide copy rewrite in this task.

Only adjust language necessary for the new navigation shell.

---

## 25. Mobile-First Navigation

The new navigation MUST be designed from the narrow-phone case outward.

Do not implement:

```text
desktop navigation
    ↓
hide pieces at small widths
```

as the governing strategy.

The ordinary Planner and Summary paths must remain practical at narrow-phone width.

Desktop may enhance the same hierarchy.

Desktop may not have unique required semantics.

---

## 26. Primary Mobile Navigation

At narrow-phone width, Planner and Summary MUST remain obvious and touch-accessible.

Choose the smallest repository-compatible interaction model.

Possible implementations include:

```text
bottom navigation
compact top navigation
segmented primary navigation
another established responsive control
```

Do not add a dependency solely to obtain a navigation widget.

Do not assume bottom navigation is required if existing shell architecture makes another approach cleaner.

The RESULT must explain the chosen pattern.

---

## 27. Planner Secondary Navigation on Mobile

The Planner child destinations:

```text
Calendar
My Schedule
Goals
Review Plan
```

MUST remain reachable without:

```text
horizontal page scrolling
hover
right-click
double-click
precision pointer input
desktop-only sidebar
```

A horizontally scrolling tab strip SHOULD NOT be introduced unless it remains obviously discoverable and no better bounded option exists.

Prefer a pattern that scales if later Planner contextual actions are added.

---

## 28. Navigation Depth

Common workflows SHOULD require shallow navigation.

At minimum verify practical paths for:

```text
open current day
open calendar
open Work Pattern
open Commitments
open Goals
open Review Plan
open Summary
return to Planner
```

Do not create unnecessary intermediate menu screens merely to reproduce the conceptual hierarchy.

---

## 29. Back Navigation

Back behavior MUST be predictable.

Examples:

```text
Planner → Goals → Goal detail → Back
```

should return to Goals/Planner context rather than reset the application.

Likewise:

```text
Planner → Calendar → selected day → Back
```

should preserve useful Planner context where existing architecture permits.

Task 9.18 need not solve every later detail route.

It MUST establish a navigation foundation that does not make contextual return impossible.

---

## 30. Planner Context Preservation

Where feasible within current architecture, preserve session-only navigation context such as:

```text
selected Planner date
visible calendar month
selected Planner subsection
```

Do not persist these as domain authority.

Do not allow returning from Summary to destroy Planner context unnecessarily.

Document what is preserved and what remains deferred.

---

## 31. No Desktop-Only Canonical Gestures

No canonical Task 9.18 navigation action may require:

```text
hover
double-click
right-click
mouse wheel precision
keyboard shortcut
```

Desktop may retain such interactions as accelerators.

A touch/click path MUST exist.

If current calendar day opening still relies on double-click anywhere, provide or preserve a single-click/tap canonical route within Task 9.18's navigation scope.

Do not redesign the entire Calendar surface to accomplish this.

---

## 32. Touch Interaction

Primary and secondary navigation controls MUST be practically touchable.

Avoid:

```text
tiny adjacent text links
unlabeled icon-only primary controls
closely packed destructive actions
```

Reuse existing design tokens where possible.

Do not introduce arbitrary global CSS that changes unrelated surfaces.

---

## 33. Mobile Vertical Density

Task 9.17 found that mobile DayFrame's major current problem is not merely horizontal overflow but extreme vertical information density.

Task 9.18 SHALL NOT solve all dense child surfaces.

However, the new shell MUST NOT worsen the problem by rendering all Planner child surfaces simultaneously.

Only the selected primary/secondary destination should render its ordinary content unless existing architecture requires a bounded exception.

Do not build:

```text
Planner
├── full Calendar
├── full Work Pattern
├── full Commitments
├── full Goals
└── full Review
```

as one vertically stacked page.

Navigation must provide progressive disclosure at the product-surface level.

---

## 34. Mobile Forms

Task 9.18 is not a form-redesign task.

Existing forms may remain as compatibility surfaces.

However, navigation wrappers MUST NOT make them less usable on mobile.

Do not place existing forms inside narrow nested panes or horizontally constrained desktop shells.

Later convergence tasks will own form-specific redesign.

---

## 35. Responsive Viewport Requirements

Validate the navigation foundation at representative widths including at minimum:

```text
320–360 CSS px
390–430 CSS px
768 CSS px
≥1024 CSS px
```

Use concrete test widths consistent with repository tooling.

At each class verify:

```text
primary navigation reachability
Planner secondary navigation reachability
Summary reachability
no unintended document-level horizontal overflow
no clipped primary navigation labels/actions
no desktop-only required gesture
content remains readable
back/context behavior remains coherent
```

---

## 36. Desktop Enhancement

Desktop MAY provide enhancements such as:

```text
persistent secondary navigation
wider contextual panels
side-by-side navigation/content
keyboard accelerators
```

if these are consistent with current architecture.

Desktop enhancement MUST NOT create a different product hierarchy.

The same:

```text
Planner
Summary
```

model must remain obvious.

---

## 37. Accessibility

Navigation implementation MUST preserve or improve:

```text
semantic navigation landmarks
semantic buttons/links
keyboard accessibility
visible focus
logical focus order
screen-reader accessible names
selected/current state announcement
non-color-only selected state
```

If using tabs or tab-like semantics, implement appropriate accessible behavior rather than visual tabs alone.

Do not introduce custom keyboard interaction unless needed by the semantic control chosen.

---

## 38. Focus After Navigation

When navigation changes content:

- focus behavior must not become disorienting;
- mobile screen-reader users must be able to determine the newly active destination;
- keyboard users must not be stranded in removed content;
- modal/menu controls must return focus lawfully where applicable.

Use existing application accessibility conventions where available.

---

## 39. Route / View State

Prefer the existing routing/view-state architecture.

Do not add a routing dependency.

Task 9.18 MUST document which new navigation values are:

```text
URL/route state
session application state
component-local state
```

No new navigation value may become persisted domain authority.

If the application currently lacks URL routing, Task 9.18 does not require introducing it merely to satisfy product hierarchy.

---

## 40. Deep-Link Compatibility

If current routing supports deep linking, preserve lawful existing deep links where feasible.

If it does not, do not build a new routing framework.

The new shell SHOULD avoid architectural choices that make later deep linking to:

```text
Planner day
Goal
Review item
Summary drill-down
```

unnecessarily difficult.

Document the assessment.

---

## 41. Lazy Loading

Task 9.18 MUST treat bundle pressure as an architectural constraint.

Task 9.16 / 9.17 baseline:

```text
Initial gzip:       168,185 bytes
Hard limit:         170,000 bytes
Hard headroom:        1,815 bytes
Initial raw:        645,745 bytes
Largest lazy chunk:  59,671 bytes
Total emitted:    1,127,513 bytes
```

The hard initial-gzip threshold MUST remain:

```text
170,000 bytes
```

Do not raise it.

Where the new shell introduces feature boundaries, prefer lazy loading for substantial secondary surfaces where safe.

Likely candidates include, subject to repository evidence:

```text
My Schedule editors
Goals detail/editor
Review Plan
advanced Summary
Sleep conversion/recovery flows
historical drill-down
```

Do not duplicate validators or semantic helpers merely to achieve chunking.

---

## 42. Bundle Architecture

The shell itself should remain small.

Do not eagerly import every Planner child merely because Planner owns their navigation.

Conceptually prefer:

```text
small shell
    ↓
selected feature boundary
    ↓
lazy feature implementation
```

where repository architecture supports it.

Any new lazy boundary MUST preserve deterministic behavior and testability.

---

## 43. Loading States

If Task 9.18 adds lazy boundaries, provide bounded user-facing loading behavior.

Loading UI MUST:

```text
identify the destination being opened
avoid implying missing data
avoid resetting selected navigation
avoid exposing architecture internals
```

Do not use loading state as a substitute for protected/unknown authority states.

---

## 44. Error Boundaries

Do not broadly redesign application error handling.

If new lazy navigation introduces load-failure handling, distinguish:

```text
feature failed to load
```

from:

```text
planning unavailable
history protected
no data
```

Do not convert technical load failures into domain states.

---

## 45. No Product-Semantic Reconstruction in Shell

The new shell MUST NOT directly calculate:

```text
Capacity
Goal feasibility
Proposal state
publication readiness
Today truth
Sleep feasibility
historical effectiveness
execution status
```

merely to render navigation badges or summaries.

If a navigation indicator requires semantic knowledge, consume an existing canonical read model.

If no safe read model exists, omit the indicator and record the gap.

Do not reconstruct semantics in React.

---

## 46. Navigation Badges

Task 9.18 does not require badges.

If existing read models make a simple indicator safe, such as an existing count of items needing attention, it MAY be reused.

Do not add new aggregation logic merely to decorate navigation.

No badge is preferable to a semantically ambiguous badge.

---

## 47. Setup and Supporting Utilities

Audit current access to:

```text
setup
profiles
backup/restore
import/export
other required supporting utilities
```

Task 9.17's two-surface model does not mean these utilities must become Planner or Summary content.

If currently required, preserve a coherent secondary/settings path.

They MUST NOT remain competing primary product destinations solely because they are not Planner/Summary content.

Do not perform a full Settings architecture redesign.

---

## 48. Pattern Library

Pattern Library remains contextual rather than a primary destination.

If currently present, preserve lawful access from the workflow that needs it.

Do not promote it to primary navigation.

Do not redesign its semantics.

---

## 49. Legacy Surface Retirement

Task 9.18 MAY remove obsolete primary-navigation entries.

It SHALL NOT delete the underlying legacy surface/component unless all of the following are proven:

```text
capability parity
replacement reachability
mobile reachability
authority equivalence
tests
no remaining compatibility consumer
```

The default disposition in Task 9.18 is:

```text
remove from primary navigation
retain behind new hierarchy temporarily
```

not:

```text
delete implementation
```

Later tasks own bounded retirement.

---

## 50. Dual-Path Governance

Where both old and new paths temporarily reach the same underlying capability:

```text
new path = canonical product path
old component = compatibility implementation
```

There MUST NOT be two competing semantic implementations.

Document every remaining dual path.

Where safe, remove obsolete user-visible entry points while retaining implementation reuse.

Avoid indefinite duplicate navigation.

---

## 51. G1 / G2 Boundary

Task 9.17 identified evidence-projection gaps that must be solved before complete Day convergence.

Task 9.18 MUST NOT solve those gaps opportunistically.

If the new Planner shell reaches a point where it would need to reconstruct selected-day evidence to look complete:

```text
STOP
```

Use the existing lawful compatibility surface instead.

Record the dependency for the next bounded task.

---

## 52. HistoricalPlan Recovery Boundary

Task 9.18 SHALL NOT implement destructive or reconstructive HistoricalPlan recovery.

If protected historical authority is encountered:

```text
preserve protection
preserve existing message/recovery path
do not silently abandon history
do not normalize
do not repair
```

Navigation MAY provide a path to existing safe inspection/recheck/export capability if already implemented.

Do not expose destructive abandonment merely to claim recovery reachability.

---

## 53. Found Time Boundary

Found Time remains outside Task 9.18 unless an existing lawful capability must be kept reachable.

Do not create:

```text
Found Time domain model
automatic duration → Progress
manual-event reinterpretation
```

during navigation migration.

Record the existing reachability accurately.

---

## 54. Recurring Goal Demand Boundary

Do not implement recurring Goal Demand.

Do not approximate it using Commitment recurrence.

Preserve existing Goal semantics.

---

## 55. Ongoing Goal Boundary

Do not invent ongoing Goal semantics in the shell.

If current architecture cannot represent an ongoing Goal cleanly, preserve that limitation and leave it for later bounded architecture work.

---

## 56. External Calendar / Holiday Boundary

Do not add:

```text
external calendar integration
automatic holiday import
remote calendar dependency
```

during navigation foundation work.

---

## 57. Local-First Requirement

Core navigation MUST remain local-first.

Planner and Summary MUST NOT require:

```text
network connectivity
cloud account
LLM response
external API
```

to function.

---

## 58. LLM Authority Boundary

No assistant or LLM capability is authorized by this task.

Preserve:

> **LLM has no scheduling authority.**

Do not add chat-driven navigation mutations or planning mutations.

---

## 59. Mobile Acceptance Gate — Standing Rule

Task 9.18 is the first implementation task governed by the standing **Mobile Acceptance Gate**.

This gate is mandatory.

Task 9.18 is **INCOMPLETE** if the gate fails.

The implementation MUST prove:

### Narrow-Phone Reachability

At approximately 320–360 CSS px:

- [ ] Planner is reachable.
- [ ] Summary is reachable.
- [ ] Calendar is reachable.
- [ ] My Schedule is reachable.
- [ ] Work Pattern is reachable.
- [ ] Commitments are reachable.
- [ ] Goals are reachable.
- [ ] Review Plan is reachable.
- [ ] required supporting/settings paths remain reachable.

### Layout

- [ ] no unintended document-level horizontal overflow.
- [ ] primary navigation does not clip required actions.
- [ ] secondary Planner navigation remains discoverable.
- [ ] child surfaces are not all rendered into one enormous Planner page.
- [ ] existing compatibility surfaces are not forced into unusably narrow nested panes.

### Touch

- [ ] primary navigation is touch-accessible.
- [ ] secondary navigation is touch-accessible.
- [ ] no canonical navigation action requires hover.
- [ ] no canonical navigation action requires right-click.
- [ ] no canonical navigation action requires double-click.
- [ ] no canonical navigation action requires mouse precision.

### Forms

- [ ] navigation does not make existing forms less usable on mobile.
- [ ] important save/cancel paths remain reachable.
- [ ] mobile keyboard interaction is not newly obstructed by shell layout.

### Navigation

- [ ] back behavior remains coherent.
- [ ] selected Planner context is preserved where intended.
- [ ] Today/current-day navigation resolves through Planner.
- [ ] changing destinations does not mutate planning authority.

### Dense Data

- [ ] Planner uses product-level progressive disclosure.
- [ ] large legacy surfaces are shown only when selected.
- [ ] navigation does not introduce duplicate giant lists.

### Semantics

- [ ] mobile and desktop use the same authority semantics.
- [ ] no mobile-only shortcut bypasses authoritative commands.
- [ ] no desktop-only route is required for canonical capability.

### Bundle

- [ ] initial gzip remains ≤170,000 bytes.
- [ ] threshold unchanged.
- [ ] lazy boundaries are used where justified.
- [ ] no semantic duplication was introduced to reduce bundle size.

Failure of any required item MUST either be corrected or explicitly block completion.

---

## 60. Architecture Acceptance Gate

Task 9.18 MUST also prove:

- [ ] no new semantic owner.
- [ ] no direct UI reconstruction of authoritative planning semantics.
- [ ] no Preview promoted to authority.
- [ ] no HistoricalPlan rewritten.
- [ ] no Goal Progress inferred from schedule geometry.
- [ ] no Proposal/SuggestedFix conflation.
- [ ] no unpublished planning presented as Published Plan.
- [ ] no unknown/protected state presented as zero/empty.
- [ ] no navigation action implicitly mutates authoritative state.
- [ ] canonical DayFrame-day semantics are reused.
- [ ] selected-day navigation remains presentation/session state.
- [ ] existing First-Class Sleep authority remains intact.

Failure of this gate blocks completion.

---

## 61. Capability-Parity Gate

Before removing any old user-visible primary navigation path, prove:

```text
old capability
→ new canonical path
→ same authority
→ mobile reachable
→ covered by tests
```

The RESULT MUST contain a capability-parity ledger.

If a capability cannot yet move safely:

```text
retain a bounded compatibility path
```

rather than deleting it.

---

## 62. Bundle Gate

The hard bundle gate remains:

```text
Initial gzip ≤ 170,000 bytes
```

Record:

```text
Task 9.17 / 9.16 baseline
Task 9.18 final
delta
remaining headroom
initial raw
largest lazy chunk
total emitted
```

Do not:

```text
raise threshold
disable bundle test
weaken warning
exclude required eager code dishonestly
```

If the shell cannot fit under the hard limit, Task 9.18 is INCOMPLETE.

---

## 63. Required Tests

Add focused regression coverage for the navigation foundation.

At minimum cover:

### Primary Navigation

```text
Planner visible
Summary visible
legacy peer primary destinations removed
Planner default
Summary selection
return to Planner
```

### Planner Secondary Navigation

```text
Calendar
My Schedule
Goals
Review Plan
```

### My Schedule

```text
Work Pattern reachable
Commitments reachable
```

### Today Transition

```text
Today shortcut/path enters Planner
current canonical DayFrame day selected
existing Today authority preserved
```

### Canonical Day Boundary

Test at least one non-midnight boundary:

```text
before boundary → expected owner day
after boundary → expected owner day
```

### Context

Test relevant preservation of:

```text
selected Planner subsection
selected date where supported
return from Summary
```

### Authority

Prove navigation alone does not mutate:

```text
authored setup
accepted allocations
PlanDecision
HistoricalPlan
ExecutionHistory
Progress
```

to the extent supported by existing test infrastructure.

### Compatibility Reachability

Test critical old capabilities through their new paths.

### Mobile

Use existing browser/component capabilities to validate narrow-width navigation behavior.

Do not add a dependency solely for viewport tests.

---

## 64. Responsive Validation

Where repository tooling permits rendered inspection, validate representative widths such as:

```text
320 px
390 px
768 px
1280 px
```

Record:

```text
viewport
primary navigation behavior
secondary navigation behavior
horizontal overflow
content clipping
touch/click reachability
notable vertical-density behavior
```

If automated viewport inspection is unavailable, perform the strongest existing repository-compatible validation and document the limitation.

Do not claim visual validation that did not occur.

---

## 65. Accessibility Validation

At minimum inspect/test:

```text
keyboard traversal
focus visibility
selected navigation state
semantic navigation
accessible names
focus after navigation
non-color-only active state
```

If automated accessibility tooling already exists, use it.

Do not add a dependency solely for this task unless absolutely necessary and explicitly justified.

---

## 66. Performance / Rendering Discipline

The shell MUST NOT eagerly mount every major feature.

Inspect:

```text
initial render
navigation switching
lazy feature loading
large compatibility surfaces
```

Avoid unnecessary rerenders caused by shell state subscribing to broad authoritative stores.

The navigation shell should subscribe only to state it actually requires.

Do not solve performance by caching stale authoritative projections.

---

## 67. Product Reachability Verification

After implementation, manually or through automated UI coverage verify these representative paths where supported by current product:

### Flow A — Start DayFrame

```text
open application
→ Planner
→ current canonical DayFrame day context
```

### Flow B — Calendar

```text
Planner
→ Calendar
→ choose/browse day
```

### Flow C — Work Pattern

```text
Planner
→ My Schedule
→ Work Pattern
```

### Flow D — Commitments

```text
Planner
→ My Schedule
→ Commitments
```

### Flow E — Goals

```text
Planner
→ Goals
```

### Flow F — Review

```text
Planner
→ Review Plan
```

### Flow G — Summary

```text
Planner
→ Summary
→ Planner
```

### Flow H — Today

```text
non-current Planner context
→ Today shortcut if retained
→ Planner/current canonical DayFrame day
```

Document any transitional compatibility surfaces encountered.

---

## 68. Required Before / After Navigation Map

The RESULT MUST include:

```text
BEFORE
```

showing the actual pre-9.18 primary navigation and major entry paths.

Then:

```text
AFTER
```

showing the actual post-9.18 hierarchy.

Use repository reality, not merely this specification.

---

## 69. Required Compatibility Ledger

Create a table:

| New Product Path | Current Implementation Reused | Authority Owner | Disposition | Future Task Dependency |
|---|---|---|---|---|

Include at minimum:

```text
Planner / Calendar
Planner / My Schedule / Work Pattern
Planner / My Schedule / Commitments
Planner / Goals
Planner / Review Plan
Summary
Today shortcut if retained
```

Add additional mappings discovered during implementation.

---

## 70. Required Reachability Ledger

Create:

| Capability | Before Path | After Path | Mobile Reachable? | Same Authority? | Status |
|---|---|---|---:|---:|---|

Use:

```text
PRESERVED
MOVED
TRANSITIONAL
BLOCKED
DEFERRED
```

Every critical currently valid capability must be accounted for.

---

## 71. Required Navigation-State Ledger

Create:

| State | Owner | Lifetime | Persisted? | Domain Authority? | Consumers |
|---|---|---|---:|---:|---|

At minimum cover:

```text
primary destination
Planner secondary destination
selected DayFrame day
visible calendar month if applicable
My Schedule subsection if applicable
```

---

## 72. Required Lazy-Boundary Ledger

Create:

| Feature | Eager/Lazy Before | Eager/Lazy After | Reason | Bundle Effect | Semantic Risk |
|---|---|---|---|---|---|

Account for all lazy-loading changes made by Task 9.18.

---

## 73. Required Mobile Validation Matrix

Create:

| Capability | 320–360px | 390–430px | 768px | ≥1024px | Same Authority? |
|---|---|---|---|---|---:|

Include at minimum:

```text
Planner
Summary
Calendar
My Schedule
Work Pattern
Commitments
Goals
Review Plan
Today/current-day path
supporting/settings path
```

---

## 74. Required Authority Mutation Audit

Record whether merely navigating among new destinations causes writes to any authoritative persistence owner.

Expected result:

```text
NO
```

except for pre-existing explicitly documented presentation/session persistence that is not domain authority.

Inspect at minimum:

```text
Active authored state
profiles
PlanDecision
HistoricalPlan
ExecutionHistory
Progress/measurement persistence
Sleep conversion authority
```

Do not introduce navigation-triggered writes to these stores.

---

## 75. Required Source-of-Truth Audit

For each new shell component, identify what it is allowed to own.

Expected shell ownership should be limited to concepts such as:

```text
selected primary destination
selected Planner subsection
selected My Schedule subsection
selected DayFrame day navigation context
transient expansion/menu state
```

It MUST NOT own semantic planning truth.

---

## 76. Required Error-State Check

Verify that the shell does not erase existing distinctions among:

```text
empty
loading
unknown
incomplete
protected
error
```

A feature loading lazily is not "no data."

Protected history is not "nothing scheduled."

Incomplete planning is not zero Capacity.

Record any shell-level handling introduced.

---

## 77. Required Empty-State Check

The new shell SHOULD NOT add empty cards merely because a destination has no attention items.

Preserve Task 9.17's principle:

> **Absence of a problem should usually reduce UI, not create another box saying there is no problem.**

Do not broadly redesign child empty states.

---

## 78. Required Product Copy Check

Audit only copy touched by Task 9.18.

Confirm:

```text
Planner
Summary
Calendar
My Schedule
Work Pattern
Commitments
Goals
Review Plan
```

are used consistently.

Do not perform an unrelated global terminology rewrite.

---

## 79. Required Repository Hygiene

Before implementation:

1. record `git rev-parse HEAD`;
2. record `git status --short`;
3. identify pre-existing dirty files;
4. identify Task 9.17 RESULT;
5. record baseline bundle measurements;
6. preserve existing dogfood forensic evidence.

During implementation:

1. do not clear preserved dogfood state;
2. use test/disposable state for destructive UI tests;
3. do not normalize historical stores;
4. do not run semantic migrations outside task scope.

After implementation:

1. inspect `git status --short`;
2. inspect task-specific diff;
3. run `git diff --check`;
4. account for every changed file;
5. confirm no dependency changes unless explicitly justified;
6. do not commit;
7. do not push.

---

## 80. Validation Commands

Run the repository's canonical equivalents of:

```text
npm run format
npm run prettier:check
npm run lint
npm run test
npm run build
npm run bundle
git diff --check
```

Use actual package scripts where names differ.

Also run focused tests for:

```text
application shell
navigation
Planner
Summary
canonical day selection
Today transition
mobile/responsive behavior
```

Record exact commands and results.

Do not weaken existing tests to obtain green status.

---

## 81. Test Baseline

Record:

```text
pre-task test-file count
pre-task test count
post-task test-file count
post-task test count
new Task 9.18 tests
```

If repository tooling reports counts differently, document the exact source.

All existing tests must remain green unless a test explicitly encoded the obsolete primary-navigation contract and is lawfully updated to the new accepted product architecture.

Do not delete semantic regression coverage merely because navigation changed.

---

## 82. Bundle Measurement

Record exact final:

```text
initial raw
initial gzip
hard threshold
remaining headroom
largest lazy chunk
total emitted
```

Compare against the Task 9.17 baseline:

```text
Initial gzip: 168,185 bytes
Hard limit:   170,000 bytes
Headroom:       1,815 bytes
```

If local build output differs from the recorded baseline before Task 9.18 changes, investigate and document the actual pre-task measurement before attributing the delta to this task.

---

## 83. Prohibited Changes

Do **not**:

- implement the final Day Worksurface;
- implement G1/G2 evidence projection;
- implement general HistoricalPlan recovery;
- redesign Work Pattern semantics;
- redesign Commitment semantics;
- redesign Goal semantics;
- implement ongoing Goals;
- implement recurring Goal Demand;
- implement Found Time semantics;
- redesign Capacity;
- redesign Proposal;
- redesign Allocation;
- redesign Friction;
- redesign SuggestedFix;
- redesign publication;
- redesign execution;
- redesign Progress;
- redesign First-Class Sleep;
- change Sleep solver behavior;
- change Sleep conversion semantics;
- change persistence ownership;
- bump Active schema;
- bump Profile schema;
- bump Backup schema;
- bump HistoricalPlan schema;
- bump ExecutionHistory schema;
- add a routing framework;
- add a responsive UI framework;
- add a component library merely for navigation;
- add an external service;
- add an LLM workflow;
- auto-publish;
- auto-accept;
- auto-record execution;
- auto-repair history;
- clear preserved dogfood evidence;
- raise the 170,000-byte bundle limit;
- weaken validation;
- commit;
- push.

---

## 84. Stop Conditions

Stop and return Task 9.18 as INCOMPLETE if implementation requires any of the following to proceed:

```text
new semantic owner
persistence migration
schema migration
change to canonical DayFrame-day semantics
change to planning authority
change to publication authority
change to historical authority
change to Sleep authority
reconstruction of G1/G2 evidence inside UI
destructive HistoricalPlan recovery
bundle threshold increase
unbounded redesign of child surfaces
new routing framework
```

Also stop if repository evidence materially contradicts Task 9.17's assumed navigation foundation and resolving the contradiction requires a normative architecture decision.

Document:

```text
discovered condition
affected requirement
repository evidence
available alternatives
downstream consequences
decision required
```

Do not silently choose a new product architecture.

---

## 85. Required RESULT Artifact

Create exactly one durable task result artifact:

```text
PHASE_9_TASK_9_18_PLANNER_SUMMARY_NAVIGATION_FOUNDATION_V1_RESULT.md
```

Place it in the existing Phase 9 RESULT location.

The filename MUST contain:

```text
RESULT
```

Do not create multiple competing result summaries.

---

## 86. Required RESULT Structure

The RESULT MUST contain these sections in this exact order:

```text
# Task 9.18 — Planner / Summary Navigation Foundation V1 RESULT

## 1. Executive Summary
## 2. Scope and Governing Constraints
## 3. Pre-Task Repository State
## 4. Task 9.17 Inputs Consumed
## 5. Pre-Implementation Navigation Audit
## 6. Pre-Implementation Reachability Audit
## 7. Pre-Implementation Navigation-State Ownership
## 8. Pre-Implementation Bundle State
## 9. Implementation Summary
## 10. Primary Navigation Implementation
## 11. Planner Default-Destination Implementation
## 12. Planner Secondary Navigation
## 13. Calendar Compatibility Path
## 14. My Schedule Compatibility Path
## 15. Work Pattern Reachability
## 16. Commitment Reachability
## 17. Goals Reachability
## 18. Review Plan Reachability
## 19. Summary Reachability
## 20. Today Transition
## 21. Selected-Day Navigation Ownership
## 22. Canonical Day Boundary Handling
## 23. Supporting / Settings Utility Reachability
## 24. Pattern Library Reachability
## 25. First-Class Sleep Reachability
## 26. Compatibility Mapping
## 27. Dual-Path Governance
## 28. Before / After Navigation Map
## 29. Capability Preservation Ledger
## 30. Reachability Ledger
## 31. Navigation-State Ledger
## 32. Source-of-Truth Audit
## 33. Authority Mutation Audit
## 34. Preview Authority Check
## 35. Publication Authority Check
## 36. Execution Authority Check
## 37. Historical Authority Check
## 38. First-Class Sleep Authority Check
## 39. Lazy-Loading Architecture
## 40. Lazy-Boundary Ledger
## 41. Loading / Error-State Handling
## 42. Product Copy Changes
## 43. Mobile Navigation Implementation
## 44. Narrow-Phone Validation
## 45. Typical-Phone Validation
## 46. Tablet Validation
## 47. Desktop Validation
## 48. Mobile Validation Matrix
## 49. Touch Interaction Validation
## 50. Back-Navigation Validation
## 51. Planner Context Preservation
## 52. Accessibility Validation
## 53. Mobile Acceptance Gate
## 54. Architecture Acceptance Gate
## 55. Capability-Parity Gate
## 56. Bundle Gate
## 57. Focused Test Coverage
## 58. Full Regression Results
## 59. Build Results
## 60. Bundle Results
## 61. Performance / Rendering Assessment
## 62. Repository Hygiene
## 63. Changed Files
## 64. Pre-Existing Dirty Files
## 65. Deferred Convergence Work
## 66. Newly Discovered Risks
## 67. Task 9.19 Dependency Assessment
## 68. Completion Assessment
```

---

## 87. Task 9.19 Dependency Assessment

The RESULT MUST explicitly assess whether the repository is ready for the next bounded convergence task.

Based on Task 9.17, the expected next concern is the required evidence-projection work before full Day convergence.

Do not assume its exact title or implementation until Task 9.18 repository evidence is complete.

Answer:

```text
1. Is the two-destination shell stable enough to build upon?
2. Are G1/G2 still the next blocking semantic projection gaps?
3. Did Task 9.18 expose any new prerequisite?
4. Can the next task proceed without changing navigation again?
5. Are any compatibility paths too fragile to support the next slice?
6. What mobile-specific constraints must the next task inherit?
7. What bundle headroom remains?
```

Do not implement the next task.

---

## 88. Completion Criteria

Task 9.18 is COMPLETE only if all applicable criteria below are satisfied.

### Navigation

- [ ] Planner and Summary are the only ordinary primary product destinations.
- [ ] Planner is the default ordinary destination.
- [ ] Calendar is reachable through Planner.
- [ ] My Schedule is reachable through Planner.
- [ ] Work Pattern is reachable through My Schedule.
- [ ] Commitments are reachable through My Schedule.
- [ ] Goals are reachable through Planner.
- [ ] Review Plan is reachable through Planner.
- [ ] Summary is reachable as the second primary destination.
- [ ] Today no longer competes as a separate primary destination.
- [ ] Today/current-day behavior resolves through Planner.
- [ ] required supporting utilities remain reachable.

### Compatibility

- [ ] existing valid capability is not stranded.
- [ ] compatibility mappings are explicit.
- [ ] no duplicate semantic implementation was introduced.
- [ ] dual paths are classified.
- [ ] no premature legacy component retirement occurred.

### Temporal Semantics

- [ ] current DayFrame day uses canonical boundary semantics.
- [ ] non-midnight boundary regression coverage exists.
- [ ] selected-day navigation is presentation/session state.
- [ ] selected-day changes do not alter planning horizons or authority.

### Authority

- [ ] no new semantic owner exists.
- [ ] Preview remains disposable.
- [ ] publication remains explicit.
- [ ] execution remains distinct from planning.
- [ ] historical protection remains fail-closed.
- [ ] Goal Progress is not inferred from geometry.
- [ ] Proposal and SuggestedFix remain distinct.
- [ ] First-Class Sleep authority remains unchanged.
- [ ] navigation itself does not mutate authoritative state.

### Mobile Acceptance Gate

- [ ] narrow-phone Planner reachable.
- [ ] narrow-phone Summary reachable.
- [ ] all Planner secondary destinations reachable.
- [ ] no unintended document-level horizontal overflow.
- [ ] no canonical desktop-only gesture.
- [ ] touch targets are practical.
- [ ] existing forms are not made less usable.
- [ ] back behavior is coherent.
- [ ] Planner context preservation is reasonable.
- [ ] dense child surfaces use product-level progressive disclosure.
- [ ] mobile and desktop share authority semantics.
- [ ] bundle gate passes.

### Accessibility

- [ ] semantic navigation.
- [ ] keyboard reachable.
- [ ] visible focus.
- [ ] accessible navigation labels.
- [ ] selected/current state not color-only.
- [ ] focus behavior remains coherent.

### Bundle / Performance

- [ ] initial gzip ≤170,000 bytes.
- [ ] threshold unchanged.
- [ ] final headroom recorded.
- [ ] lazy boundaries documented.
- [ ] shell does not eagerly mount every major feature.
- [ ] no semantic duplication for chunking.

### Validation

- [ ] focused tests pass.
- [ ] full tests pass.
- [ ] format passes.
- [ ] Prettier check passes.
- [ ] lint passes.
- [ ] build passes.
- [ ] bundle gate passes.
- [ ] `git diff --check` passes.
- [ ] changed files accounted for.
- [ ] no unauthorized dependency added.
- [ ] no commit.
- [ ] no push.
- [ ] required RESULT exists.

---

## 89. Final Completion Statement

If and only if every required completion criterion is satisfied, end the RESULT with exactly:

```text
Task 9.18 — Planner / Summary Navigation Foundation V1 is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.18 — Planner / Summary Navigation Foundation V1 is INCOMPLETE.
```

Then identify the exact blockers.

---

## 90. Governing Migration Principle

Task 9.18 is not successful because fewer navigation buttons exist.

It is successful when DayFrame has one understandable product hierarchy while the authority model beneath it remains unchanged.

The intended result is:

```text
DayFrame
│
├── Planner
│   │
│   ├── Calendar
│   ├── My Schedule
│   │   ├── Work Pattern
│   │   └── Commitments
│   ├── Goals
│   └── Review Plan
│
└── Summary
```

with:

```text
Today
    ↓
Planner / current canonical DayFrame day
```

and with existing implementation reused behind that hierarchy until later convergence tasks replace it safely.

The final governing rules are:

> **Change navigation before changing semantics.**

> **Introduce the replacement path before retiring the old implementation.**

> **The shell may organize authority, but it may never become authority.**

> **Mobile reachability is a completion requirement, not deferred polish.**

> **If a canonical DayFrame workflow is awkward or unreachable on a phone, the convergence task is not complete.**