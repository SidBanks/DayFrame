# Task 1.32 — Establish Workflow-Level Durability Feedback, Retry Initiation, and Recovery Boundaries — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.32  
**Status:** Complete  
**Execution type:** Investigation / architectural contract decision

---

# 1. Executive Determination

DayFrame should adopt **immediate contextual feedback plus persistent app-level,
surface-specific durability feedback**. The initiating workflow interprets its
exact mutation result immediately. A persistent application surface remains visible
after navigation while active state or profiles are `unavailable`,
`storageFailure`, or `serializationFailure`, and offers explicit retry only for the
first two categories.

This model creates the first real production need for a separate durability
subscription: ordinary mutations and explicit retry can change retained durability,
retry deliberately sends no `DayFrameState` notification, and navigation clears
current local messages. The subscription should emit only immutable
`StoreDurabilityStatus`; UI must not inspect desired condition or persistence
helpers.

Runtime application and durable success must be communicated separately. A known
failure must never be described simply as “saved,” “imported,” or “cleared.” Retry
remains user/workflow initiated and store executed. Serialization failure crosses
from retry semantics into a separate recovery/diagnostic boundary.

This task changed documentation only.

# 2. Artifact Integrity

The immutable Task 1.32 attachment was verified complete at 1,579 lines and 37,403
bytes. It contains every required section and ends with the mandated completion
sentence. The saved project specification is byte-identical and unchanged.
SHA-256:

`8694547c5008c86ac7b4fb527a01466a5e94e56d712d583f6727481d99ae7af9`

# 3. Evidence Reviewed

Reviewed `DayFrameApp`, `SetupScreen`, all production store-method callers,
`DayFrameAppStore`, UI feedback state and placement, navigation/reset behavior,
relevant UI tests, store tests, Tasks 1.25–1.31, and the durable-data ADR.

Targeted executable validation covered 124 UI/store tests. Confirmed no production
retry caller, durability accessor consumer, or durability subscription exists.

# 4. Current Workflow Feedback

Current UI generally equates runtime application with durable success:

- Setup always says “Setup saved.”;
- profile save/load/delete always reports successful durable-sounding completion;
- valid backup import always says imported;
- clear always says local data was cleared;
- manual-event mutations show no durability result;
- persistence outcomes are ignored everywhere; and
- navigation/message resets erase workflow feedback while store status persists.

This is confirmed current behavior, not the recommended contract.

# 5. Persisting Workflow Caller Inventory

| Caller/workflow | Store operation | Current result use | Current feedback/navigation |
| --- | --- | --- | --- |
| Setup Save | `commitAuthoredSetup` | Uses `state`, ignores persistence | Always “saved”; stays in Setup |
| Generate from draft | `commitAuthoredSetup` | Uses `state`, ignores persistence | Suppresses save message; opens Preview |
| Manual event create/edit | `setManualEvents` | Ignores result | Editor/runtime update; regenerates Preview if present |
| Manual event delete | `setManualEvents` | Ignores result | Closes edit/delete state; regenerates Preview |
| Profile save | `saveProfile` | Ignores result | Always says saved; clears name |
| Profile load | `loadProfile` | Ignores result | Says loaded; opens Setup |
| Profile delete | `deleteProfile` | Ignores result | Says deleted |
| Backup import | `importBackup` | Ignores result | Says imported; opens Setup |
| Clear | `clearLocalData` | Ignores all outcomes | Always says cleared; opens Setup |
| Demo-store seeding | four active setters | Ignores results | Startup/internal; no contextual feedback |

Export creates/downloads a backup but does not persist either store surface; its
download-completion semantics remain outside this durability contract.

# 6. Immediate Result Consumption

Normative rule:

> **The workflow that initiated a mutation uses that operation's returned
> persistence/removal outcome for immediate feedback; it does not re-read retained
> status to reconstruct what that operation did.**

Every user-facing caller above must eventually stop ignoring its result. Immediate
feedback distinguishes runtime application from durable success and carries the
workflow context needed for save versus delete versus import language.

# 7. Retained Durability Consumption

Retained status answers whether a surface still needs attention after the initiating
workflow ends. An app-level durability surface should read the initial accessor
snapshot, then observe a dedicated subscription. It clears or changes feedback only
when that surface's retained status changes, including through ordinary convergence
or explicit retry.

`unknown` is not a failure and should not create user feedback. `durable` clears
persistent failure feedback but needs no permanent positive badge.

# 8. Candidate Feedback Models

- **Contextual only:** strong immediate relevance, but failure disappears on
  navigation. Rejected as incomplete.
- **Global only:** durable visibility, but loses operation meaning such as failed
  deletion versus failed save. Rejected as insufficient alone.
