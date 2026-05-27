# DayFrame Workflow

**Product:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Spec:** User workflow  
**Status:** Draft v0.1  
**Purpose:** Define the end-to-end DayFrame user flow from setup to calendar export.

---

## 1. Workflow Philosophy

DayFrame should feel simple even though the underlying scheduling logic is powerful.

The user should not feel like they are programming a calendar.

They should feel like they are answering practical questions:

- What shift am I working?
- When does my day start?
- What matters most?
- What should move if life gets tight?
- What tools do I need during each block?
- What does the schedule look like before I commit it?

The central workflow is:

```text
Set Up → Build Templates → Attach Tools → Generate → Preview → Fix Friction → Add to Calendar
```

The app should always preview before exporting or syncing.

---

## 2. Primary Workflow Overview

### Step 1: Set Up User Rhythm

User defines:

- Time zone
- Day boundary
- Week boundary
- Sleep target
- Default transition strategy

Example:

```text
My day starts at 3:00 AM.
My week starts on Saturday.
My sleep target is 7.5 hours.
```

### Step 2: Define Shift Cycle

User defines:

- Shift types
- Work days
- Work start/end times
- Cycle segments
- Shift change dates

Example shifts:

```text
Day Shift: 05:45–14:15, Monday–Friday
Evening Shift: 13:45–22:15, Monday–Friday
Night Shift: 21:45–06:15, Sunday–Thursday
```

The user should be able to define cycle increments such as:

- 3 months
- 4 months
- custom date range
- irregular manually entered segments

### Step 3: Create Block Templates

User creates recurring life blocks:

- Sleep
- Workout
- Walk
- Meal prep
- Grocery planning
- Schedule review
- Chores
- Family time
- Wind-down routine
- Medication/supplements

Each block includes:

- Duration
- Priority
- Category
- Preferred timing window
- Reschedule behavior
- Optional reminder settings
- Whether it requires a resource

### Step 4: Attach Tools and Resources

Each block can include resources.

Examples:

```text
Workout → link to workout plan
Meal Prep → grocery list
Schedule Review → planning note
Chores → checklist
```

MVP resource types:

- URL
- Note
- Checklist

A block should not merely reserve time. It should carry what the user needs to complete the task.

### Step 5: Generate My DayFrame

User taps:

```text
Generate My DayFrame
```

The engine:

- Applies user day/week boundaries
- Places fixed work/sleep blocks
- Applies shift cycle
- Detects transition windows
- Places flexible blocks by priority
- Applies rules
- Detects friction
- Builds preview data

### Step 6: Preview Schedule

The user reviews the generated schedule before calendar output.

Preview should include:

- Today view
- Week view
- Transition view
- Block details
- Attached tools/resources
- Friction list

### Step 7: Review Friction

DayFrame flags problems before the user commits.

Examples:

```text
Only 5.5 hours are available for sleep before your first night shift.
Strength Training could not fit on Tuesday.
Transition weekend is overloaded.
Meal Prep has no grocery list attached.
Two Priority 1 blocks overlap.
```

### Step 8: Apply Fixes

The user can:

- Move lower-priority block
- Skip optional block
- Convert workout to recovery
- Reduce duration
- Add missing resource
- Accept conflict
- Ask DayFrame to suggest a fix

### Step 9: Add to Calendar

After approval, the user exports or syncs.

MVP:

- `.ics` export

Later:

- Direct Google Calendar sync
- Outlook calendar sync
- Apple calendar sync

---

## 3. First-Time User Flow

The first-run experience should be guided and short.

### Screen 1: Welcome

Message:

```text
DayFrame
Built for life that doesn’t run 9 to 5.
```

Core explanation:

```text
Build schedules around your real day, your shifts, and your priorities.
```

Primary action:

```text
Start Setup
```

### Screen 2: Day and Week Boundaries

Questions:

```text
When does your day start?
When does your week start?
```

Defaults:

- Day starts at 00:00
- Week starts on Monday or Sunday, depending locale/user choice

