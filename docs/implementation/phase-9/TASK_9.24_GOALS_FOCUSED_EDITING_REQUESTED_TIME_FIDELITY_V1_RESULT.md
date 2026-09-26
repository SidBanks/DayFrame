# Task 9.24 — Goals Focused Editing & Requested Time Fidelity V1 — RESULT

Date: 2026-09-22. Scope: existing Goal and finite Requested Time presentation and command orchestration.

## 1. Outcome

The Priority-only data-loss defect is repaired. Existing Goal/Requested Time editing preserves untouched semantic values, optional absence, exact links, resource choices, and historical revisions. Goals have a bounded searchable/status-filtered list and one focused detail. App-owned ephemeral context retains selection, drafts, disclosures, and list state through navigation. Stale revisions, partial acceptance, persistence retry, and late results have permanent regressions.

Production Chromium checks passed at 320, 390, 768, and 1280 CSS px, including reduced height and a disclosed CSS-zoom reflow approximation. The complete suite passes: **155 files / 1,560 tests**, including **20 new regression cases**. Formatting, lint, typecheck, build, bundle hard gates, and whitespace checks pass. Existing bundle advisories remain; they are not described as clean.

This is bounded existing-capability convergence. It does not implement the September Goal Lifecycle specification, new Structure authoring, or a Goal-scoped G2 inspector.

## 2. Authority, inputs, and protected baseline

The saved execution input is `TASK_9.24_GOALS_FOCUSED_EDITING_AND_REQUESTED_TIME_FIDELITY_V1.md` in this directory. It matches the supplied attachment byte-for-byte, includes §§1–18 and the final statement, and was not edited. Task discovery found no executed conflicting 9.24 assignment; the older projected Review Plan task is not an assignment override.

Actual repository inputs consulted:

- `docs/implementation/phase-9/TASK_9.23_GOALS_LIFECYCLE_PRODUCT_CONVERGENCE_READINESS_AUDIT_V1_RESULT.md`, particularly findings and §§5–6, 10–18. This is the actual renamed RESULT, not a guessed `PHASE_...` path.
- `docs/implementation/phase-9/TASK_9.21_ACCEPTED_PLANNING_SUMMARY_CONVERGENCE_V1_RESULT.md`: app-owned context, return navigation, stale-response protection, and distinct accepted iterations.
- `docs/implementation/phase-9/TASK_9.22_MY_SCHEDULE_CONVERGENCE_V1_RESULT.md`: focused editors, preservation, and mobile patterns.
- `docs/architecture/DayFrame_Product_Ontology_Vocabulary_Specification_V1.md` and relevant Appendix B entries in `docs/architecture/DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`.
- `docs/architecture/DayFrame_End_State_Compatibility_Retirement_Architecture_Specification_V1.md`.
- `docs/adr/ADR_GOAL_AUTHORITY_IDENTITY_LIFECYCLE_AND_COMMITMENT_LINK_MODEL.md`.
- `docs/architecture/GOAL_DEMAND_ALLOCATION_ARCHITECTURE_SPECIFICATION_RESULT.md` and `docs/implementation/phase-8/TASK_8.3_GOAL_DEMAND_PRIORITY_AND_PROJECTION_V1_RESULT.md`.
- `docs/implementation/phase-9/TASK_9.2.0_GOAL_DEMAND_RESOURCE_FOOTPRINT_ASSOCIATION_ARCHITECTURE_V1_RESULT.md`.
- `docs/adr/ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.
- `docs/architecture/DAYFRAME_GOAL_LIFECYCLE_ARCHITECTURE_SPECIFICATION_V1.md`, consulted as the boundary between implemented V1 commands and future accepted design.
- Executable Goal, Demand/Priority, resource-footprint, revision, ingress, durability, backup, and navigation contracts in current source/tests. The audit was navigation/evidence, not a replacement command contract.

Starting HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Actual starting status: **185 entries**; the audit's 183 was historical. No applicable `AGENTS.md` was found. There was no reset, stash, commit, push, or unrelated cleanup.

Before implementation, 979 distinct tracked/unignored files were copied and SHA-256 indexed under `/tmp/dayframe-924-baseline-RESULT/`. Baseline HEAD, status, and hashes are `head-RESULT.txt`, `status-RESULT.txt`, and `hashes-RESULT.json`. Task-relative comparison, rather than the much larger difference from HEAD, establishes this task's file scope. No baseline file was removed; only the five existing files listed in §12 changed. The remaining 974 baseline files match their captured hashes, including historical RESULTs, architecture, task inputs, and forensic artifacts.

Fresh baseline: **154 files / 1,540 tests**, 65.12 seconds; bundle measurements appear in §11. The preserved Dogfood Pass 02 state was not opened or mutated. Browser work used only `/tmp/dayframe-924-chrome-RESULT` and `http://127.0.0.1:4924`.