- **Contextual immediate + global persistent:** preserves both facts and gives
  retained status a truthful consumer. Adopted.
- **Contextual + dedicated recovery surface:** useful later for non-retryable
  recovery, but weaker discoverability for ordinary failures unless paired with a
  persistent entry point. Deferred as a recovery extension.

# 9. Feedback Decision Matrix

| Model | Immediate Context | Failure Survives Navigation | Reactive Subscription Needed | Surface Context | UI Complexity | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| Contextual only | Strong | No | No | Strong | Low | Reject alone |
| Global only | Weak | Yes | Yes | Surface-level only | Medium | Reject alone |
| Contextual + global persistent | Strong | Yes | Yes | Strong immediately and by surface later | Medium | **Adopt** |
| Contextual + recovery surface | Strong | Via destination/entry point | Likely for entry visibility | Strong | Medium-high | Defer as recovery extension |

# 10. Recommended Workflow Feedback Contract

```text
mutation
  → runtime applied
  → exact persistence outcome
  → contextual workflow classification
       durable success / retryable session-only / recovery-required
  → retained status independently drives persistent surface warning

user requests retry
  → store executes surface retry
  → workflow interprets retry result
  → durability subscription updates persistent status
```

Workflow success language may claim durable save only for `persisted`/`removed`.
Other outcomes must explicitly preserve the runtime-success fact without implying
reload safety.

# 11. Storage-Failure Feedback

Classify as runtime applied, durable save/removal failed, retry available. Show
immediate contextual warning/error with a user-triggered retry affordance and retain
a surface-specific persistent warning. Do not infer quota, permission, or cause.

# 12. Storage-Unavailable Feedback

Classify as usable session-only state, durability unavailable, retry available.
Feedback should explain reload/exit risk conceptually and remain persistent. It may
be less fault-oriented than storage failure but cannot be silent or described as
saved.

# 13. Serialization-Failure Feedback

Classify as runtime applied but non-durable and **ordinary retry unavailable**.
Present a non-retryable application/data-integrity condition with a recovery entry
point when one exists. Do not offer the normal retry control or ask the user to
repeat unchanged data blindly. Exact recovery design is deferred.

# 14. Setup Save Semantics

| Outcome | Workflow meaning | Retry/later visibility |
| --- | --- | --- |
| `persisted` | Runtime applied and Setup durably saved | Positive contextual confirmation; no persistent warning |
| `unavailable` | Runtime applied for session only | Active retry; persistent active warning |
| `storageFailure` | Runtime applied; durable save failed | Active retry; persistent active warning |
| `serializationFailure` | Runtime applied; cannot encode current snapshot | Recovery-required; persistent active warning |

# 15. Setup Navigation Semantics

Durability failure must not roll back state or categorically block navigation.
Generate Preview may continue from authoritative session state, but must not
suppress the failure: contextual feedback should be shown before/through transition
and the global warning must survive in Preview. Explicit Setup Save remains in
Setup. Serialization failure warrants higher-severity recovery guidance but still
does not invalidate runtime scheduling semantics.

# 16. Manual-Event Semantics

Create/edit/delete remains applied to runtime and Preview regeneration may continue.
The editor/day-details workflow should immediately report whether active persistence
succeeded. On failure, the event may remain visible but must be identified as
session-only/non-durable; deleting an event must warn it may return after reload.
Active retry is available except for serialization failure. Persistent active
feedback survives editor closure.

# 17. Profile Save Semantics

Only `persisted` permits a durable “profile saved” claim. On failure, the runtime
profile remains visible but must be described as non-durable/session-only. Profile
retry is offered for unavailable/storage failure. Profiles' stronger user-artifact
role justifies explicit contextual feedback plus persistent profile warning.

# 18. Profile Delete Semantics

On persistence failure the runtime profile disappears, but the durable profile may
return on reload. Contextual feedback must describe incomplete durable deletion,
not success. Profile retry re-attempts the latest complete collection. The global
profile warning remains until convergence or recovery.

# 19. Profile Load Semantics

Loading succeeds for the session even if active persistence fails; the source
profile remains a recovery source. Feedback should distinguish “loaded into current
session” from “current active setup durably saved.” Active retry is offered when
eligible. Opening Setup remains appropriate and the persistent active warning
survives navigation.

# 20. Backup Import Semantics

Validation and runtime import may succeed while active persistence fails. Feedback
must split those facts. The external backup remains a recovery source; active retry
uses current runtime state rather than re-importing it. The app may open Setup, but
the active warning persists.

# 21. Clear Semantics

The workflow must consume the complete `ClearLocalDataResult`:

- `cleared`: runtime reset and both durable removals confirmed;
- `partiallyCleared`: runtime reset but exactly one surface removal unconfirmed;
- `notCleared`: runtime reset but neither removal confirmed.

