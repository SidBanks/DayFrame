"""Task-relative preservation, source patch and complete manifest (run from repo root)."""
from pathlib import Path
import difflib
import hashlib
import json
import subprocess
import tarfile

E = Path('docs/implementation/phase-9/evidence/task-9.29.4')
RESULT = Path('docs/implementation/phase-9/TASK_9.29.4_ACCEPTANCE_TO_REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_REPAIR_V1_RESULT.md')
ADR = Path('docs/adr/ADR_ACCEPTANCE_TO_REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_V1_RESULT.md')
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
baseline = json.loads((E/'baseline-hashes-RESULT.json').read_text())
source = json.loads((E/'task-source-files-RESULT.json').read_text())
changed = [n for n, h in baseline.items() if Path(n).exists() and sha(Path(n)) != h]
missing = [n for n in baseline if not Path(n).exists()]
unexpected = [n for n in changed if n not in source]
freeze = json.loads((E/'final-build-source-hashes-RESULT.json').read_text())
post_build = [n for n, h in freeze.items() if not Path(n).exists() or sha(Path(n)) != h]
with tarfile.open(E/'baseline-source-RESULT.tar.gz') as archive:
    originals = {m.name: archive.extractfile(m).read().decode() for m in archive.getmembers() if m.isfile()}
patch = []
for name in source:
    patch.extend(difflib.unified_diff(originals.get(name, '').splitlines(True), Path(name).read_text().splitlines(True), fromfile='baseline/'+name, tofile='final/'+name))
