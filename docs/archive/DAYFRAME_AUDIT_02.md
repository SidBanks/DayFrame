# DayFrame Engine Audit 02 — Current Engine vs. Intended Architecture

## Executive Summary

- Overall alignment: Partially aligned.
  - The codebase implements a deterministic planning engine (cycle expansion, candidate generation, placement, friction detection, and suggested-fix construction) and an in-memory preview workflow that enables interactive iteration. Evidence: `code/src/core/engine/generateSchedulePreview.ts`, `code/src/core/cycles/generateCycleWorkBlocks.ts#L116`, `code/src/core/blocks/generateBlockCandidates.ts`. **Confirmed / Inferred**
  - Key architectural responsibilities are missing: a persisted accepted-schedule artifact, immutable execution history, and first-class Commitment/Goal semantics (ownership vs borrowing). These omissions create foundational gaps between the implementation and the intended DayFrame architecture. **Not found / Confirmed**

- Highest-value reuse candidates: the algorithmic layers (cycle expansion, candidate generation, placement, friction detection). These are reusable with semantic adaptation. **Confirmed**

- Most consequential risk: conflation of `generated plan` (the preview) with an `accepted schedule` or `live occurrence`. The preview is ephemeral and may be overwritten by regeneration; preview mutations are not persisted as an accepted schedule. Evidence: `code/src/state/dayFrameStore.ts#L232-L256`, `code/src/state/dayFrameStore.ts#L266-L296`. **Confirmed**

---

## Intended architecture (authoritative intent)

Source: `docs/hydration/DayFrame_Hydration_2026-07-18_UX_Complete.md` and supporting architecture/spec docs.

- Four pillars (authoritative meanings):
  - Teach (Routine Builder): capture routines, commitments, and goals to teach the system the user's rhythm. **Confirmed**
  - Plan (Monthly Planner): produce explainable `generated plans` from authored intent and preferences, surface friction and goal allocations. **Confirmed**
  - Live (Daily Workspace): run-time surface that owns `live occurrences`, records `execution events`, and captures outcomes. **Confirmed**
  - Learn (Summary): reflection surface that consumes `immutable history` to produce deterministic recommendations. **Confirmed**

- Core expectations:
  - Clear artifact distinctions: `authored intent` → `generated plan` (preview) → `accepted schedule` → `live occurrence` → `execution event` → `immutable history`.
  - Recommendations must be explainable and reproducible from explicit inputs.

---

## Current engine summary (implementation facts)

- Authored intent persistence: `persistState` persists authored objects (templates, recurrences, manual events, shifts). Evidence: `code/src/state/dayFrameStore.ts#L398-L433`. **Confirmed**

- Generated plan: `generatePreview` → produces `state.preview` by calling the engine orchestration `generateSchedulePreview`. Evidence: `code/src/state/dayFrameStore.ts#L232-L256`. **Confirmed**

- Preview revision: suggested-fix application mutates the preview and sets preview metadata (`revisedAt`, `actionFeedback`) but remains preview-scoped. Evidence: `code/src/state/dayFrameStore.ts#L266-L296`. **Confirmed**

- Friction detection and suggestion generation: implemented in `code/src/core/friction/*` and exercised in tests. **Confirmed**

- Determinism: generation pipeline contains no RNG; outputs are reproducible given identical inputs. **Inferred**

- Absent artifacts: there is no persisted `accepted schedule`, no persisted occurrence lifecycle, and no immutable execution history recorded by the existing store. **Not found**

---

## Alignment matrix (single-status assignments)

All classifications use one of: Aligned, Partially aligned, Absent, Conflicting, Unclear. Evidence markers use: Confirmed, Inferred, Not found.

- Teach: Partially aligned — Authoring UIs and persisted templates/recurrences exist; routine semantics and teach-history/learning pipeline are incomplete. Evidence: `code/src/ui/SetupScreen.tsx`, `persistState`. **Confirmed / Not found**

- Plan: Partially aligned — Engine algorithms implement Plan mechanics; Plan semantic responsibilities (Commitment/Goal ownership, capacity accounting, acceptance semantics) are missing. Evidence: `generateSchedulePreview` and core modules. **Confirmed / Inferred**

