# Task 2.7 — Establish Stable Generated-Occurrence Identity — Result

## 1. Executive Determination

**Confirmed:** current generated IDs are deterministic within a particular expansion, but they are not a versioned durable identity contract. Daily and specific-weekday occurrences have overlap-stable date keys. Weekly and `timesPerUserWeek` expansion derive their selected dates and implicit slots from only the represented user-days, so changing the requested window can change which logical weekly occurrence is emitted or which date acts as occurrence N.

**Recommended:** a generated occurrence identity names one logical expansion of authoritative source intent, independently of placement, scheduled/unplaced state, Preview, friction, timestamps, and requested-window position. Adopt a versioned structured semantic identity with explicit source kind, complete stable source IDs, a canonical recurrence-scope key, and a stable slot/discriminator.

**Confirmed blocker:** current weekly and `timesPerUserWeek` behavior cannot safely supply durable occurrence targets until recurrence expansion selects canonical occurrences over the full semantic user-week and clips them afterward. The dependency-correct next task is **Task 2.8 — Establish Canonical Window-Invariant Recurrence Expansion**. No identity or scheduling behavior was implemented here.

## 2. Artifact Integrity

**Confirmed:** the artifact contains the required title, metadata, execution rules, purpose, Phase 2 context, governing evidence, objective, identity invariants, current audit, recurrence audit, window invariance, multiple-occurrence, work, manual-event, authored-change, versioning, candidate-model, decision-standard, non-goal, validation, completion, and determination sections. It ends with the exact required completion sentence.

- Artifact: `/home/sid/.codex/attachments/c5444203-d54b-4952-b482-3fbaabb9a26d/pasted-text.txt`
- Size: 35,247 bytes; 1,479 lines
- SHA-256: `757131ff980f499784444ed377c2c4e58f16e81a0c6d6c15c577f931cc7c0aa2`
- **Confirmed:** the artifact remained immutable.

## 3. Evidence Reviewed

**Confirmed:** executable evidence included block, shift, cycle, calendar, time, and state types; `generateBlockCandidates`; `placeBlockCandidates`; `generateCycleWorkBlocks`; `generateWorkBlocks`; `generateSchedulePreview`; `getActiveShiftSegment`; cycle validation and sequence utilities; effective-preference resolution; user-day/week utilities; manual-event projection; and direct candidate, placement, cycle-work, preview, user-day, user-week, and overnight tests.

**Confirmed:** Tasks 2.1, 2.4, 2.5, and 2.6 plus the Architecture Specification, `DECISIONS.md`, durable-data ADR, and Phase 1 checkpoint supplied governing authority and compatibility context.

## 4. Logical Occurrence Definition

**Recommended:** a logical occurrence is one canonical expansion instance of one authoritative source:

- template occurrence: one recurrence-rule slot for a canonical user-day or user-week scope;
- work occurrence: one cycle/segment-or-sequence assignment of a shift definition to a logical local start date;
- manual-event occurrence: the authored manual event itself.

It is not the resulting placement, Preview row, scheduled block, candidate state, friction relationship, recommendation, or generation run.

## 5. Current Identity Inventory

| Object | Current ID | Source Components | Placement-Dependent? | Window-Dependent? | Durable Contract? |
|---|---|---|---:|---:|---:|
| `BlockCandidate` | `candidate_{templateId}_{recurrenceId}_{userDayDate}` | template, recurrence, selected user-day | no | occurrence selection can be | no |
| template `DraftScheduledBlock` | `scheduled_{candidate.id}` | candidate identity | no | inherited | no |
| unplaced candidate | same candidate ID | template, recurrence, selected user-day | no | inherited | no |
| cycle work block | `work_{shiftDefinitionId}_{localDate}` | shift definition and local start date in string; cycle/segment retained only as fields | no | no for a shared source date | no |
| manual projection | `manualEvent.id` | authored manual event | no | no | authored ID is stable, but not wrapped/versioned as occurrence identity |
| friction/fix | prefixes plus generated participant IDs | transient derived participants/action | yes to derived condition | yes | no; not occurrence identity |

