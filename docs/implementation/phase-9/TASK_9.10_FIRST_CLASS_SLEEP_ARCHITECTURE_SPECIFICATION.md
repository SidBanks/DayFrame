# Task 9.10 — First-Class Sleep Architecture Specification

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Architecture specification / authority-model / domain-semantics task  
**Implementation Changes:** **PROHIBITED**  
**Primary Inputs:** Existing DayFrame architecture and governance documents; current production code and tests; Task 9.8C RESULT; Task 9.9 RESULT  
**Primary Product Question:** What is Sleep in DayFrame's authority model?  
**Required Durable Output:** `PHASE_9_TASK_9_10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION_RESULT.md`

---

## 1. Objective

Produce the canonical architecture specification for **Sleep as a first-class DayFrame planning concept**.

Dogfood Pass 02 and Tasks 9.8C/9.9 established that Sleep cannot safely remain an accidental collection of ordinary Commitment semantics plus placement special cases.

Task 9.9 corrected concrete geometry defects, including overnight custom-window placement across a canonical DayFrame boundary, without changing Sleep's authority model.

Task 9.10 must now answer the architectural question deliberately:

> **What is Sleep in DayFrame, what authority does it possess, and how must the rest of the planning system reason around it?**

The resulting specification must define:

- Sleep's canonical domain representation;
- Sleep's authored intent;
- Sleep's temporal ownership semantics;
- Sleep's relationship to Capacity;
- Sleep's relationship to Work;
- Sleep's relationship to Commitments;
- Sleep's relationship to Goal Demand and constructive planning;
- Sleep's relationship to realized Goal work;
- Sleep's relationship to support activities and protected buffers;
- Sleep's relationship to Friction;
- Sleep's relationship to Suggested Fix;
- Sleep omission semantics;
- Sleep's relationship to publication;
- Sleep's relationship to execution;
- Sleep's relationship to Progress and History;
- Sleep's relationship to canonical user-day boundaries;
- Sleep behavior across Work/cycle transitions;
- required persistence and migration implications;
- required deterministic invariants;
- implementation-alignment requirements for a later task.

This task must produce a **specification**, not implementation.

---

## 2. Governing Product Principle

The product principle established through dogfooding is:

> **Sleep is a first-class biological time requirement and must not be modeled merely as an ordinary flexible Commitment. Sleep participates in establishing schedulable Capacity alongside Work and other hard temporal constraints. A valid Sleep requirement must be realized whenever the authored temporal system is feasible. DayFrame boundaries, civil-date boundaries, cycle transitions, planning-window boundaries, and ordinary competing activities must not independently make Sleep unplaceable. When the authored system cannot satisfy the Sleep requirement, DayFrame must report the underlying feasibility conflict rather than treating Sleep as an unsuccessfully placed optional block.**

This principle is the starting requirement.

Task 9.10 must determine the architecture necessary to satisfy it.

Do not merely restate the principle.

Translate it into explicit domain semantics and invariants.

---

## 3. Governing Architecture

The specification must remain consistent with DayFrame's established architecture.

### 3.1 Product lifecycle

```text
Teach
  ↓
Plan
  ↓
Live
  ↓
Learn
```

### 3.2 Authority chain

```text
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
Execution / Progress
  ↓
History
  ↓
Learned
  ↓
Explicit Preference
```

Sleep must be placed deliberately within this authority chain.

Do not create an unexplained authority tier merely because Sleep is special.

---

## 4. Existing Architectural Invariants

The specification must preserve the established DayFrame invariants unless it explicitly identifies a genuine architectural conflict requiring a later governance decision.

At minimum:

1. Authored state is authoritative over derived state.
2. Derived state is reproducible and disposable.
3. Demand owns no time.
4. Capacity is deterministic and demand-neutral.
5. Allocation is provisional.
6. Proposal is non-authoritative.
7. Accepted Allocation is bounded accepted authority.
8. Realization creates schedule ownership.
9. Work owns time.
10. Commitments may own time according to their authority/mobility semantics.
11. Realized Goal work owns time.
12. Real support activities own time.
13. Buffers protect time but are not activities.
14. Friction means incompatibility.
15. Competition is not Friction.
16. Suggested Fix is corrective rather than constructive.
17. Suggested Fix requires explicit user decision before gaining authority.
18. Preview is disposable.
19. Publication is explicit.
20. Published Plan is immutable bounded truth.
21. Execution records what actually occurred.
22. Progress is distinct from execution evidence.
23. History is durable.
24. Canonical user-day ownership is distinct from civil-date geometry.
25. An interval may physically cross a DayFrame Day Boundary.
26. Stale derived state cannot become authority.
27. Direct actions may be valid without Proposal.
28. One semantic concept should have one canonical owner.

---

## 5. Evidence Standard

This task is an architecture specification grounded in repository reality.

Every claim about **current implementation** must be labeled:

### Confirmed

Directly demonstrated by production code, persistence behavior, production wiring, or applicable tests.

### Inferred

Strongly suggested but not conclusively established.

### Not Found

No supporting implementation was located after reasonable tracing.

Every statement about **future required architecture** must instead be labeled:

### Required

Necessary to satisfy an already established DayFrame invariant or the governing Sleep principle.

### Proposed

A recommended architectural choice among multiple viable designs.

### Deferred

A legitimate question that does not need resolution for first-class Sleep V1.

Do not blur:

```text
what DayFrame currently does
```

with:

```text
what this specification says DayFrame must do
```

---

## 6. Repository Audit Before Specification

Before defining the target model, trace the current implementation of Sleep.

At minimum inspect:

