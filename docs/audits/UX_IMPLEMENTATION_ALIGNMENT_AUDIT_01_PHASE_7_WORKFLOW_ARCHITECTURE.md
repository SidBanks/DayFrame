# UX Implementation Alignment Audit 01

## Phase 7 — Workflow Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, workflow and lifecycle responsibilities across Teach, Plan, Live, Learn, and shared utilities  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-31

## Executive Findings

The implementation provides complete workflows for configuration-shaped Setup authoring, Setup saving, proposal generation and review, proposal regeneration, several friction resolutions, manual-event management, profiles, backup transfer, invalid-import recovery, and local-data clearing.

Workflow coordination is centralized in `DayFrameApp`. SetupScreen owns individual draft-editing steps, the store owns committed authored/generated/utility transformations, and PreviewScreen presents generated information and delegates selected recommendations back to the application coordinator (`code/src/ui/DayFrameApp.tsx:56-140`, `:186-431`; `code/src/state/dayFrameStore.ts:34-332`).

The strongest implemented continuities are:

- Setup draft → authored Setup → generated Preview;
- generated Preview → friction review → revised Preview;
- fixed-time recommendation → matching Setup field → saved/stale Preview → regenerated Preview;
- selected date → manual-event draft → authored event → automatically regenerated Preview;
- profile/import replacement → rebuilt Setup → later generation.

The most consequential compound workflow is **Generate Preview**. One activation saves all current Setup draft data before it checks generation prerequisites. It then changes to Preview and either creates/replaces the proposal or ends in a guardrail state. A failed generation therefore leaves authored changes committed (`code/src/ui/DayFrameApp.tsx:257-268`, `:222-228`).

Manual-event Save and Delete likewise compress two workflow stages: they commit authored event state and automatically regenerate Preview when one exists (`code/src/ui/DayFrameApp.tsx:338-397`). This creates a complete date-specific planning workflow but crosses authored and generated authorities from a shell panel embedded in Plan context.

Suggested fixes branch into two distinct workflows:

- proposal-only fixes revise Preview in place;
- `changeFixedTime` transfers the user to a precisely focused Setup field and requires explicit edit, save, return, and regeneration.

Both branches have executable completion outcomes in covered scenarios. Recommendations without automatic fixes and unplaced candidates have only partial or absent contextual continuations.

The approved lifecycle is incomplete. Teach-like workflows establish enduring authored state, and Plan-like workflows generate, inspect, and revise proposals. No proposal-acceptance workflow exists. No Live entry, execution/deviation workflow, historical outcome creation, Learn workflow, or Learn → Teach/Plan return exists. The lifecycle terminates at revised or regenerated Preview.

The dominant Workflow Architecture issue is that complete workflows are organized around Setup records and Preview generation rather than a full Teach → Plan → Live → Learn lifecycle. Within that limited lifecycle, state boundaries are mostly deterministic and test-supported, but several workflow boundaries are implicit or compound.

## Complete Workflow Inventory

Evidence labels: **Confirmed** means executable implementation directly establishes the sequence; **Inferred** is used only where intermediate behavior follows from multiple executable paths without a direct end-to-end test; **Not Found** means broad inspection found no executable workflow.

