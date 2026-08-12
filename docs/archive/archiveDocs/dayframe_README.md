# DayFrame

\*\*Built for life that doesn’t calendar and helps generate a realistic schedule based on:

- Shift cycles
- Custom day boundaries
- Custom week boundaries
- Priority-ranked time blocks
- Plain-language automation rules
- Transition periods between shifts
- External tools and resources attached to scheduled tasks

The core philosophy is simple:

> A users rules and constraints

- Suggested label: **Generate My DayFrame**

4. **Preview Schedule**

- Show Today view
- Show Week view
- Show Transition view
- Display block details, priorities, and attached resources

5. **Detect Friction**

- Flag overloaded days
- Flag insufficient sleep windows
- Flag unresolved conflicts
- Flag unplaced blocks
- Flag missing resources when helpful

6. **Suggest Fixes**

- Move lower-priority blocks
- Convert workouts to recovery blocks
- Skip optional blocks
- Ask the user to choose between conflicts
- Accept intentional conflicts

7. **Populate Calendar**

- MVP: export `.ics` calendar files
- Later: direct Google Calendar sync
- Future: Outlook, Apple Calendar, and other integrations

8. **Reminders and Triggers**

- Calendar reminders
- Internal schedule review prompts
- Future push notifications or native app alarms

---

## Day-One Must-Haves

The following concepts should be treated as foundational from the beginning:

- Mobile-first interface
- Current clock / time-aware dashboard
- Custom day boundary
- Custom week boundary
- Flexible cycle lengths
- Shift templates
- Block templates
- Priority-ranked blocks
- Plain-language rule system
- Transition-aware schedule generation
- Friction detection before calendar export
- Tool/resource attachments on blocks
- Calendar export

---

## Core Concepts

### Shift Cycle

A shift cycle is a user-defined period of time during which a user works a particular schedule.

Examples:

- 3 months on day shift
- 4 months on evening shift
- 2 weeks on nights
- Irregular custom rotation

The app must not hardcode quarterly schedules. Users need granular control over cycle length and segment dates.

### Day Boundary

A user day may begin at a time other than midnight.

Example:

> My day starts at 3:00 AM.

This means events between midnight and 2:59 AM may still belong to the previous user-defined day.

### Week Boundary

A user may define the start of their work week.

Example:

> My work week starts on Saturday.

This affects weekly planning, recurring rules, and timeline visualization.

### Block

A block is a unit of scheduled time.

Examples:

- Work
- Sleep
- Workout
- Walk
- Meal prep
- Grocery run
- Schedule review
- Chores
- Recovery

A block should include priority, duration, scheduling preferences, rescheduling behavior, and optional external resources.

### Priority

Priority determines how blocks behave during conflicts.

Example principle:

> A Priority 1 block may displace or reschedule a Priority 3 block.

Priority should be simple enough for users to understand but powerful enough to support automated conflict handling.

### Rule

Rules are plain-language scheduling behaviors that users can toggle or configure.

Examples:

- When a workout is missed, move it to the next available fitness window
- When sleep is under target, reduce next workout intensity
- When shift change is within 7 days, protect sleep and reduce workout load
- When two blocks overlap, keep the higher-priority block and reschedule the lower-priority block

The long-term direction is a Scratch-style modular rule builder, but MVP should start with a small set of built-in, easy-to-understand rules.

---

## Initial Technical Direction

Recommended starting stack:

- React
- TypeScript
- Vite
- Mobile-first responsive UI
- Local-first MVP storage
- Later cloud persistence through Supabase or Firebase
- Calendar export through `.ics`
- Later Google Calendar integration through OAuth and Calendar API

The first implementation should focus on the scheduling engine before deep third-party integrations.

---

## Scope Guardrails

The MVP should not attempt to support every external API immediately.

### In Scope for MVP

- Manual shift-cycle creation
- Custom day boundary
- Custom week boundary
- Block templates
- Priority system
- Basic rule engine
- Transition-aware schedule generation
- Tool/resource links attached to blocks
- Schedule preview
- Basic friction detection
- `.ics` export

### Not in Scope for MVP

- Full workout app integration
- Full meal planner integration
- Native alarm-clock control
- Team scheduling
- Employer dashboards
- Marketplace/community templates
- Complex AI scheduling
- Deep analytics

These can be revisited after the core engine proves useful.

---

## Suggested Documentation Set

This repository should eventually include the following project documents:

- `README.md` System architecture and technical design
- `core_engine.md` Type and entity definitions
- `rules_system.md` User workflow and screen-level flow
- `features.md` Mobile-first interface principles
- `integrations.md` Development phases and release path

---

## Product Language

Preferred app language:

- Build your DayFrame
- Generate My DayFrame
- Preview your DayFrame
- Apply to Calendar
- Friction points
- Transition window
- User day
- Shift cycle
- Attached resources

Avoid making the app feel like a generic calendar clone. DayFrame should feel like a planning layer built for people whose schedules change rhythm.

---

## Guiding Principle

> DayFrame should help users prepare their life for schedule changes before those changes become stressful.