- authored Sleep defaults;
- Commitment representation;
- block templates;
- recurrence;
- candidate generation;
- placement;
- work-relative placement;
- custom-window placement;
- buffers;
- priority;
- Work interaction;
- manual Event interaction;
- realized Goal occupancy;
- Friction;
- Suggested Fix generation;
- omission;
- accepted decisions;
- regeneration/replay;
- Preview;
- Review;
- publication;
- Today;
- execution;
- Summary/history;
- persistence;
- backup/profile behavior.

Identify every current special case that recognizes Sleep by:

- ID;
- title;
- category;
- template type;
- recurrence;
- placement preference;
- hard-coded behavior;
- another discriminator.

The specification must not assume Sleep is currently architecturally first-class merely because some special-case behavior exists.

---

## 7. Required Current-State Sleep Map

Produce a current-state map:

```text
Authored Sleep
  ↓
Recurrence / Candidate
  ↓
Placement
  ↓
Schedule
  ↓
Friction
  ↓
Suggested Fix
  ↓
Decision
  ↓
Preview / Review
  ↓
Publication
  ↓
Today / Execution
  ↓
History
```

For every transition identify:

- semantic owner;
- input type;
- output type;
- authority level;
- persistence;
- tests;
- Sleep-specific behavior;
- ordinary-Commitment behavior inherited by Sleep.

This map must establish exactly where Sleep currently behaves as:

```text
ordinary Commitment
```

and where it behaves specially.

---

## 8. Core Architecture Question — What Is Sleep?

The specification must explicitly evaluate the following candidate representations.

### Option A — Ordinary Commitment with stronger defaults

Sleep remains a Commitment but receives:

- higher priority;
- different placement defaults;
- different Suggested Fix policy.

Evaluate whether this can actually satisfy the governing principle.

### Option B — Specialized Commitment

Sleep remains inside the Commitment domain but becomes an explicit subtype/specialization with distinct invariants.

Evaluate whether Commitment semantics are strong enough to represent required biological temporal ownership.

### Option C — Dedicated `SleepRequirement`

Sleep becomes a separate authored domain concept analogous in architectural importance to Work.

Example conceptual relationship:

```text
Work Requirement
+
Sleep Requirement
  ↓
Foundational Temporal Constraints
  ↓
Capacity
```

Do not assume this name is final.

Evaluate the semantics.

### Option D — General Temporal Requirement Primitive

Sleep becomes one specialization of a broader concept such as:

```text
TemporalRequirement
```

which could theoretically represent other foundational requirements later.

Do not introduce abstraction merely for hypothetical reuse.

Evaluate whether repository/domain evidence justifies it.

### Option E — Another architecture already latent in the codebase

If current architecture contains a more appropriate existing primitive, identify it.

---

## 9. Required Representation Decision

Task 9.10 must select **one canonical V1 representation**.

Do not finish with:

```text
Option B or C could work.
```

The RESULT must state:

> **For First-Class Sleep V1, Sleep SHALL be represented as ________.**

Then justify the decision against:

- authority;
- Capacity;
- persistence;
- placement;
- Friction;
- execution;
- historical representation;
- migration cost;
- conceptual clarity;
- future extensibility;
- risk of over-abstraction.

The selected representation becomes the canonical architecture for the later implementation task.

---

## 10. Sleep Authored Intent

Define what the user authors when they define Sleep.

The specification must distinguish authored requirement from derived scheduled occurrence.

At minimum evaluate whether authored Sleep needs:

```text
enabled
preferred duration
minimum acceptable duration
preferred window
earliest start
latest end
relationship to Work
applicable days/cycles
buffers / wind-down / wake-up protection
priority or authority
transition behavior
```

Do not automatically add all fields.

For each candidate field classify it:

```text
Required V1
Existing and Reused
Derived
Deferred
Rejected
```

### Important distinction

The user should not need to author schedule geometry that DayFrame can derive.

For example:

```text
I need 8 hours of Sleep before Work
```

is semantically different from forcing the user to author:

```text
Sleep 22:30–06:30 every Tuesday
```

The specification must define where intent ends and derivation begins.

---

## 11. Sleep Duration Semantics

Define V1 duration semantics.

Explicitly evaluate:

```text
preferred duration
minimum duration
exact duration
```

The architecture must answer:

- Is authored Sleep exact?
- Is it a target?
- May the engine shorten it?
- If shortening is allowed, who authorizes that?
- Does falling below minimum create Friction?
- Is minimum duration required in V1?
- Can different Work/cycle contexts produce different required durations?
- Does the engine ever infer a lower biological requirement?

The engine must not silently reinterpret a user-authored requirement merely to make the schedule fit.

---

## 12. Sleep Window Semantics

Define how Sleep windows work.

At minimum distinguish:

```text
preferred window
valid window
derived work-relative window
physical interval
canonical owner
```

The specification must answer:

- Can Sleep have a preferred but flexible start?
- Can Sleep be anchored before Work?
- Can Sleep be anchored after Work?
- Can Sleep be authored as an overnight clock window?
- Can Sleep span calendar midnight?
- Can Sleep span DayFrame Day Boundary?
- Can Sleep span cycle transitions?
- Can Sleep span planning-window boundaries?
- Which user-day owns the occurrence?
- How is owner identity determined?
- Can ownership differ from the civil date on which Sleep begins or ends?

Task 9.9 established that physical cross-boundary geometry is possible.

Do not regress to boundary containment.

---

## 13. Sleep and Capacity

This is a required architectural decision.

Task 9.10 must determine whether Sleep participates in Capacity as foundational temporal ownership.

Evaluate the intended model:

```text
Planning Horizon
  ↓
Physical Time
  -
Work
  -
Required Sleep
  -
Other Hard Ownership / Protection
  =
Schedulable Capacity
```

Determine:

- when Sleep is derived relative to Capacity;
- whether Capacity calculation requires Sleep realization first;
- whether Sleep occurrences are input to Capacity;
- whether Goal Demand can ever consume time that required Sleep needs;
- whether accepted Goal Allocation may make Sleep infeasible;
- whether existing Capacity interfaces can accept this without semantic distortion.

The governing expectation is:

> **Constructive Goal planning should reason about capacity remaining after foundational Sleep requirements, not schedule Goal work first and later discover that Sleep no longer fits.**

If the existing Capacity architecture cannot support this cleanly, identify the required interface change.

---

## 14. Sleep and Work

Define the relationship between Work and Sleep.

Both are foundational constraints, but their authority is not necessarily identical.

The specification must explicitly address:

### 14.1 Feasible system

If authored Work and Sleep can both be satisfied:

```text
both SHALL be satisfied
```

Ordinary flexible content must adapt around them.

### 14.2 Infeasible Work/Sleep system

If Work geometry makes the authored Sleep requirement impossible, DayFrame must not silently:

- omit Sleep;
- shorten Sleep below required minimum;
- move Work;
- fabricate capacity.

Instead, the system must expose the actual incompatibility.

Define the correct domain representation for that condition.

Determine whether it is:

```text
Friction
Feasibility failure
Temporal Requirement conflict
another existing concept
```

and why.

### 14.3 Work movement

Unless Work is explicitly authored as movable in some future model, Sleep must not automatically move Work.

Do not invent Work flexibility in this task.

---

## 15. Sleep and Ordinary Commitments

Define relative authority.

The specification must answer:

- Can an ordinary movable Commitment displace required Sleep?
- Can a locked Commitment make Sleep infeasible?
- What happens when an existing fixed Commitment conflicts with Sleep?
- Does Sleep move around an anchored Commitment?
- Does the Commitment create Friction?
- Which object is identified as movable?
- Can Suggested Fix move the Commitment rather than Sleep?
- When may Sleep itself move within its valid window?

The likely architecture must distinguish:

```text
Sleep may be temporally flexible
```

from:

```text
Sleep is optional
```

These are not equivalent.

---

## 16. Sleep and Goal Planning

Define how Sleep interacts with:

```text
Goal Demand
Capacity
Feasibility
Competition
Allocation
Proposal
Accepted Allocation
Realization
```

Required questions:

1. Does Sleep subtract from Capacity before Goal feasibility?
2. Can a Proposal contain geometry that conflicts with required Sleep?
3. Can accepted allocation reserve time needed for Sleep?
4. What if Sleep requirements change after Proposal generation?
5. What if Sleep requirements change after Proposal acceptance but before Realization?
6. What if Sleep requirements change after Realization?
7. What becomes stale?
8. What must be regenerated?
9. What authority survives?
10. Does accepted Goal authority ever outrank a newly authored Sleep requirement?

Do not weaken accepted authority casually.

Define the invalidation/review path explicitly.

---

## 17. Sleep and Realized Goal Work

Realized Goal work owns schedule time.

Sleep may also become foundational ownership.

The specification must define what happens when they conflict because authored truth changes after realization.

Possible example:

```text
Goal work realized at 23:00–00:30
  ↓
user changes Work Pattern
  ↓
required Sleep now needs 22:30–06:30
```

The engine must not silently delete either authority.

Determine:

- whether this becomes Friction;
- whether the Goal work becomes movable;
- whether Sleep may move within its valid window;
- whether Suggested Fix may move realized Goal work;
- whether accepted allocation remains valid;
- whether re-realization is required;
- whether publication must be blocked until resolved.

---

## 18. Sleep and Support Activities / Buffers

Define how Sleep interacts with:

```text
real support activity
protected buffer
```

Preserve:

> **Support activity is an activity. Protected buffer is protection, not activity.**

Determine whether Sleep may displace either.

If resource footprints are associated with accepted Goal work, determine whether the entire footprint competes with required Sleep.

Do not silently discard resource footprint components to make Sleep fit.

---

## 19. Sleep and Friction

Define when Sleep creates or participates in Friction.

Examples requiring explicit classification:

```text
Work + Sleep cannot both fit
fixed Commitment overlaps required Sleep
realized Goal work overlaps newly authored Sleep requirement
Sleep crosses Day Boundary
Sleep crosses midnight
Sleep crosses cycle transition
Sleep cannot fit because only ordinary movable Commitments occupy the window
Sleep cannot fit because Goal Proposal would consume the window
```

Not all of these are Friction.

For each, specify whether the condition should be:

```text
valid
placement problem
constructive feasibility issue
Friction
stale derived state
invalid authored configuration
```

Crossing a Day Boundary alone must not be classified as Friction.

---

## 20. Sleep and Suggested Fix

Task 9.8C established that the current system can offer:

```text
Omit Sleep
```

as a Suggested Fix.

The specification must determine whether this is permissible under first-class Sleep semantics.

### Governing distinction

There is a fundamental difference between:

```text
planning-time decision:
"Do not schedule the required Sleep"
```

and:

```text
execution evidence:
"I did not actually sleep"
```

The latter is legitimate historical truth.

The former may violate the planning requirement.

Task 9.10 must explicitly define:

- whether `Omit Sleep` remains a legal planning Suggested Fix;
- whether omission requires a special explicit user override;
- whether omission should instead be impossible in ordinary corrective planning;
- whether shortening Sleep can be suggested;
- whether moving Sleep is permitted;
- whether moving competing lower-authority content should be preferred;
- whether an infeasible Work/Sleep system may offer acknowledgement rather than omission.

Do not leave this ambiguous.

---

## 21. Sleep Override Semantics

If the architecture permits a user to intentionally override their authored Sleep requirement, define the authority explicitly.

Possible distinction:

```text
Authored Sleep Requirement
  ↓
Explicit One-Off Sleep Override
```

An override must not silently mutate the underlying authored requirement unless the user explicitly edits that requirement.

Determine whether V1 needs such an override.

If yes, specify:

- scope;
- identity;
- persistence;
- expiration;
- replay;
- history;
- publication representation.

If no, state that explicitly and defer it.

---

## 22. Sleep and Publication

Define publication rules.

A Published Plan represents explicit bounded plan truth.

The specification must answer:

- Must all required Sleep occurrences be realized before publication?
- Can a plan publish with unresolved Sleep Friction?
- Can a plan publish with an explicit Sleep override?
- How is Sleep represented in the published snapshot?
- Does publication preserve the authored requirement, realized occurrence, or both?
- Does published Sleep become immutable plan truth for that publication?
- If Sleep changes later, does it affect historical publication?
- How does a new publication supersede future/current planned Sleep without rewriting history?

Publication must not silently legitimize an invalid Sleep omission.

---

## 23. Sleep and Today

Define how planned Sleep should appear in the future Day Worksurface / Today context.

This task must not redesign Today.

It must specify the semantic information Today needs.

At minimum:

```text
planned Sleep occurrence
planned duration
relationship to canonical day
published versus generated provenance
whether overridden
whether affected by unresolved Friction
```

Do not expose unnecessary internal architecture terminology.

---

## 24. Sleep and Execution

Execution must record what actually happened, not what the plan wished had happened.

The specification must distinguish:

```text
planned Sleep
actual Sleep
```

Examples:

```text
planned 8h / slept 8h
planned 8h / slept 6h
planned 8h / slept 0h
slept outside planned interval
unplanned additional Sleep
```

Determine the minimum V1 execution semantics necessary to preserve truthful history.

Do not turn Task 9.10 into a health-tracking architecture.

The question is schedule execution evidence, not medical sleep analysis.

---

## 25. Sleep and Progress

Determine whether Sleep belongs in the existing Goal Progress system.

The default architectural expectation should be examined carefully.

Sleep may have:

```text
execution evidence
```

without being:

```text
Goal Progress
```

unless the user explicitly creates a Goal whose measurement relates to Sleep.

Do not automatically convert Sleep duration into Goal Progress.

Preserve separation between:

```text
schedule execution
biological requirement
goal measurement
```

---

## 26. Sleep and History

Define what durable historical evidence must survive.

At minimum distinguish:

```text
Authored Sleep Requirement at planning time
Published Sleep Plan
Actual Sleep Execution
Explicit Sleep Override
Accepted corrective decision involving Sleep
```

Determine which belong in:

- current authored state;
- Published Plan;
- execution history;
- decision provenance;
- Summary.

History must preserve what happened without retroactively rewriting earlier plan truth when the user later edits their Sleep requirement.

---

## 27. Sleep and Learning

DayFrame's broader lifecycle includes Learn.

Task 9.10 must define the authority limit for future learned Sleep behavior.

A learned pattern may eventually observe:

```text
user routinely sleeps later
user routinely sleeps less
user routinely moves Sleep after a certain shift
```

But:

> **Observed behavior must not silently lower an explicit Sleep requirement.**

Define the V1 architecture rule even if learning implementation remains deferred.

At minimum:

```text
learned Sleep pattern
<
explicit authored Sleep requirement
```

Any learned recommendation must require explicit user acceptance before changing authored preference.

---

## 28. Cycle and Shift Transition Semantics

Sleep frequently spans the most difficult DayFrame transitions.

Define deterministic ownership and derivation for:

```text
Day Shift → Evening Shift
Evening Shift → Night Shift
Night Shift → Day Shift
Work day → off day
off day → Work day
cycle A → cycle B
segment preference boundary changes
week-start changes
Day Boundary changes
```

The specification must determine which context owns a Sleep occurrence.

Potential ownership anchors include:

```text
Sleep start
Sleep end
following Work occurrence
preceding Work occurrence
canonical user-day
derived requirement occurrence
```

Choose one deterministic rule or a clearly defined rule set.

Do not leave ownership dependent on UI grouping.

---

## 29. Planning Horizon Edge Semantics

Sleep may physically extend beyond a requested planning or publication range.

Define how the system handles:

```text
Sleep begins inside horizon and ends outside
Sleep begins before horizon and ends inside
Sleep owned by first/last user-day but physically spills outside
```

Preserve the distinction among:

```text
Planning Data Horizon
Proposal Horizon
Review Scope
Preview Range
Publication Range
Calendar Navigation
```

Do not truncate Sleep merely to make it fit a requested view.

---

## 30. Sleep Identity

Define stable identity requirements.

A Sleep occurrence must remain recognizable through:

```text
generation
Friction
Suggested Fix
decision
regeneration
publication
execution
history
```

Determine what constitutes its semantic occurrence identity.

Identity must not depend solely on generated geometry if geometry is allowed to move.

Consider:

```text
authored Sleep requirement ID
canonical occurrence owner
cycle/segment context
source incarnation
```

Use existing durable-occurrence patterns where appropriate.

Do not create an unrelated identity system if DayFrame already has a canonical one.

---

## 31. Persistence Model

Determine exactly what first-class Sleep V1 requires to persist.

Classify each candidate as:

```text
Authored + Persisted
Accepted + Persisted
Derived + Disposable
Published + Immutable
Execution + Historical
```

At minimum assess:

- Sleep requirement;
- Sleep occurrence;
- derived placement;
- Sleep Friction;
- Suggested Fix;
- accepted Sleep override/decision;
- published Sleep;
- actual Sleep execution.

Determine whether the existing persistence schema can represent the selected architecture.

If a schema migration will be required, specify it conceptually.

