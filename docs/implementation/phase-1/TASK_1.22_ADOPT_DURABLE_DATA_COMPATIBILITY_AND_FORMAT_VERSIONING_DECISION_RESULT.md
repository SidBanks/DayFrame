# Task 1.22 — Adopt the DayFrame Durable-Data Compatibility and Independent Format-Versioning Decision — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.22  
**Status:** Complete  
**Execution type:** Architectural decision / governance adoption

---

# Decision Review Completed

Task 1.21's recommendation was reviewed against the Task 1.22 decision standard:
user-data preservation, architectural evolvability, migration and compatibility
burden, backup recovery expectations, deterministic state ownership, failure
transparency, project maturity, and epistemic integrity.

The recommendation was adopted without substantive deviation. The review concluded
that one universal compatibility horizon would not reflect the lifecycle evidence:
active local state, saved profiles, and exported backups require distinct strengths
and retirement evidence.

---

# Artifact Integrity

The immutable Task 1.22 artifact was verified complete at 909 lines and ended with
the required final completion sentence. Its SHA-256 is:

```text
5544f0de2c28f0324608fd8a1cb0c0494d5af16c876535ce3411b3ab2a1500db
```

The saved artifact was byte-identical to the supplied attachment before execution
and remained unchanged.

---

# Task 1.21 Recommendations Reviewed

The review covered:

- durable-data classifications and lifecycle control;
- current accidental V1 semantics;
- compatibility directions;
- migration definition and completion evidence;
- unsupported-format and recovery requirements;
- backup compatibility alternatives;
- profile protection as an intermediate category;
- format-version meaning and increment rules;
- independent surface versioning;
- compatibility-retirement criteria and authority;
- treatment of pre-public-release data; and
- current V1 consequences.

Task 1.20's historical producer and retirement-horizon evidence was used as the
concrete case supporting the general policy.

---

# Unresolved Governance Choices Resolved

Task 1.22 resolved the choices left open by Task 1.21:

- **Backup policy:** Long-Lived Versioned Compatibility is adopted. Direct import
  need not exist forever, but a supported recovery route must survive its removal.
- **Backup recovery delivery:** the policy permits in-app legacy import, a
  maintained offline converter, or a designated recovery release. It governs the
  recovery outcome rather than freezing one implementation.
- **Profiles:** classified as Intermediate User-Authored Durable Data.
- **Raw-download recovery:** not universally mandated; proportional,
  non-destructive recovery is mandatory.
- **Pre-public-release data:** receives the normal compatibility presumption unless
  non-distribution/non-use and an explicit exclusion are both established.
- **Retirement authority:** an explicit accepted ADR under DayFrame architectural
  governance is required.
- **Support durations:** numeric/calendar values are deliberately deferred. Each
  relevant future format decision must define its window; backup windows must be
  explicitly long-lived.

---

# Final Adopted Policy

DayFrame now treats durable authored data it writes or exports as user data.
Supported historical data enters through narrow compatibility/migration boundaries
and normalizes to current state. Internal surfaces use bounded, observable,
non-destructive migration; backups receive long-lived versioned direct-import and
recovery/conversion continuity. Unsupported or ambiguous data is preserved and
explicitly rejected or recovered, never silently degraded.

The adopted surface commitments are:

| Surface | Adopted commitment |
| --- | --- |
| Active local state | Bounded backward reading with eager or durably observable atomic migration; evidence and skipped-installation recovery before retirement. |
| Saved profiles | Strong bounded support, atomic collection migration, preservation of unconvertible entries, and explicit recovery. |
| Backup files | Long-lived versioned direct import plus a maintained recovery/conversion route before direct-reader retirement. |

Durable versions define compatibility contracts rather than exact frozen layouts.
Compatible extensions may remain within a version only while promised readers stay
safe and meaningful data is not silently lost. Breaking representation, semantics,
validation, or reader compatibility requires a new version or migration epoch.

Local persistence, profile storage, and backup formats are independently versioned.

---

# Deviations From Task 1.21

No substantive deviations.

Task 1.22 converted Task 1.21 recommendations into binding wording and resolved its
bounded alternatives as directed. It did not invent numeric support periods or
select concrete converter, envelope, migration-marker, telemetry, or recovery-UI
implementations.

