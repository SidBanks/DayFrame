# DayFrame Rules System

**Product:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Spec:** Rules system  
**Status:** Draft v0.1  
**Purpose:** Define how DayFrame makes scheduling decisions using plain-language, priority-aware, modular rules.

---

## 1. Purpose

DayFrame needs a rule system because shift-aware scheduling is not just event placement.

The app must decide:

- What happens when blocks overlap.
- What happens when a block is missed.
- What happens when sleep is poor.
- What happens when a shift change is approaching.
- What happens when a transition weekend is overloaded.
- What should be preserved, moved, shortened, converted, skipped, or flagged.

The goal is to give users flexible control without making them code.

DayFrame rules should feel like:

> WHEN this happens, IF this condition is true, THEN do this.

---

## 2. Rule Philosophy

The rule system should be:

### Plain-language first

Users should understand rules without technical knowledge.

Example:

> When I miss a workout, move it to the next available fitness window.

### Modular

Rules should be small and composable.

A user should be able to turn individual rules on or off.

### Predictable

The same inputs should produce the same schedule.

Avoid hidden behavior.

### Priority-aware

Every block has a priority, and rules must respect that priority.

### Safe by default

The app should not silently delete or overwrite important commitments.

### Preview-before-apply

Rules should generate a preview first.

Calendar export/sync should require user confirmation.

---

## 3. Rule Shape

All rules follow this conceptual structure:

```text
WHEN [trigger]
IF [condition(s)]
THEN [action(s)]
```

Example:

```text
WHEN two blocks overlap
IF one block has higher priority
THEN keep the higher-priority block
AND reschedule the lower-priority block
```

Example:

```text
WHEN sleep is below target
IF tomorrow contains a strength workout
THEN reduce workout intensity
```

---

## 4. Technical Rule Shape

Reference TypeScript-style model:

```ts
type Rule = {
  id: string;
  userId?: string;

  name: string;
  description: string;

  trigger: RuleTrigger;
  conditions: RuleCondition[];
  actions: RuleActionConfig[];

  enabled: boolean;
  builtIn: boolean;

  createdAt: string;
  updatedAt: string;
};
```

A rule may be:

- Built-in and enabled by default.
- Built-in and optional.
- User-created later.
- User-customized later.

MVP should prioritize built-in, toggleable rules over fully custom rule creation.

---

## 5. Trigger Types

A trigger defines when a rule should be evaluated.

```ts
type RuleTrigger =
  | "manualGenerate"
  | "blockConflict"
  | "blockMissed"
  | "sleepBelowTarget"
  | "shiftChangeApproaching"
  | "transitionWindow"
  | "weeklyReview"
  | "resourceMissing";
```

### 5.1 manualGenerate

Runs when the user taps:

> Generate My DayFrame

Used for schedule generation and friction detection.

### 5.2 blockConflict

Runs when two or more blocks overlap.

### 5.3 blockMissed

Runs when a scheduled block was not completed.

### 5.4 sleepBelowTarget

Runs when sleep is below the user's target.

MVP may rely on manual sleep input or a simple “bad sleep” toggle.

### 5.5 shiftChangeApproaching

Runs when a shift change is within a defined number of days.

### 5.6 transitionWindow

Runs during the transition period around a shift change.

### 5.7 weeklyReview

Runs on scheduled review days.

### 5.8 resourceMissing

Runs when a block requires an external tool/resource but does not have one attached.

---

## 6. Condition Types

A condition determines whether a triggered rule should act.

```ts
type RuleConditionType =
  | "priorityComparison"
  | "blockCategory"
  | "blockPlacementType"
  | "daysUntilShiftChange"
  | "sleepMinutesBelow"
  | "userDayHasCapacity"
  | "userWeekHasCapacity"
  | "transitionStrategy"
  | "requiresResource"
  | "hasExternalResource";
```

Examples:

```text
IF lower-priority block exists
IF days until shift change is less than 7
IF sleep is more than 60 minutes below target
IF block category is fitness
IF block requires resource and has no resource
```

---

## 7. Action Types

An action defines what the engine should do.

```ts
type RuleAction =
  | "keepHigherPriority"
  | "rescheduleLowerPriority"
  | "rescheduleCurrentBlock"
  | "reduceWorkoutIntensity"
  | "convertWorkoutToRecovery"
  | "moveBlockEarlier"
  | "moveBlockLater"
  | "skipLowerPriority"
  | "createReviewBlock"
  | "flagFriction"
  | "requestUserDecision"
  | "addCalendarReminder";
```

Examples:

```text
THEN keep higher-priority block
THEN reschedule lower-priority block
THEN convert workout to recovery walk
THEN flag friction
THEN ask user what to do
```

---

## 8. Priority System

DayFrame uses a numeric priority scale.

| Priority | Label      | Meaning                       |
| -------- | ---------- | ----------------------------- |
| 1        | Locked     | Must happen; rarely moved     |
| 2        | High       | Important; strongly preserve  |
| 3        | Normal     | Useful; can move              |
| 4        | Flexible   | Optional timing               |
| 5        | Drop First | Nice-to-have; easiest to skip |

