# UX Implementation Alignment Audit 01

## Phase 9 — Feedback, Recovery, and Epistemic Integrity Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, authority, feedback, recommendation, recovery, and lifecycle responsibilities across Teach, Plan, Live, Learn, and shared utilities  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-31

## Executive Findings

The working hypothesis is confirmed: **feedback mechanisms are more complete than recovery mechanisms**.

DayFrame communicates most important runtime conditions: Setup dirty/saved state, generation prerequisites, Preview staleness, range mismatch, generated/revised timestamps, friction severity, recommendation results, invalid backup input, destructive confirmation, and utility outcomes. The implementation is strongest when it describes generated proposal state. It explicitly calls the result a Preview or draft schedule, distinguishes generated and revised timestamps, marks authored changes as making Preview stale, and labels suggestions as fixes rather than authored facts.

Recovery is uneven. The strongest path is fixed-time correction: a recommendation identifies a concrete problem, transfers the user to the matching Setup field, focuses it, preserves the Preview, and supports Save → Regenerate completion (`code/src/ui/DayFrameApp.tsx:270-277`, `:399-431`; tests `DayFrameApp.test.tsx:1611`, `:1691`, `:1797`). Invalid backup import also has a sound retry path because the active state is retained, the validation error is rendered, and the file control remains available (`DayFrameApp.tsx:549-598`; test `:2484`).

Other conditions are identified without a complete contextual continuation. Friction without a supported fix tells the user to review Setup but does not identify or focus the responsible record. Unplaced candidates say only that placement is needed and expose no action. Proposal revision, regeneration, event deletion, profile replacement, import replacement, and clearing have no undo or prior-version restoration. Persistence failures have no visible recovery because storage exceptions are deliberately swallowed.

The most consequential feedback-integrity findings are:

1. **“Setup saved.” is exact for committed runtime authority but only an optimistic acknowledgement of durable persistence.** Each store setter mutates runtime state and calls persistence, but `localStorage.setItem` failures are ignored (`DayFrameApp.tsx:186-219`; `dayFrameStore.ts:398-429`).
2. **Generate Preview commits Setup before it validates generation prerequisites.** A missing-items guardrail accurately says what is required for Preview, but it does not disclose that the draft has already become authoritative and a prior Preview may have been marked stale (`DayFrameApp.tsx:222-268`).
3. **Profile save/load, import, and clear messages similarly overstate durable completion.** Runtime transitions complete, while persistence/removal failures are suppressed (`dayFrameStore.ts:145-230`, `:466-508`).
4. **Backup export reports success at download initiation, not confirmed file delivery.** The implementation creates a Blob, invokes an anchor click, and immediately reports export; there is no completion acknowledgement from the browser and no caught failure path around the export handler (`DayFrameApp.tsx:531-548`; test `:2297`).
5. **Stale Preview feedback is epistemically accurate but enforcement is partial.** The warning says Setup changed and directs regeneration. The stale proposal remains reviewable and can still be revised because the revision store preserves `isStale` and has no currentness guard (`PreviewScreen.tsx:93-104`; `dayFrameStore.ts:266-300`).
6. **Suggested fixes preserve proposal authority.** Applying a supported fix revises only Preview, records `revisedAt`, and renders action feedback; it does not silently rewrite authored Setup. The fixed-time exception explicitly returns to Setup instead of pretending the recommendation authored the correction.
7. **No communication falsely establishes acceptance, Live execution, historical outcome, or Learn.** Those states and transitions are not implemented. Preview feedback remains proposal-shaped.

## Feedback and Recovery Inventory

Evidence labels: **Confirmed** means executable implementation directly establishes the behavior; **Inferred** means the result follows from multiple executable paths without direct end-to-end coverage; **Not Found** means broad inspection found no executable mechanism.

