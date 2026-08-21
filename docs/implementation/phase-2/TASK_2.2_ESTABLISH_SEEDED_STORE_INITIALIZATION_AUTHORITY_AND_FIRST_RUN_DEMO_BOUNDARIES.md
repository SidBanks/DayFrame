# Task 2.2 — Establish Seeded-Store Initialization Authority and First-Run/Demo Boundaries

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.2

**Task Name:** Establish Seeded-Store Initialization Authority and First-Run/Demo Boundaries

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Authority Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning the investigation, verify that this task artifact is complete and record its integrity hash.

Record the investigation outcome in a separate result artifact:

`TASK_2.2_ESTABLISH_SEEDED_STORE_INITIALIZATION_AUTHORITY_AND_FIRST_RUN_DEMO_BOUNDARIES_RESULT.md`

The result artifact should document:

* current seeded-store implementation;
* production caller inventory;
* current rehydration order;
* current seed-write order;
* fields overwritten by seeding;
* fields preserved by seeding;
* persistence and notification effects;
* Preview effects;
* first-run detectability;
* empty-store detectability;
* demo-mode detectability;
* development/test usage;
* user-data overwrite risk;
* initialization candidate models;
* authority decision;
* migration and durability implications;
* recommended implementation sequence;
* tests required by a later implementation task;
* validation;
* final completion determination.

This task is investigation and architectural decision only.

Do not modify production code, tests, state types, store APIs, UI, durable formats, persistence behavior, seeds, defaults, or architecture documents.

If the repository does not contain sufficient evidence to distinguish first-run, demo, development, and ordinary persisted startup, classify the gap explicitly rather than inventing hidden product intent.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Phase 2 Context;
* Governing Evidence;
* Objective;
* Current Seeded-Store Audit;
* Startup/Rehydration Audit;
* Authority Questions;
* Candidate Initialization Models;
* Decision Standard;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed authority contract for seeded data defining what seeded content represents, whether and when it may become authoritative authored state, how first-run/demo/development contexts are distinguished, how persisted user-authored state is protected from seed overwrite, and what smallest implementation change is required without conflating product defaults, demo content, and user data.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity discrepancy for project review.

---

# Purpose

Resolve the first authority mismatch identified by Task 2.1.

Task 2.1 confirmed that the default production application path calls:

```text
createSeededDayFrameStore
```

which:

1. constructs a normal persisted store;
2. rehydrates existing active authored data;
3. then invokes authoritative store setters for:

   * shift definitions;
   * shift cycles;
   * block templates;
   * block recurrences.

Those setter calls can overwrite already rehydrated user-authored collections.

The current implementation therefore makes startup seeding an unadvertised authored-data writer.

Task 2.2 determines what seeded data actually represents and when, if ever, it is permitted to become authoritative.

---

# Phase 2 Context

Phase 2 is aligning authority and state boundaries before major engine restructuring.

Task 2.1 established that the active authored authority consists of seven fields:

```text
schedulingPreferences
previewRange
shiftDefinitions
shiftCycles
blockTemplates
blockRecurrences
manualEvents
```

Seeded startup currently writes four of those seven fields.

That makes seeded initialization an authority question, not merely a convenience-helper question.

---

# Governing Evidence

Use current executable behavior as the primary source.

Relevant Phase 1 and Phase 2 conclusions include:

* persisted authored data is user data;
* current runtime authored state is session authority;
* durable rehydration is a legitimate source of current authored authority;
* profiles/backups replace authored state only through explicit workflows;
* Task 2.1 classified seeded startup overwrite as an architectural mismatch;
* defaults, demo content, and user-authored persisted state must not be assumed equivalent.

The durable-data ADR also requires preservation of user data and explicit migration/recovery semantics rather than silent replacement.

---

# Objective

Determine:

1. what the current seeded data contains;
2. why it exists;
3. where it is used;
4. whether it is product content, demo content, development scaffolding, onboarding content, or fallback defaults;
5. whether the repository currently distinguishes first-run from ordinary startup;
6. whether it can distinguish an empty authored store from a valid intentionally empty user configuration;
7. whether persisted authored data is currently overwritten;
8. whether seeding itself persists;
9. whether seeding causes notifications and Preview invalidation;
10. whether seeded content should ever enter authoritative state automatically;
11. what the correct initialization authority contract should be;
12. what the smallest implementation task should do next.

---

# Current Seeded-Store Audit

Inspect:

```text
createSeededDayFrameStore
```

and all helper values/functions it uses.

Record:

* exact seed objects;
* exact authored fields written;
* setter order;
* whether each setter clones;
* whether each setter persists;
* whether each setter marks Preview stale;
* whether each setter notifies;
* whether durability status changes;
* whether seed writes happen on every app construction;
* whether any condition prevents seeding after successful rehydration.

Do not infer from the helper name that it is demo-only.

---

# Production Caller Inventory

Find every executable caller of:

```text
createSeededDayFrameStore
```

and any equivalent seeded/default-store helper.

Classify each caller as:

* production application startup;
* development-only;
* test-only;
* story/demo harness;
* unresolved.

Also identify production paths that use:

```text
createDayFrameStore
```

directly.

The result must establish whether ordinary shipped application startup uses seeded construction.

---

# Seed Content Inventory

Document the current seeds completely enough to establish their semantic role.

At minimum record the seed contents for:

* shift definitions;
* shift cycles;
* block templates;
* block recurrences.

Determine whether the seed includes recognizable demo/example values rather than neutral product defaults.

Do not redesign seed content.

---

# Defaults Versus Seeds

Explicitly distinguish:

## Defaults

Values produced by:

```text
createInitialDayFrameState
```

or equivalent initialization logic.

## Seeds

Additional authored objects written after store creation.

Determine which current values are:

* structural defaults;
* authored example content;
* empty collections;
* demo fixtures;
* inferred onboarding values.

A default scheduling preference is not automatically equivalent to a seeded shift schedule.

---

# Startup/Rehydration Audit

Trace ordinary startup in order.

Produce a sequence equivalent to:

```text
application starts
    ↓
store constructed
    ↓
local active state read
    ↓
local profiles read
    ↓
normalization
    ↓
initial runtime authority established
    ↓
seed helper executes?
    ↓
authoritative setters execute?
    ↓
persistence / notification effects
```

Confirm exact ordering from code.

---

# Persisted Data Overwrite Audit

Determine whether existing persisted values for:

```text
shiftDefinitions
shiftCycles
blockTemplates
blockRecurrences
```

are replaced by seeds during ordinary default application startup.

Use direct code evidence and, if useful, targeted existing tests or a non-mutating exploratory test run.

Classify the behavior:

* confirmed;
* inferred;
* unresolved.

If confirmed, identify whether the durable store is rewritten immediately with seed values.

---

# Partial Overwrite Analysis

Task 2.1 found that only four of seven authored fields are seeded.

Determine the resulting hybrid state after startup when persisted authored data already exists.

For example:

```text
persisted:
    schedulingPreferences
    previewRange
    shiftDefinitions
    shiftCycles
    blockTemplates
    blockRecurrences
    manualEvents

after seed:
    persisted schedulingPreferences preserved
    persisted previewRange preserved
    seeded shiftDefinitions
    seeded shiftCycles
    seeded blockTemplates
    seeded blockRecurrences
    persisted manualEvents preserved
```

Confirm actual behavior.

This hybridization is important because it may create authored combinations the user never explicitly created.

---

# Persistence Effects

For each seed setter, establish:

* whether active persistence occurs;
* whether persistence is full-snapshot or partial;
* whether a previous durable authored representation is replaced;
* whether failure follows the Phase 1 session-first durability contract;
* whether retained durability becomes durable/failure after seed writes.