**Confirmed:** `ScheduledBlock` in current code is represented by `DraftScheduledBlock`; there is no separate durable scheduled-occurrence type.

## 6. Current Recurrence Types

| Frequency | Current support | Expansion rule | Current logical key candidate |
|---|---|---|---|
| `daily` | supported | every eligible represented user-day | recurrence + user-day |
| `weekly` | supported | first eligible represented user-day per effective user-week | user-week is semantic; current emitted date is window-sensitive |
| `specificWeekdays` | supported | represented eligible days matching authored weekdays | recurrence + matching user-day |
| `timesPerUserWeek` | supported | first N eligible represented user-days in each effective user-week | canonical user-week + slot is needed; current slots are implicit/window-sensitive |
| `perShiftSegment` | declared | throws unsupported | **Not found** current occurrence semantics |
| `custom` | declared | throws unsupported | **Not found** current occurrence semantics |

## 7. Daily Identity Semantics

**Confirmed:** current daily expansion emits one candidate per eligible `userDayDate`, and the candidate ID contains that date. For a date included by two overlapping windows, its current string ID is identical. Placement before/after midnight, scheduled versus unplaced outcome, or different placement time does not change the candidate-derived ID.

**Recommended:** the semantic daily occurrence key is canonical recurrence identity + logical user-day + slot 0 (slot may be implicit in V1 semantics). Disabling or bounding the recurrence can make the key unresolved without retargeting it.

## 8. Specific-Weekday Identity Semantics

**Confirmed:** weekday filtering is applied to the local date label at noon, then each matching represented user-day is passed to the same candidate builder. Shared matching dates retain the same current ID across windows.

**Recommended:** use recurrence identity + canonical matching user-day + slot 0. Changing the weekday set can eliminate an occurrence; the old identity becomes unresolved rather than moving to the next selected weekday.

## 9. Weekly Identity Semantics

**Confirmed:** current weekly expansion groups only eligible represented user-days by effective `userWeekStartDate` and emits a candidate on the first represented day in each group. It does not first expand the complete semantic week.

Example with a Saturday-start week:

- a window represented from Wednesday may emit that weekly occurrence on Tuesday/Wednesday depending on the day-boundary overlap edge;
- widening the window to Saturday emits the same week's single occurrence on Saturday instead;
- the candidate string changes because `userDayDate` changes, although both candidates satisfy one weekly recurrence for the same semantic week.

**Recommended:** weekly identity is recurrence + canonical user-week key + stable weekly slot 0. Its assigned occurrence day must be selected from the complete bounded semantic week before window clipping.

## 10. `timesPerUserWeek` Identity Semantics

**Confirmed:** current code groups represented eligible user-days by effective user-week and selects array positions `0..min(representedDays, N)-1`. There is no intrinsic occurrence ordinal on `BlockCandidate`.

Example for two occurrences in a Saturday-start week:

- full-week expansion selects Saturday as slot 0 and Sunday as slot 1;
- a window beginning Wednesday can select Wednesday as implicit slot 0 and Thursday as implicit slot 1;
- widening that window earlier changes both selected dates and their current IDs;
- a durable decision aimed at “slot 1” cannot safely resolve from current output because slot assignment was based on clipping.

**Confirmed:** engine-level ±1-day expansion reduces visual boundary loss but does not cover a canonical seven-day week and does not solve this identity problem.

**Recommended:** identity requires canonical `userWeekStartDate + slotIndex`, with all N slots selected from the complete recurrence-bounded semantic week before clipping.

## 11. Planning-Window Invariance

**Confirmed:** generation first chooses eligible dates from a requested/expanded window. Daily and specific-weekday identities are stable for dates existing in both outputs. Weekly and `timesPerUserWeek` have no general narrow/wide invariance because the window participates in occurrence selection.

Required examples:

1. **Daily:** May 6 in `[May 5, May 8]` and `[May 1, May 10]` remains recurrence + May 6.
2. **Weekly midweek:** a narrow Wednesday-start window and a full Saturday-start week currently choose different dates for one weekly rule.
3. **Times/week after earlier day:** a Wednesday-start window numbers Wednesday first; widening to Saturday makes Saturday first.
4. **Wider same week:** stable future identity remains week key + slot even when only one window displays it.
5. **Boundary crossing:** a fixed 01:00 placement may occur on the next calendar date but retains the originating user-day occurrence key.
6. **Work reuse:** current validation permits only one active cycle context per local date, but durable identity still includes that context rather than relying on the current non-overlap rule.

## 12. Window-Invariance Matrix

| Recurrence Type | Narrow → Wide Stable? | Wide → Narrow Stable? | Depends On Window Start? | Depends On Window End? | Identity Risk |
|---|---:|---:|---:|---:|---|
| daily | yes for shared user-days | yes for shared user-days | only existence at edge | only existence at edge | low |
| weekly | not guaranteed | not guaranteed | yes, selected first day | affects existence/clipping | high |
| specific weekdays | yes for shared matching days | yes for shared matching days | only existence at edge | only existence at edge | low |
| `timesPerUserWeek` | not guaranteed | not guaranteed | yes, selected dates and slots | affects count/existence | critical |

## 13. User-Day Boundary Semantics

**Confirmed:** DayFrame recurrence and placement operate in local user-day labels, not UTC instants. Candidate identity uses `userDayDate`; fixed times earlier than the boundary are placed on the next calendar date while retaining that user-day label.

**Recommended:** template occurrence identity uses the recurrence's semantic user-day/week key. It must not encode placement instant or placement calendar date. Work identity uses its canonical shift local start date and source context; `userDayDate` remains derived grouping provenance.

## 14. Week-Start Semantics

**Confirmed:** `weekStartsOn` changes `userWeekStartDate` and directly changes weekly and `timesPerUserWeek` grouping. Segment-effective preferences can change it by date.

**Recommended:** a changed effective week boundary is a semantic recurrence-domain change for week-scoped frequencies. Old week-key identities may become unresolved and must be revalidated; they must not silently retarget a newly bounded week. Daily and specific-date occurrence keys need not rename solely because week grouping changes unless their recurrence semantics depend on the week.

## 15. Overnight Semantics

**Confirmed:** work blocks can cross midnight and fixed/flexible template placements can extend onto the next calendar date. Existing tests preserve work ownership by the shift start date and candidate ownership by `userDayDate`.

**Recommended:** an overnight placement remains the same occurrence. Identity derives from the logical source expansion key, not `endsAt`, UTC day, or every calendar date visually overlapped.

## 16. DST / Time-Zone Assessment

**Confirmed:** no explicit user timezone or IANA zone exists in current domain types. JavaScript local `Date` construction and calendar `setDate` arithmetic use the host/browser local zone. Local-date difference uses rounded elapsed 24-hour units, which tolerates ordinary 23/25-hour DST transitions for date counting but is not an explicit timezone contract.

**Recommended:** V1 occurrence semantics should use canonical local/user-day strings and semantic slots, never UTC offsets or derived timestamps. **Deferred:** explicit timezone ownership, ambiguous/nonexistent local times, and cross-zone migration require a separate architecture decision.

## 17. Multiple Same-Day Occurrence Assessment

**Not found currently:** no supported recurrence frequency produces more than one candidate for the same template + recurrence + user-day. `timesPerUserWeek` spreads selected slots across distinct represented days. `perShiftSegment` and `custom` are unsupported.

**Recommended:** durable identity must nevertheless include a discriminator contract so later multiple-per-day or custom recurrence support does not collide or require silent reinterpretation of V1 targets.

## 18. Occurrence Discriminator Options

**Inferred:** a bare ordinal is unstable when earlier occurrences are inserted. An authored sub-occurrence key is strongest when the rule explicitly names sub-slots. A deterministic expansion slot is suitable for rule-defined canonical slots such as `timesPerUserWeek`. A random generated UUID cannot regenerate without materializing/persisting derived instances.

