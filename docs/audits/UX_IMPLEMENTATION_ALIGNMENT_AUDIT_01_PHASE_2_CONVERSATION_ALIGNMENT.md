# UX Implementation Alignment Audit 01

## Phase 2 — Conversation Alignment

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, Chapter V — Conversation Architecture  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-30

## Executive Findings

The implemented user experience has two screens: **Setup** and **Preview**. They are selected by a two-value screen state, and the application opens on Setup (`code/src/ui/DayFrameApp.tsx:74`, `code/src/ui/DayFrameApp.tsx:1048`, `code/src/ui/DayFrameApp.tsx:1064`). These are implementation screens and workspaces; they are not, by their names alone, architectural Conversations.

The workflows divide substantially, but not completely, into two Conversation-like responsibilities:

- Setup performs much of **Teach** by collecting schedule preferences, shifts, cycles, templates, recurrences, priorities, timing preferences, flexibility, and rescheduling rules. The interface describes this as an “authored setup” and as “schedule inputs,” so the behavior is Teach-like while the visible framing is software setup/configuration (`code/src/ui/SetupScreen.tsx:156-163`; `code/src/ui/DayFrameApp.tsx:667-673`).
- Preview performs much of **Plan** by generating a deterministic draft, displaying work and scheduled blocks, exposing unplaced candidates and friction, and allowing the user to apply selected fixes or return to a relevant enduring input (`code/src/ui/DayFrameApp.tsx:222-250`; `code/src/ui/PreviewScreen.tsx:86-114`; `code/src/ui/PreviewScreen.tsx:263-375`).
- No implemented workflow constitutes a **Live** Conversation. A date/day view and a “today” marker exist, but there is no accepted-plan state, completion, skip/delay during execution, actual-time recording, interruption capture, or deviation record.
- No implemented workflow constitutes a **Learn** Conversation. “Repeated Friction Patterns” groups equivalent friction within the currently visible generated preview; it does not read historical execution or stored observations (`code/src/ui/PreviewScreen.tsx:154-200`, `code/src/ui/PreviewScreen.tsx:521-554`).

The strongest implemented Conversation transition is Teach-like Setup → Plan-like Preview through **Generate Preview**. That action saves the current Setup draft, switches screens, and generates a proposal (`code/src/ui/DayFrameApp.tsx:257-268`). A narrower Plan → Teach transition is implemented when the user selects a fixed-time recommendation: the application returns to Setup and focuses the matching fixed-start field (`code/src/ui/DayFrameApp.tsx:270-277`, `code/src/ui/DayFrameApp.tsx:415-424`; tested at `code/src/ui/tests/DayFrameApp.test.tsx:1611` and `:1797`).

Conversation boundaries are not consistently explicit. Preview-range selection is stored in Setup even though it controls the scope of a proposal. Manual-event authoring occurs from Preview, persists as authored input, and automatically regenerates the proposal. Profiles, backup, import, and clearing data are shell-level data-management workflows rather than Teach, Plan, Live, or Learn responsibilities.

No user-facing acceptance of a proposal is implemented. Consequently, the implemented flow ends in proposal review and revision; it does not transition from Plan to Live, then to Learn, then back to Teach or Plan.

## Audit Vocabulary

The following distinctions are used throughout this audit:

- **Conversation:** a coherent activity defined by Chapter V: understanding, proposal generation, execution, or reflection.
- **Surface:** a persistent environment owned by a Conversation. The implementation does not explicitly model Surface identity.
- **Workspace:** a grouping of related controls inside the application shell. “Setup” and “Preview” function as current workspaces.
- **Screen:** the render branch selected by `currentScreen`; the implemented values are `setup` and `preview`.
- **Workflow:** a user-triggered sequence that pursues a goal and may change state.
- **Reusable interaction:** a pattern such as collapse/expand, warnings, validation, or confirmation that can support more than one workflow.
- **Shared infrastructure:** persistence, profile, backup, import, and shell behavior that supports application data without owning a planning activity.

## Workflow-to-Conversation Matrix

“Current location” describes implementation placement, not architectural ownership. “State/result” records the observable result of the action. Test references name direct automated coverage; “inspection only” means no direct UI test was found.

