# Task 8.1 — Revisioned Planning Provenance and Freshness Foundation

## Status

Ready for implementation.

## Phase

Phase 8 — Goal and Capacity Foundations

## Task Type

Foundational implementation task.

Task 8.1 is the first implementation task after completion of the post-Phase-7 architecture, Dogfood reconciliation, Implementation Alignment Strategy, and Implementation Roadmap.

The governing roadmap identifies this as the first coherent increment:

> **Revisioned Planning Provenance and Freshness Foundation**

Its purpose is to establish the smallest shared cross-domain substrate required by the upcoming Goal Structure, Goal Demand, Commitment Composition, Capacity, Feasibility, Allocation, and Constructive Proposal domains without creating an empty generalized framework or changing existing scheduling behavior.

The roadmap requires this foundation to establish:

* shared opaque/revision identity conventions;
* typed provenance/origin;
* dependency fingerprints;
* typed freshness, coverage, and qualification;
* structured reason-code infrastructure;
* persistence/versioning support;
* migration/history-resolution primitives;

only where immediately justified by upcoming planning domains.

The implementation must prove these primitives through a thin internal vertical slice while leaving current scheduling behavior and user-facing surfaces unchanged.

---

## 1. Primary Objective

Implement the minimum reusable planning provenance and freshness substrate required for Phase 8.

The implementation must make it possible for future DayFrame domains to answer deterministically:

> **What fact is this?**

> **Which revision of that fact is this?**

> **What authority or process produced it?**

> **Which exact upstream facts did it depend on?**

> **Is it still current relative to those dependencies?**

> **What horizon or coverage does it describe?**

> **Is it sufficiently qualified for its intended downstream use?**

> **Why was this state or conclusion produced?**

The foundation must support these questions without prematurely implementing Goal Demand, Capacity, Proposal, or other future domains.

---

## 2. Architectural Role

Task 8.1 establishes cross-cutting mechanics.

It does **not** establish new planning authority.

The intended relationship is:

```text
Revisioned identity
+
Typed provenance
+
Dependency fingerprints
+
Freshness / coverage / qualification
+
Structured reasons
+
Versioned persistence / history resolution
↓
Goal Structure
Goal Demand
Commitment Composition
Capacity
Feasibility
Allocation
Proposal
Accepted Allocation
Live Opportunity
```

These primitives support future domains.

They do not replace those domains.

---

## 3. Governing Evidence

Before modifying code, inspect the accepted architecture and implementation strategy relevant to this task.

At minimum inspect:

* Post-Phase-7 Architecture Synthesis;
* `POST_PHASE_7_IMPLEMENTATION_ALIGNMENT_STRATEGY_RESULT.md`;
* `POST_PHASE_7_IMPLEMENTATION_ROADMAP_RESULT.md`;
* Capacity Architecture Specification;
* Goal Structure Architecture Specification;
* Goal Demand / Allocation Architecture Specification;
* Commitment Composition / Attached Activities Architecture Specification;
* Constructive Proposal Architecture Specification;
* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* current persistence/versioning implementation;
* current Preview freshness implementation;
* current publication/history implementation;
* current decision identity/replay implementation.

Use exact repository filenames and paths rather than reconstructing them from task text.

---

## 4. Preserve Current Behavior

Task 8.1 must not change the behavior of:

* Work generation;
* manual cycles;
* repeating cycles;
* canonical user-day handling;
* Commitment recurrence;
* flexible placement;
* Sleep placement;
* manual events;
* Preview generation;
* Preview scheduling;
* Preview stale/current behavior as experienced by the user;
* Friction detection;
* Suggested Fix generation/application;
* PlanDecision behavior;
* Accepted Choice behavior;
* publication;
* execution;
* Progress;
* Month;
* Review Schedule;
* Today;
* Summary;
* existing setup/profile behavior;
* backup/restore semantics.

Internal implementation may reuse or adapt underlying helpers where necessary, but observable semantics must remain unchanged.

---

## 5. No Empty Framework

Do not create a speculative universal domain framework.

