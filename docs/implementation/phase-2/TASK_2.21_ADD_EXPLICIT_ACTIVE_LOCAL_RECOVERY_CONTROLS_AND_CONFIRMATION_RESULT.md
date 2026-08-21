# Task 2.21 — Explicit Active-Local Recovery Controls and Confirmation — Result

## 1. Executive Result

Completed. The persistent app-shell recovery region now exposes separately confirmed current-session replacement and active-only abandonment. The UI invokes only Task 2.20's named store commands, translates every result into truthful local feedback, and relies exclusively on store subscriptions for state, durability, and ingress convergence.

## 2. Artifact Integrity

The supplied execution artifact was complete: 40,825 bytes / 1,674 lines, SHA-256 `4cc03a5aa77854b879d464014c0201110a0e1060cec0455459d47d7f6f58fe04`. The saved project copy contained identical text plus one final newline: 40,826 bytes / 1,675 lines, SHA-256 `23312076b38303054c38f2c639ea38021e6b9940342a88c5425d09ef97a57c38`. `diff` confirmed no textual contract difference. Neither artifact was modified.

## 3. Implementation Completed

Added recovery controls, inline mutually exclusive confirmations, exact one-command handlers, result-to-product-copy mapping, source-preservation-aware warning copy, local outcome/reset behavior, protected active-Retry suppression, and focused UI tests.

## 4. Files Changed

Task-specific files:

- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- this result artifact

No store policy or CSS change was required. Earlier cumulative changes were preserved.

## 5. Recovery Surface Placement

Both actions live in the existing labelled “Saved setup needs recovery” app-shell region. No second panel, page, modal framework, or settings destination was created.

## 6. Control Eligibility

Controls render strictly from retained ingress `recoveryRequired`. Healthy, accepted, and no-source stores render neither action nor confirmation.

## 7. Replacement Control

The accessible/visible action is “Replace protected saved setup with current session,” clearly identifying source and destructive target rather than resembling Save or Retry.

## 8. Replacement Confirmation

Inline confirmation states that the current committed session—possibly including session edits, a loaded profile, or imported backup—will supersede the protected checkpoint only on success; failure preserves protection. It explicitly excludes unsaved editor drafts.

## 9. Abandonment Control

The distinct destructive action is “Abandon protected saved setup and reset.” It is not labelled Clear and is grouped with recovery truth.

## 10. Abandonment Confirmation

The stronger confirmation states that successful removal permanently removes the protected active checkpoint, resets active setup/session edits, preserves saved profiles, differs from Clear Local Data, and does not reset runtime on failure.

## 11. Confirmation Mutual Exclusivity

One local discriminant (`replace | abandon | null`) permits only one pending intent. Selecting either action replaces the other confirmation.

## 12. Cancel Semantics

Named cancel buttons clear only local confirmation. They invoke no command and alter no store, ingress, durability, runtime, or persistence state.

## 13. Store Command Invocation

Each named confirm handler invokes its corresponding Task 2.20 command once. It never calls retry, clear, persistence helpers, profile/backup APIs, validation, or direct storage.

## 14. Replacement Success Presentation

The handler does not infer or manually apply success. Store ingress subscription removes the persistent region after accepted transition. Runtime/Preview are untouched and no redundant success state survives disappearance.

## 15. Abandonment Success Presentation

Store state subscription supplies the reset snapshot and ingress subscription removes recovery awareness. The shell remains in place; existing Setup/no-Preview presentation naturally reflects defaults, while saved profiles remain listed.

## 16. `notResolved` Presentation

Failed durable replacement states that completion failed, the checkpoint remains protected, and current session remains available. Failed abandonment states that the checkpoint was not discarded and current session was not reset. Confirmation closes and a new deliberate selection/confirmation is required.

## 17. Serialization Failure Presentation

Replacement serialization failure is described as inability to prepare the current session for durable replacement, not as a guessed storage cause. Copy states current session remains and nothing was overwritten.

## 18. Invalid Replacement Presentation

The UI states that current session cannot yet be used, nothing was overwritten, and recovery remains unresolved. Raw issue codes and a new diagnostics panel are not exposed.

## 19. Source Changed Presentation

The UI states that saved setup changed after detection, no destructive action occurred, and review is required before trying again. The stale confirmation closes and no automatic retry occurs.

## 20. Source Unreadable Presentation

The UI states that the protected source cannot currently be read and no destructive recovery was attempted. It does not claim unchanged bytes and requires fresh selection/confirmation later.

## 21. Not-Recovery-Required Race Handling

A stale `notRecoveryRequired` result closes confirmation without error or loss claim. Current retained ingress remains the presentation authority.

## 22. Confirmation Re-entry After Failure

Every attempted/precondition failure closes confirmation. Choosing an action again merely reopens confirmation; the command is not called until a fresh confirm activation.

## 23. Persistent Awareness Copy

Copy now explains current/safe session authority, blocked active saving, reload risk, and the two explicit choices without duplicating full confirmation language.

## 24. Readable / Unreadable Source Distinction

