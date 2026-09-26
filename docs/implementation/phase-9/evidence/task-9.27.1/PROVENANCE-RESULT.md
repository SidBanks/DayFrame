# Task 9.27.1 evidence provenance

Architecture proposal only. Production/test source, prior evidence, and all accepted architecture documents remain unchanged. The new proposal is awaiting architectural acceptance.

The first diagnostic case is copied from Task 9.27, retaining its exact sequence and assertions. Its relative output URL now writes in this new evidence directory, leaving the old observation file untouched. The second case extends denied-admission observations to relationship revision, retirement and persistence retry, counting actual calls to the existing storage mutation method. Both use real canonical owner commands, controlled clocks/readiness and separate fake IndexedDB factories. No preserved user database or browser was used. IDs are freshly allocated and may differ on rerun.

From `code/`:

```sh
npm test -- --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.27.1/contract-repro-config-RESULT.mjs
```

This writes `contract-observations-RESULT.json` and `admission-observations-RESULT.json` here. A passing diagnostic confirms existing defects, not proposed repaired behavior. No native race, pending-write race, physical-device or Structure authoring acceptance is claimed. Async-boundary requirements in the proposal derive from inspected lazy dispatch, storage opening, transaction epochs and restore/clear orchestration; those new mechanisms were not executed.

The full suite and selected existing suites ran with two workers using installed dependencies. Exact commands, selection, output, baseline hash comparison and bundle metrics are retained in `validation-RESULT.json`. No failing application assertions or application gates were encountered. An artifact-format glob included plain-text baseline captures and returned “no parser”; a supported-extension-only check corrected the invocation without changing those captures. Source discovery initially tried two nonexistent guessed transaction-module paths; discovery located the actual `dayFrameAuthorityTransaction.ts`. No file was created at those guessed paths.

Baseline HEAD/status/hashes were captured before outputs. A full file copy also exists under `/tmp/dayframe-9271-baseline-RESULT/`; the retained hash index and exact status do not depend on it. One verified production build supplies baseline/final measurements because every production input remains byte-identical. No speculative repaired bundle estimate is supplied.

Artifacts are repository-local and uncommitted; no remote backup is claimed. The immutable task input already existed and was verified byte-identical to the attachment, with all 18 sections and final statement. Its filename is preserved rather than renamed under the new-output naming rule.
