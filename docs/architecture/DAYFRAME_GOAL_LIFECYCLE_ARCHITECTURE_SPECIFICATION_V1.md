# DayFrame Goal Lifecycle Architecture Specification V1

**Document Type:** Canonical Architecture Specification  
**Status:** Accepted Design Direction — Pre-Implementation  
**System:** DayFrame  
**Domain:** Goals, Goal Demand, Goal Lifecycle, Progress, Policies, and Time Attribution  
**Version:** 1.0  
**Date:** 2026-09-21

---

# 1. Purpose

This document defines the canonical lifecycle architecture for Goals in DayFrame.

It establishes how DayFrame represents and reasons about:

- One-Time Goals;
- Recurring Goals;
- Ongoing Goals;
- Goal identity;
- Goal Demand;
- Demand generation and materialization;
- Demand cycles;
- Goal lifecycle boundaries;
- Requested Time;
- Scheduled Time;
- Actual Time;
- user-managed Progress;
- session geometry;
- recurring shortfall;
- Carry Forward;
- Overdue Demand;
- accumulation ceilings;
- Ongoing Goal suppression;
- Found Time;
- Activity Tags;
- prospective Goal amendments;
- Goal review;
- continuation;
- Pause and Resume;
- completion;
- cancellation and deletion;
- release of future scheduled time;
- Released Intervals;
- Global Planning Policies;
- Goal-specific policy overrides;
- immutable historical evidence.

This specification extends the existing DayFrame Goal architecture without replacing the established authority model.

Its central product boundary is:

> **Users request time from DayFrame. DayFrame schedules and accounts for time. Users decide what they accomplished with it.**

A complementary principle is:

> **DayFrame manages time. The user manages effort.**

---

# 2. Architectural Context

DayFrame is a deterministic planning system.

Goals do not directly own arbitrary portions of the user's life merely because they exist.

The existing planning relationship remains:

> **Commitments own time; Goals compete for Capacity; DayFrame proposes; the user authorizes.**

The established authority chain remains:

```text
Authored
→ Derived
→ Proposed
→ Accepted
→ Scheduled / Realized
→ Published
→ Execution / Actual
→ Progress
→ History
→ Learned
→ Explicit Preference
```

Goal lifecycle behavior must preserve these authority boundaries.

An LLM has no scheduling or lifecycle authority.

---

# 3. Governing Principles

## 3.1 Time and accomplishment are different domains

DayFrame schedules **time**.

The user determines what was accomplished during that time.

Therefore:

```text
Requested Time ≠ Scheduled Time
Scheduled Time ≠ Actual Time
Actual Time ≠ Progress
Demand Satisfaction ≠ Goal Completion
```

No layer may silently manufacture the next.

---

## 3.2 Only the user can complete a Goal

DayFrame must never automatically complete a Goal because:

- all requested time was scheduled;
- all scheduled blocks elapsed;
- all requested Actual Time was logged;
- all sessions were logged;
- a Progress target was reached;
- a deadline arrived;
- all Demand was satisfied.

Those conditions may trigger review.

Only an explicit user decision completes a Goal.

---

## 3.3 Goal outcome is independent from schedule geometry

A Goal expresses an outcome or pursuit.

Goal Demand expresses the time the user wants DayFrame to allocate toward that pursuit.

The schedule provides opportunity.

Actual Time records what the user reports doing.

Progress records what the user reports accomplishing.

These remain distinct throughout the lifecycle.

---

## 3.4 Policies generate future Demand

> **Policies generate future Demand. Horizons bound materialization. Materialized Demand acquires durable identity.**

A recurring policy may conceptually exist indefinitely.

DayFrame does not therefore generate infinite future Demand.

The planning horizon bounds how far future Demand is materialized.

Once materialized, Demand becomes durable evidence.

---

## 3.5 The past is immutable

> **A Goal policy may change the future. It may never rewrite the past.**

And:

> **Amendment creates new prospective authority; it does not mutate historical authority.**

Changes to Goal configuration must preserve prior:

- Demand;
- Proposal;
- acceptance;
- realization;
- scheduled facts;
- publication;
- execution;
- Actual Time;
- Progress;
- Activity Tags;
- lifecycle decisions;
- policy provenance.

---

## 3.6 Similarity does not establish identity

> **Similarity may trigger a question. Identity determines authority.**

Similar Goal names, schedules, durations, tags, recurrence patterns, or Progress Metrics may cause DayFrame to ask whether the user is creating a duplicate.

Similarity must never automatically establish:

- identity;
- replacement;
- amendment;
- supersession;
- cancellation.

Durable identity and explicit user decisions determine authority.

---

## 3.7 Missing evidence remains unknown

> **Missing actual evidence means unknown, not failure.**

If DayFrame scheduled a Goal block and the user never reports what happened:

```text
Scheduled:
90 minutes

Actual:
Unknown
```

DayFrame must not silently convert this to:

```text
Actual:
90 minutes
```

or:

```text
Actual:
0 minutes
```

or:

```text
Failed
```

---

## 3.8 Protected evidence is not absent evidence

> **Protected evidence means unavailable authority, not an empty day.**

Lifecycle processing must fail closed when required historical evidence is protected or unavailable.

Protected evidence must never be treated as:

- zero;
- absent;
- safe to delete;
- safe to release;
- unexecuted;
- completed.

---

# 4. Canonical Goal Types

DayFrame supports three fundamental Goal lifecycle types:

```text
One-Time
Recurring
Ongoing
```

These types describe lifecycle and Demand-generation behavior.

They do not establish Priority.

---

# 5. One-Time Goals

A One-Time Goal represents a finite pursuit.

Examples:

- Pass Network+ by October 31.
- Finish a manuscript.
- Paint the garage.
- Prepare for an examination.
- Complete a defined project.

A One-Time Goal may define:

- an end date;
- a finite amount of requested time;
- a number of sessions;
- session duration;
- scheduling constraints;
- an optional Progress Metric.

Example:

```text
Goal:
Network+ Certification

Demand:
10 sessions × 90 minutes

End:
October 31
```

A One-Time Goal reaches its Goal Lifecycle Boundary when its explicitly defined lifecycle ends.

It does not automatically complete.

Instead, it becomes eligible for user review.

---

# 6. Recurring Goals

A Recurring Goal creates finite Demand repeatedly according to a recurrence policy.

Example:

```text
Exercise

Demand:
3 sessions × 60 minutes

Recurrence:
Weekly
```

Each recurrence period creates a distinct Demand cycle.

The end of a Demand cycle is not necessarily the end of the Goal.

A Recurring Goal may itself have:

- a finite lifetime;
- an end date;
- or an indefinite lifetime.

Recurring Demand remains independently identifiable by period.

---

# 7. Ongoing Goals

An Ongoing Goal represents an indefinite pursuit whose requested amount may respond to available Goal Capacity.

Example:

```text
Study Spanish

Target:
Up to 5 hours / week

Minimum session:
30 minutes

Splittable:
Yes

Capacity Response:
Flexible
```

Ongoing does not merely mean:

```text
No end date
```

It carries special planning semantics.

Its target is capacity-seeking rather than a hard liability.

If the entire target cannot lawfully fit, the difference normally becomes **suppression evidence**, not:

- failure;
- Friction;
- Overdue Demand;
- Carry Forward;
- execution failure.

---

# 8. Goal Identity

Every Goal has durable identity.

Goal identity is independent from:

- title;
- description;
- dates;
- requested quantity;
- recurrence;
- session geometry;
- Progress Metric;
- individual Demand instances.

Changing a Goal's title does not create a new Goal.

