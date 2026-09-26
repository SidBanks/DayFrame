# DayFrame End-State Compatibility & Retirement Architecture Specification V1

**Document Type:** Canonical Architecture Specification\
**Status:** Accepted Design Direction --- Pre-Implementation\
**System:** DayFrame\
**Domain:** Product Convergence, Compatibility, Retirement, Migration,
Testing, Documentation, and Historical Integrity\
**Version:** 1.0\
**Date:** 2026-09-22

------------------------------------------------------------------------

## 1. Purpose

This specification defines how DayFrame transitions obsolete
capabilities, surfaces, workflows, representations, adapters, and
compatibility paths from active use to eventual physical removal.

> **Converge first. Retire later.**

> **Retirement ends product authority; removal deletes implementation.**

Retirement may precede removal by months or years. The purpose is to
remove obsolete future authority safely without rewriting the past or
abandoning supported user data.

------------------------------------------------------------------------

## 2. Governing Principles

1.  **Capabilities retire before surfaces.**
2.  **Retirement ends product authority; it does not necessarily imply
    physical deletion.**
3.  **Removal requires proof that the retired implementation is no
    longer required for active behavior, migration, compatibility,
    persistence, history, recovery, tests, or provenance.**
4.  **Compatibility is a responsibility, not a lifecycle state.**
5.  **Compatibility preserves access to the past; it must not become an
    alternative way to create the future.**
6.  **Retirement requires parity with every still-valid capability, not
    every historical behavior.**
7.  **Tests protect supported behavior, data, compatibility, and
    architectural invariants---not retired surfaces as museum pieces.**
8.  **Retire the test's obsolete representation, not the invariant it
    discovered.**
9.  **Code age is not evidence of removability. Reachability from
    supported persisted data is.**
10. **The past remaining immutable is critical to the DayFrame User
    Loop.**
11. **Historical presentation may modernize terminology only when the
    translation is semantically lossless.**
12. **Retirement and removal require explicit architectural authority
    and durable documentation.**

------------------------------------------------------------------------

## 3. Capability Lifecycle

``` text
ACTIVE
  ↓
TRANSITIONAL
  ↓
DEPRECATED
  ↓
RETIRED
  ↓
REMOVABLE
  ↓
REMOVED
```

**Active** --- canonical supported product capability. New work may
depend on it.

**Transitional** --- a replacement exists or is being built, but
retirement parity is not yet proven.

**Deprecated** --- replacement parity is sufficiently proven that the
old capability should receive no new product investment, though final
retirement may still be pending.

**Retired** --- no required ordinary product behavior depends on the
capability. No new product feature may depend on it.

**Removable** --- evidence proves the retired implementation is no
longer required for supported behavior, data, compatibility, history,
recovery, tests, or provenance.

**Removed** --- physical deletion has been explicitly authorized and
completed.

Retirement is one-way by default. Reactivation requires an explicit
architecture decision.

------------------------------------------------------------------------

## 4. Compatibility

Compatibility may coexist with lifecycle states:

``` text
TRANSITIONAL + COMPATIBILITY-REQUIRED
RETIRED + COMPATIBILITY-REQUIRED
```

Removing an old UI does not imply its persisted representation no longer
matters.

A retired authoring surface may disappear while readers, converters,
validators, adapters, or recovery support remain for years.

------------------------------------------------------------------------

## 5. Capability-Level Retirement

Retirement is evaluated per capability before it is evaluated per
surface.

Every capability in a retirement candidate receives one disposition:

``` text
REPLACED
MOVED
OBSOLETE BY ARCHITECTURE
COMPATIBILITY-ONLY
DEFERRED — RETIREMENT BLOCKED
```

**Replaced** --- a canonical replacement provides the valid capability.

**Moved** --- the capability remains supported on another canonical
surface.

**Obsolete by Architecture** --- the old behavior is no longer valid and
must not be recreated merely for parity.

**Compatibility-Only** --- required only to understand, preserve,
migrate, recover, or safely operate existing legacy state.

**Deferred --- Retirement Blocked** --- the capability remains valid but
lacks an adequate canonical replacement.

A surface may retire only when every capability it contains has an
explicit disposition and no still-valid ordinary capability depends on
it.

------------------------------------------------------------------------

## 6. Retirement Parity Gate

A valid capability may retire only after its replacement passes all
applicable gates:

1.  Semantic Parity
2.  Authority Parity
3.  Capability Parity
4.  Reachability Parity
5.  Data Round-Trip Parity
6.  Historical / Protection Parity
7.  Migration / Compatibility Parity
8.  Mobile Parity
9.  Accessibility Parity
10. Failure / Recovery Parity
11. Observability / Explainability Parity
12. Regression Evidence
13. Dogfood Evidence

A visual comparison is insufficient.

### Semantic Parity

Every still-valid concept has a lawful representation or an explicit
disposition.

### Authority Parity

The replacement uses the correct canonical owners and commands. It may
not create UI-local authority, bypass provenance, or collapse authored,
derived, historical, or Progress authority.

### Capability Parity

Every still-valid user capability remains supported somewhere canonical.
One-for-one screen duplication is not required.

### Reachability Parity

Ordinary capabilities must be reachable through canonical navigation
without secret compatibility routes.

### Data Round-Trip Parity

Editing through the replacement preserves valid data the user did not
explicitly change. Hidden advanced data may not be silently erased.

### Historical / Protection Parity

Immutable history, provenance, protected-state behavior, unknown
evidence, and fail-closed semantics remain intact.

### Migration / Compatibility Parity

Old supported persisted data remains understandable, preservable,
migratable where safe, and historically interpretable.

### Mobile Parity

The standing Mobile Acceptance Gate applies. Desktop-only replacement is
not parity.

### Accessibility Parity

Keyboard, focus, semantic controls, labels, errors, and relevant
accessible interactions remain supported.

### Failure / Recovery Parity

Canonical validation, persistence failure, protected evidence, and
blocked operations fail safely.

### Observability / Explainability Parity

Users retain access to consequential explanations: what happened, why,
what is blocked, and what remains unresolved.

### Regression Evidence

Automated tests prove the relevant contracts.

### Dogfood Evidence

Representative real workflows exercise the replacement before
retirement.

------------------------------------------------------------------------

## 7. Valid Parity vs Historical Behavior

Retirement requires parity with every **still-valid** capability, not
every behavior that ever existed.

If architecture intentionally rejects a legacy behavior, classify it:

``` text
OBSOLETE BY ARCHITECTURE
```

Do not recreate invalid behavior merely to claim feature parity.

------------------------------------------------------------------------

## 8. Compatibility-Only Rules

Once a capability becomes Compatibility-Only:

-   it leaves ordinary primary workflows;
-   it remains deliberately reachable when supported existing data
    requires it;
-   users without legacy state should not encounter it;
-   canonical product paths must not create new legacy state;
-   where safe migration exists, the path should be exit-oriented toward
    canonical representation.

> **Compatibility paths preserve access to the past; they must not
> become alternative ways to create the future.**

Where no lossless migration exists, preservation is preferable to
fabricated conversion.

------------------------------------------------------------------------

## 9. Physical Removal of Compatibility Code

No UI links remaining is not proof of removability.

Compatibility code may be removed only when supported persisted state
can no longer require it through one of these conditions:

### A. Guaranteed Migration

All supported legacy state has a proven lossless migration guaranteed to
run before old code could be needed.

### B. No Persisted Reachability

The representation was never persisted and no supported active or
historical evidence can reference it.

### C. Explicit Support-Boundary Decision

Architecture deliberately ends support with a migration, export,
recovery, or preservation strategy for affected users.

Condition C should be rare. DayFrame must not abandon users or their
data because old code is inconvenient.

------------------------------------------------------------------------

## 10. Migration Completion Standard

Migration is complete only when all three closures are proven:

### Production Closure

No supported path can create new legacy state.

### Population Closure

Every supported persisted instance has been migrated, deliberately
retired, or safely preserved outside active authority.

### Loader Closure

Normal supported application loading can no longer encounter the legacy
representation.

Only after all three closures may legacy readers, converters,
validators, migrations, and compatibility tests become removal
candidates.

> **"Most users have migrated" is not migration completion while
> remaining users are still supported.**

------------------------------------------------------------------------

## 11. Test Lifecycle

Tests follow supported authority.

When a surface is active, retain appropriate UI, navigation, mobile,
accessibility, authority, data-integrity, and compatibility coverage.

When the surface retires, retire obsolete:

``` text
UI rendering tests
navigation tests
mobile-layout tests
accessibility interaction tests
surface-specific workflow tests
```

Continue to retain, as applicable:

``` text
data fidelity tests
migration tests
compatibility tests
historical integrity tests
provenance tests
round-trip tests
```

When migration/support closure is complete and compatibility code is
removed, compatibility-specific tests may retire.

------------------------------------------------------------------------

## 12. Timeless Architectural Invariant Tests

