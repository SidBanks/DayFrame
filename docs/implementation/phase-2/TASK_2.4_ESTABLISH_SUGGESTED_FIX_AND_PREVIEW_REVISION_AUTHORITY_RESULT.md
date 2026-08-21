# Task 2.4 Result — Establish Suggested-Fix and Preview-Revision Authority

## 1. Executive Determination

**Confirmed:** suggested-fix objects are derived recommendations generated from friction and current preview objects. Seven actions are currently generated; an eighth, `addResource`, exists only in the type vocabulary and is explicitly unsupported by revision.

**Confirmed current behavior:** `moveBlock`, `skipBlock`, `convertToRecovery`, `reduceDuration`, `changePriority`, and `acceptConflict` revise only the current preview snapshot. `changeFixedTime` is a separate review/navigation path that opens the authored template field and does not revise. No accepted fix identity, parameters, order, or intent is persisted or retained outside preview. Regeneration and replacement discard revisions.

**Adopted authority contract — Recommended:** use a split model. Suggested fixes remain derived recommendations until user action. `changeFixedTime` is an authored-edit recommendation; only the later explicit Setup save changes authored intent. Acceptance of an occurrence-specific automatic action is a user-owned planning decision/override, not a mutation of its recurring authored definition and not merely derived cache. DayFrame currently lacks an explicit planning-override authority class, so automatic preview-only acceptance is an architectural mismatch rather than the final contract.

**Adopted stale contract — Recommended:** fixes must not execute against stale preview state. The UI may retain them for explanation, but action must be unavailable and the store boundary must reject stale application until a fresh preview is generated. Automatic regeneration/re-identification is not adopted because a recommendation may disappear or change.

No executable behavior changed. The dependency-correct next task is the bounded stale-state safety implementation, followed by a separate planning-override semantics investigation/design before durable fix acceptance is implemented.

## 2. Artifact Integrity

- Saved specification: `docs/implementation/phase-2/TASK_2.4_ESTABLISH_SUGGESTED_FIX_AND_PREVIEW_REVISION_AUTHORITY.md`
- Immutable attachment: `/home/sid/.codex/attachments/b90f508f-987a-4954-8f69-f828e3888edd/pasted-text.txt`
- SHA-256 for both copies: `d2fc7adc2562ef65ae9b1606260147020f4584b3768fe2036c71a13a65451239`
- **Confirmed:** the required title, metadata, sections, and exact final sentence were present; copies were byte-identical.
- **Confirmed:** the specification remained unmodified.

## 3. Evidence Reviewed

**Confirmed primary evidence:** friction and suggested-fix types; `detectScheduleFriction`; `generateSuggestedFixes`; `applySuggestedFix`; `generateSchedulePreview`; `reviseSchedulePreview`; store generation/revision/invalidation/replacement methods; `DayFrameApp`; `PreviewScreen`; and directly relevant friction, engine, store, and UI tests.

**Confirmed supporting evidence:** Tasks 2.1–2.3, current architecture/audit materials, durable-data ADR, and current product copy. Executable behavior controlled where intended product meaning was not documented.

## 4. Suggested-Fix Inventory

| Fix action | Generated from | Parameters retained | Current effect | Authored mutation? | Preview mutation? | Persisted? |
|---|---|---|---|---:|---:|---:|
| `moveBlock` | conflict with movable flexible block, or movable unplaced candidate | no `parameters`; target encoded in ID and friction block IDs | moves scheduled block to first later same-user-day gap, or places candidate in first gap; sets `rescheduled` | no | yes | no |
| `skipBlock` | unplaced candidate, including work-required skip | no parameters; target encoded in ID | marks scheduled block `skipped`, or removes unplaced candidate | no | yes | no |
| `convertToRecovery` | fitness/recovery/optional flexible scheduled block or candidate | no parameters; target encoded in ID | changes occurrence/candidate category to `recovery` and prefixes title | no | yes | no |
| `reduceDuration` | flexible scheduled template whose duration can reduce | no parameters; target encoded in ID | shortens occurrence by 30 minutes, minimum 15 | no | yes | no |
| `changePriority` | adjustable flexible scheduled template below 5 | no parameters; target encoded in ID | increments occurrence priority number, capped at 5 | no | yes | no |
| `changeFixedTime` | fixed-template conflict | no parameters; target scheduled-block ID encoded | production UI locates template, opens Setup, focuses fixed-time input; engine fallback returns guidance/no revision | no, until user separately saves Setup | no | no |
| `acceptConflict` | ignorable warning/info conflict or candidate issue | no parameters; affected block IDs encoded | retains detected conflict as `ignored: true`, `resolved: true` | no | yes | no |
| `addResource` | **Not found** in production generation | none | throws “not supported in draft preview revisions yet” if manually supplied | no | no | no |

