# Task 2.10 Result — Explicit Versioned Occurrence Identity

## 1. Executive Result

Completed. DayFrame now assigns structured, versioned runtime semantic identities to supported template, work, and manual-event occurrences and preserves them through preview transformations without adding PlanDecision behavior.

## 2. Artifact Integrity

The immutable task artifact was verified before implementation. It contained every required section and the prescribed final completion sentence. SHA-256: `7d2d91453a970dd50c53a4bb68c4d5f6b237815a2389345b02e66dffea3f6b71` (1,415 lines; 33,218 bytes).

## 3. Implementation Completed

Introduced the identity model and constructors; populated identities at authoritative generation boundaries; propagated them through placement, revisions, preview cloning, and store snapshots; and added direct behavioral coverage.

## 4. Files Changed

Task-owned changes:

- `code/src/core/occurrences/occurrenceIdentity.ts`
- `code/src/core/occurrences/tests/occurrenceIdentity.test.ts`
- `code/src/core/blocks/types.ts`
- `code/src/core/blocks/generateBlockCandidates.ts`
- `code/src/core/blocks/placeBlockCandidates.ts`
- `code/src/core/blocks/tests/generateBlockCandidates.test.ts`
- `code/src/core/blocks/tests/placeBlockCandidates.test.ts`
- `code/src/core/shifts/types.ts`
- `code/src/core/cycles/generateCycleWorkBlocks.ts`
- `code/src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts`
- `code/src/core/engine/generateSchedulePreview.ts`
- `code/src/core/engine/reviseSchedulePreview.ts`
- `code/src/core/engine/tests/generateSchedulePreview.test.ts`
- `code/src/core/engine/tests/reviseSchedulePreview.test.ts`
- `code/src/core/friction/applySuggestedFix.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- this result artifact.

Pre-existing cumulative changes in the shared worktree were preserved.

## 5. Occurrence Identity Type

`OccurrenceIdentity` is a discriminated union of template, work, and manual-event identity records. It is structured data rather than a concatenated opaque key.

## 6. Version Contract

All identities carry `version: 1`, sourced from `OCCURRENCE_IDENTITY_VERSION`.

## 7. Source-Kind Contract

The discriminator is `sourceKind`, with supported values `template`, `work`, and `manualEvent`.

## 8. Template Identity

Template identities include template ID, recurrence ID, recurrence frequency, canonical recurrence scope, and stable slot.

## 9. Daily Identity

Daily identities use `scopeKind: userDay`, the canonical `userDayDate`, and slot `0`.

## 10. Specific-Weekday Identity

Specific-weekday identities use the matching canonical `userDayDate` and slot `0`.

## 11. Weekly Identity

Weekly identities use `scopeKind: userWeek`, canonical `userWeekStartDate`, and slot `0`.

## 12. `timesPerUserWeek` Slot Identity

Slots are assigned from the canonical weekly expansion before planning-window clipping. A clipped first occurrence therefore does not renumber later occurrences.

## 13. Work Identity

Cycle-generated work identities contain cycle ID, segment/sequence-entry ID, shift-definition ID, local start date, and slot `0`. This is the strongest defensible identity at the current source boundary.

## 14. Manual-Event Identity

Manual projections use the authored manual-event ID and retain the existing runtime projection ID.

## 15. Candidate Propagation

Supported generated candidates receive identities at construction.

## 16. Scheduled Propagation

Candidate-to-scheduled placement copies the semantic identity into a distinct object.

## 17. Unplaced Propagation

Unplaced candidates retain the original identity and object as part of the unchanged candidate.

## 18. Revision Preservation

Suggested-fix and preview-revision paths preserve identities; cloning paths clone the structured value.

## 19. Preview Propagation

Generated work blocks, candidates, scheduled blocks, and unplaced candidates carry identities through preview results and store snapshots.

## 20. Runtime ID Preservation

Existing candidate, work-block, scheduled-block, and manual-event projection `id` values were not changed.

## 21. Deterministic Regeneration

Equivalent authoritative inputs produce structurally equal identities across regeneration.

## 22. Overlapping-Window Stability

Daily, specific-weekday, weekly, and N-per-week shared occurrences retain equal identities across overlapping preview windows.

## 23. Placement / Overnight Independence

Template identity is independent of placement time. Work identity uses local shift start date, so overnight end-date behavior does not alter identity.

## 24. Clone/Snapshot Preservation

Preview and store clone boundaries copy identity objects. Tests verify returned snapshot mutation cannot alter store-owned identity state.

## 25. Persistence Boundary

Identity remains preview/runtime metadata. A local-storage assertion verifies `occurrenceIdentity` is absent from authored-state persistence.

## 26. Profile / Backup Preservation

No profile, backup, import/export, or durable schema was changed.

## 27. Source-Incarnation Limitation

Authored source IDs can currently be deleted and reused. Version 1 identity therefore cannot distinguish separate incarnations that reuse the same source IDs.

## 28. Durable Foreign-Key Readiness

These identities are safe for runtime semantic equality only. They are explicitly not durable foreign keys until source-incarnation semantics and a durable migration contract are established.

## 29. Tests Added or Updated

Coverage includes all supported recurrence frequencies, partial recurrence bounds, canonical N-per-week slots, overlapping windows, deterministic regeneration, manual events, cycle work, overnight work, scheduled/unplaced propagation, revision preservation, snapshot isolation, runtime-ID preservation, and non-persistence.

## 30. Reference Audit

Production references were audited across generation, placement, suggested-fix handling, preview revision, preview cloning, and store snapshot cloning. No PlanDecision reference or persistence serialization was introduced.

## 31. Architectural Alignment Improvement

Semantic occurrence identity is now explicit and orthogonal to presentation/runtime IDs, providing a stable comparison primitive for future decision work without prematurely implementing that work.

## 32. Deviations

None from authorized behavior. Identity fields are optional on shared draft interfaces to preserve compatibility with existing hand-constructed callers and fixtures; all supported production generation paths populate them.

## 33. Discoveries and Deferred Work

The lower-level generic work-block generator lacks cycle/segment context, so work identity is attached at the authoritative cycle-generation boundary. Source incarnation, durable identity, migration, and PlanDecision semantics remain deferred.

## 34. Recommended Next Task

Define source-incarnation semantics and deletion/recreation behavior before any durable reference adopts occurrence identity; separately define PlanDecision behavior only under its own authorized task.

## 35. Validation

- Artifact integrity: passed.
- TypeScript typecheck: passed.
- ESLint: passed.
- Full Vitest suite: 24 files, 394 tests passed.
- Production build: passed (Vite, 44 modules transformed).
- Reference and persistence-boundary audit: passed.

## 36. Final Completion Determination

Task 2.10 is complete. Explicit versioned occurrence identity exists for all supported production occurrence sources, is stable across canonical regeneration and preview transformations, preserves current runtime and durable behavior, and has direct regression coverage.
