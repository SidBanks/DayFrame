# DayFrame Data Model

**Product:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Spec:** Data model  
**Status:** Draft v0.1  
**Purpose:** Define the core entities DayFrame needs before implementation.

---

## 1. Modeling Principles

DayFrame should model a user's real schedule, not just a standard calendar.

The data model must support:

- Custom day boundaries
- Custom week boundaries
- Shift cycles of different lengths
- Fixed and flexible time blocks
- Priority-based scheduling
- Transition periods
- Plain-language rules
- External tool/resource attachments
- Calendar export
- Future account-based cloud sync

The model should avoid hardcoding one user's work pattern.

DayFrame must support 3-month cycles, 4-month cycles, irregular cycles, and eventually repeating patterns.

---

## 2. Naming Standards

Recommended conventions:

- Use `camelCase` for property names.
- Use explicit time suffixes such as `Minutes`, `At`, `Date`, and `Time`.
- Use ISO strings for persisted timestamps.
- Use IANA time zones for timezone-aware scheduling.
- Keep generated schedule output separate from user-authored templates.

Examples:

```ts
dayBoundaryStartTime: "03:00";
weekStartsOn: "saturday";
durationMinutes: 60;
startsAt: "2026-05-01T05:45:00-05:00";
timeZone: "America/Chicago";
```

---

## 3. Core Types

These are TypeScript-style reference shapes, not final implementation code.

---

## 4. UserProfile

Represents the user's global scheduling preferences.

```ts
type Weekday = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

type TimeString = `${number}:${number}`;

type UserProfile = {
  id: string;
  displayName?: string;
  timeZone: string;

  dayBoundaryStartTime: TimeString;
  weekStartsOn: Weekday;

  defaultSleepTargetMinutes: number;
  defaultTransitionStrategyId: string;

  createdAt: string;
  updatedAt: string;
};
```

### Notes

- `dayBoundaryStartTime` defines when the user's lived day begins.
- `weekStartsOn` defines planning and reporting weeks.
- `timeZone` is required for reliable calendar generation.
- Sleep target should be stored in minutes for easier arithmetic.

---

## 5. ShiftDefinition

Represents a reusable type of shift.

Example:

- Day Shift: 05:45–14:15 Monday–Friday
- Evening Shift: 13:45–22:15 Monday–Friday
- Night Shift: 21:45–06:15 Sunday–Thursday

```ts
type ShiftDefinition = {
  id: string;
  userId: string;

  name: string;
  startTime: TimeString;
  endTime: TimeString;
  workDays: Weekday[];

  crossesMidnight: boolean;
  colorToken?: string;

  createdAt: string;
  updatedAt: string;
};
```

### Notes

- `crossesMidnight` can be derived, but storing it may simplify display.
- Night shifts should support start and end dates across two calendar dates.
- Work days represent shift start days.

---

## 6. ShiftCycle

Represents a collection of shift segments across a planning period.

```ts
type ShiftCycleType = "fixedSegments" | "repeatingPattern";

type ShiftCycle = {
  id: string;
  userId: string;

  name: string;
  type: ShiftCycleType;

  startsOnDate: string;
  endsOnDate?: string;

  segments: ShiftSegment[];

  createdAt: string;
  updatedAt: string;
};
```

### Notes

- MVP can focus on `fixedSegments`.
- `repeatingPattern` can be added later for repeating schedules.
- A user should be able to define cycles longer or shorter than 3 months.

---

## 7. ShiftSegment

Represents one span of time where a shift definition applies.

```ts
type ShiftSegment = {
  id: string;
  shiftCycleId: string;
  shiftDefinitionId: string;

  startsOnDate: string;
  endsOnDate: string;

  transitionStrategyId?: string;
  notes?: string;
};
```

### Example

```ts
const segment: ShiftSegment = {
  id: "seg_001",
  shiftCycleId: "cycle_2026",
  shiftDefinitionId: "shift_day",
  startsOnDate: "2026-01-01",
  endsOnDate: "2026-03-31",
  transitionStrategyId: "recovery_priority",
};
```

---

## 8. BlockTemplate

Represents a reusable block the engine can schedule.

```ts
type BlockCategory =
  | "work"
  | "sleep"
  | "fitness"
  | "meal"
  | "maintenance"
  | "family"
  | "health"
  | "review"
  | "admin"
  | "recovery"
  | "optional";

type BlockPlacementType = "fixed" | "flexible";

type PriorityLevel = 1 | 2 | 3 | 4 | 5;

type RescheduleBehavior = "autoSameDay" | "autoSameUserWeek" | "askUser" | "skip";

type PreferredWindow =
  | "afterWaking"
  | "beforeWork"
  | "afterWork"
  | "beforeSleep"
  | "anyAvailable"
  | "custom";

type BlockTemplate = {
  id: string;
  userId: string;

  title: string;
  category: BlockCategory;
  placementType: BlockPlacementType;

  durationMinutes: number;
  priority: PriorityLevel;
  preferredWindow: PreferredWindow;
  customWindowStartTime?: TimeString;
  customWindowEndTime?: TimeString;

  rescheduleBehavior: RescheduleBehavior;

  requiresResource: boolean;
  externalResources: ExternalResource[];

  enabled: boolean;

  createdAt: string;
  updatedAt: string;
};
```

