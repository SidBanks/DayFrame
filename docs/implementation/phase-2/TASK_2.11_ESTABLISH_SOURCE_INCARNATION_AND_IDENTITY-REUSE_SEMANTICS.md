# Task 2.11 — Establish Source-Incarnation and Identity-Reuse Semantics

**Project:** DayFrame  
**Phase:** Phase 2 — Authority and State Alignment  
**Task ID:** 2.11  
**Execution type:** Bounded investigation and architectural determination  
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing the investigation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution findings must be recorded in a separate result artifact:

`TASK_2.11_ESTABLISH_SOURCE_INCARNATION_AND_IDENTITY_REUSE_SEMANTICS_RESULT.md`

This task is primarily investigative.

Do not modify production code, tests, public types, persistence formats, architectural governance documents, checkpoints, or unrelated documentation unless this specification explicitly authorizes such a change.

No production implementation is authorized by this task.

---

# 2. Purpose

Task 2.10 introduced explicit Version 1 semantic occurrence identity for supported template, work, and manual-event occurrences.

That work established deterministic runtime semantic equality across regeneration, overlapping preview windows, placement changes, preview transformations, and store snapshot boundaries.

Task 2.10 also established an explicit limitation:

> Authored source IDs can currently be deleted and reused. Version 1 occurrence identity therefore cannot distinguish separate incarnations that reuse the same source IDs.

For that reason, Version 1 occurrence identity was classified as suitable for runtime semantic equality but not yet suitable as a durable foreign key.

Task 2.11 must determine the actual source-incarnation semantics of the current system before DayFrame either:

- strengthens occurrence identity;
- introduces durable references to occurrences;
- introduces PlanDecision state that may refer to occurrences;
- changes authored-source identifier generation;
- or assumes that deletion and recreation preserve or terminate semantic identity.

The purpose of this task is not to add incarnation identifiers.

The purpose is to establish what deletion, recreation, replacement, duplication, import, profile load, backup import, clear/reset, and identifier reuse currently mean for source identity, and what architectural contract DayFrame requires going forward.

---

# 3. Governing Evidence

The investigation must be grounded primarily in executable production behavior and direct tests.

Relevant evidence includes, but is not limited to:

- Task 2.1 authoritative/derived-state boundary findings;
- Tasks 2.2–2.9 Phase 2 authority findings and resulting implementation;
- Task 2.10 explicit Versioned Occurrence Identity specification and result;
- `code/src/core/occurrences/occurrenceIdentity.ts`;
- authored source types;
- source-creation workflows;
- source-edit workflows;
- source-delete workflows;
- recurrence creation/edit/delete behavior;
- shift-definition creation/edit/delete behavior;
- shift-cycle and segment creation/edit/delete behavior;
- manual-event creation/edit/delete behavior;
- template creation/edit/delete behavior;
- profile save/load behavior;
- backup export/import behavior;
- active-state rehydration and normalization;
- clear/reset behavior;
- demo/seed initialization behavior if still relevant;
- ID-generation helpers;
- tests that directly establish identifier behavior.

Architecture and governance documents may provide supporting intent, but executable behavior must take precedence when describing current implementation behavior.

Do not infer semantic identity solely from variable names or ID strings.

---

# 4. Required Investigation Questions

Task 2.11 must answer the following questions with evidence.

## 4.1 What Is a Source Incarnation?

Determine whether the current implementation contains any explicit concept equivalent to:

> one continuous lifetime of one authored source

Determine whether source identity currently means only:

    same source ID

or whether any additional information distinguishes:

    source A with ID X

from:

    source A deleted
        ↓
    new source B later created with ID X

If no incarnation concept exists, state that explicitly.

Do not invent one.

## 4.2 Which Authored Sources Participate in Occurrence Identity?

Inventory every authored source whose identity contributes directly or indirectly to Task 2.10 `OccurrenceIdentity`.

At minimum investigate:

- block templates;
- block recurrences;
- shift definitions;
- shift cycles;
- cycle segments / sequence entries;
- manual events.

For each source identify:

- authoritative ID field or fields;
- where the ID is created;
- whether the user can edit the ID;
- whether deletion is supported;
- whether recreation is supported;
- whether the same ID can later reappear;
- whether duplicate IDs are rejected, tolerated, overwritten, or ambiguous;
- whether replacement preserves the same ID;
- whether profile/backup replacement can reintroduce an earlier ID.

