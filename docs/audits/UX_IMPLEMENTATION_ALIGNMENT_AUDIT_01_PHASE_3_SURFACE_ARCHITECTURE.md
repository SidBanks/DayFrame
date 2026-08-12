# UX Implementation Alignment Audit 01

## Phase 3 — Surface Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, Chapter VI — Surface Architecture  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-30

## Executive Findings

The current application provides one persistent shell around two mutually conditional screens: **Setup** and **Preview**. The screen state has only `"setup"` and `"preview"` values, starts on Setup, and conditionally renders one screen branch at a time (`code/src/ui/DayFrameApp.tsx:38`, `:74`, `:1048-1115`).

Neither screen is a complete direct equivalent of an approved Surface:

- Setup is the partial home of the **Teach Surface**. It persistently groups enduring schedule preferences, shifts, cycles, templates, and recurrences, but presents them as an “authored setup” and “schedule inputs.” It also contains Preview Range, a Plan-scope control (`code/src/ui/SetupScreen.tsx:153-285`).
- Preview is the partial home of the **Plan Surface**. It provides a stable proposal-review environment once a preview exists: generated and revised metadata, day-by-day schedules, unplaced candidates, friction, recommendations, and proposal revision (`code/src/ui/PreviewScreen.tsx:86-380`). It is incomplete as a Plan Surface because some planning activities remain in Setup or in shell panels, and no plan-acceptance outcome exists.
- No persistent environment corresponds to the **Live Surface**.
- No persistent environment corresponds to the **Learn Surface**.

Planner responsibilities are fragmented across three implementation regions:

1. Preview owns generated-proposal inspection, friction review, and most proposal-only revision.
2. Setup owns the proposal horizon and enduring inputs needed to change some planning outcomes.
3. The persistent shell owns compact day/range navigation and the selected-day/manual-event editor.

The implementation contains summary-like regions, but no architectural Summary environment. The Preview “Summary” is generated-proposal metadata and friction totals. The shell’s “Latest Preview” is a compact projection of the same proposal. Neither reads historical reality, goals, progress, allocation trends, or strategic outcomes.

The dominant Surface-level alignment issue is **distributed ownership**: substantial Teach and Plan responsibilities exist, but their stable homes are not one-to-one with their Conversations. Setup mixes Teach and proposal-scope editing; Plan work is split between Preview, Setup, and persistent shell context. Data-management controls also occupy persistent primary shell space alongside planning identity.

## Implemented Environment Matrix

