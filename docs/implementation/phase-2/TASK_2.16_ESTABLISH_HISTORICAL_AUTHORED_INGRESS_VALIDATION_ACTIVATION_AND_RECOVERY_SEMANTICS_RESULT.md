# Task 2.16 — Historical Authored-Ingress Validation, Activation, and Recovery Semantics — Result

## 1. Executive Determination

**Recommended and adopted for future implementation:** reuse the Task 2.15 authored validator after parsing, version/format gating, and deterministic compatibility normalization. Historical snapshots activate atomically only when valid (advisories allowed) or after an explicitly authorized deterministic migration whose output validates. Invalid or ambiguous profile/backup data must not replace current authority. Invalid active local data must not activate; the app should construct with a clearly identified safe fallback, preserve the exact original checkpoint, retain a separate recovery-required status, and block ordinary active-checkpoint writes until explicit recovery or abandonment prevents silent loss.

This task made no executable change.

## 2. Artifact Integrity

**Confirmed:** the supplied artifact and saved project copy were byte-identical, 59,320 bytes / 2,219 lines, and complete through the required final sentence. SHA-256 for both: `a103095813e010bee038c45bdab76b50d4b5cd115c81277e64c9346f11f0226b`. The task artifact was not modified.

## 3. Evidence Reviewed

**Confirmed:** inspected `dayFrameStore.ts`, `createInitialDayFrameState.ts`, `dayFrameProfiles.ts`, `dayFrameBackup.ts`, `manualCalendarEvents.ts`, `shiftCycleUtils.ts`, Task 2.15 validation and result types, durability/retry contracts, `DayFrameApp` callers, relevant state/profile/backup/UI tests, prior Tasks 2.11–2.15 findings, and Git history through the Phase 1 checkpoint.

## 4. Current Historical Ingress Inventory

| Surface      | Raw input                                   | Format gate                                | Normalization                                                                                                 | Activation point                       | Persistence after activation | Current failure result                                                                               |
| ------------ | ------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| Active local | `dayframe-store-v1` JSON string             | None/versionless                           | `createInitialDayFrameState`; singular-cycle, cycle defaults, Preview defaults, template/manual normalization | Store construction/merge               | None until a later mutation  | No result; many read/parse failures silently become defaults, some nested failures throw             |
| Profile      | `dayframe-profiles-v1` versioned collection | `app === DayFrame`, `version === 1`, array | Collection filters records; per-profile authored and singular-cycle/manual normalization                      | `loadProfile` replaces authored state  | Active-state write           | Missing throws; collection errors become empty list; load otherwise returns only persistence outcome |
| Backup       | User file text → parsed object              | Explicit app/version/envelope checks       | Authored defaults plus singular-cycle/manual normalization                                                    | `importBackup` replaces authored state | Active-state write           | Typed `RangeError` caught by workflow; successful import returns only persistence outcome            |

## 5. Existing Local Rehydration Pipeline

**Confirmed:** storage lookup → `getItem` → JSON parse/cast → `createInitialDayFrameState` normalization → injected-state merge → runtime authority. There is no envelope/version or semantic gate. Missing/unavailable source produces defaults. `getItem`/parse errors are caught and silently produce defaults while the raw key remains. A throwing `localStorage` accessor or malformed nested shapes can escape and block construction. No automatic write occurs at construction; a later ordinary mutation can overwrite the hidden original.

## 6. Existing Profile Load Pipeline

**Confirmed:** collection storage read → JSON parse → V1 envelope check → record filtering → authored compatibility normalization → cloned in-memory profiles. Any outer exception yields an empty collection; invalid records are silently filtered. Selection clones normalized data, calls `createInitialDayFrameState`, replaces all authored state, preserves profiles, clears Preview, writes active state, updates active durability, notifies, and returns `{ state, persistence }`. No semantic validation occurs.

## 7. Existing Backup Import Pipeline

**Confirmed:** file read → JSON parse → app/version/envelope and shallow structural checks → compatibility normalization → store revalidation/clone → full authored replacement, profile preservation, Preview clearing, active persistence/durability update, notification. Parsing/format/structural failures throw and are shown as workflow errors. Semantic-invalid normalized data can currently activate unless existing normalization/cloning happens to throw first.

