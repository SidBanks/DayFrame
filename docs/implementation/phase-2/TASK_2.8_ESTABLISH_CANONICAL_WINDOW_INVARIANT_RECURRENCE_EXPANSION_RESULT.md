# Task 2.8 — Establish Canonical Window-Invariant Recurrence Expansion — Result

## 1. Executive Determination

**Confirmed:** current daily and specific-weekday expansion already gives shared user-days stable recurrence meaning. Current `weekly` and `timesPerUserWeek` expansion instead selects from only the user-days represented by the requested/engine-expanded window. A midweek window can therefore create replacement occurrences that do not exist when the full week is generated.

**Recommended adopted contract:** recurrence expansion, not the requested window, determines occurrence existence. For each complete effective user-week:

1. enumerate its user-days in canonical chronological order;
2. intersect them with recurrence `startsOnDate`/`endsOnDate`;
3. `weekly` assigns slot 0 to the first recurrence-valid day;
4. `timesPerUserWeek=N` assigns slots `0..min(N, validDays)-1` to the first N recurrence-valid days; and
5. only after assignment, clip occurrences by canonical user-day against the generation domain.

This is the closest window-invariant formalization of current full-week behavior, uses all current authored intent, and does not invent spacing or preferred weekdays.

**Recommended:** classify the later change as correction of a window-coupling defect in derived generation, not a new recurrence-data version. No persistence migration is required, but the user-visible scheduling correction must be documented and protected by tests. The dependency-correct next task is **Task 2.9 — Implement Canonical Window-Invariant Recurrence Expansion**.

## 2. Artifact Integrity

**Confirmed:** the artifact contains the required title, metadata, execution rules, purpose, Phase 2 context, governing evidence, objective, current audit, canonical principle, weekly and N-per-week semantics, recurrence boundaries, clipping, candidate models, decision standard, non-goals, validation, completion criteria, and determination. It ends with the exact required completion statement.

- Artifact: `/home/sid/.codex/attachments/8ce46ac0-0e24-4632-8bd8-a84d9c4045ac/pasted-text.txt`
- Size: 42,463 bytes; 1,684 lines
- SHA-256: `2df40d61e6e18acc8a025756ac02e2172184b7231a6122be2787db0569ee4beb`
- **Confirmed:** the artifact remained immutable.

## 3. Evidence Reviewed

**Confirmed:** primary evidence included `BlockRecurrence`, `BlockTemplate`, `generateBlockCandidates`, `generateSchedulePreview`, planning-window expansion/filtering, user-day and user-week utilities, effective segment preference resolution, placement time handling, recurrence validation, profile/backup normalization, Setup recurrence controls, and all direct recurrence/week/boundary tests.

**Confirmed:** repository history contains only the project-root move for these files; no earlier implementation rationale was available. Architecture decisions, the durable-data ADR, Tasks 2.1 and 2.6–2.7, audits, and hydration notes supplied supporting context.

## 4. Current Recurrence Model

| Frequency | Current Selection Domain | Canonical Today? | Window Sensitive? | Task 2.8 Decision Needed? |
|---|---|---:|---:|---:|
| `daily` | every represented recurrence-valid user-day | effectively yes for shared days | edge inclusion only | preserve |
| `specificWeekdays` | represented valid days matching authored weekdays | effectively yes for shared days | edge inclusion only | preserve |
| `weekly` | first represented valid day per computed week key | no | yes | yes |
| `timesPerUserWeek` | first N represented valid days per computed week key | no | critically | yes |
| `perShiftSegment` | throws unsupported | no behavior | n/a | **Deferred** |
| `custom` | throws unsupported | no behavior | n/a | **Deferred** |

**Confirmed:** `timesPerUserWeek` validates N as a positive integer. Slots are loop indexes only and are not retained on candidates.

## 5. Canonical Expansion Principle

**Recommended:** adopt:

```text
authoritative recurrence + effective user-week semantics
    → enumerate complete canonical recurrence scopes
    → apply recurrence validity bounds
    → assign occurrence dates and stable slots
    → clip to generation domain
    → materialize candidates and place
```

The requested window never participates in deciding which occurrence represents a week.

## 6. Occurrence Existence Versus Visibility

**Recommended:** occurrence existence is a fact of recurrence definition, effective week semantics, and recurrence bounds. Visibility is whether the canonical occurrence's user-day overlaps the generation domain and, later, whether its placed interval belongs in the displayed Preview range.

