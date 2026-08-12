# UX Implementation Alignment Audit 01

## Phase 1 — User Mental Model

**Normative source:** `DayFrame UX Interaction Specification.md`, Chapter IV — User Mental Model  
**Implementation scope:** `code/src/**`  
**Audit date:** 2026-07-30  
**Method:** Executable implementation and automated tests only

## Executive Findings

The current implementation communicates DayFrame primarily as a **schedule setup and deterministic
preview tool for shift-based life planning**.

A brand-new user opens directly into a populated **Setup** workspace. The interface asks the user to
edit schedule preferences, preview range, shifts, cycles, templates, and recurrences, then select
**Generate Preview**. The generated result is consistently described as a preview or draft
schedule. It displays work blocks, generated life blocks, manual events, unplaced candidates,
friction, warnings, and suggested fixes.

The strongest parts of the approved mental model currently communicated are:

- the user supplies the planning inputs;
- the system generates a schedule from those inputs;
- generated output is a draft preview rather than an authoritative command;
- conflicts are surfaced as “friction” with explanatory messages;
- suggested fixes require a user click;
- users can return to Setup, edit inputs, and regenerate; and
- the preview explicitly states that it does not save or export anything to a calendar.

The current interface only partially communicates collaboration. The implemented relationship is:

```text
User configures schedule inputs
        ↓
System generates a schedule preview
        ↓
User reviews friction and applies a fix or edits Setup
        ↓
System revises or regenerates the preview
```

The approved continuous relationship—
**user teaches → system plans → user lives → system learns**—is not presented as a complete cycle.
Teach and Plan are behaviorally present but are not named. Live and Learn are absent.

The dominant mental-model divergence is the first-use and navigation language. The application is
organized around **Setup** and **Generate Preview**, not Teach, Plan, Live, and Learn or equivalent
planning conversations. The setup surface explicitly calls itself “Setup,” describes “schedule
inputs,” and exposes numerous configuration fields. A reasonable first-time user is therefore more
likely to understand DayFrame as a configurable scheduling engine than as an ongoing collaborative
planning system that becomes more informed through lived experience.

There is no implemented plan-acceptance workflow, execution workflow, historical record, reflection
workflow, or learning feedback loop. Planned work and manual events are visibly distinguished, but
planned work and executed reality are not.

**Overall alignment assessment: Partially Aligned.**

## Evidence by Investigation Area

### 1. First Impression

#### Confirmed

- The application initializes on `currentScreen: "setup"`
  (`code/src/ui/DayFrameApp.tsx:74`).
- Without an injected store, it creates a seeded store containing a Day Shift, Day Rotation, Sleep,
  Errands, and recurrence data
  (`code/src/ui/DayFrameApp.tsx:64,1476-1586`).
- The brand message is **“Built for life that does not run 9 to 5.”**
  (`code/src/ui/DayFrameApp.tsx:654-660`).
- The first workflow instruction is:
  **“Set up your shifts, connect them to a cycle, add repeatable life blocks, then generate a
  preview.”** (`code/src/ui/DayFrameApp.tsx:658-661`).
- The workspace heading on initial launch is **“Setup your schedule inputs”**
  (`code/src/ui/DayFrameApp.tsx:664-672`).
- Primary navigation contains only:
  - **Setup — Edit shifts, cycle, templates, and range**
  - **Generate Preview — Save this draft, generate, and open the preview**
  (`code/src/ui/DayFrameApp.tsx:676-709`).
- The Setup screen says:
  - **“Edit your authored setup in one place.”**
  - **“Setup includes schedule preferences, shifts, cycles, templates, and recurrences.”**
  (`code/src/ui/SetupScreen.tsx:153-163`).
- Setup sections are collapsed by default and can be expanded individually or through
  **Expand All** (`code/src/ui/SetupScreen.tsx:118-132,166-205`).
- The first actionable planning workflow is editing/saving setup, followed by generating a preview
  (`code/src/ui/DayFrameApp.tsx:186-268`).
- Automated tests confirm that the shell opens on Setup, exposes unified setup content, and can
  navigate to preview
  (`code/src/ui/tests/DayFrameApp.test.tsx:70-155`).

#### Partially Implemented

