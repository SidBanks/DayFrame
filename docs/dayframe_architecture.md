# DayFrame Architecture

**Product:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Spec:** Technical architecture  
**Status:** Draft v0.1  
**Purpose:** Define the system architecture for DayFrame before implementation.

---

## 1. Architecture Philosophy

DayFrame should be built as a mobile-first scheduling engine with a simple interface layered on top.

The architecture must support:

- Mobile-first use
- Local-first schedule generation
- Future cloud sync
- Future account-based persistence
- Future calendar API integration
- Clear separation between scheduling logic and UI
- Strong test coverage for date/time and rule behavior

The engine must be reliable before the app is visually polished.

---

## 2. Recommended Tech Stack

### Frontend

Recommended:

- Vite
- React
- TypeScript
- Zustand or another lightweight state store
- CSS Modules or scoped styling
- Vitest for tests

Rationale:

- Familiar from SudZ
- Fast iteration
- Strong TypeScript support
- Easy path toward PWA or Capacitor mobile wrapper later

---

## 3. Mobile-First Delivery Strategy

DayFrame should start as a responsive web app.

Recommended path:

### Phase 1

- Mobile-first responsive web app
- Local persistence
- `.ics` export

### Phase 2

- PWA install support
- Cloud sync
- Push notifications

### Phase 3

- Capacitor wrapper or native app
- Stronger notification/alarm behavior
- App store distribution

---

## 4. System Layers

DayFrame should be separated into clear layers.

```text
UI Layer
  ↓
Application State Layer
  ↓
Core Engine Layer
  ↓
Persistence Layer
  ↓
Integration Layer
```

---

## 5. UI Layer

The UI layer renders:

- Today view
- Week view
- Transition view
- Generate flow
- Template editor
- Settings
- Friction review
- Calendar export controls

The UI must not contain scheduling business logic.

Bad:

```ts
// UI directly decides conflict rules
if (workout.priority > sleep.priority) ...
```

Good:

```ts
const result = generateSchedule(input);
```

---

## 6. Application State Layer

The application state layer stores:

- User settings
- Shift definitions
- Shift cycles
- Block templates
- Rules
- Generated preview
- Friction points
- Export status

Recommended early state approach:

- Zustand store
- Typed selectors
- Small focused actions
- Local persistence for MVP

---

## 7. Core Engine Layer

The core engine is the heart of DayFrame.

It should be framework-independent TypeScript.

It should not depend on React.

Suggested location:

```text
src/core/
```

Suggested modules:

```text
src/core/time/
src/core/schedule/
src/core/rules/
src/core/friction/
src/core/export/
```

The engine should handle:

- User day calculation
- User week calculation
- Shift block generation
- Block placement
- Priority conflicts
- Transition detection
- Rule evaluation
- Friction detection
- Calendar export mapping

---

## 8. Persistence Layer

MVP should start local-first.

### MVP

- Local storage or IndexedDB
- Persist user settings
- Persist shift definitions
- Persist block templates
- Persist rules
- Persist latest generated preview if useful

### V1

- Cloud persistence
- User accounts
- Multi-device sync

Recommended future backend:

- Supabase

Rationale:

- Auth
- Postgres
- Row Level Security
- Structured relational data fits DayFrame well

Alternative:

- Firebase

Rationale:

- Fast MVP auth/cloud sync
- Flexible document storage

Recommendation:

- Build MVP local-first.
- Design types so migration to Supabase is straightforward.

---

## 9. Integration Layer

MVP integrations should be passive.

Include:

- External resource links
- Notes
- Checklists
- `.ics` export

Future integrations:

- Google Calendar
- Outlook
- Apple Calendar
- Google Tasks
- Notion
- Todoist

Integration code should be isolated.

Suggested location:

```text
src/integrations/
```

Examples:

```text
src/integrations/calendar/ics.ts
src/integrations/calendar/google.ts
src/integrations/resources/resources.ts
```

---

## 10. Calendar Export Architecture

Calendar export should be generated from `ScheduledBlock` data.

Flow:

```text
ScheduledBlock[]
  → CalendarEventDraft[]
  → ICS file
```

Future Google sync flow:

```text
ScheduledBlock[]
  → CalendarEventDraft[]
  → Google Calendar API
```

This keeps export and sync using the same intermediate event model.

---

## 11. Clock and Time Architecture

Clock functionality is a day-one requirement.

The clock system should support:

- Current real time
- User timezone
- Current user day
- Current block
- Next block
- Countdown to next block
- Transition countdown

Suggested module:

```text
src/core/time/clock.ts
```

Clock logic should be testable and separated from UI rendering.

---

## 12. Rule Engine Architecture

Rules should be evaluated in the core layer.

Suggested location:

```text
src/core/rules/
```

Suggested modules:

```text
types.ts
evaluateRules.ts
conflictRules.ts
transitionRules.ts
recoveryRules.ts
resourceRules.ts
explanations.ts
```

Rules should return:

- Modified scheduled blocks
- Friction points
- Rule explanations

Rules should not directly mutate UI state.

---

## 13. Schedule Generation Architecture

Schedule generation should be deterministic.

Same input should produce same output.

Suggested input:

```ts
type GenerateScheduleInput = {
  userProfile: UserProfile;
  shiftDefinitions: ShiftDefinition[];
  shiftCycle: ShiftCycle;
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
  rules: Rule[];
  planningWindowStart: string;
  planningWindowEnd: string;
};
```

Suggested output:

```ts
type GenerateScheduleResult = {
  scheduledBlocks: ScheduledBlock[];
  frictionPoints: FrictionPoint[];
  ruleExplanations: RuleExplanation[];
  calendarEventDrafts: CalendarEventDraft[];
};
```

---

## 14. Data Flow

Recommended generate flow:

```text
User taps Generate My DayFrame
  ↓
Store builds GenerateScheduleInput
  ↓
Core engine generates schedule result
  ↓
Store saves preview result
  ↓
UI renders preview + friction
  ↓
User fixes or accepts
  ↓
Export layer creates .ics
```

---

## 15. Testing Strategy

The engine must be heavily tested.

### Required test areas

- User day boundary
- User week boundary
- Overnight shifts
- Shift cycle segments
- Transition detection
- Priority conflict resolution
- Reschedule behavior
- Bad sleep adjustment
- Missing resource friction
- Calendar event mapping

### Testing priority

1. Core engine tests
2. Rule tests
3. Export tests
4. Store tests
5. UI tests

Do not rely on manual UI testing for date/time correctness.

---

## 16. Suggested Folder Structure

```text
src/
  app/
    App.tsx

  core/
    time/
      userDay.ts
      userWeek.ts
      clock.ts
    schedule/
      generateSchedule.ts
      placeFixedBlocks.ts
      placeFlexibleBlocks.ts
      transitions.ts
    rules/
      types.ts
      evaluateRules.ts
      conflictRules.ts
      recoveryRules.ts
      transitionRules.ts
      resourceRules.ts
      explanations.ts
    friction/
      detectFriction.ts
    export/
      calendarEventDraft.ts
      ics.ts

  state/
    store.ts
    selectors.ts

  ui/
    today/
    plan/
    generate/
    templates/
    settings/
    shared/

  integrations/
    calendar/
    resources/

  tests/
```

---

## 17. Backend Strategy

Do not start with a backend unless the MVP explicitly requires cross-device sync from day one.

Recommended sequence:

### Local-first MVP

- Faster build
- Fewer auth/security concerns
- Easier engine testing
- Good for personal dogfooding

### Cloud V1

Add:

- Auth
- User profiles
- Cloud persistence
- Multi-device sync
- Template sharing

### Likely backend choice

Supabase is recommended for V1 because DayFrame data is relational:

- Users
- Shift definitions
- Shift cycles
- Block templates
- Scheduled blocks
- Rules
- Resources

---

## 18. Security Considerations

When cloud sync is added:

- Require authenticated users
- Use row-level access rules
- Users can only access their own private data
- Shared templates must strip private resources unless explicitly included
- OAuth calendar permissions should be minimal
- Never expose tokens to the client insecurely

MVP local-only version should still avoid storing sensitive tokens because it should not use OAuth yet.

---

## 19. Offline Considerations

DayFrame should eventually work well offline.

Local-first architecture supports:

- Viewing current schedule
- Opening saved block resources
- Editing templates
- Generating schedules locally
- Exporting when online again

External links may require connectivity.

---

## 20. Performance Considerations

Schedule generation should be efficient for common planning windows.

MVP target windows:

- 7 days
- 30 days
- Through next transition

Avoid generating years of detailed blocks unless needed.

For long-range views, generate summaries rather than full event detail if necessary.

---

## 21. MVP Architecture Scope

Include:

- React/Vite/TypeScript app
- Mobile-first UI structure
- Local persistence
- Core engine modules
- Rule evaluator
- Friction detector
- ICS export
- Test suite

Do not include:

- Backend auth
- OAuth calendar sync
- Push notifications
- Native app wrapper
- Team scheduling
- Deep third-party integrations

---

## 22. Architecture Acceptance Criteria

The architecture is successful when:

1. Core scheduling logic can run without React.
2. Date/time behavior is unit tested.
3. User day and user week are independent of calendar defaults.
4. Shift cycles can be generated from arbitrary date segments.
5. The rule engine can modify schedule output predictably.
6. Friction detection is separate from UI.
7. Calendar export uses the same scheduled block data as preview.
8. Future cloud sync can be added without rewriting the engine.
9. Future Google Calendar sync can reuse event draft mapping.
10. The app can be dogfooded locally before backend work begins.

---

## 23. Open Questions

1. Should MVP include local-only mode, or should accounts be introduced immediately?
2. Should DayFrame use IndexedDB instead of localStorage from the start?
3. Should generated scheduled blocks be persisted, or regenerated from source inputs?
4. Should the engine support multiple active cycles at once?
5. Should calendar export preserve event IDs for later sync migration?
6. Should the app become a PWA before or after first MVP dogfooding?
7. Should Capacitor be planned immediately given mobile-first goals?

---

## 24. Summary

DayFrame architecture should protect the core idea:

> A reliable scheduling engine wrapped in a calm mobile-first interface.

Build the engine first.

Keep integrations isolated.

Start local-first unless cross-device sync becomes mandatory for MVP.

Design every layer so future cloud sync and calendar APIs can be added without rewriting the scheduling core.
