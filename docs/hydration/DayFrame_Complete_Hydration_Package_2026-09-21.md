# DayFrame Complete Hydration Package

**Hydration date:** 2026-09-21\
**Project:** DayFrame\
**Tagline:** **Built for life that doesn't run 9 to 5.**\
**Accepted implementation frontier:** **Task 9.20 --- Canonical Day
Worksurface Convergence V1 --- COMPLETE**\
**Projected next bounded task:** **Task 9.21 --- Accepted-Planning
Summary Convergence V1**

> **Purpose:** Rehydrate a fresh ChatGPT/Codex session with enough
> product, architecture, implementation, governance, dogfood, and
> roadmap context to continue DayFrame without depending on prior
> conversation history.

------------------------------------------------------------------------

## 1. Authority and Rehydration Rules

Use evidence in this order:

1.  **Current repository code and tests** --- executable truth.
2.  **Accepted architecture and ADRs** --- normative semantic rules.
3.  **Task RESULT artifacts** --- evidence of what bounded work actually
    established.
4.  **This hydration package** --- synthesis and navigation aid.
5.  **Conversation history** --- supporting context only.

If this document conflicts with current repository evidence, stop and
investigate. Do not silently rewrite repository semantics from this
summary.

A new session should never assume a projected task is still correct
without first inspecting the current repository and latest RESULT
artifacts.

------------------------------------------------------------------------

# 2. Product Identity

**Name:** DayFrame\
**Domain:** thedayframe.com\
**Tagline:** **Built for life that doesn't run 9 to 5.**

DayFrame is a mobile-first deterministic planning system for people
whose lives do not fit standard midnight-to-midnight, Monday-to-Friday
assumptions.

Its founding problem was rotating shift work: cross-midnight shifts,
changing sleep, compressed transition periods, maintenance obligations,
and personal goals all compete for limited time.

DayFrame is not primarily a calendar, task manager, or AI assistant.

A durable description is:

> **DayFrame learns the recurring structure of the user's life,
> determines what time is actually available, helps the user
> intentionally allocate that time, prepares a schedule before
> execution, records what really happened, and preserves enough history
> to support better future decisions.**

An early formulation remains useful:

> **DayFrame is a system that prepares your life for change before it
> happens.**

------------------------------------------------------------------------

# 3. Product Philosophy

DayFrame should remain:

-   deterministic;
-   explainable;
-   mobile-first;
-   shift-aware;
-   cycle-aware;
-   user-authorized;
-   history-preserving;
-   explicit about uncertainty;
-   safe against stale derived state acquiring authority.

The user supplies goals, priorities, commitments, work structure, sleep
requirements, and decisions.

DayFrame may derive, calculate, compare, propose, and explain.

It must not silently convert a derived suggestion into authoritative
user intent.

> **An LLM has no scheduling authority.**

------------------------------------------------------------------------

# 4. Lifecycle Mental Model

The long-term lifecycle remains:

``` text
Teach → Plan → Live → Learn
```

## Teach

The user defines recurring life structure:

-   Work Pattern
-   Sleep requirement
-   Commitments
-   Goals
-   Goal Structure
-   preferences
-   planning intent

## Plan

DayFrame evaluates:

-   occupied/protected time;
-   Capacity;
-   Goal Demand;
-   Feasibility;
-   competition;
-   Allocation;
-   constructive Proposals;
-   Friction;
-   publication readiness.

The user explicitly authorizes important changes.

## Live

The user operates from the actual day:

-   sees schedule evidence;
-   records outcomes;
-   captures manual activity;
-   responds to Friction;
-   eventually captures Found Time/live opportunities.

## Learn

DayFrame summarizes:

-   Capacity;
-   accepted planning;
-   Goal investment;
-   execution;
-   Progress;
-   history;
-   deterministic recommendations where evidence supports them.

------------------------------------------------------------------------

# 5. Current Product Information Architecture

Target primary navigation after Tasks 9.17--9.20:

``` text
DayFrame
├── Planner
│   ├── Calendar
│   ├── My Schedule
│   │   ├── Work Pattern
│   │   ├── Sleep
│   │   └── Commitments
│   ├── Goals
│   └── Review Plan
└── Summary
```

Profiles, backup, restore, and recovery are supporting utilities, not a
third primary destination.

## Planner

### Calendar

-   continuous browsing independent of Preview;
-   one bounded month;
-   sparse overview rather than mini-schedule;
-   selecting a day opens the canonical Day Worksurface.

### Day Worksurface

Implemented in Task 9.20.

Both:

``` text
Calendar → selected day
```

and:

``` text
Today shortcut → current canonical owner day
```

lead to the same G1-backed worksurface.

### My Schedule

Target home for: - Work Pattern; - First-Class Sleep; - Commitments.

Work Pattern and Commitments have existing product paths. A complete
general First-Class Sleep authoring surface remains incomplete.

### Goals

Direct Planner destination.

Target conceptual organization:

``` text
Outcome
Planning Intent
Structure
Scheduled Work
Recorded Progress
```

### Review Plan

Owns explicit review of: - constructive Proposal decisions; - corrective
Friction/SuggestedFix; - realization; - publication readiness; -
explicit publication.

## Summary

Target reflection/overview surface:

``` text
Capacity
Goals
Accepted Planning / Allocations
Progress
History
Attention / Recommendations
```

Summary convergence remains incomplete. G2 is now ready to support
accepted-planning product work.

------------------------------------------------------------------------

# 6. Canonical Authority Chain

The core chain is:

``` text
Authored
  ↓
Derived
  ↓
Proposed
  ↓
Accepted
  ↓
Scheduled / Realized
  ↓
Published
  ↓
Execution / Actual
  ↓
Progress
  ↓
History
  ↓
Learned
  ↓
Explicit Preference
```

These layers must not be collapsed.

## Authored

Explicit user intent/configuration: Work, Commitments, SleepRequirement,
Goal, Goal Structure, Goal Demand, Goal Priority, Manual Event.

