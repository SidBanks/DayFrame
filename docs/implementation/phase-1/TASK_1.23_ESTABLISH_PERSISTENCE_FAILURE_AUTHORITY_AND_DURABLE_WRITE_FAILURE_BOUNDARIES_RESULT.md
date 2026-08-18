# Task 1.23 — Establish Persistence-Failure Authority and Durable-Write Failure Boundaries — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.23  
**Status:** Complete  
**Execution type:** Investigation only

---

# Executive Determination

DayFrame currently implements local-state and profile durability as **intentional
best-effort persistence with hidden failure boundaries**.

For every normal authored/profile write, the store mutates its authoritative
in-memory state first, calls a `void` persistence helper, and then notifies
subscribers. The helper catches `setItem` exceptions and returns no outcome.
Consequently the store, app, subscribers, and user cannot distinguish a durable
write from a swallowed failure. Runtime continues from the new state; reload
restores the older durable state; a later successful full-state write converges by
overwriting that older state.

Ordinary thrown `setItem` failures are generally **non-destructive to the prior
stored value but unobservable and divergent**. Clear operations are more serious:
two independent `removeItem` calls are suppressed separately, so clearing can be
partially durable while runtime reports a complete reset.

Backup import inherits the hidden active-state write boundary. Backup export is
different: object construction and browser download initiation are UI-owned,
exceptions are not caught by that handler, and actual browser download completion
cannot be observed by the implementation.

The current implementation is not aligned with the accepted ADR's observability,
durability, failure-classification, and migration-completion requirements. The
smallest dependency-correct future seam is to make the two storage write helpers
and two removal helpers return an explicit persistence outcome without yet changing
mutation ordering or UI behavior. No fix was implemented in this task.

---

# Artifact Integrity

The immutable Task 1.23 artifact was verified complete at 1,021 lines and ends with
the required Task Determination sentence. Its SHA-256 is:

```text
ea06115b33d6a1fd2b8e4499f9d70fbdb9ec83e7187bceef638897d9008b5891
```

The saved artifact was byte-identical to the supplied attachment and remained
unchanged.

---

# Investigation Scope and Evidence

Repository-wide durable API search found only:

- active authored state in browser local storage;
- saved-profile collection in browser local storage; and
- backup JSON creation, browser download initiation, file read, parsing, and import.

No IndexedDB, session storage, server persistence, filesystem writer, service
worker cache used for authored data, or other user-authored durable surface was
found.

Executable evidence inspected:

- `code/src/state/dayFrameStore.ts`;
- `code/src/state/createInitialDayFrameState.ts`;
- `code/src/state/dayFrameProfiles.ts`;
- `code/src/state/dayFrameBackup.ts`;
- `code/src/ui/DayFrameApp.tsx`;
- relevant state and UI tests; and
- `docs/adr/ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Claims below marked **Confirmed** derive from those paths. Browser behavior beyond
the synchronous API boundary is recorded as **Unresolved** rather than assumed.

---

# Durable-Read Inventory

| Read | Boundary | Failure handling | Caller distinction |
| --- | --- | --- | --- |
| Active state | `loadPersistedState` → `getItem(dayframe-store-v1)` → `JSON.parse` → initial-state normalization | Missing API/value returns no persisted state. `getItem` exception and malformed JSON are caught and also return no state. Missing fields default. | None: absent, thrown read, malformed JSON, and some unsupported shapes all converge to default/partial state. |
| Profiles | `loadPersistedProfiles` → `getItem(dayframe-profiles-v1)` → parse → V1 validator → clone | Missing API/value, thrown read, malformed JSON, invalid/unsupported envelope all become `[]`; malformed profile entries are filtered. | None at store/app/user layers. Validator can distinguish an invalid envelope only internally by returning `undefined`. |
| Backup file | UI `file.text()` → `parseDayFrameBackupJson` → `validateDayFrameBackup` | File-read, malformed JSON, invalid app/schema, and unsupported version throw into the UI handler. | Yes at UI for thrown message; backup validator explicitly distinguishes several cases. |

`getStorage` itself is outside each helper's `try`. If accessing
`globalThis.localStorage` throws, the exception propagates. If the property is
absent or its value is falsy, reads default and writes/removes become no-ops. The
code does not identify why storage is absent or failing.

Plural arrays take precedence over singular legacy values during all three
historical cycle reads, including when the plural array is empty.

---

# Durable-Write Inventory

## Active authored persistence

`persistState` constructs and serializes the complete authored snapshot and calls
`localStorage.setItem(dayframe-store-v1, ...)`. Its callers are:

- `commitAuthoredSetup`;
- `setSchedulingPreferences`;
- `setPreviewRange`;
- `setShiftDefinitions`;
- `setShiftCycles`;
- `setBlockTemplates`;
- `setBlockRecurrences`;
- `setManualEvents`;
- `loadProfile`; and
- `importBackup`.

Every caller assigns runtime `state` before persistence, calls `persistState`, then
calls `notify`. `persistState` returns `void` and catches `setItem` and
`JSON.stringify` exceptions inside the same block. Its callers therefore cannot
know whether durable acceptance occurred.

## Profile persistence

`persistProfiles` serializes/replaces the entire profile envelope at
`dayframe-profiles-v1`. Its callers are `saveProfile` and `deleteProfile`. Both
assign the runtime collection before persistence and notify afterward. Exceptions
are caught and the helper returns `void`.

## Clear persistence

`clearLocalData` first resets all runtime state, then calls two independent helpers:
`clearPersistedState` and `clearPersistedProfiles`, and finally notifies. Each helper
catches its own `removeItem` exception and returns `void`. No atomic relationship
exists between the two keys.

## Backup export

`exportBackup` creates and returns an in-memory V1 object. `DayFrameApp` then
serializes it into a `Blob`, calls `URL.createObjectURL`, creates an anchor, calls
`anchor.click()`, revokes the URL, and displays “downloaded.” The store owns data
creation; the UI owns download initiation and messaging. No API in this path reports
actual file completion.

---

# Required Persistence-Failure Boundary Report

| Durable Operation | Current Owner | Runtime Changes Before Write? | Failure Propagates? | User Visible? | Durable Divergence Possible? | ADR Alignment | Candidate Seam |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| Authored-state persistence | Store mutation + hidden helper | Yes | No for `setItem`/serialization; storage accessor may throw | No | Yes | Not Aligned | Explicit helper result |
| Atomic Setup commit | Store owns runtime transition; UI owns “saved” message | Yes | No for ordinary write failure | False success | Yes | In-memory atomic only; Not Aligned durably | Store mutation durability contract after helper result exists |
| Narrow authored setters | Store + same hidden helper | Yes | No | Usually implicit UI state | Yes | Not Aligned | Reuse active-write result contract |
| Manual-event mutation | Store persists; app coordinates editor and Preview | Yes | No | No durability message; edited event/Preview visibly updates | Yes | Not Aligned | Reuse active-write result, then align workflow feedback |
| Profile save | Store + hidden profile helper; app success/error UI | Yes | No for persistence | False success | Yes | Not Aligned | Explicit profile-write result |
| Profile delete | Store + hidden profile helper; app success UI | Yes | No | False success | Yes | Not Aligned | Explicit profile-write result |
| Profile load → active state | Profile source remains; store writes active key; app success UI | Yes | No | False durable-success implication | Yes | Partially Aligned recovery, Not Aligned observability | Active-write result surfaced through load outcome |
| Backup import → active state | Parser/UI validate; store replaces and writes active state | Yes, after validation | Parse errors yes; active write errors no | Import success despite failed active write | Yes | Partially Aligned source preservation; Not Aligned durable success | Active-write result surfaced through import outcome |
| Backup export/download | Store creates object; UI initiates download | No durable store mutation | Creation/initiation exceptions propagate; completion unavailable | Success after click initiation | Completion unresolved | Partially Aligned | Define initiation result separately from completion guarantee |
| Clear active + profiles | Store plus two hidden removal helpers | Yes, reset first | No for `removeItem` | False complete-clear success | Yes; either key may remain | Not Aligned | Explicit per-key removal results, then aggregate clear outcome |

The helper catch comments establish an intentional best-effort goal (“never blocks
app usage”), but no store-level contract explicitly declares whether the returned
mutation result means runtime-only or durable success. Thus helper ownership is
coherent for swallowing errors, while end-to-end failure authority is missing.

---

# Mutation, Persistence, and Subscriber Ordering

For every normal authored/profile mutation:

```text
validate/clone input where applicable
    ↓
