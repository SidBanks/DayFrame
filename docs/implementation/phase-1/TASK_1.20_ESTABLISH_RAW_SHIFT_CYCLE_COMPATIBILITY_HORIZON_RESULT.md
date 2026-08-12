# Task 1.20 — Establish Raw `shiftCycle` Compatibility Horizon and Retirement Criteria — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.20  
**Status:** Complete  
**Execution type:** Investigation only

---

# Implementation Completed

The remaining raw singular `shiftCycle` compatibility readers were inventoried and
their producer history, format semantics, convergence behavior, user exposure,
retirement risk, and detectability were traced.

The central determination is:

> **No defensible time- or release-based retirement horizon exists in current
> project evidence. The three readers must remain supported for now.**

Local authored storage and saved-profile storage have mechanisms that can converge
individual legacy payloads to plural-only output, but the repository cannot prove
that all user-held payloads have circulated through those mechanisms. Backup files
have no automatic convergence path at all. Explicit retirement criteria are
identified below; they are candidates for later governance, not policy created by
this task.

No production code, tests, schemas, versions, readers, writers, or runtime state
changed.

---

# Files Changed

- Added
  `docs/implementation/phase-1/TASK_1.20_ESTABLISH_RAW_SHIFT_CYCLE_COMPATIBILITY_HORIZON_RESULT.md`.
- Preserved the immutable Task 1.20 execution artifact unchanged. Its SHA-256
  remains `2f0a850cfdb4d3110b21b44a02b85c567fbd440661c7382322684551f0df048b`,
  matching the supplied attachment.
- Did not update `CURRENT_STATE.md`, `CHANGELOG.md`, or a checkpoint, as required
  before project review or separate checkpoint authorization.

---

# Compatibility Horizon Table

| Raw reader | Durable source | Current convergence | Version can distinguish legacy data? | Defensible horizon | Classification |
| --- | --- | --- | --- | --- | --- |
| Local authored-state reader | Browser local storage at `dayframe-store-v1` | Read normalizes in memory; the next authored-state persistence writes plural-only data. Merely starting the store does not rewrite it. | No envelope exists, and the unchanged key contains both singular and plural generations. | None established | **Retain Until Explicit Criteria Are Met** |
| Saved-profile reader | Browser local storage at `dayframe-profiles-v1`, envelope version `1` | Validation normalizes profiles in memory. A later save or delete rewrites the whole normalized collection; startup and profile load do not rewrite profile storage. | No. Singular and plural profile data are both valid within version `1`. | None established | **Retain Until Explicit Criteria Are Met** |
| V1 backup reader | User-held JSON file, envelope version `1` | Parse/import normalizes in memory and import persists active local state plural-only. The source file is never rewritten. | No. Singular and plural backup data are both version `1`. | None established; external file lifetime is unbounded by repository evidence | **Retain Indefinitely for Now** |

“Indefinitely for now” is not a claim that the backup reader can never be retired.
It records that current evidence supplies neither a natural expiration mechanism
nor an accepted support cutoff.

---

# Remaining Reader Inventory

## 1. Local authored state

`createInitialDayFrameState` accepts a partial raw persisted shape. Its private
normalizer prefers an array-valued `shiftCycles`; only when that is absent does it
wrap a truthy singular `shiftCycle` into an array and normalize it. This is the raw
compatibility boundary for `dayframe-store-v1`.

`loadPersistedState` only parses JSON and returns it. Store construction then calls
`createInitialDayFrameState`, so plural runtime authority is established before the
state is exposed. `persistState` now emits `shiftCycles` only.

## 2. Saved profiles

`validateDayFrameProfilesStorage` accepts the V1 envelope and maps each eligible
profile through its raw authored-setup normalizer. That normalizer prefers array
`shiftCycles`, otherwise wraps a truthy raw singular `shiftCycle`, otherwise uses an
empty array. The returned and runtime profile data is plural-only.

`createDayFrameSavedProfile`, `createDayFrameProfilesStorage`, and their clone path
operate on the plural-only `DayFrameAuthoredSetup` type and therefore emit no
singular property.

## 3. V1 backups

`validateDayFrameBackup` accepts only `{ app: "DayFrame", version: 1 }`, validates
the raw authored payload, and delegates cycle selection to
`normalizeAuthoredShiftCycles`. That function prefers array `shiftCycles`, otherwise
wraps a non-null record-valued `shiftCycle`, otherwise uses an empty array.

