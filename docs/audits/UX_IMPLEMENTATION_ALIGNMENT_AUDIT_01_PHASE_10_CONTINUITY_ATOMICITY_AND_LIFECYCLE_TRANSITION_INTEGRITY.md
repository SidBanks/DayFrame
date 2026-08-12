# UX Implementation Alignment Audit 01

## Phase 10 — Continuity, Atomicity, and Lifecycle Transition Integrity

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, especially authority boundaries, lifecycle responsibilities, transition semantics, replacement, invalidation, continuity, and Teach → Plan → Live → Learn relationships  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-31

## Executive Findings

The working hypothesis is confirmed: **DayFrame has strong local state boundaries but weak aggregate transition governance**.

The principal transition authorities are:

1. `SetupScreen` mutates the parent-owned Setup draft and owns local deletion confirmations/disclosures.
2. `DayFrameApp` coordinates screen, draft, selection, editor, focus, confirmation, feedback, and multi-stage actions.
3. `dayFrameStore` owns authored Setup, manual events, saved profiles, and the single current Preview.
4. generators and revision/friction engines derive or transform proposal state.
5. persistence helpers and the browser execute unverified external side effects.

The strongest transitions are local draft editing, authored invalidation of Preview, stale Preview regeneration, proposal-local suggested fixes, invalid-import rejection, and fixed-time correction. Fixed-time correction is the continuity baseline: friction and template identity survive a Plan → Setup → Plan round trip, the matching authored field receives focus, Preview remains explicitly stale after Save, and regeneration creates a current proposal (`DayFrameApp.tsx:270-277`, `:399-431`; tests `DayFrameApp.test.tsx:1611`, `:1691`, `:1797`).

The weakest compound transitions are Generate, persistence-backed mutations, manual-event mutation with automatic regeneration, and primary-authority replacement. Generate commits every Setup field before prerequisite validation. A blocked Generate therefore leaves authored authority changed, persistence attempted, any existing Preview stale, navigation changed to Preview, and guardrail feedback visible; it has no rollback (`DayFrameApp.tsx:186-268`). Runtime mutations precede storage, and storage errors are swallowed, so authored/profile/clear/import actions are externally non-atomic (`dayFrameStore.ts:398-508`).

Replacement is the dominant continuity pattern. Generation and regeneration replace the one Preview. Profile load and import replace active authored Setup and clear Preview. Clear replaces the complete runtime aggregate. None preserves an addressable prior version. Profiles and backups are user-created snapshots, not an automatic version chain, rollback log, or lifecycle history.

Shell context is distributed and only partially reconciled. Profile load/import/clear clear Preview selection and several messages, but do not explicitly clear `activeManualEventDate`, `manualEventDraft`, manual-event deletion confirmation, or every SetupScreen-local confirmation. A Calendar Day editor can therefore survive after its source Preview and authored aggregate have been replaced and can render against the new manual-event collection. Setup local confirmations are remount-dependent.

Identity is strong for authored records and local targeting where stable IDs are used, but some Setup deletion confirmation targets are collection indices. Manual events preserve IDs across edits; profiles use normalized name-derived IDs; generated candidates, blocks, friction points, and recommendations belong to one Preview derivation and have no continuity across regeneration. A stale Preview retains its generated recommendation identities and still permits their execution.

Currentness propagation is explicit but not provenance-rich. Authored store setters mark Preview stale; profile/import/clear remove it; generation/regeneration create a current replacement; proposal revision preserves the prior stale flag. Preview records range and timestamps but not an authored-state version/hash. Causal trace is limited to mutable current metadata and action feedback.

Teach → Plan is implemented as committed authored Setup → generated proposal. It is coherent on successful generation, partially committing when blocked, and crossed in reverse by focused corrections or generic navigation. Manual events are authored Teach authority edited from Plan context and automatically projected into a replacement Preview. No proposal acceptance state exists. Plan → Live and Live → Learn are absent, and no Preview timestamp, friction grouping, summary, or revision is treated as execution or learned evidence.

The final determination is **Locally Coherent but Aggregately Partial**.

## Authoritative Transition Inventory

