# Task 9.20 — Canonical Day Worksurface Convergence V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Product Convergence  
**Task Type:** Bounded Product Convergence / G1 Consumer Implementation / Mobile UX / Compatibility-Preserving Migration  
**Prerequisites:** Task 9.19 — Canonical Product Evidence Projection V1 — ACCEPTED COMPLETE  
**Primary Specification Authorities:** Task 9.17 RESULT; Task 9.18 RESULT; Task 9.19 RESULT; accepted Phase 9 authority architecture  
**Implementation Changes:** AUTHORIZED  
**Persistence Changes:** PROHIBITED  
**Schema / Storage-Version Changes:** PROHIBITED  
**Authority Mutation Changes:** PROHIBITED EXCEPT EXISTING CANONICAL COMMANDS MAY BE WIRED THROUGH EXISTING TARGETS  
**Navigation Changes:** BOUNDED TO DAY-WORKSURFACE CONVERGENCE  
**Day Worksurface Implementation:** REQUIRED  
**Compatibility Surface Retirement:** PROHIBITED EXCEPT WHERE EXPLICIT PARITY CRITERIA IN THIS TASK AUTHORIZE A NON-DESTRUCTIVE ROUTING CHANGE  
**Summary Convergence:** PROHIBITED  
**HistoricalPlan Recovery:** PROHIBITED  
**Found Time Architecture:** PROHIBITED  
**Recurring Goal Demand:** PROHIBITED  
**Mobile Acceptance Gate:** MANDATORY — MAJOR COMPLETION GATE  
**Bundle Hard Gate:** 170,000-byte initial gzip — MUST NOT BE RAISED  
**Task 9.19 Final Initial Gzip Baseline:** 161,577 bytes  
**Task 9.19 Remaining Hard Headroom:** 8,423 bytes  
**Required Durable Output:** `PHASE_9_TASK_9_20_CANONICAL_DAY_WORKSURFACE_CONVERGENCE_V1_RESULT.md`

---

## 1. Objective

Implement the first canonical product-facing **Day Worksurface** for an arbitrary selected DayFrame owner day.

Task 9.18 established the product shell:

```text
DayFrame
├── Planner
│   ├── Calendar
│   ├── My Schedule
│   ├── Goals
│   └── Review Plan
└── Summary
```

Task 9.19 established G1:

```text
querySelectedDayEvidence({
    ownerDay,
    asOf
})
```

G1 now provides a lawful read-only composition of selected-day evidence without:

- abusing Today;
- fabricating an evaluation instant;
- flattening planned/published/actual authority;
- rewriting historical evidence;
- reconstructing provenance in React.

Task 9.20 SHALL make that evidence usable as a coherent mobile-first day experience.

The required product progression is:

```text
Planner
  ↓
Calendar
  ↓
Selected Day
  ↓
Canonical Day Worksurface
```

and:

```text
Today shortcut
  ↓
resolve current canonical owner day
  ↓
same Canonical Day Worksurface
```

The governing objective is:

> **A DayFrame day should have one reusable product worksurface regardless of whether the user reached it from Calendar or Today, while preserving every underlying authority distinction established by G1.**

---

## 2. Governing Product Principle

The governing rule is:

> **One day, one worksurface, many authority layers.**

The Day Worksurface MAY visually compose:

```text
Work
Sleep
Commitments
Goal work
Support Activities
Protected Buffers
Manual Events
Published Plan evidence
Actual outcomes
Friction / attention
```

but MUST NOT imply that those items have identical authority.

The Day Worksurface is a product composition.

It is NOT:

```text
a schedule engine
a publication owner
an execution owner
a Progress owner
a HistoricalPlan owner
a new persistence layer
a second Today read model
a replacement for G1
```

React MUST consume canonical evidence rather than reconstructing DayFrame semantics.

---

## 3. Required Discovery Gate

Before implementation, inspect the current Task 9.18/9.19 repository and identify:

```text
A. Current Planner → Calendar selected-day behavior.
B. Current Today shortcut behavior.
C. Current SelectedDayWorkspace behavior.
D. Current TodaySurface behavior.
E. Current HistoricalPlanReportingSection behavior.
F. Current manual-event editing/reporting paths.
G. Current Goal-work outcome-reporting paths.
H. Current Commitment/Work reporting paths.
I. Current Sleep publication/execution reporting paths.
J. Existing Back/navigation-context behavior.
K. Existing narrow-phone layout constraints.
L. Existing lazy boundaries affecting these surfaces.
```

Classify each relevant current behavior:

```text
REUSE
ADAPT
WRAP
KEEP AS COMPATIBILITY
REPLACE WITH G1 CONSUMER
DEFER
```

Do not begin by deleting Today, SelectedDayWorkspace, historical reporting, or existing reporting components.

Discovery MUST determine what semantic/action parity is actually possible in this bounded task.

---

## 4. Required Pre-Implementation Capability Matrix

Before changing product behavior, create a working matrix equivalent to:

| Capability | Calendar Selected Day | Today | Historical Reporting | G1 | 9.20 Target |
|---|---|---|---|---|---|
| Select arbitrary owner day | | | | | |
| Current-day orientation | | | | | |
| Work | | | | | |
| Commitments | | | | | |
| Goal work | | | | | |
| Support | | | | | |
| Protection | | | | | |
| Manual Events | | | | | |
| First-Class Sleep | | | | | |
| Published evidence | | | | | |
| Actual outcome | | | | | |
| Report outcome | | | | | |
| Correct outcome | | | | | |
| Retract outcome | | | | | |
| Protected history | | | | | |
| Friction / attention | | | | | |
| Navigate to source | | | | | |

Use repository evidence.

The final RESULT MUST include the completed matrix.

---

## 5. Canonical Day Worksurface Contract

Create one reusable Day Worksurface keyed by:

```text
ownerDay
asOf
navigation context
```

`ownerDay` is the selected canonical DayFrame day.

`asOf` is the real evaluation instant supplied to G1.

Navigation context may determine:

```text
Back destination
Calendar month context
whether entry came from Today
whether entry came from another Planner surface
```

Navigation context MUST NOT alter evidence truth.

The same:

```text
ownerDay + asOf
```

must yield the same semantic G1 evidence regardless of entry path.

---

## 6. G1 Is the Canonical Evidence Source

The Day Worksurface MUST consume the Task 9.19 G1 public contract.

Do not reconstruct selected-day semantics by independently joining:

```text
Preview
HistoricalPlan
ExecutionHistory
Sleep
Manual Events
Realization
Today
```

inside React.

Presentation helpers MAY transform G1 output into display-ready structures only if they:

- preserve G1 identity;
- preserve G1 authority layer;
- preserve G1 availability/protection;
- preserve G1 role;
- introduce no new semantic claim.

If a missing display requirement appears to require reconstructing authority outside G1:

```text
STOP CONDITION — EVIDENCE CONTRACT GAP
```

Document the missing evidence and do not invent it in the component.

---

## 7. No Fake Today

The Day Worksurface MUST NOT implement historical/future days by passing a fabricated instant into Today.

Prohibited pattern:

```text
selected date
  ↓
construct fake noon/midnight timestamp
  ↓
query Today
```

Required pattern:

```text
selected ownerDay
real current asOf
  ↓
G1
  ↓
Day Worksurface
```

Today becomes an entry/navigation concept, not a second semantic day model.

---

## 8. Current-Day Resolution

The Today shortcut SHALL resolve the **current canonical DayFrame owner day**, not the civil calendar date.

Use existing canonical boundary logic.

Example:

If:

```text
civil date = Tuesday
clock = 03:00
effective DayFrame boundary = 06:00
```

then Today may still resolve to Monday's DayFrame owner day.

Add regression coverage for a non-midnight boundary.

