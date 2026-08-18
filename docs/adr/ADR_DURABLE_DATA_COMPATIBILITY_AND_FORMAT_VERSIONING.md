# ADR — Durable-Data Compatibility and Independent Format Versioning

**Status:** Accepted  
**Date:** 2026-08-13  
**Decision scope:** DayFrame durable authored data  
**Evidence basis:** Tasks 1.20–1.22

---

# Context

DayFrame writes active authored setup to browser-local persistence, stores named
profiles for reuse, and exports portable backup files for later recovery. These
surfaces contain user-authored data but have different lifecycles and different
degrees of application control.

The historical `shiftCycle` to `shiftCycles` transition exposed the absence of an
explicit durable-data contract. Earlier DayFrame implementations produced singular
cycle data in local persistence, profiles, and Version 1 backups. Later writers
adopted plural cycles without changing the existing `v1` identifiers. Current code
still reads the historical representation at three narrow ingress boundaries and
normalizes it to plural runtime state.

Task 1.20 established that none of those readers has a defensible retirement
horizon. Task 1.21 established an evidence-backed policy recommendation. This ADR
adopts that recommendation and resolves its remaining governance choices.

This decision governs future durable DayFrame models as well as the current cycle
case. It does not govern disposable caches or reproducible derived data unless a
separate decision classifies such data as durable user data.

---

# Problem

Without an explicit policy, a format change can accidentally:

- strand data previously written by DayFrame;
- mistake in-memory normalization for completed migration;
- silently turn unsupported data into incomplete current state;
- couple unrelated storage surfaces to one version sequence;
- retain every historical reader indefinitely without review; or
- remove a reader based on code cleanliness or elapsed time rather than evidence.

DayFrame needs stable rules for compatibility strength, version meaning, migration,
recovery, and retirement authority while preserving architectural evolvability.

---

# Decision

DayFrame adopts the following foundational rule:

> Durable authored data written or exported by DayFrame is user data. DayFrame
> preserves it through an explicit supported reader, migration, conversion, or
> non-destructive unsupported-format recovery path.

Supported historical representations enter through narrow compatibility adapters
and normalize to one current representation. Historical shapes do not propagate
into current runtime, domain, or scheduling APIs.

Compatibility is surface-specific, versioned, and evidence-governed. Unsupported
or ambiguous durable data must never silently degrade into incomplete but
apparently valid state.

This ADR is binding architecture. It authorizes no executable change by itself.

---

# Durable-Data Categories

## Active local state

Active local state is operational authored data controlled by DayFrame only within
the browser instance currently running the application. It receives bounded
backward-reading compatibility and managed migration.

## Saved profiles

Saved profiles are **intermediate user-authored durable data**. They are
application-controlled collections, but users deliberately name and retain them
for later reuse. They receive stronger protection than active state and a bounded,
evidence-based horizon rather than an indefinite portable-data guarantee.

## Backup files

Backup files are portable, user-controlled recovery artifacts. After export,
DayFrame cannot enumerate, rewrite, expire, or revoke copies. They receive the
strongest and longest-lived compatibility commitment.

Different categories may have different support and retirement horizons.

## Adopted Policy Matrix

| Durable Surface | Classification | Compatibility Commitment | Migration Model | Retirement Basis | Unsupported-Format Rule |
| --- | --- | --- | --- | --- | --- |
| Active local state | Operational durable user data | Bounded backward reading through a declared migration window | Eager or otherwise durably observable, atomic, idempotent, retryable in-place migration | New boundary, migration correctness and population evidence, elapsed declared window, skipped-installation recovery, explicit ADR review | Preserve original; classify and provide proportional recovery; never overwrite or silently default away authentic data |
| Saved profiles | Intermediate user-authored durable data | Strong bounded backward reading, stronger than active state | Atomic collection migration with preservation/quarantine of entries that cannot migrate | Per-collection completion evidence, failure safety, declared window, recovery route, explicit ADR review | Preserve collection and entries; visible classification and recovery; never silently discard entries |
| Backup files | Portable user-held recovery artifact | Long-lived versioned direct import plus recovery/conversion continuity | Read-time conversion without mutating source; maintained recovery route after direct import retires | Declared long-lived support boundary, newer supported format, maintained recovery mechanism, tests, notice, explicit ADR review | Preserve source and reject explicitly with version-specific conversion or recovery guidance |

