# Task 1.3 Result — Resolve PreviewScreenContainer Architectural Status

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.3  
**Result date:** 2026-08-10  
**Execution status:** Investigation complete; determination awaiting project review

## Final classification

**Obsolete Implementation Structure**

`PreviewScreenContainer` has no supported production, alternate-entry,
compatibility, package-export, or external API path in the inspected repository.
Its sole executable caller is its dedicated test. Its adapter behavior is duplicated
or superseded by the production `DayFrameApp` → `PreviewScreen` path, and no unique
supported architectural responsibility remains.

This classification authorizes no deletion under Task 1.3. Removal requires a
subsequent implementation task.

## Status report

| Question | Evidence | Determination |
| --- | --- | --- |
| Production reachable? | `code/src/main.tsx` is the sole bootstrap and imports/renders `DayFrameApp`. Repository-wide source inspection found no production import, dynamic import, route, navigation target, or bootstrap reference to the container. `DayFrameApp` renders `PreviewScreen` directly. | **No.** It is outside the production import graph. |
| Export reachable? | `code/package.json` defines no `exports`, `main`, module, or library API. No barrel/index module exists under `code/src`; repository-wide inspection found no re-export. The component's `export` declarations are only file-local module exports, consumed by its test. | **No.** There is no indirect or external supported export surface. |
| Unique behavior? | The container subscribes with `useSyncExternalStore`, reads Preview, resolves effective day-boundary preferences, supplies `now`, and timestamps/directly dispatches fixes. `DayFrameApp` subscribes to the same store, resolves the same preferences, supplies the same Preview/time inputs, and dispatches fixes. It additionally supplies range warnings/selection and routes `changeFixedTime` to Setup focus instead of dispatching it as a proposal-only revision. | **No supported unique behavior.** Its subscription mechanism is an isolated implementation variation; the primary path supersedes its adapter responsibility and has more complete workflow behavior. |
| Test responsibility? | Four tests instantiate the container directly with a test-only store. They prove current Preview rendering, response to a published snapshot, timestamp injection, and direct wiring of every friction action. No test reaches it from `main`, `DayFrameApp`, routing, or an exported API. | **Isolated reusable-adapter/historical behavior**, not supported production or compatibility behavior. |
| Compatibility responsibility? | No compatibility flag, legacy bootstrap, migration path, conditional import, public type import, or downstream repository consumer was found. Persistence and backup compatibility do not reference the component. | **None demonstrated.** |
| Removal impact? | Production import graph and runtime behavior: none. Direct impact: delete the component module and its dedicated test; its colocated `PreviewScreenStore` and props types disappear. Historical audits/hydration documents contain references that would need contextual review, but those references do not create executable support. Test count would decrease by four. | **Small, bounded, and non-production**, subject to a separately authorized removal task and validation. |

## Investigation completed

The investigation covered:

- all repository references to `PreviewScreenContainer` and `PreviewScreenStore`;
- the only application bootstrap (`code/src/main.tsx`);
- `code/index.html`, package metadata, TypeScript/Vitest/ESLint/build configuration,
  and the absence of routing, barrels, package exports, or alternate entry modules;
- the component implementation and all four direct tests;
- the primary `DayFrameApp` store subscription, preference adaptation, direct
  `PreviewScreen` rendering, Preview range inputs, and suggested-fix workflow;
- current, hydration, audit, archive, and prior Task 1.1/1.2 documentation mentions;
- the production build and relevant Preview/application tests.

## Behavior comparison

| Adapter responsibility | `PreviewScreenContainer` | Supported `DayFrameApp` path |
| --- | --- | --- |
| Observe store | `useSyncExternalStore(getState, subscribe)` | `getState` initial snapshot plus `subscribe` effect |
| Preview input | `state.preview` | `stateSnapshot.preview` |
| Effective day boundary | Same effective-preference resolver and state inputs | Same effective-preference resolver and state inputs |
| Current time | Injected/default `getNow` | Injected/default `getNow` |
| Ordinary proposal fix | Adds revision timestamp and dispatches store action | Adds revision timestamp and dispatches store action |
| Fixed-time review | Dispatches it to the store like every other action | Resolves the template, navigates to Setup, and focuses fixed start time |
| Range warnings/selection | Not supplied | Supplies warnings and selected visible range |

