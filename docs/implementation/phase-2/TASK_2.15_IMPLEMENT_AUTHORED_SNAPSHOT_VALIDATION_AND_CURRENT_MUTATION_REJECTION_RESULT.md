# Task 2.15 — Implement Authored-Snapshot Validation and Current-Mutation Rejection — Result

## 1. Executive Result

Completed. DayFrame now validates every complete candidate authored snapshot before a current authored mutation may become runtime authority. Invalid candidates return an explicit rejected result and have no runtime, Preview, persistence, durability, desired-condition, or subscriber effects. Valid mutations retain the existing session-first persistence semantics.

## 2. Artifact Integrity

The supplied task artifact and the saved immutable execution copy were byte-identical before implementation. SHA-256: `95c99886272ead90e975585791edb45a1288f8e665e8fa7afb903571afd29c94`. The saved artifact contained all required sections, was 40,325 bytes / 1,706 lines, and ended with the required completion sentence. It was not modified during execution.

## 3. Implementation Completed

Added a pure authored-snapshot validator, enforced it at all current store mutation boundaries, introduced applied/rejected mutation outcomes, adapted production workflows, and added focused validator, store, and UI coverage.

## 4. Files Changed

Task-specific implementation files:

- `code/src/core/authored/validateDayFrameAuthoredSetup.ts` (new)
- `code/src/core/authored/tests/validateDayFrameAuthoredSetup.test.ts` (new)
- `code/src/state/types.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/durabilitySemantics.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- this result artifact

The worktree also contains cumulative user-owned work from earlier Phase 2 tasks; it was preserved.

## 5. Validator Architecture

`validateDayFrameAuthoredSetup` is a side-effect-free function over one complete `DayFrameAuthoredSetup`. It does not normalize, mutate, persist, notify, generate Preview, or depend on store state.

## 6. Validation Result Contract

The discriminated result is either `{ status: "valid", advisories }` or `{ status: "invalid", issues, advisories }`. Blocking invalidity and accepted unsupported intent are distinct.

## 7. Issue Model / Deterministic Ordering

Issues expose stable codes, classification, structural path, source kind, and optional source/reference IDs. Validation traverses surfaces and entries in a fixed order; overlap checks use stable date/ID/index ordering. Repeated validation produces equal results.

## 8. ID Uniqueness Validation

Nonempty, unique IDs are enforced independently for shift definitions, cycles, templates, recurrences, and manual events. Cycle-local segment and sequence IDs share one uniqueness namespace.

## 9. Shift Definition Validation

Shift times must parse, workdays must be nonempty/recognized/unique, and `crossesMidnight` must agree with the time relationship.

## 10. Shift Relationship Validation

Every segment and non-off sequence entry must reference an existing shift definition. Validation includes inactive/dormant structures.

## 11. Cycle Validation

Cycle type/mode, real date bounds, ordered dates, repeating-sequence anchor/completeness, and cross-cycle non-overlap are enforced.

## 12. Segment Validation

Segments require valid ordered dates contained by their parent cycle, matching parent-cycle IDs, valid definition references, valid overrides, and no overlap within the cycle.

## 13. Sequence Validation

Sequence offsets must be nonnegative unique integers forming a contiguous zero-based sequence. Entry IDs and definition references are validated even when manual-segment mode is active.

## 14. Template Validation

Every template, including disabled templates, is checked through the existing template domain validator. Exceptions are converted to deterministic invalid-template issues rather than escaping.

## 15. Recurrence Relationship Validation

Every recurrence requires a valid template reference, recognized frequency, valid frequency-specific parameters, and valid ordered optional date bounds.

## 16. Template-Without-Recurrence Preservation

Templates without recurrences remain valid.

## 17. Supported Recurrence Validation

Daily and weekly intent is accepted without extra parameters; specific-weekday intent requires nonempty unique recognized weekdays; times-per-user-week requires a positive integer. Multiple recurrences for one template remain accepted.

## 18. Unsupported Recurrence Advisories

`perShiftSegment` and `custom` are accepted as valid declared intent and produce deterministic `unsupportedRecurrenceFrequency` advisories. They are not normalized or rejected. The existing generation path does not throw for these cases, so no additional Preview guard was necessary.

## 19. Scheduling Preference Validation

The day-boundary time and week-start weekday must be structurally valid.

## 20. Preview Range Validation

Preset/source values, real local dates, and start-before-or-equal-to-end ordering are enforced. Coverage and missing cycle-source warnings remain outside blocking validation.

## 21. Manual Event Validation

Manual events require a nonblank title, real user-day date, boolean all-day marker, consistent all-day/timed shape, valid timed values, and valid optional notes. Overnight timed events remain accepted.

## 22. Complete Candidate Derivation

The store derives a complete candidate by combining the proposed surface with all unchanged authored surfaces before validation. Complete Setup commits are validated as one atomic candidate.

## 23. Setup Commit Enforcement

`commitAuthoredSetup` validates before assigning runtime state, staling Preview, retaining durable intent, persisting, or notifying.

## 24. Narrow Setter Enforcement

Scheduling preferences, Preview range, shift definitions, cycles, templates, and recurrences all validate their full derived candidate before mutation.

## 25. Manual Event Enforcement

`setManualEvents` uses the same complete-candidate boundary. UI create/update/delete flows explicitly branch on rejection.

## 26. Store Mutation Result Migration

Current authored mutation results are now a discriminated union: `status: "applied"` with state/persistence, or `status: "rejected"`, `reason: "invalidAuthoredState"`, and the invalid validation result. Historical profile/backup results retain their prior persistence-result contract.

## 27. Applied Mutation Semantics

Applied mutations continue to install the valid runtime state first, retain desired durable intent, attempt persistence, update durability knowledge, notify, and return the resulting state and persistence outcome.

## 28. Rejected Mutation Semantics

Rejected mutations return validation evidence immediately and perform no mutation-side work.

## 29. Preview Preservation On Rejection

Store tests prove an existing Preview remains byte-for-byte unchanged and is not marked stale when a candidate is rejected.

## 30. Persistence / Durability Preservation On Rejection

Store tests prove no storage accessor call occurs and durability status plus desired durable conditions remain unchanged.

## 31. Subscriber Preservation On Rejection

Store tests prove neither state subscribers nor durability subscribers are notified.

## 32. Production Caller Migration

A production reference audit found current authored mutations only in `DayFrameApp`; Setup and manual-event callers now narrow on `status` before accessing state or classifying durability. No rejection is passed to the durability classifier.

## 33. Setup Workflow Handling

Rejected Setup saves remain in Setup, show a minimal truthful validation message, and do not show persistence-failure feedback.

## 34. Generate Preview Rejection Handling

Generate Preview returns immediately when the preceding Setup commit is rejected. A UI test proves the app remains in Setup, authored authority is unchanged, and Preview is not generated.

## 35. Manual Event Workflow Handling

Rejected manual-event create/update/delete operations show local validation feedback and do not update editor state or regenerate Preview.

## 36. Validation / Durability Separation

Validation rejection has no persistence outcome. Persistence classification accepts only results that actually contain persistence outcomes, preserving the conceptual and type-level boundary.

## 37. Historical Ingress Exclusion

Local rehydration, seeded construction, and historical ingress normalization were not wired to the new current-mutation validator.

## 38. Profile / Backup Preservation

Profile load/save/delete and backup import/export formats and acceptance behavior were not changed. Their existing persistence results remain intact.

## 39. OccurrenceIdentity Preservation

Occurrence identity remains V1 and unchanged.

## 40. Source-Incarnation Boundary

No source-incarnation field or behavior was introduced; the topic remains unresolved as required.

## 41. Tests Added or Updated

Added 10 pure validator tests covering valid purity/determinism, ID collisions, references, dormant structures, containment/overlap, template/recurrence rules, advisories, preferences/range, and manual-event shapes. Added store tests for complete rejection side-effect absence, narrow orphan-deletion rejection versus atomic deletion, and accepted advisory intent. Updated existing store/UI fixtures to propose valid atomic snapshots and added a rejected Generate Preview workflow test.

## 42. Production Reference Audit

`rg` confirmed all eight current authored store methods are defined at the guarded store boundary; the only production invocations are Setup commit and manual-event mutations in `DayFrameApp`. Every mutation-result durability classification occurs after applied narrowing for the new union. Historical profile/backup classifications remain on their unchanged persistence result type.

## 43. Compatibility Assessment

Valid current mutations preserve runtime ordering, persistence behavior, subscriber payloads, and UI behavior. Newly rejected cases are precisely candidates that violate the adopted authored-authority contract. Historical ingestion remains permissive and unchanged.

## 44. Architectural Alignment Improvement

The runtime authority transition is now explicit: derive complete candidate → validate → either atomically apply or reject without effects. Invalid partial relationships can no longer become current session authority through narrow setters.

## 45. Deviations

None.

## 46. Discoveries and Deferred Work

Several legacy UI tests used narrow setters to assemble temporarily inconsistent fixtures; those fixtures were moved to seeded construction or atomic complete commits, consistent with the established boundary. Rich issue presentation, historical-ingress validation/migration, recurrence implementation, source incarnation, and PlanDecision remain deferred.

## 47. Recommended Next Task

Define a separate historical-ingress validation and migration policy that can report or repair legacy snapshots without conflating that policy with current mutation acceptance.

## 48. Validation

- Initial validator/store focus: 2 files passed, 104 tests passed (10 validator, 94 store).
- Affected workflow focus: `DayFrameApp` 84 tests passed; durability semantics 28 tests passed in the earlier combined workflow run (the UI suite subsequently gained the rejection test).
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed with 26 files / 417 tests.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed.
- Artifact SHA-256 and immutability: confirmed as recorded in section 2.
- No historical-ingress, durable-format, governance, source-incarnation, occurrence-identity, or PlanDecision policy changed.

## 49. Final Completion Determination

Task 2.15 is complete. The store now admits only validated complete authored snapshots as current authority, distinguishes accepted unsupported intent from blocking invalidity, rejects invalid candidates without side effects, preserves all explicitly excluded boundaries, and is directly protected by focused and workflow tests.