## Derived

Disposable computation: Preview, Capacity, Feasibility, Demand
Projection, planning review projections, G1/G2 product projections.

## Proposed

Constructive suggestion. Owns no time.

## Accepted

Explicit bounded user authorization. Accepted Allocation is not yet
schedule ownership.

## Realized / Scheduled

Stable scheduled facts created from accepted planning.

## Published

Immutable bounded plan evidence.

## Execution / Actual

What the user reports actually happened. Does not rewrite publication.

## Progress

Independent measured Goal progress.

## History

Retained evidence.

## Learned

Derived tendency; lower authority than explicit preference.

## Explicit Preference

User-confirmed durable preference.

------------------------------------------------------------------------

# 7. Core Invariants

Preserve unless a later accepted architecture task explicitly changes
them:

1.  Authored and accepted state may persist.
2.  Derived state is disposable.
3.  Published history is immutable.
4.  Execution does not rewrite publication.
5.  Progress is independent of schedule geometry.
6.  Stale derived state cannot acquire authority.
7.  Accepted choice is situational authority, not universal preference.
8.  Learned behavior is lower authority than explicit preference.
9.  One semantic concept should have one canonical owner.
10. Unknown must not silently become empty, zero, skipped, or failure.
11. Protected evidence must not be treated as absent evidence.
12. Navigation state owns no domain authority.
13. Calendar navigation does not define planning horizons.
14. Preview is not publication.
15. Proposal is not schedule.
16. Accepted Allocation is not schedule until realization.
17. Execution is not Progress.
18. Manual Event is not execution.
19. Protected Buffer is not an activity.
20. Support Activity is not productive Goal work.

------------------------------------------------------------------------

# 8. Time Ownership

Time can be owned/protected by real schedule authority such as:

-   Work;
-   Commitments;
-   First-Class Sleep;
-   fixed Manual Events;
-   realized Goal productive work;
-   realized Support Activities;
-   realized/fixed Protected Buffers;
-   other canonical hard liabilities.

These do **not** own time merely by existing:

-   Capacity;
-   Goal Demand;
-   Demand Projection;
-   provisional Allocation;
-   Proposal;
-   unrealized Accepted Allocation;
-   Preview-only evidence.

This distinction is central to Capacity correctness.

------------------------------------------------------------------------

# 9. Canonical User Day

DayFrame does not equate the civil date with the user's day.

Example:

``` text
Civil date: Tuesday
Clock: 03:00
Effective DayFrame boundary: 06:00
```

The current DayFrame owner day may still be Monday.

This affects Today, Calendar, Work, Sleep, recurrence, publication,
execution, and history.

Never implement Today with a civil-date slice. Use canonical user-day
resolution.

------------------------------------------------------------------------

# 10. Horizon Vocabulary

Keep distinct:

-   **Planning Data Horizon** --- data needed to evaluate planning.
-   **Proposal Horizon** --- interval in which constructive planning may
    propose work.
-   **Review Scope** --- day/week/month/custom interval the user is
    reviewing.
-   **Preview** --- disposable generated visualization.
-   **Publication Range** --- bounded interval explicitly frozen into
    history.
-   **Calendar Navigation** --- dates/month being browsed.

Browsing a month must not silently change planning authority or
horizons.

------------------------------------------------------------------------

# 11. Work and Cycle Model

DayFrame supports:

-   repeating Work patterns;
-   dated cycles/segments;
-   cross-midnight shifts;
-   configurable day boundaries;
-   effective/custom week starts;
-   cycle/segment preferences and overrides.

Dogfood exposed two visible generations of Work setup. The target
product should present these as modes of one concept:

``` text
Work Pattern
├── Repeating rotation
└── Dated periods
```

Day Boundary and week orientation belong near Work Pattern. Cycle
transitions should be understandable in Calendar without changing normal
calendar-month geometry.

------------------------------------------------------------------------

# 12. Commitment Model

Commitments are authored obligations with durable recurrence identity.

Important product/architecture rules:

-   recurrence and placement are separate;
-   Work-relative placement is supported;
-   duration should be entered/displayed in human hours/minutes;
-   advanced controls should be per-item;
-   support/buffer relationships must remain distinct;
-   focused editing is preferable to giant global forms.

Legacy Sleep Commitments may remain transitional data, but First-Class
Sleep is a separate authority.

------------------------------------------------------------------------

# 13. First-Class Sleep

Tasks 9.10--9.16 established the required First-Class Sleep foundation.

Canonical decision:

> **Sleep is a dedicated authored `SleepRequirementV1`, not an ordinary
> Commitment.**

Sleep is:

-   temporally flexible but required when applicable;
-   exact-duration plus required buffers when feasible;
-   not governed by ordinary numeric priority;
-   solved before discretionary Capacity and ordinary movable Commitment
    placement;
-   one continuous occurrence per applicable owner day in V1;
-   allowed to cross civil/canonical boundaries while retaining owner
    identity.

V1 does not allow arbitrary omission, shortening, splitting, or
protection waiver.

Explicit actual nonexecution is valid evidence but does not
retrospectively rewrite the Sleep requirement.

Canonical resolution states include:

``` text
notConfigured
notApplicable
satisfied
infeasible
searchIncomplete
invalid
protected
contextIncomplete
```

Unsafe/unknown foundational Sleep states fail closed for planning.

## Accepted Sleep Placement

The user may choose where required Sleep occurs inside an already-lawful
domain.

The user may not use placement authority to decide whether Sleep exists
or how much is required.

## Publication and Execution

Published Sleep freezes immutable plan evidence.

Actual Sleep remains separate and may include:

-   reported published Sleep;
-   correction;
-   retraction;
-   explicit nonexecution;
-   unplanned Sleep.

Missing actual Sleep remains unknown.

## Legacy Conversion

Task 9.16 established explicit prospective conversion:

``` text
Legacy Sleep Commitment
→ explicit review
→ explicit missing semantics
→ explicit confirmation
→ prospective cutover
→ First-Class SleepRequirement
+ retirement of selected future legacy recurrence
+ durable conversion lineage
```

Governing rule:

> **Convert the future explicitly. Preserve the past exactly.**

No heuristic auto-conversion.

------------------------------------------------------------------------

# 14. Goal Architecture

A Goal outcome exists independently of scheduling.

Keep distinct:

``` text
Goal
Goal Structure
Goal Demand
Goal Priority
Demand Projection
Feasibility
Competition
Allocation
Proposal
Accepted Allocation
Realization
Scheduled Goal Work
Execution
Progress
```

## Goal Structure

Revisioned authority exists. Complete ordinary product authoring remains
future convergence work.

## Goal Demand

Planning intent. Owns no time.

## Goal Priority

Authored ranking preference.

## Demand Projection

Derived/disposable interpretation.

A Goal may exist without a current Demand or target date.
Undated/persistent Goals remain valid.

Recurring Goal Demand remains unresolved future work.

------------------------------------------------------------------------

# 15. Capacity, Feasibility, Competition, Allocation

## Capacity

Capacity is deterministic and demand-neutral:

> **What time remains after actual ownership/protection/liability is
> accounted for?**

Capacity does not shrink merely because Goals want time.

If foundational planning is unsafe or unknown, Capacity becomes
unavailable/non-allocatable rather than ordinary zero.

## Feasibility

Evaluates whether a Goal Demand can fit available Capacity under its
constraints/footprint.

## Competition

Multiple Demands competing for Capacity.

Competition is **not Friction**.

## Allocation

Provisional assignment of Capacity among competing Goal Demands.
Allocation owns no time.

Historically intended allocation strategies include:

-   Sequential;
-   Distributed;
-   Daily Distribution;
-   Manual.

Do not assume every strategy is fully product-converged.

------------------------------------------------------------------------

# 16. Constructive Proposal vs Corrective Friction

This distinction is foundational.

## Proposal

Constructive:

> Here is a lawful way DayFrame could allocate/schedule Goal work.

Owns no time. User accepts or rejects.

## Friction

Corrective:

> Existing schedule facts are incompatible and need review.

Friction is not competition.

## SuggestedFix

Corrective response to Friction.

SuggestedFix is not a constructive Proposal.

Never merge Proposal and SuggestedFix merely for UI convenience.

------------------------------------------------------------------------

# 17. Accepted Allocation and Realization

Constructive chain:

``` text
Goal
→ Demand
→ Projection
→ Feasibility
→ Competition
→ Allocation
→ Proposal
→ explicit Decision
→ Accepted Allocation
→ Realization
→ scheduled facts
```

Accepted Allocation is not schedule ownership.

Realization must be:

-   atomic;
-   idempotent;
-   provenance-preserving;
-   bounded by current authority;
-   safe against stale acceptance.

Realized roles remain distinct:

-   productive Goal work;
-   Support Activity;
-   Protected Buffer.

------------------------------------------------------------------------

# 18. Publication

Publication is explicit.

Ordinary path:

``` text
Goal/Demand
→ Proposal
→ acceptance
→ Realization
→ Planner
→ Review Schedule
→ explicit immutable publication
```

Preview never implicitly publishes.

Publication freezes bounded plan evidence. Changed planning truth
creates a new immutable publication rather than rewriting the old one.

------------------------------------------------------------------------

# 19. Execution and Progress

Execution records what actually happened.

Rules:

-   missing execution = unknown;
-   scheduled ≠ completed;
-   published ≠ actual;
-   explicit nonexecution is valid evidence;
-   correction changes effective actual evidence, not publication;
-   retraction returns current actual to unknown;
-   unplanned actual activity may exist.

After a command succeeds:

``` text
command succeeds
→ query canonical evidence again
→ render resulting truth
```

No optimistic UI status becomes authority.

## Progress

Progress is independent measured Goal progress.

Do not automatically infer Progress from scheduled duration, realized
duration, completed execution duration, Manual Event duration, or Sleep
duration.

------------------------------------------------------------------------

# 20. Found Time / Live Concepts

Found Time is not yet a complete end-to-end production workflow.

Keep distinct:

-   Found Time;
-   Released Interval;
-   Live Capacity;
-   Live Opportunity.

A Goal-associated Manual Event is not automatically Found Time.

No automatic Goal Progress credit without explicit architecture.

------------------------------------------------------------------------

# 21. G1 --- Selected-Day Evidence

Task 9.19 created:

``` text
querySelectedDayEvidence({
  ownerDay,
  asOf
})
```

G1 is the canonical product read model for one selected DayFrame day.

It preserves:

-   arbitrary owner-day selection;
-   independent real evaluation instant;
-   current authored context;
-   Preview evidence;
-   realized productive/support/protection facts;
-   Manual Events;
-   current Sleep resolution;
-   retained publication;
-   published Sleep;
-   actual execution;
-   unplanned Sleep;
-   protected evidence;
-   canonical action targets.

Evidence qualification distinguishes states such as available,
protected, unavailable, incomplete, and not-applicable.

React must not reconstruct a second day model by independently joining
Preview, HistoricalPlan, execution, Sleep, Manual Events, and
realization.

------------------------------------------------------------------------

# 22. G2 --- Accepted-Planning Evidence

Task 9.19 also created:

``` text
queryAcceptedPlanningEvidence({
  startUserDayDate,
  endUserDayDateExclusive,
  asOf,
  select?
})
```

Selectors include Goal, Accepted Allocation, and scheduled fact.

G2 preserves exact lineage:

``` text
Goal
→ Demand
→ Proposal
→ Accepted Allocation
→ Realization
→ scheduled fact
→ publication
→ execution
```

Progress is explicitly `notInferred`.

Proposal lifecycle does not revoke accepted authority.

