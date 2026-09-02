# Task 7.3 — Monthly Planner Contextual Authoring and Exact Source Navigation Result

## 1. Executive Result

Complete. Month now reaches the singular Event, Commitment, and Work authoring
workflows from selected-day context and exact read-model targets. It never writes
Preview geometry or retargets recreated sources.

## 2. Artifact Integrity

Immutable task copy SHA-256:
`d0d4ab8cbf310d7a006a1265900fde20031e6868553d186416264398e35794cc`.

## 3. Task 7.1 Prerequisite

Preserved: the pure Month model remains owner of date geometry, coverage, evidence,
and exact Commitment/Event/Work targets.

## 4. Task 7.2 Prerequisite

Preserved: the 35/42-cell grid, selected-day review, lazy Month, keyboard model, and
Plan/Review modes were extended rather than rebuilt.

## 5. Task 7.2C Bundle Governance Prerequisite

Applied unchanged. All hard limits and warning/review milestones remain governing.

## 6. Initial Workflow Audit

Commitment Add/Edit/Remove is owned by `CommitmentSection` over the shared SetupDraft;
`SetupScreen` owns Save Setup. Event Add/Edit/Delete is owned by `DayFrameApp`'s
singular manual-event mutation path and regenerates an existing Preview canonically.
Work Hours/Work Schedule are composite SetupDraft sections in lazy `SetupScreen`.
Review already supplied exact navigation patterns. No second writer was necessary.

## 7. Files Changed

`MonthlyPlannerSurface.tsx`, `DayFrameApp.tsx`, `CommitmentSection.tsx`,
`SetupScreen.tsx`, their tests, and Phase 7 governance/result documents.

## 8. Workspace Mode Architecture

Ephemeral modes are Review Day, Event editor, contextual Commitment editor, and
contextual Work. Commitment/Work content replaces the selected-day workspace while
the grid stays mounted; Event reuses the existing shell editor while Month stays
mounted. Mode state is not persisted.

## 9. Default Review Mode

Month entry defaults to the canonical selected-day review.

## 10. Selected-Day Change During Editor

An open editor remains bound to its original exact source; selection never retargets
it. Returning reveals the preserved/current selected-day projection.

## 11. One-Writer Assessment

Confirmed: Month adds navigation only. All mutations call existing writers.

## 12. Add Event Entry

Every selected day, including uncovered/generated-empty, exposes Add Event.

## 13. Add Event Context

The canonical user-day label seeds the existing Event date field; civil midnight is
never synthesized.

## 14. Add Event Save

The singular Event mutation runs, current Event truth reprojects, Month remains
mounted, and focus returns to the selected-day heading.

## 15. Add Event Cancel

Back to day clears the local editor without writing and restores selected-day focus.

## 16. Edit Event Entry

Current exact Event evidence exposes a target-specific accessible Edit Event action.

## 17. Event Revalidation

The current store is reread by Event ID plus incarnation before opening and while the
Month-origin editor remains open.

## 18. Recreated Event

A same-ID replacement with a new incarnation fails exactness and is never opened.

## 19. Event Unavailable

The workspace reports that the Event changed or is no longer available; substitution
is prohibited.

## 20. Event Save/Delete

Both use canonical immediate writes/regeneration. Save reprojects current truth;
delete leaves no Month token or selected ghost and returns stable focus.

## 21. Add Commitment Entry

Month header and selected-day actions open the existing lazy Commitment workflow.

## 22. Selected-Day Commitment Semantics

No date, weekday, preferred time, or one-off recurrence is inferred. The canonical
editor retains its default recurrence policy.

## 23. Commitment Editor Reuse

`SetupScreen` embeds the unchanged `CommitmentSection`; no Month form exists.

## 24. Commitment Lazy Loading

The existing Plan chunk is reused under Suspense. Month/grid remain visible and the
workspace reports loading.

## 25. Commitment Save Boundary

Typing remains local, Add/Update enters SetupDraft, Save Setup is durable, and schedule
refresh remains explicit.

