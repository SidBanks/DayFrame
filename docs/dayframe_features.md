# DayFrame Features

**Product:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Spec:** Feature definition and scope control  
**Status:** Draft v0.1  
**Purpose:** Clearly define what DayFrame includes in MVP, what comes later, and what is intentionally excluded.

---

## 1. Purpose

This file exists to prevent scope creep.

DayFrame has a large surface area:

- Scheduling
- Rules engine
- Visualization
- Integrations
- Notifications
- Templates
- Data syncing

Without strict boundaries, the project will expand too quickly.

This file defines:

- What MUST be built now (MVP)
- What SHOULD be built later (V1 / V2)
- What is explicitly OUT of scope

---

## 2. Feature Philosophy

DayFrame should:

- Solve real shift-work problems first
- Be usable daily within 30 seconds
- Avoid overwhelming configuration
- Be predictable and explainable
- Focus on scheduling intelligence, not replacing every tool

---

## 3. MVP Features (Strict)

These features must exist in the first working version.

---

### 3.1 Core Scheduling

- Custom day boundary (e.g., 3:00 AM start)
- Custom week boundary (e.g., Saturday start)
- Timezone-aware scheduling

---

### 3.2 Shift System

- Create shift definitions
- Assign work days
- Support shifts that cross midnight
- Create shift cycles using date segments
- Support arbitrary cycle lengths (3 months, 4 months, custom)

---

### 3.3 Block Templates

- Create flexible blocks (workout, meals, chores, etc.)
- Assign:
  - duration
  - priority (1–5)
  - category
  - preferred timing window
  - reschedule behavior
- Enable/disable blocks

---

### 3.4 Resource Attachments

- Attach URL
- Attach note
- Attach checklist
- Mark block as requiring a resource
- Show resource in preview and calendar export

---

### 3.5 Rule Engine (Basic)

Built-in rules only:

- Priority-based conflict resolution
- Missed block handling (manual)
- Bad sleep adjustment (manual input)
- Shift-change transition handling
- Resource-missing warnings
- Schedule review block creation

Rules must be:

- deterministic
- toggleable
- explainable

---

### 3.6 Schedule Generation

- Generate schedule for:
  - next 7 days
  - next 30 days
  - through next transition
- Place fixed blocks (work)
- Place flexible blocks by priority
- Apply rules
- Detect transition windows

---

### 3.7 Preview System

- Today view
- Week view
- Transition view
- Block details (including resources)
- Rule explanations

---

### 3.8 Friction Detection

Detect and display:

- insufficient sleep windows
- overlapping priority conflicts
- blocks that could not be scheduled
- overloaded transition periods
- missing required resources

Each friction point includes:

- severity
- explanation
- suggested fixes

---

### 3.9 Fix System

User can:

- move blocks
- skip blocks
- convert workouts to recovery
- reduce duration
- add resources
- accept conflicts

---

### 3.10 Calendar Export

- Generate `.ics` file
- Include:
  - title
  - time
  - description
  - attached resources
  - rule explanations (optional text)

---

### 3.11 Manual Tracking

- Mark block complete
- Mark block missed
- Skip block
- Trigger reschedule behavior

---

### 3.12 Basic Reminders

- Calendar-based reminders (via `.ics`)
- Simple reminder timing (e.g., 15 min before)

---

## 4. V1 Features (Next Phase)

These are high-priority but not MVP.

---

### 4.1 Account + Persistence

- User accounts
- Cloud sync
- Multi-device access

---

### 4.2 Google Calendar Integration

- OAuth login
- Push events directly
- Update existing events

---

### 4.3 Improved Notifications

- Push notifications
- Repeat reminders
- Escalation if ignored

---

### 4.4 Template Sharing

- Share templates via link
- Import templates
- Copy templates to account

---

### 4.5 Rule Customization

- Allow users to adjust rule settings
- Simple UI for rule toggles
- Limited customization of conditions/actions

---

### 4.6 Better Tracking

- Track completed vs missed blocks
- Weekly summary
- Basic insights

---

## 5. V2 Features (Expansion)

These are long-term features.

---

### 5.1 Visual Rule Builder (Scratch-style)

- Drag-and-drop rule creation
- WHEN / IF / THEN blocks
- User-defined logic

---

### 5.2 Deep Integrations

- Google Tasks
- Notion
- Todoist
- Fitness apps
- Meal planning apps

---

### 5.3 Native Mobile App

- iOS and Android builds
- Native alarms
- Background scheduling

---

### 5.4 Smart Suggestions

- Suggest schedule improvements
- Suggest better block placement
- Suggest transition strategies

---

### 5.5 Analytics Dashboard

- Sleep consistency
- Workout adherence
- Schedule friction trends

---

### 5.6 Team / Shared Scheduling

- Shared household schedules
- Work team coordination
- Supervisor planning tools

---

## 6. Explicitly Out of Scope (MVP)

Do NOT build these in MVP:

- AI-generated schedules
- Full visual programming environment
- Payroll/time tracking
- Employer integration systems
- Medical-grade sleep tracking
- Wearable integrations
- Social features
- Messaging/chat systems
- Marketplace/community hub
- Highly detailed analytics

---

## 7. Feature Prioritization Principles

When deciding what to build:

1. Does this solve shift-change friction?
2. Does this reduce daily mental load?
3. Can this be used in under 30 seconds?
4. Does this keep the app simple?
5. Can this wait until after MVP?

If a feature fails these, it should be delayed.

---

## 8. MVP Acceptance Criteria

The MVP is successful when a user can:

1. Define their day boundary.
2. Define their week boundary.
3. Create multiple shift types.
4. Build a shift cycle with custom segment lengths.
5. Create and prioritize blocks.
6. Attach resources to blocks.
7. Generate a schedule.
8. See transition-aware preview.
9. See friction warnings.
10. Fix or accept issues.
11. Export to calendar.
12. Understand why changes occurred.

---

## 9. Open Questions

1. Should reminders be configurable per block or global in MVP?
2. Should missed block tracking persist between sessions before accounts exist?
3. Should resource attachments allow multiple links per block?
4. Should the app support offline-only mode at launch?
5. Should `.ics` export include categories/tags?
6. Should blocks support color coding in MVP?
7. Should users be able to duplicate templates easily?

---

## 10. Summary

DayFrame MVP should:

- Solve transition pain
- Reduce planning friction
- Provide clear previews
- Stay simple

Everything else comes later.

---

**Reminder:**
If it doesn’t directly improve how someone survives a shift change, it probably doesn’t belong in MVP.