| Transition | Trigger and owner | Ordered authority effects | Failure / continuity / coverage |
|---|---|---|---|
| Setup draft edit | Input callback; SetupScreen → DayFrameApp draft | Replace draft field/record; derive dirty state; store and Preview unchanged | Runtime-only; navigation preserves draft; directly tested `DayFrameApp.test.tsx:136`, `:396`, `:785` |
| Setup record add/edit/delete | SetupScreen | Mutate draft collection; deletion uses local confirmation; later Save commits aggregate | Index-targeted confirmation for shifts/cycles/templates; no aggregate rollback; partly tested `:198`, `:289` |
| Save Setup | DayFrameApp | Resolve range → six sequential store setters → each updates runtime/marks Preview stale/attempts persistence → clear focus/guardrail → feedback | **Sequential but Coherent** in runtime; externally non-atomic; tests `:158-396`, `:1451` |
| Generate Preview | DayFrameApp/store/generator | Save Setup → navigate Preview/cleanup → validate saved state → generate and replace Preview or show guardrail | **Partial Commit** when blocked; success tested `:522`; guardrails `:1184`, `:1200`, `:2190` |
| Regenerate Preview | DayFrameApp/store/generator | Validate current store → generate → replace Preview → reconcile out-of-bounds selection | No authored commit; old Preview retained if guardrail blocks; success tested `:1477`, `:1691` |
| Mark Preview stale | Each authored store setter | Replace Preview wrapper with cloned result and `isStale=true` → persistence attempt | **Currentness Invalidated**; result/metadata retained; state test `dayFrameStore.test.ts:554` |
| Apply proposal fix | Preview action → DayFrameApp/store/revision engine | Resolve current recommendation → transform cloned Preview → recompute result/feedback → replace current Preview wrapper | Preserves authored Setup and stale flag; no rollback/version; tests `:1346`, store `:736` |
| Fixed-time handoff | Recommendation action; DayFrameApp | Resolve recommendation/template ID → Setup screen → focus target → edit/Save makes Preview stale → Regenerate | **Sequential but Coherent; Identity Preserved**; tests `:1611`, `:1691`, `:1797` |
| Select date/range | Compact calendar; DayFrameApp | Update range/pending start → open Calendar Day draft for selected date → Preview representation filters | Presentation/context only; does not mutate domain authority; tests `:548-631` |
| Save/edit manual event | Calendar Day; DayFrameApp/store | Build stable-ID event → replace manual-event collection/persist/mark Preview stale → normalize editor → regenerate if Preview exists | Authored commit survives generation failure; test `:899` covers success |
| Delete manual event | Confirm action; DayFrameApp/store | Remove by stable ID/persist/stale → clear confirmation/edit ID → reopen date draft → regenerate | Cancellation before commit; no post-commit rollback; test `:899` |
| Save/delete profile | Utility handler/store | Mutate runtime profile list → attempt separate-key persistence → feedback | **Externally Non-Atomic**; directly tested `:409`, store `:690` |
| Load profile | Utility handler/store | Find ID → replace authored aggregate → clear Preview → persist → notify → Setup/selection/message cleanup | **Replacement without Rollback; Partial Reconciliation**; tests `:409`, `:814` |
| Export backup | Utility handler/store/browser | Snapshot authored Setup → serialize Blob → create URL/anchor → click → feedback | Runtime state unchanged; browser delivery unconfirmed; tested `:2297` |
| Import backup | File/browser/DayFrameApp/store | Read → parse/validate before mutation → replace authored aggregate → clear Preview → persist/notify → cleanup/feedback | Invalid input preserves state; valid replacement has no rollback; tests `:2417`, `:2484` |
| Clear local data | Confirm action; DayFrameApp/store | Replace runtime with initial state → remove authored key → remove profile key → notify → Setup/context cleanup/feedback | Two removals not transactional; no rollback; tests `:2260`, `:2280`, store `:992` |
| Initialization/rehydration | Store creation | Read authored key → JSON parse/fallback → normalize/default → independently read/validate profiles → merge → Preview null → app draft build | **Sequential but Coherent** fallback; malformed data silently discarded; store tests `:24-112`, `:690` |
| Plan acceptance / Live / Learn | None | No executable state transition | **Not Found — Lifecycle Boundary Absent** |

## Transition Authority Matrix

| Authority | Transition responsibility | Boundary condition |
|---|---|---|
| SetupScreen | Draft field/list mutations, disclosures, index-based deletion confirmations, focus refs | Cannot commit authored authority; local state can survive store replacement while mounted |
| DayFrameApp | Aggregate sequencing, screen, draft, selection, editor, focus, confirmations, feedback | Manual coordinator; no transaction object spanning store, shell, persistence, browser |
| dayFrameStore | Synchronous domain mutation, cloning, notification, current Preview replacement | Mutates memory before persistence; setters are separate commits |
| Generator | Derives complete Preview result from cloned saved authority | No source-version token in output |
| Revision/friction engines | Transform current proposal and recompute friction/action feedback | Operate on selected generated IDs; no stale guard |
| Profile/backup utilities | Clone/validate authored snapshots | Snapshots omit Preview and shell context |
| Persistence helpers | Serialize/write/remove two localStorage keys | Exceptions swallowed; no transaction or confirmation |
| Browser | File read and download initiation | External completion outside aggregate authority |
| React render/remount | Rebuild draft, mount/unmount local confirmations/disclosures | Some cleanup is incidental to remount rather than transition-owned |

**Confirmed:** no single component owns aggregate commit, persistence success, dependent shell reconciliation, and visible completion as one transition.