| Workflow objective | Entry and prerequisites | Confirmed sequence / authorities | Completion, failure, cancellation, recovery | Context and coverage | Classification |
|---|---|---|---|---|---|
| Initial Setup creation | Initial launch; seeded default store in normal app construction | App opens Setup → edit draft records → Save Setup; `SetupScreen` edits parent draft, store commits | Explicit save message; no whole-draft cancellation; individual deletes cancelable | Draft parent-owned; test `DayFrameApp.test.tsx:70`, authored edits `:198` | **Confirmed — Complete Workflow**, configuration-shaped |
| Return to Setup editing | Existing app state; Setup control or contextual return | Open Setup → edit retained/rebuilt draft → optional Save | Completion through Save; leaving via Open Full preserves unsaved draft; Generate saves it | Test `DayFrameApp.test.tsx:136`, `:591` | **Confirmed — Complete Workflow** |
| Save authored Setup | Setup draft exists | Save Setup → write preferences/range/shifts/cycles/templates/recurrences → mark Preview stale → show saved | Explicit completion; no validation failure in handler; no undo | `DayFrameApp.tsx:186-220`; tests `:158-396`, `:1451` | **Confirmed — Complete Workflow** |
| Create/edit/delete Setup records | Relevant Setup section open | Add default draft object or edit fields; delete request → cancel/confirm; Save commits | Draft completion is implicit until aggregate Save; cancellation for deletion only | `SetupScreen.tsx:417-2253`; tests `:198`, `:289`; individual paths partly tested | **Confirmed — Complete subordinate workflows** |
| First Preview generation | Saved or unsaved draft; requires ≥1 shift, cycle, enabled template, matching recurrence | Generate Preview → implicit Save → Preview screen → guardrail check → store generation → Preview result | Success: generated Preview; failure: missing-item list after Save; recovery: Setup, correct, Generate | `DayFrameApp.tsx:222-268`; tests `:522`, `:1184`, `:1200`, `:2190` | **Confirmed — Compound Workflow** |
| Preview review | Preview exists | Open generated/reused Preview → review summary/day/work/scheduled/unplaced/friction | Review objective ends informationally; no acceptance continuation | `PreviewScreen.tsx:86-380`; tests `PreviewScreen.test.tsx:34-474` | **Confirmed — Complete review workflow; Partial lifecycle workflow** |
| Full Preview reuse | Preview exists, Latest Preview visible | Open Full Preview → clear selected filter → render existing Preview | Explicit full view; no failure; selection discarded | `DayFrameApp.tsx:176-184`, `:711-729`; test `DayFrameApp.test.tsx:631` | **Confirmed — Complete contextual workflow** |
| Date/range-specific review | Preview exists | Select first compact day → filtered Preview + Calendar Day; select second → ordered range; review day groups/details | Completes with filtered review; Close ends panel but range remains; Open Full clears range | `DayFrameApp.tsx:279-336`, `:711-1043`; tests `:548-631`, `:747` | **Confirmed — Complete contextual workflow** |
| Preview regeneration | Existing Preview; saved authored state satisfies guardrails | Regenerate → validate saved state → replace Preview | Generated outcome and stale cleared; guardrail failure retains old Preview plus missing list | `DayFrameApp.tsx:253-255`, `:1073-1080`; tests `:1477`, `:1691` | **Confirmed — Complete Workflow** |
| Stale Preview recovery | Existing Preview becomes stale after authored save | Open/review stale Preview → Regenerate Preview → replacement result | Completion when stale warning disappears; old Preview remains until regeneration | `PreviewScreen.tsx:93-95`; tests `DayFrameApp.test.tsx:1451`, `:1477` | **Confirmed — Complete recovery workflow** |
| Friction review | Preview has visible friction | Review totals/pattern/day occurrence/message/fixes | Informational completion; if no fix, text directs manual Setup review; no precise continuation | `PreviewScreen.tsx:143-200`, `:334-375`; tests `PreviewScreen.test.tsx:138`, `:474` | **Confirmed — Complete review; Partial resolution workflow** |
| Apply proposal-only suggested fix | Preview has friction with supported fix | Select fix → app resolves IDs → store revises Preview → feedback/revised time/new friction | Explicit revised outcome; may resolve friction; no cancellation/undo after application | `DayFrameApp.tsx:399-431`; `dayFrameStore.ts:266-300`; tests `DayFrameApp.test.tsx:1346`, `PreviewScreenContainer.test.tsx:49`, `:76` | **Confirmed — Complete Workflow** |
| Fixed-time correction | Preview friction has `changeFixedTime` and matching template | Review fixed time → Setup focused field → edit → Save Setup → Open Full stale Preview → Regenerate | Completion in tested path: new placement, no friction; interruption can leave edit unsaved or Preview stale | `DayFrameApp.tsx:270-277`, `:415-424`; tests `:1611`, `:1691`, `:1797` | **Confirmed — Complete multi-environment workflow** |
| Friction without automatic fix | Visible friction has no suggested fix | Read guidance → manually open Setup → rediscover related data → Save/Regenerate if user proceeds | No object-specific handoff or implementation-defined completion | `PreviewScreen.tsx:188-191`, `:365-369` | **Confirmed — Partial Workflow** |
| Unplaced-candidate handling | Preview contains unplaced candidate | Review candidate title/priority only | No action, destination, completion, or contextual recovery | `PreviewScreen.tsx:313-332` | **Confirmed — Workflow dead end for placement objective** |
| Manual-event creation | Preview exists; compact date selected | Day click creates local default draft → edit → Save Event → store adds event → auto-regenerate → Day Details/Preview update | Explicit saved/result state; Close before Save discards draft; no explicit invalid-data branch | `DayFrameApp.tsx:279-377`, `:788-970`; test `DayFrameApp.test.tsx:899` | **Confirmed — Complete compound workflow** |
| Manual-event editing | Selected day has event | Day click or Edit Event copies event → edit draft → Save → replace authored event → auto-regenerate | Updated representations; Close abandons unsaved draft | `DayFrameApp.tsx:308-377`, `:987-1004`; test `:899` | **Confirmed — Complete compound workflow** |
| Manual-event deletion | Event exists in Calendar Day | Delete Event → confirmation → Cancel or Confirm → remove event → reset editor → auto-regenerate | Confirmed deletion; cancel retains object; Preview updates | `DayFrameApp.tsx:379-389`, `:1005-1036`; test `:899` confirms; cancel inspection | **Confirmed — Complete compound workflow** |
| Profile creation | Current authored Setup; nonblank name | Enter name → Save Current Setup as Profile → validate → snapshot/persist → success | Blank-name failure retains active state and shows error; edit/retry | `DayFrameApp.tsx:448-483`; `dayFrameStore.ts:145-172`; test `:409` | **Confirmed — Complete utility workflow** |
| Profile loading | Saved profile exists | Load Profile → replace active authored state → clear Preview → Setup → clear selection/messages → show load | Explicit replacement completion; no cancellation/confirmation; open event state not explicitly reset | `DayFrameApp.tsx:495-513`; `dayFrameStore.ts:174-192`; tests `:409`, `:814` | **Confirmed — Complete compound utility workflow** |
| Profile deletion | Saved profile exists | Delete Profile → remove/persist profiles → message | Explicit completion; no confirmation/cancel | `DayFrameApp.tsx:514-525`; `dayFrameStore.ts:194-203`; test `:409` | **Confirmed — Complete utility workflow** |
| Backup export | Current authored state; browser download API available | Export → clone authored backup → Blob/URL/anchor click → success message | Completion at triggered download; missing document anchor throws without UI catch in click handler | `DayFrameApp.tsx:531-548`, `:1636-1657`; test `:2297` | **Confirmed — Complete in tested environment; failure recovery Not Found** |
| Backup import | JSON file selected | Import control → native file chooser → read/parse/validate → replace authored state → clear Preview/selection → Setup → success | Cancel chooser: no change; invalid file: current state retained/error; retry available | `DayFrameApp.tsx:549-598`, `:1591-1634`; `dayFrameStore.ts:217-230`; tests `:2417`, `:2484` | **Confirmed — Complete utility workflow** |
| Clear local data | Any app context | Clear Local Data → inline confirmation → Cancel or Confirm → reset store/persistence/profiles → Setup → success | Cancel preserves state; confirm clears authored, generated, profiles, selection; some editor state not explicitly cleared | `DayFrameApp.tsx:558-635`; `dayFrameStore.ts:205-211`; tests `:2260`, `:2280` | **Confirmed — Complete destructive utility workflow** |
| Return after application reload | Persisted authored state/profile storage exists | New store reads storage → normalizes authored state/profiles → app builds draft → opens Setup | Authored/profile recovery complete; Preview is null; screen/selection/editor/disclosure/messages reset | `createInitialDayFrameState.ts:26-52`; `dayFrameStore.ts:335-452`; state tests `dayFrameStore.test.ts:24`, `:690` | **Confirmed — Partial returning-session workflow** |
| Proposal acceptance | Generated/revised Preview exists | No entry or transformation found | No accepted state or outcome | Broad `code/src/**` inspection | **Not Found — Not Implemented** |
| Live execution | Accepted plan would be prerequisite | No entry, user operation, or outcome found | No completion/skip/delay/actual/deviation workflow | Broad inspection; unused status values excluded | **Not Found — Not Implemented** |
| Learn/reflection | Historical execution would be prerequisite | No entry, history authority, or reflective transformation found | Repeated friction uses current Preview only | `PreviewScreen.tsx:521-567`; broad inspection | **Not Found — Not Implemented** |

