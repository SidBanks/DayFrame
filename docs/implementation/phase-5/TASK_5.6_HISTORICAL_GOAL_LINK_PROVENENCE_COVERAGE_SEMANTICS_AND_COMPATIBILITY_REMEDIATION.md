# Task 5.6 — Historical Goal-Link Provenance Coverage Semantics and Compatibility Remediation

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Bounded HistoricalPlan provenance-semantic remediation, backward-compatible coverage encoding, publication/republication behavior, validation/fingerprinting/Backup compatibility, regression testing, and governance.

---

# 1. Context

Task 5.5 completed the Goal-Linked Historical Evidence and Progress Readiness Audit.

Its primary determination was:

> **Progress V1 is not ready.**

The Goal-linked evidence model is otherwise sound, but HistoricalPlan currently cannot distinguish:

```text
Goal-aware publication
with zero Goal links
```

from:

```text
legacy/pre-Goal publication
where Goal provenance was never captured
```

because both currently encode Goal provenance as an absent `goals` field.

This collapses two different epistemic states:

```text
KNOWN UNLINKED

"This publication captured Goal relationships
and this occurrence had no matching Goal links."
```

and:

```text
UNKNOWN / LEGACY

"This publication predates Goal provenance,
so Goal membership is unknown."
```

That ambiguity is a blocker for Goal Activity and any later Progress interpretation.

Task 5.5 therefore selected exactly one next task:

> **Task 5.6 — Historical Goal-Link Provenance Coverage Semantics and Compatibility Remediation.**

---

# 2. Purpose

Introduce one explicit backward-compatible semantic distinction that allows DayFrame to answer:

> **Was Goal-link provenance captured for this historical publication/occurrence?**

Task 5.6 must make the following states representable:

```text
Goal-aware + linked
Goal-aware + no links
Legacy / Goal provenance unavailable
```

without:

* rewriting old HistoricalPlan records;
* fabricating Goal membership;
* changing Goal authority;
* changing ExecutionHistory;
* implementing Goal Activity;
* implementing Progress.

---

# 3. Governing Principle

> **Absence of evidence is not evidence of absence unless the format explicitly records that the evidence domain was observed.**

For Goal provenance:

```text
Goal-aware empty
≠
legacy unknown
```

This must become a durable HistoricalPlan semantic.

---

# 4. Governing Compatibility Principle

> **Legacy HistoricalPlan must remain readable with its original meaning.**

Do not migrate or backfill old records by consulting current Goal authority.

Legacy records must remain:

```text
Goal provenance unavailable
```

not:

```text
known unlinked
```

---

# 5. Explicit Scope

Implement:

* explicit Goal-provenance coverage/version semantics;
* backward-compatible HistoricalPlan representation;
* publication behavior for new Goal-aware history;
* legacy interpretation;
* validator changes;
* canonical serialization;
* fingerprint changes;
* clone/roundtrip behavior;
* Backup V4 compatibility;
* restore compatibility;
* republication behavior;
* tests;
* governance.

---

# 6. Explicit Non-Goals

Do not implement:

* Goal Activity projection;
* Goal Activity UI;
* Progress;
* Progress policy;
* Progress percentage;
* Summary Goal section;
* measurement policies;
* Recommendations;
* RecommendationDecision;
* adaptation;
* Goal authority changes;
* Goal lifecycle changes;
* Goal-link mutation changes;
* ExecutionHistory schema changes;
* Goal UI changes;
* HistoricalPlan retroactive backfill;
* migration of old records to guessed Goal-aware state.

---

# 7. Task 5.5 Accepted Findings

Treat these as governing inputs:

1. frozen Goal provenance is authoritative when present;
2. current Goal links never backfill history;
3. current Goal rename/unlink/lifecycle changes cannot rewrite frozen history;
4. Goal recreation remains historically distinct;
5. current plan coverage is separate from Goal-link coverage;
6. reporting coverage is separate from both;
7. ExecutionHistory is sufficient for future categorical Goal Activity;
8. Goal authority is sufficient for future categorical Goal Activity;
9. no Goal lifecycle ledger is required for the first Goal Activity slice;
10. measurable Progress remains deferred;
11. the first Goal-derived feature should be called **Goal Activity**;
12. Goal Activity must distinguish Goal-aware known empty from legacy unknown;
13. HistoricalPlan requires one backward-compatible provenance-coverage remediation before Goal Activity can be implemented.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this Task 5.6 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.3 result;
   * Task 5.4 result;
   * Task 5.5 result;
   * Goal ADR;
   * HistoricalPlan domain types;
   * Goal provenance type;
   * HistoricalPlan validators;
   * publication builder/materialization;
   * HistoricalPlan fingerprints;
   * HistoricalPlan serialization/import;
   * Backup V4;
   * restore;
   * HistoricalPlan tests;
   * Goal provenance tests;
   * republication/evaluation-as-of tests;
6. do not modify the immutable Task 5.6 artifact.

Create:

`docs/implementation/phase-5/TASK_5.6_HISTORICAL_GOAL_LINK_PROVENANCE_COVERAGE_SEMANTICS_AND_COMPATIBILITY_REMEDIATION_RESULT.md`