Do not use:

```text
new Date().toISOString().slice(...)
```

or equivalent civil-date logic as DayFrame ownership.

---

## 9. Selected-Day Navigation

Planner Calendar day selection SHALL open the Day Worksurface for that canonical owner label.

Preserve Calendar navigation state where practical:

```text
selected month
selected owner day
Back context
```

Opening a day MUST NOT:

```text
change planning horizon
generate Preview
publish schedule
accept Proposal
change authored setup
```

Calendar navigation remains independent of computation authority.

---

## 10. Day Worksurface Header

The Day Worksurface header SHALL provide human orientation before architectural detail.

At minimum display:

```text
human-readable date
Past / Today / Future orientation
```

Where canonical context is safely available, also provide concise useful context such as:

```text
Work cycle / segment
transition marker
day interval / boundary detail
```

Do not lead with:

```text
canonical owner label
truth
authority
HistoricalPlan
derived publication readiness
```

Technical detail may exist behind progressive disclosure where useful.

---

## 11. Day Worksurface Primary Structure

The mobile-first default structure SHALL be approximately:

```text
Day Header

Attention
  only when meaningful

Day Agenda
  chronological primary items

Additional / Manual Activity
  when applicable

Plan & Actual Detail
  progressive disclosure

Technical / Evidence Detail
  optional, lowest priority
```

Do not render a desktop information dashboard and then stack every panel vertically on mobile.

The first phone viewport should answer:

> **What is happening on this DayFrame day?**

not:

> **What internal evidence structures does DayFrame have?**

---

## 12. Agenda-First Presentation

The primary body SHALL be an agenda/list representation.

A full timeline MAY remain available as secondary presentation if existing implementation makes it useful, but Task 9.20 MUST NOT require a dense timeline for basic day comprehension.

Agenda items should prioritize:

```text
time
human subject title
relevant role/status
meaningful action
```

Architecture/provenance detail belongs behind disclosure.

---

## 13. Chronological Ordering

Use deterministic presentation ordering derived from G1 evidence.

Primary chronological ordering SHOULD use lawful physical/display start.

For equal-time items, use stable deterministic semantic/reference tiebreakers.

Do not rely on React array insertion order.

Cross-midnight items retain their canonical owner identity even when displayed at times after civil midnight.

---

## 14. Authority-Layer Presentation

The UI MUST preserve distinctions among:

```text
current planned evidence
published evidence
actual evidence
```

Do not solve this merely by placing every authority word on every card.

The presentation should be human-readable.

Possible user-facing concepts include:

```text
Planned
Published
Completed
Partially completed
Didn't do it
Outcome not recorded
Schedule changed since publication
```

Use only states supported by G1/existing execution semantics.

Do not invent a universal status enum if different subject types require different states.

---

## 15. Published vs Unpublished Changes

If a day has immutable Published Plan evidence and also current unpublished planning evidence, the Day Worksurface MUST NOT silently merge them into one authoritative schedule.

The user must be able to understand that:

```text
published plan
```

and:

```text
current/unpublished schedule evidence
```

may differ.

Use concise product language.

Do not expose implementation jargon unless placed in technical detail.

---

## 16. Work Presentation

Work should appear as a normal high-level day item where applicable.

Display should favor:

```text
Work
time
optional shift/segment label
relevant outcome status if reporting is lawfully supported
```

Do not display internal Work occurrence IDs in the primary card.

Cross-midnight Work must remain owned by the correct DayFrame day.

---

## 17. Commitment Presentation

Commitment cards should favor:

```text
title
time
relevant placement/context
outcome status when lawful
```

Do not expose recurrence/template internals in the default agenda.

Provide navigation/edit affordance only where an existing lawful path exists.

Do not make the Day Worksurface itself the new Commitment editor.

---

## 18. Goal Work Presentation

Scheduled Goal work SHALL identify its Goal where G1 provides sufficient provenance.

Target presentation concept:

```text
Network+ Study
3:15–4:15 PM

Part of Network+ goal.
DayFrame scheduled this from an accepted plan.
```

The exact copy may differ.

Where useful, progressive detail may expose:

```text
accepted planning iteration
Demand
Proposal / accepted-plan provenance
publication state
actual outcome
```

Do not expose raw accepted-allocation IDs in ordinary view.

Do not reconstruct G2 inside this task merely to add deep provenance.

If deep accepted-lineage display requires G2, either:

- use G2 through its canonical public query in a bounded lazy detail path; or
- defer deep provenance UI.

Do not duplicate G2 logic.

---

## 19. Support Activity Presentation

Support Activities SHALL remain visibly subordinate to the activity they support where G1 contains the necessary relationship.

Example conceptual presentation:

```text
Network+ Study
3:15–4:15 PM

Preparation
3:00–3:15 PM
```

Do not make Support Activity look like an unrelated Goal.

Do not call support productive Goal work.

Where grouping cannot be established canonically, preserve separate identity rather than guessing adjacency.

---

## 20. Protected Buffer Presentation

Protected Buffer is NOT an activity.

Do not present it with execution controls.

Use contextual presentation such as:

```text
Protected time
```

or:

```text
15 min protected after this activity
```

where the canonical relationship supports that presentation.

Buffers must remain visible enough to explain schedule geometry without dominating the agenda.

---

## 21. First-Class Sleep Presentation

First-Class Sleep SHALL appear as a first-class day subject.

The worksurface must preserve distinctions among:

```text
current Sleep planning
published Sleep
actual Sleep
explicit skipped/nonexecution
unplanned actual Sleep
unknown actual
protected/unavailable Sleep evidence
```

Do not represent Sleep as an ordinary Commitment.

Do not infer actual Sleep from the planned/published interval.

Do not infer current Sleep planning from historical publication.

Do not expose legacy Sleep heuristics as First-Class Sleep.

---

## 22. Sleep Card UX

Primary Sleep presentation should favor:

```text
Sleep
planned/published time
actual outcome if known
```

Progressive disclosure may show:

```text
before buffer
after buffer
current requirement
published snapshot
actual interval
difference between planned and actual
```

Do not overwhelm the primary agenda with Sleep solver internals.

States such as:

```text
searchIncomplete
contextIncomplete
protected
invalid
```

must receive human-facing product language while preserving the underlying semantic state.

---

## 23. Manual Event Presentation

Manual Events SHALL appear as authored user activity.

They MUST NOT be labeled:

```text
Completed
Executed
Found Time
Progress
```

unless separate canonical evidence explicitly establishes that meaning.

Provide existing edit/navigation behavior where lawful.

Manual event duration MUST NOT automatically become Goal Progress.

---

## 24. Found Time Boundary

Task 9.20 MUST NOT create Found Time architecture.

If a manual event is Goal-associated, it may display that association if canonically present.

It remains a Manual Event unless an existing canonical owner says otherwise.

Do not introduce:

```text
Record as Found Time
Count toward Goal
Auto-credit Progress
```

in this task.

---

## 25. Actual Outcome Presentation

Where G1 contains actual execution evidence, show human-readable outcome state.

Preserve at minimum:

```text
unknown / not recorded
explicit completed
explicit partial
explicit nonexecution / skipped
corrected outcome
retracted outcome → unknown current outcome
```

Use existing execution semantics.

Do not interpret:

```text
missing record = skipped
```

or:

```text
scheduled = completed
```

---

## 26. Outcome Reporting Actions

Where G1 exposes a canonical reporting target and the existing command supports the subject, the Day Worksurface MAY expose outcome actions.

Examples:

```text
Mark complete
Partially completed
Didn't do it
```

Exact available actions must follow the existing command semantics.

The Day Worksurface MUST NOT create a generic reporting command.

The flow SHALL be:

```text
G1 canonical target
  ↓
existing execution command
  ↓
command revalidates authority
  ↓
refresh G1
```

The projection does not guarantee command success.

---

## 27. Outcome Correction

Where existing commands support correction, expose a bounded correction path.

The UI must make clear that correction changes the recorded actual outcome, not the immutable Published Plan.

After correction:

```text
published plan remains frozen
actual evidence changes through existing authority
```

Do not rewrite publication geometry.

---

## 28. Outcome Retraction

Where existing commands support retraction, expose a bounded path where product parity requires it.

Retraction semantics MUST remain:

```text
previous assertion withdrawn
current actual outcome unknown
```

Retraction is NOT:

```text
Didn't do it
Delete plan
Delete history
```

Require appropriate confirmation where existing product conventions require it.

---

## 29. Sleep Outcome Reporting

Use existing First-Class Sleep execution commands.

Published Sleep reporting and unplanned Sleep reporting remain distinct.

Do not create a generic event-completion adapter that bypasses Sleep execution semantics.

If unplanned Sleep entry is not appropriate to the primary Day agenda, it may remain in progressive disclosure or compatibility UI for this task.

Document the decision.

---

## 30. Protected Evidence UX

If G1 reports protected evidence, the Day Worksurface MUST NOT render an apparently empty day.

Use human-facing language that communicates:

```text
some historical information cannot currently be read safely
```

without exposing unnecessary storage terminology.

The surface may show independent readable evidence alongside the protected state.

Dependent actions must remain unavailable.

Do not implement recovery.

---

## 31. Unknown Evidence UX

Unknown and unavailable states must be visually distinguishable from:

```text
nothing scheduled
nothing published
nothing happened
```

Examples:

```text
Outcome not recorded
Published plan unavailable
Schedule evidence unavailable
Sleep outcome not recorded
```

Use precise context.

Avoid one giant generic warning banner if the uncertainty is family-specific.

---

## 32. Meaningful Attention

The Day Worksurface MAY include a compact Attention area for existing day-scoped issues.

Examples may include:

```text
unresolved Friction
unplaced item
protected evidence
Sleep planning issue
unpublished schedule difference
```

Only include issues supported by canonical G1 evidence or an existing canonical read model.

Do not build a new recommendation engine.

Do not merge Proposal and SuggestedFix semantics.

---

## 33. Friction Boundary

Friction remains:

> incompatibility requiring corrective review.

Competition remains distinct.

If a day contains Friction, provide navigation to the existing corrective workflow where lawful.

Do not silently resolve Friction.

Do not bulk accept SuggestedFixes.

Do not implement a new conflict engine in the Day Worksurface.

---

## 34. Proposal Boundary

Pending constructive Proposals are NOT scheduled agenda items.

Accepted-but-unrealized planning is NOT scheduled agenda content.

They may be referenced in Attention or planning detail if an existing lawful query supports that presentation.

Primary day agenda is about actual day evidence, not hypothetical planning options.

---

## 35. Day Detail Progressive Disclosure

Dense detail SHALL be progressively disclosed.

A reasonable hierarchy is:

```text
Primary card
  ↓
Details
    ↓
Plan / publication / actual
    ↓
Source / provenance
```

On mobile, opening one item's detail MUST NOT require expanding every item.

Avoid the old pattern where one Advanced Options control expands all records.

---

## 36. One Focused Item at a Time

On narrow screens, item detail should generally focus one item at a time.

Acceptable patterns include:

```text
inline expansion
dedicated detail panel
sheet/dialog
nested Planner view
```

provided:

- Back is predictable;
- focus is managed;
- no horizontal overflow occurs;
- no hover is required;
- authority remains unchanged.

Do not add a dependency solely for a drawer/sheet component.

---

## 37. Mobile-First Information Priority

At approximately 320–430px, prioritize:

1. date/day orientation;
2. meaningful attention;
3. chronological agenda;
4. immediate lawful outcome actions;
5. item details;
6. provenance/technical detail.

Do not prioritize:

```text
internal IDs
storage state
full authority graphs
long read-only diagnostics
```

above basic day usability.

---

## 38. Desktop Enhancement

At wider layouts, Day Worksurface MAY use additional horizontal space for:

```text
agenda + detail
agenda + timeline
agenda + context
```

but desktop MUST NOT receive different semantic truth.

Mobile is not a reduced-authority mode.

Desktop enhancements must remain optional presentation.

---

## 39. Calendar Relationship

Calendar remains a browsing/navigation surface.

Month SHALL NOT become a mini Day Worksurface.

Keep Month sparse enough to scan.

Day selection opens the full worksurface.

Do not render every execution/provenance detail inside calendar cells.

---

## 40. Today Shortcut Convergence

Today SHALL become a shortcut into the same Day Worksurface.

Required behavior:

```text
Today
  ↓
resolve current canonical owner day
  ↓
open Day Worksurface(ownerDay=currentCanonicalDay)
```

Task 9.20 may preserve an internal compatibility wrapper if required for existing tests/actions.

But ordinary product behavior should no longer require the user to understand Today as a separate destination with separate truth.

---

## 41. Today Compatibility Requirement

Do not delete `TodaySurface` merely because the new worksurface exists.

First determine whether all important current Today capabilities have lawful replacements.

Classify every Today capability:

```text
PARITY
WRAPPED
DEFERRED
COMPATIBILITY REQUIRED
```

If any important capability remains compatibility-required, preserve the component/path internally or contextually.

Do not claim Today retirement until parity is demonstrated.

---

## 42. SelectedDayWorkspace Compatibility Requirement

Perform the same assessment for the current selected-day workspace.

Do not delete it merely to reduce component count.

Where it owns useful actions not yet converged:

```text
reuse
wrap
or preserve compatibility
```

rather than recreating commands.

---

## 43. Historical Reporting Compatibility Requirement

`HistoricalPlanReportingSection` or equivalent historical reporting functionality MUST remain available until G1-based reporting proves parity.

Task 9.20 MAY reuse existing reporting components beneath the new worksurface if their semantics remain lawful.

Do not delete historical reporting merely because G1 exposes canonical targets.

---

## 44. Compatibility Retirement Rule

A compatibility surface may be considered eligible for later retirement only if:

```text
semantic parity
action parity
protection parity
mobile parity
accessibility parity
test parity
```

are demonstrated.

Task 9.20 does NOT need to perform final retirement.

Prefer:

```text
converge first
retire later
```

---

## 45. Navigation Back Contract

Back behavior must be deterministic.

Examples:

```text
Calendar → Day → Back → same Calendar month/context
Today shortcut → Day → Back → appropriate Planner context
Goal detail → Day → Back → prior context
```

Do not use browser history accident as the sole product navigation contract if the app already owns session navigation state.

Preserve Task 9.18's Planner navigation foundation.

---

## 46. Direct Day Changes

Within the Day Worksurface, provide only bounded day navigation if it improves usability and preserves Calendar context.

Possible controls:

```text
Previous Day
Next Day
Today
```

If implemented, these must use canonical owner-day arithmetic.

Do not use civil `+24h` arithmetic across timezone/boundary transitions.

Do not make direct day controls mandatory if existing Planner navigation provides a cleaner bounded solution.

Document the choice.

---

## 47. Calendar Month Context

Navigating from a selected day back to Calendar SHOULD preserve the user's browsed month.

Opening a day outside the currently browsed month through another route must not silently corrupt month state.

Do not bind selected owner day and month navigation so tightly that one becomes the other's semantic authority.

---

## 48. Past / Current / Future Product Modes

The Day Worksurface should adapt interaction availability by day mode.

### Past

Favor:

```text
published evidence
actual outcomes
manual evidence
historical reporting/correction
```

Do not fabricate current planning as historical truth.