## 5. Suggested-Fix Generation Semantics

**Confirmed:** friction detection derives conflicts from generated work blocks, scheduled blocks, manual-event projections, buffers, and unplaced candidates. `generateSuggestedFixes` resolves affected IDs back to those derived objects, ranks anchor strength and adjustment targets, checks whether a safe same-day gap exists, and replaces each friction point's initial suggestions with contextual options.

**Confirmed:** recommendations reference derived work/scheduled/candidate IDs. Scheduled/candidate objects often contain authored `templateId`/`recurrenceId`, but fix objects do not directly encode a complete authored mutation.

**Confirmed:** generation and ordering are deterministic for equivalent input object identities, times, preferences, and ordering: rankings and final lists use fixed comparisons and ID tie-breakers. Friction/fix IDs are derived from affected object IDs rather than timestamps; timestamps affect friction metadata, not identity.

**Confirmed:** fix `parameters` is optional in the type and cloned at boundaries, but current generators supply no parameters.

## 6. Suggested-Fix Object Authority

**Confirmed classification:** a `SuggestedFix` is a derived recommendation. It is produced after schedule derivation, lives within a friction point inside preview, is regenerated with friction, and has no independent lifecycle or persistence.

It is not authored intent, because generation requires no user action and it never enters `DayFrameAuthoredSetup`. It is not yet a command, because it lacks a retained acceptance record, explicit base/version, ordered replay semantics, and often an explicit result target.

## 7. Production Caller Inventory

| Boundary | Production role |
|---|---|
| `generateSchedulePreview` | detects friction and calls `generateSuggestedFixes` for a new preview |
| `reviseSchedulePreview` | calls `applySuggestedFix`, redetects friction, and regenerates fixes after a successful revision |
| `DayFrameStore.applySuggestedFixToPreview` | sole store revision entry; replaces only preview and notifies |
| `PreviewScreen` | renders fix labels as enabled buttons in individual and grouped friction views |
| `DayFrameApp.handlePreviewSuggestedFix` | routes `changeFixedTime` to Setup when possible; sends all other actions to the store |

**Not found:** another production accept/replay/persist caller, command processor, plan-override service, or hidden history path.

## 8. Preview Revision Path

**Confirmed path:** 

```text
PreviewScreen button
  → friction ID + fix ID
  → DayFrameApp handler
  → changeFixedTime? navigate/focus Setup : store.applySuggestedFixToPreview
  → reviseSchedulePreview
  → applySuggestedFix against cloned current result
  → redetect friction against revised scheduled/unplaced data
  → regenerate suggestions
  → merge ignored state for surviving matching friction IDs
  → replace store preview result and notify
```

Successful revision sets store-level `preview.revisedAt`, preserves `generatedAt`, range/window provenance and `isStale`, and drops prior action feedback unless the current action supplies feedback. An unsuccessful review/no-op clones the existing result and may set feedback without setting a new `revisedAt`.

## 9. Authored-State Effects

**Confirmed:** automatic fix application changes none of the seven authored fields. It does not alter templates, recurrences, manual events, shift/cycle data, preferences, or range.

**Confirmed:** `changeFixedTime` itself also changes no authored state. Production navigation focuses the matching template's fixed-time field; only a later user edit and `Save Setup`/generation workflow commits authored intent.

**Not found:** accepted intent in profiles, backups, durability infrastructure, hidden state, or workflow history.

