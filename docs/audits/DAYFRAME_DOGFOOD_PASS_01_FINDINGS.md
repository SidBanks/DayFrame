# DayFrame Dogfood Pass 01 Findings

**Document:** `DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md`  
**Status:** Complete  
**Date:** 2026-09-02  
**Purpose:** Consolidate the findings from DayFrame Dogfood Pass 01 into a durable product, UX, and architectural evidence record before remediation planning or implementation prioritization.

---

# 1. Purpose

Dogfood Pass 01 was a sustained real-use evaluation of the current DayFrame implementation after the completion of the major implementation-alignment sequence.

The purpose of the pass was not simply to verify that individual controls worked.

The test attempted to use DayFrame as an actual planning system for a complicated real-life schedule, including:

- multiple work shifts;
- dated work rotations;
- recurring commitments;
- relational placement;
- off-day behavior;
- advanced scheduling constraints;
- buffers;
- friction;
- suggested fixes;
- accepted choices;
- long planning horizons;
- Goals;
- execution reporting;
- progress;
- Summary/history;
- saved setup and backup functionality;
- and deliberately pathological authored configurations.

The pass also deliberately investigated apparently missing functionality before concluding that the functionality had actually been removed.

That distinction proved important.

Several capabilities initially believed to be absent were eventually found buried in the current interface.

Dogfood Pass 01 therefore produced evidence in four broad categories:

1. behavior that works and should be preserved;
2. actual or probable defects;
3. capabilities whose principal problem is discoverability or interaction design;
4. missing or underdeveloped architectural concepts exposed through real use.

The final category produced several of the most consequential findings of the pass.

---

# 2. Evidence Standard

Dogfood Pass 01 is an experiential product-validation artifact rather than a code audit.

Its findings describe what was observable through sustained use of the current application.

The classifications used in this document are:

| Classification | Meaning |
|---|---|
| **Confirmed Working** | Behavior was exercised successfully during dogfooding. |
| **Defect** | Observed behavior appears inconsistent with authored state or intended semantics. |
| **UX / Discoverability** | Capability exists, but its location, presentation, terminology, or workflow makes it difficult to understand or use. |
| **Scalability** | Behavior works at current scale but is unlikely to remain usable as data volume, planning range, or lifetime usage increases. |
| **Architectural Gap** | A major intended product concept was not observable in the current working product. |
| **Architectural Question** | Dogfooding exposed a product-model question requiring architectural resolution before implementation. |
| **Product Opportunity** | Real use exposed a potentially valuable capability not yet established as a requirement. |
| **Needs Verification** | An observation occurred, but the responsible implementation layer has not yet been established. |
| **Buried Capability** | Functionality initially appeared missing but was subsequently discovered in the existing implementation. |

Dogfood evidence should not be used to infer implementation causes without a targeted code audit.

---

# 3. Executive Findings

Dogfood Pass 01 does **not** support the conclusion that DayFrame lacks substantial scheduling functionality.

The opposite is closer to the observed evidence.

The current application contains significantly more working planning infrastructure than its primary interface successfully communicates.

The dogfood pass confirmed functioning examples of:

- multiple shift definitions;
- dated work rotations;
- recurring commitments;
- work-relative scheduling;
- relational Sleep placement;
- advanced commitment rules;
- buffers;
- friction detection;
- suggested recovery;
- accepted-choice persistence;
- Goals;
- Goal association;
- manual execution reporting;
- Progress;
- historical plan information;
- and Summary.

Several capabilities initially believed to be absent were eventually discovered in advanced or legacy-facing interfaces.

This produces an important implementation constraint:

> **Absence from the current primary UX is not reliable evidence that a DayFrame capability is absent from the product.**

Future remediation should therefore audit before removing, replacing, or rebuilding apparently missing functionality.

However, Dogfood Pass 01 also exposed two major concepts that were not meaningfully observable despite extensive use:

- **Capacity**
- **Proposal**

These are not ordinary missing controls.

They are central elements of DayFrame's intended planning model.

Their absence makes the current product substantially more manual and schedule-generation-oriented than the intended DayFrame architecture.

The current observable workflow is approximately:

**User authors scheduling inputs → DayFrame generates schedule → friction occurs → DayFrame proposes recovery**

The intended planning model is richer:

**Commitments → Capacity → Goals and priorities → Proposal → User decision → Accepted Allocation → Schedule → Friction/Recovery → Execution → Progress → Summary**

The distinction is fundamental because DayFrame is not intended either to require the user to manually schedule every Goal or to autonomously decide how the user's discretionary time should be spent.

The Proposal stage preserves user authority between engine reasoning and scheduled action.

Dogfood Pass 01 therefore identified Capacity and Proposal as major architectural gaps requiring targeted implementation-alignment investigation.

---

# 4. Work Pattern and Shift Authoring

## DF-001 — Multiple shift definitions are supported

**Classification:** Confirmed Working

