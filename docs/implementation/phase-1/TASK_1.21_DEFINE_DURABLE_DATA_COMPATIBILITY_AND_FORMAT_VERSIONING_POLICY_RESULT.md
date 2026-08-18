# Task 1.21 — Define Durable-Data Compatibility and Format-Versioning Policy — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.21  
**Status:** Complete  
**Execution type:** Investigation / architectural policy analysis only

---

# 1. Executive Determination

DayFrame should adopt a **surface-specific, versioned, non-destructive durable-data
compatibility policy**:

1. **Active local state** receives bounded backward-reading support plus an eager,
   atomic, durable, observable migration path. Its old reader may retire only after
   the affected population is demonstrably migrated or a reviewed recovery path
   covers installations outside the migration window.
2. **Saved profiles** are reusable user-authored data, not disposable cache. They
   receive stronger protection than active operational state: atomic collection
   migration, preservation on failure, and explicit recovery. Their support may be
   bounded, but not merely by release age.
3. **Backup files** are user-controlled recovery artifacts. DayFrame should provide
   long-lived, versioned backward import compatibility. Direct import for an old
   version may retire only after a maintained conversion/recovery path exists and
   an announced support policy is satisfied. Existing V1 remains directly
   supported because no such boundary or converter exists.

A durable format version should identify a defined **compatibility contract**, not
necessarily one byte-for-byte schema. Compatible optional extensions may remain
within a version only when their semantics are unchanged and readers safely ignore
them. Any representation or semantic change that requires migration, causes a
supported reader to misinterpret data, or makes old data invalid requires a new
format version or explicit migration epoch.

This is a **recommended policy for project review**, not an existing guarantee and
not authorization to alter formats, migrations, validators, or readers.

---

# 2. Investigation Scope and Evidence

The investigation covered:

- local serialization, rehydration, defaults, and persistence-failure handling;
- `createInitialDayFrameState` and singular/plural precedence;
- profile creation, validation, cloning, load/save/delete, and persistence;
- backup creation, parsing, validation, import/export, UI errors, and file lifetime;
- compatibility tests created through Tasks 1.6–1.20;
- repository history for the singular-to-plural transition;
- Task 1.20's compatibility-horizon findings;
- the architecture specification, charter, alignment strategy, execution plan,
  current state, changelog, and related Phase 1 artifacts.

Evidence labels used below:

- **Confirmed:** directly established by executable behavior, tests, history, or
  current documentation.
- **Inferred:** a strong operational implication not measured or guaranteed by the
  project.
- **Recommended:** policy proposed by this task for later approval.
- **Unresolved:** evidence does not safely select one binding policy detail.

The immutable Task 1.21 artifact was complete at 1,001 lines. Its SHA-256 is
`776b1daccf2e79a3daadb261b7210058dd2d1f64ee023b019b087d33b2da72c3`,
identical to the supplied attachment.

---

# 3. Durable-Data Surface Inventory

| Surface | Creation and location | Primary role | DayFrame control | External copies |
| --- | --- | --- | --- | --- |
| Active local state | Store writers serialize authored state to browser local storage under `dayframe-store-v1`. | Current operational authored setup | DayFrame can read/rewrite the current browser instance when the application runs; it cannot centrally enumerate installations. | Not an application feature, though users or browser tooling can copy it. |
| Saved profiles | Profile operations serialize a V1 envelope to browser local storage under `dayframe-profiles-v1`. | Named, reusable user-authored setup | DayFrame controls the in-app collection and can rewrite it, but only on the current browser/device and currently only on save/delete. | No supported portable profile-file surface exists. |
| Backup files | Export creates a V1 JSON object and the UI downloads a file. | Portable recovery and transfer artifact | DayFrame controls creation and import, not storage, copying, lifetime, or enumeration after download. | Yes; this is the intended mechanism. |

**Confirmed:** the three surfaces share authored setup structures but have different
lifecycle control. **Recommended:** compatibility strength must follow user role
and control, rather than being coupled merely because structures overlap.

---

# 4. Existing Compatibility Behavior

## Active local state

- **Confirmed — current data:** JSON at `dayframe-store-v1` is parsed without an
  envelope validator and normalized into current runtime state.
- **Confirmed — historical data:** if `shiftCycles` is an array it wins; otherwise
  a truthy singular `shiftCycle` is wrapped and normalized. Current writers emit
  only `shiftCycles`.