Do not implement it.

---

## 32. Existing Data Migration

Current DayFrame profiles may already contain Sleep as an ordinary Commitment/template.

The specification must define how a future implementation should recognize existing Sleep data.

Determine:

- whether existing default Sleep has a stable identifier;
- whether user-created Sleep-like Commitments are distinguishable;
- whether migration can safely identify canonical Sleep;
- whether ambiguous user data must remain ordinary Commitment data;
- whether migration requires explicit user confirmation;
- whether profile/backup versions must change;
- whether old Published Plans remain interpreted under historical semantics.

Do not assume every Commitment titled `Sleep` should automatically become first-class Sleep.

Migration must be deterministic and conservative.

---

## 33. Compatibility with Existing Commitment Architecture

First-class Sleep must not require ordinary Commitment behavior to become more complex than necessary.

Identify which existing primitives can be reused:

- recurrence;
- temporal windows;
- durable occurrence identity;
- physical occupancy;
- user-day ownership;
- placement;
- execution evidence;
- publication representation.

Identify which Commitment semantics must **not** be inherited.

Potential examples:

```text
optional placement
ordinary priority competition
generic omission
ordinary Suggested Fix behavior
ordinary unplaced semantics
```

The RESULT must explicitly identify:

```text
Reuse
Specialize
Replace
Do Not Inherit
```

---

## 34. Compatibility with Capacity Architecture

Audit the existing Capacity semantic owner.

Determine the minimal architecture change needed for Capacity to account for required Sleep.

Do not create:

```text
Sleep Capacity
```

as a second unrelated capacity system.

The canonical model should remain one deterministic understanding of schedulable time.

Specify whether Capacity should consume:

```text
derived required Sleep intervals
```

or another canonical representation.

Explain how circular dependency is avoided.

For example, the architecture must not become:

```text
Need Capacity to place Sleep
Need Sleep placement to calculate Capacity
```

without a deterministic resolution order.

---

## 35. Deterministic Planning Order

Define the required semantic order for temporal planning.

Evaluate a model such as:

```text
1. Resolve authored temporal context
2. Generate immutable/foundational Work
3. Derive required Sleep
4. Establish foundational physical occupancy
5. Establish remaining Capacity
6. Place ordinary Commitments
7. Evaluate Goal Demand
8. Allocate / Propose
9. Accept
10. Realize
11. Detect resulting Friction
12. Review
13. Publish
```

Do not adopt this exact sequence merely because it is written here.

Trace existing architecture and specify the correct canonical order.

The RESULT must provide one explicit deterministic order.

---

## 36. Feasibility Versus Placement

A central architectural question is whether Sleep should first be treated as:

```text
a feasibility requirement
```

before:

```text
a placement candidate
```

Evaluate this explicitly.

The specification must prevent a misleading outcome where:

```text
Sleep failed to place
```

really means:

```text
the authored temporal system cannot satisfy its required Sleep constraint
```

If Sleep is required, the architecture should expose the underlying feasibility state rather than making required Sleep look like an optional task that lost a competition.

---

## 37. Required Sleep State Machine

Produce a canonical V1 state model.

At minimum evaluate states equivalent to:

```text
Authored
Derived
Scheduled
Conflicted
Overridden
Published
Executed
Historical
```

Use existing DayFrame vocabulary where possible.

The state model must distinguish:

```text
required Sleep has not yet been derived
```

from:

```text
required Sleep is infeasible
```

from:

```text
user explicitly overrode Sleep
```

from:

```text
user simply did not sleep as planned
```

These must not collapse into one `skipped` state.

---

## 38. Required Sleep Authority Matrix

Produce:

| Competing Object | Can Move Sleep? | Can Sleep Move It? | Can Conflict Remain? | Resolution Authority | Notes |
|---|---:|---:|---:|---|---|
| Work | | | | | |
| Locked Commitment | | | | | |
| Flexible Commitment | | | | | |
| Manual Event | | | | | |
| Goal Demand | | | | | |
| Proposal | | | | | |
| Accepted Allocation | | | | | |
| Realized Goal Work | | | | | |
| Support Activity | | | | | |
| Protected Buffer | | | | | |

Populate from the selected architecture.

Do not leave cells ambiguous.

---

## 39. Required Capacity Matrix

Produce:

| Temporal Object | Owns Time? | Protects Time? | Subtracts From Capacity? | May Be Moved? | Authority Source |
|---|---:|---:|---:|---:|---|
| Work | | | | | |
| Required Sleep | | | | | |
| Ordinary Commitment | | | | | |
| Manual Event | | | | | |
| Goal Demand | | | | | |
| Proposal | | | | | |
| Accepted Allocation | | | | | |
| Realized Goal Work | | | | | |
| Support Activity | | | | | |
| Protected Buffer | | | | | |

This matrix must be consistent with the existing DayFrame Capacity architecture.

---

## 40. Required Lifecycle Matrix

Produce:

| Lifecycle Stage | Sleep Representation | Authority | Persisted? | Derived From | Consumed By | Invalidated By |
|---|---|---|---:|---|---|---|
| Authored | | | | | | |
| Derived | | | | | | |
| Scheduled | | | | | | |
| Review | | | | | | |
| Published | | | | | | |
| Execution | | | | | | |
| History | | | | | | |
| Learned | | | | | | |

---

## 41. Required Friction Matrix

Produce at minimum:

| Scenario | Valid Geometry? | Feasibility Problem? | Friction? | Suggested Fix Allowed? | Publication Blocker? |
|---|---:|---:|---:|---:|---:|
| Sleep crosses midnight | | | | | |
| Sleep crosses Day Boundary | | | | | |
| Sleep crosses cycle transition | | | | | |
| Flexible Commitment occupies Sleep window | | | | | |
| Locked Commitment conflicts with Sleep | | | | | |
| Work makes Sleep requirement impossible | | | | | |
| Goal Proposal would consume Sleep capacity | | | | | |
| Realized Goal work conflicts after Sleep edit | | | | | |
| User explicitly overrides Sleep | | | | | |
| User later reports no actual Sleep | | | | | |

---

## 42. Required Suggested Fix Matrix

Produce:

| Suggested Action | Ordinary Sleep Friction | Work/Sleep Infeasibility | Post-Realization Conflict | Allowed V1? | Authority Required |
|---|---:|---:|---:|---:|---|
| Move Sleep within valid window | | | | | |
| Move flexible Commitment | | | | | |
| Move realized Goal work | | | | | |
| Remove Goal work | | | | | |
| Shorten Sleep | | | | | |
| Omit Sleep | | | | | |
| Acknowledge unresolved conflict | | | | | |
| Edit authored Sleep requirement | | | | | |
| Edit Work Pattern | | | | | |

The architecture must make explicit whether `Omit Sleep` survives as an ordinary Suggested Fix.

---

## 43. Required Current-vs-Target Gap Matrix

Produce:

| Concern | Current Architecture | Target First-Class Sleep V1 | Gap Type | Implementation Consequence |
|---|---|---|---|---|
| Domain identity | | | | |
| Authored state | | | | |
| Placement | | | | |
| Capacity | | | | |
| Work interaction | | | | |
| Commitment interaction | | | | |
| Goal planning | | | | |
| Friction | | | | |
| Suggested Fix | | | | |
| Publication | | | | |
| Execution | | | | |
| History | | | | |
| Persistence | | | | |
| Migration | | | | |

Gap Type should use terms such as:

```text
Reuse
Extension
Semantic Change
New Domain Primitive
Migration
UI Exposure
No Change
Deferred
```

---

## 44. Required Behavioral Invariants

The RESULT must define a numbered canonical set of **First-Class Sleep V1 invariants**.

At minimum the final specification must resolve invariants equivalent to:

1. Sleep has explicit semantic identity.
2. Authored Sleep requirement is distinct from derived Sleep occurrence.
3. Required Sleep is not ordinary optional flexible content.
4. Sleep may be temporally flexible without being optional.
5. Valid Sleep may cross civil midnight.
6. Valid Sleep may cross a canonical DayFrame boundary.
7. Boundary crossing alone does not create Friction.
8. Sleep occurrence ownership is deterministic.
9. Required Sleep participates in schedulable Capacity.
10. Goal Demand does not consume required Sleep capacity.
11. Proposal does not displace required Sleep.
12. Lower-authority flexible Commitments adapt around required Sleep.
13. Work/Sleep infeasibility is surfaced explicitly.
14. The engine does not silently shorten required Sleep.
15. The engine does not silently omit required Sleep.
16. Any explicit Sleep override has bounded authority.
17. A Sleep override does not silently mutate the authored requirement.
18. Planned Sleep and actual Sleep remain distinct.
19. Failure to execute planned Sleep remains valid historical evidence.
20. Historical execution does not retroactively invalidate the Published Plan.
21. Learned behavior cannot silently weaken explicit Sleep requirements.
22. Stale Sleep derivation cannot acquire authority.
23. Publication cannot silently legitimize unresolved required-Sleep infeasibility.
24. Existing historical plans retain their original historical semantics.
25. Sleep-specific architecture must reuse canonical physical occupancy and user-day semantics rather than creating parallel geometry.

These are candidate formulations.

The RESULT must refine them into the canonical set.

---

## 45. Required Domain Model Specification

Provide concrete conceptual types for the selected architecture.

Use repository naming conventions where practical.

For example only:

```ts
type SleepRequirementV1 = {
  id: string;
  enabled: boolean;
  durationMinutes: number;
  preferredWindow: ...;
  ...
};
```

Do not treat this example as the required design.

The specification must define conceptual types for all new or changed semantic objects necessary for V1.

For each field state:

- meaning;
- authority;
- required/optional;
- persistence;
- validation;
- invalidation behavior.

This is specification pseudocode only.

Do not modify production code.

---

## 46. Required Command / Query Specification

Identify the commands and queries that a later implementation will require.

At minimum evaluate whether V1 needs canonical operations equivalent to:

```text
author/update Sleep requirement
derive Sleep occurrences
query effective Sleep requirement
query Sleep feasibility
query scheduled Sleep
resolve Sleep Friction
record Sleep execution
query historical Sleep evidence
```

Reuse existing commands/queries where semantics already fit.

Do not create duplicate APIs merely to make Sleep look special.

For every proposed new command/query identify:

- input;
- output;
- authority;
- side effects;
- idempotence;
- persistence behavior.

---

## 47. Required Invalidation Rules

Specify what becomes stale when the user changes:

- Sleep requirement;
- Work Pattern;
- cycle;
- segment;
- Day Boundary;
- week start where relevant;
- fixed Commitment;
- accepted Goal allocation;
- realized Goal work;
- manual Event.

At minimum evaluate:

```text
Sleep derivation
Capacity
Feasibility
Proposal
Preview
Review readiness
publication readiness
```

Do not automatically invalidate historical publication.

Historical truth must remain historical truth.

---

## 48. Required Publication Rules

The RESULT must give explicit V1 publication rules.

At minimum:

```text
Required Sleep satisfied
Required Sleep conflicted
Required Sleep explicitly overridden
Sleep derivation stale
Sleep occurrence outside publication range but physically overlapping it
Sleep occurrence owned inside range but ending outside it
```

For each state specify whether publication is:

```text
Allowed
Blocked
Allowed with explicit accepted override
Not Applicable
```