---

# 5. Identifier Creation Inventory

Trace all supported production creation paths for source identifiers.

Determine whether identifiers are:

- fixed constants;
- user supplied;
- derived from another value;
- timestamp based;
- random;
- sequence based;
- generated from collection state;
- generated by UI code;
- generated by store code;
- generated by a domain/core helper;
- imported from durable data.

For each ID-producing path, determine what uniqueness guarantee actually exists.

Do not describe an ID as globally unique, permanently unique, or incarnation-safe unless executable evidence establishes that property.

---

# 6. Delete and Recreate Semantics

For each relevant source class, determine the current behavior of:

    create
        ↓
    delete
        ↓
    create again

Determine whether the second creation:

- necessarily receives a different ID;
- usually receives a different ID but without a guarantee;
- can intentionally receive the old ID;
- can accidentally receive the old ID;
- inherits the old ID through cloning/import/replacement;
- or cannot currently be created through a supported workflow.

Separate:

    current practical behavior

from:

    architectural guarantee

A low probability of collision is not equivalent to an identity contract.

---

# 7. Edit Versus Replacement Semantics

Determine what the current system considers an edit of an existing source versus replacement by another source.

For each relevant authored source determine whether editing:

- preserves its ID;
- replaces its object while retaining its ID;
- generates a new ID;
- can alter identity-bearing fields;
- or varies by workflow.

Determine whether an edited source is currently treated as the same semantic source for occurrence-identity purposes.

Record current behavior without assuming that it is the desired future contract.

---

# 8. Recurrence Identity Relationship

Task 2.10 template occurrence identity contains both:

- template ID;
- recurrence ID.

Determine the lifecycle relationship between those two authored sources.

Investigate:

- whether recurrence replacement can retain an ID;
- whether deleting and recreating a recurrence can reproduce an earlier identity;
- whether moving a recurrence between templates is possible;
- whether a recurrence ID is unique globally or only within a template;
- whether recurrence edits that materially alter generated occurrences retain the same recurrence identity.

Determine which changes currently preserve semantic occurrence identity and which changes produce different Task 2.10 identities.

---

# 9. Work-Source Identity Relationship

Task 2.10 work identity contains:

- cycle ID;
- segment / sequence-entry ID;
- shift-definition ID;
- local start date;
- slot.

Investigate the lifecycle semantics of each identity-bearing authored component.

Determine whether replacement or reuse of any one of these IDs can cause two different authored source histories to produce structurally equal work occurrence identities.

Include:

- cycle deletion/recreation;
- segment or sequence-entry deletion/recreation;
- shift-definition deletion/recreation;
- reassignment of a segment to another shift definition;
- edits to shift times or other schedule-defining values while IDs remain stable.

---

# 10. Manual-Event Identity Relationship

Task 2.10 manual-event identity depends on the authored manual-event ID.

Determine:

- how manual-event IDs are created;
- whether edit preserves the ID;
- whether delete/recreate can reuse it;
- whether import/profile replacement can restore an older event carrying the same ID;
- whether two materially different events can exist over time with the same ID.

Establish the exact limitation this creates for semantic occurrence identity.

---

# 11. Duplicate-ID Behavior

Investigate whether current runtime, persistence, profile, backup, and normalization boundaries enforce uniqueness for identity-bearing authored IDs.

For each relevant source determine what happens if duplicate IDs are present.

Possible classifications include:

- explicitly rejected;
- normalized;
- last writer wins;
- first match wins;
- both survive;
- behavior depends on caller;
- undefined / not directly protected.

Where duplicate IDs can survive, identify downstream lookup or occurrence-generation behavior that depends on those IDs.

Do not repair duplicate behavior in this task.

---

# 12. Durable Rehydration and Identity

Determine how durable data affects source lifetime semantics.

Investigate:

- active local-state rehydration;
- profile load;
- backup import;
- compatibility normalization.

Answer whether a source restored from durable data is currently treated as:

- continuation of the previous source;
- a new incarnation;
- indistinguishable from either interpretation.

Determine whether the current system stores any creation token, incarnation number, generation number, UUID lifetime marker, tombstone, or other durable evidence that could distinguish those cases.

---

# 13. Profile Replacement Semantics

Task 2.1 established that loading a profile performs full active-authored replacement.

