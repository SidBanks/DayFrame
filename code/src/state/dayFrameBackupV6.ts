import { validateDayFrameBackupV5, type DayFrameBackupV5Data } from "./dayFrameBackupV5.js";
import {
  validateProgressObservationAuthority,
  type GoalProgressObservationAuthorityV1,
} from "../core/progressObservation/progressObservation.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
export type DayFrameBackupV6Data = DayFrameBackupV5Data & {
  progressObservations: GoalProgressObservationAuthorityV1;
};
export type DayFrameBackupV6 = {
  app: "DayFrame";
  surface: "backup";
  version: 6;
  exportedAt: string;
  data: DayFrameBackupV6Data;
};
export function createDayFrameBackupV6(data: DayFrameBackupV6Data, exportedAt: string) {
  return validateDayFrameBackupV6({
    app: "DayFrame",
    surface: "backup",
    version: 6,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV6(value: unknown): DayFrameBackupV6 {
  if (
    !record(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "backup" ||
    value.version !== 6 ||
    typeof value.exportedAt !== "string" ||
    Object.keys(value).sort().join() !== "app,data,exportedAt,surface,version" ||
    !record(value.data) ||
    Object.keys(value.data).sort().join() !==
      "active,executionHistory,goals,historicalPlan,measurementDefinitions,planDecisions,profiles,progressObservations"
  )
    throw new RangeError("Backup V6 envelope is invalid.");
  const legacy = validateDayFrameBackupV5({
    ...value,
    version: 5,
    data: {
      active: value.data.active,
      profiles: value.data.profiles,
      planDecisions: value.data.planDecisions,
      executionHistory: value.data.executionHistory,
      historicalPlan: value.data.historicalPlan,
      goals: value.data.goals,
      measurementDefinitions: value.data.measurementDefinitions,
    },
  });
  const goals = new Set(legacy.data.goals.goals.map((goal) => goal.id));
  const definitions = new Map(
    legacy.data.measurementDefinitions.definitions.map((item) => [
      `${item.id}|${item.revision}`,
      item,
    ]),
  );
  const observations = validateProgressObservationAuthority(value.data.progressObservations, {
    goalExists: (id) => goals.has(id),
    getDefinition: (id, revision) => definitions.get(`${id}|${revision}`),
  });
  if (observations.status === "invalid")
    throw new RangeError("Backup V6 Progress Observation authority is invalid.");
  return {
    app: "DayFrame",
    surface: "backup",
    version: 6,
    exportedAt: legacy.exportedAt,
    data: { ...legacy.data, progressObservations: observations.authority },
  };
}
export function backupV6SemanticFingerprint(value: DayFrameBackupV6 | DayFrameBackupV6Data) {
  return semanticFingerprint(
    "data" in value
      ? validateDayFrameBackupV6(value).data
      : createDayFrameBackupV6(value, "1970-01-01T00:00:00.000Z").data,
  );
}
export function translateBackupV5ToV6(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV5(value);
  return createDayFrameBackupV6(
    { ...backup.data, progressObservations: { version: 1, observations: [] } },
    exportedAt ?? backup.exportedAt,
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
