import { validateActiveV2, cloneActiveSetup, type DayFrameActiveV2 } from "./activeV2.js";
import { validateDayFrameProfilesStorageV2, createDayFrameProfilesStorageV2 } from
  "./dayFrameProfiles.js";
import { buildPlanDecisionRuntimeTarget, type QuarantinedPlanDecision } from
  "./planDecisionSurface.js";
import { validateExecutionHistoryEnvelope, type ExecutionHistoryEnvelopeV1 } from
  "./executionHistorySurface.js";
import { clonePlanPublicationBatch, type PlanPublicationBatchV1 } from
  "../core/historicalPlan/historicalPlan.js";
import { validatePlanPublicationBatch } from
  "../core/historicalPlan/historicalPlanValidation.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import type { ActiveDayFrameAuthoredSetup, DayFrameSavedProfile } from "./types.js";
import type { PlanDecisionV1 } from "../core/decisions/planDecision.js";

export const DAYFRAME_BACKUP_V3_VERSION = 3 as const;

export type ActiveV2BackupData = { surfaceVersion: 2; data: ActiveDayFrameAuthoredSetup };
export type ProfilesV2BackupData = { surfaceVersion: 2; profiles: DayFrameSavedProfile[];
  quarantinedProfiles: unknown[] };
export type PlanDecisionV1BackupData = { surfaceVersion: 1; decisions: PlanDecisionV1[];
  quarantinedDecisions: QuarantinedPlanDecision[] };
export type ExecutionHistoryV1BackupData = ExecutionHistoryEnvelopeV1;
export type HistoricalPlanV1BackupData = { surfaceVersion: 1; batches: PlanPublicationBatchV1[] };
export type DayFrameBackupV3Data = { active: ActiveV2BackupData; profiles: ProfilesV2BackupData;
  planDecisions: PlanDecisionV1BackupData; executionHistory: ExecutionHistoryV1BackupData;
  historicalPlan: HistoricalPlanV1BackupData };
export type DayFrameBackupV3 = { app: "DayFrame"; surface: "backup";
  version: typeof DAYFRAME_BACKUP_V3_VERSION; exportedAt: string; data: DayFrameBackupV3Data };

export type BackupV3ValidationCategory = "envelopeValidationFailure" | "activeValidationFailure" |
  "profilesValidationFailure" | "planDecisionValidationFailure" |
  "executionHistoryValidationFailure" | "historicalPlanValidationFailure";
export class DayFrameBackupV3ValidationError extends RangeError {
  constructor(public readonly category: BackupV3ValidationCategory, message: string) {
    super(message); this.name = "DayFrameBackupV3ValidationError";
  }
}

export function createDayFrameBackupV3(data: DayFrameBackupV3Data,
  exportedAt: string): DayFrameBackupV3 {
  return validateDayFrameBackupV3({ app: "DayFrame", surface: "backup", version: 3,
    exportedAt, data });
}

export function validateDayFrameBackupV3(value: unknown): DayFrameBackupV3 {
  if (!record(value) || !exact(value, ["app", "surface", "version", "exportedAt", "data"]) ||
      value.app !== "DayFrame" || value.surface !== "backup" || value.version !== 3 ||
      !canonicalTimestamp(value.exportedAt) || !record(value.data) ||
      !exact(value.data, ["active", "profiles", "planDecisions", "executionHistory",
        "historicalPlan"])) throw invalid("envelopeValidationFailure", "Backup V3 envelope is invalid.");
  const data = value.data;
  let active: ActiveV2BackupData;
  try { if (!record(data.active) || !exact(data.active, ["surfaceVersion", "data"]) ||
      data.active.surfaceVersion !== 2) throw new Error();
    const checked = validateActiveV2({ app: "DayFrame", surface: "active", version: 2,
      data: data.active.data }); active = { surfaceVersion: 2, data: checked.data }; }
  catch { throw invalid("activeValidationFailure", "Backup V3 Active authority is invalid."); }
  let profiles: ProfilesV2BackupData;
  try { if (!record(data.profiles) || !exact(data.profiles,
      ["surfaceVersion", "profiles", "quarantinedProfiles"]) ||
      data.profiles.surfaceVersion !== 2) throw new Error();
    const checked = validateDayFrameProfilesStorageV2({ app: "DayFrame", surface: "profiles",
      version: 2, profiles: data.profiles.profiles,
      quarantinedProfiles: data.profiles.quarantinedProfiles });
    profiles = { surfaceVersion: 2, profiles: checked.profiles.sort((a, b) =>
      a.id.localeCompare(b.id)), quarantinedProfiles: structuredClone(checked.quarantinedProfiles) }; }
  catch { throw invalid("profilesValidationFailure", "Backup V3 Profiles authority is invalid."); }
  const planDecisions = validatePlanDecisionData(data.planDecisions);
  const executionHistory = validateExecutionData(data.executionHistory);
  const historicalPlan = validateHistoricalData(data.historicalPlan);
  return { app: "DayFrame", surface: "backup", version: 3, exportedAt: value.exportedAt,
    data: { active: { surfaceVersion: 2, data: cloneActiveSetup(active.data) }, profiles,
      planDecisions, executionHistory, historicalPlan } };
}