| Environment | Render owner | Visible when / persistence | Principal purpose and workflows | Conversation responsibilities and controlled state | Surface classification | Evidence and tests |
|---|---|---|---|---|---|---|
| Application shell | `DayFrameApp` | Always; wraps both screens | Brand, current-workspace description, navigation, profiles, data tools, compact preview, selected-day panel | Shared navigation, data management, cross-screen Plan context; owns shell-local messages and selection state | Shared Shell Infrastructure with architecturally unowned utility region | `DayFrameApp.tsx:434-1047`; shell test `DayFrameApp.test.tsx:70` |
| Workspace identity/navigation region | `DayFrameApp` | Always | Names current activity; opens Setup or saves/generates Preview | Teach/Plan navigation; `currentScreen`; Generate also mutates authored and preview state | Shared Shell Infrastructure; partial Surface identity | `DayFrameApp.tsx:654-709`; tests `DayFrameApp.test.tsx:107`, `:136`, `:747` |
| Setup screen | `SetupScreen` through `DayFrameApp` | Only when `currentScreen === "setup"`; remounts when branch returns | Edit and save preferences, shifts, cycles, templates, recurrences, and preview range | Predominantly Teach; one Plan-scope control; local `setupDraft` is retained by parent across screen changes | Partially Implemented Teach Surface; mixed editor environment | `DayFrameApp.tsx:67-74`, `:1048-1063`; `SetupScreen.tsx:153-2253`; tests `DayFrameApp.test.tsx:70-396`, `:785` |
| Schedule Preferences editor | `SetupScreen` | Setup; collapsible, initially open | Edit global day boundary and week start | Teach-authored preferences; draft state | Contextual Workspace or Panel within Setup | `SetupScreen.tsx:127`, `:207-269`; test `DayFrameApp.test.tsx:158` |
| Preview Range editor | `SetupScreen` | Setup; collapsible, initially closed | Select proposal range source, preset, or dates | Plan scope stored in Setup draft | Boundary Ambiguity / Surface leakage | `SetupScreen.tsx:131`, `:271-415`; tests `DayFrameApp.test.tsx:177`, `:853`, `:873` |
| Shifts editor | `SetupScreen` | Setup; collapsible, initially open | Create, edit, and remove work-shift definitions | Teach-authored recurring structure | Contextual Workspace within partial Teach environment | `SetupScreen.tsx:128`, `:417-686`; test `DayFrameApp.test.tsx:198` |
| Cycles editor | `SetupScreen` | Setup; collapsible, initially closed | Create/edit cycles, segments, repeating sequences, and overrides | Teach-authored recurring work structure | Contextual Workspace within partial Teach environment | `SetupScreen.tsx:129`, `:688-1481`; tests `DayFrameApp.test.tsx:289`, `:326`, `:873` |
| Templates and Recurrences editor | `SetupScreen` | Setup; collapsible, initially closed | Create/edit repeatable blocks, placement intent, priority, flexibility, and recurrence | Teach-authored enduring planning knowledge | Contextual Workspace within partial Teach environment | `SetupScreen.tsx:130`, `:1483-2253`; tests `DayFrameApp.test.tsx:198`, `:1115`, `:1134`, `:2010` |
| Sticky Setup action/status bar | `SetupScreen` | Setup; sticky within viewport | Save all Setup draft groups, expand/collapse sections, show dirty/saved state | Teach save plus persisted Plan range; local disclosure/status | Contextual Workspace control with mixed scope | `SetupScreen.tsx:133`, `:166-205`; CSS `dayFrameUi.css:346-363`; tests `DayFrameApp.test.tsx:396`, `:785` |
| Focused fixed-time editor state | `SetupScreen` + `DayFrameApp` | After fixed-time recommendation; clears on generic navigation/save/edit | Focus and scroll to matching template fixed-time input | Plan → Teach contextual access; `focusedTemplateField` | Contextual Workspace, not a Surface | `DayFrameApp.tsx:87-90`, `:270-277`; `SetupScreen.tsx:135-151`; tests `DayFrameApp.test.tsx:1611`, `:1797` |
| Preview screen | `PreviewScreen` through `DayFrameApp` | Only when `currentScreen === "preview"` | Generate/regenerate and review a draft schedule; inspect/revise friction | Plan; reads `stateSnapshot.preview` and visible-range selection | Partially Implemented Plan Surface / persistent review workspace | `DayFrameApp.tsx:1064-1115`; `PreviewScreen.tsx:58-380`; tests `PreviewScreen.test.tsx:15-474` |
| Empty-preview region | `PreviewScreen` | Preview with no `preview` | Explain that no preview exists and what generation would show | Plan entry state; no controlled domain state | Contextual state within Preview | `PreviewScreen.tsx:58-70`; test `PreviewScreen.test.tsx:15` |
| Preview generation/guardrail panel | `DayFrameApp` | Preview; guardrail conditional on missing inputs | Regenerate; state limitations; warn about missing Setup and range mismatch | Plan generation with Teach dependencies | Contextual Workspace/Panel | `DayFrameApp.tsx:1065-1105`; tests `DayFrameApp.test.tsx:1184`, `:1200`, `:1524`, `:2190` |
| Preview metadata summary | `PreviewScreen` | Generated Preview | Show planning window, generated/revised timestamps, visible friction totals | Plan proposal metadata | Contextual Panel; not Summary/Learn Surface | `PreviewScreen.tsx:117-152`; tests `PreviewScreen.test.tsx:34`, `:456` |
| Repeated-friction area | `PreviewScreen` | Generated Preview with equivalent friction on multiple visible days | Expand repeated current-proposal occurrences and apply fixes | Plan analysis of current preview | Contextual Workspace/Panel; not Learn Surface | `PreviewScreen.tsx:154-200`, `:521-567`; test `PreviewScreen.test.tsx:474` |
| Preview day groups | `PreviewScreen` | Once per visible preview day | Review holidays, visual timeline, manual events, work, scheduled blocks, unplaced candidates, and friction | Plan proposal inspection | Contextual daily workspaces within Preview | `PreviewScreen.tsx:203-380`; tests `PreviewScreen.test.tsx:34-456` |
| Day visualizer | `DayVisualizer` | Within each preview day group | Spatially show proposed work and scheduled blocks and overlaps | Plan visualization; no execution mutation | Contextual Panel / reusable visualization | `PreviewScreen.tsx:230-235`; `DayVisualizer.tsx`; tests `DayVisualizer.test.tsx:16-121` |
| Per-day friction area | `PreviewScreen` | Day group; always has empty or populated state | Explain friction and expose selected fixes | Plan review and proposal revision | Contextual Workspace/Panel | `PreviewScreen.tsx:334-375`; tests `PreviewScreen.test.tsx:138`, `:260`, `:327`, `:350` |
| Compact Latest Preview/calendar | `DayFrameApp` | Persistent across Setup/Preview only while a preview exists | Show range/generation/friction overview; select day/range; open full Preview | Cross-screen Plan context; local selected range | Shared Shell cross-Surface planning context | `DayFrameApp.tsx:110-112`, `:711-786`; tests `DayFrameApp.test.tsx:548-747` |
| Calendar Day / selected-day panel | `DayFrameApp` | Shell whenever `activeManualEventDate` and draft exist | Review selected-day counts and manage manual events | Plan review plus persistent date-specific authored input | Contextual Workspace with Boundary Ambiguity | `DayFrameApp.tsx:113-125`, `:788-1043`; test `DayFrameApp.test.tsx:899` |
| Manual-event editor | `DayFrameApp` | Inside Calendar Day panel | Create/edit title, date, all-day/times, and notes; save regenerates existing preview | Plan context plus authored input | Contextual Workspace; Teach/Plan leakage | `DayFrameApp.tsx:308-397`, `:788-970`; test `DayFrameApp.test.tsx:899` |
| Profile/data-management region | `DayFrameApp` | Always in shell | Save/load/delete profiles, backup export/import, clear local data, show utility status | Application data management; loading/importing affects Teach state and clears preview | Shared Shell Infrastructure; architecturally unowned as a planning environment | `DayFrameApp.tsx:438-652`; tests `DayFrameApp.test.tsx:409`, `:2260-2484` |
| Confirmation interfaces | `SetupScreen`, `DayFrameApp` | Conditional after destructive action | Confirm/cancel deletions and local-data clearing | Reusable interaction supporting authored/data workflows | Contextual Workspace or Panel | `SetupScreen.tsx:118-126`; `DayFrameApp.tsx:599-635`, `:1005-1036`; tests `DayFrameApp.test.tsx:899`, `:2260` |
| Warning/status regions | `SetupScreen`, `PreviewScreen`, `DayFrameApp` | Conditional on dirty, saved, stale, range, validation, or utility state | Communicate state and recovery information | Reusable across Teach, Plan, and shared data tools | Contextual Panel / Shared Shell Infrastructure | `SetupScreen.tsx:133-205`; `PreviewScreen.tsx:93-114`; `DayFrameApp.tsx:1086-1105`; tests `DayFrameApp.test.tsx:396`, `:1451`, `:1524`, `:2484` |