## 19. Multiple-Occurrence Matrix

| Discriminator | Stable After Earlier Occurrence Added? | Requires Authored Schema Change | Deterministic | Explainable | Recommendation |
|---|---:|---:|---:|---:|---|
| ordinal in incidental output order | no | no | conditionally | medium | reject |
| authored key | yes | yes for new rule shapes | yes | high | prefer where slots are authored |
| canonical expansion slot | yes if slot semantics are versioned | no for current week-slot model | yes | high | **adopt for derived slots** |
| persisted UUID | yes after materialization | yes/storage required | not regenerable from source alone | low | reject for generated occurrences |

## 20. Template Occurrence Source Components

**Recommended required semantics:** `sourceKind=templateOccurrence`, `templateId`, `recurrenceId`, recurrence-scope key (`userDayDate` or canonical `userWeekStartDate`), and a stable slot/discriminator. Both template and recurrence IDs are retained even though recurrence references template, providing explicit provenance and defense against malformed/reused references.

**Deferred:** exact property names and whether day-scoped V1 slot 0 is serialized explicitly.

## 21. Work Occurrence Identity

**Confirmed:** manual-segment work generation calls `generateWorkBlocks` and then adds `shiftCycleId` and `shiftSegmentId`. Repeating-sequence generation creates a work block for each canonical cycle local date and uses the sequence-day ID as `shiftSegmentId`.

**Recommended required semantics:** `sourceKind=workOccurrence`, `shiftCycleId`, segment-or-sequence-day ID, `shiftDefinitionId`, logical local shift start date, and slot 0/discriminator. The local start date is stable when an overnight work block overlaps the following date; placement/grouping `userDayDate` is not the primary key.

## 22. Work Collision Analysis

**Confirmed:** current cycle validation rejects overlapping shift cycles, manual segments within a cycle cannot overlap, and repeating sequence yields at most one sequence day per local date. Therefore a valid current authored setup does not normally produce two work contexts for one date.

**Confirmed:** the runtime work ID nevertheless omits cycle and segment/sequence context: `work_{shiftDefinitionId}_{localDate}`. If constraints evolve, if invalid data reaches generation, or if durable references outlive cycle restructuring, that string is insufficient provenance.

**Recommended:** include complete context in semantic identity even though present validation prevents the immediate collision.

## 23. Manual-Event Identity

**Confirmed:** one `ManualCalendarEvent` is one authored occurrence, and its scheduled projection reuses `manualEvent.id`. Date/time edits retaining the authored ID represent the same logical event; deletion eliminates it.

**Recommended:** semantic identity is `sourceKind=manualEventOccurrence + manualEventId`, with identity version. No recurrence key is needed. This supports friction provenance and acknowledgements without authorizing generic movement or skipping.

## 24. Authored Edit / Deletion Semantics

**Recommended:** title, duration, priority, or placement-preference edits do not inherently rename a template occurrence; decision validity is re-evaluated separately. Recurrence rule edits preserve identities only for canonical occurrence keys still emitted by the same recurrence. Date bounds, weekday changes, disablement, source deletion, cycle/segment replacement, or sequence changes can leave prior identities unresolved.

**Recommended:** unresolved means orphaned. No nearest-date, same-title, same-position, or next-slot retargeting is allowed.

## 25. Source ID Reuse Assessment

**Confirmed:** authored IDs are ordinary strings, not globally immutable entity identities. Setup creation derives IDs from current collection lengths (for example `template_{nextIndex}`, `cycle_N`, and `segment_N`), so delete-then-create can reuse an earlier ID. Manual events use a timestamp-derived ID, reducing but not eliminating collision risk.

**Recommended:** durable PlanDecision provenance must include a base source generation/incarnation marker or fingerprint sufficient to distinguish coincidental ID reuse. **Unresolved:** current authored schema has no universal immutable incarnation ID, so this must be designed before durable references are written.