export function backupV3SemanticFingerprint(value: DayFrameBackupV3 | DayFrameBackupV3Data): string {
  const data = "data" in value ? validateDayFrameBackupV3(value).data :
    validateDayFrameBackupV3({ app: "DayFrame", surface: "backup", version: 3,
      exportedAt: "1970-01-01T00:00:00.000Z", data: value }).data;
  return semanticFingerprint(data);
}

export function activeV2BackupData(value: DayFrameActiveV2): ActiveV2BackupData {
  const checked = validateActiveV2(value); return { surfaceVersion: 2, data: checked.data };
}
export function profilesV2BackupData(profiles: DayFrameSavedProfile[], quarantine: unknown[]):
  ProfilesV2BackupData { const checked = createDayFrameProfilesStorageV2(profiles, quarantine);
  return { surfaceVersion: 2, profiles: checked.profiles.sort((a, b) => a.id.localeCompare(b.id)),
    quarantinedProfiles: structuredClone(checked.quarantinedProfiles) }; }

function validatePlanDecisionData(value: unknown): PlanDecisionV1BackupData {
  try { if (!record(value) || !exact(value,
      ["surfaceVersion", "decisions", "quarantinedDecisions"]) || value.surfaceVersion !== 1 ||
      !Array.isArray(value.decisions) || !Array.isArray(value.quarantinedDecisions)) throw new Error();
    const decisionsCheck = buildPlanDecisionRuntimeTarget({ app: "DayFrame",
      surface: "planDecisions", version: 1, decisions: value.decisions });
    if (decisionsCheck.status !== "valid" || decisionsCheck.target.quarantined.length) throw new Error();
    const quarantine = value.quarantinedDecisions.map((entry) => {
      if (!record(entry) || !exact(entry, ["quarantineId", "reason", "raw"]) ||
          typeof entry.quarantineId !== "string" || typeof entry.reason !== "string") throw new Error();
      return structuredClone(entry) as QuarantinedPlanDecision;
    }).sort((a, b) => a.quarantineId.localeCompare(b.quarantineId));
    if (new Set(quarantine.map((entry) => entry.quarantineId)).size !== quarantine.length)
      throw new Error();
    return { surfaceVersion: 1, decisions: decisionsCheck.target.decisions,
      quarantinedDecisions: quarantine };
  } catch { throw invalid("planDecisionValidationFailure",
    "Backup V3 PlanDecision authority is invalid."); }
}
function validateExecutionData(value: unknown): ExecutionHistoryV1BackupData {
  const checked = validateExecutionHistoryEnvelope(value);
  if (checked.status !== "valid" || !record(value) ||
      JSON.stringify(checked.envelope.records.map((entry) => entry.id)) !==
        JSON.stringify((value.records as unknown[]).map((entry) => record(entry) ? entry.id : undefined)) ||
      checked.envelope.quarantinedComponents.length !== (value.quarantinedComponents as unknown[]).length)
    throw invalid("executionHistoryValidationFailure",
      "Backup V3 ExecutionHistory authority is invalid.");
  return checked.envelope;
}
function validateHistoricalData(value: unknown): HistoricalPlanV1BackupData {
  try { if (!record(value) || !exact(value, ["surfaceVersion", "batches"]) ||
      value.surfaceVersion !== 1 || !Array.isArray(value.batches)) throw new Error();
    const batches: PlanPublicationBatchV1[] = []; const ids = new Set<string>();
    const dayTimes = new Set<string>();
    for (const raw of value.batches) { const checked = validatePlanPublicationBatch(raw);
      if (checked.status !== "valid" || ids.has(checked.batch.id)) throw new Error();
      ids.add(checked.batch.id);
      for (const day of checked.batch.days) { const key = `${checked.batch.publishedAt}|${day.userDayDate}`;
        if (dayTimes.has(key)) throw new Error(); dayTimes.add(key); }
      batches.push(checked.batch); }
    return { surfaceVersion: 1, batches: batches.sort((a, b) =>
      a.publishedAt.localeCompare(b.publishedAt) || a.id.localeCompare(b.id))
      .map(clonePlanPublicationBatch) };
  } catch { throw invalid("historicalPlanValidationFailure",
    "Backup V3 HistoricalPlan authority is invalid."); }
}
function invalid(category: BackupV3ValidationCategory, message: string) {
  return new DayFrameBackupV3ValidationError(category, message);
}
function canonicalTimestamp(value: unknown): value is string { return typeof value === "string" &&
  !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value; }
function exact(value: Record<string, unknown>, keys: string[]) { return Object.keys(value).length ===
  keys.length && keys.every((key) => key in value); }
function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" &&
  value !== null && !Array.isArray(value); }
