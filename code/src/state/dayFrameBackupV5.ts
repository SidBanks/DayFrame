import { validateDayFrameBackupV4, type DayFrameBackupV4Data } from "./dayFrameBackupV4.js";
import {
  validateMeasurementDefinitionAuthority,
  type GoalMeasurementDefinitionAuthorityV1,
} from "../core/measurement/measurementDefinition.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
export type DayFrameBackupV5Data = DayFrameBackupV4Data & {
  measurementDefinitions: GoalMeasurementDefinitionAuthorityV1;
};
export type DayFrameBackupV5 = {
  app: "DayFrame";
  surface: "backup";
  version: 5;
  exportedAt: string;
  data: DayFrameBackupV5Data;
};
export function createDayFrameBackupV5(data: DayFrameBackupV5Data, exportedAt: string) {
  return validateDayFrameBackupV5({
    app: "DayFrame",
    surface: "backup",
    version: 5,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV5(value: unknown): DayFrameBackupV5 {
  if (
    !record(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "backup" ||
    value.version !== 5 ||
    typeof value.exportedAt !== "string" ||
    Object.keys(value).sort().join() !== "app,data,exportedAt,surface,version" ||
    !record(value.data) ||
    Object.keys(value.data).sort().join() !==
      "active,executionHistory,goals,historicalPlan,measurementDefinitions,planDecisions,profiles"
  )
    throw new RangeError("Backup V5 envelope is invalid.");
  const legacy = validateDayFrameBackupV4({
    ...value,
    version: 4,
    data: {
      active: value.data.active,
      profiles: value.data.profiles,
      planDecisions: value.data.planDecisions,
      executionHistory: value.data.executionHistory,
      historicalPlan: value.data.historicalPlan,
      goals: value.data.goals,
    },
  });
  const goals = new Set(legacy.data.goals.goals.map((goal) => goal.id));
  const definitions = validateMeasurementDefinitionAuthority(
    value.data.measurementDefinitions,
    (id) => goals.has(id),
  );
  if (definitions.status === "invalid")
    throw new RangeError("Backup V5 Measurement Definition authority is invalid.");
  return {
    app: "DayFrame",
    surface: "backup",
    version: 5,
    exportedAt: legacy.exportedAt,
    data: { ...legacy.data, measurementDefinitions: definitions.authority },
  };
}
export function backupV5SemanticFingerprint(value: DayFrameBackupV5 | DayFrameBackupV5Data) {
  return semanticFingerprint(
    "data" in value
      ? validateDayFrameBackupV5(value).data
      : createDayFrameBackupV5(value, "1970-01-01T00:00:00.000Z").data,
  );
}
export function translateBackupV4ToV5(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV4(value);
  return createDayFrameBackupV5(
    { ...backup.data, measurementDefinitions: { version: 1, definitions: [] } },
    exportedAt ?? backup.exportedAt,
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