### Current

Favor:

```text
today's agenda
published/current distinctions
actual reporting
manual activity
attention
```

### Future

Favor:

```text
planned/published future evidence
manual events
source navigation
review-plan links
```

Do not show execution actions merely because a future scheduled item exists.

Use existing command admission semantics.

---

## 49. Current Source Context on Historical Days

G1 may lawfully expose current authored/planning context while viewing a past day.

The UI MUST NOT present that as frozen historical truth.

If shown, label it clearly as current/unpublished/current setup context.

When this would confuse ordinary use, prefer progressive disclosure rather than removing the evidence from the canonical model.

---

## 50. Empty Day UX

A genuinely empty readable day should have a useful quiet state.

Example concept:

```text
Nothing scheduled for this DayFrame day.
```

But only show a true empty state when the relevant evidence families are sufficiently readable to support that claim.

If publication/history/planning is unavailable or protected, do not falsely claim the day is empty.

---

## 51. No Generation Requirement for Browsing

Opening a day MUST NOT require schedule generation.

Calendar and Day Worksurface must remain usable when:

```text
Preview does not exist
Preview is stale
selected day is outside Preview
planning evidence is unavailable
```

Show the evidence that exists.

Do not prompt the user to generate merely to view manual, historical, published, actual, or other independent evidence.

---

## 52. Stale Preview UX

If G1 reports stale Preview/current planning evidence, the worksurface may show it only with truthful qualification.

Do not present stale generated evidence as current published truth.

Do not automatically regenerate.

Provide navigation to the existing planning/review flow where appropriate.

---

## 53. Publication Boundary

Task 9.20 does not redesign publication.

If the user needs to publish/review changes, navigate to Review Plan.

Do not put a hidden automatic Publish action into the Day Worksurface.

Do not publish on day open, edit, outcome report, or navigation.

---

## 54. Edit Boundary

Day Worksurface may provide navigation to existing editors.

Examples:

```text
View Commitment
Edit Manual Event
View Goal
Adjust Plan
View Sleep setup
```

Do not recreate full Work Pattern, Commitment, Goal, or Sleep editors inside Day Worksurface.

My Schedule and Goals remain canonical product homes for source editing.

---

## 55. Goal Navigation

Where Goal identity is canonical, provide a lawful path to the Goal detail/planning surface.

Do not navigate by title search.

Use durable Goal identity.

Preserve Planner navigation context for Back behavior.

---

## 56. Commitment Navigation

Where Commitment identity is canonical and existing editor routing supports it, navigate using durable source identity.

Do not locate a Commitment by display title/time.

If no stable product route exists yet, defer rather than creating a heuristic route.

---

## 57. Sleep Navigation

Sleep source/edit navigation should lead to the First-Class Sleep product location established under My Schedule when that path is available.

If Task 9.20 discovers the general First-Class Sleep editor is still not product-reachable, document the gap.

Do not solve the entire Sleep editor in this task.

---

## 58. Work Navigation

Work source navigation should lead to My Schedule → Work Pattern where useful.

Do not edit Work geometry directly from a day item.

The day item is an occurrence/product view, not the Work Pattern authority owner.

---

## 59. Accessibility Requirements

Any new Day Worksurface interaction MUST support:

```text
keyboard navigation
visible focus
semantic headings
button/link semantics
meaningful accessible names
focus return after closing detail
screen-reader meaningful status text
non-color-only state distinction
zoom/reflow without required horizontal scrolling
```

If using dialogs/sheets:

```text
focus entry
focus containment where appropriate
Escape behavior
focus restoration
```

must be validated.

Do not claim screen-reader certification unless actually tested.

---

## 60. Touch Requirements

Primary interactive controls must be practically touchable.

Target approximately:

```text
44 CSS px
```

for primary touch controls where layout permits.

Do not place critical actions in tiny inline text links.

Do not require:

```text
hover
right click
double click
precision mouse targeting
```

---

## 61. Narrow-Phone Requirement

The complete primary workflow MUST be usable around 320–360 CSS px.

Required workflow:

```text
Planner
→ Calendar
→ select day
→ understand agenda
→ open one item
→ inspect planned/published/actual state
→ perform lawful outcome action where supported
→ return
→ navigate Back
```

No horizontal page overflow.

Long labels must wrap or truncate safely without hiding required meaning.

---

## 62. 390–430px Requirement

Validate common modern phone widths.

The experience should not merely technically fit; it should preserve:

```text
clear hierarchy
reasonable density
reachable actions
predictable detail disclosure
```

Record representative viewport evidence.

---

## 63. Tablet Requirement

At approximately 768px:

- preserve the same semantic hierarchy;
- use additional space where useful;
- do not force phone-only interaction patterns;
- no layout discontinuity that makes actions unreachable.

---

## 64. Desktop Requirement

At ≥1024px:

- maintain Planner hierarchy;
- preserve selected-day context;
- optional richer layout may be used;
- no mobile-only semantic omissions;
- no separate desktop evidence implementation.

---

## 65. Mobile Keyboard / Form Requirement

If any reporting/editing interaction opens inputs on mobile:

- keyboard appearance must not hide the primary confirmation action without a usable scroll path;
- numeric inputs should use appropriate input behavior;
- focus order must remain coherent;
- cancel/back behavior must be predictable.

Do not redesign all forms in this task.

Validate touched forms only.

---

## 66. Loading State

Because G1 is a lazy async store query, the Day Worksurface MUST have a bounded loading state.

Do not render:

```text
empty day
```

while G1 is still loading.

Avoid large layout shifts where practical.

Changing selected day while a previous query is pending must not allow stale results to overwrite the newer selection.

---

## 67. Async Race Safety

Explicitly test:

```text
select day A
query A starts
select day B
query B starts
query A resolves after B
```

The worksurface must remain on B.

Do not treat an older asynchronous G1 response as current simply because it resolves later.

Use a bounded request identity/cancellation/current-selection check consistent with repository patterns.

No new dependency.

---

## 68. Error State

If G1 returns:

```text
invalidQuery
error
```

show a bounded product error state.

Do not translate query failure into an empty agenda.

Provide a safe retry or navigation path where appropriate.

Do not expose stack traces/internal IDs to ordinary users.

---

## 69. Refresh After Commands

After a successful existing outcome/correction/retraction command, refresh the Day Worksurface from G1.

Do not locally patch the displayed authority and assume success.

Required model:

```text
command succeeds
  ↓
query canonical evidence again
  ↓
render resulting truth
```

If command fails, retain prior evidence and display the lawful failure.

---

## 70. No Optimistic Authority

Do not optimistically show:

```text
Completed
Didn't do it
Corrected
```

before the canonical command succeeds.

Transient button loading state is acceptable.

Authority status changes only after command success and evidence refresh.

---

## 71. Existing Command Revalidation

Remember the Task 9.19 G1 contract:

```text
targetAvailable
```

does NOT mean:

```text
command guaranteed to succeed
```

Existing command owners revalidate current authority.

The UI must handle:

```text
target was visible
command later rejects
```

without corrupting local state.

---

## 72. G2 Use Boundary

Task 9.20 is primarily a G1 consumer task.

G2 MAY be used only for bounded detail that materially improves Goal-work provenance.

Do not make every day query automatically run G2 for every Goal item if the primary agenda does not require it.

Prefer lazy detail query:

```text
open Goal-work provenance detail
  ↓
query G2 by scheduled fact
```

if deep provenance is implemented.

Preserve bundle and runtime efficiency.

---

## 73. Performance Requirement

Day navigation should feel bounded.

Avoid:

```text
querying G2 for every agenda item on initial render
full-history exports
full schedule regeneration
re-solving unrelated planning
unbounded execution scans introduced by UI
```