No ambiguous `depends` without a deterministic rule.

---

## 49. Required Execution / History Rules

Define how execution evidence relates to planned Sleep.

At minimum specify semantics for:

```text
Completed as planned
Completed with different duration
Completed at different time
Partially completed
Not completed
Unplanned Sleep
Unknown / not reported
```

Do not require health-device integration.

The architecture must support truthful manual execution evidence.

Determine whether execution should reference:

- published Sleep occurrence;
- generated Sleep occurrence;
- Sleep requirement occurrence;
- another stable identity.

---

## 50. Migration Assessment

The RESULT must determine whether implementation requires changes to:

```text
authored state schema
backup schema
profile schema
Preview result
publication schema
execution schema
history schema
decision schema
```

For each classify:

```text
No Change
Additive Change
Versioned Migration Required
Compatibility Adapter Required
Deferred
```

Do not implement migrations.

---

## 51. Existing-Test Impact Assessment

Identify existing tests whose assumptions would become invalid under first-class Sleep semantics.

At minimum search for tests involving:

- default Sleep template;
- Sleep as Commitment;
- Sleep priority;
- unplaced Sleep;
- omitted Sleep;
- Suggested Fix `Omit Sleep`;
- beforeWork Sleep;
- custom Sleep windows;
- Day Boundary;
- cycle transitions;
- publication;
- execution;
- persistence/backup/profile.

Classify each affected family:

```text
Still Valid
Must Be Extended
Semantics Will Change
Should Be Retired
Migration Coverage Needed
```

Do not modify tests.

---

## 52. Implementation Sequencing Specification

The RESULT must propose the minimum safe implementation sequence after Task 9.10.

The sequence must be dependency-driven.

For example, evaluate whether implementation should proceed through bounded steps such as:

```text
domain identity
→ persistence/migration
→ derivation
→ Capacity
→ placement
→ Friction/Suggested Fix
→ publication
→ execution/history
→ product exposure
```

Do not automatically use this example ordering.

Produce the actual evidence-based sequence.

The sequence must identify where a publication checkpoint should occur before Planner/Summary migration begins.

---

## 53. Planner / Summary Migration Boundary

Task 9.10 must explicitly state which Sleep capabilities must exist before the future Planner/Summary shell migration begins.

Classify implementation requirements as:

### A. Must Exist Before Shell Migration

Behavior whose absence would force the new UI to encode incorrect semantics.

### B. Can Be Implemented During Shell Migration

Presentation/reachability behavior that does not alter core authority.

### C. Can Be Deferred After Shell Migration

Nonessential V1 extensions.

This is critical.

The future shell must not become the semantic owner of Sleep.

---

## 54. Prohibited Changes

Do **not**:

- modify production code;
- modify tests;
- change persistence;
- change schemas;
- create migrations;
- change seeded Sleep;
- change Commitment semantics;
- change Capacity;
- change placement;
- change Friction;
- change Suggested Fix behavior;
- remove `Omit Sleep`;
- add Sleep overrides;
- change publication;
- change execution;
- change Summary;
- change Planner;
- change Today;
- change navigation;
- add dependencies;
- perform unrelated formatting;
- commit;
- push.

Only the required durable specification RESULT artifact may be created.

---

## 55. Validation

Because this is an architecture task, validation means evidence completeness rather than implementation validation.

At minimum:

1. inspect repository status;
2. preserve all pre-existing changes;
3. inspect current architecture/governance documents;
4. inspect Task 9.8C RESULT;
5. inspect Task 9.9 RESULT;
6. trace current Sleep implementation;
7. trace current Capacity implementation;
8. trace Friction/Suggested Fix behavior;
9. trace publication;
10. trace execution/history;
11. inspect relevant tests;
12. run tests only where useful to verify current behavior;
13. do not modify code to manufacture evidence;
14. inspect final diff;
15. confirm only the RESULT artifact was created by Task 9.10;
16. run `git diff --check`.

Record exact validation/evidence commands in the RESULT.

---

## 56. Required RESULT Artifact

Create:

```text
PHASE_9_TASK_9_10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION_RESULT.md
```

Place it in the existing Phase 9 durable result-artifact folder.

Discover and follow the existing repository convention.

The filename must contain:

```text
RESULT
```

No additional durable repository artifact is authorized.

---

## 57. Required RESULT Structure

The RESULT must contain these sections in this exact order:

```text
# Task 9.10 — First-Class Sleep Architecture Specification RESULT

## 1. Executive Decision

## 2. Evidence Standard and Repository Scope

## 3. Current-State Sleep Architecture

## 4. Current Sleep Lifecycle Map

## 5. Current Sleep Authority Assessment

## 6. Representation Alternatives

## 7. Canonical First-Class Sleep V1 Representation

## 8. Sleep Authored Intent

## 9. Sleep Duration Semantics

## 10. Sleep Window and Ownership Semantics

## 11. Sleep and Capacity

## 12. Sleep and Work

## 13. Sleep and Ordinary Commitments

## 14. Sleep and Goal Planning

## 15. Sleep and Realized Goal Work

## 16. Sleep and Support Activities / Buffers

## 17. Sleep and Friction

## 18. Sleep and Suggested Fix

## 19. Sleep Override Semantics

## 20. Sleep and Publication

## 21. Sleep and Today

## 22. Sleep and Execution

## 23. Sleep and Progress

## 24. Sleep and History

## 25. Sleep and Learning

## 26. Cycle / Shift Transition Semantics

## 27. Planning-Horizon Edge Semantics

## 28. Sleep Identity

## 29. Persistence Model

## 30. Existing-Data Migration

## 31. Commitment Architecture Compatibility

## 32. Capacity Architecture Compatibility

## 33. Deterministic Planning Order

## 34. Feasibility Versus Placement

## 35. Sleep State Machine

## 36. Sleep Authority Matrix

## 37. Capacity Matrix

## 38. Lifecycle Matrix

## 39. Friction Matrix

## 40. Suggested Fix Matrix

## 41. Current-vs-Target Gap Matrix

## 42. Canonical First-Class Sleep V1 Invariants

## 43. Domain Model Specification

## 44. Command / Query Specification

## 45. Invalidation Rules

## 46. Publication Rules

## 47. Execution / History Rules

## 48. Migration Assessment

## 49. Existing-Test Impact Assessment

## 50. Implementation Sequencing

## 51. Planner / Summary Migration Boundary

## 52. Open Questions / Deferred V2 Concerns

## 53. Validation Record

## 54. Completion Assessment
```