The `useSyncExternalStore` choice is technically distinct, but no supported caller
uses it and no export contract exposes it. A distinct unused mechanism is not, by
itself, a supported architectural responsibility.

## What the tests prove—and do not prove

The tests prove that the orphan adapter remains executable in isolation. They also
prove that its direct-action wiring differs from the supported fixed-time workflow:
the test expects `changeFixedTime` to reach `applySuggestedFixToPreview`, while the
production app intercepts a resolvable fixed-time recommendation and moves the user
to Setup.

The tests do not prove production reachability, alternate-entry support,
compatibility, package API stability, or integration with the current application
shell. Audit documents cite these tests as behavioral evidence for Preview
revision; that evidentiary use does not turn the tested component into a supported
runtime path.

## Smallest safe subsequent removal boundary

A subsequent authorized task can:

1. delete `code/src/ui/PreviewScreenContainer.tsx`;
2. delete `code/src/ui/tests/PreviewScreenContainer.test.tsx`;
3. review active hydration/status documentation so it no longer presents the
   container as a current UI-foundation path;
4. preserve historical audit records or annotate them according to documentation
   governance rather than rewriting historical evidence;
5. run lint, type checking, the remaining Preview/DayFrameApp suites, the full test
   suite, and the production build.

No replacement production implementation is required. The removal task must not
move the container's all-actions-direct behavior into `DayFrameApp` because that
would regress the supported fixed-time focus/navigation flow.

## Discrepancies and uncertainty

- `docs/hydration/Phase_1_1_6_Hydration.md` describes the container as the
  store-to-UI bridge. Executable entry paths no longer match that description;
  `DayFrameApp` is the active bridge. The document supplies historical intent, not
  current reachability.
- Several audits cite the container tests as evidence for suggested-fix behavior.
  The current production app provides that behavior for proposal-only actions, but
  fixed-time review now follows the richer Setup-navigation path.
- External consumers outside this repository cannot be disproved absolutely.
  However, the project publishes no package/API export surface, and the task's
  repository-wide executable evidence standard provides no basis for treating
  hypothetical consumers as supported.

These points do not prevent classification under the task's defined categories.

## Validation performed

- Repository-wide reference and import/export inspection completed.
- Production, test-only, documentation, hydration, audit, and archive references
  distinguished.
- Relevant suites passed: `PreviewScreenContainer`, `PreviewScreen`, and
  `DayFrameApp` — 3 files, 66 tests.
- `npm run build` passed (TypeScript validation plus Vite production build).
- No production or test file was modified.
- The immutable Task 1.3 specification was not modified; its observed SHA-256 during
  execution was `0acecfa9ccd4538e4447516cbda40d1d63a25777de68f65ae5ac368a3a4d7eef`.

## Discoveries and deferred work

- Active hydration documentation is stale relative to the executable Preview path;
  address it with the authorized removal or a documentation-governance task.
- This investigation does not decide whether the primary app should eventually use
  `useSyncExternalStore`; that would be a separate behavior/architecture decision,
  not a reason to retain an unreachable component.
- All other Task 1.1 deferred findings remain out of scope.

## Recommended next task

**Task 1.4 — Remove the Obsolete PreviewScreenContainer Path** should authorize the
smallest removal boundary above, preserve the supported `DayFrameApp` Preview flow,
and reconcile active documentation references.

## Completion determination

Task 1.3 is complete as an investigation. The project can answer why the component
exists and whether it should continue to exist: it is a tested remnant of an earlier
store-connected Preview adapter, it is no longer reachable or exported, and it
should be removed in a separately authorized task after this result is reviewed.