A midweek request does not create a replacement weekly occurrence when the canonical occurrence was earlier that week. Widening a request reveals additional canonical occurrences; it never moves existing ones.

## 7. Daily Semantics

**Confirmed and adopted:** one occurrence exists for every recurrence-valid logical user-day. Window changes only include/exclude those canonical days. The current implementation is semantically aligned and needs no scheduling change beyond any shared refactor that preserves exact results.

## 8. Specific-Weekday Semantics

**Confirmed and adopted:** one occurrence exists on every recurrence-valid user-day whose local weekday is in the authored set. Weekday matching is independent of the requested window. Current shared-date behavior is aligned and must remain unchanged.

## 9. Current Weekly Semantics

**Confirmed:** the implementation filters represented user-days by recurrence bounds, computes an effective `userWeekStartDate` for each, retains the first encountered day for each key, and emits that day. Enumeration begins near the planning-window boundary, so “first” means first represented—not first canonical—day.

The direct weekly test encodes this: a Saturday-start week keyed `2026-05-02` is represented only at the end of the week, so it emits `2026-05-08`. That is current implementation behavior, not a defensible definition of “Weekly.”

## 10. Weekly Candidate Models

**Inferred:** always using week start is simple but mishandles a recurrence beginning midweek unless the first partial week is skipped. Aligning to `startsOnDate` weekday invents an enduring weekday interpretation not stated by the schema. Requiring an authored weekday would improve expressiveness but would invalidate current supported data. Selecting the first recurrence-valid day of the complete week preserves the current algorithm's natural full-domain meaning.

## 11. Weekly Model Matrix

| Model | Window-Invariant | Uses Current Schema | Handles Partial First Week | Explainable | Behavior Drift | Future Identity Fit | Recommendation |
|---|---:|---:|---:|---:|---:|---:|---|
| user-week start | yes | yes | skips it when start is later | high | medium | high | not adopted |
| `startsOnDate` weekday alignment | yes | only when start exists; undefined otherwise | yes | medium | high | high | reject as hidden intent |
| first canonically eligible day | yes | yes | emits at recurrence start | high | minimal | high | **adopt** |
| explicit authored weekday | yes | no | explicit | high | schema/UI change | high | future richer model |

## 12. Adopted Weekly Contract

**Recommended:** for weekly recurrence W and complete effective week K, compute K's user-days in chronological order, retain days within W's optional bounds, and assign the single weekly occurrence (slot 0) to the first retained day. If no day remains, K has no occurrence. The requested window is not consulted until clipping.

Thus a Saturday-start week normally occurs Saturday. If the recurrence begins Wednesday in that week, its first occurrence is Wednesday. If it ends before the canonical first valid day, no occurrence exists.

## 13. Current `timesPerUserWeek` Semantics

**Confirmed:** represented recurrence-valid user-days are grouped by per-day effective week key. For each group the implementation takes the first `min(groupLength, N)` days. Ordering comes from chronological date enumeration. Partial requested windows therefore repack N occurrences into whichever days are visible, and no stable slot survives.

## 14. `timesPerUserWeek` Candidate Models

**Inferred:** even distribution is scheduling optimization absent from authored intent. Abstract fixed positions likewise invent unstated positions. Authored preferred days/slots require schema and UI changes. First N recurrence-valid canonical days is deterministic, explainable, and formalizes what current full-week expansion already does.

## 15. `timesPerUserWeek` Model Matrix

| Model | Window-Invariant | Uses Current Schema | Deterministic | Explainable | Similar To Current Behavior | Future Flexibility | Recommendation |
|---|---:|---:|---:|---:|---:|---:|---|
| first N canonical eligible days | yes | yes | yes | high | highest | versionable baseline | **adopt** |
| evenly distributed | yes | yes | with tie rules | medium | low | medium | reject hidden optimization |
| deterministic abstract slots | yes | marginal | yes | medium | low | high | not supported by current intent |
| authored preferred slots/days | yes | no | yes | high | explicit future model | highest | defer |

## 16. Adopted Slot Allocation Contract

**Recommended:** for recurrence R with count N and complete effective week K:

- build the chronologically ordered list of recurrence-valid user-days in K;
- allocate slot i to list item i for `0 ≤ i < min(N, list.length)`;
- preserve slot i independent of requested window;
- after allocation, include slot i only when its assigned canonical user-day is in the generation domain.

