import { cloneExecutionRecord } from "../core/execution/executionRecord.js";
import { createActiveV2, validateActiveV2, type DayFrameActiveV2 } from "./activeV2.js";
import {
  createDayFrameProfilesStorageV2,
  validateDayFrameProfilesStorageV2,
  type DayFrameProfilesStorageV2,
} from "./dayFrameProfiles.js";
import {
  buildPlanDecisionRuntimeTarget,
  type PlanDecisionEnvelopeV1,
  type PlanDecisionRuntimeSnapshot,
} from "./planDecisionSurface.js";
import {
  buildExecutionHistoryRuntimeTarget,
  createExecutionHistoryEnvelope,
  type ExecutionHistoryRuntimeSnapshot,
  type QuarantinedExecutionHistoryComponent,
} from "./executionHistorySurface.js";
import {
  createPhysicalExecutionRecord,
  EXECUTION_HISTORY_METADATA_KEY,
  type ExecutionHistoryMetadata,
  type PhysicalExecutionRecord,
} from "./executionHistoryIndexedDb.js";
import {
  buildHistoricalPlanRuntimeTarget,
  type HistoricalPlanRuntimeSnapshot,
  type PhysicalHistoricalPlanBatchRecord,
  type PhysicalHistoricalPlanDayRecord,
} from "./historicalPlanSurface.js";
import type {
  ActiveLocalIngressStatus,
  DayFrameState,
  ProfileIngressStatus,
  StoreDesiredDurableCondition,
  SurfaceDurabilityStatus,
} from "./types.js";
import { validateGoalAuthority, type GoalAuthorityV1 } from "../core/goals/goal.js";
import type { GoalRuntimeSnapshot } from "./goalSurface.js";
import {
  validateMeasurementDefinitionAuthority,
  type GoalMeasurementDefinitionAuthorityV1,
} from "../core/measurement/measurementDefinition.js";
import type { MeasurementDefinitionSnapshot } from "./measurementDefinitionSurface.js";
import {
  validateProgressObservationAuthority,
  type GoalProgressObservationAuthorityV1,
} from "../core/progressObservation/progressObservation.js";
import type { ProgressObservationSnapshot } from "./progressObservationSurface.js";
import {
  validateGoalStructureAuthority,
  type GoalStructureAuthorityV1,
} from "../core/planning/goalStructure.js";
import type { GoalStructureRuntimeSnapshot } from "./goalStructureSurface.js";
import type { GoalPlanningAuthorityV1 } from "../core/planning/goalDemand.js";
import type { CompositionAuthorityV1 } from "../core/planning/commitmentComposition.js";

export type ActiveRestoreRuntimeTarget = {
  activeState: DayFrameState;
  activeLocalIngressStatus: ActiveLocalIngressStatus;
  protectedActiveSource?: string;
  protectedActiveSourceKey?: string;
  durability: SurfaceDurabilityStatus;
  desired: StoreDesiredDurableCondition["activeState"];
};
export type ProfilesRestoreRuntimeTarget = {
  profiles: DayFrameState["savedProfiles"];
  profileIngressStatus: ProfileIngressStatus;
  quarantinedProfiles: unknown[];
  protectedProfileSource?: string;
  protectedProfileSourceKey?: string;
  durability: SurfaceDurabilityStatus;
  desired: StoreDesiredDurableCondition["profiles"];
};
export type ExecutionHistoryDurableRestorePayload = {
  records: PhysicalExecutionRecord[];
  quarantine: QuarantinedExecutionHistoryComponent[];
  metadata: ExecutionHistoryMetadata[];
  antiResurrection: "1";
};
export type HistoricalPlanDurableRestorePayload = {
  batches: PhysicalHistoricalPlanBatchRecord[];
  days: PhysicalHistoricalPlanDayRecord[];
};
export type RestoreDurablePayloadMap = {
  active: DayFrameActiveV2;
  profiles: DayFrameProfilesStorageV2;
  planDecisions: PlanDecisionEnvelopeV1;
  executionHistory: ExecutionHistoryDurableRestorePayload;
  historicalPlan: HistoricalPlanDurableRestorePayload;
  goals: GoalAuthorityV1;
  measurementDefinitions: GoalMeasurementDefinitionAuthorityV1;
  progressObservations: GoalProgressObservationAuthorityV1;
  goalStructure: GoalStructureAuthorityV1;
  goalPlanning: GoalPlanningAuthorityV1;
  composition: CompositionAuthorityV1;
};
export type RestoreRuntimeTargetMap = {
  active: ActiveRestoreRuntimeTarget;
  profiles: ProfilesRestoreRuntimeTarget;
  planDecisions: PlanDecisionRuntimeSnapshot;
  executionHistory: ExecutionHistoryRuntimeSnapshot;
  historicalPlan: HistoricalPlanRuntimeSnapshot;
  goals: GoalRuntimeSnapshot;
  measurementDefinitions: MeasurementDefinitionSnapshot;
  progressObservations: ProgressObservationSnapshot;
  goalStructure: GoalStructureRuntimeSnapshot;
  goalPlanning: {
    authority: GoalPlanningAuthorityV1;
    desired: GoalPlanningAuthorityV1;
    ingress: { status: "accepted" };
    durability: "durable";
  };
  composition: {
    authority: CompositionAuthorityV1;
    desired: CompositionAuthorityV1;
    ingress: { status: "accepted" };
    durability: "durable";
  };
};

