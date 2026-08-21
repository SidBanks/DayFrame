# Task 2.12 Result — Authored Source-ID Uniqueness and Creation Authority

## 1. Executive Determination

**Recommended contract:** every identity-bearing authored source ID must be unique within its defined current authored-snapshot scope. ID allocation should be performed by a shared pure authored-source allocator invoked by the workflow creating the object. Newly authored state should be validated at both draft creation/commit and store mutation boundaries. Historical local, profile, and backup ingress must be detected and handled by a separate compatibility/recovery boundary without silent remapping.

This contract addresses simultaneous active aliasing only. It does not make IDs lifetime-unique, establish source incarnation, or make Version 1 occurrence identity safe as a durable foreign key.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/e9624229-225a-4409-b7c7-be6a399e752e/pasted-text.txt`
- Saved project copy: `docs/implementation/phase-2/Task_2.12_ESTABLISH_AUTHORED_SOURCE-ID_UNIQUENESS_AND_CREATION_AUTHORITY.md`
- SHA-256 for both: `8b319d9ad8101373b969b7bea9c4938b7976702842a99666dd000f6e6b29ef46`
- Size: 1,199 lines, 31,247 bytes
- Byte comparison: identical. **Confirmed.**
- Completeness and prescribed final sentence: verified. Neither artifact was modified.

## 3. Evidence Reviewed

**Confirmed:** production source types; Setup creation/edit/delete logic; manual-event workflows; store setters and atomic setup commit; initialization and local-storage rehydration; profile validation/load; backup validation/import; clear/reset; cycle validation; template and shift-definition lookup maps; recurrence, work, and manual-event generation; Task 2.10 occurrence identity; Task 2.11 source-incarnation findings; and directly relevant state/UI/core tests.

Executable behavior took precedence over documentary intent.

## 4. Sources In Scope

`ShiftDefinition`, `ShiftCycle`, `ShiftSegment`, `ShiftCycleSequenceDay`, `BlockTemplate`, `BlockRecurrence`, and `ManualCalendarEvent`. Profile IDs were considered only as comparative evidence.

## 5. Current Creation Authority

| Source | Current production creator | Other accepted authority |
| --- | --- | --- |
| Shift definition | `SetupScreen` | Store callers, initial state, persistence/profile/backup ingress |
| Shift cycle | `SetupScreen` draft helper | Same replacement/ingress paths |
| Segment | `SetupScreen`, within cycle draft | Supplied cycle graphs |
| Sequence entry | `SetupScreen`, within cycle draft | Supplied cycle graphs |
| Template | `SetupScreen` | Replacement/ingress paths |
| Recurrence | `SetupScreen`, paired/default helper | Replacement/ingress paths |
| Manual event | `DayFrameApp` workflow | Store callers and ingress paths |

**Confirmed:** allocation is currently split between UI components. The store owns mutation/persistence but allocates none of these source IDs. Core/domain helpers do not own allocation.

## 6. Current ID Algorithms

| Source | Algorithm | Actual guarantee |
| --- | --- | --- |
| Shift definition | `shift_${current length + 1}` | None beyond common append-only cases |
| Shift cycle | `cycle_${pad(current length + 1)}` | Same |
| Segment | `segment_${current length + 1}` | Same within current cycle |
| Sequence entry | `sequence_day_${current length + 1}` | Same within current cycle |
| Template | `template_${current length + 1}` | Same |
| New paired recurrence | `rec_template_${current length + 1}` | Same |
| Default recurrence | `rec_${templateId}` | Deterministic, not collision-checked |
| Manual event | `manual_event_${ISO timestamp}` | Collision-resistant in normal use, not guaranteed or checked |

IDs supplied through state, local storage, profiles, and backups are preserved. **Confirmed.**

## 7. Interactive Collision Analysis

- Delete final item: the next length-based allocation reuses the deleted ID. It may be actively unique but is historically reused. **Confirmed.**
- Delete middle item: if a later numbered item remains, the next allocation can equal that existing ID and create simultaneous duplicates. **Confirmed.**
- Multiple ordinary synchronous button creations: React state updates receive current draft state, so increasing length normally separates IDs. This is not an explicit uniqueness guarantee and cannot repair existing gaps/arbitrary IDs. **Inferred.**
- Sequence “remove last” then add reuses the removed suffix; duplicate offsets are independently prevented only by sequence validation. **Confirmed.**
- Manual-event timestamp IDs can collide if creation timestamps are equal or imported/caller data already contains the value; no occupied-ID check exists. **Confirmed.**

## 8. Required Uniqueness Scope

**Recommended:** uniqueness is a property of one active authored setup snapshot, scoped by source namespace:

- top-level unique within type: shift-definition, shift-cycle, block-template, block-recurrence, manual-event IDs;
- cycle-local unique work-entry namespace: segment and sequence-entry IDs should not collide within the same containing cycle, including across both collections because V1 work identity represents both through `shiftSegmentId`;
- IDs may overlap across unrelated top-level source types because links are typed and occurrence identity structurally distinguishes fields/source kind.

Uniqueness is not required across separate profiles/backups or historical snapshots. Relationship integrity is separate and also required before activation.

## 9. Shift Definition Uniqueness

**Recommended:** `ShiftDefinition.id` must be unique across active `shiftDefinitions`. Duplicate definitions are ambiguous because work generation constructs a `Map` and the last duplicate wins for all segment/sequence links. Allocation and mutation validation should enforce the scope.

## 10. Shift Cycle Uniqueness

**Recommended:** `ShiftCycle.id` must be unique across active `shiftCycles`. Current date-overlap validation can incidentally reject some duplicate-ID cycles but permits non-overlapping duplicates and does not validate IDs. Cycle ID participates in work occurrence identity and must have one active referent.

## 11. Segment / Sequence Uniqueness

**Recommended:** segment and sequence-entry IDs must be unique in a common cycle-local work-entry namespace. Current validation checks segment date overlap and sequence offsets, not IDs. A cycle mode normally activates only one collection, but a common namespace avoids lookup/identity ambiguity across mode changes and matches V1's shared `shiftSegmentId` field.

## 12. Template Uniqueness

**Recommended:** `BlockTemplate.id` must be unique across active templates. Candidate generation's template map uses last-write-wins behavior, while both duplicate objects remain authored state.

## 13. Recurrence Uniqueness

**Recommended:** `BlockRecurrence.id` must be unique across active recurrences. Distinct recurrence IDs may legitimately link to the same template; one recurrence per template is a current UI convention, not a core type invariant. Equal recurrence IDs are expanded independently and can emit equal occurrence/runtime IDs.

## 14. Manual Event Uniqueness

**Recommended:** `ManualCalendarEvent.id` must be unique across active manual events. Projection emits every duplicate, using the authored ID as both scheduled runtime ID and V1 manual occurrence identity.

## 15. Duplicate-State Classification

**Adopted classification:**

- newly authored duplicates: **B — invalid authored state that should be rejected going forward**;
- duplicates already present in local state, profiles, or backups: **C — ambiguous historical input requiring non-destructive compatibility handling**;
- same IDs in separate inactive historical snapshots: valid as snapshot-local data, but continuity between them is unresolved and incarnation-dependent.

Tolerance in current readers is not evidence that duplicates are valid.

## 16. Interactive Creation Versus Historical Ingress

Interactive creation has live access to the occupied IDs and must allocate collision-free IDs. Store mutation receives a proposed new authoritative snapshot and must reject invalid duplicates. Historical ingress may contain data written by previously permissive versions and therefore needs detection, diagnostics, and an explicit recovery decision. These boundaries must not share a simplistic “always reject” or “always preserve” policy.

## 17. Candidate Creation Authority Models

- UI scan: small but duplicates policy across workflows and keeps correctness inside components.
- Store allocation: centralized, but incompatible with unsaved Setup drafts and couples object creation to mutation/persistence.
- Shared pure allocator: centralized algorithm, works in drafts/manual workflows, deterministic and directly testable.
- Random/UUID: strong practical uniqueness but changes ID style and risks prematurely deciding lifetime/incarnation semantics.

## 18. Creation Authority Matrix

| Model | Prevents active collisions | Central authority | Works with Setup draft | Durable format change? | Incarnation-safe? | Complexity | Recommendation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| UI scan | Yes if every path is correct | No | Yes | No | No | Low initially, fragmented later | Reject |
| Store allocation | Yes | Yes | No, without redesign | No | No | Medium/high | Reject for current workflow |
| Shared pure allocator | Yes | Yes for allocation algorithm | Yes | No | No | Low/medium | **Adopt** |
| Random/UUID | Practically yes | Yes if shared | Yes | Shape no; value style yes | Not automatically | Medium | Defer to incarnation design |

## 19. Human-Readable ID Assessment

Readable IDs help debugging, fixtures, exported-backup inspection, and current expectations. They are not user-facing product identity and must not override correctness. **Recommended:** preserve existing prefixes and readable numeric suffixes for the bounded uniqueness fix because a collision-free allocator can do so without schema migration. Do not promise permanent readability or lifetime ordering.

## 20. Collision-Free Sequential Allocation Assessment

- First available gap prevents active duplicates but aggressively reuses historical IDs.
- Active max-plus-one prevents current collisions and avoids filling interior gaps, reducing immediate reuse; it can still reuse a deleted highest value and is not incarnation-safe.
- Random keys minimize practical reuse but cross into future durable/incarnation design.

**Recommended:** max-plus-one over recognized numeric suffixes, followed by an occupied-set collision check. For irregular existing IDs or a preferred timestamp base, increment/suffix until unused. This is the smallest current-snapshot guarantee and makes no lifetime claim.

## 21. Adopted Creation Authority Contract

**Recommended:** introduce a shared, pure authored-source ID allocation module. Creation workflows own the act of creating an object and call this allocator with source kind, scope, and occupied IDs. The allocator owns only deterministic collision-free selection; it does not mutate state, validate relationships, persist data, or define incarnation.

Setup and manual-event workflows must route all new source creation through it. Imported/caller-supplied objects are not “new ID allocation” and proceed through validation/compatibility boundaries instead.

## 22. Store Validation Assessment

Adopt policy **C**: store mutation boundaries validate newly authored active snapshots, while historical ingress paths handle duplicates separately.

`commitAuthoredSetup` and narrow authored collection setters should reject duplicates and broken relevant links before mutating runtime authority. Validation should be pure and centralized. Initialization, profile load, and backup import must first pass through a compatibility-aware ingress classifier; adding unconditional rejection without a recovery contract could strand existing users and is deferred.

## 23. Setup Draft Validation

Ordinary creation should be collision-free by construction. A full draft uniqueness/relationship check should also run before atomic commit as defense in depth. The user should not normally see a duplicate-ID error created by DayFrame itself. This requires no per-keystroke ID editing because IDs are not user-editable.

## 24. Manual-Event Validation

The manual-event workflow should allocate a preferred timestamp-based readable ID through the shared occupied-ID allocator, retaining the current ID on edit. `setManualEvents` should validate top-level uniqueness before mutation. Delete remains ID-based once uniqueness is guaranteed.

## 25. Persistence Normalization Assessment

Current local rehydration preserves duplicates for most source arrays. **Confirmed.** It must not silently remap them because linked references and external/durable meaning may change. A later compatibility task should detect duplicate and relationship failures before active use, preserve the raw durable checkpoint, and expose a bounded recovery outcome.

## 26. Profile Duplicate Handling

Profile normalization currently preserves duplicate source IDs. **Confirmed.** Loading such a profile should eventually be blocked from replacing valid active authority until an explicit compatibility/recovery policy is selected. The stored profile should not be silently rewritten or remapped during read.

## 27. Backup Duplicate Handling

Backup validation verifies envelope/array shape but not source uniqueness. **Confirmed.** A future import boundary should reject activation with a precise duplicate diagnostic or invoke an explicitly authorized recovery flow. Silent remapping is unsafe because backups contain linked IDs.

## 28. Historical Duplicate Compatibility

Historical duplicates are invalid for active semantic authority but may exist because prior versions accepted them. **Recommended:** preserve the original durable bytes/objects, detect and classify ambiguity, and require an explicit repair/import policy. Do not treat reader permissiveness as a permanent compatibility promise. Exact recovery UX and repair algorithms are **Deferred**.

## 29. No-Silent-Remapping Determination

**Adopted:** never silently remap duplicate source IDs during local rehydration, profile load, or backup import. Remapping one ID requires updating typed links and deciding which duplicate each link meant—information absent from ambiguous data. Automatic renaming could change generated schedules and occurrence identity while appearing successful.

## 30. Source Relationship Integrity

Uniqueness alone does not validate:

- recurrence `blockTemplateId` → exactly one template;
- segment/sequence `shiftDefinitionId` → exactly one definition (or permitted null for off-day sequence);
- segment `shiftCycleId` → its containing cycle;
- recurrence ownership conventions.

**Recommended:** the shared authored-setup validator enforce required referential integrity alongside uniqueness for new mutations. Historical ambiguous links belong to ingress recovery.

## 31. Duplicate Lookup Behavior

**Confirmed:** template and shift-definition maps are last-write-wins. Recurrences are iterated, so duplicates can generate multiple equal candidates. Manual events are all projected, so duplicates generate equal runtime/occurrence IDs. Cycle/segment validation is temporal, not identifier-based. Friction/suggested-fix maps later overwrite duplicate generated IDs. These are ambiguity symptoms, not resolution rules.

## 32. Replacement Operation Semantics

Store setters and `commitAuthoredSetup` replace collections with caller-supplied clones and currently accept duplicates. **Confirmed.** Going forward, they should validate the resulting whole authored snapshot, not only the changed collection, because cross-source links matter. Profile load and backup import are historical ingress and require the distinct policy described above.

## 33. Clear / Restore Distinction

Clear removes current active authority and occupied IDs. Creating after clear only needs uniqueness within the new snapshot and may reuse readable IDs; that remains historically ambiguous and requires incarnation semantics if old references survive. Restoring a profile/backup is ingress, not interactive allocation, and must preserve supplied IDs while checking whether the snapshot is safe to activate.

## 34. OccurrenceIdentity Implications

Active uniqueness ensures one active authored referent per component of V1 identity and removes simultaneous aliasing caused by duplicate IDs. It does not change V1 structure or equality and does not solve delete/recreate or restoration collisions across history. This strengthens runtime safety but not durable foreign-key readiness.

## 35. PlanDecision Implications

Any PlanDecision work needs active uniqueness so one decision target is not simultaneously ambiguous. Session-only decisions additionally need invalidation across replacement/delete/recreate boundaries. Durable decisions still require source-incarnation semantics. Task 2.12 therefore supplies a prerequisite, not the complete PlanDecision identity contract.

## 36. Source-Incarnation Deferral

**Deferred:** immutable creation tokens, lifetime-global IDs, UUID adoption, tombstones, restoration lineage, and occurrence identity Version 2. Max-plus-one allocation may reuse a historical high suffix and intentionally makes no incarnation guarantee.

## 37. Uniqueness Matrix

| Source | Required uniqueness scope | Current guarantee | Collision path exists? | Recommended enforcement boundary |
| --- | --- | --- | ---: | --- |
| ShiftDefinition | Active setup, within type | None | Yes | Shared allocator + authored validator/store |
| ShiftCycle | Active setup, within type | Date overlap only | Yes | Allocator + authored validator/store |
| ShiftSegment | Containing cycle work-entry namespace | Date overlap only | Yes | Allocator + cycle/authored validation |
| SequenceEntry | Containing cycle work-entry namespace | Offset uniqueness only | Yes | Allocator + cycle/authored validation |
| BlockTemplate | Active setup, within type | None | Yes | Allocator + authored validator/store |
| BlockRecurrence | Active setup, within type | None | Yes | Allocator + authored validator/store |
| ManualCalendarEvent | Active setup, within type | Timestamp convention | Yes | Allocator + setter validation |

## 38. Lifecycle Separation Matrix

| Scenario | Active uniqueness solves it? | Needs incarnation semantics? | Notes |
| --- | ---: | ---: | --- |
| Two current templates with same ID | Yes | No | Reject current snapshot |
| Delete template then recreate same ID | No | Yes for historical references | No simultaneous duplicate |
| Profile restore of prior ID | No | Yes for continuity | Ingress snapshot may itself be unique |
| Backup restore of prior ID | No | Yes | Same |
| Clear then recreate old ID | No | Yes | New snapshot can be actively valid |
| Duplicate recurrences in same snapshot | Yes | No | Reject duplicates |
| Same unique IDs across historical snapshots | No | Yes | Snapshot uniqueness says nothing about lifetime |

## 39. Ingress Policy Matrix

| Boundary | New duplicates should be allowed? | Historical duplicates may exist? | Recommended handling |
| --- | ---: | ---: | --- |
| Setup creation | No | Draft may originate from old state | Allocate safely; validate before commit |
| Manual-event creation | No | Current state may originate from old data | Allocate safely; validate mutation |
| Store setter | No | Caller may supply legacy-like data | Reject new mutation; do not silently repair |
| Setup commit | No | Draft may originate from ingress | Validate complete snapshot; report failure |
| Local rehydration | No activation guarantee yet | Yes | Detect, preserve raw data, compatibility recovery |
| Profile load | No | Yes | Detect and block/route recovery; preserve profile |
| Backup import | No | Yes | Reject activation with diagnostic or explicit recovery |

## 40. Compatibility Assessment

Changing only new interactive allocation requires no type, persisted field, profile format, backup format, migration, or occurrence-identity change. It changes only IDs chosen for newly created objects in collision-prone states. Store rejection and ingress detection are separate behavioral compatibility boundaries and should be staged with explicit outcomes and tests.

## 41. Occurrence Identity Versioning

No Version 1 change is needed merely to prevent new active duplicates. Its fields and equality semantics remain identical. A future incarnation-aware identity is expected to require a separately governed version decision.

## 42. Architectural Ownership

- ID uniqueness policy: authored-domain contract.
- ID allocation: shared pure helper, invoked by creating workflow.
- Source mutation: Setup/manual workflow and store mutation APIs, unchanged in role.
- New-snapshot duplicate and relationship validation: shared authored validator enforced at store boundary, with draft preflight.
- Historical duplicate detection/recovery: durable-data compatibility boundary.
- Persistence: serializes accepted authoritative state; it does not allocate or repair IDs.

## 43. Behavioral Invariants

- Existing valid authored IDs are never rewritten merely to adopt allocation.
- Edits preserve IDs.
- New creation never duplicates an occupied ID in its scope.
- One active ID has one referent within its source namespace.
- Historical ingress is never silently remapped.
- Active uniqueness does not imply historical identity continuity.
- No durable schema or V1 identity change is required for allocation alone.

## 44. Test Coverage Assessment

**Confirmed coverage:** ordinary Setup source creation; sequence addition; manual-event create/edit/delete; edit ID preservation; store replacement, profile load, backup import, clear/reset; canonical occurrence equality; representative missing-link failures; cycle date/offset validation.

**Not found / gaps:** create after deleting the final item; delete-middle then create; direct duplicate tests for each source; common segment/sequence namespace; duplicate link ambiguity; collision-safe timestamp allocation; Setup commit/store rejection; local/profile/backup duplicate classification; downstream runtime collision tests for all duplicate classes. No tests were added because this task is investigative.

## 45. Architectural Alignment Assessment

The adopted split keeps UI components from inventing correctness policy, keeps the store from having to construct unsaved draft objects, and prevents persistence readers from silently mutating historical identity. It aligns current-snapshot uniqueness with authoritative state while preserving the separate Task 2.11 incarnation boundary.

## 46. Open Questions

- Exact error/result type for store validation failures.
- Whether cycle segment and sequence-entry IDs should share a permanent namespace or gain distinct identity fields in a later V2 design.
- Whether local duplicate state should start in a quarantined/recovery mode or fall back to empty runtime state.
- Whether backups with duplicates should be categorically rejected or offered an explicit user-reviewed repair export.
- Whether a future incarnation design should replace readable sequential allocation entirely.

## 47. Recommended Implementation Sequence

1. Add a pure shared allocator supporting readable prefixes, numeric max-plus-one, and occupied-set fallback.
2. Route Setup shift/cycle/segment/sequence/template/recurrence and manual-event creation through it.
3. Add delete-final, delete-middle, irregular-ID, rapid-create, and timestamp-collision regression tests.
4. Add a pure complete-authored-setup uniqueness and relationship validator.
5. Enforce it for `commitAuthoredSetup` and narrow authored mutation APIs with explicit non-mutating failure behavior.
6. In a separate compatibility task, classify local/profile/backup duplicates and define recovery outcomes without silent remapping.
7. Keep source-incarnation and durable occurrence-reference design separate.

## 48. Recommended Next Task

Implement collision-free shared authored-source ID allocation for new interactive Setup and manual-event creation, preserving readable prefixes and all durable formats. Bound it to allocation and direct regression coverage; do not add store/ingress rejection in the same task unless explicitly authorized.

## 49. Deviations

None. This task changed no production code, tests, public types, persistence formats, governance documents, or checkpoints. Only the required result artifact was created.

## 50. Discoveries and Deferred Work

The common work-entry namespace requirement is newly explicit because V1 uses one `shiftSegmentId` field for manual segments and sequence entries. Store-wide relationship validation and historical duplicate recovery need their own bounded contracts. Source incarnation remains deferred.

## 51. Validation

- Artifact hashes/comparison/completeness: passed.
- Production creation and duplicate-sensitive lookup audit: completed.
- Task 2.12 executable files changed: no.
- Task 2.12 governance files changed: no.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed — 24 files, 394 tests.
- `npm run build`: passed — Vite production build, 44 modules transformed.
- Pre-existing cumulative Phase 2 worktree changes were preserved and distinguished from this result-only task.

## 52. Final Completion Determination

Task 2.12 is complete. DayFrame now has an evidence-backed active authored-source uniqueness contract and adopted creation-authority split: shared pure allocation for new objects, authored-domain validation for new authoritative snapshots, and separate non-destructive compatibility handling for historical ingress. Active uniqueness is explicitly distinct from source incarnation, no unauthorized implementation occurred, and repository validation passed.