| Workflow | Entry point and user goal | Primary actions; state/result; visible destination | Current location | Primary Conversation | Secondary Conversation | Classification | Evidence and tests |
|---|---|---|---|---|---|---|---|
| Initial launch | Launch application; begin using DayFrame | Seeded store is created when none is supplied; `currentScreen` starts at Setup; user sees shell, profiles/data tools, navigation, and Setup | Shell + Setup screen | Teach-like | Shared infrastructure | Partially Implemented | `DayFrameApp.tsx:64-74`, `:434-704`; test `DayFrameApp.test.tsx:70` |
| Setup section disclosure | Setup; manage visible detail | Expand/collapse one or all sections; draft data is unchanged; remains in Setup | Setup workspace | Teach | None | Confirmed reusable interaction | `SetupScreen.tsx:118-151`, `:166-205`; tests `DayFrameApp.test.tsx:785` |
| Schedule preferences | Setup → Schedule Preferences; define day/week interpretation | Edit day-boundary and week-start draft; Save persists preferences and marks an existing preview stale | Setup workspace | Teach | Plan | Confirmed, with configuration framing | `SetupScreen.tsx:207-269`; `dayFrameStore.ts:50-65`; tests `DayFrameApp.test.tsx:158`, `:1451` |
| Preview-range selection | Setup → Preview Range; choose proposal horizon | Select preset, custom dates, or cycles; Save persists `previewRange`; generation uses it | Setup workspace | Plan | Teach-like persistence | Architectural Divergence | `SetupScreen.tsx:271-415`; `DayFrameApp.tsx:186-219`; tests `DayFrameApp.test.tsx:177`, `:853`, `:873` |
| Shift create/edit/delete | Setup → Shifts; describe work patterns | Change the draft collection; destructive deletion requires confirmation; Save persists shifts and stales preview | Setup workspace | Teach | Plan | Confirmed, with configuration framing | `SetupScreen.tsx:417-686`; `DayFrameApp.tsx:190-203`; tests `DayFrameApp.test.tsx:198`, `:785` |
| Shift workday definition | Shift editor; define applicable workdays and times | Edit shift timing and workday data; Save persists; future generation consumes it | Setup workspace | Teach | Plan | Confirmed | `SetupScreen.tsx:417-686`; tests `DayFrameApp.test.tsx:198`, `:1230` |
| Cycle create/edit/delete | Setup → Cycles; describe rotation | Add/edit/remove cycle draft; Save persists cycles and stales preview | Setup workspace | Teach | Plan | Confirmed, with configuration framing | `SetupScreen.tsx:688-1481`; `dayFrameStore.ts:93-103`; tests `DayFrameApp.test.tsx:198`, `:873` |
| Cycle mode and segment/sequence editing | Cycle editor; define manual segments or repeating sequence | Change cycle mode, dates, entries, and per-segment overrides; Save persists | Setup workspace | Teach | Plan | Confirmed | `SetupScreen.tsx:813-1481`; tests `DayFrameApp.test.tsx:289`, `:326` |
| Template create/edit/delete | Setup → Templates; describe repeatable life blocks | Add/edit/remove template and matching recurrence; deletion requires confirmation; Save persists both | Setup workspace | Teach | Plan | Confirmed, with configuration framing | `SetupScreen.tsx:1483-2253`; `DayFrameApp.tsx:204-214`; tests `DayFrameApp.test.tsx:198` |
| Template priority/timing/flexibility | Template editor; describe placement intent | Edit priority, duration, preferred or fixed timing, rescheduling behavior, work dependency, and enabled state; Save persists | Setup workspace | Teach | Plan | Confirmed | `SetupScreen.tsx:1483-2142`; tests `DayFrameApp.test.tsx:1115`, `:1134`, `:2010`, `:2092` |
| Recurrence create/edit | Template editor; describe repetition | Edit frequency, weekdays, or times per user week; Save persists matching recurrence | Setup workspace | Teach | Plan | Confirmed | `SetupScreen.tsx:1494-1498`, `:2143-2253`; test `DayFrameApp.test.tsx:198` |
| Setup save | Setup action bar; commit current authored draft | Writes preferences, range, shifts, cycles, templates, and recurrences to store; shows “Setup saved”; remains in Setup | Setup workspace | Teach | Plan for range | Partially Implemented | `DayFrameApp.tsx:186-220`; `SetupScreen.tsx:166-205`; tests `DayFrameApp.test.tsx:158-396` |
| Generate Preview | Primary navigation; obtain a proposal | Automatically saves current draft, switches to Preview, validates prerequisites, generates preview | Shell → Preview workspace | Plan | Teach | Confirmed transition, boundary partially blurred | `DayFrameApp.tsx:222-268`, `:694-704`; tests `DayFrameApp.test.tsx:522`, `:1184`, `:1200` |
| Preview generation guardrail | Generate Preview with incomplete inputs; understand why generation cannot proceed | Computes missing inputs; stays on Preview and lists only missing setup items; no preview is generated | Preview workspace | Plan | Teach | Confirmed reusable interaction | `DayFrameApp.tsx:222-228`, `:1086-1095`; tests `DayFrameApp.test.tsx:1184`, `:1200`, `:2190` |
| Empty preview | Open Preview without a result; understand next action | Shows “No preview generated yet” and generation guidance; no state change | Preview workspace | Plan | None | Confirmed | `PreviewScreen.tsx:58-70`; test `PreviewScreen.test.tsx:15` |
| Preview review | Generated preview; inspect proposed days | Displays planning window, generation/revision times, work, generated blocks, manual events, unplaced candidates, and friction | Preview workspace | Plan | None | Confirmed | `PreviewScreen.tsx:117-150`, `:203-380`; tests `PreviewScreen.test.tsx:34`, `:68`, `:106` |
| Day visualizer | Preview day; inspect spatial arrangement | Renders work and scheduled proposal blocks, including overlaps and overnight extents; no execution state changes | Preview workspace | Plan | Live-like visual foundation | Confirmed Plan; not Live | `PreviewScreen.tsx:230-235`; `DayVisualizer.tsx`; tests `DayVisualizer.test.tsx:16-121` |
| Holiday annotation | Preview day; see calendar context | Adds static holiday labels to visible day groups; proposal state unchanged | Preview workspace | Plan | None | Confirmed contextual interaction | `PreviewScreen.tsx:213-228`, `:401-405`; test `PreviewScreen.test.tsx:429` |
| Compact preview day selection | Shell calendar; focus one day or range | Updates local selection, switches to Preview, opens day-detail/manual-event panel; proposal is filtered but not regenerated | Shell + Preview workspace | Plan | None | Confirmed | `DayFrameApp.tsx:279-306`; tests `DayFrameApp.test.tsx:548`, `:591`, `:614`, `:631`, `:747` |
| Restore full preview range | Compact calendar/full-preview control; undo filtering | Clears local selected range and opens Preview; proposal data is unchanged | Shell + Preview workspace | Plan | None | Confirmed | `DayFrameApp.tsx:176-184`; test `DayFrameApp.test.tsx:631` |
| Day-detail review | Select compact day; inspect day counts and events | Opens “Calendar Day” panel with Work/Generated/Manual/Friction counts and event controls | Shell day panel | Plan | Live-like visual foundation | Partially Implemented | `DayFrameApp.tsx:788-1043`; tests `DayFrameApp.test.tsx:548`, `:899` |
| Manual-event create/edit | Select a preview day; add date-specific commitment/context | Edits persistent `manualEvents`, including notes; save automatically regenerates an existing preview; remains in day panel/Preview | Preview/day-detail workspace | Plan | Teach | Architectural Divergence | `DayFrameApp.tsx:308-377`, `:788-1004`; `dayFrameStore.ts:133-143`; test `DayFrameApp.test.tsx:899` |
| Manual-event delete | Day details; remove authored date-specific event | Requires confirmation, removes persistent event, and automatically regenerates existing preview | Preview/day-detail workspace | Plan | Teach | Architectural Divergence | `DayFrameApp.tsx:379-397`, `:1005-1036`; test `DayFrameApp.test.tsx:899` |
| Friction review | Preview summary/day; understand proposal conflicts | Shows visible friction counts, severity, title, message, and candidate fixes; no change until user selects a fix | Preview workspace | Plan | None | Confirmed | `PreviewScreen.tsx:79-84`, `:143-150`, `:334-375`; tests `PreviewScreen.test.tsx:260`, `:327`, `:350`, `:456` |
| Repeated-friction review | Preview summary; identify repeated proposed conflicts | Groups equivalent friction across visible `dayGroups`; expands occurrences and retains per-occurrence fixes; no history is read | Preview workspace | Plan | None | Confirmed Plan; not Learn | `PreviewScreen.tsx:154-200`, `:521-567`; test `PreviewScreen.test.tsx:474` |
| Apply proposal-only suggested fix | Friction action; revise current proposal | User selects a labeled action; store revises only `state.preview`, records `revisedAt` and feedback; authored Setup is unchanged | Preview workspace | Plan | None | Confirmed | `DayFrameApp.tsx:399-431`; `dayFrameStore.ts:266-300`; tests `DayFrameApp.test.tsx:1346`, `PreviewScreenContainer.test.tsx:49`, `:76` |
| Suggested fixed-time review | Fixed-time friction action; inspect enduring input | Selecting `changeFixedTime` switches to Setup and focuses the matching template field; no automatic change is made | Preview → Setup | Teach | Plan | Confirmed transition | `DayFrameApp.tsx:415-424`; `SetupScreen.tsx:135-151`; tests `DayFrameApp.test.tsx:1611`, `:1797` |
| No-automatic-fix recovery | Friction without a fix; understand recovery path | Displays instruction to review related Setup and regenerate; no state change or contextual link | Preview workspace | Plan | Teach | Partially Implemented | `PreviewScreen.tsx:188-191`, `:365-369`; inspection only |
| Preview-range warning | Generated preview; understand horizon/cycle mismatch | Derives non-blocking warnings from saved authored inputs; renders them after generation; proposal remains available | Preview workspace | Plan | Teach | Confirmed reusable interaction | `DayFrameApp.tsx:127-134`, `:1096-1104`; `previewRangeWarnings.ts`; tests `previewRangeWarnings.test.ts:7-92`, `DayFrameApp.test.tsx:1524` |
| Stale-preview warning | Change saved Setup after generating; distinguish old proposal | Authored setters mark preview stale; Preview displays warning; regeneration clears stale state | Setup → Preview | Plan | Teach | Confirmed boundary signal | `dayFrameStore.ts:50-143`; `PreviewScreen.tsx:93-95`; tests `DayFrameApp.test.tsx:1451`, `:1477` |
| Regenerate Preview | Preview action; rebuild proposal from saved understanding | Generates a new preview from saved state, preserving current screen; replaces proposal result | Preview workspace | Plan | Teach input | Confirmed | `DayFrameApp.tsx:253-255`, `:1073-1080`; tests `DayFrameApp.test.tsx:1477`, `:1691` |
| Generic Setup/Preview navigation | Primary navigation; change workspace | Setup button changes screen without saving; Generate Preview saves and generates rather than merely navigating; selected compact day can remain stable | Shell | Shared infrastructure | Teach/Plan | Partially Implemented | `DayFrameApp.tsx:164-179`, `:676-704`; tests `DayFrameApp.test.tsx:107`, `:136`, `:591`, `:747` |
| Profile creation | Shell; preserve a named authored setup | Validates name and stores a clone of authored setup separately; stays in current shell context | Persistent shell header | None—data management | Teach | Shared Infrastructure | `DayFrameApp.tsx:438-483`; `dayFrameStore.ts:145-172`; test `DayFrameApp.test.tsx:409` |
| Profile loading | Shell; replace active authored setup | Replaces active authored state, clears preview and selected range, switches to Setup | Persistent shell header → Setup | None—data management | Teach | Shared Infrastructure | `DayFrameApp.tsx:495-513`; `dayFrameStore.ts:174-192`; tests `DayFrameApp.test.tsx:409`, `:814` |
| Profile deletion | Shell; remove saved data snapshot | Removes named saved profile; active authored setup is unchanged | Persistent shell header | None—data management | None | Shared Infrastructure | `DayFrameApp.tsx:514-525`; `dayFrameStore.ts:194-203`; test `DayFrameApp.test.tsx:409` |
| Backup export | Shell; download authored setup | Serializes current authored setup and initiates JSON download; proposal is not part of exported authored data | Persistent shell header | None—data management | Teach | Shared Infrastructure | `DayFrameApp.tsx:532-550`; `dayFrameStore.ts:213-215`; test `DayFrameApp.test.tsx:2297` |
| Backup import | Shell/file picker; replace authored setup | Validates JSON, replaces authored state, preserves saved profiles, clears preview, resets shell context, and opens Setup | Persistent shell header → Setup | None—data management | Teach | Shared Infrastructure | `DayFrameApp.tsx:551-599`, `:1591-1642`; `dayFrameStore.ts:217-230`; tests `DayFrameApp.test.tsx:2417`, `:2484` |
| Clear local data | Shell; remove local state | Presents confirmation; on confirmation clears active data and profiles and resets UI state | Persistent shell header | None—data management | None | Shared Infrastructure | `DayFrameApp.tsx:559-633`; `dayFrameStore.ts:205-211`; tests `DayFrameApp.test.tsx:2260`, `:2280` |
| Entity deletion confirmations | Shift/cycle/segment/template/event deletion; prevent unintended removal | First action reveals confirm/cancel state; confirmation mutates draft or persistent manual events | Setup or day panel | Shared interaction | Teach/Plan | Shared Infrastructure | `SetupScreen.tsx:118-126`; `DayFrameApp.tsx:1005-1036`; event test `DayFrameApp.test.tsx:899`; setup confirmation behavior inspection only |
| Import/profile validation and recovery | Profile save or backup import; recover from invalid input/data | Catches validation errors and shows error message without completing replacement | Persistent shell header | None—data management | None | Shared Infrastructure | `DayFrameApp.tsx:465-477`, `:576-599`, `:1591-1642`; tests `DayFrameApp.test.tsx:2484`; blank profile validation covered within `:409` |