## Compound Operation and Atomicity Matrix

| Operation | Stage order | Commit/failure boundary | Classification |
|---|---|---|---|
| Save Setup | derive range → six store setters → six notifications/persistence attempts → shell cleanup/message | First setter commits before later setters; storage can fail after any runtime mutation; no rollback | **Sequential but Coherent; Externally Non-Atomic** |
| Generate | Save Setup → navigation/cleanup → prerequisite validation → generator → Preview replacement | Authored commit precedes validation; block leaves commit/stale Preview | **Confirmed — Partial Commit** |
| Regenerate | validate → derive → replace Preview → selection bounds cleanup | Validation precedes mutation; generator throw leaves old Preview; persistence not involved | **Effective Runtime Atomicity** for normal store assignment; replacement without rollback after success |
| Suggested fix | resolve IDs → revision derivation → replace Preview | Derivation precedes assignment; throw leaves old Preview; stale allowed | **Effective Runtime Atomicity; Replacement without Rollback** |
| Fixed-time correction | resolve ID → navigate/focus → user edit → Save → return → Regenerate | Multiple user commits; interruptions retain current stage | **Sequential but Coherent**, not atomic |
| Manual-event Save/Delete | event collection commit/persist → editor cleanup → optional generation/replacement | Authored mutation remains if regeneration throws/blocks | **Confirmed by implementation — Partial Commit risk** |
| Profile Save/Delete | runtime list commit → storage attempt → feedback | Storage failure leaves runtime changed | **Externally Non-Atomic** |
| Profile Load | validate ID → runtime aggregate replacement → storage attempt → notify → shell cleanup | Storage failure leaves runtime replacement; cleanup follows store commit | **Replacement without Rollback; Externally Non-Atomic** |
| Import | async file read/parse/validate → runtime replacement → storage → notify → shell cleanup | Prevalidation is atomic for invalid input; persistence/cleanup are not aggregate-atomic | **Effective Runtime Atomicity before external persistence; Replacement without Rollback** |
| Clear | runtime replacement → remove authored key → remove profile key → notify → cleanup | Either removal can fail independently after runtime reset | **Externally Non-Atomic; Replacement without Rollback** |
| Export | snapshot → serialize → browser primitives/click → success message | Browser action can fail or not deliver after preparation; no completion signal | **Externally Non-Atomic** |
| Rehydration | independent key reads → parse/validate/fallback → merge/build draft | One key may restore while the other falls back | **Sequential but Coherent; implementation-dependent hybrid restoration** |

## Partial Commit Matrix

| Path | Retained mutation after later failure/block | Dependent result / rollback |
|---|---|---|
| Blocked Generate | All Setup draft values committed; persistence attempted; prior Preview marked stale by setters; current screen Preview | Guardrail rendered; no rollback; retry from committed Setup |
| Save/persist failure | Runtime authored changes and stale Preview | Storage retains older/absent state; no feedback or rollback |
| Profile/import persist failure | New runtime profile or active authored replacement | Reload may restore old storage; no feedback or rollback |
| Clear removal failure | Runtime initial state; zero, one, or both old keys may remain | Reload may resurrect authored data/profiles or a hybrid; no feedback |
| Manual-event regeneration failure | Event add/edit/delete and persistence already committed; Preview stale | Editor cleanup may have occurred; no catch/rollback/visible recovery |
| Export failure/non-delivery | No domain mutation; URL/anchor steps may have occurred | Success is based on click initiation; no confirmed delivery or rollback need |
| Revision-engine failure | No Preview assignment because derivation precedes store replacement | Old Preview retained; thrown error is not converted to UI feedback |

## Replacement Semantics Assessment

| Replacement | New authority / identity | Cleared and retained dependencies | Recoverability / disclosure |
|---|---|---|---|
| Generation/regeneration | New Preview object/result and newly generated IDs | Stale false; `revisedAt`/action feedback absent; selection retained only if in bounds | Prior proposal unrecoverable; visible generated metadata, no version disclosure |
| Proposal revision | New Preview wrapper/result derived from current generation | `generatedAt`, range, stale flag retained; result IDs may transform; action feedback replaced | Prior arrangement unrecoverable; revised timestamp disclosed |
| Profile load | Profile snapshot becomes active authored authority | Preview null; range selection cleared; profiles retained; Calendar Day/editor not explicitly cleared | Prior active aggregate only via separate snapshot; load disclosed |
| Backup import | Validated backup becomes active authored authority | Preview null; selection cleared; profiles retained; some shell/editor context survives | Prior active aggregate not retained; import disclosed |
| Clear | Fresh initial state replaces domain aggregate | Preview/profiles/selection cleared; Calendar Day/editor not explicitly cleared | External backup only; destructive confirmation/disclosure exists |
| Rehydration | Normalized persisted/default aggregate | Preview and all prior runtime-only proposal/shell state absent | Current storage is restoration source, not version history |