Realization state comes from the Realization owner.

Protected/unavailable realization remains unknown rather than being
mislabeled accepted-but-unrealized.

------------------------------------------------------------------------

# 23. Network+ Provenance Regression

Critical case:

``` text
Accepted iteration A: 10 hours
Accepted iteration B: 20 hours
```

Both may belong to the same Network+ Goal.

They must remain distinct accepted iterations.

Never transform them into one synthetic 30-hour acceptance merely
because the Goal is shared.

A UI may show a total for orientation, but the user must be able to
inspect the distinct accepted iterations and their
realization/publication/execution lineage.

Task 9.19 established regression coverage for this case.

------------------------------------------------------------------------

# 24. Task 9.20 --- Canonical Day Worksurface

Task 9.20 is accepted complete.

Entry paths:

``` text
Planner → Calendar → selected day → Day Worksurface
```

and:

``` text
Today shortcut
→ current canonical owner day
→ same Day Worksurface
```

The worksurface is agenda-first and mobile-first.

It preserves:

-   published schedule;
-   current/unpublished scheduling context;
-   authored Manual Events;
-   actual outcomes;
-   current Sleep;
-   published Sleep;
-   actual Sleep;
-   productive Goal work;
-   support;
-   protected time;
-   protected/unavailable evidence.

Important presentation rules:

-   deterministic chronological ordering;
-   Support visually subordinate;
-   Protected Buffer explicitly not an activity;
-   Manual Event explicitly authored, not completed;
-   missing actual = Outcome not recorded;
-   protected evidence never creates a false empty day;
-   pending Proposal is not scheduled;
-   accepted-but-unrealized planning is not scheduled;
-   future days suppress outcome entry;
-   past days do not reconstruct current setup as frozen historical
    truth.

Async safety rule:

> **Latest selected owner day wins, not latest resolved request.**

------------------------------------------------------------------------

# 25. Compatibility After 9.20

Convergence does not yet authorize deletion.

## TodaySurface

**NOT READY for final deletion.**

Ordinary Today routing is converged, but compatibility behavior/tests
remain.

## SelectedDayWorkspace

**NOT READY.**

Still owns useful contextual editing/settings paths through Calendar
editing tools.

## HistoricalPlanReportingSection

**NOT READY.**

G1 supports ordinary arbitrary-day reporting, but
rare/legacy/accessibility/protection parity has not received a dedicated
retirement audit.

Governing rule:

> **Converge first. Retire later.**

Retirement requires semantic, action, protection, mobile, accessibility,
and test parity.

------------------------------------------------------------------------

# 26. Historical Protection and Recovery

Protected HistoricalPlan evidence must fail closed.

Important distinctions:

-   Recheck does not repair authority.
-   Export does not repair authority.
-   Abandon is destructive deletion, not recovery.
-   Protected evidence is not empty evidence.

Task 9.20 can display protected history without implementing recovery.

A dedicated Protected History Access slice remains future work.

Do not expose destructive abandonment merely to make recovery appear
reachable.

------------------------------------------------------------------------

# 27. Dogfood Pass 02

Dogfood Pass 02 is complete as:

> **complete-with-blocked-downstream-coverage**

Preserve the persisted dataset as forensic evidence.

Observed terminal readiness included:

``` text
planning data complete
preview coverage covers
preview freshness current
schedule conflicts 0
accepted awaiting realization 0
proposals 0
Ready to publish
```

But protected HistoricalPlan behavior blocked parts of
publication/history/Today/Summary.

Do not mutate, clear, migrate, repair, or normalize the preserved
dogfood state merely to continue testing.

Use a copy if investigation requires application execution.

------------------------------------------------------------------------

# 28. Major Dogfood Findings Still Relevant

## Work Pattern

-   long rotations are impractical day-by-day;
-   repeating and dated Work setup need one product concept;
-   Day Boundary belongs near Work Pattern;
-   week start may vary by cycle;
-   cycle transitions should be visible.

## Commitments

-   Sleep is no longer ordinary Commitment architecture;
-   human hours/minutes needed;
-   recurrence UX needs convergence;
-   contextual editing remains useful;
-   support/buffer relationships need clear treatment.

## Goals

-   Goal creation was historically buried;
-   Goal Structure authoring remains incomplete;
-   effort should be human-readable;
-   ongoing/undated Goals must remain valid;
-   recurring Goal Demand remains unresolved;
-   scheduled Goal work needs visible Goal/provenance;
-   accepted planning can become a long list.

## Capacity / Proposal

-   constructive planning is reachable;
-   product representation remains thin;
-   accepted provenance must remain inspectable.

## Friction

-   old corrective UX can become a tower of dates;
-   repeated Friction needs grouped review;
-   no silent bulk acceptance/replanning.

## Found Time

-   Manual Event association is insufficient;
-   actual capture and Progress attribution remain unresolved.

## Summary

-   accepted planning/history need bounded grouping;
-   empty attention surfaces create noise;
-   summaries must not destroy accepted-iteration provenance.

## Calendar

-   should work without generation;
-   should remain a calendar rather than mini schedule renderer;
-   calendar horizon ≠ computation horizon.

## Architecture-language leakage

Avoid ordinary product labels such as canonical, truth, realization,
allocation, HistoricalPlan, ownerDay, stored historical authority, and
derived publication readiness.

------------------------------------------------------------------------

# 29. Important Correctness Repairs Already Completed

Task 9.9 repaired substrate defects before convergence:

-   corrective gap search respects physical occupancy;
-   unplaced occurrence identity survives Try/Accept;
-   Preview revision preserves realized facts;
-   realized productive/support/protection occupancy is respected;
-   custom Sleep windows can cross owner boundaries;
-   publication readiness aligns with publication preconditions;
-   publication failure distinguishes pre-commit failure,
    complete-but-unverified commit, and uncertain commit;
-   unsafe "history unchanged" messaging was removed;
-   effective-boundary replay mismatch was repaired.