(E/'task-relative-RESULT.patch').write_text(''.join(patch))
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
contract = Path('docs/architecture/REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md')
report = {
    'baselineFileCount': len(baseline), 'baselineStatusEntries': len((E/'baseline-status-RESULT.txt').read_text().splitlines()),
    'head': head, 'headUnchanged': head == (E/'baseline-head-RESULT.txt').read_text().strip(),
    'changedBaselineFiles': changed, 'missingBaselineFiles': missing, 'unexpectedBaselineChanges': unexpected,
    'sourceFilesChangedAfterFinalBuild': post_build,
    'newApplicationTestFiles': [n for n in source if n not in originals],
    'priorDocumentationChanged': [n for n in changed if n.startswith('docs/')],
    'unchangedPrior9293Artifacts': sum(n.startswith('docs/implementation/phase-9/evidence/task-9.29.3/') and n not in changed and n not in missing for n in baseline),
    'contractSha256': sha(contract),
    'contractHashMatchesAcceptedADR': sha(contract) == '611eb5c0b800c8e3d9d7a0254d4b807e0fe456e59ac1a5309cd07a53baa498c7',
    'dependenciesSchemaRestoreAndPublicationChanges': [n for n in changed if any(v in n for v in ['package.json', 'package-lock.json', 'dayFrameDurableDb', 'indexedDbCollectionStorage', 'historicalPlanSurface', 'schedulePublication', 'dayFrameRestore', 'dayFrameBackup'])],
}
(E/'preservation-RESULT.json').write_text(json.dumps(report, indent=2)+'\n')
assert not missing and not unexpected and not post_build and report['headUnchanged'] and report['contractHashMatchesAcceptedADR']
subprocess.run(['git', 'diff', '--check'], check=True, stdout=(E/'diff-check-RESULT.log').open('w'), stderr=subprocess.STDOUT)
outputs = sorted({*map(Path, source), ADR, RESULT, *(p for p in E.iterdir() if p.is_file()), E/'FILE_MANIFEST_RESULT.md', E/'readback-RESULT.json'})
def purpose(p):
    n = p.name
    if str(p) in source:
        if n.endswith('.test.ts') or n.endswith('.test.tsx'): return 'Permanent regression coverage or required existing test protocol/currentness alignment.'
        if n == 'acceptanceLifecycleTestFixtures.ts': return 'Disposable canonical saved Goal/Demand/Sleep/full-footprint test fixture.'
        return {
          'acceptanceLifecycle.ts': 'Lightweight issued origin, nonqueued lease, generation, desired version and recognized receipt shell.',
          'acceptancePersistence.ts': 'Native terminal/acknowledgment classification and exact complete-image comparison/evidence capture.',
          'dayFrameStore.ts': 'Original-lifetime handoff, canonical sources, four-owner replacement admission and stale evidence read guard.',
          'proposalSurface.ts': 'Proposal common writer lease, source/base admission, exact image verification, retry/protection/install lifecycle.',
          'realizationSurface.ts': 'Leased exact target/current sources, full-set persistence/verification, certainty and replacement lifecycle.',
          'lazyProposalSurface.ts': 'Synchronous pre-import capture and retained authorized shell installs/reads.',
          'lazyRealizationSurface.ts': 'Synchronous pre-import capture and retained authorized shell installs/reads.',
          'deriveFoundationalSchedule.ts': 'Read-only canonical current realization source preparation behind foundation lazy boundary.',
          'acceptedAllocationRealization.ts': 'Additive runtime outcome reasons/status and reviewRequired; durable/staging policy unchanged.',
          'types.ts': 'Keep new private lifecycle/coordinator/evidence helpers off the public store type.',
          'ScheduleReviewPanel.tsx': 'Typed original-receipt/request/currentness guards and truthful semantic outcome feedback.',
          'GoalPlanningSection.tsx': 'Recognized current recording receipt and unconfirmed outcome copy.',
          'planningResultCopy.ts': 'Exhaustive current realization reason copy.',
        }.get(n, 'Scoped acceptance-to-realization repair source.')
    if p == ADR: return 'New architectural acceptance referencing immutable proposed contract, created before app changes.'
    if p == RESULT: return 'Completed bounded task RESULT and determination.'
    if n.startswith('baseline-'): return 'Pre-implementation dirty-tree baseline, source backup, hashes or measured test/build/bundle log.'
    if n.endswith('.png'): return 'Retained native production screenshot at the labeled viewport/outcome.'
    if n.endswith('.log'): return 'Named actual command/validation run; final and intermediate outcomes distinguished in reproduction guide.'
    if n.endswith('.test.ts'): return 'Isolated evidence test source.'
    if 'export' in n: return 'Actual native UI V14 backup export retained for exact round-trip comparison.'
    if 'authority' in n: return 'Raw native authority observation for the labeled lifecycle ordering.'
    if n == 'browser-driver-RESULT.mjs': return 'Reproducible native production UI/CDP driver with labeled real-native delivery fault seams.'
    if n == 'canonical-seed-RESULT.ts': return 'Canonical disposable full-footprint authoring seed; no acceptance or realization.'
    if n == 'seed-build-config-RESULT.mjs': return 'Disposable seed compilation config using installed repository dependencies.'
    if n == 'audit-RESULT.py': return 'Reproducible task-relative preservation, patch and manifest audit.'
    if n == 'task-relative-RESULT.patch': return 'Exact source delta from dirty baseline archive, including new source files.'
    if n.endswith('.md'): return 'Named task inventory, coverage, reproduction, manifest or baseline report.'
    return 'Named machine-readable measurements, checks, hashes, preservation or readback evidence.'
lines = ['# Task-relative file manifest — RESULT', '', 'All paths are relative to repository root. Existing dirty work is not counted as this task unless its bytes changed from the archived baseline. No historical output is overwritten. Every evidence filename contains RESULT; application/test filenames retain repository conventions.', '', '| Path | Task effect | Purpose |', '| --- | --- | --- |']
for p in outputs:
    state = 'Modified' if str(p) in baseline or str(p) in originals else 'Created'
    lines.append(f'| `{p}` | {state} | {purpose(p)} |')
(E/'FILE_MANIFEST_RESULT.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'changedBaseline': len(changed), 'newSource': len(report['newApplicationTestFiles']), 'manifestEntries': len(outputs), 'unexpected': unexpected, 'postBuildEdits': post_build}))