## 26. Identity Versus Source Validity

**Recommended:** identity answers “which logical source occurrence?” Validity answers “does that source still exist, is this still the same source incarnation, and may the decision apply under current semantics?” Mutable title, duration, placement, and constraint data should not be embedded in identity merely to detect compatibility.

**Recommended:** an identity can remain equal while a PlanDecision changes from applicable to conflicted; it becomes unresolved when its source/slot no longer resolves or source incarnation mismatches.

## 27. Source Revision / Fingerprint Assessment

| Model | Assessment |
|---|---|
| revision inside identity | **Not recommended:** harmless material edits rename occurrences and destroy continuity |
| identity excludes revision; decision retains source fingerprint/incarnation provenance | **Recommended:** stable naming plus explicit compatibility/ID-reuse validation |

**Deferred:** what properties form the fingerprint, whether authored objects gain immutable incarnation IDs/revisions, and how legacy sources receive deterministic provenance.

## 28. Candidate Identity Models

**Inferred:** current strings are readable but encode incomplete, unversioned semantics. Structured identity best preserves provenance and evolution. A hash may be a secondary compact encoding only if the canonical structured preimage and algorithm/version remain defined. Random UUID generation violates deterministic regeneration unless occurrences become authored/materialized objects.

## 29. Identity Model Matrix

| Model | Deterministic | Window-Stable | Explainable | Versionable | Durable Reference Fit | Recommendation |
|---|---:|---:|---:|---:|---:|---|
| current generated IDs | yes within current expansion | no for week-scoped selection | medium | no | low | reject as durable key |
| structured semantic identity | yes | yes after canonical expansion | high | high | high | **adopt** |
| hashed semantic identity | yes | inherits structured semantics | low alone | yes with algorithm/version | medium/high | optional encoding only |
| random generated UUID | no across regeneration | no without persistence | low | technically | low | reject |

## 30. Adopted Semantic Identity Contract

**Recommended:** `OccurrenceIdentity` is a branded/structured, explicitly versioned value containing:

1. source kind;
2. complete stable source IDs;
3. canonical logical recurrence scope/date key;
4. stable source-semantic slot/discriminator; and
5. no placement, output order, Preview, friction, or timestamp data.

Equality is semantic component equality under the same identity version. The same canonical expansion instance has the same identity across deterministic regeneration, scheduled/unplaced transitions, moves, and overlapping windows. Deleted/eliminated/reincarnated sources do not retarget old identities. Source compatibility is validated separately.

**Deferred:** concrete TypeScript/JSON schema until canonical recurrence expansion and source-incarnation handling are resolved.

## 31. Canonical Expansion / Clipping Determination

**Recommended and required:** expansion order becomes:

```text
authoritative recurrence + effective user-day/week semantics
    → canonical occurrence expansion over complete semantic scopes
    → assign stable identity/slot
    → clip occurrences to requested planning window
    → placement
```

Current behavior is effectively requested-window enumeration followed by occurrence selection. **Confirmed:** that order blocks a reliable identity implementation for weekly and `timesPerUserWeek`.

## 32. Weekly Canonicalization Determination

**Recommended:** define one weekly occurrence as `canonical userWeekStartDate + weekly slot 0`. Determine its canonical nominal user-day from the complete recurrence-bounded week, independent of visible-window start. Then include it only if the canonical occurrence intersects the generated domain under the selected clipping contract.

**Unresolved:** whether the nominal day is always week start or another explicitly authored/default weekly day. Current behavior means “first represented eligible day,” which is not a stable semantic rule and must be decided without silently changing product meaning.

## 33. `timesPerUserWeek` Canonicalization Determination

**Recommended:** define N slots per complete canonical user-week: `weekKey + slot 0..N-1`. Map each slot deterministically to eligible days using a versioned rule applied to the full bounded week, then clip.

**Confirmed blocker:** current `BlockRecurrence` provides only N, with no preferred weekdays, spacing, or authored slot keys. A next task must decide the canonical mapping rule as a scheduling behavior contract before identity implementation.