- The seeded examples reduce the blank-state burden and demonstrate shifts, cycles, sleep, and
  errands. They act as an implicit example rather than an onboarding sequence.
- Collapsed sections provide some progressive disclosure, but the top-level mental model remains a
  collection of setup categories.
- Guardrails identify missing schedule inputs when generation cannot proceed
  (`code/src/ui/DayFrameApp.tsx:222-250,1079-1090`; tested at
  `code/src/ui/tests/DayFrameApp.test.tsx:1184-1228,2190-2258`).

#### Not Implemented

- No welcome flow, guided onboarding, explanation of the planning lifecycle, or first-run
  Teach/Plan/Live/Learn orientation exists.
- No first-launch explanation states that the user is teaching DayFrame about their life.
- No first-launch explanation states that the system will learn from lived outcomes.
- No first-use choice begins from goals, priorities, commitments, or a planning question; the user
  begins in Setup.

#### Architectural Divergence

- The initial experience communicates **configuration of schedule inputs** more directly than
  collaborative planning.
- The phrases “Setup,” “schedule inputs,” “Edit shifts,” “templates,” “range,” and “Save Setup”
  reinforce a software-configuration model.
- The approved Chapter IV model says users should not feel that they are programming or configuring
  the application. The implemented first impression is explicitly organized around setup and
  configurable fields.

#### Open Question

- Source and tests establish what appears and which actions are available. Only observation of
  first-time users can determine whether the seeded examples feel instructional or appear to be
  unexplained pre-existing user data.

### 2. Planning Identity

#### Confirmed

- The interface repeatedly uses **preview**, **draft schedule**, **planning window**, **generated**,
  **revised**, **scheduled**, **unplaced**, and **friction**
  (`code/src/ui/DayFrameApp.tsx:667-672,704-706,715-749,1048-1107`;
  `code/src/ui/PreviewScreen.tsx:58-150`).
- The Preview screen says:
  **“Review the draft schedule day by day, then apply suggested fixes if anything conflicts.”**
  (`code/src/ui/PreviewScreen.tsx:86-95`).
- The schedule is visualized as a 24-hour User Day with work, generated scheduled blocks, and manual
  events (`code/src/ui/DayVisualizer.tsx:35-104`).
- The app supports manual dated events with title, date, all-day flag, start/end time, and notes
  (`code/src/ui/DayFrameApp.tsx:788-1032`).
- Preview explicitly says:
  **“Preview uses your current setup only. It does not export or save anything to your calendar.”**
  (`code/src/ui/DayFrameApp.tsx:1048-1107`).
- Automated tests confirm generation, preview visualization, manual-event editing, day selection,
  friction summaries, and schedule regeneration.

#### Partially Implemented

- DayFrame is presented as more than a calendar because it generates placements and friction rather
  than merely listing authored events.
- It is presented as more than a simple task manager because it includes work cycles, day/week
  boundaries, sleep, capacity-like placement, and recurring life blocks.
- It resembles a planning assistant when it detects friction and offers fixes, but the interface
  does not use “assistant,” “partnership,” or collaborative-conversation language.

#### Not Implemented

- Goals, commitments, capacity, routines, lived experience, and reflection are not presented as a
  complete user-facing planning model.
- The app does not visibly frame planning around the whole cycle of understanding, planning,
  living, and learning.

#### Architectural Divergence

- The strongest presented identities are:
  1. configuration tool;
  2. deterministic scheduling engine;
  3. draft schedule reviewer.
- “Calendar Day,” “Add Event,” the compact day strip, holiday annotations, and manual events add a
  calendar-like identity, although the explicit no-calendar-export message limits that identity.
- The implementation does not communicate the broader approved identity of a personal planning
  system that organizes life and continuously improves from reality.

#### Open Question

- User research is required to determine whether users interpret “life blocks” as broader life
  planning or as task/calendar entries with another name.

### 3. Conversation Presence

#### Confirmed

| Conversation | Visible implementation | Classification |
|---|---|---|
| Teach | Setup preferences, shifts, cycles, templates, recurrences, manual events, profiles, import/export | Implicit and partial |
| Plan | Generate Preview, draft schedule, friction, suggested fixes, regenerate/revise | Implicit and substantial |
| Live | No execution, completion, observation, or accepted-plan surface | Absent |
| Learn | Repeated-friction grouping exists within one preview; no historical analysis/reflection/learning surface | Absent as a Conversation |