---

# 9. Initial Source Audit

Before code changes, confirm the exact current shape.

At minimum document:

* outer HistoricalPlan version;
* occurrence snapshot union;
* optional `goals` field shape;
* Goal provenance subrecord version;
* how zero matching Goals is currently serialized;
* how legacy records deserialize;
* exact validator behavior;
* fingerprint behavior;
* Backup V4 treatment;
* restore treatment;
* publication materialization behavior.

Stop if Task 5.5's ambiguity no longer exists in current source.

---

# 10. Core Semantic Requirement

After 5.6, DayFrame must represent:

### State A — Goal provenance available, linked

Example conceptual representation:

```text
goalProvenance:
    version: 1
    coverage: available
    goals:
        - ...
```

### State B — Goal provenance available, empty

```text
goalProvenance:
    version: 1
    coverage: available
    goals: []
```

### State C — legacy Goal provenance unavailable

Either:

```text
goalProvenance absent
```

or an explicit compatible representation interpreted as:

```text
coverage: unavailableLegacy
```

Choose the smallest correct format.

---

# 11. Representation Alternatives

Compare at least:

### A. Explicit provenance envelope

```text
goalProvenance: {
    version: 1,
    goals: []
}
```

Presence itself means Goal-aware.

Absence means legacy unavailable.

### B. Explicit coverage field

```text
goalProvenance: {
    version: 1,
    coverage: "available",
    goals: []
}
```

Legacy absence means unavailable.

### C. Snapshot-level Goal coverage marker

Coverage stored separately from Goal list.

### D. Another bounded model

Choose based on clarity, compatibility, exact validation, and future policy needs.

---

# 12. Preferred Semantic Shape

Strong preference:

> **Use explicit presence of a versioned Goal-provenance envelope to mean Goal-aware coverage, including when `goals` is empty; use envelope absence to preserve legacy provenance-unavailable semantics.**

Only add a separate `coverage` field if it carries information beyond envelope presence.

Do not overmodel.

---

# 13. No Current-Goal Backfill

Legacy records lacking the provenance envelope must remain legacy.

Never do:

```text
if no historical Goal provenance:
    inspect current Goal links
    infer historical membership
```

---

# 14. New Publication Requirement

Every new Goal-aware HistoricalPlan publication created after Task 5.6 must explicitly serialize Goal provenance coverage for every eligible commitment-backed occurrence, including zero matches.

Conceptually:

```text
goals: []
```

must be durable evidence of:

> Goal provenance was captured and no Goal links matched.

---

# 15. Linked Publication

When matches exist:

* serialize the provenance envelope;
* include canonical frozen Goal records;
* retain exact Goal ID/revision/title/status/policy context.

No semantic change from 5.3 beyond explicit coverage identity.

---

# 16. Unlinked Goal-Aware Publication

When no Goal matches:

* serialize an explicit Goal-aware empty provenance envelope;
* do not omit the Goal provenance field.

This is the core remediation.

---

# 17. Legacy Publication

Existing historical records without Goal provenance remain valid.

Interpret:

```text
no Goal provenance envelope
```

as:

> Goal relationships were not recorded for this historical record.

---

# 18. Legacy Compatibility

Do not require rewriting IndexedDB history.

Old records should deserialize through existing compatibility rules plus the new semantic interpretation.

---

# 19. HistoricalPlan Outer Version

Determine whether the outer HistoricalPlan version must change.

Preferred:

* retain current outer version if the optional versioned provenance envelope already permits backward-compatible additive semantics;
* increment only if exact-version contract requires it.

Do not hide a breaking semantic change under the same version.

Document decision.

---

# 20. Goal Provenance Subrecord Version

If the existing provenance subrecord can represent explicit empty presence without schema change:

* retain provenance version 1.

If the subrecord itself changes structurally:

* increment its version.

Do not bump versions unnecessarily.

---

# 21. Canonical Empty Provenance

Define exactly one canonical Goal-aware empty representation.

For example:

```text
goalProvenance: {
    version: 1,
    goals: []
}
```

No multiple equivalent forms.

---

# 22. Canonical Linked Provenance

Maintain deterministic ordering of frozen Goal records.

Same semantic set → same canonical serialization/fingerprint.

---

# 23. Validation

Validator must distinguish:

### Valid legacy

Goal provenance field absent.

### Valid Goal-aware empty

Explicit valid provenance envelope with empty Goal list.

### Valid Goal-aware linked

Explicit valid envelope with one or more valid frozen Goal entries.

### Invalid

Malformed envelope, invalid version, duplicate Goals, invalid fields.

---

# 24. Strict Keys

Preserve existing strict-validation philosophy.

Do not accept arbitrary unknown coverage/provenance keys.

---

# 25. Fingerprint Semantics

HistoricalPlan fingerprint must distinguish:

```text
legacy provenance unavailable
```

from:

```text
Goal-aware provenance available with zero links
```

These are semantically different historical facts.

Mandatory regression.

---