---

# Compatibility Direction

| Direction | Adopted Policy |
| --- | --- |
| Current DayFrame reads supported historical data | Guaranteed for explicitly supported versions. Read through a compatibility adapter or migration and normalize without silent loss. |
| Current DayFrame encounters unsupported historical data | Do not interpret silently. Preserve the original and route to explicit rejection, recovery, or conversion. |
| Current DayFrame encounters future-version data | No general guarantee. Reject explicitly unless that future format declares a safe compatibility range that this reader implements. |
| Historical DayFrame reads current data | No general guarantee. Maintain only when explicitly declared for a particular compatible extension. |

Permissive parsing does not create a forward-compatibility promise. A reader may
claim forward compatibility only when it can preserve the future format's meaning
and any required unknown data through the operations it permits.

---

# Migration Policy

In-memory normalization is not completed migration.

A durable migration must be:

- deterministic;
- atomic;
- durable;
- idempotent;
- retryable;
- observable;
- validated before replacement; and
- non-destructive on failure.

The last known recoverable representation must remain available until the migrated
replacement is validated and durably accepted. A persistence failure does not count
as success and must not produce a successful migration marker.

Migration implementation correctness and affected-population migration are
different claims. Tests establish that migration logic works. Retirement based on
migration additionally requires surface-appropriate evidence that affected data
has migrated or remains recoverable. Evidence may include durable format markers,
successful rewritten versions, per-collection state, an adopted release-circulation
window, or explicit conversion of an artifact.

---

# Format-Version Definition

A durable format version identifies a compatibility contract, not necessarily one
frozen serialized layout. The contract defines:

- structural and semantic meaning;
- required and optional fields;
- validation and normalization behavior;
- handling of unknown fields;
- reader and writer relationships;
- supported migration or conversion paths; and
- unsupported-version behavior.

A version may contain compatible extensions only when every reader promised for
that version remains safe and meaningful data is not silently lost through normal
use or round trips. Application/package release versions do not substitute for
durable format versions. A release may read several format versions while writing
one current version.

---

# Version-Increment Rules

The following may remain within one durable version only when the existing contract
explicitly permits them and all promised readers remain safe:

- adding an optional field with unchanged semantics that readers safely ignore or
  default;
- adding a required field only when all historical data has a deterministic,
  meaning-preserving default and promised old readers remain safe;
- accepting an additional historical representation through an unambiguous ingress
  adapter without changing current writer meaning.

A new version or explicit migration epoch is required **before** a change that:

- incompatibly renames or removes a field;
- incompatibly changes a field representation;
- materially changes field semantics;
- adds a required field without deterministic historical meaning;
- tightens validation against data valid under the released contract;
- requires migration to preserve meaning;
- breaks a supported reader; or
- makes safe interpretation or round-trip preservation impossible under the old
  contract.

Any removal of an accepted historical representation additionally requires the
retirement review defined below. A new version alone does not authorize reader
removal.

---

# Independent Versioning

Active local persistence, profile storage, and backup files are independently
versioned. Their lifecycles, user roles, migration capabilities, support horizons,
and retirement evidence differ; synchronized numbers would imply a false contract
and force unrelated changes.

Shared authored substructures may receive an independently governed schema
generation if an executable need later justifies it. Such a component version does
not automatically increment every containing surface.

---

# Unsupported-Format Behavior

Authentic historical or ambiguous DayFrame durable data must not be silently
converted into incomplete but apparently valid current state.

Readers must distinguish, as far as actionable recovery requires:

- malformed data;
- unsupported format/version;
- migration or conversion failure; and
- durable-write failure.

Unsupported data is preserved and either rejected explicitly or routed to a safe
conversion/read-only recovery mechanism. Unknown future versions are not guessed
from structural similarity.

---

# Recovery Requirements

A failed parse, migration, conversion, or durable write must not destroy the last
known recoverable representation of user data.

Recovery must be proportional to the surface and available interpretation. Valid
mechanisms include copy-before-replace, atomic replacement, rollback, quarantine,
preservation of source storage, export of recoverable raw data, converter use,
manual restoration, or a designated recovery release.