## 8. Failure Classification

**Adopted:** keep distinct: unavailable source/access; parse corruption; unsupported format/version; structural invalidity; compatibility-normalizable history; semantic invalidity; semantic ambiguity; valid-with-advisories; and persistence failure after successful activation. “Recovery required” is an operational consequence, not a synonym for every failure class.

## 9. Parse Failure Semantics

**Confirmed current behavior:** malformed local JSON silently defaults; malformed profile JSON silently produces no profiles; malformed backup JSON throws an explicit invalid-JSON error. **Adopted:** parse failure blocks activation. Preserve exact local/profile raw data; backup remains external. Classify as corrupt/unreadable, not semantic invalidity.

## 10. Unsupported Format Semantics

**Confirmed:** profile V1 mismatch currently collapses to an empty collection; backup mismatch throws explicitly; active local state has no embedded version gate. **Adopted:** unsupported format blocks activation and requires conversion/migration support or recovery, with original source preserved. It must not mean empty/default. The unversioned local representation is a known limitation, not authorization to infer a version.

## 11. Structural Invalidity

**Confirmed:** backup performs shallow structural checks; profiles filter only envelope/profile metadata then cast much authored content; local state is cast without a structural gate. Manual-event normalization can silently drop malformed entries. **Adopted:** structural invalidity blocks atomic activation and remains distinct from parse and semantic failure. Silent field/record dropping is not acceptable activation policy unless a named compatibility conversion explicitly authorizes it.

## 12. Compatibility-Normalizable Data

**Confirmed:** singular `shiftCycle`, missing cycle mode/sequence defaults, Preview defaults, legacy manual times, and a narrow legacy Sleep-template behavior are deterministic supported normalization paths. **Adopted pipeline:** raw → parse → format gate → compatibility normalization → current representation → semantic validation. Never apply the current validator to an obsolete raw shape first, and never treat in-memory normalization as durable migration evidence.

## 13. Semantic Invalidity

**Adopted:** blocking validator issues prevent historical activation. Local uses safe fallback/recovery state; profile load rejects/preserves; backup import rejects/preserves. A future historical wrapper may refine a blocking result into invalid versus ambiguous without changing validator truth.

## 14. Semantic Ambiguity

**Adopted:** ambiguity is a distinct recovery class within non-activatable semantic failure. Duplicate referents plus linked IDs are the primary confirmed example. DayFrame must not select a referent, cascade-delete, or remap silently. User-assisted recovery or a provenance-preserving deterministic migration is required.

## 15. Advisory-Only Data

**Adopted:** otherwise-valid historical snapshots with `perShiftSegment` or `custom` advisories may activate normally. Advisories remain derived infrastructure/workflow facts and are not persisted into authored data or promoted to recovery-required.

## 16. Semantic Validation Placement

**Adopted for all surfaces:** semantic validation occurs once a complete current `DayFrameAuthoredSetup` has been deterministically normalized, immediately before boundary-specific activation. For profile collections, individual profile semantics are checked at selection/load (optionally preclassified for listing) without discarding the collection.

## 17. Validator Reuse Determination

**Adopted:** reuse `validateDayFrameAuthoredSetup`; do not fork historical validity rules. A separate pure ingress classifier should combine parse/version/normalization facts, validator output, source surface, and ambiguity classification into shared semantic categories. Surface-specific policy/results then decide activation.

## 18. Historical Rule Compatibility Assessment

**Confirmed/inferred:** identifier/reference, date ordering, relationship, and shape rules protect current executable assumptions and are activation invariants. Some invalid states were nevertheless producible by old permissive setters/UI. That creates a preservation/recovery obligation, not permission to activate unsafe state. Existing compatibility defaults are valid deterministic migrations; unsupported frequency remains advisory.

## 19. Historical Validation Rule Matrix