assign new in-memory state
    ↓
call void persistence helper
    ├─ success: durable key replaced
    └─ ordinary exception: swallowed
    ↓
notify subscribers with cloned new snapshot
    ↓
return new snapshot
```

Subscribers are notified after the helper returns regardless of durable success.
The snapshot contains no dirty, pending, failed, or durability status. The React
subscriber updates `stateSnapshot`; downstream draft rebuilding and UI rendering
therefore treat it identically to durable state. No subscriber effect was found
that writes durable data automatically, so notification itself does not compound
the write, although later user actions can overwrite the old durable value.

When `getStorage` access itself throws, it bypasses helper catches: state has already
changed, notification is skipped, and the caller receives the exception. This is a
different, partially observable divergence boundary, but no current test covers it.

---

# Atomic Setup Commit Failure

`commitAuthoredSetup` is atomic as one in-memory assignment and one persistence
attempt. It is not a durable transaction.

On a swallowed active `setItem` failure:

- the complete new authored runtime snapshot remains;
- an existing Preview remains present but marked stale;
- subscribers receive the new/stale snapshot;
- the method returns normally;
- `saveCurrentSetup` displays “Setup saved.” when requested;
- Generate Preview from the current draft can proceed using the non-durable runtime
  snapshot and make the workflow appear complete;
- the prior durable authored state remains under the key; and
- reload rehydrates that prior state, losing the latest runtime-only changes.

Thus Task 1.2's atomicity claim remains correct for the store transition and number
of write attempts, but it does not guarantee durable commit.

---

# Narrow Setter and Manual-Event Behavior

All seven field-level setters use the same assignment → `persistState` → notify
sequence. No persistence-failure semantic difference was found.

Manual-event create/update/delete is coordinated by `DayFrameApp` through
`setManualEvents`. After the hidden failure, the app updates editor state and, when
a Preview exists, regenerates it from the new runtime events. There is no explicit
manual-event “saved” message, but the visible event and regenerated Preview express
successful runtime behavior. Reload restores the older durable event collection.
Later any successful authored write serializes the complete current event list and
converges it.

---

# Profile Failure Analysis

## Save

The new/replaced profile enters runtime first. On `setItem` failure it remains
visible, subscribers are notified, and the app reports “Current setup saved as a
local profile.” Reload restores the prior collection, so a newly saved profile
disappears or an overwritten profile reverts. The old durable collection is
normally preserved. A later successful save or delete writes the entire current
runtime collection, including the previously failed runtime change.

## Delete

The profile leaves runtime first. On failure it disappears from the current UI and
the app reports deletion. The old durable collection normally retains it, so reload
restores the profile. A later successful profile save/delete rewrites the runtime
collection and can make the earlier deletion durable.

## Load and dual durability authority

Profile load reads the normalized runtime profile collection, replaces active
runtime authored state, retains the source profile collection, clears Preview, and
attempts an active-state write. On failure, the app reports the profile loaded and
runtime uses it, but reload restores the prior active authored state. The source
profile remains a recovery source unless its collection is later altered; load does
not rewrite profile storage.

Source-profile durability and active-state durability are therefore separate. The
load workflow currently exposes neither distinction.

---

# Backup Import and Export Analysis

## Import

File read, JSON parse, and backup validation occur before store state replacement.
Those failures are caught by the UI and displayed. After validation, `importBackup`
replaces runtime authored state, retains profiles, clears Preview, attempts active
persistence, notifies, and returns normally even if `setItem` fails. The UI then
reports “DayFrame setup backup imported.”

Reload restores the previous active durable state. The original external file is
unchanged and remains the strongest recovery source. A later successful authored
write can persist the imported runtime state.

Current “imported” therefore means valid file + runtime replacement + persistence
attempt, not confirmed durable active-state acceptance.

## Export

The store's export means only that an in-memory backup object was created. The UI's
“downloaded” message is set after synchronous blob creation, URL creation, anchor
creation, click invocation, and URL revocation. Exceptions before the message are
not handled by the export click handler. Actual browser/file-system completion or
user retention is not observable; the executable evidence supports only
“download initiated.”

The original DayFrame state is not mutated by export failure. If serialization,
URL creation, document/anchor availability, or click throws, no dedicated backup
error is set by this handler.

---

# Storage Unavailability and Serialization

| Condition | Current behavior |
| --- | --- |
| `localStorage` property absent/falsy | Reads use defaults/empty profiles. Writes and removes silently no-op. Runtime and UI proceed as if successful. |
| `getItem` throws | Caught after storage acquisition; active read becomes default, profile read becomes empty collection. |
| `setItem` throws | Caught; runtime mutation and notification proceed; prior stored value normally remains. |
| `removeItem` throws | Caught independently; runtime reset and notification proceed; affected old key remains. |
| Accessing `globalThis.localStorage` throws | Outside helper `try`; exception propagates. During mutation, state has already changed but notification does not occur. During store construction, creation fails. |

No browser cause (quota, privacy mode, permissions) is classified; all caught write
exceptions have identical behavior.

Supported authored shapes are composed of strings, numbers, booleans, arrays,
plain cloned objects, and optional string metadata. Cloning creates fresh acyclic
graphs, so `JSON.stringify` failure is not expected for supported typed state.
Nevertheless serialization occurs inside the local/profile writer `try`, so a
runtime-invalid value such as a `bigint` would be swallowed like a storage failure.
Backup UI serialization is outside a catch and would propagate. No test establishes
these exceptional serialization cases.

Whether a browser can partially mutate a key before throwing is not observable or
controlled by this code. The Web Storage call is a single API operation; executable
evidence proves only that DayFrame performs no second destructive action in the
catch. Claims of platform-level atomicity are therefore left unresolved.

---

# Required Failure Visibility Map

“Knows” means receives a distinguishable failure signal, not merely executes at the
layer where it occurs.

| Failure Type | Helper | Store | App | User | Current Authority |
| --- | ---: | ---: | ---: | ---: | --- |
| Active storage read failure | Yes, then collapses it | No | No | No | Hidden failure boundary in read helper |
| Active storage write failure | Yes, then swallows it | No | No | No | Intentional best-effort helper; missing end-to-end authority |
| Profile storage read failure | Yes, then collapses it | No | No | No | Hidden failure boundary in read helper |
| Profile storage write failure | Yes, then swallows it | No | No | No | Intentional best-effort helper; missing end-to-end authority |
| Active/profile remove failure | Yes, then swallows it | No | No | No | Distributed two-helper clear; missing aggregate authority |
| Backup file-read failure | N/A | No | Yes | Yes, generic/error message | UI import workflow |
| Backup parse failure | Parser throws | No | Yes | Yes, explicit invalid-JSON message | Parser + UI workflow; coherent |
| Backup unsupported-version failure | Validator throws | No | Yes | Yes, explicit unsupported-version message | Validator + UI workflow; coherent |
| Backup import active-write failure | Helper swallows | No | No | No; success shown | Hidden active-write boundary |
| Backup download/export initiation failure | No persistence helper | Store only creates data; does not know download | Exception reaches event boundary, but no handler | No deliberate message | UI initiation boundary; incomplete failure authority |
| Backup download completion failure | No observable signal | No | No | Not by DayFrame | Unresolved/unobservable in current browser mechanism |

---

# Required Divergence Map

## Setup save

```text
Save Setup
  → complete runtime authored snapshot replaces prior state; Preview becomes stale
  → active setItem fails and is swallowed
  → runtime = new setup; durable = prior setup
  → UI = “Setup saved.”; subscribers receive new state
  → reload = prior setup
  → recovery = current session until reload; later full authored write can converge
