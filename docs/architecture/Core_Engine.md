# DayFrame Core Engine

**Product:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Spec:** Core scheduling engine  
**Status:** Draft v0.1  
**Purpose:** Define the scheduling logic that powers DayFrame before UI or integrations are built.

---

## 1. Core Philosophy

DayFrame is not a traditional calendar app.

Traditional calendars assume:
- A day starts at midnight.
- A week starts on Sunday or Monday.
- Events are mostly manually placed.
- Users live on stable schedules.

DayFrame assumes:
- A user's “real day” may start at any time.
- A user's “work week” may start on any day.
- Work shifts may rotate in cycles.
- Transition periods are high-friction and need special handling.
- Flexible blocks should adapt around fixed constraints.
- Users should be able to preview friction before adding events to a calendar.

The engine should schedule around the user's lived rhythm, not the default calendar grid.

---

## 2. Key Concepts

### 2.1 User Day

A **User Day** is the user's personal scheduling day.

Example:

If `dayBoundaryStart = "03:00"`:

- Monday 02:00 belongs to the user's Sunday.
- Monday 03:00 begins the user's Monday.

This allows night shift workers and irregular schedule users to plan around waking/sleeping cycles instead of midnight.

### 2.2 User Week

A **User Week** is the user's personal planning week.

Example:

If `weekStartsOn = "saturday"`:

- The user's planning week begins Saturday.
- Weekly goals, workload distribution, and review blocks should align to Saturday-start weeks.

### 2.3 Shift Cycle

A **Shift Cycle** describes a long-range work pattern.

DayFrame must support:
- Fixed quarterly schedules.
- 3-month cycles.
- 4-month cycles.
- Irregular manually entered segments.
- Future repeating patterns.

DayFrame should not hardcode “quarter” as the only planning unit.

### 2.4 Blocks

A **Block** is a reserved unit of time.

Examples:
- Work
- Sleep
- Walk
- Strength training
- Meal prep
- Grocery planning
- Schedule review
- Wind-down
- Family time

Blocks may be fixed or flexible.

### 2.5 Fixed Blocks

Fixed blocks are not normally moved by the engine.

Examples:
- Work shifts
- Medical appointments
- Mandatory commitments

### 2.6 Flexible Blocks

Flexible blocks may move based on:
- Priority
- Preferred window
- Available time
- Transition period
- User rules
- Conflict resolution

Examples:
- Workout
- Walk
- Chores
- Meal prep
- Admin tasks

---

## 3. Priority System

Every block must have a priority.

Suggested MVP priority scale:

| Priority | Label | Meaning |
|---|---|---|
| 1 | Locked | Must happen; rarely moved |
| 2 | High | Important; should be preserved |
| 3 | Normal | Useful; can move |
| 4 | Flexible | Optional timing |
| 5 | Drop First | Nice-to-have; easiest to skip |

Default examples:

- Priority 1: work, sleep, medical, critical appointments
- Priority 2: exercise, meal prep, family obligations, schedule review
- Priority 3: chores, errands, admin tasks
- Priority 4: hobbies, learning, optional social time
- Priority 5: low-impact optional blocks

Priority rules should be plain-language and easy to explain.

Example:

> If a Priority 1 block conflicts with a Priority 3 block, keep the Priority 1 block and reschedule the Priority 3 block.

---

## 4. Conflict Resolution

When two blocks overlap, the engine should apply this order:

1. Preserve fixed blocks.
2. Preserve lower-numbered priority blocks.
3. Move flexible blocks according to their reschedule behavior.
4. If no valid placement exists, flag a friction point.
5. Ask the user to approve or resolve unresolved conflicts.

### 4.1 Reschedule Behavior

Each flexible block should define what happens if it cannot be placed.

Possible MVP values:

```ts
type RescheduleBehavior =
  | "autoSameDay"
  | "autoSameUserWeek"
  | "askUser"
  | "skip";
```

Meaning:

- `autoSameDay`: Try to move later/earlier within the same user day.
- `autoSameUserWeek`: Try to preserve it somewhere in the same user week.
- `askUser`: Flag it for user decision.
- `skip`: Drop it and record as skipped.

---

## 5. Transition Period Logic

A **Transition Period** is the time around a shift change where friction is expected.

Transition periods should be first-class engine concepts.

Example:

```ts
transitionPeriod = {
  oldShiftId: "evening",
  newShiftId: "night",
  startsAt: "2026-04-30T22:15:00",
  endsAt: "2026-05-04T21:45:00",
  strategy: "recoveryPriority"
}
```

### 5.1 Transition Goals

During transition periods, the engine should:

- Protect sleep.
- Reduce workout intensity.
- Move life-maintenance blocks earlier when possible.
- Avoid overloading compressed weekends.
- Surface friction before calendar export.

### 5.2 Built-In Transition Strategies

MVP should include simple strategies:

#### Recovery Priority

Used when the transition is harsh or sleep-disruptive.

Behavior:
- Sleep blocks receive highest protection.
- Strength workouts may convert to walks or recovery blocks.
- Optional blocks are dropped first.
- Life-maintenance blocks should be moved before the transition window if possible.

#### Normal Transition

Used when the change is manageable.

Behavior:
- Preserve most high-priority goals.
- Reduce optional blocks.
- Flag schedule compression.

#### Manual Review

Used when the engine is unsure.

Behavior:
- Generate preview.
- Flag conflicts and overloaded days.
- Ask user to choose.

---

## 6. Built-In Rule Types

DayFrame should ship with a small set of built-in rule types.

Do not build a fully open-ended programming language in MVP.

### 6.1 Conflict Rule

Plain-language form:

> When two blocks overlap, keep the higher-priority block and reschedule the lower-priority block.

### 6.2 Missed Block Rule

Plain-language form:

> When a block is missed, reschedule it based on its reschedule behavior.

Examples:
- Missed workout → move to next available fitness window.
- Missed chore → move within the same user week.
- Missed optional block → skip.

### 6.3 Bad Sleep Rule

Plain-language form:

> When sleep is below target, reduce the next workout intensity.

MVP version may use manually entered sleep quality/hours or a simple toggle.

Example actions:
- Strength training → recovery walk.
- Long workout → shorter workout.
- High-intensity day → mobility day.

### 6.4 Transition Rule

Plain-language form:

> When a shift change is approaching, protect sleep and reduce schedule load.

Example:
- 7 days before shift change → reduce workout volume.
- Transition weekend → rest period.
- 3 days before shift change → schedule review block.

### 6.5 Review Rule

Plain-language form:

> Schedule a review block before important calendar changes.

Example:
- Weekly review every Sunday.
- Shift review 14 days before schedule change.
- Work-change review block when a new cycle begins.

---

## 7. Schedule Generation Pipeline

The engine should generate a schedule in predictable steps.

### Step 1: Load User Settings

Inputs:
- Time zone
- Day boundary start
- Week start day
- Sleep target
- Default transition strategy
- Calendar export preferences

### Step 2: Load Shift Cycle

Inputs:
- Shift segments
- Work days
- Start/end times
- Shift change dates

### Step 3: Create Planning Window

Example:
- Generate next 7 days
- Generate next 30 days
- Generate full cycle
- Generate next transition window

### Step 4: Place Fixed Blocks

Place:
- Work shifts
- Sleep anchors if treated as fixed
- Existing imported calendar commitments if enabled later

### Step 5: Detect Transition Windows

For each shift change:
- Identify transition start/end.
- Mark affected user days.
- Apply transition strategy.

### Step 6: Place High-Priority Flexible Blocks

Place Priority 2 blocks first.

Examples:
- Workout
- Meal prep
- Schedule review
- Family commitments

### Step 7: Place Normal and Flexible Blocks

Place Priority 3–5 blocks after high-priority blocks.

### Step 8: Apply Rules