Continuing a Goal does not create a new Goal.

A single Goal may generate many distinct Demand lifecycles.

Example:

```text
Network+ Certification
│
├── Demand Lifecycle A
│   ├── Requested: 20h
│   ├── Scheduled: 20h
│   ├── Actual: 17h
│   └── Resolution: Continued
│
└── Demand Lifecycle B
    ├── Requested: 20h
    ├── Scheduled: ...
    └── Actual: ...
```

From the user's perspective, this remains one Goal.

Internally, the Demand lifecycles remain distinct.

---

# 9. Goal Demand

Goal Demand expresses the amount of **time** the user wants DayFrame to find.

Demand may be expressed as total time:

```text
20 hours
```

or as sessions:

```text
10 sessions × 90 minutes
```

Both are fundamentally requests for time.

A user may associate an intended accomplishment with those sessions, but DayFrame does not schedule accomplishment.

---

# 10. Sessions Are Scheduling Geometry

> **Sessions are scheduling geometry expressed in time, not units of accomplishment.**

Example:

```text
10 sessions
90 minutes each
Splittable: No
```

means:

> Find ten lawful 90-minute blocks.

It does not mean:

> Complete ten activities.

Likewise:

```text
15 hours
Minimum session: 30 minutes
Splittable: Yes
```

means:

> Find fifteen hours using lawful blocks of at least thirty minutes.

Session constraints may include:

- number of sessions;
- target duration;
- minimum duration;
- maximum duration where supported;
- splittability;
- applicable scheduling window.

These are scheduling constraints.

They are not Progress.

---

# 11. Demand Identity

Every materialized Demand instance must acquire durable identity.

Recurring Demand must not derive identity from whichever calendar view happens to display it.

Conceptually:

```text
Goal Identity
+
Demand Policy Identity / Revision
+
Recurrence Period Identity
=
Demand Instance Identity
```

The implementation may use another deterministic representation, but it must provide equivalent semantics.

Materialization must be idempotent.

Repeatedly viewing or generating the same planning horizon must not duplicate Demand.

---

# 12. Monthly Materialization Horizon

For Goals without a finite end date, the **Monthly Planner** is DayFrame's canonical future Demand materialization horizon.

Recurring and Ongoing Demand is materialized one Monthly Planner horizon at a time.

This does not change the natural recurrence.

Example:

```text
Exercise:
3 sessions / week
```

remains weekly.

DayFrame merely materializes the weekly Demand instances necessary for the applicable monthly planning horizon.

A weekly recurrence crossing a month boundary remains one recurrence instance.

It must not be duplicated because two months can see it.

The product should communicate this behavior in ordinary language, such as:

> **Ongoing Goals are planned one month at a time.**

Once Demand materializes, its identity remains durable even after the Monthly Planner advances.

---

# 13. Four Independent Goal Dimensions

DayFrame maintains four independent dimensions:

```text
REQUESTED
What time the user asked DayFrame to find.

SCHEDULED
What time DayFrame actually reserved.

ACTUAL
What time the user explicitly reports using.

PROGRESS
What the user explicitly reports accomplishing.
```

Example:

```text
Network+ Practice Exams

Requested:
10 × 90-minute sessions

Scheduled:
9 × 90-minute sessions

Actual:
11h 45m

Progress:
6 / 10 Practice Exams
```

All four values may differ while remaining simultaneously correct.

---

# 14. Scheduled Time

Scheduled Time represents opportunity.

It means DayFrame successfully reserved time associated with Goal Demand.

It does not mean the activity occurred.

It does not satisfy Progress.

It does not complete the Goal.

It does not automatically become Actual Time when the scheduled interval passes.

---

# 15. Actual Time

Actual Time is created only from user-provided execution evidence.

Users decide whether and how to log what occurred.

Possible execution outcomes may include:

```text
Completed as planned
Partially completed
Didn't do it
```

A partial completion may include the actual duration used.

If the user provides no execution evidence, Actual remains unknown.

DayFrame does not force the user to log every block.

---

# 16. Demand Satisfaction

Compatible Actual Time may satisfy outstanding time Demand according to the applicable attribution policy.

Scheduled Time alone does not satisfy Demand.

This distinction allows DayFrame to truthfully represent:

```text
Requested:
5h

Scheduled:
5h

Actual:
4h

Remaining Demand:
1h
```

without claiming the Goal failed or that the missing hour was necessarily unused.

---

# 17. Progress

Progress is optional and user-managed.

A Goal may define a numerical Progress Metric.

Conceptually:

```text
Metric Name
Unit
Starting Value
Current Value
Target Value
```

Examples:

```text
Practice Exams
3 / 10
```

```text
Words
27,450 / 80,000
```

```text
Sections Painted
2 / 4
```

A Goal may also have:

```text
Progress Tracking:
None
```

DayFrame must not infer Progress from:

- Requested Time;
- Scheduled Time;
- Actual Time;
- Found Time;
- session completion;
- Activity Tags.

The user manages Progress.

Existing evidence semantics remain:

```text
Progress: notInferred
```

Progress reaching its target does not automatically complete the Goal.

It may make completion an obvious review option, but the decision remains the user's.

---

# 18. Activity Tags

DayFrame should support reusable **Activity Tags**.

Activity Tags describe what the user did with Actual Time.

Example:

```text
Network+ Study
Actual: 90 minutes

Goal:
Network+ Certification

Activity Tags:
#PracticeExam
#Subnetting
#ProfessorMesser
```

The conceptual distinction is:

> **Goal association says why the time matters. Activity Tags say what the user did with it.**

Activity Tags may be maintained in a reusable library.

The product may support:

- autocomplete;
- reuse;
- search;
- filtering;
- Summary aggregation;
- historical review.

Example:

```text
Network+ Certification
Actual Goal Time: 14h 30m

Activity:
#PracticeExam       6h
#Subnetting         3h 30m
#VideoStudy         3h
#Flashcards         2h
```

These totals are legitimate because they aggregate user-labeled Actual Time.

Activity Tags do not:

- create Demand;
- create schedule ownership;
- establish Goal identity;
- automatically satisfy Progress;
- prove accomplishment;
- become preferences merely through repetition.

They are descriptive evidence.

---

# 19. Found Time

Found Time represents unscheduled Actual Time that the user chooses to record.

Conceptually, Found Time is a **Special Manual Event**.

Example:

```text
Found Time
Duration: 60 minutes

Goal:
Network+ Certification

Tags:
#PracticeExam
```

Found Time may optionally be associated with a Goal.

It does not retroactively become scheduled Goal work.

Its historical origin remains Found Time / unscheduled Actual activity.

This distinction must remain visible in provenance even when Found Time contributes toward outstanding Demand.

---

# 20. Actual-Time Attribution Policy

Users may decide whether compatible Actual Goal activity reduces outstanding requested Demand.

This should be governed by a user policy.

Two fundamental behaviors exist.

## 20.1 Reduce Requested Time

Compatible Actual activity consumes outstanding Demand.

Example:

```text
Demand:
5h

Scheduled Actual:
4h

Found Time:
2h
```

With Demand reduction enabled:

```text
Demand satisfied:
5h

Additional Goal activity:
1h
```

---

## 20.2 Keep Requested Time

Actual activity is recorded but does not reduce what DayFrame was asked to schedule.

Using the same example:

```text
Demand satisfied:
4h

Found Time:
2h bonus activity

Remaining Demand:
1h
```

This permits users to treat unexpected effort as additional work rather than a substitute for planned work.

---

# 21. Found Time and Overdue Demand