| Validation rule                    |                          Historical data could contain it? |                  Safe to activate? | Needs migration/recovery?                                              |          Current validator alone sufficient? |
| ---------------------------------- | ---------------------------------------------------------: | ---------------------------------: | ---------------------------------------------------------------------- | -------------------------------------------: |
| Duplicate top-level IDs            |                               Yes; demonstrably producible |  No; references/identity ambiguous | Recovery unless provenance proves remap                                | Detects, but wrapper must classify ambiguity |
| Nested work-entry collision        |         Yes; plausibly/ordinarily producible by length IDs |                                 No | Migration only if unreferenced meaning is provable; otherwise recovery |                            Yes for detection |
| Missing recurrence template        | Yes; plausible under narrow historical edits/external data |                                 No | Recovery; no target provenance                                         |                                          Yes |
| Missing shift-definition reference | Yes; plausible under narrow historical edits/external data |                                 No | Recovery; no target provenance                                         |                                          Yes |
| Cycle containment mismatch         |                     Yes; plausible date/relationship edits |                                 No | Deterministic repair not generally knowable                            |                                          Yes |
| Overlapping cycles                 |   Yes; plausible under permissive historical store commits |   No; work-generation path rejects | Recovery/migration decision                                            |                                          Yes |
| Overlapping segments               |         Yes; plausible under permissive historical commits |        No; cycle execution rejects | Recovery/migration decision                                            |                                          Yes |
| Invalid sequence offsets           |           Yes; plausible injected/external, less likely UI |                                 No | Recovery or explicit deterministic resequencing                        |                                          Yes |
| Invalid recurrence parameters      |                         Yes; plausible older/external data |                                 No | Recovery; do not invent parameters                                     |                                          Yes |
| Invalid preference/range           |                  Yes; plausible external/partial old state | No as normalized current authority | Known defaults only where already authorized; otherwise recovery       |                      Yes after normalization |
| Invalid manual-event shape         |  Yes; malformed/older data; current normalizer may drop it |              No partial activation | Conversion if legacy mapping deterministic; otherwise recovery         |             Yes after lossless normalization |
| Unsupported recurrence advisory    |                          Yes; UI exposes `perShiftSegment` |                                Yes | No                                                                     |                                          Yes |

## 20. Historical Producer Evidence

**Confirmed:** Phase 1 UI allocated shift/cycle/segment/sequence/template/recurrence IDs from collection length; deletion followed by creation could duplicate an active ID. Phase 1 store setters accepted and persisted complete/narrow state without semantic validation. `perShiftSegment` is user-selectable. **Inferred:** date edits and narrow surface writes could persist containment, overlap, or dangling relationships because store enforcement was absent. **Not found:** evidence that normal UI deliberately emitted malformed manual-event shapes or invalid recurrence parameter types. Test-only injected states are not production evidence.

## 21. Producer Matrix

| Invalidity                    | Historical producer evidence                                                       | User-data obligation                               | Recovery priority |
| ----------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------- |
| Duplicate IDs                 | Demonstrably produced by length-based reuse                                        | Preserve; never silent remap                       | Critical          |
| Dangling recurrence           | Plausible through permissive narrow mutations; external possible                   | Preserve relationships/provenance                  | High              |
| Dangling shift reference      | Plausible through permissive narrow mutations; external possible                   | Preserve; no guessed target                        | High              |
| Overlapping cycles            | Plausible because historical store accepted authored arrays; runtime later rejects | Preserve and block activation                      | High              |
| Invalid segment containment   | Plausible through independent cycle date edits                                     | Preserve and recover                               | High              |
| Sequence gaps                 | No ordinary UI proof found; injection/external plausible                           | Preserve if durable                                | Medium            |
| Invalid recurrence parameters | No ordinary invalid-type producer found; historical/external plausible             | Preserve, do not invent                            | Medium            |
| Invalid manual-event shape    | No current UI producer found; legacy/manual corruption possible                    | Preserve raw; deterministic legacy conversion only | Medium            |

## 22. Active Local-State Candidate Models

Model A activates unsafe state and violates current authority. Model B silently hides user data and risks overwrite. Model C provides usable safe authority while preserving recovery. Model D protects authority but can make recovery inaccessible and is operationally brittle.

## 23. Active-State Model Matrix