This ADR does not mandate a universal raw-download UI. It mandates a documented,
non-destructive recovery path appropriate to the surface. When semantics are not
safe to interpret, preservation and explicit rejection take precedence over
partial recovery.

---

# Backup Compatibility Commitment

DayFrame adopts **Long-Lived Versioned Compatibility**.

DayFrame does not promise direct import of every historical backup version forever.
It does promise that a released DayFrame-produced backup will not lose all
supported recovery paths merely because its direct reader retires.

Before direct import support ends, DayFrame must provide at least one maintained,
documented, non-destructive route capable of producing a currently supported
format or recoverable normalized data:

- in-application legacy import;
- a standalone offline converter; or
- a designated maintained recovery release.

The policy governs the recovery guarantee and does not freeze one delivery
mechanism. Each future backup-format decision must define an explicitly documented,
long-lived support period. This ADR deliberately sets no arbitrary numeric or
calendar duration.

---

# Profile Compatibility Commitment

Profiles receive backward reading and durable migration throughout their declared
support window. Migration must operate atomically on the collection, preserve or
quarantine entries that cannot migrate, surface failure, and remain retryable.

Profile compatibility may retire only after successful per-collection migration
evidence or an accepted recovery route, a declared support window, and explicit
architectural review. Release age or apparent inactivity alone is insufficient.

---

# Local-State Compatibility Commitment

Active local state may lose an old reader after a declared migration window only
when:

- a new format/version boundary distinguishes the generations;
- migration is eager or otherwise durably observable;
- migration is atomic, durable, idempotent, and retryable;
- write failure cannot be mistaken for completion;
- the declared support window has elapsed;
- skipped-installation recovery behavior exists; and
- an explicit retirement ADR authorizes removal.

Release age alone is insufficient.

---

# Retirement Criteria

A compatibility reader protecting data DayFrame produced may be removed only when
all applicable conditions are met:

1. the durable surface and affected versions are explicitly identified;
2. a format discriminator separates the historical data from current output;
3. migration/conversion is tested, deterministic, non-destructive, and safe under
   persistence failure;
4. the applicable declared support window and notice obligations are satisfied;
5. evidence addresses affected-data migration, not merely code correctness;
6. unsupported data has an explicit recovery/conversion or rejection path;
7. compatibility fixtures are retained or intentionally replaced by retirement
   behavior tests;
8. remaining uncertainty and user-data risk are recorded; and
9. a dedicated architectural decision explicitly authorizes removal.

Portable artifacts cannot be centrally enumerated. Backup reader non-use is not a
required proof when a maintained conversion/recovery commitment survives direct
reader retirement.

---

# Retirement Authority

Compatibility retirement requires an explicit Architectural Decision Record under
DayFrame governance. The ADR must identify the surface and versions, cite evidence,
state remaining uncertainty, define unsupported-format and recovery behavior,
confirm the support-window obligations, and authorize the reader removal.

No implementation task may infer retirement authority from elapsed time, low code
usage, current writer cleanliness, aesthetic simplicity, or the existence of a new
version.

The owner and approver are the architectural authority operating under the DayFrame
Architecture Charter. A future governance revision may name organizational roles;
lack of such a role name does not delegate retirement authority to implementation.

---

# Pre-Public-Release Durable Data

Data is not disposable solely because its producing build predates a formal public
release. A historical format may be excluded from the normal compatibility
presumption only when evidence establishes both that:

1. the producing build was not distributed or used with real user-authored data;
   and
2. an adopted policy or ADR explicitly classifies that development cohort as
   unsupported.

Absent both findings, DayFrame-produced durable data receives the policy applicable
to its surface.

---

# Existing V1 Treatment

This decision does not retroactively reinterpret existing identifiers:

```text
local dayframe-store-v1
    historical singular + current plural family

profiles version 1
    historical singular + current plural family

backup version 1
    historical singular + current plural family
```

Existing V1 is a legacy broad compatibility family, not an exact schema generation.
All three singular `shiftCycle` readers remain supported. No version increment,
format change, migration, converter, or reader retirement occurs through this ADR.

---

# Consequences