| Condition or action | Visible communication | Executable truth | Recovery and retained context | Classification / evidence |
|---|---|---|---|---|
| Setup draft matches authority | “All changes saved” | Draft serialization equals current store authority | No recovery required | **Confirmed — Exact State Feedback**; `DayFrameApp.tsx:126`, Setup status rendering; test `DayFrameApp.test.tsx:396` |
| Setup draft differs | “Unsaved changes” | Parent-owned draft differs from store authority | Continue editing or Save; no whole-draft revert | **Confirmed — Exact State Feedback; Manual Recovery only**; test `:136` |
| Save Setup | “Setup saved.” | Runtime authored state is committed; Preview is marked stale if present | Continue editing; no undo; durable write unconfirmed | **Confirmed — Optimistic Acknowledgement**; `DayFrameApp.tsx:186-219`; `dayFrameStore.ts:50-143`, `:425-429` |
| Generate with complete Setup | Preview plus generated timestamp | Draft is saved, generator completes, current Preview replaces prior Preview | Regenerate after later edits; no prior-version restore | **Confirmed — Exact Action Feedback; No Undo**; `DayFrameApp.tsx:222-268`; test `:522` |
| Generate with incomplete Setup | Missing Setup items in Preview context | Draft was already saved; generation did not run; existing Preview, if any, is retained and may be stale | Open Setup, correct prerequisites, Generate again; affected records are not focused | **Confirmed — Blocking Guardrail; Partial Contextual Recovery**; tests `:1184`, `:1200`, `:2190` |
| Preview stale | “Setup changed. Generate a new preview to see updates.” | Preview result predates current authored authority | Direct Regenerate button; old Preview retained until success | **Confirmed — Exact Feedback; Direct Recovery**; `PreviewScreen.tsx:93-95`; tests `:1451`, `:1477` |
| Preview range mismatch | “Preview range warnings” with specific messages | Saved range and configured cycle/recurrence conditions differ | Edit Setup and regenerate; warning is nonblocking and not object-focused | **Confirmed — Nonblocking Warning; Manual Recovery**; `PreviewScreen.tsx:105-114`; tests `:1524` |
| Preview generated/revised metadata | Generated time; Revised time or “Not revised yet” | Metadata is held in current Preview authority | Informational; regeneration replaces revision metadata | **Confirmed — Exact State Feedback**; `PreviewScreen.tsx:117-149`; state `dayFrameStore.ts:250-260`, `:279-297` |
| Supported proposal fix | Fix label, then action feedback and revised timestamp/result | Current Preview is revised; authored Setup is unchanged | Regenerate to reconstruct from authored state; no undo to prior Preview | **Confirmed — Epistemically Aligned Recommendation; Direct Recovery; No Undo**; tests `DayFrameApp.test.tsx:1346`, `PreviewScreen.test.tsx:159`, `:238` |
| Fixed-time recommendation | “Review fixed time” action | No automatic authoring occurs; app opens and focuses matching Setup input | Edit, Save, return, Regenerate; Preview and problem identity survive handoff | **Confirmed — Focused Contextual Recovery**; tests `DayFrameApp.test.tsx:1611`, `:1691`, `:1797` |
| Friction without supported fix | “No automatic fix is available. Review the related setup and regenerate the preview.” | Problem remains in Preview | User must navigate and rediscover responsible Setup data | **Confirmed — Partial Feedback; Manual Recovery**; `PreviewScreen.tsx:187-191`, `:365-369` |
| Unplaced candidate | “needs placement” plus candidate details | Candidate was generated but not scheduled | No action, destination, retry, or focused correction | **Confirmed — Partial Feedback; Recovery Dead End**; `PreviewScreen.tsx:313-332` |
| No friction / no blocks / no work | Explicit empty-state labels | Visible day group contains none of that represented type | Informational | **Confirmed — Exact State Feedback**; `PreviewScreen.tsx:237-342` |
| Manual-event Save/Edit | Updated Calendar Day and regenerated Preview | Authored event is committed; existing Preview is automatically replaced | Edit again or delete; Close before Save abandons draft; no undo | **Confirmed — Exact represented outcome; Automatic Recovery of Preview currentness; No Undo**; `DayFrameApp.tsx:338-397`; test `:899` |
| Manual-event Delete | Inline confirmation, then event disappears and Preview regenerates | Event is removed from authored state | Cancel before commit; recreate manually after commit | **Confirmed — Confirmation; Cancellation Before Commit; No Undo**; `DayFrameApp.tsx:379-389`; test `:899` |
| Save profile with blank name | Profile error message | Store rejects before mutation | Edit retained name field and retry | **Confirmed — Actionable Error; Direct Retry**; `dayFrameStore.ts:145-150`; `DayFrameApp.tsx:462-477` |
| Save profile | “Current setup saved as a local profile.” | Runtime profile snapshot exists; durable profile write may have failed silently | Retry may overwrite same-name profile; failure is unknowable | **Confirmed — Optimistic Acknowledgement; Recovery Not Found for persistence failure**; `DayFrameApp.tsx:465-477`; `dayFrameStore.ts:145-171`, `:466-480` |
| Load profile | `Loaded profile "name".` | Active authored state is replaced, Preview cleared, Setup shown | Prior active state recoverable only through a separately saved profile/backup; no confirmation | **Confirmed — Exact runtime feedback; No Undo**; `DayFrameApp.tsx:495-509`; `dayFrameStore.ts:174-192`; tests `:409`, `:814` |
| Delete profile | Profile-deletion success message | Runtime profile is removed; storage removal/write may fail silently | No confirmation or undo; active Setup unaffected | **Confirmed — Optimistic Acknowledgement; No Undo**; `DayFrameApp.tsx:514-525`; `dayFrameStore.ts:194-203` |
| Export backup | Export success message | Authored JSON and download click were created; actual file delivery is not confirmed | User can retry; thrown DOM/download errors are not rendered | **Confirmed — Optimistic Acknowledgement; Failure Recovery Not Found**; `DayFrameApp.tsx:531-548`; test `:2297` |
| Valid backup import | Import success message | Validated authored state replaces active Setup; Preview cleared | No undo; separately saved profile/backup required to restore prior state | **Confirmed — Exact runtime feedback; No Undo**; `DayFrameApp.tsx:549-598`; `dayFrameStore.ts:217-230`; test `:2417` |
| Invalid backup import | Specific parse/validation error | Active authored state and Preview are not replaced | Select a corrected file and retry; control remains available | **Confirmed — Exact Error; Direct Retry with state preservation**; `dayFrameBackup.ts:29-143`; test `DayFrameApp.test.tsx:2484` |
| Clear local data request | Consequence text plus Confirm/Cancel | No deletion occurs before confirmation | Cancel retains state | **Confirmed — Consequence Disclosure; Cancellation Before Commit**; tests `DayFrameApp.test.tsx:2260`, `:2280` |
| Clear local data confirmed | Clear success message | Runtime resets and removal is attempted; removal failures are ignored | No undo; imported backup could reconstruct authored state | **Confirmed — Optimistic Acknowledgement; Destructive No Undo**; `dayFrameStore.ts:205-210`, `:483-508` |
| Storage unavailable/corrupt on return | No error; defaults/empty profiles appear | Missing storage returns defaults; invalid/corrupt stored profile data returns empty list | Import backup or recreate manually; cause is not communicated | **Confirmed — Silent Failure; Manual Recovery**; `dayFrameStore.ts:398-450` |
| Proposal acceptance / Live / Learn | None | No corresponding state or transition exists | None | **Not Found — Not Implemented** |