## 34. Runtime ID Versus Occurrence ID

**Recommended:** initially add explicit `occurrenceId` alongside existing runtime `id` rather than replacing candidate/scheduled/work IDs. Runtime `id` continues to correlate current generated structures; `occurrenceId` is the semantic durable target propagated unchanged from expansion through placement, unplaced state, work/manual projection, friction provenance, and revision.

**Deferred:** deriving runtime IDs from occurrence identity or later consolidation can occur after consumers and migrations are understood.

## 35. Conflict-Identity Compatibility

**Recommended:** structured occurrence identity must support canonical comparison and serialization so conflict participants can be sorted independently of detection order. A future conflict identity can be `conflict kind + canonically ordered occurrence identities + material condition`, as Task 2.6 requires.

**Confirmed:** being able to identify work/manual occurrences does not authorize override actions against them; source capability remains separate.

## 36. Versioning Requirements

**Recommended:** occurrence identity carries its own explicit semantic version. The containing future PlanDecision durable format must also be versioned because it governs envelope/schema behavior. Both are useful: PlanDecision version cannot safely imply identity semantics forever, and identity version alone does not version decision payloads.

**Required invariant:** no future algorithm change may reinterpret existing identity components under the same version.

## 37. Migration / Compatibility Requirements

**Recommended:** once durable decisions reference identity V1, DayFrame must either retain a V1 resolver or perform explicit deterministic, atomic, observable, retryable migration/conversion to a later identity version under the durable-data ADR. Ambiguous targets must remain recoverable/orphaned; they must never be guessed, dropped, or silently rebound.

**Confirmed:** current generated IDs are non-durable Preview data, so no existing user-data migration is required merely to introduce future semantic identity. Migration obligations begin when a released writer persists references.

## 38. Serialization / Equality Semantics

**Recommended:** structured JSON is the authoritative semantic form. A canonical string/branded token may be derived for maps, runtime IDs, URLs, or compact storage, but its escaping, component order, Unicode handling, and version must be specified. A hash is never the sole explanation surface.

Two identities are equal only when version, source kind, all source IDs, canonical scope key, and discriminator are equal. Object reference, array index, placement start/end, and runtime block ID are irrelevant. Canonical ordering compares a versioned serialization of these components.

## 39. Required Behavioral Invariants

1. **Recommended:** same logical occurrence yields the same semantic identity.
2. **Recommended:** placement changes do not change identity.
3. **Recommended:** scheduled/unplaced transitions do not change identity.
4. **Recommended:** Preview generation/revision timestamps do not change identity.
5. **Recommended:** wider/narrower overlapping windows do not rename shared canonical occurrences.
6. **Recommended:** distinct source kinds and source contexts cannot collide.
7. **Recommended:** multiple same-source occurrences have stable semantic discriminators.
8. **Recommended:** source deletion/elimination/reincarnation leaves old identity unresolved, never retargeted.
9. **Recommended:** identity semantics and serialization are explicitly versioned.
10. **Recommended:** manual projections retain authored event identity within a source-kind wrapper.
11. **Recommended:** work identity includes cycle, segment/sequence, definition, and logical local date.
12. **Recommended:** source revision/validity is evaluated separately from logical identity.
13. **Recommended:** canonical expansion precedes window clipping.

## 40. Required Later Test Contract

**Recommended:** later work must test:

- byte/semantic equality under identical regeneration;
- narrow/wide and overlapping windows in both directions;
- daily and specific-weekday shared-date stability;
- weekly midweek windows against complete-week generation;
- every `timesPerUserWeek` slot under partial/full weeks and recurrence bounds;
- custom global and segment-effective week starts;
- user-day boundaries before/after midnight;
- overnight work and template placement;
- host DST transition dates without offset-based identity;
- multiple same-day source slots and collision rejection;
- source edit, disablement, deletion, and ID reuse/incarnation mismatch;
- manual-event edits retaining identity and deletion orphaning it;
- manual-segment and repeating-sequence work identity;
- shared shift definition across distinct non-overlapping contexts;
- scheduled/unplaced and placement-change stability;
- canonical structured/string serialization, equality, ordering, and escaping;
- identity-version discrimination and unsupported-version recovery.