## Approved-Surface Alignment Matrix

| Approved Surface | Owning Conversation and normative purpose | Current equivalent | Distributed responsibilities | Classification | Implementation evidence |
|---|---|---|---|---|---|
| Teach Surface | Teach; stable home for recurring structure, routines, commitments, goals, preferences, and enduring knowledge | Setup is the closest equivalent | Most enduring inputs are in Setup; manual date-specific authored input is in shell day panel; profiles/imports can replace Teach data from persistent shell | Partially Implemented | `SetupScreen.tsx:153-2253`; `DayFrameApp.tsx:308-397`, `:438-652` |
| Plan Surface | Plan; stable home for generated plans, recommendations, conflicts, and refinement before execution | Preview is the closest equivalent | Proposal inspection/fixes are in Preview; horizon is in Setup; compact navigation and manual events are in shell; enduring changes require leaving Preview | Partially Implemented with distributed responsibilities | `SetupScreen.tsx:271-415`; `DayFrameApp.tsx:711-1043`, `:1064-1115`; `PreviewScreen.tsx:86-380` |
| Live Surface | Live; awareness, lightweight adjustment, and meaningful event recording as reality unfolds | No equivalent | Current-day marker and day visualizer are Plan context only; no accepted plan or execution state | Not Implemented | Broad `code/src/**` inspection; UI contains no execution workflow |
| Learn Surface | Learn; historical review, recurring patterns, effectiveness, and future improvement | No equivalent | Repeated friction remains within current Preview; proposal summaries are not historical reflection | Not Implemented | `PreviewScreen.tsx:73-84`, `:154-200`, `:521-567`; no historical UI source found |

Chapter VI defines four primary Surfaces—Teach, Plan, Live, and Learn. It does not define “Setup,” “Preview,” or a standalone “Summary” as primary Surfaces. Those implementation labels are therefore evaluated by behavior rather than treated as approved Surface identities.

## Planner Surface Assessment

### Implemented Planner responsibilities

The implementation materially supports:

- reviewing a proposed schedule;
- examining work blocks, generated life blocks, manual events, and holidays;
- navigating individual days and selected ranges;
- identifying unplaced candidates;
- seeing proposal-window and revision metadata;
- reviewing friction and equivalent repeated friction;
- applying selected proposal-only recommendations;
- returning contextually to a fixed-time authored input;
- regenerating from saved inputs.

The Preview screen is the stable center of these responsibilities (`code/src/ui/PreviewScreen.tsx:86-380`). Tests confirm preview rendering, visible-range filtering, proposal revision, warnings, friction grouping, and contextual return (`code/src/ui/tests/PreviewScreen.test.tsx:34-474`; `code/src/ui/tests/DayFrameApp.test.tsx:548-631`, `:1346-1797`).

### Distribution and fragmentation

Planner activity is not unified in one implemented environment:

| Planner activity | Current environment |
|---|---|
| Proposal generation/regeneration | Shell Generate action and Preview top panel |
| Proposal review | Preview |
| Friction resolution | Preview |
| Change planning scope | Setup → Preview Range |
| Add/edit a date-specific commitment | Shell Calendar Day panel |
| Change recurring commitment or routine | Setup → Templates and Recurrences |
| Change fixed-time enduring input from recommendation | Preview → focused Setup editor |
| Select days/planning subrange | Persistent shell compact calendar |
| Inspect detailed selected day | Preview day group plus shell Calendar Day panel |