All major replacements are **Confirmed — No Version Continuity**.

## Invalidation Propagation Matrix

| Source mutation | Preview/currentness effect | Other dependent state |
|---|---|---|
| Any authored Setup setter | Existing Preview cloned with `isStale=true` | Selection/editor/focus generally retained until handler cleanup |
| Manual-event setter | Existing Preview first marked stale, then app automatically regenerates if present | Event editor normalized; selected date retained |
| Profile load/import | Preview cleared, not stale | Preview selection cleared; Calendar Day/editor may survive |
| Clear | Preview absent | Selected range cleared; distributed local context partially retained |
| Successful generation/regeneration | Preview replaced, `isStale=false` | Out-of-bounds selected range cleared after generation |
| Proposal revision | Existing `isStale` preserved | Recommendation/action feedback becomes part of replacement Preview |
| Draft-only edit | No currentness change until Save | Dirty state communicates divergence |
| Reload | Preview absent by construction | Draft reconstructed; all runtime context reset |

## Reconciliation, Cleanup, and Orphaned Context

| Transition | Cleanup | Surviving context and consequence | Classification |
|---|---|---|---|
| Generic Setup/Preview navigation | Clears focus and shell messages; preserves Setup draft and selected range | Calendar Day editor is not closed | **Targeted Reconciliation** |
| Successful generation | Clears missing-items state; selection only if out of bounds | In-bounds selection can legitimately reattach to replacement Preview | **Partial Reconciliation** |
| Profile load | Setup screen, range selection, major message families reset | `activeManualEventDate`, `manualEventDraft`, editing/deletion IDs not explicitly reset | **Confirmed — Orphaned Context risk** |
| Backup import | Helper clears Preview selection and major utility state | Calendar Day/editor and SetupScreen local confirmation not explicitly reset | **Confirmed — Partial Reconciliation** |
| Clear | Setup, selection, messages reconciled | Calendar Day/editor state can survive against empty/new authority | **Confirmed — Orphaned Context risk** |
| Preview regeneration | Out-of-bounds range selection cleared | Active Calendar Day date/editor is not included in bounds reconciliation | **Confirmed — Partial Reconciliation** |
| Proposal revision | Preview/action feedback replaced together | Stale recommendation can execute; shell selection remains | **Aggregate coherent but epistemically partial** |
| Setup replacement while Setup mounted | Parent draft rebuild effect runs from new store authority | Child deletion confirmations/disclosures survive unless DOM structure removes/remounts them | **Remount-dependent cleanup** |

An orphaned Calendar Day editor can still render because its condition is app-local `activeManualEventDate && manualEventDraft`; detail derivation may be null when Preview is cleared, while form actions can write the surviving draft into the newly active manual-event collection (`DayFrameApp.tsx:91-125`, `:338-377`, `:788-1036`). This is the most consequential confirmed aggregate-context risk.

## Identity Continuity Matrix

| Object | Targeting / continuity | Determination |
|---|---|---|
| Shift/template/cycle records | Render keys and authored links use IDs; some delete confirmations store list indices | **Identity mostly preserved; index-targeted confirmation partial** (`SetupScreen.tsx:118-126`, `:464-529`, `:744-793`, `:1526-1601`) |
| Cycle segments | Stable render ID, but confirmation stores cycle and segment indices | **Epistemically Partial identity targeting** |
| Template/recurrence pair | Matching `template.id` / `blockTemplateId`; deletion removes paired entry | **Identity Preserved** within draft/save |
| Manual event | Stable ID retained on edit; generated timestamp ID for new event; delete by ID | **Identity Preserved** across authored edits; no deletion history |
| Profile | Stable normalized name-derived ID; same-name Save replaces snapshot | **Identity Preserved** for named slot; snapshot content replaced |
| Selected day/range | Date values, not generated object references | **Identity Preserved** when replacement range includes dates; otherwise range cleanup only |
| Focus target | Template ID + field | **Identity Preserved** until record replacement/deletion; missing target silently yields no focus |
| Generated candidates/blocks | Generator/revision-owned IDs within one Preview | **Identity Replaced** by regeneration; no cross-version map |
| Friction/recommendation | IDs resolved against current Preview result | **Identity Preserved** within retained stale/current Preview; replaced on regeneration |
| Confirmation targets | Manual event by stable ID; Setup records partly by index; clear is global | Mixed integrity |

## Draft-to-Authority Continuity Assessment

The Setup draft is constructed from the store on app initialization and rebuilt whenever authored Setup dependencies change (`DayFrameApp.tsx:67-72`, `:142-151`). Draft equality is derived, so dirty/current feedback follows present values rather than an event flag (`:126`). Navigation preserves the parent draft.

Save is aggregate in user intent but sequential in implementation: preferences, range, shifts, cycles, templates, and recurrences are separate store commits (`:186-219`). Each commit can notify and persist an intermediate aggregate. There is no draft transaction, validation gate, rollback, or version snapshot.