Apply:
- Conflict rules
- Missed block rules
- Bad sleep rules
- Transition rules
- Review rules

### Step 9: Detect Friction

Generate warnings and friction points.

Examples:
- Sleep target not met.
- Workouts could not fit.
- Transition weekend overloaded.
- Priority 1 conflict.
- No attached resource for a block that requires one.
- Too many high-priority blocks in one user day.

### Step 10: Produce Preview

Output:
- Today view data
- Week view data
- Transition view data
- Friction list
- Exportable calendar events

### Step 11: User Approval

The app should not populate the calendar automatically without preview.

MVP flow:
1. Generate My DayFrame
2. Preview schedule
3. Review friction
4. Apply fixes
5. Export or add to calendar

---

## 8. Friction Detection

Friction detection is a core DayFrame advantage.

The engine should produce human-readable warnings.

Examples:

- “Only 5.5 hours are available for sleep before your first night shift.”
- “Strength Training could not fit on Tuesday.”
- “Your transition weekend contains 9 scheduled non-work hours.”
- “Meal Prep has no grocery list or resource attached.”
- “Two Priority 1 blocks overlap.”

Each friction point should include:
- Severity
- Affected block(s)
- Affected user day
- Suggested fix
- Whether user can ignore it

Suggested severity levels:

```ts
type FrictionSeverity = "info" | "warning" | "critical";
```

---

## 9. Tool Attachments and Resources

Blocks may carry external resources.

MVP resources:

```ts
type ExternalResource = {
  id: string;
  type: "url" | "note" | "checklist";
  label: string;
  value: string;
};
```

Examples:
- Workout block → workout app link
- Meal prep block → grocery list link
- Schedule review block → planning note
- Chore block → checklist

Calendar exports should include resource links in event descriptions.

---

## 10. Calendar Output

MVP should support `.ics` export before direct API sync.

Generated calendar events should include:
- Title
- Start time
- End time
- Description
- Attached resource links
- Reminder settings if supported
- Category/tag if supported

Direct Google Calendar sync should be a later phase.

---

## 11. MVP Constraints

Do include:
- Custom day boundary
- Custom week boundary
- Fixed shift segments
- Basic cycles
- Block templates
- Priorities
- Basic rules
- Transition detection
- Friction detection
- Tool attachments
- Schedule preview data
- `.ics` export data

Do not include in MVP:
- Deep integrations with every external app
- Team scheduling
- Marketplace/community template store
- Native mobile alarms
- Fully visual Scratch-style rule editor
- AI-generated schedules
- Payroll/timecard logic

---

## 12. Acceptance Criteria

The core engine is successful when it can:

1. Accept a custom day boundary such as 03:00.
2. Correctly assign early-morning events to the intended user day.
3. Accept a custom week start such as Saturday.
4. Generate work blocks from shift segments.
5. Detect upcoming shift changes.
6. Mark transition periods.
7. Place high-priority flexible blocks around fixed blocks.
8. Reschedule lower-priority blocks when conflicts occur.
9. Flag unresolved friction points.
10. Generate preview-ready schedule data.
11. Generate export-ready calendar event data.
12. Include attached resources in block/event descriptions.

---

## 13. Open Questions

These should be answered before coding the full MVP:

1. Should sleep be treated as a fixed block, flexible block, or special protected block?
2. How many transition days should the MVP assume by default?
3. Should workout tapering be rule-based or manually configured first?
4. Should users create one active cycle at a time or many stored cycles?
5. Should DayFrame support existing calendar import in MVP, or only export?
6. What is the minimum useful reminder behavior before native app alarms?
7. Should rule editing be toggle-based first, with visual editing later?

---

## 14. Implementation Notes

Recommended implementation order:

1. Date/time utilities
2. User day boundary logic
3. User week boundary logic
4. Shift segment model
5. Block template model
6. Schedule generator
7. Priority/conflict resolver
8. Transition detector
9. Friction detector
10. Calendar export mapper

Do not start with UI polish.

Build and test the engine first.