Lower number means higher importance.

---

## 9. Priority Interaction Rules

### 9.1 Higher priority wins

If two blocks conflict:

```text
Priority 1 beats Priority 3.
Priority 2 beats Priority 4.
Priority 3 beats Priority 5.
```

The lower-priority block should be moved, skipped, or flagged depending on its reschedule behavior.

### 9.2 Same-priority conflict

If two blocks have the same priority, use tie-breakers.

Suggested tie-break order:

1. Fixed block beats flexible block.
2. Earlier-created fixed commitment wins.
3. Block with narrower placement window wins.
4. Block with required resource wins.
5. Ask the user.

### 9.3 Priority 1 conflicts

If two Priority 1 blocks overlap, the app should not silently choose.

It should flag a critical friction point.

Example:

> Two locked blocks overlap: Work and Medical Appointment.

### 9.4 User override

The user should always be able to manually override generated decisions before calendar export.

---

## 10. Reschedule Behavior

Each flexible block should define what happens when it cannot fit.

```ts
type RescheduleBehavior = "autoSameDay" | "autoSameUserWeek" | "askUser" | "skip";
```

### 10.1 autoSameDay

Try to move the block within the same user day.

Example:

- Walk can move from 18:00 to 19:30.

### 10.2 autoSameUserWeek

Try to preserve the block somewhere in the same user week.

Example:

- Strength workout missed Monday can move to Wednesday.

### 10.3 askUser

Flag the block and request a choice.

Example:

- Meal prep conflicts with family event.

### 10.4 skip

Drop the block if it cannot fit.

Example:

- Optional reading block during transition weekend.

---

## 11. Rule Execution Order

Rule order matters.

The engine should evaluate rules in a predictable order.

Suggested MVP order:

1. Load user settings and shift cycles.
2. Place fixed blocks.
3. Detect transition windows.
4. Place flexible blocks by priority.
5. Run conflict rules.
6. Run transition rules.
7. Run recovery/sleep rules.
8. Run missed-block rules.
9. Run resource rules.
10. Run review rules.
11. Generate friction points.
12. Generate preview.
13. Wait for user approval before export/sync.

---

## 12. MVP Built-In Rules

The MVP should ship with a small, practical rule set.

Do not build unlimited custom logic in the first version.

---

## 13. Built-In Rule: Priority Conflict Resolution

### Plain-language rule

```text
WHEN two blocks overlap
IF one block has higher priority
THEN keep the higher-priority block
AND reschedule the lower-priority block
```

### Behavior

- Preserve fixed blocks first.
- Preserve higher-priority blocks.
- Apply lower-priority block's reschedule behavior.
- Flag unresolved conflicts.

### Friction examples

- “Workout was moved because it conflicted with Work.”
- “Chore block could not be rescheduled this week.”

---

## 14. Built-In Rule: Priority 1 Collision

### Plain-language rule

```text
WHEN two Priority 1 blocks overlap
THEN flag a critical conflict
AND ask the user to decide
```

### Behavior

The app should not decide silently.

### Friction example

> Two locked blocks overlap. Please choose which one to keep or adjust.

---

## 15. Built-In Rule: Missed Block Handling

### Plain-language rule

```text
WHEN a block is missed
IF the block allows rescheduling
THEN move it based on its reschedule behavior
```

### Examples

- Missed walk → move later today.
- Missed workout → move to next available fitness window this user week.
- Missed optional hobby block → skip.

### MVP note

Missed-block detection can start as manual:

- User marks completed.
- User marks missed.
- User skips.

Automatic missed detection can come later.

---

## 16. Built-In Rule: Bad Sleep Workout Adjustment

### Plain-language rule

```text
WHEN sleep is below target
IF next scheduled block is a workout
THEN reduce workout intensity
```

### Example actions

- Strength Training → Mobility + Walk
- Long Walk → Short Walk
- High Intensity → Recovery
- Workout duration reduced by 25–50%

### MVP note

Sleep input can be simple at first:

- Good sleep
- Bad sleep
- Hours slept

Do not integrate sleep trackers in MVP.

---

## 17. Built-In Rule: Shift Change Approaching

### Plain-language rule

```text
WHEN shift change is approaching
THEN protect sleep
AND reduce schedule load
AND create a schedule review block
```

### Default timing

Suggested MVP default:

- 14 days before shift change: create review block.
- 7 days before shift change: reduce workout load.
- Transition weekend: prioritize sleep/recovery.

### Friction examples

- “Shift change in 7 days. Workout volume reduced this week.”
- “Transition weekend is overloaded.”

---

## 18. Built-In Rule: Transition Weekend Recovery

### Plain-language rule

```text
WHEN user is in a transition window
THEN protect sleep
AND drop optional blocks first
AND convert workouts to recovery if needed
```

### Behavior