## 10. Derived-State Effects

- `moveBlock`: scheduled time/status or candidate placement changes.
- `skipBlock`: scheduled status changes or candidate disappears from unplaced results.
- `convertToRecovery`: derived occurrence/candidate title and category change.
- `reduceDuration`: derived occurrence end time changes.
- `changePriority`: derived occurrence priority changes.
- `acceptConflict`: derived friction resolution/ignore flags change.
- successful actions redetect all friction and regenerate suggested fixes from the revised schedule.
- generated work blocks and original block-candidate inventory are cloned/preserved by revision.
- `changeFixedTime` leaves the preview result unchanged in the engine path and provides guidance.

**Confirmed:** a revised preview is a new current display snapshot, but it retains the original `generatedAt` and has no distinct plan identity or revision lineage beyond optional `revisedAt`.

## 11. Persistence Effects

**Confirmed:** revision does not call active or profile persistence, does not update durability status, and does not change desired durable conditions. Preview is excluded from active local storage, profiles, and backups.

Application reload therefore restores authored state with `preview = null`. Saving a profile or exporting a backup after revision captures authored setup only, not the revision or acceptance choice.

## 12. Fix Category Split

**Confirmed current split:**

```text
changeFixedTime
  → authored-edit recommendation/navigation
  → user must edit/save Setup and regenerate

all generated automatic actions
  → immediate preview-only transformation
```

**Recommended semantic refinement:** all automatic actions are occurrence/plan decisions. Even `changePriority`, `reduceDuration`, and `convertToRecovery` currently alter only one derived occurrence, not the recurring template. Forcing them into the authored definition would change future occurrences and misrepresent the user's action.

`addResource` is only a reserved/unsupported vocabulary member and receives no authority contract until a production path exists.

## 13. Reproducibility Assessment

For unchanged authored state `A`, generation returns the base schedule `P`; it does not return revised `P'` because acceptance is not an input. Exact `P'` therefore is not regenerable from authored state alone.

**Confirmed:** replay against the identical base preview could reproduce most current algorithms if it retained the selected friction/fix identity, day-boundary input, revision timestamp, and exact application order. `moveBlock` computes its target from current occupancy rather than from an explicit target parameter, so it additionally depends on the complete intermediate schedule. `changeFixedTime` requires the later authored edit, not command replay.

**Recommended:** deterministic regeneration should eventually be defined as authored setup plus explicit user-owned plan overrides. The override representation should record semantic result/target and base scope rather than depend only on ephemeral generated IDs.

## 14. Multiple-Fix Sequence Semantics

**Confirmed:** after each successful fix, friction and suggestions are recomputed and the updated preview remains actionable. A user can therefore apply another available fix sequentially.

**Inferred and structurally demonstrated:** order can affect availability and output. A move may remove a conflict before reduce/accept is chosen; a reduction can change gaps; a skip can remove an object; accept retains ignored friction; each next recommendation is based on the intermediate preview.

Exact `P2` requires the base preview plus the accepted decisions in order, or a normalized final override set whose conflict semantics are separately defined. No sequence, intermediate state, undo record, or accepted IDs are retained today.

## 15. Regeneration Behavior

**Confirmed:** Generate/Regenerate Preview calls the generator from current authored state and replaces the complete preview with `isStale: false`. Prior automatic fix effects, ignored conflicts, `revisedAt`, and action feedback disappear. The engine may independently produce equivalent base recommendations again, but it does not replay acceptance.

For `changeFixedTime`, a separate saved authored edit does survive because regeneration consumes the changed template. Navigation without saving changes nothing.

## 16. Navigation / Session Behavior

| Event | Automatic revised preview behavior |
|---|---|
| navigate Setup ↔ Preview without commit | survives in store |
| edit Setup draft without save | survives; draft is not authority yet |
| save Setup | revised preview preserved but marked stale |
| change manual event | store first stales preview; current UI immediately regenerates if preview exists, discarding revision |
| save/delete profile | survives; active preview dependency unchanged |
| load profile | cleared |
| import backup | cleared |
| clear local data | cleared |
| regenerate | replaced/discarded |
| reload application | absent; preview is non-durable |