Profile/import/clear replacement publishes new authored dependencies, causing the parent draft effect to overwrite any unsaved Setup draft. This is coherent replacement but has no dirty-draft confirmation. SetupScreen-local confirmations may survive because the screen need not remount. After clear, `buildSetupDraft` can synthesize a default draft cycle even when authoritative cycles are empty, creating an immediately reconstructed draft/authority difference (`SetupScreen.tsx:2308-2324`; Phase 8 finding).

**Determination: Confirmed — clear draft/authority distinction, sequential commit, replacement without rollback, and partial aggregate reconciliation.**

## Preview Continuity Assessment

```text
absent
  └─Generate valid──────────────> generated/current
       ├─authored mutation──────> stale
       │    ├─proposal fix──────> stale/revised
       │    └─Regenerate valid──> new generated/current
       ├─proposal fix───────────> current/revised
       └─Generate/Regenerate────> new generated/current

any Preview ──profile/import/clear/reload──> absent
```

Legal combinations are current/unrevised, current/revised, stale/unrevised, and stale/revised. Revision preserves `generatedAt` and `isStale`; regeneration creates a replacement with a new `generatedAt`, clears stale state, and drops earlier revision/action metadata (`dayFrameStore.ts:232-300`). Timestamps establish current-object sequence but are not addressable versions. Preview holds range and result but no source-authored version/hash, recommendation lineage, or prior proposal pointer. Preview never survives reload.

**Determination: Confirmed — explicit currentness, coherent proposal-local revision, replacement-based regeneration, and No Version Continuity.**

## Manual-Event Transition Integrity Assessment

Manual events are authored authority edited from Plan context. Calendar Day copies an event into a local draft, preserving authored isolation until Save. Save uses the existing ID or creates a timestamp ID, commits the entire manual-event collection, normalizes the editor to the saved object, and automatically regenerates Preview if present (`DayFrameApp.tsx:308-397`). Delete targets a stable ID and offers cancellation before commit.

Success yields coherent authored/Preview correspondence. If Preview is absent, the authored event remains valid without generation. If generation fails or throws after mutation, the event commit remains and the old Preview is stale: a **Partial Commit** with no catch/rollback. Profile/import/clear while editing can leave the copied draft and active date attached to replacement authority. Range reconciliation clears selected range but not active editor date.

**Determination: Confirmed — strong local identity and success-path continuity; aggregately partial failure and replacement cleanup.**

## Recommendation Transition Integrity Assessment

Friction and suggested fixes are generated inside a specific Preview. Selection passes friction/fix IDs; DayFrameApp resolves them against the current Preview. Proposal-only actions clone and revise the current result, recompute friction, set action feedback and `revisedAt` only when a revision occurs, preserve authored Setup, and preserve the Preview stale flag (`DayFrameApp.tsx:399-431`; `dayFrameStore.ts:266-300`; tests `dayFrameStore.test.ts:736`, `:883`).

Because authored invalidation retains the Preview result, stale recommendations remain bound to and executable against that stale proposal. This is internally coherent but does not restore correspondence with current authored state. Regeneration destroys prior recommendation identity. Fixed-time correction instead resolves the template ID and hands off to the precise authored input without representing the recommendation as an authored decision.

**Determination: Confirmed — Epistemically Aligned recommendation/authority separation; stale execution and absent lineage make continuity partial.**

## Persistence Transition Integrity Assessment

Runtime mutation precedes serialization/write. Active authored state and profiles use separate keys. Writes and removals are individually caught and ignored (`dayFrameStore.ts:398-508`). No commit marker, transaction, verification read, error state, or rollback exists. Clear performs two independent removals after runtime reset. Runtime and storage can therefore diverge, and reload can restore active Setup while profiles fall back, or vice versa.

Preview, draft, screen, selection, editor, feedback, revision history, and causal operation metadata are intentionally not persisted. Import persists the replacement authored aggregate but not source/import identity. Profiles and backups store snapshots, not lineage. Export invokes browser download behavior without proof of completion.

**Determination: Confirmed — Effective Runtime Atomicity for individual assignments, Externally Non-Atomic persistence, and no cross-key transaction.**

## Initialization and Rehydration Assessment

With no storage, defaults initialize authored state, profiles are empty, Preview is absent, and Setup draft is built. Valid authored JSON is parsed, normalized, and restored; profiles are read independently. Malformed authored JSON or storage access failure silently yields defaults. Invalid profile JSON/schema silently yields an empty list. Authored storage is cast after JSON parse rather than comprehensively schema-validated; normalization handles selected legacy/default fields (`createInitialDayFrameState.ts:26-163`; `dayFrameStore.ts:335-450`).

Independent keys permit coherent but hybrid restoration. A runtime Preview cannot be restored. No visible feedback identifies fallback, discarded data, or loss of prior proposal context.