Determine the identity implications.

Example:

    active source ID X
        ↓
    load profile containing source ID X

Determine whether DayFrame can establish that the post-load source is:

- the same source;
- a restored earlier version of the same source;
- a different source that happens to share an ID;
- or currently indistinguishable.

Repeat the analysis for identity-bearing source combinations where necessary.

---

# 14. Backup Import Semantics

Perform the same analysis for backup import.

Determine whether importing authored data carrying an existing or previously used source ID has any explicit incarnation semantics.

Determine whether repeated import of the same backup is distinguishable from:

- restoration;
- replacement;
- recreation;
- duplication;
- or a new incarnation.

Do not change backup compatibility or versioning.

---

# 15. Clear / Reset Semantics

Determine the identity consequences of:

    clear
        ↓
    later create/import/load sources

Does clear establish any durable or runtime boundary indicating that later sources are new incarnations?

Determine whether previously used IDs can return after clear through:

- normal creation;
- profile load;
- backup import;
- initialization;
- or other supported paths.

---

# 16. Occurrence Identity Collision Analysis

Using the actual Task 2.10 Version 1 identity constructors, identify the conditions under which two logically distinct source histories can produce structurally equal `OccurrenceIdentity` values.

Separate collision classes into at least:

1. same continuing source, same occurrence;
2. same continuing source after ordinary edit;
3. deleted and recreated source with reused ID;
4. restored historical source through profile or backup replacement;
5. duplicate source IDs existing simultaneously;
6. materially changed recurrence/work definition retaining the same source IDs;
7. any other collision class discovered.

For each class determine whether structural identity equality currently means semantic sameness with confidence, ambiguity, or known mismatch.

---

# 17. Runtime Semantic Equality Assessment

Reassess Task 2.10's conclusion that Version 1 identity is safe for runtime semantic equality.

Determine the exact scope in which that statement remains valid.

For example, distinguish if necessary between:

    two regenerations from one continuous authoritative state lineage

and:

    two previews separated by source deletion/recreation or full authored replacement

If Task 2.10's wording requires qualification, document the qualification.

Do not change Task 2.10's immutable artifact.

---

# 18. Durable Foreign-Key Readiness Assessment

Determine exactly what is missing before `OccurrenceIdentity` could safely become a durable reference.

Possible requirements may include, but are not limited to:

- durable source-incarnation identity;
- stronger source-ID uniqueness;
- tombstone semantics;
- immutable source IDs;
- replacement semantics;
- migration/versioning rules;
- durable occurrence-identity versioning;
- referential validation.

These are investigation candidates, not assumed requirements.

Only identify requirements supported by evidence.

---

# 19. PlanDecision Dependency Assessment

Determine whether source-incarnation semantics must be resolved before DayFrame can define or implement PlanDecision behavior.

Distinguish at least:

    runtime/session-only PlanDecision semantics

from:

    durable PlanDecision semantics

and:

    PlanDecision semantics intended to survive authored replacement,
    profile load, backup import, or source recreation

The result must answer:

> Does PlanDecision work require source-incarnation implementation now, or can PlanDecision semantics be investigated independently while occurrence references remain runtime/session-scoped?

Do not define PlanDecision behavior beyond what is necessary to answer this dependency question.

---

# 20. Source-Incarnation Necessity Determination

The result must make one explicit determination from the evidence:

## A. Required Immediately

Source-incarnation semantics must be implemented before the next Phase 2 authority work can proceed safely.

## B. Required Before Durable Occurrence References

Current runtime identity is sufficient for near-term Phase 2 work, but explicit source incarnation must exist before occurrence identity or decisions referencing it become durable.

## C. Not Currently Required

Existing source identity guarantees are sufficient even for the currently anticipated durable use.

## D. Insufficient Evidence

The repository does not provide enough evidence to choose safely.

The determination must explain why.

Do not choose a stronger requirement merely because it would make the architecture cleaner.

---

# 21. Incarnation Model Options

If the investigation determines that explicit source incarnation will eventually be required, identify the smallest defensible model options.

Examples may include:

    immutable globally unique source ID itself defines incarnation

or:

    logical source ID + incarnation token

or another evidence-supported model.

For each viable option describe:

- what it would distinguish;
- what existing behavior it would preserve;
- whether it would require durable schema changes;
- whether historical data could supply the required value;
- whether migration would be required;
- how imported/profile-restored data would be interpreted;
- whether Task 2.10 occurrence identity would require a new identity version.

Do not select or implement a model unless the evidence makes one option architecturally unavoidable.

---

# 22. Historical Compatibility Boundary

Any future incarnation design must respect the accepted durable-data compatibility policy established in Phase 1.

Task 2.11 must identify whether adding incarnation semantics would affect:

- active local-state format;
- saved-profile format;
- backup format;
- legacy singular `shiftCycle` compatibility;
- normalization;
- migration observability;
- unsupported historical data handling.

Do not modify any durable representation.

Do not declare old data invalid merely because it lacks a concept introduced later.

---

# 23. Identity Versioning Assessment

Task 2.10 established:

    OCCURRENCE_IDENTITY_VERSION = 1

Determine whether future source-incarnation information would be:

- an additive implementation detail compatible with Version 1 equality;
- a semantic change requiring Version 2 occurrence identity;
- or currently indeterminate.

The determination must be based on equality meaning, not merely TypeScript shape.

Do not change the version in this task.

---

# 24. Authority Assessment

Identify the correct architectural owner of source incarnation if it is eventually introduced.

Determine whether incarnation would belong to:

- authored source identity;
- derived occurrence identity;
- persistence infrastructure;
- store infrastructure;
- workflow-local state;
- another explicit boundary.

The result must distinguish ownership from storage.

For example, a value may be persisted without persistence infrastructure being its semantic owner.

---

# 25. Invariants

Record the invariants supported by current evidence and the invariants that a future incarnation contract would need to establish.

Candidate current invariants include:

- ordinary edits preserve source IDs;
- occurrence identity is deterministic from its identity-bearing inputs;
- preview transformations preserve occurrence identity;
- occurrence identity is not currently durable;
- durable authored replacement can reintroduce prior source IDs.

Do not list an invariant unless it is directly supported.

---

# 26. Required Matrices

The result must include at least the following matrices.

## 26.1 Source Identity Matrix

For each identity-bearing source:

| Source | ID field | Creation owner | Edit preserves ID? | Delete supported? | Reuse possible? | Durable? |
| --- | --- | --- | --- | --- | --- | --- |

## 26.2 Lifecycle / Incarnation Matrix

At minimum:

| Operation | Same source provable? | New source provable? | Ambiguous? | Occurrence identity consequence |
| --- | --- | --- | --- | --- |

Include:

- ordinary edit;
- delete/recreate;
- profile load;
- backup import;
- clear then recreate;
- clear then restore;
- duplicate-ID state if possible.

## 26.3 Occurrence Collision Matrix

| Collision scenario | Structurally equal V1 identity possible? | Semantically same? | Risk |
| --- | --- | --- | --- |

## 26.4 Dependency Matrix

| Future capability | Needs incarnation semantics? | Needs incarnation implementation? | Reason |
| --- | --- | --- | --- |

Include at minimum:

- current preview regeneration;
- current suggested-fix revision;
- runtime/session-only occurrence comparison;
- PlanDecision investigation;
- session-only PlanDecision implementation;
- durable PlanDecision persistence;
- durable occurrence references;
- profile/backup-surviving decisions.

---

# 27. Test Coverage Assessment

Identify what current tests directly establish regarding:

- ID generation;
- edit identity preservation;
- deletion;
- recreation;
- duplicate IDs;
- profile replacement;
- backup replacement;
- clear/reset;
- occurrence identity equality;
- overlapping-window identity;
- snapshot cloning.

Identify gaps separately.

Do not add tests merely to answer an architectural question unless explicitly authorized by a later implementation task.

---

# 28. Explicit Non-Goals

Task 2.11 must not:

- add source-incarnation fields;
- change source ID generation;
- introduce UUIDs or other new identifier schemes;
- change deletion behavior;
- prohibit ID reuse;
- add tombstones;
- add history;
- add PlanDecision;
- add durable occurrence references;
- persist occurrence identity;
- change `OCCURRENCE_IDENTITY_VERSION`;
- change local-storage formats;
- change profile formats;
- change backup formats;
- add migrations;
- change compatibility readers;
- change scheduling behavior;
- change recurrence expansion;
- change work generation;
- change preview generation;
- change suggested-fix behavior;
- change UI behavior;
- refactor state containers;
- update ADRs;
- update `CURRENT_STATE.md`;
- update `CHANGELOG.md`;
- create a checkpoint;
- perform unrelated cleanup.