## 3. F1 root cause and correction

The previous form failed to represent preferred session minutes and interpreted an absent maximum as the requested effort. Every save rebuilt Demand, default Priority, and resource association, even when only Priority changed. Its replacement session object therefore dropped preferred minutes and authored an unintended maximum.

The first permanent regression used real canonical commands to create a 240-minute splittable request with minimum 30, preferred 60, and **no maximum**. It failed before implementation with the exact preferred-loss/maximum-240 difference. Evidence: `/tmp/dayframe-924-f1-before-RESULT.log`.

The repaired form represents optional preferred/maximum values as `undefined` until explicitly authored. Separate checkboxes distinguish authoring and deliberate clearing. Tracked intended fields select the existing command owner: a pure Priority change calls neither `reviseDemand` nor the resource-association command. This also works for a valid existing request with **unspecified** resource evidence: no association is invented or required for an unrelated Priority edit.

Demand replacement commands preserve the complete semantic subobjects. No validator, revision policy, domain record, or persistence format changed. Invalid combinations are rejected with retained input and an explanation; constraints are not silently clamped or erased.

## 4. Preservation matrix

| Value | Untouched behavior and evidence |
| --- | --- |
| Preferred and maximum absent | Remain absent; four present/absent combinations tested during a horizon edit. |
| Preferred and maximum present | Exact numbers retained, including under Priority-only save and closed advanced disclosure. Explicit check/uncheck authors/clears values. |
| Minimum and splitting | Loaded from canonical session; retained unless explicitly edited. Incompatible minimum/preferred/maximum fails without authority changes. |
| Requested effort and horizon | Reconstructed only for intended Demand edits; ordinary Priority does not create a Demand revision. |
| Satisfaction, partial minimum, session count | Complete canonical values retained during unrelated edits; permanent fixture uses partial target and four-session cadence. |
| Default Priority | Independent revision-checked command only when intended or needed for new-request creation. |
| Bounded Priority overrides | Exact history preserved; regression uses a critical interval override while changing default Priority/horizon. |
| Resource specification/revision/variant/optional IDs | Exact saved association retained; no re-authoring on unrelated changes. |
| Advanced support/protection geometry | Offset support and before-support Buffer fixture survives unchanged, including selected optional component. Simple controls replace resources only through an explicit resource edit. |
| Missing resource evidence | Stays unspecified on unrelated Priority edits; it does not become productive-only. |
| Goal description, target date, legacy measurement reference | Goal title uses a narrow patch; omitted metadata survives. Optional date remains genuinely optional. |
| Exact source links and unavailable evidence | Kind, source ID, and incarnation retained; title-edit regression verifies unavailable status after save. |
| Current measurement and observations | Remain under independent existing owners. Goal completion does not author Progress. Existing measurement/progress UI regressions remain. |
| Prior revisions, acceptance, realization, publication, execution | Ordinary editing does not invoke these downstream writes. Historical and Network+ regression suites remain intact and pass. |

