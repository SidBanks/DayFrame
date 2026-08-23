# Task 3.1 Result — ExecutionEvent / Completion History Semantics

**Task:** 3.1  
**Date:** 2026-08-21  
**Determination:** Complete as an architecture-first audit; no production feature implemented

## 1. Executive Findings

DayFrame currently has no authoritative execution, completion-history, progress,
or adherence subsystem. The `DraftScheduledBlock.status` union contains execution-
like words, but executable behavior establishes it as mutable derived Preview
presentation. `skipBlock` changes only a draft Preview and maps, on explicit Accept,
to planning-only `omitOccurrence`. `PlanDecision V1` is current accepted planning
authority, not a historical fact.

The recommended minimum is `ExecutionRecord V1`: an independent, versioned surface
containing immutable record revisions and a deterministic current-outcome
projection. This hybrid preserves correction evidence without the complexity of
general event sourcing. Absence means `unknown`; V1 must not infer `missed`.

## 2. Artifact Integrity

- Supplied artifact:
  `/home/sid/.codex/attachments/34c1e3be-5dcb-4e1e-9e13-707773355ba3/pasted-text.txt`
- Saved project copy:
  `docs/implementation/phase-3/TASK_3.1_AUDIT_AND_DEFINE_ExecutionEvent_HISTORY_SEMANTICS.md`
- SHA-256 of both:
  `fe1c2b3355681ef7b8989589dd75327538f6d3d31410b48a9a3ed991c27b9b3b`
- Byte comparison: identical.
- Completeness: title, sections 1–141, Task Determination, and the required final
  completion statement are present.
- The task artifact was not modified.

## 3. Phase 2 Baseline

**Confirmed.** `CHECKPOINT_Phase_2_Complete.md` exists, is accepted, and records
formal Phase 2 closure. `PHASE_2_TASK_INDEX.md` indexes Tasks 2.24–2.40. The final
authority order is authored setup → applicable PlanDecision → heuristics →
SuggestedFix → Try. Active V2, Profile V2, Backup V2, DurableOccurrenceReference
V1, and PlanDecision V1 have explicit and non-overlapping roles.

## 4. Audit Method

Production code, tests, architecture, checkpoints, task results, persistence types,
and UI language were searched for completion, skip, missed, execution, history,
progress, status, actual-time, cancellation, reschedule, and adherence concepts.
Symbols were traced through their writers and consumers rather than classified by
name alone. No focused runtime test was required because the relevant behavior is
directly enforced by small pure functions and existing tests.

## 5. Existing-System Inventory

| Concept | Current representation | Durable? | Authority? | Evidence |
| --- | --- | ---: | ---: | --- |
| Preview block status | `ScheduledBlockStatus` includes planned/completed/missed/skipped/rescheduled/conflicted | No | Derived presentation | `code/src/core/blocks/types.ts:144` |
| Preview skip | `applySkipBlock` marks draft status skipped or removes an unplaced candidate | No | Planning-only Try | `code/src/core/friction/applySuggestedFix.ts:141` |
| Accepted omission | `PlanDecisionV1.kind = omitOccurrence` removes the candidate during replay | Yes | Current planning authority | `code/src/core/decisions/planDecision.ts:42`; `replayPlanDecisions.ts:101` |
| Preview | `DayFrameState.preview` | No current durable authority | Derived current plan | `code/src/state/types.ts:69` |
| PlanDecision | independent V1 durable surface | Yes | Accepted planning authority | Phase 2 completion checkpoint |
| Occurrence reference | source lifetimes plus canonical coordinate | Yes when embedded | Linkage, not outcome | `durableOccurrenceReference.ts:18` |
| Manual event | authored calendar input | Active/Profile/Backup | Authored intent, not attendance | `code/src/state/types.ts:67` |
| Execution/completion history | Not found | No | None | Repository-wide audit |
| Progress/adherence/streak | Product prose only or not found | No | None | Repository-wide audit |
| “outcome” in durability code | persistence operation result | Infrastructure | Persistence only | `code/src/state/durabilitySemantics.ts` |