```

## Profile save

```text
Save profile
  → runtime collection adds/replaces profile
  → profile setItem fails and is swallowed
  → runtime = new collection; durable = prior collection
  → UI = save success
  → reload = prior collection
  → recovery = current runtime profile; later profile rewrite can converge
```

## Profile delete

```text
Delete profile
  → runtime collection removes profile
  → profile setItem fails and is swallowed
  → runtime = profile absent; durable = profile retained
  → UI = deletion success
  → reload = profile restored
  → recovery = old durable profile; later profile rewrite can converge deletion
```

## Profile load

```text
Load profile
  → runtime authored state becomes normalized profile; Preview clears
  → active setItem fails and is swallowed
  → runtime = profile setup; active durable = prior setup; profile durable = source retained
  → UI = load success
  → reload = prior active setup; source profile remains loadable
  → recovery = source profile; later authored write can converge active state
```

## Backup import

```text
Read/validate backup, then import
  → runtime authored state becomes backup data; Preview clears
  → active setItem fails and is swallowed
  → runtime = imported setup; durable = prior active setup
  → UI = import success
  → reload = prior active setup
  → recovery = unchanged external backup; later authored write can converge
```

## Manual-event save/update

```text
Save event
  → runtime event list changes; Preview becomes stale
  → active setItem fails and is swallowed
  → runtime = new event; durable = prior list
  → UI = event/editor and regenerated Preview reflect new event
  → reload = prior list
  → recovery = current session; later authored write can converge