# 26. Fingerprint Stability

For Goal-aware linked snapshots:

* link/Goal ordering must not affect semantic fingerprint if canonicalization currently normalizes ordering.

---

# 27. Clone Isolation

Explicit empty provenance must survive structural cloning.

Returned snapshots must remain isolated.

---

# 28. Serialization Roundtrip

Test:

```text
Goal-aware empty
→ serialize/export
→ deserialize/import
→ Goal-aware empty
```

and:

```text
legacy absent
→ serialize/export
→ deserialize/import
→ legacy absent
```

without collapsing the distinction.

---

# 29. Backup V4

Backup V4 already preserves HistoricalPlan authority.

No Backup version bump should be required if HistoricalPlan's backward-compatible representation remains valid inside V4.

Audit and confirm.

---

# 30. Backup V4 Roundtrip

Ensure Backup V4 preserves all three states:

* linked Goal-aware;
* empty Goal-aware;
* legacy unavailable.

---

# 31. Restore

Restore must preserve the distinction exactly.

No restore-time normalization:

```text
legacy absent → empty Goal-aware
```

is allowed.

---

# 32. Full Clear

No special Goal-provenance clear participant is needed.

HistoricalPlan clear already removes HistoricalPlan authority.

Confirm no change.

---

# 33. Goal Authority

No Goal authority changes.

Current Goal links continue to influence only future publications.

---

# 34. ExecutionHistory

No ExecutionHistory changes.

---

# 35. Scheduling

No scheduling changes.

Goal provenance coverage is historical metadata only.

---

# 36. Preview Staleness

No changes.

Goal provenance encoding does not alter Preview staleness.

---

# 37. Publication Builder

Update publication materialization so it always makes a deliberate coverage decision.

Pseudo-semantically:

```text
if Goal authority readable:
    resolve matching Goal links
    emit Goal-aware provenance envelope
        goals = matching frozen Goals
else:
    follow governed protected-publication behavior
```

Never allow Goal-aware zero matches to fall through to omitted provenance.

---

# 38. Protected Goal Authority

Preserve Task 5.3 behavior:

> protected/unavailable Goal authority must not be interpreted as zero Goal links.

If Goal authority is required for Goal-aware publication and unavailable:

* block publication or preserve existing protection behavior.

Do not emit empty Goal-aware provenance.

---

# 39. Readiness

Only ready Goal authority may yield:

```text
Goal-aware provenance available
```

---

# 40. Publication of Non-Linkable Occurrence Types

Audit whether all HistoricalPlan occurrence kinds are eligible for Goal provenance.

If some occurrence kinds cannot be linked by Goal V1:

determine whether their Goal coverage is:

* known empty because Goal system deliberately evaluated them;
* not applicable;
* omitted from Goal Activity eligibility.

Do not conflate not-linkable with legacy unavailable.

This must be explicit.

---

# 41. Goal-Linkable Source Set

Reuse Task 5.3 supported link source kinds.

Do not broaden linkability.

---

# 42. Non-Linkable Occurrences

If Goal Activity will only consider Goal-linkable commitment-backed occurrence kinds:

then Goal provenance coverage only needs semantic meaning for eligible occurrences.

Document exact eligibility.

---

# 43. Publication Day-Level vs Occurrence-Level Coverage

Determine whether Goal awareness should be recorded:

### per occurrence

or:

### once per HistoricalPlan publication/day

or:

### both.

The blocker discovered in 5.5 is about interpreting occurrence membership.

Choose the lowest level that truthfully supports future queries without redundancy.

---

# 44. Day-Level Coverage Alternative

If publication format can say:

```text
goalProvenanceVersion: 1
```

once per day/publication, then absence/presence may establish coverage for every eligible occurrence.

Compare with per-occurrence envelopes.

---

# 45. Coverage Granularity Decision

Settle exactly one canonical coverage granularity.

Criteria:

* future Goal Activity eligibility;
* legacy compatibility;
* format complexity;
* fingerprint clarity;
* partial publication possibility;
* non-linkable occurrence kinds.

---

# 46. Partial Goal-Provenance Coverage Within One Publication

Determine whether a Goal-aware publication can ever have:

```text
some eligible occurrences with Goal provenance
some eligible occurrences without it
```

after 5.6.

Preferred invariant:

> No. A new Goal-aware publication either captures Goal provenance deterministically for every eligible occurrence or publication does not claim Goal-aware coverage.

Adopt if source architecture supports it.

---

# 47. Publication Coverage Invariant

Candidate:

> **Every new effective HistoricalPlan publication created while Goal authority is ready contains explicit Goal-provenance coverage for every Goal-linkable occurrence in that publication.**

Assess/adopt.

---

# 48. Republication

Critical test.

Suppose:

### Publication A

Goal-aware, occurrence linked to Goal X.

### Goal unlink occurs.

### Publication B for same historical day

Goal-aware, occurrence now unlinked.

At cutoff before B:

```text
known linked
```

At cutoff after B:

```text
known unlinked
```

No ambiguity.

---

# 49. Legacy → Goal-Aware Republication