## Workflow Dependency Map

```text
Persistent/initial authored state
        │
        ▼
Setup authoring ──Save Setup─────────────────────────────┐
        │                                                │
        └──Generate Preview (also saves)                 │
                  │                                      │
            ┌─────┴──────────┐                           │
            │                │                           │
     guardrail failed   Preview generated               │
            │                │                           │
      Setup correction      ├──full/date review          │
            └────retry──────>├──friction review          │
                             │      ├──proposal fix──> revised Preview
                             │      └──fixed-time──> Setup edit/save
                             │                          │
                             │                     stale Preview
                             │                          │
                             ├────────────────regenerate┘
                             │
                             └──Calendar Day event CRUD
                                      └──authored event + regenerated Preview

Profile/load or backup/import ──> replaced Setup ──> optional edit/generate
Persistence/reload ─────────────> restored authored Setup; Preview absent

Preview ──accept──> Live ──execution history──> Learn ──> Teach/Plan
           absent     absent                     absent
```

Dependencies:

- Preview review **requires** successful generation or a current injected Preview.
- Regeneration **requires** an existing Preview to expose the button, though the generator itself operates from saved Setup.
- Friction resolution **requires** Preview plus detected visible friction.
- Fixed-time correction **requires** a recommendation that resolves to a matching template.
- Calendar Day in the implemented UI **requires** current Preview because compact day controls are derived from Preview.
- Manual-event projection into Preview **requires** authored event save plus generation/regeneration.
- Profile load **requires** prior profile creation.
- Returning-session restoration **requires** successful persistence; Preview regeneration is then separate because Preview is not persisted.
- Live and Learn dependencies cannot be satisfied because their prerequisite acceptance/execution workflows are absent.

## Workflow State Models

### Setup authoring

```text
store authored state
      │ buildSetupDraft
      ▼
synchronized draft
      │ field/add/delete edit
      ▼
unsaved draft ──section collapse/screen switch──> unsaved draft preserved
      │
      ├──Save Setup──────────> authored saved
      │                           ├──no Preview──> saved
      │                           └──Preview exists──> saved + Preview stale
      │
      └──Generate Preview────> authored saved before validation
```

Evidence: draft/store synchronization at `DayFrameApp.tsx:67-72`, `:142-151`; save at `:186-220`; stale marking at `dayFrameStore.ts:50-143`.

There is no aggregate discard/restore interaction. Component remount resets disclosure and pending Setup deletion state, not parent draft values.

### Preview lifecycle

```text
absent
  │ Generate (after implicit Save)
  ├──missing prerequisites──> generation blocked / Preview still absent
  └──valid──────────────────> generated
                                ├──compact selection──> filtered
                                │      └──Open Full──> generated/full
                                ├──proposal fix──────> revised
                                ├──authored Save─────> stale
                                │      └──Regenerate──> regenerated/current
                                ├──Regenerate────────> regenerated/current
                                └──profile/import/clear──> cleared/absent

reload from persistence ──> absent (Preview is not persisted)
```

Generation result storage: `dayFrameStore.ts:232-264`; filter: `DayFrameApp.tsx:279-306`, `:1107-1115`; replacement/clear: `dayFrameStore.ts:174-230`.

### Friction resolution

```text
friction visible
   │
   ├──no suggested fix──────────────> informational partial endpoint
   │
   ├──proposal-only fix selected
   │        └──Preview revised──────> feedback / friction refreshed or resolved
   │
   └──changeFixedTime selected
            └──Setup matching field focused
                    ├──leave without Save──> authored unchanged; old Preview retained
                    └──edit + Save─────────> authored changed; Preview stale
                                                └──Regenerate──> refreshed/resolved Preview
```

The fixed-time end-to-end successful branch is directly tested at `DayFrameApp.test.tsx:1691`.

### Manual-event management

```text
Calendar Day closed
   │ select compact date
   ├──no existing event──> new default draft
   └──existing event─────> editing existing draft
                                 │
draft edited ────────────────────┤
   ├──Close──────────────> draft discarded / panel closed
   ├──Add Another────────> new default draft for active date
   ├──Save───────────────> authored event created/replaced
   │                           └──Preview exists──> automatically regenerated
   └──Delete request
          ├──Cancel──────> existing event retained
          └──Confirm─────> authored event deleted / editor reset
                               └──Preview exists──> automatically regenerated
```

Evidence: `DayFrameApp.tsx:308-397`, `:788-1043`; direct CRUD sequence test at `DayFrameApp.test.tsx:899`.

### Profile and backup replacement

```text
active authored Setup
   ├──Save Profile──> named snapshot persisted
   │                    └──Load Profile──> authored state replaced
   │                                          ├──Preview cleared
   │                                          ├──selection cleared
   │                                          └──Setup reopened
   │
   └──Import Backup file
          ├──no file────────> unchanged
          ├──invalid────────> unchanged + error ──retry available
          └──valid──────────> authored state replaced
                                  ├──profiles preserved
                                  ├──Preview/selection cleared
                                  └──Setup reopened + success
```

Evidence: `dayFrameStore.ts:145-230`; `DayFrameApp.tsx:462-525`, `:1591-1634`.

