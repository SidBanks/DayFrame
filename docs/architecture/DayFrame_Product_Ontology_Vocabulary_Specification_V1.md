# DayFrame Product Ontology & Vocabulary Specification V1

**Document Type:** Canonical Product Architecture Specification  
**Status:** Accepted Design Direction — Pre-Implementation  
**System:** DayFrame  
**Version:** 1.0  
**Date:** 2026-09-21  
**Governing Authority:** DayFrame Complete Architecture Specification, Appendix B — Glossary

## 1. Purpose and Authority

This document defines DayFrame's canonical product ontology and user-facing vocabulary.

> **Product vocabulary translates architecture; it does not create architecture.**

Appendix B remains authoritative. If this specification conflicts with Appendix B, Appendix B governs architectural meaning.

```text
CANONICAL ARCHITECTURE
        ↓
PRODUCT ONTOLOGY
        ↓
UI LANGUAGE
```

Product language may simplify presentation but may not redefine architecture, collapse authority layers, weaken provenance, or weaken Epistemic Integrity.

## 2. Canonical Product Journey

```text
GOALS
What I want to make time for
        ↓
REQUESTED TIME
How much time I want DayFrame to find
        ↓
PLAN
How I intend to use available Capacity
        ↓
SUGGESTED SCHEDULE
Where DayFrame suggests placing that time
        ↓
ACCEPT
        ↓
ACCEPTED SCHEDULE
The Generated Plan I accepted
        ↓
REVIEW SCHEDULE
Inspect the complete schedule
        ↓
BUILD THIS SCHEDULE
Commit the reviewed schedule
        ↓
SCHEDULE
Where my time is actually placed
        ↓
DAILY PLANNER
What is happening on a User Day
        ↓
ACTUAL
What really happened
        ↓
PROGRESS
What I accomplished
```

This is a product mental model, not a replacement for architectural Information Flow.

## 3. Plan

Appendix B defines **Plan** as the Architectural Pillar responsible for deterministic planning. That remains authoritative.

Lowercase *plan/planning* may descriptively mean:

> **A user's intended allocation of discretionary time before it becomes the committed Schedule.**

This does not create a Plan Domain Object.

## 4. Goal, Requested Time, and Capacity

Appendix B's **Goal** remains the product term. It answers: **What do I want DayFrame to help me make time for?**

The user-facing translation of Goal Demand is **Requested Time**:

```text
Requested Time: 20 hours
Requested Time: 10 sessions × 90 minutes
```

Appendix B's **Capacity** remains both architecture and product vocabulary:

> **Capacity is the time DayFrame has determined is available for planning after existing obligations have been considered.**

Capacity remains derived and is not generic unrestricted free time.

## 5. Generated Plan → Suggested Schedule

Appendix B defines **Generated Plan** as the complete proposed schedule produced through deterministic planning and advisory until accepted.

The product translation is **Suggested Schedule**.

If several exist:

```text
Suggested Schedule 1
Suggested Schedule 2
Suggested Schedule 3
```

Do not invent Best/Optimal/Aggressive labels unless later architecture defines them.

Appendix B's **Recommendation Proposal** retains its separate canonical meaning. Do not redefine every implementation `Proposal` as a Recommendation Proposal.

## 6. Accepted Schedule

Appendix B already defines **Accepted Schedule** as a Generated Plan explicitly accepted by the user and therefore intended for execution. Use **Accepted Schedule** directly.

Distinct acceptances remain distinct. A UI may say:

```text
30 hours across 2 Accepted Schedules
```

but must not synthesize them into one authoritative 30-hour acceptance.

Lower-level implementation states such as Accepted Allocation and Realization remain valid but do not redefine Accepted Schedule. If canonical acceptance is not yet fully represented, use truthful transitional copy such as **Accepted — adding to your schedule**.

## 7. Allocation, Realization, and Planning Candidate

These remain primarily architecture/implementation terms. Prefer user-facing concepts such as Requested Time, Suggested Schedule, Accepted Schedule, Scheduled Time, and Added to Schedule.

Appendix B's **Planning Candidate** remains architecture-only in ordinary workflows.

## 8. Schedule

The canonical product meaning of **Schedule** is:

> **Time with concrete temporal placement.**

Schedule answers: **Where is my time actually placed?**

Do not use Schedule as a synonym for Goal, Requested Time, Capacity, abstract planning intent, or Progress.

## 9. Review Schedule and Build this Schedule

Rename `Review Plan` to **Review Schedule**.

Review Schedule answers:

> **What is DayFrame about to commit into the Schedule I will use?**

The preferred primary action is:

> **Build this Schedule**