Every abstraction added by this task must satisfy at least one of:

1. directly required by multiple accepted upcoming domains;
2. necessary to version or persist the new foundation safely;
3. necessary to demonstrate dependency freshness;
4. necessary to demonstrate historical resolution;
5. necessary to prove the thin vertical slice.

Avoid:

* generalized entity systems;
* event sourcing frameworks;
* universal graph engines;
* plugin architectures;
* arbitrary metadata bags;
* generic workflow engines;
* speculative caching layers;
* generic recommendation frameworks.

Implement the smallest useful substrate.

---

## 6. Existing Primitive Audit

Before implementation, inspect current primitives that may already satisfy part of the requirement.

At minimum inspect:

* IDs used by Goals;
* Commitment source IDs;
* occurrence IDs;
* PlanDecision IDs;
* Accepted Choice IDs;
* Preview generation identity/state;
* publication IDs/snapshots;
* execution IDs;
* Progress IDs;
* persistence schema/version;
* backup schema/version;
* source/origin fields;
* stale flags;
* generated timestamps;
* recurrence/source references;
* revision/version fields if any;
* deterministic occurrence-key helpers.

For each relevant primitive classify internally as:

* reuse unchanged;
* extend;
* adapt;
* leave domain-specific.

Do not replace working identity mechanisms merely for naming consistency.

---

## 7. Opaque Identity Convention

Introduce or formalize the minimum shared convention for durable planning-domain identity.

An identity must:

* be opaque to domain semantics;
* remain stable across revisions of the same logical authored object where architecture requires;
* not encode mutable user-facing values;
* not derive authority from display text;
* survive persistence/restore;
* support historical references;
* support deterministic lookup.

Do not require all existing DayFrame IDs to migrate immediately.

The foundation should be usable by new Phase 8 domains while allowing existing IDs to coexist.

---

## 8. Revision Identity

Introduce the minimum representation necessary to distinguish:

```text
logical object identity
≠
revision identity
```

A revision must identify the exact semantic version of a fact or authority used by downstream derivation.

The model must support future cases such as:

```text
Goal G
Revision G3

Demand D
Revision D7

Attachment Relationship A
Revision A2
```

A downstream artifact must eventually be able to say:

```text
derived from Goal revision G3
and Demand revision D7
and Attachment revision A2
```

Do not implement those future domain objects in this task.

---

## 9. Revision Semantics

Define and test when a revision changes.

A revision should change when semantically relevant authored content changes.

It should not change merely because:

* the object was read;
* UI state changed;
* unrelated data changed;
* a derived consumer recalculated;
* serialization ordering changed.

The foundation may use monotonically increasing revisions, opaque revision IDs, or another architecture-compatible deterministic representation.

Choose one bounded implementation model and document the reasoning.

---

## 10. Typed Origin / Provenance

Introduce a typed origin/provenance representation capable of future extension.

It must support the accepted origin distinctions required by architecture, including eventual representation of:

* recurring authority;
* direct scheduled authority;
* ordinary Proposal acceptance;
* Found-Time Proposal acceptance;
* corrective decision;
* direct spontaneous execution;
* legacy unknown.

Do not fabricate these origins for existing records where they cannot be proven.

Use `legacyUnknown` or equivalent accepted compatibility semantics where appropriate.

Do not infer provenance from coincidental structure.

---

## 11. Provenance Envelope

Define the smallest reusable provenance envelope necessary for future authoritative and historical records.

It should be capable of carrying, where applicable:

* origin kind;
* source logical identity;
* source revision;
* parent/decision authority reference;
* algorithm/policy version where derived reasoning requires it;
* legacy/unknown qualification.

Do not require every field for every record.

Prefer typed discriminated representations over loosely typed optional metadata.

---

## 12. Dependency Fingerprint

Implement a deterministic dependency-fingerprint mechanism.

A fingerprint represents the exact semantically relevant upstream dependency set used to derive a downstream artifact.

Requirements:

* deterministic for equivalent dependency inputs;
* stable under irrelevant ordering differences;
* changes when a relevant dependency revision changes;
* does not depend on ambient current time unless current time is explicitly a dependency;
* serializable;
* comparable;
* suitable for freshness evaluation;
* testable independently.

Do not fingerprint entire application state.

Fingerprint only declared dependencies.

---

## 13. Dependency Reference Model

Define a typed dependency reference capable of representing at minimum:

* domain/type;
* logical ID;
* revision;
* optional qualification/version where required.

Example conceptual shape:

```text
DependencyReference
- kind
- id
- revision
```

Exact TypeScript naming is an implementation decision.

Do not embed arbitrary object snapshots into the fingerprint itself.

---

## 14. Canonical Fingerprint Construction

Fingerprint construction must canonicalize dependency inputs.

Equivalent dependency sets must produce equivalent fingerprints regardless of:

* insertion order;
* object key ordering;
* incidental array construction order where semantics are set-like.

Where order is semantically meaningful, preserve it explicitly.

Document which behavior the helper provides.

Do not depend on unstable default object serialization.

---

## 15. Typed Freshness

Introduce a typed freshness model rather than extending one universal boolean.

The foundation must be capable of representing at least:

### Current

Known to match required dependencies.

### Stale

Known dependency mismatch.

### Unknown

Freshness cannot be established.

Future domains may extend or wrap this model.

Do not replace existing Preview `isStale` behavior in this task unless doing so is completely internal and behavior-preserving.

---

## 16. Freshness Evaluation

Provide a deterministic helper that can evaluate:

```text
stored dependency fingerprint
vs
current dependency fingerprint
```

and return typed freshness.

It must fail conservatively.

Missing or unresolvable decisive dependency information must not be treated as Current.

Do not silently default Unknown to Current.

---

## 17. Coverage

Introduce the smallest reusable coverage representation justified by upcoming planning domains.

Coverage must be capable of describing the bounded context over which a derived result is valid.

At minimum support a time-bounded coverage form suitable for future:

* Capacity;
* Demand Projection;
* Feasibility;
* Proposal;
* Live Opportunity.

Reuse DayFrame's canonical date/user-day semantics where appropriate.

Do not invent calendar-midnight ownership.

Do not implement Planning-Data Horizon, Proposal Horizon, or Review Scope themselves in Task 8.1.

---

## 18. Qualification

Introduce a bounded qualification concept only if directly required by accepted architecture and the thin vertical slice.

Qualification must remain distinct from freshness.

Conceptually:

```text
Freshness:
Does this still match its dependencies?

Qualification:
Is this result suitable for this intended use?
```

Examples future domains may need:

* complete;
* partial;
* liability-affected;
* insufficient evidence;
* legacy/unknown.

Do not create a huge universal qualification taxonomy.

Prefer a small shared envelope with domain-specific reason/detail extension.

---

## 19. Structured Reason Codes

Introduce a structured reason representation usable by deterministic engines.

A reason must have:

* stable machine-readable code;
* typed or bounded parameters;
* optional version/context where needed.

Natural-language explanation is secondary.

Do not make user-facing prose the authoritative reason representation.

The foundation should support future reasons such as:

* Capacity exclusion;
* infeasible session;
* Proposal ranking;
* No-Proposal;
* stale dependency;
* unknown legacy provenance.

Task 8.1 need only implement reason codes required to demonstrate foundation behavior.

---

## 20. Reason-Code Namespace

Prevent unrelated domains from colliding semantically.

Use a bounded namespace or discriminated code convention.

Do not create one giant uncontrolled string pool.

Do not predefine every future architecture reason.

---

## 21. Historical Resolution

Implement or formalize the minimum helper required to resolve:

```text
logical identity + revision
```

against retained versioned planning data.

The implementation must support future historical provenance without requiring current-state mutation.

If existing DayFrame history/version infrastructure already provides the necessary primitive, extend/reuse it rather than duplicating it.

---

## 22. Historical Integrity

Historical references must not silently resolve to the newest revision.

If a historical record references revision 3, resolving logical identity to current revision 7 is not equivalent.