## Workflow Ownership Matrix

| Workflow family | Initiating owner | Coordinator | Transformation authority | Validation/confirmation | Completion environment | Failure/recovery owner | Ownership finding |
|---|---|---|---|---|---|---|---|
| Setup authoring | SetupScreen | DayFrameApp parent draft | Parent `setupDraft` | Field/native controls; inline Setup confirmations | Setup | Setup | Coherent draft ownership |
| Save Setup | Setup | DayFrameApp | Store authored setters | No aggregate validation/confirm | Setup | None explicit | Teach-like, includes Plan range |
| Generate | Persistent shell | DayFrameApp | Store authored setters then generator | DayFrameApp missing-item guardrail | Preview | Preview message + Setup recovery | Distributed/compound Teach → Plan ownership |
| Preview review/filter | Preview/shell summary | DayFrameApp + PreviewScreen | Context state only | None | Preview/Calendar Day | Open Full/Setup | Shared Plan ownership |
| Proposal fix | PreviewScreen | DayFrameApp | Store preview revision | Recommendation identity lookup | Preview | No-fix guidance or authored branch | Coherent Plan ownership |
| Fixed-time correction | Preview then Setup | DayFrameApp | Setup draft then store on Save; generator on Regenerate | User edit/Save; generation guardrail | Regenerated Preview | Setup/Preview | Explicit multi-owner handoff |
| Manual-event CRUD | Shell Calendar Day | DayFrameApp | Store manual events then generator | Inline delete confirmation; no save validation | Calendar Day + Preview | Close/cancel; no invalid-field recovery | Mixed Plan-context/authored/generated ownership |
| Profiles | Shell utility | DayFrameApp | Store profile or authored replacement | Name validation; no load/delete confirmation | Utility region or Setup | Utility error/input | Shared utility; load crosses to Teach |
| Backup | Shell utility/native chooser | DayFrameApp handler | Backup validator/store/browser | File parse/validation | Utility region or Setup | Same utility region | Shared utility; import crosses to Teach |
| Clear data | Shell utility | DayFrameApp | Store active/profile reset | Inline confirmation | Setup + utility message | Cancel in utility | Coherent utility ownership |
| Returning session | Application/store construction | Store initialization | Persistence loaders/normalizers | Invalid storage silently falls back | Setup | Initial/default state | Infrastructure-owned restoration |

## Workflow Boundary Matrix

| Boundary | Initiating step | Transferred/replaced information | Preserved information | Discarded information | Acknowledgement | Explicitness |
|---|---|---|---|---|---|---|
| Temporary Setup fields → draft | Field input | One draft attribute | Other draft/authored/Preview | Prior field draft value | Controlled field + dirty status | Explicit local edit |
| Draft → authored | Save Setup | All authored collections replace store values | Preview retained but stale; selections/editor context | Prior authoritative values | “Setup saved” | Explicit save, aggregate scope described |
| Draft → authored → generated | Generate Preview | Draft first replaces authored; generated result replaces Preview | In-bounds filter; editor context | Old Preview on success; nothing rolls back on failure | Preview or missing-item list | Compound but button detail discloses save/generate/open |
| Authored → generated | Regenerate | Current Preview replaced from saved inputs | Authored state, context if in bounds | Prior proposal result | New generated time; stale clears | Explicit |
| Generated → revised | Suggested fix | Scheduled/unplaced/friction result and revision metadata replaced | Authored state, screen/range | Prior proposal arrangement | Feedback/revised time | Explicit selected action |
| Preview recommendation → Setup draft context | Review fixed time | Template ID/focus target, not domain data | Preview and range | Shell messages; Setup local disclosure remounts | Focus/scroll | Explicit contextual handoff |
| Calendar draft → authored event | Save Event | Event collection replaces/adds event | Active date/editor identity | Prior event version | Updated Day Details | Explicit save |
| Authored event → generated | Automatic part of Save/Delete | Preview result replaced | Selected date/editor | Prior Preview | Changed Preview/friction | Implicit compound step |
| Profile snapshot → authored | Load Profile | Entire authored aggregate replaced; Preview null | Saved profile collection | Prior active authored state/Preview/selection | Load message + Setup | Explicit replacement copy; no confirmation |
| Backup file → authored | Valid Import | Validated authored aggregate replaced; Preview null | Profiles | Prior active authored/Preview/selection | Import success + Setup | Explicit import; replacement described generally |
| Active state → cleared initial | Confirm Clear | Authored, profiles, Preview replaced/removed | Some component-local editor/focus state not explicitly reset | Persistence keys, selection | Clear success + Setup | Confirmed destructive boundary |
| Persistence → returning app | Store construction | Persisted authored/profile state becomes authority | Authored content/snapshots | Preview, screen, selection, editors, disclosure, messages | Setup rendered | Automatic infrastructure boundary |
| Execution → historical | No step | None | None | N/A | None | **Not Found** |

## Workflow Completion Assessment

| Workflow | Implemented completion criterion | Completion type | Lifecycle status |
|---|---|---|---|
| Setup edit/save | Store reflects draft and “Setup saved” | Explicit | Teach-like completion |
| Draft object creation | Draft card exists; aggregate remains unsaved | Partial/dependent on Save | Subordinate workflow |
| Preview generation | Current nonstale Preview result rendered | Explicit | Plan proposal creation complete |
| Preview review | Information has been displayed; no commit state | Implicit informational endpoint | Plan inspection only |
| Preview regeneration | Preview replaced and stale warning absent | Explicit | Plan refresh complete |
| Proposal-only friction fix | Preview has `revisedAt`/feedback and revised result | Explicit | Plan revision complete |
| Fixed-time correction | Authored edit saved, Preview regenerated; tested outcome removes friction | Dependent on several workflows | Complete for supported/tested case |
| No-fix friction | No implementation-defined resolved state | Absent | Partial workflow |
| Manual-event create/edit | Event authoritative and current Preview regenerated when present | Explicit through rendered result | Complete planning-context workflow |
| Manual-event delete | Event absent and Preview regenerated | Explicit | Complete |
| Profile save | Snapshot in list + success message | Explicit | Complete utility workflow |
| Profile load | Active authored data replaced, Preview cleared, Setup visible | Explicit | Complete replacement workflow |
| Profile delete | Snapshot absent + message | Explicit | Complete utility workflow |
| Backup export | Download activation + success message | Explicit in tested browser environment | Complete utility workflow |
| Backup import | Authored replacement + Setup + success | Explicit | Complete utility workflow |
| Clear data | Initial state + persistence removed + message | Explicit | Complete utility workflow |
| Returning session | Authored state/profiles loaded into Setup | Partial | Proposal/context restoration absent |
| Proposal acceptance | None | Absent | Not Implemented |
| Live execution | None | Absent | Not Implemented |
| Learn reflection | None | Absent | Not Implemented |