**Determination: Confirmed — Sequential but Coherent initialization; silent, independently keyed fallback; lifecycle context intentionally discontinuous.**

## Navigation and Confirmation Continuity

Setup/Preview navigation changes only `currentScreen`, focus, and shell messages. It preserves the Setup draft, Preview, selected range, and Calendar Day state; it is presentation navigation, not by itself Teach → Plan or Plan → Teach authority transition (`DayFrameApp.tsx:153-184`; tests `:136`, `:591`). Generation establishes Teach → Plan proposal authority; focused editing establishes a Plan → Teach correction path.

Clear and manual-event deletion target stable global/ID authority and provide cancellation. Setup deletion confirmations store indices and live inside SetupScreen. Collection edits or replacement can change the object at an index before confirmation; navigation that unmounts Setup clears those confirmations, while replacement on the still-mounted Setup screen may not. Cancellation changes only confirmation state.

**Determination: Confirmed — navigation continuity is strong for drafts/selection, cleanup is targeted, and confirmation integrity is mixed by targeting strategy.**

## Version and History Assessment

| Artifact | Executable classification |
|---|---|
| `generatedAt`, `revisedAt`, `savedAt`, `updatedAt` | Current metadata, not version history |
| Current Preview | Mutable/replaced current proposal |
| Saved profile | User-created recoverable authored snapshot; not automatic version chain |
| Exported backup | External authored snapshot; not addressable runtime history |
| Prior Setup/Preview/event/profile/import/clear states | **Not Found** |
| Proposal revision chain / causal operation log | **Not Found** |
| Accepted plan record | **Not Found** |
| Execution/immutable outcome history | **Not Found** |
| Learned inference/evidence chain | **Not Found** |

## Lifecycle Boundary and Epistemic Integrity Matrix

| Boundary | Executable evidence | Classification |
|---|---|---|
| Draft → authored | Dirty draft is distinct; Save copies aggregate into store | **Clearly Represented; sequential commit** |
| Authored → persisted | Runtime commit and attempted storage write are separate; failure hidden | **Partially Represented; Externally Non-Atomic** |
| Teach → Plan | Generation reads committed store authority and creates Preview | **Lifecycle Boundary Implemented**, though blocked Generate partially commits Teach |
| Current → stale | Authored setters explicitly set `isStale=true`; warning rendered | **Clearly Represented** |
| Generated → revised | `revisedAt` and transformed proposal result; generated metadata retained | **Clearly Represented; No Version Continuity** |
| Recommendation → proposal correction | Proposal-only transformation and action feedback | **Clearly Represented** |
| Recommendation → authored correction | Fixed-time handoff requires explicit edit/Save | **Clearly Represented** |
| Plan → Teach | Navigation only for generic return; focused correction carries causal target | **Lifecycle Boundary Partial** |
| Plan → accepted | No accepted-plan authority or transition | **Lifecycle Boundary Absent — Not Implemented** |
| Accepted → Live | No accepted/active/execution state | **Lifecycle Boundary Absent — Not Implemented** |
| Live → history | No actual/completed/deviation authority | **Lifecycle Boundary Absent — Not Implemented** |
| History → Learn | No durable outcomes or learned inference | **Lifecycle Boundary Absent — Not Implemented** |
| Learn → Teach/Plan | No Learn authority or application transition | **Lifecycle Boundary Absent — Not Implemented** |

No current transition silently promotes generated proposal data into authored fact, accepted plan, execution, history, or learned evidence. Epistemic continuity is strongest at the authored/generated boundary and weakest at runtime/persistence and aggregate cleanup boundaries.

## Aggregate Coherence Scenarios

