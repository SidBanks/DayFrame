import { cloneExecutionRecord } from "../core/execution/executionRecord.js";
import { createActiveV2, validateActiveV2, type DayFrameActiveV2 } from "./activeV2.js";
import { createDayFrameProfilesStorageV2, validateDayFrameProfilesStorageV2,
  type DayFrameProfilesStorageV2 } from "./dayFrameProfiles.js";
import { buildPlanDecisionRuntimeTarget, type PlanDecisionEnvelopeV1,
  type PlanDecisionRuntimeSnapshot } from "./planDecisionSurface.js";
import { buildExecutionHistoryRuntimeTarget, createExecutionHistoryEnvelope,
  type ExecutionHistoryRuntimeSnapshot, type QuarantinedExecutionHistoryComponent } from
  "./executionHistorySurface.js";
import { createPhysicalExecutionRecord, EXECUTION_HISTORY_METADATA_KEY,
  type ExecutionHistoryMetadata, type PhysicalExecutionRecord } from
  "./executionHistoryIndexedDb.js";
import { buildHistoricalPlanRuntimeTarget, type HistoricalPlanRuntimeSnapshot,
  type PhysicalHistoricalPlanBatchRecord, type PhysicalHistoricalPlanDayRecord } from
  "./historicalPlanSurface.js";
import type { ActiveLocalIngressStatus, DayFrameState, ProfileIngressStatus,
  StoreDesiredDurableCondition, SurfaceDurabilityStatus } from "./types.js";

export type ActiveRestoreRuntimeTarget = {
  activeState: DayFrameState; activeLocalIngressStatus: ActiveLocalIngressStatus;
  protectedActiveSource?: string; protectedActiveSourceKey?: string;
  durability: SurfaceDurabilityStatus; desired: StoreDesiredDurableCondition["activeState"];
};
export type ProfilesRestoreRuntimeTarget = {
  profiles: DayFrameState["savedProfiles"]; profileIngressStatus: ProfileIngressStatus;
  quarantinedProfiles: unknown[]; protectedProfileSource?: string; protectedProfileSourceKey?: string;
  durability: SurfaceDurabilityStatus; desired: StoreDesiredDurableCondition["profiles"];
};
export type ExecutionHistoryDurableRestorePayload = {
  records: PhysicalExecutionRecord[]; quarantine: QuarantinedExecutionHistoryComponent[];
  metadata: ExecutionHistoryMetadata[]; antiResurrection: "1";
};
export type HistoricalPlanDurableRestorePayload = {
  batches: PhysicalHistoricalPlanBatchRecord[]; days: PhysicalHistoricalPlanDayRecord[];
};
export type RestoreDurablePayloadMap = { active: DayFrameActiveV2;
  profiles: DayFrameProfilesStorageV2; planDecisions: PlanDecisionEnvelopeV1;
  executionHistory: ExecutionHistoryDurableRestorePayload;
  historicalPlan: HistoricalPlanDurableRestorePayload };
export type RestoreRuntimeTargetMap = { active: ActiveRestoreRuntimeTarget;
  profiles: ProfilesRestoreRuntimeTarget; planDecisions: PlanDecisionRuntimeSnapshot;
  executionHistory: ExecutionHistoryRuntimeSnapshot; historicalPlan: HistoricalPlanRuntimeSnapshot };

export function translateActiveRestorePayload(value: unknown) {
  try { const durable = validateActiveV2(value); const activeState: DayFrameState = {
      ...structuredClone(durable.data), savedProfiles: [], preview: null };
    const target: ActiveRestoreRuntimeTarget = { activeState,
      activeLocalIngressStatus: { status: "accepted", advisories: [] },
      durability: "durable", desired: "snapshot" };
    return { status: "valid" as const, durable: createActiveV2(structuredClone(durable.data)), target };
  } catch { return { status: "invalid" as const, reason: "invalidActive" }; }
}