Classification: Preview status is **Derived presentation**; skip/fix and
PlanDecision omission are **Planning-only behavior**; architecture prose about
Live/Learn is **Proposed product architecture**; durable execution, progress, and
adherence are **Not found**. No contradictory authoritative completion models were
found.

## 6. Completion, Skip, History, and Progress Audit

### Existing completion semantics

**Confirmed:** `completed` and `missed` exist only as unused members of the draft
scheduled-block status vocabulary. No production writer, persistence codec, store
mutation, or UI workflow establishes completion authority. They are placeholders,
not facts.

### Existing skip/omit semantics

**Confirmed:** `skipBlock` revises Preview. Explicit acceptance maps supported
skip fixes to `omitOccurrence`; replay removes the candidate. Both mean planning
omission. UI copy that says “skipped” in Preview is potentially ambiguous and
should eventually be renamed “omitted from plan,” but changing it is outside 3.1.

### Existing history and progress

**Not found:** there is no execution ledger, persisted prior Preview series,
completion log, progress denominator, streak, or adherence calculation. Persistence
operation “history/outcome” terminology is unrelated infrastructure metadata.

### Preview and PlanDecision historical status

**Confirmed:** Preview is a replaceable, derived current plan. It must not be
persisted as history. PlanDecision is reversible current planning authority; even
though a record has `acceptedAt`, it does not prove execution and is not an audit
log of prior decisions.

## 7. DurableOccurrenceReference and the Historical Reference Problem

**Confirmed:** `DurableOccurrenceReference V1` captures source IDs,
`SourceIncarnationId`s, and window-invariant occurrence coordinates for template,
work, and manual-event families. Resolution explicitly distinguishes missing
source, lifetime mismatch, and missing occurrence.

**Determination:** it is necessary and suitable for planned-occurrence correlation,
but insufficient as the complete historical identity. Deleted sources stop
resolving, references contain insufficient display context, and unplanned execution
has no planned occurrence to reference.

**Proposed lifetime-safe model:** use both (C): an independent execution identity,
an optional durable occurrence reference, and immutable snapshot context. A source
recreated with the same authored ID has a new incarnation and never inherits old
records. Referential resolution is optional enrichment, not a condition of record
validity.

| Scenario | DurableOccurrenceReference sufficient? | Additional snapshot/identity needed? |
| --- | ---: | ---: |
| Current supported planned source exists | For correlation | Yes, historical display and record identity |
| Source edited | Correlation remains | Yes, freeze then-current context |
| Source deleted | No resolution | Yes |
| Same ID recreated | Correctly refuses retarget | Yes |
| Profile activated | New lifetime, no inheritance | Yes |
| Backup V1 restored | Fresh lifetime | Yes |
| Backup V2 restored | Lifetime restored but no history | Yes |
| Unplanned activity | No | Yes, independent subject |

## 8. Model Options, Recommendation, and Naming

### Model A — Mutable current record

Small and queryable, but overwrites correction evidence, complicates recovery, and
makes “undo” historically opaque.

### Model B — Append-only factual event stream

Maximally expressive, but introduces event ordering, folding, pause/resume, and
projection machinery before DayFrame needs them.

### Model C — Hybrid (accepted)

Append immutable `ExecutionRecord` revisions only when an outcome is reported,
corrected, or retracted. Deterministically project one current record/outcome per
subject. This provides truthful correction history without generalized event
sourcing.

`ExecutionRecord` is preferred over `ExecutionEvent`: each revision is a complete
assertion about an occurrence outcome, not a low-level start/pause/finish event.
`OccurrenceOutcome` names the derived projection, and `CompletionRecord` is too
narrow because partial and skipped are valid.

## 9. Recommended V1 Domain Semantics

