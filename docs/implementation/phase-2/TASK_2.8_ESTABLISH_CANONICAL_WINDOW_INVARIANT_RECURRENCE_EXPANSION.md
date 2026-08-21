# Task 2.8 — Establish Canonical Window-Invariant Recurrence Expansion

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.8

**Task Name:** Establish Canonical Window-Invariant Recurrence Expansion

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Scheduling-Contract Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning the investigation, verify that this task artifact is complete and record its integrity hash.

Record the investigation outcome in a separate result artifact:

`TASK_2.8_ESTABLISH_CANONICAL_WINDOW_INVARIANT_RECURRENCE_EXPANSION_RESULT.md`

The result artifact should document:

* current recurrence expansion behavior;
* current generation-window interaction;
* daily recurrence semantics;
* specific-weekday recurrence semantics;
* weekly recurrence semantics;
* `timesPerUserWeek` semantics;
* recurrence-boundary behavior;
* effective week-start behavior;
* user-day-boundary behavior;
* canonical occurrence-domain definition;
* canonical weekly nominal-day decision;
* canonical `timesPerUserWeek` slot-allocation decision;
* full-week versus clipped-window behavior;
* recurrence-start/end interaction;
* partial-week behavior;
* deterministic ordering;
* behavior-change assessment;
* compatibility implications;
* stable-occurrence-identity implications;
* test implications;
* selected recurrence contract;
* recommended next task;
* validation;
* final completion determination.

This task is investigation and architectural decision only.

Do not modify production code, tests, recurrence types, recurrence expansion, scheduling behavior, identity types, engine APIs, persistence, profiles, backups, durable formats, Preview behavior, or UI.

If the evidence does not support a defensible weekly or `timesPerUserWeek` semantic without a separate product decision, identify that blocker explicitly rather than silently choosing a convenient algorithm.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Phase 2 Context;
* Governing Evidence;
* Objective;
* Current Recurrence Audit;
* Canonical Expansion Principle;
* Weekly Semantics;
* `timesPerUserWeek` Semantics;
* Recurrence Boundary Semantics;
* Window Clipping;
* Candidate Models;
* Decision Standard;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed canonical recurrence-expansion contract defining which weekly and `timesPerUserWeek` occurrences exist independently of the requested planning window, how those occurrences are assigned to complete semantic user-weeks and recurrence bounds, how they are clipped for generation, and what scheduling behavior must be implemented before stable occurrence identity can safely be introduced.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the discrepancy for project review.

---

# Purpose

Resolve the prerequisite blocker identified by Task 2.7.

Task 2.7 established that stable occurrence identity requires:

```text
authoritative recurrence
    ↓
canonical occurrence expansion
    ↓
stable occurrence identity / slot
    ↓
window clipping
    ↓
placement
```

Current DayFrame behavior instead allows the requested planning window to participate in occurrence selection for week-scoped recurrence types.

For:

```text
weekly
timesPerUserWeek
```

this can change which date represents the logical occurrence when the requested window changes.

Task 2.8 defines recurrence semantics independently of requested-window truncation.

---

# Phase 2 Context

The dependency chain is now:

```text
Task 2.6
PlanDecision authority
        ↓
Task 2.7
Occurrence identity contract
        ↓
Task 2.8
Canonical recurrence semantics
        ↓
future explicit OccurrenceIdentity
        ↓
future PlanDecision representation
```

Task 2.7 established that:

* daily recurrence is overlap-stable for shared user-days;
* specific-weekday recurrence is overlap-stable for shared matching user-days;
* weekly recurrence is window-sensitive;
* `timesPerUserWeek` is critically window-sensitive;
* a one-day engine expansion buffer does not establish complete semantic user-week expansion.

Task 2.8 must resolve the two week-scoped recurrence contracts before identity implementation.

---

# Governing Evidence

Use current executable behavior as the primary source.

Relevant architectural principles include:

* deterministic planning;
* explicit authority;
* information provenance;
* explainability;
* stable generated-occurrence identity;
* user-day semantics;
* user-week semantics;
* separation of occurrence existence from display/window clipping.

Task 2.7 established the required architectural ordering:

```text
canonical recurrence expansion
    ↓
identity
    ↓
window clipping
```

Task 2.8 must define what canonical expansion actually means.

---

# Objective

Determine:

1. what recurrence expansion owns;
2. what the requested planning window owns;
3. what a complete semantic user-week means;
4. what canonical `weekly` means;
5. what canonical `timesPerUserWeek` means;
6. how N weekly slots map to user-days;
7. how recurrence `startsOnDate` and `endsOnDate` constrain canonical weeks;
8. how partial first/last recurrence weeks behave;
9. how effective `weekStartsOn` participates;
10. how user-day boundaries participate;
11. whether daily/specific-weekday behavior should remain unchanged;
12. whether current weekly behavior should be preserved, revised, or formally deprecated;
13. which behavior changes a later implementation must make;
14. what direct tests must protect those semantics;
15. when explicit `OccurrenceIdentity` can safely be implemented.

---

# Core Canonical Expansion Principle

Evaluate and, if supported, adopt:

> Recurrence expansion determines the complete logical set of occurrences from authoritative recurrence semantics. The requested planning window determines only which of those canonical occurrences are returned for the current generation.

Conceptually:

```text
recurrence definition
    +
effective schedule semantics
    ↓
canonical logical occurrences
    ↓
clip to requested generation domain
```

not:

```text
requested generation domain
    ↓
available represented dates
    ↓
choose recurrence occurrences from those dates
```

---

# Occurrence Existence Versus Visibility

Explicitly separate:

```text
occurrence exists canonically
```

from:

```text
occurrence is included in this generated window
```

A requested range beginning midweek must not create a replacement occurrence merely because the canonical occurrence for that week lies before the requested range.

Likewise, widening the range must not rename or move an occurrence that already existed canonically.

---

# Current Recurrence Audit

Inspect current behavior for:

* `daily`;
* `weekly`;
* `specificWeekdays`;
* `timesPerUserWeek`;
* declared but unsupported `perShiftSegment`;
* declared but unsupported `custom`.

Produce:

| Frequency | Current Selection Domain | Canonical Today? | Window Sensitive? | Task 2.8 Decision Needed? |
| --------- | ------------------------ | ---------------: | ----------------: | ------------------------: |

---

# Daily Recurrence

Task 2.7 found current daily behavior overlap-stable.

Confirm whether the intended semantic contract remains:

> One occurrence for every eligible logical user-day within recurrence bounds.

Canonical expansion should conceptually determine daily occurrences from recurrence validity, then clip to requested output.

If current implementation already behaves equivalently for represented days, preserve it.

Do not change daily behavior merely to make all algorithms structurally identical.

---

# Specific-Weekday Recurrence

Confirm whether intended semantics remain:

> One occurrence on each recurrence-valid user-day whose weekday matches the authored weekday set.

Changing the requested generation window should change only which matching canonical occurrences are returned, not which dates count as matching occurrences.

Preserve current behavior if already aligned.

---

# Weekly Recurrence — Current Behavior

Trace current code precisely.

Task 2.7 found current semantics equivalent to:

```text
represented eligible user-days
    ↓
group by effective user-week
    ↓
select first represented day in each group
```

Confirm:

* grouping algorithm;
* eligibility rules;
* week-key calculation;
* recurrence bounds;
* how window start affects first represented day;
* how overlap-edge expansion affects selection.

---

# Weekly Semantic Question

Explicitly answer:

> On what canonical user-day does one `weekly` recurrence occur?

The answer cannot remain:

> Whichever eligible day is represented first in this requested window.

Candidate interpretations must be compared.

---

# Weekly Candidate Model A — User-Week Start Day

Model:

```text
one weekly occurrence
    → canonical userWeekStartDate
```

subject to recurrence bounds.

Assess:

* simplicity;
* current user expectations;
* existing week-start preference semantics;
* recurrence start/end edges;
* night-shift/user-day behavior;
* compatibility with existing generated schedules.

---

# Weekly Candidate Model B — Recurrence Start-Day Alignment

Model:

```text
weekly occurrence nominal weekday
    → weekday of startsOnDate
```

then one occurrence on that weekday of each subsequent user-week.

Assess whether current recurrence data supports this meaning and whether it is more intuitive than week-start placement.

---

# Weekly Candidate Model C — First Canonically Eligible Day Of Full User-Week

Model:

```text
complete semantic user-week
    ↓
intersect recurrence bounds
    ↓
first eligible canonical day
```

Unlike current behavior, eligibility is calculated against the full semantic week rather than requested-window truncation.

Assess:

* partial first/last weeks;
* behavior when recurrence begins midweek;
* behavior when recurrence ends midweek;
* relationship to current behavior.

---

# Weekly Candidate Model D — Explicit Authored Weekday Required

Model:

```text
weekly
    requires explicit nominal weekday
```

This may provide stronger semantics but would require authored schema/UI changes.