```

## Manual-event delete

```text
Delete event
  → runtime event list removes event; Preview becomes stale
  → active setItem fails and is swallowed
  → runtime = event absent; durable = event retained
  → UI = event absent and Preview regenerated
  → reload = event restored
  → recovery = old durable event; later authored write can converge deletion
```

## Clear local data (additional discovered divergence)

```text
Confirm clear
  → runtime resets
  → active remove and profile remove execute independently; either/both may fail silently
  → runtime = empty; durable = empty, old active, old profiles, or both old keys
  → UI = “cleared from this device”
  → reload = whatever keys survived, potentially a mixed old/default state
  → recovery = surviving durable key(s); removed key has no in-app rollback
```

---

# Last-Known-Recoverable Data

- A thrown `setItem` normally leaves the old key as the last recoverable
  representation; DayFrame does not intentionally remove it first. This is
  non-destructive at the application sequence level even though failure is hidden.
- Full-snapshot writes mean a later success replaces the old durable snapshot with
  all current runtime changes, including changes whose earlier attempts failed.
- Profile save/delete similarly preserves the old collection on a thrown write and
  later rewrites the entire current collection.
- Profile load preserves the source profile independently of the active-state write.
- Backup import preserves the source file outside DayFrame control.
- Clear differs: a successful removal destroys that key while another removal may
  fail. There is no rollback or aggregate success, so partial clearing can remove
  one recovery source while falsely reporting complete success.
- Export failure never mutates source state; whether a partially initiated file
  exists is outside observable evidence.

---

# UI Success Semantics

| Workflow | Current message/visible result | What it actually proves |
| --- | --- | --- |
| Save Setup | “Setup saved.” | Runtime transition and persistence attempt completed without an uncaught exception; not durable success. |
| Generate from draft | Preview opens/generates | Runtime-only setup was usable; not durable setup success. |
| Manual event save/delete | Event/editor and possibly regenerated Preview change | Runtime transition succeeded; no durable assertion is explicit, but appearance implies continuity. |
| Profile save | “Current setup saved as a local profile.” | Runtime collection changed; not durable profile write. |
| Profile delete | “Deleted profile …” | Runtime collection changed; not durable deletion. |
| Profile load | “Loaded profile …” | Runtime active state changed; not durable active-state write. |
| Backup import | “DayFrame setup backup imported.” | File read/validation and runtime replacement succeeded; not durable active-state write. |
| Backup export | “DayFrame setup backup downloaded.” | Synchronous download initiation path returned; not confirmed file completion. |
| Clear | “Local … data cleared from this device.” | Runtime reset and two removal attempts returned; neither removal is confirmed. |

Success semantics are therefore undefined between runtime and durable outcomes and
are frequently worded as durable success.

---

# Existing Test Inventory

## Covered

- local storage API absence through test setup and store operation without storage;
- literal historical/malformed-compatible rehydration cases;
- successful active persistence and one-write atomic Setup behavior;
- successful profile save/load/delete persistence;
- successful clear removal;
- successful backup export initiation (`createObjectURL`, anchor click, revoke);
- valid backup import and UI success;
- malformed backup JSON and UI error;
- invalid backup app/version validation;
- singular-only local/profile/backup compatibility and plural rewrites.

## Not found

- `getItem` throwing;
- malformed local or profile JSON assertions;
- `setItem` throwing for active or profile storage;
- `removeItem` throwing or partial clear;
- missing/falsy storage durability messaging;
- storage accessor throwing;
- subscriber behavior after failed persistence;
- setup/manual-event/profile/import UI feedback under durable-write failure;
- backup blob/URL/anchor/click failure messaging;
- backup completion detection;
- serialization failure; and
- recovery/retry behavior after a failure.

Absence of these tests does not alter the behavior established by direct code
inspection. No tests were added because Task 1.23 is investigation-only.

---

# ADR Alignment Assessment

| ADR Requirement | Current Assessment | Evidence |
| --- | --- | --- |
| Observability | **Not Aligned** | Local/profile write/remove failures are swallowed and return no outcome. |
| Non-destructive failure | **Partially Aligned** | Ordinary failed replacement preserves old key at application level; clear can partially remove keys; silent defaults/profile filtering remain. |
| Durable migration evidence | **Not Aligned** | Normalization/convergence has no marker and failed writes cannot be distinguished. |
| Atomicity | **Partially Aligned** | Each store transition is one in-memory assignment and each key uses one API call; runtime + persistence are not atomic, and two-key clear is non-atomic. |
| Retryability | **Partially Aligned** | Later full writes can converge, but no failure state, deliberate retry, or confirmation exists. |
| Explicit failure classification | **Not Aligned** for storage; **Aligned** for principal backup parse/version cases | Caught storage exceptions collapse; backup validators throw categorized messages. |
| Last-known recoverable preservation | **Partially Aligned** | Old value/source usually remains on failed write/import; clear and silent read fallback lack recovery protocol. |
| Persistence failure cannot count as migration success | **Not Aligned** | Write-time convergence failure is indistinguishable from success. |
| Narrow historical ingress/current runtime | **Aligned** | Compatibility remains at raw boundaries and runtime uses plural state. |

Ordinary writes are persistence, not schema migration. Historical read-time
normalization is not completed migration. A later plural full-state write is
write-time convergence; because its success is hidden, it cannot serve as migration
evidence. Profile collection rewrite is convergence, while backup import is
validation/conversion into current runtime followed by ordinary active persistence.
No versioned durable migration mechanism currently exists.

---

# Current Failure Authority Classification

| Concern | Classification | Current decision point |
| --- | --- | --- |
| Whether storage exceptions are swallowed | **Intentional Best-Effort Persistence / Coherent Current Ownership** | Individual store persistence helper |
| Whether runtime mutation proceeds | **Coherent Current Ownership** | Store mutation assigns before helper call |
| Whether subscribers see non-durable state | **Hidden Failure Boundary** | Helper hides outcome before store notifies |
| Whether UI shows success | **Distributed Ownership** | App workflow assumes normal store return means success |
| Whether recovery/retry occurs | **Missing Failure Authority** | No layer owns it |
| Whether old durable data remains authoritative after failure | **Ambiguous** | Runtime continues as authority for session; reload silently restores durable state |
| Backup parse/version failure | **Coherent Current Ownership** | Parser/validator classify; UI catches/displays |
| Backup download completion | **Unresolved** | Current browser-click mechanism provides no completion signal |
| Two-key clear outcome | **Missing Failure Authority** | Independent helpers suppress each result; app claims aggregate success |

Under the ADR, the store/durable boundary should conceptually own the truth of
whether a write was durably accepted, because it alone invokes the storage API.
Workflow/UI layers should own user messaging and recovery choices based on that
truth. Whether runtime should roll back, remain explicitly pending, or retain a
dirty retryable state is not safely decidable from current evidence and must be a
later contract decision.

---

# Candidate Ownership Boundaries and Smallest Safe Seams

## Candidate options evaluated

1. **Persistence helpers return explicit results.** This is the narrowest existing
   boundary and covers every caller without inventing a service. It distinguishes
   persisted, unavailable, serialization failure, storage failure, and per-key
   clear results as far as safely observable.
2. **Store mutations return a durable outcome.** Necessary eventually for callers,
   but premature until helper results exist and the store decides runtime semantics.
3. **Dedicated persistence service/transaction abstraction.** Not justified yet;
   there are two local keys and direct helpers in one module.
4. **UI-only try/catch.** Insufficient because ordinary errors never escape and
   cannot recover the hidden durability fact.

## Dependency-ordered future seams

1. **Recommended next implementation seam: make active/profile write and removal
   outcomes observable at the existing helper boundary, with failure-injection
   tests.** Preserve current mutation ordering and UI language in that task unless
   explicitly expanded. This establishes facts without deciding rollback.
2. Define store mutation result semantics for runtime-only versus durably accepted
   state, including subscriber representation and the two-key clear aggregate.
3. Align Setup, manual-event, profile, clear, and backup-import feedback/recovery
   with that store contract.
4. Separately define backup export initiation/error semantics; do not promise
   completion the browser API cannot observe.
5. Only after ordinary durability is explicit, introduce migration-specific
   markers/retry/evidence required by the ADR.

This ordering begins at the smallest actual abstraction, avoids redesigning
`DayFrameApp`, and prevents migration work from treating hidden write failure as
success.

---

# Discrepancies and Uncertainty

- Browser/platform atomicity of a throwing `setItem`/`removeItem` is not established
  by repository evidence; only DayFrame's call sequence is known.
- Actual file download completion cannot be observed through the current anchor
  click path.
- The desired runtime policy after a failed write—rollback, pending state, or
  explicit non-durable continuation—is not selected by the ADR or current code.
- The correct user recovery UX and retry timing remain undecided.
- No evidence justifies a new persistence service at this scale.
- Unsupported local/profile read behavior is governed by the ADR but is distinct
  from this task's first write-failure implementation seam.

---

# Files Changed

Created only:

`docs/implementation/phase-1/TASK_1.23_ESTABLISH_PERSISTENCE_FAILURE_AUTHORITY_AND_DURABLE_WRITE_FAILURE_BOUNDARIES_RESULT.md`

The Task 1.23 specification, ADR, Tasks 1.20–1.22 artifacts, governance updates,
production code, tests, schemas, keys, messages, validators, normalizers, and
recovery behavior were preserved.

---

# Validation Performed

Targeted and repository-standard validation results are recorded after final
execution.

```text
npm test -- src/state/tests/dayFrameStore.test.ts \
  src/state/dayFrameProfiles.test.ts \
  src/state/dayFrameBackup.test.ts \
  src/ui/tests/DayFrameApp.test.tsx
  4 files passed; 81 tests passed