| Model                            | Invalid data authority? | Original preserved? | App usable? |        Silent-loss risk |             Recovery-friendly | Recommendation |
| -------------------------------- | ----------------------: | ------------------: | ----------: | ----------------------: | ----------------------------: | -------------- |
| Activate invalid                 |                     Yes |                 Yes |  Unreliable |                  Medium |                          Poor | Reject         |
| Silent defaults                  |                      No |           Initially |         Yes | Critical on later write |                          Poor | Reject         |
| Safe fallback + preserved source |                      No |                 Yes |         Yes |    Low with write guard |                        Strong | Adopt          |
| Block construction               |                      No |                 Yes |          No |                     Low | Poor without separate tooling | Reject         |

## 24. Adopted Active Activation Policy

**Adopted:** valid normalized snapshots (including advisory-only) activate. Invalid, ambiguous, unsupported, corrupt, or structurally invalid checkpoints do not. Construct a store around safe fallback authority and retain observable recovery facts and the original source.

## 25. Active Safe-Fallback Determination

**Adopted conceptually:** use the known-valid authored result of `createInitialDayFrameState()` (empty authored collections with default preferences/range), explicitly labeled temporary safe fallback—not restored user state. Seeded/demo initialization is separate and must not masquerade as recovered data.

## 26. Active Source Preservation

**Adopted:** preserve the exact raw local payload byte-for-byte until a valid replacement is durably established or the user explicitly abandons it. A normalized copy may support diagnostics but cannot replace the source artifact.

## 27. Active Persistence Hazard

**Resolved conceptually:** ordinary active-state persistence must not overwrite a recovery-required checkpoint. Permitting first-write overwrite would convert a safe runtime fallback into silent data loss. Durability retry must also respect this guard.

## 28. Active Fallback Write Models

Overwrite-first is rejected. Blocking writes is the minimum safe implementation and requires session-risk awareness. Preserve-to-a-new-recovery-artifact then write could later improve continuity, but it introduces a new durable surface/format and needs a separate contract.

## 29. Fallback Write Matrix

| Policy                         | Protects history |                  User can edit? | Persistence complexity     | Risk                              | Recommendation            |
| ------------------------------ | ---------------: | ------------------------------: | -------------------------- | --------------------------------- | ------------------------- |
| Overwrite on first write       |               No |                    Yes, durable | Low                        | Destructive                       | Reject                    |
| Block active writes            |              Yes |               Yes, session-only | Moderate status/guard work | Reload loses fallback edits       | Adopt minimum             |
| Preserve checkpoint then write |              Yes | Yes, durable after preservation | High; new durable artifact | Preservation transaction can fail | Deferred enhancement/task |

## 30. Active Recovery-State Requirement

**Adopted:** retained store/infrastructure state outside `DayFrameState` is required for active-source condition, classification, issues/provenance, source-preserved fact, activation-blocked fact, and active-write protection. It requires a read/subscription boundary for persistent app awareness.

## 31. Durability Separation

**Adopted:** ingress recovery state is independent of durability. Invalid input is not `storageFailure`, `unavailable`, or `serializationFailure`. A later valid activation can succeed while persistence fails; that is an accepted ingress plus a durability failure.

## 32. Profile Candidate Models

Activating invalid profiles violates current authority. Generic repair loses provenance. Reject-and-preserve is atomic, understandable, and leaves the current session safe.

## 33. Profile Model Matrix

| Model                  | Active safe? | Profile preserved? | Silent repair? |  Recovery-friendly | Recommendation                |
| ---------------------- | -----------: | -----------------: | -------------: | -----------------: | ----------------------------- |
| Activate invalid       |           No |                Yes |             No |               Poor | Reject                        |
| Reject + preserve      |          Yes |                Yes |             No |             Strong | Adopt                         |
| Auto-repair + activate |     Unproven |        Not exactly |            Yes | Poor for ambiguity | Reject absent named migration |

## 34. Adopted Profile Load Policy

**Adopted:** normalize then validate the selected profile. On semantic invalidity/ambiguity, return an explicit non-persistence load result; keep active authored state, Preview, desired condition, durability, and subscribers unchanged; preserve the selected profile and collection.

## 35. Profile Collection Preservation