DayFrame successfully supported multiple work definitions, including separate Day Shift and Evening Shift configurations with different working hours.

The system therefore does not assume a single permanent work schedule.

---

## DF-002 — Multiple dated shift periods and rotations are supported

**Classification:** Confirmed Working / Buried Capability

The application supports dated work periods capable of assigning different shift definitions across different portions of the planning horizon.

This functionality initially appeared difficult or impossible to access but was eventually located and successfully exercised.

---

## DF-003 — Multiple-shift and rotation authoring is difficult to understand

**Classification:** UX / Discoverability

The conceptual relationship among:

- shift definitions;
- shift cycles;
- cycle segments;
- dated ranges;
- and assignment of shifts to those ranges

is not sufficiently clear from the interface.

Creating a second work rotation required experimentation before the intended authoring path became apparent.

This is particularly consequential because irregular and rotating work schedules are a central DayFrame use case.

---

## DF-004 — Invalid date-range configuration provides insufficient recovery guidance

**Classification:** UX / Recovery

An attempted second work rotation contained an invalid or conflicting date configuration.

DayFrame correctly prevented the invalid configuration from being accepted, but determining the cause and correcting it required unnecessary investigation.

Changing the affected ending year to 2027 resolved that particular authored configuration.

Validation existed.

Recovery guidance was insufficient.

---

# 5. Work Generation and Calendar Alignment

## DF-005 — Dated work transitions generate successfully

**Classification:** Confirmed Working

After valid work rotations were authored, schedule generation reflected transitions between the defined Day Shift and Evening Shift periods.

The Evening Shift portion of the resulting schedule appeared to align correctly with its intended weekdays.

---

## DF-006 — Work appeared on a Sunday despite neither authored shift including Sunday

**Classification:** Defect / Needs Verification

At least one generated Sunday displayed Work despite neither relevant shift definition selecting Sunday as a workday.

The responsible layer was not established during dogfooding.

Potential areas requiring later investigation include:

- work-cycle expansion;
- weekday interpretation;
- user-day boundary handling;
- generated work-block dates;
- and calendar rendering.

The observation should be reproduced before assigning implementation cause.

---

## DF-007 — Generated Work provenance is difficult to visually verify

**Classification:** UX / Verification

Confirming that generated Work exactly corresponded to authored shift configuration required substantial manual inspection.

A future Planner should make it easier to determine why a generated Work occurrence exists on a particular user-day.

---

# 6. Commitment Authoring

## DF-008 — Recurring commitments can be authored

**Classification:** Confirmed Working

Recurring commitments including Sleep, Errands, Workout, and Goal-associated work were successfully created and scheduled.

---

## DF-009 — Weekday-selection controls require visual and interaction refinement

**Classification:** UX

The current weekday-selection controls are functional but visually weak and inconsistent with the intended quality of the Planner experience.

This is primarily a presentation and interaction-polish issue rather than a scheduling-engine problem.

---

## DF-010 — Important scheduling controls are buried behind advanced commitment configuration

**Classification:** UX / Discoverability / Buried Capability

Several scheduling capabilities initially appeared to have disappeared during UX evolution.

Further investigation demonstrated that they remain available through advanced commitment controls.

The primary problem is therefore not necessarily missing engine capability.

It is insufficient exposure of scheduling concepts at the appropriate point in the authoring workflow.

---

# 7. Relational Placement

## DF-011 — Sleep can be positioned relative to Work

**Classification:** Confirmed Working

Sleep successfully responded to relational placement rules including placement before or after Work.

Changing the relationship altered generated Sleep times accordingly.

---

## DF-012 — Work-relative Sleep adapts across different shifts

**Classification:** Confirmed Working

Relational Sleep placement continued to function when the underlying Work schedule changed.

The behavior was therefore based on the relevant Work occurrence rather than a single hard-coded clock time.

This is an important scheduling capability that should be preserved.

---

## DF-013 — Work-relative commitments require explicit off-day semantics

**Classification:** Architectural Question

When Sleep depended on Work but no Work occurrence existed on an off-day, the system fell back to approximately midnight through 8:00 AM.

The fallback appeared deterministic.

The test exposed a larger unresolved question:

> What should a work-relative routine do when Work does not exist on the relevant user-day?

The answer should not be assumed universally.

---

# 8. Off-Day and Weekend Scheduling Policy

## DF-014 — Off-day behavior should be an explicit scheduling policy

**Classification:** Architectural Question / Product Opportunity

Dogfooding identified two legitimate user scheduling philosophies.

### Preserve Routine

Maintain approximately the same Sleep, Study, Workout, and other routine timing on off-days.

### Adapt to Off Days

Allow the absence of Work to materially reorganize the day and create different scheduling opportunities.

Neither policy is universally correct.

DayFrame should not silently impose one.

---

## DF-015 — Preserve Routine should be available as a built-in behavior