When compatible Found Time is configured to reduce Demand, attribution defaults to:

```text
Oldest compatible Overdue Demand
        ↓
Newer compatible Overdue Demand
        ↓
Current-period Demand
```

Compatibility matters.

A 20-minute activity must not automatically satisfy an indivisible required 90-minute session unless that Demand's policy permits such attribution.

If Found Time reduction is disabled, Found Time remains additional Actual activity and consumes no Demand.

---

# 22. Demand Cycle Boundary

A **Demand Cycle Boundary** ends an individual recurrence period.

Examples:

```text
Daily Demand
→ end of applicable day

Weekly Demand
→ end of applicable week

Monthly Demand
→ end of applicable month/cycle
```

At a Demand Cycle Boundary, DayFrame resolves that period's Demand according to applicable policy.

Possible outcomes include:

- satisfied;
- shortfall;
- Expire;
- Carry Forward;
- Overdue;
- suppression;
- suspended by lifecycle action.

A Demand Cycle Boundary does not inherently end the Goal.

---

# 23. Goal Lifecycle Boundary

A **Goal Lifecycle Boundary** ends the explicitly defined lifecycle of a finite Goal.

Example:

```text
Network+ Certification
End date: October 31
```

October 31 establishes the lifecycle boundary.

The boundary is not established by:

- Requested Time exhaustion;
- Scheduled Time exhaustion;
- Actual Time satisfaction;
- Progress target attainment.

At the lifecycle boundary, the Goal becomes eligible for user review.

---

# 24. Recurring Shortfall Policy

Recurring Goals may define how unmet Demand behaves when a recurrence period ends.

Supported policies are:

```text
Expire
Carry Forward
Overdue
```

---

# 25. Expire

Under **Expire**, unmet Demand closes with the period.

History preserves the shortfall.

The next recurrence begins normally.

Example:

```text
Requested:
3 sessions

Actual:
2 sessions

Shortfall:
1 session

Policy:
Expire
```

The missing session does not become future actionable Demand.

Historical evidence still records that the period ended one session below requested time.

---

# 26. Carry Forward

Under **Carry Forward**, unresolved quantity becomes additional actionable Demand in the next applicable period.

Example:

```text
Week 1:
Requested 5h
Actual 3h
Shortfall 2h

Week 2:
Normal Demand 5h
Carry Forward 2h
Actionable Demand 7h
```

Carry Forward remains bounded by the accumulation ceiling.

Historical source periods remain identifiable.

The system must not rewrite Week 2 as though its native Demand had always been 7 hours.

---

# 27. Overdue

Under **Overdue**, unresolved Demand remains a distinct outstanding Demand instance retaining its original identity and originating period.

Example:

```text
Week 1 Demand:
5h
2h unresolved
→ 2h Overdue from Week 1

Week 2 Demand:
5h
```

These remain distinct:

```text
2h Overdue — Week 1
5h Current — Week 2
```

They must not become a synthetic authoritative:

```text
7h Week 2 Demand
```

Orientation totals may aggregate them for display while preserving provenance.

---

# 28. Unspecified Shortfall Policy

If a recurring Goal reaches a shortfall and no applicable Shortfall Policy exists, DayFrame must ask the user.

The choices are:

```text
Expire
Carry Forward
Overdue
```

DayFrame should also ask whether the selected behavior should become the default for this Goal going forward.

Until the user decides, the shortfall remains unresolved.

DayFrame must not silently assume any policy.

---

# 29. Carry Forward and Overdue Ceilings

Carry Forward and Overdue use bounded actionable accumulation.

The canonical default is:

```text
3 recurrence periods
```

The maximum user-selectable value is:

```text
10 recurrence periods
```

The ceiling is measured in **period-equivalents**.

Example:

```text
5 hours/week
Ceiling: 3 periods

Maximum actionable accumulated quantity:
15 hours
```

Example:

```text
3 sessions/week
Ceiling: 3 periods

Maximum actionable accumulated quantity:
9 sessions
```

Once the ceiling is reached, actionable backlog stops increasing.

Additional unmet Demand remains historical evidence but does not create unlimited future liability.

Repeatedly reaching the ceiling may eventually support a gentle Goal review signal.

It is not automatically failure and must not automatically cancel the Goal.

---

# 30. Ongoing Capacity Response Policy

Ongoing Goals have a **Capacity Response Policy** governing how their target reacts when Goal Demand competes for remaining Capacity.

Supported policies are:

```text
Flexible
Normal
Preserve Target
```

Capacity Response is independent from Priority.

---

# 31. Flexible

A Flexible Ongoing Goal is an early candidate for suppression when Goal Demand exceeds available Capacity.

Example:

```text
Study Spanish
Up to 5h/week
Capacity Response: Flexible
```

If only two lawful hours remain after higher-authority obligations and Goal competition:

```text
Target:
5h

Scheduled:
2h

Suppressed:
3h
```

The suppressed three hours do not become failure or Overdue Demand by default.

---

# 32. Normal

A Normal Ongoing Goal competes according to ordinary Goal Priority and feasibility semantics.

It receives no special preference for either preservation or suppression beyond those rules.

---

# 33. Preserve Target

Preserve Target instructs DayFrame to work harder to retain the Ongoing Goal's requested target before reducing it.

This may include attempting:

```text
Move
Split, when allowed
Shrink only after lawful alternatives are exhausted
Suppress entirely only when necessary
```

Preserve Target does not permit DayFrame to:

- manufacture Capacity;
- invade Work;
- invade Sleep;
- invade Commitments;
- invade hard liabilities;
- redefine Capacity.

It changes Goal competition behavior, not the definition of available time.

---

# 34. Suppression

> **Suppression may mean shrink and/or move.**

For Ongoing Goals, suppression represents the portion of the capacity-seeking target DayFrame could not lawfully preserve.

Suppression is distinct from:

- shortfall;
- Friction;
- execution failure;
- Overdue;
- Carry Forward.

Suppression evidence should remain available for Summary and review.

Example:

```text
Spanish

Target:
5h

Scheduled:
3h

Suppressed:
2h
```

This lets the user see that their policy consistently requests more time than their life currently supports without manufacturing a failure state.

---

# 35. Policy Amendments

Goal policies may change prospectively.

They may never rewrite already-established historical authority.

Example:

```text
Exercise

Old policy:
3 sessions/week

Changed October 15 to:
5 sessions/week
```

DayFrame should support explicit effective-time choices where meaningful, such as:

```text
This period
Next period
Choose a date
```

"This period" means an amendment becomes effective during the current period.

It does not mean the new policy was always in force.

Summary and History must be able to show that the policy changed mid-period.

---

# 36. Continue

At a finite Goal Lifecycle Boundary, the user may choose:

```text
Continue
```

The canonical meaning is:

> **Do this again.**

Continue preserves the existing Goal identity.

It creates the next Demand lifecycle using the Goal's currently applicable Demand Policy.

Example:

```text
Network+ Certification
│
├── Demand Lifecycle A
│   ├── Requested: 20h
│   ├── Actual: 17h
│   └── Resolution: Continued
│
└── Demand Lifecycle B
    ├── Requested: 20h
    └── Actual: ...
```

Demand Lifecycle B does not mutate Lifecycle A.

The user continues to experience this as one Goal.

---

# 37. Continue Copies Policy, Not Obsolete Dates

Continue should reproduce the Goal's applicable planning policy, not literal expired calendar geometry.

Example:

```text
10 sessions × 90 minutes
during the applicable lifecycle
```

may be repeated.

A deadline already in the past must not simply be copied.

The next Demand lifecycle receives its own lawful future temporal context.