G1 already owns the lawful composition.

Measure representative Day Worksurface query/render behavior.

Do not establish an SLO from one local machine.

---

## 74. Large-Day Requirement

Test a representative dense day.

Include enough items to exercise:

```text
Work
Sleep
multiple Commitments
multiple Goal-work facts
support
buffers
manual events
actual outcomes
attention
```

The mobile surface must remain navigable.

Do not render all provenance expanded by default.

---

## 75. Long-History Requirement

Opening one day must not render years of historical records.

Historical detail must remain bounded to selected-day evidence and explicit drill-down.

Do not put the entire HistoricalPlan history list beneath every day.

---

## 76. Product Vocabulary

Prefer ordinary product language.

Good candidates:

```text
Today
Planned
Published
Completed
Partially completed
Didn't do it
Outcome not recorded
Protected time
Schedule needs review
View Goal
Adjust Plan
```

Avoid ordinary UI labels such as:

```text
canonical
truth
realization
allocation
HistoricalPlan
authority layer
stored historical authority
derived publication readiness
```

unless intentionally placed in technical detail.

---

## 77. "Plan" Vocabulary Discipline

Task 9.17 identified “Plan” as overloaded.

Within Day Worksurface, avoid using “Plan” to mean all of:

```text
generated schedule
accepted planning
published schedule
Goal planning
```

Use more specific copy where necessary:

```text
schedule
published schedule
accepted plan
Goal plan
review changes
```

Document any unavoidable ambiguity.

Do not redesign all product vocabulary in this task.

---

## 78. Architecture-Language Leakage Audit

Perform a touched-surface copy audit.

Search the new Day Worksurface for user-visible terms including:

```text
canonical
truth
derived
realization
allocation
HistoricalPlan
ownerDay
incarnation
publication batch
authority
```

Any occurrence must be either:

```text
removed
translated
or intentionally placed behind technical detail
```

Record the audit.

---

## 79. Visual Hierarchy

Primary card hierarchy should emphasize:

```text
subject
time
meaningful status
primary action
```

Secondary detail:

```text
relationship
publication/actual distinction
source navigation
```

Tertiary:

```text
technical provenance
```

Do not make every card visually identical if that destroys distinctions such as:

```text
activity
support
protection
Sleep
```

---

## 80. Styling Constraint

Reuse the existing DayFrame visual system.

Do not introduce a new design framework.

Do not perform unrelated global CSS redesign.

New CSS should be bounded to the Day Worksurface and reusable primitives where appropriate.

Preserve dark/light behavior if existing application theming supports it.

---

## 81. Bundle Discipline

Task 9.19 final baseline:

```text
Initial gzip:        161,577 bytes
Hard gate:           170,000 bytes
Hard headroom:         8,423 bytes
```

The RESULT also notes the initial bundle crossed an existing 161,500-byte advisory.

Task 9.20 must therefore treat lazy boundaries as mandatory architectural discipline.

Prefer lazy loading for:

```text
deep provenance
historical reporting compatibility
heavy item detail
rare correction/retraction controls
```

where architecture permits.

Do not weaken the 170,000-byte hard gate.

Do not raise the advisory.

---

## 82. Bundle Completion Requirement

Final:

```text
initial gzip <= 170,000 bytes
```

is mandatory.

Record:

```text
pre-task initial raw
pre-task initial gzip
post-task initial raw
post-task initial gzip
delta
largest lazy chunk
total JavaScript
hard headroom
advisory status
```

If initial gzip growth is material, explain which imports caused it and whether lazy restructuring was considered.

---

## 83. No New Dependency

Do not add:

```text
routing library
UI framework
drawer/sheet library
date library
state library
virtualization library
```

for this task.

Use existing repository capabilities.

If a new dependency is genuinely required:

```text
STOP CONDITION — ARCHITECTURE DECISION REQUIRED
```

---

## 84. No Persistence Change

Do not modify:

```text
Active schema
Profile schema
Backup schema
HistoricalPlan schema
ExecutionHistory schema
PlanDecision schema
Sleep execution schema
```

Do not persist Day Worksurface state as domain authority.

Session navigation state may remain session-level using the existing Planner navigation approach.

---

## 85. No New Authority

The Day Worksurface SHALL NOT own:

```text
schedule geometry
publication
execution
Progress
accepted planning
Sleep requirement
historical truth
```

It reads evidence and invokes existing commands.

No UI-local record may become authoritative merely because it is displayed.

---

## 86. No Progress Inference

Do not convert:

```text
scheduled Goal duration
completed execution duration
manual-event duration
Sleep duration
```

into Goal Progress.

Progress remains independently measured under its existing semantics.

Task 9.20 may navigate to or display existing Progress only if already canonically available and needed.

Do not implement new Progress aggregation.

---

## 87. No Historical Recovery

Protected historical evidence may be displayed as protected.

Do not add:

```text
Repair
Rebuild
Unlock
Abandon history
Delete history
```

to the Day Worksurface.

Historical recovery remains a separate bounded task.

---

## 88. No Automatic Planning

Opening or interacting with the Day Worksurface MUST NOT automatically:

```text
generate Proposals
accept Proposals
realize allocations
regenerate Preview
resolve Friction
publish
move Sleep
change commitments
```

All constructive/corrective authority remains explicit.

---

## 89. Required Reporting-Parity Audit

For every subject type that currently supports outcome reporting somewhere in the product, document:

| Subject | Existing Reporting Path | G1 Target Available? | 9.20 Worksurface Action | Compatibility Still Needed? |
|---|---|---:|---|---:|

At minimum inspect:

```text
Work
Commitment
Goal work
Support Activity
Protected Buffer
First-Class Sleep
Manual Event
```

Do not invent reporting merely to fill the matrix.

---

## 90. Required Day-Item Presentation Matrix

Create:

| Subject | Primary Label | Time | Primary Status | Outcome Action | Detail | Source Navigation |
|---|---|---|---|---|---|---|

Include every subject actually displayed.

This matrix should make semantic differences reviewable.

---

## 91. Required Authority-Layer Matrix

Create:

| Evidence | Primary UI Treatment | Expandable Detail | User Action | Must Not Be Presented As |
|---|---|---|---|---|

Include:

```text
current planned
published
actual
manual
support
protection
Sleep planning
published Sleep
actual Sleep
protected
unknown
```

---

## 92. Required Compatibility Matrix

Create:

| Existing Surface | Capability | New Worksurface Parity | Still Used? | Retirement Eligible? |
|---|---|---:|---:|---:|

Include:

```text
TodaySurface
SelectedDayWorkspace
HistoricalPlanReportingSection
relevant Month day-detail behavior
relevant execution-reporting UI
Sleep reporting UI
```

Do not mark retirement eligible based only on visual similarity.

---

## 93. Required Mobile Workflow Tests

Validate at minimum these workflows.

### Flow A — Calendar to Day

```text
Planner
→ Calendar
→ choose day
→ Day Worksurface
→ inspect agenda
→ Back
→ same Calendar context
```

### Flow B — Today

```text
Today shortcut
→ current canonical owner day
→ same Day Worksurface
```

### Flow C — Goal Work

```text
Day
→ Goal-work item
→ inspect detail
→ View Goal or bounded provenance
→ Back
```

### Flow D — Outcome Reporting

```text
Day
→ reportable item
→ report outcome
→ command succeeds
→ G1 refresh
→ actual status updates
```

### Flow E — Correction / Retraction

Where supported:

```text
Day
→ existing actual
→ correct or retract
→ canonical command
→ refresh
→ published evidence unchanged
```

### Flow F — Sleep

```text
Day
→ Sleep
→ inspect planned/published/actual distinctions
```

Where reporting is supported:

```text
→ report actual
→ refresh
```