`createDayFrameBackup` and `cloneDayFrameAuthoredSetup` emit the current plural-only
authored setup. No singular reader remains outside these three raw durable-data
boundaries; repository-wide inspection found current scheduling, runtime state,
store APIs, and typed authored setup using `shiftCycles`.

---

# Historical Producer Evidence

Git history provides direct producer evidence:

- Commit `7e8ea7b` (`Complete unified setup workflow`, 2026-05-27) used
  `dayframe-store-v1` and `dayframe-profiles-v1`, wrote local authored state with
  singular `shiftCycle`, cloned profile data with singular `shiftCycle`, and
  created/validated backup envelope version `1` with singular `shiftCycle`.
- Commit `37db89c` (`Add multiple manual cycle support`, 2026-06-11) introduced
  plural `shiftCycles` while retaining the same local-storage keys and the same V1
  profile and backup envelopes. At that point local persistence also wrote a
  derived singular mirror.
- Tasks 1.6 and 1.8 subsequently stopped new singular local-state output and
  singular/null profile and backup output without changing those identifiers.
- Current writers are plural-only, while current tests preserve literal
  singular-only local, profile, and V1 backup samples as supported historical
  inputs.

Therefore all three raw readers serve formats that this repository demonstrably
produced. The legacy data is not merely hypothetical test accommodation.

The commit dates establish when repository formats existed, but do not establish
deployment dates, affected-user counts, a minimum upgraded-client population, or
an expiration date. They cannot by themselves justify retirement.

---

# Migration-Convergence Analysis

## Local authored state

Startup is a lazy, in-memory migration. It does not call `persistState`. Any later
store transition that persists authored state rewrites the same key with
`shiftCycles` and without `shiftCycle`; the compatibility test demonstrates this
using a scheduling-preference mutation. Consequently active installations can
converge, but an installation that is merely opened, remains inactive, or has not
run the newer code can retain the singular payload indefinitely.

## Saved profiles

Store startup validates and clones the profile collection into plural runtime
objects but does not call `persistProfiles`. Loading a profile persists the loaded
setup to the active authored-state key, not back to the profile collection. Saving
a new profile or deleting a profile calls `persistProfiles` for the whole current
collection and thus rewrites all successfully loaded profiles in plural form.

This is partial convergence tied to specific user actions. A legacy profile can be
loaded and used while its original raw profile-storage representation remains
singular. There is no evidence that every user will perform a collection-rewriting
action.

## Backups

Parsing and importing a singular-only V1 backup yields plural runtime data, and
import writes plural active local state. It does not modify the external file. A
new export would be plural-only, but creating one is optional and does not revoke
or replace the old file. Backup compatibility therefore does not naturally
converge.

---

# Version-Semantics Analysis

The identifiers do not encode the singular-to-plural transition:

- `dayframe-store-v1` has no payload envelope or schema discriminator. The key was
  retained across singular-only, mirrored, and plural-only writers.
- `dayframe-profiles-v1` contains `{ app: "DayFrame", version: 1 }`; both historical
  singular profile data and current plural profile data use version `1`.
- `DayFrameBackupV1` also uses `{ app: "DayFrame", version: 1 }`; repository history
  shows both singular and plural data under that same version.
- Package version `0.1.0` is not persisted with these payloads and has no executable
  mapping to their schemas.

The V1 markers identify broad container formats, not a release, writer generation,
or compatibility deadline. A version-gated retirement is therefore impossible
without first creating a new, explicit format boundary and migration/support
policy in separately authorized work.

---

# Current User-Exposure Analysis

Direct evidence establishes that users could have received all three singular
forms from earlier repository writers. Current plural-only writers prevent the
population from growing through normal new saves and exports.

The remaining population is unknown:

- there is no usage telemetry, migration counter, persisted migration marker, or
  inventory of browser storage in the repository;
- local storage and profile storage are user/device scoped and are not centrally
  enumerable by this application;
- backup files can be copied, archived, or restored outside application control.

It is reasonable to infer that browser data may persist until users clear it and
that user-held backup files may persist indefinitely. Those are operational
inferences, not measured DayFrame retention facts. No evidence establishes that
the affected population is zero.

---

# Retirement-Risk Analysis