- Live: Absent — The Live pillar requires accepted schedules and occurrence lifecycle; current preview does not satisfy Live semantics. Evidence: `state.preview` is in-memory and not persisted as an accepted schedule. **Not found / Confirmed**

- Learn: Absent — No immutable execution history or learning pipeline exists to feed deterministic recommendations. Evidence: no `execution`/`analytics` modules detected. **Not found**

- Pattern Library: Aligned — `blockTemplates` and `blockRecurrences` are present and persisted (pattern material exists). Evidence: `code/src/core/blocks/types.ts`, `persistState`. **Confirmed**

- Friction detection (subsystem): Aligned — `detectScheduleFriction` constructs friction points and severities. Evidence: `code/src/core/friction/detectScheduleFriction.ts`. **Confirmed**

- Friction resolution (architecture-wide): Partially aligned — suggestion generation & application exist as preview mutations but lack persistence and acceptance provenance. Evidence: `generateSuggestedFixes` and `applySuggestedFix`. **Confirmed / Not found**

---

## Four-pillar assessment (concise)

- Teach: Partially aligned. Authoring surfaces and persisted templates exist; missing: teach-history and richer routine semantics. **Confirmed / Not found**

- Plan: Partially aligned. Strong algorithmic foundation; missing: semantic mapping of authored entities to Commitment vs Goal, capacity model, and acceptance semantics. **Confirmed / Inferred**

- Live: Absent. Preview is a `generated plan` only; there is no persisted `accepted schedule` nor `live occurrence` lifecycle. **Not found / Confirmed**

- Learn: Absent. No `immutable history` or learning pipeline to close the loop. **Not found**

---

## Commitments, Goals, and Capacity — semantic mapping

This mapping records the current implementation meaning, likely intended role, a single alignment status, and evidence.

- `manualEvents` — Current: user-authored calendar items persisted via `persistState`. Intended role: Commitment precursor. Alignment: Partially aligned. Evidence: `code/src/state/dayFrameStore.ts#L398-L433`. **Confirmed**

- `generateCycleWorkBlocks` outputs — Current: generated work blocks from cycles. Intended role: Commitment precursor for shift work. Alignment: Partially aligned. Evidence: `code/src/core/cycles/generateCycleWorkBlocks.ts#L116`. **Confirmed**

- `blockTemplates` (fixed-time) — Current: templates with `fixedStartTime`. Intended role: Commitment precursor. Alignment: Partially aligned. Evidence: `code/src/core/blocks/types.ts`. **Confirmed**

- `blockTemplates` (flexible) — Current: flexible candidates. Intended role: Goal/flexible allocation. Alignment: Partially aligned (ambiguous). Evidence: `code/src/core/blocks/types.ts`. **Confirmed / Not found**

- `priority` (1–5) — Current: numeric priority used in placement/conflict logic. Intended role: preference/constraint input (not ownership). Alignment: Partially aligned. Evidence: `detectScheduleFriction.ts` and architecture doc. **Confirmed / Inferred**

- `unplacedCandidates` — Current: engine signal for capacity shortfall. Intended role: capacity signal. Alignment: Partially aligned. Evidence: `placeBlockCandidates` output types. **Confirmed**

Notes: No explicit `Commitment` or `Goal` domain types were found. Mapping current entities to Commitment vs Goal requires product-level decisions and likely a data-model change. **Not found**

---

## Plan-to-Live boundary (single unified description)

- Implemented: `authored intent` persistence and `generated plan` creation (`persistState` and `generatePreview`). Evidence: `code/src/state/dayFrameStore.ts#L398-L433`, `code/src/state/dayFrameStore.ts#L232-L256`. **Confirmed**

- Missing: an explicit `accept` action that converts a `generated plan` into a persisted `accepted schedule`, and a persisted `live occurrence` lifecycle that records `execution events` into an `immutable history`. Evidence: absence of acceptance/persistence code paths and history events. **Not found**

- Practical implication: without an acceptance boundary and immutable history, user-facing preview mutations can be mistaken for durable schedule changes and cannot be audited or used for learning. **Confirmed**

---

## History and traceability (fields and scope)