This distribution is partly appropriate contextual access: a proposal recommendation can send the user to the exact enduring input rather than silently changing it. It is also Surface fragmentation because Plan navigation, scope, review, and date-specific editing are owned by three separate render regions.

### Context preservation

The parent `DayFrameApp` owns `setupDraft`, preview selection, focused field, and manual-event panel state, so these values can survive child-screen unmounting (`code/src/ui/DayFrameApp.tsx:67-103`). Automated tests confirm that:

- unsaved Setup draft edits survive switching away and back (`DayFrameApp.test.tsx:136`);
- selected compact-preview day remains stable across Setup/Preview (`DayFrameApp.test.tsx:591`);
- a fixed-time recommendation focuses the correct Setup field (`DayFrameApp.test.tsx:1611`, `:1797`).

Context is intentionally cleared in some transitions: opening the full preview clears day/range selection (`DayFrameApp.tsx:176-184`), and profile loading clears preview selection and the preview itself (`DayFrameApp.tsx:498-500`; `dayFrameStore.ts:174-192`; test `DayFrameApp.test.tsx:814`).

### Missing Planner responsibilities

No workflow accepts a proposal or creates an accepted-plan state. Consequently, the Plan environment does not complete the normative “before execution” lifecycle or provide a Plan → Live destination. The interface exposes conflict explanations and recommended actions, but no general user-facing placement or capacity explanation exists for every successfully scheduled block.

### Surface-language alignment

“Preview,” “draft schedule,” “Review,” “Planning Window,” “Unplaced,” “Friction,” and “Regenerate Preview” communicate proposal review clearly (`code/src/ui/DayFrameApp.tsx:1068-1085`; `code/src/ui/PreviewScreen.tsx:89-150`). The environment is not called Plan or Planner, and the shell describes it primarily as generated-output review. Its implemented purpose is therefore clearer than its approved Surface identity.

## Summary Surface Assessment

### Implemented summary-like information

Two persistent or recurring regions use summary behavior:

1. Preview’s `Summary` displays planning window, generated time, revised time, visible friction counts, and work-dependent skips (`code/src/ui/PreviewScreen.tsx:117-152`).
2. The shell’s `Latest Preview` displays planning range, generation time, visible-day count, friction label, and selectable proposal days (`code/src/ui/DayFrameApp.tsx:711-785`).

Both are derived from the current generated proposal. The repeated-friction region likewise groups current visible proposal friction (`code/src/ui/PreviewScreen.tsx:521-567`).

### Surface classification

These regions do not form a persistent architectural Summary or Learn environment. They provide schedule metadata and counts inside Plan or the shared shell. They do not render Capacity as a strategic measure, Goals, Allocations, Progress, historical outcomes, trends from lived evidence, or reflective recommendations. Broad inspection of `code/src/ui/**` and `code/src/state/**` found no corresponding user-facing environment.

The CSS class `df-workflow-block--summary` on the shell brand/navigation region does not establish Summary Surface behavior (`code/src/ui/DayFrameApp.tsx:654`; `code/src/ui/dayFrameUi.css:302-310`). Its rendered content is brand, workspace status, navigation, and latest-preview context, not historical interpretation.

### Classification

**Not Implemented:** no persistent Summary environment or Learn Surface exists.  
**Confirmed contextual panels:** current-proposal metadata and friction totals exist within Plan-like contexts.

## Setup Environment Decomposition

### Environment character

Setup is persistent in the architectural sense that it is a repeatable top-level destination with stable purpose and retained parent-owned draft. It is transient in the render-tree sense: `SetupScreen` is mounted only while `currentScreen === "setup"` (`code/src/ui/DayFrameApp.tsx:1048-1063`). Its internal disclosure state is component-local, so leaving and remounting restores the default open/closed section state (`code/src/ui/SetupScreen.tsx:127-131`).

Behaviorally, Setup is a **mixed editor collection and configuration environment** that partially realizes the Teach Surface. Its sections form coherent contextual workspaces for related authored records, but the visible objective is editing/saving setup rather than answering a single understanding-oriented question.

### Section-by-section classification

| Setup region | Controlled state and activity | Classification |
|---|---|---|
| Schedule Preferences | Day-boundary/week interpretation in `setupDraft.schedulingPreferences` | Teach contextual workspace; Confirmed |
| Preview Range | Proposal horizon in `setupDraft.previewRange` | Plan control in Teach-like environment; Architectural Divergence |
| Shifts | Recurring work definitions | Teach contextual workspace; Confirmed |
| Cycles | Rotation, segment, sequence, and override structure | Teach contextual workspace; Confirmed |
| Templates and Recurrences | Repeatable activities and placement intent | Teach contextual workspace; Confirmed |
| Save Setup | Persists all preceding groups together | Mixed-scope workspace action; Partially Implemented |
| Dirty/saved state | Compares current draft with persisted authored state; reports unsaved/saved | Appropriate contextual status |
| Focused-field return | Opens matching template editor field after Plan recommendation | Appropriate cross-Surface contextual workspace |