## Teach Assessment

### Confirmed

The implementation provides extensive authored inputs that establish reusable understanding:

- day and week interpretation through global schedule preferences;
- named shifts and work timing;
- manual or repeating shift cycles, sequence entries, and segment-specific preference overrides;
- repeatable block templates;
- recurrence rules;
- priority, duration, preferred/fixed timing, flexibility, work dependency, rescheduling behavior, and enabled state.

The persisted setters separate these authored collections from `preview`, and changes mark an existing preview stale (`code/src/state/dayFrameStore.ts:50-143`). This is consistent with Teach supplying understanding that Plan subsequently consumes.

### Partially Implemented

Teach is implemented behaviorally but not presented as a Conversation. The visible language is “Setup,” “authored setup,” “schedule inputs,” “Schedule Preferences,” “Shifts,” “Cycles,” and “Templates And Recurrences” (`code/src/ui/SetupScreen.tsx:156-163`, `:207-285`, `:417-424`, `:688-699`, `:1483-1498`). A user is told to edit and save configuration-like records, not that they are teaching DayFrame an enduring understanding of life.

The workflow provides rich structured management but no user-facing goals model or general routine workflow distinct from block templates/recurrences. Notes are available only on manual date-specific events (`code/src/ui/DayFrameApp.tsx:93-100`, `:344-355`); they are stored but no inspected planning or reflection workflow consumes their content.

