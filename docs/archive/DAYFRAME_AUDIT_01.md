# DayFrame Engine Audit 01 — Current-System Map

> Evidence rules: each claim cites the repository-relative file path and the named symbol or test. Line ranges reference the current workspace files.  
> Status markers: **Confirmed** = directly traced in production code or tests; **Inferred** = reasonable interpretation of code; **Not found** = repository contains no supporting implementation.  

---

## 1. Executive Findings

- The engine’s canonical preview pipeline is implemented in code and invoked from the store action `generatePreview`. **Confirmed**
  - Evidence: `generateSchedulePreview` is exported in `code/src/core/engine/generateSchedulePreview.ts` and the store calls it from `createDayFrameStore()` in `code/src/state/dayFrameStore.ts` at `function generatePreview` ([code/src/state/dayFrameStore.ts#L232]).

- Authored state is stored in the runtime `DayFrameState` inside the store created by `createDayFrameStore`; previews are derived snapshots stored in `state.preview` and are created/updated by explicit store actions invoked by the UI. **Confirmed**
  - Evidence: `DayFrameState` and store API are defined in `code/src/state/types.ts`; `createDayFrameStore` is implemented in `code/src/state/dayFrameStore.ts`. The store assigns preview in `generatePreview` ([code/src/state/dayFrameStore.ts#L232-L256]) and in `applySuggestedFixToPreview` ([code/src/state/dayFrameStore.ts#L266-L296]).

- The pipeline deterministically transforms the cloned/normalized authored setup plus planning window and scheduling preferences into a preview result object with generated work blocks, block candidates, scheduled draft blocks, unplaced candidates, and friction points. The inspection found no use of randomness or external mutable-state access in the inspected execution path; identical inputs (authored setup, planning window, scheduling preferences, and caller-supplied timestamps) will produce the same result when executed in the same JS runtime environment and timezone. **Inferred**
  - Evidence: the pipeline orchestration is in `code/src/core/engine/generateSchedulePreview.ts`; generation steps invoke modules such as `generateCycleWorkBlocks`, `generateBlockCandidates`, `placeBlockCandidates`, `detectScheduleFriction`, and `generateSuggestedFixes`. The inspection found no use of RNG or external mutable singletons within that call path. **Confirmed**
  - Determinism conditions (inferred): results are stable given identical inputs and environment (ordering of arrays, dates/timezone, and the caller-provided `generatedAt` timestamp). **Inferred**

- Friction detection and suggested-fix generation operate on preview draft state; preview revisions executed via suggested fixes are applied to the preview snapshot and do not mutate authored setup. **Confirmed**
  - Evidence: `applySuggestedFix` (preview revision implementation) is in `code/src/core/friction/applySuggestedFix.ts` ([code/src/core/friction/applySuggestedFix.ts#L15]); the store-level commit `applySuggestedFixToPreview` writes `state.preview` at the inspected production write sites ([code/src/state/dayFrameStore.ts#L266-L296]). `generatePreview` assigns/overwrites `state.preview` ([code/src/state/dayFrameStore.ts#L232-L256]).

- The UI exposes generation and preview-revision flows: `DayFrameApp` and `PreviewScreenContainer` call `store.generatePreview(...)` and `store.applySuggestedFixToPreview(...)` respectively. **Confirmed**
  - Evidence: `DayFrameApp` contains preview-generation callers ([code/src/ui/DayFrameApp.tsx#L222-L257]) and `PreviewScreen`/`PreviewScreenContainer` render suggested-fix UI wired to `applySuggestedFixToPreview`.

---

## 2. End-to-End Data Flow (summary)

- Authoring: `SetupScreen` edits the local draft; `DayFrameApp` handles the save path and calls the store setters such as `setSchedulingPreferences`, `setShiftDefinitions`, `setShiftCycles`, `setBlockTemplates`, `setBlockRecurrences`, and `setManualEvents` exposed by `createDayFrameStore`. Evidence: `code/src/ui/SetupScreen.tsx`, `code/src/ui/DayFrameApp.tsx`, and the store methods in `code/src/state/dayFrameStore.ts`. **Confirmed**

- Persistence: the store persists authored fields to localStorage via `persistState` in `code/src/state/dayFrameStore.ts` (function `persistState` at [code/src/state/dayFrameStore.ts#L398]). Persisted fields include `schedulingPreferences`, `previewRange`, `shiftDefinitions`, `shiftCycles`, `blockTemplates`, `blockRecurrences`, and `manualEvents`. `persistState` also writes a legacy `shiftCycle` snapshot when present. **Confirmed**

- Generation: the UI invokes `generatePreview`, which calls `generateSchedulePreview` with cloned inputs; the engine runs cycle/work generation, candidate expansion, placement, friction detection, and suggested-fix generation, and the store stores the resulting preview snapshot at `state.preview`. (Store call: [code/src/state/dayFrameStore.ts#L232-L256]; engine orchestration: `code/src/core/engine/generateSchedulePreview.ts`). **Confirmed**

- Revision: UI-initiated suggested-fix application calls `applySuggestedFixToPreview` → `reviseSchedulePreview` → `applySuggestedFix`; the revised draft is written to `state.preview` at the inspected production write sites and will be replaced by a subsequent `generatePreview`. **Confirmed**

---

## 3. Key Subsystems (high-level)

- Store & Authored State: `code/src/state/dayFrameStore.ts` (`createDayFrameStore`) and types in `code/src/state/types.ts`. Persisted payload is written by `persistState` at [code/src/state/dayFrameStore.ts#L398-L433]. **Confirmed**

- Cycle & work generation: `code/src/core/cycles/generateCycleWorkBlocks.ts` (calls `generateRepeatingSequenceWorkBlocks` and `generateManualSegmentWorkBlocks`) and `code/src/core/shifts/generateWorkBlocks.ts`. Repeating-sequence expansion is handled in `generateRepeatingSequenceWorkBlocks` ([code/src/core/cycles/generateCycleWorkBlocks.ts#L116]). **Confirmed**

- Candidate generation: `code/src/core/blocks/generateBlockCandidates.ts` (supported frequencies implemented there; unsupported frequencies cause runtime error). **Confirmed**

- Candidate placement and sleep propagation: `code/src/core/blocks/placeBlockCandidates.ts` implements greedy placement and a deferred-sleep flow; deferred sleep handling and propagation are implemented in `placeDeferredSleepCandidates` and `placePropagatedSleepBlock` ([code/src/core/blocks/placeBlockCandidates.ts#L49], [code/src/core/blocks/placeBlockCandidates.ts#L111]). **Confirmed**

- Friction & suggested fixes: detection in `code/src/core/friction/detectScheduleFriction.ts` (severity/kind logic), suggested-fix generation in `code/src/core/friction/generateSuggestedFixes.ts`, and preview action application in `code/src/core/friction/applySuggestedFix.ts`. **Confirmed**

- UI wiring: generation and revision call sites are in `code/src/ui/DayFrameApp.tsx` and `code/src/ui/PreviewScreen.tsx` / `PreviewScreenContainer.tsx`. **Confirmed**

---

## 4. Source-of-Truth and Traceability (summary)

- Persisted authored fields: stored to localStorage by `persistState` in `code/src/state/dayFrameStore.ts` ([code/src/state/dayFrameStore.ts#L398-L433]). Persisted keys: `DAYFRAME_STORAGE_KEY = "dayframe-store-v1"` and `DAYFRAME_PROFILES_STORAGE_KEY = "dayframe-profiles-v1"`. **Confirmed**

- Preview snapshot: stored in-memory at `state.preview` by the store; **the preview result is not written to the persisted localStorage payload at the inspected production write sites** (persistState omits `preview`). Evidence: `generatePreview` assigns `state.preview` ([code/src/state/dayFrameStore.ts#L232-L256]) and `persistState` builds the persisted object without `preview` ([code/src/state/dayFrameStore.ts#L398-L433]). **Confirmed**

- Preview revision traceability: suggested-fix application modifies preview structures (scheduledBlocks/unplacedCandidates/frictionPoints) via `applySuggestedFix` ([code/src/core/friction/applySuggestedFix.ts#L15]) and `applySuggestedFixToPreview` writes the revised preview into `state.preview` at the inspected production write sites ([code/src/state/dayFrameStore.ts#L266-L296]). These revisions are preview-scoped and are overwritten by a subsequent `generatePreview`. **Confirmed**

- Source traceability (refined): scheduled draft blocks retain explicit source identifiers when produced. Examples of source identifiers retained on scheduled draft blocks include `templateId` and `candidateId`; where applicable, preview objects can also carry `recurrenceId` or `manualEventId`. These fields enable a link from scheduled draft blocks back to their originating template/candidate while the preview exists in memory, but they do not constitute a complete provenance or audit log by themselves. Preserve the distinction between:
  - **Source identifiers**: `templateId`, `candidateId`, `recurrenceId`, `manualEventId` — retained on scheduled draft blocks when applicable. **Confirmed**
  - **Placement-decision traceability**: placement metadata in the preview (placement timestamps, offsets, and placement rationale fields) that explain why a candidate was placed in a given slot. **Confirmed**
  - **Revision traceability**: preview-level revision metadata such as `revisedAt`, `revisedBy`, or suggested-fix action metadata when present in the preview. **Confirmed**
  - **Historical traceability**: a durable execution-history or preview-revision persistence subsystem was not found in the inspected codebase; preview revisions are not written to a durable history at the inspected production write sites. **Not found**

---

## 5. Determinism and Reproducibility (qualifications)

- No random number generation, time-based variability (other than caller-supplied timestamps), or nondeterministic sorting was found in the inspected production modules. The code performs deterministic sorts and uses Date arithmetic. **Confirmed**

- Conditions required for identical output (inferred):
  - Identical authored inputs: same `shiftDefinitions`, `shiftCycles`, `blockTemplates`, `blockRecurrences`, `manualEvents` with identical ordering where ordering matters. **Inferred**
  - Identical planning window inputs: same `planningWindowStart` and `planningWindowEnd`. **Inferred**
  - Identical runtime environment: same timezone and JS Date behavior. **Inferred**
  - Identical caller-supplied timestamps such as `generatedAt` / `revisedAt`. **Inferred**

When these inputs and environment are identical, the inspected production code produces the same preview result deterministically. **Inferred**

---

## 6. Cycle Overlap Behavior (clarification)

- The production code validates cycles before expansion: `generateCycleWorkBlocks` normalizes cycles and calls the utility `validateShiftCycles` in `code/src/core/cycles/shiftCycleUtils.ts`, which enforces non-overlapping cycles for the input set used by the generator. See `generateCycleWorkBlocks` in `code/src/core/cycles/generateCycleWorkBlocks.ts` and `validateShiftCycles` in `code/src/core/cycles/shiftCycleUtils.ts`. **Confirmed**

- If invalid or overlapping cycle data is supplied at runtime, helper validation routines detect and throw; the generation helpers assume validated input sets. Distinguish: valid, prevalidated cycle collections are supported and expanded; overlapping/invalid cycle collections will trigger validation exceptions during generation. **Confirmed**

---

## 7. Sleep handling (clarified)

- Sleep is implemented via block templates and candidates (`BlockTemplate` category "sleep") and follows the general candidate and placement pipeline. `createInitialDayFrameState` contains a special-case normalization that enables a `default_sleep` template when a matching `default_sleep` daily recurrence is present; see `normalizePersistedBlockTemplates` and `normalizePersistedShiftCycles` in `code/src/state/createInitialDayFrameState.ts`. **Confirmed**

- Sleep candidate deferred placement: `placeBlockCandidates` defers some sleep candidates into a deferred collection and later attempts anchor-based propagation via `placeDeferredSleepCandidates` and `placePropagatedSleepBlock` in `code/src/core/blocks/placeBlockCandidates.ts`. **Confirmed**

- Open question (investigatory): whether a particular authored-block property set makes a block an eligible anchor for sleep propagation in all cases. The code computes `findNearestSleepAnchor` and propagates offsets but the policy for anchor eligibility (which templates are considered anchors in edge cases) is a behavioral detail that requires product/UX clarification or targeted tests to resolve. **Inferred**

---

## 8. Friction detection (summary)

- Friction kinds: implemented kinds include `conflict`, `unplaced`, and `workRequiredSkip`. Detection constructs `FrictionPoint` objects and computes severity via `getConflictSeverity` in `code/src/core/friction/detectScheduleFriction.ts`. **Confirmed**

- Severity rules (implementation): the code treats generated work blocks as priority 1 (`WORK_BLOCK_PRIORITY = 1`) and marks conflicts as `critical` when both sides have priority 1; otherwise conflicts are `warning`. See `getConflictSeverity` in `code/src/core/friction/detectScheduleFriction.ts`. **Confirmed**

---

## 9. Follow-Up Investigations (investigations only)

All items below are investigatory probes; they do not contain implementation recommendations.

- Investigation A — `applySuggestedFix` action mapping: document each suggested-fix `action` implemented in `code/src/core/friction/applySuggestedFix.ts` and the exact preview fields it mutates; link to unit tests that exercise each action. **Inferred**

- Investigation B — UI recurrence exposure: reconcile the recurrence options exposed in `code/src/ui/SetupScreen.tsx` with engine expectations in `code/src/core/blocks/generateBlockCandidates.ts` to identify UX/engine mismatches. **Inferred**

- Investigation C — Persistence shapes: inventory the JSON schema written by `persistState` in `code/src/state/dayFrameStore.ts` and document migration/legacy-field handling such as `shiftCycle` vs `shiftCycles`. **Inferred**

- Investigation D — Sleep anchor policy: capture placement and anchor-selection logic in `code/src/core/blocks/placeBlockCandidates.ts` to detail eligibility rules for anchor propagation and edge-case behaviors. **Inferred**

---

## Appendices

### Appendix A — Persistence Matrix

See the Persistence Matrix documenting what the store persists, where, and how it normalizes legacy fields.

- Persisted payload key: `DAYFRAME_STORAGE_KEY = "dayframe-store-v1"` written by `persistState` in `code/src/state/dayFrameStore.ts` ([code/src/state/dayFrameStore.ts#L398-L433]). **Confirmed**

- The persisted fields are: `schedulingPreferences`, `previewRange`, `shiftDefinitions`, `shiftCycles`, an optional legacy `shiftCycle` snapshot, `blockTemplates`, `blockRecurrences`, and `manualEvents`. `preview` is not persisted at the inspected production write sites. **Confirmed**

(Full matrix content has been moved to this appendix.)

### Appendix B — Suggested-Fix Action Matrix (inspected preview actions)

See the Suggested-Fix Action Matrix mapping each `SuggestedFix.action` to the exact preview mutations and test references.

- Implementation entrypoint: `applySuggestedFix` in `code/src/core/friction/applySuggestedFix.ts`. **Confirmed**
- Store commit: `applySuggestedFixToPreview` in `code/src/state/dayFrameStore.ts` writes the revised preview to `state.preview` ([code/src/state/dayFrameStore.ts#L266-L296]). **Confirmed**

(Details for actions such as `acceptConflict`, `skipBlock`, `reduceDuration`, `convertToRecovery`, `changePriority`, `changeFixedTime`, `moveBlock`, and the unsupported `addResource` are captured in the matrix with pointers to tests in `code/src/core/friction/tests/applySuggestedFix.test.ts`.)

### Appendix C — Friction Matrix

See the Friction Matrix listing detection branches, messages, severity rules, and suggested-fix generation details.

- Detection & severity implemented in `code/src/core/friction/detectScheduleFriction.ts`, including `getConflictSeverity` ([code/src/core/friction/detectScheduleFriction.ts#L144], [code/src/core/friction/detectScheduleFriction.ts#L298]). **Confirmed**

(Full matrix content has been moved to this appendix.)

### Appendix D — Production-to-Test Map

See the mapping of production files → their unit tests.

Representative mappings (file → test file):

- `code/src/core/engine/generateSchedulePreview.ts` → `code/src/core/engine/tests/generateSchedulePreview.test.ts`. **Confirmed**
- `code/src/core/friction/applySuggestedFix.ts` → `code/src/core/friction/tests/applySuggestedFix.test.ts`. **Confirmed**
- `code/src/core/blocks/placeBlockCandidates.ts` → `code/src/core/blocks/tests/placeBlockCandidates.test.ts`. **Confirmed**
- `code/src/state/dayFrameStore.ts` → `code/src/state/tests/dayFrameStore.test.ts`. **Confirmed**

(Full map content has been moved to this appendix.)

---

*End of audit.*