Do not change persistence behavior.

---

# Notification Effects

Determine how many ordinary state notifications default seeding produces.

Task 2.1 reports four authoritative setters.

Confirm whether startup therefore emits four mutations/notifications after store construction.

Determine whether UI subscribers are already mounted when these occur.

This may affect whether the behavior is observable, but the main question remains authority.

---

# Preview Effects

Determine what happens if the rehydrated store contains a Preview through:

* supported persistence;
* injected initial state;
* test composition.

Active persistence does not restore Preview, but optional initialization can inject one.

Establish whether seed setters:

* mark it stale;
* clear it;
* preserve it;
* regenerate it.

Do not treat this as the primary defect unless relevant to initialization authority.

---

# First-Run Detectability

Explicitly investigate whether DayFrame currently has a reliable first-run signal.

Potential evidence may include:

* absence of active storage key;
* absence of profile key;
* explicit onboarding marker;
* schema/version marker;
* app preference;
* first-run flag;
* seed marker;
* migration marker.

Do not assume:

```text
no active storage key
```

necessarily means:

```text
new user
```

because a user may have explicitly cleared local data.

Classify current detectability.

---

# Empty-State Ambiguity

Investigate whether DayFrame can distinguish:

```text
brand-new installation with no authored setup
```

from:

```text
user intentionally cleared their authored data
```

or:

```text
user intentionally has empty shifts/templates/etc.
```

This is a critical authority question.

If the application cannot distinguish them, automatic seeding based solely on empty collections may recreate data after the user deliberately removed it.

---

# Clear Interaction

Trace:

```text
clearLocalData()
    ↓
runtime resets
    ↓
durable keys removed
```

Then ask:

> What happens on the next application start through `createSeededDayFrameStore`?

Determine whether seed content immediately returns.

If so, classify whether current clear semantics are undermined by startup seeding.

This must be explicitly answered.

---

# Profile / Backup Interaction

Determine whether:

* loading a profile during a session can later be overwritten by seeds without restart;
* importing a backup during a session can be overwritten by seeds;
* only new application construction invokes seed logic.

The likely answer is startup-only, but confirm.

---

# Demo-Mode Evidence

Search for explicit concepts such as:

```text
demo
sample
example
showcase
seed
onboarding
first run
starter
```

in:

* production UI;
* environment variables;
* build configuration;
* routes;
* store constructors;
* documentation;
* tests.

Determine whether a real demo mode exists.

If no explicit mode exists, record that.

---

# Development-Only Evidence

Determine whether the seeds were originally intended as developer convenience.

Inspect:

* git history where useful;
* comments;
* historical task results;
* test usage;
* previous demo/default changes.

Historical intent is supporting evidence only.

Current executable production usage remains authoritative for current behavior.

---

# Test-Scaffolding Evidence

Determine whether tests depend on default seeded store behavior.

Classify test callers as:

* intentionally exercising product seed behavior;
* relying on seeded content as fixture convenience;
* explicitly constructing their own store;
* unresolved.

This matters for later implementation scope.

---

# Product-Behavior Evidence

Search current UI/product wording for any promise equivalent to:

* “example schedule”;
* “demo setup”;
* “starter schedule”;
* “sample data”;
* onboarding instructions that expect seeds.

If no such product semantics exist, record the absence.

Do not infer a product promise from code alone.

---

# Seed Authority Question

Explicitly answer:

> Is seeded content authoritative user data?

Possible answers include:

* never;
* only after explicit user adoption;
* only on first run;
* only in explicit demo mode;
* currently yes by implementation but architecturally unjustified;
* unresolved.

The investigation must distinguish:

```text
current behavior
```

from:

```text
recommended authority contract
```

---

# Candidate Initialization Model A — Always Seed

Current conceptual behavior:

```text
construct store
    ↓
rehydrate
    ↓
always write seeds
```

Assess:

* user-data preservation;
* clear semantics;
* repeatability;
* surprise;
* demo usefulness;
* architectural authority.