Assess and likely defer unless existing data already contains sufficient semantics.

---

# Required Weekly Model Matrix

Produce:

| Model                          | Window-Invariant | Uses Current Schema | Handles Partial First Week | Explainable | Behavior Drift | Future Identity Fit | Recommendation |
| ------------------------------ | ---------------: | ------------------: | -------------------------: | ----------: | -------------: | ------------------: | -------------- |
| user-week start                |                  |                     |                            |             |                |                     |                |
| startsOnDate weekday alignment |                  |                     |                            |             |                |                     |                |
| first canonically eligible day |                  |                     |                            |             |                |                     |                |
| explicit authored weekday      |                  |                     |                            |             |                |                     |                |

---

# Weekly Nominal-Day Decision

Adopt one canonical meaning or identify the precise blocker preventing adoption.

The result must state:

```text
weekly recurrence W
in semantic user-week K
    → canonical occurrence date D
```

before clipping.

This decision must be deterministic and independent of requested window.

---

# `timesPerUserWeek` — Current Behavior

Trace the current algorithm precisely.

Task 2.7 found:

```text
represented eligible days in week
    ↓
take first N represented days
```

with implicit slot indexes from array order.

Confirm:

* exact eligibility;
* ordering;
* recurrence bounds;
* effective week start;
* partial-week behavior;
* N validation;
* whether slots are retained anywhere.

---

# `timesPerUserWeek` Semantic Question

Explicitly answer:

> Given N and one canonical user-week, which logical N occurrence slots exist and to which canonical user-days are they assigned?

The mapping must be defined from the complete semantic week, not the requested window.

---

# Candidate Slot Model A — First N Canonically Eligible Days

Model:

```text
full semantic user-week
    ↓
recurrence-valid eligible days
    ↓
take first N
```

Assess:

* simplicity;
* similarity to current behavior;
* partial-week behavior;
* clustering;
* explainability.

---

# Candidate Slot Model B — Even Distribution Across Eligible Week

Model:

For N occurrences, distribute them as evenly as possible across the recurrence-valid user-week.

Examples might conceptually approximate:

```text
N=2 → early + later week
N=3 → early + middle + late
```

Assess:

* product intent evidence;
* complexity;
* deterministic tie-breaking;
* behavior drift.

Do not adopt merely because it appears “better scheduling.”

---

# Candidate Slot Model C — Deterministic Week Slots Independent Of Eligibility

Model:

```text
canonical week positions
    ↓
map N slots
    ↓
resolve valid days
```

Assess whether current recurrence data supports this.

---

# Candidate Slot Model D — Authored Preferred Weekdays / Slots

Would require richer authored recurrence semantics.

Assess as future direction, not current implementation unless evidence supports it.

---

# Required `timesPerUserWeek` Model Matrix

Produce:

| Model                           | Window-Invariant | Uses Current Schema | Deterministic | Explainable | Similar To Current Behavior | Future Flexibility | Recommendation |
| ------------------------------- | ---------------: | ------------------: | ------------: | ----------: | --------------------------: | -----------------: | -------------- |
| first N canonical eligible days |                  |                     |               |             |                             |                    |                |
| evenly distributed              |                  |                     |               |             |                             |                    |                |
| deterministic abstract slots    |                  |                     |               |             |                             |                    |                |
| authored preferred slots/days   |                  |                     |               |             |                             |                    |                |

---

# Slot Identity

Once canonical mapping is decided, define:

```text
userWeekStartDate + slotIndex
```

or the chosen equivalent as the logical slot identity.

The slot index must derive from the canonical complete-week algorithm, not array position after window clipping.

---

# Complete Semantic User-Week

Define exactly what a semantic user-week is.

At minimum address:

* `weekStartsOn`;
* user-day labels;
* seven consecutive user-days;
* segment-effective preference changes.

Determine whether one week may contain dates evaluated under differing effective `weekStartsOn` values.

If so, identify how canonical grouping currently works and whether a stronger invariant is needed.

---

# Effective Week-Start Changes

Task 2.7 found segment-effective preferences can change `weekStartsOn` by date.

Investigate whether this can produce:

* overlapping user-week keys;
* discontinuous week membership;
* different week keys within what would ordinarily be one seven-day span.

Determine whether recurrence expansion currently handles this deterministically.

Do not redesign preference ownership unless required to define canonical weeks.

---

# Candidate Effective-Week Policy A — Evaluate Per User-Day

Current-style semantic:

```text
each user-day resolves effective weekStartsOn
    ↓
derive its own week key
```

Assess whether canonical week expansion can safely operate this way.