Before deleting a legacy test, classify what it protects:

``` text
SURFACE BEHAVIOR
→ retire with surface

COMPATIBILITY BEHAVIOR
→ retain until migration/support ends

TIMELESS ARCHITECTURAL INVARIANT
→ preserve in the appropriate canonical test layer
```

Example: an old UI test may disappear, while the invariant that distinct
Accepted Schedules remain distinct survives permanently in canonical
domain/evidence tests.

> **Retire the test's obsolete representation, not the invariant it
> discovered.**

------------------------------------------------------------------------

## 13. Historical Data

Retirement never deletes lawful Historical Domain Objects.

Retiring a surface, capability, adapter, authoring model, or terminology
changes future product authority. It does not rewrite observed reality.

> **The past remaining immutable is critical to the DayFrame User
> Loop.**

Historical deletion, if DayFrame ever supports it, requires separate
explicit user/data-governance authority and is not a consequence of
retirement.

------------------------------------------------------------------------

## 14. Historical Vocabulary Modernization

Historical presentation may use current Product Ontology when
translation is semantically lossless.

Example:

``` text
Historical representation:
ManualEventV1

Modern presentation:
Event
```

is acceptable if meaning and authority are unchanged.

Historical semantics may not be falsely modernized.

A legacy Sleep Commitment must not be displayed as though it had always
been First-Class Sleep if that erases a real authority distinction.

A lawful modern presentation may instead say:

``` text
Sleep
Legacy scheduling model
```

> **Preserve historical identity and semantics exactly; modernize
> presentation only when meaning is unchanged.**

------------------------------------------------------------------------

## 15. Documentation Lifecycle

### Canonical Architecture

Describes current supported truth and changes when retirement/removal is
explicitly authorized.

### ADRs, Task Specifications, RESULTs, and Dogfood Evidence

Remain immutable engineering history. Do not rewrite them to pretend old
terminology or systems never existed.

### Migration and Compatibility Documentation

Explains how old supported data remains usable, migratable, recoverable,
or safely preserved.

### User Documentation

Describes current canonical workflows and exposes compatibility guidance
only when relevant to affected users.

A historical Task RESULT may therefore say `My Schedule` forever while
current Product Ontology says `Schedule Setup`. Both are truthful in
their temporal contexts.

------------------------------------------------------------------------

## 16. Retirement Authority

Because retirement changes DayFrame's supported product contract:

> **Retirement cannot occur implicitly through implementation cleanup.**

Tools, Codex, audits, or developers may gather evidence and recommend:

``` text
RETIREMENT CANDIDATE
```

Formal retirement requires an explicit Architecture/Task decision and
durable documentation.

The authority chain is:

``` text
Capability convergence
        ↓
Retirement Parity Gate passes
        ↓
Compatibility requirements evaluated
        ↓
RETIREMENT CANDIDATE
        ↓
Explicit Architecture / Task Decision
        ↓
RETIREMENT AUTHORIZED
        ↓
Canonical architecture updated
        ↓
Ordinary product reachability removed
        ↓
Surface-specific tests retired
```

------------------------------------------------------------------------

## 17. Removal Authority

Retirement authorization does not automatically authorize physical
deletion.

After retirement:

``` text
Compatibility remains as required
        ↓
Migration reaches Production + Population + Loader closure
        ↓
REMOVAL CANDIDATE
        ↓
Explicit removal authorization
        ↓
Physical implementation removed
        ↓
Compatibility-specific tests retired
```

Removal requires its own evidence and explicit authorization.

------------------------------------------------------------------------

## 18. Retirement Audit Requirements

A retirement audit should identify:

-   candidate surface/workflow;
-   every capability it contains;
-   each capability disposition;
-   applicable parity-gate evidence;
-   remaining compatibility responsibility;
-   supported persisted representations;
-   migration status;
-   tests to retire;
-   tests to retain;
-   Timeless Architectural Invariants to relocate/preserve;
-   historical/provenance implications;
-   documentation changes;
-   mobile/accessibility evidence;
-   final recommendation.

Valid audit conclusions include:

``` text
NOT RETIREABLE
RETIREMENT BLOCKED
RETIREMENT CANDIDATE
RETIRED — COMPATIBILITY REQUIRED
REMOVAL CANDIDATE
```

An audit recommendation is evidence, not retirement authority.

------------------------------------------------------------------------

## 19. Example: Legacy Setup Surface

A legacy setup surface might be classified:

``` text
Work editing
→ REPLACED by Schedule Setup / Work Pattern

Sleep editing
→ REPLACED by Schedule Setup / Sleep

Ordinary Commitment editing
→ REPLACED by Schedule Setup / Commitments

Advanced resource editing
→ COMPATIBILITY-ONLY

Legacy field X
→ DEFERRED — RETIREMENT BLOCKED
```

The surface remains transitional until the blocked valid capability is
resolved.

Later, if every ordinary capability is replaced and only conditional
legacy support remains, the ordinary surface may retire while
compatibility components remain.

------------------------------------------------------------------------

## 20. Example: Legacy Sleep

A mature transition may look like:

``` text
Legacy Sleep authoring
→ RETIRED

First-Class Sleep authoring
→ ACTIVE

Legacy Sleep conversion
→ RETIRED + COMPATIBILITY-REQUIRED
```

New users create only First-Class Sleep.

Users with supported legacy Sleep data retain an explicit conversion
path.

When Production, Population, and Loader closure are eventually proven,
the converter may become a Removal Candidate.

Historical legacy Sleep evidence remains immutable regardless.

------------------------------------------------------------------------

## 21. Repository Cleanup Rules

Retirement is not permission for broad cleanup.

Physical removal tasks must:

-   identify exact retired implementation;
-   prove no supported references remain;
-   preserve historical schemas where still needed;
-   preserve migration/recovery boundaries;
-   relocate Timeless Architectural Invariant tests before deleting
    obsolete tests;
-   update canonical documentation;
-   avoid unrelated normalization.

Unused-looking code is not automatically obsolete code.

------------------------------------------------------------------------

## 22. Relationship to Product Ontology

Product vocabulary may evolve while historical engineering evidence
remains unchanged.

Current Product Ontology governs current/future UI.

Historical artifacts preserve the terminology used when they were
created.

Vocabulary modernization is presentation-only unless a separate
architecture decision changes semantics.

------------------------------------------------------------------------

## 23. Relationship to Immutable History

Retirement operates prospectively.

It may change:

-   what users can create;
-   what users can edit;
-   which surfaces are reachable;
-   which compatibility paths remain;
-   which code remains supported.

It may not retroactively change:

-   what the user authored at the time;
-   what DayFrame generated;
-   what the user accepted;
-   what was scheduled/published;
-   what actually happened;
-   historical provenance;
-   historical policy/authority distinctions.

------------------------------------------------------------------------

## 24. Canonical Decisions V1

This specification establishes:

1.  Compatibility is a responsibility, not a lifecycle state.
2.  Capabilities retire before surfaces.
3.  Every capability receives an explicit retirement disposition.
4.  Surfaces retire only after every capability is accounted for.
5.  Retirement and physical removal are separate.
6.  Retirement is one-way by default.
7.  Retirement requires a formal parity gate.
8.  Valid parity does not require recreating obsolete architectural
    behavior.
9.  Compatibility-only paths leave ordinary workflows.
10. Compatibility-only paths may not create new legacy state.
11. Compatibility should be exit-oriented where safe migration exists.
12. Users and data are not abandoned merely because code is old.
13. Migration completion requires Production, Population, and Loader
    closure.
14. Surface tests retire with retired surfaces.
15. Data fidelity/integrity/compatibility tests remain while
    compatibility remains supported.
16. Timeless Architectural Invariants survive in canonical test layers.
17. Historical data is never deleted merely because its originating
    surface retires.
18. Historical terminology may modernize only when translation is
    semantically lossless.
19. Canonical architecture describes current truth.
20. ADRs, Task RESULTs, dogfood evidence, and other engineering history
    remain historically truthful.
21. User documentation follows current canonical workflows with
    conditional compatibility guidance.
22. Retirement requires explicit Architecture/Task authority.
23. Removal requires separate evidence and explicit authorization.
24. Tooling may recommend retirement/removal but may not silently change
    the supported product contract.
25. The past remains immutable.

------------------------------------------------------------------------

## 25. Final Governing Statement

DayFrame retirement is a controlled reduction of **future product
authority**, not a rewriting of history.

A mature DayFrame codebase should become simpler over time without
becoming forgetful.

Old surfaces should disappear when canonical replacements are proven.
Old compatibility code should disappear when supported data can no
longer require it. Old tests should disappear when the behavior they
protect is no longer supported.

But the architectural lessons those tests revealed, the historical
evidence users created, and the engineering record explaining how
DayFrame evolved must survive for as long as their truth remains
relevant.

> **Converge first. Retire later. Remove only when proven safe. Preserve
> the past.**