- **Confirmed — malformed data:** JSON parse/storage access failures are caught and
  treated as no persisted state. Missing fields receive defaults. There is no
  user-visible distinction between absent, malformed, and unreadable storage.
- **Confirmed — mixed data:** an array-valued `shiftCycles`, including `[]`, has
  precedence over singular `shiftCycle`.
- **Confirmed — unknown/future shape:** there is no local envelope version check.
  The normalizer consumes known fields and does not preserve unknown fields when a
  later persistence write occurs.

## Saved profiles

- **Confirmed — current/historical data:** the reader requires the DayFrame V1
  envelope, filters structurally eligible profile records, and normalizes plural
  first with singular fallback. Current writers emit plural-only V1 data.
- **Confirmed — malformed data:** invalid envelope/app/version/collection returns
  `undefined`; store load then exposes an empty profile collection. Invalid profile
  entries are filtered out rather than causing collection rejection.
- **Confirmed — mixed data:** array-valued plural data wins, including an empty
  array.
- **Confirmed — unsupported version:** any envelope version other than `1` is
  treated like invalid profile storage and becomes an empty collection at the store
  boundary; no user-visible classification or recovery path exists.
- **Confirmed — unknown fields:** validation/cloning constructs known current data,
  so unknown fields are not preserved through a later collection rewrite.

## Backup files

- **Confirmed — current/historical data:** parser requires valid JSON; validation
  requires the DayFrame app marker, version `1`, timestamp, authored object, and
  selected required fields. Plural cycles win; record-valued singular cycles are a
  fallback. Current exports are plural-only V1.
- **Confirmed — invalid data:** validation throws categorized `RangeError`
  messages. The UI catches and displays the message; store state is not replaced
  before validation succeeds.
- **Confirmed — unsupported version:** any version other than `1` is explicitly
  rejected as unsupported.
- **Confirmed — unknown fields:** validation returns a newly cloned known V1 shape;
  unknown fields are not preserved in the imported state or a subsequent export.

Current behavior is not itself the recommended policy. In particular, silently
defaulting local data or dropping profiles may be convenient startup behavior but
does not meet the recovery policy recommended below.

---

# 5. Existing Version Semantics

| Identifier | Executable meaning today | Contract quality |
| --- | --- | --- |
| `dayframe-store-v1` | A historical storage key used across singular-only, singular-mirror, and plural-only cycle writers; no payload version is checked. | Historical identifier, not an exact schema or reliable migration epoch. |
| `dayframe-profiles-v1` | Storage location for an envelope that must also say version `1`; both singular and plural profile representations are accepted. | Broad container generation, not one exact schema generation. |
| Profile envelope `version: 1` | Only accepted envelope version; contains multiple cycle representation generations. | Reader compatibility family, accidentally broader than its name implies. |
| Backup envelope `version: 1` | Only accepted backup version; both historical singular and current plural authored setups are accepted. | Reader compatibility family, not an exact schema generation. |

**Confirmed:** commit `7e8ea7b` produced singular local/profile/backup data; commit
`37db89c` introduced plural cycles without changing these identifiers. Package
version `0.1.0` is neither stored nor mapped to them.

No current documentation defines these identifiers as exact schemas, release
versions, support windows, or migration epochs. Their `v1` spelling overstates the
precision of the executable contract.

---

# 6. Ownership and Lifecycle-Control Analysis

## Active local state

DayFrame creates and operates on the data, but controls only the instance visible
to the running browser. It cannot enumerate dormant devices or prove that a release
has touched them. This supports a managed, bounded migration responsibility, not an
indefinite promise and not retirement by elapsed time alone.

## Saved profiles

Profiles are explicitly named and saved for later reuse. Although stored internally,
their user role is durable authored configuration. They are an **intermediate
category**: application-controlled like local state, but user-intent-bearing like a
recovery asset. They warrant stronger atomicity, visibility, and recovery guarantees
than ordinary active state.

## Backups

Export explicitly creates a downloadable recovery artifact. DayFrame cannot
enumerate, rewrite, revoke, or know the age of copies. This creates the strongest
compatibility responsibility and makes population-wide migration proof impossible.
That supports a long-lived import/conversion commitment.

---

# 7. Migration and Convergence Analysis

**Confirmed current behavior:**

- local singular data normalizes in memory and becomes plural on the next authored
  persistence operation; startup alone does not rewrite it;