## Failure and Recovery Matrix

| Failure/interruption | Trigger | Already committed | Preserved state | Visible feedback | Implemented recovery / cancellation | Coverage |
|---|---|---|---|---|---|---|
| Generation guardrail | Missing shift, cycle, enabled template, or matching recurrence | Full Setup draft has already been saved | Authored Setup; any prior Preview remains; screen is Preview | Itemized “Finish setup” list | Open Setup, add missing data, Generate again | Tests `DayFrameApp.test.tsx:1184`, `:1200`, `:2190` |
| Lower-level generation exception | Invalid relationship/window not caught by presence guardrail | Setup already saved for Generate path | Implementation-dependent after thrown exception | No catch/rendered recovery in `generatePreviewFromState` | **Not Found** | Inspection `DayFrameApp.tsx:222-250` |
| Blank profile name | Save profile with whitespace/empty | Nothing | Active Setup/Preview/profile list | “Profile name is required” error | Edit name and retry | Test sequence at `:409`; store `dayFrameStore.ts:145-150` |
| Invalid backup | Invalid JSON/schema/read | Nothing replaced | Authored, Preview, selection, screen | Error message | Select Import and retry; input reset | Test `:2484`; handler `DayFrameApp.tsx:1605-1633` |
| File chooser cancelled/no file | No selected file | Nothing | All app state | No message | Workflow terminates unchanged; retry available | Implementation-confirmed `:1605-1612` |
| Export environment unavailable | No document anchor | Backup object created; no download | Domain state | Handler throws; no local catch/message | **Not Found** | `DayFrameApp.tsx:1636-1657` |
| Stale Preview | Save authored changes after Preview | Authored changes committed | Old Preview and context | Stale warning | Regenerate from Preview | Tests `:1451`, `:1477` |
| No automatic friction fix | Friction has zero fixes | No mutation | Preview/problem | Text instruction | Manually open Setup and rediscover related input | Inspection `PreviewScreen.tsx:188-191`, `:365-369` |
| Unplaced candidate | Generation leaves candidate unplaced | Preview committed | Candidate/Preview | “needs placement” | No contextual recovery interaction | `PreviewScreen.tsx:313-332` |
| Missing fixed-time template mapping | Recommendation action exists but mapping returns no template | No authored mutation; generic fix path attempted afterward | Preview | Depends on revision feedback | No direct tested recovery | `DayFrameApp.tsx:415-431` |
| Manual-event invalid/missing title | Save with blank title | Event commits as “Untitled Event” | Other state | Result title | No failure state; fallback completion | `DayFrameApp.tsx:343-360` |
| Manual-event invalid/missing time | Non-all-day blank/invalid time input | Save casts draft strings; no explicit application validation | Context retained until resulting behavior | No dedicated validation message | **Not Found** | `DayFrameApp.tsx:343-355` |
| Out-of-bounds filter after generation | Saved range no longer contains selected filter | Setup and new Preview committed | New Preview | No separate message | Filter automatically clears | `DayFrameApp.tsx:239-248`; direct end-to-end test absent |
| Replacement during open contextual editor | Profile/import/clear while Calendar Day open | Replacement commits | Editor local state may remain | Replacement success | No explicit editor reset | No combined test |

The generation guardrail is structurally notable: validation occurs after `saveCurrentSetup(false)`. Recovery does not restore the pre-attempt authored state because that state has already been replaced.

## Cancellation and Interruption Assessment

### Confirmed cancellation paths

- Shift/cycle/segment/template deletion Cancel preserves the draft object.
- Manual-event deletion Cancel preserves the authoritative event.
- Clear Local Data Cancel preserves all application data.
- Native backup selection with no file returns unchanged.
- Calendar Day Close discards the temporary manual-event draft and closes the editor without committing.
- Invalid import rejects external input and preserves current domain state.

### Leaving or switching during active work

- Opening Preview through Generate does not abandon an unsaved Setup draft; it saves it.
- Opening an existing Preview through Open Full does not save the draft, and parent-owned draft values survive return (`DayFrameApp.test.tsx:136`).
- Selecting a compact day while Setup is open changes to Preview and leaves the Setup draft in parent memory.
- Setup disclosure and pending Setup deletion states are component-local and remount to defaults after leaving Setup (`SetupScreen.tsx:118-131`).
- Selecting another compact date replaces the current manual-event draft with the existing/new draft for the new date; unsaved values from the prior date are discarded (`DayFrameApp.tsx:279-336`).
- Profile load/import/clear can replace authored state during an unsaved Setup draft. Store notification rebuilds the draft from replacement state (`DayFrameApp.tsx:142-151`); no confirmation protects unsaved draft values.
- Browser/application reload restores persisted authored state but discards unsaved draft, Preview, screen, selection, editor, disclosure, confirmation, focus, and messages.

No browser Back/history cancellation workflow is implemented.

## Context-Preservation Matrix

Legend: **P** preserved; **C** explicitly cleared; **R** replaced; **M** reset by remount/initialization; **U** untested or not explicitly coordinated; **N/A** not applicable.