Fail explicitly when an exact historical revision required for authoritative interpretation cannot be recovered.

Do not rewrite historical meaning.

---

## 23. Persistence Registration

Extend persistence/versioning only as much as necessary for the new foundation and vertical slice.

Requirements:

* versioned schema;
* additive migration where possible;
* existing data remains readable;
* malformed new data follows established protected/quarantine behavior;
* backup/restore remains coherent;
* IDs/revisions are not regenerated on restore;
* no inferred authority is introduced during migration.

Use current DayFrame persistence patterns.

---

## 24. Migration Strategy

Prefer additive migration.

Existing records should not be rewritten into new provenance semantics unless provenance can actually be established.

When provenance is unknown:

```text
unknown
≠
inferred
```

Use explicit compatibility representation.

Migration must be deterministic and covered by tests.

---

## 25. Backup Compatibility

Ensure backup/export/restore can round-trip any new persisted foundation state introduced by this task.

Do not break existing backups.

If the backup version must advance, provide migration/compatibility tests according to existing repository conventions.

Do not retire profile semantics here.

---

## 26. Thin Vertical Slice

The foundation must be proven through one thin internal vertical slice.

Use the smallest architecture-compatible example involving an upcoming Phase 8 concept.

Preferred shape:

```text
revisioned Goal relationship fact
→ dependency reference
→ dependency fingerprint
→ derived internal demonstration artifact
→ freshness evaluation
→ historical revision resolution
```

The slice may use the earliest bounded Goal Structure primitive if doing so does not prematurely implement Task 8.2.

The slice must demonstrate the substrate in real production code, not only isolated utilities.

It must remain non-user-facing.

---

## 27. Vertical Slice Boundary

The slice must **not** implement full Goal Structure.

Do not implement:

* arbitrary subgoal authoring UI;
* Milestone UI;
* Goal Demand;
* Goal Priority;
* Capacity;
* Feasibility;
* Allocation;
* Proposal.

The purpose is to prove that Task 8.2 can consume the foundation without discovering that its identity/freshness/history substrate is unusable.

---

## 28. Existing Preview Freshness

Inspect current Preview stale/current behavior as an important precedent.

Determine:

* what dependency concept it already approximates;
* what can be reused;
* what remains Preview-specific.

Do not force Preview onto the new generic freshness model merely for consistency.

If a small internal helper can be shared without behavior change, it may be.

Otherwise leave Preview untouched and document the future alignment seam.

---

## 29. DF-006 Carry-Forward

DF-006 remains:

* RC7;
* BR5;
* S2;
* historical defect confirmed and bounded;
* no speculative repair.

Task 8.1 should improve the substrate needed for future provenance/freshness diagnostics, but it must not claim to fix DF-006.

Preserve the roadmap requirement that DF-006 REG-01–17 remains continuous regression coverage.

If this task touches Work/Preview freshness infrastructure, run all relevant DF-006 regressions.

If it does not, do not manufacture unrelated changes merely to attach DF-006 to Task 8.1.

---

## 30. Determinism

All new foundation behavior must be deterministic.

Given equivalent:

* IDs;
* revisions;
* dependency references;
* dependency ordering semantics;
* coverage;
* reason inputs;

the resulting fingerprint/freshness/provenance representation must be equivalent.

No hidden clock.

No random derivation except creation of opaque durable identities where existing DayFrame conventions legitimately use random UUID creation.

Tests requiring deterministic fixtures must inject/fix identity where appropriate.

---

## 31. Current Time

Do not introduce ambient `Date.now()` into derived freshness semantics.

If time affects validity in future domains, it must be an explicit evaluation input.

Task 8.1 may use creation timestamps for historical/audit metadata according to existing conventions, but timestamps must not substitute for dependency revision.

---

## 32. Identity vs Timestamp

Explicitly preserve:

```text
revision identity
≠
updatedAt
```

A timestamp may describe when something occurred.

It is not sufficient proof of semantic revision identity.

Do not derive correctness solely from timestamp ordering.