- Traceable fields present in preview: `DraftScheduledBlock` contains `templateId?`, `source`, `startsAt`, `endsAt`, `priority`, `status`; `BlockCandidate` contains `templateId` and `recurrenceId`. Evidence: `code/src/core/blocks/types.ts#L104`, `code/src/core/blocks/types.ts#L151`. **Confirmed**

- Revision metadata: preview may include `revisedAt` and `actionFeedback` when suggested-fixes are applied. Evidence: `code/src/state/dayFrameStore.ts#L289-L294`. **Confirmed**

- Missing durable provenance: no persisted recommendation/acceptance records, no persistent occurrence identifiers, and no recorded `actualStart`/`actualEnd` or `actualDuration` in persisted storage. **Not found**

- Conclusion: in-memory traceability for placement and source linkage is good; durable, auditable provenance across Plan→Live→Learn is absent. **Confirmed / Not found**

---

## Friction and recommendations (clarified)

- Detection subsystem: Aligned — friction detection and severity logic are implemented. Evidence: `code/src/core/friction/detectScheduleFriction.ts`. **Confirmed**

- Recommendation generation: Aligned (implementation present) — suggested fixes are produced by `generateSuggestedFixes`. Evidence: `code/src/core/friction/generateSuggestedFixes.ts`. **Confirmed**

- Recommendation application: Partially aligned — `applySuggestedFix` applies preview mutations; however, application lacks persistence and acceptance provenance, so recommendation acceptance is not auditable. Evidence: `code/src/core/friction/applySuggestedFix.ts`, `code/src/state/dayFrameStore.ts#L266-L296`. **Confirmed / Not found**

- Reproducibility: generation is deterministic (Inferred) but reproducible audit trails require persisted inputs/provenance (Not found). **Inferred / Not found**

---

## Surface and mental-model alignment (UI/workflow)

- Planner surface: Partially aligned — `PreviewScreen`, `DayFrameApp`, and `SetupScreen` exist and support review/edit flows; the UX is currently preview-centric rather than the Planner-first surface described in hydration docs. Evidence: `code/src/ui/PreviewScreen.tsx`, `code/src/ui/SetupScreen.tsx`. **Confirmed**

- Summary surface: Partially aligned (UI components exist; persisted Summary/learning absent). Evidence: `DayVisualizer.tsx`. **Confirmed / Not found**

- Pattern Library: Aligned — templates and recurrences provide the pattern material. Evidence: `blockTemplates`, `blockRecurrences`. **Confirmed**

- Workflow mismatches of note: UI exposes recurrence options that the engine may not support; preview mutations are used in ways that can be misinterpreted as accepted schedule changes. Evidence: `SetupScreen` recurrence options; preview overwrite behavior. **Confirmed / Conflicting**

---

## Retention assessment (four layers)

Separate, single-status guidance for four independent layers.

1. Algorithms (cycle generation, candidate generation, placement, friction detection)
   - Retention: Retain with adaptation. Algorithms are robust and deterministic; adapt to emit provenance and support ownership rules. Evidence: `code/src/core/*`. **Confirmed / Inferred**

2. Domain model (block templates, manual events, Commitment/Goal semantics)
   - Retention: Replace/extend (semantic migration). Current templates/manual events are material to retain, but introduce explicit `Commitment` and `Goal` types (data-model change) to encode ownership and capacity semantics. Evidence: absent Commitment/Goal types. **Not found / Inferred**

3. Persistence (authored persistence, preview persistence, execution history)
   - Retention: Extend/replace. Keep `persistState` for authored intent; add a persisted `accepted schedule` artifact and an `immutable history` store for execution events and recommendation acceptance records. Evidence: `persistState` omits preview/history. **Confirmed / Not found**

4. UI / Workflow (Planner, Summary, Preview, Setup)
   - Retention: Retain with adaptation. Keep existing UI components but adjust workflows to make acceptance explicit, surface recommendation provenance, and align recurrence options with engine-supported models. Evidence: `code/src/ui/*`. **Confirmed**

---

## Contradictions and architectural risks (top items)

1. Preview vs Accepted schedule conflation — Foundational risk. Preview mutations are ephemeral and overwriteable; users may treat them as accepted. Evidence: `generatePreview` and `applySuggestedFixToPreview` write only `state.preview`. **Confirmed**