When `sourcePreserved` is true, copy states the readable checkpoint remains preserved pending recovery. Otherwise it truthfully says DayFrame could not read/capture the original and the store may refuse recovery until it can read the source.

## 25. Durability Awareness Coexistence

Ingress and durability regions remain separate. A real recovery persistence failure may show both retained truths; local feedback summarizes the attempted action without collapsing their authority.

## 26. Active Durability Retry Suppression

While ingress protection exists, retryable active durability messaging remains visible but its ordinary active Retry button is suppressed because it cannot carry recovery authority.

## 27. Profile Retry Independence

Retryable profile durability continues to expose its independent Retry button during active recovery. Profile status and action were not suppressed or reclassified.

## 28. Profile Review-Then-Promote UX

Existing profile load continues to update current runtime while recovery remains. The single replacement action consistently promotes “current session”; no profile-specific recovery control was added.

## 29. Backup Review-Then-Promote UX

Existing backup import behaves equivalently. No “recover from backup” action or misleading protected-source backup label was added.

## 30. Preview Preservation

The UI performs no Preview clearing/regeneration around replacement. Store-owned replacement leaves reviewed Preview intact.

## 31. Abandonment Reset Presentation

The UI never resets before command success. On success, the ordinary state snapshot yields initial active fields and no Preview; no recovery-specific navigation is introduced.

## 32. Unsaved Draft Authority Preservation

Recovery handlers call neither `commitAuthoredSetup` nor `setManualEvents`; confirmation explicitly describes the committed current session and excludes unsaved editor drafts. Tests spy on both mutation boundaries.

## 33. Navigation Persistence

Recovery truth is app-shell state and remains across ordinary screen changes. Navigation does not clear ingress. Confirmation remains local to the persistent shell until cancelled, attempted, resolved, or store replacement.

## 34. Store Replacement Cleanup

The existing replacement-store effect unsubscribes old state/durability/ingress listeners, reloads all snapshots, and now also clears pending recovery confirmation/outcome. Tests prove stale confirmation disappears.

## 35. Accessibility

The labelled semantic recovery region remains. Actions and confirm/cancel controls have distinct full names; permanent abandonment/reset is conveyed in text rather than color alone. Immediate feedback uses a non-assertive status; raw internal identifiers are absent.

## 36. No Automatic Recovery

Production searches found exactly one handler call site for each store command, both behind named confirmation buttons. No effect, mount, subscription, navigation, profile/backup, mutation, or retry path invokes recovery.

## 37. No Raw Export / Repair Controls

No raw download/copy/export, repair, migration, conversion, profile recovery, or backup recovery control was added.

## 38. Tests Added or Updated

Updated the prior read-only awareness test and added focused tests for healthy visibility, replacement cancel/confirmation/success/unsaved-draft boundary, mutual exclusivity, abandonment success/profile preservation/reset, all replacement failure/precondition presentations, abandonment failure, active-Retry suppression/profile-Retry independence, unreadable-source copy, benign stale action, and store replacement cleanup. Focused UI count is recorded in validation.

## 39. Production Reference Audit

Audited both recovery command names, ingress consumers/subscription, active/profile Retry rendering, Clear, confirmation state, `localStorage`, profile/backup handlers, and automatic call candidates. Only the two intended confirm handlers call recovery; UI does not access storage or validation directly.

## 40. Store Policy Preservation

No changes were made to recovery result semantics, source recheck, ingress transitions, desired conditions, durability mapping, persistence helpers, or store types/implementation.

## 41. Durable Format Preservation

No key, field, schema, version, confirmation, outcome, ingress metadata, or recovery history was persisted.

## 42. Architectural Alignment Improvement

The full path is now retained recovery truth → explicit named choice → explicit confirmation → exactly one store-owned command → exact result presentation, while subscriptions remain sole authority for convergence.

## 43. Deviations

The saved artifact differed from the supplied artifact only by a trailing newline; this was recorded rather than modifying either immutable copy. No implementation deviation.

## 44. Discoveries and Deferred Work

Existing CSS patterns were sufficient. The active durability message can coexist truthfully with recovery while its ineligible button is hidden. Protected raw export, source reclassification, multi-tab coordination, repair/migration, source incarnation, OccurrenceIdentity, PlanDecision, recovery history, and broader governance remain deferred.

## 45. Recommended Next Task

Define the next bounded Phase 2 authority seam based on roadmap evidence. Protected raw-source export remains a separate candidate and should not be conflated with normal backup export.

## 46. Validation

- Focused `DayFrameApp` suite: 101 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Full suite: 26 files, 469 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed.
- Task artifact hashes/immutability: confirmed above.
- Exactly two production recovery command call sites: confirmed, one per named confirm handler.
- UI store-access/raw-export/repair/migration and prohibited architecture changes: none.

## 47. Final Completion Determination

Task 2.21 is complete. DayFrame exposes accessible, separately confirmed recovery actions only during active-local recovery, invokes only the two store authorities, presents every outcome truthfully, preserves draft/durability/profile boundaries, and adds no automatic or broader recovery behavior.
