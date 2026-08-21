# Task 2.24 Result — Source-Incarnation and Lifetime-Safe Occurrence Reference Semantics

## 1. Executive Determination

**Recommended:** adopt an immutable, opaque, collision-resistant incarnation for each durable-referenceable authored source lifetime and a separately versioned `DurableOccurrenceReference`. Keep `OccurrenceIdentity` V1 runtime-only.

An ordinary edit preserves incarnation. Creation, duplication, delete/recreate, and semantic replacement create a new incarnation. Active rehydration and recovery-grade backup restore preserve an established incarnation; profile load instantiates new active incarnations because a profile is a reusable pattern, not active lifetime authority. Every durable reference combines complete source lineage with the existing canonical occurrence coordinate. This contract is implementable, but the Setup draft currently loses the operation provenance needed to distinguish same-ID edit from delete/recreate, so explicit draft lifecycle identity is the immediate prerequisite.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/09700107-905f-470b-8bbc-a772bd396ab1/pasted-text.txt`
- Saved copy: `docs/implementation/phase-2/TASK_2.24_ESTABLISH_SOURCE_INCARNATION_AND_LIFETIME_SAFE_OCCURRENCE_REFERENCE_SEMANTICS.md`
- Both SHA-256: `b1d3954d470cd27162d05c7866343f772db164f8fc7044bfc38386c9e8623d3b`
- Supplied size: 2,718 lines, 72,003 bytes.
- **Confirmed:** byte-identical, complete, and ending with the prescribed completion sentence. Neither copy changed.

## 3. Evidence Reviewed

**Confirmed:** source types; allocator; Setup create/edit/delete flows; manual-event workflow; store mutation, rehydration, recovery, profile, backup, and clear paths; authored validation; cycle normalization/generation; occurrence constructors/tests; Tasks 2.10–2.15 and 2.23 results; and the durable-data ADR. Current executable behavior was authoritative.

## 4. Governing Task 2.23 Requirements

Every template reference needs template and recurrence lifetimes; manual references need event lifetime; work references need shift definition, cycle, and nested entry lifetimes; every conflict member is independently safe. Runtime V1 is prohibited as a durable foreign key. Durable PlanDecision persistence remains blocked until incarnation, reference validation, migration, and decision-format governance exist.

## 5. Source-Incarnation Working Definition

**Adopted:** a source incarnation is a stable system-assigned identity for exactly one semantic lifetime of one authored source. It survives ordinary edits but changes whenever creation/replacement begins a new lifetime, even when ID and content are reused.

## 6. Source ID Versus Incarnation

`id` is a readable/current-snapshot routing and relationship key. Incarnation is the durable lifetime discriminator. Canonical lineage carries source kind + ID + incarnation. Incarnation is identity-dominant; ID remains required for routing, validation, diagnostics, and preventing cross-kind or malformed matches.

## 7. Incarnation Stability Rule

Rename, duration/priority/time/date/range/configuration edits, reorder, enablement, and legal relationship edits preserve the edited object's incarnation. Such changes can stale or invalidate decisions without creating a new source lifetime.

## 8. Incarnation Replacement Rule

Explicit create, duplicate, delete/recreate, import-as-fork, and replacement of one object by another create a fresh incarnation. Matching IDs, timestamps, or structure never prove continuity.

## 9. Delete / Recreate Semantics

Always a new incarnation, including identical content and manually reused IDs. Deletion needs no tombstone for initial safety because retained references carry the retired incarnation.

## 10. Edit Versus Recreate Boundary

The semantic operation, not a final-state diff, decides continuity. Existing UI object edits are recognizable while the draft lives; store collection APIs receive only snapshots and cannot infer provenance.

## 11. Full Setup Commit Assessment

`commitAuthoredSetup` clones complete arrays and compares no lifecycle facts. Prior state + candidate state + ID equality is insufficient. Future commits must carry already-assigned incarnation metadata and/or explicit lifecycle operations established inside the draft before the snapshot reaches the store.

## 12. Same-ID Draft Replacement Hazard

**Confirmed critical blocker:** Setup can delete then add before commit. Allocation considers only currently occupied draft IDs, so deletion of the highest suffix permits immediate reuse. The final same-ID object is indistinguishable from an edit if incarnation is inferred at commit.

## 13. Explicit Mutation Identity Requirement

Setup must retain lifecycle provenance through draft operations: create assigns fresh incarnation, edit carries it, delete retires it, and replace is explicit. A store validator then enforces rather than guesses this contract. This need not require granular persisted commands.

## 14. Manual-Event Operation Boundary

The UI already distinguishes create (`editingManualEventId === null`), edit, and delete. It is sufficient for an authoring boundary to allocate/preserve incarnation, although `setManualEvents` alone remains snapshot-ambiguous and must not be trusted to infer it.

## 15. Incarnation Ownership

The Authoring Service/domain mutation boundary owns allocation and preservation; the store enforces accepted current-format state. UI may request create/update/delete but must not supply arbitrary lifetime tokens.

## 16. Incarnation Allocator Requirements

Opaque, immutable, non-content-derived, offline-capable, cross-device portable, privacy-preserving, and collision-resistant across independent installations. No library or encoding is selected.

## 17. Generation Strategy Matrix

| Strategy | Stable Across Edit | Distinguishes Recreate | Offline | Import/Restore Friendly | Collision Risk | Recommendation |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| content-derived | no | no for identical recreate | yes | ambiguous | structural alias | reject |
| ID-derived | yes | no | yes | unsafe | guaranteed reuse alias | reject |
| random opaque token | yes | yes | yes | yes | negligible if suitably strong | adopt |
| local monotonic token | yes | yes locally | yes | needs durable namespace | cross-device/rollback | reject alone |

## 18. Incarnation As Authored Identity Metadata

Incarnation is system-assigned durable identity/provenance metadata attached to an authored source lifetime. It is not user-entered intent, derived planning output, or a separate Domain Object.

## 19. Durability Requirement

An established incarnation must survive restart, active migration, and recovery artifacts that promise continuity. Runtime-only assignment is insufficient and must not become reference authority.

## 20. Source-Embedded Versus Registry Model

Embed incarnation with each active/recovery source representation. A detached ID registry risks drift, stale residue after clear, nested synchronization bugs, and non-portable backups. Artifact projections may intentionally omit active incarnation (profiles), so embedding must be surface-aware rather than blindly reusing one setup type everywhere.

## 21. Storage Model Matrix

| Model | Source Coupling | Portability | Replacement Clarity | Migration Complexity | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| embedded | strong/atomic | high | high | medium | adopt |
| registry | weak | low | low | high | reject |
| hybrid | duplicated | medium | medium | highest | reject absent new need |

## 22. Template Incarnation

Ordinary template edits preserve; delete/recreate and duplicate change. Profile instantiation creates fresh active identity; future recovery backup restores established identity.

## 23. Recurrence Incarnation

Recurrence is independently lifetime-bearing. Parameter/frequency edits preserve incarnation and trigger semantic revalidation; delete/recreate changes it.

## 24. Recurrence Retargeting

Changing `blockTemplateId` is a relationship edit to the same recurrence only when performed explicitly as update; lineage changes because the template component changes. Current Setup couples each recurrence to its template and exposes no retarget control. Arbitrary snapshot retarget without provenance must be rejected or treated as replacement by the future authoring boundary.

## 25. Template + Recurrence Composite Lineage

Adopt template kind/ID/incarnation + recurrence kind/ID/incarnation + canonical recurrence coordinate. Every component must match.

## 26. Canonical Template Occurrence Coordinates

Retain Task 2.10: daily/specific-weekday use `userDayDate` + slot; weekly/times-per-user-week use `userWeekStartDate` + stable canonical slot. Frequency/scope is explicit.

## 27. Times-Per-Week Slot Semantics

Slot remains assigned before window clipping. Reducing count makes removed slots occurrence-missing/stale; remaining slots are not renumbered from visible-window position. Increasing count creates new coordinates.

## 28. Manual-Event Incarnation

Edit, including time/date movement, preserves event incarnation and revalidates dependencies. Create/copy/delete-recreate changes it. The one-off coordinate is the event lifetime itself; date/time belongs in dependency facts, not a second identity coordinate.

## 29. Shift-Definition Incarnation

Time/name/workday edits preserve. Delete/recreate changes. Retargeting a nested entry changes work lineage because the referenced definition lifetime changes.

## 30. Shift-Cycle Incarnation

Range, mode, sequence, and ordinary configuration edits preserve cycle lifetime and revalidate occurrences. Delete/recreate or explicit cycle replacement changes it.

## 31. Nested Segment Incarnation

Required independently. Segment IDs are cycle-local in validation/allocation practice; durable lineage includes parent cycle and segment ID/incarnation. Edit preserves; delete/recreate changes.

## 32. Sequence-Entry Incarnation

Required independently. Assignment/day-offset edits preserve if explicit; removal/re-addition changes. Index/day offset is occurrence-producing state, not lifetime identity.

## 33. Nested Reordering Semantics

Reordering objects while retaining their explicit IDs/incarnations preserves lifetime. Sequence semantics are determined by `dayOffset`, which is revalidated. Array position must never establish identity.

## 34. Nested ID Scope

Top-level IDs are unique within their collections. Validator enforces segment and sequence-entry IDs in one shared namespace only inside each cycle; the same nested ID may occur in another cycle. Parent cycle lineage is therefore mandatory.

## 35. Work Occurrence Durable Lineage

Cycle lifetime + nested segment/sequence-entry lifetime + shift-definition lifetime + canonical local start date + slot. A mismatch in any source component is not the same work occurrence.

## 36. Work Reference Matrix

| Component | Needed? | Why |
| --- | ---: | --- |
| cycle ID | yes | routing/provenance |
| cycle incarnation | yes | cycle lifetime |
| nested ID | yes | cycle-local routing |
| nested incarnation | yes | delete/recreate safety |
| shift-definition ID | yes | routing/explanation |
| shift-definition incarnation | yes | work-source lifetime |
| local start date | yes | canonical occurrence coordinate |
| slot | yes | explicit stable discriminator; currently 0 |

## 37. Conflict Reference Composition

A conflict target contains complete durable references for every participant plus conflict kind/material fingerprint. No shared or abbreviated lifetime shortcut is allowed.

## 38. Conflict Canonicalization

Treat participants as an unordered set: structurally validate uniqueness, derive each supported reference's canonical semantic key, sort lexicographically by that version-defined key, and compare the normalized set. Insertion order is irrelevant.

## 39. Conflict Fingerprint Separation

References prove participant continuity; the fingerprint proves materially equivalent overlap/constraint facts. Same participants with changed conflict facts require revalidation and may not inherit acceptance automatically.

## 40. Source Lifetime Versus Occurrence Coordinate

Lifetime answers “which generating sources?” Coordinate answers “which occurrence of those sources?” Both are required; neither substitutes for the other.

## 41. DurableOccurrenceReference Working Definition

A versioned structured reference containing complete lifetime-safe source lineage and a window-invariant canonical coordinate, suitable for persisted PlanDecision targets and explicit resolution.

## 42. OccurrenceIdentity V2 Assessment

One concept is attractive, but it couples lightweight runtime generation to durable compatibility and forces runtime consumers through migration semantics. Reject as the first durable model.

## 43. Separate DurableOccurrenceReference Assessment

Best separation: independent compatibility/versioning, complete durable semantics, and unchanged runtime V1. Mapping code is required but can be centralized and validated.

## 44. V1 + Incarnation Companion Assessment

Reject as canonical. Parallel structures can disagree, duplicate source IDs/coordinates, and make equality/versioning ambiguous.

## 45. Reference Model Matrix

| Model | Runtime Simplicity | Durable Clarity | Version Independence | Drift Risk | Migration Complexity | Recommendation |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OccurrenceIdentity V2 | medium | medium | low | low | high | defer/reject now |
| separate durable reference | high | high | high | low with one constructor | medium | adopt |
| V1 + companion | medium | low | medium | high | medium | reject |

## 46. Canonical Durable Reference Recommendation

Adopt a separate structured, discriminated, independently versioned `DurableOccurrenceReference` family for template, manual-event, and work occurrences. Its first format includes the components in Sections 25, 28, and 35.

## 47. Runtime OccurrenceIdentity Future

V1 remains unchanged for ephemeral Preview equality and overlap-window stability. Durable references and V1 identities may coexist indefinitely; both should eventually be produced from one canonical occurrence-provenance input to prevent construction drift.

## 48. Reference Versioning

Required independently from active/profile/backup/PlanDecision formats and from runtime occurrence identity. Unsupported versions are preserved and not applied.

## 49. Incarnation Token Versioning

No nested token version is needed if the token is opaque. The containing source/reference format governs parsing; equality treats token bytes/string exactly.

## 50. Active Rehydration Semantics

Current-format active load preserves stored incarnation exactly. It neither rotates nor reallocates. Invalid/missing current-format metadata enters explicit recovery, not silent repair.

## 51. Legacy Active-State Incarnation

Existing active data has none. A migration establishes one baseline incarnation for each source currently present; it makes no claim about pre-migration lifetime history.

## 52. Legacy Migration Safety

No durable PlanDecision exists, so no old decision can be remapped incorrectly. This unique migration window closes before the first durable decision write.

## 53. Initial Lifetime Baseline

Adopt the migration moment as the beginning of provable lifetime continuity for legacy objects. Nested and referenced sources all receive independent baselines.

## 54. Migration Idempotence

Assignment is authoritative only after the complete rewritten snapshot is atomically durable and validated. A failed write leaves the old snapshot authoritative; a retry may allocate anew because no prior token was committed or exposed as durable identity. If the platform cannot prevent exposure before commit, use a durable journal/resume token. Never allocate afresh on every successful startup normalization.

## 55. Migration Strategy Matrix

| Strategy | Stable Across Failed Retry | Collision Safety | Write Before Runtime Use | Complexity | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| random + atomic rewrite/activation gate | committed result yes | high | yes | medium | adopt |
| deterministic source/surface token | yes | depends on namespace | yes | medium | reject; risks aliases/privacy |
| migration journal | yes | high | journal first | high | fallback if atomic gate impossible |

## 56. Profile Incarnation Semantics

Profiles are reusable patterns. Loading instantiates fresh active incarnations for every source and nested entry. Old decisions cannot reattach through matching IDs.

## 57. Profile Model Matrix

| Model | Reusable Pattern | Same Lifetime | Prevents Reattachment | Portability | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| preserve | weak | yes | no | high | reject |
| instantiate on load | high | no | yes | high | adopt |
| hybrid | ambiguous | conditional | conditional | medium | reject |

## 58. Profile Save Semantics

Save pattern data and readable relationships, not active incarnation. If internal pattern identity is later needed, it must be explicitly distinct from active source incarnation. `DayFrameAuthoredSetup` should not conceal this surface distinction.

## 59. Backup Incarnation Semantics

Future recovery-grade backup formats preserve source incarnation and must coordinate any included PlanDecisions. Current V1 has no incarnation/decisions; importing V1 establishes fresh baseline lifetimes at conversion.

## 60. Backup Model Matrix

| Model | Recovery Fidelity | Decision Continuity | Duplicate-Lifetime Risk | Expectation | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| preserve | high | high | explicit replacement only | high | adopt for future format |
| instantiate | low | none | low | poor | reject as recovery default |
| context-dependent | high | explicit | controlled | high | future restore/fork option |

## 61. Restore Versus Instantiate Determination

Active rehydrate and future backup **restore**; profile load and V1 legacy import **instantiate/baseline**. A future “import as fork” explicitly instantiates. Artifact purpose justifies the asymmetry.

## 62. Active Replacement Semantics

Whole-state replacement must declare its mode. Profile replacement creates lifetimes; backup recovery restores; arbitrary same-ID replacement without mode/provenance is not authorized.

## 63. Active Recovery Semantics

Replacing a protected checkpoint with current session state preserves current session incarnations and persists them atomically. Abandon/reset retires protected/current sources; later sources get fresh tokens. Current pre-incarnation recovery behavior remains unchanged until migration design.

## 64. Clear / Reset Semantics

Clear removes source authority and any associated registry residue (none is recommended). Subsequent creation always allocates fresh incarnations even if IDs repeat.

## 65. Duplicate / Copy Semantics

Copy creates new ID where required and always fresh incarnation. It copies authored values, never lifetime identity.

## 66. Cross-Device Requirements

Tokens cannot depend on device/session identity and must retain exact equality through recovery export/import.

## 67. Collision-Safety Requirements

Independent offline instances must safely allocate without coordination. Strong opaque randomness is required; a local counter alone is insufficient.

## 68. Source ID Mutation Assessment

**Confirmed:** current UI does not expose ID editing; edits spread existing objects. Store/import callers can submit changed IDs, but no operation semantics exist. Future authoring treats ID as immutable; an ID change is replacement unless an explicitly governed rename operation later preserves incarnation and updates all relationships atomically.

## 69. Durable Reference Resolution

Resolve by supported version, kind, complete ID/incarnation lineage, then coordinate. Same ID/different incarnation is lifetime mismatch. Same incarnation/different ID is invalid/inconsistent, not an automatic rename. Missing source and missing occurrence are distinct.

## 70. Nested Resolution

Cycle, nested entry, and shift definition must all match ID/incarnation. Resolve nested IDs only inside the matched cycle.

## 71. Partial Lifetime Match

Any mismatch means the original work occurrence does not resolve. A changed shift-definition lifetime is `sourceLifetimeMismatch`; ordinary edits to the same incarnation proceed to dependency revalidation.

## 72. Reference Resolution Status Requirements

Future results need at least: matched, source missing, source-lifetime mismatch, occurrence missing, structurally invalid, unsupported version, and ambiguous legacy reference. Applicability mapping to stale/orphaned/unresolved remains a PlanDecision-layer concern.

## 73. Unsupported Reference Semantics

Preserve authentic user data non-destructively, do not apply it, expose unsupported/recovery-required status, and offer governed conversion when available. Never fall back to V1 ID matching.

## 74. Reference Migration

Reference-format conversion preserves established incarnation and semantic coordinate. A representation version change is not a lifetime rotation.

## 75. Incarnation Rotation

Never automatic for edit or migration. Rotation is an explicit source replacement/corruption-recovery action with corresponding decision orphaning/revalidation.

## 76. Profile Duplication

Duplicated/saved profiles are pattern copies and carry no active incarnation. Each activation instantiates independently.

## 77. Backup Duplication

Copying a future recovery file preserves represented incarnations. Duplication of the file does not fork identity.

## 78. Repeated Backup Import

Repeated recovery import restores the same lifetimes and rewinds their state. Because import replaces rather than merges, simultaneous duplicate active lifetimes do not arise. Decisions must revalidate against restored facts.

## 79. Restore Versus Fork

Current “Import backup” is recovery and should mean restore for a future incarnation-aware format. A fork requires a distinct future user action and fresh incarnations.

## 80. Backup Rollback Implications

Same lifetime may return to older content. Matching decisions can become effective/dormant/stale after full dependency revalidation; incarnation match alone never guarantees application.

## 81. Existing Decision Reattachment Implications

Profile load prevents reattachment via fresh lifetimes. Backup restore may legitimately reactivate decisions only when the backup decision/source transaction and dependency facts support it. Current V1 contains no decisions, so none reattach.

## 82. PlanDecision Surface Separation

Incarnation belongs with source authority; PlanDecision stores references but never owns source identity. The decision surface remains separate from setup authority.

## 83. Current V1 Profile / Backup Implications

Both remain readable and unchanged. Profiles instantiate on load. V1 backup import establishes new baseline incarnations in a future converter; it cannot claim historical continuity it never encoded.

## 84. Active Local Format Implications

Active persistence needs an independently versioned migration before incarnation authority is introduced. In-memory normalization alone is insufficient.

## 85. DayFrameAuthoredSetup Implications

The current shared type spans active, profile, and backup data despite differing identity semantics. Future work needs explicit surface projections/wrappers: active/recovery representations carry incarnation; reusable profile pattern data does not. Do not add one optional field and infer meaning from presence.

## 86. Architecture Category / Provenance

Aligned as Named Domain Object identity/provenance metadata: system-assigned, durable, source-owned, non-derived, and explainable. No token Domain Object is justified.

## 87. Authoring-Service Responsibility

Creation assigns, update preserves, delete retires, duplicate replaces, artifact activation applies declared restore/instantiate policy. This is an explicit future Authoring Service invariant.

## 88. Store Enforcement Requirements

Current-format validation must reject missing/malformed incarnation, duplicate active incarnations, inconsistent same-incarnation/source pairs, unauthorized caller resurrection, and incomplete nested lineage. Restore is a separate authorized ingress mode.

## 89. Duplicate / Reuse Prohibition

No two incompatible live sources share an incarnation. Normal creation never reuses a retired token. Only explicit recovery restore may reintroduce a historical incarnation.

## 90. Tombstone Requirement

Not required initially. Strong random tokens plus retained references distinguish absence from replacement. Add history only for a separate audit/retention need.

## 91. Orphan Resolution

Absent lineage yields orphan/source-missing without destructive deletion. Tombstones are unnecessary to make that safe; finer “deleted versus unloaded” explanation may use replacement context.

## 92. Historical Source Reappearance

Recovery restore can make an orphaned reference resolvable again; profile activation cannot. Reapplication still requires coordinate and dependency validation.

## 93. Explainability Requirements

References retain kind/readable IDs and lineage roles so UI can name the template/recurrence or cycle/entry/shift. Users need “original source lifetime is no longer active,” never raw token display.

## 94. Canonical Equality / Key Requirements

Use structural, version-defined equality; never object identity or incidental JSON property order. Derive canonical keys from normalized supported references for indexing/canonical conflict sorting, but persist structured targets as authority and independent decision IDs to reduce schema-key coupling.

## 95. Structural Validation Versus Resolution

Validation proves understood shape/version/components. Resolution separately consults current source authority. A well-formed missing reference is unresolved/orphaned, not malformed.

## 96. Migration Atomicity

Incarnation allocation + complete active rewrite + validation is one recoverable boundary. Runtime must not advertise migrated identity before durable success; failure preserves the old raw checkpoint.

## 97. Profile Migration Dependencies

Because profiles intentionally omit active incarnation, they need explicit pattern-format evolution rather than bulk active-token assignment. Existing invalid/raw profile preservation gaps from Task 2.17 remain a prerequisite for any collection rewrite.

## 98. Backup Versioning Implications

Incarnation-aware recovery requires a new backup version/envelope and long-lived converter. V1 stays supported and unmodified.

## 99. PlanDecision Persistence Prerequisites

Before first write: explicit Setup lifecycle provenance; active source incarnation types/allocation/validation; atomic active migration; canonical versioned durable references/resolver; decision format/version/unsupported recovery; and transaction policy for decisions with source replacement/backup.

## 100. Implementation Sequencing

Use staged sequence: authoring-operation identity first; durable source model/format/migration together; reference model/resolver; then PlanDecision durability. Do not introduce authoritative runtime-only incarnation.

## 101. Setup Workflow Prerequisite Assessment

**Blocking prerequisite confirmed.** The current draft can erase delete/recreate history and reuse the same ID. Correct incarnation cannot be inferred at commit. Draft-local lifecycle identity/explicit operations must be established first.

## 102. Runtime-Only Incarnation Assessment

Reject. It offers no durable reference safety, creates restart churn, and risks decisions binding to uncommitted identity. Runtime V1 already serves ephemeral behavior.

## 103. Staging Matrix

| Staging Model | Immediate Value | Migration Debt | Durable Safety | Complexity | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| runtime first | low | high | low | medium | reject |
| durable + migration together | high | low | high | high | second stage |
| operation boundary first | enabling | low | prerequisite | medium | first stage |

## 104. Interim OccurrenceIdentity

V1 remains adequate and unchanged for ephemeral Try/Preview. No PlanDecision implementation is authorized before lifetime-safe reference work.

## 105. Source-Incarnation Matrix

| Source Type | Current ID Scope | Edit Preserves? | Recreate New? | Durable Reference? | Artifact Policy |
| --- | --- | ---: | ---: | ---: | --- |
| template | collection | yes | yes | yes | profile instantiate; backup restore |
| recurrence | collection | yes | yes | yes | same |
| manual event | collection | yes | yes | yes | same |
| shift definition | collection | yes | yes | yes | same |
| shift cycle | collection | yes | yes | yes | same |
| segment | cycle-local shared work-entry scope | yes | yes | yes | same |
| sequence entry | cycle-local shared work-entry scope | yes | yes | yes | same |

## 106. Operation Matrix

Applies to every listed source type.

| Operation | Preserve | New | Restore Existing | Unresolved |
| --- | ---: | ---: | ---: | ---: |
| ordinary edit | yes | no | no | no |
| delete | no | no | no | retired |
| recreate same ID | no | yes | no | no |
| duplicate | no | yes | no | no |
| profile load | no | yes | no | no |
| future backup import | no | no | yes | no |
| V1 backup import | no | yes baseline | no | no |
| active rehydrate | yes | no | yes | no |
| legacy migration | no prior token | baseline | no | no after commit |
| clear then recreate | no | yes | no | no |

## 107. Artifact Semantics Matrix

| Surface | Reusable Pattern? | Recovery Continuity? | Store Incarnation? | Action |
| --- | ---: | ---: | ---: | --- |
| active local | no | yes | yes, future format | preserve/restore |
| saved profile | yes | no | no active token | instantiate |
| future backup | no | yes | yes | restore |
| PlanDecision | n/a | references source | target reference only | n/a |

## 108. Durable Reference Matrix

| Kind | Lifetime Components | Coordinate | V1 Adequate? | Durable Model |
| --- | --- | --- | ---: | --- |
| daily template | template + recurrence | day + slot | no | separate reference |
| weekday template | template + recurrence | day + slot | no | separate reference |
| weekly template | template + recurrence | week start + slot | no | separate reference |
| times/week template | template + recurrence | week start + slot | no | separate reference |
| manual event | manual event | inherent one-off | no | separate reference |
| work segment | cycle + segment + shift | local start + slot | no | separate reference |
| work sequence | cycle + sequence entry + shift | local start + slot | no | separate reference |

## 109. Representation Matrix

Section 45 is adopted: separate `DurableOccurrenceReference`; V2 is deferred; companion model rejected.

## 110. Migration Matrix

| Surface | Existing Incarnation? | Initial Lifetime Possible? | Rewrite? | Recovery Requirement |
| --- | ---: | ---: | ---: | --- |
| active local | no | yes, migration baseline | yes | preserve raw on failure |
| profiles | no | pattern does not need active token | format-specific only | preserve invalid entries |
| backups V1 | no | yes at import baseline | source file never rewritten | conversion/rejection path |
| runtime Preview | V1 only | n/a | no | n/a |

## 111. Behavioral Invariants

All 18 candidate invariants are adopted with one refinement: restore may reintroduce a retired incarnation only through an explicitly authorized recovery artifact. IDs/content never establish lifetime; edits preserve; create/recreate/copy change; tokens are opaque/offline collision-resistant; every occurrence/conflict reference is complete and window-invariant; unsupported references are preserved; committed migration establishes the baseline; later migrations preserve it; profile and backup policies differ by purpose; and reused IDs never inherit decision authority.

## 112. Required Future Test Contract

Tests must directly cover unique create, edit preservation, same-ID delete/recreate, copy, collision rejection; Setup same-ID atomic replacement versus edit; manual-event operations; every work lineage component and nested reorder; overlapping-window durable equality, new-incarnation inequality, conflict set ordering, missing/mismatch/unsupported resolution; repeated profile activation with fresh tokens; future backup preservation/repeated restore and V1 baseline conversion; migration failure/atomic retry; and current plural-cycle compatibility.

## 113. Architectural Alignment Assessment

| Principle | Assessment | Basis |
| --- | --- | --- |
| explicit authority | Aligned target | operation mode owns continuity |
| NDO identity/provenance | Aligned | metadata stays source-owned |
| deterministic planning | Aligned | canonical lineage/coordinates |
| explainability | Aligned | readable provenance retained |
| compatibility/user preservation | Aligned target | versioned non-destructive handling |
| source/decision separation | Aligned | source owns token; decision references |
| current executable support | Partially aligned | Setup provenance and formats absent |
| epistemic integrity | Aligned | no ID/content-based lifetime claim |

## 114. Compatibility Assessment

Current V1 active/profile/backup readers remain. No historical lifetime-dependent decisions exist, allowing a clean initial baseline. No reader is retired. Profile/backup semantics must be encoded in independent future versions; unsupported data remains preserved under the ADR.

## 115. Test Coverage Assessment

**Confirmed:** 26 test files cover collision-free current-scope allocation, UI edit/delete/create flows, validation, local rehydration/recovery, profile/backup replacement, cycle work generation, and V1 window-invariant identity. **Not found:** incarnation allocation/preservation, same-ID draft lifecycle provenance, restore-versus-instantiate enforcement, reference resolution/versioning, migration atomicity, and PlanDecision lifetime behavior. Those are future tests, not gaps in this investigation.

## 116. Open Questions

Concrete field names/token encoding; exact active/profile/backup version numbers; whether atomic local rewrite alone suffices or needs a journal; future explicit restore-versus-fork UI; reference dependency fingerprint schema; retention of orphaned decisions; and transactional inclusion of decisions in future backups. None blocks the semantic contract; each belongs to its implementation/governance task.

## 117. Recommended Implementation / Investigation Sequence

1. Establish explicit draft/source create-update-delete-replace authority and lifecycle provenance without persistence changes.
2. Define independent active/profile/backup format evolution and recovery behavior for source identity.
3. Implement source-embedded incarnations, allocator, validation, active atomic migration, and profile instantiate/backup restore adapters together.
4. Implement/version durable occurrence references, canonical keys, structural validator, resolver, and tests.
5. Define/version PlanDecision persistence and source-replacement transactions.
6. Only then implement PlanDecision authoring/replay/UI.

## 118. Recommended Next Task

**Task 2.25 — Establish Explicit Source Creation, Update, Deletion, and Replacement Authority for Incarnation Preservation.** It should resolve Setup draft lifecycle provenance and store enforcement boundaries before adding durable fields.

## 119. Deviations

None. Only this result artifact was added; no production, test, source ID, persistence, format, identity, PlanDecision, governance, or checkpoint change was made.

## 120. Discoveries and Deferred Work

The Setup same-ID hazard is executable, not theoretical. Nested work IDs share a cycle-local segment/sequence namespace. Profiles and backups require intentionally different identity projection. Legacy V1 backup cannot restore identity it never stored. All implementation, concrete encoding, migrations, PlanDecision work, UI, tombstones, and governance adoption are deferred.

## 121. Validation

- Artifact SHA-256 and immutability: confirmed; supplied and saved copies remain byte-identical at `b1d3954d470cd27162d05c7866343f772db164f8fc7044bfc38386c9e8623d3b`.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Full Vitest suite: 26 files, 469 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed.
- Task-specific executable/test changes: none.
- Task-specific architecture governance/checkpoint changes: none.
- Task-specific change: this result artifact only.
- Reference audit: covered every required source, operation, artifact ingress, recovery boundary, nested work path, and occurrence constructor.
- Earlier cumulative Phase 2 executable, test, and documentation changes were already present in the worktree before Task 2.24 and were preserved without attribution to this task.

## 122. Final Completion Determination

Task 2.24 is complete. DayFrame now has an evidence-backed contract for source lifetime, all durable-referenceable source graphs, artifact-specific restore/instantiate behavior, an independently versioned durable occurrence-reference model, migration safety, and dependency-correct staging. The current Setup operation-provenance gap is explicitly identified as the next prerequisite, and no unauthorized implementation occurred.

**Task 2.24 is complete when DayFrame has an evidence-backed source-incarnation contract for every durable-referenceable source type, a canonical lifetime-safe occurrence-reference model, explicit edit/create/delete/restore/migration semantics, profile and backup lifetime policies, and a dependency-correct implementation sequence, with no unauthorized incarnation, persistence, migration, PlanDecision, or occurrence-identity implementation.**