N greater than seven or greater than available recurrence-valid days yields at most one occurrence per valid user-day under the current recurrence schema. No duplicate same-day occurrence is invented.

## 17. Complete Semantic User-Week

**Recommended:** under a stable effective preference, a complete semantic user-week is seven consecutive `userDayDate` labels beginning on the configured `weekStartsOn` weekday. Its key is that first label. User-day start instants use the effective `dayBoundaryStartTime`, but recurrence dates and ordering remain local labels.

**Confirmed limitation:** segment-effective preferences are resolved independently for each user-day. Around a `weekStartsOn` transition, current grouping can produce shortened/irregular effective-key buckets rather than one globally consistent seven-day partition.

## 18. Effective Week-Start Semantics

**Recommended for compatibility:** preserve per-user-day effective resolution. Enumerate all canonical dates needed by the generation domain, resolve each date's effective `weekStartsOn`, compute its week key, and group each date into exactly that key. Process every resulting key once. This is deterministic and preserves existing segment preference authority.

**Inferred:** a transition bucket may contain fewer or nonstandard dates, but the requested window must still not choose from a truncated subset of that bucket. Canonicalization must discover all dates assigned to each relevant key across the surrounding seven-day reach before allocating.

**Deferred:** imposing invariant week preferences, truncating weeks at preference transitions, or adopting “preference at week start” would change authored scheduling semantics and needs a separate product decision.

## 19. Recurrence Start/End Semantics

**Recommended:** bounds are inclusive user-day labels and authoritative recurrence validity. For each complete/effective week bucket, intersect canonical dates with `[startsOnDate, endsOnDate]` before weekly/N-per-week allocation. Missing start means no lower recurrence bound; missing end means no upper recurrence bound within the requested canonical enumeration.

This intentionally allows an authored bound change to change slot assignments within the boundary week; that is a semantic authored change, not window instability.

## 20. Partial First Week

**Recommended:** a recurrence beginning midweek participates immediately. Weekly assigns slot 0 to `startsOnDate` (or the first later valid date in that effective bucket). N-per-week assigns up to N slots to the first valid dates from recurrence start through the bucket end.

Example, Saturday–Friday week with Wednesday start:

- weekly: Wednesday;
- N=2: Wednesday and Thursday;
- a window beginning Friday does not repack those slots to Friday; it returns none if both canonical dates are outside the generation domain.

## 21. Partial Last Week

**Recommended:** a recurrence ending midweek allocates from the bucket's first recurrence-valid day through `endsOnDate`. Weekly emits its first valid day if one exists. N-per-week emits up to N first valid days. Slots outside the bound do not exist; they are not moved earlier/later to meet N.

## 22. Partial-Week Model Matrix

| Model | Stable Slot Identity | Predictable | Similar To Current Full-Domain Behavior | User Expectation | Recommendation |
|---|---:|---:|---:|---:|---|
| allocate from recurrence-valid canonical days, then window-clip | yes for fixed authored bounds | high | high | recurrence begins/ends immediately | **adopt** |
| repack after requested-window clipping | no | low | current defect | produces surprise replacements | reject |
| fixed unbounded slots then recurrence-bound clip | yes | high | lower | may skip entire partial first week | not adopted |
| skip partial week | yes | high | low | unsupported by UI wording | reject |

## 23. Adopted Partial-Week Contract

**Recommended:** recurrence bounds are part of canonical occurrence definition; requested windows are not. Allocate weekly/N-per-week slots from the full effective week after applying inclusive authored recurrence bounds, then clip only for generation. Partial boundary weeks yield up to N occurrences and never repack because of the requested window.

## 24. Requested Window Semantics

**Recommended:** the requested planning window is an output-selection boundary. The recurrence algorithm may inspect the full effective week(s) surrounding it to establish canonical dates and slots. A canonical occurrence is returned by candidate generation only if its canonical user-day interval overlaps the generation input window after recurrence bounds.

## 25. Generation Versus Display Domain

**Recommended distinction:** 

- canonical recurrence domain: complete relevant week buckets needed to decide occurrence existence and slot assignment;
- generation domain: the planning interval passed to candidate generation, currently engine-expanded by one day;
- display domain: the original Preview-visible range used later to filter/represent results.

Canonical expansion may inspect dates outside the generation domain but must not materialize those occurrences merely because their week intersects it.