- Priority 1 blocks remain.
- Priority 2 blocks are preserved if possible.
- Priority 3 blocks may move earlier or later.
- Priority 4–5 blocks are dropped first.
- Workouts may become recovery blocks.

---

## 19. Built-In Rule: Schedule Review

### Plain-language rule

```text
WHEN a review point occurs
THEN create a schedule review block
```

### Example review points

- Weekly review
- 14 days before shift change
- First day of new shift cycle
- After major conflict detection

### MVP note

Review blocks should be visible and exportable.

---

## 20. Built-In Rule: Missing Resource Warning

### Plain-language rule

```text
WHEN a block requires a resource
IF no resource is attached
THEN flag friction
```

### Examples

- Workout block has no workout plan link.
- Meal prep block has no grocery list.
- Schedule review block has no planning notes.

---

## 21. Scratch-Style User Experience

The long-term goal is a visual rule builder that feels like Scratch.

But MVP should not attempt a full visual programming environment.

### MVP user-facing rule controls

Use simple toggles and dropdowns:

```text
If I miss a workout:
[Move it this week ▼]

If sleep is bad:
[Reduce next workout ▼]

Before shift changes:
[Create review block 14 days before ▼]

During transition weekends:
[Protect sleep and reduce workouts ▼]
```

### Later visual rule builder

Future design:

```text
WHEN [Workout is missed]
IF [This week has available fitness window]
THEN [Move workout]
ELSE [Ask me]
```

Users assemble rules from known blocks:

- WHEN blocks
- IF blocks
- THEN blocks
- UNLESS blocks

---

## 22. Rule Safety Limits

To prevent confusion and bad schedules:

### 22.1 No infinite rescheduling

A block should have a maximum number of reschedule attempts.

Example:

```ts
maxRescheduleAttempts: 3;
```

After that, flag friction.

### 22.2 No silent deletion of important blocks

Priority 1 and Priority 2 blocks should not be skipped silently.

### 22.3 No export without preview

The user must review generated schedules before export/sync.

### 22.4 Rules should explain themselves

Every automatic change should be explainable.

Example:

> Strength Training moved from Tuesday to Wednesday because Tuesday did not have enough available time after Work.

---

## 23. Rule Explanation Model

Every rule action should be able to generate a human-readable explanation.

```ts
type RuleExplanation = {
  ruleId: string;
  affectedBlockId: string;
  message: string;
};
```

Examples:

- “Walk moved later today because it conflicted with Work.”
- “Workout changed to Recovery Walk because sleep was below target.”
- “Meal Prep flagged because no grocery list is attached.”

This explanation layer is essential for user trust.

---

## 24. Rule Testing Requirements

The rules system should have tests before UI implementation.

Minimum tests:

1. Priority 1 block overrides Priority 3 block.
2. Priority 1 vs Priority 1 conflict creates critical friction.
3. Lower-priority block with `autoSameDay` moves within same user day.
4. Lower-priority block with `autoSameUserWeek` moves within same user week.
5. Lower-priority block with `askUser` creates friction.
6. Lower-priority block with `skip` is skipped.
7. Bad sleep converts next strength workout to recovery.
8. Shift change within 7 days reduces workout load.
9. Transition window drops optional blocks first.
10. Missing required resource creates warning.
11. Rule explanations are generated for automatic changes.
12. Rules do not run indefinitely.

---

## 25. MVP Scope

Include in MVP:

- Built-in rule set
- Toggleable rules
- Priority-based conflicts
- Reschedule behavior
- Transition rules
- Missed block manual handling
- Bad sleep manual handling
- Missing resource warnings
- Rule explanations
- Friction points

Do not include in MVP:

- Fully custom user-authored rules
- Drag-and-drop visual rule builder
- AI schedule generation
- Sleep tracker integrations
- Fitness app API integrations
- Team rules
- Marketplace rules/templates

---

## 26. Open Questions

1. Should users be allowed to edit built-in rule text, or only settings?
2. Should rules run only during generation, or also during live schedule tracking?
3. Should missed-block rules update the active calendar after export?
4. Should sleep-based rules require user confirmation before changing workouts?
5. How should DayFrame handle recurring friction that the user repeatedly ignores?
6. Should transition rule defaults vary by shift type?
7. Should user-created rules be JSON-based internally from MVP, even if UI does not expose them yet?

---

## 27. Recommended Implementation Order

1. Define rule types.
2. Define priority comparison helpers.
3. Implement conflict resolver.
4. Implement reschedule behavior.
5. Implement friction point generation.
6. Implement transition rule evaluator.
7. Implement bad sleep rule evaluator.
8. Implement missing resource rule evaluator.
9. Implement explanation generation.
10. Write tests for each built-in rule.
11. Only then build UI controls.

---

## 28. Core Rule System Summary

DayFrame rules should make the app feel adaptive without making it unpredictable.

The user should always be able to understand:

- What changed.
- Why it changed.
- What rule caused it.
- What they can do about it.

The MVP rule system should be simple, deterministic, explainable, and preview-first.