Future durable-format work begins by identifying the surface, current compatibility
contract, version impact, migration, recovery, evidence, and retirement authority.
Historical representations remain localized at ingress while normalized runtime
ownership stays current and deterministic.

Current executable behavior is not assumed to satisfy this policy. Known gaps—such
as silent fallback, profile-entry filtering, swallowed persistence failures,
absence of durable migration markers, and incomplete format discrimination—require
separately authorized alignment work.

## Positive Consequences

- user data receives explicit, non-destructive protection;
- format evolution remains possible without permanent propagation of legacy shapes;
- compatibility direction and version meaning are no longer ambiguous;
- different surface lifetimes receive proportionate commitments;
- migration correctness is separated from population convergence;
- future reader retirement becomes reviewable and traceable;
- normalized runtime state preserves deterministic ownership and local simplicity.

## Negative Consequences / Costs

- supported historical formats require fixtures, adapters, documentation, and
  maintenance;
- migrations require atomicity, failure handling, and completion evidence;
- backup retirement requires continued recovery infrastructure;
- independent versions add governance and testing overhead;
- stricter failure transparency may require recovery UX and storage redesign;
- reader removal will take more evidence and explicit review than code cleanup
  alone.

---

# Alternatives Considered

## Indefinite direct compatibility for every format

Rejected as a universal rule. It maximizes recovery but creates unbounded reader
burden and can prevent safe architectural evolution. Direct support remains
preferred when inexpensive; recovery continuity is the binding backup promise.

## Current-version-only compatibility

Rejected. It can strand DayFrame-produced user data and conflicts with backup and
profile recovery expectations.

## One synchronized durable version

Rejected. The surfaces have different lifecycles, migration capabilities, and
retirement evidence; synchronization would create artificial coupling.

## Release age as retirement evidence

Rejected. Age does not prove dormant local/profile data migrated or external
backups ceased to exist.

## Universal raw-download recovery

Not adopted as a fixed mechanism. Appropriate recovery is mandatory; its delivery
depends on the surface and safely available interpretation.

---

# Deferred Decisions

- numeric/calendar support-window durations;
- the recovery mechanism selected for each future retired backup version;
- concrete envelopes, keys, version numbers, and migration markers;
- whether and where raw-download recovery UX is useful;
- privacy-appropriate telemetry, if any, as supplementary migration evidence;
- unknown-field round-trip requirements for future formats;
- named organizational roles beyond the existing architectural authority.

Each future format/version decision must set a support window where relevant. A
future decision may not use this deferral as permission to omit one before
retirement.

---

# Implementation Implications

Separately authorized alignment work may introduce independent format envelopes,
version registries, atomic migrations, persistence-failure reporting, recovery-safe
writes, invalid-entry quarantine, compatibility fixtures, converters, and
user-visible recovery guidance.

This ADR does not authorize any such change. Implementation must preserve existing
V1 readers until an authorized task changes them consistently with this policy.

---

# Validation / Evidence Basis

This decision is grounded in:

- Task 1.20's historical-reader, convergence, version, risk, and detectability
  investigation;
- Task 1.21's durable-surface analysis and policy/versioning matrices;
- executable local-state, profile, and backup readers/writers;
- compatibility tests for singular-only historical data and plural-only output;
- repository producer history (`7e8ea7b`, `37db89c`); and
- the DayFrame Architecture Charter and principles of deterministic ownership,
  preserved context, epistemic integrity, historical traceability, and user-data
  preservation.

The decision was reviewed against user-data preservation, evolvability,
implementation burden, migration burden, recovery expectations, deterministic
state ownership, failure transparency, test burden, and project maturity.

---

# Supersession / Revision Rules

This ADR remains in force until explicitly superseded or revised by a later
accepted ADR. A revision must:

- cite this decision and the evidence motivating change;
- identify affected durable surfaces and compatibility promises;
- preserve or explicitly replace recovery obligations;
- state consequences for all supported existing versions;
- define transition and retirement evidence; and
- avoid retroactively claiming that historical data was unsupported.

Editorial clarification that does not change the decision may be made through the
normal governance process. Any change to compatibility strength, recovery
continuity, migration-completion semantics, version rules, or retirement authority
requires an ADR.