**Adopted:** one bad profile must not invalidate or be filtered from the entire collection. Preserve raw collection/profile artifacts and retain enough metadata to list/select/export/delete them. Validate semantics independently at load. Current silent record filtering/whole-collection empty fallback is incompatible with this future policy.

## 36. Backup Candidate Models

Invalid activation and subset import violate authority/provenance. Reject-and-preserve is safe. Explicit conversion/migration may become valid only when deterministic and separately authorized.

## 37. Backup Model Matrix

| Model                          |            Active safe? |                  Backup preserved? | Provenance preserved? | Silent-loss risk | Recommendation              |
| ------------------------------ | ----------------------: | ---------------------------------: | --------------------: | ---------------: | --------------------------- |
| Activate invalid               |                      No |                                Yes |                   Yes |           Medium | Reject                      |
| Reject + preserve              |                     Yes |                      Yes, external |                   Yes |              Low | Adopt                       |
| Partial import                 |           Superficially | External yes, activated meaning no |                    No |             High | Reject                      |
| Explicit migration then import | Yes if output validates |                   Original remains |     Yes with evidence |              Low | Allow only named conversion |

## 38. Adopted Backup Import Policy

**Adopted:** parse/gate/normalize/validate before store replacement. Invalid or ambiguous backups return explicit workflow failure; active state and Preview remain unchanged; no persistence, desired-condition update, or notification occurs; the external file remains untouched.

## 39. Partial Activation Determination

**Adopted prohibition:** activate the complete authored snapshot or none of it. Dropping invalid templates, events, cycles, profiles, or relationships manufactures state the user never supplied.

## 40. Migration Versus Recovery

**Adopted:** migration is deterministic, lossless interpretation of a supported old representation; recovery is required when no single correct transformation is knowable. Singular-cycle/default-field conversion is migration/compatibility normalization. Duplicate referent choice and dangling target invention are recovery.

## 41. Conversion Boundary

**Adopted:** portable backup conversion produces a separate current artifact/snapshot while leaving the original file unchanged. It is conceptually distinct from in-place migration and must record source version and transformation evidence.

## 42. Recovery Source Preservation

**Adopted:** preserve each source until explicit successful replacement/recovery: exact local payload in place or protected recovery storage; exact profile/collection record; external backup inherently remains outside DayFrame. Explicit deletion/abandonment remains permitted.

## 43. Raw Versus Normalized Recovery Source

**Adopted:** exact raw representation is authoritative recovery evidence; normalized representation is diagnostic working data. Preserve both when useful, but never claim normalized data is the original or silently rewrite on read.

## 44. Activation Evidence

Activation requires: supported parse/format → deterministic normalization → complete validator-valid snapshot (advisories allowed) → surface policy authorization. Migration additionally requires identified migration completion, validating output, and retained evidence where required.

## 45. Local Migration Evidence

**Confirmed:** successful in-memory normalization/validation is not durable migration evidence and cannot retire compatibility readers. Future local migration must establish an observable durable current representation without losing the original on failure.

## 46. Result Vocabulary Assessment

**Recommended shared semantic vocabulary:** `unavailable`, `corrupt`, `unsupportedFormat`, `structurallyInvalid`, `compatibilityNormalized`, `semanticallyInvalid`, `ambiguous`, `accepted`, and `acceptedWithAdvisories`. Surface results should remain distinct: profile (`loaded`, `notFound`, `recoveryRequired`, then optional persistence); backup (parse/version/structure/recovery failures versus `imported` plus persistence); local retained initialization status. Do not force persistence onto rejected results.

## 47. Active Construction Observability

**Adopted:** because `createDayFrameStore()` must still return a usable store, construction exception and a one-shot callback are rejected as primary contracts. Retained, queryable/subscribable ingress status is the smallest robust boundary; it survives the initiating call and supports app-level awareness.

## 48. Historical Ingress Status

**Adopted:** infrastructure status outside authored state and durability. Active-local recovery status persists for the session. Profile/backup failures are primarily operation results; they need not become global status unless they alter the active recovery condition.

## 49. Workflow-Local Versus Persistent Recovery State

