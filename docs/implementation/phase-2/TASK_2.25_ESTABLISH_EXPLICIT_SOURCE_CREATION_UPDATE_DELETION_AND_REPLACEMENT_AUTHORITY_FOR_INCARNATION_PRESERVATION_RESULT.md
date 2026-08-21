# Task 2.25 Result — Explicit Source Lifecycle-Operation Authority

## 1. Executive Result

Implemented explicit transient lifecycle-operation authority for every supported interactive authored-source workflow. Setup now carries source-level `create`, `update`, and `delete` provenance through its existing atomic commit; the model also defines explicit `replace`. Same-ID delete/recreate reaches the store as delete + create, including nested work sources. Manual events now use explicit lifecycle-aware create/update/delete/replace mutations. No incarnation or durable-format behavior was added.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/ddbb4b8e-6c92-4c80-8136-ea8ffd0ebe11/pasted-text.txt`
- Saved copy: `docs/implementation/phase-2/TASK_2.25_ESTABLISH_EXPLICIT_SOURCE_CREATION_UPDATE_DELETION_AND_REPLACEMENT_AUTHORITY_FOR_INCARNATION_PRESERVATION.md`
- Both SHA-256: `e702dc56aeadc82edc914ed7adf51f3115f161cbbc60f0ae8638deeedd966ab5`
- Supplied size: 1,027 lines, 33,558 bytes.
- The copies were byte-identical, complete, contained the required ending, and remained unchanged.

## 3. Evidence Reviewed

Traced all Setup creation/edit/deletion handlers, readable ID allocation, draft construction, atomic commit, manual-event workflow, store setters, initialization, persistence, profile/backup/recovery/clear boundaries, validation, nested cycle structure, and production/test API references. Task 2.24 was the governing architecture.

## 4. Implementation Completed

- Added a transient authored-source reference and lifecycle-operation vocabulary.
- Added a lifecycle-aware atomic Setup transaction API.
- Added draft-local created/deleted provenance and deterministic transaction construction.
- Routed all Setup creation/deletion sites—including synthesized recurrence/sequence sources—through provenance helpers.
- Added store validation that explicit operations cover and agree with the previous/candidate source graphs.
- Added explicit manual-event lifecycle mutations and routed the UI through them.
- Reset provenance after commit; abandoned/rebuilt drafts naturally discard it.
- Retained snapshot APIs for compatibility/tests without claiming lifecycle awareness.

## 5. Files Changed

- `code/src/state/types.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/SetupScreen.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- `code/src/ui/tests/SetupLifecycle.test.ts` (new)
- this result artifact

Earlier cumulative Phase 2 changes in these files were preserved and are not attributed to Task 2.25.

## 6. Lifecycle Operation Model

`SourceLifecycleOperation` distinguishes `create`, `update`, `delete`, and `replace` over a typed source reference. Nested references include parent cycle ID. Duplicate/copy, if later introduced, enters as create. Restore and instantiate remain distinct artifact-ingress semantics outside ordinary Setup transactions.

## 7. Operation Authority

The Setup/manual-event workflow classifies intent at the point that knows it. The store consumes and validates the supplied classification; it does not invent create/update continuity from ID or content equality. Snapshot comparison is used only to reject contradictory or incomplete explicit claims.

## 8. Setup Draft Provenance

`SetupDraft` carries transient `created` and `deleted` source-reference sets. Existing final sources are emitted as continuity-preserving updates unless explicitly created. Creation followed by deletion within one uncommitted draft cancels out; deletion of an existing source remains recorded through commit.

All source creation/deletion sites participate: shift definitions, cycles, segments, sequence entries, templates, recurrences, default cycles, synthesized default recurrences, and sequences synthesized during mode change.

## 9. Same-ID Delete/Recreate Behavior

Deleting an existing source records delete. Recreating the same scoped ID records create without erasing delete. Transaction construction emits both operations and suppresses update. Store validation accepts that explicit pair as replacement-of-lifetime semantics even though the ID exists in both snapshots. Direct UI coverage proves final-suffix `shift_2` reuse remains delete + create.

