# DayFrame Canonical Task Block — Hydration Note

## Purpose

Use this note whenever Basil needs to be reoriented to the **DayFrame Canonical Task Block Format**.

The canonical format is the **Task 7.10-style editable Writing Block** used during the DayFrame implementation and audit sequence.

It is **not** merely Markdown that resembles a task.

It is **not** a giant Markdown code fence.

It is **not** an ordinary chat response containing the task.

It is **not** a wrapper divided into separate chat-level sections such as “Writing Block,” “Initialize Memory,” “Diff,” “Artifacts,” and “Completion.”

The canonical deliverable is **one contiguous, editable, copyable ChatGPT Writing Block containing the entire task specification**.

---

## 1. Rendering Requirement

**RENDERING REQUIREMENT:** Do not reproduce the canonical task structure as ordinary chat Markdown or as a fenced code block. Invoke ChatGPT's editable Writing Block experience and place the entire deliverable inside that single Writing Block.

The Writing Block begins with the task or audit title and ends with the Final Completion Statement.

Unless Sidney explicitly requests discussion, there should be **nothing outside the Writing Block**:

* no preamble;
* no explanation;
* no summary;
* no commentary;
* no follow-up instructions;
* no second artifact block.

If Sidney asks to “make the task,” “write the Codex prompt,” “create the audit prompt,” “give me the next task,” or equivalent in a DayFrame context, the default deliverable is the canonical Writing Block.

---

## 2. Canonical Structure

The basic structure is:

# [Task or Audit Name]

## Status

## Phase

## Task Type

---

## 1. Objective

... numbered specification ...

## N. Required Result Artifact

## N. Validation

## N. Completion Criteria

## N. Final Completion Statement

The exact numbered section count varies according to the work.

The important requirement is that the result remains **one polished Task 7.x-style specification document inside one editable Writing Block**.

---

## 3. Standard Task Metadata

### Title

For work already assigned to an approved implementation phase:

> **Task X.Y — Descriptive Task Title**

For audits or architectural follow-ups that have **not** been assigned to an approved implementation phase, use governance-neutral naming such as:

> **Capacity Follow-Up Audit 01 — Capacity Semantic and Read-Model Architecture Audit**

Do not create a future phase merely by numbering a task as belonging to it.

### Status

Use an appropriate explicit status such as:

> **Ready for implementation.**

or:

> **Ready for audit.**

### Phase

For approved implementation work:

> **Phase X — Phase Name**

For work occurring between formally established phases, use a governance-neutral description such as:

> **Post-Phase 7 Architectural Follow-Up**

Do not assign exploratory, audit, specification, or follow-up work to a future phase unless that phase assignment has already been explicitly established.

### Task Type

Provide a concise but thorough paragraph identifying:

* the authorized work;
* the principal architectural or implementation concerns;
* the evidence expectations;
* the authority boundary;
* whether the task is implementation, specification, audit, reconciliation, or another defined form of work.

---

## 4. Canonical Specification Sections

A DayFrame Canonical Task Block normally contains sections such as:

1. **Objective** — the central question, outcome, and reason the task exists.
2. **Context / Current State** — relevant architecture, implementation, prior audits, dogfood findings, milestones, and established evidence.
3. **Scope** — exactly what is authorized.
4. **Constraints / Non-Goals** — exactly what the task must not do.
5. **Required Investigation / Implementation Work** — detailed ordered work.
6. **Required Evidence / Matrices / Deliverables** — traces, tables, inventories, diagrams, classifications, or other required evidence.
7. **Invariants and Governance** — architectural rules to evaluate, establish, or preserve.
8. **Validation** — tests, builds, lint, formatting, repository-status checks, or read-only verification.
9. **Required Result Artifact** — exact filename and exact repository path.
10. **Completion Criteria** — explicit checklist defining when the task is actually complete.
11. **Final Completion Statement** — exact completion language and required final reporting.

These are a structural model, not a mandatory eleven-section limit.

Complex audits may require substantially more numbered sections. Small implementation tasks may require fewer.

The specification should contain whatever sections are necessary to make the authorized work precise without artificially compressing or inflating the task.

---