### Data-management relationship

Profiles, backup/import, and clear-data controls are not children of `SetupScreen`; they render in the persistent shell before either screen branch (`code/src/ui/DayFrameApp.tsx:438-652`, `:1048-1115`). They are structurally separate from Setup but visually persistent alongside all planning work.

## Preview Environment Decomposition

### Environment character

Preview is more than a one-time generated-output screen because it:

- has a stable top-level destination;
- can retain an existing proposal;
- supports day/range navigation;
- exposes friction and recommendation actions;
- supports proposal regeneration and revision;
- provides repeated daily workspaces.

It therefore functions as a **partial Plan Surface and proposal-review workspace**, not merely a passive output page. It remains incomplete because planning scope and several authored changes are outside it, and it has no acceptance transition.

### Section-by-section classification

| Preview region | Purpose | Classification |
|---|---|---|
| Empty-preview state | Explain missing proposal and next generation goal | Contextual Plan state |
| Planning metadata | Identify window and generated/revised status | Contextual Plan summary; not Summary Surface |
| Compact day selection | Filter/navigate proposal from persistent shell | Shared-shell Plan context |
| Day visualizer | Spatial proposal inspection | Contextual Plan panel; not Live |
| Day details | Show selected-day counts and events in shell | Contextual Plan workspace with authored-input leakage |
| Manual events | Display separately in Preview; edit in shell panel | Plan context; mixed Plan/Teach boundary |
| Unplaced candidates | Show proposed work that needs placement | Confirmed Plan responsibility |
| Friction | Explain conflict and offer selected actions | Confirmed Plan responsibility |
| Repeated friction | Aggregate equivalent current-proposal conflicts | Confirmed Plan contextual analysis; not Learn |
| Warnings | Explain stale proposal, range mismatch, and incomplete inputs | Appropriate contextual Plan state |
| Regeneration | Replace proposal from saved understanding | Confirmed Plan workflow |
| Stale-preview state | Distinguish old proposal after saved authored changes | Appropriate Teach/Plan boundary signal |

### Activities that leave Preview

- Editing a fixed-time template through a recommendation opens Setup and focuses its field.
- Changing schedule preferences, shifts, cycles, templates, recurrences, or the proposal range requires Setup.
- Loading/importing a setup routes to Setup and removes the current preview.

Manual-event editing does not leave Preview context, but the editor is owned by the persistent shell rather than `PreviewScreen`.

## Shell and Contextual Workspace Assessment

### Persistent shell

| Shell element | Persistence and function | Classification |
|---|---|---|
| DayFrame brand and explanatory sequence | Always; describes Setup → Preview flow | Shared Shell Infrastructure |
| Current “Workspace” heading | Always; changes text by `currentScreen` | Global environment identity, partially aligned |
| Setup / Generate Preview controls | Always; one navigates, one saves/generates/navigates | Global navigation with workflow mutation |
| Saved Setup Profiles | Always; snapshots/replaces authored data | Data-management utility; architecturally unowned as Surface |
| Backup import/export | Always; transfers authored data | Data-management utility |
| Clear Local Data | Always; destructive local administration | Data-management utility |
| Latest Preview | Conditional on preview, independent of active screen | Cross-Surface Plan context |
| Calendar Day panel | Conditional on selected date/draft, independent of active screen | Contextual workspace with boundary ambiguity |
| Utility status messages | Conditional; reset by many navigation/actions | Shared shell feedback |

The shell supports continuity by keeping latest-proposal navigation visible even while Setup is active. It also weakens one-to-one Surface identity because data administration, Plan context, manual-event editing, and current workspace identity occupy the same persistent region.

### Contextual workspace behavior

| Contextual region | Owner | Open/close and context | Effect on primary flow |
|---|---|---|---|
| Setup section editor | Setup | Toggle hides content; draft remains; screen remount resets disclosure defaults | Supports focused authored editing |
| Calendar Day panel | Shell | Opens on compact-day click; Close clears active panel/draft; selected range is separately retained | Extends Preview context while remaining visible across screen branches |
| Manual-event editor | Calendar Day panel | Save retains panel and regenerates preview; delete confirms; Close dismisses editor | Mixes authored input into Plan context |
| Fixed-time focused editor | Setup | Opens from specific Preview fix; effect focuses/scrolls field; generic Setup navigation clears focus | Appropriate targeted cross-environment access |
| Friction occurrence expansion | Preview | Native `details` disclosure; proposal context stays visible | Contextual Plan inspection |
| Repeated-friction expansion | Preview | Native `details` per grouped pattern; individual fixes remain available | Contextual Plan inspection |
| Confirmation states | Setup/shell panel | Inline confirm/cancel, does not establish destination | Reusable contextual safety interaction |
| Validation/warning regions | Setup/Preview/shell | Conditional inline messages near active workflow | Reusable contextual feedback |