## 17. Product-Copy Assessment

**Confirmed visible terms:** “Review the draft schedule day by day, then apply suggested fixes,” “Move block,” “Skip block,” “Convert to recovery,” “Reduce duration,” “Change priority,” “Review fixed time,” “Accept conflict,” “Revised,” and “Generate a new preview.” Friction messages also say items “should be reviewed before schedule commit,” although there is no distinct durable plan-commit boundary.

The stale warning says: “Setup changed. Generate a new preview to see updates.” It identifies outdated content but does not state that fix buttons are unsafe or temporary.

**Not found:** copy explaining “experiment,” “temporary,” “this preview only,” loss on regeneration/reload, or durable plan override.

## 18. User Expectation Risk

**Confirmed high risk:** imperative “fix,” “move,” “skip,” “accept,” and visible “Revised” language plausibly communicates that the schedule was resolved. The actual effect is a session-only snapshot that silently disappears on regeneration or reload.

Calling the output a “draft” signals non-finality, but does not adequately communicate that an explicit user decision is not retained. Current UI semantics therefore overstate authority relative to storage/regeneration behavior.

## 19. Stale-Preview Behavior

**Confirmed:** every authored dependency mutation marks an existing preview stale. `PreviewScreen` displays the stale warning but renders the same enabled fix buttons. Neither UI handler nor store rejects stale state. `reviseSchedulePreview` receives only the old result and has no authored-state version/freshness input.

Applying a fix revises old scheduled/unplaced objects, redetects friction only against the old preview's work blocks and candidates, preserves `isStale: true`, and ignores the newer authored values that caused staleness.

## 20. Stale-Fix Correctness Risk

**Confirmed classification:** misleading and an invalid planning-authority transition. The selected recommendation was derived from obsolete inputs, may target an occurrence that no longer exists or has changed, and the revised output remains explicitly stale.

Even under a disposable-experiment interpretation, executing an obsolete recommendation as “apply suggested fix” lacks a coherent base contract. The safe invariant is freshness before action.

## 21. Fix Identity Stability

**Confirmed:** friction IDs concatenate affected block IDs; fix IDs concatenate action prefixes and one or more block IDs. They are tied to generated work/scheduled/candidate identities and do not include timestamps.

**Inferred:** IDs can be stable across equivalent deterministic regeneration when authored data, planning window, ID algorithms, and placements are identical. They are not a durable semantic identity guarantee: authored changes, range changes, candidate placement differences, or a prior revision can remove/reorder targets or eliminate the friction.

Therefore stale auto-regeneration cannot safely assume the same fix ID remains applicable.

## 22. Fix Parameter Completeness

| Action | Enough to apply to identical current preview? | Enough as durable semantic command/override? | Missing durable semantics |
|---|---:|---:|---|
| move | yes, algorithm derives gap from full preview | no | explicit target time/date, occurrence identity, base/version |
| skip | yes | partial | durable occurrence scope and reason/provenance |
| convert recovery | yes | partial | occurrence scope and resulting semantic intent |
| reduce duration | yes | partial | explicit resulting duration and occurrence scope |
| change priority | yes | partial | explicit resulting priority and occurrence scope |
| accept conflict | yes | partial | conflict/occurrence scope, applicability/version, acceptance provenance |
| change fixed time | no automatic application intended | no | authored value chosen by user and committed template identity |
| add resource | unsupported | no | entire action contract |

Current IDs plus the current snapshot are execution selectors, not complete user-owned planning records.

## 23. Candidate Authority Models