- No UI text names **Teach**, **Plan**, **Live**, or **Learn** as navigation or workflow areas.
- Primary navigation is only **Setup** and **Generate Preview**
  (`code/src/ui/DayFrameApp.tsx:676-709`).
- Repeated friction is grouped by equivalent current-preview findings
  (`code/src/ui/PreviewScreen.tsx:154-201,521-576`) and is tested
  (`code/src/ui/tests/PreviewScreen.test.tsx:474`).

#### Partially Implemented

- Teach is behaviorally approximated by the user entering recurring structure and preferences.
- Plan is behaviorally approximated by deterministic preview generation and review.
- “Repeated Friction Patterns” uses learning-like language, but it is computed from multiple days
  in the current generated preview rather than from completed experience.

#### Not Implemented

- No Live conversation.
- No Learn conversation.
- No conversation transition language.
- No user-facing planning-cycle indicator.
- No reflection or historical-feedback workflow.

#### Architectural Divergence

- Interaction is organized around two screens/workspaces rather than four planning conversations.
- “Setup” replaces the mental framing of teaching/establishing understanding.
- “Preview” presents only the planning stage; no lifecycle follows it.

#### Open Question

- It is not possible to determine from implementation evidence whether users would spontaneously
  interpret Setup as “teaching” without that term or relationship being presented.

### 4. Collaboration Model

#### Confirmed

- Users supply scheduling preferences, shifts, cycles, block templates, recurrence rules, preview
  range, and manual events.
- The system generates work blocks, places recurring life blocks, identifies unplaced work and
  friction, and offers suggested fixes.
- Users explicitly trigger generation and regeneration
  (`code/src/ui/DayFrameApp.tsx:222-268,1048-1107`).
- Users explicitly choose a suggested fix
  (`code/src/ui/PreviewScreen.tsx:169-185,345-363`).
- Some fixes return the user to the exact relevant Setup field rather than applying an unavailable
  automatic change
  (`code/src/ui/DayFrameApp.tsx:399-431`;
  tested at `code/src/ui/tests/DayFrameApp.test.tsx:1611-1795`).

#### Partially Implemented

- The implemented collaboration is **user supplies configuration → system schedules → user
  reviews/corrects**.
- The system handles computational organization and conflict detection, which matches the approved
  system role in part.
- The user remains the source of input and initiator of actions, which matches the approved user
  role in part.

#### Not Implemented

- The user does not execute a plan through DayFrame.
- The system does not observe execution.
- The system does not learn from actual outcomes.
- No interface communicates that each completed day improves future planning.

#### Architectural Divergence

- The implemented partnership ends after schedule revision/regeneration.
- The interface frames the user's role as editing setup data more strongly than providing meaning,
  priorities, goals, and personal values.
- The system's role is communicated mainly as schedule generation and conflict handling, not
  preservation of history or support for reflection.

#### Open Question

- The implementation cannot establish whether users experience suggested-fix buttons as
  collaborative options or as opaque commands; that requires direct usability observation.

### 5. User Agency

#### Confirmed

- No preview is generated until the user chooses **Generate Preview** or **Regenerate Preview**.
- Setup changes remain in a draft and are visibly marked unsaved until saved or preview generation
  saves them
  (`code/src/ui/SetupScreen.tsx:153-205`;
  `code/src/ui/DayFrameApp.tsx:186-268`).
- Suggested fixes are rendered as buttons; no fix is automatically selected or applied
  (`code/src/ui/PreviewScreen.tsx:345-369`).
- When no automatic fix exists, the UI says:
  **“Review the related setup and regenerate the preview.”**
  (`code/src/ui/PreviewScreen.tsx:365-369`).
- Fixed-time review can take the user back to the corresponding input
  (`code/src/ui/DayFrameApp.tsx:270-277,399-431`).
- Destructive local-data, profile, cycle, shift, template, and event actions use explicit user
  actions; clear-local-data and several deletes require confirmation.
- The preview states that it does not write to a calendar
  (`code/src/ui/DayFrameApp.tsx:1071-1074`).
- Tests cover suggested-fix clicks, stale-preview regeneration, fixed-time return to Setup, and
  destructive confirmation.