### Flow G — Protected History

```text
Day
→ protected historical evidence
→ readable protection message
→ no false empty state
→ no unsafe action
```

### Flow H — No Preview

```text
Day without Preview
→ manual/history/other independent evidence still usable
→ planning unavailable stated truthfully
```

### Flow I — Async Race

```text
Day A
→ rapidly Day B
→ A resolves late
→ B remains displayed
```

---

## 94. Required Responsive Validation

Perform actual rendered validation at approximately:

```text
320px
390px
768px
1280px
```

For each, record:

```text
document width
scroll width
horizontal overflow status
primary action reachability
agenda readability
detail usability
navigation behavior
```

Do not infer mobile acceptance solely from unit tests.

Use browser/device/emulator capability available in the repository environment.

---

## 95. Mobile Acceptance Gate

Task 9.20 is NOT complete unless all applicable conditions pass.

### Reachability

- [ ] Planner → Calendar → Day works on narrow phone.
- [ ] Today reaches the same Day Worksurface.
- [ ] Back behavior is predictable.
- [ ] source-navigation paths remain reachable.
- [ ] reporting paths remain reachable where supported.

### Layout

- [ ] no unintended document-level horizontal overflow at 320px.
- [ ] no unintended document-level horizontal overflow at 390px.
- [ ] 768px layout remains usable.
- [ ] ≥1024px layout remains usable.
- [ ] long labels do not hide required meaning.
- [ ] dense days remain navigable.

### Touch

- [ ] primary actions are practical touch targets.
- [ ] no required hover.
- [ ] no required double-click.
- [ ] no required right-click.
- [ ] detail disclosure is touch accessible.

### Forms / Actions

- [ ] touched reporting inputs remain usable with mobile keyboard.
- [ ] confirmation remains reachable.
- [ ] cancellation/back remains predictable.
- [ ] command failures do not corrupt displayed authority.

### Progressive Disclosure

- [ ] one item can be inspected without expanding all items.
- [ ] provenance does not dominate the primary agenda.
- [ ] protection/unknown states remain understandable.
- [ ] mobile receives identical semantic truth as desktop.

### Authority

- [ ] no UI-local authority introduced.
- [ ] G1 remains canonical selected-day evidence source.
- [ ] existing commands remain mutation owners.
- [ ] publication remains explicit.
- [ ] Progress remains independent.

Failure of this gate means:

```text
Task 9.20 is INCOMPLETE.
```

---

## 96. Required Accessibility Validation

Validate touched interactions for:

```text
keyboard-only navigation
visible focus
logical tab order
semantic heading hierarchy
accessible button names
detail open/close focus behavior
status text not dependent solely on color
200% zoom/reflow where practical
```

If dialogs/sheets are introduced, validate their focus lifecycle explicitly.

Record what was tested and what was not.

Do not overclaim certification.

---

## 97. Required Async Regression

Add focused automated coverage proving stale G1 responses cannot overwrite a newer selected day.

The test must control response order rather than relying on timing luck.

Required invariant:

```text
latest selected ownerDay wins
```

not:

```text
latest resolved request wins
```

---

## 98. Required Authority Regression

Add tests proving opening/navigating the Day Worksurface does not:

```text
publish
record execution
record Progress
accept Proposal
realize allocation
regenerate schedule
save setup
change Sleep
repair history
```

Outcome actions may invoke only their explicit existing command after user action.

---

## 99. Required Historical Immutability Regression

Where outcome reporting/correction is wired through the new worksurface, prove:

```text
Published Plan snapshot before command
==
Published Plan snapshot after command
```

while actual execution evidence changes through its own authority.

Include Sleep where applicable to the implemented action path.

---

## 100. Required Unknown Regression

Prove product presentation distinguishes:

```text
missing actual
```

from:

```text
explicit nonexecution
```

and:

```text
protected/unavailable
```

from:

```text
empty
```

Do not test only internal types; test presentation semantics.

---

## 101. Required Boundary Regression

Add or retain a product-level test where the current canonical owner day differs from the civil date.

Prove:

```text
Today shortcut
```

opens the canonical DayFrame day.

Also prove Calendar-selected arbitrary day does not mutate `asOf` into the selected date.

---

## 102. Required Dense-Day Regression

Create a representative dense Day Worksurface fixture.

Include, where lawful:

```text
Work
Sleep
Commitment
Goal work
Support
Buffer
Manual Event
published evidence
actual evidence
attention
```

Validate:

```text
stable ordering
no semantic collapse
bounded default disclosure
mobile usability
```

Do not create fake authority merely to populate the fixture; use lawful test records.

---

## 103. Required Empty / Unavailable Regression

Test at least:

```text
readable genuinely empty day
no Preview
stale Preview
protected history
query error
```

Each must have a distinct truthful product state.

---

## 104. Required Compatibility Regression

Existing compatibility tests for:

```text
Today
Month
historical reporting
execution
Sleep execution
Planner navigation
```

must continue to pass unless intentionally updated for the new navigation contract.

Any updated test must preserve or strengthen the semantic guarantee.

Do not delete tests simply because the component moved.

---

## 105. Required Performance Evidence

Record diagnostic local behavior for at least:

```text
ordinary day open
dense day open
day-to-day navigation
outcome action → G1 refresh
```

Where practical record:

```text
G1 query time
render/update time
number of G1 calls
number of G2 calls
```

Do not establish hard performance promises from one environment.

The purpose is to detect accidental N+1 provenance queries or repeated full-history work.

---

## 106. Required Repository Hygiene

Before implementation:

1. record `git rev-parse HEAD`;
2. record `git status --short`;
3. capture a complete task-relative repository baseline;
4. preserve the existing dirty tree;
5. record test baseline;
6. record bundle baseline;
7. preserve dogfood evidence.

During implementation:

- use disposable browser/test state;
- do not clear real dogfood state;
- do not repair historical state;
- do not normalize persisted dogfood data;
- do not commit;
- do not push.

After implementation:

1. inspect `git status --short`;
2. compare against the task baseline;
3. account for every 9.20 file;
4. run `git diff --check`;
5. confirm no unauthorized schema/dependency changes.

---

## 107. Validation Commands

Run repository canonical equivalents of:

```text
npm run format
npx prettier --check .
npm run lint
npm run test
npm run build
npm run check:bundle
git diff --check
```

Run dedicated typecheck if present.

Also run:

```text
focused Day Worksurface tests
navigation tests
Today compatibility tests
Month tests
HistoricalPlan reporting tests
execution tests
Sleep execution tests
mobile/browser validation
```

Record exact commands and results.

---

## 108. Test Counts

Record:

```text
pre-task test-file count
pre-task test count
post-task test-file count
post-task test count
new 9.20 test files
new 9.20 tests
updated existing tests
```

Task 9.19 accepted baseline:

```text
149 files
1,492 tests
```

If actual pre-task baseline differs, report the actual measured baseline and explain.

---

## 109. Required Changed-File Audit

For every changed file, record:

```text
path
reason
semantic effect
whether user-visible
whether authority-affecting
```

Any authority-affecting change not explicitly authorized by this task is a blocker.

---

## 110. Prohibited Changes

Do **not**:

- implement Summary convergence;
- redesign accepted-planning Summary;
- implement HistoricalPlan recovery;
- implement Found Time;
- implement recurring Goal Demand;
- infer Progress;
- redesign Goal Progress;
- redesign Goal Structure;
- redesign Work Pattern;
- redesign Commitment recurrence;
- redesign First-Class Sleep;
- modify Sleep solver semantics;
- modify Sleep publication semantics;
- modify Sleep execution semantics;
- modify legacy Sleep conversion;
- redesign Capacity;
- redesign Allocation;
- redesign Proposal;
- redesign Friction;
- redesign SuggestedFix;
- change publication readiness;
- change publication commit semantics;
- create a second selected-day evidence query;
- reconstruct G1 in React;
- fabricate Today timestamps;
- treat Manual Events as execution;
- treat Protected Buffers as activities;
- treat scheduled work as completed;
- treat missing execution as skipped;
- treat protected history as empty;
- treat pending Proposal as scheduled;
- treat accepted-unrealized allocation as scheduled;
- create new reporting authority;
- create optimistic authority state;
- persist Day Worksurface evidence;
- bump persistence schemas;
- add a dependency;
- add a routing framework;
- raise bundle thresholds;
- clear dogfood evidence;
- commit;
- push.

---

## 111. Stop Conditions

Stop and return Task 9.20 as INCOMPLETE if:

```text
the Day Worksurface requires evidence not available through G1 or another already-canonical bounded query
a required reporting action has no canonical command/target
historical reporting parity requires weakening protection
Today parity requires fabricating an as-of instant
a compatibility surface must be deleted before parity can be established
a new authority rule is required
a persistence/schema change is required
a new dependency is required
mobile usability cannot be achieved without architectural redesign outside scope
the 170,000-byte initial gzip hard gate cannot be preserved
```

For an evidence gap, use:

```text
STOP CONDITION — EVIDENCE CONTRACT GAP
```

For a normative architecture gap, use:

```text
STOP CONDITION — ARCHITECTURE DECISION REQUIRED
```

Document:

```text
condition
repository evidence
affected workflow
why proceeding would violate architecture
available alternatives
recommended next decision
```

Independent unaffected work may continue only where doing so cannot prejudice the missing decision.

---

## 112. Required RESULT Artifact

Create exactly one durable Task 9.20 result artifact:

```text
PHASE_9_TASK_9_20_CANONICAL_DAY_WORKSURFACE_CONVERGENCE_V1_RESULT.md
```

Place it in the existing Phase 9 RESULT location.

The filename MUST contain:

```text
RESULT
```

Do not create competing result summaries.

---

## 113. Required RESULT Structure

The RESULT MUST contain these sections in this exact order:

```text
# Task 9.20 — Canonical Day Worksurface Convergence V1 RESULT

## 1. Executive Summary
## 2. Scope and Governing Constraints
## 3. Pre-Task Repository State
## 4. Task 9.17 / 9.18 / 9.19 Inputs Consumed
## 5. Discovery Findings
## 6. Pre-Implementation Capability Matrix
## 7. Existing Surface Disposition
## 8. Day Worksurface Architecture
## 9. G1 Consumption Contract
## 10. Owner-Day / As-Of Handling
## 11. Current-Day Resolution
## 12. Navigation Integration
## 13. Calendar Integration
## 14. Today Shortcut Integration
## 15. Back / Context Preservation
## 16. Day Header
## 17. Agenda Composition
## 18. Chronological Ordering
## 19. Authority-Layer Presentation
## 20. Published / Unpublished Distinction
## 21. Work Presentation
## 22. Commitment Presentation
## 23. Goal-Work Presentation
## 24. Support Activity Presentation
## 25. Protected Buffer Presentation
## 26. First-Class Sleep Presentation
## 27. Manual Event Presentation
## 28. Actual Outcome Presentation
## 29. Outcome Reporting
## 30. Outcome Correction
## 31. Outcome Retraction
## 32. Sleep Outcome Reporting
## 33. Protected Evidence UX
## 34. Unknown / Unavailable UX
## 35. Attention / Friction Presentation
## 36. Progressive Disclosure
## 37. Item Detail Interaction
## 38. Source Navigation
## 39. Goal Navigation
## 40. Commitment Navigation
## 41. Sleep Navigation
## 42. Work Navigation
## 43. Past-Day Behavior
## 44. Current-Day Behavior
## 45. Future-Day Behavior
## 46. Empty-Day Behavior
## 47. No-Preview Behavior
## 48. Stale-Preview Behavior
## 49. Loading Behavior
## 50. Async Race Safety
## 51. Error Behavior
## 52. Command Refresh Behavior
## 53. No-Optimistic-Authority Audit
## 54. G2 Usage Assessment
## 55. Reporting-Parity Matrix
## 56. Day-Item Presentation Matrix
## 57. Authority-Layer Matrix
## 58. Compatibility Matrix
## 59. Today Compatibility Assessment
## 60. Selected-Day Workspace Compatibility Assessment
## 61. Historical Reporting Compatibility Assessment
## 62. Compatibility Retirement Assessment
## 63. Product Vocabulary Audit
## 64. Architecture-Language Leakage Audit
## 65. Visual Hierarchy
## 66. Styling Changes
## 67. Accessibility Implementation
## 68. Touch Interaction Assessment
## 69. 320px Validation
## 70. 390px Validation
## 71. 768px Validation
## 72. 1280px Validation
## 73. Mobile Keyboard / Form Validation
## 74. Mobile Acceptance Gate
## 75. Dense-Day Assessment
## 76. Large-History Assessment
## 77. Performance Evidence
## 78. G1 Query Count Assessment
## 79. G2 Query Count Assessment
## 80. Boundary Regression
## 81. Owner-Day / As-Of Regression
## 82. Async Race Regression
## 83. Authority Mutation Regression
## 84. Historical Immutability Regression
## 85. Unknown / Nonexecution Regression
## 86. Protected / Empty Regression
## 87. Reporting Regression
## 88. Correction / Retraction Regression
## 89. Sleep Regression
## 90. Manual Event Regression
## 91. Productive / Support / Protection Regression
## 92. Dense-Day Regression
## 93. Empty / No-Preview / Stale Regression
## 94. Compatibility Regression
## 95. Focused Test Inventory
## 96. Full Regression Results
## 97. Build / Static Validation
## 98. Bundle Results
## 99. Persistence Audit
## 100. Schema Audit
## 101. Dependency Audit
## 102. Repository Hygiene
## 103. Changed Files
## 104. Pre-Existing Dirty Files
## 105. Deferred Work
## 106. Newly Discovered Risks
## 107. Day Worksurface Parity Assessment
## 108. Today Retirement Readiness
## 109. Selected-Day Workspace Retirement Readiness
## 110. Historical Reporting Retirement Readiness
## 111. Summary Convergence Readiness
## 112. Task 9.21 Dependency Assessment
## 113. Completion Assessment
```

---

## 114. Required Day Worksurface Parity Assessment

The RESULT MUST answer:

```text
1. Can Calendar open an arbitrary canonical owner day into the new worksurface?
2. Can Today resolve the current canonical owner day into the same worksurface?
3. Does the worksurface consume G1 rather than reconstructing authority?
4. Can Work be understood?
5. Can Commitments be understood?
6. Can Goal work be understood?
7. Can Support be understood without becoming Goal work?
8. Can Protected Buffer be understood without becoming an activity?
9. Can First-Class Sleep be understood across planning/publication/actual layers?
10. Can Manual Events remain authored rather than execution?
11. Can Published Plan remain distinct from current planning?
12. Can actual outcomes remain distinct from publication?
13. Can missing actual remain unknown?
14. Can protected evidence remain protected?
15. Can lawful reporting actions use existing commands?
16. Can correction/retraction preserve publication immutability?
17. Can the surface work without Preview?
18. Can it handle stale Preview?
19. Can it handle query errors?
20. Can it prevent stale async results from replacing the current selected day?
21. Can the complete primary workflow operate on a 320px phone?
```

---

## 115. Today Retirement Readiness

Do NOT automatically retire Today.

Classify:

```text
READY FOR RETIREMENT
READY FOR INTERNAL WRAPPER ONLY
NOT READY
```

Provide evidence.