But the app should clearly support non-standard values.

Example:

```text
My day starts at 3:00 AM.
My week starts Saturday.
```

### Screen 3: Sleep Target

Question:

```text
How much sleep do you want to protect?
```

Inputs:

- Hours
- Minutes

Default:

- 7.5 hours

### Screen 4: Define Shifts

User creates shift definitions.

Each shift needs:

- Name
- Start time
- End time
- Work days
- Whether it crosses midnight, derived automatically

Example:

```text
Night Shift
21:45–06:15
Sunday–Thursday
```

### Screen 5: Build Cycle

User maps shift definitions onto date ranges.

Example:

```text
Jan 1–Mar 31: Day Shift
Apr 1–Jun 30: Evening Shift
Jul 1–Sep 30: Night Shift
Oct 1–Dec 31: Day Shift
```

The user may also define custom increments like 4 months.

### Screen 6: Pick Starter Blocks

Offer simple starter options:

- Sleep
- Walk
- Strength training
- Meal prep
- Weekly review
- Chores
- Wind-down

The user can edit later.

### Screen 7: Review Defaults

Show:

- Day boundary
- Week boundary
- Shifts
- Current cycle
- Starter blocks
- Transition strategy

Primary action:

```text
Generate My First DayFrame
```

---

## 4. Returning User Flow

Returning users should land on the Today dashboard.

### Today View should show:

- Current time
- Current user day
- Current block
- Next block
- Countdown to next block
- Friction alerts
- Quick actions

Quick actions:

- Complete block
- Skip block
- Reschedule block
- Open attached tool
- View week
- Generate updated schedule

---

## 5. Generate Flow

The generate flow should be one of the app's central interactions.

### Entry points:

- First-run setup
- Today dashboard
- Week view
- Shift cycle editor
- Transition warning
- Manual “Regenerate” action

### Generate Button

Recommended label:

```text
Generate My DayFrame
```

### Generate Confirmation

Before generation, show:

```text
Planning window:
[Next 7 days]
[Next 30 days]
[Current shift segment]
[Through next transition]
```

MVP should support:

- Next 7 days
- Next 30 days
- Through next transition

### Generation Output

The result should include:

- Generated schedule
- Friction points
- Rule explanations
- Calendar export preview

---

## 6. Preview Flow

Preview should answer:

```text
What will my life look like if I accept this plan?
```

Preview modes:

### Today Preview

Shows:

- Current/next blocks
- countdowns
- reminders
- attached tools

### Week Preview

Shows:

- daily block layout
- high-priority blocks
- gaps
- overloaded days

### Transition Preview

Shows:

- upcoming shift change
- transition window
- sleep protection
- reduced workouts
- rest/recovery placement
- maintenance moved earlier

This is a major differentiator and should be prioritized.

---

## 7. Friction Review Flow

Friction review should be direct and helpful.

Each friction point should show:

- Severity
- Problem
- Why it happened
- Suggested fix
- Ignore option if safe

Example:

```text
Warning
Transition weekend is overloaded.

Why:
You have 9 non-work scheduled hours during a compressed transition period.

Suggested fixes:
[Move chores earlier]
[Convert workout to recovery]
[Skip optional blocks]
[Ignore]
```

### Severity Levels

- Info
- Warning
- Critical

Critical friction should require user action before export.

---

## 8. Fix Flow

Fixes should be simple.

Possible fix buttons:

- Move block
- Skip block
- Convert to recovery
- Reduce duration
- Change priority
- Add resource
- Accept conflict

The app should explain what will happen.

Example:

```text
Move Strength Training to Wednesday at 18:30?
```

After a fix, the preview should update.

---

## 9. Tool Attachment Flow

Tool attachment should happen at the block level.

A user can attach:

- Link
- Note
- Checklist

Examples:

```text
Workout Plan URL
Grocery List Link
Meal Prep Checklist
Schedule Review Notes
```

Blocks can mark resources as required.

If required resources are missing, DayFrame should flag friction.

### MVP Tool Attachment Fields