None of these regions independently owns a full planning Conversation; they are panels or focused workspaces.

## Cross-Surface Transition Map

```text
Persistent shell
├── Setup screen (partial Teach home)
│   ├── Generate Preview
│   │     └── saves draft + generates ──> Preview screen (partial Plan home)
│   └── Open Full Preview from Latest Preview
│         └── clears selected range ───> existing Preview
│
├── Compact Latest Preview
│   └── select day/range ─────────────> Preview + Calendar Day panel
│
├── profile load / backup import
│   └── replace authored data,
│       clear preview/selection ──────> Setup
│
└── Calendar Day manual event
      └── save/delete + auto-regenerate ──> retained Preview context

Preview
├── proposal-only fix ───────────────> revised Preview
├── Regenerate Preview ──────────────> replaced Preview
└── Review fixed time ───────────────> Setup / focused template field

Preview ──accept──> Live ──record history──> Learn
            not implemented                 not implemented
```

### Transition evidence

| Transition | Preserved context | Lost/reset context | Automatic mutation and clarity | Coverage |
|---|---|---|---|---|
| Setup → Preview through Generate | Parent-held draft values are saved; valid selected range can remain | Focused field and most shell messages reset | Automatically persists draft and generates; button detail says “Save this draft, generate, and open the preview” | `DayFrameApp.tsx:257-268`, `:693-708`; tests `:136`, `:522` |
| Preview → Setup through fixed-time review | Matching template ID and target field; preview and selected range remain | Shell messages reset | No authored value changes automatically; focused destination is explicit | `DayFrameApp.tsx:270-277`, `:415-424`; tests `:1611`, `:1797` |
| Setup → existing Preview without regeneration | Existing preview remains | `Open Full Preview` clears selected range | Available through persistent Latest Preview, not through the Generate navigation action | `DayFrameApp.tsx:176-184`, `:711-729`; tests `:631` |
| Compact calendar → Preview | Selected day/range and active date are set | Focused Setup field clears; messages reset | Opens Preview and the Calendar Day editor together | `DayFrameApp.tsx:279-306`; tests `:548`, `:591` |
| Selected day → Calendar Day panel | Date, proposal counts, and matching events | Close clears active date/editor but selected range is separate | No domain mutation until event save/delete | `DayFrameApp.tsx:788-1043`; test `:899` |
| Profile load → Setup | Saved profile list persists | Preview and selected range clear; active authored setup is replaced | Explicit load; routes to Setup | `DayFrameApp.tsx:495-509`; `dayFrameStore.ts:174-192`; tests `:409`, `:814` |
| Backup import → Setup | Saved profiles persist | Preview and selected range clear; active authored setup replaced | File selection/validation then explicit success or error | `DayFrameApp.tsx:576-592`, `:1591-1642`; tests `:2417`, `:2484` |
| Manual-event save → regenerated Preview | Selected day, panel draft, and screen context remain | Existing generated result is replaced | Save mutates authored events and automatically regenerates if a preview exists | `DayFrameApp.tsx:338-397`; test `:899` |
| Stale Preview → regeneration | Saved authored data and in-bounds selection remain | Old generated result is replaced; stale flag clears | Explicit Regenerate action | `DayFrameApp.tsx:253-255`, `:1073-1080`; tests `:1451`, `:1477` |

Profile load, import, and clear-data reset preview selection but do not explicitly reset `activeManualEventDate`, `manualEventDraft`, or `editingManualEventId` in their handlers (`code/src/ui/DayFrameApp.tsx:495-509`, `:599-620`, `:1591-1642`). Because the Calendar Day panel is conditional on those local values rather than preview existence (`code/src/ui/DayFrameApp.tsx:788`), implementation inspection does not establish that all selected-day editor context is cleared when the underlying authored setup is replaced. No direct automated test covers that combined state.

## Surface Boundary Findings

### Confirmed appropriate boundaries

- Only one main screen branch renders at a time, giving Setup and Preview distinct top-level contexts.
- The generated preview is stored separately from authored collections.
- Saved authored changes mark the preview stale rather than silently redefining it.
- Proposal-only fixes revise preview state without mutating Setup.
- Fixed-time review crosses to the exact authored editor without automatically changing the value.
- Preview separates manual events from generated blocks visually.
- Reusable confirmation, validation, and warning regions remain contextual rather than becoming destinations.

### Partial boundaries

- Setup is a stable destination for most Teach work but lacks explicit Teach Surface identity and includes proposal scope.
- Preview is a stable Plan review environment but depends on shell navigation/panels and Setup for several planning tasks.
- Compact Latest Preview preserves Plan context across screens but makes Plan content persist inside the shell rather than remain exclusively in the Plan environment.