---

## 58. Completion Criteria

Task 9.10 is complete only when all of the following are true:

### Current architecture

- [ ] Current Sleep representation has been traced.
- [ ] Current Sleep special cases have been identified.
- [ ] Current ordinary-Commitment semantics inherited by Sleep have been identified.
- [ ] Current Sleep persistence has been traced.
- [ ] Current Sleep placement has been traced.
- [ ] Current Sleep Friction/Suggested Fix behavior has been traced.
- [ ] Current publication/execution/history treatment has been traced.

### Representation

- [ ] Ordinary Commitment has been evaluated as an option.
- [ ] Specialized Commitment has been evaluated.
- [ ] Dedicated SleepRequirement has been evaluated.
- [ ] General temporal-requirement abstraction has been evaluated.
- [ ] Existing latent primitives have been considered.
- [ ] One canonical V1 representation has been selected.
- [ ] The selection is justified against repository reality and architectural invariants.

### Authority

- [ ] Sleep's authority relative to Work is explicit.
- [ ] Sleep's authority relative to locked Commitments is explicit.
- [ ] Sleep's authority relative to flexible Commitments is explicit.
- [ ] Sleep's authority relative to Goal Demand is explicit.
- [ ] Sleep's authority relative to Proposal is explicit.
- [ ] Sleep's authority relative to Accepted Allocation is explicit.
- [ ] Sleep's authority relative to realized Goal work is explicit.
- [ ] Sleep's authority relative to support activity is explicit.
- [ ] Sleep's authority relative to protected buffers is explicit.

### Capacity

- [ ] Sleep's role in Capacity is explicit.
- [ ] Circular dependency between Sleep placement and Capacity has been resolved.
- [ ] Constructive planning cannot consume required Sleep capacity.
- [ ] deterministic planning order is specified.

### Geometry

- [ ] civil-midnight crossing semantics are explicit.
- [ ] Day Boundary crossing semantics are explicit.
- [ ] cycle-transition semantics are explicit.
- [ ] planning-horizon spill semantics are explicit.
- [ ] canonical occurrence ownership is deterministic.

### Friction / correction

- [ ] Work/Sleep infeasibility has a defined representation.
- [ ] fixed-Commitment/Sleep conflict semantics are defined.
- [ ] lower-authority movable-content/Sleep behavior is defined.
- [ ] realized-Goal/Sleep conflict behavior is defined.
- [ ] `Omit Sleep` semantics are explicitly decided.
- [ ] shortening Sleep semantics are explicitly decided.
- [ ] any override semantics are explicitly decided.

### Publication / execution / history

- [ ] publication requirements for Sleep are explicit.
- [ ] planned versus actual Sleep is explicit.
- [ ] non-execution of Sleep can be recorded truthfully.
- [ ] historical plan truth remains immutable.
- [ ] later Sleep edits do not rewrite history.
- [ ] learned behavior cannot silently weaken explicit authored requirements.

### Data / migration

- [ ] conceptual domain model is specified.
- [ ] persistence requirements are specified.
- [ ] migration requirements are specified.
- [ ] ambiguous legacy `Sleep` Commitments are handled conservatively.
- [ ] affected schema families are identified.
- [ ] existing-test impact is assessed.

### Implementation boundary

- [ ] implementation sequence is specified.
- [ ] pre-shell-migration requirements are explicit.
- [ ] shell-migration-time requirements are explicit.
- [ ] post-migration deferrals are explicit.
- [ ] no production implementation changes were made.
- [ ] no tests were modified.
- [ ] no schemas were modified.
- [ ] only the required RESULT artifact was created.
- [ ] validation record is complete.
- [ ] `git diff --check` passes.

---

## 59. Final Completion Statement

If and only if every required architectural question is resolved sufficiently for implementation, end the RESULT with exactly:

```text
Task 9.10 — First-Class Sleep Architecture Specification is COMPLETE.
```

If any architectural question required for implementation remains unresolved, end with exactly:

```text
Task 9.10 — First-Class Sleep Architecture Specification is INCOMPLETE.
```

Then immediately identify the unresolved architectural blockers.

Do not mark the specification complete merely because the current implementation has been documented.

The task is complete only when the implementation team can proceed without inventing Sleep authority semantics during coding.

---

## 60. Governing Principle

Sleep is not merely another thing DayFrame should try to fit onto a calendar.

It is part of the temporal reality from which a usable schedule must be constructed.

DayFrame should not ask:

```text
After everything else has been scheduled,
is there somewhere Sleep can fit?
```

The architecture must instead allow DayFrame to reason:

```text
Given Work,
required Sleep,
other genuine temporal obligations,
and the user's authored preferences,

what time actually remains available
for the life they are trying to plan?
```

That distinction is the purpose of Task 9.10.

The specification must establish it clearly enough that the later implementation task can encode the rule once, at the correct semantic owner, without accumulating another layer of Sleep-specific placement exceptions.