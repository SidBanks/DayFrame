import {
  emptyGoalStructureAuthority,
  validateGoalStructureAuthority,
  type GoalStructureAuthorityV1,
} from "../core/planning/goalStructure.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import { validateDayFrameBackupV6, type DayFrameBackupV6Data } from "./dayFrameBackupV6.js";

export type DayFrameBackupV7Data = DayFrameBackupV6Data & {
  goalStructure: GoalStructureAuthorityV1;
};
export type DayFrameBackupV7 = {
  app: "DayFrame";
  surface: "backup";
  version: 7;
  exportedAt: string;
  data: DayFrameBackupV7Data;
};
export function createDayFrameBackupV7(data: DayFrameBackupV7Data, exportedAt: string) {
  return validateDayFrameBackupV7({
    app: "DayFrame",
    surface: "backup",
    version: 7,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV7(value: unknown): DayFrameBackupV7 {
  if (
    !record(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "backup" ||
    value.version !== 7 ||
    typeof value.exportedAt !== "string" ||
    Object.keys(value).sort().join() !== "app,data,exportedAt,surface,version" ||
    !record(value.data) ||
    Object.keys(value.data).sort().join() !==
      "active,executionHistory,goalStructure,goals,historicalPlan,measurementDefinitions,planDecisions,profiles,progressObservations"
  )
    throw new RangeError("Backup V7 envelope is invalid.");
  const legacy = validateDayFrameBackupV6({
    ...value,
    version: 6,
    data: {
      active: value.data.active,
      profiles: value.data.profiles,
      planDecisions: value.data.planDecisions,
      executionHistory: value.data.executionHistory,
      historicalPlan: value.data.historicalPlan,
      goals: value.data.goals,
      measurementDefinitions: value.data.measurementDefinitions,
      progressObservations: value.data.progressObservations,
    },
  });
  const structure = validateGoalStructureAuthority(
    value.data.goalStructure,
    legacy.data.goals.goals,
  );
  if (structure.status === "invalid")
    throw new RangeError("Backup V7 Goal Structure authority is invalid.");
  return {
    app: "DayFrame",
    surface: "backup",
    version: 7,
    exportedAt: legacy.exportedAt,
    data: { ...legacy.data, goalStructure: structure.authority },
  };
}
export function translateBackupV6ToV7(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV6(value);
  return createDayFrameBackupV7(
    { ...backup.data, goalStructure: emptyGoalStructureAuthority() },
    exportedAt ?? backup.exportedAt,
  );
}
export function backupV7SemanticFingerprint(value: DayFrameBackupV7 | DayFrameBackupV7Data) {
  return semanticFingerprint(
    "data" in value
      ? validateDayFrameBackupV7(value).data
      : createDayFrameBackupV7(value, "1970-01-01T00:00:00.000Z").data,
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