Do not adopt simply because it exists.

---

# Candidate Initialization Model B — Seed Only When Active Storage Is Absent

Model:

```text
no active storage payload
    ↓
seed
```

Assess the clear ambiguity.

If clear removes the key, this model may re-seed after an intentional clear.

Determine whether that is acceptable or requires another marker.

---

# Candidate Initialization Model C — Seed Only When Authored Collections Are Empty

Model:

```text
all/selected authored collections empty
    ↓
seed
```

Assess whether intentionally empty user state can be distinguished from first run.

Likely risk:

```text
user deletes all examples
    ↓
restart
    ↓
examples return
```

Confirm architectural implications.

---

# Candidate Initialization Model D — Explicit First-Run Marker

Model:

```text
first-run state explicitly known
    ↓
seed once
    ↓
mark onboarding/seed consumed
```

Assess:

* durable marker requirements;
* interaction with clear;
* versioning;
* migration;
* whether this adds new product state;
* whether Phase 2 should authorize it.

Do not implement.

---

# Candidate Initialization Model E — Explicit Demo Mode

Model:

```text
normal app
    → unseeded store

demo/showcase mode
    → seeded store
```

Assess whether this cleanly separates sample data from user authority.

Determine what explicit mode signal would be required.

Do not invent routing/config without evidence.

---

# Candidate Initialization Model F — UI-Owned Optional Starter Setup

Model:

```text
new/empty user
    ↓
UI offers starter/demo setup
    ↓
user explicitly adopts it
    ↓
store commits authored data
```

Assess:

* authority clarity;
* UX cost;
* future Planner mental model;
* whether it avoids silent writes.

Do not design UI.

---

# Candidate Initialization Model G — No Seeded Authored Data

Model:

```text
store starts from defaults/rehydrated authority only
```

Seed examples become:

* test fixtures;
* development helpers;
* optional product examples elsewhere.

Assess whether current product needs automatic sample scheduling.

---

# Required Candidate Matrix

Produce:

| Model                      | Protects Rehydrated User Data | Distinguishes Intentional Clear | Requires New Marker/Mode | Silent Authored Write | Demo Capability | Architectural Clarity | Recommendation |
| -------------------------- | ----------------------------: | ------------------------------: | -----------------------: | --------------------: | --------------: | --------------------: | -------------- |
| Always seed                |                               |                                 |                          |                       |                 |                       |                |
| Seed if key absent         |                               |                                 |                          |                       |                 |                       |                |
| Seed if collections empty  |                               |                                 |                          |                       |                 |                       |                |
| Explicit first-run marker  |                               |                                 |                          |                       |                 |                       |                |
| Explicit demo mode         |                               |                                 |                          |                       |                 |                       |                |
| User-adopted starter setup |                               |                                 |                          |                       |                 |                       |                |
| Never auto-seed            |                               |                                 |                          |                       |                 |                       |                |

---

# Authority Decision Standard

The preferred architecture should satisfy:

1. successfully rehydrated user-authored data is never silently replaced by demo/sample content;
2. intentionally cleared user state is not silently repopulated unless clear explicitly promises reset-to-starter behavior;
3. intentionally empty authored collections remain valid user intent;
4. demo/sample content is not mistaken for user-authored data;
5. seed application, if retained, has one explicit authority/lifecycle condition;
6. startup construction does not perform hidden domain mutations without architectural justification;
7. persistence and notification behavior are deterministic;
8. future engine work can assume startup authored authority is already settled.

---

# Clear Semantics Decision

Explicitly determine whether current:

```text
Clear local data
```

means:

## A. Return to application starter/demo content

or:

## B. Remove user-authored durable data and return to neutral defaults/empty state

or another explicit contract.

Use current UI wording and behavior evidence.

Do not silently redefine clear.

---

# Defaults Authority

Determine what `createInitialDayFrameState()` defaults mean.