V1 requires an independent UUID-v4 record/revision ID, semantic subject ID, optional
`DurableOccurrenceReference`, immutable historical snapshot, outcome, provenance,
`recordedAt`, optional actual-time evidence, optional note, and optional correction
link. Exact field names belong to Task 3.2 pure-domain design.

| Outcome | Stored or derived? | Required evidence | Meaning |
| --- | --- | --- | --- |
| completed | Stored record | Explicit user report initially | Intended activity was sufficiently completed according to reporter |
| partial | Stored record | Explicit report | Some meaningful activity occurred; completion not claimed |
| skipped | Stored record | Explicit report against planned context | Expected occurrence intentionally not performed |
| unknown | Derived | No current record | Outcome is unreported/unknown |
| missed | Not V1 | None accepted | Silence cannot prove failure |
| cancelled | Deferred | Unresolved | No stable execution meaning distinct from planning invalidation/skip |

Completion is not goal success, quality, timer expiry, elapsed scheduled duration,
or automatic passage of time. V1 completion authority is the user. Future direct
timer/integration observations require explicit provenance and separately defined
authority.

Partial completion is useful in V1, but generic percentages are not truthful across
heterogeneous activities. Optional actual duration or a note may qualify the claim.
Quantity-based metrics require later activity-specific schemas.

## 10. Time and Reporting Semantics

- `recordedAt` is mandatory canonical UTC audit time.
- `occurredAt` or actual start/end/duration is optional asserted/observed evidence.
- Scheduled start/end remain only in the frozen plan snapshot and are never copied
  into actual fields.
- Retroactive reports are allowed.
- A future completion claim is rejected when its asserted occurrence is in the
  future. Recording before the planned slot is permitted only when an actual past
  time establishes early execution.
- “Early” and “late” are derived comparisons, not separate outcomes.
- Rescheduling remains PlanDecision/planning authority; performing at another time
  is execution evidence. Neither rewrites the other.
- User-day grouping uses the captured day-boundary/timezone context. Store instants
  in UTC plus sufficient local zone/offset context; never assume a DST day is 24h.

## 11. Planning/Execution Separation Matrix

| Fact | Planning authority | Execution authority | May be inferred? |
| --- | ---: | ---: | ---: |
| Source says repeat weekly | Authored setup | No | Plan generation only |
| Occurrence generated | Preview | No | Yes, as plan only |
| Occurrence moved/omitted | PlanDecision | No | Replay deterministically |
| Preview fix tried | Try/Preview | No | No durable claim |
| Activity completed | No | ExecutionRecord evidence | Never from schedule |
| Activity skipped in reality | No | ExecutionRecord evidence | Never from omission alone |
| No report after end | No | Unknown | Must not infer missed |
| Early/late | Historical snapshot | Actual-time evidence | Yes, when both exist |
| Progress | Goal/plan denominator | Current outcome projection | Yes, with unknown disclosed |

Unplaced, omitted, blocked, stale, outside-window, Try-only, and Preview-freshness
states remain planning conditions. They cannot create outcomes. Preview regeneration
and PlanDecision removal/supersession never change history.

## 12. Plan and Source Lifecycle Matrix

| Change | Historical effect |
| --- | --- |
| Preview regeneration | None |
| Source title/category update | Snapshot unchanged; current source may enrich separately |
| Source deletion | Record remains valid and renderable |
| Source recreation with same ID | New lifetime; no history inheritance |
| PlanDecision removal/supersession | Execution unchanged; frozen historical plan context retained |
| Profile save/activation | Profile excludes history; activation creates fresh lifetimes |
| Backup V1 restore | No history; fresh active lifetimes |
| Backup V2 restore | No history; exact setup lifetimes only |
| Future complete backup | Must explicitly include independently versioned history |

The snapshot is authoritative historical display context. Minimum display data is
source family, title, category/type, intended user day, and effective scheduled
interval when one existed. Current source data is optional enrichment only.

## 13. Cardinality, Correction, and Deletion