Active local failure: store-retained plus persistent app awareness. Invalid selected profile: workflow-local result while profile remains marked/inspectable. Invalid backup: workflow-local result. Unsupported/corrupt active local source: persistent awareness; unsupported/corrupt profile or backup: workflow-local unless collection health itself is compromised.

## 50. Subscriber / Durability Semantics

Rejected profile/backup ingress sends no state or durability notification and changes no desired durable condition. Active construction has no subscribers yet; later ingress-status subscription exposes retained facts. Successful activation notifies state; its persistence outcome alone updates durability.

## 51. Valid Activation Semantics

Valid normalized historical data fully replaces current authored authority atomically; advisory facts may be reported but do not alter authored state. After activation it has no special “historical” mutation mode: Task 2.15 governs all subsequent current mutations.

## 52. Profile Replacement Semantics

Valid load preserves profiles, clears Preview, activates complete authored data, attempts active persistence, updates durability, and notifies. Invalid load changes none of those. This preserves current valid behavior while adding a pre-activation gate later.

## 53. Backup Replacement Semantics

Valid import preserves profiles, clears Preview, activates complete authored data, attempts active persistence, updates durability, and notifies. Invalid import changes none of those and leaves the file untouched.

## 54. Invalid Profile Deletion / Preservation

**Adopted:** invalid profiles remain exportable/preservable and may be explicitly deleted because deletion does not activate authored data. Deletion must be user-directed; semantic detection alone never removes or rewrites a profile.

## 55. Recovery Completion

Active recovery ends only when a complete valid replacement is explicitly selected/migrated and durably established, or when the user explicitly abandons/removes the checkpoint. A failed replacement write leaves the original checkpoint and recovery protection active even if valid fallback/replacement state exists in memory.

## 56. Explicit Replacement / Abandonment Semantics

Replacing or abandoning invalid local data must be explicit. Existing clear semantics may become the underlying destructive operation, but future recovery-aware confirmation/status is required. Export/preservation should be offered where possible, not silently substituted for consent.

## 57. Recovery Via Profile / Backup

A user-selected valid profile or backup may explicitly replace the invalid active checkpoint. This is recovery authority because selection is intentional; completion still requires successful durable establishment. Failed persistence remains a durability issue and must not destroy the preserved checkpoint.

## 58. Surface Policy Matrix

| Surface       | Detection                             | May activate invalid? |         Original preserved? |     Runtime fallback? | Persistence allowed?                                     |            Recovery result? |
| ------------- | ------------------------------------- | --------------------: | --------------------------: | --------------------: | -------------------------------------------------------- | --------------------------: |
| Active local  | After normalization, before authority |                    No |          Exact raw required |         Safe defaults | Ordinary active writes blocked until explicit resolution |    Retained status required |
| Profile load  | Per selected normalized profile       |                    No | Profile/collection required | Current state remains | No active write on rejection                             |   Discriminated load result |
| Backup import | After parse/gate/normalization        |                    No | External artifact untouched | Current state remains | No write on rejection                                    | Discriminated import result |

## 59. Failure-Class Matrix

| Failure class                       | Local rehydration                                                                                  | Profile load                                           | Backup import                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| Unavailable                         | Safe defaults; availability fact, not recovery if no readable source                               | Collection unavailable; report separately              | File absence/cancel: no operation          |
| Parse failure                       | Fallback + preserve raw + persistent corrupt status                                                | Preserve raw collection; do not present empty as truth | Reject with corrupt result; file untouched |
| Unsupported version                 | Not currently representable; future gate blocks/preserves                                          | Preserve collection; unsupported result                | Reject unsupported; file untouched         |
| Structural invalidity               | Fallback/recovery; preserve raw                                                                    | Preserve record/collection; reject load                | Reject; preserve file                      |
| Compatibility-normalizable          | Normalize, validate, activate if valid                                                             | Same per profile                                       | Same                                       |
| Semantic invalidity                 | Fallback + recovery/write guard                                                                    | Reject, preserve, current unchanged                    | Reject, preserve, current unchanged        |
| Ambiguity                           | Same, marked ambiguity                                                                             | Same                                                   | Same                                       |
| Advisory only                       | Activate; expose optional advisory                                                                 | Load                                                   | Import                                     |
| Post-activation persistence failure | Accepted runtime + durability failure; recovery completes only when replacement checkpoint is safe | Loaded runtime + durability failure                    | Imported runtime + durability failure      |