- profile singular data normalizes in memory and the full collection becomes plural
  only on save/delete; loading a profile rewrites active state, not profile storage;
- backup singular data normalizes on parse/import; active state becomes plural, but
  the source file never changes;
- persistence failures for local state and profiles are swallowed, so runtime state
  may advance without durable convergence and without an observable failure.

**Recommended migration policy:**

- A migration is not complete when normalization exists only in memory.
- In-place migration must be atomic: preserve the original until the replacement is
  successfully validated and durably written.
- It must be idempotent, retryable, and observable through a durable version/marker
  or equivalent evidence.
- A failed write must not be reported or counted as migration completion.
- Local state should prefer eager migration at startup when safe, with write-time
  convergence only as a supplementary mechanism.
- Profiles should migrate the collection atomically and preserve rejected entries
  for recovery rather than silently filtering away user-authored data.
- Backups should use read-time conversion into current normalized data; the source
  file remains untouched. Conversion should be explicit when direct import support
  is no longer maintained.

Evidence that code works (fixtures, unit/integration tests, failure-injection tests)
is distinct from evidence that the population migrated (durable markers, successful
rewrite records, supported-release circulation, or explicit per-artifact
conversion). Both are required where population migration is used to justify
retirement.

---

# 8. Compatibility Direction Analysis

DayFrame has four distinct directions:

- **Backward reading:** current DayFrame reads an older supported format. This is
  the primary durable-data promise.
- **Unsupported historical reading:** current DayFrame encounters authentic but
  retired data. It should preserve and reject or route to recovery/conversion.
- **Forward reading:** current DayFrame encounters a future version. It must reject
  it rather than guess, unless that format explicitly declares a compatible reader
  range and the current reader implements it.
- **Old-reader compatibility:** historical DayFrame reads newly written data.
  DayFrame should not generally promise this. A new writer may produce data an old
  reader cannot understand.

Unknown-field preservation is not currently implemented, so forward compatibility
cannot be claimed. Permissive parsing is not a substitute: a later write can erase
unknown data.

---

# 9. Unsupported-Format and Recovery Analysis

**Recommended principles:**

1. Never silently degrade authentic durable data into an incomplete but apparently
   valid current state. In particular, loss of a historical shift cycle must not
   become `shiftCycles: []` without an explicit user decision.
2. Classify failures as malformed, unsupported version, migration/conversion
   failure, or storage failure where the surface permits useful action.
3. Preserve the original bytes/payload untouched until a replacement has been
   validated and durably committed.
4. Provide actionable guidance: retry, use a supported release, invoke a converter,
   restore the preserved original, or export recoverable data.
5. Do not partially overwrite a collection or active state on parse, validation, or
   migration failure.
6. In-place changes require rollback or copy-before-replace semantics.

Explicit, non-destructive rejection is preferable to lossy fallback. Read-only
recovery is desirable when safe interpretation is possible; it must not be used
when semantics are uncertain. Whether DayFrame must always expose a raw-download
recovery control is **Unresolved** and belongs in the policy ADR/product review.

---

# 10. Backup Compatibility Analysis

| Alternative | Benefits | Costs/Risks | Assessment |
| --- | --- | --- | --- |
| A — Indefinite direct import compatibility | Strongest user expectation and lowest abandonment risk | Unbounded reader/test burden; can constrain future architecture; some formats may become unsafe or impractical to execute directly | Desirable when technically cheap, but too absolute as a universal promise. |
| B — Long-lived versioned compatibility | Explicit support contract; permits architecture evolution; converter can preserve recovery after direct-reader retirement | Requires version discipline, communication, and maintained conversion paths | **Recommended.** Best balance of recovery responsibility and evolvability. |
| C — Current-version-only | Minimal reader burden | Contradicts recovery expectations, strands external artifacts, and makes missed upgrades destructive | Not recommended for DayFrame-exported backups. |

**Recommended backup promise:** support direct import of released backup versions
for a deliberately long, documented period and whenever technically feasible.
Before direct import retires, ship and retain a non-destructive conversion path (in
the application, a maintained utility, or a documented supported release). Do not
promise that every historical format will execute directly forever; promise that
DayFrame-produced recovery data will not be abandoned without an announced and
usable recovery route.

For existing V1, **direct import remains required for now**. No later version,
support announcement, conversion path, or retirement evidence exists.