### Architectural Divergence

Preview-range selection is proposal scope, but it is edited and persisted inside Setup alongside enduring life understanding (`code/src/ui/SetupScreen.tsx:271-415`). It therefore combines Plan preparation with Teach-like authored setup.

Manual events create or change persistent planning inputs from Preview and automatically regenerate the proposal (`code/src/ui/DayFrameApp.tsx:308-397`). They are temporary, date-specific planning context rather than demonstrated enduring understanding, yet their authored-state mutation is embedded in the Plan-like workspace. Their notes are not execution observations because the same workflow occurs while reviewing a draft proposal and has no actual-versus-planned semantics.

### Shared Infrastructure

Profiles and backup/import preserve or replace authored information but do not themselves establish understanding. Their user goal is data snapshot management. Profile loading and backup import route to Setup and clear the existing preview (`code/src/state/dayFrameStore.ts:174-230`), so they support Teach without becoming Teach.

### Not Implemented

No user-facing Teach Conversation identity, Teach objective, conversational capture workflow, or explicit explanation of how authored understanding will be used was found. There is no implemented mechanism for confirming a learned conclusion back into enduring understanding because Learn is absent.

## Plan Assessment

### Confirmed

Plan is the most complete Conversation-like implementation. The system:

- generates a proposal from persisted shifts, cycles, templates, recurrences, manual events, and preferences (`code/src/state/dayFrameStore.ts:232-264`);
- presents the result explicitly as a “draft schedule” and “preview” (`code/src/ui/PreviewScreen.tsx:89-92`);
- separates work, manually entered events, generated scheduled blocks, and unplaced candidates (`code/src/ui/PreviewScreen.tsx:237-332`);
- displays friction titles, messages, severities, counts, and suggested actions (`code/src/ui/PreviewScreen.tsx:143-200`, `:334-375`);
- changes the proposal only after the user selects a suggested fix (`code/src/state/dayFrameStore.ts:266-300`);
- records generated and revised timestamps and communicates stale proposals (`code/src/ui/PreviewScreen.tsx:93-95`, `:117-150`);
- lets users regenerate after enduring inputs change.