export function translateProfilesRestorePayload(value: unknown) {
  try { const durable = validateDayFrameProfilesStorageV2(value);
    const target: ProfilesRestoreRuntimeTarget = { profiles: structuredClone(durable.profiles),
      quarantinedProfiles: structuredClone(durable.quarantinedProfiles),
      profileIngressStatus: { status: "accepted",
        quarantinedEntryCount: durable.quarantinedProfiles.length },
      durability: "durable", desired: "snapshot" };
    return { status: "valid" as const,
      durable: createDayFrameProfilesStorageV2(durable.profiles, durable.quarantinedProfiles), target };
  } catch { return { status: "invalid" as const, reason: "invalidProfiles" }; }
}

export function translatePlanDecisionRestorePayload(value: unknown) {
  const checked = buildPlanDecisionRuntimeTarget(value);
  return checked.status === "valid" ? { status: "valid" as const,
    durable: structuredClone(checked.envelope), target: structuredClone(checked.target) }
    : checked;
}

export function translateExecutionHistoryRestorePayload(value: unknown) {
  if (!record(value) || !exact(value, ["records", "quarantine", "metadata", "antiResurrection"]) ||
      !Array.isArray(value.records) || !Array.isArray(value.quarantine) ||
      !Array.isArray(value.metadata) || value.antiResurrection !== "1")
    return { status: "invalid" as const, reason: "invalidExecutionHistoryPhysicalAuthority" };
  const records: unknown[] = [];
  for (const wrapper of value.records) {
    if (!record(wrapper) || !exact(wrapper, ["recordId", "subjectId", "recordedAt",
      "plannedReferenceKey", "recordVersion", "record"]) || !record(wrapper.record))
      return { status: "invalid" as const, reason: "invalidExecutionHistoryRecord" };
    const expected = createPhysicalExecutionRecord(wrapper.record as never);
    if (JSON.stringify(expected) !== JSON.stringify(wrapper))
      return { status: "invalid" as const, reason: "invalidExecutionHistoryRecord" };
    records.push(cloneExecutionRecord(wrapper.record as never));
  }
  const envelope = createExecutionHistoryEnvelope(records as never[], value.quarantine as never[]);
  const translated = buildExecutionHistoryRuntimeTarget(envelope);
  if (translated.status === "invalid") return translated;
  const translatedEnvelope = createExecutionHistoryEnvelope(translated.target.records,
    translated.target.quarantine);
  if (JSON.stringify(translatedEnvelope) !== JSON.stringify(envelope))
    return { status: "invalid" as const, reason: "invalidExecutionHistoryAuthority" };
  if (value.metadata.length !== 1 || !validExecutionMetadata(value.metadata[0],
    envelope.records.length, envelope.quarantinedComponents.length))
    return { status: "invalid" as const, reason: "invalidExecutionHistoryMetadata" };
  return { status: "valid" as const, durable: structuredClone(value) as ExecutionHistoryDurableRestorePayload,
    target: translated.target };
}

export function translateHistoricalPlanRestorePayload(value: unknown) {
  const translated = buildHistoricalPlanRuntimeTarget(value);
  return translated.status === "valid" ? { status: "valid" as const,
    durable: structuredClone(value) as HistoricalPlanDurableRestorePayload,
    target: structuredClone(translated.target) } : translated;
}

export const restoreTranslators = {
  active: translateActiveRestorePayload, profiles: translateProfilesRestorePayload,
  planDecisions: translatePlanDecisionRestorePayload,
  executionHistory: translateExecutionHistoryRestorePayload,
  historicalPlan: translateHistoricalPlanRestorePayload,
};

function validExecutionMetadata(value: unknown, records: number, quarantine: number):
  value is ExecutionHistoryMetadata {
  return record(value) && exact(value, ["surface", "version", "authorityState",
    "legacyFingerprint", "recordCount", "quarantineCount"]) &&
    value.surface === EXECUTION_HISTORY_METADATA_KEY && value.version === 1 &&
    value.authorityState === "established" && typeof value.legacyFingerprint === "string" &&
    value.recordCount === records && value.quarantineCount === quarantine;
}
function exact(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).length === keys.length && keys.every((key) => key in value);
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