## 26. Commitment Return

Outcome A was selected: after Add/Update the shared Plan workspace remains available
with visible unsaved status until Save Setup or Back to day.

## 27. Edit Commitment Entry

Commitment/Sleep and exact unplaced targets expose target-specific actions only when
the read model marks the source current.

## 28. Exact Commitment Revalidation

Template logical/incarnation and recurrence logical/incarnation IDs are all checked
against the latest SetupDraft after the lazy chunk loads.

## 29. Same-Incarnation Commitment

Field/title changes that preserve both incarnations remain editable.

## 30. Removed Commitment

No current exact pair means unavailable; nothing else is selected.

## 31. Recreated Commitment

Reused logical IDs with new incarnations fail and never retarget.

## 32. Commitment Unavailable

The established schedule-source unavailable language is reused and announced.

## 33. Commitment Save

Canonical SetupDraft and Save Setup behavior is unchanged; Preview is not refreshed.

## 34. Commitment Removal

The shared editor's canonical removal/lifecycle handling remains available; Month
reprojects current authored truth while stale schedule geometry remains truthful.

## 35. Goal-Link Boundary

No Month-specific Goal behavior was introduced.

## 36. Work Entry

Work evidence exposes Edit Work, never Edit Commitment.

## 37. Work Context

The target opens composite Work Hours/Work Schedule configuration, not an occurrence
authority.

## 38. Work UI Reuse

The existing lazy SetupScreen is embedded and focuses the Work heading.

## 39. Work Return

Back to day preserves Month context; durable changes still require Save Setup and
stale Preview still requires explicit refresh.

## 40. Schedule Preferences Boundary

Still available in shared Plan authoring; not cloned or specially migrated.

## 41. Planning Range Boundary

Still Plan-owned and unchanged.

## 42. Review-Day Actions

Event → Event editor; Commitment/Sleep → exact Commitment editor; Work → composite
Work; exact unplaced → Commitment editor; friction remains review-only.

## 43. Geometry Write Boundary

No time, occurrence body, cell, or empty interval writes Preview geometry.

## 44. Empty/Uncovered Actions

Add Event and Add Commitment remain available without implying free time.

## 45. Stale-Day Editing

Stale geometry stays visible. Only an exact current authored source can open.

## 46. Needs-Attention Boundary

Details and Review Schedule navigation remain; resolution was not migrated.

## 47. Friction Participant Navigation

No new participant inference was added. Exact evidence actions adjacent to friction
remain available; friction itself is unchanged.

## 48. Unplaced Navigation

Exact Commitment targets can be edited; no placement action exists.

## 49. Return to Review Day

All Month-origin workflows expose Back to day and preserve projection context.

## 50. Context Preservation

Displayed month and selected label are lifted into ephemeral application state and
restored across lazy/workflow transitions.

## 51. Profile Replacement

SetupDraft replacement closes an open Commitment editor through fingerprint
invalidation; no source is substituted.

## 52. Restore Replacement

The same current-source revalidation/fingerprint rule applies after restore.

## 53. Full Clear

Current-source removal closes Event/Commitment editing; stale targets cannot survive.

## 54. Protection

Protected readiness replaces Month with recovery-safe unavailable UI; no writable
empty editor is shown.

## 55. Lazy Load Race

The exact target remains pending until the lazy editor mounts and is checked against
the latest draft, so profile/restore/recreation during loading cannot retarget.

## 56. Loading State

Suspense renders a truthful Plan-authoring status inside the contextual workspace;
the Month grid remains mounted.

## 57. Focus

Event and Commitment first fields receive focus; Work focuses its heading; save,
cancel, unavailable, and Back return to stable headings/actions.

## 58. Accessibility

Modes have headings/regions, Back to day, textual statuses, labels/errors, and
target-specific names such as “Edit event X” and “Edit commitment Y.”

## 59. Mobile

The existing stacked Month layout holds the contextual editor below the grid. Browser
checks at 320/375/390/430px found document scroll width equal to client width.