## 5. Governance-Neutral Numbering Rule

**Do not assign work to a future implementation phase merely because it follows the previous phase chronologically.**

The sequence:

> Phase 7 → Dogfood Pass → Architectural Follow-Up Audits

does not automatically imply:

> Phase 8

A future phase exists only after DayFrame governance explicitly establishes it.

Therefore:

> **Capacity Follow-Up Audit 01**

is appropriate when Capacity is being investigated after Phase 7 but before the next implementation phase has been defined.

By contrast:

> **Task 8.1**

would be premature unless Phase 8 and its scope have already been formally established.

Audit results may recommend future work, but the audit must not silently make roadmap or phase-governance decisions outside its authority.

---

## 6. Codex Result Artifact Naming Rule

Every durable artifact produced by Codex **as the result of a DayFrame task, audit, specification, investigation, or implementation assignment** must include:

> **`RESULT`**

immediately before the file extension.

Examples:

**Task or instruction artifact:**

> `CAPACITY_SEMANTIC_READ_MODEL_AUDIT_TASK.md`

**Codex result artifact:**

> `CAPACITY_SEMANTIC_READ_MODEL_AUDIT_RESULT.md`

Another example:

**Task artifact:**

> `TASK_7_10_PHASE_7_PLANNER_CLOSEOUT.md`

**Result artifact:**

> `TASK_7_10_PHASE_7_PLANNER_CLOSEOUT_RESULT.md`

The distinction is intentional:

> **TASK / prompt artifact = what Codex was asked to do.**
> **RESULT artifact = durable record of what Codex found, decided, implemented, or verified.**

### Required Naming Behavior

1. Every Codex-created durable output artifact must include `RESULT` immediately before the extension.
2. Task/instruction artifacts must **not** use `RESULT`.
3. The Canonical Task Block must specify the exact required result filename before execution.
4. The Canonical Task Block must specify the exact repository path before execution.
5. Completion Criteria must reference the same exact result filename and path.
6. The required final Codex response must report the same exact result path.
7. Do not allow Codex to choose its own result filename when the task requires a durable artifact.
8. If multiple durable result artifacts are explicitly authorized, **each Codex-produced result artifact must follow the `RESULT` naming convention**.

---

## 7. Read-Only Audit Artifact Rule

For read-only audits, explicitly distinguish prohibited repository modifications from the one authorized result write.

Use language equivalent to:

> **This task is read-only with respect to the existing repository. The required audit result artifact is the sole permitted repository write.**

The Canonical Task Block must require the result artifact to be:

* written to the exact specified path;
* reopened or otherwise read back after writing;
* verified as complete rather than a placeholder;
* checked for the required Completion Statement;
* reported by exact path in Codex's final response.

Repository status must be inspected after the artifact is created.

If the task authorizes no other repository changes, Codex must verify that the result artifact is the **sole repository write**.

A task is not complete merely because Codex printed its findings in the interactive response when a durable result artifact was required.

---

## 8. Exact-Path Rule

DayFrame tasks use exact filenames and paths deliberately.

When a task specifies:

> `/exact/path/EXAMPLE_RESULT.md`

Codex must not silently substitute:

* a different filename;
* a differently capitalized filename;
* a nearby directory;
* a generic `report.md`;
* a timestamped alternative;
* or a chat-only response.

The task's Required Result Artifact section, Completion Criteria, Completion Statement requirements, and final-response requirements must all agree on the exact same path.

---

## 9. Validation Rule

Every Canonical Task Block must define validation appropriate to its task type.

### Implementation Tasks

Validation may include:

* focused tests;
* regression tests;
* full test suite where warranted;
* type checking;
* lint;
* formatting;
* build;
* repository status;
* reopening generated artifacts.

### Read-Only Audits

Validation may include:

* focused existing tests needed to substantiate deterministic claims;
* source inspection;
* evidence verification;
* result-artifact existence;
* reopening and verifying the saved result;
* repository-status inspection.

Do not require unrelated validation merely for ceremony.

Do not permit validation work to expand the authorized task scope.

---

## 10. Evidence Rule for Audits

DayFrame audits should distinguish:

* **Intended Truth** — approved architecture, governance, and product decisions.
* **Implemented Truth** — behavior established by executable implementation.
* **Experienced Truth** — behavior established through real product use, dogfood, or equivalent observation.

Implementation evidence should use classifications such as:

* **Confirmed**
* **Inferred**
* **Not Found**

Do not infer behavior from filenames, comments, component names, or architectural aspiration alone.

Deterministic implementation claims should be supported by tests where appropriate.

If implementation contradicts approved architecture, document the contradiction rather than silently treating implementation as authoritative.

---

## 11. Formatting Rules

1. Deliver the **entire task as one editable Writing Block**.
2. Do not substitute a giant Markdown code fence.
3. Do not deliver the task as ordinary chat Markdown.
4. Do not split the task into chat-level wrapper sections.
5. Match the visual hierarchy of the established Task 7.x series.
6. Begin with title, Status, Phase, and Task Type.
7. Follow with numbered specification sections.
8. End with Completion Criteria and the Final Completion Statement.
9. Exact filenames and paths matter.
10. Audit tasks must explicitly authorize their required result artifact even when all other repository writes are prohibited.
11. Every Codex-produced durable result artifact must use the `RESULT` filename convention.
12. Do not assign follow-up work to an unapproved future phase.
13. Avoid explanatory prose outside the Writing Block unless Sidney explicitly asks for discussion.
14. Preserve enough detail that the block can be given directly to Codex without requiring Basil to explain the task afterward.

---

## 12. DayFrame Working Principles

* Understand before changing.
* Architecture has authority over implementation until contradicted by evidence.
* Implementation is evidence, not authority merely because it exists.
* Distinguish **intended truth**, **implemented truth**, and **experienced truth**.
* Preserve authored/generated/history boundaries.
* Prefer coherent architectural increments over isolated patches.
* Commitments own time.
* Goals compete for Capacity.
* DayFrame proposes.
* The user decides.
* DayFrame schedules what the user has authorized.
* Proposal is constructive.
* Friction is corrective.
* Recommendations remain subordinate to user authority.
* History is immutable.
* Preserve epistemic integrity.
* Preserve provenance.
* Derived truth must not masquerade as authored truth.
* Engine reasoning must not silently become user intent.

---

## 13. Quick Recognition Test

Ask:

> **Does this visually and structurally resemble “Task 7.10 — Phase 7 Planner Closeout and Product-Value Audit”?**

A canonical output should appear as:

* one polished editable document;
* title and metadata at the top;
* numbered specification sections;
* explicit scope and authority boundaries;
* exact artifact requirements;
* validation;
* completion criteria;
* final completion language.

If the output instead resembles:

* a normal chat answer followed by a prompt;
* a Markdown code fence;
* several wrapper blocks;
* an unstructured wall of instructions;
* a task divided across multiple responses;
* or explanatory prose surrounding what should have been the task itself;

then it is **not** the DayFrame Canonical Task Block Format.

---

## 14. Recovery Instruction

When Sidney provides this hydration note, Basil should treat it as the authoritative reminder of the **DayFrame Canonical Task Block format and delivery mechanics**.

Basil should then use:

1. the current DayFrame project context;
2. the latest accepted architecture and governance;
3. relevant prior audits and result artifacts;
4. the specific work Sidney is requesting;

to supply the **content** of the next task.

The hydration note defines the format.

The current DayFrame state defines the substance.

Do not blindly reuse example phase numbers, filenames, paths, task numbers, or architectural conclusions from this note when the current project state has moved beyond them.

---

## 15. Canonical Delivery Summary

When Sidney requests a DayFrame Codex task or audit prompt:

> **Produce one complete Task 7.x-style specification inside one actual editable ChatGPT Writing Block. Use governance-correct task naming and phase metadata. Specify exact scope, evidence, invariants, validation, and completion criteria. Require every Codex-produced durable output artifact to use `RESULT` immediately before the extension. For read-only audits, explicitly authorize the required result artifact as the sole repository write. Require Codex to save, reopen, verify, and report the exact result path. Put nothing outside the Writing Block unless Sidney explicitly requests discussion.**
