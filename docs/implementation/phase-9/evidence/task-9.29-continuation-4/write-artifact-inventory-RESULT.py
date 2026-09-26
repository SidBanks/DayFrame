from pathlib import Path
import hashlib,json
root=Path('.');out=Path('docs/implementation/phase-9/evidence/task-9.29-continuation-4')
baseline=json.loads((out/'baseline-hashes-RESULT.json').read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
purposes={
'useReviewReturnFocus.ts':'New ephemeral exact-control Review return focus hook',
'ScheduleReviewWorkspace.tsx':'Bounded Review origin focus integration',
'ScheduleReviewPanel.tsx':'Exhaustive refusal copy and contextual control keys',
'PreviewScreen.tsx':'Existing source editor origin focus keys',
'DayFrameApp.tsx':'In-place Event Close returns focus to Review origin',
'ReviewReturnFocus.test.tsx':'Four actual-App focus and zero-history regressions',
'ReviewCertaintyWorkflow.test.tsx':'61 actual-fault and labelled typed consumer result/receipt cases',
'ReviewIndependentDrafts.test.tsx':'Measurement/Observation original-revision draft retention',
'GoalStructureAuthoring.test.tsx':'Real restore completion synchronization and exact status assertion',
}
entries=[]
for p in Path('code/src').rglob('*'):
 if p.is_file() and (str(p) not in baseline or sha(p)!=baseline[str(p)]):
  entries.append({'path':str(p),'kind':'created' if str(p) not in baseline else 'modified','purpose':purposes[p.name],'sha256':sha(p),'bytes':p.stat().st_size})
for p in sorted(out.rglob('*')):
 if not p.is_file() or p.name=='FINAL_ARTIFACT_INVENTORY_RESULT.json':continue
 if p.suffix=='.png':purpose='Native viewport screenshot; attempt-specific retained capture'
 elif 'browser-checks' in p.name:purpose='Executed native assertions and authority readbacks for this attempt'
 elif 'browser-measurements' in p.name:purpose='Native viewport overflow, focus and target measurements'
 elif 'export' in p.name:purpose='Actual downloaded V14 authority for exact round-trip comparison'
 elif p.suffix=='.log':purpose='Distinct execution log; failure/pass interpretation in VALIDATION_HISTORY_RESULT.md'
 elif 'driver' in p.name:purpose='Disposable browser workflow driver; attempt directories refuse overwrite'
 elif 'seed' in p.name:purpose='Canonical supporting-state fixture/build configuration'
 elif 'baseline' in p.name:purpose='Pre-edit dirty-tree baseline preservation'
 elif p.suffix=='.patch':purpose='Continuation-only diff against exact dirty-tree baseline'
 elif '.tar' in p.name:purpose='Locally retained source archive'
 elif 'freeze' in p.name or 'verification' in p.name or 'hashes' in p.name:purpose='Identity, preservation or source/build verification'
 elif p.suffix=='.md':purpose='Task evidence ledger, capability matrix, union audit or validation history'
 elif p.suffix=='.py':purpose='Reproducible final artifact inventory generator; excludes its output self-hash'
 else:purpose='Attempt-specific native state/authority or validation evidence'
 entries.append({'path':str(p),'kind':'created','purpose':purpose,'sha256':sha(p),'bytes':p.stat().st_size})
for name,purpose in [('TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_CONTINUATION_4.md','Exact separately saved authorized input'),('TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_CONTINUATION_4_RESULT.md','Fourth continuation determination and evidence summary')]:
 p=out.parent.parent/name;entries.append({'path':str(p),'kind':'created','purpose':purpose,'sha256':sha(p),'bytes':p.stat().st_size})
(out/'FINAL_ARTIFACT_INVENTORY_RESULT.json').write_text(json.dumps({'scope':'Every task-created evidence file plus changed/new application and test files and separately saved input/result. Self excluded. Generated dist identified separately in source/build freeze; node_modules untouched.','entries':entries},indent=2))
print(len(entries),'artifacts indexed')