Runtime reset is always communicated separately from durable deletion. Generic full
success language is forbidden for partial/not-cleared results.

# 22. Partial-Clear Semantics

Feedback must identify active state and/or profiles as unresolved from their exact
outcomes. Offer only the corresponding surface retry methods, which preserve absent
intent. There is no aggregate retry. Both unresolved surfaces may appear in one
combined persistent warning, but actions and status remain surface-specific.

# 23. Retry Initiation

> **Ordinary retry originates from an explicit user action in the immediate
> contextual failure UI or persistent durability surface; `DayFrameStore` alone
> selects input, executes the surface-specific retry, maps status, and returns the
> result.**

No workflow replays the original domain command and no hidden automatic retry is
recommended.

# 24. Retry Result Handling

| Retry result | Workflow meaning | User-facing classification |
| --- | --- | --- |
| attempted + `persisted` | Current snapshot now durable | Success; clear failure feedback |
| attempted + `removed` | Intended absence now durable | Success; clear failure feedback |
| attempted + `unavailable` | Still session-only/unremoved | Retryable unavailable |
| attempted + `storageFailure` | Attempt failed at storage boundary | Retryable failure |
| attempted + `serializationFailure` | Current snapshot cannot encode | Transition to recovery-required |
| notAttempted + `alreadyDurable` | Surface converged before action | Benign success/complete |
| notAttempted + `unknown` | Retry control had no valid failed operation | Hidden contract race/internal no-op |
| notAttempted + `serializationFailure` | Blind retry prohibited | Recovery-required |

# 25. Retry From Already-Durable

Treat as benign completion, not an error. A control may race with ordinary
convergence or another retry. Remove/disable the retry action and reflect durable
state without exposing internal “not attempted” terminology.

# 26. Retry From Unknown

User-facing retry controls should never be offered for unknown. If returned because
of a stale/racing control, treat it as an internal workflow-state mismatch, refresh
from retained status, and avoid confusing user copy. Do not force persistence.

# 27. Retry-To-Recovery Transition

An attempted snapshot retry producing serialization failure, or a pre-existing
serialization failure, immediately removes ordinary retry eligibility and changes
the workflow classification to recovery-required. Repeated storage/unavailable
failures remain eligible but must never loop automatically; the user may later
choose an authorized preservation/recovery path.

# 28. Recovery Boundary

> **DayFrame leaves ordinary retry when establishing the unchanged current desired
> condition is invalid or insufficient—at minimum on `serializationFailure`, and on
> unsupported/malformed durable data or an explicit user choice to restore/export a
> different representation.**

The store owns facts and retry. The workflow communicates and offers entry into a
separately designed recovery flow. Recovery performs only explicit user-authorized
repair, export, reset, restore, or conversion. No specific serialization recovery
mechanism is authorized by current evidence.

# 29. Read/Hydration Recovery Separation

Startup accessor exceptions, malformed data, and unsupported versions occur before
ordinary workflow mutation feedback and are not solved by the app-level retry UI.
They require a separate lifecycle/read-recovery contract under the ADR. Task 1.32
does not normalize or hide them.

# 30. Persistent Discoverability

Failure must remain discoverable until that surface becomes durable or enters an
explicit recovery resolution. Closing an editor or navigating must not clear it.
Successful ordinary persistence or explicit retry clears the corresponding warning
through retained status. Local contextual messages may expire without erasing the
global fact.

# 31. Subscription Determination

> **Yes. The adopted model creates a real production need for a separate durability
> subscription.**

Future contract:

```ts
subscribeDurability(
  listener: (status: StoreDurabilityStatus) => void,
): () => void;
```

The app-level durability surface reads `getDurabilityStatus()` initially and
subscribes to immutable status snapshots. Emission is required when either retained
surface value changes through ordinary persistence, clear, or retry. It must not
include `DayFrameState`, desired condition, operation results, history, or UI text.

Polling is wasteful and race-prone. Piggybacking state subscription fails because
retry intentionally changes durability without state and would corrupt the runtime
subscriber contract. Manually updating UI at every caller distributes retained
truth and misses future callers.

# 32. Global Versus Contextual Feedback

Adopt both with non-duplicative roles: contextual feedback explains the operation;
global feedback preserves surface status and recovery/retry access. The global
surface appears only for failure categories, not `unknown` or ordinary `durable`.

# 33. Surface-Specific Feedback

Active state and profiles remain separately named because risk and retry action
differ. A combined presentation is allowed when both fail, but it must retain two
statuses and two surface-specific actions. Desired `snapshot | absent` remains
store-private routing data and is not a UI branching input.

# 34. Ownership Map