## Accuracy and Epistemic Integrity Matrix

| Visible or implied claim | Actual authority represented | Assessment |
|---|---|---|
| “Unsaved changes” | Difference between Setup draft and current authored store state | **Epistemically Aligned.** It does not claim persistence or Preview currentness. |
| “All changes saved” / “Setup saved.” | Runtime authored store state; attempted local persistence | **Epistemically Partial.** Exact for runtime commit, overstated if read as durable persistence. |
| “Preview” / “draft schedule” | Generated proposal in `state.preview` | **Epistemically Aligned.** The UI does not call it an accepted plan or history. |
| “Generated” | Timestamp supplied when current Preview was produced | **Epistemically Aligned.** It does not imply acceptance or persistence. |
| “Revised” | Timestamp supplied only when revision reports `didRevise`; otherwise “Not revised yet” | **Epistemically Aligned.** Review-only guidance does not falsely mark revision (`dayFrameStore.test.ts:883`). |
| “Setup changed” | Authored setter marked existing Preview stale | **Epistemically Aligned.** The old result remains visibly available but is identified as stale. |
| Suggested fix | System-generated recommendation attached to friction | **Epistemically Aligned.** Proposal fixes revise Preview; fixed-time correction requires authored action in Setup. |
| “Loaded” / “Imported” | Runtime authored authority replaced; persistence attempted | **Epistemically Partial.** Replacement is real in memory; durable restoration is not verified. |
| “Exported” | Browser download was initiated | **Optimistic Acknowledgement.** Delivery and file retention are not confirmed. |
| Friction counts | Friction in the currently visible Preview range, excluding ignored friction | **Epistemically Aligned** for the visible representation; selected filtering changes the scope (`PreviewScreen.test.tsx:327`, `:456`). |
| “No friction detected” | No visible, nonignored friction for that rendered day group | **Epistemically Aligned within visible scope.** It is not a claim that the authored schedule or life outcome has no conflict. |