**Classification:** Product Requirement Candidate

Users who value circadian, exercise, study, or other routine stability should be able to tell DayFrame to preserve normal timing even when Work is absent.

---

## DF-016 — Adapt to Off Days should also be available as a built-in behavior

**Classification:** Product Requirement Candidate

Other users may intentionally want weekends or off-days to operate differently.

Removing Work may create Capacity that the user wants DayFrame to consider for Goals or other discretionary activity.

The two policies should coexist.

---

# 9. Pathological and Invalid Configuration Testing

## DF-017 — A commitment can apparently reference itself

**Classification:** Defect / Validation Gap

Sleep was deliberately configured relative to Sleep.

The application accepted enough of this semantically circular configuration to produce schedule output.

Self-reference should be treated as invalid unless future architecture explicitly defines recursive commitment semantics.

---

## DF-018 — Invalid self-reference produced plausible output

**Classification:** Defect / Epistemic Integrity

The self-referential Sleep configuration did not produce an obvious failure.

Workdays appeared to retain behavior resembling the previous after-Work configuration while off-days fell back to approximately midnight through 8:00 AM.

This is more concerning than an explicit error because invalid authored semantics produced superficially credible schedule output.

DayFrame should not present invalid reasoning as though it were an authoritative interpretation of user intent.

---

# 10. Buffers

## DF-019 — Buffer functionality exists

**Classification:** Confirmed Working / Buried Capability

Buffer functionality initially appeared to have been removed.

Further investigation demonstrated that buffer configuration remains available.

This is one of the clearest examples from Dogfood Pass 01 of functionality being mistaken for absent because of poor discoverability.

---

## DF-020 — Buffer configuration is too deeply buried

**Classification:** UX / Discoverability

A user expressing a common requirement such as:

> "I need time before or after this."

should not need to discover advanced scheduling machinery merely to express that requirement.

---

## DF-021 — Large buffers can make otherwise valid commitments unplaceable

**Classification:** Confirmed Engine Behavior / Needs Evaluation

A tested 45-minute before/after buffer around Sleep resulted in Sleep being unplaceable in at least one scenario.

This is not automatically a defect.

The schedule may genuinely lack sufficient temporal space.

The important product requirement is that DayFrame explain why the requested placement cannot be satisfied and offer appropriate recovery when possible.

---

# 11. Attached Activities and Subcommitments

## DF-022 — Generic buffers inadequately represent some real activities

**Classification:** Architectural Question / Product Opportunity

Dogfooding exposed a semantic distinction between empty protective spacing and meaningful activity.

For example:

- commute to Work;
- Work;
- commute home.

A commute consumes time, has meaning, and may eventually possess its own execution, location, or resource characteristics.

It is not merely anonymous buffer space.

---

## DF-023 — DayFrame may require attached or subordinate commitments

**Classification:** Product Opportunity

A richer model may eventually support relationships such as:

    Work
    ├── Commute to Work
    ├── Work occurrence
    └── Commute Home

This should remain an architectural question until its interaction with commitment identity, recurrence, execution, friction, and history is understood.

---

# 12. Friction

## DF-024 — DayFrame detects scheduling friction

**Classification:** Confirmed Working

Real scheduling conflicts were successfully produced and detected.

Review Schedule exposed affected schedule information and friction.

---

## DF-025 — DayFrame generates bounded friction-recovery suggestions

**Classification:** Confirmed Working

The engine generated suggested corrective actions for at least some detected conflicts.

This validates the interaction pattern:

**Engine evaluates → Engine proposes recovery → User decides**

---

## DF-026 — Suggested friction recovery can be applied

**Classification:** Confirmed Working

Suggested recovery actions could be accepted and applied to the schedule.

---

## DF-027 — Applied recovery decisions persist as Accepted Choices

**Classification:** Confirmed Working

Accepted recovery actions did not disappear after application.

They were retained as Accepted Choices.

This establishes durable decision state separate from the generated schedule itself.

---

## DF-028 — Accepted Choices expose applicability state

**Classification:** Confirmed Working

Accepted Choices distinguished at least between:

- Applied;
- Blocked.

A previously accepted decision could therefore remain historically visible while DayFrame acknowledged that the current schedule could no longer satisfy it.

This is a valuable epistemic behavior.

---

# 13. Proposal and Friction Are Distinct

## PM-01 — Proposal is constructive; Friction is corrective

**Classification:** Architectural Principle

Dogfood Pass 01 found functioning suggestion/acceptance behavior primarily through Friction.

This should not lead to Proposal and Friction being collapsed into one concept.

They operate at different points in the planning lifecycle.

### Proposal

Proposal asks:

> Given the user's Commitments, available Capacity, Goals, priorities, and scheduling preferences, how might the user use the available Capacity?

Proposal is constructive.

It exists before discretionary Capacity becomes authorized scheduled work.

### Friction

Friction asks:

> Something we are attempting to schedule cannot coexist under the current constraints. What should change?

Friction is corrective.

It operates when an existing or proposed plan cannot be satisfied.

Both mechanisms may eventually share infrastructure for:

- deterministic reasoning;
- explanations;
- alternatives;
- acceptance;
- rejection;
- modification;
- provenance;
- and Accepted Choices.

Their semantic roles must nevertheless remain distinct.

---

# 14. Accepted Choices and Scheduling Preferences

## DF-029 — Accepted Choices have a long-term scalability problem

**Classification:** Scalability / UX

A small Accepted Choices list is manageable.

Years of sustained DayFrame use could produce hundreds or thousands of individual decisions.

The current flat-list representation cannot reasonably serve as the final long-term model.

---

## DF-030 — Accepted Choices may become reusable scheduling guidance

**Classification:** Product Opportunity / Architectural Question

Accepted decisions provide evidence about how the user prefers DayFrame to resolve scheduling tradeoffs.

Some choices may deserve explicit promotion from:

**one-time decision**

to:

**reusable scheduling preference**

without converting every accepted decision into a permanent rule.

---

## DF-031 — Reusable scheduling preferences require precedence semantics

**Classification:** Product Opportunity

Reusable preferences may conflict.

DayFrame may therefore eventually need user-controlled precedence among scheduling preferences.

A provisional authority ordering is:

    User-authored facts and hard constraints
        ↓
    Explicit scheduling preferences
        ↓
    Accepted/reusable decision guidance
        ↓
    Engine heuristics
        ↓
    Generated Proposal

This model should remain subject to architectural review.

---

## DF-032 — Conflicting preferences should themselves become visible friction

**Classification:** Product Opportunity / Epistemic Integrity

If two user-authorized preferences cannot simultaneously be satisfied, DayFrame should expose the conflict rather than silently selecting one.

Preference conflict is itself meaningful planning information.

---

## DF-033 — Repeated behavior may justify a preference suggestion but not silent authority

**Classification:** Architectural Principle Candidate

Repeated accepted decisions may eventually allow DayFrame to suggest a reusable preference.

For example:

> "You've repeatedly moved Errands instead of Workout when these conflict. Use that as a scheduling preference?"

The engine may infer that a pattern exists.

It should not infer that the user has granted the pattern future authority.

---

# 15. Pattern and Bulk Friction Resolution

## DF-034 — Individual friction recovery works

**Classification:** Confirmed Working

Individual scheduling conflicts can be resolved through suggested fixes and Accepted Choices.

---

## DF-035 — No discoverable bulk or pattern-level friction workflow was found

**Classification:** Missing Capability or Severe Discoverability Issue

Dogfood Pass 01 did not locate an exposed workflow for resolving multiple structurally equivalent conflicts together.

This does not prove that no underlying implementation exists.

It establishes that no usable workflow was discovered.

---

## DF-036 — Occurrence-by-occurrence recovery does not scale

**Classification:** Scalability

Recurring commitments may generate essentially identical friction across many occurrences.

Resolving every occurrence individually would be unreasonable.

DayFrame should eventually distinguish among:

**occurrence-level resolution → pattern-level resolution → durable preference**

without conflating those scopes.

---

# 16. Planning Horizon and Attention Scope

## DF-037 — Long planning horizons generate successfully

**Classification:** Confirmed Working

DayFrame successfully generated a schedule across approximately a full year.

This demonstrates substantial temporal-range capability.

---

## DF-038 — Planning horizon and review scope are currently coupled

**Classification:** UX / Architectural Problem

Generating a long planning horizon also exposed a similarly long range of friction for review.

The user may need DayFrame to reason about a year without wanting to manually review an entire year at once.

---

## DF-039 — Annual generation overwhelms Review Schedule

**Classification:** Scalability

Large numbers of friction points make Review Schedule increasingly difficult to use.

The engine can reason over a larger temporal range than the current human review surface can comfortably present.

---

## DF-040 — Planning scope and attention scope are different concepts

**Classification:** Product Model Finding

DayFrame should distinguish:

> What temporal range should the engine reason about?

from:

> What subset of that range currently requires the user's attention?

This is not merely a pagination problem.

It is an information-architecture and planning-model distinction.

---

# 17. Capacity

## DF-041 — Capacity was not meaningfully observable during Dogfood Pass 01

**Classification:** Architectural Gap

Despite extensive use of:

- Work;
- recurring commitments;
- Sleep;
- buffers;
- friction;
- recovery;
- Goals;
- execution;
- Progress;
- and Summary;

Dogfood Pass 01 found no meaningful user-facing representation of **Capacity**.

The finding does not establish whether capacity-related calculations exist internally.

It establishes that Capacity as a first-class DayFrame concept was functionally invisible during real use.

---

## PM-02 — Commitments shape Capacity

**Classification:** Architectural Principle

Commitments own time.

Their placement, duration, constraints, and relationships determine how much usable time remains.