## 26. Engine Buffer Assessment

**Confirmed:** `generateSchedulePreview` expands the planning window one calendar day on each side before work generation, candidate generation, and placement. This supports user-day edges, overnight overlap, placement context, and neighboring sleep behavior. Visible filtering happens later.

**Recommended:** retain the buffer. Candidate expansion should treat the buffered interval as its generation/clipping domain, enumerate complete effective week buckets internally, allocate canonically, then return only occurrences whose user-day overlaps that buffered domain. The ±1 buffer must not define weekly slots.

## 27. Canonical Expansion / Clipping Contract

**Recommended conceptual algorithm:** 

1. derive all user-day labels whose intervals overlap the generation domain;
2. discover each relevant effective week key and the surrounding dates that canonically belong to it;
3. deduplicate keys per recurrence;
4. enumerate each complete effective bucket independently of requested clipping;
5. apply inclusive recurrence bounds;
6. assign weekly slot 0 or first N slots;
7. filter assigned canonical occurrence days against the generation domain;
8. materialize candidates and preserve current placement/filtering behavior.

Daily/specific-weekday paths may remain structurally simpler so long as their semantics remain identical.

## 28. Duplicate Prevention

**Recommended:** process `(recurrenceId, effectiveWeekKey)` once. Build a set/map of canonical keys before allocation, even if multiple requested dates or the engine buffer discover the same key. Within a bucket, each canonical date is used at most once; count above available dates is capped.

## 29. Deterministic Ordering

**Recommended:** canonical occurrence allocation is ordered by effective week key, canonical user-day, recurrence identity, then stable slot/discriminator. Final candidate ordering can preserve the existing comparator (user-day, priority, ID) after canonical allocation. No semantic selection may rely on Map insertion from a clipped window.

## 30. Required Window-Invariance Examples

1. **Weekly narrow/wide:** Saturday-start week, Window A Wednesday–Friday and Window B Saturday–Friday. Canonical weekly date is Saturday in both; A returns none, B returns Saturday.
2. **N=2 narrow/wide:** canonical slots are Saturday/Sunday. A Wednesday–Friday returns none; B returns both. A must not create Wednesday/Thursday replacements.
3. **Partial first week:** recurrence starts Wednesday. Canonical weekly date is Wednesday; N=2 dates Wednesday/Thursday. A Friday-only window returns none rather than repacking.
4. **Partial last week:** recurrence ends Tuesday. Weekly is Saturday; N=3 is Saturday/Sunday/Monday when valid. A Monday–Tuesday window returns Monday slot only, not Monday/Tuesday as newly renumbered slots.
5. **Changed `weekStartsOn`:** switching Saturday to Monday changes canonical keys/dates as a legitimate authored semantic change; it is not required to preserve old identity.
6. **Overnight placement:** a canonical Saturday occurrence placed after midnight remains the Saturday occurrence.

## 31. Behavior Change Matrix

| Scenario | Current Behavior | Adopted Canonical Behavior | User-Visible Change? | Test Impact |
|---|---|---|---:|---|
| weekly partial requested week | emits first represented day | canonical earlier day exists; omitted if outside generation domain | yes | weekly direct test changes/adds invariance coverage |
| N-per-week partial requested week | repacks first N visible days | returns only canonical slots whose dates are included | yes | new narrow/wide tests |
| full week, no recurrence bounds | first day / first N days | same | no | regression tests remain |
| partial first recurrence week fully represented | first valid day(s) | same | no | add explicit boundary contract |
| partial last recurrence week fully represented | first up-to-N valid days | same | no | add explicit boundary contract |
| daily/specific weekdays | per matching represented day | same | no | existing tests remain |
| effective week-start transition | per-day key buckets, clipped selection | same keys, but canonical full-bucket selection | potentially | targeted transition tests required |

## 32. Existing Test Contract Assessment

**Confirmed:** existing daily, specific-weekday, recurrence-bound, and user-week tests are desired regressions. The N-per-week test begins exactly on a Saturday boundary and describes deterministic count; its expected dates remain valid but it does not prove invariance.

**Confirmed:** the weekly test expecting `2026-05-08` for the `2026-05-02` week records current clipped-window behavior and must be updated after implementation. New tests must compare narrow and wide windows rather than assert only one invocation. Current preview tests exercise downstream behavior but do not establish canonical recurrence ownership.