| Scenario | Final aggregate state | Determination / coverage |
|---|---|---|
| Edit → blocked Generate | Draft equals newly committed authority; persistence attempted; screen Preview; prior Preview retained/stale; guardrail visible | **Partial Commit**; guardrail tested, full aggregate ordering implementation-confirmed |
| Edit → successful Generate | New authored authority; new current Preview; draft synchronized; prior proposal lost | **Aggregate Coherence**; tested `:522` |
| Edit/Save after Preview | Authored authority changed; old Preview stale and reviewable | **Currentness Invalidated**; tested `:1451` |
| Revise current Preview | Authored unchanged; current proposal replaced/revised; feedback/time set | **Effective Runtime Atomicity**; tested `:1346` |
| Revise stale Preview | Authored unchanged; stale proposal revised; stale retained | **Aggregate coherent but epistemically partial**; implementation-confirmed |
| Regenerate stale Preview | Authored unchanged; new current Preview; prior revision/version lost | **Replacement without Rollback**; tested `:1477` |
| Fixed-time correction cycle | Same template identity crosses Preview → draft → authored → new Preview | **Strong Context/Identity Continuity**; tested `:1691`, `:1797` |
| Calendar Day open → load profile | New authored aggregate, Preview absent, selected range cleared; old Calendar Day/editor state survives | **Orphaned Context risk**; implementation-confirmed |
| Setup deletion pending → import | New authored aggregate/draft; local index confirmation may survive if screen remains mounted | **Partial Reconciliation**; implementation-confirmed |
| Selected date → new excluding range | selected range cleared after generation; active editor date not cleared | **Partial Reconciliation**; selection bounds behavior tested indirectly |
| Save event with Preview | Event committed/persisted; Preview replaced current; date/editor retained | **Sequential but Coherent** success; tested `:899` |
| Delete event with Preview | Event removed; confirmation cleared; Preview replaced; no history | **Replacement without Rollback**; tested `:899` |
| Dirty Setup → load profile | Profile authority replaces store; subscription rebuild overwrites dirty draft; no dirty confirmation | **Replacement without Rollback**; implementation-confirmed |
| Valid import with Preview/selection | New authored authority; Preview null; selection cleared; editor may survive | **Partial Reconciliation**; primary effects tested `:2417` |
| Confirm clear | Runtime defaults; storage removals attempted; Preview/profiles/selection absent; editor may survive | **Externally Non-Atomic; Partial Reconciliation**; tested `:2280` |
| Runtime mutation + persistence failure | Runtime new, storage old/absent, success feedback possible | **Externally Non-Atomic**; implementation-confirmed |
| Reload after valid persistence | Authored Setup/profiles restored independently; Preview/shell context absent | **Sequential but Coherent**; store tested `:24` |
| Reload after malformed persistence | Defaults or empty profiles silently substituted | **Aggregate coherent fallback; causal continuity lost**; implementation-confirmed |

## Structural Findings

1. **Confirmed — Locally coherent ownership.** Draft, authored state, generated proposal, and app context have identifiable owners.
2. **Confirmed — No aggregate transaction owner.** DayFrameApp sequences multiple store commits, browser effects, and shell cleanup manually.
3. **Confirmed — Partial Commit.** Generate mutates Teach authority before validating Plan prerequisites.
4. **Confirmed — Externally Non-Atomic.** Persistence and browser download sit outside runtime commit and are unverified.
5. **Confirmed — Replacement without Rollback.** Regeneration, profile load, import, clear, and event-driven regeneration discard prior current states.
6. **Confirmed — Partial Reconciliation.** Primary domain replacement does not clear all distributed editor, confirmation, focus, and feedback state.
7. **Confirmed — Identity mixed by layer.** Authored IDs are stable; generated IDs are proposal-local; several Setup confirmations target indices.
8. **Confirmed — No Version Continuity.** Metadata and snapshots do not form an addressable causal chain.
9. **Confirmed — Lifecycle Boundary Implemented** for committed Teach authority → generated Plan proposal.
10. **Confirmed — Lifecycle Boundary Absent** for Plan acceptance, Live, history, Learn, and returns from Learn.

## Experiential Findings

- A Generate activation can display missing prerequisites after the edited Setup has already been committed and the old Preview made stale.
- Loading/importing/clearing can remove Preview while a Calendar Day editor created from the prior Preview remains open.
- Regeneration visibly presents only the new proposal; the prior generated/revised proposal cannot be reopened.
- A stale Preview remains visible and its proposal-local fixes remain executable, producing stale state with newer revision metadata.
- Reload restores authored data when available but never restores Preview, selection, editor, feedback, or correction context.
- Manual-event Save/Delete updates authored authority and normally replaces Preview in the same interaction; if regeneration fails, the authored change remains.
- Navigation can preserve draft and selection without creating any lifecycle authority transition.
- No action changes Preview into an accepted or active schedule.

Interpretation of whether users anticipate or understand these consequences requires **Observational Research Required**.

## Behavioral Invariants

- Setup draft edits do not affect authored authority or Preview until Save/Generate.
- Every authored store setter marks an existing Preview stale before notification.
- Successful generation/regeneration produces a nonstale replacement Preview.
- Revision never changes authored Setup and preserves the previous stale flag.
- Profile load/import/clear never retain current Preview.
- Preview is never persisted or restored.
- Manual-event Save/Edit preserves event ID; Delete targets ID.
- Invalid import validates before active-state replacement.
- Persistence failure never blocks the runtime transition or produces UI error state.
- No executable transition establishes accepted plan, execution, immutable history, or learning.

## Architectural Gaps

- aggregate transition ownership and rollback are not implemented;
- durable persistence acknowledgement and cross-key transactionality are not implemented;
- prior Setup/Preview/event/profile versions and causal lineage are not implemented;
- dirty-draft protection during replacement is not implemented;
- complete shell/editor/confirmation reconciliation during domain replacement is not implemented;
- stable-ID targeting is not universal for Setup confirmations;
- Preview source-authority identity/version is not recorded;
- proposal acceptance, Live, history, Learn, and lifecycle return transitions are not implemented.

