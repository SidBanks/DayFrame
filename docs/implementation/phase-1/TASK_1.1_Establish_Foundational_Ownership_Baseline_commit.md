# Implementation Task 1.1 — Establish Foundational Ownership Baseline

## Task Identifier

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.1  
**Status:** Ready

---

## Objective

Establish an implementation-level ownership baseline for the architectural
foundation that Phase 1 will modify.

Identify the current executable ownership of foundational responsibilities,
with particular attention to:

- authored state;
- derived Preview state;
- application-level coordination;
- scheduling generation;
- persistence;
- profiles and backup;
- navigation and workflow state;
- feedback and recovery state;
- manual-event ownership;
- shared date and scheduling infrastructure.

The task shall determine the smallest safe architectural seams from which
subsequent Phase 1 implementation tasks can proceed.

This task is investigative.

It shall not modify production behavior.

---

## Architectural Alignment

This task supports Phase 1 — Architectural Foundation Alignment.

It directly supports the Alignment Strategy requirements to:

- correct architectural structure before refining behavior;
- clarify authority and ownership;
- reduce aggregate coordination;
- resolve root causes before symptoms;
- preserve deterministic state ownership;
- maintain architectural traceability.

The Architecture Audit Synthesis identifies distributed responsibility
ownership and implicit architectural identity as recurring foundational
alignment gaps.

The UX Audit Synthesis identifies DayFrameApp as the primary aggregate
coordinator across domain, workflow, navigation, feedback, persistence,
focus, and interaction context.

This task converts those synthesized findings into implementation-level
boundaries suitable for controlled refactoring.

---

## Scope

Inspect the production implementation responsible for the current
Setup → Preview workflow.

At minimum, trace:

- DayFrameApp;
- dayFrameStore;
- Preview generation;
- Preview revision;
- authored-state mutation;
- persistence and rehydration;
- profiles;
- backup/import/export;
- manual calendar events;
- navigation state;
- selection/editor state;
- feedback state;
- focus/continuity behavior;
- shared scheduling/date helpers.

For each responsibility, identify:

1. current owner;
2. authoritative state;
3. direct dependencies;
4. callers;
5. mutation paths;
6. persistence involvement;
7. architectural responsibility represented;
8. whether ownership is:
   - coherent;
   - distributed;
   - duplicated;
   - obsolete;
   - ambiguous.

---

## Non-Goals

This task shall not:

- modify production code;
- introduce Architectural Services;
- introduce Architectural Engines;
- redesign the store;
- redesign DayFrameApp;
- alter scheduling behavior;
- change persistence;
- change UX;
- implement Planner or Summary;
- implement Live or Learn;
- rename implementation concepts solely to match architectural terminology;
- propose speculative abstractions.

The task exists only to establish the implementation boundary required for
safe Phase 1 execution.

---

## Dependencies

Requires:

- published Architecture Specification;
- Architecture Audit Synthesis;
- UX Audit Synthesis;
- Alignment Strategy;
- Implementation Roadmap;
- Implementation Execution Plan.

No prior Phase 1 implementation task is required.

---

## Implementation Notes

Evidence must come from executable production code and relevant automated
tests.

Architectural ownership must be determined from behavior rather than:

- filenames;
- comments;
- intended future design;
- naming conventions.

Existing behavior that already provides a coherent architectural boundary
should be preserved.

Do not assume that an architectural concept requires a corresponding
directory, class, module, or file.

---

## Required Output

Produce a concise **Phase 1 Foundational Ownership Map** containing:

| Responsibility | Current Owner | Authority | Dependencies | Assessment | Candidate Seam |
|---|---|---|---|---|---|

The map should identify the smallest dependency-correct candidates for the
first production-code changes in Phase 1.

Any uncertainty should be explicitly marked rather than resolved through
assumption.

---

## Validation Requirements

Validation is documentary and evidentiary.

Confirm that:

- every ownership claim is traceable to executable code;
- relevant tests have been inspected where behavioral guarantees are claimed;
- no production behavior has changed;
- no architectural responsibility has been assigned solely from naming;
- identified candidate seams preserve deterministic scheduling behavior;
- unresolved ownership questions are explicitly recorded.

Existing automated tests do not need to be changed because this task makes
no production-code changes.

The existing test suite may be run to establish the pre-implementation
baseline.

---

## Documentation Updates

At completion:

- record the resulting ownership map as Phase 1 implementation evidence;
- update `CURRENT_STATE.md` to identify the first production implementation
  task;
- create a Session Checkpoint;
- update `CHANGELOG.md` only if the task produces a project-level milestone
  warranting historical recording.

---

## Completion Criteria

Task 1.1 is complete when:

- foundational implementation ownership has been mapped;
- distributed and ambiguous responsibilities relevant to Phase 1 have been
  identified;
- obsolete structures relevant to Phase 1 have been identified where
  executable evidence supports that determination;
- candidate architectural seams have been identified;
- the first production-code implementation task can be derived from evidence
  rather than assumption;
- no production behavior has changed.

---

## Task Determination

Task 1.1 does not align the architecture directly.

It establishes the precise implementation boundary from which architectural
alignment can safely begin.

The task is complete when the question:

> **What is the smallest dependency-correct production change that should
> begin Phase 1?**

can be answered from executable evidence.