### Notes

- Work blocks are usually generated from shift definitions, not manually created as flexible blocks.
- Sleep may become a special protected block later.
- `requiresResource` supports warnings like “Workout block has no workout plan attached.”

---

## 9. BlockRecurrence

Defines how often a flexible block should be scheduled.

```ts
type RecurrenceFrequency =
  | "daily"
  | "weekly"
  | "specificWeekdays"
  | "timesPerUserWeek"
  | "perShiftSegment"
  | "custom";

type BlockRecurrence = {
  id: string;
  blockTemplateId: string;

  frequency: RecurrenceFrequency;
  weekdays?: Weekday[];
  timesPerUserWeek?: number;

  startsOnDate?: string;
  endsOnDate?: string;
};
```

### Examples

- Strength training 3 times per user week
- Schedule review every Sunday
- Walk daily
- Meal prep once per user week

---

## 10. ScheduledBlock

Represents a generated instance on the schedule.

```ts
type ScheduledBlockSource = "shift" | "template" | "rule" | "manual" | "importedCalendar";

type ScheduledBlockStatus =
  | "planned"
  | "completed"
  | "missed"
  | "skipped"
  | "rescheduled"
  | "conflicted";

type ScheduledBlock = {
  id: string;
  userId: string;

  templateId?: string;
  source: ScheduledBlockSource;

  title: string;
  category: BlockCategory;

  startsAt: string;
  endsAt: string;
  userDayDate: string;
  userWeekStartDate: string;

  priority: PriorityLevel;
  status: ScheduledBlockStatus;

  externalResources: ExternalResource[];

  originalStartsAt?: string;
  originalEndsAt?: string;
  rescheduledFromBlockId?: string;

  frictionPointIds: string[];

  createdAt: string;
  updatedAt: string;
};
```

### Notes

- `userDayDate` is the lived-day date after applying day boundary logic.
- `userWeekStartDate` is the lived-week start after applying week boundary logic.
- Generated schedule data should be reproducible from templates and cycles where possible.

---

## 11. ExternalResource

Represents a tool, link, note, or checklist attached to a block.

```ts
type ExternalResourceType = "url" | "note" | "checklist" | "file" | "integration";

type ExternalResource = {
  id: string;

  type: ExternalResourceType;
  label: string;
  value: string;

  integrationProvider?: IntegrationProvider;
  metadata?: Record<string, string>;

  createdAt: string;
  updatedAt: string;
};
```

### MVP Resource Types

MVP should support:

- `url`
- `note`
- `checklist`

Later versions may support:

- Google Docs
- Google Sheets
- Notion
- Todoist
- fitness apps
- meal planning apps

---

## 12. Rule

Represents a plain-language scheduling rule.

```ts
type RuleTrigger =
  | "blockConflict"
  | "blockMissed"
  | "sleepBelowTarget"
  | "shiftChangeApproaching"
  | "transitionWindow"
  | "weeklyReview"
  | "manualGenerate";

type RuleConditionType =
  | "priorityComparison"
  | "blockCategory"
  | "daysUntilShiftChange"
  | "sleepMinutesBelow"
  | "userDayHasCapacity"
  | "transitionStrategy";

type RuleAction =
  | "keepHigherPriority"
  | "rescheduleLowerPriority"
  | "reduceWorkoutIntensity"
  | "convertWorkoutToRecovery"
  | "moveBlockEarlier"
  | "skipLowerPriority"
  | "createReviewBlock"
  | "flagFriction";

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

---

## 13. RuleCondition

```ts
type RuleCondition = {
  id: string;
  type: RuleConditionType;
  operator: "equals" | "notEquals" | "lessThan" | "greaterThan" | "within";
  value: string | number | boolean;
};
```

---

## 14. RuleActionConfig

```ts
type RuleActionConfig = {
  id: string;
  action: RuleAction;
  target: "currentBlock" | "conflictingBlock" | "nextWorkout" | "userDay" | "transitionWindow";
  parameters?: Record<string, string | number | boolean>;
};
```

---

## 15. TransitionStrategy

Represents how the engine should handle schedule changes.

```ts
type TransitionStrategy = {
  id: string;
  userId?: string;

  name: string;
  description: string;

  daysBeforeShiftChange: number;
  daysAfterShiftChange: number;

  protectSleep: boolean;
  reduceWorkoutIntensity: boolean;
  moveMaintenanceEarlier: boolean;
  dropOptionalBlocks: boolean;

  builtIn: boolean;

  createdAt: string;
  updatedAt: string;
};
```

### Built-In Strategies

MVP should include:

- `recoveryPriority`
- `normalTransition`
- `manualReview`

---

## 16. FrictionPoint

Represents an issue the engine detects before calendar export.

```ts
type FrictionSeverity = "info" | "warning" | "critical";

