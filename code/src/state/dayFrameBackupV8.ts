import {
  emptyGoalPlanningAuthority,
  validateGoalPlanningAuthority,
  type GoalPlanningAuthorityV1,
} from "../core/planning/goalDemand.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import { validateDayFrameBackupV7, type DayFrameBackupV7Data } from "./dayFrameBackupV7.js";

export type DayFrameBackupV8Data = DayFrameBackupV7Data & {
  goalPlanning: GoalPlanningAuthorityV1;
};
export type DayFrameBackupV8 = {
  app: "DayFrame";
  surface: "backup";
  version: 8;
  exportedAt: string;
  data: DayFrameBackupV8Data;
};
export function createDayFrameBackupV8(data: DayFrameBackupV8Data, exportedAt: string) {
  return validateDayFrameBackupV8({
    app: "DayFrame",
    surface: "backup",
    version: 8,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV8(value: unknown): DayFrameBackupV8 {
  if (
    !record(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "backup" ||
    value.version !== 8 ||
    typeof value.exportedAt !== "string" ||
    Object.keys(value).sort().join() !== "app,data,exportedAt,surface,version" ||
    !record(value.data) ||
    Object.keys(value.data).sort().join() !==
      "active,executionHistory,goalPlanning,goalStructure,goals,historicalPlan,measurementDefinitions,planDecisions,profiles,progressObservations"
  )
    throw new RangeError("Backup V8 envelope is invalid.");
  const legacy = validateDayFrameBackupV7({
    ...value,
    version: 7,
    data: {
      active: value.data.active,
      profiles: value.data.profiles,
      planDecisions: value.data.planDecisions,
      executionHistory: value.data.executionHistory,
      historicalPlan: value.data.historicalPlan,
      goals: value.data.goals,
      measurementDefinitions: value.data.measurementDefinitions,
      progressObservations: value.data.progressObservations,
      goalStructure: value.data.goalStructure,
    },
  });
  const planning = validateGoalPlanningAuthority(value.data.goalPlanning, legacy.data.goals.goals);
  if (planning.status === "invalid")
    throw new RangeError("Backup V8 Goal planning authority is invalid.");
  return {
    app: "DayFrame",
    surface: "backup",
    version: 8,
    exportedAt: legacy.exportedAt,
    data: { ...legacy.data, goalPlanning: planning.authority },
  };
}
export function translateBackupV7ToV8(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV7(value);
  return createDayFrameBackupV8(
    { ...backup.data, goalPlanning: emptyGoalPlanningAuthority() },
    exportedAt ?? backup.exportedAt,
  );
}
export function backupV8SemanticFingerprint(value: DayFrameBackupV8 | DayFrameBackupV8Data) {
  return semanticFingerprint(
    "data" in value
      ? validateDayFrameBackupV8(value).data
      : createDayFrameBackupV8(value, "1970-01-01T00:00:00.000Z").data,
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