Classify whether they are:

* necessary structural defaults;
* user-authority defaults;
* neutral empty state;
* starter content.

This decision matters because removing seeded data should not accidentally remove required structural defaults.

---

# Seed Data Provenance

If seed data remains part of the product in any model, determine whether future runtime should know its provenance.

Potential distinction:

```text
system-provided example
```

versus:

```text
user-authored commitment
```

Do not add provenance fields here.

Simply determine whether such a distinction would be architecturally required.

---

# Future Engine Implications

Assess how silent seeding could affect the future engine.

Examples:

* engine treats seeded commitments as actual user intent;
* capacity analysis assumes example shifts are real;
* goals/recommendations incorporate starter content;
* execution/history could record actions against examples.

This strengthens the need to settle seed authority before richer derived systems exist.

---

# Durable-Data Implications

If future seed/first-run markers are proposed, assess whether they belong in:

* active authored data;
* application metadata;
* separate settings;
* not persisted.

Do not decide implementation unless necessary.

Any new durable marker would fall under the Phase 1 durable-data ADR.

---

# Migration Implications

If current users already have seed-generated authored data persisted, determine whether changing seed policy requires migration.

Important distinction:

```text
seed data currently stored
```

does not necessarily contain provenance proving whether the user accepted, edited,
or depended on it.

Do not propose deleting existing seed-looking data based solely on matching IDs or values unless provenance is reliable.

---

# Existing Seed IDs / Recognition

Inspect whether seed objects have stable IDs such as:

```text
default_...
demo_...
seed_...
```

Determine whether those IDs can prove origin.

Be conservative:

* matching an ID may indicate origin;
* later user modification may still make the object meaningful user data.

Do not authorize cleanup based solely on recognizable IDs in this investigation.

---

# User-Data Preservation Principle

Adopt or confirm:

> Once sample/demo content has entered the authoritative authored state and been durably persisted, later code must treat that stored representation as user data unless reliable provenance and an explicit migration policy authorize otherwise.

This prevents a later seed cleanup from silently deleting data merely because it originated as an example.

Evaluate against the durable-data ADR.

---

# Initialization Authority Map

Produce:

| Initialization Source   | May Establish Active Authored Authority? | Conditions | Current Behavior | Recommended Behavior |
| ----------------------- | ---------------------------------------: | ---------- | ---------------- | -------------------- |
| structural defaults     |                                          |            |                  |                      |
| persisted active state  |                                          |            |                  |                      |
| profile storage         |                                          |            |                  |                      |
| injected initial state  |                                          |            |                  |                      |
| seed/demo data          |                                          |            |                  |                      |
| future first-run marker |                                          |            |                  |                      |

---

# Startup Ownership Map

Produce:

| Responsibility              | Current Owner | Recommended Owner |
| --------------------------- | ------------- | ----------------- |
| read active persisted state |               |                   |
| normalize active state      |               |                   |
| establish runtime authority |               |                   |
| decide first-run status     |               |                   |
| decide demo mode            |               |                   |
| apply sample content        |               |                   |
| persist sample adoption     |               |                   |
| notify runtime subscribers  |               |                   |

---

# Required Behavioral Invariants

Identify and recommend the invariants a later implementation must protect.

Likely candidates:

1. existing persisted authored collections survive ordinary startup unchanged;
2. ordinary startup performs no hidden authored mutation;
3. seed/demo content appears only under an explicit authority condition;
4. intentional clear does not unexpectedly repopulate data;
5. intentionally empty collections remain valid;
6. explicit demo/starter adoption persists through normal authored mutation paths;
7. changing seed policy does not delete already persisted user data.

Only adopt those justified by the final authority decision.

---

# Required Test Contract For Later Implementation

Do not add tests now.

Specify the tests Task 2.2 determines a later implementation must include.

At minimum consider:

* persisted user shifts survive restart;
* persisted cycles survive restart;
* persisted templates survive restart;
* persisted recurrences survive restart;
* manual events/preferences/range remain unaffected;
* empty state behavior;
* clear then restart;
* explicit demo/first-run behavior if adopted;
* no unexpected persistence writes during ordinary startup;
* no unexpected notifications during ordinary startup;
* existing seeded-looking persisted data is not automatically deleted.

---

# Architectural Alignment Assessment

Classify current seeded initialization as:

* aligned;
* partially aligned;
* mismatched;
* unresolved.

Assess separately:

* user-data preservation;
* explicit authority;
* deterministic initialization;
* demo/product semantics;
* clear semantics;
* future migration safety.

---

# Required Investigation Labels

Every significant conclusion must use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Do not label product intent as confirmed unless supported by product behavior or governance evidence.

---

# Explicit Non-Goals

Task 2.2 shall not:

* remove `createSeededDayFrameStore`;
* change default store construction;
* add first-run markers;
* add demo mode;
* add onboarding UI;
* change seed values;
* change seed IDs;
* change clear behavior;
* change persistence;
* change notification behavior;
* change durability behavior;
* migrate current users;
* delete seed-looking stored data;
* alter `createInitialDayFrameState`;
* change `DayFrameState`;
* split state containers;
* change Preview;
* change engine behavior;
* resolve suggested-fix authority;
* resolve preview-range authority;
* update architecture/governance documents before review.

---

# Dependencies

Requires completion and acceptance of:

* Phase 1 — Architectural Foundation Alignment;
* Task 2.1 — Establish the Authoritative and Derived State Boundary.

Governed by:

* Architecture Charter;
* Complete Architecture Specification;
* `DECISIONS.md`;
* durable-data compatibility ADR;
* Phase 1 checkpoint.

---

# Evidence Standards

Priority:

1. current production code;
2. production callers;
3. direct tests;
4. current UI behavior and copy;
5. durable persistence behavior;
6. git history;
7. historical task documentation.

Historical intent may explain why seeds exist, but current production behavior determines current authority risk.

---

# Required Code Inspection

At minimum inspect:

```text
createSeededDayFrameStore
createDayFrameStore
createInitialDayFrameState
loadPersistedState
persistState
clearLocalData
DayFrameApp default store construction
setShiftDefinitions
setShiftCycles
setBlockTemplates
setBlockRecurrences
```

Also inspect:

* current default seed constants/helpers;
* product UI language;
* relevant store/app tests;
* git history for seed introduction where useful.

---

# Validation Requirements

This task is investigation only.

No executable or test files should change.

Run targeted tests only where needed to confirm startup behavior.

At minimum consider current suites covering:

```text
dayFrameStore
DayFrameApp
```

If repository execution discipline requires it, run:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* Task 2.2 specification remained immutable;
* no production/test file changed;
* result artifact exists separately;
* governance documents remain unchanged pending review.

---

# Documentation Rules

During Task 2.2:

## Create

`TASK_2.2_ESTABLISH_SEEDED_STORE_INITIALIZATION_AUTHORITY_AND_FIRST_RUN_DEMO_BOUNDARIES_RESULT.md`

## Preserve

* Task 2.2 specification;
* Task 2.1 result;
* Phase 1 history/checkpoint;
* architecture/governance documents;
* ADRs.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* Phase checkpoints.

Those require project review.

Do not create a task-specific checkpoint unless explicitly authorized.

---

# Required Result Artifact Structure