---

# 38. Edit

At lifecycle review:

> **Continue means “do this again.”**

> **Edit means “continue under different terms.”**

Edit invokes prospective amendment semantics.

The user may change applicable future properties such as:

- requested quantity;
- session geometry;
- recurrence;
- Priority;
- Capacity Response Policy;
- Shortfall Policy;
- review cadence;
- Progress configuration;
- other lawful Goal policy.

Prior Demand remains unchanged.

---

# 39. Awaiting User Review

When a finite Goal reaches its Goal Lifecycle Boundary, it enters a state or derived condition equivalent to:

```text
Awaiting User Review
```

Summary presents:

```text
Complete
Continue
Edit
```

If the user ignores the review:

- the Goal is not completed;
- the Goal is not failed;
- another One-Time lifecycle is not silently created;
- history is not rewritten.

It remains Awaiting User Review until the user acts.

---

# 40. Complete

Only the user may Complete a Goal.

Complete means:

> The user declares that this Goal is finished.

Completion:

- stops future Demand generation;
- preserves Goal identity historically;
- preserves all historical Demand;
- preserves publication;
- preserves Actual Time;
- preserves Progress;
- preserves Activity Tags;
- does not imply all requested time was used;
- does not require Progress to equal its target.

Completion may create a question about already-scheduled future Goal work.

---

# 41. Completion Release Policy

Suppose a Goal is completed while future unexecuted Goal work remains scheduled.

Example:

```text
Network+ completed today

Future scheduled Goal work:
8 hours
```

DayFrame should ask:

> You still have 8 hours reserved for this Goal. Release that time back to your schedule?

Canonical policy choices are:

```text
Ask me
Release future Goal time
Keep future Goal time
```

This preference may be stored as a Global Policy and may be overridden for an individual Goal.

The initial safe default is:

```text
Ask me
```

because already-scheduled future time represents meaningful schedule authority.

Keeping the time is legitimate.

For example, the user may have passed Network+ but still want the reserved blocks for reinforcement.

---

# 42. Pause

Pause means:

> **I still want this Goal, but not right now.**

Pause:

- preserves Goal identity;
- stops new Demand generation while paused;
- does not complete the Goal;
- does not cancel the Goal;
- preserves history;
- suspends unresolved Demand.

Conceptual Pause durations may include:

```text
Until I resume
Until a date
For N recurrence periods
```

---

# 43. Suspended Demand

Outstanding Demand affected by an explicit Pause becomes **Suspended Demand**.

It does not automatically become:

- expired;
- Carry Forward;
- Overdue;
- failed.

This preserves an important distinction:

> **Shortfall is the result of a planning period ending without satisfying expected Demand. Suspension is the result of an explicit user lifecycle decision.**

---

# 44. Pause and Future Scheduled Work

When the user pauses a Goal and future unexecuted Goal work is already scheduled, DayFrame asks whether that time should be released unless an applicable policy already answers the question.

Canonical choices:

```text
Release scheduled time
Keep scheduled time
Ask me
```

This preference belongs on the Global Planning Policy surface and may be overridden per Goal.

If released, the original publication remains immutable.

The release becomes new prospective evidence.

---

# 45. Resume

When a paused Goal resumes, Suspended Demand is resolved according to a Resume Policy.

Canonical Resume Policies are:

```text
Resume outstanding + normal Demand
Discard outstanding + resume normally
Finish outstanding first
```

---

# 46. Resume Outstanding + Normal Demand

This policy:

1. restores Suspended Demand;
2. creates/materializes normally applicable current Demand.

Example:

```text
Suspended:
2h

Current normal Demand:
5h

Actionable:
2h restored + 5h current
```

The two sources remain distinguishable.

---

# 47. Discard Outstanding + Resume Normally

This policy retires Suspended Demand prospectively while preserving its historical evidence.

The Goal then resumes with normally applicable current Demand.

"Discard" does not erase the fact that the Demand once existed.

---

# 48. Finish Outstanding First

This policy restores Suspended Demand first.

New recurring Demand is held until the restored Demand is resolved according to lawful planning rules.

This policy does not manufacture Capacity.

If outstanding Demand cannot fit, it remains subject to ordinary Capacity and feasibility constraints.

The policy must not create an infinite blocking state that prevents the user from reviewing or changing the Goal.

---

# 49. Resume Policy Scope

Resume Policy should support:

```text
Explicit decision
Goal-specific override
Global default
Ask me
```

The initial safe default is:

```text
Ask me
```

until the user establishes another preference.

---

# 50. Cancel and Delete

Cancel/Delete means:

> **This Goal no longer exists prospectively for the user.**

This is stronger than Pause.

It is also different from Complete.

The governing principle is:

> **The past is immutable. A Goal that no longer exists to the user has no authority over the future.**

Cancel/Delete therefore:

- terminates all future Goal authority;
- stops future Demand generation;
- retires unrealized future Demand;
- releases all future unexecuted Goal-owned scheduled time;
- preserves historical evidence.

Unlike Pause and Complete, release is intrinsic to Cancel/Delete.

There is no Global Policy permitting a cancelled/deleted Goal to retain future Goal Demand.

---

# 51. Cancel vs Physical Delete

A Goal with no durable downstream evidence may be physically deleted where lawful.

Once durable historical evidence exists, physical erasure would corrupt history.

In that case, a user-facing Delete action may remove the Goal from active use while its historical identity remains preserved.

Conceptually:

```text
Delete Goal
        ↓
Has durable downstream evidence?
        │
        ├── No
        │    → Physical deletion may be lawful
        │
        └── Yes
             → Remove from active use
             → Lifecycle becomes Cancelled/Retired
             → Preserve historical identity
```

The user does not need to understand internal retirement mechanics.

The product should simply explain:

> **Past activity and schedule history will remain in your records.**

---

# 52. Released Intervals

When future scheduled time is lawfully relinquished, DayFrame creates evidence equivalent to a **Released Interval**.

A Released Interval represents:

> Time that previously had lawful future ownership or reservation and was subsequently released through an authorized prospective action.

Possible causes include:

- Goal completion;
- Goal Pause;
- Goal cancellation/deletion;
- future Goal rescheduling;
- other lawful future release actions.

A Released Interval should retain provenance to:

- the released scheduled fact;
- the originating Goal;
- the originating Demand where applicable;
- the authorizing action;
- the authorizing policy where applicable;
- the effective time.

---

# 53. Released Interval Does Not Automatically Schedule Something Else

A Released Interval is not:

- a Proposal;
- a new Goal allocation;
- automatically reassigned time;
- automatic Found Time.

Releasing:

```text
3:00–4:30 PM
Network+ Study
```

means only that the previous future claim has been relinquished.

It does not mean DayFrame may immediately assign something else.

This creates a clean future Phase 10 path:

```text
Released Interval
        ↓
Live Capacity
        ↓
Live Opportunity
        ↓
Proposal or lawful direct action
        ↓
User authorization where required
```

Live Capacity and Live Opportunity remain outside this specification.

---

# 54. Publication Remains Immutable

If a published plan originally contained:

```text
Network+ Study
3:00–4:30 PM
```

and the user later completes Network+ and releases the block, DayFrame must not rewrite the original publication to pretend the block was never there.

Instead:

```text
Published Plan
Network+ Study
3:00–4:30 PM
        ↓
Prospectively released
Reason: Goal completed
        ↓
Released Interval
3:00–4:30 PM
```

History must be capable of answering both:

> What was originally published?

and:

> What changed afterward?

---

# 55. Goal Rescheduling