## 33. Product-Semantics Assessment

**Confirmed:** Setup exposes only frequency “Weekly” or “Times per user week” plus a numeric count. It exposes weekdays only for `specificWeekdays`; there is no weekly nominal weekday, spacing, preferred slots, or optimization choice.

**Recommended:** do not infer even distribution, preferred days, or starts-on weekday recurrence from absent data. “First recurrence-valid canonical day(s)” is the simplest explainable baseline. Users needing particular weekdays already have `specificWeekdays`; richer week-scoped intent can be introduced as a new authored semantic version later.

## 34. Historical Exposure Assessment

**Confirmed:** active persistence, saved profiles, and V1 backups can contain `weekly` and `timesPerUserWeek` recurrences, and the production Setup UI can author them. Therefore exposure is possible. **Not found:** repository history does not provide release/population evidence or a documented promise that occurrence selection is window-relative.

**Inferred:** the labels communicate week-scoped recurrence, not “first visible day(s),” so preserving window-relative output as legacy intent would perpetuate an accidental dependency rather than protect an authored choice.

## 35. Compatibility Classification

**Recommended:** classify canonicalization as a **user-visible scheduling bug correction/alignment** to the existing recurrence meaning. Preview outputs are derived/non-durable, and the authored schema expresses frequency/count but never window-relative selection. No stored field is reinterpreted from one explicit authored option to another.

**Recommended:** release notes/user communication and regression tests are appropriate. Silent dual behavior based on where data came from would undermine deterministic planning and stable identity.

## 36. Recurrence Semantic-Versioning Determination

**Recommended:** no recurrence semantic-version discriminator is required for this correction. Retaining legacy window-sensitive behavior for old payloads would make identical authored recurrence data produce different plans based on storage provenance and would block a single stable occurrence identity contract.

**Deferred:** future richer weekly weekdays/spacing or materially different slot allocation must introduce explicit authored fields and, if necessary, a recurrence semantic version. Occurrence identity itself remains explicitly versioned per Task 2.7.

## 37. Profile / Backup Implications

**Confirmed:** existing profiles and V1 backups carry recurrence definitions, not generated occurrences. After canonicalization they may regenerate different partial-window previews in the affected cases.

**Recommended:** load/import uses the corrected current recurrence engine without migration or provenance-specific legacy mode. Original durable recurrence data remains intact. Documentation should state the corrected semantics; no profile or backup format changes are warranted.

## 38. Stable-Occurrence-Identity Implications

**Recommended:** after implementation, Task 2.7's target keys are safe for week-scoped templates:

- weekly: template + recurrence + canonical effective week key + slot 0;
- N-per-week: template + recurrence + canonical effective week key + slot `0..N-1`;
- the canonical assigned user-day is deterministic metadata/result under the recurrence contract.

**Deferred prerequisite:** source incarnation/ID-reuse protection remains unresolved and is independent of recurrence canonicalization.

## 39. Required Behavioral Invariants

1. **Recommended:** requested windows never choose replacement occurrences.
2. **Recommended:** weekly canonical date is independent of window start/end.
3. **Recommended:** N-per-week canonical slot/date mapping is independent of window start/end.
4. **Recommended:** daily and specific-weekday shared occurrence behavior remains unchanged.
5. **Recommended:** inclusive recurrence bounds define canonical eligibility before allocation.
6. **Recommended:** partial requested windows never repack or renumber slots.
7. **Recommended:** effective week keys follow per-user-day effective scheduling preferences.
8. **Recommended:** every relevant effective week key is processed once per recurrence.
9. **Recommended:** canonical expansion precedes generation-window clipping.
10. **Recommended:** equivalent recurrence/preference inputs yield equivalent canonical occurrence sets.
11. **Recommended:** placement, overnight span, display filtering, and engine timestamps do not affect recurrence occurrence date/slot.
12. **Recommended:** unsupported recurrence types remain unsupported until they define canonical scope and slot semantics.

## 40. Required Later Test Contract

**Recommended implementation tests:** 