```text
Resource label
Resource type
Resource value
```

Example:

```text
Label: Push/Pull Workout
Type: URL
Value: https://...
```

---

## 10. Calendar Export Flow

Calendar output should be preview-first.

### Step 1: User reviews final preview

The user confirms:

- Date range
- Events
- Reminders
- Friction status

### Step 2: Export

MVP:

```text
Download .ics
```

Later:

```text
Sync to Google Calendar
Sync to Outlook
Sync to Apple Calendar
```

### Calendar Event Description

Generated calendar descriptions should include:

```text
Generated by DayFrame

Priority: 2
Category: Fitness

Resources:
- Workout Plan: https://...

Rule notes:
- Moved from Tuesday because of work conflict.
```

---

## 11. Schedule Review Workflow

DayFrame should support internal review triggers.

Examples:

- Weekly schedule review
- 14 days before shift change
- 7 days before shift change
- First day of new shift segment
- After high-friction schedule generation

A review block should be a normal scheduled block.

Example:

```text
Schedule Review
Duration: 30 minutes
Priority: 2
Preferred window: after work
```

---

## 12. Missed Block Workflow

MVP can start with manual block status.

User actions:

- Mark complete
- Mark missed
- Skip
- Reschedule

If missed:

- Apply block reschedule behavior
- Generate suggested placement
- Explain change
- Update preview

Example:

```text
You missed Strength Training.
Move it to Thursday at 18:00?
```

---

## 13. Bad Sleep Workflow

MVP can start with simple user input.

Options:

```text
How was your sleep?
[Good]
[Bad]
[Enter hours]
```

If bad sleep is reported:

- Apply recovery rule
- Reduce next workout
- Convert workout to recovery if needed
- Flag explanation

Example:

```text
Strength Training changed to Recovery Walk because sleep was below target.
```

---

## 14. Mobile-First Navigation

Recommended bottom navigation:

- Today
- Plan
- Generate
- Templates
- Settings

Possible early MVP tabs:

### Today

Current block and immediate actions.

### Plan

Week/transition preview.

### Generate

Schedule generation and friction review.

### Templates

Blocks, rules, resources, shifts.

### Settings

Day boundary, week boundary, sleep target, account.

---

## 15. MVP Workflow Scope

Include in MVP:

- First-run setup
- Day boundary
- Week boundary
- Shift definitions
- Shift cycle segments
- Block templates
- Tool/resource attachments
- Generate schedule
- Preview schedule
- Friction review
- Suggested fixes
- `.ics` export
- Manual missed block handling
- Manual bad sleep handling

Do not include in MVP:

- Deep third-party integrations
- Full visual rule builder
- AI schedule creation
- Team/workplace scheduling
- Native alarm-clock integration
- Marketplace/community templates
- Full analytics dashboard

---

## 16. Workflow Acceptance Criteria

The workflow is successful when a user can:

1. Define their day start and week start.
2. Define multiple shifts.
3. Define a shift cycle with custom segment lengths.
4. Create flexible blocks with priorities.
5. Attach a link, note, or checklist to a block.
6. Generate a schedule.
7. See a preview before export.
8. See transition-specific warnings.
9. Resolve or ignore friction points.
10. Export an `.ics` calendar file.
11. Understand why DayFrame moved or changed a block.

---

## 17. Open Questions

1. Should first-run setup require shift cycle creation, or allow a demo mode?
2. Should the Generate button live in bottom navigation or as a primary dashboard button?
3. Should missing resources block export or only warn?
4. Should calendar export include skipped/conflicted blocks as notes?
5. Should users be able to regenerate only a single week?
6. Should the Today view require login/cloud sync from day one?
7. Should DayFrame support local-only mode before account sync?

---

## 18. Workflow Summary

DayFrame's core workflow should be:

```text
Define rhythm.
Define shifts.
Define priorities.
Attach tools.
Generate schedule.
Preview friction.
Fix issues.
Export calendar.
Live the plan.
```

The user should always feel in control.

The app should automate structure, not remove agency.