Future Goal rescheduling should operate on already-realized future Goal work.

It is conceptually analogous to Move Commitment but remains semantically distinct.

Rescheduling must:

- preserve Goal identity;
- preserve Demand identity;
- preserve accepted provenance;
- preserve publication history;
- move only future lawful scheduled work;
- evaluate real available Capacity;
- not create Progress;
- not mutate elapsed history.

A future shared deterministic capability such as:

```text
queryAvailableCapacity(...)
```

may be appropriate if it can understand all actual time owners, including:

- Work;
- Sleep;
- Commitments;
- Manual fixed events;
- realized Goal work;
- Support Activities;
- Protected Buffers;
- other hard liabilities.

This specification does not require that implementation.

---

# 56. Global Planning Policies

DayFrame should provide a dedicated supporting settings surface:

```text
Settings
└── Planning Policies
```

This is a **Policy layer**, not a scheduling authority owner.

Its purpose is to let the user answer recurring decision questions once rather than being interrupted repeatedly.

The governing principle is:

> **A Policy tells DayFrame how to handle a class of future decisions when the user has already expressed a preference. It never grants DayFrame authority beyond the choice the user explicitly made.**

---

# 57. Policy Precedence

Where applicable, policy precedence is:

```text
Explicit decision for this occurrence
        ↓
Goal-specific policy
        ↓
Goal-type Global Policy
        ↓
General Global Policy
        ↓
DayFrame default / Ask me
```

A more specific explicit choice overrides a broader default.

Users should be able to return an individual Goal to:

```text
Use Global Policy
```

Policy changes apply prospectively.

They do not rewrite prior decisions.

---

# 58. Global Policy Categories

The Planning Policies surface should conceptually accommodate at least:

```text
Planning Policies
│
├── Goal Defaults
│   ├── Actual-Time attribution
│   ├── Completion release behavior
│   └── other general defaults
│
├── One-Time Goals
│   └── applicable lifecycle defaults
│
├── Recurring Goals
│   ├── Shortfall Policy
│   ├── Carry Forward / Overdue Ceiling
│   └── Goal Review Cadence
│
├── Ongoing Goals
│   ├── Capacity Response Policy
│   └── Goal Review Cadence
│
├── Pause
│   └── Scheduled-Time Release Policy
│
├── Resume
│   └── Suspended-Demand Resume Policy
│
└── Found Time
    └── Demand Attribution Policy
```

Not every policy must exist at every scope.

The architecture should expose only semantically meaningful combinations.

---

# 59. Cancel/Delete Is Not a Policy Choice

Cancel/Delete is intentionally excluded from release-policy customization.

A Goal that no longer exists prospectively cannot retain future Goal authority.

Therefore:

```text
Cancel/Delete
→ release future Goal Demand
→ release future unexecuted Goal-owned scheduled time
```

is intrinsic lifecycle behavior.

---

# 60. Periodic Goal Review

Recurring and Ongoing Goals have a configurable **Goal Review Cadence** independent of their Demand recurrence.

The canonical default is:

```text
Monthly
```

This is intentional.

The month is already DayFrame's natural forward-planning rhythm.

Conceptually:

```text
Monthly Planner horizon
        +
Monthly indefinite-Goal materialization
        +
Monthly default Goal review
        =
Monthly planning checkpoint
```

---

# 61. Goal Review Cadence Options

Conceptually, Goal Review Cadence should support choices such as:

```text
Monthly
Every 2 months
Every 3 months
Every 6 months
Yearly
Never
Custom
```

The Global default is Monthly.

An individual Goal may override the Global setting.

---

# 62. Periodic Review Is Non-Blocking

Periodic review for a Recurring or Ongoing Goal is not a Goal Lifecycle Boundary.

If the user ignores the review:

- the Goal continues;
- Demand generation continues;
- the Goal is not paused;
- the Goal is not completed;
- no failure is created.

The review is an opportunity to verify that the Goal still reflects the user's intentions.

---

# 63. Periodic Review Actions

Summary may present:

```text
Continue
Edit
Pause
Complete
```

For periodic review, Continue means:

> Keep operating this Goal under its existing policy.

It must not create duplicate Demand.

This differs from Continue at the end of a finite Goal lifecycle, where Continue creates the next Demand lifecycle.

The same product word may therefore represent two contextually distinct but user-comprehensible actions.

---

# 64. Summary as the Goal Review Surface

Goal lifecycle review should primarily occur on Summary.

DayFrame should avoid disruptive modal prompts merely because a temporal boundary occurred.

Example:

```text
Network+ Certification

Your planned lifecycle has ended.

Requested: 20h
Scheduled: 20h
Actual: 17h 30m
Progress: 8 / 10 Practice Exams

[Complete] [Continue] [Edit]
```

For an Ongoing Goal:

```text
Spanish

Monthly Goal Review

Target:
Up to 5h/week

This Goal is due for review.

[Continue] [Edit] [Pause] [Complete]
```

Summary should function as a review and orientation surface, not as a second authority owner.

---

# 65. Lifecycle States

The Goal lifecycle conceptually includes:

```text
Active
Paused
Awaiting User Review
Completed
Cancelled
```

These states are distinct from:

- Demand state;
- Proposal state;
- Accepted Allocation state;
- realization state;
- publication state;
- execution state;
- Progress state.

The eventual implementation should prefer deriving state from authoritative evidence where possible rather than creating redundant mutable state.

---

# 66. Core Lifecycle Transitions

Conceptually:

```text
                    ┌──────────┐
                    │  Active  │
                    └────┬─────┘
                         │
          ┌──────────────┼───────────────┐
          │              │               │
        Pause       Lifecycle End     Complete
          │              │               │
          ▼              ▼               ▼
      ┌────────┐   ┌──────────────┐  ┌───────────┐
      │ Paused │   │Awaiting Review│  │ Completed │
      └───┬────┘   └──────┬───────┘  └───────────┘
          │               │
        Resume       ┌────┼────┐
          │          │    │    │
          ▼       Complete│ Continue
       Active          Edit
                       │
                       ▼
                     Active
```

Cancel/Delete may transition an eligible active, paused, or reviewable Goal to:

```text
Cancelled
```

while preserving historical evidence.

---

# 67. Demand Evidence Is Orthogonal

Demand should not necessarily be forced into one lossy lifecycle enum.

The architecture must be capable of distinguishing evidence such as:

```text
Materialized
Scheduled in part
Scheduled in full
Actual in part
Actual in full
Shortfall unresolved
Expired
Carried Forward
Overdue
Suspended
Suppressed
Retired
Released where applicable
Protected / Unknown
```

Several of these conditions may coexist.

Example:

```text
Demand:
5h

Scheduled:
4h

Actual:
3h

Overdue:
1h

Protected historical evidence:
some execution unavailable
```

The model must preserve those distinctions rather than collapsing them into a misleading single status.

---

# 68. Prospective Policy Amendment

Once Demand materializes, later policy edits must not rewrite it.

Example:

```text
Exercise

Week begins:
3 sessions requested

Wednesday:
User changes future policy to 5 sessions/week
```

If the user chooses:

```text
This period
```

DayFrame records an explicit mid-period amendment.

It does not claim five sessions were requested from the beginning of the week.

If the user chooses:

```text
Next period
```

the current period remains governed by the existing policy.

Where appropriate, DayFrame may also support:

```text
Choose a date
```

---

# 69. Duplicate Detection

When creating or editing a Goal, DayFrame may identify similarity to existing Goals.

Example:

```text
You already have a Goal named "Network+ Certification."

Is this a separate Goal?
```