### Surface leakage

- Preview Range is a Plan-scope control inside Setup.
- Manual-event authored state is edited in a shell panel opened from Preview and automatically regenerates Plan output.
- Schedule review is split between full Preview day groups, compact shell days, and shell Calendar Day counts.
- Data-management utilities occupy persistent shell space beside primary workspace identity on both screens.
- The Generate Preview control serves as navigation, Setup save, validation, and Plan generation in one action.

### Architecturally unowned environments

- Profile management, backup transfer, and local-data clearing have clear application goals but no single approved planning Surface owner.
- The shell brand/status region carries a `summary` styling class but has no Summary/Learn responsibility.

### Boundary ambiguity

- Date-specific manual events are persistent authored planning context, not demonstrated enduring Teach knowledge, proposal-only state, or Live reality.
- The Calendar Day panel remains a shell sibling of both screens and can therefore coexist with Setup even though its content is derived from Preview/day planning context.
- Proposal-range persistence places a Plan decision in the same saved snapshot as enduring authored understanding.

## Surface Language Assessment

### Setup identity

Visible language includes:

- “Setup”
- “Edit your authored setup in one place”
- “Setup your schedule inputs”
- “Schedule Preferences”
- “Preview Range”
- “Shifts”
- “Schedule Cycles”
- “Templates And Recurrences”
- “Save Setup”
- “Unsaved changes” / “All changes saved”

This consistently communicates an editor/configuration environment and the type of records it contains. It does not communicate the approved Teach Surface question, “How does my life work?”, or identify understanding as the output.

### Preview identity

Visible language includes:

- “Preview”
- “Generate a draft schedule preview”
- “Review your preview”
- “Planning Window”
- “Generated”
- “Revised”
- “Scheduled”
- “Unplaced”
- “Friction”
- “Repeated Friction Patterns”
- “Regenerate Preview”

This coherently communicates review of a proposed schedule. “Review the draft schedule day by day” explicitly distinguishes the environment from execution (`code/src/ui/PreviewScreen.tsx:89-92`). It does not use “Plan” or “Planner” as Surface identity and offers no acceptance language.

### Summary and adjacent terminology

“Summary” labels only current Preview metadata. The broad visible-string search found no user-facing “Capacity,” “Goals,” “Allocations,” “Progress,” “trends,” or historical “outcomes” environment. Suggested fixes function as recommendations, but the inspected UI labels the individual actions rather than providing a persistent “Recommendations” area.

“Calendar Day” and “Day Details” identify date context, not Live execution. “Latest Preview” identifies cross-screen proposal context, not historical status.

### Comprehension limit

Implementation confirms the text users are shown. Whether users actually understand the approved Surface purposes, distinctions, or ownership requires observational user research; automated tests do not establish comprehension.

## Responsive and Platform Behavior

The implementation uses CSS breakpoints rather than alternate React render trees:

- At 980px and above, the shell header grid becomes two columns (`code/src/ui/dayFrameUi.css:982-991`).
- Below 720px, padding and radii shrink, primary navigation becomes one column, compact preview days become narrower, and the day visualizer’s label column shrinks (`code/src/ui/dayFrameUi.css:993-1023`).
- Compact preview days already use a wrapping flex container at all sizes (`code/src/ui/dayFrameUi.css:779-805`).
- Collapsed Setup section content is hidden by explicit state-driven class behavior, not viewport width (`code/src/ui/dayFrameUi.css:223-244`; `SetupScreen.tsx:2267-2305`).

No responsive rule in the inspected stylesheet removes Setup, Preview, shell utilities, compact calendar controls, or contextual panels. The same semantic environments therefore reflow rather than becoming additional implemented screens. Surface ownership remains the same across breakpoints in executable structure.

No automated viewport or responsive-layout test was found. The conclusions above are implementation inspection of actual media rules and render structure; accessibility, usability, and practical reachability at device sizes are not demonstrated by tests.

## Behavioral Invariants