---

# Candidate Effective-Week Policy B — Week Boundary Fixed At Canonical Scope Start

A week uses the preference resolved at its start/source.

Assess complexity and compatibility.

---

# Required Effective-Week Determination

Explicitly state how canonical recurrence grouping behaves when effective week-start preferences vary across dates.

If current evidence shows this situation is impossible or constrained, document that.

---

# Recurrence Bounds

Inspect:

```text
startsOnDate
endsOnDate
```

or equivalent recurrence validity fields.

Define whether canonical expansion:

1. establishes the complete semantic week;
2. intersects it with recurrence validity;
3. allocates occurrence(s) among remaining valid days;

or uses another rule.

---

# Partial First Week

Example:

```text
user week: Sat–Fri
recurrence starts: Wednesday
weekly recurrence
```

Determine whether the first recurrence occurrence:

* occurs Wednesday;
* waits until next Saturday/week;
* follows nominal weekday if still available;
* follows another adopted rule.

This must be explicit.

---

# Partial Last Week

Equivalent:

```text
user week: Sat–Fri
recurrence ends: Tuesday
```

Define weekly and `timesPerUserWeek` behavior.

For N-per-week, determine whether a partial final week:

* emits up to N occurrences from available recurrence-valid days;
* requires all N;
* prorates;
* follows another contract.

---

# Boundaries And Slot Count

For `timesPerUserWeek`, explicitly answer:

> Does “N times per user week” mean N only for full recurrence-valid weeks, or up to N for partial recurrence-boundary weeks?

Current behavior may implicitly choose up to N available represented days.

Decide intentionally.

---

# Candidate Partial-Week Model A — Up To N Valid Canonical Slots

Partial first/last weeks emit only slots whose canonical assigned days fall inside recurrence validity.

Assess.

---

# Candidate Partial-Week Model B — Repack N Into Remaining Valid Days

Example:

```text
normal slots: Sat, Wed
recurrence begins Tue
    → repack both into Tue–Fri?
```

Assess whether this would change slot identity and undermine recurrence continuity.

Likely risky.

---

# Candidate Partial-Week Model C — Skip Partial Week

Assess whether supported by product semantics.

---

# Required Partial-Week Matrix

Produce:

| Model                  | Stable Slot Identity | Predictable | Similar To Current Behavior | User Expectation | Recommendation |
| ---------------------- | -------------------: | ----------: | --------------------------: | ---------------: | -------------- |
| clip canonical slots   |                      |             |                             |                  |                |
| repack remaining slots |                      |             |                             |                  |                |
| skip partial week      |                      |             |                             |                  |                |

---

# Recommended Bias For Partial Weeks

Prefer:

```text
canonical slots first
    ↓
recurrence-bound clipping
```

rather than reassigning slot meaning because the recurrence starts or ends midweek.

This preserves identity stability.

Evaluate rather than assume.

---

# Requested Planning Window

Define requested planning window as an **output-selection boundary**, not an occurrence-definition boundary.

The recurrence algorithm may inspect dates outside the requested window as necessary to establish canonical week semantics.

---

# Window Clipping Contract

Explicitly define when an occurrence is returned.

Possible rule:

> A canonical occurrence is included if its canonical user-day belongs to the generation domain after recurrence bounds are applied.

Distinguish this from whether its final placed interval overlaps the visible Preview window.

---

# Generation Domain Versus Display Domain

Task 2.1 found DayFrame already distinguishes planning window and displayed Preview range to some extent.

Task 2.8 should clarify:

```text
canonical recurrence domain
generation domain
display range
```

without redesigning Preview range.

Only define what recurrence expansion needs.

---

# Engine ±1-Day Expansion

Current schedule generation expands the planning window by one day on each side.

Determine:

* why;
* what behaviors rely on it;
* whether canonical week expansion should happen inside or outside that buffer;
* whether it remains necessary after canonical recurrence selection.

Do not remove it.

---

# Candidate Expansion Architecture

Assess:

```text
requested planning window
    ↓
determine complete semantic weeks intersecting it
    ↓
expand recurrence canonically over those full scopes
    ↓
apply recurrence bounds
    ↓
assign stable slots
    ↓
clip canonical occurrence dates
    ↓
candidate materialization
```

This is conceptual only.

---

# Daily / Specific-Weekday Preservation

Canonicalization must not unintentionally move or remove currently valid daily/specific-weekday occurrences.

The result must classify whether those types require implementation changes at all.

Preferred outcome may be:

```text
daily
specificWeekdays
    → semantic behavior already canonical enough
```

while only week-scoped recurrence is changed.

---

# Unsupported Recurrence Types

`perShiftSegment` and `custom` remain unsupported.

Do not invent canonical semantics for them.

Record:

* no current behavior;
* future recurrence type must define stable canonical scope/slot semantics before becoming supported.

---

# Ordering Semantics

Canonical occurrence ordering must be deterministic.

Determine likely ordering:

1. canonical user-day/date;
2. recurrence identity;
3. stable slot/discriminator;

or equivalent.

Do not rely on incidental array order.

---

# Duplicate Prevention

Define how canonical expansion prevents duplicate logical occurrences when:

* full semantic weeks are expanded from multiple overlapping requested dates;
* buffer windows overlap week scopes;
* recurrence ranges span multiple weeks.

A canonical week key should be processed once per recurrence.

---

# Week-Key Enumeration

Determine how the implementation should conceptually identify all semantic user-weeks intersecting the required expansion domain without deriving them solely from already-clipped eligible dates.

This may require:

```text
enumerate canonical week keys
```

then expand each complete week.

Do not implement.

---

# Window Invariance Contract

Adopt:

> For any two requested generation windows, canonical occurrences whose semantic keys lie in both relevant output domains have identical logical occurrence dates, slots, and future occurrence identities.

Provide formal examples.

---

# Required Invariance Examples

At minimum evaluate:

## Example 1 — Weekly Narrow/Wide

Saturday-start week.

Compare:

```text
Window A: Wed–Fri
Window B: Sat–Fri
```

Canonical weekly occurrence must not move merely because B includes earlier days.

---

## Example 2 — `timesPerUserWeek = 2`

Same week.

Compare a partial midweek window with a full-week window.

Slots must have one canonical date assignment.

---

## Example 3 — Partial First Week

Recurrence begins midweek.

Compare windows beginning before and after recurrence start.

---

## Example 4 — Partial Last Week

Recurrence ends midweek.

---

## Example 5 — Changed `weekStartsOn`

Determine whether this represents a semantic authored change that legitimately produces different week keys.

---

## Example 6 — Overnight Placement

Canonical occurrence day remains unchanged even if eventual placement crosses calendar midnight.

---

# Behavior Change Assessment

Task 2.8 must identify all current cases where adopting canonical semantics would produce a different schedule.

At minimum:

* weekly generation in partial represented weeks;
* `timesPerUserWeek` generation in partial represented weeks;
* recurrence boundary weeks;
* possibly effective week-start boundaries.

Produce:

| Scenario | Current Behavior | Adopted Canonical Behavior | User-Visible Change? | Test Impact |
| -------- | ---------------- | -------------------------- | -------------------: | ----------- |

---

# Existing Test Contract Audit

Inspect tests that currently encode weekly or `timesPerUserWeek` behavior.

Classify each as:

* desired semantic contract;
* current implementation behavior only;
* boundary regression;
* likely needs update after decision.

Do not update tests in Task 2.8.

---

# Historical Product Intent

Search historical implementation/task documentation where useful for why weekly and `timesPerUserWeek` were introduced.

Historical intent may inform interpretation but is not sufficient to override current architectural requirements.

Label clearly.

---

# Product Semantics

Inspect current UI wording for recurrence configuration.

If users currently select only:

```text
weekly
times per user week = N
```

without selecting weekdays or spacing preferences, the canonical algorithm must respect that limited authored intent.

Do not silently invent preferences the user never authored.

---

# Principle — Do Not Smuggle Optimization Into Recurrence Meaning

Task 2.8 is not an optimization task.

For example:

```text
timesPerUserWeek = 3
```

does not automatically mean:

```text
spread these optimally across the week
```

unless the product contract supports that interpretation.

Scheduling optimization belongs elsewhere.

Prefer the simplest deterministic recurrence semantics supported by authored intent.

---

# Weekly Decision Standard

The chosen weekly model should:

1. be window-invariant;
2. use current authored data where possible;
3. be deterministic;
4. be explainable;
5. handle recurrence-boundary partial weeks;
6. respect effective week semantics;
7. support stable slot identity;
8. avoid hidden scheduling optimization;
9. minimize unnecessary behavior drift.

---

# `timesPerUserWeek` Decision Standard

The chosen model should:

1. establish N semantic slots independent of requested window;
2. use current authored data;
3. preserve deterministic ordering;
4. avoid hidden optimization;
5. handle partial recurrence weeks;
6. support stable slot identity;
7. work with user-day/week boundaries;
8. remain explainable;
9. permit future richer recurrence rules without reinterpreting existing identity versions.