Potential choices may include:

```text
Keep both
Update existing
Replace future plan
Cancel
```

Similarity is advisory only.

DayFrame must never infer replacement merely because two Goals share:

- a title;
- a duration;
- recurrence;
- tags;
- Progress Metric;
- scheduling window.

---

# 70. Supersession Boundary

An explicit future action such as:

```text
Replace future plan
```

may eventually establish prospective supersession semantics.

Historical accepted decisions must remain preserved.

Existing architecture currently treats supersession as not inherently represented.

This specification does not authorize silent supersession.

A future implementation must define explicit supersession authority before using replacement semantics.

---

# 71. Policy Provenance

DayFrame must eventually be able to answer:

> Why did this happen?

Examples:

```text
This Demand expired because:
Goal-specific Shortfall Policy = Expire
```

```text
This scheduled block was released because:
Goal was paused
Global Pause Policy = Release Scheduled Time
```

```text
This Found Time reduced Demand because:
Goal-specific Actual-Time Attribution = Reduce Requested Time
```

Policy provenance must therefore be retained sufficiently to identify which policy revision governed an authoritative lifecycle action.

Changing a policy later must not make old decisions appear to have been governed by the new policy.

---

# 72. Determinism

Goal lifecycle behavior must remain deterministic.

Given the same:

- authored Goal;
- policy revisions;
- materialized Demand;
- Capacity evidence;
- execution evidence;
- lifecycle actions;
- evaluation instant;

DayFrame should derive the same lifecycle result.

No lifecycle authority may depend on probabilistic interpretation.

---

# 73. Idempotence

Lifecycle processing must be idempotent.

Repeated evaluation must not create duplicate:

- recurring Demand;
- Carry Forward;
- Overdue Demand;
- continuation lifecycles;
- release records;
- lifecycle events.

Examples:

```text
Generate October Demand
Generate October Demand again
```

must not duplicate October Demand.

Likewise:

```text
Process weekly boundary
Process same boundary again
```

must not generate duplicate Carry Forward or Overdue records.

---

# 74. Atomic Lifecycle Commands

Certain lifecycle operations affect multiple authority layers and must eventually be atomic.

These include at least:

```text
Continue
Pause + optional scheduled-time release
Resume
Complete + optional scheduled-time release
Cancel/Delete + mandatory future release
Prospective Goal amendment
Shortfall resolution
Carry Forward generation
Overdue generation
```

The system must not permit contradictory partial outcomes such as:

```text
Goal Cancelled
but future Demand remains authoritative
```

or:

```text
Future scheduled Goal block removed
but no release provenance exists
```

---

# 75. Protected Evidence

If a lifecycle action requires historical evidence that is protected or unavailable, DayFrame must fail closed.

Examples include determining whether:

- a Goal has historical execution;
- a future block was already published;
- a Demand was previously resolved;
- a historical Goal can be physically deleted.

Protected evidence must not be interpreted as absence.

Recovery of protected HistoricalPlan evidence is a separate architecture concern.

---

# 76. G1 — Selected-Day Evidence Compatibility

Goal lifecycle architecture must preserve G1's selected-day distinctions.

G1 must continue to distinguish:

- current scheduled Goal work;
- published Goal work;
- Actual execution;
- unplanned/Found Time activity;
- Manual Events;
- support;
- protection;
- unknown actual evidence.

Found Time must not masquerade as scheduled Goal work.

A released future scheduled fact must not cause the original publication to disappear from historical evidence.

---

# 77. G2 — Accepted-Planning Evidence Compatibility

G2 must continue preserving:

```text
Goal
→ Demand
→ Proposal
→ Accepted Allocation
→ Realization
→ Scheduled Fact
→ Publication
→ Execution
```

Goal lifecycle additions must not collapse this chain.

The canonical Network+ provenance regression remains important.

Example:

```text
Accepted A:
10h

Accepted B:
20h
```

must never become an authoritative synthetic:

```text
Accepted:
30h
```

Orientation totals may display:

```text
30h accepted across 2 decisions
```

only if the underlying decisions remain independently inspectable.

---

# 78. Continuation and the Network+ Provenance Rule

Continuation follows the same provenance principle.

Example:

```text
Demand Lifecycle A:
20h

User chooses Continue

Demand Lifecycle B:
20h
```

DayFrame may display orientation such as:

```text
40h requested across 2 planning lifecycles
```

but must never rewrite history to claim:

```text
Original request:
40h
```

The original request was 20 hours.

The second request was another 20 hours.

---

# 79. Summary Evidence Requirements

Future Summary projections should be capable of distinguishing, where applicable:

```text
Requested
Scheduled
Actual
Suppressed
Outstanding
Carry Forward
Overdue
Suspended
Released
Progress
Lifecycle State
Next Review
Applicable Policy
```

These do not all need to appear simultaneously.

Progressive disclosure is expected.

Summary should provide orientation first and provenance/details on demand.

---

# 80. Product Language Boundary

Architecture terminology should not leak unnecessarily into ordinary product copy.

Users should not need to understand terms such as:

```text
Demand materialization
Realization
Provenance
Authority
Policy revision
Released Interval
Tombstone
Immutable publication
```

Ordinary copy may instead say:

> Your planned time for this Goal has ended.

> This Goal still has 6 hours scheduled. Release that time?

> Past activity and schedule history will remain in your records.

> You asked DayFrame for 5 hours this week. 3 hours were scheduled.

The architecture remains rigorous underneath the simpler product language.

---

# 81. Goal Review Cadence and the Monthly Planning Rhythm

The default Monthly review cadence is not arbitrary.

DayFrame intentionally aligns:

```text
Calendar orientation
        ↓
Monthly Planner

Future Demand creation
        ↓
Monthly materialization horizon

Goal policy review
        ↓
Monthly default review cadence
```

This creates a recurring planning checkpoint.

The month becomes the point at which DayFrame asks:

> Are the assumptions we are carrying into the next planning horizon still valid?

It does not require the user to rebuild their schedule every month.

---

# 82. Global Policies Reduce Repetitive Decisions

The Policy layer exists because many lifecycle decisions repeat.

Without Global Policies, a user might be asked the same question dozens or hundreds of times.

Examples include:

- Should Found Time reduce Demand?
- What happens to recurring shortfall?
- How much Carry Forward is allowed?
- How should Ongoing Goals respond to constrained Capacity?
- Should future Goal blocks be released when a Goal is paused?
- What happens to Suspended Demand when a Goal resumes?
- How often should this Goal be reviewed?

Once the user establishes a durable preference, DayFrame should respect it until changed.

This is user-authored automation, not autonomous decision-making.

---

# 83. Global Policy Does Not Mean Global Authority

A Global Policy is still subordinate to more specific user authority.

Conceptually:

```text
User explicitly decides now
        ↓
Goal-specific override
        ↓
Goal-type Global Policy
        ↓
General Global Policy
        ↓
DayFrame default
```

This allows DayFrame to automate repetitive choices without taking those choices away from the user.

---

# 84. Policy Changes Are Prospective

Changing a Global Policy today does not rewrite yesterday.

Example:

```text
September:
Found Time Policy = Keep Requested Time

October:
User changes policy to Reduce Requested Time
```

September's Found Time remains governed by the September policy.

October's future applicable activity uses the new policy.

Historical policy provenance remains truthful.

---

# 85. Cancel/Delete and Immutable History

When cancelling or deleting a Goal with history, the user should be reminded that the past remains.

Conceptual confirmation:

```text
Delete Network+ Certification?

This Goal will be removed from your active Goals.
Its future requested and scheduled time will be released.

Past activity and schedule history will remain in your records.

[Delete Goal]
[Keep Goal]
```