- **A — Disposable preview experiment:** accurately describes current automatic lifecycle but conflicts with current copy and loses explicit decisions. Viable only if clearly labeled and intentionally non-authoritative; not the meaning of “accepted fix.”
- **B — Authored intent mutation:** durable/regenerable where a recommendation truly means changing a template or other authored definition. It is incorrect for a single occurrence move/skip/reduction/acceptance without exception semantics.
- **C — Replayable revision command:** can preserve ordered behavior, but ephemeral IDs and implicit target computation make the current objects insufficient. Command history is more complexity than needed if normalized plan overrides can represent final decisions.
- **D — Explicit planning override:** separates recurring authored intent from user-owned decisions about generated occurrences. Best fit for automatic occurrence actions and future Planner semantics.
- **E — Split by fix type:** routes authored-definition recommendations to Setup and occurrence decisions to planning overrides; leaves purely hypothetical experiments explicitly temporary. Best overall model.

## 24. Authority Model Matrix

| Model | Regenerable | Durable | Preserves User Intent | Fits Current Data Model | Fits Future Architecture | Complexity | Recommendation |
|---|---:|---:|---:|---:|---:|---:|---|
| Disposable preview experiment | no exact authored-only regeneration | no | no beyond session snapshot | high | low/partial | low | reject as accepted-fix authority; may remain explicit experiment mode |
| Authored intent mutation | yes when representable | yes | yes, but can over-broaden occurrence choices | partial | partial/high for definition edits | medium | use only for true authored edits |
| Replayable command | yes with complete ordered commands/base | potentially | yes | low | medium | high | defer unless override model needs command lineage |
| Explicit planning override | yes with authored state + overrides | should be | yes | missing | high | medium/high | recommend for occurrence actions |
| Split by fix type | yes per represented class | according to class | yes | partial today | high | medium | **adopt** |

## 25. Adopted Suggested-Fix Authority Contract

1. **Recommended:** generated fixes are derived recommendations and have no authority before user action.
2. **Recommended:** `Review fixed time` recommends an authored-definition edit. Navigation has no authority; explicit Setup save establishes authored intent, and regeneration derives the result.
3. **Recommended:** accepting move, skip, convert, reduce, reprioritize, or accept-conflict for a generated occurrence establishes a user-owned planning override/decision scoped to the affected occurrence/conflict.
4. **Recommended:** an occurrence override must not silently mutate the recurring template/recurrence.
5. **Recommended:** accepted planning decisions must be explicit regeneration inputs and must not disappear silently on regeneration.
6. **Recommended:** until that representation exists, current preview-only revision is classified as an interim, non-durable implementation mismatch—not durable authority.
7. **Deferred:** optional explicitly labeled preview experiments may coexist later, but must be unmistakably disposable and distinct from “accept.”
8. `addResource` remains **Deferred/unsupported** until a real generation and authority contract exists.

## 26. Candidate Stale-Action Models

- **A — Allow stale revision:** current behavior; applies obsolete recommendation to obsolete derived objects. Rejected.
- **B — Disable/reject:** UI prevents activation and store enforces the invariant. Smallest safe model. Adopted.
- **C — Auto-regenerate/revalidate:** requires equivalence matching and user reconfirmation when the recommendation changes/disappears. High complexity and surprising. Rejected for current scope.
- **D — Ask user to regenerate:** clear UI guidance, but must be paired with an execution rejection rather than merely advisory copy. Adopt as the communication aspect of B.

## 27. Stale-Action Matrix

| Model | Uses Current Authored Inputs | Obsolete-fix risk | Complexity | User clarity | Recommendation |
|---|---:|---:|---:|---:|---|
| Allow stale revision | no | high | low | low | reject |
| Disable/reject | after user explicitly regenerates | none at execution boundary | low | high | **adopt** |
| Auto-regenerate/revalidate | yes | medium unless equivalence is proven | high | medium | reject/defer |
| Ask user to regenerate | yes after user action | none if execution also blocked | low | high | adopt alongside disable/reject |

## 28. Adopted Stale-Preview Contract

**Recommended:** a stale preview is reviewable historical output but not an actionable base for suggested fixes. Fix controls should be unavailable with regeneration guidance, and `applySuggestedFixToPreview` should reject stale state so non-UI callers cannot bypass the invariant. After explicit regeneration, only fixes present in the new preview may be selected.

No attempt should automatically translate an old friction/fix ID to a new preview.

## 29. Derived Versus User-Owned Planning State