These are findings, not an implementation roadmap.

## Cross-Phase Convergence

| Prior phase finding | Phase 10 transition evidence | Determination |
|---|---|---|
| Phase 2: implementation language is Setup/Preview rather than full lifecycle | No transition promotes Preview to accepted/Live/Learn | Confirmed as lifecycle discontinuity, not only terminology |
| Phase 3: Setup/Preview plus shared shell dominate surfaces | DayFrameApp owns cross-surface transition sequencing; Calendar Day is shell context | Refined: surface centralization creates aggregate coordination responsibility |
| Phase 4: navigation preserves context but is not lifecycle | Screen changes mutate presentation state only; generation creates proposal authority | Confirmed; navigation and lifecycle transition are distinct |
| Phase 5: authored/generated information remain distinct | Store setters invalidate Preview; revision does not author Setup | Confirmed as an executable transition invariant |
| Phase 6: compound interactions cross authority boundaries | Generate and event CRUD sequence multiple owners/stages | Refined into Partial Commit and externally non-atomic classifications |
| Phase 7: Generate saves before validation; workflows end at Preview | Ordered handler stages confirm retained authored commit; no acceptance action | Confirmed with aggregate-state consequences |
| Phase 8: three principal authorities and incomplete replacement cleanup | Replacement handlers clear domain/selection but not every editor/confirmation | Confirmed as Partial Reconciliation and Orphaned Context risk |
| Phase 8: stale Preview is revisable and prior proposals are overwritten | Store revision preserves stale; generation replaces current Preview | Confirmed as legal stale/revised state and No Version Continuity |
| Phase 9: feedback exceeds recovery; persistence acknowledgements optimistic | No rollback/version; persistence exceptions swallowed after runtime commit | Refined: feedback divergence is caused by external non-atomicity |
| Phase 9: fixed-time correction is strongest recovery | Stable friction/template ID handoff survives Plan → Teach → Plan | Confirmed as strongest identity and causal-continuity path |

No Phase 10 executable evidence contradicts the Phase 1–9 architectural findings inspected here.

## Coverage Assessment

**Directly Tested:** draft/navigation preservation, aggregate Setup Save outcomes, currentness invalidation, successful Generate/Regenerate, guardrail rendering, range selection cleanup on profile replacement, proposal fixes, fixed-time causal handoff, manual-event CRUD/regeneration, profile operations, confirmation/clear, export, valid/invalid import, persistence restoration, and current Preview store replacement.

**Partially Tested:** stage ordering within Save/Generate, aggregate shell cleanup during replacement, selection bounds after arbitrary regeneration, current metadata loss, and persistence behavior. Tests usually assert primary mutation and visible result, not every distributed authority.

**Implementation-Confirmed:** stale Preview revision, storage-failure divergence, cross-key clear failure, event-commit/regeneration failure boundary, dirty-draft overwrite on replacement, Calendar Day/editor orphaning, index-based confirmation risk, malformed-storage fallback, no rollback/version history, and lifecycle absence.

**Not Found:** transaction coordinator, rollback, automatic versions, accepted-plan authority, execution state/history, learned evidence, and Teach/Plan returns driven by Learn.

**Observational Research Required:** whether users anticipate replacement or partial commit, distinguish navigation from lifecycle progress, recognize stale-and-revised state, or interpret proposal data as commitment/history.

## Open Questions

The executable implementation cannot establish:

- whether browser `localStorage` and download behavior succeeds in a particular deployment;
- whether users treat profiles/backups as versions or understand their replacement scope;
- whether users anticipate that Generate saves before showing prerequisites;
- whether stale recommendation execution is recognized as proposal-local;
- whether orphaned Calendar Day/editor states are reached in ordinary use;
- what future accepted, Live, historical, or Learn authorities will be.

## Final Architectural Determination

**Locally Coherent but Aggregately Partial.**

DayFrame does not yet possess a fully governed aggregate transition architecture. Its local boundaries are meaningful and mostly consistent: the draft remains distinct from authored authority; authored mutation invalidates generated state; proposal revision does not silently become authorship; generation produces a proposal rather than execution; and Live/Learn are absent rather than simulated.

Aggregate user actions rely on manually ordered operations across DayFrameApp, several independent store commits, derivation engines, persistence helpers, browser effects, and distributed React context. This produces confirmed partial commitment on blocked Generate, externally non-atomic persistence, replacement without version continuity, and incomplete reconciliation of editor/confirmation state after primary-authority replacement.

The implemented Teach → Plan foundation is coherent on its successful path and epistemically preserves authored/proposal distinction. It does not provide sufficient transition authority, causal history, accepted-plan state, execution evidence, or learned history to form Plan → Live → Learn continuity. Those boundaries are **Not Implemented**, not structurally conflated with Preview.