The exact wording may change during UX work.

The semantic rule may not.

---

# 86. Completion, Pause, and Cancel Are Deliberately Different

These lifecycle actions have distinct meanings.

## Complete

```text
I am finished with the Goal.
```

Future Demand stops.

Future scheduled work may be retained or released according to user policy.

---

## Pause

```text
I still want this Goal, but not right now.
```

New Demand generation stops temporarily.

Outstanding Demand becomes Suspended.

Future scheduled work may be retained or released according to user policy.

---

## Cancel/Delete

```text
I no longer intend to pursue this Goal.
```

Future Goal authority ends.

Future Demand is retired.

Future unexecuted scheduled Goal work is released automatically.

History remains.

---

# 87. Continue and Edit Are Deliberately Different

At a finite lifecycle boundary:

## Continue

```text
Do this again.
```

Use the existing Goal identity and currently applicable policy to create the next Demand lifecycle.

## Edit

```text
Continue, but differently.
```

Create prospective policy amendments before future Demand is governed by the new configuration.

This distinction minimizes repetitive configuration while preserving explicit user control.

---

# 88. Demand Satisfaction Does Not Complete a Goal

Example:

```text
Network+ Goal

Requested:
20h

Actual:
20h
```

This does not imply:

```text
Goal:
Completed
```

The user may need more time.

Likewise:

```text
Progress:
10 / 10 Practice Exams
```

does not automatically imply completion.

DayFrame may make completion easy to choose.

It may not choose completion for the user.

---

# 89. Goal Completion Does Not Rewrite Demand

Suppose:

```text
Requested:
20h

Actual:
12h

User:
Complete Goal
```

The historical record remains:

```text
Requested:
20h

Actual:
12h

Resolution:
Completed by user
```

DayFrame must not rewrite Requested Time to 12 hours merely to make the numbers appear balanced.

The difference is meaningful historical evidence.

---

# 90. Goal Continuation Does Not Rewrite Demand

Suppose:

```text
Lifecycle A:
Requested 20h
Actual 17h

User:
Continue

Lifecycle B:
Requested 20h
```

DayFrame must preserve:

```text
A = 20h request
B = 20h request
```

It must not rewrite:

```text
A = 40h request
```

or create another synthetic authoritative request merely for display convenience.

---

# 91. Goal Editing Does Not Rewrite Demand

Suppose:

```text
Lifecycle A:
10 × 90-minute sessions
```

The user later edits the Goal to:

```text
Lifecycle B:
5 × 2-hour sessions
```

Lifecycle A remains historically:

```text
10 × 90-minute sessions
```

The new policy governs future Demand only.

---

# 92. User Logging Is Voluntary

DayFrame should make logging useful, not mandatory.

Users may choose to record:

- Actual Time;
- execution outcome;
- Progress;
- Activity Tags;
- Found Time.

If they do not log something, DayFrame preserves uncertainty.

It does not punish the user with fabricated failure states.

This keeps the product useful both for detailed self-trackers and users who primarily want planning assistance.

---

# 93. Activity Tags and Future Learning

Activity Tags may eventually provide useful evidence for learning.

For example, DayFrame might observe that a user frequently tags Goal activity:

```text
#PracticeExam
```

during certain kinds of sessions.

Such evidence may support future suggestions.

It does not automatically become preference authority.

The existing authority principle remains:

```text
History
→ Learned
→ Explicit Preference
```

Learned behavior is lower authority than explicit user preference.

---

# 94. Released Intervals and Future Live Adaptation

Released Intervals provide a clean bridge into future Live Adaptation.

Example:

```text
User completes Goal
        ↓
User/policy releases future Goal block
        ↓
Released Interval
        ↓
Live Capacity
        ↓
Live Opportunity
        ↓
Possible Proposal
        ↓
User decision
```

This architecture prevents Goal lifecycle actions from directly scheduling unrelated work.

The lifecycle system releases authority.

A later planning system decides what opportunities that release creates.

---

# 95. Architecture Boundaries

This specification does **not** redefine:

- Work ownership;
- First-Class Sleep;
- Commitment ownership;
- Capacity calculation;
- Proposal authority;
- Accepted Allocation authority;
- realization;
- publication;
- execution;
- HistoricalPlan;
- First-Class Progress history;
- Live Capacity;
- Live Opportunity;
- learning;
- external calendar integration.

It defines how Goal lifecycle behavior interacts with those existing or future systems.

---

# 96. Plan Vocabulary Is Separate

The word **Plan** currently appears in several DayFrame contexts.

This specification intentionally does not attempt to normalize Plan vocabulary.

Plan Vocabulary must be handled as a separate architecture/product-language concern.

Goal lifecycle semantics must remain valid regardless of the eventual user-facing terminology chosen for:

- planning;
- Review Plan;
- published plan;
- accepted planning;
- schedule.

---

# 97. End-State Compatibility Is Separate

This specification does not authorize retirement of existing compatibility surfaces.

Legacy Goal editors, historical reporting surfaces, compatibility adapters, or transitional read paths must not be removed merely because this specification defines the desired lifecycle.

End-state compatibility retirement requires separate parity and reachability analysis.

---

# 98. Persistence Principle

Future implementation should persist only authority that must survive reconstruction.

Derived projections should remain disposable where possible.

The architecture should avoid storing redundant mutable lifecycle state if the same truth can be deterministically derived from authoritative evidence.

However, explicit user decisions such as:

- Pause;
- Resume;
- Complete;
- Continue;
- Cancel;
- policy amendment;
- shortfall choice;

are durable authority and must not disappear merely because a projection is regenerated.

---

# 99. Historical Evidence Principle

DayFrame must eventually be capable of answering:

```text
What did the user ask for?
What did DayFrame propose?
What did the user accept?
What was scheduled?
What was published?
What did the user say actually happened?
What Progress did the user record?
Which policy governed the decision?
What later changed?
What time was released?
Why was it released?
```

Later lifecycle actions must not destroy the ability to answer those questions.

---

# 100. Canonical Goal Lifecycle Summary

The lifecycle can be summarized as:

```text
USER DEFINES GOAL
        ↓
Goal Policy
        ↓
Demand materializes within lawful horizon
        ↓
DayFrame evaluates Capacity
        ↓
Proposal
        ↓
User authorization
        ↓
Realization
        ↓
Scheduled Goal Time
        ↓
Publication where applicable
        ↓
User optionally logs Actual Time
        ↓
User optionally logs Progress / Activity Tags
        ↓
Demand cycle resolves
        ↓
Shortfall / Suppression / Carry Forward / Overdue as applicable
        ↓
Next Demand cycle or Goal lifecycle review
```

At any lawful point, the user may also:

```text
Edit
Pause
Resume
Complete
Cancel/Delete
```

Each action changes future authority without rewriting historical authority.

---

# 101. Canonical Goal Review Summary

For a finite Goal reaching its lifecycle boundary:

```text
Goal Lifecycle Ends
        ↓
Awaiting User Review
        ↓
┌────────────┬────────────┬────────────┐
│ Complete   │ Continue   │ Edit       │
└────────────┴────────────┴────────────┘
      │            │             │
      ▼            ▼             ▼
   Finished     Same Goal     Same Goal
   Future       New Demand    New prospective
   Demand       Lifecycle     policy
   Stops
```

---

# 102. Canonical Pause / Resume Summary