1. The application shell is always rendered; exactly one of Setup or Preview is rendered beneath it (`DayFrameApp.tsx:434-1115`).
2. The application opens on Setup (`DayFrameApp.tsx:74`; test `DayFrameApp.test.tsx:70`).
3. Setup and Preview are the only screen-state values (`DayFrameApp.tsx:38`).
4. Profiles and data-management controls remain in the shell across screen changes (`DayFrameApp.tsx:438-652`).
5. Latest Preview and compact days appear whenever preview state exists, independent of active screen (`DayFrameApp.tsx:110-112`, `:711-786`).
6. Setup draft state is parent-owned and survives screen changes (`DayFrameApp.tsx:67-72`; test `DayFrameApp.test.tsx:136`).
7. Setup’s internal disclosure state is component-owned and defaults on mount (`SetupScreen.tsx:127-131`; default-state test `DayFrameApp.test.tsx:785`).
8. Generate Preview saves the Setup draft, generates, and opens Preview (`DayFrameApp.tsx:257-268`; test `DayFrameApp.test.tsx:522`).
9. Proposal-only suggested fixes remain within Preview state (`dayFrameStore.ts:266-300`; tests `PreviewScreenContainer.test.tsx:49`, `:76`).
10. Fixed-time review opens Setup and focuses the correct contextual field (`DayFrameApp.tsx:270-277`; tests `DayFrameApp.test.tsx:1611`, `:1797`).
11. Selected compact-day context can survive Setup/Preview navigation (`DayFrameApp.test.tsx:591`).
12. Loading or importing authored setup clears preview state and routes to Setup (`dayFrameStore.ts:174-230`; tests `DayFrameApp.test.tsx:814`, `:2417`).
13. Repeated friction is computed from current visible preview day groups, not history (`PreviewScreen.tsx:73-84`, `:521-554`; test `PreviewScreen.test.tsx:474`).
14. Responsive behavior reflows the same environments; no alternate mobile screen state exists.

## Architectural Gaps

The following Chapter VI responsibilities have no complete implemented Surface:

- a Teach Surface with explicit, stable understanding-oriented identity;
- a Plan Surface that unifies scope, proposal review, contextual commitment editing, conflict resolution, and completion of planning;
- any Plan acceptance workflow leading toward execution;
- a Live Surface providing current execution awareness, lightweight adjustments, and meaningful reality capture;
- a Learn Surface providing historical review, recurring historical patterns, effectiveness evaluation, and improvement of future understanding;
- one-to-one visible ownership between each Conversation and one persistent Surface;
- a full four-Surface continuity path;
- clear persistent Surface identity that remains distinct from screen/action labels;
- an architectural Summary/Learn environment for high-level historical or strategic interpretation.

No recommendation or future implementation inference is attached to these absence findings.

## Coverage Assessment

### Automated-test-supported findings

The current UI suite covers:

- initial screen and screen visibility;
- persistent shell navigation;
- Setup draft retention across screen changes;
- default Setup disclosure and draft retention through collapse/reopen;
- generation and regeneration transitions;
- compact day/range selection;
- selected-day stability across Setup and Preview;
- Calendar Day/manual-event workflows;
- focused fixed-time return;
- stale-preview signaling;
- profile loading and preview-selection reset;
- backup import routing/state replacement;
- confirmation and error states;
- Preview summary, day groups, visualizer, friction, and repeated-friction behavior.

Relevant references are `code/src/ui/tests/DayFrameApp.test.tsx`, `PreviewScreen.test.tsx`, `PreviewScreenContainer.test.tsx`, `DayVisualizer.test.tsx`, and `previewRangeWarnings.test.ts`.

The same five-file suite used for the preceding phase was rerun for this audit:

```text
5 test files passed
75 tests passed
```

### Implementation-inspection-supported findings

Inspection establishes:

- render ownership and visibility conditions;
- shell versus screen/component structure;
- parent-owned versus component-owned context;
- persistence and reset behavior encoded by handlers;
- CSS breakpoint behavior;
- absence of Live/Learn render branches and actions;
- lack of a Summary environment beyond current-proposal panels;
- classification of panels and workspaces relative to Chapter VI.

### Not established by automated tests

- user comprehension of Surface identity;
- whether visual prominence causes utilities to obscure planning identity;
- practical usability of the responsive layout;
- whether users perceive contextual cross-environment transitions as continuous;
- whether users distinguish current-proposal summary from historical Summary/Learn information.

Those matters require observational user research; this audit does not assert their outcomes.

### Coverage limitations

- No responsive or viewport-specific test was found.
- No test directly asserts that the shell’s profile/data tools persist on both screen branches, although render structure makes that behavior executable.
- No test combines an open Calendar Day editor with profile load, backup import, or clear-data reset.
- Setup deletion confirmations are not each covered by a dedicated named test.
- Tests confirm rendered behavior and state transitions, not architectural comprehension.

## Open Questions

1. When profile load, backup import, or clear-data occurs while the Calendar Day panel is open, its local editor state is not explicitly reset by those handlers. No combined-state test establishes the resulting visible consistency.
2. Setup’s draft survives screen changes, while Setup’s local disclosure state remounts to defaults. Automated tests establish each behavior separately but not user interpretation of that mixed persistence.
3. Manual events have date-specific persistence and are consumed by generation, but current behavior does not clearly assign them to Teach, Plan, or Live Surface ownership.
4. The shell’s compact Latest Preview enables access to an existing preview without regeneration, while the primary “Generate Preview” control always saves and regenerates. Implementation behavior is clear; user understanding of these two paths is not tested.
5. The current proposal exposes friction explanations and suggested actions, but inspection does not establish a general explanation surface for all generated placements or capacity decisions.
6. A core `"completed"` block status literal exists, but no inspected user-facing component uses it. Its relationship to any executable non-UI environment is outside the confirmed Surface behavior.