export function translateActiveRestorePayload(value: unknown) {
  try {
    const durable = validateActiveV2(value);
    const activeState: DayFrameState = {
      ...structuredClone(durable.data),
      savedProfiles: [],
      preview: null,
    };
    const target: ActiveRestoreRuntimeTarget = {
      activeState,
      activeLocalIngressStatus: { status: "accepted", advisories: [] },
      durability: "durable",
      desired: "snapshot",
    };
    return {
      status: "valid" as const,
      durable: createActiveV2(structuredClone(durable.data)),
      target,
    };
  } catch {
    return { status: "invalid" as const, reason: "invalidActive" };
  }
}

export function translateProfilesRestorePayload(value: unknown) {
  try {
    const durable = validateDayFrameProfilesStorageV2(value);
    const target: ProfilesRestoreRuntimeTarget = {
      profiles: structuredClone(durable.profiles),
      quarantinedProfiles: structuredClone(durable.quarantinedProfiles),
      profileIngressStatus: {
        status: "accepted",
        quarantinedEntryCount: durable.quarantinedProfiles.length,
      },
      durability: "durable",
      desired: "snapshot",
    };
    return {
      status: "valid" as const,
      durable: createDayFrameProfilesStorageV2(durable.profiles, durable.quarantinedProfiles),
      target,
    };
  } catch {
    return { status: "invalid" as const, reason: "invalidProfiles" };
  }
}

export function translatePlanDecisionRestorePayload(value: unknown) {
  const checked = buildPlanDecisionRuntimeTarget(value);
  return checked.status === "valid"
    ? {
        status: "valid" as const,
        durable: structuredClone(checked.envelope),
        target: structuredClone(checked.target),
      }
    : checked;
}

export function translateExecutionHistoryRestorePayload(value: unknown) {
  if (
    !record(value) ||
    !exact(value, ["records", "quarantine", "metadata", "antiResurrection"]) ||
    !Array.isArray(value.records) ||
    !Array.isArray(value.quarantine) ||
    !Array.isArray(value.metadata) ||
    value.antiResurrection !== "1"
  )
    return { status: "invalid" as const, reason: "invalidExecutionHistoryPhysicalAuthority" };
  const records: unknown[] = [];
  for (const wrapper of value.records) {
    if (
      !record(wrapper) ||
      !exact(wrapper, [
        "recordId",
        "subjectId",
        "recordedAt",
        "plannedReferenceKey",
        "recordVersion",
        "record",
      ]) ||
      !record(wrapper.record)
    )
      return { status: "invalid" as const, reason: "invalidExecutionHistoryRecord" };
    const expected = createPhysicalExecutionRecord(wrapper.record as never);
    if (JSON.stringify(expected) !== JSON.stringify(wrapper))
      return { status: "invalid" as const, reason: "invalidExecutionHistoryRecord" };
    records.push(cloneExecutionRecord(wrapper.record as never));
  }
  const envelope = createExecutionHistoryEnvelope(records as never[], value.quarantine as never[]);
  const translated = buildExecutionHistoryRuntimeTarget(envelope);
  if (translated.status === "invalid") return translated;
  const translatedEnvelope = createExecutionHistoryEnvelope(
    translated.target.records,
    translated.target.quarantine,
  );
  if (JSON.stringify(translatedEnvelope) !== JSON.stringify(envelope))
    return { status: "invalid" as const, reason: "invalidExecutionHistoryAuthority" };
  if (
    value.metadata.length !== 1 ||
    !validExecutionMetadata(
      value.metadata[0],
      envelope.records.length,
      envelope.quarantinedComponents.length,
    )
  )
    return { status: "invalid" as const, reason: "invalidExecutionHistoryMetadata" };
  return {
    status: "valid" as const,
    durable: structuredClone(value) as ExecutionHistoryDurableRestorePayload,
    target: translated.target,
  };
}