```text
Active Goal
     │
     │ Pause
     ▼
Paused Goal
     │
     ├── New Demand generation stops
     │
     ├── Outstanding Demand becomes Suspended
     │
     └── Future scheduled work:
     │       Keep / Release according to policy
     │
     │ Resume
     ▼
Resume Policy
     │
     ├── Outstanding + Normal
     ├── Discard Outstanding + Normal
     └── Outstanding First
     │
     ▼
Active Goal
```

History remains unchanged throughout.

---

# 103. Canonical Cancel/Delete Summary

```text
Cancel / Delete Goal
        ↓
Goal loses all future authority
        ↓
Future Demand retired
        ↓
Future unexecuted scheduled Goal work released
        ↓
Released Intervals created
        ↓
Goal disappears from active use
        ↓
Historical evidence remains immutable
```

---

# 104. Canonical Policy Summary

```text
Explicit user decision now
        ↓
Goal-specific policy
        ↓
Goal-type Global Policy
        ↓
General Global Policy
        ↓
DayFrame default / Ask me
```

Policies automate previously expressed user choices.

They do not create independent DayFrame authority.

---

# 105. Canonical Time Accounting Summary

```text
Requested
    ↓
What the user asked DayFrame to find

Scheduled
    ↓
What DayFrame reserved

Actual
    ↓
What the user says they actually used

Progress
    ↓
What the user says they accomplished
```

These layers remain independent.

---

# 106. Canonical Monthly Rhythm

For indefinite Goals:

```text
Natural Demand recurrence
        ↓
Daily / Weekly / etc.

Monthly Planner
        ↓
Bounds future Demand materialization

Monthly Goal Review
        ↓
Default checkpoint for reviewing Goal policy
```

The month bounds planning.

It does not replace the Goal's natural recurrence.

---

# 107. Non-Goals of V1

Goal Lifecycle V1 does not require:

- automatic accomplishment detection;
- AI-generated Progress;
- automatic Goal completion;
- infinite future Demand generation;
- automatic replacement of duplicate Goals;
- automatic supersession;
- automatic reassignment of Released Intervals;
- mandatory execution logging;
- mandatory Progress tracking;
- mandatory Activity Tags;
- biological or behavioral inference;
- cloud sync;
- external calendar ownership;
- autonomous replanning.

These may be evaluated separately where appropriate.

---

# 108. Future Implementation Requirements

A future implementation derived from this specification must preserve:

1. durable Goal identity;
2. durable Demand identity;
3. policy revision provenance;
4. deterministic monthly materialization;
5. idempotent recurrence generation;
6. Requested/Scheduled/Actual/Progress separation;
7. user-only completion;
8. prospective amendments;
9. immutable history;
10. explicit Pause/Resume;
11. explicit shortfall resolution;
12. bounded Carry Forward and Overdue;
13. Ongoing Capacity Response;
14. optional Progress;
15. Activity Tags as descriptive evidence;
16. Found Time provenance;
17. policy precedence;
18. periodic Goal review;
19. lawful future-time release;
20. Released Interval provenance;
21. G1 compatibility;
22. G2 provenance compatibility;
23. fail-closed protected evidence.

---

# 109. Architecture Acceptance Rules

An implementation must be rejected if it does any of the following:

- treats Scheduled Time as Actual Time;
- infers Progress from time;
- automatically completes Goals;
- rewrites historical Demand after Goal edits;
- merges distinct accepted iterations into synthetic authority;
- duplicates recurring Demand when the calendar horizon changes;
- treats Ongoing suppression as failure by default;
- allows unlimited Carry Forward or Overdue accumulation;
- silently selects a missing Shortfall Policy;
- treats Pause as ordinary shortfall;
- allows Cancelled Goals to retain future Demand;
- deletes historical evidence because a Goal was deleted from active use;
- rewrites publication when future scheduled time is released;
- automatically schedules something else into a Released Interval;
- treats similarity as Goal identity;
- allows a Global Policy to rewrite historical decisions;
- allows an LLM to make authoritative lifecycle decisions;
- treats protected evidence as absent evidence.

---

# 110. Canonical Architecture Decisions

Goal Lifecycle Architecture V1 establishes the following decisions:

1. DayFrame schedules time, not accomplishment.
2. Goal outcome remains independent from schedule geometry.
3. Only the user can complete a Goal.
4. Goals are One-Time, Recurring, or Ongoing.
5. Goal identity is durable across Demand lifecycles.
6. Materialized Demand has durable identity.
7. Sessions are scheduling geometry expressed in time.
8. Requested, Scheduled, Actual, and Progress are independent.
9. Actual Time requires user evidence.
10. Progress is optional and user-managed.
11. Activity Tags describe Actual Time without creating authority.
12. Found Time remains distinct from scheduled Goal work.
13. Found Time may optionally reduce Demand according to policy.
14. Compatible Found Time satisfies oldest Overdue Demand first by default.
15. Recurring shortfall supports Expire, Carry Forward, and Overdue.
16. Missing Shortfall Policy requires user resolution.
17. Carry Forward and Overdue default to a three-period accumulation ceiling.
18. The maximum configurable accumulation ceiling is ten periods.
19. Ongoing Goals support Flexible, Normal, and Preserve Target Capacity Response.
20. Ongoing suppression may move, split, shrink, or fully suppress Demand as lawful.
21. Suppression is not failure.
22. Monthly Planner bounds indefinite future Demand materialization.
23. Materialization does not change natural recurrence.
24. Demand Cycle Boundary and Goal Lifecycle Boundary are distinct.
25. Finite lifecycle review offers Complete, Continue, and Edit.
26. Continue means "do this again."
27. Edit means "continue under different terms."
28. Continue preserves Goal identity while creating new Demand.
29. Goal policy amendments are prospective.
30. Pause stops new Demand generation and suspends outstanding Demand.
31. Pause may release or retain future scheduled work according to policy.
32. Resume supports three canonical Suspended-Demand policies.
33. Complete may release or retain future scheduled work according to policy.
34. Cancel/Delete always terminates future Goal authority.
35. Cancel/Delete releases future Demand and future unexecuted Goal-owned scheduled time.
36. Historical evidence survives cancellation/deletion.
37. Released future scheduled time produces Released Interval evidence.
38. Released Intervals do not automatically create new schedule authority.
39. Global Planning Policies capture repeated user decisions.
40. Goal-specific policies override broader defaults.
41. Explicit decisions override policy defaults.
42. Policy changes are prospective.
43. Recurring and Ongoing Goals have configurable Goal Review Cadence.
44. The default Goal Review Cadence is Monthly.
45. Periodic review is non-blocking.
46. Monthly review aligns with the Monthly Planner and indefinite Demand materialization horizon.
47. Similarity may prompt a duplicate question but never establishes identity.
48. Publication remains immutable after future schedule release.
49. G1 and G2 evidence distinctions remain authoritative.
50. The past is immutable.

---

# 111. Final Governing Statement

The Goal Lifecycle architecture exists to let users pursue meaningful objectives without requiring DayFrame to pretend it understands what accomplishment means for them.

DayFrame's responsibility is narrower and more rigorous:

> **The user defines what matters.**

> **The user requests time.**

> **DayFrame determines what time is actually available.**

> **DayFrame helps allocate that time without violating higher-authority obligations.**

> **The user decides what they actually did.**

> **The user decides what they accomplished.**

> **The user decides when the Goal is complete.**

DayFrame preserves the evidence connecting those decisions without rewriting the past.

That separation allows Goal planning to remain deterministic, explainable, historically truthful, and compatible with future adaptation and learning without transferring human judgment to the scheduling engine.

---

**End of DayFrame Goal Lifecycle Architecture Specification V1**