Suppose old publication is legacy Goal-unaware.

Later same day is republished after Goal-aware support.

At earlier cutoff:

```text
Goal provenance unavailableLegacy
```

At later cutoff:

```text
Goal provenance available
```

with linked or empty set.

Mandatory regression.

---

# 50. Goal-Aware Empty → Linked Republication

If link is later added and day republished:

before new publication:

```text
known unlinked
```

after:

```text
known linked
```

---

# 51. Goal-Aware Linked → Empty Republication

If link removed:

before:

```text
known linked
```

after:

```text
known unlinked
```

---

# 52. No Retroactive Mutation

Republication produces a new authoritative publication.

It does not mutate the prior publication.

---

# 53. Effective Publication Selection

No change.

Goal Activity later must use existing `evaluationAsOf` effective publication selection.

Task 5.6 tests should prove the new coverage semantics survive that selection.

---

# 54. Coverage Resolver Preparation

Task 5.6 may add a low-level helper that classifies provenance coverage if it belongs naturally beside HistoricalPlan domain logic.

For example:

```text
goalProvenanceCoverage(snapshot)
    → "available" | "unavailableLegacy" | "notApplicable"
```

Do not implement Goal Activity policy/projection.

---

# 55. No Goal-Specific Metric Yet

A coverage helper may describe historical format semantics.

It must not:

* count Goal activity;
* filter by Goal ID;
* join ExecutionHistory;
* calculate distributions.

---

# 56. Possible Coverage States

Evaluate:

```text
available
unavailableLegacy
notApplicable
```

Do not add `partial` at per-occurrence level unless actual format supports partiality.

Window-level partial coverage belongs to future Goal Activity policy.

---

# 57. Known Empty Representation

At query time later:

```text
coverage = available
goals = []
```

means known unlinked.

This must now be mechanically decidable.

---

# 58. Legacy Unknown Representation

At query time later:

```text
coverage = unavailableLegacy
```

must be mechanically decidable without current Goal lookup.

---

# 59. No Linked Goal Yet

Task 5.6 does not answer whether an occurrence is linked to a specific Goal in aggregate.

It only ensures the raw historical record can support that determination.

---

# 60. Goal ID Membership

For Goal-aware provenance:

```text
goals contains GoalId
```

means known linked to queried Goal.

```text
goals does not contain GoalId
```

means known unlinked to queried Goal.

---

# 61. Multi-Goal

Empty/non-empty coverage semantics must work equally for multi-Goal provenance.

No changes to multi-Goal representation.

---

# 62. Description Fields

Do not add additional frozen Goal display fields.

5.5 found linked provenance fields sufficient.

---

# 63. Lifecycle History

Do not add lifecycle ledger.

5.5 found it unnecessary for minimum Goal Activity.

---

# 64. Measurement Policy

No changes.

Frozen measurement-policy references remain as-is.

---

# 65. Goal CreatedAt

No HistoricalPlan schema change for Goal createdAt unless implementation audit proves necessary for coverage.

5.5 recommended future queries bound default start to current Goal `createdAt`; this does not require freezing createdAt per occurrence.

---

# 66. Historical Labels

No current Goal lookup.

Continue using frozen Goal title when historical explanation eventually renders.

---

# 67. Old Tests

All pre-Goal HistoricalPlan fixtures should remain valid.

Do not rewrite them all to Goal-aware empty.

Their absence is meaningful legacy evidence now.

---

# 68. New Fixtures

Add explicit fixtures for:

### Legacy occurrence

No Goal provenance envelope.

### Goal-aware empty occurrence

Explicit envelope, empty goals.

### Goal-aware linked occurrence

Explicit envelope, one Goal.

### Multi-Goal occurrence

Explicit envelope, multiple Goals.

---

# 69. Legacy Fixture Semantics

Document:

> lack of provenance means not captured, not known empty.

---

# 70. Validator Tests

Cover:

* legacy absent accepted;
* Goal-aware empty accepted;
* Goal-aware linked accepted;
* invalid provenance version rejected;
* malformed Goal entry rejected;
* duplicate Goal IDs/references rejected if current validator requires uniqueness.

---

# 71. Fingerprint Tests

Mandatory:

```text
legacy absent fingerprint
≠
Goal-aware empty fingerprint
```

Also:

```text
Goal-aware empty roundtrip fingerprint stable
```

---

# 72. Publication Tests

Cover new publication with:

* linked Goal;
* no matching Goal;
* multiple Goals;
* protected Goal authority.

---

# 73. Goal-Aware Empty Publication Test

This is the central regression.

Given:

* ready Goal authority;
* eligible occurrence;
* no matching links;

new HistoricalPlan publication must contain explicit Goal-aware empty provenance.

---

# 74. Legacy Read Test

Legacy stored HistoricalPlan without provenance:

* reads successfully;
* classifies provenance unavailable;
* is not rewritten automatically.

---

# 75. Backup Roundtrip Test

V4 roundtrip preserves:

```text
legacy unknown
Goal-aware empty
Goal-aware linked
```

as distinct states.

---