One semantic execution subject has at most one projected current outcome. It may
have multiple immutable record revisions in a single valid correction chain.
Correction appends a replacement referring to the current revision. Retraction
appends an explicit tombstone that projects unknown while preserving provenance.
Competing heads, cycles, missing correction targets, or cross-subject corrections
are invalid/quarantinable.

Physical delete is not ordinary correction. It is allowed only through explicit
privacy/data deletion and must define whether one subject or all history is removed.
Unplanned execution receives an independent subject and snapshot; it is not attached
to a convenient scheduled occurrence after the fact without explicit user action.

| Operation | Raw history | Current projection |
| --- | --- | --- |
| First report | Append | Reported outcome |
| Correct report | Append linked replacement | Replacement outcome |
| Undo/retract | Append tombstone | Unknown |
| Delete for privacy | Physically remove authorized scope | Recompute/none |
| Source/plan change | No change | No change |

## 14. Activity-Family Boundaries

- Template activities: supported planned linkage.
- Work occurrences: supported linkage; completion means the user reports the work
  occurrence sufficiently performed, not payroll/timekeeping truth.
- Manual calendar events: supported linkage; calendar presence is not attendance.
- Sleep/recovery: use generic template semantics until a dedicated domain exists;
  no health claims or inferred sleep duration.
- Imported-calendar source appears in scheduled-block vocabulary but lacks a
  `DurableOccurrenceReference` family; planned execution linkage is deferred.
- Notes are optional user evidence and require bounded validation/privacy treatment.
- Quantity, distance, sets, dosage, and percentages are deferred.

## 15. Provenance, Observation, and Inference

| Claim producer | V1 authority | Provenance | Confidence treatment |
| --- | ---: | --- | --- |
| User report | Yes | `userReported` | Authoritative report, not objective verification |
| DayFrame timer | Later | `systemObserved` + method | Directly observed interval only |
| External integration | Later | `integrationObserved` + provider | Preserve source and imported timestamp |
| Schedule/time passage | No | `inferred` | Cannot author outcome |
| Learning model | No | `inferred` + model/policy version | Recommendation input only |

Do not add a vague confidence score in V1. Provenance and evidence kind communicate
what is known. Inferences live in derived observations, never raw records.

## 16. Derived Outcome, Progress, Adherence, and Language

The immutable correction chain deterministically selects the current record, from
which `OccurrenceOutcome` is derived. Progress requires an explicit goal and
denominator; no generic percentage should be manufactured. Unknowns remain visible
and are excluded or separately counted, never treated as misses.

If “adherence” is later retained, define it narrowly as a transparent comparison
between evidenced outcomes and the frozen effective plan, not moral success or
activity quality. Preferred UI language is “reported complete,” “reported partial,”
“reported skipped,” and “not reported.”

Historical observations may inform future recommendations through an explicit
learning/policy layer. A recommendation may propose a planning change, and only an
explicit user action may create authored/PlanDecision authority.

## 17. User-Day and Occurrence Materialization

Daily coordinates retain `userDayDate`; weekly occurrences retain canonical
`userWeekStartDate` and slot; work occurrences retain local start date and slot.
Historical snapshots additionally freeze effective user-day/timezone context so a
later preference change cannot regroup the past silently. DST ambiguity requires
zoned/offset instants, not local-clock strings alone.

An execution record materializes historical context at report time from the
effective plan. If no current Preview contains the occurrence, a canonical
occurrence/reference plus defensible historical context may still support
retroactive entry. Persisting old Preview objects is explicitly rejected.

## 18. Persistence, Versioning, Recovery, and Migration

**Proposed:** an independent `ExecutionHistory V1` envelope/surface with independent
durability status, desired checkpoint, retry, subscription, validation, and clear
semantics. It stays outside `DayFrameState`, Active V2, Profile V2, and PlanDecision
V1.

Envelope/version/parse failure protects the whole source. Entry-level semantic
failure quarantines invalid entries while preserving valid independent records,
provided correction referential integrity can be established. Corrupt correction
components should be quarantined as a component, not silently flattened. Recovery
abandonment requires explicit confirmation.