These are foundation behavior, not UI workarounds.

------------------------------------------------------------------------

# 30. Completed Phase 8

Phase 8 established:

``` text
revision / provenance / freshness
→ Goal Structure
→ Goal Demand / Priority / Projection
→ Commitment Composition
→ Capacity
→ Goal-specific Feasibility
```

Core principle:

> **Commitments and other real obligations own time. Goals compete for
> the Capacity that remains.**

------------------------------------------------------------------------

# 31. Completed Phase 9 Chain Through 9.20

``` text
9.1    Competing Demand / Allocation
9.2    Proposal → Decision → Accepted Allocation
9.2.0  Goal-Demand Resource Footprint specification
9.2.1  Footprint propagation
9.2.2  Realized schedule identity
9.3    Accepted Allocation Realization V1
9.4    Horizon separation / Planning Review
9.5    Planner/Month planning exposure
9.6    Review Schedule Evolution V1
9.7    Explicit publication path
9.8+   Dogfood / audits / follow-ups
9.9    Pre-Migration Correctness & Authority Convergence V1
9.10   First-Class Sleep Architecture Specification
9.11   Sleep Domain & Persistence Foundation
9.12   Sleep Derivation & Feasibility Foundation
9.13   Sleep Capacity & Planning Integration
9.14   Sleep Friction & Corrective Authority
9.15   Sleep Publication, Execution & Historical Authority
9.16   Sleep Legacy Conversion & Product Transition
9.17   Planner / Summary Product Convergence & Mobile UX Specification
9.18   Planner / Summary Navigation Foundation
9.19   Canonical Product Evidence Projection V1
9.20   Canonical Day Worksurface Convergence V1
```

Tasks 9.10--9.16 close the required First-Class Sleep foundation.

Tasks 9.17--9.20 establish the current product-convergence foundation.

------------------------------------------------------------------------

# 32. Current Validation Baseline

Task 9.20 measured:

``` text
Task-start HEAD:
c0cc9ae2ae68af626e64747539a417f10df1cf3a

Pre-task:
149 test files
1,493 tests

Post-task:
150 test files
1,508 tests
```

Final bundle:

``` text
Initial raw JS:       617,972 bytes
Initial gzip:         161,795 bytes
Hard gzip limit:      170,000 bytes
Remaining headroom:     8,205 bytes
Largest lazy chunk:    59,671 bytes
Total JS:           1,156,914 bytes
```

Existing advisories remain triggered around 161,500 initial gzip and
825,000 total JS.

The 170,000-byte hard initial-gzip gate must not be raised merely to
accommodate convergence work.

Always measure the actual current baseline before a new task.

------------------------------------------------------------------------

# 33. Standing Mobile Acceptance Gate

Any implementation/migration task affecting visible UX must pass a
dedicated Mobile Acceptance Gate.

Validate approximately:

``` text
320px
390px
768px
1280px or representative ≥1024px desktop
```

At minimum:

-   complete primary workflow reachable;
-   no unintended document-level horizontal overflow;
-   practical touch targets, roughly 44 CSS px for primary actions where
    feasible;
-   no required hover;
-   no required double-click;
-   no required right-click;
-   usable forms/mobile keyboard path;
-   predictable Back/navigation;
-   progressive disclosure;
-   identical underlying semantic truth on mobile and desktop;
-   unchanged authority semantics;
-   bundle hard gate preserved.

Also validate touched accessibility:

-   keyboard navigation;
-   visible focus;
-   logical tab order;
-   semantic controls/headings;
-   meaningful accessible names;
-   non-color-only status;
-   focus restoration;
-   zoom/reflow where practical.

Do not claim physical-device or screen-reader certification unless
actually tested.

Failure of the Mobile Acceptance Gate means the task is incomplete.

------------------------------------------------------------------------

# 34. Bundle Governance

Every visible convergence task should record:

``` text
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

Rules:

-   initial gzip ≤170,000 bytes;
-   do not raise thresholds;
-   lazy-load rare/heavy detail;
-   do not add dependencies casually;
-   if a new dependency is genuinely required, stop for architecture
    review.

------------------------------------------------------------------------

# 35. Persistence and Compatibility Governance

Durable data uses surface-specific versioning and non-destructive
compatibility.

General hierarchy:

-   active state: bounded migration;
-   profiles: stronger portability/protection;
-   backups: strongest long-lived compatibility;
-   immutable histories: preserve evidence and fail closed when unsafe.

Unsupported data must not silently degrade.

Do not introduce schema/version changes as a side effect of a UI task.

------------------------------------------------------------------------

# 36. DayFrame Canonical Task Methodology

Implementation work is performed through bounded Canonical Task Blocks.

A task should define:

-   objective;
-   prerequisites;
-   governing principles;
-   discovery requirements;
-   scope;
-   evidence/work requirements;
-   prohibited changes;
-   stop conditions;
-   validation;
-   Mobile Acceptance Gate when user-facing;
-   bundle gate;
-   repository hygiene;
-   completion criteria;
-   required RESULT artifact.

## Formatting Rule

When generating a DayFrame task for Sidney:

> **Return one single contiguous fenced Markdown block containing the
> entire task.**

Do not scatter task content outside the block.

If a correction is needed, prefer reissuing the whole corrected block
unless a delta is explicitly requested.

## RESULT Naming Rule

Every Codex-created durable result artifact filename must include:

``` text
RESULT
```

Example:

``` text
PHASE_9_TASK_9_20_CANONICAL_DAY_WORKSURFACE_CONVERGENCE_V1_RESULT.md
```

------------------------------------------------------------------------

# 37. Repository Hygiene

Before implementation:

1.  record `git rev-parse HEAD`;
2.  record `git status --short`;
3.  capture a task-relative baseline;
4.  preserve pre-existing dirty work;
5.  record test baseline;
6.  record bundle baseline when relevant.

During implementation:

-   do not reset/stash unrelated work;
-   do not mutate preserved dogfood evidence;
-   use disposable browser/test state;
-   do not commit;
-   do not push unless explicitly requested.

After implementation:

-   account for every changed file;
-   distinguish task changes from pre-existing dirty files;
-   run `git diff --check`;
-   report persistence/schema/dependency effects.

------------------------------------------------------------------------

# 38. Standard Validation

Use repository equivalents of:

``` text
npm run format
npx prettier --check .
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Also run focused suites for the touched semantic path.