---

# ADR Created

Created:

`docs/architecture/ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

The ADR contains every required section, adopted policy and compatibility matrices,
version rules, existing V1 treatment, consequences, alternatives, deferred choices,
implementation implications, evidence basis, and supersession rules.

Its status is **Accepted** and its date is 2026-08-13.

---

# Affected Governance Documents Reviewed

Reviewed without modification:

- `docs/architecture/Architectural_Charter.md`;
- `docs/architecture/DECISIONS.md`;
- `docs/architecture/DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`;
- `docs/alignment/Implementaion_Alignment_Strategy.md`;
- `docs/Implementation_Execution_Plan.md`;
- Task 1.20 result;
- Task 1.21 specification and result; and
- relevant Phase 1 compatibility artifacts.

The ADR aligns with Architecture Governs Implementation, Preserve Deterministic
State Ownership, Preserve Forward Migration Paths, Resolve Root Causes Before
Symptoms, Preserve Context, Local Simplicity/Global Coherence, Determinism Over
Cleverness, Epistemic Integrity, Historical Immutability, Architectural
Traceability, and User Data Preservation.

`CURRENT_STATE.md`, `CHANGELOG.md`, `DECISIONS.md`, the architecture specification,
and checkpoints were not updated because Task 1.22 authorizes only the standalone
ADR and result before project review.

---

# Existing V1 Treatment

Adoption does not reinterpret or alter V1:

```text
dayframe-store-v1
    historical singular + current plural family

profile version 1
    historical singular + current plural family

backup version 1
    historical singular + current plural family
```

V1 remains a legacy broad compatibility family. All three singular `shiftCycle`
readers remain supported. No new version or retirement is authorized.

---

# Implementation Consequences Identified

Future separately authorized alignment work may need:

- independent format envelopes and identifiers;
- supported-version documentation or a registry;
- eager, atomic, observable local/profile migrations;
- recovery-safe writes and surfaced persistence failures;
- explicit malformed/unsupported/migration-failure classification;
- preservation or quarantine of invalid profile entries;
- compatibility and failure-path fixtures;
- backup conversion continuity; and
- recovery guidance and UX.

The adopted ADR conceptually governs such work but does not authorize it.

---

# Explicitly Deferred Implementation Work

No production code, tests, schema, storage key, version identifier, validator,
normalizer, migration, telemetry, converter, compatibility reader, error handling,
or recovery UX was changed.

Numeric support windows, concrete recovery mechanisms, raw-download UX,
unknown-field preservation, telemetry, format envelopes, and organizational role
names remain for future decisions/tasks where needed.

Unrelated Phase 1 ownership and lifecycle findings remain outside this decision.

---

# Validation Performed

Documentation and governance validation:

- Task 1.22 artifact hash and byte identity verified;
- ADR existence and required-section coverage verified;
- result artifact created separately;
- Task 1.21 recommendation and evidence reviewed;
- all decision questions resolved or deliberately deferred as authorized;
- existing V1 readers confirmed retained by policy;
- language reviewed to ensure the ADR does not imply implementation authorization;
- production/test worktree state compared with the pre-execution baseline.

Repository standard validation results are recorded below after final execution.

```text
npm run lint       passed
npm run typecheck  passed
npm test           22 files passed; 244 tests passed
npm run build      passed; 42 modules transformed
```

---

# Discoveries and Deferred Work

- The existing `DECISIONS.md` is a compact foundational index, while Task 1.22
  requires a standalone detailed ADR. The new ADR follows the Charter's governance
  model without altering the historical decision index before project review.
- The existing V1 identifiers remain too broad to serve as future exact migration
  boundaries.
- Current executable behavior has known gaps against the adopted policy; the ADR
  records these as implementation implications rather than claiming alignment.
- Reader retirement remains a separate architectural decision and implementation
  sequence.

---

# Final Completion Determination

Task 1.22 is complete from an architectural-adoption standpoint. DayFrame now has
an accepted ADR defining durable-data compatibility, migration, independent format
versioning, unsupported-format behavior, recovery obligations, backup continuity,
pre-public-release treatment, and compatibility-retirement authority.

The decision changes governance only. Existing executable behavior and all V1
compatibility readers remain unchanged.