---

# Candidate Overall Model A — Canonical First Eligible Days

Conceptually:

```text
complete semantic user-week
    ↓
recurrence-valid days in canonical order
    ↓
weekly: first eligible day
timesPerUserWeek: first N eligible days
    ↓
assign slots
    ↓
clip requested window
```

Assess carefully.

This may be the closest window-invariant formalization of current behavior without introducing new scheduling preferences.

---

# Candidate Overall Model B — Canonical Week Start / Fixed Slots

Weekly always at week start; N-per-week uses fixed canonical positions.

Assess whether this invents more semantics than current data contains.

---

# Candidate Overall Model C — Richer Authored Recurrence Required

Refuse to define week-scoped behavior until users specify nominal weekdays/spacing.

Assess whether this is justified or unnecessarily blocks existing supported behavior.

---

# Required Overall Model Matrix

Produce:

| Model                              | Uses Existing Authored Intent | Window-Invariant | Minimal Behavior Drift | Supports Stable Identity | Explainable | Requires Schema Change | Recommendation |
| ---------------------------------- | ----------------------------: | ---------------: | ---------------------: | -----------------------: | ----------: | ---------------------: | -------------- |
| canonical first eligible day(s)    |                               |                  |                        |                          |             |                        |                |
| fixed canonical positions          |                               |                  |                        |                          |             |                        |                |
| require richer authored recurrence |                               |                  |                        |                          |             |                        |                |

---

# Compatibility Classification

Current Preview outputs are derived and non-durable.

Therefore changing recurrence expansion does not require migration merely because old generated schedules differ.

However, authored recurrence semantics are user intent.

Assess whether changing the meaning of an existing saved `weekly` or `timesPerUserWeek` recurrence constitutes:

* bug correction/alignment;
* semantic behavior change;
* compatibility-sensitive change requiring explicit communication/versioning.

Do not assume derived output means semantics are free to change silently.

---

# Durable-Data Implications

Current recurrence definitions are persisted in:

* active state;
* profiles;
* backups.

If Task 2.8 changes the interpretation of existing recurrence fields, determine whether future implementation needs:

* no durable schema change;
* a recurrence semantic-version marker;
* migration;
* compatibility interpretation by data version;
* explicit governance.

Do not implement any.

---

# Backup/Profile Implications

Profiles/backups containing existing recurrence definitions may regenerate different schedules under canonical semantics.

Assess whether that is acceptable under the adopted compatibility contract or requires preserving old expansion behavior for legacy recurrence data.

This is important because recurrence semantics—not just representation—can be part of durable-data compatibility.

---

# Recurrence Semantic Versioning Question

Explicitly answer:

> Does canonicalizing current weekly / `timesPerUserWeek` behavior change the semantic contract enough that durable recurrence data needs a version discriminator?

Possible outcomes:

* no: current behavior is considered an implementation defect and canonicalization is the intended meaning;
* yes: historical recurrence definitions must retain old semantics;
* unresolved pending release-history evidence.

This must be addressed before implementation if behavior changes materially.

---

# Existing User Exposure

Use repository/release history where useful to assess whether users could have persisted these recurrence types under current semantics.

If yes, treat semantic reinterpretation conservatively.

Do not infer zero exposure from project maturity alone.

---

# Stable Occurrence Identity Implications

Task 2.8's adopted semantics must be strong enough that Task 2.9 can define:

```text
weekly:
    recurrence + canonical week key + slot

timesPerUserWeek:
    recurrence + canonical week key + slot 0..N-1
```

with stable canonical assigned days.

If not, Task 2.8 is incomplete.

---

# Source Incarnation Deferral

Task 2.7 also identified authored ID reuse/source incarnation as unresolved.

Task 2.8 should not solve it unless recurrence semantics depend on it.

Record it as a later identity prerequisite.

Canonical recurrence expansion is the current blocker.

---

# Required Behavioral Invariants

The result should establish later implementation invariants.

At minimum consider:

1. requested window never chooses a replacement occurrence;
2. canonical weekly occurrence date is independent of window start/end;
3. canonical N-per-week slot/date mapping is independent of window start/end;
4. daily and specific-weekday shared occurrences retain current meaning;
5. recurrence bounds clip canonical occurrence eligibility deterministically;
6. partial weeks never repack slot identities merely because dates are excluded;
7. canonical week keys follow the adopted effective week-start rule;
8. canonical expansion precedes requested-window clipping;
9. equivalent recurrence inputs produce equivalent occurrence sets;
10. future identity may safely reference canonical scope + slot.