| Workflow transition | Setup draft / dirty | Preview / stale | Day/range | Calendar editor | Focus | Confirmation | Messages/feedback |
|---|---:|---:|---:|---:|---:|---:|---:|
| Setup edit → Save | R to synchronized/clean | P, marked stale if present | P | P | C | P | Save message R |
| Setup → Generate success | R/saved | R/current | P if in bounds; C otherwise | P | C | clear-data confirm C | utility messages C |
| Setup → Generate guardrail | R/saved | P if prior; absent otherwise | P | P | C | clear-data confirm C | guardrail R |
| Setup → Open Full existing Preview | P/dirty P | P | C | P | C | clear-data confirm C via reset | shell messages C |
| Preview → Setup generic | P | P/stale P | P | P | C | clear-data confirm C | shell messages C |
| Preview → focused Setup | P | P | P | P | R to target | clear-data confirm C | shell messages C |
| Save fixed-time correction | R/clean | P → stale | P | P | C | P | Save message R |
| Stale → Regenerate | P | R/current | P if valid | P | P/null | P | guardrail C on success |
| Day selection → Calendar Day | P | P | R | R/new or copied | C | delete confirmation normally reset only by panel logic | shell messages C |
| Event draft → Save | P | R if present | P | P/normalized | P/null | P | Preview feedback as generated result |
| Event draft → Close | P | P | P | C | P/null | C | P |
| Event delete cancel | P | P | P | P | P | C | P |
| Profile load | R | C | C | U | U/not explicitly cleared | clear-data C | profile message R |
| Valid import | R | C | C | U | U | clear-data C | import message R |
| Invalid import | P | P | P | P | P | P except message ordering | error R |
| Confirm clear | R/initial | C | C | U | U | C | clear message R |
| App reload | R from persisted/clean | C | M/null | M/null | M/null | M | M/empty |

Parent ownership of draft/range/editor/focus state is defined at `DayFrameApp.tsx:67-103`. Setup disclosure/confirmation state is owned by `SetupScreen` at `SetupScreen.tsx:118-131`.

## Workflow Branching

| Decision point | Branches | Rejoin/termination |
|---|---|---|
| Leave edited Setup | Save Setup; Generate Preview; Open Full existing Preview; select compact day | Save/Generate commit; Open/day paths preserve unsaved draft; can rejoin at Setup |
| Generate Preview | Prerequisites complete; missing items | Success enters generated Preview; failure enters guardrail and can retry after Setup |
| Review Preview | Full; filtered day/range; Calendar Day; friction | Branches remain projections of current Preview and rejoin through Open Full |
| Friction recommendation | Proposal-only action; fixed-time correction; no automatic fix | Proposal fix rejoins revised Preview; fixed correction rejoins after save/regenerate; no-fix is partial |
| Manual event | New draft; edit existing; Add Another; Close; delete | Save/delete rejoin regenerated Preview; Close terminates without commit |
| Deletion | Confirm; Cancel | Confirm transforms; Cancel rejoins unchanged editor |
| Import | No file; invalid; valid | No file ends unchanged; invalid can retry; valid enters replaced Setup |
| Stale Preview | Review old result; Regenerate | Review remains stale; regeneration rejoins current Preview |
| Proposal completion | Continue to Live | No branch implemented; lifecycle terminates |

## Compound Workflow Assessment

### Generate Preview

One activation performs, in order:

1. resolve current Preview Range from draft;
2. persist preferences;
3. persist range;
4. persist shifts;
5. persist cycles;
6. persist templates;
7. persist recurrences;
8. switch to Preview and reset several shell states;
9. test prerequisite presence;
10. either store guardrail information or generate/replace Preview;
11. clear an out-of-bounds selected range if required.

Evidence: `DayFrameApp.tsx:186-268`.

**Workflow consequence:** generation failure does not roll back the preceding authored save.

### Save/Delete manual event

Save constructs an event (falling back to “Untitled Event”), replaces the authored event collection, normalizes the editor to the committed event, then regenerates Preview if present. Delete removes the event, resets confirmation/edit state, recreates the date editor, then regenerates (`DayFrameApp.tsx:338-397`).

**Workflow consequence:** authored-event completion and proposal refresh are one user step.

### Load profile

The store validates existence, replaces the active authored aggregate, preserves saved profiles, and clears Preview. The UI then switches to Setup, clears selected Preview context and workflow messages, and reports completion (`dayFrameStore.ts:174-192`; `DayFrameApp.tsx:495-509`).

### Import backup

The handler clears the file input, reads/parses/validates the file, replaces authored state while preserving profiles, clears Preview, switches to Setup, clears selection/guardrails/confirmation, and reports success. Its failure branch preserves domain state and reports error (`DayFrameApp.tsx:1591-1634`; `dayFrameStore.ts:217-230`).

### Clear Local Data

After explicit confirmation, the store resets active state and removes both persistence stores. The application changes to Setup, clears selection and several messages, and reports completion (`DayFrameApp.tsx:599-624`; `dayFrameStore.ts:205-211`). Calendar editor and focused-template local state are not explicitly included in the reset handler.

## Teach Workflow Assessment

### Confirmed

- Initial and returning Setup authoring establish/revise persistent preferences, shifts, cycles, templates, recurrences, and manual events.
- Draft versus authoritative state is visible through dirty/saved status.
- Save explicitly completes the authored transformation.
- Saving invalidates current proposal through stale state.
- A fixed-time Plan recommendation can return precisely to the relevant authored field.
- Profiles/imports replace enduring authored understanding and reopen Setup.

### Partial / divergent

- Workflow entry is organized around configuration records, not a shared intent or recognizable Commitment/Routine/Goal capture.
- Preview Range is committed with Teach-like authored state although it scopes Plan.
- Generate implicitly completes Teach saving while entering Plan.
- Manual events are authored from a Plan-context shell panel.
- Profiles/imports replace an unsaved draft without a cancellation/confirmation workflow.

**Assessment:** **Confirmed — Complete configuration-shaped Teach workflows; partial architectural Teach alignment.**