Capacity is therefore not merely "free calendar time."

It is the usable planning resource remaining after DayFrame accounts for the user's time-owning obligations and relevant constraints.

---

## PM-03 — Goals compete for Capacity

**Classification:** Architectural Principle

Goals should remain semantically distinct from Commitments.

A Goal represents a desired outcome or direction.

It should not own calendar time merely because it exists.

Instead, Goals and their priorities inform how DayFrame reasons about the use of available Capacity.

This preserves the distinction:

> **Commitments describe the life the user must accommodate. Goals describe the life the user is trying to build. Capacity is the bridge between them.**

---

# 18. Goals, Proposals, and Allocation

## DF-042 — Goals can be authored

**Classification:** Confirmed Working

Goals were successfully created during Dogfood Pass 01.

---

## DF-043 — Goals appear in Summary and historical information

**Classification:** Confirmed Working

Goal information was visible through existing Summary/history functionality.

---

## DF-044 — Scheduled work can be associated with a Goal

**Classification:** Confirmed Working

An authored scheduled item could be associated with an existing Goal through advanced configuration.

This confirmed that Goal-to-execution provenance exists in the implementation.

---

## DF-045 — Goal-to-schedule allocation is currently user-driven

**Classification:** Architectural Gap / UX

The user can manually create scheduled work and associate it with a Goal.

Dogfood Pass 01 did not expose a workflow in which DayFrame:

1. derives Capacity;
2. evaluates competing Goals and priorities;
3. generates a proposed use of that Capacity;
4. presents that Proposal for user review;
5. and only after user authorization converts it into scheduled allocation.

The current workflow therefore requires the user to manually perform planning work that the intended DayFrame model assigns to the planning engine.

---

## DF-046 — The Proposal stage was not observable in general planning

**Classification:** Architectural Gap

No general pre-scheduling Proposal workflow was discovered during Dogfood Pass 01.

The closest observed mechanism was Friction recovery, where DayFrame evaluates an existing scheduling problem and proposes a corrective action.

That mechanism is important evidence, but it does not replace Proposal.

---

## PM-04 — Proposal is an epistemic boundary between engine reasoning and user intent

**Classification:** Architectural Principle

A DayFrame-generated recommendation must not become equivalent to user intent merely because the engine calculated it.

DayFrame may reason about:

- Capacity;
- Goals;
- priorities;
- constraints;
- preferences;
- and prior decisions.

The result remains a **Proposal** until the user exercises authority.

The user must be able to:

- accept;
- modify;
- or reject

the Proposal.

Acceptance converts engine reasoning into an authorized planning decision.

---

## PM-05 — Goals inform Proposals; they do not directly create scheduled work

**Classification:** Architectural Principle

The intended planning chain is:

    Commitments
        ↓
    Capacity
        ↓
    Goals + Priorities + Preferences
        ↓
    Engine Reasoning
        ↓
    Proposal
        ↓
    User Review
        ↓
    Accept / Modify / Reject
        ↓
    Accepted Allocation
        ↓
    Scheduled Work

The engine should neither require the user to manually schedule all Goal work nor silently decide how discretionary Capacity will be spent.

---

# 19. Execution and Progress

## DF-047 — Execution and progress reporting exist

**Classification:** Confirmed Working

Goal-associated scheduled work exposed execution/progress state.

---

## DF-048 — Execution duration is manually reported rather than automatically timed

**Classification:** Capability Clarification

An execution-related duration field was initially interpreted as a live timer.

Further investigation established that the field represents user-entered execution duration.

This distinction should remain explicit in future architecture documentation.

---

## DF-049 — No native execution timer was identified

**Classification:** Product Opportunity

Dogfood Pass 01 found no Start/Pause/Finish elapsed-time workflow.

This is not inherently a defect.

Manual reporting remains necessary for activity performed outside DayFrame or entered retrospectively.

---

## DF-050 — Manual and measured execution could coexist

**Classification:** Product Opportunity

Duration-oriented work such as:

- Study;
- Workout;
- Writing;
- project work;

could eventually support optional measured execution while retaining manual retrospective entry.

This would strengthen the provenance chain:

**Planned Work → Actual Execution → Progress → Goal Outcome**

without requiring every activity to be timed.

---

# 20. Summary and Historical Scale

## DF-051 — Summary/history functionality is substantially implemented

**Classification:** Confirmed Working / Buried Capability

Dogfood Pass 01 uncovered more Summary/history functionality than was apparent from the primary operational UX.

The implementation contains historical plan information, Goal-related information, execution/progress data, outcome information, counts, ranges, and detailed entries.

---

## DF-052 — Summary is weakly connected to the primary operating experience

**Classification:** UX / Information Architecture

Although historical information exists, the transition from everyday planning and execution into long-term understanding remains fragmented.

This reinforces the intended relationship among:

- Planner;
- Today;
- Summary.

---