Tests confirm generation from authored values, deterministic visible placement, range handling, friction display, proposal revision, and contextual return (`code/src/ui/tests/DayFrameApp.test.tsx:522-631`, `:853-954`, `:1115-1230`, `:1346-1797`; `code/src/ui/tests/PreviewScreen.test.tsx:34-474`).

### Partially Implemented

The user can evaluate and revise a generated proposal, but no acceptance workflow or accepted-plan state exists. The implemented Plan flow therefore has no terminal transition to Live.

Consequences are exposed through friction messages, unplaced candidates, action feedback, and revised state. The inspected UI does not provide a general explanation of why each successful placement was chosen. The Plan implementation is explainable at conflicts and recommendations, but not comprehensively across every scheduled result.

### Architectural Divergence

Generate Preview is both navigation and an implicit save of all current Setup draft values (`code/src/ui/DayFrameApp.tsx:257-268`). The visible primary navigation action therefore crosses from editing understanding to proposal generation without separately exposing the state transition.

Manual-event authoring combines proposal review with modification of persistent date-specific input. Preview-range definition is located in Setup. Both make the boundary between “understanding” and “this proposal” less explicit.

### Not Implemented

There is no accept/commit-plan workflow, accepted-plan identifier, handoff to execution, or explicit distinction between a revised preview and an accepted plan.

## Live Assessment

### Not Implemented

No user-facing workflow was found for:

- accepting a plan;
- marking work or life blocks complete;
- skipping or delaying during execution;
- recording actual start or finish times;
- moving work as an execution event;
- recording interruptions or deviations;
- capturing execution observations;
- preserving a historical account of what occurred.

The broad executable-code search found a `"completed"` literal in a core block status type (`code/src/core/blocks/types.ts:145`), but no inspected user-facing component reads or writes completion state. A type literal is not an implemented workflow.

### Partial Foundations

The compact calendar can mark the current date, select a day, and open day details; Preview also renders a time-based day visualizer. These are date-awareness and visualization foundations only. They display generated proposal data and manual planning input and do not record lived reality (`code/src/ui/DayFrameApp.tsx:711-1043`; `code/src/ui/PreviewScreen.tsx:203-380`).

Manual events can be added to a selected date, but saving one regenerates the proposal (`code/src/ui/DayFrameApp.tsx:338-397`). The implementation therefore treats the event as planning input, not as an execution record.

## Learn Assessment

### Not Implemented

No implemented user-facing workflow was found for completed-plan review, planned-versus-actual comparison, reflection, outcome-linked notes, historical trends, capacity learning, conclusions inferred from history, user confirmation of such conclusions, or applying a learned conclusion to Teach or Plan.

The state mutations and preview data inspected do not establish an execution-history source from which Learn could operate (`code/src/state/dayFrameStore.ts:50-300`).

### Repeated Friction Is Plan, Not Learn

“Repeated Friction Patterns” is computed by iterating the current `dayGroups`, grouping current visible friction by severity, title, message, and available fixes, and retaining groups with more than one occurrence (`code/src/ui/PreviewScreen.tsx:521-567`). Those day groups are built from the current preview and current visible range (`code/src/ui/PreviewScreen.tsx:73-84`). The behavior is predictive analysis within one proposal window. It does not consume:

- historical execution;
- completed plans;
- stored observations;
- actual outcomes.

It is therefore a confirmed Plan workflow, not a partial Learn Conversation. Test coverage confirms the current-preview grouping behavior (`code/src/ui/tests/PreviewScreen.test.tsx:474`).

## Conversation Transition Map

| Transition | Implemented trigger | Explicit or implicit | Context behavior | Assessment |
|---|---|---|---|---|
| Teach-like Setup → Plan-like Preview | **Generate Preview** | Explicit destination label; implicit automatic Setup save | Saves the full draft, switches screen, generates from saved values; valid selected range may remain | Confirmed transition; Conversation names/objectives are not exposed |
| Teach-like Setup → Plan-like Preview | Open existing Preview through shell behavior | Explicit screen change where available | Existing proposal remains; unsaved draft may remain local | Partially implemented navigation |
| Plan → Plan | **Regenerate Preview** | Explicit | Replaces proposal from saved inputs; current Preview remains destination | Confirmed |
| Plan → Plan | Apply proposal-only suggested fix | Explicit user choice | Keeps Preview and revises current proposal only | Confirmed |
| Plan → Teach | **Review fixed time** suggested action | Explicit action, destination Conversation unnamed | Opens Setup, targets correct template, focuses and scrolls fixed-time input | Confirmed contextual transition |
| Plan → Teach-like input → Plan | Review fixed time, edit/save, then regenerate | Multiple explicit user actions | Template identity is preserved on return; later regeneration reflects saved change | Confirmed, tested at `DayFrameApp.test.tsx:1691` |
| Plan → persistent date context + Plan | Create/edit/delete manual event from selected day | Implicit mixed responsibility | Preserves selected date; mutates authored event state and automatically regenerates proposal | Architectural Divergence |
| Shared data management → Teach | Load profile | Explicit load action | Replaces authored setup, clears preview and selection, opens Setup | Shared Infrastructure |
| Shared data management → Teach | Import backup | Explicit file action | Replaces authored setup, clears preview, resets UI, opens Setup | Shared Infrastructure |
| Plan → Live | None | — | No accepted-plan or execution destination | Not Implemented |
| Live → Learn | None | — | No execution history or reflection destination | Not Implemented |
| Learn → Teach | None | — | No learned conclusion exists to update understanding | Not Implemented |
| Learn → Plan | None | — | No historical learning source or replanning transition | Not Implemented |

The implemented transition graph is therefore:

```text
Shared data tools ──load/import──> Setup (Teach-like)
                                      │
                                      │ Save / Generate Preview
                                      ▼
                                 Preview (Plan-like)
                                      │
                         revise / regenerate / filter
                                      │
                                      └──Review fixed time──> Setup

Preview ──accept──> Live ──history──> Learn ──refine──> Setup/Preview
           not implemented             not implemented
```

## Workspace Decomposition

### Setup Workspace

| Element | Implemented kind | Conversation ownership | Finding |
|---|---|---|---|
| Schedule Preferences | Workflow group | Teach | Enduring interpretation of days/weeks; Confirmed |
| Shifts | Workflow group | Teach | Enduring work structure; Confirmed |
| Cycles, segments, sequences, overrides | Workflow group | Teach | Recurring work structure; Confirmed |
| Templates and recurrences | Workflow group | Teach | Recurring commitments/routines and placement preferences; Confirmed |
| Preview Range | Workflow group | Plan | Proposal horizon placed inside Setup; Architectural Divergence |
| Save Setup | Workspace action | Teach, plus Plan range | Persists all groups together; Partially Implemented boundary |
| Expand/Collapse | Reusable interaction | None exclusively | Shared disclosure behavior |
| Dirty/saved status | Reusable interaction | Supports Teach | Confirmed feedback |

Setup is a screen and workspace, not an implemented Surface identity. It predominantly performs Teach responsibility, but its title and explanatory copy frame that work as authored setup/configuration.

### Preview Workspace

| Element | Implemented kind | Conversation ownership | Finding |
|---|---|---|---|
| Generate/Regenerate | Workflow/action | Plan | Confirmed |
| Planning summary | Read-only interaction | Plan | Confirmed |
| Day visualizer and day groups | Read-only interaction | Plan | Confirmed; not Live |
| Manual events list | Read-only proposal input distinction | Plan | Confirmed |
| Manual-event editor in shell day panel | Authored workflow | Plan/Teach boundary | Architectural Divergence |
| Friction and suggested fixes | Review/revision workflow | Plan | Confirmed |
| Repeated friction | Proposal analysis workflow | Plan | Confirmed; not Learn |
| Stale/range/guardrail messages | Reusable interactions | Plan with Teach dependencies | Confirmed boundary feedback |
| Holiday annotations | Contextual interaction | Plan | Confirmed |

Preview is explicitly described as a draft and states that it is not exported or saved to a calendar (`code/src/ui/DayFrameApp.tsx:1068-1085`). That language keeps it focused on proposed future organization. The workspace does not lead to acceptance or execution.