Future migrations must be pure, version-aware, idempotent, preserve raw evidence,
and never invent completion. Backup V3 (or later complete backup) must explicitly
compose Active, Profiles, PlanDecisions, and History with independent versions.

## 19. Retention, Volume, Storage, Privacy, Export, and Clear

One report plus occasional corrections per occurrence can produce thousands of
records over years. No silent retention limit is adopted; retain until explicit
user deletion. Local storage could host a bounded first version but is a poor
long-term fit because it serializes/replaces whole values synchronously and has
tight, browser-dependent quotas. IndexedDB or another collection-oriented store is
the long-term recommendation. Storage choice is deferred from the domain task.

Execution history is more sensitive than setup because it describes behavior,
absence, routines, and actual times. Minimize snapshots/notes, keep provenance,
avoid hidden telemetry, and give explicit export/delete control. Full local-data
clear must remove history; partial failure must remain observable and retryable.

## 20. V1 Scope Matrix

| Capability | V1 | Later | Reason |
| --- | ---: | ---: | --- |
| Independent record/revision UUID | Yes |  | Stable identity |
| Planned durable reference + snapshot | Yes |  | Lifetime-safe, readable history |
| Unplanned subject | Yes |  | Reality need not originate in plan |
| Complete/partial/skip report | Yes |  | Minimum useful outcomes |
| Unknown projection | Yes |  | Epistemic correctness |
| Correction/retraction chain | Yes |  | User error is inevitable |
| Optional actual time/duration/note | Yes |  | Factual qualification |
| Automatic missed |  | No planned adoption | Silence is not evidence |
| Cancel outcome |  | Yes | Semantics unresolved |
| Timer pause/resume events |  | Yes | Premature event sourcing |
| Integration provenance | Schema-ready | Yes | No current integration |
| Quantities/percentages |  | Yes | Activity-specific meaning needed |
| Progress/adherence/learning |  | Yes | Derived layers require separate tasks |
| History UI/persistence/Backup V3 |  | Yes | Separate bounded implementations |

## 21. Final Authority Hierarchy

```text
AUTHORED SETUP
  general intended pattern
        ↓
PLANDECISION
  accepted occurrence-scoped intent
        ↓
PREVIEW
  deterministic current plan (derived)

USER REPORT / DIRECT OBSERVATION
  evidence about reality
        ↓
EXECUTION RECORD REVISIONS
  independent historical authority
        ↓
CURRENT OUTCOME / PROGRESS OBSERVATIONS
  deterministic derived interpretation
        ↓
LEARNING / RECOMMENDATIONS
  non-authoritative proposals
        ↓ explicit acceptance only
AUTHORED SETUP or PLANDECISION
```

The planning and execution branches correlate through a durable occurrence
reference and frozen snapshot; neither branch rewrites the other.

## 22. Architectural Invariants

1. Planning never proves execution.
2. Missing execution evidence is unknown, not missed.
3. Preview regeneration does not affect history.
4. Recreated sources never inherit old records.
5. Deleted sources do not make history meaningless.
6. Current source edits do not rewrite snapshots.
7. PlanDecision changes do not rewrite execution.
8. Correction and retraction are explicit and traceable.
9. Scheduled timestamps never masquerade as actual timestamps.
10. Provenance distinguishes report, observation, and inference.
11. Derived progress never mutates raw history.
12. Learning never silently mutates authored or decision authority.

## 23. Terminology Glossary

- **Plan:** derived intended allocation for a window.
- **Planned occurrence:** canonical source occurrence considered by planning.
- **Accepted choice:** current PlanDecision authority for one occurrence.
- **Execution:** activity claimed by a report or established by direct observation.
- **Completion:** reporter says intended activity was sufficiently performed.
- **Planning omission:** instruction not to include an occurrence in the plan.
- **Execution skip:** report that an expected occurrence was not performed.
- **Missed:** unsupported V1 conclusion; not equivalent to silence.
- **Unknown/not reported:** no current authoritative execution record.
- **Actual time:** asserted or directly observed execution time.
- **Recorded time:** when DayFrame accepted the record revision.
- **Outcome:** current deterministic interpretation of record revisions.
- **History:** immutable accepted execution-record revisions and snapshots.
- **Progress:** derived measure against an explicit goal/denominator.
- **Adherence:** transparent derived comparison to effective historical plan, if
  later adopted.