## 60. Activation Matrix

| Condition                                  | Activate? |                                     Preserve original? |                               Explicit recovery? |
| ------------------------------------------ | --------: | -----------------------------------------------------: | -----------------------------------------------: |
| Valid current representation               |       Yes |                               Normal durable retention |                                               No |
| Valid normalized historical representation |       Yes | Preserve until any required durable migration succeeds | No for activation; migration evidence may remain |
| Advisory-only                              |       Yes |                                                 Normal |                                               No |
| Semantically invalid                       |        No |                                                    Yes |                                              Yes |
| Ambiguous references                       |        No |                                                    Yes |                                              Yes |
| Unsupported format                         |        No |                                                    Yes |                    Conversion/migration required |
| Corrupt/unreadable                         |        No |                                    Yes when accessible |                       Yes/restore another source |

## 61. Ownership Matrix

| Responsibility               | Local                                         | Profile                                | Backup                                 |
| ---------------------------- | --------------------------------------------- | -------------------------------------- | -------------------------------------- |
| Parse                        | Local persistence reader                      | Profile collection reader              | Backup parser                          |
| Version compatibility        | Future local format reader (currently absent) | Profile storage validator              | Backup validator                       |
| Normalization                | Initial-state compatibility layer             | Profile compatibility layer            | Backup compatibility layer             |
| Semantic validation          | Shared authored validator                     | Shared authored validator              | Shared authored validator              |
| Activation decision          | Store initialization policy                   | Store `loadProfile` policy             | Store import policy after parser facts |
| Recovery initiation          | App/user flow using retained store status     | Profile workflow                       | Backup workflow                        |
| Migration/conversion         | Dedicated migration subsystem                 | Dedicated migration/recovery subsystem | Converter producing separate result    |
| Persistence after activation | Store active persistence                      | Store active persistence               | Store active persistence               |

## 62. Recovery-State Matrix

| Recovery fact            |                                 Store infrastructure? |         Workflow-local? |           Persistent app awareness? |
| ------------------------ | ----------------------------------------------------: | ----------------------: | ----------------------------------: |
| Invalid local checkpoint |                                                   Yes |        Recovery actions |                                 Yes |
| Invalid selected profile |            Profile metadata may retain classification |                     Yes | No, unless used for active recovery |
| Invalid backup import    |                          No global retention required |                     Yes |                                  No |
| Unsupported format       | Yes for active local; collection metadata for profile |  Yes for profile/backup |           Yes only for active local |
| Ambiguous relations      |                  Included in applicable status/result | Yes for selected source |                Yes for active local |

## 63. Behavioral Invariants

1. Normalize supported history before semantic validation.
2. Invalid/ambiguous history never silently becomes current authority.
3. Preserve original source until explicit successful replacement/recovery or abandonment.
4. Activate complete authored snapshots atomically or not at all.
5. Advisories alone do not block activation.
6. Ingress classification, durability, and authored state remain separate.
7. Semantic invalidity, corruption, and unsupported format remain distinct.
8. Profile rejection preserves active state, Preview, profile, persistence intent, and subscribers.
9. Backup rejection preserves active state, Preview, external file, persistence intent, and subscribers.
10. Local fallback never silently overwrites the invalid checkpoint; retry respects the guard.
11. Explicit recovery establishes and validates a complete snapshot.
12. Reading/normalizing/validating never silently rewrites durable input.
13. In-memory normalization is not migration evidence.

## 64. Required Future Test Contract

Local tests: valid current and singular legacy activation; advisory acceptance; duplicate/ambiguous/structural/parse failures; deterministic fallback and retained status; exact raw preservation; no `setItem` from ordinary mutation/retry; reload repeats detection; explicit replacement success/failure; storage accessor failure remains distinct; injected initial state remains separate.

Profile tests: valid/current and singular legacy load; per-profile invalid/ambiguous rejection; active/Preview/durability/desired/subscriber invariance; source and collection preservation; one bad profile does not hide good profiles; unsupported/corrupt collection distinction; invalid profile export/delete.

