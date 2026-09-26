import { goalInspectionCanonicalFixture } from "./goalInspectionCanonicalFixture.js";
import { MANUAL_QUANTITY_TARGET_POLICY_V1 } from "../../core/measurement/measurementDefinition.js";
import { requirement } from "../../core/sleep/sleepTestFixtures.js";
import { buildExecutionReportInput } from "../executionReportingWorkflow.js";

/** Canonical command source; shared by native-browser QA and permanent restore tests. */
export async function v14RestoreFixture(title = "Source A restored Goal") {
  const { store, goal, acceptedIds } = await goalInspectionCanonicalFixture();
  const template = store.getState().blockTemplates.find((t) => t.id === "routine")!;
  const updated = await store.updateGoal(goal.id, goal.revision, {
    title,
    description: "V14 identity and history fixture",
    targetDate: "2026-12-31",
  });
  if (updated.status !== "accepted") throw Error(JSON.stringify(updated));
  const linked = await store.linkCommitment(goal.id, updated.goal.revision, {
    sourceKind: "blockTemplate",
    id: template.id,
    incarnationId: template.incarnationId!,
  });
  if (linked.status !== "accepted") throw Error(JSON.stringify(linked));
  const request = store.exportGoalPlanningAuthority().demands[0]!;
  const revised = await store.reviseDemand(request.id, request.revision, {
    session: { mode: "splittable", minimumMinutes: 15, preferredMinutes: 45 },
  });
  if (revised.status !== "accepted") throw Error(JSON.stringify(revised));
  const definition = await store.createMeasurementDefinition(
    goal.id,
    MANUAL_QUANTITY_TARGET_POLICY_V1,
    { targetValue: "100", unitId: "words" },
  );
  if (definition.status !== "accepted") throw Error(JSON.stringify(definition));
  const progress = await store.createProgressObservation({
    goalId: goal.id,
    observedAt: definition.definition.effectiveFrom,
    value: "17",
    expectedDefinitionRevision: definition.definition.revision,
  });
  if (progress.status !== "accepted") throw Error(JSON.stringify(progress));
  const child = await store.createGoal({ title: "Source A child" });
  if (child.status !== "accepted") throw Error(JSON.stringify(child));
  const relationship = await store.createRelationship({
    kind: "contains",
    sourceGoalId: goal.id,
    target: { kind: "goal", goalId: child.goal.id },
    semantics: { kind: "containment", requiredness: "required" },
  });
  if (relationship.status !== "accepted") throw Error(JSON.stringify(relationship));
  const milestone = await store.createMilestone({
    ownerGoalId: goal.id,
    title: "First practice exam",
  });
  if (milestone.status !== "accepted") throw Error(JSON.stringify(milestone));
  const {
    enabled,
    effectiveFrom,
    weekdays,
    durationMinutes,
    window,
    bufferBeforeMinutes,
    bufferAfterMinutes,
  } = requirement();
  const sleep = store.authorSleepRequirement({
    id: "restore-sleep",
    expectedRevision: null,
    intent: {
      enabled,
      effectiveFrom,
      weekdays,
      durationMinutes,
      window,
      bufferBeforeMinutes,
      bufferAfterMinutes,
    },
    recordedAt: new Date().toISOString(),
  });
  if (sleep.status !== "authored") throw Error(JSON.stringify(sleep));
  const day = await store.querySelectedDayEvidence({
    ownerDay: "2026-09-04",
    asOf: new Date().toISOString(),
  });
  if (day.status !== "projected" || day.published.status !== "available")
    throw Error("Day evidence");
  const item = day.published.value
    .flatMap((p) => p.items)
    .find((i) => i.snapshot.version === 3 && i.snapshot.scheduleRole === "productiveGoalWork");
  const report = item?.reporting;
  if (report?.status !== "targetAvailable" || !("reference" in report.target))
    throw Error("Report target");
  const input = buildExecutionReportInput(report.target, {
    outcome: "completed",
    occurredAtLocal: "2026-09-04T08:10:00Z",
    durationMinutes: "47",
    note: "Independent Actual, not Progress",
  });
  if (input.status !== "valid") throw Error(input.message);
  const actual = store.recordExecution(input.input);
  if (actual.status !== "accepted") throw Error(JSON.stringify(actual));
  for (let n = 0; n < 100 && store.getExecutionHistoryDurabilityStatus() !== "durable"; n++)
    await new Promise((r) => setTimeout(r, 10));
  store.saveProfile({ name: "Source A saved setup", savedAt: new Date().toISOString() });
  const exported = await store.exportBackupV14(new Date().toISOString());
  if (exported.status !== "exported") throw Error(JSON.stringify(exported));
  return { store, goalId: goal.id, requestId: request.id, acceptedIds, backup: exported.backup };
}