export function translateHistoricalPlanRestorePayload(value: unknown) {
  const translated = buildHistoricalPlanRuntimeTarget(value);
  return translated.status === "valid"
    ? {
        status: "valid" as const,
        durable: structuredClone(value) as HistoricalPlanDurableRestorePayload,
        target: structuredClone(translated.target),
      }
    : translated;
}
export function translateGoalRestorePayload(value: unknown) {
  const checked = validateGoalAuthority(value);
  return checked.status === "valid"
    ? {
        status: "valid" as const,
        durable: checked.authority,
        target: {
          authority: checked.authority,
          desired: checked.authority,
          ingress: { status: "accepted" as const },
          durability: "durable" as const,
        },
      }
    : { status: "invalid" as const, reason: "invalidGoals" };
}
export function translateMeasurementDefinitionRestorePayload(value: unknown) {
  const checked = validateMeasurementDefinitionAuthority(value);
  return checked.status === "valid"
    ? {
        status: "valid" as const,
        durable: checked.authority,
        target: {
          authority: checked.authority,
          desired: checked.authority,
          ingress: { status: "accepted" as const },
          durability: "durable" as const,
        },
      }
    : { status: "invalid" as const, reason: "invalidMeasurementDefinitions" };
}
export function translateProgressObservationRestorePayload(value: unknown) {
  const checked = validateProgressObservationAuthority(value);
  return checked.status === "valid"
    ? {
        status: "valid" as const,
        durable: checked.authority,
        target: {
          authority: checked.authority,
          desired: checked.authority,
          ingress: { status: "accepted" as const },
          durability: "durable" as const,
        },
      }
    : { status: "invalid" as const, reason: "invalidProgressObservations" };
}
export function translateGoalStructureRestorePayload(value: unknown) {
  const checked = validateGoalStructureAuthority(value);
  return checked.status === "valid"
    ? {
        status: "valid" as const,
        durable: checked.authority,
        target: {
          authority: checked.authority,
          desired: checked.authority,
          ingress: { status: "accepted" as const },
          durability: "durable" as const,
        },
      }
    : { status: "invalid" as const, reason: "invalidGoalStructure" };
}
export function translateGoalPlanningRestorePayload(value: unknown) {
  const valid =
    record(value) &&
    value.version === 1 &&
    Array.isArray(value.demands) &&
    Array.isArray(value.priorities);
  return valid
    ? {
        status: "valid" as const,
        durable: structuredClone(value) as GoalPlanningAuthorityV1,
        target: {
          authority: structuredClone(value) as GoalPlanningAuthorityV1,
          desired: structuredClone(value) as GoalPlanningAuthorityV1,
          ingress: { status: "accepted" as const },
          durability: "durable" as const,
        },
      }
    : { status: "invalid" as const, reason: "invalidGoalPlanning" };
}

export function translateCompositionRestorePayload(value: unknown) {
  const valid =
    record(value) &&
    value.version === 1 &&
    Array.isArray(value.relationships) &&
    Array.isArray(value.decisions);
  return valid
    ? {
        status: "valid" as const,
        durable: structuredClone(value) as CompositionAuthorityV1,
        target: {
          authority: structuredClone(value) as CompositionAuthorityV1,
          desired: structuredClone(value) as CompositionAuthorityV1,
          ingress: { status: "accepted" as const },
          durability: "durable" as const,
        },
      }
    : { status: "invalid" as const, reason: "invalidComposition" };
}

export const restoreTranslators = {
  active: translateActiveRestorePayload,
  profiles: translateProfilesRestorePayload,
  planDecisions: translatePlanDecisionRestorePayload,
  executionHistory: translateExecutionHistoryRestorePayload,
  historicalPlan: translateHistoricalPlanRestorePayload,
  goals: translateGoalRestorePayload,
  measurementDefinitions: translateMeasurementDefinitionRestorePayload,
  progressObservations: translateProgressObservationRestorePayload,
  goalStructure: translateGoalStructureRestorePayload,
  goalPlanning: translateGoalPlanningRestorePayload,
  composition: translateCompositionRestorePayload,
};

function validExecutionMetadata(
  value: unknown,
  records: number,
  quarantine: number,
): value is ExecutionHistoryMetadata {
  return (
    record(value) &&
    exact(value, [
      "surface",
      "version",
      "authorityState",
      "legacyFingerprint",
      "recordCount",
      "quarantineCount",
    ]) &&
    value.surface === EXECUTION_HISTORY_METADATA_KEY &&
    value.version === 1 &&
    value.authorityState === "established" &&
    typeof value.legacyFingerprint === "string" &&
    value.recordCount === records &&
    value.quarantineCount === quarantine
  );
}
function exact(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).length === keys.length && keys.every((key) => key in value);
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