#### Partially Implemented

- Friction messages explain immediate conflicts and suggested actions.
- Preview warnings explain range/cycle coverage and potentially empty output
  (`code/src/ui/previewRangeWarnings.ts:14-149`).
- Some automatic fixes revise the preview immediately after one click. The revised state is shown,
  but there is no separate confirmation/acceptance step or before/after comparison.

#### Not Implemented

- No explicit accept/reject workflow exists for the plan as a whole.
- No undo workflow is implemented for an applied suggested fix.
- No explanation trace shows why each placement was chosen.
- No explicit statement says the user owns final life decisions, priorities, or values.

#### Architectural Divergence

- The user retains operational control, but authority is communicated through buttons and
  non-automation rather than through the approved collaborative role.
- “Apply suggested fixes” makes recommendations actionable, but several actions immediately alter
  the current preview without first returning to authored intent.

#### Open Question

- Tests establish that actions require clicks. They do not establish whether users understand the
  scope and persistence of each fix before clicking it.

### 6. Plans as Proposals

#### Confirmed

- Generated output is consistently called **Preview**, **draft schedule**, or **schedule draft**
  (`code/src/ui/DayFrameApp.tsx:667-672,1048-1074`;
  `code/src/ui/PreviewScreen.tsx:58-95`).
- The preview includes generation and revision timestamps rather than an accepted/final state
  (`code/src/ui/PreviewScreen.tsx:117-150`).
- Setup changes make an existing preview visibly stale:
  **“Setup changed. Generate a new preview to see updates.”**
  (`code/src/ui/PreviewScreen.tsx:93-95`).
- Users can regenerate the preview, apply suggested fixes, return to Setup, change fields, or replace
  setup by loading a profile/import.
- Preview output is not persisted as authored setup or exported to a calendar.
- Tests cover preview generation, stale state, regeneration, suggested-fix revision, and fixed-time
  editing.

#### Partially Implemented

- Plans are clearly presented as non-final proposals.
- Plans are adjustable through suggested fixes or indirectly through Setup edits and regeneration.
- The preview is deterministic in implementation for complete inputs, but the UI does not state
  that equivalent inputs produce equivalent plans.
- Suggested fixes are recommendations in function, but the UI usually presents their action labels
  directly rather than explaining the planning principle behind them.

#### Not Implemented

- No **Accept Plan** action.
- No accepted-plan state.
- No explicit replace-plan history or comparison between alternatives.
- No direct editing of the complete proposed schedule; edits occur through specific fixes, Setup,
  or manual events.

#### Architectural Divergence

- “Preview” successfully avoids presenting a command or immutable output.
- The absence of acceptance means the implemented workflow never advances from proposal to a plan
  the user intends to live.
- The plan is a generated/revisable schedule, but not part of a continuous accepted-plan lifecycle.

#### Open Question

- Whether “Preview” alone communicates “DayFrame's best recommendation based on current
  understanding” requires user comprehension testing; that exact concept is not stated.

### 7. Continuous Learning

#### Confirmed

- Users can create recurring schedule structures through cycles, repeating sequences, templates,
  and recurrences.
- Templates include recurring behavior, priorities, preferred windows, and rescheduling behavior.
- Manual events support free-text notes
  (`code/src/ui/DayFrameApp.tsx:923-935`).
- Saved setup profiles and backups preserve alternative authored setups.
- The Preview groups equivalent friction across multiple currently previewed days under
  **Repeated Friction Patterns**
  (`code/src/ui/PreviewScreen.tsx:154-201`).

#### Partially Implemented

- Recurring structures allow the system to reuse information rather than require independent manual
  scheduling for each date.
- Grouped friction exposes repeated outcomes within the generated planning window.
- Notes capture context on manual events, but no planning or learning process consumes their
  content.

#### Not Implemented

- No completed-day capture.
- No execution feedback, completion, missed-work, or observed-outcome input.
- No immutable history.
- No reflection workflow.
- No historical analysis or long-term trend analysis.
- No learning-derived recommendations.
- No UI claim or feedback that continued interaction improves future plans.

#### Architectural Divergence

- The current app repeats deterministic authored rules; it does not become more informed from lived
  reality.
- “Repeated Friction Patterns” can resemble learning, but it is a grouping of predictions within
  one preview, not learning from historical execution.
