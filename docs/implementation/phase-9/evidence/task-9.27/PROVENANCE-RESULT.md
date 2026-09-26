# Task 9.27 diagnostic provenance

Task stopped at its required contract check; no Structure UI was implemented or browser-certified. See the [RESULT](../../TASK_9.27_GOAL_STRUCTURE_AND_MANUAL_MILESTONE_AUTHORING_V1_RESULT.md).

From `code/`:

```sh
npm test -- --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.27/contract-repro-config-RESULT.mjs
```

This runs one diagnostic that records four observations: future-effective dependency handling, accepted reversed retirement interval, changed satisfaction timestamp after a title-only patch, and revision acceptance despite denied mutation admission. Assertions confirm current behavior; they do not establish that behavior as correct. After a repair, this diagnostic should fail and be replaced by permanent regressions for the adopted contract.

Fixture Goals have validated UUID-v4 identities, active lifecycle and duplicate titles. Structure records are created through the actual owner; cryptographic record IDs vary per run. A controlled owner clock simulates rollback. The isolated fake IndexedDB factory receives all writes; no browser, localStorage, Dogfood state, import or recovery action is involved. Surface reinitialization proves durable-record readback in that test environment, not native-browser reload certification.

`contract-observations-RESULT.json` retains exact generated records and outcomes. `validation-RESULT.json` contains material command output. Baseline hashes/status/HEAD preserve the comparison without depending exclusively on temporary files. Diagnostic output is rewritten on rerun; previous task artifacts are not touched. No new production/test source or repository configuration is installed by this diagnostic.

The full suite ran with two workers to control contention, selecting the unchanged normal 159 files and 1,590 tests. Initial external-config loading failed on a nonexistent parent node_modules cache directory; `--configLoader native` resolved that harness issue. An initial formatting command used repository-root cwd with code-relative paths and was corrected. These were harness invocation issues, not hidden application acceptance failures.

All artifacts are retained locally, uncommitted, with no claim of remote backup. No native mobile, screen-reader, physical-device or end-to-end authoring evidence is claimed.