## 10. Draft-Local Identity

No separate opaque draft ID was necessary. A scoped transient reference key (`source kind + parent cycle where needed + source ID`) indexes operation provenance, while the created/deleted combination preserves same-key recreation. It is not persisted, exposed as source incarnation, used as React identity authority, or used by occurrence identity.

## 11. Template Semantics

Add is create; ordinary field edits remain update; delete is explicit. Template and recurrence references are recorded separately. Same-ID delete/recreate produces independent delete/create operations.

## 12. Recurrence Semantics

Each recurrence has independent provenance. Configuration edits preserve update continuity. Paired deletion/creation and a synthesized missing default recurrence are explicitly classified.

## 13. Manual-Event Semantics

The UI now calls `mutateManualEvent` with explicit create, update, or delete. Create rejects an active same ID; update/delete reject a missing source; replacement must be explicitly requested. The old array setter remains low-level snapshot compatibility/test scaffolding and makes no lifecycle claim.

## 14. Shift-Definition Semantics

Add/delete are explicitly recorded; ordinary edits remain updates. Delete/recreate with allocator-reused ID remains distinguishable. Existing cycle relationship adjustment behavior is unchanged.

## 15. Shift-Cycle Semantics

Cycle add/delete and all contained source creations/deletions are explicit. Range, mode, and ordinary configuration changes remain updates. Deleting a cycle records retirement of its contained segments and sequence entries as well.

## 16. Segment Semantics

Add/delete use cycle-scoped provenance. Ordinary configuration changes and reorder remain updates. Same scoped ID recreation remains delete + create.

## 17. Sequence-Entry Semantics

Add/remove and default sequence synthesis are explicit. Assignment/day-offset changes and reorder remain updates. Array index and day offset do not classify lifecycle.

## 18. Replacement Semantics

`replace` exists as an explicit vocabulary member for a caller that knowingly retires/replaces a source. No replacement UI was invented. Same-ID delete/recreate in current Setup is deliberately expressed as the more informative delete + create pair.

## 19. Duplication/Copy Assessment

No supported production duplicate/copy workflow was found. None was added. Future copy must enter the boundary as create (or a distinct duplicate operation normalized to create semantics).

## 20. Store Enforcement Boundary

`commitAuthoredSetupTransaction` validates non-empty IDs, parent scope for nested sources, Setup exclusion of manual events, operation/snapshot consistency, and complete lifecycle coverage. It then delegates to the existing validated atomic commit, preserving mutation ordering, persistence outcome, notification, and Preview staleness.

## 21. Snapshot API Assessment

- `commitAuthoredSetup` and collection setters: retained low-level snapshot/compatibility/test APIs; lifecycle-ambiguous by definition.
- `commitAuthoredSetupTransaction`: supported lifecycle-aware interactive Setup boundary.
- `mutateManualEvent`: supported lifecycle-aware manual-event boundary.
- profile load, backup import, recovery, initialization: full authoritative ingress/replacement boundaries with their existing distinct semantics.

No production interactive UI path uses snapshot-only Setup/manual-event APIs after this task.

## 22. Profile/Backup/Recovery Boundary Assessment

These paths remain separate from ordinary authoring operations. Profile load remains conceptual instantiate, future recovery-grade backup remains restore, V1 backup remains a later conversion/baseline concern, and active recovery remains recovery authority. No behavior or format changed.

## 23. Initialization Assessment

Persisted ingress is compatibility/bootstrap authority; injected initial state remains construction/test scaffolding. Neither is retroactively labeled as an interactive update transaction.

## 24. Clear/Reset Behavior

Clear/reset behavior is unchanged. App state synchronization rebuilds Setup draft state, and no lifecycle metadata is stored in `DayFrameState`, so old provenance cannot leak into later creation.

## 25. Draft Abandonment Behavior

Provenance lives only inside the draft. It does not mutate state while editing. Draft rebuild/replacement discards it, and successful commit clears it so a later save classifies committed sources as updates rather than replaying creates/deletes.

