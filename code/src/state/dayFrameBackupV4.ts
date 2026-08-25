import {
  validateGoalAuthority,
  goalFingerprint,
  type GoalAuthorityV1,
} from "../core/goals/goal.js";
import { validateDayFrameBackupV3, type DayFrameBackupV3Data } from "./dayFrameBackupV3.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
export const DAYFRAME_BACKUP_V4_VERSION = 4 as const;
export type DayFrameBackupV4Data = DayFrameBackupV3Data & { goals: GoalAuthorityV1 };
export type DayFrameBackupV4 = {
  app: "DayFrame";
  surface: "backup";
  version: 4;
  exportedAt: string;
  data: DayFrameBackupV4Data;
};
export class DayFrameBackupV4ValidationError extends RangeError {
  constructor(
    public readonly category:
      | "envelopeValidationFailure"
      | "goalValidationFailure"
      | "legacyAuthorityValidationFailure",
    message: string,
  ) {
    super(message);
    this.name = "DayFrameBackupV4ValidationError";
  }
}
export function createDayFrameBackupV4(data: DayFrameBackupV4Data, exportedAt: string) {
  return validateDayFrameBackupV4({
    app: "DayFrame",
    surface: "backup",
    version: 4,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV4(value: unknown): DayFrameBackupV4 {
  if (
    !record(value) ||
    Object.keys(value).sort().join() !== "app,data,exportedAt,surface,version" ||
    value.app !== "DayFrame" ||
    value.surface !== "backup" ||
    value.version !== 4 ||
    typeof value.exportedAt !== "string"
  )
    throw new DayFrameBackupV4ValidationError(
      "envelopeValidationFailure",
      "Backup V4 envelope is invalid.",
    );
  if (
    !record(value.data) ||
    Object.keys(value.data).sort().join() !==
      "active,executionHistory,goals,historicalPlan,planDecisions,profiles"
  )
    throw new DayFrameBackupV4ValidationError(
      "envelopeValidationFailure",
      "Backup V4 data is invalid.",
    );
  let legacy;
  try {
    legacy = validateDayFrameBackupV3({
      ...value,
      version: 3,
      data: {
        active: value.data.active,
        profiles: value.data.profiles,
        planDecisions: value.data.planDecisions,
        executionHistory: value.data.executionHistory,
        historicalPlan: value.data.historicalPlan,
      },
    });
  } catch {
    throw new DayFrameBackupV4ValidationError(
      "legacyAuthorityValidationFailure",
      "Backup V4 legacy authorities are invalid.",
    );
  }
  const goals = validateGoalAuthority(value.data.goals);
  if (goals.status === "invalid")
    throw new DayFrameBackupV4ValidationError(
      "goalValidationFailure",
      "Backup V4 Goal authority is invalid.",
    );
  return {
    app: "DayFrame",
    surface: "backup",
    version: 4,
    exportedAt: legacy.exportedAt,
    data: { ...legacy.data, goals: goals.authority },
  };
}
export function backupV4SemanticFingerprint(value: DayFrameBackupV4 | DayFrameBackupV4Data) {
  const data =
    "data" in value
      ? validateDayFrameBackupV4(value).data
      : createDayFrameBackupV4(value, "1970-01-01T00:00:00.000Z").data;
  goalFingerprint(data.goals);
  return semanticFingerprint(data);
}
export function translateBackupV3ToV4(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV3(value);
  return createDayFrameBackupV4(
    { ...backup.data, goals: { version: 1, goals: [] } },
    exportedAt ?? backup.exportedAt,
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