A passing build alone is not completion.

------------------------------------------------------------------------

# 39. Current Known Product Gaps

## My Schedule

-   full convergence incomplete;
-   general First-Class Sleep editor incomplete;
-   Work Pattern modes need clearer unification;
-   Commitment editing needs scalable focused UX.

## Goals

-   Goal Structure authoring not fully reachable;
-   ongoing/undated Goal UX needs convergence;
-   recurring Goal Demand remains future work;
-   accepted planning provenance needs scalable presentation;
-   larger Goal sets need search/filter/bounded detail.

## Review Plan

-   legacy date-heavy corrective surfaces remain;
-   repeated Friction needs grouped review;
-   Proposal vs SuggestedFix distinction must remain;
-   old Preview/review compatibility should retire only after parity.

## Summary

-   accepted-planning convergence not implemented;
-   Capacity needs clearer product explanation;
-   Progress remains independent;
-   history needs bounded drill-down;
-   protected history needs safe access/recovery handling;
-   recommendations must remain evidence-based.

## History

-   ordinary protected-history recovery unresolved;
-   destructive abandonment must not masquerade as repair.

## Found Time / Live

-   no complete Found Time workflow;
-   Released Interval / Live Capacity / Live Opportunity remain later
    work;
-   no automatic Progress attribution.

## External Calendar / Holidays

-   static holiday support exists;
-   external calendar/holiday ingestion remains deferred.

## Compatibility Retirement

TodaySurface, SelectedDayWorkspace, HistoricalPlanReportingSection, and
other transitional paths remain until dedicated parity evidence supports
retirement.

------------------------------------------------------------------------

# 40. Projected Upcoming Work

This sequence is a **projection**, not automatically accepted task
numbering. Re-audit repository evidence before issuing each Canonical
Task Block.

Guiding rule:

> **Choose the smallest bounded slice that increases product convergence
> without reopening settled authority.**

------------------------------------------------------------------------

## Projected Task 9.21 --- Accepted-Planning Summary Convergence V1

**Current recommended next task.**

### Purpose

Make G2 accepted-planning lineage understandable in Summary without
collapsing accepted iterations.

### Consume

``` text
queryAcceptedPlanningEvidence(...)
```

### Preserve

-   exact Goal → Demand → Proposal → Accepted Allocation → Realization →
    fact lineage;
-   distinct accepted iterations;
-   accepted vs realized distinction;
-   publication/execution context;
-   protected/unavailable evidence;
-   Progress = `notInferred`.

### Critical Regression

Reuse Network+:

``` text
10h accepted iteration
+
20h accepted iteration
≠
one synthetic 30h acceptance
```

A display total may orient the user, but distinct accepted iterations
must remain inspectable.

### Likely Product Shape

Bounded Goal/period summaries with drill-down into accepted iterations,
realization, sessions/roles, publication, and execution context.

Do not dump raw accepted-allocation records into an unbounded mobile
list.

### Gates

-   full Mobile Acceptance Gate;
-   lazy G2 consumption;
-   no Progress inference;
-   no history weakening;
-   actual current bundle baseline measured first.

------------------------------------------------------------------------

## Projected Task 9.22 --- My Schedule Convergence V1

Target:

``` text
My Schedule
├── Work Pattern
├── Sleep
└── Commitments
```

Likely goals:

-   one coherent Work Pattern concept;
-   make First-Class Sleep authoring product-reachable;
-   focused Commitment management;
-   human duration controls;
-   scalable recurrence/edit UX;
-   progressive disclosure;
-   preserve legacy Sleep conversion as transitional path.

Must not collapse Sleep back into Commitment or alter Sleep solver
semantics merely for presentation.

------------------------------------------------------------------------

## Projected Task 9.23 --- Goals Product Convergence V1

Target coherent Goal experience:

``` text
Outcome
Planning Intent
Structure
Scheduled Work
Recorded Progress
```

Likely work:

-   active-first list;
-   search/filter;
-   Goal detail;
-   Goal Structure authoring reachability;
-   human effort/session presentation;
-   scheduled-work provenance;
-   G2 drill-down where useful.

Preserve:

-   Goal may exist without Demand;
-   undated Goal is valid;
-   Demand owns no time;
-   scheduled work is not Progress;
-   accepted iterations remain distinct.

Recurring Goal Demand should remain a separate architecture slice unless
explicitly accepted into scope.

------------------------------------------------------------------------

## Projected Task 9.24 --- Review Plan Convergence V1

Converge review without merging semantics.

Constructive:

``` text
Proposal
→ Accept / Reject
→ Accepted Allocation
→ Realization
```

Corrective:

``` text
Friction
→ SuggestedFix
→ Try
→ explicit Accept
```

Product goals:

-   group repeated Friction;
-   reduce date-tower UX;
-   preserve exact occurrence/decision identity;
-   keep publication explicit;
-   retire old compatibility only after parity.

No silent bulk replanning or bulk SuggestedFix acceptance.

------------------------------------------------------------------------

## Projected Task 9.25 --- Protected History Access V1

Exact numbering may move.

Purpose: safe ordinary product handling of protected HistoricalPlan
evidence.

Must distinguish:

-   inspect/read;
-   recheck;
-   export;
-   repair/recovery if lawful;
-   destructive abandonment.

Abandonment is not recovery.

Do not weaken fail-closed protection to make history visible.

------------------------------------------------------------------------