## DF-053 — Summary has an eventual information-scale problem

**Classification:** Scalability / Information Architecture

The current Summary is manageable with limited historical data.

Years of sustained use could create large volumes of:

- completed Goals;
- historical plans;
- execution records;
- scheduling outcomes;
- friction;
- decisions;
- and progress data.

Treating every historical artifact as equally prominent indefinitely would eventually make Summary itself an archive browser rather than a summary.

---

## PM-06 — Historical information should change resolution as it ages

**Classification:** Architectural Principle Candidate

Historical information does not necessarily need to disappear.

Its operational resolution can decrease over time.

For example, an active Goal may expose:

- allocations;
- scheduled occurrences;
- execution records;
- progress;
- friction;
- and detailed history.

A recently completed Goal may retain:

- outcome;
- completion date;
- important metrics;
- and condensed activity information.

A long-completed Goal may normally appear simply as:

    Network+ — Completed
    Started: 2026-08-12
    Completed: 2026-09-28
    Status: Completed

while full provenance remains available through archival storage.

---

## PM-07 — History should distinguish operational, analytical, and archival data

**Classification:** Architectural Principle Candidate

Long-term DayFrame history may require at least three conceptual layers.

### Operational State

Information required for current planning and execution decisions.

### Analytical History

Historical information required to calculate useful trends, Progress, Summary information, and recommendations.

### Archival Provenance

The complete historical record required for detailed inspection, reconstruction, export, or long-term retention.

These layers may have different local-storage, synchronization, retrieval, and presentation requirements.

Technical implementation should not be chosen until the product architecture is settled.

---

## PM-08 — Preserve provenance without preserving equal prominence

**Classification:** Architectural Principle Candidate

DayFrame should retain sufficient provenance to explain important decisions and historical outcomes without requiring every historical artifact to remain:

- equally visible;
- equally loaded;
- equally searchable by default;
- or equally operational forever.

This principle applies to:

- completed Goals;
- Accepted Choices;
- execution records;
- friction history;
- Proposals;
- historical schedules;
- and recommendations.

---

# 21. Saved Setup Profiles and Persistence UX

## DF-054 — Saved Setup Profiles appear conceptually legacy

**Classification:** Architectural Question / UX

Manual Save/Load Setup Profiles remain available.

In a future continuously persisted and synchronized planning system, manually saving entire current-state profiles may no longer be an appropriate primary persistence concept.

The underlying capability may still have value if reframed as:

- templates;
- scenarios;
- experiments;
- reusable configurations;
- or snapshots.

This should not be confused with backup/recovery.

---

## DF-055 — Backup and portability remain valuable

**Classification:** Confirmed Product Need

Even if Saved Setup Profiles are eventually reframed, durable backup, restore, portability, and recovery remain important product capabilities.

Persistence, templates, scenarios, and backup should remain conceptually distinct.

---

# 22. Capabilities Initially Mistaken for Missing

One of the most consequential outcomes of Dogfood Pass 01 was discovering that several apparently missing capabilities still exist.

| Capability | Dogfood Result |
|---|---|
| Multiple shift/rotation modeling | Exists; difficult to author |
| Dated work rotations | Exists |
| Work-relative Sleep placement | Exists and adapts to Work |
| Advanced placement rules | Exist; buried |
| Buffers | Exist; buried |
| Friction detection | Exists and works |
| Suggested recovery | Exists and works |
| Accepted-decision persistence | Exists |
| Goal creation | Exists |
| Goal association | Exists; labor-intensive |
| Execution reporting | Exists as manual reporting |
| Progress | Exists |
| Summary/history | Substantially exists |
| Bulk/pattern friction resolution | Not found |
| Capacity | Not meaningfully observable |
| General planning Proposal | Not found |

This produces a critical implementation lesson:

> **Do not infer that a capability is absent merely because it is absent from the current primary UX. Audit before rebuilding or removing.**

Capacity and Proposal remain materially different from most buried capabilities because extensive dogfooding did not reveal equivalent working product surfaces for them.

---

# 23. Consolidated Product Model Findings

Dogfood Pass 01 produced or strengthened the following higher-order findings.

## PM-09 — Users define priorities; DayFrame builds schedules

This remains a foundational DayFrame principle.

Dogfood Pass 01 clarified that "users define priorities" should not require users to manually schedule every discretionary activity.

Nor should "DayFrame builds schedules" authorize the engine to silently determine how the user's discretionary life should be spent.

Proposal mediates between those responsibilities.

---

## PM-10 — Commitments own time; Goals compete for Capacity

Commitments and Goals should remain distinct.

Commitments shape the temporal environment.

Goals express desired outcomes.

Capacity represents the usable planning resource remaining after Commitments and constraints are accounted for.

Goals compete for that Capacity according to user-defined priorities and preferences.

---

## PM-11 — Proposal and Friction must remain distinct

Proposal constructs a possible use of Capacity.