## 5. List, focused editing, and navigation

Ordering is deterministic: active first, then case-folded title using English locale comparison, then Goal ID as the stable tie-breaker. All nonactive statuses share the latter ordering. Search trims/case-folds the title query; status filters cover all/active/completed/archived. Initially 10 matching rows render; Show more adds 10. Counts distinguish total, matching, and shown rows. Empty groups and no-match states are explicit. This bounds rendered rows, **not** storage I/O.

A 24-Goal permanent fixture verifies reverse-insertion sorting, 10/20-row bounds, reveal retention across unmount, search, status filtering, and draft survival when the selected Goal is excluded. List operations leave canonical Goal and planning authority unchanged.

One Goal editor and one request editor are shown at a time. Goal switching is explicitly disabled during a Goal draft until Save/Cancel. Request drafts are retained by Goal/request identity; switching requests or Goals does not put A's draft under B. External linked-Goal navigation queues an explicit discard/open or keep-editing choice if a Goal draft exists. An excluded selected Goal stays open with a visible explanation.

The small context helper is app-owned and presentation-only. It retains selection, search, filter, reveal count, Goal base snapshot/revision, request base snapshots, changed fields, open session/resource details, in-flight state, accepted identities, and known feedback. It has no domain imports or serialization and adds no durable draft storage. Existing Planner return navigation is reused; `plannerNavigation.ts` needed no change.

Browser and automated evidence verify Goals → Review Schedule → Back, plus Goal metadata drafts through Review Plan/Back. Existing Summary → Goal/Day → Back regressions also pass. After Goal Save/Cancel/Back, focus reaches the selected Goal heading; request success focuses Save; validation focuses the associated alert. No exact scroll-position or restart-surviving draft guarantee is introduced.

## 6. Stale, partial, persistence, and async outcomes

Goal edits retain the original expected revision and full base snapshot. Request saves compare the retained Demand snapshot with current canonical state and pass the original expected revision to the owner. Default Priority and resource association have their own saved bases. Concurrent or same-revision replacement differences fail safely; stale drafts are not silently rebased. Deliberate discard/reload adopts current canonical values.

Demand → Priority → resource specification → association remains a multistep sequence. Feedback identifies the failed step and preceding accepted steps, and explicitly says accepted work is not rolled back. Accepted Demand identity and pending resource specification selection remain attached to the originating draft. A failed association retry reuses the already accepted specification; a persistence retry saves accepted authority instead of repeating creation. The regression injects association rejection, then storage failure, then successful retry and asserts exactly one Demand, Priority, and specification creation and only the necessary association attempts.

Goal creation acceptance closes the creation editor and selects the returned canonical Goal. Pending durability gets separate feedback and the existing persistence-retry action. Synchronous busy checks prevent repeated unresolved submissions even before a React repaint. Goal and request late-save regressions retain authoritative results against A after navigation. Evaluation version/unmount guards prevent late A evidence from appearing under B. Navigation/search do not trigger evaluation, proposal, acceptance, realization, or publication.

Context invalidates for explicit clear and confirmed complete restore (or restore recovery-required). Rejected imports keep drafts. Setup profile loading preserves independent Goal drafts. Existing protected ingress disables saving, and current Goal availability/status is checked during multistep continuation. Replaced contexts ignore late presentation updates and cannot issue subsequent save steps. These are presentation safeguards over existing canonical mutation protection, not new authority semantics.

## 7. Permanent regression coverage

`code/src/ui/tests/GoalsFocusedEditing.test.tsx` contributes 20 test cases:

| Required area | Permanent evidence |
| --- | --- |
| 1–2. F1 and optional fields | Original failing F1; four optional combinations; explicit author/clear and invalid conflict; unspecified-resource Priority-only case. |
| 3–4. Metadata/resources | Narrow Goal title patch preserves legacy metadata and exact unavailable link; advanced geometry/selection and bounded override remain exact. |
| 5. Stale drafts | Concurrent Goal and Demand revisions keep user input, make no overwrite, and require explicit reload. |
| 6. Partial/persistence retry | Multistep rejection + storage failure + retry counts prevent duplicate accepted authoring; existing real storage-failure workflow remains. |
| 7–8. Pending/late operations | Repeated Goal and request saves issue one creation/revision; late A command accounted for; late A evaluation cannot replace B. |
| 9–11. Navigation/list | Route return retains request draft/disclosure/search/filter/focus; 24-Goal list retains reveal and dirty editor through filtering/unmount. |
| 12. Undated Goal | Pending-creation test creates an undated outcome with no Demand. |
| 13. Explicit completion | Completion changes Goal status without changing planning, setup/preview, measurement definitions, or observations. |
| 14. No implicit writes | Goal/planning snapshots unchanged under browse/filter; navigation spies assert no evaluation/proposal recording. |
| 15. Authority boundaries | Invalid context/protected owner; actual app clear and complete V14 restore; rejected import and profile load. |

Existing constructive planning tests were updated only for current UI labels, explicit optional maximum authoring, and accurate storage-failure wording. Their semantic assertions were retained. The full suite includes Network+ distinct accepted iterations, role/provenance, Progress, realization, and Summary return coverage.

## 8. Production browser/mobile acceptance

Final production build was served by Vite preview at port 4924. Headless Chromium used a fresh disposable profile and CDP. The final run cleared **only that disposable origin** before seeding exactly 24 Goals. Six undated Goals were created at each of the four widths; creation did not automatically create Requested Time. At each width the run exercised search and completed/archived/active filters, Goal editing, Measurement setup/access, recording a value, Requested Time/session/priority editing, advanced disclosure, canonical validation, Review/Back, Goal/request switching, and explicit draft discard. Supporting commitments remained ordinarily visible; the empty fixture had no commitments to link. Link/unlink semantics are covered by retained UI tests and unavailable-link preservation by the new regression.

| Viewport width | Document client width | Document scroll width | Initial visible Goal rows |
| ---: | ---: | ---: | ---: |
| 320 | 305 | 305 | 10 of 24 |
| 390 | 375 | 375 | 10 of 24 |
| 768 | 753 | 753 | 10 of 24 |
| 1280 | 1265 | 1265 | 10 of 24 |

The 15px difference is Chromium's vertical scrollbar. Equality of scroll/client width held for list, Goal save/cancel, selected request, open advanced controls, validation, and returned drafts. No global overflow clipping was added.

All measured visible Goal/planning primary buttons, inputs/selects, summaries, and effective checkbox label regions met at least 44 CSS px height (checked with a 43.5 rounding tolerance). Native checkbox glyphs are 20px inside at-least-44px labeled hit regions. Actions use native buttons/inputs/selects/details and require no hover, double-click, or right-click.

At **390 × 420**, keyboard Tab moved from Goal title to Description with a visible solid 3px outline. The focused textarea's rectangle was x=60, y=296.28125, width=255, height=44, within the reduced viewport. Save/Cancel/Back focus was recorded at each width. Invalid session saves focused `role=alert`; the request fieldset's `aria-describedby` pointed to that exact feedback element. Native invalid fields inside closed details open their containing disclosure. Text explains status independently of color.

At 640 × 800 with **CSS zoom=2**, document client/scroll width remained 625/625 and controls reflowed. This is a CSS-zoom approximation, **not browser-native zoom or physical-device certification**. No physical keyboard/soft-keyboard, screen-reader, or physical-device certification is claimed. CDP viewport emulation, DOM/control measurements, actual keyboard dispatch, screenshot inspection, and source inspection are distinguished here.

Read-only inspection of the disposable canonical database after the run found exactly 24 Goals and four authored Requests. All four remain revision 1, amount 240, minimum 30, preferred 60, and absent maximum after Priority saves, invalid edits, draft navigation, and discard. This confirms equivalent canonical semantics across widths; the unsaved 7/9-hour drafts did not leak into authority.