This replaces ordinary UI wording such as Publish/Publish Plan/Publish Schedule/Commit Schedule where context permits. The implementation may continue using Publication.

## 10. Historical Schedule and Schedule History

A committed historical Schedule should normally be named for its period:

```text
Schedule for the week of September 21
```

If multiple immutable versions exist, add context such as `Built September 18` and `Built September 20`. Do not imply immutable history was edited in place.

The product umbrella is **Schedule History**. `HistoricalPlan`, `PublishedPlan`, and publication batches remain implementation/architecture terms.

## 11. Preview

**Preview has no dedicated canonical user-facing role in V1.**

Internal Preview, Preview Revision, Preview Freshness, and Preview Coverage may remain implementation concepts.

Use precise product actions instead:

```text
Generate Suggested Schedule
Update Schedule
Review Schedule
```

Avoid `Preview stale.` Prefer the actual consequence, such as:

> **Your Schedule Setup changed. Generate an updated schedule to see the changes.**

## 12. Schedule Setup

Rename `My Schedule` to **Schedule Setup**.

It answers:

> **What recurring structure and obligations shape my time?**

```text
Schedule Setup
├── Work Pattern
├── Sleep
└── Commitments
```

Schedule Setup is a product grouping, not a new Domain Object or authority owner.

**Work Pattern**, **Sleep**, and Appendix B's **Commitment** retain separate authority.

## 13. Calendar, Today, and Daily Planner

**Calendar** remains navigation/orientation and does not create planning authority.

**Today** means:

> **A shortcut to the current canonical User Day's Daily Planner.**

The product term for the Day Worksurface is **Daily Planner**.

Daily Planner answers:

> **What is happening on this User Day, and what do I need to know or record?**

It may contain Work, Sleep, Commitments, Goal work, support, protected time, Events, Actual outcomes, Friction/Attention, Goal relationships, and outcome actions.

Daily Planner is preferred over Daily Schedule, Daily To-Do List, or Day Worksurface.

## 14. Event

The generic user-facing term for an item the user directly adds to the Schedule is **Event**.

`Manual Event` should not normally appear in UI; manual authorship is provenance.

A normal Event means:

> **Put this on my Schedule.**

Examples include appointments, dinners, meetings, one-time errands, and other one-off obligations.

An Event is not automatically a Commitment. Adding an Event must not silently create reusable recurring Commitment authority.

Preferred action: **Add Event**.

## 15. Found Time

The product term remains **Found Time**.

Found Time represents unscheduled Actual activity the user chooses to record.

A normal Event says:

> **Put this on my Schedule.**

Found Time says:

> **This happened outside the Schedule; record it.**

```text
Event
→ prospective / scheduled placement

Found Time
→ observed / Actual activity
```

Found Time may optionally be associated with a Goal and Activity Tags. It remains historically distinguishable from scheduled Goal work.

Preferred actions: **Add Found Time** or **Record Found Time**.

Whether Event and Found Time share implementation infrastructure does not change their product meanings or canonical Domain Object ownership.

## 16. Actual

The product term **Actual** remains canonical product language.

Actual answers:

> **What really happened?**

Example:

```text
Requested Time    20h
Scheduled Time    18h
Actual Time       14h
Progress           7 / 10 Practice Exams
```

Individual items should generally use human outcome language:

```text
Mark complete
Partially completed
Didn't do it
Outcome not recorded
```

Execution may remain an architecture/implementation term. Missing Actual remains unknown, not failure.

## 17. Progress

The product term remains **Progress**.

Progress answers:

> **What did I accomplish?**

Progress is user-managed and independent of time accounting.

Do not use Progress as a synonym for Requested Time satisfied, Scheduled Time elapsed, Actual Time logged, number of blocks completed, or percentage of Demand allocated.

A Goal may truthfully show:

```text
Requested Time: 20h
Actual Time: 20h
Progress: 6 / 10 Practice Exams
```

## 18. Activity Tags

**Activity Tags** are reusable user-authored descriptive metadata attached to Actual activity.

Examples:

```text
#PracticeExam
#Subnetting
#StrengthTraining
#Writing
```

Activity Tags answer: **What did I do with this time?**

Goal association answers: **Why did this time matter?**

Tags may support reuse, autocomplete, search, filtering, Summary aggregation, and future learning evidence. They do not create scheduling authority, Goal identity, Demand, accomplishment, Progress, or Preference merely through use.

## 19. Friction and Suggested Fix

Appendix B defines **Friction Report** as a Derived Domain Object identifying conflicts, overload, or planning inefficiencies.

The preferred product language is **Friction** or **Schedule Friction**.

Friction means:

> **Something about this schedule needs review.**

The preferred corrective product term is **Suggested Fix**.

Keep constructive and corrective language distinct:

```text
Constructive:
Suggested Schedule

Corrective:
Friction
→ Suggested Fix
```

A Suggested Fix is not a Suggested Schedule.

## 20. Summary

The product term remains **Summary**.

Summary answers:

> **What has happened, what is changing, and what deserves my attention?**

Summary is primarily a reflection, orientation, and review surface. It may contain Capacity, Goals, Accepted Schedules/accepted-planning evidence, Actual, Progress, Schedule History, Attention, and historical insight.

Summary must not become a second Planner or a new authority owner.

## 21. Canonical Product Navigation

```text
Planner
├── Calendar
│   └── Daily Planner
├── Schedule Setup
│   ├── Work Pattern
│   ├── Sleep
│   └── Commitments
├── Goals
└── Review Schedule

Summary
```

This hierarchy is product organization, not architectural ownership.

## 22. Schedule-State Vocabulary

Keep these distinctions:

**Suggested Schedule** — advisory Generated Plan.

**Accepted Schedule** — Generated Plan explicitly accepted by the user, per Appendix B.

**Schedule** — concrete temporal arrangement in active product use.

**Schedule for the week/day/period of…** — human-facing label for bounded committed historical schedule evidence.

**Schedule History** — product concept/surface for inspecting retained historical schedules.

Do not collapse them merely because they may contain similar geometry.

## 23. Goal Time Vocabulary

For Goals, the preferred four-part vocabulary is:

```text
Requested Time
Scheduled Time
Actual Time
Progress
```

Meanings:

```text
Requested Time
What I asked DayFrame to find.

Scheduled Time
What DayFrame placed.

Actual Time
What I said I actually used.

Progress
What I said I accomplished.
```

These dimensions may differ while all remain correct.

## 24. Architecture Terms Normally Kept Behind the Curtain

The following should generally not appear in ordinary UI unless technical/provenance detail requires them:

```text
Canonical
Truth
Authority
ownerDay
Incarnation
Realization
Allocation
Accepted Allocation
Demand Projection
HistoricalPlan
PublishedPlan
Publication Batch
G1
G2
SleepRequirementV1
Solver
Derived Publication Readiness
Domain Object Category
Architectural Service
Architectural Engine
```

This is a product-language boundary, not a prohibition on architectural use.

## 25. Terms That Span Architecture and Product

Some terms are precise enough to work in both layers:

```text
Goal
Capacity
Commitment
Preference
Constraint
User Day
Accepted Schedule
Progress
```

Their product use must remain consistent with Appendix B.

## 26. Product Copy Principles

DayFrame product copy should be literal, concise, explainable, non-technical where technicality adds no value, explicit about uncertainty, explicit about user decisions, and consistent across mobile and desktop.

Prefer:

```text
Build this Schedule
Suggested Schedule
Accepted Schedule
Requested Time
Schedule Setup
Review Schedule
Daily Planner
Add Event
Add Found Time
Outcome not recorded
Schedule needs review
```

Avoid when a truthful human equivalent exists:

```text
Publish Plan
Realize Allocation
Generate Preview
Selected Day Planning Truth
Canonical owner day
HistoricalPlan unavailable
```

## 27. Epistemic Integrity in Product Language

Simplification must never make DayFrame claim more than it knows.

Do not turn missing Actual into `Didn't do it`.

Do not turn protected historical evidence into `Nothing happened`.

Do not turn a Suggested Schedule into `Your Schedule` before the applicable authority transition.

Do not turn Actual Time into Progress.

> **Product clarity must preserve epistemic precision.**

## 28. User Authority in Product Language

Consequential user decisions should remain visible:

```text
Accept
Adjust
Decline
Build this Schedule
Complete Goal
Continue Goal
Pause Goal
Delete Goal
Release scheduled time
```

DayFrame may suggest. The user authorizes.

## 29. Provenance in Product Language

Friendly language may aggregate evidence for orientation but must not destroy distinct authoritative origins.

Acceptable:

```text
30 hours across 2 Accepted Schedules
```

Not acceptable when authority came from separate acceptances:

```text
One 30-hour Accepted Schedule
```

> **A total is an orientation aid, not a replacement for provenance.**

## 30. Product Surfaces Are Not Automatically Domain Objects

Terms such as:

```text
Schedule Setup
Review Schedule
Daily Planner
Schedule History
```

are product surfaces/concepts.

They do not automatically imply canonical Domain Objects named ScheduleSetup, ReviewSchedule, DailyPlanner, or ScheduleHistory.

Implementation must use existing canonical evidence owners unless architecture explicitly authorizes a new Domain Object.

## 31. Compatibility and Migration

This specification defines target product language. It does not require immediate wholesale code renaming.

Examples:

```text
ManualEvent
→ product: Event

HistoricalPlan
→ product: Schedule History

Preview
→ no dedicated product noun

DayWorksurface
→ product: Daily Planner
```

Code-level retirement or renaming should occur only when safe and justified.

> **Converge first. Retire later.**

## 32. Canonical Translation Table

| Canonical / Implementation Concept | Preferred Product Language | Disposition |
|---|---|---|
| Plan | Plan | Keep canonical Pillar meaning; lowercase descriptive use allowed |
| Goal | Goal | Keep |
| Goal Demand | Requested Time | Translate |
| Capacity | Capacity | Keep |
| Generated Plan | Suggested Schedule | Translate |
| Recommendation Proposal | Context-specific; usually hidden | Preserve canonical meaning |
| Accepted Schedule | Accepted Schedule | Keep |
| Allocation | Context-specific / hidden | Architecture-first |
| Accepted Allocation | Context-specific / hidden | Architecture-first |
| Realization | Added to Schedule / hidden | Architecture-first |
| Planning Candidate | Hidden | Architecture-only by default |
| Schedule | Schedule | Keep |
| Review Plan | Review Schedule | Rename product surface |
| Publication | Build this Schedule | Translate action |
| Published/Historical schedule evidence | Schedule for the week/day/period of… | Translate |
| HistoricalPlan | Schedule History | Translate product concept |
| Preview | No dedicated product term | Retire from ordinary UI vocabulary |
| My Schedule | Schedule Setup | Rename |
| Day Worksurface | Daily Planner | Translate |
| TodaySurface | Today → Daily Planner | Navigation shortcut |
| Manual Event | Event | Translate |
| Found Time | Found Time | Keep |
| Execution | Outcome actions / Actual | Translate |
| Actual | Actual | Keep |
| Progress | Progress | Keep |
| Friction Report | Friction / Schedule Friction | Translate |
| SuggestedFix | Suggested Fix | Translate |
| G1 / G2 | Hidden | Architecture-only |
| SleepRequirementV1 | Sleep | Translate |
| ownerDay | User Day / date context | Hide implementation term |

## 33. Canonical Vocabulary Decisions V1

Product Ontology & Vocabulary V1 establishes:

1. Appendix B remains authoritative.
2. Product vocabulary is a translation layer, not competing architecture.
3. Plan retains its Architectural Pillar definition.
4. Lowercase plan/planning may descriptively refer to intended allocation of discretionary time.
5. Goal remains Goal.
6. Goal Demand is presented as Requested Time.
7. Capacity remains Capacity.
8. Generated Plan is presented as Suggested Schedule.
9. Multiple Suggested Schedules are numbered literally.
10. Accepted Schedule remains Accepted Schedule.
11. Allocation and Realization remain primarily behind the curtain.
12. Schedule means concrete temporal placement.
13. Review Plan becomes Review Schedule.
14. The publication action becomes Build this Schedule.
15. Historical schedules are named by their covered period.
16. HistoricalPlan is presented through Schedule History.
17. Preview has no dedicated user-facing noun.
18. My Schedule becomes Schedule Setup.
19. Schedule Setup contains Work Pattern, Sleep, and Commitments.
20. Day Worksurface becomes Daily Planner.
21. Today is a shortcut to the current User Day's Daily Planner.
22. Manual Event becomes Event.
23. Event means a directly added scheduled item.
24. Found Time remains Found Time and represents unscheduled Actual activity.
25. Actual remains Actual.
26. Progress remains Progress and is not inferred from time.
27. Activity Tags describe Actual activity without creating authority.
28. Friction remains Friction / Schedule Friction.
29. SuggestedFix becomes Suggested Fix.
30. Summary remains Summary.
31. Product language must preserve Epistemic Integrity.
32. Product language must preserve User Authority.
33. Product language must preserve provenance.
34. Product surfaces do not automatically become Domain Objects.
35. Architecture terminology may remain in code while product vocabulary converges.
36. Converge first; retire later.

## 34. Final Governing Principles

> **Product vocabulary translates architecture; it does not create architecture.**

> **Architecture remains precise underneath simple language.**

> **A Suggested Schedule is advisory. An Accepted Schedule is authorized. A Schedule has temporal placement. Actual records what happened. Progress records what the user accomplished.**

> **Requested Time is what the user asks DayFrame to find. Capacity is what DayFrame determines is available.**

> **A total is an orientation aid, not a replacement for provenance.**

> **Missing evidence is unknown. Protected evidence is unavailable. Neither is empty.**

> **DayFrame may suggest. The user authorizes.**

> **Converge first. Retire later.**

---

**End of DayFrame Product Ontology & Vocabulary Specification V1**