### Persistent Shell

| Element | Implemented kind | Ownership | Finding |
|---|---|---|---|
| Setup / Generate Preview navigation | Navigation infrastructure plus Generate workflow | Teach/Plan | Shared; Generate also mutates state |
| Compact preview calendar | Cross-workspace Plan context | Plan | Confirmed planning navigation |
| Calendar Day panel | Cross-workspace details/editor | Plan plus authored manual events | Boundary mixed |
| Saved Setup Profiles | Data-management workflow | None exclusively | Shared Infrastructure |
| Backup export/import | Data-management workflow | None exclusively | Shared Infrastructure |
| Clear Local Data | Data-management workflow | None exclusively | Shared Infrastructure |

Profiles, backups, and clearing data render in the persistent shell header rather than only inside the Setup render branch (`code/src/ui/DayFrameApp.tsx:434-655`, compared with `:1048-1115`). Their placement therefore does not establish Teach ownership.

## Boundary Findings

### Confirmed Boundaries

- Authored input collections and generated preview state are stored separately.
- Saving an authored change marks the existing preview stale instead of silently presenting it as current.
- Proposal-only suggested fixes revise the preview and do not rewrite enduring Setup collections.
- The fixed-time recommendation does not silently edit the template; it routes the user to the matching authored field.
- Manual events are visibly separated from generated scheduled blocks in Preview (`code/src/ui/PreviewScreen.tsx:237-310`).

### Partial Boundaries

- Generate Preview clearly moves to a proposal, but it also saves all current draft changes automatically.
- The stale warning communicates dependency between understanding and proposal, but Conversation ownership remains unnamed.
- Day selection is planning-focused, yet opening the compact day also opens an authored manual-event editor.

### Architectural Divergences

- Plan scope (`Preview Range`) is persisted within Setup.
- Persistent manual-event authoring is embedded in proposal review and automatically triggers proposal regeneration.
- Setup combines multiple enduring concepts under configuration-oriented language instead of presenting one coherent objective of understanding.

### Architecturally Unowned or Shared

- Named profile management, backup export/import, and local-data clearing are application-data operations. Chapter V does not assign those goals to one Conversation, and implementation behavior does not make them a planning activity.
- Expand/collapse, validation, warnings, confirmation, and recovery messages are reusable interactions. They support workflows but do not own planning responsibility.

## Conversation Language Inventory

### Language that reinforces Teach-like responsibility

- “Schedule Preferences”
- “Shifts”
- “Schedule Cycles”
- “Templates And Recurrences”
- explanatory copy that templates describe what should happen and recurrence controls how often they are considered
- fields for priority, preferred timing, flexibility, and rescheduling behavior

This language exposes the information being authored, but the dominant labels are “Setup,” “authored setup,” “schedule inputs,” and “Save Setup” (`code/src/ui/SetupScreen.tsx:156-169`; `code/src/ui/DayFrameApp.tsx:667-673`). It communicates configuration more directly than collaborative understanding.

### Language that reinforces Plan responsibility

- “Generate Preview”
- “draft schedule preview”
- “Review the draft schedule”
- “Planning Window”
- “Generated”
- “Revised”
- “Scheduled”
- “Unplaced”
- “Friction”
- labeled suggested fixes
- “Setup changed. Generate a new preview to see updates.”

These phrases consistently identify a future proposal and its revision state (`code/src/ui/DayFrameApp.tsx:694-704`, `:1068-1085`; `code/src/ui/PreviewScreen.tsx:86-150`).

### Language that could imply another Conversation but does not implement it

- “Calendar Day,” “Day Details,” and a current-day marker can resemble Live language, but the associated data and actions remain preview review and manual planning input.
- “Repeated Friction Patterns” can resemble Learn language, but its data source is the current preview window.
- Manual-event “Notes” could hold reflective or execution context, but the implementation neither labels nor consumes them that way.

### Absent Conversation language

No visible standalone navigation, heading, or workflow identity for **Teach**, **Live**, or **Learn** was found in the inspected UI. “Plan” is represented indirectly through “Planning Window” and preview language rather than as a named Conversation. There is no visible language for accepted plans, actual execution, history, reflection, or plan-versus-actual comparison.

## Behavioral Invariants

The following behaviors are consistent across implementation and tests:

1. The application begins on Setup (`DayFrameApp.tsx:74`; `DayFrameApp.test.tsx:70`).
2. The screen state has only Setup and Preview destinations (`DayFrameApp.tsx:38`, `:74`).
3. Generate Preview saves the current Setup draft before generation (`DayFrameApp.tsx:257-268`; `DayFrameApp.test.tsx:136`, `:522`).
4. Preview generation consumes persisted authored inputs and produces separate preview state (`dayFrameStore.ts:232-264`).
5. Authored Setup mutations mark an existing preview stale (`dayFrameStore.ts:50-143`; `DayFrameApp.test.tsx:1451`).
6. Regeneration rebuilds from saved understanding and clears stale status (`DayFrameApp.test.tsx:1477`).
7. Suggested fixes require a user-selected action; proposal-only fixes revise preview state (`dayFrameStore.ts:266-300`).
8. A fixed-time Teach change is not automatically applied from Preview; the user is returned to the relevant field (`DayFrameApp.tsx:415-424`; `DayFrameApp.test.tsx:1611`, `:1797`).
9. Manual-event changes are persistent planning inputs and regenerate an existing preview (`DayFrameApp.tsx:338-397`; `DayFrameApp.test.tsx:899`).
10. Repeated friction is derived only from visible day groups in the current preview (`PreviewScreen.tsx:73-84`, `:521-554`; `PreviewScreen.test.tsx:474`).
11. Profile loading and backup import replace authored state and clear the proposal (`dayFrameStore.ts:174-230`).
12. No implemented action converts a preview into an accepted plan or records execution reality.

## Architectural Gaps

The following Chapter V concepts have no confirmed user-facing implementation:

- explicit Conversation identity and independent objective for Teach, Plan, Live, and Learn;
- a complete Plan outcome that can be accepted;
- a Plan → Live transition;
- lightweight execution interaction;
- recording meaningful changes, interruptions, completion, delays, or deviations during lived time;
- an immutable or otherwise distinct record of lived reality;
- a Live → Learn transition;
- completed-plan review;
- planned-versus-actual comparison;
- reflection on outcomes;
- historical pattern and capacity analysis;
- user confirmation or interpretation of learned conclusions;
- Learn → Teach and Learn → Plan transitions;
- a continuous implemented cycle in which execution creates history and history improves understanding.

These are absence findings, not predictions about future work.

## Coverage Assessment

### Automated-test-supported findings

The five UI test files directly cover:

- initial Setup launch and shell navigation;
- Setup draft persistence, save, and authored collections;
- preferences, preview ranges, cycles, templates, recurrences, and selected template properties;
- generation guardrails and successful generation;
- compact day/range selection and day details;
- manual-event create/edit/delete;
- preview rendering, visual layout, warnings, holidays, friction, and repeated friction;
- proposal-only suggested fixes and contextual fixed-time return;
- stale preview and regeneration;
- profile create/load/delete;
- backup export/import and invalid-import recovery;
- clear-data confirmation and completion.

The relevant suite was executed for this audit:

```text
5 test files passed
75 tests passed
```

Command:

```text
npm test -- --run src/ui/tests/DayFrameApp.test.tsx src/ui/tests/PreviewScreen.test.tsx src/ui/tests/PreviewScreenContainer.test.tsx src/ui/tests/DayVisualizer.test.tsx src/ui/tests/previewRangeWarnings.test.ts
```

### Implementation-inspection-only findings

The following conclusions depend primarily on inspection:

- classification of screens, workspaces, reusable interactions, and shared infrastructure;
- dominant Conversation framing and language;
- exact persistence boundaries between authored setup and proposal state;
- no-automatic-fix guidance without contextual navigation;
- the notes field having no demonstrated consumer beyond storage/display editing;
- absence of plan acceptance, execution capture, historical review, and reflection workflows;
- absence of explicit Conversation identity.

Absence was assessed through inspection of all `code/src/ui/**` components, the central store actions in `code/src/state/dayFrameStore.ts`, the user-facing UI tests, and broad searches across `code/src/**` for acceptance, completion, execution, actual-time, interruption, deviation, history, reflection, outcome, learning, observation, and plan-versus-actual concepts. The only execution-like hit in executable non-test source was a core `"completed"` type literal; no UI workflow uses it.

### Coverage limits

- There is no dedicated `SetupScreen.test.tsx`; Setup behavior is exercised through `DayFrameApp.test.tsx`.
- Some individual Setup deletion confirmations are visible in implementation but are not each directly asserted by a named test.
- Automated tests demonstrate deterministic outcomes for fixed inputs in covered scenarios; they do not by themselves prove every possible planning input combination.
- Automated tests do not test Live or Learn behavior because no corresponding user-facing workflow was found.

## Open Questions

1. The core block type includes a `"completed"` status, but the inspected UI has no action or view using it. Implementation evidence is insufficient to determine whether any non-UI executable consumer treats it as execution state.
2. Manual-event notes are persisted, but no inspected generator, Preview view, execution view, or learning workflow gives the note semantic meaning beyond authored text. Their architectural ownership is therefore unresolved beyond the current workflow’s Plan/Teach boundary.
3. A manual event is date-specific and persistent. Chapter V distinguishes enduring understanding, proposals, execution, and reflection, but the current implementation supplies no explicit Conversation identity for this kind of temporary planning context; the present placement is therefore classified by behavior rather than an explicit ownership declaration.
4. The shell renders profiles and backup controls persistently. Their data-management behavior is clear, but Chapter V does not define a Conversation owner for application-data administration.
5. The generated preview exposes messages and candidate fixes for friction. Inspection confirms explanation at those points, but it does not establish whether every generated placement has a user-visible causal explanation.