| Responsibility | Owner |
| --- | --- |
| Produce factual persistence/removal outcome | Persistence helper |
| Apply runtime mutation and retain status | Store |
| Select retry source/operation and execute | Store |
| Classify outcome as durable/retryable/recovery-required | Shared workflow semantic policy based on store types |
| Present contextual operation meaning | Initiating workflow |
| Present persistent surface status | App-level durability surface |
| Initiate retry | User action through workflow/global surface |
| Interpret retry result for feedback | Initiating UI workflow/shared semantic policy |
| Decide/perform recovery | User-facing recovery flow under separate contract |
| Emit durability changes | Store durability subscription |
| Migration/read recovery | Dedicated migration/read lifecycle boundary |

Normative ownership statement:

> **Store contracts define factual outcomes and retry eligibility; shared workflow
> policy classifies those facts; the initiating or app-level UI decides contextual
> presentation without reinterpreting persistence mechanics.**

# 35. ADR Alignment

| Principle | Alignment |
| --- | --- |
| Failure transparency | Known failure cannot be called saved/imported/cleared |
| User-data preservation | Runtime remains available and reload risk is visible |
| Non-destructive recovery | Retry does not replay commands; recovery is explicit |
| Retryability | Eligible failures have user-triggered store retry |
| Deterministic ownership | UI never selects payload/helper |
| Runtime/durability separation | Contextual language reports both dimensions |
| Recovery continuity | Source-backed workflows retain profile/backup context |
| Epistemic integrity | Unknown is not failure; causes are not guessed |

# 36. Implementation Consequences

Dependency order:

1. add and test a store-level `subscribeDurability` boundary only;
2. introduce shared outcome-to-semantic classification usable by workflows and the
   persistent surface, without final product copy;
3. update every caller to consume immediate mutation/clear results contextually;
4. add one app-level surface-specific persistent indicator consuming the accessor
   and subscription;
5. connect explicit active/profile retry actions and interpret their results;
6. separately investigate serialization and read/hydration recovery.

The smallest next seam is subscription infrastructure. Combining all UI workflows
in one task would obscure distinct semantics and test boundaries.

# 37. Unresolved Questions

Exact copy, visual placement, announcement/accessibility behavior, whether the
global surface is banner versus status region, and the concrete serialization
recovery mechanism remain unresolved. These are implementation/product decisions
after the semantic and subscription boundaries exist.

No unresolved question blocks the adopted workflow contract.

# 38. Deviations

No deviations. Only this separate result artifact was created; no executable,
test, governance, ADR, checkpoint, or prior-task artifact changed.

# 39. Discoveries and Deferred Work

- Generate Preview currently performs an implicit Setup save and suppresses its
  message, making persistent feedback essential.
- Manual events have no current success/error channel despite reload-loss risk.
- Profile deletion and clear require operation-specific language because durable
  data can reappear.
- Demo seeding is a production persistence caller but not a user workflow;
  app-level retained status is its appropriate feedback route.
- Exact UI copy, durability subscription implementation, workflow consumption,
  retry controls, recovery, and read/hydration handling remain deferred.

# 40. Recommended Next Task

**Implementation Task 1.33 — Add a Store-Level Durability Status Subscription.**

It should emit immutable `StoreDurabilityStatus` snapshots only when retained values
change through ordinary writes, clear, or retry; expose unsubscribe; preserve
ordinary state subscribers; add no UI, copy, automatic retry, desired-condition
exposure, persistence change, or recovery behavior.

# 41. Validation

Investigation validation:

```text
Task artifact integrity
1,579 lines; 37,403 bytes; attachment and saved specification byte-identical
SHA-256 8694547c5008c86ac7b4fb527a01466a5e94e56d712d583f6727481d99ae7af9

npm test -- src/ui/tests/DayFrameApp.test.tsx src/state/tests/dayFrameStore.test.ts
Test Files  2 passed (2)
Tests      124 passed (124)

Caller audit
all production StoreMutationResult/ClearLocalDataResult callers inventoried
no production retry/status consumer or durability subscription found
```

Repository-standard validation:

```text
npm run lint
passed

npm run typecheck
passed

npm test
Test Files  22 passed (22)
Tests      298 passed (298)

npm run build
passed (TypeScript validation and Vite production build; 42 modules transformed)

git diff --check -- result artifact
passed
```

# 42. Final Completion Determination

Task 1.32 is complete from an investigation and architectural-contract standpoint.
DayFrame now has an evidence-backed contextual-plus-persistent feedback model,
surface-specific retry initiation and result interpretation, serialization recovery
boundary, partial-clear semantics, genuine durability-subscription requirement,
ownership map, and dependency-ordered implementation seam without any executable
change.