- Profiles/backups represent reusable configuration, not accumulated understanding.

#### Open Question

- Users may interpret repeated-friction grouping as historical intelligence even though its source
  is the current preview. The implementation does not label the source distinction explicitly.

### 8. Reality vs Planning

#### Confirmed

- The generated schedule is labeled as a preview/draft.
- Manual events are visibly separated from generated scheduled blocks under **Manual Events** and
  marked **(Manual event)** (`code/src/ui/PreviewScreen.tsx:237-261`).
- Day details report separate counts for Work, Generated, Manual, and Friction
  (`code/src/ui/DayFrameApp.tsx:798-845`).
- Tests verify that manual events remain visually separate from generated scheduled blocks
  (`code/src/ui/tests/PreviewScreen.test.tsx:68-104`).

#### Partially Implemented

- The UI distinguishes authored fixed calendar information from generated planning output.
- It distinguishes work blocks, generated scheduled blocks, unplaced candidates, and friction.
- These distinctions clarify sources within planning, not the difference between planned and
  executed reality.

#### Not Implemented

- No executed/completed reality surface.
- No Accepted Schedule.
- No execution event or historical record.
- No comparison between expected and actual outcomes.
- No history timeline or immutable observed state.

#### Architectural Divergence

- The interface has only future/draft planning information.
- Execution-like type statuses exist in core types, but no current UI workflow records actual
  completion or history; they do not communicate Chapter IV's “History represents reality” model.

#### Open Question

- None within the current implementation: executed reality is not represented.

### 9. Architectural Consistency

#### Confirmed

Workflows that reinforce the approved mental model:

- entering recurring life structure before generation;
- explicit user-triggered generation;
- deterministic core generation over saved inputs;
- “preview” and “draft schedule” language;
- stale-plan warning after setup changes;
- visible friction messages and range warnings;
- user-selected suggested fixes;
- return to the relevant Setup field when a fix cannot be safely automated;
- separate display of manual inputs and generated placements; and
- explicit assurance that preview does not write to a calendar.

#### Partially Implemented

- The user-teaches/system-plans relationship exists behaviorally but not linguistically.
- Explainability exists for conflicts and warnings but not for every placement or recommendation.
- User direction is strong at action boundaries, but the broader role of the user as expert on
  priorities, goals, and values is not presented.

#### Not Implemented

- Four-Conversation organization.
- Plan acceptance.
- Live.
- History.
- Learn.
- Continuous improvement from observed experience.
- Complete planning-cycle navigation.

#### Architectural Divergence

Workflows that communicate a conflicting mental model:

- initial launch into a dense Setup surface;
- navigation centered on Setup and Generate Preview;
- repeated use of configuration nouns such as preferences, shifts, cycles, templates, recurrences,
  modes, sources, segments, priorities, placement types, and reschedule behaviors;
- profile and backup management occupying persistent shell space;
- manual calendar-event editing presented alongside the planning workspace;
- suggested-fix application that revises a preview without an accepted-plan or future-authoring
  transition; and
- no visible lifecycle beyond plan review.

The implementation is internally consistent as a **configure → generate → inspect → revise**
product. That consistency conflicts with the broader approved
**teach → plan → live → learn → teach** mental model.

#### Open Question

- The natural mental model is a user-perception outcome. The code supports a strong evidence-based
  prediction, but only first-time-user studies can confirm which identity dominates in practice.

## Mental Model Mapping

After using the currently implemented workflows, a reasonable first-time user would likely
conclude:

> DayFrame is a local schedule-building application for people with shift-based or nonstandard
> routines. I configure my work schedule, cycles, recurring life blocks, priorities, placement
> preferences, and preview range. DayFrame generates a draft daily schedule, shows conflicts and
> items it could not place, and gives me buttons to revise some problems. I can edit setup and
> regenerate, add calendar-like events and notes, save setup profiles, and back up my setup. It
> does not publish the preview to my calendar.

The user would have weaker implementation evidence for these approved conclusions:

- DayFrame and the user are engaged in an ongoing planning partnership.
- Setup is a Teach conversation rather than configuration.
- A generated plan will be accepted and lived.
- DayFrame will record what actually occurred.
- DayFrame will become more informed through history.
- Live and Learn are part of the product.