The implementation preserves these distinctions:

- authored Setup is separate from the Setup draft;
- generated Preview is separate from authored Setup;
- a recommendation is separate from an authored correction;
- revised Preview is separate from generated-at metadata;
- stale Preview is separate from current Preview;
- persisted authored data excludes Preview;
- current Preview does not become accepted, active, historical, or learned state.

The implementation weakens those distinctions in three places:

- generic saved/success language does not distinguish runtime commit from durable storage completion;
- generation guardrail feedback does not disclose its preceding authored commit;
- a stale Preview can still accept proposal revisions, producing a legal but potentially confusing stale-and-revised combination.

## Recovery Architecture

### Strong recovery paths

1. **Fixed-time focused correction** preserves friction identity, template identity, authored draft, and existing Preview while moving focus to the exact editable field. It is the only cross-screen recovery that eliminates rediscovery.
2. **Stale Preview regeneration** preserves the old proposal until replacement and provides a direct action from Preview. Successful regeneration clears stale state.
3. **Invalid-import retry** preserves active authored/generated state, renders the validation cause, and leaves import available.
4. **Pre-commit cancellation** exists for clear-local-data, manual-event deletion, and Setup-record deletion. It prevents the destructive transition but is not rollback after commit.
5. **Manual-event Preview regeneration** automatically restores proposal currentness after an event save or delete when a Preview exists.

### Partial recovery paths

- generation guardrails list missing categories but do not focus the missing objects;
- range warnings direct Setup/regeneration but do not provide object-specific actions;
- unsupported friction points provide general instructions only;
- storage corruption/unavailability falls back to defaults without communicating the failure;
- loading/importing/clearing reconstructs Setup but does not consistently clear Calendar Day editor, focus, confirmation, or all message context;
- unsaved Setup has no explicit Revert/Discard action, although manual editing back to the authoritative values is possible.

### Recovery dead ends and irreversible transitions

- unplaced candidates expose no placement action;
- a revised or regenerated Preview has no version history or rollback;
- deleted manual events and profiles have no undo;
- profile/import replacement and clear have no restoration of the prior active aggregate;
- successful generated proposals have no acceptance continuation;
- no Live or Learn recovery can exist because those lifecycle states are absent.

## Context Preservation Matrix

| Recovery / transition | Preserved | Lost or vulnerable |
|---|---|---|
| Missing-items guardrail → Setup → Generate | Saved authored draft; missing categories; existing Preview | Exact field/object focus; disclosure that attempted Generate already saved |
| Stale Preview → Regenerate | Authored Setup; selection if still in bounds | Prior Preview after successful replacement; prior revisions/action feedback |
| Fixed-time recommendation → Setup | Preview; friction/template identity; Setup draft; exact focus target | Shell utility messages and other transient confirmations are reset |
| Invalid import → retry | Active Setup, Preview, profiles, import error | Selected invalid file value is browser-controlled; no structured error location |
| Manual-event Cancel/Close before Save | Authoritative event and Preview | Unsaved event-draft edits |
| Delete event → regenerated Preview | Active date/selection; remaining authored data | Deleted event and prior Preview; no undo |
| Load profile / valid import | Saved profiles; replacement authored data | Prior active Setup unless separately saved; Preview; selected range; some app-local editor context may survive inconsistently |
| Clear local data | Fresh runtime state | Authored state, Preview, profiles, selection; recovery depends on an external backup |
| Reload | Persisted authored Setup and profiles, if readable | Preview, messages, selection, editor/focus/disclosure state |

## Feedback Lifetime and Coordination