npm run lint       passed
npm run typecheck  passed
npm test           22 files passed; 244 tests passed
npm run build      passed; 42 modules transformed
```

---

# Discoveries and Deferred Work

- Clear is a distinct partial-durability risk, not merely another swallowed write.
- Backup import has a recoverable external source but still reports active-state
  durability it cannot confirm.
- Profile load crosses two durability authorities; its source remains recoverable
  when active persistence fails.
- Preview regeneration can reinforce the appearance that a failed manual-event or
  Setup write succeeded.
- Storage access itself can throw outside existing catches, producing a different
  unnotified runtime divergence.
- Error result types, store contracts, rollback/pending semantics, retries,
  subscriber durability state, UI feedback, migration markers, recovery UX, and
  backup initiation handling are deferred.

---

# Recommended Next Task

**Implementation Task 1.24 — Make Existing Durable-Write Outcomes Observable at the
Persistence-Helper Boundary.**

The task should be limited to explicit outcomes for `persistState`,
`persistProfiles`, `clearPersistedState`, and `clearPersistedProfiles`, plus focused
failure-injection tests. It should establish categories that the implementation can
actually observe and preserve existing runtime mutation/UI semantics pending a
separate store-contract decision.

It must not add migration markers, invent a persistence service, redesign UI
workflows, remove V1 readers, or silently choose rollback versus pending-state
semantics.

---

# Final Completion Determination

Task 1.23 is complete from an investigation standpoint. Every durable read/write
boundary and helper caller was traced; mutation/write/notification ordering,
failure visibility, divergence, recovery sources, UI success semantics, subscriber
behavior, test coverage, and ADR alignment were established. Current authority was
classified, and the smallest dependency-correct implementation seam was identified
without changing executable behavior.