# 76. Restore Roundtrip Test

Same three states survive restore exactly.

---

# 77. Republication Tests

At minimum:

1. legacy → Goal-aware empty;
2. legacy → Goal-aware linked;
3. Goal-aware empty → linked;
4. Goal-aware linked → empty.

Verify cutoff behavior.

---

# 78. Protection Test

Protected Goal authority cannot produce Goal-aware empty provenance.

---

# 79. Goal Mutation Tests

Goal link/unlink only affects future publication.

Existing frozen records remain unchanged.

---

# 80. HistoricalPlan Version Compatibility Test

If outer/subrecord version changes:

* old version readable;
* new version readable;
* invalid unknown future version rejected/protected according to conventions.

---

# 81. No ExecutionHistory Test Changes

Only update execution tests if shared fixture types require additive adaptation.

Do not change outcome semantics.

---

# 82. No Goal Authority Test Changes

Only update Goal tests where publication integration requires new explicit empty provenance expectations.

No Goal semantic changes.

---

# 83. No Scheduler Tests Changes

Schedule output remains unchanged.

---

# 84. No Summary Changes

Do not surface coverage yet.

---

# 85. No Planner Changes

No Goal UI changes.

---

# 86. No Progress Types

Do not create:

```text
GoalProgress
GoalActivityResult
GoalActivityPolicy
```

yet.

Task 5.7 owns that.

---

# 87. No Progress Naming in Product

This task is infrastructure remediation only.

---

# 88. No Migration Rewrite

Do not iterate through old HistoricalPlan and inject empty provenance.

That would convert unknown into known falsehood.

---

# 89. No Current-State Enrichment

Do not enrich legacy history from:

* current Goal links;
* current Goal title;
* current commitment;
* current Active.

---

# 90. Backup Compatibility

Do not bump Backup V4 solely for an additive HistoricalPlan representation if existing V4 stores HistoricalPlan transparently and compatibility remains truthful.

If a bump is required by actual strict Backup schema, document and stop if that exceeds bounded task scope rather than casually introducing V5.

Expected: Backup V4 remains current.

---

# 91. Restore Fingerprints

Restore semantic fingerprints must include the new distinction.

A target with Goal-aware empty provenance must not verify equal to legacy absence.

---

# 92. Stable Canonicalization

Ensure empty arrays/envelopes are not stripped by generic normalization.

This is a likely implementation risk.

---

# 93. JSON Serialization Audit

Check whether utilities omit:

```text
undefined
empty arrays
empty objects
```

in ways that could collapse Goal-aware empty back into absence.

Explicitly prevent semantic loss.

---

# 94. Structured Clone Audit

Ensure structured cloning retains the explicit empty envelope.

---

# 95. Persistence Audit

IndexedDB must retain explicit empty Goal provenance exactly.

---

# 96. Fingerprint Canonicalizer Audit

Ensure canonicalizer does not treat absent and explicit empty as equivalent.

---

# 97. Legacy Compatibility Audit

No code path should automatically normalize:

```text
undefined Goal provenance
```

to:

```text
{goals: []}
```

when reading old records.

---

# 98. Future Goal Activity Contract Preparation

At completion, future Task 5.7 must be able to mechanically classify each eligible historical occurrence as:

```text
provenance unavailableLegacy
```

or:

```text
provenance available
    linked to Goal X
```

or:

```text
provenance available
    not linked to Goal X
```

without inference.

---

# 99. Coverage Composition Preparation

Task 5.7 will later aggregate:

```text
plan coverage
Goal-link coverage
reporting coverage
```

Task 5.6 must only establish raw Goal-link coverage semantics.

---

# 100. Performance

No meaningful performance regression expected.

Avoid scanning current Goal authority during historical read merely to classify coverage.

Classification should be local to frozen HistoricalPlan data.

---

# 101. Privacy

No change.

No network, telemetry, sync, or external processing.

---

# 102. Required Representation Matrix

Produce:

| Historical state  | Durable representation | Goal-link coverage | Meaning |
| ----------------- | ---------------------- | ------------------ | ------- |
| legacy/pre-Goal   |                        |                    |         |
| Goal-aware empty  |                        |                    |         |
| Goal-aware linked |                        |                    |         |
| malformed         |                        |                    |         |

---

# 103. Required Publication Matrix

Produce:

| Goal authority state | Eligible occurrence | Matching Goals | Publication result |
| -------------------- | ------------------: | -------------: | ------------------ |
| ready                |                 yes |           zero |                    |
| ready                |                 yes |           one+ |                    |
| ready                |        not linkable |            n/a |                    |
| protected            |                 yes |        unknown |                    |
| initializing         |                 yes |        unknown |                    |

---

# 104. Required Compatibility Matrix

Produce:

| Input                            | Reads? | Rewritten? | Coverage meaning |
| -------------------------------- | -----: | ---------: | ---------------- |
| pre-5.3 HistoricalPlan           |        |            |                  |
| 5.3 linked provenance            |        |            |                  |
| 5.3 zero-match absent provenance |        |            |                  |
| new 5.6 Goal-aware empty         |        |            |                  |