Shell feedback is distributed across independent React state variables for Setup save, generation guardrail, profiles, backup, clear confirmation/result, selection, focus, and manual-event editing (`DayFrameApp.tsx:67-103`). `resetShellMessages` clears the message families during generic Setup/Preview navigation, and most utility handlers clear competing message families (`DayFrameApp.tsx:153-178`, `:257-267`, `:495-509`). This prevents many contradictory simultaneous messages.

Coordination is incomplete:

- Preview action feedback lives inside Preview state and survives screen navigation until revision/regeneration/replacement.
- Setup dirty status is derived and therefore current, while “Setup saved.” is transient local state and is cleared by later edits in tested behavior (`DayFrameApp.test.tsx:396`).
- profile/import/clear replacement explicitly clears several shell states but not every Calendar Day draft, deletion confirmation, focused context, or SetupScreen-local confirmation.
- storage failures never create feedback state, so success messages can outlive an unreported persistence failure.

These are architectural lifetime findings only; whether users notice or misunderstand them requires observational research.

## Recovery Coverage Summary

| Recovery class | Implemented coverage | Architectural result |
|---|---|---|
| Automatic correction | Preview regeneration after manual-event mutation; normalization during persisted-data load | Narrow but meaningful |
| Direct retry | Generate/Regenerate after prerequisites; import after invalid file | Present |
| Focused contextual recovery | Fixed-time correction | Strongest implemented path; isolated case |
| Cancellation before commit | Clear data, manual-event deletion, Setup-record deletion | Present for selected destructive actions |
| Rollback / undo after commit | None found | Major gap |
| Version restoration | None for Preview or active Setup | Major gap |
| Manual recovery | Unsupported friction, range mismatch, persistence fallback, deleted/replaced data | Common |
| Recovery dead end | Unplaced placement objective; acceptance/Live/Learn continuation | Confirmed |

## Test Coverage Assessment

Automated tests directly cover the principal visible feedback paths: dirty/save feedback, generation guardrails, Preview generation and staleness, regeneration, range warnings, recommendation application, fixed-time focusing and completion, manual-event CRUD, profile operations, destructive confirmation, export, valid import, and invalid-import error (`DayFrameApp.test.tsx:396`, `:409`, `:522`, `:899`, `:1184`, `:1200`, `:1346`, `:1451`, `:1477`, `:1524`, `:1611`, `:1691`, `:1797`, `:2190`, `:2260-2484`). Preview tests cover action guidance, visible revised results, hidden ignored friction, range-scoped counts, and repeated-friction grouping (`PreviewScreen.test.tsx:159`, `:238`, `:327`, `:456`, `:474`).

The principal untested or incompletely tested feedback/recovery risks are:

- storage write/removal failure while success feedback is rendered;
- export DOM/download failure;
- attempted generation that both saves authored changes and fails guardrails;
- revision of an already stale Preview;
- recovery and message lifetime after profile/import/clear while Calendar Day or deletion state is open;
- absence of undo/version restoration, which is implementation-confirmed rather than behavior-tested.

## Final Architectural Determination

**Confirmed — Feedback is stronger than recovery.** DayFrame usually tells the user what runtime condition exists and preserves the central epistemic distinction between authored truth, generated proposal, recommendation, currentness, and staleness. Its most precise recovery paths—fixed-time field focus, stale regeneration, invalid-import retry, and pre-commit cancellation—are executable and context-preserving.

**Confirmed — Recovery is incomplete after commitment and replacement.** There is no general undo, rollback, version history, or prior-active-state restoration. Several messages identify conditions but leave rediscovery and reconstruction to the user, and unplaced candidates have no executable recovery at all.

**Confirmed — Persistence feedback is architecturally optimistic.** Runtime operations complete, but storage errors are suppressed and download completion is not verifiable. Success language therefore cannot establish durable persistence.

**Confirmed — Lifecycle communication remains epistemically bounded.** The implementation never claims that Preview is accepted, active, executed, historical, or learned. This is accurate because the executable lifecycle ends at generated, revised, stale, or regenerated proposal state.

Phase 9 therefore answers the core question as follows:

> DayFrame communicates authored/runtime and generated-proposal state with generally strong precision, especially around dirty state, staleness, friction, recommendation, and revision. It provides complete recovery for a small number of well-defined failures, but most destructive or replacement transitions are irreversible, several detected problems require manual rediscovery, and durable persistence cannot be inferred from its success messages.