### Identity strength

| Possible identity | Strength communicated | Implementation basis |
|---|---|---|
| Configuration tool | Strong | Setup-first launch, dense editable fields, save/profile/backup operations |
| Scheduling engine | Strong | Deterministic generation, placement, preview, friction, unplaced candidates |
| Planning assistant | Moderate | Suggested fixes, warnings, draft review, user-triggered regeneration |
| Calendar | Moderate | Day strip, day visualizer, holidays, dated manual events; weakened by explicit no-calendar-write statement |
| Task manager | Weak to moderate | Repeatable blocks, priority, placement, rescheduling; no task list/completion workflow |
| Collaborative continuous planning system | Weak to moderate | User supplies inputs and system plans, but Live/Learn and collaboration framing are absent |
| Habit tracker | Weak | Recurrence exists, but no streaks, tracking, or completion history |

## Alignment Assessment

### Confirmed Alignments

1. **Personal planning before calendar publication.** The implementation generates a preview from
   user inputs and explicitly states it does not save to a calendar.
2. **User provides planning information.** Schedule boundaries, shifts, cycles, recurring blocks,
   priorities, placement preferences, and manual events originate in user-editable interfaces.
3. **System performs computational organization.** The implementation generates placements,
   unplaced candidates, friction, and suggested fixes.
4. **Plans are proposals.** “Preview” and “draft schedule” language is consistent throughout.
5. **User action remains necessary.** Generation, regeneration, fixes, edits, profile replacement,
   import, and destructive actions require explicit interaction.
6. **Some outcomes are explained.** Friction messages, warnings, counts, status metadata, and fix
   guidance expose immediate reasons and next actions.

### Partial Alignments

1. **Collaborative planning.** User input and system computation are complementary, but partnership
   language and the full cycle are absent.
2. **Teach.** The user supplies enduring information, but does so through a Setup/configuration
   model.
3. **Plan.** Draft generation/review is substantial, but no plan acceptance follows.
4. **Determinism.** Core behavior is deterministic for complete inputs, but the UI does not explain
   this property.
5. **Explainability.** Conflicts and warnings are explained; ordinary placement reasoning is not.
6. **Planning rather than configuration.** Generated proposals go beyond configuration, but the
   dominant first-use surface is configuration-heavy.
7. **Recommendations are advisory.** The user chooses fixes, but one click can immediately revise
   the current preview.

### Divergences

1. The interface is organized around Setup and Preview rather than Teach, Plan, Live, and Learn or
   equivalent conversations.
2. First-use language explicitly frames the user's activity as setup of schedule inputs.
3. Dense implementation terminology exposes configuration mechanics.
4. No accepted-plan, execution, historical-reality, reflection, or learning workflow exists.
5. Repeated current-preview friction may visually resemble learning despite not using historical
   reality.
6. Recommendations revise derived output without entering an implemented future Teach cycle.
7. No interaction communicates that completed experience continuously improves future planning.

## Behavioral Invariants

The following current behaviors consistently reinforce parts of the mental model:

1. The application opens on Setup.
2. Preview generation is always user-triggered.
3. Generate Preview saves the current setup draft before generation.
4. A generated schedule is consistently called a preview or draft.
5. Preview is derived from the saved current setup.
6. Setup changes mark an existing preview stale.
7. Users can regenerate rather than treating a preview as permanent.
8. Visible friction includes a title/message and zero or more user-selectable actions.
9. Suggested fixes are not applied without a user click.
10. A fixed-time issue can return the user to the corresponding Setup control.
11. Manual events and generated scheduled blocks remain visibly distinct.
12. Preview does not write to an external calendar.
13. No implemented interaction records completed reality.
14. No implemented interaction learns from historical execution.
15. Navigation exposes only Setup and Generate Preview.

## Architectural Gaps

Chapter IV concepts absent from the current user experience:

- explicit framing of DayFrame as a collaborative personal planning system;
- Teach, Plan, Live, and Learn as an ongoing cycle;
- user-facing goals, commitments, personal values, and meaning as the Teach vocabulary;
- system allocation of visible capacity as a user-facing concept;
- plan acceptance;
- a plan that proceeds into lived execution;
- observed execution;
- immutable historical reality;
- comparison of planned and actual outcomes;
- reflection;
- learning from completed days;
- historical analyses and trends;
- recommendations informed by lived history;
- a future Teach cycle informed by learning;
- visible continuous improvement over time; and
- an explicit explanation that deterministic computation, rather than autonomous judgment, produces
  planning recommendations.