## 9. Browser artifacts

All evidence artifacts have `RESULT` in their names:

- `/tmp/dayframe-924-browser-RESULT.mjs`: CDP driver; `/tmp/dayframe-924-browser-RESULT.log`: final execution output.
- `/tmp/dayframe-924-browser-RESULT.json`: raw control/viewport/focus measurements and disposable canonical records.
- `/tmp/dayframe-924-mobile-summary-RESULT.json`: verified measurement and canonical summary.
- `/tmp/dayframe-924-{320,390,768,1280}-{create-undated,list24,saved-advanced,validation,back-draft}-RESULT.png`: 20 workflow screenshots.
- `/tmp/dayframe-924-390-reduced-height-RESULT.png` and `/tmp/dayframe-924-zoom2-RESULT.png`.

Representative inspected images: [320px validation](/tmp/dayframe-924-320-validation-RESULT.png), [reduced-height visible focus](/tmp/dayframe-924-390-reduced-height-RESULT.png), [desktop advanced controls](/tmp/dayframe-924-1280-saved-advanced-RESULT.png). Evidence is local-session material under `/tmp`, not a claim of committed or indefinitely retained artifacts.

Early driver attempts needed correction for lazy loading, native select label extraction, existing “Record New Value” wording, and a selector-escaping error. Exploratory retries initially accumulated disposable fixtures; the final run reset its own origin and verified exactly 24. These were driver issues, not hidden app acceptance failures. Localhost access initially returned sandbox `EPERM`; the approved escalation connected only to this disposable Chromium instance.

## 10. Commands and verification

Working directory for package commands: `/home/sid/Penn Digital Services/DayFrame/code`. Git/task-relative operations ran at repository root. No dependency was added or installed.

| Executed command | Final result / evidence |
| --- | --- |
| Baseline `npm run test` | 154 files / 1,540 tests; `/tmp/dayframe-924-baseline-tests-RESULT.log`. |
| Baseline `npm run build`, `npm run check:bundle` | Passed hard gates; corresponding `dayframe-924-baseline-{build,bundle}-RESULT.log`. |
| Focused F1 test before implementation | Intentionally failed once; preferred lost and maximum authored; `dayframe-924-f1-before-RESULT.log`. |
| Focused UI/navigation runs with `npx vitest run ... --maxWorkers=2` | Passed after repairs; `dayframe-924-focused-RESULT.log` and `dayframe-924-regressions-RESULT.log` (latest focused run: 2 files / 33 tests). |
| `npx prettier --write` on task-touched files only | No repository-wide formatting rewrite; `dayframe-924-format-RESULT.log`. |
| `npx prettier --check .` | Passed; `dayframe-924-prettier-RESULT.log`. |
| `npm run lint` | Passed; `dayframe-924-lint-RESULT.log`. |
| `npm run typecheck` | Passed; `dayframe-924-types-RESULT.log`. |
| `npm run test` | 155 files / 1,560 tests; `dayframe-924-tests-RESULT.log`. |
| `npm run build` | Passed; `dayframe-924-build-RESULT.log`. |
| `npm run check:bundle` | All hard gates passed; advisories below; `dayframe-924-bundle-RESULT.log`. |
| `git diff --check` | Passed; `dayframe-924-diff-RESULT.log`. |
| `npm run preview -- --host 127.0.0.1 --port 4924`, Chromium, CDP driver | Production browser acceptance passed as detailed above. |
| Baseline SHA-256 comparison, attachment byte comparison | Scoped file preservation and immutable input verified; `dayframe-924-task-relative-RESULT.json`. |

Intermediate failures were resolved: the initial F1 failure drove the implementation; existing workflow expectations were updated for explicit optional limits/new labels; test fixtures were corrected to provide valid command input and canonical ISO timestamps; lazy component waits and disclosure events were corrected. No supported semantic assertion was removed to make the suite pass.