---

## 33. Authored vs Derived

The foundation must make it possible to distinguish:

* authored authority;
* derived artifact;
* accepted authority;
* historical evidence.

Do not make the provenance envelope itself grant authority.

Authority belongs to the domain object and lifecycle that uses the provenance.

---

## 34. Persistence vs Authority

Persistence does not make a value authoritative.

Derived values may be persisted for performance/history where architecture permits while remaining derived.

Do not design the foundation around:

```text
persisted = authored
```

or:

```text
stored = current
```

---

## 35. Freshness vs Validity

Do not collapse:

```text
fresh
≠
valid
≠
qualified
≠
authorized
```

A result may be current relative to dependencies yet unusable because its inputs are incomplete.

A result may be historically valid but no longer current.

An accepted authority may remain historically authoritative even though the reasoning that produced it would now be stale.

Tests should demonstrate at least the relevant distinctions introduced in this task.

---

## 36. Compatibility With Future Capacity

Ensure the substrate can later support Capacity references to:

* exact authorized schedule facts;
* exact Commitment revisions;
* composite footprint revisions;
* availability-policy revisions;
* planning-data coverage;
* derivation algorithm version.

Do not implement Capacity.

---

## 37. Compatibility With Future Demand

Ensure the substrate can later support:

* Goal revision;
* Demand Intent revision;
* Goal Priority revision;
* Progress evidence reference;
* projection algorithm version;
* bounded projection horizon.

Do not implement Demand.

---

## 38. Compatibility With Future Proposal

Ensure the substrate can later support Proposal dependencies on:

* Capacity version/fingerprint;
* Demand Projection version/fingerprint;
* Goal Priority;
* Allocation Policy;
* Goal Structure;
* Composition;
* evaluation instant;
* Proposal Horizon.

Do not implement Proposal.

---

## 39. Compatibility With Future Live Opportunity

Ensure the model does not assume every derived artifact is long-lived.

Future Live Opportunity must be able to use:

* explicit evaluation instant;
* short coverage;
* rapidly expiring qualification;
* released-interval provenance;
* exact current obligations/liabilities.

Do not implement Live Opportunity.

---

## 40. Type Safety

Prefer TypeScript discriminated unions and explicit domain types.

Avoid:

* `Record<string, unknown>` as the primary semantic representation;
* uncontrolled strings for domain kind;
* arbitrary metadata maps;
* `any`;
* casts that bypass validation.

Use runtime validation where persisted external data crosses trust boundaries according to current repository practice.

---

## 41. Module Boundaries

Place new foundation code in a location appropriate for shared planning-domain infrastructure.

Do not place future architecture primitives inside UI components.

Do not create a miscellaneous `utils.ts` dumping ground.

Inspect existing repository organization before choosing paths.

Prefer a cohesive bounded module such as planning provenance/versioning if consistent with current architecture.

Exact filenames are an implementation decision and must be reported.

---

## 42. Public API Restraint

Export only what upcoming domains need.

Avoid broad barrel exports merely because primitives are new.

Do not expose internal canonicalization implementation details as long-term public contracts unless required.

---

## 43. Test Strategy

Add focused tests for every new semantic primitive.

At minimum test:

### Identity / Revision

* logical identity stable across revision;
* revision changes when semantic content changes;
* revision does not change for irrelevant operations where applicable.

### Dependency Fingerprint

* deterministic;
* equivalent set ordering produces equivalent fingerprint;
* relevant revision change changes fingerprint;
* irrelevant external state does not change fingerprint;
* ordered dependencies preserve order where declared semantic.

### Freshness

* equal fingerprint → Current;
* mismatch → Stale;
* missing/unresolvable decisive dependency → Unknown;
* Unknown never silently becomes Current.

### Coverage

* bounded interval serialization/validation;
* canonical user-day/date semantics where used;
* invalid coverage rejected.

### Provenance

* typed origins round-trip;
* legacy unknown remains unknown;
* no inference on migration.

### Reasons

* structured codes round-trip;
* stable machine-readable representation.