## Coverage Assessment

The relevant automated test run completed successfully on 2026-07-30:

```text
Test Files  5 passed (5)
Tests       75 passed (75)
```

Command:

```text
npm test -- --run \
  src/ui/tests/DayFrameApp.test.tsx \
  src/ui/tests/PreviewScreen.test.tsx \
  src/ui/tests/PreviewScreenContainer.test.tsx \
  src/ui/tests/DayVisualizer.test.tsx \
  src/ui/tests/previewRangeWarnings.test.ts
```

### Findings directly supported by automated tests

| Behavior | Test evidence |
|---|---|
| Shell opens on Setup and allows Preview navigation | `DayFrameApp.test.tsx:70-155` |
| Unified setup edits and save behavior | `DayFrameApp.test.tsx:136-395` |
| Seeded and repeating-cycle preview generation | `DayFrameApp.test.tsx:326-394,522-547` |
| Setup sections collapse and preserve drafts | `DayFrameApp.test.tsx:785-812` |
| Preview metadata, day groups, visualizer, friction, and unplaced work | `PreviewScreen.test.tsx:34-66` |
| Manual events remain separate from generated blocks | `PreviewScreen.test.tsx:68-136`; `DayFrameApp.test.tsx:899-953` |
| Suggested fixes require clicks and flow through the store | `PreviewScreen.test.tsx:138-157`; `PreviewScreenContainer.test.tsx:49-88` |
| Suggested fix revises visible preview | `DayFrameApp.test.tsx:1346-1449` |
| Setup changes mark preview stale and regeneration clears it | `DayFrameApp.test.tsx:1451-1522` |
| Fixed-time review returns to matching Setup control | `DayFrameApp.test.tsx:1611-2008` |
| Preview-range warnings and guardrails | `previewRangeWarnings.test.ts`; `DayFrameApp.test.tsx:1184-1228,1524-1609,2190-2258` |
| Repeated equivalent friction is grouped | `PreviewScreen.test.tsx:474` |
| Compact-day selection and current-day context | `DayFrameApp.test.tsx:548-783` |
| Clear-local-data requires confirmation | `DayFrameApp.test.tsx:2260-2295` |
| Profiles and backup import/export are user-directed | `DayFrameApp.test.tsx:409-520,2297-2520` |

### Findings supported by implementation inspection only

- No onboarding or lifecycle orientation exists.
- Teach/Plan/Live/Learn terminology is absent from visible UI strings.
- No plan-acceptance action exists.
- No execution, history, reflection, or learning data path exists.
- The default non-injected app store is seeded with demo schedule data.
- The interface does not explicitly communicate deterministic equivalence of inputs and outputs.
- Ordinary placement decisions lack a user-facing explanation trace.
- Notes are stored on manual events but are not consumed by planning or learning.
- Profiles and backups contain setup rather than lived history.

### Findings requiring user observation

- The exact mental model formed by first-time users.
- Whether seeded data is understood as an example.
- Whether “Preview” is sufficient to communicate a proposal.
- Whether users understand why suggested fixes are safe or what their scope is.
- Whether “Repeated Friction Patterns” is mistaken for historical learning.
- Whether the Setup surface feels like teaching the system or configuring software.

## Open Questions

1. What identity do first-time users state after completing Setup and generating one preview:
   planning partner, scheduler, calendar, or configuration tool?
2. Do users recognize seeded shifts/templates as examples rather than their own stored information?
3. Does “Preview” communicate an advisory proposal without an explicit plan-acceptance action?
4. Do users understand the reason and effect of each suggested fix before selecting it?
5. Do users interpret **Repeated Friction Patterns** as prediction across a preview or as learning
   from history?
6. Does the direct return to a fixed-time Setup field feel collaborative and explainable?
7. Does manual-event editing strengthen planning context or shift the perceived identity toward a
   calendar?
8. How strongly does the persistent profile/backup management area influence the first impression
   of DayFrame as configuration software?

These questions require future observational investigation; the executable implementation cannot
resolve them.