## 41. Architectural Alignment Assessment

| Principle | Assessment | Finding |
|---|---|---|
| deterministic planning | Aligned after canonicalization | identity no longer depends on requested-window enumeration |
| provenance | Aligned | source kind and full source context are explicit |
| explainability | Aligned | structured components name the logical occurrence |
| durable-data compatibility | Partially aligned | governance is defined; no durable writer/schema exists yet |
| user-data preservation | Aligned | deletion/reuse or ambiguity orphans rather than retargets |
| PlanDecision authority | Aligned | identity is strong enough semantically after prerequisite work |
| future engine architecture | Partially aligned | propagation boundary is clear; canonical recurrence behavior remains unresolved |

## 42. Open Questions

- **Unresolved:** canonical nominal day for `weekly` recurrence.
- **Unresolved:** canonical slot-to-day mapping for `timesPerUserWeek`.
- **Unresolved:** full-week behavior at recurrence `startsOnDate`/`endsOnDate` boundaries.
- **Unresolved:** immutable source incarnation/revision mechanism protecting against ID reuse.
- **Unresolved:** exact structured identity schema, string encoding, and V1 discriminator representation.
- **Unresolved:** future `perShiftSegment` and `custom` occurrence keys.
- **Deferred:** explicit timezone architecture and multi-timezone behavior.

## 43. Recommended Next Task

**Recommended:** **Task 2.8 — Establish Canonical Window-Invariant Recurrence Expansion**.

It should decide weekly nominal-day semantics; define full-week N-slot mapping for `timesPerUserWeek`; specify recurrence-boundary clipping; preserve current daily/specific-weekday behavior; prove invariance with direct tests at the algorithm-contract level; and remain separate from PlanDecision persistence.

After that decision, a bounded task can introduce explicit versioned `OccurrenceIdentity` alongside runtime IDs without plan-decision behavior.

## 44. Deviations

**Confirmed:** none. No production code, test, ID, state type, engine input, recurrence/placement behavior, persistence, profile, backup, UI, or governance document changed.

## 45. Discoveries and Deferred Work

**Confirmed discovery:** the engine expands its planning window by only one day, so that safeguard is not canonical week expansion. **Confirmed discovery:** `timesPerUserWeek` slots exist only as loop indexes and are not retained. **Confirmed discovery:** authored Setup IDs can be reused after deletion because several creators derive IDs from collection length. **Confirmed discovery:** cycle validation currently prevents practical work-ID collision, but current work strings still omit durable source context.

**Deferred:** canonical recurrence changes, source-incarnation design, identity types/encoding/versioning, propagation, persistence, PlanDecision, conflict acknowledgement, and UI.

## 46. Validation

**Confirmed:** the required recurrence, ID construction, work/cycle, manual projection, day/week, placement, Preview, and direct test surfaces were inspected. Source algorithms and existing tests were sufficient to establish current behavior; no test execution or modification was necessary for this investigation.

**Confirmed:** the artifact hash and required final sentence were rechecked. Only this separate Task 2.7 result artifact was created for this task. Existing cumulative working-tree changes from prior completed tasks were not modified. No governance or durable-format file changed.

## 47. Final Completion Determination

**Confirmed complete:** DayFrame now has an evidence-backed, versionable semantic occurrence-identity contract covering template, work, and manual sources; placement and scheduled-state independence; window invariance; user-day/week boundaries; overnight and current timezone limitations; multiple-occurrence discrimination; authored edits, deletion, ID reuse, validity, collision, serialization, migration, and conflict compatibility. Weekly and `timesPerUserWeek` expansion are explicitly identified as the prerequisite blocker, so Task 2.8 must canonicalize recurrence expansion before occurrence identity is implemented or referenced by durable PlanDecisions.