- unchanged daily and specific-weekday outputs;
- weekly full week, midweek narrow window, narrow→wide, and wide→narrow;
- N-per-week full weeks for N=1, 2, 3, 7, and greater than available days;
- N-per-week partial requested windows with canonical slots before/inside/after the window;
- inclusive start/end bounds;
- partial first and last weeks for weekly and multiple N values;
- recurrence bounded to zero valid days in a relevant week;
- global Saturday/Monday and other week starts;
- segment-effective week-start transitions and irregular key buckets;
- non-midnight user-day boundary and edge overlap;
- overnight placement preserving canonical day/slot;
- engine ±1-day buffer not changing slot selection;
- duplicate key prevention across multiple discovery dates/buffer overlap;
- deterministic order under recurrence/template input permutations where promised;
- store/profile/backup-loaded recurrence producing the same canonical behavior as directly supplied data.

## 41. Architectural Alignment Assessment

| Principle | Assessment | Finding |
|---|---|---|
| deterministic planning | Aligned | occurrence selection depends on complete semantic scope, not request truncation |
| explicit authority | Aligned | recurrence fields/preferences determine existence; windows select output |
| occurrence identity | Aligned | week key + stable slot becomes safe after implementation |
| provenance | Aligned | date/slot traces to recurrence, bounds, and effective week key |
| explainability | Aligned | “first valid day(s) of your user week” is direct and inspectable |
| durable-data compatibility | Partially aligned | behavior correction affects regeneration but not stored representation |
| user-data preservation | Aligned | durable recurrence objects are unchanged |
| future PlanDecision semantics | Aligned | targets no longer move with window selection |
| implementation complexity | Aligned/Moderate | week enumeration is bounded and localized, but effective-preference transitions need care |

## 42. Open Questions

- **Unresolved:** exact implementation strategy for discovering complete per-day-effective week buckets around a preference transition.
- **Unresolved:** whether later product semantics should prohibit or explicitly model midweek `weekStartsOn` transitions.
- **Deferred:** richer weekly nominal-day, preferred-day, and spacing intent.
- **Deferred:** source incarnation/ID-reuse protection from Task 2.7.
- **Deferred:** `perShiftSegment`, `custom`, explicit timezone architecture, and occurrence identity representation.

These questions do not block the normal and per-day-effective canonical contract; Task 2.9 must make transition enumeration explicit and test it.

## 43. Recommended Next Task

**Recommended:** **Task 2.9 — Implement Canonical Window-Invariant Recurrence Expansion**.

Its bounded scope should change only week-scoped candidate expansion and direct tests; preserve daily/specific-weekday, placement, Preview filtering, persistence, and UI; enumerate/deduplicate complete effective week buckets; apply bounds; allocate canonical slots; clip afterward; and verify transition/buffer behavior.

Only after Task 2.9 passes should a later task introduce explicit versioned `OccurrenceIdentity` alongside runtime IDs.

## 44. Deviations

**Confirmed:** none. No production code, tests, recurrence/type/engine behavior, identity, persistence, profile, backup, Preview, UI, or governance document changed.

## 45. Discoveries and Deferred Work

**Confirmed discovery:** the direct weekly test explicitly demonstrates the defect by assigning a week-keyed occurrence to the last day of that week because that is the first represented date. **Confirmed discovery:** the UI supplies no evidence for even distribution or fixed positions. **Confirmed discovery:** segment-specific `weekStartsOn` is resolved per date and can form irregular effective-key buckets. **Confirmed discovery:** historical Git evidence is insufficient to establish a competing legacy product promise.

**Deferred:** implementation, test updates, explicit occurrence identity, source incarnation, PlanDecision, semantic enrichment, and any governance-document adoption.

## 46. Validation

**Confirmed:** required recurrence implementation, direct tests, user-day/week utilities, effective preferences, engine buffer/filtering, Setup wording, durable recurrence boundaries, and available history were inspected. Existing algorithms/tests were sufficient to establish current behavior; no executable test run or modification was necessary.

**Confirmed:** the immutable artifact hash and required final sentence were verified. Only this separate result artifact was created for Task 2.8. Existing cumulative working-tree changes from prior completed tasks were not modified. No governance or durable format changed.

## 47. Final Completion Determination

**Confirmed complete:** DayFrame now has an evidence-backed canonical recurrence-expansion contract. Weekly means the first recurrence-valid day of each complete effective user-week; N-per-week means the first N recurrence-valid days with stable canonical slots; inclusive recurrence bounds define partial boundary weeks; requested/engine windows only clip after allocation; daily and specific-weekday semantics remain unchanged; compatibility and versioning consequences are explicit; and Task 2.9 can implement the scheduling correction required before stable occurrence identity is introduced.
