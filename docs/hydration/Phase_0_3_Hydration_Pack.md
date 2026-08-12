# DayFrame Hydration Pack — Phase 0.3 Start

**Date:** 2026-05-02  
**Project:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Current phase:** Phase 0.3 — Shift Cycles  
**Purpose:** Rehydrate a new ChatGPT/Codex session with the current product direction, specs, code state, tooling state, and next handoff.

---

## 1. Product Identity

**Name:** DayFrame  
**Domain chosen:** thedayframe.com  
**Tagline:** Built for life that doesn’t run 9 to 5.

DayFrame is a mobile-first, shift-aware life scheduling app for people whose real lives do not fit standard midnight-to-midnight calendar assumptions.

The core product idea:

> DayFrame helps users frame their day around real life, rotating shifts, transition periods, sleep needs, priorities, and the tools they already use.

This is not just a calendar app. It is a shift-aware life orchestration layer.

---

## 2. Core User Pain Points

The founding pain points came from rotating shift work.

The user works one of three shifts, usually changing every 3 months:

1. **Day Shift**
   - 05:45–14:15
   - Monday–Friday

2. **Evening Shift**
   - 13:45–22:15
   - Monday–Friday

3. **Night Shift**
   - 21:45–06:15
   - Sunday–Thursday
   - Crosses midnight

Primary problems:

- Shift transitions compress weekends.
- Sleep cycles must transition between shifts.
- Personal goals still need to be maintained.
- Life maintenance has to be handled in limited windows.
- Existing tools are fragmented: calorie counters, workout apps, meal planners, calendars, notes, chat/collaboration tools.
- The user wants one clean interface that coordinates time and links out to the tools needed to complete each block.

---

## 3. Core Product Principles

DayFrame should:

- Be mobile-first from day one.
- Treat the user’s real day as configurable, not fixed to midnight.
- Allow custom week starts.
- Support flexible shift cycle lengths, not just quarters.
- Support 3-month, 4-month, custom, and irregular shift cycles.
- Use priorities and rule-based logic to decide what moves, what stays, and what gets flagged.
- Use plain-language rules first.
- Eventually support Scratch-like modular rule building.
- Let users attach tools/resources to blocks.
- Preview schedules before populating calendars.
- Detect friction before the user commits.
- Export/sync to calendars later.

---

## 4. Key Differentiators

DayFrame’s strongest unique features:

1. **Custom day boundaries**
   - Example: user day starts at 03:00.

2. **Custom week boundaries**
   - Example: work week starts Saturday.

3. **Shift-cycle awareness**
   - Cycles can be 3 months, 4 months, custom, or irregular.

4. **Transition-aware planning**
   - The app knows a shift change is coming and can taper workouts, protect sleep, and move life maintenance earlier.

5. **Priority-based scheduling**
   - Example: Priority 1 overrides Priority 3.

6. **Plain-language rule engine**
   - WHEN / IF / THEN logic.
   - MVP uses built-in toggleable rules.
   - Future version can use Scratch-style modular visual rules.

7. **Tool/resource attachments**
   - Blocks can contain URLs, notes, and checklists.
   - Example: workout block links to workout plan; meal prep block links to grocery list.

8. **Preview + friction detection**
   - Generate schedule.
   - Preview it.
   - Show friction points.
   - Offer fixes.
   - Only then export/sync.

---

## 5. Locked Workflow

Core workflow:

```text
Set Up → Build Templates → Attach Tools → Generate → Preview → Fix Friction → Add to Calendar
```

More detailed:

1. Set up user rhythm:
   - Time zone
   - Day boundary
   - Week boundary
   - Sleep target
   - Default transition strategy

2. Define shifts:
   - Name
   - Start/end time
   - Work days
   - Crosses midnight

3. Define cycles:
   - Shift segments with start/end dates
   - Segment length can be 3 months, 4 months, or custom

4. Create block templates:
   - Sleep
   - Workouts
   - Walking
   - Meal prep
   - Chores
   - Schedule review
   - Wind-down
   - Medication/supplements

5. Attach resources:
   - URL
   - Notes
   - Checklist

6. Generate My DayFrame:
   - Apply boundaries
   - Generate work blocks
   - Apply cycle logic
   - Apply priorities/rules
   - Detect friction

7. Preview:
   - Today view
   - Week view
   - Transition view

8. Fix friction:
   - Move block
   - Skip block
   - Convert workout to recovery
   - Reduce duration
   - Add missing resource
   - Accept conflict

9. Calendar output:
   - MVP: `.ics`
   - Later: Google Calendar sync
   - Later: Outlook / Apple Calendar

---

## 6. Spec Files Created

The following DayFrame spec/handoff files have already been generated during this conversation:

1. `dayframe_README.md` — Product identity / rehydration anchor.
2. `dayframe_core_engine.md` — Core scheduling brain.
3. `dayframe_data_model.md` — UserProfile, ShiftDefinition, ShiftCycle, ShiftSegment, BlockTemplate, ScheduledBlock, Rule, FrictionPoint, ExternalResource, CalendarExport.
4. `dayframe_rules_system.md` — Plain-language rule model, priority interactions, built-in MVP rules, future Scratch-style visual rule builder.
5. `dayframe_workflow.md` — End-to-end user journey.
6. `dayframe_features.md` — MVP/V1/V2 feature scope.
7. `dayframe_ui_ux.md` — Mobile-first UI/UX direction.
8. `dayframe_integrations.md` — Passive integrations first, `.ics`, later APIs.
9. `dayframe_architecture.md` — React/Vite/TypeScript, core engine separate from UI, local-first MVP, future Supabase/cloud sync.
10. `dayframe_roadmap.md` — Phase roadmap.
11. `dayframe_hydration_snapshot.md` — Earlier shorter snapshot.

This file is the current fuller hydration pack.

---

## 7. Development Tooling State

The project initially missed `package.json`, lint, typecheck, and formatting scripts. That has been corrected.

Current intended `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```

Dev dependencies installed or expected:

- `typescript`
- `vitest`
- `eslint`
- `@eslint/js`
- `typescript-eslint`
- `@types/node`
- `prettier`

TypeScript is set up for NodeNext / strict TypeScript.

Important lessons learned:

- With `moduleResolution: "NodeNext"` and ESM, relative imports should use `.js` extensions in TypeScript source.
- Example:

```ts
import { getUserDayDate } from "../userDay.js";
```

Prettier is set up and running.

`.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100
}
```

`.prettierignore` should be plain text:

```text
node_modules
dist
coverage
```

---

## 8. Coding Standards

For DayFrame:

- TypeScript only.
- No `any`.
- camelCase property names.
- Strict TS checks.
- Engine code must not depend on React.
- Use `.js` import extensions due to NodeNext.
- Prefer small, tested core utilities.
- Build engine before UI.
- Format with Prettier.
- Run:

```bash
npm run format
npm run test
npm run typecheck
npm run lint
```

---

## 9. Phase 0.1 Completed — Time Foundation

Phase 0.1 added:

```text
src/core/time/types.ts
src/core/time/userDay.ts
src/core/time/userWeek.ts
src/core/time/__tests__/userDay.test.ts
src/core/time/__tests__/userWeek.test.ts
```

### Core types

```ts
export type Weekday =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type TimeString = `${number}:${number}`;

export type ParsedTime = {
  hours: number;
  minutes: number;
  totalMinutes: number;
};

export type UserDayBoundary = {
  dayBoundaryStartTime: TimeString;
};

export type UserWeekBoundary = {
  weekStartsOn: Weekday;
};

export type UserTimePreferences = UserDayBoundary & UserWeekBoundary;

export type UserDayRange = {
  userDayDate: string;
  start: Date;
  end: Date;
};

export type UserWeekRange = {
  userWeekStartDate: string;
  start: Date;
  end: Date;
};
```

### userDay behavior

Implemented:

- `parseTimeString`
- `getUserDayStart`
- `getUserDay`
- `getUserDayDate`
- `isSameUserDay`
- `formatLocalDate`

Important behavior:

- If `dayBoundaryStartTime = "3:00"`:
  - `2026-05-01 01:30` belongs to `2026-04-30`
  - `2026-05-01 03:00` belongs to `2026-05-01`
- `"0:00"` behaves like a normal calendar day.
- Local date formatting is used, avoiding UTC `toISOString()` date-shift bugs.

### userWeek behavior

Implemented:

- `getUserWeekStart`
- `getUserWeek`
- `getUserWeekStartDate`
- `isSameUserWeek`
- `getWeekdayIndex`
- `getWeekdayFromDate`

Important behavior:

- User week is resolved after resolving user day.
- Saturday-start weeks work.
- Early morning before day boundary on week-start day still belongs to previous user week.

### Test cleanup

Tests were converted fully to Vitest after an initial mixed `node:test`/Vitest issue.

Tests should:

```ts
import { describe, expect, it } from "vitest";
```

Avoid `node:test` and `node:assert/strict`.

Use `.js` import extensions.

Checks were green after cleanup.

---

## 10. Phase 0.2 Completed — Shift Definitions + Overnight Work Blocks

Phase 0.2 added:

```text
src/core/shifts/types.ts
src/core/shifts/generateWorkBlocks.ts
src/core/shifts/__tests__/generateWorkBlocks.test.ts
```

### `src/core/shifts/types.ts`

Current key types:

```ts
import type { TimeString, Weekday } from "../time/types.js";

export type LocalDateString = `${number}-${number}-${number}`;

export type ShiftDefinition = {
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

export type GeneratedWorkBlock = {
  id: string;
  shiftDefinitionId: string;
  userId: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  startDate: LocalDateString;
  endDate: LocalDateString;
  userDayDate: LocalDateString;
  crossesMidnight: boolean;
};

export type GenerateWorkBlocksInput = {
  shiftDefinition: ShiftDefinition;
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime: TimeString;
};
```

Earlier version had `startsOnDate` and `endsOnDate`, but these were removed after the generator shifted to true planning-window logic.

### `generateWorkBlocks` behavior

Implemented:

- Validate planning window.
- Validate shift definition.
- Generate candidate dates based on planning window.
- Include one day before the planning window to catch overnight blocks that start before the window and end inside it.
- Generate a work block for each candidate date whose weekday is in the shift’s `workDays`.
- Create start/end Date objects using local time construction.
- If `endTime <= startTime`, shift ends next calendar day.
- Calculate `userDayDate` from `startsAt`.
- Include blocks only if they overlap the planning window.
- Return chronological blocks.

Important overlap logic:

```ts
workBlock.startsAt.getTime() < planningWindowEnd.getTime() &&
workBlock.endsAt.getTime() > planningWindowStart.getTime()
```

Important behavior:

- Work days refer to the **shift start day**.
- Night shift Thursday 21:45–Friday 06:15 belongs to Thursday’s shift.
- Night shifts can be included in a Friday planning window if they started Thursday and end Friday.
- The generator is now time-window aware, not merely date-range aware.

Phase 0.2 status: user reported “We’re good,” meaning format/test/typecheck/lint were green.

---

## 11. Current Phase — Phase 0.3 Start

The user asked to start Phase 0.3.

Phase 0.3 goal:

> Add shift cycle support so DayFrame can generate work blocks across multiple shift segments.

This is the bridge from one shift definition to a real rotating schedule made of multiple date-bounded shift segments.

---

## 12. Phase 0.3 Codex Handoff

Use this as the immediate next implementation prompt.

```md
# DayFrame Phase 0.3 — Shift Cycles

## Goal

Add shift cycle support so DayFrame can generate work blocks across multiple shift segments.

This phase should support:

1. Multiple shift definitions
2. A shift cycle made of date-bounded segments
3. Finding the active shift segment for a date
4. Generating work blocks across a planning window
5. Handling segment boundaries cleanly

No UI yet.

---

## Files to create

```text
src/core/cycles/types.ts
src/core/cycles/getActiveShiftSegment.ts
src/core/cycles/generateCycleWorkBlocks.ts
src/core/cycles/__tests__/getActiveShiftSegment.test.ts
src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts
```

You may import from:

```text
src/core/time/
src/core/shifts/
```

Use `.js` import extensions because the project uses NodeNext.

---

## Types

Create:

```ts
import type { LocalDateString, ShiftDefinition } from "../shifts/types.js";
import type { TimeString } from "../time/types.js";

export type ShiftSegment = {
  id: string;
  shiftDefinitionId: string;
  startsOnDate: LocalDateString;
  endsOnDate: LocalDateString;
  transitionStrategyId?: string;
  notes?: string;
};

export type ShiftCycle = {
  id: string;
  userId: string;
  name: string;
  segments: ShiftSegment[];
};