Important: determine how 5.3-created zero-match records can be distinguished from older legacy if both are already stored identically.

If they cannot, they must remain `unavailableLegacy` rather than being guessed as known empty.

---

# 105. Transitional History Boundary

This is critical.

History created during Task 5.3–5.5 where no Goal matched may already be indistinguishable from pre-Goal history.

Do **not** infer that records created after a calendar/software date were Goal-aware unless that fact is durably encoded.

Treat ambiguous existing records as unavailable provenance.

---

# 106. Required Republication Matrix

Produce:

| Earlier publication | Later publication | Cutoff before later | Cutoff after later |
| ------------------- | ----------------- | ------------------- | ------------------ |
| legacy unknown      | Goal-aware empty  |                     |                    |
| legacy unknown      | linked            |                     |                    |
| Goal-aware empty    | linked            |                     |                    |
| linked              | Goal-aware empty  |                     |                    |

---

# 107. Required Fingerprint Matrix

Produce:

| A                      | B                      | Same fingerprint? |
| ---------------------- | ---------------------- | ----------------: |
| legacy absent          | Goal-aware empty       |                   |
| Goal-aware empty       | Goal-aware empty clone |                   |
| linked A,B             | linked B,A             |                   |
| linked Goal revision 1 | same Goal revision 2   |                   |

Use existing canonical semantics.

---

# 108. Required Backup/Restore Matrix

Produce:

| Historical provenance state | Backup V4 export | Restore | Semantic identity retained? |
| --------------------------- | ---------------- | ------- | --------------------------: |
| legacy unavailable          |                  |         |                             |
| Goal-aware empty            |                  |         |                             |
| Goal-aware linked           |                  |         |                             |

---

# 109. Required Coverage Classification Matrix

Produce:

| Record                             | Coverage classification | Specific Goal membership |
| ---------------------------------- | ----------------------- | ------------------------ |
| legacy                             | unavailableLegacy       | unknown                  |
| Goal-aware empty                   | available               | known unlinked           |
| Goal-aware linked including Goal X | available               | linked                   |
| Goal-aware linked excluding Goal X | available               | known unlinked           |

---

# 110. Required Product-Boundary Matrix

Produce:

| Capability                        | Task 5.6 |
| --------------------------------- | -------- |
| explicit Goal provenance coverage |          |
| legacy compatibility              |          |
| Goal-aware empty representation   |          |
| linked provenance                 |          |
| publication updates               |          |
| republication coverage            |          |
| fingerprint distinction           |          |
| Backup V4 compatibility           |          |
| restore compatibility             |          |
| Goal Activity projection          |          |
| Progress                          |          |
| Summary UI                        |          |
| Goal UI changes                   |          |
| ExecutionHistory changes          |          |
| Goal authority changes            |          |
| Recommendations                   |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 111. Required Architectural Invariant Assessment

Classify at least:

1. Goal-aware empty differs from legacy unavailable.
2. legacy provenance remains readable.
3. legacy provenance is never backfilled.
4. current Goal links never classify legacy history.
5. current Goal labels never classify legacy history.
6. new Goal-aware publication always records coverage for eligible occurrences.
7. zero Goal matches produce explicit known-empty provenance.
8. one+ Goal matches produce explicit linked provenance.
9. protected Goal authority never produces known-empty provenance.
10. initializing Goal authority never produces known-empty provenance.
11. absent provenance remains legacy/unavailable.
12. explicit empty provenance means known unlinked.
13. linked provenance means known membership for included Goal IDs.
14. exclusion from a Goal-aware list means known unlinked to that Goal.
15. multi-Goal provenance remains supported.
16. canonical ordering remains deterministic.
17. legacy and explicit-empty fingerprints differ.
18. clone isolation preserves the distinction.
19. JSON serialization preserves explicit empty provenance.
20. IndexedDB persistence preserves explicit empty provenance.
21. Backup V4 preserves explicit empty provenance.
22. restore preserves explicit empty provenance.
23. restore preserves legacy absence.
24. no restore normalization collapses the distinction.
25. no historical migration fabricates coverage.
26. no current-state enrichment occurs.
27. no outer HistoricalPlan version lie is introduced.
28. provenance subrecord version remains truthful.
29. old history remains semantically unchanged.
30. new publication semantics are explicit.
31. republication never mutates earlier publication.
32. canonical evaluation cutoff selects one effective publication.
33. legacy → Goal-aware republication changes coverage only after the new publication cutoff.
34. Goal-aware empty → linked republication behaves correctly.
35. linked → Goal-aware empty republication behaves correctly.
36. Goal link addition affects future publication only.
37. Goal unlink affects future publication only.
38. Goal rename does not affect coverage.
39. Goal lifecycle does not affect coverage encoding.
40. Goal authority schema is unchanged.
41. ExecutionHistory schema is unchanged.
42. scheduling semantics are unchanged.
43. Preview staleness semantics are unchanged.
44. Summary is unchanged.
45. Planner is unchanged.
46. Goal UI is unchanged.
47. Goal Activity is not implemented.
48. Progress is not implemented.
49. no Progress policy exists.
50. no Recommendation exists.
51. no adaptation exists.
52. no Capacity inference exists.
53. no machine learning exists.
54. no hidden historical Goal inference exists.
55. transitional 5.3–5.5 ambiguous history is not guessed.
56. future Goal Activity can classify raw coverage mechanically.
57. no unresolved stop condition remains.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Stop-condition violation.