2. No immutable execution history — Foundational risk. Prevents auditing and learning. Evidence: absence of persisted occurrence events. **Not found**

3. Priority ≠ ownership — Significant risk. Numeric priorities do not encode ownership semantics required by Commitments vs Goals. Evidence: friction logic uses numeric priority but no ownership mapping. **Confirmed**

4. Recommendation acceptance lacks provenance — Significant risk. Accepting suggestions mutates preview without persisted acceptance records. Evidence: `applySuggestedFix` applies preview mutations only. **Confirmed**

5. UI recurrence mismatch — Localized risk. Engine/UX mismatch may cause confusion or errors. Evidence: recurrence options vs candidate generator. **Confirmed**

---

## Open questions (product decisions required)

- What user action converts a `generated plan` (preview) into an `accepted schedule` that is persisted? (Required to define acceptance boundary and audit.) **Product-semantic**

- Should recommendation acceptance/rejection be persisted as first-class records for evaluation and audit? **Product-semantic**

- How should existing templates and manual events be mapped to explicit `Commitment` and `Goal` types (data migration strategy)? **Product + Technical**

- What policy should drive preview regeneration vs preserving user revisions (merge, preserve, or discard)? **Product-semantic**

- Must `immutable history` live in localStorage, or is an external event store acceptable? (Implications for offline behavior.) **Product + Technical**

---

## Conclusions (qualified)

1. The codebase contains a strong, deterministic algorithmic foundation for the Plan pillar; these algorithmic components should be retained and adapted. **Confirmed**

2. The implementation lacks the persistence and data-model layers required to realize Live and Learn: specifically, a persisted `accepted schedule`, `live occurrence` lifecycle, `execution events`, and an `immutable history`. **Not found / Confirmed**

3. To align with intended architecture, product decisions are required to define acceptance semantics and Commitment/Goal domain boundaries; these decisions will drive the necessary persistence and domain-model changes. **Inferred**

4. Retention guidance is separated by layer (Algorithms, Domain Model, Persistence, UI/Workflow) to avoid conflating technically reusable code with missing architectural responsibilities. **Inferred**

---

## Evidence index (selected)

- `docs/hydration/DayFrame_Hydration_2026-07-18_UX_Complete.md` — authoritative pillar definitions (Teach / Plan / Live / Learn). **Confirmed**
- `code/src/state/dayFrameStore.ts#L232-L256` — `generatePreview` writes `state.preview`. **Confirmed**
- `code/src/state/dayFrameStore.ts#L266-L296` — suggested-fix application writes preview metadata (`revisedAt`, `actionFeedback`). **Confirmed**
- `code/src/state/dayFrameStore.ts#L398-L433` — `persistState` persists authored fields (no preview/history). **Confirmed**
- `code/src/core/cycles/generateCycleWorkBlocks.ts#L116` — cycle expansion. **Confirmed**
- `code/src/core/blocks/generateBlockCandidates.ts` — candidate generation. **Confirmed**
- `code/src/core/blocks/placeBlockCandidates.ts` — placement, including sleep propagation helpers. **Confirmed**
- `code/src/core/friction/detectScheduleFriction.ts` — friction detection and severity logic. **Confirmed**
- `code/src/core/friction/generateSuggestedFixes.ts` and `code/src/core/friction/applySuggestedFix.ts` — suggestion generation and preview application. **Confirmed**

---

## Appendix (quick references)

- Key terminology used consistently in this audit:
  - `authored intent` — user-provided templates, recurrences, manual events, profiles.
  - `generated plan` — ephemeral preview produced by the engine.
  - `accepted schedule` — intended persisted schedule representing user's decision (absent currently).
  - `live occurrence` — runtime instance of a scheduled item.
  - `execution event` — start/complete/skip/failure recorded for a live occurrence.
  - `immutable history` — persisted timeline of execution events and accepted decisions.

- Single classification vocabulary used: Aligned, Partially aligned, Absent, Conflicting, Unclear.
- Evidence markers used only as: Confirmed, Inferred, Not found.

*End of DayFrame Engine Audit 02 — Current Engine vs. Intended Architecture*