**Confirmed current state:** the entire revised preview is stored as derived runtime state, even where it contains user-selected changes.

**Recommended classification:** the schedule result remains derived, but accepted occurrence overrides are a separate user-owned authoritative planning input. A preview regenerated from authored setup plus overrides is derived. This avoids promoting the entire large preview snapshot to authority while preserving the user's decision.

## 30. Planning Authority Assessment

**Confirmed:** generated Preview begins as a visualization/draft of derivation. Once automatic fix buttons directly edit placements, statuses, duration, category, priority, and conflict acceptance, the UI is functioning as an editable plan despite lacking an explicit plan-authority model.

**Architectural hinge:** retain Preview as derived output, but represent accepted edits separately. Treating the whole revised preview as either “only cache” or “the authoritative plan” would conflate output with user decision.

## 31. Provenance Implications

**Recommended future chain:** generated recommendation → user acceptance → explicit planning override → regenerated plan consequence. The override should retain recommendation/action provenance sufficient to explain why the plan differs from base generation, without making transient recommendation text itself authoritative.

**Deferred:** schema, identifiers, audit retention, and UI explanation design.

## 32. Durable-Data Implications

**Recommended:** user-owned planning overrides should survive regeneration and reload and therefore are durable user data, subject to the durable-data ADR, versioning, compatibility, failure outcomes, retry semantics, and clear behavior.

No new durable surface or format is selected here. A design task must decide whether overrides belong with active planning data or a separate versioned planning surface. They should not be inserted into the seven-field authored setup merely for convenience.

## 33. Profile / Backup Implications

Authored setup profiles should not automatically absorb occurrence-level plan overrides because profiles currently mean reusable authored setup snapshots. A future whole-plan backup may need them; the existing setup backup should remain authored-only unless its product meaning is explicitly expanded and versioned.

**Deferred:** capture/restore policy until override lifecycle and planning-window identity are defined.

## 34. Execution / History Implications

The adopted final-state planning-override model does not inherently require a full ordered command or undo history. Deterministic regeneration can consume normalized overrides.

Order still matters in the current imperative revision algorithm. If future semantics require preserving the exact sequence, undo, audit, or recommendation acceptance history, an ordered command/history class will be necessary. **Deferred:** do not add history until that requirement is explicit.

## 35. Future Engine / Planner Implications

Future “Resolve Friction” maps naturally to either:

- edit a commitment/template (authored intent), or
- accept a scoped scheduling decision (planning override).

The engine should derive a plan from authored inputs plus explicit overrides and emit explainable friction/recommendations. It should not infer enduring commitment changes from occurrence moves, and it should not discard accepted overrides during recomputation.

Before implementation, override scope must define occurrence identity, planning-window/base version, conflict behavior, application ordering/normalization, and what happens when authored changes invalidate an override.

## 36. Required Behavioral Invariants

1. Suggested fixes remain derived recommendations until explicit user action.
2. Stale previews cannot execute suggested fixes at UI or store boundaries.
3. Regeneration is required before selecting a replacement recommendation after staleness.
4. `Review fixed time` changes authored intent only through explicit Setup save.
5. Occurrence-level acceptance never silently changes a recurring authored definition.
6. A user-owned accepted planning decision must have explicit representation and survive regeneration.
7. Derived preview output remains reproducible from all authoritative inputs, including overrides.
8. Unsupported actions cannot masquerade as applied fixes.
9. Multiple accepted decisions have deterministic conflict/order semantics.
10. Persistence, profile, backup, and clear behavior must follow the chosen override lifecycle explicitly.

## 37. Required Later Test Contract

The stale-safety implementation should test:

- fresh preview actions remain available;
- stale UI actions are disabled/unavailable with regeneration guidance;
- store rejects stale application directly;
- rejection changes neither authored nor preview state and performs no persistence;
- regeneration exposes only newly generated fixes;
- `changeFixedTime` stale behavior follows the same freshness rule.

The planning-override implementation/design must eventually protect:

- deterministic fix generation for equivalent previews;
- recommendation remains non-authoritative before acceptance;
- each accepted action creates the correct scoped override, not a template mutation;
- authored-edit recommendations use explicit authored commits;
- regeneration replays/preserves all accepted overrides;
- multiple decisions produce deterministic final output and defined conflicts;
- reload/durability/clear behavior follows the durable contract;
- profile and backup inclusion/exclusion is explicit;
- no hidden command/history state exists unless separately adopted;
- provenance links recommendation, acceptance, override, and plan consequence.

## 38. Architectural Alignment Assessment

| Concern | Current classification | Assessment |
|---|---|---|
| recommendation derivation | Aligned | fixes are derived from friction/current preview |
| authored/derived separation | Partially aligned | authored state is untouched, but user decisions are trapped in derived cache |
| deterministic regeneration | Mismatched after acceptance | authored inputs cannot reproduce revised output |
| provenance | Mismatched | no accepted identity/order/meaning retained |
| persistence | Mismatched for accepted user decision | revision silently disappears |
| stale-state safety | Mismatched | obsolete recommendations remain executable |
| user expectation | Mismatched | “apply/fix/revised” overstates retention |
| future Planner semantics | Partially aligned | behavior resembles editable plan but lacks planning authority class |

## 39. Open Questions

- **Unresolved:** exact occurrence identity across regeneration and planning-window changes.
- **Unresolved:** whether accepted overrides expire, conflict, or require confirmation after authored edits.
- **Unresolved:** whether overrides are active-plan durable data or a separate versioned surface.
- **Unresolved:** whether final-state overrides suffice or audit/undo requires ordered commands.
- **Unresolved:** profile and whole-backup policy for plan decisions.
- **Deferred:** semantics for `addResource` until it is generated and supported.

None blocks the independent stale-state safety correction.

## 40. Recommended Next Task

**Task 2.5 — Prevent Suggested-Fix Application Against Stale Preview State.**

This bounded implementation should disable/unavailable fix actions in stale preview UI, reject stale calls at the store boundary, preserve the warning/regeneration workflow, add direct UI/store tests, and change no authority/persistence model.

After Task 2.5, the dependency-correct investigation/design is:

> **Establish User-Owned Plan Override Semantics**

That task must define scope, identity, invalidation, regeneration, durability, provenance, and conflict semantics before converting preview-only acceptance into durable planning authority.

## 41. Deviations

None. Task 2.4 is investigation-only. No production code, tests, types, UI, engine, persistence, durable format, governance document, ADR, or prior task artifact was modified. The pre-existing Task 2.3 implementation changes were preserved without alteration.

## 42. Discoveries and Deferred Work

**Discovery:** all generated automatic actions are occurrence-level in current implementation—even names such as priority/duration/category that could be mistaken for authored template edits.

**Discovery:** fix objects carry no generated parameters; the executor derives outcomes from IDs plus the complete current preview, making them selectors rather than complete commands.

**Discovery:** `addResource` is type-only and throws if invoked, while `changeFixedTime` has both an engine guidance fallback and a production UI navigation specialization.

**Discovery:** automatic fixes can be sequenced because friction is regenerated after every successful revision, but no sequence is retained.

**Deferred:** planning-override representation, durability, provenance, history/undo, explicit experiment mode/copy, and unsupported resource action.

## 43. Validation

Validation results:

- targeted friction/engine/store/UI tests: 8 files and 245 tests passed
- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm test`: 23 files and 371 tests passed
- `npm run build`: passed; TypeScript and Vite production build completed
- specification hash/immutability recheck: passed; saved specification and attachment remained byte-identical at `d2fc7adc2562ef65ae9b1606260147020f4584b3768fe2036c71a13a65451239`
- executable/governance diff audit: passed; Task 2.4 created only this separate result artifact and preserved the pre-existing Task 2.3 implementation changes

## 44. Final Completion Determination

**Complete.** The investigation inventoried every current fix action, traced the full generation/revision/lifecycle behavior, adopted split authority and stale-state contracts, identified the missing user-owned planning-override authority class, defined durability/history implications and later invariants/tests, selected the dependency-correct next tasks, passed all validation, and changed no executable behavior.