---

# 112. Stop Conditions

Stop and report if:

* current HistoricalPlan storage cannot preserve explicit empty provenance distinctly from absence;
* generic serializer/canonicalizer necessarily collapses empty to absent and cannot be safely fixed within this task;
* legacy compatibility requires rewriting old records;
* 5.3-created ambiguous zero-match records cannot be distinguished from legacy and implementation attempts to guess;
* Goal-aware publication cannot guarantee coverage for all eligible occurrences;
* protected Goal authority cannot be distinguished from zero links;
* fixing coverage requires Goal authority schema changes;
* fixing coverage requires ExecutionHistory changes;
* fixing coverage requires Goal Activity implementation;
* fixing coverage requires Backup V5;
* HistoricalPlan outer-version constraints make an additive semantic change impossible without a larger migration.

Do not weaken epistemic semantics to avoid a stop.

---

# 113. Likely Files

Likely areas:

```text
HistoricalPlan domain/types
HistoricalPlan validation
HistoricalPlan publication builder
HistoricalPlan fingerprints
HistoricalPlan serialization/storage
Backup/restore tests
HistoricalPlan tests
Goal provenance fixtures
governance
```

Do not modify unrelated Goal UI/Progress code.

---

# 114. Test Strategy

Use focused tests around the exact ambiguity.

### Domain/validation

* legacy absent;
* Goal-aware empty;
* linked;
* malformed.

### Publication

* zero links;
* linked;
* protected Goal authority.

### Fingerprinting

* absent ≠ empty.

### Persistence

* explicit empty survives roundtrip.

### Backup/restore

* three semantic states preserved.

### Republication

* legacy/empty/linked transitions by cutoff.

---

# 115. Focused Validation

Run focused HistoricalPlan, Goal provenance, Backup/restore, and publication suites.

Record exact file/test counts.

---

# 116. Full Validation

Before completion run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* test file count;
* test count;
* build module count;
* bundle advisory;
* diff result.

---

# 117. Manual Validation

No UI change is expected.

No manual product walkthrough is required.

State that automated semantic validation was used.

---

# 118. Governance

On success update minimally:

* Task 5.6 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `DECISIONS.md` if the provenance-coverage rule is enduring;
* `CHANGELOG.md`.

Do not mark Goal Activity implemented.

---

# 119. ADR Determination

A new ADR is likely unnecessary if this is a bounded extension of the existing historical epistemic rule:

> missing is not known zero.

If governance treats HistoricalPlan coverage representation as an enduring architectural decision, update the relevant existing decision rather than creating ADR proliferation.

---

# 120. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.6_HISTORICAL_GOAL_LINK_PROVENANCE_COVERAGE_SEMANTICS_AND_COMPATIBILITY_REMEDIATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.5 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Ambiguity Reproduction
7. Representation Alternatives
8. Chosen Coverage Representation
9. Goal-Aware Empty Semantics
10. Goal-Aware Linked Semantics
11. Legacy Unavailable Semantics
12. Transitional 5.3–5.5 History
13. Coverage Granularity
14. Linkable Occurrence Eligibility
15. HistoricalPlan Version Decision
16. Goal Provenance Version Decision
17. Canonical Empty Representation
18. Validation
19. Strict-Key Behavior
20. Publication Builder
21. Zero-Match Publication
22. Linked Publication
23. Protected Goal Publication
24. Legacy Read Compatibility
25. No Backfill
26. No Current-State Enrichment
27. Fingerprint Semantics
28. Canonicalization
29. Serialization
30. IndexedDB Persistence
31. Clone Isolation
32. Backup V4
33. Restore
34. Full Clear
35. Goal Authority Boundary
36. ExecutionHistory Boundary
37. Scheduler Boundary
38. Preview Staleness Boundary
39. Republication
40. Legacy-to-Goal-Aware Republication
41. Empty-to-Linked Republication
42. Linked-to-Empty Republication
43. Evaluation Cutoff
44. Coverage Classification Helper
45. Goal Activity Preparation Boundary
46. Tests Added/Changed
47. Focused Validation
48. Full Validation
49. Manual Validation
50. Governance Updates
51. Deviations
52. Discoveries
53. Deferred Work
54. Representation Matrix
55. Publication Matrix
56. Compatibility Matrix
57. Republication Matrix
58. Fingerprint Matrix
59. Backup/Restore Matrix
60. Coverage Classification Matrix
61. Product-Boundary Matrix
62. Architectural Invariant Assessment
63. Stop-Condition Assessment
64. Architectural Alignment Assessment
65. Recommended Next Task
66. Final Completion Determination

---

# 121. Completion Criteria

Task 5.6 is complete only when:

* the exact Goal-aware-empty versus legacy-unavailable ambiguity identified in Task 5.5 is reproducible and documented;
* one canonical backward-compatible Goal-provenance coverage representation is chosen;
* every new Goal-aware publication can explicitly represent zero Goal links;
* explicit Goal-aware empty provenance is durably different from absent legacy provenance;
* legacy HistoricalPlan records remain valid without migration;
* legacy records are never backfilled from current Goal authority;
* transitional Task 5.3–5.5 records that cannot be proven Goal-aware are treated as provenance unavailable rather than guessed known-empty;
* Goal-aware linked provenance remains unchanged in meaning;
* Goal-aware exclusion of queried Goal ID is mechanically known-unlinked;
* Goal-aware inclusion is mechanically linked;
* absence is mechanically legacy/unavailable;
* Goal authority protection cannot be mistaken for zero Goal links;
* new publication records Goal coverage for every eligible Goal-linkable occurrence according to one explicit granularity;
* non-linkable occurrence behavior is explicit;
* HistoricalPlan outer-version handling is truthful;
* Goal provenance subrecord versioning is truthful;
* validation accepts legacy absent, Goal-aware empty, and Goal-aware linked states while rejecting malformed forms;
* strict-key behavior is preserved;
* fingerprints distinguish legacy unavailable from known empty;
* canonicalization does not collapse empty into absence;
* structured clone does not collapse the distinction;
* JSON serialization does not collapse the distinction;
* IndexedDB persistence does not collapse the distinction;
* Backup V4 roundtrip preserves all three semantic states;
* restore preserves all three semantic states without normalization;
* no Backup V5 is introduced unless an unavoidable stop condition is reported;
* republication produces new provenance semantics without mutating old publications;
* evaluation cutoff correctly exposes legacy/empty/linked state according to effective publication;
* legacy → Goal-aware, empty → linked, and linked → empty republication cases are covered;
* Goal add/remove links affect future publication only;
* Goal authority schema is unchanged;
* Goal lifecycle semantics are unchanged;
* Goal UI is unchanged;
* ExecutionHistory schema/semantics are unchanged;
* scheduling semantics are unchanged;
* Preview staleness semantics are unchanged;
* Summary is unchanged;
* no Goal Activity projection is introduced;
* no Progress policy/result/UI is introduced;
* no Recommendation, RecommendationDecision, adaptation, Capacity model, score, or machine-learning behavior is introduced;
* future Goal Activity can determine raw Goal-link coverage and membership mechanically without consulting current Goal authority;
* focused tests pass;
* lint, typecheck, full tests, build, and `git diff --check` pass;
* governance accurately records the provenance-coverage remediation while Goal Activity remains deferred;
* no unresolved stop condition remains.

---

# 122. Recommended Next Task

If Task 5.6 completes successfully:

> **Task 5.7 — Goal Activity V1 Policy and Pure Projection**

It should define and implement a derived, non-persisted Goal Activity query that combines:

```text
Goal authority
+
HistoricalPlan frozen Goal provenance
+
ExecutionHistory
```

to produce:

* categorical linked planning dispositions;
* categorical linked scheduled outcomes;
* plan coverage;
* Goal-link coverage;
* reporting coverage;
* provenance;
* cold-start/legacy/protected states;

with **no score and no Progress percentage**.

Do not integrate it into Summary until the projection itself has been audited and validated.

---

# 123. Final Implementation Principle

> **DayFrame may say “nothing was linked” only when history proves that Goal relationships were actually observed. Otherwise it must say that the relationship is unknown.**

---

# 124. Final Completion Statement

**Task 5.6 is complete when HistoricalPlan can durably and mechanically distinguish a Goal-aware publication that captured zero Goal relationships from a legacy or otherwise provenance-unavailable publication in which Goal relationships were never captured; when new Goal-aware publications explicitly preserve coverage even for empty Goal sets; when linked, known-unlinked, and legacy-unknown Goal membership states survive validation, canonicalization, fingerprinting, structured cloning, IndexedDB persistence, Backup V4 export/import, restore, and republication without semantic collapse; when old HistoricalPlan data remains valid and is never rewritten, backfilled, or enriched from current Goal authority; when ambiguous Task 5.3–5.5 records remain explicitly unknown rather than being guessed Goal-aware; when Goal authority protection cannot be interpreted as zero links; when publication coverage granularity and Goal-linkable occurrence eligibility are explicit; when effective-publication selection by evaluation cutoff yields the correct legacy, empty, or linked state after republication; when Goal authority, Goal UX, ExecutionHistory, scheduling, Preview staleness, Summary, and existing Historical Intelligence remain semantically unchanged; when no Goal Activity projection, Progress policy, Progress result, Summary integration, Recommendation, RecommendationDecision, adaptive mutation, Capacity model, score, machine-learning behavior, or unrelated feature is introduced; when focused and canonical validation are green; when governance records the remediation accurately; and when future Task 5.7 can determine Goal-link coverage and membership solely from frozen HistoricalPlan data without consulting or inferring from current Goal authority.**