## Plan Workflow Assessment

| Plan responsibility | Implemented workflow | Assessment |
|---|---|---|
| Proposal creation | Generate Preview from current authored Setup | **Confirmed** |
| Proposal regeneration | Regenerate from saved authored state | **Confirmed** |
| Proposal inspection | Summary, full/day/range review, visualizer, manual/work/scheduled/unplaced/friction | **Confirmed** |
| Proposal revision | Suggested fixes revise current Preview | **Confirmed** |
| Authored correction from planning problem | Fixed-time handoff → Save → stale → regenerate | **Confirmed** for supported path |
| Date-specific planning context | Manual-event CRUD → auto-regenerated Preview | **Confirmed; ownership divergent** |
| Proposal comparison | Old proposal is replaced; no side-by-side or version comparison | **Not Implemented** |
| Proposal acceptance | No accepted-plan transformation or completion | **Not Implemented** |
| Transition to execution | No destination/workflow | **Not Implemented** |

The Plan workflow is complete for generating, inspecting, and revising a draft. It is partial as a lifecycle workflow because it has no acceptance outcome.

## Live Workflow Assessment

Broad executable inspection found no workflow with an entry, user transformation, and outcome for:

- beginning an accepted plan;
- viewing execution rather than proposal context;
- starting/completing/skipping/delaying/interruption/resumption;
- recording actual start/finish;
- recording deviation or actual outcome;
- execution-context Note capture.

Current-day highlighting, DayVisualizer, and core status literals do not transform execution state. They are therefore excluded.

**Not Found — Not Implemented.**

## Learn Workflow Assessment

No workflow exists for historical review, plan-versus-actual comparison, reflection, historical pattern identification, learned-conclusion confirmation/rejection, or applying learning to future authored state.

Repeated Friction Patterns iterates current visible Preview day groups and does not depend on execution history (`code/src/ui/PreviewScreen.tsx:73-84`, `:521-567`). It remains a Plan review workflow.

**Not Found — Not Implemented.**

## Shared Utility Workflow Assessment

Profiles and backups support lifecycle state by snapshotting/transferring authored Setup. Their completion/failure information is explicit. Load/import clear the proposal because it no longer corresponds to the replaced authored state. Clear Local Data is protected by confirmation and removes both active and profile persistence.

Utilities also interrupt active lifecycle context:

- profile/data controls are always present;
- load/import/clear replace or remove lifecycle authority and route to Setup;
- selection clears, but Calendar editor/focus state is not comprehensively reset;
- an unsaved Setup draft can be replaced through subscription-driven rebuild without a confirmation step.

Returning-session infrastructure restores authored Setup and profiles, but not generated proposal or UI workflow context.

## Workflow Continuity Assessment

### Confirmed coherent continuities

- Setup Save produces authored input usable by generation.
- Generation produces Preview input usable by review and friction resolution.
- Proposal-only fix produces revised Preview immediately available for continued review.
- Fixed-time recommendation retains template identity across Preview → Setup.
- Authored fixed-time correction marks the preserved Preview stale, and regeneration uses the change.
- Manual-event Save/Delete produces a refreshed Preview without manual reconstruction of the selected day context.
- Profile/import replacement leads to rebuilt Setup that can later generate.
- persistence produces returning authored Setup.

### Disconnected or missing continuities

- no-fix friction provides no object-specific continuation;
- unplaced candidate has no continuation;
- Preview revision has no undo/comparison workflow;
- Preview has no acceptance continuation;
- Plan output cannot become Live input;
- no execution output can become Learn input;
- no Learn result can become Teach/Plan input;
- returning-session output does not include the previous Preview or contextual task position.

## Dead Ends and Recovery Assessment

| Reachable state | Classification | Continuation |
|---|---|---|
| Successfully saved Setup | Deliberate terminal state for Save; also valid input to Generate | Generate Preview available |
| Generated/revised Preview | Informational endpoint for review; incomplete lifecycle endpoint | Review/revise/regenerate/Setup available; no accept/Live |
| Generation guardrail | Recoverable interruption | Setup correction + Generate |
| Stale Preview | Recoverable interruption | Regenerate |
| Invalid import/profile name | Recoverable failure | Correct input/retry |
| No automatic friction fix | Partial workflow | Generic Setup/manual rediscovery |
| Unplaced candidate | True contextual workflow dead end | No associated action |
| Missing fixed-template mapping | Open Question | Generic revision path may provide feedback; untested |
| Preview after final revision | Not Implemented lifecycle continuation | No acceptance/execution |
| Current date/day visualizer | Informational endpoint | No execution transformation |
| Repeated friction | Complete Plan review endpoint | Fix if offered; not Learn |

## Structural Findings

1. DayFrameApp is the central workflow coordinator across Setup, Preview, Calendar Day, and utilities.
2. SetupScreen owns local draft progression; the store owns committed workflow transformations.
3. Setup authoring is a two-stage draft/commit workflow.
4. Generate Preview compresses Teach completion, environment transition, validation, and Plan creation.
5. Generation guardrail failure occurs after authored commit.
6. Preview has distinct absent, blocked, generated, filtered, revised, stale, regenerated, and cleared states.
7. Proposal-only and authored-correction recommendations are separate workflow branches.
8. The fixed-time branch preserves precise object identity across environments.
9. Manual-event workflows cross contextual, authored, and generated authorities in one completion step.
10. Utility replacement workflows clear Preview but do not explicitly coordinate every contextual editor state.
11. Returning sessions restore authored state and profiles, not generated or contextual workflow state.
12. Cancellation is implemented for most destructive Setup/event/data workflows, but not profile deletion or replacement workflows.
13. Proposal review/revision has no acceptance state.
14. Live and Learn workflow state machines are absent.
15. Complete workflows are predominantly organized around implementation records and data administration.

## Experiential Findings

These are implementation-grounded consequences, not claims about cognition or satisfaction.