---

# Required Later Test Contract

Do not add tests now.

Specify implementation tests covering at minimum:

* daily regression;
* specific-weekday regression;
* weekly full week;
* weekly midweek narrow window;
* weekly narrow → wide;
* weekly wide → narrow;
* `timesPerUserWeek` full week for N=1,2,3+;
* `timesPerUserWeek` partial requested window;
* N greater than recurrence-valid days;
* partial first recurrence week;
* partial last recurrence week;
* `startsOnDate`;
* `endsOnDate`;
* custom global `weekStartsOn`;
* segment-effective week-start changes;
* user-day boundary;
* overnight placement independence;
* engine ±1-day buffer;
* duplicate prevention;
* deterministic ordering;
* profile/backup loaded recurrence behavior if compatibility policy requires it.

---

# Architectural Alignment Assessment

Assess the selected contract against:

* deterministic planning;
* explicit authority;
* occurrence identity;
* information provenance;
* explainability;
* durable-data compatibility;
* user-data preservation;
* future PlanDecision semantics;
* implementation complexity.

Use:

* Aligned
* Partially aligned
* Misaligned
* Unresolved

---

# Required Investigation Labels

Every significant conclusion must be labeled:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Distinguish clearly among:

```text
current executable semantics
adopted future semantics
compatibility obligations
implementation recommendations
```

---

# Explicit Non-Goals

Task 2.8 shall not:

* modify recurrence code;
* modify tests;
* add occurrence identity;
* change runtime IDs;
* add PlanDecision;
* add plan overrides;
* change placement;
* add preferred weekdays to recurrence;
* add spacing optimization;
* add first-class timezone support;
* change Preview range;
* change UI;
* change persistence;
* add durable versions;
* migrate recurrence data;
* change profiles;
* change backups;
* change clear behavior;
* solve source-incarnation identity;
* implement unsupported recurrence types;
* refactor the engine;
* update governance documents before review.

---

# Dependencies

Requires completion and acceptance of:

* Task 2.1 — Authoritative and Derived State Boundary;
* Task 2.4 — Suggested-Fix and Preview-Revision Authority;
* Task 2.5 — Stale Suggested-Fix Safety;
* Task 2.6 — User-Owned Plan Override Semantics;
* Task 2.7 — Stable Generated-Occurrence Identity.

Task 2.2–2.3 startup authority alignment remains preserved.

Governed by:

* Architecture Charter;
* Complete Architecture Specification;
* `DECISIONS.md`;
* durable-data ADR;
* Phase 1 checkpoint;
* accepted Phase 2 findings.

---

# Evidence Standards

Priority:

1. current recurrence expansion implementation;
2. direct recurrence tests;
3. user-day/week utilities;
4. effective scheduling-preference logic;
5. persisted recurrence model;
6. current UI recurrence semantics;
7. release/history evidence where compatibility matters;
8. architecture/governance decisions.

Do not choose a behavior merely because it is easiest to code.

---

# Required Code Inspection

At minimum inspect:

```text
BlockRecurrence
BlockTemplate
generateBlockCandidates
generateSchedulePreview
getUserDayDate
getUserWeekStartDate
effective scheduling-preference resolution
applyTimeToUserDay
recurrence validation
profile/backup normalization
```

Also inspect all direct tests covering:

```text
daily
weekly
specificWeekdays
timesPerUserWeek
weekStartsOn
user-day boundaries
recurrence starts/ends
```

and historical implementation evidence where useful.

---

# Required Result Artifact Structure

The Task 2.8 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Recurrence Model
5. Canonical Expansion Principle
6. Occurrence Existence Versus Visibility
7. Daily Semantics
8. Specific-Weekday Semantics
9. Current Weekly Semantics
10. Weekly Candidate Models
11. Weekly Model Matrix
12. Adopted Weekly Contract
13. Current `timesPerUserWeek` Semantics
14. `timesPerUserWeek` Candidate Models
15. `timesPerUserWeek` Model Matrix
16. Adopted Slot Allocation Contract
17. Complete Semantic User-Week
18. Effective Week-Start Semantics
19. Recurrence Start/End Semantics
20. Partial First Week
21. Partial Last Week
22. Partial-Week Model Matrix
23. Adopted Partial-Week Contract
24. Requested Window Semantics
25. Generation Versus Display Domain
26. Engine Buffer Assessment
27. Canonical Expansion / Clipping Contract
28. Duplicate Prevention
29. Deterministic Ordering
30. Required Window-Invariance Examples
31. Behavior Change Matrix
32. Existing Test Contract Assessment
33. Product-Semantics Assessment
34. Historical Exposure Assessment
35. Compatibility Classification
36. Recurrence Semantic-Versioning Determination
37. Profile / Backup Implications
38. Stable-Occurrence-Identity Implications
39. Required Behavioral Invariants
40. Required Later Test Contract
41. Architectural Alignment Assessment
42. Open Questions
43. Recommended Next Task
44. Deviations
45. Discoveries and Deferred Work
46. Validation
47. Final Completion Determination