## 60. Desktop

The existing grid/workspace split remains. Contextual Plan content occupies the
workspace rather than navigating to a disconnected full page.

## 61. Plan Preservation

Goals, preferences, range, advanced fields, Save Setup, and the full Plan mode remain.

## 62. Review Preservation

Generation, detailed visualizer, friction, Try, Apply Planning Change, and Event paths
remain fully reachable.

## 63. Migration Tracking

Month now owns contextual navigation for Add/Edit Commitment, Add/Edit Event, and Work.
Plan/Review retain configuration, generation, resolution, and detailed review.

## 64. Duplicate Writer Assessment

Only navigation/presentation is duplicated. Shared components and callbacks preserve
one writer per authority.

## 65. Bundle Architecture

Month remains lazy; Plan authoring remains its existing lazy chunk; Today/Summary are
unchanged. No editor implementation was copied into Month.

## 66. Initial-Gzip Review

161,467 bytes, 513 above baseline and 33 below warning. Growth is the bounded eager
orchestration needed to preserve Month context and exact Event invalidation. It is
justified but leaves very little warning headroom for future eager work.

## 67. Total-JS Review

755,909 bytes, +6,027; below the 800,000 growth-review milestone.

## 68. Largest-Lazy Review

51,852 bytes (Plan), +373 and well below warning/hard limits. Month is 24,194 bytes.

## 69. Runtime Dependency Assessment

None added.

## 70. Tests Added/Changed

Month actions/coverage, contextual application routing, canonical add editor/no date
inference, exact identity, focus/return, Work reuse, and all existing regressions run.

## 71. Focused Validation

MonthlyPlannerSurface, CommitmentSection, and DayFrameApp: 3 files/129 tests passed.

## 72. Full Validation

94 files/970 tests passed. ESLint, TypeScript, Prettier, and `git diff --check` passed.

## 73. Bundle Validation

Vite 8.0.10 transformed 116 modules; build/check passed with no warning or review
trigger.

## 74. Browser Commitment QA

Add opened the canonical lazy editor with daily recurrence and focused title; Month
remained visible; Back restored the exact selected label. Exact/recreated behavior is
deterministically integration-tested because browser fixture mutation of incarnation
IDs is not product-accessible.

## 75. Browser Event QA

Add used selected date; exact Event opened with target-specific name/focus; save and
Back retained Month. Add/edit/delete/all-day/timed canonical behavior is also covered
by integration tests.

## 76. Browser Work QA

Production fixture did not expose generated Work after an isolated reload; the exact
Work journey is covered by the deterministic generated-schedule integration test,
which confirms Month remains present and Work Hours opens.

## 77. Browser Uncovered QA

An uncovered selected day retained “Not generated” and exposed both Add actions; Event
truth appeared independently of Preview coverage.

## 78. Browser Stale QA

Deterministic integration/domain tests cover stale exact versus removed/recreated
sources; browser authoring retained explicit refresh semantics.

## 79. Browser Keyboard QA

Grid selection and all contextual buttons were keyboard-operable; Event/Commitment
fields received focus and Back returned to stable Month context.

## 80. Browser Mobile QA

320, 375, 390, and 430px passed with grid/workspace present and no horizontal page
overflow; 1024px split behavior also passed.

## 81. Slow-Load QA

Throttled production QA confirmed the Month grid/contextual region stayed visible and
the loaded Commitment editor focused `commitment-title`. Exact post-load checking is
covered by the same production path plus race tests.

## 82. Governance Updates

Result, checkpoint, Current State, Roadmap, and Changelog updated.

## 83. ADR Determination

No ADR. No new authority or enduring semantic rule was discovered.

## 84. Deviations

The singular Event editor remains in its established shell panel rather than being
cloned into selected-day markup; Month remains mounted alongside it. Recreated-source
and Work production-browser fixtures were not safely constructible, so deterministic
integration tests provide those required proofs. No semantic deviation occurred.

## 85. Discoveries