- **Learning:** derived interpretation that may generate recommendations, never
  direct authority.

## 24. Confirmed, Proposed, Unresolved, and Deferred

### Confirmed findings

No current execution authority exists. Preview is derived. PlanDecision is planning
authority. `skipBlock`/`omitOccurrence` are planning omissions. Durable references
are lifetime-safe for supported current planned families. Active/Profile/Backup V2
contain setup, not history.

### Proposed architecture

Independent `ExecutionRecord V1`, immutable correction revisions, derived current
outcome, optional planned reference, mandatory snapshot, explicit provenance,
unknown-by-default, independent persistence/recovery, and derived-only learning.

### Unresolved questions

- Exact cancellation semantics.
- Exact timezone representation and behavior when the host timezone changes.
- Whether V1 persistence should begin in bounded local storage or directly in
  IndexedDB.
- Note size/content limits and granular subject deletion UX.
- Imported-calendar durable identity.
- Whether future user-entered actual time may be a single instant, interval, or both.

None blocks the Task 3.2 pure domain boundary if its schema preserves optional
time evidence and excludes imported-calendar planned linkage.

### Deferred work

Persistence, UI, timer/integration observation, cancellation, quantity schemas,
progress, adherence, learning, storage migration, and complete Backup V3.

## 25. Checkpoint, ADR, and Governance Updates

Published:

- `docs/checkpoints/CHECKPOINT_Phase_3_Execution_History_Semantics.md`
- `docs/adr/ADR_EXECUTION_RECORD_AND_COMPLETION_HISTORY_SEMANTICS.md`
- this result artifact.

`docs/architecture/DECISIONS.md`, `CURRENT_STATE.md`, and the roadmap were updated
only to register the accepted semantic checkpoint and next bounded task. The
architecture changelog was not modified because no product behavior shipped.

## 26. Recommended Implementation Sequence and Task 3.2

1. Pure identity/types/validation/correction projection.
2. Independent persistence/recovery/status/retry/export/clear.
3. Planned-link snapshot materialization.
4. Minimal reporting workflow.
5. History visibility/correction/deletion.
6. Derived progress, followed by a learning-policy audit.

Recommended next task:

> **Task 3.2 — Implement ExecutionRecord V1 Identity, Domain Semantics, Pure Validation, and Current-Outcome Projection**

It must not add persistence, store mutations, UI, progress, or learning.

## 27. Validation Performed

- Supplied/saved artifact `cmp`: identical.
- SHA-256 recorded for both copies.
- Phase 2 checkpoint, task index, final authority, source identity, durable
  reference, PlanDecision, Preview, skip application/replay, Active/Profile/Backup,
  user-day, and persistence boundaries inspected.
- Repository-wide semantic search performed across production, tests, and docs.
- No tests were run because no production or test code changed.
- `git diff --check`: passed with no output.
- Final repository status: three governance files modified; the ADR, checkpoint,
  and this result are new. The pre-existing immutable saved Task 3.1 copy remains
  untracked within the new `docs/implementation/phase-3/` directory and unchanged.

## 28. Final Determination

Task 3.1 is complete. Existing behavior was audited and classified; planning
omission and execution skip are separated; unknown, completion, partial, actual
time, provenance, correction, lifetime, persistence, recovery, privacy, progress,
and learning semantics are defined; a canonical checkpoint and ADR are published;
and the narrowest Task 3.2 boundary is identified. No execution-history production
feature, UI, persistence surface, progress system, learning system, or Backup V3
was implemented.