---

# 11. Profile Compatibility Analysis

Saved profiles should not be governed as disposable local cache or as fully
portable backup files. They are an intermediate category:

- named and deliberately saved, so loss violates explicit user intent;
- reusable and potentially dormant for long periods;
- application-controlled and enumerable within each active storage instance;
- not independently portable or externally unbounded through a supported feature.

**Recommended:** profiles receive backward reading and durable migration across
supported versions, collection-level atomicity, preservation of unconvertible
entries, and visible recovery. Support may retire after proven migration and a
documented window; a mere release age or absence of recent profile use is
insufficient.

---

# 12. Compatibility-Retirement Analysis

A reader for data DayFrame demonstrably produced may be removed only when all
applicable conditions are satisfied:

1. an adopted policy identifies the surface, supported versions, responsible owner,
   and retirement authority;
2. a new discriminator separates the historical format from current output;
3. the replacement migration/conversion is tested, deterministic, non-destructive,
   and handles persistence failure;
4. supported releases have circulated for the adopted window with appropriate user
   notice;
5. evidence addresses population migration, not only migration-code correctness;
6. unsupported data receives explicit recovery/rejection rather than lossy fallback;
7. compatibility fixtures are retained or intentionally converted to retirement
   behavior tests;
8. the decision and remaining uncertainty are reviewed and recorded.

Additional evidence by surface:

- **Local state:** durable migration/version markers plus proof that supported
  installations migrate, or an accepted recovery path for skipped releases.
- **Profiles:** per-collection successful migration evidence, preservation of all
  entries, and no false success on failed persistence.
- **Backups:** a documented end-of-direct-import policy and a maintained converter
  or recovery release. Reader non-use cannot be globally proven and is not required
  if the conversion commitment remains available.

Release age alone never suffices for internal state, profiles, or backups. Different
surfaces may and should have different horizons.

---

# 13. Recommended Durable-Data Compatibility Policy

For project review, adopt the following policy:

> DayFrame treats authored durable data it writes or exports as user data. Current
> releases read every explicitly supported historical format through narrow ingress
> adapters and normalize it to one current representation. Internal formats use
> bounded, observable, non-destructive migration; portable backups receive
> long-lived versioned import or conversion support. Unsupported or ambiguous data
> is preserved and rejected with recovery guidance, never silently degraded.
> Compatibility retires only through a reviewed version boundary and evidence
> appropriate to the surface.

Responsibilities:

- keep historical representations out of runtime/domain APIs;
- publish which durable surface versions are readable, writable, convertible, or
  unsupported;
- write only the current format;
- retain deterministic compatibility fixtures for each supported historical
  generation;
- make migrations atomic, durable, idempotent, retryable, and observable;
- preserve original input and recovery options on failure;
- distinguish format support from application release versions;
- review retirement independently for each surface.

This policy aligns with the project's principles: architecture defines the contract
before implementation; one normalized state preserves deterministic ownership;
version/migration boundaries resolve root causes; recovery preserves user context;
narrow ingress adapters keep local simplicity globally coherent; explicit versions
favor determinism; and honest error classification preserves epistemic integrity.

---

# 14. Recommended Format-Versioning Policy

A durable format version is a named compatibility contract comprising:

- the accepted structural and semantic model;
- required and optional fields;
- unknown-field behavior;
- validation and normalization expectations;
- the reader/writer relationship;
- migrations/converters from supported earlier versions;
- unsupported-version behavior.

It need not identify one exact serialized byte layout. Multiple compatible schema
revisions may share a version only if every reader promised for that version can
safely interpret them and no meaningful data is silently lost through normal
round-trips.

Introduce a new version **before** writing a change that:

- renames/removes a field without an old-reader-compatible bridge;
- changes a field representation or meaning incompatibly;
- adds a required field without a deterministic old-data default;
- tightens validation so previously valid released data becomes invalid;
- requires a migration to preserve meaning;
- breaks a supported old reader or makes current readers unsafe.

Local persistence, profile storage, and backups should be **independently
versioned**. They have different ownership, lifetimes, and retirement rules.
Synchronized version numbers would falsely imply coordinated compatibility and
force unrelated rollovers. Shared authored substructures may use a separately
defined component/schema generation if reuse later warrants it, but that does not
couple container versions.

Version numbers must not be inferred from package releases. A release may support
multiple read versions while writing one current version.