---

# Expected Decision Outcomes

Several outcomes are valid.

## Outcome A — Canonical First Eligible Day(s)

Formalize existing recurrence intent as:

```text
full semantic user-week
    ↓
recurrence-valid days
    ↓
weekly: first valid day
timesPerUserWeek: first N valid days
    ↓
stable slots
    ↓
window clipping
```

This likely minimizes behavioral invention.

## Outcome B — Fixed Canonical Week Positions

Adopt specific canonical positions independent of current represented-day behavior.

This requires strong product evidence.

## Outcome C — Richer Recurrence Intent Required

Conclude current schema is insufficient to define stable week-scoped behavior without new authored recurrence semantics.

Then the next task must establish those authored semantics before identity work.

## Outcome D — Compatibility Blocker

A preferred canonical behavior is clear, but historical persisted recurrence semantics require a compatibility/version decision before implementation.

Then Task 2.9 should address recurrence-semantic versioning rather than occurrence identity.

---

# Recommended Decision Bias

Where current authored data says only:

```text
weekly
```

or:

```text
timesPerUserWeek = N
```

do not invent hidden optimization preferences.

Prefer the simplest deterministic interpretation consistent with existing user intent and stable identity.

That likely means formalizing a canonical ordering over the complete semantic user-week rather than adding unexpressed spacing or preferred-day behavior.

But the investigation must decide from evidence.

---

# Expected Follow-Up

Do not assume Task 2.9 is identity implementation.

Possible next tasks include:

### If canonical semantics are accepted without compatibility blocker

> **Task 2.9 — Implement Canonical Window-Invariant Recurrence Expansion**

followed by explicit occurrence identity implementation.

### If recurrence semantic versioning is required

> **Task 2.9 — Establish Recurrence Semantic-Version Compatibility Boundary**

### If current authored recurrence is insufficient

> **Task 2.9 — Define Explicit Week-Scoped Recurrence Intent**

The Task 2.8 result determines the next seam.

---

# Validation Requirements

This task is investigation only.

No executable/test files should change.

Run targeted tests where needed to verify current behavior.

At minimum consider:

```text
generateBlockCandidates
generateSchedulePreview
user-week utilities
effective scheduling preferences
```

Then, if required by project discipline:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* Task 2.8 specification remained immutable;
* only the separate result artifact was created;
* no governance document changed;
* no durable format changed.

---

# Completion Criteria

Task 2.8 is complete when:

* recurrence expansion versus clipping ownership is explicit;
* daily semantics are confirmed;
* specific-weekday semantics are confirmed;
* current weekly behavior is established;
* canonical weekly semantics are adopted or blocked explicitly;
* current `timesPerUserWeek` behavior is established;
* canonical slot-allocation semantics are adopted or blocked explicitly;
* complete semantic user-week behavior is defined;
* effective week-start behavior is defined;
* recurrence start/end semantics are defined;
* partial first/last week behavior is defined;
* requested-window clipping behavior is defined;
* behavior changes are inventoried;
* current tests are classified;
* historical/user exposure is assessed;
* semantic-versioning implications are decided;
* compatibility/profile/backup consequences are recorded;
* the contract is strong enough for stable occurrence identity;
* no executable behavior changes;
* a dependency-correct next task is identified.

---

# Task Determination

Task 2.8 is an architectural scheduling-contract investigation.

It does not modify recurrence expansion.

Its purpose is to separate canonical occurrence existence from requested-window clipping so that weekly and `timesPerUserWeek` recurrence can support stable deterministic occurrence identity and future durable user-owned planning decisions.

**The task is complete when DayFrame has an evidence-backed canonical recurrence-expansion contract defining which weekly and `timesPerUserWeek` occurrences exist independently of the requested planning window, how those occurrences are assigned to complete semantic user-weeks and recurrence bounds, how they are clipped for generation, and what scheduling behavior must be implemented before stable occurrence identity can safely be introduced.**