export type GenerateCycleWorkBlocksInput = {
  shiftCycle: ShiftCycle;
  shiftDefinitions: ShiftDefinition[];
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime: TimeString;
};
```

---

## Active segment behavior

Implement:

```ts
export function getActiveShiftSegment(input: {
  shiftCycle: ShiftCycle;
  date: Date;
}): ShiftSegment | null;
```

Behavior:

- Convert `date` to local `YYYY-MM-DD`.
- Return the segment where:

```text
segment.startsOnDate <= date <= segment.endsOnDate
```

- If no segment matches, return `null`.
- If multiple segments match, throw an error because overlapping segments are invalid.

---

## Cycle work block generation

Implement:

```ts
export function generateCycleWorkBlocks(
  input: GenerateCycleWorkBlocksInput,
): GeneratedWorkBlock[];
```

Behavior:

1. Validate planning window.
2. For each segment that overlaps the planning window by date:
   - Find its matching `ShiftDefinition`.
   - Generate work blocks using existing `generateWorkBlocks`.
3. Return all blocks sorted chronologically by `startsAt`.

Important:

A segment’s date range should limit which shift start days are considered.

Example:

```text
Segment A: 2026-01-01 to 2026-03-31
Segment B: 2026-04-01 to 2026-06-30
```

A night shift starting on 2026-03-31 and ending 2026-04-01 belongs to Segment A because its shift start day is 2026-03-31.

---

## Segment overlap

A segment should be considered relevant if its date range may produce blocks that overlap the planning window.

Be careful with overnight shifts. It is acceptable to include one extra candidate day before the planning window when generating segment work blocks, as `generateWorkBlocks` already does planning-window overlap filtering.

---

## Tests

### 1. Active segment lookup

Test:

- Date inside first segment returns first segment
- Date inside second segment returns second segment
- Date before all segments returns `null`
- Date after all segments returns `null`
- Overlapping segments throw an error

### 2. Cycle work block generation

Use three shifts:

```text
Day Shift: 05:45–14:15 Monday–Friday
Evening Shift: 13:45–22:15 Monday–Friday
Night Shift: 21:45–06:15 Sunday–Thursday
```

Create a cycle:

```text
2026-01-01–2026-03-31: Day Shift
2026-04-01–2026-06-30: Evening Shift
2026-07-01–2026-09-30: Night Shift
```

Test:

- Planning window inside day segment generates day shift blocks
- Planning window inside evening segment generates evening shift blocks
- Planning window inside night segment generates overnight blocks
- Planning window crossing segment boundary generates blocks from both segments
- Blocks are sorted chronologically

### 3. Segment boundary ownership

Test:

- A night shift starting on the final date of a segment belongs to that segment even if it ends the next calendar day.

### 4. Missing shift definition

If a segment references a missing shift definition:

- Throw a clear error

---

## Verify

Run:

```bash
npm run format
npm run test
npm run typecheck
npm run lint
```

---

## Acceptance Criteria

- Shift cycles support multiple date-bounded segments
- Active segment lookup works
- Overlapping segments are rejected
- Missing shift definitions produce a clear error
- Work blocks generate across planning windows
- Boundary-crossing windows include correct shifts
- Overnight shifts preserve start-day ownership
- Blocks are sorted chronologically
- Tests/typecheck/lint all pass
```

---

## 13. Important Design Note for Phase 0.3

Be careful about segment boundary ownership.

For night shifts:

- The segment is based on the **shift start date**, not the shift end date.
- Example:
  - Segment A ends `2026-03-31`
  - Night shift starts `2026-03-31 21:45`
  - It ends `2026-04-01 06:15`
  - It still belongs to Segment A.

This mirrors the Phase 0.2 rule:

> Work days refer to shift start days.

---

## 14. Likely Phase 0.3 Review Points

When Codex returns the diff, inspect:

1. Does `getActiveShiftSegment` use `formatLocalDate(date)` or equivalent local formatting?
2. Does it detect overlapping segments and throw?
3. Does it return `null` for no match?
4. Does `generateCycleWorkBlocks` respect segment start/end dates?
5. Does it avoid generating blocks outside the segment’s shift start date range?
6. Does it preserve overnight start-day ownership?
7. Are results sorted by `startsAt`?
8. Are `.js` import extensions used?
9. Are tests Vitest-only?
10. Do checks pass?

---

## 15. Next Phase After 0.3

If Phase 0.3 is completed cleanly, next likely phase:

### Phase 0.4 — Block Templates + Flexible Block Model

This would introduce:

- BlockTemplate
- priority 1–5
- placement type
- duration
- preferred window
- recurrence
- reschedule behavior
- external resources

Do not jump there until Phase 0.3 is green.

---

## 16. User Preferences / Workflow Notes

The user prefers:

- Clean Codex handoff blocks after explanations.
- Hands-on implementation, with Codex doing patches and ChatGPT reviewing.
- Small phases, tested and green before moving on.
- No overbuilding.
- No UI until the engine is solid.
- Underscores for spec file names.
- Strong scope control, similar to SudZ.
- Reminder: when explaining a code review issue, include a clean handoff to Codex immediately afterward.

Specific new preference from this conversation:

> Always show the handoffs to Codex after explaining changes.

This should be followed going forward.

---

## 17. Current Checkpoint Summary

DayFrame is now build-ready and already has:

- Full spec pack
- Full product direction
- Tooling scaffold
- Formatting
- Typecheck/lint/test scripts
- Phase 0.1 time foundation complete
- Phase 0.2 shift generator complete
- Phase 0.3 handoff ready

Current instruction to resume:

> Start or continue Phase 0.3 using the Codex handoff above.

---

## 18. One-Line Rehydration Prompt

Use this in a new tab if needed:

```text
We are building DayFrame, a mobile-first shift-aware scheduling app. Specs are complete. Phase 0.1 time boundary utilities and Phase 0.2 shift/overnight work block generation are done and green. We are starting Phase 0.3: shift cycles, active segment lookup, and generating work blocks across date-bounded shift segments. Please continue with small tested Codex handoffs and always include clean Codex handoff blocks after explaining changes.
```