## Projected Task 9.26 --- Broader Summary Convergence V1

After accepted-planning productization, converge:

``` text
Capacity
Goals
Accepted Planning
Progress
History
Attention / Recommendations
```

Requirements:

-   bounded overview;
-   explicit coverage;
-   drill-down;
-   unavailable Capacity ≠ zero;
-   missing actual ≠ failure;
-   Progress independent;
-   no invented recommendation engine;
-   operational edits return to Planner.

------------------------------------------------------------------------

## Projected Task 9.27 --- Compatibility Retirement Audit V1

Audit transitional components only after converged surfaces prove
parity.

Candidates:

-   TodaySurface;
-   SelectedDayWorkspace;
-   HistoricalPlanReportingSection;
-   legacy Month detail;
-   old Preview/review towers.

Require:

``` text
semantic parity
action parity
protection parity
mobile parity
accessibility parity
test parity
```

Only then delete or reduce to wrappers.

------------------------------------------------------------------------

## Projected Task 9.28 --- Phase 9 Convergence Acceptance Audit

Verify the ordinary lifecycle:

``` text
Teach intent
→ Capacity
→ Proposal
→ explicit acceptance
→ Realization
→ Planner
→ Review
→ explicit publication
→ Day Worksurface
→ Execution
→ Summary
→ historical inspection
```

Also verify:

-   First-Class Sleep end-to-end;
-   protected history behavior;
-   no duplicate semantic owners;
-   mobile workflows;
-   bundle architecture;
-   compatibility retirement status;
-   no architecture-language leakage.

Only after this should Phase 9 be considered fully converged.

------------------------------------------------------------------------

# 41. Projected Phase 10 --- Live Adaptation and Learning

Conceptual chain:

``` text
publication
+
execution divergence
→ Released Interval
→ Live Capacity
→ Live Opportunity
→ live Proposal or direct action
→ history
→ learning
→ explicit preference promotion
```

## Released Interval

Previously occupied/published time becomes genuinely available because
reality diverged from plan.

## Live Capacity

Capacity recomputed from actual current conditions, distinct from
original planning Capacity.

## Live Opportunity

Bounded opportunity to use newly available time.

May lead to a constructive live Proposal or a lawful direct action where
explicitly designed.

## Found Time

Phase 10 should establish explicit semantics for: - what creates Found
Time; - whether it is authored or derived; - how it differs from
Released Interval; - Goal association; - execution relationship; -
Progress attribution.

Do not infer these from Manual Events.

## Learning

Possible chain:

``` text
history
→ observed tendency
→ explainable recommendation
→ explicit user promotion
→ preference
```

No silent preference mutation.

------------------------------------------------------------------------

# 42. Lower-Priority Future Ideas

Do not let these displace current convergence:

-   external calendar ingestion;
-   automatic holiday ingestion;
-   advanced desktop interactions;
-   richer timeline;
-   sophisticated Goal recurrence;
-   expanded recommendation system;
-   device/health integrations;
-   Sleep scoring;
-   naps;
-   one-off Sleep exception architecture;
-   richer resource/tool attachments;
-   eventual account/sync/cloud features.

------------------------------------------------------------------------

# 43. Product Language Guide

Prefer:

``` text
Schedule
Published schedule
Current schedule
Goal
Goal work
Preparation
Protected time
Outcome not recorded
Completed
Partially completed
Didn't do it
Schedule needs review
View Goal
Adjust Plan
```

Avoid ordinary UI exposure of:

``` text
canonical
truth
realization
allocation
HistoricalPlan
ownerDay
incarnation
publication batch
authority layer
derived publication readiness
```

Technical detail may expose provenance when useful, but should not
dominate normal interaction.

------------------------------------------------------------------------

# 44. Large-Data UX Expectations

## \~20+ Goals

-   search;
-   status filters;
-   active-first ordering;
-   bounded rows;
-   focused detail.

## \~50+ Commitments

-   search;
-   enabled/category filters;
-   bounded/incremental list;
-   one focused editor.

## \~100 Friction records

-   grouping;
-   counts;
-   date spans;
-   source filters;
-   one occurrence review;
-   no silent bulk acceptance.

## Multi-year history

-   bounded queries;
-   pages/ranges;
-   drill-down;
-   never render all history by default.

## Accepted planning

May summarize by Goal/period, but must preserve individual accepted
iterations and exact provenance.

------------------------------------------------------------------------

# 45. Testing Principles

Protect semantics, not just components.

Important regressions:

-   canonical day boundary;
-   cross-midnight ownership;
-   recurrence identity;
-   stale derived-state rejection;
-   Proposal/Accepted/Realized distinction;
-   atomic/idempotent realization;
-   publication immutability;
-   execution correction/retraction;
-   unknown vs skipped;
-   protected vs empty;
-   productive/support/protection distinction;
-   Sleep planning/publication/actual distinction;
-   Network+ multi-iteration provenance;
-   async selected-day race;
-   mobile workflow reachability;
-   bundle gates.

When UI moves, update tests to enter the new lawful path rather than
deleting semantic assertions.

------------------------------------------------------------------------

# 46. Stop-Condition Philosophy

Stop rather than improvise when implementation requires an unapproved
semantic decision.

Use:

``` text
STOP CONDITION — EVIDENCE CONTRACT GAP
```

when a product surface needs evidence canonical read models do not
provide.

Use:

``` text
STOP CONDITION — ARCHITECTURE DECISION REQUIRED
```

when proceeding would require:

-   a new authority rule;
-   persistence/schema change outside scope;
-   a duplicate semantic owner;
-   weakening protection;
-   guessed identity/provenance;
-   a consequential new dependency.

A stop condition is a safety outcome, not negligence.

------------------------------------------------------------------------

# 47. Key Architectural Phrases

> **Commitments own time; Goals compete for Capacity; DayFrame proposes;
> the user authorizes.**

> **One day, one worksurface, many authority layers.**