---

# 15. Required Policy Matrix

| Durable Surface | User Role | DayFrame Lifecycle Control | Recommended Compatibility Strength | Preferred Migration Strategy | Retirement Evidence Required | Unsupported-Format Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| Active local state | Current operational authored setup | Partial: current browser instance only; no central enumeration | Bounded backward-read support across a documented migration window | Eager, atomic, idempotent in-place migration with durable version/marker; write-time convergence as backup | Working migration tests **and** durable population evidence/circulation window; recovery for skipped versions | Preserve original; do not overwrite; explicit recover/reset/export guidance rather than silent defaults |
| Saved profiles | Named reusable user-authored configuration | Intermediate: collection is app-controlled per instance, but user-created and potentially dormant | Strong bounded support, greater than ordinary operational state | Atomic collection migration; retain unconvertible entries; observable retryable persistence | Per-collection completion evidence, failure safety, documented window, recovery path | Preserve collection/entries; classify failure; permit recovery/conversion; never silently drop profiles |
| Backup files | Portable user-held recovery/transfer artifact | Low after export: cannot enumerate or rewrite copies | Long-lived versioned direct import plus conversion continuity | Read-time conversion into current state; never mutate source; standalone conversion after direct import retirement | Announced support boundary, newer format, maintained converter/recovery release, tests; global population proof is impossible | Explicit non-destructive rejection with version-specific conversion/recovery guidance |

---

# 16. Required Versioning Matrix

| Change Type | Same Version Potentially Valid? | New Version Recommended/Required? | Migration Implication | Reasoning |
| --- | --- | --- | --- | --- |
| Add optional field | Yes, conditionally | Recommended only if old readers cannot safely ignore it or round-trip loss is unacceptable | Default/absence normalization may suffice | Compatible extension when semantics and promised readers remain safe. |
| Add required field | Rarely, if a deterministic semantic default exists for all old data and old readers remain safe | Otherwise required | Populate default or migrate before current use | “Required” without a safe historical meaning changes the contract. |
| Rename field | Only with a temporary dual-read/compatible-write bridge inside the declared contract | Required when old name ceases to be accepted or old readers cannot read output | Explicit migration/converter | A rename is a representation break, as `shiftCycle` → `shiftCycles` demonstrates. |
| Change field representation | Only when reader contract explicitly accepts both without ambiguity | Generally required | Normalize/migrate old representation before runtime | Shape changes can preserve meaning only through an explicit boundary. |
| Remove accepted historical field | No when released data depends on it | Required before support is withdrawn | Migration/conversion and retirement evidence | Removal changes backward-read compatibility. |
| Change field semantics | No if the same bytes acquire materially different meaning | Required | Semantic migration, possibly requiring user resolution | Shape compatibility cannot prevent semantic corruption. |
| Tighten validation | Yes only if rejected inputs were never valid under the published contract | Required when previously supported data becomes invalid | Repair/conversion or explicit unsupported path | Valid historical data cannot be reclassified accidentally. |
| Break old-reader compatibility | No under a promised bidirectional contract; DayFrame does not generally promise that direction | Required for the writer/container whose output breaks it | New writers use new version; old release behavior documented | Prevents new data from masquerading as an old compatible format. |

---

# 17. Required Compatibility Direction Matrix

| Direction | Recommended Promise | Notes |
| --- | --- | --- |
| Current DayFrame reads historical supported data | **Promise** | Read through explicit adapters/migrations and normalize to current state without silent loss. |
| Current DayFrame reads unsupported historical data | **Do not interpret silently; preserve and recover** | Reject explicitly or route through a maintained converter/read-only recovery path. |
| Current DayFrame reads future-version data | **No general promise** | Reject explicitly unless the future format declares and implements a safe compatible-reader range. Never guess from permissive shape checks. |
| Historical DayFrame reads current data | **No general promise** | New writers may require new versions. Preserve this direction only when explicitly declared for a particular compatible extension. |

---

# 18. Policy Consequences for Existing V1 Data

- Existing singular-only and plural local data under `dayframe-store-v1` remains
  supported. The key cannot prove migration and must not be used as retirement
  evidence.
- Existing singular and plural profile V1 data remains supported. Version `1`
  covers both in current executable reality.
- Existing singular and plural backup V1 files remain directly importable. There is
  no V2, converter, support notice, or accepted retirement decision.