1. A failed Generate attempt leaves current draft changes saved because Save precedes validation.
2. Opening Preview through Generate replaces an existing proposal; opening through Open Full reuses it and clears filtering.
3. Leaving Setup through Open Full can preserve an unsaved draft, while leaving through Generate commits it.
4. A proposal-only fix returns an updated proposal without leaving Preview.
5. A fixed-time fix transfers to the exact editor, but returning to changed results requires Save and regeneration.
6. Manual-event Save/Delete updates both authoritative event data and proposal output with one activation.
7. Closing an event editor discards its draft; selecting another date also replaces that draft.
8. Cancelling deletion or clear preserves the targeted information.
9. Profile/import replacement clears the proposal and selected range while reopening Setup.
10. Reload restores authored information but starts at Setup with no Preview or local task context.
11. Unplaced candidates remain visible without an implemented placement continuation.
12. The final implemented planning state is a generated or revised proposal rather than an accepted or executing plan.

Whether these consequences are understood, anticipated, efficient, or experienced as continuous requires observational research.

## Behavioral Invariants

1. The application initializes at Setup.
2. Setup edits remain in a parent-owned draft until Save or Generate.
3. Save Setup commits every authored Setup collection together.
4. Every authored setter marks an existing Preview stale.
5. Generate Preview saves before checking prerequisites.
6. Successful generation replaces Preview and clears stale state.
7. Regenerate uses saved authored state, not unsaved Setup draft.
8. Proposal-only suggested fixes revise only current Preview.
9. Fixed-time recommendations do not automatically edit authored state.
10. Manual-event Save/Delete automatically regenerates an existing Preview.
11. Profile load and backup import replace authored state, clear Preview, preserve profile storage, and reopen Setup.
12. Clear Local Data requires confirmation and removes active/profile persistence.
13. Invalid backup import preserves current domain state.
14. App reload restores persisted authored state with Preview null.
15. No workflow accepts a proposal, creates execution state, or creates historical learning state.

## Architectural Gaps

The approved lifecycle responsibilities without executable workflows are:

- intent-first Teach capture for Commitments, Routines, and Goals;
- Goal authoring workflow;
- plan comparison/version selection;
- plan acceptance;
- Plan → Live handoff;
- starting or resuming an accepted plan;
- completing, skipping, delaying, interrupting, or adjusting during execution;
- actual-time and deviation capture;
- execution-context Note capture;
- immutable lived-history creation;
- Live → Learn handoff;
- historical outcome review;
- planned-versus-actual comparison;
- Reflection capture;
- learned-pattern confirmation/rejection;
- Learn → Teach and Learn → Plan handoffs;
- complete continuing Teach → Plan → Live → Learn lifecycle;
- contextual recovery for unplaced candidates;
- precise recovery for every no-fix friction case;
- proposal-fix undo or proposal comparison;
- restoration of in-progress workflow context after reload.

These are absence findings only.

## Coverage Assessment

### Directly tested workflows

- initial Setup render;
- draft preservation across screen changes;
- Setup save for preferences/range/authored collections;
- repeating cycle editing and generation;
- first generation and guardrail failure;
- full/date/range Preview review;
- manual-event create/edit/delete with proposal effects;
- proposal-only suggested fix;
- stale Preview regeneration;
- fixed-time focus and correction/save/reopen/regenerate sequence;
- profile create/load/delete;
- backup export, valid import, invalid-import recovery;
- clear-data confirmation/cancel/completion.

Primary UI evidence: `code/src/ui/tests/DayFrameApp.test.tsx`, `PreviewScreen.test.tsx`, `PreviewScreenContainer.test.tsx`, `DayVisualizer.test.tsx`, and `previewRangeWarnings.test.ts`.

### Partially tested workflows

- individual Setup add/delete/cancel variants;
- Calendar Day Close and Add Another;
- deletion cancellation for manual events;
- no-file import cancellation;
- out-of-bounds selection clearing after regeneration;
- reopening with an open Calendar editor during replacement;
- returning-session app rendering (store persistence is tested, full UI remount sequence is not);
- no-automatic-fix continuation.

### Implementation-confirmed

- compound-step ordering;
- state ownership and remount behavior;
- persistence restoration boundaries;
- export unavailable failure without local recovery;
- absence of proposal acceptance, Live, and Learn workflows;
- unplaced-candidate dead end.

### Observational research required

Executable evidence cannot establish:

- whether workflow entry/completion is understood;
- whether compound steps are anticipated;
- whether cross-environment handoffs feel continuous;
- whether recovery paths are discoverable;
- whether configuration-shaped sequences map to recognizable planning objectives;
- whether preserved/discarded context affects task performance;
- whether utility workflows dominate perceived lifecycle activity.

### Verification run

The five directly relevant UI files were executed for this audit:

```text
5 test files passed
75 tests passed
```

State persistence and utility claims additionally cite existing state tests inspected in `code/src/state/tests/dayFrameStore.test.ts`.

## Open Questions

1. Loading/importing/clearing while Calendar Day is open does not explicitly reset every editor state; the combined workflow outcome is untested.
2. Selecting another compact date replaces an unsaved manual-event draft without a confirmation. The implementation consequence is clear, but no direct test covers it.
3. Non-all-day manual events have no explicit application-level time validation; behavior for blank or malformed time strings beyond native input constraints is not established end to end.
4. A `changeFixedTime` recommendation without a resolvable template falls through toward generic Preview revision; its user-visible completion/failure state is untested.
5. Export failure when a browser download anchor is unavailable throws outside a local UI recovery handler; the runtime boundary behavior is environment-dependent.
6. Setup draft replacement during profile load/import is executable through store subscription, but no test begins those workflows with a dirty draft.
7. Store tests confirm authored persistence and Preview absence after reconstruction; a complete application reload test does not confirm the rendered returning-session sequence.
8. Some suggested fixes can leave or ignore friction rather than remove it. Completion is action-specific and cannot be generalized to “all friction resolved.”
9. Native `<details>` owns repeated-friction expansion, so its state across Preview revision/replacement is not established.

