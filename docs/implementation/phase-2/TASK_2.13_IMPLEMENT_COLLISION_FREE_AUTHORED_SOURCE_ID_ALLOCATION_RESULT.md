# Task 2.13 Result — Collision-Free Authored Source-ID Allocation

## 1. Executive Result

Completed. Every supported interactive identity-bearing authored-source creation path now uses one shared pure allocator and returns an ID not occupied in its applicable active scope. Existing readable naming, edit behavior, store APIs, durable formats, historical ingress, occurrence identity Version 1, and source-incarnation boundaries remain unchanged.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/44655e1d-5de9-46cd-b158-129fb65f9254/pasted-text.txt`
- Saved project copy: `docs/implementation/phase-2/TASK_2.13_IMPLEMENT_COLLISION_FREE_AUTHORED_SOURCE_ID_ALLOCATION.md`
- SHA-256 for both: `b5e3d3b1046292778bcf928b7028626a882b75232abb934b3cc82458476ba97c`
- Supplied size: 1,141 lines, 26,950 bytes
- Byte comparison: identical.
- Completeness and prescribed final sentence were verified before implementation. Neither specification copy was modified.

## 3. Implementation Completed

Added the allocator, routed shift/cycle/segment/sequence/template/recurrence/manual-event creation through it, covered Setup's missing-recurrence fallback, and added unit and workflow regression tests for gaps, middle/final deletion, paired-ID collisions, common nested scope, identical timestamps, and edit preservation.

## 4. Files Changed

Task-owned changes:

- `code/src/core/authored/allocateReadableSourceId.ts` — new allocator.
- `code/src/core/authored/tests/allocateReadableSourceId.test.ts` — new unit coverage.
- `code/src/ui/SetupScreen.tsx` — interactive Setup allocation integration.
- `code/src/ui/DayFrameApp.tsx` — manual-event allocation integration.
- `code/src/ui/tests/DayFrameApp.test.tsx` — workflow coverage.
- this result artifact.

Pre-existing cumulative Phase 2 worktree changes were preserved.

## 5. Shared Allocator Design

`allocateReadableSourceId` is deterministic and pure. It accepts a prefix, iterable of occupied IDs, optional numeric padding, and optional preferred ID. It performs no mutation, object creation, validation, persistence, storage access, or UI/store inspection.

## 6. Allocation Ownership

Creating workflows collect their current occupied scope and call the shared core helper. The helper owns candidate selection only. Setup and manual-event workflows continue to own domain-object creation.

## 7. Numeric Allocation Contract

For numeric families, the allocator recognizes exact `prefix + digits` IDs, finds the greatest numeric suffix, selects max-plus-one, applies requested padding, and verifies the final candidate is not occupied. Examples: `shift_1, shift_3 → shift_4`; `cycle_001, cycle_003 → cycle_004`.

## 8. Irregular-ID Handling

Irregular IDs do not influence numeric maximum selection unless they exactly match the requested family. They remain in the occupied set and are neither rejected nor rewritten.

## 9. Duplicate-Occupied-Input Handling

Occupied input is normalized to a set. Existing duplicate data is not repaired; its value remains unavailable for new allocation.

## 10. Shift Definition Integration

New definitions use the active draft's shift-definition IDs with prefix `shift_`. Middle deletion followed by creation advances above the surviving maximum; final-suffix deletion may reuse the now-free maximum-plus-one value.

## 11. Shift Cycle Integration

New cycles use active draft cycle IDs and preserve three-digit `cycle_###` formatting. Default first-run draft cycle construction uses the same helper.

## 12. Segment Integration

New segments use `segment_#` allocation within their containing cycle and consider both current segments and sequence entries occupied.

## 13. Sequence-Entry Integration

New entries use `sequence_day_#` allocation within their containing cycle and consider both sequence entries and segments occupied. Day-offset behavior is unchanged.

## 14. Common Work-Entry Namespace

Segment and sequence-entry allocators receive the union of both ID collections for their containing cycle. IDs in other cycles are intentionally outside that scope.

## 15. Template Integration

New templates use active draft template IDs and retain `template_#` formatting. Middle gaps are not filled when a larger recognized suffix survives.

## 16. Recurrence Integration

Paired recurrences prefer `rec_<final-template-id>`. If occupied, deterministic `_2`, `_3`, and later variants are selected. Linkage always uses the final allocated template ID. Setup's fallback recurrence creation for an existing template also checks all active recurrence IDs.

## 17. Manual-Event Integration

New manual events prefer the existing `manual_event_<ISO timestamp>` value and check all current manual-event IDs. Editing bypasses allocation and retains the existing ID.