Backup tests: valid/current and singular legacy import; parse/version/structure/semantic/ambiguity distinctions; advisory acceptance; no partial activation; active/Preview/persistence/subscriber invariance; external artifact unchanged; post-activation write failure classified only as durability.

Shared tests: identical normalized snapshot yields identical validator facts at every surface; deterministic issue ordering; migration output revalidates; recovery completion waits for durable replacement.

## 65. OccurrenceIdentity Implications

Invalid historical sources must not generate authoritative occurrences merely to obtain V1 identity. Valid activation restores normal V1 behavior. Recovery/remapping cannot silently redefine V1 provenance.

## 66. Source-Incarnation Implications

Profile/backup restoration and local migration can reintroduce prior IDs with uncertain lifetime continuity. Task 2.16 does not solve incarnation. Any recovery that renames/recreates sources must coordinate with the future V2/source-incarnation contract; durable cross-snapshot references remain unsafe.

## 67. PlanDecision Implications

Durable PlanDecision must wait for safe historical activation plus source-incarnation and durable occurrence-reference semantics. Decisions cannot safely migrate against rejected, ambiguous, or partially recovered authored sources.

## 68. Compatibility Assessment

Detection, atomic profile/backup rejection, and shared validator use can likely be added without changing authored durable schemas. Robust local preservation may require new recovery storage/metadata or status boundaries; that cannot be assumed schema-neutral. Existing singular readers and normalization remain required.

## 69. Architectural Alignment Assessment

The adopted contract aligns current and historical authority without erasing their distinction: one validator defines semantic fitness; compatibility explains old representation; each ingress owner controls activation; recovery preserves uncertain user data; durability continues to describe writes only.

## 70. Open Questions

**Unresolved/deferred:** exact local recovery artifact/key if moving beyond write blocking; transaction ordering for preserve-then-write; exact ingress-status/result TypeScript shapes; whether profile raw records require a parallel retained representation for listing; provenance schema; versioning for evolving semantic rules; user-facing recovery/export UX. These require implementation/design tasks and do not weaken the adopted activation policy.

## 71. Recommended Implementation Sequence

1. Define shared ingress classification plus surface-specific results without durable schema changes.
2. Implement atomic semantic validation for profile load and backup import, including collection preservation and caller handling.
3. Separately implement active-local raw detection, safe fallback, retained ingress status, and active-write/retry guard.
4. Add explicit recovery replacement/abandonment workflows and raw export/preservation.
5. Add only evidence-backed deterministic migrations/converters with provenance and revalidation.
6. Revisit durable semantic/version metadata before retiring compatibility readers or implementing durable PlanDecision.

## 72. Recommended Next Task

**Task 2.17 — Implement Non-Destructive Semantic Validation and Explicit Results for Profile Load and Backup Import.** This is bounded and lower risk because rejection can preserve an already-valid current state. Active-local recovery should follow as a separate task because checkpoint preservation and write blocking are a distinct prerequisite seam.

## 73. Deviations

None. No implementation, test, governance, durable format, key, compatibility-reader, migration, UI, checkpoint, or unrelated cleanup change was made.

## 74. Discoveries and Deferred Work

Current local/profile readers conflate several failures with absence/defaults, and profile validation silently filters records. Local/profile normalization can also drop malformed manual events. The active local payload is unversioned. These are material implementation discoveries, deferred under the task’s no-code rule. Prior cumulative Phase 2 worktree changes were preserved and are not Task 2.16 changes.

## 75. Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test -- --reporter=dot`: 26 test files, 417 tests passed.
- `npm run build`: passed; Vite transformed 46 modules.
- Task artifact SHA-256 and byte identity: confirmed in section 2.
- Executable/test files changed by Task 2.16: none.
- Governance files changed by Task 2.16: none.
- Only this separate result artifact was created.

## 76. Final Completion Determination

Task 2.16 is complete. All three ingress pipelines and failure classes are mapped; validator placement, activation, preservation, atomicity, fallback, write protection, status ownership, recovery completion, future tests, and dependency-correct implementation staging are decided. The immutable specification remains unchanged and no unauthorized implementation occurred.