### History

* exact revision resolves;
* missing historical revision fails explicitly;
* current revision is not substituted.

### Persistence / Backup

* migration;
* reload;
* backup;
* restore;
* malformed state handling.

### Vertical Slice

* dependency change causes derived slice to become stale;
* exact historical revision remains resolvable;
* no user-facing scheduling behavior changes.

---

## 44. Existing Regression Suites

Run the current suites relevant to touched code.

At minimum inspect and run, where present:

* store tests;
* persistence/migration tests;
* backup/profile tests;
* Goal tests;
* Preview tests;
* publication/history tests;
* decision tests.

If shared code touches scheduling generation, also run:

* engine;
* Work/cycles;
* recurrence;
* placement;
* Friction;
* Month.

Run the full test suite before completion unless repository size/runtime makes that genuinely impractical.

If full suite is not run, explain why and report the exact broader validation performed.

---

## 45. Formatting / Static Validation

Run repository-standard validation.

At minimum inspect available scripts and run applicable:

```text
npm run format
npm run test
npm run build
```

If lint/typecheck are separate repository-standard commands, run them.

Do not invent scripts that do not exist.

Report exact commands and outcomes.

---

## 46. Performance

Fingerprinting must not require serializing the entire DayFrame store.

Historical resolution must not require scanning unrelated application history where an indexed/map representation is appropriate.

Do not prematurely optimize with caching.

Establish correct bounded contracts first.

If performance-sensitive design decisions are made, record them.

---

## 47. Security / Integrity

Persisted provenance/revision data is untrusted on restore.

Validate it.

Do not allow malformed dependency references to be interpreted as current.

Do not allow unsupported future origin kinds to silently downgrade into a known authoritative origin.

Use established protected-state behavior.

---

## 48. Accessibility / UI

Task 8.1 has no intended new user-facing UI.

No accessibility regression is permitted.

Do not add temporary debug controls to production surfaces.

Diagnostic proof belongs in tests/internal APIs.

---

## 49. Logging

Do not introduce noisy console logging.

If diagnostic logging is required during development, remove it before completion unless it follows an existing structured diagnostic convention.

---

## 50. Documentation Comments

Use comments to explain:

* authority boundaries;
* canonicalization assumptions;
* why a representation exists;
* historical compatibility constraints.

Do not write comments that merely restate TypeScript syntax.

---

## 51. Implementation Decisions

If implementation requires decisions not fully determined by architecture, record them in the result.

Examples:

* revision representation;
* fingerprint encoding;
* canonical ordering;
* origin envelope shape;
* history lookup representation;
* qualification envelope;
* persistence version increment.

Do not silently turn implementation convenience into new architecture.

If a decision materially changes accepted semantics, stop and report an architecture contradiction instead of implementing it.

---

## 52. Architecture Reopen Rule

Task 8.1 is expected to require no architecture reopen.

If direct implementation evidence shows that the accepted foundation cannot support one of its required downstream semantics without contradiction:

1. stop the contradictory implementation;
2. preserve working behavior;
3. document exact evidence;
4. classify the blocker;
5. recommend a bounded architecture reconciliation.

Do not improvise around it.

---

## 53. Required Implementation Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/results/TASK_8_1_REVISIONED_PLANNING_PROVENANCE_AND_FRESHNESS_FOUNDATION_RESULT.md`

If `/docs/results` is not the repository's established implementation-result location, locate the established result-artifact convention first.

Do not silently create a new organizational convention.

If a different established path is required, use it and report the exact path.

The filename must contain `RESULT`.

This result artifact is a required Task 8.1 deliverable, not the sole permitted repository write: production code, tests, migrations, and required task-result documentation may also change as necessary for implementation.

---

## 54. Result Artifact Contents

The Task 8.1 result must include:

1. Executive Result
2. Scope Delivered
3. Governing Evidence Used
4. Existing Primitive Assessment
5. Files Added
6. Files Modified
7. Identity Model
8. Revision Model
9. Provenance Model
10. Dependency Reference Model
11. Fingerprint Model
12. Freshness Model
13. Coverage Model
14. Qualification Model
15. Structured Reason Model
16. Historical Resolution
17. Persistence Changes
18. Migration
19. Backup / Restore Compatibility
20. Thin Vertical Slice
21. Preview Freshness Relationship
22. DF-006 Relationship
23. Determinism
24. Future Capacity Compatibility
25. Future Demand Compatibility
26. Future Proposal Compatibility
27. Future Live Compatibility
28. Tests Added
29. Regression Tests Run
30. Validation Commands / Results
31. Performance Notes
32. Compatibility Notes
33. Implementation Decisions
34. Deviations
35. Architecture Reopen Check
36. Repository Status
37. Completion Assessment
38. Recommended Next Task
39. Completion Statement

---

## 55. Governance Updates

After successful implementation and validation, update the established project governance artifacts as appropriate:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md` only if a genuine implementation decision warrants a durable decision entry.

Do not rewrite architecture specifications.

Do not modify the Post-Phase-7 Alignment Strategy or Roadmap merely because Task 8.1 completed.

If the established Phase 8 roadmap/tracking file requires status advancement, update it only according to existing governance conventions.

---

## 56. Repository Status Discipline

Before implementation:

1. inspect `git status`;
2. verify Sidney's pushed checkpoint is clean or identify pre-existing changes;
3. record any pre-existing changes.

During implementation:

* modify only files required by Task 8.1;
* do not absorb unrelated cleanup;
* do not rewrite files merely for formatting unless repository tooling requires it.

After implementation:

1. inspect `git diff --stat`;
2. inspect relevant diffs;
3. inspect `git status`;
4. verify all changed files belong to Task 8.1 or required governance updates;
5. report exact status.

Do not commit or push unless the execution environment/task convention explicitly authorizes it.

---

## 57. Required Invariants

Establish and test at minimum:

### T81-INV-01

Logical identity and revision identity are distinct.

### T81-INV-02

Revision identity changes only for semantically relevant revision changes according to the owning domain's declared revision input.

### T81-INV-03

A dependency fingerprint is determined only by declared semantic dependencies.

### T81-INV-04

Equivalent unordered dependency sets produce equivalent fingerprints.

### T81-INV-05

A relevant dependency revision change changes the fingerprint.

### T81-INV-06

Missing decisive dependency information cannot evaluate as Current.

### T81-INV-07

Freshness, qualification, validity, and authority are not equivalent states.

### T81-INV-08

Historical resolution never substitutes the current revision for an explicitly requested historical revision.

### T81-INV-09

Unknown legacy provenance remains explicitly unknown.

### T81-INV-10

Persistence does not confer authored authority.

### T81-INV-11

Derived artifacts do not acquire authority from provenance metadata.

### T81-INV-12

Coverage uses explicit DayFrame-compatible boundaries rather than implicit calendar-midnight ownership.

### T81-INV-13

Structured reason codes remain machine-readable independently of rendered explanation.

### T81-INV-14

Fingerprinting does not depend on ambient wall-clock time.

### T81-INV-15

Restore does not regenerate durable logical IDs or revisions.

### T81-INV-16

Malformed persisted provenance/dependency data cannot silently become authoritative/current.

### T81-INV-17

Task 8.1 does not alter current scheduling output for equivalent authored state.

### T81-INV-18

Task 8.1 introduces no user-facing planning authority.

---

## 58. Explicit Non-Goals

Do not implement:

* full Goal Structure;
* Goal Demand;
* Goal Priority;
* Demand Projection;
* Commitment Composition beyond the minimum internal proof if needed;
* Capacity;
* Feasibility;
* Competing Demand;
* Allocation;
* Constructive Proposal;
* ProposalDecision;
* Accepted Allocation;
* Live Opportunity;
* Found Time;
* learned tendency;
* preference promotion;
* new Month workflow;
* new Review workflow;
* profile retirement;
* native timer;
* generalized scenarios/templates.

Do not begin Task 8.2.

---

## 59. Completion Criteria

Task 8.1 is complete only when:

* [ ] governing architecture/strategy/roadmap was inspected;
* [ ] current repository status was inspected;
* [ ] existing identity/version/provenance/freshness primitives were assessed before replacement;
* [ ] minimum shared opaque identity convention exists;
* [ ] logical identity and revision identity are distinct;
* [ ] bounded revision semantics exist;
* [ ] typed origin/provenance exists;
* [ ] legacy unknown provenance is representable;
* [ ] dependency references exist;
* [ ] deterministic dependency fingerprint exists;
* [ ] canonical ordering semantics are explicit;
* [ ] typed freshness exists;
* [ ] Current/Stale/Unknown behavior is deterministic;
* [ ] missing decisive dependency cannot become Current;
* [ ] bounded coverage representation exists;
* [ ] qualification is distinct from freshness where implemented;
* [ ] structured machine-readable reason representation exists;
* [ ] historical exact-revision resolution exists;
* [ ] current revision is never substituted for missing historical revision;
* [ ] persistence/versioning changes are bounded;
* [ ] migration is deterministic;
* [ ] backup/restore compatibility is preserved;
* [ ] one thin production vertical slice proves the substrate;
* [ ] the vertical slice remains non-user-facing;
* [ ] Preview behavior remains unchanged;
* [ ] DF-006 is not claimed fixed;
* [ ] scheduling behavior remains unchanged;
* [ ] no new user-facing planning authority exists;
* [ ] invariants T81-INV-01 through T81-INV-18 are covered by implementation/tests;
* [ ] targeted regression suites pass;
* [ ] full suite passes or justified broader validation is reported;
* [ ] format/static/build validation passes;
* [ ] no noisy diagnostic logging remains;
* [ ] result artifact exists;
* [ ] result artifact was reopened and verified;
* [ ] required governance updates were made;
* [ ] final repository status was inspected;
* [ ] all changes are attributable to Task 8.1;
* [ ] architecture reopen was assessed;
* [ ] recommended next task is identified;
* [ ] no Task 8.2 implementation was started.

---

## 60. Completion Statement

End the Task 8.1 result artifact with exactly:

> **Task 8.1 — Revisioned Planning Provenance and Freshness Foundation complete.**
>
> DayFrame now has the bounded cross-domain identity, revision, provenance, dependency-fingerprint, freshness, coverage, qualification, structured-reason, persistence, migration, backup, and historical-resolution substrate required by the first Phase 8 planning domains; the foundation is proven through a thin internal production vertical slice rather than an empty generalized framework; logical identity remains distinct from revision identity; derived freshness is deterministic and dependency-based rather than timestamp-based; unknown or malformed provenance cannot silently become current authority; exact historical revisions remain distinct from current state; existing deterministic scheduling, Preview, Friction, decision, publication, execution, Progress, persistence, backup, and surface behavior remains intact; DF-006 remains bounded historical regression and observability evidence rather than a speculative repair target; no new user-facing planning authority has been introduced; and the repository is ready for the next bounded Phase 8 implementation task without reopening accepted architecture.

The final Codex response must state:

> **Task:** Task 8.1 — Revisioned Planning Provenance and Freshness Foundation
>
> **Result artifact:** Report the exact verified result path.
>
> **Implementation:** Summarize the identity, revision, provenance, fingerprint, freshness, coverage, qualification, reason, persistence, migration, history, and vertical-slice work actually completed.
>
> **Scheduling behavior:** Confirm whether existing scheduling behavior changed. Expected: No.
>
> **User-facing behavior:** Confirm whether any new planning authority or workflow was exposed. Expected: No.
>
> **DF-006:** Confirm it remains RC7 / BR5 / S2 and was not treated as a speculative repair.
>
> **Validation:** Report exact test, format, type/lint, and build commands and results.
>
> **Repository status:** Report all Task 8.1-created/modified files and any pre-existing changes.
>
> **Architecture reopen:** Yes or No, with reason.
>
> **Recommended next task:** Report the next bounded Phase 8 task without beginning it.
