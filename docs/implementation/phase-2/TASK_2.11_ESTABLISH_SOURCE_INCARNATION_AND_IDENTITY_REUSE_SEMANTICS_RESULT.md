# Task 2.11 Result — Source-Incarnation and Identity-Reuse Semantics

## 1. Executive Determination

**Classification: B — Required Before Durable Occurrence References.**

DayFrame has no explicit source-incarnation concept. Current authored-source identity is an ID string plus the source collection in which it appears. Ordinary UI edits preserve that ID, but replacement, deletion/recreation, profile load, backup import, rehydration, and clear/restore can place the same ID on data from a different lifetime. The system does not record enough evidence to distinguish those cases.

Version 1 `OccurrenceIdentity` remains suitable for deterministic runtime comparison while the authoritative authored sources are one continuous, controlled snapshot lineage. It is not safe as a durable foreign key and must not be used by durable PlanDecision state until an incarnation or equivalent lifecycle-invalidating contract exists.

Evidence classifications used below are **Confirmed**, **Inferred**, **Not found**, and **Unresolved**.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/d0ffa398-e848-4b8f-bbb0-c19bcdbe40a4/pasted-text.txt`
- Supplied SHA-256: `aa16a127ad169c25e3317d27eab3bd00868ba537a8e0ad24a0b8edc7334261a7`
- Supplied size: 841 lines, 25,592 bytes
- Saved project copy: `docs/implementation/phase-2/TASK_2.11_ESTABLISH_SOURCE_INCARNATION_AND_IDENTITY-REUSE_SEMANTICS.md`
- Saved-copy SHA-256: `638f6c5921f324460be4b5e4c5e6f1bfa96ad87969daff90fb9740c898d9684e`
- Comparison: content is identical; the supplied artifact lacks only the saved copy's final newline. **Confirmed.**
- Both copies contain every required section and the prescribed final completion sentence. Neither was modified.

## 3. Evidence Reviewed

Production evidence included source types, Task 2.10 identity constructors and generation sites, `SetupScreen` creation/edit/delete flows, manual-event UI flows, store collection setters and whole-state replacement operations, local-storage rehydration, profile and backup normalization, clear/reset, shift-cycle validation, occurrence generation, and clone/snapshot boundaries. Direct tests reviewed included setup/manual-event workflows, store persistence/rehydration/profile/backup/clear behavior, and Task 2.10 recurrence and occurrence-identity tests.

The cumulative Task 2.10 result and prior Phase 2 artifacts were used as supporting context. Executable behavior was treated as authoritative.

## 4. Source Identity Inventory

Identity-bearing authored sources are:

- block template (`BlockTemplate.id`);
- block recurrence (`BlockRecurrence.id`, linked by `blockTemplateId`);
- shift definition (`ShiftDefinition.id`);
- shift cycle (`ShiftCycle.id`);
- manual cycle segment (`ShiftSegment.id`, plus `shiftCycleId` and `shiftDefinitionId`);
- repeating sequence entry (`ShiftCycleSequenceDay.id`, plus containing cycle and optional shift-definition link);
- manual event (`ManualCalendarEvent.id`).

All are plain strings. No type has an incarnation, generation, revision, tombstone, immutable creation nonce, or globally unique identity field. `createdAt` exists on templates, shift definitions, cycles, and manual events, but Task 2.10 identity does not include it and current replacement/import paths do not enforce its immutability. **Confirmed.**

## 5. Source Identity Matrix

| Source | ID field | Creation owner | Edit preserves ID? | Delete supported? | Reuse possible? | Durable? |
| --- | --- | --- | --- | --- | --- | --- |
| Block template | `id` | Setup UI; store/import callers | Yes in UI | Yes, with draft recurrence | Yes, length-derived or imported | ID and source data: yes |
| Block recurrence | `id`, `blockTemplateId` | Setup UI/default recurrence; import callers | Yes in UI | Yes with template | Yes, derived from template/index or imported | Yes |
| Shift definition | `id` | Setup UI; store/import callers | Yes in UI | Yes | Yes, length-derived or imported | Yes |
| Shift cycle | `id` | Setup UI/default draft; store/import callers | Yes in UI | Yes | Yes, length-derived or imported | Yes |
| Manual segment | `id`, containing cycle | Setup UI; import callers | Yes in UI | Yes | Yes, length-derived or imported | Yes |
| Sequence entry | `id`, containing cycle | Setup UI; import callers | Yes in UI | Last-entry removal supported | Yes after removal/import; duplicates accepted if offsets valid | Yes |
| Manual event | `id` | App UI timestamp; store/import callers | Yes in UI | Yes | Yes through supplied/imported IDs; timestamp collision not prohibited | Yes |

“Durable” means the fields are carried by active-state/profile/backup representations, not that their identities are incarnation-safe.

## 6. Current Source-Incarnation Model

**Not found:** no explicit concept equivalent to one continuous lifetime of one authored source.

**Confirmed:** equality is effectively “same source-kind context and same ID fields.” Object identity is discarded by cloning and serialization. Timestamps are descriptive data, not enforced lifecycle identity. Consequently, same ID does not prove same continuous source lifetime.

## 7. Identifier Creation Semantics

- Shift definitions: `shift_${currentDrafts.length + 1}`. Collection-state sequence; no uniqueness scan. **Confirmed.**
- Shift cycles: `cycle_${pad(nextIndex)}` where callers pass current length plus one. Collection-state sequence; no uniqueness scan. **Confirmed.**
- Manual segments: `segment_${nextIndex}` from current segment length plus one. Scoped operationally to a cycle, but not type-enforced. **Confirmed.**
- Sequence entries: `sequence_day_${length + 1}`. Collection-state sequence. **Confirmed.**
- Templates: `template_${currentEntries.length + 1}`. **Confirmed.**
- Recurrences: `rec_template_${nextIndex}` for new entries; fallback recurrence uses `rec_${blockTemplateId}`. **Confirmed.**
- Manual events: `manual_event_${ISO timestamp}` unless editing, in which case the existing ID is retained. Timestamp based; uniqueness is not checked. **Confirmed.**
- Profile IDs (not part of occurrence identity): normalized profile name; saving the same exact name replaces the matching profile. **Confirmed.**
- Store constructors, setters, profiles, backups, and rehydration accept IDs already present in supplied durable/runtime data. **Confirmed.**

No path establishes global, permanent, or incarnation-safe uniqueness.

## 8. Edit Semantics

Ordinary Setup UI edits spread the existing source object and preserve its ID. Manual-event editing explicitly retains `editingManualEventId` and original `createdAt`. **Confirmed.** These operations are treated as edits to the same runtime source.

Changing recurrence frequency preserves recurrence ID but changes Version 1 frequency/scope components, so occurrence identity can change even though authored recurrence ID is retained. Changing template content generally preserves occurrence identity. Changing work cycle/segment/definition IDs changes it; changing work times does not change identity for the same local start date. **Confirmed.**

Store setters and `commitAuthoredSetup` replace entire arrays and do not determine whether a same-ID object is an edit or a new incarnation. For those API-level replacements, continuity is **Unresolved** by data and therefore ambiguous.

## 9. Delete/Recreate Semantics

UI deletion removes list entries; it creates no tombstone or retired-ID record. Later creation uses current length. Deleting the last item normally reuses the deleted suffix on the next create. Deleting a non-final item can make the next length-derived ID collide immediately with an existing later item. **Confirmed from production algorithms.**

Manual events are deleted by filtering on ID. Recreation normally receives a new timestamp-derived ID, but neither the setter nor import paths prohibit reuse, and timestamp uniqueness is not enforced. **Confirmed.**

The implementation cannot prove whether a recreated same-ID value is the same or a new source. Semantically it should be treated as ambiguous, not continuous.

## 10. Template Identity Analysis

Template occurrence identity includes template ID and recurrence ID. Content edits retain V1 identity. Template deletion also removes its paired draft recurrence, but recreation can reuse both index-derived IDs, producing identities equal to the deleted source's occurrences for the same recurrence scope and slot. **Confirmed.**

## 11. Recurrence Identity Analysis

Recurrence is independently identity-bearing within template occurrence identity. A recurrence edit that preserves ID and frequency/scope can reproduce equal occurrences. Delete/recreate or imported replacement can reuse the same recurrence ID. Duplicate recurrence records are iterated independently; if their identity fields match, equal candidate identities and runtime IDs can be emitted. **Confirmed.**

The model does not define whether replacing recurrence rules under the same ID represents evolution of one recurrence or a new recurrence lifetime. **Unresolved.**

## 12. Work-Source Identity Analysis

V1 work identity uses shift cycle ID, segment/sequence-entry ID, shift-definition ID, local start date, and slot zero. Every contributing source ID can be reused. Therefore a restored or recreated cycle graph can reproduce an old work identity for the same local date even if it is a separate authored lifetime. **Confirmed.**

Cycle date-overlap validation rejects overlapping cycles regardless of ID, segment overlap validation rejects overlapping manual segments, and sequence offsets must be unique. Those constraints reduce some simultaneous collisions but do not enforce unique source IDs or cross-lifetime identity.

## 13. Manual-Event Identity Analysis

Manual-event V1 identity contains only `manualEventId`. Edits, including moving date/time, preserve identity. This matches current “edit the event” behavior. Deleting and reintroducing that ID—through a caller, rehydration, profile, or backup—produces the same V1 identity with no continuity proof. Duplicate manual events with the same ID are retained and project duplicate equal identities/runtime IDs. **Confirmed.**

## 14. Duplicate-ID Behavior

There is no general duplicate-ID validator in store setters, persisted-state normalization, profile normalization, or backup validation. **Confirmed.**

- Duplicate templates: accepted; generation's `Map` makes the last template with an ID authoritative for recurrence lookup. Earlier duplicates remain in state. **Confirmed.**
- Duplicate recurrences: accepted and each is expanded; equal records can create equal candidate/runtime IDs. **Confirmed.**
- Duplicate shift definitions: accepted; work generation's `Map` uses the last definition for a duplicated ID. **Confirmed.**
- Duplicate cycle IDs: not directly rejected. Date overlap may reject simultaneous overlapping cycles, but non-overlapping duplicate IDs are tolerated. **Confirmed.**
- Duplicate segment IDs: not directly rejected; date overlap may independently reject overlapping segments. **Confirmed.**
- Duplicate sequence IDs: not rejected; only day-offset uniqueness/contiguity is validated. **Confirmed.**
- Duplicate manual-event IDs: accepted and all valid records survive normalization. **Confirmed.**

Downstream outcomes range from last-entry overwrite in lookup maps to multiple ambiguous generated objects. Duplicate-ID state is not a supported semantic guarantee merely because it is tolerated.

## 15. Rehydration Semantics

Active-state rehydration parses persisted arrays, normalizes selected legacy shapes/defaults, and retains source IDs. It neither assigns new IDs nor records restoration incarnation. Object references are new; ID-based semantic identity is unchanged. Duplicate IDs are generally preserved. **Confirmed.**

Thus rehydration can prove restoration of serialized values, but it cannot prove continuity of a source lifetime beyond the durable payload's own unversioned IDs.

## 16. Profile Replacement Semantics

Loading a profile replaces the complete active authored setup and clears preview while retaining saved profiles. Profile data carries original IDs unchanged. A profile can therefore reintroduce an earlier source ID after the active source was edited, replaced, or deleted. The runtime has no marker distinguishing restored historical content from continuous identity. **Confirmed.**

## 17. Backup Import Semantics

Backup import validates/normalizes the V1 envelope, replaces the complete active authored setup, retains saved profiles, clears preview, and preserves supplied source IDs. No duplicate-ID or incarnation validation is performed. Earlier IDs can be reintroduced and collide structurally with prior V1 occurrence identities. **Confirmed.**

## 18. Clear/Reset Semantics

`clearLocalData` replaces runtime state with empty initial authored collections and attempts to remove active/profile durable surfaces. It stores no retired-ID memory. The Setup draft then creates conventional IDs such as `cycle_001`; later creation can recreate prior IDs. A later backup/profile-like external restoration can also restore old IDs. **Confirmed.**

Clear terminates runtime ownership of old sources, but current identity data cannot prove that termination when an ID later returns.

## 19. Occurrence Identity Collision Analysis

Collision classes are:

1. delete/recreate with reused source IDs and equal recurrence scope/date;
2. clear then create conventional IDs matching old sources;
3. profile load or backup import restoring earlier IDs;
4. active-state rehydration of a payload whose IDs match previously observed sources;
5. duplicate IDs simultaneously present in accepted arrays;
6. whole-array replacement with same IDs but unrelated objects;
7. timestamp-derived manual-event ID reuse;
8. recurrence frequency toggled away and back under the same recurrence ID;
9. cycle/segment/sequence/definition graph replacement under the same component IDs.

## 20. Occurrence Collision Matrix

| Collision scenario | Structurally equal V1 identity possible? | Semantically same? | Risk |
| --- | --- | --- | --- |
| Ordinary content edit | Yes | Generally yes in current UI | Low for runtime comparison |
| Template + recurrence delete/recreate | Yes | Not provable | Old decision can target new activity |
| Work graph delete/recreate | Yes | Not provable | Old decision can target new work source |
| Manual event delete/recreate | Yes | Not provable | Old event decision can attach to new event |
| Profile load restoring IDs | Yes | Ambiguous: restoration versus replacement | Historical state aliases current state |
| Backup import restoring IDs | Yes | Ambiguous | External payload can alias prior runtime identity |
| Clear then recreate | Yes | No continuity evidence | Cleared history can reattach |
| Duplicate records in one snapshot | Yes | Often no unique referent | Multiple current occurrences share identity |

## 21. Runtime Semantic Equality Assessment

V1 equality is safe for current deterministic preview regeneration and transformations when all of the following hold:

- comparison is bounded to one controlled authoritative source lineage;
- no source collection replacement/import/clear has intervened;
- relevant IDs are unique within their expected scopes;
- no delete/recreate with reused IDs has occurred; and
- the comparison is not retained as durable referential history.

It is not a proof of continuous source lifetime. Even within one browser session, a profile load, backup import, clear/recreate, arbitrary setter replacement, or ID-reusing draft workflow crosses the safe boundary.

## 22. Durable Foreign-Key Readiness

**Not ready.** Durable references could outlive the source snapshot that gave an ID meaning and later attach to a different source with equal V1 identity. Persistence durability of IDs does not establish referential durability. Before durable occurrence references, DayFrame needs either incarnation-aware identifiers or a comparably explicit invalidation/namespace contract, duplicate-ID enforcement, migration/version treatment, and restoration semantics.

## 23. PlanDecision Dependency Assessment

PlanDecision investigation may use these findings immediately. A session-only implementation could use V1 only if decisions are invalidated across every ambiguous lifecycle boundary and duplicate IDs are excluded. Durable PlanDecision, or decisions expected to survive profile/backup/state replacement, requires incarnation implementation or an equivalent durable referential model first. **Confirmed architectural dependency; implementation deferred.**

## 24. Source-Incarnation Necessity Determination

Selected classification: **B. Required Before Durable Occurrence References.**

It is not required to preserve current preview generation, placement, suggested-fix revision, or snapshot cloning. It becomes required before the product asserts that a retained occurrence reference still denotes the same authored-source lifetime after deletion, replacement, restoration, or ID reuse.

## 25. Incarnation Model Options

Viable future models, without selecting or implementing one:

1. Immutable per-source incarnation token generated at creation and persisted with the source; occurrence identity includes the relevant token(s).
2. Permanently non-reusable source IDs with enforced uniqueness and import collision rules; the ID itself becomes the incarnation token.
3. Durable namespace/generation epoch applied to whole-state replacement or restoration, combined with source IDs.
4. Decision invalidation boundaries that deliberately prohibit references from crossing replacement/import/clear, suitable only where product semantics permit loss of continuity.

Created timestamps alone are insufficient unless made immutable, unique, validated, migrated, and included in the identity contract.

## 26. Durable Compatibility Impact

Adding incarnation fields would change authored active-state, profile, and backup formats and require legacy normalization/migration rules. Strengthening `OccurrenceIdentity` would require a new identity version or an explicitly backward-compatible extension. Imported old data would need deterministic incarnation assignment or a declared “legacy unknown incarnation” boundary. Cross-device/profile restoration would need a decision on whether it restores the same incarnation or creates a new one.

## 27. Occurrence Identity Versioning Assessment

`OCCURRENCE_IDENTITY_VERSION` remains `1`. No change is warranted in this investigation. A future structural addition that affects equality should normally create Version 2 rather than silently changing Version 1 semantics. Whether V2 embeds source incarnation per component or references a durable source key is deferred to the implementation contract.

## 28. Authority / Ownership Assessment

Active `DayFrameState` owns current authored sources in memory; persisted active state is the last durable checkpoint; profiles and backups are durable snapshots capable of replacing active authority. Ownership answers which snapshot currently drives generation. It does not establish historical identity continuity. A source being owned and persisted does not make its ID permanently unique or incarnation-safe.

## 29. Lifecycle / Incarnation Matrix

| Operation | Same source provable? | New source provable? | Ambiguous? | Occurrence identity consequence |
| --- | --- | --- | --- | --- |
| Ordinary UI edit | Yes, within current draft lineage | No | Low | Usually retained; frequency/scope edits may change V1 |
| Whole-array same-ID replacement | No | No | Yes | V1 can remain equal without continuity proof |
| Delete/recreate | No | UI action indicates new creation | If only later data observed, yes | V1 may collide with deleted occurrence |
| Profile load | No | No | Yes | Preserved IDs can alias earlier active sources |
| Backup import | No | No | Yes | Supplied IDs can alias prior sources |
| Clear then recreate | No | Yes operationally | Later payload lacks proof | Conventional IDs can reproduce V1 |
| Clear then restore | No | Restoration intent not encoded | Yes | Old V1 can return |
| Duplicate-ID state | No unique referent | No | Yes | Equal V1 may denote multiple generated records |

## 30. Future-Capability Dependency Matrix

| Future capability | Needs incarnation semantics? | Needs incarnation implementation? | Reason |
| --- | --- | --- | --- |
| Current preview regeneration | Existing bounded semantics suffice | No | Same canonical inputs regenerate equal runtime identities |
| Current suggested-fix revision | Existing bounded semantics suffice | No | Revision does not persist occurrence references |
| Runtime/session-only comparison | Yes, as a documented boundary | Not necessarily | Safe only before ambiguous lifecycle operations |
| PlanDecision investigation | Yes | No | Must specify lifecycle and invalidation expectations |
| Session-only PlanDecision | Yes | Conditional | Can avoid implementation only with strict invalidation and uniqueness boundaries |
| Durable PlanDecision persistence | Yes | Yes/equivalent required | Decisions outlive source snapshot meaning |
| Durable occurrence references | Yes | Yes/equivalent required | Must prevent cross-incarnation aliasing |
| Profile/backup-surviving decisions | Yes | Yes | Restoration/replacement semantics must be explicit |

## 31. Behavioral Invariants

- Current preview generation remains unchanged.
- V1 occurrence identity remains runtime-only and non-durable.
- Ordinary edits do not change authored IDs unless the user replaces sources through broader state operations.
- Profile load and backup import replace active authored authority and clear preview.
- Clear removes current runtime authored sources regardless of durable removal outcome.
- Existing durable readers preserve supplied source IDs and legacy compatibility.
- No source lifetime continuity may be inferred solely from equal IDs.

## 32. Test Coverage Assessment

Directly covered:

- manual-event create/edit/delete and edit-ID preservation;
- profile save/load/delete and whole-state replacement;
- backup import and preview clearing;
- active-state rehydration/normalization;
- clear/reset runtime and durable outcomes;
- V1 identity equality across deterministic regeneration and overlapping windows;
- candidate scheduled/unplaced propagation, revision preservation, and snapshot cloning;
- representative UI creation for setup sources and sequence entries.

Gaps:

- no direct contract tests for source-ID uniqueness;
- no duplicate-ID rejection tests because rejection does not exist;
- no explicit delete/recreate test asserting reused IDs for setup sources;
- no tests defining whether profile/backup restoration is same incarnation;
- no tests for timestamp collision in manual-event creation;
- no lifecycle tests spanning old occurrence references across clear/import/profile replacement;
- no source-incarnation or tombstone tests because those concepts do not exist.

No tests were added; this task did not authorize executable changes.

## 33. Architectural Alignment Assessment

The current architecture correctly separates runtime semantic occurrence equality from durable identity. Task 2.10 did not overclaim V1 safety. This investigation sharpens the boundary: authority is snapshot-based, identity is ID-based, and historical continuity is unrepresented. The principal misalignment risk is future code treating V1 as a durable reference without first resolving source lifecycle semantics.

## 34. Open Questions

- Should profile/backup restoration restore the same incarnation or create a new active incarnation?
- Should ordinary recurrence-rule changes preserve occurrence lineage or invalidate prior occurrences?
- What namespace must source uniqueness cover: source type, user, profile, backup lineage, or installation?
- Must session-only decisions survive setup edits, profile loads, or backup imports?
- How should legacy durable sources receive incarnation identity without falsely asserting history?
- Should imported duplicate IDs be rejected, remapped, or retained with explicit ambiguity?

## 35. Recommended Follow-Up

Before implementing durable PlanDecision or any durable occurrence reference, create a bounded architectural task that selects source-lifecycle semantics and a durable incarnation model. It should define uniqueness scopes, creation ownership, delete/recreate behavior, profile/backup restoration meaning, legacy migration, duplicate handling, and the Version 2 occurrence-identity contract. A smaller prerequisite may first eliminate length-derived duplicate creation and establish source-ID uniqueness, but that alone must not be represented as full incarnation semantics.

## 36. Deviations

None. No production code, tests, public types, persistence formats, governance files, checkpoints, or unrelated documentation were changed. Only this required result artifact was created.

## 37. Discoveries and Deferred Work

The strongest concrete discovery is that deleting a non-final setup item can make the next length-derived ID equal an existing item's ID. Duplicate acceptance then produces source lookup overwrite or generated-identity ambiguity. Fixing that is important but was not authorized here. Source incarnation, durable IDs, migrations, PlanDecision, and identity Version 2 remain deferred.

## 38. Validation

- Supplied task hash and completeness: passed.
- Saved-copy comparison: semantically identical; final-newline-only byte difference recorded.
- Production source creation/deletion/replacement/import/identity reference audit: completed.
- Executable files changed by Task 2.11: no.
- Governance files changed by Task 2.11: no.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed — 24 test files, 394 tests.
- `npm run build`: passed — production bundle generated successfully.
- Pre-existing cumulative worktree changes from earlier tasks remained present and untouched.

## 39. Final Completion Determination

Task 2.11 is complete. DayFrame now has an evidence-grounded documented contract: current sources have no explicit incarnation; equal source IDs and equal V1 occurrence identities do not prove continuous lifetime; V1 remains adequate for bounded current runtime preview behavior; and incarnation semantics are required before durable occurrence references or durable PlanDecision state. No unauthorized implementation change was made.