Embedding the shared Plan component preserves one writer and lazy loading, but initial
gzip is now only 33 bytes below warning. Task 7.4 should treat eager-shell growth as a
first-class constraint.

## 86. Deferred Work

Friction resolution, Try/Apply, generation migration, Goals/preferences/range
migration, and final Plan/Review retirement remain deferred.

## 87. Workspace Mode Matrix

| Mode            | Entry             | Canonical owner     | Exit            | Durable workspace? |
| --------------- | ----------------- | ------------------- | --------------- | -----------------: |
| Review Day      | Month selection   | Month projection    | action          |                 No |
| Add Commitment  | Month action      | SetupDraft workflow | Back/Plan draft |                 No |
| Edit Commitment | exact occurrence  | SetupDraft workflow | Back            |                 No |
| Add Event       | selected user-day | Event authority     | Back            |                 No |
| Edit Event      | exact Event       | Event authority     | Back            |                 No |
| Work            | Work evidence     | authored Work setup | Back            |                 No |

## 88. Contextual Action Matrix

| Evidence/state      | Action          |     Exact target? | Schedule write? |
| ------------------- | --------------- | ----------------: | --------------: |
| selected day        | Add Event       |      date context |              No |
| Month               | Add Commitment  |                No |              No |
| Commitment/Sleep    | Edit Commitment |               Yes |              No |
| Event               | Edit Event      |               Yes |              No |
| Work                | Edit Work       | composite context |              No |
| friction            | Review only     |               N/A |              No |
| unplaced Commitment | Edit Commitment |               Yes |              No |
| empty interval      | None            |               N/A |              No |

## 89. Exact Target Matrix

| Source     | Exact fields                              | Revalidate after load? |     Replacement allowed? |
| ---------- | ----------------------------------------- | ---------------------: | -----------------------: |
| Commitment | template + recurrence logical/incarnation |                    Yes |                       No |
| Event      | ID + incarnation                          |      Yes/current-store |                       No |
| Work       | composite context                         |              As needed | No false singular target |

## 90. Save/Write Matrix

| Action                |   Local | SetupDraft |    Durable |             Preview | Auto-refresh |
| --------------------- | ------: | ---------: | ---------: | ------------------: | -----------: |
| type Commitment       |     Yes |         No |         No |           unchanged |           No |
| Add/Update Commitment | cleared |        Yes |         No |            existing |           No |
| Save Setup            |      No |     commit |        Yes |     stale on change |           No |
| Add/Edit Event        |  editor |        N/A |  immediate | canonical semantics |    canonical |
| Edit Work             |    form |        Yes | Save Setup |    stale after save |           No |
| Month selection       |      No |         No |         No |           unchanged |           No |

## 91. Staleness Matrix

| Geometry  | Source    | Edit? | Result                |
| --------- | --------- | ----: | --------------------- |
| fresh     | exact     |   Yes | exact editor          |
| stale     | exact     |   Yes | current source editor |
| stale     | removed   |    No | unavailable           |
| stale     | recreated |    No | unavailable           |
| uncovered | none      |   N/A | Add actions only      |

## 92. Return/Focus Matrix

| Action                   | Return                    | Focus                       |
| ------------------------ | ------------------------- | --------------------------- |
| Event save/cancel/delete | selected Review Day       | created/stable heading      |
| Commitment Add/Edit exit | selected Review Day/draft | deterministic heading       |
| unavailable              | warning context           | warning/Commitments heading |
| Work exit                | selected Review Day       | selected-day heading        |

## 93. Responsive Matrix

| Width           | Month    | Editor             | Navigation                |
| --------------- | -------- | ------------------ | ------------------------- |
| 320/375/390/430 | compact  | stacked full-width | Back visible; no overflow |
| tablet          | adaptive | below/split        | visible                   |
| desktop         | split    | side workspace     | visible                   |

## 94. Loading Matrix