type FrictionPoint = {
  id: string;
  userId: string;

  severity: FrictionSeverity;
  title: string;
  message: string;

  affectedBlockIds: string[];
  affectedUserDayDate?: string;
  affectedUserWeekStartDate?: string;

  suggestedFixes: SuggestedFix[];
  canIgnore: boolean;
  ignored: boolean;
  resolved: boolean;

  createdAt: string;
  updatedAt: string;
};
```

---

## 17. SuggestedFix

```ts
type SuggestedFixAction =
  | "moveBlock"
  | "skipBlock"
  | "convertToRecovery"
  | "reduceDuration"
  | "changePriority"
  | "addResource"
  | "acceptConflict";

type SuggestedFix = {
  id: string;

  label: string;
  action: SuggestedFixAction;
  parameters?: Record<string, string | number | boolean>;
};
```

---

## 18. CalendarExport

Represents a generated export batch.

```ts
type CalendarExportProvider = "ics" | "googleCalendar" | "outlook" | "appleCalendar";

type CalendarExportStatus = "draft" | "exported" | "synced" | "failed";

type CalendarExport = {
  id: string;
  userId: string;

  provider: CalendarExportProvider;
  status: CalendarExportStatus;

  planningWindowStart: string;
  planningWindowEnd: string;

  scheduledBlockIds: string[];
  frictionPointIds: string[];

  generatedAt: string;
  exportedAt?: string;

  createdAt: string;
  updatedAt: string;
};
```

---

## 19. ReminderConfig

Represents reminder behavior for a block.

```ts
type ReminderMethod = "calendarNotification" | "pushNotification" | "email" | "sms" | "nativeAlarm";

type ReminderConfig = {
  id: string;
  blockTemplateId?: string;
  scheduledBlockId?: string;

  method: ReminderMethod;
  minutesBeforeStart: number;

  enabled: boolean;
};
```

### MVP Notes

MVP should support calendar reminders through `.ics` export where possible.

Native alarms should not be considered MVP unless DayFrame becomes a native mobile app early.

---

## 20. IntegrationProvider

Represents a future external app integration.

```ts
type IntegrationProvider =
  | "googleCalendar"
  | "googleTasks"
  | "googleDocs"
  | "notion"
  | "todoist"
  | "appleCalendar"
  | "outlook"
  | "customUrl";
```

MVP should use `customUrl` for most external resources.

---

## 21. Example User Data Scenario

The user's three work shifts:

```ts
const dayShift: ShiftDefinition = {
  id: "shift_day",
  userId: "user_001",
  name: "Day Shift",
  startTime: "05:45",
  endTime: "14:15",
  workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  crossesMidnight: false,
  createdAt: "2026-05-01T00:00:00-05:00",
  updatedAt: "2026-05-01T00:00:00-05:00",
};

const eveningShift: ShiftDefinition = {
  id: "shift_evening",
  userId: "user_001",
  name: "Evening Shift",
  startTime: "13:45",
  endTime: "22:15",
  workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  crossesMidnight: false,
  createdAt: "2026-05-01T00:00:00-05:00",
  updatedAt: "2026-05-01T00:00:00-05:00",
};

const nightShift: ShiftDefinition = {
  id: "shift_night",
  userId: "user_001",
  name: "Night Shift",
  startTime: "21:45",
  endTime: "06:15",
  workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
  crossesMidnight: true,
  createdAt: "2026-05-01T00:00:00-05:00",
  updatedAt: "2026-05-01T00:00:00-05:00",
};
```

---

## 22. MVP Data Model Requirements

MVP implementation should include:

- `UserProfile`
- `ShiftDefinition`
- `ShiftCycle`
- `ShiftSegment`
- `BlockTemplate`
- `BlockRecurrence`
- `ScheduledBlock`
- `ExternalResource`
- `Rule`
- `TransitionStrategy`
- `FrictionPoint`
- `CalendarExport`

MVP may defer:

- Deep `IntegrationProvider` implementations
- Native alarms
- Team/shared workspaces
- Template marketplace
- Imported external calendars

---

## 23. Open Questions

1. Should `ExternalResource` live globally, per template, or both?
2. Should generated `ScheduledBlock` data be persisted or regenerated on demand?
3. Should rules be stored as user-editable JSON from the beginning?
4. Should sleep be a `BlockTemplate`, a special model, or both?
5. Should calendar export batches store event IDs after direct sync is added?
6. How much history should DayFrame preserve for missed/skipped blocks?
7. Should template sharing copy resources or strip private resource URLs?

---

## 24. Implementation Notes

Recommended order:

1. Define shared TypeScript types.
2. Implement date/time utility tests.
3. Implement user day and user week calculations.
4. Implement shift definitions and generated work blocks.
5. Implement block templates and recurrence.
6. Implement scheduled block generation.
7. Implement rules and friction points.
8. Implement calendar export mapping.

Do not build persistence before the basic model and engine tests are stable.