Friction identifies incompatibility within a plan or attempted plan.

Both involve engine reasoning and user decisions.

They should not become the same product concept.

---

## PM-12 — Accepted decisions can teach DayFrame without granting silent authority

Accepted Choices can provide evidence about user scheduling preferences.

Repeated decisions may inform future Proposals.

DayFrame may eventually suggest promotion of repeated decisions into reusable preferences.

Inference should never silently acquire user authority.

---

## PM-13 — Recovery should operate at multiple scopes

DayFrame should eventually distinguish:

**Occurrence → Pattern → Preference**

A single occurrence may require a one-time recovery.

Repeated structurally equivalent friction may justify pattern-level resolution.

Repeated user choices may justify proposing a durable preference.

Those are distinct levels of authority.

---

## PM-14 — Off-day behavior is policy

Preserve Routine and Adapt to Off Days represent legitimate competing scheduling philosophies.

Off-day behavior should therefore be explicitly governed rather than accidentally emerging from fallback placement behavior.

---

## PM-15 — Some buffers are activities

Anonymous buffer time remains useful.

However, travel, preparation, cleanup, decompression, and similar activities may require first-class or attached semantic identity.

---

## PM-16 — Planning scope is not attention scope

The engine may need to reason across months or years while the user reviews:

- today;
- this week;
- a selected period;
- unresolved friction;
- or only decisions requiring attention.

Long-range reasoning should not imply long-range cognitive burden.

---

## PM-17 — Goals require an authorization-aware provenance chain

The intended Goal lifecycle is not merely:

**Goal → Event → Progress**

It is:

**Goal → Capacity reasoning → Proposal → User decision → Accepted Allocation → Scheduled Work → Execution → Progress → Summary**

Each transition should preserve enough provenance to distinguish:

- user-authored intent;
- engine-derived reasoning;
- engine Proposal;
- user authorization;
- scheduled representation;
- and actual execution.

---

## PM-18 — Historical information should condense without losing provenance

Long-term DayFrame use should not require every historical artifact to remain equally prominent forever.

Completed Goals, old Accepted Choices, execution details, historical friction, and old Proposals may be condensed operationally while retaining complete archival provenance where appropriate.

---

# 24. Revised DayFrame Planning Lifecycle

Dogfood Pass 01 supports the following provisional product lifecycle:

    USER-AUTHORED REALITY
    ┌─────────────────────────────────────┐
    │ Commitments                         │
    │ Constraints                         │
    │ Goals                               │
    │ Priorities                          │
    │ Explicit Scheduling Preferences     │
    └─────────────────────────────────────┘
                      │
                      ▼
             COMMITMENTS SHAPE TIME
                      │
                      ▼
                  CAPACITY
                      │
                      │  Goals
                      │  Priorities
                      │  Preferences
                      │  Relevant Accepted Choices
                      ▼
               ENGINE REASONING
                      │
                      ▼
                  PROPOSAL
                      │
               ┌──────┼──────┐
               │      │      │
             Accept  Modify  Reject
               │      │
               └──┬───┘
                  ▼
           ACCEPTED ALLOCATION
                  │
                  ▼
               SCHEDULE
                  │
          ┌───────┴────────┐
          │                │
       Feasible         Conflict
          │                │
          │             FRICTION
          │                │
          │       Recovery Recommendation
          │                │
          │          User Decision
          │                │
          └───────┬────────┘
                  ▼
               EXECUTION
                  │
                  ▼
               PROGRESS
                  │
                  ▼
               SUMMARY
                  │
                  ▼
          ANALYTICAL HISTORY
                  │
                  ▼
         FUTURE ENGINE REASONING

Proposal and Friction remain deliberately separate in this model.

Accepted decisions from either process may inform future reasoning, but their provenance must remain distinguishable.

---

# 25. Principal Architectural Gaps

Dogfood Pass 01 identified two gaps that should receive special treatment during subsequent implementation-alignment work.

## 25.1 Capacity

Capacity was not meaningfully visible as a first-class planning concept.

A targeted audit should determine:

- whether Capacity semantics already exist internally;
- whether they exist partially but lack a product surface;
- whether available-time calculations currently serve as an implicit substitute;
- how Capacity relates to user-day boundaries and commitments;
- how Capacity should account for non-calendar constraints;
- and whether any existing Goal logic already depends on capacity-like calculations.

## 25.2 Proposal

A general Proposal lifecycle was not found.

A targeted audit should determine:

- whether a dormant Proposal model exists;
- whether current generated preview structures accidentally occupy that role;
- whether PlanDecision or Accepted Choice infrastructure can support Proposal authorization;
- whether Friction recovery already contains reusable proposal/acceptance machinery;
- and what state transition currently occurs between engine generation and scheduled representation.

The goal of these audits should be to determine whether Capacity and Proposal require:

**reconnection, completion, or genuinely new implementation.**

---