## 11. Bundle measurements

| Measure | Fresh before | Fresh after | Task delta | Hard limit / remaining |
| --- | ---: | ---: | ---: | --- |
| Initial raw JavaScript | 621,318 | 621,885 | +567 | 685,000 / 63,115 |
| Initial gzip JavaScript | 162,642 | 162,932 | +290 | 170,000 / 7,068 |
| Largest lazy chunk | 62,652 | 62,652 | 0 | 100,000 / 37,348 |
| Total JavaScript | 1,199,106 | 1,209,743 | +10,637 | Advisory policy, not a hard cap |

Initial-gzip hard-limit headroom decreased from 7,358 to 7,068 bytes. The initial-gzip 161,500 advisory and total-JavaScript 825,000 architecture-review advisory remain. They predate this change and remain material; no threshold was raised and no unrelated bundle restructuring was attempted. The largest lazy chunk remains SetupScreen. Goal editors and planning engines retain lazy boundaries; the eager context helper imports no domain or history engine.

## 12. Exact task file scope

Five pre-existing files modified relative to the captured baseline:

| File | Reason |
| --- | --- |
| `code/src/ui/GoalSection.tsx` | Bounded list, focused metadata editing, narrow patches, retained base/draft/selection, stale handling and focus. |
| `code/src/ui/GoalPlanningSection.tsx` | Lossless optional fields, intended-command selection, per-request drafts, multistep retry identities, evaluation guards, disclosure, truthful feedback. |
| `code/src/ui/DayFrameApp.tsx` | Own/inject ephemeral context; consume external Goal selection; clear/confirmed-restore boundaries. |
| `code/src/ui/dayFrameUi.css` | Goal-scoped reflow, wrapping, native control sizing, effective targets and visible focus. |
| `code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx` | Lawful UI label/disclosure/persistence wording updates, preserving semantic assertions. |

New implementation/test files:

- `code/src/ui/goalEditingContext.ts`: ephemeral identity-keyed cells and invalidation, with no persistence/domain authority.
- `code/src/ui/useGoalEditingState.ts`: React external-store subscription adapter for those cells.
- `code/src/ui/tests/GoalsFocusedEditing.test.tsx`: 20 permanent regressions.

Documentation: the supplied Task 9.24 was saved as the immutable execution input before baseline capture; this separate RESULT is the new output. No historical RESULT was rewritten. Disposable scripts, logs, screenshots, and the hash comparison live under `/tmp/dayframe-924-*RESULT*` as enumerated above; intermediate edit helper scripts are `/tmp/dayframe-924-edit-{goals,planning}-RESULT.py`.

## 13. Compatibility, remaining limits, and determination

No schema, dependency, backup format, lifecycle status, canonical command policy, or domain validator changed. No capability, reader, route, or invariant was retired or removed. Supported links, Measurement, Progress, explicit completion/archive/reactivation, evaluation and review remain reachable. Completion/archive copy explicitly avoids schedule-release or Progress-credit implications.

Goal ≠ Requested Time; Requested Time ≠ Capacity ownership; Proposal ≠ acceptance; acceptance ≠ realized schedule; scheduled duration ≠ Actual; Actual ≠ measured Progress. Network+ Accepted A (10 hours) and Accepted B (20 hours) remain distinct accepted iterations. Existing history/provenance/realization tests pass unchanged in meaning.

Drafts are intentionally ephemeral and do not survive restart. List bounds concern rendering, not I/O. Multistep saves are still non-atomic and require the explained continuation/retry behavior. Existing bundle advisories and the browser-certification limitations above remain. Future lifecycle and broad Goals product convergence remain out of scope. No mandatory bounded requirement is blocked, and neither architecture nor evidence-contract stop condition was needed.

**Task 9.24 — Goals Focused Editing & Requested Time Fidelity V1 is COMPLETE.**