- Current plural precedence remains unchanged. No new interpretation is authorized.
- The `v1` identifiers should be documented in a future ADR as legacy broad
  compatibility families, not retroactively redefined as exact schemas.

No existing reader is safe to retire under the recommended policy today.

---

# 19. Potential Future Implementation Consequences

If the recommendation is adopted, separately authorized work would likely need:

- independent envelopes/format identifiers for active state, profiles, and backups;
- an explicit supported-version registry or documentation;
- eager atomic local/profile migrations with durable completion evidence;
- surfaced persistence failures and recovery-safe write protocols;
- stricter distinction among malformed, unsupported, and migration-failed data;
- preservation/quarantine of invalid profile entries rather than silent filtering;
- fixture coverage for every supported writer generation and failure paths;
- a backup conversion strategy before any direct V1 retirement;
- user-facing unsupported-format and recovery guidance.

These are consequences, not an implementation plan or authorization. Exact
mechanisms and sequencing remain for later tasks.

---

# 20. Unresolved Questions

The following require project/product governance rather than executable inference:

- the numeric/calendar duration of internal and backup support windows;
- whether backup conversion must be embedded forever, maintained as a standalone
  utility, or provided through designated recovery releases;
- whether every unsupported local/profile payload must offer raw-download recovery;
- whether development artifacts before a defined public release receive the same
  promise as released user data;
- whether privacy-appropriate, opt-in telemetry will ever be used as supplementary
  migration evidence;
- the named owner and approval authority for format retirement;
- whether any future format needs unknown-field round-trip preservation.

Bounded alternatives for backup conversion are: in-app legacy importer, standalone
offline converter, or documented recovery release. The policy requires at least one
maintained route before direct import retirement but does not choose its delivery
mechanism.

To classify historical data as disposable development-only data, DayFrame would
need evidence that the producing builds were never distributed or used with real
user data, plus an adopted policy explicitly excluding those builds. Repository
history and product maturity alone do not provide that evidence.

---

# 21. Deviations

None.

---

# 22. Discoveries and Deferred Work

- Current local persistence has no payload-level version discriminator.
- Profile and backup V1 are compatibility families containing multiple cycle
  representation generations.
- Current unknown-field handling cannot support forward-compatible round trips.
- Profile validation can silently omit malformed entries; local/profile load can
  silently fall back to empty/default state.
- Persistence failures are swallowed, so current code cannot prove durable
  migration completion.
- Policy adoption, an ADR, format changes, recovery UX, migration mechanisms,
  observability, converters, and reader retirement are all deferred.
- Manual-event ownership, feedback, focus/continuity, date conversion,
  persistence-failure ownership beyond policy requirements, and seeded-store
  purpose remain outside this task.

---

# 23. Recommended Next Task

Create a separately authorized architectural decision task:

> **Adopt the DayFrame Durable-Data Compatibility and Independent Format-Versioning
> Decision.**

That task should review and formalize this recommendation, select the unresolved
governance choices (especially support-window authority and backup conversion
delivery), define policy ownership, and record the decision in the project's
architectural decision system. It should still make no executable format or reader
change unless separately authorized.

Only after adoption should implementation tasks define new version envelopes,
migration/recovery mechanics, or observability.

---

# 24. Validation Performed

The immutable artifact was hash-verified as recorded in Section 2. Relevant
compatibility tests and the repository standard sequence were run after producing
this result; exact results appear below.

## Targeted compatibility baseline

```text
npm test -- src/state/tests/dayFrameStore.test.ts \
  src/state/dayFrameProfiles.test.ts \
  src/state/dayFrameBackup.test.ts

Test Files  3 passed (3)
Tests      34 passed (34)
```

## Repository standard sequence

```text
npm run lint       passed
npm run typecheck  passed
npm test           22 files passed; 244 tests passed
npm run build      passed; 42 modules transformed
```

No production or test file was modified by Task 1.21.

---

# 25. Final Completion Determination

Task 1.21 is complete from an investigation and policy-recommendation standpoint.
It classifies all durable surfaces, distinguishes current evidence from proposed
governance, defines compatibility directions, migration and recovery duties,
version semantics, surface-specific retirement evidence, and the consequences for
existing V1 data.

The recommendation is ready for project review and a separately authorized
architectural decision. It does not itself establish a binding guarantee, change a
format, or authorize removal of any compatibility reader.