# 26. Confirmed Strengths to Preserve

Dogfood Pass 01 also identified implementation strengths that future work should not casually destroy.

These include:

- deterministic schedule generation;
- multiple shift definitions;
- dated work rotations;
- work-relative commitment placement;
- shift-aware Sleep placement;
- advanced scheduling rules;
- buffers;
- explicit friction detection;
- bounded suggested recovery;
- user acceptance of recovery;
- persistent Accepted Choices;
- applicability status for accepted decisions;
- Goal identity;
- Goal-to-execution association;
- manual execution reporting;
- Progress;
- historical plan information;
- and Summary/history foundations.

Future UX convergence should expose these capabilities more coherently rather than rebuilding them unnecessarily.

---

# 27. Highest-Risk Findings

The findings with the greatest potential product or architectural consequence are:

1. **Capacity is not meaningfully observable.**
2. **General pre-scheduling Proposal is not observable.**
3. **Current scheduling can therefore appear either overly manual or overly engine-authoritative.**
4. **Proposal and Friction must remain semantically distinct.**
5. **Work appeared on at least one apparently invalid Sunday.**
6. **Self-referential placement can produce plausible but semantically invalid output.**
7. **Planning horizon and human review scope do not scale together.**
8. **Pattern-level friction resolution is not discoverable.**
9. **Accepted Choices require a long-term preference and condensation strategy.**
10. **Summary/history requires a long-term information-resolution and archival strategy.**
11. **Core capabilities remain hidden deeply enough to be mistaken for missing.**

These findings should guide subsequent investigation but should not automatically be converted one-for-one into implementation tasks.

---

# 28. Implications for the Next Phase

Dogfood Pass 01 should not immediately produce a collection of isolated UI fixes.

The findings span different levels:

### Defects

Examples:

- Sunday Work anomaly;
- self-referential placement validation.

### UX / Discoverability

Examples:

- shift-rotation authoring;
- advanced commitment rules;
- buffers;
- Goal association;
- weekday controls.

### Scalability

Examples:

- annual Review Schedule;
- Accepted Choices;
- Summary/history;
- occurrence-by-occurrence friction recovery.

### Architectural Gaps

Examples:

- Capacity;
- Proposal.

### Architectural Questions

Examples:

- off-day policy;
- attached activities;
- historical condensation;
- reusable preference precedence.

### Product Opportunities

Examples:

- attached/subcommitment activities;
- native execution timing;
- preference learning;
- pattern-level recovery.

These classes require different responses.

The next planning phase should therefore classify findings by remediation type and dependency before implementation priority is assigned.

---

# 29. Dogfood Pass 01 Conclusion

Dogfood Pass 01 materially changed the understanding of the current DayFrame product.

The implementation is neither merely the old Setup → Preview prototype nor yet the complete intended DayFrame planning system.

It contains substantial working infrastructure whose capabilities are frequently obscured by accumulated UX layers.

The dogfood pass validated important scheduling foundations:

- irregular work modeling;
- relational scheduling;
- deterministic generation;
- friction detection;
- recovery;
- persistent decisions;
- Goals;
- execution reporting;
- Progress;
- and historical information.

At the same time, it exposed that two of DayFrame's most important differentiators—**Capacity and Proposal**—are not currently expressed as meaningful parts of the observable planning workflow.

That absence changes the character of the product.

Without Capacity, DayFrame cannot clearly communicate what discretionary planning resource actually exists.

Without Proposal, the boundary between engine reasoning and user authorization is lost.

Without preserving the distinction between Proposal and Friction, proactive planning risks collapsing into reactive schedule repair.

Dogfood Pass 01 also exposed several long-horizon concerns before production-scale data exists: Accepted Choices, Summary, Goals, execution history, friction history, and Proposals cannot all remain equally detailed and equally prominent indefinitely.

The emerging principle is:

> **Preserve provenance without preserving equal prominence.**

Most importantly, the pass reinforces the central DayFrame product contract:

> **Commitments own time. Goals compete for Capacity. DayFrame proposes. The user decides. DayFrame schedules what the user has authorized.**

That contract should remain visible throughout subsequent architecture, implementation, UX, execution, history, and learning work.

---

# 30. Completion Statement

**Dogfood Pass 01 is complete.**

The findings in this document represent the consolidated experiential evidence from the first sustained real-world validation of the post-alignment DayFrame implementation.

No finding in this document should be treated as an implementation prescription without appropriate architectural classification and, where implementation behavior is uncertain, targeted code-level verification.

The next phase should use this document as evidence for:

1. findings classification;
2. targeted implementation verification;
3. architectural gap analysis;
4. remediation sequencing;
5. and subsequent implementation planning.

Dogfood Pass 01 should remain a durable historical record of what the product actually revealed under use, including capabilities that worked, capabilities that were buried, failures that were observed, and architectural concepts whose absence became visible only when DayFrame was used as a real planning system.