| Reader removed | Likely behavior for a singular-only payload | User risk | Visibility |
| --- | --- | --- | --- |
| Local authored state | With the fallback removed, absent `shiftCycles` would normalize to `[]` under the current surrounding logic. | A valid historical schedule cycle can disappear from runtime state; Preview generation then cannot proceed without cycles. | High risk and potentially silent at hydration time. |
| Saved profile | The V1 envelope/profile can still validate, but its data would normalize without the historical cycle under the current surrounding logic. | Loading a named historical profile can replace active setup with no cycle. | High risk; failure may look like valid empty scheduling data rather than rejected legacy data. |
| V1 backup | The validator currently permits the singular V1 shape and normalization supplies the cycle. Removing only the reader can turn it into empty-cycle data unless validation is separately tightened. | Import of a repository-produced backup can lose its scheduling cycle. | High risk; may be silent unless a future validator explicitly rejects the format. |

The exact post-removal outcome would depend on the separately authorized removal
design. The table evaluates deletion of the compatibility branch while preserving
the current surrounding logic, not a proposed implementation. Silent degradation
is more dangerous than an explicit unsupported-format error, but either outcome
would withdraw compatibility from data this project produced.

---

# Retirement-Detectability Analysis

Current detection is diagnostic, not operational:

- a developer or user with storage access can inspect `dayframe-store-v1` for a
  singular property and absence of array-valued `shiftCycles`;
- the same inspection can scan each profile under `dayframe-profiles-v1`;
- an individual JSON backup can be inspected or processed for the same shape.

DayFrame has no in-product warning, migration marker, reader-use counter,
telemetry, cohort measurement, or fleet-wide enumeration. Successful
normalization also erases source-shape knowledge from runtime objects. For backup
files not currently imported, the application has no observation point at all.

Accordingly the project cannot demonstrate reader non-use, determine the remaining
population, or prove convergence from current executable evidence. Manual
inspection can confirm presence in a particular artifact but cannot confirm global
absence.

---

# Existing-Policy Findings

The governance and architecture documentation searched includes the project
README, architecture `CURRENT_STATE.md`, architecture `CHANGELOG.md`, archived
product README, relevant Phase 1 task/result artifacts, and repository history.

Findings:

- existing task artifacts intentionally preserve legacy readers and repeatedly
  defer retirement to an explicit compatibility-horizon decision;
- the changelog records compatibility preservation, but no expiry rule;
- no ADR, durable-data compatibility policy, release-count window, calendar
  support period, V1 end-of-support declaration, migration-completion standard, or
  backup-retention policy was found;
- no documentation maps storage/backup format versions to application releases.

This absence is a governance gap, not permission to invent a cutoff. The project
has an implementation discipline for pausing when governance is insufficient, but
no substantive durable-data retirement policy.

---

# Candidate Retirement Criteria

These criteria are evidence-based prerequisites for future consideration. This
task does not adopt them as policy.

## Criteria common to all readers

1. Adopt an ADR or equivalent policy defining supported durable-data versions,
   notice expectations, data-loss tolerance, and who authorizes retirement.
2. Introduce a format discriminator that separates plural-only output from legacy
   singular V1 data, rather than inferring schema generation from the current V1
   label or storage-key suffix.
3. Choose explicit behavior for unsupported legacy data: migration, user-visible
   rejection with recovery guidance, or a conversion utility. Silent conversion to
   empty `shiftCycles` must not be accepted.
4. Preserve fixture-based tests until the chosen policy and cutoff are actually
   satisfied; then replace compatibility assertions with intentional
   unsupported-format or migration assertions.
5. Establish a reviewable evidence source for remaining exposure and record the
   decision that its uncertainty is acceptable.

## Additional local-state criteria

6. Provide an eager, durable migration or a migration marker so merely starting a
   supported release converges the raw payload.
7. Define and complete a supported-release circulation window after that migration
   ships, with evidence sufficient under the adopted policy.
8. Provide recovery or warning behavior for installations that skipped that
   window.

## Additional profile criteria

9. Eagerly rewrite normalized profile storage, or track migration independently of
   optional save/delete actions.
10. Ensure every accepted profile is migrated atomically and that persistence
    failures do not falsely mark convergence.

## Additional backup criteria

11. Define an explicit V1 backup support policy and user communication path.
12. Because old files cannot be reached or rewritten, retain a standalone
    converter/import path for singular V1 files, or explicitly accept and document
    permanent import compatibility as the lower-risk policy.
13. If V1 support is ever ended, introduce a newer backup version before the
    cutoff and make unsupported V1 rejection explicit and non-destructive.