## 18. Manual-Event Timestamp Collision Handling

If the preferred timestamp ID exists, the allocator selects the first unused deterministic numeric variant, beginning with `_2`. A frozen-clock workflow test creates two events with one timestamp and verifies distinct IDs.

## 19. Edit-ID Preservation

Setup edit paths remain immutable object updates using existing IDs. Manual-event editing continues to use `editingManualEventId`. Regression coverage verifies manual-event edit preservation.

## 20. Delete / Recreate Semantics

No tombstone, counter, or historical reservation was added. Deleting a middle source cannot collide with a surviving later suffix. Deleting the highest suffix may allow its later reuse, as explicitly authorized for active uniqueness rather than incarnation safety.

## 21. Setup Draft Integration

Allocation occurs inside existing draft update workflows using draft-local occupied IDs. No save is required to reserve an ID against other objects already present in that draft.

## 22. Atomic Commit Preservation

Setup continues to commit complete authored arrays atomically. Allocation changes only the IDs assigned during new draft object creation.

## 23. Store Boundary Preservation

No store allocation API, duplicate rejection, setter validation, mutation ordering, or result behavior was added or changed.

## 24. Persistence Preservation

No active-state field, serialization logic, storage key, version, reader, normalization rule, or migration changed.

## 25. Profile / Backup Preservation

Profile load and backup import continue preserving supplied IDs. Neither path invokes the allocator. Profile and backup formats remain unchanged.

## 26. OccurrenceIdentity Preservation

`OCCURRENCE_IDENTITY_VERSION` remains 1 and its type, constructors, equality components, propagation, and runtime IDs are unchanged.

## 27. Source-Incarnation Boundary

The implementation guarantees only that a newly created source avoids IDs occupied in its current scope. It does not guarantee that the ID never existed historically, distinguish restored/recreated lifetimes, or make occurrence identity durable-reference safe.

## 28. Tests Added or Updated

Added five allocator unit tests and four UI workflow tests:

- numeric max-plus-one;
- zero-padding;
- irregular IDs;
- duplicate occupied input;
- preferred-ID collision suffixes;
- Setup middle-delete creation plus shift/cycle/segment/template/recurrence integration;
- final-suffix shift reuse without active collision;
- common segment/sequence namespace;
- identical manual-event timestamps and edit-ID preservation.

## 29. Production Reference Audit

Audited every production literal/helper creating in-scope IDs. Shift definitions, both cycle constructors, default/new segments and sequence entries, templates, paired/default recurrences, and manual events are covered. New-cycle default segment/sequence IDs start in an empty cycle-local scope and use distinct readable families. No in-scope interactive length-derived collision path remains.

## 30. Compatibility Assessment

Existing authored IDs and valid user data are unchanged. Newly created IDs differ only when necessary under max-plus-one or collision handling. Irregular and duplicate historical inputs are left untouched. No schema or migration is required.

## 31. Architectural Alignment Improvement

Allocation correctness is now centralized in a small pure core boundary while creation remains in its existing draft/application workflows. This removes simultaneous collision creation without coupling allocation to state mutation, persistence, ingress compatibility, or future lifetime identity.

## 32. Deviations

None.

## 33. Discoveries and Deferred Work

Setup can synthesize a default recurrence when a persisted template has no matching recurrence; that interactive fallback was included because its prior deterministic ID could collide. Store-level uniqueness validation, historical duplicate recovery, relationship validation, source incarnation, durable occurrence references, and PlanDecision remain deferred.

## 34. Recommended Next Task

Define and implement pure authored-snapshot uniqueness/relationship validation for new store mutations, while explicitly excluding local/profile/backup historical ingress until its compatibility recovery contract is authorized.

## 35. Validation

- Allocator unit tests: 5 passed.
- Focused allocator/UI run: 2 files, 88 tests passed; the UI file contained 83 tests, including 4 new allocation workflows.
- ESLint: passed.
- TypeScript typecheck: passed.
- Full Vitest suite: 25 files, 403 tests passed.
- Production build: passed; 45 modules transformed.
- Affected-scope `git diff --check`: passed.
- Specification hash and immutability: confirmed.
- Governance documents changed: none.
- Durable formats, store duplicate rejection, source incarnation, and PlanDecision behavior changed: none.

## 36. Final Completion Determination

Task 2.13 is complete. All supported interactive identity-bearing source creation is routed through one shared pure collision-free allocator; active ID collisions are prevented within the adopted scopes; readable conventions and edit behavior are preserved; historical data is not rewritten; and all focused and repository-standard validation passed.