Discovery does not authorize implementation.

---

# 29. Required Result Structure

The Task 2.11 result artifact must contain at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Source Identity Inventory
5. Source Identity Matrix
6. Current Source-Incarnation Model
7. Identifier Creation Semantics
8. Edit Semantics
9. Delete/Recreate Semantics
10. Template Identity Analysis
11. Recurrence Identity Analysis
12. Work-Source Identity Analysis
13. Manual-Event Identity Analysis
14. Duplicate-ID Behavior
15. Rehydration Semantics
16. Profile Replacement Semantics
17. Backup Import Semantics
18. Clear/Reset Semantics
19. Occurrence Identity Collision Analysis
20. Occurrence Collision Matrix
21. Runtime Semantic Equality Assessment
22. Durable Foreign-Key Readiness
23. PlanDecision Dependency Assessment
24. Source-Incarnation Necessity Determination
25. Incarnation Model Options
26. Durable Compatibility Impact
27. Occurrence Identity Versioning Assessment
28. Authority / Ownership Assessment
29. Lifecycle / Incarnation Matrix
30. Future-Capability Dependency Matrix
31. Behavioral Invariants
32. Test Coverage Assessment
33. Architectural Alignment Assessment
34. Open Questions
35. Recommended Follow-Up
36. Deviations
37. Discoveries and Deferred Work
38. Validation
39. Final Completion Determination

Additional sections may be added when useful.

---

# 30. Evidence Classification

Material conclusions must be classified where appropriate as:

- **Confirmed** — directly established by executable production code or tests.
- **Inferred** — strongly suggested by evidence but not directly guaranteed.
- **Not found** — the investigated concept or behavior was not found.
- **Unresolved** — available evidence does not safely determine the answer.

Do not convert absence of evidence into a guarantee.

---

# 31. Validation Requirements

Because this is an investigation task, validation must establish that no executable behavior was changed.

At minimum:

    npm run lint
    npm run typecheck
    npm test
    npm run build

must pass from the normal project execution directory.

The result must record:

- test-file count;
- test count;
- build outcome;
- artifact hash;
- whether executable files changed;
- whether governance files changed.

If the worktree contains pre-existing changes, distinguish them from Task 2.11 changes.

Reference searches must also verify that all production source-ID creation, deletion, replacement, import, and occurrence-identity construction paths relevant to the investigation were reviewed.

---

# 32. Completion Criteria

Task 2.11 is complete only when:

- every identity-bearing authored source has been inventoried;
- current ID creation semantics are established;
- edit versus replacement behavior is established;
- deletion/recreation and ID-reuse behavior is established;
- duplicate-ID handling is established or explicitly unresolved;
- profile, backup, rehydration, and clear/reset implications are established;
- Version 1 occurrence-identity collision classes are documented;
- the safe scope of runtime semantic equality is stated precisely;
- durable foreign-key readiness is assessed;
- the PlanDecision dependency is explicitly determined;
- one source-incarnation necessity classification is selected;
- viable future incarnation models are identified only where justified;
- durable compatibility consequences are identified;
- occurrence-identity version implications are assessed;
- ownership is distinguished from persistence;
- required matrices are complete;
- test coverage and gaps are documented;
- no unauthorized implementation occurs;
- repository-standard validation passes;
- and the immutable task artifact remains unchanged.

---

# 33. Task Determination

Task 2.11 is an architectural boundary investigation.

It exists because Task 2.10 intentionally introduced only the strongest occurrence identity semantics that the current authored-source model could justify.

The next architectural question is not:

> How should DayFrame add incarnation IDs?

It is:

> What does DayFrame currently know about the continuous identity of an authored source across editing, deletion, recreation, replacement, restoration, and durable reintroduction—and how much stronger must that knowledge become before future occurrence decisions rely upon it?

The investigation must preserve the distinction between runtime semantic equality and durable referential identity.

It must not strengthen identity merely in anticipation of future requirements.

**Task 2.11 is complete when DayFrame has an evidence-grounded source-incarnation and identity-reuse contract, has explicitly determined whether incarnation semantics are required now or only before durable occurrence references, and has made no unauthorized implementation change.**