No elapsed time, commit age, application release count, or test pass currently
satisfies these criteria.

---

# Reader Classifications

## Local authored-state reader — Retain Until Explicit Criteria Are Met

The reader has a plausible retirement route because active data can be rewritten
in place. It is not safe to retire now: migration is lazy, no migration marker or
population evidence exists, and the unchanged storage key cannot identify the
writer generation.

## Saved-profile reader — Retain Until Explicit Criteria Are Met

The reader also has a plausible route, but current convergence depends on optional
profile collection mutations. Loading a profile is not sufficient. Retirement
requires eager/observable migration plus adopted support criteria.

## V1 backup reader — Retain Indefinitely for Now

Backups are externally held, valid V1 artifacts that the repository produced.
They cannot be automatically rewritten or globally detected, and version `1` does
not distinguish their shape. With no support policy or conversion path, no finite
retirement horizon is defensible.

None of the readers is classified **Safe to Retire**, **Retirement Horizon
Established**, or **Unresolved**. The evidence resolves their mechanics and risk;
what is absent is an authorized policy and sufficient exposure/convergence proof.

---

# Tests Inspected

The investigation inspected:

- `src/state/tests/dayFrameStore.test.ts` literal singular-only local-state,
  profile, and backup integration cases, including plural-only rewrites;
- `src/state/dayFrameProfiles.test.ts` V1 storage validation and current writer
  behavior;
- `src/state/dayFrameBackup.test.ts` V1 parsing, rejection, and current writer
  behavior.

No tests were added or updated because the task prohibits executable changes and
the existing tests already establish the required compatibility behavior.

---

# Validation Performed and Results

Targeted compatibility validation:

```text
npm test -- src/state/tests/dayFrameStore.test.ts \
  src/state/dayFrameProfiles.test.ts \
  src/state/dayFrameBackup.test.ts

Test Files  3 passed (3)
Tests      34 passed (34)
```

The repository standard validation sequence was also run after creating this
result artifact; its results are recorded in the final validation section below.

The immutable task artifact and supplied attachment were hash-compared and both
returned the same SHA-256 shown under Files Changed.

---

# Architectural Result

Singular compatibility is isolated to exactly three raw durable-reader seams.
Current runtime state, typed authored setup, store mutations, scheduling APIs,
profile writers, backup writers, and local-state writers remain plural-only.

Reader retention does not compromise plural scheduling authority. It protects
historical data at ingress and normalizes that data before it reaches current
runtime ownership. The remaining debt is temporal/governance debt, not competing
runtime authority.

---

# Recommended Next Task

The next dependency-correct task should be an investigative governance task:

> **Define DayFrame durable-data compatibility and format-versioning policy.**

It should decide whether externally held backups receive permanent import support
or a converter commitment; define storage/profile migration evidence and support
windows; specify non-destructive unsupported-format behavior; and determine
whether new format versions are warranted. It must not remove readers merely as a
side effect of writing the policy.

After policy acceptance, separate implementation tasks may add eager migration,
format discriminators, observability, or conversion behavior. Actual reader
retirement remains separately authorized work.

---

# Deviations From the Authorized Task

None.

---

# Discoveries and Deferred Work

- The same `v1` identifiers span materially different singular and plural writer
  generations.
- Normalization destroys source-shape information in memory, so later runtime code
  cannot report whether compatibility was used.
- Profile load migrates active authored state but not the source profile
  collection.
- Backup import migrates active authored state but cannot migrate the source file.
- Validator permissiveness, new versions, migration telemetry, eager rewriting,
  conversion tooling, final policy, and actual reader retirement remain deferred.
- Other Phase 1 topics listed by the task contract remain out of scope.

---

# Final Validation

The repository standard validation sequence passed:

```text
npm run lint       passed
npm run typecheck  passed
npm test           22 files passed; 244 tests passed
npm run build      passed
```

The production build completed with 42 modules transformed. No validation command
required source or test changes.

---

# Final Completion Determination

Task 1.20 is complete from an implementation-investigation standpoint. Every
remaining raw singular reader was identified, its repository producer and
convergence path were established, version semantics and current exposure limits
were assessed, retirement and detectability risks were recorded, candidate
criteria were identified without inventing a cutoff, and each reader was
classified.

The evidence does **not** justify retiring any reader now. Local state and profiles
must remain supported until explicit criteria are adopted and met; singular-only
V1 backups must remain supported indefinitely for now.