## 26. Persistence Boundary

No storage key, serializer, local schema, format version, profile field, backup field, or migration changed. Lifecycle transactions and draft provenance are runtime-only infrastructure and are never serialized.

## 27. Preview/Derived-State Preservation

The existing atomic commit remains responsible for marking Preview stale. Manual-event mutations retain the existing stale/regeneration behavior. Lifecycle metadata adds no derived output and no extra invalidation.

## 28. OccurrenceIdentity Preservation

`OccurrenceIdentity` V1, constructors, version, propagation, equality, coordinates, and generation behavior were untouched.

## 29. Source-Incarnation Boundary

No incarnation fields, tokens, allocators, validation, persistence, migration, artifact behavior, durable references, or PlanDecisions were introduced. The new operation transaction is precisely the transient evidence a future incarnation layer can consume.

## 30. Tests Added or Updated

- New focused lifecycle suite covers existing-source updates, independent provenance for every Setup source kind, same-ID delete/recreate, create-then-delete cancellation, and nested reorder continuity.
- UI coverage proves the atomic transaction reaches the store, default-cycle creation is explicit, final-suffix same-ID shift recreation is delete + create, and manual events call create/create/update explicitly.
- Store coverage proves incomplete Setup provenance is rejected and manual create/update/delete/replace enforce explicit source conditions.
- Existing workflow mocks/assertions were updated to observe lifecycle-aware APIs rather than snapshot scaffolding.

## 31. Reference Audit

Production references confirm `DayFrameApp` exclusively uses `commitAuthoredSetupTransaction` and `mutateManualEvent` for supported interactive authoring. All Setup source add/delete sites update provenance. Snapshot setters remain used by tests and lower-level compatibility paths but are not mislabeled. Profile, backup, recovery, clear, and initialization bypass ordinary lifecycle transactions intentionally because they own distinct ingress semantics.

## 32. Architectural Alignment Assessment

- Explicit authority: aligned; workflow intent reaches commit.
- Epistemic integrity: aligned; same ID/content never establishes continuity.
- Determinism: aligned; scoped references and explicit operations ignore array ordering.
- Separation: aligned; provenance is distinct from IDs, incarnation, occurrences, persistence, Preview, and decisions.
- Compatibility: aligned; durable formats and legacy readers are unchanged.
- Atomic ownership: aligned; no per-field store commits were introduced.

## 33. Deviations

None.

## 34. Discoveries and Deferred Work

Setup can synthesize recurrence and sequence sources during draft construction/mode changes; these also required creation provenance and are covered. Snapshot setters remain necessarily ambiguous and should not become future incarnation-authoring APIs. Concrete source identity fields, format versions, migration atomicity, restore/instantiate execution, durable references, and PlanDecision behavior remain deferred.

## 35. Recommended Next Task

Define the durable source-identity data model and independently versioned active/profile/backup format evolution required for incarnation, including migration and recovery contracts, before adding source fields.

## 36. Validation

- Focused lifecycle/state/UI run: 3 files, 239 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Full Vitest suite: 27 files, 481 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed after result creation.
- Immutable task artifact: unchanged at the hash above.

## 37. Final Completion Determination

Task 2.25 is complete. Every supported interactive authored-source workflow now preserves explicit lifecycle-operation authority through its authoritative commit boundary, including same-ID delete/recreate, independent template/recurrence provenance, nested work sources, and manual events. Existing persistence, Preview, occurrence identity, artifact ingress, recovery, and scheduling behavior remain intact; no source incarnation, durable reference, or PlanDecision implementation was added.

**Task 2.25 is complete when DayFrame explicitly preserves authored-source creation, update, deletion, and replacement authority through every supported authoring workflow and authoritative commit boundary—including same-ID delete/recreate and nested work sources—without inferring lifecycle continuity from final snapshots, while preserving existing persistence, Preview, occurrence-identity, profile, backup, recovery, and scheduling behavior and without implementing source incarnation, durable occurrence references, or PlanDecision persistence.**