| Capability | Boundary              | Loading behavior                |            Revalidation |
| ---------- | --------------------- | ------------------------------- | ----------------------: |
| Commitment | Plan chunk            | workspace status; Month visible |                     Yes |
| Work       | Plan chunk            | workspace status; Month visible | composite current draft |
| Event      | existing eager writer | immediate                       |                     Yes |
| Month      | Month chunk           | existing boundary               |                     N/A |

## 95. Bundle Matrix

| Metric       |    7.2C |     7.3 | Status                 |
| ------------ | ------: | ------: | ---------------------- |
| Initial raw  | 630,499 | 633,562 | healthy                |
| Initial gzip | 160,954 | 161,467 | healthy; 33 to warning |
| Largest lazy |  51,479 |  51,852 | healthy                |
| Total JS     | 749,882 | 755,909 | below review           |

## 96. Migration Matrix

| Capability              | Before       | After                | Old path needed? |
| ----------------------- | ------------ | -------------------- | ---------------: |
| Add/Edit Commitment     | Plan/Review  | Month + shared paths |              Yes |
| Add/Edit Event          | Review/shell | Month + same writer  |        Temporary |
| Work                    | Plan/Review  | Month + shared Plan  |              Yes |
| friction/generation     | Review       | Review               |              Yes |
| Goals/preferences/range | Plan         | Plan                 |              Yes |

## 97. Authority Matrix

| Authority                                      | Month reads | Canonical workflow writes | New? |
| ---------------------------------------------- | ----------: | ------------------------: | ---: |
| SetupDraft/authored setup                      |  contextual |   shared forms/Save Setup |   No |
| Event                                          |         Yes |     singular Event writer |   No |
| Work setup                                     |  contextual |    shared Work/Save Setup |   No |
| Preview                                        |         Yes |                     Never |   No |
| PlanDecision/HistoricalPlan/Execution/Progress | No new read |                        No |   No |

## 98. Product-Boundary Matrix

| Capability                                                        | Result      |
| ----------------------------------------------------------------- | ----------- |
| Month Add/Edit Commitment/Event; Work; exact revalidation         | Implemented |
| direct geometry editing                                           | Prohibited  |
| friction/configuration migration; Plan/Review retirement          | Deferred    |
| Capacity/Allocation/Recommendations/Pattern/transition adaptation | Prohibited  |

## 99. Epistemic Matrix

| Evidence               | May enable          | Must not imply                |
| ---------------------- | ------------------- | ----------------------------- |
| exact Commitment/Event | source edit         | geometry edit/occurrence      |
| stale exact            | current source edit | fresh schedule                |
| recreated              | unavailable         | sameness                      |
| Work                   | configuration       | singular occurrence authority |
| uncovered              | Add actions         | free time                     |
| friction/unplaced      | exact source edit   | recommendation/placement      |
| saved setup change     | stale schedule      | recomputed schedule           |

## 100. Architectural Invariant Assessment

All 112 invariants are Implemented, Preserved, Covered by test/browser QA, Deferred,
or Prohibited as specified. Exactness, one-writer, projection, temporal/coverage,
SetupDraft, Event, Work, staleness, lazy loading, focus, responsive, dependency, and
bundle invariants are green. Deferred items are precisely the declared 7.4/later
boundaries; none is silently implemented.

## 101. Stop-Condition Assessment

No stop fired. Exact metadata and shared writers were sufficient; replacement races
are safe; mobile and bundle hard guards pass; total remains below 825,000; no new
dependency or friction migration was required.

## 102. Architectural Alignment Assessment

Aligned: users edit intent through existing authority workflows and DayFrame rebuilds
schedule geometry only through established explicit/canonical paths.

## 103. Task 7.4 Readiness

Ready. Source authoring, exactness, context preservation, invalidation, keyboard/mobile
behavior, tests, browser QA, and hard bundle guards are green.

## 104. Recommended Next Task

Task 7.4 — Monthly Planner Attention, Resolution, and Planning Configuration
Migration Audit/Implementation.

## 105. Final Completion Determination

Task 7.3 complete. Month is now a useful contextual source-authoring workspace without
becoming schedule or authored authority.