> **The Day Worksurface is a view of authority, not an authority of its
> own.**

> **Today is a shortcut to the current canonical DayFrame day, not a
> second definition of the day.**

> **Calendar navigation chooses what day to inspect; it does not change
> what DayFrame believes.**

> **Planned is not published. Published is not actual. Actual is not
> Progress.**

> **Support is not productive work. Protection is not an activity.**

> **Missing actual evidence means unknown, not failure.**

> **Protected evidence means unavailable authority, not an empty day.**

> **After a command succeeds, ask DayFrame what is true again.**

> **Convert the future explicitly. Preserve the past exactly.**

> **Converge first. Retire later.**

------------------------------------------------------------------------

# 48. Fresh-Session Rehydration Procedure

A fresh assistant should:

1.  Read this package.

2.  Inspect:

    ``` text
    git rev-parse HEAD
    git status --short
    ```

3.  Read latest RESULTs, especially 9.17--9.20.

4.  For Sleep work, read 9.10--9.16.

5.  For planning authority, read 9.1--9.7 and governing
    ADRs/specifications.

6.  Inspect canonical product-evidence and durable-data compatibility
    ADRs.

7.  Measure current tests and bundle; do not copy old baseline numbers
    blindly.

8.  Audit the exact next slice.

9.  Author one bounded Canonical Task Block.

10. Preserve Mobile Acceptance, bundle, persistence, compatibility, and
    forensic dogfood constraints.

11. Require a RESULT.

12. Review and formally accept the RESULT before treating the task as
    closed.

------------------------------------------------------------------------

# 49. Immediate Handoff

Current accepted state:

``` text
Task 9.20 — Canonical Day Worksurface Convergence V1
STATUS: ACCEPTED COMPLETE
```

Most likely next task:

``` text
Task 9.21 — Accepted-Planning Summary Convergence V1
```

Before authoring 9.21:

1.  inspect current Summary;
2.  inspect G2's exact public contract;
3.  inspect the Network+ multi-acceptance regression;
4.  inspect Summary mobile density;
5.  identify compatibility components;
6.  determine whether protected history intersects the bounded view;
7.  record actual test/bundle baseline;
8.  preserve the Mobile Acceptance Gate;
9.  preserve exact accepted iteration identity;
10. prohibit Progress inference.

Expected conceptual chain:

``` text
G2
→ bounded accepted-planning Summary
→ Goal/period orientation
→ distinct accepted iterations
→ realization state
→ scheduled facts
→ publication/execution context
```

Never:

``` text
10h accepted
+
20h accepted
→ synthetic 30h acceptance
```

A display total may be useful, but underlying accepted iterations must
remain separately inspectable.

------------------------------------------------------------------------

# 50. High-Value Durable Source Map

Rehydrate from current repository versions of these where available:

``` text
DayFrame_Hydration_2026-07-18_UX_Complete.md
Post-Phase-7 Implementation Roadmap Result
Task 9.8C Post-Dogfood Product Reachability & Workflow Audit RESULT
Task 9.9 Pre-Migration Correctness & Authority Convergence V1 RESULT
Task 9.10 First-Class Sleep Architecture Specification RESULT
Task 9.11 First-Class Sleep Domain & Persistence Foundation RESULT
Task 9.12 First-Class Sleep Derivation & Feasibility Foundation RESULT
Task 9.13 First-Class Sleep Capacity & Planning Integration RESULT
Task 9.14 First-Class Sleep Friction & Corrective Authority RESULT
Task 9.15 First-Class Sleep Publication, Execution & Historical Authority RESULT
Task 9.16 First-Class Sleep Legacy Conversion & Product Transition RESULT
Task 9.17 Planner / Summary Product Convergence & Mobile UX Specification RESULT
Task 9.18 Planner / Summary Navigation Foundation RESULT
Task 9.19 Canonical Product Evidence Projection V1 RESULT
Task 9.20 Canonical Day Worksurface Convergence V1 RESULT
ADR_CANONICAL_PRODUCT_EVIDENCE_PROJECTIONS.md
durable-data compatibility/versioning ADRs
current repository code and tests
```

The repository remains final executable authority.

------------------------------------------------------------------------

# 51. Final State Summary

DayFrame has evolved far beyond its original shift-aware-calendar
concept.

Its current architecture includes:

-   canonical user-day ownership;
-   Work/cycle awareness;
-   Commitments;
-   First-Class Sleep;
-   Goal Structure;
-   Goal Demand and Priority;
-   Capacity and Feasibility;
-   competition and Allocation;
-   constructive Proposals;
-   explicit acceptance;
-   atomic realization;
-   Preview;
-   Friction and SuggestedFix;
-   explicit immutable publication;
-   execution/correction/retraction;
-   independent Progress;
-   historical protection;
-   G1 selected-day evidence;
-   G2 accepted-planning lineage;
-   Planner/Summary primary navigation;
-   a converged mobile-first Day Worksurface.

The current challenge is no longer inventing the core engine.

It is:

> **converging the mature architecture into a coherent product without
> losing the authority distinctions that make the architecture
> trustworthy.**

The immediate convergence frontier is accepted-planning Summary
evidence, followed by My Schedule, Goals, Review Plan, protected
history, broader Summary convergence, compatibility retirement, and a
final Phase 9 acceptance audit.

After that, Phase 10 can address the live loop:

``` text
plan
→ reality diverges
→ released time
→ live capacity
→ live opportunity
→ action
→ history
→ learning
```

That is the path from a system that prepares schedules to a system that
can continuously help a user navigate a life that changes underneath the
schedule.

------------------------------------------------------------------------

**Hydration checkpoint:** 2026-09-21\
**Accepted implementation frontier:** Task 9.20 complete\
**Projected next bounded task:** Task 9.21 --- Accepted-Planning Summary
Convergence V1\
**Important:** projected numbering is guidance, not authority, until the
current repository is re-audited.