Today may be retirement-ready only if the new Day Worksurface has parity for the important current-day workflows and the Today shortcut reaches it directly.

If not ready, identify the exact remaining capabilities.

---

## 116. Selected-Day Workspace Retirement Readiness

Classify:

```text
READY FOR RETIREMENT
READY FOR INTERNAL WRAPPER ONLY
NOT READY
```

Do not decide based on duplicate appearance.

Require semantic/action parity.

---

## 117. Historical Reporting Retirement Readiness

Classify:

```text
READY FOR RETIREMENT
READY FOR INTERNAL WRAPPER ONLY
NOT READY
```

Protected-history behavior and reporting/correction/retraction parity are mandatory before retirement eligibility.

Do not implement recovery merely to achieve retirement.

---

## 118. Summary Convergence Readiness

Task 9.20 does not implement Summary convergence.

The RESULT must answer whether the Day Worksurface uncovered any new semantic gap affecting later G2/Summary work.

Specifically:

```text
1. Did day presentation require G2?
2. If yes, for what bounded detail?
3. Did any new accepted-lineage gap appear?
4. Did any new Progress ambiguity appear?
5. Is G2 still sufficient for a later accepted-planning Summary slice?
6. Does Summary convergence remain independently implementable after 9.20?
```

---

## 119. Task 9.21 Dependency Assessment

Determine the smallest next bounded task from repository evidence.

Expected candidates may include:

```text
My Schedule convergence
Goals convergence
Protected History Access
compatibility retirement
accepted-planning Summary slice
Review Plan convergence
```

Do not assume the next task from the old ordering.

Answer:

```text
1. Is Day Worksurface convergence complete?
2. Which compatibility surfaces remain?
3. Is any compatibility retirement now safe?
4. Is Protected History Access required before the next product slice?
5. Is My Schedule ready for convergence?
6. Are Goals ready for convergence?
7. Is Review Plan ready for convergence?
8. Is Summary ready for a bounded G2 consumer slice?
9. What is the smallest next task with the highest convergence value?
10. What Mobile Acceptance Gate must it inherit?
11. What bundle headroom remains?
```

Do not implement Task 9.21.

---

## 120. Completion Criteria

Task 9.20 is COMPLETE only if all applicable requirements pass.

### Architecture

- [ ] one reusable Day Worksurface exists;
- [ ] G1 is its canonical selected-day evidence source;
- [ ] no second selected-day semantic owner exists;
- [ ] ownerDay and asOf remain distinct;
- [ ] current canonical day uses DayFrame boundary semantics;
- [ ] no fake Today instant exists;
- [ ] no new persistence;
- [ ] no new authority;
- [ ] no Progress inference.

### Navigation

- [ ] Calendar-selected day opens the worksurface;
- [ ] Today opens the same worksurface;
- [ ] Back behavior is deterministic;
- [ ] Calendar context is preserved where required;
- [ ] browsing a day does not mutate planning authority.

### Presentation

- [ ] agenda-first mobile presentation;
- [ ] Work represented lawfully;
- [ ] Commitments represented lawfully;
- [ ] Goal work represented lawfully;
- [ ] Support remains distinct;
- [ ] Protected Buffer remains non-activity;
- [ ] First-Class Sleep remains distinct;
- [ ] Manual Events remain authored;
- [ ] planned/published/actual remain distinguishable;
- [ ] unknown remains distinguishable from explicit nonexecution;
- [ ] protected remains distinguishable from empty.

### Actions

- [ ] reporting uses existing canonical targets/commands only;
- [ ] correction uses existing authority only;
- [ ] retraction uses existing authority only;
- [ ] Sleep reporting uses Sleep commands;
- [ ] command success triggers G1 refresh;
- [ ] command failure does not corrupt local truth;
- [ ] no optimistic authority.

### Compatibility

- [ ] Today parity assessed;
- [ ] SelectedDayWorkspace parity assessed;
- [ ] Historical reporting parity assessed;
- [ ] no premature deletion;
- [ ] retirement classifications evidence-based.

### Async

- [ ] loading is distinct from empty;
- [ ] errors are distinct from empty;
- [ ] stale query responses cannot replace current selection.

### Mobile Acceptance Gate

- [ ] 320px passes;
- [ ] 390px passes;
- [ ] 768px passes;
- [ ] 1280px passes;
- [ ] no unintended horizontal page overflow;
- [ ] primary touch actions practical;
- [ ] no hover requirement;
- [ ] no double-click requirement;
- [ ] no right-click requirement;
- [ ] progressive disclosure works;
- [ ] one item can be inspected independently;
- [ ] reporting forms remain usable on phone;
- [ ] Back behavior works on phone;
- [ ] mobile and desktop consume identical authority.

### Accessibility

- [ ] keyboard navigation works;
- [ ] visible focus retained;
- [ ] semantic headings/controls used;
- [ ] status not color-only;
- [ ] detail focus behavior validated;
- [ ] zoom/reflow checked where practical.

### Performance / Bundle

- [ ] no obvious G1 N+1;
- [ ] no eager G2-per-item pattern;
- [ ] dense day remains usable;
- [ ] long history remains bounded;
- [ ] initial gzip ≤170,000 bytes;
- [ ] bundle advisory reported honestly;
- [ ] no new dependency.

### Validation

- [ ] focused tests pass;
- [ ] full tests pass;
- [ ] format passes;
- [ ] Prettier passes;
- [ ] lint passes;
- [ ] build passes;
- [ ] bundle passes;
- [ ] `git diff --check` passes;
- [ ] repository hygiene complete;
- [ ] changed files accounted for;
- [ ] no commit;
- [ ] no push;
- [ ] required RESULT exists.

---

## 121. Final Completion Statement

If and only if every required completion criterion is satisfied, end the RESULT with exactly:

```text
Task 9.20 — Canonical Day Worksurface Convergence V1 is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.20 — Canonical Day Worksurface Convergence V1 is INCOMPLETE.
```

Then identify the exact blockers.

---

## 122. Governing Convergence Principle

Task 9.17 established the intended product.

Task 9.18 established where the user goes.

Task 9.19 established how product surfaces ask what is true.

Task 9.20 establishes how one DayFrame day becomes usable.

The intended architecture is:

```text
Calendar ───────────────┐
                       │
Today shortcut ────────┤
                       ▼
              SELECTED OWNER DAY
                       │
                  real asOf
                       │
                       ▼
                      G1
                       │
                       ▼
             CANONICAL DAY WORKSURFACE
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
     Agenda          Detail          Attention
       │               │                │
       │               │                └─ Friction / protection /
       │               │                   unavailable evidence
       │               │
       │               └─ publication / actual /
       │                  provenance / source
       │
       └─ Work
          Sleep
          Commitments
          Goal work
          Support
          Protection
          Manual Events

                       │
             explicit user action
                       │
                       ▼
             EXISTING COMMAND OWNERS
                       │
                       ▼
                 refresh G1
```

The final governing rules are:

> **The Day Worksurface is a view of authority, not an authority of its own.**

> **Today is a shortcut to the current canonical DayFrame day, not a second definition of the day.**

> **Calendar navigation chooses what day to inspect; it does not change what DayFrame believes.**

> **Planned is not published. Published is not actual. Actual is not Progress.**

> **Support is not productive work. Protection is not an activity.**

> **Missing actual evidence means unknown, not failure.**

> **Protected evidence means unavailable authority, not an empty day.**

> **A user action changes authority only through the existing canonical command that owns that change.**

> **After a command succeeds, the UI asks DayFrame what is true again.**

> **Compatibility surfaces remain until semantic, action, mobile and accessibility parity are demonstrated.**

> **If the complete DayFrame day workflow is awkward or unreachable on a phone, Task 9.20 is not complete.**