The Task 2.2 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Seeded-Store Implementation
5. Production Caller Inventory
6. Seed Content Inventory
7. Defaults Versus Seeds
8. Startup/Rehydration Sequence
9. Persisted-Data Overwrite Behavior
10. Partial-Overwrite Semantics
11. Persistence Effects
12. Notification Effects
13. Preview Effects
14. First-Run Detectability
15. Empty-State Ambiguity
16. Clear/Restart Semantics
17. Profile/Backup Interaction
18. Demo-Mode Evidence
19. Development/Test Evidence
20. Product-Behavior Evidence
21. Current Seed Authority Classification
22. Candidate Initialization Models
23. Candidate Model Matrix
24. Clear Semantics Determination
25. Defaults Authority
26. Seed Data Provenance
27. User-Data Preservation Determination
28. Existing Seed-ID/Recognition Assessment
29. Future Engine Implications
30. Durable-Data / Migration Implications
31. Initialization Authority Map
32. Startup Ownership Map
33. Adopted Authority Contract
34. Required Behavioral Invariants
35. Required Later Test Contract
36. Architectural Alignment Assessment
37. Open Questions
38. Recommended Implementation Task
39. Deviations
40. Discoveries and Deferred Work
41. Validation
42. Final Completion Determination

---

# Expected Decision Outcomes

Several outcomes are valid.

## Outcome A — Seed Only In Explicit Demo Mode

Normal application startup becomes authority-neutral.

Seeded authored content exists only under an explicit demo/showcase context.

## Outcome B — Seed Only During Explicit First-Run Onboarding

Sample content may become authored state only after a reliable first-run condition
and possibly explicit user adoption.

## Outcome C — Optional Starter Setup

Normal state starts neutral; product UI offers sample/starter content that the user
explicitly adopts.

## Outcome D — Remove Automatic Product Seeding

Seed data remains only as test/development fixtures or example content outside
runtime authority.

## Outcome E — Preserve Current Always-Seed Behavior

This outcome requires strong product/governance evidence justifying automatic
replacement of rehydrated authored state.

The current implementation alone is not sufficient evidence.

---

# Recommended Decision Bias

Where evidence is ambiguous, prefer the model that protects already established
user-authored authority and minimizes hidden startup mutation.

That generally means:

```text
rehydrated user data
    > automatic sample/demo data
```

unless an explicit product contract says otherwise.

This is an authority principle, not a predetermined implementation choice.

---

# Expected Follow-Up

If Task 2.2 confirms that default production seeding must stop overwriting
rehydrated authority, the likely next task should be a bounded implementation such
as:

> **Task 2.3 — Align Default Store Construction With the Adopted Seed Authority Contract**

That task should modify only the smallest startup seam required by the Task 2.2
decision and directly protect persisted user-authored data.

If Task 2.2 instead finds that another governance/product decision is required
before implementation, that decision should become the next task.

Do not automatically advance to suggested-fix authority until the startup
authority defect is either corrected or explicitly accepted.

---

# Completion Criteria

Task 2.2 is complete when:

* all seeded-store production callers are identified;
* seed content and written authored fields are inventoried;
* startup rehydration and seed-write ordering are established;
* persisted-data overwrite behavior is established;
* partial hybrid-state behavior is established;
* persistence/notification consequences are documented;
* first-run detectability is determined;
* intentional-empty-state ambiguity is determined;
* clear/restart behavior is determined;
* demo/development/test evidence is classified;
* current seed authority is classified;
* candidate initialization models are compared;
* one authority contract is adopted or the missing governance blocker is explicitly identified;
* existing persisted seed-origin data receives a preservation determination;
* migration implications are assessed;
* required later behavioral invariants/tests are defined;
* no executable behavior changes;
* a smallest dependency-correct next task is identified.

---

# Task Determination

Task 2.2 is an authority investigation into DayFrame's seeded startup behavior.

It does not remove or redesign seeds.

Its purpose is to determine whether sample/default content is permitted to become
authoritative user state automatically, and to establish a safe initialization
contract before the future engine treats every authored object as meaningful user
intent.

**The task is complete when DayFrame has an evidence-backed authority contract for seeded data defining what seeded content represents, whether and when it may become authoritative authored state, how first-run/demo/development contexts are distinguished, how persisted user-authored state is protected from seed overwrite, and what smallest implementation change is required without conflating product defaults, demo content, and user data.**
